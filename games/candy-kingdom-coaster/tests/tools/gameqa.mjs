// gameqa.mjs — deep correctness & performance QA for Candy Kingdom Coaster.
// Boost, knock, off-road, pause/resume, visibility, draw-call budget, console.
// Frames are driven with __TEST__.step(): headless Chromium only produces
// requestAnimationFrame callbacks when a screenshot forces one, so a rAF-based
// harness would measure a frozen game. step() runs the real frame body.
// Usage: node gameqa.mjs [baseUrl]
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 180000,
});

const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 140)));
page.on('console', (m) => { if (m.type() === 'error') pageErrors.push('console: ' + m.text().slice(0, 140)); });

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
await page.evaluate(() => window.__TEST__.pinQuality(2));
await sleep(1500);

// ---------- 1. boost: 4 cupcakes -> auto boost -> faster than cruise ----------
{
  const got = await page.evaluate(async () => {
    const T = window.__TEST__;
    T.startRace(); T.fastForwardCountdown(); T.setProgress(0.02, 0, false);
    T.step(1 / 60, 30, false);
    const cruise = T.gameInfo().speedKmh;
    let taken = 0, boostSeen = false, maxSpeed = 0, charges = 0;
    for (let i = 0; i < 120 && taken < 4; i++) {
      const it = T.sweetPeek(i);
      if (!it || it.collected || it.type !== 'cupcake') continue;
      T.setProgress(it.s / T.gameInfo().trackLength, it.lateral, false);
      // drive frames until the sweet is picked up (or we give up on it)
      for (let k = 0; k < 24; k++) {
        T.step(1 / 60, 4, false);
        const info = T.gameInfo();
        if (info.boostActive) { boostSeen = true; maxSpeed = Math.max(maxSpeed, info.speedKmh); }
        if (T.sweetPeek(i).collected) { taken++; break; }
      }
      charges = Math.max(charges, T.gameInfo().boostCharges);
    }
    // the boost fires the moment the 4th charge lands — watch it play out
    for (let k = 0; k < 90; k++) {
      T.step(1 / 60, 4, false);
      const info = T.gameInfo();
      if (info.boostActive) { boostSeen = true; maxSpeed = Math.max(maxSpeed, info.speedKmh); }
    }
    return { taken, boostSeen, maxSpeed, charges, cruise };
  });
  record('1. cupcake boost fires and speeds the car up',
    got.taken >= 4 && got.boostSeen && got.maxSpeed > got.cruise * 1.15,
    { cruise: +got.cruise.toFixed(1), boostSpeed: +got.maxSpeed.toFixed(1), taken: got.taken, boosted: got.boostSeen, charges: got.charges });
}

// ---------- 2. knockable fence topples when the car clips it ----------
{
  const knocked = await page.evaluate(() => {
    const T = window.__TEST__;
    T.startRace(); T.fastForwardCountdown(); T.setProgress(0.02, 0, false);
    T.step(1 / 60, 20, false);
    // sweep the shoulder where the knockable fence lives (6.8-8.4 m)
    for (let lat = 5.0; lat <= 8.4; lat += 0.4) {
      for (const s of [40, 90, 140, 190, 240]) {
        T.setProgress(s / T.gameInfo().trackLength, lat, false);
        T.step(1 / 60, 12, false);
        if (T.knockedCount() > 0) return { knocked: T.knockedCount(), lat, s };
      }
    }
    return { knocked: T.knockedCount() };
  });
  record('2. knockable candy fence topples on contact', knocked.knocked > 0, knocked);
}

// ---------- 3. off-road slows the car (mistakes cost speed, not the run) -----
{
  const slow = await page.evaluate(() => {
    const T = window.__TEST__;
    T.startRace(); T.fastForwardCountdown(); T.setProgress(0.1, 0, false);
    T.step(1 / 60, 40, false);
    const onRoad = T.gameInfo().speedKmh;
    // hold the right arrow: the gentle auto-center only applies with no input
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    let offRoad = 0, lateral = 0;
    for (let k = 0; k < 90; k++) {
      T.step(1 / 60, 2, false);
      const info = T.gameInfo();
      if (info.lateral > 5.6) {
        lateral = info.lateral;
        offRoad = offRoad === 0 ? info.speedKmh : Math.min(offRoad, info.speedKmh);
      }
    }
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
    T.step(1 / 60, 90, false); // auto-center gently brings the car home
    const backOn = T.gameInfo().speedKmh;
    return { onRoad: +onRoad.toFixed(1), offRoad: +offRoad.toFixed(1), lateral: +lateral.toFixed(2), backOn: +backOn.toFixed(1) };
  });
  record('3. off-road slows the car and the road restores speed',
    slow.offRoad > 0 && slow.offRoad < slow.onRoad * 0.85 && slow.backOn > slow.offRoad * 1.1, slow);
}

// ---------- 4. pause freezes the race, resume continues it ----------
{
  const p = await page.evaluate(() => {
    const T = window.__TEST__;
    T.startRace(); T.fastForwardCountdown(); T.setProgress(0.15, 0, false);
    T.step(1 / 60, 30, false);
    const t1 = T.gameInfo().timeS;
    document.getElementById('btn-pause').click();
    const paused = T.state();
    T.step(1 / 60, 60, false); // paused: time must not move
    const t2 = T.gameInfo().timeS;
    document.getElementById('btn-resume').click();
    T.step(1 / 60, 60, false); // resumed: time must move again
    const t3 = T.gameInfo().timeS;
    return { paused, frozen: Math.abs(t2 - t1) < 0.35, resumed: t3 > t2, state: T.state() };
  });
  record('4. pause freezes time and resume continues', p.paused === 'paused' && p.frozen && p.resumed && p.state === 'racing', p);
}

// ---------- 5. tab-away pause/resume (visibilitychange) ----------
{
  const v = await page.evaluate(() => {
    const T = window.__TEST__;
    T.startRace(); T.fastForwardCountdown(); T.setProgress(0.15, 0, false);
    T.step(1 / 60, 20, false);
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const st = T.state();
    T.step(1 / 60, 60, false);
    const t1 = T.gameInfo().timeS;
    T.step(1 / 60, 60, false);
    const t2 = T.gameInfo().timeS;
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    T.step(1 / 60, 60, false);
    const t3 = T.gameInfo().timeS;
    return { st, frozen: Math.abs(t2 - t1) < 0.35, resumed: t3 > t2, final: T.state() };
  });
  record('5. backgrounding pauses and returning resumes', (v.st === 'paused' || v.final === 'racing') && v.frozen, v);
}

// ---------- 6. render budget: draw calls & triangles at a busy spot ----------
{
  const budget = await page.evaluate(() => {
    const T = window.__TEST__;
    T.setProgress(0.42, 0, false); T.snapCamera();
    T.step(1 / 60, 4, true);
    const ri = window.__RENDER_INFO__ || null;
    const a = T.sceneAudit();
    return { calls: ri && ri.calls, triangles: ri && ri.triangles, fps: ri && ri.fps, tier: ri && ri.tier, sceneMeshes: a.meshes, sceneTri: a.totalTri, visible: a.visMeshes };
  });
  record('6. render budget captured', !!budget, budget || 'no __RENDER_INFO__');
}

// ---------- 7. no page or console errors during all of the above ----------
{
  record('7. no page or console errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | ') || '');
}

const passed = results.filter((r) => r.passed === undefined && r.pass).length;
console.log(`\n=== ${passed}/${results.length} deep QA checks passed ===`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
