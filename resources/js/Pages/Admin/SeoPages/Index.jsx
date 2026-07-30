import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { Head, useForm, usePage } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'

export default function SeoPagesIndex({ pages }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [activeKey, setActiveKey] = useState(pages?.[0]?.page_key || 'home')
    const [keywordInputAr, setKeywordInputAr] = useState('')
    const [keywordInputEn, setKeywordInputEn] = useState('')

    const activePage = pages?.find(p => p.page_key === activeKey) || pages?.[0]

    const { data, setData, put, processing, errors } = useForm({
        meta_title_ar: activePage?.meta_title_ar || '',
        meta_title_en: activePage?.meta_title_en || '',
        meta_description_ar: activePage?.meta_description_ar || '',
        meta_description_en: activePage?.meta_description_en || '',
        meta_keywords_ar: activePage?.meta_keywords_ar || [],
        meta_keywords_en: activePage?.meta_keywords_en || [],
    })

    const handleSelectPage = (key) => {
        setActiveKey(key)
        const target = pages?.find(p => p.page_key === key)
        if (target) {
            setData({
                meta_title_ar: target.meta_title_ar || '',
                meta_title_en: target.meta_title_en || '',
                meta_description_ar: target.meta_description_ar || '',
                meta_description_en: target.meta_description_en || '',
                meta_keywords_ar: target.meta_keywords_ar || [],
                meta_keywords_en: target.meta_keywords_en || [],
            })
        }
    }

    const addKeywordAr = () => {
        const kw = keywordInputAr.trim()
        if (kw && !data.meta_keywords_ar.includes(kw)) {
            setData('meta_keywords_ar', [...data.meta_keywords_ar, kw])
        }
        setKeywordInputAr('')
    }

    const removeKeywordAr = (kw) => {
        setData('meta_keywords_ar', data.meta_keywords_ar.filter(k => k !== kw))
    }

    const addKeywordEn = () => {
        const kw = keywordInputEn.trim()
        if (kw && !data.meta_keywords_en.includes(kw)) {
            setData('meta_keywords_en', [...data.meta_keywords_en, kw])
        }
        setKeywordInputEn('')
    }

    const removeKeywordEn = (kw) => {
        setData('meta_keywords_en', data.meta_keywords_en.filter(k => k !== kw))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!activePage) return
        put(route('admin.seo-pages.update', activePage.id))
    }

    return (
        <AdminSidebar>
            <Head title={trans('seo_pages_title') + ' — ' + trans('app_name')} />

            <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6 p-6 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('seo_pages_title')}</h1>
                    <p className="text-sm text-muted">{trans('seo_pages_desc')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Page selector tabs */}
                    <div className="space-y-2">
                        {pages?.map((p) => {
                            const label = trans(`seo_page_${p.page_key}`) || p.page_key
                            return (
                                <button
                                    key={p.page_key}
                                    type="button"
                                    onClick={() => handleSelectPage(p.page_key)}
                                    className={`w-full text-start px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                        activeKey === p.page_key
                                            ? 'bg-primary-900 text-white shadow-md'
                                            : 'bg-white text-secondary-800 hover:bg-surface border border-secondary-100'
                                    }`}
                                >
                                    {label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Editor Form */}
                    <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-card border border-secondary-100/50">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-lg font-bold text-secondary-950 border-b pb-3">
                                {trans('seo_page_settings')}: <span className="text-primary-900">{trans(`seo_page_${activeKey}`) || activeKey}</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-secondary-800 mb-1">{trans('meta_title_ar')}</label>
                                    <input
                                        type="text"
                                        value={data.meta_title_ar}
                                        onChange={e => setData('meta_title_ar', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-secondary-800 mb-1">{trans('meta_title_en')}</label>
                                    <input
                                        type="text"
                                        value={data.meta_title_en}
                                        onChange={e => setData('meta_title_en', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-secondary-800 mb-1">{trans('meta_description_ar')}</label>
                                    <textarea
                                        rows={3}
                                        value={data.meta_description_ar}
                                        onChange={e => setData('meta_description_ar', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-secondary-800 mb-1">{trans('meta_description_en')}</label>
                                    <textarea
                                        rows={3}
                                        value={data.meta_description_en}
                                        onChange={e => setData('meta_description_en', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                                    />
                                </div>
                            </div>

                            {/* Keywords Arabic */}
                            <div>
                                <label className="block text-xs font-semibold text-secondary-800 mb-1">{trans('keywords_ar')}</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={keywordInputAr}
                                        onChange={e => setKeywordInputAr(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeywordAr(); } }}
                                        placeholder="مثال: عقارات، القاهرة"
                                        className="flex-1 text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={addKeywordAr}
                                        className="px-4 py-2.5 bg-secondary-900 text-white text-xs font-semibold rounded-xl hover:bg-secondary-950 transition-colors"
                                    >
                                        {trans('add_keyword')}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {data.meta_keywords_ar?.map((kw, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-secondary-200 rounded-full text-xs font-medium text-secondary-800">
                                            {kw}
                                            <button type="button" onClick={() => removeKeywordAr(kw)} className="text-secondary-400 hover:text-danger-600 font-bold">&times;</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Keywords English */}
                            <div>
                                <label className="block text-xs font-semibold text-secondary-800 mb-1">{trans('keywords_en')}</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={keywordInputEn}
                                        onChange={e => setKeywordInputEn(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeywordEn(); } }}
                                        placeholder="Example: real estate, cairo"
                                        className="flex-1 text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={addKeywordEn}
                                        className="px-4 py-2.5 bg-secondary-900 text-white text-xs font-semibold rounded-xl hover:bg-secondary-950 transition-colors"
                                    >
                                        {trans('add_keyword')}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {data.meta_keywords_en?.map((kw, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-secondary-200 rounded-full text-xs font-medium text-secondary-800">
                                            {kw}
                                            <button type="button" onClick={() => removeKeywordEn(kw)} className="text-secondary-400 hover:text-danger-600 font-bold">&times;</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-primary-900 text-white rounded-xl font-medium text-sm hover:bg-primary-950 transition-colors shadow-md disabled:opacity-50"
                            >
                                {trans('save_changes')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminSidebar>
    )
}
