// landplayer.js — зверь игрока на суше: движение, сытость, вода, силы, рост, мутации, общение.
//
// Модуль не знает о DOM и не импортирует landcore.js (иначе получится кольцо импортов):
// вся связь с миром — через объект game, как и у клетки в player.js.
//
// Три ресурса вместо одного:
//   здоровье  — как везде;
//   сытость   — падает постоянно, едой восстанавливается;
//   вода      — падает постоянно, восстанавливается у водоёмов и под дождём.
// Сверху — силы (stamina): короткий бег и рывок, восстанавливаются сами.
// Такая тройка делает сушу игрой про маршрут, а не про реакцию: без воды зверь гибнет быстрее,
// чем от хищника, и это заставляет держать в голове карту водоёмов.

import { CFG, LAND_PATHS, LAND_DIFFICULTY } from './config.js';
import {
  LANDPARTS, landAggregate, landUpkeep, landNextLevelCost, landPartUnlocked,
  landPartSlots, landFeatures, LAND_ABILITIES, landClamp,
} from './landparts.js';
import { LAND_FOOD_KINDS, LAND_SPECIES_BY_ID, socialScore } from './landspecies.js';
import { clamp, damp, angleDamp, RNG, dist, hypot, TAU } from './util.js';

const L = CFG.land;
const P = L.player;

export function landPathById(id) { return LAND_PATHS.find((l) => l.id === id) ?? LAND_PATHS[0]; }
export function landDifficultyById(id) { return LAND_DIFFICULTY[id] ?? LAND_DIFFICULTY.normal; }
export function landDifficultyName(id) { return landDifficultyById(id).name; }

// ------------------------------------------------------------------
// Создание зверя
// ------------------------------------------------------------------
export function createLandPlayer(pathId, difficultyId, seed = 1) {
  const path = landPathById(pathId);
  const diff = landDifficultyById(difficultyId);
  const feats = landFeatures(path.startParts ?? {});
  const p = {
    kind: 'player', stage: 'land', id: 0,
    x: 0, y: 0, vx: 0, vy: 0, heading: -Math.PI / 2,
    tier: 1, biomass: 0,
    hp: 0, maxHp: 0,
    satiety: 0, maxSatiety: 0,
    water: 0, maxWater: 0,
    stamina: 0, maxStamina: 0,
    dna: path.startDna ?? 26,
    parts: { ...(path.startParts ?? {}) },
    path: path.id,
    difficulty: difficultyId,
    color: path.color, color2: path.color2,
    features: [...feats.set], featureLvls: { ...feats.lvls },
    stats: {},
    cooldowns: { dash: 0, bite: 0, ability: 0, totem: 0, social: 0 },
    invuln: 0, dashTime: 0, hitFlash: 0, lastDamageAt: -99,
    bleed: { t: 0, dps: 0, by: null },
    poison: { t: 0, dps: 0, by: null },
    slow: { t: 0, factor: 1 },
    // знакомства: вид → { value (0..tame), allied, sworn, cooldown }
    sympathy: {},
    followers: [],
    counters: {
      kills: 0, killsNight: 0, fruits: 0, meat: 0, bones: 0, eggs: 0, drinks: 0,
      socialWins: 0, socialFails: 0, allies: 0, caches: 0, dmgTaken: 0, nights: 0, restedAt: 0,
    },
    flags: {
      pacifist: true, tyrantKilled: false, sworn: 0, nightSurvived: false,
      visitedRock: false, droughtSurvived: false, rainDrunk: false, danceSpecies: {},
    },
    runTime: 0,
    seed,
    rng: new RNG(seed * 977 + 31),
    social: { active: false, target: null, species: null, seq: [], step: 0, timer: 0, ok: 0 },
    restT: 0,
    walking: 0,
    nestPos: { x: 0, y: 0 },
    alive: true,
    mood: 'calm',
  };
  recomputeLandStats(p);
  p.hp = p.maxHp; p.satiety = p.maxSatiety; p.water = p.maxWater; p.stamina = p.maxStamina;
  return p;
}

