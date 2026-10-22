import test from 'node:test';
import assert from 'node:assert/strict';
import { quatFromAxisAngle, quatMultiply, quatRotateVec, centroidToYawPitch, angDiffDeg } from '../src/look/math.js';
import { MarkerTracker, FusionLook, ENTITY_SECONDS } from '../src/look/markers.js';

const det = (yaw, pitch, count = 100, extra = {}) => ({ found: true, u: 0.5, v: 0.5, count, fill: 0.8, aspect: 2.4, yawDeg: yaw, pitchDeg: pitch, expected: true, ...extra });

test('forward extraction: device rotated right gives yaw>0, up gives pitch>0', () => {
  // Build a device quaternion whose camera forward points right/up and read
  // the semantic angles off the forward vector (same math as provider).
  const yawOf = (q) => { const f = quatRotateVec(q, [0, 0, -1]); return { yaw: Math.atan2(f[0], -f[2]) * 180 / Math.PI, pitch: Math.asin(f[1]) * 180 / Math.PI }; };
  const right = yawOf(quatFromAxisAngle(0, 1, 0, -30));
  assert.ok(right.yaw > 29 && right.yaw < 31, `yaw=${right.yaw}`);
  const up = yawOf(quatMultiply(quatFromAxisAngle(0, 1, 0, -30), quatFromAxisAngle(1, 0, 0, 20)));
  assert.ok(up.pitch > 15, `pitch=${up.pitch}`);
});

test('centroid: pair moving left in frame means head right (yaw up)', () => {
  const centre = centroidToYawPitch(0.5, 0.5); const left = centroidToYawPitch(0.3, 0.5); const down = centroidToYawPitch(0.5, 0.7);
  assert.equal(centre.yawDeg, 0); assert.ok(left.yawDeg > centre.yawDeg);
  assert.ok(down.pitchDeg < 0); // pair down in frame -> gaze up semantics handled by delta sign vs calibration
  assert.ok(Math.abs(angDiffDeg(190, -170) - 0) < 1e-9 || Math.abs(angDiffDeg(190, -170)) === 0);
});

function confirmedPair(tracker) {
  // Feed both markers long enough to become entities, then calibrate at 0,0.
  let t = 0;
  for (let i = 0; i < 5; i++) { tracker.update({ left: det(-10, 0), right: det(10, 0) }, t); t += 0.1; }
  const res = tracker.calibrate({ left: det(-10, 0), right: det(10, 0) }, t);
  assert.ok(res.ok);
  return t;
}

test('marker entity needs >=0.15s: 0.08s no, 0.18s yes', () => {
  const tr = new MarkerTracker();
  let out = tr.update({ left: det(-10, 0), right: det(10, 0) }, 0);
  out = tr.update({ left: det(-10, 0), right: det(10, 0) }, 0.08);
  assert.equal(out.entity.left, false);
  out = tr.update({ left: det(-10, 0), right: det(10, 0) }, 0.18);
  assert.equal(out.entity.left, true); assert.equal(out.mode, 'pair');
  assert.ok(ENTITY_SECONDS === 0.15);
});

test('calibration requires both markers', () => {
  const tr = new MarkerTracker();
  const res = tr.calibrate({ left: det(-10, 0), right: { found: false, count: 0 } }, 10);
  assert.equal(res.ok, false);
});

function feedPair(tr, left, right, t0, frames = 4) {
  let out;
  for (let i = 0; i < frames; i++) out = tr.update({ left, right }, t0 + i * 0.08);
  return out;
}

test('pair at +5 deg puts look at +5; lone centred marker never proves straight', () => {
  const tr = new MarkerTracker(); confirmedPair(tr);
  const pair = feedPair(tr, det(-5, 0), det(15, 0), 20);
  assert.ok(Math.abs(pair.yawDeg - 5) < 1.5, `pair yaw=${pair.yawDeg}`);
  const lone = tr.update({ left: det(-10, 0), right: null }, 21);
  assert.notEqual(lone.mode, 'pair');
  assert.ok(Math.abs(lone.yawDeg - 5) < 8, 'lone centred marker must not snap look to 0');
});

test('loss of both holds look: no timer return to centre', () => {
  const tr = new MarkerTracker(); confirmedPair(tr);
  feedPair(tr, det(0, 0), det(20, 0), 30); // ~10 deg right
  let out;
  for (let i = 1; i <= 40; i++) out = tr.update({ left: null, right: null }, 30 + i);
  assert.ok(Math.abs(out.yawDeg) > 2, `held yaw=${out.yawDeg} must not drift to centre`);
});

test('alien-side blob does not extend entity life', () => {
  const tr = new MarkerTracker(); confirmedPair(tr);
  // left marker disappears; only alien (expected:false) detections arrive
  for (let i = 1; i <= 50; i++) tr.update({ left: det(-30, 0, 100, { expected: false }), right: null }, 40 + i * 0.1);
  const out = tr.update({ left: null, right: null }, 46);
  assert.equal(out.entity.left, false);
});

test('fusion: one bad camera frame does not move look; correction rate-limited', () => {
  const f = new FusionLook(); const gyro = { yawDeg: 10, pitchDeg: 0 };
  let out = f.update(gyro, { pairVisible: true, mode: 'pair', yawDeg: 80, pitchDeg: 0 }, 0, 0.016);
  assert.equal(out.yawDeg, 10); // unconfirmed -> ignored
  out = f.update(gyro, { pairVisible: true, mode: 'pair', yawDeg: 80, pitchDeg: 0 }, 0.1, 0.1);
  assert.ok(out.yawDeg > 10 && out.yawDeg <= 10.6, `rate-limited correction, got ${out.yawDeg}`);
});
