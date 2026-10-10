const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

/**
 * «Лапа обезьяны» из самых ранних версий игры возвращается: выкованная карта может прийти с платой.
 * Жребий бросает модель кампании (33% чистая / 33% небольшая плата / 33% жёсткая, независимо от
 * редкости и материала), плату пишет ИИ-кузнец, а движок проверяет, что она выражена НАСТОЯЩЕЙ
 * механикой — текстовый штраф без эффекта или ключевого слова не исполняется в бою.
 */
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
    console, setTimeout, clearTimeout, Date, Math, JSON, Promise,
  };
  vm.runInNewContext(javascript, sandbox, { filename: file, timeout: 5000 });
  return mod.exports;
}

const modelReply = (payload) => ({
  ok: true,
  status: 200,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
});

function stateAt(era, cultureId) {
  const state = Campaign.createState(20261002);
  state.player.onboardingComplete = true;
  state.player.era = era;
  state.player.historicalCulture = Campaign.HISTORICAL_CULTURES.find((c) => c.id === cultureId);
  state.player.culturalLineage = [cultureId];
  return Campaign.normalizeState(state);
}

/** Состояние, в котором ковка вообще возможна: славы хватает на любое сырьё. */
function craftState(era, cultureId, glory = 900) {
  const state = stateAt(era, cultureId);
  state.player.glory = glory;
  return Campaign.normalizeState(state);
}

/** Карта без единого минуса: такие приходят, когда жребий выпал «чистым». */
function cleanCard(extra = {}) {
  return {
    name: 'Стражи брода', card_type: 'unit', era: 'ancient', emoji: '🛡️',
    drop_cost: 2, action_cost: 1, hp: 22, atk: 2,
    description: 'Держат брод копьями, пока обоз переходит реку.',
    tags: ['копьё'], abilities: [], keywords: ['phalanx'], effects: [], monkey_paw: '',
    ...extra,
  };
}

const PAW_TEXT = 'Каждый раз, отряд выходя на поле, вождь платит кузнецу энергией: бросок не бесплатен.';
const HISTORY = { title: 'Долг кузнецу', text: 'Оружие брали в долг у кузнецов брода и расплачивались каждым походом: долг висел на роде, пока отряд не отслужил своё.' };

/** Небольшая плата: −1 энергии вождю при выходе на поле (вес 2). */
const minorPaw = () => cleanCard({
  monkey_paw: PAW_TEXT,
  history: HISTORY,
  effects: [{ event: 'enter_play', target: { side: 'controller', entity: 'player' }, action: { type: 'modify_resource', resource: 'energy', amount: -1 } }],
});

/** Жёсткая плата: сброс двух своих карт (вес 4). */
const harshPaw = () => cleanCard({
  monkey_paw: PAW_TEXT,
  history: HISTORY,
  effects: [{ event: 'enter_play', target: { side: 'controller', entity: 'player' }, action: { type: 'discard', amount: 2, choice: 'highest_cost' } }],
});

const ADVICE = { id: 'unit-0-1', cardType: 'unit', title: 'Стражи брода', pitch: 'Держат брод.' };

/* ---------------- жребий: три равные трети, независимые от редкости ---------------- */

test('жребий лапы обезьяны делит бросок на три равные трети', () => {
  assert.equal(Campaign.rollPawTier(0), 'none');
  assert.equal(Campaign.rollPawTier(0.33), 'none');
  assert.equal(Campaign.rollPawTier(0.34), 'minor');
  assert.equal(Campaign.rollPawTier(0.66), 'minor');
  assert.equal(Campaign.rollPawTier(0.67), 'harsh');
  assert.equal(Campaign.rollPawTier(0.99), 'harsh');
  assert.deepEqual(Campaign.PAW_TIERS, ['none', 'minor', 'harsh']);
  for (const tier of Campaign.PAW_TIERS) {
    assert.ok(Campaign.PAW_TIER_LABELS[tier], 'у каждой трети есть подпись для хроники');
    assert.ok(Campaign.PAW_TIER_NOTES[tier], 'и заметка о плате');
  }
  assert.ok(['none', 'minor', 'harsh'].includes(Campaign.rollPawTier(Math.random())), 'случайный бросок всегда даёт известную треть');
});

