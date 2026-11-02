// "Star Racer 7" — Lily's glitter-pink Beetle convertible.
//
// The body is one smooth signed-distance-field mesh (src/sdf.js): a round tub,
// hood and rear-deck domes and four bulging fenders blended together, wheel
// wells and the cockpit carved out with rounded lips. On top of it sit real
// parts — chrome bumpers with overriders, set-in headlights with faceted
// reflectors, tear-drop tail lights, a raked windshield in a chrome frame with
// a mirror and fuzzy dice, quilted seats, a folded soft-top, whitewall tyres
// with tread, pink steel rims and domed hubcaps — plus projected decals (the
// unicorn livery, "STAR RACER 7", the hood roundel) and a satin polka-dot bow.
//
// Paint: clear-coated metallic pink with procedural glitter flakes (a shader
// patch, see addFlakes) under a smooth clearcoat, reflecting a small candy-sky
// environment map that only the car uses.
//
// Car frame: +Z forward, +Y up, ground at y = 0, wheels r = 0.47.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/three/jsm/geometries/RoundedBoxGeometry.js';
import {
  meshSDF, projectDecal, sdfRaycast, mergeStatic,
  sdEllipsoid, sdRoundBox, sdCylX, sdCapsule, smin, smax,
} from './sdf.js';
import { createLily } from './lily.js';
import { BillboardBatch } from './billboards.js';
import { getModelMesh } from './models.js';

// ---------------------------------------------------------------- dimensions
export const CAR_DIM = {
  wheelR: 0.47,
  wheelY: 0.46,
  wheelX: 0.95,
  wheelZf: 1.32,
  wheelZr: -1.38,
  length: 4.5,
  width: 2.36,
};
const { wheelR, wheelY, wheelX, wheelZf, wheelZr } = CAR_DIM;

// ---------------------------------------------------------------- body field
// Cockpit cavity (also used to classify interior faces).
const COCK = { y: 1.31, z: -0.2, hx: 0.68, hy: 0.62, hz: 0.66, r: 0.24 };

// Fender: an arch of elliptical cross-section around the axle (a torus about X).
function sdFender(ax, y, z, xc, zc, R, r, rx) {
  const q = Math.hypot(y - wheelY, z - zc) - R;
  const xx = (ax - xc) * (r / rx);
  return (Math.hypot(q, xx) - r) * Math.min(1, rx / r);
}
const WELL_R = 0.535;
// headlight sockets: recessed bowls in the front pods (centre on the pod
// surface + outward normal, measured on the socket-less field)
const HEADLIGHT = { p: [0.79, 0.84, 2.129], n: [0.05, 0.34, 0.94], depth: 0.1, r: 0.165 };

export function bodySDF(x, y, z, sockets = true) {
  const ax = Math.abs(x);
  // central tub: y 0.38..1.02
  let d = sdRoundBox(x, y - 0.70, z + 0.02, 0.82, 0.32, 1.86, 0.17);
  // hood dome (slopes down to the nose) and rear deck dome (engine lid)
  d = smin(d, sdEllipsoid(x, y - 0.69, z - 1.08, 0.80, 0.37, 1.07), 0.12);
  d = smin(d, sdEllipsoid(x, y - 0.70, z + 1.22, 0.83, 0.43, 0.95), 0.12);
  // four bulbous fender arches + headlight pods / tail-light pods
  d = smin(d, sdFender(ax, y, z, 0.84, wheelZf, 0.59, 0.16, 0.30), 0.16);
  d = smin(d, sdFender(ax, y, z, 0.85, wheelZr, 0.605, 0.17, 0.31), 0.16);
  d = smin(d, sdEllipsoid(ax - 0.78, y - 0.78, z - 1.86, 0.23, 0.22, 0.28), 0.14);
  d = smin(d, sdEllipsoid(ax - 0.80, y - 0.80, z + 1.90, 0.22, 0.24, 0.26), 0.14);
  // wheel wells
  const wf = sdCylX(ax - 0.98, y - wheelY, z - wheelZf, WELL_R, 0.42);
  const wr = sdCylX(ax - 0.98, y - wheelY, z - wheelZr, WELL_R + 0.01, 0.42);
  d = smax(d, -Math.min(wf, wr), 0.10);
  // cockpit with a rounded lip
  d = smax(d, -sdRoundBox(x, y - COCK.y, z - COCK.z, COCK.hx, COCK.hy, COCK.hz, COCK.r), 0.07);
  // flat underside
  d = smax(d, 0.30 - y, 0.09);
  if (sockets) {
    const H = HEADLIGHT, nl = Math.hypot(...H.n);
    const cx = H.p[0] + (H.n[0] / nl) * H.depth, cy = H.p[1] + (H.n[1] / nl) * H.depth, cz = H.p[2] + (H.n[2] / nl) * H.depth;
    const s = Math.hypot(ax - cx, y - cy, z - cz) - H.r;
    d = smax(d, -s, 0.025);
  }
  return d;
}

// Smooth material weights → vertex colours (no saw-toothed material borders).
const C_PAINT = new THREE.Color('#ff4aa2');
const C_INTERIOR = new THREE.Color('#ffd0e4');
const C_UNDER = new THREE.Color('#4a1d3b');
const C_SOCKET = new THREE.Color('#fbe9f2');
const sstep = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
function bodyColor(x, y, z, nx, ny, nz) {
  const ax = Math.abs(x);
  // cockpit interior: close to the cavity surface
  const cav = sdRoundBox(x, y - COCK.y, z - COCK.z, COCK.hx, COCK.hy, COCK.hz, COCK.r);
  const wI = 1 - sstep(0.004, 0.03, cav);
  // wheel-well lining: near the well cylinder and facing the axle
  let wU = 0;
  for (const zc of [wheelZf, wheelZr]) {
    const ry = y - wheelY, rz = z - zc, rl = Math.hypot(ry, rz) || 1;
    const facing = -(ny * ry + nz * rz) / rl;
    const near = 1 - sstep(WELL_R + 0.0, WELL_R + 0.06, rl);
    wU = Math.max(wU, sstep(0.15, 0.55, facing) * near * sstep(0.45, 0.6, ax));
  }
  wU = Math.max(wU, sstep(0.38, 0.32, y) * sstep(-0.2, -0.6, ny));
  // headlight bowls: chrome-white reflector colour
  const H = HEADLIGHT, nl = Math.hypot(...H.n);
  const cx = H.p[0] + (H.n[0] / nl) * H.depth, cy = H.p[1] + (H.n[1] / nl) * H.depth, cz = H.p[2] + (H.n[2] / nl) * H.depth;
  const wS = 1 - sstep(0.0, 0.02, Math.hypot(ax - cx, y - cy, z - cz) - H.r);
  const c = C_PAINT.clone().lerp(C_INTERIOR, wI).lerp(C_UNDER, wU).lerp(C_SOCKET, wS);
  return [c.r, c.g, c.b];
}

// ---------------------------------------------------------------- textures
function canvasTex(w, h, draw, { srgb = true, repeat = null } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.anisotropy = 8;
  return t;
}

