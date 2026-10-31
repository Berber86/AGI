// Витрина pixelfx: один общий буфер 320x180, эффект как живая программа и «акт» с телом.
// Демонстрация приёмов из .agents/skills/arena-game-forge/references/pixel-art-fx.md

import {
  createFrame, clearFrame, createFx, createAct, composite, backdrop, actTiming, actBounds, PAL,
} from "./vendor/pixelfx/core/index.js";

import * as swordSlash from "./vendor/pixelfx/fx/melee/sword-slash.js";
import * as hammerSmash from "./vendor/pixelfx/fx/melee/hammer-smash.js";
import * as swordCombo from "./vendor/pixelfx/fx/moves/sword-combo.js";
import * as frostNova from "./vendor/pixelfx/fx/ice/frost-nova.js";
import * as magicCircle from "./vendor/pixelfx/fx/arcane/magic-circle-cast.js";
import * as heal from "./vendor/pixelfx/fx/holy/heal.js";
import * as thunderclap from "./vendor/pixelfx/fx/lightning/thunderclap.js";
import * as critHit from "./vendor/pixelfx/fx/impacts/crit-hit.js";
import * as fireworkBurst from "./vendor/pixelfx/fx/explosions/firework-burst.js";
import * as fireball from "./vendor/pixelfx/fx/fire/fireball.js";
import * as coinSpin from "./vendor/pixelfx/fx/pickups/coin-spin.js";
import * as snow from "./vendor/pixelfx/fx/weather/snow.js";
import * as levelUp from "./vendor/pixelfx/fx/ui/level-up.js";

const EFFECTS = [
  { cat: "Мечи", name: "Взмах меча", id: "melee/sword-slash", mod: swordSlash },
  { cat: "Мечи", name: "Удар молотом", id: "melee/hammer-smash", mod: hammerSmash },
  { cat: "Приёмы", name: "Комбо из трёх ударов", id: "moves/sword-combo", mod: swordCombo },
  { cat: "Магия", name: "Ледяная новая", id: "ice/frost-nova", mod: frostNova },
  { cat: "Магия", name: "Магический круг", id: "arcane/magic-circle-cast", mod: magicCircle },
  { cat: "Магия", name: "Лечение", id: "holy/heal", mod: heal },
  { cat: "Магия", name: "Гром", id: "lightning/thunderclap", mod: thunderclap },
  { cat: "Удары", name: "Критический удар", id: "impacts/crit-hit", mod: critHit },
  { cat: "Взрывы", name: "Фейерверк", id: "explosions/firework-burst", mod: fireworkBurst },
  { cat: "Огонь", name: "Файербол", id: "fire/fireball", mod: fireball },
  { cat: "Предметы", name: "Монета", id: "pickups/coin-spin", mod: coinSpin },
  { cat: "Погода", name: "Снег", id: "weather/snow", mod: snow },
  { cat: "Интерфейс", name: "Новый уровень", id: "ui/level-up", mod: levelUp },
];

const PALETTES = [
  { name: "родная", ramp: null },
  { name: "огонь", ramp: PAL.fire },
  { name: "лёд", ramp: PAL.ice },
  { name: "яд", ramp: PAL.poison },
  { name: "свет", ramp: PAL.holy },
  { name: "тьма", ramp: PAL.shadow },
  { name: "неон", ramp: PAL.neon },
  { name: "матрица", ramp: PAL.matrix },
  { name: "золото", ramp: PAL.gold },
  { name: "металл", ramp: PAL.metal },
];

// ---- сцена: 320x180 арт-пикселей, пол на y = 170
const W = 320, H = 180, GROUND = 170, PAD = 6;
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d", { alpha: false });
const frame = createFrame(W, H);
const img = ctx.createImageData(W, H);
const bg = backdrop("ground", W, H, GROUND);

const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  return `${n} ${m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many}`;
};

const metaOf = (mod) => ({
  fps: 30, loop: false, duration: 1, size: [W, H], origin: [W / 2, GROUND], options: {}, ...mod.meta,
});

