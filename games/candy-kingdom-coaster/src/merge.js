// Shared scenery helper: bake a static group into one mesh per material.
import * as THREE from 'three';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';

// Collapse a scenery group into one mesh per material: a castle built from
// 300+ primitives costs 300+ draw calls (x3 once the shadow and bloom passes
// re-render the scene). Merging by material keeps the exact same look and cuts
// it to ~10 calls per landmark — the difference between smooth and 15 FPS on
// a phone. Falls back to the original meshes if a material cannot merge.
// Two materials with identical parameters render identically, so pieces that
// each built their own copy (a castle's 12 flags, 6 rainbow bands per arch...)
// still merge into one draw. Anything with hooks/unknown state keys by id.
const SIG_KEYS = ['type', 'roughness', 'metalness', 'side', 'transparent', 'opacity', 'flatShading', 'depthWrite',
  'depthTest', 'blending', 'alphaTest', 'vertexColors', 'emissiveIntensity', 'clearcoat', 'clearcoatRoughness',
  'envMapIntensity', 'polygonOffset', 'polygonOffsetFactor', 'wireframe', 'fog', 'toneMapped'];
const MAP_KEYS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap', 'aoMap', 'bumpMap', 'envMap'];
function matSignature(m) {
  if (Object.prototype.hasOwnProperty.call(m, 'onBeforeCompile')) return 'id' + m.id; // custom shader hook
  if (m.isShaderMaterial || m.isMeshPhysicalMaterial) return 'id' + m.id; // too many knobs to compare safely
  const parts = SIG_KEYS.map((k) => m[k]);
  for (const k of MAP_KEYS) parts.push(m[k] ? m[k].uuid : 0);
  parts.push(m.color ? m.color.getHex() : 0, m.emissive ? m.emissive.getHex() : 0);
  return JSON.stringify(parts);
}

export function mergeByMaterial(group, { castShadow = true, receiveShadow = true, noCollide = true } = {}) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const byMat = new Map();
  const meshes = [];
  group.traverse((o) => { if (o.isMesh) meshes.push(o); });
  if (meshes.length < 3) return;
  // mergeGeometries refuses to mix indexed and non-indexed geometry
  // (RoundedBoxGeometry is non-indexed), so bucket by material AND index-ness
  for (const m of meshes) {
    const g = m.geometry.clone();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld));
    const key = matSignature(m.material) + (g.index ? ':i' : ':n');
    if (!byMat.has(key)) byMat.set(key, { mat: m.material, geos: [] });
    byMat.get(key).geos.push(g);
  }
  const merged = [];
  const ok = new Set();
  for (const { mat, geos } of byMat.values()) {
    const g = mergeGeometries(geos, false);
    if (g) { merged.push([mat, g]); ok.add(mat); }
    for (const x of geos) x.dispose();
  }
  if (!merged.length) return;
  for (const m of meshes) if (ok.has(m.material)) m.parent.remove(m);
  for (const [mat, g] of merged) {
    const m = new THREE.Mesh(g, mat);
    m.castShadow = castShadow;
    m.receiveShadow = receiveShadow;
    if (noCollide) m.userData.noCollide = true; // landmark scenery, never on the racing line
    group.add(m);
  }
}

// Animated groups (balloons, butterflies, coaster cars...) can't be merged —
// they move. Instead every mesh inside them is bucketed by geometry+material
// (colour is moved to instanceColor) and drawn as ONE InstancedMesh per bucket.
// The groups stay in the scene as transform-only proxies, so existing animation
// code keeps writing position/rotation/scale (also of nested children, e.g.
// flapping wings) and sync() copies the result into the instance matrices.
const geoKey = (g) => (g.parameters && !g.parameters.shapes ? g.type + JSON.stringify(g.parameters) : g.uuid);
const matKey = (m) => JSON.stringify([
  m.type, m.roughness, m.metalness, m.side, m.transparent, m.opacity, m.flatShading, m.map ? m.map.uuid : 0,
  m.emissive ? m.emissive.getHex() : 0, m.emissiveIntensity, m.clearcoat, m.depthWrite, m.blending,
]);

export function instanceGroups(parent, groups, name = 'animatedSet') {
  const buckets = new Map();
  const moved = [];
  groups.forEach((g) => {
    if (g.parent !== parent) throw new Error('instanceGroups: group must be a direct child of parent');
    g.updateMatrixWorld(true);
    g.traverse((m) => {
      if (!m.isMesh || m.isInstancedMesh || Array.isArray(m.material) || m.material.vertexColors) return;
      const key = geoKey(m.geometry) + '|' + matKey(m.material);
      let b = buckets.get(key);
      if (!b) buckets.set(key, (b = { geo: m.geometry, mat: m.material, items: [] }));
      const chain = [];
      for (let o = m; o && o !== g; o = o.parent) chain.push(o);
      b.items.push({ g, chain, color: m.material.color ? m.material.color.clone() : null, cast: m.castShadow, recv: m.receiveShadow });
      moved.push(m);
    });
  });
  const draws = [];
  for (const b of buckets.values()) {
    const mat = b.mat.clone();
    const tinted = !!mat.color;
    if (tinted) mat.color.set(0xffffff);
    const im = new THREE.InstancedMesh(b.geo, mat, b.items.length);
    im.name = name;
    im.frustumCulled = false; // members roam / spread over the course
    im.castShadow = b.items.some((x) => x.cast);
    im.receiveShadow = b.items.some((x) => x.recv);
    im.userData.noCollide = true;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if (tinted) {
      b.items.forEach((it, i) => im.setColorAt(i, it.color));
      im.instanceColor.needsUpdate = true;
    }
    parent.add(im);
    draws.push({ im, items: b.items });
  }
  for (const m of moved) if (m.parent) m.parent.remove(m);
  const tm = new THREE.Matrix4();
  const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
  function sync() {
    for (const g of groups) g.updateMatrix();
    for (const d of draws) {
      const items = d.items;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (!it.g.visible) { d.im.setMatrixAt(i, ZERO); continue; }
        tm.copy(it.g.matrix);
        for (let k = it.chain.length - 1; k >= 0; k--) { const o = it.chain[k]; o.updateMatrix(); tm.multiply(o.matrix); }
        d.im.setMatrixAt(i, tm);
      }
      d.im.instanceMatrix.needsUpdate = true;
    }
  }
  sync();
  return { sync, drawCount: draws.length, meshCount: moved.length };
}
