import { usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function AuthLayout({ children, title }) {
    const { locale, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <img 
                            src={settings?.site_logo ? (settings.site_logo.startsWith('http') || settings.site_logo.startsWith('/storage') ? settings.site_logo : `/storage/${settings.site_logo}`) : '/icon.png'} 
                            alt={trans('brand_name')} 
                            className="h-12 w-auto mx-auto mb-3 object-contain" 
                            onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                        />
                        <h1 className="text-2xl font-bold text-secondary-950">{trans('brand_name')}</h1>
                        <p className="text-sm text-muted mt-1">{trans('brand_tagline')}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
                        {title && (
                            <h2 className="text-xl font-semibold text-secondary-950 mb-6 text-center">
                                {title}
                            </h2>
                        )}

                        {children}
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 text-xs text-muted">
                &copy; {new Date().getFullYear()} {trans('brand_name')}
            </footer>
        </div>
    )
}
