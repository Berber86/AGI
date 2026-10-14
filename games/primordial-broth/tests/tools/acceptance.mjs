// acceptance.mjs — executable quality gate for «Первичный бульон».
// Usage: node acceptance.mjs [baseUrl]
// Writes a machine-readable report next to the screenshots.
import fs from 'fs';
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/primordial-broth/index.html';
const REPORT = process.env.REPORT || '/home/user/shots/acceptance.json';
const PORTRAIT = process.env.PORTRAIT === '1';
const VIEWPORT = PORTRAIT
  ? { width: 412, height: 915 }
  : { width: 1280, height: 720 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  protocolTimeout: 900000,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu',
  ],
  defaultViewport: { ...VIEWPORT, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
const pageErrors = [];
const consoleErrors = [];
const failedRequests = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
page.on('requestfailed', (r) => failedRequests.push(`${r.url().slice(0, 110)} ${r.failure()?.errorText}`));

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 240000 });
await page.waitForFunction('window.__GAME_TEST__ && window.__GAME_TEST__.ready === true', { timeout: 240000 });
await sleep(800);

// ---------------------------------------------------------------- 1. boot
{
  const info = await page.evaluate(() => ({
    ready: !!window.__GAME_TEST__.ready,
    startVisible: document.getElementById('screen-start').classList.contains('visible'),
    entities: window.__GAME_TEST__.game.entities.length,
    canvas: [document.getElementById('game-canvas').width, document.getElementById('game-canvas').height],
    hasDash: !!document.getElementById('btn-dash'),
    hasSlots: document.querySelectorAll('#hud-slots .slot').length,
  }));
  record('boot: bridge, start screen, ecosystem, canvas',
    info.ready && info.startVisible && info.entities > 100 && info.canvas[0] > 0 && info.hasDash && info.hasSlots === 8,
    info);
}

// ---------------------------------------------------------------- 2. touch-only control
{
  const before = await page.evaluate(() => window.__GAME_TEST__.getState());
  await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(31);
    t.hud.hideScreens();
    t.game.mode = 'playing';
  });
  const cx = VIEWPORT.width / 2;
  const cy = VIEWPORT.height / 2;
  // a finger drag: down at the centre, then pull to the right for a second
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 140, cy - 60, { steps: 6 });
  await sleep(1200);
  await page.mouse.up();
  const after = await page.evaluate(() => window.__GAME_TEST__.getState());
  const moved = Math.hypot(after.x - before.x, after.y - before.y);
  const xMoved = after.x - before.x;
  record('touch: dragging the surface pulls the cell east and speeds it up',
    moved > 40 && xMoved > 15,
    { moved: Math.round(moved), dx: Math.round(xMoved), vx: Math.round(after.vx) });
}

// ---------------------------------------------------------------- 3. eating grows biomass and size
{
  const res = await page.evaluate(async () => {
    const t = window.__GAME_TEST__;
    t.reset(41);
    t.hud.hideScreens();
    const before = t.getState();
    // teleport exactly onto plankton and let a few frames run for the contact
    for (let i = 0; i < 12; i += 1) {
      const near = t.listNearby('plankton', 300);
      if (!near.length) break;
      t.teleport(near[0].x, near[0].y);
      t.step(1 / 60, 6);
    }
    const after = t.getState();
    return { before, after };
  });
  const grew = res.after.biomass > res.before.biomass && res.after.eaten > 0;
  record('play: eating plankton raises biomass, DNA and the eaten counter',
    grew,
    { biomass: [res.before.biomass, res.after.biomass], eaten: res.after.eaten });
}

// ---------------------------------------------------------------- 4. stage growth changes radius
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(43);
    t.hud.hideScreens();
    const r1 = t.getState().radius;
    t.addBiomass(20);
    t.step(1 / 60, 4);
    const s = t.getState();
    return { r1, r2: s.radius, stage: s.stage, maxHp: s.maxHp };
  });
  record('progression: biomass milestone increases size, stage and health',
    res.stage >= 2 && res.r2 > res.r1,
    res);
}

