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
  const tex = sparkleTexture();
  const items = [];
  for (let i = 0; i < count; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color('#ff8fc6'),
    }));
    s.visible = false;
    scene.add(s);
    items.push({ s, life: 0, maxLife: 1, vel: new THREE.Vector3() });
  }
  let cursor = 0, acc = 0;
  const fwd = new THREE.Vector3();
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
        it.s.visible = true;
        it.s.material.color.set(COLORS[(Math.random() * COLORS.length) | 0]);
        it.s.position.copy(carRoot.position)
          .addScaledVector(fwd, -2.3 - Math.random() * 0.6)
          .add(new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.25 + Math.random() * 0.85, (Math.random() - 0.5) * 0.6));
        const back = 0.8 + Math.min(4, speed) * 0.22;
        it.vel.set(
          (Math.random() - 0.5) * 1.2 - fwd.x * back,
          0.5 + Math.random() * 0.9,
          (Math.random() - 0.5) * 1.2 - fwd.z * back
        );
      }
      for (const it of items) {
        if (it.life <= 0) continue;
        it.life -= dt;
        if (it.life <= 0) { it.s.visible = false; continue; }
        it.s.position.addScaledVector(it.vel, dt);
        it.vel.y += dt * 0.6;
        it.vel.multiplyScalar(1 - dt * 1.4);
        const k = it.life / it.maxLife;
        it.s.material.opacity = k * (boost ? 0.95 : 0.75);
        const sc = (0.16 + (1 - k) * 0.42) * (boost ? 1.5 : 1);
        it.s.scale.set(sc, sc, sc);
      }
    },
    reset() {
      for (const it of items) { it.life = 0; it.s.visible = false; }
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

  // ---------------- body shell
  const step = 0.033 / Math.max(0.5, detail);
  const bodyGeo = meshSDF(bodySDF, [-1.32, 0.2, -2.32], [1.32, 1.3, 2.32], step, { color: bodyColor });
  const shell = new THREE.Mesh(bodyGeo, paint);
  shell.name = 'body-shell';
  body.add(shell);
  // The shadow pass gets a coarse, slightly shrunken stand-in (~1/15 of the
  // triangles) — invisible in the colour pass (no colour / depth writes).
  const shadowProxy = new THREE.Mesh(
    meshSDF((x, y, z) => bodySDF(x, y, z, false) + 0.02, [-1.32, 0.2, -2.32], [1.32, 1.3, 2.32], 0.085),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })
  );
  shadowProxy.name = 'body-shadow-proxy';
  body.add(shadowProxy);
  shadowCasters.push(shadowProxy);

  const hit = (o, d) => sdfRaycast(bodySDF, new THREE.Vector3(...o), new THREE.Vector3(...d));
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
      center: new THREE.Vector3(side * 0.9, 0.82, -0.6), normal: n, width: 0.44, height: 0.44, depth: 0.7, flipU: side < 0,
    }), decalMat(unicornTex)));
    decals.add(new THREE.Mesh(projectDecal(bodyGeo, {
      center: new THREE.Vector3(side * 0.9, 0.60, 0.06), normal: n, width: 1.5, height: 0.375, depth: 0.9,
    }), decalMat(letterTex)));
  }
  {
    const h = hit([0, 3, 1.62], [0, -1, 0]);
    decals.add(new THREE.Mesh(projectDecal(bodyGeo, {
      center: h.point, normal: h.normal, up: new THREE.Vector3(0, 0, 1), width: 0.5, height: 0.5, depth: 0.3,
    }), decalMat(roundelTex)));
  }
  body.add(decals);

  // ---------------- headlights (set into the front fenders)
  for (const side of [-1, 1]) {
    const H = HEADLIGHT;
    const h = { point: new THREE.Vector3(side * H.p[0], H.p[1], H.p[2]), normal: new THREE.Vector3(side * H.n[0], H.n[1], H.n[2]).normalize() };
    const g = new THREE.Group();
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.02, 10, 36), chrome);
    const refl = new THREE.Mesh(new THREE.CircleGeometry(0.135, 40), headGlow);
    refl.position.z = -0.045;
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.2, 28, 6, 0, Math.PI * 2, 0, 0.78), glass);
    lens.rotation.x = Math.PI / 2; lens.position.z = -0.135;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 10), new THREE.MeshBasicMaterial({ color: '#fff8e0' }));
    bulb.position.z = -0.03;
    g.add(bezel, refl, lens, bulb);
    mount(g, h, 0.012);
    body.add(g);
    // eyelid trim ring on top of the headlight (Beetle "brow")
    const brow = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.016, 8, 20, Math.PI), chromeSoft);
    brow.position.z = 0.0;
    g.add(brow);
  }

  // ---------------- turn signals on top of the front fenders
  for (const side of [-1, 1]) {
    const h = hit([side * 0.86, 3, 1.62], [0, -1, 0]);
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.09, 4, 12), chrome);
    base.rotation.x = Math.PI / 2; base.scale.set(1, 1, 0.6);
    const lensA = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.07, 4, 12), amberGlow);
    lensA.rotation.x = Math.PI / 2; lensA.position.y = 0.012; lensA.position.z = 0.0;
    g.add(base, lensA);
    g.position.copy(h.point).addScaledVector(h.normal, 0.01);
    body.add(g);
  }

  // ---------------- tail lights (tear drops on the rear fenders)
  const tailLights = [];
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

  // ---------------- bumpers with overriders and rubber strip
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
    const caps = new THREE.Group();
    for (const end of [0, 1]) {
      const p = curve.getPoint(end);
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), chrome);
      c.position.copy(p); c.scale.y = 1.55;
      caps.add(c);
    }
    caps.position.y = 0.47;
    body.add(bar, strip, caps);
    shadowCasters.push(bar);
    for (const sx of [-0.42, 0.42]) {
      const o = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.2, 4, 12), chrome);
      o.position.set(sx, 0.5, zc + zSign * 0.03);
      o.rotation.x = zSign * 0.12;
      body.add(o);
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.2), under);
      bracket.position.set(sx, 0.42, zc - zSign * 0.12);
      body.add(bracket);
    }
  };
  bumper(1);
  bumper(-1);

  // ---------------- running boards
  for (const side of [-1, 1]) {
    const rb = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.06, 1.18, 2, 0.025), rubberPlum);
    rb.position.set(side * 0.93, 0.34, -0.03);
    const trim = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 1.14, 2, 6), chrome);
    trim.rotation.x = Math.PI / 2;
    trim.position.set(side * 1.04, 0.355, -0.03);
    body.add(rb, trim);
  }

  // ---------------- windshield
  const ws = new THREE.Group();
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
    // chrome frame around the pane
    const border = [];
    const R = 0.06;
    const corner = (cu, cv, a0) => {
      for (let k = 0; k <= 6; k++) {
        const a = a0 + (k / 6) * (Math.PI / 2);
        const x = cu + Math.cos(a) * R, y = cv + Math.sin(a) * R;
        const p = surf(x / W + 0.5, y / H);
        border.push(p);
      }
    };
    corner(W / 2 - R, H - R, 0);
    corner(-W / 2 + R, H - R, Math.PI / 2);
    corner(-W / 2 + R, R, Math.PI);
    corner(W / 2 - R, R, Math.PI * 1.5);
    const frameCurve = new THREE.CatmullRomCurve3(border, true, 'centripetal');
    const frame = new THREE.Mesh(new THREE.TubeGeometry(frameCurve, 96, 0.019, 8, true), chrome);
    ws.add(pane, frame);
    // A-pillars down into the body
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CapsuleGeometry(0.024, 0.16, 3, 10), chrome);
      post.position.set(s * (W / 2 - 0.02), -0.04, -bulge);
      ws.add(post);
    }
    // rear-view mirror + fuzzy dice
    const top = surf(0.5, 1);
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), chrome);
    stalk.position.set(0, top.y - 0.05, top.z - 0.02);
    const mirror = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.075, 0.04, 2, 0.018), chrome);
    mirror.position.set(0, top.y - 0.1, top.z - 0.04);
    ws.add(stalk, mirror);
    ws.position.copy(base.point).add(new THREE.Vector3(0, -0.02, 0));
    ws.rotation.x = -rake;
    body.add(ws);
  }
  // dice hang in car space (not tilted with the glass) so they swing plumb
  const dice = new THREE.Group();
  {
    const mirrorWorld = new THREE.Vector3(0, 0.5 - 0.1, -0.04 - 0.0);
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

  // ---------------- side mirrors
  for (const side of [-1, 1]) {
    const h = hit([side * 2, 0.96, 0.36], [-side, 0, 0]);
    const g = new THREE.Group();
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.2, 8), chrome);
    arm.rotation.z = side * 1.05; arm.position.set(side * 0.08, 0.07, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2), chrome);
    head.rotation.x = Math.PI / 2; head.scale.set(1.2, 1, 0.5);
    head.position.set(side * 0.17, 0.13, 0);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), withEnv(new THREE.MeshStandardMaterial({ color: '#cfe8ff', metalness: 1, roughness: 0.05 }), 1.5));
    face.rotation.y = Math.PI; face.scale.set(1.2, 1, 1);
    face.position.set(side * 0.17, 0.13, -0.002);
    g.add(arm, head, face);
    g.position.copy(h.point);
    body.add(g);
  }

  // ---------------- door handles
  for (const side of [-1, 1]) {
    const h = hit([side * 2, 0.9, -0.66], [-side, 0, 0]);
    const g = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.13, 3, 8), chrome);
    handle.rotation.z = Math.PI / 2;
    handle.position.z = 0.02;
    const plate = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.12, 2, 8), chromeSoft);
    plate.rotation.z = Math.PI / 2; plate.scale.set(1, 1, 0.25);
    g.add(handle, plate);
    mount(g, h, 0.0);
    body.add(g);
  }

  // ---------------- interior: floor mat, dash with gauges, steering wheel
  const floor = new THREE.Mesh(new RoundedBoxGeometry(1.24, 0.03, 1.2, 1, 0.012), new THREE.MeshStandardMaterial({ color: '#c22b72', roughness: 0.95 }));
  floor.position.set(0, 0.70, -0.2);
  body.add(floor);
  const dash = new THREE.Mesh(new RoundedBoxGeometry(1.34, 0.14, 0.2, 2, 0.06), creamLeather);
  dash.position.set(0, 0.93, 0.36);
  const dashTop = new THREE.Mesh(new RoundedBoxGeometry(1.36, 0.05, 0.24, 2, 0.022), darkPink);
  dashTop.position.set(0, 1.0, 0.37);
  const gauges = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshStandardMaterial({ map: gaugeTexture(), roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.15, emissiveMap: null }));
  gauges.position.set(-0.4, 0.94, 0.255);
  gauges.rotation.y = Math.PI;
  body.add(dash, dashTop, gauges);

  const wheelHub = new THREE.Group();
  {
    const spin = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.026, 8, 36), creamLeather);
    const grip = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 8, 20, Math.PI * 0.7), darkPink);
    grip.rotation.z = Math.PI * 0.15;
    spin.add(rim, grip);
    for (let i = 0; i < 3; i++) {
      const a = Math.PI / 2 + (i / 3) * Math.PI * 2 + Math.PI;
      const sp = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.13, 2, 6), chrome);
      sp.position.set(Math.cos(a) * 0.085, Math.sin(a) * 0.085, 0);
      sp.rotation.z = a + Math.PI / 2;
      spin.add(sp);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.04, 24), darkPink);
    hub.rotation.x = Math.PI / 2;
    const star = new THREE.Mesh(new THREE.CircleGeometry(0.045, 24), new THREE.MeshStandardMaterial({ map: emblemTex, transparent: true, alphaTest: 0.1, roughness: 0.3 }));
    star.position.z = -0.021; star.rotation.y = Math.PI;
    spin.add(hub, star);
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.28, 10), chromeSoft);
    column.rotation.x = Math.PI / 2; column.position.z = 0.14;
    wheelHub.add(spin, column);
    wheelHub.userData.spin = spin;
    wheelHub.position.set(-0.38, 1.1, 0.1);
    wheelHub.rotation.x = -0.5;
    body.add(wheelHub);
  }

  // ---------------- seats (quilted)
  const quilt = TEX.carQuilt || null;
  if (quilt) { quilt.wrapS = quilt.wrapT = THREE.RepeatWrapping; quilt.colorSpace = THREE.SRGBColorSpace; }
  const seatMat = withEnv(new THREE.MeshStandardMaterial({ color: quilt ? '#ffffff' : '#ffe2ee', map: quilt, roughness: 0.6 }), 0.35);
  const pipingMat = darkPink;
  const seatColliders = []; // car-body space rounded boxes for Lily's ponytail
  for (const x of [-0.37, 0.37]) {
    const seat = new THREE.Group();
    const cushion = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.15, 0.5, 3, 0.06), seatMat);
    cushion.position.set(0, 0.8, -0.28);
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.66, 0.15, 3, 0.065), seatMat);
    back.position.set(0, 1.12, -0.58);
    back.rotation.x = -0.2;
    for (const sx of [-1, 1]) {
      const bol = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.6, 0.18, 2, 0.035), pipingMat);
      bol.position.set(sx * 0.26, 1.13, -0.56);
      bol.rotation.x = -0.2;
      seat.add(bol);
      seatColliders.push({ c: [x + sx * 0.26, 1.13, -0.56], h: [0.04, 0.3, 0.09], r: 0.035, rotX: -0.2 });
    }
    seat.add(cushion, back);
    seatColliders.push({ c: [x, 1.12, -0.58], h: [0.26, 0.33, 0.075], r: 0.065, rotX: -0.2 });
    seat.position.x = x;
    body.add(seat);
    shadowCasters.push(back);
  }
  // rear bench
  {
    const bench = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.14, 0.24, 2, 0.06), seatMat);
    bench.position.set(0, 0.84, -0.74);
    const bback = new THREE.Mesh(new RoundedBoxGeometry(1.22, 0.32, 0.1, 2, 0.045), seatMat);
    bback.position.set(0, 1.0, -0.83);
    bback.rotation.x = -0.15;
    body.add(bench, bback);
    seatColliders.push({ c: [0, 0.84, -0.74], h: [0.6, 0.07, 0.12], r: 0.06, rotX: 0 });
    seatColliders.push({ c: [0, 1.0, -0.83], h: [0.61, 0.16, 0.05], r: 0.045, rotX: -0.15 });
  }

  // ---------------- folded soft-top on the rear deck
  {
    const fab = withEnv(new THREE.MeshStandardMaterial({ color: '#ffffff', map: fabricTexture(), roughness: 0.85 }), 0.3);
    const h = hit([0, 3, -1.0], [0, -1, 0]);
    const g = new THREE.Group();
    const layers = [[0.0, 0.0, 0.12, 1.32], [0.0, 0.13, 0.1, 1.24], [0.05, 0.22, 0.075, 1.12]];
    for (const [dz, dy, r, len] of layers) {
      const roll = new THREE.Mesh(new THREE.CapsuleGeometry(r, len - 2 * r, 6, 18), fab);
      roll.rotation.z = Math.PI / 2;
      roll.position.set(0, dy * 0.6 + r * 0.6, -dz);
      roll.scale.set(1, 1, 1.15);
      g.add(roll);
    }
    for (const sx of [-0.36, 0.36]) {
      const strap = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.014, 5, 20), darkPink);
      strap.rotation.y = Math.PI / 2; strap.scale.set(1, 1.1, 1.2);
      strap.position.set(sx, 0.13, -0.02);
      g.add(strap);
    }
    g.position.copy(h.point).add(new THREE.Vector3(0, -0.04, -0.03));
    body.add(g);
    seatColliders.push({ c: [0, g.position.y + 0.11, g.position.z - 0.02], h: [0.68, 0.17, 0.17], r: 0.12, rotX: 0 });
    shadowCasters.push(g.children[0]);
  }

  // ---------------- engine-lid louvres, lid handle, plate, plate light
  {
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 6; i++) {
        const x = (i - 2.5) * 0.085;
        const h = hit([x, 1.6, -1.42 - row * 0.16], [0, -0.55, -1]);
        if (!h) continue;
        const l = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.11, 0.022, 1, 0.01), darkPink);
        mount(l, h, 0.002);
        l.rotateX(0.0);
        body.add(l);
      }
    }
    const hh = hit([0, 0.9, -3], [0, 0, 1]);
    const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.16, 3, 8), chrome);
    handle.rotation.z = Math.PI / 2;
    const hg = new THREE.Group(); hg.add(handle);
    mount(hg, hh, -0.01);
    body.add(hg);

    const plateTex = decalTex(TEX, 'carPlate', 'plate');
    const ph = hit([0, 0.68, -3], [0, 0, 1]);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.21), withEnv(new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.35, metalness: 0.1 }), 0.5));
    const plateFrame = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.25, 0.02, 1, 0.01), chromeSoft);
    plateFrame.position.z = -0.008;
    const pg = new THREE.Group(); pg.add(plateFrame, plate);
    plate.position.z = 0.004;
    mount(pg, ph, -0.012);
    pg.up.set(0, 1, 0);
    body.add(pg);
    const lightHood = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 3, 8), chrome);
    lightHood.rotation.z = Math.PI / 2;
    lightHood.position.set(0, 0.15, 0.02);
    pg.add(lightHood);
  }

  // ---------------- exhausts + boost flames
  const flames = [];
  for (const x of [-0.5, 0.5]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.3, 16, 1, true), chrome);
    pipe.rotation.x = Math.PI / 2; pipe.position.set(x, 0.34, -2.12);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.058, 20), under);
    inner.position.set(x, 0.34, -2.2); inner.rotation.y = Math.PI;
    const tip = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 6, 16), chrome);
    tip.position.set(x, 0.34, -2.27);
    inner.position.z = -2.25;
    body.add(pipe, inner, tip);
    const f = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.6, 16),
      new THREE.MeshBasicMaterial({ color: '#ffd45e', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    f.rotation.x = -Math.PI / 2;
    f.position.set(x, 0.34, -2.58);
    f.visible = false;
    const fi = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.38, 12),
      new THREE.MeshBasicMaterial({ color: '#ff6fbf', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    fi.position.y = -0.08;
    f.add(fi);
    body.add(f);
    flames.push(f);
  }

  // ---------------- hood bow (satin polka dots)
  {
    const polka = TEX.carPolka || null;
    if (polka) { polka.wrapS = polka.wrapT = THREE.RepeatWrapping; polka.colorSpace = THREE.SRGBColorSpace; }
    const T = 0.22; // metres per texture tile
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

  // ---------------- lollipop antenna on the rear fender
  const antenna = new THREE.Group();
  {
    const h = hit([0.82, 3, -1.62], [0, -1, 0]);
    const base = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), chrome);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.9, 8), chromeSoft);
    stick.position.y = 0.45;
    const lolliTex = TEX.lolliPink || null;
    const lolli = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32),
      [new THREE.MeshStandardMaterial({ color: '#ffd6ea', roughness: 0.3 }), new THREE.MeshPhysicalMaterial({ map: lolliTex, color: lolliTex ? '#ffffff' : '#ff6fb0', roughness: 0.2, clearcoat: 1 }), new THREE.MeshPhysicalMaterial({ map: lolliTex, color: lolliTex ? '#ffffff' : '#ff6fb0', roughness: 0.2, clearcoat: 1 })]
    );
    lolli.rotation.x = Math.PI / 2;
    lolli.position.y = 0.94;
    antenna.add(base, stick, lolli);
    antenna.position.copy(h.point);
    antenna.rotation.z = -0.12;
    body.add(antenna);
  }

  // ---------------- wheels
  const wheels = [];
  const treadN = tireTextures();
  treadN.repeat.set(10, 1);
  const tireMat = new THREE.MeshStandardMaterial({ color: '#3b2836', roughness: 0.82, normalMap: treadN, normalScale: new THREE.Vector2(0.9, 0.9) });
  const wallMat = new THREE.MeshStandardMaterial({ color: '#fff6fa', roughness: 0.55 });
  const rimMat = withEnv(new THREE.MeshPhysicalMaterial({ map: rimFaceTexture(), roughness: 0.3, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }), 0.8);
  const emblemMat = new THREE.MeshStandardMaterial({ map: emblemTex, transparent: true, alphaTest: 0.1, roughness: 0.3, metalness: 0.2 });
  // tyre cross-section (radius, axial) — a rounded balloon tyre
  const tw = 0.15; // half width
  const tireProfile = [];
  for (let i = 0; i <= 14; i++) {
    const a = -Math.PI / 2 + (i / 14) * Math.PI;
    const r = 0.36 + Math.cos(a) * 0.11;
    tireProfile.push(new THREE.Vector2(r, Math.sin(a) * tw * (0.92 + 0.08 * Math.cos(a))));
  }
  const tireGeo = new THREE.LatheGeometry(tireProfile, 44);
  const wallGeo = new THREE.RingGeometry(0.355, 0.42, 44, 1);
  const rimGeo = new THREE.CircleGeometry(0.345, 44);
  const capGeo = new THREE.SphereGeometry(0.21, 32, 6, 0, Math.PI * 2, 0, 0.75);
  const lipGeo = new THREE.TorusGeometry(0.345, 0.018, 6, 44);
  const drumGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.2, 20, 1, true);
  const wheelPos = [
    [-wheelX, wheelY, wheelZf], [wheelX, wheelY, wheelZf],
    [-wheelX, wheelY, wheelZr], [wheelX, wheelY, wheelZr],
  ];
  for (const [x, y, z] of wheelPos) {
    const side = Math.sign(x);
    const steer = new THREE.Group();
    const spin = new THREE.Group();
    // all wheel parts are built around the local +X axle
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    const outer = new THREE.Group(); // outward-facing decorations
    outer.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2; // +Z of 'outer' points outward
    const wall = new THREE.Mesh(wallGeo, wallMat); wall.position.z = tw * 0.86;
    const rim = new THREE.Mesh(rimGeo, rimMat); rim.position.z = tw * 0.55;
    const lip = new THREE.Mesh(lipGeo, chrome); lip.position.z = tw * 0.6;
    const cap = new THREE.Mesh(capGeo, chrome);
    cap.rotation.x = Math.PI / 2; cap.position.z = tw * 0.55 - 0.13;
    const emb = new THREE.Mesh(new THREE.CircleGeometry(0.085, 32), emblemMat);
    emb.position.z = tw * 0.55 - 0.13 + 0.21 + 0.003;
    outer.add(wall, rim, lip, cap, emb);
    const drum = new THREE.Mesh(drumGeo, under);
    drum.rotation.z = Math.PI / 2;
    spin.add(tire, outer, drum);
    steer.add(spin);
    steer.position.set(x, y, z);
    root.add(steer);
    wheels.push({ group: steer, spin, front: z > 0 });
    shadowCasters.push(tire);
  }

  // ---------------- Lily
  const lily = createLily({ TEX, env, emblemTex, unicornTex });
  lily.root.position.set(-0.37, 0.86, -0.3);
  body.add(lily.root);
  lily.setColliders(seatColliders);

  // ---------------- glitter sparkles around the body
  const sparkTex = sparkleTexture();
  const sparks = [];
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sparkTex, transparent: true, opacity: 0.0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color().setHSL(0.92 + Math.random() * 0.1, 0.7, 0.75),
    }));
    const s = 0.1 + Math.random() * 0.2;
    m.scale.set(s, s, s);
    body.add(m);
    sparks.push({ sprite: m, phase: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 1.4, r: 0.9 + Math.random() * 0.85, y: 0.3 + Math.random() * 1.2 });
  }

  // shadows: only the big masses cast (the shadow pass is the first cost on phones)
  root.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
  for (const m of shadowCasters) m.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  for (const m of lily.shadowCasters) m.castShadow = true;
  decals.traverse((o) => { o.receiveShadow = true; });
  const mergeInfo = mergeStatic(body, new Set([shell, shadowProxy, wheelHub, dice, antenna, lily.root, ...flames]));

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
      for (const sp of sparks) {
        const a = t * sp.speed + sp.phase;
        sp.sprite.position.set(Math.cos(a) * sp.r, sp.y + Math.sin(a * 1.7) * 0.25, Math.sin(a * 1.3) * sp.r * 1.6);
        const tw2 = 0.5 + 0.5 * Math.sin(a * 3.1 + t * 2);
        sp.sprite.material.opacity = (boost ? 0.95 : 0.45) * tw2;
        const sc = (boost ? 0.3 : 0.15) * (0.7 + 0.6 * tw2);
        sp.sprite.scale.set(sc, sc, sc);
      }
      paint.emissive.setHex(boost ? 0x66103a : 0x1c0410);
      paint.emissiveIntensity = boost ? 0.55 + Math.sin(t * 18) * 0.15 : 0.22;
    },
  };
}
