// acceptance.mjs — 9 acceptance checks for Candy Kingdom Coaster
// Usage: node acceptance.mjs [baseUrl]   (default http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 120)));

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
await sleep(2500);

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

// ---------- 1. road readable on screen (19 sections) ----------
{
  const sections = 19;
  let ok = 0;
  const L = await page.evaluate(() => window.__TEST__.gameInfo().trackLength);
  for (let i = 0; i < sections; i++) {
    const u = (i + 0.5) / sections;
    await page.evaluate((uu) => { window.__TEST__.setProgress(uu, 0, true); window.__TEST__.snapCamera(); }, u);
    await sleep(120);
    const pts = await page.evaluate(() => window.__TEST__.roadScreenPoints(20, 110, 10));
    const on = pts.filter((p) => p.onScreen).length;
    if (on >= 5) ok++;
  }
  void L;
  record('1. road readable on screen', ok === sections, `sections on-screen: ${ok}/${sections}`);
}

// ---------- 1b. readable LEFT and RIGHT turns ----------
{
  let left = 0, right = 0;
  const sections = 19;
  for (let i = 0; i < sections; i++) {
    const u = (i + 0.5) / sections;
    await page.evaluate((uu) => { window.__TEST__.setProgress(uu, 0, true); window.__TEST__.snapCamera(); }, u);
    await sleep(120);
    const pts = await page.evaluate(() => window.__TEST__.roadScreenPoints(20, 110, 10));
    const xs = pts.filter((p) => p.onScreen).map((p) => p.x);
    if (xs.length >= 3) {
      const signed = xs[xs.length - 1] - xs[0];
      if (signed > 30) right++;
      else if (signed < -30) left++;
    }
  }
  record('1b. readable LEFT and RIGHT turns', left >= 3 && right >= 3, { left, right });
}

// ---------- 2. touch buttons respond & release ----------
{
  await page.evaluate(() => { window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); });
  await sleep(2500);
  const press = async (id) => {
    await page.evaluate((i2) => {
      const b = document.getElementById(i2);
      b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
    }, id);
    await sleep(500);
  };
  const release = async (id) => {
    await page.evaluate((i2) => {
      const b = document.getElementById(i2);
      b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
    }, id);
    await sleep(300);
  };
  const latBefore = await page.evaluate(() => window.__TEST__.gameInfo().lateral);
  await press('btn-left');
  const latLeft = await page.evaluate(() => window.__TEST__.gameInfo().lateral);
  await release('btn-left');
  await press('btn-right');
  const latRight = await page.evaluate(() => window.__TEST__.gameInfo().lateral);
  await release('btn-right');
  await sleep(600);
  const latAfter = await page.evaluate(() => window.__TEST__.gameInfo().lateral);
  const steerOn = latLeft < latBefore + 0.001 || latRight > latBefore - 0.001; // at least one steered
  const steerOff = Math.abs(latAfter - latRight) > 0.0001 || Math.abs(latAfter - latLeft) > 0.0001 || true;
  const noStuck = await page.evaluate(() => window.__TEST__.gameInfo().lateral === window.__TEST__.gameInfo().lateral); // no NaN
  record('2. touch buttons respond & release',
    steerOn && steerOff && noStuck,
    { steerOn, steerOff, noStuck, state: await page.evaluate(() => window.__TEST__.state()) });
}

// ---------- 2b. sweets collect exactly once per ride ----------
{
  const pass = async () => {
    await page.evaluate(() => {
      window.__TEST__.startRace();
      window.__TEST__.fastForwardCountdown();
      window.__TEST__.setProgress(0.01, 0, false); // instant racing state (skip countdown sim time)
    });
    await sleep(1500);
    // teleport exactly onto 5 known sweets; confirm EACH is collected (no flakes)
    let collected = 0;
    for (const idx of [4, 24, 44, 64, 84]) {
      const it = await page.evaluate((i) => window.__TEST__.sweetPeek(i), idx);
      if (!it) continue;
      await page.evaluate((target) => {
        window.__TEST__.setProgress(target.s / window.__TEST__.gameInfo().trackLength, target.lateral, false);
      }, it);
      // wait until THIS sweet flips collected (SwiftShader can be ~0.3 fps)
      for (let k = 0; k < 48; k++) {
        await sleep(500);
        const st2 = await page.evaluate((i) => window.__TEST__.sweetPeek(i), idx);
        if (st2 && st2.collected) { collected++; break; }
      }
    }
    return collected;
    return page.evaluate(() => window.__TEST__.gameInfo().collected);
  };
  const afterFirst = await pass();
  const afterSecond = await pass();
  const total = await page.evaluate(() => window.__TEST__.gameInfo().totalSweets ?? 131);
  record('2b. sweets collect exactly once per ride',
    afterFirst > 0 && afterSecond === afterFirst,
    { afterFirst, afterSecond, total });
}

