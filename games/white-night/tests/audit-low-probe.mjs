// Probe bin vs wall separation in the SEARCH view, high vs low quality.
// (The older quality-diff probes sampled the inspection veil, not the yard.)
import {launch} from './browser.mjs';
import sharp from 'sharp';

const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(180000);
await page.setViewport({width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/?test=1', {waitUntil: 'networkidle0'});
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__);
await new Promise(r => setTimeout(r, 600));

const probes = {bin: [206, 520], wall: [36, 330], ground: [360, 760], sky: [206, 120]};
const luma = ([r, g, b]) => Math.round(r * .299 + g * .587 + b * .114);
const read = async label => {
  const buf = await page.screenshot({type: 'png'});
  const {data, info} = await sharp(buf).raw().toBuffer({resolveWithObject: true});
  const out = {};
  for (const [k, [x, y]] of Object.entries(probes)) {
    const i = (y * info.width + x) * info.channels;
    out[k] = [data[i], data[i + 1], data[i + 2]];
  }
  console.log(label, JSON.stringify(out), 'bin-wall luma delta =', Math.abs(luma(out.bin) - luma(out.wall)));
  return out;
};

await read('HIGH');
await page.evaluate(() => document.querySelector('#open-settings').click());
await page.evaluate(() => document.querySelector('#low-quality').click());
await page.evaluate(() => document.querySelector('#settings-dialog').close());
await new Promise(r => setTimeout(r, 700));
await read('LOW');
await browser.close();
