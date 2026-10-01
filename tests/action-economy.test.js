const test = require('node:test');
const assert = require('node:assert/strict');
const Campaign = require('../campaign.js');

const TEST_SEED = 777;

function playableCampaign() {
    const state = Campaign.createState(TEST_SEED);
    state.player.onboardingComplete = true;
    return state;
}

function withBuilding(state, effects) {
    const s = Campaign.clone(state);
    s.player.buildings.push({
        id: 'test-building-' + Math.random().toString(36).slice(2),
        name: 'Испытательная постройка',
        description: '',
        category: 'civic',
        active: true,
        effects
    });
    return Campaign.normalizeState(s);
}

/* Баланс-ревизия: до этого ни одна постройка советника не могла поднять ни пул AP,
   ни дневной лимит повторения одного и того же приказа — игрок навсегда оставался
   с "2 AP на 4 ветки", сколько бы эпох ни прошло. */

test('without any ap_max/order_capacity building the economy stays at the historical 2 AP / 1-per-type baseline', () => {
    const state = playableCampaign();
    const normalized = Campaign.normalizeState(state);
    assert.equal(normalized.player.apMax, Campaign.AP_MAX);
    assert.equal(normalized.player.apMax, 2);
    assert.equal(Campaign.getOrderCapacity(normalized), 1);
});

test('an active ap_max building raises the daily AP pool, capped at +2 total', () => {
    const state = playableCampaign();
    const withOne = withBuilding(state, [{ type: 'ap_max', amount: 1 }]);
    assert.equal(withOne.player.apMax, Campaign.AP_MAX + 1, 'one building adds one AP');

    let stacked = withBuilding(state, [{ type: 'ap_max', amount: 1 }]);
    stacked.player.buildings.push({ id: 'second-ap', name: 'Вторая палата', active: true, effects: [{ type: 'ap_max', amount: 1 }] });
    stacked.player.buildings.push({ id: 'third-ap', name: 'Третья палата', active: true, effects: [{ type: 'ap_max', amount: 1 }] });
    stacked = Campaign.normalizeState(stacked);
    assert.equal(stacked.player.apMax, Campaign.AP_MAX + 2, 'three stacked buildings still cap out at +2 (apMax 4)');
});

test('ap_max only applies while the building is active, like other running effects (not permanent like active_building_slots)', () => {
    const state = playableCampaign();
    let s = withBuilding(state, [{ type: 'ap_max', amount: 1 }]);
    assert.equal(s.player.apMax, 3);
    s.player.buildings[s.player.buildings.length - 1].active = false;
    s = Campaign.normalizeState(s);
    assert.equal(s.player.apMax, 2, 'disabling the building drops the AP bonus, unlike active_building_slots');
});

test('an active order_capacity building raises the daily repeat limit for every order type to 2', () => {
    const state = playableCampaign();
    const s = withBuilding(state, [{ type: 'order_capacity', amount: 1 }]);
    assert.equal(Campaign.getOrderCapacity(s), 2);
});

test('without order_capacity, a second frontier order on the same day is refused', () => {
    let state = playableCampaign();
    const home = state.world.tiles.find(tile => tile.kind === 'home');
    const claimable = home.neighbors
        .map(id => state.world.tiles.find(tile => tile.id === id))
        .filter(tile => tile && tile.terrain !== 'water' && !tile.guard);
    assert.ok(claimable.length >= 2, 'need at least two claimable neighbor tiles for this scenario');

    const first = Campaign.settleRegionState(state, claimable[0].id);
    assert.equal(first.error, null);
    const second = Campaign.settleRegionState(first.state, claimable[1].id);
    assert.match(second.error, /поход за землёй уже использован/);
});

