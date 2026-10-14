// carshot.mjs — showroom screenshots of the Star Racer 7 car (tests/carlab.html).
// Usage: node carshot.mjs <outDir> <view[:query]>...
//   e.g. node carshot.mjs /home/user/shots front34 rear34 chase:steer=0.6 side:tex=0
// Prints build time / triangle count and any page errors.
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/tests/carlab.html';
const OUT = process.argv[2] || '/home/user/shots';
const specs = process.argv.slice(3);
const W = +(process.env.W || 960), H = +(process.env.H || 600);

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
});
const errors = [];
for (const spec of specs) {
  const [view, query = ''] = spec.split(':');
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(`${view}: ${String(e).slice(0, 300)}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${view} console: ${m.text().slice(0, 300)}`); });
  await page.goto(`${BASE}?view=${view}&${query}`, { waitUntil: 'networkidle0', timeout: 180000 });
  await page.waitForFunction('window.__CARLAB__ && window.__CARLAB__.ready', { timeout: 180000 });
  await new Promise((r) => setTimeout(r, 1500));
  const stats = await page.evaluate(() => window.__CARLAB__.stats);
  const name = `${OUT}/car-${view}${query ? '-' + query.replace(/[=&.]/g, '') : ''}.png`;
  await page.screenshot({ path: name });
  console.log(name, JSON.stringify(stats));
  await page.close();
}
await browser.close();
if (errors.length) { console.log('ERRORS:\n' + [...new Set(errors)].join('\n')); process.exitCode = 1; }
