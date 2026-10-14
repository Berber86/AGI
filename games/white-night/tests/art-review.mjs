import {launch} from './browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const folder='../../.studio/evidence/screenshots/visual-v2';fs.mkdirSync(folder,{recursive:true});
const browser=await launch();const errors=[],models=[];
try{
 const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);await page.setViewport({width:Number(process.env.ART_WIDTH)||412,height:Number(process.env.ART_HEIGHT)||915,isMobile:!process.env.ART_WIDTH,hasTouch:!process.env.ART_WIDTH,deviceScaleFactor:1});
 page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log('ERROR',m.text());}});page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message);});
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);await page.screenshot({path:`${folder}/${process.env.ART_WIDTH?'courtyard-desktop-final':'courtyard-mobile-final'}.png`});console.log('scene',await page.evaluate(()=>window.__GAME_TEST__.getMetrics()));
 for(const id of (process.env.ART_ITEMS||'camera,watch').split(',').filter(Boolean)){
   await page.evaluate(id=>window.__GAME_TEST__.forceNext(id),id);for(let i=0;i<3;i++)await page.click('#search-button');await page.waitForFunction(()=>window.__GAME_TEST__.getState().phase==='inspect');
   await page.evaluate(()=>window.__GAME_TEST__.settle());await page.screenshot({path:`${folder}/${id}-final.png`});models.push(await page.evaluate(()=>window.__GAME_TEST__.getMetrics()));console.log(id,models.at(-1));await page.click('#discard');
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('../../.studio/evidence/reports/art-v2.json',JSON.stringify({passed:true,errors,models,notes:'Normal-motion high-quality WebGL render; software GPU timing is not Android FPS.'},null,2));
}finally{await browser.close();}
