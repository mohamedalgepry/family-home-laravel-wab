import { usePage } from '@inertiajs/react'

export function InputField({ id, name, label, type = 'text', value, onChange, placeholder, required = false, autoComplete, dir }) {
    const { errors } = usePage().props
    const error = errors[name]
    const inputDir = dir || (type === 'email' || type === 'password' ? 'ltr' : undefined)
    const inputId = id || name

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-secondary-950 mb-1">
                    {label}
                    {required && <span className="text-primary-900 me-1">*</span>}
                </label>
            )}
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                dir={inputDir}
                className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-900/10 focus:border-primary-900 shadow-sm ${
                    error ? 'border-error bg-error/5 text-error' : 'border-border bg-white hover:border-secondary-300 hover:bg-surface-hover/50 text-secondary-950'
                }`}
            />
            {error && (
                <p className="mt-1 text-xs text-error rtl:text-right">{error}</p>
            )}
        </div>
    )
}
