// landai.js — поведение наземных зверей.
//
// Отличие от подводного ai.js: зверь на земле видит дальше, но двигается по траве и камню,
// поэтому роли построены вокруг маршрутов и засад, а не вокруг погони в толще воды.
// Плюс у каждого вида есть отношение к игроку: испуг, интерес, безразличие, агрессия.
// Дружелюбный вид подходит сам, если не показывать зубы; испуганный убегает, пока не споёшь.

import { CFG } from './config.js';
import { LAND_FOOD_KINDS, LAND_AI, LAND_FAMILY, socialScore, socialLiked } from './landspecies.js';
import { landDamagePlayer, applyLandSlow, sympathyOf } from './landplayer.js';
import { clamp, dist, hypot, angleDamp, TAU } from './util.js';

const L = CFG.land;

// ------------------------------------------------------------------
// Общий шаг существа
// ------------------------------------------------------------------
export function updateLandCreature(game, c, dt) {
  const p = game.player;
  if (c.dead) return;
  if (c.flash > 0) c.flash = Math.max(0, c.flash - dt * 3);
  if (c.stun > 0) { c.stun -= dt; c.vx *= 1 - 6 * dt; c.vy *= 1 - 6 * dt; c.x += c.vx * dt; c.y += c.vy * dt; return; }
  if (c.contactCd > 0) c.contactCd -= dt;
  if (c.contactCd2 > 0) c.contactCd2 -= dt;
  if (c.talkCd > 0) c.talkCd -= dt;
  if (c.hurtPlayerCd > 0) c.hurtPlayerCd -= dt;
  if (c.bleed.t > 0) {
    c.bleed.t -= dt;
    c.hp -= c.bleed.dps * dt;
    if (game.rng.chance(dt * 3)) game.spawnParticle(c.x, c.y, 'goo', '#c2402f', 2.2);
    if (c.hp <= 0) { game.killCreature(c, { fromPlayer: true }); return; }
  }
  if (c.poison.t > 0) {
    c.poison.t -= dt;
    c.hp -= c.poison.dps * dt;
    if (c.hp <= 0) { game.killCreature(c, { fromPlayer: true }); return; }
  }

  // «мышление» раз в 0.25–0.5 с: роли решают, куда идти
  c.aiTimer -= dt;
  if (c.aiTimer <= 0) {
    c.aiTimer = 0.24 + game.rng.next() * 0.26;
    think(game, c);
  }

  const role = c.sp.ai;
  let speed = c.speed;
  if (c.ally) speed *= 1.05;
  if (c.flee) speed *= 1.22;

  // --- движение к цели
  if (c.moveTo) {
    const a = Math.atan2(c.moveTo.y - c.y, c.moveTo.x - c.x);
    c.heading = angleDamp(c.heading, a, 4.2, dt);
    const s = speed * (c.moveSpeed ?? 1);
    c.vx += Math.cos(c.heading) * s * 3 * dt;
    c.vy += Math.sin(c.heading) * s * 3 * dt;
  } else {
    c.vx *= 1 - 1.6 * dt;
    c.vy *= 1 - 1.6 * dt;
  }

  // --- координация стаи: не наступать друг на друга
  if (c.packId != null && c.aiTimer > 0.02) {
    const near = game.creaturesNear(c.x, c.y, c.r * 3.4);
    for (const o of near) {
      if (o === c || o.dead || o.packId !== c.packId) continue;
      const d = dist(c.x, c.y, o.x, o.y);
      if (d < c.r * 1.6 && d > 0.01) {
        const push = (c.r * 1.6 - d) / (c.r * 1.6);
        c.vx += (c.x - o.x) / d * 40 * push;
        c.vy += (c.y - o.y) / d * 40 * push;
      }
    }
  }

  // --- трение: трава тормозит, камень скользит
  const friction = 1 - 2.0 * dt;
  c.vx *= friction; c.vy *= friction;
  const lim = speed * (c.flee ? 1.5 : 1.2);
  const sp = hypot(c.vx, c.vy);
  if (sp > lim) { c.vx = c.vx / sp * lim; c.vy = c.vy / sp * lim; }

  c.x += c.vx * dt;
  c.y += c.vy * dt;
  c.walk += dt * (2 + Math.min(1.5, sp / Math.max(1, speed)) * 5);

  // --- контакт с игроком
  const dp = dist(c.x, c.y, p.x, p.y);
  if (dp < c.r + p.r && p.alive) onPlayerContact(game, c, dp);
  // --- контакт с другими зверями (хищник ест добычу)
  if (c.huntTarget && !c.huntTarget.dead) {
    const tgt = c.huntTarget;
    const d = dist(c.x, c.y, tgt.x, tgt.y);
    if (d < c.r + tgt.r * 0.8) biteCreature(game, c, tgt);
  }
}

