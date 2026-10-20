// fusionunit.mjs — чистая математика src/fusionlook.js без браузера.
// Запуск: node tests/tools/fusionunit.mjs
import { FusionLook, FUSION_VALID_MAX_RATE, FUSION_CAMERA_YAW_RATE } from '../../src/fusionlook.js';

const DT = 1 / 60;
const DEG = Math.PI / 180;
let passed = 0;
let failed = 0;
const check = (name, cond, detail = '') => {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name} ${detail}`); }
};
const sample = (yawDeg, pitchDeg, status) => ({ yaw: yawDeg * DEG, pitch: pitchDeg * DEG, status });
const run = (seconds, step) => {
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n; i++) step(i * DT);
};

console.log('1) Гироскоп один: приращения и статус');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(0, 0);
  let status = f.update(DT, { yaw: 0, pitch: 0 }, null);
  run(0.5, (t) => { status = f.update(DT, { yaw: t, pitch: -t * 0.4 }, null); });
  check('yaw ≈ +0.5 рад', Math.abs(f.yaw - 0.5) < 0.03, `yaw=${f.yaw}`);
  check('pitch ≈ -0.2 рад', Math.abs(f.pitch + 0.2) < 0.02, `pitch=${f.pitch}`);
  check('статус fusion-gyro', status === 'fusion-gyro', status);
}

console.log('2) Первое чтение после reset не даёт скачка');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(0.2, 0.1);
  f.update(DT, { yaw: 2.9, pitch: -1.2 }, null);
  check('взгляд остался на месте reset', Math.abs(f.yaw - 0.2) < 1e-9 && Math.abs(f.pitch - 0.1) < 1e-9);
  f.update(DT, { yaw: 3.0, pitch: -1.2 }, null);
  check('дальше идут только приращения', Math.abs(f.yaw - 0.3) < 1e-9, `yaw=${f.yaw}`);
}

console.log('3) Пара меток valid медленно возвращает центр');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(30 * DEG, 0);
  const raw = { yaw: 0.7, pitch: 0 };
  f.update(DT, raw, null);
  let maxStep = 0;
  let prev = f.yaw;
  let mono = true;
  const stepCorrection = () => {
    f.update(DT, raw, sample(0, 0, 'valid'));
    maxStep = Math.max(maxStep, Math.abs(f.yaw - prev));
    if (f.yaw > prev + 1e-12) mono = false;
    prev = f.yaw;
  };
  run(3, stepCorrection);
  check('ошибка < 10° через 3 с', Math.abs(f.yaw) < 10 * DEG, `yaw=${f.yaw / DEG}°`);
  run(2.5, stepCorrection);
  check('ошибка < 3° через 5.5 с', Math.abs(f.yaw) < 3 * DEG, `yaw=${f.yaw / DEG}°`);
  check('коррекция монотонна', mono);
  check('скорость коррекции не выше потолка', maxStep <= FUSION_VALID_MAX_RATE * DT + 1e-9);
  check('статус fusion', f.status === 'fusion', f.status);
}

console.log('4) held не якорит при живом гироскопе; single мягче valid');
{
  const mk = () => {
    const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
    f.reset(20 * DEG, 0);
    f.update(DT, { yaw: 0, pitch: 0 }, null);
    return f;
  };
  const fh = mk();
  run(2, () => fh.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, 'held')));
  check('held не тронул центр', Math.abs(fh.yaw - 20 * DEG) < 1e-9);
  check('held + гироскоп = fusion-gyro', fh.status === 'fusion-gyro', fh.status);
  const fv = mk();
  const fs = mk();
  run(1, () => fv.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, 'valid')));
  run(1, () => fs.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, 'single')));
  check('single правит меньше valid', Math.abs(fs.yaw) > Math.abs(fv.yaw));
  check('single всё же правит', Math.abs(fs.yaw) < 20 * DEG);
}

console.log('5) Потеря гироскопа: удержание, потом камера без телепорта');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(0, 0);
  f.update(DT, { yaw: 1, pitch: 0 }, null);
  f.update(DT, { yaw: 1.2, pitch: 0 }, null);
  const st = f.update(DT, null, sample(-10, 5, 'valid'));
  check('первый кадр без гироскопа — fusion-wait', st === 'fusion-wait', st);
  check('взгляд не прыгнул к камере', Math.abs(f.yaw - 0.2) < 1e-9 && f.pitch === 0);
  let prevYaw = f.yaw;
  let maxStep = 0;
  run(1.5, () => {
    f.update(DT, null, sample(-10, 5, 'valid'));
    maxStep = Math.max(maxStep, Math.abs(f.yaw - prevYaw));
    prevYaw = f.yaw;
  });
  check('после грейса — fusion-camera', f.status === 'fusion-camera', f.status);
  check('камера довела взгляд к замеру', Math.abs(f.yaw + 10 * DEG) < DEG && Math.abs(f.pitch - 5 * DEG) < DEG);
  check('скорость camera-follow ограничена', maxStep <= FUSION_CAMERA_YAW_RATE * DT + 1e-9);
}

console.log('6) Лимиты Candy: yaw ±80°, pitch ±20°');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(0, 0);
  f.update(DT, { yaw: 0, pitch: 0 }, null);
  for (let a = 0.25; a <= 3.001; a += 0.25) f.update(DT, { yaw: a, pitch: Math.min(2, a) }, null);
  check('yaw зажат на +80°', Math.abs(f.yaw - f.yawLimit) < 1e-9, `yaw=${f.yaw / DEG}°`);
  check('pitch зажат на +20°', Math.abs(f.pitch - f.pitchMax) < 1e-9, `pitch=${f.pitch / DEG}°`);
  f.update(DT, { yaw: 2.8, pitch: 2 }, null);
  check('от yaw-края уходит сразу', Math.abs(f.yaw - (f.yawLimit - 0.2)) < 1e-9);
}

console.log('7) Выброс гироскопа и перебазирование');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(0, 0);
  f.update(DT, { yaw: 0, pitch: 0 }, null);
  f.update(DT, { yaw: 0.2, pitch: 0 }, null);
  f.update(DT, { yaw: 2.2, pitch: 1.5 }, null);
  check('одиночный выброс не двинул взгляд', Math.abs(f.yaw - 0.2) < 1e-9 && f.pitch === 0);
  check('выброс записан', f.diagnostics.gyroJumps === 1);
  f.update(DT, { yaw: 0.25, pitch: 0 }, null);
  check('вернувшееся сырьё продолжает старую базу', Math.abs(f.yaw - 0.25) < 1e-9);
  f.update(DT, { yaw: 2.25, pitch: 0 }, null);
  f.update(DT, { yaw: 2.3, pitch: 0 }, null);
  f.update(DT, { yaw: 2.35, pitch: 0 }, null);
  check('устойчивое сырьё стало базой без телепорта', Math.abs(f.yaw - 0.25) < 1e-9);
  check('перебазирование записано', f.diagnostics.gyroRebases === 1);
}

console.log('8) Ложный далёкий якорь подтверждается во времени');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(0, 0);
  const raw = { yaw: 0, pitch: 0 };
  f.update(DT, raw, sample(0, 0, 'valid'));
  run(0.15, () => f.update(DT, raw, sample(40, 0, 'valid')));
  check('короткий ложный замер не двинул взгляд', Math.abs(f.yaw) < 0.1 * DEG);
  check('во время проверки ведёт гироскоп', f.status === 'fusion-gyro', f.status);
  run(0.5, () => f.update(DT, raw, sample(40, 0, 'valid')));
  check('устойчивый замер после подтверждения начинает править', f.yaw > 0.4 * DEG && f.yaw < 3 * DEG, `yaw=${f.yaw / DEG}°`);
  check('после подтверждения статус fusion', f.status === 'fusion', f.status);
}

console.log('9) Далёкий held не ведёт при мёртвом гироскопе');
{
  const f = new FusionLook({ yawLimitDeg: 80, pitchMinDeg: -20, pitchMaxDeg: 20 });
  f.reset(25 * DEG, 0);
  const raw = { yaw: 0, pitch: 0 };
  f.update(DT, raw, sample(25, 0, 'valid'));
  run(2, () => f.update(DT, null, sample(0, 0, 'held')));
  check('held=0 отвергнут', Math.abs(f.yaw - 25 * DEG) < 0.1 * DEG);
  check('статус fusion-wait', f.status === 'fusion-wait', f.status);
  run(0.5, () => f.update(DT, null, sample(20, 0, 'held')));
  check('близкий held может вести после грейса', f.status === 'fusion-camera' && f.yaw < 24 * DEG);
}

console.log(`\nИтог: ${passed} ✅ / ${failed} ❌`);
process.exit(failed ? 1 : 0);
