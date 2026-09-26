// meta.js — внежизненный прогресс: достижения, глобальная ДНК, бестиарий, сохранения.
// Жизнь клетки заканчивается, прогресс вида — нет.

import { CFG } from './config.js';
import { SPECIES } from './species.js';

// Достижения проверяются раз в секунду: просто, надёжно, без спагетти из обработчиков.
export const MILESTONES = [
  { id: 'ms_first_blood', name: 'Первая плоть', desc: 'Съесть или убить первое существо.', reward: 10, cond: (g) => g.player.counters.kills >= 1 },
  { id: 'ms_scav', name: 'Санитар', desc: 'Съесть 25 кусков падали.', reward: 15, cond: (g) => (g.player.counters.chunks ?? 0) >= 25 },
  { id: 'ms_armor', name: 'Твёрдая броня', desc: 'Съесть 25 кусков падали — и понять, как устроен панцирь. Открывает хитиновую мантию.', reward: 20, cond: (g) => (g.player.counters.chunks ?? 0) >= 25 },
  { id: 'ms_veggie', name: 'Вегетарианец', desc: 'Съесть 80 растительных частиц.', reward: 20, cond: (g) => g.player.counters.plants >= 80 },
  { id: 'ms_sprint', name: 'Спринтер', desc: 'Совершить 150 рывков. Открывает гидроскелет.', reward: 20, cond: (g) => (g.player.flags.dodge ?? 0) >= 150 },
  { id: 'ms_hunter', name: 'Хищник', desc: 'Убить 40 существ.', reward: 30, cond: (g) => g.player.counters.kills >= 40 },
  { id: 'ms_night', name: 'Ночной охотник', desc: 'Убить 20 существ в темноте.', reward: 25, cond: (g) => g.player.counters.killsNight >= 20 },
  { id: 'ms_apex', name: 'Высший хищник', desc: 'Убить альфа-особь (гигантеуса или иного исполина).', reward: 45, cond: (g) => !!g.player.counters.alphaKills },
  { id: 'ms_giant', name: 'Пожиратель гигантов', desc: 'Убить Левиафана реликтового.', reward: 90, cond: (g) => !!g.player.flags.bossKilled },
  { id: 'ms_sonic', name: 'Эхолокатор', desc: 'Оглушить 12 существ звуковой волной. Открывает звуковой орган.', reward: 25, cond: (g) => (g.player.counters.stunHits ?? 0) >= 12 },
  { id: 'ms_electric', name: 'Электрический разряд', desc: 'Убить 20 существ разрядом. Открывает электроциты.', reward: 30, cond: (g) => (g.player.counters.shockKills ?? 0) >= 20 },
  { id: 'ms_dance', name: 'Язык танца', desc: 'Подружиться с 5 разными видами.', reward: 35, cond: (g) => Object.keys(g.player.flags.danceSpecies ?? {}).length >= 5 },
  { id: 'ms_symbiosis', name: 'Симбиоз', desc: 'Закончить жизнь с тремя союзниками. Открывает родословную «Симбионт».', reward: 40, cond: (g) => g.countAllies() >= 3 },
  { id: 'ms_swarm', name: 'Повелитель стаи', desc: 'Собрать 6 союзников одновременно.', reward: 45, cond: (g) => g.countAllies() >= 6 },
  { id: 'ms_cache', name: 'Коллекционер', desc: 'Найти 5 кладок ДНК.', reward: 25, cond: (g) => (g.player.counters.caches ?? 0) >= 5 },
  { id: 'ms_relic1', name: 'Древний ген', desc: 'Собрать первый реликтовый ген.', reward: 20, cond: (g) => g.player.relicGenes >= 1 },
  { id: 'ms_relic3', name: 'Наследник древних', desc: 'Собрать три реликтовых гена.', reward: 55, cond: (g) => g.player.relicGenes >= 3 },
  { id: 'ms_storm', name: 'Сквозь бурю', desc: 'Пережить приливный шторм вне гнезда.', reward: 25, cond: (g) => !!g.player.flags.stormSurvived },
  { id: 'ms_deep', name: 'Бездна', desc: 'Побывать в зоне Бездны.', reward: 15, cond: (g) => !!g.player.flags.visitedAbyss },
  { id: 'ms_tier10', name: 'Совершенство', desc: 'Достичь десятого размера.', reward: 65, cond: (g) => g.player.tier >= 10 },
  { id: 'ms_pacifist', name: 'Пацифист', desc: 'Достичь размера 7, не убив ни одного существа.', reward: 55, cond: (g) => g.player.tier >= 7 && g.player.counters.kills === 0 },
  { id: 'ms_nohit', name: 'Скользкий', desc: 'Достичь размера 5, получив меньше 40 урона за жизнь.', reward: 35, cond: (g) => g.player.tier >= 5 && g.player.counters.dmgTaken < 40 },
  { id: 'ms_win', name: 'Стадия пройдена', desc: 'Донести три древних гена в гнездо.', reward: 120, cond: (g) => g.won },
];


