import { suite, test, ok, eq, ne, ge, le } from './harness.mjs';
import * as S from '../src/engine/state.js';
import { DISCOVERIES, DISCOVERY_LIST } from '../src/engine/discoveries.js';
import { eraOf, MAX_ERA } from '../src/engine/gears.js';
import { generateCard } from '../src/engine/cardgen.js';
import { vetTier, makeUnit, grantExperience, effectiveBlueprint } from '../src/engine/units.js';
import { createBattle, startTurn } from '../src/engine/battle.js';
import { autoplay } from '../src/engine/autoplay.js';
import { canAttackRegion } from '../src/engine/civ.js';

const fresh = (over = {}) => S.newGame({ civName: 'Тест', seed: 'test-seed', legacy: 'craft', difficulty: 1, ...over });

suite('Партия: старт');

test('новая партия стартует в первой эпохе с колодой и ростером', () => {
  const st = fresh();
  eq(st.era, 1);
  eq(st.conquered, 0);
  ge(st.science, 1);
  ge(st.materials, 1);
  ge(st.roster.length, eraOf(1).deckSize, 'ростер должен покрывать стартовую колоду');
  eq(st.deck.length, eraOf(1).deckSize);
  eq(st.victory, false);
});

test('старт с разных Наследий даёт разные стартовые открытия', () => {
  const a = fresh({ legacy: 'war' });
  const b = fresh({ legacy: 'life' });
  ne(JSON.stringify(a.researched), JSON.stringify(b.researched));
  ok(a.researched.includes('bronze'), 'Наследие Войны даёт Бронзу');
  ok(b.researched.includes('agriculture'), 'Наследие Жизни даёт Земледелие');
});

test('один и тот же сид ⇒ идентичная партия', () => {
  const a = fresh({ seed: 'same' });
  const b = fresh({ seed: 'same' });
  eq(JSON.stringify(a.world.regions.map((r) => r.civ.name)), JSON.stringify(b.world.regions.map((r) => r.civ.name)));
  eq(JSON.stringify(a.roster.map((u) => u.blueprint.name)), JSON.stringify(b.roster.map((u) => u.blueprint.name)));
});

test('карта мира: десять регионов, эпохи растут к Сердцевине', () => {
  const st = fresh();
  eq(st.world.regions.length, 10);
  eq(st.world.regions.filter((r) => r.boss).length, 1);
  const boss = st.world.regions.find((r) => r.boss);
  eq(boss.era, MAX_ERA);
  eq(boss.name, 'Сердцевина', 'финальный регион называется Сердцевина — так говорит сообщение о победе');
  eq(new Set(st.world.regions.map((r) => r.name)).size, st.world.regions.length, 'имена регионов не повторяются');
  for (const r of st.world.regions) {
    ge(r.era, 1); le(r.era, 6);
    ok(r.civ.name && r.civ.domains.length >= 1);
    ge(r.reward.science, 1);
  }
});

test('атаковать можно только земли с эпохой не выше своей +1', () => {
  const st = fresh();
  eq(canAttackRegion(st, st.world.regions.find((r) => r.era === 1)), true);
  eq(canAttackRegion(st, st.world.regions.find((r) => r.era === 2)), true);
  eq(canAttackRegion(st, st.world.regions.find((r) => r.era === 3)), false);
  eq(canAttackRegion(st, st.world.regions.find((r) => r.boss)), false);
});

suite('Партия: наука');

test('нельзя изучить неизученных предшественников, чужую эпоху и дважды', () => {
  const st = fresh();
  eq(S.canResearch(st, 'phalanx').ok, false, 'Фаланга требует Железо');
  eq(S.canResearch(st, 'chieftain').ok, false, 'уже изучено');
  eq(S.canResearch(st, 'iron').ok, false, 'вторая эпоха ещё не наступила');
  eq(S.canResearch(st, 'нет_такого').ok, false);
});

