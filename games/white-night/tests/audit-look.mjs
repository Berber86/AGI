// Fast look: a few representative frames for quick visual iteration.
import {launch} from './browser.mjs';
import fs from 'node:fs';

const folder = process.env.FOLDER || '../../.studio/evidence/screenshots/look';
fs.mkdirSync(folder, {recursive: true});
const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(180000);
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
const open = async id => {
  await page.evaluate(id => window.__GAME_TEST__.forceNext(id), id);
  for (let i = 0; i < 3; i++) await page.evaluate(() => document.querySelector('#search-button').click());
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await new Promise(r => setTimeout(r, 200));
};
await page.screenshot({path: `${folder}/search-412.webp`, type: 'webp', quality: 88});
for (const id of ['camera', 'teacup', 'record', 'duck']) {
  await open(id);
  await page.screenshot({path: `${folder}/item-${id}.webp`, type: 'webp', quality: 88});
  await page.evaluate(() => document.querySelector('#discard').click());
  await new Promise(r => setTimeout(r, 150));
}
await page.setViewport({width: 1280, height: 900, deviceScaleFactor: 1});
await new Promise(r => setTimeout(r, 600));
await page.screenshot({path: `${folder}/search-1280.webp`, type: 'webp', quality: 88});
await browser.close();
console.log('look frames in', folder);
