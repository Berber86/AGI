#!/usr/bin/env node
// shaderwarmup.mjs — регресс «шторма компиляции шейдеров».
//
// История: на Android/ANGLE (Mali-G57) вход в VR дал +36 linkProgram внутри
// первого стерео-кадра (30с фриз: по ~0.8с на линковку). Причина — материалы в
// канвас (VR-путь) и в HalfFloat-таргет composer'а компилируются как РАЗНЫЕ
// программы (tonemapping/output-пермутации), и VR-путь собирал их лениво.
// Лечение (ReefWorld.startWarmup/warmupStep): порционный прогрев обеих
// пермутаций при загрузке (~55мс/кадр). Этот тест держит контракт:
//   + «после загрузки» прогрев уже собрал программы обеих пермутаций;
//   + look-around и вход в VR не линкуют НИЧЕГО нового (≤2 допуск);
//   + в ходе VR-игры линковок нет (≤2 допуск на форс-мажор).
//
// Запуск: node qa/shaderwarmup.mjs [--served] [--headed] [--url URL]

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const SERVE = args.includes("--served");
const HEADLESS = !args.includes("--headed");
const URL_ARG = args.includes("--url") ? args[args.indexOf("--url") + 1] : null;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "..");
const REPO_ROOT = path.resolve(ROOT, "../..");
const EVIDENCE = path.join(REPO_ROOT, ".studio/evidence/reports");

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, "127.0.0.1", () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
    srv.on("error", reject);
  });
}

async function waitForPort(port, ms = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const ok = await new Promise((resolve) => {
      const s = net.connect(port, "127.0.0.1");
      s.once("connect", () => {
        s.destroy();
        resolve(true);
      });
      s.once("error", () => resolve(false));
    });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

function assert(cond, msg) {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${msg}`);
  }
}

const server = SERVE
  ? spawn("node", [path.join(DIR, "static-serve.mjs"), ROOT, "8080"], { stdio: "ignore" })
  : null;

const port = SERVE ? 8080 : await getFreePort();
if (!SERVE) {
  const s = spawn("node", [path.join(DIR, "static-serve.mjs"), ROOT, String(port)], { stdio: "ignore" });
  s.unref();
}
if (!(await waitForPort(port))) {
  console.error(`✗ no static server on :${port} — games/candy-kingdom-coaster/tests/tools/bootstrap.sh`);
  process.exit(2);
}
const url = URL_ARG || `http://127.0.0.1:${port}/play/?perf=1&cam=0&audio=0`;

const { chromium } = await import("playwright-core");

process.env.LD_LIBRARY_PATH = "/tmp/al2023/lib";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/tmp/chromium",
  headless: HEADLESS,
  args: [
    "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
    "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    "--disable-gpu-sandbox", "--hide-scrollbars", "--mute-audio",
    "--single-process", "--no-zygote", "--in-process-gpu",
  ],
});
const ctx = await browser.newContext({ viewport: { width: 1024, height: 640 } });

// Счётчик линковок на уровне прототипа — с самой загрузки страницы.
await ctx.addInitScript(() => {
  const st = { links: 0, linkMs: 0, compiles: 0 };
  window.__SHADER__ = st;
  for (const C of [globalThis.WebGL2RenderingContext, globalThis.WebGLRenderingContext]) {
    if (!C) continue;
    const proto = C.prototype;
    const oLink = proto.linkProgram;
    proto.linkProgram = function (p) {
      const t = performance.now();
      oLink.call(this, p);
      st.links += 1;
      st.linkMs += performance.now() - t;
    };
    const oCompile = proto.compileShader;
    proto.compileShader = function (sh) {
      const t = performance.now();
      oCompile.call(this, sh);
      st.compiles += 1;
    };
  }
});

const page = await ctx.newPage();
const keys = new Set();
page.on("console", (m) => {
  const t = m.text();
  if (t.startsWith("PE-keys") || t.startsWith("VRFREEZE:")) {
    for (const k of t.split(" ").slice(1)) keys.add(k);
    console.log(`  ${t}`);
  }
});
await page.goto(url, { waitUntil: "domcontentloaded" });

const shader = (page) => page.evaluate(() => ({ ...window.__SHADER__ }));