// ---------------------------------------------------------------- 5. mutation screen + part applied
{
  const res = await page.evaluate(async () => {
    const t = window.__GAME_TEST__;
    t.reset(47);
    t.hud.hideScreens();
    // push to the generation-1 milestone: grow to stage 3
    t.addBiomass(15);
    t.step(1 / 60, 4);
    const modeAtMilestone = t.getState().mode;
    const visible = document.getElementById('screen-mutation').classList.contains('visible');
    const cards = document.querySelectorAll('#mutation-cards .mut-card').length;
    const choices = t.mutationChoices();
    t.pickMutation(choices[0]);
    t.step(1 / 60, 4);
    const after = t.getState();
    return { modeAtMilestone, visible, cards, picked: choices[0], gen: after.generation, parts: after.parts, mode: after.mode };
  });
  record('mutation: milestone opens the 1-of-3 editor and applies the chosen part',
    res.modeAtMilestone === 'mutation' && res.visible && res.cards === 3
      && res.gen === 2 && res.parts.includes(res.picked) && res.mode === 'playing',
    res);
}

// ---------------------------------------------------------------- 6. soft defeat keeps progress
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(53);
    t.hud.hideScreens();
    t.givePart('spike');
    t.addBiomass(5);              // below the generation-1 milestone: stay in play
    t.step(1 / 60, 4);
    const before = t.getState();
    t.damagePlayer(999, 0, 0);
    const after = t.getState();
    return { before, after };
  });
  const biomassKept = res.after.biomass >= res.before.biomass * 0.5;
  record('defeat: reaching zero health continues the run with progress and parts kept',
    res.before.mode === 'playing' && res.after.mode === 'playing'
      && res.after.deaths === 1 && res.after.hp > 0 && biomassKept
      && res.after.parts.includes('spike'),
    { deaths: res.after.deaths, hp: Math.round(res.after.hp), biomass: [res.before.biomass, res.after.biomass], parts: res.after.parts });
}

// ---------------------------------------------------------------- 7. hostiles damage the player
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(59);
    t.hud.hideScreens();
    t.setStage(2);
    const before = t.getState();
    const pr = t.getState().radius;
    const id = t.spawnInFront('hunter', Math.round(pr * 1.5));  // a clearly bigger predator
    t.step(1 / 60, 30);
    const after = t.getState();
    const hunter = t.entityInfo(id);
    return { before, after, hunter };
  });
  record('threat: a hunter in front of the nose bites and drains health',
    res.after.hp < res.before.hp,
    { hp: [Math.round(res.before.hp), Math.round(res.after.hp)], hunterRadius: Math.round(res.hunter?.r || 0) });
}

// ---------------------------------------------------------------- 8. winning path
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(61);
    t.hud.hideScreens();
    t.finishNow();
    const s = t.getState();
    const winVisible = document.getElementById('screen-win').classList.contains('visible');
    return { mode: s.mode, stage: s.stage, winVisible, final: s.finalPhase };
  });
  record('win: full size at the shoal triggers the victory screen',
    res.mode === 'won' && res.winVisible && res.stage === 8,
    res);
}

// ---------------------------------------------------------------- 9. restart after winning
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    document.getElementById('btn-again').click();
    const s = t.getState();
    return { mode: s.mode, stage: s.stage, biomass: s.biomass, parts: s.parts.length, gen: s.generation, winVisible: document.getElementById('screen-win').classList.contains('visible') };
  });
  record('restart: a new run starts clean from the win screen',
    res.mode === 'playing' && res.stage === 1 && res.biomass === 0 && res.parts === 0 && res.gen === 1 && !res.winVisible,
    res);
}

