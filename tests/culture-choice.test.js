const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const Campaign = require('../campaign.js');

const TEST_SEED = 12345;

/**
 * Переход в следующую эпоху: просветление 2·📚 + 1·🙏 доводится до порога эпохи, и эпоха наступает
 * сама в конце дня (см. campaign.js advanceEra / getEraProgress). Науки для этого больше не нужны.
 */
function advanceEra(input) {
  const threshold = Campaign.eraEnlightenmentThreshold(input.player.era);
  const state = Campaign.normalizeState({
    ...input,
    player: { ...input.player, resources: { ...input.player.resources, knowledge: threshold, faith: 0 } }
  });
  const finished = Campaign.finishDayState(state);
  assert.equal(finished.error, null);
  assert.ok(finished.eraAdvanced, `порог ${threshold} очков просветления обязан открыть эпоху «${Campaign.ERAS[input.player.era + 1]}»`);
  assert.equal(finished.state.player.era, input.player.era + 1);
  return finished.state;
}

function culture(id) {
  const found = Campaign.HISTORICAL_CULTURES.find(item => item.id === id);
  assert.ok(found, 'тест ссылается на несуществующую культуру ' + id);
  return found;
}

function startedCampaign() {
  const state = Campaign.createState(TEST_SEED);
  state.player.onboardingComplete = true;
  state.player.historicalCulture = culture('yamnaya');
  state.player.culturalLineage = ['yamnaya'];
  return Campaign.normalizeState(state);
}

test('переход эпохи больше не меняет наследие сам, а открывает игроку выбор', () => {
  const start = startedCampaign();
  const before = start.player.historicalCulture;

  const advanced = advanceEra(start);
  assert.equal(advanced.player.era, 1);
  assert.deepEqual(advanced.player.historicalCulture, before,
    'наследие не должно меняться без решения игрока (раньше культура ассимилировалась с шансом 30%)');
  assert.deepEqual(advanced.player.culturalLineage, ['yamnaya'], 'линия тоже не пополняется сама');

  const pending = advanced.player.pendingCultureChoice;
  assert.ok(pending, 'переход эпохи обязан открыть выбор наследия');
  assert.equal(pending.era, 1);
  assert.ok(pending.candidates.length >= 1 && pending.candidates.length <= Campaign.CULTURE_CHOICE_SIZE);
  assert.ok(pending.candidates.every(id => culture(id).era === 1),
    'предлагать можно только культуры эпохи «' + Campaign.ERAS[1] + '»');
  assert.ok(!pending.candidates.includes('yamnaya'), 'культуры уже в линии не предлагаются повторно');
  assert.match(advanced.player.campaignNotice, /наследие/i);
  assert.ok(advanced.player.chronicle.some(entry => /Технологии эпохи/.test(entry.text)),
    'летопись фиксирует, какие технологии принесла эпоха');

  // Выбор детерминирован: перезагрузка сохранения показывает тот же набор кандидатов.
  const reloaded = Campaign.normalizeState(JSON.parse(JSON.stringify(advanced)));
  assert.deepEqual(reloaded.player.pendingCultureChoice.candidates, pending.candidates);
  assert.deepEqual(Campaign.cultureCandidates(advanced, 1).map(item => item.id), pending.candidates);
});

test('«оставить прошлое наследие» сохраняет культуру, но все технологии эпохи уже доступны', () => {
  const advanced = advanceEra(startedCampaign());
  const choice = Campaign.getCultureChoice(advanced);
  assert.ok(choice);
  assert.equal(choice.eraLabel, Campaign.ERAS[1]);
  assert.equal(choice.era, 1);
  assert.ok(choice.eraDescription.length > 10);
  assert.ok(choice.eraTechnologies.length >= 3);
  assert.equal(choice.keep.id, 'keep');
  assert.match(choice.keep.description, /сохраняет наследие/i);
  assert.match(choice.keep.description, /технологии эпохи/i);
  assert.equal(choice.current.id, 'yamnaya');
  assert.equal(choice.candidates.length, advanced.player.pendingCultureChoice.candidates.length);

  const kept = Campaign.chooseCultureState(advanced, 'keep');
  assert.equal(kept.error, null);
  assert.equal(kept.kept, true);
  assert.equal(kept.culture, null);
  assert.deepEqual(kept.state.player.historicalCulture, advanced.player.historicalCulture);
  assert.deepEqual(kept.state.player.culturalLineage, ['yamnaya']);
  assert.equal(kept.state.player.pendingCultureChoice, null);
  assert.match(kept.state.player.campaignNotice, /сохранено/i);
  assert.match(kept.state.player.campaignNotice, /технологии/i);

  // Технологии эпохи идут от player.era и не зависят от решения о наследии.
  assert.ok(Campaign.scienceBranchesForEra(kept.state.player.era).some(branch => branch.id === 'bronze'),
    'бронзовые сплавы доступны сразу с эпохой «Античный мир»');
  assert.deepEqual(Campaign.allowedCardEras(kept.state.player.era), ['ancient', 'bronze'],
    'ковка бронзовых карт открывается вместе с эпохой, а не вместе с культурой');
  assert.equal(Campaign.hasEraKeyResource(kept.state), false,
    'ключевой ресурс эпохи 1 — бронза: гейт смотрит на эпоху и постройки, а не на наследие');
});

