/**
 * Онбординг прототипа: три осознанных выбора, каждый с боевым бонусом, и сразу лагерь.
 * Имени народа игрок не вводит (оно происходит из земли), модель не выбирает,
 * а экономика, стройка и науки в онбординге не упоминаются.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const onboarding = read('src', 'pages', 'Onboarding.tsx');
const store = read('src', 'game', 'store.tsx');

test('три шага: происхождение, наследие, замысел — и никакого ввода имени', () => {
  assert.match(onboarding, /const STEPS = \["Происхождение", "Наследие", "Замысел"\];/u);
  assert.equal(Campaign.ORIGINS.length, 6);
  assert.equal(Campaign.SEED_CHOICES.length, 5);
  assert.equal(Campaign.HISTORICAL_CULTURES.filter(c => c.era === 0).length, 6, 'культур каменного века для первого выбора');
  assert.match(onboarding, /M\.HISTORICAL_CULTURES\.filter\(\(c: any\) => c\.era === 0\)/);

  // имя народа — производное от земли, поля ввода нет
  assert.ok(!/<input/.test(onboarding), 'в онбординге нет полей ввода');
  const names = Campaign.ORIGINS.map(o => Campaign.originPeopleName(o));
  assert.equal(new Set(names).size, names.length, 'у каждой земли своё имя народа');
  assert.match(onboarding, /M\.originPeopleName\(origin\)/);
  assert.match(onboarding, /Основать народ «\$\{people\}»/u);

  // выбора модели нет: советник в онбординге не вызывается
  for (const gone of ['gpt-6', 'glm', 'ADVISOR_MODEL', 'llm', 'probeApiKey', 'SettingsModal']) {
    assert.ok(!onboarding.includes(gone), `в онбординге не должно быть ${gone}`);
  }
});

test('каждый выбор показывает свой боевой бонус', () => {
  assert.match(onboarding, /perksOf\(o\.combat\)/, 'бонус земли виден на первом шаге');
  assert.match(onboarding, /perksOf\(M\.cultureCombatBonus\(c\)\)/, 'бонус наследия виден на втором шаге');
  assert.match(onboarding, /perksOf\(c\.combat\)/, 'бонус замысла виден на третьем шаге');
  assert.ok((onboarding.match(/combatNote/g) || []).length >= 2, 'пояснение бонуса показано рядом с выбором');
  assert.match(onboarding, /function perksOf\(bonus: any\): string\[\] \{\s*return M\.describePerks\(bonus \|\| \{\}\) as string\[\];/u);

  // данные согласованы с экраном: у каждого варианта ровно один бонус и пояснение к нему
  for (const origin of Campaign.ORIGINS) {
    assert.equal(Campaign.describePerks(origin.combat).length, 1, `${origin.id}: один боевой бонус`);
    assert.ok(origin.combatNote && origin.combatNote.length > 10, `${origin.id}: есть пояснение`);
    assert.ok(origin.historical && origin.historical.length > 10, `${origin.id}: археологическая справка`);
  }
  for (const seed of Campaign.SEED_CHOICES) {
    assert.equal(Campaign.describePerks(seed.combat).length, 1, `${seed.id}: один боевой бонус`);
    assert.ok(seed.combatNote && seed.combatNote.length > 10, `${seed.id}: есть пояснение`);
    assert.ok(seed.line && seed.line.length > 10, `${seed.id}: есть строка менталитета`);
  }
  for (const culture of Campaign.HISTORICAL_CULTURES.filter(c => c.era === 0)) {
    assert.ok(Campaign.describePerks(Campaign.cultureCombatBonus(culture)).length >= 1, `${culture.id}: наследие что-то даёт`);
  }
  // шесть земель покрывают все шесть боевых бонусов: выбор земли действительно меняет стиль боя
  const covered = new Set(Campaign.ORIGINS.flatMap(o => Object.keys(o.combat)));
  assert.deepEqual([...covered].sort(), [...Campaign.COMBAT_KEYS].sort());
});

test('сводка вождя считается на настоящем состоянии до основания народа', () => {
  assert.match(onboarding, /M\.foundCampaign\(M\.createState\(\), \{ originId, seedId, historicalCultureId: cultureId \}\)/);
  assert.match(onboarding, /M\.getBattleConfig\(trial\.state\)/);
  for (const chip of ['preview.hp', 'preview.deckLimit', 'preview.energyMax', 'preview.energyGrowth', 'preview.atkBonus', 'preview.fatigueDelay']) {
    assert.ok(onboarding.includes(chip), `в сводке вождя должен быть ${chip}`);
  }

  // предпросмотр и реальное основание дают одни и те же числа
  const ids = { originId: 'steppe', seedId: 'herd', historicalCultureId: 'yamnaya' };
  const preview = Campaign.getBattleConfig(Campaign.foundCampaignState(Campaign.createState(), ids).state);
  const founded = Campaign.foundCampaignState(Campaign.createState(), ids).state;
  assert.deepEqual(Campaign.getBattleConfig(founded).perks, preview.perks);
  assert.equal(Campaign.getBattleConfig(founded).hp, preview.hp);
  // потолок виден сразу: три источника одного бонуса упираются в ограничение
  assert.equal(preview.energyGrowth, Campaign.COMBAT_CAPS.energyGrowth);
  assert.equal(preview.capped.energy_growth, true);
});

test('основание народа ведёт в лагерь, а не в поселение или науку', () => {
  assert.match(onboarding, /foundPeople\(\{ originId, seedId, historicalCultureId: cultureId \}\)/);
  assert.match(onboarding, /go\("camp"\)/);
  assert.match(onboarding, /Выберите соперника и выйдите в первый бой/u);
  assert.match(onboarding, /Что произойдёт дальше/u);
  assert.match(onboarding, /победа даёт славу/u);
  for (const gone of ['go("develop")', 'go("map")', 'go("home")', 'llmScience', 'chooseScience']) {
    assert.ok(!onboarding.includes(gone), `в онбординге не должно быть ${gone}`);
  }
  // экономических слов на экране нет
  for (const gone of ['ResIcon', 'p.resources', 'workers', 'population', 'buildings', 'blueprints', 'dailyOrders']) {
    assert.ok(!onboarding.includes(gone), `в онбординге не должно быть ${gone}`);
  }
});

test('стор основывает народ тремя идентификаторами и ничего больше не спрашивает', () => {
  assert.match(store, /foundPeople = useCallback\(\(\{ originId, seedId, historicalCultureId \}/u);
  assert.match(store, /M\.foundCampaign\(M\.clone\(gameRef\.current\), \{ originId, seedId, historicalCultureId \}\)/);
  assert.match(store, /if \(founded\.error\) return \{ ok: false, error: founded\.error as string \};/);
  assert.match(store, /commit\(founded\.state, \{ silent: true \}\)/);

  // модель так же не принимает имя: попытка передать своё игнорируется
  const res = Campaign.foundCampaignState(Campaign.createState(), { name: 'Своя кличка', originId: 'coast', seedId: 'sky', historicalCultureId: 'natufian' });
  assert.equal(res.state.player.name, Campaign.originPeopleName(Campaign.ORIGINS.find(o => o.id === 'coast')));
  assert.equal(res.state.player.originId, 'coast');
});
