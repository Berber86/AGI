const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Campaign = require('../campaign.js');

const TEST_SEED = 4242;
const SEED = Campaign.SEED_CHOICES.find(choice => choice.id === 'river');
const SEED_LINE = SEED.line;
const seedInput = extra => ({ name: 'Тест', originId: 'river', seedId: 'river', ...extra });

function project(overrides = {}) {
  return {
    scienceName: 'Учёт разливов',
    scienceDescription: 'Наблюдатели отмечают высоту воды и переносят улов к старицам.',
    buildingName: 'Становая запруда',
    buildingDescription: 'Плетни и канавы удерживают рыбу у берега в сухой сезон.',
    category: 'economy',
    effects: [{ type: 'income_food', amount: 1 }],
    rationale: 'Народ живёт рекой, значит первая наука — про воду и рыбу.',
    ...overrides,
  };
}

test('beginOnboardingState stores the player seed and does not pre-create any project', () => {
  const result = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput());
  assert.equal(result.error, null);
  const player = result.state.player;
  assert.equal(player.seedLine, SEED_LINE, 'the seed comes from the chosen option');
  assert.equal(player.seedChoiceId, 'river');
  assert.equal(player.originId, 'river');
  assert.equal(player.onboardingComplete, false);
  assert.equal(player.awaitingOpeningProject, true);
  assert.equal(player.buildings.length, 0, 'the player starts with no pre-built building');
  assert.equal(player.blueprints.length, 0, 'no pre-written science or building may exist before the AI answers');
  assert.ok(player.chronicle[0].text.includes(SEED_LINE), 'the chronicle keeps the seed line');
  assert.equal(player.deckCardIds.length > 0, true);
});

test('beginOnboardingState rejects an unknown origin', () => {
  const result = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput({ originId: 'not-an-origin' }));
  assert.equal(typeof result.error, 'string');
  assert.equal(result.state.player.onboardingComplete, false);
});

test('setOpeningProject completes the start only with a valid AI project', () => {
  const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput()).state;
  const invalid = Campaign.setOpeningProject(Campaign.clone(begun), project({ effects: [{ type: 'not_an_effect', amount: 1 }] }));
  assert.equal(typeof invalid.error, 'string');
  assert.equal(invalid.state.player.onboardingComplete, false);

  const applied = Campaign.setOpeningProject(Campaign.clone(begun), project());
  assert.equal(applied.error, null);
  const player = applied.state.player;
  assert.equal(player.onboardingComplete, true);
  assert.equal(player.awaitingOpeningProject, false);
  assert.equal(player.blueprints.length, 1);
  assert.equal(player.blueprints[0].openingProject, true);
  assert.equal(player.blueprints[0].scienceName, 'Учёт разливов');
  assert.equal(player.blueprints[0].built, false, 'accepting a blueprint does not construct its building');
  assert.equal(player.buildings.length, 0, 'there is still no building when the first day begins');
  assert.equal(player.blueprints[0].id.startsWith('opening-'), true);
  assert.ok(player.chronicle.some(entry => entry.text.includes('Учёт разливов')), 'the first project is written into the chronicle');
});

test('the science advisor situation carries the player seed line', () => {
  const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput()).state;
  const situation = Campaign.scienceAdvisorSituation(begun);
  assert.equal(situation.seedLine, SEED_LINE);
  assert.ok(situation.summary.includes(SEED_LINE), 'the summary given to the model contains the seed line');
});

