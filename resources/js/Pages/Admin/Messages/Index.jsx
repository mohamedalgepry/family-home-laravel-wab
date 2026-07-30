import { Select } from '../../../Components/UI'
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
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['messages'], preserveScroll: true })
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    function applyFilters() {
        router.get('/admin/messages', { status: statusFilter, agent_id: agentFilter }, { preserveState: true, preserveScroll: true })
    }

    function markReplied(messageId) {
        router.post(`/admin/messages/${messageId}/replied`, {}, { preserveScroll: true })
    }

    function deleteMessage(messageId) {
        if (!confirm(trans('messages.confirm_delete'))) return
        setDeleting(true)
        router.delete(`/admin/messages/${messageId}`, {
            preserveScroll: true,
            onFinish: () => { setDeleting(false); setSelectedMessage(null) },
        })
    }

    const data = messages?.data || messages || []

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_messages') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('sidebar_messages')}</h1>

                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('messages.status')}</label>
                        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                            <option value="">{trans('messages.all')}</option>
                            <option value="pending">{trans('messages.status_pending')}</option>
                            <option value="replied">{trans('messages.status_replied')}</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('messages.filter_by_agent')}</label>
                        <Select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                            <option value="">{trans('messages.all_agents')}</option>
                            {agents?.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </Select>
                    </div>
                    <button onClick={applyFilters} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium">{trans('search')}</button>
                </div>

                <div className="bg-white rounded-xl shadow-card overflow-x-auto">
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
                            {data.length > 0 ? data.map(m => (
                                <tr
                                    key={m.id}
                                    className="border-t border-secondary-100 hover:bg-surface/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedMessage(m)}
                                >
                                    <td className="px-4 py-3">
                                        <span className="text-secondary-950 font-medium">{m.unit?.name || '—'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">
                                            <p className="font-medium text-secondary-950">{m.client_name}</p>
                                            <p className="text-xs text-muted">{m.client_phone}</p>
                                            {m.client_email && <p className="text-xs text-muted">{m.client_email}</p>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs">
                                        <p className="text-secondary-700 truncate">{m.content}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${m.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {m.status === 'replied' ? trans('messages.status_replied') : trans('messages.status_pending')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{m.created_at}</td>
                                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{m.replied_at || '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {m.status === 'pending' && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); markReplied(m.id) }}
                                                    className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                                >
                                                    {trans('messages.mark_as_replied')}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted">
                                        {trans('messages.no_messages')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedMessage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-secondary-950">{trans('messages.message_details')}</h2>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-muted hover:text-secondary-950 text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted text-xs block">{trans('messages.client_name')}</span>
                                <p className="text-secondary-950 font-medium">{selectedMessage.client_name}</p>
                            </div>
                            {selectedMessage.client_phone && (
                                <div>
                                    <span className="text-muted text-xs block">{trans('messages.client_phone')}</span>
                                    <p className="text-secondary-950 font-medium">{selectedMessage.client_phone}</p>
                                </div>
                            )}
                            {selectedMessage.client_email && (
                                <div>
                                    <span className="text-muted text-xs block">{trans('messages.client_email')}</span>
                                    <p className="text-secondary-950 font-medium">{selectedMessage.client_email}</p>
                                </div>
                            )}
                            {selectedMessage.unit && (
                                <div>
                                    <span className="text-muted text-xs block">{trans('messages.unit')}</span>
                                    <p className="text-secondary-950 font-medium">{selectedMessage.unit.name}</p>
                                </div>
                            )}
                            {selectedMessage.agent && (
                                <div>
                                    <span className="text-muted text-xs block">{trans('messages.agent')}</span>
                                    <p className="text-secondary-950 font-medium">{selectedMessage.agent.name}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-muted text-xs block">{trans('messages.message_content')}</span>
                                <p className="text-secondary-700 bg-surface rounded-lg p-3 mt-1 whitespace-pre-wrap">{selectedMessage.content}</p>
                            </div>
                            <div className="flex gap-4 text-xs text-muted">
                                <span>{trans('messages.sent_at')}: {selectedMessage.created_at}</span>
                                {selectedMessage.replied_at && <span>{trans('messages.replied_at')}: {selectedMessage.replied_at}</span>}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 pt-4 border-t border-secondary-100">
                            {selectedMessage.status === 'pending' && (
                                <button
                                    onClick={() => { markReplied(selectedMessage.id); setSelectedMessage(null) }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    {trans('messages.mark_as_replied')}
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? trans('deleting') : trans('delete')}
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
        </AdminSidebar>
    )
}
