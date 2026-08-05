import { usePage, useForm, Link } from '@inertiajs/react'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { useTrans } from '../../Utils/trans'
import { useState } from 'react'

export default function ResetPassword({ token, email }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [showPassword, setShowPassword] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/reset-password')
    }

    return (
        <AuthLayout
            title={trans('reset_password_title')}
            subtitle={isRtl ? 'أدخل كلمة السر الجديدة لحسابك' : 'Enter your new password below'}
        >
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <input type="hidden" name="token" value={data.token} />

                {/* Email Input */}
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

                {/* New Password */}
                <div>
                    <label className="block text-xs font-medium text-secondary-800 mb-1">
                        {trans('new_password')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-secondary-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            autoComplete="new-password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full ps-9 pe-10 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${
                                errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-secondary-200 focus:border-primary-900 focus:ring-primary-900/10'
                            } rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 end-0 pe-3 flex items-center text-secondary-400 hover:text-secondary-700 transition-colors"
                            aria-label={showPassword ? (isRtl ? 'إخفاء كلمة المرور' : 'Hide password') : (isRtl ? 'إظهار كلمة المرور' : 'Show password')}
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12c1.349-3.938 5.143-7 9.964-7s8.615 3.062 9.964 7c-1.349 3.938-5.143 7-9.964 7s-8.615-3.062-9.964-7z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-xs font-medium text-secondary-800 mb-1">
                        {trans('confirm_password')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-secondary-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            required
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full ps-9 pe-3 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${
                                errors.password_confirmation ? 'border-red-500 focus:ring-red-500/20' : 'border-secondary-200 focus:border-primary-900 focus:ring-primary-900/10'
                            } rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4`}
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <p className="text-xs text-secondary-500 pt-0.5">
                    {trans('password_requirements')}
                </p>

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
                                <span>{isRtl ? 'جارٍ الحفظ...' : 'Saving...'}</span>
                            </>
                        ) : (
                            <span>{trans('reset_button')}</span>
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
