import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseFirebaseConfig,
  median,
  p95,
  jitterOneWay,
  fmtBytes,
  deviceUpVector,
  handTilt3DToPad,
  eulerZXYToQuat,
  handWandQuatToPad,
} from '../src/config-parser.js';

test('parseFirebaseConfig parses raw Firebase console JS snippet with https URL and comments', () => {
  const snippet = `
    // Paste from Firebase Console
    const firebaseConfig = {
      apiKey: 'AIzaSyTest123',
      authDomain: "demo-vr.firebaseapp.com",
      databaseURL: "https://demo-vr-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: 'demo-vr', // trailing comment
    };
  `;
  const cfg = parseFirebaseConfig(snippet);
  assert.equal(cfg.apiKey, 'AIzaSyTest123');
  assert.equal(cfg.databaseURL, 'https://demo-vr-default-rtdb.europe-west1.firebasedatabase.app');
  assert.equal(cfg.projectId, 'demo-vr');
});

test('parseFirebaseConfig throws clear Russian error when databaseURL is missing', () => {
  assert.throws(
    () => parseFirebaseConfig('{ apiKey: "123", projectId: "abc" }'),
    /databaseURL/
  );
});

test('stats helpers compute median, p95, jitterOneWay, and fmtBytes accurately', () => {
  assert.equal(median([30, 10, 20]), 20);
  assert.equal(median([10, 20, 30, 40]), 25);
  assert.equal(p95([10, 20, 14, 16, 100]), 100);
  assert.equal(jitterOneWay([10, 20, 14]), 4);
  assert.equal(fmtBytes(512), '512 Б');
  assert.equal(fmtBytes(2048), '2.0 КБ');
});

test('handTilt3DToPad gives 1:1 symmetric tilt on BOTH short and long sides without compass alpha', () => {
  const zeroFlat = deviceUpVector(0, 0, 0);

  // Наклон боком (короткая грань): +12.5° вправо vs -12.5° влево при span=25° => +0.5 и -0.5
  const right = handTilt3DToPad(0, 12.5, zeroFlat, { spanDeg: 25 });
  const left = handTilt3DToPad(0, -12.5, zeroFlat, { spanDeg: 25 });
  assert.ok(Math.abs(right.x - 0.5) < 1e-3, `right.x=${right.x}`);
  assert.ok(Math.abs(left.x - -0.5) < 1e-3, `left.x=${left.x}`);
  assert.equal(right.y, 0);
  assert.equal(left.y, 0);

  // Наклон вперёд/назад (длинная грань): +12.5° нос вверх vs -12.5° нос вниз => y = -0.5 и +0.5
  const up = handTilt3DToPad(12.5, 0, zeroFlat, { spanDeg: 25 });
  const down = handTilt3DToPad(-12.5, 0, zeroFlat, { spanDeg: 25 });
  assert.equal(up.x, 0);
  assert.ok(Math.abs(up.y - -0.5) < 1e-3, `up.y=${up.y}`);
  assert.ok(Math.abs(down.y - 0.5) < 1e-3, `down.y=${down.y}`);
});

test('handTilt3DToPad stays symmetric from slanted hand grip (beta=35, gamma=20) and across gamma=90 cliff', () => {
  const grip = deviceUpVector(35, 20, 0);
  const atGrip = handTilt3DToPad(35, 20, grip, { spanDeg: 25 });
  assert.ok(Math.abs(atGrip.x) < 1e-6 && Math.abs(atGrip.y) < 1e-6);

  // Симметрия влево/вправо от наклонного хвата руки
  const tiltMoreRight = handTilt3DToPad(35, 38, grip, { spanDeg: 25 });
  const tiltMoreLeft = handTilt3DToPad(35, 2, grip, { spanDeg: 25 });
  assert.ok(tiltMoreRight.x > 0.45, `expected strong right response, got ${tiltMoreRight.x}`);
  assert.ok(tiltMoreLeft.x < -0.45, `expected strong left response, got ${tiltMoreLeft.x}`);
  assert.ok(Math.abs(tiltMoreRight.x + tiltMoreLeft.x) < 0.03, 'left/right response must be symmetric');

  // Переход через границу Эйлера gamma = 90° -> физический крен 95° (W3C отдаёт beta=180, gamma=-85)
  const zeroSteep = deviceUpVector(0, 75, 0);
  const before90 = handTilt3DToPad(0, 85, zeroSteep, { spanDeg: 25 });     // +10°
  const after90 = handTilt3DToPad(180, -85, zeroSteep, { spanDeg: 25 });   // +20° (без скачка в минус!)
  assert.ok(Math.abs(before90.tiltRightDeg - 10) < 0.2, `before90=${before90.tiltRightDeg}`);
  assert.ok(Math.abs(after90.tiltRightDeg - 20) < 0.2, `after90=${after90.tiltRightDeg}`);
});

test('handWandQuatToPad handles 3D quaternion pointing and 0/360 azimuth wraparound', () => {
  const q0 = eulerZXYToQuat(5, 25, 0);
  // Поворот кисти вправо через границу 0°->350° и подъём носа с 25° до 37.5°
  const res = handWandQuatToPad(351, 37.5, 0, q0, { spanDeg: 25 });
  assert.ok(res.x > 0.4, `expected x > 0.4, got ${res.x}`);
  assert.ok(Math.abs(res.y - -0.5) < 0.05, `expected y ~ -0.5, got ${res.y}`);
});
