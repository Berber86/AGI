// camtrack-worker.js — конвейер камеры вне главного потока:
// OffscreenCanvas -> getImageData -> крупнейшее пятно -> углы.
// Главный поток получает только marker result и дешёвый gesture result; кадр не возвращается.
import { analyzeColorBlob, analyzeColorBlobs, analyzeVGesture, anglesFromCentroid } from './camtrack.js';

let cnv = null;
let ctx = null;

self.onmessage = (e) => {
  const m = e.data || {};
  if (!m.bitmap) return;
  const t0 = performance.now();
  try {
    if (!cnv) {
      cnv = new OffscreenCanvas(2, 2);
      ctx = cnv.getContext('2d', { willReadFrequently: true });
    }
    cnv.width = m.bitmap.width;
    cnv.height = m.bitmap.height;
    ctx.drawImage(m.bitmap, 0, 0);
    if (m.bitmap.close) m.bitmap.close();
    const img = ctx.getImageData(0, 0, cnv.width, cnv.height);
    const gesture = m.gesture ? analyzeVGesture(img.data, cnv.width, cnv.height) : null;
    if (m.dual && Array.isArray(m.hues)) {
      const markers = analyzeColorBlobs(img.data, cnv.width, cnv.height, m.hues, m.tol, m.satMin);
      self.postMessage({ dual: true, markers, gesture, w: cnv.width, h: cnv.height, procMs: performance.now() - t0 });
      return;
    }
    const res = analyzeColorBlob(img.data, cnv.width, cnv.height, m.hue, m.tol, m.satMin);
    let yaw = 0, pitch = 0;
    if (res.found) {
      const a = anglesFromCentroid(res.u, res.v, cnv.width, cnv.height, m.c0n, m.fovDeg);
      yaw = a.yaw; pitch = a.pitch;
    }
    self.postMessage({
      found: res.found, count: res.count, u: res.u || 0, v: res.v || 0,
      yaw, pitch, w: cnv.width, h: cnv.height,
      gesture,
      procMs: performance.now() - t0,
    });
  } catch (err) {
    self.postMessage({ found: false, count: 0, u: 0, v: 0, yaw: 0, pitch: 0, w: 0, h: 0, procMs: performance.now() - t0, error: String(err) });
  }
};