// сколько эффект (или акт) занимает влево/вправо от якоря: по этому прижимаем точку клика к сцене
const extentCache = new WeakMap();
function extents(mod) {
  let e = extentCache.get(mod);
  if (!e) {
    if (mod.act) {
      const b = actBounds(mod);
      e = { l: -b.x0, r: b.x1 };
    } else {
      const [w] = metaOf(mod).size, [ox] = metaOf(mod).origin;
      e = { l: ox, r: w - ox };
    }
    extentCache.set(mod, e);
  }
  return e;
}
const clampX = (mod, x) => {
  const { l, r } = extents(mod), min = PAD + l, max = W - PAD - r;
  return min > max ? W / 2 : Math.round(Math.min(Math.max(x, min), max));
};

// ---- состояние
const state = {
  index: 0,
  palette: null,
  seed: 1,
  body: true,     // рисовать акт (тело + цель), а не только эффект
  hostStop: true, // пауза всего мира на кадре удара, когда тела нет
  auto: true,
  x: 118,
  inst: null,
  timing: null,
  hit: 0,
  freeze: 0,
  shakeT: 0,
  shake0: 1,
  shakeAmp: 0,
  wait: 0,
  clock: 0,
};

const current = () => EFFECTS[state.index];
const withAct = () => state.body && !!current().mod.act;

function spawn() {
  const { mod } = current();
  const opts = { x: clampX(mod, state.x), y: GROUND, seed: state.seed };
  if (state.palette) opts.palette = state.palette;
  state.inst = withAct() ? createAct(mod, opts) : createFx(mod, opts);
  state.timing = actTiming(mod);
  state.hit = 0;
  state.freeze = 0;
  state.shakeT = 0;
  state.wait = 0;
  paintStatus();
  if (document.getElementById("sheetbox").open) buildSheet();
  paintTiming();
}

function tick(dt) {
  state.clock += dt;
  if (state.shakeT > 0) state.shakeT = Math.max(0, state.shakeT - dt);
  if (state.freeze > 0) {           // весь мир стоит: это и есть hit-stop
    state.freeze -= dt;
    return;
  }
  const inst = state.inst;
  if (!inst) return;
  inst.update(dt);

  // своя игра не рисует акт, но берёт его тайминг: морозим сцену на каждом попадании
  if (!withAct() && state.hostStop && state.timing) {
    const hits = state.timing.hits;
    while (state.hit < hits.length && inst.t >= hits[state.hit].t) {
      const h = hits[state.hit++];
      if (h.freeze > 0) state.freeze = Math.max(state.freeze, h.freeze);
      if (h.shake > 0) { state.shake0 = state.shakeT = h.shake; state.shakeAmp = h.amp; }
    }
  }

  if (inst.done()) {
    if (state.auto) {
      state.wait += dt;
      if (state.wait > 0.45) spawn();
    }
  }
}

function render() {
  const inst = state.inst;
  clearFrame(frame);
  if (inst) {
    if (withAct()) inst.draw(frame);              // тело + цель + эффект
    else {
      inst.draw(frame, "back");                   // то, что за персонажем
      inst.draw(frame, "front");                  // то, что перед ним
    }
  }
  composite(frame, img.data, bg);                 // цвет, затем аддитивный свет

  let sx = 0, sy = 0;
  if (withAct()) [sx, sy] = inst.shake;
  else if (state.shakeT > 0) {
    const k = state.shakeAmp * (state.shakeT / state.shake0);
    sx = Math.round(Math.sin(state.clock * 70) * k);
    sy = Math.round(Math.cos(state.clock * 53) * k * 0.6);
  }
  ctx.fillStyle = "#12101a";
  ctx.fillRect(0, 0, W, H);
  ctx.putImageData(img, sx, sy);
}

