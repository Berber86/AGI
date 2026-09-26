// quests.js — задания океана: постоянные цели стадии и сменяемые побочные поручения.
// Прогресс отслеживается через события движка (game.on('kill'|'eat'|'relic'|...)).

import { CFG } from './config.js';
import { SPECIES_BY_ID, FAMILY, BIOMES } from './species.js';
import { RNG, dist, clamp } from './util.js';
import { gainDna } from './player.js';

const SIDE_POOL = [
  {
    id: 'hunt_pred', build: (g, rng) => {
      const n = 3 + Math.floor(g.player.tier / 2);
      return { name: 'Зачистка хищников', desc: `Убей ${n} хищных клеток`, need: n, reward: 26 + n * 6, type: 'killFamily', family: FAMILY.PREDATOR };
    },
  },
  {
    id: 'hunt_any', build: (g, rng) => {
      const n = 4 + g.player.tier;
      return { name: 'Пропитание охотой', desc: `Убей ${n} любых существ`, need: n, reward: 22 + n * 5, type: 'killAny' };
    },
  },
  {
    id: 'graze', build: (g, rng) => {
      const n = 14 + g.player.tier * 3;
      return { name: 'Пастьба', desc: `Съешь ${n} растительных частиц`, need: n, reward: 20 + n, type: 'eatPlant' };
    },
  },
  {
    id: 'scavenge', build: (g, rng) => {
      const n = 4 + Math.floor(g.player.tier / 2);
      return { name: 'Санитар океана', desc: `Съешь ${n} кусков падали`, need: n, reward: 24 + n * 5, type: 'eatChunk' };
    },
  },
  {
    id: 'dance', build: (g, rng) => {
      const n = 2 + Math.floor(g.player.tier / 3);
      return { name: 'Язык танца', desc: `Подружись с ${n} существами (кружись рядом без движения)`, need: n, reward: 34 + n * 12, type: 'dance' };
    },
  },
  {
    id: 'ally', build: (g, rng) => ({ name: 'Зов стаи', desc: 'Собери 3 союзников одновременно', need: 3, reward: 60, type: 'alliesNow' }),
  },
  {
    id: 'cache', build: (g, rng) => {
      const n = 2 + Math.floor(g.player.tier / 4);
      return { name: 'Древние кладки', desc: `Найди ${n} кладки ДНК в обломках`, need: n, reward: 30 + n * 10, type: 'cache' };
    },
  },
  {
    id: 'evolve', build: (g, rng) => {
      const n = 2;
      return { name: 'Строитель тела', desc: `Установи или улучши ${n} органеллы`, need: n, reward: 30, type: 'evolve' };
    },
  },
  {
    id: 'explore', build: (g, rng) => {
      const target = rng.pick(BIOMES.slice(1));
      return { name: `Экспедиция: ${target.name}`, desc: `Достигни зоны «${target.name}»`, need: 1, reward: 34, type: 'visitBiome', biome: target.id };
    },
  },
  {
    id: 'survive', build: (g, rng) => ({ name: 'Ни царапины', desc: 'Проживи 35 секунд без урона', need: 35, reward: 38, type: 'noDamage', time: true }),
  },
  {
    id: 'grow', build: (g, rng) => {
      const target = clamp(g.player.tier + 1, 2, 10);
      return { name: 'Расти, клетка', desc: `Достигни размера ${target}`, need: 1, reward: 40, type: 'reachTier', tier: target };
    },
  },
  {
    id: 'guardian', build: (g, rng) => ({ name: 'Древний страж', desc: 'Уничтожь стрекача-столбняка у реликтового поля', need: 1, reward: 55, type: 'killSpecies', species: 'stolb' }),
  },
];

const STAGE_GOAL_TEXT = [
  'Зародить жизнь: найди пищу и расти',
  'Размер 3: укрепи мембрану',
  'Размер 5: займи свою нишу в океане',
  'Размер 7: стань заметной силой',
  'Найди первый древний ген в реликтовом поле',
  'Размер 9: обзаведись союзниками (3 вида)',
  'Собери 2 древних гена',
  'Размер 10: вершина стадии клетки',
  'Собери 3 древних гена — и жди пробуждения',
];

export class QuestSystem {
  constructor(game) {
    this.game = game;
    this.seed = (game.seed ^ 0x2a1f) >>> 0;
    this.rng = new RNG(this.seed);
    this.side = [];
    this.slots = 3;
    this.recent = [];
    this.events = { noDamageT: 0, alliesNow: 0 };
    this.doneCount = 0;
    this.stageStep = 0;
  }

  init() {
    this.bind();
    for (let i = 0; i < this.slots; i++) this.addSide();
  }

