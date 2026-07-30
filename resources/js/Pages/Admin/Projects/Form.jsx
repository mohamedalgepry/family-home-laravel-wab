import { Select } from '../../../Components/UI'
import { usePage, useForm, Link, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

const STEPS = [
    { key: 'basic', title_key: 'basic_info' },
    { key: 'media', title_key: 'media' },
    { key: 'seo', title_key: 'seo' },
    { key: 'location', title_key: 'location' },
]

export default function AdminProjectForm({ project, areas, features, finishingTypes, managers }) {
    const { locale, errors, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isEdit = !!project
    const isAdmin = auth?.user?.role === 'admin'

    const [step, setStep] = useState(0)
    const [dirty, setDirty] = useState(false)
    const [existingImages, setExistingImages] = useState(() => {
        if (!isEdit || !project?.images) return []
        return [...project.images].sort((a, b) => a.sort_order - b.sort_order)
    })

    const { data, setData, post, processing, transform } = useForm({
        manager_id: '',
        name_ar: project?.name_ar || '',
        name_en: project?.name_en || project?.name || '',
        description_ar: project?.description_ar || '',
        description_en: project?.description_en || project?.description || '',
        area_id: project?.area_id || '',
        video_url: project?.video_url || '',
        keywords_ar: project?.keywords_ar || [],
        keywords_en: project?.keywords_en || [],
        meta_description_ar: project?.meta_description_ar || '',
        meta_description_en: project?.meta_description_en || '',
        map_embed_url: project?.map_embed_url || '',
        location_address_ar: project?.location_address_ar || '',
        location_address_en: project?.location_address_en || '',
        images: [],
        deleted_image_ids: [],
        image_order: [],
        payment_method: project?.payment_method || '',
        down_payment: project?.down_payment || '',
        installment_years: project?.installment_years || '',
        finishing_type_id: project?.finishing_type_id || '',
        features: project?.features?.map(f => f.id) || [],
    })

    const [keywordInputAr, setKeywordInputAr] = useState('')
    const [keywordInputEn, setKeywordInputEn] = useState('')

    useEffect(() => {
        const handleBeforeUnload = e => {
            if (dirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [dirty])

    useEffect(() => {
        if (existingImages.length > 0) {
            setData('image_order', existingImages.map(img => img.id))
        }
    }, [])

    function handleChange(key, value) {
        setData(key, value)
        setDirty(true)
    }

    function addKeywordAr() {
        const kw = keywordInputAr.trim()
        if (kw && !data.keywords_ar.includes(kw)) {
            setData('keywords_ar', [...data.keywords_ar, kw])
            setDirty(true)
        }
        setKeywordInputAr('')
    }

    function removeKeywordAr(kw) {
        setData('keywords_ar', data.keywords_ar.filter(k => k !== kw))
        setDirty(true)
    }

    function addKeywordEn() {
        const kw = keywordInputEn.trim()
        if (kw && !data.keywords_en.includes(kw)) {
            setData('keywords_en', [...data.keywords_en, kw])
            setDirty(true)
        }
        setKeywordInputEn('')
    }

    function removeKeywordEn(kw) {
        setData('keywords_en', data.keywords_en.filter(k => k !== kw))
        setDirty(true)
    }

    function handleDeleteImage(imageId) {
        setExistingImages(prev => prev.filter(img => img.id !== imageId))
        setData('deleted_image_ids', [...data.deleted_image_ids, imageId])
        setData('image_order', data.image_order.filter(id => id !== imageId))
        setDirty(true)
    }

    function handleMoveImage(imageId, direction) {
        const idx = existingImages.findIndex(img => img.id === imageId)
        if (idx === -1) return

        const newOrder = [...existingImages]
        if (direction === 'up' && idx > 0) {
            [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]]
        } else if (direction === 'down' && idx < newOrder.length - 1) {
            [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]]
        } else {
            return
        }

        setExistingImages(newOrder)
        setData('image_order', newOrder.map(img => img.id))
        setDirty(true)
    }

    function toggleFeature(id) {
        if (data.features.includes(id)) {
            setData('features', data.features.filter(f => f !== id))
        } else {
            setData('features', [...data.features, id])
        }
        setDirty(true)
    }

    function handleSubmit() {
        setDirty(false)
        if (isEdit) {
            transform((data) => ({
                ...data,
                _method: 'put',
            }))
            post(`/admin/projects/${project.id}`, {
                preserveScroll: true,
            })
        } else {
            post('/admin/projects', {
                preserveScroll: true,
            })
        }
    }

    function canNext() {
        if (step === 0) return data.name_ar || data.name_en
        return true
    }

    return (
        <AdminSidebar>
            <Head title={trans('add_project') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/projects" className="text-sm text-muted hover:text-primary-900">&larr; {trans('sidebar_projects')}</Link>
                    <h1 className="text-2xl font-bold text-secondary-950">
                        {isEdit ? trans('edit_project', {}, 'projects') : trans('add_project', {}, 'projects')}
                    </h1>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s.key} className="flex items-center gap-2 flex-1">
                            <button
                                type="button"
                                onClick={() => i <= step ? setStep(i) : null}
                                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                                    i === step ? 'bg-primary-900 text-white' :
                                    i < step ? 'bg-green-500 text-white' :
                                    'bg-surface text-secondary-400'
                                }`}
                            >
                                {i + 1}
                            </button>
                            <span className={`text-xs hidden sm:inline ${i === step ? 'text-secondary-950 font-medium' : 'text-muted'}`}>
                                {trans(s.title_key) || s.key}
                            </span>
                            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-secondary-200" />}
                        </div>
                    ))}
                </div>

                <form onSubmit={e => e.preventDefault()} className="bg-white rounded-xl shadow-card p-6">
                    {step === 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar')} *</label>
                                    <input type="text" value={data.name_ar} onChange={e => handleChange('name_ar', e.target.value)} dir="rtl" required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en')}</label>
                                    <input type="text" value={data.name_en} onChange={e => handleChange('name_en', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('content_ar')}</label>
                                    <textarea value={data.description_ar} onChange={e => handleChange('description_ar', e.target.value)} rows={4} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('content_en')}</label>
                                    <textarea value={data.description_en} onChange={e => handleChange('description_en', e.target.value)} rows={4} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('area')}</label>
                                <Select value={data.area_id} onChange={e => handleChange('area_id', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                    <option value="">—</option>
                                    {areas?.map(a => <option key={a.id} value={a.id}>{locale === 'ar' ? a.name_ar : a.name_en}</option>)}
                                </Select>
                            </div>
                            {!isEdit && isAdmin && managers?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{locale === 'ar' ? 'المننجر المسؤول' : 'Responsible Manager'}</label>
                                    <Select value={data.manager_id} onChange={e => handleChange('manager_id', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                        <option value="">—</option>
                                        {managers?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </Select>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-secondary-100">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('payment_method') || 'Payment Method'}</label>
                                    <Select value={data.payment_method} onChange={e => handleChange('payment_method', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                        <option value="">—</option>
                                        <option value="cash">{trans('cash') || 'Cash'}</option>
                                        <option value="installment">{trans('installment') || 'Installment'}</option>
                                        <option value="both">{trans('both') || 'Cash & Installment'}</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('finishing_type') || 'Finishing Type'}</label>
                                    <Select value={data.finishing_type_id} onChange={e => handleChange('finishing_type_id', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                        <option value="">—</option>
                                        {finishingTypes?.map(f => <option key={f.id} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>)}
                                    </Select>
                                </div>
                                {['installment', 'both'].includes(data.payment_method) && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('down_payment') || 'Down Payment'}</label>
                                            <input type="text" value={data.down_payment} onChange={e => handleChange('down_payment', e.target.value)} placeholder={locale === 'ar' ? 'مثال: 10% أو 500,000' : 'e.g. 10% or 500,000'} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('installment_years') || 'Installment Years'}</label>
                                            <input type="number" min="0" value={data.installment_years} onChange={e => handleChange('installment_years', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pt-4 border-t border-secondary-100">
                                <label className="block text-sm font-medium text-secondary-950 mb-3">{trans('features') || 'Features'}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {features?.map(feature => (
                                        <div key={feature.id} className="flex items-center gap-2">
                                            <input 
                                                type="checkbox"
                                                id={`project-feature-${feature.id}`}
                                                checked={data.features.includes(feature.id)}
                                                onChange={() => toggleFeature(feature.id)}
                                                className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
                                            />
                                            <label htmlFor={`project-feature-${feature.id}`} className="text-sm text-secondary-700 cursor-pointer select-none">
                                                {locale === 'ar' ? feature.name_ar : feature.name_en}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            {isEdit && existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-2">{trans('current_images')}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {existingImages.map((img, idx) => (
                                            <div key={img.id} className="relative group aspect-video bg-surface rounded-lg overflow-hidden">
                                                <img src={img.url} alt={trans('project_image')} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(img.id)}
                                                    className="absolute top-1 end-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title={trans('delete')}
                                                >
                                                    &times;
                                                </button>
                                                <div className="absolute bottom-1 start-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {idx > 0 && (
                                                        <button type="button" onClick={() => handleMoveImage(img.id, 'up')} className="w-6 h-6 bg-white/80 text-secondary-700 rounded text-xs leading-none">&#8593;</button>
                                                    )}
                                                    {idx < existingImages.length - 1 && (
                                                        <button type="button" onClick={() => handleMoveImage(img.id, 'down')} className="w-6 h-6 bg-white/80 text-secondary-700 rounded text-xs leading-none">&#8595;</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('upload_new_images')}</label>
                                <input type="file" multiple accept="image/*" onChange={e => handleChange('images', Array.from(e.target.files || []))} className="w-full text-sm" />
                                <p className="text-xs text-muted mt-1">{trans('max_images')}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('video')}</label>
                                <input type="url" value={data.video_url} onChange={e => handleChange('video_url', e.target.value)} placeholder="https://youtube.com/..." className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                <p className="text-xs text-muted mt-1">{trans('video_url_help')}</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('keywords')} ({trans('ar')})</label>
                                    <div className="flex gap-2 mb-2">
                                        <input type="text" value={keywordInputAr} onChange={e => setKeywordInputAr(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeywordAr())} dir="rtl" className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                        <button type="button" onClick={addKeywordAr} className="px-3 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200">{trans('add')}</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.keywords_ar.map(kw => (
                                            <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface text-xs text-secondary-700 rounded-full border border-secondary-200">
                                                {kw}
                                                <button type="button" onClick={() => removeKeywordAr(kw)} className="text-muted hover:text-red-500 text-base leading-none">&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('keywords')} ({trans('en')})</label>
                                    <div className="flex gap-2 mb-2">
                                        <input type="text" value={keywordInputEn} onChange={e => setKeywordInputEn(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeywordEn())} dir="ltr" className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                        <button type="button" onClick={addKeywordEn} className="px-3 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200">{trans('add')}</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.keywords_en.map(kw => (
                                            <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface text-xs text-secondary-700 rounded-full border border-secondary-200">
                                                {kw}
                                                <button type="button" onClick={() => removeKeywordEn(kw)} className="text-muted hover:text-red-500 text-base leading-none">&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('meta_description')} ({trans('ar')})</label>
                                    <textarea value={data.meta_description_ar} onChange={e => handleChange('meta_description_ar', e.target.value)} rows={3} maxLength={500} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('meta_description')} ({trans('en')})</label>
                                    <textarea value={data.meta_description_en} onChange={e => handleChange('meta_description_en', e.target.value)} rows={3} maxLength={500} dir="ltr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('location_address')} ({trans('ar')})</label>
                                    <input type="text" value={data.location_address_ar} onChange={e => handleChange('location_address_ar', e.target.value)} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('location_address')} ({trans('en')})</label>
                                    <input type="text" value={data.location_address_en} onChange={e => handleChange('location_address_en', e.target.value)} dir="ltr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('map_embed_url', {}, 'units')}</label>
                                <textarea
                                    value={data.map_embed_url}
                                    onChange={e => handleChange('map_embed_url', e.target.value)}
                                    rows={4}
                                    dir="ltr"
                                    placeholder='<iframe src="..."></iframe>'
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-mono text-xs"
                                />
                                <p className="text-xs text-muted mt-1">{trans('map_embed_url_help', {}, 'units')}</p>
                            </div>
                            {data.map_embed_url && (
                                <iframe
                                    src={(() => {
                                        const m = data.map_embed_url.match(/src\s*=\s*"([^"]+)"/i) || data.map_embed_url.match(/src\s*=\s*'([^']+)'/i)
                                        return m ? m[1] : data.map_embed_url
                                    })()}
                                    className="w-full aspect-video rounded-lg"
                                    allowFullScreen
                                    loading="lazy"
                                    title="Google Maps"
                                />
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-100">
                        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 disabled:opacity-50">
                            {trans('back')}
                        </button>
                        {step < STEPS.length - 1 ? (
                            <button type="button" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50">
                                {trans('next')}
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={processing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50">
                                {processing ? trans('loading') : (isEdit ? trans('update') : trans('save'))}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AdminSidebar>
    )
}
