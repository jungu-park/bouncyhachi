import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    type?: string;
    name?: string;
    schema?: Record<string, any>;
}

const LANGUAGES = ['ko', 'en'] as const;
const BASE_URL = 'https://bouncyhachi.com';

export default function SEO({ title, description, type = 'website', name = 'BouncyHachi', schema }: SEOProps) {
    const location = useLocation();

    // Get the base path without the /ko or /en prefix
    const pathWithoutLang = location.pathname.replace(/^\/(en|ko)/, '') || '';
    const cleanPath = pathWithoutLang === '/' ? '' : pathWithoutLang;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={`${BASE_URL}${location.pathname}`} />

            {/* SEO: Localization (hreflang) */}
            {LANGUAGES.map((lang) => (
                <link
                    key={lang}
                    rel="alternate"
                    href={`${BASE_URL}/${lang}${cleanPath}`}
                    hrefLang={lang}
                />
            ))}
            <link
                rel="alternate"
                href={`${BASE_URL}/ko${cleanPath}`}
                hrefLang="x-default"
            />
            {/* End standard metadata tags */}

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* End Twitter tags */}

            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
