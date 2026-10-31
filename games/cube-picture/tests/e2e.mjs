// E2E в headless Chromium: node games/cube-picture/tests/e2e.mjs
// Требует инструменты из references/headless-browser-setup.md (/home/user/tools) и
// статический сервер из корня репозитория: python3 -m http.server 8899
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderScene } from './synth.mjs';
import { PICTURES } from '../src/pictures.js';

const TOOLS = process.env.TOOLS || '/home/user/tools';
const require = createRequire(join(TOOLS, 'package.json'));
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '.studio', 'evidence');
mkdirSync(join(OUT, 'screenshots'), { recursive: true });
mkdirSync(join(OUT, 'reports'), { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/cube-picture/index.html';

const report = { startedAt: new Date().toISOString(), checks: [], consoleErrors: [], screenshots: [] };
let failed = 0;
const ok = (cond, msg) => {
  report.checks.push({ ok: !!cond, msg });
  console.log((cond ? '  ok  ' : 'FAIL  ') + msg);
  if (!cond) failed++;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Фейковая камера: видео 640×480 со сборкой «светофора» в центре рамки (портрет 360×800).
function writeY4M(path, rows) {
  const W = 640;
  const H = 480;
  const scene = renderScene(rows, { size: 480, cube: 34, offset: [0, -14], angle: 6 });
  const rgb = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = x - 80;
      const i = (y * W + x) * 4;
      if (sx < 0 || sx >= 480) {
        rgb.set([236, 232, 224, 255], i);
        continue;
      }
      const j = (y * 480 + sx) * 4;
      rgb.set(scene.data.subarray(j, j + 4), i);
    }
  }
  const Y = Buffer.alloc(W * H);
  const U = Buffer.alloc((W * H) / 4);
  const V = Buffer.alloc((W * H) / 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const [r, g, b] = [rgb[i], rgb[i + 1], rgb[i + 2]];
      Y[y * W + x] = Math.max(0, Math.min(255, 0.299 * r + 0.587 * g + 0.114 * b));
      if (y % 2 === 0 && x % 2 === 0) {
        const k = (y / 2) * (W / 2) + x / 2;
        U[k] = Math.max(0, Math.min(255, 128 - 0.168736 * r - 0.331264 * g + 0.5 * b));
        V[k] = Math.max(0, Math.min(255, 128 + 0.5 * r - 0.418688 * g - 0.081312 * b));
      }
    }
  }
  const frame = Buffer.concat([Buffer.from('FRAME\n'), Y, U, V]);
  writeFileSync(path, Buffer.concat([Buffer.from(`YUV4MPEG2 W${W} H${H} F30:1 Ip A1:1 C420jpeg\n`), frame, frame]));
}
writeY4M('/tmp/cube-traffic.y4m', PICTURES[0].rows);

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--no-zygote', '--in-process-gpu', '--headless',
    '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream',
    '--use-file-for-fake-video-capture=/tmp/cube-traffic.y4m',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

async function newPage(width, height, { noCamera = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: Number(process.env.DPR || 1.5), isMobile: true, hasTouch: true });
  page.on('console', (m) => {
    if (m.type() === 'error') report.consoleErrors.push(`${width}x${height}: ${m.text()}`);
  });
  page.on('pageerror', (e) => report.consoleErrors.push(`${width}x${height} pageerror: ${e.message}`));
  if (noCamera) {
    await page.evaluateOnNewDocument(() => {
      navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
  }
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.__READY__ === true);
  return page;
}
const st = (page) => page.evaluate(() => window.__GAME_TEST__.state());
async function shot(page, name) {
  const path = join(OUT, 'screenshots', `${name}.webp`);
  await page.screenshot({ path, type: 'webp', quality: 72 });
  report.screenshots.push(`.studio/evidence/screenshots/${name}.webp`);
  return path;
}
async function canvasVariance(page, sel) {
  const buf = await (await page.$(sel)).screenshot({ type: 'png' });
  const { channels } = await sharp(buf).stats();
  return channels.slice(0, 3).reduce((s, c) => s + c.stdev, 0) / 3;
}
const tap = async (page, sel) => {
  const el = await page.$(sel);
  const box = await el.boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
};
// Синтетическое фото в странице → тот же путь, что и снимок.
const checkRows = (page, rows, opts = {}) =>
  page.evaluate(
    async (rows, opts) => {
      const { renderScene } = await import('./tests/synth.mjs');
      const s = renderScene(rows, { size: 360, cube: 46, ...opts });
      return window.__GAME_TEST__.checkImageData(new ImageData(s.data, s.width, s.height));
    },
    rows,
    opts,
  );

