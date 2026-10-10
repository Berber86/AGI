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
  await page.goto("http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  const click = (s) => page.locator(s).click({ force: true });
  const diagnostics = () =>
    page.evaluate(async () =>
      (
        await import(
          document.querySelector('script[type="module"][src*="/src/main.js"]')
            .src
        )
      ).getDiagnostics(),
    );
  await page.screenshot({
    path: ".playwright/graphics-high.png",
    timeout: 180000,
  });
  console.log("HIGH", await diagnostics());
  await click("#photo-button");
  await page.screenshot({
    path: ".playwright/graphics-world.png",
    timeout: 180000,
  });
  await page.keyboard.press("Escape");
  const lowMemory = [];
  for (const quality of ["low", "high", "low"]) {
    await click("#settings-button");
    await page.selectOption("#quality", quality);
    await click("#settings-done");
    await page.waitForTimeout(300);
    const d = await diagnostics();
    expect(d.quality).toBe(quality);
    if (quality === "low") lowMemory.push(d.textures);
  }
  expect(lowMemory[1]).toBeLessThanOrEqual(lowMemory[0]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: ".playwright/graphics-mobile.png",
    timeout: 120000,
  });
  await click("#scan-button");
  await expect(page.locator("#objective-title")).toHaveText(
    "Собрать осколки прошлого",
  );
  expect(errors).toEqual([]);
  console.log(
    "PASS: high/photo/mobile frames, quality cycling without retained postprocess textures, resize, scanner, no shader or JS errors",
  );
} finally {
  await browser.close();
}
