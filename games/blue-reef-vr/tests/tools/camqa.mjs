// camqa.mjs — математика и состояния цветовой метки. Кадры синтетические
// ( injectBlob / injectDualBlob ), живой камеры в песочнице нет.
//   node camqa.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const REPORT = path.join(ROOT, '.studio/evidence/reports/camqa.json');

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

// Подать один и тот же кадр несколько раз с паузой: метка должна «прожить»
// не меньше 0.15 с, чтобы стать сущностью.
async function feed(fn, times = 3, gapMs = 90, args = {}) {
  for (let i = 0; i < times; i++) {
    await page.evaluate(([fnName, a]) => window.__TEST__[fnName](a), [fn, args]);
    await sleep(gapMs);
  }
  return page.evaluate(() => window.__TEST__.camInfo());
}

// ---------------------------------------------------------------- одна метка
{
  await page.evaluate(() => { window.__TEST__.camStart(); window.__TEST__.camSetDual(false); window.__TEST__.camForget(); });
  const once = await page.evaluate(() => window.__TEST__.camFeed({ cx: 160, cy: 120, r: 26 }));
  const info1 = await page.evaluate(() => window.__TEST__.camInfo());
  check('single: одиночный кадр метку не подтверждает', once.found === true && info1.fresh === false, `found=${once.found} fresh=${info1.fresh}`);

  const info2 = await feed('camFeed', 3, 90, { cx: 160, cy: 120, r: 26 });
  check('single: метка жива после 0.15 с наблюдения', info2.found === true && info2.markerEntity.single.confirmed === true, JSON.stringify(info2.markerEntity.single));

  const shape = await page.evaluate(() => window.__TEST__.camInfo());
  check('single: форма — горизонтальный прямоугольник', shape.markerShape && shape.markerShape.ok === true && shape.markerShape.aspect > 1.5, JSON.stringify(shape.markerShape));
}

// Круглое пятно — не метка
{
  await page.evaluate(() => window.__TEST__.camForget());
  const info = await feed('camFeed', 4, 90, { cx: 160, cy: 120, r: 40, shape: 'circle' });
  check('shape: круг отсекается', info.found === false, JSON.stringify({ found: info.found, shape: info.markerShape }));
}

// Знак и величина угла
{
  await page.evaluate(() => { window.__TEST__.camForget(); });
  await feed('camFeed', 3, 90, { cx: 160, cy: 120, r: 26 });
  const cal = await page.evaluate(() => window.__TEST__.camCalibrate());
  check('single: калибровка по видимой метке', cal.ok === true, JSON.stringify({ ok: cal.ok }));

  const right = await feed('camFeed', 3, 90, { cx: 250, cy: 120, r: 26 });
  check('single: метка ушла вправо → взгляд влево (yaw > 0)', right.found && right.yaw > 5, `yaw=${right.yaw}`);

  const left = await feed('camFeed', 3, 90, { cx: 70, cy: 120, r: 26 });
  check('single: метка ушла влево → взгляд вправо (yaw < 0)', left.found && left.yaw < -5, `yaw=${left.yaw}`);

  // Физика: голова вверх -> неподвижная метка уходит ВНИЗ кадра -> pitch > 0.
  const up = await feed('camFeed', 3, 90, { cx: 160, cy: 200, r: 26 });
  check('single: метка ушла вниз кадра → смотрим вверх (pitch > 0)', up.found && up.pitch > 3, `pitch=${up.pitch}`);
  const down = await feed('camFeed', 3, 90, { cx: 160, cy: 40, r: 26 });
  check('single: метка ушла вверх кадра → смотрим вниз (pitch < 0)', down.found && down.pitch < -3, `pitch=${down.pitch}`);
}

// Потеря метки: удержание, а не ноль
{
  await feed('camFeed', 3, 90, { cx: 250, cy: 120, r: 26 });
  const before = await page.evaluate(() => window.__TEST__.camInfo());
  const empty = await page.evaluate(() => window.__TEST__.camFeedEmpty());
  const after = await page.evaluate(() => window.__TEST__.camInfo());
  check('loss: пустой кадр → метки нет', empty.found === false && after.found === false, `found=${after.found}`);
  check('loss: последний угол удержан', Math.abs(after.heldYaw - before.yaw) < 0.6, `held=${after.heldYaw} было ${before.yaw}`);
  check('loss: зафиксирован край ухода', after.exitSideX === 'right' || after.exitSideX === null, `side=${after.exitSideX}`);
}

