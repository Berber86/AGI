import { cp, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");

// Keep the old standalone UI available as a recovery path. Its scripts and
// styles are intentionally copied unchanged; the current tests still exercise it.
await mkdir(output, { recursive: true });
for (const file of ["legacy.html", "tribes-legacy.html", "campaign.css", "campaign.js", "campaign-map.js", "manifest.webmanifest"]) {
  await copyFile(path.join(root, file), path.join(output, file));
}
for (const directory of ["assets", "images"]) {
  await cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}
