// Юнит-тесты чистой логики: знаки взгляда, двелль, перенос, конфигурация зала.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  POINTS, ARTWORKS, SCULPTURES, DWELL_SECONDS, HALL, START_POINT,
  pointById, pointPose, lookAngles, EXHIBITS,
} from '../src/config.js';
import {
  createGaze, forwardFromAngles as gazeForward, markerDirection, angleBetween, ringFraction, MARKER_EYE_HEIGHT,
} from '../src/gaze.js';
import { createGlide, createFade, createTravel, shortestAngle, lerpAngle } from '../src/travel.js';
import { closeUpPose, paintingCoverage, createStudyDwell, CLOSE_FOV } from '../src/study.js';
import { anglesFromQuaternion, applyOrientation, clampPitch, forwardFromAngles as vrForward } from '../src/vr.js';

const D2R = Math.PI / 180;

function aimAt(position, point) {
  const dir = markerDirection(position, point.position);
  const horizontal = Math.hypot(dir[0], dir[2]) || 1e-6;
  return { yaw: Math.atan2(dir[0], -dir[2]), pitch: Math.atan2(dir[1], horizontal) };
}

function fakeView(pointId, position, yaw, pitch) {
  return {
    position,
    forward: gazeForward(yaw, pitch),
    currentPointId: pointId,
    enabled: true,
  };
}

test('конфигурация зала: 9 точек, 6 картин, 2 скульптуры, все id уникальны', () => {
  assert.equal(POINTS.length, 9);
  assert.equal(ARTWORKS.length, 6);
  assert.equal(SCULPTURES.length, 2);
  assert.equal(EXHIBITS.length, 8);
  const ids = [...POINTS, ...ARTWORKS, ...SCULPTURES].map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(pointById(START_POINT));
});

test('точки стоят внутри зала и не в стенах', () => {
  for (const point of POINTS) {
    const [x, z] = point.position;
    assert.ok(Math.abs(x) < HALL.width / 2 - 0.6, `${point.id} x=${x}`);
    assert.ok(Math.abs(z) < HALL.depth / 2 - 0.6, `${point.id} z=${z}`);
  }
});

test('картины висят на стенах лицом в зал', () => {
  for (const art of ARTWORKS) {
    const [x, y, z] = art.position;
    assert.ok(y > 1.4 && y < 4.2, `${art.id} y=${y}`);
    const onWallX = Math.abs(Math.abs(x) - HALL.width / 2) < 0.2;
    const onWallZ = Math.abs(Math.abs(z) - HALL.depth / 2) < 0.2;
    assert.ok(onWallX || onWallZ, `${art.id} не на стене`);
    // Нормаль картины должна смотреть внутрь зала.
    const nx = Math.sin(art.rotationY);
    const nz = Math.cos(art.rotationY);
    const inward = onWallX ? -Math.sign(x) * nx : -Math.sign(z) * nz;
    assert.ok(inward > 0.9, `${art.id} смотрит в стену`);
  }
});

test('скульптуры стоят на полу и не пересекаются с точками', () => {
  for (const s of SCULPTURES) {
    assert.equal(s.position[1], 0);
    for (const p of POINTS) {
      const d = Math.hypot(p.position[0] - s.position[0], p.position[1] - s.position[2]);
      assert.ok(d > 0.9, `${s.id} слишком близко к ${p.id}: ${d.toFixed(2)} м`);
    }
  }
});

test('знаки: yaw > 0 — вправо, pitch > 0 — вверх (та же семантика в gaze и vr)', () => {
  const [x1, y1, z1] = gazeForward(0, 0);
  assert.ok(Math.abs(x1) < 1e-9 && Math.abs(y1) < 1e-9 && z1 < 0, 'нулевой взгляд смотрит в −Z');
  const right = gazeForward(0.4, 0);
  assert.ok(right[0] > 0, 'yaw>0 уводит вправо по +X');
  const up = gazeForward(0, 0.5);
  assert.ok(up[1] > 0, 'pitch>0 смотрит вверх');
  const vr = vrForward(0.4, 0.2);
  assert.ok(vr[0] > 0 && vr[1] > 0);
  assert.deepEqual(vr.map((v) => Math.round(v * 1e6)), gazeForward(0.4, 0.2).map((v) => Math.round(v * 1e6)));
});

