// Духовность (🙏, ключ faith) — четвёртый ресурс наряду с книгами (📚) и топливо двух механик:
//  1) просветление народа: эпоху открывает не число изученных наук, а сумма 2·📚 + 1·🙏 против
//     порога эпохи (36 + 8·era), проверяемая в конце дня; на переходе половина запасов сгорает.
//     Порог лежит выше любого стартового запаса (14-20 очков), а первый день закрыт для перехода:
//     эпоху даёт накопленное трудом, а не подаренное происхождением;
//  2) миссия «слово народа»: мирное присоединение клетки за духовность — без соседства и без боя,
//     а охраняемая клетка обращается дороже и тоже без сражения.
// Расход у духовности ровно один (миссии) — ковка, захват, экспедиция и указы её не стоят.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Campaign = require('../campaign.js');
const CampaignMap = require('../campaign-map.js');
const TEST_SEED = 12345;

function playable(seed = TEST_SEED) {
  const state = Campaign.createState(seed);
  state.player.onboardingComplete = true;
  return Campaign.normalizeState(state);
}

function tile(state, id) { return state.world.tiles.find(candidate => candidate.id === id); }
function region(state, id) { return state.regions.find(candidate => candidate.id === id); }
function center(state) {
  return state.world.tiles.find(candidate => candidate.x === CampaignMap.CENTER.x && candidate.y === CampaignMap.CENTER.y);
}

/** Клетка, до которой слово доходит: видна, не вода, без охраны, без владельца, доступна по эпохе. */
function reachableWordTile(state) {
  const visible = new Set(Campaign.getVisibleRegionIds(state));
  const home = center(state);
  return state.world.tiles.find(candidate => visible.has(candidate.id)
    && candidate.terrain !== 'water' && !candidate.guard && candidate.kind !== 'settlement'
    && (candidate.minEra || 0) <= state.player.era
    && region(state, candidate.id)?.ownerId === null
    && candidate.id !== home.id) || null;
}

/** Делаем клетку видимой, занимая соседнюю: так проверяются блокировки, скрытые туманом войны. */
function revealNeighbourOf(state, targetId) {
  const next = Campaign.clone(state);
  const target = tile(next, targetId);
  const neighbour = target.neighbors.map(id => tile(next, id))
    .find(candidate => candidate && candidate.terrain !== 'water' && region(next, candidate.id)?.ownerId !== 'player');
  assert.ok(neighbour, 'для проверки нужна свободная соседняя клетка');
  region(next, neighbour.id).ownerId = 'player';
  region(next, neighbour.id).capturedDay = next.day;
  return Campaign.normalizeState(next);
}

test('духовность — четвёртый ресурс клана: запас, жрецы и порядок сокращения рабочих', () => {
  const state = playable();
  assert.deepEqual(Campaign.WORKER_KEYS, ['food', 'materials', 'knowledge', 'faith']);
  assert.equal(state.player.resources.faith, 2, 'стартуем с небольшим запасом духовности');
  assert.equal(state.player.workers.faith, 1, 'один клан по умолчанию молится');
  assert.equal(Campaign.WORKER_BASE_YIELD.faith, 0.6);

  const breakdown = Campaign.getProductionBreakdown(state);
  assert.deepEqual(Object.keys(breakdown.regional).sort(), ['faith', 'food', 'knowledge', 'materials']);
  assert.deepEqual(Object.keys(Campaign.getRegionalIncome(state)).sort(), ['faith', 'food', 'knowledge', 'materials']);
  // 0.6 за клан без зданий-советников (workerBonus.faith = 0 на старте)
  assert.equal(Number(breakdown.workerProduction.faith.toFixed(2)), 0.6);
  assert.equal(breakdown.workerBonus.faith, 0);

  // Численность населения падает: сначала снимаются простаивающие, затем жрецы, книжники, добытчики и только потом земледельцы.
  const crowded = playable();
  crowded.player.population = 3;
  crowded.player.workers = { food: 2, materials: 2, knowledge: 2, faith: 2, idle: 2 };
  assert.deepEqual(Campaign.normalizeState(crowded).player.workers, { food: 2, materials: 1, knowledge: 0, faith: 0, idle: 0 });
});

