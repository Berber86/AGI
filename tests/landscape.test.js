import test from "node:test";
import assert from "node:assert/strict";
import { erodedRock, sandTexture } from "../src/landscape.js";

test("eroded geology has indexed smooth normals and deterministic finite vertices", () => {
  const a = erodedRock(5, 17),
    b = erodedRock(5, 17),
    c = erodedRock(5, 18);
  assert.ok(a.index);
  const p = a.attributes.position.array;
  assert.ok(p.every(Number.isFinite));
  assert.ok(a.attributes.normal.array.every(Number.isFinite));
  assert.deepEqual(p, b.attributes.position.array);
  assert.notDeepEqual(p, c.attributes.position.array);
  assert.ok(a.attributes.position.count < a.index.count);
  a.computeBoundingSphere();
  assert.ok(a.boundingSphere.radius < 1.5);
  [a, b, c].forEach((g) => g.dispose());
});
test("sand detail is a local repeatable mipmapped texture with bounded samples", () => {
  const a = sandTexture(),
    b = sandTexture();
  assert.equal(a.image.width, 512);
  assert.equal(a.image.data.length, 512 * 512 * 4);
  assert.deepEqual(a.image.data, b.image.data);
  assert.ok(a.generateMipmaps);
  assert.equal(a.repeat.x, 38);
  a.dispose();
  b.dispose();
});