// ------------------------------------------------------------------
// Характеристики из генома
// ------------------------------------------------------------------
export function recomputeLandStats(p, path = landPathById(p.path), diff = landDifficultyById(p.difficulty)) {
  const e = landAggregate(p.parts);
  const m = path.mods ?? {};
  const s = {
    armor: (e.armor ?? 0) + (m.armorBonus ?? 0),
    knockResist: landClamp(e.knockResist ?? 0, 0, 0.8),
    slowResist: landClamp(e.slowResist ?? 0, 0, 0.85),
    massMul: 1 + (e.massMul ?? 0),
    speedMul: (1 + (e.speedMul ?? 0)) * (m.speedMul ?? 1),
    sprintMul: 1 + (e.sprintMul ?? 0) * (m.staminaMul ?? 1),
    turnMul: 1 + (e.turnMul ?? 0),
    climb: landClamp(e.climb ?? 0, 0, 0.9),
    biteDmg: (1 + (e.biteDmg ?? 0) * 0.09) * (m.biteBonus ?? 1),
    biteRate: 1 + (e.biteRate ?? 0),
    bleed: e.bleed ?? 0,
    poison: e.poison ?? 0,
    meatVal: (1 + (e.meatVal ?? 0)) * (m.meatBonus ?? 1) * (m.meatPenalty ?? 1),
    plantVal: (1 + (e.plantVal ?? 0)) * (m.plantBonus ?? 1) * (m.plantPenalty ?? 1),
    dnaMul: 1 + (e.dnaMul ?? 0),
    staminaMaxAdd: e.staminaMax ?? 0,
    staminaRegenAdd: e.staminaRegen ?? 0,
    thirstMaxAdd: e.thirstMax ?? 0,
    waterSense: e.waterSense ?? 0,
    vision: P.vision + (e.vision ?? 0) + 26 * (p.tier - 1),
    radar: e.radar ?? 0,
    nightVision: landClamp(e.nightVision ?? 0, 0, 1),
    stealth: e.stealth ?? 0,
    socialGain: (e.socialGain ?? 0) * (m.socialMul ?? 1),
    singSkill: e.singSkill ?? 0,
    danceSkill: e.danceSkill ?? 0,
    poseSkill: e.poseSkill ?? 0,
    charmSkill: e.charmSkill ?? 0,
    patience: e.patience ?? 0,
    regen: e.regen ?? 0,
    spikeDmg: e.spikeDmg ?? 0,
    spikeKnock: e.spikeKnock ?? 0,
    abilityId: e.abilityId ?? null,
    mapAwareness: e.waterSense ?? 0,
  };
  const tier = p.tier - 1;
  s.maxHp = Math.round((P.baseHp + P.hpPerTier * tier) * (1 + (e.hpMul ?? 0)) * (m.hpMul ?? 1) + (e.maxHp ?? 0));
  s.radius = P.radius + P.radiusPerTier * tier;
  s.baseSpeed = P.baseSpeed * (1 + P.speedPerTier * tier) * s.speedMul;
  s.turnRate = 3.4 * s.turnMul;
  s.maxSatiety = P.baseSatiety + 14 * tier;
  s.satietyDrain = P.satietyDrain * (1 + 0.05 * tier);
  s.maxWater = (P.baseWater + 10 * tier + s.thirstMaxAdd) * (diff.water ?? 1);
  s.waterDrain = P.waterDrain * (1 + 0.06 * tier);
  s.maxStamina = (P.baseStamina + P.staminaPerTier * tier + s.staminaMaxAdd) * (m.staminaMul ?? 1);
  s.staminaRegen = 9 + s.staminaRegenAdd;
  s.upkeep = landUpkeep(p.parts) * (1 + tier * 0.04);
  s.slots = Math.floor(P.genomeSlotBase + P.genomeSlotPerTier * (p.tier - 1)) + (e.slotBonus ?? 0);

  p.stats = s;
  p.maxHp = s.maxHp;
  p.maxSatiety = s.maxSatiety;
  p.maxWater = s.maxWater;
  p.maxStamina = s.maxStamina;
  p.r = s.radius;
  p.hp = Math.min(p.hp, p.maxHp);
  p.satiety = Math.min(p.satiety, p.maxSatiety);
  p.water = Math.min(p.water, p.maxWater);

  // признаки тела для рисования
  const feats = landFeatures(p.parts);
  p.features = [...feats.set];
  p.featureLvls = { ...feats.lvls };
  return s;
}

