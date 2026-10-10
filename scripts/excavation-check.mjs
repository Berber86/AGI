import { openBrowser } from "./browser.mjs";
import { expect as baseExpect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const expect = baseExpect.configure({ timeout: 30000 });
mkdirSync(".playwright", { recursive: true });
const browser = await openBrowser();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1000 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.addInitScript(() => {
    if (!localStorage.getItem("palimpsest-expedition-v1"))
      localStorage.setItem(
        "palimpsest-expedition-v1",
        JSON.stringify({
          scanned: true,
          relics: [{ clean: 0 }, { clean: 0 }, { clean: 0 }],
        }),
      );
  });
  const click = (s) => page.locator(s).click();
  const read = () =>
    page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("palimpsest-expedition-v1")).relics[0],
    );
  await page.goto(process.env.TEST_URL || "http://localhost:5173");
  await page.locator("#boot").waitFor({ state: "hidden" });
  await click("#settings-button");
  await page.selectOption("#quality", "low");
  await click("#settings-done");
  const open = async () => {
    await click("#map-button");
    await click('[data-site="0"]');
    await expect(page.locator("#inspection-viewport canvas")).toBeVisible();
  };
  await open();
  await click("#tool-brush");
  const box = await page.locator("#inspection-viewport canvas").boundingBox();
  const hold = async (x, y, ms) => {
    await page.mouse.move(box.x + box.width * x, box.y + box.height * y);
    await page.mouse.down();
    await page.waitForTimeout(ms);
    await page.mouse.up();
  };
  await hold(0.04, 0.04, 500);
  await expect(page.locator("#clean-percent")).toHaveText("0%");
  await hold(0.5, 0.27, 1800);
  await expect(page.locator("#sector-progress-0")).toHaveText("100%");
  expect((await read()).sectors).toEqual([100, 0, 0]);
  await expect(page.locator(".evidence-row.revealed")).toHaveCount(1);
  await expect(page.locator("#decode-button")).toHaveCount(0);
  await page.screenshot({
    path: ".playwright/excavation-regional.png",
    timeout: 120000,
  });
  console.log(
    "PASS: raycast misses do nothing; brush reveals only upper region, evidence unlocks, decode remains locked",
  );
  // Window deactivation must stop and persist a partially completed stroke.
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.waitForTimeout(250);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  const interrupted = (await read()).sectors;
  expect(interrupted[1]).toBeGreaterThan(0);
  expect(interrupted[1]).toBeLessThan(100);
  await page.waitForTimeout(350);
  expect((await read()).sectors).toEqual(interrupted);
  await page.mouse.up();
  console.log("PASS: interrupted brush stroke stops and saves on window blur");
  await click('[data-sector="1"]');
  await page.locator("#clean-button").focus();
  await page.keyboard.down("Enter");
  await expect(page.locator("#sector-progress-1")).toHaveText("100%");
  await page.keyboard.up("Enter");
  expect((await read()).sectors).toEqual([100, 100, 0]);
  await click("#close-modal");
  await page.reload();
  await page.locator("#boot").waitFor({ state: "hidden" });
  await open();
  await expect(page.locator("#sector-progress-2")).toHaveText("0%");
  await expect(page.locator(".evidence-row.revealed")).toHaveCount(2);
  await click("#close-modal");
  await page.setViewportSize({ width: 390, height: 844 });
  await open();
  await expect(page.locator("#surface-evidence")).not.toHaveAttribute("open");
  await page.screenshot({
    path: ".playwright/excavation-mobile.png",
    timeout: 120000,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  // Only the lab context is lost; expedition and keyboard cleaning stay alive.
  await page.evaluate(() => {
    const canvas = document.querySelector("#inspection-viewport canvas");
    const extension = canvas
      .getContext("webgl2")
      .getExtension("WEBGL_lose_context");
    if (!extension)
      throw new Error("Context loss extension unavailable in test browser");
    window.restoreInspection = () =>
      new Promise((resolve) => {
        canvas.addEventListener("webglcontextrestored", resolve, {
          once: true,
        });
        extension.restoreContext();
      });
    extension.loseContext();
  });
  await expect(page.locator("#inspection-hint")).toContainText(
    "КНОПОЧНАЯ ОЧИСТКА РАБОТАЕТ",
  );
  await expect(page.locator("#inspection-viewport canvas")).toHaveCount(0);
  await expect(page.locator("#inspection-viewport > svg")).toBeVisible();
  await expect(page.locator("#tool-brush")).toBeDisabled();
  await click('[data-sector="2"]');
  await page.locator("#clean-button").focus();
  await page.keyboard.down("Enter");
  await expect(page.locator("#decode-button")).toBeVisible();
  await page.keyboard.up("Enter");
  await expect(page.locator(".evidence-row.revealed")).toHaveCount(3);
  expect((await read()).sectors).toEqual([100, 100, 100]);
  await page.evaluate(() => window.restoreInspection());
  await click("#close-modal");
  await open();
  await expect(page.locator("#inspection-viewport canvas")).toBeVisible();
  expect(errors).toEqual([]);
  console.log(
    "PASS: WebGL context loss falls back safely; cleaning completes; restored context supports reopening",
  );
  console.log(
    "PASS: accessible region selection, save/reload migration, mobile layout, three-region completion, no WebGL/JS errors",
  );
} finally {
  await browser.close();
}
