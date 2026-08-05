import { createInertiaApp, router } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

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
        event.preventDefault();
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

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx')
        return pages[`./Pages/${name}.jsx`]()
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
    progress: {
        color: '#CC0000',
    },
})
