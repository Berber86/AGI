// camqa.mjs — приёмка VR-режима взгляда «По метке» (камера вместо гироскопа).
// Настоящей камеры в песочнице нет: синтетические кадры CamTracker
// (injectBlob) проходят весь путь метка -> углы -> VR-взгляд.
// Usage: node camqa.mjs (из /home/user/tools)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const GAME = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 180000,
});
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 130)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 130)); });

await page.goto(GAME, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });

// 0. подготовка: панель камеры, пипетка с образцом цвета, ползунок строгости
const ui = await page.evaluate(async () => {
  document.getElementById('btn-vr').click();
  document.getElementById('vr-mode-camera').click();
  const panelVisible = !document.getElementById('vr-cam-panel').classList.contains('hidden');
  window.__TEST__.camEnableSynthetic();
  window.__TEST__.camFeed(160, 120, 40);
  document.getElementById('vr-cam-sample').click();
  const hueLabel = document.getElementById('vr-cam-hue-label').textContent;
  const swatch = document.getElementById('vr-cam-swatch').style.background;
  const tol = document.getElementById('vr-cam-tol');
  tol.value = '18';
  tol.dispatchEvent(new Event('input'));
  return { panelVisible, hueLabel, swatch, tol: window.__TEST__.camInfo().tol };
});
record('подготовка: панель, пипетка показала цвет, ползунок работает',
  ui.panelVisible && ui.hueLabel.includes('Свой цвет') && !!ui.swatch && ui.tol === 18, ui);
const dualUi = await page.evaluate(() => {
  document.getElementById('vr-mode-camera-dual').click();
  const out = {
    pressed: document.getElementById('vr-mode-camera-dual').getAttribute('aria-pressed') === 'true',
    panel: !document.getElementById('vr-cam-panel').classList.contains('hidden'),
    controls: !document.getElementById('vr-cam-dual-controls').classList.contains('hidden'),
    left: document.getElementById('vr-cam-left-label').textContent,
    right: document.getElementById('vr-cam-right-label').textContent,
  };
  document.getElementById('vr-mode-camera').click();
  return out;
});
record('подрежим двух меток: отдельная панель и пресеты слева/справа',
  dualUi.pressed && dualUi.panel && dualUi.controls && /Оранж/.test(dualUi.left) && /Малин/.test(dualUi.right), dualUi);
const gestureUi = await page.evaluate(() => {
  const b = document.getElementById('vr-gesture-zoom');
  const before = b.getAttribute('aria-pressed');
  b.click();
  const on = { pressed: b.getAttribute('aria-pressed'), text: b.textContent, saved: JSON.parse(localStorage.getItem('ckc_v1_vr') || 'null') };
  b.click();
  return { before, on, after: b.getAttribute('aria-pressed') };
});
record('жест V: отдельный opt-in переключатель сохраняется и выключается',
  gestureUi.before === 'false' && gestureUi.on.pressed === 'true' && gestureUi.on.saved.gestureZoom === true
    && gestureUi.after === 'false', gestureUi);
const driverUi = await page.evaluate(() => {
  const b = document.getElementById('vr-driver-gesture');
  b.click();
  const on = {
    pressed: b.getAttribute('aria-pressed'),
    saved: JSON.parse(localStorage.getItem('ckc_v1_vr') || 'null'),
    status: document.getElementById('vr-gesture-status').textContent,
  };
  document.getElementById('vr-driver-auto').click();
  return { on, after: b.getAttribute('aria-pressed') };
});
record('режим жестов вместо джойстика: 👍 газ + ✌️ zoom, Firebase не нужен',
  driverUi.on.pressed === 'true' && driverUi.on.saved.driverMode === 'gesture'
    && driverUi.on.saved.gestureZoom === true && /газ/.test(driverUi.on.status)
    && driverUi.after === 'false', driverUi);

// 1. синтетическая камера + старт поездки в режиме «По метке»
const boot = await page.evaluate(() => {
  const info = window.__TEST__.camEnableSynthetic();
  window.__TEST__.vrStart('camera', 30);
  window.__TEST__.step(1 / 60, 30, false);
  return { info, vr: window.__TEST__.vrInfo(), g: window.__TEST__.gameInfo() };
});
record('поездка в режиме «По метке» стартовала', boot.vr.active && boot.vr.lookMode === 'camera' && boot.g.state === 'racing', boot.vr);

