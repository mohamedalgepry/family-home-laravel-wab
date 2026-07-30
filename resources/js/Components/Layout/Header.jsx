import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useState } from 'react'

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

    const isActive = (href) => {
        if (!url) return false
        const locHref = localizedPath(href, locale);
        if (locHref === `/${locale}`) return url === `/${locale}` || url === `/${locale}/` || url === '/'
        if (href === '/units' && url.startsWith(localizedPath('/units/deals', locale))) return false
        return url.startsWith(locHref)
    }

    return (
        <header
            dir={isRtl ? 'rtl' : 'ltr'}
            className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sticky transition-all duration-300"
        >
            <div className="max-w-container mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo / Brand */}
                <Link href={localizedPath('/', locale)} className="flex items-center gap-2 shrink-0">
                    <img 
                        src={settings?.site_logo ? (settings.site_logo.startsWith('http') || settings.site_logo.startsWith('/storage') ? settings.site_logo : `/storage/${settings.site_logo}`) : '/icon.png'} 
                        alt={trans('app_name')} 
                        className="h-8 w-auto object-contain" 
                        onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                    />
                    <span className="text-xl font-bold text-primary-900 tracking-tight">{trans('app_name')}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.key}
                                href={localizedPath(item.href, locale)}
                                className={`text-sm transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                                    active 
                                        ? 'text-primary-900 border-primary-900 font-semibold' 
                                        : 'text-secondary-800 border-transparent hover:text-primary-900 hover:border-primary-900/50'
                                }`}
                            >
                                {trans(item.key)}
                                {item.key === 'compare' && compareCount > 0 && (
                                    <span className="bg-primary-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center mb-0.5">
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
                        className="text-xs font-medium text-secondary-700 hover:text-primary-900 border border-secondary-200 rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                        {isRtl ? trans('lang_en') : trans('lang_ar')}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="md:hidden text-secondary-700 hover:text-primary-900"
                        aria-label={trans('toggle_menu')}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                <nav className="md:hidden bg-white border-t border-secondary-100 px-4 py-4 flex flex-col gap-3">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.key}
                                href={localizedPath(item.href, locale)}
                                className={`block py-2 px-3 text-base rounded-lg transition-colors flex items-center justify-between ${
                                    active
                                        ? 'text-primary-900 bg-primary-50 font-medium'
                                        : 'text-secondary-800 hover:text-primary-900 hover:bg-secondary-50'
                                }`}
                                onClick={() => setMenuOpen(false)}
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
