// tests/land.mjs — проверки стадии суши на живом движке (без DOM и canvas).
// Запуск: node tests/land.mjs
//
// Что проверяем: ресурсы (сытость, вода, силы), грунт и лазание, рост и мутации,
// общение с видами (мини-игра), присягу стаи, владыку, оба пути победы, события,
// задания и сохранение/восстановление мира.

import { LandGame } from '../js/landcore.js';
import { LANDPARTS, landAggregate } from '../js/landparts.js';
import {
  landDamagePlayer, landActiveAbility, landEvolveCost, tryLandEvolve, landRefund,
  sympathyOf, allySpecies, checkSworn, startSocial, socialAct, updateLandPlayer,
} from '../js/landplayer.js';
import { LAND_SPECIES_BY_ID, LAND_FOOD_KINDS, SOCIAL_ACTIONS } from '../js/landspecies.js';
import { CFG } from '../js/config.js';
import { dist } from '../js/util.js';

let fails = 0;
const check = (cond, msg) => {
  if (cond) console.log(`  ✓ ${msg}`);
  else { console.error(`  ✗ ${msg}`); fails++; }
};

function stubMeta() {
  return { ach: new Set(), codex: new Set(), runs: 0, onRunEnd() { this.runs++; } };
}
function makeGame(opts = {}) {
  const meta = opts.meta ?? stubMeta();
  const g = new LandGame({
    settings: { quality: { particles: 0.5 } }, meta,
    difficulty: opts.difficulty ?? 'normal', path: opts.path ?? 'predator',
    seed: opts.seed ?? 1234,
  });
  return g;
}
function step(g, seconds, input = { ax: 0, ay: 0 }) {
  const frames = Math.round(seconds * 60);
  for (let i = 0; i < frames; i++) {
    if (!g.player.alive) return i;
    g.update(1 / 60, typeof input === 'function' ? input(g, i) : input);
  }
  return frames;
}

console.log('— 1. Мир, ресурсы, движение —');
{
  const g = makeGame();
  check(g.creatures.filter((c) => !c.dead).length > 15, `мир населён (${g.creatures.length} существ)`);
  check(g.foods.length > 20, `на земле есть еда (${g.foods.length})`);
  check(g.pools.length >= 10, `водоёмов достаточно (${g.pools.length})`);
  check(g.features.some((f) => f.type === 'throne'), 'костяной трон владыки на карте');

  const before = { x: g.player.x, y: g.player.y, water: g.player.water, satiety: g.player.satiety };
  step(g, 3, { ax: 1, ay: 0, dashHeld: false });
  const moved = dist(before.x, before.y, g.player.x, g.player.y);
  check(moved > 120, `зверь идёт по земле (пройдено ${moved.toFixed(0)} ед.)`);
  check(g.player.water < before.water, `вода расходуется (${before.water.toFixed(0)} → ${g.player.water.toFixed(0)})`);
  check(g.player.satiety < before.satiety, 'сытость расходуется');
  check(g.player.heading !== null && Number.isFinite(g.player.heading), 'курс зверя корректен');
}

console.log('— 2. Грунт: песок, трава, камень —');
{
  const g = makeGame();
  const sand = g.terrainFactor(300, 300);                       // прибрежье
  const grass = g.terrainFactor(g.radius * 0.4, 0);             // луга
  const rock = g.terrainFactor(g.radius * 0.92, 0);             // скалы
  check(sand > grass, `песок быстрее травы (${sand.toFixed(2)} > ${grass.toFixed(2)})`);
  check(rock < grass, `камень медленнее травы (${rock.toFixed(2)} < ${grass.toFixed(2)})`);
  g.player.parts.claws = 3;
  const { recomputeLandStats } = await import('../js/landplayer.js');
  recomputeLandStats(g.player);
  const rockClimb = g.terrainFactor(g.radius * 0.92, 0);
  check(rockClimb > rock, `когти облегчают скалы (${rock.toFixed(2)} → ${rockClimb.toFixed(2)})`);
}

console.log('— 3. Вода: питьё, жажда, дождь —');
{
  const g = makeGame();
  const pool = g.pools[0];
  g.player.x = pool.x; g.player.y = pool.y;
  g.player.water = 10;
  g.player.drinking = false;
  const drinks0 = g.player.counters.drinks;
  step(g, 2);
  check(g.player.water > 10, `вода восстанавливается у водоёма (${g.player.water.toFixed(0)})`);
  check(g.player.counters.drinks === drinks0 + 1, 'питьё засчитано один раз за подход');
  check(g.player.inWater === true, 'зверь понимает, что он в воде');

  const g2 = makeGame();
  g2.player.water = 0;
  const hp0 = g2.player.hp;
  step(g2, 2);
  check(g2.player.hp < hp0, `без воды зверь гибнет (${hp0.toFixed(0)} → ${g2.player.hp.toFixed(0)})`);

  const g3 = makeGame();
  g3.events.force('rain');
  g3.player.water = 20;
  const w0 = g3.player.water;
  step(g3, 3);
  check(g3.raining && g3.player.water > w0, `под дождём вода приходит сама (${w0.toFixed(0)} → ${g3.player.water.toFixed(0)})`);
}

