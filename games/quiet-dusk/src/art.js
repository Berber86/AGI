// Арт «Тихого заката»: фон-деревня, герой и его меч. Всё рисуется в 320×180 арт-пикселей.
// Приёмы — из pixelfx: жёсткие шаги рампы, дизер 4×4 там, где нужен градиент, свет отдельным буфером.

import { hex, mix, rand, clamp } from "./vendor/pixelfx/core/index.js";

export const W = 320;
export const H = 180;
export const GROUND = 152;      // линия, на которой стоят ноги
export const HERO_X = 92;
export const ENEMY_X = 236;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bay = (x, y) => (BAYER[((y & 3) << 2) | (x & 3)] + 0.5) / 16;

// ---- палитры
const SKY = ["#1d1230", "#2e1a44", "#4a2450", "#742f55", "#a3435a", "#cf6a4f", "#f09a5c", "#ffc27a"].map(hex);
const SUN = hex("#ffe6a8"), SUN_MID = hex("#ffc06a"), SUN_EDGE = hex("#ff9a5c");
const HILL_FAR = hex("#4a2a52"), HILL_FAR_TOP = hex("#7d4463");
const HILL_NEAR = hex("#33203c"), HILL_NEAR_TOP = hex("#5c3350");
const HOUSE = hex("#251a2e"), HOUSE_LIT = hex("#33243c"), ROOF = hex("#3d2438");
const WINDOW = hex("#ffc46a"), WINDOW_DIM = hex("#c07a48");
const TRUNK = hex("#2a1c26"), LEAF = hex("#2b2434"), LEAF_TOP = hex("#43324a");
const SOIL = hex("#2a1f2b"), SOIL_LIGHT = hex("#3a2a33"), PATH = hex("#4a3539"), PATH_LIGHT = hex("#5c4346");
const MORTAR = hex("#211825"), STONE = hex("#33262f");
const INK = hex("#140d18");

