// Independent critique harness (v7 review).
//
// Purpose: collect the evidence a *visual* review needs, from the real build:
//   * frames across viewports (search / inspection / archive / reveal),
//   * the visible area of a find per pose, measured on rendered pixels
//     (frame with the find, minus the same frame before the find appears),
//   * layout facts that are invisible in a screenshot: tap-target sizes,
//     font sizes, overlap of fixed UI blocks, text-scaling behaviour.
//
// It only reads. No game source is modified; everything is driven through the
// existing ?test=1 bridge. Run against a production preview on port 5173:
//   npm run build && npm run preview -- --port 5173
//   npm run critique
import {launch} from './browser.mjs';
import fs from 'node:fs';
import sharp from 'sharp';

const series = process.env.SERIES || 'v7';
const iteration = process.env.ITERATION || 'critique';
const folder = `../../.studio/evidence/screenshots/visual-${series}-${iteration}`;
const reportPath = `../../.studio/evidence/reports/visual-${series}-${iteration}.json`;
fs.mkdirSync(folder, {recursive: true});

const URL = process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1';
const report = {passed: true, series, iteration, shots: [], measures: {}, errors: []};
const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(180000);
page.setDefaultNavigationTimeout(180000);
page.on('pageerror', e => report.errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });

const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = async (name, note) => {
  const path = `${folder}/${name}.webp`;
  await page.screenshot({path, type: 'webp', quality: 88});
  report.shots.push({name, note});
  console.log('SHOT', name, '-', note);
  return path;
};
const ready = () => page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
const setView = async (w, h, mobile = w < 900) => {
  await page.setViewport({width: w, height: h, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1});
  await ready();
  await wait(350);
};
const dismiss = async () => {
  for (const id of ['complete-dialog', 'collection-dialog', 'settings-dialog']) {
    if (await page.$eval('#' + id, d => d.open).catch(() => false)) await page.evaluate(i => document.getElementById(i).close(), id);
  }
};
const findItem = async id => {
  await dismiss();
  await wait(150);
  await page.evaluate(i => window.__GAME_TEST__.forceNext(i), id);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => document.querySelector('#search-button').click()); await wait(80); }
  const phase = await page.evaluate(() => window.__GAME_TEST__.getState().phase);
  if (phase !== 'inspect') throw new Error(`findItem(${id}) failed, phase=${phase}`);
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(120);
};
const leave = async which => { await page.evaluate(w => document.querySelector('#' + w).click(), which); await wait(120); };
const rect = async sel => page.evaluate(s => {
  const el = document.querySelector(s);
  if (!el || el.offsetParent === null) return null;
  const b = el.getBoundingClientRect();
  return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom)};
}, sel);
const overlap = (a, b) => Boolean(a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h);

