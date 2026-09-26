// ai.js — поведение существ: роли, восприятие, охота, стайность, способности.
// Каждая функция получает (game, c, dt) — модуль не хранит глобального состояния.

import { ROLE, FAMILY } from './species.js';
import { CFG } from './config.js';
import { clamp, damp, angleDamp, dist, hypot, TAU, angleDiff } from './util.js';

// ------------------------------------------------------------------
// Восприятие: насколько далеко существо замечает игрока и других.
// ------------------------------------------------------------------
function perceptionOf(c) {
  let p = 250 + c.tier * 16;
  if (c.sp.alpha || c.sp.boss) p *= 1.35;
  if (c.sp.stealth) p *= 0.8;
  return p;
}

function playerVisibility(game) {
  const p = game.player;
  let v = 1;
  if (p.cloak > 0) v *= 0.25;
  const night = game.lightLevel < 0.4;
  if (night) v *= p.stats.nightVision > 0 ? 1.05 : 0.7;
  return v;
}

// Кого существо считает угрозой/добычей.
function threatScore(game, c, other) {
  if (other === c || other.dead) return 0;
  const ratio = other.r / c.r;
  let score = 0;
  if (ratio > CFG.combat.edibleRatio) score = 2.4 * other.r / c.r;   // крупнее — угроза
  else if (ratio < 1 / CFG.combat.edibleRatio) score = 1.5;          // мельче — добыча
  else score = 0.6;
  if (other.kind === 'player') score *= playerVisibility(game);
  if (other.stats?.spikeDmg > 0 && ratio > 1) score *= 0.45;
  return score;
}

// ------------------------------------------------------------------
// Стеering: плавное движение к цели с разделением от соседей.
// ------------------------------------------------------------------
function steer(game, c, tx, ty, speedMul, dt) {
  const dx = tx - c.x, dy = ty - c.y;
  const d = Math.max(1, hypot(dx, dy));
  let ax = dx / d, ay = dy / d;

  // разделение с соседями того же вида
  const near = game.creaturesNear(c.x, c.y, c.r * 3.2);
  let sx = 0, sy = 0, n = 0;
  for (const o of near) {
    if (o === c || o.dead || o.sp.id !== c.sp.id) continue;
    const dd = dist(c.x, c.y, o.x, o.y);
    if (dd < c.r * 2.4 && dd > 0.001) { sx += (c.x - o.x) / dd; sy += (c.y - o.y) / dd; n++; }
  }
  if (n) { ax += sx / n * 0.9; ay += sy / n * 0.9; }

  const m = Math.max(0.0001, hypot(ax, ay));
  const speed = c.speed * speedMul * (c.slow.t > 0 ? c.slow.factor : 1) * (c.stun > 0 ? 0 : 1);
  c.vx = damp(c.vx, (ax / m) * speed, 3.4, dt);
  c.vy = damp(c.vy, (ay / m) * speed, 3.4, dt);
}

function applyPhysics(game, c, dt) {
  if (c.stun > 0) {
    c.vx = damp(c.vx, 0, 6, dt); c.vy = damp(c.vy, 0, 6, dt);
  }
  if (game.currentPush) { c.vx += game.currentPush.x * dt * 0.5; c.vy += game.currentPush.y * dt * 0.5; }
  c.x += c.vx * dt; c.y += c.vy * dt;

  // отталкивание от границы океана и от тел
  const wr = CFG.world.radius - 40;
  const dc = hypot(c.x, c.y);
  if (dc > wr) {
    const nx = c.x / dc, ny = c.y / dc;
    c.x = nx * wr; c.y = ny * wr;
    c.vx -= nx * 30; c.vy -= ny * 30;
  }

  const sp = hypot(c.vx, c.vy);
  if (sp > 4) c.heading = angleDamp(c.heading, Math.atan2(c.vy, c.vx), 6 * dt * 60 / 60 + 3, dt);
  c.t += dt;
  if (c.stun > 0) c.stun -= dt;
  if (c.slow.t > 0) c.slow.t -= dt;
  for (const k in c.cd) c.cd[k] = Math.max(0, c.cd[k] - dt);
}

