import { usePage, router, Head, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { localizedPath } from '../../../Utils/route'
import { useState, useEffect, useMemo } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

const TYPE_META = {
    unit_expiry_warning: { icon: 'clock', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: { ar: 'تنبيه انتهاء وحدة', en: 'Unit Expiry Warning' } },
    unit_expired: { icon: 'exclamation', gradient: 'from-red-500 to-rose-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', label: { ar: 'وحدة منتهية', en: 'Unit Expired' } },
    unit_permanently_deleted: { icon: 'trash', gradient: 'from-rose-600 to-red-700', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', label: { ar: 'حذف نهائي لوحدة', en: 'Unit Permanently Deleted' } },
    project_expiry_warning: { icon: 'clock', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: { ar: 'تنبيه انتهاء مشروع', en: 'Project Expiry Warning' } },
    project_permanently_deleted: { icon: 'trash', gradient: 'from-rose-600 to-red-700', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', label: { ar: 'حذف نهائي لمشروع', en: 'Project Permanently Deleted' } },
    new_project_created: { icon: 'plus', gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: { ar: 'مشروع جديد', en: 'New Project' } },
    new_message: { icon: 'message', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', label: { ar: 'رسالة جديدة', en: 'New Message' } },
    unit_pending_approval: { icon: 'clock', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: { ar: 'وحدة بانتظار الموافقة', en: 'Unit Pending Approval' } },
    unit_approved: { icon: 'check', gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: { ar: 'تم الموافقة على الوحدة', en: 'Unit Approved' } },
}

const TYPE_DEFAULT = { icon: 'bell', gradient: 'from-secondary-400 to-secondary-500', bg: 'bg-secondary-100', border: 'border-secondary-200', text: 'text-secondary-800', label: { ar: 'إشعار', en: 'Notification' } }

const ICON_PATHS = {
    clock: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    exclamation: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
    trash: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
    plus: 'M12 4.5v15m7.5-7.5h-15',
    message: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
    bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
    check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

function TypeIcon({ type, className = 'w-5 h-5' }) {
    const meta = TYPE_META[type] || TYPE_DEFAULT
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[meta.icon]} />
        </svg>
    )
}

function groupByDate(items, isRtl, trans) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 86400000)
    const weekAgo = new Date(today.getTime() - 6 * 86400000)

    const groups = { today: [], yesterday: [], week: [], earlier: [] }

    items.forEach(item => {
        const d = new Date(item.created_at)
        const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        if (date.getTime() === today.getTime()) groups.today.push(item)
        else if (date.getTime() === yesterday.getTime()) groups.yesterday.push(item)
        else if (date >= weekAgo) groups.week.push(item)
        else groups.earlier.push(item)
    })

    const labels = {
        today: trans('today'),
        yesterday: trans('yesterday'),
        week: trans('this_week'),
        earlier: trans('earlier'),
    }

    return Object.entries(groups).filter(([, v]) => v.length > 0).map(([key, items]) => ({ label: labels[key], items }))
}

export default function NotificationsIndex({ notifications, unreadCount, autoDeleteDays = 30 }) {
    const { locale, auth, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isAdmin = auth?.user?.role === 'admin'
    const isManager = auth?.user?.role === 'manager'
    const [activeTab, setActiveTab] = useState('all')
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [confirmClearAll, setConfirmClearAll] = useState(false)
    const [extendModalUnit, setExtendModalUnit] = useState(null)
    const [selectedDuration, setSelectedDuration] = useState('auto_delete_setting')
    const [customDays, setCustomDays] = useState('')
    const [isExtending, setIsExtending] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['notifications', 'unreadCount'], preserveScroll: true })
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    const items = notifications?.data || []

    const filteredItems = items.filter(item => {
        if (activeTab === 'unread') return !item.read_at
        if (activeTab === 'expiry') return item.type === 'unit_expiry_warning' || item.type === 'unit_expired' || item.type === 'project_expiry_warning'
        return true
    })

    const grouped = useMemo(() => groupByDate(filteredItems, isRtl, trans), [filteredItems, isRtl, trans])

    function handleMarkAllRead() {
        router.post('/admin/notifications/read-all', {}, { preserveScroll: true })
    }

    function handleMarkRead(id) {
        router.post(`/admin/notifications/${id}/read`, {}, { preserveScroll: true })
    }

    function handleDismiss(id) {
        router.post(`/admin/notifications/${id}/dismiss`, {}, { preserveScroll: true })
    }

    function handleDeleteOne(id) {
        router.delete(`/admin/notifications/${id}`, {}, { preserveScroll: true })
    }

    function handleDeleteAll() {
        router.delete('/admin/notifications/all/clear', {}, { preserveScroll: true })
        setConfirmClearAll(false)
    }

    function handleExtendProject(projectId) {
        router.post(`/admin/projects/${projectId}/extend`, {}, { preserveScroll: true })
    }

    function openExtendModal(unitId, unitName) {
        setExtendModalUnit({ id: unitId, name: unitName })
        setSelectedDuration('auto_delete_setting')
        setCustomDays('')
    }

    function submitExtendUnit() {
        if (!extendModalUnit) return
        setIsExtending(true)
        const payload = {
            duration_type: selectedDuration,
        }
        if (selectedDuration === 'custom') {
            payload.days = parseInt(customDays, 10) || autoDeleteDays || 30
        }
        router.post(`/admin/units/${extendModalUnit.id}/extend-expiry`, payload, {
            preserveScroll: true,
            onFinish: () => {
                setIsExtending(false)
                setExtendModalUnit(null)
            },
        })
    }

    function handleApproveProject(projectId) {
        router.post(`/admin/projects/${projectId}/approve`, {}, { preserveScroll: true })
    }

    function handleApproveUnit(unitId) {
        router.post(`/admin/units/${unitId}/approve`, {}, { preserveScroll: true })
    }

    function handleDeleteUnit(unitId) {
        router.delete(`/admin/units/${unitId}/force`, {}, { preserveScroll: true })
        setConfirmDeleteId(null)
    }

    function getMeta(type) {
        return TYPE_META[type] || TYPE_DEFAULT
    }

    return (
        <AdminSidebar>
            <Head title={(trans('sidebar_notifications') || 'الإشعارات') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">

                {/* === Header === */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-900/10 text-primary-900 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-secondary-950">
                                    {trans('sidebar_notifications') || (isRtl ? 'الإشعارات' : 'Notifications')}
                                </h1>
                                <p className="text-sm text-secondary-500">
                                    {trans('notifications_subtitle')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="px-3.5 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {trans('mark_all_read')}
                            </button>
                        )}
                        {items.length > 0 && (
                            confirmClearAll ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDeleteAll}
                                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors"
                                    >
                                        {trans('confirm_clear_all')}
                                    </button>
                                    <button
                                        onClick={() => setConfirmClearAll(false)}
                                        className="px-3 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-sm rounded-xl transition-colors"
                                    >
                                        {trans('cancel')}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmClearAll(true)}
                                    className="px-3.5 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {trans('clear_all')}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* === Flash Toast === */}
                {flash?.success && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in shadow-xs">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash.success}
                    </div>
                )}

                {/* === Tabs + Stats === */}
                <div className="bg-white rounded-2xl shadow-card border border-secondary-100 p-1.5 flex flex-wrap items-center gap-1.5">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-primary-900 text-white shadow-sm' : 'text-secondary-600 hover:bg-secondary-100'}`}
                    >
                        {trans('all')}
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-secondary-200 text-secondary-600'}`}>{items.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('unread')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'unread' ? 'bg-primary-900 text-white shadow-sm' : 'text-secondary-600 hover:bg-secondary-100'}`}
                    >
                        {trans('unread')}
                        {unreadCount > 0 && (
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === 'unread' ? 'bg-white/20' : unreadCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-secondary-200 text-secondary-600'}`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('expiry')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'expiry' ? 'bg-amber-600 text-white shadow-sm' : 'text-secondary-600 hover:bg-secondary-100'}`}
                    >
                        {trans('expiry')}
                    </button>
                </div>

                {/* === Notifications List === */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 md:p-16 text-center border border-secondary-100 shadow-card">
                        <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-secondary-900 mb-1.5">
                            {activeTab === 'unread'
                                ? trans('no_unread_notifications')
                                : activeTab === 'expiry'
                                    ? trans('no_expiry_notifications')
                                    : trans('no_notifications_yet')}
                        </h3>
                        <p className="text-sm text-secondary-500 max-w-sm mx-auto">
                            {trans('notifications_empty_hint')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {grouped.map(group => (
                            <div key={group.label}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold text-secondary-500 tracking-wider uppercase">{group.label}</span>
                                    <span className="h-px flex-1 bg-secondary-200" />
                                    <span className="text-[11px] text-secondary-400 font-medium">{group.items.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {group.items.map(item => {
                                        const meta = getMeta(item.type)
                                        const isUnread = !item.read_at
                                        const isUnitExpiry = item.type === 'unit_expiry_warning'
                                        const isUnitExpired = item.type === 'unit_expired'
                                        const isProjectExpiry = item.type === 'project_expiry_warning'
                                        const isNewMessage = item.type === 'new_message'
                                        const isNewProject = item.type === 'new_project_created'
                                        const isUnitPendingApproval = item.type === 'unit_pending_approval'

                                        return (
                                            <div
                                                key={item.id}
                                                className={`relative bg-white rounded-2xl shadow-card border transition-all duration-200 hover:shadow-md ${
                                                    isUnread
                                                        ? 'border-primary-900/30 bg-gradient-to-r from-primary-50/40 to-transparent'
                                                        : 'border-secondary-100 hover:border-secondary-300'
                                                }`}
                                            >
                                                {/* Unread indicator bar */}
                                                {isUnread && (
                                                    <div className="absolute start-0 top-3 bottom-3 w-1 bg-primary-900 rounded-full" />
                                                )}

                                                <div className={`p-4 md:p-5 ${isUnread ? 'ps-5 md:ps-6' : ''}`}>
                                                    <div className="flex items-start gap-3.5">
                                                        {/* Type badge */}
                                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}>
                                                            <TypeIcon type={item.type} className="w-5 h-5" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            {/* Title row */}
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <div className="flex items-center flex-wrap gap-2">
                                                                    <h3 className={`text-sm ${isUnread ? 'font-bold text-secondary-950' : 'font-semibold text-secondary-800'}`}>
                                                                        {isRtl ? item.title || meta.label.ar : item.title_en || meta.label.en}
                                                                    </h3>
                                                                    {isUnread && (
                                                                        <span className="bg-primary-900/10 text-primary-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                                            {trans('new_badge')}
                                                                        </span>
                                                                    )}
                                                                    {isUnread && item.days_remaining && (
                                                                        <span className="bg-red-50 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            {trans('days_remaining', { count: item.days_remaining })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[11px] text-secondary-400 whitespace-nowrap shrink-0">{item.created_at_human}</span>
                                                            </div>

                                                            {/* Message */}
                                                            <p className="text-xs text-secondary-600 leading-relaxed mb-3">
                                                                {item.message}
                                                            </p>

                                                            {/* Details Panel */}
                                                            {(item.unit_name || item.project_name || isNewMessage) && (
                                                                <div className={`${meta.bg} border ${meta.border} rounded-xl p-3 mb-3 text-xs space-y-1.5`}>
                                                                    {item.unit_name && (
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-secondary-500 shrink-0">{trans('unit') + ':'}</span>
                                                                            <span className={`font-semibold ${meta.text} text-end`}>{item.unit_name}</span>
                                                                        </div>
                                                                    )}
                                                                    {item.project_name && (
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-secondary-500 shrink-0">{trans('project') + ':'}</span>
                                                                            <span className={`font-semibold ${meta.text} text-end`}>{item.project_name}</span>
                                                                        </div>
                                                                    )}
                                                                    {item.expires_at && (
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-secondary-500 shrink-0">{trans('expires_label')}</span>
                                                                            <span className="font-semibold text-amber-700">{new Date(item.expires_at).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}</span>
                                                                        </div>
                                                                    )}
                                                                    {item.creator_name && (
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-secondary-500 shrink-0">{trans('by_label')}</span>
                                                                            <span className="font-semibold text-primary-900 text-end">{item.creator_name}</span>
                                                                        </div>
                                                                    )}
                                                                    {item.area_name && (
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-secondary-500 shrink-0">{trans('area') + ':'}</span>
                                                                            <span className={`font-semibold ${meta.text} text-end`}>{item.area_name}</span>
                                                                        </div>
                                                                    )}
                                                                    {isNewMessage && (
                                                                        <>
                                                                            {item.client_name && (
                                                                                <div className="flex items-center justify-between gap-2">
                                                                                    <span className="text-secondary-500 shrink-0">{trans('client_name') + ':'}</span>
                                                                                    <span className="font-semibold text-blue-700 text-end">{item.client_name}</span>
                                                                                </div>
                                                                            )}
                                                                            {item.client_phone && (
                                                                                <div className="flex items-center justify-between gap-2">
                                                                                    <span className="text-secondary-500 shrink-0">{trans('phone') + ':'}</span>
                                                                                    <a href={`tel:${item.client_phone}`} className="font-semibold text-primary-900 hover:underline text-end" dir="ltr">{item.client_phone}</a>
                                                                                </div>
                                                                            )}
                                                                            {item.content && (
                                                                                <p className={`${meta.text} mt-1 leading-relaxed line-clamp-2`}>{item.content}</p>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            <div className="flex items-center flex-wrap gap-1.5">
                                                                {isUnread && (
                                                                    <button
                                                                        onClick={() => handleMarkRead(item.id)}
                                                                        className="px-3 py-1.5 bg-primary-900/10 hover:bg-primary-900/20 text-primary-900 text-xs font-semibold rounded-lg transition-colors"
                                                                    >
                                                                        {trans('mark_read')}
                                                                    </button>
                                                                )}

                                                                {isUnread && isNewProject && item.project_id && isAdmin && (
                                                                    <button
                                                                        onClick={() => handleApproveProject(item.project_id)}
                                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                                    >
                                                                        {isRtl ? 'موافقة ونشر' : 'Approve & publish'}
                                                                    </button>
                                                                )}

                                                                {isUnread && isUnitPendingApproval && item.unit_id && (isAdmin || isManager) && (
                                                                    <button
                                                                        onClick={() => handleApproveUnit(item.unit_id)}
                                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                                    >
                                                                        {isRtl ? 'موافقة ونشر' : 'Approve & publish'}
                                                                    </button>
                                                                )}

                                                                {(isUnitExpiry || isUnitExpired) && item.unit_id && isAdmin && (
                                                                    <button
                                                                        onClick={() => openExtendModal(item.unit_id, item.unit_name || item.title)}
                                                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        {trans('extend')}
                                                                    </button>
                                                                )}

                                                                {isProjectExpiry && item.project_id && isAdmin && (
                                                                    <button
                                                                        onClick={() => handleExtendProject(item.project_id)}
                                                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        {trans('extend')}
                                                                    </button>
                                                                )}

                                                                {(isUnitExpiry || isUnitExpired) && item.unit_id && isAdmin && (
                                                                    confirmDeleteId === item.id ? (
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                onClick={() => handleDeleteUnit(item.unit_id)}
                                                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                                            >
                                                                                {trans('confirm')}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setConfirmDeleteId(null)}
                                                                                className="px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-xs rounded-lg transition-colors"
                                                                            >
                                        {trans('cancel')}
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => setConfirmDeleteId(item.id)}
                                                                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                                                        >
                                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                            </svg>
                                                                            {trans('delete')}
                                                                        </button>
                                                                    )
                                                                )}

                                                                {isNewMessage && (
                                                                    <Link
                                                                        href="/admin/messages"
                                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                                        </svg>
                                                                        {isRtl ? 'عرض الرسائل' : 'View Messages'}
                                                                    </Link>
                                                                )}

                                                                {item.unit_id && (
                                                                    <Link
                                                                        href={`/admin/units/${item.unit_id}/edit`}
                                                                        className="px-3 py-1.5 bg-secondary-800 hover:bg-secondary-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                        </svg>
                                                                        {isRtl ? 'تعديل الوحدة' : 'Edit Unit'}
                                                                    </Link>
                                                                )}

                                                                {item.project_id && (
                                                                    <Link
                                                                        href={`/admin/projects/${item.project_id}/edit`}
                                                                        className="px-3 py-1.5 bg-secondary-800 hover:bg-secondary-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                        </svg>
                                                                        {isRtl ? 'تعديل المشروع' : 'Edit Project'}
                                                                    </Link>
                                                                )}

                                                                {item.unit_slug && (
                                                                    <Link
                                                                        href={localizedPath(`/units/${item.unit_slug}`, locale)}
                                                                        target="_blank"
                                                                        className="px-3 py-1.5 text-secondary-500 hover:bg-secondary-100 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                        </svg>
                                                                        {trans('view')}
                                                                    </Link>
                                                                )}

                                                                {item.project_slug && (
                                                                    <Link
                                                                        href={localizedPath(`/projects/${item.project_slug}`, locale)}
                                                                        target="_blank"
                                                                        className="px-3 py-1.5 text-secondary-500 hover:bg-secondary-100 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                        </svg>
                                                                        {trans('view')}
                                                                    </Link>
                                                                )}

                                                                <button
                                                                    onClick={() => handleDeleteOne(item.id)}
                                                                    className="px-3 py-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors"
                                                                    title={trans('delete_notification')}
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* === Pagination === */}
                {notifications?.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map(page => (
                            <Link
                                key={page}
                                href={notifications.path + '?page=' + page}
                                className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                                    page === notifications.current_page
                                        ? 'bg-primary-900 text-white shadow-sm'
                                        : 'bg-white text-secondary-600 border border-secondary-200 hover:border-primary-900/30 hover:text-primary-900'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}

                {/* === Extend Unit Modal === */}
                {extendModalUnit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl border border-secondary-100 max-w-md w-full p-6 space-y-5 animate-scale-up">
                            {/* Modal Header */}
                            <div className="flex items-start justify-between gap-3 border-b border-secondary-100 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-secondary-900">
                                        {isRtl ? 'تمديد مدة الوحدة' : 'Extend Unit Listing'}
                                    </h3>
                                    <p className="text-xs text-secondary-500 mt-1 line-clamp-1">
                                        {extendModalUnit.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setExtendModalUnit(null)}
                                    className="text-secondary-400 hover:text-secondary-600 p-1 rounded-lg hover:bg-secondary-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Options Form */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-secondary-700 uppercase tracking-wider block">
                                    {isRtl ? 'اختر مدة التمديد' : 'Select Extension Duration'}
                                </label>

                                <div className="space-y-2">
                                    {[
                                        { id: '7_days', label: isRtl ? '7 أيام' : '7 Days' },
                                        { id: '15_days', label: isRtl ? '15 يوماً' : '15 Days' },
                                        { id: '30_days', label: isRtl ? '30 يوماً' : '30 Days' },
                                        { id: 'auto_delete_setting', label: isRtl ? `مدة الحذف التلقائي الإفتراضية: ${autoDeleteDays} يوم` : `Default Auto-Delete Period: ${autoDeleteDays} Days` },
                                        { id: 'custom', label: isRtl ? 'مدة مخصصة (بالأيام)' : 'Custom Duration (in days)' },
                                    ].map(option => (
                                        <label
                                            key={option.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                selectedDuration === option.id
                                                    ? 'border-primary-900 bg-primary-50/50 text-primary-950 font-semibold shadow-sm'
                                                    : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="duration_type"
                                                value={option.id}
                                                checked={selectedDuration === option.id}
                                                onChange={() => setSelectedDuration(option.id)}
                                                className="w-4 h-4 text-primary-900 border-secondary-300 focus:ring-primary-900"
                                            />
                                            <span className="text-sm">{option.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Custom Input */}
                                {selectedDuration === 'custom' && (
                                    <div className="pt-2 animate-fade-in">
                                        <label className="text-xs font-semibold text-secondary-600 block mb-1">
                                            {isRtl ? 'عدد الأيام (1 - 365):' : 'Number of days (1 - 365):'}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={customDays}
                                            onChange={e => setCustomDays(e.target.value)}
                                            placeholder={isRtl ? 'مثال: 45' : 'e.g. 45'}
                                            className="w-full px-3.5 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-secondary-100">
                                <button
                                    type="button"
                                    onClick={() => setExtendModalUnit(null)}
                                    disabled={isExtending}
                                    className="px-4 py-2 text-sm font-semibold text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-xl transition-colors"
                                >
                                    {isRtl ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={submitExtendUnit}
                                    disabled={isExtending || (selectedDuration === 'custom' && (!customDays || parseInt(customDays, 10) < 1))}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                                >
                                    {isExtending ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>{isRtl ? 'جاري التمديد...' : 'Extending...'}</span>
                                        </>
                                    ) : (
                                        <span>{isRtl ? 'تأكيد التمديد' : 'Confirm Extension'}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}
