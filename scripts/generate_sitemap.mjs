import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve('.env.local');
let envFile = '';
try {
    envFile = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
    console.warn('.env.local not found, relying on process.env');
}

const env = { ...process.env };
if (envFile) {
    envFile.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w]+)\s*=\s*["']?([^"']*)["']?/);
        if (match) env[match[1]] = match[2];
    });
}

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://bouncyhachi.com';
const LANGUAGES = ['ko', 'en'];

// Static routes
const staticRoutes = [
    '/',
    '/tools',
    '/arcade',
    '/fortune',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
];

async function generateSitemap() {
    console.log('Generating sitemap...');
    let lastMod = new Date().toISOString().split('T')[0];

    let urls = [];

    // Add static routes
    for (const route of staticRoutes) {
        // Base route
        urls.push({ loc: `${BASE_URL}${route}`, changefreq: 'weekly', priority: route === '/' ? 1.0 : 0.8 });
        
        // Language specific routes
        for (const lang of LANGUAGES) {
            const langRoute = route === '/' ? `/${lang}` : `/${lang}${route}`;
            urls.push({ loc: `${BASE_URL}${langRoute}`, changefreq: 'weekly', priority: route === '/' ? 1.0 : 0.8 });
        }
    }

    try {
        const q = query(collection(db, 'items'));
        const snap = await getDocs(q);
        console.log(`Found ${snap.size} documents in 'items' collection.`);

        snap.forEach(doc => {
            const data = doc.data();
            const id = doc.id;
            const postDate = data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : lastMod;
            const route = `/post/${id}`;
            
            // Base route
            urls.push({ loc: `${BASE_URL}${route}`, changefreq: 'monthly', priority: 0.7, lastmod: postDate });
            
            // Language specific routes
            for (const lang of LANGUAGES) {
                urls.push({ loc: `${BASE_URL}/${lang}${route}`, changefreq: 'monthly', priority: 0.7, lastmod: postDate });
            }
        });
    } catch (err) {
        console.error("Error fetching documents:", err);
    }

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const url of urls) {
        xml += `  <url>\n`;
        xml += `    <loc>${url.loc}</loc>\n`;
        if (url.lastmod || lastMod) {
            xml += `    <lastmod>${url.lastmod || lastMod}</lastmod>\n`;
        }
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    const outputPath = path.resolve('public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf-8');
    console.log(`Successfully generated sitemap.xml at ${outputPath} with ${urls.length} URLs.`);
    process.exit(0);
}

generateSitemap();
