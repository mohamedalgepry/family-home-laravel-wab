import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import OptimizedImage from '../OptimizedImage'
import { getStorageUrl } from '../../Utils/image'
import { getAgentContacts } from '../../Utils/contact'
import { WhatsAppIcon } from '../UI'

export default function AgentCard({ agent }) {
    const { locale, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    if (!agent) return null

    const agentContacts = getAgentContacts(agent, settings)
    const avatarSrc = getStorageUrl(agent.avatar, null)
    const agentAlt = isRtl ? `الوكيل العقاري ${agent.name}` : `Real Estate Agent ${agent.name}`;

    const channels = [
        { key: 'phone', url: `tel:${agentContacts.phone}`, label: agentContacts.rawPhone },
        { key: 'whatsapp', url: `https://wa.me/${agentContacts.whatsapp}`, label: agentContacts.rawWhatsapp },
        { key: 'facebook', url: agent.facebook || agent.profile?.facebook || null, label: trans('facebook') },
        { key: 'linkedin', url: agent.linkedin || agent.profile?.linkedin || null, label: trans('social_linkedin', {}, 'admin') },
    ].filter(c => c.url)

    return (
        <article dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-xl shadow-card p-6 border border-secondary-100 hover:shadow-lg transition-shadow">
            <Link href={localizedPath(`/agents/${agent.slug || agent.id}`, locale)} className="flex items-center gap-4 mb-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
                {avatarSrc ? (
                    <OptimizedImage
                        src={avatarSrc}
                        alt={agentAlt}
                        width={56}
                        height={56}
                        lazy={true}
                        className="w-14 h-14 rounded-full object-cover border border-secondary-200"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold text-lg border border-primary-200" aria-label={agentAlt}>
                        {agent.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-semibold text-secondary-950">{agent.name}</h3>
                    <p className="text-xs text-muted">{trans('agent', {}, 'units')}</p>
                </div>
            </Link>
            <div className="space-y-2">
                {channels.map(ch => (
                    <a
                        key={ch.key}
                        href={ch.url}
                        target={ch.key === 'facebook' ? '_blank' : undefined}
                        rel={ch.key === 'facebook' ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-2 text-sm text-secondary-700 hover:text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
                        aria-label={`${ch.label} (${agent.name})`}
                    >
                        {ch.key === 'phone' && (
                            <svg className="w-4 h-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                        )}
                        {ch.key === 'whatsapp' && (
                            <WhatsAppIcon className="w-4 h-4 shrink-0 text-emerald-600 fill-current" />
                        )}
                        {ch.key === 'facebook' && (
                            <svg className="w-4 h-4 shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        )}
                        <span>{ch.label}</span>
                    </a>
                ))}
            </div>
        </article>
    )
}
