/**
 * Один бюджет на всех: карты игрока и карты племён считаются одной формулой.
 *
 * Кузница живёт в src/game/cards.ts, колоды племён — в campaign.js, и до этой проверки они
 * расходились: шесть карт племён были сильнее любой карты игрока той же цены (Дружинники 3/7 за три),
 * а колода Севера в Античном мире не давала игроку ни одного равного размена. Теперь таблицы весов и
 * множителей редкости сверяются слово в слово, а каждая карта племени обязана пройти валидатор
 * кузницы без правок: то, что видит игрок на жетоне врага, он может выковать за ту же цену.
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

const Forge = runInVm('src/game/cards.ts', transpile('src/game/cards.ts'), {
  fetch: async () => ({ ok: true, status: 200, json: async () => ({ choices: [] }) }),
  require(name) {
    if (name === './model') {
      return {
        M: {
          ERA_HISTORICAL: Campaign.ERA_HISTORICAL, HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES,
          SEED_CHOICES: Campaign.SEED_CHOICES, MILITIA_CORE_CARDS: Campaign.MILITIA_CORE_CARDS,
          eraName: Campaign.eraName, allowedCardEras: Campaign.allowedCardEras,
          combatPerks: Campaign.combatPerks, describePerks: Campaign.describePerks,
        },
      };
    }
    throw new Error('Неожиданный импорт ' + name);
  },
});

const TRIBES = ['reed', 'steppe', 'north'];
const STAGES = [0, 1, 2];
const deckOf = (tribe, stage) => Campaign.BARBARIAN_DECK_PROFILES[tribe].decks[stage];
/** Предел энергии стороны на этапе: карту дороже предела племя не сыграет никогда. */
const energyCapAt = (stage) => Campaign.BARBARIAN_ENERGY_MAX[stage];

test('веса слов и множители редкости у кузницы и колод племён совпадают слово в слово', () => {
  const source = fs.readFileSync(path.join(root, 'src/game/cards.ts'), 'utf8');
  // Числовые таблицы кузницы читаем из её же кода: так проверка ловит и правку в cards.ts,
  // и правку в campaign.js — расхождение видно сразу, а не через сто боёв стенда.
  const weightBlock = source.match(/const KEYWORD_WEIGHT[^=]*=\s*\{([\s\S]*?)\};/);
  assert.ok(weightBlock, 'в cards.ts должна быть таблица KEYWORD_WEIGHT');
  const forgeWeights = {};
  for (const [, name, value] of weightBlock[1].matchAll(/([a-z]+):\s*(\d+)/g)) forgeWeights[name] = Number(value);
  for (const [kw, weight] of Object.entries(Campaign.CARD_KEYWORD_WEIGHT)) {
    assert.equal(forgeWeights[kw], weight, `вес слова ${kw} разошёлся у кузницы и колод племён`);
  }
  for (const kw of Object.keys(forgeWeights)) {
    assert.equal(Campaign.CARD_KEYWORD_WEIGHT[kw], forgeWeights[kw], `слово ${kw} есть в кузнице, но не в колодах`);
  }

  const scaleBlock = source.match(/const KEYWORD_SCALES\s*=\s*new Set\(\[([^\]]*)\]\)/);
  assert.ok(scaleBlock, 'в cards.ts должен быть список KEYWORD_SCALES');
  const forgeScales = [...scaleBlock[1].matchAll(/"([a-z]+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual([...Campaign.CARD_KEYWORD_SCALES].sort(), forgeScales, 'числовые слова разошлись');

  const rarityBlock = source.match(/const RARITY_BUDGET_MULT[^=]*=\s*\{([^}]*)\}/);
  assert.ok(rarityBlock, 'в cards.ts должна быть таблица RARITY_BUDGET_MULT');
  const forgeRarity = {};
  for (const [, name, value] of rarityBlock[1].matchAll(/(\w+):\s*([\d.]+)/g)) forgeRarity[name] = Number(value);
  assert.deepEqual(Campaign.CARD_RARITY_BUDGET_MULT, forgeRarity, 'множители редкости разошлись');
});

