import { createInertiaApp } from '@inertiajs/react'
import { renderToString } from 'react-dom/server'
import http from 'node:http'
import { loadLocale } from './Utils/trans'

import { CompareProvider } from './Contexts/CompareContext'

async function renderPage(page) {
    await loadLocale(page.props?.locale)

    return createInertiaApp({
        page,
        render: renderToString,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
            return pages[`./Pages/${name}.jsx`]
        },
        setup: ({ App, props }) => (
            <CompareProvider>
                <App {...props} />
            </CompareProvider>
        ),
    })
}

const PORT = Number(process.env.PORT || 13714)

const server = http.createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/render') {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not found' }))
        return
    }

    console.log(`[SSR] Received request to /render`)
    const chunks = []
    try {
        for await (const chunk of req) chunks.push(Buffer.from(chunk))
        console.log(`[SSR] Finished reading body`)
    } catch (e) {
        console.log(`[SSR] Error reading body: ${e.message}`)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Failed to read request body' }))
        return
    }

    let page
    try {
        page = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message }))
        return
    }

    try {
        console.log(`[SSR] Rendering page: ${page?.url || 'unknown'}`)
        const result = await renderPage(page)
        console.log(`[SSR] Render complete: ${page?.url || 'unknown'}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
    } catch (e) {
        console.log(`[SSR] Render error: ${e.message}`)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message, url: page?.url, type: 'render' }))
    }
})

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Custom SSR server listening on port ${PORT}...`)
})
