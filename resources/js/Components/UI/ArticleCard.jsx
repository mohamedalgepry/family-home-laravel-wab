import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import OptimizedImage from '../OptimizedImage'

const PLACEHOLDER = '/images/fallback.webp'

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-secondary-200/60 shadow-xs overflow-hidden h-full flex flex-col animate-pulse">
            <div className="skeleton h-48 w-full bg-secondary-100" />
            <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="skeleton h-3 w-20 rounded-full bg-secondary-100" />
                <div className="skeleton h-5 w-5/6 rounded bg-secondary-100" />
                <div className="skeleton h-4 w-full rounded bg-secondary-100" />
                <div className="skeleton h-4 w-2/3 rounded bg-secondary-100" />
            </div>
        </div>
    )
}

export default function ArticleCard({ article, loading = false }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    if (loading) {
        return <SkeletonCard />
    }

    const headerImg = article?.images?.find(img => img.position === 'header') || article?.images?.[0]
    const thumbnail = headerImg?.thumb_url || headerImg?.url || (headerImg?.path ? (headerImg.path.startsWith('http') || headerImg.path.startsWith('/') ? headerImg.path : `/storage/${headerImg.path}`) : PLACEHOLDER)
    const imageAlt = article.alt_text || `${article.title} - ${trans('app_name')}`
    const categoryName = article.category ? (isRtl ? article.category.name_ar : article.category.name_en) : null

    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : ''

    return (
        <Link
            href={localizedPath(`/articles/${article.slug}`, locale)}
            className="group bg-white rounded-2xl border border-secondary-200/80 shadow-xs hover:shadow-md hover:border-primary-900/40 transition-all duration-300 flex flex-col h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
            <div className="relative h-48 w-full overflow-hidden bg-secondary-100">
                <OptimizedImage
                    src={thumbnail}
                    alt={imageAlt}
                    width={400}
                    height={300}
                    lazy={true}
                    fallbackSrc={PLACEHOLDER}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {categoryName && (
                    <span className="absolute top-3 start-3 px-2.5 py-1 text-xs font-semibold text-secondary-900 bg-white/90 backdrop-blur-sm rounded-lg shadow-xs border border-white/60">
                        {categoryName}
                    </span>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    {formattedDate && (
                        <p className="text-xs text-secondary-500 mb-2">{formattedDate}</p>
                    )}

                    <h2 className="text-base font-bold text-secondary-950 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug mb-2">
                        {article.title}
                    </h2>

                    {article.excerpt && (
                        <p className="text-xs sm:text-sm text-secondary-600 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
