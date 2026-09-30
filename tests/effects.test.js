const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'legacy.html'), 'utf8');
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
const drawEngine = extract('    // -------- ДРО КАРТ --------', '    // -------- ЛОГ --------');
const selectedDeckHelper = extract('    function getSelectedDeckCards() {', '    // -------- Старт боя --------');
const startBattleFunction = extract('    function startBattle() {', '    function concedeBattle() {');
const eraRules = extract("    const ERA_ANCIENT = 'ancient';", '    let collection =');
const resolveHitFunction = extract('    function resolveHit(attacker, target, baseDmg, atkSide) {', '    function _unitPos(u) {');

function makeHitHarness() {
    const prelude = `
        const MAX_ENERGY = 10;
        let battle = {
            me: { energy: 0, energyMax: 10, energyCap: 10 },
            enemy: { energy: 0, energyMax: 10, energyCap: 10 }
        };
        function hasKw(unit, keyword) { return !!unit?.statuses?.[keyword]; }
        function adjustEnergy(side, amount) {
            const p = battle[side];
            const before = p.energy;
            p.energy = Math.max(0, Math.min(p.energyMax, before + amount));
            return p.energy - before;
        }
        function getUnitArmor(unit) { return unit?.statuses?.armor || 0; }
        function _hasFlankNeighbors() { return false; }
        function logBattle() {}
    `;
    const context = vm.createContext({ console, Math });
    vm.runInContext(`${prelude}\n${eraRules}\n${resolveHitFunction}\n` +
        `globalThis.api = { resolveHit, getBattle: () => battle, setBattle: value => { battle = value; } };`, context, { timeout: 1000 });
    return context.api;
}

function makeBattle() {
    const player = () => ({
        hp: 25, energy: 0, energyMax: 12, energyCap: 12, energyGrowth: 1, energyGrowthBlockedNext: 0,
        hand: [], deck: [], discard: [], fatigue: 0, front: [null, null, null], back: [null, null, null]
    });
    return { me: player(), enemy: player(), log: [], whoseTurn: 'me', turn: 1, turnCounters: { me:1, enemy:0 }, playerOrder: ['me','enemy'], nextCardPlayOrder: 0 };
}

function makeHarness(battle = makeBattle()) {
    const prelude = `
        const MAX_HP = 30;
        const MAX_ENERGY = 10;
        const HAND_LIMIT = 7;
        let idCounter = 0;
        function uid() { return 'test-' + (++idCounter); }
        let battle = ${JSON.stringify(battle)};
        let pendingManualTarget = null;
        let pendingCardChoice = null;
        let effectTaskQueue = [];
        let activeEffectTask = null;
        let effectPumpActive = false;
        let effectQueueWaiters = [];
        function logBattle(msg, cls = '') { battle.log.unshift({ msg, cls }); }
        function renderBattle() {}
        function renderCardChoiceModal() {}
        function hasKw(unit, keyword) { return !!unit?.statuses?.[keyword]; }
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
            confirmCardChoice,
            skipCardChoice,
            toggleCardChoice,
            moveScryCard,
            expireTemporaryModifiers,
            effectConditionPasses,
            currentEnergy,
            adjustEnergy,
            applyEnergyKeywordsOnPlay,
            getUnitAttack,
            getUnitArmor,
            getUnitActionCost,
            getBattle: () => battle,
            drawCard,
            getPending: () => pendingManualTarget,
            getCardChoice: () => pendingCardChoice,
            setBattle: value => { battle = value; },
        };
    `;
    const context = vm.createContext({ console: { error() {} }, setTimeout, clearTimeout });
    vm.runInContext(`${prelude}\n${effectsEngine}\n${drawEngine}\n${deathCleanup}\n${exportApi}`, context, { timeout: 1000 });
    return context.api;
}