// height canvas → tangent-space normal map
function heightToNormal(src, strength = 2) {
  const w = src.width, h = src.height;
  const sd = src.getContext('2d').getImageData(0, 0, w, h).data;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const out = g.createImageData(w, h);
  const H = (x, y) => sd[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength;
      const dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      const l = Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      out.data[i] = (-dx / l * 0.5 + 0.5) * 255;
      out.data[i + 1] = (dy / l * 0.5 + 0.5) * 255;
      out.data[i + 2] = (1 / l * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  g.putImageData(out, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function fallbackDecal(kind) {
  // procedural stand-ins when the generated art did not load
  if (kind === 'lettering') {
    return canvasTex(1024, 256, (g) => {
      g.font = '900 120px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = 22; g.strokeStyle = '#d62278'; g.strokeText('STAR RACER 7', 512, 132);
      g.fillStyle = '#fff8fc'; g.fillText('STAR RACER 7', 512, 132);
    });
  }
  if (kind === 'roundel') {
    return canvasTex(256, 256, (g) => {
      g.fillStyle = '#fff8fc'; g.beginPath(); g.arc(128, 128, 104, 0, 7); g.fill();
      g.lineWidth = 10; g.strokeStyle = '#ff4fa3'; g.stroke();
      g.fillStyle = '#ff4fa3'; g.font = '900 150px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('7', 128, 136);
    });
  }
  if (kind === 'plate') {
    return canvasTex(256, 128, (g) => {
      g.fillStyle = '#fff6fa'; g.fillRect(0, 0, 256, 128);
      g.strokeStyle = '#ff4f96'; g.lineWidth = 10; g.strokeRect(8, 8, 240, 112);
      g.fillStyle = '#e8358c'; g.font = '900 64px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('STAR 7', 128, 68);
    });
  }
  if (kind === 'emblem') {
    return canvasTex(128, 128, (g) => {
      g.fillStyle = '#ffcd48'; g.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 22 : 54, a = -Math.PI / 2 + (i * Math.PI) / 5;
        g.lineTo(64 + Math.cos(a) * r, 66 + Math.sin(a) * r);
      }
      g.fill();
    });
  }
  // unicorn: a white silhouette
  return canvasTex(512, 512, (g) => {
    g.fillStyle = '#fff4fa';
    g.beginPath(); g.arc(270, 280, 120, 0, 7); g.fill();
    g.beginPath(); g.moveTo(170, 200); g.lineTo(90, 40); g.lineTo(230, 170); g.fill();
  });
}

function decalTex(TEX, key, kind) {
  const t = (TEX && TEX[key]) || fallbackDecal(kind);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function tireTextures() {
  // tread: chevron blocks across the band, sidewall: fine ribs
  const hc = document.createElement('canvas');
  hc.width = 256; hc.height = 64;
  const g = hc.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 64);
  g.fillStyle = '#000';
  for (let i = 0; i < 16; i++) {
    const x = i * 16;
    g.beginPath();
    g.moveTo(x, 22); g.lineTo(x + 8, 32); g.lineTo(x, 42); g.lineTo(x + 4, 42); g.lineTo(x + 12, 32); g.lineTo(x + 4, 22);
    g.fill();
  }
  g.fillRect(0, 13, 256, 3); g.fillRect(0, 48, 256, 3);
  // blur a touch so the normals are rounded
  const b = document.createElement('canvas'); b.width = 256; b.height = 64;
  const bg = b.getContext('2d'); bg.filter = 'blur(1px)'; bg.drawImage(hc, 0, 0);
  return heightToNormal(b, 2.5);
}

function reflectorTexture() {
  // faceted headlight reflector (rings + radial facets), emissive-friendly
  return canvasTex(256, 256, (g) => {
    const grd = g.createRadialGradient(128, 128, 6, 128, 128, 128);
    grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.25, '#fff6dc'); grd.addColorStop(0.7, '#f3e3ef'); grd.addColorStop(1, '#c8b6c8');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(150,120,150,0.45)'; g.lineWidth = 2;
    for (let r = 20; r < 128; r += 15) { g.beginPath(); g.arc(128, 128, r, 0, 7); g.stroke(); }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      g.beginPath(); g.moveTo(128 + Math.cos(a) * 20, 128 + Math.sin(a) * 20); g.lineTo(128 + Math.cos(a) * 128, 128 + Math.sin(a) * 128); g.stroke();
    }
    g.fillStyle = '#fffbe8'; g.beginPath(); g.arc(128, 128, 18, 0, 7); g.fill();
  });
}

function tailLensTexture() {
  return canvasTex(128, 128, (g) => {
    g.fillStyle = '#ff2f6b'; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(255,190,210,0.55)'; g.lineWidth = 3;
    for (let y = 8; y < 128; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); }
    for (let x = 8; x < 128; x += 12) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); }
  });
}

function rimFaceTexture() {
  // pink steel wheel face (planar UV on a disc): vent slots + bead ring
  return canvasTex(256, 256, (g) => {
    g.fillStyle = '#ff5aa9'; g.fillRect(0, 0, 256, 256);
    const grd = g.createRadialGradient(128, 128, 30, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,255,255,0.25)'); grd.addColorStop(0.8, 'rgba(255,255,255,0)'); grd.addColorStop(1, 'rgba(120,0,60,0.35)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#4a1838';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.save(); g.translate(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92); g.rotate(a + Math.PI / 2);
      g.beginPath(); g.ellipse(0, 0, 13, 6, 0, 0, 7); g.fill(); g.restore();
    }
    g.strokeStyle = 'rgba(255,230,242,0.9)'; g.lineWidth = 4;
    g.beginPath(); g.arc(128, 128, 118, 0, 7); g.stroke();
  });
}

function fabricTexture() {
  // folded soft-top canvas
  return canvasTex(256, 256, (g) => {
    g.fillStyle = '#fff3f6'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(230,200,215,0.35)' : 'rgba(255,255,255,0.5)';
      g.fillRect(Math.random() * 256, Math.random() * 256, 2, 1);
    }
  }, { repeat: [3, 1] });
}

function gaugeTexture() {
  return canvasTex(256, 128, (g) => {
    g.fillStyle = '#ffe3ef'; g.fillRect(0, 0, 256, 128);
    [[70, 64], [186, 64]].forEach(([x, y], k) => {
      g.fillStyle = '#5a1a44'; g.beginPath(); g.arc(x, y, 50, 0, 7); g.fill();
      g.fillStyle = '#fff6fb'; g.beginPath(); g.arc(x, y, 44, 0, 7); g.fill();
      g.strokeStyle = '#ff4fa3'; g.lineWidth = 3;
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
        g.beginPath(); g.moveTo(x + Math.cos(a) * 34, y + Math.sin(a) * 34); g.lineTo(x + Math.cos(a) * 42, y + Math.sin(a) * 42); g.stroke();
      }
      g.strokeStyle = '#e8358c'; g.lineWidth = 4;
      const a = Math.PI * (k ? 1.3 : 1.9);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 34, y + Math.sin(a) * 34); g.stroke();
      g.fillStyle = '#ffcd48'; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill();
    });
  });
}

function diceFaceTextures(plush) {
  const pipsFor = {
    1: [[64, 64]], 2: [[34, 34], [94, 94]], 3: [[30, 30], [64, 64], [98, 98]],
    4: [[34, 34], [94, 34], [34, 94], [94, 94]], 5: [[32, 32], [96, 32], [64, 64], [32, 96], [96, 96]],
    6: [[34, 28], [94, 28], [34, 64], [94, 64], [34, 100], [94, 100]],
  };
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z  (opposite faces sum to 7)
  return [3, 4, 1, 6, 2, 5].map((n) => {
    const t = canvasTex(128, 128, (g) => {
      if (plush && plush.image) g.drawImage(plush.image, 0, 0, 128, 128);
      else { g.fillStyle = '#fffaf4'; g.fillRect(0, 0, 128, 128); }
      for (const [x, y] of pipsFor[n]) {
        g.fillStyle = '#e8358c'; g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(x - 3, y - 3, 4, 0, 7); g.fill();
      }
    });
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 });
  });
}

export function sparkleTexture() {
  return canvasTex(64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(255,214,240,0.85)');
    grd.addColorStop(1, 'rgba(255,150,210,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.beginPath();
    g.moveTo(32, 4); g.lineTo(38, 26); g.lineTo(60, 32); g.lineTo(38, 38); g.lineTo(32, 60); g.lineTo(26, 38); g.lineTo(4, 32); g.lineTo(26, 26);
    g.closePath(); g.fill();
  }, { srgb: false });
}

