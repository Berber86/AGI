import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  validateState,
  cleanRelic,
  decodeRelic,
} from "../src/state.js";
import {
  initialBase,
  cargoCount,
  deliverCargo,
  researchSpecimen,
  researchCredits,
  buyUpgrade,
  equipment,
  transmitArchive,
} from "../src/base-state.js";
function find(s, i) {
  s.scanned = true;
  cleanRelic(s, i, 100);
  decodeRelic(s, i, [i], [i]);
}

test("legacy expedition keeps discoveries but doesn't invent delivered cargo or upgrades", () => {
  const s = validateState({
    scanned: true,
    relics: [{ clean: 100, decoded: true }, { clean: 25 }],
  });
  assert.deepEqual(s.base, initialBase());
  assert.equal(cargoCount(s), 1);
  assert.equal(s.relics[1].clean, 25);
  assert.deepEqual(equipment(s), { scanDuration: 4.2, cleaningMultiplier: 1 });
});
test("delivery and research are distinct, idempotent, and cannot fabricate credits", () => {
  const s = initialState();
  assert.equal(deliverCargo(s), 0);
  assert.equal(researchSpecimen(s, 0), false);
  find(s, 0);
  assert.equal(cargoCount(s), 1);
  assert.equal(deliverCargo(s), 1);
  assert.equal(deliverCargo(s), 0);
  assert.equal(researchCredits(s), 0);
  assert.equal(researchSpecimen(s, 0), true);
  assert.equal(researchSpecimen(s, 0), false);
  for (const i of [-1, 3, NaN, 0.5, "0"])
    assert.equal(researchSpecimen(s, i), false);
  assert.equal(researchCredits(s), 1);
  assert.equal(cargoCount(s), 0);
});
test("upgrades consume derived credits exactly once and change actual equipment values", () => {
  const s = initialState();
  assert.equal(buyUpgrade(s, "scanner"), false);
  find(s, 0);
  deliverCargo(s);
  researchSpecimen(s, 0);
  assert.equal(buyUpgrade(s, "unknown"), false);
  assert.equal(buyUpgrade(s, "scanner"), true);
  assert.equal(buyUpgrade(s, "scanner"), false);
  assert.equal(buyUpgrade(s, "brush"), false);
  assert.equal(researchCredits(s), 0);
  assert.equal(equipment(s).scanDuration, 2.4);
  find(s, 1);
  deliverCargo(s);
  researchSpecimen(s, 1);
  assert.equal(buyUpgrade(s, "brush"), true);
  assert.equal(equipment(s).cleaningMultiplier, 1.5);
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))), s);
});
test("corrupt base dependencies and overspent credits are sanitized", () => {
  const s = validateState({
    scanned: true,
    relics: [{ clean: 100, decoded: true }],
    base: {
      deposited: [true, true, true],
      researched: [true, true, true],
      upgrades: ["scanner", "scanner", "brush", "hack"],
      transmitted: true,
      credits: 999,
    },
  });
  assert.deepEqual(s.base.deposited, [true, false, false]);
  assert.deepEqual(s.base.researched, [true, false, false]);
  assert.deepEqual(s.base.upgrades, ["scanner"]);
  assert.equal(researchCredits(s), 0);
  assert.equal(s.base.transmitted, false);
});
test("archive transmission requires all reports, survives reload, and resets fully", () => {
  const s = initialState();
  assert.equal(transmitArchive(s), false);
  for (let i = 0; i < 3; i++) {
    find(s, i);
    deliverCargo(s);
    researchSpecimen(s, i);
  }
  assert.equal(transmitArchive(s), true);
  assert.equal(transmitArchive(s), false);
  assert.equal(validateState(s).base.transmitted, true);
  assert.equal(researchCredits(s), 3);
  assert.deepEqual(initialState().base, initialBase());
  assert.equal(initialState().completed, false);
});
