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

    const inputClasses = "w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_units') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 md:p-8 rounded-3xl border border-secondary-100 shadow-sm transition-all duration-300">
                    <div>
                        <h1 className="text-3xl font-black text-secondary-950 mb-2">{trans('sidebar_units')}</h1>
                        <p className="text-secondary-500 text-sm">
                            {isRtl ? 'إدارة وتحديث العقارات والوحدات المتاحة على الموقع' : 'Manage and update real estate listings'}
                        </p>
                    </div>
                    <Link
                        href="/admin/units/create"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-[#FFE3E3]"
                    >
                        <svg className="w-5 h-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{trans('add_unit', {}, 'units')}</span>
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-3xl border border-secondary-100 shadow-sm p-6 mb-8 transition-all duration-300">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                        {/* Search Input */}
                        <div>
                            <label htmlFor="search-input" className="block text-sm font-bold text-secondary-900 mb-2">
                                {trans('search')}
                            </label>
                            <div className="relative">
                                <input
                                    id="search-input"
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={isRtl ? 'اسم العقار، العريضة...' : 'Unit title, search...'}
                                    className={`${inputClasses} ps-11`}
                                />
                                <svg className="w-5 h-5 text-secondary-400 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                        </div>

                        {/* Area Filter */}
                        <div>
                            <label htmlFor="area-filter" className="block text-sm font-bold text-secondary-900 mb-2">
                                {trans('area')}
                            </label>
                            <Select
                                id="area-filter"
                                value={areaFilter}
                                onChange={e => setAreaFilter(e.target.value)}
                                className={inputClasses}
                            >
                                <option value="">{isRtl ? 'كل المناطق' : 'All Areas'}</option>
                                {areas?.map(a => <option key={a.id} value={a.id}>{locale === 'ar' ? a.name_ar : a.name_en}</option>)}
                            </Select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label htmlFor="type-filter" className="block text-sm font-bold text-secondary-900 mb-2">
                                {trans('type')}
                            </label>
                            <Select
                                id="type-filter"
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                className={inputClasses}
                            >
                                <option value="">{isRtl ? 'كل الأنواع' : 'All Types'}</option>
                                {unitTypes?.map(t => <option key={t.id} value={t.id}>{locale === 'ar' ? t.name_ar : t.name_en}</option>)}
                            </Select>
                        </div>

                        {/* Action Filter Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-secondary-950 text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-black hover:shadow-lg active:scale-[0.97] flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <span>{trans('search')}</span>
                            </button>

                            {(search || areaFilter || typeFilter) && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-4 py-3 bg-[#F5F5F5] text-[#1A1A1A] rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#E4E4E4] active:scale-[0.97]"
                                    title={isRtl ? 'إعادة ضبط' : 'Reset'}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Main Units Table Card */}
                <div className="bg-white rounded-3xl border border-secondary-100 shadow-sm overflow-hidden transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start rtl:text-right border-collapse">
                            <thead>
                                <tr className="bg-surface border-b border-secondary-100 text-secondary-600 font-bold uppercase tracking-wider text-xs">
                                    <th className="px-6 py-5 text-start">{trans('name')}</th>
                                    <th className="px-4 py-5 text-start">{trans('type', {}, 'units')}</th>
                                    <th className="px-4 py-5 text-start">{trans('area')}</th>
                                    <th className="px-4 py-5 text-start">{trans('price', {}, 'units')}</th>
                                    <th className="px-4 py-5 text-center">{trans('transaction', {}, 'units')}</th>
                                    <th className="px-4 py-5 text-center">{isRtl ? 'الزيارات' : 'Views'}</th>
                                    <th className="px-4 py-5 text-center">{trans('priority_points')}</th>
                                    <th className="px-4 py-5 text-center">{trans('pinned')}</th>
                                    <th className="px-4 py-5 text-center">{trans('is_deal')}</th>
                                    {role !== 'agent' && <th className="px-4 py-5 text-center">{trans('active')}</th>}
                                    <th className="px-6 py-5 text-center">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-50 font-medium">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                                ) : hasUnits ? units.data.map(unit => {
                                    const thumb = unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null)
                                    const unitTypeName = (locale === 'ar' ? unit.type?.name_ar : unit.type?.name_en) || unit.type?.name_ar || unit.type?.name_en || '—'
                                    const unitAreaName = (locale === 'ar' ? unit.area?.name_ar : unit.area?.name_en) || unit.area?.name_ar || unit.area?.name_en || '—'

                                    return (
                                        <tr key={unit.id} className="hover:bg-surface/60 transition-colors group">
                                            {/* Unit Title & Thumbnail */}
                                            <td className="px-6 py-4 min-w-[220px]">
                                                <div className="flex items-center gap-4">
                                                    {thumb ? (
                                                        <img src={thumb} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-secondary-100 shadow-sm" />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-2xl bg-[#F5F5F5] border border-transparent shrink-0 flex items-center justify-center text-secondary-400">
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <Link href={`/admin/units/${unit.id}/edit`} className="text-secondary-950 hover:text-[#CC0000] font-black text-base block truncate max-w-[250px] transition-colors">
                                                            {unit.name}
                                                        </Link>
                                                        <span className="text-xs text-secondary-500 block truncate mt-0.5">#{unit.id}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-4 text-secondary-700 whitespace-nowrap">{unitTypeName}</td>

                                            {/* Area */}
                                            <td className="px-4 py-4 text-secondary-700 whitespace-nowrap">{unitAreaName}</td>

                                            {/* Price */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="font-black text-[#CC0000] text-base">
                                                    {Number(unit.price).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-secondary-500 ms-1 font-medium">{isRtl ? 'ج.م' : 'EGP'}</span>
                                            </td>

                                            {/* Transaction Type */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${unit.transaction === 'rent' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {trans(unit.transaction === 'rent' ? 'rent' : 'sale', {}, 'units')}
                                                </span>
                                            </td>

                                            {/* Views */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] rounded-full text-xs font-bold text-secondary-800">
                                                    <svg className="w-4 h-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {unit.views_count || 0}
                                                </span>
                                            </td>

                                            {/* Priority Points */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
                                                    ⭐ {unit.priority_points}
                                                </span>
                                            </td>

                                            {/* Pinned Toggle */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                {role !== 'agent' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePin(unit)}
                                                        className={`px-3 py-1.5 text-xs rounded-full font-bold transition-all active:scale-[0.97] ${unit.is_pinned ? 'bg-secondary-950 text-white shadow-sm' : 'bg-[#F5F5F5] text-secondary-600 hover:bg-[#E4E4E4]'}`}
                                                    >
                                                        {unit.is_pinned ? (isRtl ? '📌 مثبت' : 'Pinned') : (isRtl ? 'غير مثبت' : 'Unpinned')}
                                                    </button>
                                                ) : (
                                                    <span className={`inline-block px-3 py-1.5 text-xs rounded-full font-bold ${unit.is_pinned ? 'bg-secondary-950 text-white' : 'bg-[#F5F5F5] text-secondary-600'}`}>
                                                        {unit.is_pinned ? (isRtl ? '📌 مثبت' : 'Pinned') : (isRtl ? 'غير مثبت' : 'Unpinned')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Deal Toggle */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                {role !== 'agent' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDeal(unit)}
                                                        className={`px-3 py-1.5 text-xs rounded-full font-bold transition-all active:scale-[0.97] ${unit.is_deal ? 'bg-amber-500 text-white shadow-sm' : 'bg-[#F5F5F5] text-secondary-600 hover:bg-[#E4E4E4]'}`}
                                                    >
                                                        {unit.is_deal ? (isRtl ? '🔥 صفقة' : 'Deal') : (isRtl ? 'عادي' : 'Normal')}
                                                    </button>
                                                ) : (
                                                    <span className={`inline-block px-3 py-1.5 text-xs rounded-full font-bold ${unit.is_deal ? 'bg-amber-500 text-white' : 'bg-[#F5F5F5] text-secondary-600'}`}>
                                                        {unit.is_deal ? (isRtl ? '🔥 صفقة' : 'Deal') : (isRtl ? 'عادي' : 'Normal')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Active Toggle */}
                                            {role !== 'agent' && (
                                                <td className="px-4 py-4 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleActive(unit)}
                                                        className={`px-3 py-1.5 text-xs rounded-full font-bold transition-all active:scale-[0.97] ${unit.is_active ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-red-100 text-red-700'}`}
                                                    >
                                                        {unit.is_active ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                                                    </button>
                                                </td>
                                            )}

                                            {/* Action Buttons (Always visible) */}
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* Preview button */}
                                                    <a
                                                        href={`/${locale}/units/${unit.slug || unit.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-2.5 py-1.5 text-xs font-bold text-primary-900 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all border border-primary-200/70 flex items-center gap-1 active:scale-95 shadow-xs"
                                                        title={isRtl ? 'معاينة على الموقع' : 'Preview'}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{isRtl ? 'معاينة' : 'Preview'}</span>
                                                    </a>

                                                    {(role !== 'agent' || unit.user_id === auth?.user?.id) && (
                                                        <Link
                                                            href={`/admin/units/${unit.id}/edit`}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200/70 flex items-center gap-1 active:scale-95 shadow-xs"
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
                                                            className="px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200/70 flex items-center gap-1 active:scale-95 shadow-xs"
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
                                                            className="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200/70 flex items-center gap-1 active:scale-95 shadow-xs"
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
                                        <td colSpan={colCount} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-secondary-400">
                                                <svg className="w-16 h-16 mb-4 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <p className="text-base font-bold text-secondary-700">{trans('no_data')}</p>
                                                <p className="text-sm mt-1">{isRtl ? 'لا توجد وحدات متاحة أو مطابقة لبحثك.' : 'No units available matching your search.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Adjust Points Modal */}
                {showAdjustPointsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity" onClick={() => setShowAdjustPointsModal(false)}>
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 border border-secondary-100 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-secondary-950">{trans('adjust_points')}</h3>
                                <button onClick={() => setShowAdjustPointsModal(false)} className="text-secondary-400 hover:text-secondary-950 p-2 rounded-full hover:bg-[#F5F5F5] transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleAdjustPoints} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-secondary-900 mb-2">{trans('priority_points')} *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={pointsData.points}
                                        onChange={e => setPointsData('points', e.target.value)}
                                        className={inputClasses}
                                        required
                                    />
                                    {pointsErrors.points && <p className="text-xs text-red-500 mt-2 font-medium">{pointsErrors.points}</p>}
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAdjustPointsModal(false)} className="px-6 py-3 bg-[#F5F5F5] text-secondary-800 rounded-xl text-sm font-bold hover:bg-[#E4E4E4] transition-colors active:scale-[0.97]">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={pointsProcessing} className="px-6 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold hover:bg-[#B00000] transition-colors disabled:opacity-50 shadow-md active:scale-[0.97]">
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
