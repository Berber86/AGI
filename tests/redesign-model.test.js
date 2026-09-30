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

test('redesigned campaign model stays compatible with existing campaign state and rules', async () => {
  const M = await loadRedesignModel();

  assert.equal(M.STORAGE_KEY, Campaign.STORAGE_KEY);
  assert.deepEqual(M.STARTER_CARDS, Campaign.STARTER_CARDS);
  assert.deepEqual(M.createState(), Campaign.createState());

  const onboarding = { name: 'Народ Реки', originId: 'river', openingFocusId: 'food' };
  const newStart = M.completeOnboarding(M.createState(), onboarding);
  const legacyStart = Campaign.completeOnboarding(Campaign.createState(), onboarding);
  assert.deepEqual(newStart, legacyStart);

  const projectId = newStart.state.player.blueprints[0].id;
  const newResearch = M.researchBlueprint(M.clone(newStart.state), projectId);
  const legacyResearch = Campaign.researchBlueprint(Campaign.normalizeState(legacyStart.state), projectId);
  assert.deepEqual(newResearch, legacyResearch);
  assert.deepEqual(M.getProductionBreakdown(newResearch.state), Campaign.getProductionBreakdown(legacyResearch.state));

  const newSettlement = M.settleRegion(M.clone(newResearch.state), 'floodplain');
  const legacySettlement = Campaign.settleRegionState(Campaign.normalizeState(legacyResearch.state), 'floodplain');
  assert.deepEqual(newSettlement, legacySettlement);
});
