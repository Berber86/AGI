// gate.mjs — free camera shots: name:s:back:up:ahead[:lat]  (s in metres; negative back/ahead = camera ahead looking back)
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const specs = process.argv.slice(3);
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', String(e).slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE', m.text().slice(0, 300)); });
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
await page.evaluate(() => window.__TEST__.pinQuality(2));
const waitFrames = (n) => page.evaluate((n) => new Promise((res) => { let c = 0; const f = () => { if (++c >= n) res(); else requestAnimationFrame(f); }; requestAnimationFrame(f); }), n);
for (const spec of specs) {
  const [name, s, back, up, ahead, lat] = spec.split(':');
  await page.evaluate(([s, back, up, ahead, lat]) => {
    const T = window.__TEST__; const info = T.gameInfo();
    T.pinCam(back, up, ahead);
    T.setProgress(s / info.trackLength, lat, true);
    T.snapCamera();
    T.hideHUD();
  }, [+s, +back, +up, +ahead, +(lat || 0)]);
  await waitFrames(8);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
}
await browser.close();
