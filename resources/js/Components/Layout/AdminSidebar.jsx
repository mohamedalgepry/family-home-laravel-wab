import { usePage, Link, router } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { localizedPath } from '../../Utils/route'
import { useState, useEffect, useRef } from 'react'

const NAV_GROUPS = [
    {
        key: 'nav_group_main',
        items: [
            { key: 'sidebar_dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        ]
    },
    {
        key: 'nav_group_listings',
        items: [
            { key: 'sidebar_units', href: '/admin/units', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { key: 'sidebar_projects', href: '/admin/projects', icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' },
            { key: 'sidebar_articles', href: '/admin/articles', scope: 'admin', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
        ]
    },
    {
        key: 'nav_group_taxonomies',
        items: [
            { key: 'sidebar_areas', href: '/admin/areas', scope: 'admin', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
            { key: 'sidebar_unit_types', href: '/admin/unit-types', scope: 'admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { key: 'sidebar_features', href: '/admin/features', scope: 'admin', icon: 'M5 13l4 4L19 7' },
            { key: 'sidebar_finishing_types', href: '/admin/finishing-types', scope: 'admin', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
            { key: 'sidebar_categories', href: '/admin/categories', scope: 'admin', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
        ]
    },
    {
        key: 'nav_group_users',
        items: [
            { key: 'sidebar_messages', href: '/admin/messages', icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' },
            { key: 'sidebar_notifications', href: '/admin/notifications', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
            { key: 'sidebar_users', href: '/admin/users', scope: 'admin', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
            { key: 'sidebar_points', href: '/admin/points', scope: 'manager', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ]
    },
    {
        key: 'nav_group_system',
        items: [
            { key: 'sidebar_settings', href: '/admin/settings', scope: 'admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { key: 'sidebar_seo_pages', href: '/admin/seo-pages', scope: 'admin', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
            { key: 'sidebar_about', href: '/admin/about', scope: 'admin', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ]
    }
]

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const now = ctx.currentTime
        const gain = ctx.createGain()
        gain.connect(ctx.destination)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

        const osc1 = ctx.createOscillator()
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(800, now)
        osc1.connect(gain)
        osc1.start(now)
        osc1.stop(now + 0.15)

        const osc2 = ctx.createOscillator()
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(1000, now + 0.15)
        osc2.connect(gain)
        osc2.start(now + 0.15)
        osc2.stop(now + 0.4)
    } catch {}
}

export default function AdminSidebar({ children }) {
    const { url, locale, auth, unread_notifications_count: initialCount, settings, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const role = auth?.user?.role
    const [mobileOpen, setMobileOpen] = useState(false)
    const [avatarFailed, setAvatarFailed] = useState(false)
    const [liveNotifCount, setLiveNotifCount] = useState(initialCount || 0)
    const [liveMsgCount, setLiveMsgCount] = useState(0)
    const [showFlash, setShowFlash] = useState(true)

    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('notification_sound') !== 'off'
    })
    const [notifOpen, setNotifOpen] = useState(false)
    const [recentNotifs, setRecentNotifs] = useState([])
    const [loadingNotifs, setLoadingNotifs] = useState(false)
    const notifRef = useRef(null)
    const prevNotifRef = useRef(initialCount || 0)
    const prevMsgRef = useRef(0)
    const soundReadyRef = useRef(false)
    const soundRef = useRef(soundEnabled)

    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function openNotifDropdown() {
        if (notifOpen) { setNotifOpen(false); return }
        setNotifOpen(true)
        setLoadingNotifs(true)
        try {
            const res = await fetch('/admin/notifications/recent', {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            if (!res.ok) throw new Error('Unable to load notifications')
            const data = await res.json()
            setRecentNotifs(data.notifications || [])
        } catch {}
        setLoadingNotifs(false)
    }

    function markNotifRead(id) {
        router.post(`/admin/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setRecentNotifs(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
                setLiveNotifCount(prev => Math.max(0, prev - 1))
            },
        })
    }

    function handleNotifItemClick(n) {
        if (!n.read_at) {
            markNotifRead(n.id)
        }
        setNotifOpen(false)

        const type = n.type || ''
        if (type === 'new_message' || n.message_id) {
            router.visit('/admin/messages')
        } else if (n.unit_id) {
            router.visit(`/admin/units/${n.unit_id}/edit`)
        } else if (n.project_id) {
            router.visit(`/admin/projects/${n.project_id}/edit`)
        } else {
            router.visit('/admin/notifications')
        }
    }

    function markAllNotifsRead() {
        router.post('/admin/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setRecentNotifs(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
                setLiveNotifCount(0)
            },
        })
    }

    function clearAllNotifs() {
        if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف جميع الإشعارات؟' : 'Are you sure you want to delete all notifications?')) return
        router.delete('/admin/notifications/all/clear', {
            preserveScroll: true,
            onSuccess: () => {
                setRecentNotifs([])
                setLiveNotifCount(0)
            },
        })
    }

    useEffect(() => {
        setLiveNotifCount(initialCount || 0)
        prevNotifRef.current = initialCount || 0
    }, [initialCount])

    async function pollCounts() {
        try {
            const [notifRes, msgRes] = await Promise.all([
                fetch('/admin/notifications/unread-count', {
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }),
                fetch('/admin/messages/unread-count', {
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }),
            ])
            if (!notifRes.ok || !msgRes.ok) throw new Error('Unable to refresh counts')
            const notifData = await notifRes.json()
            const msgData = await msgRes.json()
            return { notif: notifData.count, msg: msgData.count }
        } catch {
            return null
        }
    }

    function handleNewNotif(count) {
        if (!soundReadyRef.current) return
        if (count > prevNotifRef.current) {
            if (soundRef.current) playNotificationSound()
            const el = document.createElement('div')
            el.className = 'fixed top-4 end-4 z-50 bg-amber-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-bold animate-fade-in'
            el.textContent = isRtl ? `🔔 لديك ${count} إشعار جديد` : `🔔 You have ${count} new notifications`
            document.body.appendChild(el)
            setTimeout(() => { el.remove() }, 4000)
        }
        prevNotifRef.current = count
        setLiveNotifCount(count)
    }

    function handleNewMsg(count) {
        if (!soundReadyRef.current) return
        if (count > prevMsgRef.current) {
            if (soundRef.current) playNotificationSound()
            const el = document.createElement('div')
            el.className = 'fixed top-4 end-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-bold animate-fade-in'
            el.textContent = isRtl ? `💬 لديك ${count} رسالة جديدة` : `💬 You have ${count} new messages`
            document.body.appendChild(el)
            setTimeout(() => { el.remove() }, 4000)
        }
        prevMsgRef.current = count
        setLiveMsgCount(count)
    }

    useEffect(() => {
        if (!auth?.user) return

        const tick = async () => {
            const result = await pollCounts()
            if (!result) return
            handleNewNotif(result.notif)
            handleNewMsg(result.msg)
            soundReadyRef.current = true
        }

        tick()
        const interval = setInterval(tick, 30000)
        window.addEventListener('focus', tick)
        return () => {
            clearInterval(interval)
            window.removeEventListener('focus', tick)
        }
    }, [auth?.user])

    useEffect(() => { soundRef.current = soundEnabled }, [soundEnabled])

    function toggleSound() {
        const next = !soundEnabled
        setSoundEnabled(next)
        localStorage.setItem('notification_sound', next ? 'on' : 'off')
    }

    const isActive = (href) => {
        if (!url) return false
        if (href === '/admin') return url === '/admin' || url === '/admin/'
        return url.startsWith(href)
    }

    const filterItems = (items) => items.filter(item => {
        if (!item.scope) return true
        if (item.scope === 'admin') return role === 'admin'
        if (item.scope === 'manager') return role === 'admin' || role === 'manager'
        return true
    })

    const renderNavContent = () => (
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
            {NAV_GROUPS.map((group) => {
                const visibleItems = filterItems(group.items)
                if (visibleItems.length === 0) return null

                return (
                    <div key={group.key} className="space-y-1">
                        <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-secondary-500 uppercase">
                            {trans(group.key)}
                        </div>
                        <div className="space-y-0.5">
                            {visibleItems.map(item => {
                                const active = isActive(item.href)
                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                            active
                                                ? 'bg-primary-900/20 text-white font-semibold border-s-4 border-primary-900 ps-3.5'
                                                : 'text-secondary-300 hover:bg-secondary-900 hover:text-white ps-4'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 shrink-0 ${active ? 'text-primary-500' : 'text-secondary-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                        <span className="flex-1 truncate">{trans(item.key)}</span>
                                        {item.key === 'sidebar_notifications' && liveNotifCount > 0 && (
                                            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center leading-tight animate-pulse">
                                                {liveNotifCount > 99 ? '99+' : liveNotifCount}
                                            </span>
                                        )}
                                        {item.key === 'sidebar_messages' && liveMsgCount > 0 && (
                                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                                                {liveMsgCount > 99 ? '99+' : liveMsgCount}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-secondary-950 text-white shrink-0 hidden md:flex flex-col border-e border-secondary-800/60">
                <div className="p-4 border-b border-secondary-800/80 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2">
                        <img 
                            src={settings?.site_logo ? (settings.site_logo.startsWith('http') || settings.site_logo.startsWith('/storage') ? settings.site_logo : `/storage/${settings.site_logo}`) : '/icon.png'} 
                            alt={trans('app_name')} 
                            className="h-8 w-auto object-contain" 
                            onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                        />
                        <div>
                            <span className="text-base font-bold text-primary-900 block leading-tight">{trans('app_name')}</span>
                            <span className="text-[11px] text-secondary-400 block leading-tight">{trans('admin_panel')}</span>
                        </div>
                    </Link>
                </div>

                {renderNavContent()}

                <div className="p-3 border-t border-secondary-800/80 bg-secondary-950/50">
                    <Link href={localizedPath('/', locale)} className="flex items-center gap-2 px-3 py-2 text-xs text-secondary-400 hover:text-white hover:bg-secondary-900 rounded-lg transition-colors">
                        <span>&larr;</span>
                        <span>{trans('home')}</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="relative w-64 bg-secondary-950 text-white flex flex-col z-10 shadow-2xl h-full">
                        <div className="p-4 border-b border-secondary-800 flex items-center justify-between">
                            <Link href="/admin" className="flex items-center gap-2">
                                <img src="/icon.png" alt={trans('app_name')} className="h-7 w-auto" />
                                <span className="text-sm font-bold text-primary-900">{trans('app_name')}</span>
                            </Link>
                            <button onClick={() => setMobileOpen(false)} className="text-secondary-400 hover:text-white p-1">
                                &times;
                            </button>
                        </div>

                        {renderNavContent()}

                        <div className="p-3 border-t border-secondary-800">
                            <Link href={localizedPath('/', locale)} className="block px-3 py-2 text-xs text-secondary-400 hover:text-white rounded-lg">
                                &larr; {trans('home')}
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Top Bar */}
                <header className="bg-white border-b border-secondary-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden text-secondary-700 hover:text-primary-900 p-1.5 rounded-lg border border-secondary-200"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-semibold text-secondary-950">{trans('admin_panel')}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/locale/${isRtl ? 'en' : 'ar'}`}
                            method="get"
                            as="button"
                            className="text-xs font-medium text-secondary-700 hover:text-primary-900 border border-secondary-200 rounded px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none"
                        >
                            {isRtl ? trans('lang_en') : trans('lang_ar')}
                        </Link>
                        
                        <div className="flex items-center gap-3 border-s border-secondary-200 ps-4 rtl:border-s-0 rtl:border-r rtl:pr-4 rtl:ps-0">
                            <button
                                onClick={toggleSound}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary-500 hover:bg-secondary-100 hover:text-secondary-950 transition-colors"
                                title={soundEnabled ? trans('disable_sound') : trans('enable_sound')}
                            >
                                {soundEnabled ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.5H4a1 1 0 00-1 1v5a1 1 0 001 1h2.5l4 4V4.5l-4 4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 8.5H4a1 1 0 00-1 1v5a1 1 0 001 1h1.5l4 4V4.5l-4 4zM16.5 9.5l5 5M21.5 9.5l-5 5" />
                                    </svg>
                                )}
                            </button>

                            <div ref={notifRef} className="relative">
                                <button
                                    onClick={openNotifDropdown}
                                    className="relative w-8 h-8 rounded-full flex items-center justify-center text-secondary-500 hover:bg-secondary-100 hover:text-secondary-950 transition-colors"
                                    title={trans('sidebar_notifications')}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                    {liveNotifCount > 0 && (
                                        <span className="absolute -top-0.5 -end-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                                            {liveNotifCount > 99 ? '99+' : liveNotifCount}
                                        </span>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-secondary-200 z-50 overflow-hidden animate-fade-in`}>
                                        <div className="p-3 border-b border-secondary-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-secondary-950">{trans('sidebar_notifications')}</span>
                                                {liveNotifCount > 0 && (
                                                    <span className="text-[11px] text-amber-600 font-semibold">{liveNotifCount} {isRtl ? 'جديد' : 'new'}</span>
                                                )}
                                            </div>
                                            {recentNotifs.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    {liveNotifCount > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={markAllNotifsRead}
                                                            className="text-[11px] text-primary-600 hover:text-primary-800 font-semibold transition-colors"
                                                            title={isRtl ? 'قراءة الكل' : 'Mark all read'}
                                                        >
                                                            {isRtl ? 'قراءة الكل' : 'Mark read'}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={clearAllNotifs}
                                                        className="text-[11px] text-red-600 hover:text-red-800 font-semibold transition-colors"
                                                        title={isRtl ? 'حذف الكل' : 'Clear all'}
                                                    >
                                                        {isRtl ? 'حذف الكل' : 'Clear all'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {loadingNotifs ? (
                                                <div className="p-6 text-center text-sm text-muted">{isRtl ? 'جاري التحميل...' : 'Loading...'}</div>
                                            ) : recentNotifs.length === 0 ? (
                                                <div className="p-6 text-center text-sm text-muted">{isRtl ? 'لا توجد إشعارات' : 'No notifications'}</div>
                                            ) : (
                                                recentNotifs.map(n => {
                                                    const isUnread = !n.read_at
                                                    const type = n.type || ''
                                                    let iconColor = 'bg-secondary-100 text-secondary-600'
                                                    if (type.includes('expiry') || type.includes('expired') || type === 'unit_pending_approval') iconColor = 'bg-amber-100 text-amber-700'
                                                    else if (type === 'new_project_created' || type === 'unit_approved') iconColor = 'bg-emerald-100 text-emerald-700'
                                                    else if (type === 'new_message') iconColor = 'bg-blue-100 text-blue-700'

                                                    return (
                                                        <button
                                                            key={n.id}
                                                            onClick={() => handleNotifItemClick(n)}
                                                            className={`w-full text-start p-3 border-b border-secondary-100 last:border-b-0 hover:bg-surface/50 transition-colors flex gap-3 ${isUnread ? 'bg-primary-50/20' : ''}`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs ${iconColor}`}>
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d={
                                                                     type.includes('expiry') || type.includes('expired') || type === 'unit_pending_approval'
                                                                         ? 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                                                                         : type === 'new_project_created' || type === 'unit_approved'
                                                                             ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                                                             : type === 'new_message'
                                                                                 ? 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                                                                                 : 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                                                                    } />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className={`text-xs leading-relaxed ${isUnread ? 'font-semibold text-secondary-950' : 'text-secondary-700'}`}>
                                                                    {n.title || n.message}
                                                                </p>
                                                                <span className="text-[10px] text-muted mt-0.5 block">{n.created_at_human}</span>
                                                            </div>
                                                            {isUnread && (
                                                                <span className="w-2 h-2 rounded-full bg-primary-900 shrink-0 mt-1.5" />
                                                            )}
                                                        </button>
                                                    )
                                                })
                                            )}
                                        </div>

                                        <Link
                                            href="/admin/notifications"
                                            onClick={() => setNotifOpen(false)}
                                            className="block p-3 text-center text-xs font-semibold text-primary-900 hover:bg-surface border-t border-secondary-100 transition-colors"
                                        >
                                            {isRtl ? 'عرض الكل' : 'View all'}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/admin/profile" className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded-full" title={trans('my_profile', {}, 'admin')}>
                                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center font-bold text-sm border border-primary-100 group-hover:bg-primary-900 group-hover:text-white transition-colors overflow-hidden relative">
                                    {auth?.user?.avatar && !avatarFailed ? (
                                        <img 
                                            src={auth.user.avatar.startsWith('http') || auth.user.avatar.startsWith('/storage') ? auth.user.avatar : `/storage/${auth.user.avatar}`} 
                                            alt={auth?.user?.name || ''} 
                                            className="w-full h-full object-cover"
                                            onError={() => setAvatarFailed(true)}
                                        />
                                    ) : (
                                        auth?.user?.name?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                            </Link>

                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary-500 hover:bg-red-50 hover:text-error transition-colors focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
                                title={trans('logout')}
                                aria-label="Logout"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.error && showFlash && (
                    <div className="mx-4 md:mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
                        <span>{flash.error}</span>
                        <button onClick={() => setShowFlash(false)} className="text-red-400 hover:text-red-600 me-2">&times;</button>
                    </div>
                )}
                {flash?.success && showFlash && (
                    <div className="mx-4 md:mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-between">
                        <span>{flash.success}</span>
                        <button onClick={() => setShowFlash(false)} className="text-green-400 hover:text-green-600 me-2">&times;</button>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}

