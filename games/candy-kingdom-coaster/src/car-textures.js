// car-textures.js — the hero car's material library.
//
// Two sources feed it:
//   * the generated art in `assets/textures/car-*.webp` (loaded through
//     textures.js → `TEX`), used for anything that needs real painterly detail
//     (paint with its sparkle swirls, quilted upholstery, the wheel-rim design,
//     satin, helmet, the unicorn door badge, lamp lenses);
//   * procedural canvas maps derived from it at runtime — flake roughness and
//     clearcoat bumps for the glitter lacquer, a roughness companion for every
//     colour map, a chroma-keyed cut-out for the door decals, gauge faces,
//     tyre tread/sidewall art, the exhaust flame, the underglow pool.
//
// Every procedural map has a hand-drawn fallback, so the car still builds (and
// still looks like a candy racer) when the WebP files are missing — the same
// "never block on art" rule the world textures follow.
import * as THREE from 'three';

// ---------------------------------------------------------------- canvas utils
function mk(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}
function g2d(c) {
  return c.getContext('2d', { willReadFrequently: true });
}
/** Canvas → texture with the game's sampling conventions. */
export function texFrom(canvas, { srgb = true, wrap = null, repeat = null, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = wrap || THREE.ClampToEdgeWrapping;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = aniso;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}
/** Draw a loaded texture's image into a square canvas (for luma/key passes). */
function sourceCanvas(sourceTex, size) {
  const c = mk(size, size);
  const g = g2d(c);
  if (sourceTex && sourceTex.image) {
    const img = sourceTex.image;
    const w = img.width || size;
    const h = img.height || size;
    const side = Math.min(w, h);
    g.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, size, size);
  } else {
    g.fillStyle = '#ff77b8';
    g.fillRect(0, 0, size, size);
  }
  return c;
}
const luma = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Brightness of a colour map → roughness map (seams/creases read as rougher). */
function roughnessFrom(sourceTex, { size = 256, lo = 0.24, hi = 0.62, gamma = 1, fallback = '#8a8a8a' } = {}) {
  const src = sourceTex ? sourceCanvas(sourceTex, size) : null;
  const out = mk(size, size);
  const g = g2d(out);
  if (!src) {
    g.fillStyle = fallback;
    g.fillRect(0, 0, size, size);
    return out;
  }
  const sp = g2d(src).getImageData(0, 0, size, size);
  const dst = g.createImageData(size, size);
  for (let i = 0; i < sp.data.length; i += 4) {
    const l = Math.pow(luma(sp.data[i], sp.data[i + 1], sp.data[i + 2]), gamma);
    const v = (lo + (hi - lo) * l) * 255;
    dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = v;
    dst.data[i + 3] = 255;
  }
  g.putImageData(dst, 0, 0);
  return out;
}

/** Alpha cut-out keyed on a flat background colour (the sticker art). */
function chromaKey(sourceTex, { size = 384, key = [1, 0.56, 0.7], tol = 0.16, soft = 0.12 } = {}) {
  const src = sourceCanvas(sourceTex, size);
  const sp = g2d(src).getImageData(0, 0, size, size);
  const out = mk(size, size);
  const g = g2d(out);
  const dst = g.createImageData(size, size);
  const kr = key[0] * 255, kg = key[1] * 255, kb = key[2] * 255;
  const maxD = Math.sqrt(3) * 255;
  for (let i = 0; i < sp.data.length; i += 4) {
    const r = sp.data[i], gg = sp.data[i + 1], b = sp.data[i + 2];
    const d = Math.sqrt((r - kr) ** 2 + (gg - kg) ** 2 + (b - kb) ** 2) / maxD;
    const a = Math.min(1, Math.max(0, (d - tol) / soft));
    dst.data[i] = r;
    dst.data[i + 1] = gg;
    dst.data[i + 2] = b;
    dst.data[i + 3] = Math.round(a * 255);
  }
  g.putImageData(dst, 0, 0);
  return out;
}

/** Height canvas → tangent-space normal map (OpenGL, +Y up). */
function normalFromHeight(heightCanvas, strength = 2.2) {
  const w = heightCanvas.width, h = heightCanvas.height;
  const g = g2d(heightCanvas);
  const src = g.getImageData(0, 0, w, h).data;
  const at = (x, y) => src[((((y + h) % h) * w) + ((x + w) % w)) * 4] / 255;
  const out = mk(w, h);
  const og = g2d(out);
  const dst = og.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * w + x) * 4;
      dst.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      dst.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      dst.data[i + 2] = (1 / len) * 0.5 * 255 + 127;
      dst.data[i + 3] = 255;
    }
  }
  og.putImageData(dst, 0, 0);
  return out;
}

