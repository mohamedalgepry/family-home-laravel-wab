/**
 * THESIS: The Article Display page is an authoritative real estate editorial piece.
 *         It combines comfortable reading typography (Cairo, 16-18px, leading-loose) with direct conversion paths.
 * OWN-WORLD: White canvas, Crimson Authority (#CC0000) for accents, Cairo font family,
 *            WhatsApp Green (#16a34a) for sharing & lead generation.
 * STORY: Visitor reads article → computes reading time & publisher trust → engages with inline visuals →
 *        encounters sticky WhatsApp conversion widget in sidebar → explores related articles.
 * FIRST VIEWPORT: Breadcrumb & category pill → Article Title → Publisher badge + Date + Reading Time →
 *                 Hero cover image (16:9 max-h-[500px]) with zoom lightbox toggle.
 * FORM: "Editorial Article Display" — 2-column layout (Main article lg:col-span-2, Sticky Sidebar lg:col-span-1).
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.
 */

import { localizedPath } from '../../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SeoHead from '../../../Components/UI/SeoHead'
import ArticleCard from '../../../Components/UI/ArticleCard'
import { useState, useMemo } from 'react'

const PLACEHOLDER = '/images/fallback.webp'

export default function ArticleShow({ article, relatedArticles }) {
    const { locale, appUrl, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [copied, setCopied] = useState(false)
    const [lightboxUrl, setLightboxUrl] = useState(null)

    const whatsappNumber = settings?.whatsapp_number || '201000000000'

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

    if (!article) {
        return (
            <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20 text-center">
                    <div>
                        <p className="text-secondary-600 font-semibold text-base mb-4">{trans('no_results')}</p>
                        <Link href={localizedPath('/articles', locale)} className="px-5 py-2.5 bg-primary-900 text-white rounded-xl text-xs font-bold">
                            {isRtl ? 'العودة للمقالات' : 'Back to Articles'}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    /* Process middle image shortcodes */
    let parsedContent = article.content || ''
    const usedMiddleIndices = new Set()
    middleImages.forEach((img, index) => {
        const shortcodeEn = `[image:${index + 1}]`
        const shortcodeAr = `[صورة:${index + 1}]`
        if (parsedContent.includes(shortcodeEn) || parsedContent.includes(shortcodeAr)) {
            usedMiddleIndices.add(index)
            const imgPath = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`)
            const altText = (img.alt_text || article.title || '').replace(/"/g, '&quot;')
            let imageHtml = `<img src="${imgPath}" alt="${altText}" width="1200" height="800" class="w-full h-auto rounded-2xl my-6 border border-secondary-200/60 object-cover shadow-sm" loading="lazy" />`
            if (img.link_url) {
                const safeLink = img.link_url.replace(/"/g, '&quot;')
                imageHtml = `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="block hover:opacity-95 transition-opacity">${imageHtml}</a>`
            }
            parsedContent = parsedContent.replaceAll(shortcodeEn, imageHtml)
            parsedContent = parsedContent.replaceAll(shortcodeAr, imageHtml)
        }
    })
    const unusedMiddleImages = middleImages.filter((_, idx) => !usedMiddleIndices.has(idx))

    const currentUrl = typeof window !== 'undefined' ? window.location.href : appUrl
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}\n${currentUrl}`)}`

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-white flex flex-col font-sans">
            <SeoHead
                title={`${article?.title || ''} - ${trans('site_title')}`}
                description={article?.meta_description || article?.excerpt || ''}
                keywords={article?.keywords || ''}
                ogImage={headerImgUrl}
                ogType="article"
            />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
                />
            )}
            <Header />

            <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
                
                {/* ── Breadcrumb Navigation ─────────────────────────────── */}
                <nav className="flex items-center gap-2 text-xs font-semibold text-secondary-500 mb-6" aria-label="Breadcrumb">
                    <Link href={localizedPath('/', locale)} className="hover:text-primary-900 transition-colors">
                        {isRtl ? 'الرئيسية' : 'Home'}
                    </Link>
                    <span>/</span>
                    <Link href={localizedPath('/articles', locale)} className="hover:text-primary-900 transition-colors">
                        {trans('articles') || (isRtl ? 'المقالات' : 'Articles')}
                    </Link>
                    {categoryName && (
                        <>
                            <span>/</span>
                            <span className="text-secondary-800">{categoryName}</span>
                        </>
                    )}
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    
                    {/* ── Main Article Column (lg:col-span-2) ─────────────── */}
                    <article className="lg:col-span-2">
                        
                        {/* Category & Meta Header */}
                        <div className="flex items-center gap-3 flex-wrap text-xs text-secondary-500 mb-4">
                            {categoryName && (
                                <span className="font-bold text-primary-900 bg-primary-50 px-3 py-1 rounded-full border border-primary-100/80">
                                    {categoryName}
                                </span>
                            )}
                            {formattedDate && (
                                <span className="font-medium">{formattedDate}</span>
                            )}
                            <span>•</span>
                            <span className="font-medium flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {readingTimeMin} {isRtl ? 'دقائق قراءة' : 'min read'}
                            </span>
                        </div>

                        {/* Article Title */}
                        <h1 className="text-2xl sm:text-4xl font-black text-secondary-950 leading-tight mb-6 tracking-tight">
                            {article.title}
                        </h1>

                        {/* Author / Publisher Badge */}
                        <div className="flex items-center justify-between py-3 border-y border-secondary-100 mb-8 text-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                                    FH
                                </div>
                                <div>
                                    <span className="font-bold text-secondary-900 block">فاميلي هوم العقارية</span>
                                    <span className="text-xs text-secondary-500 font-medium">فريق التحرير العقاري</span>
                                </div>
                            </div>
                            
                            {/* Share Buttons Strip */}
                            <div className="flex items-center gap-2">
                                <a
                                    href={whatsappShareUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
                                    title={isRtl ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                    </svg>
                                    <span>{isRtl ? 'مشاركة' : 'Share'}</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-800 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    {copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy Link')}
                                </button>
                            </div>
                        </div>

                        {/* Featured Hero Cover Image */}
                        {headerImgUrl && (
                            <div className="mb-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-card border border-secondary-200/70 max-h-[500px] bg-secondary-100 relative group">
                                <img
                                    src={headerImgUrl}
                                    alt={article.title}
                                    width={1200}
                                    height={675}
                                    className="w-full h-full object-cover max-h-[500px] cursor-pointer group-hover:scale-102 transition-transform duration-500"
                                    onClick={() => setLightboxUrl(headerImgUrl)}
                                    fetchPriority="high"
                                    loading="eager"
                                />
                                <button
                                    type="button"
                                    onClick={() => setLightboxUrl(headerImgUrl)}
                                    className="absolute bottom-4 end-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl backdrop-blur-md transition-all text-xs font-semibold flex items-center gap-1.5"
                                    aria-label="Expand cover image"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                    </svg>
                                    <span>{isRtl ? 'تكبير' : 'Expand'}</span>
                                </button>
                            </div>
                        )}

                        {/* Top Images Grid */}
                        {topImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {topImages.map(img => {
                                    const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                    return (
                                        <div key={img.id} className="rounded-2xl overflow-hidden border border-secondary-200/60 shadow-xs">
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

                        {/* Article Prose Content */}
                        <div
                            className="prose prose-base sm:prose-lg max-w-none text-secondary-800 leading-relaxed font-sans
                                prose-headings:font-black prose-headings:text-secondary-950 prose-headings:mt-10 prose-headings:mb-4 prose-headings:tracking-tight
                                prose-p:text-secondary-800 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-medium
                                prose-img:rounded-2xl prose-img:my-8 prose-img:w-full prose-img:object-cover prose-img:shadow-sm
                                prose-blockquote:bg-primary-50/70 prose-blockquote:p-5 prose-blockquote:rounded-2xl prose-blockquote:text-secondary-950 prose-blockquote:font-semibold prose-blockquote:not-italic prose-blockquote:border border-primary-100
                                prose-a:text-primary-900 prose-a:font-bold prose-a:underline hover:prose-a:text-primary-950"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />

                        {/* Unused Middle Images */}
                        {unusedMiddleImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                                {unusedMiddleImages.map(img => {
                                    const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                    return (
                                        <div key={img.id} className="rounded-2xl overflow-hidden border border-secondary-200/60 shadow-xs">
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
                                        <div key={img.id} className="rounded-2xl overflow-hidden border border-secondary-200/60 shadow-xs">
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

                        {/* Article Footer Share CTA */}
                        <div className="mt-12 pt-8 border-t border-secondary-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary-50 p-6 rounded-2xl">
                            <div>
                                <h3 className="text-sm font-bold text-secondary-950">
                                    {isRtl ? 'هل أعجبك المقال؟ شاركه مع أصدقائك' : 'Did you enjoy this article? Share it'}
                                </h3>
                                <p className="text-xs text-secondary-500 mt-0.5">
                                    {isRtl ? 'ساعد غيرك في التعرف على أفضل الفرص العقارية' : 'Help others discover top real estate insights'}
                                </p>
                            </div>
                            <a
                                href={whatsappShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>{isRtl ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}</span>
                            </a>
                        </div>
                    </article>

                    {/* ── Sidebar (lg:col-span-1) ──────────────────────────── */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                        
                        {/* Direct WhatsApp Conversion Card */}
                        <div className="bg-gradient-to-br from-secondary-950 to-secondary-900 text-white rounded-3xl p-6 shadow-xl border border-secondary-800 relative overflow-hidden">
                            <div className="absolute top-0 end-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-primary-600/20 rounded-full blur-2xl pointer-events-none" />
                            
                            <span className="inline-block bg-primary-500/20 text-primary-300 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-primary-500/30">
                                {isRtl ? 'استشارة عقارية مجانية' : 'Free Advisory'}
                            </span>
                            
                            <h3 className="text-lg font-bold mb-2 leading-tight">
                                {isRtl ? 'هل تبحث عن وحدة عقارية مناسبة؟' : 'Looking for your ideal property?'}
                            </h3>
                            <p className="text-xs text-secondary-300 mb-6 leading-relaxed">
                                {isRtl
                                    ? 'تواصل مع مستشاري فاميلي هوم مباشرة للحصول على أفضل العروض والأسعار'
                                    : 'Speak directly with Family Home advisors for prime deals & locations'}
                            </p>

                            <div className="space-y-3">
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-97"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                    </svg>
                                    <span>{isRtl ? 'تحدث مع المستشار عبر واتساب' : 'Chat on WhatsApp'}</span>
                                </a>

                                <Link
                                    href={localizedPath('/units', locale)}
                                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs border border-white/20 transition-all"
                                >
                                    <span>{isRtl ? 'تصفح كل العقارات' : 'Browse All Units'}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Properties Search Link */}
                        <div className="bg-surface rounded-2xl p-5 border border-secondary-200/80">
                            <h4 className="text-sm font-bold text-secondary-950 mb-2">
                                {isRtl ? 'تصفح بالمنطقة' : 'Browse by Area'}
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                <Link href={localizedPath('/units', locale)} className="px-3 py-1 bg-white text-xs font-semibold text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 transition-colors">
                                    {isRtl ? 'القاهرة الجديدة' : 'New Cairo'}
                                </Link>
                                <Link href={localizedPath('/units', locale)} className="px-3 py-1 bg-white text-xs font-semibold text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 transition-colors">
                                    {isRtl ? 'العاصمة الإدارية' : 'New Capital'}
                                </Link>
                                <Link href={localizedPath('/units', locale)} className="px-3 py-1 bg-white text-xs font-semibold text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 transition-colors">
                                    {isRtl ? 'الشيخ زايد' : 'Sheikh Zayed'}
                                </Link>
                                <Link href={localizedPath('/units', locale)} className="px-3 py-1 bg-white text-xs font-semibold text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 transition-colors">
                                    {isRtl ? 'الساحل الشمالي' : 'North Coast'}
                                </Link>
                            </div>
                        </div>

                    </aside>
                </div>

                {/* ── Related Articles Section ─────────────────────────── */}
                {relatedArticles?.length > 0 && (
                    <section className="mt-16 pt-12 border-t border-secondary-200" aria-labelledby="related-heading">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 id="related-heading" className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">
                                    {trans('read_more') || (isRtl ? 'مقالات ذات صلة' : 'Related Articles')}
                                </h2>
                                <p className="text-xs text-secondary-500 mt-1 font-medium">
                                    {isRtl ? 'اقرأ المزيد من التحليلات والنصائح العقارية' : 'Discover more insights and real estate advice'}
                                </p>
                            </div>
                            <Link href={localizedPath('/articles', locale)} className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1">
                                {isRtl ? 'كل المقالات' : 'All Articles'}
                                <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.slice(0, 3).map(related => (
                                <ArticleCard key={related.id} article={related} />
                            ))}
                        </div>
                    </section>
                )}

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
                        className="absolute top-4 end-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                        aria-label="Close image"
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
