// landquests.js — задания суши: цель стадии и сменяемые поручения.
//
// Цель стадии считается из состояния мира и всегда честная:
//   осмотреться и вырасти → найти первый союзный вид → привести три вида к тотему
//   или убить Ящера-владыку.
// Побочные поручения — пул фабрик: прогресс берётся из счётчиков игрока и событий движка.

import { CFG } from './config.js';
import { LAND_SPECIES_BY_ID, LAND_BIOMES } from './landspecies.js';
import { RNG, clamp } from './util.js';
import { landGainDna } from './landplayer.js';

const SIDE_POOL = [
  {
    id: 'graze', build: (g) => {
      const n = 12 + g.player.tier * 3;
      return { name: 'Пастьба', desc: `Съешь ${n} плодов и ягод`, need: n, reward: 22 + n, type: 'eatPlant' };
    },
  },
  {
    id: 'hunt_pred', build: (g) => {
      const n = 3 + Math.floor(g.player.tier / 2);
      return { name: 'Опасный сосед', desc: `Убей ${n} хищников`, need: n, reward: 32 + n * 8, type: 'killFamily', family: 'predator' };
    },
  },
  {
    id: 'hunt_any', build: (g) => {
      const n = 4 + g.player.tier;
      return { name: 'Пропитание охотой', desc: `Убей ${n} зверей`, need: n, reward: 26 + n * 6, type: 'killAny' };
    },
  },
  {
    id: 'drink', build: (g) => {
      const n = 3;
      return { name: 'К водопою', desc: `Напейся ${n} раза у водоёма`, need: n, reward: 30, type: 'drink' };
    },
  },
  {
    id: 'talk', build: (g) => {
      const n = 2 + Math.floor(g.player.tier / 3);
      return { name: 'Язык зверей', desc: `Проведи ${n} удачных знакомства (пение, танец, поза, ласка)`, need: n, reward: 40 + n * 12, type: 'social' };
    },
  },
  {
    id: 'ally', build: () => ({ name: 'Стая', desc: 'Заведи двух союзных видов', need: 2, reward: 70, type: 'alliesTotal' }),
  },
  {
    id: 'bones', build: (g) => {
      const n = 2 + Math.floor(g.player.tier / 3);
      return { name: 'Древние кости', desc: `Найди ${n} кладки древних костей`, need: n, reward: 34 + n * 10, type: 'bones' };
    },
  },
  {
    id: 'eggs', build: (g) => {
      const n = 2;
      return { name: 'Разоритель гнёзд', desc: `Утащи ${n} яйца из чужих кладок`, need: n, reward: 46, type: 'eggs' };
    },
  },
  {
    id: 'evolve', build: () => ({ name: 'Строитель тела', desc: 'Установи или улучши 2 части тела', need: 2, reward: 34, type: 'evolve' }),
  },
  {
    id: 'explore', build: (g, rng) => {
      const target = rng.pick(LAND_BIOMES.slice(1));
      return { name: `Экспедиция: ${target.name}`, desc: `Дойди до биома «${target.name}»`, need: 1, reward: 38, type: 'visitBiome', biome: target.id };
    },
  },
  {
    id: 'survive', build: () => ({ name: 'Ни царапины', desc: 'Проживи 40 секунд без урона', need: 40, reward: 42, type: 'noDamage', time: true }),
  },
  {
    id: 'grow', build: (g) => {
      const target = clamp(g.player.tier + 1, 2, CFG.land.player.maxTier);
      return { name: 'Расти, зверь', desc: `Достигни размера ${target}`, need: 1, reward: 46, type: 'reachTier', tier: target };
    },
  },
  {
    id: 'night', build: () => ({ name: 'Ночной дозор', desc: 'Убей 2 зверей в темноте', need: 2, reward: 48, type: 'killsNight' }),
  },
  {
    id: 'species', build: (g, rng) => {
      const sp = rng.pick([LAND_SPECIES_BY_ID.hoof, LAND_SPECIES_BY_ID.singer, LAND_SPECIES_BY_ID.cliffram, LAND_SPECIES_BY_ID.krab]);
      return { name: `Знакомство: ${sp.name}`, desc: `Подружись с видом «${sp.name}»`, need: 1, reward: 52, type: 'alliedSpecies', species: sp.id };
    },
  },
];

export class LandQuestSystem {
  constructor(game) {
    this.game = game;
    this.seed = (game.seed ^ 0x51ab) >>> 0;
    this.rng = new RNG(this.seed);
    this.side = [];
    this.recent = [];
    this.doneCount = 0;
    this.events = { noDamageT: 0 };
    this.last = {};
    for (let i = 0; i < 3; i++) this.addSide();
  }

