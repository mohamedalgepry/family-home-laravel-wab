import { useState } from 'react'
import { usePage, useForm } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import Header from '../../Components/Layout/Header'
import Footer from '../../Components/Layout/Footer'
import SeoHead from '../../Components/UI/SeoHead'

export default function Contact() {
    const { locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [sentSuccess, setSentSuccess] = useState(false)
    const [clientErrors, setClientErrors] = useState({})

    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        content: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    function validateClient() {
        const errs = {}
        const name = (data.client_name || '').trim()
        const phone = (data.client_phone || '').trim().replace(/[\s-]/g, '')
        const email = (data.client_email || '').trim()
        const content = (data.content || '').trim()

        if (!name || name.length < 2) {
            errs.client_name = isRtl ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name'
        }

        if (!phone && !email) {
            errs.client_phone = isRtl ? 'يرجى كتابة رقم الهاتف أو البريد الإلكتروني للتواصل' : 'Please provide either a phone number or email address'
        } else {
            if (phone && !/^\+?[0-9]{7,16}$/.test(phone)) {
                errs.client_phone = isRtl ? 'رقم الهاتف غير صحيح' : 'Invalid phone number format'
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errs.client_email = isRtl ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format'
            }
        }

        if (!content || content.length < 5) {
            errs.content = isRtl ? 'يرجى كتابة تفاصيل رسالتك أو استفسارك (5 أحرف على الأقل)' : 'Please enter your message (at least 5 characters)'
        }

        return errs
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (processing || isSubmitting) return;

        const validation = validateClient()
        if (Object.keys(validation).length > 0) {
            setClientErrors(validation)
            return
        }
        setClientErrors({})

        setIsSubmitting(true)
        const submitUrl = window.location.pathname.startsWith('/en') ? '/en/contact' : (window.location.pathname.startsWith('/ar') ? '/ar/contact' : '/contact')
        post(submitUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setData({ client_name: '', client_phone: '', client_email: '', content: '' })
                setSentSuccess(true)
                setClientErrors({})
                setTimeout(() => setSentSuccess(false), 5000)
            },
            onFinish: () => setIsSubmitting(false),
            onError: () => setIsSubmitting(false),
        })
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${trans('contact')} - ${trans('site_title')}`}
                description={trans('contact_description')}
            />
            <Header />

            <main id="main-content" tabIndex="-1" className="flex-1 max-w-3xl mx-auto px-4 py-12 sm:py-20 w-full focus:outline-none">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black text-secondary-950 mb-4 tracking-tight">{trans('contact')}</h1>
                    <p className="text-sm md:text-base text-secondary-500 max-w-md mx-auto leading-relaxed">{trans('contact_info')}</p>
                    <div className="w-16 h-1.5 bg-primary-900 rounded-full mx-auto mt-6"></div>
                </div>

                {(sentSuccess || flash?.success) && (
                    <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-bold flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash?.success || trans('contact_message_sent_success')}
                    </div>
                )}

                <div className="bg-white rounded-[2rem] shadow-sm border border-secondary-100 p-8 sm:p-12 relative overflow-hidden">
                    <div className="absolute top-0 end-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    <form onSubmit={handleSubmit} noValidate className="relative z-10">
                        <div className="mb-5">
                            <label htmlFor="client_name" className="block text-sm font-bold text-secondary-950 mb-2">{trans('your_name', {}, 'messages')}</label>
                            <input
                                id="client_name"
                                type="text"
                                value={data.client_name}
                                onChange={e => {
                                    setData('client_name', e.target.value)
                                    if (clientErrors.client_name) setClientErrors(prev => ({ ...prev, client_name: null }))
                                }}
                                required
                                aria-invalid={(clientErrors.client_name || errors.client_name) ? 'true' : 'false'}
                                aria-describedby={(clientErrors.client_name || errors.client_name) ? 'client_name_err' : undefined}
                                className={`w-full px-4 py-3 border rounded-2xl text-sm transition-colors ${
                                    (clientErrors.client_name || errors.client_name)
                                        ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20'
                                        : 'border-secondary-200 bg-surface focus:bg-white focus:ring-primary-900/20 focus:border-primary-900'
                                }`}
                            />
                            {(clientErrors.client_name || errors.client_name) && (
                                <p id="client_name_err" role="alert" className="text-xs text-red-600 font-medium mt-1.5">{clientErrors.client_name || errors.client_name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label htmlFor="client_phone" className="block text-sm font-bold text-secondary-950 mb-2">{trans('your_phone', {}, 'messages')}</label>
                                <input
                                    id="client_phone"
                                    type="tel"
                                    value={data.client_phone}
                                    onChange={e => {
                                        setData('client_phone', e.target.value)
                                        if (clientErrors.client_phone) setClientErrors(prev => ({ ...prev, client_phone: null }))
                                    }}
                                    dir="ltr"
                                    aria-invalid={(clientErrors.client_phone || errors.client_phone) ? 'true' : 'false'}
                                    aria-describedby={(clientErrors.client_phone || errors.client_phone) ? 'client_phone_err' : undefined}
                                    className={`w-full px-4 py-3 border rounded-2xl text-sm transition-colors ${
                                        (clientErrors.client_phone || errors.client_phone)
                                            ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20'
                                            : 'border-secondary-200 bg-surface focus:bg-white focus:ring-primary-900/20 focus:border-primary-900'
                                    }`}
                                />
                                {(clientErrors.client_phone || errors.client_phone) && (
                                    <p id="client_phone_err" role="alert" className="text-xs text-red-600 font-medium mt-1.5">{clientErrors.client_phone || errors.client_phone}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="client_email" className="block text-sm font-bold text-secondary-950 mb-2">{trans('your_email', {}, 'messages')}</label>
                                <input
                                    id="client_email"
                                    type="email"
                                    value={data.client_email}
                                    onChange={e => {
                                        setData('client_email', e.target.value)
                                        if (clientErrors.client_email) setClientErrors(prev => ({ ...prev, client_email: null }))
                                    }}
                                    dir="ltr"
                                    aria-invalid={(clientErrors.client_email || errors.client_email) ? 'true' : 'false'}
                                    aria-describedby={(clientErrors.client_email || errors.client_email) ? 'client_email_err' : undefined}
                                    className={`w-full px-4 py-3 border rounded-2xl text-sm transition-colors ${
                                        (clientErrors.client_email || errors.client_email)
                                            ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20'
                                            : 'border-secondary-200 bg-surface focus:bg-white focus:ring-primary-900/20 focus:border-primary-900'
                                    }`}
                                />
                                {(clientErrors.client_email || errors.client_email) && (
                                    <p id="client_email_err" role="alert" className="text-xs text-red-600 font-medium mt-1.5">{clientErrors.client_email || errors.client_email}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="content" className="block text-sm font-bold text-secondary-950 mb-2">{trans('your_message', {}, 'messages')}</label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={e => {
                                    setData('content', e.target.value)
                                    if (clientErrors.content) setClientErrors(prev => ({ ...prev, content: null }))
                                }}
                                required
                                rows={5}
                                aria-invalid={(clientErrors.content || errors.content) ? 'true' : 'false'}
                                aria-describedby={(clientErrors.content || errors.content) ? 'content_err' : undefined}
                                className={`w-full px-4 py-3 border rounded-2xl text-sm transition-colors resize-y ${
                                    (clientErrors.content || errors.content)
                                        ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20'
                                        : 'border-secondary-200 bg-surface focus:bg-white focus:ring-primary-900/20 focus:border-primary-900'
                                }`}
                            />
                            {(clientErrors.content || errors.content) && (
                                <p id="content_err" role="alert" className="text-xs text-red-600 font-medium mt-1.5">{clientErrors.content || errors.content}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || isSubmitting}
                            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-primary-900 text-white rounded-2xl text-sm font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm mx-auto"
                        >
                            {(processing || isSubmitting) && (
                                <svg className="animate-spin h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {(processing || isSubmitting) ? trans('loading') : trans('send_message', {}, 'messages')}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
