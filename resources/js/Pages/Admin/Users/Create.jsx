import { usePage, useForm, Head, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { Select } from '../../../Components/UI'

export default function AdminUsersCreate({ managers }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'agent',
        manager_id: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post('/admin/users')
    }

    return (
        <AdminSidebar>
            <Head title={trans('users.add_user') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-950">{trans('users.add_user')}</h1>
                    </div>
                    <Link href="/admin/users" className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-surface">
                        {trans('back')}
                    </Link>
                </div>

                <div className="max-w-3xl bg-white rounded-xl shadow-card p-6 border border-secondary-100">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('users.name')} *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white"
                                required
                            />
                            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('users.email')} *</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white"
                                required
                            />
                            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('password')} *</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white"
                                    required
                                />
                                {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('password_confirmation')} *</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('users.role')} *</label>
                            <Select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-white"
                                required
                            >
                                <option value="admin">{trans('users.role_admin') || 'مدير عام'}</option>
                                <option value="manager">{trans('users.role_manager') || 'مدير'}</option>
                                <option value="agent">{trans('users.role_agent') || 'موظف'}</option>
                            </Select>
                            {errors.role && <p className="text-xs text-error mt-1">{errors.role}</p>}
                        </div>

                        {data.role === 'agent' && (
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('users.manager')} ({isRtl ? 'اختياري - التلقائي الأدمن الحالي' : 'Optional - Default current Admin'})</label>
                                <Select
                                    value={data.manager_id}
                                    onChange={e => setData('manager_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-white"
                                >
                                    <option value="">{isRtl ? 'تلقائياً (أنا الأدمن الحالي)' : 'Default (Current Admin)'}</option>
                                    {managers?.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </Select>
                                {errors.manager_id && <p className="text-xs text-error mt-1">{errors.manager_id}</p>}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-primary-900 text-white rounded-xl text-sm font-semibold hover:bg-primary-950 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                            >
                                {processing && (
                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <span>{processing ? trans('loading') : trans('save')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminSidebar>
    )
}
