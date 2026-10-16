// Fast iteration probe for the v7 quality passes.
//
// The full critique sweep takes ~12 minutes and the tone pass ~20; a single quality
// iteration needs a two-minute answer to three questions:
//
//   1. Is the find bright enough, big enough and inside the stage?
//      (per-item median tone, silhouette share of the stage, dominant extent, margins)
//   2. Do low and high quality still show the same night?
//      (same measurement in both modes)
//   3. Does anything overlap on the small screens?
//      (reveal note, toast, pose row, search controls)
//
//   npm run preview -- --port 5173   (separately)
//   TONE_IDS=key,camera,watch node tests/quality-probe.mjs
//   REVEAL=1 VIEWPORTS=1 node tests/quality-probe.mjs
import {launch} from './browser.mjs';
import {inspectionRect} from '../src/presentation.js';
import fs from 'node:fs';
import sharp from 'sharp';

const series = process.env.SERIES || 'v7';
const outPath = process.env.OUT || `../../.studio/evidence/reports/visual-${series}-probe.json`;
const URL = process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1';
const wait = ms => new Promise(r => setTimeout(r, ms));
const report = {passed: true, tone: [], parity: [], reveal: [], overlaps: [], errors: []};

const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(180000);
page.on('pageerror', e => report.errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'no-preference'}]);
await page.goto(URL, {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);

const raw = async buf => sharp(buf).raw().toBuffer({resolveWithObject: true});
const find = async id => {
  for (const d of ['complete-dialog', 'collection-dialog', 'settings-dialog']) {
    if (await page.$eval('#' + d, el => el.open).catch(() => false)) await page.evaluate(i => document.getElementById(i).close(), d);
  }
  await page.evaluate(i => window.__GAME_TEST__.forceNext(i), id);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => document.querySelector('#search-button').click()); await wait(80); }
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(140);
};
const leave = async () => { await page.evaluate(() => document.querySelector('#discard').click()); await wait(140); };
const setLow = async on => {
  await page.evaluate(() => document.querySelector('#open-settings').click());
  await page.evaluate(v => { const b = document.querySelector('#low-quality'); if (b.checked !== v) b.click(); }, on);
  await page.evaluate(() => document.querySelector('[data-close="settings-dialog"]').click());
  await wait(500);
};

