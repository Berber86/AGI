const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const Campaign = require('../campaign.js');
const CampaignMap = require('../campaign-map.js');

const root = path.join(__dirname, '..');
const campaignSource = fs.readFileSync(path.join(root, 'campaign.js'), 'utf8');
const cardsSource = fs.readFileSync(path.join(root, 'src', 'game', 'cards.ts'), 'utf8');
const battleSource = fs.readFileSync(path.join(root, 'src', 'game', 'battle.ts'), 'utf8');
const legacyHtml = fs.readFileSync(path.join(root, 'legacy.html'), 'utf8');

const TEST_SEED = 12345;

/**
 * Регрессия рассинхрона шкалы эпох: раньше ERAS шла «Каменный век → Античный мир → Средневековье →
 * Ренессанс → …», а ERA_HISTORICAL, ключевые ресурсы эпох, minEra месторождений и порог бронзовых
 * карт жили на собственной «исторической лестнице» (Неолит → ранняя бронза → поздняя бронза →
 * Античность → …) и отставали на ступень начиная с индекса 1. Все проверки ниже сверяют производные
 * таблицы и пороги с ERAS как единственным источником истины.
 */

/** Достаёт литерал объекта из исходника по имени константы (счётчиком скобок), чтобы проверить данные без браузера. */
function extractObjectLiteral(source, declaration) {
  const start = source.indexOf(declaration);
  assert.ok(start >= 0, `в исходнике не найдено ${declaration}`);
  const open = source.indexOf('{', start);
  let depth = 0;
  let inString = null;
  for (let i = open; i < source.length; i++) {
    const char = source[i];
    if (inString) {
      if (char === '\\') i++;
      else if (char === inString) inString = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') { inString = char; continue; }
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  throw new Error(`Не удалось найти конец ${declaration}`);
}

function evaluateObjectLiteral(text) {
  return vm.runInNewContext('(' + text + ')', {}, { timeout: 3000 });
}

/** Загружает src/game/cards.ts с настоящей моделью, а поверх — src/game/battle.ts. */
function loadBattleWithRealCards() {
  const transpile = (file) => ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const load = (relative, resolve) => {
    const file = path.join(root, relative);
    const mod = { exports: {} };
    const sandbox = {
      module: mod, exports: mod.exports, require: resolve,
      console, Date, Math, JSON, Promise, String, Number, Object, Array, Set, Map, Error, encodeURIComponent,
    };
    vm.runInNewContext(transpile(file), sandbox, { filename: relative, timeout: 5000 });
    return mod.exports;
  };
  const cards = load('src/game/cards.ts', (name) => {
    if (name === './model') return { M: Campaign };
    throw new Error('Unexpected import ' + name);
  });
  const battle = load('src/game/battle.ts', (name) => {
    if (name === './cards') return cards;
    throw new Error('Unexpected import ' + name);
  });
  return { cards, battle };
}

test('ERA_HISTORICAL проиндексирован ровно как ERAS: тот же порядок, те же названия', () => {
  assert.equal(Campaign.ERA_HISTORICAL.length, Campaign.ERAS.length);
  Campaign.ERA_HISTORICAL.forEach((record, index) => {
    assert.equal(record.era, index, 'поле era обязано совпадать с индексом строки');
    assert.equal(record.label, Campaign.ERAS[index], `строка ${index} обязана описывать эпоху «${Campaign.ERAS[index]}»`);
    assert.ok(typeof record.desc === 'string' && record.desc.length > 10, 'у каждой эпохи есть описание');
    assert.ok(Array.isArray(record.cultures) && record.cultures.length >= 3, 'у каждой эпохи есть культуры');
    assert.ok(Array.isArray(record.tech) && record.tech.length >= 3, 'у каждой эпохи есть технологии');
  });
  assert.deepEqual(Campaign.ERA_HISTORICAL.map(record => record.slug),
    ['stone', 'antiquity', 'medieval', 'renaissance', 'steam', 'modern', 'future'],
    'порядок slug фиксирует лестницу эпох: сдвиг на одну ступень больше не пройдёт незамеченным');
});

test('исторический контекст эпохи больше не отстаёт от ERAS на ступень', () => {
  // Конкретные симптомы прежнего рассинхрона: эпоха 3 «Ренессанс» описывалась античностью,
  // эпоха 4 «Эпоха Пара и Стали» — средневековьем, эпоха 5 «Новейшее время» — 1800-1910.
  assert.match(Campaign.ERA_HISTORICAL[1].desc, /Шумер|Аккад|Египет/);
  assert.ok(!/Античность —/.test(Campaign.ERA_HISTORICAL[3].desc), 'Ренессанс не должен описываться античностью');
  assert.match(Campaign.ERA_HISTORICAL[2].desc, /замок|стремен|степн/i);
  assert.match(Campaign.ERA_HISTORICAL[3].desc, /печатн|порох|Возрождение/i);
  assert.match(Campaign.ERA_HISTORICAL[4].desc, /пар|стал/i);
  assert.match(Campaign.ERA_HISTORICAL[5].desc, /авиаци|атом|космос|войн/i);
  assert.match(Campaign.ERA_HISTORICAL[6].desc, /2050-2150|клин|дрон|орбит/i);
});

test('ключевой ресурс эпохи совпадает с minEra месторождений на карте', () => {
  assert.deepEqual(Object.keys(Campaign.ERA_KEY_RESOURCE).map(Number), [0, 1, 2],
    'обсидиан — Каменный век, бронза — Античный мир, железо — Средневековье; поздние эпохи пока без гейта');
  assert.equal(Campaign.ERA_KEY_RESOURCE[0].buildings[0], Campaign.REGION_BUILDINGS.obsidian.id);
  assert.deepEqual(Campaign.ERA_KEY_RESOURCE[1].buildings, [Campaign.REGION_BUILDINGS.copper.id, Campaign.REGION_BUILDINGS.tin.id]);
  assert.equal(Campaign.ERA_KEY_RESOURCE[2].buildings[0], Campaign.REGION_BUILDINGS.iron.id);
  assert.equal(CampaignMap.BRONZE_SITE_MIN_ERA, 1, 'медь и олово доступны с эпохи «Античный мир»');
  assert.equal(CampaignMap.IRON_SITE_MIN_ERA, 2, 'железо доступно с эпохи «Средневековье»');

  const world = CampaignMap.generateWorld(TEST_SEED, Campaign.createState(TEST_SEED).opponents);
  const minEraOf = feature => world.tiles.find(tile => tile.feature === feature).minEra;
  assert.equal(minEraOf('obsidian-vein'), 0);
  assert.equal(minEraOf('copper-vein'), 1);
  assert.equal(minEraOf('tin-route'), 1);
  assert.equal(minEraOf('iron-vein'), 2);
  assert.equal(minEraOf('settlement'), 2, 'экспедиция к поселению соседа открывается в эпоху «Средневековье»');
  // Ключевой ресурс эпохи N должен быть реально достижим в эпоху N: месторождение не может
  // требовать эпоху позже, чем гейт, который на него ссылается.
  for (const [era, requirement] of Object.entries(Campaign.ERA_KEY_RESOURCE)) {
    for (const buildingId of requirement.buildings) {
      const site = Object.entries(Campaign.REGION_BUILDINGS).find(([, building]) => building.id === buildingId)[0];
      assert.ok(minEraOf(siteToFeature(site)) <= Number(era),
        `месторождение для ключевой постройки эпохи ${era} не должно требовать более позднюю эпоху`);
    }
  }
});

function siteToFeature(siteType) {
  return { obsidian: 'obsidian-vein', copper: 'copper-vein', tin: 'tin-route', iron: 'iron-vein' }[siteType];
}

test('hasEraKeyResource идёт от эпохи, а не от наследия народа', () => {
  const base = Campaign.createState(TEST_SEED);
  base.player.onboardingComplete = true;
  for (const culture of ['yamnaya', 'egypt-old', 'mongols', 'british-empire', 'neo-sumer']) {
    const state = Campaign.normalizeState({ ...base, player: { ...base.player, historicalCulture: Campaign.HISTORICAL_CULTURES.find(item => item.id === culture) } });
    // Без построек заперты ровно эпохи из ERA_KEY_RESOURCE, остальные свободны.
    for (let era = 0; era < Campaign.ERAS.length; era++) {
      const probed = Campaign.normalizeState({ ...state, player: { ...state.player, era } });
      assert.equal(Campaign.hasEraKeyResource(probed), !Campaign.ERA_KEY_RESOURCE[era],
        `эпоха ${era} с наследием «${culture}»: гейт обязан зависеть только от эпохи`);
    }
  }
});

test('эпохи дозоров не обгоняют боевой контент племён', () => {
  assert.equal(CampaignMap.GUARD_ERA_CAP, Campaign.BARBARIAN_ERA_CAP,
    'лимит эпохи дозора обязан совпадать с пределом развития племён (колоды Каменный век / Античный мир / Средневековье)');
  assert.equal(Campaign.BARBARIAN_DECK_SIZES.length, Campaign.BARBARIAN_ERA_CAP + 1);
  // У каждого племени есть колода на каждую эпоху вплоть до предела — и ни одной «из будущего».
  const tribes = Campaign.createState(TEST_SEED);
  for (const opponent of tribes.opponents) {
    for (let era = 0; era <= Campaign.BARBARIAN_ERA_CAP; era++) {
      const probed = Campaign.normalizeState({ ...tribes, opponents: tribes.opponents.map(item => item.id === opponent.id ? { ...item, era } : item) });
      const deck = Campaign.getOpponentBattleDeck(probed, opponent.id);
      assert.ok(deck && deck.length === Campaign.BARBARIAN_DECK_SIZES[era], `${opponent.id}: колода эпохи ${era} (${Campaign.ERAS[era]})`);
    }
  }
  for (let seed = 1; seed <= 12; seed++) {
    const worldSeed = seed * 7919;
    const world = CampaignMap.generateWorld(worldSeed, Campaign.createState(worldSeed).opponents);
    const guarded = world.tiles.filter(tile => tile.guard);
    assert.ok(guarded.length > 0);
    assert.ok(guarded.every(tile => tile.guard.era <= Campaign.BARBARIAN_ERA_CAP),
      'дозор не должен носить эпоху, для которой у племён нет колоды');
    assert.ok(guarded.every(tile => tile.guard.era >= tile.minEra), 'дозор не слабее эпохи самой клетки');
  }
});

test('бронзовый тег карт открывается в одну и ту же эпоху у игрока и у противника', () => {
  assert.equal(Campaign.BRONZE_CARD_MIN_ERA, 1, 'бронза — «Античный мир», а не эпоха 3 («Ренессанс»)');
  assert.deepEqual(Campaign.allowedCardEras(0), ['ancient']);
  for (let era = Campaign.BRONZE_CARD_MIN_ERA; era < Campaign.ERAS.length; era++) {
    assert.deepEqual(Campaign.allowedCardEras(era), ['ancient', 'bronze'], `эпоха ${era} (${Campaign.ERAS[era]})`);
  }
  assert.deepEqual(Campaign.allowedCardEras(99), ['ancient', 'bronze'], 'индекс за пределами шкалы зажимается');
  assert.deepEqual(Campaign.allowedCardEras(-1), ['ancient']);

  const { cards, battle } = loadBattleWithRealCards();
  // React-кузнец берёт порог из модели, а не хардкодом.
  assert.deepEqual(JSON.parse(JSON.stringify(cards.allowedCardErasOf({ player: { era: 0 } }))), ['ancient']);
  assert.deepEqual(JSON.parse(JSON.stringify(cards.allowedCardErasOf({ player: { era: Campaign.BRONZE_CARD_MIN_ERA } }))), ['ancient', 'bronze']);

  // Вражеский дозор получает бронзу с той же эпохи, что и игрок.
  const stoneDeck = JSON.parse(JSON.stringify(battle.enemyDeckForEra(0, 12)));
  assert.equal(stoneDeck[0].era, 'ancient');
  const bronzeDeck = JSON.parse(JSON.stringify(battle.enemyDeckForEra(Campaign.BRONZE_CARD_MIN_ERA, 12)));
  assert.equal(bronzeDeck[0].era, 'bronze', 'с эпохи «Античный мир» бронзовые карты идут первыми');
});

test('в исходниках не осталось прежнего порога бронзы (era >= 3) и кузнец читает эпоху кампании', () => {
  // Проверяем именно код (порог в тернарнике/условии), а не упоминание в комментарии-пояснении.
  assert.ok(!/player\.era\s*>=\s*3/.test(cardsSource), 'cards.ts больше не хардкодит порог бронзовой эпохи');
  assert.match(cardsSource, /allowedCardErasOf\(state\)/);
  assert.match(cardsSource, /M\.allowedCardEras\(state\.player\.era\)/);
  assert.ok(!/era\s*>=\s*3\s*\?/.test(legacyHtml), 'legacy.html больше не хардкодит порог бронзовой эпохи');
  assert.match(legacyHtml, /CampaignMvp\.allowedCardEras\(/);
  assert.match(battleSource, /era >= 1/, 'порог у дозоров остаётся числом, но сверяется с моделью тестом выше');
  assert.match(battleSource, /BRONZE_CARD_MIN_ERA/, 'порог дозоров ссылается на единый источник истины');
  // Контекст эпохи (описание, культуры и технологии) уходит в промпты кузнеца в обоих интерфейсах.
  assert.match(cardsSource, /Технологии эпохи/);
  assert.match(cardsSource, /Культуры эпохи/);
  assert.match(legacyHtml, /Технологии эпохи/);
  assert.match(legacyHtml, /Культуры эпохи/);
  assert.match(cardsSource, /боевой тег — это не дата в календаре кампании/i);
});

test('HISTORICAL_CULTURES покрывает все семь эпох и согласован с ERA_HISTORICAL', () => {
  const ids = Campaign.HISTORICAL_CULTURES.map(culture => culture.id);
  assert.equal(new Set(ids).size, ids.length, 'идентификаторы культур уникальны');
  const names = Campaign.HISTORICAL_CULTURES.map(culture => culture.name);
  assert.equal(new Set(names).size, names.length, 'названия культур не повторяются');
  assert.equal(Campaign.HISTORICAL_CULTURES[0].id, 'yamnaya', 'на индекс 0 смотрят тесты и симулятор экономики');

  const allowedBonusKeys = new Set(['food', 'materials', 'knowledge', 'deck_slots', 'storage', 'max_hp']);
  for (const culture of Campaign.HISTORICAL_CULTURES) {
    assert.ok(Number.isInteger(culture.era) && culture.era >= 0 && culture.era < Campaign.ERAS.length,
      `${culture.id}: era обязана быть индексом ERAS`);
    assert.ok(culture.icon && culture.desc.length > 20, `${culture.id}: нужны иконка и содержательное описание`);
    for (const [key, value] of Object.entries(culture.bonus || {})) {
      assert.ok(allowedBonusKeys.has(key), `${culture.id}: неожиданный ключ бонуса ${key}`);
      assert.ok(value > 0 && value <= 5, `${culture.id}: бонус ${key}=${value} вне разумных пределов`);
    }
    // Культура эпохи N должна быть описана в строке ERA_HISTORICAL[N] того же индекса.
    assert.equal(Campaign.ERA_HISTORICAL[culture.era].label, Campaign.ERAS[culture.era]);
  }
  for (let era = 0; era < Campaign.ERAS.length; era++) {
    const cultures = Campaign.HISTORICAL_CULTURES.filter(culture => culture.era === era);
    assert.ok(cultures.length >= 3, `эпоха «${Campaign.ERAS[era]}» должна давать хотя бы три культуры на выбор`);
  }
  // Стартовый пул — только Каменный век: начинать в неолите с Ассирией или Римом нельзя.
  const startPool = Campaign.HISTORICAL_CULTURES.filter(culture => culture.era === 0).map(culture => culture.id);
  assert.ok(startPool.includes('yamnaya'));
  assert.ok(!startPool.includes('assyria') && !startPool.includes('rome'));
  assert.match(campaignSource, /HISTORICAL_CULTURES\.filter\(h => h\.era === 0\)/);
});

test('каждая культура эпохи находит карточки в локальных пулах кузнеца legacy.html', () => {
  const cultureUnits = evaluateObjectLiteral(extractObjectLiteral(legacyHtml, 'const CULTURE_UNITS_BY_ERA = {'));
  const commonUnits = evaluateObjectLiteral(extractObjectLiteral(legacyHtml, 'const ERA_COMMON_UNITS = {'));
  for (let era = 0; era < Campaign.ERAS.length; era++) {
    assert.ok(commonUnits[era], `общий пул эпохи ${era} («${Campaign.ERAS[era]}») обязан существовать`);
    assert.ok(commonUnits[era].length >= 3, `общий пул эпохи ${era} должен закрывать unit/spell/structure`);
    const types = commonUnits[era].map(entry => entry.type);
    for (const type of ['unit', 'spell', 'structure']) assert.ok(types.includes(type), `в общем пуле эпохи ${era} нет типа ${type}`);
    for (const entry of [...(cultureUnits[era] ? Object.values(cultureUnits[era]).flat() : []), ...commonUnits[era]]) {
      assert.ok(['unit', 'spell', 'structure'].includes(entry.type), 'тип замысла поддержан кузнецом');
      assert.ok(entry.title && entry.title.length > 3, 'у замысла есть название');
      assert.ok(entry.pitch && entry.pitch.length > 8, 'у замысла есть образ');
    }
  }
  // Пулы должны быть привязаны к реальным культурам из модели, иначе игрок их просто не увидит.
  // Культура может встречаться в пуле своей эпохи и в более поздних — это и есть «эволюция наследия»
  // (ямники → скифы → рыцари степи → казаки → танковые кочевья). Анахронизм — культура в пуле
  // эпохи РАНЬШЕ её собственной.
  for (const [era, byCulture] of Object.entries(cultureUnits)) {
    for (const cultureId of Object.keys(byCulture)) {
      const culture = Campaign.HISTORICAL_CULTURES.find(item => item.id === cultureId);
      assert.ok(culture, `в пуле эпохи ${era} неизвестная культура ${cultureId}`);
      assert.ok(Number(era) >= culture.era,
        `анахронизм: «${culture.name}» относится к эпохе ${culture.era} (${Campaign.ERAS[culture.era]}), но лежит в пуле эпохи ${era} (${Campaign.ERAS[era]})`);
    }
    // В каждой эпохе должны быть и её собственные представители, а не только потомки древних культур.
    const natives = Object.keys(byCulture).filter(id => Campaign.HISTORICAL_CULTURES.find(item => item.id === id).era === Number(era));
    assert.ok(natives.length >= (Number(era) === 0 ? 3 : 4),
      `в пуле эпохи ${era} («${Campaign.ERAS[era]}») слишком мало собственных культур: ${natives.join(', ') || 'нет'}`);

    // Ни одна культура эпохи не должна выпадать в общий пул: у каждой есть собственный набор замыслов.
    const ownEraCultures = Campaign.HISTORICAL_CULTURES.filter(culture => culture.era === Number(era));
    for (const culture of ownEraCultures) {
      const pool = byCulture[culture.id];
      assert.ok(pool && pool.length > 0,
        `«${culture.name}» (эпоха ${era}, ${Campaign.ERAS[era]}) не имеет собственного пула кузнеца в legacy.html`);
      for (const item of pool) {
        assert.ok(['unit', 'spell', 'structure'].includes(item.type), `${culture.id}: неизвестный тип ${item.type}`);
        assert.ok(item.title && item.pitch, `${culture.id}: замысел без названия или описания`);
      }
    }
  }
  // Симптом прежнего рассинхрона: пул «Средневековья» содержал ассирийскую пехоту.
  assert.ok(!Object.keys(cultureUnits[2] || {}).includes('assyria'), 'Ассирия — культура Античного мира, а не Средневековья');
});

test('ветви науки открываются по индексам ERAS и дают новые технологии в каждой эпохе', () => {
  for (const branch of Campaign.SCIENCE_BRANCHES) {
    assert.ok(Number.isInteger(branch.minEra) && branch.minEra >= 0 && branch.minEra < Campaign.ERAS.length,
      `${branch.id}: minEra обязан быть индексом ERAS`);
  }
  const minEraOf = id => Campaign.SCIENCE_BRANCHES.find(branch => branch.id === id).minEra;
  assert.equal(minEraOf('bronze'), 1, 'бронза Аккада — технология Античного мира');
  assert.equal(minEraOf('metallurgy'), 1);
  assert.equal(minEraOf('writing'), 1);
  assert.equal(minEraOf('guilds'), 2, 'цеховые уставы — Средневековье');
  assert.equal(minEraOf('gunpowder'), 3, 'пороховая артиллерия — Ренессанс');
  assert.equal(minEraOf('steam'), 4, 'пар — Эпоха Пара и Стали');
  assert.equal(minEraOf('aviation'), 5, 'авиация — Новейшее время');
  assert.equal(minEraOf('computing'), 6, 'вычислительные машины — Будущее');
  assert.ok(minEraOf('horse') <= 0, 'кони Ямной — Каменный век');
});
