import { test, expect } from '@playwright/test';

const publicRoutes = [
  '/ar',
  '/en',
  '/ar/units',
  '/en/units',
  '/ar/projects',
  '/en/projects',
  '/ar/articles',
  '/en/articles',
  '/ar/compare',
  '/en/compare',
  '/ar/about',
  '/en/about',
  '/ar/contact',
  '/en/contact',
];

async function assertPublicPage(page, path) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response, `No response for ${path}`).not.toBeNull();
  expect(response.status(), `Unexpected HTTP status for ${path}`).toBeLessThan(400);
  await expect(page.locator('#main-content')).toBeVisible();
  expect(errors, `Browser errors on ${path}`).toEqual([]);
}

test.describe('Family Home public smoke', () => {
  test('all primary public routes render without browser errors', async ({ page }) => {
    for (const path of publicRoutes) await assertPublicPage(page, path);
  });

  test('root redirects to the Arabic locale', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    await expect(page).toHaveURL(/\/ar\/?$/);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('Arabic page is RTL and English page is LTR', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('div[dir="rtl"]').first()).toBeVisible();

    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('div[dir="ltr"]').first()).toBeVisible();
  });

  test('unit search accepts natural Arabic intent without server error', async ({ page }) => {
    const response = await page.goto('/ar/units?search=%D8%B4%D9%82%D9%82%20%D8%A8%D8%A7%D9%84%D8%B9%D8%A7%D8%B5%D9%85%D8%A9', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('units deals route renders', async ({ page }) => {
    const response = await page.goto('/ar/units/deals', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('invalid public route returns a handled 404', async ({ page }) => {
    const response = await page.goto('/ar/units/this-unit-does-not-exist', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBe(404);
  });

  test('comparison page handles an invalid id without server error', async ({ page }) => {
    const response = await page.goto('/ar/compare?type=unit&ids=999999999', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(500);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('health endpoint reports database availability', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: 'ok', database: 'connected' });
  });

  test('SEO endpoints are reachable', async ({ request }) => {
    for (const path of ['/robots.txt', '/sitemap.xml', '/sitemap-static.xml', '/sitemap-units.xml', '/sitemap-projects.xml', '/sitemap-areas.xml', '/sitemap-articles.xml']) {
      const response = await request.get(path);
      expect(response.status(), `Unexpected status for ${path}`).toBe(200);
    }
  });
});
