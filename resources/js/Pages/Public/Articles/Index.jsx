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
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
            <SeoHead
                title={`${currentCategory ? (isRtl ? currentCategory.name_ar : currentCategory.name_en) + ' - ' : ''}${trans('articles')} - ${trans('site_title')}`}
                description={trans('articles_description')}
            />
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 sm:py-10 w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-secondary-950">
                        {currentCategory
                            ? (isRtl ? currentCategory.name_ar : currentCategory.name_en)
                            : trans('articles')}
                    </h1>
                </div>

                {/* Categories Bar */}
                {categories?.length > 0 && (
                    <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex items-center gap-2 min-w-max">
                            <Link
                                href={localizedPath('/articles', locale)}
                                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                    !currentCategory
                                        ? 'bg-primary-900 text-white'
                                        : 'bg-white text-secondary-700 border border-secondary-200 hover:border-primary-900/40'
                                }`}
                            >
                                {trans('all')}
                            </Link>
                            {categories.map(cat => {
                                const isActive = currentCategory?.id === cat.id
                                return (
                                    <Link
                                        key={cat.id}
                                        href={localizedPath(`/articles?category=${cat.slug}`, locale)}
                                        className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                            isActive
                                                ? 'bg-primary-900 text-white'
                                                : 'bg-white text-secondary-700 border border-secondary-200 hover:border-primary-900/40'
                                        }`}
                                    >
                                        {isRtl ? cat.name_ar : cat.name_en}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Articles Uniform Grid */}
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

                        <div className="mt-10 flex justify-center">
                            <Pagination meta={articles} links={articles.links} />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-secondary-200/60 p-6 max-w-md mx-auto">
                        <p className="text-secondary-600 text-sm mb-4">{trans('no_results')}</p>
                        <Link
                            href={localizedPath('/articles', locale)}
                            className="inline-flex items-center px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-950 transition-colors"
                        >
                            {isRtl ? 'عرض كل المقالات' : 'View All Articles'}
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
