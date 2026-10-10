import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Shared silhouettes: the field object and the laboratory specimen are the same asset.
export function createRelicModel(index) {
  const group = new THREE.Group();
  // Deterministic mineral pitting and machining scratches, without network assets.
  const pixels = new Uint8Array(128 * 128 * 4);
  let seed = 71 + index;
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = seed / 4294967296;
      const scratch = Math.sin(x * 0.43 + Math.sin(y * 0.06) * 0.7) > 0.97;
      const value = Math.round(scratch ? 55 : 115 + grain * 115);
      const offset = (y * 128 + x) * 4;
      pixels.set([value, value, value, 255], offset);
    }
  }
  const relief = new THREE.DataTexture(pixels, 128, 128);
  relief.wrapS = relief.wrapT = THREE.RepeatWrapping;
  relief.magFilter = THREE.LinearFilter;
  relief.minFilter = THREE.LinearMipmapLinearFilter;
  relief.generateMipmaps = true;
  relief.needsUpdate = true;
  const stone = new THREE.MeshStandardMaterial({
    color: 0x304d48,
    roughness: 0.74,
    metalness: 0.48,
    flatShading: true,
    bumpMap: relief,
    bumpScale: 0.045,
    roughnessMap: relief,
  });
  const bronze = new THREE.MeshStandardMaterial({
    color: 0xa89a69,
    roughness: 0.42,
    metalness: 0.75,
    bumpMap: relief,
    bumpScale: 0.018,
    roughnessMap: relief,
  });
  const light = new THREE.MeshStandardMaterial({
    color: 0xc8e8bf,
    emissive: 0x7bbd98,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.3,
  });
  const add = (geometry, material, parent = group) => {
    const mesh = new THREE.Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  };
  if (index === 0) {
    const shard = add(new THREE.OctahedronGeometry(0.88, 1), stone);
    shard.scale.set(0.65, 1.5, 0.42);
    const seam = add(new THREE.BoxGeometry(0.025, 1.48, 0.028), light);
    seam.position.set(0, 0, 0.39);
    for (let i = 0; i < 7; i++) {
      const mark = add(
        new THREE.BoxGeometry(0.2 + (i % 3) * 0.055, 0.018, 0.024),
        bronze,
      );
      mark.position.set(
        i % 2 ? -0.09 : 0.09,
        (i - 3) * 0.17,
        0.4 - Math.abs(i - 3) * 0.03,
      );
      mark.rotation.z = i % 2 ? -0.55 : 0.55;
    }
  } else if (index === 1) {
    add(new THREE.TorusGeometry(0.84, 0.095, 8, 64), bronze);
    const inner = add(new THREE.TorusGeometry(0.64, 0.038, 8, 64), light);
    inner.rotation.y = 0.55;
    const orbit = add(new THREE.TorusGeometry(0.77, 0.035, 6, 64), stone);
    orbit.rotation.x = 1.05;
    const core = add(new THREE.OctahedronGeometry(0.3), light);
    core.scale.y = 1.5;
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12;
      const mark = add(
        new THREE.BoxGeometry(0.018, i % 3 ? 0.06 : 0.14, 0.035),
        light,
      );
      mark.position.set(Math.sin(a) * 0.84, Math.cos(a) * 0.84, 0.093);
      mark.rotation.z = -a;
    }
  } else {
    add(new THREE.IcosahedronGeometry(0.82, 0), stone);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.83, 0)),
      new THREE.LineBasicMaterial({ color: 0xb6c894 }),
    );
    group.add(edges);
    const core = add(new THREE.OctahedronGeometry(0.42), light);
    core.position.z = 0.66;
    const frame = add(new THREE.TorusGeometry(0.38, 0.035, 6, 6), bronze);
    frame.position.z = 0.71;
    frame.rotation.z = Math.PI / 6;
  }
  // Small engraved details must not each cost a separate field draw call.
  const batches = new Map();
  for (const mesh of [...group.children]) {
    if (!mesh.isMesh) continue;
    mesh.updateMatrix();
    const geometry = mesh.geometry.index
      ? mesh.geometry.toNonIndexed()
      : mesh.geometry.clone();
    geometry.applyMatrix4(mesh.matrix);
    if (!batches.has(mesh.material)) batches.set(mesh.material, []);
    batches.get(mesh.material).push(geometry);
    mesh.geometry.dispose();
    group.remove(mesh);
  }
  for (const [material, geometries] of batches) {
    const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
    mesh.castShadow = true;
    group.add(mesh);
    geometries.forEach((g) => g.dispose());
  }
  return group;
}

export function disposeObject(root) {
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set();
  root.traverse((o) => {
    if (o.geometry) geometries.add(o.geometry);
    if (o.material)
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
        materials.add(m),
      );
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => {
    Object.values(m).forEach((value) => {
      if (value?.isTexture) textures.add(value);
    });
    m.dispose();
  });
  textures.forEach((t) => t.dispose());
}