function makeBattleStartHarness(cardCount, campaignMode = false, opponentDeck = null) {
    const cards = Array.from({ length: cardCount }, (_, index) => ({
        id: `card-${index}`, name: `Card ${index}`, card_type: 'unit', hp: 2, atk: 1
    }));
    const ids = cards.map(card => card.id);
    const campaign = campaignMode ? { CampaignMvp: {
        hasPendingMatch: () => true,
        getBattleConfigForCurrentPlayer: () => ({ deckLimit: 2, hp: 5, energyMax: 2, energyGrowth: 1 }),
        getOpponentBattleConfig: () => ({ deckLimit: opponentDeck?.length || 2, hp: opponentDeck ? 7 : 5, energyMax: opponentDeck ? 4 : 2, energyGrowth: opponentDeck ? 2 : 1 }),
        ...(opponentDeck ? { getOpponentBattleDeck: () => opponentDeck } : {}),
        getPendingMatch: () => ({ opponentId: 'dummy' }),
        getState: () => ({ opponents: [{ id: 'dummy', era: 0 }] }),
        getBattleDeckIds: () => [],
        consumePendingMatch: () => ({ opponentId: 'dummy', name: 'AI dummy', clan: 'Test clan' })
    } } : null;
    const context = vm.createContext(campaign ? { window: campaign } : {});
    vm.runInContext(`
        let deck = ${JSON.stringify(ids)};
        let collection = ${JSON.stringify(cards)};
        let battle = null;
        let pendingManualTarget = null, pendingCardChoice = null, effectTaskQueue = [], activeEffectTask = null;
        let effectPumpActive = false, effectQueueWaiters = [];
        let selectedHandIdx = null, selectedUnitId = null, awaitingTarget = false, animating = false;
        const DECK_LIMIT = 10, MAX_HP = 20, FRONT_SLOTS = 4, BACK_SLOTS = 4;
        const ENERGY_PER_TURN = 1, MAX_ENERGY = 10, START_HAND = 0;
        const screens = [];
        const localStorage = { getItem: () => 'Arena tester' };
        const document = { getElementById: () => ({ textContent: '' }) };
        function hideModals() {}
        function switchScreen(screen) { screens.push(screen); }
        function shuffle(cards) { return cards; }
        function cloneDeckCards(cards) { return cards.map(card => ({ ...card })); }
        function buildEnemyDeck() { return ${JSON.stringify(Array.from({ length: 10 }, (_, index) => ({ id: `starter-${index}`, name: `Starter ${index}` })))}; }
        function drawCard() {}
        function logBattle() {}
        function renderBattle() {}
        ${selectedDeckHelper}
        ${startBattleFunction}
        globalThis.api = { startBattle, getBattle: () => battle, getScreens: () => screens };
    `, context, { timeout: 1000 });
    return context.api;
}

test('unit-versus-unit hits use the declared era multiplier and reduce health', () => {
    const api = makeHitHarness();
    const attacker = { name: 'Племенные копейщики', era: 'ancient', statuses: {} };
    const target = { name: 'Дружина', era: 'ancient', currentHp: 5, hp: 5, statuses: {}, isStructure: false };

    assert.equal(api.resolveHit(attacker, target, 2, 'me'), 2);
    assert.equal(target.currentHp, 3);
    assert.equal(target.justDamaged, true);
});

test('bronze-era hits gain damage while ancient hits are reduced against bronze', () => {
    const api = makeHitHarness();
    const bronzeTarget = { era: 'bronze', currentHp: 5, hp: 5, statuses: {}, isStructure: false };
    const ancientTarget = { era: 'ancient', currentHp: 5, hp: 5, statuses: {}, isStructure: false };

    assert.equal(api.resolveHit({ era: 'bronze', statuses: {} }, ancientTarget, 2, 'me'), 3);
    assert.equal(api.resolveHit({ era: 'ancient', statuses: {} }, bronzeTarget, 2, 'enemy'), 1);
});

test('unit-vs-unit hit still applies armor and pierce after era modifiers', () => {
    const api = makeHitHarness();
    const target = { era: 'ancient', currentHp: 5, hp: 5, statuses: { armor: 2 }, isStructure: false };
    const attacker = { era: 'bronze', statuses: { pierce: 1 } };

    assert.equal(api.resolveHit(attacker, target, 2, 'me'), 2);
    assert.equal(target.currentHp, 3);
});