test('здания советника с income_faith усиливают кланы-жрецы, а святилища дают региональный доход', () => {
  const effect = Campaign.EFFECTS.income_faith;
  assert.ok(effect, 'эффект income_faith обязан существовать');
  // Категория religion: духовность — отдельный род занятий (обряд, жречество, книжность), а не «общественное» вообще.
  assert.equal(effect.category, 'religion');
  assert.equal(effect.max, 2);
  assert.equal(Campaign.BUILDING_WORKER_BONUS.income_faith, 0.5);

  const plain = playable();
  const blessed = Campaign.normalizeState({
    ...plain,
    player: {
      ...plain.player,
      buildings: [...plain.player.buildings, { id: 'test-shrine', scienceName: 'Капище рода', name: 'Капище рода', category: 'civic', effects: [{ type: 'income_faith', amount: 2 }], active: true, builtDay: 1 }]
    }
  });
  assert.equal(Campaign.effectTotals(blessed).income_faith, 2);
  const plainYield = Campaign.getProductionBreakdown(plain).workerProduction.faith;
  const blessedYield = Campaign.getProductionBreakdown(blessed).workerProduction.faith;
  // +0.5 к отдаче клана за пункт эффекта и 2 пункта эффекта: 0.6 → 1.6
  assert.ok(Math.abs(blessedYield - (plainYield + Campaign.BUILDING_WORKER_BONUS.income_faith * 2)) < 0.001,
    'income_faith 2 обязан поднять отдачу жреца на 1.0, получено ' + blessedYield);

  // Региональные святилища: место наблюдений и форпост дают духовность каждый день.
  assert.equal(Campaign.REGION_BUILDINGS.knowledge.yields.faith, 1);
  assert.equal(Campaign.REGION_BUILDINGS.settlement.yields.faith, 1);
  const withObservatory = playable();
  const site = withObservatory.world.tiles.find(candidate => candidate.siteType === 'knowledge' && candidate.terrain !== 'water');
  const record = region(withObservatory, site.id);
  record.ownerId = 'player';
  record.building = Campaign.REGION_BUILDINGS.knowledge.id;
  assert.equal(Campaign.getRegionalIncome(Campaign.normalizeState(withObservatory)).faith, 1);
});

test('склад растёт с эпохой, иначе поздние пороги просветления недостижимы', () => {
  const state = playable();
  const capEra0 = Campaign.getStorageCap(state);
  const capEra2 = Campaign.getStorageCap({ ...state, player: { ...state.player, era: 2 } });
  const capEra6 = Campaign.getStorageCap({ ...state, player: { ...state.player, era: 6 } });
  assert.equal(capEra2 - capEra0, 10, '+5 места на складе за каждую эпоху');
  assert.equal(capEra6 - capEra0, 30);

  // Излишек сверх склада тает вдвое — в том числе у духовности.
  const overflow = playable();
  const next = Campaign.finishDayState({ ...overflow, player: { ...overflow.player, resources: { ...overflow.player.resources, knowledge: 0, faith: capEra0 + 40 } } });
  assert.equal(next.error, null);
  assert.ok(next.state.player.resources.faith < capEra0 + 40, 'мягкий склад обязан срезать излишек духовности');
});

test('порог просветления эпохи: 36 + 8·era и формула 2·📚 + 1·🙏', () => {
  assert.equal(Campaign.ENLIGHTENMENT_WEIGHTS.knowledge, 2);
  assert.equal(Campaign.ENLIGHTENMENT_WEIGHTS.faith, 1);
  assert.equal(Campaign.ERA_ENLIGHTENMENT_SPEND, 0.5);
  assert.deepEqual(Campaign.ERAS.map((name, era) => Campaign.eraEnlightenmentThreshold(era)), [36, 44, 52, 60, 68, 76, 84]);

  const state = playable();
  const progress = Campaign.getEraProgress({ ...state, player: { ...state.player, resources: { ...state.player.resources, knowledge: 4, faith: 4 } } });
  assert.equal(progress.formula, '2·📚 + 1·🙏');
  assert.equal(progress.threshold, 36);
  assert.equal(progress.score, 12);
  assert.equal(progress.remaining, 24);
  assert.equal(progress.ratio, 12 / 36);
  assert.equal(progress.ready, false);
  assert.equal(progress.finalEra, false);
  assert.equal(progress.nextEraLabel, Campaign.ERAS[1]);
  // Первый день закрыт для перехода: народ должен прожить день основания.
  assert.equal(progress.day, 1);
  assert.equal(progress.minDay, Campaign.ERA_ENLIGHTENMENT_MIN_DAY);
  assert.equal(progress.dayBlocked, true);
});

