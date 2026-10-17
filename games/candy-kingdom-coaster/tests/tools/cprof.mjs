// cprof.mjs — CPU-профиль страницы (CDP Profiler): кто реально жжёт время в
// поездке с камерой. Печатает топ функций по self-time и разбивку по файлам.
// Usage: node cprof.mjs [url] [label]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const LABEL = process.argv[3] || 'current';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });

// подготовка: VR, две метки, калибровка
await page.evaluate(() => {
  const T = window.__TEST__;
  T.camEnableDualSynthetic();
  T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82, 120, 238, 120, 26);
  if (T.camAgeMarkers) T.camAgeMarkers(400);
  T.camFeedDual(82, 120, 238, 120, 26);
  T.camCalibrateDual();
});

const client = await page.createCDPSession();
await client.send('Profiler.enable');
await client.send('Profiler.setSamplingInterval', { interval: 500 });
await client.send('Profiler.start');
// ~6 с работы: игровые кадры с рендером + кадры камеры
await page.evaluate(async () => {
  const T = window.__TEST__;
  const t0 = performance.now();
  let i = 0;
  while (performance.now() - t0 < 6000) {
    T.camFeedDual(82 + (i % 3), 120, 238, 120, 26);
    T.step(1 / 60, 1, true);
    i++;
    await new Promise((r) => setTimeout(r, 0));
  }
});
const { profile } = await client.send('Profiler.stop');

// агрегация self-time по функциям и по файлам
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
const dt = profile.timeDeltas || [];
for (let i = 0; i < profile.samples.length; i++) {
  const n = byId.get(profile.samples[i]);
  if (!n) continue;
  const key = `${n.callFrame.functionName || '(anon)'} @ ${(n.callFrame.url || '').split('/').pop()}:${n.callFrame.lineNumber + 1}`;
  self.set(key, (self.get(key) || 0) + (dt[i] || 0));
}
const total = [...self.values()].reduce((a, b) => a + b, 0) / 1000;
const byFile = new Map();
for (const [k, v] of self) {
  const file = k.split(' @ ')[1].split(':')[0] || '?';
  byFile.set(file, (byFile.get(file) || 0) + v);
}
console.log(`=== ${LABEL}: всего ${total.toFixed(0)} мс CPU за ~6 с ===`);
console.log('-- по файлам --');
for (const [f, v] of [...byFile].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`${(v / 1000).toFixed(0).padStart(6)} мс  ${((v / 1000 / total) * 100).toFixed(0).padStart(3)}%  ${f}`);
}
console.log('-- топ функций (self) --');
for (const [k, v] of [...self].sort((a, b) => b[1] - a[1]).slice(0, 18)) {
  console.log(`${(v / 1000).toFixed(0).padStart(6)} мс  ${((v / 1000 / total) * 100).toFixed(0).padStart(3)}%  ${k}`);
}
await browser.close();
