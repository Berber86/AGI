const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const WorldMap = require('../world-map.js');
const Campaign = require('../campaign.js');

test('seeded world generation is deterministic and creates a 7 by 7 world', () => {
  const first = WorldMap.generateWorldMap('test-world-42');
  const repeated = WorldMap.generateWorldMap('test-world-42');
  const other = WorldMap.generateWorldMap('different-world');

  assert.deepEqual(first, repeated);
  assert.notDeepEqual(first, other);
  assert.equal(first.length, 49);
  assert.equal(new Set(first.map(tile => tile.id)).size, 49);
  assert.deepEqual(first[3 * WorldMap.SIZE + 3], {
    ...first[3 * WorldMap.SIZE + 3],
    x: 3,
    y: 3,
    isHome: true,
    biome: 'riverlands'
  });
  for (const tile of first) {
    assert.ok(tile.name.length > 0);
    assert.ok(tile.summary.length > 0);
    assert.ok(tile.description.length > 0);
  }
});

test('exploration begins in the center and initially reveals only the home cross', () => {
  const state = WorldMap.createExplorationState('initial-map');
  assert.deepEqual(state.current, { x: 3, y: 3 });
  assert.equal(state.width, 7);
  assert.equal(state.height, 7);
  assert.deepEqual(state.visited, ['cell-3-3']);
  assert.deepEqual(new Set(state.revealed), new Set([
    'cell-3-3', 'cell-3-2', 'cell-4-3', 'cell-3-4', 'cell-2-3'
  ]));
  assert.equal(state.tiles.find(tile => tile.id === 'cell-3-3').isHome, true);
  assert.deepEqual(WorldMap.getProgress(state), { total: 49, revealed: 5, visited: 1, percent: 2 });
});

test('movement is limited to open adjacent cells and gradually reveals new places', () => {
  const initial = WorldMap.createExplorationState('travel-map');
  const moved = WorldMap.moveToTile(initial, 4, 3);
  assert.equal(moved.error, null);
  assert.deepEqual(moved.state.current, { x: 4, y: 3 });
  assert.equal(moved.state.moveCount, 1);
  assert.ok(moved.state.visited.includes('cell-4-3'));
  assert.ok(moved.state.revealed.length > initial.revealed.length);

  const blockedFog = WorldMap.moveToTile(moved.state, 6, 6);
  assert.match(blockedFog.error, /Сначала открой/);
  const blockedJump = WorldMap.moveToTile(moved.state, 2, 3);
  assert.match(blockedJump.error, /только в соседнюю клетку/);
  const blockedSelection = WorldMap.selectTile(moved.state, 6, 6);
  assert.match(blockedSelection.error, /ещё не открыта/);
  assert.deepEqual(moved.state.current, { x: 4, y: 3 });
});

test('map normalization repairs malformed progress without changing its seed', () => {
  const original = WorldMap.createExplorationState('restore-map');
  const restored = WorldMap.normalizeExplorationState({
    ...original,
    current: { x: 99, y: -5 },
    revealed: ['cell-6-6', 'cell-6-6', 'not-a-cell'],
    visited: ['cell-6-6', 'not-a-cell'],
    selectedId: 'not-a-cell',
    tiles: [{ id: 'cell-3-3', name: '<script>bad</script>', biome: 'invalid' }]
  });

  assert.equal(restored.seed, 'restore-map');
  assert.deepEqual(restored.current, { x: 3, y: 3 });
  assert.equal(restored.tiles.length, 49);
  assert.equal(restored.tiles.find(tile => tile.id === 'cell-3-3').name, '<script>bad</script>');
  assert.ok(restored.revealed.includes('cell-3-3'));
  assert.equal(restored.selectedId, 'cell-3-3');
  assert.equal(new Set(restored.visited).size, restored.visited.length);
  assert.ok(restored.visited.every(id => restored.revealed.includes(id)));
});

test('map selection and travel update only exploration state in the campaign UI API', () => {
  const initial = Campaign.createState();
  initial.worldMap = WorldMap.createExplorationState('ui-test-map');
  const neighbor = initial.worldMap.tiles.find(tile => tile.id === 'cell-4-3');
  neighbor.icon = '<img src=x onerror=alert(1)>';
  let stored = JSON.stringify(initial);
  const mapHost = { innerHTML: '' };
  const fakeWindow = {
    WorldMapGenerator: WorldMap,
    localStorage: {
      getItem: key => key === Campaign.STORAGE_KEY ? stored : null,
      setItem: (key, value) => { if (key === Campaign.STORAGE_KEY) stored = value; }
    },
    document: { getElementById: id => id === 'world-map-root' ? mapHost : null },
    alert() {},
    confirm: () => true
  };
  const source = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(source, { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set });
  const app = fakeWindow.CampaignMvp;
  const before = app.getState();
  const unrelated = {
    season: before.season,
    day: before.day,
    player: structuredClone(before.player),
    opponents: structuredClone(before.opponents),
    medals: structuredClone(before.medals)
  };

  app.renderWorldMap();
  assert.match(mapHost.innerHTML, /Карта мира, 7 на 7/);
  assert.equal((mapHost.innerHTML.match(/class=\"world-map-row\"/g) || []).length, 7);
  assert.equal((mapHost.innerHTML.match(/class=\"world-map-tile(?: |\")/g) || []).length, 49);
  assert.equal((mapHost.innerHTML.match(/class=\"world-map-tile is-fogged/g) || []).length, 44);
  assert.match(mapHost.innerHTML, /СТАРТОВАЯ ТОЧКА/);
  assert.ok(mapHost.innerHTML.includes(neighbor.name));
  assert.match(mapHost.innerHTML, /&lt;img/);
  assert.doesNotMatch(mapHost.innerHTML, /<img src=/);

  app.selectMapTile(4, 3);
  assert.match(mapHost.innerHTML, /data-biome=/);
  assert.doesNotMatch(mapHost.innerHTML, /<img src=/);
  app.moveMapExplorer(4, 3);
  const after = app.getState();
  assert.deepEqual({
    season: after.season,
    day: after.day,
    player: after.player,
    opponents: after.opponents,
    medals: after.medals
  }, unrelated);
  assert.deepEqual(after.worldMap.current, { x: 4, y: 3 });
  assert.ok(after.worldMap.visited.includes('cell-4-3'));
  assert.ok(after.worldMap.revealed.length > before.worldMap.revealed.length);
});
