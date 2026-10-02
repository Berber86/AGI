// Направления науки. Советник больше не предлагает готовый список ветвей: сначала модель придумывает
// ТРИ ПРЕВЬЮ направлений — о ЧЁМ будет наука этого народа (земледелие, ремесло, война, религия,
// знание, устройство общества и их сочетания), — опираясь на выбранные свойства народа; игрок выбирает
// одно, и только второй вызов модели раскрывает его в конкретную науку и постройку. Религия стала
// пятой категорией (cult / monastic / civic-faith), а не «общественным» вообще.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Campaign = require('../campaign.js');
const TEST_SEED = 12345;

const FIXTURE = [
  {
    title: 'Запруды у Тихой Ивы',
    summary: 'Плетни и канавы держат воду на разливе, чтобы сеять раньше и снимать второй сноп.',
    theme: 'agriculture',
    category: 'economy',
    effects: [{ type: 'income_food', amount: 1 }],
    icon: '🌾',
    rationale: 'Народ живёт на разливе: еда — первое узкое место.'
  },
  {
    title: 'Обряд первого снопа',
    summary: 'Жрецы ведут счёт сезонов и хранят зерно общины; обряд сплачивает кланы.',
    theme: 'religion',
    category: 'religion',
    effects: [{ type: 'income_faith', amount: 1 }],
    icon: '🙏',
    rationale: 'Духовность кормит просветление эпохи, а обряд даёт ей место.'
  },
  {
    title: 'Плетёные щиты',
    summary: 'Ивовые щиты на кожаной основе держат удар лучше простых досок.',
    theme: 'military',
    category: 'military',
    effects: [{ type: 'unit_power', amount: 1 }],
    icon: '⚔️',
    rationale: 'Соседи приходят за зерном — нужна защита запруд.'
  }
];

function played(seed = TEST_SEED) {
  const state = Campaign.beginOnboardingState(Campaign.createState(seed), {
    name: 'Тестовый народ', originId: 'river', seedId: 'forge'
  }).state;
  state.player.onboardingComplete = true;
  return Campaign.normalizeState(state);
}

/** Legacy-страница в песочнице: свой fetch, свой ключ, свой «экран». */
function legacy(state, options = {}) {
  const apiKey = options.apiKey === undefined ? 'test-key' : options.apiKey;
  const replies = options.replies || [];
  const host = {
    _html: '',
    get innerHTML() { return this._html; },
    set innerHTML(value) { this._html = value; },
    querySelectorAll() { return []; }
  };
  const status = { textContent: '' };
  const submit = { disabled: false, textContent: '' };
  const branchSelect = { value: 'agriculture' };
  const controls = {
    'campaign-root': host,
    'campaign-project-status': status,
    'campaign-project-submit': submit,
    'campaign-project-branch': branchSelect
  };
  let stored = JSON.stringify(state);
  const calls = [];
  const fakeWindow = {
    CampaignMap: require('../campaign-map.js'),
    localStorage: {
      getItem: key => key === Campaign.STORAGE_KEY ? stored : null,
      setItem: (key, value) => { if (key === Campaign.STORAGE_KEY) stored = value; }
    },
    document: { getElementById: id => controls[id] || null },
    getApiKey: () => apiKey,
    getSelectedModel: () => ({ name: 'test-model', baseUrl: 'http://127.0.0.1:1/v1' }),
    alert() {}
  };
  const sandbox = {
    window: fakeWindow,
    console: { error() {} },
    Date, Math, JSON, Number, String, Object, Array, Set,
    fetch: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      const payload = replies.length > 1 ? replies.shift() : replies[0];
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }) };
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8'), sandbox, { timeout: 20000 });
  return { app: fakeWindow.CampaignMvp, host, status, submit, calls, branchSelect };
}

test('словарь тем направлений покрывает все роды занятий, включая религию', () => {
  const themes = Campaign.SCIENCE_DIRECTION_THEMES;
  assert.equal(themes.length, 7, 'земледелие, производство, война, религия, знание, общество, смешанное');
  assert.deepEqual(themes.map(theme => theme.id),
    ['agriculture', 'production', 'military', 'religion', 'knowledge', 'society', 'mixed']);
  for (const theme of themes) {
    assert.ok(theme.label && theme.icon, 'тема показывается в UI: ' + theme.id);
    assert.ok(Campaign.EFFECTS[theme.effect], 'обещанный эффект темы существует: ' + theme.effect);
    assert.ok(Campaign.CATEGORIES.includes(theme.category), 'категория темы известна: ' + theme.category);
  }
  assert.equal(themes.find(theme => theme.id === 'religion').effect, 'income_faith');
  // Религия — отдельная категория, а не «общественное»: на неё завязан эффект income_faith.
  assert.ok(Campaign.CATEGORIES.includes('religion'));
  assert.equal(Campaign.CATEGORY_NAMES.religion, 'религиозное');
  assert.equal(Campaign.EFFECTS.income_faith.category, 'religion');
});

