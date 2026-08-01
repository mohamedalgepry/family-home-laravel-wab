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
                title={`${trans('projects_page_title') || (isRtl ? 'المشاريع العقارية' : 'Real Estate Projects')} - ${trans('site_title')}`}
                description={trans('projects_description')}
                canonical={window.location.href}
            />
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 md:py-12 w-full">
                
                {/* Header Banner */}
                <div className="mb-8 text-center max-w-3xl mx-auto">
                    <span className="inline-block bg-primary-50 text-primary-900 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide">
                        {isRtl ? 'المشاريع العقارية' : 'Real Estate Projects'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-950 tracking-tight leading-tight mb-3">
                        {trans('projects_page_title') || (isRtl ? 'أبرز المشاريع والمجمعات السكنية' : 'Featured Projects')}
                    </h1>
                    <p className="text-sm md:text-base text-secondary-600 leading-relaxed">
                        {isRtl 
                            ? 'تصفح أفضل المشاريع الفاخرة المتاحة للبيع والتقسيط في أرقى المناطق والمدن'
                            : 'Browse premium real estate developments and residential compounds across top locations'}
                    </p>
                </div>

                {/* Filters */}
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                    className="bg-white rounded-2xl md:rounded-full shadow-lg border border-secondary-100 hover:shadow-xl transition-shadow duration-300 w-full mb-10 relative z-20"
                >
                    <div className="flex flex-col md:flex-row items-center md:divide-x divide-y md:divide-y-0 rtl:divide-x-reverse divide-secondary-100 p-2 md:p-2.5">
                        
                        {/* Keyword */}
                        <div className="flex-1 w-full px-5 py-3 hover:bg-surface/50 transition-colors group rounded-xl md:rounded-s-full md:rounded-e-none">
                            <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                {trans('search')}
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={trans('search_projects') || (isRtl ? 'ابحث باسم المشروع...' : 'Search by project name...')}
                                className="w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none p-0"
                            />
                        </div>

                        {/* Area */}
                        <div className="flex-1 w-full px-5 py-3 hover:bg-surface/50 transition-colors cursor-pointer group rounded-xl md:rounded-none">
                            <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors">
                                {trans('area')}
                            </label>
                            <Select
                                value={areaId}
                                onChange={e => setAreaId(e.target.value)}
                                className="w-full text-secondary-800 outline-none cursor-pointer border-none p-0 focus:ring-0 bg-transparent text-sm font-medium"
                            >
                                <option value="">{isRtl ? 'جميع المناطق' : 'All Areas'}</option>
                                {areas?.map(area => (
                                    <option key={area.id} value={area.id}>
                                        {locale === 'ar' ? area.name_ar : area.name_en}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full md:w-auto p-2 flex items-center justify-between md:justify-center gap-2 shrink-0 md:ps-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                                    showAdvanced 
                                        ? 'bg-primary-50 text-primary-900 border border-primary-200' 
                                        : 'bg-surface text-secondary-700 hover:bg-secondary-100'
                                }`}
                            >
                                {isRtl ? 'تصفية إضافية' : 'More Filters'}
                            </button>

                            {(search || areaId || paymentMethod || finishingTypeId || selectedFeatures.length > 0) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-3 py-2.5 rounded-full text-xs font-medium text-secondary-500 hover:text-secondary-900 transition-colors"
                                >
                                    {trans('clear_filters') || (isRtl ? 'إعادة ضبط' : 'Reset')}
                                </button>
                            )}
                            
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-primary-900 text-white font-semibold text-xs rounded-full hover:bg-primary-950 active:scale-95 transition-all duration-200 shadow-sm"
                            >
                                {trans('search') || (isRtl ? 'بحث' : 'Search')}
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters Drawer */}
                    <div 
                        className="transition-all duration-300 ease-in-out origin-top overflow-hidden rounded-b-2xl md:rounded-b-[1.5rem]"
                        style={{
                            maxHeight: showAdvanced ? '800px' : '0px',
                            opacity: showAdvanced ? 1 : 0,
                        }}
                    >
                        <div className="px-6 py-6 bg-surface/40 border-t border-secondary-100 flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 w-full">
                                <div className="flex-1 w-full">
                                    <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2">
                                        {trans('payment_method') || (isRtl ? 'طريقة الدفع' : 'Payment Method')}
                                    </label>
                                    <Select
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-2 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none"
                                    >
                                        <option value="">{trans('all') || (isRtl ? 'الكل' : 'All')}</option>
                                        <option value="cash">{trans('cash') || (isRtl ? 'كاش' : 'Cash')}</option>
                                        <option value="installment">{trans('installment') || (isRtl ? 'تقسيط' : 'Installment')}</option>
                                        <option value="both">{trans('both') || (isRtl ? 'كاش وتقسيط' : 'Cash & Installment')}</option>
                                    </Select>
                                </div>

                                <div className="flex-1 w-full">
                                    <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2">
                                        {trans('finishing_type') || (isRtl ? 'نوع التشطيب' : 'Finishing Type')}
                                    </label>
                                    <Select
                                        value={finishingTypeId}
                                        onChange={e => setFinishingTypeId(e.target.value)}
                                        className="w-full px-4 py-2 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none"
                                    >
                                        <option value="">{trans('all') || (isRtl ? 'الكل' : 'All')}</option>
                                        {finishingTypes?.map(f => (
                                            <option key={f.id} value={f.id}>{locale === 'ar' ? f.name_ar : f.name_en}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            
                            {features?.length > 0 && (
                                <div className="w-full pt-4 border-t border-secondary-200/60">
                                    <label className="block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-3">
                                        {trans('features') || (isRtl ? 'المميزات والخدمات' : 'Features')}
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

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProjectCard key={i} loading={true} />
                        ))}
                    </div>
                ) : hasProjects ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {projects.data.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                        <Pagination meta={projects} links={projects.links} />
                    </>
                ) : (
                    <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center max-w-md mx-auto my-8">
                        <h3 className="text-base font-bold text-secondary-900 mb-2">
                            {isRtl ? 'لم يتم العثور على مشاريع مطابقة' : 'No Projects Found'}
                        </h3>
                        <p className="text-xs text-secondary-500 mb-6 leading-relaxed">
                            {isRtl ? 'جرب البحث بكلمات مختلفة أو قم بإزالة بعض الفلاتر' : 'Try adjusting your search criteria or resetting filters'}
                        </p>
                        <button
                            onClick={handleReset}
                            className="px-5 py-2.5 bg-secondary-900 text-white rounded-xl text-xs font-semibold hover:bg-secondary-950 transition-colors"
                        >
                            {isRtl ? 'عرض كل المشاريع' : 'Show All Projects'}
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
