/**
 * Противники: корабли, фракции и флоты.
 *
 * Враг собирается тем же кодом, что и корабль игрока — тот же корпус, те же
 * случайные модули, та же арифметика множителей. Никаких «уровней» и надбавок к
 * числам: сложность растёт только через качество трофеев (удачу генерации) и
 * класс корпуса. Это держит бой честным — выигрывает сборка, а не уровень.
 *
 * Побочный эффект, который важен для игры: у врага стоят ровно те модули,
 * которые потом можно снять с его обломков. Лут не появляется из ниоткуда.
 */

import { makeShip, slotList, install, fitToLimits } from './ship.js';
import { rollModule } from './modules.js';

export const FACTIONS = [
  { key: 'marauders', name: 'Вольные мародёры', luck: 1.0,
    names: ['Коготь', 'Ржавый Нож', 'Падальщик', 'Должник', 'Стервятник', 'Оборотень', 'Головорез', 'Барыга'] },
  { key: 'cult', name: 'Культ Пустоты', luck: 1.25,
    names: ['Причастие', 'Молчание', 'Чёрный Престол', 'Аллилуйя', 'Покаяние', 'Пророк', 'Литания', 'Епитимья'] },
  { key: 'corp', name: 'Корпорация «Гелиос»', luck: 1.4,
    names: ['Актив', 'Дивиденд', 'Аудитор', 'Ликвидатор', 'Баланс', 'Эмиссар', 'Квота', 'Регистратор'] },
  { key: 'swarm', name: 'Рой', luck: 0.9,
    names: ['Жвало', 'Хитин', 'Трутень', 'Рой-9', 'Личинка', 'Матка', 'Хорда', 'Куколка'] },
  { key: 'navy', name: 'Остатки Флота', luck: 1.15,
    names: ['Устав', 'Гарнизон', 'Трибунал', 'Каратель', 'Редут', 'Комендор', 'Баталер', 'Аванпост'] },
];

/** Класс корпуса по глубине: чем дальше в сектор, тем крупнее попадаются. */
function hullForDepth(rng, depth) {
  // Кривая намеренно пологая: число слотов корпуса — главный множитель силы при
  // мультипликативной сборке, и если враг пересаживается на линкор (15 слотов)
  // раньше, чем игрок успевает сменить корвет (8 слотов), забег заканчивается не
  // из-за ошибки игрока, а из-за арифметики. Линкоры — только боссы и глубина 7+.
  const table = [
    ['interceptor', 'interceptor', 'corvette'],
    ['interceptor', 'corvette', 'corvette'],
    ['corvette', 'corvette', 'frigate'],
    ['corvette', 'frigate', 'frigate'],
    ['frigate', 'frigate', 'cruiser'],
    ['frigate', 'cruiser', 'cruiser'],
    ['cruiser', 'cruiser', 'battleship'],
  ];
  const row = table[Math.max(0, Math.min(table.length - 1, depth - 1))];
  return rng.pick(row);
}

/** Удача генерации модулей растёт с глубиной: поздние враги одеты лучше. */
export function luckForDepth(depth, tier = 'battle') {
  // Наклон удачи пологий: при 0,10 на глубине 8 враг получал ×1,7 к качеству
  // модулей, и игрок упирался в стену, которую не пробить никакой сборкой.
  const base = 1 + Math.max(0, depth - 1) * 0.045;
  if (tier === 'elite') return base * 1.2;
  if (tier === 'boss') return base * 1.4;
  if (tier === 'fleet') return base * 0.8;
  return base;
}

/**
 * Собрать корабль противника.
 * @param {object} rng
 * @param {object} opts { depth, tier, faction, hullKey, luck, fill }
 */
export function buildEnemy(rng, opts = {}) {
  const depth = opts.depth || 1;
  const tier = opts.tier || 'battle';
  const faction = opts.faction || rng.pick(FACTIONS);
  const hullKey = opts.hullKey || hullForDepth(rng, depth);
  const luck = opts.luck ?? luckForDepth(depth, tier);

  const name = `«${rng.pick(faction.names)}»`;
  const ship = makeShip(hullKey, name);
  ship.faction = faction.key;
  ship.tier = tier;

  // Элита и босс заполняют все слоты, обычный противник — по глубине: на первом
  // узле у врага три-четыре модуля, а не семь, иначе игрок со стартовой
  // половиной слотов проигрывает первый же бой и забег кончается, не начавшись.
  const slots = slotList(ship);
  // Кривая наполненности пологая: при 0,09/узел враг на глубине 8 носил все
  // слоты, а игрок к этому времени собирал полтора десятка модулей на флот —
  // разрыв в мощности делал поздние бои нерешаемыми.
  // Рядовой бой заведомо слабее элиты. Замер по типам узлов показал перекос:
  // элиты выигрывались в 94% случаев, боссы в 67%, а рядовые стычки — в 49% и
  // давали 145 поражений из 60 забегов. Причина не в награде, а в потоке:
  // элиту игрок выбирает здоровым, а рядовые бои идут один за другим, и в
  // каждый следующий он входит с пробоинами от прошлого.
  const rowdy = Math.min(0.82, 0.24 + depth * 0.04 + rng.float(0, 0.12));
  const fill = opts.fill ?? (tier === 'boss' ? 1 : tier === 'elite' ? 0.78 : rowdy);
  const take = rng.shuffle(slots).slice(0, Math.max(1, Math.round(slots.length * fill)));
  for (const s of take) install(ship, rollModule(rng, { luck, slot: s.slot }), s.id);

  // Прочность приводим к потолку самого корабля: модули на прочность работают у
  // противника так же, как у игрока. Надбавок «за уровень» нет — сложность несёт
  // класс корпуса и удача модулей. Без этого враг с модулями на прочность
  // выходил бы в бой побитым (база корпуса ниже его же потолка), а враг с
  // делителями — наоборот, терял бы лишнее молча.
  fitToLimits(ship, { full: true });
  return ship;
}

/** Флот противника: 1–3 корабля. В группе каждый слабее одиночки. */
export function buildFleet(rng, size, opts = {}) {
  const out = [];
  for (let i = 0; i < size; i++) {
    out.push(buildEnemy(rng, { ...opts, luck: (opts.luck ?? luckForDepth(opts.depth || 1, opts.tier)) * (size > 1 ? 0.8 : 1) }));
  }
  return out;
}

/**
 * Босс сектора.
 *
 * Класс корпуса зависит от сектора, а не от глубины: в первом секторе босс —
 * крейсер (12 слотов), а не линкор (15). Против игрока на корвете (8 слотов)
 * линкор с полной сборкой — не бой, а арифметическая казнь: замер дал 0% побед
 * при отношении мощности 0,05. Босс обязан быть тяжёлым, но проходимым.
 */
export function buildBoss(rng, depth, sector) {
  const faction = rng.pick(FACTIONS);
  const titles = ['Флагман', 'Жнец', 'Владыка', 'Палач', 'Монарх', 'Исполин'];
  const hullKey = sector <= 1 ? 'cruiser' : 'battleship';
  const ship = buildEnemy(rng, { depth, tier: 'boss', faction, hullKey, fill: 1 });
  ship.name = `${rng.pick(titles)} «${faction.names[0]}»`;
  ship.isBoss = true;
  ship.sector = sector;
  return ship;
}
