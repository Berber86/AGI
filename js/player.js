// player.js — клетка игрока: движение, обмен веществ, рост, мутации, социальность.
//
// Вся связь с миром — через объект game (см. core.js). Модуль не импортирует core,
// чтобы не создавать циклических зависимостей.

import { CFG, LINEAGES, DIFFICULTY_ORDER } from './config.js';
import { PARTS, aggregate, upkeepOf, nextLevelCost, partUnlocked, ABILITIES } from './parts.js';
import { clamp, damp, angleDamp, RNG, dist, hypot } from './util.js';
import { FOOD_KINDS } from './species.js';

const P = CFG.player;

export function lineageById(id) { return LINEAGES.find((l) => l.id === id) ?? LINEAGES[0]; }

// ------------------------------------------------------------------
// Создание клетки
// ------------------------------------------------------------------
export function createPlayer(lineageId, difficultyId, seed = 1) {
  const lin = lineageById(lineageId);
  const diff = CFG.difficulty[difficultyId] ?? CFG.difficulty.normal;
  const p = {
    kind: 'player',
    id: 0,
    x: 0, y: 0, vx: 0, vy: 0, heading: 0,
    tier: 1, biomass: 0,
    hp: 0, maxHp: 0, energy: 0, maxEnergy: 0,
    dna: lin.startDna ?? 20,
    parts: { ...(lin.startParts ?? {}) },
    lineage: lin.id,
    difficulty: difficultyId,
    stats: {},
    cooldowns: { dash: 0, bite: 0, ability: 0, nest: 0, call: 0 },
    invuln: 0, dashTime: 0, hitFlash: 0, lastDamageAt: -99,
    rep: {},                 // вид -> { rep, state, sync, met, gifts }
    allies: [],
    relicGenes: 0,
    runTime: 0,
    counters: { kills: 0, plants: 0, meat: 0, killsNight: 0, killsByFamily: {}, dances: 0, allies: 0, relics: 0, dmgTaken: 0, survived: 0, bloomEats: 0 },
    flags: { pacifist: true, stormSurvived: false, bossKilled: false, danceSpecies: {}, dodge: 0 },
    slow: { t: 0, factor: 1 },
    poison: { t: 0, dps: 0, by: null },
    cloak: 0,
    seed,
    rng: new RNG(seed * 977 + 13),
    dance: { target: null, progress: 0, lastAttack: 0 },
    nestPos: { x: 0, y: 0 },
    alive: true,
    mood: 'calm',
  };
  recomputeStats(p, lin, diff);
  p.hp = p.maxHp; p.energy = p.maxEnergy;
  p.nestPos = { x: 0, y: 0 };
  return p;
}

