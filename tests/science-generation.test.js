const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const SEED = Campaign.SEED_CHOICES.find(choice => choice.id === 'forge');
const SEED_LINE = SEED.line;

function fakeResponse(payload, ok = true, status = 200) {
  return { ok, status, json: async () => payload, text: async () => JSON.stringify(payload) };
}

function modelReply(project) {
  return fakeResponse({ choices: [{ message: { content: JSON.stringify(project) } }] });
}

/** Загружает src/game/cards.ts с подставным моделью M, fetch и минимальным окружением. */
function loadCards(fetchImpl) {
  const file = path.join(root, 'src', 'game', 'cards.ts');
  const javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require(name) {
      if (name === './model') {
        return {
          M: {
            cleanEffects: Campaign.cleanEffects,
            CATEGORIES: Campaign.CATEGORIES,
            EFFECTS: Campaign.EFFECTS,
            GENERATIVE_EFFECTS: Campaign.GENERATIVE_EFFECTS,
            REGION_GENERATIVE_EFFECTS: Campaign.REGION_GENERATIVE_EFFECTS,
            REGION_BUILDINGS: Campaign.REGION_BUILDINGS,
            sanitizeRegionBuildingOffer: Campaign.sanitizeRegionBuildingOffer,
            SCIENCE_DIRECTION_THEMES: Campaign.SCIENCE_DIRECTION_THEMES,
            sanitizeScienceDirection: Campaign.sanitizeScienceDirection,
            hasEraKeyResource: Campaign.hasEraKeyResource,
            ERA_KEY_RESOURCE: Campaign.ERA_KEY_RESOURCE,
            DECREES: Campaign.DECREES,
            eraName: Campaign.eraName,
            scienceAdvisorSituation: Campaign.scienceAdvisorSituation,
            seededRandom: Campaign.seededRandom,
          },
        };
      }
      throw new Error(`Unexpected import ${name}`);
    },
    fetch: fetchImpl,
    console,
    setTimeout,
    clearTimeout,
    Date,
    Math,
    JSON,
    Promise,
  };
  vm.runInNewContext(javascript, sandbox, { filename: file, timeout: 3000 });
  return mod.exports;
}

function readyState() {
  return Campaign.beginOnboardingState(Campaign.createState(4242), { name: 'Тест', originId: 'river', seedId: 'forge' }).state;
}

/** Три РАЗНЫЕ науки: свои названия, свои здания и свои наборы свойств. */
const PROJECTS = [
  {
    scienceName: 'Горновая тяга',
    scienceDescription: 'Мехи из кожи поднимают жар в горне, и малахит плавится ровнее.',
    buildingName: 'Кузнечный двор у жилы',
    buildingDescription: 'Общий двор с горнами и запасом руды у медной жилы.',
    category: 'economy',
    effects: [{ type: 'income_materials', amount: 1 }],
  },
  {
    scienceName: 'Счёт паводков',
    scienceDescription: 'Наблюдатели ведут счёт воды по зарубкам на камне.',
    buildingName: 'Водомерный камень',
    buildingDescription: 'Камень с зарубками у берега подсказывает время сева.',
    category: 'science',
    effects: [{ type: 'income_knowledge', amount: 1 }],
  },
  {
    scienceName: 'Обряд первого снопа',
    scienceDescription: 'Жрецы отмечают начало жатвы и хранят зерно общины.',
    buildingName: 'Плетнёвое святилище',
    buildingDescription: 'Святилище из плетня у берега, где хранят обрядовый сноп.',
    category: 'religion',
    effects: [{ type: 'income_faith', amount: 1 }],
  },
];

