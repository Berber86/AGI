// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — battle.js
//  Боевой движок в духе MTG: энергия по ходам, выставка юнитов, объявление
//  атакующих и блокеров, Первый удар, Топот, Броня, Жизнеотдача, Смертельный
//  удар, Осадный/Захват, триггеры «при выходе» и «при гибели», статусы
//  (горение, яд, коррозия), усталость от пустой колоды и внезапная смерть.
//
//  Всё детерминировано от сида: один и тот же бой можно переиграть.
// =============================================================================

import { eraOf, KEYWORDS } from './gears.js';
import { makeRng } from './rng.js';
import { effectiveBlueprint, vetTier } from './units.js';

let UID = 1;
export const resetUid = () => { UID = 1; };
const uid = (p = 'u') => `${p}${UID++}`;

// ---------------------------------------------------------------------------
//  Создание боевой единицы из юнита ростера (или из токена)
// ---------------------------------------------------------------------------
export function makeBattleUnit(src, owner) {
  const bp = src.blueprint ? effectiveBlueprint(src) : src;
  return {
    uid: uid('b'),
    owner,
    srcId: src.id || null,          // id юнита в ростере (для опыта после боя)
    name: bp.name,
    atk: bp.atk,
    hp: bp.hp,
    cost: bp.cost,
    era: bp.era,
    domain: bp.domain,
    rarity: bp.rarity,
    rarityColor: bp.rarityColor,
    archetype: bp.archetype,
    gears: bp.gears || [],
    gearCounts: bp.gearCounts || {},
    keywords: (bp.keywords || []).map((k) => ({ ...k })),
    blurb: bp.blurb || '',
    // --- боевое состояние ---
    counters: { atk: 0, hp: 0 },
    damage: 0,
    sick: false,
    exhausted: false,
    burning: 0,
    poisoned: 0,
    token: !!src.token,
    regenUsed: false,
    recallUsed: false,
    survivedCombat: false,
    fx: {},
    lvl: src.blueprint ? vetTier(src) : 0,
  };
}

export function aggregateFx(u) {
  u.fx = {};
  for (const k of u.keywords) {
    if (k.fx === 'statBoost') continue; // уже вшито в atk/hp на этапе генерации
    u.fx[k.fx] = (u.fx[k.fx] || 0) + (k.lvl || 1);
  }
  return u.fx;
}

export function makeToken(owner, era, atk = 1, hp = 1, name = 'Ополченец') {
  const t = makeBattleUnit({
    token: true,
    blueprint: { name, atk, hp, cost: 1, era, domain: 'order', rarity: 'common', rarityColor: '#b9b9b9',
      archetype: 'Строй', gears: [], gearCounts: {}, keywords: [], blurb: 'Токен: живая масса эпохи.' },
  }, owner);
  t.token = true;
  aggregateFx(t);
  return t;
}

// ---------------------------------------------------------------------------
//  Создание боя
// ---------------------------------------------------------------------------
export function createBattle(cfg) {
  const era = cfg.era;
  const cfgEra = eraOf(era);
  const rng = makeRng(cfg.seed ?? Date.now());
  const b = {
    id: uid('bat'),
    era, cfg: cfgEra, rng,
    seed: cfg.seed ?? 0,
    round: 1,
    active: cfg.first ?? 'me',
    first: cfg.first ?? 'me',
    phase: 'idle',
    over: null,
    attacking: [],
    blockers: {},          // attackerUid -> [blockerUid]
    awaitingBlocks: false,
    log: [],
    sides: {},
    context: cfg.context || null,
  };
  for (const sideId of ['me', 'foe']) {
    const src = cfg.sides[sideId];
    const units = src.deck.map((inst) => { const u = makeBattleUnit(inst, sideId); aggregateFx(u); return u; });
    b.sides[sideId] = {
      id: sideId,
      name: src.name,
      civName: src.civName || src.name,
      color: src.color || '#c8452f',
      isHuman: !!src.isHuman,
      leader: { name: src.name, hp: cfgEra.leaderHp, maxHp: cfgEra.leaderHp, armor: 0, shroud: 0 },
      deck: rng.shuffle(units),
      hand: [], board: [], grave: [],
      energy: 0, maxEnergy: 0, bonusEnergy: 0, discount: 0, fatigue: 0, turns: 0,
      tempHaste: 0,
    };
  }
  log(b, `⚔ ${b.sides.me.name} против ${b.sides.foe.name} — ${cfgEra.name}, эпоха ${era}.`, 'head');
  return b;
}

export function log(b, text, kind = 'info') {
  b.log.push({ text, kind, t: b.round });
  if (b.log.length > 400) b.log.splice(0, b.log.length - 400);
}

export const other = (id) => (id === 'me' ? 'foe' : 'me');
export const side = (b, id) => b.sides[id];
export const enemySide = (b, id) => b.sides[other(id)];

// ---------------------------------------------------------------------------
//  Вычисляемые характеристики
// ---------------------------------------------------------------------------
export function unitAtk(b, u) {
  let a = u.atk + u.counters.atk;
  const s = side(b, u.owner);
  for (const o of s.board) {
    if (o === u || !isAlive(o)) continue;
    if (o.fx.bond) a += 1;
  }
  if (u.fx.zeal && s.leader.hp * 2 <= s.leader.maxHp) a += 2;
  if (u.fx.frenzy && b.phase.startsWith('combat')) a += Math.max(0, b.attacking.filter((x) => x !== u.uid).length);
  return Math.max(0, a);
}

export function unitHp(u) { return Math.max(1, u.hp + u.counters.hp); }

export function unitArmor(u) { return u.fx.armor || 0; }

function areAdjacent(board, a, c) {
  const i = board.indexOf(a), j = board.indexOf(c);
  return i >= 0 && j >= 0 && Math.abs(i - j) === 1;
}

export function bulwarkHp(b, u) {
  const s = side(b, u.owner);
  let n = 0;
  for (const o of s.board) if (o !== u && isAlive(o) && o.fx.bulwark && areAdjacent(s.board, o, u)) n += 1;
  return n;
}

export const isAlive = (u) => !!u && !u.dead;

export function canAttack(b, u) {
  if (!isAlive(u) || u.exhausted) return false;
  if (u.sick && !(u.fx.haste || side(b, u.owner).tempHaste > 0)) return false;
  if (terrorLocked(b, u)) return false;
  return true;
}

/** «Ужас»: вражеский юнит с Психеей+Током не пускает в атаку слабых. */
export function terrorLocked(b, u) {
  if (unitAtk(b, u) > 1) return false;
  const foe = enemySide(b, u.owner);
  return foe.board.some((o) => isAlive(o) && o.fx.terror);
}

export function canBlock(b, u, attacker) {
  if (!isAlive(u) || u.exhausted) return false;
  if (u.owner === attacker.owner) return false;
  if (attacker.fx.siege && !u.fx.reach) return false;
  return true;
}

/** Сколько атакующих держит юнит: Стратег и Муштра добавляют по одному. */
export function maxBlocks(u) { return 1 + (u.fx.tactician ? 1 : 0) + (u.fx.drill ? 1 : 0); }

export function boardRoom(b, sideId) {
  return b.cfg.slots - side(b, sideId).board.filter(isAlive).length;
}

export function effectiveCost(b, u) {
  const s = side(b, u.owner);
  return Math.max(0, u.cost - (s.discount > 0 ? 1 : 0) - (b.phase.startsWith('main') && s.refineTurn === b.turnId ? 1 : 0));
}

