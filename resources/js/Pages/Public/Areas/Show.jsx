import { useState, useRef } from 'react'
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

export default function AreaShow({ area, relatedAreas, units, projects, seo, areas, unitTypes, features, finishingTypes }) {
    const { locale, appUrl } = usePage().props
    const { url: currentUrl } = usePage()
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [activeTab, setActiveTab] = useState('projects') // 'projects', 'units'
    const [openFaq, setOpenFaq] = useState(null)

    const areaName = isRtl ? (area?.name_ar || area?.name_en) : (area?.name_en || area?.name_ar)
    const heroTitle = isRtl ? (area?.hero_title_ar || areaName) : (area?.hero_title_en || areaName)
    const heroDesc = isRtl ? (area?.hero_description_ar || area?.short_description_ar) : (area?.hero_description_en || area?.short_description_en)
    const aboutArea = isRtl ? area?.about_ar : area?.about_en
    const address = isRtl ? area?.address_ar : area?.address_en
    
    const unitsCount = area?.units_count || (units?.total ?? units?.data?.length ?? 0)
    const projectsCount = area?.projects_count || (projects?.total ?? projects?.data?.length ?? 0)

    const heroImage = area?.hero_image ? `/storage/${area.hero_image}` : (area?.image_path ? `/storage/${area.image_path}` : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')

    const pageTitle = seo?.title || `${heroTitle} - ${trans('app_name')}`
    const pageDescription = seo?.description || heroDesc
    const pageKeywords = Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : seo?.keywords

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                keywords={pageKeywords}
                ogImage={seo?.ogImage || heroImage}
                canonical={appUrl && currentUrl ? `${appUrl}${currentUrl.split('?')[0]}` : undefined}
            />
            <Header />

            <main className="flex-1">
                {/* 1. Hero Section */}
                <section className="relative h-[60vh] md:h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src={heroImage} alt={heroTitle} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                    
                    <div className="relative z-10 max-w-container mx-auto px-4 w-full pt-20">
                        <nav className="flex items-center gap-2 text-sm text-white/80 mb-6 font-medium" aria-label="Breadcrumb">
                            <Link href={localizedPath('/', locale)} className="hover:text-white transition-colors">
                                {trans('home')}
                            </Link>
                            <span>/</span>
                            <span className="text-white">{areaName}</span>
                        </nav>

                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
                                {heroTitle}
                            </h1>
                            {heroDesc && (
                                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-2xl drop-shadow mb-10">
                                    {heroDesc}
                                </p>
                            )}
                            
                            <div className="flex items-center gap-6 md:gap-10">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:px-8 md:py-5 text-center">
                                    <div className="text-3xl md:text-4xl font-black text-white">{projectsCount}</div>
                                    <div className="text-xs md:text-sm text-white/80 font-bold uppercase tracking-wider mt-1">{trans('projects')}</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:px-8 md:py-5 text-center">
                                    <div className="text-3xl md:text-4xl font-black text-white">{unitsCount}</div>
                                    <div className="text-xs md:text-sm text-white/80 font-bold uppercase tracking-wider mt-1">{trans('units')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Floating Search Bar */}
                <div className="max-w-container mx-auto px-4 relative z-20 -mt-8 md:-mt-12 mb-16">
                    <SearchBar 
                        areas={areas} 
                        unitTypes={unitTypes} 
                        features={features} 
                        finishingTypes={finishingTypes}
                        filters={{ area_id: area?.id }}
                    />
                </div>

                {/* 3. Area Info & Features (Split Layout) */}
                <section className="max-w-container mx-auto px-4 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE3E3] text-[#CC0000] text-xs font-bold mb-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {isRtl ? 'عن المنطقة' : 'About Area'}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-secondary-950 leading-tight">
                                {isRtl ? `اكتشف الحياة في ${areaName}` : `Discover Life in ${areaName}`}
                            </h2>
                            <div className="prose prose-lg prose-secondary max-w-none text-secondary-600 leading-relaxed font-medium">
                                {aboutArea ? (
                                    aboutArea.split('\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p>{heroDesc || (isRtl ? `تعرف على أبرز تفاصيل منطقة ${areaName} ومميزاتها.` : `Learn more about the details and features of ${areaName}.`)}</p>
                                )}
                            </div>
                            
                            {area?.gallery && area.gallery.length > 0 && (
                                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {area.gallery.map((img, idx) => (
                                        <img key={idx} src={`/storage/${img}`} alt={`${areaName} gallery ${idx}`} className="w-full h-32 md:h-40 object-cover rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-secondary-100 h-full">
                                <h3 className="text-2xl font-black text-secondary-950 mb-8 border-b border-secondary-100 pb-4">
                                    {trans('why_choose_this_area')}
                                </h3>
                                <div className="space-y-6">
                                    {area?.features?.filter(f => f.is_active)?.length > 0 ? (
                                        area.features.filter(f => f.is_active).sort((a,b)=>a.sort_order-b.sort_order).map((feature, idx) => {
                                            const fTitle = isRtl ? feature.title_ar : (feature.title_en || feature.title_ar)
                                            const fDesc = isRtl ? feature.description_ar : (feature.description_en || feature.description_ar)
                                            return (
                                                <div key={idx} className="flex gap-4">
                                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#FFF5F5] flex items-center justify-center text-[#CC0000]">
                                                        {feature.icon && feature.icon.includes('<svg') ? (
                                                            <div dangerouslySetInnerHTML={{ __html: feature.icon }} className="w-6 h-6" />
                                                        ) : (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-secondary-950 mb-1">{fTitle}</h4>
                                                        {fDesc && <p className="text-sm text-secondary-500 font-medium leading-relaxed">{fDesc}</p>}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-secondary-400 text-sm">{trans('no_features_added_currently')}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Listings Section (Projects & Units) */}
                <section className="bg-secondary-50 py-16 md:py-24 border-y border-secondary-200/50">
                    <div className="max-w-container mx-auto px-4">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-black text-secondary-950 mb-4">
                                {isRtl ? `العقارات المتاحة في ${areaName}` : `Properties in ${areaName}`}
                            </h2>
                            <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-secondary-100">
                                <button
                                    onClick={() => setActiveTab('projects')}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === 'projects'
                                            ? 'bg-[#CC0000] text-white shadow-md'
                                            : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                                    }`}
                                >
                                    {trans('projects')} ({projectsCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('units')}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === 'units'
                                            ? 'bg-[#CC0000] text-white shadow-md'
                                            : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                                    }`}
                                >
                                    {trans('units')} ({unitsCount})
                                </button>
                            </div>
                        </div>

                        {activeTab === 'projects' && (
                            <div className="animate-fade-in">
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
                                    <div className="bg-white rounded-3xl p-12 text-center border border-secondary-100">
                                        <p className="text-secondary-500 font-bold">{trans('no_projects_available')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'units' && (
                            <div className="animate-fade-in">
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
                                    <div className="bg-white rounded-3xl p-12 text-center border border-secondary-100">
                                        <p className="text-secondary-500 font-bold">{trans('no_units_available')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. Nearby & Location */}
                <section className="max-w-container mx-auto px-4 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        
                        <div className="lg:col-span-5">
                            <h2 className="text-3xl font-black text-secondary-950 mb-8">
                                {trans('nearby_places')}
                            </h2>
                            <div className="space-y-4">
                                {area?.nearbyPlaces?.filter(p => p.is_active)?.length > 0 ? (
                                    area.nearbyPlaces.filter(p => p.is_active).sort((a,b)=>a.sort_order-b.sort_order).map((place, idx) => {
                                        const pName = isRtl ? place.name_ar : (place.name_en || place.name_ar)
                                        return (
                                            <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-secondary-100 shadow-sm hover:border-[#CC0000] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-600">
                                                        {place.icon && place.icon.includes('<svg') ? (
                                                            <div dangerouslySetInnerHTML={{ __html: place.icon }} className="w-5 h-5" />
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-secondary-900">{pName}</span>
                                                </div>
                                                {place.distance && (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-lg font-black text-[#CC0000] leading-none">{place.distance}</span>
                                                        <span className="text-xs text-secondary-500 font-bold">{place.distance_unit}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-secondary-400 text-sm">{trans('no_nearby_places')}</div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <h2 className="text-3xl font-black text-secondary-950 mb-8 flex items-center justify-between">
                                {trans('location_on_map')}
                                {address && <span className="text-sm text-secondary-500 font-medium max-w-[200px] md:max-w-none truncate">{address}</span>}
                            </h2>
                            <div className="w-full h-[300px] md:h-[400px] bg-secondary-100 rounded-3xl overflow-hidden border border-secondary-200 shadow-sm relative">
                                {area?.map_url ? (
                                    <iframe src={area.map_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
                                ) : (area?.latitude && area?.longitude) ? (
                                    <iframe width="100%" height="100%" style={{ border: 0 }} src={`https://maps.google.com/maps?q=${area.latitude},${area.longitude}&z=14&output=embed`} allowFullScreen></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-secondary-400 flex-col gap-2">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                        <span>{trans('map_not_available')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. FAQ Section */}
                {area?.faqs?.filter(f => f.is_active)?.length > 0 && (
                    <section className="bg-white py-16 md:py-24 border-t border-secondary-100">
                        <div className="max-w-3xl mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-black text-secondary-950 mb-4">
                                    {trans('frequently_asked_questions')}
                                </h2>
                                <p className="text-secondary-500 font-medium">
                                    {isRtl ? `كل ما تحتاج معرفته عن ${areaName}` : `Everything you need to know about ${areaName}`}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {area.faqs.filter(f => f.is_active).sort((a,b)=>a.sort_order-b.sort_order).map((faq, idx) => {
                                    const q = isRtl ? faq.question_ar : (faq.question_en || faq.question_ar)
                                    const a = isRtl ? faq.answer_ar : (faq.answer_en || faq.answer_ar)
                                    const isOpen = openFaq === idx
                                    return (
                                        <div key={idx} className={`border border-secondary-200 rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-[#CC0000] bg-white shadow-md' : 'bg-surface hover:bg-white hover:border-secondary-300'}`}>
                                            <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                                                <span className={`font-bold text-lg ${isOpen ? 'text-[#CC0000]' : 'text-secondary-900'}`}>{q}</span>
                                                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#CC0000]' : 'text-secondary-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                                                <div className="p-6 pt-0 text-secondary-600 font-medium leading-relaxed">
                                                    {a}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* 7. Related Areas Fallback */}
                {relatedAreas && relatedAreas.length > 0 && (
                    <section className="max-w-container mx-auto px-4 py-16 md:py-24 border-t border-secondary-100">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-secondary-950">
                                {trans('areas_you_might_like')}
                            </h2>
                            <Link href={localizedPath('/units', locale)} className="text-primary-700 font-bold text-sm flex items-center gap-2 hover:text-primary-900 transition-colors">
                                {trans('explore_all_areas')}
                                <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {relatedAreas.map(rArea => {
                                const rName = isRtl ? rArea.name_ar : rArea.name_en
                                const rImg = rArea.hero_image ? `/storage/${rArea.hero_image}` : (rArea.image_path ? `/storage/${rArea.image_path}` : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80')
                                return (
                                    <Link key={rArea.id} href={`/${locale}/areas/${rArea.slug}`} className="group relative h-64 rounded-3xl overflow-hidden block">
                                        <img src={rImg} alt={rName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 inset-x-0 p-6">
                                            <h3 className="text-white text-xl font-black mb-1">{rName}</h3>
                                            <p className="text-white/80 text-sm font-bold">{rArea.projects_count} {trans('projects')}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    )
}
