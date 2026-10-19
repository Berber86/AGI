// fusionqa.mjs — сквозная проверка явного режима «Гибрид + 2 метки».
// Гироскоп подаётся синтетическими deviceorientation, метки — синтетикой
// CamTracker. Проверяется вся цепочка: UI/настройки -> GyroLook ->
// FusionLook -> VRController. Это проверка проводки и предохранителей,
// а не физического телефона/камеры.
//
// Usage: node fusionqa.mjs [baseUrl] (запускать из /home/user/tools)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass: !!pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 180)));
page.on('console', (m) => {
  if (m.type() === 'error' && !/soundtrack\.mp3|404/.test(m.text())) pageErrors.push(`console: ${m.text().slice(0, 160)}`);
});

const gyroEvent = (alpha, beta = 90, gamma = 0) => page.evaluate(([a, b, g]) => {
  window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {
    alpha: a, beta: b, gamma: g, absolute: false,
  }));
}, [alpha, beta, gamma]);
const step = (n = 1) => page.evaluate((count) => window.__TEST__.step(1 / 60, count, false), n);
const fusion = () => page.evaluate(() => window.__TEST__.fusionInfo());
const vrInfo = () => page.evaluate(() => window.__TEST__.vrInfo());
const camLook = () => page.evaluate(() => window.__TEST__.camLook());
const gyroTo = async (alpha, beta = 90) => {
  // Событие и кадры — синхронно в одном evaluate: между отдельными вызовами
  // медленный headless успевает состарить датчик и сбросить lastRaw.
  await page.evaluate(([a, b]) => {
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {
      alpha: a, beta: b, gamma: 0, absolute: false,
    }));
    window.__TEST__.step(1 / 60, 2, false);
  }, [alpha, beta]);
};

