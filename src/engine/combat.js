/**
 * Бой флотов: от 1×1 до 3×3 одним движком.
 *
 * Три принципа.
 *
 * 1. ПРОЗРАЧНОСТЬ. Каждый бросок пишется в журнал вместе с формулой и выпавшим
 *    числом: «50% ×1,41 ÷1,12 = 62,9% | бросок 43,1 → попадание». Игрок всегда
 *    может проверить решение движка и увидеть, где его обмануло случайностью, а
 *    где — сборкой. Если значение уперлось в пол или потолок, это тоже в журнале.
 *
 * 2. ВРЕМЯ, А НЕ ОЧЕРЕДЬ ХОДОВ. У каждого корабля счётчик готовности; ходит тот,
 *    у кого он обнулился, после чего сбрасывается на интервал ÷ темп. Скорость
 *    решает, кто начнёт, темп — как часто будет стрелять. Это разные
 *    характеристики, и обе видно в проекции очереди на несколько ходов вперёд.
 *
 * 3. СТАТУСЫ ВЛИЯЮТ НА СБОРКУ. ЭМИ глушит конкретный модуль — его множители
 *    выпадают из цепочки на глазах. Коррозия ест броню. Поджог ждёт прочностью,
 *    минуя щит. Модульная сборка поэтому уязвима не абстрактно, а поимённо.
 */

import { TICK_INTERVAL, hitChance, absorbChance, critChance, statusChance, armorDivisor, fmtNum } from './stats.js';
import { makeRng } from './rng.js';
import { computeStats, installedModules } from './ship.js';
import { SPECIALS } from './modules.js';

let uidSeq = 0;

// ---------------------------------------------------------------------------
//  Создание боя
// ---------------------------------------------------------------------------

export function makeUnit(ship, sideId) {
  const c = computeStats(ship);
  const maxHull = c.stats.hull;
  const maxShield = c.stats.shield;
  return {
    uid: `${ship.uid}:${sideId}:${++uidSeq}`,
    ship, sideId,
    name: ship.name,
    maxHull, maxShield,
    hull: Math.max(1, Math.min(ship.hull ?? maxHull, maxHull)),
    shield: maxShield,          // щит перед боем поднят
    cooldown: TICK_INTERVAL / Math.max(0.05, c.stats.speed),
    statuses: [],
    disabled: new Set(),        // модули, заглушённые ЭМИ
    stats: c.stats, chain: c.chain, fx: c.fx, adds: c.adds,
    spentOvercharge: false,
    spentSurge: false,
    acted: 0,
    alive: true,
  };
}

export function createBattle({ seed = 'battle', mine = [], foes = [], mode = '1v1' } = {}) {
  const b = {
    seed, mode,
    rng: makeRng(seed),
    tick: 0,
    action: 0,
    actionsSinceDeath: 0,
    units: [],
    log: [],
    over: null,
    shots: 0, hits: 0,
    pending: null,           // чей ход и кого можно выбрать
  };
  for (const s of mine) b.units.push(makeUnit(s, 'mine'));
  for (const s of foes) b.units.push(makeUnit(s, 'foes'));
  // Прочность корабля переносится из забега в бой и обратно: ремонт между
  // боями не автоматический, иначе потеря не имела бы веса.
  for (const u of b.units) u.ship.hull = u.hull;
  return b;
}

export const sideOf = (u) => u.sideId;
export const enemySideOf = (id) => (id === 'mine' ? 'foes' : 'mine');

export function unitsOf(b, sideId) { return b.units.filter((u) => u.sideId === sideId); }
export function aliveUnits(b, sideId) { return b.units.filter((u) => u.sideId === sideId && u.alive); }
export function isAlive(u) { return u && u.alive; }
export function enemiesOf(b, u) { return b.units.filter((x) => x.alive && x.sideId !== u.sideId); }
export function findUnit(b, uid) { return b.units.find((u) => u.uid === uid) || null; }

export function log(b, text, kind = 'info') {
  b.log.push({ n: b.log.length + 1, text, kind });
  return text;
}

