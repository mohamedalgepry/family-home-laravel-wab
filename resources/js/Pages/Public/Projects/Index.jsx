import { Select } from '../../../Components/UI'
import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import ProjectCard from '../../../Components/UI/ProjectCard'
import Pagination from '../../../Components/UI/Pagination'
import SeoHead from '../../../Components/UI/SeoHead'
import { useState } from 'react'

export default function ProjectsIndex({ projects, filters, areas, features, finishingTypes }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const isLoading = !projects
    const hasProjects = projects?.data?.length > 0

    const [search, setSearch] = useState(filters.search || '')
    const [areaId, setAreaId] = useState(filters.area_id || '')
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || '')
    const [finishingTypeId, setFinishingTypeId] = useState(filters.finishing_type_id || '')
    const [selectedFeatures, setSelectedFeatures] = useState(filters.features || [])
    const [showAdvanced, setShowAdvanced] = useState(false)

    function handleSearch() {
        const params = {}
        if (search) params.search = search
        if (areaId) params.area_id = areaId
        if (paymentMethod) params.payment_method = paymentMethod
        if (finishingTypeId) params.finishing_type_id = finishingTypeId
        if (selectedFeatures.length > 0) params.features = selectedFeatures
        router.get(`/${locale}/projects`, params, { preserveState: true })
    }

    function handleReset() {
        setSearch('')
        setAreaId('')
        setPaymentMethod('')
        setFinishingTypeId('')
        setSelectedFeatures([])
        router.get(`/${locale}/projects`, {}, { preserveState: true })
    }

    function toggleFeature(id) {
        if (id == null) return;
        const idStr = String(id);
        if (selectedFeatures.includes(idStr) || selectedFeatures.includes(id)) {
            setSelectedFeatures(selectedFeatures.filter(f => f?.toString() !== idStr))
        } else {
            setSelectedFeatures([...selectedFeatures, id])
        }
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${trans('projects_page_title')} - ${trans('site_title')}`}
                description={trans('projects_description')}
                canonical={window.location.href}
            />
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('projects_page_title') || trans('page_title')}</h1>

                {/* Filters */}
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                    className="bg-white rounded-3xl md:rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full mb-8 relative z-[60]"
                >
                    <div className="flex flex-col md:flex-row items-center md:divide-x divide-y md:divide-y-0 rtl:divide-x-reverse divide-secondary-100 p-2 md:p-2.5">
                        
                        {/* Keyword */}
                        <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-text group rounded-2xl md:rounded-s-full md:rounded-e-none">
                            <label className="block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                {trans('search')}
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={trans('search_projects')}
                                className="w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none p-0"
                            />
                        </div>

                        {/* Area */}
                        <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none">
                            <label className="block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                {trans('area')}
                            </label>
                            <Select
                                value={areaId}
                                onChange={e => setAreaId(e.target.value)}
                                className="w-full text-secondary-800 outline-none cursor-pointer border-none p-0 focus:ring-0 bg-transparent text-sm"
                            >
                                <option value="">{trans('area')}</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.id}>
                                        {locale === 'ar' ? area.name_ar : area.name_en}
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
                                type="button"
                                onClick={handleReset}
                                className="w-12 h-12 rounded-full text-secondary-500 hover:text-primary-900 hover:bg-surface/80 transition-colors flex items-center justify-center"
                                aria-label={trans('clear_filters') || trans('cancel')}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            <button
                                type="submit"
                                className="w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-950 active:scale-95 transition-all duration-200"
                                aria-label={trans('search')}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div 
                        className="transition-all duration-300 ease-in-out origin-top overflow-hidden rounded-b-3xl md:rounded-b-[2rem]"
                        style={{
                            maxHeight: showAdvanced ? '800px' : '0px',
                            opacity: showAdvanced ? 1 : 0,
                        }}
                    >
                        <div className="px-6 py-6 bg-surface/30 border-t border-secondary-100 flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 w-full">
                                <div className="flex-1 w-full">
                                    <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2">
                                        {trans('payment_method') || 'Payment Method'}
                                    </label>
                                    <Select
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-0 h-11 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
                                    >
                                        <option value="">{trans('all') || 'All'}</option>
                                        <option value="cash">{trans('cash') || 'Cash'}</option>
                                        <option value="installment">{trans('installment') || 'Installment'}</option>
                                        <option value="both">{trans('both') || 'Cash & Installment'}</option>
                                    </Select>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2">
                                        {trans('finishing_type') || 'Finishing Type'}
                                    </label>
                                    <Select
                                        value={finishingTypeId}
                                        onChange={e => setFinishingTypeId(e.target.value)}
                                        className="w-full px-4 py-0 h-11 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
                                    >
                                        <option value="">{trans('all') || 'All'}</option>
                                        {finishingTypes?.map(f => (
                                            <option key={f.id} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            
                            {features?.length > 0 && (
                                <div className="w-full pt-4 border-t border-secondary-100/50">
                                    <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-3">
                                        {trans('features') || 'Features'}
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {features.map(feature => (
                                            <label key={feature.id} className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedFeatures.includes(String(feature.id)) || selectedFeatures.includes(feature.id)}
                                                    onChange={() => toggleFeature(feature.id)}
                                                    className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
                                                />
                                                <span className="text-sm text-secondary-700 group-hover:text-primary-900 transition-colors">
                                                    {locale === 'ar' ? feature.name_ar : feature.name_en}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProjectCard key={i} loading={true} />
                        ))}
                    </div>
                ) : hasProjects ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.data.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                        <Pagination meta={projects} links={projects.links} />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted text-sm">{trans('no_projects')}</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
