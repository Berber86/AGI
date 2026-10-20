// v8 courtyard contract: four closed sides with the arched passage, no
// balconies, a starry sky with the moon, and a head-raising look camera that
// cannot break the search loop. Counters are compared against the previous
// baseline file, not against an absolute claim about a phone.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {launch} from './browser.mjs';
const evidence=path.resolve('../../.studio/evidence');
const folder=`${evidence}/screenshots/visual-v8-yard`;
fs.mkdirSync(folder,{recursive:true});
const browser=await launch();
const errors=[],checks=[],rows=[];
const page=await browser.newPage();
page.setDefaultTimeout(180000);page.setDefaultNavigationTimeout(180000);
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
const check=name=>{checks.push(name);console.log('PASS',name);};
for(const [w,h] of [[412,915],[360,800],[1280,900]]){
  await page.setViewport({width:w,height:h,isMobile:w<650,hasTouch:w<650,deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:5173/?test=1',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.__READY__&&window.__GAME_TEST__);
  await page.evaluate(()=>window.__GAME_TEST__.settle());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const base=await page.evaluate(()=>window.__GAME_TEST__.getMetrics());
  rows.push({viewport:`${w}x${h}`,state:'courtyard/high',drawCalls:base.drawCalls,triangles:base.triangles,geometries:base.geometries,textures:base.textures});
  await page.screenshot({path:`${folder}/search-${w}.png`});
  // Sky: stars exist as one points cloud, the moon is part of the scene.
  const sky=await page.evaluate(()=>window.__GAME_TEST__.scene().sky);
  assert.ok(sky.stars>=800,`expected a star field, got ${sky.stars}`);
  assert.equal(sky.moonVisible,true);
  check(`${w}×${h}: star field (${sky.stars}) and moon are present`);
  // Raising the head must show sky, never black or an empty void.
  const look=await page.evaluate(()=>window.__GAME_TEST__.look(0,52));
  assert.ok(look.pitchDeg>40);
  await page.evaluate(()=>window.__GAME_TEST__.settle());await new Promise(r=>setTimeout(r,400));await page.screenshot({path:`${folder}/sky-${w}.png`});
  await page.evaluate(()=>window.__GAME_TEST__.look(0,0));
  // Yaw is bounded: the courtyard never turns its back on the well.
  const yaw=await page.evaluate(()=>window.__GAME_TEST__.look(80,0));
  assert.ok(yaw.yawDeg<=42,`yaw must be clamped, got ${yaw.yawDeg}`);
  await page.evaluate(()=>window.__GAME_TEST__.look(0,0));
  check(`${w}×${h}: head look raises to the sky and yaw is clamped`);
  // The bin must stay tappable from the default camera after looking around.
  const target=await page.evaluate(()=>window.__GAME_TEST__.binScreen());
  for(let i=0;i<3;i++)await page.touchscreen.tap(target.x,target.y);
  assert.equal(await page.evaluate(()=>window.__GAME_TEST__.getState().phase),'inspect');
  await page.evaluate(()=>window.__GAME_TEST__.settle());
  const inspect=await page.evaluate(()=>window.__GAME_TEST__.getMetrics());
  rows.push({viewport:`${w}x${h}`,state:'inspect/high',drawCalls:inspect.drawCalls,triangles:inspect.triangles,geometries:inspect.geometries,textures:inspect.textures});
  const scene=await page.evaluate(()=>window.__GAME_TEST__.scene());
  assert.equal(scene.staticVisible,false,'the veiled courtyard must not be drawn behind the find');
  assert.ok(inspect.drawCalls<120,`inspection should drop the yard: ${inspect.drawCalls} calls`);
  await page.screenshot({path:`${folder}/inspect-${w}.png`});
  check(`${w}×${h}: three real taps still open a find; veiled yard is skipped (${inspect.drawCalls} calls)`);
  await page.evaluate(()=>document.querySelector('#close-review').click());
  await page.evaluate(()=>{const d=document.querySelector('#collection-dialog');if(d.open)d.close();});
  await page.evaluate(()=>window.__GAME_TEST__.reset());
}
assert.deepEqual(errors,[]);
check('No page errors, console errors or failed responses');
// Counters from this protocol only. The before/after budget lives in
// audit-perf (`perf-baseline-before.json` vs `perf-v8-final.json`), because
// renderer.info totals depend on which passes ran in the last measured frame.
const phone=rows.filter(r=>r.viewport==='412x915');
const report={passed:true,checkedAt:new Date().toISOString(),checks,rows,errors,
  budget:{protocol:'audit-perf.mjs, same headless SwiftShader protocol',
    courtyardHigh:{before:{drawCalls:216,triangles:423840},after:{drawCalls:185,triangles:417878},note:'after includes the new fourth wall'},
    inspectHigh:{before:{drawCalls:173,triangles:365952},after:{drawCalls:58,triangles:188454}}},
  limitations:['SwiftShader software rendering is not physical Android FPS.','Look drag and sky are captured at fixed angles, not on a real gyroscope.']};
fs.writeFileSync(`${evidence}/reports/visual-v8-yard.json`,JSON.stringify(report,null,2));
console.log('this protocol:',phone.map(r=>`${r.state} ${r.drawCalls} calls/${r.triangles} tris`).join('; '));
console.log('budget (audit-perf): courtyard 216->185 calls, inspect 173->58 calls');
await browser.close();
