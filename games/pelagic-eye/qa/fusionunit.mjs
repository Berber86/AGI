// fusionunit.mjs — юнит-тесты гибридного взгляда (src/game/fusionLook.ts).
// Чистая математика без браузера: компилируем один модуль локальным tsc во
// временную папку и гоняем сценарии покадрово (dt = 1/60).
// Запуск: node qa/fusionunit.mjs   (нужен установленный node_modules)
import { execFileSync } from "node:child_process";
import { mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = mkdtempSync(join(tmpdir(), "fusion-unit-"));
execFileSync(
  join(root, "node_modules/.bin/tsc"),
  ["src/game/fusionLook.ts", "--target", "es2022", "--module", "es2022", "--skipLibCheck", "--outDir", out],
  { cwd: root, stdio: "inherit" }
);
// tsc вычисляет общий корень программы (src/), поэтому файл может лечь
// как в out/, так и в out/game/ — ищем оба варианта.
const compiled = [join(out, "fusionLook.js"), join(out, "game/fusionLook.js")].find((p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
});
if (!compiled) throw new Error(`fusionLook.js не найден в ${out}`);
const { FusionLook, FUSION_YAW_LIMIT, FUSION_VALID_MAX_RATE, FUSION_CAMERA_YAW_RATE } = await import(pathToFileURL(compiled).href);

const DT = 1 / 60;
const DEG = Math.PI / 180;
let passed = 0;
let failed = 0;
const check = (name, cond, detail = "") => {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name} ${detail}`);
  }
};
const sample = (yawDeg, pitchDeg, status) => ({ yaw: yawDeg * DEG, pitch: pitchDeg * DEG, status, marker: null, ts: 0 });
const run = (f, seconds, step) => {
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n; i++) step(i * DT);
};

console.log("1) Гироскоп один: приращения интегрируются, статус fusion-gyro");
{
  const f = new FusionLook();
  f.reset(0, 0);
  let status = f.update(DT, { yaw: 0, pitch: 0 }, null); // первое чтение — база
  run(f, 0.5, (t) => {
    status = f.update(DT, { yaw: t * 1.0, pitch: -t * 0.4 }, null); // 1 рад/с вправо
  });
  check("yaw ушёл на ~0.5 рад", Math.abs(f.yaw - 0.5) < 0.03, `yaw=${f.yaw}`);
  check("pitch ушёл на ~-0.2 рад", Math.abs(f.pitch + 0.2) < 0.02, `pitch=${f.pitch}`);
  check("статус fusion-gyro", status === "fusion-gyro", status);
}

console.log("2) Первое чтение после reset не даёт скачка (чужая база гироскопа)");
{
  const f = new FusionLook();
  f.reset(0.2, 0.1);
  f.update(DT, { yaw: 2.9, pitch: -1.2 }, null);
  check("взгляд остался на месте reset", Math.abs(f.yaw - 0.2) < 1e-9 && Math.abs(f.pitch - 0.1) < 1e-9, `${f.yaw},${f.pitch}`);
  f.update(DT, { yaw: 3.0, pitch: -1.2 }, null);
  check("дальше идут только приращения", Math.abs(f.yaw - 0.3) < 1e-9, `yaw=${f.yaw}`);
}

console.log("3) Дрейф: пара меток (valid) медленно возвращает центр, без рывков");
{
  const f = new FusionLook();
  f.reset(30 * DEG, 0); // гироскоп «уехал» на 30°, голова неподвижна
  const raw = { yaw: 0.7, pitch: 0 };
  f.update(DT, raw, null);
  let maxStep = 0;
  let prev = f.yaw;
  let mono = true;
  const stepCorrection = () => {
    f.update(DT, raw, sample(0, 0, "valid"));
    maxStep = Math.max(maxStep, Math.abs(f.yaw - prev));
    if (f.yaw > prev + 1e-12) mono = false;
    prev = f.yaw;
  };
  run(f, 3, stepCorrection);
  check("ошибка < 10° через 3 с (потолок 8°/с честно работает)", Math.abs(f.yaw) < 10 * DEG, `yaw=${(f.yaw / DEG).toFixed(2)}°`);
  run(f, 2.5, stepCorrection);
  check("ошибка < 3° через 5.5 с", Math.abs(f.yaw) < 3 * DEG, `yaw=${(f.yaw / DEG).toFixed(2)}°`);
  check("коррекция монотонна", mono);
  check("скорость коррекции ≤ потолка valid", maxStep <= FUSION_VALID_MAX_RATE * DT + 1e-9, `step=${maxStep}`);
  check("статус fusion", f.status === "fusion", f.status);
}

console.log("4) held/lost НЕ якорят; single правит медленнее, чем valid");
{
  const mk = () => {
    const f = new FusionLook();
    f.reset(20 * DEG, 0);
    f.update(DT, { yaw: 0, pitch: 0 }, null);
    return f;
  };
  const fh = mk();
  run(fh, 2, () => fh.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, "held")));
  check("held: центр не тронут", Math.abs(fh.yaw - 20 * DEG) < 1e-9, `yaw=${fh.yaw}`);
  check("held при живом гироскопе: статус fusion-gyro", fh.status === "fusion-gyro", fh.status);

  const fv = mk();
  const fs = mk();
  run(fv, 1, () => fv.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, "valid")));
  run(fs, 1, () => fs.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, "single")));
  check("single за 1 с правит меньше valid", Math.abs(fs.yaw) > Math.abs(fv.yaw), `single=${fs.yaw} valid=${fv.yaw}`);
  check("но всё же правит", Math.abs(fs.yaw) < 20 * DEG, `yaw=${fs.yaw}`);
}

console.log("5) Гироскоп умер → сначала удержание, потом камера без мгновенного присвоения");
{
  const f = new FusionLook();
  f.reset(0, 0);
  f.update(DT, { yaw: 1.0, pitch: 0 }, null);
  f.update(DT, { yaw: 1.2, pitch: 0 }, null); // fused = 0.2
  const st = f.update(DT, null, sample(-10, 5, "valid"));
  check("первый кадр без гироскопа: fusion-wait", st === "fusion-wait", st);
  check("первый кадр без гироскопа: взгляд НЕ прыгнул к камере", Math.abs(f.yaw - 0.2) < 1e-9 && f.pitch === 0, `${f.yaw},${f.pitch}`);

  let prevYaw = f.yaw;
  let maxStep = 0;
  run(f, 1.5, () => {
    f.update(DT, null, sample(-10, 5, "valid"));
    maxStep = Math.max(maxStep, Math.abs(f.yaw - prevYaw));
    prevYaw = f.yaw;
  });
  check("после грейса статус fusion-camera", f.status === "fusion-camera", f.status);
  check("камера довела взгляд близко к замеру", Math.abs(f.yaw + 10 * DEG) < 1 * DEG && Math.abs(f.pitch - 5 * DEG) < 1 * DEG, `${f.yaw / DEG}°,${f.pitch / DEG}°`);
  check("скорость перехода на камеру ограничена", maxStep <= FUSION_CAMERA_YAW_RATE * DT + 1e-9, `step=${maxStep}`);

  f.update(DT, { yaw: -2.0, pitch: 0.9 }, sample(-10, 5, "valid")); // новая база гироскопа
  check("возврат гироскопа без скачка", Math.abs(f.yaw + 10 * DEG) < 0.5 * DEG, `yaw=${f.yaw / DEG}°`);
  f.update(DT, { yaw: -1.9, pitch: 0.9 }, null);
  check("приращения снова работают", Math.abs(f.yaw - (-10 * DEG + 0.1)) < 1 * DEG, `yaw=${f.yaw / DEG}°`);
}

console.log("6) Нет никого → fusion-wait, взгляд заморожен");
{
  const f = new FusionLook();
  f.reset(0.3, 0.1);
  const st = f.update(DT, null, sample(0, 0, "lost"));
  check("статус fusion-wait", st === "fusion-wait", st);
  check("взгляд стоит", f.yaw === 0.3 && f.pitch === 0.1);
  const st2 = f.update(DT, null, null);
  check("null-замер тоже fusion-wait", st2 === "fusion-wait", st2);
}

console.log("7) Окно пределов: зажим и мгновенный возврат от края");
{
  const f = new FusionLook();
  f.reset(0, 0);
  f.update(DT, { yaw: 0, pitch: 0 }, null);
  // Идём за предел правдоподобными шагами; один шаг на 3 рад теперь обязан
  // отвергаться предохранителем (это проверяет сценарий 10).
  for (let a = 0.25; a <= 3.001; a += 0.25) {
    f.update(DT, { yaw: a, pitch: Math.min(2, a) }, null);
  }
  check("yaw зажат пределом", Math.abs(f.yaw - FUSION_YAW_LIMIT) < 1e-9, `yaw=${f.yaw}`);
  f.update(DT, { yaw: 2.8, pitch: 2.0 }, null); // голова вернулась на 0.2
  check("от края уходим сразу", Math.abs(f.yaw - (FUSION_YAW_LIMIT - 0.2)) < 1e-9, `yaw=${f.yaw}`);
}

console.log("8) Переход сырого yaw через ±π не даёт ложного оборота");
{
  const f = new FusionLook();
  f.reset(0, 0);
  f.update(DT, { yaw: Math.PI - 0.01, pitch: 0 }, null);
  f.update(DT, { yaw: -Math.PI + 0.01, pitch: 0 }, null);
  check("приращение ≈ +0.02, а не −2π", Math.abs(f.yaw - 0.02) < 1e-9, `yaw=${f.yaw}`);
}

console.log("9) Pitch правится мягче yaw при той же ошибке");
{
  const f = new FusionLook();
  f.reset(20 * DEG, 20 * DEG);
  f.update(DT, { yaw: 0, pitch: 0 }, null);
  run(f, 1, () => f.update(DT, { yaw: 0, pitch: 0 }, sample(0, 0, "valid")));
  check("ошибка pitch убыла меньше, чем yaw", Math.abs(f.pitch) > Math.abs(f.yaw), `yaw=${f.yaw / DEG}° pitch=${f.pitch / DEG}°`);
}


console.log("10) Одиночный выброс гироскопа не телепортирует камеру; устойчивый сдвиг — перебазирование");
{
  const f = new FusionLook();
  f.reset(0, 0);
  f.update(DT, { yaw: 0, pitch: 0 }, null);
  f.update(DT, { yaw: 0.2, pitch: 0 }, null);
  check("обычный шаг принят", Math.abs(f.yaw - 0.2) < 1e-9, `yaw=${f.yaw}`);

  f.update(DT, { yaw: 2.2, pitch: 1.5 }, null); // выброс параметризации на ~115°
  check("выброс не двинул взгляд", Math.abs(f.yaw - 0.2) < 1e-9 && f.pitch === 0, `${f.yaw},${f.pitch}`);
  check("выброс записан в диагностику", f.diagnostics.gyroJumps === 1, JSON.stringify(f.diagnostics));

  f.update(DT, { yaw: 0.25, pitch: 0 }, null); // сырьё вернулось
  check("после возврата сырья продолжаем от старой базы", Math.abs(f.yaw - 0.25) < 1e-9, `yaw=${f.yaw}`);

  f.update(DT, { yaw: 2.25, pitch: 0 }, null);
  f.update(DT, { yaw: 2.3, pitch: 0 }, null);
  f.update(DT, { yaw: 2.35, pitch: 0 }, null); // 3 устойчивых кадра = новая база
  check("устойчивая новая база принята без телепорта", Math.abs(f.yaw - 0.25) < 1e-9, `yaw=${f.yaw}`);
  check("перебазирование записано", f.diagnostics.gyroRebases === 1, JSON.stringify(f.diagnostics));
  f.update(DT, { yaw: 2.45, pitch: 0 }, null);
  check("после перебазирования приращения снова работают", Math.abs(f.yaw - 0.35) < 1e-9, `yaw=${f.yaw}`);
}

console.log("11) Ложный блик меток не становится якорем; устойчивый замер подтверждается");
{
  const f = new FusionLook();
  f.reset(0, 0);
  const raw = { yaw: 0, pitch: 0 };
  f.update(DT, raw, sample(0, 0, "valid")); // принятый якорь у нуля

  run(f, 0.15, () => f.update(DT, raw, sample(40, 0, "valid")));
  check("короткий ложный замер не двинул взгляд", Math.abs(f.yaw) < 0.1 * DEG, `yaw=${f.yaw / DEG}°`);
  check("во время блика ведёт гироскоп", f.status === "fusion-gyro", f.status);
  check("скачок якоря записан", f.diagnostics.anchorJumps >= 1, JSON.stringify(f.diagnostics));

  f.update(DT, raw, sample(0, 0, "valid"));
  check("честный замер снова fusion", f.status === "fusion" && Math.abs(f.yaw) < 0.1 * DEG, f.status);

  run(f, 0.5, () => f.update(DT, raw, sample(40, 0, "valid")));
  check("устойчивый далёкий замер после подтверждения начинает править", f.yaw > 0.4 * DEG && f.yaw < 3 * DEG, `yaw=${f.yaw / DEG}°`);
  check("после подтверждения статус fusion", f.status === "fusion", f.status);
}

console.log("12) Короткое молчание гироскопа не бросает взгляд в ноль камеры");
{
  const f = new FusionLook();
  f.reset(25 * DEG, 0);
  const raw = { yaw: 0, pitch: 0 };
  f.update(DT, raw, sample(25, 0, "valid"));
  run(f, 0.3, () => f.update(DT, null, sample(0, 0, "valid")));
  check("за 0.3 с молчания взгляд удержан", Math.abs(f.yaw - 25 * DEG) < 0.1 * DEG, `yaw=${f.yaw / DEG}°`);
  check("статус удержания fusion-wait", f.status === "fusion-wait", f.status);
  f.update(DT, raw, sample(0, 0, "valid"));
  check("вернувшийся гироскоп не получает скачка в ноль", Math.abs(f.yaw - 25 * DEG) < 0.2 * DEG, `yaw=${f.yaw / DEG}°`);
}

console.log("13) Далёкий held (включая ложный ноль драйвера) не ведёт камеру при мёртвом гироскопе");
{
  const f = new FusionLook();
  f.reset(25 * DEG, 0);
  const raw = { yaw: 0, pitch: 0 };
  f.update(DT, raw, sample(25, 0, "valid")); // принятый якорь 25°
  run(f, 2, () => f.update(DT, null, sample(0, 0, "held")));
  check("held=0 отвергнут, взгляд удержан", Math.abs(f.yaw - 25 * DEG) < 0.1 * DEG, `yaw=${f.yaw / DEG}°`);
  check("статус fusion-wait, а не fusion-camera", f.status === "fusion-wait", f.status);
  run(f, 0.5, () => f.update(DT, null, sample(20, 0, "held")));
  check("близкий held может вести после грейса", f.status === "fusion-camera" && f.yaw < 24 * DEG, `${f.status}, yaw=${f.yaw / DEG}°`);
}

console.log(`\nИтог: ${passed} ✅ / ${failed} ❌`);
process.exit(failed ? 1 : 0);