// ---------------------------------------------------------------- environment
// A tiny HDR "candy sky" just for the car's reflections: blue sky, warm sun,
// pink ground and two soft-box strips that draw the long highlights along the
// glossy body and the chrome.
let ENV_CACHE = null;
export function carEnvironment(renderer) {
  if (ENV_CACHE) return ENV_CACHE;
  if (!renderer) return null;
  const s = new THREE.Scene();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(50, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `varying vec3 vP;
        void main(){
          vec3 d = normalize(vP);
          vec3 top = vec3(0.30, 0.62, 1.05);
          vec3 hor = vec3(1.05, 0.98, 1.02);
          vec3 gnd = vec3(0.95, 0.55, 0.72);
          vec3 c = d.y > 0.0 ? mix(hor, top, pow(d.y, 0.55)) : mix(hor, gnd, pow(-d.y, 0.35));
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  );
  s.add(sky);
  const lightMat = (k, col = 0xffffff) => {
    const m = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
    m.color.multiplyScalar(k);
    return m;
  };
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 8), lightMat(14, 0xfff0d8));
  sun.position.set(24, 36, -20);
  s.add(sun);
  [[0, 30, 0, 26, 5, -Math.PI / 2, 0], [-30, 14, 8, 22, 6, 0, Math.PI / 2], [30, 12, 14, 18, 5, 0, -Math.PI / 2]].forEach(([x, y, z, w, h, rx, ry]) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), lightMat(2.4));
    p.position.set(x, y, z); p.rotation.set(rx, ry, 0);
    s.add(p);
  });
  const pm = new THREE.PMREMGenerator(renderer);
  ENV_CACHE = pm.fromScene(s, 0.02, 0.1, 100).texture;
  pm.dispose();
  return ENV_CACHE;
}

// ---------------------------------------------------------------- paint flakes
// Glitter flakes: object-space Voronoi-ish cells perturb the base normal (the
// clearcoat keeps the smooth geometric normal), so individual flakes flash as
// the car turns against the sun. Fades out where a cell is under a pixel to
// avoid shimmering at distance.
function addFlakes(mat, { scale = 210, strength = 0.32, density = 0.45 } = {}) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uFlakeScale = { value: scale };
    sh.uniforms.uFlakeStrength = { value: strength };
    sh.uniforms.uFlakeDensity = { value: density };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vObjPos;
        uniform float uFlakeScale, uFlakeStrength, uFlakeDensity;
        uniform mat3 normalMatrix;
        vec3 flakeHash(vec3 p) {
          p = fract(p * vec3(0.1031, 0.1030, 0.0973));
          p += dot(p, p.yxz + 33.33);
          return fract((p.xxy + p.yxx) * p.zyx);
        }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          vec3 q = vObjPos * uFlakeScale;
          vec3 h = flakeHash(floor(q));
          vec3 fw = fwidth(q);
          float fade = 1.0 - smoothstep(0.45, 1.1, max(max(fw.x, fw.y), fw.z));
          float on = step(1.0 - uFlakeDensity, h.z);
          vec3 tilt = normalize(normalMatrix * (flakeHash(floor(q) + 17.0) - 0.5));
          normal = normalize(normal + tilt * uFlakeStrength * on * fade);
        }`);
  };
  mat.customProgramCacheKey = () => `flakes-${scale}-${strength}-${density}`;
  return mat;
}

// ---------------------------------------------------------------- trail
// Pink magic-dust trail behind the car (reference look). Lives in the SCENE,
// not on the car group, so the sparks stay where they were born.
export function createTrail(scene, count = 72) {
  // one instanced draw for the whole trail (was a Sprite + material per spark)
  const batch = new BillboardBatch(scene, sparkleTexture(), count, 'carTrail');
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({ pos: new THREE.Vector3(), color: new THREE.Color('#ff8fc6'), life: 0, maxLife: 1, vel: new THREE.Vector3() });
  }
  let cursor = 0, acc = 0, live = false;
  const fwd = new THREE.Vector3();
  const jitter = new THREE.Vector3();
  const COLORS = ['#ff8fc6', '#ff5fa2', '#c86bff', '#ffe9a8', '#ffffff'];
  return {
    update(dt, carRoot, speed, boost) {
      acc += dt * (boost ? 120 : 58);
      carRoot.getWorldDirection(fwd);
      while (acc >= 1) {
        acc -= 1;
        const it = items[cursor];
        cursor = (cursor + 1) % items.length;
        it.maxLife = it.life = 0.65 + Math.random() * 0.75;
        it.color.set(COLORS[(Math.random() * COLORS.length) | 0]);
        it.pos.copy(carRoot.position)
          .addScaledVector(fwd, -2.3 - Math.random() * 0.6)
          .add(jitter.set((Math.random() - 0.5) * 1.5, 0.25 + Math.random() * 0.85, (Math.random() - 0.5) * 0.6));
        const back = 0.8 + Math.min(4, speed) * 0.22;
        it.vel.set(
          (Math.random() - 0.5) * 1.2 - fwd.x * back,
          0.5 + Math.random() * 0.9,
          (Math.random() - 0.5) * 1.2 - fwd.z * back
        );
      }
      let any = false;
      items.forEach((it, i) => {
        if (it.life <= 0) return;
        any = true;
        it.life -= dt;
        if (it.life <= 0) { batch.hide(i); return; }
        it.pos.addScaledVector(it.vel, dt);
        it.vel.y += dt * 0.6;
        it.vel.multiplyScalar(1 - dt * 1.4);
        const k = it.life / it.maxLife;
        const sc = (0.16 + (1 - k) * 0.42) * (boost ? 1.5 : 1);
        batch.set(i, it.pos, sc, it.color, k * (boost ? 0.95 : 0.75));
      });
      if (any || live) batch.commit();
      live = any;
    },
    reset() {
      items.forEach((it, i) => { it.life = 0; batch.hide(i); });
      batch.commit();
    },
  };
}

// ---------------------------------------------------------------- bow field
function bowSDF(x, y, z) {
  // local frame: x across the car, y up, z forward; knot at the origin
  let d = sdEllipsoid(x, y - 0.005, z, 0.05, 0.048, 0.05);
  for (const s of [-1, 1]) {
    // loop: a puffy ribbon pocket leaning outwards, open towards the front
    const lx = x - s * 0.105, ly = y - 0.03, lz = z;
    const a = -s * 0.38;
    const rx = Math.cos(a) * lx - Math.sin(a) * ly;
    const ry = Math.sin(a) * lx + Math.cos(a) * ly;
    const outer = sdEllipsoid(rx, ry, lz, 0.1, 0.068, 0.05);
    const inner = sdEllipsoid(rx - s * 0.008, ry, lz - 0.04, 0.072, 0.04, 0.045);
    d = smin(d, smax(outer, -inner, 0.012), 0.035);
    // tail ribbon draped down onto the hood
    const tail = sdCapsule(x, y, z, s * 0.025, -0.015, 0.0, s * 0.11, -0.07, 0.07, 0.028);
    d = smin(d, smax(tail, Math.abs(y + 0.045 - (z * 0.0)) - 0.012, 0.008), 0.025);
  }
  return d;
}

// ---------------------------------------------------------------- the car
/**
 * @param {object} [opts]
 * @param {THREE.WebGLRenderer} [opts.renderer]  for the reflection probe
 * @param {object} [opts.TEX]  loaded textures (src/textures.js); null entries fall back
 * @param {number} [opts.detail=1]  1 = full SDF resolution, 0.75 = lighter
 */
