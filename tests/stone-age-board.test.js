const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

/**
 * Каменный век — стол из одной линии в три клетки: тыла нет, прятать стрелков не за кем и стрелять
 * не из-за кого. Поэтому на одной линии дальний бой, засада и «длинное оружие» не действуют: все
 * отряды бьются врукопашную (бьют того, кто напротив, затем ближайшего в линии, при пустой линии —
 * вождя) и получают ответный удар. Кузнец в это время стрелков не куёт вовсе — они заработают со
 * второго ряда, с Античного мира.
 */
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

/** Настоящие карты и настоящий движок: движку отдаём модуль карт, а не заглушку. */
function loadBoth(fetchImpl) {
  let ids = 0;
  const cards = runInVm('src/game/cards.ts', transpile('src/game/cards.ts'), {
    fetch: fetchImpl,
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
      throw new Error(`Неожиданный импорт ${name}`);
    },
  });
  const battle = runInVm('src/game/battle.ts', transpile('src/game/battle.ts'), {
    require(name) {
      if (name === './cards') return cards;
      throw new Error(`Неожиданный импорт ${name}`);
    },
    uid: () => `u${++ids}`,
  });
  return { cards, battle };
}

const modelReply = (payload) => ({
  ok: true,
  status: 200,
  json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
});

function stateAt(era, cultureId = 'yamnaya') {
  const state = Campaign.createState(20261006);
  state.player.onboardingComplete = true;
  state.player.era = era;
  state.player.historicalCulture = Campaign.HISTORICAL_CULTURES.find((c) => c.id === cultureId);
  state.player.culturalLineage = [cultureId];
  return Campaign.normalizeState(state);
}

const ADVICE = { id: 'unit-0-1', cardType: 'unit', title: 'Копейщики брода', pitch: 'Держат брод.' };
const cardFixture = (name, extra = {}) => ({
  id: name, name, card_type: 'unit', era: 'ancient', emoji: '🏹', drop_cost: 1, action_cost: 1,
  hp: 5, atk: 2, description: 'Тестовая карта.', tags: [], abilities: [], keywords: [], effects: [], monkey_paw: '',
  ...extra,
});
/** Карта, которую кузнец вернул модели: валидная во всём, кроме ключевых слов. */
const smithCard = (extra = {}) => ({
  name: 'Пращники брода', card_type: 'unit', era: 'ancient', emoji: '🏹',
  drop_cost: 2, action_cost: 1, hp: 4, atk: 2,
  description: 'Держат брод камнями из пращей, пока обоз переходит реку.',
  tags: ['праща'], abilities: [], keywords: ['ranged'], effects: [], monkey_paw: '',
  ...extra,
});

const CFG = { hp: 20, energyMax: 12, energyGrowth: 2, fatigueDelay: 0, atkBonus: 0 };

/** Test setup helper: old fixtures start with up to four cards so tests can place several units. */
function topUpHandsForSetup(b) {
  for (const side of ['me', 'enemy']) {
    const player = b[side];
    const target = Math.min(4, player.hand.length + player.deck.length);
    while (player.hand.length < target) player.hand.push(player.deck.shift());
  }
  return b;
}

function battleAt(battle, threatEra, myCards, enemyCards) {
  const match = { kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra, leaderBattle: false, tutorial: false };
  return topUpHandsForSetup(battle.createBattle(myCards, CFG, enemyCards, { ...CFG }, match));
}

function place(battle, b, side, cardName, row = 0, slot = 0) {
  const idx = b[side].hand.findIndex((c) => c.name === cardName);
  assert.ok(idx >= 0, `«${cardName}» должна быть в руке стороны ${side}`);
  const active = b.active;
  b.active = side;
  b[side].energy = 12;
  const ok = battle.deploy(b, side, idx, row, slot);
  b.active = active;
  return ok;
}

function unitAt(battle, b, side, ri, slot) {
  const u = battle.rowsOf(b[side])[ri][slot];
  assert.ok(u, `в ${side}[${ri}][${slot}] должен стоять отряд`);
  return u;
}

/** Ставит отряд в любой ряд, минуя правила высадки (ближний бой в тыл не выпускают). */
function putUnit(battle, b, side, cardName, ri, slot) {
  const idx = b[side].hand.findIndex((c) => c.name === cardName);
  assert.ok(idx >= 0, `«${cardName}» должна быть в руке стороны ${side}`);
  const rows = battle.rowsOf(b[side]);
  const stage = b[side].hand[idx].card_type === 'structure' ? rows.length - 1 : 0;
  const free = rows[stage].indexOf(null);
  assert.equal(place(battle, b, side, cardName, stage, free), true, `«${cardName}» должна выйти на стол`);
  const unit = rows[stage][free];
  rows[stage][free] = null;
  rows[ri][slot] = unit;
  return unit;
}

