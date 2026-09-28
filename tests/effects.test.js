const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('Could not find the app inline script');

function extract(startMarker, endMarker) {
    const start = script.indexOf(startMarker);
    const end = script.indexOf(endMarker, start + startMarker.length);
    if (start < 0 || end < 0) throw new Error(`Could not extract section: ${startMarker}`);
    return script.slice(start, end);
}

const effectsEngine = extract(
    '    // ============================================\n    // ОГРАНИЧЕННЫЙ КОНСТРУКТОР ЭФФЕКТОВ',
    '    // ============================================\n    // ПРИМЕНЕНИЕ ЭФФЕКТОВ КАРТ В ВЫСАДКУ'
);
const deathCleanup = extract('    function cleanupDead() {', '    function checkBattleEnd() {');
const selectedDeckHelper = extract('    function getSelectedDeckCards() {', '    // -------- Старт боя --------');
const startBattleFunction = extract('    function startBattle() {', '    function concedeBattle() {');

function makeBattle() {
    const player = () => ({
        hp: 25, dropMana: 0, dropManaMax: 12, actionMana: 0, actionManaMax: 5,
        hand: [], deck: [], front: [null, null, null], back: [null, null, null]
    });
    return { me: player(), enemy: player(), log: [], whoseTurn: 'me', playerOrder: ['me','enemy'], nextCardPlayOrder: 0 };
}

function makeHarness(battle = makeBattle()) {
    const prelude = `
        const MAX_HP = 30;
        let battle = ${JSON.stringify(battle)};
        let pendingManualTarget = null;
        let effectTaskQueue = [];
        let activeEffectTask = null;
        let effectPumpActive = false;
        let effectQueueWaiters = [];
        function logBattle(msg, cls = '') { battle.log.unshift({ msg, cls }); }
        function renderBattle() {}
        function checkBattleEnd() { return false; }
        function _unitPos(unit) {
            for (const side of ['me','enemy']) for (const row of ['front','back']) {
                const index = battle[side][row].indexOf(unit);
                if (index >= 0) return { side, r:row, i:index };
            }
            return null;
        }
    `;
    const exportApi = `
        globalThis.api = {
            validateEffects,
            cardEffects,
            resolveCardEffects,
            chooseEffectUnit,
            chooseEffectPlayer,
            chooseEffectTarget,
            skipManualEffect,
            cleanupDead,
            queueUnitDeath,
            waitForEffectQueue,
            getBattle: () => battle,
            getPending: () => pendingManualTarget,
            setBattle: value => { battle = value; },
        };
    `;
    const context = vm.createContext({ console, setTimeout, clearTimeout });
    vm.runInContext(`${prelude}\n${effectsEngine}\n${deathCleanup}\n${exportApi}`, context, { timeout: 1000 });
    return context.api;
}

function makeBattleStartHarness(cardCount) {
    const cards = Array.from({ length: cardCount }, (_, index) => ({
        id: `card-${index}`, name: `Card ${index}`, card_type: 'unit', hp: 2, atk: 1
    }));
    const ids = cards.map(card => card.id);
    const context = vm.createContext({});
    vm.runInContext(`
        let deck = ${JSON.stringify(ids)};
        let collection = ${JSON.stringify(cards)};
        let battle = null;
        let pendingManualTarget = null, effectTaskQueue = [], activeEffectTask = null;
        let effectPumpActive = false, effectQueueWaiters = [];
        let selectedHandIdx = null, selectedUnitId = null, awaitingTarget = false, animating = false;
        const DECK_LIMIT = 10, MAX_HP = 20, FRONT_SLOTS = 4, BACK_SLOTS = 4;
        const STARTING_ACTION_MANA = 2, START_HAND = 0;
        const screens = [];
        const localStorage = { getItem: () => 'Arena tester' };
        const document = { getElementById: () => ({ textContent: '' }) };
        function hideModals() {}
        function switchScreen(screen) { screens.push(screen); }
        function shuffle(cards) { return cards; }
        function cloneDeckCards(cards) { return cards.map(card => ({ ...card })); }
        function buildEnemyDeck() { return []; }
        function drawCard() {}
        function logBattle() {}
        function renderBattle() {}
        ${selectedDeckHelper}
        ${startBattleFunction}
        globalThis.api = { startBattle, getBattle: () => battle, getScreens: () => screens };
    `, context, { timeout: 1000 });
    return context.api;
}

test('a complete ten-card deck starts battle without a runtime error', () => {
    const api = makeBattleStartHarness(10);
    assert.doesNotThrow(() => api.startBattle());
    assert.equal(api.getBattle().me.deck.length, 10);
    assert.equal(api.getScreens().at(-1), 'battle');
});

test('an incomplete deck is sent back to deck building instead of entering battle', () => {
    const api = makeBattleStartHarness(9);
    assert.doesNotThrow(() => api.startBattle());
    assert.equal(api.getBattle(), null);
    assert.equal(api.getScreens().at(-1), 'deck');
});

