// pwaqa.mjs — установка, офлайн-запуск и разделение кэшей.
//   node pwaqa.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const REPORT = path.join(ROOT, '.studio/evidence/reports/pwaqa.json');
const ORIGIN = new URL(BASE).origin;

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail: String(detail) });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ` — ${detail}` : ''));
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 640, height: 320, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text().slice(0, 200)); });

await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });

// Манифест
{
  const manifest = await page.evaluate(async () => {
    const r = await fetch('./manifest.webmanifest');
    return { status: r.status, json: await r.json() };
  });
  const m = manifest.json;
  check('manifest: отдаётся и заполнен', manifest.status === 200 && !!m.name && m.icons.length >= 2 && !!m.start_url, `${m.short_name}, иконок ${m.icons.length}`);
  check('manifest: есть маскируемая иконка', m.icons.some((i) => (i.purpose || '').includes('maskable')), m.icons.map((i) => i.purpose).join('|'));
}

// Регистрация service worker
{
  await page.evaluate(() => navigator.serviceWorker.register('./sw.js', { scope: './' }));
  const ready = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return { scope: reg.scope, active: !!reg.active, state: reg.active && reg.active.state };
  });
  check('sw: регистрируется и активируется', ready.active === true, JSON.stringify(ready));
  // Ждём конца установки: precache ходит по сети.
  await sleep(6000);
  const caches = await page.evaluate(async () => await caches.keys());
  check('sw: два раздельных кэша — код и медиа',
    caches.some((c) => c.startsWith('brvr-v')) && caches.some((c) => c.startsWith('brvr-media-')), caches.join(', '));

  const counts = await page.evaluate(async () => {
    const out = {};
    for (const name of await caches.keys()) {
      const c = await caches.open(name);
      out[name] = (await c.keys()).length;
    }
    return out;
  });
  const code = Object.entries(counts).find(([k]) => k.startsWith('brvr-v'));
  const media = Object.entries(counts).find(([k]) => k.startsWith('brvr-media-'));
  check('sw: кэш кода заполнен не меньше чем на 90 %', code && code[1] >= 18, JSON.stringify(code));
  check('sw: медиа-кэш заполнен', media && media[1] >= 10, JSON.stringify(media));
}

// Офлайн-перезагрузка
{
  await page.evaluate(() => navigator.serviceWorker.controller || new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true })));
  await page.reload({ waitUntil: 'load', timeout: 180000 }).catch(() => {});
  await sleep(2000);
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'load', timeout: 180000 }).catch((e) => console.log('reload:', String(e).slice(0, 80)));
  let ok = true;
  try {
    await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 120000 });
  } catch { ok = false; }
  const st = ok ? await page.evaluate(() => window.__TEST__.state()) : null;
  check('offline: игра запускается без сети', ok === true, st ? JSON.stringify({ mode: st.mode, preset: st.preset }) : 'не запустилась');
  await page.setOfflineMode(false);
}

check('нет ошибок страницы', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

const passed = results.filter((r) => r.ok).length;
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify({
  suite: 'pwaqa',
  generatedAt: new Date().toISOString(),
  origin: ORIGIN,
  total: results.length,
  passed,
  failed: results.length - passed,
  note: 'Проверяет установку и офлайн-запуск в headless Chromium (127.0.0.1 считается безопасным контекстом).',
  results,
}, null, 2) + '\n');
console.log(`\nPWAQA ${passed}/${results.length}`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
