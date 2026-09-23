// =============================================================================
//  tools/predict.mjs — сходимость прогноза с реальным боем
//
//  Прогноз интерфейса считается на копии боя (cloneBattle → resolveCombat).
//  Если копия хоть в чём-то расходится с оригиналом, игрок увидит неверные
//  цифры — это худший из возможных багов в игре, где решения принимаются
//  по этим цифрам. Инструмент гоняет настоящие бои ИИ-против-ИИ и на каждом
//  объявлении атаки: (1) предсказывает исход, (2) разрешает бой теми же
//  блоками, (3) сверяет. Расхождение допустимо только когда прогноз сам
//  помечен как приблизительный (свойства со случайной целью).
//
//  Запуск: node tools/predict.mjs [боёв на эпоху]   (по умолчанию 8 × 6 эпох)
// =============================================================================

import {
  createBattle, startTurn, endTurn, beginCombat, resolveCombat,
  autoBlock, other, side, predictCombat, predictUnblocked, attackers, isAlive,
} from '../src/engine/battle.js';
import { generateWorld, buildRival, applyDifficulty } from '../src/engine/civ.js';
import { aiPlayOne, aiDeclareAttack } from '../src/engine/ai.js';
import { makeRng } from '../src/engine/rng.js';

const PER_ERA = Number(process.argv[2] || 8);
const MAX_STEPS = 600;

const hpOf = (b, id) => side(b, id).leader.hp;

function oneBattle(seed, era, acc) {
  const world = generateWorld(seed, 1);
  const region = world.regions.find((r) => r.era === era) || world.regions[0];
  const rng = makeRng(`${seed}:${era}`);
  const me = applyDifficulty(buildRival({ ...region, civ: { ...region.civ, name: 'Игрок' } }, rng.fork('a'), 1), 1);
  const foe = applyDifficulty(buildRival(region, rng.fork('b'), 1), 1);
  me.isHuman = false; foe.isHuman = false;

  const b = createBattle({ era, seed: `${seed}-${era}`, sides: { me, foe }, first: 'me' });
  startTurn(b);

  let steps = 0;
  while (!b.over && steps++ < MAX_STEPS) {
    const cur = b.active;
    let played = 0;
    while (aiPlayOne(b, cur) && played++ < 14) { /* главная фаза */ }

    if (b.phase.startsWith('main')) {
      beginCombat(b);
      aiDeclareAttack(b, cur);

      const live = attackers(b).filter(isAlive);
      if (live.length) {
        const def = other(cur);

        // --- прогноз «если не блокировать» (так его показывает этап объявления) ---
        // predictUnblocked — быстрая сумма атак; predictCombat(b, {}) — тот же
        // случай, но честно прогнанный движком. Инвариант: они обязаны совпасть,
        // иначе этап объявления атаки показывает одно, а консоль блока — другое.
        const snapU = predictUnblocked(b);
        const snapNone = predictCombat(b, {});
        if (!snapNone.approximate) {
          acc.unblocked++;
          if (snapNone.damageToDefender === snapU.dmg) acc.unblockedExact++;
          else if (acc.failures.length < 6) {
            acc.mismatch++;
            acc.failures.push({
              seed, era, round: b.round, расхождение: 'unblocked',
              быстрая_сумма: snapU.dmg, точный_прогон: snapNone.damageToDefender,
              атакующих: snapU.names.length,
            });
          }
        }

        // --- назначаем блоки и прогнозируем именно этот вариант ---
        const plan = autoBlock(b, def);
        const hpBefore = { me: hpOf(b, 'me'), foe: hpOf(b, 'foe') };
        const snap = predictCombat(b, plan);

        // --- разрешаем настоящий бой теми же блоками ---
        resolveCombat(b);

        for (const id of ['me', 'foe']) {
          const predicted = snap.leaderDelta[id];
          const real = hpOf(b, id) - hpBefore[id];
          acc.total++;
          if (snap.approximate) acc.approximate++; else acc.exact++;
          if (!snap.approximate && predicted !== real) {
            acc.mismatch++;
            if (acc.failures.length < 6) {
              acc.failures.push({
                seed, era, round: b.round, side: id,
                предсказано: predicted, реально: real,
                блоки: Object.values(plan).filter((v) => v && v.length).length,
                потери_прогноз: snap.losses[id].map((l) => l.name),
              });
            }
          }
        }
        // флаг завершения боя обязан совпадать при точном прогнозе
        if (!snap.approximate && !!snap.over !== !!b.over && acc.failures.length < 6) {
          acc.mismatch++;
          acc.failures.push({ seed, era, round: b.round, расхождение: 'over', прогноз: !!snap.over, реально: !!b.over });
        }
      } else {
        resolveCombat(b);
      }
      let more = 0;
      while (aiPlayOne(b, cur) && more++ < 14) { /* вторая главная */ }
    }
    endTurn(b);
  }
  return b;
}

const acc = { total: 0, exact: 0, approximate: 0, mismatch: 0, unblocked: 0, unblockedExact: 0, failures: [] };
const t0 = Date.now();
let battles = 0;
for (let era = 1; era <= 6; era++) {
  for (let i = 0; i < PER_ERA; i++) oneBattle(`p${era}-${i}`, era, acc), battles++;
}

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
console.log(`боёв: ${battles} · время: ${Date.now() - t0} мс`);
console.log(`объявлений атаки: ${acc.total} прогнозов лидеров`);
console.log(`  точных:        ${acc.exact} (${pct(acc.exact, acc.total)}%)`);
console.log(`  приблизительных: ${acc.approximate} (${pct(acc.approximate, acc.total)}%) — свойства со случайной целью`);
console.log(`  РАСХОЖДЕНИЙ:   ${acc.mismatch}`);
console.log(`инвариант «без блока»: ${acc.unblockedExact}/${acc.unblocked} точных случаев — быстрая сумма атак совпала с прогоном движком (${pct(acc.unblockedExact, acc.unblocked)}%)`);

if (acc.failures.length) {
  console.log('\nПримеры расхождений:');
  for (const f of acc.failures) console.log(' ', JSON.stringify(f));
}
if (!acc.mismatch) console.log('\n✅ Прогноз сходится с боем везде, где обещает точность');
process.exit(acc.mismatch ? 1 : 0);
