// remotqa.mjs — приёмка режима «VR + телефон-джойстик» (демо-транспорт).
// Настоящий Firebase в песочнице недоступен; BroadcastChannel в двух
// вкладках проверяет всю цепочку: комната → страница джойстика → руль
// доезжает до машинки → обрыв связи подхватывает автопилот.
// Usage: node remotqa.mjs (из /home/user/tools)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const GAME = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const JOY = GAME.replace('/index.html', '/joystick/index.html') + '?demo=1';
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

const game = await browser.newPage();
const joy = await browser.newPage();
await joy.setViewport({ width: 420, height: 800, isMobile: true, hasTouch: true });
const errors = [];
for (const p of [game, joy]) {
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 130)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 130)); });
}

await game.goto(GAME, { waitUntil: 'networkidle0', timeout: 90000 });
await game.waitForFunction('window.__READY__ === true', { timeout: 90000 });

// 1. экран создаёт демо-комнату и стартует VR-поездку в режиме джойстика
const room = await game.evaluate(async () => {
  const r = await window.__TEST__.remoteDemo();
  window.__TEST__.vrStart('look', 30);
  return r;
});
record('комната создана, VR едет в режиме джойстика', /^\d{6}$/.test(room.code) && room.info.room === room.code, room);
await game.evaluate(() => window.__TEST__.step(1 / 60, 30, false));

// 2. второй телефон: страница джойстика входит по коду
await joy.goto(JOY, { waitUntil: 'networkidle0', timeout: 60000 });
await joy.waitForFunction('!!window.__JOY__', { timeout: 30000 });
await joy.evaluate((code) => window.__JOY__.join(code), room.code);
await sleep(400);
await joy.evaluate(() => window.__JOY__.setSteer(false, true)); // вправо
await sleep(300);
const link = await game.evaluate(() => window.__TEST__.remoteInfo());
record('игра видит джойстик и его руль', link && link.connected && link.steer === 1, link);

// 3. машинка реально поворачивает от джойстика
const lat0 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
await game.evaluate(() => window.__TEST__.step(1 / 60, 150, false));
const lat1 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
record('удержание ▶ уводит машинку вправо', lat1 > lat0 + 0.8, { lat0, lat1 });
await joy.evaluate(() => window.__JOY__.setSteer(true, false)); // влево
await sleep(200);
await game.evaluate(() => window.__TEST__.step(1 / 60, 150, false));
const lat2 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
record('удержание ◀ уводит машинку влево', lat2 < lat1 - 0.8, { lat1, lat2 });

// 3b. высокоуровневые команды: круг джойстик → игра → состояние на джойстике
async function joyState(pred, tries = 60) {
  for (let i = 0; i < tries; i++) {
    const st = await joy.evaluate(() => window.__JOY__.lastState());
    if (st && pred(st)) return st;
    await sleep(500);
  }
  return joy.evaluate(() => window.__JOY__.lastState());
}
await joy.evaluate(() => window.__JOY__.setMode(true));
await joy.evaluate(() => window.__JOY__.sendCmd('autoToggle'));
const stAuto = await joyState((st) => st.auto === true);
record('команда: авторуление включается, состояние вернулось на джойстик', !!stAuto && stAuto.auto === true, stAuto);

await joy.evaluate(() => window.__JOY__.sendCmd('lookToggle'));
const stLook = await joyState((st) => st.look === 'forward');
record('команда: взгляд переключается в «вперёд»', !!stLook && stLook.look === 'forward', stLook);

await joy.evaluate(() => window.__JOY__.sendCmd('cmPlus'));
const stCm = await joyState((st) => st.cm === (stLook ? stLook.cm + 10 : 40));
record('команда: камеры +10 см применяются и видны', !!stCm && stCm.cm === 40, stCm);

await joy.evaluate(() => window.__JOY__.sendCmd('pauseToggle'));
let paused = false;
for (let i = 0; i < 30 && !paused; i++) { paused = (await game.evaluate(() => window.__TEST__.state())) === 'paused'; if (!paused) await sleep(500); }
record('команда: пауза с джойстика', paused, paused);
await joy.evaluate(() => window.__JOY__.sendCmd('pauseToggle'));
let resumed = false;
for (let i = 0; i < 30 && !resumed; i++) { const g = await game.evaluate(() => ({ st: window.__TEST__.state(), vr: window.__TEST__.vrInfo().active })); resumed = g.st === 'racing' && g.vr; if (!resumed) await sleep(500); }
record('команда: продолжить — гонка и VR-стерео вернулись', resumed, resumed);

await game.evaluate(() => window.__TEST__.setProgress(0.5, 0, false));
await joy.evaluate(() => window.__JOY__.sendCmd('restart'));
let restarted = false;
for (let i = 0; i < 30 && !restarted; i++) { const g = await game.evaluate(() => window.__TEST__.gameInfo()); restarted = g.state === 'racing' && g.timeS < 3; if (!restarted) await sleep(500); }
record('команда: заезд начинается заново, не вынимая телефон из очков', restarted, restarted);
await joy.evaluate(() => window.__JOY__.setMode(false));

// 4. обрыв: вкладку джойстика закрыли — автопилот подхватывает, поездка жива
await joy.close();
// Ждём именно истечения свежести руля (в headless главный поток игры занят
// рендером, и последнее сообщение может обработаться с опозданием — на
// телефонах доставка мгновенная). Проверяем семантику, а не гонку.
// Поллинг из Node: waitForFunction в этой среде голодает — главный поток
// страницы забит SwiftShader-рендером, один evaluate может идти минуту.
let wentStale = false;
for (let i = 0; i < 40 && !wentStale; i++) {
  const inf = await game.evaluate(() => window.__TEST__.remoteInfo());
  if (inf && inf.fresh === false) wentStale = true;
  else await sleep(1000);
}
const after = await game.evaluate(() => {
  window.__TEST__.step(1 / 60, 120, false);
  return { info: window.__TEST__.gameInfo(), remote: window.__TEST__.remoteInfo() };
});
record('после обрыва автопилот ведёт, поездка продолжается',
  wentStale && after.remote && after.remote.fresh === false && after.info.state === 'racing' && after.info.speedKmh > 20, after);

record('ошибок на страницах нет', errors.length === 0, errors.slice(0, 3));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\nREMOTQA: ${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
