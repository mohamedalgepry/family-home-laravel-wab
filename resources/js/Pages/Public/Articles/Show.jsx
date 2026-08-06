import { localizedPath } from '../../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SeoHead from '../../../Components/UI/SeoHead'
import ArticleCard from '../../../Components/UI/ArticleCard'
import { useMemo } from 'react'

const PLACEHOLDER = '/images/fallback.jpg'

export default function ArticleShow({ article, relatedArticles }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

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

    if (!article) {
        return (
            <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center py-16">
                    <p className="text-secondary-600 text-sm mb-4">{trans('no_results')}</p>
                </main>
                <Footer />
            </div>
        )
    }

    let parsedContent = article.content || ''
    
    const usedMiddleIndices = new Set()
    middleImages.forEach((img, index) => {
        const shortcodeEn = `[image:${index + 1}]`
        const shortcodeAr = `[صورة:${index + 1}]`
        if (parsedContent.includes(shortcodeEn) || parsedContent.includes(shortcodeAr)) {
            usedMiddleIndices.add(index)
            const imgPath = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`)
            const altText = (img.alt_text || article.title || '').replace(/"/g, '&quot;')
            let imageHtml = `<img src="${imgPath}" alt="${altText}" class="w-full h-auto rounded-2xl my-6 border border-secondary-200/60 object-cover" loading="lazy" />`
            if (img.link_url) {
                const safeLink = img.link_url.replace(/"/g, '&quot;')
                imageHtml = `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="block hover:opacity-95 transition-opacity">${imageHtml}</a>`
            }
            parsedContent = parsedContent.replaceAll(shortcodeEn, imageHtml)
            parsedContent = parsedContent.replaceAll(shortcodeAr, imageHtml)
        }
    })
    const unusedMiddleImages = middleImages.filter((_, idx) => !usedMiddleIndices.has(idx))

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
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

            <main className="flex-1 max-w-container mx-auto px-4 py-8 sm:py-10 w-full">
                <article className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <Link
                        href={localizedPath('/articles', locale)}
                        className="text-xs sm:text-sm font-medium text-secondary-600 hover:text-primary-900 transition-colors mb-6 inline-block"
                    >
                        &larr; {trans('articles')}
                    </Link>

                    {/* Meta & Category */}
                    <div className="flex items-center gap-2 text-xs text-secondary-500 mb-3">
                        {categoryName && (
                            <span className="font-semibold text-primary-900 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                                {categoryName}
                            </span>
                        )}
                        {categoryName && formattedDate && <span>•</span>}
                        {formattedDate && <span>{formattedDate}</span>}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-950 leading-snug mb-6">
                        {article.title}
                    </h1>

                    {/* Featured Cover Image */}
                    {headerImgUrl && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-secondary-200/60 max-h-[480px] bg-secondary-100">
                            {headerImage?.link_url ? (
                                <a href={headerImage.link_url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-95 transition-opacity">
                                    <img
                                        src={headerImgUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover max-h-[480px]"
                                    />
                                </a>
                            ) : (
                                <img
                                    src={headerImgUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover max-h-[480px]"
                                />
                            )}
                        </div>
                    )}

                    {/* Top Images */}
                    {topImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {topImages.map(img => {
                                const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                const imgTag = (
                                    <img
                                        src={imgSrc}
                                        alt={img.alt_text || article.title}
                                        className="w-full h-56 rounded-2xl object-cover border border-secondary-200/60"
                                        loading="lazy"
                                    />
                                );
                                return img.link_url ? (
                                    <a key={img.id} href={img.link_url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-95 transition-opacity">
                                        {imgTag}
                                    </a>
                                ) : (
                                    <div key={img.id}>{imgTag}</div>
                                );
                            })}
                        </div>
                    )}

                    {/* Main Article Body */}
                    <div
                        className="prose prose-base sm:prose-lg max-w-none text-secondary-800 leading-relaxed
                            prose-headings:font-bold prose-headings:text-secondary-950 prose-headings:mt-8 prose-headings:mb-3
                            prose-p:text-secondary-800 prose-p:leading-relaxed prose-p:mb-5
                            prose-img:rounded-2xl prose-img:my-6 prose-img:w-full prose-img:object-cover
                            prose-blockquote:border-s-4 prose-blockquote:border-primary-900 prose-blockquote:bg-secondary-50 prose-blockquote:p-4 prose-blockquote:rounded-e-xl prose-blockquote:text-secondary-900 prose-blockquote:not-italic
                            prose-a:text-primary-900 prose-a:underline hover:prose-a:text-primary-950"
                        dangerouslySetInnerHTML={{ __html: parsedContent }}
                    />

                    {/* Unused Middle Images */}
                    {unusedMiddleImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {unusedMiddleImages.map(img => {
                                const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                const imgTag = (
                                    <img
                                        src={imgSrc}
                                        alt={img.alt_text || article.title}
                                        className="w-full h-56 rounded-2xl object-cover border border-secondary-200/60"
                                        loading="lazy"
                                    />
                                );
                                return img.link_url ? (
                                    <a key={img.id} href={img.link_url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-95 transition-opacity">
                                        {imgTag}
                                    </a>
                                ) : (
                                    <div key={img.id}>{imgTag}</div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Images */}
                    {bottomImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {bottomImages.map(img => {
                                const imgSrc = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`);
                                const imgTag = (
                                    <img
                                        src={imgSrc}
                                        alt={img.alt_text || article.title}
                                        className="w-full h-56 rounded-2xl object-cover border border-secondary-200/60"
                                        loading="lazy"
                                    />
                                );
                                return img.link_url ? (
                                    <a key={img.id} href={img.link_url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-95 transition-opacity">
                                        {imgTag}
                                    </a>
                                ) : (
                                    <div key={img.id}>{imgTag}</div>
                                );
                            })}
                        </div>
                    )}
                </article>

                {/* Related Articles Cards */}
                {relatedArticles?.length > 0 && (
                    <section className="max-w-5xl mx-auto mt-16 pt-10 border-t border-secondary-200/80">
                        <h2 className="text-xl font-bold text-secondary-950 mb-6">
                            {trans('read_more') || (isRtl ? 'مقالات ذات صلة' : 'Related Articles')}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.slice(0, 3).map(related => (
                                <ArticleCard key={related.id} article={related} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}
