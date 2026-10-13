import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
const run = (s0, lat, boost, steps = 420) => page.evaluate(([s0, lat, boost, steps]) => {
  const T = window.__TEST__; const L = T.gameInfo().trackLength;
  T.forceBoost(boost ? 30 : 0.001); // 0.001 → boost ends on the next frame
  T.setProgress(s0 / L, lat, false);
  const out = []; let maxAir = 0, launchS = null, landS = null, landed = false;
  for (let i = 0; i < steps; i++) {
    const r = T.step(1 / 60, 1, false);
    const j = T.jumpInfo();
    if (j.air > maxAir) maxAir = j.air;
    if (j.jump === 'air' && launchS === null) launchS = j.s;
    if (launchS !== null && j.jump === 'ground' && !landed) { landed = true; landS = j.s; }
    if (i % 12 === 0) out.push(`${j.t}s s=${j.s} air=${j.air} vy=${j.vy} ${j.jump} v=${j.speed}`);
  }
  const j = T.jumpInfo();
  return { maxAir: +maxAir.toFixed(2), launchS, landS, dist: launchS && landS ? +(landS - launchS).toFixed(1) : null, final: j, trace: out };
}, [s0, lat, boost, steps]);
for (const [name, s0, lat, boost] of [['A-normal', 492, -2.3, false], ['A-boost', 492, -2.3, true], ['B-normal', 1216, 2.3, false], ['B-boost', 1216, 2.3, true]]) {
  const r = await run(s0, lat, boost);
  console.log(`\n== ${name}: maxAir=${r.maxAir} launch@${r.launchS} land@${r.landS} dist=${r.dist} final=${JSON.stringify(r.final)}`);
  
}
console.log('errors:', errors);
await browser.close();