test('три науки придумывает модель под свойства народа, а не локальный каталог', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    return modelReply({ projects: PROJECTS });
  });
  const offers = await api.llmScienceOffers('gpt-6-luna', readyState());

  assert.equal(offers.length, 3);
  // Массив приходит из песочницы vm (другой realm), поэтому сравниваем строкой, а не deepEqual.
  assert.equal(offers.map(offer => offer.scienceName).join(' | '), PROJECTS.map(project => project.scienceName).join(' | '));
  assert.equal(requests.length, 1, 'науки предлагаются одним вызовом: шага «превью направлений» больше нет');
  assert.equal(requests[0].url, '/api/hydra');
  assert.equal(requests[0].body.temperature, 1, 'названия и суть изобретаются свободно');

  const [system, user] = requests[0].body.messages.map(message => message.content);
  assert.ok(user.includes(SEED_LINE), 'замысел народа уходит модели — он сильнее всего влияет на подбор');
  assert.ok(user.includes('География:'), 'география народа доходит до советника');
  assert.ok(user.includes('Наследие:'), 'выбранное наследие доходит до советника');
  assert.ok(system.includes('БЕЗ магии'), 'исторический сеттинг сохранён');
  assert.ok(system.includes('РОВНО 3 РАЗНЫЕ науки'), 'запрашиваются три разные науки за один вызов');
  assert.ok(!system.includes('rationale'), 'объяснение «почему вашему народу» больше не запрашивается');
  for (const old of ['Рыбные запуды', 'Рыбные запруды', 'Каменная мастерская', 'Календарный круг', 'Надёжные запасы']) {
    assert.equal(system.includes(old), false, `в промпте не должно быть заготовки ${old}`);
  }
});

test('три варианта обязаны различаться и наукой, и зданием, и свойствами', async () => {
  const api = loadCards(async () => modelReply({ projects: PROJECTS }));
  const offers = await api.llmScienceOffers('gpt-6-luna', readyState());
  assert.equal(new Set(offers.map(item => item.scienceName)).size, 3);
  assert.equal(new Set(offers.map(item => item.buildingName)).size, 3);
  assert.equal(new Set(offers.map(item => item.effects.map(effect => `${effect.type}:${effect.amount}`).sort().join('|'))).size, 3,
    'наборы свойств различаются: именно они отличают одно здание от другого');

  // Одинаковый набор свойств при разных вывесках — это не три варианта, а один. Раньше
  // советник-строитель вторым вызовом возвращал именно такое: три неотличимых здания.
  const sameEffects = loadCards(async () => modelReply({ projects: PROJECTS.map((project, index) => ({
    ...project, scienceName: `Наука ${index}`, buildingName: `Здание ${index}`, effects: [{ type: 'income_food', amount: 1 }]
  })) }));
  await assert.rejects(() => sameEffects.llmScienceOffers('gpt-6-luna', readyState()), /три разные науки/);
});

test('неполный набор, повторы названий и недоступные эффекты отбраковываются', async () => {
  const tooFew = loadCards(async () => modelReply({ projects: PROJECTS.slice(0, 2) }));
  await assert.rejects(() => tooFew.llmScienceOffers('gpt-6-luna', readyState()), /три разные науки/);

  const duplicates = loadCards(async () => modelReply({ projects: [PROJECTS[0], PROJECTS[0], PROJECTS[1]] }));
  await assert.rejects(() => duplicates.llmScienceOffers('gpt-6-luna', readyState()), /три разные науки/);

  // Воинская доктрина не строится, пока народ не освоил ключевой ресурс эпохи (обсидиан в Каменном
  // веке), поэтому советник не вправе её обещать: здание оказалось бы изученным, но непостроенным.
  const locked = loadCards(async () => modelReply({ projects: [
    PROJECTS[0],
    PROJECTS[1],
    { scienceName: 'Военная доктрина', scienceDescription: 'Вожди ведут отряд в набег.', buildingName: 'Площадка для строя', buildingDescription: 'Утоптанная площадка для боевого порядка.', category: 'military', effects: [{ type: 'unit_power', amount: 1 }] },
  ] }));
  await assert.rejects(() => locked.llmScienceOffers('gpt-6-luna', readyState()), /три разные науки/);

  // Мусор и неизвестные эффекты не подменяются локальным шаблоном.
  const garbage = loadCards(async () => modelReply({ projects: [
    { scienceName: '', scienceDescription: '', buildingName: '', buildingDescription: '' },
    { ...PROJECTS[1], effects: [{ type: 'not_an_effect', amount: 1 }] },
    PROJECTS[2],
  ] }));
  await assert.rejects(() => garbage.llmScienceOffers('gpt-6-luna', readyState()), /три разные науки/);
});

