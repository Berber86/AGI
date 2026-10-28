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

// 1. экран создаёт демо-комнату (поездка ещё НЕ стартовала)
const room = await game.evaluate(async () => window.__TEST__.remoteDemo());
record('комната создана', /^\d{6}$/.test(room.code) && room.info.room === room.code, room);

// 2. второй телефон входит по коду и видит состояние экрана ещё до старта
await joy.goto(JOY, { waitUntil: 'networkidle0', timeout: 60000 });
await joy.waitForFunction('!!window.__JOY__', { timeout: 30000 });
await joy.evaluate((code) => window.__JOY__.join(code), room.code);
let prepState = null;
for (let i = 0; i < 30 && !prepState; i++) {
  prepState = await joy.evaluate(() => window.__JOY__.lastState());
  if (!prepState) await sleep(500);
}
record('экран публикует состояние ещё до старта поездки', !!prepState && prepState.driver === 'remote', prepState);

// 2a. реальные зоны: левый сенсор даёт аналоговый руль, центр правого — 30% газа
const padProbe = await joy.evaluate(() => {
  const fire = (el, type, x, y) => el.dispatchEvent(new PointerEvent(type, {
    bubbles: true, pointerId: 77, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y,
  }));
  const steer = document.getElementById('pad-steer');
  const gas = document.getElementById('pad-throttle');
  const sr = steer.getBoundingClientRect(), gr = gas.getBoundingClientRect();
  fire(steer, 'pointerdown', sr.left + sr.width * 0.25, sr.top + sr.height * 0.5);
  const left = window.__JOY__.state();
  fire(steer, 'pointerup', sr.left + sr.width * 0.25, sr.top + sr.height * 0.5);
  fire(gas, 'pointerdown', gr.left + gr.width * 0.5, gr.top + gr.height * 0.5);
  const middle = window.__JOY__.state();
  fire(gas, 'pointerup', gr.left + gr.width * 0.5, gr.top + gr.height * 0.5);
  fire(gas, 'pointerdown', gr.left + gr.width * 0.5, gr.top + gr.height * 0.1);
  const top = window.__JOY__.state();
  fire(gas, 'pointerup', gr.left + gr.width * 0.5, gr.top + gr.height * 0.1);
  fire(gas, 'pointerdown', gr.left + gr.width * 0.5, gr.top + gr.height * 0.85);
  const lower = window.__JOY__.state();
  fire(gas, 'pointerup', gr.left + gr.width * 0.5, gr.top + gr.height * 0.85);
  return { left, middle, top, lower, readout: document.getElementById('drive-readout').textContent };
});
record('зоны джойстика: −0,5 руля, газ 30% в центре, 100% сверху, 0% снизу',
  padProbe.left.steer < -0.45 && padProbe.left.steer > -0.55 &&
  Math.abs(padProbe.middle.throttle - 0.3) < 0.01 && padProbe.top.throttle === 1 && padProbe.lower.throttle === 0, padProbe);

