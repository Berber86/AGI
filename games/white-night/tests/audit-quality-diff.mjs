// Measure the inspection backdrop in high vs low quality for the same item.
import {launch} from './browser.mjs';
import sharp from 'sharp';

const browser = await launch();
const page = await browser.newPage();
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);

const open = async () => {
  await page.evaluate(() => window.__GAME_TEST__.forceNext('horse'));
  for (let i = 0; i < 3; i++) await page.evaluate(() => document.querySelector('#search-button').click());
  await page.evaluate(() => window.__GAME_TEST__.settle());
};
const setLow = async low => {
  await page.click('#open-settings');
  await page.click('#low-quality');
  await page.click('[data-close="settings-dialog"]');
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => window.__GAME_TEST__.settle());
  await new Promise(r => setTimeout(r, 300));
};

const probes = {skyTop: [206, 250], wallLeft: [30, 300], binRight: [370, 470], ground: [206, 640], stage: [206, 200]};
const read = async label => {
  const buf = await page.screenshot({type: 'png'});
  const {data, info} = await sharp(buf).raw().toBuffer({resolveWithObject: true});
  const out = {};
  for (const [k, [x, y]] of Object.entries(probes)) {
    const i = (y * info.width + x) * info.channels;
    out[k] = [data[i], data[i + 1], data[i + 2]];
  }
  console.log(label, JSON.stringify(out));
  return out;
};

await open();
const high = await read('HIGH');
await setLow(true);
const low = await read('LOW ');
await browser.close();