// ------------------------------------------------------------------
// Пищевое поведение: существа тоже едят биомассу — экосистема живая.
// ------------------------------------------------------------------
function graze(game, c, dt) {
  const food = game.foodsNear(c.x, c.y, 260);
  let best = null, bd = 1e9;
  for (const f of food) {
    if (f.dead || f.kind === 'relic') continue;
    const d = dist(c.x, c.y, f.x, f.y);
    if (d < bd) { bd = d; best = f; }
  }
  if (best && c.tier <= 5) {
    if (bd < c.r + 8) {
      best.dead = true;
      game.consumeByCreature(c, best);
    } else {
      steer(game, c, best.x, best.y, 0.55, dt);
      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------------
// Стайное поведение: держимся центра группы.
// ------------------------------------------------------------------
function flockCenter(game, c) {
  const near = game.creaturesNear(c.x, c.y, 420);
  let cx = 0, cy = 0, n = 0;
  for (const o of near) {
    if (o === c || o.dead || o.sp.id !== c.sp.id || o.tier > c.tier + 2) continue;
    cx += o.x; cy += o.y; n++;
  }
  if (!n) return null;
  return { x: cx / n, y: cy / n, n };
}

// ------------------------------------------------------------------
// Главная функция обновления существа
// ------------------------------------------------------------------
export function updateCreature(game, c, dt) {
  if (c.dead) return;
  const p = game.player;
  c.think -= dt;
  if (c.think <= 0) {
    c.think = 0.22 + Math.random() * 0.25;
    think(game, c);
  }

  // отравление
  if (c.poison.t > 0) {
    c.poison.t -= dt;
    c.hp -= c.poison.dps * dt;
    if (Math.random() < dt * 5) game.spawnParticle(c.x, c.y, 'goo', '#c9ff5e', 2.6);
    if (c.hp <= 0) { game.killCreature(c, { byPlayer: c.poison.by === 'player' }); return; }
  }

  // аура-опасность (споры микотои, ядовитый след)
  if (c.sp.hazard && c.sp.hazard.type === 'spores') {
    const dd = dist(c.x, c.y, p.x, p.y);
    if (dd < c.sp.hazard.radius + p.r && p.alive) {
      game.damagePlayer(c.sp.hazard.dps * dt, c, {});
      p.slow.t = Math.max(p.slow.t, 0.4); p.slow.factor = Math.min(p.slow.factor, c.sp.hazard.slow);
    }
  }
  if (c.sp.trail === 'poison') {
    const dd = dist(c.x, c.y, p.x, p.y);
    if (dd < 60 + p.r && p.alive) game.damagePlayer(2.2 * dt, c, { armorPierce: false });
  }

  // союзники: держатся рядом с игроком и атакуют угрозы
  if (c.ally) { updateAlly(game, c, dt); applyPhysics(game, c, dt); return; }

  if (c.role === ROLE.BOSS) { updateBoss(game, c, dt); applyPhysics(game, c, dt); return; }
  if (c.role === ROLE.HUNT || c.role === ROLE.AMBUSH || c.role === ROLE.SCAVENGE || c.role === ROLE.GUARD) {
    updateHunter(game, c, dt);
  } else {
    updatePeaceful(game, c, dt);
  }
  updateRanged(game, c, dt);
  applyPhysics(game, c, dt);
}

// ------------------------------------------------------------------
function think(game, c) {
  const p = game.player;
  const per = perceptionOf(c) * (c.ally ? 1.2 : 1);
  const dPlayer = dist(c.x, c.y, p.x, p.y);
  const seesPlayer = dPlayer < per && playerVisibility(game) > 0.3;
  c.target = null;

  // запомнить ближайшую угрозу и добычу
  let threat = null, prey = null, tD = 1e9;
  const near = game.creaturesNear(c.x, c.y, per);
  for (const o of near) {
    if (o === c || o.dead) continue;
    const d = dist(c.x, c.y, o.x, o.y);
    const s = threatScore(game, c, o);
    if (s >= 2 && d < tD) { threat = o; tD = d; }
    else if (s > 0 && s <= 1.6 && d < tD * 1.4) prey = prey ?? o;
  }
  if (seesPlayer && p.alive) {
    const ratio = p.r / c.r;
    const spiky = p.stats.spikeDmg > 0;
    const closeIn = dPlayer < per * 0.62;      // мелочь паникует, только когда игрок рядом
    const hurt = (game.time - (c.hurtAt ?? -99)) < 3;
    const scared = (ratio > (spiky ? 1.9 : 1.35) && closeIn) || hurt || (ratio > 2.6);
    if (scared) c.flee = { x: p.x, y: p.y, t: 2.6 };
    else if (ratio < 1 / CFG.combat.edibleRatio) c.hunt = { t: 3.4 };
    else if (ratio > 1.15) c.hunt = { t: 2.6 };
    else c.curious = { t: 2.0 };
  }
  if (threat) { c.flee = { x: threat.x, y: threat.y, t: 2.4 }; }
  if (prey && !c.flee) { c.preyTarget = prey; c.hunt = { t: 2.2 }; }

  // репутация с игроком влияет на агрессию
  const rec = game.player.rep[c.sp.id];
  if (rec && rec.rep >= CFG.progression.allyThreshold) { c.fear = null; c.hunt = null; c.friendly = true; }
  else if (rec && rec.rep <= CFG.progression.hostileThreshold) c.hunt = { t: 4 };
}

// ------------------------------------------------------------------
// Мирные роли: дрейф, пастьба, стая
// ------------------------------------------------------------------
function updatePeaceful(game, c, dt) {
  const p = game.player;

  if (c.flee && c.flee.t > 0) {
    c.flee.t -= 0.016;
    steer(game, c, c.x * 2 - c.flee.x, c.y * 2 - c.flee.y, c.sp.hazard ? 1.5 : 1.15, dt);
    c.behavior = 'flee';
    return;
  }
  // трусливые виды убегают от крупных
  const near = game.creaturesNear(c.x, c.y, 200);
  for (const o of near) {
    if (o.dead || o === c) continue;
    if (o.r > c.r * 1.4 && (o.sp.family === FAMILY.PREDATOR || o.sp.family === FAMILY.OMNIVORE)) {
      steer(game, c, c.x * 2 - o.x, c.y * 2 - o.y, 1.2, dt);
      c.behavior = 'flee';
      return;
    }
  }

  switch (c.role) {
    case ROLE.DRIFT: {
      c.wander = c.wander ?? Math.random() * TAU;
      c.wanderTimer = (c.wanderTimer ?? 0) - dt;
      if (c.wanderTimer <= 0) { c.wanderTimer = 3 + Math.random() * 4; c.wander += (Math.random() - 0.5) * 1.6; }
      steer(game, c, c.x + Math.cos(c.wander) * 200, c.y + Math.sin(c.wander) * 200, 0.42, dt);
      c.behavior = 'drift';
      break;
    }
    case ROLE.FLOCK: {
      const center = flockCenter(game, c);
      c.wanderTimer = (c.wanderTimer ?? 0) - dt;
      if (graze(game, c, dt) && !center) break;
      if (center) {
        const d = dist(c.x, c.y, center.x, center.y);
        if (d > 190) steer(game, c, center.x, center.y, 0.9, dt);
        else { c.wander = (c.wander ?? Math.random() * TAU) + (Math.random() - 0.5) * 1.2 * dt * 8; steer(game, c, c.x + Math.cos(c.wander) * 120, c.y + Math.sin(c.wander) * 120, 0.6, dt); }
      } else if (c.wanderTimer <= 0) {
        c.wanderTimer = 2.4 + Math.random() * 3;
        c.wander = Math.random() * TAU;
        steer(game, c, c.x + Math.cos(c.wander) * 160, c.y + Math.sin(c.wander) * 160, 0.55, dt);
      }
      c.behavior = 'graze';
      break;
    }
    default: {
      c.wanderTimer = (c.wanderTimer ?? 0) - dt;
      if (c.wanderTimer <= 0) { c.wanderTimer = 2 + Math.random() * 2.6; c.wander = Math.random() * TAU; }
      if (!graze(game, c, dt)) steer(game, c, c.x + Math.cos(c.wander) * 170, c.y + Math.sin(c.wander) * 170, 0.75, dt);
      c.behavior = 'graze';
    }
  }

  // мирные подходят к игроку, если вид уже подружился
  if (c.friendly && !c.fear) {
    const d = dist(c.x, c.y, p.x, p.y);
    if (d > 150 && d < 520) {
      steer(game, c, p.x, p.y, 0.9, dt);
      c.behavior = 'follow';
    }
  }
}

// ------------------------------------------------------------------
// Хищные роли
// ------------------------------------------------------------------
function updateHunter(game, c, dt) {
  const p = game.player;
  // если добыча стала слишком крупной — хищник уходит
  if (c.flee && c.flee.t > 0) {
    c.flee.t -= dt;
    steer(game, c, c.x * 2 - c.flee.x, c.y * 2 - c.flee.y, 1.15, dt);
    c.behavior = 'flee';
    return;
  }
  const target = c.preyTarget && !c.preyTarget.dead ? c.preyTarget : (p.alive ? p : null);
  if (!target) { c.behavior = 'wander'; return; }

  const dTarget = dist(c.x, c.y, target.x, target.y);
  const per = perceptionOf(c);
  const huntingPlayer = target === p && (c.hunt?.t ?? 0) > 0;

  // способности хищников
  useHunterAbility(game, c, target, dTarget);

  if (c.role === ROLE.AMBUSH && dTarget > c.r * 6) {
    // сидит в засаде у своего якоря
    c.anchor = c.anchor ?? { x: c.x, y: c.y };
    const dA = dist(c.x, c.y, c.anchor.x, c.anchor.y);
    if (dA > 120) steer(game, c, c.anchor.x, c.anchor.y, 0.5, dt);
    else { c.vx = damp(c.vx, 0, 3, dt); c.vy = damp(c.vy, 0, 3, dt); }
    c.behavior = 'ambush';
    return;
  }

  if (c.role === ROLE.AMBUSH && dTarget < per * 0.55 && (c.cd.lunge ?? 0) <= 0) {
    c.cd.lunge = 5.5;
    const a = Math.atan2((target.y + target.vy * 0.3) - c.y, (target.x + target.vx * 0.3) - c.x);
    c.vx = Math.cos(a) * c.speed * 3.2;
    c.vy = Math.sin(a) * c.speed * 3.2;
    game.emit('lunge', { x: c.x, y: c.y });
    c.behavior = 'chase';
    return;
  }

  if (c.role === ROLE.GUARD) {
    c.anchor = c.anchor ?? { x: c.x, y: c.y };
    const dA = dist(c.x, c.y, c.anchor.x, c.anchor.y);
    if (dA > 380 && (!huntingPlayer || dTarget > per)) {
      steer(game, c, c.anchor.x, c.anchor.y, 0.6, dt);
      c.behavior = 'guard';
      return;
    }
    if (huntingPlayer && dTarget < (c.sp.ranged?.range ?? 300)) {
      // держит дистанцию, стреляя
      const want = (c.sp.ranged?.range ?? 300) * 0.7;
      if (dTarget < want * 0.6) steer(game, c, c.x * 2 - target.x, c.y * 2 - target.y, 0.7, dt);
      else { c.vx = damp(c.vx, 0, 3, dt); c.vy = damp(c.vy, 0, 3, dt); }
      c.heading = angleDamp(c.heading, Math.atan2(target.y - c.y, target.x - c.x), 4, dt);
      c.behavior = 'guard';
      return;
    }
  }

  if (dTarget < per * 1.4 || (c.preyTarget && !c.preyTarget.dead && dTarget < per)) {
    const lead = 0.25;
    const tx = target.x + (target.vx ?? 0) * lead, ty = target.y + (target.vy ?? 0) * lead;
    const aggro = c.sp.alpha ? 1.0 : 0.92;
    steer(game, c, tx, ty, aggro, dt);
    c.behavior = 'chase';
    // рывок-ускорение при сближении
    if (dTarget < c.r * 5 && (c.cd.burst ?? 0) <= 0) {
      c.cd.burst = 4.5;
      const a = Math.atan2(target.y - c.y, target.x - c.x);
      c.vx += Math.cos(a) * c.speed * 1.5;
      c.vy += Math.sin(a) * c.speed * 1.5;
    }
  } else {
    // патруль
    c.wander = (c.wander ?? Math.random() * TAU) + (Math.random() - 0.5) * 0.6 * dt * 6;
    steer(game, c, c.x + Math.cos(c.wander) * 220, c.y + Math.sin(c.wander) * 220, 0.55, dt);
    c.behavior = 'wander';
    c.preyTarget = null;
  }
}

// ------------------------------------------------------------------
// Способности существ
// ------------------------------------------------------------------
function useHunterAbility(game, c, target, d) {
  const p = game.player;
  const ab = c.sp.ability;
  if (!ab || (c.cd.ability ?? 0) > 0) return;
  const isPlayer = target === p;
  switch (ab) {
    case 'ink':
      if (d < 260) {
        c.cd.ability = 9;
        game.spawnInkCloud(c.x, c.y, c.r * 2.4);
        c.vx *= -0.4; c.vy *= -0.4;
      }
      break;
    case 'stun':
      if (d < 190 && isPlayer) {
        c.cd.ability = 11;
        if (p.cloak <= 0) {
          game.stunPlayer?.(1.1);
          game.spawnRing(c.x, c.y, c.r * 4, '#7f8cff');
        }
      }
      break;
    case 'slam':
      if (d < c.r * 3.4) {
        c.cd.ability = 7;
        game.spawnRing(c.x, c.y, c.r * 5.2, '#ffb37f');
        game.shake(6);
        if (isPlayer) {
          const a = Math.atan2(p.y - c.y, p.x - c.x);
          p.vx += Math.cos(a) * 460; p.vy += Math.sin(a) * 460;
          game.damagePlayer(c.dmg * 0.8, c, {});
        }
      }
      break;
    default: break;
  }
}

function updateRanged(game, c, dt) {
  const r = c.sp.ranged;
  if (!r) return;
  const p = game.player;
  if (!p.alive) return;
  const d = dist(c.x, c.y, p.x, p.y);
  if (d > r.range || (c.cd.shot ?? 0) > 0) return;
  const rec = game.player.rep[c.sp.id];
  const friendly = rec && rec.rep >= CFG.progression.allyThreshold;
  if (friendly) return;
  c.cd.shot = r.cd * (c.tier > 6 ? 0.85 : 1);
  const a = Math.atan2(p.y - c.y, p.x - c.x) + (Math.random() - 0.5) * 0.12;
  game.spawnProjectile(c, a, r);
  c.heading = a;
}

// ------------------------------------------------------------------
// Босс: три фазы голода
// ------------------------------------------------------------------
function updateBoss(game, c, dt) {
  const p = game.player;
  const hpRatio = c.hp / c.maxHp;
  const phase = hpRatio < 0.28 ? 3 : hpRatio < 0.6 ? 2 : 1;
  if (phase !== c.phase) {
    c.phase = phase;
    game.emit('bossPhase', { phase });
    game.shake(12);
    game.spawnRing(c.x, c.y, c.r * 7, '#ff6b6b');
  }

  const d = dist(c.x, c.y, p.x, p.y);
  c.heading = angleDamp(c.heading, Math.atan2(p.y - c.y, p.x - c.x), 2.2, dt);

  if (c.stun > 0) return;

  // притяжение: «вдох» — тянет игрока к себе, если тот мелкий
  if ((c.cd.pull ?? 0) <= 0 && d < 520 && d > 120) {
    c.cd.pull = phase >= 3 ? 5.5 : phase === 2 ? 8 : 11;
    c.pullT = 1.5;
    game.emit('bossPull', { x: c.x, y: c.y });
  }
  if (c.pullT > 0) {
    c.pullT -= dt;
    const a = Math.atan2(c.y - p.y, c.x - p.x);
    game.currentPush = { x: Math.cos(a) * 210, y: Math.sin(a) * 210 };
    c.vx = damp(c.vx, 0, 3, dt); c.vy = damp(c.vy, 0, 3, dt);
    c.behavior = 'pull';
    return;
  }

  if (phase >= 2) {
    // токсичная аура
    if (d < c.r * 4.2) game.damagePlayer(c.dmg * 0.35 * dt, c, { armorPierce: true });
    if ((c.cd.spawn ?? 0) <= 0) {
      c.cd.spawn = 9;
      game.spawnBossMinions(c, phase === 3 ? 3 : 2);
    }
  }
  if (phase >= 3 && (c.cd.burst ?? 0) <= 0 && d < c.r * 5) {
    c.cd.burst = 5;
    game.spawnRing(c.x, c.y, c.r * 6, '#ffd166');
    const a = Math.atan2(p.y - c.y, p.x - c.x);
    p.vx += Math.cos(a) * 520; p.vy += Math.sin(a) * 520;
    game.damagePlayer(c.dmg * 1.1, c, {});
  }

  // обычное преследование
  steer(game, c, p.x + p.vx * 0.35, p.y + p.vy * 0.35, phase >= 3 ? 1.15 : 0.95, dt);
  c.behavior = 'chase';
}

// ------------------------------------------------------------------
// Союзники игрока
// ------------------------------------------------------------------
function updateAlly(game, c, dt) {
  const p = game.player;
  const follow = { x: p.x - Math.cos(p.heading) * 70, y: p.y - Math.sin(p.heading) * 70 };
  let enemy = null, ed = 1e9;
  const near = game.creaturesNear(c.x, c.y, 340);
  for (const o of near) {
    if (o.dead || o === c || o.ally) continue;
    if (o.sp.family === FAMILY.PLANT) continue;
    const d = dist(c.x, c.y, o.x, o.y);
    if (d < ed && o.r < c.r * 1.6) { enemy = o; ed = d; }
  }
  if (enemy) {
    steer(game, c, enemy.x, enemy.y, 1.1, dt);
    c.behavior = 'chase';
  } else {
    const d = dist(c.x, c.y, follow.x, follow.y);
    if (d > 90) steer(game, c, follow.x, follow.y, 1.05, dt);
    else { c.vx = damp(c.vx, 0, 2, dt); c.vy = damp(c.vy, 0, 2, dt); }
    c.behavior = 'follow';
  }
  if (c.life !== undefined) {
    c.life -= dt;
    if (c.life <= 0) { game.removeAlly(c); }
  }
  // союзный хищник кусает врагов сам (обрабатывается в core при контакте)
}