  // ---- цель стадии: считается из мира, а не хранится
  stageGoal() {
    const g = this.game, p = g.player;
    const sworn = p.flags.sworn ?? 0;
    const need = CFG.land.social.swornCount;
    if (p.tier < 3) {
      return { text: `Осмотреться: вырасти до размера 3 (сейчас ${p.tier})`, progress: p.tier, need: 3 };
    }
    const allied = Object.values(p.sympathy).filter((s) => s.allied).length;
    if (sworn >= need) return { text: 'Стая собрана — стадия пройдена', progress: need, need };
    if (allied === 0 && !p.flags.tyrantKilled) {
      return { text: 'Найти общий язык: познакомься с первым видом (кнопка «Общение»)', progress: 0, need: 1 };
    }
    return {
      text: `Собери стаю: приведи союзные виды к тотему (${sworn}/${need}) — или убей Ящера-владыку`,
      progress: sworn, need,
    };
  }

  init() { /* пул уже собран в конструкторе */ }

  update(dt) {
    const p = this.game.player;
    // «никогда не получал урон» — сбрасывается уроном
    if (this.game.time - p.lastDamageAt < 1.2) this.events.noDamageT = 0;
    else this.events.noDamageT += dt;

    for (const m of this.side) {
      if (m.done) { m.replaceT -= dt; continue; }
      this.progress(m);
    }
    this.side = this.side.filter((m) => !(m.done && m.replaceT <= 0));
    while (this.side.filter((m) => !m.done).length < 3) {
      const added = this.addSide();
      if (!added) break;
    }
  }

  progress(m) {
    const g = this.game, p = g.player;
    switch (m.type) {
      case 'eatPlant': m.progress = p.counters.fruits; break;
      case 'killAny': m.progress = p.counters.kills; break;
      case 'killFamily': m.progress = p.counters.killsByFamily?.[m.family] ?? 0; break;
      case 'killsNight': m.progress = p.counters.killsNight; break;
      case 'drink': m.progress = p.counters.drinks; break;
      case 'social': m.progress = p.counters.socialWins; break;
      case 'bones': m.progress = p.counters.bones; break;
      case 'eggs': m.progress = p.counters.eggs; break;
      case 'evolve': m.progress = p.counters.evolves ?? 0; break;
      case 'alliesTotal': m.progress = Object.values(p.sympathy).filter((s) => s.allied).length; break;
      case 'alliedSpecies': m.progress = p.sympathy[m.species]?.allied ? 1 : 0; break;
      case 'visitBiome': m.progress = p.flags.visited?.[m.biome] ? 1 : 0; break;
      case 'reachTier': m.progress = p.tier >= m.tier ? 1 : 0; break;
      case 'noDamage': m.progress = this.events.noDamageT; break;
      default: break;
    }
    if (m.progress >= m.need) this.complete(m);
  }

  complete(m) {
    if (m.done) return;
    m.done = true;
    m.progress = m.need;
    m.replaceT = 5;
    this.doneCount++;
    const bonus = 1 + this.doneCount * 0.05;
    const reward = Math.round(m.reward * bonus);
    landGainDna(this.game, reward, 'quest');
    this.game.emit('questDone', { mission: m, reward });
  }

  addSide() {
    const g = this.game;
    const pool = SIDE_POOL.filter((d) => !this.recent.includes(d.id) && !this.side.some((m) => m.defId === d.id && !m.done));
    if (!pool.length) return null;
    const def = this.rng.pick(pool);
    const m = def.build(g, this.rng);
    Object.assign(m, { defId: def.id, progress: 0, done: false, replaceT: 0, id: def.id + '_' + Math.floor(this.rng.next() * 1e6) });
    this.side.push(m);
    this.recent.push(def.id);
    if (this.recent.length > 7) this.recent.shift();
    return m;
  }

  // Данные для интерфейса
  list() {
    const sg = this.stageGoal();
    const stage = { id: 'stage', name: 'Цель стадии', desc: sg.text, progress: sg.progress, need: sg.need, main: true, kind: 'stage' };
    return [stage, ...this.side.map((m) => ({
      id: m.id, name: m.name, desc: m.desc, reward: m.reward,
      progress: Math.floor(Math.min(m.progress, m.need)), need: m.need, done: m.done,
    }))];
  }

  serialize() {
    return { side: this.side, recent: this.recent, doneCount: this.doneCount, seed: this.rng.s };
  }

  deserialize(data, seed) {
    if (!data) return;
    this.side = data.side ?? [];
    this.recent = data.recent ?? [];
    this.doneCount = data.doneCount ?? 0;
    if (seed) this.rng = new RNG(seed);
  }
}