test('sanitizeScienceDirection отбраковывает мусор и подтягивает эффект темы', () => {
  assert.equal(Campaign.sanitizeScienceDirection(null), null);
  assert.equal(Campaign.sanitizeScienceDirection({ title: 'Без описания' }), null, 'нет summary — превью не показываем');
  assert.equal(Campaign.sanitizeScienceDirection({ summary: 'Без названия' }), null);

  const clean = Campaign.sanitizeScienceDirection(FIXTURE[1]);
  assert.ok(clean.id.startsWith('direction-'), 'устойчивый id для ключей списка');
  assert.deepEqual(
    { title: clean.title, theme: clean.theme, themeLabel: clean.themeLabel, category: clean.category, icon: clean.icon },
    { title: 'Обряд первого снопа', theme: 'religion', themeLabel: 'Вера и обряд', category: 'religion', icon: '🙏' }
  );
  assert.deepEqual(clean.effects, [{ type: 'income_faith', amount: 1 }]);

  // Неизвестная тема падает в «смешанное», неизвестный эффект — в эффект темы, лишняя категория — в категорию темы.
  const odd = Campaign.sanitizeScienceDirection({
    title: 'Странное направление', summary: 'Модель придумала тему вне словаря.',
    theme: 'astrology', category: 'not_a_category', effects: [{ type: 'not_an_effect', amount: 99 }], icon: ''
  });
  assert.equal(odd.theme, 'mixed');
  assert.equal(odd.category, 'civic', 'категория берётся у темы «смешанное»');
  assert.deepEqual(odd.effects, [{ type: Campaign.SCIENCE_DIRECTION_THEMES.find(theme => theme.id === 'mixed').effect, amount: 1 }]);
  assert.equal(odd.icon, '🧭', 'иконка берётся у темы');

  // Длинные строки обрезаются, amount не превышает максимум эффекта.
  const long = Campaign.sanitizeScienceDirection({
    title: 'Т'.repeat(200), summary: 'С'.repeat(900), theme: 'religion',
    effects: [{ type: 'income_faith', amount: 40 }], rationale: 'Р'.repeat(500), icon: '🙏🙏🙏'
  });
  assert.ok(long.title.length <= 60);
  assert.ok(long.summary.length <= 320);
  assert.ok(long.rationale.length <= 220);
  assert.ok(long.icon.length <= 4);
  // cleanEffects не ужимает amount, а отвергает весь список: остаётся обещанный эффект темы.
  assert.deepEqual(long.effects, [{ type: 'income_faith', amount: 1 }]);
});

test('setScienceDirections хранит до трёх превью и отменяет прежний выбор', () => {
  const base = played();
  assert.equal(base.player.directionChoices, null);
  assert.equal(base.player.directionChoice, null);

  const empty = Campaign.setScienceDirections(base, []);
  assert.match(empty.error, /ни одного направления/);
  assert.equal(empty.state.player.directionChoices, null);

  const many = Campaign.setScienceDirections(base, [...FIXTURE, ...FIXTURE]);
  assert.equal(many.directions.length, 3, 'больше трёх превью не показываем');
  assert.equal(many.state.player.directionChoices.directions.length, 3);
  assert.equal(many.state.player.directionChoices.day, many.state.day);

  const picked = Campaign.chooseScienceDirection(many.state, 1);
  assert.equal(picked.error, null);
  assert.equal(picked.direction.title, 'Обряд первого снопа');
  assert.equal(picked.state.player.directionChoices, null, 'превью убраны после выбора');

  // «Сменить направление»: новые превью сбрасывают прежний выбор, иначе UI остался бы на старом.
  const again = Campaign.setScienceDirections(picked.state, FIXTURE);
  assert.equal(again.state.player.directionChoice, null);
  assert.equal(again.state.player.directionChoices.directions.length, 3);

  const bad = Campaign.chooseScienceDirection(again.state, 7);
  assert.match(bad.error, /Такого направления уже нет/);
  assert.equal(bad.state.player.directionChoice, null);

  // Состояние переживает нормализацию (сохранение/загрузку).
  const restored = Campaign.normalizeState(JSON.parse(JSON.stringify(again.state)));
  assert.equal(restored.player.directionChoices.directions.length, 3);
  assert.equal(restored.player.directionChoices.directions[0].id, again.state.player.directionChoices.directions[0].id);
});