test('каждая карта племени укладывается в бюджет обычной ковки той же цены', () => {
  for (const tribe of TRIBES) {
    for (const stage of STAGES) {
      for (const card of deckOf(tribe, stage)) {
        if (stage === 0) {
          // Одна линия: рукопашная, атака не выше 2 и здоровье не выше 3 — то же ограничение,
          // что накладывает кузница (`validateCard` с oneLine), иначе игрок не может выковать равную карту.
          assert.ok(card.atk <= 2 && card.hp <= 3, `${tribe} «${card.name}»: каменный стол не терпит стен и тяжёлых бойцов`);
        }
        const budget = Forge.cardPowerBudget(card.drop_cost, card.action_cost || 0, card.card_type, 'ordinary');
        const power = Forge.cardPower(card);
        assert.ok(power <= budget, `${tribe} ст.${stage} «${card.name}»: сила ${power} против бюджета ${budget} — игрок не может выковать равную карту`);
        // Одна и та же сила карты у кузницы и у колод племён: атака (постройки — вдвойне),
        // здоровье и вес слов с числовыми N.
        assert.equal(Campaign.cardValueOf(card), power, `${tribe} «${card.name}»: сила карты считается по-разному`);
      }
    }
  }
});

test('валидатор кузницы принимает карты племён без правок: ни цифр, ни слов', () => {
  for (const tribe of TRIBES) {
    for (const stage of STAGES) {
      for (const card of deckOf(tribe, stage)) {
        const clean = Forge.validateCard({ ...card }, card.card_type, ['ancient', 'bronze'], 'ordinary', 'none', { oneLine: stage === 0 });
        assert.equal(clean.atk, card.atk, `${tribe} «${card.name}»: кузница срезает атаку`);
        assert.equal(clean.hp, card.hp, `${tribe} «${card.name}»: кузница срезает здоровье`);
        assert.deepEqual(clean.keywords, card.keywords, `${tribe} «${card.name}»: кузница снимает слова`);
      }
    }
  }
});

test('три племени равны по силе колоды, а в каждой колоде есть ход первого хода', () => {
  for (const stage of STAGES) {
    const powers = TRIBES.map((tribe) => deckOf(tribe, stage).reduce((sum, c) => sum + Forge.cardPower(c), 0));
    const low = Math.min(...powers), high = Math.max(...powers);
    assert.ok(high - low <= Math.max(3, low * 0.1), `этап ${stage}: племена разошлись по силе — ${powers.join(', ')}`);
    for (const tribe of TRIBES) {
      const deck = deckOf(tribe, stage);
      assert.ok(deck.some((c) => c.drop_cost <= 1), `${tribe} ст.${stage}: нет карты, которую можно вывести на первом ходу`);
      for (const card of deck) {
        assert.ok(card.drop_cost <= energyCapAt(stage), `${tribe} «${card.name}» за ${card.drop_cost} не сыграть при пределе ${energyCapAt(stage)}`);
      }
    }
  }
});

test('боевой профиль племени растёт по эпохам и не обгоняет игрока', () => {
  const energies = Campaign.BARBARIAN_ENERGY_MAX;
  const growth = Campaign.BARBARIAN_ENERGY_GROWTH;
  assert.equal(energies.length, Campaign.ERAS.length, 'потолок энергии задан на каждую эпоху');
  assert.equal(growth.length, Campaign.ERAS.length, 'прирост энергии задан на каждую эпоху');
  for (let era = 1; era < energies.length; era++) {
    assert.ok(energies[era] >= energies[era - 1], `эпоха ${era}: потолок энергии племени не должен падать`);
    assert.ok(growth[era] >= growth[era - 1], `эпоха ${era}: прирост энергии племени не должен падать`);
    assert.ok(Campaign.opponentHpFor(era) >= Campaign.opponentHpFor(era - 1), `эпоха ${era}: вождь племени не должен слабеть`);
  }
  for (let era = 0; era < Campaign.ERAS.length; era++) {
    const energy = Campaign.opponentEnergyFor(era);
    // Игрок может вложить славу в лагерь и получить запасы и тренировку отрядов; племя живёт кривой,
    // которая не должна обгонять даже полностью прокачанного игрока — иначе темп боя предрешён.
    assert.ok(energy.energyMax <= Campaign.COMBAT_CAPS.energyMax, `эпоха ${era}: предел энергии племени выше потолка игры`);
    assert.ok(energy.energyGrowth <= Campaign.COMBAT_CAPS.energyGrowth, `эпоха ${era}: прирост энергии племени выше потолка игры`);
    assert.ok(energy.energyGrowth < Campaign.COMBAT_BASE.energyGrowth + Campaign.CAMP_UPGRADES.energy_growth.max,
      `эпоха ${era}: племя не должно догонять полностью прокачанную тренировку отрядов игрока`);
    assert.ok(Campaign.opponentAtkBonusFor(era) <= Campaign.CAMP_UPGRADES.unit_power.max,
      `эпоха ${era}: доктрина племени не выше доктрины игрока`);
    assert.ok(Campaign.opponentHpFor(era) > Campaign.COMBAT_BASE.hp, `эпоха ${era}: вождь племени крепче базового вождя игрока`);
    assert.ok(Campaign.opponentHpFor(era) <= Campaign.COMBAT_CAPS.hp, `эпоха ${era}: вождь племени выше потолка здоровья`);
  }
  // Доктрина появляется позже, чем у игрока (воинская доктрина лагеря доступна с первой эпохи).
  assert.equal(Campaign.opponentAtkBonusFor(0), 0);
  assert.equal(Campaign.opponentAtkBonusFor(2), 0);
  assert.ok(Campaign.opponentAtkBonusFor(6) >= Campaign.opponentAtkBonusFor(5), 'доктрина племени не падает в последней эпохе');
});