test('стартового запаса не хватает ни у одного народа: эпоху нельзя получить в день основания', () => {
  // Раньше порог был 16, а стартовый запас давал 14-20 очков: пять происхождений из восьми
  // открывали Античный мир в конце первого дня, ничего для этого не сделав.
  const threshold = Campaign.eraEnlightenmentThreshold(0);
  let best = 0;
  let bestBuild = null;
  let advances = 0;
  for (const origin of Campaign.ORIGINS) {
    for (const culture of Campaign.HISTORICAL_CULTURES.filter(item => item.era === 0)) {
      for (const trait of Campaign.TRAITS) {
        const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), {
          name: 'Народ', originId: origin.id, seedId: Campaign.SEED_CHOICES[0].id, historicalCultureId: culture.id
        }).state;
        begun.player.trait = trait; // черту онбординг выбирает сам — проверяем и лучшую
        const population = begun.player.population;
        // Предельный случай: все кланы посажены за книги (голод и потерю людей здесь не считаем).
        const finished = Campaign.finishDayState({
          ...begun,
          player: { ...begun.player, workers: { food: 0, materials: 0, knowledge: population, faith: 0, idle: 0 } }
        });
        assert.equal(finished.error, null);
        if (finished.eraAdvanced) advances++;
        const score = Campaign.getEraProgress(finished.state).score;
        if (score > best) { best = score; bestBuild = origin.id + '/' + culture.id + '/' + trait.id; }
      }
    }
  }
  assert.equal(advances, 0, 'в первый день эпоха не открывается ни у одной цивилизации');
  assert.ok(best < threshold, 'даже предельная отдача даёт ' + best.toFixed(1) + ' очков — меньше порога ' + threshold + ' (' + bestBuild + ')');
  assert.ok(best > 0, 'проверка считает реальные очки, а не ноль');
});

test('эпоху даёт труд: полная отдача берёт её к концу второго дня, обычная игра — существенно позже', () => {
  const allOnBooks = started => Campaign.finishDayState({
    ...started, player: { ...started.player, workers: { food: 0, materials: 0, knowledge: started.player.population, faith: 0, idle: 0 } }
  });
  // Лучшая «знаниевая» сборка: происхождение лесных троп (+2 📚), наследие Гёбекли-Тепе (+0.4 📚 с клана),
  // черта «Ночные наблюдатели» (+0.3 📚 с клана) и все кланы на книгах.
  const build = () => {
    const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), {
      name: 'Книжники', originId: 'woodland', seedId: Campaign.SEED_CHOICES[0].id, historicalCultureId: 'gobekli'
    }).state;
    begun.player.trait = Campaign.TRAITS.find(trait => trait.id === 'night-watch');
    return begun;
  };
  let studious = build();
  assert.equal(allOnBooks(studious).eraAdvanced, null, 'первый день закрыт');
  const second = allOnBooks(allOnBooks(studious).state);
  assert.ok(second.eraAdvanced, 'книжники берут эпоху в конце второго дня');
  assert.equal(second.eraAdvanced.from, 0);
  assert.equal(second.eraAdvanced.to, 1);

  // Обычная игра (2 🌾, 1 🪵, 1 📚, 1 🙏) до той же эпохи копит больше недели: сравнение честное,
  // стартовые запасы у сборок одинаковые по происхождению.
  let calm = build();
  let day = 0;
  while (day < 30 && calm.player.era === 0) {
    calm = Campaign.finishDayState({ ...calm, player: { ...calm.player, workers: { food: 2, materials: 1, knowledge: 1, faith: 1, idle: 0 } } }).state;
    day++;
  }
  assert.equal(calm.player.era, 1);
  assert.ok(day > 2 * 2, 'без полной отдачи эпоха приходит заметно позже: ' + day + ' дней против двух');
});

