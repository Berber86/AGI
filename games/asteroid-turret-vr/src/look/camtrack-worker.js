// Camera marker analysis worker (guide §3): HSV blob detection off the main
// thread. Input: ImageBitmap (small frame). Output: two colour identities —
// left marker = magenta, right marker = orange — each with centroid, pixel
// count, fill and aspect. The main thread maps centroids to yaw/pitch and
// decides `expected` from pair geometry; the worker only reports blobs.

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b); const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d > 0) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx === 0 ? 0 : d / mx, mx];
}
const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

const TARGETS = {
  left: { hue: 300, hueTol: 28 },   // magenta
  right: { hue: 28, hueTol: 22 },   // orange
};
const MIN_SAT = 0.45; const MIN_VAL = 0.3; const MIN_PIXELS = 24;

function analyse(data, w, h) {
  const out = {};
  for (const [side, t] of Object.entries(TARGETS)) {
    let count = 0; let sx = 0; let sy = 0;
    let minX = w; let maxX = -1; let minY = h; let maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const [hh, ss, vv] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        if (ss >= MIN_SAT && vv >= MIN_VAL && hueDist(hh, t.hue) <= t.hueTol) {
          count++; sx += x; sy += y;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    if (count >= MIN_PIXELS && maxX >= 0) {
      const bw = maxX - minX + 1; const bh = maxY - minY + 1;
      out[side] = {
        found: true,
        u: sx / count / w, v: sy / count / h,
        count,
        fill: count / (bw * bh),
        aspect: bw / Math.max(1, bh),
      };
    } else {
      out[side] = { found: false, count };
    }
  }
  return out;
}

let off = null;
self.onmessage = async (e) => {
  const { bitmap, id } = e.data || {};
  if (!bitmap) return;
  const t0 = performance.now();
  try {
    if (!off) off = new OffscreenCanvas(1, 1);
    off.width = bitmap.width; off.height = bitmap.height;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bitmap, 0, 0);
    const img = ctx.getImageData(0, 0, off.width, off.height);
    const res = analyse(img.data, img.width, img.height);
    self.postMessage({ id, ok: true, procMs: performance.now() - t0, width: img.width, ...res });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err) });
  } finally {
    if (bitmap.close) bitmap.close();
  }
};
