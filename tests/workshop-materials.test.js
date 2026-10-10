import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  createWorkshopTexture,
  applyWorkshopFinish,
} from "../src/workshop-materials.js";

test("workshop finish is deterministic, mipmapped linear data with packed channels", () => {
  const a = createWorkshopTexture(),
    b = createWorkshopTexture();
  assert.equal(a.image.width, 256);
  assert.equal(a.image.data.length, 256 * 256 * 4);
  assert.deepEqual(a.image.data, b.image.data);
  assert.equal(a.colorSpace, THREE.NoColorSpace);
  assert.equal(a.wrapS, THREE.RepeatWrapping);
  assert.ok(a.generateMipmaps);
  const pixels = a.image.data;
  for (let i = 0; i < pixels.length; i += 4) {
    assert.equal(pixels[i + 3], 255);
    assert.ok(pixels[i + 1] >= 185);
  }
  a.dispose();
  b.dispose();
});
test("metal and floor shaders share a texture but own separate parameter uniforms", () => {
  const texture = createWorkshopTexture(32);
  const materials = [
    new THREE.MeshStandardMaterial(),
    new THREE.MeshStandardMaterial(),
  ];
  const shaders = materials.map((m, i) => {
    applyWorkshopFinish(m, texture, i === 1);
    const shader = {
      uniforms: {},
      vertexShader: THREE.ShaderLib.standard.vertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
    };
    m.onBeforeCompile(shader);
    assert.ok(shader.vertexShader.includes("finishWorld ="));
    assert.ok(shader.fragmentShader.includes("floorContact"));
    assert.ok(shader.fragmentShader.includes("roughnessFactor = clamp"));
    assert.equal(shader.uniforms.workshopMap.value, texture);
    return shader;
  });
  assert.equal(shaders[0].uniforms.workshopFloor.value, 0);
  assert.equal(shaders[1].uniforms.workshopFloor.value, 1);
  materials.forEach((m) => m.dispose());
  texture.dispose();
});
