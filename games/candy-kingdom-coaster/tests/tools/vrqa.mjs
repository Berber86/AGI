// vrqa.mjs — приёмка «VR-поездки» (контракт VR_BRAINSTORM.md).
// Кнопка и экран подготовки, стереопара из двух квадратов с параллаксом,
// два режима взгляда, авто-обзор без гироскопа, автопилот до финиша с
// запланированными развилками, выход в портрет, обычная игра не сломана.
// Usage: node vrqa.mjs [baseUrl]  (запускать из /home/user/tools)
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});

const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 140)));
const missing = [];
page.on('response', (r) => { if (r.status() === 404) missing.push(r.url()); });
page.on('console', (m) => {
  if (m.type() !== 'error') return;
  const t = m.text();
  if (/status of 404/.test(t) && missing.length && missing.every((u) => /\/assets\/music\/soundtrack\.mp3/.test(u))) return;
  pageErrors.push('console: ' + t.slice(0, 140));
});

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
await sleep(600);

// ---------- 1. кнопка, экран подготовки, запоминание настроек ----------
{
  const got = await page.evaluate(() => {
    const btn = document.getElementById('btn-vr');
    const out = { visible: !!btn && !btn.classList.contains('hidden') && !btn.disabled };
    btn.click();
    const scr = document.getElementById('screen-vr');
    out.prepVisible = !scr.classList.contains('hidden');
    const ipd = document.getElementById('vr-ipd');
    out.range = [ipd.min, ipd.max, ipd.value];
    ipd.value = '80';
    ipd.dispatchEvent(new Event('input', { bubbles: true }));
    ipd.dispatchEvent(new Event('change', { bubbles: true }));
    out.saved = JSON.parse(localStorage.getItem('ckc_v1_vr') || 'null');
    out.label = document.getElementById('vr-ipd-val').textContent;
    return out;
  });
  record('prep: кнопка, экран, ползунок 10–150 и сохранение',
    got.visible && got.prepVisible && got.range[0] === '10' && got.range[1] === '150'
      && got.saved && got.saved.baselineCm === 80 && /80 см/.test(got.label), got);

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 }); // networkidle под SwiftShader флачит
  await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
  const back = await page.evaluate(() => {
    document.getElementById('btn-vr').click();
    return document.getElementById('vr-ipd').value;
  });
  record('prep: настройка переживает перезагрузку', back === '80', back);
}

// ---------- 2. стереопара: два квадрата, параллакс, разделитель ----------
await page.evaluate(() => { window.__TEST__.vrStart('look', 60); });
await page.evaluate(() => window.__TEST__.step(1 / 60, 40, true));
const vr1 = await page.evaluate(() => window.__TEST__.vrInfo());
record('vr: старт — стерео активно, едем, план развилок есть',
  vr1.active && vr1.state === 'racing' && vr1.baselineCm === 60
    && vr1.plan && Object.keys(vr1.plan.choices).length === 2, vr1);

const hudHidden = await page.evaluate(() => getComputedStyle(document.getElementById('hud')).display === 'none'
  && getComputedStyle(document.getElementById('vr-divider')).display !== 'none');
record('vr: HUD скрыт, разделитель виден', hudHidden, hudHidden);

await page.screenshot({ path: '/home/user/AGI/games/candy-kingdom-coaster/tests/evidence/vr-stereo.png' });
{
  const img = sharp('/home/user/AGI/games/candy-kingdom-coaster/tests/evidence/vr-stereo.png');
  const meta = await img.metadata();
  const L = { side: Math.min(meta.height, Math.floor(meta.width / 2)) };
  L.x0 = Math.round((meta.width - L.side * 2) / 2);
  const crop = (x) => sharp('/home/user/AGI/games/candy-kingdom-coaster/tests/evidence/vr-stereo.png')
    .extract({ left: x, top: 0, width: L.side, height: L.side }).raw().toBuffer({ resolveWithObject: true });
  const a = await crop(L.x0), b = await crop(L.x0 + L.side);
  let diff = 0, brightA = 0, brightB = 0;
  const n = Math.min(a.data.length, b.data.length);
  for (let i = 0; i < n; i += 97) { diff += Math.abs(a.data[i] - b.data[i]); brightA += a.data[i]; brightB += b.data[i]; }
  const samples = Math.ceil(n / 97);
  const parallax = diff / samples, meanA = brightA / samples, meanB = brightB / samples;
  record('vr: два квадратных глаза, картинка живая, параллакс есть',
    L.side === 390 && meanA > 12 && meanB > 12 && parallax > 1.5,
    { side: L.side, meanA: +meanA.toFixed(1), meanB: +meanB.toFixed(1), parallax: +parallax.toFixed(2) });
  record('vr: раскладка совпадает с layout контроллера',
    vr1.layout && vr1.layout.side === L.side && vr1.layout.eyes[0] === L.x0, vr1.layout);
}

