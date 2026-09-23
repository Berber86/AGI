/**
 * Забег: жизни, карта, флот, трюм и вся экономика.
 *
 * Четыре жизни на забег — и это единственный необратимый ресурс. Проигранный
 * бой не заканчивает партию: корабль отходит с теми же пробоинами, игрок теряет
 * жизнь и выбирает другой узел. Прочность НЕ чинится сама, поэтому поражение
 * стоит дорого даже без потери жизни.
 *
 * Модули снимаются с обломков противника. Шанс снять целый модуль падает от
 * перегруза: влито лишнего сверх смертельного — трофей сгорел. Точная стрельба
 * вознаграждается лутом, и это видно в итогах боя.
 */

import { makeRng } from './rng.js';
import { HULLS, HULL_KEYS, makeShip, slotList, install, uninstall, installedModules, computeStats , fitToLimits } from './ship.js';
import { rollModule, moduleParts, enchantModule, enchantCost, enchantChance, canEnchant, RARITIES, rarityOf } from './modules.js';
import { generateSector, nodeById, availableNodes, NODE_TYPES } from './sector.js';
import { createBattle, battleReport, aliveUnits, unitsOf } from './combat.js';
import { buildEnemy, buildFleet, buildBoss, luckForDepth, FACTIONS } from './enemies.js';

/**
 * Экономика износа.
 *
 * Прочность не чинится сама, и это правильно: потеря должна иметь вес. Но если
 * враг каждый бой выходит целым, а игрок тащит пробоины через весь забег и не
 * может оплатить ремонт, забег превращается в воронку — первый же бой решает
 * исход всех следующих. Победа чинит долю корпуса бесплатно, поражение нет.
 */
export const VICTORY_REPAIR = 0.40;
/**
 * Доля прочности, которую экипаж латает после поражения.
 *
 * Без этого забег сваливался в спираль: поражение не чинило ничего, следующий
 * бой начинался на останках корпуса (замер: в рядовые бои входили с 0,60
 * прочности против 0,84 у элит, которые бот брал только здоровым), и жизни
 * кончались не от силы врага, а от накопленного износа.
 */
export const DEFEAT_REPAIR = 0.25;
export const REPAIR_RATE = 0.25;  // запчастей за единицу прочности

export const MAX_LIVES = 4;
export const START_PARTS = 60;

/**
 * Вместимость трюма.
 *
 * Ограничение принципиальное, а не техническое. Без него лут копится сотнями,
 * выбор «взять или разобрать» исчезает, а подбор сборки деградирует в
 * квадратичный перебор. С ним каждый трофей — решение: мест двадцать, а с
 * обломков снимается больше, и игрок сам решает, что полетит дальше.
 */
export const CARGO_LIMIT = 20;
export const MAX_FLEET = 3;
export const SECTOR_ROWS = 8;
export const MAX_SECTORS = 3;

let uidSeq = 0;

export function newRun({ seed = 'забег', hullKey = 'corvette', shipName = '«Костоправ»' } = {}) {
  const rng = makeRng(seed);
  const ship = makeShip(hullKey, shipName);
  // Стартовая сборка: половина слотов. Два модуля против пяти-семи у врага —
  // это не сложность, а гарантированное поражение в первом же бою; полный
  // комплект — уже готовый билд, который нечем улучшать. Половина держит
  // середину: игрок сразу видит работу множителей и оставляет место под трофеи.
  const startSlots = slotList(ship).slice(0, Math.ceil(slotList(ship).length / 2));
  for (const s of startSlots) install(ship, rollModule(rng, { luck: 1.25, slot: s.slot }), s.id);
  // Сборка изменила потолок прочности, поэтому корпус приводим к нему сразу:
  // иначе забег начинался бы с «прочность 100 / 74», а бой молча срезал лишнее.
  fitToLimits(ship, { full: true });

  const run = {
    v: 1,
    seed,
    rngState: 0,                 // счётчик подпотоков: каждый узел получает своё зерно
    sector: 1,
    depth: 0,                    // сколько узлов пройдено в этом секторе
    clearedTotal: 0,
    lives: MAX_LIVES,
    parts: START_PARTS,
    fleet: [ship],
    map: generateSector(rng.fork('сектор1'), { sector: 1, rows: SECTOR_ROWS }),
    currentNode: null,
    prevNode: null,
    pendingAnomaly: null,
    ambush: null,
    log: [],
    over: null,
    trophies: { battles: 0, wins: 0, losses: 0, retreats: 0, modules: 0, enchants: 0, enchantFails: 0, salvaged: 0, wrecks: 0, bestSector: 1 },
  };
  logRun(run, `Забег начат: ${shipName}, корпус «${HULLS[hullKey].name}», ${MAX_LIVES} жизни, ${START_PARTS} запчастей.`);
  return run;
}

