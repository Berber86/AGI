// Welcome/loading + touch controls + post-cake coaster clearance regression.
// Toolchain: tests/tools/setup-runtime.mjs; run beside puppeteer-core.
// node uiqa.mjs [baseURL] [--offline] [--fork-views]  ($QA_OUT or test-results/ui)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.argv.find((a) => /^https?:/.test(a)) || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.env.QA_OUT || path.resolve('test-results/ui'); fs.mkdirSync(OUT, { recursive: true });
const results = [], errors = [];
const check = (name, pass, detail) => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(detail)}`); };
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } });
const view = (page, width, height) => page.setViewport({ width, height, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
const shot = (page, name) => page.screenshot({ path: path.join(OUT, `${name}.webp`), type: 'webp', quality: 84 });
try {
  // Delay the real engine request to exercise the actual boot UI at fixed
  // milestones. This is a DOM test only; a fresh page below boots the engine.
  const ui = await browser.newPage(); await ui.setBypassServiceWorker(true); await ui.setRequestInterception(true);
  ui.on('request', (r) => { if (!r.url().endsWith('/src/main.js')) r.continue(); });
  await ui.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await ui.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const loading = await ui.evaluate(async () => {
    await document.fonts.ready;
    const L = await import('./src/loading.js'); L.setLoading(56, 0, 'Добавляем краски и сладости…');
    L.setLoading(20, 0, 'This stale texture callback must be ignored');
    const bar = document.getElementById('loading-progress'), hud = document.getElementById('hud');
    return { value: bar.getAttribute('aria-valuenow'), fill: document.getElementById('loading-fill').getBoundingClientRect().width / (bar.clientWidth),
      hint: document.getElementById('loading-hint').textContent, hiddenHUD: getComputedStyle(hud).visibility === 'hidden' && hud.inert,
      locked: document.getElementById('btn-play').disabled, art: document.querySelector('.welcome-art').naturalWidth,
      motion: getComputedStyle(document.getElementById('loading-fill')).animationName };
  });
  check('real progress, no rollback, hidden/inert controls during loading', loading.value === '56' && Math.abs(loading.fill - .56) < .02
    && loading.hiddenHUD && loading.locked && loading.art === 960 && loading.motion === 'none' && !loading.hint.includes('stale'), loading);
  await shot(ui, 'welcome-loading');
  await ui.evaluate(async () => {
    const { finishLoading } = await import('./src/loading.js'), { fillRecordsPanel } = await import('./src/hud.js');
    fillRecordsPanel(document.getElementById('records-menu'), { bestTimeMs: null, totalMedals: 0, totalStars: 0, bestSweets: 0, rides: 0 }); finishLoading();
  });
  for (const [width, height] of [[844, 390], [915, 412], [851, 326], [640, 280], [1366, 768]]) {
    await view(ui, width, height);
    const layout = await ui.evaluate(() => {
      const card = document.querySelector('.welcome-card'), r = card.getBoundingClientRect(), b = document.getElementById('btn-play').getBoundingClientRect();
      const allFit = [...document.querySelectorAll('.welcome-heading, .welcome-action, .drive-hint, .welcome-footer')].every((el) => {
        const e = el.getBoundingClientRect(); return e.top >= r.top && e.bottom <= r.bottom && e.left >= r.left && e.right <= r.right;
      });
      return { allFit, scroll: card.scrollHeight - card.clientHeight, button: [b.width, b.height], bounds: [b.top, b.bottom], height: innerHeight,
        noHUD: getComputedStyle(document.getElementById('hud')).visibility === 'hidden', ready: !document.getElementById('btn-play').disabled };
    });
    check(`welcome fits ${width}x${height} without scrolling`, layout.allFit && layout.scroll <= 1 && layout.button[1] >= 44 && layout.bounds[1] < height && layout.noHUD && layout.ready, layout);
    if (width === 851 || width === 1366) await shot(ui, `welcome-${width}x${height}`);
  }
  const failure = await ui.evaluate(async () => {
    const { failLoading } = await import('./src/loading.js'); failLoading('Не удалось загрузить игру. Попробуй ещё раз.');
    return { state: document.body.dataset.boot, alert: !document.getElementById('loading-error').classList.contains('hidden'),
      retry: document.getElementById('btn-reload').getBoundingClientRect().height, locked: document.getElementById('btn-play').disabled };
  });
  check('startup error has a visible retry, not a disabled-menu dead end', failure.state === 'error' && failure.alert && failure.retry >= 44 && failure.locked, failure);
  await ui.close();

  // Real engine and real gestures — no boot-state or steering mocks.
  const page = await browser.newPage();
  await page.setBypassServiceWorker(false);
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${m.text()} (${m.location().url || 'unknown URL'})`); });
  await page.evaluateOnNewDocument(() => {
    window.__BOOT_VALUES__ = [];
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) if (m.target.id === 'loading-progress') {
        const n = Number(m.target.getAttribute('aria-valuenow'));
        if (window.__BOOT_VALUES__.at(-1) !== n) window.__BOOT_VALUES__.push(n);
      }
    });
    observer.observe(document, { subtree: true, attributes: true, attributeFilter: ['aria-valuenow'] });
  });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
  const boot = await page.evaluate(() => {
    __TEST__.pinQuality(0); __TEST__.internals().governor.hold(10000);
    return { values: window.__BOOT_VALUES__, state: document.body.dataset.boot, ui: document.body.dataset.screen,
      ready: !document.getElementById('btn-play').disabled, busy: document.querySelector('.welcome-action').getAttribute('aria-busy') };
  });
  check('real cold boot reports completed stages and unlocks Play', boot.values.at(-1) === 100 && boot.values.includes(78) && boot.values.includes(96)
    && boot.values.every((n, i, all) => i === 0 || n >= all[i - 1]) && boot.state === 'ready' && boot.ui === 'menu' && boot.ready && boot.busy === 'false', boot);
  await page.tap('#btn-menu-sound');
  const muted = await page.$eval('#btn-menu-sound', (b) => b.classList.contains('is-muted') && b.getAttribute('aria-pressed') === 'false');
  await page.tap('#btn-menu-sound');
  const unmuted = await page.$eval('#btn-menu-sound', (b) => !b.classList.contains('is-muted') && b.querySelectorAll('svg').length === 2);
  check('menu sound control toggles and preserves SVG icons', muted && unmuted, { muted, unmuted });
  await page.tap('#btn-play');
  await page.evaluate(() => { __TEST__.fastForwardCountdown(); __TEST__.step(1 / 60, 90, false); });
  const active = await page.evaluate(() => ({ state: __TEST__.state(), ui: document.body.dataset.screen, inert: document.getElementById('hud').inert }));
  check('Play starts a real ride and only then enables controls', active.state === 'racing' && active.ui === 'game' && !active.inert, active);

  for (const [id, sign] of [['btn-left', -1], ['btn-right', 1]]) {
    await page.evaluate(() => { const T = __TEST__, { track } = T.internals(); T.setProgress((track.cakeSection.bridge.s0 + 30) / track.length, 0, false); });
    const r = await (await page.$(`#${id}`)).boundingBox();
    await page.touchscreen.touchStart(r.x + r.width / 2, r.y + r.height / 2);
    const held = await page.evaluate((id) => {
      __TEST__.step(1 / 60, 24, false); const b = document.getElementById(id);
      return { lateral: __TEST__.gameInfo().lateral, pressed: b.classList.contains('is-pressed'), aria: b.getAttribute('aria-pressed') };
    }, id);
    await page.touchscreen.touchEnd();
    const released = await page.$eval(`#${id}`, (b) => !b.classList.contains('is-pressed') && b.getAttribute('aria-pressed') === 'false');
    check(`${id}: held touch, press feedback and release`, sign * held.lateral > 1 && held.pressed && held.aria === 'true' && released && r.width >= 76 && r.height >= 70, { held, released, target: [r.width, r.height] });
  }
  const multipointer = await page.evaluate(() => {
    const b = document.getElementById('btn-left'), ev = (type, id) => b.dispatchEvent(new PointerEvent(type, { pointerId: id, bubbles: true }));
    ev('pointerdown', 41); ev('pointerdown', 42); ev('pointerup', 41);
    const stillHeld = b.getAttribute('aria-pressed') === 'true'; ev('pointercancel', 42);
    return { stillHeld, released: b.getAttribute('aria-pressed') === 'false' && !b.classList.contains('is-pressed') };
  });
  await page.keyboard.down('ArrowRight');
  const keyboard = await page.$eval('#btn-right', (b) => b.getAttribute('aria-pressed') === 'true');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  const blur = await page.$eval('#btn-right', (b) => b.getAttribute('aria-pressed') === 'false'); await page.keyboard.up('ArrowRight');
  check('multitouch, keyboard and blur share non-sticky feedback', multipointer.stillHeld && multipointer.released && keyboard && blur, { multipointer, keyboard, blur });

  await page.tap('#btn-pause');
  const paused = await page.evaluate(() => ({ state: __TEST__.state(), inert: document.getElementById('hud').inert, visible: getComputedStyle(document.getElementById('hud')).visibility }));
  await page.tap('#btn-resume');
  const resumed = await page.evaluate(() => __TEST__.state() === 'racing' && !document.getElementById('hud').inert);
  check('pause hides/disables controls; resume restores them', paused.state === 'paused' && paused.inert && paused.visible === 'hidden' && resumed, { paused, resumed });

  await page.tap('#btn-full');
  await page.waitForFunction('document.fullscreenElement && document.getElementById("btn-full").getAttribute("aria-pressed") === "true"', { timeout: 10000 });
  await page.tap('#btn-full');
  await page.waitForFunction('!document.fullscreenElement && document.getElementById("btn-full").getAttribute("aria-pressed") === "false"', { timeout: 10000 });
  check('fullscreen button enters/exits and reports its real state', true, { entered: true, exited: true });

  const coaster = await page.evaluate(async () => {
    const THREE = await import('three');
    const T = __TEST__, { world, track, scene, camera } = T.internals(), c = world.coaster;
    const paths = track.samplePaths;
    const distance = (p) => {
      let best = Infinity;
      for (const samples of paths) for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1], b = samples[i], dx = b.x - a.x, dz = b.z - a.z;
        const k = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / (dx * dx + dz * dz)));
        best = Math.min(best, Math.hypot(p.x - a.x - k * dx, p.z - a.z - k * dz));
      }
      return best;
    };
    let railClearance = Infinity, postClearance = Infinity;
    for (let i = 0; i <= 600; i++) railClearance = Math.min(railClearance, distance(c.curve.getPointAt(i / 600)) - 0.55);
    for (let i = 0; i < 22; i++) postClearance = Math.min(postClearance, distance(c.curve.getPointAt(i / 22)) - 0.5);
    world.update(0, camera.position, .8, 23);
    const trainError = Math.max(...c.cars.map((car, i) => car.position.distanceTo(c.curve.getPointAt((23 * .042 + i * .042) % 1).add(new THREE.Vector3(0, -.55, 0)))));
    scene.updateMatrixWorld(true); const rc = new THREE.Raycaster(); rc.far = 5;
    let blocked = 0;
    // Extend past the cake section: the previous test stopped before this exit.
    for (let s = track.cakeSection.descent.s1; s < T.tunnelInfo().range[1] + 180; s += 1.5) for (const lat of [-7.8, -6.4, -3.2, 0, 3.2, 6.4, 7.8]) {
      const p = track.getPose(s, lat).pos; rc.set(p.add(new THREE.Vector3(0, .1, 0)), new THREE.Vector3(0, 1, 0));
      if (rc.intersectObject(c.group, true).length) blocked++;
    }
    return { railClearance, postClearance, trainError, blocked, rig: c.group.name };
  });
  check('all coaster supports/rails clear road; moving train stays aligned', coaster.railClearance > 16 && coaster.postClearance > 16 && coaster.trainError < 1e-6 && coaster.blocked === 0, coaster);

  await view(page, 915, 412);
  await page.evaluate(() => {
    const T = __TEST__, { track, governor } = T.internals(); T.pinQuality(2); governor.hold(10000);
    T.setProgress((track.cakeSection.ascent.s0 + 110) / track.length, 0, true); T.snapCamera(); T.step(1 / 60, 2, true);
  });
  await shot(page, 'driving-controls');
  await page.evaluate(() => {
    const T = __TEST__, { track } = T.internals(); T.setProgress(1480 / track.length, 0, true); T.snapCamera(); T.step(1 / 60, 2, true);
  });
  await shot(page, 'coaster-clear-road');
  const controls = await page.evaluate(() => ['btn-left', 'btn-right', 'btn-sound', 'btn-pause', 'btn-full'].map((id) => {
    const r = document.getElementById(id).getBoundingClientRect(); return { id, size: [r.width, r.height], fits: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight };
  }));
  check('all live controls fit, every target at least 44px', controls.every((r) => r.fits && r.size.every((v) => v >= 44)), controls);
  // Optional release captures reuse this already-booted page; no need to
  // repeat the complete fork physics suite just to inspect the final scenery.
  if (process.argv.includes('--fork-views')) {
    await view(page, 915, 412);
    await page.evaluate(() => { __TEST__.pinQuality(1); __TEST__.internals().governor.hold(10000); });
    for (const [name, fi, option, q] of [
      ['fork-choice-1', 0, 0, -.24], ['fork-gummy-hills', 0, 0, .35], ['fork-star-tunnel', 0, 1, .40],
      ['fork-choice-2', 1, 0, -.21], ['fork-cookie-jump', 1, 0, .67], ['fork-cloud-bridge', 1, 1, .40],
    ]) {
      await page.evaluate(([fi, option, q]) => {
        const T = __TEST__, { track } = T.internals(), f = track.routes.forks[fi];
        T.startRace(); T.chooseFork(f.id, option);
        if (q < 0) { f.selected = null; f.pending = option; }
        T.setProgress((f.s0 + f.span * q) / track.length, 0, true);
        T.step(1 / 60, 30, false); T.snapCamera(); T.step(1 / 60, 1, true);
      }, [fi, option, q]);
      await shot(page, name);
      console.log(`CAPTURE ${name}`);
    }
  }

  for (const [width, height] of [[851, 326], [640, 280]]) {
    await view(page, width, height);
    const panel = await page.evaluate(() => {
      const T = __TEST__, { track } = T.internals(); T.startRace(); T.setProgress((track.routes.forks[0].s0 - 35) / track.length, 0, true); T.step(1 / 60, 1, false);
      const absent = !document.querySelector('#fork-hint, #fork-live, [data-fork-side]');
      const controls = ['btn-left', 'btn-right'].map((id) => {
        const b = document.getElementById(id), r = b.getBoundingClientRect();
        return r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && getComputedStyle(b).visibility === 'visible';
      });
      return { absent, controls };
    });
    check(`fork approach ${width}x${height}: no route hints, steering remains usable`, panel.absent && panel.controls.every(Boolean), panel);
  }
  await view(page, 915, 412);
  const finished = await page.evaluate(() => {
    const T = __TEST__; T.setProgress(.999, 0, false); T.step(1 / 60, 60, false);
    return { state: T.state(), ui: document.body.dataset.screen, inert: document.getElementById('hud').inert };
  });
  await page.tap('#btn-menu2');
  const back = await page.evaluate(() => document.body.dataset.screen === 'menu' && !document.getElementById('btn-play').disabled && document.getElementById('hud').inert);
  check('finish and back-to-menu also hide/inactivate driving controls', finished.state === 'finish' && finished.ui === 'finish' && finished.inert && back, { finished, back });
  for (const [width, height] of [[360, 800], [412, 915]]) {
    await view(page, width, height);
    const portrait = await page.evaluate(() => ({ shown: getComputedStyle(document.getElementById('portrait-hint')).display === 'flex', overflow: document.documentElement.scrollWidth > innerWidth }));
    check(`portrait ${width}x${height}: rotate hint, no overflow`, portrait.shown && !portrait.overflow, portrait);
  }
  // An active registration can still be 'activating': wait until THIS page
  // is controlled before disabling the network, not just until caches exist.
  await page.waitForFunction('navigator.serviceWorker.controller?.state === "activated"', { timeout: 30000 });
  const cached = await page.evaluate(async () => {
    const c = await caches.open('ckc-v23'), urls = ['./src/boot.js', './src/loading.js', './assets/ui/welcome.webp', './assets/ui/fonts/nunito-latin.woff2', './assets/ui/fonts/nunito-cyrillic.woff2', './assets/textures/fonts/Fredoka-Bold.woff2', './src/routes.js', './src/forks.js'];
    return await Promise.all(urls.map(async (url) => ({ url, cached: !!(await c.match(url)) })));
  });
  check('new UI, artwork, fonts and loader are cached', cached.every((r) => r.cached), cached);
  if (process.argv.includes('--offline')) {
    await page.setBypassServiceWorker(false);
    await page.setOfflineMode(true); await page.reload({ waitUntil: 'networkidle0', timeout: 120000 });
    await page.waitForFunction('window.__READY__ === true || document.body.dataset.boot === "error"', { timeout: 120000 });
    const offline = await page.evaluate(() => ({ state: document.body.dataset.boot, art: document.querySelector('.welcome-art').naturalWidth, ready: !document.getElementById('btn-play').disabled, forks: __TEST__.forks().length, routes: __TEST__.forks().flatMap((f) => f.routes).length }));
    check('real offline reload reaches the illustrated ready screen', offline.state === 'ready' && offline.art === 960 && offline.ready && offline.forks === 2 && offline.routes === 4, offline);
    await page.setOfflineMode(false);
  }
  check('no browser errors in the real game', errors.length === 0, errors);
} catch (e) { check('test execution', false, e.stack); }
finally { await browser.close(); fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ baseURL: BASE, results, errors }, null, 2)); }
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} UI checks passed`);
process.exitCode = results.some((r) => !r.pass) ? 1 : 0;