export function landPartSlotsUsed(p) { return landPartSlots(p.parts); }

// ------------------------------------------------------------------
// Мутации
// ------------------------------------------------------------------
export function landEvolveCost(game, id) {
  const part = LANDPARTS[id];
  if (!part) return null;
  const base = landNextLevelCost(game.player.parts, id);
  if (base == null) return null;
  const nearTotem = dist(game.player.x, game.player.y, game.player.totemPos.x, game.player.totemPos.y) < 340;
  const surge = nearTotem ? 0 : P.evolveFarSurcharge;
  return { base, surcharge: surge, total: Math.round(base * (1 + surge)) };
}

export function tryLandEvolve(game, id) {
  const p = game.player;
  const part = LANDPARTS[id];
  if (!part) return { ok: false, msg: 'Такой части тела нет' };
  const lock = landPartUnlocked(part, p.tier, game.ach);
  if (!lock.ok) return { ok: false, msg: `Закрыто: ${lock.why}` };
  const cost = landEvolveCost(game, id);
  if (!cost) return { ok: false, msg: `${part.name}: максимальный уровень` };
  const lvl = p.parts[id] ?? 0;
  const used = landPartSlotsUsed(p);
  const slotsAfter = used - (lvl > 0 ? part.slots : 0) + part.slots;
  if (slotsAfter > p.stats.slots) return { ok: false, msg: `Не хватает ячеек: ${slotsAfter}/${p.stats.slots}` };
  if (p.dna < cost.total) return { ok: false, msg: `Нужно ${cost.total} ДНК, есть ${Math.floor(p.dna)}` };
  p.dna -= cost.total;
  p.parts[id] = lvl + 1;
  recomputeLandStats(p);
  p.hp = Math.min(p.hp + (part.levels[lvl].eff.maxHp ?? 0), p.maxHp);
  game.emit('evolve', { id, level: lvl + 1, part });
  return { ok: true, msg: `${part.name} → уровень ${lvl + 1}` };
}

export function landRefund(game, id) {
  const p = game.player;
  const part = LANDPARTS[id];
  if (!part) return { ok: false, msg: 'Нет такой части' };
  const lvl = p.parts[id] ?? 0;
  const keep = landPathById(p.path).startParts?.[id] ?? 0;
  if (lvl <= keep) return { ok: false, msg: 'Стартовая часть — не убрать' };
  let back = 0;
  for (let l = keep; l < lvl; l++) back += part.levels[l].dna;
  const refund = Math.round(back * 0.6);
  p.dna += refund;
  if (keep === 0) delete p.parts[id]; else p.parts[id] = keep;
  recomputeLandStats(p);
  return { ok: true, msg: `Убрано, возвращено ${refund} ДНК` };
}

export function landActiveAbility(p) {
  const id = p.stats.abilityId;
  return id ? { id, ...LAND_ABILITIES[id] } : null;
}

// ------------------------------------------------------------------
// Еда и вода
// ------------------------------------------------------------------
export function landFoodMultiplier(p, kind) {
  const s = p.stats;
  if (kind.plant) return s.plantVal;
  if (kind.dna) return 1;
  return s.meatVal;
}

