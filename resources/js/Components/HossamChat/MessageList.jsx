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
            className="flex-1 px-4 sm:px-5 py-4 overflow-y-auto concierge-paper custom-scrollbar"
            aria-live="polite"
        >
            <div className="space-y-4">
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

                {/* Progressive typing indicator */}
                {isLoading && (
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2.5 text-slate-600 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-bl-md max-w-[85%] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                            <div className="flex gap-1 items-center shrink-0" aria-hidden="true">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce [animation-delay:-0.32s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce [animation-delay:-0.16s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce"></span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600 tracking-wide">
                                {typingStage === 0 && (trans('assistant_typing') || (isRtl ? 'حسام يدرس طلبك...' : 'Hossam is reviewing your request...'))}
                                {typingStage === 1 && (isRtl ? 'جاري فحص وتصفية المشاريع والوحدات المتاحة...' : 'Searching available properties & units...')}
                                {typingStage === 2 && (isRtl ? 'حسام يصيغ أفضل ترشيحات ملائمة لك...' : 'Formulating the best recommendations for you...')}
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}
