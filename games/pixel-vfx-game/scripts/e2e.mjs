// End-to-end proof in a real browser: touch input, the full loop, win/lose, restart, record, console
// health, frame budget, and screenshots for the evidence folder. Headless Chromium is provided by the
// Arena toolchain (see the skill's headless-browser-setup reference); if it is missing the run is recorded
// as skipped rather than pretended to pass.
//
//   node scripts/e2e.mjs

import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const EVIDENCE = join(ROOT, ".studio/evidence");
const SHOTS = join(EVIDENCE, "screenshots");
const REPORTS = join(EVIDENCE, "reports");
const PORT = 8898;
const PUPPETEER_ROOT = process.env.PUPPETEER_ROOT ?? "/home/user/tools";
const CHROMIUM = process.env.CHROMIUM_PATH ?? "/tmp/chromium";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

const results = [];
const report = { startedAt: new Date().toISOString(), viewport: null, checks: results, screenshots: [], metrics: null };

const check = (name, passed, detail) => {
  results.push({ name, passed: Boolean(passed), detail: detail === undefined ? "" : String(detail) });
  console.log(`${passed ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

async function loadPuppeteer() {
  const candidates = [
    join(PUPPETEER_ROOT, "node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"),
    join(PUPPETEER_ROOT, "node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"),
    "puppeteer-core",
  ];
  for (const c of candidates) {
    try {
      const mod = await import(c.startsWith("/") ? pathToFileURL(c).href : c);
      return mod.default ?? mod;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

const puppeteer = await loadPuppeteer();
if (!puppeteer || !existsSync(CHROMIUM) || !existsSync(DIST)) {
  report.skipped = true;
  report.reason = !existsSync(DIST)
    ? "dist/ is missing: run npm run build first"
    : "headless Chromium or puppeteer-core is not available in this environment";
  await mkdir(REPORTS, { recursive: true });
  await writeFile(join(REPORTS, "e2e.json"), JSON.stringify(report, null, 2));
  console.log(`skipped: ${report.reason}`);
  process.exit(0);
}

// --- a plain static server, exactly like GitHub Pages: relative paths, no rewriting
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = join(DIST, path);
    if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404).end("not found");
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

await mkdir(SHOTS, { recursive: true });
await mkdir(REPORTS, { recursive: true });

process.env.LD_LIBRARY_PATH = "/tmp/al2023/lib";
process.env.HOME = "/tmp";

const browser = await puppeteer.launch({
  executablePath: CHROMIUM,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-gpu-sandbox",
    "--hide-scrollbars",
    "--mute-audio",
    "--single-process",
    "--no-zygote",
    "--in-process-gpu",
    "--headless",
  ],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
});

const page = await browser.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});

const shot = async (name) => {
  const path = join(SHOTS, `${name}.png`);
  await page.screenshot({ path });
  report.screenshots.push(path.replace(`${ROOT}/`, ""));
  return path;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bridge = (fn, ...args) => page.evaluate(fn, ...args);

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForFunction("window.__GAME_TEST__ && window.__GAME_TEST__.isReady()", { timeout: 60000 });
await sleep(600);
report.viewport = await page.evaluate(() => ({
  buffer: [document.querySelector("canvas")?.width, document.querySelector("canvas")?.height],
  css: (() => {
    const r = document.querySelector("canvas")?.getBoundingClientRect();
    return r ? [Math.round(r.width), Math.round(r.height)] : null;
  })(),
  dpr: devicePixelRatio,
}));

check("boot: bridge ready and title screen shown", (await bridge(() => window.__GAME_TEST__.mode())) === "title");
check("canvas: internal resolution is 320x180", report.viewport.buffer[0] === 320 && report.viewport.buffer[1] === 180, report.viewport.buffer.join("x"));
await shot("01-title-landscape");

// --- a real finger starts the run (no bridge)
await page.touchscreen.tap(422, 195);
await sleep(500);
check("touch: a real tap starts the run", (await bridge(() => window.__GAME_TEST__.mode())) === "play");

// --- a real drag moves the hero: the actual pointer pipeline, not the test bridge
const before = await bridge(() => window.__GAME_TEST__.getState().world);
const cdp = await page.createCDPSession();
const start = { x: 420, y: 230 };
await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...start }] });
for (let i = 1; i <= 6; i++) {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + i * 18, y: start.y - i * 6 }] });
  await sleep(70);
}
await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
await sleep(300);
const after = await bridge(() => window.__GAME_TEST__.getState().world);
const moved = Math.hypot(after.heroX - before.heroX, after.heroY - before.heroY);
check("touch: dragging the finger moves the hero", moved > 4, `${moved.toFixed(1)} px`);

// --- deterministic: the same seed and the same script give the same state
const deterministic = await bridge(() => {
  const t = window.__GAME_TEST__;
  const run = () => {
    t.reset(77);
    for (let i = 0; i < 30; i++) {
      t.moveTo(60 + i, 90);
      t.tick(100);
    }
    return JSON.stringify(t.getState().world);
  };
  return run() === run();
});
check("determinism: identical seed and inputs give identical state", deterministic);

// --- the core loop: pick a find, bank it at the fire, score
await bridge(() => {
  const t = window.__GAME_TEST__;
  t.reset(5);
  const f = t.spawnFind("amber");
  t.moveTo(f.x, f.y);
  t.tick(700);
  t.moveTo(160, 104);
  t.tick(2200);
});
const banked = await bridge(() => window.__GAME_TEST__.getState().world);
check("loop: a find is picked up and banked at the fire for score", banked.score > 0 && banked.banked > 0, `score ${banked.score}, banked ${banked.banked}`);
await shot("02-play-landscape");

// --- the record follows the score into storage when that same run ends
await bridge(() => {
  const t = window.__GAME_TEST__;
  t.setHearts(1);
  for (let i = 0; i < 200 && t.mode() === "play"; i++) t.tick(500);
});
const storedBest = Number((await bridge(() => window.localStorage.getItem("lesnoy-ogon:best:v1"))) ?? -1);
check("record: the best score is written to storage after a scoring run", storedBest >= banked.score && storedBest > 0, `best ${storedBest}`);

// --- a full 60 s session without console errors
await bridge(() => {
  const t = window.__GAME_TEST__;
  t.reset(21);
  for (let i = 0; i < 60; i++) {
    t.setHearts(3);
    t.moveTo(80 + (i % 7) * 20, 60 + (i % 5) * 16);
    if (i % 4 === 0) t.strike();
    t.tick(1000);
  }
});
check("health: a simulated 60 s session logs no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
const nightState = await bridge(() => window.__GAME_TEST__.getState().world);
check("night: the light closes over the session", nightState.lightRadius < 96, `light ${nightState.lightRadius}, night ${nightState.night}`);
await shot("03-night-landscape");

// --- lose path and restart by a real tap
await bridge(() => {
  const t = window.__GAME_TEST__;
  t.reset(31);
  t.setHearts(1);
  for (let i = 0; i < 200 && t.mode() === "play"; i++) t.tick(500);
});
const overState = await bridge(() => window.__GAME_TEST__.getState());
check("lose: at zero hearts the run ends", overState.mode === "over", `hearts ${overState.world.hearts}`);
await shot("04-over-landscape");

await sleep(1000);
await page.touchscreen.tap(422, 195);
await sleep(500);
check("restart: a tap after the end screen starts a new run", (await bridge(() => window.__GAME_TEST__.mode())) === "play");

// --- frame budget from real rendered frames
await sleep(2500);
const metrics = await bridge(() => window.__GAME_TEST__.metrics());
report.metrics = metrics;
check("budget: average frame under 33.33 ms (headless SwiftShader)", metrics.avgMs < 33.33, `${metrics.avgMs.toFixed(2)} ms avg, ${metrics.maxMs.toFixed(2)} ms max`);

// --- portrait: the game is landscape-only, so it must show an accessible orientation prompt
await page.setViewport({ width: 360, height: 800, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await sleep(500);
const portrait = await page.evaluate(() => {
  const el = document.getElementById("rotate");
  const style = el ? getComputedStyle(el) : null;
  return { visible: !!style && style.display !== "none", text: el?.textContent?.trim() ?? "" };
});
check("portrait 360x800: an orientation prompt is shown", portrait.visible && portrait.text.length > 0, portrait.text.replace(/\s+/g, " "));
await shot("05-portrait-360x800");

await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await sleep(400);
await shot("06-portrait-412x915");

await page.setViewport({ width: 915, height: 412, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await sleep(600);
await shot("07-play-915x412");

await browser.close();
server.close();

report.finishedAt = new Date().toISOString();
report.passed = results.every((r) => r.passed);
report.consoleErrors = consoleErrors;
await writeFile(join(REPORTS, "e2e.json"), JSON.stringify(report, null, 2));
console.log(`\n${results.filter((r) => r.passed).length}/${results.length} checks passed`);
process.exit(report.passed ? 0 : 1);