/** Ночная деревня на закате: всё статично, считается один раз в Uint32Array. */
export function makeBackdrop() {
  const out = new Uint32Array(W * H);
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    out[y * W + x] = c;
  };
  const hz = 118;                                   // линия горизонта

  // небо: 7 отрезков рампы с дизером на границах
  for (let y = 0; y < hz + 4; y++) {
    const t = clamp(y / hz) * (SKY.length - 1);
    const i = Math.floor(t), f = t - i;
    for (let x = 0; x < W; x++) put(x, y, f > bay(x, y) ? SKY[Math.min(i + 1, SKY.length - 1)] : SKY[i]);
  }

  // солнце: диск с тугим ядром и мягким крылом на горизонте
  const sx = 238, sy = 104;
  for (let y = sy - 26; y < H; y++)
    for (let x = sx - 30; x < sx + 31; x++) {
      const dx = x - sx, dy = (y - sy) * 1.15;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 11) put(x, y, d < 6 ? SUN : SUN_MID);
      else if (d < 15) put(x, y, d - 11 < 2.4 ? SUN_EDGE : mix(SKY[5], SUN_EDGE, 0.5));
      else if (d < 30) {
        const k = (1 - (d - 15) / 15) * 0.55;
        if (k > bay(x, y)) put(x, y, mix(out[y * W + x], SUN_MID, 0.45));
      }
    }

  // длинные облачные полосы
  for (let i = 0; i < 7; i++) {
    const y0 = 18 + i * 9 + Math.round(rand(i, 3) * 5);
    const x0 = Math.round(rand(i, 7) * W * 0.8);
    const len = 30 + Math.round(rand(i, 11) * 60);
    const c = mix(SKY[2], SKY[5], 0.35 + rand(i, 13) * 0.3);
    for (let x = x0; x < x0 + len; x++) {
      const edge = Math.min(x - x0, x0 + len - x) / 12;
      if (edge > bay(x, y0)) { put(x, y0, mix(out[y0 * W + x], c, 0.55)); put(x, y0 + 1, mix(out[(y0 + 1) * W + x], c, 0.25)); }
    }
  }

  // дальние холмы с подсвеченной кромкой
  for (let x = 0; x < W; x++) {
    const h = hz - 12 + Math.round(Math.sin(x * 0.021 + 1.2) * 5 + Math.sin(x * 0.058) * 2.5);
    for (let y = h; y < H; y++) put(x, y, HILL_FAR);
    put(x, h, HILL_FAR_TOP);
    if (x % 9 === 0 && bay(x, h - 1) < 0.5) put(x, h - 1, HILL_FAR_TOP);
  }

  // ближние холмы и полоса леса
  for (let x = 0; x < W; x++) {
    const h = hz + 4 + Math.round(Math.sin(x * 0.013 + 0.4) * 4);
    for (let y = h; y < H; y++) put(x, y, HILL_NEAR);
    put(x, h, HILL_NEAR_TOP);
  }
  for (let x = 0; x < W; x += 3) {
    const h = hz - 2 - Math.round(rand(x, 9) * 6);
    if (rand(x, 5) < 0.5) continue;
    for (let y = h; y < hz + 2; y++) put(x, y, TRUNK);
    for (let d = -2; d <= 2; d++) put(x + d, h - 1, LEAF_TOP), put(x + d, h - 2, LEAF);
  }

  // деревня слева: три дома, тёплые окна
  const houses = [[16, 96], [52, 104], [86, 92]];
  for (const [hx, top] of houses) {
    const wid = 26, wallTop = top + 10;
    for (let x = hx; x < hx + wid; x++) for (let y = wallTop; y < GROUND; y++) put(x, y, y > wallTop + 6 ? HOUSE : HOUSE_LIT);
    for (let r = 0; r < 9; r++) {                                  // двускатная крыша
      const inset = r;
      for (let x = hx - 3 + inset; x < hx + wid + 3 - inset; x++) put(x, top + r, ROOF);
      put(hx - 3 + inset, top + r, INK); put(hx + wid + 2 - inset, top + r, INK);
    }
    for (let x = hx - 3; x < hx + wid + 3; x++) put(x, top + 9, HOUSE);
    for (const wx of [hx + 5, hx + 16]) {                          // окна
      for (let y = wallTop + 5; y < wallTop + 11; y++) for (let x = wx; x < wx + 6; x++) put(x, y, WINDOW);
      put(wx, wallTop + 5, WINDOW_DIM); put(wx + 5, wallTop + 10, WINDOW_DIM);
    }
    for (let y = wallTop + 12; y < GROUND; y++) put(hx + wid - 9, y, INK);  // дверь
    for (let y = wallTop + 12; y < GROUND; y++) put(hx + wid - 8, y, ROOF);
  }

  // земля и тропа
  for (let y = GROUND; y < H; y++)
    for (let x = 0; x < W; x++) {
      const deep = (y - GROUND) / (H - GROUND);
      let c = deep > bay(x, y) ? SOIL : SOIL_LIGHT;
      if (x % 17 === 0 && y > GROUND + 6) c = MORTAR;
      if (y > GROUND + 14 && rand(x, y, 4) < 0.08) c = STONE;
      put(x, y, c);
    }
  for (let x = 0; x < W; x++) {
    const py = GROUND + 3 + Math.round(Math.sin(x * 0.05) * 1.5);
    for (let y = py; y < Math.min(H, py + 12); y++) put(x, y, y - py > 4 ? PATH : PATH_LIGHT);
  }

  // забор на околице
  for (let x = 132; x < 320; x += 11) {
    for (let y = GROUND - 12; y < GROUND - 1; y++) { put(x, y, TRUNK); put(x + 1, y, mix(TRUNK, SOIL, 0.3)); }
    put(x, GROUND - 12, LEAF_TOP);
  }
  for (let x = 132; x < 320; x++) { put(x, GROUND - 9, TRUNK); put(x, GROUND - 5, TRUNK); }

  // кустики и светлячки-точки у кромки
  for (let i = 0; i < 26; i++) {
    const x = Math.round(rand(i, 21) * W), h = 2 + Math.round(rand(i, 23) * 3);
    for (let d = 0; d < h; d++) put(x + (d % 2), GROUND - d, d === h - 1 ? LEAF_TOP : LEAF);
  }
  return out;
}

// ---- герой: 12×20, лицом вправо
const HERO_STAND = [
  "....kkkkk...",
  "..kkhhhhhkk.",
  ".khhhhhhhhhk",
  ".khhsssshhhk",
  ".khsseesshhk",
  ".khsssssshsk",
  "..kssssssk..",
  "...kwwwwk...",
  "..kttttttk..",
  ".ktvvvvvvttk",
  ".ksvvvVvvttk",
  ".kstvvvvvtk.",
  "..kttttttk..",
  "..kbbbbbbk..",
  "..kppkkppk..",
  "..kppkkppk..",
  "..kppkkppk..",
  "..koo.kook..",
  "..kook.ook..",
  ".kkkkk.kkkk.",
];
const HERO_RAISE = [
  "....kkkkk...",
  "..kkhhhhhkk.",
  ".khhhhhhhhhk",
  ".khhsssshhhk",
  ".khsseesshhk",
  ".khsssssshsk",
  "..kssssssk..",
  "..ksssssssk.",
  ".kstttsssk..",
  ".ktvvvsssk..",
  ".ksvvvvvttk.",
  ".kstvvvvvtk.",
  "..kttttttk..",
  "..kbbbbbbk..",
  "..kppkkppk..",
  "..kppkkppk..",
  "..kppkkppk..",
  "..koo.kook..",
  "..kook.ook..",
  ".kkkkk.kkkk.",
];
const HERO_PAL = {
  k: "#140d18", h: "#6b4a35", s: "#f2c49a", e: "#140d18", w: "#f6ead0",
  t: "#e6d3ac", v: "#4f7a4a", V: "#6b9a5a", b: "#6b4a2a", p: "#3c3a52", o: "#4a3228",
};
const SWORD = { edge: hex("#8ea6c8"), mid: hex("#cfdcf0"), core: hex("#ffffff"), hilt: hex("#8a5a32") };