test('первый день не открывает эпоху даже при готовом пороге', () => {
  const state = playable();
  const rich = Campaign.getEraProgress({ ...state, player: { ...state.player, resources: { ...state.player.resources, knowledge: 60, faith: 40 } } });
  assert.ok(rich.score >= rich.threshold, 'запаса хватает с избытком');
  assert.equal(rich.dayBlocked, true);
  assert.equal(rich.ready, false, 'пока не прожит день основания, перехода не будет');
  const finished = Campaign.finishDayState({ ...state, player: { ...state.player, resources: { ...state.player.resources, knowledge: 60, faith: 40 } } });
  assert.equal(finished.eraAdvanced, null);
  assert.equal(finished.state.player.era, 0);
  // Со второго дня тот же запас открывает эпоху.
  const nextDay = Campaign.finishDayState(finished.state);
  assert.ok(nextDay.eraAdvanced, 'второй день снимает запрет');
  assert.equal(nextDay.state.player.era, 1);
});

test('вес книг двукратен: эпоху открывают 2·📚 + 1·🙏, а не сумма ресурсов', () => {
  // Кланы отправлены в простой, чтобы дневной доход не подмешивался в арифметику порога:
  // тогда очки в конце дня — это ровно 2·📚 + 1·🙏 от заданного запаса. День основания закрыт
  // для перехода, поэтому запасы проверяются на втором дне.
  const idle = state => ({ food: 0, materials: 0, knowledge: 0, faith: 0, idle: state.player.population });
  const at = (knowledge, faith) => {
    let state = playable();
    state = Campaign.finishDayState({
      ...state,
      player: { ...state.player, resources: { ...state.player.resources, knowledge: 0, faith: 0 }, workers: idle(state) }
    }).state;
    return Campaign.finishDayState({
      ...state,
      player: { ...state.player, resources: { ...state.player.resources, knowledge, faith }, workers: idle(state) }
    });
  };
  // Без стартового амбара базовый склад равен 15: 15 книг + 6 молитв = 36 очков,
  // а 14 книг + 7 молитв = 35. Все проверяемые запасы помещаются без складского смягчения.
  assert.ok(at(15, 6).eraAdvanced, '15 📚 + 6 🙏 = 36 очков открывают Античный мир');
  assert.equal(at(14, 7).eraAdvanced, null, '14 📚 + 7 🙏 = 35 очков не хватает');
  // Смешанный запас: книга весит вдвое молитвы — 12 📚 + 12 🙏 = 36 проходит, 11 📚 + 13 🙏 = 35 нет
  assert.ok(at(12, 12).eraAdvanced, '12 📚 + 12 🙏 = 36 очков');
  assert.equal(at(11, 13).eraAdvanced, null, '11 📚 + 13 🙏 = 35 очков');
  // Одной духовностью эпоху не взять: мягкий склад держит 🙏 около «склад + дневной доход»,
  // поэтому без книг потолок просветления остаётся ниже порога (книга весит вдвое).
  assert.equal(at(0, 40).eraAdvanced, null, 'молитвы без книг не открывают эпоху');
});

