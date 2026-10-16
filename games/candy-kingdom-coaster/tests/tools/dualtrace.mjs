// dualtrace.mjs — почему взгляд «сам возвращается в центр» в режиме двух меток.
// Гоняет синтетические кадры 320×240 через настоящий конвейер (analyzeColorBlobs ->
// _applyDualResult -> updateCameraLook -> VRController) и печатает, что происходит
// с углом в четырёх сценариях:
//   1) обе метки повернулись вместе (поворот головы) — должен быть 1:1 трекинг;
//   2) осталась только одна метка — проверяем гипотезу «отсчёт потери начинается
//      уже при потере одной»;
//   3) появилось «псевдопятно» чужого оттенка (детектор зацепился за другой
//      предмет) — сколько оно утягивает взгляд;
//   4) обе метки ушли из кадра — как быстро взгляд возвращается в центр.
// Usage: node dualtrace.mjs [baseUrl]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });

const px = (deg) => 160 / Math.tan((65 * Math.PI) / 180 / 2) * Math.tan((deg * Math.PI) / 180); // кадр 320 px, FOV 65

// --- подготовка: две метки 82/238 (симметрично), калибровка «прямо» ----------
const setup = await page.evaluate(() => {
  window.__TEST__.camEnableDualSynthetic();
  window.__TEST__.vrStart('camera-dual', 30, true);
  window.__TEST__.camFeedDual(82, 120, 238, 120, 26);
  const cal = window.__TEST__.camCalibrateDual();
  return { cal: cal.ok, info: cal.info };
});
console.log('setup:', JSON.stringify({ calibrated: setup.cal, halfSepDeg: setup.info.markers.map((m) => m.found) }));

const feed = (ax, ay, bx, by, frames = 12) => page.evaluate((ax, ay, bx, by, frames) => {
  const r = window.__TEST__.camFeedDual(ax, ay, bx, by, 26);
  window.__TEST__.step(1 / 60, frames, false); // дать сглаживанию догнать (0.14 с)
  const v = window.__TEST__.vrInfo();
  const c = window.__TEST__.camInfo();
  const L = window.__TEST__.camLook();
  return {
    trackerYaw: c.yaw, heldYaw: c.heldYaw, found: c.found, fresh: c.fresh,
    visible: c.dualVisible.join('+') || '—', lost: c.lastLostMarker,
    vrYaw: v.yawDeg, source: v.lookSource, aim: L.yaw, state: c.pairState,
    deltas: c.dualDeltas.map((d) => d.deltaYaw).join('/'), trust: c.dualTrust,
  };
}, ax, ay, bx, by, frames);

console.log('\n=== 1. поворот головы: обе метки сдвигаются вместе ===');
for (const deg of [0, 5, 10, 15]) {
  const d = Math.round(px(deg));
  const r = await feed(82 + d, 120, 238 + d, 120);
  console.log(`  сдвиг ${String(deg).padStart(2)}° (${String(d).padStart(3)} px): трекер ${r.trackerYaw.toFixed(1)}° цель ${r.aim.toFixed(1)}° vr ${r.vrYaw.toFixed(1)}° ${r.visible} (${r.state})`);
}

console.log('\n=== 2. осталась одна метка (левая), ждём кадр за кадром ===');
for (let i = 0; i < 5; i++) {
  const r = await feed(142, 120, null, null);
  console.log(`  кадр ${i + 1}: found=${r.found} трекер ${r.trackerYaw.toFixed(1)}° held ${r.heldYaw.toFixed(1)}° цель ${r.aim.toFixed(1)}° (${r.state}) ушла=${r.lost}`);
}

