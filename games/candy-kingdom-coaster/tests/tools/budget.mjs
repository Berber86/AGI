import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 200)); });
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
await sleep(1000);
const u = Number(process.argv[2] ?? 0.35);
await page.evaluate((u) => {
  window.__TEST__.pinQuality(2);
  window.__TEST__.startRace();
  window.__TEST__.fastForwardCountdown();
  window.__TEST__.setProgress(u, 0, false);
  window.__TEST__.snapCamera();
}, u);
// let a few frames render so renderer.info reflects the racing camera
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await sleep(300);
}
const info = await page.evaluate(() => { const a = window.__TEST__.sceneAudit(); return { ri: window.__RENDER_INFO__, vis: a.vis, visTop: a.visTop, visMeshes: a.visMeshes, sceneMeshes: a.meshes, sceneTri: a.totalTri }; });
console.log('u=' + u, JSON.stringify(info));
await browser.close();
