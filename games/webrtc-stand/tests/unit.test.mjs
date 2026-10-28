import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseFirebaseConfig,
  median,
  p95,
  jitterOneWay,
  fmtBytes,
  handGyroToPad,
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
  assert.equal(p95([10, 12, 14, 16, 100]), 100);
  // RTT differences: |20-10|/2 = 5, |14-20|/2 = 3 => mean = 4
  assert.equal(jitterOneWay([10, 20, 14]), 4);
  assert.equal(fmtBytes(512), '512 Б');
  assert.equal(fmtBytes(2048), '2.0 КБ');
});

test('handGyroToPad maps wrist right turn to x>0, pitch up to y<0, and handles 0/360 wraparound', () => {
  const zero = { alpha: 5, beta: 10 };
  // Поворот кисти вправо на 14°: alpha уходит с 5° через 0° на 351°
  const rightTurn = handGyroToPad(351, 10, zero, 28);
  assert.ok(Math.abs(rightTurn.x - 0.5) < 1e-6, `expected x=0.5, got ${rightTurn.x}`);
  assert.equal(rightTurn.y, 0);

  // Подъём носа телефона вверх на 14°: beta 10° -> 24° => y = -0.5 (вверх на холсте)
  const upTilt = handGyroToPad(5, 24, zero, 28);
  assert.equal(upTilt.x, 0);
  assert.ok(Math.abs(upTilt.y - -0.5) < 1e-6, `expected y=-0.5, got ${upTilt.y}`);
});