export function logRun(run, text, kind = 'info') {
  run.log.push({ text, kind });
  if (run.log.length > 400) run.log.splice(0, run.log.length - 400);
  return text;
}

/** Зерно для конкретного узла: детерминированно, но не совпадает с зерном боя. */
export function nodeRng(run, tag) {
  run.rngState++;
  return makeRng(`${run.seed}:${run.sector}:${run.rngState}:${tag}`);
}

// ---------------------------------------------------------------------------
//  Флот и трюм
// ---------------------------------------------------------------------------

export function flagship(run) { return run.fleet[0]; }

/** Все модули в трюмах всех кораблей. */
export function cargo(run) { return run.fleet.flatMap((s) => s.cargo); }

export function findModule(run, uid) {
  for (const s of run.fleet) {
    for (const sl of slotList(s)) { const m = s.installed[sl.id]; if (m && m.uid === uid) return { module: m, ship: s, slotId: sl.id }; }
    const inCargo = s.cargo.find((m) => m.uid === uid);
    if (inCargo) return { module: inCargo, ship: s, slotId: null };
  }
  return null;
}

/**
 * Поставить модуль в слот любого корабля флота.
 * Модуль может лежать в чужом трюме — тогда он сначала переносится.
 */
export function installModule(run, moduleUid, shipUid, slotId) {
  const found = findModule(run, moduleUid);
  if (!found) return { ok: false, reason: 'Модуль не найден.' };
  const ship = run.fleet.find((s) => s.uid === shipUid);
  if (!ship) return { ok: false, reason: 'Нет такого корабля.' };
  if (found.ship !== ship) {
    // Перенос между кораблями обязан забирать модуль ЦЕЛИКОМ: uninstall кладёт
    // его в трюм старого корабля, а без последующей чистки там оставалась копия —
    // модуль множился на каждый перенос и переполнял трюм сверх предела.
    if (found.slotId) uninstall(found.ship, found.slotId);
    found.ship.cargo = found.ship.cargo.filter((m) => m.uid !== moduleUid);
    ship.cargo.push(found.module);
  }
  const res = install(ship, found.module, slotId);
  fitToLimits(ship);   // потолок прочности изменился вместе со сборкой
  return res;
}

export function removeModule(run, shipUid, slotId) {
  const ship = run.fleet.find((s) => s.uid === shipUid);
  if (!ship) return { ok: false, reason: 'Нет такого корабля.' };
  const res = uninstall(ship, slotId);
  fitToLimits(ship);   // снятый модуль мог держать потолок прочности
  return res;
}

export function addShip(run, hullKey, name) {
  if (run.fleet.length >= MAX_FLEET) return { ok: false, reason: `Во флоте не больше ${MAX_FLEET} кораблей.` };
  const ship = makeShip(hullKey, name);
  run.fleet.push(ship);
  logRun(run, `Во флот вошёл ${name} («${HULLS[hullKey].name}»).`, 'good');
  return { ok: true, ship };
}

// ---------------------------------------------------------------------------
//  Узлы карты
// ---------------------------------------------------------------------------

export function choices(run) { return availableNodes(run.map, run.currentNode); }

