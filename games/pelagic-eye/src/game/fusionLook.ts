// fusionLook.ts — гибридный источник взгляда «гироскоп ведёт, камера правит».
//
// КОНТРАКТ РЕЖИМА (отдельный, 4-й источник взгляда; остальные три не трогает):
// - Кадр к кадру взгляд ведут ПРИРАЩЕНИЯ гироскопа (deviceorientation):
//   быстро, плавно, без задержки анализа камеры (~10 Гц).
// - Абсолютный центр (прежде всего yaw, который у IMU дрейфует) медленно
//   правит камера-метка: только доказанные измерения — пара меток (`valid`,
//   полная скорость коррекции) и одиночная (`single`, втрое медленнее).
//   `held` — экстраполяция драйвера, а не измерение: якорем не служит.
// - Pitch правится вдвое мягче: внутри deviceorientation его и так держит
//   гравитация, камера лишь снимает ошибку начальной базы гироскопа.
// - Коррекция ограничена по скорости (valid ≈ 8°/с, single ≈ 3°/с), чтобы мир
//   не «плыл» заметно, когда голова неподвижна.
//
// ЗАЩИТА ОТ ТЕЛЕПОРТОВ (полевой дефект: редкие молниеносные броски камеры):
// - Физически невозможное приращение гироскопа за один кадр не интегрируется.
//   Одиночный выброс игнорируется; устойчивое новое сырьё после подтверждения
//   считается перебазированием датчика, а не движением головы.
// - Внезапно ушедший замер меток становится якорем только после короткого
//   подтверждения во времени. Один ложный кадр не тянет взгляд за собой.
// - Краткое молчание гироскопа не отдаёт взгляд камере: сначала взгляд
//   удерживается. После подтверждённой потери датчика камера ведёт с
//   ограниченной скоростью, а не мгновенным присвоением своего угла.
//
// - Фолбэки видимые по статусу: нет подтверждённого якоря → `fusion-gyro`;
//   гироскоп устойчиво молчит и камеру можно вести → `fusion-camera`;
//   переход/нет trustworthy-данных → `fusion-wait`. Тихой подмены нет.
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

/** Предохранитель гироскопа: правдоподобная скорость головы и подтверждение скачка. */
export const FUSION_GYRO_MAX_RATE = 9; // рад/с
export const FUSION_GYRO_MIN_STEP = 0.3; // рад за кадр даже при dt≈0
export const FUSION_GYRO_MAX_STEP = 0.75; // рад за кадр при длинном dt
export const FUSION_GYRO_CONFIRM_FRAMES = 3;

/** Внезапный якорь меток подтверждается, прежде чем ему разрешат править центр. */
export const FUSION_ANCHOR_JUMP_YAW = (20 * Math.PI) / 180;
export const FUSION_ANCHOR_JUMP_PITCH = (15 * Math.PI) / 180;
export const FUSION_ANCHOR_MATCH = (6 * Math.PI) / 180;
export const FUSION_ANCHOR_CONFIRM_SEC = 0.35;
export const FUSION_ANCHOR_STALE_SEC = 3;

/** Потеря гироскопа: сначала удержание, затем камера с ограниченной скоростью. */
export const FUSION_GYRO_LOSS_GRACE_SEC = 0.6;
export const FUSION_CAMERA_FOLLOW_K = 7;
export const FUSION_CAMERA_YAW_RATE = 1.2; // рад/с
export const FUSION_CAMERA_PITCH_RATE = 0.8; // рад/с
export const FUSION_HELD_MATCH = (12 * Math.PI) / 180;

