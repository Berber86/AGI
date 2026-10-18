import puppeteer from 'puppeteer-core';
import fs from 'fs';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const URL = process.argv[2];
const OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 600000,
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.textContent||'').includes('Начать погружение')); b && b.click(); });
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(() => {
  const w = window.__REEF__;
  const keep = 20;
  Object.defineProperty(w, 'lifeTime', { get: () => keep, set: () => {}, configurable: true });
  w.targetYaw = Math.PI * 0.78;
  w.targetPitch = -0.10;
  w.targetYaw = Math.PI * 0.78;
});
await new Promise((r) => setTimeout(r, 9000));
await page.screenshot({ path: `${OUT}/eels.png` });
console.log('done', OUT);
await browser.close();