// ------------------------------------------------------------------
// Роли: куда идти и за кем гнаться
// ------------------------------------------------------------------
function think(game, c) {
  const p = game.player;
  const role = c.sp.ai;
  const dp = dist(c.x, c.y, p.x, p.y);
  const threatRatio = c.r / Math.max(1, p.r);
  const night = game.lightLevel < 0.4;
  const hungry = c.hunger > 0.35;

  // 1) союзник: держится рядом с игроком и бьёт его врагов
  if (c.ally) {
    return thinkAlly(game, c, p, dp);
  }

  // 2) страх: кто крупнее — от того бежим (у пугливых порог ниже)
  const fleeAt = c.nature === 'shy' ? 1.05 : c.nature === 'playful' ? 1.5 : 1.3;
  const afraid = threatRatio > fleeAt && dp < 480 && !c.sp.hostile;
  if (afraid && role !== LAND_AI.APEX) {
    c.flee = { x: p.x, y: p.y };
    const a = Math.atan2(c.y - p.y, c.x - p.x);
    c.moveTo = { x: clamp(c.x + Math.cos(a) * 420, -game.radius + 120, game.radius - 120), y: clamp(c.y + Math.sin(a) * 420, -game.radius + 120, game.radius - 120) };
    c.moveSpeed = 1.15;
    c.huntTarget = null;
    return;
  }
  c.flee = null;

  // 3) ночные охотники активны только в темноте
  if (c.nocturnal && !night) {
    c.moveTo = c.den ? { x: c.den.x, y: c.den.y } : null;
    c.moveSpeed = 0.6;
    return;
  }

  switch (role) {
    case LAND_AI.GRAZE: return thinkGraze(game, c, p, dp);
    case LAND_AI.FLOCK: return thinkFlock(game, c, p, dp);
    case LAND_AI.HUNT: return thinkHunt(game, c, p, dp, hungry);
    case LAND_AI.AMBUSH: return thinkAmbush(game, c, p, dp, hungry);
    case LAND_AI.SCAVENGE: return thinkScavenge(game, c, p, dp);
    case LAND_AI.GUARD: return thinkGuard(game, c, p, dp, threatRatio);
    case LAND_AI.APEX: return thinkApex(game, c, p, dp);
    default: return thinkGraze(game, c, p, dp);
  }
}

function nearestFood(game, c, radius, filter) {
  let best = null, bd = radius;
  for (const f of game.foodsNear(c.x, c.y, radius)) {
    if (f.dead || (filter && !filter(f))) continue;
    const d = dist(c.x, c.y, f.x, f.y);
    if (d < bd) { bd = d; best = f; }
  }
  return best;
}

function thinkGraze(game, c, p, dp) {
  const food = nearestFood(game, c, 420, (f) => LAND_FOOD_KINDS[f.kind]?.plant);
  if (food) { c.moveTo = { x: food.x, y: food.y }; c.moveSpeed = 0.75; c.huntTarget = null; c.eatTarget = food; return; }
  wander(game, c, 0.55);
}

