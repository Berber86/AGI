// Разбор кадра камеры вне основного потока: ImageBitmap -> OffscreenCanvas ->
// HSV-пятно. Никакого ML: управлений в игре нет, нужен только поворот головы.
let helpersPromise = null;

function getHelpers() {
  if (!helpersPromise) helpersPromise = import(new URL('./camtrack.js', self.location.href).href);
  return helpersPromise;
}

let cnv = null;
let ctx = null;

async function processFrame(m) {
  if (!m.bitmap) return;
  const t0 = performance.now();
  let w = 0, h = 0;
  try {
    const { analyzeColorBlob, analyzeColorBlobs } = await getHelpers();
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
      self.postMessage({ dual: true, markers, w, h, procMs: performance.now() - t0 });
      return;
    }
    const res = analyzeColorBlob(img.data, w, h, m.hue, m.tol, m.satMin);
    self.postMessage({
      found: res.found, count: res.count, u: res.u || 0, v: res.v || 0,
      bw: res.bw || 0, bh: res.bh || 0, fill: res.fill || 0,
      w, h, procMs: performance.now() - t0,
    });
  } catch (error) {
    self.postMessage({
      found: false, count: 0, u: 0, v: 0, bw: 0, bh: 0, fill: 0,
      w: w || m.bitmap.width || 0, h: h || m.bitmap.height || 0,
      procMs: performance.now() - t0, error: String(error),
    });
  } finally {
    m.bitmap.close?.();
  }
}

self.onmessage = (event) => {
  processFrame(event.data || {});
};