// 2. метка по центру — взгляд вперёд
const center = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 6; i++) out = window.__TEST__.camFeed(160, 120, 40);
  window.__TEST__.step(1 / 60, 30, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка по центру: взгляд ≈ 0°', center.info.found && Math.abs(center.yaw) < 2.5, center);
record('диагностика цены обработки доступна (procMs/procW/ярус)', typeof center.info.procMs === 'number' && [160, 192, 256].includes(center.info.procW), center.info);

// 3. метка справа — взгляд поворачивается вправо за меткой
const right = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 8; i++) out = window.__TEST__.camFeed(227, 120, 40);
  window.__TEST__.step(1 / 60, 40, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка справа: VR-взгляд ушёл вправо (>10°)', right.info.yaw > 12 && right.yaw > 10, right);

// 3b. вертикаль: метка внизу кадра (голова поднята) — игра смотрит ВВЕРХ
const up = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 5; i++) out = window.__TEST__.camFeed(160, 190, 38);
  window.__TEST__.step(1 / 60, 35, false);
  return { pitch: window.__TEST__.vrInfo().pitchDeg, tp: out.info.pitch };
});
record('метка внизу кадра: pitch взгляда положительный (вверх)', up.tp > 12 && up.pitch > 9, up);
const down = await page.evaluate(() => {
  for (let i = 0; i < 5; i++) window.__TEST__.camFeed(160, 50, 38);
  window.__TEST__.step(1 / 60, 35, false);
  return { pitch: window.__TEST__.vrInfo().pitchDeg };
});
record('метка вверху кадра: pitch отрицательный (вниз)', down.pitch < -9, down);

// 4. метка слева — взгляд влево
const left = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 8; i++) out = window.__TEST__.camFeed(93, 120, 40);
  window.__TEST__.step(1 / 60, 40, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка слева: VR-взгляд ушёл влево (<-10°)', left.info.yaw < -12 && left.yaw < -10, left);

// 4b. метка ушла за правый край — взгляд удерживается повёрнутым
const hold = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 6; i++) out = window.__TEST__.camFeed(300, 120, 38);
  window.__TEST__.camFeedEmpty();
  window.__TEST__.step(1 / 60, 25, false);
  return { info: out.info, after: window.__TEST__.camInfo(), yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка ушла вправо: выход запомнен, взгляд удерживается (>20°)',
  hold.after.exitSideX === 'right' && hold.yaw > 20, hold);

// 4e. метка за краем: взгляд докручивается за удержанный угол
const creep = await page.evaluate(() => {
  window.__TEST__.camAgeLoss(900);
  window.__TEST__.camAgeLoss(900);
  window.__TEST__.step(1 / 60, 30, false);
  return { yaw: window.__TEST__.vrInfo().yawDeg };
});
record('потеря за краем 0,9 с: взгляд докручен дальше (>30°)', creep.yaw > 30, creep);

// 4c. метка вернулась в другом месте — переякорка по второму кадру
const snap = await page.evaluate(() => {
  window.__TEST__.camFeed(60, 55, 38);
  const out = window.__TEST__.camFeed(60, 55, 38);
  window.__TEST__.step(1 / 60, 30, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg, pitch: window.__TEST__.vrInfo().pitchDeg };
});
record('возврат метки слева-сверху: взгляд переякорен (<-12°)', snap.info.yaw < -18 && snap.yaw < -12, snap);

// 4d. долгая потеря — взгляд предсказуемо возвращается к центру
const home = await page.evaluate(() => {
  for (let i = 0; i < 30; i++) window.__TEST__.camAgeLoss(6000);
  window.__TEST__.step(1 / 60, 30, false);
  return { yaw: window.__TEST__.vrInfo().yawDeg };
});
record('6 с без метки: взгляд едет к центру', Math.abs(home.yaw) < 8, home);

// 5. метка пропала — поездка жива, взгляд не падает
const lost = await page.evaluate(() => {
  window.__TEST__.camFeedEmpty();
  window.__TEST__.step(1 / 60, 40, false);
  return { info: window.__TEST__.camInfo(), g: window.__TEST__.gameInfo(), vr: window.__TEST__.vrInfo() };
});
record('метка потеряна: заезд продолжается, стерео живо', !lost.info.found && lost.g.state === 'racing' && lost.vr.active, lost.g.state);

