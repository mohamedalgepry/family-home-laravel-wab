import React from 'react'

export function QuickQuestionsChips({
    show,
    isRtl,
    quickQuestions,
    onSelectQuestion,
}) {
    if (!show || !quickQuestions || quickQuestions.length === 0) return null

    return (
        <div className="px-3 sm:px-4 py-2.5 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isRtl ? 'أسئلة سريعة' : 'Quick questions'}
                </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, qIdx) => (
                    <button
                        key={qIdx}
                        type="button"
                        onClick={() => onSelectQuestion(q)}
                        className="text-[11.5px] font-medium text-slate-700 bg-slate-50 hover:bg-primary-50 hover:text-primary-950 hover:border-primary-200 border border-slate-200/80 px-2.5 py-1 rounded-full transition-all text-start leading-snug shadow-2xs hover:shadow-xs active:scale-98"
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
        <div className="flex flex-wrap gap-1.5 mt-2.5 w-full">
            {replies.map((replyText, idx) => (
                <button
                    key={`qr-${idx}`}
                    type="button"
                    onClick={() => onSelectReply(replyText)}
                    className="px-2.5 py-1 text-[11.5px] font-medium text-slate-700 bg-white border border-slate-200/80 rounded-full hover:border-primary-300 hover:text-primary-900 hover:bg-primary-50/50 transition-all shadow-2xs text-start active:scale-98"
                >
                    {replyText}
                </button>
            ))}
        </div>
    )
}
