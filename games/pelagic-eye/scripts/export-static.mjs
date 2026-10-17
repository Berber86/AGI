import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const destination = resolve(root, "play/index.html");
let html = await readFile(resolve(dist, "index.html"), "utf8");

function localAssetPath(url) {
  if (!url || /^(?:[a-z]+:|\/\/)/i.test(url)) {
    throw new Error(`Expected a local build asset, received: ${url}`);
  }
  const path = resolve(dist, decodeURIComponent(url.split(/[?#]/, 1)[0]).replace(/^\.\//, ""));
  const pathFromDist = relative(dist, path);
  if (!pathFromDist || pathFromDist.startsWith("..") || isAbsolute(pathFromDist)) {
    throw new Error(`Build asset escapes dist/: ${url}`);
  }
  return path;
}

const scriptTags = [...html.matchAll(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>[\s\S]*?<\/script>/gi)];
if (scriptTags.length !== 1) {
  throw new Error(`Expected exactly one generated JavaScript entry, found ${scriptTags.length}.`);
}
const scriptTag = scriptTags[0][0];
const scriptUrl = scriptTag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
if (!scriptUrl || !/\btype=["']module["']/i.test(scriptTag)) {
  throw new Error("The generated JavaScript entry is missing or is not an ES module.");
}
const javascript = (await readFile(localAssetPath(scriptUrl), "utf8")).replace(/<\/script/gi, "\\x3C/script");
html = html.replace(scriptTag, () => `<script type="module">${javascript}</script>`);

const modulePreloads = [...html.matchAll(/<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*>/gi)];
for (const [tag] of modulePreloads) html = html.replace(tag, "");

const stylesheetTags = [...html.matchAll(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi)];
for (const [tag] of stylesheetTags) {
  const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
  if (!href) throw new Error("Generated stylesheet link is missing its href.");
  const css = await readFile(localAssetPath(href), "utf8");
  html = html.replace(tag, () => `<style>${css}</style>`);
}

if (/<script\b[^>]*\bsrc=/i.test(html) || /<link\b[^>]*\b(?:href|rel)=["'](?:\.\/)?assets\//i.test(html)) {
  throw new Error("Production HTML still references separate build assets.");
}
if (/<(?:script|link|img|source)\b[^>]*\b(?:src|href)=["']https?:\/\//i.test(html) || /@import\s+url\(["']?https?:\/\//i.test(html)) {
  throw new Error("Production HTML still has an external network dependency.");
}
if (!/<script\s+type="module"[^>]*>[\s\S]*?<\/script>/.test(html) || !/<style>[\s\S]*?<\/style>/.test(html)) {
  throw new Error("Single-file export is missing its inline game module or stylesheet.");
}

await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Published self-contained game page: ${destination}`);
