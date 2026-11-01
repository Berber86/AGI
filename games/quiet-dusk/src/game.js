// Тихий закат — пошаговый пролог JRPG.
// Анимация по методу pixelfx: один буфер 320×180 на всю игру, эффекты как маленькие программы
// (цвет + аддитивный свет), стоп-кадр всего мира на попадании, тряска картинки, цифры урона.
// Свои герой и враги рисуются рядом, эффекты — из вендоренного pixelfx (MIT).

import {
  createFrame, clearFrame, createFx, composite, painterFor, hex, clamp,
} from "./vendor/pixelfx/core/index.js";
import { W, H, GROUND, HERO_X, ENEMY_X, makeBackdrop, drawHero, flashBox, groundShadow } from "./art.js";

import * as slashFx from "./vendor/pixelfx/fx/melee/sword-slash.js";
import * as critHitFx from "./vendor/pixelfx/fx/impacts/crit-hit.js";
import * as frostNovaFx from "./vendor/pixelfx/fx/ice/frost-nova.js";
import * as healFx from "./vendor/pixelfx/fx/holy/heal.js";
import * as dmgNumFx from "./vendor/pixelfx/fx/ui/damage-number.js";
import * as critNumFx from "./vendor/pixelfx/fx/ui/crit-number.js";
import * as levelUpFx from "./vendor/pixelfx/fx/ui/level-up.js";
import * as slimeFx from "./vendor/pixelfx/fx/critters/slime.js";
import * as frogFx from "./vendor/pixelfx/fx/critters/frog.js";
import * as firefliesFx from "./vendor/pixelfx/fx/weather/fireflies.js";
import * as starIrisFx from "./vendor/pixelfx/fx/transitions/star-iris.js";

// ---------------------------------------------------------------- сцена
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d", { alpha: false });
const frame = createFrame(W, H);
const img = ctx.createImageData(W, H);
const bg = makeBackdrop();
const BG_INK = "#0d0a14";

const PAL = {
  slash: ["#1d2340", "#2c58aa", "#5aa8e8", "#9ad8ff", "#d8f2ff", "#ffffff"],
  ice: ["#151a3d", "#212f6b", "#2c58aa", "#3a8bd8", "#7fd4f6", "#c8f2ff", "#ffffff"],
  heal: ["#1a2a12", "#2c4a1c", "#437a2a", "#68b03a", "#a8e06a", "#d8ffa8", "#ffffff"],
  healNum: ["#0d2210", "#174a1c", "#2a7a2a", "#4fb03a", "#8fd86a", "#c8ffa0", "#ffffff"],
  gold: ["#1e1206", "#4a2c08", "#86520c", "#c48412", "#f0b424", "#ffe066", "#fff6c4", "#ffffff"],
};

const fx = [];          // { inst, layer }
const nums = [];        // цифры урона
const clock = { t: 0 };

function spawn(mod, opts, layer = "front") {
  const inst = createFx(mod, opts);
  const rec = { inst, layer, mod };
  fx.push(rec);
  return rec;
}
function updateFx(dt) {
  for (let i = fx.length - 1; i >= 0; i--) {
    const r = fx[i];
    r.inst.update(dt);
    if (r.inst.done()) fx.splice(i, 1);
  }
  for (let i = nums.length - 1; i >= 0; i--) {
    nums[i].inst.update(dt);
    if (nums[i].inst.done()) nums.splice(i, 1);
  }
}

// ---------------------------------------------------------------- ожидания и hit-stop
const waits = [];
const wait = (sec) => new Promise((res) => waits.push({ left: sec, res }));
const world = { freeze: 0, shake: 0, shake0: 1, amp: 0, gen: 0 };

function hitStop(sec, amp) {
  world.freeze = Math.max(world.freeze, sec);
  if (amp) { world.shake0 = world.shake = Math.max(0.18, sec * 2.6); world.amp = amp; }
}