export function consumeLandFood(game, food) {
  const p = game.player;
  const kind = LAND_FOOD_KINDS[food.kind];
  if (!kind) return 0;
  const mult = landFoodMultiplier(p, kind);
  const grow = kind.value * mult;
  p.biomass += grow;
  p.satiety = Math.min(p.maxSatiety, p.satiety + kind.value * 6.5);
  p.water = Math.min(p.maxWater, p.water + (kind.plant ? kind.value * 1.6 : kind.value * 0.4));
  const dnaGain = kind.xp * (0.6 + p.stats.dnaMul * 0.5) * landDifficultyById(p.difficulty).dnai;
  p.dna += dnaGain;
  if (kind.dna) p.dna += kind.dna;
  p.hp = Math.min(p.maxHp, p.hp + P.eatHeal * kind.value);

  if (kind.plant) p.counters.fruits++;
  else if (food.kind === 'egg') { p.counters.eggs++; p.counters.meat++; }
  else if (food.kind === 'bone') p.counters.bones++;
  else p.counters.meat++;
  if (food.kind === 'bone') {
    p.counters.caches++;
    game.emit('cache', { amount: kind.dna, x: food.x, y: food.y });
  }
  game.emit('eat', { kind: food.kind, grow, dnaGain });
  checkLandGrowth(game);
  return grow;
}

export function checkLandGrowth(game) {
  const p = game.player;
  while (p.tier < P.maxTier && p.biomass >= P.growth[p.tier - 1]) {
    p.biomass -= P.growth[p.tier - 1];
    p.tier++;
    recomputeLandStats(p);
    p.hp = p.maxHp;
    p.satiety = p.maxSatiety;
    game.emit('grow', { tier: p.tier });
  }
  if (p.tier >= P.maxTier) p.biomass = Math.min(p.biomass, P.growth[P.maxTier - 1] * 0.999);
}

export function landGainDna(game, amount, reason = '') {
  const p = game.player;
  const gain = amount * landDifficultyById(p.difficulty).dnai;
  p.dna += gain;
  if (reason === 'quest' || amount >= 12) game.float(`+${Math.round(gain)} ДНК`, p.x, p.y - p.r - 14, '#ffe38f', 13);
  return gain;
}

// ------------------------------------------------------------------
// Общение с видами
// ------------------------------------------------------------------
export function sympathyOf(p, spId) {
  p.sympathy[spId] ??= { value: 0, allied: false, sworn: false, cd: 0, wins: 0 };
  return p.sympathy[spId];
}

export function canStartSocial(game, c) {
  const p = game.player;
  if (!c || c.dead || c.boss || c.sp.hostile) return { ok: false, why: 'Этот зверь не станет слушать' };
  if (c.ally) return { ok: false, why: 'Он уже в твоей стае' };
  const st = sympathyOf(p, c.sp.id);
  if (st.cd > 0) return { ok: false, why: `${c.sp.name} ещё не отошёл (${Math.ceil(st.cd)} с)` };
  if (dist(p.x, p.y, c.x, c.y) > L.social.startRadius + c.r) return { ok: false, why: 'Подойди ближе' };
  return { ok: true };
}

// Начать знакомство: выбираем цепочку действий из вкусов вида.
export function startSocial(game, c) {
  const p = game.player;
  const check = canStartSocial(game, c);
  if (!check.ok) return check;
  const sp = c.sp;
  const rng = p.rng;
  const seq = [];
  for (let i = 0; i < L.social.sequence; i++) {
    // в цепочке чаще то, что вид любит, но с подвохом: иногда проверяется «нелюбимое»
    const liked = sp.social.likes.length ? rng.pick(sp.social.likes) : 'sing';
    seq.push(rng.chance(0.25) && sp.social.hates ? sp.social.hates : liked);
  }
  p.social = { active: true, target: c, species: sp.id, seq, step: 0, timer: L.social.stepTime, ok: 0 };
  c.socialWith = 1;
  game.emit('socialStart', { creature: c, species: sp, seq });
  return { ok: true, seq };
}