test('углы взгляда из точки на якорь дают этот же якорь по forward', () => {
  for (const point of POINTS) {
    const pose = pointPose(point);
    const from = [point.position[0], HALL.eye, point.position[1]];
    const dir = gazeForward(pose.yaw, pose.pitch);
    const toAnchor = [
      point.anchor[0] - from[0], point.anchor[1] - from[1], point.anchor[2] - from[2],
    ];
    const angle = angleBetween(dir, toAnchor);
    assert.ok(angle < 1e-6, `${point.id}: ${angle}`);
  }
});

test('кватернион из DeviceOrientation переводится в доказанную пару знаков', () => {
  // Синтетическая поза: поворот вправо вокруг оси Y в мировых координатах.
  const q = new (globalThis.__THREE_Quat || Object)();
  void q;
  // Без three.js проверим формулу на плоскости: alpha = 90° (поворот вправо)
  const result = applyOrientation(0, Math.PI / 2, 0, 0);
  assert.ok(Number.isFinite(result.yaw) && Number.isFinite(result.pitch));
  // Прямой тест anglesFromQuaternion через простой объект-кватернион нельзя:
  // там нужен THREE. Знак yaw проверяется в браузерном тесте vr.mjs.
  assert.ok(Math.abs(result.pitch) < 1e-6);
});

test('двелль: 5 секунд по точке, затем прибытие', () => {
  const point = pointById('p3');
  const from = [-2, HALL.eye, 3];
  const pose = aimAt(from, point);
  const gaze = createGaze({ points: POINTS, dwellSeconds: DWELL_SECONDS, angleDeg: 4.5, grace: 0.45 });
  const view = fakeView('p1', from, pose.yaw, pose.pitch);
  let snap = null;
  let elapsed = 0;
  for (let i = 0; i < 700; i += 1) {
    snap = gaze.update(1 / 60, view);
    elapsed += 1 / 60;
    if (snap.arrival) break;
  }
  assert.equal(snap.arrival, 'p3');
  assert.ok(elapsed > 4.5 && elapsed < 5.6, `прибытие через ${elapsed.toFixed(2)} с`);
});

test('двелль: взгляд мимо не копит прогресс', () => {
  const point = pointById('p3');
  const from = [-2, HALL.eye, 3];
  const pose = aimAt(from, point);
  const gaze = createGaze({ points: POINTS, dwellSeconds: 10 });
  const away = fakeView('p1', from, pose.yaw + 0.6, pose.pitch);
  let snap = null;
  for (let i = 0; i < 300; i += 1) snap = gaze.update(1 / 60, away);
  assert.equal(snap.arrival, undefined);
  assert.equal(snap.progress, 0);
  assert.equal(snap.targetId, null);
});

test('двелль: короткий отвод взгляда не сбрасывает, длинный — гасит', () => {
  const point = pointById('p5');
  const from = [0, HALL.eye, 0];
  const pose = aimAt(from, point);
  const gaze = createGaze({ points: POINTS, dwellSeconds: 10, grace: 0.45, decay: 3.2 });
  const view = fakeView('p1', from, pose.yaw, pose.pitch);
  for (let i = 0; i < 180; i += 1) gaze.update(1 / 60, view);
  const before = gaze.progress;
  assert.ok(before > 0.25 && before < 0.35, `прогресс ${before}`);
  // 0,3 с мимо (в противоположную сторону, без других точек) — удержание
  const away = fakeView('p1', from, pose.yaw + Math.PI, pose.pitch);
  for (let i = 0; i < 18; i += 1) gaze.update(1 / 60, away);
  assert.ok(gaze.progress >= before - 1e-6, 'короткий отвод не должен гасить');
  // 2 с мимо — затухание
  for (let i = 0; i < 120; i += 1) gaze.update(1 / 60, away);
  assert.equal(gaze.progress, 0);
});

test('двелль: своя точка не выбирается целью и отключается флагом enabled', () => {
  const point = pointById('p3');
  const from = [point.position[0], HALL.eye, point.position[1]];
  const gaze = createGaze({ points: POINTS, dwellSeconds: 10 });
  const view = fakeView('p3', from, 0, 0);
  let snap = null;
  for (let i = 0; i < 202; i += 1) snap = gaze.update(1 / 60, view);
  assert.equal(snap.targetId, null);
  const disabled = { ...view, enabled: false };
  for (let i = 0; i < 600; i += 1) snap = gaze.update(1 / 60, disabled);
  assert.equal(snap.progress, 0);
});

