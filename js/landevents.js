// landevents.js — погода и события суши.
//
// Событие на земле — это в первую очередь вода и трава, а уже потом бой:
//   дождь      — вода везде, все пьют, травы больше;
//   засуха     — вода уходит, жажда растёт вдвое, водоёмы мелеют;
//   миграция   — стадо идёт через луга, за ним тянутся хищники;
//   ночная охота — темнота и голодные тени;
//   урожай     — плоды падают с кустов, чистый рост.
// Цель события даёт ДНК, как и в океане.

import { CFG } from './config.js';
import { LAND_SPECIES, LAND_SPECIES_BY_ID } from './landspecies.js';
import { clamp, dist } from './util.js';
import { applyLandSlow } from './landplayer.js';

const DEFS = [
  {
    id: 'rain', name: 'Долгий дождь', weight: 1.5,
    desc: 'Стена воды заливает берег: пей прямо из воздуха, хищники прячутся.',
    dur: 52, foodMul: 1.25, popMul: 0.9,
    start(g) {
      g.raining = true;
      for (const pool of g.features) if (pool.type === 'pool') pool.water = pool.maxWater;
      g.emit('banner', { text: 'Дождь заливает берег', kind: '' });
    },
    update(g, dt) {
      const p = g.player;
      if (p.alive) p.water = Math.min(p.maxWater, p.water + 3.4 * dt);
      if (g.rng.chance(dt * 26)) {
        const a = g.rng.angle(), d = g.rng.range(60, 620);
        g.spawnParticle(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 'rain', '#bfe8ff', 2.4, -30, 260, 0.7);
      }
      if (g.rng.chance(dt * 0.6)) {
        const c = g.rng.pick(g.creatures);
        if (c && !c.dead && c.sp.family !== 'predator' && c.sp.family !== 'scavenger') c.moveTo = null;
      }
    },
    end(g) { g.raining = false; },
    goal: { type: 'counter', counter: 'drinks', need: 3, reward: 42, text: 'Напейся трижды под дождём' },
  },
  {
    id: 'drought', name: 'Засуха', weight: 1.2,
    desc: 'Вода уходит из земли. Водоёмы мелеют, жажда гонит всех к остаткам влаги.',
    dur: 58, foodMul: 0.8, popMul: 1.05,
    start(g) {
      for (const f of g.features) if (f.type === 'pool') f.water = Math.max(0, f.water * 0.45);
      g.emit('banner', { text: 'Засуха. Береги воду', kind: 'bad' });
    },
    update(g, dt) {
      const p = g.player;
      if (p.alive && g.rng.chance(dt * 2.4)) {
        g.spawnParticle(p.x + (g.rng.next() - 0.5) * 400, p.y + (g.rng.next() - 0.5) * 400, 'dust', '#ffdca8', 3, 0, -8, 1.6);
      }
      // все звери идут к воде
      if (g.rng.chance(dt * 3)) {
        const c = g.rng.pick(g.creatures);
        if (c && !c.dead && !c.ally) {
          const pool = g.nearestFeature(c.x, c.y, 1200, 'pool');
          if (pool) { c.moveTo = { x: pool.x, y: pool.y }; c.moveSpeed = 0.8; }
        }
      }
    },
    goal: { type: 'survive', need: 30, reward: 46, text: 'Продержись 30 секунд засухи с водой в теле' },
  },
  {
    id: 'migration', name: 'Миграция стада', weight: 1.3,
    desc: 'Стадо идёт через луга. За ним — хищники, но и мяса хватает всем.',
    dur: 66, foodMul: 1.05, popMul: 1.6,
    start(g) {
      const sp = g.rng.pick([LAND_SPECIES_BY_ID.hoof, LAND_SPECIES_BY_ID.runner, LAND_SPECIES_BY_ID.cliffram, LAND_SPECIES_BY_ID.puffpaw]);
      g.eventData = { sp, killed: 0 };
      const base = g.rng.angle();
      for (let i = 0; i < 14; i++) {
        const a = base + g.rng.range(-0.45, 0.45);
        const d = g.rng.range(520, 1100);
        const c = g.spawnCreature(sp, g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d, g.rng.int(Math.max(2, g.player.tier - 1), g.player.tier + 2), true);
        if (c) { c.moveTo = { x: c.x + Math.cos(a + Math.PI) * 900, y: c.y + Math.sin(a + Math.PI) * 900 }; c.moveSpeed = 0.85; c.migrating = true; }
      }
      g.emit('banner', { text: `Идёт стадо: ${sp.name}`, kind: '' });
    },
    update(g, dt) {
      if (g.rng.chance(dt * 1.4)) {
        const sp = g.rng.pick([LAND_SPECIES_BY_ID.bloodtracker, LAND_SPECIES_BY_ID.meadow_hunter, LAND_SPECIES_BY_ID.hyena]);
        const a = g.rng.angle(), d = g.rng.range(600, 1100);
        const c = g.spawnCreature(sp, g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d, g.rng.int(3, g.player.tier + 2), true);
        if (c) { c.moveTo = { x: g.eventData.sp ? g.player.x : c.x, y: g.player.y }; c.moveSpeed = 1.1; }
      }
    },
    goal: { type: 'counter', counter: 'kills', need: 4, reward: 40, text: 'Поживиться на миграции: убей 4 зверей' },
  },
  {
    id: 'nighthunt', name: 'Ночная охота', weight: 1.2,
    desc: 'Темнота сгущается, и на охоту выходят те, кто её любит. Добыча ночью дороже.',
    dur: 56, foodMul: 1, popMul: 1.3, night: true,
    start(g) {
      // Четыре тени, и не все идут по следу: событие опасное, но не расстрел.
      // Ярость к игроку включается у части стаи, остальные ищут добычу сами.
      for (let i = 0; i < 4; i++) {
        const a = g.rng.angle(), d = g.rng.range(700, 1150);
        const c = g.spawnCreature(LAND_SPECIES_BY_ID.nightshade, g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d, g.rng.int(Math.max(2, g.player.tier - 1), g.player.tier + 1), true);
        if (!c) continue;
        c.huntPlayer = g.rng.chance(0.4);
        c.moveTo = c.huntPlayer ? { x: g.player.x, y: g.player.y } : null;
      }
      g.emit('banner', { text: 'Ночная охота: тени вышли на берег', kind: 'bad' });
    },
    update(g, dt) {
      if (g.rng.chance(dt * 0.7)) {
        const c = g.rng.pick(g.creatures);
        if (c && !c.dead && c.sp.id === 'nightshade' && !c.huntPlayer) { c.huntPlayer = true; c.moveTo = { x: g.player.x, y: g.player.y }; }
      }
    },
    goal: { type: 'counter', counter: 'killsNight', need: 3, reward: 52, text: 'Убей трёх в темноте' },
  },
  {
    id: 'harvest', name: 'Урожай плодов', weight: 1.1,
    desc: 'Кусты гнутся от плодов: лучший день, чтобы наесть бока.',
    dur: 48, foodMul: 1.7, popMul: 1.15,
    start(g) {
      for (let i = 0; i < 30; i++) {
        const a = g.rng.angle(), d = g.rng.range(260, 1100);
        const kind = g.rng.chance(0.6) ? 'fruit' : 'berry';
        g.spawnFood(kind, g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d);
      }
      g.emit('banner', { text: 'Урожай плодов', kind: 'good' });
    },
    update(g, dt) {
      if (g.rng.chance(dt * 16)) {
        const a = g.rng.angle(), d = g.rng.range(220, 980);
        g.spawnFood(g.rng.chance(0.65) ? 'fruit' : 'berry', g.player.x + Math.cos(a) * d, g.player.y + Math.sin(a) * d);
      }
    },
    goal: { type: 'counter', counter: 'fruits', need: 14, reward: 38, text: 'Съешь 14 плодов за урожай' },
  },
];

