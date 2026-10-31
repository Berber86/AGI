// PWA icons, generated: a campfire drawn in code at 16x16 and scaled up by whole pixels, encoded as PNG
// with zlib. No design files, no image libraries — the same "art is code" rule as the effects.

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const ART = [
  "................",
  "................",
  ".......##.......",
  "......####......",
  ".....######.....",
  "....########....",
  "....###oo###....",
  "...###oooo###...",
  "...##o####o##...",
  "..###o####o###..",
  "..##oo####oo##..",
  "..###########...",
  "..bb########bb..",
  ".bbbbbbbbbbbbbb.",
  "..bb..bbbb..bb..",
  "................",
];

const COLORS = {
  ".": [10, 20, 14, 255],
  "#": [255, 174, 53, 255],
  o: [255, 248, 214, 255],
  b: [58, 40, 24, 255],
};

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function png(size) {
  const scale = size / 16;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = COLORS[ART[Math.floor(y / scale)][Math.floor(x / scale)]] ?? COLORS["."];
      raw[p++] = r;
      raw[p++] = g;
      raw[p++] = b;
      raw[p++] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync("public/icons", { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(`public/icons/icon-${size}.png`, png(size));
  console.log(`public/icons/icon-${size}.png`);
}