test('переход эпохи сжигает половину запасов и случается не чаще раза в день', () => {
  const state = playable();
  // В этой проверке уже построено хранилище: так можно оставить запас ниже его нового потолка
  // и отдельно проверить, что дневной доход входит в половину, которая сгорает при переходе.
  state.player.buildings.push({ id: 'test-archive', name: 'Общий архив', category: 'science', effects: [{ type: 'storage_bonus', amount: 1 }], active: true, builtDay: 1 });
  // 18 📚 + 4 🙏 = 40 очков — выше порога 36; хранилище оставляет запас ниже мягкого потолка.
  const rich = Campaign.finishDayState({ ...state, player: { ...state.player, resources: { ...state.player.resources, knowledge: 18, faith: 4 } } });
  assert.equal(rich.error, null);
  assert.equal(rich.eraAdvanced, null, 'но в первый день эпоха не открывается даже с таким запасом');
  const before = rich.state.player.resources.knowledge;
  const beforeFaith = rich.state.player.resources.faith;
  const secondDay = Campaign.finishDayState(rich.state);
  assert.ok(secondDay.eraAdvanced, 'со второго дня огромный запас обязан открыть эпоху');
  const era = secondDay;
  assert.equal(era.eraAdvanced.from, 0);
  assert.equal(era.eraAdvanced.to, 1);
  assert.equal(Campaign.eraName(era.eraAdvanced.to), Campaign.ERAS[1]);
  assert.ok(Array.isArray(era.eraAdvanced.advancedRivals), 'отчёт о переходе рассказывает и о соперниках');
  assert.equal(era.state.player.era, 1, 'за один день берётся ровно одна эпоха');
  // Половина накопленного ушла на собор и жертву: запас вместе с дневным доходом делится пополам.
  const expectedKnowledge = (before + era.gained.knowledge) * Campaign.ERA_ENLIGHTENMENT_SPEND;
  const expectedFaith = (beforeFaith + era.gained.faith) * Campaign.ERA_ENLIGHTENMENT_SPEND;
  assert.ok(Math.abs(era.state.player.resources.knowledge - expectedKnowledge) < 0.01,
    'ожидали ' + expectedKnowledge.toFixed(2) + ' 📚, получено ' + era.state.player.resources.knowledge.toFixed(2));
  assert.ok(Math.abs(era.state.player.resources.faith - expectedFaith) < 0.01);
  assert.ok(Campaign.getEraProgress(era.state).score < Campaign.getEraProgress(era.state).threshold,
    'после перехода народ снова ниже порога следующей эпохи');
});

test('ниже порога эпоха стоит на месте, а на последней эпохе просветление ничего не сжигает', () => {
  const poor = playable();
  poor.player.resources.knowledge = 0;
  poor.player.resources.faith = 0;
  const day = Campaign.finishDayState(poor);
  assert.equal(day.error, null);
  assert.equal(day.eraAdvanced, null);
  assert.equal(day.state.player.era, 0);

  const finalEra = playable();
  finalEra.player.era = Campaign.ERAS.length - 1;
  const progress = Campaign.getEraProgress(finalEra);
  assert.equal(progress.finalEra, true);
  assert.equal(progress.nextEraLabel, null);
  assert.equal(progress.threshold, Campaign.eraEnlightenmentThreshold(Campaign.ERAS.length - 1));
  assert.equal(progress.ratio, 1, 'на последней эпохе шкала заполнена');

  const finished = Campaign.finishDayState({ ...finalEra, player: { ...finalEra.player, resources: { ...finalEra.player.resources, knowledge: 300, faith: 100 } } });
  assert.equal(finished.error, null);
  assert.equal(finished.eraAdvanced, null, 'дальше «Будущего 2050-2150» эпох нет');
  assert.equal(finished.state.player.era, Campaign.ERAS.length - 1);
  assert.ok(finished.state.player.resources.knowledge > 100, 'без перехода запасы не сгорают — их съедает только склад');
});

