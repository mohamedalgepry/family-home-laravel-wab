import { usePage, useForm, Link, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'

export default function AreaForm({ area, parents, mode = 'create' }) {
    const { locale, errors, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [activeTab, setActiveTab] = useState('basic')

    const { data, setData, post, processing } = useForm({
        _method: mode === 'edit' ? 'put' : 'post',
        name_ar: area?.name_ar || '',
        name_en: area?.name_en || '',
        is_active: area?.is_active ?? true,
        sort_order: area?.sort_order || 0,
        parent_id: area?.parent_id || '',
        
        short_description_ar: area?.short_description_ar || '',
        short_description_en: area?.short_description_en || '',
        hero_title_ar: area?.hero_title_ar || '',
        hero_title_en: area?.hero_title_en || '',
        hero_description_ar: area?.hero_description_ar || '',
        hero_description_en: area?.hero_description_en || '',
        hero_image: null,
        gallery: [],
        
        about_ar: area?.about_ar || '',
        about_en: area?.about_en || '',
        
        address_ar: area?.address_ar || '',
        address_en: area?.address_en || '',
        latitude: area?.latitude || '',
        longitude: area?.longitude || '',
        map_url: area?.map_url || '',
        
        meta_title_ar: area?.meta_title_ar || '',
        meta_title_en: area?.meta_title_en || '',
        meta_description_ar: area?.meta_description_ar || '',
        meta_description_en: area?.meta_description_en || '',
        meta_keywords_ar: Array.isArray(area?.meta_keywords_ar) ? area.meta_keywords_ar.join(', ') : (area?.meta_keywords_ar || ''),
        meta_keywords_en: Array.isArray(area?.meta_keywords_en) ? area.meta_keywords_en.join(', ') : (area?.meta_keywords_en || ''),
        
        features: area?.features || [],
        nearby_places: area?.nearbyPlaces || [],
        faqs: area?.faqs || [],
    })

    const tabs = [
        { id: 'basic', label: trans('basic_information'), icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'hero', label: trans('hero_and_images'), icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'content', label: trans('content_and_features'), icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { id: 'nearby', label: trans('nearby_places'), icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
        { id: 'location', label: trans('location_and_map'), icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
        { id: 'faq', label: trans('faq'), icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'seo', label: trans('seo'), icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    ]

    function handleSubmit(e) {
        e.preventDefault()

        const payload = { ...data }
        payload.meta_keywords_ar = typeof data.meta_keywords_ar === 'string' 
            ? data.meta_keywords_ar.split(',').map(k => k.trim()).filter(Boolean) 
            : data.meta_keywords_ar
        payload.meta_keywords_en = typeof data.meta_keywords_en === 'string' 
            ? data.meta_keywords_en.split(',').map(k => k.trim()).filter(Boolean) 
            : data.meta_keywords_en

        if (mode === 'create') {
            router.post('/admin/areas', payload)
        } else {
            router.post(`/admin/areas/${area.id}`, payload)
        }
    }

    // Dynamic Lists Helpers
    const addFeature = () => setData('features', [...data.features, { title_ar: '', title_en: '', description_ar: '', description_en: '', icon: '', sort_order: 0, is_active: true }])
    const updateFeature = (index, field, value) => {
        const newFeatures = [...data.features]
        newFeatures[index][field] = value
        setData('features', newFeatures)
    }
    const removeFeature = (index) => setData('features', data.features.filter((_, i) => i !== index))

    const addNearby = () => setData('nearby_places', [...data.nearby_places, { name_ar: '', name_en: '', description_ar: '', description_en: '', distance: '', distance_unit: 'minutes', icon: '', sort_order: 0, is_active: true }])
    const updateNearby = (index, field, value) => {
        const newPlaces = [...data.nearby_places]
        newPlaces[index][field] = value
        setData('nearby_places', newPlaces)
    }
    const removeNearby = (index) => setData('nearby_places', data.nearby_places.filter((_, i) => i !== index))

    const addFaq = () => setData('faqs', [...data.faqs, { question_ar: '', question_en: '', answer_ar: '', answer_en: '', sort_order: 0, is_active: true }])
    const updateFaq = (index, field, value) => {
        const newFaqs = [...data.faqs]
        newFaqs[index][field] = value
        setData('faqs', newFaqs)
    }
    const removeFaq = (index) => setData('faqs', data.faqs.filter((_, i) => i !== index))

    // CSS Classes
    const inputClasses = "w-full px-4 py-3 bg-[#F5F5F5] border-2 border-transparent rounded-xl text-sm transition-all duration-200 hover:bg-[#E4E4E4] focus:bg-white focus:border-[#CC0000] focus:ring-4 focus:ring-[#FFE3E3] focus:outline-none"
    const labelClasses = "block text-sm font-bold text-secondary-900 mb-2"
    const errorClasses = "text-red-500 text-xs mt-1"

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-1/4">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-secondary-100 sticky top-24">
                    <nav className="flex flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === tab.id 
                                        ? 'bg-[#CC0000] text-white shadow-md' 
                                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                                }`}
                            >
                                <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-secondary-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-secondary-100">
                        <button type="submit" disabled={processing} className="w-full mb-3 px-6 py-3.5 bg-[#CC0000] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#B00000] hover:shadow-lg active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-[#FFE3E3] disabled:opacity-70 flex items-center justify-center gap-2">
                            {processing && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {trans('save')}
                        </button>
                        <Link href="/admin/areas" className="w-full px-6 py-3.5 bg-[#F5F5F5] text-secondary-900 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#E4E4E4] flex items-center justify-center">
                            {trans('cancel')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full lg:w-3/4">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-secondary-100 min-h-[600px]">
                    
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 mb-6 border-b border-secondary-100 pb-4">{trans('basic_information')}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('name_ar')} <span className="text-[#CC0000]">*</span></label>
                                    <input type="text" value={data.name_ar} onChange={e => setData('name_ar', e.target.value)} required dir="rtl" className={inputClasses} />
                                    {errors.name_ar && <p className={errorClasses}>{errors.name_ar}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('name_en')} <span className="text-[#CC0000]">*</span></label>
                                    <input type="text" value={data.name_en} onChange={e => setData('name_en', e.target.value)} required dir="ltr" className={inputClasses} />
                                    {errors.name_en && <p className={errorClasses}>{errors.name_en}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('short_description_ar')}</label>
                                    <textarea rows={3} value={data.short_description_ar} onChange={e => setData('short_description_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('short_description_en')}</label>
                                    <textarea rows={3} value={data.short_description_en} onChange={e => setData('short_description_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('parent_area')}</label>
                                    <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)} className={inputClasses}>
                                        <option value="">{trans('none_root_area')}</option>
                                        {parents?.map(p => <option key={p.id} value={p.id}>{isRtl ? p.name_ar : p.name_en}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('sort_order')}</label>
                                    <input type="number" min="0" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className={inputClasses} />
                                </div>
                                <div className="flex flex-col justify-center pt-2 md:pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                            <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${data.is_active ? 'bg-[#16a34a]' : 'bg-secondary-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${data.is_active ? 'transform translate-x-6' : ''}`}>
                                                {data.is_active && (
                                                    <svg className="w-4 h-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-secondary-900 group-hover:text-[#CC0000] transition-colors">{data.is_active ? trans('active') : trans('inactive')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Tab */}
                    {activeTab === 'hero' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 mb-6 border-b border-secondary-100 pb-4">{trans('hero_section')}</h2>
                            
                            <div className="mb-6">
                                <label className={labelClasses}>{trans('hero_cover_image')}</label>
                                <input type="file" accept="image/*" onChange={e => setData('hero_image', e.target.files[0])} className={inputClasses} />
                                {area?.hero_image && !data.hero_image && (
                                    <div className="mt-2 text-sm text-secondary-500">
                                        <img src={`/storage/${area.hero_image}`} className="w-32 h-20 object-cover rounded-lg border border-secondary-200 mt-2" alt="" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('hero_title_ar')}</label>
                                    <input type="text" value={data.hero_title_ar} onChange={e => setData('hero_title_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('hero_title_en')}</label>
                                    <input type="text" value={data.hero_title_en} onChange={e => setData('hero_title_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('hero_description_ar')}</label>
                                    <textarea rows={3} value={data.hero_description_ar} onChange={e => setData('hero_description_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('hero_description_en')}</label>
                                    <textarea rows={3} value={data.hero_description_en} onChange={e => setData('hero_description_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content & Features */}
                    {activeTab === 'content' && (
                        <div className="space-y-8 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 border-b border-secondary-100 pb-4">{trans('about_area')}</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('about_area_text_ar')}</label>
                                    <textarea rows={6} value={data.about_ar} onChange={e => setData('about_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('about_area_text_en')}</label>
                                    <textarea rows={6} value={data.about_en} onChange={e => setData('about_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-secondary-950 mt-8 border-b border-secondary-100 pb-4 flex items-center justify-between">
                                {trans('area_features')}
                                <button type="button" onClick={addFeature} className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg text-xs font-bold hover:bg-primary-100 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    {trans('add_feature')}
                                </button>
                            </h2>
                            
                            <div className="space-y-4">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="bg-surface/50 border border-secondary-200 p-4 rounded-2xl relative">
                                        <button type="button" onClick={() => removeFeature(index)} className="absolute top-4 rtl:left-4 ltr:right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pe-10">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Title (AR) *</label>
                                                <input type="text" value={feature.title_ar} onChange={e => updateFeature(index, 'title_ar', e.target.value)} required dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Title (EN)</label>
                                                <input type="text" value={feature.title_en} onChange={e => updateFeature(index, 'title_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Desc (AR)</label>
                                                <input type="text" value={feature.description_ar} onChange={e => updateFeature(index, 'description_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Desc (EN)</label>
                                                <input type="text" value={feature.description_en} onChange={e => updateFeature(index, 'description_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Icon (SVG or Class)</label>
                                                <input type="text" value={feature.icon} onChange={e => updateFeature(index, 'icon', e.target.value)} dir="ltr" className={inputClasses} placeholder="<svg>...</svg>" />
                                            </div>
                                            <div className="flex gap-4 items-center pt-6">
                                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input type="checkbox" checked={feature.is_active} onChange={e => updateFeature(index, 'is_active', e.target.checked)} className="rounded border-secondary-300 text-[#CC0000] focus:ring-[#CC0000]" />
                                                    {trans('active')}
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    Order: <input type="number" className="w-20 px-2 py-1 border rounded" value={feature.sort_order} onChange={e => updateFeature(index, 'sort_order', parseInt(e.target.value)||0)} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.features.length === 0 && <p className="text-sm text-secondary-500 text-center py-4">{trans('no_features_added')}</p>}
                            </div>
                        </div>
                    )}

                    {/* Nearby Places */}
                    {activeTab === 'nearby' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 mb-6 border-b border-secondary-100 pb-4 flex items-center justify-between">
                                {trans('nearby_and_important_places')}
                                <button type="button" onClick={addNearby} className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg text-xs font-bold hover:bg-primary-100 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    {trans('add_place')}
                                </button>
                            </h2>

                            <div className="space-y-4">
                                {data.nearby_places.map((place, index) => (
                                    <div key={index} className="bg-surface/50 border border-secondary-200 p-4 rounded-2xl relative">
                                        <button type="button" onClick={() => removeNearby(index)} className="absolute top-4 rtl:left-4 ltr:right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pe-10">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Name (AR) *</label>
                                                <input type="text" value={place.name_ar} onChange={e => updateNearby(index, 'name_ar', e.target.value)} required dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Name (EN)</label>
                                                <input type="text" value={place.name_en} onChange={e => updateNearby(index, 'name_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Distance Value (e.g. 10)</label>
                                                <input type="text" value={place.distance} onChange={e => updateNearby(index, 'distance', e.target.value)} className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Unit (e.g. دقائق / minutes)</label>
                                                <input type="text" value={place.distance_unit} onChange={e => updateNearby(index, 'distance_unit', e.target.value)} className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Icon (SVG or Class)</label>
                                                <input type="text" value={place.icon} onChange={e => updateNearby(index, 'icon', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.nearby_places.length === 0 && <p className="text-sm text-secondary-500 text-center py-4">{trans('no_places')}</p>}
                            </div>
                        </div>
                    )}

                    {/* Location & Map Tab */}
                    {activeTab === 'location' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 mb-6 border-b border-secondary-100 pb-4">{trans('location_and_map')}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{trans('address_ar')}</label>
                                    <input type="text" value={data.address_ar} onChange={e => setData('address_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{trans('address_en')}</label>
                                    <input type="text" value={data.address_en} onChange={e => setData('address_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>
                            
                            <div>
                                <label className={labelClasses}>{isRtl ? 'رابط الموقع على خرائط جوجل (Google Maps Location URL)' : 'Google Maps Location URL'}</label>
                                <input type="text" value={data.map_url} onChange={e => setData('map_url', e.target.value)} dir="ltr" className={inputClasses} placeholder="https://www.google.com/maps/place/..." />
                                <p className="text-xs text-secondary-500 mt-1">{isRtl ? 'قم بلصق الرابط العادي لخريطة جوجل (بما في ذلك الروابط المختصرة). سيتم استخراج الإحداثيات تلقائياً عند الحفظ.' : 'Paste a normal Google Maps location link. The system will automatically extract the latitude and longitude.'}</p>
                                {errors?.map_url && <p className="text-xs text-red-500 mt-1">{errors.map_url}</p>}
                            </div>

                            {(data.latitude || data.longitude) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl mt-4">
                                    <div>
                                        <label className={labelClasses}>{trans('latitude')}</label>
                                        <input type="text" value={data.latitude} dir="ltr" className={`${inputClasses} bg-gray-100 text-gray-500 cursor-not-allowed border-transparent`} readOnly />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>{trans('longitude')}</label>
                                        <input type="text" value={data.longitude} dir="ltr" className={`${inputClasses} bg-gray-100 text-gray-500 cursor-not-allowed border-transparent`} readOnly />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FAQ */}
                    {activeTab === 'faq' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 mb-6 border-b border-secondary-100 pb-4 flex items-center justify-between">
                                {isRtl ? 'الأسئلة الشائعة' : 'FAQs'}
                                <button type="button" onClick={addFaq} className="px-4 py-2 bg-primary-50 text-primary-900 rounded-lg text-xs font-bold hover:bg-primary-100 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    {isRtl ? 'إضافة سؤال' : 'Add FAQ'}
                                </button>
                            </h2>

                            <div className="space-y-4">
                                {data.faqs.map((faq, index) => (
                                    <div key={index} className="bg-surface/50 border border-secondary-200 p-4 rounded-2xl relative">
                                        <button type="button" onClick={() => removeFaq(index)} className="absolute top-4 rtl:left-4 ltr:right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pe-10">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Question (AR) *</label>
                                                <input type="text" value={faq.question_ar} onChange={e => updateFaq(index, 'question_ar', e.target.value)} required dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Question (EN)</label>
                                                <input type="text" value={faq.question_en} onChange={e => updateFaq(index, 'question_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Answer (AR)</label>
                                                <textarea rows={3} value={faq.answer_ar} onChange={e => updateFaq(index, 'answer_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary-700 mb-1 block">Answer (EN)</label>
                                                <textarea rows={3} value={faq.answer_en} onChange={e => updateFaq(index, 'answer_en', e.target.value)} dir="ltr" className={inputClasses} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.faqs.length === 0 && <p className="text-sm text-secondary-500 text-center py-4">{trans('no_faqs')}</p>}
                            </div>
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === 'seo' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-secondary-950 mb-6 border-b border-secondary-100 pb-4">{isRtl ? 'إعدادات الـ SEO' : 'SEO Settings'}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{isRtl ? 'عنوان الـ Meta (عربي)' : 'Meta Title (AR)'}</label>
                                    <input type="text" value={data.meta_title_ar} onChange={e => setData('meta_title_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{isRtl ? 'عنوان الـ Meta (إنجليزي)' : 'Meta Title (EN)'}</label>
                                    <input type="text" value={data.meta_title_en} onChange={e => setData('meta_title_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{isRtl ? 'وصف الـ Meta (عربي)' : 'Meta Description (AR)'}</label>
                                    <textarea rows={3} value={data.meta_description_ar} onChange={e => setData('meta_description_ar', e.target.value)} dir="rtl" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{isRtl ? 'وصف الـ Meta (إنجليزي)' : 'Meta Description (EN)'}</label>
                                    <textarea rows={3} value={data.meta_description_en} onChange={e => setData('meta_description_en', e.target.value)} dir="ltr" className={inputClasses} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>{isRtl ? 'الكلمات المفتاحية (عربي)' : 'Meta Keywords (AR)'}</label>
                                    <input type="text" value={data.meta_keywords_ar} onChange={e => setData('meta_keywords_ar', e.target.value)} dir="rtl" placeholder="عقارات, شقق, مشاريع" className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>{isRtl ? 'الكلمات المفتاحية (إنجليزي)' : 'Meta Keywords (EN)'}</label>
                                    <input type="text" value={data.meta_keywords_en} onChange={e => setData('meta_keywords_en', e.target.value)} dir="ltr" placeholder="real estate, projects" className={inputClasses} />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </form>
    )
}