// ---------------------------------------------------------------------------
//  Очки командования
//
//  Бюджет раунда, которым оплачиваются атакующие и блокирующие. Без него фаза
//  атаки была плоской: 42–60% атак не доносили до лидера ни единицы урона,
//  потому что защищающийся закрывал всё, а атакующему было неважно, кем бить.
//
//  Состояние намеренно ПРОИЗВОДНОЕ: ничего не копится в счётчике, бюджет и
//  трата пересчитываются из `b.cfg.cp`, досок и списков атакующих/блокирующих.
//  Иначе снятие атакующего, гибель знаменосца в середине раунда и симуляция
//  прогноза начали бы расходиться с настоящим боем.
// ---------------------------------------------------------------------------

/** Бой не должен вставать намертво: хотя бы одно очко всегда есть. */
export const MIN_CP = 1;

/** Потолок вклада аур. Без него три «Знамени» дали бы +3 и экономика раунда
 *  уехала бы в снежный ком, а прогноз перестал бы читаться. */
export const CP_AURA_CAP = 2;

/** Есть ли на стороне живой носитель fx. */
const hasAura = (b, sideId, fx) => side(b, sideId).board.some((u) => isAlive(u) && u.fx[fx]);

/**
 * Суммарный уровень ауры на стороне. Считаем уровни, а не головы: свойства в
 * этой игре растут с ветеранством и с драфтом, поэтому «Знамя II» обязано
 * отличаться от «Знамя I». Потолок CP_AURA_CAP не даёт уйти в снежный ком.
 */
function auraSum(b, sideId, fx) {
  return side(b, sideId).board.filter(isAlive).reduce((sum, u) => sum + (u.fx[fx] || 0), 0);
}

/**
 * Базовый бюджет обороны: сколько угроз сторона успевает закрыть за раунд,
 * пока её не организовали «Знамя» и «Тактик».
 *
 * Замер показал: на атаке очки командования почти не связывают бой — юнитов на
 * поле в среднем 2.1–2.6 при бюджете 3–7, поэтому атакующий и так отправляет
 * всех, кого хочет. А симптом плоского боя (42–60% фаз атаки без урона лидеру)
 * создаёт защита, которая закрывает всё. Ограничивать надо реакцию, а не
 * намерение: атака остаётся щедрой, а закрыть удаётся не каждого.
 */
export const DEF_CP_BASE = 1;

/**
 * Настраиваемый переопределитель бюджета обороны (b.cfg.cpDef).
 * Нужен не только тюнингу: без него невозможно честно замерить вклад очков
 * командования — базлайновый прогон должен уметь снять лимит и с атаки, и с
 * обороны (tools/dbg-cp.mjs ставит cp: 99 и cpDef: 99).
 */

/**
 * Бюджет стороны на этот раунд для данного режима ('attack' | 'block').
 * «Знамя» прибавляет своё, «Паника» у противника — отнимает.
 *
 * Асимметрия намеренная. Контролируемый замер (tools/dbg-cp.mjs, 60 боёв на
 * эпоху, тот же прогон с неограниченным бюджетом как базлайн) показал: атаку
 * очки командования почти не связывают — юнитов на поле в среднем 2.1–2.6 при
 * бюджете 3–7, атакующий и так отправляет всех, кого хочет. Плоский бой (42–60%
 * фаз атаки без урона лидеру) создаёт защита, закрывающая всё подряд. Узкая
 * оборона лечит симптом во всех шести эпохах сразу: бои короче (эпоха 6: 11.9
 * раунда против 14.2), урон лидеру выше базлайна (32.8 против 23.3), пустых фаз
 * меньше (53% против 61%). Ограничивать надо реакцию, а не намерение.
 *
 * Очко платится за уникального блокирующего, а не за каждое назначение, поэтому
 * «Тактик» закрывает двоих за одно очко, а «Муштра» — двоих бесплатно.
 */
export function cpBudget(b, sideId, mode = 'attack') {
  const bonus = Math.min(CP_AURA_CAP, auraSum(b, sideId, 'banner'));
  const penalty = Math.min(CP_AURA_CAP, auraSum(b, other(sideId), 'panic'));
  const own = mode === 'block' ? (b.cfg.cpDef ?? DEF_CP_BASE) : (b.cfg.cp || MIN_CP);
  return Math.max(MIN_CP, own + bonus - penalty);
}

/**
 * Цена юнита в очках командования. Дорогие юниты требуют больше внимания штаба,
 * поэтому в поздних эпохах, когда средняя стоимость карты растёт, в атаку
 * уходит меньше тел — бои становятся выборочнее, а не длиннее.
 * «Штаб» удешевляет всех своих, «Муштра» блокирует бесплатно.
 */
export function cpCost(b, u, mode = 'attack') {
  if (mode === 'block' && u.fx.drill) return 0;
  let c = 1 + (u.cost >= 6 ? 1 : 0) + (u.cost >= 9 ? 1 : 0);
  if (hasAura(b, u.owner, 'staff')) c = Math.max(1, c - 1);
  return c;
}

/** Очки, уже потраченные на объявленных атакующих. */
export function cpSpentAttack(b) {
  return attackers(b).reduce((sum, u) => sum + cpCost(b, u, 'attack'), 0);
}

/** Сколько очков осталось на атаку в этом раунде. */
export function cpLeftAttack(b) {
  return Math.max(0, cpBudget(b, b.active) - cpSpentAttack(b));
}

/**
 * Уникальные блокирующие стороны. Один юнит платит один раз, даже если держит
 * двоих атакующих: иначе «Муштра» и Стратег теряли бы смысл под бюджетом.
 */
export function uniqueBlockers(b, sideId) {
  const s = side(b, sideId);
  const ids = new Set();
  for (const list of Object.values(b.blockers)) for (const id of list) ids.add(id);
  return [...ids].map((id) => s.board.find((u) => u.uid === id)).filter((u) => u && isAlive(u));
}

/** Очки, уже потраченные на блок (без списка `extra`, который ещё только назначается). */
export function cpSpentBlock(b, sideId, exceptAttackerUid = null) {
  const s = side(b, sideId);
  const ids = new Set();
  for (const [aid, list] of Object.entries(b.blockers)) {
    if (aid === exceptAttackerUid) continue;
    for (const id of list) ids.add(id);
  }
  return [...ids]
    .map((id) => s.board.find((u) => u.uid === id))
    .filter((u) => u && isAlive(u))
    .reduce((sum, u) => sum + cpCost(b, u, 'block'), 0);
}

/** Сколько очков осталось на блок у стороны. */
export function cpLeftBlock(b, sideId, exceptAttackerUid = null) {
  return Math.max(0, cpBudget(b, sideId, 'block') - cpSpentBlock(b, sideId, exceptAttackerUid));
}

/**
 * Можно ли объявить юнита атакующим — с внятной причиной для интерфейса.
 * Снятие атакующего разрешено всегда: очки возвращаются, так как траты
 * производные.
 */
export function canDeclareAttack(b, u) {
  if (!u) return { ok: false, reason: 'Нет такого юнита.' };
  if (b.phase !== 'combatDeclare') return { ok: false, reason: 'Сейчас не фаза объявления атаки.' };
  if (b.active !== u.owner) return { ok: false, reason: 'Это не ваш ход.' };
  if (b.attacking.includes(u.uid)) return { ok: true, reason: '' };
  if (!canAttack(b, u)) return { ok: false, reason: 'Юнит не может атаковать.' };
  const cost = cpCost(b, u, 'attack');
  const left = cpLeftAttack(b);
  if (left < cost) {
    return { ok: false, reason: `Не хватает очков командования: нужно ${cost}, осталось ${left}.` };
  }
  return { ok: true, reason: '' };
}

