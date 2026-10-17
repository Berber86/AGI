// MediaPipe result-adapter and fail-stop gate QA.
// These fixtures validate parsing/state logic only; they are NOT evidence that
// real hands are recognized. Physical-device validation remains required.
import assert from 'node:assert/strict';
import { CamTracker, GESTURE_MIN_SCORE, mapMediaPipeGestures } from '../../src/camtrack.js';

const landmarks = Array.from({ length: 21 }, (_, i) => ({ x: i / 20, y: 1 - i / 20, z: 0.01 * i }));
const victory = mapMediaPipeGestures({
  gestures: [[
    { categoryName: 'Victory', displayName: 'Victory', score: 0.91, index: 5 },
    { categoryName: 'Open_Palm', displayName: 'Open_Palm', score: 0.06, index: 1 },
  ]],
  handedness: [[{ categoryName: 'Right', displayName: 'Right', score: 0.98 }]],
  landmarks: [landmarks],
});
assert.equal(victory.v.found, true);
assert.equal(victory.v.confidence, 0.91);
assert.equal(victory.v.reason, 'recognized');
assert.equal(victory.thumb.found, false);
assert.equal(victory.hands[0].handedness, 'Right');
assert.equal(victory.hands[0].landmarks.length, 21);
assert.equal(victory.hands[0].categories[1].label, 'Open_Palm');

const thumbsUp = mapMediaPipeGestures({
  gestures: [[{ categoryName: 'Thumb_Up', score: 0.84 }, { categoryName: 'None', score: 0.14 }]],
  handedness: [[{ categoryName: 'Left', score: 0.9 }]],
  landmarks: [landmarks],
});
assert.equal(thumbsUp.thumb.found, true);
assert.equal(thumbsUp.v.found, false);
assert.equal(thumbsUp.thumb.confidence, 0.84);

const lowScore = mapMediaPipeGestures({
  gestures: [[{ categoryName: 'Thumb_Up', score: GESTURE_MIN_SCORE - 0.01 }]],
  landmarks: [landmarks],
});
assert.equal(lowScore.thumb.found, false, 'below threshold cannot activate gas');
assert.equal(lowScore.thumb.reason, 'low-confidence');
assert.equal(lowScore.thumb.confidence, GESTURE_MIN_SCORE - 0.01, 'diagnostics retain raw score');

const wrongTopClass = mapMediaPipeGestures({
  gestures: [[{ categoryName: 'Open_Palm', score: 0.93 }, { categoryName: 'Thumb_Up', score: 0.91 }]],
  landmarks: [landmarks],
});
assert.equal(wrongTopClass.thumb.found, false, 'a lower-ranked target category is not accepted');
assert.equal(wrongTopClass.thumb.reason, 'other:Open_Palm');

const noHand = mapMediaPipeGestures({ gestures: [], landmarks: [], handedness: [] });
assert.equal(noHand.v.found, false);
assert.equal(noHand.thumb.found, false);
assert.equal(noHand.thumb.reason, 'no-hand');

// The production state gate: 2-of-3 activation, V tolerates one miss, but gas
// releases immediately on any confirmed frame without high-confidence Thumb_Up.
const tracker = Object.create(CamTracker.prototype);
Object.assign(tracker, {
  gestureEnabled: true, gestureV: false, gestureConfidence: 0, gestureLastAt: 0,
  gestureOnFrames: 0, gestureOffFrames: 0, gestureHits: [],
  thumbUp: false, thumbConfidence: 0, thumbLastAt: 0,
  thumbOnFrames: 0, thumbOffFrames: 0, thumbHits: [],
});
const feed = ({ v = false, thumb = false } = {}) => tracker._applyGesture({
  v: { found: v, confidence: v ? 0.9 : 0 },
  thumb: { found: thumb, confidence: thumb ? 0.9 : 0 },
});
feed({ v: true, thumb: true });
assert.equal(tracker.gestureV, false, 'one frame is insufficient');
assert.equal(tracker.thumbUp, false, 'one frame is insufficient for gas');
feed();
feed({ v: true, thumb: true });
assert.equal(tracker.gestureV, true, 'two V detections in three frames activate');
assert.equal(tracker.thumbUp, true, 'two Thumb_Up detections in three frames activate');
feed();
assert.equal(tracker.gestureV, true, 'V tolerates one missed frame');
assert.equal(tracker.thumbUp, false, 'any miss releases throttle immediately');
feed();
assert.equal(tracker.gestureV, false, 'two consecutive V misses release');

// A late Worker result after repeated timeouts may preserve marker diagnostics,
// but must never restore a gesture/gas control or clear the latched error.
const savedWorker = globalThis.Worker;
let fakeWorker;
globalThis.Worker = class {
  constructor() { fakeWorker = this; }
  postMessage() {}
};
try {
  const workerGate = Object.create(CamTracker.prototype);
  Object.assign(workerGate, {
    _worker: undefined, _workerMode: true, _workerBusy: true, _workerFails: 0,
    gestureEnabled: true, gestureStatus: 'loading', gestureError: '',
    lastAppliedGesture: 'unset', lastWorkerResult: null,
  });
  workerGate._applyGesture = function (value) { this.lastAppliedGesture = value; };
  workerGate._applyResult = function (value) { this.lastWorkerResult = value; };
  workerGate.ensureWorker();
  fakeWorker.onmessage({ data: { gestureStatus: 'ready' } });
  workerGate._noteWorkerFail(); workerGate._noteWorkerFail();
  assert.equal(workerGate.gestureStatus, 'error');
  assert.equal(workerGate._workerMode, false);
  fakeWorker.onmessage({ data: {
    w: 320, h: 240, gestureStatus: 'ready', gesture: thumbsUp,
    gestureRaw: thumbsUp.hands,
  } });
  assert.equal(workerGate.lastWorkerResult.gesture, null, 'late gesture is stripped after timeout');
  assert.deepEqual(workerGate.lastWorkerResult.gestureRaw, [], 'late raw hand result cannot mask failure state');
  fakeWorker.onmessage({ data: { gestureStatus: 'ready' } });
  assert.equal(workerGate.gestureStatus, 'error', 'late ready cannot clear Worker error');
} finally {
  if (savedWorker === undefined) delete globalThis.Worker;
  else globalThis.Worker = savedWorker;
}

console.log('MediaPipe adapter QA passed: class/score mapping, 21 landmarks, rejection, debounce, timeout and late-result fail-stop. No real-camera claim.');