// 6. команда с джойстика: камера выключается и включается обратно
const tog = await page.evaluate(() => {
  const off = window.__TEST__.sendRemoteCommand('camToggle');
  const on = window.__TEST__.sendRemoteCommand('camToggle');
  return { off: off.cam, on: on.cam };
});
record('команда camToggle: состояние камеры переключается', tog.off.on === false && tog.on.on === true, tog);

// 7. состояние для джойстика публикуется с полем cam
const st = await page.evaluate(() => window.__TEST__.remoteState());
record('remoteState содержит cam {on, found, yaw}', !!st.cam && st.cam.on === true && typeof st.cam.yaw === 'number', st.cam);

// 8. воркер-конвейер доступен; настоящий ImageBitmap ведёт взгляд
const bmp = await page.evaluate(async () => {
  let out;
  for (let i = 0; i < 6; i++) out = await window.__TEST__.camFeedBitmap(227, 120, 40);
  window.__TEST__.step(1 / 60, 40, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('ImageBitmap с меткой: взгляд вправо, воркер доступен',
  bmp.info.workerAvailable === true && bmp.info.yaw > 12 && bmp.yaw > 9, bmp);

// 9. подрежим двух меток: пара задаёт прямой, одна оставшаяся продолжает вести
const dual = await page.evaluate(() => {
  window.__TEST__.camEnableDualSynthetic();
  window.__TEST__.vrStart('camera-dual', 30, true);
  const straight = window.__TEST__.camFeedDual(82, 120, 238, 120, 26);
  const calibrated = window.__TEST__.camCalibrateDual();
  const shifted = window.__TEST__.camFeedDual(112, 120, 268, 120, 26);
  const one = window.__TEST__.camFeedDual(112, 120, null, null, 26);
  const none = window.__TEST__.camFeedDual(null, null, null, null, 26);
  return { straight: straight.info, calibrated, shifted: shifted.info, one: one.info, none: none.info };
});
record('две метки: симметричная пара калибрует прямой (0°)',
  dual.straight.dual && dual.calibrated.ok && dual.calibrated.info.dualCalibrated && Math.abs(dual.straight.yaw) < 2, dual);
record('две метки: смещение пары даёт новый угол', dual.shifted.dualVisible.length === 2 && dual.shifted.yaw > 5, dual.shifted);
record('две метки: при потере правой левая продолжает вести',
  dual.one.dualVisible.length === 1 && dual.one.dualVisible[0] === 'left' && dual.one.lastLostMarker === 'right', dual.one);
record('две метки: при потере обеих сохраняется последний угол',
  !dual.none.found && dual.none.heldYaw === dual.one.yaw, dual.none);

// 9b. пространственная модель пары. Геометрия кадра: 320×240, FOV 65°,
// калибровка даёт левой -17.3° и правой +17.3° (расстояние 34.6° — инвариант).
// Все повороты подаются с реальным темпом кадров (~90 мс), иначе оценка
// скорости головы в трекере превращается в мусор.
const PACE_MS = 90;
const spatial = await page.evaluate(async (PACE_MS) => {
  const pace = () => new Promise((r) => setTimeout(r, PACE_MS));
  const T = window.__TEST__;
  const at = (deg) => 160 + 251.1 * Math.tan((deg * Math.PI) / 180); // u для «сырого» угла метки
  T.camEnableDualSynthetic();
  T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82, 120, 238, 120, 26);
  const cal = T.camCalibrateDual().ok;
  const out = {};
  // ±5°: обе метки обязаны быть в кадре, ни одна не «уходит»
  const pair = (theta) => T.camFeedDual(Math.round(at(theta - 17.3)), 120, Math.round(at(theta + 17.3)), 120, 26).info;
  for (const th of [2, 4, 5, 5]) { pair(th); await pace(); }
  out.plus5 = T.camInfo();
  for (const th of [0, -3, -5, -5]) { pair(th); await pace(); }
  out.minus5 = T.camInfo();
  // мягкий поворот ~8°: обе метки ещё ожидаются в кадре, но «правая» находится
  // ЛЕВЕЕ оранжевой метки — порядок нарушен, это чужой предмет
  for (const th of [6, 7, 8, 8]) { pair(th); await pace(); }
  out.mild = T.camInfo();
  const alienNear = T.camFeedDual(119, 120, 100, 120, 26);
  out.alienNear = alienNear.info;
  out.alienNearOld = ((alienNear.info.dualDeltas[0].deltaYaw + alienNear.info.dualDeltas[1].deltaYaw) / 2);
  // дальний поворот ~35°: правая метка физически за краем кадра,
  // у правого края уже левая — всё «малиновое» тут невозможно
  for (let th = 12; th <= 35; th += 3) { T.camFeedDual(Math.round(at(th - 17.3)), 120, null, null, 26); await pace(); }
  out.far = T.camInfo();
  const alienFar = T.camFeedDual(Math.round(at(35 - 17.3)), 120, 200, 120, 26);
  out.alienFar = alienFar.info;
  out.alienFarOld = ((alienFar.info.dualDeltas[0].deltaYaw + alienFar.info.dualDeltas[1].deltaYaw) / 2);
  out.alienFar2 = T.camFeedDual(Math.round(at(35 - 17.3)), 120, 200, 120, 26).info;
  // скорость головы: ровный поворот 2° за кадр ≈ 22 °/с
  const t0 = Date.now();
  const y0 = T.camInfo().yaw;
  for (let k = 1; k <= 6; k++) { T.camFeedDual(Math.round(at(35 + 2 * k - 17.3)), 120, null, null, 26); await pace(); }
  out.rate = T.camInfo();
  out.rateExpected = (out.rate.yaw - y0) / ((Date.now() - t0) / 1000);
  return { cal, ...out };
}, PACE_MS);

record('пространство: при взгляде ±5° обе метки в кадре, ни одна не теряется',
  spatial.plus5.dualVisible.length === 2 && spatial.minus5.dualVisible.length === 2
    && spatial.plus5.dualUsed.length === 2
    && spatial.plus5.dualDeltas.every((d) => d.expected)
    && spatial.plus5.dualMissing.left === 0 && spatial.plus5.dualMissing.right === 0
    && Math.abs(spatial.plus5.yaw - 5) < 2 && Math.abs(spatial.minus5.yaw + 5) < 2,
  { plus5: { yaw: spatial.plus5.yaw, visible: spatial.plus5.dualVisible, used: spatial.plus5.dualUsed,
    missing: spatial.plus5.dualMissing, expected: spatial.plus5.dualDeltas.map((d) => d.expected) },
    minus5: { yaw: spatial.minus5.yaw, visible: spatial.minus5.dualVisible, missing: spatial.minus5.dualMissing } });

record('пространство: малиновое левее оранжевой метки — чужой предмет (порядок и расстояние)',
  spatial.alienNear.dualUsed.length === 1 && spatial.alienNear.dualUsed[0] === 'left'
    && Math.abs(spatial.alienNear.yaw - spatial.mild.yaw) < 3
    && Math.abs(spatial.alienNear.yaw - spatial.alienNearOld) > 8,
  { честный_угол: spatial.mild.yaw, стало: spatial.alienNear.yaw, старое_среднее: +spatial.alienNearOld.toFixed(1),
    состояние: spatial.alienNear.pairState, в_счёт: spatial.alienNear.dualUsed, доверие: spatial.alienNear.dualTrust });

record('пространство: оттенок, которого нет в кадре, игнорируется целиком',
  spatial.alienFar.dualDeltas[1].expected === false
    && spatial.alienFar.dualUsed.join('+') === 'left'
    && Math.abs(spatial.alienFar.yaw - spatial.alienFar.dualDeltas[0].deltaYaw) < 1.5
    && Math.abs(spatial.alienFar.yaw - spatial.alienFarOld) > 8
    && spatial.alienFar2.yaw === spatial.alienFar.yaw,
  { поворот_без_правой: spatial.far.yaw, дельты_чёжого_кадра: spatial.alienFar.dualDeltas,
    в_счёт: spatial.alienFar.dualUsed, стало: spatial.alienFar.yaw, старое_среднее: +spatial.alienFarOld.toFixed(1),
    состояние: spatial.alienFar.pairState, кадр_спустя: spatial.alienFar2.yaw });

record('скорость: голова едет ровно ~22°/с — трекер оценивает её по последним секундам',
  Math.abs(spatial.rateExpected - 22) < 18 && spatial.rate.yawRate > 8 && spatial.rate.yawRate < 90,
  { ожидалось: +spatial.rateExpected.toFixed(0), оценка: spatial.rate.yawRate, история: '2.5 с' });

// 9c. мусорное пятно (блик/огрызок) не считается меткой вовсе.
const tinyBlob = await page.evaluate((PACE_MS) => {
  const T = window.__TEST__;
  T.camEnableDualSynthetic();
  T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82, 120, 238, 120, 26);
  T.camCalibrateDual();
  const before = T.camInfo();
  // малиновая «метка» на своём законном месте, но пятно в 20 раз меньше
  const small = T.camFeedDual(null, null, 247, 120, 6);
  const small2 = T.camFeedDual(null, null, 247, 120, 6);
  const big = T.camFeedDual(null, null, 247, 120, 26);
  return { before, small: small.info, small2: small2.info, big: big.info };
}, PACE_MS);
record('пространство: мелкое пятно игнорируется, крупное ведёт',
  !tinyBlob.small.found && tinyBlob.small.pairState === 'tiny' && tinyBlob.small.yaw === tinyBlob.before.yaw
    && tinyBlob.small2.pairState === 'tiny'
    && tinyBlob.big.found && tinyBlob.big.dualUsed.join('+') === 'right',
  { было: tinyBlob.before.yaw, мелкое: { state: tinyBlob.small.pairState, found: tinyBlob.small.found, yaw: tinyBlob.small.yaw, count: tinyBlob.small.markers[1].count },
    крупное: { state: tinyBlob.big.pairState, found: tinyBlob.big.found, yaw: tinyBlob.big.yaw, used: tinyBlob.big.dualUsed } });

// 9d. одиночная метка не прыгает мгновенно; после долгой потери угол
// принимается только вторым согласным кадром.
const jump = await page.evaluate(async (PACE_MS) => {
  const pace = () => new Promise((r) => setTimeout(r, PACE_MS));
  const T = window.__TEST__;
  const at = (deg) => Math.round(160 + 251.1 * Math.tan((deg * Math.PI) / 180));
  T.camEnableDualSynthetic();
  T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82, 120, 238, 120, 26);
  T.camCalibrateDual();
  // немного поездить ровно, чтобы история скорости набралась
  for (let th = 3; th <= 12; th += 3) { T.camFeedDual(at(th - 17.3), 120, null, null, 26); await pace(); }
  const steady = T.camInfo();
  const instant = T.camFeedDual(at(45 - 17.3), 120, null, null, 26).info;  // скачок в один кадр
  T.camAgeLoss(1500);                                                      // метки не было 1,5 с
  const first = T.camFeedDual(at(45 - 17.3), 120, null, null, 26).info;     // первый кадр возврата
  const second = T.camFeedDual(at(45 - 17.3), 120, null, null, 26).info;    // подтверждающий кадр
  return { steady, instant, first, second };
}, PACE_MS);
record('пространство: мгновенный скачок одиночной метки не принимается',
  jump.steady.found && !jump.instant.found && jump.instant.yaw === jump.steady.yaw,
  { ровно: jump.steady.yaw, скачок: { yaw: jump.instant.yaw, state: jump.instant.pairState, found: jump.instant.found } });