// ── 1. Лобби → погружение → прогрев ───────────────────────────────────────
await page.waitForTimeout(3500);
await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes("Начать погружение"))?.click());
await page.waitForFunction(() => !!window.__REEF__ && !!window.__REEF__.renderer, null, { timeout: 60000 });
// Порционный прогрев (ReefWorld.warmupStep) ставит __PE_WARMUP_DONE__ —
// ждём, пока обе пермутации (канвас + таргет composer'а) собраны.
await page.waitForFunction(() => window.__PE_WARMUP_DONE__ === true, null, { timeout: 180000 }).catch(() => {});
await page.waitForTimeout(4000);

const warmup = await shader(page);
const world = await page.evaluate(() => {
  const w = window.__REEF__;
  return { programs: w.renderer.info.programs?.length ?? 0 };
});
const RES_WARMUP = { afterLoad: { ...warmup, ...world } };
console.log(
  `после загрузки+прогрева: линковок ${warmup.links} (${Math.round(warmup.linkMs)}мс), программ ${world.programs}`
);
assert(warmup.links > 0, `прогрев собрал шейдеры при загрузке: links=${warmup.links}`);
assert(world.programs >= 30, `в кэше обе пермутации: programs=${world.programs} (ожидается много — канвас+composer)`);

// ── 2. look-around: новых линковок быть не должно ──────────────────────────
await page.mouse.move(512, 320);
await page.mouse.down();
for (let i = 0; i < 12; i += 1) {
  await page.mouse.move(200 + i * 52, 200 + i * 32, { steps: 3 });
  await page.waitForTimeout(200);
}
await page.mouse.up();
const look = await shader(page);
const RES_LOOK = { lookAround: look.links - warmup.links };
console.log(`look-around: +${look.links - warmup.links} линковок`);
assert(look.links - warmup.links <= 2, `обзор без компиляций: +${look.links - warmup.links} links (допуск 2)`);

// ── 3. Вход в VR: главный контракт (раньше +36 линковок = 30с фриз) ───────
await page.evaluate(() => window.__REEF__.setVr(true));
await page.waitForTimeout(3500);
const vrEnter = await shader(page);
const vrOn = await page.evaluate(() => window.__REEF__.settings.vr === true);
const RES_ENTER = { vrEnter: vrEnter.links - look.links };
console.log(`вход в VR: +${vrEnter.links - look.links} линковок`);
assert(vrOn, "VR-режим включился");
assert(vrEnter.links - look.links <= 2, `вход в VR БЕЗ шторма компиляций: +${vrEnter.links - look.links} links (допуск 2, было +36)`);

// ── 4. VR-игра: новых линковок быть не должно ─────────────────────────────
for (let i = 0; i < 10; i += 1) {
  await page.mouse.move(200 + i * 60, 180 + i * 26, { steps: 2 });
  await page.waitForTimeout(250);
}
const vrSteady = await shader(page);
const RES_STEADY = { vrSteady: vrSteady.links - vrEnter.links };
console.log(`VR-игра: +${vrSteady.links - vrEnter.links} линковок`);
assert(vrSteady.links - vrEnter.links <= 2, `VR без доcборки шейдеров: +${vrSteady.links - vrEnter.links} links (допуск 2, было +29)`);

// Скриншот артефактом.
mkdirSync(EVIDENCE, { recursive: true });
await page.screenshot({ path: path.join(EVIDENCE, "reef-shaderwarmup.png") }).catch(() => {});

const report = {
  url,
  keys: [...keys].sort(),
  shader: { ...warmup, ...RES_WARMUP.afterLoad, ...RES_LOOK, ...RES_ENTER, ...RES_STEADY },
  note: "Регресс прогрева шейдеров. Контракт: вход в VR не линкует новых программ (≤2).",
  ts: Date.now(),
};
mkdirSync(EVIDENCE, { recursive: true });
writeFileSync(path.join(EVIDENCE, "reef-shaderwarmup.json"), JSON.stringify(report, null, 2));

await browser.close();
if (!SERVE && server) server.kill();
console.log(process.exitCode === 1 ? "✗ SHADERWARMUP FAILED" : "✓ SHADERWARMUP ALL OK");
process.exit(process.exitCode ?? 0);
