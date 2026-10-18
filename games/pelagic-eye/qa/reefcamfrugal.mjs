// reefcamfrugal.mjs — A/B-проверка гипотезы «тормоза из-за опроса камеры».
// Руки — одна и та же сцена + QA-подача (та же цепочка createImageBitmap →
// Worker-HSV), разница только в бюджетном режиме ×30:
//   A) обычный каденс: 100мс, анализ 160×120;
//   B) frugal: 3000мс (~30× реже), анализ 64×48 (~9× меньше пикселей).
// Каждая рука — 2 прогона по 12с, счёт реальных тиков воркера + __PERF__.
// Живой переключатель проверяется без перезагрузки через provider.getInfo().
// Запуск: cwd /home/user/tools после bootstrap.sh (сервер :8899).
import { writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const URL = 'http://127.0.0.1:8899/games/pelagic-eye/play/index.html';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});

const click = async (page, t, nth = 0) => {
  const ok = await page.evaluate((t, nth) => {
    const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').trim().includes(t));
    if (!b[nth]) return false;
    b[nth].click();
    return true;
  }, t, nth);
  await new Promise((r) => setTimeout(r, 700));
  return ok;
};

const median = (arr) => {
  const s = [...arr].sort((x, y) => x - y);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};
const mean = (arr) => (arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0);

async function runOnce({ frugalBoot, label }) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
  await page.evaluateOnNewDocument((frugal) => {
    localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false, frugalMarkers: frugal }));
    Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
  }, frugalBoot);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 180000 });
  await new Promise((r) => setTimeout(r, 3500));
  await click(page, 'Начать погружение');
  await new Promise((r) => setTimeout(r, 5000));
  // Драйвер → QA-подача: тот же Worker-путь, детерминированные метки.
  await page.evaluate(() => [...document.querySelectorAll('[title]')].find((e) => (e.title || '').includes('VR-драйвер'))?.click());
  await new Promise((r) => setTimeout(r, 800));
  await click(page, 'QA-подача');
  await new Promise((r) => setTimeout(r, 1500));
  // Счётчик честных тиков воркера (результатов анализа кадров).
  await page.evaluate(() => {
    const worker = window.__REEF__?.provider?.worker;
    window.__TICKS__ = 0;
    if (worker) worker.addEventListener('message', (e) => { if (e.data?.type === 'result') window.__TICKS__ = (window.__TICKS__ || 0) + 1; });
  });

  // Замер по реальной стене (evaluate в headless дорогие): 15с. Состояние
  // трекера читаем живьём из provider.getInfo() (мгновенно), fps сцены — из
  // __PERF__ (сглаженный).
  const t0 = Date.now();
  const samples = [];
  while (Date.now() - t0 < 15000) {
    const p = await page.evaluate(() => {
      const i = window.__REEF__?.provider?.getInfo?.();
      return {
        fps: window.__PERF__?.fps ?? null,
        cameraProcMs: i?.frame?.procMs ?? null,
        cameraIntervalMs: i?.intervalMs ?? null,
        cameraTier: i?.tier ?? null,
        frugal: i?.frugal ?? null,
        feed: i?.feed ?? null,
        running: i?.running ?? null,
      };
    });
    if (p) samples.push(p);
    await new Promise((r) => setTimeout(r, 500));
  }
  const ticks = await page.evaluate(() => window.__TICKS__ || 0);
  const windowSec = (Date.now() - t0) / 1000;
  const procVals = samples.map((s) => s.cameraProcMs).filter((v) => typeof v === 'number' && v > 0);
  return {
    page,
    result: {
      label,
      frugalBoot,
      samples: samples.length,
      windowSec: +windowSec.toFixed(1),
      ticks,
      ticksPerSec: +(ticks / windowSec).toFixed(2),
      fpsMedian: median(samples.map((s) => s.fps).filter((v) => typeof v === 'number')),
      cameraProcMsMean: +mean(procVals).toFixed(2),
      feedLive: samples.filter((s) => s.feed === 'synthetic' && s.running).length,
      cameraIntervalMs: samples.at(-1)?.cameraIntervalMs ?? null,
      cameraTier: samples.at(-1)?.cameraTier ?? null,
      frugalFlag: samples.at(-1)?.frugal ?? null,
      feed: samples.at(-1)?.feed ?? null,
      errors,
    },
  };
}

async function runArmSet(frugalBoot, label) {
  const runs = [];
  for (let i = 0; i < 2; i++) {
    const { page, result } = await runOnce({ frugalBoot, label: `${label}-r${i}` });
    await page.close();
    runs.push(result);
    console.log(`  ${label}-r${i}: fps=${result.fpsMedian} ticks=${result.ticks} (${result.ticksPerSec}/s) procMs=${result.cameraProcMsMean} interval=${result.cameraIntervalMs} tier=${result.cameraTier}`);
  }
  return {
    label,
    frugalBoot,
    runs: runs.map((r) => ({ fpsMedian: r.fpsMedian, ticks: r.ticks, ticksPerSec: r.ticksPerSec, feedLive: r.feedLive, samples: r.samples })),
    fpsMedian: median(runs.map((r) => r.fpsMedian)),
    ticksPerSecMean: +mean(runs.map((r) => r.ticksPerSec)).toFixed(2),
    cameraProcMsMean: +mean(runs.map((r) => r.cameraProcMsMean)).toFixed(1),
    feedLiveRatio: +(mean(runs.map((r) => r.feedLive / Math.max(r.samples, 1)))).toFixed(2),
    cameraIntervalMs: runs[0].cameraIntervalMs,
    cameraTier: runs[0].cameraTier,
    frugalFlag: runs[0].frugalFlag,
    feed: runs[0].feed,
    errors: runs.flatMap((r) => r.errors),
  };
}

