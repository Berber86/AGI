// Twin-cake regression tests against the actual game, not a copy of its maths.
// Same toolchain as acceptance.mjs (puppeteer-core + @sparticuz/chromium).
// node serpentineqa.mjs [baseURL] [--screenshots] [--offline]
// Reports/screenshots go to $QA_OUT or ./test-results/serpentines (not Git).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.argv.find((a) => /^https?:/.test(a)) || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.env.QA_OUT || path.resolve('test-results/serpentines');
fs.mkdirSync(OUT, { recursive: true });
const results = [], errors = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(detail)}`);
};
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
});
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
  // Avoid spending software-GPU time between synchronous physics assertions.
  await page.evaluate(() => { __TEST__.pinQuality(0); __TEST__.internals().governor.hold(10000); });

  const route = await page.evaluate(() => {
    const { track } = __TEST__.internals(), C = track.cakeSection;
    const round = (v) => +v.toFixed(4);
    const wind = (part) => {
      let prev = null, angle = 0, wrongSlope = 0;
      for (let i = 0; i <= 300; i++) {
        const p = track.getPose(part.s0 + (part.s1 - part.s0) * i / 300);
        const a = Math.atan2(p.pos.z - part.center.z, p.pos.x - part.center.x);
        if (prev !== null) angle += Math.atan2(Math.sin(a - prev), Math.cos(a - prev));
        prev = a;
        if (part.id === 'ascent' ? p.pitch < -1e-6 : p.pitch > 1e-6) wrongSlope++;
      }
      return { winding: round(angle / (2 * Math.PI)), wrongSlope,
        rise: round(track.getPose(part.s1).pos.y - track.getPose(part.s0).pos.y) };
    };
    const joins = track.curve.sections.slice(1).map((p, i) => {
      const a = track.curve.sections[i].curve, b = p.curve;
      return { id: p.id, gap: a.getPointAt(1).distanceTo(b.getPointAt(0)), dot: a.getTangentAt(1).dot(b.getTangentAt(0)) };
    });
    let minRadius = Infinity, maxGrade = 0, stepError = 0;
    for (let s = 1; s < track.length - 1; s += 0.5) {
      const a = track.getPose(s - 0.5), b = track.getPose(s + 0.5);
      minRadius = Math.min(minRadius, 1 / a.tangent.angleTo(b.tangent));
      maxGrade = Math.max(maxGrade, Math.abs(a.pitch));
      stepError = Math.max(stepError, Math.abs(a.pos.distanceTo(b.pos) - 1));
    }
    let bridgeError = 0;
    for (let s = C.bridge.s0; s <= C.bridge.s1; s++) bridgeError = Math.max(bridgeError, Math.abs(track.getPose(s).pos.y - C.bridge.y));
    // Non-neighbouring road ribbons may overlap in plan ONLY with headroom.
    const samples = [];
    for (let s = 0; s < track.length; s += 3) samples.push({ s, p: track.getPose(s).pos });
    const intersections = [];
    for (let i = 0; i < samples.length; i++) for (let j = i + 10; j < samples.length; j++) {
      const a = samples[i], b = samples[j];
      if (Math.abs(a.p.y - b.p.y) < 5 && Math.hypot(a.p.x - b.p.x, a.p.z - b.p.z) < 17.6) intersections.push([a.s, b.s]);
    }
    return { length: round(track.length), ascent: wind(C.ascent), descent: wind(C.descent),
      bridgeLength: round(C.bridge.s1 - C.bridge.s0), bridgeError, joins,
      minRadius: round(minRadius), maxGrade: round(maxGrade * 180 / Math.PI), stepError: round(stepError), intersections };
  });
  record('opposite uphill/downhill spirals + level connecting bridge',
    route.ascent.winding > 1.2 && route.descent.winding < -1.2 && route.ascent.wrongSlope === 0 && route.descent.wrongSlope === 0
      && route.ascent.rise > 30 && route.descent.rise < -30 && route.bridgeLength > 40 && route.bridgeError < 1e-6, route);
  record('continuous metre mapping, gentle joins, no self-intersections',
    route.joins.every((p) => p.gap < 1e-5 && p.dot > 0.99999) && route.minRadius > 24 && route.maxGrade < 14
      && route.stepError < 0.01 && route.intersections.length === 0, { joins: route.joins, radius: route.minRadius, grade: route.maxGrade, stepError: route.stepError });

  const geometry = await page.evaluate(async () => {
    const THREE = await import('three');
    const { track, cakes, scene, camera } = __TEST__.internals(), C = track.cakeSection;
    scene.updateMatrixWorld(true);
    const rc = new THREE.Raycaster(); rc.camera = camera;
    const up = new THREE.Vector3(0, 1, 0), down = up.clone().negate();
    const missing = [], intrusions = [], tooClose = [];
    const objects = [cakes.group, scene.getObjectByName('candyWorld')];
    const label = (o) => { const names = []; for (; o && o !== scene; o = o.parent) names.push(o.name || o.type); return names.join('/'); };
    for (let s = C.deckStart; s <= C.deckEnd; s += 2) {
      for (const lat of [-6.4, -3.2, 0, 3.2, 6.4]) {
        const p = track.getPose(s, lat).pos;
        rc.near = 0; rc.far = 3;
        rc.set(p.clone().addScaledVector(up, 2), down);
        const h = rc.intersectObjects(track.roadMeshes, false)[0];
        if (!h || h.distance < 1.88 || h.distance > 2.2 || h.face.normal.y < 0.85) missing.push({ s, lat, d: h?.distance });
      }
      for (const lat of [-8, -6.4, -3.2, 0, 3.2, 6.4, 8]) {
        const p = track.getPose(s, lat).pos;
        rc.near = 0; rc.far = 3.4;
        rc.set(p.clone().addScaledVector(up, 0.18), up);
        const h = rc.intersectObjects(objects, true).find((h) => h.object.isMesh);
        if (h) intrusions.push({ s: +s.toFixed(1), lat, d: +h.distance.toFixed(2), object: label(h.object) });
        for (const cake of cakes.cakes) for (const tier of cake.tiers) {
          if (p.y + 3.6 < tier.bottom || p.y > tier.top + 1.2) continue;
          const gap = Math.hypot(p.x - cake.center.x, p.z - cake.center.z) - tier.radius;
          if (gap < 0.5) tooClose.push({ s, lat, gap });
        }
      }
    }
    return { missing: missing.slice(0, 6), missingCount: missing.length, intrusions: intrusions.slice(0, 12), intrusionCount: intrusions.length, tooClose: tooClose.slice(0, 6) };
  });
  record('road/curbs present and full car envelope clears cake/props',
    geometry.missingCount === 0 && geometry.intrusionCount === 0 && geometry.tooClose.length === 0, geometry);

  const visibility = await page.evaluate(async () => {
    const THREE = await import('three');
    const T = __TEST__, { track, cakes, camera } = T.internals(), C = track.cakeSection;
    const bad = [], occluded = [];
    for (const part of [C.ascent, C.bridge, C.descent]) for (let i = 0; i <= 16; i++) for (const lat of [-4, 0, 4]) {
      const s = part.s0 + (part.s1 - part.s0) * i / 16;
      T.setProgress(s / track.length, lat, true); T.snapCamera(); T.step(1 / 60, 1, false);
      const points = T.roadScreenPoints(6, 30, 6);
      if (points.filter((p) => p.onScreen).length < 4) bad.push({ s, lat, points });
      const target = track.getPose(s, lat).pos.add(new THREE.Vector3(0, 1.4, 0));
      const dir = target.clone().sub(camera.position), rc = new THREE.Raycaster(camera.position, dir.clone().normalize(), 0, dir.length() - 0.4);
      if (rc.intersectObject(cakes.group, true).length) occluded.push({ s, lat });
    }
    return { checked: 153, bad: bad.slice(0, 3), badCount: bad.length, occluded };
  });
  record('chase camera sees car and near road through both serpentines', visibility.badCount === 0 && visibility.occluded.length === 0, visibility);

  const drive = await page.evaluate(() => {
    const T = __TEST__, { track, car } = T.internals(), C = track.cakeSection, out = [];
    for (const boost of [false, true]) {
      T.startRace(); T.setProgress((C.s0 - 4) / track.length, 0, false); T.holdSteer(0);
      if (boost) T.forceBoost(120);
      let air = 0, maxPitch = 0, maxHeadingStep = 0, prevHeading = null, frames = 0;
      for (; frames < 3600 && T.jumpInfo().s < C.s1 + 5; frames++) {
        T.step(1 / 60, 1, false);
        const j = T.jumpInfo(), heading = car.root.rotation.y;
        if (j.jump !== 'ground' || j.air !== 0 || !Number.isFinite(car.root.position.y)) air++;
        maxPitch = Math.max(maxPitch, Math.abs(j.pitch));
        if (prevHeading !== null) maxHeadingStep = Math.max(maxHeadingStep, Math.abs(Math.atan2(Math.sin(heading - prevHeading), Math.cos(heading - prevHeading))));
        prevHeading = heading;
      }
      out.push({ boost, frames, air, maxPitch, maxHeadingStep, cleared: T.jumpInfo().s > C.s1, end: T.jumpInfo() });
    }
    // Holding either touch direction at the apex must hit the soft wall, not
    // fall off a cake or get interpreted as a jump-ramp side drop.
    for (const steer of [-1, 1]) {
      T.startRace(); T.setProgress((C.ascent.s0 + 80) / track.length, 0, false); T.holdSteer(steer);
      T.step(1 / 60, 300, false);
      const j = T.jumpInfo(); out.push({ steer, edge: j.lateral, air: j.air, phase: j.jump });
    }
    T.holdSteer(null);
    return out;
  });
  record('normal/boost traverse + soft walls stay grounded', drive.every((r) => r.steer
    ? Math.abs(r.edge) <= 6.4 && Math.abs(r.edge) > 6.3 && r.air === 0 && r.phase === 'ground'
    : r.cleared && r.air === 0 && r.maxPitch < 0.18 && r.maxHeadingStep < 0.04), drive);

  const landmarks = await page.evaluate(() => {
    const T = __TEST__, { track, cakes } = T.internals(), C = track.cakeSection;
    let draws = 0, triangles = 0;
    cakes.group.traverse((o) => { if (o.isMesh) { draws++; triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; } });
    return { ramps: T.ramps(), tunnel: T.tunnelInfo().range, river: T.bridge().crossingS,
      cakeStart: C.s0, cakeEnd: C.s1, flavors: cakes.cakes.map((c) => c.flavor),
      zones: track.zones.map((z) => ({ id: z.id, u0: z.u0, u1: z.u1 })), draws, triangles };
  });
  record('old landmarks retain order; distinct cakes fit geometry budget',
    landmarks.river < landmarks.ramps[0].s0 && landmarks.ramps[0].s1 < landmarks.cakeStart
      && landmarks.cakeEnd < landmarks.tunnel[0] && landmarks.tunnel[1] < landmarks.ramps[1].s0
      && Math.abs(landmarks.tunnel[1] - landmarks.tunnel[0] - 115) < 1e-6
      && new Set(landmarks.flavors).size === 2 && landmarks.draws <= 40 && landmarks.triangles < 90000
      && landmarks.zones.every((z, i, all) => i === 0 || z.u0 === all[i - 1].u1), landmarks);

  const finish = await page.evaluate(() => {
    const T = __TEST__; T.startRace(); T.setProgress(0, 0, false); T.holdSteer(0);
    let frames = 0;
    while (T.state() !== 'finish' && frames < 14400) { T.step(1 / 60, 60, false); frames += 60; }
    const result = T.gameInfo(); T.holdSteer(null); T.startRace();
    return { result, restart: T.gameInfo() };
  });
  record('complete ride reaches finish and restarts', finish.result.state === 'finish' && finish.result.timeS < 150
    && finish.restart.collected === 0 && finish.restart.timeS === 0, finish);

  // Actual held touch gesture, using fixed simulation steps while SwiftShader
  // is slow, then release. No keyboard or synthetic input-steer override.
  await page.evaluate(() => {
    const T = __TEST__, { track } = T.internals(); T.hideHUD(false); T.holdSteer(null);
    T.setProgress((track.cakeSection.bridge.s0 + 20) / track.length, 0, false);
  });
  const button = await page.$('#btn-left'), rect = await button.boundingBox();
  await page.touchscreen.touchStart(rect.x + rect.width / 2, rect.y + rect.height / 2);
  const held = await page.evaluate(() => { __TEST__.step(1 / 60, 24, false); return __TEST__.gameInfo().lateral; });
  await page.touchscreen.touchEnd();
  const released = await page.evaluate(() => { __TEST__.step(1 / 60, 40, false); return __TEST__.gameInfo().lateral; });
  record('touch steering and release on the sky bridge', held < -0.5 && released > held && rect.width >= 44 && rect.height >= 44, { held, released, width: rect.width, height: rect.height });

  if (process.argv.includes('--screenshots')) {
    await page.setViewport({ width: 1200, height: 720, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await page.evaluate(() => {
      const T = __TEST__, { track, governor } = T.internals(), C = track.cakeSection;
      T.pinQuality(2); governor.hold(10000); T.hideHUD();
      T.setProgress((C.bridge.s0 + 30) / track.length, 0, true);
      const x = (C.ascent.center.x + C.descent.center.x) / 2, z = (C.ascent.center.z + C.descent.center.z) / 2;
      T.fixCam(x + 12, 133, z - 187, x, 16, z); T.step(1 / 60, 2, true);
    });
    await page.screenshot({ path: path.join(OUT, 'cake-pair.webp'), type: 'webp', quality: 85 });
    await page.setViewport({ width: 915, height: 412, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    for (const [name, q] of [['ascent', 0.29], ['bridge', 0.22], ['descent', 0.34]]) {
      await page.evaluate(([name, q]) => {
        const T = __TEST__, { track } = T.internals(), p = track.cakeSection[name];
        T.fixCam(null); T.setProgress((p.s0 + (p.s1 - p.s0) * q) / track.length, 0, true);
        T.snapCamera(); T.step(1 / 60, 2, true);
      }, [name, q]);
      await page.screenshot({ path: path.join(OUT, `cake-${name}.webp`), type: 'webp', quality: 85 });
    }
  }
  for (const [width, height] of [[360, 800], [412, 915]]) {
    await page.setViewport({ width, height, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const portrait = await page.evaluate(() => {
      const T = __TEST__; T.fixCam(null); T.hideHUD(false);
      document.getElementById('portrait-hint').style.display = '';
      const r = document.getElementById('portrait-hint').getBoundingClientRect();
      return { shown: r.width > 0 && r.height > 0, fits: document.documentElement.scrollWidth <= innerWidth };
    });
    record(`portrait ${width}x${height}: rotate hint, no page overflow`, portrait.shown && portrait.fits, portrait);
    if (process.argv.includes('--screenshots')) await page.screenshot({ path: path.join(OUT, `portrait-${width}.webp`), type: 'webp', quality: 75 });
  }

  const cache = await page.evaluate(async () => {
    const ready = await Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise((r) => setTimeout(() => r(false), 15000))]);
    if (!ready) return { error: 'service worker did not activate within 15 seconds' };
    const keys = await caches.keys(), key = keys.find((k) => k === 'ckc-v16');
    const c = key && await caches.open(key);
    return { key, course: !!(c && await c.match('./src/course.js')), cakes: !!(c && await c.match('./src/cakes.js')) };
  });
  record('new route and cake modules are precached for offline play', cache.key === 'ckc-v16' && cache.course && cache.cakes, cache);
  if (process.argv.includes('--offline')) {
    await page.setOfflineMode(true);
    await page.reload({ waitUntil: 'networkidle0', timeout: 120000 });
    await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
    const offline = await page.evaluate(() => ({ cakes: __TEST__.internals().cakes.cakes.length, textures: __TEST__.textures().loaded }));
    record('offline reload builds both cakes and all textures', offline.cakes === 2 && offline.textures === 26, offline);
    await page.setOfflineMode(false);
  }
  record('no browser errors', errors.length === 0, errors);
} catch (e) {
  record('test execution', false, e.stack);
} finally {
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ baseURL: BASE, results, errors }, null, 2));
  await browser.close();
}
const failures = results.filter((r) => !r.pass);
console.log(`\n${results.length - failures.length}/${results.length} serpentine checks passed; ${OUT}/report.json`);
process.exitCode = failures.length ? 1 : 0;
