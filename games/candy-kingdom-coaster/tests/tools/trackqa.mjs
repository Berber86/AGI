// trackqa.mjs — custom soundtrack QA: real taps, then reads __TEST__.music()
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const info = () => page.evaluate(() => window.__TEST__.music());
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
const out = {};
out.beforeTap = await info();
await page.mouse.click(8, 380); // first tap: unlocks audio, music starts
await sleep(3500);
out.menu = await info();
await page.evaluate(() => document.getElementById('btn-play').click());
await sleep(1500);
await page.mouse.click(420, 200); // skip the intro sweep
await page.waitForFunction("window.__GAME_STATE__ === 'racing'", { timeout: 90000 });
await sleep(4000); // past GO! (song restarts on the downbeat)
out.race = await info();
await page.evaluate(() => document.getElementById('btn-pause').click());
await sleep(1500);
out.paused = await info();
await page.evaluate(() => document.getElementById('btn-resume').click());
await sleep(1500);
out.resumed = await info();
out.errors = errs;
for (const [k, v] of Object.entries(out)) {
  if (k === 'errors') { console.log('errors', JSON.stringify(v)); continue; }
  console.log(k.padEnd(10), v.source, 'mode=' + v.mode, 'playing=' + v.playing, 'bus=' + v.busGain, JSON.stringify(v.track));
}
await browser.close();
