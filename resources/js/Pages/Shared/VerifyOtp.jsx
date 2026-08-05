import { useState } from 'react'
import { usePage, useForm, Link } from '@inertiajs/react'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { useTrans } from '../../Utils/trans'

export default function VerifyOtp() {
    const { locale, flash, status: pageStatus, email: propEmail } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const statusMessage = pageStatus || flash?.status || flash?.success

    const { data, setData, post, processing, errors } = useForm({
        email: propEmail || '',
        code: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/verify-otp')
    }

    return (
        <AuthLayout
            title={isRtl ? 'تأكيد رمز التحقق' : 'Verify Security Code'}
            subtitle={isRtl ? 'أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني' : 'Enter the 6-digit code sent to your email address'}
        >
            {statusMessage && (
                <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{statusMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-secondary-800 mb-1">
                        {trans('email')}
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        readOnly
                        value={data.email}
                        className={`w-full px-3 py-2.5 bg-slate-100 text-secondary-700 border ${
                            errors.email ? 'border-red-500' : 'border-secondary-200'
                        } rounded-xl text-sm cursor-not-allowed`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-secondary-800 mb-1">
                        {isRtl ? 'رمز التحقق (6 أرقام)' : 'Verification Code (6 digits)'}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="code"
                            maxLength={6}
                            required
                            autoFocus
                            value={data.code}
                            onChange={e => setData('code', e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className={`w-full px-4 py-3 text-center tracking-[0.75em] text-lg font-bold bg-slate-50 text-secondary-950 border ${
                                errors.code ? 'border-red-500 focus:ring-red-500/20' : 'border-secondary-200 focus:border-red-600 focus:ring-red-600/10'
                            } rounded-xl transition-all focus:bg-white focus:outline-none focus:ring-4`}
                        />
                    </div>
                    {errors.code && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                            {errors.code}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing || data.code.length !== 6}
                        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all transform active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>{isRtl ? 'جارٍ التحقق...' : 'Verifying...'}</span>
                            </>
                        ) : (
                            <span>{isRtl ? 'متابعة وتأكيد الرمز' : 'Verify Code & Proceed'}</span>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center flex items-center justify-between text-xs font-medium">
                <Link
                    href="/forgot-password"
                    className="text-secondary-600 hover:text-secondary-800 hover:underline transition-colors"
                >
                    {isRtl ? 'إعادة طلب الرمز' : 'Resend Code'}
                </Link>
                <Link
                    href="/login"
                    className="text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                    {trans('back_to_login')}
                </Link>
            </div>
        </AuthLayout>
    )
}
