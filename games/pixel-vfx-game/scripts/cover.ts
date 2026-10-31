// Cover art for the catalog card: a real game frame at 1:1, scaled by whole pixels, so the thumbnail is
// the game itself rather than a drawing of it.
//
//   npx vite-node scripts/cover.ts /tmp/cover.png

import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { CONFIG, World, emptyInput } from "../src/game/world.js";
import { Renderer } from "../src/game/render.js";
import { Campfire, Fireflies, Leaves, HitFx, SlashFx } from "../src/fx/effects.js";

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
const png = (rgba: Uint8ClampedArray, w: number, h: number, zoom: number) => {
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
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

const outPath = process.argv[2] ?? "/tmp/cover.png";

const world = new World(7, 12);
world.carried = ["amber", "firefly"];
world.heroX = 118;
world.heroY = 126;
world.score = 14;
world.banked = 6;
world.kills = 3;
world.creatures.push(
  { id: 901, kind: "slug", x: 178, y: 126, hp: 1, state: "windup", t: 0.3, dirX: -1, dirY: 0, flash: 0, bob: 0.4 },
  { id: 902, kind: "beetle", x: 240, y: 84, hp: 2, state: "walk", t: 0, dirX: -1, dirY: 0.3, flash: 0, bob: 1.2 },
);
world.finds.push(
  { id: 801, kind: "amber", x: 74, y: 74, age: 0.4, life: 0, dropped: false, bob: 0.8 },
  { id: 802, kind: "firefly", x: 214, y: 132, age: 1.1, life: 0, dropped: false, bob: 2.1 },
  { id: 803, kind: "firefly", x: 74, y: 128, age: 0.2, life: 0, dropped: false, bob: 1.4 },
);

const scene = {
  campfire: new Campfire(CONFIG.fireX, CONFIG.fireY, 5),
  fireflies: new Fireflies(CONFIG.w, CONFIG.h, 9),
  leaves: new Leaves(CONFIG.w, CONFIG.h, 13),
  transient: [] as ReturnType<typeof HitFx>[],
};
for (let i = 0; i < 40; i++) world.step(1 / 60, emptyInput());
scene.transient.push(new SlashFx(world.heroX + 12, world.heroY - 7, 0.12, 3, 17) as never);
scene.transient.push(new HitFx(174, 122, 6) as never);
for (let i = 0; i < 6; i++) {
  scene.campfire.update(1 / 60);
  scene.fireflies.update(1 / 60);
  scene.leaves.update(1 / 60);
  for (const fx of scene.transient) fx.update(1 / 60);
}

const renderer = new Renderer();
const out = new Uint8ClampedArray(CONFIG.w * CONFIG.h * 4);
renderer.render(world, scene, out, { mode: "play", time: 1.1, best: 12, record: false });
writeFileSync(outPath, png(out, CONFIG.w, CONFIG.h, 4));
console.log(outPath);
