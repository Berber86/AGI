import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS} from '../src/state.js';
import {PRESENTATION,inspectionRect,fitScale,ZOOM} from '../src/presentation.js';

test('Presentation metadata covers the existing save IDs, with finite rotations',()=>{
 assert.deepEqual(Object.keys(PRESENTATION).sort(),ITEMS.map(i=>i.id).sort());
 for(const p of Object.values(PRESENTATION)){assert.equal(p.rotation.length,3);assert.ok(p.rotation.every(Number.isFinite));}
});
test('Inspection stage leaves room for controls at mobile, desktop and landscape sizes',()=>{
 for(const [w,h] of [[360,800],[412,915],[1280,900],[844,390]]){
  const r=inspectionRect(w,h);assert.ok(r.width>0&&r.height>0);assert.ok(r.x>=20&&r.y>=70);assert.ok(r.x+r.width<w&&r.y+r.height<h-50);
 }
});
test('Perspective fit contains wide, tall and deep rotated bounds',()=>{
 for(const [w,h] of [[360,800],[412,915],[1280,900],[844,390]])for(const e of [{x:1.1,y:.4,z:.2},{x:.35,y:1.1,z:.2},{x:1,y:1,z:1}]){
  const r=inspectionRect(w,h),fov=47,d=4.2,s=fitScale(e,r,h,fov,d);
  const px=h/(2*Math.tan(fov*Math.PI/360));
  assert.ok(e.x*s/(d-e.z*s)*px<r.width/2);
  assert.ok(e.y*s/(d-e.z*s)*px<r.height/2);
  assert.ok(s>0&&Number.isFinite(s));
 }
 assert.ok(ZOOM.min<1&&ZOOM.max>1);
});
