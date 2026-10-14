// Signed-distance-field modelling for the hero car (and Lily's helmet).
//
// Smooth, toy-like shapes (a Beetle body with bulging fenders, a padded
// cockpit lip, a satin bow) are awkward to build from primitives but natural
// as a smooth union / subtraction of distance fields. `meshSDF` polygonises a
// field with Naive Surface Nets, then snaps every vertex onto the true surface
// (Newton steps along the gradient) and takes its normal from the gradient —
// so the mesh is watertight and perfectly smooth-shaded at any resolution.
//
// Everything is plain scalar math (no allocations in the hot loop): the car
// body (~600k field samples) builds in well under 100 ms on a phone.
import * as THREE from 'three';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';

// ------------------------------------------------------------ primitives
// All take the point already translated into the primitive's frame.
export function sdSphere(x, y, z, r) {
  return Math.sqrt(x * x + y * y + z * z) - r;
}

// Inigo Quilez' ellipsoid bound: exact on the surface, good gradient near it.
export function sdEllipsoid(x, y, z, rx, ry, rz) {
  const ax = x / rx, ay = y / ry, az = z / rz;
  const k0 = Math.sqrt(ax * ax + ay * ay + az * az);
  const bx = x / (rx * rx), by = y / (ry * ry), bz = z / (rz * rz);
  const k1 = Math.sqrt(bx * bx + by * by + bz * bz);
  if (k1 < 1e-9) return -Math.min(rx, ry, rz);
  return (k0 * (k0 - 1)) / k1;
}

