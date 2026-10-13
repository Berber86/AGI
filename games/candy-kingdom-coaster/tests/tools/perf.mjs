// perf.mjs — start-up hitch audit: are shader programs / GPU textures still
// being created lazily while the race is already running?  Every new program
// is a synchronous compile (tens to hundreds of ms on phones) = a visible hitch.
// Usage: node perf.mjs [raceSeconds=30]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
page.on('console', (m) => { if (/warm|prewarm|ERROR/i.test(m.text())) console.log('CONSOLE', m.text().slice(0, 200)); });
const t0 = Date.now();
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
console.log('ready after', Date.now() - t0, 'ms', JSON.stringify(await page.evaluate(() => window.__TEST__.perf())), JSON.stringify(await page.evaluate(() => window.__PREWARM__)));
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.step(1 / 60, 1, true); });
const p0 = await page.evaluate(() => window.__TEST__.perf());
console.log('menu frame', JSON.stringify(p0));
await page.evaluate(() => { window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); window.__TEST__.holdSteer(0); });
const secs = Number(process.argv[2] || 30);
let last = p0.programs, lastTex = p0.textures, lazyP = 0, lazyT = 0;
for (let i = 0; i < secs * 2; i++) {
  const r = await page.evaluate(() => { window.__TEST__.step(1 / 60, 30, false); const a = performance.now(); window.__TEST__.step(1 / 60, 1, true); return { ms: Math.round(performance.now() - a), p: window.__TEST__.perf() }; });
  if (r.p.programs !== last || r.p.textures !== lastTex) console.log(`t=${(i * 0.5 + 0.5).toFixed(1)}s render=${r.ms}ms programs=${r.p.programs} (+${r.p.programs - last}) textures=${r.p.textures} (+${r.p.textures - lastTex})`);
  lazyP += Math.max(0, r.p.programs - last); lazyT += Math.max(0, r.p.textures - lastTex);
  last = r.p.programs; lastTex = r.p.textures;
}
console.log(`lazy during race: ${lazyP} shader programs, ${lazyT} textures`);
await browser.close();
