// Visual metadata only: never part of the save schema or weighted item catalog.
//
// lamp   - the warm key light: raking, from the upper left of the find.
// rim    - the cold rim light: separates dark finds from the night behind them.
// fill   - a soft frontal light between camera and find. Dark finds keep a low
//          albedo on purpose (rubber, vinyl, painted tin), so readability is carried
//          by the light rather than by washing out the material. Values were tuned
//          against tests/quality-probe.mjs until the median tone of the find inside
//          its own silhouette reached ~50 while the backdrop stayed at ~19.
// mass   - framing factor. The find is fitted to the stage by its bounding box, so a
//          round record and a thin key fill the same box very differently (measured
//          silhouette share of the stage: 25 % for the key against 61 % for the sheet
//          of paper). mass scales the fit so the visual weight of a find stays within
//          a narrow band instead of jumping 2.5x between neighbours.
export const PRESENTATION = {
  camera: { rotation: [.10, -.28, 0], lamp: 36, rim: 26, fill: 15, mass: .94 },
  teacup: { rotation: [.28, -.24, 0], lamp: 10, rim: 11, fill: 4, mass: 1 },
  watch: { rotation: [.08, -.24, -.08], lamp: 24, rim: 24, fill: 13, mass: 1 },
  cassette: { rotation: [.10, -.20, -.04], flat: true, lamp: 22, rim: 22, fill: 11, mass: .9 },
  duck: { rotation: [.10, -.34, 0], lamp: 9, rim: 11, fill: 4, mass: 1 },
  book: { rotation: [.07, -.30, -.04], flat: true, lamp: 36, rim: 34, fill: 14, mass: .89 },
  key: { rotation: [.08, -.24, -.12], lamp: 38, rim: 30, fill: 17, mass: 1 },
  badge: { rotation: [.08, -.24, 0], flat: true, lamp: 28, rim: 26, fill: 12, mass: .88 },
  record: { rotation: [.14, -.32, -.07], lamp: 34, rim: 26, fill: 14, lightPosition: [-1.7, .55, -1.6], flat: true, mass: .92 },
  perfume: { rotation: [.09, -.30, 0], lamp: 25, rim: 26, fill: 8, mass: 1 },
  horse: { rotation: [.08, -.30, 0], lamp: 26, rim: 27, fill: 9, mass: 1 },
  compass: { rotation: [.12, -.23, -.07], lamp: 13, rim: 14, fill: 4, mass: .95 },
  bottle: { rotation: [.10, -.25, 0], lamp: 31, rim: 30, fill: 15, mass: 1 },
  can: { rotation: [.32, -.28, 0], lamp: 30, rim: 30, fill: 8, mass: 1 },
  cup: { rotation: [.18, -1.57, -.06], lamp: 16, rim: 16, fill: 5, mass: .98 },
  box: { rotation: [.24, -.35, 0], lamp: 22, rim: 23, fill: 6, mass: 1 },
  lid: { rotation: [.15, -.28, 0], flat: true, lamp: 24, rim: 23, fill: 9, mass: .86 },
  paper: { rotation: [.06, -.18, -.04], flat: true, lamp: 11, rim: 10, fill: 5, mass: .83 },
};
// Flat finds are tilted instead of turned edge-on; a drag must not undo that.
export const FLAT_TILT = 1.05;
export const ZOOM = { min: .85, max: 1.35 };

export function inspectionRect(width, height, safeTop = 0, safeBottom = 0) {
  if (height <= 520 && width > 650) {
    // Short landscape: the text lives in the right panel, so the find can use
    // most of the height instead of a portrait-sized box (was height-210).
    const panel=Math.min(360,Math.max(280,width*.34));
    return { x: 28, y: 80 + safeTop, width: width-panel-64, height: Math.max(150,height-172-safeTop-safeBottom) };
  }
  const mobile = width <= 650;
  // Short portrait screens carry the compact cluster (see the max-width/max-height:650px
  // blocks in style.css): the pose row above the stage ends around y 222, and the caption
  // below is bottom-anchored at 143 px and about 128 px tall, so its top edge sits at
  // height - 271 with the decision buttons right underneath. The find has to stay inside
  // that band: a taller stage would put the model under the title (measured on 320x568 the
  // item box reached y 338 while the eyebrow started at y 297).
  const short = height <= 650;
  const top = (mobile ? (short ? 220 : 244) : 270) + safeTop;
  // On short portraits the compact block in style.css moves the caption down to 123 px from
  // the bottom edge and tightens it, so the find can use the band above it: 568 -> 101 px,
  // 640 -> 173 px (was 73 and 145 before the caption moved).
  const reserve = mobile ? (short ? 247 : 300) : 270;
  const bottom = height - reserve - safeBottom;
  const min = mobile && !short ? 150 : short ? 70 : 150;
  const y = Math.min(top, bottom - min);
  const w = Math.min(width - (mobile ? 40 : 100), 660);
  return { x: (width - w) / 2, y, width: w, height: Math.max(min, bottom - y) };
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