export function enterNode(run, nodeId) {
  const node = nodeById(run.map, nodeId);
  if (!node) return { ok: false, reason: 'Нет такого узла.' };
  const allowed = choices(run).some((n) => n.id === nodeId);
  if (!allowed) return { ok: false, reason: 'Сюда нельзя попасть из текущей точки.' };
  run.prevNode = run.currentNode;
  run.currentNode = nodeId;

  // Проход через уже зачищенный узел: бой не перезапускается, открываются дети.
  // Без этого карта тупиковала после зачистки всех детей текущего узла.
  if (node.cleared && node.type !== 'boss') {
    return { ok: true, kind: 'travel', node };
  }

  const rng = nodeRng(run, node.type);

  if (node.type === 'forge' || node.type === 'repair' || node.type === 'anomaly') {
    node.cleared = true;
    run.depth++; run.clearedTotal++;
    if (node.type === 'anomaly') {
      run.pendingAnomaly = rollAnomaly(rng);
      logRun(run, `✷ Аномалия: ${run.pendingAnomaly.name}.`);
      return { ok: true, kind: 'anomaly', anomaly: run.pendingAnomaly };
    }
    logRun(run, `${NODE_TYPES[node.type].icon} ${NODE_TYPES[node.type].name}: ${NODE_TYPES[node.type].desc}`);
    return { ok: true, kind: node.type };
  }

  // --- бой ---
  const tier = node.type === 'elite' ? 'elite' : node.type === 'boss' ? 'boss' : node.type.startsWith('fleet') ? 'fleet' : 'battle';
  const foes = buildFoes(run, rng, tier);
  const battle = createBattle({
    seed: `${run.seed}:${run.sector}:${nodeId}`,
    mine: run.fleet.map((s) => s),
    foes,
    mode: `${run.fleet.length}v${foes.length}`,
  });
  battle.nodeId = nodeId;
  battle.tier = tier;
  logRun(run, `⚔ ${NODE_TYPES[node.type].name}: ${foes.map((f) => f.name).join(', ')} (${battle.mode}).`);
  return { ok: true, kind: 'battle', battle };
}

function buildFoes(run, rng, tier) {
  const depth = run.depth + 1;
  if (tier === 'boss') return [buildBoss(rng, depth, run.sector)];
  if (tier === 'fleet') {
    // Размер эскадры подстраивается под флот игрока: один корабль не ставят
    // против троих — иначе карта предлагает не бой, а казнь.
    const size = Math.min(3, Math.max(2, run.fleet.length));
    return buildFleet(rng, size, { depth, tier });
  }
  return [buildEnemy(rng, { depth, tier })];
}

// ---------------------------------------------------------------------------
//  Итоги боя
// ---------------------------------------------------------------------------

/** Сколько мест свободно в трюме (общий лимит на забег, а не на корабль). */
/**
 * Какой обломок стоит предложить отбуксировать.
 *
 * Берём самый вместительный корпус из потопленных, и только если он не уступает
 * текущему: число слотов — главный множитель силы при мультипликативной сборке,
 * и прятать рост флота за покупкой на верфи нельзя. Второй корабль того же
 * класса тоже предлагается: режимы 2×2 и 3×3 требуют флота, а не одного корпуса.
 */
export function pickCapture(run, wrecks) {
  if (run.fleet.length >= MAX_FLEET) return null;
  const myBest = Math.max(...run.fleet.map((s) => slotList(s).length));
  const cands = wrecks
    .map((w) => ({ ship: w, slots: slotList(w).length, price: Math.round(hullPrice(w.hullKey) * 0.4) }))
    .filter((c) => c.slots >= myBest)
    .sort((a, b) => b.slots - a.slots);
  return cands[0] || null;
}

export function cargoSpace(run) {
  return Math.max(0, CARGO_LIMIT - cargo(run).length);
}

/**
 * Трофеи с обломков.
 *
 * Бросок на сохранность делается здесь: перегруз жжёт модули, и точная
 * стрельба вознаграждается лутом. А вот в трюм уцелевшее кладёт игрок через
 * takeLoot — мест обычно меньше, чем трофеев, и это настоящее решение забега.
 *
 * @param {object} run
 * @param {Array} wrecks потопленные корабли противника
 * @param {number} overkillRatio доля лишнего урона (0 — чисто, 1 — в пыль)
 */
export function lootWrecks(run, wrecks, overkillRatio = 0) {
  const candidates = [], burned = [];
  const bay = run.fleet.some((s) => computeStats(s, { plain: true }).fx.salvageBay);
  for (const wreck of wrecks) {
    for (const m of installedModules(wreck)) {
      const chance = Math.min(0.95, Math.max(0.05,
        0.55 + 0.30 * (1 - overkillRatio) + (rarityOf(m).key === 'pristine' ? -0.1 : 0) + (bay ? 0.25 : 0)));
      const rng = nodeRng(run, 'трофей' + m.uid);
      const roll = rng.roll(chance);
      if (roll.hit) candidates.push({ module: m, chance, roll: roll.value, from: wreck.name });
      else burned.push({ module: m, chance, roll: roll.value, from: wreck.name });
    }
    run.trophies.wrecks++;
  }
  const parts = Math.round(8 + run.depth * 2.5 + wrecks.length * 4);
  run.parts += parts;
  return { candidates, burned, parts, bay, space: cargoSpace(run) };
}