// ---------------------------------------------------------------------------
//  Статусы
// ---------------------------------------------------------------------------

/**
 * Предел затяжного боя и эскалация после него.
 *
 * Без этого бой может не кончиться никогда: ремонт переживает урон, броня
 * делит его на ноль целых, обе стороны мажут с 5%-ного пола — и движок крутит
 * пустые действия. На 40-м действии без единой потери реакторы начинают
 * перегреваться: каждый следующий ход действует корабль себе в убыток, и
 * убыток растёт. Развязка гарантирована, а игрок видит причину в журнале.
 */
export const STALEMATE_ACTIONS = 40;
/** После этой длины бой перегревается независимо от того, кто и когда погибал. */
export const BATTLE_ACTION_CAP = 200;

/**
 * Урон перегрева.
 *
 * Двух источников мало одного: счётчик «действий без потерь» обнуляется на
 * каждой гибели, а в плотной перестрелке 3×3 гибель происходит часто — бой
 * тянулся сотнями действий и никогда не кончался, если стороны были равны.
 * Поэтому длинный бой греется и по общему числу действий тоже.
 */
/**
 * Доля полной прочности, которую выжигает перегрев за одно действие.
 *
 * Считается долей, а не плоским числом: плоский урон в 10–25 единиц толстый
 * корпус линкора просто не замечал, бой тянулся сотнями действий, победителя
 * не появлялось — и забег застревал на узле, который не стоил ни жизни, ни
 * прочности. Доля растёт линейно и на 32-м действии перегрева доходит до
 * половины корпуса за ход: развязка гарантирована в пределах ~60 действий.
 */
export function overheatShare(b) {
  const idle = b.actionsSinceDeath - STALEMATE_ACTIONS;
  const long = Math.ceil((b.action - BATTLE_ACTION_CAP) / 2);
  const over = Math.max(idle, long);
  if (over <= 0) return 0;
  return Math.min(0.5, 0.02 + over * 0.015);
}

export function overheatDamage(b, u) {
  const share = overheatShare(b);
  if (share <= 0 || !u || !u.alive) return 0;
  return Math.max(1, Math.round(u.maxHull * share));
}

export const STATUS_INFO = {
  ignite:  { name: 'Поджог',   icon: '🔥', text: 'Жжёт прочность в начале хода, минуя щит. Складывается до трёх раз.' },
  emp:     { name: 'ЭМИ',      icon: '⚡', text: 'Глушит один модуль: его множители выпадают из расчёта.' },
  corrode: { name: 'Коррозия', icon: '🧪', text: 'Разъедает броню: каждый слой — прочность брони ×0,75.' },
};

export function statusOf(u, id) { return u.statuses.find((s) => s.id === id) || null; }

/** Сопротивление особым свойством: иммунитет полностью отменяет статус. */
export function immuneTo(u, id) {
  if (id === 'ignite' && u.fx.firewall) return true;
  if (id === 'emp' && u.fx.faraday) return true;
  if (id === 'corrode' && u.fx.inox) return true;
  return false;
}

/**
 * Наложить статус. Возвращает описание для журнала — отказ тоже описывается,
 * иначе «не сработало» неотличимо от «движок забыл».
 */
