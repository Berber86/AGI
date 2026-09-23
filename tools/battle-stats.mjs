/**
 * Динамика боя: длина, урон лидеру за раунд и доля «пустых» фаз атаки.
 *
 * Прогоняет одни и те же бои дважды — с очками командования и с снятыми
 * лимитами (cfg.cp = 99 и cfg.cpDef = 99), — поэтому колонка «выкл» является
 * честным базлайном, а не замером другой версии правил. Без второго прогона
 * сравнение незаметно превращается в сравнение с чем попало: при отключении
 * только cfg.cp оборона оставалась ограниченной и базлайн «улучшался» сам собой.
 *
 *   node tools/battle-stats.mjs [боёв на эпоху]
 */
import { createBattle, startTurn, beginCombat, resolveCombat, endTurn, side, isAlive, cpBudget, attackers } from '../src/engine/battle.js';
import { aiPlayOne, aiDeclareAttack } from '../src/engine/ai.js';
import { buildRival, generateWorld } from '../src/engine/civ.js';
import { makeRng } from '../src/engine/rng.js';

function runBattle(era, seed, unlimited = false) {
  const w = generateWorld(`cp:${seed}`, 1);
  const reg = w.regions.find((r) => r.era === era) || w.regions[0];
  const a = buildRival(reg, makeRng(`a${seed}${era}`), 1);
  const bRegion = w.regions.find((r) => r.era === era && r !== reg) || reg;
  const bR = buildRival(bRegion, makeRng(`b${seed}${era}`), 1);
  const b = createBattle({
    era, seed: `cp${seed}${era}`,
    sides: {
      me: { name: a.name, deck: a.deck, color: a.color },
      foe: { name: bR.name, deck: bR.deck, color: bR.color },
    },
  });

  // режим сравнения: огромный бюджет ⇒ очки командования ничего не ограничивают
  if (unlimited) b.cfg = { ...b.cfg, cp: 99, cpDef: 99 };
  let phases = 0, zeroDmg = 0, dmgTotal = 0, attackersTotal = 0, boardTotal = 0, budgetTotal = 0;
  startTurn(b);
  let guard = 0;
  while (!b.over && guard++ < 1200) {
    const cur = b.active;
    let played = 0;
    while (aiPlayOne(b, cur) && played++ < 16) { /* главная фаза */ }
    if (b.phase.startsWith('main')) {
      beginCombat(b);
      aiDeclareAttack(b, cur);
      const before = { me: side(b, 'me').leader.hp, foe: side(b, 'foe').leader.hp };
      const declared = attackers(b).length;
      const boardSize = side(b, cur).board.filter(isAlive).length;
      const budget = cpBudget(b, cur);
      resolveCombat(b);
      const after = { me: side(b, 'me').leader.hp, foe: side(b, 'foe').leader.hp };
      const dmg = Math.max(0, (before.me - after.me) + (before.foe - after.foe));
      phases++;
      if (dmg === 0) zeroDmg++;
      dmgTotal += dmg;
      attackersTotal += declared;
      boardTotal += boardSize;
      budgetTotal += budget;
      let more = 0;
      while (aiPlayOne(b, cur) && more++ < 16) { /* вторая главная */ }
    }
    endTurn(b);
  }
  return { rounds: b.round, phases, zeroDmg, dmgTotal, attackersTotal, boardTotal, budgetTotal, winner: b.over?.winner };
}

function measure(unlimited) {
  const rows = [];
  for (let era = 1; era <= 6; era++) {
    const acc = { rounds: 0, phases: 0, zero: 0, dmg: 0, atk: 0, board: 0, budget: 0 };
    const N = Number(process.argv[2]) || 60;
    for (let i = 0; i < N; i++) {
      const r = runBattle(era, i, unlimited);
      acc.rounds += r.rounds; acc.phases += r.phases; acc.zero += r.zeroDmg;
      acc.dmg += r.dmgTotal; acc.atk += r.attackersTotal; acc.board += r.boardTotal; acc.budget += r.budgetTotal;
    }
    rows.push({
      era,
      rounds: acc.rounds / N,
      zeroPct: 100 * acc.zero / Math.max(1, acc.phases),
      dmgPerRound: acc.dmg / Math.max(1, acc.rounds),
      atkPerPhase: acc.atk / Math.max(1, acc.phases),
      boardPerPhase: acc.board / Math.max(1, acc.phases),
      budget: acc.budget / Math.max(1, acc.phases),
      commitPct: 100 * acc.atk / Math.max(1, acc.board),
    });
  }
  return rows;
}

const off = measure(true);    // очки командования не ограничивают
const on = measure(false);    // настоящие бюджеты
const f = (x, n = 1) => x.toFixed(n);
console.log('вкл — очки командования действуют, выкл — лимиты сняты (базлайн)');
console.log('эпоха | раунды вкл/выкл | фаз атаки без урона лидеру вкл/выкл | урон лидеру за раунд вкл/выкл | атакующих/фазу вкл/выкл | юнитов на поле | бюджет атаки | доля поля в атаке вкл/выкл');
for (let i = 0; i < on.length; i++) {
  const a = on[i], o = off[i];
  console.log(`  ${a.era}   |  ${f(a.rounds)} / ${f(o.rounds)}  |   ${f(a.zeroPct,0)}% / ${f(o.zeroPct,0)}%   |   ${f(a.dmgPerRound,2)} / ${f(o.dmgPerRound,2)}  |   ${f(a.atkPerPhase,2)} / ${f(o.atkPerPhase,2)}   | ${f(a.boardPerPhase,2)} | ${f(a.budget)} |   ${f(a.commitPct,0)}% / ${f(o.commitPct,0)}%`);
}