// ---------------------------------------------------------------------------
//  Ход: начало, добор, выставление
// ---------------------------------------------------------------------------
export function startTurn(b) {
  if (b.over) return b;
  const s = side(b, b.active);
  s.turns += 1;
  b.turnId = `${b.active}${s.turns}`;
  b.phase = 'main1';
  b.attacking = [];
  b.blockers = {};
  s.discount = 0;
  s.refineTurn = null;
  s.tempHaste = 0;

  // внезапная смерть: с 20-го раунда лидеры тают
  if (b.round > 20) {
    damageLeader(b, 'me', 2, 'Внезапная смерть');
    damageLeader(b, 'foe', 2, 'Внезапная смерть');
    log(b, '☠ Эпоха выдыхается: оба лидера теряют по 2 здоровья.', 'bad');
  }

  for (const u of s.board) {
    if (!isAlive(u)) continue;
    u.exhausted = false;
    u.sick = false;
    if (u.fx.growth) { u.counters.atk += 1; u.counters.hp += 1; log(b, `🌱 ${u.name}: Рост → +1/+1.`, 'good'); }
  }

  s.maxEnergy = Math.min(b.cfg.energyCap, s.turns + s.bonusEnergy);
  s.energy = s.maxEnergy;
  s.bonusEnergy = 0;

  drawCards(b, b.active, b.cfg.draw);
  log(b, `— Ход ${s.turns}: ${s.name} (${s.energy}⚡). —`, 'head');
  cleanup(b);
  return b;
}

export function drawCards(b, sideId, n) {
  const s = side(b, sideId);
  for (let i = 0; i < n; i++) {
    if (s.hand.length >= b.cfg.handLimit) { log(b, `${s.name}: рука полна, карта сгорела.`, 'bad'); continue; }
    if (s.deck.length === 0) {
      s.fatigue += 1;
      damageLeader(b, sideId, s.fatigue, 'Усталость');
      log(b, `📉 ${s.name}: колода пуста — Усталость ${s.fatigue}.`, 'bad');
      continue;
    }
    const u = s.deck.shift();
    s.hand.push(u);
    if (sideId === 'me' || b.revealFoe) log(b, `${s.name} берёт «${u.name}».`, 'draw');
  }
}

export function canPlay(b, u) {
  if (b.over || b.active !== u.owner) return false;
  if (!b.phase.startsWith('main')) return false;
  const s = side(b, u.owner);
  if (!s.hand.includes(u)) return false;
  if (effectiveCost(b, u) > s.energy) return false;
  if (boardRoom(b, u.owner) <= 0) return false;
  return true;
}

export function playCard(b, u) {
  if (!canPlay(b, u)) return false;
  const s = side(b, u.owner);
  const cost = effectiveCost(b, u);
  s.energy -= cost;
  if (s.discount > 0) s.discount -= 1;
  s.hand = s.hand.filter((x) => x !== u);
  u.sick = !u.fx.haste;
  u.exhausted = false;
  s.board.push(u);
  log(b, `⚙ ${s.name} выставляет «${u.name}» (${u.atk}/${unitHp(u)}) за ${cost}⚡.`, u.owner === 'me' ? 'good' : 'bad');
  onEnter(b, u);
  cleanup(b);
  return true;
}

// ---------------------------------------------------------------------------
//  Триггеры «при выходе»
// ---------------------------------------------------------------------------
function onEnter(b, u) {
  const s = side(b, u.owner);
  const foe = enemySide(b, u.owner);
  const foes = () => foe.board.filter(isAlive);
  const targetable = () => foes().filter((x) => !x.fx.shroud);

  if (u.fx.etbDraw) { drawCards(b, u.owner, u.fx.etbDraw); note(b, u, `Сборка: +${u.fx.etbDraw} карта`); }
  if (u.fx.etbScry) {
    const n = u.fx.etbScry;
    const top = s.deck.slice(0, n);
    if (top.length) {
      const keep = top.reduce((a, x) => (unitPower(x) > unitPower(a) ? x : a), top[0]);
      s.deck = s.deck.filter((x) => x !== keep);
      s.hand.push(keep);
      if (u.owner === 'me') log(b, `🔭 Провидение: из ${top.map((t) => t.name).join(', ')} взято «${keep.name}».`, 'good');
      else log(b, `🔭 ${u.name}: Провидение — взята карта.`, 'bad');
    }
  }
  if (u.fx.etbCompute) {
    drawCards(b, u.owner, 2);
    if (s.hand.length) {
      const worst = s.hand.filter((x) => x !== u).reduce((a, x) => (!a || unitPower(x) < unitPower(a) ? x : a), null);
      if (worst) { s.hand = s.hand.filter((x) => x !== worst); s.grave.push(worst); worst.dead = true; log(b, `🔢 Вычисление: сброшено «${worst.name}».`, u.owner === 'me' ? 'good' : 'bad'); }
    }
  }
  if (u.fx.etbEnergy) { s.energy += u.fx.etbEnergy; note(b, u, `Логистика: +${u.fx.etbEnergy}⚡`); }
  if (u.fx.etbDiscount) { s.discount += u.fx.etbDiscount; note(b, u, 'Инженер: следующий юнит дешевле'); }
  if (u.fx.etbDrain) { foe.energy = Math.max(0, foe.energy - u.fx.etbDrain); note(b, u, `Дань: −${u.fx.etbDrain}⚡ противнику`); }
  if (u.fx.etbDiscard) {
    const n = u.fx.etbDiscard;
    for (let i = 0; i < n && foe.hand.length; i++) {
      const victim = b.rng.pick(foe.hand);
      foe.hand = foe.hand.filter((x) => x !== victim); foe.grave.push(victim); victim.dead = true;
      log(b, `📣 Пропаганда: ${foe.name} сбрасывает «${victim.name}».`, u.owner === 'me' ? 'good' : 'bad');
    }
  }
  if (u.fx.etbBlast) {
    const pool = targetable();
    if (pool.length) { const t = b.rng.pick(pool); dealDamage(b, t, u.fx.etbBlast, u, 'Взрыв'); }
    else damageLeader(b, foe.id, u.fx.etbBlast, 'Взрыв');
    note(b, u, `Взрыв ${u.fx.etbBlast}`);
  }
  if (u.fx.etbExhaust) {
    const pool = targetable();
    if (pool.length) {
      const t = pool.reduce((a, x) => (unitAtk(b, x) > unitAtk(b, a) ? x : a), pool[0]);
      t.exhausted = true; log(b, `😨 Трепет: «${t.name}» в оцепенении.`, u.owner === 'me' ? 'good' : 'bad');
    }
  }
  if (u.fx.etbStun) {
    let n = 0;
    for (const t of targetable()) if (unitAtk(b, t) <= 2) { t.exhausted = true; n++; }
    if (n) log(b, `⚡ Паралич: ${n} вражеских юнитов обездвижены.`, u.owner === 'me' ? 'good' : 'bad');
  }
  if (u.fx.etbBroadcast) { s.tempHaste = 1; note(b, u, 'Вещание: все юниты могут атаковать сейчас'); }
  if (u.fx.etbInspire) {
    let n = 0;
    for (const o of s.board) if (o !== u && isAlive(o)) { o.counters.atk += u.fx.etbInspire; o.counters.hp += u.fx.etbInspire; n++; }
    if (n) log(b, `🎖 Вдохновение: ${n} союзников получают +${u.fx.etbInspire}/+${u.fx.etbInspire}.`, u.owner === 'me' ? 'good' : 'bad');
  }
  if (u.fx.etbAdapt) {
    const n = foes().length;
    if (n) { u.counters.atk += n; u.counters.hp += n; note(b, u, `Адаптация: +${n}/+${n}`); }
  }
  if (u.fx.etbDivine) {
    healLeader(b, u.owner, u.fx.etbDivine);
    s.leader.shroud = 1;
    note(b, u, `Божественность: +${u.fx.etbDivine} лидеру`);
  }
  if (u.fx.etbFortify) { s.leader.armor += u.fx.etbFortify; note(b, u, `Укрепление: +${u.fx.etbFortify} брони лидеру`); }
  if (u.fx.etbRefine) { s.refineTurn = b.turnId; note(b, u, 'Очистка: рука дешевле на 1 в этот ход'); }
  if (u.fx.etbSwarm) {
    if (boardRoom(b, u.owner) > 0) {
      const t = makeToken(u.owner, u.era, 1, 1, 'Ополченец');
      t.sick = true;
      s.board.push(t);
      note(b, u, 'Рой: создан ополченец 1/1');
    }
  }
}

