/**
 * Корпус, слоты и расчёт итоговых характеристик.
 *
 * Характеристика = база корпуса × произведение множителей установленных модулей
 * + плоские добавки. Произведение хранится ЦПОЧКОЙ: для каждой характеристики
 * видно, какой модуль и во сколько раз её сдвинул. Это не украшение — на этом
 * держится и прозрачность боя (тот же вывод чисел), и замысел мультимножителей:
 * два модуля на ×1,3 точности дают ×1,69, а не +0,6.
 *
 * Модуль может быть ВЫКЛЮЧЕН (ЭМИ-глушение) — тогда его аффиксы и особое
 * свойство не участвуют в расчёте, а цепочка показывает пропуск.
 */

import { STATS, STAT_KEYS, fmtMult, fmtNum } from './stats.js';
import { SPECIALS, SLOTS, SLOT_KEYS } from './modules.js';

let slotSeq = 0;

export const HULLS = {
  interceptor: {
    key: 'interceptor', name: 'Перехватчик', icon: '✦',
    desc: 'Стеклянная пушка: первым открывается и первым же рассыпается.',
    stats: { hull: 65, shield: 20, armor: 0.85, accuracy: 1.05, evasion: 1.35, damage: 9, salvo: 2, rate: 1.3, speed: 1.5, crit: 0.12, critDmg: 1.6, shieldBlock: 1, pierce: 1.1, repair: 0 },
    slots: { weapon: 2, shield: 1, armor: 1, engine: 2, reactor: 1, utility: 1 },
  },
  corvette: {
    key: 'corvette', name: 'Корвет', icon: '◆',
    desc: 'Уставная середина: без провалов и без чудес.',
    stats: { hull: 100, shield: 40, armor: 1, accuracy: 1, evasion: 1, damage: 12, salvo: 2, rate: 1, speed: 1, crit: 0.1, critDmg: 1.5, shieldBlock: 1, pierce: 1, repair: 0 },
    slots: { weapon: 2, shield: 1, armor: 2, engine: 1, reactor: 1, utility: 1 },
  },
  frigate: {
    key: 'frigate', name: 'Фрегат', icon: '▲',
    desc: 'Три ствола и реакторный отсек: ставка на залп.',
    stats: { hull: 125, shield: 45, armor: 1.1, accuracy: 1.02, evasion: 0.95, damage: 14, salvo: 3, rate: 0.9, speed: 0.9, crit: 0.1, critDmg: 1.5, shieldBlock: 1, pierce: 1.05, repair: 0 },
    slots: { weapon: 3, shield: 1, armor: 2, engine: 1, reactor: 2, utility: 1 },
  },
  cruiser: {
    key: 'cruiser', name: 'Крейсер', icon: '⬢',
    desc: 'Толстый щитовой пояс, двенадцать слотов, нетороплив.',
    stats: { hull: 165, shield: 75, armor: 1.3, accuracy: 0.98, evasion: 0.9, damage: 13, salvo: 2, rate: 0.85, speed: 0.75, crit: 0.08, critDmg: 1.5, shieldBlock: 1.15, pierce: 1, repair: 1 },
    slots: { weapon: 2, shield: 2, armor: 3, engine: 1, reactor: 2, utility: 2 },
  },
  battleship: {
    key: 'battleship', name: 'Линкор', icon: '⬣',
    desc: 'Пятнадцать слотов: мультимножители здесь складываются страшнее всего.',
    stats: { hull: 230, shield: 95, armor: 1.5, accuracy: 0.95, evasion: 0.8, damage: 20, salvo: 2, rate: 0.7, speed: 0.6, crit: 0.06, critDmg: 1.5, shieldBlock: 1.2, pierce: 1.1, repair: 2 },
    slots: { weapon: 4, shield: 2, armor: 3, engine: 1, reactor: 3, utility: 2 },
  },
};
export const HULL_KEYS = Object.keys(HULLS);

