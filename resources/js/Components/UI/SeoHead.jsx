import { Head, usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function SeoHead({
    title,
    description,
    keywords,
    ogImage,
    ogType = 'website',
    canonical,
    pageKey,
    jsonLd,
    hreflang,
}) {
    const { locale, seo_pages, appUrl } = usePage().props
    const { url } = usePage()
    const trans = useTrans(locale)
    const siteName = trans('site_title')
    const isRtl = locale === 'ar'

    const cleanPath = url.split('?')[0];
    const pathWithoutLocale = cleanPath.replace(/^\/(ar|en)(\/|$)/, '/');
    const baseUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    
    // Auto detect pageKey from path if not provided
    const routeToKeyMap = {
        '/': 'home',
        '/about': 'about',
        '/contact': 'contact',
        '/units': 'units_index',
        '/projects': 'projects_index',
        '/deals': 'deals',
        '/articles': 'articles_index',
        '/comparison': 'comparison',
    };
    const activeKey = pageKey || routeToKeyMap[pathWithoutLocale] || null;
    const pageSeo = activeKey && seo_pages?.[activeKey] ? seo_pages[activeKey] : null;

    const finalTitle = pageSeo ? (isRtl ? (pageSeo.meta_title_ar || title) : (pageSeo.meta_title_en || title)) : title;
    const finalDescription = pageSeo ? (isRtl ? (pageSeo.meta_description_ar || description) : (pageSeo.meta_description_en || description)) : description;
    const finalKeywords = pageSeo ? (
        isRtl
            ? (Array.isArray(pageSeo.meta_keywords_ar) && pageSeo.meta_keywords_ar.length > 0 ? pageSeo.meta_keywords_ar.join(', ') : keywords)
            : (Array.isArray(pageSeo.meta_keywords_en) && pageSeo.meta_keywords_en.length > 0 ? pageSeo.meta_keywords_en.join(', ') : keywords)
    ) : keywords;

    // Clean canonical URL without query string
    const rawCanonical = canonical || (baseUrl ? `${baseUrl}${cleanPath}` : cleanPath);
    const finalCanonical = rawCanonical.split('?')[0];

    const urlAr = hreflang?.ar || (baseUrl + (pathWithoutLocale === '/' ? '/ar' : `/ar${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`));
    const urlEn = hreflang?.en || (baseUrl + (pathWithoutLocale === '/' ? '/en' : `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`));

    return (
        <Head>
            {finalTitle && <title>{finalTitle}</title>}
            {finalDescription && <meta name="description" content={finalDescription} />}
            {finalKeywords && <meta name="keywords" content={finalKeywords} />}

            {/* Open Graph */}
            {finalTitle && <meta property="og:title" content={finalTitle} />}
            {finalDescription && <meta property="og:description" content={finalDescription} />}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={siteName} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta property="og:url" content={finalCanonical} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            {finalTitle && <meta name="twitter:title" content={finalTitle} />}
            {finalDescription && <meta name="twitter:description" content={finalDescription} />}
            {ogImage && <meta name="twitter:image" content={ogImage} />}

            {/* Canonical */}
            <link rel="canonical" href={finalCanonical} />
            
            {/* Hreflang */}
            <link rel="alternate" hreflang="ar" href={urlAr} />
            <link rel="alternate" hreflang="en" href={urlEn} />
            <link rel="alternate" hreflang="x-default" href={urlAr} />

            {/* Structured Data (Schema.org) */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    )
}
