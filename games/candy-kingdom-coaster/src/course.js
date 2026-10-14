// Distance-parametrised course. The cake detour replaces a quiet stretch of
// the original route; landmarks after it keep their original spacing through
// fromBaseDistance(). Road, car, camera and pickups all use this SAME curve.
import * as THREE from 'three';
import { BRIDGE, CAKE_COURSE } from './config.js';

const UP = new THREE.Vector3(0, 1, 0);
const smooth = (t) => t * t * (3 - 2 * t);

function baseCourse() {
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
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  // Three's default 200 samples undersample a long route, especially loops.
  curve.arcLengthDivisions = steps * 20;
  return curve;
}

// A slice retains the base curve's arc-length mapping, without refitting or
// rescaling its hills. The suffix only moves horizontally to meet the detour.
class Slice extends THREE.Curve {
  constructor(base, s0, s1, offset = new THREE.Vector3()) {
    super();
    this.base = base; this.s0 = s0; this.s1 = s1; this.offset = offset;
  }
  getLength() { return this.s1 - this.s0; }
  baseU(u) { return (this.s0 + u * this.getLength()) / this.base.getLength(); }
  getPoint(u, target = new THREE.Vector3()) { return this.base.getPointAt(this.baseU(u), target).add(this.offset); }
  getPointAt(u, target) { return this.getPoint(u, target); }
  getTangent(u, target) { return this.base.getTangentAt(this.baseU(u), target); }
  getTangentAt(u, target) { return this.getTangent(u, target); }
}

// An open, tapered helix. Smoothstep makes both height and radial velocity
// zero at the ends: the two summits meet the bridge landings without a kink.
class CakeSpiral extends THREE.Curve {
  constructor(center, side, forward, r0, r1, y0, y1, angle, sweep) {
    super();
    Object.assign(this, { center, side, forward, r0, r1, y0, y1, angle, sweep });
    this.arcLengthDivisions = 1600;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const q = smooth(t), a = this.angle + this.sweep * t;
    const r = THREE.MathUtils.lerp(this.r0, this.r1, q);
    return target.copy(this.center)
      .addScaledVector(this.side, r * Math.cos(a))
      .addScaledVector(this.forward, r * Math.sin(a))
      .setY(THREE.MathUtils.lerp(this.y0, this.y1, q));
  }
  getTangent(t, target = new THREE.Vector3()) {
    const q = smooth(t), dq = 6 * t * (1 - t), a = this.angle + this.sweep * t;
    const r = THREE.MathUtils.lerp(this.r0, this.r1, q), dr = (this.r1 - this.r0) * dq;
    return target.copy(this.side).multiplyScalar(dr * Math.cos(a) - r * Math.sin(a) * this.sweep)
      .addScaledVector(this.forward, dr * Math.sin(a) + r * Math.cos(a) * this.sweep)
      .setY((this.y1 - this.y0) * dq).normalize();
  }
}

// A suspended ribbon, not a flat road with a sagging decoration underneath.
// The symmetric 64t³(1−t)³ dip has zero first AND second derivatives at its
// ends, so the descent eases in and the exit levels out before the next cake.
// Curve.getPointAt/getTangentAt share an arc-length table: speed, camera,
// pickups and the rendered deck all follow the same real metres.
class SaggingBridge extends THREE.Curve {
  constructor(start, end, sag) {
    super();
    this.start = start.clone(); this.end = end.clone(); this.sag = sag;
    this.arcLengthDivisions = 1024;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const dip = 64 * (t * (1 - t)) ** 3;
    target.lerpVectors(this.start, this.end, t);
    target.y -= this.sag * dip;
    return target;
  }
  getTangent(t, target = new THREE.Vector3()) {
    const slope = 192 * (t * (1 - t)) ** 2 * (1 - 2 * t);
    target.subVectors(this.end, this.start);
    target.y -= this.sag * slope;
    return target.normalize();
  }
}

