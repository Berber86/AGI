import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createRelicModel, disposeObject } from "../src/relic-model.js";

for (let i = 0; i < 3; i++) {
  test(`relic ${i}: bounded geometry, batched details and complete disposal`, () => {
    const model = createRelicModel(i);
    assert.ok(model.children.length <= 4, "draw-call budget");
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    assert.ok(size.x > 0.3 && size.y > 1 && size.z > 0.1);
    assert.ok(Math.max(size.x, size.y, size.z) < 3);
    const resources = new Set();
    model.traverse((o) => {
      if (o.geometry) {
        resources.add(o.geometry);
        const p = o.geometry.attributes.position.array;
        assert.ok(p.every(Number.isFinite));
      }
      if (o.material) {
        resources.add(o.material);
        Object.values(o.material).forEach((v) => {
          if (v?.isTexture) resources.add(v);
        });
      }
    });
    let disposed = 0;
    resources.forEach((r) => r.addEventListener("dispose", () => disposed++));
    disposeObject(model);
    assert.equal(disposed, resources.size);
  });
}
