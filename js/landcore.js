// landcore.js — мир суши: генерация берега, экосистема, бой, вода, общение, владыка.
//
// Публичный контракт совпадает с подводным core.js, чтобы интерфейс и главный цикл
// не различали стадии:
//   game.player, game.update(dt, input), game.biome, game.dayPhase, game.lightLevel,
//   game.creaturesNear/foodsNear/featuresNear, game.spawnParticle/float/shake,
//   game.emit(...) — те же события, что у клетки, плюс социальные.
//
// Что принципиально иначе, чем в океане:
//   * три ресурса: здоровье, сытость, вода (пить нужно у водоёмов, дождь поит бесплатно);
//   * суша не однородна: трава тормозит, песок открыт, камень требует когтей и лазания;
//   * два пути к победе: сила (убить Ящера-владыку) и стая (привести три союзных вида к тотему);
//   * общение — мини-игра на внимательность: у каждого вида свой вкус, ошибочное действие
//     срывает знакомство.

import { CFG, LAND_DIFFICULTY } from './config.js';
import { RNG, SpatialGrid, Emitter, clamp, dist, hypot, TAU, uid, ValueNoise } from './util.js';
import {
  LAND_SPECIES_BY_ID, LAND_FOOD_KINDS, LAND_BIOMES,
  pickLandSpecies, rollLandTier,
} from './landspecies.js';
import {
  createLandPlayer, recomputeLandStats, updateLandPlayer, checkLandGrowth, consumeLandFood, landDamagePlayer,
  landSummary, landGainDna, applyLandSlow, landActiveAbility,
  startSocial, socialAct, cancelSocial, checkSworn, updateFollowers, landDifficultyById,
} from './landplayer.js';
import { updateLandCreature, onSocialAct, alertPack } from './landai.js';
import { initEffects, EffectsMethods } from './effects.js';
import { LandEventSystem } from './landevents.js';
import { LandQuestSystem } from './landquests.js';

const L = CFG.land;
const P = L.player;
const W = L.world;

export class LandGame extends Emitter {
  constructor(opts = {}) {
    super();
    this.stage = 'land';
    this.opt = opts;
    this.seed = (opts.seed ?? W.seed) >>> 0;
    this.rng = new RNG(this.seed);
    this.difficulty = opts.difficulty ?? 'normal';
    this.diff = landDifficultyById(this.difficulty);
    this.settings = opts.settings;
    this.meta = opts.meta;
    this.codex = this.meta.codex;
    this.ach = this.meta.ach;
    this.time = 0;
    this.globalTime = 0;
    this.dayPhase = L.day.start;
    this.lightLevel = 1;
    this.raining = false;
    this.threat = 1;
    this.radius = W.radius;
    this.freePlay = false;
    this.won = false;
    this.wonReason = null;
    this.tyrant = null;
    this.tyrantAwake = false;
    this.stats = { spawns: 0, kills: 0, deaths: 0, maxTier: 1, playTime: 0, socialWins: 0, sworn: 0 };
    this.grid = new SpatialGrid(W.gridCell);
    this.foodGrid = new SpatialGrid(W.gridCell);
    this.featGrid = new SpatialGrid(W.gridCell * 1.6);
    this._tmp = []; this._tmp2 = [];
    this.deathCount = opts.deathCount ?? 0;
    this.noise = new ValueNoise(this.seed ^ 0x77aa);

    this.player = createLandPlayer(opts.path ?? 'predator', this.difficulty, this.seed + 11);
    this.player.totemPos = { x: 0, y: 0 };
    this.player.x = 150; this.player.y = 90;      // выходим из тотема, а не стоим внутри него
    // наследие подводной стадии: вид выходит на берег уже не первобытной мелочью
    if (opts.fromCell) {
      const bonus = Math.min(60, (opts.fromCell.tier ?? 1) * 5);
      this.player.dna += bonus;
      this.player.tier = clamp(1 + Math.floor((opts.fromCell.tier ?? 1) / 4), 1, 3);
      this.player.x = 120; this.player.y = 90;
      recomputeLandStats(this.player);
      this.player.hp = this.player.maxHp;
      this.player.satiety = this.player.maxSatiety;
      this.player.water = this.player.maxWater;
      this.carriedFromCell = { tier: opts.fromCell.tier ?? 1, lineage: opts.fromCell.lineage ?? null, bonus };
    }

    this.creatures = [];
    this.foods = [];
    this.projectiles = [];
    this.features = [];
    initEffects(this);

    this.events = new LandEventSystem(this);
    this.quests = new LandQuestSystem(this);
    this._generateWorld();
    this._initialPopulate();
  }