/**
 * Взять выбранные трофеи в трюм.
 * @param {object} run
 * @param {Array<string>} uids какие модули берём
 * @returns {{taken:Array, refused:Array, reason:string}}
 */
export function takeLoot(run, uids) {
  const pending = run.pendingLoot?.candidates || [];
  const space = cargoSpace(run);
  const chosen = pending.filter((c) => uids.includes(c.module.uid));
  const taken = chosen.slice(0, space);
  const refused = chosen.slice(space);
  if (taken.length) {
    flagship(run).cargo.push(...taken.map((c) => c.module));
    run.trophies.modules += taken.length;
  }
  const reason = refused.length
    ? `В трюме кончилось место: не взято ${refused.length}, мест всего ${CARGO_LIMIT}.`
    : '';
  if (reason) logRun(run, `⚠ ${reason}`, 'bad');
  run.pendingLoot = null;
  return { taken: taken.map((c) => c.module), refused: refused.map((c) => c.module), reason };
}

/**
 * Завершить бой. Победа даёт трофеи, поражение — минус жизнь, но забег
 * продолжается: игрок отходит и выбирает другой узел.
 */
/**
 * Флот отходит на предыдущую позицию карты.
 *
 * Остаться на проваленном узле нельзя: у босса нет потомков, и забег
 * обрывался в тупике с жизнями в запасе — карта кончалась раньше флота.
 */
function fallBack(run) {
  run.currentNode = run.prevNode ?? null;
}

export function finishBattle(run, battle, result) {
  const node = nodeById(run.map, battle.nodeId);
  run.trophies.battles++;

  // Отход — не поражение: жизнь сохраняется, но узел не пройден и трофеев нет.
  if (result.retreated) {
    run.trophies.retreats = (run.trophies.retreats || 0) + 1;
    logRun(run, `🚀 Флот отошёл из боя. Жизней ${run.lives} из ${MAX_LIVES}, трофеев нет, узел можно повторить.`, 'bad');
    if (node) node.cleared = false;
    run.pendingLoot = null;
    run.pendingCapture = null;
    fallBack(run);
    return { ok: true, win: false, retreated: true };
  }

  // Бой захлебнулся: победителя нет и отхода не было (цели кончились раньше,
  // чем корабли). Списывать за это жизнь нельзя — это не поражение.
  if (!result.winner) {
    logRun(run, '⚠ Бой захлебнулся: ни один флот не смог продолжить. Жизнь цела, узел не пройден.', 'bad');
    if (node) node.cleared = false;
    run.pendingLoot = null;
    run.pendingCapture = null;
    fallBack(run);
    return { ok: true, win: false, stalled: true };
  }

  if (result.winner === 'mine') {
    run.trophies.wins++;
    if (node) { node.cleared = true; }
    run.depth++; run.clearedTotal++;
    const loot = lootWrecks(run, result.wrecks, result.overkillRatio);
    run.pendingLoot = loot;
    run.pendingCapture = pickCapture(run, result.wrecks);
    logRun(run, `🏆 Победа. Уцелело модулей: ${loot.candidates.length}${loot.burned.length ? `, сгорело в обломках: ${loot.burned.length}` : ''}. Запчастей +${loot.parts}. Свободных мест в трюме: ${loot.space}.`, 'good');
    // победа латает корпус: иначе износ накапливается быстрее, чем игрок
    // успевает его оплатить, и каждый следующий бой начинается хуже прошлого
    for (const s2 of run.fleet) {
      const c = computeStats(s2, { plain: true });
      const healed = Math.round(c.stats.hull * VICTORY_REPAIR);
      if (s2.hull < c.stats.hull && healed > 0) {
        s2.hull = Math.min(c.stats.hull, s2.hull + healed);
      }
    }
    if (node?.type === 'boss') {
      // Награда за босса обязана быть больше, чем запчасти: возвращаем жизнь.
      if (run.lives < MAX_LIVES) {
        run.lives++;
        logRun(run, `♥ Флагман потоплен — экипаж собран: возвращена одна жизнь (${run.lives} из ${MAX_LIVES}).`, 'good');
      }
      return { ok: true, win: true, boss: true, loot };
    }
    return { ok: true, win: true, boss: false, loot };
  }
  if (result.winner === 'draw') {
    logRun(run, '⚖ Ничья: оба флота погибли одновременно. Трофеев нет.', 'bad');
    run.trophies.losses++;
    run.lives--;
  } else {
    run.trophies.losses++;
    run.lives--;
    logRun(run, `💀 Поражение. Потеряна жизнь (${run.lives} из ${MAX_LIVES}). Корабли отходят с пробоинами — ремонт не автоматический.`, 'bad');
  }
  run.pendingLoot = null;
  run.pendingCapture = null;
  if (node) node.cleared = false;   // узел можно повторить: отход ≠ зачистка
  // Экипаж латает пробоины: поражение стоит жизни, но не должно оставлять
  // флот небоеспособным — иначе каждое следующее поражение неизбежно.
  for (const s2 of run.fleet) {
    const c = computeStats(s2, { plain: true });
    // Пробоина может быть сквозной (hull = 0): бой начинается с единицы
    // прочности, поэтому чиним и уничтоженные корабли — иначе следующий бой
    // проигран ещё до первого выстрела и поражение тянет за собой второе.
    if (s2.hull < c.stats.hull) {
      s2.hull = Math.min(c.stats.hull, s2.hull + Math.round(c.stats.hull * DEFEAT_REPAIR));
      s2.shield = c.stats.shield;
    }
  }
  fallBack(run);
  checkRunOver(run);
  return { ok: true, win: false };
}

