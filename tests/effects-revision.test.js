// Ревизия эффектов: мёртвые типы скрыты от генератора, новые эффекты реально работают.
// Жёсткие инварианты, чтобы генератор NPC/советника снова не начал продавать пустышки.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const vm = require('node:vm');

const M = require('../campaign.js');

function loadModule(entry) {
    const out = esbuild.buildSync({
        entryPoints: [path.join(__dirname, '..', entry)],
        bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent',
        loader: { '.ts': 'ts' }
    });
    const module = { exports: {} };
    const sandbox = { module, exports: module.exports, require, process, console, CampaignMvp: M };
    vm.runInNewContext(out.outputFiles[0].text, sandbox);
    return sandbox.module.exports;
}

test('phantom effects stay in the registry for old saves but leave the generator vocabulary', () => {
    assert.equal(M.EFFECTS.pop_growth.hidden, true, 'pop_growth has no consumer in the game');
    assert.equal(M.EFFECTS.defense_bonus.hidden, true, 'defense_bonus defends against raids that do not exist');
    assert.ok(!M.GENERATIVE_EFFECTS.includes('pop_growth'));
    assert.ok(!M.GENERATIVE_EFFECTS.includes('defense_bonus'));
    // ровно тот же список, простым фильтром без отдельного регистра
    assert.deepEqual(M.GENERATIVE_EFFECTS, Object.keys(M.EFFECTS).filter(k => !M.EFFECTS[k].hidden));
});

test('science prompts offer the reduced vocabulary, not the full registry', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'game', 'cards.ts'), 'utf8');
    assert.ok(!src.includes('Object.keys(M.EFFECTS)'), 'cards.ts must not hand the whole registry to the model');
    assert.ok(src.includes('M.GENERATIVE_EFFECTS'), 'cards.ts prompts use the curated list');
});

test('revision adds living effects the model could not sell before', () => {
    for (const key of ['fatigue_resist', 'active_building_slots', 'craft_quality']) {
        assert.ok(M.EFFECTS[key], `${key} exists in the registry`);
        assert.ok(M.GENERATIVE_EFFECTS.includes(key), `${key} is offered to the model`);
    }
});

test('active_building_slots raises the building slot cap once per capital project', () => {
    const state = M.createState('Проверка');
    assert.equal(M.normalizeState(state).player.activeBuildingSlots, 4, 'baseline is four slots');
    state.player.buildings.push({ id: 'cap1', name: 'Каменная усадьба', active: false, effects: [{ type: 'active_building_slots', amount: 1 }] });
    assert.equal(M.normalizeState(state).player.activeBuildingSlots, 5, 'built project unlocks the slot even while switched off');
    state.player.buildings.push({ id: 'cap2', name: 'Вторая усадьба', active: false, effects: [{ type: 'active_building_slots', amount: 1 }] });
    assert.equal(M.normalizeState(state).player.activeBuildingSlots, 5, 'the cap stays at five');
});

test('craft_quality raises the forge quality score when its building is active', () => {
    const state = M.createState('Проверка');
    const base = M.cardCraftQuote(state, {}).qualityScore;
    const forge = { id: 'forge1', name: 'Работа мастеров', active: false, effects: [{ type: 'craft_quality', amount: 1 }] };
    state.player.buildings.push(forge);
    const inactive = M.cardCraftQuote(state, {}).qualityScore;
    assert.equal(inactive, base, 'switched-off building grants nothing');
    forge.active = true;
    const active = M.cardCraftQuote(state, {}).qualityScore;
    assert.equal(active, Math.min(6, base + 1), 'active building raises quality by one');
});

test('fatigue_resist is passed into the battle config', () => {
    const battle = loadModule('src/game/battle.ts');
    const cards = loadModule('src/game/cards.ts');
    const militia = cards.buildMilitia();
    const CFG = (extra = {}) => ({ hp: 5, energyMax: 2, energyGrowth: 1, ...extra });
    const deck = militia.slice(0, 4);

    const baseline = battle.createBattle(deck, CFG(), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }, 0);
    for (let round = 0; round < 4 && !baseline.over; round++) { battle.beginEnemyTurn(baseline); battle.beginPlayerTurn(baseline); }
    battle.beginEnemyTurn(baseline); battle.beginPlayerTurn(baseline);
    assert.ok(baseline.me.hp < 5, 'without the effect fatigue reaches the player on its usual round');

    const reinforced = battle.createBattle(deck, CFG({ fatigueDelay: 1 }), battle.enemyDeckForEra(0, 4), CFG(), { kind: 'practice', name: 'Тренировка' }, 0);
    for (let round = 0; round < 5 && !reinforced.over; round++) { battle.beginEnemyTurn(reinforced); battle.beginPlayerTurn(reinforced); }
    assert.equal(reinforced.me.hp, 5, 'fatigue_resist holds the player past the usual round');
    battle.beginEnemyTurn(reinforced); battle.beginPlayerTurn(reinforced);
    assert.ok(reinforced.enemy.hp < 5, 'the enemy has no resist and still feels fatigue');
    if (!reinforced.over) { battle.beginEnemyTurn(reinforced); battle.beginPlayerTurn(reinforced); }
    assert.equal(reinforced.me.fatigueStart, 7, 'fatigue starts from turn seven for the player');
});

test('getBattleConfig derives fatigueDelay from active building effects', () => {
    const state = M.createState('Проверка');
    assert.equal(M.getBattleConfig(state).fatigueDelay, 0, 'no buildings, no delay');
    state.player.buildings.push({ id: 'wall1', name: 'Дозорная вышка', active: true, effects: [{ type: 'fatigue_resist', amount: 1 }] });
    assert.equal(M.getBattleConfig(state).fatigueDelay, 1, 'active building feeds the battle config');
});
