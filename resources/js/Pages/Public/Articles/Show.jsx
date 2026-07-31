import { localizedPath } from '../../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SeoHead from '../../../Components/UI/SeoHead'
import { useMemo } from 'react'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23F0F0F0" width="800" height="600"/%3E%3C/svg%3E'

export default function ArticleShow({ article, relatedArticles }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const headerImage = article?.images?.find(img => img.position === 'header') || article?.images?.[0]
    const topImages = article?.images?.filter(img => img.position === 'top') || []
    const middleImages = article?.images?.filter(img => img.position === 'middle') || []
    const bottomImages = article?.images?.filter(img => img.position === 'bottom') || []

    const jsonLd = useMemo(() => {
        if (!article) return null
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt || article.meta_description,
            image: headerImage?.url || (headerImage?.path ? `/storage/${headerImage.path}` : null),
            datePublished: article.published_at,
            dateModified: article.updated_at,
            author: {
                '@type': 'Organization',
                name: 'Family Home',
            },
        }
    }, [article, headerImage])

    if (!article) {
        return (
            <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-muted text-sm">{trans('no_results')}</p>
                </main>
                <Footer />
            </div>
        )
    }

    let parsedContent = article.content || ''
    
    middleImages.forEach((img, index) => {
        // Support both neutral [image:N] and legacy Arabic [صورة:N] shortcodes
        const shortcodeEn = `[image:${index + 1}]`
        const shortcodeAr = `[صورة:${index + 1}]`
        const imgPath = img.url || (img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`)
        const altText = (img.alt_text || article.title || '').replace(/"/g, '&quot;')
        const imageHtml = `<img src="${imgPath}" alt="${altText}" class="w-full h-auto rounded-xl my-6 shadow-sm object-cover" loading="lazy" />`
        parsedContent = parsedContent.replaceAll(shortcodeEn, imageHtml)
        parsedContent = parsedContent.replaceAll(shortcodeAr, imageHtml)
    })

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${article?.title || ''} - ${trans('site_title')}`}
                description={article?.meta_description || article?.excerpt || ''}
                keywords={article?.keywords || ''}
                ogImage={headerImage?.url || (headerImage?.path ? `/storage/${headerImage.path}` : null)}
                ogType="article"
                canonical={window.location.href}
            />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                <article className="max-w-4xl mx-auto pt-8">
                    {/* Back link */}
                    <Link href={localizedPath('/articles', locale)} className="text-sm text-primary-900 hover:text-primary-950 mb-4 inline-block">
                        &larr; {trans('articles')}
                    </Link>

                    {/* Meta */}
                    <p className="text-sm text-muted mb-2">
                        {article.category && (
                            <span>{locale === 'ar' ? article.category.name_ar : article.category.name_en} · </span>
                        )}
                        {article.published_at && new Date(article.published_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                        })}
                    </p>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-secondary-950 mb-6 leading-tight">
                        {article.title}
                    </h1>

                    {/* Top Images */}
                    {topImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {topImages.map(img => (
                                <img
                                    key={img.id}
                                    src={img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`}
                                    alt={img.alt_text || article.title}
                                    className="w-full h-auto rounded-xl object-cover shadow-sm"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-sm sm:prose-base max-w-none text-secondary-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parsedContent }}
                    />

                    {/* Bottom Images */}
                    {bottomImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {bottomImages.map(img => (
                                <img
                                    key={img.id}
                                    src={img.path.startsWith('http') || img.path.startsWith('/') ? img.path : `/storage/${img.path}`}
                                    alt={img.alt_text || article.title}
                                    className="w-full h-auto rounded-xl object-cover shadow-sm"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    )}
                </article>

                {/* Related Articles */}
                {relatedArticles?.length > 0 && (
                    <section className="max-w-5xl mx-auto mt-12 pt-8 border-t border-secondary-200">
                        <h2 className="text-xl font-bold text-secondary-950 mb-6">{trans('read_more')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {relatedArticles.map(related => (
                                <Link
                                    key={related.id}
                                    href={localizedPath(`/articles/${related.slug}`, locale)}
                                    className="bg-white rounded-xl shadow-card p-4 hover:shadow-dropdown transition-shadow"
                                >
                                    <h3 className="text-sm font-semibold text-secondary-950 mb-1 line-clamp-2 hover:text-primary-900 transition-colors">
                                        {related.title}
                                    </h3>
                                    {related.excerpt && (
                                        <p className="text-xs text-muted line-clamp-2">{related.excerpt}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}
