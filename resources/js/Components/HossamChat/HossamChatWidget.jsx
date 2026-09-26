import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

import { useChatSession, buildConciergePin } from './hooks/useChatSession'
import { useChatApi } from './hooks/useChatApi'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import { QuickQuestionsChips } from './QuickReplies'
import ChatComposer from './ChatComposer'

export default function HossamChatWidget() {
    const pageObj = usePage() || {}
    const pageProps = pageObj.props || {}
    const component = pageObj.component || ''
    const url = pageObj.url || ''
    const locale = pageProps.locale || (typeof document !== 'undefined' ? document.documentElement.lang : 'ar') || 'ar'
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const isAdmin = typeof window !== 'undefined' && window.location.pathname.includes('/admin')

    // Detect whether current page has a fixed mobile bottom action bar
    const isTargetPage = Boolean(
        component === 'Public/Units/Show' ||
        component === 'Public/Projects/Show' ||
        (url && /^\/(?:(?:ar|en)\/)?(?:units|projects)\/[^/?#]+/i.test(url) && !url.includes('/deals'))
    )

    const [hasFixedBottomBar, setHasFixedBottomBar] = useState(() => {
        if (typeof window === 'undefined') return isTargetPage
        return isTargetPage && window.innerWidth < 768
    })

    useEffect(() => {
        const updateBottomBarStatus = () => {
            if (typeof window === 'undefined') return
            const isMobile = window.innerWidth < 768
            const hasDomBottomBar = Boolean(document.querySelector('.fixed.bottom-0'))
            setHasFixedBottomBar(isMobile && (isTargetPage || hasDomBottomBar))
        }

        updateBottomBarStatus()
        window.addEventListener('resize', updateBottomBarStatus, { passive: true })
        window.addEventListener('orientationchange', updateBottomBarStatus, { passive: true })
        return () => {
            window.removeEventListener('resize', updateBottomBarStatus)
            window.removeEventListener('orientationchange', updateBottomBarStatus)
        }
    }, [component, url, isTargetPage])

    /* ---------- session & persistence ---------- */
    const {
        isOpen,
        setIsOpen,
        isFullscreen,
        setIsFullscreen,
        hasUnread,
        setHasUnread,
        isHovered,
        setIsHovered,
        feedback,
        setReaction,
        proactivePill,
        setProactivePill,
        messages,
        setMessages,
        resetChat,
    } = useChatSession(locale, trans, isRtl, pageProps)

    /* ---------- chat network api ---------- */
    const {
        isLoading,
        typingStage,
        streamedMessageId,
        handleSendMessage,
    } = useChatApi({
        messages,
        setMessages,
        locale,
        pageProps,
        isRtl,
    })

    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const fabButtonRef = useRef(null)
    const wasOpenRef = useRef(false)
    const conciergePin = useMemo(() => buildConciergePin(locale), [locale])

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
    }, [isOpen, scrollToBottom, setHasUnread])

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading, scrollToBottom])

    // Cancel speech synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel()
        }
    }, [])

    // Handle Escape key, focus restoration, Cmd/Ctrl+K shortcut
    useEffect(() => {
        if (!isOpen) {
            if (wasOpenRef.current && fabButtonRef.current) {
                fabButtonRef.current.focus()
            }
            wasOpenRef.current = false
            return
        }

        wasOpenRef.current = true

        const handler = (e) => {
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault()
                setIsOpen(false)
                setIsFullscreen(false)
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, setIsOpen, setIsFullscreen])

    const quickQuestions = useMemo(() => [
        trans('assistant_quick_1'),
        trans('assistant_quick_2'),
        trans('assistant_quick_3'),
        trans('assistant_quick_4'),
    ], [trans])

    const handleUnitLinkClick = useCallback(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 768 || isFullscreen) {
                setIsOpen(false)
                setIsFullscreen(false)
            }
        }
    }, [isFullscreen, setIsOpen, setIsFullscreen])

    const showQuickQuestions = messages.length === 1 && !isLoading

    if (isAdmin) {
        return null
    }

    return (
        <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`fixed z-50 end-4 sm:bottom-8 sm:end-8 print:hidden font-sans transition-all duration-300 ${
                hasFixedBottomBar
                    ? 'bottom-[88px]'
                    : 'bottom-6'
            }`}
        >
            {/* =================== FAB =================== */}
            {!isOpen && (
                <div className="relative flex items-center">
                    {/* Contextual Proactive Invitation Pill */}
                    {proactivePill && (
                        <div
                            className={`absolute bottom-full mb-3 ${
                                isRtl ? 'end-0' : 'start-0'
                            } w-72 sm:w-80 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-2xl transition-all duration-300 z-50`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs shrink-0">H</span>
                                    <span className="text-xs font-bold text-slate-900">{trans('assistant_name')}</span>
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setProactivePill(null)
                                    }}
                                    className="text-slate-400 hover:text-slate-600 text-xs p-1"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                                {proactivePill}
                            </p>
                            <div className="mt-2.5 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(true)
                                        setProactivePill(null)
                                    }}
                                    className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#CC0000] text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                                >
                                    {trans('assistant_proactive_cta')}
                                </button>
                            </div>
                        </div>
                    )}

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
                    </div>

                    <button
                        ref={fabButtonRef}
                        type="button"
                        onClick={() => setIsOpen(true)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white flex items-center justify-center transition-all duration-300 outline-none focus:ring-4 focus:ring-[#CC0000]/30 ${
                            hasUnread
                                ? 'concierge-pulse bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]'
                                : 'bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.20)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.30)]'
                        }`}
                        aria-label={trans('assistant_name')}
                        aria-expanded={isOpen}
                        aria-controls="hossam-concierge-dialog"
                        title={trans('assistant_name')}
                    >
                        {/* Status Glowing Dot (emerald) */}
                        <span className="absolute top-1.5 end-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#1A1A1A] shadow-sm"></span>
                        </span>

                        {/* Monogram — "H" with a crimson dot */}
                        <div className="concierge-fab-icon relative flex items-center justify-center">
                            <span className="font-black text-xl sm:text-2xl tracking-tight text-white leading-none select-none">
                                H<span className="inline-block w-1.5 h-1.5 rounded-full bg-[#CC0000] align-top ms-0.5"></span>
                            </span>
                        </div>
                    </button>
                </div>
            )}

            {/* =================== CONCIERGE WINDOW =================== */}
            {isOpen && (
                <div
                    id="hossam-concierge-dialog"
                    className={`concierge-open flex flex-col bg-white overflow-hidden border border-slate-200/80 ${
                        isFullscreen
                            ? 'fixed inset-0 w-screen h-[100dvh] rounded-none sm:inset-4 sm:w-[calc(100vw-32px)] sm:h-[calc(100dvh-32px)] sm:max-w-[460px] sm:ml-auto sm:rounded-[28px]'
                            : `w-[calc(100vw-32px)] sm:w-[440px] h-[640px] ${hasFixedBottomBar ? 'max-h-[calc(100dvh-106px)]' : 'max-h-[84vh]'} sm:max-h-[84vh] rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.30)]`
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={trans('assistant_name')}
                >
                    <ChatHeader
                        trans={trans}
                        isRtl={isRtl}
                        isFullscreen={isFullscreen}
                        setIsFullscreen={setIsFullscreen}
                        resetChat={resetChat}
                        onClose={() => {
                            setIsOpen(false)
                            setIsFullscreen(false)
                        }}
                    />

                    <MessageList
                        messages={messages}
                        streamedMessageId={streamedMessageId}
                        feedback={feedback}
                        setReaction={setReaction}
                        handleSendMessage={handleSendMessage}
                        isRtl={isRtl}
                        isLoading={isLoading}
                        typingStage={typingStage}
                        trans={trans}
                        onUnitClick={handleUnitLinkClick}
                        messagesEndRef={messagesEndRef}
                    />

                    <QuickQuestionsChips
                        show={showQuickQuestions}
                        isRtl={isRtl}
                        quickQuestions={quickQuestions}
                        onSelectQuestion={handleSendMessage}
                    />

                    <ChatComposer
                        inputRef={inputRef}
                        isLoading={isLoading}
                        isRtl={isRtl}
                        trans={trans}
                        conciergePin={conciergePin}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            )}
        </div>
    )
}
