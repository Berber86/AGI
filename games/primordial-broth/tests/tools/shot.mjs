// shot.mjs — deterministic screenshots for visual QA of «Первичный бульон».
// Usage: node shot.mjs <outDir> <spec>...   spec = name:scene[:arg]
//   scenes: start | play | mid | shore | mutation | dense | hunt | win
// Example: node shot.mjs /home/user/shots intro:start mid:mid:4
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/primordial-broth/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const specs = process.argv.slice(3);
if (!specs.length) specs.push('start:start', 'play:play');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  protocolTimeout: 600000,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: 1280, height: 720, isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const errors = [];
page.on('pageerror', (e) => errors.push(`PAGEERROR ${String(e).slice(0, 300)}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE ${m.text().slice(0, 300)}`); });
page.on('requestfailed', (r) => errors.push(`REQ ${r.url().slice(0, 120)} ${r.failure()?.errorText}`));

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__GAME_TEST__ && window.__GAME_TEST__.ready === true', { timeout: 180000 });
await sleep(1200);

async function frames(n = 3) {
  await page.evaluate((count) => new Promise((resolve) => {
    let i = 0;
    const step = () => {
      i += 1;
      if (i >= count) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), n);
}

function parseSpec(spec) {
  const [name, scene = 'play', arg] = spec.split(':');
  return { name, scene, arg };
}

for (const spec of specs) {
  const { name, scene, arg } = parseSpec(spec);
  if (scene === 'start') {
    await page.evaluate(() => window.__GAME_TEST__.hud.showScreen('screen-start'));
  } else if (scene === 'mutation') {
    await page.evaluate(() => {
      const t = window.__GAME_TEST__;
      t.reset(7);
      t.setStage(3);
      t.game.generation = 1;
      t.game.run.biomass = 15;
      t.hud.update(t.game);
      t.hud.setMutationText('Поколение 1 завершено. Выберите одну часть тела — она останется с вами до конца заплыва.');
      t.hud.renderMutation(['flagellum', 'spike', 'jaw'].slice(0, 3), () => {});
      t.hud.showScreen('screen-mutation');
    });
  } else if (scene === 'win') {
    await page.evaluate(() => {
      const t = window.__GAME_TEST__;
      t.reset(11);
      t.finishNow();
    });
  } else {
    // gameplay scenes
    await page.evaluate((st) => {
      const t = window.__GAME_TEST__;
      t.reset(7);
      const stage = st.arg ? Number(st.arg) : 1;
      if (stage > 1) t.setStage(stage);
      if (st.scene === 'mid') {
        t.game.run.biomass = [0, 6, 15, 30, 52, 82, 122, 174][Math.max(0, stage - 1)] + 8;
        t.givePart('flagellum');
        if (stage >= 3) t.givePart('spike');
        if (stage >= 4) t.givePart('stinger');
        if (stage >= 5) t.givePart('venom');
        t.teleport(1800, 1700);
      }
      if (st.scene === 'shore') {
        for (const id of ['flagellum', 'cilia', 'spike', 'stinger', 'venom', 'electric', 'jaw']) t.givePart(id);
        t.setStage(8);
        t.game.finalPhase = true;
        t.teleport(t.world.shoreStart - 260, 1600);
      }
      if (st.scene === 'dense') {
        t.setStage(5);
        t.teleport(1400, 1700);
        for (let i = 0; i < 26; i += 1) {
          const a = (i / 26) * Math.PI * 2;
          t.spawnKind(i % 3 === 0 ? 'cell' : 'plankton', Math.cos(a) * (140 + i * 12), Math.sin(a) * (140 + i * 12));
        }
      }
      if (st.scene === 'hunt') {
        t.setStage(4);
        t.givePart('spike');
        t.teleport(2200, 1700);
        for (let i = 0; i < 4; i += 1) t.spawnKind('hunter', 260 + i * 150, -120 + i * 90);
        for (let i = 0; i < 3; i += 1) t.spawnKind('grazer', -300 - i * 120, 200 - i * 90);
        for (let i = 0; i < 5; i += 1) t.spawnKind('swarmling', -160 + i * 70, -240 + i * 30);
      }
      t.hud.hideScreens();
      t.step(1 / 60, 30);
    }, { scene, arg });
    await frames(4);
    await sleep(400);
  }

  // hide HUD on plain "graphics" shots to judge the water on its own
  const keepHud = process.env.HUD !== '0';
  await page.evaluate((show) => {
    document.getElementById('hud').style.display = show ? '' : 'none';
  }, keepHud);

  await sleep(400);
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, captureBeyondViewport: false, optimizeForSpeed: true, timeout: 300000 });
  const state = await page.evaluate(() => window.__GAME_TEST__.getState());
  const metrics = await page.evaluate(() => window.__GAME_TEST__.metrics());
  console.log(`shot ${name} -> ${path}  mode=${state.mode} stage=${state.stage} entities=${state.entities} fps=${metrics.fps} frameMs=${metrics.frameMs} drawn=${metrics.drawn}`);
}

if (errors.length) {
  console.error('--- page problems ---');
  for (const e of errors.slice(0, 20)) console.error(e);
} else {
  console.log('no page errors');
}
await browser.close();
