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
            className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950"
        >
            {/* Ambient Background Elements */}
            <div className="absolute -top-40 -start-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 -end-40 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 start-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Grid Overlay pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

            {/* Top Navigation / Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                            <img
                                src={logoUrl}
                                alt={trans('brand_name')}
                                className="w-6 h-6 object-contain"
                                onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                            />
                        </div>
                    </div>
                    <div>
                        <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                            {trans('app_name') || 'فاميلي هوم'}
                        </span>
                        <span className="block text-[10px] text-amber-400/80 font-medium tracking-wider uppercase">
                            REAL ESTATE
                        </span>
                    </div>
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all duration-300"
                >
                    <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
                </Link>
            </header>

            {/* Main Auth Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md">
                    {/* Glass Card Container */}
                    <div className="relative group">
                        {/* Glow halo */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 via-primary-500/20 to-amber-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

                        <div className="relative bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/80">
                            {/* Brand Logo & Title Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 mb-4 p-2 shadow-inner">
                                    <img
                                        src={logoUrl}
                                        alt={trans('brand_name')}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                                    />
                                </div>
                                <h1 className="text-2xl font-black text-white tracking-tight">
                                    {title || (isRtl ? 'تسجيل الدخول' : 'Sign In')}
                                </h1>
                                <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                                    {subtitle || (isRtl ? 'مرحباً بك مجدداً في منصة فاميلي هوم العقارية' : 'Welcome back to Family Home Real Estate Platform')}
                                </p>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center py-6 text-xs text-slate-500 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p>&copy; {new Date().getFullYear()} {trans('app_name') || 'فاميلي هوم العقارية'}. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <Link href="/about" className="hover:text-amber-400 transition-colors">{trans('about') || 'عنا'}</Link>
                        <span className="text-slate-700">•</span>
                        <Link href="/contact" className="hover:text-amber-400 transition-colors">{trans('contact') || 'تواصل معنا'}</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

