// Краевые случаи всей игры: битый save, крошечный viewport, потеря WebGL-контекста,
// гонка переключателя качества и адаптивного рендер-скейла, NaN в сцене, «уезжающая»
// подпись бака, клики во время показа находки. Это НЕ юнит-тесты: здесь проверяется
// поведение собранной страницы на реальном статическом билде (dist/).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
const evidence = path.resolve('../../.studio/evidence');

const root = path.resolve('dist');
const prefix = '/games/white-night/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.webp': 'image/webp' };
if (!fs.existsSync(path.join(root, 'index.html'))) throw Error('dist/ is missing — run `npm run build` first');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const rel = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
  let file = path.resolve(root, rel);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(fs.readFileSync(file));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}${prefix}`;

const browser = await launch();
const errors = [];
const results = [];
const ok = (name) => { results.push(name); console.log('PASS', name); };
async function open(page = null, { query = '?test=1', viewport = { width: 900, height: 700 }, init = null, hooks = true } = {}) {
  const p = page || await browser.newPage();
  p.setDefaultTimeout(60000); p.setDefaultNavigationTimeout(120000);
  await p.setViewport({ ...viewport, deviceScaleFactor: 1 });
  if (init) await p.evaluateOnNewDocument(init);
  p.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  p.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await p.goto(base + query, { waitUntil: 'networkidle0' });
  await p.waitForFunction(hooks ? (() => window.__READY__ && window.__GAME_TEST__) : (() => window.__READY__), { timeout: 120000 });
  return p;
}
// Обход всей сцены: ни одна матрица, ни один масштаб, ни одна прозрачность не должны
// быть NaN/Infinity — иначе предмет исчезает навсегда и ни одна проверка это не ловит.
const nanScan = () => {
  const bad = [];
  window.__WORLD__.scene.updateMatrixWorld(true);
  window.__WORLD__.scene.traverse(o => {
    const e = o.matrixWorld.elements;
    for (let i = 0; i < 16; i++) if (!Number.isFinite(e[i])) { bad.push(`${o.type}#${o.name || o.id} matrix[${i}]`); break; }
    for (const v of [o.scale, o.position, o.rotation]) for (const k of ['x', 'y', 'z']) if (!Number.isFinite(v[k])) bad.push(`${o.type}#${o.name || o.id} ${k}`);
    const m = o.material;
    if (m && !Array.isArray(m) && !(m.opacity >= 0 && m.opacity <= 1)) bad.push(`${o.type}#${o.name || o.id} opacity=${m.opacity}`);
  });
  const metrics = window.__GAME_TEST__.getMetrics();
  for (const key of ['zoom', 'meanFrameMs']) if (!Number.isFinite(metrics[key])) bad.push(`metrics.${key}`);
  if (metrics.inspectionBounds) for (const key of ['left', 'right', 'top', 'bottom']) if (!Number.isFinite(metrics.inspectionBounds[key])) bad.push(`bounds.${key}`);
  return bad;
};

