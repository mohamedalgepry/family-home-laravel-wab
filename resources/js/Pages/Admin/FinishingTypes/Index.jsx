import { usePage, useForm, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminFinishingTypesIndex({ finishingTypes }) {
    const { locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [editing, setEditing] = useState(null)

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        name_ar: '',
        name_en: '',
    })

    function startCreate() {
        setEditing('new')
        reset()
    }

    function startEdit(finishingType) {
        setEditing(finishingType.id)
        setData({
            name_ar: finishingType.name_ar,
            name_en: finishingType.name_en,
        })
    }

    function cancelEdit() {
        setEditing(null)
        reset()
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (editing === 'new') {
            post('/admin/finishing-types', {
                preserveScroll: true,
                onSuccess: () => { setEditing(null); reset() },
            })
        } else {
            put(`/admin/finishing-types/${editing}`, {
                preserveScroll: true,
                onSuccess: () => { setEditing(null); reset() },
            })
        }
    }

    function handleDelete(finishingType) {
        if (confirm(trans('confirm_delete') || 'Are you sure you want to delete this item?')) {
            destroy(`/admin/finishing-types/${finishingType.id}`, { preserveScroll: true })
        }
    }

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_finishing_types') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_finishing_types') || 'Finishing Types'}</h1>
                    {editing !== 'new' && (
                        <button onClick={startCreate} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950">
                            {trans('add') || 'Add'}
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div role="alert" aria-live="polite" className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{flash.success}</div>
                )}

                {/* Create / Edit Form */}
                {(editing === 'new' || typeof editing === 'number') && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar') || 'Name (AR)'}</label>
                                <input type="text" value={data.name_ar} onChange={e => setData('name_ar', e.target.value)} required dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en') || 'Name (EN)'}</label>
                                <input type="text" value={data.name_en} onChange={e => setData('name_en', e.target.value)} required dir="ltr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50">
                                {processing ? (trans('loading') || 'Loading...') : (trans('save') || 'Save')}
                            </button>
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200">
                                {trans('cancel') || 'Cancel'}
                            </button>
                        </div>
                    </form>
                )}

                {/* List */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start">
                                <th className="px-4 py-3 font-medium text-start">{trans('name_ar') || 'Name (AR)'}</th>
                                <th className="px-4 py-3 font-medium text-start">{trans('name_en') || 'Name (EN)'}</th>
                                <th className="px-4 py-3 font-medium text-start">{trans('actions') || 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {(!finishingTypes || finishingTypes.length === 0) && (
                                <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">{trans('no_data') || 'No data available'}</td></tr>
                            )}
                            {finishingTypes?.map(type => (
                                <tr key={type.id} className="hover:bg-surface/50">
                                    <td className="px-4 py-3 text-secondary-950">{type.name_ar}</td>
                                    <td className="px-4 py-3 text-secondary-950">{type.name_en}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(type)} className="text-xs text-primary-900 hover:text-primary-950 font-medium">{trans('edit') || 'Edit'}</button>
                                            <button onClick={() => handleDelete(type)} className="text-xs text-red-600 hover:text-red-700 font-medium">{trans('delete') || 'Delete'}</button>
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
