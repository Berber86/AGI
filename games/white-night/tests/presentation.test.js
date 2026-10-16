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

test('Safe-area insets reduce the inspection stage rather than hiding controls',()=>{
 const a=inspectionRect(412,915),b=inspectionRect(412,915,44,34);
 assert.equal(b.y,a.y+44);assert.equal(b.height,a.height-78);
});

test('Inspection presets cover all IDs without mutating authored poses',async()=>{
 const {inspectionPose}=await import('../src/presentation.js');
 for(const {id} of ITEMS){for(const pose of ['front','back','top','bottom','side'])assert.ok(inspectionPose(id,pose).every(Number.isFinite));const a=inspectionPose(id,'front');a[0]=999;assert.notEqual(PRESENTATION[id].rotation[0],999);}
 assert.throws(()=>inspectionPose('unknown','front'));assert.throws(()=>inspectionPose('camera','unknown'));
});
test('Landscape stage ends before both view-control rows and right panel',()=>{
 for(const [w,h] of [[740,360],[844,390],[932,430]]){const r=inspectionRect(w,h,24,18),panel=Math.min(360,Math.max(280,w*.34));assert.ok(r.x+r.width<w-panel);assert.ok(r.y+r.height<=h-100);}
});

test('Off-axis fit contains all corners, including deep horizontal watch poses',()=>{
 for(const [w,h] of [[844,390],[740,360],[412,915],[360,800]])for(const e of [{x:.2,y:.3,z:1.1},{x:1.1,y:.2,z:.7},{x:.4,y:1,z:.3}]){
  const r=inspectionRect(w,h),fov=43,d=4.2,p=h/(2*Math.tan(fov*Math.PI/360)),s=fitScale(e,r,h,fov,d,w);
  const ax=(r.x+r.width/2-w/2)*d/p,ay=(h/2-r.y-r.height/2)*d/p;
  for(const x of [-e.x,e.x])for(const y of [-e.y,e.y])for(const z of [-e.z,e.z]){
   const px=w/2+(ax+x*s)/(d-z*s)*p,py=h/2-(ay+y*s)/(d-z*s)*p;
   assert.ok(px>=r.x&&px<=r.x+r.width&&py>=r.y&&py<=r.y+r.height,JSON.stringify({w,h,e,px,py,r}));
  }
 }
});


test('Callout mirrors and stays inside narrow and wide viewports',async()=>{
 const {calloutPosition}=await import('../src/presentation.js');
 for(const width of [360,412,1280])for(const x of [-80,40,width/2,width+90]){
  const p=calloutPosition({x,y:500},{width:172,height:48},{width,height:800});
  assert.ok(p.x>=20&&p.x+172<=width-20);assert.ok(Number.isFinite(p.y));
 }
});
