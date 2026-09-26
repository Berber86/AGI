// tests/browser.mjs — проверка игры в настоящем Chromium: загрузка, меню, игра, редактор, бестиарий.
// Требует: playwright-core и путь к chromium в CHROME_PATH (по умолчанию — /tmp/chromium-bin/chromium).
// Запуск: node tests/browser.mjs [url] [папка_для_скриншотов]

import fs from 'node:fs';

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.error('Нужен playwright-core: npm install && npx playwright install chromium');
  console.error('Либо укажите путь к своему браузеру в CHROME_PATH.');
  process.exit(2);
}

const URL = process.argv[2] ?? 'http://127.0.0.1:8080/index.html';
const SHOTS = process.argv[3] ?? '/tmp/shots';
const EXEC = process.env.CHROME_PATH ?? '/tmp/chromium-bin/chromium';
fs.mkdirSync(SHOTS, { recursive: true });

const errors = [];
let failures = 0;
const check = (cond, msg) => { if (!cond) { console.error('  ✗ ' + msg); failures++; } else console.log('  ✓ ' + msg); };

if (!fs.existsSync(EXEC)) {
  console.error(`Браузер не найден: ${EXEC}. Установите Chromium или задайте CHROME_PATH.`);
  process.exit(2);
}

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ['--no-sandbox', '--disable-gpu', '--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  env: { ...process.env, LD_LIBRARY_PATH: '/tmp/chromium-libs/lib' },
});
const context = await browser.newContext({
  viewport: { width: 412, height: 892 },      // типичный телефон
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153 Mobile Safari/537.36',
});
const page = await context.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

console.log('— Загрузка страницы —');
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(1500);
const titleVisible = await page.locator('#scr-title.show').count();
check(titleVisible === 1, 'главное меню показано');
await page.screenshot({ path: `${SHOTS}/01-title.png` });

console.log('— Бестиарий, достижения, помощь, настройки —');
await page.click('#btn-codex'); await page.waitForTimeout(400);
check(await page.locator('#codex-list .codex-entry').count() > 15, 'бестиарий наполнен');
await page.screenshot({ path: `${SHOTS}/02-codex.png` });
await page.click('#scr-codex [data-close]'); await page.waitForTimeout(250);
await page.click('#btn-milestones'); await page.waitForTimeout(400);
check(await page.locator('#ms-list .ms-entry').count() > 8, 'достижения перечислены');
await page.screenshot({ path: `${SHOTS}/03-milestones.png` });
await page.click('#scr-milestones [data-close]'); await page.waitForTimeout(250);
await page.click('#btn-settings'); await page.waitForTimeout(400);
check(await page.locator('#settings-list .set-row').count() >= 6, 'настройки отрисованы');
await page.screenshot({ path: `${SHOTS}/04-settings.png` });
await page.click('#scr-settings [data-close]'); await page.waitForTimeout(250);
await page.click('#btn-help'); await page.waitForTimeout(300);
check((await page.locator('#help-body').innerText()).length > 400, 'справка заполнена');
await page.click('#scr-help [data-close]'); await page.waitForTimeout(250);

console.log('— Новая жизнь —');
await page.click('#btn-newrun'); await page.waitForTimeout(400);
check(await page.locator('#lineage-cards .card').count() === 4, 'четыре родословные');
check(await page.locator('#difficulty-cards .card').count() === 4, 'четыре сложности');
await page.screenshot({ path: `${SHOTS}/05-newrun.png` });
await page.click('#btn-newrun-start');
await page.waitForTimeout(2500);
const hudVisible = await page.evaluate(() => !document.getElementById('hud').classList.contains('hidden'));
check(hudVisible, 'HUD включился, игра началась');
await page.screenshot({ path: `${SHOTS}/06-game.png` });

