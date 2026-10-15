// Visual metadata only: never part of the save schema or weighted item catalog.
export const PRESENTATION = {
  camera: { rotation: [.10, -.28, 0], lamp: 32, rim: 34 },
  teacup: { rotation: [.28, -.24, 0], lamp: 8, rim: 10 },
  watch: { rotation: [.08, -.24, -.08], lamp: 20, rim: 22 },
  cassette: { rotation: [.10, -.20, -.04], flat: true, lamp: 19, rim: 20 },
  duck: { rotation: [.10, -.34, 0], lamp: 8, rim: 10 },
  book: { rotation: [.07, -.30, -.04], flat: true, lamp: 34, rim: 36 },
  key: { rotation: [.08, -.24, -.12], lamp: 34, rim: 36 },
  badge: { rotation: [.08, -.24, 0], flat: true, lamp: 24, rim: 25 },
  record: { rotation: [.14, -.32, -.07], lamp: 31, rim: 24, lightPosition: [-1.7, .55, -1.6], flat: true },
  perfume: { rotation: [.09, -.30, 0], lamp: 23, rim: 25 },
  horse: { rotation: [.08, -.30, 0], lamp: 24, rim: 26 },
  compass: { rotation: [.12, -.23, -.07], lamp: 12, rim: 13 },
  bottle: { rotation: [.10, -.25, 0], lamp: 27, rim: 29 },
  can: { rotation: [.32, -.28, 0], lamp: 28, rim: 29 },
  cup: { rotation: [.18, -1.57, -.06], lamp: 15, rim: 15 },
  box: { rotation: [.24, -.35, 0], lamp: 21, rim: 22 },
  lid: { rotation: [.15, -.28, 0], flat: true, lamp: 21, rim: 22 },
  paper: { rotation: [.06, -.18, -.04], flat: true, lamp: 9, rim: 9 },
};
export const ZOOM = { min: .85, max: 1.65 };

export function inspectionRect(width, height, safeTop = 0, safeBottom = 0) {
  if (height <= 520 && width > 650) {
    const panel=Math.min(360,Math.max(280,width*.34));
    return { x: 28, y: 90 + safeTop, width: width-panel-64, height: Math.max(60,height-210-safeTop-safeBottom) };
  }
  const mobile = width <= 650;
  const top = (mobile ? 244 : 270) + safeTop;
  const bottom = height - (mobile ? 300 : 270) - safeBottom;
  const w = Math.min(width - (mobile ? 40 : 100), 660);
  return { x: (width - w) / 2, y: top, width: w, height: Math.max(70, bottom - top) };
}

// Perspective-safe fit, including the frontmost depth of a rotated model.
// extents are half-sizes in camera space. Valid for centered bounding boxes.
export function fitScale(extents, rect, viewportHeight, fov, depth = 4.2, viewportWidth) {
  // A rect without an origin is treated as centred in the viewport. Reading
  // rect.x/rect.y unconditionally turned a missing origin into NaN, and the
  // archive thumbnails rendered at a NaN scale: background only, no find.
  const vw = viewportWidth ?? (Number.isFinite(rect.x) ? rect.x * 2 + rect.width : rect.width);
  const rx = rect.x ?? (vw - rect.width) / 2;
  const ry = rect.y ?? (viewportHeight - rect.height) / 2;
  const worldPerPixel = 2 * depth * Math.tan(fov * Math.PI / 360) / viewportHeight;
  const halfW = rect.width * worldPerPixel * .5;
  const halfH = rect.height * worldPerPixel * .5;
  const x = Math.max(extents.x, .001), y = Math.max(extents.y, .001);
  // Deep corners in an off-axis stage shift toward the viewport edge.
  const edgeX=Math.max(Math.abs(rx-vw/2),Math.abs(rx+rect.width-vw/2))*worldPerPixel;
  const edgeY=Math.max(Math.abs(ry-viewportHeight/2),Math.abs(ry+rect.height-viewportHeight/2))*worldPerPixel;
  return .94 * Math.min(halfW / (x + edgeX * extents.z / depth), halfH / (y + edgeY * extents.z / depth));
}

export function inspectionPose(id, pose) {
  if(!PRESENTATION[id])throw Error('unknown item');
  if(pose==='front')return [...PRESENTATION[id].rotation];
  const poses={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};
  if(!poses[pose])throw Error('unknown pose');
  // Flat finds (a record, a lid, a newspaper) collapse to a sliver in a true
  // top/bottom view - 346x18 px for the record. Tilt them instead, so the face
  // stays readable and the edge still shows its thickness.
  if(PRESENTATION[id].flat&&(pose==='top'||pose==='bottom')){
    const [x,y,z]=PRESENTATION[id].rotation;
    return [x+(pose==='top'?.95:-.95),y,z];
  }
  return [...poses[pose]];
}
