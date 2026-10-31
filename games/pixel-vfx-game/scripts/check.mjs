// Static invariants that the tests cannot see: determinism, no runtime network, and the contract's numbers.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

const src = walk("src");
const problems = [];
const read = (f) => readFileSync(f, "utf8");

for (const f of src) {
  const text = read(f);
  // every visual random number must come from the seeded Rng; procedural audio noise is the one exception
  if (!f.endsWith("audio.ts")) {
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (line.includes("Math.random") && !line.trim().startsWith("//")) problems.push(`${f}:${i + 1} uses Math.random`);
      if (/\bnew Date\b|Date\.now/.test(line) && !line.trim().startsWith("//")) problems.push(`${f}:${i + 1} uses the wall clock`);
    });
  }
  if (/https?:\/\//.test(text) && !/^\s*(\/\/|\*)/.test(text.split("\n").find((l) => l.includes("http")) ?? "")) {
    problems.push(`${f}: external URL in source`);
  }
}

const world = read("src/game/world.ts");
for (const [needle, why] of [
  ["w: 320", "internal width must stay 320"],
  ["h: 180", "internal height must stay 180"],
  ["heartsMax: 3", "the contract says three hearts"],
  ["carryMax: 3", "the contract says three carried finds"],
  ["nightSeconds: 240", "the night curve is part of the contract"],
]) {
  if (!world.includes(needle)) problems.push(`world.ts: ${why}`);
}

const pkg = JSON.parse(read("package.json"));
for (const script of ["dev", "build", "preview", "typecheck", "test", "test:e2e", "check", "gate"]) {
  if (!pkg.scripts[script]) problems.push(`package.json: missing script "${script}"`);
}

const total = src.reduce((n, f) => n + statSync(f).size, 0);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check ok: ${src.length} source files, ${(total / 1024).toFixed(0)} KB, deterministic, no external URLs`);
