// events.js — динамические события океана: цветение, штормы, миграции, хищники, падёж.
// Событие задаёт модификаторы мира (еду, население, течение) и собственный сценарий
// с целью, за которую дают ДНК.

import { CFG } from './config.js';
import { SPECIES_BY_ID } from './species.js';
import { clamp, dist } from './util.js';
import { applySlow } from './player.js';

const DEFS = [
  {
    id: 'bloom', name: 'Цветение планктона', weight: 1.5,
    desc: 'Вода закипает жизнью: еды втрое больше, но и едоков тоже.',
    dur: CFG.spawn.bloomDuration, foodMul: 1.6, popMul: 1.25,
    start(g) {
      for (let i = 0; i < 26; i++) {
        const a = g.rng.angle(), d = g.rng.range(300, 1200);
        g.spawnFood(g.rng.chance(0.7) ? 'plant' : 'algae', g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d);
      }
      const sp = SPECIES_BY_ID.ciliata;
      for (let i = 0; i < 8; i++) {
        const a = g.rng.angle(), d = g.rng.range(600, 1100);
        const c = g.spawnCreature(sp, clamp(g.player.x + Math.cos(a) * d, -3000, 3000), clamp(g.player.y + Math.sin(a) * d, -3000, 3000), g.rng.int(1, 3), true);
        if (c) c.wander = g.rng.angle();
      }
    },
    update(g, dt) {
      if (g.rng.chance(dt * 22)) {
        const a = g.rng.angle(), d = g.rng.range(200, 900);
        g.spawnFood('plant', g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d);
      }
    },
    goal: { type: 'counter', counter: 'bloomEats', need: 24, reward: 45, text: 'Съешь 24 частицы во время цветения' },
  },
  {
    id: 'tide', name: 'Приливный шторм', weight: 1.3,
    desc: 'Мощное течение тащит всё к центру океана. Держись подальше от воронки.',
    dur: CFG.spawn.tideDuration, foodMul: 1, popMul: 0.9,
    start(g) { g.emit('banner', { text: 'Приливный шторм!', kind: 'bad' }); },
    update(g, dt) {
      const p = g.player;
      const d = Math.hypot(p.x, p.y);
      const strength = CFG.spawn.tideStrength * (0.8 + 0.4 * Math.sin(g.time * 0.7));
      if (d > 60) g.currentPush = { x: -p.x / d * strength, y: -p.y / d * strength };
      if (g.rng.chance(dt * 30)) {
        const a = g.rng.angle(), dd = g.rng.range(150, 900);
        g.spawnParticle(p.x + Math.cos(a) * dd, p.y + Math.sin(a) * dd, 'spark', '#bfefff', 3, -Math.cos(a) * 260, -Math.sin(a) * 260, 1.1);
      }
      if (g.rng.chance(dt * 3)) {
        const c = g.rng.pick(g.creatures);
        if (c && !c.ally && !c.dead && c.tier <= 3) g.hitCreature(c, 6, {});
      }
    },
    goal: { type: 'timed', need: 16, reward: 40, text: 'Переживи шторм вне гнезда', awayFromNest: 400 },
  },
  {
    id: 'migration', name: 'Великая миграция', weight: 1.2,
    desc: 'Косяк идёт через океан — огромный, шумный, вкусный.',
    dur: 64, foodMul: 1.05, popMul: 1.5,
    start(g) {
      const sp = g.rng.pick([SPECIES_BY_ID.euplotes, SPECIES_BY_ID.crustula, SPECIES_BY_ID.rota, SPECIES_BY_ID.spicula]);
      g.eventData = { sp, killed: 0 };
      const base = g.rng.angle();
      for (let i = 0; i < 16; i++) {
        const a = base + g.rng.range(-0.5, 0.5);
        const d = g.rng.range(500, 1100);
        const c = g.spawnCreature(sp, g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d, g.rng.int(Math.max(2, g.player.tier - 1), g.player.tier + 2), true);
        if (c) { c.wander = a + Math.PI; c.migrating = true; }
      }
      g.emit('banner', { text: `Миграция: ${sp.name}`, kind: '' });
    },
    update(g, dt) {
      const data = g.eventData;
      if (!data) return;
      const alive = g.creatures.filter((c) => c.migrating && !c.dead).length;
      if (alive < 22 && g.rng.chance(dt * 1.1)) {
        const a = g.rng.angle(), d = 1000;
        const c = g.spawnCreature(data.sp, clamp(g.player.x + Math.cos(a) * d, -3000, 3000), clamp(g.player.y + Math.sin(a) * d, -3000, 3000), g.rng.int(2, g.player.tier + 2), true);
        if (c) c.migrating = true;
      }
    },
    goal: { type: 'migrationKill', need: 5, reward: 50, text: 'Убей 5 особей из миграции' },
  },
  {
    id: 'predator', name: 'Охота началась', weight: 1.25,
    desc: 'Крупный хищник идёт по твоему следу. Он не отстанет.',
    dur: 70, foodMul: 1, popMul: 1.05,
    start(g) {
      const sp = g.rng.pick([SPECIES_BY_ID.giganteus, SPECIES_BY_ID.lucifuga, SPECIES_BY_ID.laternula, SPECIES_BY_ID.sepiola, SPECIES_BY_ID.virosa]);
      const a = g.rng.angle();
      const c = g.spawnCreature(sp, g.player.x + Math.cos(a) * 1000, g.player.y + Math.sin(a) * 1000, clamp(g.player.tier + 2, 3, 10), false);
      c.hunterOfPlayer = true;
      c.hunt = { t: 70 };
      g.eventData = { hunter: c };
      g.emit('banner', { text: `Тебя выслеживает ${sp.name}`, kind: 'bad' });
    },
    update(g, dt) {
      const c = g.eventData?.hunter;
      if (!c || c.dead) return;
      c.hunt = { t: 5 };
      c.preyTarget = null;
      if (g.rng.chance(dt * 6)) g.spawnParticle(c.x + g.rng.range(-20, 20), c.y + g.rng.range(-20, 20), 'goo', '#ff6b6b', 2, 0, 0, 0.6);
    },
    goal: { type: 'hunterKill', need: 1, reward: 70, text: 'Убей преследователя' },
  },
  {
    id: 'carcass', name: 'Падёж гиганта', weight: 1.0,
    desc: 'Нечто огромное умерло. Пир для всех, кто успеет первым.',
    dur: 80, foodMul: 1.25, popMul: 1.35,
    start(g) {
      const a = g.rng.angle(), d = g.rng.range(500, 900);
      const x = g.player.x + Math.cos(a) * d, y = g.player.y + Math.sin(a) * d;
      g.eventData = { x, y, eaten: 0 };
      for (let i = 0; i < 16; i++) {
        const aa = g.rng.angle(), dd = g.rng.next() * 150;
        const f = g.spawnFood('chunk', x + Math.cos(aa) * dd, y + Math.sin(aa) * dd, { scale: g.rng.range(1.2, 2.4), life: 220 });
        f.vx = Math.cos(aa) * 20; f.vy = Math.sin(aa) * 20;
      }
      for (let i = 0; i < 6; i++) {
        const aa = g.rng.angle(), dd = g.rng.range(300, 800);
        const s = g.spawnCreature(SPECIES_BY_ID.tubifex, x + Math.cos(aa) * dd, y + Math.sin(aa) * dd, g.rng.int(2, 5), true);
        if (s) s.wander = Math.atan2(y - s.y, x - s.x);
      }
      g.emit('banner', { text: 'В океане всплыла туша', kind: '' });
    },
    goal: { type: 'carcassEat', need: 6, reward: 45, text: 'Съешь 6 кусков падали' },
  },
  {
    id: 'spores', name: 'Споровое облако', weight: 1.0,
    desc: 'В воде расползаются облака спор. Внутри них нечем дышать.',
    dur: 46, foodMul: 1.1, popMul: 1.1,
    start(g) {
      g.eventData = { clouds: [] };
      for (let i = 0; i < 7; i++) {
        const a = g.rng.angle(), d = g.rng.range(250, 1400);
        g.eventData.clouds.push({
          x: g.player.x + Math.cos(a) * d, y: g.player.y + Math.sin(a) * d,
          r: g.rng.range(120, 260), vx: g.rng.range(-14, 14), vy: g.rng.range(-14, 14),
        });
      }
      g.emit('banner', { text: 'Споровое облако наползает', kind: 'bad' });
    },
    update(g, dt) {
      const clouds = g.eventData?.clouds ?? [];
      const p = g.player;
      for (const cl of clouds) {
        cl.x += cl.vx * dt; cl.y += cl.vy * dt;
        const d = dist(cl.x, cl.y, p.x, p.y);
        if (d < cl.r && p.invuln <= 0) {
          g.damagePlayer(3.6 * dt, null, { armorPierce: true });
          applySlow(g, 0.75, 0.3);
        }
        if (g.rng.chance(dt * 4)) {
          const a = g.rng.angle(), dd = g.rng.next() * cl.r;
          g.spawnParticle(cl.x + Math.cos(a) * dd, cl.y + Math.sin(a) * dd, 'goo', '#c9a6ff', 3, 0, -8, 1.4);
        }
      }
    },
    goal: { type: 'timed', need: 26, reward: 40, text: 'Продержись 26 секунд вне спор', avoidSpores: true },
  },
  {
    id: 'finale', name: 'Левиафан пробудился', weight: 0, forced: true,
    desc: 'Три древних гена в твоём теле разбудили хозяина бездны. Неси их в гнездо — или убей его.',
    dur: 9999, foodMul: 0.9, popMul: 0.8,
    start(g) {
      g.emit('banner', { text: 'ЛЕВИАФАН ПРОБУДИЛСЯ', kind: 'bad' });
      g.emit('finaleStart', {});
    },
    update(g, dt) {
      const b = g.boss;
      if (!b || b.dead) return;
      if (g.rng.chance(dt * 0.4)) g.spawnParticle(b.x + g.rng.range(-b.r, b.r), b.y + g.rng.range(-b.r, b.r), 'bubble', '#ff6b6b', 4, 0, -12, 2);
      const minions = g.creatures.filter((c) => c.summoned && !c.dead).length;
      if (minions < 6 && g.rng.chance(dt * 0.06)) g.spawnBossMinions(b, 1);
    },
    goal: { type: 'bossKill', need: 1, reward: 150, text: 'Убей Левиафана' },
  },
];

