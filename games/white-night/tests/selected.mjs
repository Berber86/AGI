// Small reproducible art check; assertions + one frame per requested find.
import {launch} from './browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const tag=process.env.TAG||'v7-selected',folder=`../../.studio/evidence/screenshots/visual-${tag}`;
fs.mkdirSync(folder,{recursive:true});const browser=await launch(),p=await browser.newPage(),errors=[],checks=[];let passed=false;
p.setDefaultTimeout(180000);p.on('pageerror',e=>errors.push(e.message));
try{
 await p.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:1});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__GAME_TEST__);
 for(const id of (process.env.ART_ITEMS||'teacup,perfume').split(',')){
  await p.evaluate(id=>{window.__GAME_TEST__.forceNext(id);for(let i=0;i<3;i++)document.querySelector('#search-button').click();window.__GAME_TEST__.settle();},id);
  const m=await p.evaluate(()=>window.__GAME_TEST__.getMetrics());assert.equal(m.modelDetails.id,id);assert.ok(m.modelDetails.supportPoints.flat().every(Number.isFinite));
  await p.screenshot({path:`${folder}/${id}.webp`,type:'webp',quality:88});checks.push({id,metrics:m});await p.evaluate(()=>document.querySelector('#discard').click());
 }
 assert.deepEqual(errors,[]);passed=true;
}finally{await browser.close();fs.writeFileSync(`../../.studio/evidence/reports/visual-${tag}-selected.json`,JSON.stringify({passed,checks,errors},null,2));}
