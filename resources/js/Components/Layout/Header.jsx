import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
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
        : '/icon.png';

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
            }
        }
    }

    return (
        <header
            dir={isRtl ? 'rtl' : 'ltr'}
            className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sticky transition-all duration-300"
            role="banner"
        >
            <div className="max-w-container mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo / Brand */}
                <Link
                    href={localizedPath('/', locale)}
                    onClick={(e) => handleNavClick(e, '/')}
                    className="flex items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
                >
                    <OptimizedImage 
                        src={logoSrc} 
                        alt={logoAlt} 
                        width={32}
                        height={32}
                        lazy={false}
                        fallbackSrc="/icon.png"
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
                                className={`text-sm transition-colors py-1 border-b-2 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded ${
                                    active 
                                        ? 'text-primary-900 border-primary-900 font-semibold' 
                                        : 'text-secondary-800 border-transparent hover:text-primary-900 hover:border-primary-900/50'
                                }`}
                            >
                                {trans(item.key)}
                                {item.key === 'compare' && compareCount > 0 && (
                                    <span className="bg-primary-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center mb-0.5" aria-label={`${compareCount} ${isRtl ? 'عناصر للمقارنة' : 'items to compare'}`}>
                                        {compareCount}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Language Toggle */}
                    <Link
                        href={`/locale/${isRtl ? 'en' : 'ar'}`}
                        method="get"
                        as="button"
                        className="text-xs font-medium text-secondary-700 hover:text-primary-900 border border-secondary-200 rounded-lg px-2.5 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label={isRtl ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic'}
                    >
                        {isRtl ? trans('lang_en') : trans('lang_ar')}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="md:hidden text-secondary-700 hover:text-primary-900 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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

            {/* Mobile Nav */}
            {menuOpen && (
                <nav id="mobile-navigation" className="md:hidden bg-white border-t border-secondary-100 px-4 py-4 flex flex-col gap-3" aria-label={isRtl ? 'تنقل الهاتف' : 'Mobile Navigation'}>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.key}
                                href={localizedPath(item.href, locale)}
                                className={`block py-2 px-3 text-base rounded-lg transition-colors flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    active
                                        ? 'text-primary-900 bg-primary-50 font-medium'
                                        : 'text-secondary-800 hover:text-primary-900 hover:bg-secondary-50'
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
