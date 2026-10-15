import {test} from 'node:test';
import assert from 'node:assert/strict';
import {RUBBISH,windowTreatment} from '../src/environment.js';
test('Window states repeat deterministically and include all authored treatments',()=>{
 const states=[];for(let f=0;f<3;f++)for(let col=0;col<8;col++)for(let row=0;row<4;row++){
  const s=windowTreatment(col,row,f);assert.equal(s,windowTreatment(col,row,f));states.push(s);
 }
 assert.deepEqual([...new Set(states)].sort(),['blind','curtain','lit','open','reflection']);
});
test('Rubbish clusters break the mirrored composition and remain beside the bin',()=>{
 assert.equal(RUBBISH.length,3);assert.ok(RUBBISH.every(b=>b.scale>0&&Math.abs(b.x)>2));
 assert.notEqual(RUBBISH[0].z,RUBBISH[2].z);assert.notEqual(RUBBISH[0].scale,RUBBISH[2].scale);
});
