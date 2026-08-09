import { usePage, useForm, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow, Select } from '../../../Components/UI'

export default function AdminUnitsIndex({ units, areas, unitTypes, filters }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const role = auth?.user?.role

    const [search, setSearch] = useState(filters?.search || '')
    const [areaFilter, setAreaFilter] = useState(filters?.area_id || '')
    const [typeFilter, setTypeFilter] = useState(filters?.type_id || '')

    const [showAdjustPointsModal, setShowAdjustPointsModal] = useState(false)
    const [unitToAdjust, setUnitToAdjust] = useState(null)
    const { data: pointsData, setData: setPointsData, post: postPoints, processing: pointsProcessing, reset: resetPoints, errors: pointsErrors } = useForm({
        points: '',
    })

    function openAdjustPoints(unit) {
        setUnitToAdjust(unit)
        setPointsData('points', unit.priority_points)
        setShowAdjustPointsModal(true)
    }

    function handleAdjustPoints(e) {
        e.preventDefault()
        postPoints(`/admin/units/${unitToAdjust.id}/adjust-points`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAdjustPointsModal(false)
                setUnitToAdjust(null)
                resetPoints()
            },
        })
    }

    function applyFilters() {
        const params = {}
        if (search) params.search = search
        if (areaFilter) params.area_id = areaFilter
        if (typeFilter) params.type_id = typeFilter
        router.get('/admin/units', params, { preserveState: true })
    }

    function resetFilters() {
        setSearch('')
        setAreaFilter('')
        setTypeFilter('')
        router.get('/admin/units', {}, { preserveState: true })
    }

    function togglePin(unit) {
        router.post(`/admin/units/${unit.id}/pin`, {}, { preserveScroll: true })
    }

    function toggleDeal(unit) {
        router.post(`/admin/units/${unit.id}/deal`, {}, { preserveScroll: true })
    }

    function toggleActive(unit) {
        router.post(`/admin/units/${unit.id}/active`, {}, { preserveScroll: true })
    }

    function deleteUnit(unit) {
        if (confirm(trans('confirm_delete'))) {
            router.delete(`/admin/units/${unit.id}`, { preserveScroll: true })
        }
    }

    const loading = !units
    const hasUnits = units?.data?.length > 0
    const colCount = role === 'agent' ? 10 : 11

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_units') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

                {/* Top Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-secondary-200/70 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black text-secondary-950">{trans('sidebar_units')}</h1>
                        <p className="text-xs text-muted mt-0.5">
                            {isRtl ? 'إدارة وتحديث العقارات والوحدات المتاحة على الموقع' : 'Manage and update real estate listings'}
                        </p>
                    </div>
                    <Link
                        href="/admin/units/create"
                        className="px-4 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{trans('add_unit', {}, 'units')}</span>
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl border border-secondary-200/70 shadow-sm p-4 sm:p-5">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                        {/* Search Input */}
                        <div>
                            <label htmlFor="search-input" className="block text-xs font-bold text-secondary-700 mb-1">
                                {trans('search')}
                            </label>
                            <div className="relative">
                                <input
                                    id="search-input"
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={isRtl ? 'اسم العقار، العريضة...' : 'Unit title, search...'}
                                    className="w-full ps-9 pe-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
                                />
                                <svg className="w-4 h-4 text-secondary-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                        </div>

                        {/* Area Filter */}
                        <div>
                            <label htmlFor="area-filter" className="block text-xs font-bold text-secondary-700 mb-1">
                                {trans('area')}
                            </label>
                            <Select
                                id="area-filter"
                                value={areaFilter}
                                onChange={e => setAreaFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
                            >
                                <option value="">{isRtl ? 'كل المناطق' : 'All Areas'}</option>
                                {areas?.map(a => <option key={a.id} value={a.id}>{locale === 'ar' ? a.name_ar : a.name_en}</option>)}
                            </Select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label htmlFor="type-filter" className="block text-xs font-bold text-secondary-700 mb-1">
                                {trans('type')}
                            </label>
                            <Select
                                id="type-filter"
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
                            >
                                <option value="">{isRtl ? 'كل الأنواع' : 'All Types'}</option>
                                {unitTypes?.map(t => <option key={t.id} value={t.id}>{locale === 'ar' ? t.name_ar : t.name_en}</option>)}
                            </Select>
                        </div>

                        {/* Action Filter Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <span>{trans('search')}</span>
                            </button>

                            {(search || areaFilter || typeFilter) && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-3 py-2 bg-surface hover:bg-secondary-200 text-secondary-700 rounded-xl text-xs font-bold transition-all border border-secondary-200"
                                    title={isRtl ? 'إعادة ضبط' : 'Reset'}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Main Units Table Card */}
                <div className="bg-white rounded-2xl border border-secondary-200/70 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-start rtl:text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-secondary-200/80 text-secondary-600 font-bold uppercase tracking-wider">
                                    <th className="px-4 py-3.5 text-start">{trans('name')}</th>
                                    <th className="px-3 py-3.5 text-start">{trans('type', {}, 'units')}</th>
                                    <th className="px-3 py-3.5 text-start">{trans('area')}</th>
                                    <th className="px-3 py-3.5 text-start">{trans('price', {}, 'units')}</th>
                                    <th className="px-3 py-3.5 text-center">{trans('transaction', {}, 'units')}</th>
                                    <th className="px-3 py-3.5 text-center">{isRtl ? 'الزيارات' : 'Views'}</th>
                                    <th className="px-3 py-3.5 text-center">{trans('priority_points')}</th>
                                    <th className="px-3 py-3.5 text-center">{trans('pinned')}</th>
                                    <th className="px-3 py-3.5 text-center">{trans('is_deal')}</th>
                                    {role !== 'agent' && <th className="px-3 py-3.5 text-center">{trans('active')}</th>}
                                    <th className="px-4 py-3.5 text-center">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 font-medium">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                                ) : hasUnits ? units.data.map(unit => {
                                    const thumb = unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null)
                                    const unitTypeName = (locale === 'ar' ? unit.type?.name_ar : unit.type?.name_en) || unit.type?.name_ar || unit.type?.name_en || '—'
                                    const unitAreaName = (locale === 'ar' ? unit.area?.name_ar : unit.area?.name_en) || unit.area?.name_ar || unit.area?.name_en || '—'

                                    return (
                                        <tr key={unit.id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* Unit Title & Thumbnail */}
                                            <td className="px-4 py-3 min-w-[180px]">
                                                <div className="flex items-center gap-3">
                                                    {thumb ? (
                                                        <img src={thumb} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-secondary-200 shadow-xs" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-surface border border-secondary-200 shrink-0 flex items-center justify-center text-secondary-400">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <Link href={`/admin/units/${unit.id}/edit`} className="text-secondary-950 hover:text-primary-900 font-bold block truncate max-w-[200px]">
                                                            {unit.name}
                                                        </Link>
                                                        <span className="text-[11px] text-muted block truncate">#{unit.id}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-3 py-3 text-secondary-700 whitespace-nowrap">{unitTypeName}</td>

                                            {/* Area */}
                                            <td className="px-3 py-3 text-secondary-700 whitespace-nowrap">{unitAreaName}</td>

                                            {/* Price */}
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span className="font-extrabold text-secondary-950">
                                                    {Number(unit.price).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-muted ms-1 font-normal">{isRtl ? 'ج.م' : 'EGP'}</span>
                                            </td>

                                            {/* Transaction Type */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${unit.transaction === 'rent' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                                    {trans(unit.transaction === 'rent' ? 'rent' : 'sale', {}, 'units')}
                                                </span>
                                            </td>

                                            {/* Views */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface rounded-lg text-xs font-bold text-secondary-800 border border-secondary-200">
                                                    <svg className="w-3.5 h-3.5 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {unit.views_count || 0}
                                                </span>
                                            </td>

                                            {/* Priority Points */}
                                            <td className="px-3 py-3 text-center font-bold text-secondary-900 whitespace-nowrap">
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200/70 text-xs">
                                                    ⭐ {unit.priority_points}
                                                </span>
                                            </td>

                                            {/* Pinned Toggle */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {role !== 'agent' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePin(unit)}
                                                        className={`px-2.5 py-1 text-xs rounded-full font-bold transition-all active:scale-95 ${unit.is_pinned ? 'bg-primary-900 text-white shadow-xs' : 'bg-surface text-secondary-600 border border-secondary-200 hover:bg-secondary-100'}`}
                                                    >
                                                        {unit.is_pinned ? (isRtl ? '📌 مثبت' : 'Pinned') : (isRtl ? 'غير مثبت' : 'Unpinned')}
                                                    </button>
                                                ) : (
                                                    <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-bold ${unit.is_pinned ? 'bg-primary-900 text-white' : 'bg-surface text-secondary-600 border border-secondary-200'}`}>
                                                        {unit.is_pinned ? (isRtl ? '📌 مثبت' : 'Pinned') : (isRtl ? 'غير مثبت' : 'Unpinned')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Deal Toggle */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {role !== 'agent' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDeal(unit)}
                                                        className={`px-2.5 py-1 text-xs rounded-full font-bold transition-all active:scale-95 ${unit.is_deal ? 'bg-amber-500 text-white shadow-xs' : 'bg-surface text-secondary-600 border border-secondary-200 hover:bg-secondary-100'}`}
                                                    >
                                                        {unit.is_deal ? (isRtl ? '🔥 صفقة' : 'Deal') : (isRtl ? 'عادي' : 'Normal')}
                                                    </button>
                                                ) : (
                                                    <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-bold ${unit.is_deal ? 'bg-amber-500 text-white' : 'bg-surface text-secondary-600 border border-secondary-200'}`}>
                                                        {unit.is_deal ? (isRtl ? '🔥 صفقة' : 'Deal') : (isRtl ? 'عادي' : 'Normal')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Active Toggle */}
                                            {role !== 'agent' && (
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleActive(unit)}
                                                        className={`px-2.5 py-1 text-xs rounded-full font-bold transition-all active:scale-95 ${unit.is_active ? 'bg-emerald-600 text-white shadow-xs' : 'bg-red-50 text-red-600 border border-red-200'}`}
                                                    >
                                                        {unit.is_active ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                                                    </button>
                                                </td>
                                            )}

                                            {/* Action Buttons (Side-by-Side) */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {(role !== 'agent' || unit.user_id === auth?.user?.id) && (
                                                        <Link
                                                            href={`/admin/units/${unit.id}/edit`}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200/70 flex items-center gap-1 active:scale-95"
                                                            title={trans('edit')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                            <span>{trans('edit')}</span>
                                                        </Link>
                                                    )}

                                                    {role !== 'agent' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openAdjustPoints(unit)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200/70 flex items-center gap-1 active:scale-95"
                                                            title={trans('adjust_points')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.411.87-.833.618L12 17.771l-4.665 2.716c-.422.246-.949-.132-.833-.618l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                            </svg>
                                                            <span>{isRtl ? 'النقاط' : 'Points'}</span>
                                                        </button>
                                                    )}

                                                    {role !== 'agent' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteUnit(unit)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200/70 flex items-center gap-1 active:scale-95"
                                                            title={trans('delete')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                            <span>{trans('delete')}</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={colCount} className="px-4 py-12 text-center text-muted">{trans('no_data')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Adjust Points Modal */}
                {showAdjustPointsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => setShowAdjustPointsModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-secondary-200" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-secondary-950">{trans('adjust_points')}</h3>
                                <button onClick={() => setShowAdjustPointsModal(false)} className="text-secondary-400 hover:text-secondary-950 text-xl font-bold leading-none">&times;</button>
                            </div>
                            <form onSubmit={handleAdjustPoints} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary-950 mb-1">{trans('priority_points')} *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={pointsData.points}
                                        onChange={e => setPointsData('points', e.target.value)}
                                        className="w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
                                        required
                                    />
                                    {pointsErrors.points && <p className="text-xs text-error mt-1">{pointsErrors.points}</p>}
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAdjustPointsModal(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-xl text-xs font-bold hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={pointsProcessing} className="px-4 py-2 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 shadow-xs">
                                        {pointsProcessing ? trans('loading') : trans('save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AdminSidebar>
    )
}