// ---------------------------------------------------------------- бой
const HERO_MAX_HP = 32, HERO_MAX_MP = 10;
const hero = { hp: HERO_MAX_HP, mp: HERO_MAX_MP, potions: 1, lv: 1, pose: "idle", poseT: 0, lunge: 0, hurtFlash: 0 };
const ENEMIES = {
  slime: { name: "Слайм", mod: slimeFx, hp: 20, min: 3, max: 5, heavy: null, opts: { palette: ["#061412", "#0b2f2b", "#12594a", "#1f8f4f", "#47c752", "#a6f06a", "#f0ffd2"], hop: 22 } },
  frog: { name: "Жаба-ворчун", mod: frogFx, hp: 26, min: 3, max: 5, heavy: { min: 6, max: 8, every: 3 }, opts: { palette: ["#0a160c", "#173a18", "#256024", "#3a8a2e", "#62b440", "#a8e070", "#e8ffc0"] } },
};
const foe = { key: "slime", name: "", hp: 20, maxHp: 20, inst: null, hurt: 0, dead: false, turns: 0 };

const B = {
  active: false,
  busy: true,
  round: 0,
  lvUpPending: false,
};
let fireflies = null;

function startBattle(keyHTMLElement = "slime") {
  const def = ENEMIES[keyHTMLElement];
  world.gen++;
  B.active = true;
  B.busy = true;
  B.round = 0;
  foe.key = keyHTMLElement;
  foe.name = def.name;
  foe.hp = foe.maxHp = def.hp;
  foe.dead = false;
  foe.hurt = 0;
  foe.turns = 0;
  if (!fireflies) fireflies = createFx(firefliesFx, { x: 160, y: GROUND, seed: 3, light: 0.7 });
  foe.inst = createFx(def.mod, { x: ENEMY_X, y: GROUND, seed: keyHTMLElement === "frog" ? 4 : 2, ...def.opts });
  fx.length = 0;
  nums.length = 0;
  waits.length = 0;
  hero.pose = "idle";
  hero.lunge = 0;
  hero.hurtFlash = 0;
  paintHud();
  // полноэкранный переход рисуется из (0,0) кадра, а «куда» задаётся focus
  spawn(starIrisFx, { x: 0, y: 0, seed: 7, palette: PAL.gold, focus: [ENEMY_X, GROUND - 26] });
  showHud(true);
  setCommands(false);
}

// ---------------------------------------------------------------- цифры и попадания
function numberOn(target, value, kind) {
  const crit = kind === "crit";
  const mod = crit ? critNumFx : dmgNumFx;
  // ключ с undefined перебил бы дефолт эффекта: собираем опции только из заданных полей
  const opts = crit ? { text: `${value}!`, label: "", palette: PAL.slash, seed: 5 } : { text: `-${value}`, seed: 2 };
  if (kind === "heal") opts.palette = PAL.healNum;
  const anchor = target === "foe"
    ? { x: ENEMY_X - 22, y: GROUND - 44 }
    : { x: HERO_X - 6, y: GROUND - 34 };
  spawn(mod, { x: anchor.x, y: anchor.y, ...opts });
}

function hurtFoe(dmg, crit) {
  foe.hp = Math.max(0, foe.hp - dmg);
  foe.hurt = 0.16;
  hitStop(crit ? 0.12 : 0.06, crit ? 3 : 2);
  if (crit) spawn(critHitFx, { x: ENEMY_X - 8, y: GROUND - 34, seed: 9, palette: PAL.slash, aim: 0.1 });
  numberOn("foe", dmg, crit ? "crit" : "hit");
  paintHud();
}

function hurtHero(dmg) {
  hero.hp = Math.max(0, hero.hp - dmg);
  hero.pose = "hurt";
  hero.poseT = 0.4;
  hero.hurtFlash = 0.22;
  hitStop(0.055, 2);
  numberOn("hero", dmg, "hit");
  paintHud();
}

// ---------------------------------------------------------------- ходы
const rng = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.round(rng(a, b));

