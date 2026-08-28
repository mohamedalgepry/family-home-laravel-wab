import React, { useState, useEffect, useRef } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function HossamChatWidget() {
    const pageProps = usePage()?.props || {}
    const locale = pageProps.locale || (typeof document !== 'undefined' ? document.documentElement.lang : 'ar') || 'ar'
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    // Do not show widget on admin routes
    if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
        return null
    }

    const [isOpen, setIsOpen] = useState(false)
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hasUnread, setHasUnread] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: trans('assistant_welcome'),
            recommended_units: [],
            timestamp: new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        }
    ])

    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false)
            scrollToBottom()
            setTimeout(() => inputRef.current?.focus(), 200)
        }
    }, [isOpen, messages, isLoading])

    const quickQuestions = [
        trans('assistant_quick_1'),
        trans('assistant_quick_2'),
        trans('assistant_quick_3'),
        trans('assistant_quick_4'),
    ]

    const handleSendMessage = async (textToSend = null) => {
        const text = (textToSend || inputMessage).trim()
        if (!text || isLoading) return

        const userMsg = {
            id: 'user_' + Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        }

        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInputMessage('')
        setIsLoading(true)

        try {
            const historyPayload = newMessages
                .filter(m => m.id !== 'welcome')
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

            if (data && data.reply) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: 'bot_' + Date.now(),
                        role: 'assistant',
                        content: data.reply,
                        recommended_units: data.recommended_units || [],
                        timestamp: new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
                    }
                ])
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
                    timestamp: new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
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
                timestamp: new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
            }
        ])
    }

    // Helper to format inline bold text
    const formatInline = (str) => {
        if (!str) return null
        const parts = str.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>
            }
            return part
        })
    }

    // Format rich text, tables, and markdown elements
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

            // Table row
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                inTable = true
                const cells = trimmed.slice(1, -1).split('|').map(c => c.trim())
                tableRows.push(cells)
                return
            } else if (inTable) {
                flushTable(idx)
            }

            // Divider
            if (/^[-*_]{3,}$/.test(trimmed)) {
                elements.push(<hr key={idx} className="my-2.5 border-slate-200" />)
                return
            }

            // Headers
            if (trimmed.startsWith('### ')) {
                elements.push(
                    <h4 key={idx} className="font-bold text-slate-900 text-xs sm:text-sm mt-2.5 mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-[#CC0000] rounded-full inline-block"></span>
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

            // Bullet points (- or * or •)
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

            // Numbered items (1. 2. 3.)
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

            // Normal paragraph
            elements.push(
                <p key={idx} className="my-1 leading-relaxed text-slate-800 text-xs sm:text-sm">
                    {formatInline(line)}
                </p>
            )
        })

        if (inTable) flushTable('end')
        return elements
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="fixed z-50 bottom-6 end-4 sm:bottom-8 sm:end-8 print:hidden font-sans">
            {/* Simple Circular Floating Action Button (FAB) */}
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
                        <span className="bg-[#CC0000] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">AI</span>
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#CC0000] via-[#B80000] to-[#8F0000] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(204,0,0,0.40)] hover:shadow-[0_14px_35px_rgba(204,0,0,0.55)] hover:scale-108 active:scale-95 transition-all duration-300 outline-none ring-4 ring-white/80 focus:ring-[#CC0000]/30"
                        aria-label={trans('assistant_name')}
                        title={trans('assistant_name')}
                    >
                        {/* Status Glowing Dot */}
                        <span className="absolute top-1 end-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-sm"></span>
                        </span>

                        {/* Modern Real Estate Advisor SVG Icon */}
                        <div className="relative flex items-center justify-center">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                                {/* Head & Suit */}
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                {/* AI Sparkle in corner */}
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} className="text-amber-300" stroke="currentColor" d="M19 3v4m-2-2h4" />
                            </svg>
                        </div>

                        {/* Unread Message Dot */}
                        {hasUnread && (
                            <span className="absolute -bottom-0.5 -start-0.5 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white shadow animate-pulse">
                                AI
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Premium Chat Window */}
            {isOpen && (
                <div className="w-[calc(100vw-32px)] sm:w-[420px] h-[600px] max-h-[84vh] bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/90 flex flex-col overflow-hidden animate-fade-in transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#990000] via-[#B80000] to-[#CC0000] text-white px-4.5 py-3.5 flex items-center justify-between shadow-md select-none shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#990000] rounded-full shadow-sm"></span>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-black text-base leading-tight tracking-wide">{trans('assistant_name')}</h3>
                                    <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">AI Expert</span>
                                </div>
                                <p className="text-[11px] text-white/80 font-medium leading-tight mt-0.5">{trans('assistant_title')}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={resetChat}
                                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                                title={trans('assistant_clear')}
                                aria-label={trans('assistant_clear')}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors text-xl font-bold"
                                title={trans('assistant_close')}
                                aria-label={trans('assistant_close')}
                            >
                                &times;
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50/80 space-y-3.5 text-sm custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm text-sm ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-[#CC0000] to-[#B00000] text-white rounded-be-none font-medium'
                                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bs-none'
                                    }`}
                                >
                                    {formatMessageText(msg.content)}
                                    <div className={`text-[10px] mt-1.5 text-end ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                                        {msg.timestamp}
                                    </div>
                                </div>

                                {/* Embedded Recommended Property Cards */}
                                {msg.recommended_units && msg.recommended_units.length > 0 && (
                                    <div className="w-full mt-3 space-y-2 max-w-[95%]">
                                        <p className="text-xs font-bold text-slate-700 px-1 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-[#CC0000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{isRtl ? 'العقارات المتاحة المطابقة لتحليلك:' : 'Matching properties for your analysis:'}</span>
                                        </p>
                                        {msg.recommended_units.map((unit) => (
                                            <div
                                                key={unit.id}
                                                className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-3 items-center group"
                                            >
                                                <img
                                                    src={unit.image_url}
                                                    alt={unit.name}
                                                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-100"
                                                    loading="lazy"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-[#CC0000] transition-colors">
                                                        {unit.name}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                        📍 {unit.area_name || (isRtl ? 'موقع متميز' : 'Prime Location')}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-black text-[#CC0000]">
                                                            {unit.price_formatted} {unit.currency}
                                                        </span>
                                                        {unit.rooms > 0 && (
                                                            <span className="text-[10px] text-slate-500 font-medium">
                                                                • {unit.rooms} {isRtl ? 'غرف' : 'rooms'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Card Actions */}
                                                    <div className="flex items-center gap-1.5 mt-2">
                                                        <Link
                                                            href={unit.url}
                                                            className="text-[11px] font-bold text-[#CC0000] bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                                                        >
                                                            {trans('assistant_view_unit')}
                                                        </Link>
                                                        {unit.whatsapp_url && (
                                                            <a
                                                                href={unit.whatsapp_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                                            >
                                                                <span>واتساب</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isLoading && (
                            <div className="flex items-center gap-2.5 text-slate-500 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-bs-none max-w-[75%] shadow-sm">
                                <div className="flex gap-1 items-center">
                                    <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-bounce"></span>
                                    <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                                <span className="text-xs font-semibold text-slate-600">{trans('assistant_typing')}</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Question Chips (Visible on new session) */}
                    {messages.length === 1 && !isLoading && (
                        <div className="px-3.5 py-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
                            {quickQuestions.map((q, qIdx) => (
                                <button
                                    key={qIdx}
                                    onClick={() => handleSendMessage(q)}
                                    className="text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-red-50 hover:text-[#CC0000] border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-all text-start leading-tight"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Footer */}
                    <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSendMessage()
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={trans('assistant_placeholder')}
                                disabled={isLoading}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/15 focus:bg-white transition-all disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#CC0000] to-[#B00000] hover:from-[#B00000] hover:to-[#900000] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0"
                                aria-label="إرسال"
                            >
                                <svg
                                    className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}


