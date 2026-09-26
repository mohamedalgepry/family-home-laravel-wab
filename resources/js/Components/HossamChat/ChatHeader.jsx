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
        <header className="bg-white border-b concierge-rule shrink-0 concierge-safe-top">
            <div className="px-4 sm:px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Advisor avatar — clean monogram */}
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
                    <button
                        type="button"
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
                        type="button"
                        onClick={onClose}
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
        </header>
    )
}
