#!/usr/bin/env node
/**
 * Crops and zooms part of a screenshot so the details of the chase view can be
 * inspected without a device browser.
 *
 * Usage: node scripts/crop.mjs <in.png> <out.png> <x> <y> <w> <h> [zoom]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const [input, output, x, y, w, h, zoom = '2'] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/crop.mjs <in.png> <out.png> <x> <y> <w> <h> [zoom]');
  process.exit(1);
}

const image = await loadImage(readFileSync(input));
const scale = Number(zoom);
const canvas = createCanvas(Math.round(Number(w) * scale), Math.round(Number(h) * scale));
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.drawImage(
  image,
  Number(x),
  Number(y),
  Number(w),
  Number(h),
  0,
  0,
  canvas.width,
  canvas.height,
);
writeFileSync(output, canvas.toBuffer('image/png'));
console.log(`${output} ${canvas.width}x${canvas.height}`);