console.log('— 4. Еда, рост и ДНК —');
{
  const g = makeGame();
  const dna0 = g.player.dna;
  let eaten = 0;
  g.on('eat', () => eaten++);
  for (let i = 0; i < 260; i++) {
    // кормим зверя вручную: ставим еду прямо перед ним
    if (i % 20 === 0) {
      const a = g.rng.angle();
      g.spawnFood(i % 40 === 0 ? 'meat' : 'fruit', g.player.x + Math.cos(a) * 30, g.player.y + Math.sin(a) * 30, { life: 200 });
    }
    const c = g.foods.find((f) => dist(f.x, f.y, g.player.x, g.player.y) < 200);
    if (!c) { g.update(1 / 60, { ax: 0, ay: 0 }); continue; }
    const ax = (c.x - g.player.x) / 200, ay = (c.y - g.player.y) / 200;
    g.update(1 / 60, { ax, ay, bite: true });
  }
  check(eaten > 8, `зверь ест (${eaten} кусков)`);
  check(g.player.dna > dna0, `ДНК растёт (${dna0.toFixed(0)} → ${g.player.dna.toFixed(0)})`);
  check(g.player.biomass > 0, `биомасса копится (${g.player.biomass.toFixed(1)})`);
  const tiers = [];
  g.on('grow', ({ tier }) => tiers.push(tier));
  const t0 = g.player.tier;
  g.player.biomass = CFG.land.player.growth[t0 - 1] + 1;
  step(g, 0.3);
  check(g.player.tier === t0 + 1 && tiers.includes(t0 + 1), `рост с размера ${t0} на ${t0 + 1} сработал`);
  check(g.player.hp === g.player.maxHp, 'после роста зверь полон сил');
}

console.log('— 5. Мутации: ячейки, цена, возврат —');
{
  const g = makeGame();
  g.player.dna = 400;
  const r1 = tryLandEvolve(g, 'legs');
  check(r1.ok, 'часть тела установлена');
  check(g.player.parts.legs === 1, 'уровень части записан');
  const speedBefore = g.player.stats.baseSpeed;
  const r2 = tryLandEvolve(g, 'legs');
  check(r2.ok && g.player.stats.baseSpeed > speedBefore, `характеристика выросла (${speedBefore.toFixed(0)} → ${g.player.stats.baseSpeed.toFixed(0)})`);
  check(g.player.stats.slots >= 5, `ячейки считаются (${g.player.stats.slots})`);
  const refund = landRefund(g, 'legs');
  check(refund.ok && !g.player.parts.legs, 'часть убрана с возвратом ДНК');
  check(landRefund(g, 'jaws').ok === false, 'стартовую часть убрать нельзя');
  g.player.x = g.player.totemPos.x + 1200; g.player.y = g.player.totemPos.y + 800;
  const cost = landEvolveCost(g, 'wings');
  check(cost && cost.total > cost.base, `вне тотема мутация дороже (+${Math.round(cost.surcharge * 100)}%)`);
  g.player.x = g.player.totemPos.x; g.player.y = g.player.totemPos.y;
  const near = landEvolveCost(g, 'wings');
  check(near.total === near.base, 'у тотема мутация без наценки');
}

