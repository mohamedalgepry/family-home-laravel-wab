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
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
            <SeoHead
                title={`${trans('projects_page_title')} - ${trans('site_title')}`}
                description={trans('projects_description')}
            />
            <Header />

            <main id="main-content" tabIndex="-1" className="flex-1 w-full flex flex-col focus:outline-none">
                
                {/* Premium Header Area */}
                <div className="bg-gradient-to-b from-surface-hover to-surface pt-8 pb-10 px-4">
                    <div className="max-w-container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-center md:text-start">
                            <div>
                                <span className="inline-block bg-primary-50 text-primary-900 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide">
                                    {trans('real_estate_projects')}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black text-secondary-950 tracking-tight leading-tight mb-2">
                                    {trans('projects_page_title')}
                                </h1>
                                <p className="text-sm font-medium text-secondary-500 max-w-2xl mx-auto md:mx-0">
                                    {hasProjects ? (
                                        locale === 'ar' ? `تم العثور على ${projects.meta?.total || projects.total || projects.data?.length} مشروع` : `Found ${projects.meta?.total || projects.total || projects.data?.length} projects`
                                    ) : (
                                        isRtl 
                                            ? 'تصفح أفضل المشاريع الفاخرة المتاحة للبيع والتقسيط في أرقى المناطق والمدن'
                                            : 'Browse premium real estate developments and residential compounds across top locations'
                                    )}
                                </p>
                            </div>
                        </div>
                        {/* Filters Banner matching Home page SearchBar */}
                        <div className="w-full max-w-5xl mx-auto relative z-30">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl md:rounded-[2rem] shadow-2xl border border-white/60 transition-all duration-300 w-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
                    >
                        {/* Main Unified Row */}
                        <div className="flex flex-col md:flex-row items-center md:divide-x divide-y md:divide-y-0 rtl:divide-x-reverse divide-secondary-100 p-2 md:p-2.5">
                            
                            {/* Keyword Input */}
                            <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-text group rounded-2xl md:rounded-s-3xl md:rounded-e-none">
                                <label htmlFor="project-search-input" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                    {trans('search')}
                                </label>
                                <input
                                    id="project-search-input"
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={trans('search_projects')}
                                    className="w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none p-0"
                                />
                            </div>

                            {/* Area Select */}
                            <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none">
                                <label htmlFor="project-area-select" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                    {trans('area')}
                                </label>
                                <Select
                                    id="project-area-select"
                                    value={areaId}
                                    onChange={e => setAreaId(e.target.value)}
                                    className="w-full text-secondary-800 outline-none cursor-pointer border-none p-0 focus:ring-0 bg-transparent text-sm font-medium"
                                >
                                    <option value="">{trans('all_areas')}</option>
                                    {areas?.map(area => (
                                        <option key={area.id} value={area.id}>
                                            {locale === 'ar' ? area.name_ar : area.name_en}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Payment Method Select */}
                            <div className="flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none">
                                <label htmlFor="project-payment-select" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                    {trans('payment_method')}
                                </label>
                                <Select
                                    id="project-payment-select"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    className="w-full text-secondary-800 outline-none cursor-pointer border-none p-0 focus:ring-0 bg-transparent text-sm font-medium"
                                >
                                    <option value="">{trans('all')}</option>
                                    <option value="cash">{trans('cash')}</option>
                                    <option value="installment">{trans('installment')}</option>
                                    <option value="both">{trans('both')}</option>
                                </Select>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full md:w-auto p-2 flex items-center justify-between md:justify-center gap-2 shrink-0 md:ps-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        showAdvanced 
                                            ? 'bg-primary-50 text-primary-900 border border-primary-200 shadow-xs' 
                                            : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
                                    </svg>
                                    <span>{trans('more_filters')}</span>
                                </button>

                                {(search || areaId || paymentMethod || finishingTypeId || selectedFeatures.length > 0) && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-3 py-3 rounded-2xl text-xs font-medium text-secondary-500 hover:text-secondary-900 transition-colors"
                                    >
                                        {trans('clear_filters')}
                                    </button>
                                )}
                                
                                <button
                                    type="submit"
                                    className="px-7 py-3 bg-primary-900 hover:bg-primary-950 text-white font-bold text-xs rounded-2xl md:rounded-2xl shadow-md active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <span>{trans('search')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters Drawer */}
                        <div 
                            className={`transition-all duration-300 ease-in-out origin-top rounded-b-3xl md:rounded-b-[2rem] ${
                                showAdvanced ? 'overflow-visible' : 'overflow-hidden'
                            }`}
                            style={{
                                maxHeight: showAdvanced ? '1000px' : '0px',
                                opacity: showAdvanced ? 1 : 0,
                            }}
                        >
                            <div className="px-6 pt-6 pb-8 bg-surface/40 border-t border-secondary-100 flex flex-col gap-6 rounded-b-3xl md:rounded-b-[2rem]">
                                <div className="flex flex-col sm:flex-row gap-6 w-full">
                                    <div className="flex-1 w-full">
                                        <label htmlFor="project-finishing-select" className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-2">
                                            {trans('finishing_type')}
                                        </label>
                                        <Select
                                            id="project-finishing-select"
                                            value={finishingTypeId}
                                            onChange={e => setFinishingTypeId(e.target.value)}
                                            className="w-full"
                                        >
                                            <option value="">{trans('all')}</option>
                                            {finishingTypes?.map(f => (
                                                <option key={f.id} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                
                                {features?.length > 0 && (
                                    <div className="w-full pt-4 border-t border-secondary-200/60">
                                        <label className="block text-xs font-bold text-secondary-950 uppercase tracking-wider mb-3">
                                            {trans('features')}
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {features.map(feature => (
                                                <label key={feature.id} className="flex items-center gap-2 cursor-pointer group">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFeatures.includes(String(feature.id)) || selectedFeatures.includes(feature.id)}
                                                        onChange={() => toggleFeature(feature.id)}
                                                        className="w-4 h-4 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
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
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                {/* Projects Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProjectCard key={i} loading={true} />
                        ))}
                    </div>
                ) : hasProjects ? (
                    <div className="flex flex-col gap-8 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.data.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                        <Pagination meta={projects.meta || projects} links={projects.links} />
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-secondary-100 shadow-sm max-w-2xl mx-auto w-full">
                        <div className="w-16 h-16 bg-surface-hover text-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <h3 className="text-secondary-900 font-bold text-lg mb-2">
                            {trans('no_projects_found')}
                        </h3>
                        <p className="text-secondary-500 text-sm mb-6">
                            {trans('try_adjusting_your_search_crit')}
                        </p>
                        <button
                            onClick={handleReset}
                            className="px-5 py-2.5 bg-secondary-900 text-white rounded-xl text-xs font-semibold hover:bg-secondary-950 transition-colors"
                        >
                            {trans('show_all_projects')}
                        </button>
                    </div>
                )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