// ---------- 3. режимы взгляда и авто-обзор ----------
await page.evaluate(() => window.__TEST__.vrSetLook(30, -10));
await page.evaluate(() => window.__TEST__.step(1 / 60, 45, true));
const look = await page.evaluate(() => window.__TEST__.vrInfo());
record('look: взгляд следует за головой (подмена гироскопа)',
  look.lookSource === 'sim' && look.yawDeg > 15 && look.pitchDeg < -3, look);

await page.evaluate(() => { window.__TEST__.vrSetLook(null); });
const pan0 = await page.evaluate(() => window.__TEST__.vrInfo());
await sleep(1600);
await page.evaluate(() => window.__TEST__.step(1 / 60, 10, true));
const pan1 = await page.evaluate(() => window.__TEST__.vrInfo());
record('look: без гироскопа — авто-обзор',
  pan0.lookSource === 'autopan' && pan1.lookSource === 'autopan'
    && Math.abs(pan1.yawDeg - pan0.yawDeg) > 1, { from: pan0.yawDeg, to: pan1.yawDeg });

await page.evaluate(() => { window.__TEST__.vrStart('forward', 60); window.__TEST__.vrSetLook(30, 0); });
await page.evaluate(() => window.__TEST__.step(1 / 60, 45, true));
const fwd = await page.evaluate(() => window.__TEST__.vrInfo());
record('forward: голова игнорируется, взгляд по трассе',
  fwd.lookMode === 'forward' && Math.abs(fwd.yawDeg) < 1.5 && Math.abs(fwd.pitchDeg) < 1.5, fwd);

// ---------- 4. автопилот: полный заезд до финиша без ввода ----------
await page.evaluate(() => { window.__TEST__.vrStart('look', 25); });
let fin = null;
for (let i = 0; i < 70 && !fin; i++) {
  const st = await page.evaluate(() => { window.__TEST__.step(1 / 30, 300, false); return window.__TEST__.vrInfo().state; });
  if (st === 'finish') fin = true;
}
const endInfo = await page.evaluate(() => ({
  info: window.__TEST__.gameInfo(), forks: window.__TEST__.forks(),
  plan: window.__TEST__.vrInfo().plan, vr: window.__TEST__.vrInfo(),
  finishVisible: !document.getElementById('screen-finish').classList.contains('hidden'),
}));
const choicesOk = endInfo.forks.every((f) => f.selected === endInfo.plan.choices[f.id]);
record('autopilot: доехал до финиша, VR выключился, экран медалей',
  !!fin && endInfo.vr.active === false && endInfo.finishVisible, endInfo.vr);
record('autopilot: развилки пройдены по плану поездки', choicesOk,
  endInfo.forks.map((f) => `${f.id}:${f.selected}`));
record('autopilot: сладости собирались без игрока', endInfo.info.collected > 15, endInfo.info);

// ---------- 5. выход поворотом в портрет ----------
await page.evaluate(() => { window.__TEST__.vrStart('look', 30); window.__TEST__.step(1 / 60, 20, true); });
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await sleep(500);
const port = await page.evaluate(() => window.__TEST__.vrInfo());
record('exit: портрет завершает VR и возвращает в меню',
  port.active === false && port.state === 'menu', port);
await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true });

// ---------- 6. обычная игра не пострадала ----------
const normal = await page.evaluate(() => {
  const T = window.__TEST__;
  T.startRace(); T.fastForwardCountdown(); T.step(1 / 60, 90, false);
  const gi = T.gameInfo();
  T.toMenu();
  return gi;
});
record('normal: обычный заезд без VR работает как раньше',
  normal.state === 'racing' && normal.vrActive === false && normal.vrRide === false && normal.speedKmh > 20, normal);

record('ошибок на странице нет', pageErrors.length === 0, pageErrors.slice(0, 4));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\nVRQA: ${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
