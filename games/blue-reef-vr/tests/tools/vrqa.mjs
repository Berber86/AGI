// vrqa.mjs — контракт VR и обзора головой. Синтетика: живой камеры в песочнице
// нет, но вся математика, состояния и пределы проверяются детерминированно.
//   node vrqa.mjs
import fs from 'fs';
import path from 'path';
import os from 'os';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const REPORT = path.join(ROOT, '.studio/evidence/reports/vrqa.json');

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail: String(detail) });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ` — ${detail}` : ''));
};

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
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text().slice(0, 200)); });

await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });
await page.evaluate(() => window.__TEST__.setPreset('smooth'));

const frames = (n = 8, maxMs = 90000) => page.evaluate(([n, maxMs]) => new Promise((resolve) => {
  let c = 0; const t0 = performance.now();
  const step = () => { c++; if (c >= n || performance.now() - t0 > maxMs) resolve(); else requestAnimationFrame(step); };
  requestAnimationFrame(step);
}), [n, maxMs]);

// 1. Пределы обзора зафиксированы контрактом
{
  const lim = await page.evaluate(() => window.__TEST__.limits());
  check('limits: yaw ±70, pitch ±45', lim.yawDeg === 70 && lim.pitchDeg === 45, JSON.stringify(lim));
  check('limits: baseline 10–150 cm', lim.baseline[0] === 10 && lim.baseline[1] === 150, JSON.stringify(lim.baseline));
}

// 2. VR не включается сам
{
  const before = await page.evaluate(() => window.__TEST__.vrInfo());
  check('vr: не активен до явного старта', before.active === false, JSON.stringify(before.lookSource));
  check('vr: гироскоп не используется никогда', before.gyro === false, `gyro=${before.gyro}`);
}

// 3. Старт VR и стереораскладка
{
  const info = await page.evaluate(() => window.__TEST__.startVr({ lookMode: 'camera-dual', baselineCm: 64 }));
  await frames(10);
  const vr = await page.evaluate(() => window.__TEST__.vrInfo());
  check('vr: стартует по команде', vr.active === true, JSON.stringify({ mode: vr.lookMode }));
  const L = vr.layout;
  const w = 900, h = 420;
  const expectSide = Math.min(h, Math.floor(w / 2));
  check('stereo: два квадрата по центру', L && L.side === expectSide && L.eyes[0] === Math.round((w - expectSide * 2) / 2) && L.eyes[1] - L.eyes[0] === expectSide, JSON.stringify(L));
  check('vr: кадры считаются', vr.frames > 0, `frames=${vr.frames}`);
}

// 4. Базис: границы и единицы
{
  const vals = await page.evaluate(() => [
    window.__TEST__.setBaseline(10), window.__TEST__.setBaseline(999), window.__TEST__.setBaseline(-40), window.__TEST__.setBaseline(64),
  ]);
  const info = await page.evaluate(() => window.__TEST__.vrInfo());
  check('baseline: зажимается в 10…150 см', vals[0] === 10 && vals[1] === 150 && vals[2] === 10, JSON.stringify(vals));
  check('baseline: 64 см = 0.64 м в мировых единицах', Math.abs(info.baselineM - 0.64) < 1e-6, `${info.baselineM} м`);
}

// 5. Пределы взгляда соблюдаются даже при «безумных» углах метки
{
  await page.evaluate(() => window.__TEST__.look(200, 120, false));
  await frames(24);
  const vr = await page.evaluate(() => window.__TEST__.vrInfo());
  check('look: рыскание не больше +70°', vr.yawDeg <= 70.5 && vr.yawDeg > 60, `${vr.yawDeg}°`);
  check('look: наклон не больше +45°', vr.pitchDeg <= 45.5 && vr.pitchDeg > 35, `${vr.pitchDeg}°`);
  await page.evaluate(() => window.__TEST__.look(-200, -120, false));
  await frames(24);
  const vr2 = await page.evaluate(() => window.__TEST__.vrInfo());
  check('look: симметрично влево и вниз', vr2.yawDeg < -60 && vr2.pitchDeg < -35, `${vr2.yawDeg}° / ${vr2.pitchDeg}°`);
}

// 6. Удержание: без данных взгляд стоит, а не едет в центр
{
  await page.evaluate(() => window.__TEST__.look(0, 0, false));
  await frames(20);
  await page.evaluate(() => window.__TEST__.look(35, -12, false));
  await frames(30);
  const held = await page.evaluate(() => window.__TEST__.vrInfo());
  await page.evaluate(() => window.__TEST__.look(35, -12, true)); // метка пропала
  await sleep(1200);
  await frames(40);
  const after = await page.evaluate(() => window.__TEST__.vrInfo());
  const drift = Math.abs(after.yawDeg - held.yawDeg);
  check('hold: при потере метки взгляд удерживается', drift < 1.0 && after.lookSource === 'held', `дрейф ${drift.toFixed(2)}°, source=${after.lookSource}`);
  check('hold: взгляд не возвращается к центру', Math.abs(after.yawDeg) > 25, `${after.yawDeg}°`);
}

