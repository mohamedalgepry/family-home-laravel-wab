import { createInertiaApp } from '@inertiajs/react'
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
