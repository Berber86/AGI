import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const dir=path.resolve('dist');
function walk(root){return fs.readdirSync(root,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(path.join(root,f.name)):[path.join(root,f.name)]);}
const files=walk(dir).filter(f=>!f.endsWith('sw.js')).map(f=>'./'+path.relative(dir,f).split(path.sep).join('/'));
const hash=crypto.createHash('sha256');for(const file of files)hash.update(fs.readFileSync(path.join(dir,file)));
const version=hash.digest('hex').slice(0,12);
fs.writeFileSync(path.join(dir,'sw.js'),`const CACHE='white-night-${version}';
const FILES=${JSON.stringify(['./',...files])};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('white-night-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;const fallbackDoc=url.pathname.includes('/wrist')?'./wrist/index.html':'./index.html';event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(cached=>cached||fetch(event.request).catch(()=>event.request.mode==='navigate'?caches.match(new URL(fallbackDoc,self.registration.scope)):Response.error())));});
`);
console.log(`Offline cache white-night-${version}: ${files.length} local files`);