test('лапа не зависит от редкости и материала: один и тот же заказ даёт разную плату', () => {
  // Бросок редкости одинаковый (0.99), а бросок лапы — из разных третей.
  const rows = ['none', 'minor', 'harsh'].map((tier, i) => Campaign.beginCraftState(
    craftState(2, 'sumer'), { materialQuality: 'refined' }, 0.99, i / 3 + 0.01,
  ));
  assert.deepEqual(rows.map((r) => r.error), [null, null, null], 'ковка доступна: славы и эпохи хватает');
  assert.deepEqual(rows.map((r) => r.paw), ['none', 'minor', 'harsh'], 'жребий лапы идёт отдельно от жребия редкости');
  assert.equal(new Set(rows.map((r) => r.rarity)).size, 1, 'редкость от лапы не зависит');
  assert.equal(new Set(rows.map((r) => r.cost)).size, 1, 'цена ковки тоже');
  assert.equal(new Set(rows.map((r) => r.modelId)).size, 1, 'и выбор модели');
  assert.equal(rows[2].pawLabel, Campaign.PAW_TIER_LABELS.harsh, 'подпись трети готова для хроники');
});

test('хроника отмечает плату, а чистую карту оставляет без неё', () => {
  const begin = (pawRoll) => Campaign.beginCraftState(craftState(1, 'sumer'), { materialQuality: 'refined' }, 0.5, pawRoll);
  const paid = Campaign.completeCraftState(begin(0.9).state, {
    name: 'Стражи брода', rarity: 'ordinary', monkeyPaw: 'Отряд жжёт свою же ладью: каждый выход стоит вождю энергии.',
  });
  assert.match(paid.state.player.chronicle.at(-1).text, /«Стражи брода» \(ordinary\)\. Лапа обезьяны взяла плату: Отряд жжёт свою же ладью/u);

  const clean = Campaign.completeCraftState(begin(0.1).state, { name: 'Стражи брода', rarity: 'ordinary', monkeyPaw: '' });
  assert.match(clean.state.player.chronicle.at(-1).text, /«Стражи брода» \(ordinary\)\.$/u, 'чистая ковка записывается без платы');
});

/* ---------------- вес платы: настоящие минусы, а не слова ---------------- */