// 7. Режим «прямо» не слушает метку
{
  await page.evaluate(() => window.__TEST__.setLookMode('forward'));
  await page.evaluate(() => window.__TEST__.look(60, 30, false));
  await frames(30);
  const vr = await page.evaluate(() => window.__TEST__.vrInfo());
  check('forward: метка не двигает взгляд', Math.abs(vr.yawDeg) < 0.5 && Math.abs(vr.pitchDeg) < 0.5, `${vr.yawDeg}° / ${vr.pitchDeg}°`);
  check('forward: источник — forward', vr.lookSource === 'forward', vr.lookSource);
}

// 8. Режимы меток: гироскоп по-прежнему отключён
{
  for (const mode of ['camera', 'camera-dual']) {
    const info = await page.evaluate((m) => { window.__TEST__.setLookMode(m); return window.__TEST__.vrInfo(); }, mode);
    check(`режим ${mode}: гироскоп отключён`, info.gyro === false && info.lookMode === mode, JSON.stringify({ mode: info.lookMode, gyro: info.gyro }));
  }
  const modes = await page.evaluate(() => window.__TEST__.lookModes());
  check('lookModes: ровно три режима без гироскопа',
    modes.length === 3 && !modes.some((m) => /gyro/i.test(m.id)),
    modes.map((m) => m.id).join(','));
}

// 9. Пауза останавливает симуляцию
{
  await page.evaluate(() => window.__TEST__.startVr({ lookMode: 'camera-dual' }));
  await frames(4);
  const a = await page.evaluate(() => window.__TEST__.state());
  await page.evaluate(() => window.__TEST__.pause());
  await sleep(700);
  const b = await page.evaluate(() => window.__TEST__.state());
  await page.evaluate(() => window.__TEST__.resume());
  await frames(4);
  const c = await page.evaluate(() => window.__TEST__.state());
  check('pause: время стоит на паузе', Math.abs(b.elapsed - a.elapsed) < 0.05, `Δ=${(b.elapsed - a.elapsed).toFixed(3)}s`);
  check('resume: время снова идёт', c.elapsed > b.elapsed, `Δ=${(c.elapsed - b.elapsed).toFixed(3)}s`);
}

// 10. Выход из VR
{
  await page.evaluate(() => window.__TEST__.stopVr());
  const info = await page.evaluate(() => window.__TEST__.vrInfo());
  const st = await page.evaluate(() => window.__TEST__.state());
  check('stop: VR выключается', info.active === false && st.mode === 'menu' || info.active === false, JSON.stringify({ active: info.active, mode: st.mode }));
}

// 11. Стереобазис реально меняет картинку (а не только число в настройках)
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brvr-'));
  const mean = async (file, x0, x1) => {
    const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    let s = 0, n = 0, diff = 0, dn = 0;
    for (let y = 0; y < info.height; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const i = (y * info.width + x) * info.channels;
        const l = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        s += l; n++;
        const j = (y * info.width + (x + Math.floor(info.width / 2))) * info.channels;
        if (x + Math.floor(info.width / 2) < info.width) {
          const r = data[j] * 0.299 + data[j + 1] * 0.587 + data[j + 2] * 0.114;
          diff += Math.abs(l - r); dn++;
        }
      }
    }
    return { mean: s / n, stereoDiff: diff / Math.max(1, dn) };
  };

  await page.evaluate(() => window.__TEST__.startVr({ lookMode: 'forward', baselineCm: 10 }));
  await page.evaluate(() => window.__TEST__.look(0, 0, false));
  await frames(10);
  const a = path.join(dir, 'base10.png');
  await page.screenshot({ path: a });
  await page.evaluate(() => window.__TEST__.setBaseline(150));
  await frames(10);
  const b = path.join(dir, 'base150.png');
  await page.screenshot({ path: b });

  const left = await mean(a, 40, 440);
  const leftBig = await mean(b, 40, 440);
  check('stereo: кадр не чёрный', left.mean > 30 && leftBig.mean > 30, `яркость ${left.mean.toFixed(1)} / ${leftBig.mean.toFixed(1)}`);
  check('stereo: глаза видят мир со сдвигом (параллакс)', left.stereoDiff > 0.5, `разница половин ${left.stereoDiff.toFixed(2)}`);

  const { data: da, info: ia } = await sharp(a).raw().toBuffer({ resolveWithObject: true });
  const { data: db } = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  let changed = 0, total = 0;
  for (let y = 0; y < ia.height; y += 2) {
    for (let x = 40; x < 440; x += 2) {
      const i = (y * ia.width + x) * ia.channels;
      changed += Math.abs(da[i] - db[i]) > 6 ? 1 : 0;
      total++;
    }
  }
  const pct = changed / total * 100;
  check('baseline: смена 10→150 см меняет кадр', pct > 0.5, `${pct.toFixed(1)} % пикселей левого глаза`);
  fs.rmSync(dir, { recursive: true, force: true });
}

check('нет ошибок страницы', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

const passed = results.filter((r) => r.ok).length;
const report = {
  suite: 'vrqa',
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed,
  failed: results.length - passed,
  viewport: { width: 900, height: 420 },
  note: 'Синтетический прогон в headless Chromium: проверяет код, состояния и математику, но не заменяет живые очки и камеру.',
  results,
};
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(`\nVRQA ${passed}/${results.length}`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
