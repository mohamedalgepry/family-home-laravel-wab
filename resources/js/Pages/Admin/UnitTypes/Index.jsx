import { usePage, useForm, Link, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminUnitTypesIndex({ unitTypes }) {
    const { locale, flash, errors } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [editing, setEditing] = useState(null)

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        name_ar: '',
        name_en: '',
        is_active: true,
        sort_order: 0,
    })

    function startCreate() {
        setEditing('new')
        reset()
    }

    function startEdit(type) {
        setEditing(type.id)
        setData({
            name_ar: type.name_ar,
            name_en: type.name_en,
            is_active: type.is_active,
            sort_order: type.sort_order,
        })
    }

    function cancelEdit() {
        setEditing(null)
        reset()
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (editing === 'new') {
            post('/admin/unit-types', {
                preserveScroll: true,
                onSuccess: () => { setEditing(null); reset() },
            })
        } else {
            put(`/admin/unit-types/${editing}`, {
                preserveScroll: true,
                onSuccess: () => { setEditing(null); reset() },
            })
        }
    }

    function handleDelete(type) {
        if (confirm(trans('confirm_delete'))) {
            destroy(`/admin/unit-types/${type.id}`, { preserveScroll: true })
        }
    }

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_unit_types') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_unit_types')}</h1>
                    {editing !== 'new' && (
                        <button onClick={startCreate} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950">
                            {trans('add')}
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div role="alert" aria-live="polite" className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}

                {(editing === 'new' || typeof editing === 'number') && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar')}</label>
                                <input type="text" value={data.name_ar} onChange={e => setData('name_ar', e.target.value)} required dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en')}</label>
                                <input type="text" value={data.name_en} onChange={e => setData('name_en', e.target.value)} required dir="ltr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mb-4">
                            <label className="flex items-center gap-2 text-sm text-secondary-700">
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded text-primary-900 focus:ring-primary-900" />
                                {trans('active')}
                            </label>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-secondary-700">{trans('sort_order')}</label>
                                <input type="number" min="0" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className="w-20 px-3 py-1.5 border border-secondary-200 rounded-lg text-sm bg-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50">
                                {trans('save')}
                            </button>
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200">
                                {trans('cancel')}
                            </button>
                        </div>
                    </form>
                )}

                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start">
                                <th className="px-4 py-3 font-medium">{trans('name_ar')}</th>
                                <th className="px-4 py-3 font-medium">{trans('name_en')}</th>
                                <th className="px-4 py-3 font-medium">{trans('status')}</th>
                                <th className="px-4 py-3 font-medium">{trans('sort_order')}</th>
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {unitTypes?.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">{trans('no_data')}</td></tr>
                            )}
                            {unitTypes?.map(type => (
                                <tr key={type.id} className="hover:bg-surface/50">
                                    <td className="px-4 py-3 text-secondary-950">{type.name_ar}</td>
                                    <td className="px-4 py-3 text-secondary-950">{type.name_en}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${type.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {type.is_active ? trans('active') : trans('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-secondary-700">{type.sort_order}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(type)} className="text-xs text-primary-900 hover:text-primary-950 font-medium">{trans('edit')}</button>
                                            <button onClick={() => handleDelete(type)} className="text-xs text-red-600 hover:text-red-700 font-medium">{trans('delete')}</button>
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