async function heroAttack() {
  const gen = world.gen;
  hero.pose = "windup";
  hero.poseT = 0.3;
  await wait(0.26);
  if (gen !== world.gen) return;
  hero.pose = "strike";
  hero.poseT = 0.5;
  hero.lunge = 1;
  spawn(slashFx, { x: HERO_X + 22, y: GROUND - 30, seed: rint(1, 9), palette: PAL.slash, flip: false });
  await wait(0.07);
  if (gen !== world.gen) return;
  const crit = Math.random() < 0.22;
  const dmg = Math.round(rint(5, 7) * (crit ? 1.6 : 1));
  hurtFoe(dmg, crit);
  await wait(0.55);
  if (gen !== world.gen) return;
  hero.pose = "idle";
  hero.lunge = 0;
  await afterHeroAction();
}

async function heroSkill() {
  const gen = world.gen;
  hero.mp -= 4;
  paintHud();
  hero.pose = "cast";
  hero.poseT = 0.9;
  spawn(healFx, { x: HERO_X, y: GROUND, seed: 3, palette: PAL.ice, light: 0.5 });
  await wait(0.34);
  if (gen !== world.gen) return;
  spawn(frostNovaFx, { x: ENEMY_X - 6, y: GROUND, seed: rint(1, 9), palette: PAL.ice, reach: 52, light: 1.1 });
  await wait(0.2);
  if (gen !== world.gen) return;
  const bonus = foe.key === "frog" ? 2 : 0;          // жаба мёрзнет сильнее
  const dmg = rint(6, 8) + bonus;
  hurtFoe(dmg, dmg >= 10);
  await wait(0.9);
  if (gen !== world.gen) return;
  hero.pose = "idle";
  await afterHeroAction();
}

async function heroHeal() {
  const gen = world.gen;
  hero.mp -= 5;
  hero.pose = "cast";
  hero.poseT = 0.8;
  spawn(healFx, { x: HERO_X, y: GROUND, seed: rint(1, 9), palette: PAL.heal, light: 0.9 });
  const before = hero.hp;
  hero.hp = Math.min(HERO_MAX_HP, hero.hp + 9);
  const healed = hero.hp - before;
  await wait(0.5);
  if (gen !== world.gen) return;
  spawn(dmgNumFx, { x: HERO_X - 10, y: GROUND - 34, text: `+${healed}`, palette: PAL.healNum, seed: 3 });
  paintHud();
  await wait(0.5);
  if (gen !== world.gen) return;
  hero.pose = "idle";
  await afterHeroAction(false);
}

async function heroPotion() {
  const gen = world.gen;
  hero.potions--;
  hero.pose = "potion";
  hero.poseT = 0.7;
  const before = hero.hp;
  hero.hp = Math.min(HERO_MAX_HP, hero.hp + 14);
  await wait(0.45);
  if (gen !== world.gen) return;
  spawn(dmgNumFx, { x: HERO_X - 10, y: GROUND - 34, text: `+${hero.hp - before}`, palette: PAL.healNum, seed: 4 });
  paintHud();
  await wait(0.5);
  if (gen !== world.gen) return;
  hero.pose = "idle";
  await afterHeroAction(false);
}

/** После действия героя: победа, иначе ход врага. */
async function afterHeroAction(enemyActs = true) {
  const gen = world.gen;
  if (foe.hp <= 0) return foeDown();
  if (!enemyActs) { B.busy = false; setCommands(true); return; }
  await wait(0.15);
  if (gen !== world.gen) return;
  await enemyTurn();
}

