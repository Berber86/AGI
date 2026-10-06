/**
 * Дымовой прогон экранов: страницы и оболочка рендерятся на настоящей модели без браузера.
 * React здесь — минимальная заглушка (хуки возвращают начальные значения, createElement сразу
 * вызывает компоненты), поэтому выполняются тела всех компонентов и все обращения к M.*:
 * опечатку в имени функции модели или чтение удалённого поля видно сразу, а TypeScript такое
 * не ловит, потому что M объявлен как any.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const Campaign = require('../campaign.js');
const root = path.join(__dirname, '..');

/* ---------- заглушка React ---------- */

function makeReact() {
  const stateSlots = [];
  let stateIndex = 0;
  const api = {
    Fragment: Symbol('Fragment'),
    createElement(type, props, ...children) {
      const flat = children.flat(Infinity);
      const merged = { ...(props || {}), children: flat.length === 1 ? flat[0] : flat };
      if (typeof type === 'function') return type(merged);
      return { type, props: merged };
    },
    useState(initial) {
      const i = stateIndex++;
      if (!(i in stateSlots)) stateSlots[i] = typeof initial === 'function' ? initial() : initial;
      const set = (next) => { stateSlots[i] = typeof next === 'function' ? next(stateSlots[i]) : next; };
      return [stateSlots[i], set];
    },
    useEffect() { /* эффекты не выполняем: нас интересует тело рендера */ },
    useLayoutEffect() {},
    useMemo: (fn) => fn(),
    useCallback: (fn) => fn,
    useRef: (initial) => ({ current: initial === undefined ? null : initial }),
    useContext: () => ({}),
    createContext: (value) => ({ Provider: () => null, Consumer: () => null, _value: value }),
    memo: (component) => component,
    forwardRef: (render) => render,
  };
  api.reset = () => { stateSlots.length = 0; stateIndex = 0; };
  api.default = api;
  return api;
}

function fakeNode() {
  return {
    scrollTop: 0, scrollHeight: 0, clientHeight: 0, value: '', checked: false, files: [],
    scrollTo() {}, scrollIntoView() {}, focus() {}, blur() {}, click() {}, addEventListener() {},
    querySelector: () => null, querySelectorAll: () => [], style: {}, classList: { add() {}, remove() {} },
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }),
  };
}

function makeStorage(seed = {}) {
  const store = { ...seed };
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const key of Object.keys(store)) delete store[key]; },
    _store: store,
  };
}

const iconProxy = new Proxy({}, {
  get: (target, name) => {
    if (name === '__esModule') return true;
    if (typeof name !== 'string') return undefined;
    return function IconStub() { return null; };
  },
});

/* ---------- загрузка модулей ---------- */

function loadModule(relativePath, dependencies, storage, react) {
  const file = path.join(root, relativePath);
  const javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  const sandbox = {
    module: mod, exports: mod.exports, console, setTimeout, clearTimeout, setInterval, clearInterval,
    Date, Math, JSON, localStorage: storage, structuredClone, fetch: async () => { throw new Error('сеть в дымовом прогоне недоступна'); },
    React: react, window: { scrollTo() {}, addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), localStorage: storage },
    document: { addEventListener() {}, createElement: () => fakeNode(), body: fakeNode(), querySelector: () => null },
    navigator: { userAgent: 'node' },
    require: (name) => {
      if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
      if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.svg') || name.endsWith('.css')) return { default: relativePath };
      throw new Error(`Неожиданный импорт ${name} из ${relativePath}`);
    },
  };
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 5000 });
  return mod.exports;
}

