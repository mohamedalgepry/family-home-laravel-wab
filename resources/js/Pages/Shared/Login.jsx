import { usePage, useForm } from '@inertiajs/react'
import { InputField } from '../../Components/UI/InputField'
import { Button } from '../../Components/UI/Button'
import AuthLayout from '../../Components/Layout/AuthLayout'
import { useTrans } from '../../Utils/trans'

export default function Login() {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/login')
    }

    return (
        <AuthLayout title={trans('login_title')}>
            <form onSubmit={handleSubmit} noValidate>
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
                    label={trans('password')}
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                />

                <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center gap-2 text-sm text-secondary-700 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
                        />
                        {trans('remember_me')}
                    </label>
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {trans('login_button')}
                        </span>
                    ) : trans('login_button')}
                </Button>
            </form>
        </AuthLayout>
    )
}
