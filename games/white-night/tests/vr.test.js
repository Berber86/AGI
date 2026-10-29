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

test('two deliberate side-to-side transitions trigger exactly once', () => {
  const shake = new HeadShakeDetector();
  let triggered = 0;
  const sequence = [-20, 20, -20];
  sequence.forEach((yaw, i) => { if (shake.update(yaw * DEG, 1000 + i * 250)) triggered++; });
  assert.equal(triggered, 1);
  assert.equal(shake.count, 0);
});

test('slow inspection turns do not look like a no gesture', () => {
  const shake = new HeadShakeDetector();
  let triggered = false;
  [-20, 20, -20].forEach((yaw, i) => { triggered ||= shake.update(yaw * DEG, 1000 + i * 2300); });
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

test('gyro provider keeps horizon level from tilted/rolled start, supports angle=270, and handles alpha=null across horizon without 180 deg flip', () => {
  // 1) Старт VR с наклонённой и заваленной набок головой (beta=20, gamma=-60):
  //    чистый горизонтальный поворот вокруг гравитации на 60° даёт ровно 60° yaw и 0° паразитного pitch!
  globalThis.window = {
    screen: { orientation: { angle: 90 } },
    DeviceOrientationEvent: function DeviceOrientationEvent() {},
    addEventListener() {},
    removeEventListener() {},
  };
  const gTilted = new GyroLook();
  gTilted.handle({ alpha: 0, beta: 20, gamma: -60 });
  gTilted.handle({ alpha: -60, beta: 20, gamma: -60 });
  assert.ok(Math.abs(gTilted.raw.yaw / DEG - 60) < 0.05, `tilted yaw=${gTilted.raw.yaw / DEG}`);
  assert.ok(Math.abs(gTilted.raw.pitch / DEG) < 0.05, `zero parasitic pitch=${gTilted.raw.pitch / DEG}`);

  // 2) Телефон вставлен в Cardboard другой стороной (Landscape-Right, angle=270)
  globalThis.window.screen.orientation.angle = 270;
  const g270 = new GyroLook();
  g270.handle({ alpha: 0, beta: 0, gamma: 85 });
  g270.handle({ alpha: -20, beta: 0, gamma: 85 });
  assert.ok(Math.abs(g270.raw.yaw / DEG - 20) < 0.05, `angle=270 yaw=${g270.raw.yaw / DEG}`);
  assert.ok(Math.abs(g270.raw.pitch / DEG) < 0.05, `angle=270 pitch=${g270.raw.pitch / DEG}`);

  // 3) Смартфон без магнитометра (alpha === null) проходит взгляд через горизонт (-5° -> +5°, W3C beta 0 -> 180):
  //    никакого разворота на 180° и плавный подъём взгляда ровно на +10°!
  globalThis.window.screen.orientation.angle = 90;
  const gNoCompass = new GyroLook();
  gNoCompass.handle({ alpha: null, beta: 0, gamma: -85 });   // -5° ниже горизонта
  assert.equal(gNoCompass.fresh(700), true);
  gNoCompass.handle({ alpha: null, beta: 180, gamma: 85 });  // +5° выше горизонта (+10° вверх!)
  assert.ok(Math.abs(gNoCompass.raw.yaw / DEG) < 0.05, `no 180 deg flip on alpha=null: yaw=${gNoCompass.raw.yaw / DEG}`);
  assert.ok(Math.abs(gNoCompass.raw.pitch / DEG - 10) < 0.05, `smooth +10 deg pitch across horizon: pitch=${gNoCompass.raw.pitch / DEG}`);
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

test('DualMarkerTracker.sampleColor maps 9:16 portrait video inside 4:3 contain box to exact marker pixel', () => {
  // Портретный поток камеры 720x1280 (videoAspect = 0.5625) внутри <video> 400x300 (4:3):
  // реальная картинка занимает ширину 300 * 0.5625 = 168.75px по центру (поля слева/справа по 115.625px)!
  const fakeVideo = { videoWidth: 720, videoHeight: 1280 };
  const tracker = new DualMarkerTracker(fakeVideo);
  tracker.inject([{ id: 'right', u: 0.5, v: 0.15, w: 30, h: 20, hue: 338 }], 1000);

  const rect = { left: 100, top: 50, width: 400, height: 300 };
  // Тап по чёрному полю слева от портретного видео (x = 120 -> внутри поля 115.6px) -> null
  assert.equal(tracker.sampleColor(120, 95, rect), null);

  // Тап точно в верхнюю метку (u=0.5 -> центр 100 + 200 = 300, v=0.15 -> 50 + 0.15 * 300 = 95)
  const picked = tracker.sampleColor(300, 95, rect);
  assert.ok(picked && Math.abs(picked.hue - 338) < 4, `picked hue=${picked?.hue}`);
});

test('FusionLook allows downward gaze past -55 deg (up to -68 deg) so VR players can inspect coat, trousers and boots', () => {
  const fusion = new FusionLook();
  fusion.update(1 / 60, { yaw: 0, pitch: 0 }, lost);
  for (let i = 1; i <= 30; i++) {
    fusion.update(1 / 60, { yaw: 0, pitch: (-58 * i / 30) * DEG }, lost);
  }
  assert.ok(Math.abs(fusion.pitch / DEG + 58) < 0.5, `downward pitch preserved at -58 deg: ${fusion.pitch / DEG}`);

  for (let i = 1; i <= 30; i++) {
    fusion.update(1 / 60, { yaw: 0, pitch: (-58 - 24 * i / 30) * DEG }, lost);
  }
  assert.ok(Math.abs(fusion.pitch / DEG + 68) < 0.5, `clamped cleanly at -68 deg: ${fusion.pitch / DEG}`);
});


