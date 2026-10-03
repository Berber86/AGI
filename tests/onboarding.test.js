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
  const inputs = (onboarding.match(/<input/g) || []).length;
  const credentials = (onboarding.match(/type="password"/g) || []).length;
  assert.equal(inputs, credentials, 'the only field left is the API key');
  assert.ok(onboarding.includes('M.SEED_CHOICES'), 'the seed is chosen from the prepared options');
  assert.ok(onboarding.includes('M.ORIGINS'), 'the origin is chosen from the prepared options');

  const noChoice = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river' });
  assert.equal(typeof noChoice.error, 'string', 'the game cannot start without a chosen seed');
  const wrongChoice = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river', seedId: 'invented' });
  assert.equal(typeof wrongChoice.error, 'string');
  assert.ok(Campaign.SEED_CHOICES.length >= 4, 'there are enough options to choose from');
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
  assert.ok(cards.includes('llmOpeningBuildingOffers'), 'the builder generates three first-turn blueprints');
  assert.ok(cards.includes('llmScienceOffers'), 'later projects are generated by the model');
  assert.ok(cards.includes('probeApiKey'), 'the API key is verified');
  const store = read('src/game/store.tsx');
  const onboarding = read('src/pages/Onboarding.tsx');
  assert.ok(store.includes('beginOnboardingState'), 'the store starts the campaign through the seed path');
  assert.ok(store.includes('llmOpeningBuildingOffers'), 'the store asks the builder for three starting options');
  assert.ok(store.includes('setOpeningProject'), 'the store applies only the blueprint selected by the player');
  const map = read('src/pages/MapPage.tsx');
  assert.ok(store.includes('llmRegionBuildingOffers'), 'each captured cell gets advisor-generated regional options');
  assert.ok(store.includes('setRegionBuildingOffersState'), 'regional options are saved on their own cell');
  assert.ok(map.includes('Три чертежа для этой клетки'), 'the map shows the three local plans after a cell is claimed');
  assert.ok(map.includes('M.buildRegionBuilding(s, def.id, offer.id)'), 'the player builds the selected plan on that exact cell');
  assert.ok(onboarding.includes('Построек пока нет'), 'the offer screen makes clear that no building is granted');
  assert.ok(onboarding.includes('Начать с'), 'the player explicitly chooses the first blueprint');
  // The AI key is no longer entered or verified by hand anywhere in the game: it lives only
  // in the server-side HYDRA_API_KEY environment variable (see api/hydra.js), so onboarding
  // must not contain any key input/verification flow at all.
  assert.ok(!onboarding.includes('verifyKey'), 'onboarding must not verify a manually entered API key');
  assert.equal(/type="password"/.test(onboarding), false, 'no password/API-key field remains in onboarding');
  assert.ok(onboarding.includes('MODEL_GROUPS'), 'the player still picks which model family answers, just not a key');
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
