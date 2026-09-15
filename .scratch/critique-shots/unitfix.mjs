import { chromium } from '@playwright/test'
const BASE = 'http://127.0.0.1:8000'
const OUT = new URL('./A/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const browser = await chromium.launch({ channel: 'chromium' })
for (const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'ar-EG' })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/ar/units`, { waitUntil: 'networkidle', timeout: 45000 })
  const href = await page.evaluate(() => {
    const hs = Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'))
    return hs.find(h => h && /^\/ar\/units\/(?!deals$)[^\/?]+$/.test(h.split('?')[0]))
  })
  console.log('unit href:', href)
  if (href) {
    await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(1500)
    const len = await page.evaluate(() => document.body.innerText.trim().length)
    await page.screenshot({ path: `${OUT}unit-detail-${vp.name}.png`, fullPage: true })
    console.log(`OK unit-detail-${vp.name} textLen=${len} ${href}`)
  }
  await ctx.close()
}
await browser.close()
