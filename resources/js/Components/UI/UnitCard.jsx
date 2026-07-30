import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useCompare } from '../../Hooks/useCompare'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23F0F0F0" width="400" height="300"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%239A9A9A" font-size="14"%3E%3C/text%3E%3C/svg%3E'

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100/50">
            <div className="skeleton h-64 w-full" />
            <div className="p-5 space-y-4">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="flex gap-3">
                    <div className="skeleton h-4 w-16 rounded" />
                    <div className="skeleton h-4 w-16 rounded" />
                    <div className="skeleton h-4 w-16 rounded" />
                </div>
                <div className="skeleton h-10 w-full rounded-xl mt-4" />
            </div>
        </div>
    )
}

export default function UnitCard({ unit, loading = false }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const { compareList, toggleCompare, maxItems } = useCompare('unit')

    if (loading) {
        return <SkeletonCard />
    }

    const mainImage = unit?.images?.find(img => img.is_main || img.is_primary) || unit?.images?.[0]
    const thumbnail = mainImage?.thumb_url || mainImage?.url || (mainImage?.path ? (mainImage.path.startsWith('http') || mainImage.path.startsWith('/') ? mainImage.path : `/storage/${mainImage.path}`) : PLACEHOLDER)
    const isFeatured = (unit?.priority_points ?? 0) > 0
    const isCompared = compareList.includes(unit?.id)

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-dropdown transition-all duration-300 group border border-secondary-100/50 hover:-translate-y-1">
            {/* Image */}
            <Link href={localizedPath(`/units/${unit.slug}`, locale)} className="block relative overflow-hidden">
                <img
                    src={thumbnail}
                    alt={unit.alt_text || unit.name}
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    width="400"
                    height="300"
                />
                {isFeatured && (
                    <span className="absolute top-3 start-3 bg-primary-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                        {trans('featured')}
                    </span>
                )}
            </Link>

            {/* Details */}
            <div className="p-5">
                <Link href={localizedPath(`/units/${unit.slug}`, locale)}>
                    <h3 className="text-base font-bold text-secondary-950 truncate mb-1.5 group-hover:text-primary-900 transition-colors">
                        {unit.name}
                    </h3>
                </Link>

                <p className="text-sm text-secondary-600 mb-3">
                    {unit.area?.name || unit.area_name || ''}
                    {unit.type && <span className="mx-1.5 text-secondary-300">•</span>}
                    {unit.type?.name || unit.type_name || ''}
                </p>

                <p className="text-xl font-bold text-secondary-950 mb-4">
                    {Number(unit.price).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                    <span className="text-sm text-secondary-500 font-normal ms-1.5">
                        / {trans(unit.transaction === 'rent' ? 'rent' : 'sale')}
                    </span>
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted">
                    {unit.area_sqm && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                            {unit.area_sqm} {trans('area_sqm')}
                        </span>
                    )}
                    {unit.rooms && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            {unit.rooms}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-secondary-100">
                    <button
                        onClick={e => { 
                            e.preventDefault(); 
                            if (!isCompared && compareList.length >= maxItems) {
                                alert(locale === 'ar' ? `لا يمكنك مقارنة أكثر من ${maxItems} وحدات` : `You cannot compare more than ${maxItems} units`);
                                return;
                            }
                            toggleCompare(unit.id); 
                        }}
                        className={`flex items-center gap-1.5 p-2 -m-2 text-xs transition-colors rounded-lg ${isCompared ? 'text-primary-900 font-bold bg-primary-50' : 'text-muted hover:text-primary-900 hover:bg-secondary-50'}`}
                        aria-label={isCompared ? trans('remove_compare') || trans('compare') : trans('compare')}
                    >
                        {isCompared ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                        )}
                        {trans('compare')}
                    </button>
                    <button
                        onClick={e => { e.preventDefault(); /* toggle favorite */ }}
                        className="flex items-center justify-center p-2 -m-2 text-muted hover:text-primary-900 hover:bg-secondary-50 rounded-lg transition-colors ms-auto"
                        aria-label={trans('add_to_favorites') || 'Favorite'}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
