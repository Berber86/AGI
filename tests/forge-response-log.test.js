/**
 * Журнал ответов ИИ: при неудаче дословный ответ модели по каждой неудачной попытке попадает в
 * error.journal, а кузница выводит его игроку панелью на экране (не в консоль разработчика).
 * Тост и текст ошибок прежние: игрок видит короткую причину, слава возвращается, ретраи не менялись.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

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

/** Консоль-заглушка: журнал не должен в неё писать — он уходит в панель на экране. */
function recorder() {
  const calls = [];
  const sink = {};
  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
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

const craftFailure = (api, state, paw = 'none', rarity = 'ordinary') => api.llmCard('gpt-6-luna', ADVICE, rarity, state, paw)
  .then(() => null, (e) => e);

test('ответ без JSON: журнал несёт дословный текст, игрок видит прежнюю причину, консоль молчит', async () => {
  const rec = recorder();
  const api = loadCards(async () => modelReply(PROSE), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Модель не вернула JSON.', 'текст ошибки для игрока прежний');
  assert.equal(api.craftErrorMessage(error), 'Модель не вернула JSON.', 'в тост уходит та же причина');
  assert.match(error.journal, /^Карта · попытка 1 из 3 · этап: разбор · исход: провал/u);
  assert.match(error.journal, /Причина: Модель не вернула JSON\./u);
  assert.match(error.journal, /finish_reason: stop/u);
  assert.match(error.journal, /usage: \{"prompt_tokens":1200,"completion_tokens":480\}/u);
  assert.ok(error.journal.includes(PROSE), 'ответ приведён дословно, включая текст вокруг скобок');
  assert.deepEqual(rec.calls, [], 'журнал не пишет в консоль разработчика');
});

test('битый JSON: сообщение парсера прежнее, журнал показывает ответ целиком с ошибкой внутри', async () => {
  const broken = '```json\n{"name":"Стражи брода","card_type":"unit",}\n```';
  const rec = recorder();
  const api = loadCards(async () => modelReply(broken), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.match(error.message, /JSON/u, 'сообщение парсера доходит до тоста, как и раньше');
  assert.match(error.journal, /этап: разбор/u);
  assert.ok(error.journal.includes(broken), 'обёртка ```json и лишняя запятая видны без правок');
  assert.deepEqual(rec.calls, []);
});

test('переделки: журнал собирает все неудачные попытки подряд, в порядке их появления', async () => {
  const contents = [
    JSON.stringify(cleanCard({ name: '' })),
    JSON.stringify(cleanCard({ name: '   ' })),
    JSON.stringify(cleanCard({ name: 'Стражи брода', description: '' })),
  ];
  let requests = 0;
  const rec = recorder();
  const api = loadCards(async () => modelReply(contents[requests++]), rec.console);
  const error = await craftFailure(api, stateAt(1, 'sumer'));

  assert.equal(requests, 3, 'три попытки, как и раньше');
  assert.match(error.message, /короткое название|описание/u, 'текст ошибки последней проверки прежний');
  const journal = error.journal;
  const first = journal.indexOf('Карта · попытка 1 из 3 · этап: проверка · исход: переделка');
  const second = journal.indexOf('Карта · попытка 2 из 3 · этап: проверка · исход: переделка');
  const third = journal.indexOf('Карта · попытка 3 из 3 · этап: проверка · исход: провал');
  assert.ok(first >= 0 && second > first && third > second, 'три отчёта в правильном порядке и с правильными исходами');
  for (const content of contents) assert.ok(journal.includes(content), 'каждый ответ дословно');
  assert.match(journal, /тип unit · редкость ordinary · лапа none/u, 'в журнале видны параметры заказа');
  assert.deepEqual(rec.calls, []);
});

test('все попытки лапы провалились: игроку по-прежнему нейтральный текст, журнал полный', async () => {
  const content = JSON.stringify(cleanCard());
  const rec = recorder();
  const api = loadCards(async () => modelReply(content), rec.console);
  const error = await craftFailure(api, stateAt(1, 'sumer'), 'harsh', 'rare');

  assert.match(error.message, /требует настоящую плату/u, 'причина в ошибке та же, что и раньше');
  assert.equal(error.pawRejected, true, 'признак отказа лапы сохранён');
  assert.equal(api.craftErrorMessage(error), api.CRAFT_REJECTED_TEXT, 'в тост по-прежнему нейтральный текст');
  assert.doesNotMatch(api.craftErrorMessage(error), /[{}"]/u, 'в тост не утекает ни JSON, ни журнал');
  assert.equal(error.journal.split('\n\n').length, 3, 'все три попытки в журнале');
  assert.match(error.journal, /попытка 3 из 3 · этап: проверка · исход: провал/u);
  assert.ok(error.journal.includes(content), 'ответ дословно');
  assert.deepEqual(rec.calls, []);
});

test('ошибка прокси: журнал показывает тело ответа, текст ошибки прежний', async () => {
  const body = { error: { message: 'Сервер не настроен: HYDRA_API_KEY не задана для окружения «preview».' } };
  const rec = recorder();
  const api = loadCards(async () => ({ ok: false, status: 500, json: async () => body }), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, body.error.message);
  assert.match(error.journal, /этап: запрос/u);
  assert.match(error.journal, /HTTP 500/u);
  assert.ok(error.journal.includes('--- тело ответа дословно ---'));
  assert.ok(error.journal.includes(JSON.stringify(body, null, 2)), 'тело ответа целиком, без пересказа');
  assert.deepEqual(rec.calls, []);
});

test('сбой внутри успешного конверта: журнал показывает весь конверт, включая id запроса', async () => {
  const envelope = { id: 'req-42', error: { message: 'Лимит запросов исчерпан, попробуйте позже.' } };
  const rec = recorder();
  const api = loadCards(async () => ({ ok: true, status: 200, json: async () => envelope }), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Лимит запросов исчерпан, попробуйте позже.');
  assert.match(error.journal, /этап: запрос/u);
  assert.ok(error.journal.includes(JSON.stringify(envelope, null, 2)));
  assert.deepEqual(rec.calls, []);
});

test('ответ, обрезанный по max_tokens, помечен в журнале', async () => {
  const cut = '{"name":"Стражи брода","card_type":"unit","description":"Держат брод';
  const rec = recorder();
  const api = loadCards(async () => modelReply(cut, { finish: 'length' }), rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Модель не вернула JSON.');
  assert.match(error.journal, /finish_reason: length/u);
  assert.match(error.journal, /обрезан по max_tokens/u, 'причину обрыва видно сразу, без догадок');
  assert.ok(error.journal.includes(cut));
  assert.deepEqual(rec.calls, []);
});

test('сеть недоступна: журнал честно говорит, что дословного ответа не было', async () => {
  const rec = recorder();
  const api = loadCards(async () => { throw new TypeError('Failed to fetch'); }, rec.console);
  const error = await craftFailure(api, stateAt(0));

  assert.equal(error.message, 'Failed to fetch', 'сетевая ошибка проходит как есть');
  assert.match(error.journal, /этап: запрос/u);
  assert.match(error.journal, /Дословного ответа нет/u);
  assert.deepEqual(rec.calls, []);
});

test('сбой запроса после неудачной проверки: журнал сохраняет предыдущие попытки', async () => {
  const first = JSON.stringify(cleanCard({ name: '' }));
  let requests = 0;
  const rec = recorder();
  const api = loadCards(async () => {
    requests += 1;
    if (requests === 1) return modelReply(first);
    return { ok: false, status: 502, json: async () => ({ error: { message: 'Шлюз недоступен.' } }) };
  }, rec.console);
  const error = await craftFailure(api, stateAt(1, 'sumer'));

  assert.equal(error.message, 'Шлюз недоступен.');
  assert.ok(error.journal.includes(first), 'отказ первой попытки на месте');
  assert.match(error.journal, /попытка 2 из 3 · этап: запрос · исход: провал/u);
  assert.deepEqual(rec.calls, []);
});

test('успешная ковка не требует журнала и ничего не пишет в консоль', async () => {
  const rec = recorder();
  const api = loadCards(async () => modelReply(JSON.stringify(cleanCard())), rec.console);
  const card = await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));
  assert.equal(card.name, 'Стражи брода');
  assert.equal(card.journal, undefined);
  assert.deepEqual(rec.calls, []);
});

test('советник: журнал несёт неудачный разбор и обе неудачные проверки', async () => {
  const rec = recorder();
  const silent = loadCards(async () => modelReply('Извините, советов сегодня нет.'), rec.console);
  const parseError = await silent.llmAdvice('gpt-6-luna', stateAt(0)).then(() => null, (e) => e);
  assert.equal(parseError.message, 'Модель не вернула JSON.');
  assert.match(parseError.journal, /^Замыслы · попытка 1 из 2 · этап: разбор · исход: провал/u);
  assert.ok(parseError.journal.includes('Извините, советов сегодня нет.'));

  const pair = [
    { card_type: 'unit', title: 'Стражи переправы', pitch: 'Копейщики держат авангард.' },
    { card_type: 'spell', title: 'Каменный заслон', pitch: 'Манёвр замедляет один отряд.' },
  ];
  const wrong = JSON.stringify({ choices: [pair[0], pair[0]] });
  const checked = recorder();
  const checking = loadCards(async () => modelReply(wrong), checked.console);
  const checkError = await checking.llmAdvice('gpt-6-luna', stateAt(0)).then(() => null, (e) => e);
  assert.match(checkError.journal, /попытка 1 из 2 · этап: проверка · исход: переделка/u);
  assert.match(checkError.journal, /попытка 2 из 2 · этап: проверка · исход: провал/u);
  assert.equal(checkError.journal.split('\n\n').length, 2);
  assert.ok(checkError.journal.includes(wrong), 'неудачный ответ советника дословно');
  assert.deepEqual(checked.calls, []);
  assert.deepEqual(rec.calls, []);
});

test('кузница выводит журнал на экран, а не в консоль: источники без console и с панелью', () => {
  const cards = read('src/game/cards.ts');
  const forge = read('src/pages/Forge.tsx');
  const store = read('src/game/store.tsx');

  assert.doesNotMatch(cards, /console\./u, 'в cards.ts нет вывода в консоль');
  assert.doesNotMatch(forge, /console\./u, 'в Forge.tsx нет вывода в консоль');

  assert.match(store, /const \[aiLog, setAiLog\] = useState\(""\)/u, 'журнал хранится в сторе и переживает переходы');
  assert.match(store, /aiLog, setAiLog,/u, 'стор отдаёт журнал экрану');

  assert.match(forge, /if \(e\?\.journal\) setAiLog\(e\.journal\);/u, 'неудача ковки кладёт журнал на экран');
  assert.match(forge, /setAiLog\(""\); \/\/ новая ковка/u, 'новая ковка очищает прошлый журнал');
  assert.match(forge, /\{aiLog && \(/u, 'панель рисуется, пока журнал не пуст');
  assert.match(forge, /<pre [^>]*>\{aiLog\}<\/pre>/u, 'текст выводится дословно, как текст (не как HTML)');
  assert.match(forge, /Копировать/u);
  assert.match(forge, /onClick=\{\(\) => setAiLog\(""\)\}>Скрыть/u, 'панель закрывается по кнопке, а не по таймеру');
  assert.doesNotMatch(forge + store, /setTimeout\([^;]*setAiLog/u, 'панель не гаснет сама');
});
