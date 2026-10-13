// audit.mjs — scene perf audit at the busiest track point.
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
await page.evaluate(() => window.__TEST__.pinQuality(2));

for (const u of [0.42, 0.08, 0.95]) {
  const r = await page.evaluate((uu) => {
    window.__TEST__.setProgress(uu, 0, true);
    window.__TEST__.snapCamera();
    window.__TEST__.step(1 / 60, 30, true);
    return window.__TEST__.sceneAudit();
  }, u);
  console.log(`u=${u}:`, JSON.stringify({
    meshes: r.meshes, totalTri: r.totalTri, totalCalls: r.totalCalls,
    top: r.top.slice(0, 5).map((b) => `${b.k}:${Math.round(b.tri / 1000)}k`),
  }));
}
console.log('pageerrors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();