/** Список слотов корпуса: каждый — отдельная ячейка с типом. */
// Список слотов корпуса неизменяем, а спрашивают его постоянно: каждый
// пересчёт характеристик идёт через installedModules → slotList. Без кэша это
// десятки тысяч выброшенных объектов за забег (профиль показывал 5% времени
// на сборке мусора), поэтому считаем один раз на корпус и замораживаем.
const HULL_SLOTS_CACHE = new Map();

export function hullSlots(hullKey) {
  const key = HULLS[hullKey] ? hullKey : 'corvette';
  const hit = HULL_SLOTS_CACHE.get(key);
  if (hit) return hit;
  const hull = HULLS[key];
  const out = [];
  for (const slot of SLOT_KEYS) {
    const n = hull.slots[slot] || 0;
    for (let i = 0; i < n; i++) out.push(Object.freeze({ id: `${slot}${i}`, slot, index: i }));
  }
  Object.freeze(out);
  HULL_SLOTS_CACHE.set(key, out);
  return out;
}

export function makeShip(hullKey, name = 'Корабль') {
  const hull = HULLS[hullKey] || HULLS.corvette;
  const ship = {
    uid: `ship${++slotSeq}`,
    name,
    hullKey: hull.key,
    installed: {},   // id слота → модуль
    cargo: [],       // модули в трюме, не установленные
    hull: 0, shield: 0,
    statuses: [],
    spentFirstSalvo: false,
    spentSurge: false,
  };
  ship.hull = hull.stats.hull;
  ship.shield = hull.stats.shield;
  return ship;
}

export function slotList(ship) { return hullSlots(ship.hullKey); }

export function freeSlots(ship) {
  return slotList(ship).filter((s) => !ship.installed[s.id]);
}

export function moduleIn(ship, slotId) { return ship.installed[slotId] || null; }

/**
 * Поставить модуль в слот.
 * Тип слота обязан совпадать: орудийный модуль не встаёт в двигательный —
 * иначе сборка вырождается в «всё лучшее в один корпус».
 */
export function install(ship, module, slotId) {
  if (!module) return { ok: false, reason: 'Нет модуля.' };
  const slot = slotList(ship).find((s) => s.id === slotId);
  if (!slot) return { ok: false, reason: 'Нет такого слота.' };
  if (slot.slot !== module.slot) {
    return { ok: false, reason: `Модуль «${SLOTS[module.slot].name.toLowerCase()}» не встаёт в слот «${SLOTS[slot.slot].name.toLowerCase()}».` };
  }
  // Модуль мог уже стоять в другом слоте этого же корабля (перенос weapon0 →
  // weapon1). Без уборки старого слота один модуль оказывался установленным
  // дважды:installedModules считал его два раза, а характеристики множились.
  for (const s of slotList(ship)) {
    if (s.id !== slotId && ship.installed[s.id] && ship.installed[s.id].uid === module.uid) {
      delete ship.installed[s.id];
    }
  }
  const prev = ship.installed[slotId];
  if (prev && prev.uid !== module.uid) ship.cargo.push(prev);
  ship.installed[slotId] = module;
  ship.cargo = ship.cargo.filter((m) => m.uid !== module.uid);
  return { ok: true, replaced: prev && prev.uid !== module.uid ? prev : null };
}

export function uninstall(ship, slotId) {
  const m = ship.installed[slotId];
  if (!m) return { ok: false, reason: 'Слот пуст.' };
  delete ship.installed[slotId];
  ship.cargo.push(m);
  return { ok: true, module: m };
}

/** Все установленные модули (для трофеев и подсчёта свойств). */
export function installedModules(ship) {
  return slotList(ship).map((s) => ship.installed[s.id]).filter(Boolean);
}

