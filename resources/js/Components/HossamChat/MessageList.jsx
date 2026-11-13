import React from 'react'
import MessageBubble from './MessageBubble'

export default function MessageList({
    messages,
    streamedMessageId,
    feedback,
    setReaction,
    handleSendMessage,
    isRtl,
    isLoading,
    typingStage,
    trans,
    onUnitClick,
    messagesEndRef,
}) {
    return (
        <div
            className="flex-1 px-3 sm:px-4 py-4 overflow-y-auto bg-slate-50 custom-scrollbar scroll-smooth"
            aria-live="polite"
        >
            <div className="space-y-4 max-w-full">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        msg={msg}
                        isStreaming={msg.id === streamedMessageId}
                        reaction={feedback[msg.id] || null}
                        setReaction={setReaction}
                        handleSendMessage={handleSendMessage}
                        isRtl={isRtl}
                        isLoading={isLoading}
                        onUnitClick={onUnitClick}
                    />
                ))}

                {/* Clean, snappy typing indicator */}
                {isLoading && (
                    <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                        <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0">
                            <img
                                src="/images/ai-agent-head.webp"
                                alt=""
                                aria-hidden="true"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tr-xs text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="text-[11px] font-medium text-slate-500 ms-1.5">
                                {typingStage === 0 && (trans('assistant_typing') || (isRtl ? 'حسام يكتب الآن...' : 'Hossam is typing...'))}
                                {typingStage === 1 && (isRtl ? 'جاري فحص العقارات المتاحة...' : 'Searching properties...')}
                                {typingStage === 2 && (isRtl ? 'جاري تجهيز أفضل ترشيحات...' : 'Preparing recommendations...')}
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}