// ---------------------------------------------------------------- две метки
{
  await page.evaluate(() => { window.__TEST__.camSetDual(true); window.__TEST__.camColors({ hueA: 16, hueB: 338 }); });

  const oneOnly = await feed('camFeedDual', 3, 90, { ax: 96, ay: 120, bx: 100000, by: 100000 });
  check('dual: одна метка — это не пара', oneOnly.dualVisible.length === 1, JSON.stringify(oneOnly.dualVisible));
  const calib1 = await page.evaluate(() => window.__TEST__.camCalibrate());
  check('dual: калибровка по одной метке отвергнута', calib1.ok === false, JSON.stringify({ ok: calib1.ok }));

  const both = await feed('camFeedDual', 3, 90, { ax: 96, ay: 120, bx: 224, by: 120 });
  check('dual: обе метки видны', both.dualVisible.length === 2, JSON.stringify(both.dualVisible));
  const calib2 = await page.evaluate(() => window.__TEST__.camCalibrate());
  check('dual: калибровка по паре принята', calib2.ok === true && calib2.info.dualCalibrated === true, JSON.stringify({ pairs: calib2.info.pairState }));

  const afterCal = await page.evaluate(() => window.__TEST__.camInfo());
  check('dual: ноль по паре → углы около нуля', Math.abs(afterCal.yaw) < 1.5 && Math.abs(afterCal.pitch) < 1.5, `yaw=${afterCal.yaw} pitch=${afterCal.pitch}`);

  // Поворот головы влево: обе коробки смещаются вправо.
  const turned = await feed('camFeedDual', 4, 90, { ax: 156, ay: 124, bx: 284, by: 124 });
  check('dual: поворот влево даёт yaw > 0', turned.found && turned.yaw > 3, `yaw=${turned.yaw}`);
  check('dual: пара согласована (state=pair или single)', ['pair', 'single'].includes(turned.pairState), turned.pairState);

  // Чужое расстояние между пятнами — не пара.
  await page.evaluate(() => window.__TEST__.camSetDual(true));
  await feed('camFeedDual', 3, 90, { ax: 96, ay: 120, bx: 224, by: 120 });
  await page.evaluate(() => window.__TEST__.camCalibrate());
  const conflict = await feed('camFeedDual', 4, 90, { ax: 96, ay: 120, bx: 120, by: 150 });
  check('distance: «метки» слишком близко — парой не признаны', conflict.pairState !== 'pair' || conflict.dualVisible.length < 2, JSON.stringify({ state: conflict.pairState, visible: conflict.dualVisible }));

  // Инвариант порядка: левая коробка всегда левее правой. Меняем их местами —
  // «малиновая левее оранжевой» парой признано быть не должно.
  await feed('camFeedDual', 3, 90, { ax: 96, ay: 120, bx: 224, by: 120 });
  await page.evaluate(() => window.__TEST__.camCalibrate());
  const swapped = await feed('camFeedDual', 4, 90, { ax: 224, ay: 120, bx: 96, by: 120 });
  check('order: переставленные метки парой не признаны', swapped.state !== 'pair', JSON.stringify({ state: swapped.state, used: swapped.dualUsed }));

  const empty = await page.evaluate(() => window.__TEST__.camFeedEmpty());
  check('dual: пустой кадр обе метки теряет', empty.found === false, JSON.stringify({ found: empty.found, state: empty.pairState }));
}

check('диагностика: поля трекера на месте', await page.evaluate(() => {
  const i = window.__TEST__.camInfo();
  return ['procMs', 'procW', 'tier', 'intervalMs', 'markers', 'pairState', 'markerEntity'].every((k) => k in i);
}), 'info()');

check('нет ошибок страницы', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

const passed = results.filter((r) => r.ok).length;
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify({
  suite: 'camqa',
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed,
  failed: results.length - passed,
  note: 'Синтетические кадры: проверяют математику, состояния и дисциплину пары. Реальная коробка, освещение и оправа очков живым тестом не проверялись.',
  results,
}, null, 2) + '\n');
console.log(`\nCAMQA ${passed}/${results.length}`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
