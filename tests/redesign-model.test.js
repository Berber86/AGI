const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const Campaign = require('../campaign.js');

async function loadRedesignModel() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'game', 'model.js'), 'utf8');
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return (await import(url)).M;
}

test('redesigned campaign shares the v4 procedural world and rules with the legacy model', async () => {
  const M = await loadRedesignModel();
  const seed = 12345;

  assert.equal(M.STORAGE_KEY, 'iforge_campaign_v4');
  assert.equal(M.STORAGE_KEY, Campaign.STORAGE_KEY);
  assert.deepEqual(M.STARTER_CARDS, Campaign.STARTER_CARDS);
  assert.deepEqual(M.createState(seed), Campaign.createState(seed));

  const onboarding = { name: 'Народ Реки', originId: 'river', openingFocusId: 'food' };
  const newStart = M.completeOnboarding(M.createState(seed), onboarding);
  const legacyStart = Campaign.completeOnboarding(Campaign.createState(seed), onboarding);
  assert.deepEqual(newStart, legacyStart);
  assert.equal(newStart.state.world.tiles.length, 49);

  const projectId = newStart.state.player.blueprints[0].id;
  const newResearch = M.researchBlueprint(M.clone(newStart.state), projectId);
  const legacyResearch = Campaign.researchBlueprint(Campaign.normalizeState(legacyStart.state), projectId);
  assert.deepEqual(newResearch, legacyResearch);
  assert.deepEqual(M.getProductionBreakdown(newResearch.state), Campaign.getProductionBreakdown(legacyResearch.state));

  const center = newResearch.state.world.tiles.find((tile) => tile.kind === 'home');
  const neighborId = center.neighbors.find((id) => newResearch.state.world.tiles.find((tile) => tile.id === id)?.terrain !== 'water');
  const newSettlement = M.settleRegion(M.clone(newResearch.state), neighborId);
  const legacySettlement = Campaign.settleRegionState(Campaign.normalizeState(legacyResearch.state), neighborId);
  assert.deepEqual(newSettlement, legacySettlement);

  const oldSave = structuredClone(newResearch.state);
  oldSave.version = 3;
  delete oldSave.world;
  oldSave.regions = [{ id: 'home', ownerId: 'player' }, { id: 'floodplain', ownerId: 'player', building: 'irrigation' }];
  const migrated = M.normalizeState(oldSave);
  assert.equal(migrated.version, 4);
  assert.equal(migrated.world.tiles.length, 49);
  assert.equal(migrated.regions.filter((region) => region.ownerId === 'player').length, 1);
});