// ---- цикл: шаг 1/60, один рендер на кадр
let last = performance.now(), acc = 0, costAvg = 0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  acc = Math.min(acc + dt, 0.2);
  const t0 = performance.now();
  while (acc >= 1 / 60) {
    acc -= 1 / 60;
    tick(1 / 60);
  }
  render();
  costAvg = costAvg ? costAvg * 0.92 + (performance.now() - t0) * 0.08 : performance.now() - t0;
  if (state.clock - (loop.hudAt ?? -1) > 0.25) {
    loop.hudAt = state.clock;
    document.getElementById("cost").textContent = `сцена: ${costAvg.toFixed(2)} мс/кадр (headless: софтверный рендер)`;
  }
  requestAnimationFrame(loop);
}

// ---- целый масштаб, чтобы пиксели не мылились: 1 арт-пиксель = s экранных
function fit() {
  const main = document.querySelector(".main");
  const cs = getComputedStyle(document.querySelector(".stage"));
  const avail = main.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  // 3x — предел: дальше сцена просто съедает место у панели
  const s = Math.min(3, Math.floor(avail / W), Math.floor((innerHeight * 0.58) / H));
  // на узком экране целого масштаба нет — уменьшаем картинку до ширины экрана
  const w = s >= 1 ? W * s : Math.min(avail, W);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${(w / W) * H}px`;
  canvas.dataset.scale = s >= 1 ? `${s}x` : "<1x";
}
new ResizeObserver(fit).observe(document.documentElement);

// ---- интерфейс
function chip(text, on, onclick, style) {
  const b = document.createElement("button");
  b.className = `chip${on ? " on" : ""}`;
  b.textContent = text;
  if (style) b.setAttribute("style", style);
  b.onclick = onclick;
  return b;
}

function buildEffects() {
  const box = document.getElementById("effects");
  box.textContent = "";
  let cat = null, group = null;
  EFFECTS.forEach((fx, i) => {
    if (fx.cat !== cat) {
      cat = fx.cat;
      group = document.createElement("div");
      group.className = "chiprow";
      const label = document.createElement("span");
      label.className = "cat";
      label.textContent = cat;
      box.append(label, group);
    }
    group.append(chip(fx.name, i === state.index, () => {
      state.index = i;
      if (state.x === null) state.x = W / 2;
      buildEffects();
      spawn();
    }));
  });
}

function buildPalettes() {
  const box = document.getElementById("palettes");
  box.textContent = "";
  for (const p of PALETTES) {
    const on = (p.ramp ?? null) === state.palette;
    const bgc = p.ramp ? `--c0:${p.ramp[1]};--c1:${p.ramp[p.ramp.length - 1]}` : "";
    box.append(chip(p.name, on, () => {
      state.palette = p.ramp ?? null;
      buildPalettes();
      spawn();
    }, bgc));
  }
}

function paintStatus() {
  const fx = current(), m = metaOf(fx.mod);
  const mode = withAct() ? "акт: тело, цель, freeze" : m.act ? "только эффект (акт выключен)" : "только эффект";
  const kind = m.loop ? "цикл" : `${m.duration.toFixed(2)} с`;
  document.getElementById("status").textContent = `${fx.id} · ${kind} · ${mode}`;
  document.getElementById("modehint").textContent = withAct()
    ? "Акт сам держит паузу на контакте и трясёт картинку — включите «Тело и акт» обратно, чтобы сравнить."
    : m.act
      ? "Акт выключен, поэтому паузу на ударе ставит сама сцена (см. «Хост-hit-stop»)."
      : "У этого эффекта нет акта: тело ему не нужно, паузу ставит сцена.";
  document.getElementById("hoststop").disabled = withAct();
}

function paintTiming() {
  const t = state.timing;
  const pre = document.getElementById("timing");
  if (!t) { pre.textContent = "У эффекта нет акта — ему не нужен персонаж."; return; }
  const brief = {
    windup: +t.windup.toFixed(3),
    recovery: +t.recovery.toFixed(3),
    targets: t.targets,
    hits: t.hits.map((h) => ({
      t: +h.t.toFixed(3), freeze: +h.freeze.toFixed(3), shake: h.shake, amp: h.amp, push: +h.push.toFixed(2), skin: h.skin ?? null,
    })),
    poses: `${t.poses.length} ключей`,
  };
  pre.textContent = JSON.stringify(brief, null, 1);
}

// ---- спрайт-лист: те же кадры, что делает `node tools/render.mjs <id> --sheet`
function buildSheet() {
  const { mod } = current(), m = metaOf(mod);
  const [w, h] = m.size, [ox, oy] = m.origin;
  const fps = m.fps ?? 30;
  let n = Math.max(1, Math.round((m.duration ?? 1) * fps)), step = 1;
  while ((n / step) * w * h > 5e6) step++;          // не раздуваем канвас на больших эффектах
  const count = Math.ceil(n / step);
  const cols = Math.min(10, count), rows = Math.ceil(count / cols);

  const strip = document.getElementById("sheet");
  strip.width = cols * w;
  strip.height = rows * h;
  const sctx = strip.getContext("2d");
  sctx.clearRect(0, 0, strip.width, strip.height);

  const tmp = document.createElement("canvas");
  tmp.width = w; tmp.height = h;
  const tctx = tmp.getContext("2d");

  const opts = { x: ox, y: oy, seed: state.seed };   // якорь = origin: рисуем в собственный канвас эффекта
  if (state.palette) opts.palette = state.palette;
  const inst = createFx(mod, opts);
  const f = createFrame(w, h);
  const im = new ImageData(w, h);

  for (let i = 0; i < count; i++) {
    clearFrame(f);
    inst.draw(f);
    composite(f, im.data, null);                 // прозрачный фон: шит кладут поверх сцены
    tctx.putImageData(im, 0, 0);
    sctx.drawImage(tmp, (i % cols) * w, Math.floor(i / cols) * h);
    for (let k = 0; k < step; k++) inst.update(1 / fps);
  }

  const link = document.getElementById("download");
  link.href = strip.toDataURL("image/png");
  link.download = `${current().id.replace("/", "-")}.png`;
  const acted = !!mod.act;
  document.getElementById("sheetinfo").textContent =
    `${plural(count, "кадр", "кадра", "кадров")} · ${fps} fps · кадр ${w}×${h} · pivot ${ox},${oy}` +
    (step > 1 ? ` · каждый ${step}-й кадр (крупный эффект)` : "") +
    (acted ? " · только эффект: тело и акт в игре играет ваш герой" : "");
}

// ---- обработчики
document.getElementById("body").onchange = (e) => { state.body = e.target.checked; paintStatus(); spawn(); };
document.getElementById("hoststop").onchange = (e) => { state.hostStop = e.target.checked; };
document.getElementById("auto").onchange = (e) => { state.auto = e.target.checked; };
document.getElementById("seed").onclick = () => {
  state.seed = (state.seed * 7919 + 13) % 99991;
  spawn();
};
document.getElementById("replay").onclick = () => spawn();
document.getElementById("sheetbox").ontoggle = (e) => { if (e.target.open) buildSheet(); };

canvas.addEventListener("pointerdown", (e) => {
  const r = canvas.getBoundingClientRect();
  state.x = ((e.clientX - r.left) / r.width) * W;
  spawn();
});

// тестовые хуки: витрину удобно снимать скриптом в нужном состоянии
window.__DEMO__ = {
  state,
  effects: EFFECTS.map((fx) => fx.id),
  select(nameOrIndex) {
    const i = typeof nameOrIndex === "number" ? nameOrIndex : EFFECTS.findIndex((fx) => fx.id === nameOrIndex);
    if (i < 0) return false;
    state.index = i;
    buildEffects();
    spawn();
    return true;
  },
  palette(name) {
    const p = PALETTES.find((x) => x.name === name);
    if (!p) return false;
    state.palette = p.ramp ?? null;
    buildPalettes();
    spawn();
    return true;
  },
  body(on) { state.body = on; document.getElementById("body").checked = on; spawn(); },
  seed(n) { state.seed = n; spawn(); },
  sheet() { document.getElementById("sheetbox").open = true; buildSheet(); },
  spawn,
};

buildEffects();
buildPalettes();
paintStatus();
paintTiming();
fit();
spawn();
requestAnimationFrame(loop);