type YawPitch = { yaw: number; pitch: number };

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
  /** Диагностика предохранителей для QA и полевых отчётов. */
  readonly diagnostics = {
    gyroJumps: 0,
    gyroRebases: 0,
    anchorJumps: 0,
  };

  private lastRaw: YawPitch | null = null;
  private pendingRaw: YawPitch | null = null;
  private pendingGyroFrames = 0;
  private gyroMissingSec = 0;

  private anchorTrack: YawPitch | null = null;
  private anchorCandidate: YawPitch | null = null;
  private anchorCandidateAgeSec = 0;
  private anchorMissingSec = 0;

  /** Бесшовный старт от текущего взгляда игры; сырой гироскоп забывается. */
  reset(yaw: number, pitch: number) {
    this.yaw = clamp(yaw, -FUSION_YAW_LIMIT, FUSION_YAW_LIMIT);
    this.pitch = clamp(pitch, FUSION_PITCH_MIN, FUSION_PITCH_MAX);
    this.lastRaw = null;
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
    this.anchorTrack = null;
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    this.anchorMissingSec = 0;
    this.diagnostics.gyroJumps = 0;
    this.diagnostics.gyroRebases = 0;
    this.diagnostics.anchorJumps = 0;
    this.status = "fusion-wait";
  }

  /**
   * Забыть последнее сырое чтение гироскопа (перебазирование датчика):
   * следующее чтение станет новой точкой отсчёта без скачка взгляда.
   */
  forgetGyro() {
    this.lastRaw = null;
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
  }

  /**
   * Один шаг слияния.
   * @param dt секунды с прошлого кадра (внутри ограничивается 0.1 с).
   * @param gyroRaw НЕзажатые yaw/pitch гироскопа в игровых координатах взгляда
   *   (те же знаки и смысл, что у GazeSample) или null, если датчик молчит.
   * @param sample последний замер камеры-метки или null.
   */
  update(dt: number, gyroRaw: YawPitch | null, sample: GazeSample | null): FusionStatus {
    const step = clamp(dt, 0, 0.1);
    const rawAnchor = sample && (sample.status === "valid" || sample.status === "single") ? sample : null;

    if (gyroRaw) {
      this.gyroMissingSec = 0;
      this.integrateGyro(gyroRaw, step);
    } else {
      this.lastRaw = null;
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      this.gyroMissingSec += step;
    }

    // Якорь проверяем после интеграции гироскопа: быстрый честный поворот
    // головы уже отражён в оценке и не выглядит «ложным скачком» камеры.
    const trustedAnchor = rawAnchor ? this.gateAnchor(rawAnchor, step) : null;
    if (rawAnchor) {
      this.anchorMissingSec = 0;
    } else {
      this.anchorMissingSec += step;
      if (this.anchorMissingSec > FUSION_ANCHOR_STALE_SEC) {
        this.anchorTrack = null;
        this.anchorCandidate = null;
        this.anchorCandidateAgeSec = 0;
      }
    }

    if (gyroRaw) {
      if (trustedAnchor) {
        this.correct(trustedAnchor, step);
        this.status = "fusion";
      } else {
        this.status = "fusion-gyro";
      }
    } else if (this.gyroMissingSec <= FUSION_GYRO_LOSS_GRACE_SEC) {
      // Короткая пауза событий датчика — ещё не повод бросать взгляд к
      // текущему замеру камеры. Удерживаем последнюю оценку.
      this.status = "fusion-wait";
    } else if (trustedAnchor) {
      this.followCamera(trustedAnchor, step);
      this.status = "fusion-camera";
    } else if (sample && sample.status === "held" && this.heldTrusted(sample)) {
      this.followCamera(sample, step);
      this.status = "fusion-camera";
    } else {
      this.status = "fusion-wait";
    }

    // Зажим «окном»: приращения за пределом теряются, но lastRaw уже ушёл
    // дальше — вернувшаяся голова сразу уводит взгляд от края обратно.
    this.yaw = clamp(this.yaw, -FUSION_YAW_LIMIT, FUSION_YAW_LIMIT);
    this.pitch = clamp(this.pitch, FUSION_PITCH_MIN, FUSION_PITCH_MAX);
    return this.status;
  }

  /**
   * Интеграция приращения с предохранителем от разрывов параметризации.
   * Подозрительный скачок не двигает взгляд: если сырьё вернулось, следующий
   * обычный шаг продолжится от старого lastRaw; если новое сырьё устойчиво,
   * оно станет новой базой без телепорта камеры.
   */
  private integrateGyro(raw: YawPitch, step: number) {
    if (!this.lastRaw) {
      this.lastRaw = { ...raw };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      return;
    }

    const dYaw = wrapPi(raw.yaw - this.lastRaw.yaw);
    const dPitch = raw.pitch - this.lastRaw.pitch;
    const maxStep = clamp(
      FUSION_GYRO_MAX_RATE * Math.max(step, 1 / 60),
      FUSION_GYRO_MIN_STEP,
      FUSION_GYRO_MAX_STEP
    );

    if (Math.abs(dYaw) <= maxStep && Math.abs(dPitch) <= maxStep) {
      this.yaw += dYaw;
      this.pitch += dPitch;
      this.lastRaw = { ...raw };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      return;
    }

    if (
      this.pendingRaw &&
      Math.abs(wrapPi(raw.yaw - this.pendingRaw.yaw)) <= maxStep &&
      Math.abs(raw.pitch - this.pendingRaw.pitch) <= maxStep
    ) {
      this.pendingGyroFrames += 1;
    } else {
      this.pendingGyroFrames = 1;
      this.diagnostics.gyroJumps += 1;
    }
    this.pendingRaw = { ...raw };

    if (this.pendingGyroFrames >= FUSION_GYRO_CONFIRM_FRAMES) {
      this.lastRaw = { ...raw };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      this.diagnostics.gyroRebases += 1;
    }
  }

  /**
   * Подтверждение якоря камеры. Замер, одновременно далёкий от текущей
   * оценки и резко ушедший от предыдущего принятого замера, должен
   * продержаться FUSION_ANCHOR_CONFIRM_SEC, прежде чем править центр.
   */
  private gateAnchor(sample: GazeSample, step: number): GazeSample | null {
    const farFromFused =
      Math.abs(wrapPi(sample.yaw - this.yaw)) > FUSION_ANCHOR_JUMP_YAW ||
      Math.abs(sample.pitch - this.pitch) > FUSION_ANCHOR_JUMP_PITCH;
    const abrupt =
      !this.anchorTrack ||
      Math.abs(wrapPi(sample.yaw - this.anchorTrack.yaw)) > FUSION_ANCHOR_JUMP_YAW ||
      Math.abs(sample.pitch - this.anchorTrack.pitch) > FUSION_ANCHOR_JUMP_PITCH;

    if (!farFromFused || !abrupt) return this.acceptAnchor(sample);

    if (
      this.anchorCandidate &&
      Math.abs(wrapPi(sample.yaw - this.anchorCandidate.yaw)) <= FUSION_ANCHOR_MATCH &&
      Math.abs(sample.pitch - this.anchorCandidate.pitch) <= FUSION_ANCHOR_MATCH
    ) {
      this.anchorCandidateAgeSec += step;
    } else {
      this.anchorCandidateAgeSec = 0;
      this.diagnostics.anchorJumps += 1;
    }
    this.anchorCandidate = { yaw: sample.yaw, pitch: sample.pitch };

    return this.anchorCandidateAgeSec >= FUSION_ANCHOR_CONFIRM_SEC ? this.acceptAnchor(sample) : null;
  }

  private acceptAnchor(sample: GazeSample): GazeSample {
    this.anchorTrack = { yaw: sample.yaw, pitch: sample.pitch };
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    return sample;
  }

  /**
   * Held — экстраполяция последнего замера, не доказательство. Используем её
   * при мёртвом гироскопе только рядом с последним принятым якорем (или с
   * текущей оценкой, если якоря ещё не было): далёкий held, включая ложный
   * ноль драйвера, не имеет права утащить камеру.
   */
  private heldTrusted(sample: GazeSample): boolean {
    const ref = this.anchorTrack ?? { yaw: this.yaw, pitch: this.pitch };
    return (
      Math.abs(wrapPi(sample.yaw - ref.yaw)) <= FUSION_HELD_MATCH &&
      Math.abs(sample.pitch - ref.pitch) <= FUSION_HELD_MATCH
    );
  }

  /** Камера после устойчивой потери гироскопа: быстро, но без мгновенного присвоения. */
  private followCamera(sample: GazeSample, dt: number) {
    if (dt <= 0) return;
    const a = 1 - Math.exp(-FUSION_CAMERA_FOLLOW_K * dt);
    this.yaw += clamp(wrapPi(sample.yaw - this.yaw) * a, -FUSION_CAMERA_YAW_RATE * dt, FUSION_CAMERA_YAW_RATE * dt);
    this.pitch += clamp(
      (sample.pitch - this.pitch) * a,
      -FUSION_CAMERA_PITCH_RATE * dt,
      FUSION_CAMERA_PITCH_RATE * dt
    );
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