export function applyStatus(b, target, id, stacks = 1, turns = 3, causeName = '') {
  if (!target.alive) return null;
  if (immuneTo(target, id)) {
    log(b, `  ${STATUS_INFO[id].icon} ${target.name}: не действует — ${SPECIAL_NAME(target, id)}.`, 'good');
    return null;
  }
  const existing = statusOf(target, id);
  if (existing) {
    if (id === 'ignite') {
      existing.stacks = Math.min(3, existing.stacks + stacks);
      existing.turns = Math.max(existing.turns, turns);
      log(b, `  ${STATUS_INFO[id].icon} ${target.name}: поджог усилен до ${existing.stacks} сл. (${existing.turns} х.).`, 'bad');
    } else {
      existing.turns = Math.max(existing.turns, turns);
      log(b, `  ${STATUS_INFO[id].icon} ${target.name}: ${STATUS_INFO[id].name} продлён (${existing.turns} х.).`, 'bad');
    }
    return existing;
  }
  const st = { id, stacks, turns };
  if (id === 'emp') {
    const candidates = installedModules(target.ship).filter((m) => !target.disabled.has(m.uid));
    if (!candidates.length) {
      log(b, `  ⚡ ${target.name}: глушить нечего, все модули уже отключены.`, 'info');
      return null;
    }
    const victim = candidates[Math.floor(b.rng.next() * candidates.length)];
    st.moduleUid = victim.uid;
    st.moduleName = victim.name;
    target.disabled.add(victim.uid);
    refresh(b, target);
    log(b, `  ⚡ ${target.name}: заглушен модуль «${victim.name}» — его множители выпали из расчёта.`, 'bad');
  } else {
    log(b, `  ${STATUS_INFO[id].icon} ${target.name}: ${STATUS_INFO[id].name}${causeName ? ` от «${causeName}»` : ''}, ${stacks} сл., ${turns} х.`, 'bad');
  }
  target.statuses.push(st);
  refresh(b, target);
  return st;
}

function SPECIAL_NAME(u, id) {
  if (id === 'ignite') return 'противопожарная переборка';
  if (id === 'emp') return 'клетка Фарадея';
  return 'нержавеющая обшивка';
}

/**
 * Пересчитать характеристики: статусы и глушение меняют их на месте.
 * Вызывается после любого изменения — иначе цепочка разъедется с числом.
 */
export function refresh(b, u) {
  const c = computeStats(u.ship, { disabled: u.disabled });
  const stats = { ...c.stats };
  const corrode = statusOf(u, 'corrode');
  if (corrode) stats.armor = Math.max(0.05, stats.armor * Math.pow(0.75, corrode.stacks));
  const foes = enemiesOf(b, u).length;
  if (c.fx.lastStand && u.hull < 0.25 * u.maxHull) stats.rate *= 1.5;
  if (c.fx.duelist && foes === 1) stats.accuracy *= 1.2;
  if (c.fx.swarm && foes > 1) stats.salvo += 1;
  u.stats = stats; u.chain = c.chain; u.fx = c.fx; u.adds = c.adds;
  return stats;
}

// ---------------------------------------------------------------------------
//  Очередь действий
// ---------------------------------------------------------------------------

/** Кто ходит следующим. Счётчики всем уменьшаем на время ожидания. */
export function advance(b) {
  if (b.over) return null;
  const alive = b.units.filter((u) => u.alive);
  if (!alive.length) return null;
  let best = null;
  for (const u of alive) if (!best || u.cooldown < best.cooldown || (u.cooldown === best.cooldown && u.stats.speed > best.stats.speed)) best = u;
  const wait = Math.max(0, best.cooldown);
  for (const u of alive) u.cooldown -= wait;
  b.tick += wait;
  best.cooldown = TICK_INTERVAL / Math.max(0.05, best.stats.rate);
  best.acted++;
  b.action++;
  b.actionsSinceDeath++;
  return best;
}

/**
 * Проекция очереди на n ходов вперёд — БЕЗ изменения боя.
 * Интерфейс показывает порядок заранее: темп и скорость перестают быть
 * абстрактными числами, когда видно, что следующий ваш ход будет третьим.
 */
export function upcoming(b, n = 6) {
  const sim = b.units.filter((u) => u.alive).map((u) => ({ u, cd: u.cooldown }));
  const out = [];
  let t = b.tick;
  while (out.length < n && sim.length) {
    let best = null;
    for (const s of sim) if (!best || s.cd < best.cd) best = s;
    const wait = Math.max(0, best.cd);
    for (const s of sim) s.cd -= wait;
    t += wait;
    out.push({ unit: best.u, at: t });
    best.cd = TICK_INTERVAL / Math.max(0.05, best.u.stats.rate);
  }
  return out;
}

// ---------------------------------------------------------------------------
//  Урон
// ---------------------------------------------------------------------------

