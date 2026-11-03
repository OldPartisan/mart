import { chromium } from '@playwright/test';
import fs from 'node:fs';

const base = process.argv[2] || 'http://127.0.0.1:3100';
const tag = process.argv[3] || 'local';
const browser = await chromium.launch({ headless: true, executablePath: '/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const results = [];
const consoleErrors = [];
const pageErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)));

const paths = [
  '/', '/catalog', '/catalog/molochnaya-produktsiya', '/catalog/kombo-nabory',
  '/product/tort-medovik', '/product/moloko-irbis-3-2', '/promotions', '/promotions/svoe-znachit-svegee',
  '/delivery', '/pickup', '/loyalty', '/about', '/farmers', '/own-production', '/cafe',
  '/contacts', '/quality', '/vacancies', '/legal/privacy', '/legal/terms', '/legal/offer',
  '/login', '/register', '/forgot-password', '/reset-password', '/cart', '/checkout', '/account', '/admin',
  '/sitemap.xml', '/robots.txt', '/nonexistent-page-qa'
];

for (const path of paths) {
  const failed = [];
  const onResponse = (r) => { if (r.status() >= 400 && !r.url().includes('favicon')) failed.push(`${r.status()} ${r.url()}`); };
  page.on('response', onResponse);
  let status = 0, title = '', h1 = [], desc = '', canonical = '', imgs = 0, brokenImgs = 0, overflow = 0;
  try {
    const resp = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
    status = resp?.status() ?? 0;
    title = await page.title();
    h1 = await page.locator('h1').allTextContents();
    desc = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '') || '';
    canonical = await page.locator('link[rel="canonical"]').getAttribute('href').catch(() => '') || '';
    imgs = await page.locator('img').count();
    brokenImgs = await page.locator('img').evaluateAll((els) => els.filter((e) => e.complete && e.naturalWidth === 0).length);
    overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: `qa/screens/${tag}-${path.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`, fullPage: false });
  } catch (e) {
    failed.push('NAV ' + String(e).slice(0, 200));
  }
  page.off('response', onResponse);
  results.push({ path, status, title, h1, desc: desc.slice(0, 160), canonical, imgs, brokenImgs, overflow, failed });
}

fs.writeFileSync(`qa/results/crawl-${tag}.json`, JSON.stringify({ base, results, consoleErrors, pageErrors }, null, 2));
console.log('pages', results.length, 'consoleErrors', consoleErrors.length, 'pageErrors', pageErrors.length);
for (const r of results) console.log(`${r.status} ${r.path} h1=${r.h1.length} img=${r.imgs}/${r.brokenImgs} ov=${r.overflow} fail=${r.failed.length}`);
await browser.close();
