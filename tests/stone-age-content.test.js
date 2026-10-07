/**
 * Содержание Каменного века: рукопашная вместо стрелков, исторические типы войск вместо выдуманных
 * мест и числа, при которых обмен ударами вообще случается.
 *
 * Стол Каменного века — одна линия в три клетки: тыла нет, поэтому ranged, skirmish и reach на нём
 * молчат. Раньше стартовый состав и каменные колоды племён были на треть стрелками — карты врали
 * собственным текстом и работали как слабые рукопашные. Теперь дальний бой приходит с Античного
 * мира, когда у стола появляется второй ряд.
 *
 * Здоровье соответствует хрупкому бою эпохи (1–3 HP): обоюдная гибель — нормальный размен,
 * а не ошибка баланса. ИИ учитывает ответ и не бросает отряд в заведомо убыточную атаку.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

function transpile(relativePath) {
  const file = path.join(root, relativePath);
  return ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
}

function runInVm(relativePath, javascript, sandboxExtra) {
  const mod = { exports: {} };
  const sandbox = {
    module: mod, exports: mod.exports, console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number, Promise,
    ...sandboxExtra,
  };
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 5000 });
  return mod.exports;
}

const C = runInVm('src/game/cards.ts', transpile('src/game/cards.ts'), {
  fetch: async () => ({ ok: true, status: 200, json: async () => ({ choices: [] }) }),
  require(name) {
    if (name === './model') {
      return {
        M: {
          ERA_HISTORICAL: Campaign.ERA_HISTORICAL, HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES, SEED_CHOICES: Campaign.SEED_CHOICES, STARTER_CARDS: Campaign.STARTER_CARDS,
          eraName: Campaign.eraName, allowedCardEras: Campaign.allowedCardEras,
          combatPerks: Campaign.combatPerks, describePerks: Campaign.describePerks,
        },
      };
    }
    throw new Error('Неожиданный импорт ' + name);
  },
});

const DEPTH_WORDS = ['ranged', 'skirmish', 'reach'];
const depthWordsOf = (card) => (card.keywords || []).filter((k) => DEPTH_WORDS.includes(String(k).split(':')[0]));
const TRIBES = ['reed', 'steppe', 'north'];
/** Предел энергии стороны на этапе: COMBAT_BASE.energyMax + эпоха угрозы (см. getOpponentBattleConfig). */
const energyCapAt = (stage) => Campaign.COMBAT_BASE.energyMax + stage;
const ERA_BY_STAGE = ['ancient', 'bronze', 'bronze'];

test('стартовый состав игрока — рукопашный Каменный век', () => {
  const starter = Campaign.STARTER_CARDS;
  assert.equal(starter.length, 8, 'восемь карт стартового состава');
  for (const card of starter) {
    assert.deepEqual(depthWordsOf(card), [], `«${card.name}»: на одной линии слова глубины молчат, их не должно быть`);
    assert.notEqual(card.card_type, 'structure', `«${card.name}»: на единственной линии постройка не держит столбец и только съедает место бойца`);
    assert.equal(card.era, 'ancient', `«${card.name}»: Каменный век, а не бронза`);
    assert.ok(!/бронз/u.test(card.name + card.description), `«${card.name}»: бронзы в Каменном веке нет`);
  }
  const units = starter.filter((c) => c.card_type === 'unit');
  assert.equal(units.length, 7, 'семь отрядов и один манёвр');
  for (const unit of units) {
    assert.ok(unit.hp >= 1 && unit.hp <= 3, `«${unit.name}»: в Каменном веке нормальный диапазон — 1–3 HP`);
    assert.ok(unit.atk <= 3, `«${unit.name}»: базовая атака должна оставаться читаемой и умеренной`);
  }
});

test('колода первого боя играбельна при пределе энергии Каменного века', () => {
  const byId = new Map(Campaign.STARTER_CARDS.map((c) => [c.id, c]));
  const deck = Campaign.STARTER_DECK_IDS.map((id) => byId.get(id));
  assert.equal(deck.length, Campaign.STARTER_DECK_IDS.length, 'каждая карта колоды есть в стартовом составе');
  assert.equal(deck.length, Campaign.COMBAT_BASE.deckLimit, 'колода первого боя равна лимиту вождя без бонусов');
  for (const card of deck) {
    assert.ok(card.drop_cost <= energyCapAt(0), `«${card.name}» за ${card.drop_cost} не сыграть при пределе ${energyCapAt(0)}`);
    assert.deepEqual(depthWordsOf(card), [], `«${card.name}»: в колоде первого боя стрелков нет`);
  }
  assert.ok(deck.some((c) => c.drop_cost === 1), 'на первом ходу энергия всего 1 — нужна карта, которую можно сыграть сразу');
});

