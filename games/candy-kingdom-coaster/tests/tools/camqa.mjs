// camqa.mjs — приёмка VR-режима взгляда «По метке» (камера вместо гироскопа).
// Настоящей камеры в песочнице нет: синтетические кадры CamTracker
// (injectBlob) проходят весь путь метка -> углы -> VR-взгляд.
// Usage: node camqa.mjs (из /home/user/tools)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const GAME = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 180000,
});
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 130)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 130)); });

await page.goto(GAME, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });

// 1. синтетическая камера + старт поездки в режиме «По метке»
const boot = await page.evaluate(() => {
  const info = window.__TEST__.camEnableSynthetic();
  window.__TEST__.vrStart('camera', 30);
  window.__TEST__.step(1 / 60, 30, false);
  return { info, vr: window.__TEST__.vrInfo(), g: window.__TEST__.gameInfo() };
});
record('поездка в режиме «По метке» стартовала', boot.vr.active && boot.vr.lookMode === 'camera' && boot.g.state === 'racing', boot.vr);

// 2. метка по центру — взгляд вперёд
const center = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 6; i++) out = window.__TEST__.camFeed(160, 120, 40);
  window.__TEST__.step(1 / 60, 30, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка по центру: взгляд ≈ 0°', center.info.found && Math.abs(center.yaw) < 2.5, center);
record('диагностика цены обработки доступна (procMs/procW/ярус)', typeof center.info.procMs === 'number' && [160, 192, 256].includes(center.info.procW), center.info);

// 3. метка справа — взгляд поворачивается вправо за меткой
const right = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 8; i++) out = window.__TEST__.camFeed(227, 120, 40);
  window.__TEST__.step(1 / 60, 40, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка справа: VR-взгляд ушёл вправо (>10°)', right.info.yaw > 12 && right.yaw > 10, right);

// 4. метка слева — взгляд влево
const left = await page.evaluate(() => {
  let out;
  for (let i = 0; i < 8; i++) out = window.__TEST__.camFeed(93, 120, 40);
  window.__TEST__.step(1 / 60, 40, false);
  return { info: out.info, yaw: window.__TEST__.vrInfo().yawDeg };
});
record('метка слева: VR-взгляд ушёл влево (<-10°)', left.info.yaw < -12 && left.yaw < -10, left);

// 5. метка пропала — поездка жива, взгляд не падает
const lost = await page.evaluate(() => {
  window.__TEST__.camFeedEmpty();
  window.__TEST__.step(1 / 60, 40, false);
  return { info: window.__TEST__.camInfo(), g: window.__TEST__.gameInfo(), vr: window.__TEST__.vrInfo() };
});
record('метка потеряна: заезд продолжается, стерео живо', !lost.info.found && lost.g.state === 'racing' && lost.vr.active, lost.g.state);

// 6. команда с джойстика: камера выключается и включается обратно
const tog = await page.evaluate(() => {
  const off = window.__TEST__.sendRemoteCommand('camToggle');
  const on = window.__TEST__.sendRemoteCommand('camToggle');
  return { off: off.cam, on: on.cam };
});
record('команда camToggle: состояние камеры переключается', tog.off.on === false && tog.on.on === true, tog);

// 7. состояние для джойстика публикуется с полем cam
const st = await page.evaluate(() => window.__TEST__.remoteState());
record('remoteState содержит cam {on, found, yaw}', !!st.cam && st.cam.on === true && typeof st.cam.yaw === 'number', st.cam);

record('ошибок на странице нет', errors.length === 0, errors);

const failed = results.filter((r) => !r.pass);
console.log(`\nCAMQA: ${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