export function socialAct(game, action) {
  const p = game.player;
  const s = p.social;
  if (!s.active || !s.target || s.target.dead) return { ok: false, why: 'Знакомство уже закончилось' };
  const sp = LAND_SPECIES_BY_ID[s.species];
  const needed = s.seq[s.step];
  const st = sympathyOf(p, s.species);
  const score = socialScore(sp, action, p.stats);
  const right = action === needed;
  if (right) {
    s.step++;
    s.ok++;
    st.value = clamp(st.value + Math.max(1, score), 0, 100);
    game.emit('socialStep', { action, ok: true, value: st.value, species: sp, step: s.step });
    game.float(`${sp.social.likes.includes(action) ? '♥' : '♪'} +${Math.round(Math.max(1, score))}`, s.target.x, s.target.y - s.target.r - 12, '#ffd9f0', 13);
    s.timer = L.social.stepTime;
    if (s.step >= s.seq.length) return finishSocial(game, true);
  } else {
    st.value = clamp(st.value + Math.min(0, score) - L.social.hatePenalty * 0.5, 0, 100);
    game.emit('socialStep', { action, ok: false, value: st.value, species: sp, step: s.step });
    game.float('не то', s.target.x, s.target.y - s.target.r - 12, '#ff9f9f', 13);
    s.timer -= 0.8;
    if (s.timer <= 0) return finishSocial(game, false);
  }
  return { ok: true, step: s.step };
}

export function finishSocial(game, success) {
  const p = game.player;
  const s = p.social;
  const sp = LAND_SPECIES_BY_ID[s.species];
  const st = sympathyOf(p, sp.id);
  st.cd = success ? L.social.cooldown * 0.5 : L.social.cooldown;
  if (s.target) s.target.socialWith = 0;
  p.social = { active: false, target: null, species: null, seq: [], step: 0, timer: 0, ok: 0 };
  if (!success) {
    p.counters.socialFails++;
    game.emit('socialEnd', { species: sp, success: false, value: st.value });
    return { ok: false, why: `${sp.name} обиделся` };
  }
  p.counters.socialWins++;
  st.wins++;
  game.emit('socialEnd', { species: sp, success: true, value: st.value });
  landGainDna(game, 6 + p.tier, 'social');
  if (!st.allied && st.value >= sp.tame) allySpecies(game, sp.id, s.target);
  return { ok: true };
}

export function cancelSocial(game) {
  const p = game.player;
  if (!p.social.active) return;
  const sp = LAND_SPECIES_BY_ID[p.social.species];
  if (p.social.target) p.social.target.socialWith = 0;
  p.social = { active: false, target: null, species: null, seq: [], step: 0, timer: 0, ok: 0 };
  game.emit('socialEnd', { species: sp, success: false, value: 0, cancelled: true });
}

// Вид становится союзником: все его особи рядом переходят в стаю.
export function allySpecies(game, spId, first = null) {
  const p = game.player;
  const sp = LAND_SPECIES_BY_ID[spId];
  const st = sympathyOf(p, spId);
  st.allied = true;
  st.value = 100;
  p.counters.allies++;
  let n = 0;
  for (const c of game.creatures) {
    if (c.dead || c.sp.id !== spId) continue;
    if (dist(c.x, c.y, p.x, p.y) > 1100 && c !== first) continue;
    c.ally = true;
    c.socialWith = 0;
    n++;
  }
  game.emit('ally', { species: sp, count: n, id: spId });
  game.float(`СТАЯ: ${sp.name}`, p.x, p.y - p.r - 22, '#9fe6a0', 15);
  return n;
}