async function enemyTurn() {
  const gen = world.gen;
  const def = ENEMIES[foe.key];
  B.busy = true;
  setCommands(false);
  foe.turns++;
  const heavy = def.heavy && foe.turns % def.heavy.every === 0;
  hint(heavy ? `${foe.name} набирает воздух…` : `${foe.name} готовится.`);
  await wait(heavy ? 0.75 : 0.5);
  if (gen !== world.gen) return;
  hint("");
  // выпад врага в сторону героя
  const startX = ENEMY_X;
  for (let i = 1; i <= 6; i++) {
    if (gen !== world.gen) return;
    foe.inst.options.x = startX - i * 5;
    await wait(0.022);
  }
  const crit = Math.random() < (heavy ? 0.35 : 0.12);
  const base = heavy ? rint(def.heavy.min, def.heavy.max) : rint(def.min, def.max);
  hurtHero(Math.round(base * (crit ? 1.4 : 1)));
  hero.hurtFlash = 0.2;
  for (let i = 6; i >= 0; i--) {
    if (gen !== world.gen) return;
    foe.inst.options.x = startX - i * 5;
    await wait(0.03);
  }
  foe.inst.options.x = startX;
  if (hero.hp <= 0) return heroDown();
  await wait(0.35);
  if (gen !== world.gen) return;
  hero.pose = "idle";
  B.busy = false;
  B.round++;
  setCommands(true);
  hint(B.round === 1 && foe.key === "slime" ? "Теперь твой ход. Бей, пока слайм не прыгнул." : "");
}

async function foeDown() {
  const gen = world.gen;
  foe.dead = true;
  hitStop(0.14, 3);
  foe.inst.stop();
  await wait(0.9);
  if (gen !== world.gen) return;
  setCommands(false);
  if (foe.key === "slime") return victorySlime();
  return victoryFrog();
}

async function heroDown() {
  await wait(0.4);
  hero.pose = "hurt";
  hero.poseT = 99;
  setCommands(false);
  await wait(0.7);
  B.active = false;
  showHud(false);
  defeatCard();
}

// ---------------------------------------------------------------- пролог и победы
let save = loadSave();
function grantSkill() {
  hero.lv = 2;
  document.getElementById("cmdSkill").disabled = false;
  document.getElementById("heroLv").textContent = "ур. 2";
}

async function victorySlime() {
  await wait(0.4);
  B.active = false;
  showHud(false);
  save = { ver: 1, stage: "levelup" };
  storeSave(save);
  card({
    kicker: "Победа",
    title: "Слайм растёкся",
    text: "Опыт +24. Руки дрожат, но меч держится.",
    xp: 1,
    actions: [{ label: "Дальше", fn: levelUpBeat }],
    fine: "Первый бой всегда такой: страшно, потом смешно.",
  });
}

async function levelUpBeat() {
  hideCard();
  hero.lv = 2;
  document.getElementById("heroLv").textContent = "ур. 2";
  showHud(false);
  spawn(levelUpFx, { x: HERO_X, y: GROUND, seed: 6, palette: PAL.gold, text: "LEVEL 2", light: 1.1 });
  await wait(1.9);
  grantSkill();
  hero.mp = HERO_MAX_MP;
  hero.hp = Math.max(hero.hp, HERO_MAX_HP - 4);   // передышка у дома: почти полные силы
  paintHud();
  save = { ver: 1, stage: "battle2" };
  storeSave(save);
  card({
    kicker: "Уровень 2",
    title: "Выучен «Ледяной шип»",
    text: "Лёд бьёт больнее меча и жжёт жаб сильнее всего. 4 MP за каст; бабуля Ниса подлатала руку — HP и MP почти полные.",
    actions: [{ label: "К околице", fn: () => frogIntro() }],
    fine: "Подсказка: следи за MP — лечение тоже стоит маны.",
  });
}

async function frogIntro() {
  hideCard();
  showHud(false);
  await talk("Тиль", "Лукошко на месте… а в канаве кто-то ворчит.");
  await talk("Жаба-ворчун", "Ква. Это моя канава. И твой меч мне не нравится.");
  await talk("Тиль", "Значит, сначала поговорим льдом.");
  save = { ver: 1, stage: "battle2" };
  storeSave(save);
  await beginBattle("frog");
}