record('пространство: скачок принимается, когда его подтверждает второй кадр',
  !jump.instant.found && jump.first.found && jump.second.found
    && Math.abs(jump.first.yaw - jump.second.yaw) < 3 && jump.first.yaw > 35,
  { первый_кадр: { found: jump.instant.found, state: jump.instant.pairState, yaw: jump.instant.yaw },
    второй_кадр: { found: jump.first.found, yaw: jump.first.yaw, state: jump.first.pairState },
    третий_кадр: { found: jump.second.found, yaw: jump.second.yaw } });

// 9e. взгляд не встаёт колом: пока метки нет, он продолжает движение со
// скоростью, с которой голова ехала последние секунды (а не 12°/с из контракта).
const coast = await page.evaluate(async (PACE_MS) => {
  const pace = () => new Promise((r) => setTimeout(r, PACE_MS));
  const T = window.__TEST__;
  const at = (deg) => Math.round(160 + 251.1 * Math.tan((deg * Math.PI) / 180));
  T.camEnableDualSynthetic();
  T.vrStart('camera-dual', 30, true);
  T.camFeedDual(82, 120, 238, 120, 26);
  T.camCalibrateDual();
  for (let th = 4; th <= 44; th += 4) { T.camFeedDual(at(th - 17.3), 120, null, null, 26); await pace(); }
  const before = { info: T.camInfo(), look: T.camLook(), rate: T.camInfo().yawRate };
  T.camFeedDual(null, null, null, null, 26);   // обе метки пропали
  const gone = T.camInfo();                    // кадр потери: какой край запомнили
  await pace(); await pace(); await pace(); await pace(); await pace();
  await new Promise((r) => setTimeout(r, 450));
  T.step(1 / 60, 4, false);                    // дать игровому кадру обработать потерю
  const after = { info: T.camInfo(), look: T.camLook() };
  return { before, gone, after };
}, PACE_MS);
record('скорость: при потере меток взгляд продолжает движение со скоростью поворота',
  coast.gone.exitSideX === 'right' && coast.before.rate > 10
    && coast.after.look.yaw > coast.before.info.heldYaw + 2 && coast.after.look.wasLost === true,
  { скорость_перед_потерей: coast.before.rate, держал: +coast.before.info.heldYaw.toFixed(1),
    за_краем: coast.gone.exitSideX, цель_через_полсекунды: +coast.after.look.yaw.toFixed(1),
    потерян_мс: coast.after.look.lastFoundAgoMs });

