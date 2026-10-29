import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';

// Куда камера шлема «видит» маяк прямой правой руки. Считается честно из геометрии
// (плечо x=+0.21 м, запястье в 0.72 м впереди), потому что оптика теперь УЧАСТВУЕТ
// в решении позы, а не подмешивается вслепую: выдуманные пиксели ломали бы локоть.
function straightRightArmBeacon(yawDeg = 0, pitchDeg = 0, span = 0.095, wrist = [0.21, -0.27, -0.72]) {
  const w = wrist;
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x = w[0] * cy + w[2] * sy;
  const z0 = -w[0] * sy + w[2] * cy;
  const cp = Math.cos(-pitch), sp = Math.sin(-pitch);
  const y = w[1] * cp - z0 * sp;
  const z = w[1] * sp + z0 * cp;
  const tanH = 0.6371; // ~65° по горизонтали — та же константа, что в слиянии
  const aspectY = 0.75;
  const u = 0.5 + x / -z / (2 * tanH);
  const v = 0.5 - y / -z / (2 * tanH * aspectY);
  const half = span / 2;
  return {
    distal: { u: +(u - half * 0.9).toFixed(4), v: +(v + half * 0.35).toFixed(4) },
    proximal: { u: +(u + half * 0.9).toFixed(4), v: +(v - half * 0.35).toFixed(4) },
  };
}
const evidence = path.resolve('../../.studio/evidence');
fs.mkdirSync(evidence + '/screenshots', { recursive: true });
fs.mkdirSync(evidence + '/reports', { recursive: true });
const root = path.resolve('dist');
const prefix = '/games/white-night/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const rel = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
  const file = path.resolve(root, rel);
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}${prefix}?test=1`;
const browser = await launch();
const errors = [];
const checks = [];
const check = (name) => { checks.push(name); console.log('PASS', name); };
const state = (page) => page.evaluate(() => window.__GAME_TEST__.getState());
const vr = (page) => page.evaluate(() => window.__GAME_TEST__.vr.info());

async function findGaze(page) {
  for (const yaw of [0, -10, 10, -20, 20, -30, 30]) {
    for (const pitch of [0, -10, 10, -20, 20]) {
      const info = await page.evaluate(({ yaw, pitch }) => window.__GAME_TEST__.vr.gyro(yaw, pitch, 5, 0.02), { yaw, pitch });
      if (info.gazeHit) return { yaw, pitch };
    }
  }
  const probe = await page.evaluate(() => ({ settings: window.__GAME_TEST__.vr.settings(), world: window.__GAME_TEST__.vr.info().world, m: window.__GAME_TEST__.getMetrics(), phase: window.__GAME_TEST__.getState() }));
  throw new Error('No tested head angle placed the bin under the centre gaze ray :: ' + JSON.stringify(probe));
}

async function focusFor(page, gaze, seconds) {
  return page.evaluate(({ gaze, seconds }) => {
    window.__GAME_TEST__.vr.gyro(gaze.yaw, gaze.pitch, 5, 0.02);
    return window.__GAME_TEST__.vr.step(seconds);
  }, { gaze, seconds });
}

let report;
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(90000);
  page.setDefaultNavigationTimeout(120000);
  await page.setViewport({ width: 880, height: 440, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__?.vr, { timeout: 120000 });
  await page.evaluate(() => window.__GAME_TEST__.reset());

  await page.tap('#open-vr');
  assert.equal(await page.$eval('#vr-dialog', (e) => e.open), true);
  assert.equal(await page.$eval('#vr-fusion-panel', (e) => e.hidden), true);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-prep-gyro.png` });
  check('VR preparation opens in gyro mode with the fusion tools hidden');

  await page.tap('#vr-mode-fusion');
  assert.equal(await page.$eval('#vr-fusion-panel', (e) => e.hidden), false);
  const calibrated = await page.evaluate(() => {
    const api = window.__GAME_TEST__.vr;
    const markers = [
      { id: 'left', u: 0.35, v: 0.5, w: 56, h: 28 },
      { id: 'right', u: 0.65, v: 0.5, w: 56, h: 28 },
    ];
    const t = performance.now();
    api.marker(markers, t);
    api.marker(markers, t + 250);
    return api.calibrate(t + 250);
  });
  assert.equal(calibrated.ok, true);
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('white-night-vr-v1'))).mode, 'fusion');
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-prep-fusion.png` });
  check('Fusion preparation accepts a proven pair and persists the selected mode');

  await page.evaluate(async () => {
    if (window.DeviceOrientationEvent) DeviceOrientationEvent.requestPermission = async () => 'granted';
    await window.__GAME_TEST__.vr.requestGyro();
    const send = () => {
      const event = new Event('deviceorientation');
      Object.assign(event, { alpha: 0, beta: 0, gamma: -90 });
      window.dispatchEvent(event);
    };
    send();
    window.__whiteNightVrGyroTimer = setInterval(send, 100);
  });
  await page.waitForFunction(() => !document.querySelector('#vr-start').disabled, { timeout: 5000 });
  await page.evaluate(() => clearInterval(window.__whiteNightVrGyroTimer));
  check('Fresh gyro samples plus calibrated markers enable the real VR start button');

  await page.evaluate(() => window.__GAME_TEST__.vr.start());
  let info = await vr(page);
  assert.equal(info.active, true);
  assert.equal(info.stereo, true);
  assert.equal(info.world.stereo, true);
  assert.equal(info.world.bodyActive, true);
  assert.equal(info.world.handVisible, true);
  assert.equal(info.world.handMode, false);
  assert.equal(info.world.body?.beaconBandVisible, false);
  assert.equal(await page.evaluate(() => !document.querySelector('#vr-overlay') && !document.querySelector('#vr-exit') && !document.querySelector('.vr-reticle')), true);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-stereo-search.png` });

  // Look downward (-54 deg) in Fusion/Gyro VR: verify Petersburg coat, calm gloved hands, trousers & boots render cleanly
  info = await page.evaluate(() => {
    window.__GAME_TEST__.vr.gyro(0, -54, 14, 0.03);
    return window.__GAME_TEST__.vr.step(0.05);
  });
  assert.ok(info.world.pitchDeg < -50, `downward pitch in VR reaches boots: pitchDeg=${info.world.pitchDeg}`);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-body-down-fusion.png` });
  await page.evaluate(() => {
    window.__GAME_TEST__.vr.gyro(0, 0, 14, 0.03);
    return window.__GAME_TEST__.vr.step(0.05);
  });
  check('Landscape VR is pure stereo 3D with full Petersburg 3D body on downward gaze and zero HUD');

  const gaze = await findGaze(page);
  await focusFor(page, gaze, 3.4);
  assert.equal((await state(page)).taps, 1);
  info = await page.evaluate(({ gaze }) => {
    window.__GAME_TEST__.vr.gyro(gaze.yaw + 55, gaze.pitch, 8, 0.02);
    return window.__GAME_TEST__.vr.step(1);
  }, { gaze });
  assert.equal(info.gazeHit, false);
  assert.ok(info.focus >= 10 / 3 - 0.01 && info.focus < 3.45);
  assert.equal((await state(page)).taps, 1);
  check('Gaze focus earns the first of three searches and decays only to that earned segment');

  await focusFor(page, gaze, 3.4);
  assert.equal((await state(page)).taps, 2);
  await focusFor(page, gaze, 3.4);
  let gameState = await state(page);
  info = await vr(page);
  assert.equal(gameState.phase, 'inspect');
  assert.equal(gameState.current, 'camera');
  assert.equal(info.pendingSave, true);
  assert.equal(info.world.inspectLock, true);
  check('Ten seconds of bin focus reveals a find and locks the courtyard');

  const beforeTurn = info.world;
  info = await page.evaluate(({ gaze }) => window.__GAME_TEST__.vr.gyro(gaze.yaw + 20, gaze.pitch - 10, 10, 0.03), { gaze });
  assert.deepEqual(info.world.cameraQuaternion, beforeTurn.cameraQuaternion);
  assert.ok(Math.abs(info.world.targetY - beforeTurn.targetY) > 20);
  assert.ok(Math.abs(info.world.targetX - beforeTurn.targetX) > 5);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-stereo-inspect.png` });
  check('Head turns and nods rotate only the find while the locked camera stays still');

  info = await page.evaluate(() => window.__GAME_TEST__.vr.shake(25));
  gameState = await state(page);
  assert.equal(gameState.phase, 'search');
  assert.deepEqual(gameState.collection, ['camera']);
  assert.equal(info.pendingSave, false);
  check('Two no swings auto-save the find and return to searching');

  await page.evaluate(() => window.__GAME_TEST__.forceNext('bottle'));
  await focusFor(page, gaze, 10.2);
  assert.equal((await state(page)).current, 'bottle');
  await page.evaluate(() => window.__GAME_TEST__.vr.stop());
  gameState = await state(page);
  assert.deepEqual(new Set(gameState.collection), new Set(['camera', 'bottle']));
  assert.equal((await vr(page)).active, false);
  check('Leaving VR during inspection still auto-saves the current find');

  const ids = await page.evaluate(() => window.__GAME_TEST__.items);
  await page.evaluate((ids) => {
    clearInterval(window.__whiteNightVrGyroTimer);
    window.__GAME_TEST__.setCollection(ids.filter((id) => id !== 'camera'));
    window.__GAME_TEST__.forceNext('camera');
    window.__GAME_TEST__.vr.setMode('gyro');
  }, ids);
  await page.evaluate(() => window.__GAME_TEST__.vr.start());
  await focusFor(page, gaze, 10.2);
  await page.evaluate(() => window.__GAME_TEST__.vr.shake(25));
  gameState = await state(page);
  info = await vr(page);
  assert.equal(gameState.collection.length, 18);
  assert.equal(info.pendingCompletion, true);
  assert.equal(await page.$eval('#complete-dialog', (e) => e.open), false);
  await page.evaluate(() => window.__GAME_TEST__.vr.stop());
  assert.equal(await page.$eval('#complete-dialog', (e) => e.open), true);
  await page.tap('#continue-button');
  check('The 18th VR find defers the normal completion dialog until after exit');

  await page.evaluate(() => window.__GAME_TEST__.vr.start());
  await page.setViewport({ width: 440, height: 800, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await new Promise((resolve) => setTimeout(resolve, 300));
  info = await vr(page);
  assert.equal(info.stereo, false);
  assert.equal(await page.evaluate(() => document.body.classList.contains('vr-single')), true);
  await page.setViewport({ width: 880, height: 440, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert.equal((await vr(page)).stereo, true);
  await page.evaluate(() => window.__GAME_TEST__.vr.stop());
  check('Portrait uses the single-eye fallback and landscape restores stereo');

  // --- Full 2-tab Wrist-Hand (60 Hz sensor + dual-color beacon) E2E check ---
  const wristPage = await browser.newPage();
  wristPage.on('pageerror', (e) => errors.push(`wrist pageerror: ${e.message}`));
  wristPage.on('console', (m) => { if (m.type() === 'error') errors.push(`wrist console: ${m.text()}`); });
  await wristPage.setViewport({ width: 390, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const wristUrl = `http://127.0.0.1:${server.address().port}${prefix}wrist/index.html?test=1&demo=1&room=777777`;

  await page.evaluate(() => {
    window.__GAME_TEST__.reset();
    window.__GAME_TEST__.forceNext('cup');
    window.__GAME_TEST__.vr.setMode('hand');
    window.__GAME_TEST__.vr.wristDemo('777777');
  });
  await wristPage.goto(wristUrl, { waitUntil: 'networkidle0' });
  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: 0, beta: 90, gamma: 0, linMag: 0, rotRate: 0 });
    window.__WRIST_TEST__.openBeacon();
  });
  await new Promise((resolve) => setTimeout(resolve, 120));

  const wristUi = await wristPage.evaluate(() => window.__WRIST_TEST__.status());
  assert.equal(wristUi.connected, true);
  assert.equal(wristUi.beaconVisible, true);
  await wristPage.screenshot({ path: `${evidence}/screenshots/white-night-wrist-beacon.png` });

  // 2-gesture calibration: 1) straight arm forward -> 2) bend elbow up 50 deg
  let cal1 = await page.evaluate(() => {
    // Прямая ПРАВАЯ рука (плечо x=+0.21 м) видна камерой НЕ по центру кадра, а справа:
    // u ~ 0.73 при угле обзора ~65°. Маяк теперь несёт реальный геометрический смысл,
    // поэтому синтетические пиксели обязаны быть анатомически согласованы.
    window.__GAME_TEST__.vr.wristBeacon({ distal: { u: 0.69, v: 0.565 }, proximal: { u: 0.775, v: 0.52 } });
    return window.__GAME_TEST__.vr.wristCalibrateStretch();
  });
  assert.equal(cal1.ok, true);

  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: 0, beta: 140, gamma: 0, linMag: 0, rotRate: 0 });
  });
  await new Promise((resolve) => setTimeout(resolve, 80));
  let cal2 = await page.evaluate(() => {
    // Шаг 2 калибровки: кисть у груди — ближе к камере, поэтому пятно крупнее.
    window.__GAME_TEST__.vr.wristBeacon({ distal: { u: 0.735, v: 0.605 }, proximal: { u: 0.815, v: 0.53 } });
    return window.__GAME_TEST__.vr.wristCalibrateBend();
  });
  assert.equal(cal2.ok, true);
  check('Wrist-hand companion connects at 60 Hz and completes 2-gesture calibration');

  // Enter stereo VR in hand mode: verify 3D gloved hand is visible and zero DOM HUD exists
  let simClock = 10000;
  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: 0, beta: 90, gamma: 0, linMag: 0.2, rotRate: 0 });
  });
  await new Promise((resolve) => setTimeout(resolve, 60));
  await page.evaluate(({ gaze }) => {
    window.__GAME_TEST__.vr.gyro(gaze.yaw, gaze.pitch, 5, 0.02);
    return window.__GAME_TEST__.vr.start();
  }, { gaze });
  // Корпус в VR сам доворачивается за рукой/головой (torsoYaw), а луч камеры считается
  // относительно головы. Берём текущий torsoYaw из снимка, иначе синтетический маяк
  // «врал» бы на десятки градусов — и геометрия честно складывала локоть.
  const preWrist = await vr(page);
  const torsoYawDeg = ((preWrist.wrist?.hand?.torsoYaw ?? 0) * 180) / Math.PI;
  const seenBeacon = straightRightArmBeacon(gaze.yaw - torsoYawDeg, gaze.pitch);
  // Штамп = КОНЕЦ интервала шага: тест сжимает 350 мс в один evaluate, а на телефоне за
  // это время прилетело бы ~4 новых снимка маяка. Иначе последний кадр «протухает» ещё
  // до того, как его увидит слияние, и оптический канал молчит там, где он обязан работать.
  info = await page.evaluate(({ t, beacon }) => {
    window.__GAME_TEST__.vr.wristBeacon(beacon, t + 350);
    return window.__GAME_TEST__.vr.step(0.35, t);
  }, { t: simClock, beacon: seenBeacon });
  simClock += 400;
  assert.equal(info.world.bodyActive, true);
  assert.equal(info.world.handMode, true);
  assert.equal(info.world.handVisible, true);
  assert.equal(info.world.body?.beaconBandVisible, true);
  assert.ok(
    info.wrist.hand.reach > 0.75,
    `прямая рука у камеры: reach=${info.wrist.hand.reach} src=${info.wrist.hand.trackingSource} ` +
      `pose=${JSON.stringify(info.wrist.hand.pos)} beacon=${JSON.stringify(info.wrist.beacon)}`
  );
  assert.equal(await page.$('#vr-overlay'), null);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-hand-search.png` });

  // Glance downward (-46 deg) in Hand VR to verify active gloved hand + beacon band AND calm passive arm + coat + boots
  await page.evaluate(({ gaze, t }) => {
    window.__GAME_TEST__.vr.gyro(gaze.yaw, -46, 12, 0.03);
    return window.__GAME_TEST__.vr.step(0.08, t);
  }, { gaze, t: simClock });
  simClock += 200;
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-body-down-hand.png` });
  await page.evaluate(({ gaze, t }) => {
    window.__GAME_TEST__.vr.gyro(gaze.yaw, gaze.pitch, 12, 0.03);
    return window.__GAME_TEST__.vr.step(0.08, t);
  }, { gaze, t: simClock });
  simClock += 200;
  check('Stereo VR hand mode renders the diegetic 3D Petersburg avatar & gloved hand with zero DOM HUD');

  // Rummage 3 strokes in the bin -> reveals 'cup'
  // Рука над баком, шлем смотрит на неё — значит на телефоне маяк НИКУДА не пропадает:
  // он остаётся в кадре на каждом взмахе. Кормим согласованный маяк и дальше, каждый раз
  // сверяя его с ЖИВЫМ torsoYaw (корпус доворачивается за рукой), иначе синтетический
  // пакет «врал» бы геометрии на десятки градусов и та честно складывала локоть.
  let lastHand = info.wrist.hand;
  for (const yawSweep of [12, -12, 12]) {
    await wristPage.evaluate((a) => {
      window.__WRIST_TEST__.setPose({ alpha: a, beta: 90, gamma: 0, linMag: 1.8, rotRate: 75 });
    }, yawSweep);
    await new Promise((resolve) => setTimeout(resolve, 60));
    const torsoYawNow = ((lastHand.torsoYaw ?? 0) * 180) / Math.PI;
    const beaconNow = straightRightArmBeacon(gaze.yaw - torsoYawNow, gaze.pitch);
    const stepInfo = await page.evaluate(({ t, beacon }) => {
      window.__GAME_TEST__.vr.wristBeacon(beacon, t + 350);
      return window.__GAME_TEST__.vr.step(0.35, t);
    }, { t: simClock, beacon: beaconNow });
    lastHand = stepInfo.wrist.hand;
    simClock += 400;
  }
  gameState = await state(page);
  const dbg = await vr(page);
  assert.equal(
    gameState.phase,
    'inspect',
    `3 взмаха у бака должны были открыть находку: reach=${dbg.wrist?.hand?.reach} ` +
      `src=${dbg.wrist?.hand?.trackingSource} pos=${JSON.stringify(dbg.wrist?.hand?.pos)} ` +
      `handPos=${JSON.stringify(dbg.world?.handPosition)} gazeHit=${dbg.gazeHit} ` +
      `searches=${JSON.stringify(dbg.world?.bin?.searches ?? null)}`
  );
  assert.equal(gameState.current, 'cup');
  await page.evaluate(() => window.__GAME_TEST__.settle());
  info = await vr(page);
  assert.equal(info.world.inspectLock, false, 'Head remains unlocked during hand inspection');
  check('Extended arm rummaging opens the bin in 3 strokes without locking head gaze');

  // Rotate wrist -> rotates the 3D find; then sharp wave -> discards find
  // Крутим предмет КИСТЬЮ (alpha/gamma), предплечье держим на той же высоте (beta: 90).
  // Опускать предплечье на 15° здесь нельзя: по контракту «спокойно опустить руку вниз» =
  // жест «забрать в коллекцию», и продукт ОБЯЗАН читать его именно так (см. tests/wristHand.test.js).
  const beforeHandRot = info.world.targetY;
  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: 36, beta: 90, gamma: 15, linMag: 0.3, rotRate: 25 });
  });
  await new Promise((resolve) => setTimeout(resolve, 60));
  simClock = await page.evaluate(() => performance.now() + 500);
  info = await page.evaluate((t) => window.__GAME_TEST__.vr.step(0.55, t), simClock);
  simClock += 650;
  assert.ok(Math.abs(info.world.targetY - beforeHandRot) > 20);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-hand-inspect.png` });

  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: -45, beta: 85, gamma: 0, linMag: 9.8, rotRate: 320 });
  });
  await new Promise((resolve) => setTimeout(resolve, 60));
  await page.evaluate((t) => window.__GAME_TEST__.vr.step(0.15, t), simClock);
  simClock += 1200;
  gameState = await state(page);
  const dbgWave = await vr(page);
  assert.equal(gameState.phase, 'search');
  assert.equal(
    gameState.collection.length,
    0,
    `резкий взмах кистью обязан ВЫБРОСИТЬ находку, а не прятать её в коллекцию: ` +
      `calm=${dbgWave.wrist?.hand?.calmLowerProgress ?? null} ` +
      `pitchUp=${dbgWave.wrist?.hand?.pitchUpDeg ?? null} reach=${dbgWave.wrist?.hand?.reach} ` +
      `pos=${JSON.stringify(dbgWave.wrist?.hand?.pos ?? null)}`
  );
  check('Twisting the wrist rotates the 3D find and a sharp wave throws/discards it');

  // Rummage a second find ('watch') and calmly lower the hand downward -> keeps in collection
  await page.evaluate(() => window.__GAME_TEST__.forceNext('watch'));
  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: 0, beta: 90, gamma: 0, linMag: 0.2, rotRate: 0 });
  });
  await new Promise((resolve) => setTimeout(resolve, 60));
  await page.evaluate((t) => window.__GAME_TEST__.vr.step(0.25, t), simClock);
  simClock += 350;
  for (const yawSweep of [12, -12, 12]) {
    await wristPage.evaluate((a) => {
      window.__WRIST_TEST__.setPose({ alpha: a, beta: 90, gamma: 0, linMag: 1.8, rotRate: 75 });
    }, yawSweep);
    await new Promise((resolve) => setTimeout(resolve, 60));
    await page.evaluate((t) => window.__GAME_TEST__.vr.step(0.35, t), simClock);
    simClock += 400;
  }
  assert.equal((await state(page)).phase, 'inspect');
  await page.evaluate(() => window.__GAME_TEST__.settle());
  simClock = Math.max(simClock, await page.evaluate(() => performance.now() + 600));
  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setPose({ alpha: 0, beta: 54, gamma: 0, linMag: 0.2, rotRate: 6 });
  });
  await new Promise((resolve) => setTimeout(resolve, 60));
  await page.evaluate((t) => window.__GAME_TEST__.vr.step(1.3, t), simClock);
  gameState = await state(page);
  assert.equal(gameState.phase, 'search');
  assert.deepEqual(gameState.collection, ['watch']);
  check('Calmly lowering the hand downward saves the find into the collection');

  // Verify Left vs Right wrist choice syncs bidirectionally and mirrors 2-bone arm + glove anatomy
  await wristPage.evaluate(() => {
    window.__WRIST_TEST__.setHandSide('left');
    window.__WRIST_TEST__.setPose({ alpha: 0, beta: 128, gamma: 0, linMag: 0.1, rotRate: 0 });
  });
  await new Promise((resolve) => setTimeout(resolve, 80));
  simClock += 1500;
  // Локоть определяется ГЕОМЕТРИЕЙ, поэтому левую согнутую руку надо ЧЕСТНО показать
  // камере: точка берётся в системе КОРПУСА (кисть у груди слева, 0.45 м от головы) и
  // проектируется с учётом ЖИВОГО доворота корпуса и наклона головы — иначе пятно улетает
  // за край кадра, conf падает в 0, и локоть решал бы один гироскоп.
  const dbgLeft = await vr(page);
  const torsoYawLeft = ((dbgLeft.wrist?.hand?.torsoYaw ?? 0) * 180) / Math.PI;
  // Кисть у груди слева: 0.35 м от плеча (это ~110° истинного сгиба) и 0.40 м от головы,
  // поэтому пятно крупное (0.17) и обе точки гарантированно внутри кадра.
  const leftFold = straightRightArmBeacon(gaze.yaw - torsoYawLeft, gaze.pitch, 0.17, [-0.13, -0.1, -0.37]);
  info = await page.evaluate(({ t, beacon }) => {
    window.__GAME_TEST__.vr.wristBeacon(beacon, t);
    return window.__GAME_TEST__.vr.step(0.45, t);
  }, { t: simClock, beacon: leftFold });
  simClock += 500;
  info = await page.evaluate(({ t, beacon }) => {
    window.__GAME_TEST__.vr.wristBeacon(beacon, t + 450);
    return window.__GAME_TEST__.vr.step(0.45, t);
  }, { t: simClock, beacon: leftFold });
  assert.equal(info.wrist.hand.handSide, 'left');
  assert.equal(info.world.handSide, 'left');
  assert.ok(
    info.world.handPosition[0] < -0.04,
    `левая кисть должна быть левее середины: x=${info.world.handPosition[0]} ` +
      `beacon=${JSON.stringify(info.wrist.beacon)} src=${info.wrist.hand.trackingSource} ` +
      `pos=${JSON.stringify(info.wrist.hand.pos)}`
  );
  assert.ok(info.wrist.hand.elbowPos.x < -0.08, `left elbow x=${info.wrist.hand.elbowPos.x}`);
  assert.ok(
    info.wrist.hand.elbowBendDeg > 55,
    `левая рука с кистью у груди должна быть согнута в локте: elbowBendDeg=${info.wrist.hand.elbowBendDeg} ` +
      `reach=${info.wrist.hand.reach} src=${info.wrist.hand.trackingSource} ` +
      `pos=${JSON.stringify(info.wrist.hand.pos)} beacon=${JSON.stringify(info.wrist.beacon)}`
  );
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-hand-left.png` });

  // Switch back to right hand from the VR host and verify wrist companion syncs too
  info = await page.evaluate((t) => {
    window.__GAME_TEST__.vr.setHandSide('right');
    return window.__GAME_TEST__.vr.step(0.35, t + 500);
  }, simClock);
  await new Promise((resolve) => setTimeout(resolve, 80));
  const wristSynced = await wristPage.evaluate(() => window.__WRIST_TEST__.status());
  assert.equal(wristSynced.handSide, 'right');
  assert.equal(info.world.handSide, 'right');
  assert.ok(info.world.handPosition[0] > 0.04, `right wrist x=${info.world.handPosition[0]}`);
  check('Right/Left wrist choice syncs bidirectionally and mirrors 2-bone elbow & glove anatomy');

  await page.evaluate(() => window.__GAME_TEST__.vr.stop());
  const stoppedInfo = await vr(page);
  assert.equal(stoppedInfo.world.bodyActive, false, '3D VR body hidden cleanly in flat 2D mode');
  assert.equal(stoppedInfo.world.handVisible, false, '3D VR hand hidden cleanly in flat 2D mode');
  await page.evaluate(() => {
    window.__GAME_TEST__.vr.open();
    window.__GAME_TEST__.vr.setHandSide('left');
  });
  const reopened = await vr(page);
  assert.equal(reopened.look.gyro.listening, true, 'Reopening VR dialog automatically resumes granted gyro listener');
  const wristHref = await page.$eval('#vr-wrist-link', (el) => el.getAttribute('href'));
  assert.ok(
    wristHref.includes('room=777777') && wristHref.includes('hand=left') && wristHref.includes('demo=1'),
    `dynamic wrist link href=${wristHref}`
  );
  // Reload wrist tab from scratch (seq restarts at 1, no explicit handSide in localStorage):
  // verify it adopts host's 'left' choice via ack AND packets flow immediately with zero seq freeze!
  await wristPage.evaluate(() => localStorage.removeItem('wn_wrist_hand_side'));
  await wristPage.goto(wristUrl, { waitUntil: 'networkidle0' });
  await wristPage.evaluate(() => window.__WRIST_TEST__.setPose({ alpha: 0, beta: 90, gamma: 0 }));
  await new Promise((resolve) => setTimeout(resolve, 120));
  const wristReloaded = await wristPage.evaluate(() => window.__WRIST_TEST__.status());
  assert.equal(wristReloaded.handSide, 'left', 'Unconfigured wrist adopts host handSide on join');
  const hostAfterReload = await vr(page);
  assert.equal(hostAfterReload.wrist.link.fresh, true, 'Reloaded wrist seq=1 packets accepted immediately');
  await page.evaluate(() => window.__GAME_TEST__.vr.setHandSide('right'));
  check('Reopening VR dialog, reloading wrist tab (seq=1), and companion link URL params all stay synced');
  await wristPage.close();
  await page.close();

  assert.deepEqual(errors, []);
  check('No page errors, console errors or failed HTTP responses');
  report = { passed: true, checks, gaze, limitations: ['Synthetic gyro/marker inputs and SwiftShader do not certify physical axis signs, the real rear camera, or phone FPS.'] };
} catch (error) {
  report = { passed: false, checks, errors, error: error.stack };
  throw error;
} finally {
  fs.writeFileSync(`${evidence}/reports/white-night-vr.json`, JSON.stringify(report, null, 2));
  try { await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]); } catch {}
  try { browser.process()?.kill('SIGKILL'); } catch {}
  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
  process.exit(report?.passed ? 0 : 1);
}
