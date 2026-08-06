import { usePage, useForm, Head, Link, router } from '@inertiajs/react'
import { useRef, useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { useTrans } from '../../../Utils/trans'

export default function Edit({ user }) {
    const { auth, locale, flash, errors: pageErrors } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const fileInput = useRef(null)

    const currentUser = user || auth?.user || {}
    const initialAvatar = currentUser.avatar ? (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('/storage') ? currentUser.avatar : `/storage/${currentUser.avatar}`) : null
    const [preview, setPreview] = useState(initialAvatar)

    const [newEmail, setNewEmail] = useState(currentUser.email || '')
    const [otpSent, setOtpSent] = useState(false)
    const [otpCode, setOtpCode] = useState('')
    const [emailSending, setEmailSending] = useState(false)
    const [emailVerifying, setEmailVerifying] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || '',
        facebook: currentUser.facebook || '',
        linkedin: currentUser.linkedin || '',
        password: '',
        password_confirmation: '',
        avatar: null,
    })

    const isEmailChanged = newEmail.trim().toLowerCase() !== (currentUser.email || '').trim().toLowerCase()

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (file) {
            setData('avatar', file)
            setPreview(URL.createObjectURL(file))
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        post('/admin/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setData('password', '')
                setData('password_confirmation', '')
            }
        })
    }

    function handleSendEmailOtp() {
        setEmailSending(true)
        router.post('/admin/profile/send-email-otp', {
            new_email: newEmail,
        }, {
            preserveScroll: true,
            onFinish: () => setEmailSending(false),
            onSuccess: () => {
                setOtpSent(true)
            }
        })
    }

    function handleVerifyEmailOtp() {
        setEmailVerifying(true)
        router.post('/admin/profile/verify-email-otp', {
            new_email: newEmail,
            code: otpCode,
        }, {
            preserveScroll: true,
            onFinish: () => setEmailVerifying(false),
            onSuccess: () => {
                setOtpSent(false)
                setOtpCode('')
            }
        })
    }

    return (
        <AdminSidebar title={trans('my_profile', {}, 'admin')}>
            <Head title={trans('my_profile') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto bg-white rounded-xl shadow-card p-6">
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
                        {flash.success}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInput.current?.click()}>
                            {preview ? (
                                <img src={preview} alt={data.name} className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-primary-100" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 text-3xl font-bold border-2 border-primary-100">
                                    {data.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                ref={fileInput}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="flex-1 text-center sm:text-start pt-2">
                            <h3 className="text-lg font-bold text-secondary-950">{data.name}</h3>
                            <p className="text-sm text-muted">{trans(currentUser.role || 'user')}</p>
                            {errors.avatar && <p className="text-xs text-error mt-1">{errors.avatar}</p>}
                        </div>
                    </div>

                    <hr className="border-secondary-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('name', {}, 'admin')}</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                required
                            />
                            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('email', {}, 'admin')}</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={e => {
                                    setNewEmail(e.target.value)
                                    setOtpSent(false)
                                    setOtpCode('')
                                }}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                dir="ltr"
                            />
                            {pageErrors?.new_email && <p className="text-xs text-error mt-1">{pageErrors.new_email}</p>}
                        </div>
                    </div>

                    {/* Email OTP Change Flow */}
                    {isEmailChanged && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                            <p className="text-xs font-semibold text-amber-900">
                                {isRtl
                                    ? 'تنبيه: يتطلب تغيير البريد الإلكتروني تأكيد رمز التحقق (OTP) المرسل للبريد الجديد.'
                                    : 'Notice: Changing your email address requires verifying an OTP code sent to the new email.'}
                            </p>

                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendEmailOtp}
                                    disabled={emailSending || !newEmail.trim()}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                >
                                    {emailSending
                                        ? (isRtl ? 'جارٍ إرسال الرمز...' : 'Sending code...')
                                        : trans('send_code_to_new_email')}
                                </button>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
                                        {trans('enter_email_otp_hint')}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                            placeholder="123456"
                                            className="w-36 px-3 py-2 border border-secondary-300 rounded-lg text-center font-bold text-base tracking-widest bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyEmailOtp}
                                            disabled={emailVerifying || otpCode.length !== 6}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                        >
                                            {emailVerifying
                                                ? (isRtl ? 'جارٍ التأكيد...' : 'Verifying...')
                                                : trans('verify_and_update_email')}
                                        </button>
                                    </div>
                                    {pageErrors?.code && <p className="text-xs text-error mt-1">{pageErrors.code}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('phone', {}, 'admin')}</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                dir="ltr"
                            />
                            {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('whatsapp', {}, 'admin')}</label>
                            <input
                                type="text"
                                value={data.whatsapp}
                                onChange={e => setData('whatsapp', e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                placeholder="+2010..."
                                dir="ltr"
                            />
                            {errors.whatsapp && <p className="text-xs text-error mt-1">{errors.whatsapp}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('facebook_link', {}, 'admin')}</label>
                            <input
                                type="url"
                                value={data.facebook}
                                onChange={e => setData('facebook', e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                placeholder="https://facebook.com/..."
                                dir="ltr"
                            />
                            {errors.facebook && <p className="text-xs text-error mt-1">{errors.facebook}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('social_linkedin', {}, 'admin')}</label>
                            <input
                                type="url"
                                value={data.linkedin}
                                onChange={e => setData('linkedin', e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                placeholder="https://linkedin.com/in/..."
                                dir="ltr"
                            />
                            {errors.linkedin && <p className="text-xs text-error mt-1">{errors.linkedin}</p>}
                        </div>
                    </div>

                    <hr className="border-secondary-100" />

                    <div>
                        <h4 className="text-sm font-bold text-secondary-950 mb-1">{trans('change_password', {}, 'users')}</h4>
                        <p className="text-xs text-muted mb-3">{isRtl ? 'اترك حقول كلمة السر فارغة إذا كنت لا ترغب في تغيير كلمة السر الحالية' : 'Leave password fields blank if you do not wish to change your current password'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('new_password', {}, 'users')}</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('confirm_password', {}, 'users')}</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50"
                        >
                            {processing ? trans('loading', {}, 'common') : trans('save', {}, 'common')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminSidebar>
    )
}
