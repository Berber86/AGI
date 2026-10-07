const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

/**
 * Историческая справка карты: кузнец пишет её в тот же вызов, что и саму карту, и привязывает
 * к ЭПОХЕ КАМПАНИИ и НАСЛЕДИЮ НАРОДА. Раньше карты «древнего мира» и «античности» отличались
 * только боевым тегом ancient/bronze: в описании, свойствах и значении разницы почти не было.
 * Локального фолбэка сознательно нет — заготовочный текст снова сделал бы все эпохи одинаковыми.
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
            ORIGINS: Campaign.ORIGINS,
            SEED_CHOICES: Campaign.SEED_CHOICES,
            STARTER_CARDS: Campaign.STARTER_CARDS,
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
    console,
    setTimeout,
    clearTimeout,
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

function stateAt(era, cultureId) {
  const state = Campaign.createState(20261002);
  state.player.onboardingComplete = true;
  state.player.era = era;
  state.player.historicalCulture = Campaign.HISTORICAL_CULTURES.find(culture => culture.id === cultureId);
  state.player.culturalLineage = [cultureId];
  return Campaign.normalizeState(state);
}

function unitCard(extra = {}) {
  return {
    name: 'Стражи брода', card_type: 'unit', era: 'ancient', emoji: '🛡️',
    drop_cost: 2, action_cost: 1, hp: 4, atk: 2,
    description: 'Держат брод копьями, пока обоз переходит реку.',
    tags: ['копьё'], abilities: [], keywords: ['phalanx'], effects: [], monkey_paw: '',
    ...extra,
  };
}

const ADVICE = { id: 'unit-0-1', cardType: 'unit', title: 'Стражи брода', pitch: 'Держат брод.' };

test('справка пишется под эпоху кампании и наследие народа, а не под боевой тег ancient/bronze', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply(unitCard({
      history: { title: 'Гоплиты Саламина', text: 'Бронзовые щиты греческой фаланги: строй держится плечом к плечу.' },
    }));
  });

  const card = await api.llmCard('gpt-6-luna', ADVICE, 'uncommon', stateAt(1, 'sumer'));
  assert.ok(card.history, 'справка сохраняется вместе с картой');
  assert.equal(card.history.title, 'Гоплиты Саламина');
  assert.equal(card.history.era, Campaign.ERAS[1], 'справку подписывает эпоха кампании');
  assert.equal(card.history.culture, 'Шумер', '…и наследие народа');

  assert.equal(requests.length, 1);
  const [system, user] = requests[0].messages.map(message => message.content);
  assert.match(system, /"history"/, 'поле справки описано в схеме ответа');
  assert.match(system, /историческ/iu);
  assert.match(system, /ЭПОХИ КАМПАНИИ|эпох[а-я]* кампании/iu, 'модели объясняют, что справка — про эпоху кампании');
  assert.match(system, /НАСЛЕДИЯ НАРОДА/);
  assert.match(system, /БЕЗ магии|без магии/i, 'сеттинг остаётся историческим');
  assert.match(user, /Историческая справка/);
  assert.match(user, new RegExp(Campaign.ERAS[1]), 'в подсказку уходит название эпохи');
  assert.match(user, /Шумер/, '…и название наследия');
  assert.match(user, /Технологии эпохи:/);
});

test('одна и та же карта в разных эпохах получает разную справку: модель видит эпоху и культуру', async () => {
  const requests = [];
  const api = loadCards(async (url, init) => {
    requests.push(JSON.parse(init.body));
    return modelReply(unitCard({ history: { title: 'Прототип', text: 'Описание прототипа.' } }));
  });

  await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(0, 'yamnaya'));
  const stone = requests[0].messages[1].content;
  await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));
  const antiquity = requests[1].messages[1].content;

  assert.match(stone, /Каменный век/);
  assert.match(stone, /Ямная культура/);
  assert.match(antiquity, /Античный мир/);
  assert.match(antiquity, /Шумер/);
  assert.notEqual(stone, antiquity, 'промпт кузнеца обязан отличаться от эпохи и наследия');
  assert.notEqual(stone.match(/Технологии эпохи: (.+)/)?.[1], antiquity.match(/Технологии эпохи: (.+)/)?.[1]);
});

test('без ответа модели справки у карты нет: локальных заготовок не существует', async () => {
  const api = loadCards(async () => modelReply(unitCard()))
  const card = await api.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));
  assert.equal(card.history, undefined, 'заготовочного текста нет — иначе эпохи снова станут одинаковыми');
  assert.equal(card.name, 'Стражи брода', 'сама карта при этом валидна');
});

test('справку чистит валидатор: битые и пустые блоки отбрасываются, длина ограничена', () => {
  const api = loadCards(async () => modelReply(unitCard()))

  // Объект из vm-контекста: сравниваем поля, а не ссылку на прототип.
  const clean = api.sanitizeHistory({ title: 'Курган', text: 'Медные копья в курганах.' }, 'Каменный век', 'Ямная культура');
  assert.equal(clean.title, 'Курган');
  assert.equal(clean.text, 'Медные копья в курганах.');
  assert.equal(clean.era, 'Каменный век', 'эпоху и наследие дописывает вызывающий код');
  assert.equal(clean.culture, 'Ямная культура');
  for (const bad of [null, undefined, 'строка', [], 42, {}, { title: '   ', text: 'Текст' }, { title: 'Заголовок', text: '  ' }]) {
    assert.equal(api.sanitizeHistory(bad), undefined, `блок ${JSON.stringify(bad)} не должен проходить`);
  }
  const long = api.sanitizeHistory({ title: 'К'.repeat(200), text: 'Т'.repeat(2000) });
  assert.ok(long.title.length <= 90 && long.text.length <= 700, 'справка не расползается в размерах');

  const withHistory = api.validateCard(unitCard({ history: { title: 'Курган', text: 'Медные копья.' } }), 'unit', ['ancient'], 'rare');
  assert.equal(withHistory.history.title, 'Курган');
  const withoutHistory = api.validateCard(unitCard({ history: { title: '', text: '' } }), 'unit', ['ancient'], 'rare');
  assert.equal(withoutHistory.history, undefined);
});

test('карты ополчения и стартовой колоды живут без справки — она только от кузнеца', () => {
  const api = loadCards(async () => modelReply(unitCard()));
  for (const card of [...api.buildMilitia(), ...Campaign.STARTER_CARDS]) {
    assert.equal(card.history, undefined, `${card.name}: справку пишет модель, а не список`);
  }
});

test('экран показывает справку аккордеоном и раскрывает её у только что выкованной карты', () => {
  const cardView = fs.readFileSync(path.join(root, 'src', 'components', 'CardView.tsx'), 'utf8');
  assert.match(cardView, /from "@\/components\/ui"/);
  assert.match(cardView, /Accordion/);
  assert.match(cardView, /HistoryNote/);
  assert.match(cardView, /card\.history && <HistoryNote/, 'аккордеон рисуется только когда справка есть');
  assert.match(cardView, /historyOpen/, 'у новой карты справка раскрыта сразу');
  assert.match(cardView, /Эпоха:|Наследие:/, 'справка подписана эпохой и наследием');

  const ui = fs.readFileSync(path.join(root, 'src', 'components', 'ui.tsx'), 'utf8');
  assert.match(ui, /export function Accordion/);
  assert.match(ui, /aria-expanded/);

  const forge = fs.readFileSync(path.join(root, 'src', 'pages', 'Forge.tsx'), 'utf8');
  assert.match(forge, /historyOpen/, 'окно «Новая карта» показывает справку раскрытой');
  assert.match(forge, /reveal\.history/, 'под картой видно, к какой эпохе и наследию справка');
  assert.match(forge, /Историческая основа/, 'смета ковки называет эпоху и наследие заранее');

  // Армия — основное место, где игрок читает карту: аккордеон доступен и там.
  const army = fs.readFileSync(path.join(root, 'src', 'pages', 'Army.tsx'), 'utf8');
  assert.match(army, /CardFace/);
});

test('справка переживает сохранение коллекции — она лежит в самой карте', () => {
  const source = fs.readFileSync(path.join(root, 'src', 'game', 'store.tsx'), 'utf8');
  assert.match(source, /iforge_collection/);
  assert.match(source, /JSON\.stringify\(collection\)/, 'коллекция пишется в localStorage целиком, вместе с history');
  const cards = fs.readFileSync(path.join(root, 'src', 'game', 'cards.ts'), 'utf8');
  assert.match(cards, /history\?: CardHistory/, 'поле описано в типе карты');
});
