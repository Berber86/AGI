// Dependency-free route regression tests (Node >=22.15).
// node --test games/candy-kingdom-coaster/tests/cake-course.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';

// Use exactly the vendored engine that the browser import map loads.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'three') return { url: new URL('../vendor/three/three.module.js', import.meta.url).href, shortCircuit: true };
    return next(specifier, context);
  },
});
const { createCourse, CAKE_COURSE: C } = await import('../src/cake-course.js');
const { RAMPS, TUNNEL, TIME_MEDAL, TUNING } = await import('../src/config.js');
const course = createCourse();
const { curve, length, cakes: r } = course;
const point = (s) => curve.getPointAt(s / length);
const tangent = (s) => curve.getTangentAt(s / length).normalize();
const near = (a, b, tolerance = 0.01) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);

function points(span, n = 600) {
  return Array.from({ length: n + 1 }, (_, i) => point(span.s0 + (span.s1 - span.s0) * i / n));
}

test('exactly two opposite-handed 1.25-turn serpentines, joined in order', () => {
  assert.ok(r.s0 < r.up.s0 && r.up.s1 === r.bridge.s0 && r.bridge.s1 === r.down.s0 && r.down.s1 < r.s1 && r.s1 < length);
  for (const [span, direction] of [[r.up, -1], [r.down, 1]]) {
    let last, turn = 0;
    for (const p of points(span)) {
      const angle = Math.atan2(p.z - span.center.z, p.x - span.center.x);
      if (last !== undefined) turn += Math.atan2(Math.sin(angle - last), Math.cos(angle - last));
      last = angle;
    }
    near(turn / (Math.PI * 2), direction * C.turns, 0.00001);
  }
});

test('ascent is monotone upward; descent is monotone downward; both change height by 34 m', () => {
  for (const [span, direction] of [[r.up, 1], [r.down, -1]]) {
    const ps = points(span);
    near((ps.at(-1).y - ps[0].y) * direction, C.rise, 0.00001);
    for (let i = 1; i < ps.length; i++) assert.ok((ps[i].y - ps[i - 1].y) * direction >= -0.0001);
  }
});

test('92 m bridge joins the upper ends at the same height, without a hidden hill', () => {
  near(r.bridge.s1 - r.bridge.s0, C.bridgeLength, 0.01);
  const y = point(r.up.s1).y;
  for (const p of points(r.bridge)) near(p.y, y, 0.002);
  near(point(r.down.s0).y, y);
});

test('all joins are position- and tangent-continuous; road has no teleport or hairpin kink', () => {
  for (const s of [r.s0, r.up.s0, r.up.s1, r.down.s0, r.down.s1, r.s1]) {
    const a = point(s - 0.02), b = point(s + 0.02);
    near(a.distanceTo(b), 0.04, 0.002);
    assert.ok(tangent(s - 0.1).dot(tangent(s + 0.1)) > 0.999, `tangent join at ${s}`);
  }
});

test('dense arc lengths keep actual travel speed uniform and slopes gentle', () => {
  for (let s = r.s0; s < r.s1; s += 0.7) {
    const a = point(s), b = point(s + 0.5), t = tangent(s);
    assert.ok([...a.toArray(), ...t.toArray()].every(Number.isFinite));
    near(a.distanceTo(b), 0.5, 0.003);
    assert.ok(Math.abs(t.y) < 0.19, `steep grade at ${s}: ${t.y}`);
    assert.ok(t.dot(tangent(s + 0.5)) > 0.9997, `tight bend at ${s}`);
  }
});

test('cake body and icing never reach the full deck width', () => {
  for (const cake of [r.up, r.down]) for (const p of points(cake)) {
    const tier = Math.min(2, Math.max(0, Math.floor((p.y - cake.center.y) / (C.rise / 3))));
    const clearance = Math.hypot(p.x - cake.center.x, p.z - cake.center.z) - C.deckHalfWidth - (cake.radii[tier] + 0.8);
    assert.ok(clearance > 0.8, `cake intersects deck: ${clearance}`);
  }
});

test('stacked turns have safe vertical clearance, including crossings under the bridge', () => {
  const ps = points({ s0: r.s0, s1: r.s1 }, 280);
  for (let i = 0; i < ps.length; i++) for (let j = i + 15; j < ps.length; j++) {
    const a = ps[i], b = ps[j];
    if (Math.hypot(a.x - b.x, a.z - b.z) < C.deckHalfWidth * 2) assert.ok(Math.abs(a.y - b.y) > 9, `low headroom: ${i}/${j}`);
  }
});

test('old landmarks stay upstream, with more than 100 m to land after the last ramp', () => {
  assert.ok(TUNNEL.s1 < r.s0);
  for (const ramp of RAMPS) {
    assert.ok(ramp.s + ramp.len + 100 < r.s0);
    near(course.fromSourceS(ramp.s), ramp.s);
  }
  assert.ok(length > 2300 && length < 2320);
  assert.ok(length / TUNING.cruiseSpeed < TIME_MEDAL.maxSeconds);
});

test('scenery distance mapping preserves all zones, the final castle and runoffs', () => {
  for (let s = -200; s <= course.sourceLength + 520; s += 3.7) near(course.toSourceS(course.fromSourceS(s)), s, 0.000001);
  near(course.toSourceS(length), course.sourceLength);
  near(course.toSourceS((r.s0 + r.s1) / 2), r.s0);
  near(course.fromSourceS(course.sourceLength * 0.985), length - course.sourceLength * 0.015);
});

test('grass shoulders taper smoothly and are absent from the elevated pass', () => {
  near(course.shoulderWeight(r.s0), 1);
  near(course.shoulderWeight(r.s1), 1);
  for (let s = r.up.s0; s <= r.down.s1; s += 1.3) assert.equal(course.shoulderWeight(s), 0);
  for (let s = r.s0; s < r.s1; s += 1) {
    const w = course.shoulderWeight(s);
    assert.ok(w >= 0 && w <= 1);
    assert.ok(Math.abs(w - course.shoulderWeight(s + 0.1)) < 0.004);
  }
});