export function damageHull(b, u, amount, sourceName = '', kind = 'урон') {
  if (!u.alive || amount <= 0) return 0;
  const dealt = Math.min(u.hull, amount);
  // Избыток сверх смертельного порога копится: по нему считается сохранность
  // трофеев. Влито лишнего — снял с обломков меньше целых модулей.
  u.excess = (u.excess || 0) + Math.max(0, amount - dealt);
  u.hull -= dealt;
  u.ship.hull = u.hull;
  if (u.hull <= 0) {
    u.alive = false;
    u.hull = 0;
    b.actionsSinceDeath = 0;
    log(b, `💥 ${u.name} — корпус разрушен${sourceName ? `, источник «${sourceName}»` : ''}. Корабль потерян.`, u.sideId === 'mine' ? 'bad' : 'good');
    checkOver(b);
  } else if (kind !== 'тихий') {
    log(b, `  · ${u.name}: прочность −${fmtNum(dealt, 1)} (${fmtNum(u.hull, 0)}/${u.maxHull}).`, 'neutral');
  }
  return dealt;
}

export function damageShield(b, u, amount) {
  if (!u.alive || amount <= 0 || u.shield <= 0) return 0;
  const dealt = Math.min(u.shield, amount);
  u.shield -= dealt;
  if (u.shield <= 0) log(b, `  ◇ ${u.name}: щит пробит и опустел.`, u.sideId === 'mine' ? 'bad' : 'good');
  return dealt;
}

export function repairHull(b, u, amount) {
  if (!u.alive || amount <= 0) return 0;
  const healed = Math.min(u.maxHull - u.hull, amount);
  u.hull += healed;
  u.ship.hull = u.hull;
  if (healed > 0) log(b, `  ✚ ${u.name}: ремонт +${fmtNum(healed, 1)} (${fmtNum(u.hull, 0)}/${u.maxHull}).`, 'good');
  return healed;
}

// ---------------------------------------------------------------------------
//  Залп
// ---------------------------------------------------------------------------

/** Начало собственного хода: статусы, течь, самовозгорание, ремонт, щит. */
export function beginAction(b, u) {
  const events = [];
  // обратный отсчёт статусов
  for (const s of u.statuses.slice()) {
    s.turns--;
    if (s.turns <= 0) {
      if (s.id === 'emp' && s.moduleUid) u.disabled.delete(s.moduleUid);
      u.statuses = u.statuses.filter((x) => x !== s);
      log(b, `  ○ ${u.name}: ${STATUS_INFO[s.id].name} прекратился.`, u.sideId === 'mine' ? 'good' : 'bad');
      refresh(b, u);
    }
  }
  // поджог ждёт прочностью, минуя щит
  const ignite = statusOf(u, 'ignite');
  if (ignite) {
    const dmg = 3 + 2 * ignite.stacks;
    log(b, `  🔥 ${u.name}: горит, −${dmg} прочности мимо щита.`, 'bad');
    damageHull(b, u, dmg, 'поджог');
    events.push('ignite');
    if (!u.alive) return events;
  }
  // течь
  if (u.fx.leak) {
    log(b, `  💧 ${u.name}: течь, −4 прочности.`, 'bad');
    damageHull(b, u, 4, 'течь');
    events.push('leak');
    if (!u.alive) return events;
  }
  // самовозгорание
  if (u.fx.pyromaniac) {
    const chance = 0.12;
    const r = b.rng.roll(chance);
    log(b, `  🎲 самовозгорание ${Math.round(chance * 100)}% | бросок ${fmtNum(r.value * 100, 1)} → ${r.hit ? 'вспышка' : 'обошлось'}`, r.hit ? 'bad' : 'info');
    if (r.hit) { applyStatus(b, u, 'ignite', 1, 3, 'собственная проводка'); events.push('pyromaniac'); }
  }
  // аварийный щит: один раз за бой
  if (u.fx.surge && !u.spentSurge && u.maxShield > 0 && u.shield <= 0) {
    u.spentSurge = true;
    u.shield = Math.floor(u.maxShield / 2);
    log(b, `  ⚡ ${u.name}: аварийный щит восстановлен до ${u.shield}.`, 'good');
    events.push('surge');
  }
  // ремонт
  if (u.stats.repair > 0 && u.hull < u.maxHull) {
    repairHull(b, u, u.stats.repair);
    events.push('repair');
  }
  // короткое замыкание: пропуск хода
  if (u.fx.shortCircuit) {
    const chance = 0.1;
    const r = b.rng.roll(chance);
    log(b, `  🎲 короткое замыкание ${Math.round(chance * 100)}% | бросок ${fmtNum(r.value * 100, 1)} → ${r.hit ? 'ход потерян' : 'в порядке'}`, r.hit ? 'bad' : 'info');
    if (r.hit) events.push('skip');
  }
  return events;
}

