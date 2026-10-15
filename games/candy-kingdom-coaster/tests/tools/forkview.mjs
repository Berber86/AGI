// forkview.mjs — screenshots at exact fork stations for visual QA of the four
// destinations. Run beside puppeteer-core after setup-runtime.mjs.
//   node forkview.mjs <outDir> name:forkIdx:q:lat:option [...]
//     forkIdx — 0 | 1          q — 0..1 of the fork span (0 = s0, 1 = s1)
//     lat     — lateral metres on that branch (- = left of its own centre)
//     option  — 0 | 1 branch
//   Env FREE="dy,back,ahead" freezes a fixed camera instead of the chase camera.
//   Env HUD=1 keeps the HUD (default: hidden, pure graphics).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const specs = process.argv.slice(3);
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 915, height: 412, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 400)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 400)); });
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });
await page.evaluate(() => { __TEST__.pinQuality(2); __TEST__.internals().governor.hold(1e9); });
const info = await page.evaluate(() => {
  const { track } = __TEST__.internals();
  return { length: +track.length.toFixed(1), route: +track.routes.routeLength().toFixed(1),
    forks: track.routes.forks.map((f) => ({ id: f.id, s0: +f.s0.toFixed(1), s1: +f.s1.toFixed(1), branches: f.branches.map((b) => ({ id: b.id, kind: b.kind })) })) };
});
console.log('track', JSON.stringify(info));
const FREE = process.env.FREE, HUD = process.env.HUD === '1';
for (const spec of specs) {
  const [name, fi, q, lat, option] = spec.split(':');
  const res = await page.evaluate(async ([fi, q, lat, option, FREE]) => {
    const T = __TEST__, { track, camera } = T.internals();
    const f = track.routes.forks[+fi];
    T.startRace(); T.chooseFork(f.id, +option);
    const s = f.s0 + f.span * parseFloat(q);
    T.setProgress(s / track.length, parseFloat(lat), true);
    T.snapCamera();
    if (FREE) { const [dy, back, ahead] = FREE.split(',').map(Number); T.fixCamTrack(s - back, parseFloat(lat) * .5, dy, s + ahead, parseFloat(lat), 1.5); }
    T.step(1 / 60, 2, false); camera.updateMatrixWorld(true);
    return { s: +s.toFixed(1) };
  }, [fi, q, lat, option, FREE]);
  if (!HUD) await page.evaluate(() => __TEST__.hideHUD());
  await page.evaluate(() => new Promise((r) => { let n = 0; const t = () => (++n >= 6 ? r() : requestAnimationFrame(t)); requestAnimationFrame(t); }));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name, 's=' + res.s);
}
if (errors.length) console.log('BROWSER ERRORS:', JSON.stringify(errors.slice(0, 5), null, 1));
await browser.close();