function refresh(battle, b) {
  for (const side of ['me', 'enemy']) for (const s of battle.unitsOf(b, side)) s.unit.exhausted = false;
}

function attackWith(battle, b, side, ri, slot) {
  const u = unitAt(battle, b, side, ri, slot);
  b.active = side;
  b[side].energy = 12;
  return battle.attackWith(b, side, u.iid);
}

/* ---------------- движок: одна линия — рукопашная ---------------- */

test('Каменный век: стрелок на одной линии бьёт того, кто напротив, и получает ответный удар', () => {
  const { battle } = loadBoth(async () => { throw new Error('сеть в тесте движка не нужна'); });
  const b = battleAt(battle, 0, [cardFixture('Пращники', { atk: 2, hp: 4, keywords: ['ranged'] })],
    [cardFixture('Дубинщик А', { atk: 5, hp: 6 }), cardFixture('Дубинщик Б', { atk: 1, hp: 6 })]);

  assert.equal(battle.deepTable(b), false, 'глубины у стола нет');
  assert.equal(battle.inactiveKeywords(b).join(','), 'ranged,skirmish,reach,screen', 'интерфейс знает, какие слова молчат');

  place(battle, b, 'me', 'Пращники', 0, 1);
  place(battle, b, 'enemy', 'Дубинщик А', 0, 0);
  place(battle, b, 'enemy', 'Дубинщик Б', 0, 1);
  refresh(battle, b);

  const target = battle.findTarget(b, unitAt(battle, b, 'me', 0, 1), 'me');
  assert.equal(target.unit.name, 'Дубинщик Б', 'бьёт того, кто напротив, а не самого опасного в линии');
  assert.equal(target.ri, 0);

  const before = unitAt(battle, b, 'me', 0, 1).curHp;
  assert.equal(attackWith(battle, b, 'me', 0, 1), true);
  assert.equal(unitAt(battle, b, 'enemy', 0, 1).curHp, 6 - 2, 'удар состоялся');
  assert.equal(unitAt(battle, b, 'me', 0, 1).curHp, before - 1, 'стрелок принял ответный удар');
  assert.match(b.log.at(-1).text, /атакует «Дубинщик Б»: −2 \/ ответ −1/u, 'журнал говорит про ближний бой с ответом');
});

test('Каменный век: при пустой линии стрелок доходит до вождя', () => {
  const { battle } = loadBoth(async () => { throw new Error('сеть в тесте движка не нужна'); });
  const b = battleAt(battle, 0, [cardFixture('Пращники', { atk: 2, keywords: ['ranged'] })], [cardFixture('Дубинщик')]);
  place(battle, b, 'me', 'Пращники', 0, 1);
  refresh(battle, b);

  assert.equal(battle.findTarget(b, unitAt(battle, b, 'me', 0, 1), 'me').kind, 'hero', 'линия пуста — цель вождь');
  assert.equal(attackWith(battle, b, 'me', 0, 1), true);
  assert.ok(b.enemy.hp < b.enemy.maxHp, 'вождь получил урон');
});

test('Каменный век: засада не уклоняется и не отступает — бьётся врукопашную', () => {
  const { battle } = loadBoth(async () => { throw new Error('сеть в тесте движка не нужна'); });
  const b = battleAt(battle, 0, [cardFixture('Застрельщики', { atk: 2, hp: 5, keywords: ['skirmish'] })],
    [cardFixture('Дубинщик', { atk: 1, hp: 6 })]);
  place(battle, b, 'me', 'Застрельщики', 0, 0);
  place(battle, b, 'enemy', 'Дубинщик', 0, 0);
  refresh(battle, b);

  const before = unitAt(battle, b, 'me', 0, 0).curHp;
  assert.equal(attackWith(battle, b, 'me', 0, 0), true);
  assert.equal(unitAt(battle, b, 'me', 0, 0).curHp, before - 1, 'засада приняла ответный удар');
  assert.equal(unitAt(battle, b, 'me', 0, 0).name, 'Застрельщики', 'и осталась на линии: уходить некуда');

  // Ответный ближний бой по засаде на одной линии тоже проходит: уклоняться некуда.
  refresh(battle, b);
  b.active = 'enemy';
  b.enemy.energy = 12;
  const enemy = unitAt(battle, b, 'enemy', 0, 0);
  assert.equal(battle.attackWith(b, 'enemy', enemy.iid), true);
  assert.ok(unitAt(battle, b, 'me', 0, 0).curHp < before, 'удар по засаде прошёл');
});