/** Сколько выстрелов в залпе с учётом перегрузки и роевика. */
export function volleySize(b, u) {
  // Перегрузка не меняет число выстрелов, она удваивает урон первого залпа.
  return Math.max(1, Math.round(u.stats.salvo));
}

/**
 * Полный ход корабля: залп по цели.
 * Возвращает список выстрелов для интерфейса.
 */
export function performAction(b, u, target) {
  if (!u || !u.alive) return { ok: false, reason: 'Корабль не в строю.' };
  if (!target || !target.alive) return { ok: false, reason: 'Цель уже уничтожена.' };
  if (target.sideId === u.sideId) return { ok: false, reason: 'Нельзя стрелять по своим.' };

  refresh(b, u);
  const events = beginAction(b, u);
  if (!u.alive) return { ok: true, skipped: true, events };
  if (events.includes('skip')) return { ok: true, skipped: true, events };

  // перегрев в затяжном бою: действует себе в убыток
  const heat = overheatDamage(b, u);
  if (heat > 0) {
    if (!b.__heatWarned) {
      b.__heatWarned = true;
      log(b, '🌡 Реакторы перегреты: бой затянулся, каждый ход теперь жжёт собственный корпус.', 'bad');
    }
    log(b, `  🌡 ${u.name}: перегрев, −${heat} прочности.`, 'bad');
    damageHull(b, u, heat, 'перегрев');
    if (!u.alive) return { ok: true, skipped: true, events };
  }

  const shots = [];
  const n = volleySize(b, u);
  const overcharged = u.fx.overcharge && !u.spentOvercharge;
  if (overcharged) {
    u.spentOvercharge = true;
    log(b, `  ⚡ ${u.name}: перегрузка реактора — первый залп бьёт вдвое сильнее.`, 'good');
  }
  log(b, `⚔ ${u.name} даёт залп (${n} выстр.) по ${target.name}.`, u.sideId === 'mine' ? 'good' : 'bad');

  for (let i = 0; i < n; i++) {
    let cur = target;
    if (!cur.alive) {
      // цель развалилась в середине залпа: остаток уходит по ближайшей живой
      const rest = enemiesOf(b, u);
      if (!rest.length) break;
      cur = rest[0];
      log(b, `  ↪ цель уничтожена, остаток залпа перенесён на ${cur.name}.`, 'info');
    }
    shots.push(fireShot(b, u, cur, { overcharged, index: i + 1, total: n }));
    if (b.over) break;
  }
  refresh(b, u);
  checkOver(b);
  return { ok: true, shots, events };
}