// Box with half extents (bx,by,bz) and edge radius r (r <= min half extent).
export function sdRoundBox(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r;
  const mx = Math.max(qx, 0), my = Math.max(qy, 0), mz = Math.max(qz, 0);
  return Math.sqrt(mx * mx + my * my + mz * mz) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

// Capped cylinder along X: radius r, half length h.
export function sdCylX(x, y, z, r, h) {
  const dx = Math.sqrt(y * y + z * z) - r, dy = Math.abs(x) - h;
  const mx = Math.max(dx, 0), my = Math.max(dy, 0);
  return Math.min(Math.max(dx, dy), 0) + Math.sqrt(mx * mx + my * my);
}

// Capsule from a to b with radius r.
export function sdCapsule(x, y, z, ax, ay, az, bx, by, bz, r) {
  const pax = x - ax, pay = y - ay, paz = z - az;
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  let h = (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz);
  h = h < 0 ? 0 : h > 1 ? 1 : h;
  const dx = pax - bax * h, dy = pay - bay * h, dz = paz - baz * h;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
}

// Torus in the local XY plane (axis = Z): major radius R, tube radius r.
export function sdTorusZ(x, y, z, R, r) {
  const qx = Math.sqrt(x * x + y * y) - R;
  return Math.sqrt(qx * qx + z * z) - r;
}

// Polynomial smooth minimum / maximum (blend radius k).
export function smin(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
export function smax(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
}

// ------------------------------------------------------------ helpers
export function sdfGradient(f, x, y, z, e = 1e-3, out = [0, 0, 0]) {
  out[0] = f(x + e, y, z) - f(x - e, y, z);
  out[1] = f(x, y + e, z) - f(x, y - e, z);
  out[2] = f(x, y, z + e) - f(x, y, z - e);
  const l = Math.hypot(out[0], out[1], out[2]) || 1;
  out[0] /= l; out[1] /= l; out[2] /= l;
  return out;
}

/** Sphere-trace a ray from outside the surface. Returns {point, normal} or null. */
export function sdfRaycast(f, origin, dir, maxT = 10) {
  const d = new THREE.Vector3().copy(dir).normalize();
  let t = 0;
  for (let i = 0; i < 400 && t < maxT; i++) {
    const x = origin.x + d.x * t, y = origin.y + d.y * t, z = origin.z + d.z * t;
    const v = f(x, y, z);
    if (v < 2e-4) {
      const p = new THREE.Vector3(x, y, z);
      const g = sdfGradient(f, x, y, z);
      return { point: p, normal: new THREE.Vector3(g[0], g[1], g[2]) };
    }
    t += Math.max(v * 0.8, 2e-4);
  }
  return null;
}

// ------------------------------------------------------------ mesher
const CORNERS = [];
for (let c = 0; c < 8; c++) CORNERS.push([c & 1, (c >> 1) & 1, (c >> 2) & 1]);
const EDGES = [];
for (let a = 0; a < 8; a++) for (const bit of [1, 2, 4]) if (!(a & bit)) EDGES.push([a, a | bit]);

/**
 * Polygonise `f(x,y,z)` (negative inside) inside the box [min, max].
 *
 * @param {(x:number,y:number,z:number)=>number} f
 * @param {number[]} min  [x,y,z]   — the field must be positive on the box boundary
 * @param {number[]} max  [x,y,z]
 * @param {number} step   grid spacing (m)
 * @param {object}  [opts]
 * @param {(x,y,z,nx,ny,nz)=>number} [opts.classify] material index per triangle (centroid)
 * @param {(x,y,z,nx,ny,nz)=>number[]} [opts.uv] per-vertex uv
 * @param {(x,y,z,nx,ny,nz)=>number[]} [opts.color] per-vertex linear RGB (smooth material blends)
 * @param {number}  [opts.snap=3] Newton projection iterations
 * @returns {THREE.BufferGeometry} indexed geometry with groups when classify is given
 */
export function meshSDF(f, min, max, step, opts = {}) {
  const nx = Math.ceil((max[0] - min[0]) / step) + 1;
  const ny = Math.ceil((max[1] - min[1]) / step) + 1;
  const nz = Math.ceil((max[2] - min[2]) / step) + 1;
  const sxy = nx * ny;
  const vals = new Float32Array(nx * ny * nz);
  for (let k = 0, n = 0; k < nz; k++) {
    const z = min[2] + k * step;
    for (let j = 0; j < ny; j++) {
      const y = min[1] + j * step;
      for (let i = 0; i < nx; i++, n++) vals[n] = f(min[0] + i * step, y, z);
    }
  }

  // one vertex per sign-changing cell: mean of its edge crossings
  const cx = nx - 1, cy = ny - 1;
  const cellVert = new Int32Array(cx * cy * (nz - 1)).fill(-1);
  const pos = [];
  const cv = new Float32Array(8);
  for (let k = 0; k < nz - 1; k++) {
    for (let j = 0; j < cy; j++) {
      for (let i = 0; i < cx; i++) {
        let mask = 0;
        for (let c = 0; c < 8; c++) {
          const o = CORNERS[c];
          const v = vals[(i + o[0]) + (j + o[1]) * nx + (k + o[2]) * sxy];
          cv[c] = v;
          if (v < 0) mask |= 1 << c;
        }
        if (mask === 0 || mask === 255) continue;
        let px = 0, py = 0, pz = 0, cnt = 0;
        for (const [a, b] of EDGES) {
          const va = cv[a], vb = cv[b];
          if ((va < 0) === (vb < 0)) continue;
          const t = va / (va - vb);
          const A = CORNERS[a], B = CORNERS[b];
          px += A[0] + (B[0] - A[0]) * t;
          py += A[1] + (B[1] - A[1]) * t;
          pz += A[2] + (B[2] - A[2]) * t;
          cnt++;
        }
        cellVert[i + j * cx + k * cx * cy] = pos.length / 3;
        pos.push(min[0] + (i + px / cnt) * step, min[1] + (j + py / cnt) * step, min[2] + (k + pz / cnt) * step);
      }
    }
  }

  // snap onto the surface + gradient normals
  const nv = pos.length / 3;
  const P = new Float32Array(pos);
  const N = new Float32Array(nv * 3);
  const g = [0, 0, 0];
  const e = step * 0.25;
  const snap = opts.snap ?? 3;
  for (let v = 0; v < nv; v++) {
    let x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2];
    const x0 = x, y0 = y, z0 = z;
    for (let it = 0; it < snap; it++) {
      const d = f(x, y, z);
      if (Math.abs(d) < 1e-5) break;
      sdfGradient(f, x, y, z, e, g);
      x -= g[0] * d; y -= g[1] * d; z -= g[2] * d;
    }
    // never let a vertex wander out of its neighbourhood (keeps quads valid)
    const dx = x - x0, dy = y - y0, dz = z - z0;
    const dl = Math.hypot(dx, dy, dz);
    if (dl > step) { const s = step / dl; x = x0 + dx * s; y = y0 + dy * s; z = z0 + dz * s; }
    P[v * 3] = x; P[v * 3 + 1] = y; P[v * 3 + 2] = z;
    sdfGradient(f, x, y, z, e, g);
    N[v * 3] = g[0]; N[v * 3 + 1] = g[1]; N[v * 3 + 2] = g[2];
  }

  // quads around every sign-changing grid edge
  const tris = [];
  const cell = (i, j, k) => cellVert[i + j * cx + k * cx * cy];
  const quad = (a, b, c, d) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    // split along the shorter diagonal
    const dac = dist2(P, a, c), dbd = dist2(P, b, d);
    if (dac <= dbd) { pushTri(tris, P, N, a, b, c); pushTri(tris, P, N, a, c, d); }
    else { pushTri(tris, P, N, a, b, d); pushTri(tris, P, N, b, c, d); }
  };
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const v0 = vals[i + j * nx + k * sxy] < 0;
        if (i < nx - 1 && j > 0 && k > 0 && j < ny - 1 && k < nz - 1) {
          if (v0 !== (vals[i + 1 + j * nx + k * sxy] < 0)) quad(cell(i, j - 1, k - 1), cell(i, j, k - 1), cell(i, j, k), cell(i, j - 1, k));
        }
        if (j < ny - 1 && i > 0 && k > 0 && i < nx - 1 && k < nz - 1) {
          if (v0 !== (vals[i + (j + 1) * nx + k * sxy] < 0)) quad(cell(i - 1, j, k - 1), cell(i - 1, j, k), cell(i, j, k), cell(i, j, k - 1));
        }
        if (k < nz - 1 && i > 0 && j > 0 && i < nx - 1 && j < ny - 1) {
          if (v0 !== (vals[i + j * nx + (k + 1) * sxy] < 0)) quad(cell(i - 1, j - 1, k), cell(i, j - 1, k), cell(i, j, k), cell(i - 1, j, k));
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  if (opts.uv) {
    const UV = new Float32Array(nv * 2);
    for (let v = 0; v < nv; v++) {
      const uv = opts.uv(P[v * 3], P[v * 3 + 1], P[v * 3 + 2], N[v * 3], N[v * 3 + 1], N[v * 3 + 2]);
      UV[v * 2] = uv[0]; UV[v * 2 + 1] = uv[1];
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(UV, 2));
  }

  if (opts.color) {
    const C = new Float32Array(nv * 3);
    for (let v = 0; v < nv; v++) {
      const c = opts.color(P[v * 3], P[v * 3 + 1], P[v * 3 + 2], N[v * 3], N[v * 3 + 1], N[v * 3 + 2]);
      C[v * 3] = c[0]; C[v * 3 + 1] = c[1]; C[v * 3 + 2] = c[2];
    }
    geo.setAttribute('color', new THREE.BufferAttribute(C, 3));
  }

  if (opts.classify) {
    const buckets = [];
    for (let t = 0; t < tris.length; t += 3) {
      const a = tris[t], b = tris[t + 1], c = tris[t + 2];
      const mx = (P[a * 3] + P[b * 3] + P[c * 3]) / 3;
      const my = (P[a * 3 + 1] + P[b * 3 + 1] + P[c * 3 + 1]) / 3;
      const mz = (P[a * 3 + 2] + P[b * 3 + 2] + P[c * 3 + 2]) / 3;
      const nxm = N[a * 3] + N[b * 3] + N[c * 3];
      const nym = N[a * 3 + 1] + N[b * 3 + 1] + N[c * 3 + 1];
      const nzm = N[a * 3 + 2] + N[b * 3 + 2] + N[c * 3 + 2];
      const nl = Math.hypot(nxm, nym, nzm) || 1;
      const m = opts.classify(mx, my, mz, nxm / nl, nym / nl, nzm / nl) | 0;
      (buckets[m] ||= []).push(a, b, c);
    }
    const index = [];
    buckets.forEach((list, m) => {
      if (!list || !list.length) return;
      geo.addGroup(index.length, list.length, m);
      for (let q = 0; q < list.length; q++) index.push(list[q]);
    });
    geo.setIndex(index);
  } else {
    geo.setIndex(tris);
  }
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  return geo;
}

function dist2(P, a, b) {
  const dx = P[a * 3] - P[b * 3], dy = P[a * 3 + 1] - P[b * 3 + 1], dz = P[a * 3 + 2] - P[b * 3 + 2];
  return dx * dx + dy * dy + dz * dz;
}

// winding from the gradient: the face normal must agree with the field normal
function pushTri(tris, P, N, a, b, c) {
  const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2];
  const vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
  const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
  const s = fx * (N[a * 3] + N[b * 3] + N[c * 3]) + fy * (N[a * 3 + 1] + N[b * 3 + 1] + N[c * 3 + 1]) + fz * (N[a * 3 + 2] + N[b * 3 + 2] + N[c * 3 + 2]);
  if (s >= 0) tris.push(a, b, c); else tris.push(a, c, b);
}

