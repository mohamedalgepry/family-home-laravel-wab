import { localizedPath } from '../../Utils/route'
import { usePage, Link, router } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useState } from 'react'
import OptimizedImage from '../OptimizedImage'

const NAV_ITEMS = [
    { key: 'home', href: '/' },
    { key: 'projects', href: '/projects' },
    { key: 'units', href: '/units' },
    { key: 'deals', href: '/units/deals' },
    { key: 'compare', href: '/compare' },
    { key: 'articles', href: '/articles' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
]

export default function Header({ compareCount = 0 }) {
    const { url, props } = usePage()
    const { locale, settings } = props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [menuOpen, setMenuOpen] = useState(false)

    const logoSrc = settings?.site_logo 
        ? (settings.site_logo.startsWith('http') || settings.site_logo.startsWith('/storage') ? settings.site_logo : `/storage/${settings.site_logo}`) 
        : '/icon.webp';

    const logoAlt = `${trans('app_name')} - ${isRtl ? 'موقع عقارات عائلية' : 'Family Real Estate'}`;

    const isActive = (href) => {
        if (!url) return false
        const locHref = localizedPath(href, locale);
        if (locHref === `/${locale}`) return url === `/${locale}` || url === `/${locale}/` || url === '/'
        if (href === '/units' && url.startsWith(localizedPath('/units/deals', locale))) return false
        return url.startsWith(locHref)
    }

    const handleNavClick = (e, href) => {
        setMenuOpen(false);
        const locHref = localizedPath(href, locale);
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            if (currentPath === locHref || currentPath === `${locHref}/`) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }
        e.preventDefault();
        router.visit(locHref);
    }

    return (
        <header
            dir={isRtl ? 'rtl' : 'ltr'}
            className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm transition-all duration-300 border-b border-border"
            role="banner"
        >
            <div className="max-w-container mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo / Brand */}
                <Link
                    href={localizedPath('/', locale)}
                    onClick={(e) => handleNavClick(e, '/')}
                    className="flex items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
                >
                    <OptimizedImage 
                        src={logoSrc} 
                        alt={logoAlt} 
                        width={32}
                        height={32}
                        lazy={false}
                        fallbackSrc="/icon.webp"
                        className="h-8 w-auto object-contain" 
                    />
                    <span className="text-xl font-bold text-primary-900 tracking-tight group-hover:text-primary-700 transition-colors">{trans('app_name')}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6" aria-label={isRtl ? 'التنقل الرئيسي' : 'Main Navigation'}>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.key}
                                href={localizedPath(item.href, locale)}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={`text-sm transition-all duration-200 py-2 px-4 rounded-xl flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-900/10 ${
                                    active 
                                        ? 'text-primary-900 bg-primary-50 font-bold' 
                                        : 'text-secondary-800 hover:text-primary-900 hover:bg-surface-hover font-medium'
                                }`}
                            >
                                {trans(item.key)}
                                {item.key === 'compare' && compareCount > 0 && (
                                    <span className="bg-primary-900 text-white text-xs font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center mb-0.5" aria-label={`${compareCount} ${isRtl ? 'عناصر للمقارنة' : 'items to compare'}`}>
                                        {compareCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Language Toggle — server redirect preserves the current path reliably on mobile */}
                    <a
                        href={`/locale/${isRtl ? 'en' : 'ar'}?path=${encodeURIComponent(typeof url === 'string' && url ? url : `/${locale}`)}`}
                        className="text-xs font-medium text-secondary-700 hover:text-primary-900 border border-secondary-200 rounded-lg px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        aria-label={isRtl ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic'}
                    >
                        {isRtl ? trans('lang_en') : trans('lang_ar')}
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="md:hidden text-secondary-800 hover:text-primary-900 bg-surface hover:bg-surface-hover p-2 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-900/10 transition-colors"
                        aria-label={trans('toggle_menu')}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {menuOpen && (
                <nav id="mobile-navigation" className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-border rounded-b-3xl px-4 py-4 flex flex-col gap-2 origin-top animate-fade-in" aria-label={isRtl ? 'تنقل الهاتف' : 'Mobile Navigation'}>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.key}
                                href={localizedPath(item.href, locale)}
                                className={`block py-3 px-4 text-sm rounded-xl transition-all duration-200 flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-900/10 ${
                                    active
                                        ? 'text-primary-900 bg-primary-50 font-bold'
                                        : 'text-secondary-900 hover:text-primary-900 hover:bg-surface-hover font-medium'
                                }`}
                                onClick={(e) => handleNavClick(e, item.href)}
                            >
                                {trans(item.key)}
                                {item.key === 'compare' && compareCount > 0 && (
                                    <span className="bg-primary-900 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                        {compareCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            )}
        </header>
    )
}
