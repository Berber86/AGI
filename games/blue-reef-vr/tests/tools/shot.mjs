// shot.mjs — детерминированные снимки «Голубого рифа» для визуального QA.
//   node shot.mjs <outDir> <name:kind:arg>...
// kind:
//   menu        — главный экран
//   prep        — экран подготовки VR
//   flat:yaw:pitch:sec — обычный режим, поворот и момент времени
//   vr:yaw:pitch:sec   — стереопара, поворот головы по метке
import fs from 'fs';
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const specs = process.argv.slice(3);
fs.mkdirSync(OUT, { recursive: true });

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
  defaultViewport: { width: 960, height: 440, deviceScaleFactor: Number(process.env.DPR || 1), isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => { errors.push('PAGEERROR ' + String(e).slice(0, 300)); });
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text().slice(0, 300)); });

await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });
await page.evaluate((p) => window.__TEST__.setPreset(p), process.env.PRESET || 'smooth');
await sleep(800);

async function waitFrames(n, maxMs = 120000) {
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
  const [name, kind, a = '0', b = '0', c = '0'] = spec.split(':');
  if (kind === 'menu') {
    await page.evaluate(() => window.__TEST__.backHome());
  } else if (kind === 'prep') {
    await page.evaluate(() => window.__TEST__.openVrPrep());
  } else if (kind === 'flat' || kind === 'vr') {
    await page.evaluate(([kind, yaw, pitch, sec]) => {
      if (kind === 'vr') window.__TEST__.startVr({ lookMode: 'camera-dual', baselineCm: 64 });
      else window.__TEST__.startFlat();
      window.__TEST__.step(+sec || 0);
      window.__TEST__.look(+yaw || 0, +pitch || 0, false);
    }, [kind, a, b, c]);
    // Дать сглаженному взгляду догнать цель.
    await waitFrames(14);
  }
  await waitFrames(3);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
}

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