function thinkFlock(game, c, p, dp) {
  // стая держится вместе и идёт к еде; если игрок поёт рядом — подходит посмотреть
  const friend = p.social.active && p.social.target && p.social.target.sp.id === c.sp.id;
  if (friend) { c.moveTo = { x: p.x, y: p.y }; c.moveSpeed = 0.9; return; }
  const food = nearestFood(game, c, 520, (f) => LAND_FOOD_KINDS[f.kind]?.plant);
  if (food) { c.moveTo = { x: food.x, y: food.y }; c.moveSpeed = 0.8; c.eatTarget = food; return; }
  wander(game, c, 0.7);
}

function thinkHunt(game, c, p, dp, hungry) {
  // цель: игрок (если он не слишком крупный), либо мелкий зверь рядом
  const canPlayer = dp < c.sp.huntRadius ?? 700;
  const playerOk = hungry && dp < 760 && (c.sp.hostile || c.r > p.r * 0.85);
  if (playerOk) {
    c.moveTo = { x: p.x, y: p.y }; c.moveSpeed = 1.15; c.huntPlayer = true; c.huntTarget = null;
    return;
  }
  c.huntPlayer = false;
  let best = null, bd = 560;
  for (const o of game.creaturesNear(c.x, c.y, 560)) {
    if (o === c || o.dead || o.ally === c.ally) continue;
    if (o.sp.family === LAND_FAMILY.PREDATOR && o.r > c.r * 0.8) continue;
    if (o.r > c.r * 1.1) continue;
    const d = dist(c.x, c.y, o.x, o.y);
    if (d < bd) { bd = d; best = o; }
  }
  if (best) { c.moveTo = { x: best.x, y: best.y }; c.moveSpeed = 1.1; c.huntTarget = best; return; }
  if (hungry) { const carrion = nearestFood(game, c, 620, (f) => !LAND_FOOD_KINDS[f.kind]?.plant); if (carrion) { c.moveTo = { x: carrion.x, y: carrion.y }; c.moveSpeed = 0.95; c.eatTarget = carrion; return; } }
  wander(game, c, 0.85);
}

function thinkAmbush(game, c, p, dp, hungry) {
  // сидит в зарослях; бросается, когда цель близко и трава густая
  const cover = game.vegetationAt(c.x, c.y);
  if (dp < 320 && (c.sp.hostile || c.r > p.r * 0.85) && hungry) {
    c.moveTo = { x: p.x, y: p.y }; c.moveSpeed = 1.35; c.huntPlayer = true;
    if (dp < 140 && c.hurtPlayerCd <= 0) {
      c.hurtPlayerCd = 1.2;
      const dmg = c.dmg * 1.6;
      landDamagePlayer(game, dmg, c, { bleed: c.sp.venom ? 0 : 1.2 });
      if (c.sp.venom) landDamagePlayer(game, 0, c, { poison: c.sp.venom });
      game.emit('bitePlayer', { creature: c, dmg });
    }
    return;
  }
  if (cover < 0.6) {
    // ищем гущу рядом
    const a = game.rng.angle();
    c.moveTo = { x: clamp(c.x + Math.cos(a) * 200, -game.radius + 120, game.radius - 120), y: clamp(c.y + Math.sin(a) * 200, -game.radius + 120, game.radius - 120) };
    c.moveSpeed = 0.6;
    return;
  }
  c.moveTo = null;                     // лежит в засаде
}

function thinkScavenge(game, c, p, dp) {
  const carrion = nearestFood(game, c, 700, () => true);
  if (carrion) { c.moveTo = { x: carrion.x, y: carrion.y }; c.moveSpeed = 0.95; c.eatTarget = carrion; return; }
  // падальщик не прочь отнять яйцо из чужой норы и подобрать слабого
  let best = null, bd = 460;
  for (const o of game.creaturesNear(c.x, c.y, 460)) {
    if (o === c || o.dead) continue;
    if (o.hp > o.maxHp * 0.4 || o.r > c.r * 1.2) continue;
    const d = dist(c.x, c.y, o.x, o.y);
    if (d < bd) { bd = d; best = o; }
  }
  if (best) { c.moveTo = { x: best.x, y: best.y }; c.moveSpeed = 1.1; c.huntTarget = best; return; }
  wander(game, c, 0.6);
}

