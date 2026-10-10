import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  validateState,
  cleanRelic,
  decodeRelic,
  countRelics,
  readSave,
  saveState,
} from "../src/state.js";

test("fresh expedition has three untouched relics", () => {
  const a = initialState(),
    b = initialState();
  assert.equal(a.scanned, false);
  assert.equal(countRelics(a), 0);
  a.relics[0].clean = 50;
  assert.equal(b.relics[0].clean, 0);
});
test("malformed saves safely reset and values are bounded", () => {
  for (const input of [null, [], 7, "bad", {}, { relics: null }])
    assert.deepEqual(validateState(input), initialState());
  const s = validateState({
    scanned: true,
    relics: [
      { clean: Infinity, decoded: true },
      { clean: 150, decoded: true },
      { clean: -10 },
    ],
  });
  assert.equal(s.relics[0].clean, 0);
  assert.equal(s.relics[0].decoded, false);
  assert.equal(s.relics[1].clean, 100);
  assert.equal(s.relics[1].decoded, true);
  assert.equal(s.relics[2].clean, 0);
});
test("cleaning requires scan and valid positive effort", () => {
  const s = initialState();
  assert.equal(cleanRelic(s, 0, 100), false);
  s.scanned = true;
  assert.equal(cleanRelic(s, 4, 100), false);
  assert.equal(cleanRelic(s, 0, NaN), false);
  assert.equal(cleanRelic(s, 0, -4), false);
  assert.equal(cleanRelic(s, 0, 25), false);
  assert.equal(s.relics[0].clean, 25);
  assert.equal(cleanRelic(s, 0, 90), true);
  assert.equal(s.relics[0].clean, 100);
});
test("decode enforces cleanup, sequence, and prevents duplicate collection", () => {
  const s = initialState();
  s.scanned = true;
  const solution = [1, 3, 0];
  assert.equal(decodeRelic(s, 0, solution, solution), false);
  cleanRelic(s, 0, 100);
  assert.equal(decodeRelic(s, 0, [0, 0, 0], solution), false);
  assert.equal(decodeRelic(s, 0, [1, 3], solution), false);
  assert.equal(decodeRelic(s, 0, solution, solution), true);
  assert.equal(decodeRelic(s, 0, solution, solution), false);
  assert.equal(countRelics(s), 1);
  assert.equal(s.completed, false);
});
test("all three histories form the ending and survive serialization", () => {
  const s = initialState();
  s.scanned = true;
  for (let i = 0; i < 3; i++) {
    cleanRelic(s, i, 100);
    decodeRelic(s, i, [i, 0, 2], [i, 0, 2]);
  }
  assert.equal(s.completed, true);
  assert.equal(countRelics(s), 3);
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))), s);
});
test("inconsistent completed flags are recomputed", () => {
  const s = initialState();
  s.completed = true;
  assert.equal(validateState(s).completed, false);
  s.relics[0] = { clean: 100, decoded: true };
  assert.equal(validateState(s).relics[0].decoded, false);
});
test("unavailable storage never crashes the expedition", () => {
  const storage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.deepEqual(readSave(storage), initialState());
  assert.equal(saveState(storage, initialState()), false);
  assert.deepEqual(readSave({ getItem: () => "{invalid" }), initialState());
});

import { resolveMovement } from "../src/navigation.js";
test("navigation slides alongside masonry and respects sector bounds", () => {
  const obstacle = [{ x: 0, z: 0, radius: 2 }];
  assert.deepEqual(resolveMovement({ x: 4, z: 0 }, { x: -2, z: 1 }, obstacle), {
    x: 4,
    z: 1,
  });
  assert.deepEqual(resolveMovement({ x: 89, z: -89 }, { x: 4, z: -4 }, []), {
    x: 90,
    z: -90,
  });
  assert.deepEqual(resolveMovement({ x: 5, z: 5 }, { x: 1, z: 1 }, obstacle), {
    x: 6,
    z: 6,
  });
});
