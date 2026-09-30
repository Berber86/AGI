const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const legacyHtml = fs.readFileSync(path.join(__dirname, '..', 'legacy.html'), 'utf8');

test('the redesign is the default app and the previous standalone UI remains available', () => {
  assert.match(rootHtml, /<div id="root"><\/div>/);
  assert.match(rootHtml, /src="\/src\/main\.tsx"/);
  assert.ok(rootHtml.indexOf('src="/campaign-map.js"') < rootHtml.indexOf('src="/campaign.js"'));
  assert.ok(rootHtml.indexOf('src="/campaign.js"') < rootHtml.indexOf('src="/src/main.tsx"'));
  assert.match(legacyHtml, /id="campaign-root"/);
  assert.ok(legacyHtml.indexOf('src="campaign-map.js"') < legacyHtml.indexOf('src="campaign.js"'));
});

test('the redesigned map renders saved world cells and routes selection through territorial rules', () => {
  const mapPage = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'MapPage.tsx'), 'utf8');
  assert.match(mapPage, /game\.world\?\.tiles/);
  assert.match(mapPage, /grid-cols-7 grid-rows-7/);
  assert.match(mapPage, /M\.getVisibleRegionIds\(game\)/);
  assert.match(mapPage, /if \(!visibleIds\.has\(tile\.id\)\)/);
  assert.match(mapPage, /riverSegments/);
  assert.match(mapPage, /M\.getRegionActionState\(game, tile\.id\)/);
  assert.match(mapPage, /selectRegion\(isSelected \? null : tile\.id\)/);
  assert.match(mapPage, /M\.settleRegion\(s, def\.id\)/);
  assert.match(mapPage, /action\.action === "quest"/);
  assert.match(mapPage, /Квестовый бой снимает охрану/);
  assert.match(mapPage, /startExpedition\(def\.id\)/);
  assert.doesNotMatch(mapPage, /const REGIONS\s*=\s*\[/);
});
