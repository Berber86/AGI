// ponytail.js — Lily's ponytail as a real hair strand.
//
// A chain of points simulated with position-based dynamics in WORLD space, so
// everything the car does reaches the hair for free: it lags behind when the
// car accelerates, swings forward under braking, flies outward in corners,
// floats on jumps and slaps back on landing. On top of that: gravity, a
// head-wind that grows with speed (+ turbulent flutter), a soft "shape memory"
// near the hair tie, and collisions with the helmet and the seat backs.
// The strand is skinned every frame into a flattened, slightly clumpy tube.
import * as THREE from 'three';

const GRAVITY = new THREE.Vector3(0, -9.8, 0);
const MAX_SUB = 1 / 120;

/** Streaky brown hair texture (u = around the strand, v = along it). */
function hairStreakTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(196,196,196)';
  g.fillRect(0, 0, 128, 256);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    const x = rnd() * 128, w = 0.6 + rnd() * 2.2, l = 150 + rnd() * 105;
    g.strokeStyle = `rgba(${l | 0},${l | 0},${l | 0},${0.35 + rnd() * 0.5})`;
    g.lineWidth = w;
    g.beginPath(); g.moveTo(x, -4);
    g.bezierCurveTo(x + (rnd() - 0.5) * 10, 90, x + (rnd() - 0.5) * 12, 170, x + (rnd() - 0.5) * 8, 260);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/**
 * @param {object} o
 * @param {THREE.Vector3[]} o.rest   rest shape in the pivot's local space (first point = hair tie)
 * @param {(t:number)=>number} o.radius  strand radius along the length (t = 0..1)
 * @param {THREE.Material} o.material  base hair material (cloned, gets a streak map)
 */
