import { chromium } from '@playwright/test'
import fs from 'fs'

const BASE = 'http://127.0.0.1:8000'
const OUT = new URL('./A/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

async function firstDetailLink(page, listPath, detailPrefix) {
  // collect all hrefs matching detailPrefix from the listing page
  const hrefs = await page.evaluate((prefix) => {
    return Array.from(document.querySelectorAll(`a[href*="${prefix}"]`))
      .map(a => a.getAttribute('href'))
      .filter(h => h && h.split('?')[0].split('/').length > prefix.split('/').filter(Boolean).length + 1)
  }, detailPrefix)
  return hrefs[0] || null
}

const shots = []
async function shoot(browser, vp, url, name) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'ar-EG' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push('pageerror: ' + e.message))
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)) })
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(1200)
    const status = resp ? resp.status() : 'n/a'
    // Verify real content rendered (not blank SPA shell)
    await page.waitForFunction(() => document.body && document.body.innerText.trim().length > 150, { timeout: 20000 })
    const textLen = await page.evaluate(() => document.body.innerText.trim().length)
    const file = `${OUT}${name}-${vp.name}.png`
    await page.screenshot({ path: file, fullPage: true })
    shots.push({ name: `${name}-${vp.name}`, url, status, file, textLen, errors })
    console.log(`OK ${name}-${vp.name} ${status} textLen=${textLen} ${url}`)
  } catch (e) {
    shots.push({ name: `${name}-${vp.name}`, url, status: 'FAIL', error: e.message.slice(0, 200), errors })
    console.log(`FAIL ${name}-${vp.name} ${url}: ${e.message.slice(0, 120)}`)
  }
  await ctx.close()
}

const browser = await chromium.launch({ channel: 'chromium' })
for (const vp of VIEWPORTS) {
  // discover detail slugs once per viewport (same data)
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'ar-EG' })
  const page = await ctx.newPage()
  let unitHref = null, projectHref = null, articleHref = null
  try {
    await page.goto(`${BASE}/ar/units`, { waitUntil: 'networkidle', timeout: 45000 })
    unitHref = await firstDetailLink(page, '/ar/units', '/ar/units')
  } catch (e) { console.log('unit discovery fail: ' + e.message.slice(0, 100)) }
  try {
    await page.goto(`${BASE}/ar/projects`, { waitUntil: 'networkidle', timeout: 45000 })
    projectHref = await firstDetailLink(page, '/ar/projects', '/ar/projects')
  } catch (e) { console.log('project discovery fail: ' + e.message.slice(0, 100)) }
  try {
    await page.goto(`${BASE}/ar/articles`, { waitUntil: 'networkidle', timeout: 45000 })
    articleHref = await firstDetailLink(page, '/ar/articles', '/ar/articles')
  } catch (e) { console.log('article discovery fail: ' + e.message.slice(0, 100)) }
  await ctx.close()

  const pages = [
    ['home', `${BASE}/ar`],
    ['units', `${BASE}/ar/units`],
    ['unit-detail', unitHref ? `${BASE}${unitHref}` : null],
    ['projects', `${BASE}/ar/projects`],
    ['project-detail', projectHref ? `${BASE}${projectHref}` : null],
    ['articles', `${BASE}/ar/articles`],
    ['article-detail', articleHref ? `${BASE}${articleHref}` : null],
    ['about', `${BASE}/ar/about`],
    ['contact', `${BASE}/ar/contact`],
    ['compare', `${BASE}/ar/compare`],
    ['deals', `${BASE}/ar/units/deals`],
  ]
  for (const [name, url] of pages) {
    if (!url) { console.log(`SKIP ${name}-${vp.name} (no detail link found)`); continue }
    await shoot(browser, vp, url, name)
  }
}
await browser.close()
fs.writeFileSync(`${OUT}manifest.json`, JSON.stringify(shots, null, 2))
console.log('DONE')