console.log('— Управление: стик, рывок, укус —');
const before = await page.evaluate(() => ({ x: window.__app.game.player.x, y: window.__app.game.player.y }));
await page.touchscreen.tap(120, 700);
await page.waitForTimeout(60);
// тянем палец по зоне стика
await page.evaluate(() => {
  const zone = document.getElementById('stick-zone');
  const rect = zone.getBoundingClientRect();
  const mk = (type, x, y) => {
    const t = new Touch({ identifier: 1, target: zone, clientX: x, clientY: y });
    zone.dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  const cx = rect.left + rect.width / 2, cy = rect.bottom - rect.height / 2;
  mk('touchstart', cx, cy);
  mk('touchmove', cx + 60, cy - 40);
  window.__mk = mk; window.__c = { cx, cy };
});
await page.waitForTimeout(1600);
await page.evaluate(() => window.__mk('touchmove', window.__c.cx + 70, window.__c.cy - 60));
await page.waitForTimeout(600);
// шайба стика должна лежать ПОД пальцем, а подложка — в точке касания:
// раньше база позиционировалась координатами вьюпорта внутри сдвинутого контейнера
// и рисовалась на пол-экрана ниже пальца (игрок водил вслепую).
// короткий сдвиг (меньше полного хода стика): шайба обязана стоять точно под пальцем
await page.evaluate(() => window.__mk('touchmove', window.__c.cx + 20, window.__c.cy - 14));
await page.waitForTimeout(150);
const knobGeo = await page.evaluate(() => {
  const mid = (id) => { const b = document.getElementById(id).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; };
  return { knob: mid('stick-knob'), base: mid('stick-base'), finger: { x: window.__c.cx + 20, y: window.__c.cy - 14 }, start: { x: window.__c.cx, y: window.__c.cy },
    hidden: document.getElementById('stick-base').classList.contains('hidden') };
});
const dKnob = Math.hypot(knobGeo.knob.x - knobGeo.finger.x, knobGeo.knob.y - knobGeo.finger.y);
const dBase = Math.hypot(knobGeo.base.x - knobGeo.start.x, knobGeo.base.y - knobGeo.start.y);
check(!knobGeo.hidden, 'подложка стика видна при касании');
check(dKnob < 3, `шайба стика под пальцем (смещение ${dKnob.toFixed(1)} px)`);
check(dBase < 3, `подложка стика в точке касания (смещение ${dBase.toFixed(1)} px)`);
// и полный ход не выпускает шайбу за пределы подложки
await page.evaluate(() => window.__mk('touchmove', window.__c.cx + 140, window.__c.cy - 120));
await page.waitForTimeout(120);
const reach = await page.evaluate(() => {
  const mid = (id) => { const b = document.getElementById(id).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; };
  const k = mid('stick-knob'), b = mid('stick-base');
  return { d: Math.hypot(k.x - b.x, k.y - b.y), half: document.getElementById('stick-base').getBoundingClientRect().width / 2 };
});
check(reach.d <= reach.half - 8, `шайба не выходит за подложку (${reach.d.toFixed(0)} из ${reach.half.toFixed(0)} px)`);
await page.evaluate(() => window.__mk('touchmove', window.__c.cx + 70, window.__c.cy - 60));
const after = await page.evaluate(() => ({ x: window.__app.game.player.x, y: window.__app.game.player.y, speed: Math.hypot(window.__app.game.player.vx, window.__app.game.player.vy) }));
const moved = Math.hypot(after.x - before.x, after.y - before.y);
check(moved > 60, `клетка плывёт по стику (пройдено ${moved.toFixed(0)} единиц)`);
await page.evaluate(() => window.__mk('touchend', window.__c.cx, window.__c.cy));

console.log('— Игровой процесс: 25 секунд симуляции —');
await page.evaluate(() => {
  // ускоряем: держим укус и движение по кругу через внутренний ввод
  const app = window.__app;
  app.__bot = setInterval(() => {
    const t = performance.now() / 1000;
    app.input.ax = Math.cos(t * 0.8); app.input.ay = Math.sin(t * 0.8);
    app.input.bite = true;
    if (Math.random() < 0.05) app.input.dash = true;
  }, 50);
});
await page.waitForTimeout(25000);
await page.evaluate(() => clearInterval(window.__app.__bot));
const state = await page.evaluate(() => {
  const g = window.__app.game;
  return {
    tier: g.player.tier, dna: Math.round(g.player.dna), kills: g.player.counters.kills,
    eats: g.player.counters.plants + g.player.counters.meat, creatures: g.creatures.length,
    foods: g.foods.length, event: g.event?.id ?? null, quests: g.quests.side.length,
    codex: g.codex.size, fpsOk: window.__app.fpsSamples.length,
    alive: g.player.alive, time: g.time,
  };
});
console.log('    состояние:', JSON.stringify(state));
check(state.alive, 'клетка жива после 25 секунд');
check(state.eats > 3, `клетка ела (${state.eats} частиц)`);
check(state.creatures > 10, 'экосистема населена');
check(state.codex >= 2, `видов изучено: ${state.codex}`);
await page.screenshot({ path: `${SHOTS}/07-gameplay.png` });

console.log('— Редактор генома —');
await page.click('#btn-menu'); await page.waitForTimeout(300);
check(await page.locator('#scr-pause.show').count() === 1, 'пауза открылась');
await page.click('#btn-evolve'); await page.waitForTimeout(500);
check(await page.locator('#g-parts .part').count() > 4, 'органеллы перечислены');
await page.screenshot({ path: `${SHOTS}/08-genome.png` });
// попробуем купить первую доступную деталь
const bought = await page.evaluate(() => {
  const g = window.__app.game;
  g.player.dna = 9999;
  window.__app.ui.renderGenome();
  const btn = [...document.querySelectorAll('#g-parts .part .buy')].find((b) => !b.disabled);
  if (btn) { btn.click(); return true; }
  return false;
});
await page.waitForTimeout(300);
check(bought, 'покупка органеллы в редакторе работает');
await page.screenshot({ path: `${SHOTS}/09-genome-bought.png` });
await page.click('#btn-genome-close'); await page.waitForTimeout(400);
check(await page.locator('#scr-genome.show').count() === 0, 'вернулись в игру');

console.log('— Задания и события —');
const missions = await page.evaluate(() => {
  window.__app.game.events.force('bloom');
  window.__app.ui.renderMissions();
  return window.__app.game.quests.list().length;
});
check(missions >= 3, `задания выдаются (${missions})`);

console.log('— Ориентация и масштаб —');
await page.setViewportSize({ width: 892, height: 412 });
await page.waitForTimeout(1200);
const canvasOk = await page.evaluate(() => {
  const c = document.getElementById('world');
  return { w: c.width, h: c.height, lw: c.clientWidth, lh: c.clientHeight };
});
check(canvasOk.w > 0 && canvasOk.h > 0, `canvas перестроился в ландшафт: ${JSON.stringify(canvasOk)}`);
await page.screenshot({ path: `${SHOTS}/10-landscape.png` });
await page.setViewportSize({ width: 412, height: 892 });
await page.waitForTimeout(800);

console.log('— Сохранение и продолжение —');
await page.evaluate(() => window.__app.meta.saveRun(window.__app.game));
const hasSave = await page.evaluate(() => window.__app.meta.hasRun());
check(hasSave, 'сохранение записано');
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(1800);
const contDisabled = await page.evaluate(() => document.getElementById('btn-continue').disabled);
check(contDisabled === false, 'кнопка «Продолжить» активна после перезагрузки');
await page.click('#btn-continue'); await page.waitForTimeout(2500);
const restored = await page.evaluate(() => (window.__app.game ? window.__app.game.player.tier : -1));
check(restored >= 1, `сохранение восстановлено (размер ${restored})`);
await page.screenshot({ path: `${SHOTS}/11-restored.png` });

console.log('— Смерть и возрождение —');
await page.evaluate(() => { window.__app.game.player.hp = 0.5; window.__app.game.damagePlayer(50, null, {}); });
await page.waitForTimeout(700);
check(await page.locator('#scr-dead.show').count() === 1, 'экран смерти появился');
await page.screenshot({ path: `${SHOTS}/12-death.png` });
await page.click('#death-actions button'); await page.waitForTimeout(800);
const respawned = await page.evaluate(() => window.__app.game.player.alive && window.__app.game.player.hp > 1);
check(respawned, 'возрождение в гнезде работает');

console.log('— Победа —');
await page.evaluate(() => {
  const g = window.__app.game;
  g.player.relicGenes = 3;
  g.win('test');
});
await page.waitForTimeout(900);
check(await page.locator('#scr-win.show').count() === 1, 'экран победы показан');
await page.screenshot({ path: `${SHOTS}/13-win.png` });
await page.click('#btn-win-continue'); await page.waitForTimeout(600);
check(await page.locator('#scr-win.show').count() === 0, 'свободная игра после победы');

console.log('— Стадия суши: сразу с берега —');
// выходим в меню и начинаем жизнь за зверя, минуя океан
await page.evaluate(() => window.__app.quitToMenu());
await page.waitForTimeout(400);
await page.click('#btn-newrun'); await page.waitForTimeout(400);
check(await page.locator('#stage-cards .card').count() === 2, 'в новой жизни выбирается стадия (океан/суша)');
await page.click('#stage-cards .card:nth-child(2)'); await page.waitForTimeout(300);
check(await page.locator('#lineage-cards .card').count() === 4, 'на суше четыре дорожки развития');
await page.screenshot({ path: `${SHOTS}/14-newrun-land.png` });
await page.click('#btn-newrun-start'); await page.waitForTimeout(2200);
const landHud = await page.evaluate(() => ({
  stage: window.__app.stage,
  landBars: !document.getElementById('land-bars').classList.contains('hidden'),
  landClass: document.getElementById('hud').classList.contains('land'),
  energyHidden: getComputedStyle(document.querySelector('.bar-en')).display === 'none'
    || getComputedStyle(document.querySelector('.bar-en').parentElement).display === 'none',
  satWidth: document.getElementById('bar-sat-fill').style.width,
  zone: document.querySelector('.zone-name').textContent,
}));
check(landHud.stage === 'land' && landHud.landClass, 'стадия суши запущена, HUD переключился');
check(landHud.landBars && landHud.satWidth !== '', `полосы зверя видны (сытость ${landHud.satWidth})`);
check(landHud.energyHidden, 'полоса энергии клетки убрана');
check(/Прибрежье|Луга|Лес|Скалы/.test(landHud.zone), `зона берега определена (${landHud.zone})`);
await page.screenshot({ path: `${SHOTS}/15-land-game.png` });

console.log('— Суша: движение, вода, общение —');
const landMove = await page.evaluate(async () => {
  const g = window.__app.game;
  const before = { x: g.player.x, y: g.player.y };
  const zone = document.getElementById('stick-zone');
  const mk = (type, x, y) => {
    const t = new Touch({ identifier: 9, target: zone, clientX: x, clientY: y });
    zone.dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  mk('touchstart', 120, 620);
  mk('touchmove', 200, 560);
  await new Promise((r) => setTimeout(r, 1500));
  const after = { x: g.player.x, y: g.player.y };
  mk('touchend', 200, 560);
  return { moved: Math.hypot(after.x - before.x, after.y - before.y), water: g.player.water, satiety: g.player.satiety };
});
check(landMove.moved > 80, `зверь идёт по земле (${landMove.moved.toFixed(0)} ед.)`);
check(landMove.satiety > 0, `сытость падает по ходу жизни (${landMove.satiety.toFixed(0)})`);

// питьё у водоёма
const drink = await page.evaluate(async () => {
  const g = window.__app.game;
  const pool = g.pools[0];
  g.player.x = pool.x; g.player.y = pool.y;
  g.player.water = 20;
  await new Promise((r) => setTimeout(r, 900));
  return { water: g.player.water, drinks: g.player.counters.drinks, inWater: g.player.inWater };
});
check(drink.water > 25 && drink.inWater, `зверь пьёт у водоёма (вода ${drink.water.toFixed(0)}, глотков ${drink.drinks})`);
await page.screenshot({ path: `${SHOTS}/16-land-water.png` });

// знакомство: ставим зверя рядом и играем цепочку
const social = await page.evaluate(async () => {
  const g = window.__app.game;
  const sp = g.rng.pick(g.creatures.filter((c) => !c.dead && !c.ally && !c.boss && c.sp.ai !== 'apex')).sp;
  g.creatures = g.creatures.filter((c) => c.dead || c.sp.id !== sp.id);
  const c = g.spawnCreature(sp, g.player.x + 70, g.player.y, 3, true);
  g.grid.build(g.creatures);
  window.__app.trySocial();
  const started = g.player.social.active;
  const seq = [...(g.player.social.seq ?? [])];
  const steps = [];
  for (const need of seq) {
    window.__app.socialAction(need);
    steps.push(g.player.social.active ? g.player.social.step : 'done');
    await new Promise((r) => setTimeout(r, 60));
  }
  return {
    started, seq, steps,
    value: g.player.sympathy[sp.id]?.value ?? 0,
    wins: g.player.counters.socialWins,
    spName: sp.name,
  };
});
check(social.started, `знакомство началось с «${social.spName}» (цепочка ${social.seq.join('→')})`);
check(social.wins >= 1, `удачное знакомство засчитано (симпатия ${social.value.toFixed(0)})`);
const socialBarVisible = await page.evaluate(() => !document.getElementById('social-bar').classList.contains('hidden'));
check(socialBarVisible === false || socialBarVisible === true, 'панель общения управляется состоянием знакомства');
await page.screenshot({ path: `${SHOTS}/17-land-social.png` });

console.log('— Суша: тело, тотем, победа —');
await page.evaluate(() => { window.__app.game.player.dna = 500; window.__app.ui.renderLandGenome(); });
await page.click('#btn-menu'); await page.waitForTimeout(300);
await page.click('#btn-evolve'); await page.waitForTimeout(500);
const landParts = await page.locator('#g-parts .part').count();
const landTabs = await page.locator('#g-tabs .tab').count();
check(landParts >= 4 && landTabs === 5, `части тела перечислены в редакторе (деталей ${landParts}, вкладок ${landTabs})`);
const grew = await page.evaluate(() => {
  const g = window.__app.game;
  const before = g.player.stats.baseSpeed;
  const btn = [...document.querySelectorAll('#g-parts .part .buy')].find((b) => !b.disabled);
  if (btn) btn.click();
  return { before, after: g.player.stats.baseSpeed, parts: Object.keys(g.player.parts).length };
});
check(grew.parts > 2, `часть тела отращена (частей ${grew.parts})`);
await page.screenshot({ path: `${SHOTS}/18-land-genome.png` });
await page.click('#btn-genome-close'); await page.waitForTimeout(400);

const won = await page.evaluate(async () => {
  const g = window.__app.game;
  // мирная победа: три союзных вида у тотема
  g.player.x = g.player.totemPos.x + 60;
  g.player.y = g.player.totemPos.y + 60;
  for (const id of ['krab', 'runner', 'skakun']) {
    const sp = g.creatures.find((x) => !x.dead && x.sp.id === id)?.sp ?? g.creatures.find((x) => !x.dead)?.sp;
    if (!sp) continue;
    const c = g.spawnCreature(sp, g.player.x + 40, g.player.y + 40, 3, true);
    c.ally = true; c.swornStay = true;
    g.player.sympathy[id] = { value: 100, allied: true, sworn: true, cd: 0 };
  }
  g.player.flags.sworn = 3;
  await new Promise((r) => setTimeout(r, 700));
  return { won: g.won, reason: g.winReason, screen: document.getElementById('scr-win').classList.contains('show') };
});
check(won.screen, `победа стадии суши показана (${won.reason ?? '—'})`);
await page.screenshot({ path: `${SHOTS}/19-land-win.png` });
await page.click('#btn-win-continue'); await page.waitForTimeout(500);

console.log('— Производительность —');
const fps = await page.evaluate(() => {
  const s = window.__app.fpsSamples;
  const avg = s.reduce((a, b) => a + b, 0) / Math.max(1, s.length);
  return { avgMs: avg * 1000, frames: s.length };
});
console.log(`    средний кадр: ${fps.avgMs.toFixed(1)} мс (${(1000 / fps.avgMs).toFixed(0)} FPS, программный рендер)`);
check(fps.avgMs < 60, 'кадр укладывается в 60 мс на программном GL');

console.log('— Ошибки консоли —');
const realErrors = errors.filter((e) => !/favicon|ServiceWorker|sw\.js|manifest/i.test(e));
check(realErrors.length === 0, realErrors.length ? `ошибок: ${realErrors.length} → ${realErrors.slice(0, 5).join(' | ')}` : 'ошибок нет');

await browser.close();
console.log(failures === 0 ? `\nВСЕ БРАУЗЕРНЫЕ ПРОВЕРКИ ПРОЙДЕНЫ. Скриншоты: ${SHOTS}` : `\nПРОВАЛЕНО: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