function thinkGuard(game, c, p, dp, threatRatio) {
  // охраняет своё место; если игрок ближе 300 и больше — бодает
  const home = c.den ?? { x: c.homeX, y: c.homeY };
  if (dp < 300 && threatRatio < 1.4) {
    c.moveTo = { x: p.x, y: p.y }; c.moveSpeed = 1.0; c.huntPlayer = true;
    if (dp < c.r + p.r + 20 && c.hurtPlayerCd <= 0) {
      c.hurtPlayerCd = 1.5;
      const dmg = c.dmg * 1.1;
      landDamagePlayer(game, dmg, c, {});
      game.emit('bitePlayer', { creature: c, dmg });
    }
    return;
  }
  const dHome = home ? dist(c.x, c.y, home.x, home.y) : 0;
  if (dHome > 260 && home) { c.moveTo = { x: home.x, y: home.y }; c.moveSpeed = 0.7; return; }
  const food = nearestFood(game, c, 300, (f) => LAND_FOOD_KINDS[f.kind]?.plant);
  if (food) { c.moveTo = { x: food.x, y: food.y }; c.moveSpeed = 0.5; c.eatTarget = food; return; }
  wander(game, c, 0.35);
}

function thinkApex(game, c, p, dp) {
  // владыка: три фазы — рывок к цели, рёв с призывом, ярость
  const phase = c.phase ?? 1;
  if (dp < (c.aggroRange ?? 1100)) {
    c.moveTo = { x: p.x, y: p.y };
    c.moveSpeed = phase === 3 ? 1.3 : phase === 2 ? 1.05 : 0.95;
    c.huntPlayer = true;
  } else {
    c.huntPlayer = false;
    wander(game, c, 0.3);
  }
}

function thinkAlly(game, c, p, dp) {
  // союзник: держится рядом, бросается на тех, кто бьёт игрока
  if (c.swornStay) {
    const home = { x: p.totemPos.x, y: p.totemPos.y };
    if (dist(c.x, c.y, home.x, home.y) > 220) { c.moveTo = home; c.moveSpeed = 0.8; }
    else c.moveTo = null;
    return;
  }
  const enemy = game.nearestCreature(c.x, c.y, 460, (o) => !o.dead && !o.ally && o.sp.ai !== LAND_AI.APEX && o.huntPlayer);
  if (enemy) { c.moveTo = { x: enemy.x, y: enemy.y }; c.moveSpeed = 1.2; c.huntTarget = enemy; return; }
  if (dp > L.social.allyFollow * 0.7) { c.moveTo = { x: p.x, y: p.y }; c.moveSpeed = 1.05; }
  else if (dp < p.r * 2.2) { c.moveTo = null; }
  else wander(game, c, 0.5);
}

function wander(game, c, speedMul) {
  if (!c.moveTo || game.rng.chance(0.25)) {
    const a = game.rng.angle();
    const d = 180 + game.rng.next() * 320;
    c.moveTo = {
      x: clamp(c.x + Math.cos(a) * d, -game.radius + 160, game.radius - 160),
      y: clamp(c.y + Math.sin(a) * d, -game.radius + 160, game.radius - 160),
    };
  }
  c.moveSpeed = speedMul;
  c.huntTarget = null;
}

