import {launch} from './browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const tag=process.env.TAG||'v7-24-reveal';const folder=`../../.studio/evidence/screenshots/visual-${tag}`;fs.mkdirSync(folder,{recursive:true});
const browser=await launch();const errors=[],checks=[];let passed=false;const check=t=>{checks.push(t);console.log('PASS',t);};
try{
 const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__READY__);
 const shot=async name=>page.screenshot({path:`${folder}/${name}.webp`,type:'webp',quality:85});
 const find=async id=>{await page.evaluate(id=>window.__GAME_TEST__.forceNext(id),id);for(let i=0;i<3;i++)await page.tap('#search-button');};
 const ready=()=>page.waitForFunction(()=>window.__GAME_TEST__.getMetrics().reveal.ready&&!document.querySelector('#keep').disabled);
 await page.evaluate(()=>{window.__phases=[];new MutationObserver(()=>{const p=document.querySelector('#app').dataset.revealPhase;if(window.__phases.at(-1)!==p)window.__phases.push(p);}).observe(document.querySelector('#app'),{attributes:true,attributeFilter:['data-reveal-phase']});});
 await find('camera');await ready();const phases=await page.evaluate(()=>window.__phases);
 assert.deepEqual(phases,['anticipation','silhouette','detail','ready']);check('Natural touch-driven reveal visits all four beats in order');
 // Freeze only the test animation clock; capture actual geometry, not UI mockups.
 for(const [p,name] of [[.1,'anticipation'],[.32,'silhouette'],[.72,'detail'],[1,'ready']]){
  await page.evaluate(p=>window.__GAME_TEST__.seekReveal(p),p);
  assert.equal(await page.$eval('#app',e=>e.dataset.revealPhase),name);
  assert.equal(await page.$eval('#keep',e=>e.disabled),name!=='ready');
  if(p<.5){assert.equal(await page.$eval('.find-info',e=>getComputedStyle(e).visibility),'hidden');await page.$eval('#keep',e=>e.click());assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getState().current),'camera');}
  await shot(name);
 }
 const sample=async name=>{const crop=await sharp(`${folder}/${name}.webp`).extract({left:171,top:360,width:70,height:70}).toBuffer();const stats=await sharp(crop).stats();return stats.channels.slice(0,3).reduce((n,c)=>n+c.mean,0)/3;};
 assert.ok(await sample('silhouette')<await sample('ready')*.65,'Silhouette must actually darken the lens pixels, not merely change UI text');check('Pixel sample verifies a dark silhouette over the real find');
 await page.evaluate(()=>window.__GAME_TEST__.settle());await page.tap('#keep');
 const feedback=await page.evaluate(()=>({tone:document.querySelector('#toast').dataset.tone,pulse:document.querySelector('#header-count').classList.contains('collected'),count:window.__GAME_TEST__.getState().collection.length}));
 assert.deepEqual(feedback,{tone:'kept',pulse:true,count:1});const placement=await page.evaluate(()=>({heroBottom:document.querySelector('.hero').getBoundingClientRect().bottom,toastTop:document.querySelector('#toast').getBoundingClientRect().top}));assert.ok(placement.heroBottom+8<=placement.toastTop,`Kept feedback overlaps portrait hero: ${JSON.stringify(placement)}`);await shot('kept');check('Intermediate frames, disabled premature decisions and unique keep feedback');
 await find('camera');await ready();await page.tap('#keep');assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getState().collection.length),1);assert.equal(await page.$eval('#toast',e=>e.dataset.tone),'duplicate');check('Duplicate feedback does not increment collection');
 await find('can');await ready();await page.tap('#discard');assert.equal(await page.$eval('#toast',e=>e.dataset.tone),'discarded');assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getState().collection.length),1);check('Discard feedback does not collect');
 await page.tap('#open-collection');await page.tap('.item-card[data-id="camera"]');assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getState().reviewing),true);assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getMetrics().reveal.ready),true);await page.tap('#close-review');await page.tap('[data-close="collection-dialog"]');check('Owned review skips reveal delay');
 await find('box');await page.tap('#open-settings');const before=await page.evaluate(()=>window.__GAME_TEST__.getMetrics().reveal.progress);
 await page.evaluate(()=>new Promise(r=>setTimeout(r,400)));assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getMetrics().reveal.progress),before);
 await page.tap('[data-close="settings-dialog"]');await ready();await page.tap('#discard');check('Modal pauses the animation clock and resumes safely');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await find('paper');
 assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getMetrics().reveal.ready),true);assert.equal(await page.$eval('#keep',e=>e.disabled),false);await shot('reduced-motion');await page.tap('#discard');check('Reduced motion shows final geometry and decisions immediately');
 await page.reload({waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__READY__);assert.deepEqual(await page.evaluate(()=>window.__GAME_TEST__.getState().collection),['camera']);
 assert.equal(await page.evaluate(()=>document.querySelectorAll('audio,video').length),0);assert.deepEqual(errors,[]);check('Saved collection survives reload; no audio elements or runtime errors');passed=true;
}finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${tag}.json`,JSON.stringify({passed,checks,errors,limitations:['SwiftShader timings are not hardware timings.','Intermediate frames use a frozen test clock; natural phase order is independently checked.']},null,2));await browser.close();}
