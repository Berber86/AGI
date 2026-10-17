// ftime.mjs — покадровое время в поездке при замедленном CPU (эмуляция телефона).
// Считает среднее/p95/максимум интервалов requestAnimationFrame и долю «рваных»
// кадров (>32 мс) в четырёх режимах: обычная игра, VR без камеры, VR с камерой
// (кадры меток 10 Гц), VR с камерой при 6× замедлении CPU.
// Usage: node ftime.mjs [url] [label] [throttle]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const LABEL = process.argv[3] || 'current';
const THROTTLE = +(process.argv[4] || 6);

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });

const measure = async (setup, withCamera) => page.evaluate(async (setupSrc, withCamera) => {
  // eslint-disable-next-line no-new-func
  const T = window.__TEST__;
  new Function('T', setupSrc)(T);
  T.step(1 / 60, 20, true); // прогрев
  const deltas = [];
  let last = 0;
  let cam = 0;
  const stop = performance.now() + 5000;
  await new Promise((resolve) => {
    const tick = (ts) => {
      if (last) deltas.push(ts - last);
      last = ts;
      if (withCamera && (++cam % 6 === 0)) T.camFeedDual(82 + (cam % 3), 120, 238, 120, 26);
      if (performance.now() < stop) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
  const sorted = deltas.slice().sort((a, b) => a - b);
  const p = (q) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] || 0;
  return {
    frames: deltas.length,
    mean: +(deltas.reduce((a, b) => a + b, 0) / Math.max(1, deltas.length)).toFixed(1),
    p50: +p(0.5).toFixed(1), p95: +p(0.95).toFixed(1), max: +sorted[sorted.length - 1]?.toFixed?.(1),
    rough: +(deltas.filter((d) => d > 32).length / Math.max(1, deltas.length) * 100).toFixed(0),
  };
}, setup, withCamera);

const cdp = await page.createCDPSession();
await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });

const normal = await measure('T.vrStop();', false);
const vrNoCam = await measure(`T.camEnableDualSynthetic(); T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82,120,238,120,26); if (T.camAgeMarkers) T.camAgeMarkers(400);
  T.camFeedDual(82,120,238,120,26); T.camCalibrateDual();`, false);
const vrCam = await measure('', true);
console.log(`=== ${LABEL}, CPU ×${THROTTLE} ===`);
console.log('обычная игра      ', JSON.stringify(normal));
console.log('VR без камеры     ', JSON.stringify(vrNoCam));
console.log('VR + кадры меток  ', JSON.stringify(vrCam));
await browser.close();
