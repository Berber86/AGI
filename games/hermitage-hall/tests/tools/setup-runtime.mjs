// Готовит /tmp/chromium + SwiftShader из npm-пакета @sparticuz/chromium.
// /tmp не переживает сбросы окружения — запускайте перед первым браузерным прогоном.
import zlib from 'zlib';
import fs from 'fs';
import { execSync } from 'child_process';

const base = '/home/user/tools/node_modules/@sparticuz/chromium/bin';
const dec = (src, dst) => fs.writeFileSync(dst, zlib.brotliDecompressSync(fs.readFileSync(src)));

dec(`${base}/chromium.br`, '/tmp/chromium');
fs.chmodSync('/tmp/chromium', 0o755);

for (const [name, out] of [['swiftshader.tar.br', '/tmp/sw'], ['al2023.tar.br', '/tmp/al2023'], ['fonts.tar.br', '/tmp/fonts']]) {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync('/tmp/_x.tar', zlib.brotliDecompressSync(fs.readFileSync(`${base}/${name}`)));
  execSync(`tar -xf /tmp/_x.tar -C ${out}`);
}
execSync('cp -r /tmp/sw/* /tmp/ 2>/dev/null || true');
execSync('mkdir -p /tmp/al2023/lib && cp -r /tmp/al2023/* /tmp/al2023/lib/ 2>/dev/null || true');
execSync('mkdir -p /tmp/.fonts && cp -r /tmp/fonts/* /tmp/.fonts/ 2>/dev/null || true');
console.log('chromium runtime ready');