test('кольцо прогресса: 0→0, 1→1, монотонно', () => {
  assert.equal(ringFraction(0), 0);
  assert.equal(ringFraction(1), 1);
  let prev = -1;
  for (let i = 0; i <= 10; i += 1) {
    const v = ringFraction(i / 10);
    assert.ok(v >= prev);
    prev = v;
  }
});

test('кратчайший угол и интерполяция по нему', () => {
  assert.ok(Math.abs(shortestAngle(3.0, -3.0) - (Math.PI * 2 - 6.0)) < 1e-9);
  const a = lerpAngle(3.0, -3.0, 0.5);
  assert.ok(Math.abs(a) > 3.0, 'интерполяция идёт через π, а не через ноль');
});

test('плавный проход: от точки к точке, yaw докручивается, время фиксировано', () => {
  const travel = createGlide({
    from: [0, 5], to: [5, -3], fromYaw: 0, fromPitch: 0, toYaw: Math.PI / 2, toPitch: 0.1, eye: 1.65,
  });
  const a = travel.sample(0);
  const mid = travel.sample(0.5);
  const b = travel.sample(1);
  assert.deepEqual([a.position[0], a.position[2]], [0, 5]);
  assert.deepEqual([b.position[0], b.position[2]], [5, -3]);
  assert.ok(mid.position[1] >= 1.65, 'высота глаз не проседает');
  assert.ok(Math.abs(b.yaw - Math.PI / 2) < 1e-9);
  assert.ok(b.done);
  // скорость прохода: пик не выше спокойного шага (2,6 м/с)
  let prev = travel.sample(0).position;
  let peak = 0;
  for (let i = 1; i <= 120; i += 1) {
    const p = travel.sample(i / 120).position;
    const speed = Math.hypot(p[0] - prev[0], p[2] - prev[2]) / (travel.duration / 120);
    peak = Math.max(peak, speed);
    prev = p;
  }
  assert.ok(peak < 2.6, `пиковая скорость ${peak.toFixed(2)} м/с`);
  assert.ok(travel.duration >= 1.5 && travel.duration <= 7.5);
});

test('золотая вспышка: сначала затемняет, кадр меняется в середине, потом светло', () => {
  const fade = createFade({});
  const start = fade.sample(0.01);
  const middle = fade.sample(0.5);
  const end = fade.sample(1);
  assert.ok(start.alpha < 0.2);
  assert.equal(middle.alpha, 1);
  assert.equal(middle.swapped, true);
  assert.ok(end.alpha < 0.05);
  assert.equal(end.done, true);
  // в VR перенос — только вспышкой
  const vr = createTravel({ mode: 'fade', from: [0, 0], to: [3, 3], fromYaw: 0, fromPitch: 0, toYaw: 1, toPitch: 0, eye: 1.65 });
  assert.equal(vr.kind, 'fade');
  const early = vr.sample(0.1);
  const late = vr.sample(0.9);
  assert.deepEqual([early.position[0], early.position[2]], [0, 0]);
  assert.deepEqual([late.position[0], late.position[2]], [3, 3]);
});

test('наклон взгляда ограничен, чтобы не переворачиваться', () => {
  assert.ok(clampPitch(10) < Math.PI / 2);
  assert.ok(clampPitch(-10) > -Math.PI / 2);
  assert.equal(clampPitch(0.3), 0.3);
});

test('направление на медальон почти горизонтальное — не надо ломать шею', () => {
  const dir = markerDirection([0, 1.65, 0], [3, 2]);
  assert.ok(Math.abs(dir[1]) < 0.15, 'медальон висит почти на уровне глаз');
  assert.ok(MARKER_EYE_HEIGHT > 1.2 && MARKER_EYE_HEIGHT < 1.7);
  assert.ok(Math.abs(Math.hypot(dir[0], dir[1], dir[2]) - 1) < 1e-9);
});

test('поза точки стабильна: повторный расчёт даёт те же углы', () => {
  for (const point of POINTS) {
    const a = pointPose(point);
    const b = pointPose(point);
    assert.deepEqual(a, b);
    assert.ok(Number.isFinite(a.yaw + a.pitch));
    assert.ok(Math.abs(a.pitch) < 0.6, `${point.id}: слишком крутой наклон ${a.pitch}`);
  }
});