test('вес платы считают по механике: свои потери и вражеская выгода', async (t) => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const sev = (card, paw = 'minor') => api.pawSeverity(card, paw);

  await t.test('эффекты против своей стороны', () => {
    const fx = (effect) => sev({ keywords: [], effects: [effect] });
    assert.equal(fx({ event: 'enter_play', target: { side: 'friendly', entity: 'unit' }, action: { type: 'damage', amount: 2 } }), 2, 'урон своим — по количеству');
    assert.equal(fx({ event: 'enter_play', target: { side: 'friendly', entity: 'unit' }, action: { type: 'apply_status', status: 'poison', amount: 1, turns: 3 } }), 3, 'яд на своих — урон плюс длительность');
    assert.equal(fx({ event: 'death', target: { side: 'friendly', entity: 'unit', count: 1 }, action: { type: 'destroy' } }), 4, 'уничтожение одного своего отряда — самое дорогое');
    assert.equal(fx({ event: 'enter_play', target: { side: 'friendly', entity: 'unit' }, action: { type: 'modify_stat', stat: 'attack', amount: -2 } }), 3, 'постоянное ухудшение своих включает надбавку');
    assert.equal(fx({ event: 'enter_play', target: { side: 'friendly', entity: 'unit' }, action: { type: 'modify_stat', stat: 'attack', amount: -2, turns: 2 } }), 4, 'срок действия умножает силу');
    assert.equal(fx({ event: 'enter_play', target: { side: 'friendly', entity: 'unit' }, action: { type: 'modify_cost', amount: 1 } }), 2, 'удорожание атаки своих');
    assert.equal(fx({ event: 'enter_play', target: { side: 'controller', entity: 'player' }, action: { type: 'modify_resource', resource: 'energy', amount: -2 } }), 4, 'потеря энергии вождя стоит вдвое');
    assert.equal(fx({ event: 'enter_play', target: { side: 'controller', entity: 'player' }, action: { type: 'discard', amount: 2 } }), 4, 'сброс своих карт — по две за карту');
    assert.equal(fx({ event: 'enter_play', target: { side: 'controller', entity: 'player' }, action: { type: 'exchange', amount: 1 } }), 2);
    assert.equal(fx({ event: 'turn_start', target: { side: 'friendly', entity: 'unit', relation: 'self' }, action: { type: 'damage', amount: 1 } }), 3, 'повтор каждый ход стоит втрое');
  });

  await t.test('выгода врага тоже считается платой', () => {
    const fx = (effect) => sev({ keywords: [], effects: [effect] });
    assert.equal(fx({ event: 'enter_play', target: { side: 'enemy', entity: 'unit' }, action: { type: 'heal', amount: 2 } }), 2);
    assert.equal(fx({ event: 'enter_play', target: { side: 'enemy', entity: 'unit' }, action: { type: 'modify_stat', stat: 'attack', amount: 1 } }), 2);
    assert.equal(fx({ event: 'enter_play', target: { side: 'opponent', entity: 'player' }, action: { type: 'modify_resource', resource: 'energy', amount: 2 } }), 4);
    assert.equal(fx({ event: 'enter_play', target: { side: 'opponent', entity: 'player' }, action: { type: 'draw', amount: 1 } }), 2);
  });

  await t.test('боевые плюсы и обычный словарь весом не считаются', () => {
    assert.equal(sev({ keywords: ['ranged', 'skirmish', 'shieldwall', 'taunt', 'charge'], effects: [{ event: 'attack', target: { side: 'enemy', entity: 'unit' }, action: { type: 'damage', amount: 3 } }] }, 'none'), 0);
    assert.equal(sev({ keywords: ['morale'], effects: [] }, 'none'), 0, 'мораль на обычной карте — часть словаря, а не штраф');
    assert.equal(sev({ keywords: ['morale'], effects: [] }, 'minor'), 2, '…но в заказанную плату она идёт');
    assert.equal(sev({ keywords: ['upkeep'], effects: [] }, 'none'), 2, 'содержание — обременение всегда');
    assert.equal(sev({ keywords: ['upkeep', 'morale'], effects: [] }, 'harsh'), 4);
  });

  await t.test('маркеры возвращают человекочитаемый текст', () => {
    const markers = api.pawMarkers(harshPaw(), 'minor');
    assert.equal(markers.length, 1);
    assert.match(markers[0].text, /сброс|обмен/iu);
    assert.equal(markers[0].weight, 4);
  });
});

/* ---------------- validateCard исполняет жребий ---------------- */

test('чистый заказ не принимает ни эффектов против своих, ни текста платы', () => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const eras = ['ancient', 'bronze'];

  assert.throws(
    () => api.validateCard(minorPaw(), 'unit', eras, 'ordinary', 'none'),
    /чистая карта, но кузнец добавил плату/iu,
  );
  assert.throws(
    () => api.validateCard(cleanCard({ monkey_paw: PAW_TEXT }), 'unit', eras, 'ordinary', 'none'),
    /не должно быть текста платы/iu,
  );
  assert.throws(
    () => api.validateCard(cleanCard({ keywords: ['upkeep'] }), 'unit', eras, 'ordinary', 'none'),
    /добавил плату/iu,
  );

  const card = api.validateCard(cleanCard({ keywords: ['shieldwall', 'taunt', 'morale'] }), 'unit', eras, 'ordinary', 'none');
  assert.equal(card.monkey_paw, '', 'обычная карта с моралью остаётся чистой: жребий её не трогает');
});