// Присяга у тотема: союзный вид должен добраться до гнезда игрока.
export function checkSworn(game) {
  const p = game.player;
  const r = L.social.swornRadius;
  let sworn = 0;
  for (const id in p.sympathy) {
    const st = p.sympathy[id];
    if (!st.allied) continue;
    st.nearTotem = false;
    for (const c of game.creatures) {
      if (c.dead || !c.ally || c.sp.id !== id) continue;
      if (dist(c.x, c.y, p.totemPos.x, p.totemPos.y) < r) { st.nearTotem = true; break; }
    }
    if (st.nearTotem && !st.sworn) {
      st.sworn = true;
      p.flags.sworn = Object.values(p.sympathy).filter((s) => s.sworn).length;
      game.emit('sworn', { species: LAND_SPECIES_BY_ID[id], count: p.flags.sworn });
    }
    if (st.sworn) sworn++;
  }
  return sworn;
}

// Присягнувшие виды остаются у тотема (не бегут за игроком)
export function updateFollowers(game, dt) {
  const p = game.player;
  for (const c of game.creatures) {
    if (!c.ally || c.dead) continue;
    if (c.swornStay) continue;
    const d = dist(c.x, c.y, p.x, p.y);
    if (c.followTimer > 0) c.followTimer -= dt;
    c.aiTimer -= dt;
    if (c.aiTimer > 0) continue;
    c.aiTimer = 0.3 + game.rng.next() * 0.2;
    if (d > L.social.allyFollow) c.follow = { x: p.x, y: p.y };
  }
}

// ------------------------------------------------------------------
// Урон игроку и смерть
// ------------------------------------------------------------------
export function landDamagePlayer(game, amount, source = null, opts = {}) {
  const p = game.player;
  if (!p.alive || p.invuln > 0 || p.dashTime > 0) return 0;
  let dmg = amount * landDifficultyById(p.difficulty).dmg;
  if (!opts.armorPierce) dmg *= 1 / (1 + p.stats.armor / 30);
  else dmg *= 1 / (1 + p.stats.armor / 30 / 2.4);
  // Ни один удар не снимает больше трети здоровья: на телефоне у игрока должно быть
  // время отреагировать, а смерть от одного укуса в спину читается как поломка, а не как угроза.
  dmg = Math.min(dmg, p.maxHp * P.hitCap);
  if (opts.bleed) { p.bleed.dps = Math.max(p.bleed.dps, opts.bleed); p.bleed.t = Math.max(p.bleed.t, opts.bleedTime ?? 4); p.bleed.by = source; }
  if (opts.poison) { p.poison.dps = Math.max(p.poison.dps, opts.poison); p.poison.t = Math.max(p.poison.t, opts.poisonTime ?? 4.5); p.poison.by = source; }
  dmg = Math.max(0.4, dmg);
  p.hp -= dmg;
  p.hitFlash = 1;
  p.lastDamageAt = game.time;
  p.counters.dmgTaken += dmg;
  game.shake(Math.min(9, 2.2 + dmg * 0.24));
  game.emit('playerHit', { dmg, source });
  if (p.hp <= 0) { p.hp = 0; killLandPlayer(game, source); }
  return dmg;
}

export function killLandPlayer(game, source) {
  const p = game.player;
  if (!p.alive) return;
  p.alive = false;
  cancelSocial(game);
  game.emit('playerDeath', { source, stats: landSummary(p) });
  game.onPlayerDeath?.();
}

export function landSummary(p) {
  return {
    stage: 'land', tier: p.tier, dna: Math.round(p.dna), kills: p.counters.kills,
    plants: p.counters.fruits, meat: p.counters.meat, caches: p.counters.bones,
    time: p.runTime, allies: p.counters.allies, dances: p.counters.socialWins,
    eggs: p.counters.eggs, sworn: p.flags.sworn ?? 0, drinks: p.counters.drinks,
  };
}