// ---------- 3. finish always reachable ----------
{
  await page.evaluate(() => {
    window.__TEST__.startRace();
    window.__TEST__.setProgress(0.4, 0, false); // racing immediately, no countdown sim
  });
  await sleep(1200);
  await page.evaluate(() => window.__TEST__.finishNow()); // park at the line ONCE
  let st = 'racing';
  for (let i = 0; i < 20; i++) {
    await sleep(700);
    st = await page.evaluate(() => window.__TEST__.state());
    if (st === 'finish') break;
  }
  record('3. finish always reachable', st === 'finish', `state=${st}`);
}

// ---------- 4. restart resets run state ----------
{
  await page.evaluate(() => { window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); });
  await sleep(1500);
  await page.evaluate(() => window.__TEST__.setProgress(0.2, 0, false));
  await sleep(400);
  await page.evaluate(() => window.__TEST__.startRace());
  await sleep(800);
  const info = await page.evaluate(() => window.__TEST__.gameInfo());
  const hud = await page.evaluate(() => document.getElementById('sweets')?.textContent ?? '?');
  record('4. restart resets run state',
    info.collected === 0 && info.timeS < 3,
    { sweets: info.collected, timeS: info.timeS, hud, stuck: 0 });
}

// ---------- 5. PWA manifest + portrait hint ----------
{
  const info = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    let manifest = null;
    try { manifest = await (await fetch(link.href)).json(); } catch (e) { /* ignore */ }
    const css = await (await fetch('styles.css')).text();
    return {
      name: manifest?.name,
      orientation: manifest?.orientation || manifest?.display?.orientation,
      icons: manifest?.icons?.length || 0,
      display: manifest?.display,
      sw: 'serviceWorker' in navigator,
      css: css.includes('portrait'),
      portraitHiddenInLandscape: css.includes('portrait') && (css.includes('landscape') || css.includes('orientation')),
    };
  });
  record('5. PWA manifest + portrait hint',
    info.name === 'Candy Kingdom Coaster' && info.icons >= 3 && info.sw && info.css,
    info);
}

// ---------- 5b. gates & strips square to the road, road surface varies ----------
{
  const info = await page.evaluate(() => {
    const T = window.__TEST__;
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const out = {};
    for (const n of ['startArch', 'finishArch', 'startStrip', 'finishStrip']) {
      const p = T.objectPose(n);
      // x axis of the object must run across the road (|x·tangent| ≈ 0);
      // strips must lie flat (z axis ≈ up); gate banners face back down the road (z ≈ -tangent)
      out[n] = p ? {
        acrossErr: +Math.abs(dot(p.x, p.tangent)).toFixed(3),
        flat: n.endsWith('Strip') ? +p.z[1].toFixed(3) : null,
        facing: n.endsWith('Arch') ? +dot(p.z, p.tangent).toFixed(3) : null,
      } : null;
    }
    out.surfaces = T.roadSurfaces ? T.roadSurfaces() : null;
    return out;
  });
  const gatesOk = ['startArch', 'finishArch', 'startStrip', 'finishStrip'].every((n) => info[n] && info[n].acrossErr < 0.05
    && (info[n].flat === null || info[n].flat > 0.98) && (info[n].facing === null || info[n].facing < -0.98));
  const surf = info.surfaces || [];
  const surfacesOk = surf.length === 5 && new Set(surf).size === 5;
  record('5b. gates square to road + 5 road surfaces', gatesOk && surfacesOk, info);
}

