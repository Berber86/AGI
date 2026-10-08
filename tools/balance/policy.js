/**
 * Общая политика хода для стендов: разыгрывает самые дорогие доступные карты, затем бьёт лучшим
 * разменом (та же оценка, что у вражеского ИИ движка, — стенд не должен давать одной стороне
 * тактическое преимущество). Используется для ОБЕИХ сторон в зеркальных замерах и для той стороны
 * игрока в стендах кампании; врага в стендах кампании ведёт настоящий enemyAct из движка.
 */
function makePolicy(api) {
  const I = api.__internals;
  function actSide(b, side) {
    if (b.over || b.active !== side) return false;
    const p = b[side];
    const oppSide = side === 'me' ? 'enemy' : 'me';
    const freeSlot = (ri) => {
      const row = api.rowArray(p, ri);
      const free = [];
      for (let i = 0; i < row.length; i++) if (!row[i]) free.push(i);
      if (!free.length) return -1;
      const theirs = new Set(api.unitsOf(b, oppSide).filter(s => s.unit.curHp > 0).map(s => s.i));
      const holes = free.filter(i => theirs.has(i) && api.hasGapAt(b, side, i));
      return holes.length ? holes[0] : free[0];
    };
    const rowOrder = (c) => {
      const all = Array.from({ length: api.rowCount(p) }, (_, ri) => ri);
      return c.card_type === 'structure' || !I.standsDeep(c) ? all.filter(ri => api.canStandInRow(c, p, ri)) : [...all].reverse();
    };
    const playable = p.hand.map((c, i) => ({ c, i }))
      .filter(({ c }) => {
        if (c.drop_cost > p.energy) return false;
        if (c.card_type === 'spell') return api.spellHasTarget(b, side, c);
        return rowOrder(c).some(ri => freeSlot(ri) >= 0);
      })
      .sort((x, y) => y.c.drop_cost - x.c.drop_cost);
    if (playable.length) {
      const { c, i } = playable[0];
      if (c.card_type === 'spell') return api.cast(b, side, i);
      const ri = rowOrder(c).find(r => freeSlot(r) >= 0);
      if (ri === undefined) return false;
      return api.deploy(b, side, i, ri, freeSlot(ri));
    }
    const attacks = api.unitsOf(b, side)
      .filter(s => api.canAct(b, side, s.unit))
      .map(s => ({ ...s, target: api.findTarget(b, s.unit, side) }))
      .filter(s => !!s.target)
      .map(s => ({ ...s, score: I.enemyAttackScore(b, side, s.unit, s.target) }))
      .sort((a, z) => z.score - a.score || api.costOf(b, a.unit) - api.costOf(b, z.unit) || a.unit.order - z.unit.order);
    const best = attacks[0];
    if (best && best.score > 0.05) return api.attackWith(b, side, best.unit.iid);
    return false;
  }
  /** Один ход стороны: разыгрывает и бьёт, пока хватает энергии и есть выгодные действия. */
  function playTurn(b, side) {
    let guard = 0;
    while (guard++ < 400 && !b.over && b.active === side) if (!actSide(b, side)) break;
  }
  /** Полный бой: ход игрока, ход врага (настоящим ИИ движка), пока есть кому ходить. */
  function runBattle(api, b, { enemyAi = true, maxTurns = 30 } = {}) {
    let guard = 0;
    while (!b.over && guard++ < maxTurns) {
      playTurn(b, 'me');
      if (b.over) break;
      api.endPlayerTurn(b);
      api.beginEnemyTurn(b);
      if (b.over) break;
      if (enemyAi) { let g = 0; while (g++ < 400 && !b.over && b.active === 'enemy') if (!api.enemyAct(b)) break; }
      else playTurn(b, 'enemy');
      if (b.over) break;
      api.beginPlayerTurn(b);
    }
    return b;
  }
  return { actSide, playTurn, runBattle };
}
module.exports = { makePolicy };
