const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const SEED_LINE = 'Мы кузнецы: ищем камень, медь и огонь для горна';

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
  return Campaign.beginOnboardingState(Campaign.createState(4242), { name: 'Тест', originId: 'river', seedLine: SEED_LINE }).state;
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
  const result = await api.llmOpeningProject('test-key', 'gpt-6-luna', readyState());

  assert.equal(result.scienceName, 'Горновая тяга');
  assert.deepEqual(result.effects, [{ type: 'income_materials', amount: 1 }]);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, 'https://api.hydraai.ru/v1/chat/completions');
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
  await assert.rejects(() => api.llmOpeningProject('test-key', 'gpt-6-luna', readyState()));
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
  const offers = await api.llmScienceOffers('test-key', 'glm-5.2', readyState());
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
  const flavor = await api.llmRegionBuildingName('test-key', 'gpt-6-luna', state, tile, {
    name: 'Ирригация и запруды', description: 'Запруды и канавы',
  });
  assert.equal(flavor.name, 'Запруда Тихой Ивы');
  const [system, user] = requests[0].messages.map(message => message.content);
  assert.ok(user.includes(SEED_LINE), 'the name is tied to the seed line');
  assert.ok(user.includes(tile.name), 'the name is tied to the place');
  assert.ok(system.includes('своё имя'), 'the model is asked for an original name');
});

test('the API key is verified against the provider before the game starts', async () => {
  const okApi = loadCards(async () => fakeResponse({ choices: [{ message: { content: 'готов' } }] }));
  await okApi.probeApiKey('good-key', 'gpt-6-luna');

  const badApi = loadCards(async () => fakeResponse({ error: { message: 'Invalid API key' } }, false, 401));
  await assert.rejects(() => badApi.probeApiKey('bad-key', 'gpt-6-luna'), /Invalid API key/);

  const emptyApi = loadCards(async () => fakeResponse({}));
  await assert.rejects(() => emptyApi.probeApiKey('  ', 'gpt-6-luna'), /Введите API-ключ/);
});
