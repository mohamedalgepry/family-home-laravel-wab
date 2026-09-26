import React from 'react'

export function QuickQuestionsChips({
    show,
    isRtl,
    quickQuestions,
    onSelectQuestion,
}) {
    if (!show || !quickQuestions || quickQuestions.length === 0) return null

    return (
        <div className="px-4 sm:px-5 py-3 bg-white border-t concierge-rule shrink-0">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    {isRtl ? 'اقتراحات سريعة' : 'Quick start'}
                </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, qIdx) => (
                    <button
                        key={qIdx}
                        type="button"
                        onClick={() => onSelectQuestion(q)}
                        className="text-[11.5px] font-semibold text-slate-700 bg-slate-50 hover:bg-[#FFF5F5] hover:text-[#8B0000] border border-slate-200 hover:border-[#FFE3E3] px-2.5 py-1.5 rounded-full transition-all text-start leading-snug"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    )
}

export function MessageQuickReplies({
    replies,
    onSelectReply,
}) {
    if (!replies || replies.length === 0) return null

    return (
        <div className="flex flex-wrap gap-1.5 mt-3 ms-1 w-full max-w-[96%]">
            {replies.map((replyText, idx) => (
                <button
                    key={`qr-${idx}`}
                    type="button"
                    onClick={() => onSelectReply(replyText)}
                    className="px-3 py-1.5 text-[11.5px] font-medium text-slate-700 bg-white border border-slate-200/80 rounded-full hover:border-[#CC0000] hover:text-[#CC0000] hover:bg-red-50/30 transition-all shadow-sm text-start"
                >
                    {replyText}
                </button>
            ))}
        </div>
    )
}