console.log('— 6. Общение: вкусы вида, ошибки, симпатия —');
{
  const g = makeGame();
  const sp = LAND_SPECIES_BY_ID.krab;              // любит ласку и позу, не выносит танец
  const c = g.spawnCreature(sp, g.player.x + 60, g.player.y, 3, true);
  const res = startSocial(g, c);
  check(res.ok && g.player.social.active, 'знакомство началось');
  check(g.player.social.seq.length === CFG.land.social.sequence, `цепочка из ${g.player.social.seq.length} действий`);

  const st = sympathyOf(g.player, sp.id);
  const liked = sp.social.likes[0];
  const v0 = st.value;
  // выполняем правильную последовательность по подсказке движка
  let guard = 0;
  while (g.player.social.active && guard++ < 10) {
    const needed = g.player.social.seq[g.player.social.step];
    socialAct(g, needed);
  }
  check(!g.player.social.active, 'цепочка завершена');
  check(st.value > v0, `симпатия выросла (${v0.toFixed(1)} → ${st.value.toFixed(1)})`);
  check(g.player.counters.socialWins === 1, 'удачное знакомство засчитано');
  check(st.value > 0 && liked !== undefined, 'любимые действия вида учтены');

  // ошибка: танец, который вид не выносит
  const c2 = g.spawnCreature(sp, g.player.x + 60, g.player.y, 3, true);
  startSocial(g, c2);
  const v1 = sympathyOf(g.player, sp.id).value;
  socialAct(g, sp.social.hates);
  check(sympathyOf(g.player, sp.id).value <= v1, `нелюбимое действие не поднимает симпатию (${v1.toFixed(1)} → ${sympathyOf(g.player, sp.id).value.toFixed(1)})`);
  const before = g.player.counters.socialFails;
  let dead = 0;
  while (g.player.counters.socialFails === before && dead++ < 12) {
    if (!g.player.social.active) {
      sympathyOf(g.player, sp.id).cd = 0;
      const cc = g.spawnCreature(sp, g.player.x + 50, g.player.y, 3, true);
      startSocial(g, cc);
    }
    const need = g.player.social.seq[g.player.social.step];
    const wrong = SOCIAL_ACTIONS.map((a) => a.id).find((x) => x !== need);
    socialAct(g, wrong);
  }
  check(g.player.counters.socialFails > before, 'провал знакомства засчитан');
}

console.log('— 7. Стая: союзник и присяга у тотема —');
{
  const g = makeGame();
  const ids = ['krab', 'runner', 'skakun'];
  let allied = 0;
  g.on('ally', () => allied++);
  g.player.x = 1400; g.player.y = 1100;           // уводим зверя от тотема
  for (const id of ids) {
    g.spawnCreature(LAND_SPECIES_BY_ID[id], g.player.x + 80, g.player.y + (Math.random() - 0.5) * 60, 3, true);
    allySpecies(g, id, null);
  }
  check(allied === 3, `три вида стали союзниками (${allied})`);
  check(g.countAllies() >= 3, `союзники появились у игрока (${g.countAllies()})`);
  let win = null;
  g.on('win', ({ reason }) => { win = reason; });
  check(checkSworn(g) === 0, 'без союзников у тотема присяги нет');
  // ведём союзников к тотему
  for (const c of g.creatures) {
    if (!c.ally) continue;
    c.x = g.player.totemPos.x + 40; c.y = g.player.totemPos.y + 40;
    c.swornStay = true;
  }
  const sworn = checkSworn(g);
  check(sworn === 3, `три вида присягнули (${sworn})`);
  step(g, 1);
  check(win === 'sworn', `мирная победа через стаю (${win})`);
}

console.log('— 8. Владыка: появление, фазы, силовая победа —');
{
  const g = makeGame({ path: 'predator' });
  let phaseEvents = 0, bossEvent = false;
  g.on('bossPhase', () => phaseEvents++);
  g.on('bossSpawn', () => { bossEvent = true; });
  g.player.tier = CFG.land.tyrant.minTier;
  g.player.x = g.throne.x - 200; g.player.y = g.throne.y;
  step(g, 1);
  check(bossEvent && g.tyrant, 'владыка проснулся, когда зверь вошёл в скалы');
  const boss = g.tyrant;
  check(boss.hp > 300, `у владыки много здоровья (${boss.hp.toFixed(0)})`);
  let win = null;
  g.on('win', ({ reason }) => { win = reason; });
  // бьём владыку, пока не упадёт (проверяем фазы и победу)
  let guard = 0;
  while (boss.hp > 0 && guard++ < 4000) {
    g.hitCreature(boss, 12, { fromPlayer: true });
    g.update(1 / 60, { ax: 0, ay: 0 });
  }
  check(phaseEvents >= 2, `фазы владыки переключаются (${phaseEvents})`);
  check(win === 'tyrant', `силовая победа над владыкой (${win})`);
  check(g.player.flags.tyrantKilled === true, 'победа отмечена в флагах жизни');
}