export function checkRunOver(run) {
  if (run.over) return run.over;
  if (run.lives <= 0) {
    run.over = { win: false, reason: 'Жизни кончились: флот больше некому поднять.' };
    logRun(run, '☠ Забег окончен: жизни кончились.', 'bad');
  } else if (run.sector > MAX_SECTORS) {
    run.over = { win: true, reason: `Пройдено ${MAX_SECTORS} сектора — Сердцевина взята.` };
    logRun(run, '👑 Забег выигран: Сердцевина взята.', 'good');
  }
  return run.over;
}

export function nextSector(run) {
  run.sector++;
  run.trophies.bestSector = Math.max(run.trophies.bestSector, run.sector);
  if (checkRunOver(run)) return { ok: false, reason: run.over.reason };
  run.depth = 0;
  run.currentNode = null;
  run.map = generateSector(nodeRng(run, 'сектор' + run.sector), { sector: run.sector, rows: SECTOR_ROWS });
  // Щиты поднимаются, прочность остаётся как есть: переход сектора не лечит.
  for (const s of run.fleet) {
    const c = computeStats(s, { plain: true });
    s.shield = c.stats.shield;
  }
  logRun(run, `🌌 Сектор ${run.sector}. Карта развернута, ${MAX_LIVES - run.lives} жизней потрачено.`, 'good');
  return { ok: true };
}

// ---------------------------------------------------------------------------
//  Верфь: заточка, разбор, ремонт, корпус
// ---------------------------------------------------------------------------

export function salvageModule(run, moduleUid) {
  const found = findModule(run, moduleUid);
  if (!found) return { ok: false, reason: 'Модуль не найден.' };
  // uninstall кладёт снятый модуль в трюм своего корабля, поэтому трюм
  // чистится в обоих ветках: иначе разобранный модуль остался бы во флоте
  // вместе с выданными за него запчастями.
  if (found.slotId) uninstall(found.ship, found.slotId);
  found.ship.cargo = found.ship.cargo.filter((m) => m.uid !== moduleUid);
  fitToLimits(found.ship);
  const parts = moduleParts(found.module);
  run.parts += parts;
  run.trophies.salvaged++;
  logRun(run, `⚙ «${found.module.name}» разобран на запчасти: +${parts}.`, 'info');
  return { ok: true, parts, module: found.module };
}

export function enchantModuleRun(run, moduleUid) {
  const found = findModule(run, moduleUid);
  if (!found) return { ok: false, reason: 'Модуль не найден.' };
  // Проверка ДО списания: иначе запчасти уходят за отказ движка.
  const can = canEnchant(found.module);
  if (!can.ok) return { ok: false, reason: can.reason };
  const cost = enchantCost(found.module);
  if (run.parts < cost) return { ok: false, reason: `Нужно ${cost} запчастей, есть ${run.parts}.` };
  run.parts -= cost;
  const rng = nodeRng(run, 'заточка' + found.module.uid + found.module.enchant);
  const res = enchantModule(rng, found.module);
  fitToLimits(found.ship);   // заточка меняет силу модификаторов, значит и потолок
  run.trophies.enchants++;
  if (!res.ok) run.trophies.enchantFails++;
  logRun(run, `${res.ok ? '✦' : '✖'} Заточка «${found.module.name}» (−${cost} запчастей): ${res.text}.`, res.ok ? 'good' : 'bad');
  return { ok: true, ...res, cost, module: found.module };
}

