// gesture-runtime.mjs — real MediaPipe Worker/WASM/model smoke test.
// Checks runtime startup, empty-frame fail-closed behavior, lazy ML cache and
// offline reinitialization. This is infrastructure QA only: it does NOT prove
// recognition of a live human hand; test that in gesture-stand on-device.
// Usage: node gesture-runtime.mjs [gameUrl]
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  protocolTimeout: 180000,
});
const page = await browser.newPage();
page.on('pageerror', (error) => console.error('pageerror:', error.message));
const checks = [];
const record = (name, pass, detail) => {
  checks.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(detail)}`);
};

try {
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
      }
    }
  });
  await page.goto(new URL('./gesture-stand/index.html', BASE).href, { waitUntil: 'domcontentloaded' });

  async function runWorker() {
    return page.evaluate(() => new Promise((resolve, reject) => {
      const worker = new Worker('../src/camtrack-worker.js');
      let ready = false, sent = false;
      const timer = setTimeout(() => { worker.terminate(); reject(new Error('MediaPipe Worker timeout')); }, 60000);
      worker.onerror = (event) => { clearTimeout(timer); worker.terminate(); reject(new Error(event.message || 'Worker error')); };
      worker.onmessage = async (event) => {
        const message = event.data || {};
        if (message.gestureStatus === 'error') {
          clearTimeout(timer); worker.terminate(); reject(new Error(message.gestureError || 'MediaPipe failed'));
        }
        if (message.gestureStatus === 'ready') ready = true;
        if (ready && !sent) {
          sent = true;
          const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 240;
          const bitmap = await createImageBitmap(canvas);
          worker.postMessage({
            bitmap, timestampMs: performance.now(), hue: 338, dual: false, gesture: true,
            tol: 26, satMin: .42, c0n: null, fovDeg: 65,
          }, [bitmap]);
        }
        if (message.w && message.h) {
          clearTimeout(timer); worker.terminate();
          resolve({ status: message.gestureStatus || (ready ? 'ready' : 'unknown'),
            hands: message.gestureRaw?.length ?? null,
            victory: message.gesture?.v?.found ?? null,
            thumbUp: message.gesture?.thumb?.found ?? null,
            inferenceMs: message.gestureInferenceMs });
        }
      };
      worker.postMessage({ type: 'initGesture' });
    }));
  }

  const controller = await page.evaluate(() => !!navigator.serviceWorker.controller);
  record('game service worker controls the diagnostic room', controller, { controller });
  const online = await runWorker();
  record('pinned MediaPipe runtime/model initialize in the production Worker', online.status === 'ready', online);
  record('empty image cannot activate either gesture', online.hands === 0 && online.victory === false && online.thumbUp === false, online);

  await new Promise((resolve) => setTimeout(resolve, 600));
  const mlCache = await page.evaluate(async () => {
    const cache = await caches.open('ckc-ml-mediapipe-1.1.1');
    return (await cache.keys()).map((request) => new URL(request.url).pathname.split('/').slice(-2).join('/'));
  });
  const hasModel = mlCache.some((path) => path.endsWith('gesture_recognizer.task'));
  const hasWasm = mlCache.some((path) => path.endsWith('.wasm'));
  record('model and selected WASM were cached lazily for offline use', hasModel && hasWasm, mlCache);

  await page.setOfflineMode(true);
  const offline = await runWorker();
  record('fresh Worker can reinitialize while offline after first successful load',
    offline.status === 'ready' && offline.hands === 0 && offline.thumbUp === false, offline);
} catch (error) {
  record('runtime integration completed', false, error?.message || String(error));
} finally {
  await browser.close();
}
const passed = checks.filter(Boolean).length;
console.log(`\nGESTURE RUNTIME QA: ${passed}/${checks.length} passed (not a real-hand field test)`);
process.exit(passed === checks.length ? 0 : 1);
