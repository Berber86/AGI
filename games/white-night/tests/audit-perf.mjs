// Performance baseline/guard. Reports GPU and scene metrics for the states that matter
// so a graphics pass can be compared against the previous one instead of guessed at.
import {launch} from './browser.mjs';
import fs from 'node:fs';

const tag = process.env.TAG || 'baseline';
const out = process.env.OUT || `../../.studio/evidence/reports/perf-${tag}.json`;

const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(180000);
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

const read = async label => {
  const m = await page.evaluate(() => window.__GAME_TEST__.getMetrics());
  return {
    label,
    drawCalls: m.drawCalls,
    triangles: m.triangles,
    geometries: m.geometries,
    textures: m.textures,
    models: m.models,
    postprocessing: m.postprocessing,
    meanFrameMs: +m.meanFrameMs.toFixed(2),
    quality: m.quality,
  };
};

const open = async id => {
  await page.evaluate(id => window.__GAME_TEST__.forceNext(id), id);
  for (let i = 0; i < 3; i++) await page.evaluate(() => document.querySelector('#search-button').click());
  await page.evaluate(() => window.__GAME_TEST__.settle());
};
const setLow = async () => {
  await page.evaluate(() => document.querySelector('#open-settings').click());
  await page.evaluate(() => document.querySelector('#low-quality').click());
  await page.evaluate(() => document.querySelector('#settings-dialog').close());
  await new Promise(r => setTimeout(r, 600));
};
const setHigh = async () => {
  await page.evaluate(() => document.querySelector('#open-settings').click());
  await page.evaluate(() => document.querySelector('#low-quality').click());
  await page.evaluate(() => document.querySelector('#settings-dialog').close());
  await new Promise(r => setTimeout(r, 600));
};

const rows = [];
for (const [w, h, name] of [[412, 915, 'phone'], [1280, 900, 'desktop']]) {
  await page.setViewport({width: w, height: h, isMobile: w < 900, hasTouch: w < 900, deviceScaleFactor: 1});
  await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
  await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
  await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
  await new Promise(r => setTimeout(r, 500));
  rows.push(await read(`${name}/courtyard/high`));
  await open('camera');
  rows.push(await read(`${name}/inspect-camera/high`));
  await open('record');
  rows.push(await read(`${name}/inspect-record/high`));
  await page.evaluate(() => document.querySelector('#discard').click());
  await setLow();
  await new Promise(r => setTimeout(r, 500));
  rows.push(await read(`${name}/courtyard/low`));
  await open('horse');
  rows.push(await read(`${name}/inspect-horse/low`));
  await page.evaluate(() => document.querySelector('#discard').click());
  await setHigh();
}

await browser.close();
const report = {tag, checkedAt: new Date().toISOString(), rows, errors,
  note: 'SwiftShader software rendering. Frame times are not device performance evidence; draw calls, triangles, geometries and textures are the comparable budgets.'};
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log('state'.padEnd(26), 'calls'.padEnd(7), 'tris'.padEnd(9), 'geo'.padEnd(6), 'tex'.padEnd(6), 'ms');
for (const r of rows) console.log(r.label.padEnd(26), String(r.drawCalls).padEnd(7), String(r.triangles).padEnd(9), String(r.geometries).padEnd(6), String(r.textures).padEnd(6), r.meanFrameMs);
console.log('errors', errors.length);