// Item silhouette: pixels that differ between the revealed frame and the veiled one.
const shoot = async () => {
  await page.evaluate(() => window.__GAME_TEST__.seekReveal(0.1));
  await wait(120);
  const bg = await page.screenshot({type: 'webp', quality: 95});
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await wait(140);
  const fg = await page.screenshot({type: 'webp', quality: 95});
  return {bg, fg};
};
const measure = async (fg, bg, stage, bounds) => {
  const [rf, rb] = [await raw(fg), await raw(bg)];
  const luma = (d, i) => d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
  const item = [];
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, blown = 0, crushed = 0, n = 0;
  for (let y = stage.y; y < stage.y + stage.height; y++) {
    for (let x = stage.x; x < stage.x + stage.width; x++) {
      const i = (y * rf.info.width + x) * rf.info.channels;
      const v = luma(rf.data, i);
      n++;
      if (v >= 248) blown++;
      if (v <= 26) crushed++;
      const d = Math.abs(rf.data[i] - rb.data[i]) + Math.abs(rf.data[i + 1] - rb.data[i + 1]) + Math.abs(rf.data[i + 2] - rb.data[i + 2]);
      if (d > 24) {
        item.push(v);
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  const s = [...item].sort((a, b) => a - b);
  // Containment is read from the projected bounds the game itself reports; the pixel
  // diff above is only used for tone and for how much of the stage the find covers.
  const margin = bounds ? {
    left: Math.round(bounds.left - stage.x), right: Math.round(stage.x + stage.width - bounds.right),
    top: Math.round(bounds.top - stage.y), bottom: Math.round(stage.y + stage.height - bounds.bottom),
  } : null;
  const inStage = bounds ? bounds.left >= stage.x - 1 && bounds.right <= stage.x + stage.width + 1 && bounds.top >= stage.y - 1 && bounds.bottom <= stage.y + stage.height + 1 : null;
  return {
    median: s.length ? +s[Math.floor(s.length / 2)].toFixed(1) : null,
    mean: item.length ? +(item.reduce((a, v) => a + v, 0) / item.length).toFixed(1) : null,
    p25: s.length ? +s[Math.floor(s.length * .25)].toFixed(1) : null,
    share: +(item.length / (stage.width * stage.height) * 100).toFixed(1),
    dominant: bounds ? +Math.max((bounds.right - bounds.left) / stage.width, (bounds.bottom - bounds.top) / stage.height).toFixed(2) : null,
    bottomShare: bounds ? +((bounds.bottom - stage.y) / stage.height).toFixed(2) : null,
    margin, inStage,
    blown: +(blown / n * 100).toFixed(2), crushed: +(crushed / n * 100).toFixed(1),
  };
};

// SKIP_TONE=1 runs only the reveal and viewport sections.
const ids = process.env.SKIP_TONE === '1' ? [] : (process.env.TONE_IDS || (await page.evaluate(() => window.__GAME_TEST__.items)).join(',')).split(',').filter(Boolean);
for (const id of ids) {
  await find(id);
  const stage = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
  const {fg, bg} = await shoot();
  const bounds = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds);
  const m = await measure(fg, bg, stage, bounds);
  const rotation = await page.evaluate(() => window.__GAME_TEST__.getRotation());
  report.tone.push({id, ...m, rotation: {x: +rotation.x.toFixed(3), y: +rotation.y.toFixed(3)}});
  console.log('TONE', id.padEnd(9), 'median', String(m.median).padEnd(6), 'p25', String(m.p25).padEnd(6), 'share', String(m.share + '%').padEnd(7),
    'dominant', String(m.dominant).padEnd(5), 'bottom', String(m.bottomShare).padEnd(5), 'blown', String(m.blown).padEnd(5), 'crushed', String(m.crushed + '%').padEnd(7),
    'inStage', m.inStage, JSON.stringify(m.margin));
  if (process.env.PARITY === '1') {
    await leave();
    await setLow(true);
    await find(id);
    const stage2 = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
    const lowShots = await shoot();
    const bounds2 = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds);
    const lm = await measure(lowShots.fg, lowShots.bg, stage2, bounds2);
    report.parity.push({id, high: m, low: lm, deltaMean: +Math.abs(m.mean - lm.mean).toFixed(2), deltaMedian: +Math.abs(m.median - lm.median).toFixed(2)});
    console.log('PARITY', id.padEnd(9), 'high mean', m.mean, 'low mean', lm.mean, 'dMean', +Math.abs(m.mean - lm.mean).toFixed(2), 'dMedian', +Math.abs(m.median - lm.median).toFixed(2));
    await leave();
    await setLow(false);
  } else {
    await leave();
  }
}

if (process.env.REVEAL === '1') {
  await find(process.env.REVEAL_ID || 'camera');
  const stage = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds.stage);
  for (const p of [0.05, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1]) {
    await page.evaluate(v => window.__GAME_TEST__.seekReveal(v), p);
    await wait(120);
    const buf = await page.screenshot({type: 'webp', quality: 95});
    const {data, info} = await raw(buf);
    let sum = 0, n = 0, max = 0, lit = 0;
    for (let y = stage.y; y < stage.y + stage.height; y++) {
      for (let x = stage.x; x < stage.x + stage.width; x++) {
        const i = (y * info.width + x) * info.channels;
        const v = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
        sum += v; n++; if (v > max) max = v; if (v >= 90) lit++;
      }
    }
    const row = {p, mean: +(sum / n).toFixed(1), max: +max.toFixed(0), litPct: +(lit / n * 100).toFixed(2), phase: await page.evaluate(() => document.querySelector('#app').dataset.revealPhase)};
    report.reveal.push(row);
    console.log('REVEAL', String(p).padEnd(5), row.phase.padEnd(13), 'mean', String(row.mean).padEnd(6), 'max', String(row.max).padEnd(5), 'lit%', row.litPct);
  }
  await leave();
}

