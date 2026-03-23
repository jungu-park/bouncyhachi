/**
 * Cloudflare Worker: Google Docs to HTML with High Fidelity (Fonts, Colors, Alignment)
 * 
 * Securely fetches a Google Doc, converts it to clean HTML with inline styles,
 * extracts images, uploads them to Cloudflare R2, and replaces src URLs.
 */

export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        const url = new URL(request.url);

        // --- NEW: Proxy images from R2 ---
        if (request.method === 'GET' && url.pathname.endsWith('/image')) {
            const name = url.searchParams.get('name');
            if (!name) return new Response('Missing name', { status: 400 });

            console.log(`[Proxy] Fetching ${name} from R2...`);
            const object = await env.BUCKET.get(name);
            if (!object) {
                console.error(`[Proxy] ${name} not found in BUCKET.`);
                return new Response('Not Found', { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('etag', object.httpEtag);
            headers.set('Cache-Control', 'public, max-age=31536000');

            return new Response(object.body, { headers });
        }

        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', {
                status: 405,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }

        try {
            const { docId } = await request.json();
            if (!docId) throw new Error('Missing docId');

            // 1. Get Google Access Token
            const accessToken = await getGoogleAccessToken(env);

            // 2. Fetch Google Doc JSON
            const docResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!docResponse.ok) {
                const err = await docResponse.text();
                throw new Error(`Google API Error: ${err}`);
            }

            const docJson = await docResponse.json();
            console.log(`Processing document: ${docJson.title} (${docId})`);

            // 3. Process Images (Extract and Upload to R2)
            console.log('Starting image processing...');
            const workerOrigin = new URL(request.url).origin;
            const { imageMap, firstImageUrl } = await processImages(docJson, env, accessToken, workerOrigin);
            console.log(`Image processing complete. Found ${imageMap.size} images.`);

            // 4. Convert to HTML with Styles
            const { html } = convertGDocsToHtml(docJson, imageMap);

            return new Response(JSON.stringify({ html, title: docJson.title, firstImageUrl }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (err) {
            console.error('Worker Error:', err.message);
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
    },
};

/**
 * Google Auth Helper (JWT for Service Account)
 */
async function getGoogleAccessToken(env) {
    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = env;

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error('Server misconfigured: Missing Google credentials');
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        sub: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        aud: 'https://oauth2.googleapis.com/token',
        iat: iat,
        exp: exp,
        scope: 'https://www.googleapis.com/auth/documents.readonly',
    };

    const encodedHeader = b64(JSON.stringify(header));
    const encodedPayload = b64(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const privateKey = await importPrivateKey(GOOGLE_PRIVATE_KEY);
    const signature = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        privateKey,
        new TextEncoder().encode(unsignedToken)
    );

    const signedToken = `${unsignedToken}.${b64(signature)}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedToken}`,
    });

    const data = await res.json();
    if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
    return data.access_token;
}

/**
 * Image Processing: Fetch from Docs contentUri and upload to R2
 */