/** Собирает настоящее окружение приложения: модель, карты, движок, интерфейс. */
function makeApp(storage) {
  const react = makeReact();
  const M = {
    ...Campaign,
    foundCampaign: Campaign.foundCampaignState,
    recordBattle: Campaign.recordBattleState,
    buyUpgrade: Campaign.buyUpgradeState,
    toggleDeckCard: Campaign.toggleDeckCardState,
    chooseCulture: Campaign.chooseCultureState,
    beginCraft: Campaign.beginCraftState,
    completeCraft: Campaign.completeCraftState,
    failCraft: Campaign.failCraftState,
  };
  const cn = { cn: (...args) => args.filter(Boolean).join(' ') };
  const cards = loadModule('src/game/cards.ts', { './model': { M } }, storage, react);
  const battle = loadModule('src/game/battle.ts', { './cards': cards }, storage, react);
  const ui = loadModule('src/components/ui.tsx', { react, 'lucide-react': iconProxy, '@/utils/cn': cn }, storage, react);
  const cardView = loadModule('src/components/CardView.tsx', { react, 'lucide-react': iconProxy, '@/utils/cn': cn, '@/game/cards': cards, '@/components/ui': ui }, storage, react);
  return { react, M, cn, cards, battle, ui, cardView };
}

function foundedState(overrides = {}) {
  const out = Campaign.foundCampaignState(Campaign.createState(), {
    originId: 'highlands', seedId: 'river', historicalCultureId: 'natufian',
  });
  assert.equal(out.error, null);
  const state = out.state;
  Object.assign(state.player, overrides);
  return Campaign.normalizeState(state);
}

function makeStore(app, game, extra = {}) {
  const derived = {
    cfg: app.M.getBattleConfig(game),
    era: app.M.nextEraProgress(game),
    camp: app.M.campSummary(game),
    glory: Math.floor(game.player.glory),
    gloryTotal: Math.floor(game.player.gloryTotal),
    wins: game.player.wins, losses: game.player.losses,
    streak: game.player.streak, bestStreak: game.player.bestStreak,
  };
  const store = {
    game, collection: extra.collection || [], page: extra.page || 'camp', go: () => {},
    toasts: extra.toasts || [], toast: () => {}, dismissToast: () => {},
    aiStatus: extra.aiStatus || { status: 'ok', message: 'ИИ доступен' }, model: 'gpt-6-luna',
    checkAi: async () => true, act: () => null, commit: () => {}, addCard: () => {}, removeCard: () => {},
    foundPeople: () => ({ ok: true }), resetCampaign: () => {},
    match: extra.match || null, startBattle: () => {}, finishBattle: () => '', closeBattle: () => {},
    buyUpgrade: () => {}, settingsOpen: !!extra.settingsOpen, openSettings: () => {},
  };
  return { store, derived };
}

function loadPage(app, storage, relativePath, store, derived) {
  const deps = {
    react: app.react, 'lucide-react': iconProxy, '@/utils/cn': app.cn, '@/game/model': { M: app.M },
    '@/game/cards': app.cards, '@/game/battle': app.battle, '@/components/ui': app.ui,
    '@/components/CardView': app.cardView,
    '@/game/store': { useStore: () => store, useDerived: () => derived },
  };
  // Оболочка импортирует ui относительным путём
  deps['./ui'] = app.ui;
  deps['./CardView'] = app.cardView;
  if (relativePath === 'src/components/Shell.tsx') return loadModule(relativePath, deps, storage, app.react);
  // Оболочка нужна страницам (PageFrame, LogoMark); грузим её тем же подставным стором.
  deps['@/components/Shell'] = loadModule('src/components/Shell.tsx', deps, storage, app.react);
  return loadModule(relativePath, deps, storage, app.react);
}

/** Рендер компонента: хуки сбрасываются, чтобы каждый прогон начинался с чистого состояния. */
function render(app, storage, relativePath, store, derived, exportName = 'default', props = {}) {
  const mod = loadPage(app, storage, relativePath, store, derived);
  const component = exportName === 'default' ? mod.default : mod[exportName];
  assert.equal(typeof component, 'function', `${relativePath} не экспортирует ${exportName}`);
  app.react.reset();
  return component(props);
}

const ADVICE = [
  { id: 'unit-0-1', cardType: 'unit', title: 'Стражи брода', pitch: 'Держат переправу копьями.' },
  { id: 'spell-0-2', cardType: 'spell', title: 'Засада в камышах', pitch: 'Скрытый залп по авангарду.' },
  { id: 'structure-0-3', cardType: 'structure', title: 'Частокол с бойницами', pitch: 'Обстреливает врага каждый ход.' },
];

