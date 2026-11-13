import React, { useState } from 'react'

export default function ChatComposer({
    inputRef,
    isLoading,
    isRtl,
    trans,
    onSendMessage,
}) {
    const [inputMessage, setInputMessage] = useState('')

    const handleSubmit = (e) => {
        if (e) e.preventDefault()
        const text = inputMessage.trim()
        if (!text || isLoading) return
        onSendMessage(text)
        setInputMessage('')
        if (inputRef?.current) {
            inputRef.current.style.height = 'auto'
        }
    }

    const handleTextareaChange = (e) => {
        setInputMessage(e.target.value)
        const target = e.target
        target.style.height = 'auto'
        target.style.height = `${Math.min(target.scrollHeight, 112)}px`
    }

    const canSend = Boolean(inputMessage.trim()) && !isLoading

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 shrink-0 concierge-safe-bottom"
        >
            <div className="flex items-end gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100 transition-colors">
                <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={handleTextareaChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                    placeholder={trans('assistant_placeholder') || (isRtl ? 'اكتب استفسارك هنا...' : 'Type your question here...')}
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none resize-none text-[13.5px] text-slate-900 placeholder:text-slate-400 leading-relaxed max-h-28 disabled:opacity-50 py-1 px-0 shadow-none"
                    style={{ minHeight: '26px' }}
                />
                <button
                    type="submit"
                    disabled={!canSend}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 mb-0.5 ${
                        canSend
                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                    aria-label={isRtl ? 'إرسال' : 'Send'}
                >
                    <svg
                        className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>

            {/* Helper microcopy */}
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
                <span className="hidden sm:inline">
                    {isRtl ? 'Enter للإرسال · Shift+Enter لسطر جديد' : 'Enter to send · Shift+Enter for new line'}
                </span>
                <span className="ms-auto text-[10px] text-slate-400 font-medium">
                    {isRtl ? 'فاميلي هوم · ذكاء اصطناعي' : 'Family Home AI'}
                </span>
            </div>
        </form>
    )
}
