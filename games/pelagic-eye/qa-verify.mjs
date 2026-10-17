import { chromium } from "playwright";

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  screenshot: { timeout: 140000 },
});
page.setDefaultTimeout(140000);
await page.addInitScript(() =>
  localStorage.setItem(
    "pelagic-eye.settings.v1",
    JSON.stringify({ ipd: 6.4, quality: "high", reducedMotion: false, soundOn: false })
  )
);
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(8000);
await page.getByRole("button", { name: /Начать погружение|Продолжить погружение/ }).first().click();
await page.waitForTimeout(5000);
await page.getByTitle("VR-драйвер и источник взгляда").click();
await page.waitForTimeout(700);
await page.getByRole("button", { name: "1 метка" }).click();
await page.getByRole("button", { name: "QA-подача" }).click();
await page.waitForTimeout(1400);
await page.getByRole("button", { name: "Смотрю прямо" }).click();
await page.waitForTimeout(800);
const single = await page.evaluate(() => ({
  mode: window.__REEF__.provider.getInfo().markerMode,
  phase: window.__REEF__.provider.getInfo().phase,
  calibration: window.__REEF__.provider.getInfo().calibrated,
}));
await page.getByRole("button", { name: "2 метки" }).click();
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Смотрю прямо" }).click();
await page.getByRole("button", { name: "Войти в VR", exact: true }).nth(1).click();
await page.waitForTimeout(6000);
const vr = await page.evaluate(() => {
  const r = window.__REEF__;
  const info = r.provider.getInfo();
  return {
    shadowPassesPerPair: r.shadowPassesPerPair,
    bloomEnabled: r.bloomPass?.enabled,
    dpr: r.renderer.getPixelRatio(),
    cameraInterval: info.intervalMs,
    cameraTier: info.tier,
    cameraQueue: info.queue,
    markerMode: info.markerMode,
    phase: info.phase,
    perf: window.__PERF__,
  };
});
console.log(JSON.stringify({ single, vr, errors: errors.slice(0, 4) }, null, 1));
await page.screenshot({ path: "qa/verify-vr.png" });
await page.getByRole("button", { name: "Выйти из VR" }).click();
await page.waitForTimeout(2500);
await page.screenshot({ path: "qa/verify-after.png" });
await browser.close();
