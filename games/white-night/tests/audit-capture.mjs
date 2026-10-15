// Audit capture: a wide visual sample used to review the current build by eye.
// Writes screenshots + a machine-readable index to .studio/evidence/.
import {launch} from './browser.mjs';
import fs from 'node:fs';
import sharp from 'sharp';

const series = process.env.SERIES || 'v6';
const iteration = process.env.ITERATION || 'audit';
const folder = `../../.studio/evidence/screenshots/visual-${series}-${iteration}`;
fs.mkdirSync(folder, {recursive: true});

const browser = await launch();
const errors = [];
const shots = [];
const page = await browser.newPage();
page.setDefaultTimeout(180000);
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

const shot = async (name, note) => {
  const path = `${folder}/${name}.webp`;
  if (fs.existsSync(path) && process.env.RESUME) { console.log('SKIP', name); return; }
  await page.screenshot({path, type: 'webp', quality: 88});
  const stat = await sharp(path).stats();
  shots.push({name, note, mean: +stat.channels.map(c => c.mean.toFixed(1)).join('/')});
  console.log('SHOT', name, '-', note);
};
// A modal dialog makes the rest of the document inert and swallows synthetic clicks.
const dismiss = async () => {
  for (const id of ['complete-dialog', 'collection-dialog', 'settings-dialog']) {
    if (await page.$eval('#' + id, d => d.open).catch(() => false)) await page.evaluate(i => document.getElementById(i).close(), id);
  }
};
const ready = async () => { await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__); };
const find = async id => {
  await dismiss();
  await new Promise(r => setTimeout(r, 250));
  await page.evaluate(id => window.__GAME_TEST__.forceNext(id), id);
  // A synthetic mouse click right after a modal closes can be swallowed; drive the
  // button directly and assert the phase so a silent miss cannot pass unnoticed.
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => document.querySelector('#search-button').click());
    await new Promise(r => setTimeout(r, 120));
  }
  const phase = await page.evaluate(() => window.__GAME_TEST__.getState().phase);
  if (phase !== 'inspect') throw new Error(`find(${id}) did not open an inspection (phase=${phase})`);
  await page.evaluate(() => window.__GAME_TEST__.settle());
};
const setView = async (w, h, mobile = true) => {
  await page.setViewport({width: w, height: h, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1});
  await ready();
  await new Promise(r => setTimeout(r, 400));
};

await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await ready();

// --- 1. Courtyard / search phase across viewports -----------------------------
await shot('search-412', 'courtyard, search phase, portrait');
await setView(360, 800);
await shot('search-360', 'courtyard, search phase, narrow phone');
await setView(1280, 900, false);
await shot('search-1280', 'courtyard, search phase, desktop');
await setView(844, 390, true);
await shot('search-844', 'courtyard, search phase, landscape phone');

// --- 2. All 18 finds in their authored pose ----------------------------------
await setView(412, 915);
const ids = await page.evaluate(() => window.__GAME_TEST__.items);
for (const id of ids) {
  await find(id);
  await shot(`item-${id}`, `inspection, authored pose`);
  await page.click('#keep');
}
await dismiss();

// --- 3. Alternate poses on cavity-prone objects ------------------------------
await setView(412, 915);
for (const id of ['teacup', 'can', 'watch', 'record', 'duck']) {
  await find(id);
  for (const pose of ['back', 'top', 'bottom']) {
    await page.evaluate(p => window.__GAME_TEST__.setPose(p), pose);
    await new Promise(r => setTimeout(r, 350));
    await shot(`pose-${id}-${pose}`, `inspection, ${pose} pose`);
  }
  await page.click('#discard');
}

// --- 4. Zoom behaviour --------------------------------------------------------
await find('camera');
for (let i = 0; i < 5; i++) { if (!(await page.$eval('#zoom-in', b => b.disabled))) await page.click('#zoom-in'); }
await shot('zoom-max-camera', 'inspection, maximum zoom');
await page.click('#zoom-reset');
for (let i = 0; i < 5; i++) { if (!(await page.$eval('#zoom-out', b => b.disabled))) await page.click('#zoom-out'); }
await shot('zoom-min-camera', 'inspection, minimum zoom');
await page.click('#zoom-reset');
await page.click('#discard');

// --- 5. Archive / dialogs -----------------------------------------------------
await page.evaluate(() => window.__GAME_TEST__.setCollection([]));
await page.click('#open-collection');
await shot('collection-empty', 'collection, nothing owned yet');
await page.click('[data-close="collection-dialog"]');
await page.evaluate(() => window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items));
await page.click('#open-collection');
await shot('collection-full', 'collection, 18/18 owned');
await page.click('[data-filter="junk"]');
await shot('collection-junk', 'collection, junk filter');
await page.click('[data-filter="all"]');
await page.click('[data-close="collection-dialog"]');
await page.click('#open-settings');
await shot('settings', 'settings dialog');
await page.click('[data-close="settings-dialog"]');

// --- 6. Reveal sequence frames (needs real motion, not reduced motion) -------
const motionPage = await browser.newPage();
await motionPage.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await motionPage.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'no-preference'}]);
await motionPage.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await motionPage.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
await motionPage.evaluate(() => window.__GAME_TEST__.forceNext('horse'));
for (let i = 0; i < 3; i++) await motionPage.evaluate(() => document.querySelector('#search-button').click());
for (const p of [0.05, 0.3, 0.45, 0.7, 1]) {
  await motionPage.evaluate(v => window.__GAME_TEST__.seekReveal(v), p);
  await new Promise(r => setTimeout(r, 150));
  const path = `${folder}/reveal-${String(p).replace('.', '_')}.webp`;
  await motionPage.screenshot({path, type: 'webp', quality: 88});
  shots.push({name: `reveal-${p}`, note: 'reveal sequence, real motion'});
  console.log('SHOT', 'reveal-' + p);
}
await motionPage.close();

// --- 7. Low-quality mode and landscape inspection ----------------------------
await setView(412, 915);
await page.click('#open-settings');
await page.click('#low-quality');
await page.click('[data-close="settings-dialog"]');
await new Promise(r => setTimeout(r, 400));
await shot('search-412-low', 'courtyard, low quality mode');
await page.click('#open-settings');
await page.click('#low-quality');
await page.click('[data-close="settings-dialog"]');
await setView(844, 390, true);
await find('record');
await shot('landscape-844-record', 'inspection, landscape phone, 844x390');
await setView(740, 360, true);
await shot('landscape-740-record', 'inspection, landscape phone, 740x360');
await setView(932, 430, true);
await shot('landscape-932-record', 'inspection, landscape phone, 932x430');

await browser.close();
fs.writeFileSync(`../../.studio/evidence/reports/visual-${series}-${iteration}-audit.json`,
  JSON.stringify({passed: errors.length === 0, shots, errors}, null, 2));
console.log('ERRORS', errors.length, errors.slice(0, 5));
