import { chromium } from '@playwright/test';
import fs from 'node:fs';

const BASE = 'http://127.0.0.1:8000';
const DETECT_URL = 'http://localhost:8400/detect.js';
const OUT_DIR = '.scratch/critique-shots/B';
fs.mkdirSync(OUT_DIR, { recursive: true });

const consoleLog = [];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on('console', (msg) => {
  const text = msg.text();
  if (/impeccable/i.test(text)) {
    consoleLog.push({ page: currentName, type: msg.type(), text: text.slice(0, 500) });
  }
});
page.on('pageerror', (err) => {
  if (/impeccable/i.test(String(err))) {
    consoleLog.push({ page: currentName, type: 'pageerror', text: String(err).slice(0, 500) });
  }
});

let currentName = 'start';

async function visit(url, name, { shot = false } = {}) {
  currentName = name;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!resp || resp.status() >= 400) {
      console.log(`SKIP ${name}: HTTP ${resp ? resp.status() : 'no-response'}`);
      return null;
    }
    await page.waitForTimeout(1500); // let Inertia hydrate
  } catch (e) {
    console.log(`SKIP ${name}: navigation error: ${String(e).split('\n')[0]}`);
    return null;
  }

  // Preflight mutable injection: mutate DOM + append detect.js script tag
  let injected = false;
  try {
    injected = await page.evaluate((src) => {
      document.title = 'impeccable-preflight';
      const s = document.createElement('script');
      s.src = src;
      document.head.appendChild(s);
      return true;
    }, DETECT_URL);
  } catch (e) {
    console.log(`INJECT-FAIL ${name}: ${String(e).split('\n')[0]}`);
    return null;
  }

  await page.waitForTimeout(2500); // let overlay scan + report
  const title = await page.title();
  const overlay = await page.evaluate(() => !!document.querySelector('[data-impeccable], #impeccable-overlay, [class*="impeccable"]')).catch(() => false);
  if (shot) {
    await page.screenshot({ path: `${OUT_DIR}/${name}.png`, fullPage: false }).catch(() => {});
  }
  console.log(`OK ${name} injected=${injected} title="${title}" overlayEl=${overlay}`);
  return { name, injected, title, overlay };
}

// Discover a unit slug and a project slug from listing pages
async function firstHref(listUrl, pattern) {
  try {
    await page.goto(BASE + listUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    const href = await page.evaluate((re) => {
      const a = [...document.querySelectorAll('a[href]')].map((x) => x.getAttribute('href')).find((h) => re.test(h || ''));
      return a || null;
    }, pattern);
    return href;
  } catch {
    return null;
  }
}

const unitHref = await firstHref('/ar/units', /\/ar\/units\/[^"'/]+$/);
const projectHref = await firstHref('/ar/projects', /\/ar\/projects\/[^"'/]+$/);
console.log(`DISCOVERY unitHref=${unitHref} projectHref=${projectHref}`);

const results = [];
results.push(await visit(`${BASE}/ar`, 'ar-home', { shot: true }));
results.push(await visit(`${BASE}/ar/units`, 'ar-units', { shot: true }));
if (unitHref) results.push(await visit(new URL(unitHref, BASE).href, 'ar-unit-show'));
results.push(await visit(`${BASE}/ar/projects`, 'ar-projects'));
if (projectHref) results.push(await visit(new URL(projectHref, BASE).href, 'ar-project-show'));
results.push(await visit(`${BASE}/ar/contact`, 'ar-contact', { shot: true }));
results.push(await visit(`${BASE}/ar/compare`, 'ar-compare'));

fs.writeFileSync(`${OUT_DIR}/console-findings.json`, JSON.stringify({ results, consoleLog }, null, 2));
console.log(`CONSOLE-MESSAGES: ${consoleLog.length}`);
for (const m of consoleLog) {
  console.log(`[${m.page}] (${m.type}) ${m.text.replace(/\s+/g, ' ').slice(0, 300)}`);
}

await browser.close();
