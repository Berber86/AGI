// Debug sheet: every sprite on a plain background, so art bugs are visible instead of hidden by the night.
//   npx vite-node scripts/sprites-sheet.ts
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { createFrame, Painter, composite } from "../src/core/frame.js";
import { hex } from "../src/core/color.js";
import { AMBER, BEETLE, BEETLE_WINDUP, FIREFLY, HERO_IDLE, HERO_STEP, SLUG, SLUG_WINDUP } from "../src/art/sprites.js";
import type { SpriteDef } from "../src/art/sprites.js";

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (b: Uint8Array) => {
  let c = 0xffffffff;
  for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (t: string, d: Uint8Array) => {
  const l = Buffer.alloc(4);
  l.writeUInt32BE(d.length);
  const body = Buffer.concat([Buffer.from(t, "ascii"), Buffer.from(d)]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(body));
  return Buffer.concat([l, body, c]);
};
const png = (rgba: Uint8ClampedArray, w: number, h: number, zoom = 4) => {
  const W = w * zoom;
  const H = h * zoom;
  const raw = Buffer.alloc(H * (W * 4 + 1));
  let p = 0;
  for (let y = 0; y < H; y++) {
    raw[p++] = 0;
    for (let x = 0; x < W; x++) {
      const si = (Math.floor(y / zoom) * w + Math.floor(x / zoom)) * 4;
      raw[p++] = rgba[si];
      raw[p++] = rgba[si + 1];
      raw[p++] = rgba[si + 2];
      raw[p++] = 255;
    }
  }
  const ih = Buffer.alloc(13);
  ih.writeUInt32BE(W, 0);
  ih.writeUInt32BE(H, 4);
  ih[8] = 8;
  ih[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ih),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

const W = 200;
const H = 100;
const f = createFrame(W, H);
const p = new Painter(f);
p.rect(0, 0, W - 1, H - 1, hex("#101a13"));
const list: [string, SpriteDef][] = [
  ["hero idle", HERO_IDLE],
  ["hero step", HERO_STEP],
  ["slug", SLUG],
  ["slug wind", SLUG_WINDUP],
  ["beetle", BEETLE],
  ["beetle wind", BEETLE_WINDUP],
  ["firefly", FIREFLY],
  ["amber", AMBER],
];
list.forEach(([, def], i) => {
  const cx = 22 + (i % 4) * 44;
  const cy = 34 + Math.floor(i / 4) * 40;
  p.place(cx, cy);
  p.sprite(def.rows, def.pal, -def.ax, -def.ay);
  p.dot(0, 0, hex("#ff00ff"));
});
const out = new Uint8ClampedArray(W * H * 4);
composite(f, out, null);
mkdirSync("/home/user/shots/frames", { recursive: true });
writeFileSync("/home/user/shots/frames/sprites.png", png(out, W, H, 4));
console.log("/home/user/shots/frames/sprites.png");
