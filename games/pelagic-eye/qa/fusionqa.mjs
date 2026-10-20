// fusionqa.mjs — сквозная проверка гибридного источника взгляда в браузере.
// Гироскоп подаётся синтетическими событиями deviceorientation, метки —
// QA-подачей драйвера (startSynthetic): проверяется вся цепочка
// события → ReefWorld.updateGaze → FusionLook → камера сцены + статусы HUD.
//
// ВАЖНО про темп: SwiftShader тянет сцену лишь на ~3 кадр/с, а updateGaze
// живёт в рендер-цикле, поэтому тест КАДРОВО-ориентированный: все ожидания —
// «прошло N кадров» (waitFrames), а повороты гироскопа подаются малыми
// ступенями с ожиданием кадров между ними: предохранитель слияния обязан
// отвергать один физически невозможный большой шаг сырья.
// dt в мире зажат 0.06 с, поэтому коррекция в headless идёт медленнее
// реального времени — считаем её в кадрах, не в секундах.
//
// Запуск: cwd /home/user/tools после bootstrap (сервер :8899 на корень репо).
import puppeteer from "puppeteer-core";
process.env.LD_LIBRARY_PATH = "/tmp/al2023/lib";
process.env.HOME = "/tmp";

const URL = "http://127.0.0.1:8899/games/pelagic-eye/play/index.html";
const DEG = Math.PI / 180;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let passed = 0;
let failed = 0;
const check = (name, cond, detail = "") => {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name} ${detail}`);
  }
};

const browser = await puppeteer.launch({
  executablePath: "/tmp/chromium",
  headless: true,
  args: [
    "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
    "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    "--disable-gpu-sandbox", "--hide-scrollbars", "--mute-audio",
    "--single-process", "--no-zygote", "--in-process-gpu", "--headless",
    "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream",
  ],
  // Маленький вьюпорт и качество «баланс» — иначе SwiftShader даёт <1 кадр/с.
  defaultViewport: { width: 480, height: 270, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});

const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
await page.evaluateOnNewDocument(() => {
  localStorage.setItem(
    "pelagic-eye.settings.v1",
    JSON.stringify({ ipd: 6.4, quality: "balanced", reducedMotion: false, soundOn: false, frugalMarkers: false })
  );
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error("no fullscreen")); };
});

const frameNow = () => page.evaluate(() => window.__REEF__?.frame ?? 0);
const waitFrames = async (n, timeoutMs = 120000) => {
  const target = (await frameNow()) + n;
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if ((await frameNow()) >= target) return true;
    await sleep(300);
  }
  console.log(`  ⏳ timeout ожидания ${n} кадров`);
  return false;
};
const waitFor = async (fn, timeoutMs, label) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (await page.evaluate(fn)) return true;
    await sleep(300);
  }
  console.log(`  ⏳ timeout: ${label}`);
  return false;
};

// Синтетический гироскоп: таймер в странице шлёт события каждые 50 мс
// (свежесть датчика в мире — 700 мс; события не привязаны к кадрам).
const gyroStart = (alpha, beta) =>
  page.evaluate((a, b) => {
    const w = window;
    if (w.__GYRO__?.timer) clearInterval(w.__GYRO__.timer);
    w.__GYRO__ = { alpha: a, beta: b, gamma: 0, timer: 0 };
    const send = () =>
      window.dispatchEvent(
        new DeviceOrientationEvent("deviceorientation", {
          alpha: w.__GYRO__.alpha,
          beta: w.__GYRO__.beta,
          gamma: w.__GYRO__.gamma,
        })
      );
    send();
    w.__GYRO__.timer = setInterval(send, 50);
  }, alpha, beta);
const gyroSet = (alpha) => page.evaluate((a) => { if (window.__GYRO__) window.__GYRO__.alpha = a; }, alpha);
const gyroPose = () =>
  page.evaluate(() => {
    const g = window.__GYRO__;
    return g ? { alpha: g.alpha, beta: g.beta, gamma: g.gamma } : null;
  });
const gyroSetPose = (pose) =>
  page.evaluate((next) => {
    if (window.__GYRO__) Object.assign(window.__GYRO__, next);
  }, pose);
// Поворот головы малыми ступенями: между ступенями обязаны пройти кадры,
// иначе предохранитель честно сочтёт один большой скачок выбросом.
const gyroSweep = async (patch) => {
  const from = await gyroPose();
  if (!from) throw new Error("синтетический гироскоп не запущен");
  const to = { ...from, ...patch };
  const maxDelta = Math.max(
    Math.abs(to.alpha - from.alpha),
    Math.abs(to.beta - from.beta),
    Math.abs(to.gamma - from.gamma)
  );
  const steps = Math.max(1, Math.ceil(maxDelta / 10));
  for (let i = 1; i <= steps; i++) {
    const k = i / steps;
    await gyroSetPose({
      alpha: from.alpha + (to.alpha - from.alpha) * k,
      beta: from.beta + (to.beta - from.beta) * k,
      gamma: from.gamma + (to.gamma - from.gamma) * k,
    });
    await waitFrames(2);
  }
};
const gyroStop = () =>
  page.evaluate(() => {
    if (window.__GYRO__?.timer) clearInterval(window.__GYRO__.timer);
  });
const fusionState = () => page.evaluate(() => window.__REEF__?.getFusionState?.() ?? null);
const gapState = () =>
  page.evaluate(() => {
    const f = window.__REEF__?.getFusionState?.();
    const g = window.__REEF__?.provider?.getGaze?.();
    return f && g ? { fused: f.yaw, sample: g.yaw, status: f.status, sampleStatus: g.status } : null;
  });

try {
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 180000 });
  check("мир поднялся (__REEF__)", await waitFor(() => !!window.__REEF__, 60000, "__REEF__"));
  await waitFrames(5);

  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => (b.textContent || "").includes("Начать погружение"))?.click();
  });
  await waitFrames(5);
  check("погружение интерактивно", await page.evaluate(() => window.__REEF__?.settings?.interactive === true));

  console.log("1) Мастерская: карточка «Гибрид» существует и выбирается");
  await page.evaluate(() => {
    [...document.querySelectorAll("[title]")].find((e) => (e.title || "").includes("VR-драйвер"))?.click();
  });
  await waitFor(() => (document.body.textContent || "").includes("Драйвер взгляда"), 15000, "мастерская");
  const cards = await page.evaluate(() => {
    const texts = [...document.querySelectorAll("button")].map((b) => (b.textContent || "").trim());
    return {
      hybrid: texts.some((t) => t.includes("Гибрид")),
      gyro: texts.some((t) => t.startsWith("Гироскоп")),
      camera: texts.some((t) => t.includes("Камера-метки")),
      pointer: texts.some((t) => t.includes("Ручной")),
    };
  });
  check("все 4 источника на месте", cards.hybrid && cards.gyro && cards.camera && cards.pointer, JSON.stringify(cards));
  await page.screenshot({ path: "/home/user/shots/fusion-workshop.png" });
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => (b.textContent || "").includes("Гибрид"))?.click();
  });
  await sleep(500);
  check("source === fusion после клика", await page.evaluate(() => window.__REEF__?.settings?.source === "fusion"));
  await page.evaluate(() => {
    document.querySelector('[aria-label="Закрыть"]')?.click();
  });

  console.log("2) Меток нет: взгляд ведут приращения гироскопа (fusion-gyro)");
  await page.evaluate(() => window.__REEF__?.provider?.stop?.());
  await gyroStart(10, 90);
  await waitFrames(4); // база гироскопа захвачена слиянием
  const s0 = await fusionState();
  check("гироскоп свеж для слияния", s0 && s0.gyroAgeMs !== null && s0.gyroAgeMs < 700, JSON.stringify(s0));
  await gyroSweep({ alpha: 50 }); // +40° малыми ступенями
  await waitFrames(4);
  const s1 = await fusionState();
  const gaze1 = await page.evaluate(() => window.__REEF__?.getGaze?.());
  check("статус fusion-gyro", s1?.status === "fusion-gyro", s1?.status);
  // Синтетический alpha+ — это поворот камеры Three вокруг +Y (влево),
  // поэтому игровой yaw (вправо = плюс) обязан уйти на −40°.
  check("fused yaw ушёл на ~−40° (alpha+ = влево)", Math.abs(s1.yaw - s0.yaw + 40 * DEG) < 3 * DEG, `d=${((s1.yaw - s0.yaw) / DEG).toFixed(1)}°`);
  check("камера сцены следует за слиянием", Math.abs(gaze1.yaw - s1.yaw) < 4 * DEG, `gaze=${(gaze1.yaw / DEG).toFixed(1)}° fused=${(s1.yaw / DEG).toFixed(1)}°`);
  await gyroSweep({ alpha: 30 }); // −20°
  await waitFrames(3);
  const s2 = await fusionState();
  check("обратный поворот alpha −20° даёт игровой yaw +20°", Math.abs(s2.yaw - s1.yaw - 20 * DEG) < 3 * DEG, `d=${((s2.yaw - s1.yaw) / DEG).toFixed(1)}°`);

  await gyroSweep({ beta: 110 });
  await waitFrames(3);
  const sPitch = await fusionState();
  check("кватернионный pitch: beta +20° даёт взгляд вверх +20°", Math.abs(sPitch.pitch - s2.pitch - 20 * DEG) < 4 * DEG, `d=${((sPitch.pitch - s2.pitch) / DEG).toFixed(1)}°`);
  check("pitch без заметного перекрёстного yaw", Math.abs(sPitch.yaw - s2.yaw) < 4 * DEG, `dyaw=${((sPitch.yaw - s2.yaw) / DEG).toFixed(1)}°`);
  await gyroSweep({ beta: 90 });
  await waitFrames(3);

  console.log("2b) Одиночный выброс сырья не телепортирует камеру");
  const sSpike0 = await fusionState();
  await gyroSetPose({ alpha: 30, beta: -70, gamma: 0 }); // разрыв Euler-параметризации: raw yaw уходит на ~180°
  await waitFrames(2);
  const sSpikeDuring = await fusionState();
  check(
    "во время выброса взгляд не двинулся",
    Math.abs(sSpikeDuring.yaw - sSpike0.yaw) < 3 * DEG && Math.abs(sSpikeDuring.pitch - sSpike0.pitch) < 3 * DEG,
    `d=${((sSpikeDuring.yaw - sSpike0.yaw) / DEG).toFixed(1)}°,${((sSpikeDuring.pitch - sSpike0.pitch) / DEG).toFixed(1)}°`
  );
  await gyroSetPose({ alpha: 30, beta: 90, gamma: 0 });
  await waitFrames(4);
  const sSpike1 = await fusionState();
  check(
    "после выброса и возврата взгляд на месте",
    Math.abs(sSpike1.yaw - sSpike0.yaw) < 3 * DEG && Math.abs(sSpike1.pitch - sSpike0.pitch) < 3 * DEG,
    `d=${((sSpike1.yaw - sSpike0.yaw) / DEG).toFixed(1)}°,${((sSpike1.pitch - sSpike0.pitch) / DEG).toFixed(1)}°`
  );
  check("предохранитель зафиксировал выброс", (sSpike1.guards?.gyroJumps ?? 0) >= 1, JSON.stringify(sSpike1.guards));

  console.log("3) Гироскоп умер → ведёт камера (fusion-camera)");
  await gyroStop();
  await page.evaluate(() => {
    window.__REEF__?.provider?.startSynthetic?.();
    window.__REEF__?.provider?.setSyntheticPointer?.(0.5, 0.5);
  });
  const markersReady = await waitFor(
    () => {
      const g = window.__REEF__?.provider?.getGaze?.();
      return g && (g.status === "valid" || g.status === "single" || g.status === "held");
    },
    60000,
    "синтетические метки"
  );
  check("синтетические метки подтверждены", markersReady);
  const calib = await page.evaluate(() => window.__REEF__?.provider?.calibrate?.() ?? null);
  check("калибровка пары ok", !!calib?.ok, calib?.message || "");
  await waitFrames(25); // грейс потери гироскопа + ограниченная скорость перехода на камеру
  const s3 = await fusionState();
  check("статус fusion-camera", s3?.status === "fusion-camera", s3?.status);
  check("взгляд у калибровочного центра", Math.abs(s3.yaw) < 6 * DEG, `yaw=${(s3.yaw / DEG).toFixed(1)}°`);

  console.log("4) Голова неподвижна, метки ушли: центр правится медленно, без скачка");
  await gyroStart(200, 90); // «новая база» после молчания — скачка быть не должно
  await waitFrames(4);
  const s4 = await fusionState();
  check("возврат гироскопа без скачка", Math.abs(s4.yaw - s3.yaw) < 3 * DEG, `d=${((s4.yaw - s3.yaw) / DEG).toFixed(1)}°`);
  check("статус fusion (оба источника живы)", s4?.status === "fusion", s4?.status);
  await page.evaluate(() => window.__REEF__?.provider?.setSyntheticPointer?.(0.72, 0.5));
  // Ждём, пока замер камеры встанет на новое место и станет доказанным.
  await waitFor(
    () => {
      const g = window.__REEF__?.provider?.getGaze?.();
      return g && g.status === "valid" && Math.abs(g.yaw) > 5 * (Math.PI / 180);
    },
    60000,
    "замер ушёл от центра"
  );
  const g0 = await gapState();
  const gap0 = Math.abs(g0.sample - g0.fused);
  check("замер заметно в стороне от взгляда", gap0 > 4 * DEG, `gap=${(gap0 / DEG).toFixed(1)}°`);
  await waitFrames(8);
  const gMid = await gapState();
  const gapMid = Math.abs(gMid.sample - gMid.fused);
  check("за 8 кадров ещё не доехали (не скачок)", gapMid > gap0 * 0.45, `gap=${(gapMid / DEG).toFixed(1)}° из ${(gap0 / DEG).toFixed(1)}°`);
  check("но уже едем к замеру", gapMid < gap0 * 0.98, `gap=${(gapMid / DEG).toFixed(1)}°`);
  await waitFrames(55);
  const g1 = await gapState();
  const gap1 = Math.abs(g1.sample - g1.fused);
  check("за ~63 кадра разрыв закрыт >65%", gap1 < gap0 * 0.35, `gap=${(gap1 / DEG).toFixed(1)}° из ${(gap0 / DEG).toFixed(1)}°`);
  check("статус всё ещё fusion", g1.status === "fusion", g1.status);

  console.log("5) Метки потеряны при живом гироскопе → снова fusion-gyro, взгляд не встал");
  await page.evaluate(() => window.__REEF__?.provider?.stop?.());
  await waitFrames(4);
  const s5 = await fusionState();
  check("статус fusion-gyro", s5?.status === "fusion-gyro", s5?.status);
  await gyroSweep({ alpha: 185 }); // −15° от 200
  await waitFrames(3);
  const s6 = await fusionState();
  check("поворот без меток отработан гироскопом", Math.abs(s6.yaw - s5.yaw - 15 * DEG) < 3 * DEG, `d=${((s6.yaw - s5.yaw) / DEG).toFixed(1)}°`);

  console.log("6) Регрессия: чистые режимы не пострадали");
  await page.evaluate(() => window.__REEF__?.setSource?.("gyro"));
  await waitFrames(4); // база чистого гиро-режима = текущий alpha (185)
  await gyroSet(210); // +25°
  await waitFrames(12);
  const gazeGyro = await page.evaluate(() => window.__REEF__?.getGaze?.());
  check("чистый gyro: alpha +25° даёт игровой взгляд −25° от базы", Math.abs(gazeGyro.yaw + 25 * DEG) < 6 * DEG, `yaw=${(gazeGyro.yaw / DEG).toFixed(1)}°`);
  await page.evaluate(() => window.__REEF__?.setSource?.("pointer"));
  await waitFrames(2);
  check("pointer выбирается без ошибок", await page.evaluate(() => window.__REEF__?.settings?.source === "pointer"));

  check("нет pageerror за весь прогон", errors.length === 0, errors.join(" | "));
} finally {
  await browser.close();
}

console.log(`\nИтог: ${passed} ✅ / ${failed} ❌`);
process.exit(failed ? 1 : 0);