test('слово народа присоединяет клетку без соседства, за духовность, приказ и очко действия', () => {
  const state = playable();
  const target = reachableWordTile(state);
  assert.ok(target, 'в стартовом тумане войны нужна доступная клетка');
  const home = center(state);
  assert.ok(!home.neighbors.includes(target.id), 'клетка обязана быть несоседней — иначе тест не про слово');

  const before = Campaign.getMissionState(state, target.id);
  assert.equal(before.kind, 'word');
  assert.equal(before.guarded, false);
  assert.deepEqual(before.cost, { faith: Campaign.MISSION_WORD_BASE + Campaign.MISSION_WORD_PER_ERA * state.player.era });
  assert.equal(before.available, false);
  assert.match(before.reason, /Нужно \d+ 🙏 духовности\./);

  const ready = Campaign.normalizeState({ ...state, player: { ...state.player, resources: { ...state.player.resources, faith: 20 } } });
  const mission = Campaign.getMissionState(ready, target.id);
  assert.equal(mission.available, true);
  assert.equal(mission.reason, '');
  assert.equal(mission.label, 'Слово народа');
  assert.ok(mission.hint.includes('соседство'), 'подсказка обязана объяснять, что соседство не нужно');

  const result = Campaign.missionRegionState(ready, target.id);
  assert.equal(result.error, null);
  assert.equal(region(result.state, target.id).ownerId, 'player');
  assert.equal(region(result.state, target.id).capturedDay, result.state.day);
  assert.equal(region(result.state, target.id).building, null);
  assert.equal(result.state.player.resources.faith, 15, 'слово стоит 5 🙏 на Каменном веке');
  assert.equal(result.state.player.ap, ready.player.ap - 1, 'миссия тратит очко действия');
  assert.equal(result.state.player.dailyOrders.missionUsed, 1);
  assert.match(result.state.player.campaignNotice, /присоединена словом за 5🙏/);

  // Клетка стала своей: советник предлагает региональную постройку, а слово здесь больше не нужно.
  assert.equal(Campaign.getRegionActionState(result.state, target.id).action, 'build');
  assert.equal(Campaign.getMissionState(result.state, target.id).reason, 'Здесь уже ваш народ.');
});

test('миссия ограничена одним словом в день и не пускает на воду, в туман, на чужое поселение и в закрытую эпоху', () => {
  const base = playable();
  const state = Campaign.normalizeState({ ...base, player: { ...base.player, resources: { ...base.player.resources, faith: 60 } } });
  const first = reachableWordTile(state);
  const spent = Campaign.missionRegionState(state, first.id);
  assert.equal(spent.error, null);
  const second = Campaign.missionRegionState(spent.state, Campaign.getVisibleRegionIds(spent.state)
    .map(id => tile(spent.state, id))
    .find(candidate => candidate.terrain !== 'water' && !candidate.guard && region(spent.state, candidate.id)?.ownerId === null).id);
  assert.match(second.error, /Сегодняшняя миссия уже совершена\./);

  const water = state.world.tiles.find(candidate => candidate.terrain === 'water');
  assert.equal(Campaign.getMissionState(state, water.id).reason, 'На воду слово не доходит: нужен брод или лодья.');
  const fog = state.world.tiles.find(candidate => !Campaign.getVisibleRegionIds(state).includes(candidate.id) && candidate.terrain !== 'water');
  assert.equal(Campaign.getMissionState(state, fog.id).reason, 'Эта область скрыта туманом войны.');
  assert.equal(Campaign.missionRegionState(state, fog.id).error, 'Эта область скрыта туманом войны.');

  const settlement = state.world.tiles.find(candidate => candidate.kind === 'settlement' && candidate.initialOwner);
  const revealed = revealNeighbourOf(state, settlement.id);
  assert.ok(Campaign.getVisibleRegionIds(revealed).includes(settlement.id), 'поселение обязано стать видимым');
  assert.equal(Campaign.getMissionState(revealed, settlement.id).reason, 'Чужое поселение словом не обращается — только экспедицией.');

  const lateTile = state.world.tiles.find(candidate => (candidate.minEra || 0) > state.player.era
    && candidate.terrain !== 'water' && candidate.kind !== 'settlement');
  assert.ok(lateTile, 'нужна клетка, закрытая по эпохе');
  const lateRevealed = revealNeighbourOf(state, lateTile.id);
  assert.match(Campaign.getMissionState(lateRevealed, lateTile.id).reason, /Слово не дойдёт до эпохи/);
});