test('небольшая плата держится в пределах веса 1…3', () => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const eras = ['ancient', 'bronze'];

  const card = api.validateCard(minorPaw(), 'unit', eras, 'ordinary', 'minor');
  assert.equal(card.monkey_paw, PAW_TEXT.slice(0, 200));
  assert.equal(api.pawSeverity(card, 'minor'), 2);

  assert.throws(
    () => api.validateCard(harshPaw(), 'unit', eras, 'ordinary', 'minor'),
    /Небольшая плата — это вес 1…3, а кузнец дал 4/iu,
  );
});

test('жёсткая плата требует вес от 4: карта сильная, но рискованная', () => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const eras = ['ancient', 'bronze'];

  const card = api.validateCard(harshPaw(), 'unit', eras, 'rare', 'harsh');
  assert.equal(api.pawSeverity(card, 'harsh'), 4);

  assert.throws(
    () => api.validateCard(minorPaw(), 'unit', eras, 'rare', 'harsh'),
    /Жёсткая плата — это вес 4…8/iu,
  );
});

test('плата обязана быть механикой и объяснена текстом карты', () => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const eras = ['ancient', 'bronze'];

  assert.throws(
    () => api.validateCard(cleanCard({ monkey_paw: PAW_TEXT }), 'unit', eras, 'ordinary', 'harsh'),
    /требует настоящую плату/iu,
    'текст без эффекта движок не исполнит — такая карта отклоняется',
  );
  assert.throws(
    () => api.validateCard(harshPaw(), 'unit', eras, 'ordinary', 'harsh').monkey_paw && api.validateCard({ ...harshPaw(), monkey_paw: 'Дорого.' }, 'unit', eras, 'ordinary', 'harsh'),
    /слишком короткий/iu,
  );
  assert.throws(
    () => api.validateCard({ ...harshPaw(), monkey_paw: '' }, 'unit', eras, 'ordinary', 'harsh'),
    /слишком короткий|настоящую плату/iu,
  );
  assert.throws(
    () => api.validateCard({ ...harshPaw(), history: undefined }, 'unit', eras, 'ordinary', 'harsh'),
    /обязана объяснять/iu,
    'без исторической вставки плата не обоснована',
  );
  assert.throws(
    () => api.validateCard({ ...harshPaw(), history: { title: 'Долг', text: 'Коротко.' } }, 'unit', eras, 'ordinary', 'harsh'),
    /обязана объяснять/iu,
  );
});

test('все попытки строго проверяют категорию платы: неправильная плата не получает множитель', async () => {
  const api = loadCards(async () => modelReply(minorPaw()));
  const eras = ['ancient', 'bronze'];

  assert.throws(() => api.validateCard(minorPaw(), 'unit', eras, 'rare', 'harsh'), /Жёсткая плата — это вес 4…8/iu);
  assert.throws(() => api.validateCard(cleanCard({ monkey_paw: PAW_TEXT }), 'unit', eras, 'rare', 'harsh'), /требует настоящую плату/iu);
  assert.throws(() => api.validateCard(minorPaw(), 'unit', eras, 'rare', 'none'), /чистая карта, но кузнец добавил плату/iu);

  const requests = [];
  const smith = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply(minorPaw());
  });
  const error = await smith.llmCard('gpt-6-luna', ADVICE, 'rare', stateAt(1, 'sumer'), 'harsh').then(() => null, (e) => e);
  assert.ok(error, 'три неверные по весу платы отклоняются вместо выдачи неверного множителя');
  assert.equal(requests.length, 3, 'две переделки, затем строгий отказ');
  assert.match(error.message, /Жёсткая плата — это вес 4…8/iu);
  assert.equal(error.pawRejected, true);
  assert.ok(requests.every((request) => /4…8/u.test(request.messages[1].content)), 'каждая попытка видит одну и ту же строгую полосу');
  assert.doesNotMatch(requests[2].messages.at(-1).content, /послаблен|любую силу/iu, 'последняя попытка не размывает правило');
});