// ------------------------------------------------------------------
// Пересчёт характеристик из генома (вызывается после каждой мутации)
// ------------------------------------------------------------------
export function recomputeStats(p, lin = lineageById(p.lineage), diff = CFG.difficulty[p.difficulty] ?? CFG.difficulty.normal) {
  const e = aggregate(p.parts);
  const s = {
    maxHpBonus: Math.round(e.maxHp ?? 0),
    hpMul: (1 + (e.hpMul ?? 0)) * (lin.mods.hpMul ?? 1),
    speedMul: (1 + (e.speedMul ?? 0)) * (lin.mods.speedMul ?? 1),
    turnMul: 1 + (e.turnMul ?? 0),
    armor: e.armor ?? 0,
    regen: e.regen ?? 0,
    spikeDmg: e.spikeDmg ?? 0,
    spikeKnock: e.spikeKnock ?? 0,
    poison: e.poison ?? 0,
    poisonPierce: e.poisonArmorPierce ? 1 : 0,
    stunOnBite: e.stunOnBite ?? 0,
    slowOnBite: e.slowOnBite ?? 0,
    slowFactor: e.slowFactor ?? 0.5,
    knockResist: clamp(e.knockResist ?? 0, 0, 0.85),
    lifeSteal: e.lifeSteal ?? 0,
    plantVal: (1 + (e.plantVal ?? 0)) * (lin.mods.plantBonus ?? 1),
    meatVal: (1 + (e.meatVal ?? 0)) * (lin.mods.meatBonus ?? 1),
    dnaMul: 1 + (e.dnaMul ?? 0),
    eatAll: e.eatAll ? 1 : 0,
    energyMaxAdd: e.energyMax ?? 0,
    energyRegenAdd: e.energyRegen ?? 0,
    upkeepMul: (1 + (e.upkeepMul ?? 0)) * (lin.mods.upkeepMul ?? 1),
    symbionts: e.symbionts ?? 0,
    magnet: e.magnet ?? 0,
    vision: e.vision ?? 0,
    radar: e.radar ?? 0,
    dashPowerAdd: e.dashPower ?? 0,
    dashCdMul: clamp(1 + (e.dashCd ?? 0), 0.35, 2),
    cloakOnHit: e.cloakOnHit ?? 0,
    attractSmall: e.attractSmall ?? 0,
    nightVision: e.nightVision ?? 0,
    abilityId: e.abilityId ?? null,
    biteRate: 1 + (e.biteRate ?? 0),
    massMul: 1 + (e.massMul ?? 0),
    repMul: lin.mods.repMul ?? 1,
    upkeep: 0,
  };

  const tier = p.tier - 1;
  s.radius = P.radius + P.radiusPerTier * tier;
  s.baseSpeed = P.baseSpeed * (1 + P.speedPerTier * tier) * s.speedMul;
  s.turnRate = 3.0 * s.turnMul;
  s.maxHp = Math.round((P.baseHp + P.hpPerTier * tier) * s.hpMul + s.maxHpBonus);
  s.maxEnergy = P.baseEnergy + s.energyMaxAdd + 6 * tier;
  s.energyRegen = P.energyRegen + s.energyRegenAdd;
  s.upkeep = upkeepOf(p.parts) * s.upkeepMul;
  if (lin.mods.symbiosis) s.energyRegen += 1 * (s.symbionts || 1);
  s.vision = P.vision + s.vision + 22 * tier;
  s.slots = Math.floor(P.genomeSlotBase + P.genomeSlotPerTier * (p.tier - 1));

  p.stats = s;
  p.maxHp = s.maxHp;
  p.maxEnergy = s.maxEnergy;
  p.r = s.radius;
  p.hp = Math.min(p.hp, p.maxHp);
  return s;
}

export function partSlotsUsed(p) {
  let n = 0;
  for (const id in p.parts) if (PARTS[id]) n += PARTS[id].slots;
  return n;
}

// ------------------------------------------------------------------
// Мутации
// ------------------------------------------------------------------
export function evolveCost(game, id) {
  const p = game.player;
  const base = nextLevelCost(p.parts, id);
  if (base == null) return null;
  const nearNest = dist(p.x, p.y, p.nestPos.x, p.nestPos.y) < 320 || game.canAnywhereEvolve;
  const surcharge = nearNest ? 0 : P.evolveFarSurcharge;
  return { base, total: Math.round(base * (1 + surcharge)), surcharge };
}

export function tryEvolve(game, id) {
  const p = game.player;
  const part = PARTS[id];
  if (!part) return { ok: false, msg: 'Неизвестная органелла' };
  const lock = partUnlocked(part, p.tier, game.ach);
  if (!lock.ok) return { ok: false, msg: `Недоступно: ${lock.why}` };

  const cost = evolveCost(game, id);
  if (cost == null) return { ok: false, msg: 'Уже максимальный уровень' };

  const used = partSlotsUsed(p);
  const installed = (p.parts[id] ?? 0) > 0;
  if (!installed && used + part.slots > p.stats.slots) {
    return { ok: false, msg: `Нет свободных ячеек: занято ${used}/${p.stats.slots}` };
  }
  if (p.dna < cost.total) return { ok: false, msg: `Нужно ${cost.total} ДНК (есть ${Math.floor(p.dna)})` };

  p.dna -= cost.total;
  p.parts[id] = (p.parts[id] ?? 0) + 1;
  recomputeStats(p);
  game.emit('evolve', { id, level: p.parts[id] });
  return { ok: true, level: p.parts[id], msg: `${part.name} — уровень ${p.parts[id]}` };
}

export function refundGenome(p) {
  // «Сбросить геном»: вернуть 60% вложенной ДНК и снять все детали, кроме стартовых.
  const lin = lineageById(p.lineage);
  let back = 0;
  for (const id in p.parts) {
    const part = PARTS[id]; if (!part) continue;
    const keep = lin.startParts?.[id] ?? 0;
    for (let lvl = keep; lvl < p.parts[id]; lvl++) back += part.levels[lvl].dna;
  }
  p.dna += Math.round(back * 0.6);
  p.parts = { ...(lin.startParts ?? {}) };
  recomputeStats(p);
  return Math.round(back * 0.6);
}

