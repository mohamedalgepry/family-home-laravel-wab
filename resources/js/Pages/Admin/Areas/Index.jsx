import { usePage, Link, Head, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
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
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface border-b border-secondary-100 text-secondary-600 text-left text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">{trans('image')}</th>
                                    <th className="px-6 py-4">{trans('area')}</th>
                                    <th className="px-6 py-4">{trans('projects')}</th>
                                    <th className="px-6 py-4">{trans('units')}</th>
                                    <th className="px-6 py-4">{trans('status')}</th>
                                    <th className="px-6 py-4 text-right">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-50">
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
                                    <tr key={area.id} className="hover:bg-surface/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            {area.hero_image ? (
                                                <img src={`/storage/${area.hero_image}`} alt={area.name_ar} className="w-16 h-12 rounded-lg object-cover border border-secondary-200" />
                                            ) : (
                                                <div className="w-16 h-12 rounded-lg bg-secondary-100 flex items-center justify-center border border-secondary-200">
                                                    <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-secondary-950">{area.name_ar}</div>
                                            <div className="text-xs text-secondary-500 mt-1">{area.name_en}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-secondary-800">{area.projects_count}</td>
                                        <td className="px-6 py-4 font-bold text-secondary-800">{area.units_count}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${area.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                {area.is_active ? trans('active') : trans('inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <a href={`/${locale}/areas/${area.slug || area.id}`} target="_blank" rel="noreferrer" className="p-2 text-primary-900 bg-primary-50 hover:bg-[#CC0000] hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-900" title={trans('preview')}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </a>
                                                <Link href={`/admin/areas/${area.id}/edit`} className="p-2 text-primary-900 bg-primary-50 hover:bg-[#CC0000] hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-900" title={trans('edit')}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </Link>
                                                <button onClick={() => handleDelete(area)} className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" title={trans('delete')}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
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
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}
