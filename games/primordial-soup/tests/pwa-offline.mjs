import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const here = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(here, '..');
const repoRoot = path.resolve(gameRoot, '../..');
const screenshots = path.join(repoRoot, '.studio', 'evidence', 'screenshots');
const reports = path.join(repoRoot, '.studio', 'evidence', 'reports');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173/';
const viewport = { width: 844, height: 390 };

await fs.mkdir(screenshots, { recursive: true });
await fs.mkdir(reports, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [
    ...chromium.args,
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--mute-audio',
  ],
  headless: true,
  defaultViewport: { ...viewport, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 120000,
});

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
const checks = [];
function check(name, passed, detail = '') {
  checks.push({ name, passed: Boolean(passed), detail });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.waitForFunction(() => window.__READY__ === true, { timeout: 60000 });
  const serviceWorker = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Service worker did not take control.')), 30000);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          clearTimeout(timer);
          resolve(undefined);
        }, { once: true });
      });
    }
    const cacheNames = await caches.keys();
    const appCacheName = cacheNames.find((name) => name.startsWith('microgenesis-'));
    const appCache = appCacheName ? await caches.open(appCacheName) : null;
    const cachedRequests = appCache ? await appCache.keys() : [];
    const manifest = await appCache?.match(new URL('./manifest.webmanifest', location.href).href);
    const manifestData = manifest ? await manifest.json() : null;
    const icons = manifestData?.icons ? await Promise.all(manifestData.icons.map(async (icon) => ({
      sizes: icon.sizes,
      purpose: icon.purpose,
      cached: Boolean(await appCache?.match(new URL(icon.src, location.href).href)),
    }))) : [];
    const shell = await appCache?.match(new URL('./index.html', location.href).href);
    return {
      controlled: Boolean(navigator.serviceWorker.controller),
      active: registration.active?.state === 'activated',
      cacheName: appCacheName || null,
      cachedCount: cachedRequests.length,
      scriptCount: cachedRequests.filter((request) => /\.js(?:\?|$)/.test(request.url)).length,
      styleCount: cachedRequests.filter((request) => /\.css(?:\?|$)/.test(request.url)).length,
      manifest: manifestData ? { display: manifestData.display, orientation: manifestData.orientation, iconCount: icons.length, icons } : null,
      shellCached: Boolean(shell),
    };
  });
  check('production service worker activates and controls the game', Boolean(serviceWorker.active && serviceWorker.controlled), JSON.stringify(serviceWorker));
  check('offline cache contains the complete app shell and built code', Boolean(serviceWorker.cachedCount >= 5 && serviceWorker.scriptCount > 0 && serviceWorker.styleCount > 0 && serviceWorker.shellCached), JSON.stringify({ count: serviceWorker.cachedCount, scripts: serviceWorker.scriptCount, styles: serviceWorker.styleCount, shell: serviceWorker.shellCached }));
  check('manifest requests standalone landscape installation with cached 192px and 512px icons', Boolean(serviceWorker.manifest?.display === 'standalone' && serviceWorker.manifest.orientation === 'landscape' && serviceWorker.manifest.icons.some((icon) => icon.sizes === '192x192' && icon.cached) && serviceWorker.manifest.icons.some((icon) => icon.sizes === '512x512' && icon.cached && icon.purpose.includes('maskable'))), JSON.stringify(serviceWorker.manifest));

  await page.setOfflineMode(true);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.__READY__ === true, { timeout: 60000 });
  const offlineState = await page.evaluate(() => ({
    controlled: Boolean(navigator.serviceWorker.controller),
    phase: window.__GAME_TEST__?.snapshot().phase,
    canvas: Boolean(document.querySelector('#renderCanvas')),
  }));
  await page.screenshot({ path: path.join(screenshots, 'iteration-06-offline.png') });
  check('game boots and remains interactive after a cold offline navigation', Boolean(offlineState.controlled && offlineState.phase === 'menu' && offlineState.canvas), JSON.stringify(offlineState));
  await page.click('#start-button');
  const playingOffline = await page.evaluate(() => window.__GAME_TEST__?.snapshot().phase === 'playing');
  check('offline game starts without a network dependency', playingOffline);
  check('no browser console or runtime errors', errors.length === 0, errors.slice(0, 5).join(' | '));
} catch (error) {
  errors.push(`test: ${error instanceof Error ? error.stack || error.message : String(error)}`);
} finally {
  await page.setOfflineMode(false).catch(() => {});
  await browser.close();
}

const report = {
  iteration: 6,
  url: baseUrl,
  viewport: { ...viewport, mobile: true, touch: true },
  checks,
  errors,
  passed: checks.filter((item) => item.passed).length,
  total: checks.length,
  completedAt: new Date().toISOString(),
};
await fs.writeFile(path.join(reports, 'iteration-06-pwa.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`\n${report.passed}/${report.total} PWA checks passed.`);
if (errors.length > 0 || report.passed !== report.total) process.exitCode = 1;
