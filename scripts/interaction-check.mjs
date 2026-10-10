import { openBrowser } from "./browser.mjs";
import { expect as baseExpect } from "@playwright/test";
const expect = baseExpect.configure({ timeout: 30000 });
import { mkdirSync } from "node:fs";
mkdirSync(".playwright", { recursive: true });
const browser = await openBrowser();
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(60000);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  await page.screenshot({
    path: ".playwright/mobile-refined.png",
    timeout: 60000,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#help-button").click({ force: true });
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#start-exploration")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#close-modal")).toBeFocused();
  await page.keyboard.press("Escape");
  await page.locator("#scan-button").click({ force: true });
  await expect(page.locator("#objective-title")).toHaveText(
    "Собрать осколки прошлого",
  );
  await page.locator("#map-button").click({ force: true });
  await page.locator('[data-site="0"]').click({ force: true });
  await expect(page.locator("#clean-button")).toBeVisible({ timeout: 30000 });
  const box = await page.locator("#clean-button").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(900);
  await page.mouse.up();
  const progress = await page.locator("#clean-percent").textContent();
  expect(parseInt(progress)).toBeGreaterThan(0);
  await page.screenshot({
    path: ".playwright/final-mobile-inspection.png",
    timeout: 60000,
  });
  console.log("PASS: mobile investigation, pointer cleaning, modal focus trap");
  await page.close();
  const fallback = await browser.newPage({
    viewport: { width: 960, height: 640 },
  });
  await fallback.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = function () {
      return null;
    };
  });
  await fallback.goto("http://localhost:5173");
  await expect(fallback.locator("#reload-world")).toBeVisible();
  await expect(fallback.locator("#boot")).toContainText("WebGL 2");
  await fallback.close();
  console.log("PASS: actionable WebGL-unavailable screen");
  const corrupt = await browser.newPage({
    viewport: { width: 390, height: 667 },
  });
  await corrupt.addInitScript(() =>
    localStorage.setItem("palimpsest-expedition-v1", "{broken"),
  );
  await corrupt.goto("http://localhost:5173");
  await expect(corrupt.locator("#objective-title")).toHaveText(
    "Голоса под песком",
  );
  await corrupt.close();
  console.log("PASS: corrupt save recovery");
  if (errors.length) throw new Error(errors.join("\n"));
} finally {
  await browser.close();
}
