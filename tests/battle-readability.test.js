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
function setupFourCardHands(b) {
    for (const side of ['me', 'enemy']) {
        const player = b[side];
        const target = Math.min(4, player.hand.length + player.deck.length);
        while (player.hand.length < target) player.hand.push(player.deck.shift());
    }
    return b;
}

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
    const b = setupFourCardHands(battle.createBattle(deck, CFG(), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }));
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
    const b = setupFourCardHands(battle.createBattle(deck, CFG(), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }));
    const hp = () => [b.me.hp, b.enemy.hp].join('|');
    for (let round = 0; round < 4 && !b.over; round++) { battle.beginEnemyTurn(b); battle.beginPlayerTurn(b); }
    assert.equal(hp(), '5|5', 'no fatigue damage through turn five');
    battle.beginEnemyTurn(b); battle.beginPlayerTurn(b);
    const afterFiveRounds = [b.me.hp, b.enemy.hp];
    assert.ok(afterFiveRounds[0] < 5, 'the player feels fatigue from turn six');
    battle.beginEnemyTurn(b); battle.beginPlayerTurn(b);
    assert.ok(b.enemy.hp < 5, 'the enemy feels fatigue from turn six too');
});