try {
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 90000 });
  await sleep(500);

  // ---------- подготовка: режим выбирается явно, панель и настройки честные ----------
  const prep0 = await page.evaluate(() => {
    document.getElementById('btn-vr').click();
    document.getElementById('vr-mode-fusion').click();
    return {
      pressed: document.getElementById('vr-mode-fusion').getAttribute('aria-pressed'),
      panel: !document.getElementById('vr-fusion-panel').classList.contains('hidden'),
      dual: !document.getElementById('vr-cam-dual-controls').classList.contains('hidden'),
      single: document.getElementById('vr-cam-single-controls').classList.contains('hidden'),
      saved: JSON.parse(localStorage.getItem('ckc_v1_vr') || 'null'),
    };
  });
  record('prep: fusion выбирается, видны настройки двух меток, режим сохранён',
    prep0.pressed === 'true' && prep0.panel && prep0.dual && prep0.single && prep0.saved.lookMode === 'fusion', prep0);

  // Headless Chromium отвечает requestPermission отказом даже для синтетики;
  // для проверки UI-проводки подменяем только разрешение, события настоящие.
  await page.evaluate(() => { DeviceOrientationEvent.requestPermission = async () => 'granted'; });
  await page.click('#vr-gyro-start');
  await gyroEvent(10, 90);
  await sleep(250);
  const prepGyro = await page.evaluate(() => ({
    text: document.getElementById('vr-gyro-status').textContent,
    info: window.__TEST__.fusionInfo().gyro,
  }));
  record('prep: кнопка включает слушатель гироскопа и показывает свежий датчик',
    prepGyro.info.listening && prepGyro.info.fresh && /Гироскоп есть/.test(prepGyro.text), prepGyro);

  // ---------- синтетическая поездка и калибровка пары ----------
  const started = await page.evaluate(() => {
    window.__TEST__.camEnableFusionSynthetic();
    const vr = window.__TEST__.vrStart('fusion', 30, false, 'auto');
    window.__TEST__.camFeedDual(82, 120, 238, 120, 26);
    window.__TEST__.camAgeMarkers(400);
    window.__TEST__.camFeedDual(82, 120, 238, 120, 26);
    const cal = window.__TEST__.camCalibrateDual();
    return { vr, cal, info: window.__TEST__.camInfo(), fusion: window.__TEST__.fusionInfo() };
  });
  record('fusion: поездка стартует, пара меток калибрует ноль',
    started.vr.active && started.vr.lookMode === 'fusion' && started.cal.ok && started.info.dualCalibrated, started);

  await gyroTo(10, 90); // база
  const base = await fusion();
  record('fusion: первое событие гироскопа становится базой без скачка',
    base.gyro.fresh && Math.abs(base.yawDeg) < 0.5 && Math.abs(base.pitchDeg) < 0.5, base);

  // Меток дальше нет: ведёт только гироскоп.
  await page.evaluate(() => window.__TEST__.camFeedDual(null, null, null, null, 26));
  for (const a of [20, 30, 40, 50]) await gyroTo(a, 90);
  await step(20);
  const yawMove = { fusion: await fusion(), vr: await vrInfo(), look: await camLook() };
  record('fusion-gyro: alpha +40° даёт внутренний yaw +40° и VR следует за ним',
    yawMove.fusion.status === 'fusion-gyro'
      && Math.abs(yawMove.fusion.yawDeg - 40) < 3
      && Math.abs(yawMove.vr.yawDeg - 40) < 5
      && Math.abs(yawMove.look.yaw - yawMove.fusion.yawDeg) < 0.5,
    yawMove);

  for (const b of [95, 100, 105]) await gyroTo(50, b);
  await step(20);
  const pitchMove = { fusion: await fusion(), vr: await vrInfo() };
  record('fusion-gyro: beta +15° даёт pitch +15° без заметного перекрёстного yaw',
    Math.abs(pitchMove.fusion.pitchDeg - 15) < 3
      && Math.abs(pitchMove.fusion.yawDeg - 40) < 4
      && Math.abs(pitchMove.vr.pitchDeg - 15) < 5,
    pitchMove);

  // Одиночный невозможный скачок сырья не должен телепортировать взгляд.
  const { beforeSpike, duringSpike, afterSpike } = await page.evaluate(() => {
    const T = window.__TEST__;
    const ev = (alpha, beta) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {
      alpha, beta, gamma: 0, absolute: false,
    }));
    ev(50, 105);
    T.step(1 / 60, 1, false); // lastRaw гарантированно на текущей позе
    const before = T.fusionInfo();
    ev(140, 20);
    T.step(1 / 60, 1, false);
    const during = T.fusionInfo();
    ev(50, 105);
    T.step(1 / 60, 2, false);
    return { beforeSpike: before, duringSpike: during, afterSpike: T.fusionInfo() };
  });
  record('fusion guard: одиночный выброс гироскопа не двинул взгляд и записан',
    Math.abs(duringSpike.yawDeg - beforeSpike.yawDeg) < 1
      && Math.abs(duringSpike.pitchDeg - beforeSpike.pitchDeg) < 1
      && duringSpike.guards.gyroJumps >= 1
      && Math.abs(afterSpike.yawDeg - beforeSpike.yawDeg) < 2,
    { beforeSpike, duringSpike, afterSpike });

  for (const [a, b] of [[40, 100], [30, 95], [20, 90], [10, 90]]) await gyroTo(a, b);
  await step(10);
  const centred = await fusion();
  record('fusion-gyro: обратный ход возвращает взгляд к центру',
    Math.abs(centred.yawDeg) < 3 && Math.abs(centred.pitchDeg) < 3, centred);

  // ---------- пара как якорь: медленно правит, не снапит старой логикой ----------
  const feedPairTheta = (theta) => page.evaluate((deg) => {
    const at = (v) => Math.round(160 + 251.1 * Math.tan((v * Math.PI) / 180));
    return window.__TEST__.camFeedDual(at(deg - 17.3), 120, at(deg + 17.3), 120, 26);
  }, theta);
  for (const theta of [3, 6, 10, 10]) {
    await feedPairTheta(theta);
    await gyroEvent(10, 90);
    await step(2);
    await sleep(90);
  }
  const anchorStart = await fusion();
  await gyroEvent(10, 90);
  await step(60);
  const anchorMid = { fusion: await fusion(), look: await camLook(), info: await page.evaluate(() => window.__TEST__.camInfo()) };
  record('fusion: доказанная пара правит центр медленно, а не мгновенным снапом',
    anchorMid.fusion.status === 'fusion'
      && anchorMid.fusion.cameraStatus === 'valid'
      && anchorMid.look.pairFixation === true
      && anchorMid.fusion.yawDeg > anchorStart.yawDeg + 2
      && anchorMid.fusion.yawDeg < 9.5,
    { anchorStart, ...anchorMid });
  await gyroEvent(10, 90);
  await step(120);
  const anchorDone = await fusion();
  record('fusion: за следующие 2 с модельного времени якорь почти закрыт',
    anchorDone.status === 'fusion' && Math.abs(anchorDone.yawDeg - 10) < 2, anchorDone);

  // ---------- гироскоп молчит: грейс, потом fusion-camera без присвоения ----------
  for (const theta of [7, 4, 0, 0]) {
    await feedPairTheta(theta);
    await sleep(90);
  }
  await gyroEvent(10, 90);
  await step(1); // гироскоп снова жив: счётчик потери FusionLook сброшен
  const beforeGrace = await fusion();
  // Возраст датчика и 30 кадров делаем синхронно в одном evaluate: иначе
  // медленный SwiftShader успевает сам прожить грейс между вызовами QA.
  const grace = await page.evaluate(() => {
    window.__TEST__.gyroAge(1000);
    window.__TEST__.step(1 / 60, 30, false); // 0.5 с модельного времени
    return window.__TEST__.fusionInfo();
  });
  record('fusion loss: первые 0.5 с без гироскопа взгляд удерживается',
    grace.status === 'fusion-wait' && Math.abs(grace.yawDeg - beforeGrace.yawDeg) < 0.5,
    { beforeGrace, grace });
  await step(150);
  const cameraFallback = { fusion: await fusion(), vr: await vrInfo() };
  record('fusion loss: после грейса ведёт камера и доводит взгляд к паре на 0°',
    cameraFallback.fusion.status === 'fusion-camera'
      && Math.abs(cameraFallback.fusion.yawDeg) < 2
      && Math.abs(cameraFallback.vr.yawDeg) < 4,
    cameraFallback);

  // ---------- старый camera-dual не получил скрытого гироскопа ----------
  const dualMode = await page.evaluate(() => {
    window.__TEST__.camEnableDualSynthetic();
    const vr = window.__TEST__.vrStart('camera-dual', 30, false, 'auto');
    return { vr, fusion: window.__TEST__.fusionInfo() };
  });
  record('регрессия: camera-dual остаётся чистым камерным режимом без fusion',
    dualMode.vr.lookMode === 'camera-dual' && dualMode.vr.fusion === null && dualMode.fusion.gyro.listening === false,
    dualMode);

  record('нет pageerror за весь прогон', pageErrors.length === 0, pageErrors);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass).length;
console.log(`\nИтог: ${results.length - failed} PASS / ${failed} FAIL`);
process.exit(failed ? 1 : 0);