test('бюджет складывается из независимых множителей редкости и платы', () => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const eras = ['ancient', 'bronze'];
  const strong = { name: 'Тяжёлый кулак', card_type: 'unit', era: 'ancient', emoji: '🪓', drop_cost: 2, action_cost: 2, hp: 6, atk: 5, description: 'Бьёт тяжко.', tags: [], abilities: [], keywords: ['phalanx'], effects: [], monkey_paw: '' };

  const base = api.cardPowerBaseBudget(2, 2, 'unit');
  assert.equal(base, 7, 'база учитывает вывод и цену атаки');
  assert.equal(api.cardPowerBudget(2, 2, 'unit', 'ordinary'), base);
  assert.equal(api.cardPowerBudget(2, 2, 'unit', 'uncommon'), base * 2);
  assert.equal(api.cardPowerBudget(2, 2, 'unit', 'rare'), base * 4);
  assert.equal(api.cardPowerBudget(2, 2, 'unit', 'ordinary', 'minor'), base * 2);
  assert.equal(api.cardPowerBudget(2, 2, 'unit', 'ordinary', 'harsh'), base * 3);
  assert.equal(api.cardPowerBudget(2, 2, 'unit', 'rare', 'harsh'), base * 12, 'редкая с жёсткой платой получает ×12');
  assert.equal(api.cardPowerBudget(1, 1, 'unit', 'ordinary') < base, true, 'дешевле вывести и атаковать — меньше допустимой силы');
  assert.equal(JSON.stringify(api.PAW_BUDGET_MULT), JSON.stringify({ none: 1, minor: 2, harsh: 3 }));

  const clean = api.validateCard(strong, 'unit', eras, 'ordinary', 'none');
  assert.equal(api.cardPower(clean), base, 'избыточные характеристики урезаются до базового бюджета');
  const paid = api.validateCard({ ...strong, monkey_paw: PAW_TEXT, history: HISTORY, effects: harshPaw().effects }, 'unit', eras, 'ordinary', 'harsh');
  const payout = api.pawSeverity(paid);
  assert.equal(payout, 4, 'жёсткая плата «сброс двух карт» весит 4');
  assert.ok(api.cardPower(paid) <= api.cardPowerBudget(2, 2, 'unit', 'ordinary', 'harsh'));
  assert.ok(api.cardPower(paid) >= api.cardPower(clean), 'штрафная карта остаётся не слабее чистой обычной карты той же цены');
  assert.ok(api.cardPower(paid) > api.cardPower(clean), 'множитель платы расширяет доступную силу');
});

/* ---------------- кузнец: жребий уходит в промпт, брак стоит одной переделки ---------------- */

test('общая сила учитывает слова, эффекты, энергию, длительность и геометрию триггера', () => {
  const api = loadCards(async () => modelReply(cleanCard()));
  const base = { card_type: 'unit', atk: 1, hp: 1, keywords: [], effects: [] };
  assert.equal(api.cardPower(base), 2);
  assert.equal(api.cardPower({ ...base, keywords: ['command'] }), 5, 'повторяющееся снабжение стоит три пункта');
  assert.equal(api.cardPower({ ...base, keywords: ['suppress:3'] }), 6, 'числовое слово N расходует бюджет');
  assert.equal(api.cardPower({ ...base, keywords: ['armor:3'] }), 5, 'броня N весит N');
  assert.equal(api.cardPower({ ...base, effects: [{ event: 'turn_start', target: { side: 'enemy', entity: 'unit' }, action: { type: 'damage', amount: 1 } }] }), 5,
    'повторяемый ходовой эффект стоит в три раза дороже');
  assert.equal(api.cardPower({ ...base, effects: [{ event: 'enter_play', target: { side: 'controller', entity: 'player' }, action: { type: 'modify_resource', resource: 'energy', amount: 1 } }] }), 4,
    'полезная энергия тоже расходует бюджет');
  assert.equal(api.cardPower({ ...base, effects: [{ event: 'enter_play', target: { side: 'friendly', entity: 'unit' }, action: { type: 'damage', amount: 3 } }] }), 2,
    'штраф лапы не выдаётся за полезную силу');

  const hard = { event: 'enter_play', target: { side: 'friendly', entity: 'unit', count: 3 }, action: { type: 'damage', amount: 3 } };
  assert.equal(api.pawSeverity({ keywords: [], effects: [hard] }), 9, 'сила штрафа умножается на число целей');
  assert.throws(() => api.validateCard({ ...cleanCard(), monkey_paw: PAW_TEXT, history: HISTORY, effects: [hard] }, 'unit', ['ancient'], 'ordinary', 'harsh'),
    /Жёсткая плата — это вес 4…8/u, 'чрезмерная плата выше жёсткого потолка отклоняется');
});

