import { usePage, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AssistantLeadsIndex({ leads }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isAdmin = auth?.user?.role === 'admin'

    const [selectedLead, setSelectedLead] = useState(null)

    function markContacted(leadId) {
        router.post(`/admin/assistant-leads/${leadId}/contacted`, {}, { preserveScroll: true, only: ['leads'] })
    }

    function deleteLead(leadId) {
        if (!confirm(trans('common.confirm_delete'))) return
        setSelectedLead(null)
        router.delete(`/admin/assistant-leads/${leadId}`, {
            preserveScroll: true,
            only: ['leads'],
        })
    }

    const data = leads?.data || leads || []

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_assistant_leads') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('sidebar_assistant_leads')}</h1>

                <div className="bg-white rounded-xl shadow-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">الهاتف</th>
                                <th className="px-4 py-3 font-medium">سياق الصفحة</th>
                                <th className="px-4 py-3 font-medium">الحالة</th>
                                <th className="px-4 py-3 font-medium">التقييم</th>
                                <th className="px-4 py-3 font-medium">وقت التسجيل</th>
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? data.map(m => (
                                <tr
                                    key={m.id}
                                    className="border-t border-secondary-100 hover:bg-surface/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedLead(m)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="text-sm">
                                            <p className="font-bold text-secondary-950">{m.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs">
                                        <p className="text-secondary-700 truncate" dir="ltr">{m.context || '—'}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium w-fit ${m.status === 'contacted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {m.status === 'contacted' ? 'تم التواصل' : 'جديد'}
                                            </span>
                                            {m.lead_status === 'hot' && (
                                                <span className="inline-block px-2 py-0.5 text-xs rounded-full font-bold bg-rose-100 text-rose-700 border border-rose-200 w-fit shadow-xs animate-pulse">
                                                    Hot Lead 🔥
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200">
                                                {m.lead_score || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {m.status === 'new' && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); markContacted(m.id) }}
                                                    className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                                >
                                                    تحديد كتم التواصل
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted">
                                        لا يوجد عملاء جدد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedLead && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setSelectedLead(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-secondary-100 flex items-center justify-between shrink-0">
                            <h2 className="text-lg font-bold text-secondary-950">تفاصيل العميل وتاريخ المحادثة</h2>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="text-muted hover:text-secondary-950 text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 bg-surface">
                            <div className="mb-6 bg-white p-4 rounded-xl border border-secondary-100 shadow-sm">
                                <p className="mb-2"><strong className="text-secondary-950">الهاتف:</strong> <span className="font-mono text-primary-700 text-lg">{selectedLead.phone}</span></p>
                                <p className="mb-2"><strong className="text-secondary-950">السياق (الصفحة):</strong> {selectedLead.context ? <a href={selectedLead.context} target="_blank" rel="noreferrer" className="text-blue-600 underline">{selectedLead.context}</a> : 'غير متوفر'}</p>
                                <div className="flex items-center gap-4">
                                    <p><strong className="text-secondary-950">الحالة:</strong> {selectedLead.status === 'contacted' ? 'تم التواصل ✅' : 'عميل جديد 🚨'}</p>
                                    <p><strong className="text-secondary-950">تقييم الذكاء الاصطناعي:</strong> <span className="font-bold text-rose-600">{selectedLead.lead_score || 0}/10 {selectedLead.lead_status === 'hot' && '🔥 (Hot Lead)'}</span></p>
                                </div>
                            </div>

                            <h3 className="font-bold text-secondary-950 mb-4">تاريخ المحادثة مع حسام</h3>
                            <div className="space-y-4">
                                {selectedLead.chat_history && selectedLead.chat_history.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-secondary-100 text-secondary-900 rounded-tr-none' : 'bg-primary-900 text-white rounded-tl-none'}`}>
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!selectedLead.chat_history || selectedLead.chat_history.length === 0) && (
                                    <p className="text-muted text-sm text-center">لا يوجد تاريخ محادثة محفوظ</p>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-secondary-100 flex justify-between shrink-0">
                            <button
                                onClick={() => deleteLead(selectedLead.id)}
                                className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                حذف العميل
                            </button>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="px-4 py-2 bg-secondary-100 text-secondary-900 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminSidebar>
    )
}
