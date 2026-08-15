import { Head, usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function SeoHead({
    title,
    description,
    ogImage,
    ogType = 'website',
    canonical,
    jsonLd,
    hreflang,
    robots,
}) {
    const { locale, seo_page, appUrl, seo_meta } = usePage().props
    const { url } = usePage()
    const trans = useTrans(locale)
    const siteName = trans('site_title')
    const isRtl = locale === 'ar'

    const cleanPath = (typeof url === 'string' ? url : '/').split('?')[0];
    const pathWithoutLocale = cleanPath.replace(/^\/(ar|en)(\/|$)/, '/');
    const baseUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : '');

    const pageSeo = seo_page || null;

    const cleanMetaDescription = (text) => {
        if (!text) return '';
        let clean = String(text)
            .replace(/<\/?[^>]+(>|$)/g, '')
            .replace(/\*{1,3}([^*]*)\*{1,3}/g, '$1')
            .replace(/#{1,6}\s*/g, '')
            .replace(/^[\s\-\*\+]\s+/gm, '')
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/`{1,3}[^`]*`{1,3}/g, '')
            .replace(/_{1,2}([^_]*)_{1,2}/g, '$1')
            .replace(/[\r\n]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return clean.length > 160 ? clean.substring(0, 157) + '...' : clean;
    };

    const finalTitle = pageSeo ? (isRtl ? (pageSeo.meta_title_ar || title) : (pageSeo.meta_title_en || title)) : (seo_meta?.title || title);
    const rawDescription = pageSeo ? (isRtl ? (pageSeo.meta_description_ar || description) : (pageSeo.meta_description_en || description)) : (seo_meta?.description || description);
    const finalDescription = cleanMetaDescription(rawDescription);

    const hasFilterQuery = typeof url === 'string' && url.includes('?') && /[?&](price_|size_|features|transaction|search|finishing_type|payment_method)/.test(url);
    const finalRobots = robots || seo_meta?.robots || (hasFilterQuery ? 'noindex, follow' : null);

    // Clean canonical URL without query string
    const rawCanonical = canonical || seo_meta?.canonical || (baseUrl ? `${baseUrl}${cleanPath}` : cleanPath);
    const finalCanonical = rawCanonical.split('?')[0];

    const urlAr = hreflang?.ar || seo_meta?.hreflang?.ar || (baseUrl + (pathWithoutLocale === '/' ? '/ar' : `/ar${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`));
    const urlEn = hreflang?.en || seo_meta?.hreflang?.en || (baseUrl + (pathWithoutLocale === '/' ? '/en' : `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`));

    // Resolve full absolute URL for social media image
    let finalOgImage = ogImage;
    if (finalOgImage) {
        if (!finalOgImage.startsWith('http://') && !finalOgImage.startsWith('https://')) {
            const cleanImgPath = finalOgImage.startsWith('/') ? finalOgImage : `/${finalOgImage}`;
            finalOgImage = baseUrl ? `${baseUrl}${cleanImgPath}` : cleanImgPath;
        }
    }

    return (
        <Head>
            {finalTitle && <title>{finalTitle}</title>}
            {finalRobots && <meta head-key="robots" name="robots" content={finalRobots} />}
            {finalDescription && <meta head-key="description" name="description" content={finalDescription} />}

            {/* Open Graph */}
            {finalTitle && <meta head-key="og:title" property="og:title" content={finalTitle} />}
            {finalDescription && <meta head-key="og:description" property="og:description" content={finalDescription} />}
            <meta head-key="og:type" property="og:type" content={ogType} />
            <meta head-key="og:site_name" property="og:site_name" content={siteName} />
            {finalOgImage && <meta head-key="og:image" property="og:image" content={finalOgImage} />}
            {finalOgImage && <meta head-key="og:image:secure_url" property="og:image:secure_url" content={finalOgImage} />}
            <meta head-key="og:url" property="og:url" content={finalCanonical} />

            {/* Twitter Card */}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            {finalTitle && <meta head-key="twitter:title" name="twitter:title" content={finalTitle} />}
            {finalDescription && <meta head-key="twitter:description" name="twitter:description" content={finalDescription} />}
            {finalOgImage && <meta head-key="twitter:image" name="twitter:image" content={finalOgImage} />}

            {/* Canonical */}
            <link head-key="canonical" rel="canonical" href={finalCanonical} />
            
            {/* Hreflang */}
            <link head-key="hreflang-ar" rel="alternate" hreflang="ar" href={urlAr} />
            <link head-key="hreflang-en" rel="alternate" hreflang="en" href={urlEn} />
            <link head-key="hreflang-x-default" rel="alternate" hreflang="x-default" href={urlAr} />

            {/* Structured Data (Schema.org) */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    )
}
