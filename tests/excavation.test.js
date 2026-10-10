import test from "node:test";
import assert from "node:assert/strict";
import { readSectors, sectorAtHeight } from "../src/excavation.js";
import {
  initialState,
  validateState,
  cleanRelic,
  decodeRelic,
} from "../src/state.js";

test("legacy percentages migrate into three independent regions", () => {
  const s = validateState({
    scanned: true,
    relics: [{ clean: 45 }, { clean: 100, decoded: true }, { clean: 0 }],
  });
  assert.deepEqual(s.relics[0].sectors, [45, 45, 45]);
  assert.equal(s.relics[1].decoded, true);
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))), s);
});
test("regional progress is authoritative and bounded; stale total cannot unlock decode", () => {
  const s = validateState({
    scanned: true,
    relics: [
      { clean: 100, sectors: [100, 0, 0], decoded: true },
      { clean: 100, sectors: [Infinity, -3, 200] },
      { sectors: [] },
    ],
  });
  assert.equal(s.relics[0].clean, 100 / 3);
  assert.equal(s.relics[0].decoded, false);
  assert.deepEqual(s.relics[1].sectors, [0, 0, 100]);
  assert.deepEqual(s.relics[2].sectors, [0, 0, 0]);
  assert.deepEqual(readSectors({ clean: NaN }), [0, 0, 0]);
});
test("targeted cleaning only changes the hit region and decoding requires all three", () => {
  const s = initialState();
  s.scanned = true;
  assert.equal(cleanRelic(s, 0, 100, 0), false);
  assert.deepEqual(s.relics[0].sectors, [100, 0, 0]);
  assert.equal(decodeRelic(s, 0, [1], [1]), false);
  cleanRelic(s, 0, 100, 1);
  assert.equal(cleanRelic(s, 0, 100, 2), true);
  assert.equal(decodeRelic(s, 0, [1], [1]), true);
  assert.equal(cleanRelic(s, 0, 10, 2), false);
});
test("invalid brush inputs have no effect, global accessible tool still completes", () => {
  const s = initialState();
  s.scanned = true;
  const before = JSON.stringify(s);
  for (const sector of [NaN, Infinity, -2, 3, 1.5, "0"])
    assert.equal(cleanRelic(s, 0, 8, sector), false);
  assert.equal(JSON.stringify(s), before);
  cleanRelic(s, 0, 50, 1);
  cleanRelic(s, 0, 25);
  assert.deepEqual(s.relics[0].sectors, [25, 75, 25]);
  assert.equal(cleanRelic(s, 0, 100), true);
});
test("local-space region mapping is clamped and rejects degenerate bounds", () => {
  assert.equal(sectorAtHeight(1, -1, 1), 0);
  assert.equal(sectorAtHeight(0, -1, 1), 1);
  assert.equal(sectorAtHeight(-1, -1, 1), 2);
  assert.equal(sectorAtHeight(9, -1, 1), 0);
  assert.equal(sectorAtHeight(NaN, -1, 1), -1);
  assert.equal(sectorAtHeight(1, 0, 0), -1);
});