test('with ap_max + order_capacity active, the SAME order type (frontier) can be repeated on one day', () => {
    let state = playableCampaign();
    state = withBuilding(state, [{ type: 'ap_max', amount: 1 }, { type: 'order_capacity', amount: 1 }]);
    assert.equal(state.player.apMax, 3, 'base 2 + 1 from the building');
    assert.equal(Campaign.getOrderCapacity(state), 2, 'base 1 + 1 from the building');

    const home = state.world.tiles.find(tile => tile.kind === 'home');
    const claimable = home.neighbors
        .map(id => state.world.tiles.find(tile => tile.id === id))
        .filter(tile => tile && tile.terrain !== 'water' && !tile.guard);
    assert.ok(claimable.length >= 2, 'need at least two claimable neighbor tiles for this scenario');

    const first = Campaign.settleRegionState(state, claimable[0].id);
    assert.equal(first.error, null, 'first frontier order of the day succeeds');
    assert.equal(first.state.player.dailyOrders.frontierUsed, 1);

    const second = Campaign.settleRegionState(first.state, claimable[1].id);
    assert.equal(second.error, null, 'order_capacity lets the SAME order type repeat on the same day');
    assert.equal(second.state.player.dailyOrders.frontierUsed, 2);
    // Note: ap_max raises the pool for the NEXT refill (finishDay), it does not retroactively
    // top up the already-spent current-day AP — starting ap stayed at the historical 2, so two
    // frontier orders in the same day spend it down to 0 even though apMax is now 3.
    assert.equal(second.state.player.ap, 0, 'current-day AP (2) minus two frontier orders');

    const regions = second.state.regions;
    assert.equal(regions.find(r => r.id === claimable[0].id).ownerId, 'player');
    assert.equal(regions.find(r => r.id === claimable[1].id).ownerId, 'player');
});

test('region construction: at most one building per region tile, ever', () => {
    let state = playableCampaign();
    const CampaignMap = require('../campaign-map.js');
    const home = state.world.tiles.find(tile => tile.kind === 'home');
    const foodNeighborId = home.neighbors
        .map(id => state.world.tiles.find(tile => tile.id === id))
        .find(tile => tile && tile.terrain !== 'water' && tile.siteType && !tile.guard)?.id;
    assert.ok(foodNeighborId, 'map should have at least one buildable neighbor tile');

    let claim = Campaign.settleRegionState(state, foodNeighborId);
    assert.equal(claim.error, null);
    state = Campaign.finishDayState(claim.state).state;

    const beforeBuild = Campaign.getRegionActionState(state, foodNeighborId);
    assert.equal(beforeBuild.action, 'build');
    assert.equal(beforeBuild.enabled, true);

    const built = Campaign.buildRegionBuildingState(state, foodNeighborId);
    assert.equal(built.error, null);
    state = built.state;
    assert.ok(state.regions.find(r => r.id === foodNeighborId).building, 'tile now has exactly one building recorded');

    state = Campaign.finishDayState(state).state;
    const afterBuild = Campaign.getRegionActionState(state, foodNeighborId);
    assert.equal(afterBuild.action, 'owned', 'once built, the tile only reports as owned, never buildable again');
    assert.equal(afterBuild.enabled, false);
    assert.match(afterBuild.reason, /под контролем/);

    const secondAttempt = Campaign.buildRegionBuildingState(state, foodNeighborId);
    assert.match(secondAttempt.error, /под контролем/);
    assert.equal(state.regions.find(r => r.id === foodNeighborId).building, state.regions.find(r => r.id === foodNeighborId).building, 'building slot is a single scalar, never a list');
});

test('EFFECTS registry documents the two new daily-tempo effects and offers them to the generator', () => {
    assert.ok(Campaign.EFFECTS.ap_max, 'ap_max effect exists');
    assert.ok(Campaign.EFFECTS.order_capacity, 'order_capacity effect exists');
    assert.ok(!Campaign.EFFECTS.ap_max.hidden);
    assert.ok(!Campaign.EFFECTS.order_capacity.hidden);
    assert.ok(Campaign.GENERATIVE_EFFECTS.includes('ap_max'));
    assert.ok(Campaign.GENERATIVE_EFFECTS.includes('order_capacity'));
});

test('two dedicated science branches make the new effects reachable offline, without an LLM', () => {
    const admin = Campaign.SCIENCE_BRANCHES.find(b => b.id === 'administration');
    const guilds = Campaign.SCIENCE_BRANCHES.find(b => b.id === 'guilds');
    assert.ok(admin && admin.effect === 'ap_max');
    assert.ok(guilds && guilds.effect === 'order_capacity');
});
