import { Select, ConfirmationModal } from '../../../Components/UI'
import Pagination from '../../../Components/UI/Pagination'
import { usePage, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AdminMessagesIndex({ messages, agents, filters }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isAdmin = auth?.user?.role === 'admin'

    const [statusFilter, setStatusFilter] = useState(filters?.status || '')
    const [agentFilter, setAgentFilter] = useState(filters?.agent_id || '')
    const [isFiltering, setIsFiltering] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [deletingMessage, setDeletingMessage] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Visibility-aware auto-refresh (M-007)
    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                router.reload({ only: ['messages'], preserveScroll: true })
            }
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    // Modal keyboard accessibility (M-004)
    useEffect(() => {
        if (!selectedMessage) return

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setSelectedMessage(null)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedMessage])

    function applyFilters() {
        router.get(
            '/admin/messages',
            { status: statusFilter, agent_id: agentFilter },
            {
                preserveState: true,
                preserveScroll: true,
                onBefore: () => setIsFiltering(true),
                onFinish: () => setIsFiltering(false),
            }
        )
    }

    function markReplied(messageId) {
        router.post(`/admin/messages/${messageId}/replied`, {}, { preserveScroll: true, only: ['messages'] })
    }

    function handleDeleteClick(messageId) {
        setDeletingMessage(messageId)
    }

    function handleConfirmDelete() {
        if (!deletingMessage) return
        setIsDeleting(true)
        setSelectedMessage(null)
        router.delete(`/admin/messages/${deletingMessage}`, {
            preserveScroll: true,
            only: ['messages'],
            onFinish: () => {
                setIsDeleting(false)
                setDeletingMessage(null)
            },
        })
    }

    const data = messages?.data || messages || []

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_messages') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-secondary-950">{trans('sidebar_messages')}</h1>
                        <p className="text-xs sm:text-sm text-muted mt-0.5">
                            {messages?.total !== undefined ? `${messages.total} ${trans('messages.all')}` : ''}
                        </p>
                    </div>
                    <a
                        href={`/admin/messages/export?status=${encodeURIComponent(statusFilter)}&agent_id=${encodeURIComponent(agentFilter)}`}
                        download
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary-900 hover:bg-secondary-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        <span>{trans('export_csv')}</span>
                    </a>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div className="w-full sm:w-auto flex-1 min-w-[140px]">
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('messages.status')}</label>
                        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                            <option value="">{trans('messages.all')}</option>
                            <option value="pending">{trans('messages.status_pending')}</option>
                            <option value="replied">{trans('messages.status_replied')}</option>
                        </Select>
                    </div>
                    <div className="w-full sm:w-auto flex-1 min-w-[160px]">
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('messages.filter_by_agent')}</label>
                        <Select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                            <option value="">{trans('messages.all_agents')}</option>
                            {agents?.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </Select>
                    </div>
                    <button
                        onClick={applyFilters}
                        disabled={isFiltering}
                        className="w-full sm:w-auto px-5 py-2 bg-primary-900 hover:bg-primary-950 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
                    >
                        {isFiltering && (
                            <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        <span>{trans('search')}</span>
                    </button>
                </div>

                {/* Mobile View: Responsive Card-Based Inbox (M-001) */}
                <div className="block md:hidden space-y-3">
                    {data.length > 0 ? (
                        data.map(m => (
                            <div
                                key={m.id}
                                onClick={() => setSelectedMessage(m)}
                                className="bg-white rounded-xl shadow-card p-4 border border-secondary-100 hover:border-secondary-300 transition-all cursor-pointer relative"
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-secondary-950 text-sm truncate">{m.client_name}</p>
                                        <span className="text-xs text-muted block truncate">
                                            {m.unit?.name || trans('admin.csv_general')}
                                        </span>
                                    </div>
                                    <span
                                        className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium shrink-0 ${
                                            m.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}
                                    >
                                        {m.status === 'replied' ? trans('messages.status_replied') : trans('messages.status_pending')}
                                    </span>
                                </div>

                                <p className="text-secondary-700 text-xs line-clamp-2 mb-3 bg-surface/60 rounded-lg p-2.5">
                                    {m.content}
                                </p>

                                <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-secondary-50">
                                    <span>{m.created_at}</span>
                                    <div className="flex items-center gap-2">
                                        {m.status === 'pending' && (
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    markReplied(m.id)
                                                }}
                                                className="px-2.5 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors"
                                            >
                                                {trans('messages.mark_as_replied')}
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    handleDeleteClick(m.id)
                                                }}
                                                className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs transition-colors"
                                            >
                                                {trans('delete')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-card p-8 text-center text-muted text-sm">
                            {trans('messages.no_messages')}
                        </div>
                    )}
                </div>

                {/* Desktop View: Structured Table (M-001) */}
                <div className="hidden md:block bg-white rounded-xl shadow-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">{trans('messages.unit')}</th>
                                <th className="px-4 py-3 font-medium">{trans('messages.client_info')}</th>
                                <th className="px-4 py-3 font-medium">{trans('messages.message_content')}</th>
                                <th className="px-4 py-3 font-medium">{trans('messages.status')}</th>
                                <th className="px-4 py-3 font-medium">{trans('messages.sent_at')}</th>
                                <th className="px-4 py-3 font-medium">{trans('messages.replied_at')}</th>
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map(m => (
                                    <tr
                                        key={m.id}
                                        className="border-t border-secondary-100 hover:bg-surface/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedMessage(m)}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-secondary-950 font-medium">
                                                {m.unit?.name || trans('admin.csv_general')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p className="font-medium text-secondary-950">{m.client_name}</p>
                                                {m.client_phone && <p className="text-xs text-muted">{m.client_phone}</p>}
                                                {m.client_email && <p className="text-xs text-muted">{m.client_email}</p>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="text-secondary-700 truncate">{m.content}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium ${
                                                    m.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}
                                            >
                                                {m.status === 'replied' ? trans('messages.status_replied') : trans('messages.status_pending')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{m.created_at}</td>
                                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{m.replied_at || '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                                {m.status === 'pending' && (
                                                    <button
                                                        onClick={() => markReplied(m.id)}
                                                        className="text-xs px-2.5 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium"
                                                    >
                                                        {trans('messages.mark_as_replied')}
                                                    </button>
                                                )}
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteClick(m.id)}
                                                        className="text-xs px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    >
                                                        {trans('delete')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted">
                                        {trans('messages.no_messages')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (M-002) */}
                <div className="mt-6 flex justify-center">
                    <Pagination meta={messages} />
                </div>
            </div>

            {/* Accessible Message Detail Modal (M-004) */}
            {selectedMessage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
                    onClick={() => setSelectedMessage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="message-modal-title"
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 transition-all"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary-100">
                            <h2 id="message-modal-title" className="text-lg font-bold text-secondary-950">
                                {trans('messages.message_details')}
                            </h2>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                aria-label={trans('close')}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-secondary-950 hover:bg-surface transition-colors"
                            >
                                <span className="text-xl leading-none">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted text-xs block mb-0.5">{trans('messages.client_name')}</span>
                                <p className="text-secondary-950 font-semibold">{selectedMessage.client_name}</p>
                            </div>
                            {selectedMessage.client_phone && (
                                <div>
                                    <span className="text-muted text-xs block mb-0.5">{trans('messages.client_phone')}</span>
                                    <p className="text-secondary-950 font-medium font-mono" dir="ltr">
                                        {selectedMessage.client_phone}
                                    </p>
                                </div>
                            )}
                            {selectedMessage.client_email && (
                                <div>
                                    <span className="text-muted text-xs block mb-0.5">{trans('messages.client_email')}</span>
                                    <p className="text-secondary-950 font-medium">{selectedMessage.client_email}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-muted text-xs block mb-0.5">{trans('messages.unit')}</span>
                                <p className="text-secondary-950 font-medium">
                                    {selectedMessage.unit?.name || trans('admin.csv_general')}
                                </p>
                            </div>
                            {selectedMessage.agent && (
                                <div>
                                    <span className="text-muted text-xs block mb-0.5">{trans('messages.agent')}</span>
                                    <p className="text-secondary-950 font-medium">{selectedMessage.agent.name}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-muted text-xs block mb-1">{trans('messages.message_content')}</span>
                                <div className="text-secondary-800 bg-surface rounded-xl p-3.5 whitespace-pre-wrap leading-relaxed border border-secondary-100/60">
                                    {selectedMessage.content}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-muted pt-2">
                                <span>{trans('messages.sent_at')}: {selectedMessage.created_at}</span>
                                {selectedMessage.replied_at && (
                                    <span>{trans('messages.replied_at')}: {selectedMessage.replied_at}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-secondary-100">
                            {selectedMessage.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        markReplied(selectedMessage.id)
                                        setSelectedMessage(null)
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    {trans('messages.mark_as_replied')}
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteClick(selectedMessage.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    {trans('delete')}
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                            >
                                {trans('close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deletingMessage}
                title={trans('confirm_delete_title')}
                message={trans('confirm_delete_desc')}
                confirmLabel={trans('delete')}
                cancelLabel={trans('cancel')}
                variant="danger"
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingMessage(null)}
            />
        </AdminSidebar>
    )
}
