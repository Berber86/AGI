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
  assert.equal(player.blueprints[0].id.startsWith('opening-'), true);
  assert.ok(player.chronicle.some(entry => entry.text.includes('Учёт разливов')), 'the first project is written into the chronicle');
});

test('the first session guide leads from the generated project and can be dismissed', () => {
  const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), seedInput()).state;
  assert.equal(Campaign.getFirstSessionGuide(begun), null, 'no guide before the first project exists');

  const started = Campaign.setOpeningProject(begun, project()).state;
  const guide = Campaign.getFirstSessionGuide(started);
  assert.equal(guide.complete, false);
  assert.deepEqual(guide.steps.map(step => step.id), ['research', 'build', 'territory', 'battle']);
  assert.equal(guide.completedCount, 0);

  const dismissed = Campaign.skipGuide(Campaign.clone(started)).state;
  const afterSkip = Campaign.getFirstSessionGuide(dismissed);
  assert.equal(afterSkip.complete, true);
  assert.equal(afterSkip.dismissed, true);
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
  assert.ok(cards.includes('llmOpeningProject'), 'the first project is generated by the model');
  assert.ok(cards.includes('llmScienceOffers'), 'later projects are generated by the model');
  assert.ok(cards.includes('probeApiKey'), 'the API key is verified');
  const store = read('src/game/store.tsx');
  assert.ok(store.includes('beginOnboardingState'), 'the store starts the campaign through the seed path');
  assert.ok(store.includes('setOpeningProject'), 'the store applies the generated first project');
  const onboarding = read('src/pages/Onboarding.tsx');
  assert.ok(onboarding.includes('verifyKey'), 'onboarding requires a verified API key');
  assert.ok(!/ключ[^<]{0,40}необязательн/i.test(onboarding), 'the onboarding never calls the key optional');
});

test('the hand-held route can be finished: research, build, take land and train', () => {
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

  const guide = Campaign.getFirstSessionGuide(taken.state);
  assert.deepEqual(guide.steps.map(step => step.id), ['research', 'build', 'territory', 'battle']);
  assert.deepEqual(guide.steps.map(step => step.done), [true, true, true, false]);
  assert.equal(guide.completedCount, 3);
  assert.ok(guide.next.includes('тренировочный бой'), 'the last step points to a practice battle');
});

test('the legacy standalone page still starts through the old fixed-focus path', () => {
  const legacy = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river', openingFocusId: 'food' });
  assert.equal(legacy.error, null);
  assert.equal(legacy.state.player.onboardingComplete, true);
  assert.equal(legacy.state.player.blueprints[0].openingProject, true);
  const campaign = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  assert.ok(campaign.includes('CampaignMvp.beginOnboarding(event)'), 'the standalone screen keeps its own onboarding handler');
  assert.ok(campaign.includes('первый проект берётся из локального списка'), 'the standalone screen is honest about its local pool');
});
