import { chromium } from "@playwright/test";
import bundled from "@sparticuz/chromium";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export async function openBrowser() {
  if (process.env.CHROMIUM_PATH)
    return chromium.launch({
      executablePath: process.env.CHROMIUM_PATH,
      headless: true,
      args: ["--no-sandbox"],
    });
  // The npm-distributed headless browser works without a separate browser CDN.
  const libs = join(tmpdir(), "palimpsest-browser");
  mkdirSync(libs, { recursive: true });
  const archive = join(libs, "libs.tar");
  writeFileSync(
    archive,
    brotliDecompressSync(
      readFileSync(
        fileURLToPath(
          new URL(
            "../node_modules/@sparticuz/chromium/bin/al2023.tar.br",
            import.meta.url,
          ),
        ),
      ),
    ),
  );
  execFileSync("tar", ["xf", archive, "-C", libs]);
  return chromium.launch({
    executablePath: await bundled.executablePath(),
    headless: true,
    args: bundled.args.filter((a) => a !== "--single-process"),
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `${join(libs, "lib")}:${process.env.LD_LIBRARY_PATH || ""}`,
    },
  });
}
