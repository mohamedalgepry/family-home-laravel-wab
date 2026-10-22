import { useState, useCallback } from 'react'
import { usePage, router, Link } from '@inertiajs/react'
import SeoHead from '../../../Components/UI/SeoHead'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'
import ProjectCard from '../../../Components/UI/ProjectCard'
import Pagination from '../../../Components/UI/Pagination'
import { useTrans } from '../../../Utils/trans'
import { getStorageUrl, PLACEHOLDER } from '../../../Utils/image'
import { getAgentContacts } from '../../../Utils/contact'
import { localizedPath } from '../../../Utils/route'
import WhatsAppIcon from '../../../Components/UI/WhatsAppIcon'

export default function Show({ agent, units, projects, stats = {}, availableAreas = [], filters = {}, locale }) {
    const pageProps = usePage().props
    const currentLocale = locale || pageProps.locale || 'ar'
    const settings = pageProps.settings
    const trans = useTrans(currentLocale)
    const isRtl = currentLocale === 'ar'
    const unitData = units?.data || []
    const unitLinks = units?.links || []
    const projectData = projects?.data || []

    const [copied, setCopied] = useState(false)
    const [searchTerm, setSearchTerm] = useState(filters.search || '')

    const agentContacts = getAgentContacts(agent, settings)
    const avatarSrc = getStorageUrl(agent.avatar, null)
    const agentIdentifier = agent.slug || agent.id

    const whatsappMsg = encodeURIComponent(
        isRtl
            ? `مرحباً أستاذ ${agent.name}، تواصلت معك عبر موقع فاميلي هوم للاستفسار عن الوحدات والمشاريع المتاحة لديك.`
            : `Hello ${agent.name}, I am contacting you through Family Home regarding your available units and projects.`
    )
    const whatsappUrl = agentContacts.whatsapp ? `https://wa.me/${agentContacts.whatsapp}?text=${whatsappMsg}` : null
    const phoneUrl = agentContacts.phone ? `tel:${agentContacts.phone}` : null

    const socialChannels = [
        { key: 'facebook', url: agent.facebook || agent.profile?.facebook || null, label: 'Facebook' },
        { key: 'linkedin', url: agent.linkedin || agent.profile?.linkedin || null, label: 'LinkedIn' },
    ].filter(channel => channel.url)

    const applyFilter = useCallback((newFilters) => {
        const query = { ...filters, ...newFilters, page: 1 }
        Object.keys(query).forEach(key => {
            if (!query[key] && query[key] !== 0) delete query[key]
        })

        router.get(localizedPath(`/agents/${agentIdentifier}`, currentLocale), query, {
            preserveState: true,
            preserveScroll: true,
            only: ['units', 'filters', 'stats'],
        })
    }, [filters, agentIdentifier, currentLocale])

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        applyFilter({ search: searchTerm })
    }

    const resetFilters = () => {
        setSearchTerm('')
        applyFilter({ transaction: '', area_id: '', search: '', sort: 'latest' })
    }

    const copyProfileLink = async () => {
        if (typeof window === 'undefined' || !navigator.clipboard) return
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2500)
    }

    const defaultBio = isRtl
        ? 'مستشار عقاري في فاميلي هوم يساعدك في الوصول إلى أفضل الوحدات والمشاريع السكنية والتجارية مع أنظمة سداد مناسبة.'
        : 'Real estate consultant at Family Home helping clients find residential and commercial units and projects with suitable payment plans.'
    const agentBio = agent.bio || agent.profile?.bio || defaultBio

    const totalUnitsCount = stats.total_units ?? units?.total ?? 0
    const forSaleCount = stats.for_sale ?? 0
    const forRentCount = stats.for_rent ?? 0
    const areasCount = stats.areas_count ?? availableAreas.length
    const projectsCount = stats.projects_count ?? projectData.length
    const hasActiveFilters = Boolean(filters.transaction || filters.area_id || filters.search || (filters.sort && filters.sort !== 'latest'))

    return (
        <div className="min-h-screen bg-slate-50 text-secondary-900 flex flex-col">
            <SeoHead
                title={`${agent.name} - ${trans('app_name')}`}
                description={agentBio}
                ogImage={avatarSrc || '/images/og-familyhome.png'}
                ogType="profile"
            />

            <Header locale={currentLocale} />

            <main dir={isRtl ? 'rtl' : 'ltr'} className="flex-1">
                {/* Profile hero */}
                <section className="relative overflow-hidden bg-secondary-950 text-white">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#CC0000_1px,transparent_1px)] [background-size:24px_24px]" />
                    <div className="absolute -top-32 end-0 w-96 h-96 rounded-full bg-primary-900/20 blur-3xl" />
                    <div className="absolute -bottom-40 start-0 w-96 h-96 rounded-full bg-primary-950/30 blur-3xl" />

                    <div className="relative z-10 max-w-container mx-auto px-4 pt-8 pb-28">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-secondary-400 mb-8">
                            <Link href={localizedPath('/', currentLocale)} className="hover:text-white transition-colors">{trans('home')}</Link>
                            <span>/</span>
                            <span>{isRtl ? 'المستشارون العقاريون' : 'Real Estate Agents'}</span>
                            <span>/</span>
                            <span className="text-white truncate">{agent.name}</span>
                        </nav>

                        <div className="grid lg:grid-cols-[auto_1fr_auto] gap-7 lg:gap-10 items-center">
                            <div className="relative mx-auto lg:mx-0">
                                {avatarSrc ? (
                                    <img
                                        src={avatarSrc}
                                        alt={agent.name}
                                        width={168}
                                        height={168}
                                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] object-cover border-4 border-white/10 ring-4 ring-primary-900/20 shadow-2xl bg-secondary-900"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null
                                            event.currentTarget.src = PLACEHOLDER
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-secondary-900 border-4 border-white/10 ring-4 ring-primary-900/20 flex items-center justify-center text-5xl font-black text-primary-400 shadow-2xl">
                                        {agent.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <span className="absolute -bottom-2 -end-2 w-10 h-10 rounded-xl bg-emerald-500 border-4 border-secondary-950 flex items-center justify-center shadow-lg" title={isRtl ? 'مستشار موثق' : 'Verified agent'}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15.5 9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </div>

                            <div className="text-center lg:text-start">
                                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-primary-900/30 border border-primary-800/60 text-primary-300 text-xs font-bold">
                                        {isRtl ? 'مستشار عقاري معتمد' : 'Certified Real Estate Advisor'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary-300 text-xs font-semibold">
                                        {isRtl ? 'فاميلي هوم' : 'Family Home'}
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{agent.name}</h1>
                                <p className="mt-4 max-w-2xl text-secondary-300 leading-7 text-sm sm:text-base">{agentBio}</p>

                                <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
                                    {phoneUrl && (
                                        <a href={phoneUrl} className="px-5 py-3 rounded-xl bg-white text-secondary-950 font-bold text-sm shadow-lg hover:bg-slate-100 transition-colors">
                                            <span dir="ltr">{agentContacts.rawPhone || agentContacts.phone}</span>
                                        </a>
                                    )}
                                    {whatsappUrl && (
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow-lg hover:brightness-95 transition-all inline-flex items-center gap-2">
                                            <WhatsAppIcon className="w-5 h-5 fill-current" />
                                            {isRtl ? 'واتساب' : 'WhatsApp'}
                                        </a>
                                    )}
                                    <button type="button" onClick={copyProfileLink} className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-secondary-200 font-bold text-sm hover:bg-white/10 transition-colors">
                                        {copied ? (isRtl ? 'تم نسخ الرابط' : 'Link copied') : (isRtl ? 'مشاركة الملف' : 'Share profile')}
                                    </button>
                                    {socialChannels.map(channel => (
                                        <a key={channel.key} href={channel.url} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-900 transition-colors" aria-label={channel.label}>
                                            <span className="text-xs font-black">{channel.key === 'facebook' ? 'f' : 'in'}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 min-w-[230px]">
                                <Stat value={totalUnitsCount} label={isRtl ? 'وحدة نشطة' : 'Active units'} />
                                <Stat value={projectsCount} label={isRtl ? 'مشروع' : 'Projects'} />
                                <Stat value={forSaleCount} label={isRtl ? 'للبيع' : 'For sale'} />
                                <Stat value={forRentCount} label={isRtl ? 'للإيجار' : 'For rent'} />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-container mx-auto px-4 -mt-12 relative z-20 pb-16">
                    {/* Projects */}
                    <section className="bg-white rounded-3xl border border-secondary-200/80 shadow-xl p-5 sm:p-7 mb-8">
                        <SectionHeading
                            eyebrow={isRtl ? 'مشاريع المستشار' : 'Agent projects'}
                            title={isRtl ? 'المشاريع العقارية' : 'Real Estate Projects'}
                            count={projectsCount}
                        />

                        {projectData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
                                {projectData.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} priority={index < 2} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon="project" title={isRtl ? 'لا توجد مشاريع متاحة حالياً' : 'No projects available'} text={isRtl ? 'ستظهر هنا المشاريع التي أضافها المستشار أو فريقه.' : 'Projects added by this agent or their team will appear here.'} />
                        )}
                    </section>

                    {/* Units */}
                    <section className="bg-white rounded-3xl border border-secondary-200/80 shadow-xl p-5 sm:p-7">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-6">
                            <SectionHeading
                                eyebrow={isRtl ? 'المخزون العقاري' : 'Property inventory'}
                                title={isRtl ? 'الوحدات والعقارات' : 'Units & Properties'}
                                count={units?.total ?? totalUnitsCount}
                            />

                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => applyFilter({ transaction: '' })} className={filterClass(!filters.transaction)}>
                                    {isRtl ? 'الكل' : 'All'}
                                </button>
                                <button type="button" onClick={() => applyFilter({ transaction: 'sale' })} className={filterClass(filters.transaction === 'sale')}>
                                    {isRtl ? 'بيع' : 'Sale'}
                                </button>
                                <button type="button" onClick={() => applyFilter({ transaction: 'rent' })} className={filterClass(filters.transaction === 'rent')}>
                                    {isRtl ? 'إيجار' : 'Rent'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[auto_auto_1fr_auto] gap-3 mb-7">
                            <select value={filters.area_id || ''} onChange={(event) => applyFilter({ area_id: event.target.value })} className="rounded-xl border border-secondary-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-secondary-800 focus:ring-2 focus:ring-primary-900 focus:outline-none" aria-label={isRtl ? 'المنطقة' : 'Area'}>
                                <option value="">{isRtl ? 'كل المناطق' : 'All areas'}</option>
                                {availableAreas.map(area => (
                                    <option key={area.id} value={area.id}>{isRtl ? (area.name_ar || area.name) : (area.name_en || area.name)}</option>
                                ))}
                            </select>

                            <select value={filters.sort || 'latest'} onChange={(event) => applyFilter({ sort: event.target.value })} className="rounded-xl border border-secondary-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-secondary-800 focus:ring-2 focus:ring-primary-900 focus:outline-none" aria-label={isRtl ? 'ترتيب النتائج' : 'Sort'}>
                                <option value="latest">{isRtl ? 'الأحدث' : 'Latest'}</option>
                                <option value="price_asc">{isRtl ? 'السعر الأقل' : 'Price: Low to High'}</option>
                                <option value="price_desc">{isRtl ? 'السعر الأعلى' : 'Price: High to Low'}</option>
                                <option value="area_desc">{isRtl ? 'المساحة الأكبر' : 'Largest area'}</option>
                            </select>

                            <form onSubmit={handleSearchSubmit} className="relative min-w-0">
                                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={isRtl ? 'ابحث في وحدات المستشار...' : 'Search agent units...'} className="w-full rounded-xl border border-secondary-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-900 focus:outline-none" />
                                <button type="submit" className="absolute end-2 top-1/2 -translate-y-1/2 p-2 text-secondary-500 hover:text-primary-900" aria-label={isRtl ? 'بحث' : 'Search'}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.2-4.2m1.2-5.3a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" /></svg>
                                </button>
                            </form>

                            {hasActiveFilters && (
                                <button type="button" onClick={resetFilters} className="rounded-xl bg-primary-50 text-primary-900 px-4 py-3 text-sm font-bold hover:bg-primary-100 transition-colors">
                                    {isRtl ? 'مسح الفلاتر' : 'Clear filters'}
                                </button>
                            )}
                        </div>

                        {unitData.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {unitData.map(unit => <UnitCard key={unit.id} unit={unit} />)}
                                </div>
                                {units?.last_page > 1 && <div className="mt-10 flex justify-center"><Pagination links={unitLinks} /></div>}
                            </>
                        ) : (
                            <EmptyState icon="unit" title={isRtl ? 'لا توجد وحدات مطابقة' : 'No matching units'} text={isRtl ? 'جرّب تغيير الفلاتر أو البحث مرة أخرى.' : 'Try changing the filters or search term.'} />
                        )}
                    </section>

                    <section className="mt-8 rounded-3xl bg-secondary-950 text-white p-7 sm:p-10 overflow-hidden relative">
                        <div className="absolute -top-24 end-0 w-72 h-72 rounded-full bg-primary-900/20 blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-primary-300 text-xs font-bold uppercase tracking-wider">{isRtl ? 'استشارة عقارية' : 'Real estate consultation'}</p>
                                <h2 className="mt-2 text-2xl sm:text-3xl font-black">{isRtl ? 'تواصل مباشرة مع المستشار' : 'Contact the agent directly'}</h2>
                                <p className="mt-2 text-secondary-300 text-sm">{isRtl ? 'اسأل عن الوحدات والمشاريع المتاحة وخطط السداد.' : 'Ask about available units, projects, and payment plans.'}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {phoneUrl && <a href={phoneUrl} className="px-6 py-3 rounded-xl bg-white text-secondary-950 font-bold">{isRtl ? 'اتصال' : 'Call'}</a>}
                                {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold inline-flex items-center gap-2"><WhatsAppIcon className="w-5 h-5 fill-current" />WhatsApp</a>}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function Stat({ value, label }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 text-center">
            <strong className="block text-2xl font-black text-white">{Number(value || 0).toLocaleString()}</strong>
            <span className="text-[11px] text-secondary-400 font-semibold">{label}</span>
        </div>
    )
}

function SectionHeading({ eyebrow, title, count }) {
    return (
        <div>
            <div className="flex items-center gap-2 text-primary-900 text-xs font-black uppercase tracking-wider">
                <span className="w-7 h-1 rounded-full bg-primary-900" />
                {eyebrow}
            </div>
            <div className="mt-1.5 flex items-end gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-secondary-950">{title}</h2>
                <span className="mb-1 rounded-full bg-secondary-100 px-2.5 py-1 text-xs font-bold text-secondary-700">{Number(count || 0).toLocaleString()}</span>
            </div>
        </div>
    )
}

function filterClass(active) {
    return `px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${active ? 'bg-primary-900 text-white shadow-sm' : 'bg-slate-100 text-secondary-600 hover:bg-secondary-200'}`
}

function EmptyState({ icon, title, text }) {
    return (
        <div className="rounded-2xl border border-dashed border-secondary-200 bg-slate-50 px-6 py-14 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-white border border-secondary-200 flex items-center justify-center text-secondary-400">
                {icon === 'project' ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V6.5L12 3l7 3.5V21M8 21v-7h8v7M8 9h.01M12 9h.01M16 9h.01" /></svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7l9-4 9 4v14M7 21v-7h10v7M9 10h.01M12 10h.01M15 10h.01" /></svg>
                )}
            </div>
            <h3 className="font-black text-secondary-900">{title}</h3>
            <p className="mt-1 text-sm text-secondary-500">{text}</p>
        </div>
    )
}
