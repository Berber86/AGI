import test from 'node:test';
import assert from 'node:assert/strict';
import { FusionLook } from '../src/vr/fusionLook.js';
import { HeadShakeDetector } from '../src/vr/headGestures.js';
import { DualMarkerTracker, analyzeColorBlob } from '../src/vr/markerTracker.js';
import { GyroLook } from '../src/vr/gyro.js';

const DEG = Math.PI / 180;
const valid = (yawDeg = 0, pitchDeg = 0) => ({ status: 'valid', yaw: yawDeg * DEG, pitch: pitchDeg * DEG });
const lost = { status: 'lost', yaw: 0, pitch: 0 };

function feedGyro(fusion, yawDeg, steps = 1, dt = 1 / 60, sample = lost) {
  const from = (fusion.lastRaw?.yaw || 0) / DEG;
  for (let i = 1; i <= steps; i++) {
    fusion.update(dt, { yaw: (from + (yawDeg - from) * i / steps) * DEG, pitch: 0 }, sample);
  }
}

test('FusionLook follows gyro increments and caps marker correction', () => {
  const fusion = new FusionLook();
  fusion.update(1 / 60, { yaw: 0, pitch: 0 }, lost);
  feedGyro(fusion, 20, 20);
  assert.ok(Math.abs(fusion.yaw / DEG - 20) < 0.5);
  fusion.reset(0, 0);
  for (let i = 0; i < 60; i++) fusion.update(1 / 60, { yaw: 0, pitch: 0 }, valid(10));
  assert.ok(fusion.yaw / DEG > 3 && fusion.yaw / DEG < 9);
  assert.equal(fusion.status, 'fusion');
});

test('FusionLook rejects a one-frame gyro spike and later follows markers without gyro', () => {
  const fusion = new FusionLook();
  fusion.update(1 / 60, { yaw: 0, pitch: 0 }, lost);
  fusion.update(1 / 60, { yaw: 1, pitch: 0 }, lost);
  assert.ok(Math.abs(fusion.yaw) < 1e-9);
  fusion.update(1 / 60, { yaw: 0, pitch: 0 }, lost);
  for (let i = 0; i < 180; i++) fusion.update(1 / 60, null, valid(18));
  assert.equal(fusion.status, 'fusion-camera');
  assert.ok(fusion.yaw / DEG > 10 && fusion.yaw / DEG <= 18);
});

test('three deliberate side-to-side swings trigger exactly once', () => {
  const shake = new HeadShakeDetector();
  let triggered = 0;
  const sequence = [-20, 20, -20, 20];
  sequence.forEach((yaw, i) => { if (shake.update(yaw * DEG, 1000 + i * 250)) triggered++; });
  assert.equal(triggered, 1);
  assert.equal(shake.count, 0);
});

test('slow inspection turns do not look like a no gesture', () => {
  const shake = new HeadShakeDetector();
  let triggered = false;
  [-20, 20, -20, 20].forEach((yaw, i) => { triggered ||= shake.update(yaw * DEG, 1000 + i * 1900); });
  assert.equal(triggered, false);
});

test('gyro provider returns semantic right and up signs for a landscape headset pose', () => {
  globalThis.window = {
    screen: { orientation: { angle: 90 } },
    DeviceOrientationEvent: function DeviceOrientationEvent() {},
    addEventListener() {},
    removeEventListener() {},
  };
  const base = { alpha: 0, beta: 0, gamma: -90 };
  const move = (event) => {
    const gyro = new GyroLook();
    gyro.handle(base);
    gyro.handle(event);
    return { yaw: gyro.raw.yaw / DEG, pitch: gyro.raw.pitch / DEG };
  };
  assert.ok(Math.abs(move({ ...base, alpha: -20 }).yaw - 20) < 0.001);
  assert.ok(Math.abs(move({ ...base, gamma: -110 }).pitch - 20) < 0.001);
});

function calibratedTracker() {
  const tracker = new DualMarkerTracker();
  const markers = [
    { id: 'left', u: 0.35, v: 0.5, w: 56, h: 28 },
    { id: 'right', u: 0.65, v: 0.5, w: 56, h: 28 },
  ];
  tracker.inject(markers, 1000);
  tracker.inject(markers, 1250);
  assert.equal(tracker.calibrate(1250).ok, true);
  return tracker;
}

test('dual markers invert image motion into semantic head angles', () => {
  const tracker = calibratedTracker();
  const shiftedLeft = [
    { id: 'left', u: 0.35 - 12 / 62, v: 0.5, w: 56, h: 28 },
    { id: 'right', u: 0.65 - 12 / 62, v: 0.5, w: 56, h: 28 },
  ];
  tracker.inject(shiftedLeft, 1500);
  tracker.inject(shiftedLeft, 1750);
  let sample = tracker.sample(1800);
  assert.equal(sample.status, 'valid');
  assert.ok(sample.yaw / DEG > 10 && sample.yaw / DEG < 14);
  assert.ok(Math.abs(sample.pitch / DEG) < 1.5);

  const shiftedDown = [
    { id: 'left', u: 0.35, v: 0.5 + 10 / 48, w: 56, h: 28 },
    { id: 'right', u: 0.65, v: 0.5 + 10 / 48, w: 56, h: 28 },
  ];
  tracker.inject(shiftedDown, 2000);
  tracker.inject(shiftedDown, 2250);
  sample = tracker.sample(2300);
  assert.ok(sample.pitch / DEG > 8 && sample.pitch / DEG < 12);
});

test('one proven wide marker can provide a weaker single anchor', () => {
  const tracker = calibratedTracker();
  const one = [{ id: 'left', u: 0.35 - 8 / 62, v: 0.5, w: 56, h: 28 }];
  tracker.inject(one, 1500);
  tracker.inject(one, 1900);
  const sample = tracker.sample(1950);
  assert.equal(sample.status, 'single');
  assert.ok(sample.yaw / DEG > 6 && sample.yaw / DEG < 10);
});

test('round colour blobs are not accepted as calibrated landmarks', () => {
  const tracker = new DualMarkerTracker();
  const circles = [
    { id: 'left', u: 0.35, v: 0.5, w: 32, h: 32 },
    { id: 'right', u: 0.65, v: 0.5, w: 32, h: 32 },
  ];
  tracker.inject(circles, 1000);
  const info = tracker.inject(circles, 1400);
  assert.equal(info.markers.every((m) => !m.usable), true);
  assert.equal(tracker.calibrate(1400).ok, false);
});

test('colour blob analysis finds the requested hue', () => {
  const width = 30, height = 20, data = new Uint8ClampedArray(width * height * 4);
  for (let y = 7; y < 13; y++) for (let x = 8; x < 22; x++) {
    const i = (y * width + x) * 4;
    data[i] = 255; data[i + 1] = 68; data[i + 2] = 0; data[i + 3] = 255;
  }
  const blob = analyzeColorBlob(data, width, height, 16);
  assert.equal(blob.found, true);
  assert.ok(Math.abs(blob.cx - 14.5) < 1);
});