/**
 * Итоговые характеристики + цепочки множителей + набор особых свойств.
 *
 * @param {object} ship
 * @param {object} opts { disabled: Set<uid> } — выключенные ЭМИ модули
 * @returns {{stats:object, chain:object, fx:object, disabledCount:number}}
 */
export function computeStats(ship, opts = {}) {
  const hull = HULLS[ship.hullKey] || HULLS.corvette;
  const disabled = opts.disabled instanceof Set ? opts.disabled : new Set(opts.disabled || []);
  // Плоский режим: только числа, без цепочек множителей. Цепочки нужны
  // объяснению «почему получилось 1,15» в интерфейсе, а сравнение сборок
  // (shipPower, autoEquip) вызывает пересчёт сотни раз подряд — на нём и
  // сгорало время: 20 массивов и по объекту на каждый множитель за вызов.
  const plain = Boolean(opts.plain);
  const chain = {};
  const adds = {};
  const mults = {};
  for (const k of STAT_KEYS) { adds[k] = 0; mults[k] = 1; if (!plain) chain[k] = []; }

  const fx = {};
  let disabledCount = 0;

  for (const m of installedModules(ship)) {
    if (disabled.has(m.uid)) { disabledCount++; continue; }
    for (const a of m.affixes) {
      if (mults[a.key] === undefined) continue;   // неизвестная характеристика
      if (a.kind === 'mult') {
        mults[a.key] *= a.value;
        if (!plain) chain[a.key].push({ label: m.name, mult: a.value, uid: m.uid });
      } else {
        adds[a.key] += a.value;
      }
    }
    if (m.special && m.special.id) {
      // Свойство без id (битое сохранение, самодельный модуль) не должно
      // создавать мусорный ключ fx.undefined — интерфейс отрисовал бы его
      // как неизвестное особое свойство.
      fx[m.special.id] = true;
      // «Перевес» — единственное особое свойство, которое само меняет число.
      if (m.special.id === 'heavy') {
        mults.speed *= 1 / 1.25;
        if (!plain) chain.speed.push({ label: m.name, mult: 1 / 1.25, uid: m.uid });
      }
      if (m.special.id === 'parasite') {
        mults.repair *= 0;
        if (!plain) chain.repair.push({ label: m.name, mult: 0, uid: m.uid, note: 'ремонт отключён' });
      }
    }
  }

  const stats = {};
  for (const k of STAT_KEYS) {
    const base = hull.stats[k] ?? STATS[k].base;
    const mult = mults[k];
    const raw = base * mult + adds[k];
    let v = raw;
    // Каждое округление и каждый предел попадают в цепочку. Без этого итог не
    // сходился бы с множителями на глазах у игрока: «база 2 ×1,217 = 2» выглядит
    // как обман, пока не сказано, что выстрелы бывают только целыми.
    const limits = [];
    // Заметка нужна только когда расхождение ВИДНО: округление 104,99999 до 105
    // не меняет числа на экране, а подпись «105 → 105» выглядела бы как шум.
    const differs = (a, b) => Math.abs(a - b) > 0.005;
    if (k === 'salvo') {
      v = Math.max(1, Math.round(raw));
      if (differs(v, raw)) limits.push(`выстрелы целые: ${fmtNum(raw, 2)} → ${v}`);
    }
    if (k === 'hull' || k === 'shield') {
      v = Math.max(1, Math.round(raw));
      if (differs(v, raw)) limits.push(`округление до целого: ${fmtNum(raw, 2)} → ${v}`);
    }
    if (STATS[k].percent && STATS[k].kind !== 'zero') {
      const capped = Math.max(0, Math.min(0.95, v));
      if (differs(capped, v)) limits.push(`потолок вероятности: ${fmtNum(v * 100, 1)}% → ${fmtNum(capped * 100, 1)}%`);
      v = capped;
    }
    if (STATS[k].kind === 'ratio' && k !== 'pierce') {
      const floored = Math.max(0.05, v);
      if (differs(floored, v)) limits.push(`пол ${fmtNum(0.05, 2)}: ${fmtNum(v, 2)} → ${fmtNum(floored, 2)}`);
      v = floored;
    }
    stats[k] = v;
    if (!plain) {
      for (const text of limits) chain[k].push({ label: 'предел', mult: null, text, limit: true });
    }
  }
  // «Паразитный контур» обнуляет ремонт целиком, а не множит: множитель ×0
  // гасит базу, но плоские добавки пережили бы его, и игрок увидел бы в цепочке
  // «×0 (Паразитный контур)», а в итоге — ненулевой ремонт. Поэтому зануление
  // показано отдельной заметкой.
  if (fx.parasite) {
    if (!plain && Math.abs(stats.repair) > 0.005) {
      chain.repair.push({
        label: 'предел',
        mult: null,
        limit: true,
        text: `паразитный контур обнуляет ремонт вместе с плоскими добавками: ${fmtNum(stats.repair, 2)} → 0`,
      });
    }
    stats.repair = 0;
  }
  // Особые свойства, меняющие бой ситуативно, считаются в бою, а не здесь.
  return { stats, chain: plain ? null : chain, adds, fx, disabledCount };
}