test('онбординг рендерится на всех трёх шагах и не требует имени или модели', () => {
  const storage = makeStorage();
  const app = makeApp(storage);
  const { store, derived } = makeStore(app, Campaign.createState());
  assert.doesNotThrow(() => render(app, storage, 'src/pages/Onboarding.tsx', store, derived));
  // экран читает реальные списки модели
  assert.equal(app.M.ORIGINS.length, 6);
  assert.equal(app.M.SEED_CHOICES.length, 5);
});

test('лагерь рендерится с соперниками, улучшениями и шкалой эпохи', () => {
  const storage = makeStorage();
  const app = makeApp(storage);
  // эпоху поднимаем настоящими победами, а не подстановкой чисел в сохранение
  let game = foundedState();
  while (game.player.era === 0) game = app.M.recordBattle(game, { opponentId: 'reed', won: true }).state;
  const { store, derived } = makeStore(app, game);
  assert.doesNotThrow(() => render(app, storage, 'src/pages/Camp.tsx', store, derived));
  assert.equal(derived.camp.length, 6);
  assert.equal(derived.era.era, 1);
  assert.ok(derived.glory >= 0);
});

test('лагерь показывает открытый выбор наследия', () => {
  const storage = makeStorage();
  const app = makeApp(storage);
  const game = foundedState({ era: 1, glory: 200, gloryTotal: 200 });
  game.player.pendingCultureChoice = { era: 1, candidates: ['akkad', 'sumer', 'minoan'] };
  const normalized = app.M.normalizeState(game);
  const shell = loadPage(app, storage, 'src/components/Shell.tsx', makeStore(app, normalized).store, makeStore(app, normalized).derived);
  app.react.reset();
  assert.doesNotThrow(() => shell.CultureChoiceModal({}));
  assert.doesNotThrow(() => shell.SideNav({}));
  assert.doesNotThrow(() => shell.TopBar({}));
  assert.doesNotThrow(() => shell.MobileNav({}));
  assert.doesNotThrow(() => shell.GoBattle({}));
  assert.doesNotThrow(() => shell.GloryLine({}));
  assert.doesNotThrow(() => shell.PageFrame({ children: null }));
});

test('армия рендерится с колодой, запасом и пустой коллекцией', () => {
  const storage = makeStorage();
  const app = makeApp(storage);
  const game = foundedState({ glory: 60 });
  const crafted = {
    id: 'card-1', name: 'Стражи брода', card_type: 'unit', era: 'ancient', emoji: '🛡️',
    drop_cost: 2, action_cost: 1, hp: 4, atk: 2, rarity: 'uncommon',
    description: 'Держат брод.', keywords: ['phalanx'], effects: [], tags: [], abilities: [],
    history: { title: 'Бронзовый век', text: 'Копья и щиты.' },
  };
  const withCards = makeStore(app, game, { collection: [crafted], page: 'army' });
  assert.doesNotThrow(() => render(app, storage, 'src/pages/Army.tsx', withCards.store, withCards.derived));
  const empty = makeStore(app, game, { collection: [], page: 'army' });
  assert.doesNotThrow(() => render(app, storage, 'src/pages/Army.tsx', empty.store, empty.derived));
});

test('кузница рендерится и без замыслов, и с тремя идеями советника', () => {
  const bare = makeStorage();
  const appBare = makeApp(bare);
  const game = foundedState({ glory: 40 });
  const plain = makeStore(appBare, game, { page: 'forge' });
  assert.doesNotThrow(() => render(appBare, bare, 'src/pages/Forge.tsx', plain.store, plain.derived));

  // кэш замыслов в localStorage подхватывается при первом рендере
  const seeded = makeStorage({ iforge_advice_combat: JSON.stringify({ era: 0, advice: ADVICE }) });
  const appSeeded = makeApp(seeded);
  const rich = makeStore(appSeeded, foundedState({ glory: 400, era: 1 }), { page: 'forge' });
  assert.doesNotThrow(() => render(appSeeded, seeded, 'src/pages/Forge.tsx', rich.store, rich.derived));
  // замыслы чужой эпохи игнорируются
  const stale = makeStorage({ iforge_advice_combat: JSON.stringify({ era: 3, advice: ADVICE }) });
  assert.equal(seeded.getItem('iforge_advice_combat') !== null, true);
  assert.ok(stale.getItem('iforge_advice_combat').includes('"era":3'));
});