// ------------------------------------------------------------------
// Обмен веществ
// ------------------------------------------------------------------
export function foodMultiplier(p, kind) {
  const s = p.stats;
  if (kind.plant) {
    return s.eatAll ? Math.max(1, s.plantVal) : s.plantVal;
  }
  if (kind.relic) return 1;
  return s.eatAll ? Math.max(1, s.meatVal) : s.meatVal;
}

// Съесть биомассу: возвращает фактически полученный рост.
export function consumeFood(game, food) {
  const p = game.player;
  const kind = FOOD_KINDS[food.kind];
  const mult = foodMultiplier(p, kind);
  const grow = kind.value * mult;
  p.biomass += grow;
  p.energy = Math.min(p.maxEnergy, p.energy + kind.value * 3.4);
  const dnaGain = kind.xp * (0.6 + p.stats.dnaMul * 0.5) * (p.difficulty === 'abyss' ? 0.8 : 1);
  p.dna += dnaGain * CFG.difficulty[p.difficulty].dnai;

  if (kind.plant || food.kind === 'algae') p.counters.plants++;
  else p.counters.meat++;
  if (game.event?.id === 'bloom') p.counters.bloomEats++;
  if (food.kind === 'relic') {
    p.relicGenes = Math.min(3, p.relicGenes + 1);
    p.counters.relics = p.relicGenes;
    game.emit('relic', { count: p.relicGenes });
  }
  p.hp = Math.min(p.maxHp, p.hp + P.eatHeal * kind.value);
  game.emit('eat', { kind: food.kind, grow, dnaGain });
  checkGrowth(game);
  return grow;
}

export function checkGrowth(game) {
  const p = game.player;
  while (p.tier < P.maxTier && p.biomass >= P.growth[p.tier - 1]) {
    p.biomass -= P.growth[p.tier - 1];
    p.tier++;
    recomputeStats(p);
    p.hp = p.maxHp;
    p.energy = p.maxEnergy;
    game.emit('grow', { tier: p.tier });
  }
  if (p.tier >= P.maxTier) p.biomass = Math.min(p.biomass, P.growth[P.maxTier - 1] * 0.999);
}

export function gainDna(game, amount, reason = '') {
  const p = game.player;
  p.dna += amount * CFG.difficulty[p.difficulty].dnai * p.stats.dnaMul;
  if (reason) game.emit('dna', { amount, reason });
}

// ------------------------------------------------------------------
// Получение урона и смерть
// ------------------------------------------------------------------
export function damagePlayer(game, amount, source = null, opts = {}) {
  const p = game.player;
  if (!p.alive || p.invuln > 0 || p.dashTime > 0) return 0;
  let dmg = amount * CFG.difficulty[p.difficulty].dmg;
  if (!opts.armorPierce) {
    const armor = p.stats.armor;
    dmg *= 1 / (1 + armor / 34);
  } else {
    dmg *= 1 / (1 + p.stats.armor / 34 / 2.4);
  }
  if (opts.poison) {
    p.poison.dps = Math.max(p.poison.dps, opts.poison);
    p.poison.t = Math.max(p.poison.t, opts.poisonTime ?? 4.5);
    p.poison.by = source;
  }
  p.hp -= dmg;
  p.hitFlash = 1;
  p.lastDamageAt = game.time;
  p.counters.dmgTaken += dmg;
  if (p.stats.cloakOnHit > 0) p.cloak = Math.max(p.cloak, p.stats.cloakOnHit);
  game.shake(Math.min(9, 2.4 + dmg * 0.28));
  game.emit('playerHit', { dmg, source });
  if (p.hp <= 0) { p.hp = 0; killPlayer(game, source); }
  return dmg;
}

export function killPlayer(game, source) {
  const p = game.player;
  if (!p.alive) return;
  p.alive = false;
  game.emit('playerDeath', { source, stats: summary(p) });
  game.onPlayerDeath?.();
}

export function summary(p) {
  return {
    tier: p.tier, dna: Math.round(p.dna), kills: p.counters.kills,
    plants: p.counters.plants, meat: p.counters.meat, relics: p.relicGenes,
    time: p.runTime, allies: p.counters.allies, dances: p.counters.dances,
  };
}

