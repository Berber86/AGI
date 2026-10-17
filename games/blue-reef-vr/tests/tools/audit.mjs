// audit.mjs — численный аудит картинки: снимает кадры в заданных состояниях и
// считает по пикселям то, что нельзя «увидеть глазами» в песочнице — яркость,
// цветовой разброс, симметрию стереопары, заполненность кадра.
//   node audit.mjs [outDir]
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const OUT = path.join(ROOT, '.studio/evidence/screenshots/audit');
const REPORT = path.join(ROOT, '.studio/evidence/reports/visual-audit.json');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.dirname(REPORT), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 900, height: 420, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text().slice(0, 300)); });

await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });
await page.evaluate(() => window.__TEST__.setPreset('smooth'));

async function frames(n = 8, maxMs = 120000) {
  await page.evaluate(([n, maxMs]) => new Promise((resolve) => {
    let c = 0; const t0 = performance.now();
    const step = () => { c++; if (c >= n || performance.now() - t0 > maxMs) resolve(); else requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), [n, maxMs]);
}

const CASES = [
  { id: 'flat-center', mode: 'flat', yaw: 0, pitch: 0, t: 0 },
  { id: 'flat-up', mode: 'flat', yaw: 0, pitch: 40, t: 8 },
  { id: 'flat-down', mode: 'flat', yaw: 0, pitch: -40, t: 8 },
  { id: 'flat-side', mode: 'flat', yaw: -60, pitch: 0, t: 8 },
  { id: 'vr-center', mode: 'vr', yaw: 0, pitch: 0, t: 0 },
  { id: 'vr-turn', mode: 'vr', yaw: 45, pitch: -15, t: 20 },
  { id: 'vr-whale', mode: 'vr', yaw: 20, pitch: 5, t: 20 },
];

async function stats(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let sum = 0, n = 0, sumR = 0, sumG = 0, sumB = 0;
  const vals = [];
  for (let y = 0; y < info.height; y += 2) {
    for (let x = 0; x < info.width; x += 2) {
      const i = (y * info.width + x) * ch;
      const l = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      sum += l; sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2]; n++;
      vals.push(l);
    }
  }
  const mean = sum / n;
  let varsum = 0;
  for (const v of vals) varsum += (v - mean) ** 2;
  // Симметрия стереопары: сравниваем средние яркости левой и правой половины.
  let left = 0, right = 0, ln = 0, rn = 0;
  for (let y = 0; y < info.height; y += 2) {
    for (let x = 0; x < info.width; x += 2) {
      const i = (y * info.width + x) * ch;
      const l = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      if (x < info.width / 2 - 4) { left += l; ln++; } else if (x > info.width / 2 + 4) { right += l; rn++; }
    }
  }
  return {
    mean: +mean.toFixed(1),
    std: +Math.sqrt(varsum / vals.length).toFixed(1),
    rgb: [Math.round(sumR / n), Math.round(sumG / n), Math.round(sumB / n)],
    leftMean: +(left / Math.max(1, ln)).toFixed(1),
    rightMean: +(right / Math.max(1, rn)).toFixed(1),
    symmetry: +(1 - Math.abs(left / Math.max(1, ln) - right / Math.max(1, rn)) / 128).toFixed(3),
  };
}

const rows = [];
for (const c of CASES) {
  await page.evaluate(([mode, yaw, pitch, t]) => {
    if (mode === 'vr') {
      window.__TEST__.startVr({ lookMode: 'camera-dual', baselineCm: 64 });
      window.__TEST__.look(yaw, pitch, false);
    } else {
      window.__TEST__.startFlat();
      window.__TEST__.setPreviewLook(yaw, pitch);
    }
    window.__TEST__.step(t || 0);
  }, [c.mode, c.yaw, c.pitch, c.t]);
  await frames(c.mode === 'vr' ? 10 : 12);
  const file = path.join(OUT, `${c.id}.webp`);
  const tmp = path.join(OUT, `${c.id}.png`);
  await page.screenshot({ path: tmp });
  await sharp(tmp).webp({ quality: 80 }).toFile(file);
  fs.unlinkSync(tmp);
  const st = await stats(file);
  const world = await page.evaluate(() => window.__TEST__.worldInfo());
  const vr = await page.evaluate(() => window.__TEST__.vrInfo());
  rows.push({ id: c.id, ...st, triangles: world.render.triangles, calls: world.render.calls, lookSource: vr.lookSource, whale: world.whale.distanceM });
  console.log(c.id, JSON.stringify({ mean: st.mean, std: st.std, calls: world.render.calls, tris: world.render.triangles }));
}

const report = {
  generatedAt: new Date().toISOString(),
  viewport: { width: 900, height: 420 },
  preset: 'smooth',
  renderer: 'headless chromium + SwiftShader (software GL)',
  note: 'Кадры сняты без GPU: числа доказывают, что сцена рисуется и меняется, но не доказывают FPS на телефоне.',
  cases: rows,
  errors,
};
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');
console.log('errors:', errors.length ? errors : 'none');
console.log('report:', REPORT);
await browser.close();
