import { usePage, useForm, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { useState, useEffect } from 'react'

export default function AdminSettingsIndex({ settings }) {
    const { locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [logoPreview, setLogoPreview] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [heroImagePreview, setHeroImagePreview] = useState(null)
    const [heroImageFile, setHeroImageFile] = useState(null)
    const [toast, setToast] = useState(null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    // إظهار رسالة النجاح أو الخطأ من flash
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success })
            const t = setTimeout(() => setToast(null), 4000)
            return () => clearTimeout(t)
        }
        if (flash?.error) {
            setToast({ type: 'error', message: flash.error })
            const t = setTimeout(() => setToast(null), 5000)
            return () => clearTimeout(t)
        }
    }, [flash?.success, flash?.error])

    const { data, setData, processing, errors } = useForm({
        daily_deduction_enabled: settings?.daily_deduction_enabled === 'true' || settings?.daily_deduction_enabled === true,
        daily_deduction_value: settings?.daily_deduction_value || '10',
        monthly_reset_day: settings?.monthly_reset_day || '1',
        monthly_reset_auto: settings?.monthly_reset_auto === 'true' || settings?.monthly_reset_auto === true,
        auto_delete_days: settings?.auto_delete_days || '30',
        site_logo: null,
        hero_title_ar: settings?.hero_title_ar || 'ابحث عن منزل أحلامك',
        hero_title_en: settings?.hero_title_en || 'Search for your dream home',
        hero_subtitle_ar: settings?.hero_subtitle_ar || 'آلاف العقارات في جميع أنحاء المملكة',
        hero_subtitle_en: settings?.hero_subtitle_en || 'Thousands of properties across the kingdom',
        hero_image: null,
        company_phone: settings?.company_phone || '',
        company_whatsapp: settings?.company_whatsapp || '',
        company_email: settings?.company_email || '',
        company_address: settings?.company_address || '',
        social_facebook: settings?.social_facebook || '',
        social_instagram: settings?.social_instagram || '',
        social_twitter: settings?.social_twitter || '',
        social_linkedin: settings?.social_linkedin || '',
    })

    function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('daily_deduction_enabled', data.daily_deduction_enabled ? '1' : '0')
        formData.append('daily_deduction_value', data.daily_deduction_value || '10')
        formData.append('monthly_reset_day', data.monthly_reset_day || '1')
        formData.append('monthly_reset_auto', data.monthly_reset_auto ? '1' : '0')
        formData.append('auto_delete_days', data.auto_delete_days || '30')
        formData.append('hero_title_ar', data.hero_title_ar || '')
        formData.append('hero_title_en', data.hero_title_en || '')
        formData.append('hero_subtitle_ar', data.hero_subtitle_ar || '')
        formData.append('hero_subtitle_en', data.hero_subtitle_en || '')
        formData.append('company_phone', data.company_phone || '')
        formData.append('company_whatsapp', data.company_whatsapp || '')
        formData.append('company_email', data.company_email || '')
        formData.append('company_address', data.company_address || '')
        formData.append('social_facebook', data.social_facebook || '')
        formData.append('social_instagram', data.social_instagram || '')
        formData.append('social_twitter', data.social_twitter || '')
        formData.append('social_linkedin', data.social_linkedin || '')

        if (data.site_logo instanceof File) {
            formData.append('site_logo', data.site_logo)
        }
        if (data.hero_image instanceof File) {
            formData.append('hero_image', data.hero_image)
        }

        router.post('/admin/settings', formData, {
            preserveScroll: true,
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onError: (errs) => {
                const firstErr = Object.values(errs)[0]
                if (firstErr) setToast({ type: 'error', message: firstErr })
            }
        })
    }

    return (
        <AdminSidebar>
            <Head title={trans('settings') + ' — ' + trans('app_name')} />
            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 animate-fade-in ${
                        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ms-2 opacity-70 hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} dir={isRtl ? 'rtl' : 'ltr'} className="flex flex-col min-h-[calc(100vh-65px)] bg-surface pb-12">
                
                {/* Sticky Header Actions */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_settings')}</h1>
                        <p className="text-sm text-secondary-500 mt-1">
                            {locale === 'ar' ? 'إدارة إعدادات النظام والهوية البصرية' : 'Manage system settings and brand identity'}
                        </p>
                    </div>
                    <button type="submit" disabled={isSubmitting || processing} className="px-6 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                        {(isSubmitting || processing) ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {trans('save')}
                    </button>
                </div>

                {/* Bento Grid Content */}
                <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
                    
                    {/* Left Column (Brand & Hero) */}
                    <div className="xl:col-span-7 space-y-6">
                        
                        {/* Logo Upload Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-secondary-950 mb-1">{trans('settings_logo')}</h2>
                            <p className="text-sm text-secondary-500 mb-6">{locale === 'ar' ? 'سيتم تغيير اللوجو في جميع أنحاء الموقع' : 'The logo will be updated across the entire site'}</p>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="shrink-0 relative group">
                                    <div className="w-32 h-32 rounded-xl bg-secondary-50 border-2 border-dashed border-secondary-200 flex items-center justify-center p-4 overflow-hidden relative transition-colors group-hover:border-primary-900/30">
                                        {(logoPreview || settings?.site_logo) ? (
                                            <img
                                                src={logoPreview || (settings?.site_logo?.startsWith('http') || settings?.site_logo?.startsWith('/storage') ? settings.site_logo : `/storage/${settings.site_logo}`)}
                                                alt="Logo"
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                                            />
                                        ) : (
                                            <svg className="w-8 h-8 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                        {/* Overlay Hover */}
                                        <label className="absolute inset-0 bg-secondary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                            <span className="text-white text-xs font-medium bg-secondary-800/80 px-3 py-1.5 rounded-full shadow-lg">
                                                {locale === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                                            </span>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                const file = e.target.files[0] || null
                                                setData('site_logo', file)
                                                setLogoPreview(file ? URL.createObjectURL(file) : null)
                                            }} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-secondary-950">{locale === 'ar' ? 'رفع اللوجو الجديد' : 'Upload new logo'}</h3>
                                    <p className="text-xs text-secondary-500 mt-1 mb-4 leading-relaxed">
                                        {locale === 'ar' 
                                            ? 'الحد الأقصى للملف هو 2 ميجابايت. يُفضل استخدام صيغة PNG بخلفية شفافة أو SVG للحصول على أفضل جودة.' 
                                            : 'Maximum file size is 2MB. PNG with transparent background or SVG is recommended for best quality.'}
                                    </p>
                                    {errors.site_logo && <p className="text-xs text-error mt-1 p-2 bg-error/10 rounded border border-error/20">{errors.site_logo}</p>}
                                    {logoPreview && (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {locale === 'ar' ? 'تم اختيار صورة جديدة (لم تُحفظ)' : 'New image selected (unsaved)'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hero Section Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-secondary-100 bg-secondary-50/50">
                                <h2 className="text-lg font-semibold text-secondary-950">{locale === 'ar' ? 'غلاف الصفحة الرئيسية' : 'Homepage Hero Section'}</h2>
                                <p className="text-sm text-secondary-500 mt-1">{locale === 'ar' ? 'يظهر للزوار في أول الصفحة' : 'Visible to visitors at the top of the page'}</p>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Hero Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-3">{locale === 'ar' ? 'صورة الغلاف (الخلفية)' : 'Hero Background Image'}</label>
                                    <div className="relative group rounded-xl overflow-hidden border border-secondary-200 bg-secondary-50 aspect-[21/9] flex items-center justify-center">
                                        {(heroImagePreview || settings?.hero_image) ? (
                                            <img src={heroImagePreview || `/storage/${settings.hero_image}`} alt="Hero" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-6">
                                                <svg className="w-10 h-10 text-secondary-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm font-medium text-secondary-500">{locale === 'ar' ? 'لا توجد صورة' : 'No image'}</p>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-secondary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                            <span className="text-white text-sm font-medium bg-secondary-800/80 px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                {locale === 'ar' ? 'رفع صورة جديدة' : 'Upload new image'}
                                            </span>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                const file = e.target.files[0] || null
                                                setData('hero_image', file)
                                                setHeroImagePreview(file ? URL.createObjectURL(file) : null)
                                            }} />
                                        </label>
                                    </div>
                                    {errors.hero_image && <p className="text-xs text-error mt-2">{errors.hero_image}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-secondary-950 uppercase tracking-wide border-b border-secondary-100 pb-2">{locale === 'ar' ? 'النصوص العربية' : 'Arabic Texts'}</h3>
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-600 mb-1">{locale === 'ar' ? 'العنوان الرئيسي' : 'Main Title'}</label>
                                            <input type="text" value={data.hero_title_ar} onChange={e => setData('hero_title_ar', e.target.value)} dir="rtl" className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-600 mb-1">{locale === 'ar' ? 'الوصف الفرعي' : 'Subtitle'}</label>
                                            <textarea value={data.hero_subtitle_ar} onChange={e => setData('hero_subtitle_ar', e.target.value)} dir="rtl" rows={2} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-secondary-950 uppercase tracking-wide border-b border-secondary-100 pb-2">{locale === 'ar' ? 'النصوص الإنجليزية' : 'English Texts'}</h3>
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-600 mb-1">{locale === 'ar' ? 'العنوان الرئيسي' : 'Main Title'}</label>
                                            <input type="text" value={data.hero_title_en} onChange={e => setData('hero_title_en', e.target.value)} dir="ltr" className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-600 mb-1">{locale === 'ar' ? 'الوصف الفرعي' : 'Subtitle'}</label>
                                            <textarea value={data.hero_subtitle_en} onChange={e => setData('hero_subtitle_en', e.target.value)} dir="ltr" rows={2} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Points & Contact) */}
                    <div className="xl:col-span-5 space-y-6">
                        
                        {/* System Rules Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-secondary-100 bg-secondary-50/50 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-secondary-100 text-primary-900">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                                </div>
                                <h2 className="text-lg font-semibold text-secondary-950">{trans('settings_points')} &amp; {trans('settings_auto_delete')}</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Daily Deduction */}
                                <div className="p-4 rounded-xl border border-secondary-200 bg-secondary-50/50">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" checked={data.daily_deduction_enabled} onChange={e => setData('daily_deduction_enabled', e.target.checked)} className="peer sr-only" />
                                            <div className="w-11 h-6 bg-secondary-300 rounded-full peer-checked:bg-primary-900 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:rtl:-left-1 after:rtl:right-1 after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                                        </div>
                                        <span className="text-sm font-medium text-secondary-950">{trans('daily_deduction')}</span>
                                    </label>
                                    
                                    {data.daily_deduction_enabled && (
                                        <div className="mt-4 pt-4 border-t border-secondary-200">
                                            <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('daily_deduction_value')}</label>
                                            <div className="relative">
                                                <input type="number" value={data.daily_deduction_value} onChange={e => setData('daily_deduction_value', e.target.value)} className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                                <span className="absolute inset-y-0 end-0 flex items-center pe-4 text-xs font-medium text-secondary-400 pointer-events-none">Points</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Monthly Reset */}
                                <div className="p-4 rounded-xl border border-secondary-200 bg-secondary-50/50">
                                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" checked={data.monthly_reset_auto} onChange={e => setData('monthly_reset_auto', e.target.checked)} className="peer sr-only" />
                                            <div className="w-11 h-6 bg-secondary-300 rounded-full peer-checked:bg-primary-900 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:rtl:-left-1 after:rtl:right-1 after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                                        </div>
                                        <span className="text-sm font-medium text-secondary-950">{trans('automatic')} {trans('monthly_reset')}</span>
                                    </label>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('monthly_reset_day')}</label>
                                        <input type="number" min="1" max="28" value={data.monthly_reset_day} onChange={e => setData('monthly_reset_day', e.target.value)} className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                    </div>
                                </div>

                                {/* Cleanups */}
                                <div>
                                    <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('auto_delete_days')}</label>
                                    <input type="number" min="1" value={data.auto_delete_days} onChange={e => setData('auto_delete_days', e.target.value)} className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-secondary-950 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {trans('settings_contact')}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('phone')}</label>
                                    <input type="text" dir="ltr" value={data.company_phone} onChange={e => setData('company_phone', e.target.value)} className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('whatsapp')}</label>
                                    <input type="text" dir="ltr" placeholder="+2010..." value={data.company_whatsapp} onChange={e => setData('company_whatsapp', e.target.value)} className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('email')}</label>
                                    <input type="email" dir="ltr" value={data.company_email} onChange={e => setData('company_email', e.target.value)} className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-secondary-600 mb-1">{trans('address')}</label>
                                    <textarea value={data.company_address} onChange={e => setData('company_address', e.target.value)} rows={2} className="w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Social Media Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-secondary-950 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                {trans('settings_social')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900">
                                    <span className="bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </span>
                                    <input type="text" dir="ltr" placeholder="https://facebook.com/..." value={data.social_facebook} onChange={e => setData('social_facebook', e.target.value)} className="w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white" />
                                </div>
                                <div className="flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900">
                                    <span className="bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                    </span>
                                    <input type="text" dir="ltr" placeholder="https://instagram.com/..." value={data.social_instagram} onChange={e => setData('social_instagram', e.target.value)} className="w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white" />
                                </div>
                                <div className="flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900">
                                    <span className="bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </span>
                                    <input type="text" dir="ltr" placeholder="https://x.com/..." value={data.social_twitter} onChange={e => setData('social_twitter', e.target.value)} className="w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white" />
                                </div>
                                <div className="flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900">
                                    <span className="bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                                    </span>
                                    <input type="text" dir="ltr" placeholder="https://linkedin.com/in/..." value={data.social_linkedin} onChange={e => setData('social_linkedin', e.target.value)} className="w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </AdminSidebar>
    )
}