test('охрана обращается словом дороже и без боя, а её отряд остаётся в описании клетки', () => {
  const base = playable();
  const state = Campaign.normalizeState({ ...base, player: { ...base.player, resources: { ...base.player.resources, faith: 60 } } });
  const guarded = tile(state, Campaign.getVisibleRegionIds(state).map(id => tile(state, id))
    .find(candidate => candidate.guard && candidate.terrain !== 'water'
      && (candidate.minEra || 0) <= state.player.era
      && region(state, candidate.id)?.ownerId === null).id);
  const quote = Campaign.getMissionState(state, guarded.id);
  assert.equal(quote.kind, 'convert');
  assert.equal(quote.guarded, true);
  assert.equal(quote.label, 'Обратить охрану словом');
  assert.deepEqual(quote.cost, { faith: Campaign.MISSION_CONVERT_BASE + Campaign.MISSION_CONVERT_PER_ERA * state.player.era });

  const result = Campaign.missionRegionState(state, guarded.id);
  assert.equal(result.error, null);
  assert.equal(region(result.state, guarded.id).ownerId, 'player');
  assert.equal(region(result.state, guarded.id).lastDefeatDay, null);
  assert.equal(result.state.player.resources.faith, 48, 'обращение стоит 12 🙏 на Каменном веке');
  assert.ok(tile(result.state, guarded.id).guard, 'описание клетки обязано сохранить охрану — миссия не переписывает мир');
  assert.equal(region(result.state, guarded.id).building, null);
  assert.match(result.state.player.campaignNotice, /за 12🙏/);

  // Стоимость растёт с эпохой: слово 5 + 2·era, обращение 12 + 5·era.
  const medieval = Campaign.normalizeState({ ...state, player: { ...state.player, era: 2 } });
  assert.deepEqual(Campaign.missionCost(medieval, guarded.id).cost, { faith: 22 });
  assert.equal(Campaign.missionCost(medieval, guarded.id).kind, 'convert');
  // На открытой клетке та же эпоха даёт слово за 5 + 2·era = 9 🙏: цена зависит только от охраны.
  const open = Campaign.getVisibleRegionIds(medieval).map(id => tile(medieval, id))
    .find(candidate => !candidate.guard && candidate.terrain !== 'water' && region(medieval, candidate.id)?.ownerId === null);
  assert.ok(open, 'нужна видимая неохраняемая клетка');
  assert.deepEqual(Campaign.missionCost(medieval, open.id), { kind: 'word', guarded: false, cost: { faith: 9 } });
});

test('духовность тратится только на миссии: ковка, захват, экспедиция и указы её не стоят', () => {
  const state = playable();
  assert.deepEqual(Object.keys(Campaign.REGION_CAPTURE_COST).sort(), ['food', 'knowledge', 'materials']);
  assert.deepEqual(Object.keys(Campaign.REGION_EXPEDITION_COST).sort(), ['food', 'knowledge', 'materials']);
  for (const materialQuality of Object.keys(Campaign.CARD_CRAFT_MATERIALS)) {
    for (const effort of Object.keys(Campaign.CARD_CRAFT_EFFORTS)) {
      const quote = Campaign.cardCraftQuote(state, { materialQuality, effort });
      assert.ok(!('faith' in quote.cost), 'ковка ' + materialQuality + '/' + effort + ' не должна стоить духовности');
    }
  }
  assert.ok(Object.values(Campaign.DECREES).every(decree => !('faith' in (decree.cost || {}))), 'указы не покупаются за духовность');

  // Миссия же списывает именно духовность и ничего больше.
  const ready = Campaign.normalizeState({ ...state, player: { ...state.player, resources: { ...state.player.resources, faith: 20 } } });
  const target = reachableWordTile(ready);
  const result = Campaign.missionRegionState(ready, target.id);
  assert.equal(result.error, null);
  assert.equal(result.state.player.resources.food, ready.player.resources.food);
  assert.equal(result.state.player.resources.materials, ready.player.resources.materials);
  assert.equal(result.state.player.resources.knowledge, ready.player.resources.knowledge);
  assert.equal(result.state.player.resources.faith, ready.player.resources.faith - 5);
});

