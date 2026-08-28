import { usePage, Link, Head, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { getStorageUrl } from '../../../Utils/image'
import { useState, useEffect, useRef } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminAreasIndex({ areas, filters }) {
    const { locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [search, setSearch] = useState(filters.search || '')
    const [status, setStatus] = useState(filters.status || '')
    const searchTimeout = useRef(null)

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        
        searchTimeout.current = setTimeout(() => {
            const params = {}
            if (search) params.search = search
            if (status) params.status = status
            
            router.get('/admin/areas', params, { preserveState: true, preserveScroll: true, replace: true })
        }, 500)

        return () => clearTimeout(searchTimeout.current)
    }, [search, status])

    function handleDelete(area) {
        if (confirm(trans('confirm_delete'))) {
            router.delete(`/admin/areas/${area.id}`, { preserveScroll: true })
        }
    }

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_areas') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-secondary-950 mb-1">{trans('sidebar_areas')}</h1>
                        <p className="text-secondary-500 text-sm">{trans('manage_areas')}</p>
                    </div>
                    <Link 
                        href="/admin/areas/create" 
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-[#FFE3E3]"
                    >
                        <svg className="w-5 h-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {trans('add')}
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-8 px-6 py-4 bg-green-50 border border-green-100 text-green-800 rounded-2xl flex items-center shadow-sm">
                        <svg className="w-6 h-6 text-green-500 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-secondary-100 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder={trans('search_area')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full px-4 py-2.5 bg-surface border-2 border-transparent rounded-xl text-sm focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] transition-all"
                        />
                    </div>
                    <div className="sm:w-48">
                        <select 
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 bg-surface border-2 border-transparent rounded-xl text-sm focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] transition-all"
                        >
                            <option value="">{trans('all_status')}</option>
                            <option value="active">{trans('active')}</option>
                            <option value="inactive">{trans('inactive')}</option>
                        </select>
                    </div>
                </div>

                {/* Areas List */}
                <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start rtl:text-right border-collapse">
                            <thead>
                                <tr className="bg-surface border-b border-secondary-100 text-secondary-600 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4 text-start w-24">{trans('image')}</th>
                                    <th className="px-6 py-4 text-start">{trans('area')}</th>
                                    <th className="px-4 py-4 text-center whitespace-nowrap">{trans('projects')}</th>
                                    <th className="px-4 py-4 text-center whitespace-nowrap">{trans('units')}</th>
                                    <th className="px-4 py-4 text-center whitespace-nowrap">{trans('status')}</th>
                                    <th className="px-6 py-4 text-center whitespace-nowrap">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-50 font-medium">
                                {areas?.data?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-secondary-400">
                                                <svg className="w-16 h-16 mb-4 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <p className="text-base font-bold text-secondary-700">{trans('no_data')}</p>
                                                <p className="text-sm mt-1">{trans('no_areas_found')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {areas?.data?.map(area => (
                                    <tr key={area.id} className="hover:bg-surface/60 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap w-24">
                                            {area.image_path || area.hero_image ? (
                                                <img 
                                                    src={getStorageUrl(area.image_path || area.hero_image)} 
                                                    alt={area.name_ar} 
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    className="w-16 h-12 rounded-xl object-cover border border-secondary-200 shadow-xs" 
                                                />
                                            ) : (
                                                <div className="w-16 h-12 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100 text-primary-700">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <Link href={`/admin/areas/${area.id}/edit`} className="font-bold text-secondary-950 text-base hover:text-primary-900 transition-colors block">
                                                {area.name_ar}
                                            </Link>
                                            <div className="text-xs text-secondary-500 mt-0.5">{area.name_en}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-surface text-secondary-900 rounded-lg border border-secondary-200 text-xs font-bold">
                                                {area.projects_count ?? 0} {isRtl ? 'مشروع' : 'projects'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-surface text-secondary-900 rounded-lg border border-secondary-200 text-xs font-bold">
                                                {area.units_count ?? 0} {isRtl ? 'وحدة' : 'units'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${area.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                {area.is_active ? trans('active') : trans('inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <a 
                                                    href={`/${locale}/areas/${area.slug || area.id}`} 
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
                                                <Link 
                                                    href={`/admin/areas/${area.id}/edit`} 
                                                    className="px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200/70 flex items-center gap-1 active:scale-95 shadow-xs" 
                                                    title={trans('edit')}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                    <span>{trans('edit')}</span>
                                                </Link>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleDelete(area)} 
                                                    className="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200/70 flex items-center gap-1 active:scale-95 shadow-xs" 
                                                    title={trans('delete')}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    <span>{trans('delete')}</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Pagination */}
                {areas?.links && areas.data.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {areas.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    link.active 
                                        ? 'bg-[#CC0000] text-white' 
                                        : !link.url 
                                            ? 'bg-transparent text-secondary-300 cursor-not-allowed' 
                                            : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
                                }`}
                                children={link.label.replace(/&laquo;|&lsaquo;/g, '«').replace(/&raquo;|&rsaquo;/g, '»')}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}