export function createCar(opts = {}) {
  const { renderer = null, TEX = {}, detail = 1 } = opts;
  const env = carEnvironment(renderer);
  const root = new THREE.Group();
  root.name = 'star-racer-7';
  const body = new THREE.Group();
  root.add(body);
  const shadowCasters = [];

  // ---------------- materials
  const withEnv = (m, k = 1) => { if (env) { m.envMap = env; m.envMapIntensity = k; } return m; };
  const paint = withEnv(addFlakes(new THREE.MeshPhysicalMaterial({
    color: '#ffffff', vertexColors: true, roughness: 0.42, metalness: 0.35,
    clearcoat: 1, clearcoatRoughness: 0.06,
    emissive: new THREE.Color('#1c0410'), emissiveIntensity: 0.22,
  })), 0.7);
  const under = new THREE.MeshStandardMaterial({ color: '#5a2347', roughness: 0.9 });
  const chrome = withEnv(new THREE.MeshStandardMaterial({ color: '#fff4fa', roughness: 0.08, metalness: 1 }), 1.25);
  const chromeSoft = withEnv(new THREE.MeshStandardMaterial({ color: '#f6e6f0', roughness: 0.22, metalness: 1 }), 1.1);
  const darkPink = withEnv(new THREE.MeshStandardMaterial({ color: '#b51f69', roughness: 0.5, metalness: 0.2 }), 0.5);
  const rubberPlum = new THREE.MeshStandardMaterial({ color: '#4a2240', roughness: 0.8 });
  const creamLeather = withEnv(new THREE.MeshStandardMaterial({ color: '#fff3f8', roughness: 0.55 }), 0.4);
  const glass = withEnv(new THREE.MeshPhysicalMaterial({
    color: '#dff4ff', roughness: 0.02, metalness: 0, transparent: true, opacity: 0.22,
    clearcoat: 1, side: THREE.DoubleSide, depthWrite: false,
  }), 1.4);
  const headGlow = new THREE.MeshStandardMaterial({ map: reflectorTexture(), emissive: '#ffe7b0', emissiveMap: null, emissiveIntensity: 0.45, color: '#f4e6ee', roughness: 0.25, metalness: 0.3 });
  const tailGlow = new THREE.MeshStandardMaterial({ map: tailLensTexture(), color: '#ffffff', emissive: '#ff2a64', emissiveIntensity: 1.2, roughness: 0.25 });
  const amberGlow = new THREE.MeshStandardMaterial({ color: '#ffc46b', emissive: '#ff9a2a', emissiveIntensity: 0.6, roughness: 0.25 });
  const decalMat = (map) => withEnv(new THREE.MeshPhysicalMaterial({
    map, transparent: true, alphaTest: 0.04, roughness: 0.35, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.06,
    depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  }), 0.6);

  const glbBody = getModelMesh('starRacer7', 'CarBody');
  const hasGlb = !!glbBody;

  // ---------------- body shell
  const step = 0.033 / Math.max(0.5, detail);
  const bodyGeo = hasGlb
    ? glbBody.clone()
    : meshSDF(bodySDF, [-1.32, 0.2, -2.32], [1.32, 1.3, 2.32], step, { color: bodyColor });
  const shell = new THREE.Mesh(bodyGeo, paint);
  shell.name = 'body-shell';
  body.add(shell);
  shell.updateMatrixWorld(true);

  // Coarse shrunken shadow proxy (invisible in the colour pass).
  const glbShadow = hasGlb ? getModelMesh('starRacer7', 'CarBodyShadow') : null;
  const shadowProxy = new THREE.Mesh(
    glbShadow
      ? glbShadow.clone()
      : meshSDF((x, y, z) => bodySDF(x, y, z, false) + 0.02, [-1.32, 0.2, -2.32], [1.32, 1.3, 2.32], 0.085),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })
  );
  shadowProxy.name = 'body-shadow-proxy';
  body.add(shadowProxy);
  shadowCasters.push(shadowProxy);

  const raycaster = new THREE.Raycaster();
  const hit = (o, d) => {
    const orig = new THREE.Vector3(...o);
    const dir = new THREE.Vector3(...d).normalize();
    if (hasGlb) {
      raycaster.set(orig, dir);
      const hits = raycaster.intersectObject(shell, false);
      if (hits.length) {
        const nrm = hits[0].normal
          ? hits[0].normal.clone().normalize()
          : hits[0].face.normal.clone().normalize();
        if (nrm.dot(dir) > 0) nrm.negate();
        return { point: hits[0].point.clone(), normal: nrm };
      }
    }
    return sdfRaycast(bodySDF, orig, dir);
  };
  // place an object so its +Z faces along the surface normal at a ray hit
  const mount = (obj, h, sink = 0) => {
    obj.position.copy(h.point).addScaledVector(h.normal, -sink);
    obj.lookAt(obj.position.clone().add(h.normal));
    return obj;
  };

  // ---------------- decals
  const unicornTex = decalTex(TEX, 'carUnicorn', 'unicorn');
  const letterTex = decalTex(TEX, 'carLettering', 'lettering');
  const roundelTex = decalTex(TEX, 'carRoundel', 'roundel');
  const emblemTex = decalTex(TEX, 'carEmblem', 'emblem');
  const decals = new THREE.Group();
  decals.name = 'decals';
  for (const side of [-1, 1]) {
    const n = new THREE.Vector3(side, 0, 0);
    decals.add(new THREE.Mesh(projectDecal(bodyGeo, {
      center: new THREE.Vector3(side * 0.92, 0.86, -0.69), normal: n, width: 0.40, height: 0.40, depth: 0.72, flipU: side < 0,
    }), decalMat(unicornTex)));
    // Centered on pure longitudinal door skin (z in [-0.49, +0.51]) so every letter of "STAR RACER 7" is undistorted!
    decals.add(new THREE.Mesh(projectDecal(bodyGeo, {
      center: new THREE.Vector3(side * 0.90, 0.61, 0.01), normal: n, width: 1.00, height: 0.255, depth: 0.65,
    }), decalMat(letterTex)));
  }
  {
    const h = hit([0, 3, hasGlb ? 1.53 : 1.62], [0, -1, 0]);
    if (h) {
      decals.add(new THREE.Mesh(projectDecal(bodyGeo, {
        center: h.point, normal: h.normal, up: new THREE.Vector3(0, 0, 1), width: 0.48, height: 0.48, depth: 0.32,
      }), decalMat(roundelTex)));
    }
  }
  body.add(decals);

  const bulbMat = new THREE.MeshBasicMaterial({ color: '#fff8e0', toneMapped: false });
  const tailLights = [];
  const flames = [];
  const seatColliders = []; // car-body space rounded boxes for Lily's ponytail
  const quilt = TEX.carQuilt || null;
  if (quilt) { quilt.wrapS = quilt.wrapT = THREE.RepeatWrapping; quilt.colorSpace = THREE.SRGBColorSpace; }
  const seatMat = withEnv(new THREE.MeshStandardMaterial({
    color: quilt ? '#ffffff' : '#ffe4f0',
    map: quilt,
    roughness: 0.56,
    vertexColors: hasGlb,
  }), 0.38);
  const wheelHub = new THREE.Group();
  const ws = new THREE.Group();
  let headAnchor = HEADLIGHT.p;

  if (hasGlb) {
    // =========================================================================
    // Native Blender 4.2 Sculpted Sub-Assemblies (`star-racer-7.glb`)
    // =========================================================================
    headAnchor = [0.79, 0.84, 2.085];

    const glbChrome = getModelMesh('starRacer7', 'ChromeTrim');
    if (glbChrome) {
      const chrMesh = new THREE.Mesh(glbChrome.clone(), chrome);
      chrMesh.name = 'glb-chrome-trim';
      body.add(chrMesh);
      shadowCasters.push(chrMesh);
    }

    const glbPlum = getModelMesh('starRacer7', 'PlumTrim');
    if (glbPlum) {
      const plumTrimMat = withEnv(new THREE.MeshStandardMaterial({
        color: '#b5246b',
        roughness: 0.48,
        metalness: 0.08,
        vertexColors: true,
      }), 0.35);
      const plmMesh = new THREE.Mesh(glbPlum.clone(), plumTrimMat);
      plmMesh.name = 'glb-plum-trim';
      body.add(plmMesh);
    }

    const glbInterior = getModelMesh('starRacer7', 'CreamInterior');
    if (glbInterior) {
      const intMesh = new THREE.Mesh(glbInterior.clone(), seatMat);
      intMesh.name = 'glb-cream-interior';
      body.add(intMesh);
      shadowCasters.push(intMesh);
    }

    const glbBow = getModelMesh('starRacer7', 'HoodBow');
    if (glbBow) {
      const polka = TEX.carPolka || null;
      if (polka) { polka.wrapS = polka.wrapT = THREE.RepeatWrapping; polka.colorSpace = THREE.SRGBColorSpace; }
      const bowMat = withEnv(new THREE.MeshPhysicalMaterial({
        color: polka ? '#ffffff' : '#ff3d94',
        map: polka,
        vertexColors: true,
        roughness: 0.34,
        emissive: '#5a0a30',
        emissiveIntensity: 0.32,
        sheen: 1,
        sheenColor: new THREE.Color('#ffd0e8'),
        sheenRoughness: 0.28,
        clearcoat: 0.35,
      }), 0.65);
      const bowMesh = new THREE.Mesh(glbBow.clone(), bowMat);
      bowMesh.name = 'glb-hood-bow';
      body.add(bowMesh);
      shadowCasters.push(bowMesh);
    }

    // Front smiling candy-grille central star medallion
    {
      const medMat = withEnv(new THREE.MeshStandardMaterial({
        map: emblemTex, transparent: true, alphaTest: 0.08, roughness: 0.28, metalness: 0.22,
      }), 0.7);
      const med = new THREE.Mesh(new THREE.CircleGeometry(0.056, 28), medMat);
      med.position.set(0, 0.555, 2.232);
      body.add(med);
    }

    // Flush inset headlights (reflector + warm filament bulb + domed crystal lens inside ChromeTrim bezel)
    for (const side of [-1, 1]) {
      const h = {
        point: new THREE.Vector3(side * 0.79, 0.832, 2.053),
        normal: new THREE.Vector3(side * 0.06, 0.19, 0.980).normalize(),
      };
      const g = new THREE.Group();
      const refl = new THREE.Mesh(new THREE.CircleGeometry(0.136, 40), headGlow);
      refl.position.z = -0.036;
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.192, 28, 8, 0, Math.PI * 2, 0, 0.78), glass);
      lens.rotation.x = Math.PI / 2;
      lens.position.z = -0.122;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 10), bulbMat);
      bulb.position.z = -0.020;
      g.add(refl, lens, bulb);
      mount(g, h, 0.008);
      body.add(g);
    }

    // Front fender torpedo turn-signal amber jewels (raycast flush on fender crest!)
    for (const side of [-1, 1]) {
      const sh = hit([side * 0.84, 2.2, 1.56], [0, -1, 0]);
      if (sh) {
        const lensA = new THREE.Mesh(new THREE.SphereGeometry(0.029, 14, 10), amberGlow);
        lensA.scale.set(0.88, 0.78, 1.85);
        lensA.position.copy(sh.point).addScaledVector(sh.normal, 0.024).add(new THREE.Vector3(0, 0, 0.01));
        body.add(lensA);
      }
    }

    // Sculpted faceted ruby teardrop taillights — raycast flush onto rear fenders (gleaming in chase view!)
    const innerRubyMat = new THREE.MeshBasicMaterial({ color: '#ffe0ee', toneMapped: false });
    for (const side of [-1, 1]) {
      const th = hit([side * 0.81, 0.78, -3.0], [0, 0, 1]);
      if (th) {
        const g = new THREE.Group();
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.090, 20, 14), tailGlow);
        lens.scale.set(0.94, 1.66, 0.62);
        lens.position.z = 0.014;
        const jewelCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.038, 1), innerRubyMat);
        jewelCore.scale.set(0.85, 1.45, 0.55);
        jewelCore.position.z = 0.028;
        g.add(lens, jewelCore);
        mount(g, th, -0.006);
        body.add(g);
        tailLights.push(lens);
      }
    }

    // Recessed rear license plate ("♥ STAR 7") inside ChromeTrim plate frame
    {
      const plateTex = decalTex(TEX, 'carPlate', 'plate');
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.41, 0.205),
        withEnv(new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.32, metalness: 0.10 }), 0.55)
      );
      plate.position.set(0, 0.671, -2.188);
      plate.rotation.y = Math.PI;
      plate.rotation.x = 0.08;
      body.add(plate);
    }

    // Curved wraparound speedster windshield pane + reflective mirror faces (in exact car space!)
    {
      const W = 1.44, H = 0.49, rake = 0.50, bulge = 0.09;
      const gx = 20, gy = 5;
      const posA = [], uvA = [], idxA = [];
      const surf = (u, v) => {
        const x = (u - 0.5) * W;
        const t = x / (W * 0.5);
        return new THREE.Vector3(x, v * H, -bulge * t * t);
      };
      for (let j = 0; j <= gy; j++) for (let i = 0; i <= gx; i++) {
        const p = surf(i / gx, j / gy);
        posA.push(p.x, p.y, p.z);
        uvA.push(i / gx, j / gy);
      }
      for (let j = 0; j < gy; j++) for (let i = 0; i < gx; i++) {
        const a = j * (gx + 1) + i;
        idxA.push(a, a + 1, a + gx + 1, a + 1, a + gx + 2, a + gx + 1);
      }
      const gg = new THREE.BufferGeometry();
      gg.setAttribute('position', new THREE.Float32BufferAttribute(posA, 3));
      gg.setAttribute('uv', new THREE.Float32BufferAttribute(uvA, 2));
      gg.setIndex(idxA);
      gg.computeVertexNormals();
      const pane = new THREE.Mesh(gg, glass);
      pane.renderOrder = 2;
      ws.add(pane);

      ws.position.set(0, 0.985, 0.49);
      ws.rotation.x = -rake;
      body.add(ws);

      // Center rear-view mirror glass face placed directly on ChromeTrim mirror housing!
      const mirrorFaceMat = withEnv(new THREE.MeshStandardMaterial({ color: '#d6eeff', metalness: 1, roughness: 0.04 }), 1.55);
      const mTopY = 0.985 + (0.98 * H) * Math.cos(-rake);
      const mTopZ = 0.49 + (0.98 * H) * Math.sin(-rake);
      const rvFace = new THREE.Mesh(new THREE.PlaneGeometry(0.235, 0.056), mirrorFaceMat);
      rvFace.position.set(0, mTopY - 0.088, mTopZ - 0.049);
      rvFace.rotation.y = Math.PI;
      body.add(rvFace);

      // Bullet side-mirror reflective faces on back (-Z) of bullet housings
      for (const side of [-1, 1]) {
        const smFace = new THREE.Mesh(new THREE.CircleGeometry(0.054, 20), mirrorFaceMat);
        smFace.scale.set(1.12, 1.0, 1.0);
        smFace.position.set(side * 1.04, 1.105, 0.300);
        smFace.rotation.y = Math.PI;
        body.add(smFace);
      }
    }

    // Cockpit plush floor carpet + illuminated twin circular dashboard gauges
    {
      const floor = new THREE.Mesh(
        new RoundedBoxGeometry(1.24, 0.028, 1.18, 1, 0.012),
        new THREE.MeshStandardMaterial({ color: '#b52368', roughness: 0.92 })
      );
      floor.position.set(0, 0.695, -0.20);
      body.add(floor);

      const gMat = new THREE.MeshStandardMaterial({
        map: gaugeTexture(),
        roughness: 0.32,
        emissive: '#fff4fa',
        emissiveIntensity: 0.22,
      });
      const gauges = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.165), gMat);
      gauges.position.set(-0.39, 0.955, 0.253);
      gauges.rotation.y = Math.PI;
      body.add(gauges);
    }

    // 3D vintage banjo steering wheel (`SteeringWheel` from .glb)
    {
      const spin = new THREE.Group();
      const glbSteer = getModelMesh('starRacer7', 'SteeringWheel');
      if (glbSteer) {
        const steerMat = withEnv(new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          vertexColors: true,
          roughness: 0.28,
          metalness: 0.22,
          clearcoat: 0.7,
          clearcoatRoughness: 0.1,
        }), 0.85);
        spin.add(new THREE.Mesh(glbSteer.clone(), steerMat));
      }
      const star = new THREE.Mesh(
        new THREE.CircleGeometry(0.044, 24),
        new THREE.MeshStandardMaterial({ map: emblemTex, transparent: true, alphaTest: 0.1, roughness: 0.28 })
      );
      star.position.z = -0.028;
      star.rotation.y = Math.PI;
      spin.add(star);

      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.026, 0.28, 12), chromeSoft);
      column.rotation.x = Math.PI / 2;
      column.position.z = 0.14;
      wheelHub.add(spin, column);
      wheelHub.userData.spin = spin;
      wheelHub.position.set(-0.38, 1.10, 0.10);
      wheelHub.rotation.x = -0.50;
      body.add(wheelHub);
    }

    // Seat & soft-top ponytail colliders matching Blender `CreamInterior` + `PlumTrim` geometry!
    for (const x of [-0.37, 0.37]) {
      for (const sx of [-1, 1]) {
        seatColliders.push({ c: [x + sx * 0.235, 1.09, -0.53], h: [0.055, 0.25, 0.095], r: 0.04, rotX: -0.22 });
      }
      seatColliders.push({ c: [x, 1.10, -0.58], h: [0.24, 0.31, 0.075], r: 0.06, rotX: -0.22 });
    }
    seatColliders.push({ c: [0, 0.83, -0.74], h: [0.58, 0.07, 0.12], r: 0.055, rotX: 0 });
    seatColliders.push({ c: [0, 0.99, -0.84], h: [0.58, 0.15, 0.05], r: 0.045, rotX: -0.15 });
    seatColliders.push({ c: [0, 1.06, -1.00], h: [0.64, 0.12, 0.16], r: 0.10, rotX: 0 });

    // Dark inner exhaust bores + quad boost flames aligned with quad chrome tailpipes!
    for (const side of [-1, 1]) {
      for (const dx of [-0.052, 0.052]) {
        const px = side * 0.51 + dx;
        const inner = new THREE.Mesh(new THREE.CircleGeometry(0.036, 16), under);
        inner.position.set(px, 0.335, -2.30);
        inner.rotation.y = Math.PI;
        body.add(inner);
      }
      const f = new THREE.Mesh(
        new THREE.ConeGeometry(0.115, 0.62, 16),
        new THREE.MeshBasicMaterial({ color: '#ffd45e', transparent: true, opacity: 0.86, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      f.rotation.x = -Math.PI / 2;
      f.position.set(side * 0.51, 0.335, -2.59);
      f.visible = false;
      const fi = new THREE.Mesh(
        new THREE.ConeGeometry(0.065, 0.40, 12),
        new THREE.MeshBasicMaterial({ color: '#ff6fbf', transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      fi.position.y = -0.08;
      f.add(fi);
      body.add(f);
      flames.push(f);
    }
  } else {
    // =========================================================================
    // Procedural Fallback (used when .glb models are disabled, e.g. `?tex=0` / offline test)
    // =========================================================================
    for (const side of [-1, 1]) {
      const H = HEADLIGHT;
      const h = { point: new THREE.Vector3(side * H.p[0], H.p[1], H.p[2]), normal: new THREE.Vector3(side * H.n[0], H.n[1], H.n[2]).normalize() };
      const g = new THREE.Group();
      const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.02, 10, 36), chrome);
      const refl = new THREE.Mesh(new THREE.CircleGeometry(0.135, 40), headGlow);
      refl.position.z = -0.045;
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.2, 28, 6, 0, Math.PI * 2, 0, 0.78), glass);
      lens.rotation.x = Math.PI / 2; lens.position.z = -0.135;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 10), bulbMat);
      bulb.position.z = -0.03;
      g.add(bezel, refl, lens, bulb);
      mount(g, h, 0.012);
      body.add(g);
      const brow = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.016, 8, 20, Math.PI), chromeSoft);
      brow.position.z = 0.0;
      g.add(brow);
    }
    for (const side of [-1, 1]) {
      const h = hit([side * 0.86, 3, 1.62], [0, -1, 0]);
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.09, 4, 12), chrome);
      base.rotation.x = Math.PI / 2; base.scale.set(1, 1, 0.6);
      const lensA = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.07, 4, 12), amberGlow);
      lensA.rotation.x = Math.PI / 2; lensA.position.y = 0.012;
      g.add(base, lensA);
      g.position.copy(h.point).addScaledVector(h.normal, 0.01);
      body.add(g);
    }
    for (const side of [-1, 1]) {
      const h = hit([side * 0.82, 0.82, -3], [0, 0, 1]);
      const g = new THREE.Group();
      const bez = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 12), chrome);
      bez.scale.set(1.1, 1.75, 0.5);
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.088, 20, 12), tailGlow);
      lens.scale.set(1.1, 1.75, 0.55); lens.position.z = 0.012;
      g.add(bez, lens);
      mount(g, h, 0.015);
      body.add(g);
      tailLights.push(lens);
    }
    const bumper = (zSign) => {
      const zc = zSign * 2.2;
      const pts = [
        new THREE.Vector3(-1.08, 0, zc - zSign * 0.30),
        new THREE.Vector3(-0.85, 0, zc - zSign * 0.06),
        new THREE.Vector3(-0.4, 0, zc),
        new THREE.Vector3(0.4, 0, zc),
        new THREE.Vector3(0.85, 0, zc - zSign * 0.06),
        new THREE.Vector3(1.08, 0, zc - zSign * 0.30),
      ];
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
      const bar = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.06, 12, false), chrome);
      bar.scale.y = 1.55; bar.position.y = 0.47;
      const strip = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.062, 8, false), rubberPlum);
      strip.scale.set(1, 0.32, 1); strip.position.y = 0.47;
      body.add(bar, strip);
      shadowCasters.push(bar);
    };
    bumper(1);
    bumper(-1);
    for (const side of [-1, 1]) {
      const rb = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.06, 1.18, 2, 0.025), rubberPlum);
      rb.position.set(side * 0.93, 0.34, -0.03);
      body.add(rb);
    }
    {
      const base = hit([0, 3, 0.5], [0, -1, 0]);
      const W = 1.44, H = 0.5, rake = 0.5, bulge = 0.07;
      const gx = 18, gy = 4;
      const posA = [], uvA = [], idxA = [];
      const surf = (u, v) => {
        const x = (u - 0.5) * W;
        const t = x / (W / 2);
        return new THREE.Vector3(x, v * H, -bulge * t * t);
      };
      for (let j = 0; j <= gy; j++) for (let i = 0; i <= gx; i++) {
        const p = surf(i / gx, j / gy);
        posA.push(p.x, p.y, p.z); uvA.push(i / gx, j / gy);
      }
      for (let j = 0; j < gy; j++) for (let i = 0; i < gx; i++) {
        const a = j * (gx + 1) + i;
        idxA.push(a, a + 1, a + gx + 1, a + 1, a + gx + 2, a + gx + 1);
      }
      const gg = new THREE.BufferGeometry();
      gg.setAttribute('position', new THREE.Float32BufferAttribute(posA, 3));
      gg.setAttribute('uv', new THREE.Float32BufferAttribute(uvA, 2));
      gg.setIndex(idxA);
      gg.computeVertexNormals();
      const pane = new THREE.Mesh(gg, glass);
      pane.renderOrder = 2;
      const top = surf(0.5, 1);
      const mirror = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.075, 0.04, 2, 0.018), chrome);
      mirror.position.set(0, top.y - 0.1, top.z - 0.04);
      ws.add(pane, mirror);
      ws.position.copy(base.point).add(new THREE.Vector3(0, -0.02, 0));
      ws.rotation.x = -rake;
      body.add(ws);
    }
    const floor = new THREE.Mesh(new RoundedBoxGeometry(1.24, 0.03, 1.2, 1, 0.012), new THREE.MeshStandardMaterial({ color: '#c22b72', roughness: 0.95 }));
    floor.position.set(0, 0.70, -0.2);
    const dash = new THREE.Mesh(new RoundedBoxGeometry(1.34, 0.14, 0.2, 2, 0.06), creamLeather);
    dash.position.set(0, 0.93, 0.36);
    body.add(floor, dash);
    {
      const spin = new THREE.Group();
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.026, 8, 36), creamLeather);
      spin.add(rim);
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.28, 10), chromeSoft);
      column.rotation.x = Math.PI / 2; column.position.z = 0.14;
      wheelHub.add(spin, column);
      wheelHub.userData.spin = spin;
      wheelHub.position.set(-0.38, 1.1, 0.1);
      wheelHub.rotation.x = -0.5;
      body.add(wheelHub);
    }
    for (const x of [-0.37, 0.37]) {
      const seat = new THREE.Group();
      const cushion = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.15, 0.5, 3, 0.06), seatMat);
      cushion.position.set(0, 0.8, -0.28);
      const back = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.66, 0.15, 3, 0.065), seatMat);
      back.position.set(0, 1.12, -0.58);
      back.rotation.x = -0.2;
      seat.add(cushion, back);
      seatColliders.push({ c: [x, 1.12, -0.58], h: [0.26, 0.33, 0.075], r: 0.065, rotX: -0.2 });
      seat.position.x = x;
      body.add(seat);
      shadowCasters.push(back);
    }
    for (const x of [-0.5, 0.5]) {
      const f = new THREE.Mesh(
        new THREE.ConeGeometry(0.11, 0.6, 16),
        new THREE.MeshBasicMaterial({ color: '#ffd45e', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      f.rotation.x = -Math.PI / 2;
      f.position.set(x, 0.34, -2.58);
      f.visible = false;
      body.add(f);
      flames.push(f);
    }
    {
      const polka = TEX.carPolka || null;
      if (polka) { polka.wrapS = polka.wrapT = THREE.RepeatWrapping; polka.colorSpace = THREE.SRGBColorSpace; }
      const T = 0.22;
      const bowGeo = meshSDF(bowSDF, [-0.32, -0.12, -0.16], [0.32, 0.16, 0.2], 0.0105, {
        uv: (x, y, z, nx, ny, nz) => {
          const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
          if (ax >= ay && ax >= az) return [z / T, y / T];
          if (ay >= az) return [x / T, z / T];
          return [x / T, y / T];
        },
      });
      const bowMat = withEnv(new THREE.MeshPhysicalMaterial({
        color: polka ? '#ffffff' : '#ff3d94', map: polka, roughness: 0.38, emissive: '#5a0a30', emissiveIntensity: 0.35, sheen: 1, sheenColor: new THREE.Color('#ffd0e8'), sheenRoughness: 0.3,
      }), 0.6);
      const bow = new THREE.Mesh(bowGeo, bowMat);
      const h = hit([0.34, 3, 0.86], [0, -1, 0]);
      bow.position.copy(h.point).add(new THREE.Vector3(0, 0.065, 0));
      bow.rotation.set(-0.12, -0.22, 0.03);
      bow.scale.setScalar(1.25);
      body.add(bow);
    }
  }

  // dice hang in car space (not tilted with the glass) so they swing plumb
  const dice = new THREE.Group();
  {
    const mirrorWorld = new THREE.Vector3(0, 0.39, -0.04);
    ws.updateMatrix();
    mirrorWorld.applyMatrix4(ws.matrix);
    dice.position.copy(mirrorWorld);
    const diceMats = diceFaceTextures(TEX.carPlush);
    const dg = new RoundedBoxGeometry(0.11, 0.11, 0.11, 2, 0.03);
    [[-0.05, -0.17, 0.3, 0.5], [0.05, -0.24, 0.9, -0.3]].forEach(([x, y, rx, ry]) => {
      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, -y, 4), creamLeather);
      str.position.set(x * 0.5, y / 2, 0);
      str.rotation.z = -x * 0.6;
      const d = new THREE.Mesh(dg, diceMats);
      d.position.set(x, y - 0.03, 0);
      d.rotation.set(rx, ry, 0.2);
      dice.add(str, d);
    });
    body.add(dice);
  }

  // ---------------- lollipop antenna on the rear fender (with chrome spring base!)
  const antenna = new THREE.Group();
  {
    const h = hit([0.82, 3, -1.62], [0, -1, 0]);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.042, 0.045, 14), chrome);
    base.position.y = 0.018;
    const springCoil = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.007, 6, 14), chrome);
    springCoil.rotation.x = Math.PI / 2;
    springCoil.position.y = 0.052;
    const springCoil2 = new THREE.Mesh(new THREE.TorusGeometry(0.019, 0.006, 6, 14), chrome);
    springCoil2.rotation.x = Math.PI / 2;
    springCoil2.position.y = 0.068;
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.015, 0.88, 10), chromeSoft);
    stick.position.y = 0.48;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.018, 0.032, 12), chrome);
    collar.position.y = 0.79;
    const lolliTex = TEX.lolliPink || null;
    const lolliFaceMat = withEnv(new THREE.MeshPhysicalMaterial({
      map: lolliTex, color: lolliTex ? '#ffffff' : '#ff6fb0', roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06,
    }), 0.8);
    const lolli = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.054, 32),
      [new THREE.MeshStandardMaterial({ color: '#ffd6ea', roughness: 0.26 }), lolliFaceMat, lolliFaceMat]
    );
    lolli.rotation.x = Math.PI / 2;
    lolli.position.y = 0.94;
    antenna.add(base, springCoil, springCoil2, stick, collar, lolli);
    if (h) antenna.position.copy(h.point);
    antenna.rotation.z = -0.12;
    body.add(antenna);
  }

  // ---------------- wheels (true 3D deep-dish Blender wheels when .glb is loaded)
  const wheels = [];
  const treadN = tireTextures();
  treadN.repeat.set(10, 1);
  const glbWheelTire = hasGlb ? getModelMesh('starRacer7', 'WheelTire') : null;
  const glbWheelWall = hasGlb ? getModelMesh('starRacer7', 'WheelWhitewall') : null;
  const glbWheelRim = hasGlb ? getModelMesh('starRacer7', 'WheelRimPink') : null;
  const glbWheelChrome = hasGlb ? getModelMesh('starRacer7', 'WheelChrome') : null;

  const tireMat = new THREE.MeshStandardMaterial({
    color: glbWheelTire ? '#473041' : '#3b2836',
    roughness: 0.80,
    normalMap: treadN,
    normalScale: new THREE.Vector2(0.85, 0.85),
    vertexColors: !!glbWheelTire,
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#fff6fb',
    roughness: 0.48,
    vertexColors: !!glbWheelWall,
  });
  const rimPinkMat = withEnv(new THREE.MeshPhysicalMaterial({
    color: '#ff4f9e',
    roughness: 0.24,
    metalness: 0.28,
    clearcoat: 0.85,
    clearcoatRoughness: 0.07,
    vertexColors: true,
  }), 0.95);
  const emblemMat = new THREE.MeshStandardMaterial({ map: emblemTex, transparent: true, alphaTest: 0.1, roughness: 0.28, metalness: 0.22 });

  let fallbackTireGeo, fallbackWallGeo, fallbackRimGeo, fallbackCapGeo, fallbackLipGeo, fallbackRimMat;
  if (!glbWheelTire) {
    fallbackRimMat = withEnv(new THREE.MeshPhysicalMaterial({ map: rimFaceTexture(), roughness: 0.3, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }), 0.8);
    const tw = 0.15;
    const tireProfile = [];
    for (let i = 0; i <= 14; i++) {
      const a = -Math.PI / 2 + (i / 14) * Math.PI;
      const r = 0.36 + Math.cos(a) * 0.11;
      tireProfile.push(new THREE.Vector2(r, Math.sin(a) * tw * (0.92 + 0.08 * Math.cos(a))));
    }
    fallbackTireGeo = new THREE.LatheGeometry(tireProfile, 44);
    fallbackWallGeo = new THREE.RingGeometry(0.355, 0.42, 44, 1);
    fallbackRimGeo = new THREE.CircleGeometry(0.345, 44);
    fallbackCapGeo = new THREE.SphereGeometry(0.21, 32, 6, 0, Math.PI * 2, 0, 0.75);
    fallbackLipGeo = new THREE.TorusGeometry(0.345, 0.018, 6, 44);
  }
  const drumGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.18, 20, 1, false);
  const wheelPos = [
    [-wheelX, wheelY, wheelZf], [wheelX, wheelY, wheelZf],
    [-wheelX, wheelY, wheelZr], [wheelX, wheelY, wheelZr],
  ];
  for (const [x, y, z] of wheelPos) {
    const side = Math.sign(x);
    const steer = new THREE.Group();
    const spin = new THREE.Group();

    if (glbWheelTire && glbWheelWall && glbWheelRim && glbWheelChrome) {
      const visual = new THREE.Group();
      visual.rotation.y = side > 0 ? 0 : Math.PI;
      const tire = new THREE.Mesh(glbWheelTire, tireMat);
      const wall = new THREE.Mesh(glbWheelWall, wallMat);
      const rim = new THREE.Mesh(glbWheelRim, rimPinkMat);
      const wChr = new THREE.Mesh(glbWheelChrome, chrome);
      const emb = new THREE.Mesh(new THREE.CircleGeometry(0.082, 28), emblemMat);
      emb.rotation.y = Math.PI / 2;
      emb.position.x = 0.145;
      const drum = new THREE.Mesh(drumGeo, under);
      drum.rotation.z = Math.PI / 2;
      drum.position.x = -0.068; // recessed behind concave pink rim dish so dark drum shows ONLY through vent slots!
      visual.add(tire, wall, rim, wChr, emb, drum);
      spin.add(visual);
      shadowCasters.push(tire);
    } else {
      const tw = 0.15;
      const tire = new THREE.Mesh(fallbackTireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      const outer = new THREE.Group();
      outer.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      const wall = new THREE.Mesh(fallbackWallGeo, wallMat); wall.position.z = tw * 0.86;
      const rim = new THREE.Mesh(fallbackRimGeo, fallbackRimMat); rim.position.z = tw * 0.55;
      const lip = new THREE.Mesh(fallbackLipGeo, chrome); lip.position.z = tw * 0.6;
      const cap = new THREE.Mesh(fallbackCapGeo, chrome);
      cap.rotation.x = Math.PI / 2; cap.position.z = tw * 0.55 - 0.13;
      const emb = new THREE.Mesh(new THREE.CircleGeometry(0.085, 32), emblemMat);
      emb.position.z = tw * 0.55 - 0.13 + 0.21 + 0.003;
      outer.add(wall, rim, lip, cap, emb);
      const drum = new THREE.Mesh(drumGeo, under);
      drum.rotation.z = Math.PI / 2;
      spin.add(tire, outer, drum);
      shadowCasters.push(tire);
    }

    steer.add(spin);
    steer.position.set(x, y, z);
    root.add(steer);
    wheels.push({ group: steer, spin, front: z > 0 });
  }

  // ---------------- Lily
  const lily = createLily({ TEX, env, emblemTex, unicornTex });
  lily.root.position.set(-0.37, 0.86, -0.3);
  body.add(lily.root);
  lily.setColliders(seatColliders);

  // ---------------- glitter sparkles around the body
  // one instanced draw in the body's space (was 26 Sprites)
  const sparkBatch = new BillboardBatch(body, sparkleTexture(), 26, 'carGlitter');
  const sparks = [];
  for (let i = 0; i < 26; i++) {
    sparks.push({ pos: new THREE.Vector3(), color: new THREE.Color().setHSL(0.92 + Math.random() * 0.1, 0.7, 0.75), phase: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 1.4, r: 0.9 + Math.random() * 0.85, y: 0.3 + Math.random() * 1.2 });
  }

  // shadows: only the big masses cast (the shadow pass is the first cost on phones)
  root.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
  for (const m of shadowCasters) m.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  for (const m of lily.shadowCasters) m.castShadow = true;
  decals.traverse((o) => { o.receiveShadow = true; });
  const mergeInfo = mergeStatic(body, new Set([shell, shadowProxy, wheelHub, dice, antenna, lily.root, sparkBatch.mesh, ...flames]));

  const shadowBlob = new THREE.Mesh(
    new THREE.CircleGeometry(1.9, 32),
    new THREE.MeshBasicMaterial({ color: 0x2a1030, transparent: true, opacity: 0.24, depthWrite: false })
  );
  shadowBlob.rotation.x = -Math.PI / 2;
  shadowBlob.scale.set(0.72, 1.18, 1);
  shadowBlob.position.y = 0.03;
  root.add(shadowBlob);

  // boost underglow — arcade-racer pool of pink light under the car
  const underglowTex = canvasTex(128, 128, (g) => {
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grd.addColorStop(0, 'rgba(255,150,215,0.9)');
    grd.addColorStop(0.45, 'rgba(255,90,180,0.35)');
    grd.addColorStop(1, 'rgba(255,60,160,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  }, { srgb: false });
  const underglow = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 32),
    new THREE.MeshBasicMaterial({ map: underglowTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.05;
  root.add(underglow);

  // tunnel headlights: one real spot (always in the scene so the light count —
  // and therefore every compiled shader — stays the same; intensity 0 in the
  // open), two additive light beams and brighter reflectors/bulbs.
  const headSpot = new THREE.SpotLight(0xfff1d8, 0, 46, 0.62, 0.55, 1.4);
  headSpot.position.set(0, 0.85, 2.0);
  headSpot.target.position.set(0, -0.6, 16);
  headSpot.castShadow = false;
  root.add(headSpot, headSpot.target);
  const beamTex = canvasTex(16, 128, (g) => {
    const grd = g.createLinearGradient(0, 0, 0, 128); // canvas top = far end (v = 1)
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.55, 'rgba(70,60,45,1)');
    grd.addColorStop(1, 'rgba(255,240,210,1)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 16, 128);
  }, { srgb: false });
  const beamMat = new THREE.MeshBasicMaterial({
    map: beamTex, color: '#fff0d0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false,
  });
  const beams = new THREE.Group();
  {
    // narrow end at the lamp, opening forward (+Z)
    const geo = new THREE.CylinderGeometry(1.5, 0.12, 9, 20, 1, true).rotateX(Math.PI / 2).translate(0, 0, 4.5);
    for (const side of [-1, 1]) {
      const b = new THREE.Mesh(geo, beamMat);
      b.position.set(side * headAnchor[0], headAnchor[1], headAnchor[2] + 0.05);
      b.rotation.x = 0.07; // dipped beams
      b.rotation.y = side * 0.04;
      b.renderOrder = 3;
      beams.add(b);
    }
  }
  beams.visible = false;
  root.add(beams);
  const envMats = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (m && m.envMap && !envMats.some((e) => e.m === m)) envMats.push({ m, k: m.envMapIntensity });
    }
  });
  const GLOW0 = headGlow.emissiveIntensity, BULB0 = bulbMat.color.clone();
  let headK = -1;
  function setHeadlights(k) {
    if (k === headK) return;
    headK = k;
    headSpot.intensity = 70 * k;
    beams.visible = k > 0.02;
    beamMat.opacity = 0.2 * k;
    headGlow.emissiveIntensity = GLOW0 + 3.2 * k;
    bulbMat.color.copy(BULB0).multiplyScalar(1 + 5 * k);
    for (const e of envMats) e.m.envMapIntensity = e.k * (1 - 0.72 * k);
  }

  root.traverse((o) => { o.userData.noCollide = true; }); // the car belongs on the road

  let wheelSpin = 0;
  let diceSwing = 0, diceVel = 0, lastSpeed = 0;
  const stats = () => {
    let tris = 0, meshes = 0;
    root.traverse((o) => {
      if (!o.isMesh) return;
      meshes++;
      const g = o.geometry;
      tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    });
    return { triangles: Math.round(tris), meshes, bodyVertices: bodyGeo.attributes.position.count, merged: mergeInfo };
  };
  return {
    root,
    lily: lily.root,
    lilyRig: lily,
    stats,
    setHeadlights,
    headSpot,
    update(dt, { speed = 0, steer = 0, boost = false, offRoad = false } = {}) {
      const t = performance.now() * 0.001;
      wheelSpin += (speed / wheelR) * dt;
      for (const w of wheels) {
        w.spin.rotation.x = wheelSpin;
        if (w.front) w.group.rotation.y = THREE.MathUtils.lerp(w.group.rotation.y, steer * 0.42, 0.16);
      }
      // body sway & bob
      const sway = THREE.MathUtils.clamp(steer, -1, 1) * 0.075;
      body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, -sway, 0.1);
      body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, offRoad ? Math.sin(wheelSpin * 0.3) * 0.02 : 0, 0.08);
      body.position.y = Math.sin(wheelSpin * 0.15) * 0.012 * Math.min(1, speed / 12);
      // boost flames flicker at the exhausts
      flames.forEach((f, i) => {
        f.visible = !!boost;
        if (boost) {
          const k = 0.75 + Math.abs(Math.sin(t * 31 + i * 1.3)) * 0.5;
          f.scale.set(k, k * 1.2, k);
        }
      });
      // fuzzy dice: damped pendulum driven by steering and acceleration
      const accel = dt > 0 ? (speed - lastSpeed) / dt : 0;
      lastSpeed = speed;
      diceVel += (-diceSwing * 40 - diceVel * 3.5 + steer * 8 - accel * 0.25) * dt;
      diceSwing += diceVel * dt;
      dice.rotation.z = THREE.MathUtils.clamp(diceSwing, -0.6, 0.6);
      dice.rotation.x = THREE.MathUtils.clamp(-accel * 0.01, -0.3, 0.3);
      // steering wheel + Lily
      wheelHub.userData.spin.rotation.z = THREE.MathUtils.lerp(wheelHub.userData.spin.rotation.z, steer * 0.85, 0.12);
      lily.update(dt, { speed, steer, sway, t });
      // taillights flare on boost
      tailGlow.emissiveIntensity = boost ? 1.9 + Math.sin(t * 20) * 0.4 : 1.2;
      // underglow swells on boost
      const ugTarget = boost ? 0.75 + Math.sin(t * 14) * 0.15 : 0;
      underglow.material.opacity = THREE.MathUtils.lerp(underglow.material.opacity, ugTarget, boost ? 0.25 : 0.12);
      underglow.scale.setScalar(boost ? 1.15 + Math.sin(t * 9) * 0.1 : 1);
      // antenna wobble
      antenna.rotation.x = Math.sin(t * 7) * 0.04 * Math.min(1, speed / 10) - Math.min(0.25, speed * 0.008);

      // sparkles
      sparks.forEach((sp, i) => {
        const a = t * sp.speed + sp.phase;
        sp.pos.set(Math.cos(a) * sp.r, sp.y + Math.sin(a * 1.7) * 0.25, Math.sin(a * 1.3) * sp.r * 1.6);
        const tw2 = 0.5 + 0.5 * Math.sin(a * 3.1 + t * 2);
        const sc = (boost ? 0.3 : 0.15) * (0.7 + 0.6 * tw2);
        sparkBatch.set(i, sp.pos, sc, sp.color, (boost ? 0.95 : 0.45) * tw2);
      });
      sparkBatch.commit();
      paint.emissive.setHex(boost ? 0x66103a : 0x1c0410);
      paint.emissiveIntensity = boost ? 0.55 + Math.sin(t * 18) * 0.15 : 0.22;
    },
  };
}
