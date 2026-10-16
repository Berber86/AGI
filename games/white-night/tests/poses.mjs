import {inspectionRect,ZOOM} from '../src/presentation.js';
import {launch} from './browser.mjs';import fs from 'node:fs';import assert from 'node:assert/strict';
const tag=process.env.TAG||'v7-poses';const dir=`../../.studio/evidence/screenshots/visual-${tag}`;fs.mkdirSync(dir,{recursive:true});
const browser=await launch(),errors=[],checks=[],frames=[];let passed=false;
try{
 const p=await browser.newPage();p.setDefaultTimeout(120000);p.setDefaultNavigationTimeout(120000);
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:1});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__READY__);
 await p.click('#open-settings');await p.click('#low-quality');await p.click('[data-close="settings-dialog"]');
 const ids=await p.evaluate(()=>window.__GAME_TEST__.items);
 for(const [w,h] of [[412,915],[844,390]]){
  await p.setViewport({width:w,height:h,isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const expected=inspectionRect(w,h);await p.waitForFunction(bottom=>parseFloat(document.querySelector('#app').style.getPropertyValue('--stage-bottom'))===bottom,{},expected.y+expected.height);
  for(const id of ids){
   await p.evaluate(id=>{window.__GAME_TEST__.forceNext(id);for(let i=0;i<3;i++)document.querySelector('#search-button').click();window.__GAME_TEST__.settle();},id);
   const before=await p.evaluate(()=>window.__GAME_TEST__.getMetrics());
   for(const pose of ['front','back','top','bottom','side']){
    await p.evaluate(pose=>{if(pose==='side')window.__GAME_TEST__.setPose(pose);else {if(document.querySelector('#find-views').hidden)document.querySelector('#toggle-views').click();document.querySelector(`[data-pose="${pose}"]`).click();}window.__GAME_TEST__.settle();},pose);
    const m=await p.evaluate(()=>window.__GAME_TEST__.getMetrics()),b=m.inspectionBounds,s=b.stage;
    assert.equal(m.pose,pose);assert.ok([b.left,b.right,b.top,b.bottom].every(Number.isFinite));
    assert.ok(b.left>=s.x-1&&b.right<=s.x+s.width+1&&b.top>=s.y-1&&b.bottom<=s.y+s.height+1,JSON.stringify({id,pose,w,b}));
    assert.equal(m.geometries,before.geometries);assert.equal(m.textures,before.textures);frames.push({id,pose,w,h});
    if(w===412&&['teacup','bottle','can','box','perfume'].includes(id)&&['top','bottom','back'].includes(pose))await p.screenshot({path:`${dir}/${id}-${pose}.webp`,type:'webp',quality:87});
   }
   await p.evaluate(()=>{document.querySelector('#zoom-out').click();window.__GAME_TEST__.settle();});assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().zoom),.85);
   await p.evaluate(()=>{for(let i=0;i<5;i++)document.querySelector('#zoom-in').click();window.__GAME_TEST__.settle();});assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().zoom),ZOOM.max);
   await p.click('#zoom-reset');await p.click('#discard');
  }
 }
 checks.push('180 baseline poses: all 18 at front/back/top/bottom/side on portrait and landscape; no GPU growth while changing poses');
 await p.evaluate(()=>{window.__GAME_TEST__.forceNext('teacup');for(let i=0;i<3;i++)document.querySelector('#search-button').click();window.__GAME_TEST__.settle();});
 await p.click('#toggle-views');await p.focus('[data-pose="top"]');await p.keyboard.press('Space');await p.evaluate(()=>window.__GAME_TEST__.settle());assert.equal(await p.$eval('[data-pose="top"]',e=>e.getAttribute('aria-pressed')),'true');
 await p.click('#toggle-views');await p.tap('[data-pose="bottom"]');await p.evaluate(()=>window.__GAME_TEST__.settle());assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().pose),'bottom');
 const session=await p.createCDPSession();await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:170}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:235,y:185}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().pose),'free');
 await p.click('#toggle-views');await p.tap('[data-pose="front"]');await p.evaluate(()=>window.__GAME_TEST__.settle());assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getMetrics().pose),'front');checks.push('Keyboard and touch select views; drag restores free rotation, front restores default');
 assert.deepEqual(errors,[]);passed=true;console.log('PASS 180 poses, zoom endpoints on all items, keyboard/touch/free rotation');
}finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${tag}.json`,JSON.stringify({passed,frames,checks,errors,limitations:['Pose matrix rendered in low quality; final baseline visual suite covers high quality.','Finite presets, not an exhaustive continuous turntable; max zoom is intentional close-up.','Software GPU, no physical Android performance claim.']},null,2));await browser.close();}
