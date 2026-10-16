// Cover from the actual shipping scene, not a stale screenshot of another grade.
import {launch} from './browser.mjs';
import sharp from 'sharp';
import fs from 'node:fs';
const folder='../../.studio/evidence/screenshots/visual-v7-24';fs.mkdirSync(folder,{recursive:true});
const b=await launch();
try{
 const p=await b.newPage();p.setDefaultTimeout(180000);
 await p.setViewport({width:1280,height:720,deviceScaleFactor:1});await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await p.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__GAME_TEST__);
 await p.evaluate(()=>window.__GAME_TEST__.settle());
 await p.addStyleTag({content:'.topbar,.hero,.field-note,.bin-tag,.search-controls,.bottom-meta{visibility:hidden!important}'});
 const buffer=await p.screenshot({type:'webp',quality:92});fs.writeFileSync(`${folder}/cover-source.webp`,buffer);
 await sharp(buffer).resize(800,450).webp({quality:88}).toFile('cover.webp');
 console.log('Cover updated from current production scene (800x450), UI microtext removed');
}finally{await b.close();}
