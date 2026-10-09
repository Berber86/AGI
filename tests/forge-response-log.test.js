/**
 * Журнал ответов кузницы: при неудаче весь ответ модели уходит в консоль разработчика дословно,
 * до извлечения {…} и до проверки правил, чтобы по нему настраивать разбор и авто-замену.
 * Игрок по-прежнему видит прежнюю короткую причину, текст ошибок не меняется, а успешная
 * ковка ничего в консоль не пишет.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

function loadCards(fetchImpl, consoleImpl) {
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
    console: consoleImpl,
    Date,
    Math,
    JSON,
    Promise,
  };
  vm.runInNewContext(javascript, sandbox, { filename: file, timeout: 5000 });
  return mod.exports;
}

/** Консоль-заглушка: журнал пишет в неё, тест читает записи по уровню. */
function recorder() {
  const calls = [];
  const sink = {};
  for (const level of ['log', 'info', 'warn', 'error']) {
    sink[level] = (...args) => calls.push({ level, text: args.map(String).join(' ') });
  }
  return { calls, console: sink };
}

/** Успешный конверт Hydra с сырым текстом модели; finish — finish_reason выбранного варианта. */
function modelReply(content, { finish = 'stop' } = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      id: 'req-1',
      model: 'gpt-6-luna',
      choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: finish }],
      usage: { prompt_tokens: 1200, completion_tokens: 480 },
    }),
  };
}

function stateAt(era, cultureId = 'yamnaya') {
  const state = Campaign.createState(20261006);
  state.player.onboardingComplete = true;
  state.player.era = era;
  state.player.historicalCulture = Campaign.HISTORICAL_CULTURES.find((c) => c.id === cultureId);
  state.player.culturalLineage = [cultureId];
  return Campaign.normalizeState(state);
}

function cleanCard(extra = {}) {
  return {
    name: 'Стражи брода', card_type: 'unit', era: 'ancient', emoji: '🛡️',
    drop_cost: 2, action_cost: 1, hp: 22, atk: 2,
    description: 'Держат брод копьями, пока обоз переходит реку.',
    tags: ['копьё'], abilities: [], keywords: ['phalanx'], effects: [], monkey_paw: '',
    ...extra,
  };
}

const ADVICE = { id: 'unit-0-1', cardType: 'unit', title: 'Стражи брода', pitch: 'Держат брод.' };
const PROSE = 'Конечно, вот карта. Кузнец советует: «копьё» — лучше всего.\nПусть отряд держит брод.';

const craftFailure = (api, state, paw = 'none') => api.llmCard('gpt-6-luna', ADVICE, 'ordinary', state, paw)
  .then(() => null, (e) => e);

test('ответ без JSON: дословный текст уходит в журнал, игрок видит прежнюю причину', async () => {
  const rec = recorder();
  const api = loadCards(async () => modelReply(PROSE), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Модель не вернула JSON.', 'текст ошибки для игрока прежний');
  assert.equal(rec.calls.length, 1, 'одна неудача — одна запись');
  assert.equal(rec.calls[0].level, 'error', 'провал ковки — ошибка, а не предупреждение');
  const log = rec.calls[0].text;
  assert.match(log, /^\[ковка\] карта · попытка 1 из 3 · этап: разбор · исход: провал/u);
  assert.match(log, /Причина: Модель не вернула JSON\./u);
  assert.match(log, /finish_reason: stop/u);
  assert.match(log, /usage: \{"prompt_tokens":1200,"completion_tokens":480\}/u);
  assert.ok(log.includes(PROSE), 'ответ приведён дословно, включая текст вокруг скобок');
});

test('битый JSON: сообщение парсера прежнее, журнал показывает ответ целиком с ошибкой внутри', async () => {
  const broken = '```json\n{"name":"Стражи брода","card_type":"unit",}\n```';
  const rec = recorder();
  const api = loadCards(async () => modelReply(broken), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.match(error.message, /JSON/u, 'сообщение парсера доходит до тоста, как и раньше');
  assert.equal(rec.calls.length, 1);
  assert.match(rec.calls[0].text, /этап: разбор/u);
  assert.ok(rec.calls[0].text.includes(broken), 'обёртка ```json и лишняя запятая видны в журнале без правок');
});

test('неудачная проверка правил переделывается, и каждая неудачная попытка пишется дословно', async () => {
  const contents = [
    JSON.stringify(cleanCard({ name: '' })),
    JSON.stringify(cleanCard({ name: '   ' })),
    JSON.stringify(cleanCard()),
  ];
  let requests = 0;
  const rec = recorder();
  const api = loadCards(async () => modelReply(contents[requests++]), rec.console);
  const card = await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));

  assert.equal(card.name, 'Стражи брода');
  assert.equal(requests, 3, 'две переделки, третья попытка проходит');
  assert.deepEqual(rec.calls.map((c) => c.level), ['warn', 'warn'], 'переделки — предупреждения, удачная попытка молчит');
  assert.match(rec.calls[0].text, /попытка 1 из 3 · этап: проверка · исход: переделка/u);
  assert.match(rec.calls[0].text, /У карты должно быть короткое название/u);
  assert.ok(rec.calls[0].text.includes(contents[0]), 'первый ответ дословно');
  assert.match(rec.calls[1].text, /попытка 2 из 3 · этап: проверка · исход: переделка/u);
  assert.ok(rec.calls[1].text.includes(contents[1]), 'второй ответ дословно');
  assert.match(rec.calls[1].text, /тип unit · редкость ordinary · лапа none/u, 'в журнале видно параметры заказа');
});

