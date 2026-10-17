// lookqa.mjs — числовой контроль «картинки»: насколько кадр похож на настоящую
// подводную сцену, а не на плоскую молочную картинку.
//
//   node lookqa.mjs [outDir]
//
// Снимает набор ракурсов в обычном режиме и в VR и считает по каждому кадру:
//   mean/std      — яркость и контраст (молоко = высокий mean, низкий std);
//   sat           — насыщенность;
//   detail        — энергия высоких частот (детальность);
//   clip/black    — доли выбитых в белый и проваленных в чёрный пикселей;
//   depthRatio    — во сколько раз даль темнее ближнего плана: без этого нет
//                   ощущения толщи воды;
//   redDrop       — насколько красный канал падает с расстоянием (спектральное
//                   поглощение — главный признак «настоящей» воды).
//
// Эталон «плохого кадра» взят из реального снимка с устройства
// (.studio/evidence/screenshots/device/): mean 170.6, std 37.8, sat 0.35,
// 70 % пикселей в интервале 176…208.
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const OUT = process.argv[2] || path.join(ROOT, '.studio/evidence/screenshots/lookqa');
const PRESET = process.env.PRESET || 'balanced';
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Пороги «настоящей картинки» (подобраны по эталону плохого кадра).
// Пороги взяты не с потолка: это замеры старого рендера, к которым добавлен
// запас. Старый кадр (audit/flat-center, 900×420, родное разрешение):
// mean 143.2, std 47.1, localStd 14.06, sat 0.529, detail 8.41, band 44.5 %,
// depth 1.67. Значит «хорошо» — это: контраст выше 14, детальность выше 8.4,
// молока меньше 45 % и при этом яркость в разумных пределах.
const TARGET = {
  meanMin: 108, meanMax: 158,
  // Глобальный std сильно зависит от композиции кадра (и от того, что яркие
  // зоны больше не выгорают), поэтому порог с запасом на межпрогон шума ±2.
  // Главный показатель контраста — localStd ниже.
  stdMin: 40,
  satMin: 0.52,        // было 0.529
  detailMin: 12,       // было 8.41
  localStdMin: 17,     // было 14.06
  clipMax: 4.0,        // % пикселей ярче 250
  blackMax: 12.0,      // % пикселей темнее 16
  flatBandMax: 20,     // было 44.5 % — меньше половины «молочного» кадра
  depthMin: 1.5,       // даль обязана быть заметно темнее ближнего плана
  redDropMin: 3.0,     // спектральное поглощение: красный уходит с расстоянием
};
// Особые классы кадров: у них объективно другая статистика, и сравнивать их
// надо со своим же старым baseline, а не с видом вперёд.
const OVERRIDES = {
  up: { meanMin: 100, meanMax: 155, detailMin: 6, satMin: 0.6, depthCheck: false, redDropCheck: false },
  down: { meanMin: 135, meanMax: 168, stdMin: 30, detailMin: 15, satMin: 0.4, flatBandMax: 25, depthCheck: false, redDropCheck: false },
  vr: { meanMin: 108, meanMax: 152, stdMin: 40, detailMin: 10, localStdMin: 16, depthMin: 1.45 },
};

const CASES = [
  { name: 'flat-center', kind: 'flat', yaw: 0, pitch: 0, sec: 8 },
  { name: 'flat-left', kind: 'flat', yaw: -48, pitch: 6, sec: 14 },
  { name: 'flat-right', kind: 'flat', yaw: 52, pitch: -10, sec: 20 },
  // Взгляд вверх — это почти одна поверхность воды: детальности там объективно
  // меньше, порог для такого кадра отдельный.
  { name: 'flat-up', kind: 'flat', yaw: 8, pitch: 34, sec: 26, override: OVERRIDES.up },
  { name: 'flat-down', kind: 'flat', yaw: -6, pitch: -30, sec: 32, override: OVERRIDES.down },
  // VR-глаз: квадрат 420×420, угловая плотность пикселей та же, что у обычного
  // кадра, но горизонт ýже — поэтому свои пороги.
  { name: 'vr-center', kind: 'vr', yaw: 0, pitch: 0, sec: 8, override: OVERRIDES.vr },
  { name: 'vr-turn', kind: 'vr', yaw: -40, pitch: 8, sec: 20, override: OVERRIDES.vr },
];