/** Один выстрел: попадание → крит → поглощение щитом → урон → статусы. */
export function fireShot(b, actor, target, opts = {}) {
  const result = { hit: false, crit: false, absorbed: false, damage: 0, statuses: [], target: target.uid, rolls: [] };
  b.shots++;

  // 1. попадание
  const hit = hitChance(actor.stats, target.stats);
  const hitRoll = b.rng.roll(hit.p);
  result.rolls.push({ step: 'попадание', formula: hit.formula, value: hitRoll.value, ok: hitRoll.hit });
  log(b, `  🎲 попадание: ${hit.formula} | бросок ${fmtNum(hitRoll.value * 100, 1)} → ${hitRoll.hit ? 'ПОПАЛ' : 'промах'}`, hitRoll.hit ? 'info' : 'neutral');
  if (!hitRoll.hit) return result;
  b.hits++;
  result.hit = true;

  // 2. крит
  const crit = critChance(actor.stats);
  let isCrit = false;
  if (crit.p > 0) {
    const critRoll = b.rng.roll(crit.p);
    isCrit = critRoll.hit;
    result.rolls.push({ step: 'крит', formula: `${Math.round(crit.p * 100)}%`, value: critRoll.value, ok: critRoll.hit });
    if (isCrit) log(b, `  ✷ критическое попадание (${Math.round(crit.p * 100)}% | бросок ${fmtNum(critRoll.value * 100, 1)}).`, 'bad');
  }
  result.crit = isCrit;

  // 3. базовый урон с видимым разбросом
  const spread = b.rng.float(0.9, 1.1);
  let dmg = actor.stats.damage * spread * (opts.overcharged ? 2 : 1);
  result.rolls.push({ step: 'разброс', formula: `±10%`, value: spread, ok: true });
  if (isCrit) {
    // «Хрупкая обшивка» цели усиливает крит, «толстая шкура» — гасит.
    let mult = actor.stats.critDmg;
    if (target.fx.brittle) mult = Math.max(mult, 2.5);
    if (target.fx.thickSkin) mult = Math.max(1, mult / 1.5);
    dmg *= mult;
  }

  // 4. поглощение щитом
  if (target.shield > 0) {
    const abs = absorbChance(target.stats, actor.stats);
    const absRoll = b.rng.roll(abs.p);
    result.rolls.push({ step: 'щит', formula: abs.formula, value: absRoll.value, ok: absRoll.hit });
    log(b, `  🎲 поглощение щитом: ${abs.formula} | бросок ${fmtNum(absRoll.value * 100, 1)} → ${absRoll.hit ? 'щит принял' : 'пробил щит'}`, absRoll.hit ? 'neutral' : 'info');
    if (absRoll.hit) {
      result.absorbed = true;
      const taken = damageShield(b, target, dmg);
      result.damage = taken;
      if (!b.over) checkOver(b);
      applyShotStatuses(b, actor, target, result);
      return result;
    }
  }

  // 5. урон по корпусу через броню
  const div = armorDivisor(target.stats);
  const before = dmg;
  dmg = dmg / div;
  result.rolls.push({ step: 'броня', formula: `÷${fmtNum(div, 2)}`, value: div, ok: true });
  // Знак делителя обязателен: броня 0,72 урон УВЕЛИЧИВАЕТ, и без «÷» это
  // читается как ошибка движка, а не как пробитая обшивка.
  if (Math.abs(div - 1) > 0.001) log(b, `  🧱 броня ÷${fmtNum(div, 2)}: ${fmtNum(before, 1)} → ${fmtNum(dmg, 1)}.`, 'neutral');

  const dealt = damageHull(b, target, dmg, actor.name);
  result.damage = dealt;

  // 6. мародёрский контур: ремонт от нанесённого урона
  if (actor.fx.vampire && dealt > 0) {
    const heal = Math.max(1, Math.round(dealt * 0.06));
    repairHull(b, actor, heal);
  }

  applyShotStatuses(b, actor, target, result);
  return result;
}

/** Статус, характеристика проки и характеристика сопротивления — один список
 *  на выстрел и на предпросмотр, чтобы они не могли разойтись. */
export const STATUS_PAIRS = [
  ['ignite', 'igniteChance', 'igniteRes'],
  ['emp', 'empChance', 'empRes'],
  ['corrode', 'corrodeChance', 'corrodeRes'],
];

/**
 * Предпросмотр залпа: что случится, если выстрелить сейчас по этой цели.
 *
 * Интерфейс обязан показывать ровно те числа, которые бросит бой, поэтому
 * предпросмотр не «считает похоже», а зовёт те же функции: hitChance,
 * critChance, absorbChance, armorDivisor, statusChance. Расхождение картинки
 * с боем было бы обманом игрока, а вся игра построена на видимых 50%.
 *
 * Бросков не делает и состояние боя не меняет: это чтение.
 */