const unitPower = (u) => u.atk * 1.1 + u.hp * 0.8 + u.keywords.length * 1.5;

function note(b, u, text) {
  log(b, `  ✦ «${u.name}» — ${text}.`, u.owner === 'me' ? 'good' : 'bad');
}

// ---------------------------------------------------------------------------
//  Урон
// ---------------------------------------------------------------------------
export function damageLeader(b, sideId, amount, source = '') {
  const s = side(b, sideId);
  let dmg = Math.max(0, amount);
  if (s.leader.armor > 0) {
    const abs = Math.min(s.leader.armor, dmg);
    s.leader.armor -= abs; dmg -= abs;
    if (abs > 0) log(b, `🛡 Броня лидера ${s.name} гасит ${abs}.`, sideId === 'me' ? 'good' : 'bad');
  }
  if (dmg > 0) {
    s.leader.hp -= dmg;
    log(b, `💥 Лидер ${s.name} теряет ${dmg} здоровья (${Math.max(0, s.leader.hp)}/${s.leader.maxHp})${source ? ' — ' + source : ''}.`, sideId === 'me' ? 'bad' : 'good');
  }
  checkWin(b);
  return dmg;
}

export function healLeader(b, sideId, amount) {
  const s = side(b, sideId);
  const before = s.leader.hp;
  s.leader.hp = Math.min(s.leader.maxHp, s.leader.hp + amount);
  if (s.leader.hp > before) log(b, `✚ ${s.name}: лидер лечится на ${s.leader.hp - before}.`, sideId === 'me' ? 'good' : 'bad');
}

export function dealDamage(b, target, amount, source = null, tag = '') {
  if (!isAlive(target) || amount <= 0) return 0;
  let dmg = amount;
  const pierce = source && source.fx && source.fx.pierce;
  if (!pierce && unitArmor(target) > 0) {
    const abs = Math.min(unitArmor(target), dmg);
    dmg -= abs;
    if (abs > 0) log(b, `🛡 «${target.name}»: Броня гасит ${abs}.`, 'dim');
  }
  if (dmg <= 0 && !(source && source.fx && source.fx.deathtouch)) return 0;

  target.damage += dmg;
  if (source && source.fx) {
    if (source.fx.lifelink) healLeader(b, source.owner, dmg);
    if (source.fx.ignite && dmg > 0) { target.burning += source.fx.ignite; log(b, `🔥 «${target.name}» горит (${target.burning}).`, 'dim'); }
    if (source.fx.poison && dmg > 0) { target.poisoned += source.fx.poison; log(b, `☠ «${target.name}» отравлен (${target.poisoned}).`, 'dim'); }
    if (source.fx.corrode && dmg > 0) { target.counters.atk = Math.max(-target.atk, target.counters.atk - source.fx.corrode); log(b, `🧪 Коррозия: «${target.name}» −${source.fx.corrode} атаки.`, 'dim'); }
    if (source.fx.deathtouch && dmg > 0) target.markedDeadly = true;
    if (source.fx.thorns) { /* шипы срабатывают при получении боевого урона */ }
  }
  if (tag) log(b, `  · ${tag}: «${target.name}» получает ${dmg} урона.`, 'dim');
  checkDeath(b, target, source);
  return dmg;
}

function checkDeath(b, u, source) {
  if (!isAlive(u) || u.dead) return;
  const lethal = u.damage >= unitHp(u) || u.markedDeadly;
  if (!lethal) return;

  if (u.fx.regenerate && !u.regenUsed) {
    u.regenUsed = true; u.damage = 0; u.markedDeadly = false; u.exhausted = true;
    log(b, `🌿 «${u.name}»: Регенерация — смерть предотвращена.`, u.owner === 'me' ? 'good' : 'bad');
    return;
  }
  if (u.fx.indestructible && !u.markedDeadly && u.damage < unitHp(u) * 2) {
    u.damage = Math.max(0, unitHp(u) - 1);
    log(b, `⛨ «${u.name}»: Несокрушимость держит (нужно ${unitHp(u) * 2} суммарного урона).`, u.owner === 'me' ? 'good' : 'bad');
    return;
  }
  u.markedDeadly = false;
  destroy(b, u, source);
}

export function destroy(b, u, source = null) {
  if (u.dead) return;
  u.dead = true;
  const s = side(b, u.owner);
  s.board = s.board.filter((x) => x !== u);
  b.attacking = b.attacking.filter((x) => x !== u.uid);
  for (const k of Object.keys(b.blockers)) b.blockers[k] = b.blockers[k].filter((x) => x !== u.uid);

  if (u.fx.deathRecall && !u.recallUsed && !u.token) {
    u.recallUsed = true; u.dead = false; u.damage = 0; u.markedDeadly = false; u.exhausted = true; u.sick = true;
    s.hand.push(u);
    log(b, `♻ «${u.name}»: Отзыв — возвращается в руку.`, u.owner === 'me' ? 'good' : 'bad');
    return;
  }
  s.grave.push(u);
  log(b, `☠ «${u.name}» (${u.atk}/${unitHp(u)}) погибает${source ? ` от «${source.name}»` : ''}.`, u.owner === 'me' ? 'bad' : 'good');
  onDeath(b, u);
}

function onDeath(b, u) {
  const foe = enemySide(b, u.owner);
  if (u.fx.deathZap) {
    const pool = foe.board.filter((x) => isAlive(x) && !x.fx.shroud);
    if (pool.length) dealDamage(b, b.rng.pick(pool), u.fx.deathZap, u, 'Разряд');
    else damageLeader(b, foe.id, u.fx.deathZap, 'Разряд');
  }
  if (u.fx.deathWildfire) {
    for (const t of foe.board.filter(isAlive).slice()) dealDamage(b, t, u.fx.deathWildfire, u, 'Пожар');
  }
  if (u.fx.deathVolatile) {
    damageLeader(b, foe.id, u.fx.deathVolatile, 'Нестабильность');
    damageLeader(b, u.owner, 1, 'Нестабильность');
  }
  if (u.fx.deathEmp) {
    let n = 0;
    for (const t of foe.board.filter(isAlive)) { t.exhausted = true; n++; }
    if (n) log(b, `📡 Импульс: ${n} вражеских юнитов обездвижены.`, u.owner === 'me' ? 'good' : 'bad');
  }
  if (u.fx.deathMartyr) {
    const s = side(b, u.owner);
    s.bonusEnergy += 1;
    drawCards(b, u.owner, 1);
    note(b, u, 'Мученик: карта и +1⚡ в следующем ходу');
  }
}

// ---------------------------------------------------------------------------
//  Боевая фаза
// ---------------------------------------------------------------------------
export function beginCombat(b) {
  if (b.over || !b.phase.startsWith('main')) return false;
  b.phase = 'combatDeclare';
  b.attacking = [];
  b.blockers = {};
  // Бюджет показываем сразу: игрок обязан понимать ограничение ДО того, как
  // начнёт выбирать атакующих, а не узнавать о нём из отказа.
  const mine = cpBudget(b, b.active, 'attack');
  // Обороняющемуся нужен бюджет ОБРОНЫ: показывать ему атаку — значит подменить
  // число, которым он сейчас пользуется при выборе блокирующих.
  const theirs = cpBudget(b, other(b.active), 'block');
  log(b, `🎖 Очки командования: ${side(b, b.active).name} атакует — ${mine}, ${side(b, other(b.active)).name} обороняется — ${theirs}.`, 'info');
  return true;
}

