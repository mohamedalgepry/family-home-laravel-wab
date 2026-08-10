import { createInertiaApp, router } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { Component } from 'react'
import { loadLocale } from './Utils/trans'
import { CompareProvider } from './Contexts/CompareContext'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, retryCount: 0 }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error('Unhandled React Error:', error, info)
    }

    handleRetry = () => {
        if (this.state.retryCount >= 1) {
            if (typeof window !== 'undefined') {
                window.location.reload()
            }
            return
        }
        this.setState((prev) => ({ hasError: false, retryCount: prev.retryCount + 1 }))
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-surface p-6 text-center">
                    <div>
                        <p className="text-secondary-800 font-medium mb-2">حدث خطأ غير متوقع</p>
                        <p className="text-sm text-secondary-500 mb-4">Something went wrong.</p>
                        <button
                            onClick={this.handleRetry}
                            className="px-4 py-2 rounded bg-secondary-800 text-white"
                        >
                            إعادة المحاولة / Retry
                        </button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

if (typeof window !== 'undefined') {
    console.log(
        '%cتنسيق الأمان | Security Notice',
        'color: #CC0000; font-size: 24px; font-weight: bold;'
    );
    console.log(
        '%cهذه الشاشة مخصصة للمطورين. لا تقم بنسخ أو تنفيذ أي أكواد هنا للحفاظ على أمان حسابك وموقعك.',
        'font-size: 14px; color: #333;'
    );

    router.on('invalid', (event) => {
        const response = event.detail.response;
        const inertiaLocation = response?.headers?.['x-inertia-location'];

        if (inertiaLocation) {
            event.preventDefault();
            window.location.href = inertiaLocation;
            return;
        }

        // Cached HTML returned instead of Inertia JSON — reload the intended page cleanly
        const visitUrl = event.detail?.visit?.url?.href || response?.request?.responseURL;
        if (visitUrl) {
            event.preventDefault();
            window.location.assign(visitUrl);
            return;
        }

        event.preventDefault();
        window.location.reload();
    });

    // Auto-refresh page state if tab is restored from mobile browser BFCache / background sleep
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            router.reload({ preserveScroll: true });
        }
    });

    // تأثير تلوين النص عند اللمس على الموبايل (a:active لا يعمل بموثوقية على متصفحات Android/iOS)
    document.addEventListener('touchstart', (e) => {
        const el = e.target.closest('a, button, [role="button"]');
        if (!el) return;
        el.classList.add('touch-active');
        const cleanup = () => {
            el.classList.remove('touch-active');
            document.removeEventListener('touchend', cleanup);
            document.removeEventListener('touchcancel', cleanup);
        };
        document.addEventListener('touchend', cleanup, { once: true });
        document.addEventListener('touchcancel', cleanup, { once: true });
    }, { passive: true });
}

async function boot() {
    const appEl = document.getElementById('app')
    let initialLocale = 'en'
    const pageScript = document.querySelector('script[data-page="app"]')
    
    if (pageScript) {
        try {
            initialLocale = JSON.parse(pageScript.textContent).props?.locale || 'en'
        } catch {
            initialLocale = 'en'
        }
    } else if (appEl?.dataset.page) {
        // Fallback for older Inertia versions
        try {
            initialLocale = JSON.parse(appEl.dataset.page).props?.locale || 'en'
        } catch {
            initialLocale = 'en'
        }
    }
    
    await loadLocale(initialLocale)

    createInertiaApp({
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.jsx')
            return pages[`./Pages/${name}.jsx`]()
        },
        setup({ el, App, props }) {
            createRoot(el).render(
                <ErrorBoundary>
                    <CompareProvider>
                        <App {...props} />
                    </CompareProvider>
                </ErrorBoundary>
            )
        },
        progress: {
            color: '#CC0000',
        },
    })
}

boot()