test('Со второго ряда (Античный мир) тот же стрелок снова стреляет через строй', () => {
  const { battle } = loadBoth(async () => { throw new Error('сеть в тесте движка не нужна'); });
  const b = battleAt(battle, 1, [cardFixture('Пращники', { atk: 2, hp: 4, keywords: ['ranged'] })],
    [cardFixture('Дубинщик А', { atk: 5, hp: 6 }), cardFixture('Дубинщик Б', { atk: 1, hp: 6 })]);

  assert.equal(battle.deepTable(b), true);
  assert.equal(battle.inactiveKeywords(b).length, 0, 'на столе с тылом все слова работают');

  place(battle, b, 'me', 'Пращники', 'back', 0);
  place(battle, b, 'enemy', 'Дубинщик Б', 0, 0);
  putUnit(battle, b, 'enemy', 'Дубинщик А', 1, 0);
  refresh(battle, b);

  const target = battle.findTarget(b, unitAt(battle, b, 'me', 1, 0), 'me');
  assert.equal(target.unit.name, 'Дубинщик А', 'стрела летит в самого опасного, а не в того, кто напротив');
  assert.equal(target.ri, 1, 'то есть через вражеский авангард, в тыл');

  const before = unitAt(battle, b, 'me', 1, 0).curHp;
  assert.equal(attackWith(battle, b, 'me', 1, 0), true);
  assert.equal(unitAt(battle, b, 'me', 1, 0).curHp, before, 'ответного удара нет');
  assert.match(b.log.at(-1).text, /стреляет через строй по «Дубинщик А»: −2\./u);
});

/* ---------------- кузнец: стрелков в Каменном веке не куёт ---------------- */

test('кузнец Каменного века отклоняет дальний бой и дважды перековывает карту', async () => {
  const requests = [];
  const { cards } = loadBoth(async (url, options) => {
    requests.push(JSON.parse(options.body));
    return modelReply(smithCard());
  });

  const error = await cards.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(0)).then(() => null, (e) => e);
  assert.ok(error, 'карта с дальним боем в Каменном веке не принимается');
  assert.match(error.message, /Каменного века/u, 'ошибка объясняет причину');
  assert.match(error.message, /ranged/u, 'и называет запрещённое слово');

  assert.equal(requests.length, 3, 'две перековки, затем ковка падает');
  assert.match(requests[0].messages[0].content, /Стол Каменного века — одна линия из трёх клеток/iu, 'заказ сразу говорит про одну линию');
  assert.match(requests[0].messages[0].content, /стреломёты/u, 'промпт запрещает анахроничные снаряды');
  assert.match(requests[1].messages[1].content, /одной линии/u, 'в переделку уходит точный текст ошибки');
  assert.match(requests[1].messages[1].content, /ranged/u);
});

test('перегруженный эффект каменного отряда упрощается, а ковка не отменяется', async () => {
  const requests = [];
  const { cards } = loadBoth(async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return modelReply(smithCard({
      name: 'Копейщики брода',
      description: 'Держат переправу сомкнутым строем.',
      tags: [],
      keywords: ['phalanx'],
      effects: [{
        event: 'enter_play',
        target: { side: 'enemy', entity: 'unit', select: 'first', count: 1 },
        action: { type: 'damage', amount: 4 },
      }],
    }));
  });

  const card = await cards.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(0));
  assert.equal(requests.length, 1, 'переизбыток не вызывает цикл браковки и повторную ковку');
  assert.equal(card.effects.length, 1);
  assert.equal(card.effects[0].action.amount, 2, 'эффект ужимается после резерва силы на ключевое слово и минимальные ATK/HP');
  assert.match(requests[0].messages[0].content, /0–2 простых эффекта/u, 'промпт заранее задаёт ограничение');
});

test('кузнец Каменного века куёт ближний бой, а с Античного мира — и стрелков', async () => {
  const stone = [];
  const stoneCards = loadBoth(async (url, options) => {
    stone.push(JSON.parse(options.body));
    return modelReply(smithCard({ name: 'Копейщики брода', keywords: ['phalanx'], tags: ['копьё'], description: 'Держат брод копьями, пока обоз переходит реку.' }));
  }).cards;
  const melee = await stoneCards.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(0));
  assert.equal(melee.name, 'Копейщики брода');
  assert.equal(stone.length, 1, 'ближний бой принимается с первой попытки');

  const bronze = [];
  const bronzeCards = loadBoth(async (url, options) => {
    bronze.push(JSON.parse(options.body));
    return modelReply(smithCard());
  }).cards;
  const ranged = await bronzeCards.llmCard('gpt-6-luna', ADVICE, 'ordinary', stateAt(1, 'sumer'));
  assert.equal(ranged.keywords.join(','), 'ranged', 'со второго ряда стрелки законны');
  assert.equal(bronze.length, 1);
  assert.doesNotMatch(bronze[0].messages[0].content, /ОДНА ЛИНИЯ в три клетки/u, 'заказ без запрета, когда стол с тылом');
});