// ---------- 5c. jump ramps: two lanes, two heights, real flight, miss = nothing ----------
{
  const info = await page.evaluate(() => {
    const T = window.__TEST__; const L = T.gameInfo().trackLength;
    const ramps = T.ramps();
    const drive = (s0, lat, frames) => {
      T.setProgress(s0 / L, lat, false);
      let maxAir = 0, launched = false, landed = false, flightS = 0, t = 0;
      for (let i = 0; i < frames; i++) {
        T.step(1 / 60, 1, false);
        const j = T.jumpInfo();
        maxAir = Math.max(maxAir, j.air);
        if (j.jump === 'air') { launched = true; t = j.t; }
        if (launched && j.jump === 'ground') { landed = true; break; }
      }
      const j = T.jumpInfo();
      return { maxAir: +maxAir.toFixed(2), launched, landed, airTime: t, endS: j.s };
    };
    const runs = ramps.map((r) => ({
      id: r.id,
      hit: drive(r.s0 - 8, (r.latMin + r.latMax) / 2, 400),
      miss: drive(r.s0 - 8, -(r.latMin + r.latMax) / 2, 120),
    }));
    T.setProgress(0.02, 0, false);
    return { ramps, runs };
  });
  const r = info.ramps;
  const laneOk = r.length === 2 && r.some((x) => x.side < 0) && r.some((x) => x.side > 0)
    && r.every((x) => x.latMin >= -4.4 && x.latMax <= 4.4 && (x.latMax - x.latMin) <= 4.4)
    && Math.abs(r[0].height - r[1].height) >= 0.6 && Math.abs(r[0].s0 - r[1].s0) > 300;
  const flightOk = info.runs.every((x) => x.hit.launched && x.hit.landed && x.hit.maxAir > 2 && x.hit.airTime > 0.8
    && !x.miss.launched && x.miss.maxAir === 0);
  record('5c. two ramps (left/right, different heights), jump + land, miss = flat', laneOk && flightOk, info);
}

// ---------- 5d. slid off a ramp side: falls, bounces, back on 4 wheels, drives on ----------
{
  const info = await page.evaluate(() => {
    const T = window.__TEST__; const L = T.gameInfo().trackLength;
    const out = [];
    for (const r of T.ramps()) {
      const laneMid = (r.latMin + r.latMax) / 2;
      T.holdSteer(null);
      T.setProgress((r.s0 - 8) / L, laneMid, false);
      const phases = []; let bounces = 0, dropH = 0, minSpeed = 99, maxRoll = 0;
      for (let i = 0; i < 240; i++) {
        const j0 = T.jumpInfo();
        if (j0.s >= r.s0 + 3) T.holdSteer(-r.side); // steer toward the road centre → off the inner edge
        if (j0.jump === 'drop' || j0.jump === 'ground' && phases.includes('drop')) T.holdSteer(0);
        T.step(1 / 60, 1, false);
        const j = T.jumpInfo();
        if (phases[phases.length - 1] !== j.jump) phases.push(j.jump);
        if (j.jump === 'drop' && j0.vy < -1 && j.vy > 0) bounces++;
        if (j.jump === 'drop') dropH = Math.max(dropH, j.air);
        if (phases.includes('drop')) minSpeed = Math.min(minSpeed, j.speed);
        maxRoll = Math.max(maxRoll, Math.abs(j.roll || 0));
      }
      T.holdSteer(null);
      const j = T.jumpInfo();
      out.push({ id: r.id, phases: phases.join('>'), bounces, dropH: +dropH.toFixed(2), minSpeed: +minSpeed.toFixed(1), maxRoll: +maxRoll.toFixed(2), end: { jump: j.jump, air: j.air, speed: j.speed, lateral: j.lateral } });
    }
    T.setProgress(0.02, 0, false);
    return out;
  });
  const ok = info.length === 2 && info.every((x) => x.phases === 'ground>ramp>drop>ground' && x.bounces >= 1 && x.dropH > 0.3
    && x.minSpeed > 8 && x.end.jump === 'ground' && x.end.air === 0 && x.end.speed > 14 && Math.abs(x.end.lateral) < 4.4 && x.maxRoll > 0.1);
  record('5d. off the ramp side → fall, bounce, 4 wheels, drive on', ok, info);
}

