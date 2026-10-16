import {launch} from './browser.mjs';
import fs from 'node:fs';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const iteration=process.env.ITERATION||'24';
const series=process.env.SERIES||'v7';
const folder=`../../.studio/evidence/screenshots/visual-${series}-${iteration}`;
fs.mkdirSync(folder,{recursive:true});
const browser=await launch();const errors=[],checks=[],models=[];
let report={passed:false};
try{
 const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);
 const shot=async name=>page.screenshot({path:`${folder}/${name}.webp`,type:'webp',quality:85});
 const find=async id=>{await page.evaluate(id=>window.__GAME_TEST__.forceNext(id),id);for(let i=0;i<3;i++)await page.click('#search-button');await page.evaluate(()=>window.__GAME_TEST__.settle());};
 await shot('search');
 const ids=process.env.ART_ITEMS?process.env.ART_ITEMS.split(','):await page.evaluate(()=>window.__GAME_TEST__.items);
 for(const id of ids){
  await find(id);const m=await page.evaluate(()=>window.__GAME_TEST__.getMetrics());
  const b=m.inspectionBounds,r=b.stage;
  assert.ok(b.left>=r.x-1&&b.right<=r.x+r.width+1&&b.top>=r.y-1&&b.bottom<=r.y+r.height+1,`${id} outside safe stage: ${JSON.stringify(b)}`);
  const layout=await page.evaluate(()=>{
   const info=document.querySelector('.find-info').getBoundingClientRect(),buttons=document.querySelector('.decision-buttons').getBoundingClientRect();
   return {infoBottom:info.bottom,buttonTop:buttons.top};
  });
  assert.ok(layout.infoBottom+8<=layout.buttonTop,`${id}: caption overlaps decision buttons`);
  assert.ok(m.modelDetails.materialBatches<=20);assert.equal(m.modelDetails.supportPoints.length,26);assert.ok(m.modelDetails.supportPoints.flat().every(Number.isFinite));models.push({id,bounds:b,...m.modelDetails});
  await shot(id);
  if(id==='book'){
   const {data,info}=await sharp(`${folder}/book.webp`).extract({left:Math.floor(b.left+(b.right-b.left)*.22),top:Math.floor(b.top+(b.bottom-b.top)*.19),width:Math.floor((b.right-b.left)*.55),height:Math.floor((b.bottom-b.top)*.27)}).raw().toBuffer({resolveWithObject:true});let ink=0;
   for(let p=0;p<data.length;p+=info.channels)if(data[p]>140&&data[p+1]>110&&data[p+2]<180&&data[p]>data[p+2]*1.15)ink++;
   assert.ok(ink>40,`Book title occluded by bent cover: ${ink} gold pixels`);checks.push('Book gold title remains visible after deformation');
  }
  await page.click('#keep');console.log('PASS',id,'safe framing and render');
 }
 if(await page.$eval('#complete-dialog',d=>d.open)){await shot('complete');await page.click('#continue-button');}
 await page.click('#open-collection');await shot('collection');await page.click('[data-close="collection-dialog"]');
 await page.click('#open-settings');await shot('settings');await page.click('[data-close="settings-dialog"]');
 await find('camera');
 for(let i=0;i<5;i++)if(!await page.$eval('#zoom-in',b=>b.disabled))await page.click('#zoom-in');
 assert.equal(await page.$eval('#zoom-in',b=>b.disabled),true);
 await page.click('#zoom-reset');assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getMetrics().zoom),1);
 await page.click('#zoom-out');assert.equal(await page.$eval('#zoom-out',b=>b.disabled),true);
 await page.click('#zoom-reset');await page.click('#discard');checks.push('Zoom endpoints disable controls and reset restores baseline');
 for(const [w,h] of [[360,800],[844,390],[1280,900]]){
  await page.setViewport({width:w,height:h,isMobile:w<900,hasTouch:w<900,deviceScaleFactor:1});
  await page.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);
  await find('teacup');const m=await page.evaluate(()=>window.__GAME_TEST__.getMetrics());const b=m.inspectionBounds,r=b.stage;
  assert.ok(b.left>=r.x-1&&b.right<=r.x+r.width+1&&b.top>=r.y-1&&b.bottom<=r.y+r.height+1,`viewport ${w} framing`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await shot(`teacup-${w}`);await page.click('#discard');checks.push(`${w}x${h}: safe framing, no horizontal overflow`);
 }
 assert.deepEqual(errors,[]);
 report={passed:true,iteration,models,checks,errors,limitations:['SwiftShader, not Android hardware.','Reduced motion; screenshots do not certify animation quality.']};
}catch(e){report={passed:false,iteration,models,checks,errors,error:e.stack};throw e;}
finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${series}-${iteration}.json`,JSON.stringify(report,null,2));await browser.close();}