export function shotPreview(b, actor, target) {
  if (!b || !actor || !target) return null;
  const hit = hitChance(actor.stats, target.stats);
  const crit = critChance(actor.stats, actor.chain && actor.chain.crit);
  const absorb = target.shield > 0 ? absorbChance(target.stats, actor.stats) : null;
  const armorDiv = armorDivisor(target.stats);
  const volley = volleySize(b, actor);
  const overcharged = Boolean(actor.fx.overcharge) && !actor.spentOvercharge;

  // Множитель крита тот же, что в выстреле: «хрупкая обшивка» цели усиливает,
  // «толстая шкура» — гасит.
  let critMult = actor.stats.critDmg;
  if (target.fx.brittle) critMult = Math.max(critMult, 2.5);
  if (target.fx.thickSkin) critMult = Math.max(1, critMult / 1.5);

  const divisor = Math.max(0.01, armorDiv);
  const per = actor.stats.damage * (overcharged ? 2 : 1);
  const statuses = [];
  for (const [id, stat, res] of STATUS_PAIRS) {
    const power = actor.stats[stat] || 0;
    if (power <= 0) continue;
    statuses.push({
      id,
      name: STATUS_INFO[id].name,
      chance: statusChance(actor.stats, target.stats, stat, res),
      blocked: immuneTo(target, id),
    });
  }

  return {
    hit, crit, absorb, armorDiv, volley, overcharged,
    statuses,
    dmg: {
      min: (per * 0.9) / divisor,
      max: (per * 1.1) / divisor,
      crit: (per * 1.1 * critMult) / divisor,
      // ожидаемый урон одного выстрела: щит может забрать его целиком
      expect: hit.p * (per / divisor) * (absorb ? (1 - absorb.p) : 1),
    },
  };
}

function applyShotStatuses(b, actor, target, result) {
  if (!target.alive) return;
  for (const [id, stat, res] of STATUS_PAIRS) {
    const power = actor.stats[stat] || 0;
    if (power <= 0) continue;
    const chance = statusChance(actor.stats, target.stats, stat, res);
    const roll = b.rng.roll(chance.p);
    result.rolls.push({ step: id, formula: chance.formula, value: roll.value, ok: roll.hit });
    log(b, `  🎲 ${STATUS_INFO[id].name}: ${chance.formula} | бросок ${fmtNum(roll.value * 100, 1)} → ${roll.hit ? 'сработал' : 'не сработал'}`, roll.hit ? 'bad' : 'neutral');
    if (roll.hit) {
      applyStatus(b, target, id, 1, id === 'emp' ? 2 : 3, actor.name);
      result.statuses.push(id);
    }
  }
}

// ---------------------------------------------------------------------------
//  Отход
// ---------------------------------------------------------------------------

/**
 * Отход из боя.
 *
 * Без отхода четыре жизни — это приговор: при 36% поражений длинный забег
 * математически обречён, и игрок не решает, а доигрывает. Отход возвращает
 * решение ему: выйти можно, но стоит это четверти оставшейся прочности, узел
 * остаётся непройденным и трофеев нет. Жизнь при этом сохраняется.
 *
 * Ограничение одно — нельзя отойти в тот же момент, когда корабль уже
 * уничтожен: бой к этому времени завершён.
 */
export const RETREAT_HULL_COST = 0.20;

export function canRetreat(b, sideId = 'mine') {
  if (b.over) return { ok: false, reason: 'Бой уже окончен.' };
  if (!aliveUnits(b, sideId).length) return { ok: false, reason: 'Отходить нечем: флот уничтожен.' };
  return { ok: true, reason: '' };
}

/**
 * Чем отход обойдётся каждому кораблю — до того, как игрок нажал кнопку.
 *
 * Цена считается от ПОЛНОЙ прочности, а не от текущей: иначе отход дешевел бы
 * с каждой попыткой и превращался в кнопку бессмертия — флот уходил бы в
 * бесконечный пинг-понг «отход → ремонт → отход», и забег не кончался никогда.
 */
