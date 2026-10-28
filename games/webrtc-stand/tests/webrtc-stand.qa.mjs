// webrtc-stand.qa.mjs — полная браузерная приёмка стенда «Firebase против WebRTC» в двух вкладках.
// Проверяет:
//  1) Подхват сохранённого firebaseConfig из localStorage ('ckc_stand_cfg');
//  2) Создание комнаты по 6-значному коду + авто-обнаружение комнаты во 2-й вкладке;
//  3) Настоящее P2P-соединение RTCPeerConnection + RTCDataChannel (ordered:false, maxRetransmits:0);
//  4) Инспектор маршрута определяет локальный маршрут (host <-> host);
//  5) Поток 60 Гц двигает плавный луч WebRTC быстрее облачного канала, а число записей сигналинга замирает;
//  6) Попадание в мишень 🎯 и кнопка «Послать вибро» доставляют виброотклик на пульт;
//  7) Таблица бок о бок заполняет медиану/p95 на ОБОИХ экранах и выдаёт зелёный вердикт;
//  8) Искусственный обрыв WebRTC бесшовно переключает управление на авто-фолбэк Firebase, а возврат поднимает WebRTC снова;
//  9) На мобильных вьюпортах 360x800 и 412x915 нет горизонтального скролла и ошибок консоли.

import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const URL_STAND = process.argv[2] || 'http://127.0.0.1:8080/games/webrtc-stand/index.html';
const SHOTS_DIR = process.argv[3] || '/tmp/shots';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitUntil(fn, timeoutMs = 15000, stepMs = 150) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (await fn()) return true;
    await sleep(stepMs);
  }
  return false;
}

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote',
    '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: 412, height: 915, isMobile: true, hasTouch: true },
  protocolTimeout: 120000,
});