function unit(name, side = 'me', row = 'front', props = {}) {
    return {
        name, card_type: props.isStructure ? 'structure' : 'unit',
        hp: props.hp ?? 5, currentHp: props.currentHp ?? props.hp ?? 5,
        atk: 1, currentAtk: 1, isStructure: !!props.isStructure,
        statuses: {}, effects: props.effects ?? [],
        ...props
    };
}

function place(battle, card, side, row, index) {
    battle[side][row][index] = card;
    return card;
}

test('card_death watch accepts all, friendly and enemy, and rejects missing/unknown scopes', () => {
    const api = makeHarness();
    for (const side of ['all', 'friendly', 'enemy']) {
        const [effect] = api.validateEffects([{
            event: 'card_death', watch: { side },
            action: { type: 'modify_resource', resource: 'drop', amount: 1 }
        }]);
        assert.equal(effect.watch.side, side);
    }
    assert.throws(() => api.validateEffects([{
        event: 'card_death', action: { type: 'modify_resource', resource: 'drop', amount: 1 }
    }]));
    assert.throws(() => api.validateEffects([{
        event: 'card_death', watch: { side: 'all', extra: true },
        action: { type: 'modify_resource', resource: 'drop', amount: 1 }
    }]));
    assert.throws(() => api.validateEffects([{
        event: 'enter_play', watch: { side: 'all' },
        action: { type: 'modify_resource', resource: 'drop', amount: 1 }
    }]));
});

test('death observers distinguish all, own-side and opposing-side deaths', () => {
    const api = makeHarness();
    const battle = api.getBattle();
    const resourceEffect = (scope, amount) => [{
        event: 'card_death', watch: { side: scope },
        action: { type: 'modify_resource', resource: 'drop', amount }
    }];
    place(battle, unit('me all', 'me', 'front', { effects: resourceEffect('all', 1) }), 'me', 'front', 0);
    place(battle, unit('me friendly', 'me', 'front', { effects: resourceEffect('friendly', 2) }), 'me', 'front', 1);
    place(battle, unit('me enemy', 'me', 'back', { effects: resourceEffect('enemy', 4) }), 'me', 'back', 0);
    place(battle, unit('enemy all', 'enemy', 'front', { effects: resourceEffect('all', 2) }), 'enemy', 'front', 0);
    place(battle, unit('enemy friendly', 'enemy', 'front', { effects: resourceEffect('friendly', 3) }), 'enemy', 'front', 1);
    place(battle, unit('enemy enemy', 'enemy', 'back', { effects: resourceEffect('enemy', 5) }), 'enemy', 'back', 0);
    const doomed = place(battle, unit('doomed', 'me', 'back', {
        currentHp: 0,
        isStructure: true,
        effects: [
            { event: 'death', action: { type: 'modify_resource', resource: 'drop', amount: 1 } },
            ...resourceEffect('all', 5)
        ]
    }), 'me', 'back', 1);

    assert.doesNotThrow(() => api.validateEffects(doomed.effects));
    assert.equal(api.cardEffects(doomed).length, 2);
    api.cleanupDead();

    assert.equal(battle.me.dropMana, 4, JSON.stringify(battle.log)); // own death effect + all + friendly
    assert.equal(battle.enemy.dropMana, 7, JSON.stringify(battle.log)); // all + enemy relative to the enemy watcher
    assert.equal(battle.me.back[1], null);
    assert.equal(doomed._deathQueued, true);
    assert(battle.log.some(entry => entry.msg.includes('Твоя постройка doomed уничтожена')));
});

test('death triggers use active-player-first order and then earliest deployment within each side', () => {
    const collectOrder = activeSide => {
        const api = makeHarness();
        const battle = api.getBattle();
        battle.whoseTurn = activeSide;
        const watcher = (name, side, row, index, enteredOrder) => place(battle, unit(name, side, row, {
            _enteredPlayOrder: enteredOrder,
            effects: [{
                event: 'card_death', watch: { side: 'all' },
                action: { type: 'modify_resource', resource: 'drop', amount: 1 }
            }]
        }), side, row, index);
        watcher('me-old', 'me', 'front', 0, 1);
        watcher('me-new', 'me', 'back', 0, 3);
        watcher('enemy-old', 'enemy', 'front', 0, 2);
        watcher('enemy-new', 'enemy', 'back', 0, 4);
        place(battle, unit('doomed', 'me', 'back', {
            currentHp: 0,
            _enteredPlayOrder: 0,
            effects: [{ event: 'death', action: { type: 'modify_resource', resource: 'drop', amount: 1 } }]
        }), 'me', 'back', 2);

        api.cleanupDead();
        return [...battle.log].reverse().map(entry => entry.msg)
            .filter(msg => msg.includes('💎'))
            .map(msg => ['doomed','me-old','me-new','enemy-old','enemy-new'].find(name => msg.includes(name)));
    };

    assert.deepEqual(collectOrder('me'), ['doomed','me-old','me-new','enemy-old','enemy-new']);
    assert.deepEqual(collectOrder('enemy'), ['enemy-old','enemy-new','doomed','me-old','me-new']);
});