export function toggleAttacker(b, u) {
  if (!u) return false;
  const i = b.attacking.indexOf(u.uid);
  // снятие атакующего не требует проверки бюджета: очки производные и вернутся сами
  if (i >= 0) {
    if (b.phase !== 'combatDeclare' || b.active !== u.owner) return false;
    b.attacking.splice(i, 1);
    return true;
  }
  if (!canDeclareAttack(b, u).ok) return false;
  b.attacking.push(u.uid);
  return true;
}

export function attackers(b) {
  const s = side(b, b.active);
  return b.attacking.map((id) => s.board.find((u) => u.uid === id)).filter((u) => u && isAlive(u));
}

/**
 * Сколько атакующих уже держит этот блокирующий (не считая указанного).
 *
 * Отдельная функция нужна, чтобы «кого можно выбрать» и «кого движок реально
 * назначит» считали вместимость одинаково. Раньше legalBlockers смотрел только
 * на оплату и предлагал юнита, уже исчерпавшего свой предел блоков, — игрок
 * кликал, а assignBlock молча его выбрасывал.
 */
export function blockUsage(b, blockerUid, exceptAttackerUid = null) {
  let n = 0;
  for (const [aid, list] of Object.entries(b.blockers)) {
    if (aid === exceptAttackerUid) continue;
    if (list.includes(blockerUid)) n++;
  }
  return n;
}

export function legalBlockers(b, attacker) {
  const def = enemySide(b, attacker.owner);
  // Уже назначенные где-то блокирующие оплачены один раз, поэтому остаются
  // доступны; новому нужно помещаться в остаток бюджета.
  const paid = new Set(uniqueBlockers(b, def.id).map((u) => u.uid));
  const room = cpLeftBlock(b, def.id, attacker.uid);
  return def.board.filter((u) => canBlock(b, u, attacker)
    && blockUsage(b, u.uid, attacker.uid) < maxBlocks(u)
    && (paid.has(u.uid) || cpCost(b, u, 'block') <= room));
}

export function assignBlock(b, attackerUid, blockerUids) {
  const atk = findUnit(b, attackerUid);
  if (!atk) return false;
  const def = enemySide(b, atk.owner);
  // сколько раз каждый юнит уже назначен блокером (у других атакующих)
  const usage = {};
  for (const [aid, list] of Object.entries(b.blockers)) {
    if (aid === attackerUid) continue;
    for (const id of list) usage[id] = (usage[id] || 0) + 1;
  }
  const usedElsewhere = (uid) => blockUsage(b, uid, attackerUid);
  // Очки командования защищающегося: уже назначенные у ДРУГИХ атакующих
  // оплачены один раз и повторно не тарифицируются.
  let room = cpLeftBlock(b, def.id, attackerUid);
  const paying = new Set(Object.keys(usage));
  const clean = [];
  for (const id of blockerUids) {
    const u = def.board.find((x) => x.uid === id);
    if (!u || !isAlive(u) || !canBlock(b, u, atk)) continue;
    if (clean.includes(u.uid)) continue;
    if (usedElsewhere(u.uid) + clean.filter((x) => x === u.uid).length >= maxBlocks(u)) continue;
    if (!paying.has(u.uid)) {
      const cost = cpCost(b, u, 'block');
      if (cost > room) continue;            // не хватает очков командования
      room -= cost;
      paying.add(u.uid);
    }
    clean.push(u.uid);
  }
  b.blockers[attackerUid] = clean;
  return true;
}

export function findUnit(b, u) {
  const id = typeof u === 'string' ? u : u.uid;
  for (const s of ['me', 'foe']) {
    const found = b.sides[s].board.find((x) => x.uid === id);
    if (found) return found;
  }
  return null;
}

export function resolveCombat(b) {
  if (b.over) return;
  if (b.phase.startsWith('main')) b.phase = 'combatDeclare';   // Неистовство и пр. видят фазу боя
  const atkSide = side(b, b.active);
  const defSide = enemySide(b, b.active);
  b.phase = 'combatResolve';

  const atkUnits = attackers(b);
  if (atkUnits.length === 0) { log(b, 'Атаки нет.', 'dim'); afterCombat(b); return; }

  // Автоблок, если защищается ИИ. Отключается флагом noAutoBlock: прогнозы
  // задают блоки явно, и autoBlock() обнулил бы их (он начинает с b.blockers = {}),
  // из-за чего игрок видел бы на этапе атаки чужую расстановку вместо своей.
  if (!defSide.isHuman && !b.noAutoBlock) autoBlock(b, defSide.id);

  log(b, `⚔ В атаку: ${atkUnits.map((u) => u.name).join(', ')}.`, 'head');
  for (const [aid, bids] of Object.entries(b.blockers)) {
    if (!bids.length) continue;
    const a = atkSide.board.find((u) => u.uid === aid);
    if (!a) continue;
    log(b, `  🛡 «${a.name}» блокируют: ${bids.map((id) => `«${(defSide.board.find((u) => u.uid === id) || {}).name}»`).join(', ')}.`, 'dim');
  }

  // --- фаза Первого удара ---
  const first = (u) => u.fx.firstStrike || u.fx.doubleStrike;
  dealRound(b, atkUnits, defSide, first);
  // --- обычная фаза ---
  dealRound(b, atkUnits, defSide, (u) => !u.fx.firstStrike || u.fx.doubleStrike);

  for (const u of allUnits(b)) if (isAlive(u) && u.fx.overload && u.attackedThisCombat) {
    dealDamage(b, u, 1, null, 'Перегрузка');
  }
  for (const u of allUnits(b)) if (isAlive(u) && u.survivedCombat) {
    if (u.fx.resolve) { u.counters.atk += 1; u.counters.hp += 1; log(b, `🧱 Стойкость: «${u.name}» +1/+1.`, 'dim'); }
    u.survivedCombat = false;
  }
  afterCombat(b);
}

function allUnits(b) { return [...b.sides.me.board, ...b.sides.foe.board]; }

function dealRound(b, atkUnits, defSide, filter) {
  // Боевой урон в MTG наносится одновременно: снимок пар «атакующий ↔ блокеры»
  // делается ДО урона, и убитый в этой же фазе блокер всё равно успевает ударить.
  const pairs = [];
  for (const a of atkUnits) {
    if (!isAlive(a) || !filter(a)) continue;
    const blockers = (b.blockers[a.uid] || [])
      .map((id) => defSide.board.find((u) => u.uid === id))
      .filter((u) => u && isAlive(u));
    pairs.push({ a, blockers });
  }
  if (!pairs.length) return;

  // 1) атакующие бьют блокеров (или лидера, если блока нет)
  for (const { a, blockers } of pairs) {
    let dmg = unitAtk(b, a);
    if (dmg <= 0) continue;
    a.attackedThisCombat = true;
    a.survivedCombat = true;

    if (!blockers.length) {
      damageLeader(b, defSide.id, dmg, `«${a.name}»`);
      if (a.fx.lifelink) healLeader(b, a.owner, dmg);
      continue;
    }
    for (let i = 0; i < blockers.length && dmg > 0; i++) {
      const bl = blockers[i];
      const need = unitHp(bl) - bl.damage + (bl.fx.indestructible ? unitHp(bl) : 0);
      const assign = a.fx.trample ? Math.min(dmg, Math.max(1, need)) : dmg;
      const dealt = dealDamage(b, bl, assign, a);
      dmg -= a.fx.trample ? assign : dmg;
      bl.survivedCombat = true;
      if (bl.fx.thorns && isAlive(a)) dealDamage(b, a, bl.fx.thorns, bl, 'Шипы');
      if (bl.fx.lifelink) healLeader(b, bl.owner, dealt);
      if (!a.fx.trample) break;
    }
    if (a.fx.trample && dmg > 0) {
      damageLeader(b, defSide.id, dmg, `Топот «${a.name}»`);
      if (a.fx.lifelink) healLeader(b, a.owner, dmg);
    }
  }

  // 2) блокеры бьют в ответ — только те, что имели право бить в этой фазе
  for (const { a, blockers } of pairs) {
    if (!a) continue;
    for (const bl of blockers) {
      if (!filter(bl)) continue;
      const dmg = unitAtk(b, bl);
      if (dmg <= 0) continue;
      bl.survivedCombat = true;
      dealDamage(b, a, dmg, bl);
      if (a.fx.thorns && isAlive(bl)) dealDamage(b, bl, a.fx.thorns, a, 'Шипы');
      if (bl.fx.lifelink) healLeader(b, bl.owner, dmg);
    }
  }
  cleanup(b);
}

