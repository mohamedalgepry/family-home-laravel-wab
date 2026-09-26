import React from 'react'
import { Link } from '@inertiajs/react'
import { MessageQuickReplies } from './QuickReplies'

export default function MessageBubble({
    msg,
    isStreaming,
    reaction,
    setReaction,
    handleSendMessage,
    isRtl,
    isLoading,
    onUnitClick,
}) {
    const isUser = msg.role === 'user'
    const showMeta = !isStreaming

    const renderInteractiveLink = (rawUrl, label, key) => {
        let cleanUrl = (rawUrl || '').trim()
        let isInternal = false

        try {
            if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
                const parsed = new URL(cleanUrl)
                const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
                if (currentOrigin && parsed.origin === currentOrigin) {
                    cleanUrl = parsed.pathname + parsed.search + parsed.hash
                    isInternal = true
                } else if (/^\/(?:(?:ar|en)\/)?(?:units|projects|about|contact)/i.test(parsed.pathname)) {
                    cleanUrl = parsed.pathname + parsed.search + parsed.hash
                    isInternal = true
                }
            } else if (cleanUrl.startsWith('/') && !cleanUrl.startsWith('//')) {
                isInternal = true
            }
        } catch (e) {
            // Ignore parse errors
        }

        const isInternalUnitOrProject = isInternal && /^\/(?:(?:ar|en)\/)?(?:units|projects|about|contact)(?:[/?#]|$)/i.test(cleanUrl)
        const isExternalSafe = /^https:\/\/wa\.me\//i.test(cleanUrl) ||
            /^tel:[+0-9\s-]+$/i.test(cleanUrl) ||
            /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(cleanUrl) ||
            cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')

        if (!isInternalUnitOrProject && !isExternalSafe) {
            return <span key={key} className="font-semibold text-slate-800">{label}</span>
        }

        const linkClasses = "text-[#CC0000] hover:text-[#990000] font-bold underline underline-offset-4 decoration-[#CC0000]/70 hover:decoration-[#990000] transition-colors inline-flex items-center gap-1 mx-0.5 cursor-pointer select-auto"

        if (!isInternalUnitOrProject) {
            return (
                <a
                    key={key}
                    href={cleanUrl}
                    target={cleanUrl.startsWith('http') ? "_blank" : undefined}
                    rel={cleanUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                    className={linkClasses}
                    title={label}
                >
                    <span>{label}</span>
                    <svg className="w-3.5 h-3.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            )
        }

        return (
            <Link
                key={key}
                href={cleanUrl}
                onClick={onUnitClick}
                className={linkClasses}
                title={label}
            >
                <span>{label}</span>
                <svg className="w-3.5 h-3.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </Link>
        )
    }

    const formatInline = (str) => {
        if (!str) return null

        const tokenRegex = /(\*\*\[[^\]]+\]\([^)]+\)\*\*|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\/(?:ar|en)\/(?:units|projects)\/[^\s<),"]+|https?:\/\/[^\s<),"]+)/g
        const parts = str.split(tokenRegex)

        return parts.map((part, pIdx) => {
            if (!part) return null

            const boldLinkMatch = part.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/)
            const stdLinkMatch = !boldLinkMatch ? part.match(/^\[([^\]]+)\]\(([^)]+)\)$/) : null
            const linkMatch = boldLinkMatch || stdLinkMatch

            if (linkMatch) {
                let label = (linkMatch[1] || '').trim()
                if (label.startsWith('**') && label.endsWith('**') && label.length > 4) {
                    label = label.slice(2, -2).trim()
                }
                const rawUrl = (linkMatch[2] || '').trim()
                return renderInteractiveLink(rawUrl, label, pIdx)
            }

            if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                const inner = part.slice(2, -2)
                if (/\[[^\]]+\]\([^)]+\)/.test(inner)) {
                    return <strong key={pIdx} className="font-bold text-slate-950">{formatInline(inner)}</strong>
                }
                return <strong key={pIdx} className="font-bold text-slate-950">{inner}</strong>
            }

            if (/^\/(?:ar|en)\/(?:units|projects)\/[^\s<),"]+$/i.test(part)) {
                const isProject = part.includes('/projects/')
                const fallbackLabel = isProject
                    ? (isRtl ? 'عرض تفاصيل المشروع 🏢' : 'View Project Details 🏢')
                    : (isRtl ? 'عرض تفاصيل الوحدة 🏠' : 'View Unit Details 🏠')
                return renderInteractiveLink(part, fallbackLabel, pIdx)
            }

            if (/^https?:\/\/[^\s<),"]+$/i.test(part)) {
                return renderInteractiveLink(part, part, pIdx)
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

    return (
        <div className={`concierge-bubble-in flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    isUser
                        ? 'bg-[#1A1A1A] text-white rounded-br-md shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                        : msg.isError
                            ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                }`}
            >
                <div className={isUser ? 'text-white' : msg.isError ? 'text-rose-800' : 'text-slate-800'}>
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

            {/* Retry button under error messages */}
            {msg.isError && msg.retryText && !isLoading && (
                <button
                    type="button"
                    onClick={() => handleSendMessage(msg.retryText, msg.id)}
                    className="flex items-center gap-1.5 mt-1.5 ms-1 text-[11px] font-bold text-[#CC0000] hover:text-[#990000] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full transition-all"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isRtl ? 'إعادة المحاولة' : 'Retry'}
                </button>
            )}

            {/* Feedback row under assistant messages */}
            {!isUser && !isStreaming && !msg.isError && (
                <div className="flex items-center gap-1 mt-1 ms-1">
                    <button
                        type="button"
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
                        type="button"
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

            {/* Dynamic Quick Replies */}
            {!isUser && !isStreaming && msg.quick_replies && msg.quick_replies.length > 0 && !isLoading && (
                <MessageQuickReplies
                    replies={msg.quick_replies}
                    onSelectReply={handleSendMessage}
                />
            )}
        </div>
    )
}
