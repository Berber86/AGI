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
    JSON.stringify({ ipd: 6.4, quality: "balanced", reducedMotion: true, soundOn: false })
  )
);
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(9000);
await page.screenshot({ path: "qa/art7-lobby.png" });
await page.getByRole("button", { name: /Начать погружение|Продолжить погружение/ }).first().click();
await page.waitForTimeout(7000);
await page.screenshot({ path: "qa/art7-dive.png" });
await page.evaluate(() => window.__REEF__.previewWhale());
await page.waitForTimeout(2000);
await page.screenshot({ path: "qa/art7-whale.png" });
await page.getByTitle("VR-драйвер и источник взгляда").click();
await page.waitForTimeout(800);
await page.getByRole("button", { name: "QA-подача" }).click();
await page.waitForTimeout(1100);
await page.getByRole("button", { name: "Смотрю прямо" }).click();
await page.getByRole("button", { name: "Войти в VR", exact: true }).nth(1).click();
await page.waitForTimeout(5000);
await page.screenshot({ path: "qa/art7-vr.png" });
console.log("ERRORS", JSON.stringify(errors.slice(0, 4)));
await browser.close();
