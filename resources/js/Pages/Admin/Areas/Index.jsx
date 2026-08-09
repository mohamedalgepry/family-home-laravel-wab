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

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_areas') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_areas')}</h1>
                    {editing !== 'new' && (
                        <button onClick={startCreate} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950">
                            {trans('add')}
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}

                {/* Create / Edit Form */}
                {(editing === 'new' || typeof editing === 'number') && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 mb-6">
                        <h2 className="text-lg font-bold text-secondary-950 mb-4">
                            {editing === 'new' ? (isRtl ? 'إضافة منطقة جديدة' : 'Add New Area') : (isRtl ? 'تعديل المنطقة' : 'Edit Area')}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar')}</label>
                                <input type="text" value={data.name_ar} onChange={e => setData('name_ar', e.target.value)} required dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en')}</label>
                                <input type="text" value={data.name_en} onChange={e => setData('name_en', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('sort_order')}</label>
                                <input type="number" min="0" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white" />
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer" />
                                    <span className="text-sm font-medium text-secondary-950">{data.is_active ? trans('active') : trans('inactive')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Collapsible SEO Fields Section */}
                        <div className="border-t border-secondary-200 pt-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setShowSeo(!showSeo)}
                                className="flex items-center justify-between w-full text-sm font-bold text-primary-900 hover:text-primary-950 focus:outline-none mb-3"
                            >
                                <span>🔍 {isRtl ? 'إعدادات الـ SEO ومعاينة رابط المشاركة (Open Graph)' : 'SEO & Social Share Preview Settings'}</span>
                                <span>{showSeo ? '▲' : '▼'}</span>
                            </button>

                            {showSeo && (
                                <div className="space-y-4 bg-surface p-4 rounded-xl border border-secondary-200">
                                    <div>
                                        <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                            {isRtl ? 'صورة المعاينة عند المشاركة (رابط الصورة / Image URL)' : 'Social Share Cover Image URL'}
                                        </label>
                                        <input 
                                            type="text" 
                                            value={data.image_path} 
                                            onChange={e => setData('image_path', e.target.value)} 
                                            placeholder="https://..." 
                                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                                {isRtl ? 'عنوان الـ Meta (عربي)' : 'Meta Title (AR)'}
                                            </label>
                                            <input type="text" value={data.meta_title_ar} onChange={e => setData('meta_title_ar', e.target.value)} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                                {isRtl ? 'عنوان الـ Meta (إنجليزي)' : 'Meta Title (EN)'}
                                            </label>
                                            <input type="text" value={data.meta_title_en} onChange={e => setData('meta_title_en', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                                {isRtl ? 'وصف الـ Meta (عربي)' : 'Meta Description (AR)'}
                                            </label>
                                            <textarea rows={2} value={data.meta_description_ar} onChange={e => setData('meta_description_ar', e.target.value)} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                                {isRtl ? 'وصف الـ Meta (إنجليزي)' : 'Meta Description (EN)'}
                                            </label>
                                            <textarea rows={2} value={data.meta_description_en} onChange={e => setData('meta_description_en', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                                {isRtl ? 'الكلمات المفتاحية (عربي - مفصولة بفاصلة)' : 'Meta Keywords (AR - comma separated)'}
                                            </label>
                                            <input type="text" value={data.meta_keywords_ar} onChange={e => setData('meta_keywords_ar', e.target.value)} dir="rtl" placeholder="عقارات, شقق, مشاريع" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                                {isRtl ? 'الكلمات المفتاحية (إنجليزي - مفصولة بفاصلة)' : 'Meta Keywords (EN - comma separated)'}
                                            </label>
                                            <input type="text" value={data.meta_keywords_en} onChange={e => setData('meta_keywords_en', e.target.value)} placeholder="real estate, apartments, projects" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-xs bg-white" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50">
                                {processing ? trans('loading') : trans('save')}
                            </button>
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200">
                                {trans('cancel')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Areas List */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-left">
                                <th className="px-4 py-3 font-medium">{trans('name_ar')}</th>
                                <th className="px-4 py-3 font-medium">{trans('name_en')}</th>
                                <th className="px-4 py-3 font-medium">{trans('status')}</th>
                                <th className="px-4 py-3 font-medium">{trans('sort_order')}</th>
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {areas?.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">{trans('no_data')}</td></tr>
                            )}
                            {areas?.map(area => (
                                <tr key={area.id} className="hover:bg-surface/50">
                                    <td className="px-4 py-3 text-secondary-950 font-medium">{area.name_ar}</td>
                                    <td className="px-4 py-3 text-secondary-950">{area.name_en}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${area.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {area.is_active ? trans('active') : trans('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-700">{area.sort_order}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(area)} className="text-xs text-primary-900 hover:text-primary-950 font-medium">{trans('edit')}</button>
                                            <button onClick={() => handleDelete(area)} className="text-xs text-red-600 hover:text-red-700 font-medium">{trans('delete')}</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminSidebar>
    )
}