// ------------------------------------------------------------------
// Контакт и укусы
// ------------------------------------------------------------------
function onPlayerContact(game, c, d) {
  const p = game.player;
  const bigger = c.r >= p.r * 0.95;
  if (!c.ally && bigger && c.contactCd <= 0 && (c.huntPlayer || c.sp.family === LAND_FAMILY.PREDATOR || c.sp.ai === LAND_AI.APEX)) {
    c.contactCd = 0.7;
    const dmg = c.dmg * (c.r > p.r * 1.15 ? 0.6 : 0.35);
    const dealt = landDamagePlayer(game, dmg, c, { poison: c.sp.venom ?? 0, bleed: c.sp.venom ? 0 : 1.0 });
    if (dealt > 0) {
      const a = Math.atan2(p.y - c.y, p.x - c.x);
      p.vx += Math.cos(a) * 190 * (1 - p.stats.knockResist);
      p.vy += Math.sin(a) * 190 * (1 - p.stats.knockResist);
      game.emit('contact', { x: p.x, y: p.y, dmg: dealt });
    }
  }
  // шипы игрока бьют любого, кто вцепился
  if (!c.ally && p.stats.spikeDmg > 0 && c.contactCd2 <= 0) {
    c.contactCd2 = 0.5;
    game.hitCreature(c, p.stats.spikeDmg * (1 + p.tier * 0.1), { fromPlayer: true });
    const a = Math.atan2(c.y - p.y, c.x - p.x);
    c.vx += Math.cos(a) * p.stats.spikeKnock;
    c.vy += Math.sin(a) * p.stats.spikeKnock;
    game.spawnRing(p.x + Math.cos(a) * p.r, p.y + Math.sin(a) * p.r, 40, '#ffe6a0');
  }
  // дружелюбный вид подходит знакомиться сам
  if (!c.ally && !p.social.active && !c.sp.hostile && c.sp.ai !== LAND_AI.APEX
      && c.nature !== 'shy' && c.talkCd <= 0 && p.alive) {
    const st = sympathyOf(p, c.sp.id);
    if (!st.allied && dist(p.x, p.y, c.x, c.y) < p.r + c.r + 60 && game.rng.chance(0.02)) {
      c.talkCd = 6;
      game.emit('creatureCurious', { creature: c, species: c.sp });
    }
  }
}

function biteCreature(game, c, target) {
  if (c.biteCd > 0) return;
  c.biteCd = 1.1;
  game.hitCreature(target, c.dmg * 1.1, { fromCreature: c });
  const a = Math.atan2(target.y - c.y, target.x - c.x);
  target.vx += Math.cos(a) * 90; target.vy += Math.sin(a) * 90;
  if (target.hp <= 0) c.hunger = Math.max(0, c.hunger - 0.6);
}

// Реакция на действия игрока: пение и танец рядом поднимают интерес вида.
export function onSocialAct(game, c, action) {
  const p = game.player;
  if (c.dead || c.sp.hostile || c.boss) return;
  const liked = socialLiked(c.sp, action);
  const st = sympathyOf(p, c.sp.id);
  if (liked) {
    c.interest = 1;
    if (!c.moveTo || game.rng.chance(0.6)) c.moveTo = { x: p.x, y: p.y };
    c.moveSpeed = 0.9;
  } else if (action === c.sp.social.hates) {
    c.interest = -1;
    const a = Math.atan2(c.y - p.y, c.x - p.x);
    c.moveTo = { x: c.x + Math.cos(a) * 260, y: c.y + Math.sin(a) * 260 };
    c.moveSpeed = 1.2;
  }
  if (game.rng.chance(0.3)) game.float(liked ? '♥' : '?', c.x, c.y - c.r - 12, liked ? '#ffd9f0' : '#ffd0a0', 13);
}

// Агрессия хищника к игроку, если тот бьёт его сородичей.
export function alertPack(game, victim, source) {
  if (!victim?.sp || victim.ally) return;
  for (const c of game.creaturesNear(victim.x, victim.y, 520)) {
    if (c === victim || c.dead || c.ally) continue;
    if (c.sp.id !== victim.sp.id) continue;
    if (c.sp.ai === LAND_AI.GRAZE || c.sp.ai === LAND_AI.FLOCK) continue;
    c.huntPlayer = true;
    c.moveTo = source ? { x: source.x, y: source.y } : { x: victim.x, y: victim.y };
    c.moveSpeed = 1.15;
  }
}
