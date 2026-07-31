import { usePage, useForm, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminCategoriesIndex({ categories }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [editingId, setEditingId] = useState(null)

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name_ar: '',
        name_en: '',
    })

    function startCreate() {
        setEditingId(null)
        reset()
    }

    function startEdit(category) {
        setEditingId(category.id)
        setData({
            name_ar: category.name_ar,
            name_en: category.name_en,
        })
    }

    function cancelEdit() {
        setEditingId(null)
        reset()
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (editingId) {
            put(`/admin/categories/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            })
        } else {
            post('/admin/categories', {
                preserveScroll: true,
                onSuccess: () => reset(),
            })
        }
    }

    function confirmDelete(categoryId) {
        if (window.confirm(trans('confirm_delete'))) {
            router.delete(`/admin/categories/${categoryId}`, { preserveScroll: true })
        }
    }

    const nameKey = isRtl ? 'name_ar' : 'name_en'

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_categories') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_categories')}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-card p-6 h-fit">
                        <h2 className="text-lg font-semibold text-secondary-950 mb-4">
                            {editingId ? trans('edit') : trans('create')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar')} *</label>
                                <input type="text" value={data.name_ar} onChange={e => setData('name_ar', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.name_ar && <p className="text-xs text-error mt-1">{errors.name_ar}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en') } *</label>
                                <input type="text" value={data.name_en} onChange={e => setData('name_en', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.name_en && <p className="text-xs text-error mt-1">{errors.name_en}</p>}
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50">
                                    {processing ? trans('loading') : (editingId ? trans('update') : trans('save'))}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                    <th className="px-4 py-3 font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">{trans('name_ar') }</th>
                                    <th className="px-4 py-3 font-medium">{trans('name_en') }</th>
                                    <th className="px-4 py-3 font-medium">{trans('slug') }</th>
                                    <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? categories.map(c => (
                                    <tr key={c.id} className="border-t border-secondary-100 hover:bg-surface/50 transition-colors">
                                        <td className="px-4 py-3 text-muted text-xs">{c.id}</td>
                                        <td className="px-4 py-3 font-medium text-secondary-950">{c.name_ar}</td>
                                        <td className="px-4 py-3 text-secondary-700">{c.name_en}</td>
                                        <td className="px-4 py-3 text-xs text-muted">{c.slug}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 items-center">
                                                <button onClick={() => startEdit(c)} className="text-xs px-2 py-1 rounded bg-surface text-secondary-700 hover:bg-secondary-200 transition-colors">
                                                    {trans('edit')}
                                                </button>
                                                <button onClick={() => confirmDelete(c.id)} className="text-xs px-2 py-1 rounded bg-error/10 text-error hover:bg-error/20 transition-colors">
                                                    {trans('delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-muted">
                                            {trans('no_data')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminSidebar>
    )
}