  // ================================================================
  // Мир
  // ================================================================
  _generateWorld() {
    const rng = new RNG(this.seed ^ 0x9a3d);
    this.features.push({ id: uid(), type: 'totem', x: 0, y: 0, r: 90, seed: rng.int(0, 999), biome: 'shore' });

    const kinds = [
      { type: 'tree', w: 4.2, r: [46, 96] },
      { type: 'bush', w: 3.4, r: [26, 44] },
      { type: 'rock', w: 2.6, r: [34, 86] },
      { type: 'geyser', w: 0.9, r: [40, 70] },
      { type: 'den', w: 2.0, r: [60, 110] },
      { type: 'bones', w: 1.2, r: [50, 90] },
    ];
    for (let i = 0; i < W.featureCount; i++) {
      const k = rng.weighted(kinds.map((x) => [x, x.w]));
      const a = rng.angle();
      const d = Math.sqrt(rng.next()) * (W.radius - 200);
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (hypot(x, y) < 320) continue;
      const biome = this._biomeAt(x, y);
      // деревья и кусты не растут в скалах, камни — везде
      if ((k.type === 'tree' || k.type === 'bush') && biome === 'rock' && rng.chance(0.8)) continue;
      const f = {
        id: uid(), type: k.type, x, y, r: rng.range(k.r[0], k.r[1]), seed: rng.int(0, 9999), biome,
        fruitT: rng.range(4, 26), bonesT: rng.range(20, 90), water: 0,
      };
      if (k.type === 'bush') f.fruitMax = 2 + (biome === 'plain' ? 1 : 0);
      this.features.push(f);
    }
    // водоёмы: обязательны в каждом биоме, в пустоши их мало
    const poolCount = { shore: 8, plain: 7, forest: 5, rock: 3 };
    for (const biome of LAND_BIOMES) {
      for (let i = 0; i < (poolCount[biome.id] ?? 4); i++) {
        let x = 0, y = 0, tries = 0;
        do {
          const a = rng.angle();
          const d = rng.range(0.02, 0.98) * W.radius;
          x = Math.cos(a) * d; y = Math.sin(a) * d;
          tries++;
        } while (tries < 40 && this._biomeAt(x, y) !== biome.id);
        const r = rng.range(70, 150);
        this.features.push({
          id: uid(), type: 'pool', x, y, r, seed: rng.int(0, 9999), biome: biome.id,
          maxWater: 60 + r * 0.6, water: 60 + r * 0.6,
        });
      }
    }
    // костяной трон владыки — в скалах, подальше от тотема
    {
      const a = rng.angle();
      const d = W.radius * rng.range(0.84, 0.95);
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      this.throne = { x, y };
      this.features.push({ id: uid(), type: 'throne', x, y, r: 120, seed: rng.int(0, 999), biome: 'rock' });
    }
    this.featGrid.build(this.features);
    this.pools = this.features.filter((f) => f.type === 'pool');
    this.bushes = this.features.filter((f) => f.type === 'bush');
  }

  _initialPopulate() {
    for (let i = 0; i < 34; i++) {
      const a = this.rng.angle();
      const d = 300 + Math.sqrt(this.rng.next()) * 1200;
      this.spawnCreatureNear(d, a, 1, true);
    }
    for (let i = 0; i < 120; i++) this.spawnFoodAmbient();
  }

  // ================================================================
  // Запросы к миру
  // ================================================================
  creaturesNear(x, y, r) { return this.grid.query(x, y, r, this._tmp); }
  foodsNear(x, y, r) { return this.foodGrid.query(x, y, r, this._tmp2); }
  featuresNear(x, y, r) { return this.featGrid.query(x, y, r, []); }

