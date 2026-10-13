// bridgeqa.mjs — drive over the humped bridge (normal + boost): no air phase, no drop, smooth pitch
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390 } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', String(e).slice(0, 300)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
console.log(JSON.stringify(await page.evaluate(() => window.__TEST__.bridge())));
const run = (s0, lat, boost, steps) => page.evaluate(([s0, lat, boost, steps]) => {
  const T = window.__TEST__; const L = T.gameInfo().trackLength;
  T.forceBoost(boost ? 30 : 0.001);
  T.setProgress(s0 / L, lat, false);
  const out = []; let air = 0, maxPitch = 0, minPitch = 0, drop = 0;
  for (let i = 0; i < steps; i++) {
    T.step(1 / 60, 1, false);
    const j = T.jumpInfo(); const c = { pitch: j.pitch, drop: j.jump === 'drop' || j.jump === 'tumble', y: 0 };
    if (j.jump !== 'ground') air++;
    if (c.drop) drop++;
    const px = c.pitch ?? c.rotX ?? 0; maxPitch = Math.max(maxPitch, px); minPitch = Math.min(minPitch, px);
    if (i % 15 === 0) out.push(`s=${j.s} y=${(c.y ?? 0).toFixed?.(2)} pitch=${(px * 57.3).toFixed(1)}° ${j.jump} v=${j.speed}`);
  }
  return { air, drop, maxPitchDeg: +(maxPitch * 57.3).toFixed(1), minPitchDeg: +(minPitch * 57.3).toFixed(1), final: T.jumpInfo(), trace: out };
}, [s0, lat, boost, steps]);
for (const [name, s0, lat, boost, steps] of [['normal', 340, 0, false, 300], ['boost', 340, 2, true, 240]]) {
  const r = await run(s0, lat, boost, steps);
  console.log(`\n== ${name}: airFrames=${r.air} dropFrames=${r.drop} pitch ${r.minPitchDeg}..${r.maxPitchDeg} final=${JSON.stringify(r.final)}`);
  console.log(r.trace.join('\n'));
}
await browser.close();