test('a complete ten-card deck starts battle without a runtime error', () => {
    const api = makeBattleStartHarness(10);
    assert.doesNotThrow(() => api.startBattle());
    assert.equal(api.getBattle().me.deck.length, 10);
    assert.equal(api.getBattle().me.energy, 1);
    assert.equal(api.getBattle().me.energyMax, 1);
    assert.equal(api.getBattle().me.energyCap, 10);
    assert.equal(api.getBattle().me.energyGrowth, 1);
    assert.equal(api.getBattle().me.actionMana, undefined);
    assert.equal(api.getScreens().at(-1), 'battle');
});

test('an incomplete deck is sent back to deck building instead of entering battle', () => {
    const api = makeBattleStartHarness(9);
    assert.doesNotThrow(() => api.startBattle());
    assert.equal(api.getBattle(), null);
    assert.equal(api.getScreens().at(-1), 'deck');
});

test('campaign practice uses the building-defined two-card deck and starter fillers', () => {
    const api = makeBattleStartHarness(0, true);
    assert.doesNotThrow(() => api.startBattle());
    assert.equal(api.getBattle().mode, 'campaign');
    assert.equal(api.getBattle().me.deck.length, 2);
    assert.equal(api.getBattle().enemy.deck.length, 2);
    assert.equal(api.getBattle().me.hp, 5);
    assert.equal(api.getBattle().enemy.hp, 5);
    assert.equal(api.getBattle().me.energy, 1);
    assert.equal(api.getBattle().me.energyMax, 1);
    assert.equal(api.getBattle().me.energyCap, 2);
    assert.equal(api.getBattle().me.energyGrowth, 1);
    assert.equal(api.getBattle().me.actionMana, undefined);
    assert.equal(api.getBattle().campaignMatch.opponentId, 'dummy');
    assert.equal(api.getScreens().at(-1), 'battle');
});