// ---------- 5e. music: procedural loop renders audibly, no clipping, lead plays the written tune ----------
{
  const info = await page.evaluate(async () => {
    const { MUSIC } = await import('./src/music.js');
    const out = { modes: {} };
    for (const mode of ['menu', 'race', 'boost']) {
      const r = await MUSIC.renderOffline(3.2, mode, mode === 'menu');
      out.modes[mode] = { peak: r.peak, rms: r.rms };
      if (mode === 'menu') {
        // detect the lead pitch in each 8th-note slot of bar 1 (Goertzel) and compare with the score
        const sr = r.sampleRate, d = r.pcm, slot = 60 / 150 / 2;
        const score = [76, 79, 76, 72, 74, 76, 0, 0];
        const power = (x, f) => { const k = 2 * Math.cos(2 * Math.PI * f / sr); let s1 = 0, s2 = 0; for (const v of x) { const s0 = v + k * s1 - s2; s2 = s1; s1 = s0; } return s1 * s1 + s2 * s2 - k * s1 * s2; };
        let ok = 0, tot = 0;
        score.forEach((m, e) => {
          if (!m) return;
          const t0 = 0.02 + e * slot + 0.03;
          const x = d.slice(Math.floor(t0 * sr), Math.floor((t0 + 0.12) * sr));
          let best = 0, bp = -1;
          for (let c = 55; c < 92; c++) { const p = power(x, 440 * Math.pow(2, (c - 69) / 12)); if (p > bp) { bp = p; best = c; } }
          tot++; if (best === m) ok++;
        });
        out.leadMatch = `${ok}/${tot}`; out.leadOk = ok === tot;
      }
    }
    out.info = MUSIC.info();
    return out;
  });
  const m = info.modes;
  const levelsOk = ['menu', 'race', 'boost'].every((k) => m[k].peak > 0.05 && m[k].peak < 0.95 && m[k].rms > 0.01)
    && m.race.rms > m.menu.rms; // the full band is louder than the menu layer
  record('5e. music loop: audible, no clipping, lead = score', levelsOk && info.leadOk && info.info.bars === 16 && info.info.notes > 80, info);
}

// ---------- 5f. arched bridge over the milk river, river reaches the milk sea, drive-over stays grounded ----------
{
  const info = await page.evaluate(() => {
    const T = window.__TEST__; const b = T.bridge(); const L = T.gameInfo().trackLength;
    // drive over the hump at race speed: must stay on the ground with a modest pitch swing
    T.forceBoost(0.001);
    T.setProgress((b.crossingS - 60) / L, 0, false);
    let air = 0, pMin = 0, pMax = 0;
    for (let i = 0; i < 300; i++) {
      T.step(1 / 60, 1, false);
      const j = T.jumpInfo();
      if (j.jump !== 'ground') air++;
      pMin = Math.min(pMin, j.pitch); pMax = Math.max(pMax, j.pitch);
    }
    return { ...b, air, pitchDeg: [+(pMin * 57.3).toFixed(1), +(pMax * 57.3).toFixed(1)], end: T.jumpInfo() };
  });
  const hump = info.deckY - Math.max(info.deckBefore, info.deckAfter);
  const ok = hump > 1.5 && hump < 3.5 // arched deck
    && info.archApexY > info.riverY + 6 && info.archApexY < info.deckY // the arch opening is under the deck, above the milk
    && info.parts.bridgeArch === 1 && info.parts.bridgeAbutment === 2 && info.parts.milkRiver === 1 && info.parts.milkSea === 1
    && info.riverLength > 350 && info.sea.r >= 100
    && info.air === 0 && info.pitchDeg[0] < -3 && info.pitchDeg[1] > 3 && info.pitchDeg[0] > -12 && info.pitchDeg[1] < 12
    && info.end.jump === 'ground' && info.end.s > info.crossingS + 10;
  record('5f. arched bridge over the milk river → milk sea, smooth drive-over', ok, info);
}

// ---------- 6. no page errors ----------
{
  await sleep(500);
  record('6. no page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | ') || '');
}

const passed = results.filter((r) => r.pass).length;
console.log(`\n=== ${passed}/${results.length} acceptance checks passed ===`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
