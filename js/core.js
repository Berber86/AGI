// core.js — движок мира: генерация океана, спавн, столкновения, бой, экосистема.
// Это «сердце» игры. Рендер и интерфейс только читают состояние.

import { CFG } from './config.js';
import { RNG, SpatialGrid, Emitter, clamp, dist, hypot, TAU, uid } from './util.js';
import { SPECIES_BY_ID, FOOD_KINDS, biomeOf, pickSpecies, rollTier, FAMILY } from './species.js';
import { updateCreature } from './ai.js';
import {
  createPlayer, updatePlayer, recomputeStats, consumeFood, damagePlayer, gainDna,
  activeAbility, summary,
} from './player.js';
import { EventSystem } from './events.js';
import { QuestSystem } from './quests.js';

const P = CFG.player;
const W = CFG.world;

export class Game extends Emitter {
  constructor(opts = {}) {
    super();
    this.opt = opts;
    this.seed = (opts.seed ?? W.seed) >>> 0;
    this.rng = new RNG(this.seed);
    this.difficulty = opts.difficulty ?? 'normal';
    this.diff = CFG.difficulty[this.difficulty];
    this.settings = opts.settings;
    this.meta = opts.meta;            // профиль (достижения, глобальная ДНК, кодекс)
    this.codex = this.meta.codex;
    this.ach = this.meta.ach;
    this.time = 0;
    this.dayPhase = CFG.day.start;
    this.lightLevel = 1;
    this.threat = 1;
    this.currentPush = null;
    this.canAnywhereEvolve = false;
    this.shakeAmt = 0;
    this.shakeX = 0; this.shakeY = 0;
    this.freePlay = false;
    this.won = false;
    this.stats = { spawns: 0, kills: 0, deaths: 0, maxTier: 1, playTime: 0 };
    this.grid = new SpatialGrid(W.gridCell);
    this.foodGrid = new SpatialGrid(W.gridCell);
    this.featGrid = new SpatialGrid(W.gridCell * 2);
    this._tmp = []; this._tmp2 = [];
    this.globalTime = 0;

    this.player = createPlayer(opts.lineage ?? 'omni', this.difficulty, this.seed + 7);
    this.player.nestPos = { x: 0, y: 0 };
    this.player.x = 0; this.player.y = 0;
    this.locked = false;
    this.deathCount = opts.deathCount ?? 0;

    this.creatures = [];
    this.foods = [];
    this.particles = [];
    this.projectiles = [];
    this.features = [];
    this.inkClouds = [];
    this.floaters = [];
    this._eatFloatT = 0;

    this.events = new EventSystem(this);
    this.quests = new QuestSystem(this);
    this._generateWorld();
    this._initialPopulate();
    this.quests.init();
  }

  // ================================================================
  // Генерация мира
  // ================================================================
  _generateWorld() {
    const rng = new RNG(this.seed ^ 0x5f3a);
    this.features.push({ id: uid(), type: 'nest', x: 0, y: 0, r: 120, seed: rng.int(0, 999) });

    const kinds = [
      { type: 'rock', w: 3.4, r: [60, 150] },
      { type: 'reef', w: 3.2, r: [64, 148] },
      { type: 'vent', w: 1.1, r: [70, 130] },
      { type: 'cache', w: 1.0, r: [26, 34] },
      { type: 'wreck', w: 0.9, r: [110, 210] },
    ];
    for (let i = 0; i < W.featureCount; i++) {
      const k = rng.weighted(kinds.map((x) => [x, x.w]));
      const a = rng.angle();
      const d = Math.sqrt(rng.next()) * (W.radius - 220);
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (hypot(x, y) < 420) continue;
      const f = {
        id: uid(), type: k.type, x, y, r: rng.range(k.r[0], k.r[1]), seed: rng.int(0, 9999), biome: biomeOf(x, y, W.radius),
        cacheTimer: 0, relicTimer: 0,
      };
      this.features.push(f);
    }
    // реликтовые поля — по одному в отдалённых биомах
    const relicSpots = [];
    for (let i = 0; i < W.relicCount; i++) {
      const a = (i / W.relicCount) * TAU + rng.range(-0.3, 0.3);
      const d = rng.range(0.45, 0.95) * W.radius;
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      const f = { id: uid(), type: 'relic', x, y, r: 150, seed: rng.int(0, 9999), biome: biomeOf(x, y, W.radius), relicTimer: 12 + i * 6, hasRelic: false };
      this.features.push(f);
      relicSpots.push(f);
    }
    this.relicSpots = relicSpots;
    this.featGrid.build(this.features);
  }

  _initialPopulate() {
    for (let i = 0; i < 40; i++) this.spawnCreatureNear(Math.sqrt(this.rng.next()) * 1400, this.rng.angle(), 1, true);
    for (let i = 0; i < 150; i++) this.spawnFoodAmbient();
  }