test('изучение списывает науку и открывает цепочку', () => {
  const st = fresh();
  st.science = 1000;
  ok(S.research(st, 'masonry').ok);
  eq(st.researched.includes('masonry'), true);
  ok(S.canResearch(st, 'iron').ok === false, 'Железо всё ещё за эпохой');
  st.era = 2;
  eq(S.canResearch(st, 'iron').ok, false, 'Железо требует Бронзу');
  ok(S.research(st, 'bronze').ok);
  eq(S.canResearch(st, 'iron').ok, true);
  const before = st.science;
  S.research(st, 'iron');
  eq(before - st.science, DISCOVERIES.iron.cost);
  eq(S.canResearch(st, 'phalanx').ok, true, 'Фаланга открылась после Железа и Вождества');
});

test('смена эпохи требует науки, регионов и открытий своей эпохи', () => {
  const st = fresh();
  st.science = 99999;
  let chk = S.canAdvanceEra(st);
  eq(chk.ok, false, 'регионов ещё нет');
  st.conquered = 5;
  chk = S.canAdvanceEra(st);
  eq(chk.ok, true);
  const era0 = st.era;
  ok(S.advanceEra(st).ok);
  eq(st.era, era0 + 1);
  ok(st.science < 99999, 'смена эпохи стоит науки');
});

test('в последней эпохе дальше идти некуда', () => {
  const st = fresh();
  st.era = MAX_ERA;
  eq(S.canAdvanceEra(st).ok, false);
});

suite('Партия: мастерская и ростер');

test('проектирование требует изученных открытий и материалов', () => {
  const st = fresh();
  eq(S.canCraft(st, ['iron']).ok, false, 'Железо не изучено');
  ok(S.canCraft(st, ['bronze']).ok === false || st.researched.includes('bronze'), 'Бронза может быть не изучена на старте');
  st.researched.push('bronze');
  st.materials = 5000;
  const chk = S.canCraft(st, ['bronze']);
  eq(chk.ok, true, chk.reason);
  const r = S.craft(st, ['bronze']);
  eq(r.ok, true);
  ok(st.blueprints[r.bp.key]);
  eq(S.canCraft(st, ['bronze']).ok, false, 'повторно проектировать нельзя — нужно нанимать');
});

test('найм создаёт юнитов и тратит материалы', () => {
  const st = fresh();
  st.materials = 5000;
  const key = Object.keys(st.blueprints)[0];
  const before = st.roster.length;
  const price = S.unitCost(st, key);
  ok(S.recruit(st, key, 3).ok);
  eq(st.roster.length, before + 3);
  eq(st.materials, 5000 - price * 3);
});

test('найм не уходит в минус', () => {
  const st = fresh();
  st.materials = 1;
  const key = Object.keys(st.blueprints)[0];
  const before = st.roster.length;
  eq(S.recruit(st, key, 1).ok, false);
  eq(st.roster.length, before);
  ge(st.materials, 0);
});

test('расформирование возвращает половину стоимости', () => {
  const st = fresh();
  st.materials = 100;
  const u = st.roster[0];
  const price = S.unitCost(st, u.bpKey);
  const n = st.roster.length;
  ok(S.disband(st, u.id));
  eq(st.roster.length, n - 1);
  eq(st.materials, 100 + Math.round(price * 0.5));
});

test('нераспределённый юнит не остаётся в колоде', () => {
  const st = fresh();
  const id = st.deck[0];
  S.disband(st, id);
  eq(st.deck.includes(id), false);
});

suite('Партия: колода');

test('колода ограничена эпохой и проверяется на минимум', () => {
  const st = fresh();
  const lim = S.deckLimits(st);
  eq(lim.max, eraOf(1).deckSize);
  eq(S.setDeck(st, [st.roster[0].id]).ok, false, 'слишком мало юнитов');
  eq(S.setDeck(st, st.roster.map((u) => u.id).concat(['нет'])).ok, st.roster.length > lim.max ? false : true);
});