export class EventSystem {
  constructor(game) {
    this.game = game;
    this.current = null;
    this.cooldown = 30;
    this.defs = DEFS;
    this.history = [];
    this.bind();
  }

  get id() { return this.current?.def.id; }

  bind() {
    const g = this.game;
    g.on('kill', ({ species }) => {
      const cur = this.current;
      if (!cur) return;
      if (cur.def.goal?.type === 'migrationKill' && g.eventData?.sp?.id === species.id) g.eventData.killed++;
    });
    g.on('eat', ({ kind }) => {
      const cur = this.current;
      if (!cur) return;
      if (cur.def.goal?.type === 'carcassEat' && kind === 'chunk' && g.eventData) g.eventData.eaten++;
    });
  }

  update(dt) {
    const g = this.game;
    if (this.current) {
      const cur = this.current, def = cur.def;
      cur.t += dt;
      def.update?.(g, dt, cur);
      this.progressGoal(dt);
      this.checkCounters();
      if (cur.t >= def.dur) this.end();
      return;
    }
    if (g.finaleStarted || !g.player.alive) return;
    this.cooldown -= dt;
    if (this.cooldown <= 0) {
      this.cooldown = g.rng.range(36, 74);
      this.start(this.pick());
    }
  }

  progressGoal(dt) {
    const cur = this.current;
    const goal = cur?.def.goal;
    if (!goal || cur.goalDone || goal.type !== 'timed') return;
    const g = this.game, p = g.player;
    const atNest = dist(p.x, p.y, p.nestPos.x, p.nestPos.y) < (goal.awayFromNest ?? 400);
    const inSpore = goal.avoidSpores && (g.eventData?.clouds ?? []).some((c) => dist(c.x, c.y, p.x, p.y) < c.r);
    const inDanger = g.time - p.lastDamageAt < 1.2;
    if (atNest || inSpore || inDanger) cur.goalProgress = Math.max(0, cur.goalProgress - dt * 1.5);
    else cur.goalProgress += dt;
  }

