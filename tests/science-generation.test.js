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
            SCIENCE_DIRECTION_THEMES: Campaign.SCIENCE_DIRECTION_THEMES,
            sanitizeScienceDirection: Campaign.sanitizeScienceDirection,
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

test('the first science is generated from the player seed, not from a local catalogue', async () => {
  const requests = [];
  const project = {
    scienceName: 'Горновая тяга',
    scienceDescription: 'Мехи из кожи поднимают жар в горне и плавят малахит ровнее.',
    buildingName: 'Кузнечный двор у жилы',
    buildingDescription: 'Общий двор с горнами и запасом руды у медной жилы.',
    category: 'economy',
    effects: [{ type: 'income_materials', amount: 1 }],
    rationale: 'Народ живёт кузнечным делом, значит первая наука — про горн.',
  };
  const api = loadCards(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    return modelReply(project);
  });
  const result = await api.llmOpeningProject('gpt-6-luna', readyState());

  assert.equal(result.scienceName, 'Горновая тяга');
  assert.deepEqual(result.effects, [{ type: 'income_materials', amount: 1 }]);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/hydra');
  const [system, user] = requests[0].body.messages.map(message => message.content);
  assert.ok(user.includes(SEED_LINE), 'the seed line is sent to the model');
  assert.ok(user.includes('Затравка игрока'), 'the prompt names the seed explicitly');
  assert.ok(system.includes('БЕЗ магии'), 'the historical setting is kept');
  for (const old of ['Рыбные запуды', 'Рыбные запруды', 'Каменная мастерская', 'Календарный круг', 'Надёжные запасы']) {
    assert.equal(system.includes(old), false, `the prompt must not offer the pre-written variant ${old}`);
  }
});

test('an invalid first project is rejected instead of being replaced by a local template', async () => {
  const api = loadCards(async () => modelReply({
    scienceName: 'Странная наука',
    scienceDescription: 'Описание.',
    buildingName: 'Странная постройка',
    buildingDescription: 'Описание.',
    category: 'economy',
    effects: [{ type: 'not_an_effect', amount: 1 }],
  }));
  await assert.rejects(() => api.llmOpeningProject('gpt-6-luna', readyState()));
});

test('later offers also come only from the model', async () => {
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
  const offers = await api.llmScienceOffers('glm-5.2', readyState());
  assert.equal(offers.length, 2);
  assert.deepEqual(offers.map(offer => offer.scienceName), ['Счёт паводков', 'Щиты из ивы']);
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

const DIRECTION_FIXTURE = [
  {
    title: 'Запруды у Тихой Ивы',
    summary: 'Плетни и канавы держат воду на разливе, чтобы сеять раньше.',
    theme: 'agriculture', category: 'economy',
    effects: [{ type: 'income_food', amount: 1 }], icon: '🌾',
    rationale: 'Народ живёт на разливе: еда — первое узкое место.'
  },
  {
    title: 'Обряд первого снопа',
    summary: 'Жрецы ведут счёт сезонов и хранят зерно общины.',
    theme: 'religion', category: 'religion',
    effects: [{ type: 'income_faith', amount: 1 }], icon: '🙏',
    rationale: 'Духовность кормит просветление эпохи.'
  },
  {
    title: 'Плетёные щиты',
    summary: 'Ивовые щиты на кожаной основе держат удар лучше досок.',
    theme: 'military', category: 'military',
    effects: [{ type: 'unit_power', amount: 1 }], icon: '⚔️',
    rationale: 'Соседи приходят за зерном.'
  }
];

test('direction previews are invented by the model and steered by the people’s chosen properties', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    return modelReply({ directions: DIRECTION_FIXTURE });
  });
  const previews = await api.llmDirectionPreviews('gpt-6-luna', readyState());

  assert.equal(previews.length, 3);
  assert.deepEqual(previews.map(item => item.theme), ['agriculture', 'religion', 'military']);
  assert.ok(previews.every(item => item.id.startsWith('direction-')), 'устойчивые id для ключей списка');
  assert.equal(requests[0].url, '/api/hydra', 'превью идут через серверный прокси, без ключа в браузере');
  assert.equal(requests[0].body.temperature, 1, 'направления придумываются свободно');

  const [system, user] = requests[0].body.messages.map(message => message.content);
  assert.ok(user.includes(SEED_LINE), 'замысел народа уходит модели — он сильнее всего влияет на подбор');
  assert.ok(user.includes('Народ: Тест'), 'имя народа названо');
  assert.ok(system.includes('agriculture — Земледелие'), 'модель получает словарь тем');
  assert.ok(system.includes('religion — Вера и обряд'), 'религия — равноправная тема');
  assert.ok(system.includes('military — Война и защита'), 'военная тема разрешена');
  assert.ok(system.includes('превью трёх'), 'запрашиваются именно превью, а не готовые науки');
  assert.ok(system.includes('БЕЗ магии'), 'исторический сеттинг сохранён');
  for (const old of ['Рыбные запуды', 'Рыбные запруды', 'Каменная мастерская', 'Календарный круг', 'Надёжные запасы']) {
    assert.equal(system.includes(old), false, `в превью не должно быть заготовки ${old}`);
  }
});