test('manual choose can select multiple distinct targets and applies only after selection is complete', () => {
    const api = makeHarness();
    const battle = api.getBattle();
    const a = place(battle, unit('A'), 'enemy', 'front', 0);
    const b = place(battle, unit('B'), 'enemy', 'front', 1);
    const c = place(battle, unit('C'), 'enemy', 'back', 0);
    api.resolveCardEffects({ name: 'Volley', effects: [{
        event: 'enter_play',
        target: { side: 'enemy', entity: 'unit', select: 'choose', count: 2 },
        action: { type: 'damage', amount: 1 }
    }] }, 'enter_play', 'me');

    assert.equal(api.getPending().candidates.length, 3);
    api.chooseEffectUnit('enemy', 'front', 0);
    assert.equal(api.getPending().selected.length, 1);
    assert.equal(api.getPending().candidates.length, 2);
    assert.equal(a.currentHp, 5); // no action until the requested choices are made
    api.chooseEffectUnit('enemy', 'front', 0); // the already-selected target is no longer selectable
    assert.equal(api.getPending().selected.length, 1);
    api.chooseEffectUnit('enemy', 'front', 1);

    assert.equal(api.getPending(), null);
    assert.equal(a.currentHp, 4);
    assert.equal(b.currentHp, 4);
    assert.equal(c.currentHp, 5);
});

test('manual choose can target both player banners for a multi-player effect', () => {
    const api = makeHarness();
    const battle = api.getBattle();
    api.resolveCardEffects({ name: 'Both chiefs', effects: [{
        event: 'enter_play',
        target: { side: 'either', entity: 'player', select: 'choose', count: 2 },
        action: { type: 'damage', amount: 1 }
    }] }, 'enter_play', 'me');

    api.chooseEffectPlayer('me');
    assert.equal(battle.me.hp, 25);
    assert.equal(api.getPending().candidates.length, 1);
    api.chooseEffectPlayer('enemy');

    assert.equal(api.getPending(), null);
    assert.equal(battle.me.hp, 24);
    assert.equal(battle.enemy.hp, 24);
});

test('skipping a multi-target choice cancels that effect and resumes later effects', () => {
    const api = makeHarness();
    const battle = api.getBattle();
    const a = place(battle, unit('A'), 'enemy', 'front', 0);
    const b = place(battle, unit('B'), 'enemy', 'front', 1);
    api.resolveCardEffects({ name: 'Choice', effects: [
        {
            event: 'enter_play',
            target: { side: 'enemy', entity: 'unit', select: 'choose', count: 2 },
            action: { type: 'damage', amount: 2 }
        },
        { event: 'enter_play', action: { type: 'modify_resource', resource: 'drop', amount: 1 } }
    ] }, 'enter_play', 'me');
    api.chooseEffectUnit('enemy', 'front', 0);
    api.skipManualEffect();

    assert.equal(api.getPending(), null);
    assert.equal(a.currentHp, 5);
    assert.equal(b.currentHp, 5);
    assert.equal(battle.me.dropMana, 1);
});

test('a lethal manually-selected action resolves the target death trigger before removal', async () => {
    const api = makeHarness();
    const battle = api.getBattle();
    const doomed = place(battle, unit('Doomed', 'enemy', 'front', {
        hp: 1, currentHp: 1,
        effects: [{ event: 'death', action: { type: 'modify_resource', resource: 'drop', amount: 2 } }]
    }), 'enemy', 'front', 0);
    api.resolveCardEffects({ name: 'Finisher', effects: [{
        event: 'enter_play',
        target: { side: 'enemy', entity: 'unit', select: 'choose' },
        action: { type: 'damage', amount: 1 }
    }] }, 'enter_play', 'me');
    api.chooseEffectUnit('enemy', 'front', 0);
    await api.waitForEffectQueue();

    assert.equal(battle.enemy.front[0], null);
    assert.equal(battle.enemy.dropMana, 2);
    assert.equal(doomed.currentHp, 0);
});

test('AI choose remains deterministic and multi-target effects take the first eligible cards', () => {
    const api = makeHarness();
    const battle = api.getBattle();
    const a = place(battle, unit('First'), 'enemy', 'front', 0);
    const b = place(battle, unit('Second'), 'enemy', 'front', 1);
    const c = place(battle, unit('Third'), 'enemy', 'back', 0);
    api.resolveCardEffects({ name: 'AI', effects: [{
        event: 'enter_play',
        target: { side: 'friendly', entity: 'unit', select: 'choose', count: 2 },
        action: { type: 'modify_stat', stat: 'attack', amount: 1 }
    }] }, 'enter_play', 'enemy');

    assert.equal(a.atk, 2);
    assert.equal(b.atk, 2);
    assert.equal(c.atk, 1);
});
