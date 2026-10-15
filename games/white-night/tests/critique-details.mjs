// Follow-up probes for the v7 critique. Two questions the main sweep cannot answer
// from its saved frames:
//
//   1. Item-only tone. The band measured by the main sweep includes the backdrop, so
//      it mixes "how bright is the find" with "how big is the find". Here the mean is
//      taken inside the find's own measured bounding box.
//   2. Free-rotation guard. The pose buttons protect against collapsed views
//      ("flat" finds tilt instead of turning edge-on), but a drag can still reach the
//      exact edge-on angle. The area is measured at the angles a drag actually visits.
//
//   npm run preview -- --port 5173   (separately)
//   node tests/critique-details.mjs
import {launch} from './browser.mjs';
import fs from 'node:fs';
import sharp from 'sharp';

const series = process.env.SERIES || 'v7';
const folder = `../../.studio/evidence/screenshots/visual-${series}-critique`;
const outPath = `../../.studio/evidence/reports/visual-${series}-critique-details.json`;
const URL = process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1';
const wait = ms => new Promise(r => setTimeout(r, ms));
const report = {passed: true, itemTone: [], rotation: [], errors: []};

const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(180000);
page.on('pageerror', e => report.errors.push(e.message));
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'no-preference'}]);
await page.goto(URL, {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);

const raw = async buf => sharp(buf).raw().toBuffer({resolveWithObject: true});
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
// The veil behind the find changes by 0.13 opacity between the two frames, which is
// enough to move bright backdrop pixels past a low threshold. The item's own pixels
// are therefore taken as pixels that changed inside the find's projected bounds, and
// the coverage share is reported so a dark find cannot hide behind the threshold.
const itemPixels = async (fg, bg, box, threshold = 24) => {
  const [rf, rb] = [await raw(fg), await raw(bg)];
  const luma = (d, i) => d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
  const item = [], backdrop = [];
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
  for (let y = box.y; y < Math.min(rf.info.height, box.y + box.height); y++) {
    for (let x = box.x; x < Math.min(rf.info.width, box.x + box.width); x++) {
      const i = (y * rf.info.width + x) * rf.info.channels;
      const d = Math.abs(rf.data[i] - rb.data[i]) + Math.abs(rf.data[i + 1] - rb.data[i + 1]) + Math.abs(rf.data[i + 2] - rb.data[i + 2]);
      if (d > threshold) {
        item.push(luma(rf.data, i));
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      } else if (d < 8) backdrop.push(luma(rf.data, i));
    }
  }
  const mean = a => a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(2) : null;
  const median = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return +s[Math.floor(s.length / 2)].toFixed(2); };
  const total = rf.info.width * rf.info.height;
  return {
    itemMean: mean(item), itemMedian: median(item), backdropMean: mean(backdrop),
    pixels: item.length, backdropPixels: backdrop.length,
    coverage: +(item.length / (box.width * box.height) * 100).toFixed(1),
    box: item.length ? {x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1} : null,
  };
};
const diffArea = async (a, b, box) => {
  const [ra, rb] = [await raw(a), await raw(b)];
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
const findItem = async id => {
  for (const d of ['complete-dialog', 'collection-dialog', 'settings-dialog']) {
    if (await page.$eval('#' + d, el => el.open).catch(() => false)) await page.evaluate(i => document.getElementById(i).close(), d);
  }
  await page.evaluate(i => window.__GAME_TEST__.forceNext(i), id);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => document.querySelector('#search-button').click()); await wait(80); }
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(140);
};
const leave = async which => { await page.evaluate(w => document.querySelector('#' + w).click(), which); await wait(140); };

// The tone pass takes about 15 minutes under software WebGL; SKIP_TONE=1 reruns only
// the contrast and rotation probes.
const skipTone = process.env.SKIP_TONE === '1';

