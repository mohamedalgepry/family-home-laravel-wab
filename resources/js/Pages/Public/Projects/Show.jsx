import { usePage, Link } from '@inertiajs/react'
import { localizedPath } from '../../../Utils/route'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'
import ProjectCard from '../../../Components/UI/ProjectCard'
import ArticleCard from '../../../Components/UI/ArticleCard'
import AgentCard from '../../../Components/Features/AgentCard'
import SeoHead from '../../../Components/UI/SeoHead'
import { getYouTubeEmbedUrl } from '../../../Utils/youtube'
import { getStorageUrl, PLACEHOLDER } from '../../../Utils/image'
import { getAgentContacts } from '../../../Utils/contact'
import { WhatsAppIcon } from '../../../Components/UI'
import { useState, useMemo } from 'react'

export default function ProjectShow({ project, projectUnits, similarProjects, relatedArticles }) {
    const page = usePage()
    const { locale, appUrl } = page.props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const [activeImageIndex, setActiveImageIndex] = useState(null)
    const embedUrl = getYouTubeEmbedUrl(project?.video_url)
    const agentContacts = getAgentContacts(project?.user, page.props.settings)

    const images = project?.images ?? []
    const projectUnitsList = Array.isArray(projectUnits)
        ? projectUnits
        : (Array.isArray(projectUnits?.data) ? projectUnits.data : (Array.isArray(project?.units) ? project.units : (Array.isArray(project?.units?.data) ? project.units.data : [])))
    const similarProjectsList = Array.isArray(similarProjects) ? similarProjects : (Array.isArray(similarProjects?.data) ? similarProjects.data : [])
    const relatedArticlesList = Array.isArray(relatedArticles) ? relatedArticles : (Array.isArray(relatedArticles?.data) ? relatedArticles.data : [])

    const mainImage = images.find(img => img.is_main || img.is_primary) || images[0]
    const mainImageIndex = Math.max(images.indexOf(mainImage), 0)
    const selectedImageIndex = activeImageIndex ?? mainImageIndex
    const selectedImage = images[selectedImageIndex] || mainImage
    const thumbnail = getStorageUrl(selectedImage?.url || selectedImage?.path, PLACEHOLDER)

    const jsonLd = useMemo(() => {
        if (!project) return null
        const image = getStorageUrl(mainImage?.url || mainImage?.path, null);
        const lat = project.latitude
        const lng = project.longitude
        const hasValidCoords = lat && lng && parseFloat(lat) !== 0 && parseFloat(lng) !== 0 &&
            isFinite(parseFloat(lat)) && isFinite(parseFloat(lng))
        return {
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            ...(project.name ? { name: project.name } : {}),
            ...(project.description ? { description: project.description } : {}),
            url: `${appUrl || ''}${page.url.split('?')[0]}`,
            ...(image ? { image } : {}),
            numberOfUnits: project.units?.length || 0,
            ...(hasValidCoords || project.location_address ? {
                contentLocation: {
                    '@type': 'Place',
                    ...(project.name ? { name: project.name } : {}),
                    ...(project.location_address ? {
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: project.location_address,
                        },
                    } : {}),
                    ...(hasValidCoords ? {
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: lat,
                            longitude: lng,
                        },
                    } : {}),
                }
            } : {}),
        }
    }, [project, mainImage, appUrl, page.url])

    if (!project) {
        return (
            <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-muted text-sm">{trans('no_projects') || trans('no_results')}</p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${project?.name || ''} - ${trans('site_title')}`}
                description={project?.meta_description || project?.description || ''}
                keywords={isRtl ? (project?.keywords_ar || project?.keywords) : (project?.keywords_en || project?.keywords || project?.keywords_ar)}
                ogImage={mainImage?.url || (mainImage?.path ? `/storage/${mainImage.path}` : null)}
                ogType="website"
                jsonLd={jsonLd}
            />
            <Header />

            <main id="main-content" className="flex-1 max-w-container mx-auto px-4 py-6 md:py-8 w-full pb-28 md:pb-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-medium text-secondary-500 mb-5 overflow-x-auto pb-1" aria-label="Breadcrumb">
                    <Link href={localizedPath('/', locale)} className="hover:text-primary-900 transition-colors shrink-0">
                        {trans('home')}
                    </Link>
                    <span>/</span>
                    <Link href={localizedPath('/projects', locale)} className="hover:text-primary-900 transition-colors shrink-0">
                        {trans('projects')}
                    </Link>
                    {project.area?.name && (
                        <>
                            <span>/</span>
                            <Link href={localizedPath(`/areas/${project.area.slug || project.area.id}`, locale)} className="hover:text-primary-900 transition-colors shrink-0">
                                {project.area.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-secondary-900 font-bold truncate max-w-[200px] sm:max-w-xs">
                        {project.name}
                    </span>
                </nav>

                {/* Top Main Section (Gallery + Project Summary Card) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start mb-8">
                    {/* Visual Gallery Column (7 cols desktop) */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden relative group">
                            <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
                                <img
                                    src={thumbnail}
                                    alt={project.alt_text || project.name}
                                    width={1200}
                                    height={900}
                                    className="w-full h-full object-cover"
                                    fetchPriority="high"
                                    loading="eager"
                                    decoding="sync"
                                />

                                {/* Status Tag */}
                                <div className="absolute top-4 start-4 z-10">
                                    <span className="bg-[#CC0000] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                                        {isRtl ? 'مشروع عقاري' : 'Project'}
                                    </span>
                                </div>

                                {/* Floating Share Button */}
                                <div className="absolute top-4 end-4 flex items-center gap-2 z-10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({ title: project.name, url: window.location.href }).catch(() => {})
                                            } else {
                                                navigator.clipboard.writeText(window.location.href)
                                                alert(isRtl ? 'تم نسخ رابط الصفحة' : 'Link copied')
                                            }
                                        }}
                                        className="w-9 h-9 bg-white/90 hover:bg-white text-secondary-800 rounded-full shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
                                        title={isRtl ? 'مشاركة' : 'Share'}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0 10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Show All Photos Button Overlay */}
                                <div className="absolute bottom-4 start-4 flex items-center gap-2 z-10 flex-wrap">
                                    <span className="bg-black/60 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-white/20">
                                        {selectedImageIndex + 1} / {images.length || 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setLightboxIndex(selectedImageIndex)}
                                        className="bg-white/90 hover:bg-white text-secondary-950 px-3.5 py-1.5 rounded-xl shadow-md backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold border border-secondary-200"
                                    >
                                        <svg className="w-4 h-4 text-secondary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                        </svg>
                                        <span>{isRtl ? 'عرض جميع الصور' : 'View All Photos'}</span>
                                    </button>
                                </div>

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
                                            }}
                                            className="absolute start-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-colors z-10"
                                            aria-label={trans('previous_image') || 'Previous image'}
                                        >
                                            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
                                            }}
                                            className="absolute end-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-colors z-10"
                                            aria-label={trans('next_image') || 'Next image'}
                                        >
                                            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-5 gap-2 p-3 bg-surface border-t border-secondary-100">
                                    {images.slice(0, 5).map((img, i) => {
                                        const isLastAndMore = i === 4 && images.length > 5
                                        const remainingCount = images.length - 4
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    if (isLastAndMore) {
                                                        setLightboxIndex(4)
                                                    } else {
                                                        setActiveImageIndex(i)
                                                    }
                                                }}
                                                className="relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3] border border-secondary-200"
                                            >
                                                <img
                                                    src={getStorageUrl(img.thumb_url || img.url || img.path, PLACEHOLDER)}
                                                    alt={img.alt_text || ''}
                                                    className={`w-full h-full object-cover transition-transform ${i === selectedImageIndex ? 'ring-2 ring-[#CC0000]' : 'opacity-80 hover:opacity-100'}`}
                                                    loading="lazy"
                                                />
                                                {isLastAndMore && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                                                        +{remainingCount}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary & Key Action Card Column (5 cols desktop) */}
                    <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-6">
                        <div>
                            <div className="inline-block px-3 py-1 bg-surface rounded-full border border-secondary-200 text-xs font-bold text-secondary-700 mb-3">
                                {isRtl ? 'مشروع متميز' : 'Featured Project'}
                            </div>
                            <h1 className="text-2xl font-black text-secondary-950 leading-snug mb-2">
                                {project.name}
                            </h1>
                            <p className="text-xs font-semibold text-secondary-500 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-secondary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span>{project.area?.name || project.location_address || ''}</span>
                            </p>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <a
                                href={`https://wa.me/${agentContacts.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 px-4 bg-[#CC0000] hover:bg-[#b30000] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>{isRtl ? 'تواصل مع الوكيل' : 'Contact Agent'}</span>
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: project.name, url: window.location.href }).catch(() => {})
                                    } else {
                                        navigator.clipboard.writeText(window.location.href)
                                        alert(isRtl ? 'تم نسخ رابط الصفحة' : 'Link copied')
                                    }
                                }}
                                className="w-full py-3 px-4 bg-white border border-secondary-200 hover:bg-surface text-secondary-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                            >
                                <svg className="w-4 h-4 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0 10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                                </svg>
                                <span>{isRtl ? 'مشاركة' : 'Share'}</span>
                            </button>
                        </div>

                        {/* Quick Specs Box Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 bg-surface rounded-xl border border-secondary-100 text-center">
                                <span className="text-secondary-500 text-xs font-semibold block mb-1">{isRtl ? 'عدد الوحدات' : 'Units'}</span>
                                <p className="text-base font-black text-secondary-950">{project.units_count ?? units.length} {isRtl ? 'وحدة' : 'Units'}</p>
                            </div>

                            <div className="p-3 bg-surface rounded-xl border border-secondary-100 text-center">
                                <span className="text-secondary-500 text-xs font-semibold block mb-1">{isRtl ? 'نوع التشطيب' : 'Finishing'}</span>
                                <p className="text-sm font-black text-secondary-950">
                                    {project.finishingType ? (locale === 'ar' ? project.finishingType.name_ar : project.finishingType.name_en) : (isRtl ? 'سوبر لوكس' : 'Super Lux')}
                                </p>
                            </div>
                        </div>

                        {/* Agent Info Snippet inside Top Summary Card */}
                        <div className="pt-4 border-t border-secondary-100">
                            <div className="flex items-center justify-between gap-3">
                                {project.user ? (
                                    <Link
                                        href={localizedPath(`/agents/${project.user.slug || project.user.id}`, locale)}
                                        className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-opacity hover:opacity-85"
                                        title={project.user.name}
                                    >
                                        {project.user.avatar ? (
                                            <img
                                                src={getStorageUrl(project.user.avatar, null)}
                                                alt={project.user.name}
                                                className="w-10 h-10 rounded-full object-cover border border-secondary-200 shrink-0 group-hover:border-primary-500 transition-colors"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-900 font-bold text-xs shrink-0 group-hover:bg-primary-200 transition-colors">
                                                {project.user.name ? project.user.name.charAt(0).toUpperCase() : (isRtl ? 'أ' : 'A')}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-secondary-950 truncate group-hover:text-primary-900 transition-colors">
                                                {project.user.name}
                                            </h4>
                                            <p className="text-[11px] text-secondary-500 font-medium truncate">
                                                {isRtl ? 'مستشار عقاري' : 'Real Estate Advisor'}
                                            </p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-900 font-bold text-xs shrink-0">
                                            {isRtl ? 'ف' : 'F'}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-secondary-950 truncate">
                                                {trans('company_name') || (isRtl ? 'فاميلي هوم' : 'Family Home')}
                                            </h4>
                                            <p className="text-[11px] text-secondary-500 font-medium truncate">
                                                {isRtl ? 'مستشار عقاري' : 'Real Estate Advisor'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <a
                                        href={`https://wa.me/${agentContacts.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                                        title="WhatsApp"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                    </a>

                                    <a
                                        href={`tel:${agentContacts.phone}`}
                                        className="w-8 h-8 rounded-lg bg-surface text-secondary-800 border border-secondary-200 flex items-center justify-center hover:bg-secondary-200 transition-colors"
                                        title="Call"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Anchor Navigation Tabs Bar (Desktop) */}
                <div className="hidden md:flex items-center gap-8 border-b border-secondary-200 mb-8 overflow-x-auto text-xs font-bold text-secondary-600">
                    <a href="#overview" className="py-3 text-[#CC0000] border-b-2 border-[#CC0000] transition-colors">{isRtl ? 'تفاصيل المشروع' : 'Overview'}</a>
                    {embedUrl && <a href="#video" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'الفيديو التعريفي' : 'Video'}</a>}
                    <a href="#features" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'المميزات والمرافق' : 'Features'}</a>
                    <a href="#units-list" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'الوحدات المتاحة' : 'Units'}</a>
                    <a href="#location" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'الموقع' : 'Location'}</a>
                </div>

                {/* DESKTOP 2-COLUMN SIDEBAR LAYOUT (lg:grid) */}
                <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
                    {/* Left Content Column (7 cols desktop) */}
                    <div className="col-span-7 space-y-8">
                        {/* Section 1: عن المشروع */}
                        <section id="overview" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                            <h2 className="text-lg font-black text-secondary-950 mb-3">{isRtl ? 'عن المشروع' : 'About Project'}</h2>
                            <p className="text-sm text-secondary-700 leading-relaxed whitespace-pre-line font-normal">
                                {project.description || (isRtl ? 'مشروع عقاري متميز يضم وحدات سكنية وتجارية مصممة بأعلى معايير الجودة والتصميم العصري مع توفير كافة الخدمات والمرافق الأساسية والترفيهية.' : 'A premier real estate development with luxury residential and commercial units.')}
                            </p>

                            {/* Payment details if any */}
                            {['installment', 'both'].includes(project.payment_method) && (project.down_payment || project.installment_years) && (
                                <div className="mt-6 pt-4 border-t border-secondary-100">
                                    <h2 className="text-xs font-bold text-secondary-900 mb-3">{isRtl ? 'أنظمة الدفع والتسهيلات' : 'Payment Terms'}</h2>
                                    <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-secondary-100 text-xs">
                                        {project.down_payment && (
                                            <div>
                                                <span className="text-secondary-500 font-medium block mb-1">{isRtl ? 'الدفعة الأولى' : 'Down Payment'}</span>
                                                <span className="font-bold text-secondary-950">{!isNaN(project.down_payment) && !isNaN(parseFloat(project.down_payment)) ? Number(project.down_payment).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US') + ' ' + trans('currency_egp') : project.down_payment}</span>
                                            </div>
                                        )}
                                        {project.installment_years && (
                                            <div>
                                                <span className="text-secondary-500 font-medium block mb-1">{isRtl ? 'سنوات التقسيط' : 'Installment Years'}</span>
                                                <span className="font-bold text-secondary-950">{project.installment_years} {isRtl ? 'سنوات' : 'Years'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Section: الفيديو التعريفي (Desktop) */}
                        {embedUrl && (
                            <section id="video" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                                <h2 className="text-lg font-black text-secondary-950 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                    </svg>
                                    <span>{isRtl ? 'الفيديو التعريفي للمشروع' : 'Project Video Tour'}</span>
                                </h2>
                                <div className="rounded-xl overflow-hidden aspect-video border border-secondary-200 shadow-sm bg-black">
                                    <iframe
                                        src={embedUrl}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Project Video Tour"
                                    />
                                </div>
                            </section>
                        )}

                        {/* Section 2: المميزات والمرافق */}
                        <section id="features" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                            <h2 className="text-lg font-black text-secondary-950 mb-4">{isRtl ? 'المميزات والمرافق' : 'Features & Facilities'}</h2>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {(project.features?.length > 0 ? project.features : [
                                    { id: 1, name_ar: 'حمام سباحة', name_en: 'Swimming Pool' },
                                    { id: 2, name_ar: 'مصعد', name_en: 'Elevator' },
                                    { id: 3, name_ar: 'كافيه ورستوران', name_en: 'Cafe & Dining' },
                                    { id: 4, name_ar: 'كاميرات مراقبة', name_en: 'CCTV Security' },
                                    { id: 5, name_ar: 'نادي رياضي', name_en: 'Gym & Spa' },
                                    { id: 6, name_ar: 'موقف سيارات', name_en: 'Parking Garage' },
                                ]).map(feature => (
                                    <div key={feature.id} className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface border border-secondary-100 text-center gap-2 hover:border-secondary-300 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-secondary-100 flex items-center justify-center text-secondary-700">
                                            <svg className="w-4 h-4 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold text-secondary-800">{locale === 'ar' ? feature.name_ar : feature.name_en}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar Column (5 cols desktop, continuous & sticky) */}
                    <div className="col-span-5 space-y-6 sticky top-24">
                        {/* Card 1: معلومات المشروع */}
                        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                            <h2 className="text-sm font-black text-secondary-950 border-b border-secondary-100 pb-3">{isRtl ? 'معلومات المشروع' : 'Project Information'}</h2>

                            <div className="space-y-2.5 text-xs">
                                <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                    <span className="text-secondary-500 font-semibold">{isRtl ? 'اسم المشروع' : 'Project Name'}</span>
                                    <span className="font-bold text-secondary-950">{project.name}</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                    <span className="text-secondary-500 font-semibold">{isRtl ? 'المنطقة' : 'Area'}</span>
                                    <span className="font-bold text-secondary-950">{project.area?.name || ''}</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                    <span className="text-secondary-500 font-semibold">{isRtl ? 'عدد الوحدات' : 'Total Units'}</span>
                                    <span className="font-bold text-secondary-950">{units.length} {isRtl ? 'وحدة' : 'Units'}</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                    <span className="text-secondary-500 font-semibold">{isRtl ? 'سنة التسليم' : 'Delivery Year'}</span>
                                    <span className="font-bold text-secondary-950">2026</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5">
                                    <span className="text-secondary-500 font-semibold">{isRtl ? 'حالة المشروع' : 'Status'}</span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                        {isRtl ? 'متاح للبيع' : 'Available'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: الموقع على الخريطة */}
                        <div id="location" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                            <h2 className="text-sm font-black text-secondary-950">{isRtl ? 'الموقع على الخريطة' : 'Location Map'}</h2>

                            <div className="rounded-xl overflow-hidden border border-secondary-200 aspect-[16/9]">
                                <iframe
                                    src={`https://maps.google.com/maps?q=${project.latitude || '30.0444'},${project.longitude || '31.2357'}&hl=${locale}&z=14&output=embed`}
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map Location"
                                />
                            </div>

                            <div className="text-center pt-1">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${project.latitude || '30.0444'},${project.longitude || '31.2357'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-secondary-800 hover:text-[#CC0000] transition-colors"
                                >
                                    <svg className="w-4 h-4 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <span>{isRtl ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE RE-ORDERED LAYOUT (lg:hidden) */}
                <div className="lg:hidden flex flex-col gap-6">
                    {/* 1. Overview */}
                    <section className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                        <h2 className="text-lg font-black text-secondary-950 mb-3">{isRtl ? 'عن المشروع' : 'About Project'}</h2>
                        <p className="text-sm text-secondary-700 leading-relaxed whitespace-pre-line font-normal">
                            {project.description || (isRtl ? 'مشروع عقاري متميز يضم وحدات سكنية وتجارية مصممة بأعلى معايير الجودة والتصميم العصري مع توفير كافة الخدمات والمرافق الأساسية والترفيهية.' : 'A premier real estate development with luxury residential and commercial units.')}
                        </p>
                    </section>

                    {/* Section: الفيديو التعريفي (Mobile) */}
                    {embedUrl && (
                        <section id="video-mob" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                            <h2 className="text-lg font-black text-secondary-950 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                </svg>
                                <span>{isRtl ? 'الفيديو التعريفي للمشروع' : 'Project Video Tour'}</span>
                            </h2>
                            <div className="rounded-xl overflow-hidden aspect-video border border-secondary-200 shadow-sm bg-black">
                                <iframe
                                    src={embedUrl}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Project Video Tour Mobile"
                                />
                            </div>
                        </section>
                    )}

                    {/* 2. Features */}
                    <section className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                        <h2 className="text-lg font-black text-secondary-950 mb-4">{isRtl ? 'المميزات والمرافق' : 'Features & Facilities'}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(project.features?.length > 0 ? project.features : [
                                { id: 1, name_ar: 'حمام سباحة', name_en: 'Swimming Pool' },
                                { id: 2, name_ar: 'مصعد', name_en: 'Elevator' },
                                { id: 3, name_ar: 'كافيه ورستوران', name_en: 'Cafe & Dining' },
                                { id: 4, name_ar: 'كاميرات مراقبة', name_en: 'CCTV Security' },
                                { id: 5, name_ar: 'نادي رياضي', name_en: 'Gym & Spa' },
                                { id: 6, name_ar: 'موقف سيارات', name_en: 'Parking Garage' },
                            ]).map(feature => (
                                <div key={feature.id} className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface border border-secondary-100 text-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-secondary-100 flex items-center justify-center text-secondary-700">
                                        <svg className="w-4 h-4 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold text-secondary-800">{locale === 'ar' ? feature.name_ar : feature.name_en}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Project Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                        <h2 className="text-sm font-black text-secondary-950 border-b border-secondary-100 pb-3">{isRtl ? 'معلومات المشروع' : 'Project Information'}</h2>
                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                <span className="text-secondary-500 font-semibold">{isRtl ? 'اسم المشروع' : 'Project Name'}</span>
                                <span className="font-bold text-secondary-950">{project.name}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                <span className="text-secondary-500 font-semibold">{isRtl ? 'عدد الوحدات' : 'Total Units'}</span>
                                <span className="font-bold text-secondary-950">{project.units_count ?? units.length} {isRtl ? 'وحدة' : 'Units'}</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Location Map */}
                    <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                        <h2 className="text-sm font-black text-secondary-950">{isRtl ? 'الموقع على الخريطة' : 'Location Map'}</h2>
                        <div className="rounded-xl overflow-hidden border border-secondary-200 aspect-[16/9]">
                            <iframe
                                src={`https://maps.google.com/maps?q=${project.latitude || '30.0444'},${project.longitude || '31.2357'}&hl=${locale}&z=14&output=embed`}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map Location Mobile Project"
                            />
                        </div>
                    </div>
                </div>

                {/* 1. Units inside project grid */}
                {projectUnitsList.length > 0 && (
                    <section id="units-list" className="mt-12 bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-[#CC0000] rounded-full"></div>
                                <h2 className="text-lg md:text-xl font-black text-secondary-950 tracking-tight">
                                    {trans('units_in_project', {}, 'projects') || (isRtl ? 'الوحدات المتاحة بالمشروع' : 'Units in this Project')}
                                </h2>
                            </div>
                            <span className="px-3.5 py-1 bg-surface border border-secondary-200 text-xs font-bold rounded-full text-secondary-800">
                                {project.units_count ?? projectUnitsList.length} {trans('units_count') || (isRtl ? 'وحدة' : 'Units')}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {projectUnitsList.map(unit => (
                                <UnitCard key={unit.id} unit={unit} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. Similar Projects */}
                {similarProjectsList.length > 0 && (
                    <section className="mt-12 bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-[#CC0000] rounded-full"></div>
                                <h2 className="text-lg md:text-xl font-black text-secondary-950 tracking-tight">
                                    {isRtl ? 'مشاريع مشابهة قد تهمك' : 'Similar Projects You May Like'}
                                </h2>
                            </div>
                            <Link
                                href={localizedPath('/projects', locale)}
                                className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1 transition-colors"
                            >
                                <span>{trans('view_all') || (isRtl ? 'عرض كل المشاريع' : 'View All Projects')}</span>
                                <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProjectsList.map(proj => (
                                <ProjectCard key={proj.id} project={proj} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. Related Articles */}
                {relatedArticlesList.length > 0 && (
                    <section className="mt-12 bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-[#CC0000] rounded-full"></div>
                                <h2 className="text-lg md:text-xl font-black text-secondary-950 tracking-tight">
                                    {isRtl ? 'مقالات ودليل المشتري' : 'Real Estate Articles & Guides'}
                                </h2>
                            </div>
                            <Link
                                href={localizedPath('/articles', locale)}
                                className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1 transition-colors"
                            >
                                <span>{trans('view_all') || (isRtl ? 'عرض كل المقالات' : 'View All Articles')}</span>
                                <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedArticlesList.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* DEDICATED MOBILE FLOATING RED ACTION BUTTON FOR PROJECT */}
            {project && (
                <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-secondary-200 p-3 shadow-lg flex items-center justify-between gap-3 md:hidden">
                    <div>
                        <span className="text-[10px] font-bold text-secondary-500 uppercase block">{isRtl ? 'المشروع' : 'Project'}</span>
                        <span className="text-sm font-black text-secondary-950 truncate max-w-[150px] block">
                            {project.name}
                        </span>
                    </div>

                    <a
                        href={`https://wa.me/${(page.props.settings?.company_whatsapp || '201000000000').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#CC0000] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-[#b30000] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span>{isRtl ? 'تواصل مع الوكيل' : 'Contact Agent'}</span>
                    </a>
                </div>
            )}

            {/* Lightbox Modal */}
            {lightboxIndex !== null && images.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 end-4 text-white text-2xl bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black"
                        aria-label={trans('close')}
                    >
                        ✕
                    </button>

                    <img
                        src={getStorageUrl(images[lightboxIndex]?.url || images[lightboxIndex]?.path, PLACEHOLDER)}
                        alt=""
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                        onClick={e => e.stopPropagation()}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} w-11 h-11 min-w-[44px] min-h-[44px] bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`}
                                aria-label={trans('previous_image') || 'Previous image'}
                            >
                                <svg className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} w-11 h-11 min-w-[44px] min-h-[44px] bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`}
                                aria-label={trans('next_image') || 'Next image'}
                            >
                                <svg className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Fixed Mobile Bottom Action Bar */}
            <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-secondary-200 p-3 sm:hidden flex items-center gap-3 shadow-2xl">
                <a
                    href={`https://wa.me/${agentContacts.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors active:scale-98 min-h-[44px]"
                >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                <a
                    href={`tel:${agentContacts.phone}`}
                    className="flex-1 py-3 px-4 bg-[#CC0000] hover:bg-[#b30000] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors active:scale-98 min-h-[44px]"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span>{isRtl ? 'اتصال مباشر' : 'Call Agent'}</span>
                </a>
            </div>

            <Footer />
        </div>
    )
}
