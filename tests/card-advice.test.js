const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
// Журнал кузницы пишет провалы в warn/error. Провалы этих тестов нарочные, поэтому консоль
// для них приглушена: вывод npm test остаётся читаемым. Сам журнал проверяет forge-response-log.test.js.
const quietConsole = { ...console, warn() {}, error() {} };

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
            ERA_HISTORICAL: Campaign.ERA_HISTORICAL,
            HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES,
            SEED_CHOICES: Campaign.SEED_CHOICES,
            MILITIA_CORE_CARDS: Campaign.MILITIA_CORE_CARDS,
            eraName: Campaign.eraName,
            allowedCardEras: Campaign.allowedCardEras,
            combatPerks: Campaign.combatPerks,
            describePerks: Campaign.describePerks,
          },
        };
      }
      throw new Error(`Unexpected import ${name}`);
    },
    fetch: fetchImpl,
    console: quietConsole,
    Date,
    Math,
    JSON,
    Promise,
  };
  vm.runInNewContext(javascript, sandbox, { filename: file, timeout: 5000 });
  return mod.exports;
}

function modelReply(payload) {
  return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }) };
}

function readyState(era = 0) {
  const state = Campaign.foundCampaignState(Campaign.createState(), {
    seedId: 'forge', historicalCultureId: 'natufian',
  }).state;
  state.player.era = era;
  return Campaign.normalizeState(state);
}

const STONE_CHOICES = [
  { card_type: 'unit', title: 'Стражи переправы', pitch: 'Копейщики удерживают авангард врага в ближнем бою.' },
  { card_type: 'spell', title: 'Каменный заслон', pitch: 'Манёвр замедляет один вражеский отряд на короткое время.' },
];
const BATTLE_CHOICES = [
  { card_type: 'unit', title: 'Стражи переправы', pitch: 'Копейщики удерживают авангард врага, пока лучники бьют из тыла.' },
  { card_type: 'spell', title: 'Засада в камышах', pitch: 'Ловушка ненадолго ослабляет вражеский авангард.' },
  { card_type: 'structure', title: 'Частокол с бойницами', pitch: 'Каждый ход частокол обстреливает первого врага в строю.' },
];

test('советник Каменного века предлагает только рукопашный отряд и умеренный манёвр', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    return modelReply({ choices: STONE_CHOICES });
  });
  const state = readyState();
  const advice = await api.llmAdvice('gpt-6-luna', state);

  assert.deepEqual(advice.map((item) => item.cardType), ['unit', 'spell']);
  assert.ok(advice.every((item) => item.title && item.pitch));
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/hydra');
  assert.equal(requests[0].body.response_format.type, 'json_object');
  const [system, user] = requests[0].body.messages.map((message) => message.content);
  assert.match(system, /военный советник Infinite Forge/iu);
  assert.match(system, /одного текущего боя/iu);
  assert.match(system, /общий запас энергии/iu);
  assert.match(system, /по одной каждого разрешённого типа/iu);
  assert.match(system, /unit — правдоподобный отряд/iu);
  assert.match(system, /spell — немедленный, умеренный манёвр/iu);
  assert.match(system, /structure — только для стола с тылом/iu);
  assert.match(system, /каждый ход обстреливает/iu);
  assert.match(system, /atk от 0 до 4/u, 'промпт объясняет, какая постройка стреляет');
  assert.match(system, /не стреляет/u, 'и что стена без атаки не стреляет');
  assert.match(system, /броня его гасит/u, 'обстрел считается как обычный удар');
  assert.match(system, /не повторяй одну культуру/iu);
  assert.match(system, /Никакой магии, фэнтези и анахронизмов/iu);
  assert.match(user, /Нужны 2 боевые идеи для колоды/iu);
  assert.match(user, /Допустимые|Разрешённые эпохи карт/iu);
  assert.match(user, /ОДНА ЛИНИЯ|Стол Каменного века/iu);
  assert.match(user, /Контекст цивилизации/iu);
  assert.ok(user.includes(state.player.seedLine), 'менталитет народа остаётся в контексте, но необязателен как тема карты');
  assert.equal(advice.some((item) => item.cardType === 'structure'), false, 'постройка исключена с однорядного стола');
});

test('советник не пропускает дубли карточных типов или пустые замыслы', async () => {
  const duplicates = loadCards(async () => modelReply({ choices: [
    BATTLE_CHOICES[0],
    { ...BATTLE_CHOICES[1], card_type: 'unit' },
    BATTLE_CHOICES[2],
  ] }));
  await assert.rejects(() => duplicates.llmAdvice('gpt-6-luna', readyState(1)), /по одному замыслу каждого доступного типа/iu);

  const emptyPitch = loadCards(async () => modelReply({ choices: [
    BATTLE_CHOICES[0],
    { ...BATTLE_CHOICES[1], pitch: '   ' },
    BATTLE_CHOICES[2],
  ] }));
  await assert.rejects(() => emptyPitch.llmAdvice('gpt-6-luna', readyState(1)), /название и описание тактической роли/iu);
});

test('кузнец превращает исторический замысел в эффект текущего боя, а не в долгосрочное хозяйство', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply({
      name: 'Копейщики у брода', card_type: 'unit', era: 'ancient', emoji: '🛡️',
      drop_cost: 2, action_cost: 1, hp: 4, atk: 2,
      description: 'Держат переправу и не дают противнику прорваться.',
      tags: [], abilities: [], keywords: ['phalanx'], effects: [], monkey_paw: '',
    });
  });

  await api.llmCard('gpt-6-luna', {
    id: 'unit-0', cardType: 'unit', title: 'Камнерез дельты',
    pitch: 'Острые обсидиановые наконечники помогают копейщикам пробить вражеский строй.',
  }, 'ordinary', readyState());

  const [system, user] = requests[0].messages.map((message) => message.content);
  assert.match(system, /ЭПОХЕ КАМПАНИИ/iu);
  assert.match(system, /Манёвр: цена минимум 1/iu);
  assert.match(system, /общий вес эффектов/iu);
  assert.match(user, /Боевой замысел:/iu);
  assert.match(user, /Создай простую, исторически правдоподобную карту/iu);
  assert.match(user, /культурное наследие можно упоминать только если это уместно/iu);
  assert.ok(system.length < 6000, `системный промпт компактнее 6000 символов (${system.length})`);
});

test('экран кузницы держит замыслы в своём кэше и сбрасывает их со сменой эпохи', () => {
  const forge = fs.readFileSync(path.join(root, 'src', 'pages', 'Forge.tsx'), 'utf8');
  assert.match(forge, /const ADV_KEY = "iforge_advice_combat";/);
  assert.doesNotMatch(forge, /iforge_advice_v3|iforge_advice_v2/, 'старые кэши замыслов больше не читаются');
  // кэш привязан к эпохе: чужая эпоха или обрезанный список не подхватываются
  assert.match(forge, /function readAdvice\(era: number, count: number\)/);
  assert.match(forge, /raw\.era === era && Array\.isArray\(raw\.advice\) && raw\.advice\.length === count/);
  assert.match(forge, /localStorage\.setItem\(ADV_KEY, JSON\.stringify\(\{ era: p\.era, advice \}\)\)/);
  assert.match(forge, /cachedAdviceCount !== expectedAdviceCount/);
});