function afterCombat(b) {
  const atkSide = side(b, b.active);
  for (const u of atkSide.board) {
    if (!isAlive(u)) continue;
    if (u.attackedThisCombat) { if (!u.fx.vigilance) u.exhausted = true; u.attackedThisCombat = false; }
  }
  b.attacking = [];
  b.blockers = {};
  b.phase = 'main2';
  cleanup(b);
}

export function cleanup(b) {
  for (const id of ['me', 'foe']) {
    const sd = side(b, id);
    for (const u of sd.board.slice()) {
      if (!u.dead && (u.damage >= unitHp(u) || u.markedDeadly)) checkDeath(b, u, null);
    }
    sd.board = sd.board.filter((u) => !u.dead);
  }
  checkWin(b);
}

export function endTurn(b) {
  if (b.over) return b;
  const s = side(b, b.active);
  // конец хода: горение, яд, мор, канал, дальнозоркость
  for (const u of s.board.filter(isAlive).slice()) {
    if (u.burning > 0) { dealDamage(b, u, u.burning, null, 'Горение'); }
    if (u.poisoned > 0) { dealDamage(b, u, u.poisoned, null, 'Отрава'); }
  }
  const foe = enemySide(b, b.active);
  for (const u of s.board.filter(isAlive).slice()) {
    if (u.fx.endPlague) for (const t of foe.board.filter(isAlive).slice()) dealDamage(b, t, u.fx.endPlague, u, 'Мор');
    if (u.fx.endDraw) drawCards(b, s.id, 1);
    if (u.fx.endUplink && s.board.filter(isAlive).length >= 3) drawCards(b, s.id, 1);
  }
  // сброс до предела руки
  while (s.hand.length > b.cfg.handLimit) {
    const u = s.hand.pop();
    s.grave.push(u); u.dead = true;
    log(b, `${s.name} сбрасывает «${u.name}» (предел руки).`, 'dim');
  }
  if (s.leader.shroud > 0) s.leader.shroud = 0;
  cleanup(b);
  if (b.over) return b;

  b.active = other(b.active);
  if (b.active === b.first) b.round += 1;
  startTurn(b);
  return b;
}

export function checkWin(b) {
  if (b.over) return;
  const meDead = b.sides.me.leader.hp <= 0;
  const foeDead = b.sides.foe.leader.hp <= 0;
  if (meDead && foeDead) finish(b, 'draw', 'Взаимное уничтожение');
  else if (foeDead) finish(b, 'me', 'Лидер противника пал');
  else if (meDead) finish(b, 'foe', 'Ваш лидер пал');
}

function finish(b, winner, reason) {
  b.over = { winner, reason };
  b.phase = 'over';
  log(b, winner === 'draw' ? `⚖ Ничья: ${reason}.` : `🏁 Победа: ${b.sides[winner].name} — ${reason}.`, 'head');
}

// ---------------------------------------------------------------------------
//  Автоматический блок (используется и ИИ, и кнопкой «заблокировать оптимально»)
// ---------------------------------------------------------------------------
export function autoBlock(b, defenderId) {
  const def = side(b, defenderId);
  const atk = side(b, other(defenderId));
  b.blockers = {};
  const attackersList = attackers(b).filter(isAlive);
  if (!attackersList.length) return b.blockers;

  const pool = def.board.filter((u) => !u.exhausted && isAlive(u));
  const usedCount = new Map(pool.map((u) => [u.uid, 0]));

  // 1) Смертельная угроза — блокируем всё, чем можно.
  const incoming = attackersList.reduce((s, a) => s + unitAtk(b, a), 0);
  const mustBlock = incoming >= def.leader.hp + def.leader.armor;

  // сортируем атакующих по угрозе
  const ordered = attackersList.slice().sort((x, y) => unitAtk(b, y) - unitAtk(b, x));

  // Бюджет командования защищающегося: один юнит платит один раз, даже если
  // держит двоих атакующих.
  let room = cpBudget(b, defenderId, 'block');
  const paid = new Set();
  // Носителя ауры жалко тратить на блок: пока он жив, бюджет работает на нас.
  const auraValue = (u) => (u.fx.banner ? 10 : 0) + (u.fx.staff ? 8 : 0) + (u.fx.panic ? 8 : 0);

  for (const a of ordered) {
    const dmg = unitAtk(b, a);
    if (dmg <= 0) continue;
    const legal = pool.filter((u) => usedCount.get(u.uid) < maxBlocks(u) && canBlock(b, u, a)
      && (paid.has(u.uid) || cpCost(b, u, 'block') <= room));
    if (!legal.length) continue;

    // ищем выгодный размен: убиваем атакующего и выживаем сами
    let best = null;
    for (const u of legal) {
      const myDmg = unitAtk(b, u);
      const kills = a.fx.deathtouch ? false : (myDmg >= unitHp(a) - a.damage || (u.fx.deathtouch && myDmg > 0));
      const survives = dmg < unitHp(u) - u.damage + unitArmor(u) && !(a.fx.deathtouch);
      const score = (kills ? 100 : 0) + (survives ? 60 : 0) + (a.fx.deathtouch ? -200 : 0)
        + myDmg * 2 - unitPower(u) * 0.4 + (u.fx.indestructible ? 50 : 0)
        - (!survives ? auraValue(u) : 0);
      if (!best || score > best.score) best = { u, score, kills, survives };
    }
    if (!best) continue;
    // Когда бюджета не хватает даже на частичный блок, смертельная угроза
    // перевешивает бережливость: ауру тратить можно, проигрывать — нельзя.
    const worth = mustBlock ? true : (best.kills || best.survives || dmg >= def.leader.hp * 0.25);
    if (worth) {
      usedCount.set(best.u.uid, usedCount.get(best.u.uid) + 1);
      if (!paid.has(best.u.uid)) { room -= cpCost(b, best.u, 'block'); paid.add(best.u.uid); }
      b.blockers[a.uid] = [best.u.uid];
    }
  }
  return b.blockers;
}

// ---------------------------------------------------------------------------
//  Сводки для интерфейса
// ---------------------------------------------------------------------------
export function battleSummary(b) {
  return {
    over: b.over,
    round: b.round,
    phase: b.phase,
    active: b.active,
    me: summarizeSide(b, 'me'),
    foe: summarizeSide(b, 'foe'),
  };
}

function summarizeSide(b, id) {
  const s = side(b, id);
  return {
    name: s.name, hp: Math.max(0, s.leader.hp), maxHp: s.leader.maxHp, armor: s.leader.armor,
    energy: s.energy, maxEnergy: s.maxEnergy, hand: s.hand.length, deck: s.deck.length,
    board: s.board.filter(isAlive).length, grave: s.grave.length, fatigue: s.fatigue,
    cp: cpBudget(b, id, id === b.active ? 'attack' : 'block'),
    cpSpent: s.id === b.active ? cpSpentAttack(b) : cpSpentBlock(b, id),
  };
}

