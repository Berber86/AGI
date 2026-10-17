// sceneqa.mjs — содержимое мира и пресеты качества: рыбы есть и плывут, кит
// подходит ближе, пресеты реально меняют плотность и разрешение.
//   node sceneqa.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const REPORT = path.join(ROOT, '.studio/evidence/reports/sceneqa.json');

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail: String(detail) });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ` — ${detail}` : ''));
};

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  // deviceScaleFactor 3 — как у современного телефона: пресеты по-настоящему
  // различаются по разрешению (иначе на dpr=1 все дают 1.0).
  defaultViewport: { width: 640, height: 320, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text().slice(0, 200)); });

await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });

// Мир стоит на месте: по контракту пловец не перемещается.
{
  const w = await page.evaluate(() => window.__TEST__.world());
  check('мир: глаза на 6.4 м над дном, поверхность над головой', w.eyeY === 6.4 && w.surfaceY > w.eyeY, JSON.stringify({ eyeY: w.eyeY, surfaceY: w.surfaceY, depth: w.eyeDepth }));
}

// Виды рыб
{
  await page.evaluate(() => window.__TEST__.setPreset('beautiful'));
  const info = await page.evaluate(() => window.__TEST__.worldInfo());
  const species = info.fish;
  check('рыбы: 9 видов, все присутствуют', species.length === 9 && species.every((s) => s.count > 0), species.map((s) => `${s.id}:${s.count}`).join(' '));
  check('рыбы: всего больше 200 на максимальном качестве', info.fishTotal > 200, `итого ${info.fishTotal}`);
  check('кит: длина 11.5 м', Math.abs(info.whale.lengthM - 11.5) < 0.01, `${info.whale.lengthM} м`);
}

// Пресеты меняют плотность и частицы
{
  const get = async (preset) => page.evaluate((p) => {
    const i = window.__TEST__.setPreset(p);
    return { fish: i.fishTotal, snow: i.particles.snow, rays: i.particles.rays, dpr: i.render.pixelRatio, corals: i.corals.reduce((a, b) => a + b, 0) };
  }, preset);
  const b = await get('beautiful');
  const m = await get('balanced');
  const s = await get('smooth');
  check('presets: рыб больше на «Красиво», чем на «Плавно»', b.fish > m.fish && m.fish > s.fish, `${b.fish} > ${m.fish} > ${s.fish}`);
  check('presets: взвеси и лучей меньше на «Плавно»', b.snow > s.snow && b.rays >= s.rays, `снег ${b.snow}→${s.snow}, лучи ${b.rays}→${s.rays}`);
  check('presets: кораллов меньше на «Плавно»', b.corals > s.corals, `${b.corals} → ${s.corals}`);
  check('presets: разрешение меняется', b.dpr > s.dpr, `dpr ${b.dpr} → ${s.dpr}`);
}

// Рыбы действительно плывут
{
  await page.evaluate(() => window.__TEST__.setPreset('balanced'));
  const before = await page.evaluate(() => window.__TEST__.fishProbe());
  await page.evaluate(() => window.__TEST__.step(6));
  const after = await page.evaluate(() => window.__TEST__.fishProbe());
  const moved = before.filter((b, i) => Math.hypot(after[i].x - b.x, after[i].y - b.y, after[i].z - b.z) > 0.05).length;
  check('рыбы: сдвигаются за 6 секунд', moved >= 7, `сдвинулись ${moved} из ${before.length}`);
}

// Кит: далекó и периодически ближе
{
  const samples = await page.evaluate(() => {
    const out = [];
    for (let i = 0; i < 26; i++) {
      const info = window.__TEST__.step(5);
      out.push({ t: i * 5, d: info.whale.distanceM, close: info.whale.closeness });
    }
    return out;
  });
  const dists = samples.map((s) => s.d);
  const min = Math.min(...dists), max = Math.max(...dists);
  check('кит: подплывает ближе 40 м', min < 40, `минимум ${min} м`);
  check('кит: большую часть времени далекó', max > 55, `максимум ${max} м`);
  const near = samples.filter((s) => s.close > 0.5).length;
  check('кит: сближение редкое и короткое', near > 0 && near <= 6, `${near} сэмплов из ${samples.length} вблизи`);
}

// Бюджет кадра
{
  await page.evaluate(() => window.__TEST__.setPreset('smooth'));
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const info = await page.evaluate(() => window.__TEST__.worldInfo());
  check('рендер: менее 40 draw call-ов', info.render.calls > 0 && info.render.calls < 40, `calls=${info.render.calls}`);
  check('рендер: менее 200 тыс. треугольников на глаз', info.render.triangles < 200000, `tris=${Math.round(info.render.triangles)}`);
}

check('нет ошибок страницы', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

const passed = results.filter((r) => r.ok).length;
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify({
  suite: 'sceneqa',
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed,
  failed: results.length - passed,
  note: 'Прогон в headless Chromium на программном GL. Проверяет состав и поведение мира, а не производительность на телефоне.',
  results,
}, null, 2) + '\n');
console.log(`\nSCENEQA ${passed}/${results.length}`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