// Достижения стадии суши. Часть из них открывает новые части тела и дорожки развития —
// ровно так же, как подводные достижения открывают органеллы и родословную «Симбионт».
export const LAND_MILESTONES = [
  { id: 'land_first_step', name: 'Первый шаг', desc: 'Съесть первый плод на земле.', reward: 12, stage: 'land', cond: (g) => (g.player.counters.fruits ?? 0) >= 1 },
  { id: 'land_armor', name: 'Костяной панцирь', desc: 'Съесть 10 древних костей. Открывает костяные пластины.', reward: 26, stage: 'land', cond: (g) => (g.player.counters.bones ?? 0) >= 10 },
  { id: 'land_grow5', name: 'Крупный зверь', desc: 'Достичь пятого размера на суше.', reward: 40, stage: 'land', cond: (g) => g.player.tier >= 5 },
  { id: 'land_titan', name: 'Титан', desc: 'Достичь восьмого размера. Открывает дорожку «Титан».', reward: 70, stage: 'land', cond: (g) => g.player.tier >= 8 },
  { id: 'land_drink', name: 'Не забывай пить', desc: 'Напиться у водоёма 10 раз.', reward: 20, stage: 'land', cond: (g) => (g.player.counters.drinks ?? 0) >= 10 },
  { id: 'land_drought', name: 'Сквозь засуху', desc: 'Пережить засуху с водой в теле.', reward: 30, stage: 'land', cond: (g) => !!g.player.flags.droughtSurvived },
  { id: 'land_rain', name: 'Дождевая вода', desc: 'Напиться под дождём.', reward: 18, stage: 'land', cond: (g) => !!g.player.flags.rainDrunk },
  { id: 'land_night', name: 'Ночной зверь', desc: 'Провести ночь на земле.', reward: 24, stage: 'land', cond: (g) => !!g.player.flags.nightSurvived },
  { id: 'land_social1', name: 'Язык зверей', desc: 'Провести первое удачное знакомство.', reward: 22, stage: 'land', cond: (g) => (g.player.counters.socialWins ?? 0) >= 1 },
  { id: 'land_social10', name: 'Посол', desc: 'Провести 10 удачных знакомств.', reward: 45, stage: 'land', cond: (g) => (g.player.counters.socialWins ?? 0) >= 10 },
  { id: 'land_ally', name: 'Первая стая', desc: 'Завести первый союзный вид.', reward: 40, stage: 'land', cond: (g) => Object.values(g.player.sympathy ?? {}).some((s) => s.allied) },
  { id: 'land_ally3', name: 'Вожак', desc: 'Завести три союзных вида.', reward: 60, stage: 'land', cond: (g) => Object.values(g.player.sympathy ?? {}).filter((s) => s.allied).length >= 3 },
  { id: 'land_sworn', name: 'Клятва стаи', desc: 'Привести три союзных вида к тотему — победа без крови.', reward: 130, stage: 'land', cond: (g) => g.won && g.winReason === 'sworn' },
  { id: 'land_tyrant', name: 'Конец владыки', desc: 'Убить Ящера-владыку.', reward: 130, stage: 'land', cond: (g) => !!g.player.flags.tyrantKilled },
  { id: 'land_glide', name: 'Планер', desc: 'Воспользоваться планированием 5 раз. Открывает крылья.', reward: 34, stage: 'land', cond: (g) => (g.player.counters.glides ?? 0) >= 5 },
  { id: 'land_eggs', name: 'Гнездокрад', desc: 'Утащить 5 яиц из кладок.', reward: 28, stage: 'land', cond: (g) => (g.player.counters.eggs ?? 0) >= 5 },
  { id: 'land_pacifist', name: 'Мирный зверь', desc: 'Достичь пятого размера, не убив ни одного зверя.', reward: 60, stage: 'land', cond: (g) => g.player.tier >= 5 && g.player.counters.kills === 0 },
  { id: 'land_storm', name: 'Хозяин скал', desc: 'Побывать в скалах.', reward: 16, stage: 'land', cond: (g) => !!g.player.flags.visitedRock },
];

const DEFAULT_SETTINGS = {
  quality: 'medium',
  audio: true,
  music: true,
  haptics: true,
  showHints: true,
  autoDash: false,
  autoBite: false,
  sens: 'normal',          // чувствительность виртуального стика
  leftHanded: false,
  screenShake: true,
};

export const ALL_MILESTONES = [...MILESTONES, ...LAND_MILESTONES];