test('the starting screen offers choices only — the player never writes game content', () => {
  const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
  const onboarding = read('src/pages/Onboarding.tsx');
  assert.equal(/<textarea/.test(onboarding), false, 'no free-text seed field');
  assert.equal(/<input/.test(onboarding), false, 'no text inputs at all: neither a name nor a key');
  assert.ok(onboarding.includes('M.SEED_CHOICES'), 'the seed is chosen from the prepared options');
  assert.ok(onboarding.includes('M.ORIGINS'), 'the origin is chosen from the prepared options');

  const noChoice = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), { originId: 'river' });
  assert.equal(typeof noChoice.error, 'string', 'the game cannot start without a chosen seed');
  const wrongChoice = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), { originId: 'river', seedId: 'invented' });
  assert.equal(typeof wrongChoice.error, 'string');
  assert.ok(Campaign.SEED_CHOICES.length >= 4, 'there are enough options to choose from');
});

test('происхождение и замысел звучат в одном тоне с наследием: меньше вариантов, больше смысла', () => {
  // Раньше происхождение и замысел были написаны легче и короче, чем карточки наследия
  // (реальные культуры с датировками и находками). Теперь тон один у всех трёх шагов.
  assert.equal(Campaign.ORIGINS.length, 6, 'шесть земель вместо восьми');
  assert.equal(Campaign.SEED_CHOICES.length, 5, 'пять замыслов вместо шести');
  for (const origin of Campaign.ORIGINS) {
    assert.ok(origin.name && origin.place && origin.icon, 'карточка земли полная: ' + origin.id);
    assert.ok(origin.people, 'у земли есть имя народа — отдельного шага «Имя» больше нет: ' + origin.id);
    assert.ok(origin.description.length >= 80, 'описание земли содержательное, а не в одну фразу: ' + origin.id);
    assert.match(origin.historical, /до н\.э\.|тыс\./u, 'у земли есть датированный исторический прототип: ' + origin.id);
    assert.ok(Campaign.BIOMES.some(biome => biome.id === origin.biome), 'биом земли существует: ' + origin.id);
    assert.ok(['food', 'materials', 'knowledge'].includes(origin.resource), 'стартовый ресурс известен: ' + origin.id);
    assert.ok(origin.bonus >= 1 && origin.bonus <= 2, 'стартовый бонус в прежних пределах: ' + origin.id);
  }
  for (const seed of Campaign.SEED_CHOICES) {
    assert.ok(seed.name && seed.line && seed.hint && seed.icon, 'замысел полный: ' + seed.id);
    assert.ok(seed.note, 'у замысла есть исторический прототип, как у культур: ' + seed.id);
    assert.match(seed.note, /до н\.э\.|культура|Натуф|Гёбекли|Ямная|Триполье|Чатал|Левант/u,
      'прототип замысла — реальная археология: ' + seed.id);
    assert.ok(seed.line.length >= 30, 'строка замысла — законченная мысль: ' + seed.id);
  }
  // Тон проверяем и на отсутствие разговорных формулировок прежних списков.
  const joined = [...Campaign.ORIGINS, ...Campaign.SEED_CHOICES].map(item => `${item.name} ${item.description || ''} ${item.line || ''}`).join('\n');
  for (const casual of ['Как Нил в Египте', 'нам нужны воля', 'Мы торговцы соли', 'в зачатке']) {
    assert.equal(joined.includes(casual), false, `разговорная формулировка «${casual}» убрана`);
  }
});

