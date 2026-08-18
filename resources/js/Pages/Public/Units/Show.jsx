import { usePage, useForm, Link } from '@inertiajs/react'
import { localizedPath } from '../../../Utils/route'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'
import AgentCard from '../../../Components/Features/AgentCard'
import SeoHead from '../../../Components/UI/SeoHead'
import { getYouTubeEmbedUrl } from '../../../Utils/youtube'
import { getStorageUrl, PLACEHOLDER } from '../../../Utils/image'
import { getAgentContacts } from '../../../Utils/contact'
import { useState, useMemo } from 'react'

export default function UnitShow({ unit, similarUnits }) {
    const page = usePage()
    const { locale, flash, appUrl, seo_meta } = page.props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [lightboxIndex, setLightboxIndex] = useState(null)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [sentSuccess, setSentSuccess] = useState(false)
    const agentContacts = getAgentContacts(unit?.user || unit?.project?.user, page.props.settings)

    const jsonLd = useMemo(() => {
        if (!unit) return null
        
        const image = getStorageUrl(unit.images?.[0]?.url || unit.images?.[0]?.path, null);
        const lat = unit.latitude
        const lng = unit.longitude
        const hasValidCoords = lat && lng && parseFloat(lat) !== 0 && parseFloat(lng) !== 0 &&
            isFinite(parseFloat(lat)) && isFinite(parseFloat(lng))
        
        return {
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            ...(unit.name ? { name: unit.name } : {}),
            ...(unit.description ? { description: unit.description } : {}),
            url: `${appUrl || ''}${page.url.split('?')[0]}`,
            ...(image ? { image } : {}),
            ...(unit.price != null ? {
                offers: {
                    '@type': 'Offer',
                    price: unit.price,
                    priceCurrency: 'EGP',
                    availability: 'https://schema.org/InStock',
                }
            } : {}),
            ...(unit.area_sqm ? {
                floorSize: {
                    '@type': 'QuantitativeValue',
                    value: unit.area_sqm,
                    unitCode: 'MTK',
                },
            } : {}),
            ...(unit.rooms != null ? { numberOfRooms: unit.rooms } : {}),
            ...(unit.bathrooms != null ? { numberOfBathroomsTotal: unit.bathrooms } : {}),
            ...(unit.floor != null ? { floorLevel: unit.floor } : {}),
            ...(hasValidCoords || unit.location_address ? {
                contentLocation: {
                    '@type': 'Place',
                    ...(unit.name ? { name: unit.name } : {}),
                    ...(unit.location_address ? {
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: unit.location_address,
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
    }, [unit, appUrl, page.url])

    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        content: '',
    })

    const images = unit?.images ?? []
    const selectedImage = images[activeImageIndex] || images[0]
    const thumbnail = getStorageUrl(selectedImage?.url || selectedImage?.path, PLACEHOLDER)

    function handleSubmit(e) {
        e.preventDefault()
        const submitUrl = localizedPath(`/units/${unit.slug}/contact`, locale)
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
                keywords={isRtl ? (unit?.keywords_ar || unit?.keywords) : (unit?.keywords_en || unit?.keywords || unit?.keywords_ar)}
                ogImage={unit?.images?.find(img => img.is_main || img.is_primary)?.url || unit?.images?.[0]?.url || null}
                ogType={seo_meta?.og_type || 'article'}
                jsonLd={jsonLd}
            />
            <Header />

            <main id="main-content" className="flex-1 max-w-container mx-auto px-4 py-6 md:py-8 w-full pb-28 md:pb-12">
                {!unit ? (
                    <div className="text-center py-16">
                        <p className="text-muted text-sm">{trans('no_results')}</p>
                    </div>
                ) : (
                    <>
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs font-medium text-secondary-500 mb-5 overflow-x-auto pb-1" aria-label="Breadcrumb">
                            <Link href={localizedPath('/', locale)} className="hover:text-primary-900 transition-colors shrink-0">
                                {trans('home')}
                            </Link>
                            <span>/</span>
                            <Link href={localizedPath('/units', locale)} className="hover:text-primary-900 transition-colors shrink-0">
                                {trans('units')}
                            </Link>
                            {unit.area?.name && (
                                <>
                                    <span>/</span>
                                    <Link href={localizedPath(`/areas/${unit.area.slug || unit.area.id}`, locale)} className="hover:text-primary-900 transition-colors shrink-0">
                                        {unit.area.name}
                                    </Link>
                                </>
                            )}
                            <span>/</span>
                            <span className="text-secondary-900 font-bold truncate max-w-[200px] sm:max-w-xs">
                                {unit.name}
                            </span>
                        </nav>

                        {/* Top Main Section (Gallery + Summary Card) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start mb-8">
                            {/* Visual Gallery Column (7 cols desktop) */}
                            <div className="lg:col-span-7 space-y-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden relative group">
                                    <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
                                        <img
                                            src={thumbnail}
                                            alt={unit.alt_text || unit.name}
                                            width={1200}
                                            height={900}
                                            className="w-full h-full object-cover"
                                            fetchPriority="high"
                                            loading="eager"
                                            decoding="sync"
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-4 start-4 z-10">
                                            <span className="bg-[#CC0000] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                                                {trans(unit.transaction === 'rent' ? 'rent' : 'sale')}
                                            </span>
                                        </div>

                                        {/* Floating Action Buttons on Photo (Mobile & Desktop) */}
                                        <div className="absolute top-4 end-4 flex items-center gap-2 z-10">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({ title: unit.name, url: window.location.href }).catch(() => {})
                                                    } else {
                                                        navigator.clipboard.writeText(window.location.href)
                                                        alert(isRtl ? 'تم نسخ رابط الصفحة' : 'Link copied to clipboard')
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

                                        {/* Show All Photos & Video Buttons Overlay */}
                                        <div className="absolute bottom-4 start-4 flex items-center gap-2 z-10 flex-wrap">
                                            <span className="bg-black/60 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-white/20">
                                                {activeImageIndex + 1} / {images.length || 1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => setLightboxIndex(activeImageIndex)}
                                                className="bg-white/90 hover:bg-white text-secondary-950 px-3.5 py-1.5 rounded-xl shadow-md backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold border border-secondary-200"
                                            >
                                                <svg className="w-4 h-4 text-secondary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                </svg>
                                                <span>{isRtl ? 'عرض جميع الصور' : 'View All Photos'}</span>
                                            </button>

                                            {embedUrl && (
                                                <a
                                                    href="#video"
                                                    className="bg-[#CC0000] hover:bg-[#b30000] text-white px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs font-bold border border-red-700"
                                                >
                                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                    <span>{isRtl ? 'فيديو الوحدة' : 'Watch Video'}</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Navigation Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveImageIndex(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1);
                                                    }}
                                                    className="absolute start-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all z-10"
                                                    aria-label="Previous image"
                                                >
                                                    <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                    </svg>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveImageIndex(activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1);
                                                    }}
                                                    className="absolute end-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all z-10"
                                                    aria-label="Next image"
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
                                                            src={img.thumb_url || img.url || (img.path?.startsWith('http') || img.path?.startsWith('/') ? img.path : `/storage/${img.path}`)}
                                                            alt={img.alt_text || ''}
                                                            className={`w-full h-full object-cover transition-transform ${i === activeImageIndex ? 'ring-2 ring-[#CC0000]' : 'opacity-80 hover:opacity-100'}`}
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
                                        {unit.type ? (locale === 'ar' ? unit.type.name_ar : unit.type.name_en) : (isRtl ? 'شقة' : 'Apartment')}
                                    </div>
                                    <h1 className="text-2xl font-black text-secondary-950 leading-snug mb-2">
                                        {unit.name}
                                    </h1>
                                    <p className="text-xs font-semibold text-secondary-500 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-secondary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <span>{(locale === 'ar' ? unit.area?.name_ar : unit.area?.name_en) || unit.area?.name || unit.location_address || ''}</span>
                                    </p>
                                </div>

                                {/* Price Highlight */}
                                <div>
                                    <p className="text-3xl font-black text-[#CC0000] tracking-tight flex items-baseline gap-1.5">
                                        {Number(unit.price).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                        <span className="text-sm font-bold text-[#CC0000]">
                                            {trans('currency_egp')}
                                        </span>
                                    </p>
                                </div>

                                {/* Action Buttons Row */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <a
                                        href="#contact-form"
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
                                                navigator.share({ title: unit.name, url: window.location.href }).catch(() => {})
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
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    {unit.area_sqm && (
                                        <div className="p-3 bg-surface rounded-xl border border-secondary-100 text-center">
                                            <div className="flex items-center justify-center gap-1 text-secondary-600 text-xs font-medium mb-1">
                                                <svg className="w-4 h-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                </svg>
                                                <span>{isRtl ? 'المساحة' : 'Area'}</span>
                                            </div>
                                            <p className="text-sm font-black text-secondary-950">{unit.area_sqm} <span className="text-[10px] font-semibold text-secondary-500">{trans('unit_sqm')}</span></p>
                                        </div>
                                    )}

                                    {unit.rooms && (
                                        <div className="p-3 bg-surface rounded-xl border border-secondary-100 text-center">
                                            <div className="flex items-center justify-center gap-1 text-secondary-600 text-xs font-medium mb-1">
                                                <svg className="w-4 h-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                </svg>
                                                <span>{isRtl ? 'غرف النوم' : 'Bedrooms'}</span>
                                            </div>
                                            <p className="text-sm font-black text-secondary-950">{unit.rooms}</p>
                                        </div>
                                    )}

                                    {unit.bathrooms && (
                                        <div className="p-3 bg-surface rounded-xl border border-secondary-100 text-center">
                                            <div className="flex items-center justify-center gap-1 text-secondary-600 text-xs font-medium mb-1">
                                                <svg className="w-4 h-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                                </svg>
                                                <span>{isRtl ? 'الحمامات' : 'Baths'}</span>
                                            </div>
                                            <p className="text-sm font-black text-secondary-950">{unit.bathrooms}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Agent Info Snippet inside Top Summary Card */}
                                <div className="pt-4 border-t border-secondary-100">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-900 font-bold text-xs shrink-0">
                                                {unit.user?.name ? unit.user.name.charAt(0) : (isRtl ? 'أ' : 'A')}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-secondary-950 truncate">{unit.user?.name || (isRtl ? 'أحمد محمود' : 'Ahmed Mahmoud')}</h4>
                                                <p className="text-[11px] text-secondary-500 font-medium truncate">{isRtl ? 'مستشار عقاري' : 'Real Estate Advisor'}</p>
                                            </div>
                                        </div>

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
                            <a href="#overview" className="py-3 text-[#CC0000] border-b-2 border-[#CC0000] transition-colors">{isRtl ? 'نبذة عن الوحدة' : 'Overview'}</a>
                            {embedUrl && <a href="#video" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'الفيديو التعريفي' : 'Video'}</a>}
                            <a href="#features" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'المميزات' : 'Features'}</a>
                            <a href="#location" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'الموقع' : 'Location'}</a>
                            <a href="#contact-form" className="py-3 hover:text-[#CC0000] transition-colors">{isRtl ? 'تواصل معنا' : 'Contact Us'}</a>
                        </div>

                        {/* DESKTOP 2-COLUMN SIDEBAR LAYOUT (lg:grid) */}
                        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
                            {/* Left Content Column (7 cols desktop) */}
                            <div className="col-span-7 space-y-8">
                                {/* Section 1: نبذة عن الوحدة */}
                                <section id="overview" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                                    <h2 className="text-lg font-black text-secondary-950 mb-3">{isRtl ? 'نبذة عن الوحدة' : 'Unit Overview'}</h2>
                                    <p className="text-sm text-secondary-700 leading-relaxed whitespace-pre-line font-normal">
                                        {(locale === 'ar' ? unit.description_ar || unit.description : unit.description_en || unit.description) ||
                                            (isRtl
                                                ? 'شقة فاخرة بمساحة واسعة في موقع متميز تتميز بتصميم عصري وتقسيم ممتاز ومساحات تتيح أقصى درجات الراحة والتطشيبات عالية الجودة في واحدة من أفضل المناطق السكنية.'
                                                : 'Luxury spacious unit in a prime location with modern architecture, premium finishings, and optimal layout.')}
                                    </p>

                                    {/* Payment Details */}
                                    {['installment', 'both'].includes(unit.payment_method) && (unit.down_payment || unit.installment_years) && (
                                        <div className="mt-6 pt-4 border-t border-secondary-100">
                                            <h2 className="text-xs font-bold text-secondary-900 mb-3">{isRtl ? 'أنظمة الدفع والتسهيلات' : 'Payment Details'}</h2>
                                            <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-secondary-100 text-xs">
                                                {unit.down_payment && (
                                                    <div>
                                                        <span className="text-secondary-500 font-medium block mb-1">{isRtl ? 'الدفعة الأولى' : 'Down Payment'}</span>
                                                        <span className="font-bold text-secondary-950">{!isNaN(unit.down_payment) && !isNaN(parseFloat(unit.down_payment)) ? Number(unit.down_payment).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US') + ' ' + trans('currency_egp') : unit.down_payment}</span>
                                                    </div>
                                                )}
                                                {unit.installment_years && (
                                                    <div>
                                                        <span className="text-secondary-500 font-medium block mb-1">{isRtl ? 'سنوات التقسيط' : 'Installment Years'}</span>
                                                        <span className="font-bold text-secondary-950">{unit.installment_years} {isRtl ? 'سنوات' : 'Years'}</span>
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
                                            <span>{isRtl ? 'الفيديو التعريفي للوحدة' : 'Property Video Tour'}</span>
                                        </h2>
                                        <div className="rounded-xl overflow-hidden aspect-video border border-secondary-200 shadow-sm bg-black">
                                            <iframe
                                                src={embedUrl}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="Property Video Tour"
                                            />
                                        </div>
                                    </section>
                                )}

                                {/* Section 2: المميزات */}
                                <section id="features" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                                    <h2 className="text-lg font-black text-secondary-950 mb-4">{isRtl ? 'المميزات' : 'Features & Amenities'}</h2>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {(unit.features?.length > 0 ? unit.features : [
                                            { id: 1, name_ar: 'حمام سباحة', name_en: 'Swimming Pool', icon: 'pool' },
                                            { id: 2, name_ar: 'مصعد', name_en: 'Elevator', icon: 'elevator' },
                                            { id: 3, name_ar: 'كافيه', name_en: 'Cafe', icon: 'cafe' },
                                            { id: 4, name_ar: 'كاميرات مراقبة', name_en: 'CCTV Security', icon: 'cctv' },
                                            { id: 5, name_ar: 'نادي رياضي', name_en: 'Gym & Fitness', icon: 'gym' },
                                            { id: 6, name_ar: 'موقف سيارات', name_en: 'Parking Garage', icon: 'parking' },
                                            { id: 7, name_ar: 'أمن وحراسة 24', name_en: '24/7 Security', icon: 'security' },
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

                                {/* Section 3: تواصل معنا Form */}
                                <section id="contact-form" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                                    <h2 className="text-lg font-black text-secondary-950 mb-1">{isRtl ? 'تواصل معنا' : 'Contact Us'}</h2>
                                    <p className="text-xs text-secondary-500 font-medium mb-5">{isRtl ? 'يرجى ملء النموذج وسيتواصل معك أحد مستشارينا في أقرب وقت' : 'Please fill out the form and our advisor will get in touch shortly.'}</p>

                                    {(sentSuccess || flash?.success) && (
                                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                                            {flash?.success || trans('unit_message_sent_success')}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label htmlFor="client_name_dt" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                                                <input
                                                    id="client_name_dt"
                                                    type="text"
                                                    value={data.client_name}
                                                    onChange={e => setData('client_name', e.target.value)}
                                                    required
                                                    className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none transition-all"
                                                />
                                                {errors.client_name && <p className="text-xs text-error mt-1">{errors.client_name}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="client_phone_dt" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                                                <input
                                                    id="client_phone_dt"
                                                    type="tel"
                                                    value={data.client_phone}
                                                    onChange={e => setData('client_phone', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="client_email_dt" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                                                <input
                                                    id="client_email_dt"
                                                    type="email"
                                                    value={data.client_email}
                                                    onChange={e => setData('client_email', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="content_dt" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'رسالتك' : 'Message'}</label>
                                            <textarea
                                                id="content_dt"
                                                value={data.content}
                                                onChange={e => setData('content', e.target.value)}
                                                required
                                                rows={3}
                                                className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none resize-none transition-all"
                                            />
                                            {errors.content && <p className="text-xs text-error mt-1">{errors.content}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 bg-[#CC0000] hover:bg-[#b30000] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3 21l19-9L3 3l3 9zm0 0h7.5" />
                                            </svg>
                                            <span>{processing ? trans('loading', {}, 'common') : (isRtl ? 'إرسال الرسالة' : 'Send Message')}</span>
                                        </button>
                                    </form>
                                </section>
                            </div>

                            {/* Right Sidebar Column (5 cols desktop, continuous & sticky) */}
                            <div className="col-span-5 space-y-6 sticky top-24">
                                {/* Card 1: معلومات المشروع */}
                                <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-secondary-100 pb-3">
                                        <h2 className="text-sm font-black text-secondary-950">{isRtl ? 'معلومات المشروع' : 'Project Info'}</h2>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                            <span className="text-secondary-500 font-semibold">{isRtl ? 'اسم المشروع' : 'Project Name'}</span>
                                            <span className="font-bold text-secondary-950">{unit.project?.name || (isRtl ? 'مشروع النخيل' : 'Al Nakheel')}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                            <span className="text-secondary-500 font-semibold">{isRtl ? 'نوع المشروع' : 'Type'}</span>
                                            <span className="font-bold text-secondary-950">{isRtl ? 'سكني' : 'Residential'}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                            <span className="text-secondary-500 font-semibold">{isRtl ? 'عدد الوحدات' : 'Units Count'}</span>
                                            <span className="font-bold text-secondary-950">124 {isRtl ? 'وحدة' : 'Units'}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                            <span className="text-secondary-500 font-semibold">{isRtl ? 'مساحة المشروع' : 'Project Area'}</span>
                                            <span className="font-bold text-secondary-950">12,000 م²</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                            <span className="text-secondary-500 font-semibold">{isRtl ? 'سنة التسليم' : 'Delivery Year'}</span>
                                            <span className="font-bold text-secondary-950">2026</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5">
                                            <span className="text-secondary-500 font-semibold">{isRtl ? 'حالة المشروع' : 'Status'}</span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                                {isRtl ? 'قيد الإنشاء' : 'Under Construction'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: الموقع على الخريطة */}
                                <div id="location" className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                                    <h2 className="text-sm font-black text-secondary-950">{isRtl ? 'الموقع على الخريطة' : 'Location on Map'}</h2>

                                    <div className="rounded-xl overflow-hidden border border-secondary-200 aspect-[16/9]">
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${unit.latitude || '30.0444'},${unit.longitude || '31.2357'}&hl=${locale}&z=14&output=embed`}
                                            className="w-full h-full border-0"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Google Map Location"
                                        />
                                    </div>

                                    <div className="text-center pt-1">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${unit.latitude || '30.0444'},${unit.longitude || '31.2357'}`}
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
                                <h2 className="text-lg font-black text-secondary-950 mb-3">{isRtl ? 'نبذة عن الوحدة' : 'Unit Overview'}</h2>
                                <p className="text-sm text-secondary-700 leading-relaxed whitespace-pre-line font-normal">
                                    {(locale === 'ar' ? unit.description_ar || unit.description : unit.description_en || unit.description) ||
                                        (isRtl
                                            ? 'شقة فاخرة بمساحة واسعة في موقع متميز تتميز بتصميم عصري وتقسيم ممتاز ومساحات تتيح أقصى درجات الراحة والتطشيبات عالية الجودة في واحدة من أفضل المناطق السكنية.'
                                            : 'Luxury spacious unit in a prime location with modern architecture, premium finishings, and optimal layout.')}
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
                                        <span>{isRtl ? 'الفيديو التعريفي' : 'Property Video Tour'}</span>
                                    </h2>
                                    <div className="rounded-xl overflow-hidden aspect-video border border-secondary-200 shadow-sm bg-black">
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Property Video Tour Mobile"
                                        />
                                    </div>
                                </section>
                            )}

                            {/* 2. Features */}
                            <section className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                                <h2 className="text-lg font-black text-secondary-950 mb-4">{isRtl ? 'المميزات' : 'Features & Amenities'}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {(unit.features?.length > 0 ? unit.features : [
                                        { id: 1, name_ar: 'حمام سباحة', name_en: 'Swimming Pool', icon: 'pool' },
                                        { id: 2, name_ar: 'مصعد', name_en: 'Elevator', icon: 'elevator' },
                                        { id: 3, name_ar: 'كافيه', name_en: 'Cafe', icon: 'cafe' },
                                        { id: 4, name_ar: 'كاميرات مراقبة', name_en: 'CCTV Security', icon: 'cctv' },
                                        { id: 5, name_ar: 'نادي رياضي', name_en: 'Gym & Fitness', icon: 'gym' },
                                        { id: 6, name_ar: 'موقف سيارات', name_en: 'Parking Garage', icon: 'parking' },
                                        { id: 7, name_ar: 'أمن وحراسة 24', name_en: '24/7 Security', icon: 'security' },
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
                                <h2 className="text-sm font-black text-secondary-950 border-b border-secondary-100 pb-3">{isRtl ? 'معلومات المشروع' : 'Project Info'}</h2>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                        <span className="text-secondary-500 font-semibold">{isRtl ? 'اسم المشروع' : 'Project Name'}</span>
                                        <span className="font-bold text-secondary-950">{unit.project?.name || (isRtl ? 'مشروع النخيل' : 'Al Nakheel')}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-secondary-100/60">
                                        <span className="text-secondary-500 font-semibold">{isRtl ? 'عدد الوحدات' : 'Units Count'}</span>
                                        <span className="font-bold text-secondary-950">124 {isRtl ? 'وحدة' : 'Units'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Location Map */}
                            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 space-y-4">
                                <h2 className="text-sm font-black text-secondary-950">{isRtl ? 'الموقع على الخريطة' : 'Location on Map'}</h2>
                                <div className="rounded-xl overflow-hidden border border-secondary-200 aspect-[16/9]">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${unit.latitude || '30.0444'},${unit.longitude || '31.2357'}&hl=${locale}&z=14&output=embed`}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Map Location Mobile"
                                    />
                                </div>
                            </div>

                            {/* 5. Contact Form */}
                            <section className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                                <h2 className="text-lg font-black text-secondary-950 mb-1">{isRtl ? 'تواصل معنا' : 'Contact Us'}</h2>
                                <p className="text-xs text-secondary-500 font-medium mb-5">{isRtl ? 'يرجى ملء النموذج وسيتواصل معك أحد مستشارينا في أقرب وقت' : 'Please fill out the form and our advisor will get in touch shortly.'}</p>
                                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                    <div>
                                        <label htmlFor="client_name_mob" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                                        <input
                                            id="client_name_mob"
                                            type="text"
                                            value={data.client_name}
                                            onChange={e => setData('client_name', e.target.value)}
                                            required
                                            className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="client_phone_mob" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                                        <input
                                            id="client_phone_mob"
                                            type="tel"
                                            value={data.client_phone}
                                            onChange={e => setData('client_phone', e.target.value)}
                                            className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="content_mob" className="block text-xs font-semibold text-secondary-900 mb-1">{isRtl ? 'رسالتك' : 'Message'}</label>
                                        <textarea
                                            id="content_mob"
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            required
                                            rows={3}
                                            className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-xs bg-surface focus:bg-white focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 bg-[#CC0000] hover:bg-[#b30000] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span>{processing ? trans('loading', {}, 'common') : (isRtl ? 'إرسال الرسالة' : 'Send Message')}</span>
                                    </button>
                                </form>
                            </section>
                        </div>
                    </>
                )}

                {/* Similar Units */}
                {similarUnits?.length > 0 && (
                    <section className="mt-12 bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-[#CC0000] rounded-full"></div>
                            <h2 className="text-lg md:text-xl font-black text-secondary-950 tracking-tight">{trans('similar_units', {}, 'units')}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarUnits.map(u => (
                                <UnitCard key={u.id} unit={u} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* DEDICATED MOBILE FLOATING RED ACTION BUTTON */}
            {unit && (
                <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-secondary-200 p-3 shadow-lg flex items-center justify-between gap-3 md:hidden">
                    <div>
                        <span className="text-[10px] font-bold text-secondary-500 uppercase block">{isRtl ? 'السعر' : 'Price'}</span>
                        <span className="text-base font-black text-[#CC0000]">
                            {Number(unit.price).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} <span className="text-xs font-bold">{trans('currency_egp')}</span>
                        </span>
                    </div>

                    <a
                        href="#contact-form"
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
                        src={images[lightboxIndex]?.url || (images[lightboxIndex]?.path ? `/storage/${images[lightboxIndex].path}` : PLACEHOLDER)}
                        alt=""
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                        onClick={e => e.stopPropagation()}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} w-10 h-10 bg-black/60 hover:bg-black rounded-full text-white flex items-center justify-center transition-colors`}
                                aria-label={trans('previous')}
                            >
                                <svg className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
                                }}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} w-10 h-10 bg-black/60 hover:bg-black rounded-full text-white flex items-center justify-center transition-colors`}
                                aria-label={trans('next')}
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
                    className="flex-1 py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                <a
                    href={`tel:${agentContacts.phone}`}
                    className="flex-1 py-3 px-4 bg-[#CC0000] hover:bg-[#b30000] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
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
