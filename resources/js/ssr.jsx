import { createInertiaApp } from '@inertiajs/react'
import { renderToString } from 'react-dom/server'
import createServer from '@inertiajs/react/server'

createServer(page =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
            return pages[`./Pages/${name}.jsx`]
        },
        setup: ({ App, props }) => <App {...props} />,
    })
)
