import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function AuthLayout({ children, title, subtitle }) {
    const { locale, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const logoUrl = settings?.site_logo
        ? (settings.site_logo.startsWith('http') || settings.site_logo.startsWith('/storage') ? settings.site_logo : `/storage/${settings.site_logo}`)
        : '/icon.png'

    return (
        <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 text-secondary-950 flex flex-col justify-between relative font-sans selection:bg-primary-900 selection:text-white"
        >
            {/* Soft Ambient Background Orbs */}
            <div className="absolute -top-32 -start-32 w-96 h-96 bg-primary-900/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -end-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
                >
                    <div className="w-11 h-11 rounded-2xl bg-white p-2 shadow-md shadow-secondary-950/5 border border-secondary-100 flex items-center justify-center overflow-hidden">
                        <img
                            src={logoUrl}
                            alt={trans('brand_name')}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                        />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-primary-900">
                            {trans('app_name') || 'فاميلي هوم'}
                        </span>
                        <span className="block text-[10px] text-secondary-500 font-semibold tracking-wider uppercase">
                            {trans('site_title') || 'Family Home Real Estate'}
                        </span>
                    </div>
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-secondary-700 hover:text-primary-900 bg-white shadow-sm hover:shadow-md border border-secondary-200/80 px-4 py-2.5 rounded-xl transition-all duration-200"
                >
                    <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
                </Link>
            </header>

            {/* Main Auth Content Container */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md">
                    {/* Card Wrapper */}
                    <div className="bg-white rounded-3xl border border-secondary-200/80 shadow-xl shadow-secondary-950/5 p-6 sm:p-9 relative overflow-hidden">
                        {/* Top Decorative Line with Brand Primary Color */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-800 via-primary-900 to-amber-500" />

                        {/* Logo & Title */}
                        <div className="text-center mb-8 pt-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-secondary-100 mb-4 p-2 shadow-inner">
                                <img
                                    src={logoUrl}
                                    alt={trans('brand_name')}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                                />
                            </div>
                            <h1 className="text-2xl font-extrabold text-secondary-950 tracking-tight">
                                {title || (isRtl ? 'تسجيل الدخول' : 'Sign In')}
                            </h1>
                            <p className="text-xs text-secondary-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                                {subtitle || (isRtl ? 'مرحباً بك مجدداً في منصة فاميلي هوم العقارية' : 'Welcome back to Family Home Real Estate Platform')}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center py-6 text-xs text-secondary-500 border-t border-secondary-200/60 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p>&copy; {new Date().getFullYear()} {trans('app_name') || 'فاميلي هوم العقارية'}. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
                    <div className="flex items-center gap-4 text-secondary-600 font-medium">
                        <Link href="/about" className="hover:text-primary-900 transition-colors">{trans('about') || 'عنا'}</Link>
                        <span className="text-secondary-300">•</span>
                        <Link href="/contact" className="hover:text-primary-900 transition-colors">{trans('contact') || 'تواصل معنا'}</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

