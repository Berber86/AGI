// bench.mjs — GPU-synchronised frame time at fixed race positions (software GL:
// only the RELATIVE numbers between two builds mean something).
// Usage: BASE=http://127.0.0.1:8899/... node bench.mjs [frames=6] [u...]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const N = Number(process.argv[2] || 6);
const US = process.argv.slice(3).map(Number);
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); });
for (const u of (US.length ? US : [0.12, 0.35])) {
  const r = await page.evaluate((u, N) => {
    const gl = document.querySelector('canvas').getContext('webgl2');
    const px = new Uint8Array(4);
    window.__TEST__.setProgress(u, 0, true); window.__TEST__.snapCamera();
    const one = () => { window.__TEST__.step(1 / 60, 1, true); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); };
    one(); one();
    const t = [];
    for (let i = 0; i < N; i++) { const a = performance.now(); one(); t.push(performance.now() - a); }
    t.sort((a, b) => a - b);
    return { median: Math.round(t[N >> 1]), min: Math.round(t[0]) };
  }, u, N);
  const ri = await page.evaluate(() => window.__RENDER_INFO__);
  console.log(`u=${u} frame median=${r.median}ms min=${r.min}ms`, JSON.stringify(ri || {}));
}
await browser.close();
