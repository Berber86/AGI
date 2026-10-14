// A two-fork route graph over the existing course. Public s is a stable route
// station, NOT metres inside a fork. Each alternative is arc-length mapped;
// advance()/distance() convert physical metres at every join (also backwards
// for the chase camera). Landmarks beyond a choice therefore never move.
import * as THREE from 'three';
import { FORKS } from './config.js';
const UP = new THREE.Vector3(0, 1, 0);
const clamp = THREE.MathUtils.clamp;
const bell = (t) => t <= 0 || t >= 1 ? 0 : 64 * (t * (1 - t)) ** 3;

class Branch extends THREE.Curve {
  constructor(base, s0, s1, side, spread, feature) {
    super();
    Object.assign(this, { base, s0, s1, side, spread, feature });
    this.baseLength = base.getLength(); this.arcLengthDivisions = 800;
    const chord = base.getPointAt(s1 / this.baseLength).sub(base.getPointAt(s0 / this.baseLength));
    this.right = new THREE.Vector3().crossVectors(chord, UP).normalize();
  }
  getPoint(t, target = new THREE.Vector3()) {
    const s = THREE.MathUtils.lerp(this.s0, this.s1, t);
    this.base.getPointAt(s / this.baseLength, target);
    target.addScaledVector(this.right, this.side * this.spread * Math.sin(Math.PI * t) ** 2);
    const u = (t - .22) / .56; // leave both decision aprons at the common height
    const shape = this.feature.kind === 'hills' ? bell(u * 2) + bell(u * 2 - 1) : bell(u);
    target.y += this.feature.lift * shape;
    return target;
  }
  getTangent(t, target = new THREE.Vector3()) {
    // Exact shared endpoint tangents prevent a one-sided finite-difference kink.
    if (t <= 0 || t >= 1) return this.base.getTangentAt((t <= 0 ? this.s0 : this.s1) / this.baseLength, target);
    return super.getTangent(t, target);
  }
}

export function createRoutes(reference, fromBaseDistance) {
  const length = reference.getLength();
  const forks = FORKS.map((cfg) => {
    const s0 = fromBaseDistance(cfg.baseStart), s1 = fromBaseDistance(cfg.baseEnd);
    const fork = { ...cfg, s0, s1, span: s1 - s0, selected: null, pending: 0 };
    fork.branches = cfg.routes.map((feature, index) => {
      const curve = new Branch(reference, s0, s1, index ? 1 : -1, cfg.spread, feature);
      return { ...feature, index, curve, length: curve.getLength(), forkId: cfg.id };
    });
    return fork;
  });
  const boundaries = forks.flatMap((f) => [f.s0, f.s1]);
  const at = (s) => forks.find((f) => s >= f.s0 && s <= f.s1) || null;
  const choice = (f) => f.selected ?? f.pending;
  const branchAt = (s, option) => { const f = at(s); return f ? f.branches[option ?? choice(f)] : null; };
  function point(s, target = new THREE.Vector3(), option) {
    const f = at(s);
    return f ? f.branches[option ?? choice(f)].curve.getPointAt(clamp((s - f.s0) / f.span, 0, 1), target)
      : reference.getPointAt(clamp(s / length, 0, 1), target);
  }
  function tangent(s, target = new THREE.Vector3(), option) {
    const f = at(s);
    return f ? f.branches[option ?? choice(f)].curve.getTangentAt(clamp((s - f.s0) / f.span, 0, 1), target)
      : reference.getTangentAt(clamp(s / length, 0, 1), target);
  }
  const metric = (s, option) => { const f = at(s); return f ? f.branches[option ?? choice(f)].length / f.span : 1; };
  function advance(s, metres, option) {
    const direction = Math.sign(metres); let remaining = Math.abs(metres);
    if (!direction) return s;
    for (let guard = 0; remaining > 1e-9 && guard < boundaries.length + 2; guard++) {
      const sample = s + direction * 1e-7, scale = metric(sample, option);
      const next = direction > 0 ? boundaries.find((v) => v > sample) : boundaries.findLast((v) => v < sample);
      const available = next == null ? Infinity : Math.abs(next - s) * scale;
      if (remaining <= available) return s + direction * remaining / scale;
      s = next; remaining -= available;
    }
    return s;
  }
  function distance(a, b, option) {
    if (a > b) return -distance(b, a, option);
    let d = b - a;
    for (const f of forks) {
      const overlap = Math.max(0, Math.min(b, f.s1) - Math.max(a, f.s0));
      d += overlap * (f.branches[option ?? choice(f)].length / f.span - 1);
    }
    return d;
  }
  function reset() { for (const f of forks) { f.selected = null; f.pending = 0; } }
  function select(id, option) {
    const f = forks.find((f) => f.id === id);
    if (!f || (option !== 0 && option !== 1)) throw new Error('Unknown fork/route');
    f.pending = option; f.selected = option; return f;
  }
  // Steer toward a lane before the split. Once the car crosses the common
  // landing the decision is latched for the whole ride, including the camera
  // looking back after the merge. A neutral driver always has a safe left path.
  function update(s, lateral, steer, metres = 0) {
    const events = [];
    for (const f of forks) {
      if (f.selected !== null || s > f.s1 || s < f.s0 - f.warning) continue;
      if (s < f.s0) {
        if (Math.abs(lateral) > .45) f.pending = lateral > 0 ? 1 : 0;
        else if (steer) f.pending = steer > 0 ? 1 : 0;
      }
      if (s >= f.s0 || advance(s, metres) >= f.s0) {
        f.selected = f.pending; events.push({ fork: f, route: f.branches[f.selected] });
      }
    }
    return events;
  }
  function hint(s) {
    const f = forks.find((f) => s >= f.s0 - f.warning && s < f.s0 + 22);
    return f ? { id: f.id, index: forks.indexOf(f) + 1, routes: f.branches,
      selected: f.selected, pending: f.pending, metres: Math.max(0, Math.ceil(distance(s, f.s0))) } : null;
  }
  const curve = new THREE.Curve();
  curve.getLength = () => length;
  curve.getPoint = curve.getPointAt = (u, target) => point(u * length, target);
  curve.getTangent = curve.getTangentAt = (u, target) => tangent(u * length, target);
  curve.sections = reference.sections; // existing landmark joints, untouched
  return { reference, curve, forks, at, branchAt, choice, point, tangent, metric, advance, distance, reset, select, update, hint,
    routeLength: () => distance(0, length) };
}
