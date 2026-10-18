// reefshots.mjs — скриншоты рифа: лобби, обычный режим, VR-стерео.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const OUT = process.argv[2] || '/tmp/reef-shots';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto('http://127.0.0.1:8899/games/pelagic-eye/play/index.html', { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 5000));
const click = (t, nth = 0) => page.evaluate((t, nth) => {
  const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').includes(t));
  b[nth] && b[nth].click();
}, t, nth);
await click('Начать погружение');
await new Promise((r) => setTimeout(r, 8000));
await page.screenshot({ path: `${OUT}/normal.png` });
// взгляд чуть влево-вниз — покрыть кораллы
await page.evaluate(() => { const w = window.__REEF__; if (w && w.recenterView) { w.targetYaw = -0.55; w.targetPitch = -0.18; } });
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: `${OUT}/normal-left.png` });
await page.evaluate(() => { const w = window.__REEF__; if (w && w.recenterView) { w.targetYaw = 0.6; w.targetPitch = -0.12; } });
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: `${OUT}/normal-right.png` });
// VR
for (let attempt = 0; attempt < 6; attempt++) {
  const inVr = await page.evaluate(() => !!(window.__REEF__ && window.__REEF__.settings && window.__REEF__.settings.vr));
  if (inVr) break;
  await page.evaluate(() => [...document.querySelectorAll('[title]')].find((e) => (e.title || '').includes('VR-драйвер'))?.click());
  await new Promise((r) => setTimeout(r, 900));
  await click('QA-подача'); await new Promise((r) => setTimeout(r, 700));
  await click('Смотрю прямо'); await new Promise((r) => setTimeout(r, 700));
  await click('Войти в VR', 1);
  await new Promise((r) => setTimeout(r, 2500));
}
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: `${OUT}/vr.png` });
console.log('done', OUT);
await browser.close();
