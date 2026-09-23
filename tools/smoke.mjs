// Инструмент разработчика: прогон ИИ-против-ИИ, чтобы мерить длину боёв.
import { createBattle, startTurn, resolveCombat, endTurn, battleSummary } from '../src/engine/battle.js';
import { generateWorld, buildRival, applyDifficulty } from '../src/engine/civ.js';
import { aiPlayOne, aiDeclareAttack } from '../src/engine/ai.js';
import { makeRng } from '../src/engine/rng.js';

export function simulate(seed, era, difficulty = 1) {
  const world = generateWorld(seed, difficulty);
  const region = world.regions.find((r) => r.era === era) || world.regions[0];
  const rng = makeRng(`${seed}:${era}`);
  const me = applyDifficulty(buildRival({ ...region, civ: { ...region.civ, name: 'Игрок' } }, rng.fork('a'), difficulty), difficulty);
  const foe = applyDifficulty(buildRival(region, rng.fork('b'), difficulty), difficulty);
  me.isHuman = false; foe.isHuman = false;
  const b = createBattle({ era, seed: `${seed}-${era}`, sides: { me, foe }, first: 'me' });
  startTurn(b);
  let steps = 0;
  while (!b.over && steps++ < 800) {
    const cur = b.active;
    let played = 0;
    while (aiPlayOne(b, cur) && played++ < 14) { /* выставление */ }
    if (b.phase.startsWith('main')) {
      aiDeclareAttack(b, cur);
      resolveCombat(b);
      while (aiPlayOne(b, cur) && played++ < 16) { /* вторая главная */ }
    }
    endTurn(b);
  }
  return { b, s: battleSummary(b), steps, winner: b.over?.winner ?? 'timeout' };
}

export function measure(era, n = 20) {
  let sum = 0; const wins = {};
  for (let i = 0; i < n; i++) {
    const r = simulate(`s${i}`, era);
    sum += r.s.round;
    wins[r.winner] = (wins[r.winner] || 0) + 1;
  }
  return { avgRounds: sum / n, wins };
}

const isMain = process.argv[1] && /smoke\.mjs$/.test(process.argv[1]);
if (isMain) {
  const t0 = Date.now();
  for (let era = 1; era <= 6; era++) {
    const m = measure(era, 25);
    console.log(`Эпоха ${era}: раундов ${m.avgRounds.toFixed(1)} | исходы ${JSON.stringify(m.wins)}`);
  }
  console.log('время:', Date.now() - t0, 'мс');

  const r = simulate('demo', 3);
  console.log('\n--- ЛОГ БОЯ (эпоха 3), первые 60 строк ---');
  console.log(r.b.log.map((l) => l.text).slice(0, 60).join('\n'));
  console.log(`...всего ${r.b.log.length} строк | раундов ${r.s.round} | победитель ${r.winner}`);
}
