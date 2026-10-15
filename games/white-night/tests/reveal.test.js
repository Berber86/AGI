import {test} from 'node:test';
import assert from 'node:assert/strict';
import {revealFrame,REVEAL_SECONDS} from '../src/reveal.js';
test('Reveal has anticipation, silhouette, detail and ready beats in order',()=>{
 assert.ok(REVEAL_SECONDS>0&&REVEAL_SECONDS<1);
 assert.equal(revealFrame(0).visible,false);
 assert.equal(revealFrame(.1).phase,'anticipation');
 assert.equal(revealFrame(.3).phase,'silhouette');
 assert.equal(revealFrame(.7).phase,'detail');
 assert.equal(revealFrame(1).phase,'ready');
 assert.equal(revealFrame(.3).silhouette,1);
 assert.equal(revealFrame(1).silhouette,0);
 let prev=0;
 for(let p=0;p<=1;p+=.01){const f=revealFrame(p);assert.ok(f.scale>=.94&&f.scale<=1);assert.ok(f.veil>=prev);prev=f.veil;}
});
test('Reduced motion skips every beat; bounds and invalid values are safe',()=>{
 for(const p of [0,.2,.7,1,NaN,Infinity]){const f=revealFrame(p,true);assert.equal(f.ready,true);assert.equal(f.visible,true);assert.equal(f.scale,1);assert.equal(f.silhouette,0);}
 assert.equal(revealFrame(-1).progress,0);assert.equal(revealFrame(2).progress,1);assert.equal(revealFrame(NaN).progress,0);
});
