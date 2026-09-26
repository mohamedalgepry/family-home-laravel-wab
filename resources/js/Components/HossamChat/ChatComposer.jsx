import React, { useState } from 'react'

export default function ChatComposer({
    inputRef,
    isLoading,
    isRtl,
    trans,
    conciergePin,
    onSendMessage,
}) {
    const [inputMessage, setInputMessage] = useState('')

    const handleSubmit = (e) => {
        if (e) e.preventDefault()
        const text = inputMessage.trim()
        if (!text || isLoading) return
        onSendMessage(text)
        setInputMessage('')
    }

    return (
        <form
            onSubmit={handleSubmit}
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
                            handleSubmit()
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
            </div>
        </form>
    )
}
