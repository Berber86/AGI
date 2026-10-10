import { openBrowser } from "./browser.mjs";
import { expect as baseExpect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const expect = baseExpect.configure({ timeout: 45000 });
mkdirSync(".playwright", { recursive: true });
const browser = await openBrowser();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(90000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "palimpsest-expedition-v1",
      JSON.stringify({
        scanned: true,
        relics: Array.from({ length: 3 }, () => ({
          clean: 100,
          decoded: true,
        })),
      }),
    ),
  );
  await page.goto("http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  const click = (s) => page.locator(s).click();
  const diagnostics = () =>
    page.evaluate(async () =>
      (
        await import(
          document.querySelector('script[type="module"][src*="/src/main.js"]')
            .src
        )
      ).getDiagnostics(),
    );
  await click("#base-button");
  await expect(page.locator("#scan-button")).toBeHidden();
  await click('[data-station="lab"]');
  await click("#deliver-cargo");
  await click("#close-modal");
  expect((await diagnostics()).displayedSpecimens).toBe(3);
  await page.screenshot({
    path: ".playwright/base-final-high.png",
    timeout: 180000,
  });
  console.log("BASE HIGH", await diagnostics());
  await page.keyboard.press("KeyP");
  await page.screenshot({
    path: ".playwright/base-final-room.png",
    timeout: 180000,
  });
  await page.keyboard.press("Escape");
  await click("#settings-button");
  await page.selectOption("#quality", "low");
  await click("#settings-done");
  const resident = (await diagnostics()).geometries;
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("KeyB");
    expect((await diagnostics()).location).toBe("field");
    await page.keyboard.press("KeyB");
    expect((await diagnostics()).location).toBe("base");
  }
  expect((await diagnostics()).geometries).toBe(resident);
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(5000);
  await page.keyboard.up("KeyW");
  const p = (await diagnostics()).cameraPosition;
  expect(p[2]).toBeGreaterThanOrEqual(-3.1);
  expect(p[2]).toBeLessThan(5.5);
  await page.keyboard.press("KeyE");
  await expect(page.locator("#modal-backdrop")).toBeVisible();
  await page.keyboard.press("Escape");
  for (const [width, height] of [
    [390, 844],
    [390, 667],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.screenshot({
      path: `.playwright/base-final-${width}x${height}.png`,
      timeout: 120000,
    });
    for (const selector of [".base-stations", "#leave-base"]) {
      const box = await page.locator(selector).boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await click("#leave-base");
  await click("#settings-button");
  await click("#reset-expedition");
  await click("#confirm-reset");
  await click("#scan-button");
  await expect(page.locator("#scan-button")).toBeDisabled();
  await page.keyboard.press("KeyB");
  await click("#leave-base");
  await expect(page.locator("#scan-button")).toBeEnabled();
  await page.waitForTimeout(4500);
  await expect(page.locator("#objective-title")).toHaveText(
    "Голоса под песком",
  );
  await click("#base-button");
  expect((await diagnostics()).displayedSpecimens).toBe(0);
  expect(errors).toEqual([]);
  console.log(
    "PASS: high-quality cabin, three physical specimens, photo mode, reused scene, movement boundaries, E, three responsive layouts, scan cancellation and reset",
  );
} finally {
  await browser.close();
}