// ------------------------------------------------------------------
// Активная способность
// ------------------------------------------------------------------
export function activeAbility(p) {
  const id = p.stats.abilityId;
  return id ? { id, ...ABILITIES[id] } : null;
}

// ------------------------------------------------------------------
// Обновление игрока
// ------------------------------------------------------------------
export function updatePlayer(game, dt, input) {
  const p = game.player;
  if (!p.alive) return;
  p.runTime += dt;

  // --- таймеры
  for (const k in p.cooldowns) p.cooldowns[k] = Math.max(0, p.cooldowns[k] - dt);
  p.invuln = Math.max(0, p.invuln - dt);
  p.hitFlash = Math.max(0, p.hitFlash - dt * 3.4);
  p.cloak = Math.max(0, p.cloak - dt);
  p.dashTime = Math.max(0, p.dashTime - dt);
  if (p.slow.t > 0) p.slow.t -= dt; else p.slow.factor = 1;
  if (p.poison.t > 0) {
    p.poison.t -= dt;
    damagePlayer(game, p.poison.dps * dt, p.poison.by, { armorPierce: false });
    if (Math.random() < dt * 6) game.spawnParticle(p.x + (Math.random() - 0.5) * p.r, p.y + (Math.random() - 0.5) * p.r, 'goo', '#c9ff5e', 2.4);
    if (p.poison.t <= 0) p.poison.dps = 0;
  }

  // --- энергия: расход на органеллы и восстановление
  const s = p.stats;
  const starving = p.energy <= 0.01;
  p.energy = clamp(p.energy - s.upkeep * dt + s.energyRegen * dt, 0, s.maxEnergy);
  if (starving) {
    p.hp -= P.starve * dt;
    if (Math.random() < dt * 4) game.spawnParticle(p.x, p.y, 'goo', '#ff8f8f', 2);
    if (p.hp <= 0) { p.hp = 0; killPlayer(game, null); return; }
  } else if (game.time - p.lastDamageAt > P.noCombatTime) {
    p.hp = Math.min(p.maxHp, p.hp + (s.regen + P.regenOutOfCombat) * dt);
  }

  // --- движение
  const speedPenalty = starving ? 0.6 : (p.energy < s.maxEnergy * 0.25 ? 0.86 : 1);
  const slowPenalty = p.slow.t > 0 ? p.slow.factor : 1;
  const speed = s.baseSpeed * speedPenalty * slowPenalty;

  let ax = input.ax ?? 0, ay = input.ay ?? 0;
  const mag = hypot(ax, ay);
  if (mag > 1) { ax /= mag; ay /= mag; }

  if (p.dashTime > 0) {
    // во время рывка управление ослаблено, инерция сохраняется
    p.vx = damp(p.vx, p.dashDir.x * p.dashSpeed, 2.2, dt);
    p.vy = damp(p.vy, p.dashDir.y * p.dashSpeed, 2.2, dt);
  } else {
    const tx = ax * speed, ty = ay * speed;
    const lambda = P.accelLambda * (mag > 0.05 ? 1 : 0.7);
    p.vx = damp(p.vx, tx, lambda, dt);
    p.vy = damp(p.vy, ty, lambda, dt);
    // пассивный дрейф течения
    if (game.currentPush) {
      p.vx += game.currentPush.x * dt;
      p.vy += game.currentPush.y * dt;
    }
  }

  p.x += p.vx * dt;
  p.y += p.vy * dt;

  // --- границы океана: «плёнка поверхностного натяжения»
  const wr = CFG.world.radius;
  const d = hypot(p.x, p.y);
  if (d > wr) {
    const nx = p.x / d, ny = p.y / d;
    p.x = nx * wr; p.y = ny * wr;
    const push = 40;
    p.vx -= nx * push; p.vy -= ny * push;
    if (game.time - (game.lastBoundaryWarn ?? -9) > 4) {
      game.lastBoundaryWarn = game.time;
      game.emit('boundary', {});
    }
  }

  // --- курс
  const sp = hypot(p.vx, p.vy);
  if (sp > 6) {
    const target = Math.atan2(p.vy, p.vx);
    p.heading = angleDamp(p.heading, target, s.turnRate * 1.6, dt);
  }

  // --- укус
  if (input.bite && p.cooldowns.bite <= 0) {
    p.cooldowns.bite = P.biteCooldown / s.biteRate;
    game.playerBite?.();
  }

  // --- рывок
  if (input.dash && p.cooldowns.dash <= 0 && p.energy >= P.dashCost) {
    const useDir = mag > 0.08 ? { x: ax, y: ay } : { x: Math.cos(p.heading), y: Math.sin(p.heading) };
    p.dashDir = useDir;
    p.dashSpeed = P.dashPower * (1 + s.dashPowerAdd);
    p.dashTime = P.dashTime;
    p.cooldowns.dash = P.dashCooldown * s.dashCdMul;
    p.energy -= P.dashCost;
    p.invuln = Math.max(p.invuln, P.dashInvuln);
    p.flags.dodge = (p.flags.dodge ?? 0) + 1;
    game.emit('dash', { x: p.x, y: p.y, heading: Math.atan2(useDir.y, useDir.x) });
    if (p.stats.abilityId === 'jetstream' && input.abilityHeld) game.useAbility?.();
  }

  // --- активная способность
  if (input.ability) game.useAbility?.();

  // --- магнит для пищи + поедание
  const magnet = CFG.player.magnetBase + s.magnet + 6 * p.tier;
  game.magnetFood(p.x, p.y, magnet, dt);
  game.handleEating?.();

  // --- «танец» — социальное взаимодействие
  updateDance(game, dt, sp, input);
}

