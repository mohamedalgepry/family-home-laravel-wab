import { Select } from '../../Components/UI'
import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useState, useEffect } from 'react'

export default function SearchBar({ 
    areas: rawAreas = [], 
    unitTypes: rawUnitTypes = [], 
    features: rawFeatures = [], 
    finishingTypes: rawFinishingTypes = [], 
    initialAreas = [],
    initialUnitTypes = [],
    initialFeatures = [],
    initialFinishingTypes = [],
    filters = {}, 
    onSearch 
}) {
    const areas = rawAreas && rawAreas.length > 0 ? rawAreas : (initialAreas || [])
    const unitTypes = rawUnitTypes && rawUnitTypes.length > 0 ? rawUnitTypes : (initialUnitTypes || [])
    const features = rawFeatures && rawFeatures.length > 0 ? rawFeatures : (initialFeatures || [])
    const finishingTypes = rawFinishingTypes && rawFinishingTypes.length > 0 ? rawFinishingTypes : (initialFinishingTypes || [])

    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [local, setLocal] = useState({
        area_id: filters.area_id || '',
        type_id: filters.type_id || '',
        transaction: filters.transaction || '',
        price_min: filters.price_min || '',
        price_max: filters.price_max || '',
        size_min: filters.size_min || '',
        size_max: filters.size_max || '',
        search: filters.search || '',
        payment_method: filters.payment_method || '',
        finishing_type_id: filters.finishing_type_id || '',
        features: filters.features || [],
    })

    const [isSearching, setIsSearching] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)

    useEffect(() => {
        if (!showAdvanced) return
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setShowAdvanced(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [showAdvanced])

    function update(key, value) {
        setLocal(prev => ({ ...prev, [key]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setIsSearching(true)
        const params = {}
        for (const [k, v] of Object.entries(local)) {
            if (k === 'features' && Array.isArray(v) && v.length > 0) {
                params[k] = v;
            } else if (v !== '' && v !== null && v !== undefined && k !== 'features') {
                params[k] = v
            }
        }
        if (onSearch) {
            onSearch(params)
            setTimeout(() => setIsSearching(false), 300)
        } else {
            router.get(`/${locale}/units`, params, {
                preserveState: true,
                onFinish: () => setIsSearching(false)
            })
        }
    }

    function handleReset() {
        const cleared = { area_id: '', type_id: '', transaction: '', price_min: '', price_max: '', size_min: '', size_max: '', search: '', payment_method: '', finishing_type_id: '', features: [] }
        setLocal(cleared)
        if (onSearch) {
            onSearch({})
        } else {
            router.get(`/${locale}/units`, {}, { preserveState: true })
        }
    }

    function toggleFeature(id) {
        if (id == null) return;
        const idStr = String(id);
        setLocal(prev => {
            const currentFeatures = Array.isArray(prev.features) ? prev.features : [];
            const exists = currentFeatures.some(f => f?.toString() === idStr);
            if (exists) {
                return { ...prev, features: currentFeatures.filter(f => f?.toString() !== idStr) };
            } else {
                return { ...prev, features: [...currentFeatures, idStr] };
            }
        });
    }

    return (
        <div className="w-full max-w-5xl mx-auto relative z-[60]">
            {/* ---------------- Desktop Search Bar (Hidden on Mobile) ---------------- */}
            <form onSubmit={handleSubmit} dir={isRtl ? 'rtl' : 'ltr'} className="hidden md:block bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/60 transition-all duration-300 w-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative z-20">
                <div className="flex flex-row items-center divide-x rtl:divide-x-reverse divide-secondary-100 p-2.5">
                    {/* Keyword */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-text group rounded-s-3xl">
                        <label htmlFor="d-search-input" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('search')}
                        </label>
                        <input
                            id="d-search-input"
                            type="text"
                            value={local.search}
                            onChange={e => update('search', e.target.value)}
                            placeholder={locale === 'ar' ? 'ابحث بالاسم...' : 'Search by name...'}
                            className="w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none p-0"
                        />
                    </div>

                    {/* Transaction Type */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group">
                        <label htmlFor="d-transaction-filter" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('transaction')}
                        </label>
                        <Select variant="ghost"
                            id="d-transaction-filter"
                            value={local.transaction}
                            onChange={e => update('transaction', e.target.value)}
                            className="w-full text-secondary-800 outline-none cursor-pointer p-0"
                        >
                            <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                            <option value="sale">{trans('sale')}</option>
                            <option value="rent">{trans('rent')}</option>
                            <option value="new_project">{locale === 'ar' ? 'مشروع جديد' : 'New Project'}</option>
                            <option value="commercial">{locale === 'ar' ? 'تجاري' : 'Commercial'}</option>
                            <option value="residential">{locale === 'ar' ? 'سكني' : 'Residential'}</option>
                        </Select>
                    </div>

                    {/* Area */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group">
                        <label htmlFor="d-area-filter" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('area')}
                        </label>
                        <Select variant="ghost"
                            id="d-area-filter"
                            value={local.area_id}
                            onChange={e => update('area_id', e.target.value)}
                            className="w-full text-secondary-800 outline-none cursor-pointer p-0"
                        >
                            <option value="">{locale === 'ar' ? 'كل المناطق' : 'All Areas'}</option>
                            {areas?.map(area => (
                                <option key={`d-a-${area.id}`} value={area.id}>
                                    {locale === 'ar' ? area.name_ar : area.name_en}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Unit Type */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group">
                        <label htmlFor="d-type-filter" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('type')}
                        </label>
                        <Select variant="ghost"
                            id="d-type-filter"
                            value={local.type_id}
                            onChange={e => update('type_id', e.target.value)}
                            className="w-full text-secondary-800 outline-none cursor-pointer p-0"
                        >
                            <option value="">{locale === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
                            {unitTypes?.map(ut => (
                                <option key={`d-ut-${ut.id}`} value={ut.id}>
                                    {locale === 'ar' ? ut.name_ar : ut.name_en}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-auto p-2 flex items-center justify-center gap-2 shrink-0 ps-4">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`p-3 rounded-full text-secondary-600 hover:text-primary-900 hover:bg-surface/80 transition-colors ${showAdvanced ? 'bg-surface text-primary-900' : ''}`}
                            aria-label={locale === 'ar' ? 'تصفية متقدمة' : 'Advanced Filters'}
                        >
                            <svg className={`w-5 h-5 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                            </svg>
                        </button>

                        <button
                            type="submit"
                            disabled={isSearching}
                            className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-950 active:scale-95 transition-all duration-200 disabled:opacity-80 shadow-md"
                            aria-label={trans('search')}
                        >
                            {isSearching ? (
                                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Desktop Advanced Filters */}
                <div
                    className={`transition-all duration-300 ease-in-out origin-top rounded-2xl absolute left-0 right-0 top-full mt-2 z-50 bg-white shadow-2xl border border-secondary-200 ${showAdvanced ? 'opacity-100 overflow-visible scale-y-100' : 'opacity-0 overflow-hidden pointer-events-none scale-y-95 max-h-0'}`}
                    style={{
                        maxHeight: showAdvanced ? '1500px' : '0px',
                    }}
                >
                    <div className="px-6 py-6 border-t border-secondary-100 flex flex-col gap-5">
                        {/* Price & Size row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="d-price-min" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1.5">{locale === 'ar' ? 'سعر يبدأ من' : 'Min Price'}</label>
                                <input id="d-price-min" type="number" min="0" value={local.price_min} onChange={e => update('price_min', e.target.value)} placeholder="0" className="w-full px-4 h-11 border border-secondary-200 bg-surface rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none" />
                            </div>
                            <div>
                                <label htmlFor="d-price-max" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1.5">{locale === 'ar' ? 'سعر يصل إلى' : 'Max Price'}</label>
                                <input id="d-price-max" type="number" min="0" value={local.price_max} onChange={e => update('price_max', e.target.value)} placeholder={locale === 'ar' ? 'لا يوجد حد' : 'No limit'} className="w-full px-4 h-11 border border-secondary-200 bg-surface rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none" />
                            </div>
                            <div>
                                <label htmlFor="d-size-min" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1.5">{locale === 'ar' ? 'مساحة تبدأ من' : 'Min Size'}</label>
                                <input id="d-size-min" type="number" min="0" value={local.size_min} onChange={e => update('size_min', e.target.value)} placeholder="0" className="w-full px-4 h-11 border border-secondary-200 bg-surface rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none" />
                            </div>
                            <div>
                                <label htmlFor="d-size-max" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1.5">{locale === 'ar' ? 'مساحة تصل إلى' : 'Max Size'}</label>
                                <input id="d-size-max" type="number" min="0" value={local.size_max} onChange={e => update('size_max', e.target.value)} placeholder={locale === 'ar' ? 'لا يوجد حد' : 'No limit'} className="w-full px-4 h-11 border border-secondary-200 bg-surface rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none" />
                            </div>
                        </div>

                        {/* More Selects */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="d-payment-method" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1.5">{trans('payment_method') || 'Payment Method'}</label>
                                <Select variant="ghost" id="d-payment-method" value={local.payment_method} onChange={e => update('payment_method', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-11">
                                    <option value="">{trans('all') || 'All'}</option>
                                    <option value="cash">{trans('cash') || 'Cash'}</option>
                                    <option value="installment">{trans('installment') || 'Installment'}</option>
                                    <option value="both">{trans('both') || 'Cash & Installment'}</option>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="d-finishing-type" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1.5">{trans('finishing_type') || 'Finishing Type'}</label>
                                <Select variant="ghost" id="d-finishing-type" value={local.finishing_type_id} onChange={e => update('finishing_type_id', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-11">
                                    <option value="">{trans('all') || 'All'}</option>
                                    {finishingTypes?.map(f => <option key={`d-f-${f.id}`} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>)}
                                </Select>
                            </div>
                        </div>

                        {/* Features */}
                        {features?.length > 0 && (
                            <div className="w-full pt-4 border-t border-secondary-100/50">
                                <label className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-3">{trans('features') || 'Features'}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {features.map(feature => {
                                        const isChecked = Array.isArray(local.features) && (local.features.includes(String(feature.id)) || local.features.includes(feature.id));
                                        return (
                                            <label key={`d-feat-${feature.id}`} className="flex items-center gap-2.5 group cursor-pointer">
                                                <input type="checkbox" checked={isChecked} onChange={() => toggleFeature(feature.id)} className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer transition-colors" />
                                                <span className="text-sm font-medium text-secondary-700 group-hover:text-primary-900 transition-colors select-none">
                                                    {locale === 'ar' ? feature.name_ar : feature.name_en}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="w-full flex justify-end pt-4 border-t border-secondary-100/50">
                            <button type="button" onClick={handleReset} className="px-6 h-10 text-secondary-700 bg-transparent hover:bg-secondary-100 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                {locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* ---------------- Mobile Search Bar (Hidden on Desktop) ---------------- */}
            <div className="md:hidden">
                <form onSubmit={handleSubmit} dir={isRtl ? 'rtl' : 'ltr'} className="bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-xl border border-white/60 p-2 flex items-center justify-between gap-2 relative z-20">
                    <button type="button" onClick={() => setShowAdvanced(true)} className="flex-1 flex items-center gap-3 px-3 py-2 text-start bg-transparent outline-none">
                        <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <div className="flex-1 overflow-hidden whitespace-nowrap">
                            <p className="text-sm font-bold text-secondary-900 truncate">
                                {local.search || (locale === 'ar' ? 'بحث...' : 'Search...')}
                            </p>
                            <p className="text-xs text-secondary-500 font-medium truncate">
                                {[
                                    local.transaction && (local.transaction === 'sale' ? trans('sale') : local.transaction === 'rent' ? trans('rent') : trans(local.transaction)),
                                    local.area_id && areas?.find(a => a.id == local.area_id)?.[locale === 'ar' ? 'name_ar' : 'name_en'],
                                    local.type_id && unitTypes?.find(u => u.id == local.type_id)?.[locale === 'ar' ? 'name_ar' : 'name_en'],
                                ].filter(Boolean).join(' • ') || (locale === 'ar' ? 'جميع الفلاتر' : 'All Filters')}
                            </p>
                        </div>
                    </button>
                    <button type="button" onClick={() => setShowAdvanced(true)} className="w-11 h-11 rounded-full bg-surface text-primary-900 flex items-center justify-center shrink-0 border border-secondary-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                    </button>
                </form>

                {/* Mobile Bottom Sheet Modal */}
                {showAdvanced && (
                    <div dir={isRtl ? 'rtl' : 'ltr'} className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-auto">
                        <div className="absolute inset-0 bg-secondary-950/40 backdrop-blur-xs sm:backdrop-blur-sm transition-opacity" onClick={() => setShowAdvanced(false)}></div>
                        <div className="relative bg-white rounded-t-[2rem] w-full max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">

                            {/* Drag Handle & Header */}
                            <div className="flex-none p-5 pb-3 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white rounded-t-[2rem] z-10">
                                <h3 className="text-lg font-black text-secondary-950 tracking-tight">{locale === 'ar' ? 'الفلاتر' : 'Filters'}</h3>
                                <button 
                                    type="button" 
                                    onClick={() => setShowAdvanced(false)} 
                                    aria-label={trans('close') || 'Close'}
                                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface text-secondary-600 flex items-center justify-center hover:bg-secondary-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                {/* Absolute center pill indicator */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-secondary-200"></div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-5 pb-24 flex flex-col gap-6 hide-scrollbar">
                                {/* Keyword */}
                                <div>
                                    <label htmlFor="m-search" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('search')}</label>
                                    <input id="m-search" type="text" value={local.search} onChange={e => update('search', e.target.value)} placeholder={locale === 'ar' ? 'ابحث بالاسم...' : 'Search...'} className="w-full px-4 h-12 border border-secondary-200 bg-surface rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none" />
                                </div>

                                {/* Transaction & Type */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="m-transaction" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('transaction')}</label>
                                        <Select id="m-transaction" value={local.transaction} onChange={e => update('transaction', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-12">
                                            <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                                            <option value="sale">{trans('sale')}</option>
                                            <option value="rent">{trans('rent')}</option>
                                            <option value="new_project">{locale === 'ar' ? 'مشروع جديد' : 'New Project'}</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <label htmlFor="m-type" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('type')}</label>
                                        <Select id="m-type" value={local.type_id} onChange={e => update('type_id', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-12">
                                            <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                                            {unitTypes?.map(ut => <option key={`m-ut-${ut.id}`} value={ut.id}>{locale === 'ar' ? ut.name_ar : ut.name_en}</option>)}
                                        </Select>
                                    </div>
                                </div>

                                {/* Area */}
                                <div>
                                    <label htmlFor="m-area" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('area')}</label>
                                    <Select id="m-area" value={local.area_id} onChange={e => update('area_id', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-12">
                                        <option value="">{locale === 'ar' ? 'كل المناطق' : 'All Areas'}</option>
                                        {areas?.map(area => <option key={`m-a-${area.id}`} value={area.id}>{locale === 'ar' ? area.name_ar : area.name_en}</option>)}
                                    </Select>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('price') || 'Price'}</label>
                                    <div className="flex items-center gap-3">
                                        <input type="number" min="0" value={local.price_min} onChange={e => update('price_min', e.target.value)} placeholder={locale === 'ar' ? 'من' : 'Min'} className="w-full px-4 h-12 border border-secondary-200 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-900" />
                                        <span className="text-secondary-400 font-medium">-</span>
                                        <input type="number" min="0" value={local.price_max} onChange={e => update('price_max', e.target.value)} placeholder={locale === 'ar' ? 'إلى' : 'Max'} className="w-full px-4 h-12 border border-secondary-200 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-900" />
                                    </div>
                                </div>

                                {/* Size */}
                                <div>
                                    <label className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{locale === 'ar' ? 'المساحة' : 'Size'}</label>
                                    <div className="flex items-center gap-3">
                                        <input type="number" min="0" value={local.size_min} onChange={e => update('size_min', e.target.value)} placeholder={locale === 'ar' ? 'من' : 'Min'} className="w-full px-4 h-12 border border-secondary-200 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-900" />
                                        <span className="text-secondary-400 font-medium">-</span>
                                        <input type="number" min="0" value={local.size_max} onChange={e => update('size_max', e.target.value)} placeholder={locale === 'ar' ? 'إلى' : 'Max'} className="w-full px-4 h-12 border border-secondary-200 bg-surface rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-900" />
                                    </div>
                                </div>

                                {/* Payment & Finishing */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="m-payment" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('payment_method') || 'Payment Method'}</label>
                                        <Select id="m-payment" value={local.payment_method} onChange={e => update('payment_method', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-12">
                                            <option value="">{trans('all') || 'All'}</option>
                                            <option value="cash">{trans('cash')}</option>
                                            <option value="installment">{trans('installment')}</option>
                                            <option value="both">{trans('both')}</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <label htmlFor="m-finish" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">{trans('finishing_type') || 'Finishing Type'}</label>
                                        <Select id="m-finish" value={local.finishing_type_id} onChange={e => update('finishing_type_id', e.target.value)} className="w-full bg-surface border border-secondary-200 rounded-xl h-12">
                                            <option value="">{trans('all') || 'All'}</option>
                                            {finishingTypes?.map(f => <option key={`m-f-${f.id}`} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>)}
                                        </Select>
                                    </div>
                                </div>

                                {/* Features */}
                                {features?.length > 0 && (
                                    <div className="pt-2">
                                        <label className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-3">{trans('features') || 'Features'}</label>
                                        <div className="flex flex-wrap gap-2">
                                            {features.map(feature => {
                                                const isChecked = Array.isArray(local.features) && (local.features.includes(String(feature.id)) || local.features.includes(feature.id));
                                                return (
                                                    <button
                                                        key={`m-feat-${feature.id}`}
                                                        type="button"
                                                        onClick={() => toggleFeature(feature.id)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isChecked
                                                                ? 'bg-primary-900 border-primary-900 text-white'
                                                                : 'bg-white border-secondary-200 text-secondary-700 hover:border-primary-900 hover:text-primary-900'
                                                            }`}
                                                    >
                                                        {locale === 'ar' ? feature.name_ar : feature.name_en}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Actions Footer */}
                            <div className="flex-none p-4 bg-white border-t border-secondary-100 flex items-center gap-3 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                                <button type="button" onClick={handleReset} className="w-1/3 h-12 rounded-xl border border-secondary-200 text-secondary-700 font-bold text-sm bg-surface hover:bg-secondary-200 active:scale-95 transition-all">
                                    {locale === 'ar' ? 'إعادة ضبط' : 'Reset'}
                                </button>
                                <button type="button" onClick={(e) => { setShowAdvanced(false); handleSubmit(e); }} className="flex-1 h-12 rounded-xl bg-primary-900 text-white font-bold text-sm shadow-md hover:bg-primary-950 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                    {locale === 'ar' ? 'إظهار النتائج' : 'Show Results'}
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
