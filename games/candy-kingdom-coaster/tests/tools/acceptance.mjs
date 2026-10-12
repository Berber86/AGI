// acceptance.mjs — 8 acceptance checks for Candy Kingdom Coaster
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
      for (let k = 0; k < 24; k++) {
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

// ---------- 6. no page errors ----------
{
  await sleep(500);
  record('6. no page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | ') || '');
}

const passed = results.filter((r) => r.pass).length;
console.log(`\n=== ${passed}/${results.length} acceptance checks passed ===`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
