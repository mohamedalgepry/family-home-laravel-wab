export function Button({ children, type = 'submit', variant = 'primary', disabled = false, className = '', onClick }) {
    const base = 'w-full inline-flex justify-center items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
        primary: 'bg-primary-900 text-white hover:bg-primary-950 hover:shadow-md focus:ring-primary-900',
        secondary: 'bg-surface text-secondary-950 hover:bg-secondary-200 hover:shadow-sm focus:ring-secondary-300',
        ghost: 'bg-transparent text-secondary-700 hover:bg-surface hover:text-secondary-950 focus:ring-secondary-200',
    }

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}