test('все попытки провалились: журнал заканчивается провалом, игрок получает нейтральный текст', async () => {
  const content = JSON.stringify(cleanCard());
  const rec = recorder();
  const api = loadCards(async () => modelReply(content), rec.console);
  const error = await craftFailure(api, stateAt(1, 'sumer'), 'harsh');

  assert.match(error.message, /требует настоящую плату/u, 'причина в ошибке та же, что и раньше');
  assert.equal(error.pawRejected, true);
  assert.equal(api.craftErrorMessage(error), api.CRAFT_REJECTED_TEXT, 'игроку по-прежнему нейтральный текст');
  assert.deepEqual(rec.calls.map((c) => c.level), ['warn', 'warn', 'error']);
  assert.match(rec.calls[2].text, /попытка 3 из 3 · этап: проверка · исход: провал/u);
  assert.ok(rec.calls.every((c) => c.text.includes(content)), 'каждая попытка дословно, и последняя тоже');
  assert.doesNotMatch(api.craftErrorMessage(error), /[{}"]/u, 'в тост не утекает ни JSON, ни журнал');
});

test('ошибка прокси: журнал показывает тело ответа, текст ошибки прежний', async () => {
  const body = { error: { message: 'Сервер не настроен: HYDRA_API_KEY не задана для окружения «preview».' } };
  const rec = recorder();
  const api = loadCards(async () => ({ ok: false, status: 500, json: async () => body }), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, body.error.message);
  assert.equal(rec.calls.length, 1);
  assert.equal(rec.calls[0].level, 'error');
  assert.match(rec.calls[0].text, /этап: запрос/u);
  assert.match(rec.calls[0].text, /HTTP 500/u);
  assert.ok(rec.calls[0].text.includes('--- тело ответа дословно ---'));
  assert.ok(rec.calls[0].text.includes(JSON.stringify(body, null, 2)), 'тело ответа целиком, без пересказа');
});

test('сбой внутри успешного конверта: журнал показывает весь конверт, включая id запроса', async () => {
  const envelope = { id: 'req-42', error: { message: 'Лимит запросов исчерпан, попробуйте позже.' } };
  const rec = recorder();
  const api = loadCards(async () => ({ ok: true, status: 200, json: async () => envelope }), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Лимит запросов исчерпан, попробуйте позже.');
  assert.match(rec.calls[0].text, /этап: запрос/u);
  assert.ok(rec.calls[0].text.includes(JSON.stringify(envelope, null, 2)));
});

test('ответ, обрезанный по max_tokens, помечен в журнале', async () => {
  const cut = '{"name":"Стражи брода","card_type":"unit","description":"Держат брод';
  const rec = recorder();
  const api = loadCards(async () => modelReply(cut, { finish: 'length' }), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Модель не вернула JSON.');
  assert.match(rec.calls[0].text, /finish_reason: length/u);
  assert.match(rec.calls[0].text, /обрезан по max_tokens/u, 'причину обрыва видно сразу, без догадок');
  assert.ok(rec.calls[0].text.includes(cut));
});

test('сеть недоступна: запись есть, и в ней честно сказано, что дословного ответа не было', async () => {
  const rec = recorder();
  const api = loadCards(async () => { throw new TypeError('Failed to fetch'); }, rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Failed to fetch', 'сетевая ошибка проходит как есть');
  assert.equal(rec.calls.length, 1);
  assert.match(rec.calls[0].text, /этап: запрос/u);
  assert.match(rec.calls[0].text, /Дословного ответа нет/u);
});

test('успешная ковка ничего не пишет в консоль: журнал только про сбои', async () => {
  const rec = recorder();
  const api = loadCards(async () => modelReply(JSON.stringify(cleanCard())), rec.console);
  await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));
  assert.deepEqual(rec.calls, []);
});

test('советник: неудачный разбор и переделка проверки тоже попадают в журнал', async () => {
  const pair = [
    { card_type: 'unit', title: 'Стражи переправы', pitch: 'Копейщики держат авангард.' },
    { card_type: 'spell', title: 'Каменный заслон', pitch: 'Манёвр замедляет один отряд.' },
  ];

  const prose = 'Извините, советов сегодня нет.';
  const rec = recorder();
  const silent = loadCards(async () => modelReply(prose), rec.console);
  const error = await silent.llmAdvice('gpt-6-luna', stateAt(0)).then(() => null, (e) => e);
  assert.equal(error.message, 'Модель не вернула JSON.');
  assert.equal(rec.calls.length, 1);
  assert.match(rec.calls[0].text, /^\[ковка\] замыслы · попытка 1 из 2 · этап: разбор · исход: провал/u);
  assert.ok(rec.calls[0].text.includes(prose));

  const wrong = JSON.stringify({ choices: [pair[0], pair[0]] });
  const right = JSON.stringify({ choices: pair });
  const retry = recorder();
  let requests = 0;
  const retrying = loadCards(async () => modelReply(requests++ === 0 ? wrong : right), retry.console);
  const advice = await retrying.llmAdvice('gpt-6-luna', stateAt(0));
  assert.deepEqual(advice.map((a) => a.cardType), ['unit', 'spell']);
  assert.equal(retry.calls.length, 1, 'удачная вторая попытка молчит');
  assert.match(retry.calls[0].text, /попытка 1 из 2 · этап: проверка · исход: переделка/u);
  assert.ok(retry.calls[0].text.includes(wrong), 'неудачный ответ советника дословно');
});