test('принять культуру эпохи и сохранить свою — одинаковые технологии, разные бонусы народа', () => {
  const advanced = advanceEra(startedCampaign());
  const choice = Campaign.getCultureChoice(advanced);
  const candidateId = choice.candidates[0].id;

  const kept = Campaign.chooseCultureState(advanced, 'keep');
  const adopted = Campaign.chooseCultureState(advanced, candidateId);
  assert.equal(adopted.error, null);
  assert.equal(adopted.kept, false);
  assert.equal(adopted.culture.id, candidateId);
  assert.equal(adopted.state.player.historicalCulture.id, candidateId);
  assert.ok(adopted.state.player.culturalLineage.includes(candidateId), 'принятая культура ложится в линию наследия');
  assert.deepEqual(adopted.state.player.culturalLineage[0], 'yamnaya', 'прежний корень линии не теряется');
  assert.match(adopted.state.player.campaignNotice, /принято/i);
  assert.ok(adopted.state.player.chronicle.some(entry => entry.text.includes(culture(candidateId).name)));

  // Технологии идентичны: отличие только в бонусах самого народа.
  assert.deepEqual(
    Campaign.scienceBranchesForEra(kept.state.player.era).map(branch => branch.id),
    Campaign.scienceBranchesForEra(adopted.state.player.era).map(branch => branch.id),
    'набор ветвей науки зависит от эпохи, а не от выбранного наследия'
  );
  assert.deepEqual(Campaign.allowedCardEras(kept.state.player.era), Campaign.allowedCardEras(adopted.state.player.era));
  assert.equal(Campaign.hasEraKeyResource(kept.state), Campaign.hasEraKeyResource(adopted.state));
  assert.deepEqual(Campaign.getRegionActionState(kept.state, kept.state.world.tiles.find(tile => tile.feature === 'copper-vein').id).reason,
    Campaign.getRegionActionState(adopted.state, adopted.state.world.tiles.find(tile => tile.feature === 'copper-vein').id).reason);
});

test('бонусы принятой культуры сразу видны в складе, производстве и колоде', () => {
  const advanced = advanceEra(startedCampaign());
  const withEgypt = Campaign.normalizeState({
    ...advanced,
    player: { ...advanced.player, pendingCultureChoice: { era: 1, candidates: ['egypt-old'], openedDay: advanced.day } }
  });

  const before = Campaign.getStorageCap(withEgypt);
  const beforeFood = Campaign.getProductionBreakdown(withEgypt).workerProduction.food;
  const adopted = Campaign.chooseCultureState(withEgypt, 'egypt-old');
  assert.equal(adopted.error, null);
  assert.equal(adopted.state.player.storageCap, before + culture('egypt-old').bonus.storage,
    'склад пересчитывается сразу после выбора');
  assert.equal(Campaign.getStorageCap(adopted.state), before + culture('egypt-old').bonus.storage);
  assert.ok(Campaign.getProductionBreakdown(adopted.state).workerProduction.food > beforeFood,
    '+🌾 от культуры Египта попадает в производство');

  const withAkkad = Campaign.normalizeState({
    ...advanced,
    player: { ...advanced.player, pendingCultureChoice: { era: 1, candidates: ['akkad'], openedDay: advanced.day } }
  });
  const deckBefore = Campaign.getBattleConfig(withAkkad).deckLimit;
  const akkadAdopted = Campaign.chooseCultureState(withAkkad, 'akkad');
  assert.equal(Campaign.getBattleConfig(akkadAdopted.state).deckLimit, deckBefore + 1,
    '+1 слот колоды от Аккада применяется к бою');
});

