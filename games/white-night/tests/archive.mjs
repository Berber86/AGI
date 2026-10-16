import {launch} from './browser.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tag=process.env.TAG||'v7-23',folder=`../../.studio/evidence/screenshots/visual-${tag}`;fs.mkdirSync(folder,{recursive:true});
const b=await launch(),p=await b.newPage(),checks=[],errors=[];let passed=false;
p.setDefaultTimeout(180000);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const shot=n=>p.screenshot({path:`${folder}/${n}.webp`,type:'webp',quality:87});
const open=async id=>p.evaluate(id=>{window.__GAME_TEST__.forceNext(id);for(let i=0;i<3;i++)document.querySelector('#search-button').click();window.__GAME_TEST__.settle();},id);
try{
 await p.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:1});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__GAME_TEST__);
 await p.tap('#open-collection');assert.equal(await p.$eval('#archive-empty',e=>e.hidden),false);await shot('archive-empty');
 await p.tap('#find-first');assert.equal(await p.$eval('#collection-dialog',e=>e.open),false);checks.push('0/18 invites first search and returns to search button');
 await open('camera');await p.tap('#keep');assert.equal(await p.$eval('#open-recent',e=>e.hidden),false);assert.equal(await p.$eval('#open-recent',e=>e.dataset.id),'camera');
 await p.tap('#open-recent');assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getState().reviewing),true);assert.equal(await p.$eval('.decision-buttons',e=>e.hidden),true);await p.tap('#close-review');
 assert.equal(await p.$eval('[data-filter="treasures"] span',e=>e.textContent),'1/12');assert.equal(await p.$eval('[data-filter="junk"] span',e=>e.textContent),'0/6');await p.tap('[data-close="collection-dialog"]');
 await open('camera');await p.tap('#keep');assert.equal(await p.evaluate(()=>window.__GAME_TEST__.getState().collection.length),1);checks.push('Recent thumbnail opens read-only review; duplicate does not inflate counts');
 await p.evaluate(()=>window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items));await p.tap('#open-collection');await p.waitForFunction(()=>[...document.querySelectorAll('.item-card img')].every(i=>i.complete));await shot('archive-full');
 for(const [filter,count,text] of [['junk',6,'6/6'],['treasures',12,'12/12'],['all',18,'18/18']]){await p.tap(`[data-filter="${filter}"]`);assert.equal(await p.$$eval('.item-card',a=>a.length),count);assert.equal(await p.$eval(`[data-filter="${filter}"] span`,e=>e.textContent),text);}
 await p.evaluate(()=>document.querySelector('.item-card[data-id="record"]').scrollIntoView({block:'center'}));
 const scroll=await p.$eval('#collection-dialog',d=>d.scrollTop);assert.ok(scroll>100);
 await p.tap('.item-card[data-id="record"]');await p.tap('#close-review');
 await p.waitForFunction(scroll=>Math.abs(document.querySelector('#collection-dialog').scrollTop-scroll)<2,{},scroll);
 assert.equal(await p.evaluate(()=>document.activeElement?.dataset.id),'record');checks.push('Filters show owned/total; archive restores scroll and focused card after review');
 await p.tap('[data-close="collection-dialog"]');await p.evaluate(()=>window.__GAME_TEST__.setCollection(window.__GAME_TEST__.items.slice(0,15)));
 for(const id of ['box','lid','paper']){await open(id);await p.tap('#keep');}
 assert.equal(await p.$eval('#complete-dialog',d=>d.open),true);assert.equal(await p.$$eval('#completion-preview img',a=>a.length),3);await shot('complete');
 await p.tap('#continue-button');await shot('recent-find');checks.push('Natural final three saves form the completion preview');
 assert.deepEqual(errors,[]);passed=true;console.log('PASS empty/full archive, filters, recent/duplicate, scroll/focus return, personal completion');
}finally{await b.close();fs.writeFileSync(`../../.studio/evidence/reports/visual-${tag}-archive.json`,JSON.stringify({passed,checks,errors},null,2));}