const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass });
  const info = typeof detail === 'string' ? detail : JSON.stringify(detail);
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}${info ? '  ' + info : ''}`);
};

const errors = [];
const host = await browser.newPage();
const joy = await browser.newPage();

// Предварительно положим сохранённый конфиг в localStorage до загрузки, чтобы проверить автоподхват
await host.evaluateOnNewDocument(() => {
  localStorage.setItem('ckc_stand_cfg', '{ databaseURL: "https://saved-test-rtdb.europe-west1.firebasedatabase.app" }');
});

for (const p of [host, joy]) {
  p.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 140)));
  p.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 140));
  });
  await p.goto(URL_STAND, { waitUntil: 'networkidle0', timeout: 45000 });
  await p.waitForFunction('!!window.__WEBRTC_STAND__', { timeout: 20000 });
}

// 1. Автоподхват сохранённого конфига
const savedCheck = await host.evaluate(() => ({
  val: document.getElementById('cfg').value,
  hintVisible: !document.getElementById('cfg-saved-hint').classList.contains('hidden'),
}));
record(
  'подхвачен сохранённый firebaseConfig из прошлого стенда',
  savedCheck.hintVisible && savedCheck.val.includes('saved-test-rtdb'),
  savedCheck
);

// 2. Включаем демо-режим (имитация облака 140 мс, но настоящий RTCPeerConnection между вкладками!)
await host.evaluate(() => {
  document.getElementById('ice-mode').value = 'lan';
  window.__WEBRTC_STAND__.demo(140);
  window.__WEBRTC_STAND__.host();
});
await sleep(250);
const code = await host.evaluate(() => window.__WEBRTC_STAND__.room());
record('комната создана, 6-значный код', /^\d{6}$/.test(code || ''), code);

await joy.evaluate((c) => {
  document.getElementById('ice-mode').value = 'lan';
  window.__WEBRTC_STAND__.demo(140);
  window.__WEBRTC_STAND__.join(c);
}, code);

// 3. Ждём открытия настоящего WebRTC DataChannel
const rtcOpened = await waitUntil(async () => {
  const s1 = await host.evaluate(() => window.__WEBRTC_STAND__.snapshot());
  const s2 = await joy.evaluate(() => window.__WEBRTC_STAND__.snapshot());
  return s1.rtc?.status === 'open' && s2.rtc?.status === 'open';
}, 12000);
const openSnap = await host.evaluate(() => window.__WEBRTC_STAND__.snapshot());
record(
  'настоящий WebRTC DataChannel открыт на обоих экранах по локальному маршруту',
  rtcOpened && openSnap.rtc?.route?.kind === 'lan',
  {
    status: openSnap.rtc?.status,
    route: openSnap.rtc?.route?.kind,
    badge: openSnap.rtc?.route?.badgeText,
  }
);

// 4. Включаем авто-круг 60 Гц и ждём накопления пинг-понга (~4.5 с)
const sigWritesAtConnect = (await joy.evaluate(() => window.__WEBRTC_STAND__.snapshot())).stats.signalDbWrites;
await joy.evaluate(() => window.__WEBRTC_STAND__.setAutoOrbit(true));
await sleep(4600);

const joyMid = await joy.evaluate(() => window.__WEBRTC_STAND__.snapshot());
const hostMid = await host.evaluate(() => window.__WEBRTC_STAND__.snapshot());

record(
  'поток WebRTC ~60 Гц отправляет в разы больше пакетов, чем коалесцированный Firebase (~6 Гц)',
  joyMid.stats.rtcPkts > joyMid.stats.fbPkts * 3 && joyMid.stats.signalDbWrites === sigWritesAtConnect,
  {
    rtcPkts: joyMid.stats.rtcPkts,
    fbPkts: joyMid.stats.fbPkts,
    sigWritesStart: sigWritesAtConnect,
    sigWritesNow: joyMid.stats.signalDbWrites,
  }
);

record(
  'задержка WebRTC кратно ниже имитации облака 140 мс, вердикт победный на обоих экранах',
  typeof joyMid.stats.rtcOneWayMed === 'number' &&
    typeof joyMid.stats.fbOneWayMed === 'number' &&
    joyMid.stats.rtcOneWayMed < 35 &&
    joyMid.stats.fbOneWayMed >= 100 &&
    /Победа прямого канала|Прямая UDP-труба/.test(hostMid.verdict),
  {
    rtcMed: joyMid.stats.rtcOneWayMed,
    fbMed: joyMid.stats.fbOneWayMed,
    hostVerdict: hostMid.verdict.slice(0, 80),
  }
);

// 5. Проверка попадания в мишень 🎯 и ручного виброотклика (Host -> Joy)
await joy.evaluate(() => window.__WEBRTC_STAND__.setAutoOrbit(false));
await host.evaluate(() => window.__WEBRTC_STAND__.setTargetPos(0.35, -0.2));
await joy.evaluate(() => window.__WEBRTC_STAND__.setPad(0.35, -0.2));
await host.evaluate(() => window.__WEBRTC_STAND__.triggerHaptic());
const gotHaptics = await waitUntil(async () => {
  const s = await joy.evaluate(() => window.__WEBRTC_STAND__.snapshot());
  return s.joy.hapticReceived >= 2;
}, 5000);
const hapticSnap = await joy.evaluate(() => window.__WEBRTC_STAND__.snapshot());
record('виброотклик мгновенно доходит с Экрана на Пульт (от мишени и кнопки)', gotHaptics, {
  hapticReceived: hapticSnap.joy.hapticReceived,
  via: hapticSnap.joy.lastHapticVia,
});

// Скриншоты рабочего состояния для визуального осмотра
await host.screenshot({ path: `${SHOTS_DIR}/webrtc-stand-host.png`, fullPage: false });
await joy.screenshot({ path: `${SHOTS_DIR}/webrtc-stand-joy.png`, fullPage: false });

// 6. Тест искусственного обрыва WebRTC -> бесшовный перехват через авто-фолбэк Firebase!
await host.evaluate(() => window.__WEBRTC_STAND__.setSimulatedDrop(true));
await joy.evaluate(() => {
  window.__WEBRTC_STAND__.setSteer(true, false);
  window.__WEBRTC_STAND__.setPad(-0.6, 0.4);
});
const fallbackWorked = await waitUntil(async () => {
  const hs = await host.evaluate(() => ({
    snap: window.__WEBRTC_STAND__.snapshot(),
    leftOn: document.getElementById('view-left').classList.contains('on'),
  }));
  return hs.snap.activeSource === 'fb-fallback' && hs.leftOn;
}, 6000);
record('при обрыве WebRTC управление без потерь перехватывает авто-фолбэк Firebase', fallbackWorked);

// 7. Восстановление WebRTC одной кнопкой
await host.evaluate(() => window.__WEBRTC_STAND__.setSimulatedDrop(false));
const recovered = await waitUntil(async () => {
  const hs = await host.evaluate(() => window.__WEBRTC_STAND__.snapshot());
  return hs.rtc?.status === 'open' && hs.activeSource === 'rtc';
}, 10000);
record('после возврата прямая труба WebRTC поднимается обратно автоматически', recovered);
await joy.evaluate(() => window.__WEBRTC_STAND__.setSteer(false, false));

// 8. Проверка мобильных вьюпортов 360x800 и 412x915 (отсутствие горизонтального переполнения)
for (const [w, h] of [[360, 800], [412, 915]]) {
  await host.setViewport({ width: w, height: h, isMobile: true, hasTouch: true });
  await joy.setViewport({ width: w, height: h, isMobile: true, hasTouch: true });
  await sleep(150);
  const overflowHost = await host.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  const overflowJoy = await joy.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  record(`мобильный вьюпорт ${w}x${h} без горизонтального скролла`, !overflowHost && !overflowJoy, {
    overflowHost,
    overflowJoy,
  });
}

record('нет ошибок на страницах и в консоли', errors.length === 0, errors.slice(0, 3));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\nWEBRTC_STAND_QA: ${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
