import {launch} from './browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await launch();const errors=[];let report={passed:false};
const series=process.env.SERIES||'v7',iteration=process.env.ITERATION||'24';
const folder=`../../.studio/evidence/screenshots/visual-${series}-${iteration}`;
try{
 const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);
 await page.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);
 await page.evaluate(()=>window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items));await page.click('#open-collection');
 await page.waitForFunction(()=>[...document.querySelectorAll('.item-card img')].every(i=>i.complete&&i.naturalWidth===160));
 const samples=await page.evaluate(()=>[...document.querySelectorAll('.item-card img')].map(img=>{
  const c=document.createElement('canvas');c.width=c.height=160;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
  const pixels=ctx.getImageData(0,0,160,160).data;let sum=0,sum2=0,n=0;const colors=new Set();
  for(let i=0;i<pixels.length;i+=4){const l=pixels[i]*.299+pixels[i+1]*.587+pixels[i+2]*.114;sum+=l;sum2+=l*l;n++;if(i%7===0)colors.add(`${pixels[i]>>3},${pixels[i+1]>>3},${pixels[i+2]>>3}`);}
  return {id:img.closest('.item-card').dataset.id,corner:[...ctx.getImageData(0,0,1,1).data],sd:Math.sqrt(Math.max(0,sum2/n-(sum/n)**2)),distinct:colors.size};
 }));
 assert.equal(samples.length,18);
 for(const {id,corner:[r,g,b,a],sd,distinct} of samples){assert.ok(sd>=4&&distinct>=12,`${id}: thumbnail contains no rendered find`);assert.ok(r>=12&&g>=20&&b>=30,`${id}: linear bytes were not display-encoded`);assert.equal(a,255);}
 fs.mkdirSync(folder,{recursive:true});await page.screenshot({path:`${folder}/collection.webp`,type:'webp',quality:85});
 await page.click('[data-filter="junk"]');await page.screenshot({path:`${folder}/collection-junk.webp`,type:'webp',quality:85});
 const before=await page.evaluate(()=>window.__GAME_TEST__.getMetrics());
 await page.click('[data-close="collection-dialog"]');await page.click('#open-collection');
 const after=await page.evaluate(()=>window.__GAME_TEST__.getMetrics());
 assert.equal(after.geometries,before.geometries);assert.equal(after.textures,before.textures);
 await page.click('[data-close="collection-dialog"]');
 await page.evaluate(()=>window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items.slice(0,15)));
 for(const id of ['box','lid','paper']){
  await page.evaluate(id=>window.__GAME_TEST__.forceNext(id),id);
  for(let i=0;i<3;i++)await page.click('#search-button');await page.click('#keep');
 }
 assert.equal(await page.$eval('#complete-dialog',d=>d.open),true);
 assert.equal(await page.$$eval('#completion-preview img',a=>a.length),3);
 await page.screenshot({path:`${folder}/complete.webp`,type:'webp',quality:85});await page.click('#continue-button');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.setOfflineMode(true);await page.reload({waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);
 assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getState().collection.length),18);
 await page.click('#open-collection');await page.waitForFunction(()=>[...document.querySelectorAll('.item-card img')].every(i=>i.complete&&i.naturalWidth===160));
 assert.equal(await page.$$eval('.item-card img',a=>a.length),18);await page.setOfflineMode(false);
 assert.deepEqual(errors,[]);
 report={passed:true,samples,errors,checks:['All 18 thumbnails contain rendered finds (sd>=4, distinct>=12) and sRGB/ACES output','Cached re-opening does not grow GPU geometry or texture counts','Completion shows three recent finds','Final production build reloads with all 18 thumbnails offline'],limitations:['Color tests detect missing output transfer, not aesthetic accuracy on physical displays.']};
 console.log('PASS all 18 thumbnails: display encoding and stable cache');
}catch(e){report={...report,errors,error:e.stack};throw e;}
finally{fs.writeFileSync(`../../.studio/evidence/reports/visual-${series}-thumbnails.json`,JSON.stringify(report,null,2));await browser.close();}
