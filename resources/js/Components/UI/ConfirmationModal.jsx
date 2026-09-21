import { useEffect } from 'react'

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmLabel,
    cancelLabel,
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading = false,
}) {
    useEffect(() => {
        if (!isOpen) return

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                onCancel?.()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onCancel])

    if (!isOpen) return null

    const isDanger = variant === 'danger'

    return (
        <div
            className="fixed inset-0 z-[60] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-secondary-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Modal Dialog Content */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div
                    className="relative transform overflow-hidden rounded-2xl bg-white text-start shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-secondary-100 animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                    isDanger
                                        ? 'bg-red-50 text-red-600 border border-red-100'
                                        : 'bg-primary-50 text-primary-900 border border-primary-100'
                                }`}
                            >
                                {isDanger ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                )}
                            </div>

                            {/* Text */}
                            <div className="flex-1 mt-0.5">
                                <h3 id="modal-title" className="text-base sm:text-lg font-bold text-secondary-950">
                                    {title}
                                </h3>
                                <p id="modal-description" className="mt-2 text-sm text-secondary-500 leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="bg-secondary-50/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 border-t border-secondary-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-secondary-200 bg-white text-sm font-semibold text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-300 transition-colors disabled:opacity-50"
                        >
                            {cancelLabel || 'إلغاء'}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                                isDanger
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600'
                                    : 'bg-primary-900 hover:bg-primary-950 focus:ring-primary-900'
                            }`}
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            )}
                            <span>{confirmLabel || 'تأكيد'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