// ============================================================ 360×800: полный цикл с камерой
{
  const page = await newPage(360, 800);
  let s = await st(page);
  ok(s.screen === 'map', 'старт: карта картинок');
  ok((await page.$$('.card')).length === 8, 'на карте 8 картинок');
  ok(await page.$eval('.card[data-index="0"]', (e) => e.classList.contains('next')), 'первая картинка подсвечена как следующая');
  const textNodes = await page.evaluate(() => {
    const out = [];
    const walk = (n) => {
      if (n.nodeType === 3 && n.textContent.trim()) out.push(n.textContent.trim());
      for (const c of n.childNodes) if (!(c.id === 'adultSheet' || c.tagName === 'SCRIPT')) walk(c);
    };
    walk(document.body);
    return out;
  });
  ok(textNodes.length === 0, `детские экраны без текста (найдено: ${JSON.stringify(textNodes)})`);
  await shot(page, '360x800-map');

  await tap(page, '.card[data-index="0"]');
  await sleep(300);
  s = await st(page);
  ok(s.screen === 'task' && s.picture === 'traffic', 'касание карточки открывает образец «светофор»');
  ok((await canvasVariance(page, '#taskCanvas')) > 8, 'образец нарисован');
  await shot(page, '360x800-task');

  await tap(page, '#btnCamera');
  await page.waitForFunction(() => window.__GAME_TEST__.state().camera === 'live', { timeout: 8000 }).catch(() => {});
  s = await st(page);
  ok(s.screen === 'camera' && s.camera === 'live', `камера включилась (camera=${s.camera})`);
  await page.waitForFunction(() => (window.__GAME_TEST__.state().live || {}).ok === true, { timeout: 6000 }).catch(() => {});
  s = await st(page);
  ok(s.live && s.live.ok, `живой предпросмотр узнал сборку (live=${JSON.stringify(s.live)})`);
  ok(await page.$eval('#btnShutter', (b) => b.classList.contains('ready')), 'кнопка 📷 подсвечена «готово»');
  await shot(page, '360x800-camera');

  // Пауза при сворачивании: камера выключается и включается обратно.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  s = await st(page);
  ok(s.camera === 'off', 'свёрнуто: камера остановлена');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForFunction(() => window.__GAME_TEST__.state().camera === 'live', { timeout: 8000 }).catch(() => {});
  ok((await st(page)).camera === 'live', 'развёрнуто: камера снова работает');
  await sleep(500);

  await tap(page, '#btnShutter');
  await sleep(150);
  s = await st(page);
  ok(s.screen === 'result' && s.camera === 'off', 'после снимка камера выключена, идёт проверка');
  await page.waitForFunction(() => window.__GAME_TEST__.state().mode === 'success', { timeout: 4000 }).catch(() => {});
  s = await st(page);
  ok(s.mode === 'success' && s.result.ok, `снимок с камеры засчитан (result=${JSON.stringify(s.result)})`);
  ok(s.done.includes('traffic'), 'звезда за «светофор» сохранена');
  await sleep(1200);
  await shot(page, '360x800-success-traffic');
  ok((await page.$$('#resultActions .icon-btn')).length === 3, 'после победы 3 кнопки: карта, ещё раз, следующая');

  // Ошибка: «цветок» с жёлтым вместо розового лепестка слева.
  await page.evaluate(() => window.__GAME_TEST__.open(2));
  s = await checkRows(page, ['.R.', 'YYK', '.G.']);
  ok(!s.ok && s.mismatches.length === 1 && s.mismatches[0].src.join() === '1,0', `ошибка цвета найдена в клетке (1,0): ${JSON.stringify(s.mismatches)}`);
  await page.evaluate(() => window.__GAME_TEST__.finishCheck());
  ok((await st(page)).mode === 'fail', 'показан экран «почти»');
  ok((await page.$$('#resultActions .icon-btn')).length === 2, 'при ошибке 2 кнопки: образец и переснять');
  await sleep(300);
  await shot(page, '360x800-fail-flower');
  await tap(page, '#resultActions .icon-btn.primary');
  await page.waitForFunction(() => window.__GAME_TEST__.state().camera === 'live', { timeout: 8000 }).catch(() => {});
  ok((await st(page)).screen === 'camera', '«переснять» снова открывает камеру');

  // Пустой стол.
  await page.evaluate(() => window.__GAME_TEST__.open(1));
  s = await checkRows(page, ['.']);
  ok(!s.ok && s.reason === 'empty', 'пустой стол не засчитан');
  await page.evaluate(() => window.__GAME_TEST__.finishCheck());
  await sleep(400);
  await shot(page, '360x800-fail-empty');

  // Все 8 анимаций (поворот сборки на 90° — тоже засчитывается).
  for (let i = 0; i < PICTURES.length; i++) {
    const p = PICTURES[i];
    await page.evaluate((i) => window.__GAME_TEST__.open(i), i);
    const { rotateRows } = await import('./synth.mjs');
    const rows = rotateRows(p.rows, i % 2);
    s = await checkRows(page, rows, { cube: Math.min(50, Math.floor(230 / Math.max(rows.length, rows[0].length))), angle: (i % 3) * 4 - 4 });
    ok(s.ok, `${p.id}: верная сборка засчитана (поворот ${(i % 2) * 90}°)`);
    await page.evaluate(() => window.__GAME_TEST__.finishCheck());
    const vars = [];
    for (const t of [3.2, 4.4]) {
      await page.evaluate((t) => window.__GAME_TEST__.freeze(t), t);
      vars.push(await canvasVariance(page, '#resultCanvas'));
    }
    const a = await (await page.$('#resultCanvas')).screenshot({ type: 'png' });
    await page.evaluate(() => window.__GAME_TEST__.freeze(5.1));
    const b = await (await page.$('#resultCanvas')).screenshot({ type: 'png' });
    ok(vars.every((v) => v > 10), `${p.id}: анимация нарисована (σ=${vars.map((v) => v.toFixed(1))})`);
    ok(!a.equals(b), `${p.id}: кадры анимации меняются во времени`);
    await page.evaluate((t) => window.__GAME_TEST__.freeze(t), p.id === 'rocket' ? 2.2 : 3.6);
    await shot(page, `360x800-anim-${String(i + 1).padStart(2, '0')}-${p.id}`);
    await page.evaluate(() => window.__GAME_TEST__.unfreeze());
  }
  s = await st(page);
  ok(s.done.length === 8, `все 8 звёзд собраны (${s.done.length})`);
  await page.evaluate(() => window.__GAME_TEST__.go('map'));
  await sleep(300);
  await shot(page, '360x800-map-all-stars');

  // Режим «форма»: переключатель на карте, свои звёзды, любые цвета, оживление в цветах ребёнка.
  await tap(page, '#modeShape');
  await sleep(200);
  s = await st(page);
  ok(s.playMode === 'shape', 'переключатель на карте включает режим «форма»');
  ok((await page.$$('.card.done')).length === 0, 'в режиме «форма» свои звёзды (пока ни одной)');
  await shot(page, '360x800-map-shape');
  await page.evaluate(() => window.__GAME_TEST__.open(3));
  await sleep(200);
  await shot(page, '360x800-task-shape-rocket');
  s = await checkRows(page, ['.G.', '.K.', 'YRY', '.C.'], { cube: 50 });
  ok(s.ok, `форма: ракета из любых цветов засчитана (result=${JSON.stringify(s)})`);
  await page.evaluate(() => window.__GAME_TEST__.finishCheck());
  s = await st(page);
  ok(s.doneShape.includes('rocket') && s.done.length === 8, 'форма: звезда в режиме «форма», звёзды цвета не тронуты');
  await page.evaluate(() => window.__GAME_TEST__.freeze(2.2));
  ok((await canvasVariance(page, '#resultCanvas')) > 10, 'форма: ракета оживает');
  await shot(page, '360x800-success-shape-rocket');
  await page.evaluate(() => window.__GAME_TEST__.unfreeze());
  await page.evaluate(() => window.__GAME_TEST__.open(3));
  s = await checkRows(page, ['.G.', '.K.', 'YRY', '...'], { cube: 50 });
  ok(!s.ok, `форма: без нижнего кубика не засчитано (reason=${s.reason})`);
  await page.evaluate(() => window.__GAME_TEST__.open(3));
  s = await checkRows(page, ['.G.', '...', 'YRY', '.C.'], { cube: 50 });
  ok(!s.ok && s.mismatches.length === 1 && s.mismatches[0].src.join() === '1,1', `форма: без кубика в середине — ошибка ровно в клетке (1,1) (${JSON.stringify(s.mismatches)})`);
  await page.evaluate(() => window.__GAME_TEST__.finishCheck());
  await page.evaluate(() => window.__GAME_TEST__.freeze(1.5));
  await shot(page, '360x800-fail-shape-rocket');
  await page.evaluate(() => window.__GAME_TEST__.unfreeze());
  await page.evaluate(() => window.__GAME_TEST__.go('map'));
  await sleep(200);
  await tap(page, '#modeColor');
  await sleep(200);
  ok((await st(page)).playMode === 'color', 'переключатель возвращает режим «цвета»');

  // Меню взрослых — удержание 1 с.
  const box = await (await page.$('#btnAdult')).boundingBox();
  await page.touchscreen.touchStart(box.x + 20, box.y + 20);
  await sleep(400);
  await page.touchscreen.touchEnd();
  ok(await page.$eval('#adultSheet', (e) => e.hidden), 'короткое касание шестерёнки меню не открывает');
  await page.touchscreen.touchStart(box.x + 20, box.y + 20);
  await sleep(1150);
  await page.touchscreen.touchEnd();
  ok(await page.$eval('#adultSheet', (e) => !e.hidden), 'удержание шестерёнки 1 с открывает меню взрослых');
  await shot(page, '360x800-adult');
  ok((await st(page)).tolerance === 'wide', 'по умолчанию широкий допуск цвета');
  await page.click('#btnTolerance');
  ok((await st(page)).tolerance === 'strict', 'кнопка в меню взрослых включает строгий допуск');
  await page.click('#btnTolerance');
  ok((await st(page)).tolerance === 'wide', 'и возвращает широкий');
  await page.close();
}