test('имя народа происходит из выбранной земли: генератор имён и его экран удалены', () => {
  const steppe = Campaign.ORIGINS.find(origin => origin.id === 'steppe');
  assert.equal(Campaign.originPeopleName(steppe), steppe.people);
  assert.equal(Campaign.originPeopleName(null), '', 'без земли имени нет');

  // Имя не вводится и не перебрасывается: оно следует из происхождения.
  const founded = Campaign.foundCampaignState(Campaign.createState(TEST_SEED), { originId: 'steppe', seedId: 'herd', historicalCultureId: 'yamnaya' });
  assert.equal(founded.error, null);
  assert.equal(founded.state.player.name, steppe.people, 'имя народа — имя из происхождения');
  assert.ok(founded.state.player.chronicle[0].text.includes('Ямная культура'), 'наследие осталось в летописи');

  // Явно переданное имя (standalone-страница и старые сохранения) по-прежнему имеет приоритет.
  const legacyName = Campaign.foundCampaignState(Campaign.createState(TEST_SEED), { name: 'Своё Имя', originId: 'river', seedId: 'river' });
  assert.equal(legacyName.state.player.name, 'Своё Имя');

  const onboarding = fs.readFileSync(path.join(__dirname, '..', 'src/pages/Onboarding.tsx'), 'utf8');
  assert.equal(onboarding.includes('generateTribeName'), false, 'генератора имён в онбординге больше нет');
  assert.equal(/Перебросить имя/.test(onboarding), false, 'экран переброса имени удалён');
  assert.equal(/STEPS = \[.*"Имя"/.test(onboarding), false, 'шага «Имя» в онбординге нет');
  assert.ok(onboarding.includes('M.originPeopleName'), 'имя берётся из происхождения');
});

test('народ основывается тремя выборами: без стартовой науки, здания и вызова советника', () => {
  const founded = Campaign.foundCampaignState(Campaign.createState(TEST_SEED), seedInput({ historicalCultureId: 'gobekli' }));
  assert.equal(founded.error, null);
  const player = founded.state.player;
  assert.equal(player.onboardingComplete, true, 'игрок сразу попадает в поселение');
  assert.equal(player.awaitingOpeningProject, false, 'стартового проекта больше не ждём');
  assert.equal(player.blueprints.length, 0, 'ни одна наука не выдаётся на старте');
  assert.equal(player.buildings.length, 0, 'ни одно здание не выдаётся на старте');
  assert.equal(player.seedLine, SEED_LINE);
  assert.equal(player.historicalCulture.id, 'gobekli');
  assert.equal(player.originId, 'river');
  assert.ok(player.resources.food >= 10, 'стартовый бонус происхождения выдан');

  // Повторное основание невозможно, а незавершённый старый онбординг не выдаёт бонус дважды.
  assert.equal(typeof Campaign.foundCampaignState(Campaign.clone(founded.state), seedInput()).error, 'string');
  const halfDone = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput()).state;
  const before = halfDone.player.resources.food;
  const resumed = Campaign.foundCampaignState(halfDone, seedInput());
  assert.equal(resumed.error, null);
  assert.equal(resumed.state.player.onboardingComplete, true);
  assert.equal(resumed.state.player.resources.food, before, 'происхождение не применяется второй раз');

  // Советник на старте не вызывается: экран науки открывается только по клику игрока.
  const onboarding = fs.readFileSync(path.join(__dirname, '..', 'src/pages/Onboarding.tsx'), 'utf8');
  const store = fs.readFileSync(path.join(__dirname, '..', 'src/game/store.tsx'), 'utf8');
  assert.equal(/llm[A-Z]/.test(onboarding), false, 'онбординг не обращается к модели');
  assert.equal(/from "@\/game\/cards"/.test(onboarding), false, 'онбординг не импортирует LLM-слой');
  const foundPeople = store.slice(store.indexOf('const foundPeople'), store.indexOf('const foundPeople') + 700);
  assert.equal(/llm[A-Z]/.test(foundPeople), false, 'основание народа не дёргает советника');
  assert.match(foundPeople, /M\.foundCampaign/, 'стор завершает основание одной функцией модели');
});