/** Множитель характеристики одним числом (без базы) — для сравнений. */
export function totalMult(chainEntry) {
  return chainEntry.reduce((acc, t) => acc * t.mult, 1);
}

/**
 * Человекочитаемая цепочка: «база 1 ×1,36 (Зоркий Рельсотрон) ÷1,18 (Обшивка
 * Износа) = 1,15». Плоские добавки идут последними, потому что прибавляются
 * уже к произведению.
 */
/**
 * Привести прочность и щит корабля к его собственным пределам.
 *
 * Пределы заданы не корпусом, а корпусом вместе с модулями: «Разрядная
 * бронеплита» поднимает потолок, «Гасящий дефлектор» — опускает. Если этого не
 * сделать, корабль оказывается прочнее самого себя, и расхождение всплывает в
 * бою: makeUnit обрезает прочность до потолка молча. Для игрока это выглядело
 * бы как лишние хиты на полосе, которых на самом деле нет, — то самое спрятанное
 * число, которого в игре быть не должно.
 *
 * @param {object} ship корабль
 * @param {object} opts { full } — full ставит полный корпус и щит: так приходят
 *   новые корабли (старт забега, покупка, собранный противник). Без full значения
 *   только опускаются до потолка — бесплатного ремонта перестановка не даёт.
 */
export function fitToLimits(ship, { full = false, computed = null } = {}) {
  const c = computed || computeStats(ship, { plain: true });
  if (full) {
    ship.hull = c.stats.hull;
    ship.shield = c.stats.shield;
    return ship;
  }
  ship.hull = Math.max(0, Math.min(ship.hull ?? 0, c.stats.hull));
  ship.shield = Math.max(0, Math.min(ship.shield ?? 0, c.stats.shield));
  return ship;
}

/**
 * База характеристики до модулей: её задаёт корпус, а если корпус про неё
 * молчит — общая база из таблицы характеристик.
 *
 * Отдельная функция нужна, чтобы интерфейс показывал ровно то же число, с
 * которого начинает считать движок: расхождение здесь сразу выглядело бы как
 * «спрятанный множитель».
 */
export function statBase(ship, stat) {
  const hull = HULLS[ship.hullKey] || HULLS.corvette;
  return hull.stats[stat] ?? STATS[stat].base ?? 0;
}

export function explainStat(ship, stat, computed) {
  // Плоский результат (без цепочек) для объяснения не годится — пересчитываем.
  const c = computed && computed.chain ? computed : computeStats(ship);
  const base = statBase(ship, stat);
  const parts = [`база ${fmtNum(base, 2)}`];
  for (const t of c.chain[stat] || []) {
    // слагаемые с mult === null — это округления и пределы, у них свой текст
    parts.push(t.mult === null || t.mult === undefined ? t.text : `${fmtMult(t.mult)} (${t.label})`);
  }
  const add = c.adds?.[stat] || 0;
  if (add) parts.push(`${add > 0 ? '+' : '−'}${fmtNum(Math.abs(add), 2)}`);
  return `${parts.join(' ')} = ${fmtNum(c.stats[stat], 2)}`;
}