// 10. V-жест: тот же analyzer, temporal debounce, 6× ceiling, fast release.
const gesture = await page.evaluate(() => {
  const on1 = window.__TEST__.gestureFeed(true);
  const on2 = window.__TEST__.gestureFeed(true);
  window.__TEST__.step(1 / 60, 70, false);
  const held = window.__TEST__.vrInfo();
  const off1 = window.__TEST__.gestureFeed(false);
  const off2 = window.__TEST__.gestureFeed(false);
  window.__TEST__.step(1 / 60, 30, false);
  const released = window.__TEST__.vrInfo();
  return { on1, on2, held, off1, off2, released };
});
record('жест V: silhouette найден, включение требует два кадра',
  gesture.on1.result.gesture.found && gesture.on2.info.gestureV === true && gesture.on2.info.gestureFresh === true, gesture.on2.info);
record('жест V: VR-only zoom плавно доходит почти до 6× и гасит shake',
  gesture.held.gestureZoom && gesture.held.zoomFactor > 5.5 && gesture.held.zoomFactor <= 6
    && gesture.held.zoomShakeFactor < 0.5 && gesture.held.zoomLookGain < 1, gesture.held);
record('жест V: два плохих кадра отключают zoom, возврат быстрее набора',
  gesture.off1.result.gesture.found === false && gesture.off2.info.gestureV === false
    && gesture.released.zoomActive === false && gesture.released.zoomFactor < 1.5, gesture.released);