async function metrics(file, crop) {
  const S = 480;
  let pipeline = sharp(file);
  if (crop) pipeline = pipeline.extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h });
  const { data, info } = await pipeline.resize({ width: S }).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const at = (x, y, c) => data[(y * w + x) * ch + c];
  const lum = (x, y) => 0.2126 * at(x, y, 0) + 0.7152 * at(x, y, 1) + 0.0722 * at(x, y, 2);

  let sum = 0, sum2 = 0, sat = 0, clip = 0, black = 0, band = 0, n = 0;
  let detail = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = at(x, y, 0), g = at(x, y, 1), b = at(x, y, 2);
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sum += l; sum2 += l * l; n++;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      sat += mx === 0 ? 0 : (mx - mn) / mx;
      if (l > 250) clip++;
      if (l < 16) black++;
      if (l >= 176 && l < 208) band++;
    }
  }
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const lap = 4 * lum(x, y) - lum(x - 1, y) - lum(x + 1, y) - lum(x, y - 1) - lum(x, y + 1);
      detail += Math.abs(lap);
    }
  }
  const mean = sum / n;

  // Локальный контраст: разброс яркости внутри маленьких плиток. Именно он
  // отвечает за ощущение «плотной» картинки, а не за общий перепад верх/низ.
  const T = 16;
  let locSum = 0, locN = 0;
  for (let ty = 0; ty + T <= h; ty += T) {
    for (let tx = 0; tx + T <= w; tx += T) {
      let s = 0, s2 = 0, c = 0;
      for (let y = ty; y < ty + T; y++) for (let x = tx; x < tx + T; x++) { const l0 = lum(x, y); s += l0; s2 += l0 * l0; c++; }
      const mn = s / c;
      locSum += Math.sqrt(Math.max(0, s2 / c - mn * mn)); locN++;
    }
  }
  const localStd = +(locSum / Math.max(1, locN)).toFixed(2);

  // Даль против ближнего плана: нижняя треть кадра — песок у ног, верхняя —
  // толща воды и риф за поляной.
  const zone = (y0, y1) => {
    let s = 0, r = 0, b = 0, c = 0;
    for (let y = Math.floor(h * y0); y < Math.floor(h * y1); y++) {
      for (let x = 0; x < w; x++) { s += lum(x, y); r += at(x, y, 0); b += at(x, y, 2); c++; }
    }
    return { l: s / c, r: r / c, b: b / c };
  };
  const near = zone(0.66, 1.0);
  const far = zone(0.05, 0.35);
  const redNear = near.r / Math.max(1, near.b);
  const redFar = far.r / Math.max(1, far.b);

  return {
    mean: +mean.toFixed(1),
    std: +Math.sqrt(Math.max(0, sum2 / n - mean * mean)).toFixed(1),
    sat: +(sat / n).toFixed(3),
    detail: +(detail / ((w - 2) * (h - 2))).toFixed(2),
    detailNorm: +(detail / ((w - 2) * (h - 2)) / Math.max(1, mean) * 100).toFixed(2),
    localStd,
    clipPct: +(100 * clip / n).toFixed(2),
    blackPct: +(100 * black / n).toFixed(2),
    flatBandPct: +(100 * band / n).toFixed(1),
    nearLuma: +near.l.toFixed(1),
    farLuma: +far.l.toFixed(1),
    depthRatio: +(near.l / Math.max(1, far.l)).toFixed(2),
    redDrop: +(redNear / Math.max(0.001, redFar)).toFixed(2),
  };
}