export function retreatCost(b, sideId = 'mine') {
  return aliveUnits(b, sideId).map((u) => {
    const cost = Math.max(1, Math.round(u.maxHull * RETREAT_HULL_COST));
    return {
      uid: u.ship.uid, name: u.name,
      hull: u.hull, maxHull: u.maxHull, cost,
      after: Math.max(0, u.hull - cost),
      lost: u.hull - cost <= 0,
    };
  });
}

/**
 * Увести флот из боя. Жизнь цела, трофеев нет, узел остаётся непройденным —
 * но каждый корабль теряет четверть полной прочности и МОЖЕТ не пережить
 * отход. Если флот погиб целиком, это поражение: жизнь списывается.
 */
export function retreat(b, sideId = 'mine') {
  const check = canRetreat(b, sideId);
  if (!check.ok) return check;
  const foe = sideId === 'mine' ? 'foes' : 'mine';
  for (const u of aliveUnits(b, sideId)) {
    const cost = Math.max(1, Math.round(u.maxHull * RETREAT_HULL_COST));
    log(b, `🚀 ${u.name} отходит под огнём: −${cost} полной прочности.`, 'bad');
    damageHull(b, u, cost, 'отход под огнём', 'тихий');
  }
  const survivors = aliveUnits(b, sideId).length;
  if (survivors === 0) {
    // Отход оказался гибелью: это поражение, а не спасение.
    b.over = { winner: foe, retreated: null, reason: 'Флот не пережил отход: корпуса разрушены на выходе из боя.' };
    log(b, `🏁 Отход не удался — флот потерян. Жизнь списана.`, 'bad');
    return { ok: true, lost: true };
  }
  b.over = { winner: foe, retreated: sideId, reason: 'Флот отошёл, сохранив жизнь.' };
  log(b, `🏁 Отход: бой прекращён, жизни не потрачены. Узел остался непройденным.`, 'bad');
  return { ok: true, lost: false };
}

// ---------------------------------------------------------------------------
//  Завершение
// ---------------------------------------------------------------------------

export function checkOver(b) {
  if (b.over) return b.over;
  const mine = aliveUnits(b, 'mine').length;
  const foes = aliveUnits(b, 'foes').length;
  if (!mine && !foes) b.over = { winner: 'draw', reason: 'Обе стороны потеряли все корабли одновременно.' };
  else if (!foes) b.over = { winner: 'mine', reason: 'Флот противника уничтожен.' };
  else if (!mine) b.over = { winner: 'foes', reason: 'Ваш флот уничтожен.' };
  if (b.over) {
    log(b, `🏁 Бой окончен: ${b.over.winner === 'mine' ? 'победа' : b.over.winner === 'foes' ? 'поражение' : 'ничья'}. ${b.over.reason}`, b.over.winner === 'mine' ? 'good' : 'bad');
    // прочность выживших переносится обратно в забег
    for (const u of b.units) if (u.alive) u.ship.hull = u.hull;
  }
  return b.over;
}

/**
 * Итог боя для наград: кто выжил, сколько урона нанесено, и главное —
 * перегруз. Чем больше лишнего урона влито в корпус, тем меньше шансов снять
 * с обломков целые модули: точная стрельба вознаграждается лутом.
 */
export function battleReport(b, sideId) {
  const foes = unitsOf(b, enemySideOf(sideId));
  let overkill = 0, total = 0;
  for (const u of foes) {
    total += u.maxHull;
    // урон сверх смертельного порога считается перегрузом
    if (!u.alive) overkill += Math.max(0, (u.excess || 0));
  }
  return {
    winner: b.over?.winner || null,
    retreated: b.over?.retreated || null,
    survived: aliveUnits(b, sideId).map((u) => ({ uid: u.ship.uid, hull: u.hull, maxHull: u.maxHull })),
    wrecks: foes.filter((u) => !u.alive).map((u) => u.ship),
    overkillRatio: total > 0 ? Math.min(1, overkill / total) : 0,
    shots: b.shots, hits: b.hits,
    accuracy: b.shots ? b.hits / b.shots : 0,
    rounds: b.action,
  };
}