let report, page;
try {
  // 1. Сохранение нельзя испортить: мусор, чужие id, неверные типы.
  page = await open(null, { init: () => { try { localStorage.clear(); } catch { /* ignore */ } } });
  for (const raw of ['{', 'null', '"camera"', '[]', '{"version":1,"collection":"camera","searches":-4,"lastKept":7}',
    '{"version":1,"collection":["nope",{},"camera",null,"camera"],"searches":1e999,"lastKept":["nope","camera"]}',
    '{"version":99,"collection":["camera","duck","horse"],"searches":true}']) {
    await page.evaluate(v => localStorage.setItem('white-night-finds-v1', v), raw);
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.__GAME_TEST__, { timeout: 60000 });
    const state = await page.evaluate(() => window.__GAME_TEST__.getState());
    assert.ok(Array.isArray(state.collection), `collection must stay an array for ${raw}`);
    assert.ok(state.collection.every(id => window.__GAME_TEST__.items.includes(id)), 'unknown ids must be dropped');
    assert.equal(new Set(state.collection).size, state.collection.length, 'duplicates must be collapsed');
    assert.ok(Number.isSafeInteger(state.searches) && state.searches >= 0, `searches must be a safe counter, got ${state.searches}`);
    assert.ok(Array.isArray(state.lastKept) && state.lastKept.every(id => window.__GAME_TEST__.items.includes(id)), 'lastKept must be filtered');
  }
  ok('Corrupt, hostile and foreign saves degrade to a clean state');

  // 2. localStorage полностью недоступен (приватный режим Safari).
  await page.close();
  page = await open(null, {
    init: () => { Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } }); },
  });
  await page.waitForFunction(() => document.querySelector('#loading').hidden, { timeout: 30000 });
  assert.equal(await page.evaluate(() => window.__GAME_TEST__.getState().collection.length), 0);
  await page.evaluate(() => document.querySelector('#search-button').click());
  assert.ok(errors.filter(e => e.startsWith('pageerror')).length === 0, 'storage failure must not throw');
  ok('Boots and plays with localStorage entirely unavailable');
  await page.close();

  // 3. Крошечные и «странные» вьюпоры: сцена, стадж и подписи обязаны остаться числами.
  page = await open();
  for (const [w, h] of [[320, 240], [280, 653], [1440, 300], [700, 700], [1000, 420], [568, 320], [667, 375]]) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await new Promise(r => setTimeout(r, 120));
    await page.evaluate(() => window.__GAME_TEST__.settle());
    const bad = await page.evaluate(nanScan);
    if (!Array.isArray(bad)) throw Error('nanScan returned ' + JSON.stringify(bad) + ' typeof ' + typeof bad);
    assert.deepEqual(bad, [], `NaN in the scene at ${w}x${h}: ${bad.join(', ')}`);
    const stage = await page.evaluate(() => window.__WORLD__.stage);
    assert.ok(stage.width > 20 && stage.height > 20, `stage collapsed at ${w}x${h}: ${JSON.stringify(stage)}`);
    const overflow = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - innerWidth,
      y: document.documentElement.scrollHeight - innerHeight,
      app: document.querySelector('#app').getBoundingClientRect().height,
      canvas: document.querySelector('#world').getBoundingClientRect().height,
    }));
    assert.ok(overflow.x <= 0, `horizontal overflow ${overflow.x}px at ${w}x${h}`);
    assert.ok(overflow.y <= 0, `vertical overflow ${overflow.y}px at ${w}x${h} — the yard and the controls fall out of sync`);
    assert.ok(Math.abs(overflow.app - overflow.canvas) <= 1.5, `canvas ${overflow.canvas} vs app ${overflow.app} at ${w}x${h}`);
  }
  ok('320×240 … 1440×300: no NaN, no collapsed stage, no horizontal overflow');

  // 4. Поиск «на скорость»: тапы во время раскрытия, повторный keep, Escape.
  await page.setViewport({ width: 900, height: 700, deviceScaleFactor: 1 });
  await page.evaluate(() => window.__GAME_TEST__.reset());
  await page.evaluate(() => { window.__GAME_TEST__.forceNext('watch'); for (let i = 0; i < 12; i++) document.querySelector('#search-button').click(); });
  let state = await page.evaluate(() => window.__GAME_TEST__.getState());
  assert.equal(state.phase, 'inspect', 'a burst of taps must open exactly one find');
  assert.equal(state.searches, 1, 'a burst of taps must count one search');
  assert.equal(await page.evaluate(() => document.querySelector('#keep').disabled), true, 'keep must stay locked until the find is revealed');
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await page.evaluate(() => { for (let i = 0; i < 8; i++) document.querySelector('#keep').click(); });
  state = await page.evaluate(() => window.__GAME_TEST__.getState());
  assert.deepEqual(state.collection, ['watch'], 'keep is idempotent');
  await page.evaluate(() => { window.__GAME_TEST__.forceNext('watch'); document.querySelector('#search-button').click(); document.querySelector('#search-button').click(); document.querySelector('#search-button').click(); });
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await page.evaluate(() => document.querySelector('#keep').click());
  assert.equal((await page.evaluate(() => window.__GAME_TEST__.getState())).collection.length, 1, 'duplicates never inflate the archive');
  ok('Tap bursts and repeated keep keep the state machine honest');

  // 5. Escape во время раскрытия = «оставить во дворе», а не тайный keep.
  await page.evaluate(() => { window.__GAME_TEST__.forceNext('duck'); document.querySelector('#search-button').click(); document.querySelector('#search-button').click(); document.querySelector('#search-button').click(); });
  await page.keyboard.press('Escape');
  state = await page.evaluate(() => window.__GAME_TEST__.getState());
  assert.equal(state.phase, 'search');
  assert.deepEqual(state.collection, ['watch'], 'Escape mid-reveal discards');
  ok('Escape during the reveal discards instead of quietly keeping');

  // 6. Осмотр из коллекции не должен съедать ритуал трёх касаний.
  await page.evaluate(() => window.__GAME_TEST__.setCollection(['watch', 'duck']));
  await page.evaluate(() => { document.querySelector('#search-button').click(); document.querySelector('#search-button').click(); });
  await page.evaluate(() => document.querySelector('#open-collection').click());
  await page.waitForFunction(() => document.querySelector('#collection-dialog').open);
  await page.evaluate(() => document.querySelector('.item-card[data-id="watch"]').click());
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await page.evaluate(() => document.querySelector('#close-review').click());
  await page.waitForFunction(() => document.querySelector('#collection-dialog').open);
  state = await page.evaluate(() => window.__GAME_TEST__.getState());
  assert.equal(state.phase, 'search', 'review returns to the yard');
  assert.equal(state.taps, 2, 'search progress must survive a review');
  assert.equal(await page.evaluate(() => document.querySelectorAll('.tap-dots i.active').length), 2, 'tap dots must agree with the state');
  await page.evaluate(() => document.querySelector('[data-close="collection-dialog"]').click());
  ok('Reviewing a keepsake neither consumes nor inflates search progress');

  // 7. Переключатель качества не должен воевать с адаптивным рендер-скейлом.
  const dprSync = await page.evaluate(() => {
    const w = window.__WORLD__;
    window.__dprCap = Math.min(devicePixelRatio || 1, w.maxPixelRatio);
    const dprCap = window.__dprCap;
    w.pixelRatio = Math.min(1.15, dprCap); w.renderer.setPixelRatio(w.pixelRatio);
    const before = { governor: w.pixelRatio, renderer: w.renderer.getPixelRatio() };
    w.setQuality(true);
    const low = { governor: w.pixelRatio, renderer: w.renderer.getPixelRatio() };
    w.setQuality(false);
    const high = { governor: w.pixelRatio, renderer: w.renderer.getPixelRatio() };
    return { before, low, high, dprCap: window.__dprCap, frames: w.frames.length };
  });
  assert.equal(dprSync.low.renderer, dprSync.low.governor, `low: governor ${dprSync.low.governor} vs renderer ${dprSync.low.renderer}`);
  assert.equal(dprSync.high.renderer, dprSync.high.governor, `high: governor ${dprSync.high.governor} vs renderer ${dprSync.high.renderer}`);
  assert.ok(dprSync.high.governor <= dprSync.dprCap + 1e-9, `high quality must not render above the device pixel ratio (${dprSync.high.governor} > ${dprSync.dprCap})`);
  ok('Quality switch and the adaptive resolution governor agree on one pixel ratio');

  // 8. Подпись бака не улетает, когда игрок отводит взгляд, и не показывает
  // «нажмите», когда бака в кадре нет.
  const tag = await page.evaluate(async () => {
    const out = [];
    for (const yaw of [0, 38, -38, 41, -41]) {
      window.__GAME_TEST__.look(yaw, 0);
      // Выноска обновляется в кадровом цикле — дайте ему один кадр.
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const p = window.__GAME_TEST__.binScreen();
      const el = document.querySelector('.bin-tag');
      const rect = el.getBoundingClientRect();
      out.push({ yaw, bin: { x: +p.x.toFixed(1), y: +p.y.toFixed(1) }, edge: window.__WORLD__.binEdge(), offscreen: window.__WORLD__.hitBin(-400, innerHeight / 2), tag: { l: Math.round(rect.left), t: Math.round(rect.top), w: Math.round(rect.width), hidden: el.hidden }, hit: window.__WORLD__.hitBin(p.x, p.y), vw: innerWidth, vh: innerHeight });
    }
    return out;
  });
  for (const row of tag) {
    assert.ok(Number.isFinite(row.bin.x) && Number.isFinite(row.bin.y), `bin projection NaN at yaw ${row.yaw}`);
    assert.ok(row.tag.l <= row.vw + 40 && row.tag.l + row.tag.w >= -40, `bin tag flies off-screen at yaw ${row.yaw}: ${JSON.stringify(row.tag)}`);
    assert.equal(row.offscreen, false, `a tap far outside the frame must not dig in the bin (yaw ${row.yaw})`);
    if (!row.edge.onScreen) assert.equal(row.tag.hidden, true, `the callout must hide when the bin leaves the frame (yaw ${row.yaw}: ${JSON.stringify(row.edge)})`);
    assert.ok(row.tag.t >= 0 && row.tag.t + 60 <= row.vh, `bin tag collides with the header at yaw ${row.yaw}: ${JSON.stringify(row.tag)}`);
    if (row.hit) assert.ok(Math.abs(row.tag.l + row.tag.w / 2 - row.bin.x) < 260, `bin tag drifted away from the bin at yaw ${row.yaw}: ${JSON.stringify(row)}`);
  }
  ok('Bin callout stays on screen and keeps pointing at a visible bin');

  // 9. Потеря и восстановление WebGL-контекста: игра обязана вернуться сама.
  const gl = await page.evaluate(() => {
    const ctx = document.querySelector('#world').getContext('webgl2') || document.querySelector('#world').getContext('webgl');
    window.__lose = ctx.getExtension('WEBGL_lose_context');
    return !!window.__lose;
  });
  assert.ok(gl, 'WEBGL_lose_context must be available in the test browser');
  await page.evaluate(() => window.__lose.loseContext());
  await new Promise(r => setTimeout(r, 300));
  assert.equal(await page.evaluate(() => !document.querySelector('#webgl-error').hidden), true, 'context loss must tell the player');
  await page.evaluate(() => window.__lose.restoreContext());
  await new Promise(r => setTimeout(r, 900));
  const back = await page.evaluate(() => ({
    hidden: document.querySelector('#webgl-error').hidden,
    calls: window.__GAME_TEST__.getMetrics().drawCalls,
    paused: window.__GAME_TEST__.isPaused(),
  }));
  assert.equal(back.hidden, true, 'the yard must come back after the context is restored');
  assert.ok(back.calls > 0, 'the renderer must draw again after restore');
  assert.equal(back.paused, false, 'the loop must resume after restore');
  ok('WebGL context loss shows a notice and a restore brings the yard back');

  // 10. Настоящий путь игрока: без тестовых хуков, только клики и пальцы.
  await page.close();
  const plain = await browser.newPage();
  plain.setDefaultTimeout(60000); plain.setDefaultNavigationTimeout(120000);
  await plain.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  plain.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  plain.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  plain.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await plain.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch { /* ignore */ } });
  await plain.goto(base, { waitUntil: 'networkidle0' });
  await plain.waitForFunction(() => window.__READY__, { timeout: 120000 });
  await plain.tap('#search-button'); await plain.tap('#search-button'); await plain.tap('#search-button');
  await plain.waitForFunction(() => !document.querySelector('.inspection').hidden, { timeout: 30000 });
  await plain.waitForFunction(() => !document.querySelector('#keep').disabled, { timeout: 30000 });
  assert.equal(await plain.evaluate(() => document.querySelector('.inspection').hidden), false, 'inspection panel must be visible');
  await plain.tap('#keep');
  assert.equal(await plain.evaluate(() => JSON.parse(localStorage.getItem('white-night-finds-v1')).collection.length), 1);
  await plain.tap('#open-collection');
  assert.equal(await plain.evaluate(() => document.querySelectorAll('.item-card.owned').length), 1);
  await plain.tap('[data-close="collection-dialog"]');
  assert.deepEqual(errors.filter(e => !e.startsWith('404')), [], 'the untouched production page must not throw');
  ok('Plain production page (no test hooks): search → keep → archive works');
  await plain.close();

  assert.deepEqual(errors, [], `unexpected browser errors: ${errors.join(' | ')}`);
  ok('No page errors, console errors or failed responses');
  report = { passed: true, checks: results, errors };
} catch (error) {
  report = { passed: false, checks: results, errors, failure: error.message, stack: error.stack };
  throw error;
} finally {
  fs.mkdirSync(path.resolve('../../.studio/evidence/reports'), { recursive: true });
  fs.writeFileSync(path.resolve('../../.studio/evidence/reports/edge.json'), JSON.stringify(report, null, 2));
  await browser.close();
  await new Promise(r => server.close(r));
}
