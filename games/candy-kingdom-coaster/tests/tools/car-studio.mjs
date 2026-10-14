// car-studio.mjs — deterministic close-up screenshots of the hero car.
//
//   node car-studio.mjs <outDir> [--width 1280] [--height 720] [--drive s,steer,boost]
//                       [--prefix name] view [view ...]
//
// Views come from car-studio.html (`hero-front`, `side-left`, `wheel`, `yaw:45,7,1.9`,
// `custom:x,y,z,tx,ty,tz,fov`, …). The page renders only the car, so a shot costs a
// couple of seconds instead of the full world's minutes.
import puppeteer from 'puppeteer-core';
import fs from 'fs';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const OUT = argv.shift() || '/home/user/shots';
const WIDTH = Number(flag('width', 1280));
const HEIGHT = Number(flag('height', 720));
const PREFIX = flag('prefix', 'car');
const DRIVE = flag('drive', null);
const FRAMES = Number(flag('frames', 6));
const HIDE_STATS = flag('stats', '0') !== '0';
const URL_BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/tests/tools/car-studio.html';
const views = argv.length ? argv : ['hero-front'];

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', String(e).slice(0, 400)));
page.on('console', (m) => {
  if (m.type() === 'error') console.error('CONSOLE', m.text().slice(0, 400));
});
await page.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
if (HIDE_STATS) await page.evaluate(() => window.__STUDIO__.hideStats());
if (DRIVE) {
  const [s, st, b] = DRIVE.split(',').map(Number);
  await page.evaluate((a) => window.__STUDIO__.setDrive(a[0], a[1], !!a[2]), [s, st, b]);
}
const stats = await page.evaluate(() => window.__STUDIO__.stats());
console.log('car stats:', JSON.stringify(stats));

for (const view of views) {
  let info;
  try {
    info = await page.evaluate((v) => window.__STUDIO__.setView(v), view);
  } catch (e) {
    console.error('skip', view, String(e).slice(0, 160));
    continue;
  }
  await page.evaluate((n) => window.__STUDIO__.renderFrames(n), FRAMES);
  const name = `${PREFIX}-${view.replace(/[:.,]/g, '_')}.png`;
  await page.screenshot({ path: `${OUT}/${name}` });
  console.log('shot', name, JSON.stringify(info.look));
}
await browser.close();