export class Meta {
  constructor() {
    this.data = {
      version: CFG.version,
      dna: 0,
      upgrades: { startDna: 0, hardy: 0 },
      ach: [],
      codex: [],
      settings: { ...DEFAULT_SETTINGS },
      stats: { runs: 0, wins: 0, bestTier: 1, bestTime: 0, totalKills: 0, deaths: 0 },
      save: null,
    };
    this.achSet = new Set();
    this.codexSet = new Set();
    this.load();
    this.achSet = new Set(this.data.ach);
    this.codexSet = new Set(this.data.codex);
  }

  get settings() { return this.data.settings; }
  // Объекты-совместители: движок ждёт от них has()/add().
  get ach() { return this.achSet; }
  get codex() { return this.codexSet; }

  addDna(n) { this.data.dna = Math.max(0, this.data.dna + Math.round(n)); }

  newMilestones(game) {
    const out = [];
    // достижения суши проверяются только в стадии суши и наоборот: условия разные
    const pool = game.stage === 'land' ? LAND_MILESTONES : MILESTONES;
    for (const m of pool) {
      if (this.achSet.has(m.id)) continue;
      let ok = false;
      try { ok = m.cond(game); } catch { ok = false; }
      if (ok) { this.achSet.add(m.id); out.push(m); this.addDna(m.reward); }
    }
    if (out.length) this.save();
    return out;
  }

  onRunEnd(game, { won }) {
    // Итог жизни подводится ровно один раз: движок и интерфейс зовут этот метод оба.
    if (this._runEnded) return;
    this._runEnded = true;
    const p = game.player;
    const st = this.data.stats;
    st.runs++;
    if (won) st.wins++;
    st.bestTier = Math.max(st.bestTier, p.tier);
    st.bestTime = Math.max(st.bestTime, p.runTime);
    st.totalKills += p.counters.kills;
    if (!won) st.deaths++;
    // за жизнь тоже платят: древние гены (в океане), присягнувшие виды (на суше) и рост
    const relics = p.relicGenes ?? p.flags?.sworn ?? 0;
    this.addDna(relics * 12 + p.tier * 3 + (won ? 60 : 0) + Math.floor(p.counters.kills / 6));
    this.data.save = null;
    this.save();
  }

  // -------- Внутрисессионное сохранение («Продолжить погружение») --------
  beginRun() { this._runEnded = false; }

  saveRun(game) {
    try {
      this.data.save = game.serialize();
      this.save();
      return true;
    } catch (e) { console.warn('Не удалось сохранить', e); return false; }
  }
  hasRun() { return !!this.data.save; }
  clearRun() { this.data.save = null; this.save(); }

  save() {
    try {
      this.data.ach = [...this.achSet];
      this.data.codex = [...this.codexSet];
      localStorage.setItem(CFG.saveKey, JSON.stringify(this.data));
    } catch (e) { console.warn('Сохранение недоступно', e); }
  }

  load() {
    try {
      const raw = localStorage.getItem(CFG.saveKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.data = {
        ...this.data, ...parsed,
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
        stats: { ...this.data.stats, ...(parsed.stats ?? {}) },
        upgrades: { ...this.data.upgrades, ...(parsed.upgrades ?? {}) },
      };
    } catch (e) { console.warn('Профиль повреждён, начинаем заново', e); }
  }

  reset() {
    this.data.ach = []; this.data.codex = []; this.data.dna = 0;
    this.data.upgrades = { startDna: 0, hardy: 0 };
    this.data.stats = { runs: 0, wins: 0, bestTier: 1, bestTime: 0, totalKills: 0, deaths: 0 };
    this.data.save = null;
    this.achSet = new Set(); this.codexSet = new Set();
    this.save();
  }

  // -------- Наследие: покупки за глобальную ДНК --------
  static LEGACY = [
    { id: 'startDna', name: 'Богатая спора', desc: '+15 стартовой ДНК за уровень', max: 3, cost: [60, 140, 280] },
    { id: 'hardy', name: 'Плотная оболочка', desc: '+12 стартового здоровья за уровень', max: 3, cost: [70, 160, 300] },
  ];

  buyLegacy(id) {
    const def = Meta.LEGACY.find((l) => l.id === id);
    if (!def) return { ok: false, msg: 'Неизвестное улучшение' };
    const lvl = this.data.upgrades[id] ?? 0;
    if (lvl >= def.max) return { ok: false, msg: 'Максимальный уровень' };
    const cost = def.cost[lvl];
    if (this.data.dna < cost) return { ok: false, msg: `Нужно ${cost} глобальной ДНК` };
    this.data.dna -= cost;
    this.data.upgrades[id] = lvl + 1;
    this.save();
    return { ok: true, msg: `${def.name} — уровень ${lvl + 1}` };
  }

  codexEntries() {
    return SPECIES.map((s) => ({
      ...s,
      seen: this.codexSet.has(s.id),
      killed: this.codexSet.has(s.id),
    }));
  }
}