test('промпт кузнеца объявляет жребий и таблицу весов, а для чистой карты запрещает плату', async () => {
  const prompts = [];
  const queue = [cleanCard(), minorPaw(), harshPaw()];
  const api = loadCards(async (url, init) => {
    prompts.push(JSON.parse(init.body).messages[1].content);
    return modelReply(queue[prompts.length - 1]);
  });

  await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));
  assert.match(prompts[0], /ЛАПА ОБЕЗЬЯНЫ — НА ЭТОТ РАЗ ЧИСТО/iu);
  assert.match(prompts[0], /monkey_paw = ""/);
  assert.doesNotMatch(prompts[0], /Вес платы движок считает/iu, 'чистой карте таблица весов не нужна');

  await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'), 'minor');
  assert.match(prompts[1], /НЕБОЛЬШАЯ ПЛАТА: суммарный вес от 1 до 3/iu);
  assert.match(prompts[1], /Вес платы движок считает/iu);
  assert.match(prompts[1], /description показывает, чем отряд расплачивается/iu, 'описание обязано обосновывать плату');
  assert.match(prompts[1], /history\.text — откуда эта цена взялась/iu, '…и историческая вставка тоже');

  await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'), 'harsh');
  assert.match(prompts[2], /ЖЁСТКАЯ ПЛАТА: суммарный вес от 4 до 8/iu);
  assert.match(prompts[2], /карта сильная, но рискованная/iu);
  assert.notEqual(prompts[1], prompts[2], 'трети различаются в промпте');
  assert.match(prompts[1], /Готовые примеры небольшой платы/iu, 'у каждой трети свои рабочие примеры');
  assert.match(prompts[2], /Готовые примеры жёсткой платы/iu);
  assert.match(prompts[1], /сложи веса своих минусов и попади в полосу 1…3/iu);
  assert.match(prompts[2], /сложи веса своих минусов и попади в полосу 4…8/iu);
  assert.match(prompts[2], /Полезная сила оштрафованной карты должна быть не меньше/u, 'промпт требует оставить полезную часть не слабее чистой карты');
});

test('брак модели перековывается дважды, а третий брак отменяет ковку', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply(requests.length < 3 ? minorPaw() : harshPaw());
  });

  const card = await api.llmCard('gpt-6-luna', ADVICE, 'rare', stateAt(1, 'sumer'), 'harsh');
  assert.equal(requests.length, 3, 'мелкая плата не прошла проверку жёсткой трети — кузнец перековал дважды');
  assert.match(requests[1].messages.at(-1).content, /Предыдущий ответ не прошёл проверку игры: Жёсткая плата/iu);
  assert.match(requests[2].messages.at(-1).content, /пересчитай суммарный вес платы и попади в строгую полосу 4…8/iu, 'в переделку уходит точная инструкция');
  assert.equal(card.monkey_paw, PAW_TEXT.slice(0, 200));
  assert.equal(card.rarity, 'rare');
  assert.equal(card.history.era, Campaign.ERAS[1], 'справку по-прежнему подписывает эпоха кампании');

  const stubborn = [];
  const strict = loadCards(async (url, init) => {
    stubborn.push(JSON.parse(init.body));
    return modelReply(cleanCard());
  });
  const error = await strict.llmCard('gpt-6-luna', ADVICE, 'rare', stateAt(1, 'sumer'), 'harsh').then(() => null, (e) => e);
  assert.ok(error, 'без настоящей платы карты нет даже на третьей попытке: Forge вернёт славу через M.failCraft');
  assert.match(error.message, /требует настоящую плату/iu);
  assert.equal(error.pawRejected, true, 'ошибка помечена — UI покажет нейтральный текст вместо жребия');
  assert.equal(api.craftErrorMessage(error), api.CRAFT_REJECTED_TEXT);
  assert.doesNotMatch(api.craftErrorMessage(error), /плата|вес|Лапа/iu, 'игрок не узнаёт, какая треть выпала');
  assert.equal(api.craftErrorMessage(new Error('HTTP 500')), 'HTTP 500', 'прочие ошибки проходят как есть');
  assert.equal(stubborn.length, 3, 'переделок ровно две — ковка не зависает на бесконечных попытках');
});