function verdict(m, c) {
  const T = { ...TARGET, ...(c.override || {}) };
  const fails = [];
  if (m.mean < T.meanMin) fails.push(`mean ${m.mean} < ${T.meanMin} (темно)`);
  if (m.mean > T.meanMax) fails.push(`mean ${m.mean} > ${T.meanMax} (пересвет)`);
  if (m.std < T.stdMin) fails.push(`std ${m.std} < ${T.stdMin} (плоский контраст)`);
  if (m.sat < T.satMin) fails.push(`sat ${m.sat} < ${T.satMin} (блекло)`);
  if (m.detail < T.detailMin) fails.push(`detail ${m.detail} < ${T.detailMin} (мало деталей)`);
  if (m.localStd < T.localStdMin) fails.push(`localStd ${m.localStd} < ${T.localStdMin} (вялый локальный контраст)`);
  if (m.clipPct > T.clipMax) fails.push(`clip ${m.clipPct}% > ${T.clipMax}%`);
  if (m.blackPct > T.blackMax) fails.push(`black ${m.blackPct}% > ${T.blackMax}%`);
  if (m.flatBandPct > T.flatBandMax) fails.push(`flatBand ${m.flatBandPct}% > ${T.flatBandMax}% (молоко)`);
  if (T.depthCheck !== false && m.depthRatio < T.depthMin) fails.push(`depth ${m.depthRatio} < ${T.depthMin} (нет толщи воды)`);
  if (T.redDropCheck !== false && m.redDrop < T.redDropMin) fails.push(`redDrop ${m.redDrop} < ${T.redDropMin} (нет спектрального поглощения)`);
  return fails;
}

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 900, height: 420, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text().slice(0, 200)); });

await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });
await page.evaluate((p) => window.__TEST__.setPreset(p), PRESET);
await sleep(600);

async function waitFrames(n, maxMs = 120000) {
  await page.evaluate(([n, maxMs]) => new Promise((resolve) => {
    let c = 0; const t0 = performance.now();
    const step = () => { c++; if (c >= n || performance.now() - t0 > maxMs) resolve(); else requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), [n, maxMs]);
}

const rows = [];
for (const c of CASES) {
  await page.evaluate(([kind, yaw, pitch]) => {
    if (kind === 'vr') window.__TEST__.startVr({ lookMode: 'camera-dual', baselineCm: 64 });
    else window.__TEST__.startFlat();
    if (kind === 'vr') window.__TEST__.look(yaw, pitch, false);
    else window.__TEST__.setPreviewLook(yaw, pitch);
  }, [c.kind, c.yaw, c.pitch]);
  await waitFrames(40);
  await sleep(250);
  const file = path.join(OUT, `${c.name}.webp`);
  const tmp = path.join(OUT, `${c.name}.png`);
  await page.screenshot({ path: tmp });
  await sharp(tmp).webp({ quality: 80 }).toFile(file);
  fs.unlinkSync(tmp);
  // В VR вокруг двух квадратов чёрные поля: общая статистика по кадру из-за них
  // врёт (std завышен), поэтому мерим один глаз — ровно то, что видит ребёнок.
  let crop = null;
  if (c.kind === 'vr') {
    const meta = await sharp(file).metadata();
    const side = Math.min(meta.height, Math.floor(meta.width / 2));
    crop = { x: Math.round((meta.width - side * 2) / 2), y: Math.round((meta.height - side) / 2), w: side, h: side };
  }
  const m = await metrics(file, crop);
  const fails = verdict(m, c);
  rows.push({ case: c.name, ...m, pass: fails.length === 0, fails });
  console.log(`${c.name.padEnd(12)} mean=${String(m.mean).padStart(5)} std=${String(m.std).padStart(5)} loc=${String(m.localStd).padStart(5)} sat=${m.sat} det=${String(m.detail).padStart(5)}/${m.detailNorm} band=${m.flatBandPct}% depth=${m.depthRatio} redDrop=${m.redDrop} ${fails.length ? 'FAIL: ' + fails.join('; ') : 'ok'}`);
}

const total = rows.length;
const passed = rows.filter((r) => r.pass).length;
const report = {
  suite: 'lookqa', preset: PRESET, generatedAt: new Date().toISOString(),
  targets: TARGET, referenceBadFrame: { mean: 170.6, std: 37.8, sat: 0.349, flatBandPct: 70.4 },
  total, passed, failed: total - passed, cases: rows, errors,
};
const dir = path.join(ROOT, '.studio/evidence/reports');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'lookqa.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`\nLOOKQA ${passed}/${total}${errors.length ? ' (ошибки: ' + errors.slice(0, 2).join(' | ') + ')' : ''}`);
await browser.close();
process.exit(passed === total && errors.length === 0 ? 0 : 1);
