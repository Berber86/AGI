// Lily — the chibi driver of Star Racer 7.
// Open-face unicorn helmet (SDF shell with a padded face rim, spiral golden
// horn, ears, a rainbow mane crest and unicorn decals), a painted cartoon face
// (big glossy eyes, blush, open smile), bangs, a long wind-blown ponytail, a
// racing suit and arms that really hold the steering wheel.
//
// Local frame: origin on the seat cushion under her hips, +Z forward.
import * as THREE from 'three';
import { meshSDF, projectDecal, taperedTube, sdEllipsoid, smax, mergeStatic } from './sdf.js';
import { createPonytail } from './ponytail.js';

const HEAD = new THREE.Vector3(0, 0.70, -0.08); // head centre
const HEAD_R = 0.215;
const HELMET_C = new THREE.Vector3(0, 0.735, -0.095);

function faceTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  // blush
  for (const x of [256 - 132, 256 + 132]) {
    const grd = g.createRadialGradient(x, 176, 2, x, 176, 34);
    grd.addColorStop(0, 'rgba(255,120,150,0.55)'); grd.addColorStop(1, 'rgba(255,120,150,0)');
    g.fillStyle = grd; g.beginPath(); g.ellipse(x, 176, 40, 26, 0, 0, 7); g.fill();
  }
  for (const s of [-1, 1]) {
    const x = 256 + s * 82, y = 122;
    // sclera
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(x, y, 38, 47, 0, 0, 7); g.fill();
    // iris
    const ir = g.createRadialGradient(x, y + 8, 4, x, y + 4, 34);
    ir.addColorStop(0, '#c98a4a'); ir.addColorStop(0.55, '#7a4220'); ir.addColorStop(1, '#3b1c10');
    g.fillStyle = ir;
    g.beginPath(); g.ellipse(x + s * 2, y + 5, 31, 40, 0, 0, 7); g.fill();
    g.fillStyle = '#1e0c08';
    g.beginPath(); g.ellipse(x + s * 2, y + 8, 15, 21, 0, 0, 7); g.fill();
    // highlights
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(x - 10, y - 12, 12, 14, 0, 0, 7); g.fill();
    g.beginPath(); g.arc(x + 10, y + 20, 5, 0, 7); g.fill();
    // upper lash line + lashes
    g.strokeStyle = '#2a120c'; g.lineCap = 'round';
    g.lineWidth = 9;
    g.beginPath(); g.ellipse(x, y + 2, 41, 50, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.lineWidth = 6;
    for (let k = 0; k < 3; k++) {
      const a = s > 0 ? -0.55 + k * 0.28 : Math.PI + 0.55 - k * 0.28;
      const ex = x + Math.cos(s > 0 ? -0.35 + k * 0.0 : Math.PI + 0.35) * 34;
      const sx0 = ex + (s > 0 ? -k * 8 : k * 8), sy0 = y - 30 + k * 7;
      g.beginPath(); g.moveTo(sx0, sy0); g.lineTo(sx0 + Math.cos(a) * 14, sy0 + Math.sin(a) * 14 - 4); g.stroke();
    }
    // eyebrow
    g.strokeStyle = '#6b3a22'; g.lineWidth = 7;
    g.beginPath(); g.arc(x, y - 18, 40, Math.PI * 1.3, Math.PI * 1.7); g.stroke();
  }
  // nose
  g.strokeStyle = 'rgba(200,110,90,0.8)'; g.lineWidth = 4;
  g.beginPath(); g.arc(256, 168, 6, 0.2, Math.PI - 0.2); g.stroke();
  // open smile
  g.fillStyle = '#9c2a3c';
  g.beginPath(); g.moveTo(222, 196); g.quadraticCurveTo(256, 250, 290, 196); g.quadraticCurveTo(256, 204, 222, 196); g.fill();
  g.fillStyle = '#ffffff';
  g.beginPath(); g.moveTo(228, 198); g.quadraticCurveTo(256, 206, 284, 198); g.lineTo(282, 204); g.quadraticCurveTo(256, 210, 230, 204); g.fill();
  g.fillStyle = '#ff7f96';
  g.beginPath(); g.ellipse(256, 226, 16, 8, 0, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// spiral unicorn horn: a cone with two twisting ridges
function hornGeometry(h = 0.2, r0 = 0.04, rings = 40, seg = 24) {
  const pos = [], idx = [];
  for (let i = 0; i <= rings; i++) {
    const v = i / rings;
    const base = r0 * Math.pow(1 - v, 0.85) + 0.002;
    for (let j = 0; j < seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      const r = base * (1 + 0.16 * Math.sin(2 * a + v * 22));
      pos.push(Math.cos(a) * r, v * h, Math.sin(a) * r);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * seg + j, b = i * seg + ((j + 1) % seg);
      const c = a + seg, d = b + seg;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function helmetSDF(x, y, z) {
  let d = sdEllipsoid(x, y, z, 0.268, 0.262, 0.282);
  d = smax(d, -sdEllipsoid(x, y + 0.004, z, 0.238, 0.232, 0.252), 0.01);
  // open face
  d = smax(d, -sdEllipsoid(x, y + 0.075, z - 0.2, 0.185, 0.15, 0.22), 0.035);
  // bottom edge
  d = smax(d, -0.165 - y, 0.03);
  return d;
}

export function createLily({ TEX = {}, env = null, emblemTex = null, unicornTex = null } = {}) {
  const root = new THREE.Group();
  root.name = 'lily';
  const shadowCasters = [];
  const withEnv = (m, k = 1) => { if (env) { m.envMap = env; m.envMapIntensity = k; } return m; };

  const skin = new THREE.MeshStandardMaterial({ color: '#ffe0cc', roughness: 0.6, emissive: '#ffd8c4', emissiveIntensity: 0.28 });
  const suit = withEnv(new THREE.MeshPhysicalMaterial({ color: '#ff6fb3', roughness: 0.45, sheen: 0.8, sheenColor: new THREE.Color('#ffd0e6') }), 0.4);
  const suitWhite = withEnv(new THREE.MeshStandardMaterial({ color: '#fff4f9', roughness: 0.5 }), 0.4);
  const hair = withEnv(new THREE.MeshPhysicalMaterial({ color: '#7a4630', roughness: 0.42, sheen: 1, sheenColor: new THREE.Color('#c88a5a'), sheenRoughness: 0.35 }), 0.35);
  const helmetPaint = withEnv(new THREE.MeshPhysicalMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.3, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 }), 0.9);
  const helmetPad = new THREE.MeshStandardMaterial({ color: '#fff0f6', roughness: 0.7 });
  const earMat = withEnv(new THREE.MeshPhysicalMaterial({ color: '#ff5aa9', roughness: 0.3, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 }), 0.9);
  const gold = withEnv(new THREE.MeshStandardMaterial({ color: '#ffd166', roughness: 0.22, metalness: 0.85, emissive: '#5a3a00', emissiveIntensity: 0.25 }), 1.2);

  // ---- torso (reclined against the seat back)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.145, 0.2, 6, 18), suit);
  torso.scale.set(1.18, 1, 0.88);
  torso.position.set(0, 0.27, -0.14);
  torso.rotation.x = -0.2;
  shadowCasters.push(torso);
  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.022, 8, 32), suitWhite);
  stripe.rotation.x = Math.PI / 2 - 0.2; stripe.scale.set(1.17, 0.88, 1);
  stripe.position.set(0, 0.3, -0.135);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.025, 8, 24), suitWhite);
  collar.rotation.x = Math.PI / 2 - 0.2;
  collar.position.set(0, 0.47, -0.17);
  root.add(torso, stripe, collar);
  if (emblemTex) {
    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.05, 24), new THREE.MeshStandardMaterial({ map: emblemTex, transparent: true, alphaTest: 0.1, roughness: 0.4 }));
    badge.position.set(-0.07, 0.36, -0.005); badge.rotation.x = -0.2;
    root.add(badge);
  }
  // thighs reaching under the dash
  for (const s of [-1, 1]) {
    const leg = taperedTube(new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.08, 0.08, -0.12), new THREE.Vector3(s * 0.09, 0.1, 0.12), new THREE.Vector3(s * 0.1, 0.06, 0.36),
    ]), 12, 12, (t) => 0.075 - t * 0.012);
    root.add(new THREE.Mesh(leg, suit));
  }

  // ---- arms to the 10-and-2 grip of the steering wheel
  const hands = [];
  for (const s of [-1, 1]) {
    const shoulder = new THREE.Vector3(s * 0.165, 0.42, -0.16);
    const elbow = new THREE.Vector3(s * 0.24, 0.3, 0.06);
    const hand = new THREE.Vector3(s * 0.145, 0.33, 0.29);
    const arm = taperedTube(new THREE.CatmullRomCurve3([shoulder, elbow, hand]), 16, 12, (t) => 0.058 - t * 0.016);
    root.add(new THREE.Mesh(arm, suit));
    const sh = new THREE.Mesh(new THREE.SphereGeometry(0.064, 16, 12), suit);
    sh.position.copy(shoulder);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.014, 8, 16), suitWhite);
    cuff.position.copy(hand).lerp(elbow, 0.12);
    cuff.lookAt(hand.clone().add(hand.clone().sub(elbow)));
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.052, 18, 14), suitWhite);
    glove.scale.set(1, 0.85, 1.15);
    glove.position.copy(hand);
    root.add(sh, cuff, glove);
    hands.push(glove);
  }

  // ---- head
  const head = new THREE.Group();
  root.add(head);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.12, 16), skin);
  neck.position.set(0, 0.5, -0.12);
  root.add(neck);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(HEAD_R, 32, 20), skin);
  skull.position.copy(HEAD);
  skull.scale.set(1.0, 0.98, 0.96);
  head.add(skull);
  const face = new THREE.Mesh(
    new THREE.SphereGeometry(HEAD_R + 0.0025, 32, 14, Math.PI / 2 - 1.0, 2.0, 1.05, 0.95),
    (() => {
      const ft = faceTexture();
      return new THREE.MeshStandardMaterial({ map: ft, emissiveMap: ft, emissive: '#ffffff', emissiveIntensity: 0.28, transparent: true, depthWrite: false, roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -2 });
    })()
  );
  face.position.copy(HEAD);
  face.scale.copy(skull.scale);
  head.add(face);
  // bangs: a fringe cap under the helmet brim
  const bangs = new THREE.Mesh(new THREE.SphereGeometry(HEAD_R + 0.012, 28, 10, Math.PI / 2 - 1.05, 2.1, 0.3, 0.86), hair);
  bangs.position.copy(HEAD);
  bangs.scale.copy(skull.scale);
  head.add(bangs);
  for (const s of [-1, 1]) {
    // side locks framing the face
    const lock = taperedTube(new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.17, HEAD.y + 0.06, HEAD.z + 0.1), new THREE.Vector3(s * 0.2, HEAD.y - 0.06, HEAD.z + 0.08), new THREE.Vector3(s * 0.18, HEAD.y - 0.17, HEAD.z + 0.07),
    ]), 10, 10, (t) => 0.035 * (1 - t * 0.7));
    head.add(new THREE.Mesh(lock, hair));
  }

  // ---- helmet
  const C_SHELL = new THREE.Color('#ff5aa9'), C_PAD = new THREE.Color('#fff0f6');
  const sstep = (e0, e1, v) => { const k = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return k * k * (3 - 2 * k); };
  const helmetGeo = meshSDF(helmetSDF, [-0.3, -0.2, -0.31], [0.3, 0.3, 0.31], 0.0135, {
    color: (x, y, z) => {
      const inner = sdEllipsoid(x, y + 0.004, z, 0.238, 0.232, 0.252);
      const opening = sdEllipsoid(x, y + 0.075, z - 0.2, 0.185, 0.15, 0.22);
      const w = Math.max(1 - sstep(0.004, 0.014, inner), 1 - sstep(0.01, 0.03, opening), sstep(-0.13, -0.155, y));
      const c = C_SHELL.clone().lerp(C_PAD, w);
      return [c.r, c.g, c.b];
    },
  });
  const helmet = new THREE.Mesh(helmetGeo, helmetPaint);
  helmet.position.copy(HELMET_C);
  head.add(helmet);
  shadowCasters.push(helmet);
  const decalMat = (map) => withEnv(new THREE.MeshPhysicalMaterial({
    map, transparent: true, alphaTest: 0.04, roughness: 0.3, clearcoat: 1, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
  }), 0.6);
  if (unicornTex) {
    for (const s of [-1, 1]) {
      const g = projectDecal(helmetGeo, { center: new THREE.Vector3(s * 0.26, 0.04, -0.06), normal: new THREE.Vector3(s, 0.1, -0.15), width: 0.2, height: 0.2, depth: 0.2, flipU: s < 0, lift: 0.002 });
      const m = new THREE.Mesh(g, decalMat(unicornTex));
      m.position.copy(HELMET_C);
      head.add(m);
    }
  }
  if (emblemTex) {
    const g = projectDecal(helmetGeo, { center: new THREE.Vector3(0, 0.04, -0.27), normal: new THREE.Vector3(0, 0.15, -1), width: 0.15, height: 0.15, depth: 0.2, lift: 0.002 });
    const m = new THREE.Mesh(g, decalMat(emblemTex));
    m.position.copy(HELMET_C);
    head.add(m);
  }
  // spiral golden horn
  const horn = new THREE.Mesh(hornGeometry(0.2, 0.042), gold);
  horn.position.set(0, HELMET_C.y + 0.235, HELMET_C.z + 0.09);
  horn.rotation.x = 0.42;
  head.add(horn);
  const hornBase = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 8, 24), gold);
  hornBase.position.copy(horn.position);
  hornBase.rotation.x = Math.PI / 2 + 0.42;
  head.add(hornBase);
  // ears
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 16), earMat);
    ear.scale.set(1, 1, 0.55);
    ear.position.set(s * 0.145, HELMET_C.y + 0.225, HELMET_C.z - 0.01);
    ear.rotation.set(-0.15, 0, -s * 0.42);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.085, 12), helmetPad);
    inner.scale.set(1, 1, 0.3);
    inner.position.set(0, -0.01, 0.022);
    ear.add(inner);
    head.add(ear);
  }
  // rainbow mane crest from the horn to the nape
  const MANE = ['#ff8fc6', '#c79bff', '#8fd8ff', '#9ff0c8', '#ffe58f', '#ffb38f', '#ff8fc6'];
  MANE.forEach((col, i) => {
    const phi = 0.42 + i * 0.27; // from the top towards the back
    const r = 0.262;
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05 - i * 0.002, 14, 10),
      withEnv(new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.35, clearcoat: 0.6, sheen: 0.6, sheenColor: new THREE.Color('#ffffff') }), 0.5));
    m.scale.set(0.55, 1.15, 0.95);
    m.position.set(0, HELMET_C.y + Math.cos(phi) * r, HELMET_C.z - Math.sin(phi) * r * 1.05);
    m.rotation.x = -phi;
    head.add(m);
  });

  // ---- ponytail: a simulated hair strand (src/ponytail.js) out of the helmet back
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, HELMET_C.y - 0.07, HELMET_C.z - 0.285);
  head.add(tailPivot);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.02, 10, 24), withEnv(new THREE.MeshPhysicalMaterial({ color: '#ff3d94', roughness: 0.3, clearcoat: 1 }), 0.6));
  tie.rotation.x = 0.35;
  tie.scale.set(1.3, 1, 1);
  tailPivot.add(tie);
  const ponytail = createPonytail({
    rest: [
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.01, -0.11), new THREE.Vector3(0.005, -0.07, -0.21),
      new THREE.Vector3(0, -0.17, -0.28), new THREE.Vector3(0, -0.29, -0.31),
    ],
    radius: (t) => (0.062 + Math.sin(t * Math.PI) * 0.05 - t * 0.045) * (1 - 0.8 * Math.pow(t, 6)) + 0.003,
    material: hair,
  });
  tailPivot.add(ponytail.mesh);
  ponytail.mesh.castShadow = true;

  // colliders for the strand (world-space points pushed out in-place)
  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _g = new THREE.Vector3();
  const HR = [0.268, 0.262, 0.282];
  const helmetCollider = (p, margin) => {
    _m.copy(head.matrixWorld).invert();
    _p.copy(p).applyMatrix4(_m).sub(HELMET_C);
    const ex = _p.x / HR[0], ey = _p.y / HR[1], ez = _p.z / HR[2];
    const l = Math.hypot(ex, ey, ez);
    const lim = 1 + margin / 0.27;
    if (l >= lim || l < 1e-6) return;
    _p.multiplyScalar(lim / l).add(HELMET_C).applyMatrix4(head.matrixWorld);
    p.copy(_p);
  };
  // seat backs etc. as rotated rounded boxes in the CAR BODY space (root.parent)
  let boxes = [];
  const rbox = (x, y, z, b) => {
    // into the box frame (rotation about X by -rotX)
    const dx = x - b.c[0], dy0 = y - b.c[1], dz0 = z - b.c[2];
    const c = Math.cos(b.rotX), s2 = Math.sin(b.rotX);
    const dy = dy0 * c + dz0 * s2, dz = -dy0 * s2 + dz0 * c;
    const qx = Math.abs(dx) - (b.h[0] - b.r), qy = Math.abs(dy) - (b.h[1] - b.r), qz = Math.abs(dz) - (b.h[2] - b.r);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - b.r;
  };
  const boxCollider = (p, margin) => {
    if (!boxes.length || !root.parent) return;
    _m.copy(root.parent.matrixWorld).invert();
    _p.copy(p).applyMatrix4(_m);
    let moved = false;
    for (const b of boxes) {
      const d = rbox(_p.x, _p.y, _p.z, b);
      if (d >= margin) continue;
      const e = 0.003;
      _g.set(
        rbox(_p.x + e, _p.y, _p.z, b) - rbox(_p.x - e, _p.y, _p.z, b),
        rbox(_p.x, _p.y + e, _p.z, b) - rbox(_p.x, _p.y - e, _p.z, b),
        rbox(_p.x, _p.y, _p.z + e, b) - rbox(_p.x, _p.y, _p.z - e, b)
      ).normalize();
      _p.addScaledVector(_g, margin - d);
      moved = true;
    }
    if (moved) p.copy(_p.applyMatrix4(root.parent.matrixWorld));
  };
  const colliders = [helmetCollider, boxCollider];

  // ~40 tiny parts -> a handful of draw calls (head and ponytail keep animating)
  for (const m of shadowCasters) m.castShadow = true;
  const mergeInfo = [mergeStatic(root, new Set([head])), mergeStatic(head, new Set([tailPivot]))];
  root.traverse((o) => { if (o.isMesh) { o.receiveShadow = true; } });
  const casters = [];
  root.traverse((o) => { if (o.isMesh && o.castShadow) casters.push(o); });

  return {
    root,
    shadowCasters: casters,
    mergeInfo,
    ponytail,
    /** car-body-space rounded boxes the ponytail must not pass through: {c:[x,y,z], h:[hx,hy,hz], r, rotX} */
    setColliders(list) { boxes = list; },
    update(dt, { speed = 0, steer = 0, sway = 0, t = 0 }) {
      const sp = Math.min(1, speed / 14);
      root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, -sway * 0.55, 0.08);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, steer * 0.22, 0.08);
      head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, -steer * 0.08, 0.08);
      head.position.y = Math.sin(t * 9) * 0.004 * sp;
      tailPivot.updateWorldMatrix(true, false);
      ponytail.update(dt, { pivot: tailPivot, carMatrix: root.parent ? root.parent.matrixWorld : root.matrixWorld, speed, time: t, colliders });
    },
  };
}
