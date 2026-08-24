import { memo } from 'react'
import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useCompare } from '../../Hooks/useCompare'
import OptimizedImage from '../OptimizedImage'
import { getStorageUrl, PLACEHOLDER } from '../../Utils/image'
import { getAgentContacts } from '../../Utils/contact'
import WhatsAppIcon from './WhatsAppIcon'

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100/50">
            <div className="skeleton h-64 w-full" />
            <div className="p-5 space-y-4">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-6 w-1/3 rounded" />
            </div>
        </div>
    )
}

function UnitCard({ unit, loading = false, priority = false }) {
    const page = usePage()
    const { locale, settings } = page.props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const { compareList, toggleCompare, maxItems } = useCompare('unit')

    if (loading) {
        return <SkeletonCard />
    }

    if (!unit) {
        return null;
    }

    const mainImage = unit?.images?.find(img => img.is_main || img.is_primary) || unit?.images?.[0]
    const thumbnail = getStorageUrl(mainImage?.thumb_url || mainImage?.url || mainImage?.path, PLACEHOLDER)
    const isCompared = compareList.includes(unit?.id)

    const agentContacts = getAgentContacts(unit?.user || unit?.project?.user, settings)
    const whatsappPhone = agentContacts.whatsapp
    const whatsappMsg = encodeURIComponent(trans('unit_whatsapp_inquiry', { name: unit?.name || '' }))
    const whatsappLink = `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`

    const areaName = unit.area?.name || (isRtl ? 'مصر' : 'Egypt')
    const imageAlt = unit.alt_text || `${unit.name || (isRtl ? 'عقار' : 'Property')} ${isRtl ? 'في' : 'in'} ${areaName} - ${trans('app_name')}`;

    const unitSlug = isRtl && unit.slug_ar ? unit.slug_ar : (unit.slug_en || unit.slug || unit.id)

    return (
        <article dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-2xl transition-[transform,box-shadow] duration-300 group border border-secondary-100/70 hover:-translate-y-1.5 flex flex-col justify-between">
            <div>
                {/* Image */}
                <Link href={localizedPath(`/units/${unitSlug}`, locale)} className="block relative overflow-hidden aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <OptimizedImage
                        src={thumbnail}
                        alt={imageAlt}
                        width={400}
                        height={300}
                        lazy={true}
                        fallbackSrc={PLACEHOLDER}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>

                    {/* Badges */}
                    <div className="absolute top-3 start-3 flex flex-wrap gap-1.5 z-10">
                        <span className="bg-secondary-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {trans(unit.transaction === 'rent' ? 'rent' : 'sale')}
                        </span>
                    </div>

                    {/* Area tag overlay */}
                    {unit.area?.name && (
                        <span className="absolute bottom-3 start-3 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {unit.area.name}
                        </span>
                    )}
                </Link>

                {/* Details */}
                <div className="p-5">
                    <Link href={localizedPath(`/units/${unitSlug}`, locale)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                        <h2 className="text-base font-bold text-secondary-950 truncate mb-1.5 group-hover:text-primary-900 transition-colors">
                            {unit.name}
                        </h2>
                    </Link>

                    <p className="text-xs font-medium text-secondary-700 mb-3 flex items-center gap-1.5">
                        <span>{typeof unit.type === 'object' ? (unit.type?.name || (locale === 'ar' ? unit.type?.name_ar : unit.type?.name_en) || '') : (unit.type_name || unit.type || '')}</span>
                        {unit.finishing_type && (
                            <>
                                <span className="text-secondary-400" aria-hidden="true">•</span>
                                <span className="text-secondary-700">
                                    {typeof unit.finishing_type === 'object'
                                        ? (unit.finishing_type?.name || (locale === 'ar' ? unit.finishing_type?.name_ar : unit.finishing_type?.name_en) || '')
                                        : unit.finishing_type}
                                </span>
                            </>
                        )}
                    </p>

                    <div className="mb-4">
                        <span className="text-2xl font-black text-primary-900 tracking-tight">
                            {Number(unit.price).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                        </span>
                        <span className="text-xs font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded ms-2">
                            {trans('currency_egp')}
                        </span>
                    </div>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-secondary-800 bg-surface/70 p-2.5 rounded-xl border border-secondary-100">
                        {unit.area_sqm && (
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-primary-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                </svg>
                                <span>{unit.area_sqm} {trans('unit_sqm')}</span>
                            </div>
                        )}
                        {unit.rooms && (
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-primary-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span>{unit.rooms} {trans('rooms')}</span>
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
                    aria-label={`${trans('compare')} ${unit.name}`}
                    aria-pressed={isCompared}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isCompared ? 'text-primary-900 bg-primary-50 border border-primary-200' : 'text-secondary-600 bg-secondary-50 hover:bg-secondary-100 hover:text-secondary-900'}`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    {isCompared ? trans('compared') : trans('compare')}
                </button>

                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    aria-label={`${trans('inquire')} ${unit.name} ${trans('contact_via_whatsapp')}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    title={trans('contact_via_whatsapp')}
                >
                    <WhatsAppIcon className="w-4 h-4" />
                    {trans('inquire')}
                </a>
            </div>
        </article>
    )
}

export default memo(UnitCard)
