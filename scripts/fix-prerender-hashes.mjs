/**
 * fix-prerender-hashes.mjs  v2
 * Updates stale asset hashes in storage/app/prerender_pages.json
 * to match the current public/build/manifest.json after a fresh build.
 *
 * Handles both classic Vite hashes (8 chars) and Rolldown hashes
 * with embedded hyphens (e.g. vendor-react-D7j-9wKp.js).
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const MANIFEST_PATH = path.join(ROOT, 'public', 'build', 'manifest.json')
const PAGES_PATH = path.join(ROOT, 'storage', 'app', 'prerender_pages.json')

if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('[fix-hashes] manifest.json not found — run vite build first.')
    process.exit(1)
}
if (!fs.existsSync(PAGES_PATH)) {
    console.log('[fix-hashes] prerender_pages.json not found — nothing to fix.')
    process.exit(0)
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
const pages    = JSON.parse(fs.readFileSync(PAGES_PATH,   'utf-8'))

// ─── Build a set of ALL current asset filenames ──────────────────────────────
const currentFiles = new Set()
for (const entry of Object.values(manifest)) {
    if (entry.file)              currentFiles.add(path.basename(entry.file))
    if (Array.isArray(entry.css)) entry.css.forEach(f => currentFiles.add(path.basename(f)))
}

// ─── Determine the "stable name" of a hashed asset filename ──────────────────
// A segment is hash-like if it contains a digit OR has mixed case.
// Real words ('react', 'runtime', 'vendor') are all-lowercase → not hash-like.
function isHashLike(seg) {
    return /\d/.test(seg) || (/[A-Z]/.test(seg) && /[a-z]/.test(seg))
}

function stableName(basename) {
    const ext   = path.extname(basename)
    const stem  = path.basename(basename, ext)
    const parts = stem.split('-')

    // Strip trailing hash-like segments from the right
    let last = parts.length - 1
    while (last >= 0 && isHashLike(parts[last])) last--

    return parts.slice(0, last + 1).join('-') + ext
}

// ─── Build stable-name → current filename map ────────────────────────────────
// If multiple current files share the same stable name, keep all of them
// (e.g. multiple Index chunks).  We'll only replace when there is exactly ONE
// match, which is always the case for vendor chunks.
const stableMap = new Map() // stable → Set<currentFilename>
for (const file of currentFiles) {
    const s = stableName(file)
    if (!stableMap.has(s)) stableMap.set(s, new Set())
    stableMap.get(s).add(file)
}

// ─── Build regex-based replacement table ─────────────────────────────────────
// For each current file, build a regex that matches ANY old hashed version
// with the same stable name and extension.
function escapeRx(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

// stable → { rx: RegExp, replacement: string } | null
const replaceTable = new Map()
for (const [stable, files] of stableMap) {
    if (files.size !== 1) continue  // ambiguous: multiple chunks with same stable name
    const [newFile] = files
    const ext = path.extname(stable)
    const stemPrefix = escapeRx(stable.slice(0, -ext.length)) // prefix without ext
    const escapedExt = escapeRx(ext)
    // Match: PREFIX followed by one or more -SEGMENT groups, then .EXT
    // where at least one segment is hash-like  →  covers both old and new format
    const rx = new RegExp(`\\b${stemPrefix}(?:-[A-Za-z0-9]+)+${escapedExt}\\b`, 'g')
    replaceTable.set(stable, { rx, newFile })
}

// ─── Apply replacements to every page template ───────────────────────────────
let totalReplaced = 0

const updatedPages = pages.map(page => {
    if (!page.htmlTemplate) return page
    let html = page.htmlTemplate

    for (const { rx, newFile } of replaceTable.values()) {
        // Skip if new file already present (nothing stale to fix)
        if (!html.includes(newFile) || rx.test(html)) {
            rx.lastIndex = 0
            const before = html
            html = html.replace(rx, newFile)
            if (html !== before) {
                totalReplaced++
                rx.lastIndex = 0
            }
        }
        rx.lastIndex = 0
    }
    return { ...page, htmlTemplate: html }
})

// ─── Verify no stale references remain ───────────────────────────────────────
let staleFound = 0
for (const page of updatedPages) {
    if (!page.htmlTemplate) continue
    const refs = Array.from(page.htmlTemplate.matchAll(/\/assets\/([a-zA-Z0-9_\-\.]+\.(?:js|css))/gi))
                      .map(m => m[1])
    for (const ref of refs) {
        if (!currentFiles.has(ref)) {
            console.warn(`[fix-hashes] Still stale after fix: ${ref} in ${page.url ?? page.output}`)
            staleFound++
        }
    }
}

fs.writeFileSync(PAGES_PATH, JSON.stringify(updatedPages, null, 2), 'utf-8')
console.log(`[fix-hashes] Done — updated ${totalReplaced} asset references across ${pages.length} page templates.`)
if (staleFound > 0) {
    console.error(`[fix-hashes] WARNING: ${staleFound} stale reference(s) could not be mapped — inspect output above.`)
    process.exit(1)
} else {
    console.log('[fix-hashes] All asset references are now current.')
}