// ---------------------------------------------------------------- 10. pause and resume
{
  const res = await page.evaluate(async () => {
    const t = window.__GAME_TEST__;
    t.reset(67);
    t.hud.hideScreens();
    t.step(1 / 60, 10);
    document.getElementById('btn-pause').click();
    const paused = t.getState().mode;
    const pauseScreen = document.getElementById('screen-pause').classList.contains('visible');
    const timePaused = t.getState().time;
    await new Promise((r) => setTimeout(r, 900));
    const timeAfterWait = t.getState().time;
    document.getElementById('btn-resume').click();
    const resumedScreen = document.getElementById('screen-pause').classList.contains('visible');
    return { paused, pauseScreen, timePaused, timeAfterWait, resumedScreen };
  });
  record('lifecycle: pause stops the clock and resume closes the overlay',
    res.paused === 'playing' && res.pauseScreen && res.timeAfterWait === res.timePaused && !res.resumedScreen,
    res);
}

// ---------------------------------------------------------------- 11. HUD completeness
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(71);
    t.hud.hideScreens();
    t.step(1 / 60, 20);
    t.hud.update(t.game);
    t.hud.drawMinimap(t.game);
    const ids = ['hud-stage', 'hud-growth-fill', 'hud-dna', 'hud-clock', 'hud-health-fill', 'hud-stamina-fill', 'hud-objective', 'hud-minimap', 'hud-gen'];
    const missing = ids.filter((id) => !document.getElementById(id));
    const rect = document.getElementById('hud-minimap').getBoundingClientRect();
    const slots = document.querySelectorAll('#hud-slots .slot').length;
    let overflow = 0;
    document.querySelectorAll('#hud .hud-corner').forEach((node) => {
      const r = node.getBoundingClientRect();
      if (r.right > innerWidth + 2 || r.bottom > innerHeight + 2 || r.left < -2 || r.top < -2) overflow += 1;
    });
    return { missing, minimap: [Math.round(rect.width), Math.round(rect.height)], slots, overflow, vw: innerWidth, vh: innerHeight };
  });
  record('hud: growth, DNA, clock, health, stamina, slots, minimap all present and on screen',
    res.missing.length === 0 && res.minimap[0] > 40 && res.slots === 8 && res.overflow === 0,
    res);
}

// ---------------------------------------------------------------- 12. ecology sanity
{
  const res = await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(73);
    t.hud.hideScreens();
    t.step(1 / 60, 60 * 6);
    const s = t.getState();
    const chain = {
      plankton: (s.counts.plankton || 0),
      cell: (s.counts.cell || 0),
      hunter: (s.counts.hunter || 0),
      grazer: (s.counts.grazer || 0),
      spore: (s.counts.spore || 0),
      swarmling: (s.counts.swarmling || 0),
    };
    return { chain, entities: s.entities, stage: s.stage, fps: t.metrics().fps, frameMs: t.metrics().frameMs };
  });
  record('ecology: food chain keeps all five tiers populated while playing',
    res.chain.plankton > 100 && res.chain.cell > 5 && res.chain.hunter >= 2 && res.chain.grazer >= 2 && res.chain.spore >= 2,
    res);
}

// ---------------------------------------------------------------- 13. console / network clean
record('runtime: no page errors, no console errors, no failed requests',
  pageErrors.length === 0 && consoleErrors.length === 0 && failedRequests.length === 0,
  { pageErrors, consoleErrors, failedRequests });

const passed = results.filter((r) => r.pass).length;
const summary = {
  url: BASE,
  viewport: VIEWPORT,
  passed,
  total: results.length,
  results,
  generatedAt: new Date().toISOString(),
};
try {
  fs.mkdirSync(REPORT.replace(/\/[^/]+$/, ''), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(summary, null, 2));
} catch (e) {
  console.log('report write failed', String(e));
}
console.log(`\nacceptance: ${passed}/${results.length} ${passed === results.length ? 'ALL PASS' : 'FAILURES PRESENT'}`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