const report = { generatedAt: new Date().toISOString(), harness: 'headless chromium + swiftshader; worker и createImageBitmap тут дешевле реального GPU-readback на телефоне', arms: {}, liveToggle: {}, errors: [] };

// ---- Рука A: обычный режим (2 прогона) ----
report.arms.normal = await runArmSet(false, 'normal');
report.errors.push(...report.arms.normal.errors);

// ---- Живой переключатель без перезагрузки (отдельная страница) ----
{
  const { page, result: seed } = await runOnce({ frugalBoot: false, label: 'toggle' });
  report.errors.push(...seed.errors);
  const camInfo = () => page.evaluate(() => {
    const info = window.__REEF__?.provider?.getInfo?.();
    return info ? { intervalMs: info.intervalMs, frugal: info.frugal, tier: info.tier, fps: info.fps } : null;
  });
  const clicked = await click(page, 'Бюджетный опрос');
  await new Promise((r) => setTimeout(r, 800));
  const afterOn = await camInfo();
  await new Promise((r) => setTimeout(r, 8000));
  const afterOnLate = await camInfo();
  await click(page, 'Бюджетный опрос');
  await new Promise((r) => setTimeout(r, 800));
  const afterOff = await camInfo();
  report.liveToggle = {
    clicked,
    afterOn,
    afterOnLate,
    afterOff,
    intervalJumpOk: afterOn?.intervalMs === 3000 && afterOn?.frugal === true && afterOn?.tier === 3,
    intervalRevertOk: (afterOff?.intervalMs === 100 || afterOff?.intervalMs === 135) && afterOff?.frugal === false,
    hzDropOk: (afterOnLate?.fps ?? 99) <= 1.0,
  };
  await page.close();
}

// ---- Рука B: бюджетный режим из настроек (2 прогона) ----
report.arms.frugal = await runArmSet(true, 'frugal');
report.errors.push(...report.arms.frugal.errors);

// ---- Проверки гипотезы ----
const a = report.arms.normal;
const b = report.arms.frugal;
report.assertions = {
  bootNormalInterval: a.cameraIntervalMs === 100 && a.frugalFlag === false,
  bootFrugalInterval: b.cameraIntervalMs === 3000 && b.frugalFlag === true,
  frugalMicroTier: b.cameraTier === 3,
  // ~30× реже по каденсу (100мс → 3000мс):
  intervalRatio: +(b.cameraIntervalMs / a.cameraIntervalMs).toFixed(1),
  intervalRatioOk: b.cameraIntervalMs / a.cameraIntervalMs === 30,
  ticksCapped: b.ticksPerSecMean <= 0.6,
  pipelineLive: a.feedLiveRatio >= 0.8 && b.feedLiveRatio >= 0.8,
  fpsNotWorse: b.fpsMedian >= a.fpsMedian - 1,
  fpsDelta: +(b.fpsMedian - a.fpsMedian).toFixed(1),
  noPageErrors: report.errors.length === 0,
  liveToggleOk: report.liveToggle.intervalJumpOk && report.liveToggle.intervalRevertOk && report.liveToggle.hzDropOk,
};
report.hypothesis = {
  question: 'Тормозит ли риф обращение к камере за метками?',
  cameraLoadDrop: `опрос ${report.assertions.intervalRatio}× реже (${a.cameraIntervalMs}мс → ${b.cameraIntervalMs}мс), анализ ${b.cameraTier === 3 ? '64×48' : b.cameraTier} вместо 160×120`,
  ticks: `норм ${a.ticksPerSecMean} тика/с → фригал ${b.ticksPerSecMean} тика/с`,
  fps: `normal ${a.fpsMedian} fps → frugal ${b.fpsMedian} fps (Δ ${report.assertions.fpsDelta})`,
  procMs: `норм ${a.cameraProcMsMean}мс → фригал ${b.cameraProcMsMean}мс на кадр анализа (в headless это software-readback; на телефоне — GPU-readback)`,
  verdict: report.assertions.fpsDelta > 1
    ? `FPS вырос на ${report.assertions.fpsDelta} при снятом бюджете камеры — сигнал в пользу гипотезы есть; окончательный вердикт — замер FPS в VR на телефоне с тумблером.`
    : report.assertions.fpsDelta >= -1
      ? 'FPS в пределах шума headless-конвейера (тут воркер и так голодает); гипотезу проверять тумблером на телефоне в VR.'
      : 'FPS не улучшился — нужен повтор на живом телефоне.',
};

const outPath = '/home/user/AGI/.studio/evidence/reports/reef-camera-frugal.json';
writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
const fail = Object.entries(report.assertions).filter(([k, v]) => (['fpsDelta', 'intervalRatio'].includes(k) ? false : v !== true));
if (fail.length) {
  console.log('FAILED:', fail.map(([k]) => k).join(', '));
  process.exit(1);
}
console.log('ALL OK →', outPath);
await browser.close();