test('the redesigned interface has no pre-written sciences, buildings or card ideas', () => {
  const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
  const forbidden = ['generateLocalScienceVariants', 'localAdvice', 'localCard', 'OPENING_FOCUSES'];
  for (const file of ['src/pages/Onboarding.tsx', 'src/pages/Develop.tsx', 'src/pages/Forge.tsx']) {
    const source = read(file);
    for (const token of forbidden) {
      assert.equal(source.includes(token), false, `${file} must not use the local pool ${token}`);
    }
  }
  const cards = read('src/game/cards.ts');
  assert.ok(cards.includes('llmScienceOffers'), 'науки по-прежнему придумывает модель');
  assert.ok(cards.includes('probeApiKey'), 'the API key is verified');
  assert.equal(cards.includes('llmOpeningBuildingOffers'), false, 'двухшагового старта (превью → советник-строитель) больше нет');
  assert.equal(cards.includes('llmDirectionPreviews'), false, 'превью направлений удалены вместе со вторым вызовом');

  const store = read('src/game/store.tsx');
  const onboarding = read('src/pages/Onboarding.tsx');
  const develop = read('src/pages/Develop.tsx');
  const map = read('src/pages/MapPage.tsx');
  assert.ok(store.includes('foundCampaign'), 'the store starts the campaign through the model');
  assert.ok(store.includes('llmRegionBuildingOffers'), 'each captured cell gets advisor-generated regional options');
  assert.ok(store.includes('setRegionBuildingOffersState'), 'regional options are saved on their own cell');
  assert.ok(map.includes('Три чертежа для этой клетки'), 'the map shows the three local plans after a cell is claimed');
  assert.ok(map.includes('M.buildRegionBuilding(s, def.id, offer.id)'), 'the player builds the selected plan on that exact cell');

  // Экран выбора науки и здания открывается только по клику игрока во вкладке «Наука».
  assert.ok(develop.includes('llmScienceOffers(model, game)'), 'вкладку «Наука» обслуживает один вызов советника');
  assert.match(develop, /Спросить советника/, 'кнопка вопроса советнику — единственный вход на этот экран');
  assert.equal(develop.includes('llmDirectionPreviews'), false, 'промежуточного шага «направления» больше нет');
  assert.equal(/Почему вашему народу/.test(develop) || /Почему вашему народу/.test(onboarding), false,
    'подпись «почему вашему народу» убрана из описаний наук');

  // The AI key is no longer entered or verified by hand anywhere in the game: it lives only
  // in the server-side HYDRA_API_KEY environment variable (see api/hydra.js), so onboarding
  // must not contain any key input/verification flow at all.
  assert.ok(!onboarding.includes('verifyKey'), 'onboarding must not verify a manually entered API key');
  assert.equal(/type="password"/.test(onboarding), false, 'no password/API-key field remains in onboarding');
});

test('выбор модели убран из интерфейса: одна модель на всё, GLM-5.2 — только редкие карты', () => {
  const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
  const onboarding = read('src/pages/Onboarding.tsx');
  const shell = read('src/components/Shell.tsx');
  const store = read('src/game/store.tsx');
  const campaign = read('campaign.js');

  assert.equal(onboarding.includes('MODEL_GROUPS'), false, 'шага «Советник» с выбором модели нет');
  assert.equal(/<select/.test(onboarding), false, 'в онбординге вообще нет выпадающих списков моделей');
  assert.equal(shell.includes('MODEL_GROUPS'), false, 'в настройках больше нет списка моделей');
  assert.equal(/setModel/.test(shell) || /setModel/.test(store), false, 'сменить модель из интерфейса нельзя');
  assert.equal(/iforge_model/.test(store.replace(/removeItem\("iforge_model"\)/g, '')), false,
    'старая запись выбора модели только стирается, а не читается');
  assert.ok(store.includes('ADVISOR_MODEL = "gpt-6-luna"'), 'модель советника зафиксирована в коде');
  assert.ok(store.includes('const model = ADVISOR_MODEL'), 'стор отдаёт одну и ту же модель всем советникам');
  assert.match(campaign, /modelByRarity: \{ ordinary: 'gpt-6-luna', uncommon: 'glm-5\.2', rare: 'glm-5\.2' \}/,
    'кузница меняет модель только по редкости карты');
});