test('scienceAdvisorSituation отдаёт модели замысел народа, словарь тем и выбранное направление', () => {
  const situation = Campaign.scienceAdvisorSituation(played());
  assert.ok(situation.seedName, 'имя замысла народа известно советнику');
  assert.ok(situation.seedHint, 'подсказка замысла уходит модели целиком');
  assert.ok(situation.summary.includes(situation.seedName), 'замысел назван в контексте');
  assert.equal(situation.themes.length, Campaign.SCIENCE_DIRECTION_THEMES.length);
  assert.equal(situation.direction, null);

  const stored = Campaign.setScienceDirections(played(), FIXTURE);
  const picked = Campaign.chooseScienceDirection(stored.state, 1);
  const after = Campaign.scienceAdvisorSituation(picked.state);
  assert.equal(after.direction.title, 'Обряд первого снопа');
  assert.equal(after.direction.theme, 'religion');
});

test('принятый замысел записывает направление в чертёж, и оно переживает сохранение', () => {
  let state = played();
  state = Campaign.setScienceDirections(state, FIXTURE).state;
  state = Campaign.chooseScienceDirection(state, 0).state;
  state.player.scienceChoices = {
    branchId: 'direction:agriculture',
    day: state.day,
    projects: [{
      scienceName: 'Счёт паводков',
      scienceDescription: 'Наблюдатели ведут счёт воды по зарубкам на камне.',
      buildingName: 'Водомерный камень',
      buildingDescription: 'Камень с зарубками у берега подсказывает время сева.',
      category: 'economy',
      effects: [{ type: 'income_food', amount: 1 }]
    }]
  };
  const accepted = Campaign.acceptScienceProject(state, 0);
  assert.equal(accepted.error, null);
  const blueprint = accepted.state.player.blueprints[0];
  assert.equal(blueprint.scienceName, 'Счёт паводков');
  assert.deepEqual(blueprint.direction, {
    title: 'Запруды у Тихой Ивы',
    theme: 'agriculture',
    themeLabel: 'Земледелие',
    summary: 'Плетни и канавы держат воду на разливе, чтобы сеять раньше и снимать второй сноп.',
    icon: '🌾'
  });
  assert.equal(accepted.state.player.directionChoices, null);

  const restored = Campaign.normalizeState(JSON.parse(JSON.stringify(accepted.state)));
  assert.equal(restored.player.blueprints[0].direction.title, 'Запруды у Тихой Ивы');
  assert.equal(restored.player.blueprints[0].direction.theme, 'agriculture');

  // Чертежи без направления (старые сохранения, оффлайн-ветвь) остаются валидными.
  const plain = played();
  plain.player.scienceChoices = {
    branchId: 'stonecraft',
    day: plain.day,
    projects: [{
      scienceName: 'Каменная мастерская', scienceDescription: 'Обработка камня.', buildingName: 'Каменный двор',
      buildingDescription: 'Двор.', category: 'economy', effects: [{ type: 'income_materials', amount: 1 }]
    }]
  };
  const plainAccepted = Campaign.acceptScienceProject(plain, 0);
  assert.equal(plainAccepted.error, null);
  assert.equal(plainAccepted.state.player.blueprints[0].direction, null);
});

test('религиозные ветви разведены по эпохам и имеют пулы разнообразия', () => {
  const religion = Campaign.SCIENCE_BRANCHES.filter(branch => branch.category === 'religion');
  assert.deepEqual(religion.map(branch => [branch.id, branch.minEra]),
    [['cult', 0], ['monastic', 2], ['civic-faith', 5]],
    'обряд с Каменного века, монастырская книжность со Средневековья, гражданская вера с Ренессанса');
  for (const branch of Campaign.SCIENCE_BRANCHES) {
    assert.ok(Campaign.CATEGORIES.includes(branch.category), 'категория ветви известна: ' + branch.id);
    assert.ok(Array.isArray(Campaign.DIVERSITY_POOLS.sciencePrefixes[branch.id]) && Campaign.DIVERSITY_POOLS.sciencePrefixes[branch.id].length,
      'оффлайн-пул названий есть у ветви ' + branch.id);
    assert.ok(Array.isArray(Campaign.DIVERSITY_POOLS.events[branch.id]) && Campaign.DIVERSITY_POOLS.events[branch.id].length,
      'оффлайн-пул событий есть у ветви ' + branch.id);
  }
  assert.equal(Campaign.scienceBranchesForEra(0).filter(branch => branch.category === 'religion').length, 1);
  assert.equal(Campaign.scienceBranchesForEra(6).filter(branch => branch.category === 'religion').length, 3);
});