  // ================================================================
  // Запросы к пространству
  // ================================================================
  creaturesNear(x, y, r) { return this.grid.query(x, y, r, this._tmp); }
  foodsNear(x, y, r) { return this.foodGrid.query(x, y, r, this._tmp2); }
  nearestCreature(x, y, radius, filter = null) {
    const list = this.creaturesNear(x, y, radius);
    let best = null, bd = 1e9;
    for (const c of list) {
      if (c.dead || (filter && !filter(c))) continue;
      const d = dist(x, y, c.x, c.y);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }
  featuresNear(x, y, r) { return this.featGrid.query(x, y, r, []); }

  // ================================================================
  // Спавн
  // ================================================================
  spawnCreatureNear(distance, angle, threat, quiet = false, speciesId = null) {
    if (this.creatures.length >= CFG.spawn.maxCells * (this.diff.pop ?? 1)) return null;
    const p = this.player;
    const x = clamp(p.x + Math.cos(angle) * distance, -W.radius + 120, W.radius - 120);
    const y = clamp(p.y + Math.sin(angle) * distance, -W.radius + 120, W.radius - 120);
    if (hypot(x, y) > W.radius - 100) return null;
    const biome = biomeOf(x, y, W.radius);
    const sp = speciesId ? SPECIES_BY_ID[speciesId] : pickSpecies(this.rng, biome, threat, this.diff.aggressive);
    return this.spawnCreature(sp, x, y, rollTier(this.rng, threat), quiet);
  }

  spawnCreature(sp, x, y, tier, quiet = false, extra = {}) {
    const rng = this.rng;
    const hardCap = CFG.spawn.maxCells * (this.diff.pop ?? 1) * 1.6;
    if (this.creatures.length >= hardCap && !extra.ally && !sp.boss && !extra.relicGuard) return null;
    tier = clamp(tier, 1, 10);
    const tierK = tier - 1;
    const r = (9 + 3.4 * tier) * (sp.sizeMul ?? 1);
    const hp = (10 + 8.5 * tier) * sp.hpMul * this.diff.hp;
    const c = {
      kind: 'creature', id: uid(), sp, tier, role: sp.ai,
      x, y, vx: 0, vy: 0, heading: rng.angle(),
      r, hp, maxHp: hp,
      dmg: (4 + 2.4 * tier) * sp.dmgMul * this.diff.dmg,
      speed: (62 + 4.2 * tier) * sp.speedMul * (0.9 + rng.next() * 0.25),
      behavior: 'wander', think: rng.range(0, 0.4), cd: {}, t: rng.range(0, 10),
      phase: rng.range(0, TAU), seed: rng.int(1, 99999),
      stun: 0, slow: { t: 0, factor: 1 }, poison: { t: 0, dps: 0, by: null },
      flee: null, fear: null, hunt: null, preyTarget: null, anchor: null,
      life: extra.life, ally: !!extra.ally, alpha: !!sp.alpha, boss: !!sp.boss,
      colorJitter: rng.range(-0.08, 0.08),
      dead: false, contactCd: 0, biteCd: rng.range(0, 1),
      biome: biomeOf(x, y, W.radius),
      relicGuard: !!extra.relicGuard,
    };
    c.cd.ability = rng.range(2, 6);
    if (sp.boss) { c.phase = 1; c.life = undefined; }
    this.creatures.push(c);
    this.stats.spawns++;
    if (!quiet) this.codexSee(sp.id);
    return c;
  }

  spawnAlly(speciesId, delay = 0) {
    const sp = SPECIES_BY_ID[speciesId];
    if (!sp) return null;
    const p = this.player;
    const a = p.heading + Math.PI + (this.rng.next() - 0.5) * 1.4;
    const d = 90 + this.rng.range(0, 70);
    const c = this.spawnCreature(sp, p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, Math.max(2, p.tier - 1), true, {
      ally: true, life: CFG.progression.allyDuration + this.player.tier * 2,
    });
    if (c) {
      c.ally = true;
      c.hp = c.maxHp = c.maxHp * 1.15;
      this.spawnRing(c.x, c.y, c.r * 3, '#4fe3c1');
      this.player.allies.push(c.id);
      this.player.counters.allies = Math.max(this.player.counters.allies, this.countAllies());
    }
    return c;
  }

  countAllies() { return this.creatures.filter((c) => c.ally && !c.dead).length; }

  removeAlly(c) {
    c.dead = true;
    const i = this.player.allies.indexOf(c.id);
    if (i >= 0) this.player.allies.splice(i, 1);
    this.spawnRing(c.x, c.y, c.r * 2.4, '#4fe3c1');
  }

  spawnBossMinions(boss, n) {
    for (let i = 0; i < n; i++) {
      const a = boss.heading + (i / n) * TAU;
      const sp = this.rng.chance(0.5) ? SPECIES_BY_ID.vermius : SPECIES_BY_ID.lucifuga;
      const m = this.spawnCreature(sp, boss.x + Math.cos(a) * boss.r * 2.4, boss.y + Math.sin(a) * boss.r * 2.4, clamp(boss.tier - 2, 1, 10), true);
      m.hunt = { t: 8 };
      m.summoned = true;
    }
    this.spawnRing(boss.x, boss.y, boss.r * 5, '#ff6b6b');
  }

  spawnBoss(x, y) {
    if (this.boss) return this.boss;
    const sp = SPECIES_BY_ID.leviathan;
    const tier = clamp(Math.max(this.player.tier, 7) + 1, 7, 10);
    const boss = this.spawnCreature(sp, x ?? this.player.x + 900, y ?? this.player.y + 900, tier, false, {});
    boss.hp = boss.maxHp = boss.maxHp * 1.0;
    this.boss = boss;
    this.emit('bossSpawn', { boss });
    return boss;
  }

  spawnFoodAmbient() {
    if (this.foods.length >= CFG.spawn.maxFood * (this.event?.id === 'bloom' ? CFG.spawn.bloomMultiplier : 1)) return;
    const p = this.player;
    const a = this.rng.angle();
    const d = this.rng.range(240, CFG.spawn.spawnMaxDist);
    let x = p.x + Math.cos(a) * d, y = p.y + Math.sin(a) * d;
    const lim = W.radius - 60;
    if (hypot(x, y) > lim) { const k = lim / hypot(x, y); x *= k; y *= k; }
    const biome = biomeOf(x, y, W.radius);
    const kind = this.rng.weighted([
      ['plant', biome === 'shallows' ? 9 : biome === 'reef' ? 6 : biome === 'trench' ? 3 : 1.2],
      ['algae', biome === 'shallows' ? 4 : biome === 'reef' ? 5 : 3],
      ['crystal', biome === 'abyss' ? 5 : biome === 'trench' ? 4 : 1.4],
      ['spore', biome === 'abyss' ? 3.4 : biome === 'trench' ? 2.6 : 0.5],
      ['chunk', 0.35],
    ]);
    this.spawnFood(kind, x, y);
  }

  spawnFood(kind, x, y, opts = {}) {
    const k = FOOD_KINDS[kind];
    if (!k) return null;
    const f = {
      kind, x, y,
      vx: (this.rng.next() - 0.5) * 12, vy: (this.rng.next() - 0.5) * 12,
      seed: this.rng.int(0, 9999), scale: (opts.scale ?? 1) * (0.8 + this.rng.next() * 0.5),
      life: opts.life ?? (kind === 'relic' ? 999 : 90 + this.rng.next() * 90),
      dead: false, pulled: false,
    };
    this.foods.push(f);
    return f;
  }

  // ================================================================
  // Частицы и эффекты
  // ================================================================
  spawnParticle(x, y, kind, color, size = 3, vx = 0, vy = 0, life = 1) {
    if (this.particles.length > CFG.spawn.maxParticles * (this.settings.quality.particles ?? 1)) return;
    this.particles.push({ x, y, vx, vy, kind, color, size, life, maxLife: life, dead: false });
  }
  spawnRing(x, y, r, color) {
    if (this.particles.length > 400) return;
    this.particles.push({ x, y, vx: 0, vy: 0, kind: 'ring', color, size: r * 0.35, life: 0.6, maxLife: 0.6, dead: false });
  }
  spawnInkCloud(x, y, r) {
    for (let i = 0; i < 16; i++) {
      const a = this.rng.angle(), d = this.rng.next() * r;
      this.spawnParticle(x + Math.cos(a) * d, y + Math.sin(a) * d, 'goo', '#0a1a2a', r * 0.18, 0, 0, 4.5);
    }
    this.inkClouds.push({ x, y, r, life: 5.5 });
    this.emit('ink', { x, y, r });
  }
  spawnProjectile(from, angle, def) {
    const speed = def.speed;
    this.projectiles.push({
      x: from.x + Math.cos(angle) * from.r, y: from.y + Math.sin(angle) * from.r,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      r: 5, life: def.range / speed, dmg: from.dmg * def.dmgMul, color: from.sp.color2,
      owner: from, dead: false,
    });
    this.emit('shot', { x: from.x, y: from.y });
  }
  shake(amount) { this.shakeAmt = Math.min(24, this.shakeAmt + amount); }

  // Всплывающий текст: «+12 ДНК», «−8», «ТАНЕЦ!»
  float(text, x, y, color = '#dff6ff', size = 13) {
    if (this.floaters.length > 34) return;
    this.floaters.push({ text, x, y, color, size, life: 1.1, maxLife: 1.1, vy: -26, vx: (this.rng.next() - 0.5) * 12, dead: false });
  }

  // существо съело биомассу: экосистема потребляет еду сама
  consumeByCreature(c, food) {
    const kind = FOOD_KINDS[food.kind];
    if (!kind) return;
    c.hp = Math.min(c.maxHp, c.hp + kind.value * 1.6);
    if (food.kind === 'chunk' && c.sp.ai === 'scavenge') c.cd.eat = 0.6;
    this.spawnParticle(food.x, food.y, 'goo', kind.color2, 2, 0, 0, 0.4);
  }

  damagePlayer(amount, source, opts) {
    const dealt = damagePlayer(this, amount, source, opts ?? {});
    if (dealt > 1.5) this.float(`−${Math.round(dealt)}`, this.player.x, this.player.y - this.player.r - 6, '#ff9a9a', 13);
    return dealt;
  }

  codexSee(id) {
    if (this.codex.has(id)) return false;
    this.codex.add(id);
    this.emit('codex', { id });
    return true;
  }

  // ================================================================
  // Постоянные эффекты событий
  // ================================================================
  get biome() { return biomeOf(this.player.x, this.player.y, W.radius); }

  // ================================================================
  // Помощники для игрока
  // ================================================================
  magnetFood(x, y, radius, dt) {
    const list = this.foodsNear(x, y, radius);
    for (const f of list) {
      if (f.dead) continue;
      const dx = x - f.x, dy = y - f.y;
      const d = Math.max(1, hypot(dx, dy));
      const pull = (1 - d / radius) * 240;
      f.vx += (dx / d) * pull * dt;
      f.vy += (dy / d) * pull * dt;
      f.pulled = true;
    }
  }

  handleEating() {
    const p = this.player;
    if (!p.alive) return;
    const reach = (p.r + 10) * P.eatRadius;
    const list = this.foodsNear(p.x, p.y, reach + 26);
    for (const f of list) {
      if (f.dead) continue;
      if (dist(p.x, p.y, f.x, f.y) < reach) {
        f.dead = true;
        if (f.kind === 'relic') {
          this.collectRelic(f);
        } else if (f.kind === 'cache') {
          const amount = 12 + Math.round(p.tier * 2.5);
          gainDna(this, amount, 'cache');
          p.counters.caches = (p.counters.caches ?? 0) + 1;
          this.float(`кладка +${amount} ДНК`, f.x, f.y - 10, '#ffd166', 14);
          this.emit('cache', { amount });
        } else {
          if (f.kind === 'chunk') p.counters.chunks = (p.counters.chunks ?? 0) + 1;
          const dna0 = p.dna;
          consumeFood(this, f);
          this._eatFloatT -= 0.01;
          if (this.time - (this._lastEatFloat ?? -9) > 0.55 || f.kind === 'chunk') {
            this._lastEatFloat = this.time;
            const gained = Math.round((p.dna - dna0) * 10) / 10;
            if (gained >= 0.2) this.float(`+${gained < 1 ? gained.toFixed(1) : Math.round(gained)} ДНК`, f.x, f.y - 8, FOOD_KINDS[f.kind].color2, 12);
            else this.float(`+${Math.round(FOOD_KINDS[f.kind].value * 10) / 10} рост`, f.x, f.y - 8, FOOD_KINDS[f.kind].color, 11);
          }
        }
        this.emit('eatFx', { x: f.x, y: f.y, kind: f.kind });
        for (let i = 0; i < 3; i++) {
          const a = this.rng.angle();
          this.spawnParticle(f.x, f.y, 'goo', FOOD_KINDS[f.kind].color2, 2.2, Math.cos(a) * 40, Math.sin(a) * 40, 0.5);
        }
      }
    }
  }

  collectRelic(f) {
    const p = this.player;
    p.relicGenes = Math.min(3, p.relicGenes + 1);
    p.counters.relics = p.relicGenes;
    gainDna(this, 30, 'relic');
    this.float('ДРЕВНИЙ ГЕН', f.x, f.y - 14, '#ff9de0', 16);
    this.emit('relic', { count: p.relicGenes, x: f.x, y: f.y });
    if (p.relicGenes >= CFG.progression.relicGenesForWin && !this.won && !this.freePlay) this.startFinale();
  }

  startFinale() {
    if (this.finaleStarted) return;
    this.finaleStarted = true;
    this.emit('finale', {});
    this.events.force('finale');
    this.spawnBoss();
  }

  // Укус игрока: съесть или ранить цель перед собой.
  playerBite() {
    const p = this.player;
    p.dance.lastAttack = 2.4;
    const searchR = p.r + 34 + (p.stats.dashPowerAdd ?? 0) * 10;
    const list = this.creaturesNear(p.x, p.y, searchR + p.r);
    let best = null, bd = 1e9;
    for (const c of list) {
      if (c.dead || c.ally) continue;
      const d = dist(p.x, p.y, c.x, c.y);
      if (d > p.r + c.r + 22) continue;
      const ang = Math.atan2(c.y - p.y, c.x - p.x);
      const rel = Math.abs(((ang - p.heading + Math.PI * 3) % TAU) - Math.PI);
      if (rel > 1.5) continue;    // не в конусе ~86°
      if (d < bd) { bd = d; best = c; }
    }
    if (!best) { this.emit('biteMiss', {}); return false; }
    const canSwallow = best.r * CFG.combat.edibleRatio < p.r || best.hp <= p.r * 0.5;
    const dmg = P.biteDmg * (1 + p.tier * 0.35) * (1 + p.stats.dnaMul * 0.2);
    this.hitCreature(best, canSwallow ? best.hp + 1 : dmg, { fromPlayer: true, swallow: canSwallow });
    if (!canSwallow) this.float(`−${Math.round(dmg)}`, best.x, best.y - best.r * 0.7, '#ffe1d6', 12);
    this.shake(1.4);
    this.emit('bite', { x: best.x, y: best.y, r: best.r });
    for (let i = 0; i < 5; i++) {
      const a = this.rng.angle();
      this.spawnParticle(best.x, best.y, 'goo', '#ffb3a0', 2.6, Math.cos(a) * 70, Math.sin(a) * 70, 0.55);
    }
    if (p.stats.lifeSteal > 0) p.hp = Math.min(p.maxHp, p.hp + dmg * p.stats.lifeSteal);
    return true;
  }

  hitCreature(c, dmg, opts = {}) {
    if (c.dead) return;
    const p = this.player;
    let amount = dmg;
    if (!opts.ignoreArmor && c.sp.parts?.armor) {
      const armor = 8 * c.sp.parts.armor;
      amount *= 1 / (1 + armor / 34);
    }
    if (opts.fromPlayer) {
      // яд и замедление от органов игрока
      if (p.stats.poison > 0) { c.poison.dps = Math.max(c.poison.dps, p.stats.poison); c.poison.t = Math.max(c.poison.t, 3.5); c.poison.by = 'player'; }
      if (p.stats.slowOnBite > 0) { c.slow.t = Math.max(c.slow.t, p.stats.slowOnBite); c.slow.factor = Math.min(c.slow.factor, p.stats.slowFactor); }
      if (p.stats.stunOnBite > 0) c.stun = Math.max(c.stun, p.stats.stunOnBite);
      if (!c.swallowImmune) c.tookDamage = true;
    }
    c.hp -= amount;
    c.flash = 1;
    c.hurt = 0.4;
    c.hurtAt = this.time;
    if (c.hp <= 0) this.killCreature(c, { byPlayer: !!opts.fromPlayer });
    else if (opts.fromPlayer) {
      // существа запоминают нападавшего и мстят
      if (!c.flee && c.sp.family !== FAMILY.PLANT) c.hunt = { t: 5 };
      c.flee = c.r < p.r * 1.4 ? { x: p.x, y: p.y, t: 3 } : c.flee;
      this.emit('hit', { x: c.x, y: c.y, species: c.sp.id });
    }
  }

  killCreature(c, opts = {}) {
    if (c.dead) return;
    c.dead = true;
    const p = this.player;
    const byPlayer = !!opts.byPlayer;
    // труп превращается в куски плоти
    const n = this.rng.int(CFG.combat.corpseChunks[0], CFG.combat.corpseChunks[1] + Math.round(c.tier / 4));
    for (let i = 0; i < n; i++) {
      const a = this.rng.angle(), d = this.rng.next() * c.r * 0.9;
      const f = this.spawnFood('chunk', c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, { scale: clamp(c.r / 14, 0.7, 2.2), life: 120 });
      f.vx = Math.cos(a) * 34; f.vy = Math.sin(a) * 34;
    }
    for (let i = 0; i < 8 + Math.round(c.r / 3); i++) {
      const a = this.rng.angle(), s = this.rng.range(30, 130);
      this.spawnParticle(c.x, c.y, 'goo', c.sp.color, this.rng.range(1.6, 3.4), Math.cos(a) * s, Math.sin(a) * s, this.rng.range(0.5, 1.2));
    }
    this.spawnRing(c.x, c.y, c.r * 3, c.sp.color);
    this.stats.kills++;

    if (byPlayer || c.poison.by === 'player') {
      p.counters.kills++;
      p.counters.killsByFamily[c.sp.family] = (p.counters.killsByFamily[c.sp.family] ?? 0) + 1;
      if (this.lightLevel < 0.45) p.counters.killsNight++;
      const first = !p.rep[c.sp.id]?.killedOnce;
      const base = CFG.dna.kill[0] + c.tier * 1.7 * (c.sp.family === FAMILY.PREDATOR ? 1.35 : 1);
      let gain = base * p.stats.dnaMul;
      if (first) gain += CFG.dna.firstSpeciesBonus;
      gainDna(this, gain, 'kill');
      const rec = (p.rep[c.sp.id] ??= { rep: 0, state: 'wild', sync: 0, met: true, gifts: 0 });
      rec.rep += CFG.progression.repPerKill * (first ? 1.5 : 1);
      rec.killedOnce = true;
      rec.met = true;
      this.codexSee(c.sp.id);
      p.flags.pacifist = false;
      // «кормление» другого вида: убийство рядом с союзным видом поднимает репутацию
      for (const o of this.creaturesNear(c.x, c.y, CFG.combat.chainRadius)) {
        if (o.dead || o.ally || o.sp.id === c.sp.id) continue;
        const r2 = (p.rep[o.sp.id] ??= { rep: 0, state: 'wild', sync: 0, met: false, gifts: 0 });
        if (r2.rep > CFG.progression.hostileThreshold && r2.rep < CFG.progression.allyThreshold) {
          r2.rep += CFG.progression.repPerFeed * p.stats.repMul;
          r2.gifts++;
        }
        break;
      }
      this.float(`${first ? 'НОВЫЙ ВИД +' : '+'}${Math.round(gain)} ДНК`, c.x, c.y - c.r * 0.6, first ? '#ffd166' : '#c8ffe0', first ? 15 : 12);
      this.emit('kill', { species: c.sp, tier: c.tier, family: c.sp.family, first });
      if (c.alpha) { p.counters.alphaKills = (p.counters.alphaKills ?? 0) + 1; this.emit('alphaKill', { species: c.sp }); }
      if (c.boss) { this.onBossKilled(c); }
    }
    if (c.ally) {
      const i = p.allies.indexOf(c.id);
      if (i >= 0) p.allies.splice(i, 1);
    }
    if (c === this.boss) this.boss = null;
  }

  onBossKilled(c) {
    this.emit('bossKilled', {});
    gainDna(this, 120, 'boss');
    this.player.relicGenes = 3;
    if (!this.freePlay && !this.won) this.win('boss');
  }

  // ================================================================
  // Способности игрока
  // ================================================================
  useAbility() {
    const p = this.player;
    const ab = activeAbility(p);
    if (!ab) return false;
    if (p.cooldowns.ability > 0) return false;
    p.cooldowns.ability = ab.cd;
    p.dance.lastAttack = 1.6;
    const targets = this.creaturesNear(p.x, p.y, ab.radius + 120);
    switch (ab.id) {
      case 'shock': {
        const r = ab.radius;
        this.spawnRing(p.x, p.y, r * 1.4, '#fff2a8');
        this.float('РАЗРЯД', p.x, p.y - p.r - 10, '#fff2a8', 15);
        this.shake(7);
        this.emit('shock', { x: p.x, y: p.y, r });
        for (const c of targets) {
          if (c.dead || c.ally) continue;
          const d = dist(p.x, p.y, c.x, c.y);
          if (d > r + c.r) continue;
          this.hitCreature(c, ab.dmg * (1 + p.tier * 0.2), { fromPlayer: true });
          c.stun = Math.max(c.stun, ab.stun);
          if (c.dead) { p.counters.shockKills = (p.counters.shockKills ?? 0) + 1; continue; }
          if (c.sp.family === FAMILY.PLANT) continue;
        }
        break;
      }
      case 'sonic': {
        this.float('УЛЬТРАЗВУК', p.x, p.y - p.r - 10, '#cfe9ff', 15);
        this.emit('sonic', { x: p.x, y: p.y, r: ab.radius });
        for (const c of targets) {
          if (c.dead || c.ally) continue;
          const d = dist(p.x, p.y, c.x, c.y);
          if (d > ab.radius + c.r) continue;
          c.stun = Math.max(c.stun, ab.stun);
          p.counters.stunHits = (p.counters.stunHits ?? 0) + 1;
          this.hitCreature(c, ab.dmg, { fromPlayer: true });
          const a = Math.atan2(c.y - p.y, c.x - p.x);
          c.vx += Math.cos(a) * 220; c.vy += Math.sin(a) * 220;
        }
        break;
      }
      case 'jetstream': {
        const dir = { x: Math.cos(p.heading), y: Math.sin(p.heading) };
        p.dashDir = dir;
        p.dashSpeed = P.dashPower * 2.1 * (1 + p.stats.dashPowerAdd);
        p.dashTime = 0.4;
        p.invuln = Math.max(p.invuln, 0.45);
        for (const c of targets) {
          if (c.dead || c.ally) continue;
          const d = dist(p.x, p.y, c.x, c.y);
          if (d < p.r + c.r + 34) this.hitCreature(c, ab.dmg * (1 + p.tier * 0.15), { fromPlayer: true });
        }
        break;
      }
      case 'toxin': {
        this.float('ЯД', p.x, p.y - p.r - 10, '#c9ff5e', 15);
        this.emit('toxin', { x: p.x, y: p.y, r: ab.radius });
        for (const c of targets) {
          if (c.dead || c.ally) continue;
          const d = dist(p.x, p.y, c.x, c.y);
          if (d > ab.radius + c.r) continue;
          c.poison.dps = Math.max(c.poison.dps, ab.dmg * 0.4);
          c.poison.t = Math.max(c.poison.t, 5.5);
          c.poison.by = 'player';
          c.slow.t = Math.max(c.slow.t, 1.2);
        }
        for (let i = 0; i < 22; i++) {
          const a = this.rng.angle(), d = this.rng.next() * ab.radius;
          this.spawnParticle(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 'bubble', '#c9ff5e', this.rng.range(2, 6), 0, 0, 2.2);
        }
        break;
      }
      case 'mirage': {
        this.float('МИРАЖ', p.x, p.y - p.r - 10, '#b98cff', 15);
        p.cloak = 3.4;
        p.invuln = Math.max(p.invuln, 0.4);
        p.vx *= 1.5; p.vy *= 1.5;
        this.spawnRing(p.x, p.y, p.r * 4, '#b98cff');
        break;
      }
      default: break;
    }
    return true;
  }

  stunPlayer(t) {
    const p = this.player;
    p.stun = Math.max(p.stun ?? 0, t);
    this.emit('playerStun', { t });
  }

  // ================================================================
  // Победа и смерть
  // ================================================================
  win(reason) {
    if (this.won) return;
    if (reason === 'nest') {
      for (let i = 0; i < 40; i++) {
        const a = this.rng.angle(), d = this.rng.next() * 220;
        this.spawnParticle(this.player.x + Math.cos(a) * d, this.player.y + Math.sin(a) * d, 'spark', '#bff3ff', 3, -Math.cos(a) * 160, -Math.sin(a) * 160, 1.4);
      }
      this.spawnRing(this.player.x, this.player.y, 320, '#7fe7ff');
    }
    this.won = true;
    this.winReason = reason;
    this.meta.onRunEnd?.(this, { won: true });
    this.emit('win', { reason, stats: summary(this.player) });
  }

  markStormSurvived() { this.player.flags.stormSurvived = true; }

  onPlayerDeath() {
    this.stats.deaths++;
    this.meta.onRunEnd?.(this, { won: false });
    this.emit('death', { stats: summary(this.player) });
  }

  // ================================================================
  // Главный шаг симуляции
  // ================================================================
  update(dt, input) {
    dt = Math.min(dt, CFG.misc.maxDelta);
    this.time += dt;
    this.globalTime += dt;
    const p = this.player;

    // сутки
    this.dayPhase = (this.dayPhase + dt / CFG.day.length) % 1;
    this.lightLevel = this._dayLight();

    // уровень угрозы экосистемы
    this.threat = clamp(1 + (p.tier - 1) * 0.86 + this.time / 320, 1, 10);

    // сетки пространственных запросов
    this.grid.build(this.creatures);
    this.foodGrid.build(this.foods);

    this.currentPush = null;
    this.events.update(dt);

    // игрок
    if (!p.alive) return;   // после смерти мир замирает — экран итогов
    if (p.stun > 0) { p.stun -= dt; input = { ax: 0, ay: 0 }; }
    updatePlayer(this, dt, input);

    // существа
    for (let i = 0; i < this.creatures.length; i++) {
      const c = this.creatures[i];
      if (c.dead) continue;
      updateCreature(this, c, dt);
      if (c.flash > 0) c.flash = Math.max(0, c.flash - dt * 3);
    }

    this._resolveContacts(dt);
    this._updateProjectiles(dt);
    this._updateFoods(dt);
    this._updateInk(dt);
    this._updateParticles(dt);
    this._updateFloaters(dt);
    this._updateFeatures(dt);
    this._cull(dt);

    this._updateBiome();
    // Мирная концовка: гены доставлены в гнездо во время охоты Левиафана
    if (this.finaleStarted && !this.won && p.relicGenes >= CFG.progression.relicGenesForWin) {
      if (dist(p.x, p.y, p.nestPos.x, p.nestPos.y) < 340) {
        this.float('ГЕНОМ ДОМА', p.x, p.y - p.r - 16, '#7fe7ff', 17);
        this.emit('nestWin', {});
        this.win('nest');
      }
    }
    this.quests.update(dt);
    this.shakeAmt = Math.max(0, this.shakeAmt - dt * CFG.camera.shakeDecay);
    const a = this.rng.angle();
    this.shakeX = Math.cos(this.globalTime * 60) * this.shakeAmt;
    this.shakeY = Math.sin(this.globalTime * 71) * this.shakeAmt;

    this.stats.playTime += dt;
    this.stats.maxTier = Math.max(this.stats.maxTier, p.tier);
  }

  _dayLight() {
    // 0 — полночь, 0.5 — полдень
    const t = this.dayPhase;
    const curve = 0.5 - 0.5 * Math.cos((t - 0.25) * TAU);   // 0 в 0:00, 1 в 12:00
    const biome = this.biome;
    const bl = { shallows: 1, reef: 0.78, trench: 0.5, abyss: 0.2 }[biome] ?? 1;
    return clamp(0.16 + curve * 0.86 * bl, 0.12, 1);
  }

  // ----------------------------------------------------------------
  _resolveContacts(dt) {
    const p = this.player;
    if (!p.alive) return;

    // контакт с препятствиями
    const feats = this.featuresNear(p.x, p.y, p.r + 220);
    for (const f of feats) {
      if (f.type === 'nest' || f.type === 'relic' || f.type === 'cache') continue;
      const d = dist(p.x, p.y, f.x, f.y);
      if (d < f.r + p.r) {
        const nx = (p.x - f.x) / (d || 1), ny = (p.y - f.y) / (d || 1);
        p.x = f.x + nx * (f.r + p.r); p.y = f.y + ny * (f.r + p.r);
        p.vx -= nx * 60; p.vy -= ny * 60;
        if (f.type === 'vent' && p.invuln <= 0) {
          damagePlayer(this, 9 * dt * 6, null, { armorPierce: true });
          p.vx += nx * 180; p.vy += ny * 180;
        }
      }
    }

    // контакт с существами
    const near = this.creaturesNear(p.x, p.y, p.r + 120);
    for (const c of near) {
      if (c.dead) continue;
      const d = dist(p.x, p.y, c.x, c.y);
      const touching = d < p.r + c.r;
      if (!touching) continue;

      // авто-проглатывание мелочи
      if (!c.ally && c.r * 1.6 < p.r && c.hp < p.r * 0.9) {
        this.hitCreature(c, c.hp + 1, { fromPlayer: true, swallow: true });
        continue;
      }
      // столкновение с крупными: урон игроку
      c.contactCd -= dt;
      if (c.contactCd <= 0 && !c.ally && c.r >= p.r * 0.85) {
        const strong = c.r > p.r * 1.15;
        const dmg = c.dmg * (strong ? 0.55 : 0.3) * CFG.player.spikelessContact * 1.4;
        const dealt = damagePlayer(this, dmg, c, { poison: c.sp.venom ?? 0 });
        if (dealt > 0) {
          c.contactCd = 0.65;
          const a = Math.atan2(p.y - c.y, p.x - c.x);
          p.vx += Math.cos(a) * (strong ? 260 : 160) * (1 - p.stats.knockResist);
          p.vy += Math.sin(a) * (strong ? 260 : 160) * (1 - p.stats.knockResist);
          this.emit('contact', { x: p.x, y: p.y, dmg: dealt });
        }
      }
      // шипы игрока жалят любого, кто врезался
      if (p.stats.spikeDmg > 0 && c.contactCd2 === undefined) c.contactCd2 = 0;
      if (p.stats.spikeDmg > 0) {
        c.contactCd2 -= dt;
        if (c.contactCd2 <= 0 && !c.ally) {
          c.contactCd2 = 0.5;
          this.hitCreature(c, p.stats.spikeDmg * (1 + p.tier * 0.12), { fromPlayer: true, ignoreArmor: p.stats.armorPierce > 0 });
          const a = Math.atan2(c.y - p.y, c.x - p.x);
          c.vx += Math.cos(a) * p.stats.spikeKnock * (1 - (c.sp.parts?.armor ? 0.3 : 0));
          c.vy += Math.sin(a) * p.stats.spikeKnock * (1 - (c.sp.parts?.armor ? 0.3 : 0));
        }
      }
      // союзники и хищники кусают друг друга и игрока
      if (c.ally) continue;
      c.biteCd -= dt;
      if (c.biteCd <= 0 && this._wantsToBite(c, p)) {
        c.biteCd = 0.85;
        damagePlayer(this, c.dmg * 0.75, c, { poison: c.sp.venom ?? 0 });
        this.emit('bitePlayer', { x: p.x, y: p.y });
      }
    }

    // хищничество между существами (экосистема живёт своей жизнью)
    const list = this.creatures;
    for (let i = 0; i < list.length; i += 1) {
      const c = list[i];
      if (c.dead || c.sp.family === FAMILY.PLANT) continue;
      if (c.kind === 'player') continue;
      if (this.rng.next() > 0.45) continue;           // прореживаем проверки для производительности
      const others = this.creaturesNear(c.x, c.y, c.r * 3);
      for (const o of others) {
        if (o === c || o.dead || o.ally === c.ally) continue;
        if (o.sp.family === FAMILY.PLANT && o.r > c.r) continue;
        if (o.hp / o.maxHp > 0.95 && o.r > c.r * 1.4) continue;
        if (o.r * CFG.combat.edibleRatio > c.r) continue;
        if (dist(c.x, c.y, o.x, o.y) < c.r + o.r) {
          if ((c.cd.eat ?? 0) > 0) continue;
          c.cd.eat = 1.1;
          const dmg = c.dmg * 0.9;
          this.hitCreature(o, dmg, {});
          o.flee = { x: c.x, y: c.y, t: 2.5 };
          if (this.rng.chance(0.5)) this.spawnParticle(o.x, o.y, 'goo', o.sp.color, 2, 0, 0, 0.5);
          break;
        }
      }
    }
  }

  _wantsToBite(c, p) {
    if (c.sp.family === FAMILY.PLANT) return false;
    const d = dist(c.x, c.y, p.x, p.y);
    if (d > p.r + c.r * 1.05) return false;
    const rec = p.rep[c.sp.id];
    if (rec && rec.rep >= CFG.progression.hostileThreshold) return false;  // дружелюбные не кусают
    if (c.sp.family === FAMILY.GRAZER && p.r < c.r * 1.1) return false;
    return true;
  }

  _updateProjectiles(dt) {
    const p = this.player;
    for (const pr of this.projectiles) {
      if (pr.dead) continue;
      pr.x += pr.vx * dt; pr.y += pr.vy * dt;
      pr.life -= dt;
      if (pr.life <= 0) { pr.dead = true; continue; }
      if (p.alive && dist(pr.x, pr.y, p.x, p.y) < p.r + pr.r) {
        damagePlayer(this, pr.dmg, pr.owner, { poison: pr.owner?.sp?.venom ?? 0 });
        this.spawnRing(pr.x, pr.y, 26, pr.color);
        pr.dead = true;
        continue;
      }
      const near = this.creaturesNear(pr.x, pr.y, pr.r + 40);
      for (const c of near) {
        if (c.dead || c === pr.owner || c.ally === pr.owner?.ally) continue;
        if (dist(pr.x, pr.y, c.x, c.y) < c.r + pr.r) {
          this.hitCreature(c, pr.dmg, {});
          pr.dead = true;
          break;
        }
      }
    }
    if (this.projectiles.length) this.projectiles = this.projectiles.filter((x) => !x.dead);
  }

  _updateFoods(dt) {
    const p = this.player;
    for (const f of this.foods) {
      if (f.dead) continue;
      f.life -= dt;
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.vx *= 1 - 1.6 * dt; f.vy *= 1 - 1.6 * dt;
      // течение
      const sw = Math.sin((f.x * 0.0016) + this.time * 0.16) * 6;
      f.x += sw * dt; f.y += Math.cos((f.y * 0.0016) + this.time * 0.13) * 6 * dt;
      if (f.life <= 0) { f.dead = true; continue; }
      const d = dist(f.x, f.y, p.x, p.y);
      if (d > CFG.spawn.foodDespawnDist) f.dead = true;
    }
    this.foods = this.foods.filter((f) => !f.dead);
  }

  _updateInk(dt) {
    for (const ink of this.inkClouds) {
      ink.life -= dt;
      const d = dist(ink.x, ink.y, this.player.x, this.player.y);
      if (d < ink.r && this.player.alive) {
        this.player.slow.t = Math.max(this.player.slow.t, 0.35);
        this.player.slow.factor = Math.min(this.player.slow.factor, 0.6);
      }
    }
    if (this.inkClouds.length) this.inkClouds = this.inkClouds.filter((i) => i.life > 0);
  }

  _updateFloaters(dt) {
    for (const f of this.floaters) {
      f.life -= dt;
      f.y += f.vy * dt; f.x += f.vx * dt;
      f.vy *= 1 - 1.2 * dt;
      if (f.life <= 0) f.dead = true;
    }
    this.floaters = this.floaters.filter((f) => !f.dead);
  }

  _updateParticles(dt) {
    for (const q of this.particles) {
      if (q.dead) continue;
      q.life -= dt;
      if (q.life <= 0) { q.dead = true; continue; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      q.vx *= 1 - 2.2 * dt; q.vy *= 1 - 2.2 * dt;
      if (q.kind === 'bubble') q.vy -= 22 * dt;
      if (q.kind === 'goo') q.vx += Math.sin(this.time * 3 + q.x) * 6 * dt;
    }
    this.particles = this.particles.filter((q) => !q.dead);
  }

  _updateBiome() {
    const b = this.biome;
    if (b !== this._biome) {
      if (this._biome) this.emit('biomeChange', { from: this._biome, to: b });
      this._biome = b;
    }
  }

  _updateFeatures(dt) {
    const p = this.player;
    // реликтовые поля: выращивают древний ген, если рядом нет игрока
    for (const f of this.relicSpots) {
      if (f.hasRelic) continue;
      f.relicTimer -= dt;
      const d = dist(f.x, f.y, p.x, p.y);
      if (f.relicTimer <= 0 && d > f.r) {
        this.spawnFood('relic', f.x + this.rng.range(-f.r * 0.5, f.r * 0.5), f.y + this.rng.range(-f.r * 0.5, f.r * 0.5), { life: 9999 });
        f.hasRelic = true;
        // страж
        if (!f.guard && p.relicGenes < 3) {
          f.guard = this.spawnCreature(SPECIES_BY_ID.stolb, f.x + this.rng.range(-70, 70), f.y + this.rng.range(-70, 70), clamp(p.tier + 1, 3, 9), true, { relicGuard: true });
        }
        this.emit('relicGrow', { x: f.x, y: f.y });
      }
    }
    // кладки ДНК на затопленных обломках
    const feats = this.featuresNear(p.x, p.y, 1400);
    for (const f of feats) {
      if (f.type !== 'cache' && f.type !== 'wreck') continue;
      f.cacheTimer = (f.cacheTimer ?? 20) - dt;
      if (f.cacheTimer <= 0) {
        f.cacheTimer = this.rng.range(55, 120);
        this.spawnFood('cache', f.x + this.rng.range(-f.r, f.r), f.y + this.rng.range(-f.r, f.r), { scale: 1.2 });
      }
    }
    // вентиляторы: поднимают пузыри
    if (this.rng.chance(dt * 0.6)) {
      const vents = feats.filter((f) => f.type === 'vent');
      if (vents.length) {
        const v = this.rng.pick(vents);
        for (let i = 0; i < 3; i++) {
          this.spawnParticle(v.x + this.rng.range(-v.r * 0.4, v.r * 0.4), v.y + this.rng.range(-v.r * 0.4, v.r * 0.4), 'bubble', '#ffd9a0', this.rng.range(1.5, 3.5), 0, -20, 1.6);
        }
      }
    }
  }

  _cull(dt) {
    const p = this.player;
    const despawn = CFG.spawn.despawnDist;
    for (const c of this.creatures) {
      if (c.dead) continue;
      if (c.ally) continue;
      if (c.boss) continue;
      const d = dist(c.x, c.y, p.x, p.y);
      if (d > despawn) c.dead = true;
      // старые особи естественно умирают, освобождая нишу
      if (c.tier <= 2 && d > despawn * 0.6 && this.rng.chance(dt * 0.02)) c.dead = true;
    }
    this.creatures = this.creatures.filter((c) => !c.dead);

    // поддерживаем население
    const popTarget = Math.round(58 * (this.diff.pop ?? 1) * (this.event?.popMul ?? 1) * clamp(0.7 + this.threat * 0.05, 0.6, 1.6));
    if (this.creatures.length < popTarget) {
      const batch = Math.min(3, popTarget - this.creatures.length);
      for (let i = 0; i < batch; i++) this.spawnCreatureNear(this.rng.range(CFG.spawn.spawnMinDist, CFG.spawn.spawnMaxDist), this.rng.angle(), this.threat);
    }
    const foodTarget = Math.round(CFG.spawn.maxFood * (this.diff.food ?? 1) * (this.event?.foodMul ?? 1) * (this.event?.id === 'bloom' ? 1.4 : 1));
    if (this.foods.length < foodTarget) {
      const batch = Math.min(4, Math.ceil((foodTarget - this.foods.length) / 6));
      for (let i = 0; i < batch; i++) this.spawnFoodAmbient();
    }
  }

  // ================================================================
  // Сохранение / восстановление
  // ================================================================
  serialize() {
    const p = this.player;
    return {
      v: CFG.version, seed: this.seed, difficulty: this.difficulty, time: this.time,
      dayPhase: this.dayPhase, threat: this.threat, won: this.won, freePlay: this.freePlay,
      finaleStarted: !!this.finaleStarted,
      stats: this.stats,
      features: this.features.map((f) => ({ id: f.id, type: f.type, x: f.x, y: f.y, r: f.r, seed: f.seed, biome: f.biome, hasRelic: f.hasRelic, relicTimer: f.relicTimer, cacheTimer: f.cacheTimer })),
      player: {
        x: p.x, y: p.y, tier: p.tier, biomass: p.biomass, hp: p.hp, energy: p.energy,
        dna: p.dna, parts: p.parts, rep: p.rep, relicGenes: p.relicGenes, runTime: p.runTime,
        counters: p.counters, flags: p.flags, lineage: p.lineage, alive: p.alive, heading: p.heading,
        nestPos: p.nestPos,
      },
      creatures: this.creatures.filter((c) => !c.dead && (c.tier >= 3 || c.ally)).slice(0, 70).map((c) => ({
        sp: c.sp.id, tier: c.tier, x: c.x, y: c.y, hp: c.hp, ally: c.ally, boss: c.boss, phase: c.phase,
      })),
      projectiles: [],
      foods: this.foods.filter((f) => !f.dead).slice(0, 200).map((f) => ({ kind: f.kind, x: f.x, y: f.y, life: f.life, scale: f.scale })),
      quests: this.quests.serialize(),
      qSeed: this.quests.seed,
    };
  }

  static deserialize(data, opts) {
    const g = new Game({ ...opts, seed: data.seed, difficulty: data.difficulty, lineage: data.player.lineage });
    g.time = data.time ?? 0;
    g.dayPhase = data.dayPhase ?? CFG.day.start;
    g.threat = data.threat ?? 1;
    g.won = !!data.won;
    g.freePlay = !!data.freePlay;
    g.finaleStarted = !!data.finaleStarted;
    g.stats = data.stats ?? g.stats;
    if (data.features) {
      g.features = data.features.map((f) => ({ ...f, hasRelic: f.hasRelic, cacheTimer: f.cacheTimer ?? 20 }));
      g.relicSpots = g.features.filter((f) => f.type === 'relic');
      g.featGrid.build(g.features);
    }
    const pd = data.player;
    const p = g.player;
    Object.assign(p, {
      x: pd.x, y: pd.y, tier: pd.tier, biomass: pd.biomass, dna: pd.dna, parts: pd.parts ?? p.parts,
      rep: pd.rep ?? {}, relicGenes: pd.relicGenes ?? 0, runTime: pd.runTime ?? 0,
      counters: pd.counters ?? p.counters, flags: pd.flags ?? p.flags, nestPos: pd.nestPos ?? { x: 0, y: 0 },
      heading: pd.heading ?? 0,
    });
    recomputeStats(p);
    p.hp = clamp(pd.hp ?? p.maxHp, 1, p.maxHp);
    p.energy = clamp(pd.energy ?? p.maxEnergy, 0, p.maxEnergy);
    g.creatures = [];
    g.foods = [];
    for (const c of data.creatures ?? []) {
      const sp = SPECIES_BY_ID[c.sp];
      if (!sp) continue;
      const cc = g.spawnCreature(sp, c.x, c.y, c.tier, true, { ally: c.ally });
      cc.hp = clamp(c.hp ?? cc.maxHp, 1, cc.maxHp);
      if (c.boss) { cc.boss = true; cc.phase = c.phase ?? 1; g.boss = cc; }
    }
    for (const f of data.foods ?? []) {
      const ff = g.spawnFood(f.kind, f.x, f.y, { life: f.life, scale: f.scale });
      if (ff) ff.life = f.life ?? ff.life;
    }
    g.quests.deserialize(data.quests, data.qSeed);
    return g;
  }
}