/**
 * Разбор исхода боя — почему он закончился именно так.
 *
 * Экран итогов показывает награды, но не объясняет поражение, а это главный
 * источник обучения в игре. Сигналы берутся из структурированного состояния
 * (здоровье, Усталость, кладбища) и из журнала — только для атрибуции урона,
 * потому что «кто именно снял здоровье лидеру» больше нигде не хранится.
 *
 * @param {object} b завершённый бой
 * @returns {{winner:string, rounds:number, verdict:string[], advice:string[],
 *            margin:{me:number,foe:number}, topDamage:{me:Array,foe:Array},
 *            fatigue:{me:number,foe:number}, suddenDeath:boolean, reason:string}}
 */
/** Согласование сказуемого: имена юнитов мужского рода, а «Усталость» и
 *  «Внезапная смерть» — женского. */
const feminine = (name) => name === 'Усталость' || name === 'Внезапная смерть';

export function diagnoseBattle(b) {
  const me = side(b, 'me');
  const foe = side(b, 'foe');
  const winner = b.over?.winner || null;
  const rounds = b.round;

  // --- атрибуция урона лидерам по журналу ---
  // «💥 Лидер X теряет N здоровья (h/m) — «Имя».»
  const dmgTo = { me: {}, foe: {} };
  const reDmg = /^💥 Лидер (.+?) теряет (\d+) здоровья(?:.*?— (.+?))?\.$/;
  for (const entry of b.log) {
    const m = reDmg.exec(entry.text);
    if (!m) continue;
    // урон без источника (damageLeader вызван напрямую) не attribuтируется:
    // чип «неизвестно» в разборе — шум, а не подсказка
    if (!m[3]) continue;
    const who = m[1] === me.name ? 'me' : 'foe';
    const src = m[3].replace(/^Топот /, '').replace(/[«»]/g, '');
    dmgTo[who][src] = (dmgTo[who][src] || 0) + Number(m[2]);
  }
  const rank = (obj) => Object.entries(obj).sort((x, y) => y[1] - x[1])
    .map(([name, total]) => ({ name, total }));

  const topDamage = { me: rank(dmgTo.me), foe: rank(dmgTo.foe) };

  // --- атрибуция очков командования по журналу ---
  // «🎖 Очки командования: X атакует — N, Y обороняется — M.»
  // Читаем именно журнал, а не поле: к концу боя юниты мертвы, а то, как бюджет
  // менялся раунд за раундом, важно для разбора. Новое состояние не заводим.
  const cpSeen = { me: { atk: [], def: [] }, foe: { atk: [], def: [] } };
  const reCp = /^🎖 Очки командования: (.+?) атакует — (\d+), (.+?) обороняется — (\d+)\.$/;
  for (const entry of b.log) {
    const m = reCp.exec(entry.text);
    if (!m) continue;
    const atkId = m[1] === me.name ? 'me' : 'foe';
    const defId = m[3] === me.name ? 'me' : 'foe';
    cpSeen[atkId].atk.push(Number(m[2]));
    cpSeen[defId].def.push(Number(m[4]));
  }
  const span = (arr) => (arr.length ? { min: Math.min(...arr), max: Math.max(...arr), rounds: arr.length } : null);
  const cp = {
    base: b.cfg.cp || MIN_CP,
    me: { attack: span(cpSeen.me.atk), defense: span(cpSeen.me.def) },
    foe: { attack: span(cpSeen.foe.atk), defense: span(cpSeen.foe.def) },
  };
  const fatigue = { me: me.fatigue, foe: foe.fatigue };
  const suddenDeath = rounds >= 21;
  const margin = { me: Math.max(0, me.leader.hp), foe: Math.max(0, foe.leader.hp) };

  // урон, снятый с лидера за всю игру: сумма Усталости растёт как 1+2+3…
  const fatigueDamage = (n) => (n * (n + 1)) / 2;

  const verdict = [];
  const advice = [];
  const lost = winner === 'foe';
  const won = winner === 'me';

  if (winner === 'draw') verdict.push('Оба лидера пали одновременно — ничья.');

  const myTop = topDamage.me[0];
  const foeTop = topDamage.foe[0];

  if (lost) {
    verdict.push(`Ваш лидер пал на ${rounds}-м раунде. У лидера соперника осталось ${margin.foe} HP.`);
    if (myTop) verdict.push(`Больше всего урона вам ${feminine(myTop.name) ? 'нанесла' : 'нанёс'} источник «${myTop.name}» — ${myTop.total}.`);
    if (fatigueDamage(fatigue.me) >= 3) {
      verdict.push(`Колода опустела: Усталость сняла ${fatigueDamage(fatigue.me)} здоровья (${fatigue.me} пустых доборов).`);
      advice.push('Колода мала для такой длины боя — добавьте юнитов до предела эпохи или добивайте соперника быстрее.');
    }
    if (margin.foe <= Math.max(4, Math.round(foe.leader.maxHp * 0.15))) {
      advice.push(`Не хватило совсем: ${margin.foe} HP. Попробуйте оставить больше атакующих незаблокированными или снять блок с самого сильного.`);
    }
    if (me.grave.length > foe.grave.length + 1) {
      verdict.push(`Потери: ${me.grave.length} ваших против ${foe.grave.length} у соперника.`);
      advice.push('Размены были не в вашу пользу — блокируйте так, чтобы ваш юнит убивал и выживал (консоль блока показывает это до подтверждения).');
    }
  } else if (won) {
    verdict.push(`Лидер соперника пал на ${rounds}-м раунде. Ваш лидер закончил с ${margin.me}/${me.leader.maxHp} HP.`);
    if (foeTop) verdict.push(`Основной урон сопернику ${feminine(foeTop.name) ? 'нанесла' : 'нанёс'} «${foeTop.name}» — ${foeTop.total}.`);
    if (margin.me <= Math.max(4, Math.round(me.leader.maxHp * 0.15))) {
      advice.push('Победа на грани: лидер почти пал. Стоит укрепить колоду или брать регион слабее.');
    }
    if (fatigueDamage(fatigue.foe) >= 3) verdict.push(`Колода соперника опустела — Усталость сняла с него ${fatigueDamage(fatigue.foe)}.`);
  }

  if (suddenDeath) {
    verdict.push(`Бой дошёл до внезапной смерти (${rounds} раундов): с 21-го раунда оба лидера теряют по 2 здоровья.`);
    advice.push('Затяжные бои решаются не уроном, а тем, у кого больше здоровья лидера. Эпоха выше — бои длиннее.');
  }
  // --- что очки командования сделали с этим боем ---
  const myAtk = cp.me.attack;
  const myDef = cp.me.defense;
  if (myAtk && myAtk.max < cp.base) {
    verdict.push(`«Паника» соперника урезала вашу атаку до ${myAtk.min}–${myAtk.max} очков вместо ${cp.base}.`);
    advice.push('Атакуйте дешевле: Штаб снимает с юнита очко, а источник Паники стоит убрать первым ударом.');
  } else if (myAtk && myAtk.max > cp.base) {
    verdict.push(`«Знамя» поднимало вашу атаку до ${myAtk.max} очков при базе эпохи ${cp.base}.`);
  }
  if (myDef && myDef.max > DEF_CP_BASE) {
    verdict.push(`Оборону удавалось расширить до ${myDef.max} — это дали Знамя или Тактик.`);
  } else if (myDef) {
    verdict.push('Оборона всю игру закрывала одну угрозу за раунд: больше не позволял бюджет.');
    advice.push('Оборону расширяют Знамя и Тактик, а Муштра блокирует бесплатно и держит двоих.');
  }

  if (!advice.length && lost) advice.push('Загляните в журнал боя ниже: там видно каждый размен и каждую назначенную блокировку.');

  return { winner, rounds, verdict, advice, margin, topDamage, fatigue, suddenDeath, cp, reason: b.over?.reason || '' };
}