// u is already distance / total length. Do NOT apply Curve's second global
// arc-length lookup: it cuts across loops and moves the feature boundaries.
class Course extends THREE.Curve {
  constructor(pieces) {
    super();
    let s = 0;
    this.sections = pieces.map(([id, curve]) => {
      const s0 = s;
      s += curve.getLength();
      return { id, curve, s0, s1: s };
    });
    this.length = s;
  }
  getLength() { return this.length; }
  at(u) {
    const s = THREE.MathUtils.clamp(u, 0, 1) * this.length;
    const part = this.sections.find((p) => s <= p.s1) || this.sections[this.sections.length - 1];
    return { part, u: THREE.MathUtils.clamp((s - part.s0) / (part.s1 - part.s0), 0, 1) };
  }
  getPoint(u, target) { const p = this.at(u); return p.part.curve.getPointAt(p.u, target); }
  getPointAt(u, target) { return this.getPoint(u, target); }
  getTangent(u, target) { const p = this.at(u); return p.part.curve.getTangentAt(p.u, target); }
  getTangentAt(u, target) { return this.getTangent(u, target); }
}

export function buildCourse() {
  const C = CAKE_COURSE, base = baseCourse(), baseLength = base.getLength();
  const entry = base.getPointAt(C.baseStart / baseLength);
  const oldExit = base.getPointAt(C.baseEnd / baseLength);
  const entryT = base.getTangentAt(C.baseStart / baseLength);
  const exitT = base.getTangentAt(C.baseEnd / baseLength);
  const forward = entryT.clone().setY(0).normalize();
  const side = new THREE.Vector3().crossVectors(UP, forward).normalize();
  const local = (x, z) => entry.clone().addScaledVector(side, x).addScaledVector(forward, z);
  const topY = Math.max(entry.y, oldExit.y, 2.4) + C.rise;
  const centerA = local(-C.outerRadius, C.approach);
  const centerB = local(-C.outerRadius - C.bridgeLength, C.approach + 2 * C.innerRadius);
  const sweep = C.turns * Math.PI * 2;
  const up = new CakeSpiral(centerA, side, forward, C.outerRadius, C.innerRadius, entry.y, topY, 0, sweep);
  const down = new CakeSpiral(centerB, side, forward, C.innerRadius, C.outerRadius, topY, oldExit.y, -Math.PI / 2, -sweep);
  const a = up.getPoint(0), b = down.getPoint(1);
  // Split the departure between the two headings. Putting the endpoint
  // straight ahead but aiming its tangent sideways produces a tight cusp.
  const newExit = b.clone().addScaledVector(forward, C.departure / 2)
    .addScaledVector(exitT.clone().setY(0).normalize(), C.departure / 2);
  const approach = new THREE.CubicBezierCurve3(entry, entry.clone().addScaledVector(entryT, C.approach / 3),
    a.clone().addScaledVector(forward, -C.approach / 3), a);
  const departure = new THREE.CubicBezierCurve3(b, b.clone().addScaledVector(forward, C.departure / 3),
    newExit.clone().addScaledVector(exitT, -C.departure / 3), newExit);
  const bridge = new SaggingBridge(up.getPoint(1), down.getPoint(0), C.bridgeSag);
  const curve = new Course([
    ['before', new Slice(base, 0, C.baseStart)], ['approach', approach],
    ['ascent', up], ['cakeBridge', bridge], ['descent', down], ['departure', departure],
    ['after', new Slice(base, C.baseEnd, baseLength, newExit.clone().sub(oldExit))],
  ]);
  const part = (id) => curve.sections.find((p) => p.id === id);
  const endS = part('after').s0, extra = endS - C.baseEnd;
  const fromBaseDistance = (s) => s <= C.baseStart ? s : s >= C.baseEnd ? s + extra
    : C.baseStart + (s - C.baseStart) / (C.baseEnd - C.baseStart) * (endS - C.baseStart);
  const cake = (id, center, lowY, flavor) => ({
    id, flavor, center, lowY, topY, turns: C.turns,
    s0: part(id).s0, s1: part(id).s1,
    outerRadius: C.outerRadius, innerRadius: C.innerRadius,
  });
  const cakeSection = {
    s0: C.baseStart, s1: endS,
    deckStart: part('ascent').s0 - 6, deckEnd: part('descent').s1 + 6,
    ascent: cake('ascent', centerA, entry.y, 'strawberry-vanilla'),
    descent: cake('descent', centerB, oldExit.y, 'chocolate-blueberry'),
    bridge: { s0: part('cakeBridge').s0, s1: part('cakeBridge').s1, y: topY,
      lowY: topY - C.bridgeSag, sag: C.bridgeSag, span: C.bridgeLength },
  };
  return { curve, baseLength, fromBaseDistance, cakeSection };
}
