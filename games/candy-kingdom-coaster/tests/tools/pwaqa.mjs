// pwaqa.mjs — PWA-кэш: код и медиа в разных кэшах, офлайн-запуск работает.
// Проверяет: (1) shell-кэш содержит html/js и НЕ содержит медиа;
// (2) медиа попадает в отдельный кэш при загрузке; (3) после полного офлайна
// игра всё равно стартует; (4) размер обновления = только shell.
// Usage: node pwaqa.mjs [url]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });
await page.waitForFunction('navigator.serviceWorker.controller || navigator.serviceWorker.ready', { timeout: 30000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 1500));

const caches0 = await page.evaluate(async () => {
  const out = {};
  for (const key of await caches.keys()) {
    const c = await caches.open(key);
    const keys = await c.keys();
    out[key] = {
      count: keys.length,
      hasIndex: keys.some((r) => r.url.endsWith('/index.html')),
      hasMain: keys.some((r) => r.url.endsWith('/src/main.js')),
      media: keys.filter((r) => r.url.includes('/assets/')).length,
    };
  }
  return out;
});
const shellKey = Object.keys(caches0).find((k) => /^ckc-v\d+/.test(k));
const mediaKey = Object.keys(caches0).find((k) => k.startsWith('ckc-media'));
record('PWA: код и медиа лежат в разных кэшах',
  !!shellKey && !!mediaKey && caches0[shellKey].hasIndex && caches0[shellKey].hasMain,
  caches0);
record('PWA: в кэше кода нет медиа (обновление тянет только код)',
  !!shellKey && caches0[shellKey].media === 0,
  { shellMedia: caches0[shellKey] ? caches0[shellKey].media : null });
record('PWA: медиа кэшируется отдельно по мере загрузки',
  !!mediaKey && caches0[mediaKey].count > 0 && caches0[mediaKey].media > 0,
  { mediaCount: caches0[mediaKey] ? caches0[mediaKey].count : 0 });

// офлайн-перезапуск
await page.setOfflineMode(true);
let offlineOk = false;
let offlineInfo = null;
try {
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 60000 });
  offlineInfo = await page.evaluate(() => ({ boot: document.body.dataset.boot, forks: window.__TEST__ ? window.__TEST__.forks().length : null }));
  offlineOk = offlineInfo.boot === 'ready';
} catch (e) {
  offlineInfo = String(e).slice(0, 160);
}
await page.setOfflineMode(false);
record('PWA: офлайн-перезапуск игры работает', offlineOk, offlineInfo);

const failed = results.filter((r) => !r.pass).length;
console.log(`\nPWAQA: ${results.length - failed}/${results.length} passed`);
await browser.close();
process.exit(failed ? 1 : 0);