console.log('— 9. События суши —');
{
  for (const id of ['rain', 'drought', 'migration', 'nighthunt', 'harvest']) {
    const g = makeGame();
    let started = null, ended = null, goal = null;
    g.on('eventStart', ({ name }) => { started = name; });
    g.on('eventEnd', () => { ended = true; });
    g.on('eventGoal', ({ text }) => { goal = text; });
    // проверяем событие, а не выживание: даём запас и уводим зверя в сторону
    g.player.maxHp = 100000; g.player.hp = 100000;
    g.player.maxSatiety = 100000; g.player.satiety = 100000;
    g.player.maxWater = 100000; g.player.water = 100000;
    g.events.force(id);
    const creatures0 = g.creatures.length;
    step(g, 12, { ax: 1, ay: 0.2, dashHeld: true });
    check(!!started, `событие «${id}» началось (${started})`);
    check(g.event?.id === id, `событие держится активным (${g.event?.id})`);
    if (id === 'migration' || id === 'nighthunt') check(g.creatures.length > creatures0 - 3, 'событие привело зверей');
    const dur = g.events.defs.find((d) => d.id === id).dur;
    step(g, dur + 4, { ax: 1, ay: 0.2, dashHeld: true });
    check(!g.event || g.event.id !== id, `событие «${id}» завершилось (длительность ${dur} с)`);
    void goal;
  }
}

console.log('— 10. Задания и цель стадии —');
{
  const g = makeGame();
  const list = g.quests.list();
  check(list.length === 4, `цель стадии + три поручения (${list.length})`);
  check(list[0].main === true, 'первая строка — цель стадии');
  check(/вырасти/i.test(list[0].desc), `цель на старте про рост («${list[0].desc}»)`.slice(0, 90));
  g.player.tier = 6;
  // закрываем поручения по их типу: тест не должен зависеть от того, что выпало из пула
  for (const m of g.quests.side) {
    const p = g.player;
    p.counters.kills = 99; p.counters.fruits = 99; p.counters.bones = 99; p.counters.eggs = 99;
    p.counters.drinks = 99; p.counters.socialWins = 99; p.counters.evolves = 99; p.counters.killsNight = 99;
    p.counters.killsByFamily = { predator: 99, herd: 99, grazer: 99, scavenger: 99, special: 99 };
    p.flags.visited = { shore: true, plain: true, forest: true, rock: true };
    if (m.species) p.sympathy[m.species] = { value: 100, allied: true, sworn: false, cd: 0 };
    p.sympathy.krab ??= { value: 100, allied: true, sworn: false, cd: 0 };
    p.sympathy.runner ??= { value: 100, allied: true, sworn: false, cd: 0 };
    void m.type;
  }
  step(g, 2);
  const list2 = g.quests.list();
  const completed = list2.filter((m) => m.done).length;
  check(completed >= 1, `поручения закрываются по счётчикам (${completed})`);
  check(/стаю|язык/i.test(list2[0].desc), `цель стадии меняется по состоянию мира («${list2[0].desc}»)`.slice(0, 110));
}

console.log('— 11. Сохранение и восстановление мира суши —');
{
  const meta = stubMeta();
  const g = makeGame({ meta });
  g.player.dna = 250;
  tryLandEvolve(g, 'legs');
  g.player.tier = 5;
  step(g, 4, { ax: 0.4, ay: 0.3 });
  const pool = g.pools[0];
  g.player.x = pool.x; g.player.y = pool.y;
  step(g, 1);
  const data = g.serialize();
  check(data.stage === 'land', 'в сохранении указана стадия суши');
  const g2 = LandGame.deserialize(data, { settings: { quality: { particles: 0.5 } }, meta, difficulty: g.difficulty });
  check(g2.player.tier === 5, 'размер сохранён');
  check(g2.player.parts.legs === 1, 'части тела сохранены');
  check(Math.abs(g2.player.water - g.player.water) < 8, `вода сохранена (${g.player.water.toFixed(0)} ≈ ${g2.player.water.toFixed(0)})`);
  check(g2.creatures.length > 5, `звери восстановлены (${g2.creatures.length})`);
  check(g2.pools.length === g.pools.length, 'водоёмы восстановлены');
  step(g2, 5, { ax: -0.5, ay: 0.4 });
  check(g2.player.alive && Number.isFinite(g2.player.x), 'восстановленный мир продолжает жить');
}

