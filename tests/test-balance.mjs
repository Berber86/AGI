// Статистические проверки баланса: бои должны становиться длиннее от эпохи к эпохе,
// генератор — давать разнообразие, экономика — не давать тупиков.
import { suite, test, ok, eq, ge, le } from './harness.mjs';
import { createBattle, startTurn } from '../src/engine/battle.js';
import { autoplay } from '../src/engine/autoplay.js';
import { generateWorld, buildRival, applyDifficulty } from '../src/engine/civ.js';
import { makeRng } from '../src/engine/rng.js';
import { DISCOVERY_LIST } from '../src/engine/discoveries.js';
import { generateCard, compatible, checkCombination } from '../src/engine/cardgen.js';
import { eraOf, GEAR_IDS } from '../src/engine/gears.js';
import * as S from '../src/engine/state.js';

function avgRounds(era, n = 14) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const world = generateWorld(`bal${i}`, 1);
    const region = world.regions.find((r) => r.era === era) || world.regions[world.regions.length - 1];
    const rng = makeRng(`bal${i}-${era}`);
    const me = buildRival(region, rng.fork('a'), 1);
    const foe = buildRival(region, rng.fork('b'), 1);
    me.isHuman = false; foe.isHuman = false;
    const b = createBattle({ era, seed: `bal${i}-${era}`, sides: { me, foe }, first: 'me' });
    autoplay(b);
    sum += b.round;
  }
  return sum / n;
}

suite('Баланс');

test('бои становятся длиннее от эпохи к эпохе', () => {
  const r1 = avgRounds(1, 10);
  const r6 = avgRounds(6, 10);
  ok(r6 > r1, `эпоха VI (${r6.toFixed(1)} раундов) должна быть длиннее эпохи I (${r1.toFixed(1)})`);
});

test('ни один бой не затягивается навсегда (внезапная смерть работает)', () => {
  for (const era of [1, 4, 6]) {
    for (let i = 0; i < 6; i++) {
      const world = generateWorld(`z${era}-${i}`, 1);
      const region = world.regions.find((r) => r.era === era) || world.regions.at(-1);
      const rng = makeRng(`z${era}-${i}`);
      const me = buildRival(region, rng.fork('a'), 1);
      const foe = buildRival(region, rng.fork('b'), 1);
      me.isHuman = false; foe.isHuman = false;
      const b = createBattle({ era, seed: `z${era}-${i}`, sides: { me, foe }, first: 'me' });
      autoplay(b, { maxSteps: 2000 });
      ok(b.over, `эпоха ${era}, прогон ${i}: бой не завершился`);
      le(b.round, 32, `эпоха ${era}: слишком затянувшийся бой`);
    }
  }
});

test('сложность масштабирует соперника', () => {
  const world = generateWorld('diff', 1);
  const region = world.regions.find((r) => r.era === 4);
  const easy = applyDifficulty(buildRival(region, makeRng('d1'), 0.75), 0.75);
  const hard = applyDifficulty(buildRival(region, makeRng('d1'), 1.35), 1.35);
  const power = (r) => r.deck.reduce((s, u) => s + u.blueprint.atk + u.blueprint.hp, 0);
  ok(power(hard) > power(easy), 'сложный соперник должен быть сильнее');
});

test('генератор покрывает все шестерни и все эпохи', () => {
  const rng = makeRng('cover');
  const gears = new Set();
  const eras = new Set();
  const names = new Set();
  const kws = new Set();
  for (let i = 0; i < 3000; i++) {
    const ids = [];
    let guard = 0;
    const slots = 1 + rng.int(4);
    while (ids.length < slots && guard++ < 60) {
      const cand = DISCOVERY_LIST.filter((d) => !ids.includes(d.id) && ids.every((x) => compatible(x, d.id)));
      if (!cand.length) break;
      ids.push(rng.pick(cand).id);
    }
    if (ids.length !== slots) continue;
    const c = generateCard(ids);
    if (!c) continue;
    for (const g of Object.keys(c.gearCounts)) gears.add(g);
    eras.add(c.era);
    names.add(c.name);
    for (const k of c.keywords) kws.add(k.name);
  }
  eq(gears.size, GEAR_IDS.length, 'должны встречаться все шестерни');
  eq(eras.size, 6, 'должны встречаться все эпохи');
  ge(names.size, 120, 'имена должны быть разнообразными');
  ge(kws.size, 25, 'свойств должно быть много');
});

test('почти любой набор из 2 открытий либо совместим, либо честно отклонён', () => {
  const rng = makeRng('pairs2');
  let okCount = 0, bad = 0;
  for (let i = 0; i < 800; i++) {
    const a = rng.pick(DISCOVERY_LIST).id;
    const b = rng.pick(DISCOVERY_LIST).id;
    if (a === b) continue;
    const r = checkCombination([a, b]);
    if (r.ok) okCount++; else { bad++; ok(/зацеплен|разброс/.test(r.reason), 'непонятная причина: ' + r.reason); }
  }
  ge(okCount, 80, 'слишком мало совместимых пар — генератор будет тесным');
  ge(bad, 80, 'ограничение совместимости должно работать');
});

test('экономика партии не заходит в тупик: полная кампания играбельна', async () => {
  const { runCampaign } = await import('../tools/campaign.mjs');
  const { st, lines } = runCampaign('balance-test', { legacy: 'craft', maxTurns: 60 });
  eq(st.victory, true, 'бот должен выигрывать партию:\n' + lines.slice(-6).join('\n'));
  le(st.stats.battles, 30, 'партия не должна требовать десятков боёв');
  ge(st.researched.length, 20, 'по ходу партии должны изучаться открытия');
  ge(Object.keys(st.blueprints).length, 10, 'игрок должен спроектировать немало юнитов');
});

test('доход растёт с эпохой и числом регионов', () => {
  const st = S.newGame({ seed: 'econ', legacy: 'craft' });
  const base = S.ECONOMY.income(st).science;
  st.era = 6;
  const late = S.ECONOMY.income(st).science;
  ok(late > base, 'доход должен расти с эпохой');
  st.era = 1; st.conquered = 5;
  const wide = S.ECONOMY.income(st).science;
  ok(wide > base, 'доход должен расти с регионами');
});

test('стоимость смены эпохи достижима за разумное число мирных ходов', () => {
  const st = S.newGame({ seed: 'econ2', legacy: 'craft' });
  for (let era = 2; era <= 6; era++) {
    st.era = era - 1;
    st.conquered = S.ECONOMY.eraRegions[era];
    const inc = S.ECONOMY.income(st, S.ECONOMY.developShare).science;
    const cost = S.ECONOMY.eraAdvance[era];
    const turns = Math.ceil(cost / Math.max(1, inc));
    le(turns, 14, `эпоха ${era}: нужно ${turns} мирных ходов только на смену эпохи`);
  }
});
