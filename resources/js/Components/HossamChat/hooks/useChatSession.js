import { useState, useEffect, useMemo, useCallback } from 'react'

export const STORAGE_KEY = 'hossam_concierge_session_v1'
export const PIN_PREFIX = { ar: 'CAIRO', en: 'GIZA' }

export const buildConciergePin = (locale) => {
    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${PIN_PREFIX[locale] || PIN_PREFIX.ar} · ${dd}${mm}-EG`
}

export const formatTime = (date, locale) =>
    new Date(date).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })

export function useChatSession(locale, trans, isRtl, pageProps) {
    const welcomeTimestamp = useMemo(() => formatTime(new Date(), locale), [locale])

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

    const [hasUnread, setHasUnread] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [feedback, setFeedback] = useState({})
    const [proactivePill, setProactivePill] = useState(null)

    const [messages, setMessages] = useState(() => {
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

    // LocalStorage persistence
    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            const safeMessages = messages.slice(-12).map(m => ({
                id: m.id,
                role: m.role,
                content: typeof m.content === 'string'
                    ? m.content.replace(/\b(?:\+?20|0)?1[0125]\d{8}\b/g, '[رقم هاتف]')
                    : m.content,
                timestamp: m.timestamp,
                recommended_units: m.recommended_units || [],
                quick_replies: m.quick_replies || [],
            }))

            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ messages: safeMessages, isOpen, isFullscreen, savedAt: Date.now() })
            )
        } catch (e) {
            // Ignore full storage or disabled
        }
    }, [messages, isOpen, isFullscreen])

    // Proactive Contextual Invite
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
                ? `مهتم بالوحدة دي؟ ممكن أساعدك في معلومات السعر أو أرتبلك معاينة.`
                : `Interested in this unit? I can help with pricing info or book a visit.`
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

    const resetChat = useCallback(() => {
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
    }, [locale, trans])

    const setReaction = useCallback((messageId, reaction) => {
        setFeedback(prev => ({ ...prev, [messageId]: prev[messageId] === reaction ? null : reaction }))
    }, [])

    return {
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
    }
}
