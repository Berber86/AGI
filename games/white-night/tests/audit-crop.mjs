// Zoom into a region of a capture so small props can be judged properly.
// Usage: node tests/audit-crop.mjs <file> <x> <y> <w> <h> [scale] [out]
import sharp from 'sharp';
import path from 'node:path';

const [file, x, y, w, h, scale = 2, out] = process.argv.slice(2);
if (!file) {
  console.error('usage: node tests/audit-crop.mjs <file> <x> <y> <w> <h> [scale] [out]');
  process.exit(1);
}
const target = out || file.replace(/(\.\w+)$/, '-crop$1');
await sharp(file)
  .extract({left: +x, top: +y, width: +w, height: +h})
  .resize({width: Math.round(+w * +scale)})
  .toFile(target);
console.log(target);
