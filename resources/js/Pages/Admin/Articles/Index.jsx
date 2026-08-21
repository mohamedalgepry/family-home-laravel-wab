import { Select } from '../../../Components/UI'
import { usePage, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminArticlesIndex({ articles, categories, filters }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [search, setSearch] = useState(filters?.search || '')
    const [categoryFilter, setCategoryFilter] = useState(filters?.category_id || '')

    function applyFilters() {
        router.get('/admin/articles', { search, category_id: categoryFilter }, { preserveState: true, preserveScroll: true })
    }

    function togglePublish(articleId) {
        router.post(`/admin/articles/${articleId}/publish`, {}, { preserveScroll: true })
    }

    function confirmDelete(articleId) {
        if (window.confirm(trans('confirm_delete'))) {
            router.delete(`/admin/articles/${articleId}`, { preserveScroll: true })
        }
    }

    const data = articles?.data || articles || []

    return (
        <AdminSidebar>
            <Head title={trans('blog') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_articles')}</h1>
                    <a href="/admin/articles/create" className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors">
                        {trans('add_new')}
                    </a>
                </div>

                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('search')}</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={trans('search')} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('category')}</label>
                        <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                            <option value="">{trans('all_categories')}</option>
                            {categories?.map(c => (
                                <option key={c.id} value={c.id}>{isRtl ? c.name_ar : c.name_en}</option>
                            ))}
                        </Select>
                    </div>
                    <button onClick={applyFilters} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium">{trans('search')}</button>
                </div>

                <div className="bg-white rounded-xl shadow-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">{trans('title')}</th>
                                <th className="px-4 py-3 font-medium">{trans('category')}</th>
                                <th className="px-4 py-3 font-medium">{trans('status')}</th>
                                <th className="px-4 py-3 font-medium">{trans('views')}</th>
                                <th className="px-4 py-3 font-medium">{trans('created_at')}</th>
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? data.map(a => (
                                <tr key={a.id} className="border-t border-secondary-100 hover:bg-surface/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-secondary-950 max-w-xs truncate">{a.title}</td>
                                    <td className="px-4 py-3 text-muted">{a.category ? (isRtl ? a.category.name_ar : a.category.name_en) : '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {a.is_published ? (trans('published') ) : (trans('draft') )}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{a.views_count || 0}</td>
                                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{a.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 items-center">
                                            <a
                                                href={`/articles/${a.slug_ar || a.slug || a.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs px-2.5 py-1.5 rounded-lg bg-primary-50 text-primary-900 hover:bg-primary-100 font-medium transition-colors flex items-center gap-1"
                                                title={isRtl ? 'معاينة المقال في الموقع' : 'Preview Article on site'}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span>{isRtl ? 'معاينة' : 'Preview'}</span>
                                            </a>
                                            <a href={`/admin/articles/${a.id}/edit`} className="text-xs px-2.5 py-1.5 rounded-lg bg-surface text-secondary-700 hover:bg-secondary-200 font-medium transition-colors">
                                                {trans('edit')}
                                            </a>
                                            <button onClick={() => togglePublish(a.id)} className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${a.is_published ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                                                {a.is_published ? (trans('unpublish') ) : (trans('publish') )}
                                            </button>
                                            <button onClick={() => confirmDelete(a.id)} className="text-xs px-2.5 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 font-medium transition-colors">
                                                {trans('delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted">
                                        {trans('no_data')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminSidebar>
    )
}