/**
 * Герой в позе. x, y — точка под ногами; pose: idle | windup | strike | cast | hurt | potion.
 * t — время в секундах: только для дыхания и лёгкой тряски.
 */
export function drawHero(p, x, y, pose = "idle", t = 0, k = 2) {
  const breathe = pose === "idle" ? (Math.floor(t * 2.2) % 2) : 0;
  const lean = pose === "windup" ? -1 : pose === "strike" ? 2 : pose === "hurt" ? -2 : 0;
  const bob = pose === "hurt" ? 1 : breathe;
  const rows = pose === "cast" || pose === "potion" ? HERO_RAISE : HERO_STAND;
  const H = rows.length, Wd = rows[0].length;
  const hx = Math.round(x - (Wd * k) / 2 + lean * k), hy = Math.round(y - H * k + bob * k);
  p.sprite(rows, HERO_PAL, hx, hy, { scale: k });
  const hand = handAt(pose, hx, hy, k);
  if (pose !== "cast" && pose !== "potion") {
    // в покое остриё упирается в землю — считаем угол от руки до точки у ног
    const angle = pose === "idle" ? Math.atan2(y - 1 - hand.y, 7 * k) : swordAngle(pose);
    drawSword(p, hand.x, hand.y, angle, pose, k);
  }
  // тёплый отблеск заката: свет справа и сверху, как у солнца на сцене
  p.light(hx + Wd * k - 1, hy + 6 * k, hex("#ffb070"), 0.16);
  p.light(hx + Wd * k - 2, hy + 2 * k, hex("#ffd8a0"), 0.12);
  return { x: hx, y: hy };
}

function handAt(pose, hx, hy, k) {
  const at = (x, y) => ({ x: hx + x * k, y: hy + y * k });
  switch (pose) {
    case "windup": return at(9, 9);
    case "strike": return at(10, 8);
    case "hurt": return at(5, 12);
    case "cast": return at(10, 2);
    case "potion": return at(10, 3);
    default: return at(9, 11);
  }
}

function swordAngle(pose) {
  switch (pose) {
    case "windup": return -1.9;     // занесён назад-вверх
    case "strike": return 0.42;     // рубящий удар вперёд-вниз
    case "hurt": return 0.9;
    default: return 0.7;
  }
}

/** Меч: тёмная кромка, светлая середина, белый блик у кончика — «линии и свет, не заливка». */
function drawSword(p, hx, hy, angle, pose, k = 2) {
  const len = (pose === "windup" || pose === "strike" ? 17 : 12) * k;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  // перпендикуляр: им задаём толщину клинка (две кромки + светлая середина)
  const nx = -sa * (k / 2), ny = ca * (k / 2);
  const gx = hx + ca * 2 * k, gy = hy + sa * 2 * k;
  const ex = hx + ca * len, ey = hy + sa * len;
  p.line(hx, hy, gx, gy, SWORD.hilt);
  p.line(hx + nx, hy + ny, gx + nx, gy + ny, SWORD.hilt);
  p.line(gx + nx, gy + ny, ex + nx, ey + ny, SWORD.edge);
  p.line(gx - nx, gy - ny, ex - nx, ey - ny, SWORD.edge);
  p.polyline([[gx, gy], [ex, ey]], SWORD.mid);
  p.dot(ex, ey, SWORD.core);
  p.dot(ex - ca * 1.5, ey - sa * 1.5, SWORD.core);
  p.light(hx + ca * len * 0.72, hy + sa * len * 0.72, hex("#9ec8ff"), 0.2);
}

/** Белая вспышка поверх уже нарисованного (реакция врага на удар) — по bbox врага. */
export function flashBox(p, x0, y0, x1, y1, k, tint = hex("#ffffff")) {
  if (k <= 0) return;
  p.shade(x0, y0, x1, y1, (x, y, o) => {
    const c = p.get(x, y);
    if (!c || (c >>> 24) < 120) return;
    o.c = mix(c, tint, k);
    o.a = 1;
  });
}

/** Тень под существом: плоский эллипс на земле. */
export function groundShadow(p, x, y, rx, ry = 2.2, k = 0.45) {
  p.ellipse(x, y, rx, ry, INK, k);
}
