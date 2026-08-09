import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import Header from '../../Components/Layout/Header'
import Footer from '../../Components/Layout/Footer'
import SearchBar from '../../Components/UI/SearchBar'
import UnitCard from '../../Components/UI/UnitCard'
import ProjectCard from '../../Components/UI/ProjectCard'
import Pagination from '../../Components/UI/Pagination'
import SeoHead from '../../Components/UI/SeoHead'

const HERO_BG = '/images/hero.webp'
const HERO_BG_MOBILE = '/images/hero-mobile.webp'

export default function Home({ featuredUnits, latestUnits, latestProjects, popularSearches, areas, unitTypes, features, finishingTypes }) {
    const { locale, settings, appUrl } = usePage().props
    const { url: currentUrl } = usePage()
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const heroTitle = isRtl ? (settings?.hero_title_ar || trans('hero_title')) : (settings?.hero_title_en || trans('hero_title'))
    const heroSubtitle = isRtl ? (settings?.hero_subtitle_ar || trans('hero_subtitle')) : (settings?.hero_subtitle_en || trans('hero_subtitle'))
    const heroImage = settings?.hero_image ? `/storage/${settings.hero_image}` : HERO_BG
    const heroImageMobile = settings?.hero_image_mobile ? `/storage/${settings.hero_image_mobile}` : (settings?.hero_image ? `/storage/${settings.hero_image}` : HERO_BG_MOBILE)

    const isLoading = !featuredUnits && !latestUnits && !latestProjects
    const hasFeatured = featuredUnits?.data?.length > 0
    const hasLatest = latestUnits?.data?.length > 0
    const hasProjects = latestProjects?.data?.length > 0

    const firstFeaturedImg = featuredUnits?.data?.[0]?.images?.[0]
    const homeOgImage = firstFeaturedImg?.url || (firstFeaturedImg?.path ? `/storage/${firstFeaturedImg.path}` : null)

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
            <SeoHead
                title={trans('site_title')}
                description={trans('home_description')}
                ogImage={homeOgImage}
                canonical={appUrl && currentUrl ? `${appUrl}${currentUrl.split('?')[0]}` : undefined}
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-secondary-950 flex flex-col justify-center min-h-[80vh]">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <picture className="w-full h-full">
                            <source media="(max-width: 640px)" srcSet={heroImageMobile} />
                            <img
                                src={heroImage}
                                alt=""
                                width={1920}
                                height={1080}
                                className="w-full h-full object-cover scale-105"
                                fetchPriority="high"
                                loading="eager"
                                decoding="sync"
                            />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/85 to-black/60"></div>
                    </div>

                    <div className="relative z-20 max-w-container mx-auto px-4 py-20 sm:py-28 text-center w-full">

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
                            {heroTitle}
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-secondary-200 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                            {heroSubtitle}
                        </p>

                        <SearchBar areas={areas} unitTypes={unitTypes} features={features} finishingTypes={finishingTypes} />
                    </div>
                </section>

                {/* Popular Searches */}
                {popularSearches?.length > 0 && (
                    <section className="max-w-container mx-auto px-4 py-8">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <h2 className="text-sm font-bold text-secondary-950 uppercase tracking-wider">{trans('popular_searches')}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map(ps => (
                                <Link
                                    key={ps.keyword}
                                    href={localizedPath(`/units?search=${encodeURIComponent(ps.keyword)}`, locale)}
                                    className="px-3.5 py-1.5 bg-white text-xs font-semibold text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 hover:shadow-sm transition-all"
                                >
                                    {ps.keyword}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Explore Areas Section */}
                {areas?.length > 0 && (
                    <section className="max-w-container mx-auto px-4 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-secondary-950 tracking-tight">{trans('explore_areas')}</h2>
                                <p className="text-xs text-secondary-500 mt-1">{trans('explore_areas_subtitle')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                            {areas.map(area => {
                                const areaName = isRtl ? (area.name_ar || area.name_en || area.name) : (area.name_en || area.name_ar || area.name)
                                const areaSlug = area.slug || area.id
                                return (
                                    <Link
                                        key={area.id}
                                        href={localizedPath(`/areas/${areaSlug}`, locale)}
                                        className="group relative bg-white hover:bg-primary-950 rounded-2xl p-4 border border-secondary-200/80 hover:border-primary-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary-50 group-hover:bg-primary-900 text-primary-900 group-hover:text-white flex items-center justify-center mb-3 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-bold text-secondary-900 group-hover:text-white transition-colors duration-300 line-clamp-1">
                                            {areaName}
                                        </span>
                                        <span className="text-xs font-medium text-secondary-400 group-hover:text-primary-200 mt-1 transition-colors duration-300 flex items-center gap-0.5">
                                            <span>{isRtl ? 'عرض المكان' : 'Explore'}</span>
                                            <svg className="w-3 h-3 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Latest Projects Section */}
                <section className="bg-surface py-12 border-t border-secondary-100">
                    <div className="max-w-container mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-secondary-950 tracking-tight">{trans('latest_projects')}</h2>
                                <p className="text-xs text-secondary-500 mt-1">{trans('latest_projects_subtitle')}</p>
                            </div>
                            <Link href={localizedPath('/projects', locale)} className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1">
                                {trans('show_more')}
                                <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ProjectCard key={i} loading={true} />
                                ))}
                            </div>
                        ) : hasProjects && Array.isArray(latestProjects?.data) ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {latestProjects.data.map(project => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                                <Pagination meta={latestProjects} links={latestProjects?.links} />
                            </>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                        )}
                    </div>
                </section>

                {/* Featured Units Section */}
                <section className="max-w-container mx-auto px-4 py-12 border-t border-secondary-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-secondary-950 tracking-tight">{trans('featured_units')}</h2>
                            <p className="text-xs text-secondary-500 mt-1">{trans('featured_units_subtitle')}</p>
                        </div>
                        <Link href={localizedPath('/units', locale)} className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1">
                            {trans('show_more')}
                            <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <UnitCard key={i} loading={true} />
                            ))}
                        </div>
                    ) : hasFeatured && Array.isArray(featuredUnits?.data) ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {featuredUnits.data.map(unit => (
                                    <UnitCard key={unit.id} unit={unit} />
                                ))}
                            </div>
                            <Pagination meta={featuredUnits} links={featuredUnits?.links} />
                        </>
                    ) : (
                        <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                    )}
                </section>

                {/* Latest Units Section */}
                <section className="bg-surface py-12 border-t border-secondary-100">
                    <div className="max-w-container mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-secondary-950 tracking-tight">{trans('latest_units')}</h2>
                                <p className="text-xs text-secondary-500 mt-1">{trans('latest_units_subtitle')}</p>
                            </div>
                            <Link href={localizedPath('/units', locale)} className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1">
                                {trans('show_more')}
                                <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <UnitCard key={i} loading={true} />
                                ))}
                            </div>
                        ) : hasLatest && Array.isArray(latestUnits?.data) ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {latestUnits.data.map(unit => (
                                        <UnitCard key={unit.id} unit={unit} />
                                    ))}
                                </div>
                                <Pagination meta={latestUnits} links={latestUnits?.links} />
                            </>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
