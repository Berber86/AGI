/**
 * Сектор: ветвящаяся карта забега.
 *
 * Строится как в Slay the Spire — рядами снизу вверх, каждый узел соединён с
 * одним-двумя узлами следующего ряда. Игрок видит весь сектор заранее и
 * планирует маршрут: где подраться, где починиться, где заточить модули.
 *
 * Узлы типов: бой, элита, флот (2×2 и 3×3), верфь (заточка и разбор),
 * ремонт, аномалия и босс в конце. Все узлы следующего ряда достижимы —
 * это проверяется при генерации, иначе карта рисует путь в никуда.
 */

export const NODE_TYPES = {
  battle:  { key: 'battle',  name: 'Бой',        icon: '⚔', desc: 'Одиночный противник. Основной источник модулей.' },
  elite:   { key: 'elite',   name: 'Элита',      icon: '☠', desc: 'Сильный корабль, полностью укомплектован. Трофеи лучше.' },
  fleet2:  { key: 'fleet2',  name: 'Пара',       icon: '⚔⚔', desc: 'Два корабля против вас. Режим 2×2.' },
  fleet3:  { key: 'fleet3',  name: 'Эскадра',    icon: '⚔⚔⚔', desc: 'Три корабля. Режим 3×3: здесь решает очередь и перенос огня.' },
  forge:   { key: 'forge',   name: 'Верфь',      icon: '⚒', desc: 'Заточка модулей, разбор на запчасти, покупка корпуса.' },
  repair:  { key: 'repair',  name: 'Доки',       icon: '✚', desc: 'Ремонт прочности и восстановление щитов.' },
  anomaly: { key: 'anomaly', name: 'Аномалия',   icon: '✷', desc: 'Случайное событие с выбором и риском.' },
  boss:    { key: 'boss',    name: 'Флагман',    icon: '♛', desc: 'Босс сектора. Победа открывает следующий сектор.' },
};

/** Веса типов по рядам: начало сектора спокойнее, середина плотнее. */
function typeWeights(row, rows) {
  const t = row / Math.max(1, rows - 1);
  return [
    ['battle', 40 - 18 * t],
    ['elite', 6 + 12 * t],
    ['fleet2', row >= 2 ? 8 + 10 * t : 2],
    ['fleet3', row >= 4 ? 4 + 8 * t : 0],
    ['forge', 12 - 4 * t],
    ['repair', 12 - 4 * t],
    ['anomaly', 14],
  ].filter(([, w]) => w > 0);
}

export function generateSector(rng, { sector = 1, rows = 9 } = {}) {
  const nodes = [];
  let idSeq = 0;
  const mkNode = (row, col, count, type) => ({
    id: `s${sector}n${++idSeq}`,
    row, col, count, type,
    edges: [],
    cleared: false,
    x: count > 1 ? col / (count - 1) : 0.5,
  });

  // --- стартовый ряд: три обычных боя на выбор ---
  const first = [];
  const firstCount = 3;
  for (let c = 0; c < firstCount; c++) {
    const n = mkNode(0, c, firstCount, 'battle');
    nodes.push(n); first.push(n);
  }

  // --- средние ряды ---
  let prev = first;
  for (let row = 1; row < rows - 1; row++) {
    const count = rng.int(2, 4);
    const weights = typeWeights(row, rows);
    const cur = [];
    for (let c = 0; c < count; c++) {
      const type = rng.weighted(weights, ([, w]) => w)[0];
      const n = mkNode(row, c, count, type);
      nodes.push(n); cur.push(n);
    }
    // связи: каждый предыдущий узел ведёт в 1–2 ближайших следующих
    for (const p of prev) {
      const ranked = cur.slice().sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
      const links = rng.chance(0.45) ? ranked.slice(0, 2) : ranked.slice(0, 1);
      for (const l of links) { p.edges.push(l.id); }
    }
    // гарантируем вход в каждый узел ряда
    for (const c of cur) {
      if (!prev.some((p) => p.edges.includes(c.id))) {
        const nearest = prev.slice().sort((a, b) => Math.abs(a.x - c.x) - Math.abs(b.x - c.x))[0];
        nearest.edges.push(c.id);
      }
    }
    prev = cur;
  }

  // --- босс ---
  const boss = mkNode(rows - 1, 0, 1, 'boss');
  nodes.push(boss);
  for (const p of prev) p.edges.push(boss.id);

  return {
    sector, rows, nodes,
    entry: first.map((n) => n.id),
    bossId: boss.id,
  };
}

export function nodeById(map, id) { return map.nodes.find((n) => n.id === id) || null; }

/**
 * Куда можно пойти из текущего узла (или со старта, если узла ещё нет).
 *
 * Зачищенные узлы остаются проходимыми: карта — связный граф, и если убрать из
 * выбора уже пройденное, забег упирается в тупик сразу после того, как игрок
 * зачистил всех детей. Проход через зачищенный узел не перезапускает бой —
 * он просто открывает его детей дальше.
 */
export function availableNodes(map, currentId) {
  if (!currentId) return map.entry.map((id) => nodeById(map, id)).filter(Boolean);
  const cur = nodeById(map, currentId);
  if (!cur) return [];
  return cur.edges.map((id) => nodeById(map, id)).filter(Boolean);
}

/** Достигнуты ли все узлы ряда — нужна только для подписи карты. */
export function rowsCleared(map) {
  const cleared = new Set(map.nodes.filter((n) => n.cleared).map((n) => n.row));
  return cleared.size;
}

/** Проверка целостности карты: из старта достижим босс, висячих узлов нет. */
export function validateSector(map) {
  const problems = [];
  const byId = new Map(map.nodes.map((n) => [n.id, n]));
  for (const n of map.nodes) {
    for (const e of n.edges) if (!byId.has(e)) problems.push(`узел ${n.id} ведёт в несуществующий ${e}`);
  }
  for (const n of map.nodes) {
    if (n.row > 0 && n.row < map.rows - 1) {
      const prev = map.nodes.filter((p) => p.row === n.row - 1);
      if (!prev.some((p) => p.edges.includes(n.id))) problems.push(`в узел ${n.id} (ряд ${n.row}) нет входа`);
    }
  }
  // достижимость босса
  const seen = new Set(map.entry);
  const queue = [...map.entry];
  while (queue.length) {
    const n = byId.get(queue.shift());
    if (!n) continue;
    for (const e of n.edges) if (!seen.has(e)) { seen.add(e); queue.push(e); }
  }
  if (!seen.has(map.bossId)) problems.push('босс недостижим из старта');
  return { ok: problems.length === 0, problems };
}