  bind() {
    const g = this.game;
    g.on('kill', ({ species, family }) => {
      for (const m of this.side) {
        if (m.type === 'killFamily' && family === m.family) this.bump(m, 1);
        if (m.type === 'killAny') this.bump(m, 1);
        if (m.type === 'killSpecies' && species.id === m.species) this.bump(m, 1);
      }
    });
    g.on('eat', ({ kind }) => {
      for (const m of this.side) {
        if (m.type === 'eatPlant' && (kind === 'plant' || kind === 'algae')) this.bump(m, 1);
        if (m.type === 'eatChunk' && kind === 'chunk') this.bump(m, 1);
      }
    });
    g.on('dance', () => {
      for (const m of this.side) if (m.type === 'dance') this.bump(m, 1);
    });
    g.on('cache', ({ amount }) => {
      for (const m of this.side) if (m.type === 'cache') this.bump(m, 1);
    });
    g.on('evolve', () => {
      for (const m of this.side) if (m.type === 'evolve') this.bump(m, 1);
    });
    g.on('grow', ({ tier }) => {
      for (const m of this.side) if (m.type === 'reachTier' && tier >= m.tier) this.bump(m, m.need);
      this.refreshStage();
    });
    g.on('relic', () => this.refreshStage());
    g.on('playerHit', () => { this.events.noDamageT = 0; for (const m of this.side) if (m.type === 'noDamage') m.progress = 0; });
  }

  update(dt) {
    const g = this.game, p = g.player;
    this.events.noDamageT += dt;
    for (const m of this.side) {
      if (m.done) continue;
      if (m.type === 'noDamage') m.progress = (g.time - p.lastDamageAt) / 1;
      if (m.type === 'alliesNow') m.progress = g.countAllies();
      if (m.type === 'visitBiome' && g.biome === m.biome) this.bump(m, m.need);
      if (m.progress >= m.need) this.complete(m);
    }
    this.refreshStage();
    // замена выполненных заданий
    this.side = this.side.filter((m) => !(m.done && (m.replaceT -= dt) <= 0));
    while (this.side.length < this.slots) {
      const add = this.addSide();
      if (!add) break;
    }
  }

  refreshStage() {
    const p = this.game.player;
    const relics = p.relicGenes;
    let step = 0;
    if (p.tier >= 10 && relics >= 3) step = 8;
    else if (relics >= 3) step = 8;
    else if (p.tier >= 10) step = 7;
    else if (relics >= 2) step = 6;
    else if (p.tier >= 9) step = 5;
    else if (relics >= 1) step = 4;
    else if (p.tier >= 7) step = 3;
    else if (p.tier >= 5) step = 2;
    else if (p.tier >= 3) step = 1;
    if (step !== this.stageStep) {
      this.stageStep = step;
      this.game.emit('stageGoal', { step, text: STAGE_GOAL_TEXT[step] });
    }
  }

  bump(m, n) {
    if (m.done) return;
    m.progress += n;
    if (m.progress >= m.need) this.complete(m);
  }

  complete(m) {
    if (m.done) return;
    m.done = true;
    m.progress = m.need;
    m.replaceT = 4.5;
    this.doneCount++;
    const bonus = 1 + this.doneCount * 0.05;
    const reward = Math.round(m.reward * bonus);
    gainDna(this.game, reward, 'quest');
    this.game.emit('questDone', { mission: m, reward });
  }

  addSide() {
    const g = this.game;
    let tries = 0;
    let def = null;
    do {
      const pool = SIDE_POOL.filter((d) => !this.recent.includes(d.id) && !this.side.some((m) => m.defId === d.id));
      if (!pool.length) break;
      def = this.rng.pick(pool);
      tries++;
    } while (tries < 12 && !def);
    if (!def) return null;
    const m = def.build(g, this.rng);
    Object.assign(m, { defId: def.id, progress: 0, done: false, replaceT: 0, id: def.id + '_' + Math.floor(this.rng.next() * 1e6) });
    this.side.push(m);
    this.recent.push(def.id);
    if (this.recent.length > 6) this.recent.shift();
    return m;
  }

  // Данные для интерфейса: цель стадии + активные поручения.
  list() {
    const g = this.game, p = g.player;
    const stage = { id: 'stage', name: 'Цель стадии', desc: STAGE_GOAL_TEXT[this.stageStep], main: true, kind: 'stage' };
    return [stage, ...this.side.map((m) => ({
      id: m.id, name: m.name, desc: m.desc, reward: m.reward,
      progress: Math.floor(Math.min(m.progress, m.need)), need: m.need, done: m.done,
    }))];
  }

  serialize() {
    return { side: this.side, recent: this.recent, doneCount: this.doneCount, seed: this.rng.s, noDamageT: this.events.noDamageT };
  }

  deserialize(data, seed) {
    if (!data) return;
    this.side = data.side ?? [];
    this.recent = data.recent ?? [];
    this.doneCount = data.doneCount ?? 0;
    if (seed) this.rng = new RNG(seed);
  }
}
