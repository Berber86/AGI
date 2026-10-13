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
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 120)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
await sleep(1200);
const audit = await page.evaluate(() => window.__TEST__.sceneAudit());
console.log('TOTAL', audit.totalTri, 'tri /', audit.totalCalls, 'calls /', audit.meshes, 'meshes');
console.log('VISIBLE', JSON.stringify(audit.vis), 'total', audit.visMeshes);
console.log('--- by type ---', JSON.stringify(audit.byType));
console.log('--- buckets ---');
for (const b of audit.top) console.log(String(b.tri).padStart(8), 'tri', String(b.calls).padStart(5), 'calls', b.k);
console.log('--- big meshes ---');
for (const m of audit.bigMeshes) console.log(String(m.t).padStart(8), m.path, 'size', JSON.stringify(m.bb), 'v', m.verts, 'x' + m.inst, m.mat);
console.log('--- top by draw calls ---');
for (const b of audit.topCalls) console.log(String(b.tri).padStart(8), 'tri', String(b.calls).padStart(5), 'calls', b.k);
console.log('--- sub-breakdown of heaviest scene child:', audit.heaviest, '---');
for (const b of audit.sub) console.log(String(b.tri).padStart(8), 'tri', String(b.meshes).padStart(5), 'm', String(b.kids).padStart(4), 'kids  [' + b.i + '] ' + b.n);