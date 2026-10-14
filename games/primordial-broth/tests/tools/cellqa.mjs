// cellqa.mjs — close-up art inspection of the creature renderer.
// Usage: node cellqa.mjs <outDir>
// Saves frozen-camera close-ups of: the newborn cell, a mid-size cell with parts,
// and the full seven-part organism.
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const OUT = process.argv[2] || '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/primordial-broth/index.html?nohud=1&seed=7';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  protocolTimeout: 600000,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu',
  ],
  defaultViewport: { width: 900, height: 520, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 300)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__GAME_TEST__ && window.__GAME_TEST__.ready === true', { timeout: 180000 });

const variants = [
  ['cell-stage1', 't.reset(7); t.freezeCamera(true); t.setZoom(1.5); t.teleport(1800, 1700); t.setPlayerHeading(0.35);'],
  ['cell-parts', "t.reset(7); t.freezeCamera(true); t.setZoom(0.95); ['flagellum','flagellum','cilia','spike','stinger'].forEach(p => t.givePart(p)); t.setStage(4); t.teleport(1800, 1700); t.setPlayerHeading(0.35);"],
  ['cell-full', "t.reset(7); t.freezeCamera(true); t.setZoom(0.85); ['flagellum','cilia','spike','stinger','venom','electric','jaw'].forEach(p => t.givePart(p)); t.setStage(7); t.teleport(1800, 1700); t.setPlayerHeading(0.35);"],
  ['cell-others', "t.reset(7); t.freezeCamera(true); t.setZoom(0.9); t.setStage(3); t.teleport(1800, 1700); t.spawnKind('hunter', 200, -60, 70); t.spawnKind('grazer', -220, 80, 60); t.spawnKind('swarmling', 60, 150, 14); t.spawnKind('spore', -140, -160, 16);"],
];

for (const [name, code] of variants) {
  await page.evaluate((src) => { const t = window.__GAME_TEST__; eval(src); }, code);
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: `${OUT}/${name}.png`, timeout: 300000 });
  console.log('shot', name);
}
await browser.close();
