import { useState, useRef, useCallback, useEffect } from 'react'
import { formatTime } from './useChatSession'

export function useChatApi({
    messages,
    setMessages,
    locale,
    pageProps,
    isRtl,
    onSuccessResponse,
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [typingStage, setTypingStage] = useState(0)
    const [streamedMessageId, setStreamedMessageId] = useState(null)

    const abortControllerRef = useRef(null)
    const streamIntervalRef = useRef(null)
    const typingTimerRef = useRef(null)
    const typingTimerRef2 = useRef(null)

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort()
            if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
            if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current)
        }
    }, [])

    const handleSendMessage = useCallback(async (textToSend = null, retryMessageId = null) => {
        const text = (textToSend || '').trim()
        if (!text || isLoading) return

        if (retryMessageId) {
            setMessages(prev => prev.filter(m => m.id !== retryMessageId))
        }

        const userMsg = {
            id: 'user_' + Date.now(),
            role: 'user',
            content: text,
            timestamp: formatTime(new Date(), locale),
        }

        if (!retryMessageId) {
            setMessages(prev => [...prev, userMsg])
        } else {
            setMessages(prev => [...prev.filter(m => m.id !== retryMessageId), userMsg])
        }

        setIsLoading(true)
        setTypingStage(0)

        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current)
        typingTimerRef.current = setTimeout(() => setTypingStage(1), 2500)
        typingTimerRef2.current = setTimeout(() => setTypingStage(2), 6500)

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        const timeoutId = setTimeout(() => controller.abort(), 45000)

        const maxAttempts = 1
        let lastError = null

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const historyPayload = messages
                    .filter(m => m.id !== 'welcome' && !String(m.id).startsWith('welcome_') && m.role && m.content)
                    .slice(-6)
                    .map(m => ({
                        role: m.role,
                        content: String(m.content).replace(/\b(?:\+?20|0)?1[0125]\d{8}\b/g, '[رقم هاتف]').slice(0, 500)
                    }))

                const csrfToken = typeof document !== 'undefined'
                    ? (document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '')
                    : ''

                const contextUrl = typeof window !== 'undefined' ? window.location.href : ''
                const contextPathname = typeof window !== 'undefined' ? window.location.pathname : ''
                const contextTitle = typeof document !== 'undefined' ? document.title : ''

                const pageContext = {
                    url: contextUrl,
                    pathname: contextPathname,
                    title: contextTitle,
                    project_id: pageProps?.project?.id || null,
                    project_name: pageProps?.project?.name || null,
                    project_slug: pageProps?.project?.slug || null,
                    unit_id: pageProps?.unit?.id || null,
                    unit_name: pageProps?.unit?.name || null,
                    unit_slug: pageProps?.unit?.slug || null,
                    unit_price: pageProps?.unit?.price || null,
                    unit_rooms: pageProps?.unit?.rooms || null,
                    area_name: pageProps?.area?.name || pageProps?.unit?.area_name || pageProps?.project?.area_name || null,
                }

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
                        page_context: pageContext,
                    }),
                    signal: controller.signal,
                })

                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error('429_TOO_MANY_REQUESTS')
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                if (data && data.success) {
                    const newBotId = 'bot_' + Date.now()
                    const fullReply = data.reply || ''
                    const words = fullReply.split(' ')

                    if (words.length <= 4) {
                        setMessages(prev => [
                            ...prev,
                            {
                                id: newBotId,
                                role: 'assistant',
                                content: fullReply,
                                recommended_units: data.recommended_units || [],
                                quick_replies: data.quick_replies || [],
                                timestamp: formatTime(new Date(), locale),
                            }
                        ])
                    } else {
                        setStreamedMessageId(newBotId)
                        setMessages(prev => [
                            ...prev,
                            {
                                id: newBotId,
                                role: 'assistant',
                                content: '',
                                recommended_units: data.recommended_units || [],
                                quick_replies: data.quick_replies || [],
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
                            } else {
                                const partial = words.slice(0, wordIdx).join(' ')
                                setMessages(prev => prev.map(m => m.id === newBotId ? { ...m, content: partial } : m))
                            }
                        }, intervalMs)
                    }

                    clearTimeout(timeoutId)
                    abortControllerRef.current = null
                    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
                    if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current)
                    setTypingStage(0)
                    setIsLoading(false)
                    if (onSuccessResponse) onSuccessResponse(fullReply)
                    return
                } else {
                    throw new Error('Empty reply payload')
                }
            } catch (error) {
                lastError = error
                if (error.name === 'AbortError') {
                    break
                }
                if (attempt < maxAttempts) {
                    await new Promise(r => setTimeout(r, 800))
                    continue
                }
            }
        }

        clearTimeout(timeoutId)
        abortControllerRef.current = null
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current)
        setTypingStage(0)
        setIsLoading(false)

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
    }, [isLoading, messages, locale, pageProps, isRtl, setMessages, onSuccessResponse])

    return {
        isLoading,
        typingStage,
        streamedMessageId,
        handleSendMessage,
    }
}
