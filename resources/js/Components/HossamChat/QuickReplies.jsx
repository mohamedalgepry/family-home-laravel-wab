import React from 'react'

export function QuickQuestionsChips({
    show,
    isRtl,
    quickQuestions,
    onSelectQuestion,
}) {
    if (!show || !quickQuestions || quickQuestions.length === 0) return null

    return (
        <div className="px-3 sm:px-4 py-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-1.5 mb-2 text-slate-500">
                <span className="text-[11px] font-medium">
                    {isRtl ? 'أسئلة سريعة' : 'Quick questions'}
                </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, qIdx) => (
                    <button
                        key={qIdx}
                        type="button"
                        onClick={() => onSelectQuestion(q)}
                        className="text-[11.5px] font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors text-start leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
                    className="px-3 py-1.5 text-[11.5px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                    {replyText}
                </button>
            ))}
        </div>
    )
}