async function victoryFrog() {
  await wait(0.4);
  B.active = false;
  showHud(false);
  save = { ver: 1, stage: "done", level: 2 };
  storeSave(save);
  card({
    kicker: "Глава первая · конец пролога",
    title: "Продолжение следует",
    text: "Жаба уползла в камыши, лукошко доставлено, солнце село. Дома ждут горячий ужин и рассказ, в который никто не поверит.",
    actions: [{ label: "Играть снова", fn: () => restartAll() }],
    fine: "Сохранение: пролог пройден. Прогресс хранится только на этом устройстве.",
  });
}

function defeatCard() {
  card({
    kicker: "Не в этот раз",
    title: "Ты очнулся дома",
    text: "Бабуля Ниса перевязала руку и ничего не сказала — только подала меч обратно. Жаба всё ещё в канаве.",
    actions: [
      { label: "Попробовать снова", fn: () => retryFrog() },
    ],
    fine: "Мягкий рестарт: HP и MP полные, зелье вернулось.",
  });
}

async function retryFrog() {
  hideCard();
  hero.hp = HERO_MAX_HP;
  hero.mp = HERO_MAX_MP;
  hero.potions = 1;
  hero.pose = "idle";
  await beginBattle("frog");
}

// ---------------------------------------------------------------- карточки и реплики
const veil = document.getElementById("veil");
const el = (id) => document.getElementById(id);

function card({ kicker, title, text, actions = [], xp = 0, fine = "" }) {
  el("cardKicker").textContent = kicker || "";
  el("cardTitle").textContent = title || "";
  el("cardText").textContent = text || "";
  el("cardFine").textContent = fine || "";
  const box = el("cardActions");
  box.textContent = "";
  for (const a of actions) {
    const b = document.createElement("button");
    b.className = a.ghost ? "btn ghost" : "btn";
    b.textContent = a.label;
    b.onclick = () => a.fn();
    box.append(b);
  }
  const xpWrap = el("xpWrap");
  const fill = el("xpFill");
  fill.style.width = "0%";
  xpWrap.hidden = !xp;
  veil.classList.add("on");
  el("pause").hidden = true;
  if (xp) requestAnimationFrame(() => { fill.style.width = "100%"; });
}
function hideCard() {
  veil.classList.remove("on");
  el("pause").hidden = false;
}

const talkBox = el("talk");
let talkResolve = null;
function talk(speaker, text) {
  return new Promise((res) => {
    el("talkWho").textContent = speaker;
    el("talkText").textContent = text;
    talkBox.hidden = false;
    talkResolve = () => { talkBox.hidden = true; talkResolve = null; res(); };
  });
}
talkBox.addEventListener("click", () => talkResolve && talkResolve());

const hintBox = el("hint");
function hint(text) {
  hintBox.textContent = text || "";
  hintBox.hidden = !text;
}

// ---------------------------------------------------------------- HUD и команды
function paintHud() {
  const hp = clamp(hero.hp / HERO_MAX_HP, 0, 1), mp = clamp(hero.mp / HERO_MAX_MP, 0, 1);
  el("heroHpFill").style.width = `${hp * 100}%`;
  el("heroMpFill").style.width = `${mp * 100}%`;
  el("heroHpText").textContent = `${hero.hp}/${HERO_MAX_HP}`;
  el("heroMpText").textContent = `${hero.mp}/${HERO_MAX_MP}`;
  el("foeName").textContent = foe.name;
  el("foeHpFill").style.width = `${clamp(foe.hp / foe.maxHp, 0, 1) * 100}%`;
  el("heroLv").textContent = `ур. ${hero.lv}`;
  el("cmdPotion").querySelector("i").textContent = `×${hero.potions}`;
  const skill = el("cmdSkill"), heal = el("cmdHeal"), potion = el("cmdPotion");
  skill.disabled = !(hero.lv >= 2 && hero.mp >= 4);
  heal.disabled = !(hero.mp >= 5 && hero.hp < HERO_MAX_HP);
  potion.disabled = hero.potions <= 0 || hero.hp >= HERO_MAX_HP;
}
function showHud(on) { el("hud").hidden = !on; }
function setCommands(on) {
  el("commands").hidden = !on;
  talkBox.classList.toggle("above", on);
  if (on) paintHud();
}

