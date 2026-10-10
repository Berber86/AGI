import { openBrowser } from "./browser.mjs";
import { expect as baseExpect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const expect = baseExpect.configure({ timeout: 30000 });
const browser = await openBrowser();
mkdirSync(".playwright", { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "palimpsest-expedition-v1",
      JSON.stringify({
        scanned: true,
        relics: [{ clean: 45 }, { clean: 100 }, { clean: 100 }],
      }),
    ),
  );
  await page.goto(process.env.TEST_URL || "http://localhost:5173");
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
  await click("#settings-button");
  await page.selectOption("#quality", "low");
  await click("#settings-done");
  let maxGeometries = 0;
  for (let i = 0; i < 6; i++) {
    await click("#map-button");
    await click(`[data-site="${i % 3}"]`);
    const canvas = page.locator("#inspection-viewport canvas");
    await expect(canvas).toBeVisible();
    const before = (await diagnostics()).inspection;
    const bounds = await canvas.boundingBox();
    await page.mouse.move(
      bounds.x + bounds.width * 0.4,
      bounds.y + bounds.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(
      bounds.x + bounds.width * 0.65,
      bounds.y + bounds.height * 0.55,
      { steps: 6 },
    );
    await page.mouse.up();
    expect((await diagnostics()).inspection.camera).not.toEqual(before.camera);
    await click("#inspection-reset");
    maxGeometries = Math.max(maxGeometries, before.geometries);
    await canvas.focus();
    await page.keyboard.press("ArrowRight");
    const after = (await diagnostics()).inspection;
    expect(after.rotation[1]).not.toBe(before.rotation[1]);
    await page.keyboard.press("+");
    expect((await diagnostics()).inspection.camera).not.toEqual(before.camera);
    await click("#inspection-reset");
    expect((await diagnostics()).inspection.rotation).toEqual(before.rotation);
    if (i < 3)
      await page.screenshot({
        path: `.playwright/lab-${i}.png`,
        timeout: 120000,
      });
    await click("#close-modal");
    expect((await diagnostics()).inspection).toBeNull();
  }
  expect(maxGeometries).toBeLessThanOrEqual(4);
  console.log(
    "PASS: all 3 specimens, keyboard rotation/zoom/reset, 6 mount/unmount cycles; <=4 resident geometries",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await click("#map-button");
  await click('[data-site="0"]');
  await expect(page.locator("#inspection-viewport canvas")).toBeVisible();
  await page.screenshot({
    path: ".playwright/lab-mobile.png",
    timeout: 120000,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#clean-button").scrollIntoViewIfNeeded();
  await expect(page.locator("#clean-button")).toBeInViewport();
  expect(errors).toEqual([]);
  console.log(
    "PASS: mobile lab fits, cleaning is reachable, no JavaScript errors",
  );
} finally {
  await browser.close();
}
