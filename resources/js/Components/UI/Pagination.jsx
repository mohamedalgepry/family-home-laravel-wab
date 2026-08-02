import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function Pagination({ meta, links: routeLinks }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    if (!meta || meta.last_page <= 1) {
        return null
    }

    const { current_page, last_page, per_page, total } = meta
    const preserveState = { preserveState: true, preserveScroll: true }
    const range = 2
    const pages = []
    const start = Math.max(1, current_page - range)
    const end = Math.min(last_page, current_page + range)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    function buildUrl(page) {
        const params = new URLSearchParams(window.location.search)
        params.set('page', page)
        return window.location.pathname + '?' + params.toString()
    }

    return (
        <nav dir={isRtl ? 'rtl' : 'ltr'} className="flex items-center justify-center gap-1 mt-8" aria-label={isRtl ? 'صفحات النتائج' : 'Pagination'}>
            {/* Previous */}
            {current_page > 1 ? (
                <Link
                    href={buildUrl(current_page - 1)}
                    className="px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors"
                    {...preserveState}
                >
                    {trans('previous')}
                </Link>
            ) : (
                <span className="px-3 py-2 text-sm text-secondary-300 cursor-not-allowed">
                    {trans('previous')}
                </span>
            )}

            {/* First page + ellipsis */}
            {start > 1 && (
                <>
                    <Link href={buildUrl(1)} className="px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors" {...preserveState}>
                        1
                    </Link>
                    {start > 2 && <span className="px-2 text-secondary-400 text-sm">...</span>}
                </>
            )}

            {/* Page numbers */}
            {pages.map(page => (
                <Link
                    key={page}
                    href={buildUrl(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        page === current_page
                            ? 'bg-primary-900 text-white'
                            : 'text-secondary-700 hover:bg-surface'
                    }`}
                    {...preserveState}
                >
                    {page}
                </Link>
            ))}

            {/* Last page + ellipsis */}
            {end < last_page && (
                <>
                    {end < last_page - 1 && <span className="px-2 text-secondary-400 text-sm">...</span>}
                    <Link href={buildUrl(last_page)} className="px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors" {...preserveState}>
                        {last_page}
                    </Link>
                </>
            )}

            {/* Next */}
            {current_page < last_page ? (
                <Link
                    href={buildUrl(current_page + 1)}
                    className="px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors"
                    {...preserveState}
                >
                    {trans('next')}
                </Link>
            ) : (
                <span className="px-3 py-2 text-sm text-secondary-300 cursor-not-allowed">
                    {trans('next')}
                </span>
            )}
        </nav>
    )
}
