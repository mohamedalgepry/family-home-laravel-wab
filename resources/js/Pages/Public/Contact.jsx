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

    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_phone: '',
        client_email: '',
        content: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        if (processing || isSubmitting) return;

        setIsSubmitting(true)
        const submitUrl = window.location.pathname.startsWith('/en') ? '/en/contact' : (window.location.pathname.startsWith('/ar') ? '/ar/contact' : '/contact')
        post(submitUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setData({ client_name: '', client_phone: '', client_email: '', content: '' })
                setSentSuccess(true)
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
                canonical={window.location.href}
            />
            <Header />

            <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
                <h1 className="text-3xl font-bold text-secondary-950 mb-2">{trans('contact')}</h1>
                <p className="text-sm text-muted mb-8">{trans('contact_info')}</p>

                {(sentSuccess || flash?.success) && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
                        {flash?.success || (isRtl ? 'تم إرسال رسالتك بنجاح، وسنتواصل معك في أقرب وقت.' : 'Your message has been sent successfully!')}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('your_name', {}, 'messages')}</label>
                            <input
                                type="text"
                                value={data.client_name}
                                onChange={e => setData('client_name', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                            />
                            {errors.client_name && <p className="text-xs text-error mt-1">{errors.client_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('your_phone', {}, 'messages')}</label>
                                <input
                                    type="tel"
                                    value={data.client_phone}
                                    onChange={e => setData('client_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('your_email', {}, 'messages')}</label>
                                <input
                                    type="email"
                                    value={data.client_email}
                                    onChange={e => setData('client_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('your_message', {}, 'messages')}</label>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                required
                                rows={5}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                            />
                            {errors.content && <p className="text-xs text-error mt-1">{errors.content}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || isSubmitting}
                            className="w-full px-4 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