test('воинская доктрина блокируется только до освоения ключевого ресурса эпохи', async () => {
  const prompts = [];
  const ask = async (state) => {
    const api = loadCards(async (url, init) => {
      prompts.push(JSON.parse(init.body));
      return modelReply({ projects: PROJECTS });
    });
    await api.llmScienceOffers('gpt-6-luna', state);
    return prompts[prompts.length - 1].messages[0].content;
  };

  const stoneAge = readyState();
  assert.equal(Campaign.hasEraKeyResource(stoneAge), false, 'в Каменном веке обсидиановая мастерская ещё не построена');
  assert.match(await ask(stoneAge), /Не используй unit_power/, 'заблокированный эффект назван модели явно');

  const laterEra = readyState();
  laterEra.player.era = 3; // Ренессанс: ERA_KEY_RESOURCE не задан — блокировки нет
  assert.equal(Campaign.hasEraKeyResource(laterEra), true);
  const system = await ask(laterEra);
  assert.equal(system.includes('Не используй unit_power'), false, 'без ключевой постройки эпохи доктрина не блокируется');
  assert.ok(system.includes('unit_power'), 'эффект снова предложен модели');
});

test('науки приходят только от модели: неполный ответ не дополняется заготовкой', async () => {
  const api = loadCards(async () => modelReply({
    projects: [{
      scienceName: 'Счёт паводков',
      scienceDescription: 'Наблюдатели ведут счёт воды по меткам на камнях.',
      buildingName: 'Водомерный камень',
      buildingDescription: 'Камень с зарубками у берега подсказывает время сева.',
      category: 'science',
      effects: [{ type: 'income_knowledge', amount: 1 }],
    }, {
      scienceName: 'Щиты из ивы',
      scienceDescription: 'Плетёные щиты держат удар лучше кожаных.',
      buildingName: 'Ивовый стан',
      buildingDescription: 'Мастерская плетёных щитов у зарослей.',
      category: 'military',
      effects: [{ type: 'defense_bonus', amount: 1 }],
    }],
  }));
  await assert.rejects(() => api.llmScienceOffers('glm-5.2', readyState()), /три разные науки/,
    'два проекта — не три: игрок не получает выбор из одинакового');

  const empty = loadCards(async () => modelReply({}));
  await assert.rejects(() => empty.llmScienceOffers('gpt-6-luna', readyState()), /три разные науки/);
});

test('the regional builder returns three unique cell-specific plans whose daily effects come from the model', async () => {
  const requests = [];
  const buildings = [
    { buildingName: 'Затвор Тихой Ивы', buildingDescription: 'Плетни держат рыбу в старице.', category: 'economy', effects: [{ type: 'income_food', amount: 2 }], rationale: 'Речной затон даёт улов.' },
    { buildingName: 'Навес сухой древесины', buildingDescription: 'Тростник укрывает древесину от разлива.', category: 'economy', effects: [{ type: 'income_materials', amount: 1 }, { type: 'income_knowledge', amount: 1 }], rationale: 'Мастера берегут запас для работы.' },
    { buildingName: 'Камень счёта приливов', buildingDescription: 'Зарубки отмечают сезонные подъемы воды.', category: 'science', effects: [{ type: 'income_faith', amount: 1 }, { type: 'income_knowledge', amount: 1 }], rationale: 'Обряды следуют за ритмом реки.' },
  ];
  const api = loadCards(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    return modelReply({ buildings });
  });
  const state = readyState();
  const tile = state.world.tiles.find(candidate => candidate.siteType === 'food');
  assert.ok(tile, 'the generated map has a food region to use as context');
  const offers = await api.llmRegionBuildingOffers('gpt-6-luna', state, tile);

  assert.equal(offers.length, 3);
  assert.equal(new Set(offers.map(item => item.name)).size, 3);
  assert.equal(new Set(offers.map(item => item.effects.map(effect => `${effect.type}:${effect.amount}`).sort().join('|'))).size, 3);
  assert.ok(offers.every(item => item.effects.every(effect => Campaign.REGION_GENERATIVE_EFFECTS.includes(effect.type))));
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/hydra');
  const [system, user] = requests[0].body.messages.map(message => message.content);
  assert.ok(system.includes('ровно 3 РАЗНЫХ'));
  assert.ok(system.includes('Эффекты придумывай сам'));
  assert.ok(system.includes('прямой доход региона'));
  assert.ok(user.includes(tile.name));
  assert.ok(user.includes(tile.terrain));
  assert.ok(user.includes('География:'));
  assert.ok(user.includes('Наследие:'));
  assert.ok(user.includes('Эпоха народа сейчас:'));
  assert.ok(user.includes('стандартное региональное здание и цена-ориентир'));
});

