const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('Could not find the app inline script');

const handoffStart = script.indexOf('    async function finishEnemyTurn() {');
const handoffEnd = script.indexOf('    async function startOfTurn(who) {', handoffStart);
if (handoffStart < 0 || handoffEnd < 0) throw new Error('Could not extract finishEnemyTurn');
const finishEnemyTurn = script.slice(handoffStart, handoffEnd);

function makeTurnHarness({ enemyFails = false, playerStartFails = false } = {}) {
    const context = vm.createContext({ console: { error() {} } });
    vm.runInContext(`
        let battle = { turn: 2, whoseTurn: 'enemy', _endScheduled: false, log: [] };
        let animating = true;
        let enemyCalls = 0;
        const startCalls = [];
        function logBattle(msg, cls = '') { battle.log.push({ msg, cls }); }
        async function runEnemyTurn() {
            enemyCalls++;
            ${enemyFails ? "throw new Error('simulated enemy AI failure');" : ''}
        }
        async function startOfTurn(side) {
            startCalls.push(side);
            ${playerStartFails ? "throw new Error('simulated player start failure');" : ''}
        }
        function renderBattle() { battle.rendered = (battle.rendered || 0) + 1; }
        ${finishEnemyTurn}
        globalThis.api = { finishEnemyTurn, getState: () => ({ battle, animating, enemyCalls, startCalls }) };
    `, context, { timeout: 1000 });
    return context.api;
}

test('an enemy AI exception returns control to the player instead of leaving the thinking state locked', async () => {
    const api = makeTurnHarness({ enemyFails: true });
    await assert.doesNotReject(api.finishEnemyTurn());

    const state = api.getState();
    assert.equal(state.enemyCalls, 1);
    assert.equal(state.battle.turn, 3);
    assert.equal(state.battle.whoseTurn, 'me');
    assert.equal(state.startCalls[0], 'me');
    assert.equal(state.animating, false);
    assert.equal(state.battle.rendered, 1);
    assert.match(state.battle.log[0].msg, /Ход врага прерван/);
});

test('a player start-of-turn error is reported but still releases the battle controls', async () => {
    const api = makeTurnHarness({ playerStartFails: true });
    await assert.doesNotReject(api.finishEnemyTurn());

    const state = api.getState();
    assert.equal(state.battle.whoseTurn, 'me');
    assert.equal(state.animating, false);
    assert.equal(state.battle.rendered, 1);
    assert.match(state.battle.log[0].msg, /Часть эффектов начала хода/);
});
