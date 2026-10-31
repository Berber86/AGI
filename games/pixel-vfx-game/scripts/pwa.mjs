// Release check for the static build: the shell must be there, paths must be relative, and the initial
// payload must stay inside the contract's 6 MB.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = process.argv[2] ?? "dist";
const required = ["index.html", "manifest.webmanifest", "sw.js", "icons/icon-192.png", "icons/icon-512.png"];
let failed = false;

for (const f of required) {
  if (!existsSync(join(dist, f))) {
    console.error(`missing from ${dist}: ${f}`);
    failed = true;
  }
}

const html = existsSync(join(dist, "index.html")) ? readFileSync(join(dist, "index.html"), "utf8") : "";
if (/(src|href)="\/[^/]/.test(html)) {
  console.error("absolute asset path found in index.html: the build must work from a subdirectory");
  failed = true;
}
if (/https?:\/\//.test(html.replace(/<!--[\s\S]*?-->/g, ""))) {
  console.error("external URL found in index.html: the game must not depend on a CDN at runtime");
  failed = true;
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const files = existsSync(dist) ? walk(dist) : [];
const bytes = files.reduce((n, f) => n + statSync(f).size, 0);
const mb = bytes / (1024 * 1024);
if (mb > 6) {
  console.error(`initial assets are ${mb.toFixed(2)} MB, over the 6 MB limit`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`PWA ok: ${files.length} files, ${mb.toFixed(2)} MB, relative paths, no external URLs`);
