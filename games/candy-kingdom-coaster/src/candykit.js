// Shared candy geometry kit. Every part is normalised to one attribute set
// (position + normal + uv + colour) so a whole landmark merges into a handful
// of vertex-coloured draw calls. Used by forks.js, landmarks.js and ambient.js.
import * as THREE from 'three';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';

export const UP = new THREE.Vector3(0, 1, 0);
export const FLOOR = -3.3;
export const smooth = THREE.MathUtils.smoothstep;
export const C = (hex) => new THREE.Color(hex);
// deterministic per-facet jitter — crystal must not look machine-made
export const hash = (i, j = 0) => { const t = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return t - Math.floor(t); };

// ---------------------------------------------------------------- geometry
// mergeGeometries needs identical attribute sets, so every part is normalised
// to non-indexed position+normal+uv+colour. One vertex-coloured material can
// then draw gumdrops, gates, cookies and rocks in a single call.
export function ensure(geo, color) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  if (color !== undefined && !g.attributes.color) {
    const c = color.isColor ? color : C(color);
    const n = g.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.Float32BufferAttribute(arr, 3));
  }
  return g;
}
// normalised copy + optional colour, scale, rotation (x,y,z) and position
export function bake(geo, color, t = {}) {
  const g = ensure(geo, color);
  if (t.scale !== undefined) { if (Array.isArray(t.scale)) g.scale(t.scale[0], t.scale[1], t.scale[2]); else g.scale(t.scale, t.scale, t.scale); }
  if (t.rot) { if (t.rot[0]) g.rotateX(t.rot[0]); if (t.rot[1]) g.rotateY(t.rot[1]); if (t.rot[2]) g.rotateZ(t.rot[2]); }
  if (t.pos) g.translate(t.pos[0], t.pos[1], t.pos[2]);
  return g;
}
export const join = (geos) => (geos.length ? mergeGeometries(geos, false) : new THREE.BufferGeometry());
export function tubeBetween(a, b, r, color, seg = 6) {
  const d = b.clone().sub(a), len = Math.max(.001, d.length());
  const g = ensure(new THREE.CylinderGeometry(r, r, len, seg), color);
  g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize())));
  g.translate(a.x + d.x / 2, a.y + d.y / 2, a.z + d.z / 2);
  return g;
}
export function starGeometry(r = 1) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * .46 : r;
    if (!i) shape.moveTo(Math.cos(a) * d, Math.sin(a) * d); else shape.lineTo(Math.cos(a) * d, Math.sin(a) * d);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: false });
}
// rock-candy cluster: stretched octahedra — lanterns, spikes, grotto crust
export function crystalClusterGeometry(r = 1, n = 4) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const a = i * 2.399, d = i ? r * (.3 + .1 * (i % 2)) : 0;
    parts.push(bake(new THREE.OctahedronGeometry(r * (.52 - i * .06), 0), '#ffffff', {
      scale: [.85, 1.75 + (i % 3) * .3, .85], rot: [.25 * (i % 2), a, .3 * ((i % 3) - 1)],
      pos: [Math.cos(a) * d, .35 * (i % 2), Math.sin(a) * d],
    }));
  }
  return join(parts);
}
export function gumdropGeometry(r = 1) {
  return join([
    bake(new THREE.SphereGeometry(r, 9, 6), '#ffffff', { scale: [1, .84, 1], pos: [0, r * .78, 0] }),
    bake(new THREE.SphereGeometry(r * .48, 7, 5), '#ffffff', { scale: [1.15, .55, 1.15], pos: [0, r * 1.5, 0] }),
  ]);
}
export function cookieGeometry(r = 1, thickness = .55, chips = 5) {
  const parts = [bake(new THREE.CylinderGeometry(r, r, thickness, 14), '#ffffff', { rot: [Math.PI / 2, 0, 0] })];
  for (let i = 0; i < chips; i++) {
    const a = i * 2.399, d = r * (.25 + .45 * hash(i, 3)), cs = r * (.1 + .05 * hash(i, 9));
    parts.push(bake(new THREE.SphereGeometry(cs, 5, 3), C('#4b2a17'), { scale: [1, 1, .5], pos: [Math.cos(a) * d, Math.sin(a) * d, thickness / 2] }));
    parts.push(bake(new THREE.SphereGeometry(cs, 5, 3), C('#4b2a17'), { scale: [1, 1, .5], pos: [Math.cos(a + 1.1) * d, Math.sin(a + 1.1) * d, -thickness / 2] }));
  }
  return join(parts);
}
// cotton-candy puff: four low-poly lenses, ~unit radius
export function puffGeometry() {
  return join([
    bake(new THREE.SphereGeometry(1, 7, 5), '#ffffff', { scale: [1, .84, .96] }),
    bake(new THREE.SphereGeometry(.74, 6, 4), '#ffffff', { pos: [.86, .18, .12] }),
    bake(new THREE.SphereGeometry(.66, 6, 4), '#ffffff', { pos: [-.8, .04, -.26] }),
    bake(new THREE.SphereGeometry(.56, 6, 4), '#ffffff', { pos: [.14, .56, -.6] }),
  ]);
}
// round emblem plate with a rim, built in the gate's local X/Y plane
export function plateGeometry(r) {
  return join([
    bake(new THREE.CylinderGeometry(r, r, .5, 18), '#ffffff', { rot: [Math.PI / 2, 0, 0] }),
    bake(new THREE.TorusGeometry(r, .34, 5, 18), '#ffffff'),
  ]);
}

