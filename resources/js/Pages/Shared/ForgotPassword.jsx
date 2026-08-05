import { usePage, useForm, Link } from '@inertiajs/react'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { useTrans } from '../../Utils/trans'

export default function ForgotPassword() {
    const { locale, flash, status: pageStatus } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const statusMessage = pageStatus || flash?.status || flash?.success

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/forgot-password')
    }

    return (
        <AuthLayout
            title={trans('reset_password_title')}
            subtitle={isRtl ? 'أدخل معلومات حسابك لإرسال رابط التعيين' : 'Enter your email to receive a password reset link'}
        >
            {statusMessage && (
                <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{statusMessage}</span>
                </div>
            )}

            <p className="text-xs text-secondary-600 mb-5 leading-relaxed text-center">
                {trans('forgot_password')}
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-secondary-800 mb-1">
                        {trans('email')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-secondary-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder={trans('email_placeholder')}
                            className={`w-full ps-9 pe-3 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${
                                errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-secondary-200 focus:border-primary-900 focus:ring-primary-900/10'
                            } rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4`}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 bg-primary-900 hover:bg-primary-950 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>{isRtl ? 'جارٍ الإرسال...' : 'Sending...'}</span>
                            </>
                        ) : (
                            <span>{trans('send_reset_link')}</span>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="text-xs font-medium text-primary-900 hover:text-primary-950 hover:underline transition-colors"
                >
                    {trans('back_to_login')}
                </Link>
            </div>
        </AuthLayout>
    )
}