test('автосбор даёт валидную колоду с рабочей кривой', () => {
  const st = fresh();
  st.materials = 9000; st.science = 9000; st.era = 3;
  for (const id of ['masonry', 'bronze', 'iron', 'phalanx', 'steel', 'longbow', 'chivalry', 'clockwork']) S.research(st, id);
  for (const comps of [['bronze'], ['phalanx', 'iron'], ['steel', 'iron'], ['longbow', 'chivalry'], ['clockwork', 'steel'], ['masonry', 'wheel']]) {
    const r = S.craft(st, comps);
    if (r.ok) S.recruit(st, r.bp.key, 3);
  }
  const res = S.autoDeck(st);
  eq(res.ok, true, res.reason);
  const info = S.deckInfo(st);
  eq(info.valid, true);
  eq(info.count, S.deckLimits(st).max);
  ge(Object.keys(info.curve).length, 1);
  ge(info.avgCost, 1);
});

test('с ростом эпохи колода становится больше', () => {
  const st = fresh();
  const sizes = [];
  for (let era = 1; era <= 6; era++) { st.era = era; sizes.push(S.deckLimits(st).max); }
  for (let i = 1; i < sizes.length; i++) ok(sizes[i] > sizes[i - 1], 'колода должна расти');
});

suite('Партия: опыт и ветеранство');

test('опыт растёт и на третьем уровне отпирает спящее свойство', () => {
  const bp = generateCard(['musket', 'linear_tac', 'steel']);
  ok(bp, 'не собрался тестовый проект');
  const u = makeUnit(bp);
  eq(vetTier(u), 0);
  grantExperience(u, { won: true, died: false });
  grantExperience(u, { won: true, died: false });
  eq(vetTier(u), 2);
  const eff = effectiveBlueprint(u);
  eq(eff.atk, bp.atk + 2);
  eq(eff.hp, bp.hp + 2);
  grantExperience(u, { won: true, died: false });
  eq(vetTier(u), 3);
  const eff3 = effectiveBlueprint(u);
  if (bp.unusedKeywords.length) {
    eq(eff3.keywords.length, bp.keywords.length + 1, 'легенда должна отпирать спящее свойство');
    eq(eff3.keywords.at(-1).name, bp.unusedKeywords[0].name);
  }
});

test('павшие в бою юниты возвращаются в ростер живыми', () => {
  const st = fresh();
  st.materials = 9000;
  const before = st.roster.length;
  const deckBefore = st.deck.length;
  const region = st.world.regions.find((r) => r.era === 1);
  const sb = S.startBattle(st, region.id);
  eq(sb.ok, true, sb.reason);
  autoplay(sb.battle);
  const fallen = sb.battle.sides.me.grave.length;
  S.finishBattle(st, sb.battle, sb.battle.over?.winner === 'me' ? 'win' : 'lose');
  eq(st.roster.length, before, 'ростер не должен терять юнитов');
  eq(st.deck.length, deckBefore, 'колода не должна терять юнитов');
  ge(fallen, 0);
  const alive = st.roster.every((u) => u.blueprint && u.blueprint.hp >= 1);
  ok(alive, 'все юниты снова живы');
});

suite('Партия: бой и награды');

test('нельзя воевать без валидной колоды', () => {
  const st = fresh();
  st.deck = [];
  const r = S.startBattle(st, st.world.regions.find((x) => x.era === 1).id);
  eq(r.ok, false);
  ok(/колод/i.test(r.reason), r.reason);
});

test('нельзя атаковать закрытый по эпохе регион', () => {
  const st = fresh();
  const boss = st.world.regions.find((r) => r.boss);
  const r = S.startBattle(st, boss.id);
  eq(r.ok, false);
});

