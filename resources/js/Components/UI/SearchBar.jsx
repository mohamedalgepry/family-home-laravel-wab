import { Select } from '../../Components/UI'
import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useState } from 'react'

export default function SearchBar({ areas = [], unitTypes = [], features = [], finishingTypes = [], filters = {}, onSearch }) {
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
            <form onSubmit={handleSubmit} dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full">
                
                {/* Main Unified Row */}
                <div className="flex flex-col md:flex-row items-center md:divide-x divide-y md:divide-y-0 rtl:divide-x-reverse divide-secondary-100 p-2 md:p-2.5">
                    
                    {/* Keyword */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-text group rounded-2xl md:rounded-s-3xl md:rounded-e-none">
                        <label className="block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('search')}
                        </label>
                        <input
                            type="text"
                            value={local.search}
                            onChange={e => update('search', e.target.value)}
                            placeholder={locale === 'ar' ? 'ابحث بالاسم...' : 'Search by name...'}
                            className="w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none"
                        />
                    </div>

                    {/* Transaction Type */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none">
                        <label className="block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('transaction')}
                        </label>
                        <Select
                            value={local.transaction}
                            onChange={e => update('transaction', e.target.value)}
                            className="w-full text-secondary-800 outline-none cursor-pointer"
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
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none">
                        <label className="block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('area')}
                        </label>
                        <Select
                            value={local.area_id}
                            onChange={e => update('area_id', e.target.value)}
                            className="w-full text-secondary-800 outline-none cursor-pointer"
                        >
                            <option value="">{locale === 'ar' ? 'كل المناطق' : 'All Areas'}</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>
                                    {locale === 'ar' ? area.name_ar : area.name_en}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Unit Type */}
                    <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none">
                        <label className="block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                            {trans('type')}
                        </label>
                        <Select
                            value={local.type_id}
                            onChange={e => update('type_id', e.target.value)}
                            className="w-full text-secondary-800 outline-none cursor-pointer"
                        >
                            <option value="">{locale === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
                            {unitTypes.map(ut => (
                                <option key={ut.id} value={ut.id}>
                                    {locale === 'ar' ? ut.name_ar : ut.name_en}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full md:w-auto p-2 flex items-center justify-between md:justify-center gap-3 md:gap-2 shrink-0 md:ps-4">
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
                            className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-950 active:scale-95 transition-all duration-200 disabled:opacity-80"
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

                {/* Advanced Filters (Price) */}
                <div 
                    className={`transition-all duration-300 ease-in-out origin-top rounded-b-3xl md:rounded-b-[2rem] ${showAdvanced ? 'overflow-visible' : 'overflow-hidden'}`}
                    style={{
                        maxHeight: showAdvanced ? '1500px' : '0px',
                        opacity: showAdvanced ? 1 : 0,
                    }}
                >
                    <div className="px-4 py-4 bg-surface/30 border-t border-secondary-100 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="flex-1 w-full">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">
                                    {locale === 'ar' ? 'الحد الأدنى للسعر' : 'Minimum Price'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={local.price_min}
                                    onChange={e => update('price_min', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">
                                    {locale === 'ar' ? 'الحد الأقصى للسعر' : 'Maximum Price'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={local.price_max}
                                    onChange={e => update('price_max', e.target.value)}
                                    placeholder={locale === 'ar' ? 'لا يوجد حد' : 'No limit'}
                                    className="w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="flex-1 w-full">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">
                                    {locale === 'ar' ? 'الحد الأدنى للمساحة' : 'Minimum Size'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={local.size_min}
                                    onChange={e => update('size_min', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">
                                    {locale === 'ar' ? 'الحد الأقصى للمساحة' : 'Maximum Size'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={local.size_max}
                                    onChange={e => update('size_max', e.target.value)}
                                    placeholder={locale === 'ar' ? 'لا يوجد حد' : 'No limit'}
                                    className="w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="flex-1 w-full">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">
                                    {trans('payment_method') || 'Payment Method'}
                                </label>
                                <Select
                                    value={local.payment_method}
                                    onChange={e => update('payment_method', e.target.value)}
                                    className="w-full"
                                >
                                    <option value="">{trans('all') || 'All'}</option>
                                    <option value="cash">{trans('cash') || 'Cash'}</option>
                                    <option value="installment">{trans('installment') || 'Installment'}</option>
                                    <option value="both">{trans('both') || 'Cash & Installment'}</option>
                                </Select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1">
                                    {trans('finishing_type') || 'Finishing Type'}
                                </label>
                                <Select
                                    value={local.finishing_type_id}
                                    onChange={e => update('finishing_type_id', e.target.value)}
                                    className="w-full"
                                >
                                    <option value="">{trans('all') || 'All'}</option>
                                    {finishingTypes?.map(f => (
                                        <option key={f.id} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {features?.length > 0 && (
                            <div className="w-full pt-3 border-t border-secondary-100/50">
                                <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2">
                                    {trans('features') || 'Features'}
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {features.map(feature => {
                                        const isChecked = Array.isArray(local.features) 
                                            ? (local.features.includes(String(feature.id)) || local.features.includes(feature.id))
                                            : false;
                                        return (
                                            <div key={feature.id} className="flex items-center gap-2 group">
                                                <input 
                                                    type="checkbox"
                                                    id={`feature-${feature.id}`}
                                                    checked={isChecked}
                                                    onChange={() => toggleFeature(feature.id)}
                                                    className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
                                                />
                                                <label htmlFor={`feature-${feature.id}`} className="text-xs text-secondary-700 group-hover:text-primary-900 transition-colors cursor-pointer select-none">
                                                    {locale === 'ar' ? feature.name_ar : feature.name_en}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        
                        <div className="w-full flex justify-end pt-3 border-t border-secondary-100/50">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full sm:w-auto px-6 h-10 text-secondary-700 bg-transparent hover:bg-secondary-200/50 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