/** Сводка особых свойств корабля. */
export function specialList(ship, computed) {
  const c = computed || computeStats(ship);
  return Object.keys(c.fx).map((id) => ({ id, ...SPECIALS[id] }));
}

// ---------------------------------------------------------------------------
//  Мощность сборки и автоподбор
// ---------------------------------------------------------------------------

/**
 * Грубая мощность корабля: геометрическое среднее урона в секунду и
 * эффективной прочности. Именно геометрическое — арифметическое позволило бы
 * «сборке из одного урона» выигрывать сравнение у сбалансированной, а в бою
 * такая умирает первой, не успев выстрелить.
 */
export function shipPower(ship) {
  const s = computeStats(ship, { plain: true }).stats;
  const dps = Math.max(0.01, s.damage * s.salvo * s.rate * Math.min(0.95, 0.5 * s.accuracy));
  const ehp = Math.max(0.01, (s.hull + s.shield) * s.armor * (1 + (s.evasion - 1) * 0.3));
  return Math.sqrt(dps * ehp);
}

/**
 * Жадный автоподбор модулей: освобождает слоты и по одному ставит то, что
 * сильнее всего поднимает мощность корабля.
 *
 * Не оптимально (перебор всех раскладок экспоненциален), но честно: функция
 * та же, которой пользуется бот в тестах баланса, поэтому «предложить сборку»
 * в интерфейсе не подсунет игроку другой алгоритм, чем меряет баланс.
 *
 * @param {object} ship корабль
 * @param {Array} pool доступные модули (трюм + уже установленные)
 * @returns {{installed:number, powerBefore:number, powerAfter:number}}
 */
export function autoEquip(ship, pool) {
  const powerBefore = shipPower(ship);
  const slots = hullSlots(ship);
  // Пул обязан быть множеством. Вызывающая сторона легко передаёт один и тот же
  // модуль дважды — например, трюм корабля плюс общий трюм флота, который этот
  // корабль уже включает. Функция в конце перезаписывает ship.cargo остатком
  // пула, поэтому дубликаты РАЗМНОЖАЛИ модули: трюм удваивался на каждый вызов,
  // а подбор деградировал в квадратичную (14 млн пересчётов на 93 подбора).
  const seen = new Set();
  const available = [];
  const offer = (m) => {
    if (!m) return;
    const key = m.uid === undefined || m.uid === null ? m : 'uid:' + m.uid;
    if (seen.has(key)) return;
    seen.add(key);
    available.push(m);
  };
  for (const m of pool || []) offer(m);
  // Снятые с корабля модули идут в тот же пул — и тоже через устранение
  // дублей: модуль, который вызывающая сторона передала и в пуле, и на
  // корабле, иначе попадал в трюм дважды и размножался на каждом вызове.
  for (const s of slots) {
    const m = ship.installed[s.id];
    if (m) { delete ship.installed[s.id]; offer(m); }
  }
  let installed = 0;
  for (const s of slots) {
    let best = null, bestPower = 0;
    for (const m of available) {
      if (m.slot !== s.slot) continue;
      ship.installed[s.id] = m;
      const p = shipPower(ship);
      delete ship.installed[s.id];
      if (p > bestPower) { bestPower = p; best = m; }
    }
    if (best) { ship.installed[s.id] = best; available.splice(available.indexOf(best), 1); installed++; }
  }
  ship.cargo = available.filter((m) => !Object.values(ship.installed).includes(m));
  return { installed, powerBefore, powerAfter: shipPower(ship) };
}
