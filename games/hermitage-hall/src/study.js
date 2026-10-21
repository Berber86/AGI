// Близкий осмотр полотна: камера подходит к картине так, чтобы холст занимал
// почти весь кадр, и возвращается на точку, когда зритель отводит взгляд.

import { HALL, wallFacing } from './config.js';

// Человек смотрит в телефон с ~30 см: по горизонтали кадр шире, поэтому
// ориентируемся на вертикаль, но не даём раме вылезти за края по ширине.
// Холст занимает кадр целиком по одной из сторон, но не обрезается: музейное
// изучение — это и общий силуэт, и мазок. Ближе подводит уже лупа (щипок/колесо).
// Кадр прибытия: холст чуть выше кадра, поэтому виден и силуэт, и фактура.
// Щипок/колесо/касание в очках подводят ещё ближе — до мазка.
const FILL_HEIGHT = 1.35;
const FILL_WIDTH = 0.98;
const MIN_DISTANCE = 0.55;
const MAX_DISTANCE = 2.4;

// Вплотную снимаем «телевиком»: камера не подходит вплотную к полотну (иначе
// рама и стена дают сильный наклон), а сужает угол — кадр становится плоским,
// как у музейной витрины.
export const CLOSE_FOV = 52;
export const NORMAL_FOV = 66;

function verticalFov(fovDeg) {
  return (fovDeg * Math.PI) / 180;
}

/**
 * Поза для близкого осмотра полотна.
 *
 * @param {{position:number[], width:number, height:number, rotationY:number}} art
 * @param {{fov?:number, aspect?:number, eye?:number}} options
 * @returns {{position:number[], yaw:number, pitch:number, distance:number, fill:number}}
 */
export function closeUpPose(art, { fov = 66, aspect = 16 / 9, eye = HALL.eye, distance = null } = {}) {
  const vFov = verticalFov(fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(0.4, aspect));
  const byHeight = (art.height / FILL_HEIGHT) / (2 * Math.tan(vFov / 2));
  const byWidth = (art.width / FILL_WIDTH) / (2 * Math.tan(hFov / 2));
  const base = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, Math.max(byHeight, byWidth)));
  const chosen = distance === null ? base : Math.max(MIN_DISTANCE * 0.92, Math.min(base, distance));

  // Картина висит на стене: отходим от неё внутрь зала вдоль нормали.
  const facing = wallFacing(art.rotationY);
  const [x, y, z] = art.position;
  const position = [x + facing[0] * chosen, eye, z + facing[2] * chosen];
  const dx = x - position[0];
  const dy = y - position[1];
  const dz = z - position[2];
  const horizontal = Math.hypot(dx, dz) || 1e-6;
  return {
    position,
    yaw: Math.atan2(dx, -dz),
    pitch: Math.atan2(dy, horizontal),
    distance: chosen,
    baseDistance: base,
    fill: {
      width: art.width / (2 * chosen * Math.tan(hFov / 2)),
      height: art.height / (2 * chosen * Math.tan(vFov / 2)),
    },
  };
}

/** Сколько процентов кадра занимает холст с этой точки — для честной проверки. */
export function paintingCoverage(art, pose, { fov = 66, aspect = 16 / 9 } = {}) {
  const vFov = verticalFov(fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(0.4, aspect));
  const dx = art.position[0] - pose.position[0];
  const dz = art.position[2] - pose.position[2];
  const distance = Math.hypot(dx, dz);
  const widthShare = art.width / (2 * distance * Math.tan(hFov / 2));
  const heightShare = art.height / (2 * distance * Math.tan(vFov / 2));
  return { widthShare, heightShare, distance };
}

/**
 * Накопитель «взгляд на полотно». Отдельный от медальонов: у него своя цель,
 * свой порог и свой сброс, чтобы две системы не мешали друг другу.
 */
export function createStudyDwell({ seconds = 10, grace = 0.35 } = {}) {
  let artId = null;
  let progress = 0;
  let graceLeft = 0;

  function reset() {
    artId = null;
    progress = 0;
    graceLeft = 0;
  }

  function update(dt, nextId) {
    if (!nextId) {
      if (artId) {
        graceLeft -= dt;
        if (graceLeft <= 0) reset();
      }
      return { artId: null, progress: 0, ready: false };
    }
    if (nextId !== artId) {
      artId = nextId;
      progress = 0;
    }
    graceLeft = grace;
    progress = Math.min(1, progress + dt / seconds);
    return { artId, progress, ready: progress >= 1 };
  }

  return {
    update,
    reset,
    get artId() { return artId; },
    get progress() { return progress; },
  };
}