// --- 1. item-only tone ------------------------------------------------------
const ids = await page.evaluate(() => window.__GAME_TEST__.items);
for (const id of skipTone ? [] : ids) {
  await findItem(id);
  const stage = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
  const box = {x: Math.floor(stage.x), y: Math.floor(stage.y), width: Math.ceil(stage.width), height: Math.ceil(stage.height)};
  await page.evaluate(() => window.__GAME_TEST__.seekReveal(0.1));
  await wait(90);
  const bg = await page.screenshot({type: 'webp', quality: 92});
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(120);
  const fg = await page.screenshot({type: 'webp', quality: 92});
  const own = await itemPixels(fg, bg, box);
  report.itemTone.push({id, ...own, stageBox: box});
  console.log('TONE', id.padEnd(9), 'item mean', own.itemMean, 'median', own.itemMedian, 'backdrop', own.backdropMean,
    'delta', own.itemMean != null && own.backdropMean != null ? +(own.itemMean - own.backdropMean).toFixed(1) : null,
    'pixels', own.pixels, `(${own.coverage}% of the stage)`, 'bbox', own.box && `${own.box.w}x${own.box.h}`);
  await leave('keep');
}

// --- 1b. label contrast, done properly -------------------------------------
// A two-cluster split of a text crop does not work: the glyphs occupy a few percent
// of the box, so both clusters land on background and the result reads as ~1.3:1 for
// text that is plainly readable. Here the declared colour comes from the DOM and the
// backdrop is the most frequent pixel colour in the crop, which is what a reviewer
// actually compares against.
const luma = (r, g, b) => {
  const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
const contrast = async (buf, box, declared) => {
  const {data, info} = await raw(buf);
  const counts = new Map();
  for (let y = Math.max(0, box.y); y < Math.min(info.height, box.y + box.height); y++) {
    for (let x = Math.max(0, box.x); x < Math.min(info.width, box.x + box.width); x++) {
      const i = (y * info.width + x) * info.channels;
      const key = `${data[i] >> 2},${data[i + 1] >> 2},${data[i + 2] >> 2}`;
      const e = counts.get(key) || {n: 0, r: 0, g: 0, b: 0};
      e.n++; e.r += data[i]; e.g += data[i + 1]; e.b += data[i + 2];
      counts.set(key, e);
    }
  }
  const values = [...counts.values()];
  // A label can sit entirely outside the captured frame (a dialog scrolled below the
  // fold); without pixels there is nothing to measure, so say so instead of crashing.
  if (!values.length) return {declared, backdrop: null, backdropShare: 0, ratio: null, note: 'no visible pixels in the frame'};
  const top = values.sort((a, b) => b.n - a.n).slice(0, 3);
  const total = values.reduce((s, e) => s + e.n, 0);
  const bg = top[0];
  const bgColor = [bg.r / bg.n, bg.g / bg.n, bg.b / bg.n].map(Math.round);
  const [dr, dg, db] = (declared.match(/\d+/g) || []).slice(0, 3).map(Number);
  const ratio = (Math.max(luma(dr, dg, db), luma(...bgColor)) + .05) / (Math.min(luma(dr, dg, db), luma(...bgColor)) + .05);
  return {declared: [dr, dg, db], backdrop: bgColor, backdropShare: +(bg.n / total * 100).toFixed(1), ratio: +ratio.toFixed(2)};
};
const labelSet = async (buf, pairs) => {
  const out = [];
  for (const [name, sel] of pairs) {
    const meta = await page.evaluate(s => {
      const el = document.querySelector(s);
      if (!el || el.offsetParent === null) return null;
      const b = el.getBoundingClientRect();
      return {color: getComputedStyle(el).color, font: getComputedStyle(el).fontSize, weight: getComputedStyle(el).fontWeight, text: el.textContent.trim().slice(0, 18), box: {x: Math.max(0, Math.round(b.x)), y: Math.max(0, Math.round(b.y)), width: Math.round(b.width), height: Math.round(b.height)}};
    }, sel);
    if (!meta || meta.box.width < 3 || meta.box.height < 3) continue;
    out.push({name, ...meta, measured: await contrast(buf, meta.box, meta.color)});
  }
  return out;
};
await page.reload({waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
const searchShot = await page.screenshot({type: 'webp', quality: 95});
report.contrastSearch = await labelSet(searchShot, [
  ['headline', '.hero h1'], ['tagline', '.hero > p'], ['eyebrow', '.hero .eyebrow'],
  ['field-note', '.field-note p'], ['field-label', '.field-note > span:last-child'],
  ['location', '.top-location'], ['caption', '#search-caption'], ['hint', '.control-hint'],
  ['wordmark', '.wordmark span'], ['place', '.place div'], ['session-label', '.session-stat small'],
]);
await findItem('camera');
const inspectShot = await page.screenshot({type: 'webp', quality: 95});
report.contrastInspect = await labelSet(inspectShot, [
  ['rarity-chip', '#find-rarity'], ['find-number', '#find-number'], ['era', '#find-era'],
  ['name', '#find-name'], ['description', '#find-description'], ['rotate-hint', '.rotation-hint span'],
  ['zoom-reset', '#zoom-reset'], ['pose-active', '.view-controls button[aria-pressed="true"]'],
  ['pose-idle', '.view-controls button[aria-pressed="false"]'], ['discard', '#discard'], ['keep', '#keep'],
]);
await leave('discard');
await page.evaluate(() => window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items));
await page.evaluate(() => document.querySelector('#open-collection').click());
const archiveShot = await page.screenshot({type: 'webp', quality: 95});
report.contrastArchive = await labelSet(archiveShot, [
  ['dialog-eyebrow', '.collection-dialog .eyebrow'], ['dialog-title', '.collection-dialog .dialog-header h2'],
  ['summary', '.collection-summary > span'], ['filter-active', '.filter-tabs button.active'],
  ['filter-idle', '.filter-tabs button:not(.active)'], ['catalog-hint', '.catalog-hint'],
  ['item-title', '.item-card .item-title'], ['item-type', '.item-card .item-type'], ['item-index', '.item-card .item-index'],
  ['dialog-foot', '.dialog-foot span'],
]);
await page.evaluate(() => document.querySelector('[data-close="collection-dialog"]').click());
await page.evaluate(() => document.querySelector('#open-settings').click());
const settingsShot = await page.screenshot({type: 'webp', quality: 95});
report.contrastSettings = await labelSet(settingsShot, [
  ['title', '.small-dialog h2'], ['step', '.instructions p'], ['step-note', '.instructions small'],
  ['switch-label', '.quality-setting > span'], ['switch-note', '.quality-setting small'],
  ['settings-note', '.settings-note'], ['reset', '#reset-button'],
]);
await page.evaluate(() => document.querySelector('[data-close="settings-dialog"]').click());
console.log('CONTRAST search', report.contrastSearch.map(c => `${c.name}:${c.measured.ratio}`).join(' '));
console.log('CONTRAST inspect', report.contrastInspect.map(c => `${c.name}:${c.measured.ratio}`).join(' '));
console.log('CONTRAST archive', report.contrastArchive.map(c => `${c.name}:${c.measured.ratio}`).join(' '));
console.log('CONTRAST settings', report.contrastSettings.map(c => `${c.name}:${c.measured.ratio}`).join(' '));

// --- 2. free rotation: which angles does a drag reach? ---------------------
// A drag of n px changes the target angle by n * 0.01 rad, clamped to +-pi, so the
// test drives the angle directly through repeated small drags and measures the find
// at the angles a player passes through.
for (const id of ['record', 'paper', 'badge']) {
  await findItem(id);
  const stage = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
  const box = {x: Math.floor(stage.x), y: Math.floor(stage.y), width: Math.ceil(stage.width), height: Math.ceil(stage.height)};
  const cx = Math.round(stage.x + stage.width / 2), cy = Math.round(stage.y + stage.height / 2);
  await page.evaluate(() => window.__GAME_TEST__.seekReveal(0.1));
  await wait(90);
  const bg = await page.screenshot({type: 'webp', quality: 92});
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(120);
  const rows = [];
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  let travelled = 0;
  for (let step = 0; step < 32; step++) {
    await page.mouse.move(cx, cy + travelled * .84, {steps: 1});
    await wait(70);
    const rot = await page.evaluate(() => window.__GAME_TEST__.getRotation());
    const frame = await page.screenshot({type: 'webp', quality: 90});
    const area = await diffArea(frame, bg, box);
    rows.push({rotX: +rot.x.toFixed(3), area: area?.area ?? 0, w: area?.w ?? 0, h: area?.h ?? 0});
    if (rot.x > 3.13 && rows.length > 4) break;
    travelled += 24;
  }
  await page.mouse.up();
  report.rotation.push({id, rows});
  const worst = rows.reduce((a, b) => (a.area <= b.area ? a : b));
  console.log('ROTATION', id.padEnd(9), 'min area', worst.area, 'at rotX', worst.rotX, 'of', rows.length, 'samples');
  await leave('discard');
}

await browser.close();
report.passed = report.errors.length === 0;
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log('REPORT', outPath);
