import { Select } from '../../../Components/UI'
import { usePage, useForm, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect, useRef } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

const STEPS = [
    { key: 'basic', title_key: 'basic_info' },
    { key: 'media', title_key: 'media' },
    { key: 'seo', title_key: 'seo' },
    { key: 'location', title_key: 'location' },
]

// ========================
// ImageManager Component
// ========================
function ImageManager({ unit, trans, locale }) {
    const [primaryFile, setPrimaryFile] = useState(null)
    const [primaryPreview, setPrimaryPreview] = useState(null)
    const [newFiles, setNewFiles] = useState([])
    const [newPreviews, setNewPreviews] = useState([])
    const primaryRef = useRef()
    const moreRef = useRef()

    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    const MAX_TOTAL = 40 * 1024 * 1024 // 40MB

    const existingImages = unit?.images ?? []
    const primaryImage = existingImages.find(img => img.is_primary) || existingImages[0] || null

    function handlePrimaryChange(e) {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > MAX_SIZE) {
            alert(locale === 'ar' ? `حجم الصورة كبير جداً. الحد 10 ميجابايت.` : `Image too large. Max 10MB.`)
            return
        }
        setPrimaryFile(file)
        setPrimaryPreview(URL.createObjectURL(file))
    }

    function handleMoreImages(e) {
        const files = Array.from(e.target.files || [])
        const valid = []
        let total = 0
        for (const f of files) {
            if (f.size > MAX_SIZE) {
                alert(locale === 'ar' ? `${f.name}: حجم كبير جداً.` : `${f.name}: Too large.`)
                continue
            }
            total += f.size
            if (total > MAX_TOTAL) {
                alert(locale === 'ar' ? 'تجاوز الحد الإجمالي 40 ميجابايت.' : 'Total exceeds 40MB limit.')
                break
            }
            valid.push(f)
        }
        setNewFiles(prev => [...prev, ...valid])
        setNewPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
    }

    function removeNewImage(idx) {
        setNewFiles(prev => prev.filter((_, i) => i !== idx))
        setNewPreviews(prev => prev.filter((_, i) => i !== idx))
    }

    function deleteExistingImage(img) {
        if (!unit?.id) return
        if (!confirm(locale === 'ar' ? 'هل تريد حذف هذه الصورة؟' : 'Delete this image?')) return
        router.delete(`/admin/units/${unit.id}/images/${img.id}`, { preserveScroll: true })
    }

    function setExistingAsPrimary(img) {
        if (!unit?.id) return
        router.post(`/admin/units/${unit.id}/images/${img.id}/primary`, {}, { preserveScroll: true })
    }

    // Expose files to parent form via hidden input trick
    // We use a ref-based approach: the form in parent reads these states
    // Return state so parent can include in submit
    return {
        primaryFile,
        newFiles,
        render: () => (
            <div className="space-y-6">
                {/* Primary Image */}
                <div>
                    <label className="block text-sm font-semibold text-secondary-950 mb-2">
                        {trans('primary_image', {}, 'units')} *
                    </label>
                    <div className="border-2 border-dashed border-secondary-200 rounded-xl overflow-hidden bg-surface">
                        {(primaryPreview || (primaryImage && !primaryFile)) ? (
                            <div className="relative group">
                                <img
                                    src={primaryPreview || primaryImage.url}
                                    alt=""
                                    className="w-full h-48 object-cover"
                                />
                                {primaryImage && !primaryPreview && (
                                    <span className="absolute top-2 start-2 bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                        {trans('primary_badge', {}, 'units')}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => primaryRef.current?.click()}
                                        className="px-3 py-1.5 bg-white text-secondary-950 rounded-lg text-xs font-medium hover:bg-secondary-100"
                                    >
                                        {locale === 'ar' ? 'تغيير' : 'Change'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => primaryRef.current?.click()}
                                className="w-full h-40 flex flex-col items-center justify-center gap-2 text-muted hover:text-primary-900 transition-colors focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded-xl"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="text-sm">{trans('primary_image', {}, 'units')}</span>
                            </button>
                        )}
                        <input ref={primaryRef} type="file" accept="image/*" onChange={handlePrimaryChange} className="hidden" />
                    </div>
                </div>

                {/* Existing secondary images (edit mode) */}
                {existingImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold text-secondary-950 mb-2">
                            {locale === 'ar' ? 'الصور الحالية' : 'Current Images'}
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {existingImages.map(img => (
                                <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-secondary-100">
                                    <img src={img.url} alt="" className="w-full h-24 object-cover" />
                                    {img.is_primary && (
                                        <span className="absolute top-1 start-1 bg-primary-900 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                            {trans('primary_badge', {}, 'units')}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                                        {!img.is_primary && (
                                            <button
                                                type="button"
                                                onClick={() => setExistingAsPrimary(img)}
                                                className="w-full py-1 bg-primary-900 text-white rounded text-xs font-medium focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                            >
                                                {trans('set_as_primary', {}, 'units')}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingImage(img)}
                                            className="w-full py-1 bg-red-600 text-white rounded text-xs font-medium focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                        >
                                            {trans('remove_image', {}, 'units')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New secondary images */}
                <div>
                    <label className="block text-sm font-semibold text-secondary-950 mb-2">
                        {trans('secondary_images', {}, 'units')}
                    </label>

                    {newPreviews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                            {newPreviews.map((src, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-primary-900/20">
                                    <img src={src} alt="" className="w-full h-24 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(i)}
                                            className="p-1.5 bg-red-600 text-white rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                            aria-label="Remove image"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                        onClick={() => moreRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-secondary-200 rounded-xl text-sm text-muted hover:text-primary-900 hover:border-primary-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {trans('add_more_images', {}, 'units')}
                    </button>
                    <input ref={moreRef} type="file" multiple accept="image/*" onChange={handleMoreImages} className="hidden" />
                    <p className="text-xs text-muted mt-1">{trans('max_images', {}, 'units')}</p>
                </div>
            </div>
        )
    }
}

export default function AdminUnitForm({ unit, areas, unitTypes, projects, features, finishingTypes }) {
    const { locale, errors } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isEdit = !!unit

    const [step, setStep] = useState(0)
    const [dirty, setDirty] = useState(false)

    // Image manager state
    const [primaryFile, setPrimaryFile] = useState(null)
    const [primaryPreview, setPrimaryPreview] = useState(null)
    const [newFiles, setNewFiles] = useState([])
    const [newPreviews, setNewPreviews] = useState([])
    const primaryRef = useRef()
    const moreRef = useRef()

    const MAX_SIZE = 10 * 1024 * 1024
    const MAX_TOTAL = 40 * 1024 * 1024

    const existingImages = unit?.images ?? []

    const { data, setData, post, processing } = useForm({
        name_ar: unit?.name_ar || '',
        name_en: unit?.name_en || unit?.name || '',
        description_ar: unit?.description_ar || '',
        description_en: unit?.description_en || '',
        type_id: unit?.type_id || '',
        area_id: unit?.area_id || '',
        project_id: unit?.project_id || '',
        transaction: unit?.transaction || 'sale',
        price: unit?.price || '',
        area_sqm: unit?.area_sqm || '',
        rooms: unit?.rooms || '',
        bathrooms: unit?.bathrooms || '',
        floor: unit?.floor ?? '',
        video_url: unit?.video_url || '',
        keywords_ar: unit?.keywords_ar || [],
        keywords_en: unit?.keywords_en || [],
        meta_description_ar: unit?.meta_description_ar || '',
        meta_description_en: unit?.meta_description_en || '',
        map_embed_url: unit?.map_embed_url || '',
        location_address_ar: unit?.location_address_ar || '',
        location_address_en: unit?.location_address_en || '',
        images: [],
        primary_image_index: 0,
        payment_method: unit?.payment_method || '',
        down_payment: unit?.down_payment || '',
        installment_years: unit?.installment_years || '',
        finishing_type_id: unit?.finishing_type_id || '',
        features: unit?.features?.map(f => f.id) || [],
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

    function handleChange(key, value) {
        setData(key, value)
        setDirty(true)

        if (key === 'project_id' && value) {
            fetchProjectAutofill(value)
        }
    }

    async function fetchProjectAutofill(projectId) {
        try {
            const response = await fetch(`/admin/projects/${projectId}/autofill`);
            if (response.ok) {
                const projectData = await response.json();
                setData(prev => ({
                    ...prev,
                    project_id: projectId, // Ensure project_id is set
                    features: projectData.features || prev.features,
                    finishing_type_id: projectData.finishing_type_id || prev.finishing_type_id,
                    payment_method: projectData.payment_method || prev.payment_method,
                    down_payment: projectData.down_payment || prev.down_payment,
                    installment_years: projectData.installment_years || prev.installment_years,
                }));
                setDirty(true);
            }
        } catch (error) {
            console.error('Failed to fetch project auto-fill data', error);
        }
    }

    function toggleFeature(id) {
        if (data.features.includes(id)) {
            setData('features', data.features.filter(f => f !== id))
        } else {
            setData('features', [...data.features, id])
        }
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

    // Image Compression Helper for Blazing Fast Uploads
    async function compressImage(file, maxWidth = 1920, quality = 0.85) {
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

                if (width <= maxWidth && file.size < 1024 * 1024) {
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
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    blob => {
                        if (!blob || blob.size >= file.size) {
                            resolve(file)
                        } else {
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            })
                            resolve(compressedFile)
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

    // Primary image handlers
    async function handlePrimaryChange(e) {
        const rawFile = e.target.files[0]
        if (!rawFile) return
        if (rawFile.size > MAX_SIZE) {
            alert(locale === 'ar' ? 'حجم الصورة كبير جداً. الحد 10 ميجابايت.' : 'Image too large. Max 10MB.')
            return
        }
        const file = await compressImage(rawFile)
        setPrimaryFile(file)
        setPrimaryPreview(URL.createObjectURL(file))
        setDirty(true)
    }

    // More images handlers
    async function handleMoreImages(e) {
        const files = Array.from(e.target.files || [])
        const valid = []
        let total = 0
        for (const f of files) {
            if (f.size > MAX_SIZE) {
                alert(locale === 'ar' ? `${f.name}: حجم كبير جداً.` : `${f.name}: Too large.`)
                continue
            }
            total += f.size
            if (total > MAX_TOTAL) {
                alert(locale === 'ar' ? 'تجاوز الحد الإجمالي 40 ميجابايت.' : 'Total exceeds 40MB limit.')
                break
            }
            const compressed = await compressImage(f)
            valid.push(compressed)
        }
        setNewFiles(prev => [...prev, ...valid])
        setNewPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
        setDirty(true)
    }

    function removeNewImage(idx) {
        setNewFiles(prev => prev.filter((_, i) => i !== idx))
        setNewPreviews(prev => prev.filter((_, i) => i !== idx))
    }

    function deleteExistingImage(img) {
        if (!unit?.id) return
        if (!confirm(locale === 'ar' ? 'هل تريد حذف هذه الصورة؟' : 'Delete this image?')) return
        router.delete(`/admin/units/${unit.id}/images/${img.id}`, { preserveScroll: true })
    }

    function setExistingAsPrimary(img) {
        if (!unit?.id) return
        router.post(`/admin/units/${unit.id}/images/${img.id}/primary`, {}, { preserveScroll: true })
    }

    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleSubmit() {
        if (processing || isSubmitting) return;

        setIsSubmitting(true);
        setDirty(false)

        // Build ordered images: primary first, then secondary
        const allImages = primaryFile ? [primaryFile, ...newFiles] : newFiles

        const payload = {
            name_ar: data.name_ar ?? '',
            name_en: data.name_en ?? '',
            description_ar: data.description_ar ?? '',
            description_en: data.description_en ?? '',
            type_id: data.type_id ?? '',
            area_id: data.area_id ?? '',
            project_id: data.project_id ?? '',
            transaction: data.transaction ?? 'sale',
            price: data.price ?? '',
            area_sqm: data.area_sqm ?? '',
            rooms: data.rooms ?? '',
            bathrooms: data.bathrooms ?? '',
            floor: data.floor ?? '',
            video_url: data.video_url ?? '',
            meta_description: data.meta_description ?? '',
            map_embed_url: data.map_embed_url ?? '',
            location_address_ar: data.location_address_ar ?? '',
            location_address_en: data.location_address_en ?? '',
            primary_image_index: '0',
            keywords_ar: data.keywords_ar,
            keywords_en: data.keywords_en,
            payment_method: data.payment_method,
            down_payment: data.down_payment,
            installment_years: data.installment_years,
            finishing_type_id: data.finishing_type_id,
            features: data.features,
            images: allImages,
        }

        if (isEdit) {
            payload._method = 'PUT'
        }

        router.post(
            isEdit ? `/admin/units/${unit.id}` : '/admin/units',
            payload,
            { 
                preserveScroll: true, 
                forceFormData: true,
                onFinish: () => setIsSubmitting(false),
                onError: () => setIsSubmitting(false)
            }
        )
    }

    function canNext() {
        if (step === 0) return (data.name_ar || data.name_en) && data.type_id && data.area_id && data.price
        return true
    }

    const primaryImage = existingImages.find(img => img.is_primary) || existingImages[0] || null

    return (
        <AdminSidebar>
            <Head title={trans('add_unit') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/units" className="text-sm text-muted hover:text-primary-900">&larr; {trans('sidebar_units')}</Link>
                    <h1 className="text-2xl font-bold text-secondary-950">
                        {isEdit ? trans('edit_unit', {}, 'units') : trans('add_unit', {}, 'units')}
                    </h1>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s.key} className="flex items-center gap-2 flex-1">
                            <button
                                type="button"
                                onClick={() => i <= step ? setStep(i) : null}
                                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${i === step ? 'bg-primary-900 text-white' :
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

                <form
                    onSubmit={e => e.preventDefault()}
                    className="bg-white rounded-xl shadow-card p-6"
                >
                    {/* ===== Step 0: Basic Info ===== */}
                    {step === 0 && (
                        <div className="space-y-4">
                            {/* Names */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar')} *</label>
                                    <input type="text" value={data.name_ar} onChange={e => handleChange('name_ar', e.target.value)} dir="rtl" required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                    {errors.name_ar && <p className="text-xs text-red-500 mt-1">{errors.name_ar}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en')} *</label>
                                    <input type="text" value={data.name_en} onChange={e => handleChange('name_en', e.target.value)} dir="ltr" required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                    {errors.name_en && <p className="text-xs text-red-500 mt-1">{errors.name_en}</p>}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('description_ar', {}, 'units')}</label>
                                    <textarea value={data.description_ar} onChange={e => handleChange('description_ar', e.target.value)} rows={4} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('description_en', {}, 'units')}</label>
                                    <textarea value={data.description_en} onChange={e => handleChange('description_en', e.target.value)} rows={4} dir="ltr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                            </div>

                            {/* Type & Area */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('type', {}, 'units')} *</label>
                                    <Select value={data.type_id} onChange={e => handleChange('type_id', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                        <option value="">—</option>
                                        {unitTypes?.map(t => <option key={t.id} value={t.id}>{locale === 'ar' ? t.name_ar : t.name_en}</option>)}
                                    </Select>
                                    {errors.type_id && <p className="text-xs text-red-500 mt-1">{errors.type_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('area')} *</label>
                                    <Select value={data.area_id} onChange={e => handleChange('area_id', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                        <option value="">—</option>
                                        {areas?.map(a => <option key={a.id} value={a.id}>{locale === 'ar' ? a.name_ar : a.name_en}</option>)}
                                    </Select>
                                    {errors.area_id && <p className="text-xs text-red-500 mt-1">{errors.area_id}</p>}
                                </div>
                            </div>

                            {/* Transaction & Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('transaction', {}, 'units')}</label>
                                    <Select value={data.transaction} onChange={e => handleChange('transaction', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                        <option value="sale">{trans('sale', {}, 'units')}</option>
                                        <option value="rent">{trans('rent', {}, 'units')}</option>
                                    </Select>
                                    {errors.transaction && <p className="text-xs text-red-500 mt-1">{errors.transaction}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('price', {}, 'units')} *</label>
                                    <input type="number" min="0" value={data.price} onChange={e => handleChange('price', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('area_sqm', {}, 'units')}</label>
                                    <input type="number" min="0" value={data.area_sqm} onChange={e => handleChange('area_sqm', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('rooms', {}, 'units')}</label>
                                    <input type="number" min="0" value={data.rooms} onChange={e => handleChange('rooms', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('bathrooms', {}, 'units')}</label>
                                    <input type="number" min="0" value={data.bathrooms} onChange={e => handleChange('bathrooms', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white" />
                                </div>
                            </div>

                            {/* Project */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('project')}</label>
                                <Select value={data.project_id} onChange={e => handleChange('project_id', e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                                    <option value="">—</option>
                                    {projects?.map(p => <option key={p.id} value={p.id}>{locale === 'ar' ? p.name_ar : p.name_en}</option>)}
                                </Select>
                            </div>

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
                                                id={`unit-feature-${feature.id}`}
                                                checked={data.features.includes(feature.id)}
                                                onChange={() => toggleFeature(feature.id)}
                                                className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
                                            />
                                            <label htmlFor={`unit-feature-${feature.id}`} className="text-sm text-secondary-700 cursor-pointer select-none">
                                                {locale === 'ar' ? feature.name_ar : feature.name_en}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== Step 1: Media ===== */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Primary Image */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary-950 mb-2">
                                    {trans('primary_image', {}, 'units')}
                                </label>
                                <div className="border-2 border-dashed border-secondary-200 rounded-xl overflow-hidden bg-surface">
                                    {(primaryPreview || primaryImage) ? (
                                        <div className="relative group">
                                            <img
                                                src={primaryPreview || primaryImage.url}
                                                alt=""
                                                className="w-full h-52 object-cover"
                                            />
                                            {!primaryPreview && primaryImage?.is_primary && (
                                                <span className="absolute top-2 start-2 bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                    {trans('primary_badge', {}, 'units')}
                                                </span>
                                            )}
                                            {primaryPreview && (
                                                <span className="absolute top-2 start-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                    {locale === 'ar' ? 'جديدة' : 'New'}
                                                </span>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => primaryRef.current?.click()}
                                                    className="px-3 py-1.5 bg-white text-secondary-950 rounded-lg text-xs font-medium hover:bg-secondary-100"
                                                >
                                                    {locale === 'ar' ? 'تغيير الصورة الرئيسية' : 'Change Primary'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => primaryRef.current?.click()}
                                            className="w-full h-40 flex flex-col items-center justify-center gap-2 text-muted hover:text-primary-900 transition-colors"
                                        >
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            <span className="text-sm font-medium">{trans('primary_image', {}, 'units')}</span>
                                            <span className="text-xs">{locale === 'ar' ? 'انقر لاختيار صورة' : 'Click to select'}</span>
                                        </button>
                                    )}
                                    <input
                                        ref={primaryRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePrimaryChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Existing Images (edit mode) */}
                            {existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-950 mb-2">
                                        {locale === 'ar' ? 'الصور الحالية' : 'Current Images'}
                                    </label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {existingImages.map(img => (
                                            <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-secondary-100 bg-surface">
                                                <img src={img.url} alt="" className="w-full h-24 object-cover" />
                                                {img.is_primary && (
                                                    <span className="absolute top-1 start-1 bg-primary-900 text-white text-xs px-1.5 py-0.5 rounded-full font-medium leading-none">
                                                        {trans('primary_badge', {}, 'units')}
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                                    {!img.is_primary && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setExistingAsPrimary(img)}
                                                            className="w-full py-1 bg-primary-900 text-white rounded text-xs font-medium"
                                                        >
                                                            {trans('set_as_primary', {}, 'units')}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteExistingImage(img)}
                                                        className="w-full py-1 bg-red-600 text-white rounded text-xs font-medium"
                                                    >
                                                        {trans('remove_image', {}, 'units')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Secondary Images */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary-950 mb-2">
                                    {trans('secondary_images', {}, 'units')}
                                </label>

                                {newPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                                        {newPreviews.map((src, i) => (
                                            <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-primary-900/20 bg-surface">
                                                <img src={src} alt="" className="w-full h-24 object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(i)}
                                                        className="p-1.5 bg-red-600 text-white rounded-full"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    onClick={() => moreRef.current?.click()}
                                    className="w-full py-3 border-2 border-dashed border-secondary-200 rounded-xl text-sm text-muted hover:text-primary-900 hover:border-primary-900/40 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    {trans('add_more_images', {}, 'units')}
                                </button>
                                <input ref={moreRef} type="file" multiple accept="image/*" onChange={handleMoreImages} className="hidden" />
                                <p className="text-xs text-muted mt-1">{trans('max_images', {}, 'units')}</p>
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('video', {}, 'units')}</label>
                                <input
                                    type="url"
                                    value={data.video_url}
                                    onChange={e => handleChange('video_url', e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                />
                                <p className="text-xs text-muted mt-1">{trans('video_url_help', {}, 'units')}</p>
                            </div>
                        </div>
                    )}

                    {/* ===== Step 2: SEO ===== */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('keywords_label', {}, 'units')} ({trans('ar')})</label>
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
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('keywords_label', {}, 'units')} ({trans('en')})</label>
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
                                    <p className="text-xs text-muted mt-1 text-end">{data.meta_description_ar.length}/500</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('meta_description')} ({trans('en')})</label>
                                    <textarea value={data.meta_description_en} onChange={e => handleChange('meta_description_en', e.target.value)} rows={3} maxLength={500} dir="ltr" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                    <p className="text-xs text-muted mt-1 text-end">{data.meta_description_en.length}/500</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== Step 3: Location ===== */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('location_address')} ({trans('ar')})</label>
                                    <input
                                        type="text"
                                        value={data.location_address_ar}
                                        onChange={e => handleChange('location_address_ar', e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                                        dir="rtl"
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('location_address')} ({trans('en')})</label>
                                    <input
                                        type="text"
                                        value={data.location_address_en}
                                        onChange={e => handleChange('location_address_en', e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                                        dir="ltr"
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('map_embed_url', {}, 'units')}</label>
                                <textarea
                                    value={data.map_embed_url}
                                    onChange={e => handleChange('map_embed_url', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ></iframe>'
                                    dir="ltr"
                                />
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

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-100">
                        <button
                            type="button"
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                            className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 disabled:opacity-50"
                        >
                            {trans('back')}
                        </button>
                        {step < STEPS.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => canNext() && setStep(step + 1)}
                                disabled={!canNext()}
                                className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50"
                            >
                                {trans('next')}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing || isSubmitting}
                                className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {(processing || isSubmitting) && (
                                    <svg className="animate-spin -ms-1 me-1 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {(processing || isSubmitting) ? trans('loading') : (isEdit ? trans('update') : trans('save'))}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AdminSidebar>
    )
}
