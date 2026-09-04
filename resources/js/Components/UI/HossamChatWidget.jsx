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

function CalculatorIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="2" width="16" height="20" rx="3" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <circle cx="8.5" cy="10.5" r="0.85" fill="currentColor" />
            <circle cx="12" cy="10.5" r="0.85" fill="currentColor" />
            <circle cx="15.5" cy="10.5" r="0.85" fill="currentColor" />
            <circle cx="8.5" cy="14" r="0.85" fill="currentColor" />
            <circle cx="12" cy="14" r="0.85" fill="currentColor" />
            <circle cx="15.5" cy="14" r="0.85" fill="currentColor" />
            <circle cx="8.5" cy="17.5" r="0.85" fill="currentColor" />
            <circle cx="12" cy="17.5" r="0.85" fill="currentColor" />
            <circle cx="15.5" cy="17.5" r="0.85" fill="currentColor" />
        </svg>
    )
}

function InstallmentCalculatorCard({ isRtl, trans, onApplyBudget, onClose }) {
    const [price, setPrice] = useState(4000000)
    const [downPercent, setDownPercent] = useState(10)
    const [years, setYears] = useState(7)

    const downPayment = useMemo(() => price * (downPercent / 100), [price, downPercent])
    const remaining = useMemo(() => Math.max(0, price - downPayment), [price, downPayment])
    const monthly = useMemo(() => (years > 0 ? remaining / (years * 12) : 0), [remaining, years])
    const quarterly = useMemo(() => (years > 0 ? remaining / (years * 4) : 0), [remaining, years])

    const quickPrices = [2500000, 4000000, 6000000, 10000000, 15000000, 20000000]

    // Calculate percentage fill for the custom range track
    const minPrice = 1000000
    const maxPrice = 25000000
    const sliderPercent = Math.min(100, Math.max(0, ((price - minPrice) / (maxPrice - minPrice)) * 100))

    const trackGradient = isRtl
        ? `linear-gradient(to left, #CC0000 0%, #CC0000 ${sliderPercent}%, #E2E8F0 ${sliderPercent}%, #E2E8F0 100%)`
        : `linear-gradient(to right, #CC0000 0%, #CC0000 ${sliderPercent}%, #E2E8F0 ${sliderPercent}%, #E2E8F0 100%)`

    return (
        <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-4.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] border border-slate-200/90 w-full transition-all">
            {/* Header: Title + Advisor Badge + Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] border border-[#FFE3E3] text-[#CC0000] flex items-center justify-center shrink-0 shadow-2xs">
                        <CalculatorIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-[13px] font-black text-slate-900 leading-tight tracking-tight">
                                {trans('assistant_calculator_title')}
                            </h4>
                            <span className="text-[9px] font-bold text-[#8B0000] bg-[#FFF5F5] border border-[#FFE3E3] px-1.5 py-0.5 rounded">
                                {isRtl ? 'حساب فوري' : 'Live Calc'}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                            {isRtl ? 'محاكاة خطط السداد ومطابقة الميزانية' : 'Simulate plans & match your budget'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 ms-1"
                        aria-label={trans('assistant_close')}
                        title={trans('assistant_close')}
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Price section */}
            <div className="mb-3.5">
                <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                        {trans('assistant_property_price')}
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-lg sm:text-xl font-black text-slate-950 tabular-nums tracking-tight">
                            {Number(price).toLocaleString()}
                        </span>
                        <span className="text-[10.5px] font-bold text-[#CC0000] bg-[#FFF5F5] border border-[#FFE3E3] px-1.5 py-0.5 rounded">
                            {isRtl ? 'ج.م' : 'EGP'}
                        </span>
                    </div>
                </div>

                {/* Range Slider */}
                <div className="py-1">
                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step="250000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#CC0000] focus:outline-none transition-all"
                        style={{ background: trackGradient }}
                        aria-label={trans('assistant_property_price')}
                    />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {quickPrices.map((qp) => {
                        const isSelected = price === qp
                        const label = qp >= 1000000 ? `${qp / 1000000}M` : `${qp / 1000}K`
                        return (
                            <button
                                key={qp}
                                type="button"
                                onClick={() => setPrice(qp)}
                                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all font-mono ${
                                    isSelected
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white font-bold shadow-xs'
                                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300'
                                }`}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Down payment & years row */}
            <div className="grid grid-cols-2 gap-2.5 mb-3 pt-3 border-t border-slate-100">
                {/* Down Payment % */}
                <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-200/60">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 font-medium">{trans('assistant_down_payment')}</span>
                        <span className="font-black text-[#CC0000] font-mono text-xs tabular-nums">{downPercent}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        {[10, 15, 20, 25].map((pct) => (
                            <button
                                key={pct}
                                type="button"
                                onClick={() => setDownPercent(pct)}
                                className={`text-[10px] py-1 rounded-md border font-semibold transition-all ${
                                    downPercent === pct
                                        ? 'bg-[#CC0000] border-[#CC0000] text-white font-bold shadow-xs'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {pct}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-200/60">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 font-medium">{trans('assistant_installment_duration')}</span>
                        <span className="font-black text-slate-900 font-mono text-xs tabular-nums">{years} {trans('years')}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        {[5, 7, 8, 10].map((yr) => (
                            <button
                                key={yr}
                                type="button"
                                onClick={() => setYears(yr)}
                                className={`text-[10px] py-1 rounded-md border font-semibold transition-all ${
                                    years === yr
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white font-bold shadow-xs'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {yr}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial Summary (3 Cards) */}
            <div className="grid grid-cols-3 gap-1.5 mb-3.5">
                {/* Down payment amount */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                    <p className="text-[9.5px] font-medium text-slate-500 truncate">{trans('assistant_down_payment')}</p>
                    <p className="text-xs sm:text-[13px] font-black text-slate-900 font-mono truncate mt-0.5 tabular-nums">
                        {Math.round(downPayment).toLocaleString()}
                    </p>
                    <p className="text-[8.5px] text-slate-400 mt-0.5">{downPercent}% {isRtl ? 'مقدم' : 'down'}</p>
                </div>

                {/* Monthly installment — Hero Card */}
                <div className="p-2 rounded-xl bg-[#FFF5F5] border border-[#FFE3E3] text-center relative overflow-hidden shadow-2xs">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-[#CC0000]" />
                    <p className="text-[9.5px] font-bold text-[#8B0000] truncate">{trans('assistant_monthly_installment')}</p>
                    <p className="text-xs sm:text-[14px] font-black text-[#CC0000] font-mono truncate mt-0.5 tabular-nums">
                        {Math.round(monthly).toLocaleString()}
                    </p>
                    <p className="text-[8.5px] font-bold text-[#8B0000]/70 mt-0.5">{isRtl ? 'شهرياً' : 'Monthly'}</p>
                </div>

                {/* Quarterly installment */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                    <p className="text-[9.5px] font-medium text-slate-500 truncate">{trans('assistant_quarterly_installment')}</p>
                    <p className="text-xs sm:text-[13px] font-black text-slate-900 font-mono truncate mt-0.5 tabular-nums">
                        {Math.round(quarterly).toLocaleString()}
                    </p>
                    <p className="text-[8.5px] text-slate-400 mt-0.5">{isRtl ? 'كل ٣ أشهر' : 'Quarterly'}</p>
                </div>
            </div>

            {/* Action CTA Button */}
            <button
                type="button"
                onClick={() => {
                    const prompt = isRtl
                        ? `عايز شقق بمقدم حوالي ${Math.round(downPayment).toLocaleString()} وقسط شهري في حدود ${Math.round(monthly).toLocaleString()} على ${years} سنوات`
                        : `Looking for units with down payment around ${Math.round(downPayment).toLocaleString()} and monthly installments of ${Math.round(monthly).toLocaleString()} over ${years} years`
                    onApplyBudget(prompt)
                }}
                className="w-full h-11 min-h-[44px] bg-[#CC0000] hover:bg-[#B00000] active:scale-[0.98] text-white text-xs sm:text-[13px] font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-[#CC0000]/30"
            >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{trans('assistant_search_matching_units')}</span>
            </button>
        </div>
    )
}

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
    
    // Voice state
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [audioEnabled, setAudioEnabled] = useState(false)
    const [showCalculator, setShowCalculator] = useState(false)
    const [proactivePill, setProactivePill] = useState(null)
    const streamIntervalRef = useRef(null)

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

    /* ---------- context-aware proactivity ---------- */
    useEffect(() => {
        if (isOpen || typeof window === 'undefined') return

        const currentPath = window.location.pathname
        let inviteText = null

        if (pageProps.project?.name) {
            inviteText = isRtl
                ? `بتتصفح مشروع ${pageProps.project.name}؟ تحب تشوف أنظمة السداد والأسعار المتاحة؟`
                : `Exploring ${pageProps.project.name}? Want to see payment plans and prices?`
        } else if (pageProps.unit?.name) {
            inviteText = isRtl
                ? `مهتم بالوحدة دي؟ ممكن أساعدك تحسب القسط الشهري أو أرتبلك معاينة.`
                : `Interested in this unit? I can calculate monthly installments or book a visit.`
        } else if (currentPath.includes('/units/deals')) {
            inviteText = isRtl
                ? `بتدور على صفقات استثمارية ولقطات؟ عندنا خيارات حصرية بخصم كاش وتقسيط!`
                : `Looking for top investment deals? Check out our exclusive properties!`
        }

        if (inviteText) {
            const timer = setTimeout(() => {
                setProactivePill(inviteText)
            }, 7500)
            return () => clearTimeout(timer)
        }
    }, [isOpen, pageProps, isRtl])

    /* ---------- speech synthesis (TTS) ---------- */
    const speakMessage = useCallback((text) => {
        if (!audioEnabled || typeof window === 'undefined' || !window.speechSynthesis) return

        window.speechSynthesis.cancel() // Stop previous speech
        const speech = new SpeechSynthesisUtterance(text)
        speech.lang = locale === 'ar' ? 'ar-EG' : 'en-US'
        speech.rate = 1.05
        speech.pitch = 1
        
        speech.onstart = () => setIsSpeaking(true)
        speech.onend = () => setIsSpeaking(false)
        speech.onerror = () => setIsSpeaking(false)
        
        window.speechSynthesis.speak(speech)
    }, [audioEnabled, locale])

    // Toggle audio
    const toggleAudio = useCallback(() => {
        setAudioEnabled(prev => {
            const next = !prev
            if (!next && window.speechSynthesis) {
                window.speechSynthesis.cancel()
                setIsSpeaking(false)
            }
            return next
        })
    }, [])

    /* ---------- speech recognition (STT) ---------- */
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null
    const recognitionRef = useRef(null)

    useEffect(() => {
        if (!SpeechRecognition) return
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = locale === 'ar' ? 'ar-EG' : 'en-US'

        recognition.onresult = (event) => {
            let finalTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript
                }
            }
            if (finalTranscript) {
                setInputMessage(prev => (prev + ' ' + finalTranscript).trim())
            }
        }

        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)
        
        recognitionRef.current = recognition
    }, [SpeechRecognition, locale])

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return
        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            setInputMessage('')
            recognitionRef.current.start()
            setIsListening(true)
        }
    }, [isListening])

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
    const abortControllerRef = useRef(null)

    const handleSendMessage = async (textToSend = null, retryMessageId = null) => {
        const text = (textToSend || inputMessage).trim()
        if (!text || isLoading) return

        // If retrying, remove the old error message
        if (retryMessageId) {
            setMessages(prev => prev.filter(m => m.id !== retryMessageId))
        }

        const userMsg = {
            id: 'user_' + Date.now(),
            role: 'user',
            content: text,
            timestamp: formatTime(new Date(), locale),
        }

        const newMessages = retryMessageId
            ? [...messages.filter(m => m.id !== retryMessageId), userMsg]
            : [...messages, userMsg]

        // Don't add user message again if retrying (it's already there)
        if (!retryMessageId) {
            setMessages(newMessages)
        } else {
            setMessages(prev => prev.filter(m => m.id !== retryMessageId))
        }
        setInputMessage('')
        setIsLoading(true)

        // AbortController for fetch timeout
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        const timeoutId = setTimeout(() => controller.abort(), 25000) // 25s max timeout

        const maxAttempts = 2
        let lastError = null

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const historyPayload = newMessages
                    .filter(m => m.id !== 'welcome' && !String(m.id).startsWith('welcome_'))
                    .map(m => ({ role: m.role, content: m.content }))

                const csrfToken = typeof document !== 'undefined'
                    ? (document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '')
                    : ''

                const contextUrl = typeof window !== 'undefined' ? window.location.href : ''
                const contextTitle = typeof document !== 'undefined' ? document.title : ''

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
                        context_url: contextUrl,
                        context_title: contextTitle,
                    }),
                    signal: controller.signal,
                })

                if (!response.ok) {
                    // On 429 (rate limit) or 5xx, retry
                    if (attempt < maxAttempts && (response.status === 429 || response.status >= 500)) {
                        await new Promise(r => setTimeout(r, 1000))
                        continue
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                if (data && data.success) {
                    const newBotId = 'bot_' + Date.now()
                    const fullReply = data.reply || ''
                    const words = fullReply.split(' ')

                    if (data.show_calculator) {
                        setShowCalculator(true)
                    }

                    if (words.length <= 4) {
                        setMessages(prev => [
                            ...prev,
                            {
                                id: newBotId,
                                role: 'assistant',
                                content: fullReply,
                                recommended_units: data.recommended_units || [],
                                quick_replies: data.quick_replies || [],
                                show_calculator: data.show_calculator || false,
                                timestamp: formatTime(new Date(), locale),
                            }
                        ])
                        if (audioEnabled) {
                            speakMessage(fullReply)
                        }
                    } else {
                        // Progressive word-by-word streaming
                        setStreamedMessageId(newBotId)
                        setMessages(prev => [
                            ...prev,
                            {
                                id: newBotId,
                                role: 'assistant',
                                content: '',
                                recommended_units: data.recommended_units || [],
                                quick_replies: data.quick_replies || [],
                                show_calculator: data.show_calculator || false,
                                timestamp: formatTime(new Date(), locale),
                            }
                        ])

                        let wordIdx = 0
                        const chunkSize = words.length > 60 ? 3 : 2
                        const intervalMs = Math.max(14, Math.min(30, Math.floor(900 / (words.length / chunkSize))))

                        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
                        streamIntervalRef.current = setInterval(() => {
                            wordIdx += chunkSize
                            if (wordIdx >= words.length) {
                                clearInterval(streamIntervalRef.current)
                                streamIntervalRef.current = null
                                setMessages(prev => prev.map(m => m.id === newBotId ? { ...m, content: fullReply } : m))
                                setStreamedMessageId(null)
                                if (audioEnabled) {
                                    speakMessage(fullReply)
                                }
                            } else {
                                const partial = words.slice(0, wordIdx).join(' ')
                                setMessages(prev => prev.map(m => m.id === newBotId ? { ...m, content: partial } : m))
                            }
                        }, intervalMs)
                    }

                    clearTimeout(timeoutId)
                    abortControllerRef.current = null
                    setIsLoading(false)
                    return // Success — exit
                } else {
                    throw new Error('Empty reply payload')
                }
            } catch (error) {
                lastError = error
                if (error.name === 'AbortError') {
                    break // Don't retry on user abort / timeout
                }
                if (attempt < maxAttempts) {
                    await new Promise(r => setTimeout(r, 800))
                    continue
                }
            }
        }

        // All attempts failed
        clearTimeout(timeoutId)
        abortControllerRef.current = null

        console.error('Hossam Assistant Error:', lastError)
        const errorId = 'bot_err_' + Date.now()
        const isTimeout = lastError?.name === 'AbortError'
        setMessages(prev => [
            ...prev,
            {
                id: errorId,
                role: 'assistant',
                content: isRtl
                    ? (isTimeout
                        ? 'عذراً، الاستجابة أخذت وقت أطول من المتوقع. اضغط على زر "إعادة المحاولة" أو اكتب سؤالك مرة تانية.'
                        : 'عذراً، حدث خطأ في الاتصال. اضغط على "إعادة المحاولة" أو جرب مرة أخرى.')
                    : (isTimeout
                        ? 'Sorry, the response took longer than expected. Tap "Retry" or rephrase your question.'
                        : 'Sorry, a connection error occurred. Tap "Retry" or try again.'),
                recommended_units: [],
                timestamp: formatTime(new Date(), locale),
                isError: true,
                retryText: text,
            }
        ])
        setIsLoading(false)
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

    /* Minimize chat on mobile when a property link is clicked */
    const handleUnitLinkClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsOpen(false)
            setIsFullscreen(false)
        }
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
                        onClick={handleUnitLinkClick}
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
                                {SpeechRecognition && (
                                    <button
                                        onClick={toggleAudio}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                            audioEnabled ? 'text-[#CC0000] bg-red-50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                        title={audioEnabled ? (isRtl ? 'إيقاف الصوت' : 'Mute') : (isRtl ? 'تشغيل الصوت' : 'Unmute')}
                                        aria-label={audioEnabled ? (isRtl ? 'إيقاف الصوت' : 'Mute') : (isRtl ? 'تشغيل الصوت' : 'Unmute')}
                                    >
                                        {audioEnabled ? (
                                            <svg className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                            </svg>
                                        )}
                                    </button>
                                )}
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
                                    type="button"
                                    onClick={() => setShowCalculator(prev => !prev)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                        showCalculator
                                            ? 'bg-[#1A1A1A] text-white shadow-xs'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                    title={trans('assistant_calculator')}
                                    aria-label={trans('assistant_calculator')}
                                    aria-expanded={showCalculator}
                                >
                                    <CalculatorIcon className="w-4 h-4" />
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

                    {/* Collapsible Calculator Drawer */}
                    {showCalculator && (
                        <div className="px-3.5 py-3 bg-slate-50/95 border-b border-slate-200/80 backdrop-blur-sm transition-all duration-200">
                            <InstallmentCalculatorCard
                                isRtl={isRtl}
                                trans={trans}
                                onApplyBudget={(prompt) => {
                                    setShowCalculator(false)
                                    handleSendMessage(prompt)
                                }}
                                onClose={() => setShowCalculator(false)}
                            />
                        </div>
                    )}

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

                                        {/* Retry button — under error messages */}
                                        {msg.isError && msg.retryText && !isLoading && (
                                            <button
                                                onClick={() => handleSendMessage(msg.retryText, msg.id)}
                                                className="flex items-center gap-1.5 mt-1.5 ms-1 text-[11px] font-bold text-[#CC0000] hover:text-[#990000] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                {isRtl ? 'إعادة المحاولة' : 'Retry'}
                                            </button>
                                        )}

                                        {/* Feedback row — under assistant messages only */}
                                        {!isUser && !isStreaming && !msg.isError && (
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
                                                        <Link
                                                            href={unit.url}
                                                            onClick={handleUnitLinkClick}
                                                            className="shrink-0"
                                                        >
                                                            <img
                                                                src={unit.image_url}
                                                                alt={unit.name}
                                                                className="w-16 h-16 rounded-lg object-cover border border-slate-100 bg-slate-100 group-hover:opacity-90 transition-opacity"
                                                                loading="lazy"
                                                            />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                href={unit.url}
                                                                onClick={handleUnitLinkClick}
                                                                className="block font-bold text-slate-900 text-[12.5px] truncate group-hover:text-[#CC0000] transition-colors"
                                                            >
                                                                {unit.name}
                                                            </Link>
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
                                                                    onClick={handleUnitLinkClick}
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

                                        {/* Inline Calculator Card */}
                                        {msg.show_calculator && (
                                            <div className="w-full mt-3 max-w-[96%]">
                                                <InstallmentCalculatorCard
                                                    isRtl={isRtl}
                                                    trans={trans}
                                                    onApplyBudget={(prompt) => handleSendMessage(prompt)}
                                                />
                                            </div>
                                        )}

                                        {/* Dynamic Quick Replies */}
                                        {!isUser && !isStreaming && msg.quick_replies && msg.quick_replies.length > 0 && !isLoading && (
                                            <div className="flex flex-wrap gap-1.5 mt-3 ms-1 w-full max-w-[96%]">
                                                {msg.quick_replies.map((replyText, idx) => (
                                                    <button
                                                        key={`qr-${msg.id}-${idx}`}
                                                        onClick={() => handleSendMessage(replyText)}
                                                        className="px-3 py-1.5 text-[11.5px] font-medium text-slate-700 bg-white border border-slate-200/80 rounded-full hover:border-[#CC0000] hover:text-[#CC0000] hover:bg-red-50/30 transition-all shadow-sm text-start"
                                                    >
                                                        {replyText}
                                                    </button>
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
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                                    {isRtl ? 'اقتراحات سريعة' : 'Quick start'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowCalculator(prev => !prev)}
                                    className="text-[11.5px] font-bold text-slate-700 hover:text-[#CC0000] bg-slate-50 hover:bg-[#FFF5F5] border border-slate-200/80 hover:border-[#FFE3E3] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all shadow-2xs"
                                >
                                    <CalculatorIcon className="w-3.5 h-3.5 text-[#CC0000]" />
                                    <span>{trans('assistant_calculator')}</span>
                                </button>
                            </div>
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
                                placeholder={isListening ? (isRtl ? 'جاري الاستماع...' : 'Listening...') : trans('assistant_placeholder')}
                                disabled={isLoading || isListening}
                                rows={1}
                                className="flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none resize-none text-[13.5px] text-slate-900 placeholder:text-slate-400 leading-relaxed max-h-24 disabled:opacity-60 px-1 py-1 shadow-none"
                                style={{ minHeight: '24px', outline: 'none', boxShadow: 'none' }}
                            />
                            {SpeechRecognition && (
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    disabled={isLoading}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                                        isListening ? 'bg-red-100 text-[#CC0000] animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                                    }`}
                                    aria-label={isRtl ? 'تحدث' : 'Speak'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            )}
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
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