test('legacy campaign battle uses the opponent-specific deck and battle profile', () => {
    const opponentDeck = Array.from({ length: 4 }, (_, index) => ({
        id: `barbarian-${index}`, name: `River card ${index}`, card_type: 'unit',
    }));
    const api = makeBattleStartHarness(0, true, opponentDeck);
    assert.doesNotThrow(() => api.startBattle());
    assert.deepEqual(api.getBattle().enemy.deck.map(card => card.name), opponentDeck.map(card => card.name));
    assert.equal(api.getBattle().enemy.energyCap, 4);
    assert.equal(api.getBattle().enemy.energyGrowth, 2);
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

test('legacy deploy keywords change the shared energy pool on the intended sides', () => {
    const api = makeHarness();
    const battle = api.getBattle();
    battle.me.energy = 0;
    battle.me.energyMax = 1;
    battle.me.energyCap = 3;
    battle.enemy.energy = 1;
    battle.enemy.energyMax = 2;
    battle.enemy.energyCap = 3;

    api.applyEnergyKeywordsOnPlay({ name: 'Снабженец', statuses: {
        supply: true, warcry: true, harras: true, exhaustenemy: true
    } }, 'me');

    assert.equal(battle.me.energy, 2, 'supply and warcry both replenish the common pool');
    assert.equal(battle.me.energyMax, 2, 'supply raises the available energy maximum');
    assert.equal(battle.enemy.energy, 0, 'exhaustenemy drains the opponent common pool');
    assert.equal(battle.enemy.energyGrowthBlockedNext, 1, 'harras blocks the opponent next energy growth');

    api.applyEnergyKeywordsOnPlay({ name: 'Приказ снабжения', keywords: ['supply', 'warcry', 'exhaustenemy'] }, 'enemy');
    assert.equal(battle.enemy.energy, 2, 'spell energy keywords read their raw keyword list and use the same pool');
    assert.equal(battle.enemy.energyMax, 3);
    assert.equal(battle.me.energy, 1);
});

test('legacy drop/action resource labels both target and test the same owner or opponent energy', async () => {
    const api = makeHarness();
    const battle = api.getBattle();
    battle.me.energy = 1;
    battle.enemy.energy = 0;
    const effects = [
        {
            event: 'enter_play',
            target: { side: 'controller', entity: 'player' },
            condition: { type: 'resource', side: 'controller', resource: 'action', op: 'eq', value: 1 },
            action: { type: 'modify_resource', resource: 'drop', amount: 1 }
        },
        {
            event: 'enter_play',
            target: { side: 'opponent', entity: 'player' },
            condition: { type: 'resource', side: 'controller', resource: 'drop', op: 'eq', value: 2 },
            action: { type: 'modify_resource', resource: 'action', amount: 2 }
        }
    ];
    const [normalized] = api.validateEffects(effects);
    assert.equal(normalized.action.resource, 'energy');
    assert.equal(normalized.condition.resource, 'energy');
    const [canonical] = api.validateEffects([{
        event: 'enter_play', target: { side: 'controller', entity: 'player' },
        condition: { type: 'resource', side: 'controller', resource: 'energy', op: 'gte', value: 1 },
        action: { type: 'modify_resource', resource: 'energy', amount: 1 }
    }]);
    assert.equal(canonical.action.resource, 'energy');
    assert.equal(canonical.condition.resource, 'energy');

    api.resolveCardEffects({ name: 'Общий запас', effects }, 'enter_play', 'me');
    await api.waitForEffectQueue();

    assert.equal(battle.me.energy, 2);
    assert.equal(battle.enemy.energy, 2);
});

test('raider and loot transfer energy from an enemy unit through the shared pool', () => {
    const api = makeHitHarness();
    const battle = api.getBattle();
    battle.me.energy = 1;
    battle.me.energyMax = 3;
    battle.enemy.energy = 1;
    battle.enemy.energyMax = 3;
    const attacker = { name: 'Налётчик', era: 'ancient', statuses: { raider: true, loot: true } };
    const target = { name: 'Караванщик', era: 'ancient', currentHp: 1, hp: 1, statuses: {}, isStructure: false };

    api.resolveHit(attacker, target, 1, 'me');

    assert.equal(target.currentHp, 0);
    assert.equal(battle.enemy.energy, 0);
    assert.equal(battle.me.energy, 3, 'steal and kill bonuses add energy to the attacker before its attack cost');
});

test('a runtime card-effect error cannot wedge the queue or block later effects', async () => {
    const api = makeHarness();
    const battle = api.getBattle();
    const broken = unit('Broken effect');
    Object.defineProperty(broken, 'effects', { get() { throw new Error('simulated malformed runtime data'); } });

    assert.doesNotThrow(() => api.resolveCardEffects(broken, 'enter_play', 'enemy'));
    const followUp = unit('Follow-up effect', 'me', 'front', {
        effects: [{
            event: 'enter_play',
            target: { side: 'controller', entity: 'player' },
            action: { type: 'modify_resource', resource: 'drop', amount: 1 }
        }]
    });
    assert.doesNotThrow(() => api.resolveCardEffects(followUp, 'enter_play', 'me'));
    await api.waitForEffectQueue();

    assert.equal(battle.me.energy, 1);
    assert.equal(api.getPending(), null);
    assert.ok(battle.log.some(entry => entry.msg.includes('Broken effect')));
});

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
    battle.me.deck.push({ id: 'already-on-top', name: 'Карта сверху', card_type: 'unit', drop_cost: 1 });
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

    assert.equal(battle.me.energy, 4, JSON.stringify(battle.log)); // own death effect + all + friendly
    assert.equal(battle.enemy.energy, 7, JSON.stringify(battle.log)); // all + enemy relative to the enemy watcher
    assert.equal(battle.me.back[1], null);
    assert.equal(doomed._deathQueued, true);
    assert.equal(battle.me.deck.length, 2);
    assert.equal(battle.me.deck[0].name, 'Карта сверху');
    assert.equal(battle.me.deck[1].name, 'doomed');
    assert.equal(battle.me.deck[1].card_type, 'structure');
    assert(battle.log.some(entry => entry.msg.includes('doomed погибает и возвращается под колоду')));
    api.drawCard('me');
    assert.equal(battle.me.hand[0].name, 'Карта сверху');
    api.drawCard('me');
    assert.equal(battle.me.hand[1].name, 'doomed');
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
            .filter(msg => msg.includes('энергии'))
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
    assert.equal(battle.me.energy, 1);
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
    assert.equal(battle.enemy.energy, 2);
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

test('the effect DSL validates draw, discard, exchange, scry and temporary duration bounds', () => {
    const api = makeHarness();
    const target = { side: 'controller', entity: 'player' };
    const types = [
        { action:{ type:'draw', amount:2 }, target },
        { action:{ type:'discard', amount:1, choice:'choose' }, target },
        { action:{ type:'exchange', amount:2, choice:'highest_cost' }, target },
        { action:{ type:'scry', amount:3 }, target },
        { action:{ type:'modify_stat', stat:'attack', amount:2, turns:1 }, target:{side:'controller',entity:'unit'} },
        { action:{ type:'modify_stat', stat:'armor', amount:-1, turns:3 }, target:{side:'controller',entity:'unit'} },
        { action:{ type:'modify_cost', cost:'action', amount:-1, turns:2 }, target:{side:'controller',entity:'unit'} },
    ];
    for (const entry of types) {
        const [validated] = api.validateEffects([{ event:'enter_play', target:entry.target, action:entry.action }]);
        assert.equal(validated.action.type, entry.action.type);
    }
    assert.throws(() => api.validateEffects([{ event:'enter_play', target, action:{ type:'draw', amount:6 } }]));
    assert.throws(() => api.validateEffects([{ event:'enter_play', target, action:{ type:'discard', amount:1, choice:'random' } }]));
    assert.throws(() => api.validateEffects([{ event:'enter_play', target, action:{ type:'modify_stat', stat:'max_hp', amount:1, turns:1 } }]));
    assert.throws(() => api.validateEffects([{ event:'enter_play', target:{ side:'either', entity:'player' }, action:{ type:'draw', amount:1 } }]));
    assert.throws(() => api.validateEffects([{ event:'enter_play', target:{ side:'controller', entity:'unit' }, action:{ type:'scry', amount:1 } }]));
});

test('draw effects take available cards and empty-deck fatigue escalates 1, 2, 3', () => {
    const battle = makeBattle();
    battle.me.deck = [
        { name:'Дозор', card_type:'unit', drop_cost:1, atk:1, hp:2 },
        { name:'Обоз', card_type:'unit', drop_cost:2, atk:1, hp:2 },
    ];
    const api = makeHarness(battle);
    const card = { name:'Припасы', effects:[{
        event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'draw', amount:2 }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(Array.from(api.getBattle().me.hand, c => c.name).join('|'), 'Дозор|Обоз');
    assert.equal(api.getBattle().me.deck.length, 0);
    assert.equal(api.getBattle().me.fatigue, 0);

    const emptyBattle = makeBattle();
    const emptyApi = makeHarness(emptyBattle);
    emptyApi.resolveCardEffects(card,'enter_play','me');
    assert.equal(emptyApi.getBattle().me.fatigue, 2);
    assert.equal(emptyApi.getBattle().me.hp, 22);
    emptyApi.resolveCardEffects(card,'enter_play','me');
    assert.equal(emptyApi.getBattle().me.fatigue, 4);
    assert.equal(emptyApi.getBattle().me.hp, 15);
});

test('overfilling the hand consumes cards into discard instead of causing fatigue', () => {
    const battle = makeBattle();
    battle.me.hand = Array.from({ length:7 }, (_,index) => ({ name:`В руке ${index}`, drop_cost:1 }));
    battle.me.deck = [{ name:'Сверх лимита I' },{ name:'Сверх лимита II' }];
    const api = makeHarness(battle);
    const card = { name:'Изобилие', effects:[{
        event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'draw', amount:2 }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getBattle().me.hand.length, 7);
    assert.equal(api.getBattle().me.deck.length, 0);
    assert.equal(Array.from(api.getBattle().me.discard, c => c.name).join('|'), 'Сверх лимита I|Сверх лимита II');
    assert.equal(api.getBattle().me.fatigue, 0);
});

test('manual discard pauses the queue, then commits the selected hand card', () => {
    const battle = makeBattle();
    battle.me.hand = [
        { name:'Дешёвый манёвр', drop_cost:1 },
        { name:'Редкая колесница', drop_cost:5 },
        { name:'Копейщик', drop_cost:2 },
    ];
    const api = makeHarness(battle);
    const card = { name:'Обменный торг', effects:[
        { event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'discard', amount:1, choice:'choose' } },
        { event:'enter_play', action:{ type:'modify_resource', resource:'drop', amount:1 } },
    ] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getCardChoice().kind, 'discard');
    assert.equal(api.getBattle().me.energy, 0, 'later effects wait for the card choice');
    api.toggleCardChoice(1);
    api.confirmCardChoice();
    assert.equal(Array.from(api.getBattle().me.hand, c => c.name).join('|'), 'Дешёвый манёвр|Копейщик');
    assert.equal(Array.from(api.getBattle().me.discard, c => c.name).join('|'), 'Редкая колесница');
    assert.equal(api.getBattle().me.energy, 1);
    assert.equal(api.getCardChoice(), null);
});

test('exchange draws before choosing a discard and skip restores deck, hand and fatigue', () => {
    const battle = makeBattle();
    battle.me.hand = [{ name:'Старый щит', drop_cost:1 }];
    battle.me.deck = [{ name:'Новый разведчик', drop_cost:2 }];
    const api = makeHarness(battle);
    const card = { name:'Перетряска', effects:[{
        event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'exchange', amount:1, choice:'choose' }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(Array.from(api.getBattle().me.hand, c => c.name).join('|'), 'Старый щит|Новый разведчик');
    assert.equal(api.getCardChoice().min, 1);
    api.toggleCardChoice(0);
    api.confirmCardChoice();
    assert.equal(Array.from(api.getBattle().me.hand, c => c.name).join('|'), 'Новый разведчик');
    assert.equal(Array.from(api.getBattle().me.discard, c => c.name).join('|'), 'Старый щит');

    const skipBattle = makeBattle();
    skipBattle.me.hand = [{ name:'Старый щит', drop_cost:1 }];
    skipBattle.me.deck = [{ name:'Новый разведчик', drop_cost:2 }];
    const skipApi = makeHarness(skipBattle);
    skipApi.resolveCardEffects(card,'enter_play','me');
    skipApi.skipCardChoice();
    assert.equal(Array.from(skipApi.getBattle().me.hand, c => c.name).join('|'), 'Старый щит');
    assert.equal(Array.from(skipApi.getBattle().me.deck, c => c.name).join('|'), 'Новый разведчик');
    assert.equal(skipApi.getBattle().me.fatigue, 0);
});

test('scry lets the player reorder revealed cards and put selected ones on the bottom', () => {
    const battle = makeBattle();
    battle.me.deck = [
        { name:'Верхняя карта', drop_cost:1 },
        { name:'Ненужная дорогая', drop_cost:6 },
        { name:'Следующая', drop_cost:2 },
    ];
    const api = makeHarness(battle);
    const card = { name:'Разведка тропы', effects:[{
        event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'scry', amount:3 }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getCardChoice().kind, 'scry');
    api.toggleCardChoice(2);
    api.moveScryCard(1,-1);
    api.confirmCardChoice();
    assert.equal(Array.from(api.getBattle().me.deck, c => c.name).join('|'), 'Ненужная дорогая|Верхняя карта|Следующая');
});

test('AI hand choices are deterministic and discard the highest-cost card', () => {
    const battle = makeBattle();
    battle.enemy.hand = [{ name:'Дешёвый', drop_cost:1 },{ name:'Тяжёлый', drop_cost:5 }];
    const api = makeHarness(battle);
    const card = { name:'Набег', effects:[{
        event:'enter_play', target:{ side:'opponent', entity:'player' }, action:{ type:'discard', amount:1, choice:'choose' }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getCardChoice(), null);
    assert.equal(Array.from(api.getBattle().enemy.hand, c => c.name).join('|'), 'Дешёвый');
    assert.equal(Array.from(api.getBattle().enemy.discard, c => c.name).join('|'), 'Тяжёлый');
});

test('temporary attack, armor and action-cost modifiers expire at the correct owner turn', () => {
    const battle = makeBattle();
    battle.turnCounters = { me:1, enemy:0 };
    const warrior = place(battle, unit('Воин', 'me', 'front', { atk:2, currentAtk:2, action_cost:2 }), 'me','front',0);
    const api = makeHarness(battle);
    const innerWarrior = api.getBattle().me.front[0];
    const card = { name:'Команда полководца', effects:[
        { event:'enter_play', target:{ side:'friendly', entity:'unit', select:'first' }, action:{ type:'modify_stat', stat:'attack', amount:2, turns:1 } },
        { event:'enter_play', target:{ side:'friendly', entity:'unit', select:'first' }, action:{ type:'modify_stat', stat:'armor', amount:1, turns:1 } },
        { event:'enter_play', target:{ side:'friendly', entity:'unit', select:'first' }, action:{ type:'modify_cost', cost:'action', amount:-1, turns:1 } },
    ] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getUnitAttack(innerWarrior), 4);
    assert.equal(innerWarrior.atk, 2, 'temporary attack does not overwrite base attack');
    assert.equal(api.getUnitArmor(innerWarrior), 1);
    assert.equal(api.getUnitActionCost(innerWarrior), 1);
    api.getBattle().turnCounters.me = 2;
    api.expireTemporaryModifiers('me');
    assert.equal(api.getUnitAttack(innerWarrior), 2);
    assert.equal(api.getUnitArmor(innerWarrior), 0);
    assert.equal(api.getUnitActionCost(innerWarrior), 2);
});

test('lethal fatigue stops the remaining exchange draw and does not open a discard prompt', () => {
    const battle = makeBattle();
    battle.me.hp = 1;
    const api = makeHarness(battle);
    const card = { name:'Рискованный обмен', effects:[{
        event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'exchange', amount:3, choice:'choose' }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getBattle().me.hp, 0);
    assert.equal(api.getBattle().me.fatigue, 1);
    assert.equal(api.getCardChoice(), null);
});

test('exchange handles fewer deck cards than requested and discards only the cards available', () => {
    const battle = makeBattle();
    battle.me.hand = [{ name:'Старый отряд', drop_cost:1 }];
    battle.me.deck = [{ name:'Последняя карта', drop_cost:2 }];
    const api = makeHarness(battle);
    const card = { name:'Смена караула', effects:[{
        event:'enter_play', target:{ side:'controller', entity:'player' }, action:{ type:'exchange', amount:3, choice:'choose' }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getBattle().me.fatigue, 2);
    assert.equal(api.getBattle().me.hp, 22);
    assert.equal(api.getCardChoice().min, 2, 'discard count is capped by the actual hand size');
    api.toggleCardChoice(0);
    api.toggleCardChoice(1);
    api.confirmCardChoice();
    assert.equal(api.getBattle().me.hand.length, 0);
    assert.equal(api.getBattle().me.discard.length, 2);
});

test('temporary modifiers granted before an opponent turn last for that full turn', () => {
    const battle = makeBattle();
    place(battle, unit('Стража', 'enemy', 'front', { atk:1, currentAtk:1 }), 'enemy','front',0);
    const api = makeHarness(battle);
    const innerGuard = api.getBattle().enemy.front[0];
    const card = { name:'Подмога', effects:[{
        event:'enter_play', target:{ side:'opponent', entity:'unit', select:'first' }, action:{ type:'modify_stat', stat:'attack', amount:1, turns:1 }
    }] };
    api.resolveCardEffects(card,'enter_play','me');
    assert.equal(api.getUnitAttack(innerGuard), 2);
    api.getBattle().turnCounters.enemy = 1;
    api.expireTemporaryModifiers('enemy');
    assert.equal(api.getUnitAttack(innerGuard), 2, 'modifier remains through the next enemy turn');
    api.getBattle().turnCounters.enemy = 2;
    api.expireTemporaryModifiers('enemy');
    assert.equal(api.getUnitAttack(innerGuard), 1);
});

test('strong generated base stats remain intact instead of being capped to a power budget', () => {
    const api = makeHarness();
    const unit = { atk: 42, currentAtk: 42, action_cost: 17, statuses: { armor: 31 } };
    assert.equal(api.getUnitAttack(unit), 42);
    assert.equal(api.getUnitArmor(unit), 31);
    assert.equal(api.getUnitActionCost(unit), 17);
});
