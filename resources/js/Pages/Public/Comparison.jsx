import { usePage, Link, router } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { localizedPath } from '../../Utils/route'
import Header from '../../Components/Layout/Header'
import Footer from '../../Components/Layout/Footer'
import SeoHead from '../../Components/UI/SeoHead'
import CompareSearch from '../../Components/Features/CompareSearch'
import { useCompare } from '../../Hooks/useCompare'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23F0F0F0" width="400" height="300"/%3E%3C/svg%3E'

function getItemImage(item) {
    const img = item.images?.[0]
    return img?.url || (img?.path ? (img.path.startsWith('http') || img.path.startsWith('/storage') ? img.path : `/storage/${img.path}`) : PLACEHOLDER)
}

function calcScore(item, best) {
    if (!best) return null
    const price = Number(item.price)
    const area = Number(item.area_sqm)
    const rooms = Number(item.rooms)
    let score = 0
    if (best.bestPrice && price) score += (1 - (price - best.bestPrice) / ((best.worstPrice || best.bestPrice) - best.bestPrice || 1)) * 40
    else score += 20
    if (best.bestArea && area) score += (area / (best.bestArea || 1)) * 30
    else score += 15
    if (best.bestRooms && rooms) score += (rooms / (best.bestRooms || 1)) * 30
    else score += 15
    return Math.round(Math.min(score, 100))
}

function getBestValues(items) {
    const prices = items.map(i => Number(i.price)).filter(v => !isNaN(v))
    const areas = items.map(i => Number(i.area_sqm)).filter(v => !isNaN(v))
    const rooms = items.map(i => Number(i.rooms)).filter(v => !isNaN(v))
    return {
        bestPrice: prices.length ? Math.min(...prices) : null,
        worstPrice: prices.length ? Math.max(...prices) : null,
        bestArea: areas.length ? Math.max(...areas) : null,
        bestRooms: rooms.length ? Math.max(...rooms) : null,
    }
}

function ScoreBadge({ score }) {
    const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-secondary-400'
    return (
        <div className={`w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center text-sm font-bold shadow-sm`}>
            {score}
        </div>
    )
}

function DetailRow({ label, value, isBest }) {
    return (
        <div className="flex items-center justify-between py-1.5 px-3 rounded-lg text-xs odd:bg-secondary-50/50">
            <span className="text-secondary-500">{label}</span>
            <span className={`font-semibold text-end ${isBest ? 'text-emerald-600' : 'text-secondary-800'}`}>{value ?? '—'}</span>
        </div>
    )
}

function FeatureBadge({ name }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-800 text-[10px] font-medium rounded-md border border-primary-100">
            <svg className="w-2.5 h-2.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {name}
        </span>
    )
}

