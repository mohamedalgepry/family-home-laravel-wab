import { useState } from 'react'
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
import { getStorageUrl } from '../../Utils/image'

const HERO_BG = '/images/hero.webp'
const HERO_BG_MOBILE = '/images/hero-mobile.webp'

export default function Home({ featuredUnits, latestUnits, latestProjects, popularSearches, areas, unitTypes, features, finishingTypes }) {
    const { locale, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const heroTitle = isRtl
        ? (settings?.hero_title_ar || trans('hero_title'))
        : (settings?.hero_title_en || settings?.hero_title_ar || trans('hero_title'))

    const heroSubtitle = isRtl
        ? (settings?.hero_subtitle_ar || trans('hero_subtitle'))
        : (settings?.hero_subtitle_en || settings?.hero_subtitle_ar || trans('hero_subtitle'))

    const heroImage = settings?.hero_image ? getStorageUrl(settings.hero_image, HERO_BG) : HERO_BG
    const heroImageMobile = settings?.hero_image_mobile ? getStorageUrl(settings.hero_image_mobile, HERO_BG_MOBILE) : (settings?.hero_image ? getStorageUrl(settings.hero_image, HERO_BG_MOBILE) : HERO_BG_MOBILE)

    const firstFeaturedImg = featuredUnits?.data?.[0]?.images?.[0]
    const homeOgImage = getStorageUrl(firstFeaturedImg?.url || firstFeaturedImg?.path, null)

    const isLoading = !featuredUnits && !latestUnits && !latestProjects
    const hasFeatured = featuredUnits?.data?.length > 0
    const hasLatest = latestUnits?.data?.length > 0
    const hasProjects = latestProjects?.data?.length > 0

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col font-sans">
            <SeoHead
                title={`${trans('app_name')} | ${trans('site_title')}`}
                description={heroSubtitle || trans('hero_subtitle')}
                ogImage={homeOgImage}
                ogType="website"
            />
            <Header />

            <main id="main-content" className="flex-1">
                {/* Hero Section with Search Bar */}
                <section className="relative min-h-[520px] md:min-h-[580px] flex items-center justify-center pt-8 pb-24 md:pb-32 md:pt-20 px-4 z-20">
                    <picture className="absolute inset-0 w-full h-full overflow-hidden">
                        <source media="(max-width: 640px)" srcSet={heroImageMobile} />
                        <img 
                            src={heroImage} 
                            alt={trans('site_title')} 
                            width={1920}
                            height={1080}
                            className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom" 
                            fetchPriority="high"
                            loading="eager"
                            decoding="sync"
                        />
                    </picture>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>

                    <div className="relative z-10 max-w-container mx-auto w-full text-center space-y-6 md:space-y-8 mt-2">
                        <div className="space-y-3 max-w-3xl mx-auto px-2">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                                {heroTitle}
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto drop-shadow">
                                {heroSubtitle}
                            </p>
                        </div>

                        {/* Integrated Search Container */}
                        <div className="max-w-4xl mx-auto">
                            <SearchBar 
                                initialUnitTypes={unitTypes} 
                                initialAreas={areas} 
                                initialFeatures={features}
                                initialFinishingTypes={finishingTypes}
                                popularSearches={popularSearches}
                            />
                        </div>
                    </div>
                </section>

                {/* Quick Navigation (Mobile Only) */}
                <section className="md:hidden max-w-container mx-auto px-4 mb-8">
                    <div className="grid grid-cols-2 gap-3">
                        <Link href={localizedPath('/units', locale)} className="bg-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-border hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            <span className="font-bold text-sm text-secondary-950">{trans('units')}</span>
                        </Link>
                        <Link href={localizedPath('/projects', locale)} className="bg-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-border hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            <span className="font-bold text-sm text-secondary-950">{trans('projects')}</span>
                        </Link>
                        <a href="#areas-section" className="bg-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-border hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="font-bold text-sm text-secondary-950">{trans('areas')}</span>
                        </a>
                        <Link href={localizedPath('/units/deals', locale)} className="bg-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-border hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                            <span className="font-bold text-sm text-secondary-950">{trans('deals') || 'الصفقات'}</span>
                        </Link>
                    </div>
                </section>



                {/* Explore Areas Section */}
                {areas?.length > 0 && (
                    <section id="areas-section" className="max-w-container mx-auto px-4 py-8 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">{trans('explore_areas') || 'المناطق الأكثر بحثاً'}</h2>
                        </div>

                        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar pb-4">
                            {areas?.map(area => {
                                const areaName = isRtl ? (area.name_ar || area.name_en || area.name) : (area.name_en || area.name_ar || area.name)
                                const areaSlug = area.slug || area.id
                                const areaImg = getStorageUrl(area.image_path || area.hero_image)
                                return (
                                    <Link
                                        key={area.id}
                                        href={localizedPath(`/areas/${areaSlug}`, locale)}
                                        className="group relative shrink-0 w-[180px] md:w-[220px] h-[240px] bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-[transform,box-shadow] duration-300 snap-center"
                                    >
                                        {(area.image_path || area.hero_image) ? (
                                            <img 
                                                src={getStorageUrl(area.image_path || area.hero_image)}
                                                alt={areaName}
                                                width={220}
                                                height={240}
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white/40 group-hover:text-primary-400 transition-colors pb-10">
                                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-primary-900/30 transition-[transform,background-color] duration-200">
                                                    <svg className="w-7 h-7 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-start">
                                            <h3 className="text-white font-bold text-base mb-1">{areaName}</h3>
                                            <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{trans('explore') || 'استكشف'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Featured Units Section */}
                {hasFeatured && Array.isArray(featuredUnits?.data) && (
                    <section className="bg-transparent py-8 max-w-container mx-auto px-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">
                                {trans('featured_units') || (isRtl ? 'وحدات مميزة' : 'Featured Properties')}
                            </h2>
                            <Link href={localizedPath('/units?is_featured=1', locale)} className="px-4 py-1.5 bg-white text-secondary-800 border border-border rounded-full text-xs font-bold hover:bg-surface-hover hover:text-primary-900 transition-colors shadow-sm">
                                {trans('view_all') || 'عرض الكل'}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredUnits.data.map(unit => (
                                <UnitCard key={unit.id} unit={unit} />
                            ))}
                        </div>
                        <Pagination meta={featuredUnits} links={featuredUnits?.links} pageParam="featured_page" />
                    </section>
                )}

                {/* Latest Projects Section */}
                <section className="bg-transparent py-8 max-w-container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">{trans('latest_projects') || 'أحدث المشاريع'}</h2>
                        <Link href={localizedPath('/projects', locale)} className="px-4 py-1.5 bg-white text-secondary-800 border border-border rounded-full text-xs font-bold hover:bg-surface-hover hover:text-primary-900 transition-colors shadow-sm">
                            {trans('view_all') || 'عرض الكل'}
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
                                <Pagination meta={latestProjects} links={latestProjects?.links} pageParam="latest_projects_page" />
                            </>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                        )}
                </section>


                {/* Latest Units Section */}
                <section className="bg-transparent py-8 max-w-container mx-auto px-4 mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">{trans('latest_units') || 'أحدث الوحدات'}</h2>
                        <Link href={localizedPath('/units', locale)} className="px-4 py-1.5 bg-white text-secondary-800 border border-border rounded-full text-xs font-bold hover:bg-surface-hover hover:text-primary-900 transition-colors shadow-sm">
                            {trans('view_all') || 'عرض الكل'}
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
                                <Pagination meta={latestUnits} links={latestUnits?.links} pageParam="latest_units_page" />
                            </>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                        )}
                </section>
            </main>

            <Footer />
        </div>
    )
}
