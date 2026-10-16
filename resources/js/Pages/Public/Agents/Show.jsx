import { useState, useCallback } from 'react'
import { usePage, router, Link } from '@inertiajs/react'
import SeoHead from '../../../Components/UI/SeoHead'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'
import Pagination from '../../../Components/UI/Pagination'
import { useTrans } from '../../../Utils/trans'
import { getStorageUrl, PLACEHOLDER } from '../../../Utils/image'
import { getAgentContacts } from '../../../Utils/contact'
import { localizedPath } from '../../../Utils/route'
import WhatsAppIcon from '../../../Components/UI/WhatsAppIcon'

export default function Show({ agent, units, stats = {}, availableAreas = [], filters = {}, locale }) {
    const pageProps = usePage().props
    const currentLocale = locale || pageProps.locale || 'ar'
    const settings = pageProps.settings
    const trans = useTrans(currentLocale)
    const isRtl = currentLocale === 'ar'

    const [copied, setCopied] = useState(false)
    const [searchTerm, setSearchTerm] = useState(filters.search || '')

    const agentContacts = getAgentContacts(agent, settings)
    const avatarSrc = getStorageUrl(agent.avatar, null)

    // قنوات التواصل
    const whatsappMsg = encodeURIComponent(
        isRtl
            ? `مرحباً أستاذ ${agent.name}، تواصلت معك عبر موقع فاميلي هوم للاستفسار عن الوحدات والعقارات المتاحة لديك.`
            : `Hello ${agent.name}, I am contacting you through Family Home website regarding your available properties.`
    )
    const whatsappUrl = `https://wa.me/${agentContacts.whatsapp}?text=${whatsappMsg}`
    const phoneUrl = `tel:${agentContacts.phone}`

    const socialChannels = [
        { key: 'facebook', url: agent.facebook || agent.profile?.facebook || null, label: 'Facebook' },
        { key: 'linkedin', url: agent.linkedin || agent.profile?.linkedin || null, label: 'LinkedIn' },
    ].filter(c => c.url)

    // معالجة الفلاتر عبر Inertia
    const applyFilter = useCallback((newFilters) => {
        const query = {
            ...filters,
            ...newFilters,
            page: 1, // العودة للصفحة الأولى عند تغيير الفلاتر
        }

        // إزالة الحقول الفارغة
        Object.keys(query).forEach(key => {
            if (!query[key] && query[key] !== 0) {
                delete query[key]
            }
        })

        const agentIdentifier = agent.slug || agent.id
        router.get(localizedPath(`/agents/${agentIdentifier}`, currentLocale), query, {
            preserveState: true,
            preserveScroll: true,
            only: ['units', 'filters', 'stats'],
        })
    }, [filters, agent, currentLocale])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        applyFilter({ search: searchTerm })
    }

    const resetFilters = () => {
        setSearchTerm('')
        applyFilter({ transaction: '', area_id: '', search: '', sort: 'latest' })
    }

    const copyProfileLink = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        }
    }

    const defaultBio = isRtl
        ? `مستشار عقاري معتمد في شركة فاميلي هوم للتطوير والتسويق العقاري. أساعدك في العثور على أفضل الفرص العقارية السكنية والتجارية في أرقى مناطق مصر بأعلى عوائد استثمارية وأيسر أنظمة سداد.`
        : `Certified Real Estate Consultant at Family Home Real Estate. Dedicated to helping you find premier residential and commercial properties in Egypt with flexible payment plans and outstanding investment returns.`

    const agentBio = agent.bio || agent.profile?.bio || defaultBio

    const totalUnitsCount = stats.total_units ?? units.total ?? 0
    const forSaleCount = stats.for_sale ?? 0
    const forRentCount = stats.for_rent ?? 0
    const areasCount = stats.areas_count ?? (availableAreas?.length || 0)

    const hasActiveFilters = Boolean(filters.transaction || filters.area_id || filters.search || (filters.sort && filters.sort !== 'latest'))

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-secondary-900 selection:bg-primary-900 selection:text-white">
            <SeoHead
                title={`${agent.name} - ${trans('app_name')}`}
                description={agentBio}
                ogImage={avatarSrc || '/images/og-familyhome.png'}
                ogType="profile"
            />

            <Header locale={currentLocale} />

            {/* Hero Cover & Agent Presentation */}
            <div dir={isRtl ? 'rtl' : 'ltr'} className="relative bg-secondary-950 text-white overflow-hidden pb-24 pt-8 md:pt-12 border-b border-secondary-800">
                {/* Background decorative styling */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#CC0000_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute top-0 end-0 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 start-0 w-80 h-80 bg-red-950/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-container mx-auto px-4 relative z-10">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-secondary-400">
                        <Link href={localizedPath('/', currentLocale)} className="hover:text-white transition-colors">
                            {trans('home')}
                        </Link>
                        <span className="rtl:rotate-180 text-secondary-600">/</span>
                        <span className="text-secondary-400">
                            {isRtl ? 'المستشارون العقاريون' : 'Real Estate Agents'}
                        </span>
                        <span className="rtl:rotate-180 text-secondary-600">/</span>
                        <span className="text-white font-medium truncate">{agent.name}</span>
                    </nav>

                    {/* Agent Main Profile Card */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar Column */}
                        <div className="relative shrink-0 group">
                            <div className="relative">
                                {avatarSrc ? (
                                    <img
                                        src={avatarSrc}
                                        alt={agent.name}
                                        width={176}
                                        height={176}
                                        className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-2xl border-4 border-white/10 ring-4 ring-primary-900/30 bg-secondary-900"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null
                                            e.currentTarget.src = PLACEHOLDER
                                        }}
                                    />
                                ) : (
                                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-primary-950 via-secondary-900 to-secondary-950 flex items-center justify-center text-primary-400 font-black text-5xl sm:text-6xl border-4 border-white/10 ring-4 ring-primary-900/30 shadow-2xl">
                                        {agent.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}

                                {/* Verified Badge */}
                                <div
                                    className="absolute -bottom-2 -end-2 bg-emerald-500 text-white rounded-xl p-2 shadow-lg border-2 border-secondary-950 flex items-center justify-center"
                                    title={isRtl ? 'مستشار عقاري موثق' : 'Verified Real Estate Agent'}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Bio & Details Column */}
                        <div className="flex-1 text-center md:text-start space-y-4">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                <span className="inline-flex items-center gap-1.5 bg-primary-900/30 text-primary-300 border border-primary-800/60 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                    {isRtl ? 'مستشار عقاري معتمد' : 'Certified Real Estate Advisor'}
                                </span>
                                <span className="bg-secondary-800/80 text-secondary-300 text-xs font-semibold px-3 py-1 rounded-full border border-secondary-700/60">
                                    {isRtl ? 'فاميلي هوم للتطوير العقاري' : 'Family Home Real Estate'}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                {agent.name}
                            </h1>

                            <p className="text-secondary-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                                {agentBio}
                            </p>

                            {/* Direct Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                                {agentContacts.phone && (
                                    <a
                                        href={phoneUrl}
                                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-secondary-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5"
                                        title={isRtl ? 'اتصال مباشر' : 'Call Directly'}
                                    >
                                        <svg className="w-4 h-4 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        <span dir="ltr" className="font-extrabold">{agentContacts.rawPhone}</span>
                                    </a>
                                )}

                                {agentContacts.whatsapp && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20ba59] transition-all shadow-lg hover:-translate-y-0.5"
                                        title={isRtl ? 'محادثة واتساب' : 'WhatsApp Chat'}
                                    >
                                        <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
                                        <span>{isRtl ? 'تواصل عبر واتساب' : 'WhatsApp Chat'}</span>
                                    </a>
                                )}

                                {/* Share profile link */}
                                <button
                                    type="button"
                                    onClick={copyProfileLink}
                                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-secondary-900 hover:bg-secondary-800 text-secondary-200 border border-secondary-700 font-semibold text-sm transition-all"
                                    title={isRtl ? 'مشاركة رابط الملف الشخصي' : 'Share profile link'}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span className="text-emerald-400">{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                            </svg>
                                            <span>{isRtl ? 'مشاركة' : 'Share'}</span>
                                        </>
                                    )}
                                </button>

                                {/* Social Links */}
                                {socialChannels.map(ch => (
                                    <a
                                        key={ch.key}
                                        href={ch.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-2xl bg-secondary-900 hover:bg-primary-900 text-secondary-300 hover:text-white border border-secondary-700 flex items-center justify-center transition-all"
                                        title={ch.label}
                                        aria-label={ch.label}
                                    >
                                        {ch.key === 'facebook' && (
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                            </svg>
                                        )}
                                        {ch.key === 'linkedin' && (
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                            </svg>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar (Floating Over Hero) */}
            <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-container mx-auto px-4 -mt-12 relative z-20 w-full mb-10">
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-secondary-950/5 border border-secondary-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-secondary-100">
                    {/* Stat 1: Total Units */}
                    <div className="flex items-center gap-4 pt-3 sm:pt-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-900 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl font-black text-secondary-950 block leading-tight">
                                {totalUnitsCount.toLocaleString(currentLocale === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                            <span className="text-xs font-semibold text-secondary-700">
                                {isRtl ? 'إجمالي العقارات المتاحة' : 'Total Available Units'}
                            </span>
                        </div>
                    </div>

                    {/* Stat 2: For Sale */}
                    <div className="flex items-center gap-4 pt-3 sm:pt-0 ps-0 sm:ps-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl font-black text-secondary-950 block leading-tight">
                                {forSaleCount.toLocaleString(currentLocale === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                            <span className="text-xs font-semibold text-secondary-700">
                                {isRtl ? 'عقارات للبيع' : 'Properties For Sale'}
                            </span>
                        </div>
                    </div>

                    {/* Stat 3: For Rent */}
                    <div className="flex items-center gap-4 pt-3 sm:pt-0 ps-0 sm:ps-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl font-black text-secondary-950 block leading-tight">
                                {forRentCount.toLocaleString(currentLocale === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                            <span className="text-xs font-semibold text-secondary-700">
                                {isRtl ? 'عقارات للإيجار' : 'Properties For Rent'}
                            </span>
                        </div>
                    </div>

                    {/* Stat 4: Coverage Areas */}
                    <div className="flex items-center gap-4 pt-3 sm:pt-0 ps-0 sm:ps-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl font-black text-secondary-950 block leading-tight">
                                {areasCount.toLocaleString(currentLocale === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                            <span className="text-xs font-semibold text-secondary-700">
                                {isRtl ? 'مناطق التغطية' : 'Covered Areas'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Content Section */}
            <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-container mx-auto px-4 pb-16 flex-1 w-full">
                {/* Search & Filter Toolbar */}
                <div className="bg-white rounded-3xl border border-secondary-200/80 shadow-sm p-4 sm:p-6 mb-8">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                        {/* Transaction Tabs */}
                        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl self-start overflow-x-auto max-w-full">
                            <button
                                type="button"
                                onClick={() => applyFilter({ transaction: '' })}
                                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                    !filters.transaction
                                        ? 'bg-primary-900 text-white shadow-sm'
                                        : 'text-secondary-600 hover:text-secondary-950'
                                }`}
                            >
                                {isRtl ? 'جميع العقارات' : 'All Properties'} ({totalUnitsCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => applyFilter({ transaction: 'sale' })}
                                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                    filters.transaction === 'sale'
                                        ? 'bg-primary-900 text-white shadow-sm'
                                        : 'text-secondary-600 hover:text-secondary-950'
                                }`}
                            >
                                {isRtl ? 'للبيع' : 'For Sale'} ({forSaleCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => applyFilter({ transaction: 'rent' })}
                                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                                    filters.transaction === 'rent'
                                        ? 'bg-primary-900 text-white shadow-sm'
                                        : 'text-secondary-600 hover:text-secondary-950'
                                }`}
                            >
                                {isRtl ? 'للإيجار' : 'For Rent'} ({forRentCount})
                            </button>
                        </div>

                        {/* Search and Secondary Selects */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Area Filter */}
                            {availableAreas.length > 0 && (
                                <select
                                    value={filters.area_id || ''}
                                    onChange={(e) => applyFilter({ area_id: e.target.value })}
                                    className="bg-slate-50 border border-secondary-200 text-secondary-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 font-semibold focus:ring-2 focus:ring-primary-900 focus:outline-none"
                                    aria-label={isRtl ? 'تصفية حسب المنطقة' : 'Filter by Area'}
                                >
                                    <option value="">{isRtl ? 'كل المناطق' : 'All Areas'}</option>
                                    {availableAreas.map(area => (
                                        <option key={area.id} value={area.id}>
                                            {isRtl ? (area.name_ar || area.name) : (area.name_en || area.name)}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Sort Filter */}
                            <select
                                value={filters.sort || 'latest'}
                                onChange={(e) => applyFilter({ sort: e.target.value })}
                                className="bg-slate-50 border border-secondary-200 text-secondary-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 font-semibold focus:ring-2 focus:ring-primary-900 focus:outline-none"
                                aria-label={isRtl ? 'ترتيب النتائج' : 'Sort Results'}
                            >
                                <option value="latest">{isRtl ? 'الأحدث إضافة' : 'Latest'}</option>
                                <option value="price_asc">{isRtl ? 'الأقل سعراً' : 'Price: Low to High'}</option>
                                <option value="price_desc">{isRtl ? 'الأعلى سعراً' : 'Price: High to Low'}</option>
                                <option value="area_desc">{isRtl ? 'المساحة الأكبر' : 'Largest Area'}</option>
                            </select>

                            {/* Search Form */}
                            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={isRtl ? 'ابحث في وحدات المستشار...' : 'Search agent units...'}
                                    className="w-full bg-slate-50 border border-secondary-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-900 focus:outline-none pe-10"
                                />
                                <button
                                    type="submit"
                                    className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 text-secondary-400 hover:text-primary-900 transition-colors"
                                    aria-label={isRtl ? 'بحث' : 'Search'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </button>
                            </form>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-primary-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                                    title={isRtl ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>{isRtl ? 'مسح الفلاتر' : 'Clear'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Title and Count */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-7 bg-primary-900 rounded-full"></div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">
                                {isRtl ? 'العقارات والوحدات المعروضة' : 'Available Real Estate Listings'}
                            </h2>
                            <p className="text-xs text-secondary-500 font-medium">
                                {isRtl
                                    ? `عرض ${units.data.length} من إجمالي ${units.total} عقار`
                                    : `Showing ${units.data.length} of ${units.total} properties`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Units Grid */}
                {units.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {units.data.map(unit => (
                                <UnitCard key={unit.id} unit={unit} />
                            ))}
                        </div>

                        {units.last_page > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination links={units.links} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-secondary-200/80 shadow-sm max-w-2xl mx-auto px-6">
                        <div className="w-20 h-20 bg-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-secondary-400">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-secondary-950 mb-3">
                            {isRtl ? 'لا توجد وحدات تطابق خيارات البحث' : 'No properties found matching filters'}
                        </h3>
                        <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-6">
                            {isRtl
                                ? 'جرب تغيير خيارات التصفية أو مسح الفلاتر لعرض كافة الوحدات المتاحة لهذا المستشار.'
                                : 'Try adjusting your filters or clearing them to explore all listings from this consultant.'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-950 transition-colors shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                                <span>{isRtl ? 'عرض كل عقارات المستشار' : 'Show All Agent Properties'}</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Consultation Contact CTA Banner */}
                <div className="mt-16 bg-gradient-to-br from-secondary-950 via-secondary-900 to-secondary-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-secondary-800 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 end-0 w-72 h-72 bg-primary-900/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="space-y-3 text-center md:text-start relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-primary-900/40 text-primary-300 border border-primary-800/80 px-3 py-1 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                            {isRtl ? 'استشارة عقارية مجانية' : 'Free Real Estate Consultation'}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                            {isRtl
                                ? `هل تحتاج مساعدة في اختيار وحدتك العقارية؟`
                                : `Need expert help finding your dream property?`}
                        </h3>
                        <p className="text-secondary-300 text-sm sm:text-base leading-relaxed">
                            {isRtl
                                ? `تواصل مباشرة مع المستشار ${agent.name} لمساعدتك في العثور على أفضل شقة، فيلا، أو محل تجاري يناسب ميزانيتك وخطة سدادك.`
                                : `Get in touch directly with ${agent.name} for tailored advice on the best apartments, villas, and commercial spaces.`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 shrink-0">
                        {agentContacts.whatsapp && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5"
                            >
                                <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
                                <span>{isRtl ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                            </a>
                        )}
                        {agentContacts.phone && (
                            <a
                                href={phoneUrl}
                                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white text-secondary-950 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4 text-primary-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>{isRtl ? 'اتصال بالمستشار' : 'Call Consultant'}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <Footer locale={currentLocale} />
        </div>
    )
}