/**
 * Ремонт в доках — бесплатный и полный.
 *
 * Платный ремонт доступен где угодно (см. repairFleet), поэтому узел «Доки»
 * обязан давать что-то, чего за деньги не купить: иначе он неотличим от меню
 * и маршрут по карте теряет смысл.
 */
export function drydockRepair(run) {
  let healed = 0;
  for (const s of run.fleet) {
    const c = computeStats(s, { plain: true });
    healed += Math.max(0, c.stats.hull - s.hull);
    s.hull = c.stats.hull;
    s.shield = c.stats.shield;
  }
  if (!healed) return { ok: false, reason: 'Чинить нечего: флот цел.' };
  logRun(run, `✚ Доки: корпус восстановлен полностью (+${Math.round(healed)} прочности), щиты подняты.`, 'good');
  return { ok: true, healed: Math.round(healed) };
}

export function repairCost(run) {
  let missing = 0;
  for (const s of run.fleet) {
    const c = computeStats(s, { plain: true });
    missing += Math.max(0, c.stats.hull - s.hull);
  }
  return Math.round(missing * REPAIR_RATE);
}

export function repairFleet(run) {
  const cost = repairCost(run);
  if (run.parts < cost) return { ok: false, reason: `Нужно ${cost} запчастей, есть ${run.parts}.` };
  if (cost === 0) return { ok: false, reason: 'Чинить нечего: корпус цел.' };
  run.parts -= cost;
  for (const s of run.fleet) {
    const c = computeStats(s, { plain: true });
    s.hull = c.stats.hull;
    s.shield = c.stats.shield;
  }
  logRun(run, `✚ Флот отремонтирован за ${cost} запчастей.`, 'good');
  return { ok: true, cost };
}

export function hullPrice(hullKey) {
  const idx = HULL_KEYS.indexOf(hullKey);
  return 30 + Math.max(0, idx) * 35;
}

export function buyHull(run, hullKey) {
  if (!HULLS[hullKey]) return { ok: false, reason: 'Нет такого корпуса.' };
  if (run.fleet.length >= MAX_FLEET) return { ok: false, reason: `Во флоте не больше ${MAX_FLEET} кораблей.` };
  const price = hullPrice(hullKey);
  if (run.parts < price) return { ok: false, reason: `Нужно ${price} запчастей, есть ${run.parts}.` };
  run.parts -= price;
  const names = ['«Заплата»', '«Вторак»', '«Подборщик»', '«Довесок»', '«Сосед»'];
  return addShip(run, hullKey, names[run.fleet.length % names.length] || '«Безымянный»');
}

/** Забрать обломок противника себе — дешевле покупки, но корпус повреждён. */
export function captureWreck(run, wreck) {
  if (run.fleet.length >= MAX_FLEET) return { ok: false, reason: `Во флоте не больше ${MAX_FLEET} кораблей.` };
  const price = Math.round(hullPrice(wreck.hullKey) * 0.4);
  if (run.parts < price) return { ok: false, reason: `Нужно ${price} запчастей на ремонт корпуса, есть ${run.parts}.` };
  run.parts -= price;
  const c = computeStats(wreck, { plain: true });
  // Корпус приходит побитым: половина прочности и поднятый щит. Чужая сборка
  // остаётся на нём — это не подарок, а материал: её можно переставить или сдать.
  wreck.hull = Math.max(1, Math.round(c.stats.hull * 0.5));
  wreck.shield = c.stats.shield;
  wreck.uid = `${wreck.uid}t`;   // трофей получает новый id: старый был у противника
  run.fleet.push(wreck);
  run.pendingCapture = null;
  logRun(run, `🛠 ${wreck.name} отбуксирован во флот за ${price} запчастей: «${HULLS[wreck.hullKey].name}», ${slotList(wreck).length} слотов.`, 'good');
  return { ok: true, ship: wreck };
}

// ---------------------------------------------------------------------------
//  Аномалии
// ---------------------------------------------------------------------------