const actions = {
  attack: heroAttack,
  skill: heroSkill,
  heal: heroHeal,
  potion: heroPotion,
};
el("commands").addEventListener("click", (e) => {
  const b = e.target.closest(".cmd");
  if (!b || b.disabled || B.busy || !B.active) return;
  B.busy = true;
  setCommands(false);
  hint("");
  actions[b.dataset.cmd]();
});

async function beginBattle(key) {
  startBattle(key);
  const gen = world.gen;     // startBattle увеличивает поколение: снимаем его уже после старта
  await wait(2.05);          // ирис закрывает и снова открывает сцену
  if (gen !== world.gen) return;
  B.busy = false;
  setCommands(true);
  hint(key === "slime" ? "Твой ход: тапни «Атака». Удар идёт с замахом и стоп-кадром." : "Бей льдом, если хватает MP.");
}

// ---------------------------------------------------------------- старт, пауза, сохранение
function loadSave() {
  try {
    const raw = localStorage.getItem("quiet-dusk");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function storeSave(data) {
  try { localStorage.setItem("quiet-dusk", JSON.stringify(data)); } catch { /* приватный режим */ }
}

function title() {
  B.active = false;
  showHud(false);
  setCommands(false);
  const canContinue = save && save.stage && save.stage !== "intro";
  const actionsList = [{ label: "Начать пролог", fn: () => newGame() }];
  if (canContinue) actionsList.unshift({ label: "Продолжить", fn: () => continueGame() });
  card({
    kicker: "Пошаговая JRPG · пролог",
    title: "Тихий закат",
    text: "Деревня Тихая Падь, последний час перед темнотой. Тиль берёт отцовский меч и идёт на околицу.",
    actions: actionsList,
    fine: "Играется в ландшафте, одной рукой. Прогресс сохраняется на устройстве.",
  });
}

async function newGame() {
  hideCard();
  save = { ver: 1, stage: "intro" };
  storeSave(save);
  hero.hp = HERO_MAX_HP; hero.mp = HERO_MAX_MP; hero.potions = 1; hero.lv = 1;
  grantSkillPending();
  showHud(false);
  paintHud();
  await talk("Бабуля Ниса", "Тиль, солнце сядет через час. Отнеси лукошко на околицу — и сразу назад.");
  await talk("Тиль", "Ба, там же только слизни. Они мягкие.");
  await talk("Бабуля Ниса", "Мягкие, пока не отрастили зубов. Возьми отцовский меч. И зелье — на всякий случай.");
  await talk("Тиль", "Хорошо. Туда и обратно.");
  save = { ver: 1, stage: "battle1" };
  storeSave(save);
  await beginBattle("slime");
}
function grantSkillPending() {
  document.getElementById("cmdSkill").disabled = true;
  document.getElementById("heroLv").textContent = "ур. 1";
}

async function continueGame() {
  hideCard();
  hero.hp = HERO_MAX_HP; hero.mp = HERO_MAX_MP; hero.potions = 1;
  if (save.stage === "done") {
    hero.lv = 2;
    card({
      kicker: "Пролог пройден",
      title: "Тихий закат",
      text: "Жаба в камышах, лукошко доставлено. Можно переиграть бой с жабой, чтобы попробовать иначе.",
      actions: [{ label: "Бой с жабой", fn: () => retryFrogWithSkill() }, { label: "С начала", fn: () => newGame() }],
      fine: "Продолжение следует — пролог пока заканчивается здесь.",
    });
    return;
  }
  if (save.stage === "battle2" || save.stage === "levelup") {
    hero.lv = 2;
    grantSkill();
    paintHud();
    showHud(true);
    await frogIntro();
    return;
  }
  await newGame();
}

async function retryFrogWithSkill() {
  hideCard();
  hero.lv = 2;
  grantSkill();
  hero.hp = HERO_MAX_HP; hero.mp = HERO_MAX_MP; hero.potions = 1;
  showHud(true);
  await beginBattle("frog");
}

function restartAll() {
  save = { ver: 1, stage: "intro" };
  storeSave(save);
  hero.hp = HERO_MAX_HP; hero.mp = HERO_MAX_MP; hero.potions = 1; hero.lv = 1;
  grantSkillPending();
  title();
}

el("pause").addEventListener("click", () => {
  card({
    kicker: "Пауза",
    title: "Передышка",
    text: "Мир подождёт. Дальше — с того же места.",
    actions: [
      { label: "Продолжить", fn: () => { hideCard(); if (B.active && !B.busy) setCommands(true); } },
      { label: "С начала", ghost: true, fn: () => restartAll() },
    ],
    fine: "Прогресс сохранён на устройстве.",
  });
});

// ---------------------------------------------------------------- цикл
let last = performance.now(), acc = 0;

function tick(dt) {
  clock.t += dt;
  if (world.shake > 0) world.shake = Math.max(0, world.shake - dt);
  if (hero.poseT > 0) {
    hero.poseT -= dt;
    if (hero.poseT <= 0 && hero.pose !== "idle") { hero.pose = "idle"; hero.lunge = 0; }
  }
  if (hero.hurtFlash > 0) hero.hurtFlash = Math.max(0, hero.hurtFlash - dt);
  if (foe.hurt > 0) foe.hurt = Math.max(0, foe.hurt - dt);

  if (world.freeze > 0) { world.freeze -= dt; return; }   // стоп-кадр: весь мир стоит

  for (let i = waits.length - 1; i >= 0; i--) {
    const w = waits[i];
    w.left -= dt;
    if (w.left <= 0) { waits.splice(i, 1); w.res(); }
  }
  if (fireflies) fireflies.update(dt);
  updateFx(dt);
  if (B.active && foe.inst && !foe.dead) foe.inst.update(dt);
}

function render() {
  clearFrame(frame);

  // сначала слои эффектов: каждый сам ставит painter в свою точку,
  // поэтому своих персонажей рисуем уже свежим painter'ом (он один на кадр)
  if (fireflies) fireflies.draw(frame, "back");
  const p = painterFor(frame).place(0, 0);
  p.lightK = 1;

  // тень и герой
  const lungeOff = hero.lunge ? Math.round(Math.sin(clamp((0.5 - hero.poseT) / 0.5, 0, 1) * Math.PI) * 11) : 0;
  groundShadow(p, HERO_X + lungeOff, GROUND - 1, 13, 3, 0.5);
  drawHero(p, HERO_X + lungeOff, GROUND, hero.pose, clock.t);
  if (hero.hurtFlash > 0) flashBox(p, HERO_X - 16 + lungeOff, GROUND - 46, HERO_X + 20 + lungeOff, GROUND - 1, hero.hurtFlash * 3.4, hex("#ff8a6a"));

  // враг
  if (foe.inst && !foe.dead) {
    const jiggle = foe.hurt > 0 ? Math.round(Math.sin(foe.hurt * 90) * 2) : 0;
    const base = foe.inst.options.x;
    foe.inst.options.x = base + jiggle;
    groundShadow(p, foe.inst.options.x, GROUND - 1, 12, 3, 0.45);
    foe.inst.draw(frame, "front");
    if (foe.hurt > 0) flashBox(p, foe.inst.options.x - 26, GROUND - 46, foe.inst.options.x + 26, GROUND - 1, foe.hurt * 4.2);
    foe.inst.options.x = base;
  }

  // эффекты
  for (const r of fx) r.inst.draw(frame, r.layer);
  for (const n of nums) n.inst.draw(frame, "front");

  composite(frame, img.data, bg);
  const shake = world.shake > 0 ? world.shake / world.shake0 : 0;
  const sx = Math.round(Math.sin(clock.t * 68) * world.amp * shake);
  const sy = Math.round(Math.cos(clock.t * 51) * world.amp * 0.6 * shake);
  ctx.fillStyle = BG_INK;
  ctx.fillRect(0, 0, W, H);
  ctx.putImageData(img, sx, sy);
}

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  acc += dt;
  let steps = 0;
  while (acc >= 1 / 60 && steps < 6) { acc -= 1 / 60; steps++; tick(1 / 60); }
  render();
  requestAnimationFrame(loop);
}

// ---------------------------------------------------------------- масштаб сцены
function fit() {
  const stage = document.getElementById("stage");
  const portrait = innerHeight > innerWidth;
  const maxW = innerWidth - 16;
  const maxH = innerHeight - (portrait ? 92 : 16);
  const s = Math.max(1, Math.min(Math.floor(maxW / W), Math.floor(maxH / H), 4));
  stage.style.width = `${W * s}px`;
  stage.style.height = `${H * s}px`;
  document.documentElement.style.setProperty("--s", String(s));
}
addEventListener("resize", fit);
new ResizeObserver(fit).observe(document.documentElement);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) last = performance.now();
});