test('ветеранский слой поднимает цифры до ковки эпохи, но не трогает цену карты', () => {
  const base = { id: 'x', name: 'Проба', card_type: 'unit', era: 'bronze', emoji: '⚔️', drop_cost: 2, action_cost: 1, atk: 2, hp: 2, description: '', tags: [], abilities: [], keywords: ['taunt'], effects: [], monkey_paw: '' };
  const steps = 3;
  const mult = Campaign.expectedCraftMultiplier(4);
  const vet = Campaign.veteranCard(base, steps, mult);
  assert.equal(vet.drop_cost, base.drop_cost, 'цена карты племени не растёт: иначе племя выводит один отряд там, где игрок два');
  assert.ok(vet.atk + vet.hp > base.atk + base.hp, 'ветеран сильнее новобранца');
  assert.ok(Forge.cardPower(vet) <= Math.round(Campaign.cardBudgetOf(base) * mult) + 1, 'ветеран не выходит за бюджет ковки своей эпохи');
  assert.equal(Campaign.veteranCard(base, 0, mult).atk, base.atk, 'без ступеней карта не меняется');
  assert.equal(Campaign.veteranCard(base, steps, 1).atk, base.atk, 'при множителе единицы карта не меняется');
  const spell = { ...base, card_type: 'spell', atk: 0, hp: 0, effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit' }, action: { type: 'damage', amount: 2 } }] };
  assert.deepEqual(Campaign.veteranCard(spell, steps, mult).effects, spell.effects, 'манёвры племени ветеранами не становятся: их сила считается отдельно');
});

test('колода и конфиг племени считают одну и ту же колоду той же эпохи', () => {
  const state = Campaign.foundCampaignState(Campaign.createState(7), { seedId: 'field', historicalCultureId: 'natufian' }).state;
  state.player.era = 5;
  for (const tribe of TRIBES) {
    const opponent = state.opponents.find((o) => o.id === tribe);
    // Племя подтягивается к эпохе игрока при переходе (bringBarbariansAlong) — здесь то же состояние.
    opponent.era = Campaign.BARBARIAN_ERA_CAP;
    const config = Campaign.getOpponentBattleConfig(state, tribe);
    const deck = Campaign.getOpponentBattleDeck(state, tribe);
    assert.ok(Array.isArray(deck) && deck.length === Campaign.BARBARIAN_DECK_SIZES[Campaign.BARBARIAN_ERA_CAP], `${tribe}: колода своей эпохи`);
    assert.ok(config.deckLimit >= deck.length && config.deckLimit <= Campaign.deckLimits(config.threatEra).cap, `${tribe}: предел колоды вмещает состав`);
    assert.equal(config.threatEra, state.player.era, `${tribe}: угроза считается от эпохи игрока`);
    // Ветеранский слой: цифры карт выросли вместе с ковкой игрока (с отставанием), цена — нет.
    const base = Campaign.BARBARIAN_DECK_PROFILES[tribe].decks[barbarianStageOf(opponent)];
    assert.ok(deck.some((c, i) => base[i].card_type !== 'spell' && c.atk + c.hp > base[i].atk + base[i].hp), `${tribe}: ветераны должны быть сильнее основы`);
    assert.ok(deck.every((c, i) => c.drop_cost === base[i].drop_cost), `${tribe}: цена карт не меняется с эпохой`);
  }
});

function barbarianStageOf(opponent) {
  return Math.max(0, Math.min(Campaign.BARBARIAN_ERA_CAP, Math.floor(opponent.era)));
}