  pick() {
    const available = this.defs.filter((d) => !d.forced && d.id !== this.history[this.history.length - 1]);
    return this.game.rng.weighted(available.map((d) => [d, d.weight ?? 1]));
  }

  start(def) {
    if (!def) return;
    this.current = { def, t: 0, goalProgress: 0, goalDone: false };
    this.game.event = { id: def.id, name: def.name, desc: def.desc, dur: def.dur, foodMul: def.foodMul ?? 1, popMul: def.popMul ?? 1 };
    this.game.eventData = null;
    def.start?.(this.game);
    this.game.emit('eventStart', { id: def.id, name: def.name, desc: def.desc });
    this.history.push(def.id);
    if (this.history.length > 5) this.history.shift();
  }

  force(id) {
    const def = this.defs.find((d) => d.id === id);
    if (def) { this.cooldown = 999; this.current = null; this.start(def); }
  }

  end() {
    const def = this.current?.def;
    this.current = null;
    this.game.event = null;
    this.game.eventData = null;
    this.game.emit('eventEnd', { id: def?.id });
    this.cooldown = this.game.rng.range(34, 70);
  }

  // Цель события выполнена? (для счётчиков, которые пишет ядро)
  checkCounters() {
    const cur = this.current;
    const goal = cur?.def.goal;
    if (!goal || cur.goalDone) return;
    const g = this.game, p = g.player;
    let progress = 0;
    switch (goal.type) {
      case 'migrationKill': progress = g.eventData?.killed ?? 0; break;
      case 'hunterKill': progress = g.eventData?.hunter?.dead ? 1 : 0; break;
      case 'carcassEat': progress = g.eventData?.eaten ?? 0; break;
      case 'bossKill': progress = g.boss?.dead ? 1 : 0; break;
      case 'counter': progress = p.counters[goal.counter] ?? 0; break;
      case 'timed': progress = cur.goalProgress; break;
      default: break;
    }
    cur.lastProgress = progress;
    if (progress >= goal.need) {
      cur.goalDone = true;
      g.emit('eventGoal', { id: cur.def.id, reward: goal.reward, text: goal.text });
    }
  }
}
