// Минимальный PNG-декодер (8 бит, RGB/RGBA, без чересстрочности) на встроенном zlib — без зависимостей.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

export function readPNG(path) {
  const buf = readFileSync(path);
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[12] !== 0) throw new Error('unsupported PNG');
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!bpp) throw new Error('unsupported color type ' + colorType);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y ? out[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y ? out[(y - 1) * stride + x - bpp] : 0;
      let r;
      if (f === 0) r = v;
      else if (f === 1) r = v + a;
      else if (f === 2) r = v + b;
      else if (f === 3) r = v + ((a + b) >> 1);
      else {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
      }
      out[y * stride + x] = r & 255;
    }
  }
  if (bpp === 3) return { width, height, data: out };
  const rgb = Buffer.alloc(width * height * 3);
  for (let i = 0; i < width * height; i++) out.copy(rgb, i * 3, i * 4, i * 4 + 3);
  return { width, height, data: rgb };
}

/** Настоящие грани кубиков с фото пользователя: 9 квадратов 80×80 — Y,R,K,P,G,B,C,L и фон. */
export function realCubeTextures(path) {
  const img = readPNG(path);
  const keys = ['Y', 'R', 'K', 'P', 'G', 'B', 'C', 'L', 'bg'];
  const out = {};
  keys.forEach((k, n) => {
    const data = Buffer.alloc(80 * 80 * 3);
    for (let y = 0; y < 80; y++) img.data.copy(data, y * 240, (y * img.width + n * 80) * 3, (y * img.width + n * 80 + 80) * 3);
    out[k] = { width: 80, height: 80, data };
  });
  return out;
}
