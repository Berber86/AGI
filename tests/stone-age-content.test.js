/**
 * Содержание Каменного века: рукопашная вместо стрелков, исторические типы войск вместо выдуманных
 * мест и числа, при которых обмен ударами вообще случается.
 *
 * Стол Каменного века — одна линия в три клетки: тыла нет, поэтому ranged, skirmish и reach на нём
 * молчат. Раньше стартовый состав и каменные колоды племён были на треть стрелками — карты врали
 * собственным текстом и работали как слабые рукопашные. Теперь дальний бой приходит с Античного
 * мира, когда у стола появляется второй ряд.
 *
 * Шаблоны каменного ополчения существуют только для NPC. Карты игрока создаются ИИ-кузнецом,
 * валидатор и боевой движок удерживают их базовую и эффективную атаку в умеренных пределах.
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
          ERA_HISTORICAL: Campaign.ERA_HISTORICAL, HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES, SEED_CHOICES: Campaign.SEED_CHOICES, MILITIA_CORE_CARDS: Campaign.MILITIA_CORE_CARDS,
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

test('NPC-шаблоны каменного века рукопашные и не выдаются в коллекцию игрока', () => {
  const militiaCore = Campaign.MILITIA_CORE_CARDS;
  assert.equal(militiaCore.length, 8, 'историческое ядро ополчения');
  for (const card of militiaCore) {
    assert.deepEqual(depthWordsOf(card), [], `«${card.name}»: на одной линии слова глубины молчат, их не должно быть`);
    assert.notEqual(card.card_type, 'structure', `«${card.name}»: на единственной линии постройка не держит столбец и только съедает место бойца`);
    assert.equal(card.era, 'ancient', `«${card.name}»: Каменный век, а не бронза`);
    assert.ok(!/бронз/u.test(card.name + card.description), `«${card.name}»: бронзы в Каменном веке нет`);
  }
  const units = militiaCore.filter((c) => c.card_type === 'unit');
  assert.equal(units.length, 7, 'семь NPC-отрядов и один манёвр');
  for (const unit of units) {
    assert.ok(unit.hp >= 1 && unit.hp <= 3, `«${unit.name}»: в Каменном веке нормальный диапазон — 1–3 HP`);
    assert.ok(unit.atk >= 1 && unit.atk <= 2, `«${unit.name}»: базовая атака каменного отряда — 1–2`);
  }
});

test('шаблоны ополчения не являются источником карт для игрока', () => {
  assert.deepEqual(C.allCards([]), [], 'пустая коллекция остаётся пустой');
  assert.equal(C.buildMilitia().length, Campaign.MILITIA_CORE_CARDS.length + 2, 'только NPC-ополчение получает статические шаблоны');
  assert.deepEqual(C.allCards(Campaign.MILITIA_CORE_CARDS), [], 'шаблоны NPC нельзя показать как карты игрока');
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
  for (const card of Campaign.MILITIA_CORE_CARDS) names.push(card.name);
  for (const name of names) {
    assert.ok(!invented.test(name), `«${name}»: выдуманный топоним вместо типа войск`);
    assert.ok(name.split(' ').length <= 3, `«${name}»: имя отряда читается с жетона, а не с абзаца`);
  }
  // Внутри одного боя встречаются только одна колода племени и колода игрока: имена не должны сливаться.
  const mine = new Set(Campaign.MILITIA_CORE_CARDS.map((c) => c.name));
  for (const tribe of TRIBES) {
    for (const deck of Campaign.BARBARIAN_DECK_PROFILES[tribe].decks) {
      for (const card of deck) assert.ok(!mine.has(card.name), `${tribe} «${card.name}»: у игрока уже есть отряд с таким именем — журнал станет нечитаемым`);
    }
  }
});

test('ополчение — историческое NPC-ядро и бронзовые подкрепления', () => {
  const militia = C.buildMilitia();
  assert.equal(militia.length, Campaign.MILITIA_CORE_CARDS.length + 2, 'NPC-ядро плюс две бронзовые карты');
  assert.equal(militia.filter((c) => depthWordsOf(c).length && c.era === 'ancient').length, 0, 'в каменном ополчении стрелков нет');
  const renamed = militia.map((c) => c.name);
  assert.equal(new Set(renamed).size, renamed.length, 'имена ополчения не повторяются');
  for (const card of Campaign.MILITIA_CORE_CARDS) assert.ok(renamed.includes(card.name), `«${card.name}» приходит из NPC-ядра`);
});

test('Stone-age text validation catches bolt-throwers and any named throwing weapon', () => {
  for (const name of ['Стреломёт племени', 'Метатель копий', 'Копьемётчик', 'Пращники']) {
    assert.ok(C.oneLineTextViolation({ name }).length > 0, `«${name}» не просачивается в рукопашную эпоху`);
  }
});

test('AI-генерация для Каменного века отклоняет оружие дальнего боя и режет характеристики', async () => {
  const generated = (extra = {}) => ({
    name: 'Метатели', card_type: 'unit', era: 'ancient', emoji: '🪨', drop_cost: 2, action_cost: 1,
    hp: 8, atk: 9, description: 'Стреломёт обстреливает вражеский строй.', tags: [], abilities: [],
    keywords: ['charge'], effects: [], monkey_paw: '', history: { title: 'Метательная машина', text: 'Стрелы летят через строй.' },
    ...extra,
  });
  const state = Campaign.foundCampaignState(Campaign.createState(), { seedId: 'field', historicalCultureId: 'natufian' }).state;
  const requestBodies = [];
  const api = runInVm('src/game/cards.ts', transpile('src/game/cards.ts'), {
    fetch: async (_url, init) => {
      requestBodies.push(JSON.parse(init.body));
      const raw = requestBodies.length < 3
        ? generated()
        : generated({ name: 'Каменные копейщики', description: 'Сомкнутый строй держит брод.', hp: 3, atk: 2,
          history: { title: 'Кремнёвое копьё', text: 'Кремень укрепляет древко для ближнего боя.' } });
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(raw) } }] }) };
    },
    require(name) {
      if (name === './model') return { M: { ERA_HISTORICAL: Campaign.ERA_HISTORICAL, HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES,
        SEED_CHOICES: Campaign.SEED_CHOICES, MILITIA_CORE_CARDS: Campaign.MILITIA_CORE_CARDS, isNpcMilitiaCardId: Campaign.isNpcMilitiaCardId,
        eraName: Campaign.eraName, allowedCardEras: Campaign.allowedCardEras, combatPerks: Campaign.combatPerks, describePerks: Campaign.describePerks } };
      throw new Error(name);
    },
  });
  const card = await api.llmCard('gpt-6-luna', { id: 'unit', cardType: 'unit', title: 'Стражи брода', pitch: 'Держат строй.' }, 'ordinary', state);
  assert.equal(requestBodies.length, 3, 'две версии со стреломётом бракуются до принятия исправленной карты');
  assert.ok(card.atk <= 2 && card.hp <= 3, 'валидатор удерживает каменные базовые параметры');
  assert.ok(card.drop_cost <= 2 && card.action_cost >= 1, 'каменный отряд не бесплатный и не требует чрезмерной энергии на действие');
  assert.match(requestBodies[0].messages[0].content, /стреломёты/u, 'запрет явно включён в компактный системный промпт');
});

test('каменный манёвр — один умеренный эффект на одну цель; отряд не складывает усилители атаки', () => {
  const spell = (effects, drop_cost = 2) => ({
    name: 'Короткий манёвр', card_type: 'spell', era: 'ancient', emoji: '🪨', drop_cost, action_cost: 0,
    hp: 0, atk: 0, description: 'Ненадолго ослабляет один вражеский отряд.', tags: [], abilities: [],
    keywords: [], effects, monkey_paw: '',
  });
  const damage = (amount, target = { side: 'enemy', entity: 'unit', select: 'first' }) => ({
    event: 'enter_play', target, action: { type: 'damage', amount },
  });
  const validate = (effects, cost) => C.validateCard(spell(effects, cost), 'spell', ['ancient'], 'rare', 'none', { oneLine: true });
  assert.doesNotThrow(() => validate([damage(2)], 2), 'урон не выше двух по одной цели допустим');
  assert.throws(() => validate([damage(3)], 2), /предел 2/u, 'камень не получает сильное заклинание даже из-за редкости');
  assert.throws(() => validate([damage(1, { side: 'enemy', entity: 'unit', select: 'all' })], 2), /только одну цель/u);
  assert.throws(() => validate([damage(1, { side: 'enemy', entity: 'unit', count: 2 })], 2), /только одну цель/u);
  assert.throws(() => validate([damage(1), damage(1)], 2), /ровно один скромный эффект/u);

  const paid = spell([{
    event: 'enter_play', target: { side: 'friendly', entity: 'unit', select: 'first' },
    action: { type: 'apply_status', status: 'burn', amount: 2, turns: 3 },
  }], 2);
  paid.monkey_paw = 'Свой отряд горит три хода.';
  paid.history = { title: 'Пепельный обряд', text: 'Обряд требует сжечь припасы и терпеть жар в собственном строю.' };
  assert.doesNotThrow(() => C.validateCard(paid, 'spell', ['ancient'], 'ordinary', 'harsh', { oneLine: true }),
    'проверяемая жёсткая плата может дать ограниченную надбавку, не блокируя первую ковку');

  const unit = C.validateCard({
    name: 'Копейщики', card_type: 'unit', era: 'ancient', emoji: '🔺', drop_cost: 2, action_cost: 0,
    hp: 99, atk: 99, description: 'Держат линию.', tags: [], abilities: [],
    keywords: ['charge'], effects: [], monkey_paw: '',
  }, 'unit', ['ancient'], 'rare', 'none', { oneLine: true });
  assert.ok(unit.hp <= 3 && unit.atk <= 2);
  assert.equal(unit.action_cost, 1);
  assert.throws(() => C.validateCard({
    name: 'Копейщики', card_type: 'unit', era: 'ancient', emoji: '🔺', drop_cost: 2, action_cost: 1,
    hp: 3, atk: 2, description: 'Держат линию.', tags: [], abilities: [],
    keywords: ['charge', 'phalanx'], effects: [], monkey_paw: '',
  }, 'unit', ['ancient'], 'ordinary', 'none', { oneLine: true }), /усилителей атаки/u, 'двойной усилитель атаки отклоняется');
});

test('постройка стреляет своей атакой, а стена без атаки не стреляет вовсе', () => {
  const structure = (atk, extra = {}) => C.validateCard({
    name: 'Сторожевая башня', card_type: 'structure', era: 'bronze', emoji: '🗼', drop_cost: 3, action_cost: 0,
    atk, hp: 6, description: 'Башня обстреливает подошедших каждый ход.', tags: [], abilities: [], keywords: [],
    effects: [], monkey_paw: '', ...extra,
  }, 'structure', ['ancient', 'bronze'], 'ordinary', 'none');

  assert.equal(structure(2).atk, 2, 'атака постройки остаётся при ней: это орудие, а не стена');
  // Потолок атаки постройки — 4, но выстрел без действия и без энергии стоит в силе карты двойной
  // цены: орудие с атакой 4 укладывается в бюджет только за четыре энергии с одной полоской HP.
  assert.equal(structure(9, { hp: 1, drop_cost: 4 }).atk, 4, 'потолок атаки постройки — 4: она не должна стрелять сильнее отряда');
  assert.ok(structure(9).atk < 4, 'за три энергии атака упирается в бюджет, а не в потолок');
  assert.equal(structure(0).atk, 0, 'стена без атаки законна — она просто не стреляет');
  assert.equal(structure(2).action_cost, 0, 'постройка не ходит и не атакует как отряд');
  // Что кузнец знает про обстрел постройки, проверяется на живом промпте в tests/card-advice.test.js.
});
