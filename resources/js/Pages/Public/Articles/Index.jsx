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

            <main className="flex-1 w-full flex flex-col">
                {/* Premium Header Area */}
                <div className="bg-gradient-to-b from-surface-hover to-surface pt-8 pb-10 px-4">
                    <div className="max-w-container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-secondary-950 tracking-tight mb-2">
                                    {currentCategory
                                        ? (isRtl ? currentCategory.name_ar : currentCategory.name_en)
                                        : trans('articles')}
                                </h1>
                                <p className="text-sm font-medium text-secondary-500">
                                    {trans('articles_description')}
                                </p>
                            </div>
                        </div>

                        {/* Categories Bar */}
                        {categories?.length > 0 && (
                            <div className="overflow-x-auto pb-2 scrollbar-none">
                                <div className="flex items-center gap-2 min-w-max">
                                    <Link
                                        href={localizedPath('/articles', locale)}
                                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                                            !currentCategory
                                                ? 'bg-primary-900 text-white shadow-sm'
                                                : 'bg-white text-secondary-600 hover:text-secondary-900 shadow-sm border border-secondary-100 hover:border-secondary-300'
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
                                                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                                                    isActive
                                                        ? 'bg-primary-900 text-white shadow-sm'
                                                        : 'bg-white text-secondary-600 hover:text-secondary-900 shadow-sm border border-secondary-100 hover:border-secondary-300'
                                                }`}
                                            >
                                                {isRtl ? cat.name_ar : cat.name_en}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 max-w-container mx-auto px-4 py-8 w-full">

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
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-secondary-100 shadow-sm max-w-2xl mx-auto w-full">
                        <div className="w-16 h-16 bg-surface-hover text-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <p className="text-secondary-900 font-bold text-lg mb-2">{trans('no_results')}</p>
                        <Link
                            href={localizedPath('/articles', locale)}
                            className="inline-flex mt-4 px-6 py-2.5 bg-primary-900 text-white rounded-xl text-sm font-bold hover:bg-primary-950 transition-colors shadow-sm"
                        >
                            {trans('view_all_articles')}
                        </Link>
                    </div>
                )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