// ------------------------------------------------------------ decals
/**
 * Project a decal onto a (smooth) mesh: picks the triangles inside an oriented
 * box, gives them planar UVs and lifts them slightly along the normal. UVs
 * outside 0..1 are left as-is — decal textures have a transparent border and
 * clamp-to-edge sampling, so partially covered triangles fade out cleanly.
 *
 * @param {THREE.BufferGeometry} geo   source geometry (indexed or not)
 * @param {object} o
 * @param {THREE.Vector3} o.center
 * @param {THREE.Vector3} o.normal  outward direction the decal faces
 * @param {THREE.Vector3} [o.up]    decal "up" (texture v)
 * @param {number} o.width
 * @param {number} o.height
 * @param {number} [o.depth=0.3]
 * @param {boolean} [o.flipU=false]
 * @param {number} [o.lift=0.004]
 */
export function projectDecal(geo, o) {
  const zA = o.normal.clone().normalize();
  const up = (o.up || new THREE.Vector3(0, 1, 0)).clone();
  const xA = new THREE.Vector3().crossVectors(up, zA).normalize();
  const yA = new THREE.Vector3().crossVectors(zA, xA).normalize();
  const depth = o.depth ?? 0.3, lift = o.lift ?? 0.004;
  const hw = o.width / 2, hh = o.height / 2;
  const P = geo.attributes.position.array, N = geo.attributes.normal.array;
  const idx = geo.index ? geo.index.array : null;
  const triCount = idx ? idx.length / 3 : P.length / 9;
  const outP = [], outN = [], outUV = [];
  const loc = (v) => {
    const dx = P[v * 3] - o.center.x, dy = P[v * 3 + 1] - o.center.y, dz = P[v * 3 + 2] - o.center.z;
    return [dx * xA.x + dy * xA.y + dz * xA.z, dx * yA.x + dy * yA.y + dz * yA.z, dx * zA.x + dy * zA.y + dz * zA.z];
  };
  for (let t = 0; t < triCount; t++) {
    const vs = idx ? [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]] : [t * 3, t * 3 + 1, t * 3 + 2];
    const L = vs.map(loc);
    if (L.some((l) => Math.abs(l[2]) > depth / 2)) continue;
    if (!L.some((l) => Math.abs(l[0]) <= hw && Math.abs(l[1]) <= hh)) continue;
    if (vs.some((v) => N[v * 3] * zA.x + N[v * 3 + 1] * zA.y + N[v * 3 + 2] * zA.z < 0.2)) continue;
    for (let q = 0; q < 3; q++) {
      const v = vs[q];
      outP.push(P[v * 3] + N[v * 3] * lift, P[v * 3 + 1] + N[v * 3 + 1] * lift, P[v * 3 + 2] + N[v * 3 + 2] * lift);
      outN.push(N[v * 3], N[v * 3 + 1], N[v * 3 + 2]);
      let u = L[q][0] / o.width + 0.5;
      if (o.flipU) u = 1 - u;
      outUV.push(u, L[q][1] / o.height + 0.5);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(outP, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(outN, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(outUV, 2));
  g.computeBoundingSphere();
  return g;
}

// ------------------------------------------------------------ tapered tube
/** Tube along `curve` whose radius follows radiusFn(t) (t = 0..1). */
export function taperedTube(curve, segments, radial, radiusFn) {
  const frames = curve.computeFrenetFrames(segments, false);
  const pos = [], nor = [], uv = [], index = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPointAt(t, p);
    const r = radiusFn(t);
    const N1 = frames.normals[i], B1 = frames.binormals[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const s = Math.sin(a), c = -Math.cos(a);
      n.set(c * N1.x + s * B1.x, c * N1.y + s * B1.y, c * N1.z + s * B1.z).normalize();
      pos.push(p.x + r * n.x, p.y + r * n.y, p.z + r * n.z);
      nor.push(n.x, n.y, n.z);
      uv.push(t, j / radial);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = (i + 1) * (radial + 1) + j;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  return g;
}

// Merge static meshes under `container` into one draw call per material
// (meshes with vertex colours / multi-materials and `skip` subtrees stay).
export function mergeStatic(container, skip) {
  container.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(container.matrixWorld).invert();
  const buckets = new Map();
  const victims = [];
  container.traverse((o) => {
    if (!o.isMesh || Array.isArray(o.material) || o.geometry.attributes.color) return;
    for (let p = o; p && p !== container; p = p.parent) if (skip.has(p)) return;
    const g0 = o.geometry;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', g0.attributes.position.clone());
    if (g0.attributes.normal) g.setAttribute('normal', g0.attributes.normal.clone());
    else g.computeVertexNormals();
    const n = g.attributes.position.count;
    g.setAttribute('uv', g0.attributes.uv ? g0.attributes.uv.clone() : new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
    if (g0.index) g.setIndex(g0.index.clone());
    else g.setIndex([...Array(n).keys()]);
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    const key = `${o.material.uuid}|${o.castShadow}|${o.renderOrder}`;
    if (!buckets.has(key)) buckets.set(key, { material: o.material, cast: o.castShadow, order: o.renderOrder, list: [] });
    buckets.get(key).list.push(g);
    victims.push(o);
  });
  for (const o of victims) o.parent.remove(o);
  let merged = 0;
  for (const b of buckets.values()) {
    const geo = b.list.length === 1 ? b.list[0] : mergeGeometries(b.list, false);
    const m = new THREE.Mesh(geo, b.material);
    m.castShadow = b.cast; m.receiveShadow = true; m.renderOrder = b.order;
    m.name = 'merged';
    container.add(m);
    merged++;
  }
  // drop the now-empty helper groups
  const empty = [];
  container.traverse((o) => { if (o !== container && o.isGroup && !o.children.length) empty.push(o); });
  for (const o of empty) o.parent.remove(o);
  return { parts: victims.length, drawCalls: merged };
}

