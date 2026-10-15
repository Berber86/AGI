// Regression guard: an archive thumbnail must contain the find, not only a background.
// The previous check only verified that the corner pixel was display-encoded, which a
// perfectly flat background satisfies — that is how an empty archive passed the gate.
import {launch} from './browser.mjs';
import assert from 'node:assert/strict';

const browser = await launch();
const page = await browser.newPage();
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);

await page.evaluate(() => window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items));
await page.evaluate(() => document.querySelector('#open-collection').click());
await page.waitForFunction(() => [...document.querySelectorAll('#collection-grid .item-card img')].every(i => i.complete && i.naturalWidth === 160));

const stats = await page.evaluate(async () => {
  const out = [];
  for (const img of document.querySelectorAll('#collection-grid .item-card img')) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let sum = 0, sum2 = 0, n = 0;
    const set = new Set();
    for (let i = 0; i < d.length; i += 4) {
      const l = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
      sum += l; sum2 += l * l; n++;
      if (i % 7 === 0) set.add(`${d[i] >> 3},${d[i + 1] >> 3},${d[i + 2] >> 3}`);
    }
    const mean = sum / n;
    out.push({
      id: img.closest('.item-card').dataset.id,
      mean: +mean.toFixed(2),
      sd: +Math.sqrt(Math.max(0, sum2 / n - mean * mean)).toFixed(2),
      distinct: set.size,
    });
  }
  return out;
});

await browser.close();
assert.equal(stats.length, 18, 'expected 18 archive thumbnails');
const flat = stats.filter(s => s.sd < 4 || s.distinct < 12);
console.log('id'.padEnd(10), 'mean'.padEnd(8), 'sd'.padEnd(8), 'distinct');
for (const s of stats) console.log(s.id.padEnd(10), String(s.mean).padEnd(8), String(s.sd).padEnd(8), s.distinct);
assert.deepEqual(flat.map(s => s.id), [], `archive thumbnails contain no object: ${flat.map(s => s.id).join(', ')}`);
console.log('PASS all 18 archive thumbnails contain a rendered find');
