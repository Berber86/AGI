// jumpshot.mjs OUT name:s0:lat:frames[:boost]  — drive from s0 in a lane for N frames, then screenshot
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', String(e).slice(0, 300)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
await page.evaluate(() => window.__TEST__.pinQuality(2));
for (const spec of process.argv.slice(3)) {
  const [name, s0, lat, frames, boost] = spec.split(':');
  const info = await page.evaluate(([s0, lat, frames, boost]) => {
    const T = window.__TEST__; const L = T.gameInfo().trackLength;
    if (boost) T.forceBoost(30);
    T.setProgress(s0 / L, lat, false);
    T.snapCamera();
    T.step(1 / 60, frames, false);
    T.hideHUD();
    return T.jumpInfo();
  }, [+s0, +lat, +frames, boost === '1']);
  await page.evaluate(() => new Promise((res) => { let c = 0; const f = () => { if (++c >= 4) res(); else requestAnimationFrame(f); }; requestAnimationFrame(f); }));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name, JSON.stringify(info));
}
await browser.close();
