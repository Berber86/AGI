// Regression checks for the pixel-color gate and personal palm calibration.
import assert from 'node:assert/strict';
import { CamTracker, analyzeGestures, analyzeSkinMaskDiagnostics, calibrateSkinColor, readSkinProfile } from '../../src/camtrack.js';

const W = 160, H = 120;
const frame = new Uint8ClampedArray(W * H * 4);
const paint = (x0, y0, x1, y1, rgb) => {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * W + x) * 4;
    frame[i] = rgb[0]; frame[i + 1] = rgb[1]; frame[i + 2] = rgb[2]; frame[i + 3] = 255;
  }
};
// A warm, neutral room background falls inside the default skin chroma band.
paint(0, 0, W, H, [200, 175, 150]);
// The hand is off-center and its camera white balance puts Cr outside the
// universal band: exactly the reported black-hand/green-background failure.
paint(20, 30, 70, 90, [220, 120, 100]);
const broad = analyzeSkinMaskDiagnostics(frame, W, H);
assert.equal(broad.reason, 'skin-mask-covers-background');
assert(broad.skinPixels > 14_000, `expected background to dominate the mask, got ${broad.skinPixels}`);
assert.equal(broad.mask[0], 1, 'warm background reproduces green mask');
assert.equal(broad.mask[60 * W + 45], 0, 'out-of-band hand reproduces black mask');

// A center-ROI sample would learn the empty background; direct tap on the
// palm must learn its unfiltered chroma and reject the background instead.
const wrongCenterProfile = calibrateSkinColor(frame, W, H);
assert(wrongCenterProfile, 'background point is uniform but must not be silently accepted by the UI');
const wrong = analyzeSkinMaskDiagnostics(frame, W, H, wrongCenterProfile);
assert.equal(wrong.mask[0], 1, 'center background sample reproduces calibration failure');
assert.equal(wrong.mask[60 * W + 45], 0, 'wrong profile still rejects the hand');

const profile = calibrateSkinColor(frame, W, H, 45, 60);
assert(profile, 'tap in the center of the palm should produce a calibration profile');
const calibrated = analyzeSkinMaskDiagnostics(frame, W, H, profile);
assert(calibrated.skinPixels > 1_000, `palm should remain visible, got ${calibrated.skinPixels}`);
assert(calibrated.skinPixels < W * H * 0.75, `background should be rejected, got ${calibrated.skinPixels}`);
assert.equal(calibrated.mask[0], 0, 'corner/background pixel must not be treated as skin');
assert.equal(calibrated.mask[60 * W + 45], 1, 'tapped palm pixel must remain in the mask');
const priorStorage = globalThis.localStorage;
const legacyProfile = { ...wrongCenterProfile }; delete legacyProfile.version;
globalThis.localStorage = { getItem: () => JSON.stringify(legacyProfile) };
assert.equal(readSkinProfile(), null, 'legacy center-sampled profile must be rejected');
globalThis.localStorage = { getItem: () => JSON.stringify(profile) };
assert.deepEqual(readSkinProfile(), profile, 'tap-calibrated profile must load');
if (priorStorage === undefined) delete globalThis.localStorage;
else globalThis.localStorage = priorStorage;
assert.equal(calibrateSkinColor(new Uint8ClampedArray(W * H * 4), W, H), null, 'transparent calibration must fail safely');

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
assert.equal(vResult.v.reason, 'v-pose');
assert.equal(thumbResult.thumb.found, true, `thumb recognizer regressed: ${JSON.stringify(thumbResult.thumb)}`);
assert.equal(thumbResult.thumb.reason, 'thumbs-up');

// A single contour miss between positives must not erase the gesture; gas still
// releases immediately on a confirmed miss, while V gets two-miss hysteresis.
const tracker = Object.create(CamTracker.prototype);
Object.assign(tracker, {
  gestureEnabled: true, gestureV: false, gestureConfidence: 0, gestureLastAt: 0,
  gestureOnFrames: 0, gestureOffFrames: 0, gestureHits: [],
  thumbUp: false, thumbConfidence: 0, thumbLastAt: 0,
  thumbOnFrames: 0, thumbOffFrames: 0, thumbHits: [],
});
const feed = (found) => tracker._applyGesture({
  v: { found, confidence: found ? .7 : 0 }, thumb: { found, confidence: found ? .7 : 0 },
});
feed(true); assert.equal(tracker.gestureV, false, 'one hit does not activate V');
feed(false); assert.equal(tracker.gestureV, false);
feed(true); assert.equal(tracker.gestureV, true, 'two hits in three activate V');
assert.equal(tracker.thumbUp, true, 'two hits in three activate thumb gas');
feed(false); assert.equal(tracker.gestureV, true, 'one miss does not drop V');
assert.equal(tracker.thumbUp, false, 'gas remains fail-stop on a miss');
feed(false); assert.equal(tracker.gestureV, false, 'two consecutive misses release V');
console.log(`gesture color QA passed: ${broad.skinPixels} background pixels -> ${calibrated.skinPixels} palm pixels; synthetic V/👍 and 2-of-3 debounce pass; ${JSON.stringify(profile)}`);
