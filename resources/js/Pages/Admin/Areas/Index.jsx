import { usePage, useForm, Link, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminAreasIndex({ areas }) {
    const { locale, flash, errors } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [editing, setEditing] = useState(null)
    const [showSeo, setShowSeo] = useState(false)

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        name_ar: '',
        name_en: '',
        is_active: true,
        sort_order: 0,
        meta_title_ar: '',
        meta_title_en: '',
        meta_description_ar: '',
        meta_description_en: '',
        meta_keywords_ar: '',
        meta_keywords_en: '',
        image_path: '',
    })

    function startCreate() {
        setEditing('new')
        setShowSeo(false)
        reset()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function startEdit(area) {
        setEditing(area.id)
        setShowSeo(false)
        setData({
            name_ar: area.name_ar || '',
            name_en: area.name_en || '',
            is_active: area.is_active ?? true,
            sort_order: area.sort_order || 0,
            meta_title_ar: area.meta_title_ar || '',
            meta_title_en: area.meta_title_en || '',
            meta_description_ar: area.meta_description_ar || '',
            meta_description_en: area.meta_description_en || '',
            meta_keywords_ar: Array.isArray(area.meta_keywords_ar) ? area.meta_keywords_ar.join(', ') : (area.meta_keywords_ar || ''),
            meta_keywords_en: Array.isArray(area.meta_keywords_en) ? area.meta_keywords_en.join(', ') : (area.meta_keywords_en || ''),
            image_path: area.image_path || '',
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function cancelEdit() {
        setEditing(null)
        setShowSeo(false)
        reset()
    }

    function handleSubmit(e) {
        e.preventDefault()

        const payload = {
            ...data,
            meta_keywords_ar: typeof data.meta_keywords_ar === 'string' 
                ? data.meta_keywords_ar.split(',').map(k => k.trim()).filter(Boolean)
                : data.meta_keywords_ar,
            meta_keywords_en: typeof data.meta_keywords_en === 'string'
                ? data.meta_keywords_en.split(',').map(k => k.trim()).filter(Boolean)
                : data.meta_keywords_en,
        }

        if (editing === 'new') {
            post('/admin/areas', {
                data: payload,
                preserveScroll: true,
                onSuccess: () => { setEditing(null); reset() },
            })
        } else {
            put(`/admin/areas/${editing}`, {
                data: payload,
                preserveScroll: true,
                onSuccess: () => { setEditing(null); reset() },
            })
        }
    }

    function handleDelete(area) {
        if (confirm(trans('confirm_delete'))) {
            destroy(`/admin/areas/${area.id}`, { preserveScroll: true })
        }
    }

    // Modern input classes following Impeccable guidelines
    const inputClasses = "w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"
    const labelClasses = "block text-sm font-bold text-secondary-900 mb-2"

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_areas') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-secondary-950 mb-1">{trans('sidebar_areas')}</h1>
                        <p className="text-secondary-500 text-sm">{isRtl ? 'إدارة مناطق العقارات والبحث' : 'Manage real estate areas and search locations'}</p>
                    </div>
                    {editing !== 'new' && (
                        <button 
                            onClick={startCreate} 
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-[#FFE3E3]"
                        >
                            <svg className="w-5 h-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {trans('add')}
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div className="mb-8 px-6 py-4 bg-green-50 border border-green-100 text-green-800 rounded-2xl flex items-center shadow-sm">
                        <svg className="w-6 h-6 text-green-500 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Create / Edit Form */}
                {(editing === 'new' || typeof editing === 'number') && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-secondary-100 overflow-hidden mb-10 transition-all duration-300">
                        <div className="bg-surface/50 px-8 py-6 border-b border-secondary-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-secondary-950 flex items-center gap-2">
                                <span className="w-2 h-6 bg-[#CC0000] rounded-full inline-block"></span>
                                {editing === 'new' ? (isRtl ? 'إضافة منطقة جديدة' : 'Add New Area') : (isRtl ? 'تعديل المنطقة' : 'Edit Area')}
                            </h2>
                            <button type="button" onClick={cancelEdit} className="text-secondary-400 hover:text-secondary-700 transition-colors rounded-full p-2 hover:bg-secondary-100">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={labelClasses}>{trans('name_ar')} <span className="text-[#CC0000]">*</span></label>
                                    <input type="text" value={data.name_ar} onChange={e => setData('name_ar', e.target.value)} required dir="rtl" className={inputClasses} placeholder="مثال: التجمع الخامس" />
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('name_en')} <span className="text-[#CC0000]">*</span></label>
                                    <input type="text" value={data.name_en} onChange={e => setData('name_en', e.target.value)} required dir="ltr" className={inputClasses} placeholder="e.g. Fifth Settlement" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className={labelClasses}>{trans('sort_order')}</label>
                                    <input type="number" min="0" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className={inputClasses} />
                                </div>
                                <div className="flex flex-col justify-center pt-2 md:pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                            <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${data.is_active ? 'bg-[#16a34a]' : 'bg-secondary-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${data.is_active ? 'transform translate-x-6' : ''}`}>
                                                {data.is_active && (
                                                    <svg className="w-4 h-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-secondary-900 group-hover:text-[#CC0000] transition-colors">{data.is_active ? trans('active') : trans('inactive')}</span>
                                    </label>
                                </div>
                            </div>

                            {/* SEO Section */}
                            <div className="border border-secondary-200 rounded-2xl overflow-hidden mb-8 transition-all duration-300">
                                <button
                                    type="button"
                                    onClick={() => setShowSeo(!showSeo)}
                                    className={`flex items-center justify-between w-full px-6 py-4 text-sm font-bold focus:outline-none transition-colors ${showSeo ? 'bg-surface text-[#CC0000] border-b border-secondary-200' : 'bg-white text-secondary-800 hover:bg-surface'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        {isRtl ? 'إعدادات الـ SEO ومعاينة المشاركة' : 'SEO & Social Share Settings'}
                                    </span>
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${showSeo ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showSeo && (
                                    <div className="p-6 bg-surface/30 space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-secondary-700 mb-2">
                                                {isRtl ? 'صورة المعاينة (رابط الصورة / Image URL)' : 'Social Share Cover Image URL'}
                                            </label>
                                            <input type="text" value={data.image_path} onChange={e => setData('image_path', e.target.value)} placeholder="https://..." className={inputClasses} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-700 mb-2">{isRtl ? 'عنوان الـ Meta (عربي)' : 'Meta Title (AR)'}</label>
                                                <input type="text" value={data.meta_title_ar} onChange={e => setData('meta_title_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-700 mb-2">{isRtl ? 'عنوان الـ Meta (إنجليزي)' : 'Meta Title (EN)'}</label>
                                                <input type="text" value={data.meta_title_en} onChange={e => setData('meta_title_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-700 mb-2">{isRtl ? 'وصف الـ Meta (عربي)' : 'Meta Description (AR)'}</label>
                                                <textarea rows={3} value={data.meta_description_ar} onChange={e => setData('meta_description_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-700 mb-2">{isRtl ? 'وصف الـ Meta (إنجليزي)' : 'Meta Description (EN)'}</label>
                                                <textarea rows={3} value={data.meta_description_en} onChange={e => setData('meta_description_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-700 mb-2">{isRtl ? 'الكلمات المفتاحية (عربي - مفصولة بفاصلة)' : 'Meta Keywords (AR - comma separated)'}</label>
                                                <input type="text" value={data.meta_keywords_ar} onChange={e => setData('meta_keywords_ar', e.target.value)} dir="rtl" placeholder="عقارات, شقق, مشاريع" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary-700 mb-2">{isRtl ? 'الكلمات المفتاحية (إنجليزي - مفصولة بفاصلة)' : 'Meta Keywords (EN - comma separated)'}</label>
                                                <input type="text" value={data.meta_keywords_en} onChange={e => setData('meta_keywords_en', e.target.value)} dir="ltr" placeholder="real estate, apartments, projects" className={inputClasses} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button type="submit" disabled={processing} className="px-8 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-[#FFE3E3] disabled:opacity-70 disabled:cursor-not-allowed">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {trans('loading')}
                                        </span>
                                    ) : trans('save')}
                                </button>
                                <button type="button" onClick={cancelEdit} className="px-8 py-3 bg-[#F5F5F5] text-[#1A1A1A] rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#E4E4E4] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-secondary-200">
                                    {trans('cancel')}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Areas List */}
                <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface border-b border-secondary-100 text-secondary-600 text-left text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">{trans('name_ar')}</th>
                                    <th className="px-6 py-4">{trans('name_en')}</th>
                                    <th className="px-6 py-4">{trans('status')}</th>
                                    <th className="px-6 py-4">{trans('sort_order')}</th>
                                    <th className="px-6 py-4 text-right">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-50">
                                {areas?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-secondary-400">
                                                <svg className="w-16 h-16 mb-4 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p className="text-base font-bold text-secondary-700">{trans('no_data')}</p>
                                                <p className="text-sm mt-1">{isRtl ? 'لم يتم إضافة أي مناطق حتى الآن.' : 'No areas have been added yet.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {areas?.map(area => (
                                    <tr key={area.id} className="hover:bg-surface/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-secondary-950">{area.name_ar}</div>
                                        </td>
                                        <td className="px-6 py-4 text-secondary-700">{area.name_en}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${area.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                                {area.is_active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 me-1.5"></span>}
                                                {!area.is_active && <span className="w-1.5 h-1.5 rounded-full bg-red-500 me-1.5"></span>}
                                                {area.is_active ? trans('active') : trans('inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary-700 font-medium">
                                            <span className="bg-surface px-2 py-1 rounded text-xs border border-secondary-200">{area.sort_order}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(area)} className="p-2 text-primary-900 bg-primary-50 hover:bg-[#CC0000] hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-900" title={trans('edit')}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
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
            </div>
        </AdminSidebar>
    )
}
