import { Select } from '../../../Components/UI'
import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'

const FILTER_MAP = {
    type: '',
    manager_id: '',
    date_from: '',
    date_to: '',
}

export default function PointsLedger({ transactions, managers, filters = FILTER_MAP }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [localFilters, setLocalFilters] = useState(filters)

    function applyFilters() {
        router.get('/admin/points/ledger', localFilters, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    function resetFilters() {
        setLocalFilters(FILTER_MAP)
        router.get('/admin/points/ledger')
    }

    function updateFilter(key, value) {
        setLocalFilters(prev => ({ ...prev, [key]: value }))
    }

    const typeOptions = [
        { value: '', label: trans('transaction_type') },
        { value: 'allocate', label: trans('allocate') },
        { value: 'daily_deduct', label: trans('daily_deduction') },
        { value: 'monthly_reset', label: trans('monthly_reset') },
        { value: 'admin_adjust', label: trans('admin_adjust') },
    ]

    return (
        <div className="p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('ledger')}</h1>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('transaction_type')}</label>
                    <Select
                        value={localFilters.type}
                        onChange={e => updateFilter('type', e.target.value)}
                        className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                    >
                        {typeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                </div>

                {managers && managers.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('performed_by')}</label>
                        <Select
                            value={localFilters.manager_id}
                            onChange={e => updateFilter('manager_id', e.target.value)}
                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                        >
                            <option value="">{trans('performed_by')}</option>
                            {managers.map(mgr => (
                                <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
                            ))}
                        </Select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('transaction_date')}</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="date"
                            value={localFilters.date_from}
                            onChange={e => updateFilter('date_from', e.target.value)}
                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                        />
                        <span className="text-muted">—</span>
                        <input
                            type="date"
                            value={localFilters.date_to}
                            onChange={e => updateFilter('date_to', e.target.value)}
                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors"
                    >
                        {trans('search')}
                    </button>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-surface text-secondary-950 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                    >
                        {trans('reset')}
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-card overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-surface text-secondary-950 text-start">
                            <th className="px-4 py-3 font-medium">{trans('transaction_date')}</th>
                            <th className="px-4 py-3 font-medium">{trans('transaction_type')}</th>
                            <th className="px-4 py-3 font-medium">{trans('performed_by')}</th>
                            <th className="px-4 py-3 font-medium">{trans('target_unit')}</th>
                            <th className="px-4 py-3 font-medium">{trans('points')}</th>
                            <th className="px-4 py-3 font-medium">{trans('balance_after')}</th>
                            <th className="px-4 py-3 font-medium">{trans('notes')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.data?.length > 0 ? (
                            transactions.data.map(tx => (
                                <tr key={tx.id} className="border-t border-secondary-100 hover:bg-surface/50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {new Date(tx.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={tx.type === 'admin_adjust' || tx.type === 'allocate'
                                            ? 'text-green-600' : 'text-secondary-950'}>
                                            {trans(tx.type)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{tx.performer?.name ?? tx.performed_by}</td>
                                    <td className="px-4 py-3">{tx.unit?.name ?? '—'}</td>
                                    <td className={`px-4 py-3 font-medium ${tx.points >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {tx.points >= 0 ? '+' : ''}{tx.points}
                                    </td>
                                    <td className="px-4 py-3">{tx.balance_after}</td>
                                    <td className="px-4 py-3 text-muted max-w-xs truncate">{tx.notes ?? '—'}</td>
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
            </div>
        </div>
    )
}
