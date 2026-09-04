import { Select } from '../../../Components/UI'
import { usePage, useForm, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect, useRef } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { compressImage as compressImageUtil } from '../../../Utils/image'

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

export default function AdminUnitForm({ unit, areas, unitTypes, projects, features, finishingTypes, managers = [] }) {
    const { locale, errors, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isEdit = !!unit
    const isAdmin = auth?.user?.role === 'admin'

    const [step, setStep] = useState(0)
    const [dirty, setDirty] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)  // 0-100
    const [uploadStatus, setUploadStatus] = useState('')     // نص وصف الحالة

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
        user_id: unit?.user_id || '',
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
        latitude: unit?.latitude || '',
        longitude: unit?.longitude || '',
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
    const [kwWarningAr, setKwWarningAr] = useState(false)
    const [kwWarningEn, setKwWarningEn] = useState(false)
    const MAX_KEYWORDS = 25

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

    function parseKeywords(text) {
        if (!text) return []
        return text
            .split(/[,،;.\n]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
    }

    function addKeywordAr() {
        if (!keywordInputAr) return
        const parsed = parseKeywords(keywordInputAr)
        if (parsed.length > 0) {
            const existing = new Set(data.keywords_ar)
            const toAdd = parsed.filter(k => !existing.has(k))
            const available = MAX_KEYWORDS - data.keywords_ar.length
            if (available <= 0) {
                setKwWarningAr(true)
                setKeywordInputAr('')
                return
            }
            const limited = toAdd.slice(0, available)
            setKwWarningAr(toAdd.length > available)
            if (limited.length > 0) {
                setData('keywords_ar', [...data.keywords_ar, ...limited])
                setDirty(true)
            }
        }
        setKeywordInputAr('')
    }

    function removeKeywordAr(kw) {
        setData('keywords_ar', data.keywords_ar.filter(k => k !== kw))
        setKwWarningAr(false)
        setDirty(true)
    }

    function clearKeywordsAr() {
        setData('keywords_ar', [])
        setKwWarningAr(false)
        setDirty(true)
    }

    function addKeywordEn() {
        if (!keywordInputEn) return
        const parsed = parseKeywords(keywordInputEn)
        if (parsed.length > 0) {
            const existing = new Set(data.keywords_en)
            const toAdd = parsed.filter(k => !existing.has(k))
            const available = MAX_KEYWORDS - data.keywords_en.length
            if (available <= 0) {
                setKwWarningEn(true)
                setKeywordInputEn('')
                return
            }
            const limited = toAdd.slice(0, available)
            setKwWarningEn(toAdd.length > available)
            if (limited.length > 0) {
                setData('keywords_en', [...data.keywords_en, ...limited])
                setDirty(true)
            }
        }
        setKeywordInputEn('')
    }

    function removeKeywordEn(kw) {
        setData('keywords_en', data.keywords_en.filter(k => k !== kw))
        setKwWarningEn(false)
        setDirty(true)
    }

    function clearKeywordsEn() {
        setData('keywords_en', [])
        setKwWarningEn(false)
        setDirty(true)
    }

    // ضغط صورة واحدة بأعلى دقة WebP للكمبيوتر والموبايل
    function compressImage(file) {
        return compressImageUtil(file, { maxWidth: 2048, maxHeight: 2048, quality: 0.88 })
    }

    // الصورة الرئيسية
    async function handlePrimaryChange(e) {
        const rawFile = e.target.files[0]
        if (!rawFile) return
        if (rawFile.size > MAX_SIZE) {
            alert(locale === 'ar' ? 'حجم الصورة كبير جداً. الحد 10 ميجابايت.' : 'Image too large. Max 10MB.')
            return
        }
        setUploadStatus(locale === 'ar' ? 'جاري ضغط الصورة...' : 'Compressing...')
        const file = await compressImage(rawFile)
        setPrimaryFile(file)
        setPrimaryPreview(URL.createObjectURL(file))
        setUploadStatus('')
        setDirty(true)
    }

    // الصور الإضافية — ضغط متوازٍ (Parallel)
    async function handleMoreImages(e) {
        const files = Array.from(e.target.files || [])
        // تصفية الحجم أولاً
        const filtered = files.filter(f => {
            if (f.size > MAX_SIZE) {
                alert(locale === 'ar' ? `${f.name}: حجم كبير جداً.` : `${f.name}: Too large.`)
                return false
            }
            return true
        })

        if (filtered.length === 0) return

        setUploadStatus(locale === 'ar'
            ? `جاري ضغط ${filtered.length} صورة بالتوازي...`
            : `Compressing ${filtered.length} image(s) in parallel...`
        )

        // ضغط كل الصور في نفس الوقت (Parallel)
        const compressed = await Promise.all(filtered.map(f => compressImage(f)))

        // التحقق من الحجم الإجمالي بعد الضغط
        let total = newFiles.reduce((s, f) => s + f.size, 0)
        const valid = []
        for (const f of compressed) {
            total += f.size
            if (total > MAX_TOTAL) {
                alert(locale === 'ar' ? 'تجاوز الحد الإجمالي 40 ميجابايت.' : 'Total exceeds 40MB limit.')
                break
            }
            valid.push(f)
        }

        setUploadStatus('')
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
        if (processing || isSubmitting) return

        setIsSubmitting(true)
        setDirty(false)
        setUploadProgress(0)

        const allImages = primaryFile ? [primaryFile, ...newFiles] : newFiles
        const hasImages = allImages.length > 0

        const payload = {
            user_id: data.user_id ?? '',
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
            meta_description_ar: data.meta_description_ar ?? '',
            meta_description_en: data.meta_description_en ?? '',
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

        if (isEdit) payload._method = 'PUT'

        // رسالة الحالة الابتدائية
        if (hasImages) {
            const totalMB = (allImages.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)
            setUploadStatus(locale === 'ar'
                ? `جاري رفع ${allImages.length} صورة (${totalMB} MB)...`
                : `Uploading ${allImages.length} image(s) (${totalMB} MB)...`
            )
        } else {
            setUploadStatus(locale === 'ar' ? 'جاري حفظ البيانات...' : 'Saving...')
        }

        const url = isEdit ? `/admin/units/${unit.id}` : '/admin/units'

        // Inertia router.post مع onProgress لشريط التقدم — بدون إرسال مزدوج
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
            },
            onError: (errs) => {
                setIsSubmitting(false)
                setUploadProgress(0)
                setUploadStatus(locale === 'ar' ? 'عفواً، تعذر الحفظ. يرجى مراجعة الأخطاء في أعلى الصفحة.' : 'Error saving data. Please check errors above.')
                if (errs && (errs.name_ar || errs.name_en || errs.type_id || errs.area_id || errs.price)) {
                    setStep(0)
                }
            },
        })
    }

    function canNext() {
        if (step === 0) return (data.name_ar || data.name_en) && data.type_id && data.area_id && data.price
        return true
    }

    const primaryImage = existingImages.find(img => img.is_primary) || existingImages[0] || null
    const hasErrors = errors && Object.keys(errors).length > 0

    return (
        <AdminSidebar>
            <Head title={trans('add_unit') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/units" className="text-sm text-muted hover:text-primary-900">&larr; {trans('sidebar_units')}</Link>
                    <h1 className="text-2xl font-bold text-secondary-950">
                        {isEdit ? trans('edit_unit', {}, 'units') : trans('add_unit', {}, 'units')}
                    </h1>
                </div>

                {hasErrors && (
                    <div className="mb-6 p-4 bg-red-50 border-s-4 border-red-500 text-red-800 rounded-xl text-sm space-y-1.5 shadow-sm">
                        <p className="font-bold flex items-center gap-2 text-base">
                            <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {locale === 'ar' ? 'تعذر حفظ البيانات بسبب الأخطاء التالية:' : 'Could not save data due to errors:'}
                        </p>
                        <ul className="list-disc list-inside text-xs text-red-700 space-y-1 mt-1 font-medium">
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute top-1/2 start-0 end-0 h-1 bg-[#F5F5F5] -z-10 rounded-full" />
                    {STEPS.map((s, i) => (
                        <div key={s.key} className="flex flex-col items-center gap-2 relative z-10">
                            <button
                                type="button"
                                onClick={() => i <= step ? setStep(i) : null}
                                className={`w-10 h-10 rounded-2xl text-sm font-black flex items-center justify-center transition-all duration-300 shadow-sm ${i === step ? 'bg-[#CC0000] text-white scale-110 ring-4 ring-[#FFE3E3]' :
                                    i < step ? 'bg-[#16a34a] text-white cursor-pointer hover:bg-green-600' :
                                        'bg-[#F5F5F5] text-secondary-400 cursor-not-allowed border border-secondary-200'
                                    }`}
                            >
                                {i < step ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </button>
                            <span className={`text-xs sm:text-sm font-bold absolute -bottom-7 whitespace-nowrap transition-colors ${i === step ? 'text-[#CC0000]' : 'text-secondary-500'}`}>
                                {trans(s.title_key) || s.key}
                            </span>
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={e => e.preventDefault()}
                    className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-6 md:p-8 mt-12 transition-all duration-300"
                >
                    {/* ===== Step 0: Basic Info ===== */}
                    {step === 0 && (
                        <div className="space-y-4">
                            {/* Names */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_ar')} *</label>
                                    <input type="text" maxLength={100} value={data.name_ar} onChange={e => handleChange('name_ar', e.target.value)} dir="rtl" required className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                    {errors.name_ar && <p className="text-xs text-red-500 mt-1">{errors.name_ar}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name_en')} *</label>
                                    <input type="text" maxLength={100} value={data.name_en} onChange={e => handleChange('name_en', e.target.value)} dir="ltr" required className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                    {errors.name_en && <p className="text-xs text-red-500 mt-1">{errors.name_en}</p>}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('description_ar', {}, 'units')}</label>
                                    <textarea value={data.description_ar} onChange={e => handleChange('description_ar', e.target.value)} rows={6} dir="rtl" maxLength={50000} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                    <p className={`text-xs mt-1 text-end ${data.description_ar.length >= 49500 ? 'text-red-500 font-semibold' : 'text-secondary-400'}`}>
                                        {data.description_ar.length} / 50000
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('description_en', {}, 'units')}</label>
                                    <textarea value={data.description_en} onChange={e => handleChange('description_en', e.target.value)} rows={6} dir="ltr" maxLength={50000} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                    <p className={`text-xs mt-1 text-end ${data.description_en.length >= 49500 ? 'text-red-500 font-semibold' : 'text-secondary-400'}`}>
                                        {data.description_en.length} / 50000
                                    </p>
                                </div>
                            </div>

                            {/* Type & Area */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('type', {}, 'units')} *</label>
                                    <Select value={data.type_id} onChange={e => handleChange('type_id', e.target.value)} required className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none">
                                        <option value="">—</option>
                                        {unitTypes?.map(t => <option key={t.id} value={t.id}>{locale === 'ar' ? t.name_ar : t.name_en}</option>)}
                                    </Select>
                                    {errors.type_id && <p className="text-xs text-red-500 mt-1">{errors.type_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('area')} *</label>
                                    <Select value={data.area_id} onChange={e => handleChange('area_id', e.target.value)} required className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none">
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
                                    <Select value={data.transaction} onChange={e => handleChange('transaction', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none">
                                        <option value="sale">{trans('sale', {}, 'units')}</option>
                                        <option value="rent">{trans('rent', {}, 'units')}</option>
                                    </Select>
                                    {errors.transaction && <p className="text-xs text-red-500 mt-1">{errors.transaction}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('price', {}, 'units')} *</label>
                                    <input type="number" min="0" value={data.price} onChange={e => handleChange('price', e.target.value)} required className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('area_sqm', {}, 'units')}</label>
                                    <input type="number" min="0" value={data.area_sqm} onChange={e => handleChange('area_sqm', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('rooms', {}, 'units')}</label>
                                    <input type="number" min="0" value={data.rooms} onChange={e => handleChange('rooms', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('bathrooms', {}, 'units')}</label>
                                    <input type="number" min="0" value={data.bathrooms} onChange={e => handleChange('bathrooms', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                </div>
                            </div>

                            {/* Project & Agent */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('project')}</label>
                                    <Select value={data.project_id} onChange={e => handleChange('project_id', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none">
                                        <option value="">—</option>
                                        {projects?.map(p => <option key={p.id} value={p.id}>{locale === 'ar' ? p.name_ar : p.name_en}</option>)}
                                    </Select>
                                </div>
                                {isAdmin && managers?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary-950 mb-1">
                                            {locale === 'ar' ? 'الوسيط المختص للوحدة' : 'Assigned Agent / Manager'}
                                        </label>
                                        <Select
                                            value={data.user_id || ''}
                                            onChange={e => handleChange('user_id', e.target.value)}
                                            className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"
                                        >
                                            <option value="">{locale === 'ar' ? 'اختر الوسيط المختص...' : 'Select Agent...'}</option>
                                            {managers?.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} ({m.role === 'admin' ? (locale === 'ar' ? 'أدمن' : 'Admin') : m.role === 'manager' ? (locale === 'ar' ? 'مدير' : 'Manager') : (locale === 'ar' ? 'وسيط' : 'Agent')})
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-secondary-100">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('payment_method') || 'Payment Method'}</label>
                                    <Select value={data.payment_method} onChange={e => handleChange('payment_method', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none">
                                        <option value="">—</option>
                                        <option value="cash">{trans('cash') || 'Cash'}</option>
                                        <option value="installment">{trans('installment') || 'Installment'}</option>
                                        <option value="both">{trans('both') || 'Cash & Installment'}</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('finishing_type') || 'Finishing Type'}</label>
                                    <Select value={data.finishing_type_id} onChange={e => handleChange('finishing_type_id', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none">
                                        <option value="">—</option>
                                        {finishingTypes?.map(f => <option key={f.id} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>)}
                                    </Select>
                                </div>
                                {['installment', 'both'].includes(data.payment_method) && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('down_payment') || 'Down Payment'}</label>
                                            <input type="text" value={data.down_payment} onChange={e => handleChange('down_payment', e.target.value)} placeholder={locale === 'ar' ? 'مثال: 10% أو 500,000' : 'e.g. 10% or 500,000'} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('installment_years') || 'Installment Years'}</label>
                                            <input type="number" min="0" value={data.installment_years} onChange={e => handleChange('installment_years', e.target.value)} className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
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
                                    className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"
                                />
                                <p className="text-xs text-muted mt-1">{trans('video_url_help', {}, 'units')}</p>
                            </div>
                        </div>
                    )}

                    {/* ===== Step 2: SEO ===== */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-semibold text-secondary-950">
                                            {trans('keywords_label', {}, 'units')} ({trans('ar')})
                                            <span className={`text-xs font-normal ms-1 ${data.keywords_ar.length >= MAX_KEYWORDS ? 'text-red-500' : 'text-muted'}`}>
                                                ({data.keywords_ar.length} / {MAX_KEYWORDS})
                                            </span>
                                        </label>
                                        {data.keywords_ar.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearKeywordsAr}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                                            >
                                                {locale === 'ar' ? 'تفريغ الكل' : 'Clear All'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <textarea
                                            value={keywordInputAr}
                                            onChange={e => { setKeywordInputAr(e.target.value); setKwWarningAr(false) }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    addKeywordAr()
                                                }
                                            }}
                                            rows={2}
                                            dir="rtl"
                                            disabled={data.keywords_ar.length >= MAX_KEYWORDS}
                                            placeholder={data.keywords_ar.length >= MAX_KEYWORDS
                                                ? (locale === 'ar' ? 'وصلت للحد الأقصى 25 كلمة' : 'Max 25 keywords reached')
                                                : (locale === 'ar' ? 'الصق النص أو الكلمات مفصولة بفاصلة (، أو .) أو سطر جديد...' : 'Paste text or keywords separated by commas or newlines...')}
                                            className="flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={addKeywordAr}
                                            disabled={data.keywords_ar.length >= MAX_KEYWORDS}
                                            className="px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {trans('add')}
                                        </button>
                                    </div>
                                    {kwWarningAr && (
                                        <p className="text-xs text-red-500 mb-2">
                                            {locale === 'ar' ? 'وصلت للحد الأقصى ٢٥ كلمة مفتاحية' : 'Max 25 keywords reached'}
                                        </p>
                                    )}
                                    {data.keywords_ar.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface">
                                            {data.keywords_ar.map(kw => (
                                                <span key={kw} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors">
                                                    {kw}
                                                    <button type="button" onClick={() => removeKeywordAr(kw)} className="text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-semibold text-secondary-950">
                                            {trans('keywords_label', {}, 'units')} ({trans('en')})
                                            <span className={`text-xs font-normal ms-1 ${data.keywords_en.length >= MAX_KEYWORDS ? 'text-red-500' : 'text-muted'}`}>
                                                ({data.keywords_en.length} / {MAX_KEYWORDS})
                                            </span>
                                        </label>
                                        {data.keywords_en.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearKeywordsEn}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                                            >
                                                {locale === 'ar' ? 'تفريغ الكل' : 'Clear All'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <textarea
                                            value={keywordInputEn}
                                            onChange={e => { setKeywordInputEn(e.target.value); setKwWarningEn(false) }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    addKeywordEn()
                                                }
                                            }}
                                            rows={2}
                                            dir="ltr"
                                            disabled={data.keywords_en.length >= MAX_KEYWORDS}
                                            placeholder={data.keywords_en.length >= MAX_KEYWORDS
                                                ? 'Max 25 keywords reached'
                                                : 'Paste English keywords separated by commas or newlines...'}
                                            className="flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={addKeywordEn}
                                            disabled={data.keywords_en.length >= MAX_KEYWORDS}
                                            className="px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {trans('add')}
                                        </button>
                                    </div>
                                    {kwWarningEn && (
                                        <p className="text-xs text-red-500 mb-2">
                                            {locale === 'ar' ? 'وصلت للحد الأقصى ٢٥ كلمة مفتاحية' : 'Max 25 keywords reached'}
                                        </p>
                                    )}
                                    {data.keywords_en.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface">
                                            {data.keywords_en.map(kw => (
                                                <span key={kw} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors">
                                                    {kw}
                                                    <button type="button" onClick={() => removeKeywordEn(kw)} className="text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('meta_description')} ({trans('ar')})</label>
                                    <textarea value={data.meta_description_ar} onChange={e => handleChange('meta_description_ar', e.target.value)} rows={3} maxLength={500} dir="rtl" className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
                                    <p className="text-xs text-muted mt-1 text-end">{data.meta_description_ar.length}/500</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('meta_description')} ({trans('en')})</label>
                                    <textarea value={data.meta_description_en} onChange={e => handleChange('meta_description_en', e.target.value)} rows={3} maxLength={500} dir="ltr" className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none" />
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
                                        className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"
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
                                        className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{locale === 'ar' ? 'رابط الموقع على خرائط جوجل (Google Maps Location URL)' : 'Google Maps Location URL'}</label>
                                <input
                                    type="text"
                                    value={data.map_embed_url}
                                    onChange={e => handleChange('map_embed_url', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none font-mono text-xs"
                                    placeholder="https://www.google.com/maps/place/..."
                                    dir="ltr"
                                />
                                <p className="text-xs text-muted mt-1">{locale === 'ar' ? 'قم بلصق الرابط العادي لخريطة جوجل (بما في ذلك الروابط المختصرة). سيتم استخراج الإحداثيات تلقائياً عند الحفظ.' : 'Paste a normal Google Maps location link. The system will automatically extract the latitude and longitude.'}</p>
                                {errors.map_embed_url && <p className="text-xs text-red-500 mt-1">{errors.map_embed_url}</p>}
                            </div>
                            
                            {(data.latitude || data.longitude) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-950 mb-1">{locale === 'ar' ? 'دائرة العرض (Latitude)' : 'Latitude'}</label>
                                        <input type="text" value={data.latitude} dir="ltr" className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl text-sm focus:ring-0 text-gray-500 cursor-not-allowed" readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-950 mb-1">{locale === 'ar' ? 'خط الطول (Longitude)' : 'Longitude'}</label>
                                        <input type="text" value={data.longitude} dir="ltr" className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl text-sm focus:ring-0 text-gray-500 cursor-not-allowed" readOnly />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
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
                                {uploadProgress > 0 && (
                                    <div className="w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary-900 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                )}
                                {uploadProgress === 0 && (
                                    <div className="w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-primary-900 h-2 rounded-full animate-pulse w-1/3" />
                                    </div>
                                )}
                            </div>
                        )}
                        {/* معلومات الصور المختارة */}
                        {!isSubmitting && (primaryFile || newFiles.length > 0) && (
                            <div className="text-xs text-secondary-500 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    {locale === 'ar'
                                        ? `${(primaryFile ? 1 : 0) + newFiles.length} صورة جاهزة للرفع — ${((primaryFile ? primaryFile.size : 0) + newFiles.reduce((s, f) => s + f.size, 0)) > 0 ? (((primaryFile ? primaryFile.size : 0) + newFiles.reduce((s, f) => s + f.size, 0)) / 1048576).toFixed(1) + ' MB' : ''}`
                                        : `${(primaryFile ? 1 : 0) + newFiles.length} image(s) ready — ${(((primaryFile ? primaryFile.size : 0) + newFiles.reduce((s, f) => s + f.size, 0)) / 1048576).toFixed(1)} MB`
                                    }
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(Math.max(0, step - 1))}
                                disabled={step === 0 || isSubmitting}
                                className="px-6 py-3 bg-[#F5F5F5] text-secondary-800 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#E4E4E4] disabled:opacity-50 active:scale-[0.97]"
                            >
                                {trans('back')}
                            </button>
                            {step < STEPS.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => canNext() && setStep(step + 1)}
                                    disabled={!canNext()}
                                    className="px-6 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg disabled:opacity-50 active:scale-[0.97] focus:ring-4 focus:ring-[#FFE3E3]"
                                >
                                    {trans('next')}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing || isSubmitting}
                                    className="px-6 py-3 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.97] focus:ring-4 focus:ring-[#FFE3E3]"
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
