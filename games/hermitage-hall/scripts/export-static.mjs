// Публикация статической сборки: обычный статический хостинг без Node и Vite.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'dist');
const target = path.join(root, 'play');
for (const file of ['index.html', 'sw.js', 'manifest.webmanifest']) {
  if (!fs.existsSync(path.join(source, file))) throw new Error(`Build first: missing dist/${file}`);
}
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log('Published static entry: games/hermitage-hall/play/index.html');
