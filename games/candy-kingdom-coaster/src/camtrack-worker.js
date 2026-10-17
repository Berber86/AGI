// Camera marker tracking and MediaPipe Gesture Recognizer stay off the render
// thread. The recognized categories, confidence scores, and hand landmarks are
// sent back to CamTracker; failed initialization/results never imply gas input.
let helpersPromise = null;

async function getHelpers() {
  if (!helpersPromise) helpersPromise = import(new URL('./camtrack.js', self.location.href).href);
  return helpersPromise;
}

let cnv = null;
let ctx = null;
let recognizerPromise = null;
let recognizer = null;
let lastTimestampMs = 0;

const status = (gestureStatus, gestureError = '') => {
  self.postMessage({ gestureStatus, gestureError });
};

async function getRecognizer() {
  if (!recognizerPromise) {
    status('loading');
    recognizerPromise = (async () => {
      const { FilesetResolver, GestureRecognizer } = await import(new URL('../vendor/mediapipe/vision_bundle.mjs', self.location.href).href);
      const wasmRoot = new URL('../vendor/mediapipe/wasm/', self.location.href).href;
      const modelUrl = new URL('../assets/models/gesture_recognizer.task', self.location.href).href;
      const vision = await FilesetResolver.forVisionTasks(wasmRoot);
      const response = await fetch(modelUrl, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Gesture model download failed: HTTP ${response.status}`);
      const modelBuffer = await response.arrayBuffer();
      recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: { modelAssetBuffer: new Uint8Array(modelBuffer), delegate: 'CPU' },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        cannedGesturesClassifierOptions: { maxResults: 8, scoreThreshold: 0 },
      });
      status('ready');
      return recognizer;
    })().catch((error) => {
      const message = error?.message || String(error);
      status('error', message);
      throw error;
    });
  }
  return recognizerPromise;
}

async function processFrame(m) {
  if (!m.bitmap) return;
  const t0 = performance.now();
  let gesture = null;
  let gestureInferenceMs = 0;
  let w = 0, h = 0;
  try {
    const { analyzeColorBlob, analyzeColorBlobs, anglesFromCentroid, mapMediaPipeGestures } = await getHelpers();
    if (m.gesture) {
      try {
        const task = await getRecognizer();
        const timestampMs = Math.max(Number(m.timestampMs) || 0, lastTimestampMs + 1);
        lastTimestampMs = timestampMs;
        const inferenceAt = performance.now();
        const result = task.recognizeForVideo(m.bitmap, timestampMs);
        gestureInferenceMs = performance.now() - inferenceAt;
        gesture = mapMediaPipeGestures(result);
      } catch {
        // Status is reported separately. No geometric fallback and no gesture.
      }
    }
    if (!cnv) {
      cnv = new OffscreenCanvas(2, 2);
      ctx = cnv.getContext('2d', { willReadFrequently: true });
    }
    cnv.width = m.bitmap.width;
    cnv.height = m.bitmap.height;
    w = cnv.width; h = cnv.height;
    ctx.drawImage(m.bitmap, 0, 0);
    const img = ctx.getImageData(0, 0, w, h);
    if (m.dual && Array.isArray(m.hues)) {
      const markers = analyzeColorBlobs(img.data, w, h, m.hues, m.tol, m.satMin);
      self.postMessage({
        dual: true, markers, gesture, gestureRaw: gesture?.hands || [], gestureInferenceMs,
        w, h, procMs: performance.now() - t0,
      });
      return;
    }
    const res = analyzeColorBlob(img.data, w, h, m.hue, m.tol, m.satMin);
    let yaw = 0, pitch = 0;
    if (res.found) {
      const a = anglesFromCentroid(res.u, res.v, w, h, m.c0n, m.fovDeg);
      yaw = a.yaw; pitch = a.pitch;
    }
    self.postMessage({
      found: res.found, count: res.count, u: res.u || 0, v: res.v || 0,
      bw: res.bw || 0, bh: res.bh || 0, fill: res.fill || 0,
      yaw, pitch, gesture, gestureRaw: gesture?.hands || [], gestureInferenceMs,
      w, h, procMs: performance.now() - t0,
    });
  } catch (error) {
    self.postMessage({
      found: false, count: 0, u: 0, v: 0, bw: 0, bh: 0, fill: 0, yaw: 0, pitch: 0,
      gesture: null, gestureRaw: [], gestureInferenceMs,
      w: w || m.bitmap.width || 0, h: h || m.bitmap.height || 0,
      procMs: performance.now() - t0, error: String(error),
    });
  } finally {
    m.bitmap.close?.();
  }
}

self.onmessage = (event) => {
  const message = event.data || {};
  if (message.type === 'initGesture') {
    getRecognizer().catch(() => {});
    return;
  }
  processFrame(message);
};
