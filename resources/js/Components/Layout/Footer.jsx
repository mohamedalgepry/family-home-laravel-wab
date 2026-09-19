import { lazy, Suspense } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { localizedPath } from '../../Utils/route'
import CompareBar from '../Features/CompareBar'
import { WhatsAppIcon } from '../UI'

const HossamChatWidget = lazy(() => import('../UI/HossamChatWidget'))

const QUICK_LINKS = [
    { key: 'home', href: '/' },
    { key: 'projects', href: '/projects' },
    { key: 'units', href: '/units' },
    { key: 'deals', href: '/units/deals' },
    { key: 'articles', href: '/articles' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
]

const SOCIAL_ICONS = {
    social_facebook: (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    ),
    social_instagram: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    ),
    social_twitter: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    ),
    social_linkedin: (
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    ),
}

export default function Footer() {
    const { locale, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const socialLinks = [
        { key: 'social_facebook', url: settings?.social_facebook, label: trans('social_facebook') },
        { key: 'social_instagram', url: settings?.social_instagram, label: trans('social_instagram') },
        { key: 'social_twitter', url: settings?.social_twitter, label: trans('social_twitter') },
        { key: 'social_linkedin', url: settings?.social_linkedin, label: trans('social_linkedin') },
    ].filter(s => s.url)

    const handleNavClick = (e, href) => {
        const locHref = localizedPath(href, locale);
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            if (currentPath === locHref || currentPath === `${locHref}/`) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    return (
        <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-secondary-950 text-white pt-16 pb-6 md:pt-20">
            <div className="max-w-container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-16">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-white tracking-wide mb-6">
                            {trans('quick_links')}
                        </h3>
                        <ul className="space-y-3.5">
                            {QUICK_LINKS.map(item => (
                                <li key={item.key}>
                                    <Link
                                        href={localizedPath(item.href, locale)}
                                        onClick={(e) => handleNavClick(e, item.href)}
                                        className="text-sm text-secondary-300 hover:text-white transition-colors"
                                    >
                                        {trans(item.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base font-bold text-white tracking-wide mb-6">
                            {trans('contact_info')}
                        </h3>
                        <div className="space-y-4 text-sm text-secondary-300">
                            {settings?.company_phone && (
                                <a
                                    href={`tel:${settings.company_phone.replace(/\s+/g, '')}`}
                                    className="flex items-center gap-2 hover:text-white transition-colors w-fit"
                                    title={trans('call_us')}
                                >
                                    <svg className="w-4 h-4 shrink-0 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    <span dir="ltr">{settings.company_phone}</span>
                                </a>
                            )}
                            {settings?.company_whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.company_whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-green-400 transition-colors w-fit"
                                    title={trans('whatsapp_chat')}
                                >
                                    <WhatsAppIcon className="w-4 h-4 shrink-0 text-green-500 fill-current" />
                                    <span dir="ltr">{settings.company_whatsapp}</span>
                                </a>
                            )}
                            {settings?.company_email && (
                                <a
                                    href={`mailto:${settings.company_email}`}
                                    className="flex items-center gap-2 hover:text-white transition-colors w-fit"
                                    title={trans('send_email')}
                                >
                                    <svg className="w-4 h-4 shrink-0 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <span dir="ltr">{settings.company_email}</span>
                                </a>
                            )}
                            {settings?.company_address && (
                                <p className="flex items-start gap-2">
                                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <span>{settings.company_address}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-base font-bold text-white tracking-wide mb-6">
                            {trans('follow_us')}
                        </h3>
                        <div className="flex gap-3">
                            {socialLinks.map(social => (
                                <a
                                    key={social.key}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary-900 border border-white/10 hover:border-primary-900 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                                    aria-label={social.label}
                                >
                                    <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
                                        {SOCIAL_ICONS[social.key]}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 mt-8 pt-8 pb-4">
                <p className="text-center text-sm font-medium text-white/50">
                    &copy; {new Date().getFullYear()} {trans('app_name')}. {trans('all_rights_reserved')}
                </p>
            </div>
            <CompareBar />
            <Suspense fallback={null}>
                <HossamChatWidget />
            </Suspense>
        </footer>
    )
}