// 11. thumbs-up gas: no steering, no remote input, fail-stop on missing thumb.
const thumb = await page.evaluate(() => {
  const on1 = window.__TEST__.gestureThumbFeed(true);
  const on2 = window.__TEST__.gestureThumbFeed(true);
  window.__TEST__.step(1 / 60, 45, false);
  const driving = { vr: window.__TEST__.vrInfo(), game: window.__TEST__.gameInfo(), state: window.__TEST__.remoteState() };
  const off1 = window.__TEST__.gestureThumbFeed(false);
  const off2 = window.__TEST__.gestureThumbFeed(false);
  window.__TEST__.step(1 / 60, 30, false);
  const stopped = { vr: window.__TEST__.vrInfo(), game: window.__TEST__.gameInfo() };
  return { on1, on2, driving, off1, off2, stopped };
});
record('thumbs-up: детектор и debounce включают газ, V остаётся отдельным',
  thumb.on1.result.gesture.thumb.found && thumb.on2.info.thumbUp === true
    && thumb.on2.info.gestureV === false && thumb.driving.game.driverMode === 'gesture'
    && thumb.driving.state.cam.gestureDrive === true && thumb.driving.state.cam.gesture === false
    && thumb.driving.game.remote === null, thumb.driving);
record('thumbs-up: большой палец пропал — throttle 0 и машина останавливается',
  thumb.off1.result.gesture.thumb.found === false && thumb.off2.info.thumbUp === false
    && thumb.stopped.game.thumbUp === false && thumb.stopped.game.speedKmh < 10, thumb.stopped);

record('ошибок на странице нет', errors.length === 0, errors);

const failed = results.filter((r) => !r.pass);
console.log(`\nCAMQA: ${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