test('чистая карта куётся за один запрос, а жребий лапы экспортирован игрой', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply(cleanCard());
  });
  const card = await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'), 'none');
  assert.equal(requests.length, 1);
  assert.equal(card.monkey_paw, '');
  assert.equal(card.name, 'Стражи брода');

  for (const name of ['pawMarkers', 'pawSeverity', 'validateCard', 'llmCard']) assert.equal(typeof api[name], 'function', `cards.ts отдаёт ${name}`);
  assert.equal(api.PAW_MINOR_MAX, 3);
  assert.equal(api.PAW_HARSH_MAX, 8);
  assert.equal(JSON.stringify(api.PAW_LABELS), JSON.stringify({ none: 'Чистая карта', minor: 'Небольшая плата', harsh: 'Жёсткая плата' }));
});

/* ---------------- карта показывает плату игроку ---------------- */

test('🐾 видна на готовой карте: блок на лице и метка на плитке, но не в смете ковки', () => {
  const view = fs.readFileSync(path.join(root, 'src', 'components', 'CardView.tsx'), 'utf8');
  assert.match(view, /card\.monkey_paw &&/, 'лицо карты показывает плату');
  assert.match(view, /🐾 Лапа обезьяны/);
  assert.match(view, /🐾 плата/, 'плитка коллекции помечает карту с платой');
  const face = view.slice(view.indexOf('export function CardFace'), view.indexOf('export function CardTile'));
  assert.ok(face.indexOf('monkey_paw') > face.indexOf('card.description'), 'плата идёт после описания карты');
  assert.ok(face.indexOf('monkey_paw') < face.indexOf('HistoryNote'), 'и до исторической вставки');

  const forge = fs.readFileSync(path.join(root, 'src', 'pages', 'Forge.tsx'), 'utf8');
  assert.match(forge, /llmCard\(begin\.modelId, selected, begin\.rarity as Rarity, snapshot, begin\.paw\)/, 'жребий уходит кузнецу');
  assert.match(forge, /monkeyPaw: card\.monkey_paw/, 'и записывается в хронику');
  assert.match(forge, /craftErrorMessage\(e\)/, 'текст браковки жребия не уходит игроку');
  assert.doesNotMatch(forge.slice(forge.indexOf('} catch (e: any) {')), /failCraft\(s, begin\.cost, e\?\.message/, 'в хронику и тост идёт нейтральная причина');
  assert.match(forge, /Лапа обезьяны сработала/, 'раскрытие сообщает о плате');
  assert.match(forge, /карта пришла чистой/iu);
  const quote = forge.slice(forge.indexOf('Смета ковки'), forge.indexOf('Ковать карту за'));
  assert.match(quote, /часть карт приходит с платой/, 'жребий лапы коротко объяснён заранее');
  assert.doesNotMatch(quote, /begin\.paw|quote\.paw|pawLabel/, 'но результат конкретной ковки до раскрытия не показывается');
});
