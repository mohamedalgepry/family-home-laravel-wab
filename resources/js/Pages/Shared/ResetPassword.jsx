import { usePage, useForm, Link } from '@inertiajs/react'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { useTrans } from '../../Utils/trans'
import { useState, useEffect } from 'react'

export default function ResetPassword({ token, email, secondsRemaining = 60, error: propError }) {
    const { locale, flash, status: pageStatus } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [showPassword, setShowPassword] = useState(false)
    const [timeLeft, setTimeLeft] = useState(secondsRemaining)

    const statusMessage = pageStatus || flash?.status || flash?.success

    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1;
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const isExpired = timeLeft <= 0 || Boolean(propError)

    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        if (isExpired) return
        post('/reset-password')
    }

    return (
        <AuthLayout
            title={trans('reset_password_title')}
            subtitle={isRtl ? 'أدخل كلمة السر الجديدة لحسابك خلال المهلة المحددة (5 دقائق)' : 'Enter your new password within the 5-minute window'}
        >
            {/* Live Countdown Badge */}
            <div className={`mb-5 p-4 rounded-xl border flex items-center justify-between transition-colors ${
                isExpired 
                    ? 'bg-red-50 border-red-200 text-red-800' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
                <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 shrink-0 ${isExpired ? 'text-red-600' : 'text-amber-600 animate-pulse'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold">
                        {isExpired
                            ? (isRtl ? 'انتهت المهلة المحددة (5 دقائق)!' : 'The 5-minute time window has expired!')
                            : (isRtl ? 'الوقت المتبقي لإعادة التعيين:' : 'Time remaining to reset:')}
                    </span>
                </div>
                {!isExpired && (
                    <span className="px-3 py-1 bg-amber-200/60 text-amber-950 font-mono font-bold text-sm rounded-lg shadow-sm">
                        {timeLeft} {isRtl ? 'ثانية' : 's'}
                    </span>
                )}
            </div>

            {propError && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-medium flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{propError}</span>
                </div>
            )}

            {statusMessage && !propError && (
                <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{statusMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <input type="hidden" name="token" value={data.token} />
                <input type="hidden" name="email" value={data.email} />

                {!email && (
                    <div>
                        <label className="block text-xs font-medium text-secondary-800 mb-1">
                            {trans('email')}
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                disabled={isExpired}
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder={trans('email_placeholder')}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-secondary-200 rounded-xl text-sm disabled:opacity-50"
                            />
                        </div>
                    </div>
                )}

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
                            disabled={isExpired}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full ps-9 pe-10 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${
                                errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-secondary-200 focus:border-red-600 focus:ring-red-600/10'
                            } rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4 disabled:opacity-50`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 end-0 pe-3 flex items-center text-secondary-400 hover:text-secondary-700 transition-colors"
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
                            disabled={isExpired}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full ps-9 pe-3 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${
                                errors.password_confirmation ? 'border-red-500 focus:ring-red-500/20' : 'border-secondary-200 focus:border-red-600 focus:ring-red-600/10'
                            } rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4 disabled:opacity-50`}
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
                    {isExpired ? (
                        <Link
                            href="/forgot-password"
                            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md text-center block transition-all"
                        >
                            {isRtl ? 'طلب رمز تحقق جديد' : 'Request New Code'}
                        </Link>
                    ) : (
                        <button
                            type="submit"
                            disabled={processing || isExpired}
                            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all transform active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
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
                                <span>{isRtl ? 'تغيير كلمة المرور الآن' : 'Update Password Now'}</span>
                            )}
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                    {trans('back_to_login')}
                </Link>
            </div>
        </AuthLayout>
    )
}
