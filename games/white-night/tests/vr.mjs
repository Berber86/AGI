import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';

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
  throw new Error('No tested head angle placed the bin under the centre gaze ray');
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
  check('Fresh gyro samples plus calibrated markers enable the real VR start button');

  await page.evaluate(() => window.__GAME_TEST__.vr.start());
  let info = await vr(page);
  assert.equal(info.active, true);
  assert.equal(info.stereo, true);
  assert.equal(info.world.stereo, true);
  assert.equal(await page.$$eval('.vr-eye', (eyes) => eyes.length), 2);
  assert.equal(await page.$eval('#vr-overlay', (e) => e.hidden), false);
  await page.screenshot({ path: `${evidence}/screenshots/white-night-vr-stereo-search.png` });
  check('Landscape VR renders a duplicated two-eye HUD over the stereo courtyard');

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
  check('Three no swings auto-save the find and return to searching');

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

  assert.deepEqual(errors, []);
  check('No page errors, console errors or failed HTTP responses');
  report = { passed: true, checks, gaze, limitations: ['Synthetic gyro/marker inputs and SwiftShader do not certify physical axis signs, the real rear camera, or phone FPS.'] };
} catch (error) {
  report = { passed: false, checks, errors, error: error.stack };
  throw error;
} finally {
  fs.writeFileSync(`${evidence}/reports/white-night-vr.json`, JSON.stringify(report, null, 2));
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