export function landPushPlayer(game, nx, ny, force) {
  const p = game.player;
  const k = force * (1 - p.stats.knockResist) * (1 / Math.max(0.4, p.stats.massMul));
  p.vx += nx * k;
  p.vy += ny * k;
  game._pushFx ??= 0;
  if (game.time - game._pushFx > 0.05) {
    game._pushFx = game.time;
    for (let i = 0; i < 4; i++) {
      const a = Math.atan2(-ny, -nx) + (game.rng.next() - 0.5) * 1.4;
      game.spawnParticle(p.x + nx * p.r * 0.6, p.y + ny * p.r * 0.6, 'dust', '#e8dcc0', 2.4, Math.cos(a) * 60, Math.sin(a) * 60, 0.5);
    }
  }
  return k;
}

export function applyLandSlow(game, factor, time) {
  const p = game.player;
  const strength = 1 - (1 - factor) * (1 - landClamp(p.stats.slowResist ?? 0, 0, 0.85));
  if (p.slow.t <= 0 || strength < p.slow.factor) p.slow.factor = strength;
  p.slow.t = Math.max(p.slow.t, time);
}

// ------------------------------------------------------------------
// Шаг игрока
// ------------------------------------------------------------------
export function updateLandPlayer(game, dt, input) {
  const p = game.player;
  const s = p.stats;
  const ax = clamp(input.ax ?? 0, -1, 1), ay = clamp(input.ay ?? 0, -1, 1);
  const wantMag = hypot(ax, ay);
  const swimming = !!p.inWater;

  // --- таймеры состояний
  if (p.invuln > 0) p.invuln -= dt;
  if (p.hitFlash > 0) p.hitFlash -= dt * 3;
  if (p.dashTime > 0) p.dashTime -= dt;
  for (const k in p.cooldowns) if (p.cooldowns[k] > 0) p.cooldowns[k] = Math.max(0, p.cooldowns[k] - dt);
  if (p.slow.t > 0) { p.slow.t -= dt; if (p.slow.t <= 0) p.slow.factor = 1; }
  if (p.bleed.t > 0) {
    p.bleed.t -= dt;
    landDamagePlayer(game, p.bleed.dps * dt, p.bleed.by, { armorPierce: false });
    if (game.rng.chance(dt * 3)) game.spawnParticle(p.x, p.y, 'goo', '#c2402f', 2.6);
    if (p.bleed.t <= 0) p.bleed.dps = 0;
  }
  if (p.poison.t > 0) {
    p.poison.t -= dt;
    landDamagePlayer(game, p.poison.dps * dt, p.poison.by, { armorPierce: false });
    if (game.rng.chance(dt * 5)) game.spawnParticle(p.x, p.y, 'goo', '#c9ff5e', 2.4);
    if (p.poison.t <= 0) p.poison.dps = 0;
  }

  // --- обмен веществ: сытость и вода
  const restMod = p.resting ? 0.45 : 1;
  p.satiety -= s.satietyDrain * restMod * dt * (game.event?.id === 'drought' ? 1.15 : 1);
  p.water -= s.waterDrain * restMod * dt * (game.event?.id === 'drought' ? 1.9 : 1) * (swimming ? 0.2 : 1);
  if (game.raining) p.water += 2.2 * dt;
  if (p.satiety <= 0) {
    p.hp -= P.starve * dt;
    if (game.rng.chance(dt * 4)) game.spawnParticle(p.x, p.y, 'goo', '#ff8f8f', 2);
  }
  if (p.water <= 0) {
    p.hp -= P.dehydrate * dt;
    if (game.rng.chance(dt * 5)) game.spawnParticle(p.x, p.y, 'dust', '#ffd8a0', 2);
  }
  if (p.hp <= 0) { p.hp = 0; killLandPlayer(game, null); return; }
  if (game.time - p.lastDamageAt > P.noCombatTime && !p.resting) {
    p.hp = Math.min(p.maxHp, p.hp + (s.regen + P.regenOutOfCombat) * dt);
  }

  // --- силы и бег
  const sprinting = !!input.dashHeld && wantMag > 0.25 && p.stamina > P.sprintMin && p.dashTime <= 0;
  if (sprinting) p.stamina = Math.max(0, p.stamina - P.sprintCost * dt);
  else p.stamina = Math.min(p.maxStamina, p.stamina + s.staminaRegen * dt * (wantMag < 0.1 ? 1.35 : 0.8));

  // --- движение
  let speed = s.baseSpeed * (sprinting ? P.sprintMul * s.sprintMul : 1);
  if (swimming) speed *= L.dive.waterSlow;
  if (p.slow.factor < 1) speed *= p.slow.factor;
  if (p.dashTime > 0) speed *= 2.4;
  const wall = game.terrainFactor?.(p.x, p.y) ?? 1;   // трава/песок/камень: где-то быстрее, где-то медленнее
  speed *= wall;

  if (wantMag > 0.02) {
    const targetA = Math.atan2(ay, ax);
    p.heading = angleDamp(p.heading, targetA, s.turnRate * 2.2, dt);
    const targetVx = Math.cos(targetA) * speed * Math.min(1, wantMag);
    const targetVy = Math.sin(targetA) * speed * Math.min(1, wantMag);
    p.vx = damp(p.vx, p.vx * 0.3 + targetVx * 0.7, P.accelLambda, dt);
    p.vy = damp(p.vy, p.vy * 0.3 + targetVy * 0.7, P.accelLambda, dt);
    p.walking += dt * (2.6 + Math.min(1, Math.hypot(p.vx, p.vy) / s.baseSpeed) * 6);
  } else {
    // точное торможение на месте: зверь не «плывёт» по инерции, как клетка
    p.vx = damp(p.vx, 0, P.accelLambda * 1.4, dt);
    p.vy = damp(p.vy, 0, P.accelLambda * 1.4, dt);
    p.walking += dt * 1.2;
  }

  // рывок
  if (input.dash && p.cooldowns.dash <= 0 && p.stamina > 4) {
    const a = wantMag > 0.1 ? Math.atan2(ay, ax) : p.heading;
    p.vx += Math.cos(a) * P.dashPower * (1 + (s.sprintMul - 1) * 0.6);
    p.vy += Math.sin(a) * P.dashPower * (1 + (s.sprintMul - 1) * 0.6);
    p.dashTime = P.dashTime;
    p.invuln = Math.max(p.invuln, P.dashInvuln);
    p.cooldowns.dash = P.dashCooldown;
    p.stamina = Math.max(0, p.stamina - P.dashCost);
    p.counters.dashes = (p.counters.dashes ?? 0) + 1;
    game.emit('dash', { x: p.x, y: p.y });
    for (let i = 0; i < 8; i++) {
      const ang = a + Math.PI + (game.rng.next() - 0.5) * 1.2;
      game.spawnParticle(p.x + Math.cos(ang) * p.r * 0.5, p.y + Math.sin(ang) * p.r * 0.5, 'dust',
        '#e8dcc0', 2.6, Math.cos(ang) * 90, Math.sin(ang) * 90, 0.6);
    }
  }

  // лазание по камням: без когтей камень тормозит сильнее
  p.x += p.vx * dt;
  p.y += p.vy * dt;

  // --- укус
  if (p.cooldowns.bite > 0) p.cooldowns.bite -= dt;
  p.wantsBite = !!input.bite && p.satiety < p.maxSatiety * 0.995;

  // --- общение: идёт цепочка действий
  if (p.social.active) {
    const s2 = p.social;
    s2.timer -= dt;
    if (!s2.target || s2.target.dead || dist(p.x, p.y, s2.target.x, s2.target.y) > L.social.keepRadius) {
      cancelSocial(game);
      game.emit('banner', { text: 'Знакомство сорвалось: партнёр ушёл', kind: 'bad' });
    } else if (s2.timer <= 0) {
      finishSocial(game, false);
      game.emit('banner', { text: 'Зверь потерял интерес', kind: 'bad' });
    }
  }
  for (const st of Object.values(p.sympathy)) if (st.cd > 0) st.cd = Math.max(0, st.cd - dt);

  p.runTime += dt;
}