// ---------------------------------------------------------------------------
//  Прогноз боя
//  Интерфейсу нужно показывать «что будет, если подтвердить блок» ДО того, как
//  урон нанесён. Вместо приближённой формулы, которая неминуемо разъехалась бы
//  с правилами, бой клонируется и прогоняется настоящим resolveCombat.
//  Клон дешёвый (~17 КБ, ~1 мс), а результат — точный.
// ---------------------------------------------------------------------------

/**
 * Глубокая копия боя, пригодная для «что если». ГПСЧ заменяется на отдельный
 * детерминированный поток, чтобы прогноз не съедал случайность настоящего боя.
 */
export function cloneBattle(b, tag = 'preview') {
  const copy = JSON.parse(JSON.stringify(b, (k, v) => (k === 'rng' ? undefined : v)));
  copy.rng = makeRng(`${b.seed ?? 'battle'}:${tag}:${b.round}:${b.sides.me.turns}`);
  copy.__clone = true;
  return copy;
}

/** Снимок здоровья юнитов и лидеров — для сравнения «до/после».
 *  Юниты хранятся ПО СТОРОНАМ: uid уникальны в пределах боя, но плоская карта
 *  провоцировала приписать потерю не той стороне. */
function healthSnapshot(b) {
  const snap = { units: { me: {}, foe: {} }, leaders: {} };
  for (const id of ['me', 'foe']) {
    const s = side(b, id);
    snap.leaders[id] = s.leader.hp;
    for (const u of s.board) snap.units[id][u.uid] = { hp: Math.max(0, unitHp(u) - (u.damage || 0)), max: unitHp(u), name: u.name };
  }
  return snap;
}

/** Есть ли среди участников свойства со случайной целью (прогноз становится оценкой). */
function hasRandomTargets(b) {
  for (const id of ['me', 'foe']) {
    for (const u of side(b, id).board) {
      if (u.fx.deathZap || u.fx.etbBlast || u.fx.deathWildfire) return true;
    }
  }
  return false;
}

/**
 * Прогноз разрешения текущего боя.
 * @param {object} b — живой бой (не изменяется)
 * @param {object|null} blocks — карта uid атакующего → [uid блокеров]; null ⇒ взять b.blockers
 * @returns {{leaderDelta:{me:number,foe:number}, losses:{me:Array,foe:Array},
 *            wounded:Array, over:object|null, approximate:boolean, damageToDefender:number}}
 */
export function predictCombat(b, blocks = null) {
  return runPrediction(b, { blocks, aiDefense: false });
}

/**
 * Прогноз того, как защищающийся ИИ встретит атаку. resolveCombat назначает
 * автоблок сам, когда защищается не человек, поэтому «урон без блока» — число,
 * которого в реальном бою почти никогда не бывает. Этот прогноз показывает
 * ожидаемый исход и конкретную расстановку соперника.
 * @returns {object} снимок как у predictCombat плюс `plan` — кого чем закроют
 */
export function predictDefense(b) {
  return runPrediction(b, { blocks: null, aiDefense: true });
}

/** Общий прогон боя на клоне: один и тот же код для обоих видов прогноза. */
function runPrediction(b, { blocks = null, aiDefense = false } = {}) {
  const sim = cloneBattle(b, aiDefense ? 'predict-defense' : 'predict');
  const attackerSide = sim.active;
  const defenderSide = other(attackerSide);

  let plan = null;
  if (aiDefense) {
    // считаем расстановку ИИ явно, чтобы вернуть её интерфейсу, и запрещаем
    // resolveCombat переназначать её второй раз
    plan = autoBlock(sim, defenderSide);
    sim.noAutoBlock = true;
  } else {
    // Назначаем блоки на клоне. assignBlock проверяет легальность, поэтому
    // недопустимые пары просто отсеются — интерфейс увидит честный прогноз.
    // noAutoBlock обязателен: иначе resolveCombat переназначит блоки сам, когда
    // защищается ИИ, и прогноз перестанет соответствовать тому, что задал игрок.
    sim.noAutoBlock = true;
    sim.blockers = {};
    const wanted = blocks ?? b.blockers ?? {};
    for (const [aid, list] of Object.entries(wanted)) {
      if (Array.isArray(list) && list.length) assignBlock(sim, aid, list);
    }
  }

  const before = healthSnapshot(sim);
  // Флаг фиксируем ДО разрешения: afterCombat() очищает sim.blockers, и если
  // считать после, «заблокировано» всегда будет false.
  const blocked = Object.values(sim.blockers).some((v) => v && v.length);
  if (!sim.phase.startsWith('combat')) sim.phase = 'combatDeclare';
  resolveCombat(sim);
  const after = healthSnapshot(sim);

  const losses = { me: [], foe: [] };
  const wounded = [];
  for (const id of ['me', 'foe']) {
    for (const [uid, was] of Object.entries(before.units[id])) {
      const now = after.units[id][uid];
      // юнита нет в снимке «после» ⇒ он погиб и убран с поля cleanup()
      if (!now) { losses[id].push({ uid, name: was.name, hp: was.hp }); continue; }
      const lost = was.hp - now.hp;
      if (lost > 0) wounded.push({ uid, side: id, name: now.name, lost, hp: now.hp, max: now.max, dies: now.hp <= 0 });
    }
  }
  // Сколько урона атака нанесла защищающейся стороне (юниты + лидер).
  const toDefender = wounded.filter((w) => w.side === defenderSide).reduce((sum, w) => sum + w.lost, 0)
    + losses[defenderSide].reduce((sum, l) => sum + (l.hp || 0), 0)
    + Math.max(0, before.leaders[defenderSide] - after.leaders[defenderSide]);

  return {
    leaderDelta: {
      me: after.leaders.me - before.leaders.me,
      foe: after.leaders.foe - before.leaders.foe,
    },
    losses,
    wounded,
    over: sim.over || null,
    approximate: hasRandomTargets(b),
    damageToDefender: toDefender,
    attackerSide,
    defenderSide,
    blocked,
    // расстановка ИИ с именами — интерфейс показывает, кого именно закроют
    plan: plan ? Object.entries(plan)
      .filter(([, list]) => list && list.length)
      .map(([aid, list]) => ({
        attacker: aid,
        attackerName: (side(sim, attackerSide).board.find((u) => u.uid === aid) || {}).name || aid,
        blockers: list.map((id) => (side(sim, defenderSide).board.find((u) => u.uid === id) || {}).name || id),
      })) : null,
  };
}

/**
 * Прогноз урона лидеру, если атаку НЕ заблокируют. Нужен на этапе объявления
 * атакующих, когда блоки соперника ещё не известны.
 */
export function predictUnblocked(b, attackingUids = null) {
  const ids = attackingUids ?? b.attacking;
  const atkSide = side(b, b.active);
  const defSide = side(b, other(b.active));
  let gross = 0;
  const names = [];
  for (const uid of ids) {
    const u = atkSide.board.find((x) => x.uid === uid);
    if (!u || !isAlive(u)) continue;
    const a = unitAtk(b, u);
    if (a <= 0) continue;
    // dealRound вызывается дважды (Первый удар, затем обычный), и юнит с Двойным
    // ударом проходит оба фильтра — значит бьёт лидера два раза. Первый удар
    // меняет лишь порядок, не сумму.
    const hits = u.fx.doubleStrike ? 2 : 1;
    gross += a * hits;
    names.push(hits > 1 ? `${u.name} ×2` : u.name);
  }
  // damageLeader() сначала гасит урон бронёй лидера (даёт «Укрепление»), поэтому
  // «сумма атак» и «сколько реально снимут» — разные числа. Без этого прогноз на
  // этапе объявления атаки расходился с тем, что происходило в бою.
  const armor = defSide.leader.armor || 0;
  const absorbed = Math.min(armor, gross);
  return {
    dmg: gross - absorbed,
    gross,
    absorbed,
    armorLeft: Math.max(0, armor - gross),
    names,
    count: names.length,
  };
}

export { KEYWORDS };
