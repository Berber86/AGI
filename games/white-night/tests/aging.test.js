import {test} from 'node:test';
import assert from 'node:assert/strict';
import {agePoint} from '../src/aging.js';
test('Wear deformations are deterministic, finite and bounded',()=>{
 for(const id of ['box','can','cup','paper'])for(let x=-.6;x<=.6;x+=.2)for(let y=-.7;y<=.7;y+=.2){
  const a=agePoint(id,x,y,.3);assert.deepEqual(a,agePoint(id,x,y,.3));assert.ok(a.every(Number.isFinite));
  assert.ok(Math.hypot(a[0]-x,a[1]-y,a[2]-.3)<.4);
 }
});
test('Localized wear leaves unrelated geometry untouched and produces intended folds/dents',()=>{
 assert.deepEqual(agePoint('camera',.1,.2,.3),[.1,.2,.3]);
 assert.deepEqual(agePoint('book',-.4,-.5,.15),[-.4,-.5,.15]);
 assert.ok(agePoint('box',.5,-.38,.35)[0]<.5);
 const r=.43,a=1.2,p=agePoint('can',r*Math.cos(a),-.05,r*Math.sin(a));assert.ok(Math.hypot(p[0],p[2])<r);
 assert.ok(agePoint('paper',.5,.6,0)[2]>.08);
});
