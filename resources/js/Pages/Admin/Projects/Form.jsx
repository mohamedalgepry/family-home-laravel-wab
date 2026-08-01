import { Select } from '../../../Components/UI'
import { usePage, useForm, Link, Head, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect, useRef } from 'react'
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
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState('')
    const [primaryImageFile, setPrimaryImageFile] = useState(null)
    const [primaryImagePreview, setPrimaryImagePreview] = useState(null)
    const primaryInputRef = useRef(null)

    const [newImagePreviews, setNewImagePreviews] = useState([])
    const previewUrlsRef = useRef([])
    const imagesInputRef = useRef(null)
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

    useEffect(() => () => {
        previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    }, [])

    useEffect(() => {
        if (existingImages.length > 0) {
            setData('image_order', existingImages.map(img => img.id))
        }
    }, [])

    function handleChange(key, value) {
        setData(key, value)
        setDirty(true)
    }

    function compressImage(file, maxWidth = 1920, quality = 0.82) {
        return new Promise(resolve => {
            if (!file || !file.type.startsWith('image/') || file.type.includes('svg')) {
                resolve(file)
                return
            }
            const img = new Image()
            const url = URL.createObjectURL(file)
            img.onload = () => {
                URL.revokeObjectURL(url)
                let width = img.width
                let height = img.height
                if (width <= maxWidth && file.size < 800 * 1024) {
                    resolve(file)
                    return
                }
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                canvas.getContext('2d').drawImage(img, 0, 0, width, height)
                canvas.toBlob(
                    blob => {
                        if (!blob || blob.size >= file.size) {
                            resolve(file)
                        } else {
                            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }))
                        }
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.onerror = () => resolve(file)
            img.src = url
        })
    }

    async function handlePrimaryImageChange(event) {
        const file = event.target.files?.[0]
        if (!file) return

        setUploadStatus(locale === 'ar' ? 'جاري ضغط الصورة الرئيسية...' : 'Compressing primary image...')
        const compressed = await compressImage(file)
        setUploadStatus('')
        setPrimaryImageFile(compressed)
        if (primaryImagePreview) URL.revokeObjectURL(primaryImagePreview)
        setPrimaryImagePreview(URL.createObjectURL(compressed))
        setDirty(true)

        const secondaryFiles = newImagePreviews.map(p => p.file)
        handleChange('images', [compressed, ...secondaryFiles])
    }

    function removePrimaryImage() {
        if (primaryImagePreview) URL.revokeObjectURL(primaryImagePreview)
        setPrimaryImageFile(null)
        setPrimaryImagePreview(null)
        if (primaryInputRef.current) primaryInputRef.current.value = ''
        const secondaryFiles = newImagePreviews.map(p => p.file)
        handleChange('images', secondaryFiles)
    }

    async function handleNewImages(event) {
        const rawFiles = Array.from(event.target.files || [])
        if (rawFiles.length === 0) return

        setUploadStatus(locale === 'ar'
            ? `جاري ضغط ${rawFiles.length} صورة بالتوازي...`
            : `Compressing ${rawFiles.length} image(s) in parallel...`
        )

        const files = await Promise.all(rawFiles.map(f => compressImage(f)))

        previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
        const previews = files.map(file => ({ file, url: URL.createObjectURL(file) }))
        previewUrlsRef.current = previews.map(preview => preview.url)

        setUploadStatus('')
        setNewImagePreviews(previews)

        const allNewFiles = primaryImageFile ? [primaryImageFile, ...files] : files
        handleChange('images', allNewFiles)
    }

    function removeNewImage(index) {
        const removed = newImagePreviews[index]
        if (removed) URL.revokeObjectURL(removed.url)

        const previews = newImagePreviews.filter((_, currentIndex) => currentIndex !== index)
        previewUrlsRef.current = previews.map(preview => preview.url)
        setNewImagePreviews(previews)

        const secondaryFiles = previews.map(preview => preview.file)
        const allNewFiles = primaryImageFile ? [primaryImageFile, ...secondaryFiles] : secondaryFiles
        handleChange('images', allNewFiles)

        if (imagesInputRef.current) imagesInputRef.current.value = ''
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

    function setExistingAsPrimary(imageId) {
        const idx = existingImages.findIndex(img => img.id === imageId)
        if (idx <= 0) return

        const newOrder = [...existingImages]
        const [selected] = newOrder.splice(idx, 1)
        newOrder.unshift(selected)

        setExistingImages(newOrder)
        setData('image_order', newOrder.map(img => img.id))
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

    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleSubmit() {
        if (processing || isSubmitting) return

        setIsSubmitting(true)
        setDirty(false)
        setUploadProgress(0)

        const hasImages = data.images && data.images.length > 0
        if (hasImages) {
            const totalMB = (data.images.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)
            setUploadStatus(locale === 'ar'
                ? `جاري رفع ${data.images.length} صورة (${totalMB} MB)...`
                : `Uploading ${data.images.length} image(s) (${totalMB} MB)...`
            )
        } else {
            setUploadStatus(locale === 'ar' ? 'جاري حفظ البيانات...' : 'Saving...')
        }

        const url = isEdit ? `/admin/projects/${project.id}` : '/admin/projects'

        // البيانات مع _method للتعديل
        const payload = { ...data }
        if (isEdit) payload._method = 'PUT'

        // Inertia router.post مع onProgress — بدون XHR ولا إرسال مزدوج
        router.post(url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onProgress: (progress) => {
                if (progress?.percentage !== undefined) {
                    const pct = Math.round(progress.percentage)
                    setUploadProgress(pct)
                    if (pct >= 100) {
                        setUploadStatus(locale === 'ar' ? 'تم الرفع، جاري المعالجة...' : 'Uploaded, processing...')
                    }
                }
            },
            onFinish: () => {
                setIsSubmitting(false)
                setUploadProgress(0)
                setUploadStatus('')
            },
            onError: () => {
                setIsSubmitting(false)
                setUploadProgress(0)
                setUploadStatus('')
            },
        })
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
                        <div className="space-y-6">
                            {/* الصورة الرئيسية */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary-950 mb-2">
                                    {locale === 'ar' ? 'الصورة الرئيسية للمشروع *' : 'Primary Project Image *'}
                                </label>
                                <div className="border-2 border-dashed border-secondary-200 rounded-xl overflow-hidden bg-surface transition-all hover:border-primary-900/40">
                                    {(primaryImagePreview || (existingImages.length > 0 && !primaryImageFile)) ? (
                                        <div className="relative group">
                                            <img
                                                src={primaryImagePreview || existingImages[0]?.url}
                                                alt=""
                                                className="w-full h-56 object-cover"
                                            />
                                            <span className="absolute top-3 start-3 bg-primary-900 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                                {locale === 'ar' ? 'الصورة الرئيسية' : 'Primary Image'}
                                            </span>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => primaryInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white text-secondary-950 rounded-lg text-xs font-semibold hover:bg-secondary-100 shadow-md transition-colors"
                                                >
                                                    {locale === 'ar' ? 'تغيير الصورة الرئيسية' : 'Change Primary Image'}
                                                </button>
                                                {primaryImagePreview && (
                                                    <button
                                                        type="button"
                                                        onClick={removePrimaryImage}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 shadow-md transition-colors"
                                                    >
                                                        {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => primaryInputRef.current?.click()}
                                            className="w-full h-44 flex flex-col items-center justify-center gap-2 text-muted hover:text-primary-900 transition-colors focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded-xl"
                                        >
                                            <svg className="w-9 h-9 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            <span className="text-sm font-medium">{locale === 'ar' ? 'اضغط لرفع الصورة الرئيسية للمشروع' : 'Upload Primary Project Image'}</span>
                                            <span className="text-xs text-muted">{locale === 'ar' ? 'اختر صورة بارزة بدقة عالية' : 'Choose a clear cover image'}</span>
                                        </button>
                                    )}
                                    <input ref={primaryInputRef} type="file" accept="image/*" onChange={handlePrimaryImageChange} className="hidden" />
                                </div>
                            </div>

                            {/* الصور الحالية للمشروع (في حالة التعديل) */}
                            {isEdit && existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-950 mb-2">
                                        {locale === 'ar' ? 'معرض صور المشروع الحالية' : 'Current Project Gallery'}
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {existingImages.map((img, idx) => (
                                            <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-secondary-100 bg-surface">
                                                <img src={img.url} alt="" className="w-full h-28 object-cover" />
                                                {idx === 0 && !primaryImageFile && (
                                                    <span className="absolute top-1.5 start-1.5 bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                                                        {locale === 'ar' ? 'رئيسية' : 'Primary'}
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5">
                                                    {idx !== 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setExistingAsPrimary(img.id)}
                                                            className="w-full py-1.5 bg-primary-900 text-white rounded-lg text-xs font-medium hover:bg-primary-800 transition-colors"
                                                        >
                                                            {locale === 'ar' ? 'تعيين كصورة رئيسية' : 'Set as Primary'}
                                                        </button>
                                                    )}
                                                    <div className="flex gap-1 w-full justify-center">
                                                        {idx > 0 && (
                                                            <button type="button" onClick={() => handleMoveImage(img.id, 'up')} className="px-2 py-1 bg-white/90 text-secondary-950 rounded text-xs font-bold hover:bg-white" title={locale === 'ar' ? 'تقديم' : 'Move Up'}>&#8594;</button>
                                                        )}
                                                        {idx < existingImages.length - 1 && (
                                                            <button type="button" onClick={() => handleMoveImage(img.id, 'down')} className="px-2 py-1 bg-white/90 text-secondary-950 rounded text-xs font-bold hover:bg-white" title={locale === 'ar' ? 'تأخير' : 'Move Down'}>&#8592;</button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteImage(img.id)}
                                                            className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                                                            title={locale === 'ar' ? 'حذف' : 'Delete'}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* المعرض والإضافات الجديدة */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary-950 mb-2">
                                    {locale === 'ar' ? 'صور إضافية للمشروع (المعرض)' : 'Additional Gallery Images'}
                                </label>

                                {newImagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                                        {newImagePreviews.map((preview, index) => (
                                            <div key={preview.url} className="relative group rounded-xl overflow-hidden border-2 border-primary-900/20 bg-surface">
                                                <img src={preview.url} alt={preview.file.name} className="w-full h-28 object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                                                        aria-label="Remove image"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => imagesInputRef.current?.click()}
                                    className="w-full py-3 border-2 border-dashed border-secondary-200 rounded-xl text-sm text-muted hover:text-primary-900 hover:border-primary-900/40 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>{locale === 'ar' ? '+ إضافة المزيد من الصور للمعرض' : '+ Add More Gallery Images'}</span>
                                </button>
                                <input ref={imagesInputRef} type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" />
                            </div>

                            {/* الفيديو */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary-950 mb-1">{trans('video')}</label>
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

                    <div className="mt-8 pt-6 border-t border-secondary-100 space-y-3">
                        {/* شريط التقدم */}
                        {isSubmitting && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs text-secondary-600">
                                    <span className="font-medium">{uploadStatus}</span>
                                    {uploadProgress > 0 && (
                                        <span className="font-bold text-primary-900">{uploadProgress}%</span>
                                    )}
                                </div>
                                {uploadProgress > 0 ? (
                                    <div className="w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary-900 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-primary-900 h-2 rounded-full animate-pulse w-1/3" />
                                    </div>
                                )}
                            </div>
                        )}
                        {/* معلومات الصور المختارة */}
                        {!isSubmitting && newImagePreviews.length > 0 && (
                            <div className="text-xs text-secondary-500 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    {locale === 'ar'
                                        ? `${newImagePreviews.length} صورة جديدة جاهزة — ${(data.images.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)} MB`
                                        : `${newImagePreviews.length} new image(s) ready — ${(data.images.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)} MB`
                                    }
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || isSubmitting} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 disabled:opacity-50">
                                {trans('back')}
                            </button>
                            {step < STEPS.length - 1 ? (
                                <button type="button" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50">
                                    {trans('next')}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing || isSubmitting}
                                    className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    )}
                                    {isSubmitting ? (uploadStatus || trans('loading')) : (isEdit ? trans('update') : trans('save'))}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AdminSidebar>
    )
}
