import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const dist = path.join(root, '..', 'dist'); const out = path.join(root, '..', 'play');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
fs.cpSync(dist, out, { recursive: true });
let bytes = 0; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : (bytes += fs.statSync(p).size); } };
walk(out); console.log(`exported play/ ${bytes} bytes`);
