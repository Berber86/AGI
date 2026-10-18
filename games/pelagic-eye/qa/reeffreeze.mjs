// reeffreeze.mjs — смоук 15с-теста фризов: probe ловит искусственный фриз
// (busy-loop 400мс на главном потоке) и классифицирует его как JS-задачу.
// Запуск: cwd /home/user/tools после bootstrap.sh (сервер :8899).
import { writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto('http://127.0.0.1:8899/games/pelagic-eye/play/index.html', { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 3500));
await page.evaluate(() => [...document.querySelectorAll('button')].find((x) => (x.textContent || '').includes('Начать погружение'))?.click());
await new Promise((r) => setTimeout(r, 5000));

// UI: кнопка теста есть в драйвере.
await page.evaluate(() => [...document.querySelectorAll('[title]')].find((e) => (e.title || '').includes('VR-драйвер'))?.click());
await new Promise((r) => setTimeout(r, 700));
const uiReady = await page.evaluate(() => !!([...document.querySelectorAll('button')].find((x) => (x.textContent || '').includes('Начать замер 15с'))));
await page.evaluate(() => [...document.querySelectorAll('button')].find((x) => (x.textContent || '').includes('Сохранить и вернуться'))?.click());
await new Promise((r) => setTimeout(r, 500));

// Замер через QA-хук (8с), в середине — искусственный фриз 400мс.
await page.evaluate(() => window.__PROBE__.start(8000));
await new Promise((r) => setTimeout(r, 2500));
await page.evaluate(() => { const t0 = performance.now(); while (performance.now() - t0 < 400); });
await new Promise((r) => setTimeout(r, 2500));
await page.evaluate(() => { const t0 = performance.now(); while (performance.now() - t0 < 250); });
// Ждём авто-стопа.
let report = null;
for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 500));
  report = await page.evaluate(() => (window.__PROBE__.lastReport ? {
    text: window.__PROBE__.lastReport.text,
    summary: window.__PROBE__.lastReport.json.summary,
    freezeCount: window.__PROBE__.lastReport.json.freezes.length,
    worst: window.__PROBE__.lastReport.json.freezes.slice(0, 5),
    events: window.__PROBE__.lastReport.json.events.map((e) => e.kind),
  } : null));
  if (report) break;
}

const rep = report;
const text = rep?.text ?? '';
const freezeCaught = (rep?.worst ?? []).some((f) => f.wallMs >= 250);
const classified = (rep?.worst ?? []).some((f) => /длинная JS-задача|вне кадра|GC|GPU|рендер|CPU|камера/.test(f.label));
const schemaOk = (rep?.worst ?? []).every((f) => typeof f.gpuMs === 'number' && typeof f.category === 'string');
const result = {
  generatedAt: new Date().toISOString(),
  uiReady,
  reportFound: !!rep,
  summary: rep?.summary ?? null,
  freezeCaught,
  classified,
  worstLabels: (rep?.worst ?? []).map((f) => `#${f.frame} ${f.wallMs}мс ${f.label}`),
  hasVerdictBlock: text.includes('Виновники по сумме времени фризов'),
  hasDeviceBlock: text.includes('GPU:') && text.includes('Кадры:'),
  events: rep?.events ?? [],
  errors,
};
const assertions = {
  uiReady: uiReady === true,
  reportFound: !!rep,
  framesCollected: (rep?.summary?.frames ?? 0) > 3,
  freezeCaught,
  classified,
  schemaOk,
  gpuLine: (rep?.summary?.gpu?.avgMs ?? null) !== null,
  hasVerdictBlock: result.hasVerdictBlock === true,
  hasDeviceBlock: result.hasDeviceBlock === true,
  noPageErrors: errors.length === 0,
};
result.assertions = assertions;
const outPath = '/home/user/AGI/.studio/evidence/reports/reef-freeze-probe.json';
writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('=== ТЕКСТ ОТЧЁТА ===');
console.log(text);
console.log('=== ПРОВЕРКИ ===');
console.log(JSON.stringify(result, null, 2));
const fail = Object.entries(assertions).filter(([, v]) => v !== true);
if (fail.length) {
  console.log('FAILED:', fail.map(([k]) => k).join(', '));
  process.exit(1);
}
console.log('ALL OK →', outPath);
await browser.close();
