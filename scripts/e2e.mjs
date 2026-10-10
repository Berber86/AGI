import { expect as baseExpect } from "@playwright/test";
const expect = baseExpect.configure({ timeout: 30000 });
import { openBrowser } from "./browser.mjs";
import { mkdirSync } from "node:fs";
const browser = await openBrowser();
const page = await browser.newPage({
  viewport: { width: 960, height: 720 },
  deviceScaleFactor: 0.65,
});
page.setDefaultTimeout(60000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const click = (selector) => page.locator(selector).click({ force: true });
try {
  await page.goto(process.env.TEST_URL || "http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  await click("#settings-button");
  await page.selectOption("#quality", "low");
  await click("#settings-done");
  console.log("PASS: WebGL scene boots; quality setting works");
  await click("#help-button");
  await expect(page.locator("#modal-title")).toContainText("странник");
  await page.keyboard.press("Escape");
  await click("#photo-button");
  await expect(page.locator("#exit-photo")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#exit-photo")).toBeHidden();
  await click("#audio-toggle");
  await expect(page.locator("#audio-toggle")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await click("#audio-toggle");
  console.log("PASS: help, photo mode, escape, and Web Audio toggle");
  const before = await page.locator(".marker-distance").first().textContent();
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(2500);
  await page.keyboard.up("KeyW");
  await expect(page.locator(".marker-distance").first()).not.toHaveText(
    before,
    { timeout: 15000 },
  );
  console.log("PASS: WASD movement works after a toolbar button is focused");
  await click("#scan-button");
  await expect(page.locator("#scan-button")).toBeDisabled();
  await expect(page.locator("#objective-title")).toHaveText(
    "Собрать осколки прошлого",
    { timeout: 30000 },
  );
  console.log("PASS: scanner localizes three relics");
  const solutions = [
    [1, 3, 0],
    [2, 0, 3],
    [3, 1, 2],
  ];
  for (let i = 0; i < 3; i++) {
    await click("#map-button");
    await click(`[data-site="${i}"]`);
    await expect(page.locator("#clean-button")).toBeVisible({ timeout: 45000 });
    if (i === 0) {
      mkdirSync(".playwright", { recursive: true });
      await page.screenshot({
        path: ".playwright/inspection.png",
        timeout: 60000,
      });
    }
    // Keyboard operation tests the same hold-to-clean handler as pointer input.
    await page.locator("#clean-button").focus();
    await page.keyboard.down("Enter");
    await expect(page.locator("#decode-button")).toBeVisible({
      timeout: 20000,
    });
    await page.keyboard.up("Enter");
    await click("#decode-button");
    await expect(page.locator("#decode-feedback")).toContainText(
      "не совпадает",
    );
    for (let j = 0; j < 3; j++)
      for (let n = 0; n < solutions[i][j]; n++)
        await click(`[data-glyph="${j}"]`);
    await click("#decode-button");
    await expect(page.locator(".complete-mark")).toContainText(
      "Память восстановлена",
    );
    await click("#close-modal");
    console.log(
      `PASS: relic ${i + 1}, navigation → clean → reject incorrect code → decode → save`,
    );
  }
  await expect(page.locator("#objective-title")).toHaveText(
    "Память восстановлена",
  );
  await click("#journal-button");
  await expect(page.locator(".journal-entry.found")).toHaveCount(3);
  await expect(page.locator("#modal-content")).toContainText(
    "Мы были. И этого достаточно.",
  );
  await click("#close-modal");
  await page.reload();
  await page.locator("#boot").waitFor({ state: "hidden" });
  await expect(page.locator("#objective-title")).toHaveText(
    "Память восстановлена",
  );
  console.log("PASS: ending and all records survive reload");
  await click("#settings-button");
  await click("#reset-expedition");
  await click("#cancel-reset");
  await expect(page.locator("#modal-title")).toHaveText("Настройки экспедиции");
  await click("#reset-expedition");
  await click("#confirm-reset");
  await expect(page.locator("#objective-title")).toHaveText(
    "Голоса под песком",
  );
  console.log(
    "PASS: reset requires confirmation and creates a clean expedition",
  );
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS: no browser or WebGL errors");
} finally {
  await browser.close();
}