console.log('\n=== 3. чужое пятно того же оттенка, когда голова уже отвёрнута ===');
{
  // Реальная метка у левого края кадра (голова отвёрнута вправо ~37°),
  // «правая метка» — статичный предмет в 10 px от центра кадра (напр. блик).
  // Поворот головы моделируем честно: ОБЕ коробки едут вместе, шагами.
  for (const d of [22, 44, 66]) await feed(82 + d, 120, 238 + d, 120);
  await feed(170, 120, 326, 120);                  // ~20°: правая вот-вот уйдёт за край
  const alone = await feed(170, 120, null, null);  // правая метка ушла из кадра
  const pseudo = await feed(170, 120, 190, 120);   // вместо неё чужой блик у центра кадра
  const dL = +alone.deltas.split('/')[0];
  const dR = +pseudo.deltas.split('/')[1];
  const wouldBeMean = (dL + dR) / 2;
  console.log(`  одна реальная метка: трекер ${alone.trackerYaw.toFixed(1)}° цель ${alone.aim.toFixed(1)}° (${alone.state})`);
  console.log(`  + чужое пятно:       трекер ${pseudo.trackerYaw.toFixed(1)}° цель ${pseudo.aim.toFixed(1)}° дельты ${pseudo.deltas} (${pseudo.state})`);
  console.log(`  СТАРОЕ поведение дало бы среднее дельт = ${wouldBeMean.toFixed(1)}°  ← взгляд «съезжал» с ${dL.toFixed(1)}° к центру`);
  const r1 = await feed(170, 120, 190, 120);
  const r2 = await feed(170, 120, 190, 120);
  console.log(`  удержание после: ${r1.trackerYaw.toFixed(1)}° / ${r2.trackerYaw.toFixed(1)}° (кадр за кадром), доверие ${JSON.stringify(r2.trust)}`);
  const b = await feed(148, 120, 304, 120);
  console.log(`  пара снова целиком: трекер ${b.trackerYaw.toFixed(1)}° цель ${b.aim.toFixed(1)}° дельты ${b.deltas} (${b.state})`);
}

console.log('\n=== 3-бис. совпадающие оттенки: один предмет попал в обе маски ===');
{
  const same = await feed(148, 120, 150, 118, 4);
  console.log(`  один предмет в двух пятнах: трекер ${same.trackerYaw.toFixed(1)}° дельты ${same.deltas} (${same.state}) — скачка в центр нет`);
}

console.log('\n=== 3b. псевдопятно ПОСЛЕ калибровки, реальная метка ведёт далеко в сторону ===');
{
  const hold = await feed(142, 120, null, null, 6);
  const now = await feed(142, 120, 160, 120, 6);
  const now2 = await feed(142, 120, 160, 120, 6);
  const now3 = await feed(142, 120, 160, 120, 6);
  console.log(`  удержание:      трекер ${hold.trackerYaw.toFixed(1)}° цель ${hold.aim.toFixed(1)}° (${hold.state})`);
  console.log(`  + псевдо центр: трекер ${now.trackerYaw.toFixed(1)}° цель ${now.aim.toFixed(1)}° дельты ${now.deltas} (${now.state}) доверие ${JSON.stringify(now.trust)}`);
  console.log(`  через 6 кадров: трекер ${now2.trackerYaw.toFixed(1)}° цель ${now2.aim.toFixed(1)}°  ещё 6: трекер ${now3.trackerYaw.toFixed(1)}° цель ${now3.aim.toFixed(1)}°`);
}

console.log('\n=== 4. обе метки ушли: как ведёт себя взгляд (реальное время через camAgeLoss) ===');
{
  const out = await page.evaluate(() => {
    const t = window.__TEST__;
    t.camFeedDual(null, null, null, null, 26);
    const rows = [];
    for (const age of [0, 300, 900, 1500, 2500, 4200, 6000, 9000]) {
      const r = t.camAgeLoss(age);
      const L = t.camLook();
      rows.push({ age, tracker: r.info.yaw, held: r.info.heldYaw, found: r.info.found ? 1 : 0, aim: L.yaw, src: r.vr.lookSource, state: r.info.pairState, flags: `${L.lookMode} camOn=${L.camOn} vrRide=${L.vrRide} ago=${L.lastFoundAgoMs}` });
    }
    return rows;
  });
  for (const g of out) console.log(`  потеряно ${String(g.age).padStart(4)} мс: found=${g.found} трекер ${g.tracker.toFixed(1)}° цель ${g.aim.toFixed(1)}° (${g.src}) ${g.state} | ${g.flags}`);
}

console.log('\n=== 4b. старый баг-сценарий: обе ушли, потом взгляд должен вернуться в центр ===');
await browser.close();