test('legacy-советник показывает превью направлений вместо готового списка ветвей', async () => {
  const { app, host, status, calls } = legacy(played(), {
    replies: [
      { directions: FIXTURE },
      {
        projects: [{
          scienceName: 'Счёт паводков',
          scienceDescription: 'Наблюдатели ведут счёт воды по зарубкам на камне.',
          buildingName: 'Водомерный камень',
          buildingDescription: 'Камень с зарубками у берега подсказывает время сева.',
          category: 'economy',
          effects: [{ type: 'income_food', amount: 1 }]
        }, {
          scienceName: 'Обряд разлива',
          scienceDescription: 'Жрецы отмечают разлив и хранят зерно общины.',
          buildingName: 'Плетнёвое святилище',
          buildingDescription: 'Святилище из плетня у берега.',
          category: 'religion',
          effects: [{ type: 'income_faith', amount: 1 }]
        }, {
          scienceName: 'Плетёные щиты',
          scienceDescription: 'Ивовые щиты на кожаной основе.',
          buildingName: 'Ивовый стан',
          buildingDescription: 'Мастерская плетёных щитов.',
          category: 'military',
          effects: [{ type: 'unit_power', amount: 1 }]
        }]
      }
    ]
  });
  app.render();
  // До запроса: кнопка к советнику, а готовый <select> спрятан в запасной путь.
  assert.match(host.innerHTML, /Спросить о направлениях/);
  assert.match(host.innerHTML, /Без советника: ветвь вручную/);
  assert.equal((host.innerHTML.match(/<select\b/g) || []).length, 1);
  assert.match(host.innerHTML, /Темы направлений/);

  await app.requestScienceDirections();
  assert.equal(calls.length, 1);
  const [system, user] = calls[0].body.messages.map(message => message.content);
  assert.ok(user.includes('Замысел народа'), 'свойства народа уходят модели');
  assert.ok(system.includes('religion'), 'религия — равноправная тема');
  assert.equal(app.getState().player.directionChoices.directions.length, 3);
  assert.equal((host.innerHTML.match(/Выбрать это направление/g) || []).length, 3);
  assert.match(host.innerHTML, /Другие направления/);
  assert.match(status.textContent, /Три направления готовы/);

  app.pickScienceDirection(1);
  const chosen = app.getState().player.directionChoice;
  assert.equal(chosen.title, 'Обряд первого снопа');
  assert.equal(app.getState().player.directionChoices, null);
  assert.match(host.innerHTML, /Замыслы в этом направлении/);
  assert.match(host.innerHTML, /Сменить направление/);
  assert.doesNotMatch(host.innerHTML, /Выбрать это направление/);

  await app.generateProject({ preventDefault() {} });
  assert.equal(calls.length, 2);
  const [projectSystem, projectUser] = calls[1].body.messages.map(message => message.content);
  assert.ok(projectSystem.includes('Обряд первого снопа'), 'второй вызов раскрывает выбранное направление');
  assert.ok(projectUser.includes('Обряд первого снопа'));
  assert.equal(app.getState().player.scienceChoices.branchId, 'direction:religion');
  assert.equal((host.innerHTML.match(/Принять замысел/g) || []).length, 3);

  app.chooseScience(0);
  const after = app.getState();
  assert.equal(after.player.blueprints.length, 1);
  assert.equal(after.player.blueprints[0].direction.theme, 'religion', 'направление осталось в чертеже');
  assert.equal(after.player.dailyOrders.researchUsed, 1, 'приём замысла тратит приказ «Исследование»');
});

test('без ключа LLM legacy-советник собирает местные черновики по теме направления', async () => {
  const { app, host, status, calls } = legacy(played(), { apiKey: '', replies: [] });
  // Превью без модели не существует: игрок видит предупреждение и запасной путь с ветвями.
  await app.requestScienceDirections();
  assert.equal(calls.length, 0, 'без ключа запросов к модели нет');
  assert.match(status.textContent, /Без ключа LLM/);

  // Направление можно задать и из сохранённого состояния — оффлайн-путь раскроет его в черновики.
  const stored = Campaign.setScienceDirections(played(), FIXTURE);
  const offline = legacy(Campaign.chooseScienceDirection(stored.state, 1).state, { apiKey: '', replies: [] });
  offline.app.render();
  await offline.app.generateProject({ preventDefault() {} });
  assert.equal(offline.calls.length, 0);
  const choices = offline.app.getState().player.scienceChoices;
  assert.equal(choices.branchId, 'direction:religion');
  assert.equal(choices.projects.length, 3, 'оффлайн-пулы дают три разных черновика');
  assert.ok(choices.projects.every(project => project.scienceName && project.buildingName));
  assert.match(offline.status.textContent, /API-ключ не задан/);
  assert.match(offline.host.innerHTML, /Принять замысел/);
});