// --- pixel helpers ---------------------------------------------------------
const raw = async buf => sharp(buf).raw().toBuffer({resolveWithObject: true});
const stageBox = stage => ({x: Math.max(0, Math.floor(stage.x)), y: Math.max(0, Math.floor(stage.y)), width: Math.ceil(stage.width), height: Math.ceil(stage.height)});
// Changed pixels between "the find is hidden" and "the find is on screen". The veil
// behind the find differs by 0.13 opacity between the two frames, which stays under
// the threshold; a dark find on the dark backdrop is therefore under-measured, and
// that bias is stated in the report.
const diffArea = async (a, b, box) => {
  const [ra, rb] = [await raw(a), await raw(b)];
  if (ra.info.width !== rb.info.width || ra.info.height !== rb.info.height) return null;
  let changed = 0, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
  for (let y = box.y; y < Math.min(ra.info.height, box.y + box.height); y++) {
    for (let x = box.x; x < Math.min(ra.info.width, box.x + box.width); x++) {
      const i = (y * ra.info.width + x) * ra.info.channels;
      const d = Math.abs(ra.data[i] - rb.data[i]) + Math.abs(ra.data[i + 1] - rb.data[i + 1]) + Math.abs(ra.data[i + 2] - rb.data[i + 2]);
      if (d > 24) {
        changed++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return changed ? {area: changed, w: maxX - minX + 1, h: maxY - minY + 1, x: minX, y: minY} : {area: 0, w: 0, h: 0};
};
const meanLuma = async (buf, box) => {
  const {data, info} = await raw(buf);
  let sum = 0, n = 0;
  for (let y = Math.max(0, box.y); y < Math.min(info.height, box.y + box.height); y++) {
    for (let x = Math.max(0, box.x); x < Math.min(info.width, box.x + box.width); x++) {
      const i = (y * info.width + x) * info.channels;
      sum += data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114; n++;
    }
  }
  return n ? +(sum / n).toFixed(2) : null;
};
// Horizontal seams: rows whose luma differs from the row above across most of the
// stage width. A long, perfectly straight edge through a courtyard made of stone,
// render and fog is geometry, not texture.
const seamRows = async (buf, box) => {
  const {data, info} = await raw(buf);
  const rows = [];
  for (let y = box.y + 4; y < Math.min(info.height, box.y + box.height); y++) {
    let hits = 0, n = 0;
    for (let x = box.x + 8; x < Math.min(info.width, box.x + box.width) - 8; x++) {
      const i = (y * info.width + x) * info.channels;
      const j = ((y - 1) * info.width + x) * info.channels;
      const a = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
      const b = data[j] * .299 + data[j + 1] * .587 + data[j + 2] * .114;
      n++;
      if (Math.abs(a - b) > 2.5) hits++;
    }
    if (n && hits / n > .7) rows.push({y, share: +(hits / n).toFixed(2)});
  }
  return rows;
};
const luma = (r, g, b) => {
  const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
// Two-cluster split of a label crop: the darker quarter is taken as the glyph or as
// the background, whichever is darker. Approximate, because antialiasing mixes both.
const cropContrast = async (buf, box) => {
  const {data, info} = await raw(buf);
  const pts = [];
  for (let y = Math.max(0, box.y); y < Math.min(info.height, box.y + box.height); y++) {
    for (let x = Math.max(0, box.x); x < Math.min(info.width, box.x + box.width); x++) {
      const i = (y * info.width + x) * info.channels;
      pts.push([data[i], data[i + 1], data[i + 2], luma(data[i], data[i + 1], data[i + 2])]);
    }
  }
  if (pts.length < 20) return null;
  pts.sort((a, b) => a[3] - b[3]);
  const cut = pts[Math.floor(pts.length * .25)];
  const low = pts.filter(p => p[3] <= cut[3]), high = pts.filter(p => p[3] > cut[3]);
  if (!low.length || !high.length) return null;
  const avg = set => set.reduce((s, p) => [s[0] + p[0] / set.length, s[1] + p[1] / set.length, s[2] + p[2] / set.length], [0, 0, 0]);
  const a = avg(low), b = avg(high);
  const la = luma(...a), lb = luma(...b);
  return {dark: a.map(Math.round), light: b.map(Math.round), ratio: +((Math.max(la, lb) + .05) / (Math.min(la, lb) + .05)).toFixed(2)};
};
// One background frame per find is enough: the pose only turns the model, it does
// not move the stage, the camera or the veil. Reduced motion is unusable here,
// because revealFrame() pins every reduced-motion frame to the finished state.
const captureBg = async () => {
  await page.evaluate(() => window.__GAME_TEST__.seekReveal(0.1));
  await wait(90);
  return page.screenshot({type: 'webp', quality: 90});
};
const captureFg = async () => {
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(90);
  return page.screenshot({type: 'webp', quality: 90});
};

// First navigation has to happen before any waitForFunction can succeed.
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(URL, {waitUntil: 'networkidle0'});
await ready();

try {
  // --- A. search phase across viewports ------------------------------------
  report.measures.viewports = [];
  for (const [w, h] of [[320, 568], [360, 640], [390, 844], [412, 915], [768, 1024], [1024, 600], [1280, 900], [1920, 1080], [844, 390]]) {
    await setView(w, h);
    await shot(`search-${w}x${h}`, 'courtyard, search phase');
    const m = await page.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el || el.offsetParent === null) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom)}; };
      return {
        w: innerWidth, h: innerHeight,
        hero: r('.hero'), fieldNote: r('.field-note'), search: r('.search-controls'), topbar: r('.topbar'), footer: r('.bottom-meta'),
        scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight,
        canvas: {w: document.querySelector('#world').width, h: document.querySelector('#world').height},
      };
    });
    m.overlaps = {
      heroVsTopbar: overlap(m.hero, m.topbar),
      heroVsFooter: overlap(m.hero, m.footer),
      searchVsHero: overlap(m.search, m.hero),
      searchVsFooter: overlap(m.search, m.footer),
      fieldNoteVsTopbar: overlap(m.fieldNote, m.topbar),
    };
    m.overflowX = m.scrollW > m.w;
    m.overflowY = m.scrollH > m.h + 1;
    // Contrast of the search-phase editorial text against whatever the 3D scene put
    // behind it. The crop is split into a dark and a light cluster, so antialiased
    // glyph edges land in both and the ratio is conservative.
    const searchBuf = fs.readFileSync(`${folder}/search-${w}x${h}.webp`);
    m.textContrast = {};
    for (const [name, sel] of [['headline', '.hero h1'], ['tagline', '.hero > p'], ['eyebrow', '.hero .eyebrow'], ['field-note', '.field-note p'], ['field-label', '.field-note > span:last-child'], ['location', '.top-location'], ['caption', '#search-caption'], ['hint', '.control-hint'], ['wordmark', '.wordmark span'], ['place', '.place']]) {
      const box = await page.evaluate(s => {
        const el = document.querySelector(s);
        if (!el || el.offsetParent === null) return null;
        const b = el.getBoundingClientRect();
        return {x: Math.max(0, Math.round(b.x)), y: Math.max(0, Math.round(b.y)), width: Math.round(b.width), height: Math.round(b.height)};
      }, sel);
      if (box && box.width > 4 && box.height > 4) m.textContrast[name] = await cropContrast(searchBuf, box);
    }
    if (h <= 520) {
      // Landscape search: the controls become a right-hand panel, so check that
      // every part of it (caption, button, hint) really fits on screen.
      m.panel = await page.evaluate(() => {
        const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)}; };
        return {controls: r('.search-controls'), status: r('.search-status'), button: r('#search-button'), hint: r('.control-hint'), binTag: r('.bin-tag'), wordmark: r('.wordmark'), nav: r('nav')};
      });
      m.panelOffscreen = Object.fromEntries(Object.entries(m.panel).map(([k, v]) => [k, v ? (v.bottom > m.h + 1 || v.right > m.w + 1 || v.x < -1) : null]));
    }
    report.measures.viewports.push(m);
  }

  // --- B. tap progress and the lid reaction --------------------------------
  await setView(412, 915);
  await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'no-preference'}]);
  await page.reload({waitUntil: 'networkidle0'}); await ready();
  await page.evaluate(() => document.querySelector('#search-button').click());
  await wait(110); await shot('tap-1', 'first tap, lid kick in motion');
  await page.evaluate(() => document.querySelector('#search-button').click());
  await wait(110); await shot('tap-2', 'second tap, lid kick in motion');
  await wait(1500); await shot('tap-2-settled', 'second tap, after the kick decays');
  report.measures.tapProgress = await page.evaluate(() => ({
    dots: [...document.querySelectorAll('.tap-dots i')].map(d => getComputedStyle(d).backgroundColor),
    label: document.querySelector('.tap-dots').getAttribute('aria-label'),
    caption: document.querySelector('#search-caption').textContent,
  }));

  // --- C. toast after a decision -------------------------------------------
  const toastState = () => page.evaluate(() => {
    const t = document.querySelector('#toast'), b = t.getBoundingClientRect(), st = getComputedStyle(t);
    const overlaps = sel => {
      const el = document.querySelector(sel);
      if (!el || el.offsetParent === null) return null;
      const r = el.getBoundingClientRect();
      return b.left < r.right && r.left < b.right && b.top < r.bottom && r.top < b.bottom;
    };
    return {
      visible: t.classList.contains('visible'), opacity: +st.opacity, tone: t.dataset.tone, text: t.textContent,
      rect: {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)},
      offscreen: b.top < 0 || b.bottom > innerHeight || b.left < 0 || b.right > innerWidth,
      overlapsHero: overlaps('.hero'), overlapsFieldNote: overlaps('.field-note'), overlapsSearch: overlaps('.search-controls'),
    };
  });
  // The toast fades in over 0.22 s, so a frame taken immediately reports a
  // half-transparent box; the settled frame is the one to judge.
  await setView(412, 915);
  await findItem('cassette');
  await shot('before-keep', 'inspection of the cassette before the decision');
  await leave('keep');
  await wait(120);
  await shot('toast-412-fading', 'toast 0.12 s after the decision, still fading in');
  await wait(500);
  await shot('toast-412', 'toast 0.6 s after keeping a find');
  report.measures.toast412 = await toastState();
  await setView(1280, 900, false);
  await findItem('cup'); await leave('keep'); await wait(600);
  await shot('toast-1280', 'toast on the desktop layout');
  report.measures.toast1280 = await toastState();
  await setView(844, 390);
  await findItem('book'); await leave('keep'); await wait(600);
  await shot('toast-844x390', 'toast on a landscape phone');
  report.measures.toast844 = await toastState();
  await wait(2400);
  await shot('toast-844x390-gone', 'landscape 3 s after the decision');

  // --- D. every find: pixels per pose, contact shadow, tone ----------------
  // Real motion is required: seekReveal() cannot hide the model under
  // prefers-reduced-motion, so pose readability is measured with motion on.
  await setView(412, 915);
  await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'no-preference'}]);
  await page.reload({waitUntil: 'networkidle0'}); await ready();
  report.measures.poses = [];
  report.measures.shadow = [];
  const seams = [];
  report.measures.seams = seams;
  const ids = await page.evaluate(() => window.__GAME_TEST__.items);
  for (const id of ids) {
    await findItem(id);
    await shot(`item-${id}`, 'inspection, authored pose');
    const box = stageBox(await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage));
    const bg = await captureBg();
    const fg = await captureFg();
    const front = await diffArea(fg, bg, box);
    const row = {id, front};
    const baseX = front?.x ?? box.x, baseY = front?.y ?? box.y;
    const strip = {x: Math.max(0, baseX - 20), y: Math.round(baseY + (front?.h ?? 100)) + 3, width: Math.min(220, baseX + (front?.w ?? 120)), height: 10};
    report.measures.shadow.push({
      id,
      below: await meanLuma(fg, strip),
      lower: await meanLuma(fg, {...strip, y: strip.y + 36}),
      above: await meanLuma(fg, {...strip, y: Math.max(0, strip.y - 26)}),
    });
    seams.push({id, rows: await seamRows(fg, box)});
    for (const pose of ['top', 'bottom', 'back']) {
      await page.evaluate(p => window.__GAME_TEST__.setPose(p), pose);
      await wait(250);
      const posed = await page.screenshot({type: 'webp', quality: 90});
      row[pose] = await diffArea(posed, bg, box);
      if (pose === 'top') await page.screenshot({path: `${folder}/pose-${id}-top.webp`, type: 'webp', quality: 88});
    }
    row.stagePixels = box.width * box.height;
    row.frontPct = front?.area ? +(front.area / row.stagePixels * 100).toFixed(1) : 0;
    row.topPct = front?.area && row.top?.area ? +(row.top.area / front.area * 100).toFixed(1) : null;
    row.bottomPct = front?.area && row.bottom?.area ? +(row.bottom.area / front.area * 100).toFixed(1) : null;
    row.backPct = front?.area && row.back?.area ? +(row.back.area / front.area * 100).toFixed(1) : null;
    report.measures.poses.push(row);
    console.log('POSE', id.padEnd(9), 'front', String(front?.area).padEnd(6), 'top', String(row.top?.area).padEnd(6), 'bottom', String(row.bottom?.area).padEnd(6), 'top%', row.topPct);
    await leave('keep');
  }
  const tone = [];
  for (const id of ids) {
    const buf = fs.readFileSync(`${folder}/item-${id}.webp`);
    tone.push({id, mean: await meanLuma(buf, {x: 40, y: 256, width: 332, height: 348})});
  }
  report.measures.tone = tone.sort((a, b) => a.mean - b.mean);

  // --- E. free rotation by dragging ----------------------------------------
  await setView(412, 915);
  for (const id of ['paper', 'camera', 'duck']) {
    await findItem(id);
    const stage = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
    const cx = Math.round(stage.x + stage.width / 2), cy = Math.round(stage.y + stage.height / 2);
    const track = [];
    await page.mouse.move(cx, cy); await page.mouse.down();
    for (let i = 0; i < 14; i++) {
      await page.mouse.move(cx + (i + 1) * 26, cy, {steps: 1});
      await wait(60);
      if (i === 6) await shot(`drag-${id}-mid`, 'find turned by drag, mid gesture');
      track.push(await page.evaluate(() => {
        const m = window.__GAME_TEST__.getMetrics(), b = m.inspectionBounds;
        return {rot: window.__GAME_TEST__.getRotation(), w: Math.round(b.right - b.left), h: Math.round(b.bottom - b.top), stage: Math.round(b.stage.width)};
      }));
    }
    await page.mouse.up(); await wait(250);
    await shot(`drag-${id}-end`, 'find turned by drag until it left the authored pose');
    report.measures[`drag-${id}`] = {track, end: await page.evaluate(() => {
      const m = window.__GAME_TEST__.getMetrics(), b = m.inspectionBounds, s = b.stage;
      return {rot: window.__GAME_TEST__.getRotation(), l: Math.round(b.left), r: Math.round(b.right), t: Math.round(b.top), bo: Math.round(b.bottom), stage: {x: Math.round(s.x), y: Math.round(s.y), w: Math.round(s.width), h: Math.round(s.height)}};
    })};
    await leave('discard');
  }
  await findItem('record');
  {
    const stage = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
    const cx = Math.round(stage.x + stage.width / 2), cy = Math.round(stage.y + stage.height / 2);
    await page.mouse.move(cx, cy); await page.mouse.down();
    for (let i = 0; i < 16; i++) { await page.mouse.move(cx, cy + (i + 1) * 24, {steps: 1}); await wait(50); }
    await page.mouse.up(); await wait(250);
    await shot('drag-record-edge', 'vinyl turned by drag to an edge-on view');
    const box = stageBox(stage);
    const bg = await captureBg();
    const fg = await captureFg();
    report.measures['drag-record-edge'] = {rot: await page.evaluate(() => window.__GAME_TEST__.getRotation()), area: await diffArea(fg, bg, box)};
  }
  await page.evaluate(() => document.querySelector('#zoom-in').click());
  await wait(200); await shot('zoom-max-rotated', 'maximum zoom on a turned find');
  await page.evaluate(() => document.querySelector('#zoom-reset').click());
  await leave('discard');

  // --- F. archive, completion, settings, reduced quality -------------------
  await setView(412, 915, true);
  await page.evaluate(() => window.__GAME_TEST__.setCollection([]));
  await page.evaluate(() => document.querySelector('#open-collection').click());
  await shot('collection-empty', 'archive, nothing found');
  await page.evaluate(() => document.querySelector('[data-close="collection-dialog"]').click());
  await page.evaluate(() => window.__GAME_TEST__.setCollection(['camera', 'teacup', 'can', 'paper']));
  await page.evaluate(() => document.querySelector('#open-collection').click());
  await shot('collection-partial', 'archive, 4 of 18, mixed rarities');
  await page.evaluate(() => document.querySelector('[data-filter="junk"]').click());
  await shot('collection-junk-only', 'archive, junk filter with two finds');
  await page.evaluate(() => document.querySelector('[data-filter="all"]').click());
  await page.evaluate(() => document.querySelector('[data-close="collection-dialog"]').click());
  await page.evaluate(() => window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items.slice(0, 17)));
  await page.evaluate(() => document.querySelector('#open-collection').click());
  await shot('collection-17', 'archive, one find left');
  await page.evaluate(() => document.querySelector('[data-close="collection-dialog"]').click());
  await findItem('camera'); await leave('keep');
  await page.evaluate(() => {
    const all = window.__GAME_TEST__.items.filter(i => i !== 'paper');
    window.__GAME_TEST__.setCollection(all);
  });
  await findItem('paper'); await leave('keep');
  await wait(400);
  if (await page.$eval('#complete-dialog', d => d.open)) await shot('complete', 'completion screen with the last finds');
  await page.evaluate(() => document.querySelector('#continue-button')?.click());
  await page.evaluate(() => document.querySelector('#open-settings').click()); await shot('settings-412', 'settings dialog');
  await page.evaluate(() => document.querySelector('#reset-button').click()); await shot('settings-reset-confirm', 'destructive reset confirmation');
  await page.evaluate(() => document.querySelector('#reset-cancel').click());
  await page.evaluate(() => document.querySelector('[data-close="settings-dialog"]').click());
  await page.evaluate(() => document.querySelector('#open-settings').click());
  await page.evaluate(() => document.querySelector('#low-quality').click());
  await page.evaluate(() => document.querySelector('[data-close="settings-dialog"]').click());
  await wait(400); await shot('search-412-low', 'courtyard in the reduced-quality mode');
  await setView(1280, 900, false); await shot('search-1280-low', 'courtyard in reduced quality on desktop');
  await setView(412, 915, true);
  await findItem('duck');
  const lowBox = stageBox(await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage));
  await shot('item-duck-low', 'find in the reduced-quality mode');
  const lowBg = await captureBg();
  const lowFg = await captureFg();
  report.measures.lowQualityDuck = await diffArea(lowFg, lowBg, lowBox);
  await page.evaluate(() => document.querySelector('#open-settings').click());
  await page.evaluate(() => document.querySelector('#low-quality').click());
  await page.evaluate(() => document.querySelector('[data-close="settings-dialog"]').click());
  await wait(300);
  await leave('discard');

  // --- G. reveal timeline in real motion -----------------------------------
  const motion = await browser.newPage();
  await motion.setDefaultTimeout(180000);
  await motion.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
  await motion.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'no-preference'}]);
  await motion.goto(URL, {waitUntil: 'networkidle0'});
  await motion.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
  await motion.evaluate(() => window.__GAME_TEST__.forceNext('camera'));
  for (let i = 0; i < 3; i++) await motion.evaluate(() => document.querySelector('#search-button').click());
  const frames = [];
  for (const p of [0.05, 0.2, 0.25, 0.4, 0.55, 0.7, 0.85, 1]) {
    await motion.evaluate(v => window.__GAME_TEST__.seekReveal(v), p);
    await wait(160);
    const name = `reveal-${String(p).replace('.', '_')}`;
    await motion.screenshot({path: `${folder}/${name}.webp`, type: 'webp', quality: 88});
    report.shots.push({name, note: 'reveal timeline, real motion'});
    frames.push({p, ui: await motion.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el) return null; const st = getComputedStyle(el); const b = el.getBoundingClientRect(); return {opacity: +st.opacity, visibility: st.visibility, y: Math.round(b.y), bottom: Math.round(b.bottom)}; };
      return {
        note: document.querySelector('#reveal-note').textContent, noteHidden: document.querySelector('#reveal-note').hidden,
        noteRect: r('#reveal-note'), info: r('.find-info'), header: r('.find-header'), controls: r('.view-controls'),
        decisions: r('.decision-buttons'), phase: document.querySelector('#app').dataset.revealPhase,
      };
    })});
  }
  report.measures.revealFrames = frames;
  await motion.close();

  // --- I. small screens: does the find stay clear of the fixed UI? ---------
  report.measures.smallScreens = [];
  for (const [w, h] of [[320, 568], [360, 640], [390, 844], [844, 390], [740, 360]]) {
    await setView(w, h);
    for (const id of ['camera', 'paper', 'teacup']) {
      await findItem(id);
      await shot(`small-${w}x${h}-${id}`, `find on ${w}x${h}`);
      const box = stageBox(await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage));
      const bg = await captureBg();
      const fg = await captureFg();
      const area = await diffArea(fg, bg, box);
      const ui = await page.evaluate(() => {
        const r = s => { const el = document.querySelector(s); if (!el || el.offsetParent === null) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right), hidden: getComputedStyle(el).visibility === 'hidden' || +getComputedStyle(el).opacity === 0}; };
        return {header: r('.find-header'), info: r('.find-info'), buttons: r('.decision-buttons'), hint: r('.rotation-hint'), poses: r('.view-controls'), note: r('#reveal-note')};
      });
      const overlaps = {};
      if (area?.area) {
        const fb = {x: area.x, y: area.y, w: area.w, h: area.h, right: area.x + area.w, bottom: area.y + area.h};
        for (const [name, v] of Object.entries(ui)) {
          if (!v || v.hidden) continue;
          overlaps[name] = fb.x < v.right && v.x < fb.right && fb.y < v.bottom && v.y < fb.bottom;
        }
      }
      report.measures.smallScreens.push({w, h, id, find: area, stage: box, ui, overlaps});
      console.log('SMALL', `${w}x${h}`.padEnd(9), id.padEnd(9), 'find', String(area?.area).padEnd(6), JSON.stringify(overlaps));
      await leave('discard');
    }
  }

  // --- H. layout facts: hit areas, type sizes, label contrast --------------
  await setView(412, 915, true);
  await page.reload({waitUntil: 'networkidle0'}); await ready();
  const collectTargets = () => page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button, input, [role="switch"], [data-pose], [data-filter]')) {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      out.push({label: (el.textContent || el.getAttribute('aria-label') || el.id || '').trim().replace(/\s+/g, ' ').slice(0, 30), w: Math.round(b.width), h: Math.round(b.height)});
    }
    return out;
  });
  const typeSizes = () => page.evaluate(() => {
    const hist = {};
    for (const el of document.querySelectorAll('#app *, dialog *')) {
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const fs = getComputedStyle(el).fontSize;
      hist[fs] = (hist[fs] || 0) + 1;
    }
    return hist;
  });
  report.measures.hitTargetsSearch = await collectTargets();
  report.measures.typeSizesSearch = await typeSizes();
  await findItem('camera');
  report.measures.hitTargetsInspect = await collectTargets();
  report.measures.typeSizesInspect = await typeSizes();
  const inspectShot = await shot('contrast-inspect-base', 'frame used for label-contrast measurement');
  const labelBoxes = await page.evaluate(() => {
    const out = [];
    for (const [name, sel] of [['rarity-chip', '#find-rarity'], ['find-number', '#find-number'], ['era', '#find-era'], ['description', '#find-description'], ['rotate-hint', '.rotation-hint span'], ['zoom-reset', '#zoom-reset'], ['pose-button', '.view-controls button[aria-pressed="false"]']]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const b = el.getBoundingClientRect();
      out.push({name, box: {x: Math.max(0, Math.round(b.x)), y: Math.max(0, Math.round(b.y)), width: Math.round(b.width), height: Math.round(b.height)}, color: getComputedStyle(el).color, font: getComputedStyle(el).fontSize});
    }
    return out;
  });
  report.measures.inspectLabels = [];
  for (const l of labelBoxes) report.measures.inspectLabels.push({...l, contrast: await cropContrast(inspectShot, l.box)});
  await leave('discard');
  await page.evaluate(() => document.querySelector('#open-collection').click());
  const collectionShot = await shot('contrast-collection-base', 'archive frame used for label-contrast measurement');
  const cBoxes = await page.evaluate(() => {
    const out = [];
    for (const [name, sel] of [['item-title', '.item-card .item-title'], ['item-type', '.item-card .item-type'], ['item-index', '.item-card .item-index'], ['catalog-hint', '.catalog-hint'], ['dialog-foot', '.dialog-foot'], ['filter-tab', '.filter-tabs button:not(.active)']]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const b = el.getBoundingClientRect();
      out.push({name, box: {x: Math.max(0, Math.round(b.x)), y: Math.max(0, Math.round(b.y)), width: Math.round(b.width), height: Math.round(b.height)}, color: getComputedStyle(el).color, font: getComputedStyle(el).fontSize});
    }
    return out;
  });
  report.measures.archiveLabels = [];
  for (const l of cBoxes) report.measures.archiveLabels.push({...l, contrast: await cropContrast(collectionShot, l.box)});
  report.measures.hitTargetsArchive = await collectTargets();
  await page.evaluate(() => document.querySelector('[data-close="collection-dialog"]').click());

  // text-size boost proxy: +30 % on every rendered size, as an OS text setting would
  await setView(412, 915, true);
  await page.reload({waitUntil: 'networkidle0'}); await ready();
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('#app *, dialog *')) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs) el.style.fontSize = `${(fs * 1.3).toFixed(1)}px`;
    }
  });
  await wait(250); await shot('text-scale-130-search', 'search screen with every size boosted 30%');
  report.measures.textScaleSearch = {
    hero: await rect('.hero'), search: await rect('.search-controls'), footer: await rect('.bottom-meta'), topbar: await rect('.topbar'),
    scrollW: await page.evaluate(() => document.documentElement.scrollWidth), innerW: await page.evaluate(() => innerWidth),
  };
  report.measures.textScaleSearch.overlapSearchHero = overlap(report.measures.textScaleSearch.search, report.measures.textScaleSearch.hero);
  await findItem('camera');
  report.measures.textScaleInspect = {info: await rect('.find-info'), buttons: await rect('.decision-buttons'), zoom: await rect('.rotation-hint'), poses: await rect('.view-controls'), header: await rect('.find-header')};
  report.measures.textScaleInspect.infoOverlapsButtons = overlap(report.measures.textScaleInspect.info, report.measures.textScaleInspect.buttons);
  await shot('text-scale-130-inspect', 'inspection with every size boosted 30%');
  await leave('discard');
} catch (error) {
  report.passed = false;
  report.fatal = error.stack || String(error);
  console.error('FATAL', error);
} finally {
  await browser.close();
  report.passed = report.passed && report.errors.length === 0 && !report.fatal;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('REPORT', reportPath);
  console.log('ERRORS', report.errors.length, report.errors.slice(0, 5));
}
