import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23F0F0F0" width="400" height="300"/%3E%3C/svg%3E'

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="skeleton h-44 w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
            </div>
        </div>
    )
}

export default function ArticleCard({ article, loading = false }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const headerImg = article?.images?.find(img => img.position === 'header') || article?.images?.[0]
    const thumbnail = headerImg?.thumb_url || headerImg?.url || (headerImg?.path ? (headerImg.path.startsWith('http') || headerImg.path.startsWith('/') ? headerImg.path : `/storage/${headerImg.path}`) : PLACEHOLDER)

    if (loading) {
        return <SkeletonCard />
    }

    return (
        <Link
            href={localizedPath(`/articles/${article.slug}`, locale)}
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-dropdown transition-shadow group"
        >
            <img
                src={thumbnail}
                alt={article.alt_text || article.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width="400"
                height="300"
            />
            <div className="p-4">
                <p className="text-xs text-muted mb-1">
                    {article.published_at
                        ? new Date(article.published_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })
                        : ''}
                </p>
                <h3 className="text-sm font-semibold text-secondary-950 mb-1 line-clamp-2 group-hover:text-primary-900 transition-colors">
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className="text-xs text-muted line-clamp-2">{article.excerpt}</p>
                )}
            </div>
        </Link>
    )
}
