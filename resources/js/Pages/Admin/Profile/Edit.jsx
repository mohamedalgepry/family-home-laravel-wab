import { usePage, useForm, Head, Link } from '@inertiajs/react'
import { useRef, useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { useTrans } from '../../../Utils/trans'

export default function Edit({ user }) {
    const { auth, locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const fileInput = useRef(null)

    const currentUser = user || auth?.user || {}
    const initialAvatar = currentUser.avatar ? (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('/storage') ? currentUser.avatar : `/storage/${currentUser.avatar}`) : null
    const [preview, setPreview] = useState(initialAvatar)

    const { data, setData, post, processing, errors } = useForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || '',
        facebook: currentUser.facebook || '',
        linkedin: currentUser.linkedin || '',
        password: '',
        password_confirmation: '',
        avatar: null,
    })

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
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                required
                                dir="ltr"
                            />
                            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                        </div>
                    </div>

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
