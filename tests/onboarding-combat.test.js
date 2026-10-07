/**
 * Онбординг прототипа: два осознанных выбора — наследие и замысел, каждый с боевым бонусом, и сразу лагерь.
 * Третьего свойства («Происхождение») нет: земля дублировала замысел тем же бонусом и той же ролью в имени.
 * Имени народа игрок не вводит (оно складывается из двух свойств), модель не выбирает,
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

const startCultures = Campaign.HISTORICAL_CULTURES.filter((c) => c.era === 0);

test('два шага: наследие, замысел — и никакого ввода имени', () => {
  assert.match(onboarding, /const STEPS = \["Наследие", "Замысел"\];/u);
  assert.equal(Campaign.SEED_CHOICES.length, 5);
  assert.equal(startCultures.length, 6, 'культур каменного века для первого выбора');
  assert.match(onboarding, /M\.HISTORICAL_CULTURES\.filter\(\(c: any\) => c\.era === 0\)/);

  // свойства земли исчезли вместе с самим свойством
  assert.equal(Campaign.ORIGINS, undefined, 'списка земель больше нет');
  assert.equal(Campaign.originPeopleName, undefined, 'имя из земли больше не считают');
  for (const gone of ['M.ORIGINS', 'originId', 'originPeopleName', 'Откуда пришёл ваш народ', 'Земля задаёт характер войны']) {
    assert.ok(!onboarding.includes(gone), `в онбординге не должно быть «${gone}»`);
  }
  assert.equal('originId' in Campaign.createState().player, false, 'в состоянии нет поля земли');

  // имя народа — производное от двух свойств, поля ввода нет
  assert.ok(!/<input/.test(onboarding), 'в онбординге нет полей ввода');
  const names = startCultures.flatMap((c) => Campaign.SEED_CHOICES.map((s) => Campaign.peopleName(c, s)));
  assert.equal(names.length, 30, 'шесть наследий × пять замыслов');
  assert.equal(new Set(names).size, names.length, 'у каждого сочетания своё имя народа');
  assert.ok(names.every((name) => name.length > 3 && !/undefined|NaN/.test(name)), 'имена читаются как имена');
  assert.match(onboarding, /M\.peopleName\(culture, seed\)/);
  assert.match(onboarding, /Основать народ «\$\{people\}»/u);

  // выбора модели нет: советник в онбординге не вызывается
  for (const gone of ['gpt-6', 'glm', 'ADVISOR_MODEL', 'llm', 'probeApiKey', 'SettingsModal']) {
    assert.ok(!onboarding.includes(gone), `в онбординге не должно быть ${gone}`);
  }
});

test('каждый выбор показывает свой боевой бонус', () => {
  assert.match(onboarding, /perksOf\(M\.cultureCombatBonus\(c\)\)/, 'бонус наследия виден на первом шаге');
  assert.match(onboarding, /perksOf\(c\.combat\)/, 'бонус замысла виден на втором шаге');
  assert.ok((onboarding.match(/combatNote/g) || []).length >= 1, 'пояснение бонуса показано рядом с выбором');
  assert.match(onboarding, /function perksOf\(bonus: any\): string\[\] \{\s*return M\.describePerks\(bonus \|\| \{\}\) as string\[\];/u);

  // данные согласованы с экраном: у каждого варианта ровно один бонус и пояснение к нему
  for (const seed of Campaign.SEED_CHOICES) {
    assert.equal(Campaign.describePerks(seed.combat).length, 1, `${seed.id}: один боевой бонус`);
    assert.ok(seed.combatNote && seed.combatNote.length > 10, `${seed.id}: есть пояснение`);
    assert.ok(seed.line && seed.line.length > 10, `${seed.id}: есть строка менталитета`);
    assert.ok(seed.peopleSuffix && seed.peopleSuffix.length > 2, `${seed.id}: есть половина имени народа`);
  }
  for (const culture of startCultures) {
    assert.equal(Campaign.describePerks(Campaign.cultureCombatBonus(culture)).length, 1, `${culture.id}: один боевой бонус`);
    assert.ok(culture.people && culture.people.length > 3, `${culture.id}: есть основа имени народа`);
  }

  // Два свойства покрывают пять бонусов из шести: стойкость к усталости осталась только в лагере.
  const covered = new Set([
    ...Campaign.SEED_CHOICES.flatMap((s) => Object.keys(s.combat).filter((k) => s.combat[k] > 0)),
    ...startCultures.flatMap((c) => Object.keys(Campaign.cultureCombatBonus(c)).filter((k) => Campaign.cultureCombatBonus(c)[k] > 0)),
  ]);
  assert.equal(covered.size, Campaign.COMBAT_KEYS.length - 1, 'наследие и замысел дают разные бонусы');
  assert.equal(covered.has('fatigue_resist'), false, 'устойчивость к усталости — не свойство народа');
  for (const key of Campaign.COMBAT_KEYS) {
    assert.ok(Campaign.CAMP_UPGRADES[key], `${key}: любой бонус добирается улучшением лагеря`);
  }
});

test('сводка вождя считается на настоящем состоянии до основания народа', () => {
  assert.match(onboarding, /M\.foundCampaign\(M\.createState\(\), \{ seedId, historicalCultureId: cultureId \}\)/);
  assert.match(onboarding, /M\.getBattleConfig\(trial\.state\)/);
  for (const chip of ['preview.hp', 'preview.deckLimit', 'preview.energyMax', 'preview.energyGrowth', 'preview.atkBonus', 'preview.fatigueDelay']) {
    assert.ok(onboarding.includes(chip), `в сводке вождя должен быть ${chip}`);
  }

  // предпросмотр и реальное основание дают одни и те же числа
  const ids = { seedId: 'forge', historicalCultureId: 'yamnaya' };
  const preview = Campaign.getBattleConfig(Campaign.foundCampaignState(Campaign.createState(), ids).state);
  const founded = Campaign.foundCampaignState(Campaign.createState(), ids).state;
  assert.deepEqual(Campaign.getBattleConfig(founded).perks, preview.perks);
  assert.equal(Campaign.getBattleConfig(founded).hp, preview.hp);
  assert.equal(Campaign.getBattleConfig(founded).atkBonus, preview.atkBonus);
  // потолок виден сразу: оба источника одного бонуса упираются в ограничение
  assert.equal(preview.atkBonus, Campaign.COMBAT_CAPS.atkBonus);
  assert.equal(preview.capped.unit_power, true);
});

test('основание народа ведёт в лагерь, а не в поселение или науку', () => {
  assert.match(onboarding, /foundPeople\(\{ seedId, historicalCultureId: cultureId \}\)/);
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

test('стор основывает народ двумя идентификаторами и ничего больше не спрашивает', () => {
  assert.match(store, /foundPeople = useCallback\(\(\{ seedId, historicalCultureId \}/u);
  assert.match(store, /M\.foundCampaign\(M\.clone\(gameRef\.current\), \{ seedId, historicalCultureId \}\)/);
  assert.match(store, /if \(founded\.error\) return \{ ok: false, error: founded\.error as string \};/);
  assert.match(store, /commit\(founded\.state, \{ silent: true \}\)/);
  assert.ok(!store.includes('originId'), 'стор больше не передаёт землю');

  // модель так же не принимает имя: попытка передать своё игнорируется
  const res = Campaign.foundCampaignState(Campaign.createState(), { name: 'Своя кличка', seedId: 'sky', historicalCultureId: 'jomon' });
  const culture = startCultures.find((c) => c.id === 'jomon');
  const seed = Campaign.SEED_CHOICES.find((s) => s.id === 'sky');
  assert.equal(res.state.player.name, Campaign.peopleName(culture, seed));
  assert.equal(res.state.player.name, 'Народ Дзёмона Неба');
  assert.equal('originId' in res.state.player, false, 'земля не сохраняется в состоянии');
});