test('советник в Каменном веке не предлагает стрельбу из тыла и засады', async () => {
  const stoneChoices = {
    choices: [
      { card_type: 'unit', title: 'Копейщики брода', pitch: 'Держат брод строем копий.' },
      { card_type: 'spell', title: 'Клич вождя', pitch: 'Ослабляет один вражеский отряд на короткое время.' },
    ],
  };
  const deepChoices = {
    choices: [
      { card_type: 'unit', title: 'Стражи переправы', pitch: 'Удерживают авангард, пока лучники бьют из тыла.' },
      { card_type: 'spell', title: 'Засада в камышах', pitch: 'Ловушка ненадолго ослабляет вражеский авангард.' },
      { card_type: 'structure', title: 'Частокол у брода', pitch: 'Каждый ход бьёт по подошедшим врагам.' },
    ],
  };
  const requests = [];
  let calls = 0;
  const { cards } = loadBoth(async (url, options) => {
    requests.push(JSON.parse(options.body));
    return modelReply(calls++ === 0 ? stoneChoices : deepChoices);
  });

  const stoneAdvice = await cards.llmAdvice('gpt-6-luna', stateAt(0));
  const user = requests[0].messages[1].content;
  assert.deepEqual(stoneAdvice.map((item) => item.cardType), ['unit', 'spell']);
  assert.match(user, /Стол Каменного века/u, 'советник знает размер стола');
  assert.match(user, /без тыла, построек, стрелков, снарядов/iu);
  assert.match(requests[0].messages[0].content, /общий запас энергии.*авангард и тыл/iu, 'общие правила боя на месте');

  await cards.llmAdvice('gpt-6-luna', stateAt(1, 'sumer'));
  assert.doesNotMatch(requests[1].messages[1].content, /Стол Каменного века/u, 'со второго ряда ограничения снимаются');
});

test('списки «глубинных» слов в движке и у кузнеца совпадают, а эпоха стола считается как в бою', () => {
  const { cards, battle } = loadBoth(async () => { throw new Error('сеть не нужна'); });
  assert.equal(cards.ONE_LINE_KEYWORDS.join(','), battle.DEPTH_KEYWORDS.join(','), 'движок и кузнец говорят об одном');
  assert.equal(cards.ONE_LINE_KEYWORDS.join(','), 'ranged,skirmish,reach,screen');

  assert.equal(cards.boardEraOf(stateAt(0)), 0);
  assert.equal(cards.oneLineBoard(stateAt(0)), true);
  assert.equal(cards.oneLineBoard(stateAt(1, 'sumer')), false);
  assert.equal(cards.oneLineBoard(stateAt(6)), false);

  // Стол считается по эпохе угрозы: если племя впереди игрока, линия уже не одна.
  const ahead = stateAt(0);
  ahead.opponents[0].era = 2;
  assert.equal(cards.boardEraOf(Campaign.normalizeState(ahead)), 2);
  assert.equal(cards.oneLineBoard(Campaign.normalizeState(ahead)), false);

  assert.equal(cards.oneLineViolation({ keywords: ['ranged'] }).join(','), 'ranged');
  assert.equal(cards.oneLineViolation({ keywords: ['armor:2', 'Ranged', 'reach:1', 'phalanx'] }).join(','), 'ranged,reach');
  assert.equal(cards.oneLineViolation({ keywords: ['phalanx'] }).length, 0);
  assert.equal(cards.oneLineViolation(null).length, 0);
});

/* ---------------- интерфейс ---------------- */

test('интерфейс объясняет, что дальний бой на одной линии молчит', () => {
  const view = fs.readFileSync(path.join(root, 'src', 'pages', 'Battle.tsx'), 'utf8');
  assert.match(view, /inactiveKeywords\(b\)/u, 'инспектор получает список молчащих слов');
  assert.match(view, /ONE_LINE_NOTE/u, 'и объяснение к ним');
  assert.match(view, /На одной линии Каменного века дальний бой не работает/u, 'подсказка при выбранном отряде');
  assert.match(view, /Стол Каменного века — одна линия в три клетки/u, 'тренер не отправляет в несуществующий тыл');
  assert.match(view, /перечёркнуты в описании отряда/u, 'правила боя объясняют перечёркнутые слова');
  assert.match(view, /export function Inspector/u, 'инспектор доступен тестам рендера');

  const cardView = fs.readFileSync(path.join(root, 'src', 'components', 'CardView.tsx'), 'utf8');
  assert.match(cardView, /role="button"/u, 'чип ключевого слова кликабельный');
  assert.match(cardView, /setOpen\(isOpen \? null : k\)/u, 'клик раскрывает и сворачивает пояснение');
  assert.match(cardView, /line-through/u, 'молчащее слово перечёркнуто');
  assert.match(cardView, /e\.stopPropagation\(\)/u, 'клик по чипу не открывает карточку целиком');
});
