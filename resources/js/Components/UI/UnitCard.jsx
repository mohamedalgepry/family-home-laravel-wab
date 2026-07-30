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
    const { locale, settings } = usePage().props
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

    const whatsappPhone = settings?.whatsapp_number || settings?.phone || '201000000000'
    const whatsappMsg = encodeURIComponent(isRtl ? `مرحباً فاميلي هوم، أود الاستفسار عن العقار: ${unit?.name}` : `Hello Family Home, I would like to inquire about: ${unit?.name}`)
    const whatsappLink = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-secondary-100/70 hover:-translate-y-1.5 flex flex-col justify-between">
            <div>
                {/* Image */}
                <Link href={localizedPath(`/units/${unit.slug}`, locale)} className="block relative overflow-hidden aspect-[4/3]">
                    <img
                        src={thumbnail}
                        alt={unit.alt_text || unit.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                        width="400"
                        height="300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>

                    {/* Badges */}
                    <div className="absolute top-3 start-3 flex flex-wrap gap-1.5 z-10">
                        {isFeatured && (
                            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {trans('featured')}
                            </span>
                        )}
                        <span className="bg-secondary-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {trans(unit.transaction === 'rent' ? 'rent' : 'sale')}
                        </span>
                    </div>

                    {/* Area tag overlay */}
                    {unit.area?.name && (
                        <span className="absolute bottom-3 start-3 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {unit.area.name}
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

                    <p className="text-xs font-medium text-secondary-500 mb-3 flex items-center gap-1.5">
                        <span>{unit.type?.name || unit.type_name || ''}</span>
                        {unit.finishing_type && (
                            <>
                                <span className="text-secondary-300">•</span>
                                <span className="text-secondary-600">{unit.finishing_type.name || unit.finishing_type}</span>
                            </>
                        )}
                    </p>

                    <div className="mb-4">
                        <span className="text-2xl font-black text-primary-900 tracking-tight">
                            {Number(unit.price).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                        </span>
                        <span className="text-xs font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded ms-2">
                            {isRtl ? 'ج.م' : 'EGP'}
                        </span>
                    </div>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-secondary-600 bg-surface/70 p-2.5 rounded-xl border border-secondary-100">
                        {unit.area_sqm && (
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-primary-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                </svg>
                                <span>{unit.area_sqm} {isRtl ? 'م²' : 'm²'}</span>
                            </div>
                        )}
                        {unit.rooms && (
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-primary-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span>{unit.rooms} {isRtl ? 'غرف' : 'Rooms'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Actions Footer */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-secondary-100/60 mt-2">
                <button
                    onClick={e => {
                        e.preventDefault();
                        if (!isCompared && compareList.length >= maxItems) {
                            alert(locale === 'ar' ? `لا يمكنك مقارنة أكثر من ${maxItems} وحدات` : `You cannot compare more than ${maxItems} units`);
                            return;
                        }
                        toggleCompare(unit.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${isCompared ? 'text-primary-900 bg-primary-50 border border-primary-200' : 'text-secondary-600 bg-secondary-50 hover:bg-secondary-100 hover:text-secondary-900'}`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    {isCompared ? (isRtl ? 'تمت الإضافة' : 'Compared') : (isRtl ? 'مقارنة' : 'Compare')}
                </button>

                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title={isRtl ? 'تواصل عبر الواتساب' : 'Contact via WhatsApp'}
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    {isRtl ? 'استفسار' : 'Inquire'}
                </a>
            </div>
        </div>
    )
}
