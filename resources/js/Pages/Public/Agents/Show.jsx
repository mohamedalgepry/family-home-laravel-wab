import { Head } from '@inertiajs/react'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import UnitCard from '../../../Components/UI/UnitCard'
import Pagination from '../../../Components/UI/Pagination'
import { useTrans } from '../../../Utils/trans'

export default function Show({ agent, units, locale }) {
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const avatarSrc = agent.avatar ? (agent.avatar.startsWith('http') || agent.avatar.startsWith('/storage') ? agent.avatar : `/storage/${agent.avatar}`) : null
    const channels = [
        { key: 'phone', url: agent.phone ? `tel:${agent.phone}` : null, label: agent.phone },
        { key: 'whatsapp', url: agent.whatsapp ? `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}` : null, label: agent.whatsapp },
        { key: 'facebook', url: agent.facebook || null, label: trans('facebook', {}, 'admin') },
        { key: 'linkedin', url: agent.linkedin || null, label: trans('social_linkedin', {}, 'admin') },
    ].filter(c => c.url)

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-secondary-900 selection:bg-primary-200 selection:text-primary-900">
            <Head>
                <title>{`${agent.name} - ${trans('app_name')}`}</title>
            </Head>

            <Header locale={locale} />

            <div dir={isRtl ? 'rtl' : 'ltr'} className="container py-8 sm:py-12">
                {/* Agent Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-10 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="shrink-0">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt={agent.name} width={160} height={160} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-md border-4 border-white" />
                        ) : (
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 font-bold text-4xl sm:text-5xl border-4 border-white shadow-md">
                                {agent.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-start space-y-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-950">{agent.name}</h1>
                            <p className="text-secondary-600 mt-1">{trans(agent.role)}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                            {channels.map(ch => (
                                <a
                                    key={ch.key}
                                    href={ch.url}
                                    target={ch.key !== 'phone' ? '_blank' : undefined}
                                    rel={ch.key !== 'phone' ? 'noopener noreferrer' : undefined}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        ch.key === 'whatsapp' ? 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20' :
                                        ch.key === 'facebook' ? 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20' :
                                        ch.key === 'linkedin' ? 'bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20' :
                                        'bg-primary-50 text-primary-900 hover:bg-primary-100'
                                    }`}
                                >
                                    {ch.key === 'phone' && (
                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    )}
                                    {ch.key === 'whatsapp' && (
                                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    )}
                                    {ch.key === 'facebook' && (
                                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                        </svg>
                                    )}
                                    {ch.key === 'linkedin' && (
                                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                        </svg>
                                    )}
                                    <span dir="ltr">{ch.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Units List */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-secondary-950">
                        {trans('agent_units', {}, 'units') || trans('units_count', {}, 'units')} ({units.total})
                    </h2>
                </div>

                {units.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {units.data.map(unit => (
                                <UnitCard key={unit.id} unit={unit} />
                            ))}
                        </div>
                        {units.last_page > 1 && (
                            <div className="mt-10 flex justify-center">
                                <Pagination links={units.links} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-secondary-100">
                        <svg className="w-16 h-16 mx-auto text-secondary-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-lg font-semibold text-secondary-950 mb-2">{trans('no_units', {}, 'units')}</h3>
                        <p className="text-secondary-600">{trans('agent_no_units', {}, 'units') || trans('no_units', {}, 'units')}</p>
                    </div>
                )}
            </div>

            <Footer locale={locale} />
        </div>
    )
}
