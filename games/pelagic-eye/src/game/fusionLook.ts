// fusionLook.ts — гибридный источник взгляда «гироскоп ведёт, камера правит».
//
// КОНТРАКТ РЕЖИМА (отдельный, 4-й источник взгляда; остальные три не трогает):
// - Кадр к кадру взгляд ведут ПРИРАЩЕНИЯ гироскопа (deviceorientation, ~60 Гц):
//   быстро, плавно, без задержки анализа камеры (~10 Гц).
// - Абсолютный центр (прежде всего yaw, который у IMU дрейфует) медленно
//   правит камера-метка: только доказанные измерения — пара меток (`valid`,
//   полная скорость коррекции) и одиночная (`single`, втрое медленнее).
//   `held` — экстраполяция драйвера, а не измерение: якорем не служит.
// - Pitch правится вдвое мягче: внутри deviceorientation его и так держит
//   гравитация, камера лишь снимает ошибку начальной базы гироскопа.
// - Коррекция ограничена по скорости (valid ≈ 8°/с, single ≈ 3°/с), чтобы мир
//   не «плыл» заметно, когда голова неподвижна.
// - Фолбэки честные и видимые по статусу: меток нет → `fusion-gyro`
//   (взгляд едет по гироскопу, центр может дрейфовать); гироскоп молчит →
//   `fusion-camera` (ведёт камера, как в чистом камерном режиме); нет никого →
//   `fusion-wait` (взгляд стоит). Тихой подмены источника нет.
// - Пределы взгляда — камерные: yaw ±1.35 рад, pitch −0.46..0.96 рад.
//
// Модуль чистый (без THREE и DOM): юнит-тесты — qa/fusionunit.mjs.
import type { GazeSample } from "../lib/markerDriver";

export type FusionStatus = "fusion" | "fusion-gyro" | "fusion-camera" | "fusion-wait";

export const FUSION_YAW_LIMIT = 1.35;
export const FUSION_PITCH_MIN = -0.46;
export const FUSION_PITCH_MAX = 0.96;

/** Скорости экспоненциального подхода к якорю, 1/с. */
export const FUSION_VALID_K = 1.5;
export const FUSION_SINGLE_K = 0.5;
/** Потолки скорости коррекции yaw, рад/с (≈8°/с и ≈3°/с). */
export const FUSION_VALID_MAX_RATE = 0.14;
export const FUSION_SINGLE_MAX_RATE = 0.05;
/** Pitch правим вдвое медленнее yaw: гравитация его уже держит. */
export const FUSION_PITCH_RATE_SCALE = 0.5;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const wrapPi = (v: number) => {
  let x = v;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
};

export class FusionLook {
  yaw = 0;
  pitch = 0;
  status: FusionStatus = "fusion-wait";
  private lastRaw: { yaw: number; pitch: number } | null = null;

  /** Бесшовный старт от текущего взгляда игры; сырой гироскоп забывается. */
  reset(yaw: number, pitch: number) {
    this.yaw = clamp(yaw, -FUSION_YAW_LIMIT, FUSION_YAW_LIMIT);
    this.pitch = clamp(pitch, FUSION_PITCH_MIN, FUSION_PITCH_MAX);
    this.lastRaw = null;
    this.status = "fusion-wait";
  }

  /**
   * Забыть последнее сырое чтение гироскопа (перебазирование датчика):
   * следующее чтение станет новой точкой отсчёта без скачка взгляда.
   */
  forgetGyro() {
    this.lastRaw = null;
  }

  /**
   * Один шаг слияния.
   * @param dt секунды с прошлого кадра (внутри ограничивается 0.1 с).
   * @param gyroRaw НЕзажатые yaw/pitch гироскопа в игровых координатах взгляда
   *   (те же знаки и смысл, что у GazeSample) или null, если датчик молчит.
   * @param sample последний замер камеры-метки или null.
   */
  update(dt: number, gyroRaw: { yaw: number; pitch: number } | null, sample: GazeSample | null): FusionStatus {
    const step = clamp(dt, 0, 0.1);
    const anchor = sample && (sample.status === "valid" || sample.status === "single") ? sample : null;

    if (gyroRaw) {
      if (this.lastRaw) {
        this.yaw += wrapPi(gyroRaw.yaw - this.lastRaw.yaw);
        this.pitch += gyroRaw.pitch - this.lastRaw.pitch;
      }
      this.lastRaw = { yaw: gyroRaw.yaw, pitch: gyroRaw.pitch };
      if (anchor) {
        this.correct(anchor, step);
        this.status = "fusion";
      } else {
        this.status = "fusion-gyro";
      }
    } else if (anchor || (sample && sample.status === "held")) {
      // Гироскоп молчит: ведёт камера напрямую (как чистый камерный режим).
      // Состояние слияния держим равным замеру, чтобы вернувшийся гироскоп
      // продолжил с этого места, а не прыгнул.
      const s = anchor ?? (sample as GazeSample);
      this.yaw = s.yaw;
      this.pitch = s.pitch;
      this.lastRaw = null;
      this.status = "fusion-camera";
    } else {
      this.lastRaw = null;
      this.status = "fusion-wait";
    }

    // Зажим «окном»: приращения за пределом теряются, но lastRaw уже ушёл
    // дальше — вернувшаяся голова сразу уводит взгляд от края обратно.
    this.yaw = clamp(this.yaw, -FUSION_YAW_LIMIT, FUSION_YAW_LIMIT);
    this.pitch = clamp(this.pitch, FUSION_PITCH_MIN, FUSION_PITCH_MAX);
    return this.status;
  }

  /** Медленная коррекция к доказанному замеру камеры (комплементарный фильтр). */
  private correct(sample: GazeSample, dt: number) {
    if (dt <= 0) return;
    const valid = sample.status === "valid";
    const k = valid ? FUSION_VALID_K : FUSION_SINGLE_K;
    const maxRate = valid ? FUSION_VALID_MAX_RATE : FUSION_SINGLE_MAX_RATE;
    const a = 1 - Math.exp(-k * dt);

    const dyaw = clamp(wrapPi(sample.yaw - this.yaw) * a, -maxRate * dt, maxRate * dt);
    this.yaw += dyaw;

    const pitchRate = maxRate * FUSION_PITCH_RATE_SCALE;
    const dpitch = clamp((sample.pitch - this.pitch) * a, -pitchRate * dt, pitchRate * dt);
    this.pitch += dpitch;
  }
}