// ---------------------------------------------------------------- тестовые хуки
window.__QUIET_DUSK__ = {
  get state() {
    return {
      phase: veil.classList.contains("on") ? "card" : B.active ? "battle" : "idle",
      busy: B.busy,
      round: B.round,
      foe: { key: foe.key, name: foe.name, hp: foe.hp, max: foe.maxHp, dead: foe.dead },
      hero: { hp: hero.hp, mp: hero.mp, potions: hero.potions, lv: hero.lv, pose: hero.pose },
      effects: fx.length,
      numbers: nums.length,
      save,
    };
  },
  card: () => ({ open: veil.classList.contains("on"), title: el("cardTitle").textContent, actions: [...el("cardActions").children].map((b) => b.textContent) }),
  talk: () => ({ open: !talkBox.hidden, speaker: el("talkWho").textContent, text: el("talkText").textContent }),
  press: (name) => {
    if (name === "talk") { talkResolve && talkResolve(); return true; }
    const b = document.querySelector(`.cmd[data-cmd="${name}"]`);
    if (!b) return false;
    if (b.disabled || B.busy || !B.active) return false;
    b.click();
    return true;
  },
  cardPress: (label) => {
    const b = [...el("cardActions").children].find((x) => x.textContent === label);
    if (!b) return false;
    b.click();
    return true;
  },
  newGame: () => newGame(),
  retry: () => retryFrog(),
  fight: (key) => beginBattle(key),
  skill: () => { hero.lv = 2; grantSkill(); },
  setHp: (hp) => { hero.hp = hp; paintHud(); },
  setFoeHp: (hp) => { foe.hp = hp; paintHud(); },
  async fastForward(seconds = 4) {
    const step = 1 / 60;
    for (let t = 0; t < seconds; t += step) {
      tick(step);
      await new Promise((r) => setTimeout(r, 0));
    }
  },
  scale: () => Number(document.documentElement.style.getPropertyValue("--s") || 0),
  /** bbox и число закрашенных пикселей в буфере кадра — для проверок, что герой и эффекты реально рисуются */
  probe: (x0 = 0, y0 = 0, x1 = W, y1 = H) => {
    let n = 0, minx = 1e9, miny = 1e9, maxx = -1, maxy = -1;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const c = frame.color[y * W + x];
        if (!(c >>> 24)) continue;
        n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
    return { n, box: [minx, miny, maxx, maxy] };
  },
};

// ---------------------------------------------------------------- офлайн
if ("serviceWorker" in navigator) {
  addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* без офлайна игра тоже работает */ });
  });
}

// ---------------------------------------------------------------- старт
fit();
paintHud();
title();
requestAnimationFrame(loop);
