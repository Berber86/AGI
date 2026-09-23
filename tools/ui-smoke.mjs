// Смоук-тест интерфейса: под jsdom рендерим все экраны и проигрываем бой кликами.
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!doctype html><html><body><div id="app"></div><div id="toasts"></div></body></html>`, {
  pretendToBeVisual: true, url: 'http://localhost/',
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
globalThis.localStorage = dom.window.localStorage;
globalThis.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.confirm = () => true;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Blob = dom.window.Blob;
globalThis.URL = dom.window.URL;

const errors = [];
process.on('uncaughtException', (e) => errors.push('uncaught: ' + e.message));

const { app, boot, render } = await import('../src/ui/app.js');
const S = await import('../src/engine/state.js');
const { renderMap } = await import('../src/ui/screens/map.js');
const { renderForge } = await import('../src/ui/screens/forge.js');
const { renderScience } = await import('../src/ui/screens/science.js');
const { renderRoster } = await import('../src/ui/screens/roster.js');
const { renderDeck } = await import('../src/ui/screens/deck.js');
const { renderJournal } = await import('../src/ui/screens/journal.js');
const { renderHelp } = await import('../src/ui/screens/help.js');
const { renderBattle } = await import('../src/ui/screens/battle.js');
const { forge } = await import('../src/ui/screens/forge.js');

function check(name, fn) {
  try {
    const node = fn();
    const text = node.textContent || '';
    if (!text.length) throw new Error('пустой рендер');
    console.log(`  ✓ ${name} (${text.length} символов)`);
    return node;
  } catch (e) {
    errors.push(`${name}: ${e.stack || e.message}`);
    console.log(`  ✗ ${name}: ${e.message}`);
    return null;
  }
}

console.log('1) Заставка');
boot();
check('title', () => document.getElementById('app'));

console.log('2) Новая партия');
app.state = S.newGame({ civName: 'Тест-Град', seed: 'ui-smoke', legacy: 'craft', difficulty: 1 });
app.screen = 'hub';
render();
check('topbar', () => document.querySelector('.topbar'));
check('tabs', () => document.querySelector('.tabs'));

console.log('3) Все экраны хаба');
for (const [name, fn] of Object.entries({ map: renderMap, forge: renderForge, science: renderScience, roster: renderRoster, deck: renderDeck, journal: renderJournal })) {
  app.tab = name;
  check(name, fn);
}
check('help', renderHelp);

console.log('4) Мастерская: собираем карту кликами');
app.tab = 'forge'; render();
forge.slots = 2; forge.picked = [];
check('forge render', renderForge);
forge.picked = ['chieftain', 'bronze'].filter((id) => app.state.researched.includes(id));
if (forge.picked.length < 2) forge.picked = ['wheel', 'stonework'];
check('forge with 2 slots', renderForge);
forge.slots = 4;
forge.picked = ['wheel', 'stonework', 'masonry'].filter((id) => app.state.researched.includes(id));
check('forge with 3 slots', renderForge);

console.log('5) Исследование и крафт через API');
app.state.science = 50000; app.state.materials = 50000; app.state.era = 3;
for (const id of ['masonry', 'bronze', 'iron', 'phalanx', 'steel', 'gunpowder', 'chivalry', 'clockwork', 'alchemy']) {
  const r = S.research(app.state, id);
  if (!r.ok) console.log(`    ! ${id}: ${r.reason}`);
}
const crafted = S.craft(app.state, ['phalanx', 'iron', 'bronze']);
console.log(crafted.ok ? `  ✓ спроектировано: ${crafted.bp.name} ${crafted.bp.atk}/${crafted.bp.hp} ${crafted.bp.cost}⚡ [${crafted.bp.keywords.map((k) => k.name).join(', ')}]` : `  ✗ ${crafted.reason}`);
if (!crafted.ok) { errors.push('craft failed: ' + crafted.reason); }
else S.recruit(app.state, crafted.bp.key, 5);
check('roster after craft', renderRoster);
S.autoDeck(app.state);
check('deck after auto', renderDeck);

console.log('6) Бой: полный цикл кликами');
S.autoDeck(app.state);
const sb = S.startBattle(app.state, app.state.world.regions.find((r) => r.era === 1).id);
if (!sb.ok) { errors.push('startBattle: ' + sb.reason); console.log('  ✗', sb.reason); }
else {
  app.battle = sb.battle; app.battleCtx = { region: sb.region, rival: sb.rival }; app.screen = 'battle';
  render();
  check('battle screen', () => document.getElementById('app'));
  const b = app.battle;
  console.log(`  бой: ${b.sides.me.name} (${b.sides.me.deck.length + b.sides.me.hand.length} карт) vs ${b.sides.foe.name}, эпоха ${b.era}`);

  // играем за человека: выставляем всё, что можно, атакуем всеми, заканчиваем ход
  const { canPlay, playCard, beginCombat, canAttack, resolveCombat, endTurn, isAlive } = await import('../src/engine/battle.js');
  const { side } = await import('../src/engine/battle.js');
  let turns = 0;
  while (!b.over && turns++ < 60) {
    if (b.active === 'me') {
      let played = 0;
      for (const u of side(b, 'me').hand.slice()) { if (canPlay(b, u) && played++ < 8) playCard(b, u); }
      beginCombat(b);
      for (const u of side(b, 'me').board.filter(isAlive)) if (canAttack(b, u)) b.attacking.push(u.uid);
      b.blockers = {};
      resolveCombat(b);
      if (b.over) break;
      endTurn(b);
    } else {
      // ход ИИ: крутим синхронно
      const { aiPlayOne, aiDeclareAttack } = await import('../src/engine/ai.js');
      const { autoBlock } = await import('../src/engine/battle.js');
      let p = 0;
      while (aiPlayOne(b, 'foe') && p++ < 12) { /* */ }
      const atk = aiDeclareAttack(b, 'foe');
      if (atk.length) { autoBlock(b, 'me'); resolveCombat(b); }
      if (b.over) break;
      p = 0;
      while (aiPlayOne(b, 'foe') && p++ < 12) { /* */ }
      endTurn(b);
    }
    render();
  }
  console.log(`  ✓ бой сыгран за ${turns} ходов, раундов ${b.round}, итог: ${b.over ? (b.over.winner === 'me' ? 'победа' : b.over.winner === 'draw' ? 'ничья' : 'поражение') : 'не завершён'}`);
  check('battle after end', () => document.getElementById('app'));
}

console.log('7) Сохранение/загрузка');
const json = S.serialize(app.state);
const back = JSON.parse(json);
if (back.roster.length !== app.state.roster.length) errors.push('save/load mismatch');
console.log(`  ✓ сохранение ${Math.round(json.length / 1024)} КБ, юнитов ${back.roster.length}, проектов ${Object.keys(back.blueprints).length}`);

if (errors.length) {
  console.log('\n❌ ОШИБКИ:');
  for (const e of errors) console.log('---\n' + e);
  process.exit(1);
}
console.log('\n✅ UI-смоук пройден без ошибок');