// ============================================================ 412×915 + запасной путь без камеры
{
  const page = await newPage(412, 915, { noCamera: true });
  await shot(page, '412x915-map');
  await page.evaluate(() => window.__GAME_TEST__.open(7));
  await sleep(200);
  await shot(page, '412x915-task-butterfly');
  await tap(page, '#btnCamera');
  await page.waitForFunction(() => window.__GAME_TEST__.state().camera === 'fallback', { timeout: 4000 }).catch(() => {});
  ok((await st(page)).camera === 'fallback', 'камера запрещена → запасной режим');
  ok(await page.$eval('#btnGallery', (b) => b.classList.contains('attention')), 'кнопка «выбрать фото» подсвечена');
  await sleep(400);
  await shot(page, '412x915-camera-fallback');
  // Фото «из галереи»: бабочка, снятая с телефона 4:3 под углом.
  const scene = renderScene(PICTURES[7].rows, { size: 600, cube: 70, angle: -9, tint: [1.08, 0.98, 0.84] });
  const wide = await sharp(Buffer.from(scene.data), { raw: { width: 600, height: 600, channels: 4 } })
    .extend({ left: 100, right: 100, background: { r: 236, g: 232, b: 224, alpha: 1 } })
    .jpeg({ quality: 85 })
    .toBuffer();
  writeFileSync('/tmp/cube-butterfly.jpg', wide);
  const input = await page.$('#fileInput');
  await input.uploadFile('/tmp/cube-butterfly.jpg');
  await page.waitForFunction(() => window.__GAME_TEST__.state().mode === 'success', { timeout: 5000 }).catch(() => {});
  const s = await st(page);
  ok(s.mode === 'success', `фото из файла засчитано (result=${JSON.stringify(s.result)})`);
  await sleep(2000);
  await shot(page, '412x915-success-butterfly');
  await page.evaluate(() => window.__GAME_TEST__.open(5));
  await checkRows(page, ['.BB.', 'RRRY', 'P...']);
  await page.evaluate(() => window.__GAME_TEST__.finishCheck());
  await sleep(300);
  await shot(page, '412x915-fail-car');
  await page.close();
}

await browser.close();
ok(report.consoleErrors.length === 0, `нет ошибок в консоли (${JSON.stringify(report.consoleErrors)})`);
report.finishedAt = new Date().toISOString();
report.passed = report.checks.filter((c) => c.ok).length;
report.failed = failed;
writeFileSync(join(OUT, 'reports', 'e2e.json'), JSON.stringify(report, null, 2));
console.log(`\n${report.passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
