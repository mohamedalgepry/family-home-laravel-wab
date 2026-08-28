import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

/* =====================================================================
   HOSSAM CHAT — "THE CONCIERGE"
   ---------------------------------------------------------------------
   A private-advisor-desk chat widget for Family Home. The visual
   language borrows from luxury transaction slips and editorial print:
   warm paper surface, hairline rules, a single crimson accent, and a
   signature "Concierge Pin" reference number in the header.

   Backend contract (AiAssistantController → /assistant/chat) is
   preserved exactly. Only the presentation layer is rebuilt.
   ===================================================================== */

const STORAGE_KEY = 'hossam_concierge_session_v1'
const PIN_PREFIX = { ar: 'CAIRO', en: 'GIZA' } // luxury concierge reference codes

// Build a stable, monospaced-feeling pin: "CAIRO · 0726-EG"
const buildConciergePin = (locale) => {
    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${PIN_PREFIX[locale] || PIN_PREFIX.ar} · ${dd}${mm}-EG`
}

const formatTime = (date, locale) =>
    new Date(date).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })

export default function HossamChatWidget() {
    const pageProps = usePage()?.props || {}
    const locale = pageProps.locale || (typeof document !== 'undefined' ? document.documentElement.lang : 'ar') || 'ar'
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const isAdmin = typeof window !== 'undefined' && window.location.pathname.includes('/admin')

    /* ---------- state ---------- */
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window === 'undefined') return false
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                return typeof parsed.isOpen === 'boolean' ? parsed.isOpen : false
            }
        } catch (e) {
            // Ignore parse errors
        }
        return false
    })
    const [isFullscreen, setIsFullscreen] = useState(() => {
        if (typeof window === 'undefined') return false
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                return typeof parsed.isFullscreen === 'boolean' ? parsed.isFullscreen : false
            }
        } catch (e) {
            // Ignore parse errors
        }
        return false
    })
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hasUnread, setHasUnread] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [feedback, setFeedback] = useState({}) // { [messageId]: 'up' | 'down' | null }
    const [streamedMessageId, setStreamedMessageId] = useState(null) // for caret animation

    const welcomeTimestamp = useMemo(() => formatTime(new Date(), locale), [locale])

    const [messages, setMessages] = useState(() => {
        // Try to restore last session from localStorage
        if (typeof window === 'undefined') {
            return [{
                id: 'welcome',
                role: 'assistant',
                content: trans('assistant_welcome'),
                recommended_units: [],
                timestamp: welcomeTimestamp,
            }]
        }
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
                    return parsed.messages
                }
            }
        } catch (e) {
            // Corrupted storage — fall through to default
        }
        return [{
            id: 'welcome',
            role: 'assistant',
            content: trans('assistant_welcome'),
            recommended_units: [],
            timestamp: welcomeTimestamp,
        }]
    })

    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const conciergePin = useMemo(() => buildConciergePin(locale), [locale])

    /* ---------- persistence ---------- */
    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ messages, isOpen, isFullscreen, savedAt: Date.now() })
            )
        } catch (e) {
            // localStorage may be full or disabled — fail silently
        }
    }, [messages, isOpen, isFullscreen])

    /* ---------- scroll + focus ---------- */
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false)
            scrollToBottom()
            const t = setTimeout(() => inputRef.current?.focus(), 250)
            return () => clearTimeout(t)
        }
    }, [isOpen, scrollToBottom])

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading, scrollToBottom])

    /* ---------- keyboard shortcuts ---------- */
    useEffect(() => {
        if (typeof window === 'undefined') return
        const handler = (e) => {
            // Esc to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false)
                setIsFullscreen(false)
            }
            // Cmd/Ctrl + K to toggle
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen])

    const quickQuestions = useMemo(() => [
        trans('assistant_quick_1'),
        trans('assistant_quick_2'),
        trans('assistant_quick_3'),
        trans('assistant_quick_4'),
    ], [trans])

    /* ---------- network ---------- */
    const handleSendMessage = async (textToSend = null) => {
        const text = (textToSend || inputMessage).trim()
        if (!text || isLoading) return

        const userMsg = {
            id: 'user_' + Date.now(),
            role: 'user',
            content: text,
            timestamp: formatTime(new Date(), locale),
        }

        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInputMessage('')
        setIsLoading(true)

        try {
            const historyPayload = newMessages
                .filter(m => m.id !== 'welcome' && !String(m.id).startsWith('welcome_'))
                .map(m => ({ role: m.role, content: m.content }))

            const csrfToken = typeof document !== 'undefined'
                ? (document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '')
                : ''

            const response = await fetch(`/${locale || 'ar'}/assistant/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    message: text,
                    history: historyPayload,
                    locale: locale || 'ar',
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            if (data && data.success) {
                const newBotId = 'bot_' + Date.now()
                setStreamedMessageId(newBotId)
                setMessages(prev => [
                    ...prev,
                    {
                        id: newBotId,
                        role: 'assistant',
                        content: data.reply,
                        recommended_units: data.recommended_units || [],
                        timestamp: formatTime(new Date(), locale),
                    }
                ])
                // Stop the streaming caret after a moment
                setTimeout(() => setStreamedMessageId(null), 1400)
            } else {
                throw new Error('Empty reply payload')
            }
        } catch (error) {
            console.error('Hossam Assistant Error:', error)
            setMessages(prev => [
                ...prev,
                {
                    id: 'bot_err_' + Date.now(),
                    role: 'assistant',
                    content: isRtl
                        ? 'أهلاً بك! أنا حسام. عذراً حدث ضغط مؤقت في الاتصال، يرجى المحاولة مرة أخرى أو اختيار أحد الأسئلة السريعة.'
                        : 'Hello! I am Hossam. A temporary network congestion occurred. Please try again or tap one of the quick suggestions below.',
                    recommended_units: [],
                    timestamp: formatTime(new Date(), locale),
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const resetChat = () => {
        setMessages([
            {
                id: 'welcome_' + Date.now(),
                role: 'assistant',
                content: trans('assistant_welcome'),
                recommended_units: [],
                timestamp: formatTime(new Date(), locale),
            }
        ])
        setFeedback({})
        if (typeof window !== 'undefined') {
            try { window.localStorage.removeItem(STORAGE_KEY) } catch (e) { /* ignore */ }
        }
    }

    const setReaction = (messageId, reaction) => {
        setFeedback(prev => ({ ...prev, [messageId]: prev[messageId] === reaction ? null : reaction }))
    }

    /* ---------- markdown helpers ---------- */
    const formatInline = (str) => {
        if (!str) return null
        const parts = str.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g)
        return parts.map((part, pIdx) => {
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
            if (linkMatch) {
                return (
                    <Link
                        key={pIdx}
                        href={linkMatch[2]}
                        className="text-[#CC0000] font-bold underline underline-offset-2 decoration-[#CC0000]/30 hover:text-[#990000] hover:decoration-[#990000]/60 transition-colors"
                    >
                        {linkMatch[1]}
                    </Link>
                )
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>
            }
            return part
        })
    }
    const formatMessageText = (text) => {
        if (!text) return null
        const lines = text.split('\n')
        const elements = []
        let inTable = false
        let tableRows = []

        const flushTable = (key) => {
            if (tableRows.length > 0) {
                elements.push(
                    <div key={`tbl_${key}`} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
                        <table className="min-w-full text-xs text-start divide-y divide-slate-200">
                            <tbody>
                                {tableRows.map((row, rIdx) => {
                                    const isHeader = rIdx === 0
                                    const isDivider = row.every(cell => /^[-:\s|]+$/.test(cell))
                                    if (isDivider) return null
                                    return (
                                        <tr key={rIdx} className={isHeader ? 'bg-slate-100/90 font-bold text-slate-900' : 'hover:bg-slate-50/80 text-slate-700 divide-x divide-slate-100'}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className={`px-2.5 py-1.5 whitespace-nowrap ${isHeader ? 'font-black text-slate-900' : ''}`}>
                                                    {formatInline(cell)}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
                tableRows = []
            }
            inTable = false
        }

        lines.forEach((line, idx) => {
            const trimmed = line.trim()
            if (!trimmed) {
                if (inTable) flushTable(idx)
                elements.push(<div key={idx} className="h-1.5" />)
                return
            }
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                inTable = true
                const cells = trimmed.slice(1, -1).split('|').map(c => c.trim())
                tableRows.push(cells)
                return
            } else if (inTable) {
                flushTable(idx)
            }
            if (/^[-*_]{3,}$/.test(trimmed)) {
                elements.push(<hr key={idx} className="my-2.5 border-slate-200" />)
                return
            }
            if (trimmed.startsWith('### ')) {
                elements.push(
                    <h4 key={idx} className="font-bold text-slate-900 text-xs sm:text-sm mt-2.5 mb-1 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-[#CC0000] rounded-full inline-block"></span>
                        <span>{formatInline(trimmed.slice(4))}</span>
                    </h4>
                )
                return
            }
            if (trimmed.startsWith('## ')) {
                elements.push(
                    <h3 key={idx} className="font-black text-slate-950 text-sm mt-3 mb-1.5 text-[#990000] border-b border-slate-200/80 pb-1">
                        {formatInline(trimmed.slice(3))}
                    </h3>
                )
                return
            }
            if (trimmed.startsWith('# ')) {
                elements.push(
                    <h2 key={idx} className="font-black text-slate-950 text-sm sm:text-base mt-3 mb-1.5 text-[#990000]">
                        {formatInline(trimmed.slice(2))}
                    </h2>
                )
                return
            }
            let bulletContent = null
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                bulletContent = trimmed.slice(2).trim()
            } else if (trimmed.startsWith('•')) {
                bulletContent = trimmed.slice(1).trim()
            }
            if (bulletContent !== null) {
                if (bulletContent.length === 0) return
                elements.push(
                    <div key={idx} className="flex items-start gap-2 my-1 ps-1 text-slate-800 text-xs sm:text-sm">
                        <span className="text-[#CC0000] font-black leading-relaxed shrink-0">•</span>
                        <span className="flex-1 leading-relaxed">{formatInline(bulletContent)}</span>
                    </div>
                )
                return
            }
            if (/^\d+\.\s/.test(trimmed)) {
                const dotPos = trimmed.indexOf('.')
                const num = trimmed.slice(0, dotPos)
                const numContent = trimmed.slice(dotPos + 1).trim()
                elements.push(
                    <div key={idx} className="flex items-start gap-2 my-1.5 ps-1 text-slate-800 text-xs sm:text-sm">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-[#CC0000] font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">{num}</span>
                        <span className="flex-1 leading-relaxed font-semibold">{formatInline(numContent)}</span>
                    </div>
                )
                return
            }
            elements.push(
                <p key={idx} className="my-1 leading-relaxed text-slate-800 text-xs sm:text-sm">
                    {formatInline(line)}
                </p>
            )
        })

        if (inTable) flushTable('end')
        return elements
    }


    /* ---------- derived ---------- */
    const showQuickQuestions = messages.length === 1 && !isLoading

    /* ---------- render ---------- */
    if (isAdmin) {
        return null
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="fixed z-50 bottom-6 end-4 sm:bottom-8 sm:end-8 print:hidden font-sans">

            {/* =================== FAB =================== */}
            {!isOpen && (
                <div className="relative flex items-center">
                    {/* Hover Tooltip (Desktop) */}
                    <div
                        className={`hidden sm:flex absolute ${
                            isRtl ? 'end-full me-3.5' : 'start-full ms-3.5'
                        } items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl whitespace-nowrap transition-all duration-300 pointer-events-none ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                        }`}
                    >
                        <span>{trans('assistant_name')}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/80 font-normal">{trans('assistant_title')}</span>
                        <span className="bg-[#CC0000] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black tracking-wider">AI</span>
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white flex items-center justify-center transition-all duration-300 outline-none focus:ring-4 focus:ring-[#CC0000]/30 ${
                            hasUnread
                                ? 'concierge-pulse bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]'
                                : 'bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.20)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.30)]'
                        }`}
                        aria-label={trans('assistant_name')}
                        title={trans('assistant_name')}
                    >
                        {/* Status Glowing Dot (emerald) */}
                        <span className="absolute top-1.5 end-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#1A1A1A] shadow-sm"></span>
                        </span>

                        {/* Monogram — "H" with a crimson dot. Reads as an advisor's
                            personal seal, not a generic chat icon. */}
                        <div className="concierge-fab-icon relative flex items-center justify-center">
                            <span className="font-black text-xl sm:text-2xl tracking-tight text-white leading-none select-none">
                                H<span className="inline-block w-1.5 h-1.5 rounded-full bg-[#CC0000] align-top ms-0.5"></span>
                            </span>
                        </div>

                        {/* Unread AI tag */}
                        {hasUnread && (
                            <span className="absolute -bottom-0.5 -start-0.5 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow animate-pulse tracking-wider">
                                AI
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* =================== CONCIERGE WINDOW =================== */}
            {isOpen && (
                <div
                    className={`concierge-open flex flex-col bg-white overflow-hidden border border-slate-200/80 ${
                        isFullscreen
                            ? 'fixed inset-0 w-screen h-[100dvh] rounded-none sm:inset-4 sm:w-[calc(100vw-32px)] sm:h-[calc(100dvh-32px)] sm:max-w-[460px] sm:ml-auto sm:rounded-[28px]'
                            : 'w-[calc(100vw-32px)] sm:w-[440px] h-[640px] max-h-[84vh] rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.30)]'
                    }`}
                    role="dialog"
                    aria-label={trans('assistant_name')}
                >

                    {/* ========== Header — the "advisor's letterhead" ========== */}
                    <header className="bg-white border-b concierge-rule shrink-0 concierge-safe-top">
                        <div className="px-4 sm:px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Advisor avatar — clean monogram, not an emoji */}
                                <div className="relative shrink-0">
                                    <div className="w-11 h-11 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-sm">
                                        <span className="font-black text-lg leading-none">H</span>
                                    </div>
                                    <span className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" aria-hidden="true"></span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h3 className="font-black text-[15px] leading-none text-slate-950 tracking-tight">
                                            {trans('assistant_name')}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#8B0000] bg-[#FFF5F5] border border-[#FFE3E3] px-1.5 py-0.5 rounded">
                                            <span className="w-1 h-1 rounded-full bg-[#CC0000]"></span>
                                            Concierge
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1 truncate">
                                        {trans('assistant_title')}
                                    </p>
                                </div>
                            </div>
                            {/* Header actions */}
                            <div className="flex items-center gap-0.5 shrink-0">
                                <button
                                    onClick={() => setIsFullscreen(prev => !prev)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
                                    title={isFullscreen ? (isRtl ? 'تصغير' : 'Minimize') : (isRtl ? 'ملء الشاشة' : 'Fullscreen')}
                                    aria-label={isFullscreen ? (isRtl ? 'تصغير' : 'Minimize') : (isRtl ? 'ملء الشاشة' : 'Fullscreen')}
                                >
                                    {isFullscreen ? (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4H4v5M15 9V4h5v5M9 15v5H4v-5M15 15v5h5v-5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={resetChat}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
                                    title={trans('assistant_clear')}
                                    aria-label={trans('assistant_clear')}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => { setIsOpen(false); setIsFullscreen(false) }}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
                                    title={trans('assistant_close')}
                                    aria-label={trans('assistant_close')}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* Hairline meta strip — the signature Concierge Pin */}
                        <div className="px-4 sm:px-5 pb-2.5 flex items-center justify-between text-[10px] text-slate-400 font-medium tracking-wider">
                            <span className="concierge-pin font-bold">{conciergePin}</span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-slate-500">{trans('assistant_status')}</span>
                            </span>
                        </div>
                    </header>

                    {/* ========== Messages area — warm paper ========== */}
                    <div
                        className="flex-1 px-4 sm:px-5 py-4 overflow-y-auto concierge-paper custom-scrollbar"
                        aria-live="polite"
                    >
                        <div className="space-y-4">
                            {messages.map((msg) => {
                                const isUser = msg.role === 'user'
                                const isStreaming = msg.id === streamedMessageId
                                const reaction = feedback[msg.id] || null
                                const showMeta = !isStreaming
                                return (
                                    <div
                                        key={msg.id}
                                        className={`concierge-bubble-in flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                                                isUser
                                                    ? 'bg-[#1A1A1A] text-white rounded-br-md shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                                                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                                            }`}
                                        >
                                            <div className={isUser ? 'text-white' : 'text-slate-800'}>
                                                {isUser
                                                    ? <span className={isStreaming ? 'streaming-caret' : ''}>{msg.content}</span>
                                                    : <span className={isStreaming ? 'streaming-caret' : ''}>{formatMessageText(msg.content)}</span>
                                                }
                                            </div>
                                            {showMeta && (
                                                <div className={`text-[10px] mt-1.5 text-end tabular-nums tracking-wide ${
                                                    isUser ? 'text-white/60' : 'text-slate-400'
                                                }`}>
                                                    {msg.timestamp}
                                                </div>
                                            )}
                                        </div>

                                        {/* Feedback row — under assistant messages only */}
                                        {!isUser && !isStreaming && (
                                            <div className="flex items-center gap-1 mt-1 ms-1">
                                                <button
                                                    onClick={() => setReaction(msg.id, 'up')}
                                                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                                        reaction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-slate-500'
                                                    }`}
                                                    aria-label="Helpful"
                                                    title="Helpful"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9A2 2 0 0019.7 9H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setReaction(msg.id, 'down')}
                                                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                                        reaction === 'down' ? 'text-rose-600 bg-rose-50' : 'text-slate-300 hover:text-slate-500'
                                                    }`}
                                                    aria-label="Not helpful"
                                                    title="Not helpful"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9A2 2 0 004.3 15H10zM17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {/* Recommended property cards — under assistant messages */}
                                        {msg.recommended_units && msg.recommended_units.length > 0 && (
                                            <div className="w-full mt-3 space-y-2 max-w-[96%]">
                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="w-1 h-3 bg-[#CC0000] rounded-full"></span>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                                                        {isRtl ? 'العقارات المتاحة' : 'Matching inventory'}
                                                    </p>
                                                </div>
                                                {msg.recommended_units.map((unit) => (
                                                    <div
                                                        key={unit.id}
                                                        className="bg-white rounded-xl p-2.5 border border-slate-200 hover:border-slate-300 transition-all flex gap-3 items-center group"
                                                    >
                                                        <img
                                                            src={unit.image_url}
                                                            alt={unit.name}
                                                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-100 bg-slate-100"
                                                            loading="lazy"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-slate-900 text-[12.5px] truncate group-hover:text-[#CC0000] transition-colors">
                                                                {unit.name}
                                                            </h4>
                                                            <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                                                {unit.area_name || (isRtl ? 'موقع متميز' : 'Prime Location')}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-[12px] font-black text-[#CC0000] tabular-nums">
                                                                    {unit.price_formatted}
                                                                </span>
                                                                <span className="text-[9px] font-semibold text-slate-500">
                                                                    {unit.currency}
                                                                </span>
                                                                {unit.rooms > 0 && (
                                                                    <span className="text-[9.5px] text-slate-400 ms-auto">
                                                                        • {unit.rooms} {isRtl ? 'غرف' : 'rm'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-1.5">
                                                                <Link
                                                                    href={unit.url}
                                                                    className="text-[10px] font-bold text-slate-900 hover:text-[#CC0000] underline underline-offset-2 decoration-slate-300 hover:decoration-[#CC0000] transition-colors"
                                                                >
                                                                    {trans('assistant_view_unit')}
                                                                </Link>
                                                                {unit.whatsapp_url && (
                                                                    <a
                                                                        href={unit.whatsapp_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 ms-2 inline-flex items-center gap-0.5"
                                                                    >
                                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.5 2 2 6.5 2 12c0 1.78.46 3.45 1.26 4.9L2 22l5.25-1.23C8.7 21.56 10.31 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                                                                        </svg>
                                                                        <span>{trans('assistant_whatsapp')}</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {/* Typing indicator — three dots with a refined cadence */}
                            {isLoading && (
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2.5 text-slate-500 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-bl-md max-w-[80%] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                                        <div className="flex gap-1 items-center" aria-hidden="true">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce [animation-delay:-0.32s]"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce [animation-delay:-0.16s]"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce"></span>
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
                                            {trans('assistant_typing')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* ========== Quick question chips (first message only) ========== */}
                    {showQuickQuestions && (
                        <div className="px-4 sm:px-5 py-3 bg-white border-t concierge-rule shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 mb-2">
                                {isRtl ? 'اقتراحات سريعة' : 'Quick start'}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {quickQuestions.map((q, qIdx) => (
                                    <button
                                        key={qIdx}
                                        onClick={() => handleSendMessage(q)}
                                        className="text-[11.5px] font-semibold text-slate-700 bg-slate-50 hover:bg-[#FFF5F5] hover:text-[#8B0000] border border-slate-200 hover:border-[#FFE3E3] px-2.5 py-1.5 rounded-full transition-all text-start leading-snug"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========== Composer ========== */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSendMessage()
                        }}
                        className="p-3 sm:p-3.5 bg-white border-t concierge-rule shrink-0 concierge-safe-bottom"
                    >
                        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-[#CC0000] focus-within:ring-2 focus-within:ring-[#CC0000]/15 focus-within:bg-white transition-all">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                placeholder={trans('assistant_placeholder')}
                                disabled={isLoading}
                                rows={1}
                                className="flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none resize-none text-[13.5px] text-slate-900 placeholder:text-slate-400 leading-relaxed max-h-24 disabled:opacity-60 px-1 py-1 shadow-none"
                                style={{ minHeight: '24px', outline: 'none', boxShadow: 'none' }}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="w-9 h-9 rounded-xl bg-[#1A1A1A] hover:bg-[#CC0000] disabled:opacity-30 disabled:hover:bg-[#1A1A1A] text-white flex items-center justify-center transition-all shrink-0"
                                aria-label={isRtl ? 'إرسال' : 'Send'}
                            >
                                <svg
                                    className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </button>
                        </div>
                        {/* Hairline footer — keyboard hint + brand microcopy */}
                        <div className="flex items-center justify-between mt-2 px-1 text-[9.5px] text-slate-400 font-medium tracking-wider uppercase">
                            <span className="hidden sm:inline">
                                {isRtl ? 'اضغط Enter للإرسال' : 'Press Enter to send'}
                            </span>
                            <span className="concierge-pin font-bold hidden sm:inline">
                                {conciergePin}
                            </span>
                            <span className="text-slate-300">
                                {isRtl ? 'مدعوم بالذكاء الاصطناعي' : 'AI-powered'}
                            </span>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
