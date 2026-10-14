// Two opposite-handed cake serpentines, inserted after the last jump landing.
// Geometry-only module: the same spline/landmarks drive the car, road and cakes.
import * as THREE from 'three';
import { BRIDGE } from './config.js';

export const CAKE_COURSE = Object.freeze({
  insertIndex: 210, // ~1345 m: leaves >100 m to land after ramp B
  approach: 64,
  departure: 56,
  rise: 34,
  turns: 1.25,
  bridgeLength: 92,
  upRadius: [44, 32],
  downRadius: [35, 47],
  deckHalfWidth: 8.2,
  railOffset: 7.8,
});
const smooth = (t) => t * t * (3 - 2 * t);

function baseWaypoints() {
  const pts = [];
  const steps = 230, ds = 6.4;
  let x = 0, z = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const heading = 0.62 * Math.sin(2 * Math.PI * 1.9 * t + 0.42)
      + 0.34 * Math.sin(2 * Math.PI * 3.25 * t + 1.15)
      + 0.1 * Math.sin(2 * Math.PI * 5.6 * t);
    let y = 2.4 + 3.3 * Math.sin(2 * Math.PI * 1.55 * t + 0.2)
      + 0.95 * Math.sin(2 * Math.PI * 3.9 * t + 0.9);
    const db = i * ds - BRIDGE.s;
    if (Math.abs(db) < BRIDGE.halfSpan) y += BRIDGE.hump * Math.cos(db / BRIDGE.halfSpan * Math.PI / 2) ** 2;
    pts.push(new THREE.Vector3(x, y, z));
    x += Math.sin(heading) * ds;
    z += Math.cos(heading) * ds;
  }
  return pts;
}

export function createCourse() {
  const C = CAKE_COURSE, base = baseWaypoints();
  const anchor = base[C.insertIndex];
  const tangent = base[C.insertIndex + 1].clone().sub(base[C.insertIndex - 1]).normalize();
  const heading = Math.atan2(tangent.x, tangent.z);
  const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), heading);
  const local = (x, y, z) => new THREE.Vector3(x, y, z).applyQuaternion(yaw).add(anchor);
  const pts = base.slice(0, C.insertIndex + 1);
  const marks = { start: pts.length - 1 };
  // Cubic Hermite lead-ins match the original road pitch, flatten at the cake.
  const slope = tangent.y / Math.hypot(tangent.x, tangent.z);
  const sample = (n, fn) => { for (let i = 1; i <= n; i++) pts.push(fn(i / n)); };
  sample(24, (t) => local(0, slope * C.approach * t * (1 - t) ** 2, C.approach * t));
  marks.upStart = pts.length - 1;
  const a = { x: C.upRadius[0], z: C.approach };
  sample(144, (t) => {
    const k = smooth(t), r = THREE.MathUtils.lerp(...C.upRadius, k);
    const angle = Math.PI - Math.PI * 2 * C.turns * t;
    return local(a.x + r * Math.cos(angle), C.rise * k, a.z + r * Math.sin(angle));
  });
  marks.upEnd = pts.length - 1;
  const b = { x: a.x + C.bridgeLength, z: a.z + C.upRadius[1] + C.downRadius[0] };
  sample(36, (t) => local(a.x + C.bridgeLength * t, C.rise, a.z + C.upRadius[1]));
  marks.downStart = pts.length - 1;
  sample(152, (t) => {
    const k = smooth(t), r = THREE.MathUtils.lerp(...C.downRadius, k);
    const angle = -Math.PI / 2 + Math.PI * 2 * C.turns * t;
    return local(b.x + r * Math.cos(angle), C.rise * (1 - k), b.z + r * Math.sin(angle));
  });
  marks.downEnd = pts.length - 1;
  const exitX = b.x + C.downRadius[1];
  sample(22, (t) => local(exitX, slope * C.departure * t * t * (t - 1), b.z + C.departure * t));
  marks.end = pts.length - 1;
  const translation = pts[marks.end].clone().sub(anchor);
  for (const p of base.slice(C.insertIndex + 1)) pts.push(p.clone().add(translation));

  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  // THREE's default 200 arc-length samples cuts corners on multi-turn curves.
  // Dense, control-point-aligned samples make speed and landmark distances real.
  curve.arcLengthDivisions = (pts.length - 1) * 16;
  const arc = curve.getLengths();
  const at = (key) => arc[marks[key] * 16];
  const length = curve.getLength();
  const s0 = at('start'), s1 = at('end'), addedLength = s1 - s0;
  const sourceLength = length - addedLength;
  const toSourceS = (s) => s <= s0 ? s : s < s1 ? s0 : s - addedLength;
  const fromSourceS = (s) => s <= s0 ? s : s + addedLength;
  const cakes = {
    s0, s1, rise: C.rise, turns: C.turns, heading,
    up: { s0: at('upStart'), s1: at('upEnd'), center: local(a.x, 0, a.z), radii: [30, 26, 22], flavor: 'strawberry' },
    bridge: { s0: at('upEnd'), s1: at('downStart') },
    down: { s0: at('downStart'), s1: at('downEnd'), center: local(b.x, 0, b.z), radii: [33, 29, 25], flavor: 'chocolate' },
  };
  const shoulderWeight = (s) => {
    if (s <= s0 || s >= s1) return 1;
    if (s < cakes.up.s0) return 1 - smooth((s - s0) / (cakes.up.s0 - s0));
    if (s > cakes.down.s1) return smooth((s - cakes.down.s1) / (s1 - cakes.down.s1));
    return 0;
  };
  return { curve, length, cakes, sourceLength, toSourceS, fromSourceS, shoulderWeight };
}