// ------------------------------------------------------------------
// Танец: медленно кружиться рядом с существом, чтобы подружиться.
// ------------------------------------------------------------------
function updateDance(game, dt, speed, input) {
  const p = game.player;
  if (p.dance.lastAttack > 0) p.dance.lastAttack -= dt;
  const near = game.nearestCreature(p.x, p.y, 170, (c) => c.sp.family !== 'plant');
  const moving = speed > p.stats.baseSpeed * 0.55;
  const harmedRecently = game.time - p.lastDamageAt < 2.5;

  if (!near || moving || harmedRecently || p.dance.lastAttack > 0) {
    p.dance.target = null;
    p.dance.progress = Math.max(0, p.dance.progress - dt * 0.7);
    return;
  }
  p.dance.target = near;
  const rec = p.rep[near.sp.id] ?? { rep: 0, state: 'wild', sync: 0, met: false, gifts: 0 };
  p.rep[near.sp.id] = rec;
  const hostile = rec.rep < CFG.progression.hostileThreshold;
  const fear = near.tier > p.tier + 1;
  const gain = (hostile ? -1 : 1) * (fear ? 0.45 : 1);
  p.dance.progress = clamp(p.dance.progress + gain * dt * 0.42, -1, 1);

  if (p.dance.progress >= 1) {
    p.dance.progress = 0;
    p.dance.lastAttack = 2.0;
    rec.rep += CFG.progression.repPerFeed * 1.1 * p.stats.repMul;
    rec.sync = Math.min(3, rec.sync + 1);
    rec.met = true;
    p.counters.dances++;
    p.flags.danceSpecies[near.sp.id] = (p.flags.danceSpecies[near.sp.id] ?? 0) + 1;
    near.behavior = 'dance';
    game.emit('dance', { species: near.sp, sync: rec.sync });
    if (!game.codex.has(near.sp.id)) game.codex.add(near.sp.id);
  }
}

// ------------------------------------------------------------------
// Зов стаи
// ------------------------------------------------------------------
export function canCallAlly(game) {
  const p = game.player;
  if (p.cooldowns.call > 0) return { ok: false, why: 'перезарядка' };
  const cost = Math.round(CFG.progression.allyCallCost * (lineageById(p.lineage).mods.callDiscount ? 0.5 : 1));
  if (p.dna < cost) return { ok: false, why: `нужно ${cost} ДНК` };
  const friendly = Object.entries(p.rep).filter(([, r]) => r.rep >= CFG.progression.allyThreshold);
  if (!friendly.length) return { ok: false, why: 'нет союзных видов' };
  return { ok: true, cost, speciesIds: friendly.map(([k]) => k) };
}

export function callAlly(game) {
  const info = canCallAlly(game);
  if (!info.ok) return info;
  const p = game.player;
  p.dna -= info.cost;
  p.cooldowns.call = CFG.progression.allyCallCooldown;
  const id = info.speciesIds[game.rng.int(0, info.speciesIds.length - 1)];
  const n = 2 + Math.floor(p.tier / 4);
  for (let i = 0; i < n; i++) game.spawnAlly(id, i * 0.4);
  game.emit('allyCall', { species: id, n });
  return { ok: true, msg: `Стая откликнулась` };
}
