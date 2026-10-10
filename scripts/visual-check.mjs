import { openBrowser } from "./browser.mjs";
import { expect as baseExpect } from "@playwright/test";
const expect = baseExpect.configure({ timeout: 30000 });
import { mkdirSync } from "node:fs";
mkdirSync(".playwright", { recursive: true });
const browser = await openBrowser();
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(60000);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  await page.screenshot({
    path: ".playwright/final-desktop.png",
    timeout: 120000,
  });
  console.log("PASS: desktop 1440 × 900");
  console.log(
    "RENDER METRICS",
    await page.evaluate(async () =>
      (await import("/src/main.js")).getDiagnostics(),
    ),
  );
  await page.locator("#settings-button").click({ force: true });
  await page.selectOption("#quality", "low");
  await page.locator("#settings-done").click({ force: true });
  for (const [width, height] of [
    [390, 844],
    [390, 667],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `.playwright/final-${width}x${height}.png`,
      timeout: 60000,
    });
    await expect(page.locator("#scan-button")).toBeVisible();
    await expect(page.locator("#settings-button")).toBeVisible();
    const outside = await page
      .locator(".tool-dock,.objective,.topbar")
      .evaluateAll((es) =>
        es
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return (
              r.x < 0 ||
              r.right > innerWidth + 1 ||
              r.y < 0 ||
              r.bottom > innerHeight
            );
          })
          .map((e) => e.className),
      );
    expect(outside).toEqual([]);
    console.log(`PASS: controls and panels fit ${width} × ${height}`);
  }
  await page.close();
  if (errors.length) throw new Error(errors.join("\n"));
} finally {
  await browser.close();
}
