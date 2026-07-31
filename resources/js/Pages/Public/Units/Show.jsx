import { usePage, useForm, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'
import AgentCard from '../../../Components/Features/AgentCard'
import SeoHead from '../../../Components/UI/SeoHead'
import { getYouTubeEmbedUrl } from '../../../Utils/youtube'
import { useState, useMemo } from 'react'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23F0F0F0" width="800" height="600"/%3E%3C/svg%3E'

function extractEmbedSrc(value) {
    if (!value) return ''
    const match = value.match(/src\s*=\s*"([^"]+)"/i) || value.match(/src\s*=\s*'([^']+)'/i)
    return match ? match[1] : value
}

export default function UnitShow({ unit, similarUnits }) {
    const { locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [sentSuccess, setSentSuccess] = useState(false)

    const jsonLd = useMemo(() => {
        if (!unit) return null
        return {
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: unit.name,
            description: unit.description,
            url: window.location.href,
            image: unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null),
            offers: {
                '@type': 'Offer',
                price: unit.price,
                priceCurrency: 'EGP',
                availability: 'https://schema.org/InStock',
            },
            ...(unit.area_sqm ? {
                floorSize: {
                    '@type': 'QuantitativeValue',
                    value: unit.area_sqm,
                    unitCode: 'MTK',
                },
            } : {}),
            numberOfRooms: unit.rooms,
            numberOfBathroomsTotal: unit.bathrooms,
            floorLevel: unit.floor,
            ...(unit.location_address ? {
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: unit.location_address,
                },
            } : {}),
        }
    }, [unit])

    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        content: '',
    })

    const images = unit?.images ?? []
    const selectedImage = images[activeImageIndex] || images[0]
    const thumbnail = selectedImage?.url || (selectedImage?.path ? (selectedImage.path.startsWith('http') || selectedImage.path.startsWith('/') ? selectedImage.path : `/storage/${selectedImage.path}`) : PLACEHOLDER)

    function handleSubmit(e) {
        e.preventDefault()
        const submitUrl = window.location.pathname.startsWith('/en') ? `/en/units/${unit.slug}/contact` : `/units/${unit.slug}/contact`
        post(submitUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setData({ client_name: '', client_phone: '', client_email: '', content: '' })
                setSentSuccess(true)
                setTimeout(() => setSentSuccess(false), 7000)
            },
        })
    }

    const embedUrl = getYouTubeEmbedUrl(unit?.video_url)

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${unit?.name || ''} - ${trans('site_title')}`}
                description={unit?.meta_description || unit?.description || ''}
                keywords={unit?.keywords || ''}
                ogImage={unit?.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null}
                ogType="website"
                canonical={window.location.href}
            />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <Header />

            <main className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                {!unit ? (
                    <div className="text-center py-16">
                        <p className="text-muted text-sm">{trans('no_results')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Gallery */}
                            <div className="bg-white rounded-xl shadow-card overflow-hidden relative group">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={thumbnail}
                                        alt={unit.alt_text || unit.name}
                                        className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                                    />

                                    {/* Zoom / Expand Button */}
                                    <button
                                        type="button"
                                        onClick={() => setLightboxIndex(activeImageIndex)}
                                        className="absolute top-4 end-4 bg-black/60 hover:bg-black/85 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium hover:scale-105 z-10"
                                        title={trans('zoom') || 'تكبير الصورة'}
                                        aria-label="Zoom image"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                        </svg>
                                        <span>{trans('zoom') || (isRtl ? 'تكبير' : 'Zoom')}</span>
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
                                                {activeImageIndex + 1} / {images.length}
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
                                                className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${
                                                    i === activeImageIndex ? 'border-primary-900 ring-2 ring-primary-900/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:border-secondary-300'
                                                }`}
                                                onClick={() => setActiveImageIndex(i)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video */}
                            {unit.video_url && (
                                <div className="bg-white rounded-xl shadow-card overflow-hidden aspect-video">
                                    {embedUrl ? (
                                        <iframe
                                            src={embedUrl}
                                            title={unit.name}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : unit.video_path ? (
                                        <video controls className="w-full h-full">
                                            <source src={unit.video_path} />
                                        </video>
                                    ) : (
                                        <a href={unit.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-primary-900">
                                            {trans('watch_video')}
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Unit Details */}
                            <div className="bg-white rounded-xl shadow-card p-6">
                                <h1 className="text-2xl font-bold text-secondary-950 mb-2">{unit.name}</h1>
                                <p className="text-sm text-muted mb-4">
                                    {(locale === 'ar' ? unit.area?.name_ar : unit.area?.name_en) || ''}
                                    {unit.type ? ` · ${locale === 'ar' ? unit.type.name_ar : unit.type.name_en}` : ''}
                                </p>

                                <p className="text-3xl font-bold text-primary-900 mb-6">
                                    {Number(unit.price).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                                    <span className="text-base text-muted font-normal me-2">
                                        {trans(unit.transaction === 'rent' ? 'rent' : 'sale', {}, 'units')}
                                    </span>
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {unit.payment_method && (
                                        <span className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200">
                                            {trans(unit.payment_method)}
                                        </span>
                                    )}
                                    {unit.finishingType && (
                                        <span className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200">
                                            {locale === 'ar' ? unit.finishingType.name_ar : unit.finishingType.name_en}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    {unit.area_sqm && (
                                        <div className="text-center p-3 bg-surface rounded-lg">
                                            <p className="text-lg font-bold text-secondary-950">{unit.area_sqm}</p>
                                            <p className="text-xs text-muted">{trans('area_sqm', {}, 'units')}</p>
                                        </div>
                                    )}
                                    {unit.rooms && (
                                        <div className="text-center p-3 bg-surface rounded-lg">
                                            <p className="text-lg font-bold text-secondary-950">{unit.rooms}</p>
                                            <p className="text-xs text-muted">{trans('rooms', {}, 'units')}</p>
                                        </div>
                                    )}
                                    {unit.bathrooms && (
                                        <div className="text-center p-3 bg-surface rounded-lg">
                                            <p className="text-lg font-bold text-secondary-950">{unit.bathrooms}</p>
                                            <p className="text-xs text-muted">{trans('bathrooms', {}, 'units')}</p>
                                        </div>
                                    )}
                                    {unit.floor !== null && unit.floor !== undefined && (
                                        <div className="text-center p-3 bg-surface rounded-lg">
                                            <p className="text-lg font-bold text-secondary-950">{unit.floor}</p>
                                            <p className="text-xs text-muted">{trans('floor', {}, 'units')}</p>
                                        </div>
                                    )}
                                </div>

                                {(() => {
                                    const desc = locale === 'ar'
                                        ? (unit.description_ar || unit.description)
                                        : (unit.description_en || unit.description)
                                    return desc ? (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-semibold text-secondary-950 mb-2">{trans('description', {}, 'units')}</h2>
                                            <p className="text-sm text-secondary-800 leading-relaxed whitespace-pre-line">{desc}</p>
                                        </div>
                                    ) : null
                                })()}

                                {/* Payment Details (if installment) */}
                                {['installment', 'both'].includes(unit.payment_method) && (unit.down_payment || unit.installment_years) && (
                                    <div className="mb-6 bg-surface p-4 rounded-xl border border-secondary-100">
                                        <h2 className="text-lg font-semibold text-secondary-950 mb-3">{trans('payment_details') || 'Payment Details'}</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {unit.down_payment && (
                                                <div>
                                                    <p className="text-xs text-muted mb-1">{trans('down_payment') || 'Down Payment'}</p>
                                                    <p className="text-sm font-bold text-secondary-950">{!isNaN(unit.down_payment) && !isNaN(parseFloat(unit.down_payment)) ? Number(unit.down_payment).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US') : unit.down_payment}</p>
                                                </div>
                                            )}
                                            {unit.installment_years && (
                                                <div>
                                                    <p className="text-xs text-muted mb-1">{trans('installment_years') || 'Installment Years'}</p>
                                                    <p className="text-sm font-bold text-secondary-950">{unit.installment_years}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                {unit.features?.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-secondary-950 mb-3">{trans('features') || 'Features'}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {unit.features.map(feature => (
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
                                {unit.map_embed_url && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-secondary-950 mb-2">{trans('location', {}, 'units')}</h2>
                                        {unit.location_address && (
                                            <p className="text-sm text-muted mb-2">{unit.location_address}</p>
                                        )}
                                        <iframe
                                            src={extractEmbedSrc(unit.map_embed_url)}
                                            className="w-full aspect-video rounded-lg"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Google Maps"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Agent */}
                            {unit.user && (
                                <AgentCard agent={{
                                    id: unit.user.id,
                                    name: unit.user.name,
                                    avatar: unit.user.profile?.avatar,
                                    phone: unit.user.profile?.phone,
                                    whatsapp: unit.user.profile?.whatsapp,
                                    facebook: unit.user.profile?.facebook,
                                }} />
                            )}

                            {/* Contact Form */}
                            <div className="bg-white rounded-xl shadow-card p-6">
                                <h3 className="text-lg font-semibold text-secondary-950 mb-4">{trans('contact_agent', {}, 'units')}</h3>
                                
                                {(sentSuccess || flash?.success) && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium transition-all">
                                        {flash?.success || (isRtl ? 'تم إرسال رسالتك بنجاح، وسيتواصل معك المستشار العقاري قريباً.' : 'Your message has been sent successfully! The agent will contact you soon.')}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('your_name', {}, 'messages')}</label>
                                        <input
                                            type="text"
                                            value={data.client_name}
                                            onChange={e => setData('client_name', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                        />
                                        {errors.client_name && <p className="text-xs text-error mt-1">{errors.client_name}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('your_phone', {}, 'messages')}</label>
                                        <input
                                            type="tel"
                                            value={data.client_phone}
                                            onChange={e => setData('client_phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('your_email', {}, 'messages')}</label>
                                        <input
                                            type="email"
                                            value={data.client_email}
                                            onChange={e => setData('client_email', e.target.value)}
                                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('your_message', {}, 'messages')}</label>
                                        <textarea
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            required
                                            rows={4}
                                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                        />
                                        {errors.content && <p className="text-xs text-error mt-1">{errors.content}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-4 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? trans('loading', {}, 'common') : trans('send_message', {}, 'messages')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Similar Units */}
                {similarUnits?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-xl font-bold text-secondary-950 mb-6">{trans('similar_units', {}, 'units')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarUnits.map(u => (
                                <UnitCard key={u.id} unit={u} />
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
