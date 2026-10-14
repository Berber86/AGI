// ponytailqa.mjs — Lily ponytail physics probe (carlab): strand position under motion profiles.
// Usage: node ponytailqa.mjs [outDir] [--shots]
// ponytail physics probe in carlab: prints tip position (car-body space) under motion profiles + shots
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const OUT = process.argv[2] || '/home/user/shots';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--single-process','--no-zygote','--in-process-gpu','--headless'], defaultViewport: { width: 960, height: 600 } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 300)));
await page.goto('http://127.0.0.1:8899/games/candy-kingdom-coaster/tests/carlab.html?view=tail', { timeout: 120000 });
await page.waitForFunction('window.__CARLAB__ && window.__CARLAB__.ready', { timeout: 300000 });
await page.evaluate(() => { window.__CARLAB__.paused = true; });
const fmt = (s) => { const tip = s[s.length - 1], mid = s[s.length >> 1]; return `mid=${JSON.stringify(mid)} tip=${JSON.stringify(tip)}`; };
const steps = [
  ['parked 3s', 3, { v0: 0 }],
  ['cruise 12 m/s 3s', 3, { v0: 12 }],
  ['cruise 25 m/s 3s', 3, { v0: 25 }],
  ['brake -14 m/s² 0.35s', 0.35, { accel: -14 }],
  ['after brake +0.4s @ const', 0.4, {}],
  ['accelerate from 5 m/s +10 m/s² 0.4s', 0.4, { v0: 5, accel: 10 }],
  ['left turn 18 m/s yaw +0.9 rad/s 0.6s', 0.6, { v0: 18, yawRate: 0.9, steer: -0.8 }],
  ['right turn 18 m/s yaw -0.9 rad/s 0.6s', 0.6, { v0: 18, yawRate: -0.9, steer: 0.8 }],
];
for (const [name, sec, o] of steps) {
  const s = await page.evaluate((sec, o) => window.__CARLAB__.simulate(sec, o), sec, o);
  console.log(name.padEnd(40), fmt(s));
  if (process.argv.includes('--shots') && /parked|25 m|brake -|left/.test(name)) {
    await page.evaluate(() => window.__CARLAB__.setView('tail'));
    await page.evaluate(() => window.__CARLAB__.render());
    await page.screenshot({ path: `${OUT}/tail-${name.split(' ')[0]}.png` });
  }
}
await browser.close();
