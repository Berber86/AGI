// Follow the real catalog link on plain static hosting beneath a Pages-style prefix.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
const root = path.resolve('../..');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json', '.woff2':'font/woff2', '.woff':'font/woff' };
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if (!url.pathname.startsWith('/AGI/')) { res.writeHead(404);return res.end(); }
  let file = path.resolve(root,decodeURIComponent(url.pathname.slice(5)) || 'index.html');
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) {res.writeHead(404);return res.end();}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser; const errors=[],checks=[]; let report;
try {
  browser=await launch();const page=await browser.newPage();
  page.setDefaultNavigationTimeout(120000);page.setDefaultTimeout(120000);
  await page.setViewport({width:1100,height:800,deviceScaleFactor:1});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const url=`http://127.0.0.1:${server.address().port}/AGI/index.html`;
  await page.goto(url,{waitUntil:'networkidle0'});
  // The catalog is a shared landing page: other games were added after this test
  // was written, so only the White Night card is contractual here.
  assert.ok(await page.$$eval('.card',els=>els.length)>=2);
  assert.equal(await page.$eval('[data-game="white-night"] img',el=>el.complete&&el.naturalWidth>0),true);
  await page.screenshot({path:'../../.studio/evidence/screenshots/catalog.png'});
  checks.push('The root catalog and the White Night cover load');
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click('[data-game="white-night"] .play')]);
  assert.ok(page.url().endsWith('/AGI/games/white-night/play/index.html'));
  await page.waitForFunction(()=>window.__READY__===true);
  checks.push('Play link boots real WebGL game on plain static hosting under /AGI/');
  for(let i=0;i<3;i++)await page.click('#search-button');
  await page.waitForFunction(()=>!document.querySelector('.inspection').hidden&&!document.querySelector('#keep').disabled);
  assert.equal(await page.$eval('#find-name',el=>el.textContent),'Смена-8М');
  await page.click('#keep');
  await page.reload({waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__READY__===true);
  assert.match(await page.$eval('#header-count',el=>el.textContent),/01/);
  checks.push('Three-tap search, keep and saved collection work through catalog entry');
  assert.deepEqual(errors,[]);checks.push('No browser or HTTP errors');
  report={passed:true,checks,errors};console.log(checks.join('\n'));
} catch(error) {report={passed:false,checks,errors,error:error.stack};throw error;}
finally {
  fs.writeFileSync('../../.studio/evidence/reports/catalog.json',JSON.stringify(report,null,2)+'\n');
  if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
}