function ComparisonSection({ type, title, items, maxItems, isRtl, locale, trans }) {
    const { compareList } = useCompare(type)
    const { toggleCompare } = useCompare(type)
    const hasItems = items?.length > 0
    const best = hasItems ? getBestValues(items) : null

    function handleRemove(id) {
        toggleCompare(id)
        const newIds = items.map(i => i.id).filter(i => i !== id)
        router.get(localizedPath(`/compare?type=${type}&ids=${newIds.join(',')}`, locale), {}, { preserveState: true })
    }

    if (!hasItems) return null

    return (
        <section className="mb-10">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-secondary-950">{title}</h2>
                    <span className="text-xs text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full font-medium">
                        {items.length} / {maxItems}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={localizedPath(type === 'unit' ? '/units' : '/projects', locale)}
                        className="px-3 py-1.5 text-xs font-semibold text-primary-900 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {trans('browse')}
                    </Link>
                    <CompareSearch type={type} currentIds={items.map(i => i.id)} />
                </div>
            </div>

            {/* Card grid */}
            <div className={`grid gap-4 ${items.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : items.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                {items.map(item => {
                    const price = Number(item.price)
                    const area = Number(item.area_sqm)
                    const ppsqm = price && area ? Math.round(price / area) : null
                    const score = type === 'unit' ? calcScore(item, best) : null
                    const features = item.features || []

                    return (
                        <div key={item.id} className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow group">
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={getItemImage(item)}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {score && (
                                    <div className="absolute top-2 end-2">
                                        <ScoreBadge score={score} />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="absolute top-2 start-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary-400 hover:text-red-600 hover:bg-white transition-colors shadow-xs"
                                    title={trans('remove_from_compare')}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <Link href={localizedPath(type === 'unit' ? `/units/${item.slug}` : `/projects/${item.slug}`, locale)}>
                                    <h3 className="text-sm font-bold text-secondary-950 truncate hover:text-primary-900 transition-colors mb-3">
                                        {item.name}
                                    </h3>
                                </Link>

                                {type === 'unit' && (
                                    <div className="space-y-1">
                                        <DetailRow label={trans('price')} value={price.toLocaleString()} isBest={price === best?.bestPrice && price > 0} />
                                        {ppsqm && <DetailRow label={trans('price_per_sqm') || 'Price/m²'} value={ppsqm.toLocaleString()} />}
                                        <DetailRow label={trans('area_sqm')} value={area ? `${area} m²` : '—'} isBest={area === best?.bestArea} />
                                        <DetailRow label={trans('rooms')} value={item.rooms} isBest={Number(item.rooms) === best?.bestRooms} />
                                        <DetailRow label={trans('bathrooms') || 'Bathrooms'} value={item.bathrooms} />
                                        {item.floor !== null && item.floor !== undefined && <DetailRow label={trans('floor') || 'Floor'} value={item.floor} />}
                                        <DetailRow label={trans('transaction')} value={trans(item.transaction === 'rent' ? 'rent' : 'sale')} />
                                        {item.type?.name && <DetailRow label={trans('unit_type') || 'Type'} value={item.type.name} />}
                                        {item.area?.name && <DetailRow label={trans('area')} value={item.area.name} />}
                                        {item.finishing_type?.name && <DetailRow label={trans('finishing') || 'Finishing'} value={item.finishing_type.name} />}
                                        {item.payment_method && <DetailRow label={trans('payment_method') || 'Payment'} value={item.payment_method} />}
                                        {item.down_payment && <DetailRow label={trans('down_payment') || 'Down'} value={item.down_payment} />}
                                        {item.installment_years && <DetailRow label={trans('installment_years') || 'Installment'} value={`${item.installment_years} ${trans('years')}`} />}
                                    </div>
                                )}

                                {type === 'project' && (
                                    <div className="space-y-1">
                                        {item.area?.name && <DetailRow label={trans('area')} value={item.area.name} />}
                                        {item.location_address && <DetailRow label={trans('location')} value={item.location_address} />}
                                        {item.finishing_type?.name && <DetailRow label={trans('finishing') || 'Finishing'} value={item.finishing_type.name} />}
                                        {item.payment_method && <DetailRow label={trans('payment_method') || 'Payment'} value={item.payment_method} />}
                                        {item.down_payment && <DetailRow label={trans('down_payment') || 'Down'} value={item.down_payment} />}
                                        <DetailRow label={trans('units_count')} value={item.units_count ?? item.units?.length ?? 0} />
                                    </div>
                                )}

                                {/* Features */}
                                {features.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-secondary-100">
                                        <p className="text-[10px] text-secondary-400 font-medium mb-1.5">{trans('features')}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {features.slice(0, 5).map(f => (
                                                <FeatureBadge key={f.id} name={f.name} />
                                            ))}
                                            {features.length > 5 && (
                                                <span className="text-[10px] text-secondary-400 px-1 py-1">+{features.length - 5}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action */}
                                <div className="mt-3 pt-3 border-t border-secondary-100 flex gap-2">
                                    <Link
                                        href={localizedPath(type === 'unit' ? `/units/${item.slug}` : `/projects/${item.slug}`, locale)}
                                        className="flex-1 block text-center py-2 bg-primary-900/5 hover:bg-primary-900 text-primary-900 hover:text-white text-xs font-semibold rounded-xl transition-colors"
                                    >
                                        {trans('show_more')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Side-by-side comparison table (2+ items, units only) */}
            {items.length >= 2 && type === 'unit' && (
                <div className="mt-6 bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
                    <div className="p-4 border-b border-secondary-100 bg-surface/50">
                        <h3 className="text-sm font-bold text-secondary-950 flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {trans('detailed_comparison')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface">
                                    <th className="px-4 py-3 text-start text-secondary-500 font-medium w-36 text-xs">{trans('feature')}</th>
                                    {items.map(item => (
                                        <th key={item.id} className="px-4 py-3 text-center text-xs font-bold text-secondary-950">{item.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { key: 'price', label: trans('price'), fmt: v => Number(v).toLocaleString(), bestOf: 'min' },
                                    { key: 'area_sqm', label: trans('area_sqm'), fmt: v => v ? `${v} m²` : '—', bestOf: 'max' },
                                    { key: 'rooms', label: trans('rooms'), fmt: v => v || '—', bestOf: 'max' },
                                    { key: 'bathrooms', label: trans('bathrooms') || 'Bathrooms', fmt: v => v || '—', bestOf: 'max' },
                                    { key: 'floor', label: trans('floor') || 'Floor', fmt: v => v ?? '—', bestOf: null },
                                    { key: null, label: trans('price_per_sqm') || 'Price/m²', fmt: (_, item) => {
                                        const p = Number(item.price); const a = Number(item.area_sqm)
                                        return p && a ? Math.round(p / a).toLocaleString() : '—'
                                    }, bestOf: 'min' },
                                ].map(row => (
                                    <tr key={row.key || 'ppsqm'} className="border-t border-secondary-100">
                                        <td className="px-4 py-3 text-xs text-secondary-500">{row.label}</td>
                                        {items.map(item => {
                                            let val = row.fmt(row.key ? item[row.key] : null, item)
                                            let isBest = false
                                            if (row.bestOf && item[row.key]) {
                                                const vals = items.map(i => Number(i[row.key])).filter(v => !isNaN(v))
                                                if (vals.length) {
                                                    const bestVal = row.bestOf === 'min' ? Math.min(...vals) : Math.max(...vals)
                                                    isBest = Number(item[row.key]) === bestVal
                                                }
                                            }
                                            return (
                                                <td key={item.id} className={`px-4 py-3 text-center text-xs font-medium ${isBest ? 'text-emerald-600 bg-emerald-50/50' : 'text-secondary-800'}`}>
                                                    {val}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                                {/* Finishing type */}
                                <tr className="border-t border-secondary-100">
                                    <td className="px-4 py-3 text-xs text-secondary-500">{trans('finishing') || 'Finishing'}</td>
                                    {items.map(item => (
                                        <td key={item.id} className="px-4 py-3 text-center text-xs text-secondary-800">{item.finishing_type?.name || '—'}</td>
                                    ))}
                                </tr>
                                {/* Payment method */}
                                <tr className="border-t border-secondary-100">
                                    <td className="px-4 py-3 text-xs text-secondary-500">{trans('payment_method') || 'Payment'}</td>
                                    {items.map(item => (
                                        <td key={item.id} className="px-4 py-3 text-center text-xs text-secondary-800">{item.payment_method || '—'}</td>
                                    ))}
                                </tr>
                                {/* Description */}
                                {items[0]?.description && (
                                    <tr className="border-t border-secondary-100">
                                        <td className="px-4 py-3 text-xs text-secondary-500">{trans('description')}</td>
                                        {items.map(item => (
                                            <td key={item.id} className="px-4 py-3 text-center text-xs text-secondary-600 max-w-48">
                                                <p className="line-clamp-3 leading-relaxed">{item.description || '—'}</p>
                                            </td>
                                        ))}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    )
}

export default function Comparison({ items, type, max_items }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const units = type === 'unit' ? (items || []) : []
    const projects = type === 'project' ? (items || []) : []
    const { compareList: unitList } = useCompare('unit')
    const { compareList: projectList } = useCompare('project')

    const hasAny = units.length > 0 || projects.length > 0

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${trans('compare')} - ${trans('site_title')}`}
                description={trans('comparison_description')}
            />
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-6 w-full">
                {!hasAny ? (
                    <div className="text-center py-20 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-secondary-950 mb-2">
                            {trans('compare_properties')}
                        </h2>
                        <p className="text-sm text-secondary-500 mb-6 leading-relaxed">
                            {isRtl
                                ? 'أضف وحدات أو مشاريع إلى المقارنة لترى الفروقات بينها وتختار الأنسب لك.'
                                : 'Add units or projects to compare and find the best option for you.'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link href={localizedPath('/units', locale)} className="px-5 py-2.5 bg-primary-900 text-white text-sm font-semibold rounded-xl hover:bg-primary-950 transition-colors">
                                {trans('units')}
                            </Link>
                            <Link href={localizedPath('/projects', locale)} className="px-5 py-2.5 bg-secondary-100 text-secondary-700 text-sm font-semibold rounded-xl hover:bg-secondary-200 transition-colors">
                                {trans('projects')}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-900/10 text-primary-900 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-secondary-950">{trans('compare')}</h1>
                                    <p className="text-xs text-secondary-500">
                                        {trans('compare_options_subtitle')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 bg-secondary-100 rounded-xl p-1">
                                <Link
                                    href={localizedPath(`/compare?type=unit&ids=${unitList.join(',')}`, locale)}
                                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${type === 'unit' ? 'bg-white text-primary-900 shadow-xs' : 'text-secondary-600 hover:text-secondary-900'}`}
                                >
                                    {trans('units')}
                                    {unitList.length > 0 && <span className="ms-1.5 text-[10px] opacity-60">({unitList.length})</span>}
                                </Link>
                                <Link
                                    href={localizedPath(`/compare?type=project&ids=${projectList.join(',')}`, locale)}
                                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${type === 'project' ? 'bg-white text-primary-900 shadow-xs' : 'text-secondary-600 hover:text-secondary-900'}`}
                                >
                                    {trans('projects')}
                                    {projectList.length > 0 && <span className="ms-1.5 text-[10px] opacity-60">({projectList.length})</span>}
                                </Link>
                            </div>
                        </div>

                        {units.length > 0 && (
                            <ComparisonSection
                                type="unit"
                                title={trans('units')}
                                items={units}
                                maxItems={max_items}
                                isRtl={isRtl}
                                locale={locale}
                                trans={trans}
                            />
                        )}

                        {projects.length > 0 && (
                            <ComparisonSection
                                type="project"
                                title={trans('projects')}
                                items={projects}
                                maxItems={max_items}
                                isRtl={isRtl}
                                locale={locale}
                                trans={trans}
                            />
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
