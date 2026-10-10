import { openBrowser } from "./browser.mjs";
import { expect as baseExpect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const expect = baseExpect.configure({ timeout: 45000 });
mkdirSync(".playwright", { recursive: true });
const browser = await openBrowser();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(90000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
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
  const saved = () =>
    page.evaluate(() =>
      JSON.parse(localStorage.getItem("palimpsest-expedition-v1")),
    );
  // A returning player's old save: one archived field discovery, no base schema.
  await page.addInitScript(() => {
    if (!localStorage.getItem("palimpsest-expedition-v1"))
      localStorage.setItem(
        "palimpsest-expedition-v1",
        JSON.stringify({
          scanned: true,
          relics: [{ clean: 100, decoded: true }, { clean: 0 }, { clean: 0 }],
        }),
      );
  });
  await page.goto("http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  await click("#settings-button");
  await page.selectOption("#quality", "low");
  await click("#settings-done");
  await expect(page.locator("#cargo-badge")).toHaveText("1");
  const field = (await diagnostics()).cameraPosition;
  await click("#base-button");
  await expect(page.locator("#base-hud")).toBeVisible();
  expect((await diagnostics()).location).toBe("base");
  await page.screenshot({
    path: ".playwright/base-interior.png",
    timeout: 120000,
  });
  await page.keyboard.down("KeyW");
  try {
    // Wait for an actual movement frame, not a wall-clock delay: SwiftShader
    // may not render even one frame within 800 ms after a screenshot.
    await expect
      .poll(async () => (await diagnostics()).cameraPosition[2])
      .toBeLessThan(5.5);
  } finally {
    await page.keyboard.up("KeyW");
  }
  await click('[data-station="terminal"]');
  await expect(page.locator('[data-upgrade="scanner"]')).toBeDisabled();
  await expect(page.locator("#transmit-archive")).toBeDisabled();
  await click('[data-base-tab="lab"]');
  await click("#deliver-cargo");
  await expect(page.locator("#deliver-cargo")).toBeDisabled();
  await click('[data-research="0"]');
  await expect(page.locator('[data-research="0"]')).toBeDisabled();
  await click('[data-base-tab="terminal"]');
  await expect(page.locator("#research-credits")).toHaveText("1");
  await click('[data-upgrade="scanner"]');
  await expect(page.locator("#research-credits")).toHaveText("0");
  expect((await diagnostics()).equipment.scanDuration).toBe(2.4);
  await click("#close-modal");
  await click("#leave-base");
  expect((await diagnostics()).cameraPosition).toEqual(field);
  await click("#scan-button");
  await expect(page.locator("#scan-button")).toBeEnabled();
  console.log(
    "PASS: old save migration, base navigation, insufficient credit gates, one-time delivery/research, scanner install and field return",
  );
  const codes = [
    [2, 0, 3],
    [3, 1, 2],
  ];
  for (let i = 1; i < 3; i++) {
    await click("#map-button");
    await click(`[data-site="${i}"]`);
    await expect(page.locator("#clean-button")).toBeVisible();
    await page.locator("#clean-button").evaluate((b) => b.click());
    await expect(page.locator("#clean-percent")).toHaveText(
      i === 1 ? "12%" : "18%",
    );
    await page.locator("#clean-button").focus();
    await page.keyboard.down("Enter");
    await expect(page.locator("#decode-button")).toBeVisible();
    await page.keyboard.up("Enter");
    for (let g = 0; g < 3; g++)
      for (let n = 0; n < codes[i - 1][g]; n++)
        await click(`[data-glyph="${g}"]`);
    await click("#decode-button");
    await expect(page.locator(".complete-mark")).toBeVisible();
    await click("#close-modal");
    await click("#base-button");
    await click('[data-station="lab"]');
    await click("#deliver-cargo");
    await click(`[data-research="${i}"]`);
    await click('[data-base-tab="terminal"]');
    if (i === 1) {
      await click('[data-upgrade="brush"]');
      expect((await diagnostics()).equipment.cleaningMultiplier).toBe(1.5);
    } else {
      await page.screenshot({
        path: ".playwright/base-terminal.png",
        timeout: 120000,
      });
      await click("#transmit-archive");
      await expect(page.locator("#transmit-archive")).toBeDisabled();
    }
    await click("#close-modal");
    await click("#leave-base");
  }
  await page.reload();
  await page.locator("#boot").waitFor({ state: "hidden" });
  expect((await saved()).base.transmitted).toBe(true);
  await click("#settings-button");
  await page.selectOption("#quality", "low");
  await click("#settings-done");
  await click("#base-button");
  await page.screenshot({
    path: ".playwright/base-collection-3d.png",
    timeout: 120000,
  });
  await click('[data-station="collection"]');
  await expect(page.locator(".collection-card.filled")).toHaveCount(3);
  await click('[data-specimen="0"]');
  await expect(page.locator("#inspection-viewport canvas")).toBeVisible();
  await click("#close-modal");
  expect((await diagnostics()).location).toBe("base");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: ".playwright/base-mobile.png",
    timeout: 120000,
  });
  await click('[data-station="terminal"]');
  await expect(page.locator("#equipment-readout")).toContainText("2.4");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await click("#close-modal");
  await click("#leave-base");
  await click("#settings-button");
  await click("#reset-expedition");
  await click("#confirm-reset");
  expect((await saved()).base.upgrades).toEqual([]);
  expect((await saved()).base.deposited).toEqual([false, false, false]);
  await click("#base-button");
  await click('[data-station="lab"]');
  await expect(page.locator("#deliver-cargo")).toBeDisabled();
  expect(errors).toEqual([]);
  console.log(
    "PASS: complete field→base loop, actual 1.5× cleaning, three displays, archive transmission, reload, mobile controls, reset; no JS/WebGL errors",
  );
} finally {
  await browser.close();
}
