// Which finds become unreadable in the top/bottom poses? Measure the visible area.
import {launch} from './browser.mjs';

const browser = await launch();
const page = await browser.newPage();
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);

const ids = ['record', 'paper', 'badge', 'lid', 'cassette', 'book', 'teacup', 'duck', 'can', 'bottle', 'camera'];
const rows = [];
for (const id of ids) {
  await page.evaluate(id => window.__GAME_TEST__.forceNext(id), id);
  for (let i = 0; i < 3; i++) await page.evaluate(() => document.querySelector('#search-button').click());
  await page.evaluate(() => window.__GAME_TEST__.settle());
  for (const pose of ['front', 'top', 'bottom']) {
    await page.evaluate(p => window.__GAME_TEST__.setPose(p), pose);
    await new Promise(r => setTimeout(r, 250));
    const b = await page.evaluate(() => window.__GAME_TEST__.getMetrics().inspectionBounds);
    const w = b.right - b.left, h = b.bottom - b.top;
    const area = w * h;
    rows.push({id, pose, w: Math.round(w), h: Math.round(h), area: Math.round(area), ratio: +(w / h).toFixed(2)});
  }
  await page.evaluate(() => document.querySelector('#discard').click());
  await new Promise(r => setTimeout(r, 150));
}
await browser.close();
console.log('id'.padEnd(10), 'pose'.padEnd(8), 'w'.padEnd(6), 'h'.padEnd(6), 'area'.padEnd(8), 'w/h');
for (const r of rows) console.log(r.id.padEnd(10), r.pose.padEnd(8), String(r.w).padEnd(6), String(r.h).padEnd(6), String(r.area).padEnd(8), r.ratio);
