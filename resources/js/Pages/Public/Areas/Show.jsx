import { useState } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { localizedPath } from '../../../Utils/route'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SearchBar from '../../../Components/UI/SearchBar'
import UnitCard from '../../../Components/UI/UnitCard'
import ProjectCard from '../../../Components/UI/ProjectCard'
import Pagination from '../../../Components/UI/Pagination'
import SeoHead from '../../../Components/UI/SeoHead'

export default function AreaShow({ area, units, projects, seo, areas, unitTypes, features, finishingTypes }) {
    const { locale, appUrl } = usePage().props
    const { url: currentUrl } = usePage()
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [activeTab, setActiveTab] = useState('all') // 'all', 'units', 'projects'

    const areaName = isRtl ? (area?.name_ar || area?.name_en || area?.name) : (area?.name_en || area?.name_ar || area?.name)
    const unitsCount = units?.total ?? units?.data?.length ?? 0
    const projectsCount = projects?.total ?? projects?.data?.length ?? 0

    const pageTitle = seo?.title || (isRtl 
        ? `عقارات ومشاريع في ${areaName} - ${trans('app_name')}`
        : `Properties & Projects in ${areaName} - ${trans('app_name')}`)

    const pageDescription = seo?.description || (isRtl
        ? `تصفح أحدث الوحدات العقارية والمشاريع المتاحة للبيع والاستثمار في منطقة ${areaName}.`
        : `Explore the latest real estate units and projects available in ${areaName}.`)

    const pageKeywords = Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : seo?.keywords

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                keywords={pageKeywords}
                ogImage={seo?.ogImage}
                canonical={appUrl && currentUrl ? `${appUrl}${currentUrl.split('?')[0]}` : undefined}
            />
            <Header />

            <main className="flex-1">
                {/* Hero / Area Banner Header */}
                <section className="relative bg-white pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-secondary-100">
                    <div className="absolute inset-0 bg-white" />
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-secondary-50 to-transparent opacity-50" />
                    
                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center justify-center gap-2 text-xs text-secondary-400 mb-8 font-medium" aria-label="Breadcrumb">
                            <Link href={localizedPath('/', locale)} className="hover:text-secondary-900 transition-colors">
                                {trans('home')}
                            </Link>
                            <span>/</span>
                            <span className="text-primary-700">{areaName}</span>
                        </nav>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100/50 text-xs font-bold mb-6 shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{isRtl ? 'منطقة عقارية' : 'Real Estate Region'}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-secondary-950 tracking-tight leading-tight mb-6">
                            {areaName}
                        </h1>
                        
                        <p className="text-secondary-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                            {isRtl
                                ? `اعثر على أفضل الخيارات العقارية السكنية والتجارية والمشاريع الاستثمارية في منطقة ${areaName}.`
                                : `Find top residential, commercial properties, and investment projects in ${areaName}.`}
                        </p>

                        {/* Stat Badges */}
                        <div className="flex items-center justify-center gap-6 md:gap-12">
                            <div className="flex flex-col items-center">
                                <div className="text-3xl md:text-4xl font-black text-secondary-950 tracking-tight">{unitsCount}</div>
                                <div className="text-sm text-secondary-500 font-semibold mt-1">{trans('units')}</div>
                            </div>
                            <div className="w-px h-12 bg-secondary-200" />
                            <div className="flex flex-col items-center">
                                <div className="text-3xl md:text-4xl font-black text-primary-700 tracking-tight">{projectsCount}</div>
                                <div className="text-sm text-secondary-500 font-semibold mt-1">{trans('projects')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integrated Search Bar pre-filtered for area */}
                <div className="max-w-container mx-auto px-4 relative z-20 -mt-12 md:-mt-16 mb-8">
                    <SearchBar 
                        areas={areas} 
                        unitTypes={unitTypes} 
                        features={features} 
                        finishingTypes={finishingTypes}
                        filters={{ area_id: area?.id }}
                    />
                </div>

                {/* Filter Tabs Header */}
                <section className="max-w-container mx-auto px-4 pt-8 pb-4">
                    <div className="flex items-center justify-between border-b border-secondary-200 pb-4">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                    activeTab === 'all'
                                        ? 'bg-primary-900 text-white shadow-md'
                                        : 'bg-white text-secondary-700 hover:bg-secondary-100 border border-secondary-200'
                                }`}
                            >
                                {isRtl ? 'عرض الكل' : 'All Listings'} ({unitsCount + projectsCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('units')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                    activeTab === 'units'
                                        ? 'bg-primary-900 text-white shadow-md'
                                        : 'bg-white text-secondary-700 hover:bg-secondary-100 border border-secondary-200'
                                }`}
                            >
                                {trans('units')} ({unitsCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                    activeTab === 'projects'
                                        ? 'bg-primary-900 text-white shadow-md'
                                        : 'bg-white text-secondary-700 hover:bg-secondary-100 border border-secondary-200'
                                }`}
                            >
                                {trans('projects')} ({projectsCount})
                            </button>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                {(activeTab === 'all' || activeTab === 'projects') && (
                    <section className="max-w-container mx-auto px-4 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-secondary-950 tracking-tight flex items-center gap-2">
                                    <span className="w-2.5 h-6 bg-primary-900 rounded-full inline-block" />
                                    {isRtl ? `المشاريع في ${areaName}` : `Projects in ${areaName}`}
                                </h2>
                                <p className="text-xs text-secondary-500 mt-1">
                                    {isRtl ? 'أحدث المجمعات والمشاريع السكنية والتجارية' : 'Latest residential and commercial projects'}
                                </p>
                            </div>
                            {projectsCount > 0 && (
                                <Link 
                                    href={localizedPath(`/projects?area_id=${area.id}`, locale)}
                                    className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1"
                                >
                                    {trans('show_more')}
                                    <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                        {projects?.data?.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.data.map(project => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                                <Pagination meta={projects} pageParam="projects_page" />
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-8 text-center border border-secondary-100">
                                <p className="text-sm text-secondary-500 font-medium">
                                    {isRtl ? `لا توجد مشاريع مضافة حالياً في منطقة ${areaName}` : `No projects available in ${areaName} currently`}
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* Units Section */}
                {(activeTab === 'all' || activeTab === 'units') && (
                    <section className="max-w-container mx-auto px-4 py-8 border-t border-secondary-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-secondary-950 tracking-tight flex items-center gap-2">
                                    <span className="w-2.5 h-6 bg-primary-600 rounded-full inline-block" />
                                    {isRtl ? `الوحدات المعروضة في ${areaName}` : `Units available in ${areaName}`}
                                </h2>
                                <p className="text-xs text-secondary-500 mt-1">
                                    {isRtl ? 'وحدات سكنية وتجارية ممتازة للبيع وللاستثمار' : 'Residential and commercial units for sale and investment'}
                                </p>
                            </div>
                            {unitsCount > 0 && (
                                <Link 
                                    href={localizedPath(`/units?area_id=${area.id}`, locale)}
                                    className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1"
                                >
                                    {trans('show_more')}
                                    <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                        {units?.data?.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {units.data.map(unit => (
                                        <UnitCard key={unit.id} unit={unit} />
                                    ))}
                                </div>
                                <Pagination meta={units} pageParam="units_page" />
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-8 text-center border border-secondary-100">
                                <p className="text-sm text-secondary-500 font-medium">
                                    {isRtl ? `لا توجد وحدات معروضة حالياً في منطقة ${areaName}` : `No units available in ${areaName} currently`}
                                </p>
                            </div>
                        )}
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}
