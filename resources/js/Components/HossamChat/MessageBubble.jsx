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

        const linkClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 my-0.5 rounded-lg bg-primary-50/80 hover:bg-primary-100 text-primary-900 font-bold text-xs border border-primary-200/60 transition-all cursor-pointer shadow-2xs hover:shadow-xs"

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
                    <svg className="w-3.5 h-3.5 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
                <svg className="w-3.5 h-3.5 shrink-0 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12l1.5 3H1.5L3 3z" />
                </svg>
                <span>{label}</span>
                <svg className="w-3 h-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
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
                    return <strong key={pIdx} className="font-bold text-slate-900">{formatInline(inner)}</strong>
                }
                return <strong key={pIdx} className="font-bold text-slate-900">{inner}</strong>
            }

            if (/^\/(?:ar|en)\/(?:units|projects)\/[^\s<),"]+$/i.test(part)) {
                const isProject = part.includes('/projects/')
                const fallbackLabel = isProject
                    ? (isRtl ? 'عرض المشروع' : 'View Project')
                    : (isRtl ? 'عرض الوحدة' : 'View Unit')
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
                    <div key={`tbl_${key}`} className="my-2 overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs bg-white">
                        <table className="min-w-full text-xs text-start divide-y divide-slate-100">
                            <tbody>
                                {tableRows.map((row, rIdx) => {
                                    const isHeader = rIdx === 0
                                    const isDivider = row.every(cell => /^[-:\s|]+$/.test(cell))
                                    if (isDivider) return null
                                    return (
                                        <tr key={rIdx} className={isHeader ? 'bg-slate-50 font-bold text-slate-900' : 'hover:bg-slate-50/50 text-slate-700 divide-x divide-slate-100'}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className={`px-2.5 py-1.5 whitespace-nowrap ${isHeader ? 'font-bold text-slate-900' : ''}`}>
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
                elements.push(<div key={idx} className="h-1" />)
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
                elements.push(<hr key={idx} className="my-2 border-slate-150" />)
                return
            }
            if (trimmed.startsWith('### ')) {
                elements.push(
                    <h4 key={idx} className="font-bold text-slate-900 text-xs sm:text-[13px] mt-2 mb-1 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-primary-600 rounded-full inline-block" />
                        <span>{formatInline(trimmed.slice(4))}</span>
                    </h4>
                )
                return
            }
            if (trimmed.startsWith('## ')) {
                elements.push(
                    <h3 key={idx} className="font-bold text-slate-900 text-sm mt-2.5 mb-1 text-primary-900 border-b border-slate-100 pb-1">
                        {formatInline(trimmed.slice(3))}
                    </h3>
                )
                return
            }
            if (trimmed.startsWith('# ')) {
                elements.push(
                    <h2 key={idx} className="font-black text-slate-950 text-sm sm:text-base mt-2.5 mb-1 text-primary-900">
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
                    <div key={idx} className="flex items-start gap-2 my-1 ps-0.5 text-slate-800 text-[13px]">
                        <span className="text-primary-600 font-bold leading-relaxed shrink-0">•</span>
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
                    <div key={idx} className="flex items-start gap-2 my-1 ps-0.5 text-slate-800 text-[13px]">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-primary-900 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200/80">{num}</span>
                        <span className="flex-1 leading-relaxed">{formatInline(numContent)}</span>
                    </div>
                )
                return
            }
            elements.push(
                <p key={idx} className="my-0.5 leading-relaxed text-slate-800 text-[13px]">
                    {formatInline(line)}
                </p>
            )
        })

        if (inTable) flushTable('end')
        return elements
    }

    return (
        <div className={`concierge-bubble-in flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-2 max-w-[92%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Assistant avatar icon */}
                {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center p-0.5 shrink-0 shadow-2xs mb-0.5">
                        <img
                            src="/images/ai-agent-head.webp"
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                {/* Message Bubble Card */}
                <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed transition-all ${
                        isUser
                            ? `bg-slate-900 text-white ${isRtl ? 'rounded-tl-xs' : 'rounded-tr-xs'} shadow-xs`
                            : msg.isError
                                ? 'bg-rose-50 text-rose-800 border border-rose-200/90 rounded-2xl shadow-2xs'
                                : `bg-white text-slate-800 border border-slate-200/70 ${isRtl ? 'rounded-tr-xs' : 'rounded-tl-xs'} shadow-xs`
                    }`}
                >
                    <div className={isUser ? 'text-white' : msg.isError ? 'text-rose-800' : 'text-slate-800'}>
                        {isUser
                            ? <span className={isStreaming ? 'streaming-caret' : ''}>{msg.content}</span>
                            : <span className={isStreaming ? 'streaming-caret' : ''}>{formatMessageText(msg.content)}</span>
                        }
                    </div>
                    {showMeta && (
                        <div className={`text-[10px] mt-1 text-end tabular-nums ${
                            isUser ? 'text-white/60' : 'text-slate-400'
                        }`}>
                            {msg.timestamp}
                        </div>
                    )}
                </div>
            </div>

            {/* Retry button under error messages */}
            {msg.isError && msg.retryText && !isLoading && (
                <button
                    type="button"
                    onClick={() => handleSendMessage(msg.retryText, msg.id)}
                    className="flex items-center gap-1.5 mt-1.5 ms-9 text-[11px] font-bold text-primary-700 hover:text-primary-900 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 px-3 py-1.5 rounded-full transition-all"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    {isRtl ? 'إعادة المحاولة' : 'Retry'}
                </button>
            )}

            {/* Feedback row under assistant messages */}
            {!isUser && !isStreaming && !msg.isError && (
                <div className="flex items-center gap-1 mt-1 ms-9">
                    <button
                        type="button"
                        onClick={() => setReaction(msg.id, 'up')}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            reaction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        aria-label="Helpful"
                        title="Helpful"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.75c.422 0 .828.077 1.205.218M5.904 18.75V9.75m0 9H3.75a2.25 2.25 0 0 1-2.25-2.25v-4.5a2.25 2.25 0 0 1 2.25-2.25h2.154" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => setReaction(msg.id, 'down')}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            reaction === 'down' ? 'text-rose-600 bg-rose-50' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        aria-label="Not helpful"
                        title="Not helpful"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 0H9.75m4.875-11.25H16.5m1.5 0h2.25a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 0 1-2.25 2.25h-2.25m0-9v9" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Dynamic Quick Replies */}
            {!isUser && !isStreaming && msg.quick_replies && msg.quick_replies.length > 0 && !isLoading && (
                <div className="ms-9 w-full">
                    <MessageQuickReplies
                        replies={msg.quick_replies}
                        onSelectReply={handleSendMessage}
                    />
                </div>
            )}
        </div>
    )
}
