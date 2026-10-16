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

record('ошибок на странице нет', errors.length === 0, errors);

const failed = results.filter((r) => !r.pass);
console.log(`\nCAMQA: ${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
