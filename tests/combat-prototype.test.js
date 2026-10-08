/**
 * Прототип обрезан до боевого ядра: лагерь → армия → кузница → бой.
 * Эти проверки держат границу среза: если экономика, карта или науки вернутся в код,
 * тест упадёт и потребует явного решения, а не тихого разрастания.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const DELETED = [
  'src/pages/Home.tsx', 'src/pages/MapPage.tsx', 'src/pages/Develop.tsx',
  'campaign-map.js', 'legacy.html', 'tribes-legacy.html', 'campaign.css',
  'tools/economy-sim.js', 'tools/copy-legacy.mjs',
];

test('файлы вырезанных механик удалены из дерева', () => {
  for (const file of DELETED) assert.equal(fs.existsSync(path.join(root, file)), false, `${file} должен быть удалён`);
  // Явное исключение: tools/balance — стенд баланса боя (честные колоды против колод племён).
  // Это не вырезанная механика, а измерительный прибор; остальной tools/ по-прежнему не нужен.
  const tools = fs.existsSync(path.join(root, 'tools')) ? fs.readdirSync(path.join(root, 'tools')).sort() : [];
  assert.deepEqual(tools, ['balance'], 'в tools/ допустим только стенд баланса');
  // страницы — только боевой прототип
  assert.deepEqual(fs.readdirSync(path.join(root, 'src', 'pages')).sort(), ['Army.tsx', 'Battle.tsx', 'Camp.tsx', 'Forge.tsx', 'Onboarding.tsx']);
});

test('точка входа не тянет карту кампании и старую разметку', () => {
  const html = read('index.html');
  assert.match(html, /<script type="module" src="\/src\/main\.tsx"><\/script>/);
  assert.ok(!html.includes('campaign-map.js'), 'index.html не должен подключать карту кампании');
  assert.ok(!html.includes('legacy.html'), 'index.html не должен подключать старую разметку');
  assert.ok(!html.includes('campaign.css'), 'index.html не должен подключать старый css');
  assert.match(html, /Боевой прототип/iu);

  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts.build, 'vite build', 'сборка больше не копирует legacy-артефакты');
  assert.equal(pkg.scripts.test, 'node --test');
});

test('навигация — три экрана прототипа', () => {
  const shell = read('src', 'components', 'Shell.tsx');
  assert.match(shell, /\{ id: "camp", label: "Лагерь"/u);
  assert.match(shell, /\{ id: "army", label: "Армия"/u);
  assert.match(shell, /\{ id: "forge", label: "Кузница"/u);
  for (const gone of ['"Поселение"', '"Карта"', '"Развитие"', '"Наука"', 'id: "map"', 'id: "develop"', 'id: "home"']) {
    assert.ok(!shell.includes(gone), `в навигации не должно остаться ${gone}`);
  }

  const app = read('src', 'App.tsx');
  for (const page of ['Home', 'MapPage', 'Develop']) assert.ok(!app.includes(page), `App.tsx не должен знать о ${page}`);
  for (const page of ['Camp', 'Army', 'Forge', 'Battle', 'Onboarding']) assert.ok(app.includes(page), `App.tsx должен рендерить ${page}`);
});

test('стор прототипа: три страницы, бой как режим, никаких дней и приказов', () => {
  const store = read('src', 'game', 'store.tsx');
  assert.match(store, /export type Page = "camp" \| "army" \| "forge";/);
  assert.match(store, /foundPeople/);
  assert.match(store, /M\.foundCampaign\(/);
  assert.match(store, /M\.recordBattle\(/);
  assert.match(store, /M\.buyUpgrade\(/);
  for (const gone of ['endDay', 'dayReport', 'assignWorker', 'militiaPicks', 'claimCardCraft', 'beginExpedition', 'researchBlueprint', 'chooseScience', 'SEASON', '"day"', 'resources']) {
    assert.ok(!store.includes(gone), `в store.tsx не должно остаться ${gone}`);
  }
});

test('в исходниках не осталось следов экономики, стройки, наук и карты', () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|jsx?|css|html)$/.test(entry.name)) files.push(full);
    }
  };
  walk(path.join(root, 'src'));
  files.push(path.join(root, 'index.html'), path.join(root, 'campaign.js'));

  const forbidden = [
    'assignWorker', 'getProductionBreakdown', 'finishDay', 'endDay', 'SEASON_LENGTH',
    'constructBlueprint', 'researchBlueprint', 'beginRegionExpedition', 'settleRegion',
    'SCIENCE_BRANCHES', 'REGION_BUILDINGS', 'llmRegionBuildingName', 'DECREES',
    'POP_START', 'getStorageCap', 'player.resources', 'player.workers', 'player.buildings',
    'player.blueprints', 'dailyOrders', 'pendingExpedition', 'campaign-map',
  ];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const word of forbidden) {
      assert.ok(!text.includes(word), `${path.relative(root, file)}: не должно остаться «${word}»`);
    }
  }
});

test('боевой движок не знает о населении и ополчении игрока', () => {
  const battle = read('src', 'game', 'battle.ts');
  assert.match(battle, /export interface SideConfig/, 'стороны собираются из боевых параметров');
  for (const key of ['hp', 'energyMax', 'energyGrowth', 'fatigueDelay', 'atkBonus']) {
    assert.ok(battle.includes(key), `SideConfig должен содержать ${key}`);
  }
  for (const gone of ['usedMilitia', 'militiaPool', 'population', 'workers', 'deckLimit: 4 //']) {
    assert.ok(!battle.includes(gone), `в battle.ts не должно остаться ${gone}`);
  }
  // матч только один: тренировка против племени
  const store = read('src', 'game', 'store.tsx');
  assert.match(store, /startBattle/, 'бой начинается из лагеря');
});

test('модель объявлена для TypeScript и попадает в бандл вместе с campaign.js', () => {
  const decl = read('src', 'game', 'model.d.ts');
  const impl = read('src', 'game', 'model.js');
  assert.match(decl, /export const M: any/);
  // campaign.js подключается импортом из модели: сборка не зависит от копирования файла в dist,
  // а порядок выполнения гарантирован до тела model.js (иначе M был бы пустым).
  assert.match(impl, /import "\.\.\/\.\.\/campaign\.js";/);
  assert.ok(impl.indexOf('import "../../campaign.js"') < impl.indexOf('globalThis.CampaignMvp'),
    'импорт campaign.js должен идти до чтения CampaignMvp');
  assert.match(impl, /CampaignMvp/);
  // в index.html не осталось обычных скриптов из корня: в production-сборке их просто не было бы
  assert.doesNotMatch(read('index.html'), /<script src="\/[a-z-]+\.js"><\/script>/);
});

test('документация объясняет срез прототипа', () => {
  const doc = read('docs', 'COMBAT_PROTOTYPE_CUT.md');
  for (const word of ['Лагерь', 'Армия', 'Кузница', 'слава', 'боев']) {
    assert.ok(doc.includes(word), `в документе про срез должно быть «${word}»`);
  }
});

test('каждая функция модели, которую зовёт React-слой, действительно существует', () => {
  // M объявлен как `any`, поэтому TypeScript не ловит опечатки и удалённые методы модели.
  // Проверяем статически: всё, что исходники зовут через M.*, есть в campaign.js или в адаптере.
  const Campaign = require('../campaign.js');
  const adapter = read('src', 'game', 'model.js');
  const aliases = [...adapter.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*): Campaign\./gm)].map((m) => m[1]);
  const known = new Set([...Object.keys(Campaign), ...aliases]);

  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name) && entry.name !== 'model.d.ts') files.push(full);
    }
  };
  walk(path.join(root, 'src', 'game'));
  walk(path.join(root, 'src', 'pages'));
  walk(path.join(root, 'src', 'components'));

  const used = new Map();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\bM\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
      if (!used.has(m[1])) used.set(m[1], path.relative(root, file));
    }
  }
  assert.ok(used.size > 30, `React-слой использует модель активно (найдено ${used.size} имён)`);
  const missing = [...used.entries()].filter(([name]) => !known.has(name));
  assert.deepEqual(missing, [], 'вызовы несуществующих функций модели: ' + missing.map(([n, f]) => `${n} (${f})`).join(', '));
});
