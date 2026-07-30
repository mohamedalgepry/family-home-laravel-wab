import { localizedPath } from '../../Utils/route'
import { usePage, useForm } from '@inertiajs/react'
import { InputField } from '../../Components/UI/InputField'
import { Button } from '../../Components/UI/Button'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { useTrans } from '../../Utils/trans'

export default function ResetPassword() {
    const { locale } = usePage().props
    const trans = useTrans(locale)

    const { data, setData, post, processing, errors } = useForm({
        token: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/reset-password')
    }

    return (
        <AuthLayout title={trans('reset_password_title')}>
            <form onSubmit={handleSubmit} noValidate>
                <input type="hidden" name="token" value={data.token} />

                <InputField
                    name="email"
                    label={trans('email')}
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    placeholder={trans('email_placeholder')}
                    required
                    autoComplete="email"
                />

                <InputField
                    name="password"
                    label={trans('new_password')}
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                />

                <p className="text-xs text-muted mb-4 -mt-2">
                    {trans('password_requirements')}
                </p>

                <InputField
                    name="password_confirmation"
                    label={trans('confirm_password')}
                    type="password"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                />

                <Button type="submit" disabled={processing}>
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {trans('reset_button')}
                        </span>
                    ) : trans('reset_button')}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <a
                    href={localizedPath('/login', locale)}
                    className="text-sm text-primary-900 hover:text-primary-950 underline-offset-2 hover:underline"
                >
                    {trans('back_to_login')}
                </a>
            </div>
        </AuthLayout>
    )
}