export const ANOMALIES = [
  { key: 'depot', name: 'Заброшенный склад', icon: '📦',
    text: 'Дрейфующий контейнерный ряд. Замок сорван, внутри что-то целое.' },
  { key: 'storm', name: 'Ионная буря', icon: '🌩',
    text: 'Фронт заряженных частиц на полсектора. Обшивка звенит уже сейчас.' },
  { key: 'hulk', name: 'Дрейфующий корпус', icon: '🛸',
    text: 'Корабль без экипажа, но с рабочим реактором. Можно отбуксировать или разобрать.' },
  { key: 'trader', name: 'Торговец-одиночка', icon: '⚖',
    text: 'Баржа с вывеской «Всё с обломков». Хозяин не задаёт вопросов.' },
  { key: 'beacon', name: 'Маяк бедствия', icon: '🆘',
    text: 'Кто-то просит помощи на открытом канале. Сигнал слишком ровный.' },
];

function rollAnomaly(rng) {
  return { ...rng.pick(ANOMALIES) };
}

/** Варианты выбора для аномалии — считаются на месте, чтобы видеть цены. */
export function anomalyChoices(run, anomaly) {
  const out = [];
  if (anomaly.key === 'depot') {
    out.push({ label: `Забрать запчасти (+${35 + run.depth * 4})`, hint: 'без риска' });
    out.push({ label: 'Вскрыть запечатанный контейнер', hint: '60% эталонный модуль, 40% брак и пробоина' });
  } else if (anomaly.key === 'storm') {
    out.push({ label: 'Переждать бурю', hint: '−15% прочности флота, но гарантированно' });
    out.push({ label: 'Пройти на форсаже', hint: '50%: два модуля / 50%: −25% прочности' });
  } else if (anomaly.key === 'hulk') {
    if (run.fleet.length < MAX_FLEET) out.push({ label: 'Отбуксировать корпус во флот', hint: 'новый корабль с бракованной сборкой' });
    out.push({ label: `Разобрать на запчасти (+${60 + run.depth * 5})`, hint: 'без риска' });
  } else if (anomaly.key === 'trader') {
    out.push({ label: `Купить модуль за 45 запчастей`, hint: 'случайный, удача ×1,6' });
    out.push({ label: `Купить эталонный за 110 запчастей`, hint: 'гарантированно редкий' });
    out.push({ label: 'Уйти', hint: 'ничего не менять' });
  } else if (anomaly.key === 'beacon') {
    out.push({ label: 'Помочь', hint: 'ремонт 45% прочности бесплатно' });
    out.push({ label: 'Ограбить', hint: 'запчасти и модули, но это засада: бой с элитой' });
  }
  return out.map((c, i) => ({ ...c, index: i }));
}

