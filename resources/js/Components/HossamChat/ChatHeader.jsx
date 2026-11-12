import React from 'react'

export default function ChatHeader({
    trans,
    isRtl,
    isFullscreen,
    setIsFullscreen,
    resetChat,
    onClose,
}) {
    return (
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-100 shrink-0 concierge-safe-top transition-colors">
            <div className="px-4 py-3 flex items-center justify-between gap-3">
                {/* Agent Identity */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden p-1 ring-2 ring-slate-100 shadow-xs">
                            <img
                                src="/images/ai-agent-head.webp"
                                alt={trans('assistant_name')}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span
                            className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                            title={isRtl ? 'متصل الآن' : 'Online'}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-[14px] leading-tight text-slate-900 tracking-tight">
                                {trans('assistant_name')}
                            </h3>
                            <span className="inline-flex items-center text-[10px] font-semibold text-primary-900 bg-primary-50 px-1.5 py-0.5 rounded-full border border-primary-100/80">
                                {isRtl ? 'مستشار ذكي' : 'AI Agent'}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5 truncate">
                            {isRtl ? 'جاهز لمساعدتك في أي استفسار عقاري' : 'Ready to help with your real estate inquiries'}
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    {/* Clear Chat */}
                    <button
                        type="button"
                        onClick={resetChat}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                        title={trans('assistant_clear')}
                        aria-label={trans('assistant_clear')}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>

                    {/* Minimize / Fullscreen */}
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(prev => !prev)}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                        title={isFullscreen ? (isRtl ? 'تصغير' : 'Minimize') : (isRtl ? 'ملء الشاشة' : 'Fullscreen')}
                        aria-label={isFullscreen ? (isRtl ? 'تصغير' : 'Minimize') : (isRtl ? 'ملء الشاشة' : 'Fullscreen')}
                    >
                        {isFullscreen ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                        )}
                    </button>

                    {/* Close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                        title={trans('assistant_close')}
                        aria-label={trans('assistant_close')}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}
