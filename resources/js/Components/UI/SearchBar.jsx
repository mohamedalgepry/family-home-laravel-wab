import { Select } from '../../Components/UI'
import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useEffect, useRef, useState } from 'react'

const EMPTY_FILTERS = {
    area_id: '',
    type_id: '',
    transaction: '',
    price_min: '',
    price_max: '',
    size_min: '',
    size_max: '',
    search: '',
    payment_method: '',
    finishing_type_id: '',
    features: [],
}

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
    onSearch,
}) {
    const areas = rawAreas?.length ? rawAreas : initialAreas
    const unitTypes = rawUnitTypes?.length ? rawUnitTypes : initialUnitTypes
    const features = rawFeatures?.length ? rawFeatures : initialFeatures
    const finishingTypes = rawFinishingTypes?.length ? rawFinishingTypes : initialFinishingTypes
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [local, setLocal] = useState({ ...EMPTY_FILTERS, ...filters, features: filters.features || [] })
    const [isSearching, setIsSearching] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [mobileShowAdvanced, setMobileShowAdvanced] = useState(false)
    const searchRef = useRef(null)

    useEffect(() => {
        setLocal(prev => ({
            ...prev,
            ...Object.fromEntries(Object.keys(EMPTY_FILTERS).map(key => [key, filters[key] ?? EMPTY_FILTERS[key]])),
            features: filters.features || [],
        }))
    }, [filters.area_id, filters.type_id, filters.transaction, filters.price_min, filters.price_max, filters.size_min, filters.size_max, filters.search, filters.payment_method, filters.finishing_type_id, filters.features])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowAdvanced(false)
                setMobileShowAdvanced(false)
                searchRef.current?.blur()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const update = (key, value) => setLocal(prev => ({ ...prev, [key]: value }))

    const submit = (event) => {
        event?.preventDefault()
        setIsSearching(true)
        const params = {}
        Object.entries(local).forEach(([key, value]) => {
            if (key === 'features') {
                if (Array.isArray(value) && value.length) params[key] = value
                return
            }
            if (value !== '' && value !== null && value !== undefined) params[key] = value
        })

        if (onSearch) {
            onSearch(params)
            setTimeout(() => setIsSearching(false), 300)
            return
        }

        router.get(`/${locale}/units`, params, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        })
    }

    const reset = () => {
        setLocal({ ...EMPTY_FILTERS })
        if (onSearch) {
            onSearch({})
        } else {
            router.get(`/${locale}/units`, {}, { preserveState: true, replace: true })
        }
    }

    const toggleFeature = (id) => {
        const value = String(id)
        setLocal(prev => {
            const current = Array.isArray(prev.features) ? prev.features.map(String) : []
            return {
                ...prev,
                features: current.includes(value) ? current.filter(item => item !== value) : [...current, value],
            }
        })
    }

    const areaName = (area) => locale === 'ar' ? (area.name_ar || area.name_en) : (area.name_en || area.name_ar)
    const typeName = (type) => locale === 'ar' ? (type.name_ar || type.name_en) : (type.name_en || type.name_ar)

    const searchPlaceholder = locale === 'ar'
        ? 'مثال: شقق للبيع في زايد أو Cavali أو محلات للبيع'
        : 'Try: apartments for sale in Zayed, Cavali, or shops for sale'

    return (
        <div className="w-full max-w-5xl mx-auto relative z-[60]" dir={isRtl ? 'rtl' : 'ltr'}>
            <form onSubmit={submit} className="hidden md:block bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/60 relative z-20">
                <div className="p-2.5 flex items-center gap-1.5">
                    <div className="flex-[1.8] min-w-0 px-5 py-3 rounded-3xl hover:bg-surface/60 transition-colors group">
                        <label htmlFor="smart-search-input" className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900">
                            {locale === 'ar' ? 'بحث ذكي' : 'Smart Search'}
                        </label>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                ref={searchRef}
                                id="smart-search-input"
                                type="search"
                                value={local.search || ''}
                                onChange={event => update('search', event.target.value)}
                                placeholder={searchPlaceholder}
                                autoComplete="off"
                                enterKeyHint="search"
                                className="w-full bg-transparent border-0 p-0 text-sm text-secondary-900 placeholder-secondary-400 outline-none focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="h-12 w-px bg-secondary-100 shrink-0" />

                    <div className="w-[150px] px-4 py-3">
                        <label htmlFor="d-transaction-filter" className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">{trans('transaction')}</label>
                        <Select variant="ghost" id="d-transaction-filter" value={local.transaction} onChange={e => update('transaction', e.target.value)} className="w-full text-secondary-800 outline-none cursor-pointer p-0">
                            <option value="">{trans('search_bar.all')}</option>
                            <option value="sale">{trans('sale')}</option>
                            <option value="rent">{trans('rent')}</option>
                            <option value="new_project">{locale === 'ar' ? 'مشروع جديد' : 'New Project'}</option>
                            <option value="commercial">{locale === 'ar' ? 'تجاري' : 'Commercial'}</option>
                            <option value="residential">{locale === 'ar' ? 'سكني' : 'Residential'}</option>
                        </Select>
                    </div>

                    <div className="w-[150px] px-4 py-3">
                        <label htmlFor="d-area-filter" className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">{trans('area')}</label>
                        <Select variant="ghost" id="d-area-filter" value={local.area_id} onChange={e => update('area_id', e.target.value)} className="w-full text-secondary-800 outline-none cursor-pointer p-0">
                            <option value="">{locale === 'ar' ? 'كل المناطق' : 'All Areas'}</option>
                            {areas?.map(area => <option key={`d-a-${area.id}`} value={area.id}>{areaName(area)}</option>)}
                        </Select>
                    </div>

                    <div className="w-[145px] px-4 py-3">
                        <label htmlFor="d-type-filter" className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">{trans('type')}</label>
                        <Select variant="ghost" id="d-type-filter" value={local.type_id} onChange={e => update('type_id', e.target.value)} className="w-full text-secondary-800 outline-none cursor-pointer p-0">
                            <option value="">{locale === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
                            {unitTypes?.map(type => <option key={`d-t-${type.id}`} value={type.id}>{typeName(type)}</option>)}
                        </Select>
                    </div>

                    <div className="w-[145px] px-4 py-3">
                        <label htmlFor="d-budget-input" className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">{locale === 'ar' ? 'الميزانية' : 'Budget'}</label>
                        <input id="d-budget-input" type="number" min="0" value={local.price_max} onChange={e => update('price_max', e.target.value)} placeholder={locale === 'ar' ? 'الحد الأقصى' : 'Max'} className="w-full bg-transparent border-0 p-0 text-sm text-secondary-800 outline-none focus:ring-0" />
                    </div>

                    <button type="button" onClick={() => setShowAdvanced(prev => !prev)} aria-label={locale === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'} className={`p-3 rounded-full shrink-0 text-secondary-600 hover:text-primary-900 hover:bg-surface transition-colors ${showAdvanced ? 'bg-surface text-primary-900' : ''}`}>
                        <svg className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                        </svg>
                    </button>

                    <button type="submit" disabled={isSearching} aria-label={trans('search')} className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-950 active:scale-95 transition-all disabled:opacity-70 shadow-md shrink-0">
                        {isSearching ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
                    </button>
                </div>

                {showAdvanced && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-secondary-200 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div><label htmlFor="d-price-min" className="field-label">{locale === 'ar' ? 'سعر يبدأ من' : 'Min Price'}</label><input id="d-price-min" type="number" min="0" value={local.price_min} onChange={e => update('price_min', e.target.value)} className="field-input" /></div>
                            <div><label htmlFor="d-price-max" className="field-label">{locale === 'ar' ? 'سعر يصل إلى' : 'Max Price'}</label><input id="d-price-max" type="number" min="0" value={local.price_max} onChange={e => update('price_max', e.target.value)} className="field-input" /></div>
                            <div><label htmlFor="d-size-min" className="field-label">{locale === 'ar' ? 'مساحة من' : 'Min Size'}</label><input id="d-size-min" type="number" min="0" value={local.size_min} onChange={e => update('size_min', e.target.value)} className="field-input" /></div>
                            <div><label htmlFor="d-size-max" className="field-label">{locale === 'ar' ? 'مساحة إلى' : 'Max Size'}</label><input id="d-size-max" type="number" min="0" value={local.size_max} onChange={e => update('size_max', e.target.value)} className="field-input" /></div>
                            <div className="sm:col-span-2"><label htmlFor="d-adv-search" className="field-label">{locale === 'ar' ? 'النص البحثي' : 'Search text'}</label><input id="d-adv-search" type="text" value={local.search} onChange={e => update('search', e.target.value)} placeholder={searchPlaceholder} className="field-input" /></div>
                            <div><label htmlFor="d-payment-method" className="field-label">{trans('payment_method') || 'Payment Method'}</label><Select id="d-payment-method" value={local.payment_method} onChange={e => update('payment_method', e.target.value)} className="field-input"><option value="">{trans('all') || 'All'}</option><option value="cash">{trans('cash') || 'Cash'}</option><option value="installment">{trans('installment') || 'Installment'}</option><option value="both">{trans('both') || 'Cash & Installment'}</option></Select></div>
                            <div><label htmlFor="d-finishing-type" className="field-label">{trans('finishing_type') || 'Finishing Type'}</label><Select id="d-finishing-type" value={local.finishing_type_id} onChange={e => update('finishing_type_id', e.target.value)} className="field-input"><option value="">{trans('all') || 'All'}</option>{finishingTypes?.map(item => <option key={`d-f-${item.id}`} value={item.id}>{typeName(item)}</option>)}</Select></div>
                        </div>
                        {features?.length > 0 && <div className="mt-5 pt-4 border-t border-secondary-100"><label className="field-label">{trans('features') || 'Features'}</label><div className="flex flex-wrap gap-3 mt-2">{features.map(feature => { const checked = local.features?.map(String).includes(String(feature.id)); return <label key={`d-feat-${feature.id}`} className="flex items-center gap-2 text-sm text-secondary-700"><input type="checkbox" checked={checked} onChange={() => toggleFeature(feature.id)} className="w-4 h-4 rounded text-primary-900 focus:ring-primary-900" />{typeName(feature)}</label> })}</div></div>}
                        <div className="mt-5 flex justify-end"><button type="button" onClick={reset} className="px-5 py-2 rounded-xl text-sm font-bold text-secondary-700 bg-surface hover:bg-secondary-100">{locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}</button></div>
                    </div>
                )}
            </form>

            <div className="md:hidden">
                <form onSubmit={submit} className="bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-xl border border-white/60 p-2 flex items-center gap-2 relative z-20">
                    <div className="flex-1 flex items-center gap-3 px-3 py-2 min-w-0">
                        <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        <input ref={searchRef} type="search" value={local.search || ''} onChange={e => update('search', e.target.value)} placeholder={locale === 'ar' ? 'شقق للبيع في زايد...' : 'Apartments for sale in Zayed...'} autoComplete="off" className="w-full min-w-0 bg-transparent border-0 p-0 text-sm font-semibold text-secondary-900 placeholder-secondary-400 outline-none focus:ring-0" />
                    </div>
                    <button type="button" onClick={() => setShowAdvanced(true)} aria-label={locale === 'ar' ? 'جميع الفلاتر' : 'All Filters'} className="w-11 h-11 rounded-full bg-surface text-primary-900 flex items-center justify-center shrink-0 border border-secondary-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                    </button>
                </form>

                {showAdvanced && <div className="fixed inset-0 z-[100] flex flex-col justify-end overflow-hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-secondary-950/40 backdrop-blur-sm" onClick={() => setShowAdvanced(false)} />
                    <div className="relative bg-white rounded-t-[2rem] w-full h-[92dvh] flex flex-col shadow-2xl animate-slideUp">
                        <div className="p-4 border-b border-secondary-100 flex items-center justify-between"><h3 className="text-lg font-black text-secondary-950">{locale === 'ar' ? 'البحث والتصفية' : 'Search & Filters'}</h3><button type="button" onClick={() => setShowAdvanced(false)} className="w-11 h-11 rounded-full bg-surface flex items-center justify-center" aria-label={trans('close') || 'Close'}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12-12" /></svg></button></div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            <div><label htmlFor="m-search" className="field-label">{locale === 'ar' ? 'بحث ذكي' : 'Smart Search'}</label><input id="m-search" type="search" value={local.search} onChange={e => update('search', e.target.value)} placeholder={searchPlaceholder} autoComplete="off" className="field-input h-12" /></div>
                            <div><label htmlFor="m-area" className="field-label">{trans('area')}</label><Select id="m-area" value={local.area_id} onChange={e => update('area_id', e.target.value)} className="field-input h-12"><option value="">{locale === 'ar' ? 'كل المناطق' : 'All Areas'}</option>{areas?.map(area => <option key={`m-a-${area.id}`} value={area.id}>{areaName(area)}</option>)}</Select></div>
                            <div className="grid grid-cols-2 gap-3"><div><label htmlFor="m-type" className="field-label">{trans('type')}</label><Select id="m-type" value={local.type_id} onChange={e => update('type_id', e.target.value)} className="field-input h-12"><option value="">{locale === 'ar' ? 'كل الأنواع' : 'All Types'}</option>{unitTypes?.map(type => <option key={`m-t-${type.id}`} value={type.id}>{typeName(type)}</option>)}</Select></div><div><label htmlFor="m-transaction" className="field-label">{trans('transaction')}</label><Select id="m-transaction" value={local.transaction} onChange={e => update('transaction', e.target.value)} className="field-input h-12"><option value="">{locale === 'ar' ? 'الكل' : 'All'}</option><option value="sale">{trans('sale')}</option><option value="rent">{trans('rent')}</option><option value="new_project">{locale === 'ar' ? 'مشروع جديد' : 'New Project'}</option></Select></div></div>
                            <div><label htmlFor="m-price-max" className="field-label">{locale === 'ar' ? 'الميزانية القصوى' : 'Max Budget'}</label><input id="m-price-max" type="number" min="0" value={local.price_max} onChange={e => update('price_max', e.target.value)} className="field-input h-12" /></div>
                            <button type="button" onClick={() => setMobileShowAdvanced(prev => !prev)} className="w-full py-3 px-4 rounded-xl bg-surface text-sm font-bold text-secondary-900 flex items-center justify-between"><span>{locale === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'}</span><span className={mobileShowAdvanced ? 'rotate-180' : ''}>⌄</span></button>
                            {mobileShowAdvanced && <div className="space-y-4 rounded-2xl border border-secondary-200 p-4">
                                <div><label htmlFor="m-price-min" className="field-label">{locale === 'ar' ? 'الحد الأدنى للسعر' : 'Min Price'}</label><input id="m-price-min" type="number" min="0" value={local.price_min} onChange={e => update('price_min', e.target.value)} className="field-input h-12" /></div>
                                <div><label className="field-label">{locale === 'ar' ? 'المساحة' : 'Size'}</label><div className="grid grid-cols-2 gap-3"><input type="number" min="0" value={local.size_min} onChange={e => update('size_min', e.target.value)} placeholder={locale === 'ar' ? 'من' : 'Min'} className="field-input h-12" /><input type="number" min="0" value={local.size_max} onChange={e => update('size_max', e.target.value)} placeholder={locale === 'ar' ? 'إلى' : 'Max'} className="field-input h-12" /></div></div>
                                <div className="grid grid-cols-2 gap-3"><div><label htmlFor="m-payment" className="field-label">{trans('payment_method') || 'Payment'}</label><Select id="m-payment" value={local.payment_method} onChange={e => update('payment_method', e.target.value)} className="field-input h-12"><option value="">{trans('all') || 'All'}</option><option value="cash">{trans('cash') || 'Cash'}</option><option value="installment">{trans('installment') || 'Installment'}</option><option value="both">{trans('both') || 'Both'}</option></Select></div><div><label htmlFor="m-finish" className="field-label">{trans('finishing_type') || 'Finishing'}</label><Select id="m-finish" value={local.finishing_type_id} onChange={e => update('finishing_type_id', e.target.value)} className="field-input h-12"><option value="">{trans('all') || 'All'}</option>{finishingTypes?.map(item => <option key={`m-f-${item.id}`} value={item.id}>{typeName(item)}</option>)}</Select></div></div>
                                {features?.length > 0 && <div><label className="field-label">{trans('features') || 'Features'}</label><div className="flex flex-wrap gap-2">{features.map(feature => { const checked = local.features?.map(String).includes(String(feature.id)); return <button key={`m-feat-${feature.id}`} type="button" onClick={() => toggleFeature(feature.id)} className={`px-3 py-2 rounded-full text-sm border ${checked ? 'bg-primary-900 border-primary-900 text-white' : 'bg-white border-secondary-200 text-secondary-700'}`}>{typeName(feature)}</button> })}</div></div>}
                            </div>}
                        </div>
                        <div className="p-4 border-t border-secondary-100 flex gap-3"><button type="button" onClick={reset} className="w-1/3 h-12 rounded-xl border border-secondary-200 bg-surface font-bold">{locale === 'ar' ? 'إعادة ضبط' : 'Reset'}</button><button type="button" onClick={event => { setShowAdvanced(false); submit(event) }} className="flex-1 h-12 rounded-xl bg-primary-900 text-white font-bold">{locale === 'ar' ? 'إظهار النتائج' : 'Show Results'}</button></div>
                    </div>
                </div>}
            </div>

            <style>{`.field-label{display:block;font-size:11px;font-weight:700;color:rgb(15 23 42);margin-bottom:.375rem}.field-input{width:100%;padding:.65rem .9rem;border:1px solid rgb(226 232 240);background:rgb(248 250 252);border-radius:.75rem;font-size:.875rem;outline:none}.field-input:focus{box-shadow:0 0 0 2px rgb(15 23 42 / .12)}`}</style>
        </div>
    )
}