test('garbage previews are dropped instead of being replaced by a local catalogue', async () => {
  const partial = loadCards(async () => modelReply({
    directions: [{ title: '', summary: '' }, { title: 'Обряд разлива', summary: 'Жрецы отмечают разлив.', theme: 'religion' }, null]
  }));
  const previews = await partial.llmDirectionPreviews('gpt-6-luna', readyState());
  assert.equal(previews.length, 1, 'пустое превью и null отброшены, а не подменены шаблоном');
  assert.equal(previews[0].title, 'Обряд разлива');
  assert.equal(previews[0].theme, 'religion');
  assert.deepEqual(previews[0].effects, [{ type: 'income_faith', amount: 1 }], 'эффект подтянут из темы');

  const empty = loadCards(async () => modelReply({ directions: [] }));
  await assert.rejects(() => empty.llmDirectionPreviews('gpt-6-luna', readyState()), /ни одного направления/);
});

test('the second call expands the chosen direction into the first deed and into three offers', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply({
      scienceName: 'Счёт паводков',
      scienceDescription: 'Наблюдатели ведут счёт воды по зарубкам на камне.',
      buildingName: 'Водомерный камень',
      buildingDescription: 'Камень с зарубками у берега подсказывает время сева.',
      category: 'religion',
      effects: [{ type: 'income_faith', amount: 1 }],
      projects: [{
        scienceName: 'Обряд разлива',
        scienceDescription: 'Жрецы отмечают разлив и хранят зерно общины.',
        buildingName: 'Плетнёвое святилище',
        buildingDescription: 'Святилище из плетня у берега.',
        category: 'religion',
        effects: [{ type: 'income_faith', amount: 1 }]
      }]
    });
  });

  // Направление выбирает игрок: то же состояние, что после chooseScienceDirection в игре.
  const stored = Campaign.setScienceDirections(readyState(), DIRECTION_FIXTURE);
  const picked = Campaign.chooseScienceDirection(stored.state, 1);
  assert.equal(picked.direction.theme, 'religion');

  const opening = await api.llmOpeningProject('gpt-6-luna', picked.state, picked.direction);
  assert.equal(opening.scienceName, 'Счёт паводков');
  const [openingSystem, openingUser] = requests[0].messages.map(message => message.content);
  assert.ok(openingUser.includes('Обряд первого снопа'), 'название направления доходит до модели');
  assert.ok(openingUser.includes('духовности'), 'обещанный эффект направления назван в промпте');
  assert.ok(openingUser.includes('Жрецы ведут счёт сезонов'), 'суть направления передана дословно');
  assert.ok(openingSystem.includes('раскрывать выбранное направление'), 'модель обязана остаться внутри направления');

  const offers = await api.llmScienceOffers('gpt-6-luna', picked.state, picked.direction);
  assert.equal(offers.length, 1);
  const [offersSystem, offersUser] = requests[1].messages.map(message => message.content);
  assert.ok(offersSystem.includes('ВНУТРИ него'), 'три замысла — внутри выбранного направления');
  assert.ok(offersUser.includes('Обряд первого снопа'));

  // Без направления советник по-прежнему решает сам — старый путь не сломан.
  const free = await api.llmScienceOffers('gpt-6-luna', readyState());
  assert.ok(free.length >= 1);
  const [freeSystem] = requests[2].messages.map(message => message.content);
  assert.ok(freeSystem.includes('Направление игрок не выбирал'), 'без направления модель выбирает темы сама');
  assert.equal(freeSystem.includes('Обряд первого снопа'), false);
});
