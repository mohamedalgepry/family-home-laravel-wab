import { usePage, useForm, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow , Select} from '../../../Components/UI'

export default function PointsIndex({ managers, ledger, units, filters, pointsSettings }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const user = auth?.user
    const isAdmin = user?.role === 'admin'
    const isManager = user?.role === 'manager'
    const loading = !managers || !ledger

    const [showAllocateModal, setShowAllocateModal] = useState(false)
    const [showResetConfirm, setShowResetConfirm] = useState(false)
    const [localFilters, setLocalFilters] = useState(filters || { manager_id: '', type: '', date_from: '', date_to: '', search: '' })
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        if (filters) setLocalFilters(filters)
    }, [filters])

    const { data, setData, post, processing } = useForm({
        unit_id: '',
        points: '',
        notes: '',
    })

    function updateFilter(key, value) {
        setLocalFilters(prev => ({ ...prev, [key]: value }))
    }

    function applyFilters() {
        router.get('/admin/points', localFilters, { preserveState: true, preserveScroll: true })
    }

    function resetFilters() {
        const empty = { manager_id: '', type: '', date_from: '', date_to: '', search: '' }
        setLocalFilters(empty)
        router.get('/admin/points')
    }

    function validateAllocate() {
        const errors = {}
        if (!data.unit_id) errors.unit_id = trans('field_required', {}, 'points')
        if (!data.points || isNaN(data.points) || Number(data.points) <= 0) errors.points = trans('points_must_be_positive', {}, 'points')
        if (data.points && Number(data.points) > (user?.points_balance || 0)) errors.points = trans('points_exceed_balance', {}, 'points')
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    function handleAllocate(e) {
        e.preventDefault()
        if (!validateAllocate()) return
        post('/admin/points/allocate', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAllocateModal(false)
                setData({ unit_id: '', points: '', notes: '' })
                setFormErrors({})
            },
        })
    }

    function handleResetConfirm() {
        router.post('/admin/points/reset', {}, {
            preserveScroll: true,
            onSuccess: () => setShowResetConfirm(false),
        })
    }

    function handleDailyDeduct() {
        router.post('/admin/points/daily-deduct', {}, { preserveScroll: true })
    }

    const typeOptions = [
        { value: '', label: trans('transaction_type') },
        { value: 'allocate', label: trans('allocate') },
        { value: 'daily_deduct', label: trans('daily_deduction') },
        { value: 'monthly_reset', label: trans('monthly_reset') },
        { value: 'admin_adjust', label: trans('admin_adjust') },
    ]

    return (
        <AdminSidebar>
            <Head title={trans('points') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_points')}</h1>
                    <div className="flex gap-3">
                        {isManager && (
                            <button onClick={() => setShowAllocateModal(true)} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors">
                                {trans('allocate_points')}
                            </button>
                        )}
                        {isAdmin && (
                            <>
                                <button onClick={handleDailyDeduct} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                                    {trans('run_daily_deduct', {}, 'points')}
                                </button>
                                <button onClick={() => setShowResetConfirm(true)} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                                    {trans('monthly_reset')}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Section 1: Managers Balances Table */}
                <div className="bg-white rounded-xl shadow-card overflow-x-auto mb-6">
                    <div className="px-4 py-3 border-b border-secondary-100">
                        <h2 className="text-lg font-semibold text-secondary-950">{trans('managers_balances', {}, 'points')}</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">{trans('name')}</th>
                                <th className="px-4 py-3 font-medium">{trans('current_balance', {}, 'points')}</th>
                                <th className="px-4 py-3 font-medium">{trans('initial_balance', {}, 'points')}</th>
                                <th className="px-4 py-3 font-medium">{trans('units_count', {}, 'projects')}</th>
                                <th className="px-4 py-3 font-medium">{trans('last_update', {}, 'points')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                            ) : managers?.length > 0 ? (
                                managers.map(mgr => (
                                    <tr key={mgr.id} className="border-t border-secondary-100 hover:bg-surface/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-secondary-950">{mgr.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${(mgr.points_balance ?? 0) > 0 ? 'text-green-600' : 'text-secondary-700'}`}>
                                                {mgr.points_balance ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-secondary-700">{mgr.initial_monthly_balance ?? 0}</td>
                                        <td className="px-4 py-3">{mgr.units_count ?? 0}</td>
                                        <td className="px-4 py-3 text-muted text-xs">
                                            {mgr.updated_at
                                                ? new Date(mgr.updated_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                  })
                                                : '—'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted">
                                        {trans('no_managers')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Section 2: Points Ledger Table */}
                <div className="bg-white rounded-xl shadow-card overflow-x-auto">
                    <div className="px-4 py-3 border-b border-secondary-100">
                        <h2 className="text-lg font-semibold text-secondary-950">{trans('points_ledger', {}, 'points')}</h2>
                    </div>

                    {/* Filters */}
                    <div className="p-4 border-b border-secondary-100 flex flex-wrap gap-3 items-end">
                        <div>
                            <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('transaction_type')}</label>
                            <Select value={localFilters.type} onChange={e => updateFilter('type', e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900">
                                {typeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </Select>
                        </div>
                        {managers?.length > 0 && (
                            <div>
                                <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('manager')}</label>
                                <Select value={localFilters.manager_id} onChange={e => updateFilter('manager_id', e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900">
                                    <option value="">{trans('all_managers')}</option>
                                    {managers.map(mgr => (
                                        <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('date_from')}</label>
                            <input type="date" value={localFilters.date_from} onChange={e => updateFilter('date_from', e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('date_to')}</label>
                            <input type="date" value={localFilters.date_to} onChange={e => updateFilter('date_to', e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('search')}</label>
                            <input type="text" value={localFilters.search || ''} onChange={e => updateFilter('search', e.target.value)} placeholder={trans('search')} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={applyFilters} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors">
                                {trans('search')}
                            </button>
                            <button onClick={resetFilters} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                {trans('reset')}
                            </button>
                        </div>
                    </div>

                    {/* Ledger Table */}
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">{trans('transaction_date')}</th>
                                <th className="px-4 py-3 font-medium">{trans('transaction_type')}</th>
                                <th className="px-4 py-3 font-medium">{trans('manager')}</th>
                                <th className="px-4 py-3 font-medium">{trans('target_unit')}</th>
                                <th className="px-4 py-3 font-medium">{trans('points')}</th>
                                <th className="px-4 py-3 font-medium">{trans('balance_after')}</th>
                                <th className="px-4 py-3 font-medium">{trans('notes')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                            ) : ledger?.data?.length > 0 ? (
                                ledger.data.map(tx => (
                                    <tr key={tx.id} className="border-t border-secondary-100 hover:bg-surface/50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            }) : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${tx.type === 'allocate' || tx.type === 'admin_adjust' ? 'text-green-600' : tx.type === 'daily_deduct' ? 'text-amber-600' : 'text-secondary-950'}`}>
                                                {trans(tx.type) || tx.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{tx.manager?.name ?? tx.performed_by ?? '—'}</td>
                                        <td className="px-4 py-3">{tx.unit?.name ?? '—'}</td>
                                        <td className={`px-4 py-3 font-medium ${(tx.points ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {tx.points >= 0 ? '+' : ''}{tx.points}
                                        </td>
                                        <td className="px-4 py-3">{tx.balance_after ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted max-w-40 truncate" title={tx.notes}>{tx.notes ?? '—'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted">
                                        {trans('no_transactions')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {ledger?.meta && ledger.meta.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-secondary-100 flex items-center justify-between text-sm">
                            <span className="text-muted">
                                {trans('showing')} {ledger.meta.from ?? 0}–{ledger.meta.to ?? 0} {trans('of')} {ledger.meta.total}
                            </span>
                            <div className="flex gap-1">
                                {ledger.links?.prev && (
                                    <button onClick={() => router.get(ledger.links.prev, {}, { preserveState: true, preserveScroll: true })} className="px-3 py-1 bg-surface text-secondary-700 rounded text-xs hover:bg-secondary-200">
                                        {trans('previous')}
                                    </button>
                                )}
                                {ledger.links?.next && (
                                    <button onClick={() => router.get(ledger.links.next, {}, { preserveState: true, preserveScroll: true })} className="px-3 py-1 bg-surface text-secondary-700 rounded text-xs hover:bg-secondary-200">
                                        {trans('next')}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal: Allocate Points */}
                {showAllocateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAllocateModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-secondary-950">{trans('allocate_points')}</h3>
                                <button onClick={() => setShowAllocateModal(false)} className="text-muted hover:text-secondary-950 text-xl leading-none">&times;</button>
                            </div>
                            <form onSubmit={handleAllocate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('target_unit')} *</label>
                                    <Select value={data.unit_id} onChange={e => setData('unit_id', e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 ${formErrors.unit_id ? 'border-red-500' : 'border-secondary-200'}`}>
                                        <option value="">—</option>
                                        {units?.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </Select>
                                    {formErrors.unit_id && <p className="text-xs text-red-500 mt-1">{formErrors.unit_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('points')} *</label>
                                    <input type="number" min="1" max={user?.points_balance ?? 0} value={data.points} onChange={e => setData('points', e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 ${formErrors.points ? 'border-red-500' : 'border-secondary-200'}`} />
                                    {formErrors.points && <p className="text-xs text-red-500 mt-1">{formErrors.points}</p>}
                                    <p className="text-xs text-muted mt-1">{trans('available_balance')}: {user?.points_balance ?? 0}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('notes')}</label>
                                    <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAllocateModal(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50">
                                        {processing ? trans('loading') : trans('allocate')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal: Monthly Reset Confirmation */}
                {showResetConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowResetConfirm(false)}>
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold text-secondary-950 mb-2">{trans('monthly_reset_confirm_title')}</h3>
                            <p className="text-sm text-secondary-700 mb-6">
                                {trans('monthly_reset_confirm_text')}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                    {trans('cancel')}
                                </button>
                                <button onClick={handleResetConfirm} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                                    {trans('confirm')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Info */}
                {pointsSettings && (
                    <div className="mt-6 p-4 bg-white rounded-xl shadow-card text-xs text-muted">
                        <span className="font-medium text-secondary-700">{trans('settings')}:</span>{' '}
                        {pointsSettings.daily_deduction_enabled
                            ? `${trans('daily_deduction')}: ${pointsSettings.daily_deduction_value} pts`
                            : `${trans('daily_deduction')}: ${trans('disabled')}`}
                        {' | '}
                        {trans('monthly_reset')}: {trans('day')} {pointsSettings.monthly_reset_day}
                        {pointsSettings.monthly_reset_auto ? ` (${trans('auto')})` : ''}
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}
