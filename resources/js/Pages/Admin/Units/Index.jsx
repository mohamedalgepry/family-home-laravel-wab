import { usePage, useForm, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow, Select } from '../../../Components/UI'
import Pagination from '../../../Components/UI/Pagination'

export default function AdminUnitsIndex({ units, stats, areas, unitTypes, filters, autoDeleteDays = 30 }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const role = auth?.user?.role

    const [search, setSearch] = useState(filters?.search || '')
    const [areaFilter, setAreaFilter] = useState(filters?.area_id || '')
    const [typeFilter, setTypeFilter] = useState(filters?.type_id || '')
    const [perPage, setPerPage] = useState(filters?.per_page || '15')

    const [showAdjustPointsModal, setShowAdjustPointsModal] = useState(false)
    const [unitToAdjust, setUnitToAdjust] = useState(null)
    const { data: pointsData, setData: setPointsData, post: postPoints, processing: pointsProcessing, reset: resetPoints, errors: pointsErrors } = useForm({
        points: '',
    })

    const [extendModalUnit, setExtendModalUnit] = useState(null)
    const [selectedDuration, setSelectedDuration] = useState('auto_delete_setting')
    const [customDays, setCustomDays] = useState('')
    const [isExtending, setIsExtending] = useState(false)

    function openExtendModal(unit) {
        setExtendModalUnit(unit)
        setSelectedDuration('auto_delete_setting')
        setCustomDays('')
    }

    function submitExtendUnit() {
        if (!extendModalUnit) return
        setIsExtending(true)
        const payload = {
            duration_type: selectedDuration,
        }
        if (selectedDuration === 'custom') {
            payload.days = parseInt(customDays, 10) || autoDeleteDays || 30
        }
        router.post(`/admin/units/${extendModalUnit.id}/extend-expiry`, payload, {
            preserveScroll: true,
            onFinish: () => {
                setIsExtending(false)
                setExtendModalUnit(null)
            },
        })
    }

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
        if (perPage && perPage !== '15') params.per_page = perPage
        router.get('/admin/units', params, { preserveState: true })
    }

    function handlePerPageChange(newVal) {
        setPerPage(newVal)
        const params = {}
        if (search) params.search = search
        if (areaFilter) params.area_id = areaFilter
        if (typeFilter) params.type_id = typeFilter
        if (newVal) params.per_page = newVal
        router.get('/admin/units', params, { preserveState: true })
    }

    function resetFilters() {
        setSearch('')
        setAreaFilter('')
        setTypeFilter('')
        setPerPage('15')
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

    const inputClasses = "w-full px-3.5 py-2.5 bg-surface border border-secondary-200 rounded-xl text-xs font-semibold text-secondary-900 transition-all duration-150 hover:border-secondary-300 focus:bg-white focus:border-[#CC0000] focus:ring-2 focus:ring-red-100 focus:outline-none"

    const totalCount = stats?.total ?? units?.total ?? 0
    const activeCount = stats?.active ?? 0
    const dealsCount = stats?.deals ?? 0
    const pinnedCount = stats?.pinned ?? 0

    const paginationFrom = units?.from ?? (units?.current_page ? (units.current_page - 1) * (units.per_page || 15) + 1 : 1)
    const paginationTo = units?.to ?? (units?.data ? paginationFrom + units.data.length - 1 : 0)

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_units') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
                
                {/* 1. Header & Primary CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-secondary-200/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl sm:text-3xl font-black text-secondary-950 tracking-tight">{trans('sidebar_units')}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-[#CC0000] border border-red-100 tabular-nums">
                                {totalCount}
                            </span>
                        </div>
                        <p className="text-secondary-500 text-xs sm:text-sm font-medium">
                            {isRtl ? 'إدارة وتحديث العقارات والوحدات المتاحة مع التحكم في الأولوية والحالة' : 'Manage and update real estate listings with priority and visibility controls'}
                        </p>
                    </div>
                    <Link
                        href="/admin/units/create"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-[#CC0000] hover:bg-[#b00000] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0 gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{trans('add_unit', {}, 'units')}</span>
                    </Link>
                </div>

                {/* 2. KPI Stats Bento Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Card 1: Total Units */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-secondary-800 flex items-center justify-center shrink-0 border border-slate-200/70">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-secondary-500 block uppercase tracking-wider">{isRtl ? 'إجمالي الوحدات' : 'Total Units'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{totalCount}</span>
                        </div>
                    </div>

                    {/* Card 2: Active Units */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-emerald-700 block uppercase tracking-wider">{isRtl ? 'الوحدات النشطة' : 'Active Units'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{activeCount}</span>
                        </div>
                    </div>

                    {/* Card 3: Hot Deals */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-amber-700 block uppercase tracking-wider">{isRtl ? 'الصفقات المميزة' : 'Deals'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{dealsCount}</span>
                        </div>
                    </div>

                    {/* Card 4: Pinned Listings */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H7.5" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-indigo-700 block uppercase tracking-wider">{isRtl ? 'الوحدات المثبتة' : 'Pinned'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{pinnedCount}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Filter & Search Toolbar */}
                <div className="bg-white rounded-2xl border border-secondary-200/80 shadow-xs p-4 sm:p-5">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                        {/* Search Input (4 cols) */}
                        <div className="lg:col-span-4">
                            <label htmlFor="search-input" className="block text-xs font-bold text-secondary-700 mb-1.5">
                                {trans('search')}
                            </label>
                            <div className="relative">
                                <input
                                    id="search-input"
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={isRtl ? 'البحث بالاسم، المعرف، الكلمات...' : 'Search by title, ID, keywords...'}
                                    className={`${inputClasses} ps-9`}
                                />
                                <svg className="w-4 h-4 text-secondary-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                        </div>

                        {/* Area Filter (3 cols) */}
                        <div className="lg:col-span-3">
                            <label htmlFor="area-filter" className="block text-xs font-bold text-secondary-700 mb-1.5">
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

                        {/* Type Filter (2 cols) */}
                        <div className="lg:col-span-2">
                            <label htmlFor="type-filter" className="block text-xs font-bold text-secondary-700 mb-1.5">
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

                        {/* Per Page Selector (1 col) */}
                        <div className="lg:col-span-1">
                            <label htmlFor="per-page-select" className="block text-xs font-bold text-secondary-700 mb-1.5" title={isRtl ? 'عدد العناصر بالصفحة' : 'Per Page'}>
                                {isRtl ? 'العرض' : 'Per page'}
                            </label>
                            <select
                                id="per-page-select"
                                value={perPage}
                                onChange={e => handlePerPageChange(e.target.value)}
                                className={inputClasses}
                            >
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>

                        {/* Action Buttons (2 cols) */}
                        <div className="lg:col-span-2 flex items-center gap-2">
                            <button
                                type="submit"
                                className="flex-1 py-2.5 px-4 bg-secondary-950 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <span>{trans('search')}</span>
                            </button>

                            {(search || areaFilter || typeFilter || perPage !== '15') && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="p-2.5 bg-surface hover:bg-secondary-200 text-secondary-700 rounded-xl text-xs font-bold transition-all border border-secondary-200 shrink-0"
                                    title={isRtl ? 'إعادة ضبط' : 'Reset'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 4. Desktop & Tablet Data Table */}
                <div className="hidden md:block bg-white rounded-2xl border border-secondary-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-start rtl:text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-secondary-200/90 text-secondary-600 font-extrabold uppercase tracking-wider text-[11px]">
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
                                        <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors group">
                                            {/* Unit Title & Thumbnail */}
                                            <td className="px-4 py-3 min-w-[220px]">
                                                <div className="flex items-center gap-3">
                                                    {thumb ? (
                                                        <img src={thumb} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0 border border-secondary-200/80 shadow-2xs" />
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-secondary-200/80 shrink-0 flex items-center justify-center text-secondary-400">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <Link href={`/admin/units/${unit.id}/edit`} className="text-secondary-950 hover:text-[#CC0000] font-bold text-xs block truncate max-w-[200px] transition-colors">
                                                            {unit.name}
                                                        </Link>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-[10px] text-secondary-400 font-mono">#{unit.id}</span>
                                                            {unit.auto_delete_at && (() => {
                                                                const isExp = new Date(unit.auto_delete_at) <= new Date()
                                                                const daysLeft = Math.ceil((new Date(unit.auto_delete_at) - new Date()) / (1000 * 60 * 60 * 24))
                                                                if (isExp) {
                                                                    return (
                                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200" title={new Date(unit.auto_delete_at).toLocaleDateString()}>
                                                                            {isRtl ? 'منتهية' : 'Expired'}
                                                                        </span>
                                                                    )
                                                                }
                                                                if (daysLeft <= 5) {
                                                                    return (
                                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200" title={new Date(unit.auto_delete_at).toLocaleDateString()}>
                                                                            {isRtl ? `متبقي ${daysLeft} يوم` : `${daysLeft}d left`}
                                                                        </span>
                                                                    )
                                                                }
                                                                return null
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-3 py-3 text-secondary-700 whitespace-nowrap">{unitTypeName}</td>

                                            {/* Area */}
                                            <td className="px-3 py-3 text-secondary-700 whitespace-nowrap">{unitAreaName}</td>

                                            {/* Price */}
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span className="font-black text-[#CC0000] text-xs font-mono">
                                                    {Number(unit.price).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-secondary-500 ms-1 font-semibold">{isRtl ? 'ج.م' : 'EGP'}</span>
                                            </td>

                                            {/* Transaction Type */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${unit.transaction === 'rent' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                                                    {trans(unit.transaction === 'rent' ? 'rent' : 'sale', {}, 'units')}
                                                </span>
                                            </td>

                                            {/* Views */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface border border-secondary-200 rounded-md text-[11px] font-bold text-secondary-800 font-mono">
                                                    <svg className="w-3.5 h-3.5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {unit.views_count || 0}
                                                </span>
                                            </td>

                                            {/* Priority Points (Clean Sharp Badge, No Star) */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50/80 text-amber-900 border border-amber-200/90 rounded-md font-mono font-bold text-xs">
                                                    <span className="text-[9px] font-extrabold text-amber-700 tracking-wider">PTS</span>
                                                    <span>{unit.priority_points}</span>
                                                </span>
                                            </td>

                                            {/* Pinned Toggle */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {role !== 'agent' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePin(unit)}
                                                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all border active:scale-[0.97] ${unit.is_pinned ? 'bg-secondary-950 text-white border-secondary-950 shadow-2xs' : 'bg-surface text-secondary-600 border-secondary-200 hover:bg-secondary-100'}`}
                                                    >
                                                        {unit.is_pinned ? (isRtl ? 'مثبت' : 'Pinned') : (isRtl ? 'تثبيت' : 'Pin')}
                                                    </button>
                                                ) : (
                                                    <span className={`inline-block px-2.5 py-1 text-xs rounded-md font-bold border ${unit.is_pinned ? 'bg-secondary-950 text-white border-secondary-950' : 'bg-surface text-secondary-600 border-secondary-200'}`}>
                                                        {unit.is_pinned ? (isRtl ? 'مثبت' : 'Pinned') : (isRtl ? 'عادي' : 'Normal')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Deal Toggle */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {role !== 'agent' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDeal(unit)}
                                                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all border active:scale-[0.97] ${unit.is_deal ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' : 'bg-surface text-secondary-600 border-secondary-200 hover:bg-secondary-100'}`}
                                                    >
                                                        {unit.is_deal ? (isRtl ? 'صفقة' : 'Deal') : (isRtl ? 'عادي' : 'Normal')}
                                                    </button>
                                                ) : (
                                                    <span className={`inline-block px-2.5 py-1 text-xs rounded-md font-bold border ${unit.is_deal ? 'bg-amber-600 text-white border-amber-600' : 'bg-surface text-secondary-600 border-secondary-200'}`}>
                                                        {unit.is_deal ? (isRtl ? 'صفقة' : 'Deal') : (isRtl ? 'عادي' : 'Normal')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Active Toggle */}
                                            {role !== 'agent' && (
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleActive(unit)}
                                                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all border active:scale-[0.97] ${unit.is_active ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                                                    >
                                                        {unit.is_active ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                                                    </button>
                                                </td>
                                            )}

                                            {/* Action Buttons (Always visible) */}
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* Preview button */}
                                                    <a
                                                        href={`/${locale}/units/${unit.slug || unit.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1.5 text-secondary-700 bg-surface hover:bg-secondary-200 hover:text-secondary-950 rounded-lg transition-all border border-secondary-200 active:scale-95 shadow-2xs"
                                                        title={isRtl ? 'معاينة على الموقع' : 'Preview'}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                        </svg>
                                                    </a>

                                                    {(role !== 'agent' || unit.user_id === auth?.user?.id) && (
                                                        <Link
                                                            href={`/admin/units/${unit.id}/edit`}
                                                            className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 active:scale-95 shadow-2xs"
                                                            title={trans('edit')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </Link>
                                                    )}

                                                    {role !== 'agent' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openAdjustPoints(unit)}
                                                            className="p-1.5 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all border border-amber-200 active:scale-95 shadow-2xs"
                                                            title={trans('adjust_points')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    {role !== 'agent' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openExtendModal(unit)}
                                                            className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all border border-amber-200 active:scale-95 shadow-2xs"
                                                            title={isRtl ? 'تمديد الصلاحية' : 'Extend listing duration'}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    {role !== 'agent' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteUnit(unit)}
                                                            className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 active:scale-95 shadow-2xs"
                                                            title={trans('delete')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={colCount} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-secondary-400">
                                                <svg className="w-12 h-12 mb-3 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                                <p className="text-sm font-bold text-secondary-700">{trans('no_data')}</p>
                                                <p className="text-xs text-secondary-500 mt-0.5">{isRtl ? 'لا توجد وحدات مطابقة لمعايير البحث الحالية.' : 'No units matching the current filter criteria.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Mobile Responsive Card List (Visible only on small screens) */}
                <div className="md:hidden space-y-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-secondary-200/80 animate-pulse h-36" />
                        ))
                    ) : hasUnits ? units.data.map(unit => {
                        const thumb = unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null)
                        const unitTypeName = (locale === 'ar' ? unit.type?.name_ar : unit.type?.name_en) || unit.type?.name_ar || unit.type?.name_en || '—'
                        const unitAreaName = (locale === 'ar' ? unit.area?.name_ar : unit.area?.name_en) || unit.area?.name_ar || unit.area?.name_en || '—'

                        return (
                            <div key={unit.id} className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs space-y-3">
                                <div className="flex items-start gap-3">
                                    {thumb ? (
                                        <img src={thumb} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 border border-secondary-200/80" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-secondary-200/80 shrink-0 flex items-center justify-center text-secondary-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-secondary-400">#{unit.id}</span>
                                            <span className="font-black text-[#CC0000] text-xs font-mono">
                                                {Number(unit.price).toLocaleString()} {isRtl ? 'ج.م' : 'EGP'}
                                            </span>
                                        </div>
                                        <Link href={`/admin/units/${unit.id}/edit`} className="text-secondary-950 font-bold text-xs block truncate">
                                            {unit.name}
                                        </Link>
                                        <p className="text-[11px] text-secondary-500 mt-0.5">{unitTypeName} • {unitAreaName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-secondary-100 text-xs">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-mono font-bold text-[11px]">
                                            PTS {unit.priority_points}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${unit.transaction === 'rent' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                                            {trans(unit.transaction === 'rent' ? 'rent' : 'sale', {}, 'units')}
                                        </span>
                                        {unit.is_deal && <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold">{isRtl ? 'صفقة' : 'Deal'}</span>}
                                        {unit.is_pinned && <span className="px-2 py-0.5 bg-secondary-950 text-white rounded text-[10px] font-bold">{isRtl ? 'مثبت' : 'Pinned'}</span>}
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        <a
                                            href={`/${locale}/units/${unit.slug || unit.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 text-secondary-700 bg-surface border border-secondary-200 rounded-lg"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </a>
                                        <Link
                                            href={`/admin/units/${unit.id}/edit`}
                                            className="p-1.5 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </Link>
                                        {role !== 'agent' && (
                                            <button
                                                type="button"
                                                onClick={() => openExtendModal(unit)}
                                                className="p-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg"
                                                title={isRtl ? 'تمديد الصلاحية' : 'Extend listing duration'}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="bg-white p-8 rounded-2xl border border-secondary-200/80 text-center text-secondary-500 text-xs">
                            {trans('no_data')}
                        </div>
                    )}
                </div>

                {/* 6. Bottom Range Counter & Pagination Control */}
                {hasUnits && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="text-xs font-bold text-secondary-600 order-2 sm:order-1">
                            {isRtl ? (
                                <span>عرض <strong className="text-secondary-950 font-mono">{paginationFrom}</strong> - <strong className="text-secondary-950 font-mono">{paginationTo}</strong> من أصل <strong className="text-secondary-950 font-mono">{totalCount}</strong> وحدة</span>
                            ) : (
                                <span>Showing <strong className="text-secondary-950 font-mono">{paginationFrom}</strong> to <strong className="text-secondary-950 font-mono">{paginationTo}</strong> of <strong className="text-secondary-950 font-mono">{totalCount}</strong> units</span>
                            )}
                        </div>
                        <div className="order-1 sm:order-2">
                            <Pagination meta={units.meta || units} links={units.links} />
                        </div>
                    </div>
                )}

                {/* 7. Adjust Points Modal (Clean & Sharp, No Star) */}
                {showAdjustPointsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 transition-opacity" onClick={() => setShowAdjustPointsModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-secondary-200 transform transition-all" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-5 border-b border-secondary-100 pb-3">
                                <div>
                                    <h3 className="text-base font-black text-secondary-950">{trans('adjust_points')}</h3>
                                    <p className="text-[11px] text-secondary-500 mt-0.5">{unitToAdjust?.name}</p>
                                </div>
                                <button onClick={() => setShowAdjustPointsModal(false)} className="text-secondary-400 hover:text-secondary-950 p-1.5 rounded-lg hover:bg-surface transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleAdjustPoints} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary-700 mb-1.5">{trans('priority_points')} *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={pointsData.points}
                                        onChange={e => setPointsData('points', e.target.value)}
                                        className={inputClasses}
                                        required
                                    />
                                    {pointsErrors.points && <p className="text-xs text-red-600 mt-1.5 font-medium">{pointsErrors.points}</p>}
                                </div>
                                <div className="flex gap-2.5 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAdjustPointsModal(false)} className="px-4 py-2 bg-surface text-secondary-700 hover:bg-secondary-200 border border-secondary-200 rounded-xl text-xs font-bold transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={pointsProcessing} className="px-5 py-2 bg-[#CC0000] text-white hover:bg-[#b00000] rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-xs active:scale-[0.98]">
                                        {pointsProcessing ? trans('loading') : trans('save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 8. Extend Unit Listing Duration Modal */}
                {extendModalUnit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setExtendModalUnit(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl border border-secondary-100 max-w-md w-full p-6 space-y-5 animate-scale-up" onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3 border-b border-secondary-100 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-secondary-900">
                                        {isRtl ? 'تمديد مدة الوحدة' : 'Extend Unit Listing'}
                                    </h3>
                                    <p className="text-xs text-secondary-500 mt-1 line-clamp-1">
                                        {extendModalUnit.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setExtendModalUnit(null)}
                                    className="text-secondary-400 hover:text-secondary-600 p-1 rounded-lg hover:bg-secondary-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Duration Options */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-secondary-700 uppercase tracking-wider block">
                                    {isRtl ? 'اختر مدة التمديد' : 'Select Extension Duration'}
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { id: '7_days', label: isRtl ? '7 أيام' : '7 Days' },
                                        { id: '15_days', label: isRtl ? '15 يوماً' : '15 Days' },
                                        { id: '30_days', label: isRtl ? '30 يوماً' : '30 Days' },
                                        { id: 'auto_delete_setting', label: isRtl ? `مدة الحذف التلقائي الإفتراضية: ${autoDeleteDays} يوم` : `Default Auto-Delete Period: ${autoDeleteDays} Days` },
                                        { id: 'custom', label: isRtl ? 'مدة مخصصة (بالأيام)' : 'Custom Duration (in days)' },
                                    ].map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                selectedDuration === opt.id
                                                    ? 'border-primary-900 bg-primary-50/50 text-primary-950 font-semibold shadow-sm'
                                                    : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="duration_type"
                                                value={opt.id}
                                                checked={selectedDuration === opt.id}
                                                onChange={() => setSelectedDuration(opt.id)}
                                                className="w-4 h-4 text-primary-900 border-secondary-300 focus:ring-primary-900"
                                            />
                                            <span className="text-sm">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Custom days input */}
                                {selectedDuration === 'custom' && (
                                    <div className="pt-2 animate-fade-in">
                                        <label className="text-xs font-semibold text-secondary-600 block mb-1">
                                            {isRtl ? 'عدد الأيام (1 - 365):' : 'Number of days (1 - 365):'}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={customDays}
                                            onChange={(e) => setCustomDays(e.target.value)}
                                            placeholder={isRtl ? 'مثال: 45' : 'e.g. 45'}
                                            className="w-full px-3.5 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-secondary-100">
                                <button
                                    type="button"
                                    onClick={() => setExtendModalUnit(null)}
                                    disabled={isExtending}
                                    className="px-4 py-2 text-sm font-semibold text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-xl transition-colors"
                                >
                                    {isRtl ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={submitExtendUnit}
                                    disabled={isExtending || (selectedDuration === 'custom' && (!customDays || parseInt(customDays, 10) < 1))}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                                >
                                    {isExtending ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>{isRtl ? 'جاري التمديد...' : 'Extending...'}</span>
                                        </>
                                    ) : (
                                        <span>{isRtl ? 'تأكيد التمديد' : 'Confirm Extension'}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminSidebar>
    )
}