test('the first project is affordable on day one: research, build and take land in any order', () => {
  const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput()).state;
  const started = Campaign.setOpeningProject(begun, project()).state;
  const blueprintId = started.player.blueprints[0].id;

  const researched = Campaign.researchBlueprint(Campaign.clone(started), blueprintId);
  assert.equal(researched.error, null, 'the first science is affordable on day one');
  const built = Campaign.constructBlueprint(Campaign.clone(researched.state), blueprintId);
  assert.equal(built.error, null, 'the first building is affordable on day one without waiting');

  const nextDay = Campaign.finishDayState(Campaign.clone(built.state)).state;
  const tile = nextDay.world.tiles.find(candidate => Campaign.getRegionActionState(nextDay, candidate.id).action === 'settle'
    && Campaign.getRegionActionState(nextDay, candidate.id).enabled);
  assert.ok(tile, 'a free neighbouring region is offered on the second day');
  const taken = Campaign.settleRegionState(Campaign.clone(nextDay), tile.id);
  assert.equal(taken.error, null);

  // Никакого обязательного маршрута: игрок сам решает, что делать, и ничего его не ведёт.
  assert.equal(taken.state.player.blueprints[0].built, true, 'первое дело построено — но это не шаг обучения, а обычный чертёж');
  assert.ok(Campaign.getRegionActionState(taken.state, tile.id).enabled !== undefined, 'карта остаётся доступной в любом порядке');
});

test('обучающего маршрута нет: в модели, в интерфейсе и в standalone-экране', () => {
  const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput()).state;
  const started = Campaign.setOpeningProject(begun, project()).state;
  // Игрок волен делать что хочет: ни функция маршрута, ни флаг «обучение пропущено» не нужны.
  assert.equal(typeof Campaign.getFirstSessionGuide, 'undefined', 'маршрут наставника удалён из модели');
  assert.equal(typeof Campaign.skipGuide, 'undefined');
  assert.equal('guideDismissed' in started.player, false, 'состояние больше не хранит флаг обучения');
  assert.equal(started.player.onboardingComplete, true, 'начало игры завершается первым делом, как и раньше');
  assert.equal(started.player.blueprints.length, 1);

  const sources = ['src/App.tsx', 'src/components/Shell.tsx', 'src/game/store.tsx', 'src/pages/Home.tsx', 'src/pages/Develop.tsx', 'src/pages/MapPage.tsx', 'src/pages/Army.tsx']
    .map(file => ({ file, text: fs.readFileSync(path.join(__dirname, '..', file), 'utf8') }));
  for (const { file, text } of sources) {
    assert.doesNotMatch(text, /getFirstSessionGuide|skipGuide|currentGuideStep|GuideBar/, `${file}: обучающий маршрут удалён`);
    assert.doesNotMatch(text, /[Нн]аставник|Первые шаги|Шаг \$\{/, `${file}: в интерфейсе нет шагов обучения`);
  }
  assert.match(sources.find(item => item.file === 'src/App.tsx').text, /page === "home" && <Home \/>/,
    'после создания народа игрок остаётся в поселении');

  const campaign = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  assert.doesNotMatch(campaign, /getFirstSessionGuide|skipGuide|campaign-first-session/);
  const css = fs.readFileSync(path.join(__dirname, '..', 'campaign.css'), 'utf8');
  assert.doesNotMatch(css, /campaign-first-session/);
});

test('the legacy standalone page still starts through the old fixed-focus path', () => {
  const legacy = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river', openingFocusId: 'food' });
  assert.equal(legacy.error, null);
  assert.equal(legacy.state.player.onboardingComplete, true);
  assert.equal(legacy.state.player.buildings.length, 0, 'the legacy onboarding path also does not build the fixed first blueprint for free');
  assert.equal(legacy.state.player.blueprints[0].openingProject, true);
  const campaign = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  assert.ok(campaign.includes('CampaignMvp.beginOnboarding(event)'), 'the standalone screen keeps its own onboarding handler');
  assert.ok(campaign.includes('первый проект берётся из локального списка'), 'the standalone screen is honest about its local pool');
});