export function resolveAnomaly(run, index) {
  const anomaly = run.pendingAnomaly;
  if (!anomaly) return { ok: false, reason: 'Нет активного события.' };
  const opts = anomalyChoices(run, anomaly);
  const choice = opts[index];
  if (!choice) return { ok: false, reason: 'Нет такого варианта.' };
  const rng = nodeRng(run, 'аномалия' + anomaly.key + index);
  const out = { ok: true, text: '', battle: null };

  const hurt = (share) => {
    for (const s of run.fleet) {
      const c = computeStats(s, { plain: true });
      s.hull = Math.max(1, Math.round(s.hull - c.stats.hull * share));
    }
  };

  if (anomaly.key === 'depot') {
    if (index === 0) {
      const parts = 35 + run.depth * 4;
      run.parts += parts;
      out.text = `Запчасти загружены: +${parts}.`;
    } else {
      if (rng.chance(0.6)) {
        const m = rollModule(rng, { rarity: 'pristine' });
        flagship(run).cargo.push(m);
        run.trophies.modules++;
        out.text = `В контейнере ${rarityOf(m).name.toLowerCase()} модуль «${m.name}».`;
      } else {
        const m = rollModule(rng, { rarity: 'defective' });
        flagship(run).cargo.push(m);
        run.trophies.modules++;
        hurt(0.1);
        out.text = `Внутри был брак «${m.name}», и он сдетонировал: флот потерял 10% прочности.`;
      }
    }
  } else if (anomaly.key === 'storm') {
    if (index === 0) {
      hurt(0.15);
      out.text = 'Буря пережидана в тени астероида: −15% прочности, зато без сюрпризов.';
    } else if (rng.chance(0.5)) {
      const mods = [rollModule(rng, { luck: 1.6 }), rollModule(rng, { luck: 1.6 })];
      flagship(run).cargo.push(...mods);
      run.trophies.modules += 2;
      out.text = `Форсаж удался: из бури вынесено два модуля — ${mods.map((m) => `«${m.name}»`).join(' и ')}.`;
    } else {
      hurt(0.25);
      out.text = 'Форсаж не вытянул: разряд прошёл по обшивке, −25% прочности.';
    }
  } else if (anomaly.key === 'hulk') {
    if (index === 0 && run.fleet.length < MAX_FLEET) {
      const ship = buildEnemy(rng, { depth: Math.max(1, run.depth), tier: 'battle', fill: 0.5, luck: 0.7 });
      ship.hull = Math.max(1, Math.round(ship.hull * 0.6));
      ship.name = ship.name.replace(/[«»]/g, '') + '-трофей';
      ship.name = `«${ship.name}»`;
      run.fleet.push(ship);
      out.text = `Корпус отбуксирован: во флот вошёл ${ship.name} («${HULLS[ship.hullKey].name}»).`;
    } else {
      const parts = 60 + run.depth * 5;
      run.parts += parts;
      out.text = `Корпус разобран: +${parts} запчастей.`;
    }
  } else if (anomaly.key === 'trader') {
    if (index === 0) {
      if (run.parts < 45) { out.ok = false; out.reason = 'Не хватает запчастей.'; }
      else {
        run.parts -= 45;
        const m = rollModule(rng, { luck: 1.6 });
        flagship(run).cargo.push(m); run.trophies.modules++;
        out.text = `Куплен «${m.name}» (${rarityOf(m).name.toLowerCase()}).`;
      }
    } else if (index === 1) {
      if (run.parts < 110) { out.ok = false; out.reason = 'Не хватает запчастей.'; }
      else {
        run.parts -= 110;
        const m = rollModule(rng, { rarity: 'pristine' });
        flagship(run).cargo.push(m); run.trophies.modules++;
        out.text = `Куплен эталонный «${m.name}».`;
      }
    } else out.text = 'Торговец кивнул и отвернул. Ничего не изменилось.';
  } else if (anomaly.key === 'beacon') {
    if (index === 0) {
      for (const s of run.fleet) {
        const c = computeStats(s, { plain: true });
        s.hull = Math.min(c.stats.hull, Math.round(s.hull + c.stats.hull * 0.45));
      }
      out.text = 'Помощь оказана: благодарность пришлась кстати, +45% прочности флоту.';
    } else {
      const parts = 40 + run.depth * 3;
      run.parts += parts;
      const m = rollModule(rng, { luck: 1.4 });
      flagship(run).cargo.push(m); run.trophies.modules++;
      out.text = `«Терпящие бедствие» оказались приманкой: бой, но вы успели снять с них ${parts} запчастей и «${m.name}».`;
      out.battle = { tier: 'elite' };
    }
  }

  run.pendingAnomaly = null;
  logRun(run, `✷ ${anomaly.name}: ${out.text}`, out.ok ? 'info' : 'bad');
  return out;
}

/** Засада из аномалии: бой собирается сразу, минуя карту. */
export function startAmbush(run, tier = 'elite') {
  const rng = nodeRng(run, 'засада');
  const foes = buildFoes(run, rng, tier);
  const battle = createBattle({
    seed: `${run.seed}:ambush:${run.clearedTotal}:${tier}`,
    mine: run.fleet,
    foes,
    mode: `${run.fleet.length}v${foes.length}`,
  });
  battle.nodeId = null;
  battle.tier = tier;
  battle.ambush = true;
  logRun(run, `☠ Засада: ${foes.map((f) => f.name).join(', ')}.`, 'bad');
  return battle;
}

/** Сводка для экрана итогов. */
export function runSummary(run) {
  const fleetStats = run.fleet.map((s) => ({ name: s.name, hull: HULLS[s.hullKey].name, stats: computeStats(s, { plain: true }).stats }));
  return {
    win: run.over?.win ?? false,
    reason: run.over?.reason || '',
    sector: run.sector,
    cleared: run.clearedTotal,
    lives: run.lives,
    parts: run.parts,
    trophies: { ...run.trophies },
    fleet: fleetStats,
  };
}
