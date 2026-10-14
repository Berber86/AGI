// Real two-fork gameplay QA. Run beside puppeteer-core after setup-runtime.mjs.
// node forkqa.mjs [gameURL] [--screenshots] [--offline]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.argv.find((a) => /^https?:/.test(a)) || 'http://127.0.0.1:8900/index.html';
const OUT = process.env.QA_OUT || path.resolve('test-results/forks'); fs.mkdirSync(OUT, { recursive: true });
const results = [], errors = [];
const check = (name, pass, detail) => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(detail)}`); };
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 915, height: 412, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } });
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
  await page.evaluate(() => { __TEST__.pinQuality(0); __TEST__.internals().governor.hold(10000); });

  const network = await page.evaluate(() => {
    const { track } = __TEST__.internals(), out = [];
    for (const f of track.routes.forks) for (const b of f.branches) {
      let minRadius = Infinity, maxGrade = 0, metreError = 0, inverseError = 0;
      for (let s = f.s0 + 1; s < f.s1 - 1; s += 1) {
        const x = track.advance(s, -.5, b.index), y = track.advance(s, .5, b.index);
        const a = track.getPose(x, 0, b.index), c = track.getPose(y, 0, b.index);
        minRadius = Math.min(minRadius, 1 / a.tangent.angleTo(c.tangent));
        maxGrade = Math.max(maxGrade, Math.abs(a.pitch) * 180 / Math.PI);
        metreError = Math.max(metreError, Math.abs(a.pos.distanceTo(c.pos) - 1));
        inverseError = Math.max(inverseError, Math.abs(track.advance(track.advance(s, 37, b.index), -37, b.index) - s));
      }
      const joins = [f.s0, f.s1].map((s) => {
        const a = track.getBasePose(s), p = track.getPose(s, 0, b.index);
        return { gap: a.pos.distanceTo(p.pos), dot: a.tangent.dot(p.tangent) };
      });
      out.push({ id: b.id, length: b.length, minRadius, maxGrade, metreError, inverseError, joins });
    }
    const separation = track.routes.forks.map((f) => track.getPose((f.s0 + f.s1) / 2, 0, 0).pos.distanceTo(track.getPose((f.s0 + f.s1) / 2, 0, 1).pos));
    return { forks: track.routes.forks.length, routes: out, separation };
  });
  check('two actual forks, four distinct routes, shared tangent-continuous joins', network.forks === 2 && network.routes.length === 4
    && network.separation.every((d) => d > 45) && network.routes.every((r) => r.joins.every((j) => j.gap < 1e-5 && j.dot > .99999)), network);
  check('true metre speed on alternatives; forward/backward camera mapping is invertible', network.routes.every((r) => r.minRadius > 24 && r.maxGrade < 14
    && r.metreError < .003 && r.inverseError < 1e-5), network.routes);

  const geometry = await page.evaluate(async () => {
    const THREE = await import('three'), { track, forks, scene, camera } = __TEST__.internals(); scene.updateMatrixWorld(true);
    const rc = new THREE.Raycaster(); rc.camera = camera;
    let missing = [], intrusions = [], draws = 0, triangles = 0;
    const label = (o) => { const a = []; for (; o && o !== scene; o = o.parent) a.push(o.name || o.type); return a.join('/'); };
    forks.group.traverse((o) => { if (o.isMesh) { draws++; triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1); } });
    for (const f of track.routes.forks) for (let option = 0; option < 2; option++) for (let s = f.s0 - 1; s <= f.s1 + 1; s += 1) {
      for (const lat of [-6.4, -3.2, 0, 3.2, 6.4]) {
        const p = track.getPose(s, lat, option).pos;
        rc.set(p.clone().add(new THREE.Vector3(0, 2, 0)), new THREE.Vector3(0, -1, 0)); rc.far = 3;
        const h = rc.intersectObjects(track.roadMeshes, false)[0];
        if (!h || h.distance < 1.8 || h.distance > 2.22 || h.face.normal.y < .85) missing.push({ id: f.id, option, s, lat, d: h?.distance });
      }
      for (const lat of [-8, -6.4, -3.2, 0, 3.2, 6.4, 8]) {
        const p = track.getPose(s, lat, option).pos;
        rc.set(p.clone().add(new THREE.Vector3(0, .18, 0)), new THREE.Vector3(0, 1, 0)); rc.far = 3.4;
        // Ramp surfaces intentionally occupy the road and have their own jump
        // model. All other scenery, including merged/noCollide meshes, is tested.
        const h = rc.intersectObjects([forks.group, track.forkDecks, scene.getObjectByName('candyWorld')], true).find((h) => h.object.isMesh);
        if (h) intrusions.push({ id: f.id, option, s, lat, d: h.distance, object: label(h.object) });
      }
    }
    return { missing: missing.slice(0, 8), missingCount: missing.length, intrusions: intrusions.slice(0, 10), intrusionCount: intrusions.length, draws, triangles };
  });
  check('both road surfaces cover the full steering range, including exact joins', geometry.missingCount === 0, geometry);
  check('no scenery, poles or clouds in either car envelope', geometry.intrusionCount === 0, geometry);
  check('four destinations fit a modest scenery budget', geometry.draws <= 35 && geometry.triangles < 60000, { draws: geometry.draws, triangles: geometry.triangles });

  // Real pointer capture and release; no mocked route choice or steering.
  for (let fi = 0; fi < 2; fi++) for (const side of [-1, 1]) {
    await page.evaluate((fi) => { const T = __TEST__, { track } = T.internals(); T.startRace(); T.holdSteer(null); T.setProgress((track.routes.forks[fi].s0 - 20) / track.length, 0, false); }, fi);
    const id = side < 0 ? '#btn-left' : '#btn-right', r = await (await page.$(id)).boundingBox();
    await page.touchscreen.touchStart(r.x + r.width / 2, r.y + r.height / 2);
    const result = await page.evaluate((fi) => {
      const T = __TEST__, { track, car } = T.internals(), f = track.routes.forks[fi]; let maxStep = 0;
      T.step(1 / 60, 1, false); let previous = car.root.position.clone();
      for (let i = 0; i < 200 && T.jumpInfo().s < f.s0 + 4; i++) {
        T.step(1 / 60, 1, false); maxStep = Math.max(maxStep, previous.distanceTo(car.root.position)); previous.copy(car.root.position);
      }
      return { selected: f.selected, maxStep, state: T.state(), hint: !document.getElementById('fork-hint').classList.contains('hidden') };
    }, fi);
    await page.touchscreen.touchEnd();
    const released = await page.$eval(id, (b) => b.getAttribute('aria-pressed') === 'false');
    await page.evaluate((fi) => { const T = __TEST__, f = T.internals().track.routes.forks[fi]; T.holdSteer(f.selected === 0 ? 1 : -1); T.step(1 / 60, 65, false); T.holdSteer(null); }, fi);
    const latched = await page.evaluate((fi) => __TEST__.internals().track.routes.forks[fi].selected, fi);
    check(`fork ${fi + 1}, real ${side < 0 ? 'left' : 'right'} touch selects and latches without teleport`, result.selected === (side < 0 ? 0 : 1)
      && latched === result.selected && result.maxStep < .8 && result.state === 'racing' && result.hint && released, { ...result, latched, released });
  }

  const framing = await page.evaluate(async () => {
    const THREE = await import('three'), T = __TEST__, { track, forks, camera, car } = T.internals();
    const cropped = [], blocked = [], roadLost = []; let checked = 0, minBodyY = 1;
    for (const f of track.routes.forks) for (let option = 0; option < 2; option++) for (let i = 0; i <= 16; i++) for (const lat of [-4, 0, 4]) {
      T.chooseFork(f.id, option); const s = f.s0 + f.span * i / 16;
      T.setProgress(s / track.length, lat, true); T.snapCamera(); T.step(1 / 60, 1, false); camera.updateMatrixWorld(true); checked++;
      const body = car.root.position.clone().add(new THREE.Vector3(0, .9, 0)).project(camera); minBodyY = Math.min(minBodyY, body.y);
      if (body.y < -.9 || body.y > .9 || Math.abs(body.x) > .85) cropped.push({ id: f.id, option, s, lat, body: body.toArray() });
      if (T.roadScreenPoints(6, 30, 6).filter((p) => p.onScreen).length < 4) roadLost.push({ id: f.id, option, s, lat });
      const target = car.root.position.clone().add(new THREE.Vector3(0, 1.4, 0)), d = target.clone().sub(camera.position);
      const ray = new THREE.Raycaster(camera.position, d.clone().normalize(), 0, d.length() - .4);
      if (ray.intersectObject(forks.group, true).length) blocked.push({ id: f.id, option, s, lat });
    }
    return { checked, minBodyY, cropped: cropped.slice(0, 8), croppedCount: cropped.length, blocked: blocked.slice(0, 8), blockedCount: blocked.length, roadLost: roadLost.slice(0, 8), roadLostCount: roadLost.length };
  });
  check('camera sees the car and near road on all four routes', framing.croppedCount === 0 && framing.blockedCount === 0 && framing.roadLostCount === 0, framing);

  const rewards = await page.evaluate(() => {
    const T = __TEST__, { track, sweets, ramps } = T.internals(); T.startRace(); const f = track.routes.forks[0];
    const sample = sweets.list.find((it) => it.fork === f && it.branch === 0 && it.type === 'candy');
    const twin = sweets.list.find((it) => it.fork === f && it.branch === 1 && it.s === sample.s && it.lateral === sample.lateral);
    track.routes.select(f.id, 0); const events = sweets.update(1 / 60, sample.s, sample.lateral, 0, 0);
    const selectedOnly = sample.collected && !twin.collected && sweets.list.filter((it) => it.fork && it.branch === 1).every((it) => !it.collected);
    const counts = track.routes.forks.map((f) => [0, 1].map((b) => sweets.list.filter((it) => it.fork === f && it.branch === b).length));
    const total = sweets.total, physical = sweets.list.length; sweets.collectAllDemo(); const allReachable = sweets.collected === total;
    const jump = ramps.list.find((r) => r.id === 'fork-cookie'), mid = (jump.s0 + jump.s1) / 2;
    track.routes.select(track.routes.forks[1].id, 0); const leftRamp = ramps.sample(mid, 0).ramp?.id;
    track.routes.select(track.routes.forks[1].id, 1); const rightRamp = ramps.sample(mid, 0).ramp;
    T.startRace(); return { selectedOnly, events: events.length, counts, total, physical, allReachable, leftRamp, rightRamp: rightRamp?.id || null,
      reset: sweets.collected === 0 && track.routes.forks.every((f) => f.selected === null && f.pending === 0) };
  });
  check('unchosen rewards never double-count; medals use only reachable sweets', rewards.selectedOnly && rewards.events > 0 && rewards.allReachable
    && rewards.physical > rewards.total && rewards.counts.every(([a, b]) => a === b), rewards);
  check('the cookie jump cannot trigger invisibly on the cloud road; reset clears both choices', rewards.leftRamp === 'fork-cookie' && rewards.rightRamp === null && rewards.reset, rewards);

  const identities = await page.evaluate(() => {
    const T = __TEST__, { track, forks, ramps } = T.internals(), f = track.routes.forks[0], g = track.routes.forks[1];
    let maxHill = 0, maxCloud = 0;
    for (let i = 0; i <= 100; i++) {
      const q = i / 100;
      const h = f.branches[0].curve, c = g.branches[1].curve;
      const hp = h.getPoint(q), cp = c.getPoint(q);
      maxHill = Math.max(maxHill, hp.y - h.base.getPointAt((h.s0 + (h.s1 - h.s0) * q) / h.baseLength).y);
      maxCloud = Math.max(maxCloud, cp.y - c.base.getPointAt((c.s0 + (c.s1 - c.s0) * q) / c.baseLength).y);
    }
    T.chooseFork(f.id, 1); T.setProgress((f.s0 + f.span * .5) / track.length, 0, true); T.step(1 / 60, 1, false); const dark = T.tunnelInfo().k;
    T.chooseFork(f.id, 0); T.step(1 / 60, 1, false); const light = T.tunnelInfo().k;
    return { maxHill, maxCloud, dark, light, ramp: ramps.list.find((r) => r.id === 'fork-cookie').height, worlds: forks.group.children.length };
  });
  check('destinations differ in actual gameplay: hills, lit tunnel, jump and raised bridge', identities.maxHill > 2.7 && identities.maxCloud > 8.4
    && identities.dark > .55 && identities.light === 0 && identities.ramp >= 1.4, identities);

  for (const choices of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
    const ride = await page.evaluate((choices) => {
      const T = __TEST__, { track, ramps, sweets } = T.internals(); T.startRace(); T.setProgress(0, 0, false); T.holdSteer(0);
      track.routes.forks.forEach((f, i) => T.chooseFork(f.id, choices[i]));
      const jump = ramps.list.find((r) => r.id === 'fork-cookie'); let frames = 0, forkJump = 0, bad = 0;
      for (; frames < 8500 && T.state() !== 'finish'; frames += 4) {
        T.step(1 / 60, 4, false); const p = T.jumpInfo();
        if (!Number.isFinite(p.air) || Math.abs(p.lateral) > 6.41) bad++;
        if (p.s >= jump.s0 && p.s <= track.advance(jump.s1, 70)) forkJump = Math.max(forkJump, p.air);
      }
      T.holdSteer(null);
      return { choices, frames, bad, forkJump, info: T.gameInfo(), choicesSaved: track.routes.forks.map((f) => f.selected),
        reachable: sweets.total, message: document.getElementById('finish-route').textContent };
    }, choices);
    check(`complete ${choices.map((x) => x ? 'R' : 'L').join('')} ride reaches finish with its own rewards`, ride.info.state === 'finish' && ride.info.timeS < 145
      && ride.bad === 0 && ride.info.collected <= ride.reachable && ride.choicesSaved.every((v, i) => v === choices[i])
      && (choices[1] === 0 ? ride.forkJump > 1.4 : ride.forkJump < .01), ride);
  }

  await page.evaluate(() => { const T = __TEST__, { track } = T.internals(); T.startRace(); T.setProgress((track.routes.forks[0].s0 - 20) / track.length, 2, false); T.step(1 / 60, 1, false); });
  await page.tap('#btn-pause');
  const paused = await page.evaluate(() => { const T = __TEST__, before = T.jumpInfo().s; T.step(1 / 60, 120, false); return { state: T.state(), frozen: before === T.jumpInfo().s, pending: T.forks()[0].pending, selected: T.forks()[0].selected }; });
  await page.tap('#btn-resume');
  const resumed = await page.evaluate(() => { __TEST__.step(1 / 60, 100, false); return { state: __TEST__.state(), selected: __TEST__.forks()[0].selected }; });
  check('pause/resume keeps the pending route and does not advance or choose while paused', paused.state === 'paused' && paused.frozen && paused.pending === 1 && paused.selected === null
    && resumed.state === 'racing' && resumed.selected === 1, { paused, resumed });

  if (process.argv.includes('--screenshots')) {
    await page.evaluate(() => { const T = __TEST__; T.pinQuality(1); T.internals().governor.hold(10000); });
    const shots = [['choice-1', 0, 0, -.24], ['gummy-hills', 0, 0, .35], ['star-tunnel', 0, 1, .40], ['choice-2', 1, 0, -.21], ['cookie-jump', 1, 0, .67], ['cloud-bridge', 1, 1, .40]];
    for (const [name, fi, option, q] of shots) {
      await page.evaluate(([fi, option, q]) => {
        const T = __TEST__, { track } = T.internals(), f = track.routes.forks[fi]; T.startRace(); T.chooseFork(f.id, option);
        if (q < 0) { f.selected = null; f.pending = option; }
        T.setProgress((f.s0 + f.span * q) / track.length, 0, true); T.step(1 / 60, 30, false); T.snapCamera(); T.step(1 / 60, 1, true);
      }, [fi, option, q]);
      await page.screenshot({ path: path.join(OUT, `${name}.webp`), type: 'webp', quality: 85 });
    }
  }
  const cache = await page.evaluate(async () => {
    await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('SW timeout')), 15000))]);
    const keys = await caches.keys(), key = keys.find((k) => /^ckc-v/.test(k)); const c = await caches.open(key);
    return { key, routes: !!(await c.match('./src/routes.js')), scenery: !!(await c.match('./src/forks.js')) };
  });
  check('both route modules are in the offline cache', cache.routes && cache.scenery, cache);
  if (process.argv.includes('--offline')) {
    await page.waitForFunction('navigator.serviceWorker.controller?.state === "activated"', { timeout: 15000 });
    await page.setOfflineMode(true); await page.reload({ waitUntil: 'networkidle0', timeout: 120000 });
    await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
    const offline = await page.evaluate(() => ({ forks: __TEST__.forks().length, routes: __TEST__.forks().flatMap((f) => f.routes).length, ready: document.body.dataset.boot, textures: __TEST__.textures().loaded }));
    check('real offline reload has all four alternatives and all textures', offline.forks === 2 && offline.routes === 4 && offline.ready === 'ready' && offline.textures === 26, offline);
    await page.setOfflineMode(false);
  }
  check('no browser errors', errors.length === 0, errors);
} catch (e) { check('test execution', false, e.stack); }
finally { fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ baseURL: BASE, results, errors }, null, 2)); await browser.close(); }
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} fork checks passed`);
process.exitCode = results.some((r) => !r.pass) ? 1 : 0;
