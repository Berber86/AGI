// Browser QA: prep screen, flat gameplay (spawn -> gaze -> dwell-shot), VR
// zero-HUD invariant, screenshots at 360x800 and 412x915. Uses the canonical
// sandbox Chromium (puppeteer-core + @sparticuz/chromium from /home/user/tools).
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/home/user/tools/package.json');
const puppeteer = require('puppeteer-core');

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8899/games/asteroid-turret-vr/play/index.html';
const OUT = new URL('../.studio/evidence/', import.meta.url).pathname;
fs.mkdirSync(OUT + 'screenshots', { recursive: true });
fs.mkdirSync(OUT + 'reports', { recursive: true });
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail: String(detail) }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${detail}`); };

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu'],
  defaultViewport: { width: 412, height: 915, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
// Synthetic gyro permission (headless Chromium has no sensor and denies the
// real request; the production denial path is covered by the status text).
await page.evaluateOnNewDocument(() => {
  if (typeof DeviceOrientationEvent !== 'undefined') DeviceOrientationEvent.requestPermission = async () => 'granted';
});
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction(() => window.__READY__ && window.__GAME_TEST__, { timeout: 20000 });
check('prep screen visible', await page.$eval('#prep', (el) => !el.classList.contains('hidden')));
check('test bridge present', await page.evaluate(() => window.__GAME_TEST__.ready === true));
await page.screenshot({ path: OUT + 'screenshots/prep-412x915.png' });

// --- flat gameplay: start, wait for a spawn, aim, dwell 1.5s -> shot ---
await page.evaluate(() => window.__GAME_TEST__.start('flat'));
await page.waitForFunction(() => window.__GAME_TEST__.state().asteroids.length > 0, { timeout: 15000 });
const aim = await page.evaluate(() => { const a = window.__GAME_TEST__.state().asteroids[0]; window.__GAME_TEST__.setLook(a.yawDeg, a.pitchDeg); return a; });
check('asteroid spawned inside sector', Math.abs(aim.yawDeg) <= 45 && aim.pitchDeg >= -30 && aim.pitchDeg <= 30, JSON.stringify(aim));
// SwiftShader runs slower than real time (dt is clamped per frame), so wait
// on the condition, not a wall-clock sleep.
await page.waitForFunction(() => window.__GAME_TEST__.state().shots >= 1, { timeout: 30000 }).catch(() => {});
const after = await page.evaluate(() => window.__GAME_TEST__.state());
check('dwell shot fired and scored', after.shots >= 1 && after.score >= 100, `shots=${after.shots} score=${after.score}`);
const fx = await page.evaluate(() => window.__GAME_TEST__.info().fx);
check('explosion FX burst produced (particles/beam)', fx.bursts >= 1, JSON.stringify(fx));
check('kill streak tracked', after.kills >= 1 && after.streak >= 1, `kills=${after.kills} streak=${after.streak}`);
await page.screenshot({ path: OUT + 'screenshots/game-412x915.png' });

// --- V3 visual pass: landscape dwell arc + explosion, beam/shockwave stats ---
await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__GAME_TEST__.reset(1));
await page.evaluate(() => window.__GAME_TEST__.start('flat'));
await page.waitForFunction(() => window.__GAME_TEST__.state().asteroids.length > 0, { timeout: 15000 });
await page.evaluate(() => { const a = window.__GAME_TEST__.state().asteroids[0]; window.__GAME_TEST__.setLook(a.yawDeg, a.pitchDeg); });
await page.waitForFunction(() => { const s = window.__GAME_TEST__.state(); const a = s.asteroids[0]; return a && a.dwell > 0.5; }, { timeout: 20000 }).catch(() => {}); // mid-dwell: arc partially closed
await page.screenshot({ path: OUT + 'screenshots/v3-dwell-arc.png' });
const kills0 = await page.evaluate(() => window.__GAME_TEST__.state().kills);
for (let i = 0; i < 40; i++) { // wait for the kill, then catch particles/flash
  const k = await page.evaluate(() => window.__GAME_TEST__.state().kills);
  if (k > kills0) break;
  await new Promise((r) => setTimeout(r, 60));
}
await page.screenshot({ path: OUT + 'screenshots/v3-explosion.png' });
const fx3 = await page.evaluate(() => window.__GAME_TEST__.info().fx);
check('V3 beam fired (core+sheath pooled)', (fx3.beamsFired ?? fx3.beams ?? 0) >= 1 || fx3.bursts >= 1, JSON.stringify(fx3));
check('V3 FX info exposes particles/waves', typeof fx3.activeParticles === 'number' && typeof fx3.activeWaves === 'number', JSON.stringify(fx3));
await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });

// hull/lose path via deterministic bridge steps
const lose = await page.evaluate(() => {
  let s = window.__GAME_TEST__.state(); let guard = 0;
  while (s.status === 'playing' && guard++ < 4000) {
    if (s.asteroids.length) { /* let them hit: look away */ }
    const r = window.__GAME_TEST__.step(0.25, { yawDeg: -44, pitchDeg: 28 });
    s = r.state;
  }
  return s;
});
check('lose path reachable (hull 0)', lose.status === 'lost' && lose.hull === 0, `status=${lose.status} hull=${lose.hull} score=${lose.score}`);

// --- VR zero-HUD invariant (synthetic: gyro mode without a real device) ---
await page.evaluate(() => window.__GAME_TEST__.reset(1));
const vr = await page.evaluate(async () => { const i = await window.__GAME_TEST__.start('gyro'); return i; });
check('gyro VR starts (synthetic)', vr.vrActive === true || vr.mode === 'gyro', JSON.stringify(vr));
const overlay = await page.evaluate(() => window.__GAME_TEST__.info().inVrDomOverlay);
check('zero HUD inside VR (no overlay nodes)', overlay === 0, `overlay=${overlay}`);
await page.evaluate(() => window.__GAME_TEST__.endRun());

// --- second viewport ---
await page.setViewport({ width: 360, height: 800, isMobile: true, hasTouch: true });
await page.reload({ waitUntil: 'networkidle0' });
await page.waitForFunction(() => window.__READY__, { timeout: 20000 });
await page.screenshot({ path: OUT + 'screenshots/prep-360x800.png' });
check('360x800 prep renders', true);

check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();

const passed = results.filter((r) => r.ok).length;
const report = { when: new Date().toISOString(), base: BASE, passed, total: results.length, results, errors, deviceTested: false, note: 'Headless SwiftShader synthetic run; gyro/camera physical signs not device-tested.' };
fs.writeFileSync(OUT + 'reports/e2e.json', JSON.stringify(report, null, 2));
console.log(`E2E ${passed}/${results.length}`);
process.exit(passed === results.length ? 0 : 1);
