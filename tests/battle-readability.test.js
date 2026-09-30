const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

// Движок боя лежит в TS и тянет src/game/model.js (globalThis.CampaignMvp) —
// бандлим esbuild'ом прямо в тесте и подкладываем кампанийную модель в песочницу.
function loadBattle() {
    const esbuild = require('esbuild');
    const out = esbuild.buildSync({
        entryPoints: [path.join(__dirname, '..', 'src', 'game', 'battle.ts')],
        bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent',
        loader: { '.ts': 'ts' }
    });
    const module = { exports: {} };
    const sandbox = { module, exports: module.exports, require, process, console, CampaignMvp: require('../campaign.js') };
    vm.runInNewContext(out.outputFiles[0].text, sandbox);
    return sandbox.module.exports;
}

function loadModule(rel) {
    const esbuild = require('esbuild');
    const out = esbuild.buildSync({
        entryPoints: [path.join(__dirname, '..', rel)],
        bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent',
        loader: { '.ts': 'ts' }
    });
    const module = { exports: {} };
    const sandbox = { module, exports: module.exports, require, process, console, CampaignMvp: require('../campaign.js') };
    vm.runInNewContext(out.outputFiles[0].text, sandbox);
    return sandbox.module.exports;
}

const battle = loadBattle();
const militia = loadModule('src/game/cards.ts').buildMilitia();
const CFG = () => ({ hp: 5, energyMax: 2, energyGrowth: 1 });

test('enemy militia deck is renamed, same size and card schema as friendly militia', () => {
    const enemyDeck = battle.enemyDeckForEra(0, militia.length);
    assert.equal(enemyDeck.length, militia.length);
    const overlap = enemyDeck.filter(card => militia.some(friendly => friendly.name === card.name));
    assert.equal(overlap.length, 0, 'unit names must not collide between sides or the battle log is unreadable');
    for (const card of enemyDeck) {
        assert.ok(card.name && card.card_type && Number.isInteger(card.drop_cost), `${card.name} keeps the card schema`);
    }
});

test('battle log addresses the player in second person and reports initiative', () => {
    const deck = militia.slice(0, 4);
    const b = battle.createBattle(deck, CFG(), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }, 0);
    const lines = () => b.log.map(entry => String(entry.text));
    assert.ok(lines()[0].includes('Вы ходите первым'), 'initiative is announced');
    assert.ok(!lines().some(line => line.includes('Вы тянет ') || line.includes('Вы выводит')), 'no third-person verbs after «Вы»');
    for (let round = 0; round < 7 && !b.over; round++) { battle.beginEnemyTurn(b); battle.beginPlayerTurn(b); }
    const fatigueLines = lines().filter(line => line.includes('усталость'));
    assert.ok(fatigueLines.some(line => line.startsWith('Вы тянете')), 'player fatigue line uses second person');
    assert.ok(fatigueLines.some(line => line.startsWith('Враг тянет')), 'enemy fatigue line uses third person');
});

test('fatigue waits until turn six instead of killing micro-decks at turn four', () => {
    const deck = militia.slice(0, 4);
    const b = battle.createBattle(deck, CFG(), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }, 0);
    const hp = () => [b.me.hp, b.enemy.hp].join('|');
    for (let round = 0; round < 4 && !b.over; round++) { battle.beginEnemyTurn(b); battle.beginPlayerTurn(b); }
    assert.equal(hp(), '5|5', 'no fatigue damage through turn five');
    battle.beginEnemyTurn(b); battle.beginPlayerTurn(b);
    const afterFiveRounds = [b.me.hp, b.enemy.hp];
    assert.ok(afterFiveRounds[0] < 5, 'the player feels fatigue from turn six');
    battle.beginEnemyTurn(b); battle.beginPlayerTurn(b);
    assert.ok(b.enemy.hp < 5, 'the enemy feels fatigue from turn six too');
});

test('militia picker: chosen reserves fill empty slots first and are marked, spare pool tops up the rest', () => {
    const pool = militia;
    const byId = new Map(militia.slice(0, 2).map((card) => [card.id, card]));
    const onlyOne = battle.buildBattleDeck(byId, militia.slice(0, 1).map((c) => c.id), 4, pool, [pool[3].name, pool[5].name]);
    assert.equal(onlyOne.deck.length, 4, 'deck is filled up to the limit');
    // Массив приходит из vm-песочницы: сравниваем строки, а не прототипы разных realm'ов.
    assert.equal(onlyOne.deck.slice(1, 3).map((c) => c.name).join('|'), [pool[3].name, pool[5].name].join('|'), 'chosen reserves keep the player order');
    assert.equal(onlyOne.used, 3, 'every militia card is counted for the battle summary');
    assert.ok(onlyOne.deck.slice(1).every((c) => c.militia === true), 'militia cards are marked');
    const fullById = new Map(militia.slice(0, 3).map((card) => [card.id, card]));
    const full = battle.buildBattleDeck(fullById, militia.slice(0, 3).map((c) => c.id), 3, pool, [pool[3].name]);
    assert.equal(full.deck.length, 3);
    assert.equal(full.used, 0, 'a full deck keeps no room for reserves');
    const exhausted = battle.buildBattleDeck(byId, militia.slice(0, 1).map((c) => c.id), 4, pool, [pool[0].name]);
    assert.equal(new Set(exhausted.deck.map((c) => c.name)).size, exhausted.deck.length, 'no duplicate militia in the battle deck');
});

test('coach opening: first practice battle has no enemy structures and one extra energy on turn one', () => {
    const structures = battle.enemyDeckForEra(0, 8).filter((c) => c.card_type === 'structure');
    assert.ok(structures.length > 0, 'base enemy deck does contain structures');
    assert.equal(battle.withoutStructures(battle.enemyDeckForEra(0, 8)).some((c) => c.card_type === 'structure'), false);

    const b = battle.createBattle(militia.slice(0, 4), CFG(), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }, 0);
    assert.equal(b.me.energyMax, 1, 'without coaching the first turn gives one energy');
    battle.applyCoachOpening(b);
    assert.equal(b.me.energy, 2);
    assert.equal(b.me.energyMax, 2);
    assert.ok(b.log.some((entry) => /Обучение/.test(entry.text)), 'the coach bonus is announced in the log');
    battle.beginPlayerTurn(b);
    assert.equal(b.me.energyMax, 2, 'the bonus does not stack with the normal growth');
});