// ------------------------------------------------------- procedural fallbacks
function fallbackPaint(size = 256) {
  const c = mk(size, size);
  const g = g2d(c);
  const grd = g.createLinearGradient(0, 0, size, size);
  grd.addColorStop(0, '#e0338a');
  grd.addColorStop(0.5, '#ff5fae');
  grd.addColorStop(1, '#d12a80');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = 10 + Math.random() * 46;
    g.strokeStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.06})`;
    g.lineWidth = 2 + Math.random() * 5;
    g.beginPath();
    g.arc(x, y, r, Math.random() * 6, Math.random() * 6 + 1.2);
    g.stroke();
  }
  return c;
}
function fallbackInterior(size = 256) {
  const c = mk(size, size);
  const g = g2d(c);
  g.fillStyle = '#ffb9d4';
  g.fillRect(0, 0, size, size);
  const step = size / 4;
  g.lineWidth = 2;
  for (let i = -4; i < 8; i++) {
    g.strokeStyle = 'rgba(233,120,165,0.85)';
    g.beginPath(); g.moveTo(i * step, 0); g.lineTo(i * step + size, size); g.stroke();
    g.beginPath(); g.moveTo(i * step, size); g.lineTo(i * step + size, 0); g.stroke();
  }
  g.fillStyle = 'rgba(255,255,255,0.55)';
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      g.beginPath();
      g.ellipse(x + step / 2, y + step / 2, step * 0.28, step * 0.34, 0, 0, Math.PI * 2);
      g.fill();
    }
  }
  return c;
}
function fallbackRim(size = 256) {
  const c = mk(size, size);
  const g = g2d(c);
  g.fillStyle = '#20202a';
  g.fillRect(0, 0, size, size);
  const cx = size / 2, cy = size / 2;
  g.fillStyle = '#ff6ba8';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    g.save();
    g.translate(cx, cy);
    g.rotate(a);
    g.beginPath();
    g.ellipse(size * 0.26, 0, size * 0.2, size * 0.12, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  const hub = g.createRadialGradient(cx - size * 0.05, cy - size * 0.06, size * 0.02, cx, cy, size * 0.2);
  hub.addColorStop(0, '#ffffff');
  hub.addColorStop(0.45, '#e9eef6');
  hub.addColorStop(1, '#9aa6b8');
  g.fillStyle = hub;
  g.beginPath(); g.arc(cx, cy, size * 0.19, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#f4f7fb';
  g.lineWidth = size * 0.045;
  g.beginPath(); g.arc(cx, cy, size * 0.44, 0, Math.PI * 2); g.stroke();
  return c;
}

// ------------------------------------------------------------------ the maps
/**
 * Build every map the car needs.
 * @param {Record<string, THREE.Texture|null>} TEX loaded game textures
 * @param {{anisotropy?: number}} opts
 */
export function createCarMaps(TEX = {}, { anisotropy = 8 } = {}) {
  const M = {};
  const A = anisotropy;

  // ---- paint: real glitter art + derived flake roughness, clearcoat bumps and
  // a sparkle mask that makes the lacquer twinkle in sunlight.
  const paintCanvas = sourceCanvas(TEX.carPaint, 512);
  if (!TEX.carPaint) {
    const fb = fallbackPaint(512);
    paintCanvas.getContext('2d').drawImage(fb, 0, 0);
  }
  M.paintMap = texFrom(paintCanvas, { srgb: true, wrap: THREE.MirroredRepeatWrapping, aniso: A });

  // flake field: dense tiny bumps, driven by a noise canvas (independent of the
  // colour art so the tile never visibly repeats)
  const flakeH = mk(512, 512);
  {
    const g = g2d(flakeH);
    g.fillStyle = '#8a8a8a';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4200; i++) {
      const x = Math.random() * 512, y = Math.random() * 512, r = 0.6 + Math.random() * 1.5;
      const v = Math.random() < 0.62 ? 210 : 60;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    // a handful of larger "sugar" flakes
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * 512, y = Math.random() * 512, r = 2 + Math.random() * 3.4;
      g.fillStyle = 'rgb(245,245,245)';
      g.beginPath();
      g.moveTo(x, y - r); g.lineTo(x + r * 0.5, y); g.lineTo(x, y + r); g.lineTo(x - r * 0.5, y);
      g.closePath(); g.fill();
    }
  }
  M.paintFlakeNormal = texFrom(normalFromHeight(flakeH, 1.15), { srgb: false, wrap: THREE.MirroredRepeatWrapping, aniso: A });
  M.paintNormal = texFrom(normalFromHeight(paintCanvas, 0.9), { srgb: false, wrap: THREE.MirroredRepeatWrapping, aniso: A });
  M.paintRough = texFrom(roughnessFrom(paintCanvas, { size: 512, lo: 0.24, hi: 0.6, gamma: 0.9 }), {
    srgb: false, wrap: THREE.MirroredRepeatWrapping, aniso: A,
  });
  M.paintSparkle = texFrom(flakeH, { srgb: true, wrap: THREE.MirroredRepeatWrapping, aniso: A });

  // ---- upholstery, satin, helmet: real art + roughness companions
  const interiorCanvas = TEX.carInterior ? sourceCanvas(TEX.carInterior, 512) : fallbackInterior(512);
  M.interiorMap = texFrom(interiorCanvas, { srgb: true, wrap: THREE.MirroredRepeatWrapping, aniso: A });
  M.interiorRough = texFrom(roughnessFrom(TEX.carInterior, { size: 256, lo: 0.38, hi: 0.86, gamma: 1.1, fallback: '#b0b0b0' }), {
    srgb: false, wrap: THREE.MirroredRepeatWrapping, aniso: A,
  });

  const satinCanvas = TEX.carSatin ? sourceCanvas(TEX.carSatin, 256) : (() => {
    const c = mk(256, 256);
    const g = g2d(c);
    const grd = g.createLinearGradient(0, 0, 256, 256);
    grd.addColorStop(0, '#ff9dcb');
    grd.addColorStop(0.5, '#ffd3e7');
    grd.addColorStop(1, '#ff8cc3');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    return c;
  })();
  M.satinMap = texFrom(satinCanvas, { srgb: true, wrap: THREE.MirroredRepeatWrapping, aniso: A });
  M.satinRough = texFrom(roughnessFrom(TEX.carSatin, { size: 128, lo: 0.1, hi: 0.44, fallback: '#5f5f5f' }), {
    srgb: false, wrap: THREE.MirroredRepeatWrapping, aniso: A,
  });

  const helmetCanvas = TEX.carHelmet ? sourceCanvas(TEX.carHelmet, 512) : (() => {
    const c = mk(512, 512);
    const g = g2d(c);
    g.fillStyle = '#ff3f94';
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = '#fff0f7';
    g.lineWidth = 26;
    for (let i = -2; i < 6; i++) {
      g.beginPath(); g.moveTo(i * 140, 0); g.lineTo(i * 140 + 512, 512); g.stroke();
    }
    return c;
  })();
  M.helmetMap = texFrom(helmetCanvas, { srgb: true, wrap: THREE.MirroredRepeatWrapping, aniso: A });
  M.helmetRough = texFrom(roughnessFrom(TEX.carHelmet, { size: 256, lo: 0.08, hi: 0.4, fallback: '#4a4a4a' }), {
    srgb: false, wrap: THREE.MirroredRepeatWrapping, aniso: A,
  });

  // ---- wheel rim: the generated five-petal design + an alpha cut-out derived
  // from its own darkness, so the spokes really are see-through gaps.
  const rimCanvas = TEX.carRim ? sourceCanvas(TEX.carRim, 512) : fallbackRim(512);
  M.rimMap = texFrom(rimCanvas, { srgb: true, aniso: A });
  {
    // Cut-out silhouette for the wheel face. The shape is DRAWN (so it is
    // always clean and predictable) while the generated rim artwork provides
    // the colour underneath; the artwork's own dark gaps are added on top.
    const sil = mk(512, 512);
    {
      const g = g2d(sil);
      const cx = 256, cy = 256;
      g.fillStyle = '#000';
      g.fillRect(0, 0, 512, 512);
      // chrome lip ring
      // solid face (the artwork shows the petals/lip/hub), with five small
      // vent holes between the spokes so the brake disc peeks through
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(cx, cy, 250, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#000';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2 + 0.63;
        g.beginPath();
        g.arc(cx + Math.cos(a) * 128, cy + Math.sin(a) * 128, 27, 0, Math.PI * 2);
        g.fill();
      }
      // soften the edges so alphaTest does not alias
      const blurd = mk(512, 512);
      const bg = g2d(blurd);
      bg.filter = 'blur(2px)';
      bg.drawImage(sil, 0, 0);
      bg.filter = 'none';
      sil.getContext('2d').drawImage(blurd, 0, 0);
    }
    const src = sourceCanvas(TEX.carRim, 512);
    const g = g2d(src);
    const sp = g.getImageData(0, 0, 512, 512);
    const silData = g2d(sil).getImageData(0, 0, 512, 512).data;
    const out = mk(512, 512);
    const og = g2d(out);
    const dst = og.createImageData(512, 512);
    const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const i = (y * 512 + x) * 4;
        const r = sp.data[i], gg = sp.data[i + 1], b = sp.data[i + 2];
        const l = luma(r, gg, b);
        const mx = Math.max(r, gg, b) / 255;
        const mn = Math.min(r, gg, b) / 255;
        const sat = mx > 0.02 ? (mx - mn) / mx : 0;
        const radius = Math.hypot(x - 256, y - 256) / 256;
        const design = silData[i] / 255;                   // the drawn silhouette
        const inside = smooth(0.5, 0.46, radius);          // outside the rim = hole
        const gap = smooth(0.26, 0.36, l);                 // dark gap between the spokes
        const a = design * inside * gap;
        dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = Math.round(a * 255);
        dst.data[i + 3] = 255;
      }
    }
    og.putImageData(dst, 0, 0);
    M.rimAlpha = texFrom(out, { srgb: false, aniso: A });
  }

  // ---- tyre: tread lugs + sidewall lettering (u = around, v = across profile)
  {
    const W = 1024, H = 256;
    const c = mk(W, H);
    const g = g2d(c);
    g.fillStyle = '#38303f';
    g.fillRect(0, 0, W, H);
    // fine rubber grain
    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * W, y = Math.random() * H;
      const v = 40 + Math.random() * 44;
      g.fillStyle = `rgba(${v + 46},${v + 26},${v + 52},0.5)`;
      g.fillRect(x, y, 1.6, 1.6);
    }
    // tread band: V-shaped lugs
    const t0 = H * 0.34, t1 = H * 0.66;
    g.fillStyle = '#2b2333';
    g.fillRect(0, t0 - 2, W, t1 - t0 + 4);
    for (let i = 0; i < 120; i++) {
      const x = (i / 120) * W;
      const y = t0 + 6 + (i % 2) * ((t1 - t0) * 0.5 - 6);
      g.strokeStyle = 'rgba(96,84,110,0.95)';
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(x, t0 + 2);
      g.lineTo(x + 9, t0 + 2);
      g.stroke();
      g.beginPath();
      g.moveTo(x, t1 - 2);
      g.lineTo(x + 9, t1 - 2);
      g.stroke();
      g.strokeStyle = 'rgba(112,98,126,0.8)';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(x + 4, t0 + 4);
      g.lineTo(x + 22, y + 12);
      g.stroke();
    }
    // sidewall lettering ring + a pink sugar stripe
    g.save();
    g.translate(0, H * 0.17);
    g.fillStyle = 'rgba(255,229,243,0.92)';
    g.font = '700 17px "Trebuchet MS", Arial, sans-serif';
    g.textBaseline = 'middle';
    for (let i = 0; i < 5; i++) {
      g.fillText('CANDY RACER', 30 + i * (W / 5), 0);
      g.fillText('★', 30 + i * (W / 5) + 132, 0);
    }
    g.restore();
    g.fillStyle = 'rgba(255,120,190,0.75)';
    g.fillRect(0, H * 0.255, W, 3);
    g.fillRect(0, H * 0.74, W, 3);
    g.fillStyle = 'rgba(255,229,243,0.5)';
    g.font = '700 13px "Trebuchet MS", Arial, sans-serif';
    for (let i = 0; i < 6; i++) g.fillText('SUGAR RIDE 7', 60 + i * (W / 6), H * 0.86);
    M.tireMap = texFrom(c, { srgb: true, wrap: THREE.RepeatWrapping, aniso: A });
    // roughness: tread is dead matte, sidewalls a touch satin
    const rc = mk(256, 64);
    const rg = g2d(rc);
    rg.fillStyle = '#a6a6a6';
    rg.fillRect(0, 0, 256, 64);
    rg.fillStyle = '#e8e8e8';
    rg.fillRect(0, 20, 256, 24);
    M.tireRough = texFrom(rc, { srgb: false, wrap: THREE.RepeatWrapping, aniso: 4 });
    M.tireNormal = texFrom(normalFromHeight(c, 0.6), { srgb: false, wrap: THREE.RepeatWrapping, aniso: A });
  }

  // ---- lamps: real lens art with a soft falloff to the panel edge
  M.headlightMap = texFrom(TEX.carHeadlight ? sourceCanvas(TEX.carHeadlight, 256) : (() => {
    const c = mk(256, 256);
    const g = g2d(c);
    const grd = g.createRadialGradient(112, 104, 6, 128, 128, 128);
    grd.addColorStop(0, '#fffdf2');
    grd.addColorStop(0.55, '#ffeec4');
    grd.addColorStop(0.86, '#c8bda4');
    grd.addColorStop(1, '#4a4038');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    return c;
  })(), { srgb: true, aniso: A });
  M.taillightMap = texFrom(TEX.carTaillight ? sourceCanvas(TEX.carTaillight, 256) : (() => {
    const c = mk(256, 256);
    const g = g2d(c);
    g.fillStyle = '#3a0a16'; g.fillRect(0, 0, 256, 256);
    const grd = g.createRadialGradient(128, 128, 8, 128, 128, 118);
    grd.addColorStop(0, '#ffd9e4');
    grd.addColorStop(0.32, '#ff3d68');
    grd.addColorStop(0.8, '#c0113c');
    grd.addColorStop(1, '#43081a');
    g.fillStyle = grd;
    g.beginPath(); g.arc(128, 128, 120, 0, Math.PI * 2); g.fill();
    return c;
  })(), { srgb: true, aniso: A });

  // ---- door decal: unicorn sticker (chroma-keyed) + race lettering, one plate
  {
    const W = 1024, H = 512;
    const c = mk(W, H);
    const g = g2d(c);
    if (TEX.carUnicorn) {
      const keyed = chromaKey(TEX.carUnicorn, { size: 384, tol: 0.14, soft: 0.1 });
      g.drawImage(keyed, 40, 90, 330, 330);
    } else {
      g.save();
      g.translate(200, 256);
      g.fillStyle = '#fff6fb';
      g.beginPath(); g.arc(0, 0, 150, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ff5fae';
      g.beginPath(); g.moveTo(-20, -120); g.lineTo(10, -230); g.lineTo(40, -120); g.closePath(); g.fill();
      g.restore();
    }
    // "STAR RACER" in a soft script over a pink brush swipe
    g.save();
    g.translate(400, 150);
    g.fillStyle = 'rgba(255,255,255,0.9)';
    g.beginPath();
    g.moveTo(-6, 10);
    g.quadraticCurveTo(210, -34, 430, 4);
    g.quadraticCurveTo(560, 26, 600, 18);
    g.lineTo(596, 58);
    g.quadraticCurveTo(430, 74, 190, 62);
    g.quadraticCurveTo(60, 56, -8, 44);
    g.closePath();
    g.fill();
    g.fillStyle = '#e0247d';
    g.font = 'italic 900 76px "Trebuchet MS", Arial, sans-serif';
    g.fillText('Star', 6, 62);
    g.fillStyle = '#7a1b53';
    g.font = 'italic 900 68px "Trebuchet MS", Arial, sans-serif';
    g.fillText('Racer', 176, 60);
    g.font = 'italic 900 40px "Trebuchet MS", Arial, sans-serif';
    g.fillStyle = '#ff9ecb';
    g.fillText('Star', 8, 64);
    g.fillStyle = '#ff5fae';
    g.fillText('Racer', 178, 62);
    // number roundel
    g.translate(690, 130);
    g.fillStyle = '#fff6fb';
    g.beginPath(); g.arc(0, 0, 108, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#ff3f94';
    g.lineWidth = 14;
    g.beginPath(); g.arc(0, 0, 100, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#ff2f8b';
    g.font = '900 150px "Trebuchet MS", Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('7', 2, 6);
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.restore();
    // sparkles
    g.fillStyle = 'rgba(255,255,255,0.95)';
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * W, y = Math.random() * H;
      const r = 3 + Math.random() * 9;
      g.beginPath();
      g.moveTo(x, y - r); g.lineTo(x + r * 0.4, y); g.lineTo(x, y + r); g.lineTo(x - r * 0.4, y);
      g.closePath(); g.fill();
    }
    M.decalMap = texFrom(c, { srgb: true, aniso: A });
  }

  // ---- instrument faces
  const dial = (label, ticks, numbers, needleColor) => {
    const S = 256;
    const c = mk(S, S);
    const g = g2d(c);
    g.clearRect(0, 0, S, S);
    const grd = g.createRadialGradient(S * 0.42, S * 0.38, S * 0.05, S * 0.5, S * 0.5, S * 0.5);
    grd.addColorStop(0, '#fffaf1');
    grd.addColorStop(1, '#f0d9c8');
    g.fillStyle = grd;
    g.beginPath(); g.arc(S / 2, S / 2, S * 0.5, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#c98bb0';
    g.lineWidth = S * 0.03;
    g.beginPath(); g.arc(S / 2, S / 2, S * 0.475, 0, Math.PI * 2); g.stroke();
    g.save();
    g.translate(S / 2, S / 2);
    for (let i = 0; i <= ticks; i++) {
      const a = Math.PI * 0.75 + (i / ticks) * Math.PI * 1.5;
      const minor = i % (ticks / 6) !== 0;
      const r0 = S * (minor ? 0.36 : 0.3);
      const r1 = S * 0.44;
      g.strokeStyle = minor ? 'rgba(120,70,100,0.55)' : '#5a2a48';
      g.lineWidth = minor ? S * 0.008 : S * 0.018;
      g.beginPath();
      g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      g.stroke();
    }
    if (numbers) {
      g.fillStyle = '#5a2a48';
      g.font = `900 ${S * 0.11}px "Trebuchet MS", Arial, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      for (let i = 0; i <= 6; i++) {
        const a = Math.PI * 0.75 + (i / 6) * Math.PI * 1.5;
        g.fillText(String(i * 20), Math.cos(a) * S * 0.24, Math.sin(a) * S * 0.24);
      }
    }
    g.fillStyle = '#7a2a55';
    g.font = `900 ${S * 0.1}px "Trebuchet MS", Arial, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label, 0, S * 0.2);
    g.restore();
    g.strokeStyle = needleColor;
    g.lineWidth = S * 0.035;
    g.lineCap = 'round';
    g.save();
    g.translate(S / 2, S / 2);
    g.rotate(Math.PI * 0.75 + Math.PI * 1.5 * 0.08);
    g.beginPath();
    g.moveTo(-S * 0.06, 0);
    g.lineTo(S * 0.42, 0);
    g.stroke();
    g.restore();
    g.fillStyle = '#e8d3c0';
    g.beginPath(); g.arc(S / 2, S / 2, S * 0.05, 0, Math.PI * 2); g.fill();
    return c;
  };
  M.gaugeSpeed = texFrom(dial('km/h', 24, true, '#e8276f'), { srgb: true, aniso: A });
  M.gaugeStar = texFrom(dial('SWEETS', 12, false, '#ffb03a'), { srgb: true, aniso: A });

  // ---- number plate: candy chrome with the car's "★ 7"
  {
    const c = mk(256, 128);
    const g = g2d(c);
    const grd = g.createLinearGradient(0, 0, 0, 128);
    grd.addColorStop(0, '#fffdf8');
    grd.addColorStop(0.5, '#ffe9f3');
    grd.addColorStop(1, '#ffd0e4');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 128);
    g.strokeStyle = '#ff4f96';
    g.lineWidth = 9;
    g.strokeRect(7, 7, 242, 114);
    g.fillStyle = '#e8358c';
    g.font = '900 74px "Trebuchet MS", Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('★ 7', 128, 68);
    M.plateMap = texFrom(c, { srgb: true, aniso: A });
  }

  // ---- effects: exhaust flame, underglow pool, sparkle sprite
  {
    const c = mk(128, 128);
    const g = g2d(c);
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.3, 'rgba(255,226,140,0.95)');
    grd.addColorStop(0.62, 'rgba(255,120,196,0.55)');
    grd.addColorStop(1, 'rgba(255,80,180,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    M.flameMap = texFrom(c, { srgb: true, aniso: 4 });

    const u = mk(128, 128);
    const ug = g2d(u);
    const ugrd = ug.createRadialGradient(64, 64, 4, 64, 64, 62);
    ugrd.addColorStop(0, 'rgba(255,150,215,0.9)');
    ugrd.addColorStop(0.45, 'rgba(255,90,180,0.35)');
    ugrd.addColorStop(1, 'rgba(255,60,160,0)');
    ug.fillStyle = ugrd;
    ug.fillRect(0, 0, 128, 128);
    M.underglowMap = texFrom(u, { srgb: true, aniso: 4 });

    const s = mk(64, 64);
    const sg = g2d(s);
    const sgrd = sg.createRadialGradient(32, 32, 2, 32, 32, 30);
    sgrd.addColorStop(0, 'rgba(255,255,255,1)');
    sgrd.addColorStop(0.25, 'rgba(255,214,240,0.85)');
    sgrd.addColorStop(1, 'rgba(255,150,210,0)');
    sg.fillStyle = sgrd; sg.fillRect(0, 0, 64, 64);
    sg.fillStyle = 'rgba(255,255,255,0.95)';
    sg.beginPath();
    sg.moveTo(32, 4); sg.lineTo(38, 26); sg.lineTo(60, 32); sg.lineTo(38, 38);
    sg.lineTo(32, 60); sg.lineTo(26, 38); sg.lineTo(4, 32); sg.lineTo(26, 26);
    sg.closePath(); sg.fill();
    M.sparkleMap = texFrom(s, { srgb: true, aniso: 4 });
  }

  // ---- soft radial shading used by the fabric/scarf pieces
  {
    const c = mk(64, 64);
    const g = g2d(c);
    const grd = g.createRadialGradient(32, 32, 1, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,0.85)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    M.softBlob = texFrom(c, { srgb: true, aniso: 4 });
  }

  Object.assign(M, { anisotropy: A });
  return M;
}

/**
 * A tiny procedural studio environment (PMREM) so chrome and clearcoat have
 * something to reflect — the game scene has no IBL of its own. Rendered once
 * at boot from a canvas equirect: pastel sky, warm sun, candy-pink ground.
 */
export function createCarEnvironment(renderer) {
  if (!renderer || !THREE.PMREMGenerator) return null;
  try {
    const W = 512, H = 256;
    const c = mk(W, H);
    const g = g2d(c);
    const sky = g.createLinearGradient(0, 0, 0, H * 0.55);
    sky.addColorStop(0, '#8fc9f2');
    sky.addColorStop(0.55, '#dff1ff');
    sky.addColorStop(1, '#fff6fb');
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H * 0.55);
    const ground = g.createLinearGradient(0, H * 0.55, 0, H);
    ground.addColorStop(0, '#f6d8ea');
    ground.addColorStop(0.18, '#c093b1');
    ground.addColorStop(1, '#6f4f66');
    g.fillStyle = ground;
    g.fillRect(0, H * 0.55, W, H * 0.45);
    g.fillStyle = 'rgba(40,20,40,0.55)';
    g.fillRect(0, H * 0.545, W, H * 0.03);
    // warm sun + a soft studio-ish highlight band (reads as a long sky stripe
    // along the car's flank — the classic car-render reflection)
    const sun = g.createRadialGradient(W * 0.74, H * 0.18, 2, W * 0.74, H * 0.18, H * 0.22);
    sun.addColorStop(0, 'rgba(255,248,224,1)');
    sun.addColorStop(0.4, 'rgba(255,236,190,0.55)');
    sun.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = sun;
    g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,255,255,0.5)';
    g.fillRect(0, H * 0.16, W, H * 0.035);
    g.fillStyle = 'rgba(255,255,255,0.28)';
    g.fillRect(0, H * 0.46, W, H * 0.02);

    const equirect = new THREE.CanvasTexture(c);
    equirect.mapping = THREE.EquirectangularReflectionMapping;
    equirect.colorSpace = THREE.SRGBColorSpace;
    equirect.needsUpdate = true;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(equirect).texture;
    pmrem.dispose();
    equirect.dispose();
    return env;
  } catch (err) {
    console.warn('[CKC] car environment map failed:', err && err.message);
    return null;
  }
}
