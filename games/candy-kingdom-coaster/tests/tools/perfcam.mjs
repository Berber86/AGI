// perfcam.mjs — цена камерного конвейера и кадра: текущая версия против базы.
// Мерим не «FPS в SwiftShader» (он врёт), а:
//   1) сколько мс тратит обработка одного кадра меток (drawImage+getImageData+
//      анализ+решение) — это главный поток телефона;
//   2) сколько draw calls/треугольников в обычной игре (не должно меняться);
//   3) сколько мс занимает игровой кадр без камеры и с камерой при одном и том же
//      кадре сцены (разница = цена камерного конвейера).
// Usage: node perfcam.mjs [url] [label]
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
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 160)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });

// --- 1. синтетика: чистая цена обработки кадра меток -------------------------
const cost = await page.evaluate(() => {
  const T = window.__TEST__;
  const t = T.internals ? null : null;
  const bench = (fn, n) => {
    // прогрев
    for (let i = 0; i < 3; i++) fn(i);
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(i);
    return (performance.now() - t0) / n;
  };
  T.camEnableSynthetic();
  const single = bench((i) => T.camFeed(160 + (i % 5), 120, 40), 40);
  T.camEnableDualSynthetic();
  const dual = bench((i) => T.camFeedDual(82 + (i % 5), 120, 238, 120, 26), 40);
  T.camFeedDual(82, 120, 238, 120, 26);
  if (T.camAgeMarkers) T.camAgeMarkers(400);
  T.camFeedDual(82, 120, 238, 120, 26);
  const calibrated = bench((i) => T.camFeedDual(82 + (i % 5), 120, 238, 120, 26), 40);
  const info = T.camInfo();
  return { singleMs: +single.toFixed(2), dualMs: +dual.toFixed(2), calibratedDualMs: +calibrated.toFixed(2), procW: info.procW, tier: info.tier, state: info.pairState };
});

// --- 2. обычная игра: draw calls и цена кадра без камеры ---------------------
const normal = await page.evaluate(async () => {
  const T = window.__TEST__;
  T.vrStop();
  T.step(1 / 60, 30, true);
  const ri = window.__RENDER_INFO__ || {};
  const t0 = performance.now();
  T.step(1 / 60, 60, true);
  const frameMs = (performance.now() - t0) / 60;
  return { calls: ri.calls, triangles: ri.triangles, frameMs: +frameMs.toFixed(2) };
});

// --- 3. VR с камерой: сколько мс кадра добавляет работа меток ----------------
const vr = await page.evaluate(async () => {
  const T = window.__TEST__;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  T.camEnableDualSynthetic();
  T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82, 120, 238, 120, 26);
  if (T.camAgeMarkers) T.camAgeMarkers(400);
  T.camFeedDual(82, 120, 238, 120, 26);
  T.camCalibrateDual();
  T.step(1 / 60, 30, true);
  const ri = window.__RENDER_INFO__ || {};
  // кадры БЕЗ подачи меток (камера ничего не обрабатывает)
  let t0 = performance.now();
  T.step(1 / 60, 60, true);
  const idleMs = (performance.now() - t0) / 60;
  // кадры С подачей: на каждый игровой кадр приходит кадр камеры
  t0 = performance.now();
  for (let i = 0; i < 60; i++) {
    T.camFeedDual(82 + (i % 3), 120, 238, 120, 26);
    T.step(1 / 60, 1, true);
  }
  const camMs = (performance.now() - t0) / 60;
  const info = T.camInfo();
  return { calls: ri.calls, triangles: ri.triangles, idleMs: +idleMs.toFixed(2), camMs: +camMs.toFixed(2), intervalMs: info.intervalMs, tier: info.tier };
});
await sleepPrint();

function sleepPrint() {}
console.log(`=== ${LABEL} ===`);
console.log('обработка кадра меток   ', JSON.stringify(cost));
console.log('обычная игра            ', JSON.stringify(normal));
console.log('VR + камера             ', JSON.stringify(vr));
await browser.close();