test('выбор наследия защищён от чужих эпох, повторного выбора и молчаливого урезания колоды', () => {
  const advanced = advanceEra(startedCampaign());
  assert.match(Campaign.chooseCultureState(advanced, 'mongols').error, /нет среди предложенных/,
    'культура другой эпохи не принимается');
  assert.match(Campaign.chooseCultureState(advanced, 'unknown-culture').error, /нет среди предложенных/);
  assert.equal(advanced.player.historicalCulture.id, 'yamnaya', 'отклонённый выбор ничего не меняет');

  const done = Campaign.chooseCultureState(advanced, 'keep');
  assert.equal(done.error, null);
  assert.match(Campaign.chooseCultureState(done.state, 'keep').error, /не открыт/);
  assert.equal(Campaign.getCultureChoice(done.state), null);

  // Аккад даёт +1 слот колоды: уход с него на культуру без deck_slots урезал бы колоду молча.
  let deckState = Campaign.createState(TEST_SEED);
  deckState.player.onboardingComplete = true;
  deckState.player.historicalCulture = culture('akkad');
  deckState.player.culturalLineage = ['akkad'];
  deckState.player.deckCardIds = ['card-1', 'card-2', 'card-3', 'card-4', 'card-5'];
  deckState = Campaign.normalizeState({
    ...deckState,
    player: { ...deckState.player, era: 1, pendingCultureChoice: { era: 1, candidates: ['sumer'], openedDay: 1 } }
  });
  assert.equal(Campaign.getBattleConfig(deckState).deckLimit, 5);
  const denied = Campaign.chooseCultureState(deckState, 'sumer');
  assert.match(denied.error, /лимит колоды/);
  assert.match(denied.error, /Отряд/);
  assert.equal(denied.state.player.historicalCulture.id, 'akkad', 'отказ не меняет наследие');
  assert.ok(denied.state.player.pendingCultureChoice, 'выбор остаётся открытым, чтобы игрок сначала разобрал колоду');
  assert.equal(Campaign.chooseCultureState(deckState, 'keep').error, null, 'сохранить своё наследие можно всегда');
});

test('неотвеченный выбор закрывается как «сохранили прежнее» при следующем переходе эпохи', () => {
  const first = advanceEra(startedCampaign());
  assert.equal(first.player.pendingCultureChoice.era, 1);

  const second = advanceEra(first);
  assert.equal(second.player.era, 2);
  assert.deepEqual(second.player.historicalCulture, first.player.historicalCulture,
    'наследие по-прежнему не меняется само');
  assert.equal(second.player.pendingCultureChoice.era, 2, 'открывается выбор уже для новой эпохи');
  assert.ok(second.player.pendingCultureChoice.candidates.every(id => culture(id).era === 2));
  assert.ok(second.player.chronicle.some(entry => /так и не был сделан/.test(entry.text)),
    'пропущенный выбор остаётся в летописи');
});

test('выбор наследия переживает сохранение, а старые и битые данные отбрасываются', () => {
  const advanced = advanceEra(startedCampaign());
  const restored = Campaign.normalizeState(JSON.parse(JSON.stringify(advanced)));
  assert.deepEqual(restored.player.pendingCultureChoice, advanced.player.pendingCultureChoice);

  const legacySave = { version: 2, season: 1, day: 5, medals: [], player: { onboardingComplete: true, era: 1, resources: { food: 5, materials: 5, knowledge: 5 } }, opponents: [], regions: [] };
  assert.equal(Campaign.normalizeState(legacySave).player.pendingCultureChoice, null,
    'в сохранениях до появления механики выбора наследия нет');

  const stored = JSON.parse(JSON.stringify(advanced));
  const wrongEra = Campaign.normalizeState({ ...stored, player: { ...stored.player, pendingCultureChoice: { era: 6, candidates: ['mongols'], openedDay: 3 } } });
  assert.equal(wrongEra.player.pendingCultureChoice, null, 'кандидаты чужой эпохи отбрасываются');
  const wrongCulture = Campaign.normalizeState({ ...stored, player: { ...stored.player, pendingCultureChoice: { era: 1, candidates: ['mongols', 'nope'], openedDay: 3 } } });
  assert.equal(wrongCulture.player.pendingCultureChoice, null, 'недействительные кандидаты отбрасываются целиком');
  const garbage = Campaign.normalizeState({ ...stored, player: { ...stored.player, pendingCultureChoice: 'mongols' } });
  assert.equal(garbage.player.pendingCultureChoice, null);
});

test('обе оболочки читают выбор наследия из модели, а не дублируют логику', async () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'game', 'model.js'), 'utf8');
  const M = (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).M;
  assert.equal(typeof M.getCultureChoice, 'function');
  assert.equal(typeof M.chooseCulture, 'function');
  assert.equal(typeof M.cultureCandidates, 'function');

  const develop = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'Develop.tsx'), 'utf8');
  assert.match(develop, /M\.getCultureChoice\(game\)/);
  assert.match(develop, /M\.chooseCulture\(s, id\)/);
  assert.match(develop, /pendingCultureChoice/);
  assert.match(develop, /Оставить прошлое наследие/);
  assert.match(develop, /Принять это наследие/);
  assert.match(develop, /Технологии эпохи/);

  const home = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'Home.tsx'), 'utf8');
  assert.match(home, /pendingCultureChoice/);
  assert.match(home, /Технологии эпохи/);

  const shell = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Shell.tsx'), 'utf8');
  assert.match(shell, /pendingCultureChoice/);

  const campaignSource = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  assert.match(campaignSource, /renderCultureChoice\(state\)/, 'standalone-страница рисует выбор наследия');
  assert.match(campaignSource, /CampaignMvp\.chooseCulture\(/);
  assert.match(campaignSource, /Сохранить прежнее наследие/);
});
