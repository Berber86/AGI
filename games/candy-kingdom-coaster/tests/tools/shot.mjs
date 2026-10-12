// shot.mjs — deterministic screenshots for visual QA of Candy Kingdom Coaster.
// Usage: node shot.mjs <outDir> <name:u:lat:hud>...
//   name  — output file name (without .png)
//   u     — track position 0..1 (fraction of track length)
//   lat   — lateral offset in meters (default 0)
//   hud   — 1 = keep HUD, 0 = hide HUD (pure graphics, default)
// Special specs: "menu", "menu-hud", "intro" (cinematic sweep start).
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const specs = process.argv.slice(3);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE', m.text().slice(0, 200)); });

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
await sleep(1500);
console.log('quality:', await page.evaluate(() => window.__TEST__.pinQuality(2)));

async function waitFrames(n, maxMs = 20000) {
  await page.evaluate(([n, maxMs]) => new Promise((resolve) => {
    let c = 0;
    const t0 = performance.now();
    const step = () => {
      c++;
      if (c >= n || performance.now() - t0 > maxMs) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), [n, maxMs]);
}

for (const spec of specs) {
  const [name, kind, a, b, hudFlag] = spec.split(':');
  const hud = hudFlag === '1';
  if (kind === 'menu') {
    await page.evaluate(() => window.__TEST__.toMenu());
    if (!hud) await page.evaluate(() => window.__TEST__.hideHUD());
    await waitFrames(10, 25000);
  } else if (kind === 'intro') {
    await page.evaluate(() => { window.__TEST__.startRace(); window.__TEST__.setIntro(parseFloat(a)); });
    if (!hud) await page.evaluate(() => window.__TEST__.hideHUD());
    await waitFrames(8, 25000);
  } else {
    const u = parseFloat(a);
    const lat = parseFloat(b || '0');
    await page.evaluate(([u, lat]) => {
      window.__TEST__.setProgress(u, lat, true);
      window.__TEST__.snapCamera();
    }, [u, lat]);
    if (!hud) await page.evaluate(() => window.__TEST__.hideHUD());
    await waitFrames(8, 25000);
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  const info = await page.evaluate(() => window.__TEST__.gameInfo());
  console.log(`shot ${name}.png  state=${info.state} s≈${Math.round(info.trackLength * (parseFloat(a) || 0))}m collected=${info.collected}`);
}

await browser.close();
console.log('done');
