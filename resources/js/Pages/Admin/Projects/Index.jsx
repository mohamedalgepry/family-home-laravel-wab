import { usePage, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow, Select } from '../../../Components/UI'
import Pagination from '../../../Components/UI/Pagination'

export default function AdminProjectsIndex({ projects, stats, areas, filters }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isAdminOrManager = auth?.user?.role === 'admin' || auth?.user?.role === 'manager'

    const [search, setSearch] = useState(filters?.search || '')
    const [areaFilter, setAreaFilter] = useState(filters?.area_id || '')
    const [perPage, setPerPage] = useState(filters?.per_page || '15')

    function applyFilters() {
        const params = {}
        if (search) params.search = search
        if (areaFilter) params.area_id = areaFilter
        if (perPage && perPage !== '15') params.per_page = perPage
        router.get('/admin/projects', params, { preserveState: true })
    }

    function handlePerPageChange(newVal) {
        setPerPage(newVal)
        const params = {}
        if (search) params.search = search
        if (areaFilter) params.area_id = areaFilter
        if (newVal) params.per_page = newVal
        router.get('/admin/projects', params, { preserveState: true })
    }

    function resetFilters() {
        setSearch('')
        setAreaFilter('')
        setPerPage('15')
        router.get('/admin/projects', {}, { preserveState: true })
    }

    function deleteProject(project) {
        if (confirm(trans('confirm_delete'))) {
            router.delete(`/admin/projects/${project.id}`, { preserveScroll: true })
        }
    }

    const loading = !projects
    const hasProjects = projects?.data?.length > 0

    const inputClasses = "w-full px-3.5 py-2.5 bg-surface border border-secondary-200 rounded-xl text-xs font-semibold text-secondary-900 transition-all duration-150 hover:border-secondary-300 focus:bg-white focus:border-[#CC0000] focus:ring-2 focus:ring-red-100 focus:outline-none"

    const totalCount = stats?.total ?? projects?.total ?? 0
    const activeCount = stats?.active ?? 0
    const totalUnitsInProjects = stats?.total_units ?? 0

    const paginationFrom = projects?.from ?? (projects?.current_page ? (projects.current_page - 1) * (projects.per_page || 15) + 1 : 1)
    const paginationTo = projects?.to ?? (projects?.data ? paginationFrom + projects.data.length - 1 : 0)

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_projects') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto min-h-screen">
                
                {/* 1. Header & Primary CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-secondary-200/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl sm:text-3xl font-black text-secondary-950 tracking-tight">{trans('sidebar_projects')}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-[#CC0000] border border-red-100 tabular-nums">
                                {totalCount}
                            </span>
                        </div>
                        <p className="text-secondary-500 text-xs sm:text-sm font-medium">
                            {isRtl ? 'إدارة وتحديث الكمبوندات والمشاريع العقارية الكبرى وتفاصيلها' : 'Manage and update real estate compounds and major development projects'}
                        </p>
                    </div>
                    {isAdminOrManager && (
                        <Link
                            href="/admin/projects/create"
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#CC0000] hover:bg-[#b00000] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0 gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>{trans('add_project', {}, 'projects')}</span>
                        </Link>
                    )}
                </div>

                {/* 2. KPI Stats Bento Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {/* Card 1: Total Projects */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-secondary-800 flex items-center justify-center shrink-0 border border-slate-200/70">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-secondary-500 block uppercase tracking-wider">{isRtl ? 'إجمالي المشاريع' : 'Total Projects'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{totalCount}</span>
                        </div>
                    </div>

                    {/* Card 2: Active Projects */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-emerald-700 block uppercase tracking-wider">{isRtl ? 'المشاريع النشطة' : 'Active Projects'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{activeCount}</span>
                        </div>
                    </div>

                    {/* Card 3: Total Units in Projects */}
                    <div className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.75a1.125 1.125 0 00-1.125-1.125H4.875C4.254 2.625 3.75 3.129 3.75 3.75V21h4.5z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-blue-700 block uppercase tracking-wider">{isRtl ? 'إجمالي الوحدات بالمشاريع' : 'Units in Projects'}</span>
                            <span className="text-lg font-black text-secondary-950 tabular-nums">{totalUnitsInProjects}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Filter Toolbar */}
                <div className="bg-white rounded-2xl border border-secondary-200/80 shadow-xs p-4 sm:p-5">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                        {/* Search Input (5 cols) */}
                        <div className="lg:col-span-5">
                            <label htmlFor="search-input" className="block text-xs font-bold text-secondary-700 mb-1.5">
                                {trans('search')}
                            </label>
                            <div className="relative">
                                <input
                                    id="search-input"
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={isRtl ? 'البحث باسم المشروع، المعرف، الكلمات...' : 'Search by project name, ID, keywords...'}
                                    className={`${inputClasses} ps-9`}
                                />
                                <svg className="w-4 h-4 text-secondary-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                        </div>

                        {/* Area Filter (4 cols) */}
                        <div className="lg:col-span-4">
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

                            {(search || areaFilter || perPage !== '15') && (
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

                {/* 4. Desktop Table View */}
                <div className="hidden md:block bg-white rounded-2xl border border-secondary-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-start rtl:text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-secondary-200/90 text-secondary-600 font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="px-4 py-3.5 text-start">{trans('name')}</th>
                                    <th className="px-3 py-3.5 text-start">{trans('area')}</th>
                                    <th className="px-3 py-3.5 text-center">{trans('units_count')}</th>
                                    <th className="px-3 py-3.5 text-center">{isRtl ? 'الزيارات' : 'Views'}</th>
                                    <th className="px-3 py-3.5 text-center">{trans('active')}</th>
                                    <th className="px-4 py-3.5 text-center">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 font-medium">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                                ) : hasProjects ? projects.data.map(project => {
                                    const thumb = project.images?.[0]?.url || (project.images?.[0]?.path ? `/storage/${project.images[0].path}` : null)
                                    const projectName = (locale === 'ar' ? project.name_ar : project.name_en) || project.name_ar || project.name_en || project.name
                                    const projectAreaName = project.area ? ((locale === 'ar' ? project.area.name_ar : project.area.name_en) || project.area.name_ar || project.area.name_en) : '—'

                                    return (
                                        <tr key={project.id} className="hover:bg-slate-50/60 transition-colors group">
                                            {/* Project Title & Thumbnail */}
                                            <td className="px-4 py-3 min-w-[240px]">
                                                <div className="flex items-center gap-3">
                                                    {thumb ? (
                                                        <img src={thumb} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0 border border-secondary-200/80 shadow-2xs" />
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-secondary-200/80 shrink-0 flex items-center justify-center text-secondary-400">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        {isAdminOrManager ? (
                                                            <Link href={`/admin/projects/${project.id}/edit`} className="text-secondary-950 hover:text-[#CC0000] font-bold text-xs block truncate max-w-[220px] transition-colors">
                                                                {projectName}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-secondary-950 font-bold text-xs block truncate max-w-[220px]">{projectName}</span>
                                                        )}
                                                        <span className="text-[10px] text-secondary-400 font-mono block mt-0.5">#{project.id}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Area */}
                                            <td className="px-3 py-3 text-secondary-700 whitespace-nowrap">{projectAreaName}</td>

                                            {/* Units Count */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface text-secondary-900 rounded-md border border-secondary-200 text-xs font-bold font-mono">
                                                    {project.units_count ?? 0} {isRtl ? 'وحدة' : 'units'}
                                                </span>
                                            </td>

                                            {/* Views */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface rounded-md text-xs font-bold text-secondary-800 border border-secondary-200 font-mono">
                                                    <svg className="w-3.5 h-3.5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {project.views_count || 0}
                                                </span>
                                            </td>

                                            {/* Active Badge */}
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-xs rounded-md font-bold border ${project.is_active ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {project.is_active ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                                                </span>
                                            </td>

                                            {/* Action Buttons (Always visible) */}
                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                {isAdminOrManager ? (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <a
                                                            href={`/${locale}/projects/${project.slug || project.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 text-secondary-700 bg-surface hover:bg-secondary-200 hover:text-secondary-950 rounded-lg transition-all border border-secondary-200 active:scale-95 shadow-2xs"
                                                            title={isRtl ? 'معاينة على الموقع' : 'Preview'}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                            </svg>
                                                        </a>

                                                        <Link
                                                            href={`/admin/projects/${project.id}/edit`}
                                                            className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 active:scale-95 shadow-2xs"
                                                            title={trans('edit')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProject(project)}
                                                            className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 active:scale-95 shadow-2xs"
                                                            title={trans('delete')}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-secondary-400 font-normal">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-secondary-400">
                                                <svg className="w-12 h-12 mb-3 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                                <p className="text-sm font-bold text-secondary-700">{trans('no_data')}</p>
                                                <p className="text-xs text-secondary-500 mt-0.5">{isRtl ? 'لا توجد مشاريع مطابقة لمعايير البحث الحالية.' : 'No projects matching the current filter criteria.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Mobile Responsive Card List */}
                <div className="md:hidden space-y-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-secondary-200/80 animate-pulse h-28" />
                        ))
                    ) : hasProjects ? projects.data.map(project => {
                        const thumb = project.images?.[0]?.url || (project.images?.[0]?.path ? `/storage/${project.images[0].path}` : null)
                        const projectName = (locale === 'ar' ? project.name_ar : project.name_en) || project.name_ar || project.name_en || project.name
                        const projectAreaName = project.area ? ((locale === 'ar' ? project.area.name_ar : project.area.name_en) || project.area.name_ar || project.area.name_en) : '—'

                        return (
                            <div key={project.id} className="bg-white p-4 rounded-2xl border border-secondary-200/80 shadow-xs space-y-3">
                                <div className="flex items-start gap-3">
                                    {thumb ? (
                                        <img src={thumb} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-secondary-200/80" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-secondary-200/80 shrink-0 flex items-center justify-center text-secondary-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-secondary-400">#{project.id}</span>
                                            <span className={`px-2 py-0.5 text-[10px] rounded font-bold border ${project.is_active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                {project.is_active ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                                            </span>
                                        </div>
                                        {isAdminOrManager ? (
                                            <Link href={`/admin/projects/${project.id}/edit`} className="text-secondary-950 font-bold text-xs block truncate">
                                                {projectName}
                                            </Link>
                                        ) : (
                                            <span className="text-secondary-950 font-bold text-xs block truncate">{projectName}</span>
                                        )}
                                        <p className="text-[11px] text-secondary-500 mt-0.5">{projectAreaName} • {project.units_count ?? 0} {isRtl ? 'وحدة' : 'units'}</p>
                                    </div>
                                </div>

                                {isAdminOrManager && (
                                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-secondary-100">
                                        <a
                                            href={`/${locale}/projects/${project.slug || project.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 text-secondary-700 bg-surface border border-secondary-200 rounded-lg"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </a>
                                        <Link
                                            href={`/admin/projects/${project.id}/edit`}
                                            className="p-1.5 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => deleteProject(project)}
                                            className="p-1.5 text-red-700 bg-red-50 border border-red-200 rounded-lg"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }) : (
                        <div className="bg-white p-8 rounded-2xl border border-secondary-200/80 text-center text-secondary-500 text-xs">
                            {trans('no_data')}
                        </div>
                    )}
                </div>

                {/* 6. Bottom Range Counter & Pagination Control */}
                {hasProjects && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="text-xs font-bold text-secondary-600 order-2 sm:order-1">
                            {isRtl ? (
                                <span>عرض <strong className="text-secondary-950 font-mono">{paginationFrom}</strong> - <strong className="text-secondary-950 font-mono">{paginationTo}</strong> من أصل <strong className="text-secondary-950 font-mono">{totalCount}</strong> مشروع</span>
                            ) : (
                                <span>Showing <strong className="text-secondary-950 font-mono">{paginationFrom}</strong> to <strong className="text-secondary-950 font-mono">{paginationTo}</strong> of <strong className="text-secondary-950 font-mono">{totalCount}</strong> projects</span>
                            )}
                        </div>
                        <div className="order-1 sm:order-2">
                            <Pagination meta={projects.meta || projects} links={projects.links} />
                        </div>
                    </div>
                )}

            </div>
        </AdminSidebar>
    )
}
