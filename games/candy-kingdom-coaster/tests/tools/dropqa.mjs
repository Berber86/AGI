// dropqa.mjs — slide off a ramp side: trace + screenshots
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = '/home/user/shots';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
await page.evaluate(() => window.__TEST__.pinQuality(2));
const waitFrames = (n) => page.evaluate((n) => new Promise((res) => { let c = 0; const f = () => { if (++c >= n) res(); else requestAnimationFrame(f); }; requestAnimationFrame(f); }), n);
// spec: name, s0, lat, steer, steerFromS (start steering when s passes this), shotAtPhase ('drop'|'bounce'|null), frames
for (const [name, s0, lat, steer, steerFromS, shotFrames] of [
  ['A-drop-inward', 492, -2.3, 1, 503, 0], ['A-drop-shot', 492, -2.3, 1, 503, 78], ['B-drop-outward', 1216, 2.3, 1, 1228, 0], ['B-drop-shot', 1216, 2.3, 1, 1228, 86]]) {
  const r = await page.evaluate(([s0, lat, steer, steerFromS, shotFrames]) => {
    const T = window.__TEST__; const L = T.gameInfo().trackLength;
    T.holdSteer(null);
    T.setProgress(s0 / L, lat, false);
    T.snapCamera();
    const trace = []; let phases = []; let bounces = 0; let minVy = 0; let speedBefore = 0, speedAfter = 0; let maxRoll = 0;
    const n = shotFrames || 300;
    for (let i = 0; i < n; i++) {
      const j0 = T.jumpInfo();
      if (j0.s >= steerFromS) T.holdSteer(steer);
      if (j0.jump === 'ramp' && !speedBefore) speedBefore = j0.speed;
      T.step(1 / 60, 1, false);
      const j = T.jumpInfo();
      const roll = T.objectPose ? 0 : 0;
      if (phases[phases.length - 1] !== j.jump) phases.push(j.jump);
      if (j.jump === 'drop' && j0.vy < -1 && j.vy > 0) bounces++;
      minVy = Math.min(minVy, j.vy);
      if (j0.jump === 'drop' && j.jump === 'ground') speedAfter = j.speed;
      if (i % 6 === 0 && (j.jump !== 'ground' || i < 90)) trace.push(`s=${j.s} lat=${j.lateral} air=${j.air} vy=${j.vy} ${j.jump} v=${j.speed}`);
    }
    T.holdSteer(null);
    T.hideHUD();
    return { phases, bounces, minVy: +minVy.toFixed(2), speedBefore, speedAfter, final: T.jumpInfo(), trace };
  }, [s0, lat, steer, steerFromS, shotFrames]);
  console.log(`\n== ${name}: phases=${r.phases.join('>')} bounces=${r.bounces} minVy=${r.minVy} speed ${r.speedBefore}→${r.speedAfter} final=${JSON.stringify(r.final)}`);
  if (!shotFrames) console.log(r.trace.filter((_, i) => i % 2 === 0).slice(0, 16).join('\n'));
  else { await waitFrames(4); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); }
}
console.log('errors:', errors);
await browser.close();