export function createPonytail({ rest, radius, material, points = 10, rings = 28, sides = 12, flatten = 1.3 }) {
  const curve = new THREE.CatmullRomCurve3(rest);
  const restPts = curve.getSpacedPoints(points - 1);
  const seg = curve.getLength() / (points - 1);
  const N = points;

  const mat = material.clone();
  mat.map = hairStreakTexture();
  mat.color = new THREE.Color('#9c5c3c');

  // ---- dynamic tube geometry (positions/normals rewritten every frame)
  const stride = sides + 1;
  const vCount = rings * stride;
  const posA = new THREE.BufferAttribute(new Float32Array(vCount * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const norA = new THREE.BufferAttribute(new Float32Array(vCount * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const uv = new Float32Array(vCount * 2);
  const index = [];
  for (let j = 0; j < rings; j++) {
    for (let k = 0; k <= sides; k++) { uv[(j * stride + k) * 2] = k / sides; uv[(j * stride + k) * 2 + 1] = j / (rings - 1); }
  }
  for (let j = 0; j < rings - 1; j++) {
    for (let k = 0; k < sides; k++) {
      const a = j * stride + k, b = a + stride;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', posA);
  geo.setAttribute('normal', norA);
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -0.15, -0.25), 0.9);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'ponytail';
  mesh.frustumCulled = false;

  // ---- simulation state (world space)
  const pos = restPts.map(() => new THREE.Vector3());
  const vel = restPts.map(() => new THREE.Vector3());
  const old = restPts.map(() => new THREE.Vector3());
  const local = restPts.map(() => new THREE.Vector3());
  const target = new THREE.Vector3();
  const anchor = new THREE.Vector3(), lastAnchor = new THREE.Vector3(), anchorVel = new THREE.Vector3(), subAnchor = new THREE.Vector3();
  const fwd = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3();
  const tmp = new THREE.Vector3(), acc = new THREE.Vector3(), rel = new THREE.Vector3();
  const invPivot = new THREE.Matrix4();
  let ready = false;

  const reset = (M) => {
    for (let i = 0; i < N; i++) { pos[i].copy(restPts[i]).applyMatrix4(M); vel[i].set(0, 0, 0); }
    anchor.copy(pos[0]); lastAnchor.copy(anchor); anchorVel.set(0, 0, 0);
    ready = true;
  };

  // ---- skinning: Catmull-Rom through the strand, parallel-transported frames
  const centers = Array.from({ length: rings }, () => new THREE.Vector3());
  const T = new THREE.Vector3(), Nn = new THREE.Vector3(), B = new THREE.Vector3();
  const P0 = new THREE.Vector3(), P3 = new THREE.Vector3();
  const cr = (a, b, c, d, t, out) => {
    const t2 = t * t, t3 = t2 * t;
    out.set(
      0.5 * (2 * b.x + (-a.x + c.x) * t + (2 * a.x - 5 * b.x + 4 * c.x - d.x) * t2 + (-a.x + 3 * b.x - 3 * c.x + d.x) * t3),
      0.5 * (2 * b.y + (-a.y + c.y) * t + (2 * a.y - 5 * b.y + 4 * c.y - d.y) * t2 + (-a.y + 3 * b.y - 3 * c.y + d.y) * t3),
      0.5 * (2 * b.z + (-a.z + c.z) * t + (2 * a.z - 5 * b.z + 4 * c.z - d.z) * t2 + (-a.z + 3 * b.z - 3 * c.z + d.z) * t3)
    );
    return out;
  };
  const skin = () => {
    for (let j = 0; j < rings; j++) {
      const u = (j / (rings - 1)) * (N - 1);
      const i = Math.min(N - 2, Math.floor(u));
      const f = u - i;
      const a = i > 0 ? local[i - 1] : P0.copy(local[0]).multiplyScalar(2).sub(local[1]);
      const d = i + 2 < N ? local[i + 2] : P3.copy(local[N - 1]).multiplyScalar(2).sub(local[N - 2]);
      cr(a, local[i], local[i + 1], d, f, centers[j]);
    }
    const p = posA.array, n = norA.array;
    Nn.set(1, 0, 0); // start the frame from the head's lateral axis
    for (let j = 0; j < rings; j++) {
      const c0 = centers[Math.max(0, j - 1)], c1 = centers[Math.min(rings - 1, j + 1)];
      T.subVectors(c1, c0).normalize();
      Nn.addScaledVector(T, -Nn.dot(T));
      if (Nn.lengthSq() < 1e-8) Nn.set(0, 1, 0).addScaledVector(T, -T.y);
      Nn.normalize();
      B.crossVectors(T, Nn);
      const t = j / (rings - 1);
      const r = radius(t);
      const c = centers[j];
      for (let k = 0; k <= sides; k++) {
        const th = (k / sides) * Math.PI * 2;
        const cs = Math.cos(th), sn = Math.sin(th);
        // clumpy cross-section: r(θ) = r0 (1 + ε cos 7θ)
        const lobe = 1 + 0.07 * Math.cos(7 * th + t * 2.5);
        const dl = (-0.07 * 7 * Math.sin(7 * th + t * 2.5)) / lobe;
        const ex = flatten * r * lobe * cs, ey = r * lobe * sn;
        // 2D normal of the lobed circle, then through the ellipse scaling
        let nx = (cs + dl * sn) / flatten, ny = sn - dl * cs;
        const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
        const o = (j * stride + k) * 3;
        p[o] = c.x + Nn.x * ex + B.x * ey;
        p[o + 1] = c.y + Nn.y * ex + B.y * ey;
        p[o + 2] = c.z + Nn.z * ex + B.z * ey;
        n[o] = Nn.x * nx + B.x * ny;
        n[o + 1] = Nn.y * nx + B.y * ny;
        n[o + 2] = Nn.z * nx + B.z * ny;
      }
    }
    posA.needsUpdate = true;
    norA.needsUpdate = true;
  };

  /**
   * @param {number} dt
   * @param {object} o
   * @param {THREE.Object3D} o.pivot   the hair tie (mesh parent), matrices up to date
   * @param {THREE.Matrix4} o.carMatrix  car body world matrix (wind direction)
   * @param {number} o.speed  forward speed (m/s) -> head-wind
   * @param {number} o.time
   * @param {((p:THREE.Vector3, margin:number)=>void)[]} o.colliders  push a world point out
   */
  function update(dt, { pivot, carMatrix, speed = 0, time = 0, colliders = [] }) {
    const M = pivot.matrixWorld;
    if (!ready) { reset(M); }
    anchor.copy(restPts[0]).applyMatrix4(M);
    // teleports (restart / QA jumps / first frame) — snap to the rest pose
    if (dt <= 0 || anchor.distanceToSquared(lastAnchor) > 16) { reset(M); dt = 0; }
    if (dt > 0) {
      anchorVel.subVectors(anchor, lastAnchor).divideScalar(dt);
      fwd.setFromMatrixColumn(carMatrix, 2).normalize();
      side.setFromMatrixColumn(carMatrix, 0).normalize();
      up.setFromMatrixColumn(carMatrix, 1).normalize();
      const n = Math.max(1, Math.ceil(dt / MAX_SUB));
      const h = dt / n;
      const sp = Math.abs(speed);
      for (let s = 0; s < n; s++) {
        subAnchor.lerpVectors(lastAnchor, anchor, (s + 1) / n);
        const tt = time - dt + (s + 1) * h;
        // 1) forces: gravity, head-wind + flutter, air drag relative to the car
        for (let i = 1; i < N; i++) {
          const ti = i / (N - 1);
          acc.copy(GRAVITY);
          acc.addScaledVector(fwd, -0.85 * sp);
          const flutter = sp * (0.5 + ti * 1.35);
          acc.addScaledVector(side, Math.sin(tt * 13.0 + i * 0.85) * flutter * 0.55 + Math.sin(tt * 5.3 + i * 0.4) * flutter * 0.3);
          acc.addScaledVector(up, Math.sin(tt * 9.7 + i * 1.3) * flutter * 0.4);
          rel.subVectors(vel[i], anchorVel);
          acc.addScaledVector(rel, -2.6);
          vel[i].addScaledVector(acc, h);
          // keep it sane after violent events (crash bounce, landing)
          rel.subVectors(vel[i], anchorVel);
          const rl = rel.length();
          if (rl > 14) vel[i].copy(anchorVel).addScaledVector(rel, 14 / rl);
          old[i].copy(pos[i]);
          pos[i].addScaledVector(vel[i], h);
        }
        // 2) shape memory: strong at the tie, gone at the tip
        for (let i = 1; i < N; i++) {
          const ti = i / (N - 1);
          const k = 1 - Math.pow(1 - 0.3 * Math.pow(1 - ti, 3), h * 60);
          target.copy(restPts[i]).applyMatrix4(M).addScaledVector(anchor, -1).add(subAnchor);
          pos[i].lerp(target, k);
        }
        // 3) inextensible strand (follow-the-leader) + collisions
        pos[0].copy(subAnchor);
        for (let i = 1; i < N; i++) {
          tmp.subVectors(pos[i], pos[i - 1]);
          const l = tmp.length() || 1;
          pos[i].copy(pos[i - 1]).addScaledVector(tmp, seg / l);
          const m = radius(i / (N - 1)) * 0.8 + 0.008;
          for (const col of colliders) col(pos[i], m);
        }
        // 4) velocities from the corrected positions
        for (let i = 1; i < N; i++) vel[i].subVectors(pos[i], old[i]).divideScalar(h);
      }
    }
    lastAnchor.copy(anchor);
    // into the pivot's space for the mesh
    invPivot.copy(M).invert();
    for (let i = 0; i < N; i++) local[i].copy(pos[i]).applyMatrix4(invPivot);
    skin();
  }

  // initial geometry in rest pose (before the first update)
  for (let i = 0; i < N; i++) local[i].copy(restPts[i]);
  skin();

  return { mesh, update, reset: () => { ready = false; }, segment: seg, points: N, state: () => pos.map((p) => p.clone()) };
}
