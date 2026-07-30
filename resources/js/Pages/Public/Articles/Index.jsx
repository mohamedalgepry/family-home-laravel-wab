import { localizedPath } from '../../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import Pagination from '../../../Components/UI/Pagination'
import SeoHead from '../../../Components/UI/SeoHead'
import ArticleCard from '../../../Components/UI/ArticleCard'

export default function ArticlesIndex({ articles, categories, currentCategory }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const isLoading = !articles
    const hasArticles = articles?.data?.length > 0

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${trans('articles')} - ${trans('site_title')}`}
                description={trans('articles_description')}
                canonical={window.location.href}
            />
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('articles')}</h1>

                {/* Categories */}
                {categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Link
                            href={localizedPath('/articles', locale)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                !currentCategory
                                    ? 'bg-primary-900 text-white'
                                    : 'bg-white text-secondary-700 border border-secondary-200 hover:border-primary-900'
                            }`}
                        >
                            {trans('all')}
                        </Link>
                        {categories.map(cat => (
                            <Link
                                key={cat.id}
                                href={localizedPath(`/articles?category=${cat.slug}`, locale)}
                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                    currentCategory?.id === cat.id
                                        ? 'bg-primary-900 text-white'
                                        : 'bg-white text-secondary-700 border border-secondary-200 hover:border-primary-900'
                                    }`}
                            >
                                {locale === 'ar' ? cat.name_ar : cat.name_en}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ArticleCard key={i} loading={true} />
                        ))}
                    </div>
                ) : hasArticles ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.data.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                        <Pagination meta={articles} links={articles.links} />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted text-sm">{trans('no_results')}</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
