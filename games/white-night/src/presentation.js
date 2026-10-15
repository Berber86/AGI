// Visual metadata only: never part of the save schema or weighted item catalog.
export const PRESENTATION = {
  camera: { rotation: [.10, -.28, 0] },
  teacup: { rotation: [.28, -.24, 0], lamp: 5, rim: 7 },
  watch: { rotation: [.08, -.24, -.08] },
  cassette: { rotation: [.10, -.20, -.04] },
  duck: { rotation: [.10, -.34, 0], lamp: 5, rim: 7 },
  book: { rotation: [.07, -.30, -.04] },
  key: { rotation: [.08, -.24, -.12] },
  badge: { rotation: [.08, -.24, 0] },
  record: { rotation: [.14, -.32, -.07], lamp: 16, lightPosition: [-1.7, .55, -1.6] },
  perfume: { rotation: [.09, -.30, 0] },
  horse: { rotation: [.08, -.30, 0] },
  compass: { rotation: [.12, -.23, -.07] },
  bottle: { rotation: [.10, -.25, 0] },
  can: { rotation: [.32, -.28, 0] },
  cup: { rotation: [.18, -1.57, -.06] },
  box: { rotation: [.24, -.35, 0] },
  lid: { rotation: [.15, -.28, 0] },
  paper: { rotation: [.06, -.18, -.04] },
};
export const ZOOM = { min: .85, max: 1.65 };

export function inspectionRect(width, height, safeTop = 0, safeBottom = 0) {
  if (height <= 520 && width > 650) {
    const panel=Math.min(360,Math.max(280,width*.34));
    return { x: 28, y: 90 + safeTop, width: width-panel-64, height: Math.max(60,height-166-safeTop-safeBottom) };
  }
  const mobile = width <= 650;
  const top = (mobile ? 192 : 220) + safeTop;
  const bottom = height - (mobile ? 300 : 270) - safeBottom;
  const w = Math.min(width - (mobile ? 40 : 100), 660);
  return { x: (width - w) / 2, y: top, width: w, height: Math.max(70, bottom - top) };
}

// Perspective-safe fit, including the frontmost depth of a rotated model.
// extents are half-sizes in camera space. Valid for centered bounding boxes.
export function fitScale(extents, rect, viewportHeight, fov, depth = 4.2) {
  const worldPerPixel = 2 * depth * Math.tan(fov * Math.PI / 360) / viewportHeight;
  const halfW = rect.width * worldPerPixel * .5;
  const halfH = rect.height * worldPerPixel * .5;
  const x = Math.max(extents.x, .001), y = Math.max(extents.y, .001);
  return .94 * Math.min(halfW / (x + halfW * extents.z / depth), halfH / (y + halfH * extents.z / depth));
}
