import {launch} from './browser.mjs';import fs from 'node:fs';import assert from 'node:assert/strict';
const series=process.env.SERIES||'v5',iteration=process.env.ITERATION||'8';
const dir=`../../.studio/evidence/screenshots/visual-${series}-${iteration}`;fs.mkdirSync(dir,{recursive:true});
const browser=await launch(),errors=[],checks=[];let passed=false;
try{
 const p=await browser.newPage();p.setDefaultTimeout(120000);p.setDefaultNavigationTimeout(120000);
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__READY__);
 for(const [w,h] of [[844,390],[740,360],[932,430]]){
  await p.setViewport({width:w,height:h,isMobile:true,hasTouch:true,deviceScaleFactor:1});
  for(const id of ['record','watch','bottle','camera']){
   await p.evaluate(id=>window.__GAME_TEST__.forceNext(id),id);for(let i=0;i<3;i++)await p.tap('#search-button');await p.evaluate(()=>window.__GAME_TEST__.settle());
   const m=await p.evaluate(()=>window.__GAME_TEST__.getMetrics()),b=m.inspectionBounds,s=b.stage;
   assert.ok(b.left>=s.x-1&&b.right<=s.x+s.width+1&&b.top>=s.y-1&&b.bottom<=s.y+s.height+1);
   const r=await p.evaluate(()=>{const rect=sel=>{const r=document.querySelector(sel).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};return {head:rect('.find-header'),info:rect('.find-info'),buttons:rect('.decision-buttons'),overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight};});
   assert.equal(r.overflow,false);assert.ok(r.info.left>=s.x+s.width+12);assert.ok(r.info.bottom+8<=r.buttons.top);assert.ok(r.head.bottom+2<=r.info.top,JSON.stringify({id,w,h,r}));
   if(id==='record'||id==='bottle')await p.screenshot({path:`${dir}/${w}-${id}.webp`,type:'webp',quality:85});
   await p.tap('#discard');checks.push({w,h,id});
  }
 }
 assert.deepEqual(errors,[]);passed=true;console.log('PASS landscape: 12 real touch inspections, panel clearances, framing, no overflow');
}finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${series}-${iteration}-landscape.json`,JSON.stringify({passed,checks,errors,limitations:['Software WebGL, no physical cutout test.']},null,2));await browser.close();}
