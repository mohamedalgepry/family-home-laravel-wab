import { usePage, useForm, router } from '@inertiajs/react'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { InputField } from '../../Components/UI/InputField'
import { Button } from '../../Components/UI/Button'
import { useTrans } from '../../Utils/trans'

export default function Profile() {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const user = auth.user

    const profileForm = useForm({
        name: user?.name || '',
        phone: user?.phone || '',
        whatsapp: user?.whatsapp || '',
        facebook: user?.facebook || '',
    })

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    function handleProfileSubmit(e) {
        e.preventDefault()
        profileForm.put('/profile')
    }

    function handlePasswordSubmit(e) {
        e.preventDefault()
        passwordForm.put('/password')
    }

    function handleAvatarChange(e) {
        const file = e.target.files?.[0]
        if (file) {
            const form = new FormData()
            form.append('avatar', file)
            router.post('/profile/avatar', form, {
                forceFormData: true,
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthLayout title={trans('profile_title')}>
            <div className="space-y-8">
                {/* Profile Info Section */}
                <section>
                    <h3 className="text-lg font-semibold text-secondary-950 mb-4">
                        {trans('profile_info')}
                    </h3>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-surface overflow-hidden flex-shrink-0 border-2 border-secondary-200">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} width={80} height={80} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-secondary-400 bg-surface">
                                    {user?.name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-secondary-950">{user?.name}</p>
                            <p className="text-xs text-muted">{user?.email}</p>
                            <label className="inline-block mt-2 text-xs text-primary-900 hover:text-primary-950 cursor-pointer underline-offset-2 hover:underline">
                                {trans('upload_avatar')}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} noValidate>
                        <InputField
                            name="name"
                            label={trans('name')}
                            value={profileForm.data.name}
                            onChange={e => profileForm.setData('name', e.target.value)}
                            required
                        />

                        <InputField
                            name="phone"
                            label={trans('phone')}
                            type="tel"
                            value={profileForm.data.phone}
                            onChange={e => profileForm.setData('phone', e.target.value)}
                            dir="ltr"
                        />

                        <InputField
                            name="whatsapp"
                            label={trans('whatsapp')}
                            type="tel"
                            value={profileForm.data.whatsapp}
                            onChange={e => profileForm.setData('whatsapp', e.target.value)}
                            dir="ltr"
                        />

                        <InputField
                            name="facebook"
                            label={trans('facebook')}
                            type="url"
                            value={profileForm.data.facebook}
                            onChange={e => profileForm.setData('facebook', e.target.value)}
                            dir="ltr"
                        />

                        <Button
                            type="submit"
                            disabled={profileForm.processing}
                            className="mt-2"
                        >
                            {profileForm.processing ? trans('loading') : trans('save')}
                        </Button>
                    </form>
                </section>

                <hr className="border-secondary-200" />

                {/* Change Password Section */}
                <section>
                    <h3 className="text-lg font-semibold text-secondary-950 mb-4">
                        {trans('change_password')}
                    </h3>

                    <form onSubmit={handlePasswordSubmit} noValidate>
                        <InputField
                            name="current_password"
                            label={trans('current_password')}
                            type="password"
                            value={passwordForm.data.current_password}
                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />

                        <InputField
                            name="password"
                            label={trans('new_password')}
                            type="password"
                            value={passwordForm.data.password}
                            onChange={e => passwordForm.setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                        />

                        <InputField
                            name="password_confirmation"
                            label={trans('confirm_password')}
                            type="password"
                            value={passwordForm.data.password_confirmation}
                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="mt-2"
                        >
                            {passwordForm.processing ? trans('loading') : trans('change_password')}
                        </Button>
                    </form>
                </section>
            </div>
        </AuthLayout>
    )
}