test('победа присоединяет регион, даёт награду и трофей', () => {
  const st = fresh();
  st.materials = 9000;
  const region = st.world.regions.find((r) => r.era === 1);
  const sb = S.startBattle(st, region.id);
  eq(sb.ok, true, sb.reason);
  const sci = st.science, mat = st.materials;
  S.finishBattle(st, sb.battle, 'win');
  eq(region.conquered, true);
  eq(st.conquered, 1);
  ok(st.science > sci);
  ok(st.materials > mat);
  eq(st.stats.wins, 1);
  eq(st.victory, false);
});

test('нельзя воевать за уже присоединённый регион', () => {
  const st = fresh();
  const region = st.world.regions.find((r) => r.era === 1);
  const sb = S.startBattle(st, region.id);
  S.finishBattle(st, sb.battle, 'win');
  eq(S.startBattle(st, region.id).ok, false);
});

test('поражение даёт частичный доход и не отбирает юнитов', () => {
  const st = fresh();
  const region = st.world.regions.find((r) => r.era === 1);
  const sb = S.startBattle(st, region.id);
  const n = st.roster.length;
  const sci = st.science;
  S.finishBattle(st, sb.battle, 'lose');
  eq(region.conquered, false);
  eq(st.roster.length, n);
  ok(st.science >= sci, 'доход всё равно начисляется');
  eq(st.stats.losses, 1);
});

test('три поражения подряд вызывают мобилизацию', () => {
  const st = fresh();
  const region = st.world.regions.find((r) => r.era === 1);
  for (let i = 0; i < 3; i++) {
    const sb = S.startBattle(st, region.id);
    S.finishBattle(st, sb.battle, 'lose');
  }
  eq(st.defeatStreak, 0, 'после мобилизации счётчик сбрасывается');
  ok(st.messages.some((m) => /Мобилизация/.test(m.text)), 'должно быть сообщение о мобилизации');
});

test('взятие Сердцевины завершает партию победой', () => {
  const st = fresh();
  st.era = MAX_ERA;
  const boss = st.world.regions.find((r) => r.boss);
  eq(canAttackRegion(st, boss), true);
  st.materials = 99999;
  // набираем юнитов, чтобы колода последней эпохи была валидной
  const keys = Object.keys(st.blueprints);
  for (let i = 0; i < 40; i++) S.recruit(st, keys[i % keys.length], 1);
  S.autoDeck(st);
  const sb = S.startBattle(st, boss.id);
  eq(sb.ok, true, sb.reason);
  eq(sb.battle.era, MAX_ERA);
  S.finishBattle(st, sb.battle, 'win');
  eq(st.victory, true);
  eq(st.conquered, 1);
});

test('мирный ход «Развитие» даёт доход без боя', () => {
  const st = fresh();
  const sci = st.science, mat = st.materials;
  const inc = S.develop(st);
  eq(st.science, sci + inc.science);
  eq(st.materials, mat + inc.materials);
  eq(st.stats.turns, 1);
  eq(st.stats.battles, 0);
});

test('сохранение и загрузка не теряют данные', () => {
  const st = fresh();
  st.materials = 9000;
  S.craft(st, ['wheel', 'stonework']);
  S.recruit(st, Object.keys(st.blueprints).at(-1), 2);
  const json = S.serialize(st);
  const back = JSON.parse(json);
  eq(back.roster.length, st.roster.length);
  eq(back.deck.length, st.deck.length);
  eq(back.era, st.era);
  eq(JSON.stringify(back.world.regions.map((r) => r.conquered)), JSON.stringify(st.world.regions.map((r) => r.conquered)));
  eq(back.blueprints[Object.keys(back.blueprints)[0]].name, st.blueprints[Object.keys(st.blueprints)[0]].name);
  // восстановленная партия playable
  back.materials = 99999;
  eq(S.autoDeck(back).ok, true);
});

test('корректная десериализация отвергает чужой формат', () => {
  let threw = false;
  try { S.deserialize('{"v":99}'); } catch { threw = true; }
  ok(threw);
});
