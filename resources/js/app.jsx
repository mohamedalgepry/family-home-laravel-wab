// URL & History safety wrapper for iframe/srcdoc/sandboxed environments
if (typeof window !== 'undefined') {
    const OriginalURL = window.URL;

    function getSafeBase() {
        const origin = window.location.origin;
        const href = window.location.href;
        if (origin && origin !== 'null' && !href.startsWith('about:')) {
            return href;
        }
        if (typeof document !== 'undefined' && document.baseURI && !document.baseURI.startsWith('about:') && !document.baseURI.includes('null')) {
            return document.baseURI;
        }
        return 'http://localhost';
    }

    function SafeURL(url, base) {
        let resolvedBase = base;
        if (!resolvedBase || resolvedBase === 'null' || (typeof resolvedBase === 'string' && resolvedBase.startsWith('about:'))) {
            resolvedBase = getSafeBase();
        }

        try {
            return new OriginalURL(url, resolvedBase);
        } catch {
            try {
                return new OriginalURL(url, 'http://localhost');
            } catch {
                return new OriginalURL('http://localhost');
            }
        }
    }

    SafeURL.prototype = OriginalURL.prototype;
    Object.setPrototypeOf(SafeURL, OriginalURL);
    window.URL = SafeURL;

    if (window.history) {
        const originalPushState = window.history.pushState.bind(window.history);
        const originalReplaceState = window.history.replaceState.bind(window.history);

        window.history.pushState = function (state, title, url) {
            try {
                return originalPushState(state, title, url);
            } catch {
                try {
                    const relativeUrl = typeof url === 'string'
                        ? (url.startsWith('http') ? (new OriginalURL(url)).pathname + (new OriginalURL(url)).search : url)
                        : url;
                    return originalPushState(state, title, relativeUrl);
                } catch {
                    // Silently ignore in sandboxed environments to prevent unhandled rejection
                }
            }
        };

        window.history.replaceState = function (state, title, url) {
            try {
                return originalReplaceState(state, title, url);
            } catch {
                try {
                    const relativeUrl = typeof url === 'string'
                        ? (url.startsWith('http') ? (new OriginalURL(url)).pathname + (new OriginalURL(url)).search : url)
                        : url;
                    return originalReplaceState(state, title, relativeUrl);
                } catch {
                    // Silently ignore in sandboxed environments
                }
            }
        };
    }
}

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

    // تأمين التنقل الداخلي (SPA Navigation) ومنع فتح نوافذ منبثقة أو تبويبات في بيئات المعاينة المدمجة
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
        if (link.target === '_blank' || link.hasAttribute('download')) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

        if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/storage') && !href.startsWith('/locale/')) {
            e.preventDefault();
            router.visit(href);
        }
    });

    router.on('navigate', (event) => {
        const nextLocale = event.detail?.page?.props?.locale;
        if (nextLocale) {
            loadLocale(nextLocale);
        }
    });
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