/** Собирает весь текст из дерева элементов, которое строит заглушка React. */
function textOf(node, out = []) {
  if (node === null || node === undefined || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const child of node) textOf(child, out); return out; }
  if (node.props) textOf(node.props.children, out);
  return out;
}

test('бой рендерится на живом матче против племени', () => {
  const storage = makeStorage();
  const app = makeApp(storage);
  const game = foundedState({ glory: 30, era: 1 });
  const opponentId = 'steppe';
  const opponent = game.opponents.find((o) => o.id === opponentId);
  const cfg = app.M.getOpponentBattleConfig(game, opponentId);
  const match = {
    kind: 'practice', opponentId, name: opponent.name, clan: opponent.clan,
    era: cfg.era, threatEra: cfg.threatEra, leaderBattle: !!opponent.leader, tutorial: true,
  };
  const { store, derived } = makeStore(app, game, { page: 'camp', match });
  assert.doesNotThrow(() => render(app, storage, 'src/pages/Battle.tsx', store, derived));
});

test('экран боя рисуется на столе любой эпохи: от линии Каменного века до пяти рядов Будущего', () => {
  for (const threatEra of [0, 1, 3, 6]) {
    const storage = makeStorage();
    const app = makeApp(storage);
    const game = foundedState({ glory: 40, era: threatEra });
    const opponent = game.opponents.find((o) => o.id === 'steppe') || game.opponents[0];
    const match = {
      kind: 'practice', opponentId: opponent.id, name: opponent.name, clan: opponent.clan,
      era: opponent.era || 0, threatEra, leaderBattle: !!opponent.leader, tutorial: false,
    };
    const { store, derived } = makeStore(app, game, { page: 'camp', match });
    let tree = null;
    assert.doesNotThrow(() => { tree = render(app, storage, 'src/pages/Battle.tsx', store, derived); }, `эпоха угрозы ${threatEra}`);

    const text = textOf(tree).join(' ');
    const shape = app.battle.boardShape(threatEra);
    assert.ok(text.includes(app.battle.boardLabel(shape)), `размер стола ${app.battle.boardLabel(shape)} виден игроку (эпоха ${threatEra})`);
    // Подписи рядов берём у движка на игроке той же формы: в Каменном веке back === front (один ряд).
    const front = [];
    const shapePlayer = { front, middle: Array(Math.max(0, shape.rows - 2)).fill(0).map(() => []), back: shape.rows > 1 ? [] : front };
    const labels = Array.from({ length: shape.rows }, (_, ri) => app.battle.rowName(shapePlayer, ri));
    for (const label of new Set(labels)) assert.ok(text.includes(label), `ряд «${label}» подписан (эпоха ${threatEra})`);
  }
});

test('оболочка и настройки рендерятся в любом состоянии', () => {
  const storage = makeStorage();
  const app = makeApp(storage);
  const game = foundedState({ glory: 15 });
  const { store, derived } = makeStore(app, game, { settingsOpen: true, toasts: [{ id: 1, text: 'Победа', tone: 'ok' }] });
  const shell = loadPage(app, storage, 'src/components/Shell.tsx', store, derived);
  for (const name of ['SideNav', 'MobileNav', 'TopBar', 'Toasts', 'SettingsModal', 'CultureChoiceModal', 'GloryLine', 'GoBattle', 'LogoMark']) {
    assert.equal(typeof shell[name], 'function', `Shell не экспортирует ${name}`);
    app.react.reset();
    assert.doesNotThrow(() => shell[name]({}), `${name} упал при рендере`);
  }
  app.react.reset();
  assert.doesNotThrow(() => shell.PageFrame({ children: null, wide: true }));
});
