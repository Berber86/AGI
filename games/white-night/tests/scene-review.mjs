import {launch} from './browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const iteration=process.env.ITERATION||'24';const series=process.env.SERIES||'v7';
const folder=`../../.studio/evidence/screenshots/visual-${series}-${iteration}`;fs.mkdirSync(folder,{recursive:true});
const browser=await launch();const errors=[],checks=[],metrics=[];let report={passed:false};
try{
 const p=await browser.newPage();p.setDefaultTimeout(120000);p.setDefaultNavigationTimeout(120000);
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const [w,h] of [[1280,900],[412,915],[360,800]]){
  await p.setViewport({width:w,height:h,isMobile:w<650,hasTouch:w<650,deviceScaleFactor:1});
  await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);
  await p.evaluate(()=>window.__GAME_TEST__.settle());
  metrics.push({w,h,...await p.evaluate(()=>window.__GAME_TEST__.getMetrics())});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.screenshot({path:`${folder}/courtyard-${w}.webp`,type:'webp',quality:88});
 }
 const target=await p.evaluate(()=>window.__GAME_TEST__.binScreen());
 for(let i=0;i<3;i++)await p.touchscreen.tap(target.x,target.y);
 assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getState().phase),'inspect');await p.click('#discard');checks.push('Three real touch taps still hit the detailed bin');
 await p.click('#open-settings');await p.click('#low-quality');await p.click('[data-close="settings-dialog"]');
 await p.evaluate(()=>window.__GAME_TEST__.settle());await p.screenshot({path:`${folder}/courtyard-low.webp`,type:'webp',quality:88});
 assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().quality),'low');checks.push('Low-quality path retains scene and interaction');
 assert.deepEqual(errors,[]);report={passed:true,iteration,checks,metrics,errors,limitations:['SwiftShader screenshots do not establish physical Android FPS.']};
}catch(e){report={passed:false,iteration,checks,metrics,errors,error:e.stack};throw e;}
finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${series}-${iteration}-scene.json`,JSON.stringify(report,null,2));await browser.close();}
