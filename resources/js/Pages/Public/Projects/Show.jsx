import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'

function extractEmbedSrc(value) {
    if (!value || typeof value !== 'string') return ''
    const match = value.match(/src\s*=\s*"([^"]+)"/i) || value.match(/src\s*=\s*'([^']+)'/i)
    if (match) return match[1]
    if (value.includes('<iframe')) return ''
    if (value.startsWith('http')) return value
    return ''
}
import AgentCard from '../../../Components/Features/AgentCard'
import SeoHead from '../../../Components/UI/SeoHead'
import { getYouTubeEmbedUrl } from '../../../Utils/youtube'
import { useState, useMemo } from 'react'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23F0F0F0" width="800" height="600"/%3E%3C/svg%3E'

export default function ProjectShow({ project }) {
    const page = usePage()
    const { locale, appUrl } = page.props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const [activeImageIndex, setActiveImageIndex] = useState(null)

    const images = project?.images ?? []
    const units = project?.units ?? []
    const mainImage = images.find(img => img.is_main || img.is_primary) || images[0]
    const mainImageIndex = Math.max(images.indexOf(mainImage), 0)
    const selectedImageIndex = activeImageIndex ?? mainImageIndex
    const selectedImage = images[selectedImageIndex] || mainImage
    const thumbnail = selectedImage?.url || (selectedImage?.path ? (selectedImage.path.startsWith('http') || selectedImage.path.startsWith('/') ? selectedImage.path : `/storage/${selectedImage.path}`) : PLACEHOLDER)

    const jsonLd = useMemo(() => {
        if (!project) return null
        const image = mainImage?.url || (mainImage?.path ? `/storage/${mainImage.path}` : null);
        return {
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            ...(project.name ? { name: project.name } : {}),
            ...(project.description ? { description: project.description } : {}),
            url: `${appUrl || ''}${page.url.split('?')[0]}`,
            ...(image ? { image } : {}),
            numberOfUnits: project.units?.length || 0,
            ...(project.location_address ? {
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: project.location_address,
                },
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
                keywords={project?.keywords || ''}
                ogImage={mainImage?.url || (mainImage?.path ? `/storage/${mainImage.path}` : null)}
                ogType="website"
            />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
                />
            )}
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 w-full space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gallery */}
                        <div className="bg-white rounded-xl shadow-card overflow-hidden relative group">
                            <div className="relative overflow-hidden">
                                <img
                                    src={thumbnail}
                                    alt={project.alt_text || project.name}
                                    width={1200}
                                    height={900}
                                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                                    fetchPriority="high"
                                    loading="eager"
                                    decoding="sync"
                                />

                                {/* Zoom / Expand Button */}
                                <button
                                    type="button"
                                    onClick={() => setLightboxIndex(selectedImageIndex)}
                                    className="absolute top-4 end-4 bg-black/60 hover:bg-black/85 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium hover:scale-105 z-10"
                                    title={trans('zoom') || 'تكبير الصورة'}
                                    aria-label="Zoom image"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                    </svg>
                                    <span>{trans('zoom')}</span>
                                </button>

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
                                            }}
                                            className="absolute start-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10"
                                            aria-label="Previous image"
                                        >
                                            <svg className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
                                            }}
                                            className="absolute end-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10"
                                            aria-label="Next image"
                                        >
                                            <svg className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>

                                        {/* Image Counter Badge */}
                                        <div className="absolute bottom-4 start-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium z-10">
                                            {selectedImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50 border-t border-secondary-100">
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img.thumb_url || img.url || (img.path?.startsWith('http') || img.path?.startsWith('/') ? img.path : `/storage/${img.path}`)}
                                            alt={img.alt_text || ''}
                                            width={80}
                                            height={64}
                                            className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${
                                                i === selectedImageIndex ? 'border-primary-900 ring-2 ring-primary-900/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:border-secondary-300'
                                            }`}
                                            loading="lazy"
                                            onClick={() => setActiveImageIndex(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video */}
                        {project.video_url && (() => {
                            const embedUrl = getYouTubeEmbedUrl(project.video_url)
                            return (
                                <div className="bg-white rounded-xl shadow-card overflow-hidden aspect-video">
                                    {embedUrl ? (
                                        <iframe
                                            src={embedUrl}
                                            title={project.name}
                                            className="w-full h-full"
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-primary-900">
                                            {trans('watch_video')}
                                        </a>
                                    )}
                                </div>
                            )
                        })()}

                        {/* Project Details */}
                        <div className="bg-white rounded-xl shadow-card p-6">
                            <h1 className="text-2xl font-bold text-secondary-950 mb-2">{project.name}</h1>
                            <p className="text-sm text-muted mb-4">
                                {project.area?.name || ''}
                                {units.length > 0 && (
                                    <span> · {units.length} {trans('units_count') || trans('plural')}</span>
                                )}
                            </p>

                            {project.description && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-secondary-950 mb-2">{trans('description', {}, 'projects')}</h2>
                                    <p className="text-sm text-secondary-800 leading-relaxed whitespace-pre-line">{project.description}</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.payment_method && (
                                    <span className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200">
                                        {trans(project.payment_method)}
                                    </span>
                                )}
                                {project.finishingType && (
                                    <span className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200">
                                        {locale === 'ar' ? project.finishingType.name_ar : project.finishingType.name_en}
                                    </span>
                                )}
                            </div>

                            {/* Payment Details (if installment) */}
                            {['installment', 'both'].includes(project.payment_method) && (project.down_payment || project.installment_years) && (
                                <div className="mb-6 bg-surface p-4 rounded-xl border border-secondary-100">
                                    <h2 className="text-lg font-semibold text-secondary-950 mb-3">{trans('payment_details') || 'Payment Details'}</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {project.down_payment && (
                                            <div>
                                                <p className="text-xs text-muted mb-1">{trans('down_payment') || 'Down Payment'}</p>
                                                <p className="text-sm font-bold text-secondary-950">{!isNaN(project.down_payment) && !isNaN(parseFloat(project.down_payment)) ? Number(project.down_payment).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US') : project.down_payment}</p>
                                            </div>
                                        )}
                                        {project.installment_years && (
                                            <div>
                                                <p className="text-xs text-muted mb-1">{trans('installment_years') || 'Installment Years'}</p>
                                                <p className="text-sm font-bold text-secondary-950">{project.installment_years}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            {project.features?.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-secondary-950 mb-3">{trans('features') || 'Features'}</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {project.features.map(feature => (
                                            <div key={feature.id} className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-secondary-800">{locale === 'ar' ? feature.name_ar : feature.name_en}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {(project.latitude && project.longitude && project.latitude != '0' && project.longitude != '0') || project.map_embed_url ? (
                                <div className="mt-8 pt-6 border-t border-secondary-100">
                                    <h2 className="text-lg font-semibold text-secondary-950 mb-4">{trans('location', {}, 'projects')}</h2>
                                    {project.location_address && (
                                        <p className="text-sm text-muted mb-4">{project.location_address}</p>
                                    )}
                                    
                                    {(project.latitude && project.longitude && project.latitude != '0' && project.longitude != '0') ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${project.latitude},${project.longitude}&hl=${locale}&z=14&output=embed`}
                                            className="w-full aspect-video rounded-xl border border-secondary-200 shadow-sm"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Google Maps Location"
                                        />
                                    ) : (
                                        project.map_embed_url && (
                                            (() => {
                                                const src = extractEmbedSrc(project.map_embed_url)
                                                if (!src) return null
                                                if (src.includes('google.com/maps/embed') || src.includes('output=embed')) {
                                                    return (
                                                        <iframe
                                                            src={src}
                                                            className="w-full aspect-video rounded-xl border border-secondary-200 shadow-sm"
                                                            allowFullScreen
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                            title="Google Maps Location"
                                                        />
                                                    )
                                                }
                                                return (
                                                    <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 text-secondary-900 rounded-lg hover:bg-secondary-100 transition-colors border border-secondary-200">
                                                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{trans('view_on_map', {}, 'projects') || 'عرض على الخريطة'}</span>
                                                    </a>
                                                )
                                            })()
                                        )
                                    )}
                                </div>
                            ) : null}
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div>
                        {project.user && (
                            <AgentCard agent={project.user} />
                        )}
                    </div>
                </div>

                {/* Units in Project Full Width Section */}
                {units.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-card p-6 sm:p-8 border border-secondary-100/80 mt-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-secondary-950">{trans('units_in_project', {}, 'projects')}</h2>
                                <p className="text-sm text-muted mt-1">{project.name}</p>
                            </div>
                            <span className="px-4 py-1.5 bg-primary-50 text-primary-900 text-sm font-semibold rounded-full border border-primary-100">
                                {units.length} {trans('units_count')}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {units.map(unit => (
                                <UnitCard key={unit.id} unit={unit} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Lightbox */}
            {lightboxIndex !== null && images.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 end-4 text-white text-2xl"
                        aria-label={trans('close')}
                    >
                        ✕
                    </button>
                    <img
                        src={images[lightboxIndex]?.url || (images[lightboxIndex]?.path?.startsWith('http') || images[lightboxIndex]?.path?.startsWith('/') ? images[lightboxIndex]?.path : `/storage/${images[lightboxIndex]?.path}`)}
                        alt=""
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                        onClick={e => e.stopPropagation()}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`}
                                aria-label={trans('previous')}
                            >
                                <svg className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`}
                                aria-label={trans('next')}
                            >
                                <svg className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 flex gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                                    aria-label={isRtl ? `صورة ${i + 1}` : `Image ${i + 1}`}
                                    className={`w-3 h-3 rounded-full ${
                                        i === lightboxIndex ? 'bg-white' : 'bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Footer />
        </div>
    )
}