// Частые pointermove не должны превращаться в 60 Hz Firebase очередь.
const cadence = await joy.evaluate(async () => {
  const before = window.__JOY__.state().driveSent;
  for (let i = 0; i < 40; i++) {
    window.__JOY__.setDrive(i % 2 ? 1 : -1, 0.3);
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  await new Promise((resolve) => setTimeout(resolve, 180));
  return { sent: window.__JOY__.state().driveSent - before };
});
record('коалесценция: 40 частых движений дают не больше 7 пакетов', cadence.sent <= 7, cadence);

// 2b. теперь старт поездки
await game.evaluate(() => window.__TEST__.vrStart('look', 30));
const started = await game.evaluate(() => { const g = window.__TEST__.gameInfo(); return g.vrRide && g.driverMode === 'remote'; });
record('VR едет в режиме джойстика', !!started, started);
await game.evaluate(() => {
  window.__TEST__.step(1 / 60, 2, true);
  window.__TEST__.step(1 / 60, 28, false);
});
await sleep(400);
await joy.evaluate(() => window.__JOY__.setDrive(1, 0)); // вправо, без газа
await sleep(300);
const link0 = await game.evaluate(() => window.__TEST__.remoteInfo());
record('игра видит аналоговый руль и отпущенный газ', link0 && link0.connected && link0.steer === 1 && link0.throttle === 0, link0);

// 3. свежий нулевой газ останавливает машинку, но взгляд остаётся доступен
const stopped = await game.evaluate(() => {
  window.__TEST__.vrSetLook(18, 0);
  window.__TEST__.step(1 / 60, 180, false);
  return { game: window.__TEST__.gameInfo(), vr: window.__TEST__.vrInfo() };
});
record('отпущенный правый сенсор: машина стоит, осматриваться можно',
  stopped.game.state === 'racing' && stopped.game.speedKmh < 1.5 && stopped.vr.yawDeg > 8, stopped);

// 3a. центр газа = 30%, верх = полный газ
await joy.evaluate(() => window.__JOY__.setDrive(0, 0.3));
await sleep(200);
const middleGas = await game.evaluate(() => { window.__TEST__.step(1 / 60, 120, false); return window.__TEST__.gameInfo(); });
record('центр правого сенсора даёт примерно 30% скорости', middleGas.speedKmh > 18 && middleGas.speedKmh < 28, middleGas);
await joy.evaluate(() => window.__JOY__.setDrive(0, 1));
await sleep(200);
const fullGas = await game.evaluate(() => { window.__TEST__.step(1 / 60, 60, false); return window.__TEST__.gameInfo(); });
record('верх правого сенсора даёт максимальный газ', fullGas.speedKmh > 65, fullGas);

// 3b. машинка реально поворачивает от аналогового джойстика
await joy.evaluate(() => window.__JOY__.setDrive(1, 0.3)); // вправо
await sleep(250);
const link = await game.evaluate(() => window.__TEST__.remoteInfo());
record('игра видит аналоговый руль и газ', link && link.connected && link.steer === 1 && Math.abs(link.throttle - 0.3) < 0.01, link);
const lat0 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
await game.evaluate(() => window.__TEST__.step(1 / 60, 150, false));
const lat1 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
record('аналоговый руль вправо уводит машинку', lat1 > lat0 + 0.8, { lat0, lat1 });
await joy.evaluate(() => window.__JOY__.setDrive(-1, 0.3)); // влево
await sleep(200);
await game.evaluate(() => window.__TEST__.step(1 / 60, 150, false));
const lat2 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
record('аналоговый руль влево уводит машинку', lat2 < lat1 - 0.8, { lat1, lat2 });

// 3c. Прямой WebRTC 60 Гц + 3D-управление наклонами ладони (круиз 30% / газ / тормоз)
let rtcReady = false;
for (let i = 0; i < 25 && !rtcReady; i++) {
  const inf = await game.evaluate(() => window.__TEST__.remoteInfo());
  if (inf && inf.rtcOpen === true && inf.transport === 'webrtc') rtcReady = true;
  else await sleep(150);
}
const rtcInfo = await game.evaluate(() => window.__TEST__.remoteInfo());
record('WebRTC 60 Гц: прямой P2P-канал автоматически поднялся по коду комнаты', rtcReady, rtcInfo);

// Возвращаем машинку на центр дороги перед проверкой 3D-наклонов
await game.evaluate(() => window.__TEST__.setProgress(0.15, 0, false));
await joy.evaluate(async () => {
  if (typeof DeviceOrientationEvent !== 'undefined') {
    DeviceOrientationEvent.requestPermission = async () => 'granted';
  }
  if (typeof DeviceMotionEvent !== 'undefined') {
    DeviceMotionEvent.requestPermission = async () => 'granted';
  }
  window.__JOY__.setTilt({ beta: 35, gamma: 0 });
  document.getElementById('mode-tilt').click();
  await new Promise((r) => setTimeout(r, 80));
  window.__JOY__.setTilt({ beta: 35, gamma: 0 });
});
await sleep(120);
const tiltCruise = await game.evaluate(() => {
  window.__TEST__.step(1 / 60, 140, false);
  return { game: window.__TEST__.gameInfo(), remote: window.__TEST__.remoteInfo() };
});
record('3D наклоны: нейтральный хват (±5°) держит спокойный круиз ~30%',
  Math.abs(tiltCruise.remote.throttle - 0.3) < 0.02 && tiltCruise.remote.brake === 0 && tiltCruise.game.speedKmh > 18 && tiltCruise.game.speedKmh < 28,
  tiltCruise);

await joy.evaluate(() => window.__JOY__.setTilt({ beta: 8, gamma: 0 })); // наклон от себя = полный газ
await sleep(100);
const tiltGas = await game.evaluate(() => {
  window.__TEST__.step(1 / 60, 80, false);
  return { game: window.__TEST__.gameInfo(), remote: window.__TEST__.remoteInfo() };
});
record('3D наклоны: наклон от себя разгоняет машинку до полного газа',
  tiltGas.remote.throttle > 0.95 && tiltGas.game.speedKmh > 65,
  tiltGas);

// Боковой наклон вправо и влево из полувертикального хвата (beta=35°)
await joy.evaluate(() => window.__JOY__.setTilt({ beta: 35, gamma: 22 }));
await sleep(80);
const tLat0 = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
await game.evaluate(() => window.__TEST__.step(1 / 60, 90, false));
const tLatR = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
await joy.evaluate(() => window.__JOY__.setTilt({ beta: 35, gamma: -22 }));
await sleep(80);
await game.evaluate(() => window.__TEST__.step(1 / 60, 120, false));
const tLatL = await game.evaluate(() => window.__TEST__.gameInfo().lateral);
record('3D наклоны: боковой наклон рулит вправо и влево симметрично',
  tLatR > tLat0 + 0.5 && tLatL < tLatR - 0.8,
  { tLat0, tLatR, tLatL });

// Наклон на себя (beta 35° -> 58°) = активный тормоз до полной остановки (0 км/ч)
await joy.evaluate(() => window.__JOY__.setTilt({ beta: 58, gamma: 0 }));
await sleep(100);
const tiltBrake = await game.evaluate(() => {
  window.__TEST__.step(1 / 60, 90, false);
  return { game: window.__TEST__.gameInfo(), remote: window.__TEST__.remoteInfo() };
});
record('3D наклоны: наклон на себя включает активный тормоз до полной остановки',
  tiltBrake.remote.brake > 0.7 && tiltBrake.remote.throttle === 0 && tiltBrake.game.speedKmh < 1.5,
  tiltBrake);

// Слепая кнопка «ЦЕНТРИРОВАТЬ ХВАТ» делает новую позу (beta=58°) новым нулём (круиз 30%)
await joy.evaluate(() => document.getElementById('btn-tilt-center').click());
await sleep(100);
const recentered = await game.evaluate(() => window.__TEST__.remoteInfo());
record('3D наклоны: слепая кнопка центрирует новый хват обратно в 30% круиз',
  Math.abs(recentered.throttle - 0.3) < 0.02 && recentered.brake === 0 && recentered.steer === 0,
  recentered);

// Проверка бесшовного резерва: роняем WebRTC и убеждаемся, что управление идёт через резерв, затем поднимаем P2P обратно
await joy.evaluate(() => window.__JOY__.dropRtcForTest());
await sleep(180);
await joy.evaluate(() => window.__JOY__.setDrive(0.75, 0.5, 0));
await sleep(150);
const afterRtcDrop = await game.evaluate(() => window.__TEST__.remoteInfo());
record('резервный канал: при падении WebRTC управление мгновенно продолжается без сбоя',
  afterRtcDrop.rtcOpen === false && afterRtcDrop.fresh === true && Math.abs(afterRtcDrop.steer - 0.75) < 0.02,
  afterRtcDrop);
await joy.evaluate(() => window.__JOY__.reconnectRtc());

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

// 4. обрыв: вкладку джойстика закрыли — шесть секунд даём машине
// оставаться в ручном режиме, затем автопилот мягко подхватывает.
await joy.close();
await sleep(3000);
const beforeFallback = await game.evaluate(() => window.__TEST__.remoteInfo());
record('после 3 с тишины автопилот ещё не включён', beforeFallback && beforeFallback.fresh === true, beforeFallback);
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
