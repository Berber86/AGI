/**
 * Кто сильнее в каждом бою: мощность флота игрока против мощности противника.
 *
 * Нужен, чтобы отличить «бот плохо играет» от «кривая сложности выше кривой
 * роста игрока». Без этого настройка превращается в подкручивание чисел на глаз:
 * предыдущая попытка дала 39% побед в боях при 1% побед в забегах, и причина
 * была не видна из итоговых процентов.
 *
 *   node tools/power.mjs [забегов]
 */

import { newRun, choices, enterNode, finishBattle, cargoSpace, takeLoot, flagship, cargo } from '../src/engine/run.js';
import { autoBattle } from '../src/engine/ai.js';
import { battleReport, unitsOf } from '../src/engine/combat.js';
import { shipPower, computeStats } from '../src/engine/ship.js';
import { moduleScore } from '../src/engine/modules.js';

const rows = [];

function unitPower(u) {
  // мощность юнита в бою = мощность его сборки с поправкой на текущие пробоины
  const base = shipPower(u.ship);
  const share = Math.max(0.05, (u.hull + u.shield) / Math.max(1, u.maxHull + u.maxShield));
  return base * share;
}

const N = Number(process.argv[2]) || 60;
for (let i = 0; i < N; i++) {
  const run = newRun({ seed: `сила-${i}`, hullKey: ['interceptor', 'corvette', 'frigate'][i % 3] });
  let steps = 0;
  while (!run.over && steps++ < 60) {
    const opts = choices(run);
    if (!opts.length) break;
    const pick = opts.find((n) => n.type === 'battle') || opts[0];
    const res = enterNode(run, pick.id);
    if (res.kind !== 'battle') { if (res.kind === 'anomaly') run.pendingAnomaly = null; continue; }
    const b = res.battle;
    const depth = run.depth + 1;   // ДО разрешения: finishBattle двигает счётчик
    const minePower = unitsOf(b, 'mine').reduce((a, u) => a + unitPower(u), 0);
    const foePower = unitsOf(b, 'foes').reduce((a, u) => a + unitPower(u), 0);
    const mineHull = unitsOf(b, 'mine').reduce((a, u) => a + u.hull / u.maxHull, 0) / Math.max(1, unitsOf(b, 'mine').length);
    autoBattle(b);
    const rep = battleReport(b, 'mine');
    const out = finishBattle(run, b, rep);
    rows.push({
      depth,
      tier: b.tier,
      mode: b.mode,
      ratio: minePower / Math.max(0.01, foePower),
      mineHull,
      win: out.win,
      actions: b.action,
      slots: flagship(run) ? computeStats(flagship(run)) && flagship(run).hullKey : '',
    });
    // трофеи берём лучшие по счёту
    if (run.pendingLoot) {
      const ranked = run.pendingLoot.candidates.slice().sort((x, y) => moduleScore(y.module) - moduleScore(x.module));
      takeLoot(run, ranked.slice(0, cargoSpace(run)).map((c) => c.module.uid));
    }
  }
}

// --- сводка по корзинам соотношения сил ---
const bins = [0, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 99];
console.log('отношение мощности игрока к врагу | боёв | побед | доля побед | средняя целость корпуса игрока');
for (let i = 0; i < bins.length - 1; i++) {
  const inBin = rows.filter((r) => r.ratio >= bins[i] && r.ratio < bins[i + 1]);
  if (!inBin.length) continue;
  const wins = inBin.filter((r) => r.win).length;
  const hull = inBin.reduce((a, r) => a + r.mineHull, 0) / inBin.length;
  const label = bins[i + 1] === 99 ? `≥${bins[i].toFixed(2)}` : `${bins[i].toFixed(2)}–${bins[i + 1].toFixed(2)}`;
  console.log(`${label.padEnd(35)} | ${String(inBin.length).padStart(5)} | ${String(wins).padStart(5)} | ${(100 * wins / inBin.length).toFixed(0).padStart(8)}% | ${(100 * hull).toFixed(0).padStart(30)}%`);
}

console.log('');
console.log('глубина | боёв | побед | доля | среднее отношение мощности | средняя целость корпуса');
for (let d = 1; d <= 8; d++) {
  const inD = rows.filter((r) => r.depth === d);
  if (!inD.length) continue;
  const wins = inD.filter((r) => r.win).length;
  const ratio = inD.reduce((a, r) => a + r.ratio, 0) / inD.length;
  const hull = inD.reduce((a, r) => a + r.mineHull, 0) / inD.length;
  console.log(`${String(d).padStart(7)} | ${String(inD.length).padStart(5)} | ${String(wins).padStart(5)} | ${(100 * wins / inD.length).toFixed(0).padStart(3)}% | ${ratio.toFixed(2).padStart(24)} | ${(100 * hull).toFixed(0).padStart(22)}%`);
}

console.log('');
const byTier = {};
for (const r of rows) { byTier[r.tier] = byTier[r.tier] || []; byTier[r.tier].push(r); }
console.log('тип боя | боёв | побед | доля | отношение мощности');
for (const t of Object.keys(byTier)) {
  const arr = byTier[t];
  const wins = arr.filter((r) => r.win).length;
  const ratio = arr.reduce((a, r) => a + r.ratio, 0) / arr.length;
  console.log(`${t.padEnd(7)} | ${String(arr.length).padStart(5)} | ${String(wins).padStart(5)} | ${(100 * wins / arr.length).toFixed(0).padStart(3)}% | ${ratio.toFixed(2)}`);
}
console.log(`\nвсего боёв ${rows.length}, побед ${rows.filter((r) => r.win).length} (${(100 * rows.filter((r) => r.win).length / Math.max(1, rows.length)).toFixed(0)}%)`);
