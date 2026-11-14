import { forwardRef } from 'react'

const ChatLauncherButton = forwardRef(function ChatLauncherButton({ title, description, onClick, expanded = false }, ref) {
    return (
        <button
            type="button"
            ref={ref}
            onClick={onClick}
            className="group relative flex min-h-16 w-56 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-slate-200 bg-white px-2.5 py-2 text-start text-slate-800 shadow-[0_6px_20px_rgba(15,23,42,0.12)] transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 print:hidden"
            aria-label={`${title}. ${description}`}
            aria-expanded={expanded}
            title={`${title}. ${description}`}
        >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 p-1">
                <img
                    src="/images/ai-agent-head.webp"
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    className="h-full w-full object-contain"
                />
                <span aria-hidden="true" className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold leading-tight">{title}</span>
                <span className="truncate text-[11px] leading-tight text-slate-500">{description}</span>
            </span>
        </button>
    )
})

export default ChatLauncherButton
