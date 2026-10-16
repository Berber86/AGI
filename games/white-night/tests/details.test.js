import {test} from 'node:test';
import assert from 'node:assert/strict';
import {watchHands,WATCH_TIME} from '../src/details.js';
import {ITEMS} from '../src/state.js';
test('Watch hands agree with seven-to-twelve story, including the hour fraction',()=>{
 assert.deepEqual(WATCH_TIME,{hour:11,minute:53});assert.ok(ITEMS.find(i=>i.id==='watch').description.includes('без семи двенадцать'));
 const [hour,minute]=watchHands();assert.ok(Math.abs(hour.turn-(11+53/60)/12)<1e-10);assert.equal(minute.turn,53/60);
 for(const h of [hour,minute]){assert.ok(h.x<0&&h.y>0);assert.ok(Math.abs(Math.hypot(h.x,h.y)-h.length/2)<1e-10);}
 const noon=watchHands(12,0);for(const h of noon){assert.equal(h.x,0);assert.equal(h.y,h.length/2);}
});