if (process.env.VIEWPORTS === '1') {
  for (const [w, h] of [[320, 568], [360, 640], [412, 915], [740, 360], [844, 390], [768, 1024], [1280, 900]]) {
    await page.setViewport({width: w, height: h, isMobile: w < 900, hasTouch: w < 900, deviceScaleFactor: 1});
    await wait(350);
    const search = await page.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)}; };
      const ov = (a, b) => Boolean(a && b && a.w && b.w && a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom);
      const hero = r('.hero'), search = r('.search-controls'), footer = r('.bottom-meta'), topbar = r('.topbar');
      return {hero, search, footer, topbar, searchVsFooter: ov(search, footer), searchVsHero: ov(search, hero), heroVsTopbar: ov(hero, topbar),
        overflow: document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1};
    });
    await find('camera');
    const inspect = await page.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)}; };
      const ov = (a, b) => Boolean(a && b && a.w && b.w && a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom);
      const note = r('#reveal-note'), info = r('.find-info'), name = r('#find-name'), era = r('#find-era'), poses = r('.view-controls'), zoom = r('.rotation-hint'), buttons = r('.decision-buttons'), toast = r('#toast');
      const bounds = window.__GAME_TEST__.getMetrics().inspectionBounds;
      const stage = bounds.stage;
      const findBottom = bounds.bottom;
      const itemBox = {x: Math.round(bounds.left), y: Math.round(bounds.top), right: Math.round(bounds.right), bottom: Math.round(findBottom)};
      return {
        stage: {h: Math.round(stage.height), y: Math.round(stage.y)},
        item: {top: itemBox.y, bottom: itemBox.bottom, left: itemBox.x, right: itemBox.right},
        note: r('#reveal-note'), info, poses, zoom,
        noteVsName: ov(note, name), noteVsEra: ov(note, era), infoVsButtons: ov(info, buttons),
        posesOverFind: ov(poses, itemBox), itemVsInfo: ov(itemBox, info), itemVsButtons: ov(itemBox, buttons),
        toastVsHero: ov(toast, r('.hero')), toastVsTopbar: ov(toast, r('.topbar')), toastVsButtons: ov(toast, buttons),
        noteVsSearch: false, overflow: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    // the note is only on screen while the caption is hidden; measure it in that phase
    await page.evaluate(() => window.__GAME_TEST__.seekReveal(0.35));
    await wait(140);
    const early = await page.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)}; };
      const ov = (a, b) => Boolean(a && b && a.w && b.w && a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom);
      const note = r('#reveal-note'), info = r('.find-info'), poses = r('.view-controls');
      const stage = window.__GAME_TEST__.getMetrics().inspectionBounds.stage;
      const bottom = window.__GAME_TEST__.getMetrics().inspectionBounds.bottom;
      // The caption block already occupies its slot in these phases, it is just invisible;
      // an overlap only matters once the text is actually on screen.
      const infoOpacity = +getComputedStyle(document.querySelector('.find-info')).opacity;
      return {note, infoOpacity, noteVsInfoRect: ov(note, info), noteVsInfo: infoOpacity > .05 && ov(note, info),
        noteVsPoses: ov(note, poses), noteInStage: note ? note.y >= stage.y : null, noteAboveFindBottom: note ? note.y > bottom : null};
    });
    // The stage the game reports must match the pure layout function. The comparison
    // has to wait for a frame: a headless software renderer can sit on a viewport change
    // for seconds, and reading straight after setViewport() reports the previous layout.
    const expected = inspectionRect(w, h);
    const layoutSettled = await page.waitForFunction(
      hh => Math.abs(window.__GAME_TEST__.getMetrics().inspectionBounds.stage.height - hh) < 1,
      {timeout: 6000}, Math.round(expected.height)).then(() => true).catch(() => false);
    // The reveal note is only useful while the caption is hidden; in the detail phase it
    // must be gone, otherwise it lands on the title (measured before: 11 px overlap).
    await page.evaluate(() => window.__GAME_TEST__.seekReveal(0.62));
    const noteGone = await page.waitForFunction(() => {
      const n = document.querySelector('#reveal-note');
      return n.hidden || +getComputedStyle(n).opacity <= .05;
    }, {timeout: 6000}).then(() => true).catch(() => false);
    const latePhase = await page.evaluate(() => {
      const note = document.querySelector('#reveal-note');
      // Read the rule, not the animation: in this sandbox a frame can take seconds, so a
      // 0.22 s fade measured in wall-clock time reads mid-transition or not started at all.
      const held = note.style.transition;
      note.style.transition = 'none';
      void note.offsetWidth;
      const opacity = +getComputedStyle(note).opacity;
      note.style.transition = held;
      return {phase: document.querySelector('#app').dataset.revealPhase, noteOpacity: opacity, noteHidden: note.hidden};
    });
    // Type sizes and overflow: the critique measures these too, but a three-minute answer
    // keeps the iteration loop honest between full sweeps.
    const type = await page.evaluate(() => {
      const pick = s => document.querySelector(s);
      const of = el => el ? {font: getComputedStyle(el).fontSize, w: Math.round(el.getBoundingClientRect().width), text: (el.textContent || '').trim().slice(0, 22)} : null;
      return {
        rarity: of(pick('.rarity')), findNumber: of(pick('#find-number')), era: of(pick('.find-info .eyebrow')),
        name: of(pick('.find-info h2')), description: of(pick('.find-info p')), rotate: of(pick('.rotation-hint')),
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
        overflowY: document.documentElement.scrollHeight > innerHeight + 1,
        header: (() => { const b = pick('.find-header')?.getBoundingClientRect(); return b ? {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), right: Math.round(b.right)} : null; })(),
      };
    });
    inspect.type = type;
    const toast = await page.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)}; };
      const ov = (a, b) => Boolean(a && b && a.w && b.w && a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom);
      return {rect: r('#toast'), visible: getComputedStyle(document.querySelector('#toast')).opacity, vsHero: ov(r('#toast'), r('.hero'))};
    });
    // trigger a real toast
    await page.evaluate(() => document.querySelector('#keep').click());
    await wait(260);
    const liveToast = await page.evaluate(() => {
      const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right)}; };
      const ov = (a, b) => Boolean(a && b && a.w && b.w && a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom);
      const t = r('#toast'), hero = r('.hero'), topbar = r('.topbar'), search = r('.search-controls');
      return {rect: t, opacity: +getComputedStyle(document.querySelector('#toast')).opacity, vsHero: ov(t, hero), vsTopbar: ov(t, topbar), vsSearch: ov(t, search), onScreen: t ? (t.y > 0 && t.bottom < innerHeight) : null};
    });
    report.overlaps.push({w, h, expectedStageHeight: Math.round(expected.height), expectedStageY: Math.round(expected.y), layoutSettled, noteGone, search, inspect, early, latePhase, toast, liveToast});
    console.log('VIEW', `${w}x${h}`.padEnd(9), 'stageH', String(inspect.stage.h).padEnd(4),
      'searchVsFooter', search.searchVsFooter, 'overflow', search.overflow || inspect.overflow,
      '| noteVsInfo(early)', early.noteVsInfo, 'noteVsPoses', early.noteVsPoses,
      '| item', `${inspect.item.left},${inspect.item.top}→${inspect.item.right},${inspect.item.bottom}`,
      '| poses', inspect.poses ? `${inspect.poses.y}–${inspect.poses.bottom}` : '—',
      '| posesOverFind', inspect.posesOverFind, 'itemVsInfo', inspect.itemVsInfo, 'itemVsButtons', inspect.itemVsButtons,
      'infoVsButtons', inspect.infoVsButtons,
      '| stageH', String(inspect.stage.h).padEnd(4), 'expected', Math.round(expected.height),
      '| note@0.62 op', latePhase.noteOpacity, latePhase.phase,
      '| type rarity', type.rarity && type.rarity.font, 'number', type.findNumber && type.findNumber.font,
      'era', type.era && type.era.font, 'hint', type.rotate && type.rotate.font,
      '| overflow', type.overflowX || type.overflowY,
      '| liveToast', JSON.stringify(liveToast.rect), 'vsHero', liveToast.vsHero, 'vsSearch', liveToast.vsSearch);
    await wait(1900);
  }
  await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
}

await browser.close();
const tone = report.tone;
if (tone.length) {
  const medians = tone.map(t => t.median);
  console.log('SUMMARY median tone min', Math.min(...medians), 'max', Math.max(...medians),
    'below45', tone.filter(t => t.median < 45).map(t => t.id).join(',') || 'none',
    '| share', Math.min(...tone.map(t => t.share)) + '–' + Math.max(...tone.map(t => t.share)) + '%',
    '| outside stage', tone.filter(t => !t.inStage).map(t => t.id).join(',') || 'none');
}
report.passed = report.errors.length === 0 && tone.every(t => t.inStage);
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log('REPORT', outPath, 'passed', report.passed, 'errors', report.errors.length, report.errors.slice(0, 3));