test('просветление живёт в ежедневном отчёте и в сводке приказов', () => {
  const state = playable();
  const day = Campaign.finishDayState(state);
  assert.equal(day.error, null);
  assert.ok(Number.isFinite(day.gained.faith), 'отчёт о дне обязан показывать прирост духовности');
  assert.ok(day.gained.faith > 0, 'жрец приносит духовность каждый день');

  // Лимит приказов общий для всех типов (1, или 2 с order_capacity) — у миссии свой счётчик.
  const capacity = Campaign.getOrderCapacity(state);
  assert.ok(capacity >= 1, 'у слова народа должен быть дневной лимит');
  assert.equal(state.player.dailyOrders.missionUsed, 0);

  const ready = Campaign.normalizeState({ ...state, player: { ...state.player, resources: { ...state.player.resources, faith: 20 } } });
  const used = Campaign.missionRegionState(ready, reachableWordTile(ready).id);
  assert.equal(used.state.player.dailyOrders.missionUsed, 1);
  const exhausted = Campaign.normalizeState({ ...used.state, player: { ...used.state.player, dailyOrders: { ...used.state.player.dailyOrders, missionUsed: capacity } } });
  assert.match(Campaign.getMissionState(exhausted, reachableWordTile(exhausted).id).reason, /миссия уже совершена/i);
});

/** Рендер legacy-экрана (campaign.js в песочнице vm) — тот же приём, что в tests/campaign.test.js. */
function renderLegacy(state) {
  const host = {
    _html: '',
    details: ['first-steps', 'season-menu', 'advisor-context', 'buildings', 'civilization', 'opponents', 'deck'].map(campaignKey => ({ dataset: { campaignKey }, open: false })),
    get innerHTML() { return this._html; },
    set innerHTML(value) { this._html = value; this.details.forEach(detail => { detail.open = false; }); },
    querySelectorAll(selector) {
      const rendered = this.details.filter(detail => this._html.includes(`data-campaign-key=\"${detail.dataset.campaignKey}\"`));
      return selector.includes('[open]') ? rendered.filter(detail => detail.open) : rendered;
    }
  };
  const storage = { getItem: key => key === Campaign.STORAGE_KEY ? JSON.stringify(state) : null, setItem() {} };
  const fakeWindow = {
    CampaignMap,
    localStorage: storage,
    document: { getElementById: id => id === 'campaign-root' ? host : null },
    alert() {}
  };
  const sandbox = { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8'), sandbox);
  fakeWindow.CampaignMvp.render();
  return { host, api: fakeWindow.CampaignMvp };
}

test('legacy-экран показывает духовность, шкалу просветления и кнопку слова народа', () => {
  const base = playable();
  base.player.resources.faith = 20;
  const { host, api } = renderLegacy(base);
  const html = host.innerHTML;
  // ресурс и кланы-жрецы
  assert.match(html, /<span>🙏 Духовность<\/span><b>20<\/b>/);
  assert.match(html, /🙏 Духовность: 1 → \+0\.6/);
  assert.match(html, /CampaignMvp\.assignWorker\('idle','faith'\)/);
  // собственный дневной приказ
  assert.match(html, /<span>🙏<\/span><b>Миссия<\/b><small>Доступно<\/small>/);
  assert.match(html, /Слово народа: присоединить землю за духовность/);
  // просветление эпохи вместо счётчика наук
  assert.match(html, /Просветление: 32\/36 \(2·📚 \+ 1·🙏\)/);
  assert.match(html, /Просветление эпохи: 2·📚 6 \+ 1·🙏 20 = 32 из 36 для эпохи «Античный мир»/);
  assert.match(html, /Эпоха не откроется раньше конца 2-го дня/);
  assert.doesNotMatch(html, /Наука изучена: 1 из 2/);

  // Клетка вне соседства: слово народа доступно, обычное заселение — нет.
  const target = reachableWordTile(Campaign.normalizeState(base));
  api.selectMapTile(target.id);
  const inspector = host.innerHTML;
  assert.ok(inspector.includes(`CampaignMvp.missionRegion('${target.id}')`), 'кнопка миссии обязана звать legacy-обработчик');
  assert.match(inspector, /Слово народа · 5🙏<\/button>/);
  assert.match(inspector, /🙏 20 на складе · приказ «Миссия» 0\/1/);
  assert.match(inspector, /соседство с вашими землями не требуется/);
  // Обычное заселение этой клетки заблокировано — работает именно слово народа.
  assert.match(inspector, /Сначала займи соседнюю область\./);
});
