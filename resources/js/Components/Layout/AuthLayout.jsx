import { usePage, Link, Head } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { localizedPath } from '../../Utils/route'

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
            className="min-h-screen bg-slate-50 text-secondary-950 flex flex-col justify-between relative font-sans selection:bg-primary-900 selection:text-white"
        >
            <Head>
                <meta name="author" content="mohamed algbry" />
            </Head>
            {/* Header */}
            <header className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
                <Link
                    href={localizedPath('/', locale)}
                    className="flex items-center gap-3 group transition-transform duration-200 hover:opacity-90"
                >
                    <img
                        src={logoUrl}
                        alt={trans('brand_name')}
                        className="h-9 w-auto object-contain"
                        onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                    />
                    <div>
                        <span className="text-lg font-extrabold text-primary-900 block leading-tight">
                            {trans('app_name') || 'فاميلي هوم'}
                        </span>
                    </div>
                </Link>

                <Link
                    href={localizedPath('/', locale)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary-600 hover:text-primary-900 bg-white shadow-xs hover:shadow border border-secondary-200 px-3.5 py-2 rounded-lg transition-all"
                >
                    <svg className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
                </Link>
            </header>

            {/* Main Auth Content Container - Pushed Upwards with pt-4 sm:pt-8 */}
            <main className="relative z-10 flex-1 flex items-start justify-center px-4 pt-4 sm:pt-8 pb-10">
                <div className="w-full max-w-md">
                    {/* Clean Minimal Card */}
                    <div className="bg-white rounded-2xl border border-secondary-200/90 shadow-lg shadow-secondary-950/5 p-6 sm:p-8">
                        {/* Logo & Header inside card */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-50 border border-secondary-100 mb-3 p-2">
                                <img
                                    src={logoUrl}
                                    alt={trans('brand_name')}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                                />
                            </div>
                            <h1 className="text-xl font-bold text-secondary-950">
                                {title || (isRtl ? 'تسجيل الدخول' : 'Sign In')}
                            </h1>
                            {subtitle && (
                                <p className="text-xs text-secondary-500 mt-1 max-w-xs mx-auto">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {children}
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 text-center py-4 text-xs text-secondary-400 border-t border-secondary-200/50 bg-white/40">
                <p>&copy; {new Date().getFullYear()} {trans('app_name') || 'فاميلي هوم'}. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
            </footer>
        </div>
    )
}