  nearestCreature(x, y, radius, filter = null) {
    let best = null, bd = radius;
    for (const c of this.creaturesNear(x, y, radius)) {
      if (c.dead) continue;
      if (filter && !filter(c)) continue;
      const d = dist(x, y, c.x, c.y);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  nearestFeature(x, y, radius, type) {
    let best = null, bd = radius;
    for (const f of this.featuresNear(x, y, radius)) {
      if (type && f.type !== type) continue;
      const d = dist(x, y, f.x, f.y);
      if (d < bd) { bd = d; best = f; }
    }
    return best;
  }

  get biome() { return this._biomeAt(this.player.x, this.player.y); }
  _biomeAt(x, y) {
    const d = Math.sqrt(x * x + y * y) / this.radius;
    if (d < 0.26) return 'shore';
    if (d < 0.56) return 'plain';
    if (d < 0.8) return 'forest';
    return 'rock';
  }

  // Густота зарослей: влияет на засады, скрытность и рисование травы.
  vegetationAt(x, y) {
    const n = this.noise.at(x * 0.004, y * 0.004);
    const biome = this._biomeAt(x, y);
    const mul = { shore: 0.25, plain: 1.0, forest: 1.35, rock: 0.15 }[biome] ?? 1;
    return clamp(n * 0.75 + 0.35, 0, 1.4) * mul;
  }

  // Множитель скорости по грунту: песок открыт, трава и лес тормозят, камень требует лазания.
  terrainFactor(x, y) {
    const biome = this._biomeAt(x, y);
    let k = { shore: 1.03, plain: 0.98, forest: 0.9, rock: 0.85 }[biome] ?? 1;
    if (biome === 'rock') k += (this.player.stats.climb ?? 0) * 0.12;
    if (this.vegetationAt(x, y) > 0.9) k -= 0.05;
    return k;
  }

  // ================================================================
  // Спавн
  // ================================================================
  spawnCreatureNear(distance, angle, threat, quiet = false, speciesId = null) {
    const x = clamp(this.player.x + Math.cos(angle) * distance, -this.radius + 200, this.radius - 200);
    const y = clamp(this.player.y + Math.sin(angle) * distance, -this.radius + 200, this.radius - 200);
    const biome = this._biomeAt(x, y);
    const sp = speciesId ? LAND_SPECIES_BY_ID[speciesId] : pickLandSpecies(this.rng, biome, threat, this.diff.aggressive, this.lightLevel < 0.4);
    if (!sp) return null;
    return this.spawnCreature(sp, x, y, rollLandTier(this.rng, threat), quiet);
  }

  spawnCreature(sp, x, y, tier, quiet = false, extra = {}) {
    if (!sp) return null;
    const diff = this.diff;
    const tierK = 1 + (tier - 1) * 0.34;
    const r = (13 + 4.6 * tier) * sp.sizeMul * (extra.sizeMul ?? 1);
    const c = {
      id: uid(), kind: 'creature', sp, tier,
      x, y, vx: 0, vy: 0, heading: this.rng.angle(),
      r,
      hp: 0, maxHp: 0,
      dmg: (5 + 2.8 * tier) * sp.dmgMul * diff.dmg,
      speed: (86 + 5.4 * tier) * sp.speedMul,
      aiTimer: this.rng.next() * 0.4,
      walk: this.rng.next() * 6,
      hunger: this.rng.range(0.3, 1),
      nature: sp.nature ?? 'shy',
      packId: extra.packId ?? (this.rng.chance(L.spawn.packChance) ? uid() : null),
      homeX: x, homeY: y,
      den: this.nearestFeature(x, y, 600, 'den'),
      flash: 0, stun: 0, biteCd: 0, contactCd: 0, contactCd2: 0, hurtPlayerCd: 0, talkCd: 0,
      bleed: { t: 0, dps: 0 }, poison: { t: 0, dps: 0 },
      moveTo: null, moveSpeed: 1, huntTarget: null, huntPlayer: false, flee: null,
      interest: 0, socialWith: 0, followTimer: 0,
      ally: !!extra.ally, swornStay: false,
      nocturnal: !!sp.nocturnal,
      aggroRange: sp.boss ? L.tyrant.huntRadius : undefined,
      phase: 1,
      dead: false,
      alpha: this.rng.chance(0.06) && tier >= 4,
    };
    if (c.alpha) { c.maxHp = (14 + 9 * tier) * sp.hpMul * diff.hp * 1.6; c.r *= 1.22; c.dmg *= 1.25; }
    else c.maxHp = (14 + 9 * tier) * sp.hpMul * diff.hp;
    c.hp = c.maxHp;
    if (sp.boss) { c.r *= 1.35; c.boss = true; }
    this.creatures.push(c);
    this.stats.spawns++;
    if (extra.pack) {
      const n = this.rng.int(1, 3);
      for (let i = 0; i < n; i++) {
        const a = this.rng.angle(), d = this.rng.range(60, 180);
        const other = this.spawnCreature(sp, clamp(x + Math.cos(a) * d, -this.radius + 150, this.radius - 150), clamp(y + Math.sin(a) * d, -this.radius + 150, this.radius - 150), tier, true, { packId: c.packId });
        if (other && this.rng.chance(0.4)) other.moveTo = { x, y };
      }
    }
    return c;
  }

  codexSee(id) {
    if (!this.codex.has(id)) {
      this.codex.add(id);
      this.emit('codex', { id });
    }
  }

  // ================================================================
  // Еда
  // ================================================================
  spawnFood(kind, x, y, opts = {}) {
    if (!LAND_FOOD_KINDS[kind]) return null;
    if (this.foods.length > CFG.spawn.maxFood) {
      const far = this.foods.findIndex((f) => dist(f.x, f.y, this.player.x, this.player.y) > 900);
      if (far < 0) return null;
      this.foods.splice(far, 1);
    }
    const f = {
      id: uid(), kind, x, y, vx: 0, vy: 0,
      life: opts.life ?? 999, scale: opts.scale ?? 1,
      dead: false, pulledAt: -99,
    };
    this.foods.push(f);
    return f;
  }

  spawnFoodAmbient() {
    const a = this.rng.angle();
    const d = 260 + Math.sqrt(this.rng.next()) * (this.radius * 0.95);
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    const biome = this._biomeAt(x, y);
    let kind = 'fruit';
    const roll = this.rng.next();
    if (biome === 'rock') kind = roll < 0.4 ? 'nut' : roll < 0.75 ? 'meat' : 'bone';
    else if (biome === 'forest') kind = roll < 0.45 ? 'fruit' : roll < 0.7 ? 'berry' : roll < 0.85 ? 'nut' : 'meat';
    else if (biome === 'plain') kind = roll < 0.45 ? 'berry' : roll < 0.8 ? 'fruit' : 'nut';
    else kind = roll < 0.4 ? 'egg' : roll < 0.8 ? 'fruit' : 'meat';
    return this.spawnFood(kind, x, y, { life: 300 + this.rng.next() * 400 });
  }

  // ================================================================
  // Помощники для игрока
  // ================================================================
  magnetFood(x, y, radius, dt) {
    // на суше притяжения нет: зверь должен дойти. Оставлено для совместимости интерфейса.
  }

  damagePlayer(amount, source, opts) {
    return landDamagePlayer(this, amount, source, opts ?? {});
  }

  onCloudContact(ink, d) { applyLandSlow(this, 0.72, 0.4); }

  // ================================================================
  // Общение (мини-игра)
  // ================================================================
  trySocial(target) {
    const c = target ?? this.nearestCreature(this.player.x, this.player.y, L.social.startRadius + 40, (o) => !o.dead && !o.ally && !o.boss);
    if (!c) return { ok: false, why: 'Рядом никого нет' };
    const res = startSocial(this, c);
    if (!res.ok) this.emit('banner', { text: res.why, kind: 'bad' });
    return { ...res, creature: c };
  }

  socialAction(action) {
    const res = socialAct(this, action);
    for (const c of this.creaturesNear(this.player.x, this.player.y, 460)) {
      if (c.dead || c === this.player.social.target) continue;
      if (dist(c.x, c.y, this.player.x, this.player.y) < 420) onSocialAct(this, c, action);
    }
    if (res.why) this.emit('banner', { text: res.why, kind: 'bad' });
    return res;
  }

  cancelSocial() { cancelSocial(this); }

  countAllies() {
    let n = 0;
    for (const c of this.creatures) if (c.ally && !c.dead) n++;
    return n;
  }

  alliedSpecies() { return Object.values(this.player.sympathy).filter((s) => s.allied).length; }

  // ================================================================
  // Бой
  // ================================================================
  playerBite() {
    const p = this.player;
    if (p.cooldowns.bite > 0 || !p.wantsBite) return;
    const reach = p.r + 34;
    let best = null, bd = 1e9;
    for (const c of this.creaturesNear(p.x, p.y, reach + 40)) {
      if (c.dead || c.ally) continue;
      const d = dist(p.x, p.y, c.x, c.y);
      if (d > reach + c.r * 0.9) continue;
      const a = Math.atan2(c.y - p.y, c.x - p.x);
      let diff = Math.abs(((a - p.heading + Math.PI * 3) % TAU) - Math.PI);
      if (diff > 1.1) continue;
      if (d < bd) { bd = d; best = c; }
    }
    if (!best) return;
    p.cooldowns.bite = P.biteCooldown / p.stats.biteRate;
    const dmg = p.stats.biteDmg * (1 + p.tier * 0.16);
    this.hitCreature(best, dmg, { fromPlayer: true, bleed: p.stats.bleed, poison: p.stats.poison });
    this.emit('bite', { target: best });
    // мелкую тварь зверь проглатывает целиком
    if (best.hp > 0 && best.r * 1.7 < p.r && best.hp < p.r * 1.1) this.hitCreature(best, best.hp + 1, { fromPlayer: true, swallow: true });
  }

  // Активная способность: у суши своя четвёрка (рёв, планирование, яд, мускус).
  useAbility() {
    const p = this.player;
    const ab = landActiveAbility(p);
    if (!ab) return { ok: false, why: 'Активной способности нет: её дают горловой мешок, крылья или ядовитые железы' };
    if (p.cooldowns.ability > 0) return { ok: false, why: `Способность готова через ${Math.ceil(p.cooldowns.ability)} с` };
    p.cooldowns.ability = ab.cd;
    switch (ab.id) {
      case 'roar': {
        this.shake(8);
        this.spawnRing(p.x, p.y, ab.radius * 0.8, '#ffe6a0');
        this.consumeStamina(p, ab.radius, 210);
        for (const c of this.creaturesNear(p.x, p.y, ab.radius)) {
          if (c.dead || c.ally) continue;
          const d = dist(p.x, p.y, c.x, c.y);
          if (d > ab.radius) continue;
          this.hitCreature(c, ab.dmg, { fromPlayer: true });
          c.stun = Math.max(c.stun, ab.stun * (c.boss ? 0.25 : 1));
          if (c.r < p.r * 0.9) {
            const a = Math.atan2(c.y - p.y, c.x - p.x);
            c.moveTo = { x: c.x + Math.cos(a) * 420, y: c.y + Math.sin(a) * 420 };
            c.moveSpeed = 1.3;
          }
        }
        for (const f of this.featuresNear(p.x, p.y, ab.radius)) {
          if (f.type === 'bush') {
            const d = dist(p.x, p.y, f.x, f.y);
            if (d < ab.radius && this.rng.chance(0.5)) {
              this.spawnFood('berry', f.x, f.y, { life: 200 });
            }
          }
        }
        this.emit('roar', { radius: ab.radius });
        p.counters.stunHits = (p.counters.stunHits ?? 0) + 1;
        for (let i = 0; i < 16; i++) {
          const a = this.rng.angle();
          this.spawnParticle(p.x + Math.cos(a) * p.r, p.y + Math.sin(a) * p.r, 'dust', '#ffe6c0', 3, Math.cos(a) * 260, Math.sin(a) * 260, 0.7);
        }
        break;
      }
      case 'glide': {
        const a = p.heading;
        p.vx += Math.cos(a) * 900;
        p.vy += Math.sin(a) * 900;
        p.dashTime = 0.5;
        p.invuln = Math.max(p.invuln, 0.5);
        for (let i = 0; i < 14; i++) {
          const ang = a + Math.PI + (this.rng.next() - 0.5) * 0.8;
          this.spawnParticle(p.x, p.y, 'leaf', '#bfe6a0', 3, Math.cos(ang) * 120, Math.sin(ang) * 120, 0.9);
        }
        this.emit('glide', {});
        break;
      }
      case 'venom': {
        const a = p.heading;
        const bx = p.x + Math.cos(a) * (p.r + 40), by = p.y + Math.sin(a) * (p.r + 40);
        this.spawnInkCloud(bx, by, 90, { color: '#8fbf4a', life: 3.4, particles: 14 });
        for (const c of this.creaturesNear(bx, by, 120)) {
          if (c.dead || c.ally) continue;
          this.hitCreature(c, ab.dmg, { fromPlayer: true, poison: 4 });
        }
        this.emit('venomSpit', {});
        break;
      }
      case 'musk': {
        this.spawnRing(p.x, p.y, 200, '#c9a6ff');
        for (const c of this.creaturesNear(p.x, p.y, ab.radius)) {
          if (c.dead || c.ally || !c.huntPlayer) continue;
          c.huntPlayer = false;
          const ang = Math.atan2(c.y - p.y, c.x - p.x);
          c.moveTo = { x: clamp(c.x + Math.cos(ang) * 600, -this.radius + 150, this.radius - 150), y: clamp(c.y + Math.sin(ang) * 600, -this.radius + 150, this.radius - 150) };
          c.moveSpeed = 1.3;
          c.stun = Math.max(c.stun, 0.6);
        }
        this.emit('musk', {});
        break;
      }
      default: break;
    }
    return { ok: true, ability: ab };
  }

  consumeStamina(p, radius, amount) {
    p.stamina = Math.max(0, p.stamina - amount * 0.02);
  }

  hitCreature(c, amount, opts = {}) {
    if (c.dead) return 0;
    let dmg = amount;
    const armor = c.sp.parts?.armor ?? 0;
    if (!opts.ignoreArmor) dmg *= 1 / (1 + armor / 26);
    c.hp -= dmg;
    c.flash = 1;
    c.hurtBy = opts.fromPlayer ? this.player : opts.fromCreature ?? null;
    if (opts.fromPlayer) this.player.flags.pacifist = false;
    if (opts.bleed) { c.bleed.dps = Math.max(c.bleed.dps, opts.bleed); c.bleed.t = Math.max(c.bleed.t, 4); }
    if (opts.poison) { c.poison.dps = Math.max(c.poison.dps, opts.poison); c.poison.t = Math.max(c.poison.t, 4.5); }
    if (opts.fromPlayer && c.hp > 0) alertPack(this, c, this.player);
    const dmgShown = Math.round(dmg);
    if (dmgShown > 0) this.float(`−${dmgShown}`, c.x, c.y - c.r - 10, opts.swallow ? '#9fe6a0' : '#ffd0c0', 12);
    if (c.hp <= 0) this.killCreature(c, opts);
    return dmg;
  }

  killCreature(c, opts = {}) {
    if (c.dead) return;
    c.dead = true;
    const p = this.player;
    const byPlayer = !!opts.fromPlayer || c.hurtBy === p;
    if (byPlayer) {
      p.counters.kills++;
      p.counters.killsByFamily ??= {};
      p.counters.killsByFamily[c.sp.family] = (p.counters.killsByFamily[c.sp.family] ?? 0) + 1;
      if (this.lightLevel < 0.4) p.counters.killsNight++;
      this.stats.kills++;
      const gain = (3 + c.tier * 1.7) * (c.alpha ? 1.8 : 1) * (this.lightLevel < 0.4 ? 1.3 : 1);
      landGainDna(this, gain, 'kill');
      this.emit('kill', { species: c.sp, first: !p.flags[`killed_${c.sp.id}`] });
      p.flags[`killed_${c.sp.id}`] = true;
      p.satiety = Math.min(p.maxSatiety, p.satiety + 12 + c.tier * 2);
    }
    // труп остаётся на земле: падальщики и игрок успеют поесть
    const n = opts.swallow ? 1 : clamp(Math.round(c.r / 14), 2, 5);
    for (let i = 0; i < n; i++) {
      const a = this.rng.angle(), d = this.rng.next() * c.r;
      const kind = c.sp.diet === 'herb' && this.rng.chance(0.35) ? 'fruit' : 'meat';
      this.spawnFood(kind, c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, { life: 120 + this.rng.next() * 90 });
    }
    if (this.rng.chance(0.25)) this.spawnFood('bone', c.x, c.y, { life: 240 });
    for (let i = 0; i < 10; i++) {
      const a = this.rng.angle(), d = this.rng.next() * c.r;
      this.spawnParticle(c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, 'goo', c.sp.colors[0], 3, 0, -10, 0.9);
    }
    this.emit('corpse', { creature: c, byPlayer });
    if (c.boss) this.onBossKilled(c);
  }

  // ================================================================
  // Владыка скал
  // ================================================================
  spawnTyrant() {
    if (this.tyrant) return this.tyrant;
    const sp = LAND_SPECIES_BY_ID.tyrant;
    const c = this.spawnCreature(sp, this.throne.x, this.throne.y, 9, true, {});
    c.aggroRange = L.tyrant.huntRadius;
    c.phase = 1;
    c.boss = true;
    c.alpha = false;
    c.maxHp = (14 + 9 * 9) * sp.hpMul * this.diff.hp * 0.85;
    c.hp = c.maxHp;
    this.tyrant = c;
    this.tyrantAwake = true;
    this.emit('bossSpawn', { name: sp.name });
    this.shake(14);
    return c;
  }

  _updateTyrant(dt) {
    const p = this.player;
    const boss = this.tyrant;
    if (!boss || boss.dead) return;
    const frac = boss.hp / boss.maxHp;
    const wantPhase = frac > 0.66 ? 1 : frac > 0.33 ? 2 : 3;
    if (wantPhase !== boss.phase) {
      boss.phase = wantPhase;
      this.emit('bossPhase', { phase: wantPhase, name: boss.sp.name });
      this.shake(10);
      if (wantPhase === 2) {
        // рёв и призыв свиты
        for (let i = 0; i < 4; i++) {
          const a = this.rng.angle(), d = this.rng.range(200, 380);
          const c = this.spawnCreature(LAND_SPECIES_BY_ID.hyena, boss.x + Math.cos(a) * d, boss.y + Math.sin(a) * d, clamp(this.player.tier + 1, 3, 9), true, {});
          if (c) c.huntPlayer = true;
        }
        this.spawnRing(boss.x, boss.y, 320, '#ffb36b');
        this.float('РЁВ!', boss.x, boss.y - boss.r - 20, '#ffb36b', 18);
      }
      if (wantPhase === 3) {
        boss.speed *= 1.25;
        boss.dmg *= 1.2;
        applyLandSlow(this, 0.6, 1.2);
        this.float('ЯРОСТЬ', boss.x, boss.y - boss.r - 20, '#ff6b6b', 18);
      }
    }
    // таранная атака и ядовитая кровь в третьей фазе
    const d = dist(boss.x, boss.y, p.x, p.y);
    if (d < boss.r + p.r + 10 && boss.contactCd <= 0 && p.alive) {
      boss.contactCd = 0.9;
      const dmg = boss.dmg * (boss.phase === 3 ? 0.5 : 0.4);
      landDamagePlayer(this, dmg, boss, { armorPierce: boss.phase === 3 });
      const a = Math.atan2(p.y - boss.y, p.x - boss.x);
      p.vx += Math.cos(a) * 280 * (1 - p.stats.knockResist);
      p.vy += Math.sin(a) * 280 * (1 - p.stats.knockResist);
    }
  }

  onBossKilled(c) {
    const p = this.player;
    p.flags.tyrantKilled = true;
    this.float('ВЛАДЫКА ПАЛ', p.x, p.y - p.r - 26, '#ffd9a0', 20);
    this.shake(16);
    for (let i = 0; i < 30; i++) {
      const a = this.rng.angle(), d = this.rng.next() * c.r * 2;
      this.spawnParticle(c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, 'goo', '#ff9a8b', 4, 0, -20, 1.6);
    }
    for (let i = 0; i < 5; i++) this.spawnFood('bone', c.x + (this.rng.next() - 0.5) * 160, c.y + (this.rng.next() - 0.5) * 160, { life: 600 });
    this.win('tyrant');
  }

  // ================================================================
  // Победа
  // ================================================================
  win(reason) {
    if (this.won) return;
    this.won = true;
    this.winReason = reason;
    this.meta.onRunEnd?.(this, { won: true });
    this.emit('win', { reason, stats: landSummary(this.player) });
  }

  onPlayerDeath() {
    this.stats.deaths++;
    this.meta.onRunEnd?.(this, { won: false });
    this.emit('death', { stats: landSummary(this.player) });
  }

  // Отдых у тотема: сон до утра. Восстанавливает силы, но время идёт.
  restAtTotem() {
    const p = this.player;
    const d = dist(p.x, p.y, p.totemPos.x, p.totemPos.y);
    if (d > 340) return { ok: false, why: 'Отдыхать можно только у тотема' };
    if (this.tyrant && !this.tyrant.dead) return { ok: false, why: 'Не до сна: владыка рядом' };
    const isNight = this.lightLevel < 0.45;
    if (!isNight && p.hp > p.maxHp * 0.75 && p.water > p.maxWater * 0.5) return { ok: false, why: 'Ты и так в порядке' };
    const skip = (0.28 + 1 - this.dayPhase) % 1;
    const seconds = skip * L.day.length;
    this.time += seconds;
    this.dayPhase = 0.3;
    p.resting = true;
    p.restT += seconds;
    p.counters.restedAt++;
    p.hp = Math.min(p.maxHp, p.hp + p.maxHp * P.restHealRate * seconds * 0.1);
    p.water = Math.min(p.maxWater, p.water + P.restWaterGain);
    p.satiety = Math.max(0, p.satiety - 10);
    p.stamina = p.maxStamina;
    p.lastDamageAt = -99;
    this.player.flags.nightSurvived = true;
    this.emit('rest', { seconds });
    return { ok: true, seconds };
  }

  // ================================================================
  // Шаг мира
  // ================================================================
  update(dt, input) {
    dt = Math.min(dt, CFG.misc.maxDelta);
    this.time += dt;
    this.globalTime += dt;
    const p = this.player;

    this.dayPhase = (this.dayPhase + dt / L.day.length) % 1;
    this.lightLevel = this._dayLight();
    this.threat = clamp(1 + (p.tier - 1) * 0.8 + this.time / 340, 1, 10);

    this.grid.build(this.creatures);
    this.foodGrid.build(this.foods);

    this.events.update(dt);
    this._updateFeatures(dt);
    this._updatePools(dt);

    if (!p.alive) { this.updateEffects(dt); return; }
    if (p.stun > 0) { p.stun -= dt; input = { ax: 0, ay: 0 }; }

    p.wantsBite = false;
    updateLandPlayer(this, dt, input);
    checkLandGrowth(this);
    this.playerBite();

    for (const c of this.creatures) {
      if (c.dead) continue;
      updateLandCreature(this, c, dt);
      if (c === this.tyrant) this._updateTyrant(dt);
    }
    updateFollowers(this, dt);

    this._resolveCreatureContacts();
    this._handleEating();
    this._updateFoods(dt);
    this.updateEffects(dt);
    this._cull(dt);

    // присяга союзных видов у тотема — мирная победа
    const sworn = checkSworn(this);
    if (this.stats.sworn !== sworn) this.stats.sworn = sworn;
    if (!this.won && sworn >= L.social.swornCount) {
      this.float('СТАЯ СОБРАНА', p.x, p.y - p.r - 24, '#9fe6a0', 19);
      this.win('sworn');
    }

    this._updateBiome();
    this._checkTyrantAwake();
    this.quests.update(dt);
    this.stats.playTime += dt;
    this.stats.maxTier = Math.max(this.stats.maxTier, p.tier);
    this.stats.socialWins = p.counters.socialWins;
  }

  _dayLight() {
    const t = this.dayPhase;
    // 0 в полночь, 1 в полдень. Раньше здесь стоял сдвиг (t − 0.25): солнце всходило
    // в 18:00, и утренняя игра шла в темноте, хотя часы показывали утро.
    const curve = 0.5 - 0.5 * Math.cos(t * TAU);
    const biome = this.biome;
    const bl = { shore: 1, plain: 0.95, forest: 0.6, rock: 0.85 }[biome] ?? 1;
    return clamp(0.2 + curve * 0.8 * bl, 0.16, 1);
  }

  _updateBiome() {
    const b = this.biome;
    this.player.flags.visited ??= {};
    if (!this.player.flags.visited[b]) {
      this.player.flags.visited[b] = true;
      if (b === 'rock') this.player.flags.visitedRock = true;
    }
    if (b !== this._biome) {
      if (this._biome) this.emit('biomeChange', { from: this._biome, to: b });
      this._biome = b;
    }
  }

  _checkTyrantAwake() {
    if (this.tyrantAwake || this.tyrant) return;
    const p = this.player;
    const nearThrone = dist(p.x, p.y, this.throne.x, this.throne.y) < 900;
    if (p.tier >= L.tyrant.minTier && (nearThrone || this.biome === 'rock')) {
      this.spawnTyrant();
      this.emit('banner', { text: 'Из костяного трона поднимается владыка', kind: 'bad' });
    }
  }

  // Вода: питьё, купание, высыхание
  _updatePools(dt) {
    const p = this.player;
    p.inWater = false;
    for (const pool of this.pools) {
      const d = dist(p.x, p.y, pool.x, pool.y);
      if (d > pool.r + 60) continue;
      if (pool.water < pool.maxWater * 0.999 && this.raining) pool.water = Math.min(pool.maxWater, pool.water + dt * 6);
      if (d < pool.r && p.alive) {
        p.inWater = true;
        if (p.water < p.maxWater) {
          if (!p.drinking) { p.drinking = true; p.counters.drinks++; this.emit('drink', { pool }); }
          p.water = Math.min(p.maxWater, p.water + P.drinkRate * dt);
          pool.water = Math.max(0, pool.water - 2.0 * dt);
        } else if (p.drinking && p.water >= p.maxWater) {
          p.drinking = false;
        }
        if (!p.drinking && p.water >= p.maxWater * 0.98) p.drinking = false;
      }
    }
    if (!p.inWater) p.drinking = false;
    if (this.rng.chance(dt * 2)) {
      const pool = this.rng.pick(this.pools);
      if (pool && this.rng.chance(0.4)) {
        this.spawnParticle(pool.x + (this.rng.next() - 0.5) * pool.r, pool.y + (this.rng.next() - 0.5) * pool.r, 'bubble', '#cfefff', 2, 0, -12, 0.8);
      }
    }
  }

  // Кусты плодоносят, кости проступают из земли, гейзеры бьют
  _updateFeatures(dt) {
    const p = this.player;
    for (const f of this.featuresNear(p.x, p.y, 1500)) {
      if (f.type === 'bush') {
        f.fruitT -= dt;
        if (f.fruitT <= 0) {
          f.fruitT = this.rng.range(24, 52) / (this.events.id === 'harvest' ? 2.2 : 1);
          const count = this.foodGrid.query(f.x, f.y, f.r + 40, []).filter((x) => !x.dead).length;
          if (count < (f.fruitMax ?? 2)) {
            const a = this.rng.angle(), d = this.rng.range(10, f.r * 0.9);
            this.spawnFood(this.rng.chance(0.7) ? 'fruit' : 'berry', f.x + Math.cos(a) * d, f.y + Math.sin(a) * d, { life: 150 + this.rng.next() * 120 });
          }
        }
      } else if (f.type === 'bones') {
        f.bonesT -= dt;
        if (f.bonesT <= 0) {
          f.bonesT = this.rng.range(60, 130);
          this.spawnFood('bone', f.x + (this.rng.next() - 0.5) * f.r, f.y + (this.rng.next() - 0.5) * f.r, { life: 400 });
          this.spawnParticle(f.x, f.y, 'dust', '#e6eef2', 4, 0, -14, 1.2);
        }
      } else if (f.type === 'geyser') {
        f.timer = (f.timer ?? this.rng.range(2, 9)) - dt;
        if (f.timer <= 0) {
          f.timer = this.rng.range(7, 16);
          f.blow = 1.6;
          const d = dist(p.x, p.y, f.x, f.y);
          if (d < f.r + p.r) {
            landDamagePlayer(this, 12, null, { armorPierce: true });
            const a = Math.atan2(p.y - f.y, p.x - f.x);
            p.vx += Math.cos(a) * 320; p.vy += Math.sin(a) * 320;
          }
          this.shake(4);
          for (let i = 0; i < 14; i++) {
            const a = this.rng.angle(), dd = this.rng.next() * 30;
            this.spawnParticle(f.x + Math.cos(a) * dd, f.y + Math.sin(a) * dd, 'bubble', '#ffe6c0', 4, 0, -160, 1.4);
          }
        }
        if (f.blow > 0) f.blow -= dt;
      } else if (f.type === 'den') {
        f.eggT = (f.eggT ?? this.rng.range(20, 80)) - dt;
        if (f.eggT <= 0) {
          f.eggT = this.rng.range(70, 150);
          const count = this.foodGrid.query(f.x, f.y, f.r, []).filter((x) => !x.dead && x.kind === 'egg').length;
          if (count < 2) this.spawnFood('egg', f.x + (this.rng.next() - 0.5) * f.r * 0.8, f.y + (this.rng.next() - 0.5) * f.r * 0.8, { life: 500 });
        }
      }
    }
  }

  _updateFoods(dt) {
    const p = this.player;
    for (const f of this.foods) {
      if (f.dead) continue;
      f.life -= dt;
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.vx *= 1 - 2.4 * dt; f.vy *= 1 - 2.4 * dt;
      if (f.life <= 0) { f.dead = true; continue; }
      if (dist(f.x, f.y, p.x, p.y) > L.spawn.foodDespawnDist) { f.dead = true; continue; }
      if (this.lightLevel > 0.4 && this.rng.chance(dt * 0.02)) {
        f.vx += (this.rng.next() - 0.5) * 10;
      }
    }
    this.foods = this.foods.filter((f) => !f.dead);
  }

  _handleEating() {
    const p = this.player;
    const reach = p.r * P.eatRadius + 12;
    for (const f of this.foodsNear(p.x, p.y, reach + 30)) {
      if (f.dead) continue;
      const d = dist(p.x, p.y, f.x, f.y);
      if (d > reach) continue;
      // клюв и зоб помогают есть то, что мимо пасти: яйца и кости требуют «нажать» укусом
      if (f.kind === 'bone' && !p.wantsBite) continue;
      if (f.kind === 'egg' && !p.wantsBite) continue;
      f.dead = true;
      consumeLandFood(this, f);
      this.spawnRing(f.x, f.y, 22, LAND_FOOD_KINDS[f.kind].color);
    }
  }

  _resolveCreatureContacts() {
    const p = this.player;
    if (!p.alive) return;
    // препятствия: деревья, камни, тотем, трон
    for (const f of this.featuresNear(p.x, p.y, p.r + 220)) {
      // сквозь воду, кусты, кладки, гейзеры и норы зверь проходит; тотем и трон —
      // свои постройки, они тоже не толкают (иначе игрок застревает на старте в центре)
      if (f.type !== 'tree' && f.type !== 'rock') continue;
      const solid = f.type === 'tree' ? f.r * 0.34 : f.type === 'rock' ? f.r * 0.72 : f.r * 0.7;
      const d = dist(p.x, p.y, f.x, f.y);
      if (d < solid + p.r) {
        const nx = (p.x - f.x) / (d || 1), ny = (p.y - f.y) / (d || 1);
        p.x = f.x + nx * (solid + p.r);
        p.y = f.y + ny * (solid + p.r);
        p.vx -= nx * 70; p.vy -= ny * 70;
      }
    }
  }

  _cull(dt) {
    const p = this.player;
    const maxAlive = Math.round(L.spawn.maxCells * this.diff.pop * 0.72 * (this.event?.popMul ?? 1) * (0.7 + 0.05 * this.threat));
    for (const c of this.creatures) {
      if (c.dead) continue;
      const d = dist(c.x, c.y, p.x, p.y);
      if (d > L.spawn.despawnDist && !c.ally && c !== this.tyrant && c.tier >= 3) c.dead = true;
    }
    this.creatures = this.creatures.filter((c) => !c.dead || c.boss);
    const alive = this.creatures.filter((c) => !c.dead).length;
    if (alive < maxAlive && this.rng.chance(dt * 2.2)) {
      this.spawnCreatureNear(this.rng.range(L.spawn.spawnMinDist, L.spawn.spawnMaxDist), this.rng.angle(), this.threat);
    }
    // кости и мясо не должны копиться бесконечно: дальнее убираем первым
    if (this.foods.length > CFG.spawn.maxFood) {
      let cut = this.foods.length - CFG.spawn.maxFood;
      this.foods = this.foods.filter((f) => {
        if (cut > 0 && !f.dead && dist(f.x, f.y, p.x, p.y) > 300) { cut--; return false; }
        return true;
      });
    }
  }

  // ================================================================
  // Сохранение
  // ================================================================
  serialize() {
    const p = this.player;
    return {
      v: CFG.version, stage: 'land', seed: this.seed, difficulty: this.difficulty,
      time: this.time, dayPhase: this.dayPhase, won: this.won, freePlay: this.freePlay,
      winReason: this.winReason, tyrantAwake: this.tyrantAwake,
      stats: this.stats,
      carriedFromCell: this.carriedFromCell ?? null,
      features: this.features.map((f) => ({
        id: f.id, type: f.type, x: f.x, y: f.y, r: f.r, seed: f.seed, biome: f.biome,
        water: f.water, fruitT: f.fruitT, bonesT: f.bonesT,
      })),
      player: {
        x: p.x, y: p.y, tier: p.tier, biomass: p.biomass, hp: p.hp, dna: p.dna,
        satiety: p.satiety, water: p.water, stamina: p.stamina,
        parts: p.parts, path: p.path, sympathy: p.sympathy, counters: p.counters, flags: p.flags,
        runTime: p.runTime, alive: p.alive, heading: p.heading, totemPos: p.totemPos,
      },
      creatures: this.creatures.filter((c) => !c.dead).slice(0, 60).map((c) => ({
        sp: c.sp.id, tier: c.tier, x: c.x, y: c.y, hp: c.hp, ally: c.ally, boss: c.boss,
        phase: c.phase, swornStay: c.swornStay,
      })),
      foods: this.foods.filter((f) => !f.dead).slice(0, 160).map((f) => ({ kind: f.kind, x: f.x, y: f.y, life: Math.min(f.life, 600) })),
      quests: this.quests.serialize(),
      qSeed: this.quests.seed,
    };
  }

  static deserialize(data, opts) {
    const g = new LandGame({ ...opts, seed: data.seed, difficulty: data.difficulty, path: data.player?.path ?? 'predator' });
    g.time = data.time ?? 0;
    g.dayPhase = data.dayPhase ?? L.day.start;
    g.won = !!data.won;
    g.freePlay = !!data.freePlay;
    g.winReason = data.winReason ?? null;
    g.stats = data.stats ?? g.stats;
    g.carriedFromCell = data.carriedFromCell ?? null;
    if (data.features) {
      g.features = data.features.map((f) => ({ ...f }));
      g.featGrid.build(g.features);
      g.pools = g.features.filter((f) => f.type === 'pool');
      g.bushes = g.features.filter((f) => f.type === 'bush');
      const throne = g.features.find((f) => f.type === 'throne');
      if (throne) g.throne = { x: throne.x, y: throne.y };
    }
    const pd = data.player ?? {};
    const p = g.player;
    Object.assign(p, {
      x: pd.x ?? 0, y: pd.y ?? 0, tier: pd.tier ?? 1, biomass: pd.biomass ?? 0, dna: pd.dna ?? 20,
      parts: pd.parts ?? p.parts, sympathy: pd.sympathy ?? {}, counters: pd.counters ?? p.counters,
      flags: pd.flags ?? p.flags, runTime: pd.runTime ?? 0, heading: pd.heading ?? -Math.PI / 2,
      totemPos: pd.totemPos ?? { x: 0, y: 0 },
    });
    p.satiety = pd.satiety ?? p.maxSatiety;
    p.water = pd.water ?? p.maxWater;
    p.stamina = pd.stamina ?? p.maxStamina;
    recomputeLandStats(p);
    p.hp = clamp(pd.hp ?? p.maxHp, 1, p.maxHp);
    g.creatures = [];
    g.foods = [];
    for (const c of data.creatures ?? []) {
      const sp = LAND_SPECIES_BY_ID[c.sp];
      if (!sp) continue;
      const cc = g.spawnCreature(sp, c.x, c.y, c.tier, true, { ally: c.ally });
      if (!cc) continue;
      cc.hp = clamp(c.hp ?? cc.maxHp, 1, cc.maxHp);
      cc.swornStay = !!c.swornStay;
      if (c.boss) { cc.boss = true; cc.phase = c.phase ?? 1; g.tyrant = cc; }
    }
    for (const f of data.foods ?? []) g.spawnFood(f.kind, f.x, f.y, { life: f.life ?? 300 });
    g.tyrantAwake = !!data.tyrantAwake || !!g.tyrant;
    g.quests.deserialize(data.quests, data.qSeed);
    return g;
  }
}

Object.assign(LandGame.prototype, EffectsMethods);
