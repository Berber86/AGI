// Actual controls, not only direct test-bridge pose selection. Software WebGL.
import {launch} from './browser.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tag=process.env.TAG||'v7-24';
const folder=`../../.studio/evidence/screenshots/visual-${tag}`;fs.mkdirSync(folder,{recursive:true});
const b=await launch(),p=await b.newPage(),errors=[],checks=[];let passed=false;
p.setDefaultTimeout(180000);
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const shot=async name=>p.screenshot({path:`${folder}/${name}.webp`,type:'webp',quality:87});
const open=async id=>{await p.evaluate(id=>{window.__GAME_TEST__.forceNext(id);for(let i=0;i<3;i++)document.querySelector('#search-button').click();window.__GAME_TEST__.settle();},id);};
try{
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const [w,h,id] of [[412,915,'teacup'],[360,800,'watch'],[360,640,'record'],[740,360,'cassette'],[844,390,'record']]){
  await p.setViewport({width:w,height:h,isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__GAME_TEST__);
  await p.evaluate(()=>window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items));
  await open(id);assert.equal(await p.$eval('#find-views',e=>e.hidden),true);
  await p.tap('#toggle-views');assert.equal(await p.$eval('#toggle-views',e=>e.getAttribute('aria-expanded')),'true');
  await p.tap('[data-pose="bottom"]');await p.evaluate(()=>window.__GAME_TEST__.settle());
  assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().pose),'bottom');
  assert.equal(await p.$eval('#find-views',e=>e.hidden),true);
  await p.tap('#toggle-views');await p.keyboard.press('Escape');assert.equal(await p.$eval('#find-views',e=>e.hidden),true);assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getState().phase),'inspect');
  await p.tap('#toggle-views');await p.tap('[data-pose="front"]');await p.evaluate(()=>window.__GAME_TEST__.settle());
  const layout=await p.evaluate(()=>{
   const r=sel=>{const e=document.querySelector(sel),r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   return {info:r('.find-info'),buttons:r('.decision-buttons'),toolbar:r('.rotation-hint'),stage:window.__GAME_TEST__.getMetrics().inspectionBounds,targets:['#keep','#discard','#zoom-in','#zoom-out','#toggle-views'].map(r),overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight};
  });
  assert.equal(layout.overflow,false,JSON.stringify(layout));assert.ok(layout.info.bottom+8<=layout.buttons.top);if(w<=650)assert.ok(layout.toolbar.bottom<=layout.stage.top+1);else assert.ok(layout.toolbar.top>=layout.stage.bottom-1);
  if(w<=650)assert.ok(layout.info.top>=layout.stage.bottom-1);else assert.ok(layout.info.left>=layout.stage.right+12);for(const r of layout.targets)assert.ok(r.width>=44&&r.height>=44);
  checks.push({w,h,id,layout});await shot(`inspect-${w}-${h}-${id}`);
  await p.tap('#discard');
 }
 assert.deepEqual(errors,[]);passed=true;console.log('PASS readable inspection at five sizes, actual touch presets, popup Escape, 44px targets, captions and duplicate clearances');
}finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${tag}-experience.json`,JSON.stringify({passed,checks,errors,limitations:['No physical device/cutout/text-zoom claim.']},null,2));await b.close();}
