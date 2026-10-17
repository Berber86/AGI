// Regression checks for the pixel-color gate and personal palm calibration.
import assert from 'node:assert/strict';
import { analyzeGestures, analyzeSkinMaskDiagnostics, calibrateSkinColor } from '../../src/camtrack.js';

const W = 160, H = 120;
const frame = new Uint8ClampedArray(W * H * 4);
const paint = (x0, y0, x1, y1, rgb) => {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * W + x) * 4;
    frame[i] = rgb[0]; frame[i + 1] = rgb[1]; frame[i + 2] = rgb[2]; frame[i + 3] = 255;
  }
};
// A warm, neutral room background falls in the former broad/default band.
paint(0, 0, W, H, [200, 175, 150]);
// A medium tan palm with a distinct chroma fills the calibration ROI.
paint(42, 30, 118, 90, [196, 139, 110]);
const broad = analyzeSkinMaskDiagnostics(frame, W, H);
assert.equal(broad.reason, 'skin-mask-covers-background');
assert(broad.skinPixels > 14_000, `expected broad background mask, got ${broad.skinPixels}`);

const profile = calibrateSkinColor(frame, W, H);
assert(profile, 'center palm should produce a calibration profile');
const calibrated = analyzeSkinMaskDiagnostics(frame, W, H, profile);
assert(calibrated.skinPixels > 1_000, `palm should remain visible, got ${calibrated.skinPixels}`);
assert(calibrated.skinPixels < W * H * 0.75, `background should be rejected, got ${calibrated.skinPixels}`);
assert.equal(calibrated.mask[0], 0, 'corner/background pixel must not be treated as skin');
assert.equal(calibrated.mask[60 * W + 80], 1, 'central palm pixel must remain in the mask');
assert.equal(calibrateSkinColor(new Uint8ClampedArray(W * H * 4), W, H), null, 'empty calibration must fail safely');

function makeGesture(kind) {
  const data = new Uint8ClampedArray(W * H * 4);
  const put = (x, y) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const i = (y * W + x) * 4;
    data[i] = 200; data[i + 1] = 140; data[i + 2] = 110; data[i + 3] = 255;
  };
  const disc = (cx, cy, r) => {
    for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) put(x, y);
  };
  const stroke = (x0, y0, x1, y1, r) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) {
      const k = n ? i / n : 0;
      disc(Math.round(x0 + (x1 - x0) * k), Math.round(y0 + (y1 - y0) * k), r);
    }
  };
  if (kind === 'v') {
    disc(80, 82, 25); stroke(70, 75, 57, 20, 7); stroke(90, 75, 104, 20, 7);
  } else {
    for (let y = 62; y <= 105; y++) for (let x = 55; x <= 105; x++) put(x, y);
    disc(80, 82, 25); stroke(90, 65, 90, 28, 9);
  }
  return analyzeGestures(data, W, H);
}
const vResult = makeGesture('v'), thumbResult = makeGesture('thumb');
assert.equal(vResult.v.found, true, `V recognizer regressed: ${JSON.stringify(vResult.v)}`);
assert.equal(thumbResult.thumb.found, true, `thumb recognizer regressed: ${JSON.stringify(thumbResult.thumb)}`);
console.log(`gesture color QA passed: ${broad.skinPixels} broad pixels -> ${calibrated.skinPixels} calibrated pixels; synthetic V/👍 pass; ${JSON.stringify(profile)}`);
