// Authoring tool, in the spirit of the effect library's contact sheets: render game states at 1:1 into
// PNGs and look at them. No browser, no scaling artefacts — just the pixels the game actually draws.
//
//   npx vite-node scripts/sheet.ts [outDir]

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { CONFIG, World, emptyInput } from "../src/game/world.js";
import { Renderer, FxBag } from "../src/game/render.js";
import { Campfire, Fireflies, Leaves, SlashFx, HitFx, PoofFx } from "../src/fx/effects.js";

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf: Uint8Array) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type: string, data: Uint8Array) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
const png = (rgba: Uint8ClampedArray, w: number, h: number, zoom = 3) => {
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
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

const outDir = process.argv[2] ?? "/home/user/shots/frames";
mkdirSync(outDir, { recursive: true });

const renderer = new Renderer();
const out = new Uint8ClampedArray(CONFIG.w * CONFIG.h * 4);

interface Shot {
  name: string;
  mode: "title" | "play" | "over";
  prepare: (w: World, bag: FxBag) => number;
}

const shots: Shot[] = [
  { name: "01-title", mode: "title", prepare: () => 1.2 },
  {
    name: "02-early",
    mode: "play",
    prepare: (w, bag) => {
      w.heroX = 130;
      w.heroY = 96;
      bag.add(new SlashFx(150, 88, 0.4, 3));
      for (let i = 0; i < 40; i++) {
        w.step(1 / 60, emptyInput());
        bag.update(1 / 60);
      }
      return 0.7;
    },
  },
  {
    name: "03-carry",
    mode: "play",
    prepare: (w, bag) => {
      w.carried = ["amber", "firefly", "firefly"];
      w.heroX = 120;
      w.heroY = 92;
      for (let i = 0; i < 120; i++) {
        w.step(1 / 60, emptyInput());
        bag.update(1 / 60);
      }
      return 0.6;
    },
  },
  {
    name: "04-creatures",
    mode: "play",
    prepare: (w, bag) => {
      w.heroX = 150;
      w.heroY = 120;
      w.creatures.push(
        { id: 900, kind: "slug", x: 176, y: 122, hp: 1, state: "windup", t: 0.3, dirX: -1, dirY: 0, flash: 0, bob: 0.4 },
        { id: 901, kind: "beetle", x: 128, y: 100, hp: 2, state: "walk", t: 0, dirX: 1, dirY: 0.2, flash: 0.12, bob: 1.1 },
        { id: 902, kind: "slug", x: 200, y: 84, hp: 1, state: "walk", t: 0, dirX: -1, dirY: 0.4, flash: 0, bob: 2 },
      );
      bag.add(new HitFx(174, 118, 6));
      bag.add(new PoofFx(200, 88, 7));
      for (let i = 0; i < 8; i++) bag.update(1 / 60);
      return 1.1;
    },
  },
  {
    name: "05-night",
    mode: "play",
    prepare: (w) => {
      for (let i = 0; i < 60 * 200; i++) {
        w.hearts = CONFIG.heartsMax;
        w.step(1 / 60, emptyInput());
      }
      w.heroX = 200;
      w.heroY = 120;
      return 1.4;
    },
  },
  {
    name: "06-over",
    mode: "over",
    prepare: (w) => {
      w.score = 37;
      w.banked = 12;
      w.kills = 5;
      return 2.2;
    },
  },
];

for (const shot of shots) {
  const world = new World(7, 12);
  const bag = new FxBag();
  const scene = {
    campfire: new Campfire(CONFIG.fireX, CONFIG.fireY, 5),
    fireflies: new Fireflies(CONFIG.w, CONFIG.h, 9),
    leaves: new Leaves(CONFIG.w, CONFIG.h, 13),
    transient: bag.transient,
  };
  const time = shot.prepare(world, bag);
  for (let i = 0; i < 40; i++) {
    scene.campfire.update(1 / 60);
    scene.fireflies.update(1 / 60);
    scene.leaves.update(1 / 60);
    bag.update(1 / 60);
  }
  renderer.render(world, scene, out, { mode: shot.mode, time, best: 12, record: shot.mode === "over" });
  writeFileSync(`${outDir}/${shot.name}.png`, png(out, CONFIG.w, CONFIG.h, 3));
  console.log(`${outDir}/${shot.name}.png`);
}