async function processImages(docJson, env, accessToken, workerOrigin) {
    const { BUCKET } = env;
    const imageMap = new Map();
    let firstImageUrl = null;

    const inlineObjects = docJson.inlineObjects || {};
    const positionedObjects = docJson.positionedObjects || {};

    // Combine both sets of objects to process all images
    const allObjects = [
        ...Object.entries(inlineObjects).map(([id, obj]) => ({ id, obj, type: 'inline' })),
        ...Object.entries(positionedObjects).map(([id, obj]) => ({ id, obj, type: 'positioned' }))
    ];

    if (allObjects.length > 0) {
        console.log(`[Image] Found ${allObjects.length} total objects to process.`);
    }

    for (const { id, obj, type } of allObjects) {
        const contentUri = type === 'inline'
            ? obj.inlineObjectProperties?.embeddedObject?.imageProperties?.contentUri
            : obj.positionedObjectProperties?.embeddedObject?.imageProperties?.contentUri;

        if (contentUri) {
            console.log(`[Image] Processing ${type} object ${id}...`);
            try {
                // IMPORTANT: contentUri is a temporary signed URL. 
                // DO NOT send Authorization header, it causes 401/403/404 errors.
                const imageRes = await fetch(contentUri, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                if (!imageRes.ok) {
                    console.error(`[Image] ${id} fetch failed: ${imageRes.status} ${imageRes.statusText}. URI: ${contentUri.substring(0, 100)}...`);
                    continue;
                }

                const buffer = await imageRes.arrayBuffer();
                const contentType = imageRes.headers.get('content-type') || 'image/png';
                const rawExt = contentType.split('/')[1]?.split(';')[0] || 'png';
                const ext = rawExt.replace('jpeg', 'jpg'); // Normalize extension
                const filename = `gdoc-${Date.now()}-${id}.${ext}`;

                console.log(`[R2] Uploading ${id} to bucket as ${filename}... (${buffer.byteLength} bytes). Type: ${contentType}`);
                await env.BUCKET.put(filename, buffer, {
                    httpMetadata: { contentType },
                });

                // Use R2 public URL if available (env.R2_PUBLIC_URL), otherwise fall back to worker proxy
                const r2PublicBase = env.R2_PUBLIC_URL ? env.R2_PUBLIC_URL.replace(/\/$/, '') : null;
                const publicUrl = r2PublicBase
                    ? `${r2PublicBase}/${filename}`
                    : `${workerOrigin.replace(/\/$/, '')}/image?name=${filename}`;
                console.log(`[R2] SUCCESS for ${id}! URL: ${publicUrl}`);
                imageMap.set(id, publicUrl);

                if (!firstImageUrl) {
                    firstImageUrl = publicUrl;
                }
            } catch (err) {
                console.error(`[Image] CRITICAL ERROR for ${id}:`, err.message, err.stack);
            }
        }
    }
    return { imageMap, firstImageUrl };
}

/**
 * Conversion Logic: High Fidelity
 */
function convertGDocsToHtml(docJson, imageMap) {
    let html = '';
    const bodyContent = docJson.body.content;
    const lists = docJson.lists || {};

    let listStack = []; // { listId, level, tag }

    const closeAllLists = () => {
        while (listStack.length > 0) {
            const popped = listStack.pop();
            html += `</${popped.tag}>`;
        }
    };

    const updateLists = (bullet) => {
        if (!bullet) {
            closeAllLists();
            return;
        }

        const listId = bullet.listId;
        const level = bullet.nestingLevel || 0;
        const listData = lists[listId];
        const glyphType = listData?.listProperties?.nestingLevels?.[level]?.glyphType;
        const tag = (glyphType && !['BULLET', 'GLYPH_TYPE_UNSPECIFIED'].includes(glyphType)) ? 'ol' : 'ul';

        // Check current stack
        let top = listStack[listStack.length - 1];

        if (!top) {
            // New list
            listStack.push({ listId, level, tag });
            html += `<${tag} style="margin-bottom: 1rem; padding-left: 2rem;">`;
        } else if (top.listId !== listId || top.level !== level) {
            if (level > top.level) {
                // Nested level
                listStack.push({ listId, level, tag });
                html += `<${tag} style="padding-left: 1.5rem;">`;
            } else if (level < top.level) {
                // Un-nesting
                while (listStack.length > 0 && listStack[listStack.length - 1].level > level) {
                    const popped = listStack.pop();
                    html += `</${popped.tag}>`;
                }
                // Check if current level matches the target list/tag
                top = listStack[listStack.length - 1];
                if (!top || top.listId !== listId || top.tag !== tag) {
                    if (top) html += `</${listStack.pop().tag}>`;
                    listStack.push({ listId, level, tag });
                    html += `<${tag} style="padding-left: 1.5rem;">`;
                }
            } else {
                // Same level but different listId or tag
                html += `</${listStack.pop().tag}>`;
                listStack.push({ listId, level, tag });
                html += `<${tag} style="padding-left: 1.5rem;">`;
            }
        }
    };

    let firstParagraph = true;

    for (const element of bodyContent) {
        if (element.paragraph) {
            const paragraph = element.paragraph;
            const style = paragraph.paragraphStyle?.namedStyleType;
            const text = paragraph.elements.map(el => el.textRun?.content || '').join('').trim();
            const hasImage = paragraph.elements.some(el => !!el.inlineObjectElement) || !!paragraph.positionedObjectIds;

            if (!text && !paragraph.bullet && !hasImage) continue;

            const bullet = paragraph.bullet;

            updateLists(bullet);

            let tag = 'p';
            if (style === 'TITLE') {
                tag = 'h2'; // Demote title to h2 if it wasn't skipped
            } else if (style?.startsWith('HEADING_')) {
                const level = parseInt(style.split('_')[1]);
                tag = `h${Math.min(level + 1, 6)}`; // Demote: h1 -> h2, h2 -> h3, etc.
            } else if (bullet) {
                tag = 'li';
            }

            // Paragraph Styles (Alignment)
            const pStyles = getParagraphStyles(paragraph.paragraphStyle);
            const pAttr = pStyles ? ` style="${pStyles}"` : '';

            let innerHtml = '';

            // Handle positioned objects (images placed around text)
            if (paragraph.positionedObjectIds) {
                for (const posId of paragraph.positionedObjectIds) {
                    const r2Url = imageMap.get(posId);
                    if (r2Url) {
                        innerHtml += `<img src="${r2Url}" alt="Google Doc Image" />`;
                    }
                }
            }

            for (const el of paragraph.elements) {
                if (el.textRun) {
                    let content = el.textRun.content;
                    const ts = el.textRun.textStyle;

                    // Escape HTML
                    content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');

                    const textStyles = getTextStyle(ts);
                    const styledContent = textStyles ? `<span style="${textStyles}">${content}</span>` : content;

                    if (ts?.link) {
                        innerHtml += `<a href="${ts.link.url}" target="_blank" style="text-decoration: underline; color: #1a73e8;">${styledContent}</a>`;
                    } else {
                        innerHtml += styledContent;
                    }
                } else if (el.inlineObjectElement) {
                    const objId = el.inlineObjectElement.inlineObjectId;
                    const r2Url = imageMap.get(objId);
                    if (r2Url) {
                        innerHtml += `<img src="${r2Url}" alt="Google Doc Image" />`;
                    }
                }
            }

            if (innerHtml.trim() || tag.startsWith('h')) {
                // Remove trailing <br/> for list items and headings
                if (tag === 'li' || tag.startsWith('h')) innerHtml = innerHtml.replace(/(<br\/>)+$/, '');
                html += `<${tag}${pAttr}>${innerHtml}</${tag}>\n`;
            }
        } else if (element.table) {
            closeAllLists();
            html += `<div style="overflow-x: auto; margin:1rem 0;"><table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">`;
            for (const row of element.table.tableRows) {
                html += `<tr>`;
                for (const cell of row.tableCells) {
                    html += `<td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">`;
                    html += convertGDocsToHtml({ body: { content: cell.content }, lists }, imageMap).html;
                    html += `</td>`;
                }
                html += `</tr>`;
            }
            html += `</table></div>`;
        }
    }

    closeAllLists();
    return { html };
}

function getTextStyle(ts) {
    if (!ts) return '';
    const styles = [];
    if (ts.bold) styles.push('font-weight: bold');
    if (ts.italic) styles.push('font-style: italic');
    if (ts.underline) styles.push('text-decoration: underline');
    if (ts.strikethrough) styles.push('text-decoration: line-through');

    // Normalize font sizes: ignore if close to default (9-13pt) to allow theme to take over
    if (ts.fontSize) {
        const size = ts.fontSize.magnitude;
        if (size < 9 || size > 13) {
            styles.push(`font-size: ${size}${ts.fontSize.unit === 'PT' ? 'pt' : ts.fontSize.unit.toLowerCase()}`);
        }
    }

    if (ts.foregroundColor) {
        const color = parseColor(ts.foregroundColor);
        if (color) styles.push(`color: ${color}`);
    }

    if (ts.backgroundColor) {
        const color = parseColor(ts.backgroundColor);
        if (color) styles.push(`background-color: ${color}`);
    }

    return styles.join('; ');
}

function getParagraphStyles(ps) {
    if (!ps) return '';
    const styles = [];
    if (ps.alignment) {
        const map = { 'START': 'left', 'CENTER': 'center', 'END': 'right', 'JUSTIFIED': 'justify' };
        styles.push(`text-align: ${map[ps.alignment] || 'left'}`);
    }

    // We intentionally ignore spacingMode, lineSpacing, and indents to keep the 
    // blog post layout standardized and clean across all imports.

    return styles.join('; ');
}

function parseColor(colorObj) {
    const color = colorObj.color?.rgbColor;
    if (!color) return null;
    const r = Math.round((color.red || 0) * 255);
    const g = Math.round((color.green || 0) * 255);
    const b = Math.round((color.blue || 0) * 255);

    // If text is pure black or very close to black, we ignore the color style
    // so it can adapt to light/dark modes correctly.
    if (r < 10 && g < 10 && b < 10) {
        return null;
    }

    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Utils
 */
function b64(input) {
    const binary = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    return btoa(String.fromCharCode(...binary))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function importPrivateKey(pem) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem
        .replace(pemHeader, "")
        .replace(pemFooter, "")
        .replace(/\\n/g, "")
        .replace(/\s/g, "");
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    return crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );
}