export class LandEventSystem {
  constructor(game) {
    this.game = game;
    this.cooldown = 24;
    this.current = null;
    this.history = [];
    this.defs = DEFS;
  }

  get id() { return this.current?.def.id; }

  pick() {
    const available = this.defs.filter((d) => d.id !== this.history[this.history.length - 1]);
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
    if (this.history.length > 4) this.history.shift();
  }

  force(id) {
    const def = this.defs.find((d) => d.id === id);
    if (def) { this.cooldown = 999; this.current = null; this.start(def); }
  }

  end() {
    const def = this.current?.def;
    def?.end?.(this.game);
    this.current = null;
    this.game.event = null;
    this.game.eventData = null;
    this.game.emit('eventEnd', { id: def?.id });
    this.cooldown = this.game.rng.range(38, 76);
  }

  update(dt) {
    const g = this.game;
    if (this.current) {
      const cur = this.current, def = cur.def;
      cur.t += dt;
      def.update?.(g, dt, cur);
      this.progressGoal(dt);
      this.checkGoal();
      if (cur.t >= def.dur) this.end();
      return;
    }
    if (!g.player.alive) return;
    this.cooldown -= dt;
    if (this.cooldown <= 0) {
      this.cooldown = g.rng.range(40, 80);
      this.start(this.pick());
    }
  }

  progressGoal(dt) {
    const cur = this.current;
    const goal = cur?.def.goal;
    if (!goal || cur.goalDone) return;
    if (goal.type === 'survive') {
      const p = this.game.player;
      if (p.water > p.maxWater * 0.15 && p.alive) cur.goalProgress += dt;
      else cur.goalProgress = Math.max(0, cur.goalProgress - dt * 1.5);
    }
  }

  checkGoal() {
    const cur = this.current;
    const goal = cur?.def.goal;
    if (!goal || cur.goalDone) return;
    const p = this.game.player;
    let progress = 0;
    switch (goal.type) {
      case 'counter': progress = p.counters[goal.counter] ?? 0; break;
      case 'survive': progress = cur.goalProgress; break;
      default: break;
    }
    cur.lastProgress = progress;
    if (progress >= goal.need) {
      cur.goalDone = true;
      this.game.emit('eventGoal', { id: cur.def.id, reward: goal.reward, text: goal.text });
    }
  }
}
