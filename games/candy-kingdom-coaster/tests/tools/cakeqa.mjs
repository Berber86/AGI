// Cake-pass browser regression: real meshes, driving, mobile input, offline cache.
// Copy beside the QA toolchain's node_modules, as with gameqa.mjs; see CAKE_PASS.md.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.env.CKC_EVIDENCE || path.resolve('.playwright/cakes');
fs.mkdirSync(OUT, { recursive: true });
const results = [], errors = [];
const record = (name, pass, detail) => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name} ${JSON.stringify(detail)}`); };
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true, protocolTimeout: 180000,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
});
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
  const info = await page.evaluate(() => window.__TEST__.cakeInfo());
  record('two cakes, elevated bridge and three distinct road surfaces', info.up.y1 - info.up.y0 > 33.9 && info.down.y0 - info.down.y1 > 33.9 && Math.abs(info.bridge.y0 - info.bridge.y1) < 0.01 && info.surfaces.join(',') === 'road,roadWaffle,roadChoco', info);

  const corridor = await page.evaluate(async () => {
    const THREE = await import('three');
    const T = window.__TEST__, { scene, camera, track } = T.internals();
    scene.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(); ray.camera = camera;
    const down = new THREE.Vector3(0, -1, 0), bad = []; let rays = 0;
    const noCollide = (o) => { for (let q = o; q; q = q.parent) if (q.userData.noCollide) return true; return false; };
    for (let s = track.cakes.s0 - 4; s < track.cakes.s1 + 4; s += 3.1) {
      for (const lat of [-6.3, -3.2, 0, 3.2, 6.3]) {
        const p = track.getPose(s, lat).pos;
        ray.set(p.clone().addScaledVector(new THREE.Vector3(0, 1, 0), 2), down);
        const hit = ray.intersectObjects(scene.children, true).find((h) => h.object.isMesh && h.object.visible && !noCollide(h.object));
        rays++;
        if (!hit || Math.abs(hit.distance - 2) > 0.28) bad.push({ s, lat, distance: hit?.distance, name: hit?.object.name, material: hit?.object.material?.color?.getHexString() });
      }
    }
    return { rays, bad: bad.slice(0, 20), totalBad: bad.length };
  });
  record('full-width drivable corridor: no cake, bridge, mountain or scenery intersections', corridor.totalBad === 0, corridor);

  const budget = await page.evaluate(() => {
    const { cakes } = window.__TEST__.internals(); let meshes = 0, triangles = 0;
    cakes.group.traverse((o) => { if (o.isMesh) { meshes++; triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; } });
    return { meshes, triangles };
  });
  record('static landmark batch budget', budget.meshes <= 42 && budget.triangles < 130000, budget);

  for (const boosted of [false, true]) {
    const drive = await page.evaluate((boosted) => {
      const T = window.__TEST__, { track, car, camera } = T.internals(), r = track.cakes;
      T.startRace(); T.setProgress((r.s0 - 8) / track.length, 0, false); T.forceBoost(boosted ? 90 : 0.001); T.holdSteer(0);
      let frames = 0, airFrames = 0, finite = true, maxHeightError = 0, maxStep = 0;
      T.step(1 / 60, 1, false); let previous = car.root.position.clone();
      while (T.jumpInfo().s < r.s1 + 8 && frames < 12000) {
        T.step(1 / 60, 6, false); frames += 6;
        const j = T.jumpInfo();
        if (j.jump !== 'ground') airFrames++;
        finite &&= [...camera.position.toArray(), ...car.root.position.toArray()].every(Number.isFinite);
        const height = track.getPose(j.s, j.lateral).pos.y;
        maxHeightError = Math.max(maxHeightError, Math.abs(car.root.position.y - height - 0.02));
        maxStep = Math.max(maxStep, car.root.position.distanceTo(previous)); previous.copy(car.root.position);
      }
      T.holdSteer(null);
      return { frames, airFrames, finite, maxHeightError, maxStep, end: T.jumpInfo().s, requiredEnd: r.s1 + 8 };
    }, boosted);
    record(`uninterrupted ${boosted ? 'boosted' : 'normal'} drive up → bridge → down`, drive.end >= drive.requiredEnd && drive.airFrames === 0 && drive.finite && drive.maxHeightError < 0.03 && drive.maxStep < 3.3, drive);
  }

  const readability = await page.evaluate(() => {
    const T = window.__TEST__, { track } = T.internals(), out = [];
    T.forceBoost(0.001);
    for (const name of ['up', 'bridge', 'down']) for (const t of [0.1, 0.45, 0.8]) {
      const r = track.cakes[name]; T.setProgress((r.s0 + (r.s1 - r.s0) * t) / track.length, 0, true);
      T.snapCamera(); T.step(1 / 60, 1, false);
      const visible = T.roadScreenPoints(8, 36, 4).filter((p) => p.onScreen).length;
      out.push({ part: name, t, visible });
    }
    return out;
  });
  record('chase camera reads the next 8–36 m on both tight spirals', readability.every((r) => r.visible >= 4), readability);

  // Real emulated touch: hold a screen button while deterministic frames run.
  await page.evaluate(() => {
    const T = window.__TEST__, { track } = T.internals();
    T.setProgress((track.cakes.up.s0 + 50) / track.length, 0, false);
  });
  const b = await page.$eval('#btn-right', (e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const touch = await page.touchscreen.touchStart(b.x, b.y);
  const held = await page.evaluate(() => window.__TEST__.step(1 / 60, 45, false));
  await touch.end();
  const released = await page.evaluate(() => window.__TEST__.step(1 / 60, 45, false));
  record('touch steering and release on the ascent', held.lateral > 2 && released.lateral < held.lateral, { held: held.lateral, released: released.lateral });

  const finish = await page.evaluate(() => {
    const T = window.__TEST__, { track } = T.internals();
    T.setProgress((track.cakes.down.s1 - 12) / track.length, 0, false);
    T.step(1 / 60, 1400, false); const state = T.state();
    document.getElementById('btn-restart2').click();
    return { state, restarted: T.state(), sweets: T.gameInfo().collected, time: T.gameInfo().timeS };
  });
  record('descent continues to the castle finish; replay resets the run', finish.state === 'finish' && finish.restarted === 'intro' && finish.sweets === 0 && finish.time < 0.1, finish);

  for (const [width, height] of [[360, 800], [412, 915]]) {
    await page.setViewport({ width, height, isMobile: true, hasTouch: true });
    const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, hint: getComputedStyle(document.getElementById('portrait-hint')).display }));
    record(`mobile ${width}×${height} orientation guard`, !layout.overflow && layout.hint !== 'none', layout);
  }

  await page.waitForFunction('navigator.serviceWorker.controller !== null', { timeout: 30000 });
  await page.setOfflineMode(true);
  const offline = await page.evaluate(async () => {
    const paths = ['./index.html', './src/cake-course.js', './src/cakes.js', './src/track.js'];
    return Promise.all(paths.map(async (p) => { const res = await fetch(p); const text = await res.text(); return { path: p, ok: res.ok, bytes: text.length, js: !p.endsWith('.js') || text.includes('import ') }; }));
  });
  await page.setOfflineMode(false);
  record('PWA caches both new modules for offline play', offline.every((p) => p.ok && p.js && p.bytes > 100), offline);

  // Actual rendered evidence. Not committed: no large generated media in Git.
  await page.setViewport({ width: 1100, height: 680, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const T = window.__TEST__, { track } = T.internals(), r = track.cakes;
    T.pinQuality(2); T.hideHUD(); T.setProgress((r.bridge.s0 + 40) / track.length, 0, true);
    const x = (r.up.center.x + r.down.center.x) / 2, z = (r.up.center.z + r.down.center.z) / 2, h = r.heading;
    const dx = 20, dz = -190;
    T.fixCam(x + dx * Math.cos(h) + dz * Math.sin(h), 116, z - dx * Math.sin(h) + dz * Math.cos(h), x, 19, z);
    T.step(1 / 60, 1, true);
  });
  await page.screenshot({ path: path.join(OUT, 'cakes-overview.png') });
  await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true });
  for (const name of ['up', 'bridge', 'down']) {
    await page.evaluate((name) => {
      const T = window.__TEST__, { track } = T.internals(), r = track.cakes[name];
      T.fixCam(null); T.setProgress((r.s0 + (r.s1 - r.s0) * 0.35) / track.length, 0, true); T.snapCamera(); T.step(1 / 60, 1, true);
    }, name);
    await page.screenshot({ path: path.join(OUT, `cakes-${name}.png`) });
  }
  record('no browser, console or failed-resource errors', errors.length === 0, errors);
} catch (e) {
  record('browser harness completed', false, String(e.stack || e));
} finally {
  fs.writeFileSync(path.join(OUT, 'cakeqa.json'), JSON.stringify({ results, errors }, null, 2));
  await browser.close();
}
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} cake browser checks passed; evidence: ${OUT}`);
process.exitCode = results.every((r) => r.pass) ? 0 : 1;
