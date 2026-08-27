/**
 * THESIS: The Article Display page is a pure, distraction-free editorial view.
 *         All non-essential marketing popups and sidebar widgets are removed to focus 100% on reading comfort.
 * OWN-WORLD: Clean white canvas, Cairo typography, comfortable reading line length (max-w-3xl), high-contrast headers.
 * FIRST VIEWPORT: Breadcrumb → Title → Author & Reading Time → Full-width Hero cover.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.
 */

import { localizedPath } from '../../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SeoHead from '../../../Components/UI/SeoHead'
import ArticleCard from '../../../Components/UI/ArticleCard'
import { WhatsAppIcon } from '../../../Components/UI'
import { useState, useMemo } from 'react'

export default function ArticleShow({ article, relatedArticles, suggestedUnits }) {
    const { locale, appUrl } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [copied, setCopied] = useState(false)
    const [lightboxUrl, setLightboxUrl] = useState(null)

    const headerImage = article?.images?.find(img => img.position === 'header') || article?.images?.[0]
    const topImages = article?.images?.filter(img => img.position === 'top') || []
    const middleImages = article?.images?.filter(img => img.position === 'middle') || []
    const bottomImages = article?.images?.filter(img => img.position === 'bottom') || []

    const headerImgUrl = headerImage?.url || (headerImage?.path ? (headerImage.path.startsWith('http') || headerImage.path.startsWith('/') ? headerImage.path : `/storage/${headerImage.path}`) : null)
    const categoryName = article?.category ? (isRtl ? article.category.name_ar : article.category.name_en) : null

    const formattedDate = article?.published_at
        ? new Date(article.published_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : ''

    /* Estimated Reading Time (approx 200 words/min) */
    const readingTimeMin = useMemo(() => {
        if (!article?.content) return 1
        const cleanText = article.content.replace(/<[^>]*>/g, '').trim()
        const wordCount = cleanText ? cleanText.split(/\s+/).length : 0
        return Math.max(1, Math.ceil(wordCount / 200))
    }, [article?.content])

    const jsonLd = useMemo(() => {
        if (!article) return null
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            ...(article.title ? { headline: article.title } : {}),
            ...((article.excerpt || article.meta_description) ? { description: article.excerpt || article.meta_description } : {}),
            ...(headerImgUrl ? { image: headerImgUrl } : {}),
            ...(article.published_at ? { datePublished: article.published_at } : {}),
            ...(article.updated_at ? { dateModified: article.updated_at } : {}),
            author: {
                '@type': 'Organization',
                name: 'Family Home',
            },
        }
    }, [article, headerImgUrl])

    function handleCopyLink() {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    const { normalizedContent, unusedMiddleImages } = useMemo(() => {
        if (!article?.content) {
            return { normalizedContent: '', unusedMiddleImages: middleImages }
        }

        /* Process middle image shortcodes and inline images */
        let parsedContent = article.content || ''
        const usedMiddleIndices = new Set()

        const middleAndOtherImages = [
            ...middleImages,
            ...(article?.images || []).filter(img => img.position !== 'header' && !middleImages.some(m => m.id === img.id))
        ]

        // Matches shortcodes like [صورة:1], [صوره:1], [صره:1], [image:1], [img:1]
        // Even if wrapped in <p>, <span>, <code>, <strong>, <font> with inline styles/colors
        const shortcodeRegex = /(?:<p[^>]*>\s*)?(?:<(?:span|code|strong|b|em|font|mark)\b[^>]*>\s*)*\[\s*(?:صورة|صوره|صره|image|img)\s*[:\-_\s]?\s*([0-9\u0660-\u0669]+)\s*\](?:\s*<\/(?:span|code|strong|b|em|font|mark)>)*(?:\s*<\/p>)?/gi

        parsedContent = parsedContent.replace(shortcodeRegex, (match, rawIndex) => {
            const normalizedIndex = parseInt(
                rawIndex.replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660)),
                10
            )
            const targetImg = middleImages[normalizedIndex - 1] || middleAndOtherImages[normalizedIndex - 1]

            if (targetImg) {
                usedMiddleIndices.add(normalizedIndex - 1)
                const imgPath = targetImg.url || (targetImg.path ? (targetImg.path.startsWith('http') || targetImg.path.startsWith('/') ? targetImg.path : `/storage/${targetImg.path}`) : '')
                const altText = (targetImg.alt_text || article.title || '').replace(/"/g, '&quot;')
                let imageHtml = `<figure class="my-8"><img src="${imgPath}" alt="${altText}" width="1200" height="800" class="w-full h-auto rounded-2xl border border-secondary-200/60 object-cover shadow-sm" loading="lazy" /></figure>`
                if (targetImg.link_url) {
                    let safeLink = targetImg.link_url.trim()
                    if (!/^(https?:|\/|#|mailto:|tel:)/i.test(safeLink)) {
                        safeLink = 'https://' + safeLink
                    }
                    const isExternal = /^https?:\/\//i.test(safeLink)
                    const safeLinkAttr = safeLink.replace(/"/g, '&quot;')
                    imageHtml = `<figure class="my-8"><a href="${safeLinkAttr}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="block hover:opacity-95 transition-opacity"><img src="${imgPath}" alt="${altText}" width="1200" height="800" class="w-full h-auto rounded-2xl border border-secondary-200/60 object-cover shadow-sm" loading="lazy" /></a></figure>`
                }
                return imageHtml
            }
            return match
        })

        const unused = middleImages.filter((_, idx) => !usedMiddleIndices.has(idx))

        // Ensure all inline <img> tags resolve to proper /storage/ paths if saved with relative path
        parsedContent = parsedContent.replace(/<img\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>/gi, (match, prefix, src, suffix) => {
            let resolvedSrc = src;
            if (src.startsWith('articles/') || src.startsWith('editor/') || src.startsWith('uploads/')) {
                resolvedSrc = `/storage/${src}`;
            } else if (src.startsWith('storage/')) {
                resolvedSrc = `/${src}`;
            }
            return `<img${prefix}src="${resolvedSrc}"${suffix}>`;
        });

        /* Normalize article body headings so they strictly follow h1 -> h2 -> h3 hierarchy */
        let normalized = parsedContent;
        normalized = normalized.replace(/<(\/?)h1\b([^>]*)>/gi, '<$1h2$2>');
        if (!/<h2\b/i.test(normalized) && /<h3\b/i.test(normalized)) {
            normalized = normalized
                .replace(/<(\/?)h5\b([^>]*)>/gi, '<$1h6$2>')
                .replace(/<(\/?)h4\b([^>]*)>/gi, '<$1h5$2>')
                .replace(/<(\/?)h3\b([^>]*)>/gi, '<$1h2$2>');
        }

        // Ensure all inline <a> tags resolve properly and external links open in new tabs securely
        normalized = normalized.replace(/<a\b([^>]*)\bhref=["']([^"']+)["']([^>]*)>/gi, (match, prefix, href, suffix) => {
            let cleanHref = href.trim();
            if (cleanHref.startsWith('www.')) {
                cleanHref = 'https://' + cleanHref;
            }
            const isExternal = /^https?:\/\//i.test(cleanHref);
            const hasTarget = /target=/i.test(match);
            const hasRel = /rel=/i.test(match);

            let extra = '';
            if (isExternal && !hasTarget) extra += ' target="_blank"';
            if (isExternal && !hasRel) extra += ' rel="noopener noreferrer"';

            return `<a${prefix}href="${cleanHref}"${suffix}${extra}>`;
        });

        return { normalizedContent: normalized, unusedMiddleImages: unused }
    }, [article?.content, article?.images, middleImages, article?.title])

    if (!article) {
        return (
            <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20 text-center">
                    <div>
                        <p className="text-secondary-600 font-semibold text-base mb-4">{trans('no_results')}</p>
                        <Link href={localizedPath('/articles', locale)} className="px-5 py-2.5 bg-primary-900 text-white rounded-xl text-xs font-bold">
                            {trans('back_to_articles')}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const currentUrl = typeof window !== 'undefined' ? window.location.href : appUrl
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}\n${currentUrl}`)}`

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white flex flex-col font-sans">
            <SeoHead
                title={`${article?.title || ''} - ${trans('site_title')}`}
                description={article?.meta_description || article?.excerpt || ''}
                keywords={isRtl ? (article?.keywords_ar || article?.keywords) : (article?.keywords_en || article?.keywords || article?.keywords_ar)}
                ogImage={headerImgUrl}
                ogType="article"
                jsonLd={jsonLd}
            />
            <Header />

            <main id="main-content" tabIndex="-1" className="flex-1 w-full py-8 sm:py-14 bg-white focus:outline-none">
                
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                        
                        {/* ── Right Column: Article Content ──── */}
                        <article className="lg:col-span-9 w-full">
                    
                    {/* Breadcrumb Navigation */}
                    <nav className="flex items-center gap-2 text-xs font-semibold text-secondary-700 mb-6" aria-label="Breadcrumb">
                        <Link href={localizedPath('/', locale)} className="hover:text-primary-900 transition-colors">
                            {trans('home')}
                        </Link>
                        <span>/</span>
                        <Link href={localizedPath('/articles', locale)} className="hover:text-primary-900 transition-colors">
                            {trans('articles') || (trans('articles'))}
                        </Link>
                        {categoryName && (
                            <>
                                <span>/</span>
                                <span className="text-secondary-900 font-bold">{categoryName}</span>
                            </>
                        )}
                    </nav>

                    {/* Meta Badge */}
                    <div className="flex items-center gap-3 flex-wrap text-xs text-secondary-700 mb-4">
                        {categoryName && (
                            <span className="font-bold text-primary-900 bg-primary-50 px-3 py-1 rounded-xl border border-primary-200">
                                {categoryName}
                            </span>
                        )}
                        {formattedDate && (
                            <span className="font-semibold text-secondary-700">{formattedDate}</span>
                        )}
                        <span>•</span>
                        <span className="font-semibold flex items-center gap-1 text-secondary-700">
                            <svg className="w-3.5 h-3.5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {readingTimeMin} {trans('min_read')}
                        </span>
                    </div>

                    {/* Article Main Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-secondary-950 leading-[1.25] mb-8 tracking-tight">
                        {article.title}
                    </h1>

                    {/* Author & Publisher Bar */}
                    <div className="flex items-center justify-between py-4 border-y border-secondary-100 mb-10 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-900 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                                FH
                            </div>
                            <div>
                                <span className="font-bold text-secondary-950 block text-xs">{trans('family_home_real_estate')}</span>
                                <span className="text-xs text-secondary-700 font-semibold">{trans('editorial_team')}</span>
                            </div>
                        </div>

                        {/* Direct Share Options */}
                        <div className="flex items-center gap-2">
                            <a
                                href={whatsappShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors duration-200 shadow-xs"
                                title={trans('share_whatsapp')}
                            >
                                <WhatsAppIcon className="w-4 h-4 fill-current" />
                                <span>{trans('share')}</span>
                            </a>

                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="px-3.5 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 rounded-xl text-xs font-bold transition-colors"
                            >
                                {copied ? (trans('copied')) : (trans('copy_link'))}
                            </button>
                        </div>
                    </div>

                    {/* Featured Cover Image */}
                    {headerImgUrl && (
                        <div className="mb-10 rounded-[2rem] overflow-hidden shadow-sm border border-secondary-100 max-h-[520px] bg-secondary-50 relative group">
                            <img
                                src={headerImgUrl}
                                alt={article.title}
                                width={1200}
                                height={675}
                                className="w-full h-full object-cover max-h-[520px] cursor-pointer group-hover:scale-102 transition-transform duration-500"
                                onClick={() => setLightboxUrl(headerImgUrl)}
                                fetchPriority="high"
                                loading="eager"
                            />
                            <button
                                type="button"
                                onClick={() => setLightboxUrl(headerImgUrl)}
                                className="absolute bottom-4 end-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-xl backdrop-blur-md transition-colors text-xs font-semibold flex items-center gap-1.5"
                                aria-label={trans('expand_image') || 'Expand image'}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                </svg>
                                <span>{trans('expand')}</span>
                            </button>
                        </div>
                    )}

                    {/* Top Images Grid */}
                    {topImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {topImages.map(img => {
                                const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                return (
                                    <div key={img.id} className="rounded-3xl overflow-hidden border border-secondary-100 shadow-sm">
                                        <img
                                            src={imgSrc}
                                            alt={img.alt_text || article.title}
                                            width={800}
                                            height={450}
                                            className="w-full h-56 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                            onClick={() => setLightboxUrl(imgSrc)}
                                            loading="lazy"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Main Article Body Prose */}
                    <div
                        className="prose prose-base sm:prose-lg max-w-none text-secondary-800 leading-loose font-sans
                            prose-headings:font-black prose-headings:text-secondary-950 prose-headings:mt-12 prose-headings:mb-4 prose-headings:tracking-tight
                            prose-p:text-secondary-800 prose-p:leading-loose prose-p:mb-6 prose-p:font-medium
                            prose-img:rounded-3xl prose-img:my-8 prose-img:w-full prose-img:object-cover prose-img:shadow-sm
                            prose-blockquote:bg-primary-50/70 prose-blockquote:p-6 prose-blockquote:rounded-3xl prose-blockquote:text-secondary-950 prose-blockquote:font-semibold prose-blockquote:not-italic prose-blockquote:border border-primary-100
                            prose-a:text-primary-900 prose-a:font-bold prose-a:underline hover:prose-a:text-primary-950"
                        dangerouslySetInnerHTML={{ __html: normalizedContent }}
                    />

                    {/* Unused Middle Images */}
                    {unusedMiddleImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                            {unusedMiddleImages.map(img => {
                                const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                return (
                                    <div key={img.id} className="rounded-3xl overflow-hidden border border-secondary-100 shadow-sm">
                                        <img
                                            src={imgSrc}
                                            alt={img.alt_text || article.title}
                                            width={800}
                                            height={450}
                                            className="w-full h-56 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                            onClick={() => setLightboxUrl(imgSrc)}
                                            loading="lazy"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Bottom Images */}
                    {bottomImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                            {bottomImages.map(img => {
                                const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                return (
                                    <div key={img.id} className="rounded-3xl overflow-hidden border border-secondary-100 shadow-sm">
                                        <img
                                            src={imgSrc}
                                            alt={img.alt_text || article.title}
                                            width={800}
                                            height={450}
                                            className="w-full h-56 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                            onClick={() => setLightboxUrl(imgSrc)}
                                            loading="lazy"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Article End Share CTA */}
                    <div className="mt-14 pt-8 border-t border-secondary-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary-50 p-6 rounded-3xl">
                        <div>
                            <h2 className="text-sm font-bold text-secondary-950">
                                {trans('share_this_article')}
                            </h2>
                            <p className="text-xs text-secondary-700 font-medium mt-0.5">
                                {trans('spread_knowledge')}
                            </p>
                        </div>
                        <a
                            href={whatsappShareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors duration-200 shadow-sm shrink-0"
                            title={trans('share_whatsapp')}
                        >
                            <WhatsAppIcon className="w-4 h-4 fill-current" />
                            <span>{trans('share_whatsapp')}</span>
                        </a>
                    </div>
                        </article>

                        {/* ── Left Column: Sidebar ──── */}
                        <aside className="lg:col-span-3 w-full space-y-8 sticky top-24">
                            
                            {/* Quick Shortcuts */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-secondary-200/60">
                                <h2 className="font-bold text-secondary-950 mb-4 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {trans('quick_links')}
                                </h2>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href={localizedPath('/', locale)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary-800 hover:text-primary-900 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span>
                                            {trans('home')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={localizedPath('/units', locale)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary-800 hover:text-primary-900 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span>
                                            {trans('browse_available_units')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={localizedPath('/projects', locale)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary-800 hover:text-primary-900 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span>
                                            {trans('explore_latest_projects')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Suggested Units */}
                            {suggestedUnits?.length > 0 && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-secondary-200/60">
                                    <h2 className="font-bold text-secondary-950 mb-4 text-sm flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            {trans('suggested_properties')}
                                        </span>
                                        <Link href={localizedPath('/units', locale)} className="text-xs text-secondary-600 hover:text-primary-700 font-semibold">
                                            {trans('view_all')}
                                        </Link>
                                    </h2>
                                    <ul className="space-y-4">
                                        {suggestedUnits.map(unit => {
                                            const unitImg = unit?.images?.find(img => img.is_primary) || unit?.images?.[0];
                                            const unitImgUrl = unitImg?.url || (unitImg?.path ? (unitImg.path.startsWith('http') || unitImg.path.startsWith('/') ? unitImg.path : `/storage/${unitImg.path}`) : null);
                                            const unitSlug = isRtl && unit.slug_ar ? unit.slug_ar : (unit.slug_en || unit.slug || unit.id);
                                            return (
                                                <li key={unit.id}>
                                                    <Link href={localizedPath(`/units/${unitSlug}`, locale)} className="group flex gap-3 items-center">
                                                        {unitImgUrl && (
                                                            <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-secondary-100 border border-secondary-200/50 shadow-xs">
                                                                <img src={unitImgUrl} alt={unit.title} width={64} height={64} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-xs font-bold text-secondary-950 group-hover:text-primary-700 line-clamp-2 leading-relaxed transition-colors">
                                                                {unit.title}
                                                            </p>
                                                            <span className="text-[11px] text-primary-800 font-black mt-1 block">
                                                                {new Intl.NumberFormat(isRtl ? 'ar-EG' : 'en-US').format(unit.price)} {trans('egp')}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}

                            {/* Related Articles */}
                            {relatedArticles?.length > 0 && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-secondary-200/60">
                                    <h2 className="font-bold text-secondary-950 mb-4 text-sm flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                            {trans('suggested_articles')}
                                        </span>
                                        <Link href={localizedPath('/articles', locale)} className="text-xs text-secondary-600 hover:text-primary-700 font-semibold">
                                            {trans('view_all')}
                                        </Link>
                                    </h2>
                                    <ul className="space-y-4">
                                        {relatedArticles.slice(0, 4).map(related => {
                                            const relatedImg = related?.images?.find(img => img.position === 'header') || related?.images?.[0];
                                            const relatedImgUrl = relatedImg?.url || (relatedImg?.path ? (relatedImg.path.startsWith('http') || relatedImg.path.startsWith('/') ? relatedImg.path : `/storage/${relatedImg.path}`) : null);
                                            const relatedSlug = isRtl && related.slug_ar ? related.slug_ar : (related.slug_en || related.slug || related.id);
                                            return (
                                                <li key={related.id}>
                                                    <Link href={localizedPath(`/articles/${relatedSlug}`, locale)} className="group flex gap-3 items-center">
                                                        {relatedImgUrl && (
                                                            <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-secondary-100 border border-secondary-200/50 shadow-xs">
                                                                <img src={relatedImgUrl} alt={related.title} width={64} height={64} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-xs font-bold text-secondary-950 group-hover:text-primary-700 line-clamp-2 leading-relaxed transition-colors">
                                                                {related.title}
                                                            </p>
                                                            <span className="text-[11px] text-secondary-600 mt-1 block font-medium">
                                                                {related.created_at ? new Date(related.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}

                        </aside>
                    </div>
                </div>
            </main>

            {/* Lightbox Modal */}
            {lightboxUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightboxUrl(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        onClick={() => setLightboxUrl(null)}
                        className="absolute top-4 end-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label={trans('close_image') || 'Close image'}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={lightboxUrl}
                        alt=""
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                    />
                </div>
            )}

            <Footer />
        </div>
    )
}