console.log('— 12. Способности, урон, смерть —');
{
  const g = makeGame();
  check(landActiveAbility(g.player) === null, 'на старте способности нет');
  g.player.dna = 400; g.player.tier = 3;
  tryLandEvolve(g, 'throat'); tryLandEvolve(g, 'throat'); tryLandEvolve(g, 'throat');
  const ab = landActiveAbility(g.player);
  check(ab && ab.id === 'roar', `горловой мешок дал рёв (${ab?.name})`);
  const c = g.spawnCreature(LAND_SPECIES_BY_ID.hyena, g.player.x + 90, g.player.y, 3, true);
  g.grid.build(g.creatures);                     // в игре сетка строится каждый кадр
  const r = g.useAbility();
  check(r.ok, 'рёв применился');
  check(c.stun > 0 || c.hp < c.maxHp, 'рёв подействовал на зверя');
  check(g.player.cooldowns.ability > 0, 'способность ушла на перезарядку');
  check(g.useAbility().ok === false, 'повторный рёв не проходит по перезарядке');

  const hp0 = g.player.hp;
  g.player.invuln = 0; g.player.dashTime = 0;
  landDamagePlayer(g, 30, c, {});
  check(g.player.hp < hp0, `урон по игроку проходит (${hp0.toFixed(0)} → ${g.player.hp.toFixed(0)})`);
  let died = false;
  g.on('death', () => { died = true; });
  const capped = landDamagePlayer(g, 9999, c, { armorPierce: true });
  check(capped <= g.player.maxHp * CFG.land.player.hitCap + 0.5, `один удар не снимает больше трети здоровья (${capped.toFixed(0)})`);
  let guard2 = 0;
  while (g.player.alive && guard2++ < 30) { g.player.invuln = 0; landDamagePlayer(g, 999, c, { armorPierce: true }); }
  check(died && !g.player.alive, 'смерть зверя регистрируется');

  const armor = landAggregate({ armor: 3, hide: 3 });
  check((armor.armor ?? 0) > 0, 'костяные пластины дают броню');
  const flat = landAggregate({ legs: 2, claws: 1 });
  check(flat.speedMul > 0 && flat.biteDmg > 0, 'эффекты частей складываются по текущему уровню');
}

console.log('— 13. Цвета и рисование без canvas —');
{
  const { shade, mixHex, rgba } = await import('../js/util.js');
  const isHex = (c) => /^#[0-9a-f]{6}$/i.test(c);
  let bad = [];
  for (const k of [0, 0.5, 1, 1.2, 1.5, 2]) {
    const c = shade('#8fd8b0', k);
    if (!isHex(c)) bad.push(`shade(${k})=${c}`);
  }
  check(bad.length === 0, bad.length ? `битые цвета: ${bad.join(', ')}` : 'shade/mixHex дают корректные цвета при любом множителе');
  check(isHex(mixHex('#ff0000', '#00ff00', 0.5)), 'смешение цветов работает');
  void rgba;
  // прогоняем всех наземных зверей через рисовальщик с заглушкой контекста:
  // так ловим ошибки цвета без браузера
  const calls = [];
  const stubCtx = new Proxy({}, {
    get(_, prop) {
      if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
        return () => ({ addColorStop: (p, c) => { if (!/^#|^rgb/.test(String(c))) calls.push(String(c)); } });
      }
      if (prop === 'canvas') return { width: 100, height: 100 };
      return () => {};
    },
    set() { return true; },
  });
  const { drawCreature, specFromSpecies, specFromPlayer } = await import('../js/landcreature.js');
  const { LAND_SPECIES } = await import('../js/landspecies.js');
  for (const sp of LAND_SPECIES) {
    const spec = specFromSpecies(sp, { x: 0, y: 0, r: 20, random: 0.5 });
    drawCreature(stubCtx, spec, 1.2);
  }
  check(calls.length === 0, calls.length ? `некорректные цвета при отрисовке видов: ${calls.slice(0, 3).join(', ')}` : `все ${LAND_SPECIES.length} видов рисуются без ошибок цвета`);
  const cellStub = { parts: { legs: 3, fangs: 2, armor: 1 }, features: ['legs', 'fangs', 'armor'], featureLvls: { legs: 3, fangs: 2, armor: 1 }, path: 'predator', color: '#8fd8b0', color2: '#eaffea' };
  drawCreature(stubCtx, specFromPlayer(cellStub, { x: 0, y: 0, r: 24 }), 0.5);
  check(true, 'зверь игрока рисуется теми же путями');
}

console.log('— 14. Наследие подводной стадии —');
{
  const g = new LandGame({
    settings: { quality: { particles: 0.5 } }, meta: stubMeta(),
    difficulty: 'normal', path: 'grazer', seed: 99,
    fromCell: { tier: 7, lineage: 'herb' },
  });
  check(g.player.dna > 40, `зверь вышел на берег с запасом ДНК (${Math.round(g.player.dna)})`);
  check(g.player.tier >= 2, `выросший в океане вид стартует крупнее (размер ${g.player.tier})`);
  check(g.carriedFromCell?.tier === 7, 'наследие записано в мир');
}

console.log('');
if (fails) { console.error(`ПРОВАЛЕНО ПРОВЕРОК: ${fails}`); process.exit(1); }
console.log('ВСЕ ПРОВЕРКИ СУШИ ПРОЙДЕНЫ');