test('the regional builder rejects an incomplete set and non-regional effects', async () => {
  const offers = [
    { buildingName: 'Постройка 1', buildingDescription: 'Описание.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }] },
    { buildingName: 'Постройка 2', buildingDescription: 'Описание.', category: 'economy', effects: [{ type: 'income_materials', amount: 1 }] },
    { buildingName: 'Постройка 3', buildingDescription: 'Описание.', category: 'economy', effects: [{ type: 'unit_power', amount: 1 }] },
  ];
  const state = readyState();
  const tile = state.world.tiles.find(candidate => candidate.siteType === 'food');
  const invalidEffectApi = loadCards(async () => modelReply({ buildings: offers }));
  await assert.rejects(() => invalidEffectApi.llmRegionBuildingOffers('gpt-6-luna', state, tile), /три разных региональных чертежа/);

  const incompleteApi = loadCards(async () => modelReply({ buildings: offers.slice(0, 2) }));
  await assert.rejects(() => incompleteApi.llmRegionBuildingOffers('gpt-6-luna', state, tile), /три разных региональных чертежа/);
});

test('a building in a new land is named by the model for this community', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply({ name: 'Запруда Тихой Ивы', description: 'Плетни у старицы держат рыбу для общины.' });
  });
  const state = readyState();
  const tile = state.world.tiles.find(candidate => candidate.siteType === 'food') || state.world.tiles[0];
  const flavor = await api.llmRegionBuildingName('gpt-6-luna', state, tile, {
    name: 'Ирригация и запруды', description: 'Запруды и канавы',
  });
  assert.equal(flavor.name, 'Запруда Тихой Ивы');
  const [system, user] = requests[0].messages.map(message => message.content);
  assert.ok(user.includes(SEED_LINE), 'the name is tied to the seed line');
  assert.ok(user.includes(tile.name), 'the name is tied to the place');
  assert.ok(system.includes('своё имя'), 'the model is asked for an original name');
});

test('the AI connection is probed through the server proxy, never with a key from the browser', async () => {
  const requests = [];
  const okApi = loadCards(async (url, init) => {
    requests.push({ url, init });
    return fakeResponse({ choices: [{ message: { content: 'готов' } }] });
  });
  await okApi.probeApiKey('gpt-6-luna');
  assert.equal(requests[0].url, '/api/hydra', 'the client only talks to its own server proxy, never to api.hydraai.ru directly');
  assert.equal(requests[0].init.headers.Authorization, undefined, 'no API key is ever attached on the client side');

  const badApi = loadCards(async () => fakeResponse({ error: { message: 'Сервер не настроен: переменная окружения HYDRA_API_KEY не задана на Vercel.' } }, false, 500));
  await assert.rejects(() => badApi.probeApiKey('gpt-6-luna'), /HYDRA_API_KEY/);
});