test('колоды племён: каменный век рукопашный, стрельба приходит со второго ряда', () => {
  assert.deepEqual(Campaign.BARBARIAN_DECK_SIZES, [4, 6, 8], 'размер колоды племени растёт вместе со столом');
  for (const tribe of TRIBES) {
    const decks = Campaign.BARBARIAN_DECK_PROFILES[tribe].decks;
    assert.equal(decks.length, 3, `${tribe}: три этапа — каменный век, Античный мир, Средневековье`);
    decks.forEach((deck, stage) => {
      assert.equal(deck.length, Campaign.BARBARIAN_DECK_SIZES[stage], `${tribe}, этап ${stage}: размер колоды`);
      for (const card of deck) {
        assert.equal(card.era, ERA_BY_STAGE[stage], `${tribe} «${card.name}»: тег эпохи совпадает с этапом`);
        assert.ok(card.drop_cost <= energyCapAt(stage), `${tribe} «${card.name}» за ${card.drop_cost} не сыграть при пределе ${energyCapAt(stage)}`);
        assert.ok(card.description.length > 20, `${tribe} «${card.name}»: описание объясняет роль отряда`);
        if (stage === 0) {
          assert.deepEqual(depthWordsOf(card), [], `${tribe} «${card.name}»: на одной линии слова глубины молчат`);
          assert.notEqual(card.card_type, 'structure', `${tribe} «${card.name}»: в Каменном веке построек нет`);
          assert.ok(!/бронз/u.test(card.name + card.description), `${tribe} «${card.name}»: бронзы в Каменном веке нет`);
          if (card.card_type === 'unit') assert.ok(card.hp >= 1 && card.hp <= 3, `${tribe} «${card.name}»: Каменный век — 1–3 HP, получено ${card.hp}`);
        }
      }
      const units = deck.filter((c) => c.card_type === 'unit');
      assert.ok(units.length >= deck.length - 2, `${tribe}, этап ${stage}: колода из отрядов, а не из одних манёвров`);
      assert.ok(deck.some((c) => c.drop_cost <= 1), `${tribe}, этап ${stage}: нужен отряд, который выходит на первом ходу`);
    });
  }
});

test('имена отрядов — исторические типы войск, а не выдуманные места', () => {
  const invented = /бронзового брода|заводей|перевала|курганов|холодного тракта|горного рубежа|речной заставы|каменного пояса|каменного рубежа/u;
  const names = [];
  for (const tribe of TRIBES) for (const deck of Campaign.BARBARIAN_DECK_PROFILES[tribe].decks) for (const card of deck) names.push(card.name);
  for (const card of Campaign.STARTER_CARDS) names.push(card.name);
  for (const name of names) {
    assert.ok(!invented.test(name), `«${name}»: выдуманный топоним вместо типа войск`);
    assert.ok(name.split(' ').length <= 3, `«${name}»: имя отряда читается с жетона, а не с абзаца`);
  }
  // Внутри одного боя встречаются только одна колода племени и колода игрока: имена не должны сливаться.
  const mine = new Set(Campaign.STARTER_CARDS.map((c) => c.name));
  for (const tribe of TRIBES) {
    for (const deck of Campaign.BARBARIAN_DECK_PROFILES[tribe].decks) {
      for (const card of deck) assert.ok(!mine.has(card.name), `${tribe} «${card.name}»: у игрока уже есть отряд с таким именем — журнал станет нечитаемым`);
    }
  }
});

test('ополчение — тот же стартовый состав, но другими именами', () => {
  const militia = C.buildMilitia();
  assert.equal(militia.length, Campaign.STARTER_CARDS.length + 2, 'стартовый состав плюс две бронзовые карты');
  assert.equal(militia.filter((c) => depthWordsOf(c).length && c.era === 'ancient').length, 0, 'в каменном ополчении стрелков нет');
  const renamed = militia.map((c) => c.name);
  assert.equal(new Set(renamed).size, renamed.length, 'имена ополчения не повторяются');
  for (const card of Campaign.STARTER_CARDS) assert.ok(renamed.includes(card.name), `«${card.name}» приходит из стартового состава`);
});

test('постройка стреляет своей атакой, а стена без атаки не стреляет вовсе', () => {
  const structure = (atk, extra = {}) => C.validateCard({
    name: 'Сторожевая башня', card_type: 'structure', era: 'bronze', emoji: '🗼', drop_cost: 3, action_cost: 0,
    atk, hp: 6, description: 'Башня обстреливает подошедших каждый ход.', tags: [], abilities: [], keywords: [],
    effects: [], monkey_paw: '', ...extra,
  }, 'structure', ['ancient', 'bronze'], 'ordinary', 'none');

  assert.equal(structure(2).atk, 2, 'атака постройки остаётся при ней: это орудие, а не стена');
  assert.equal(structure(9, { hp: 3 }).atk, 4, 'потолок атаки постройки — 4: она не должна стрелять сильнее отряда');
  assert.equal(structure(0).atk, 0, 'стена без атаки законна — она просто не стреляет');
  assert.equal(structure(2).action_cost, 0, 'постройка не ходит и не атакует как отряд');
  // Что кузнец знает про обстрел постройки, проверяется на живом промпте в tests/card-advice.test.js.
});