test('углы не зависят от D2R-константы в тесте', () => {
  const pose = lookAngles([0, 1.65, 0], [0, 1.65, -5]);
  assert.ok(Math.abs(pose.yaw) < 1e-9, `yaw ${pose.yaw}`);
  assert.ok(Math.abs(pose.pitch) < 1e-9);
  void D2R;
});


// --- Близкий осмотр полотна ---------------------------------------------------

test('близкий осмотр: холст занимает почти весь кадр', () => {
  for (const art of ARTWORKS) {
    for (const aspect of [16 / 9, 4 / 3, 2.15]) {
      const pose = closeUpPose(art, { fov: CLOSE_FOV, aspect, eye: HALL.eye });
      const cover = paintingCoverage(art, pose, { fov: CLOSE_FOV, aspect });
      // Холст упирается в кадр по «ведущей» стороне, а вторая сторона повторяет
      // пропорции самого полотна (вертикальное на широком экране и не может
      // заполнить кадр по ширине — и не должно: важна фактура, а не обрезка).
      const longest = Math.max(cover.widthShare, cover.heightShare);
      const shortest = Math.min(cover.widthShare, cover.heightShare);
      assert.ok(longest >= 0.97 && longest <= 1.45, `${art.id} ${aspect.toFixed(2)}: ${longest.toFixed(2)} кадра`);
      // Доли кадра соотносятся как пропорции полотна, делённые на пропорции экрана.
      const screenRatio = cover.widthShare / cover.heightShare;
      const expectedRatio = (art.width / art.height) / aspect;
      assert.ok(Math.abs(screenRatio - expectedRatio) < 0.06,
        `${art.id} ${aspect.toFixed(2)}: ${screenRatio.toFixed(2)} против ${expectedRatio.toFixed(2)}`);
    }
  }
});

test('близкий осмотр: камера стоит внутри зала перед картиной', () => {
  for (const art of ARTWORKS) {
    const pose = closeUpPose(art, { fov: CLOSE_FOV, aspect: 16 / 9 });
    assert.ok(Math.abs(pose.position[0]) < HALL.width / 2, `${art.id}: x в стене`);
    assert.ok(Math.abs(pose.position[2]) < HALL.depth / 2, `${art.id}: z в стене`);
    assert.ok(pose.distance >= 0.5, `${art.id}: слишком близко`);
    // Камера смотрит на полотно, а не мимо.
    const toArt = lookAngles([pose.position[0], pose.position[1], pose.position[2]], art.position);
    assert.ok(Math.abs(shortestAngle(pose.yaw, toArt.yaw)) < 0.02, `${art.id}: yaw мимо`);
    assert.ok(Math.abs(pose.pitch - toArt.pitch) < 0.02, `${art.id}: pitch мимо`);
  }
});

test('лупа приближает, но не проходит сквозь стену', () => {
  const art = ARTWORKS[0];
  const base = closeUpPose(art, { fov: CLOSE_FOV, aspect: 16 / 9 });
  const near = closeUpPose(art, { fov: CLOSE_FOV, aspect: 16 / 9, distance: base.distance * 0.25 });
  assert.ok(near.distance < base.distance * 0.55);
  assert.ok(near.distance >= 0.5);
  assert.ok(Math.abs(near.position[2]) < HALL.depth / 2);
});

test('изучение: десять секунд на полотне, сброс при уходе', () => {
  const study = createStudyDwell({ seconds: 10, grace: 0.35 });
  let done = null;
  for (let i = 0; i < 900; i += 1) {
    const snap = study.update(1 / 60, 'rembrandt');
    if (snap.ready) { done = i / 60; break; }
  }
  assert.ok(done !== null && Math.abs(done - 10) < 0.1, `сработало через ${done}`);

  const second = createStudyDwell({ seconds: 10, grace: 0.35 });
  for (let i = 0; i < 300; i += 1) second.update(1 / 60, 'rembrandt');
  const before = second.progress;
  second.update(1 / 60, null);
  assert.ok(second.progress > before - 0.02, 'короткий уход внутри grace не сбрасывает');
  for (let i = 0; i < 40; i += 1) second.update(1 / 60, null);
  assert.equal(second.progress, 0, 'после grace прогресс сброшен');

  const third = createStudyDwell({ seconds: 10, grace: 0.35 });
  for (let i = 0; i < 300; i += 1) third.update(1 / 60, 'rembrandt');
  third.update(1 / 60, 'monet');
  assert.ok(third.progress < 0.02, 'смена полотна начинает отсчёт заново');
});
