// Cake mountain pass: strawberry ascent → wafer sky bridge → cocoa descent.
// All decoration stays outside the 8.8 m driving band; static parts are batched.
import * as THREE from 'three';
import { CAKE_COURSE as C } from './cake-course.js';
import { mergeByMaterial } from './merge.js';

const UP = new THREE.Vector3(0, 1, 0);
const TAU = Math.PI * 2;

function spongeTexture(chocolate) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const g = canvas.getContext('2d');
  g.fillStyle = chocolate ? '#ad7e62' : '#ffe4ba';
  g.fillRect(0, 0, 256, 256);
  let seed = 173;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 1300; i++) {
    g.fillStyle = i % 3 ? 'rgba(79,37,18,0.12)' : 'rgba(255,250,221,0.32)';
    g.beginPath(); g.ellipse(rnd() * 256, rnd() * 256, 0.7 + rnd() * 2.1, 0.6 + rnd() * 1.4, rnd() * TAU, 0, TAU); g.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 1.5);
  tex.anisotropy = 4;
  return tex;
}

// A glossy cap with irregular, rounded-looking icing drips down its side.
function dripGeometry(radius, top, phase) {
  const pos = [], idx = [], uv = [], n = 144;
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU;
    const depth = 0.5 + 1.7 * Math.max(0, Math.cos(a * 11 + phase)) ** 6
      + 0.7 * Math.max(0, Math.cos(a * 19 - phase)) ** 8;
    for (let k = 0; k < 3; k++) {
      const r = radius + (k === 1 ? 0.13 : 0);
      pos.push(Math.cos(a) * r, top - (k === 0 ? 0 : k === 1 ? depth * 0.65 : depth), Math.sin(a) * r);
      uv.push(i / n, k / 2);
    }
    if (i > 0) for (let k = 0; k < 2; k++) {
      const v = i * 3 + k, p = v - 3;
      idx.push(p, v, p + 1, p + 1, v, v + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

function labelTexture(text, accent, arrow = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 256;
  const g = canvas.getContext('2d');
  g.fillStyle = '#fff4dc'; g.fillRect(0, 0, 1024, 256);
  g.strokeStyle = accent; g.lineWidth = 24; g.strokeRect(12, 12, 1000, 232);
  g.fillStyle = accent;
  if (arrow) {
    if (arrow === 'left') { g.translate(1024, 0); g.scale(-1, 1); }
    for (let i = 0; i < 3; i++) {
      const x = 165 + i * 285;
      g.beginPath(); g.moveTo(x, 55); g.lineTo(x + 95, 55); g.lineTo(x + 205, 128);
      g.lineTo(x + 95, 201); g.lineTo(x, 201); g.lineTo(x + 110, 128); g.closePath(); g.fill();
    }
  } else {
    g.font = 'bold 62px sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 512, 132, 930);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCakes(scene, track, TEX = {}) {
  const route = track.cakes;
  const group = new THREE.Group(); group.name = 'cakePass'; scene.add(group);
  const mat = (color, roughness = 0.55, map = null) => new THREE.MeshStandardMaterial({ color, roughness, map });
  const cream = mat('#fff4df', 0.4);
  const pink = mat('#fa78aa', 0.32);
  const ganache = mat('#633224', 0.3);
  const jam = mat('#cc416d', 0.35);
  const caramel = mat('#efb362', 0.48);
  const wafer = mat('#efc68a', 0.8, TEX.wall || null);
  const cherry = mat('#d8254b', 0.25);
  const leaf = mat('#6eac50', 0.7);
  const seedMat = mat('#ffe4a0', 0.5);
  const cane = mat('#fff8ef', 0.4, TEX.cane || null);
  const sponge = [mat('#fff4e2', 0.86, spongeTexture(false)), mat('#a87759', 0.84, spongeTexture(true))];
  const smallSphere = new THREE.SphereGeometry(1, 10, 7);
  const dollopGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(0.9, 0.08), new THREE.Vector2(1, 0.4),
    new THREE.Vector2(0.75, 0.9), new THREE.Vector2(0.44, 1.35), new THREE.Vector2(0.18, 1.7), new THREE.Vector2(0, 1.9),
  ], 10);
  const add = (parent, geo, material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
    return mesh;
  };
  const ball = (parent, material, x, y, z, sx, sy = sx, sz = sx) => {
    const mesh = add(parent, smallSphere, material, x, y, z); mesh.scale.set(sx, sy, sz); return mesh;
  };
  const ring = (parent, r, tube, y, material) => {
    const mesh = add(parent, new THREE.TorusGeometry(r, tube, 6, 80), material, 0, y);
    mesh.rotation.x = Math.PI / 2; return mesh;
  };
  const rod = (parent, a, b, radius, material) => {
    const d = b.clone().sub(a), middle = a.clone().add(b).multiplyScalar(0.5);
    const mesh = add(parent, new THREE.CylinderGeometry(radius, radius, d.length(), 8), material, ...middle.toArray());
    mesh.quaternion.setFromUnitVectors(UP, d.normalize()); return mesh;
  };

  for (const [ci, cake] of [route.up, route.down].entries()) {
    const body = new THREE.Group(); body.name = ci ? 'chocolateCake' : 'strawberryCake';
    body.position.copy(cake.center); group.add(body);
    const glaze = ci ? ganache : pink;
    const floor = -3.2 - cake.center.y;
    const levels = [floor, route.rise / 3, route.rise * 2 / 3, route.rise + 2];
    // Sugar porcelain plate and a scalloped gold rim at ground level.
    add(body, new THREE.CylinderGeometry(cake.radii[0] + 2.2, cake.radii[0] + 1.8, 0.7, 96), cream, 0, floor + 0.12);
    ring(body, cake.radii[0] + 1.7, 0.3, floor + 0.52, ci ? caramel : pink);
    cake.radii.forEach((radius, tier) => {
      const bottom = levels[tier], top = levels[tier + 1], h = top - bottom;
      add(body, new THREE.CylinderGeometry(radius, radius + 0.2, h, 96), sponge[ci], 0, (bottom + top) / 2);
      // Actual cream and fruit filling, not a single flat-colored cylinder.
      for (const t of [0.32, 0.69]) {
        const y = bottom + h * t;
        add(body, new THREE.CylinderGeometry(radius + 0.14, radius + 0.14, 0.64, 96), cream, 0, y);
        add(body, new THREE.CylinderGeometry(radius + 0.16, radius + 0.16, 0.23, 96), ci ? caramel : jam, 0, y - 0.44);
      }
      add(body, new THREE.CylinderGeometry(radius + 0.6, radius + 0.6, 0.5, 96), glaze, 0, top - 0.1);
      add(body, dripGeometry(radius + 0.59, top - 0.05, tier * 1.7 + ci), glaze);
      ring(body, radius + 0.28, 0.35, top + 0.13, glaze);
      ring(body, radius + 0.12, 0.35, bottom + 0.45, cream);
      // Piped cream rosettes and berries on the exposed edge of every tier.
      const count = tier === 2 ? 22 : 30;
      for (let i = 0; i < count; i++) {
        const a = i / count * TAU, r = radius - 1.15;
        const x = Math.cos(a) * r, z = Math.sin(a) * r;
        const d = add(body, dollopGeo, cream, x, top + 0.1, z);
        d.scale.setScalar(tier === 2 ? 0.9 : 0.7);
        if (i % 2 === 0) ball(body, ci ? cherry : pink, x, top + 1.5, z, 0.48, 0.55, 0.48);
      }
    });
    const top = levels[3];
    add(body, dollopGeo, cream, 0, top).scale.set(4.8, 2.1, 4.8);
    if (!ci) {
      // One giant strawberry makes the ascent identifiable from a distance.
      const berry = new THREE.Group(); berry.position.set(0, top + 1.8, 0); body.add(berry);
      const berryGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0), new THREE.Vector2(0.9, 0.5), new THREE.Vector2(2.2, 1.8),
        new THREE.Vector2(3.1, 3.5), new THREE.Vector2(3.15, 4.8), new THREE.Vector2(2.2, 5.8), new THREE.Vector2(0, 6.1),
      ], 28);
      add(berry, berryGeo, cherry);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 13; i++) {
        const a = (i + row * 0.5) / 13 * TAU, r = [1.55, 2.6, 3.13, 2.93][row];
        const m = ball(berry, seedMat, Math.cos(a) * r, 1.15 + row * 1.25, Math.sin(a) * r, 0.1, 0.19, 0.1);
        m.rotation.z = -Math.cos(a) * 0.3;
      }
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * TAU;
        const m = ball(berry, leaf, Math.cos(a) * 1.25, 6.0, Math.sin(a) * 1.25, 0.65, 0.18, 2.0);
        m.rotation.y = -a + Math.PI / 2;
      }
    } else {
      // Black-Forest-style crown: cherries and striped chocolate wafers.
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * 3.3, z = i % 2 ? -1.3 : 1.2;
        ball(body, cherry, x, top + 3.4, z, 2.2);
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x, top + 5.1, z), new THREE.Vector3(x + 0.4, top + 7, z), new THREE.Vector3(x + 1.4, top + 8, z + 0.6),
        ]);
        add(body, new THREE.TubeGeometry(curve, 10, 0.15, 6, false), leaf);
      }
      for (const side of [-1, 1]) {
        const waferStick = add(body, new THREE.CylinderGeometry(0.85, 0.85, 10, 12), wafer, side * 6, top + 4, -2);
        waferStick.rotation.z = side * 0.34;
        for (let i = 0; i < 5; i++) {
          const band = new THREE.Mesh(new THREE.CylinderGeometry(0.89, 0.89, 0.7, 12), ganache);
          band.position.y = -4 + i * 1.9; waferStick.add(band);
        }
      }
    }
    mergeByMaterial(body, { noCollide: false });
  }

  // Thick cream-edged wafer ribbon below BOTH serpentines and the connector.
  // The actual drivable surface is the shared track mesh, not a second road.
  const deck = new THREE.Group(); deck.name = 'cakeDeck'; group.add(deck);
  const n = Math.ceil((route.s1 - route.s0) / 2.2);
  const positions = [], indices = [], uvs = [];
  const profile = [[-C.deckHalfWidth, -0.12], [C.deckHalfWidth, -0.12], [C.deckHalfWidth, -0.82], [-C.deckHalfWidth, -0.82], [-C.deckHalfWidth, -0.12]];
  for (let i = 0; i <= n; i++) {
    const s = THREE.MathUtils.lerp(route.s0, route.s1, i / n);
    profile.forEach(([lat, dy], j) => {
      const p = track.getPose(s, lat).pos;
      positions.push(p.x, p.y + dy, p.z); uvs.push((s - route.s0) / 6, j / 4);
      if (i > 0 && j > 0) {
        const b = i * profile.length + j, a = b - profile.length;
        indices.push(a - 1, a, b - 1, b - 1, a, b);
      }
    });
  }
  const deckGeo = new THREE.BufferGeometry();
  deckGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  deckGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  deckGeo.setIndex(indices); deckGeo.computeVertexNormals();
  add(deck, deckGeo, wafer).name = 'cakeDeckRibbon';

  // Continuous candy balustrades protect the full-width road on the heights.
  const rails = new THREE.Group(); rails.name = 'cakeRails'; group.add(rails);
  const postGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.38, 8);
  const railBallGeo = new THREE.SphereGeometry(0.23, 6, 4);
  for (const side of [-1, 1]) {
    const upper = [], lower = [], rim = [];
    const count = Math.ceil((route.s1 - route.s0 - 4) / 5.2);
    for (let i = 0; i <= count; i++) {
      const s = THREE.MathUtils.lerp(route.s0 + 2, route.s1 - 2, i / count);
      const p = track.getPose(s, side * C.railOffset).pos;
      add(rails, postGeo, cane, p.x, p.y + 0.59, p.z);
      add(rails, railBallGeo, s < route.bridge.s1 ? pink : caramel, p.x, p.y + 1.34, p.z);
      upper.push(p.clone().add(new THREE.Vector3(0, 1.18, 0)));
      lower.push(p.clone().add(new THREE.Vector3(0, 0.5, 0)));
      rim.push(p.clone().add(new THREE.Vector3(0, -0.09, 0)));
    }
    for (const [points, radius] of [[upper, 0.14], [lower, 0.1], [rim, 0.2]]) {
      add(rails, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), count * 2, radius, 6, false), cream);
    }
  }
  mergeByMaterial(rails, { noCollide: false });

  // A genuine open arch underneath the high bridge (no ground-filled ribbon).
  const skyBridge = new THREE.Group(); skyBridge.name = 'cakeSkyBridge'; group.add(skyBridge);
  const mid = track.getPose((route.bridge.s0 + route.bridge.s1) / 2);
  const half = (route.bridge.s1 - route.bridge.s0) / 2 - 3;
  // Abutments cantilever from the cake bodies, not down through the lower
  // spiral. Keep a full-height opening above that crossing (including camera).
  const top = mid.pos.y - 0.8, foot = route.up.center.y + 14, apex = top - 3.2;
  const shape = new THREE.Shape();
  shape.moveTo(-half, top); shape.lineTo(half, top);
  for (let i = 0; i <= 64; i++) {
    const x = half - i / 64 * half * 2;
    shape.lineTo(x, foot + (apex - foot) * Math.sqrt(Math.max(0, 1 - (x / half) ** 2)));
  }
  shape.closePath();
  const archGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.8, bevelEnabled: false, steps: 1 });
  // Shape X = along bridge, Y = world up, extrusion Z = road right.
  const bridgeT = mid.tangent.clone().setY(0).normalize();
  const sideV = new THREE.Vector3().crossVectors(bridgeT, UP).normalize();
  const basis = new THREE.Matrix4().makeBasis(bridgeT, UP, sideV);
  for (const side of [-1, 1]) {
    const arch = add(skyBridge, archGeo, wafer);
    arch.quaternion.setFromRotationMatrix(basis);
    arch.position.copy(mid.pos).setY(0).addScaledVector(sideV, side * 6.8 - 0.4);
    const line = [];
    for (let i = 0; i <= 64; i++) {
      const x = -half + i / 64 * half * 2;
      const y = foot + (apex - foot) * Math.sqrt(Math.max(0, 1 - (x / half) ** 2));
      line.push(mid.pos.clone().setY(y).addScaledVector(bridgeT, x).addScaledVector(sideV, side * 7.28));
    }
    add(skyBridge, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line), 72, 0.38, 7, false), cream);
    for (const end of [-1, 1]) {
      const p = mid.pos.clone().addScaledVector(bridgeT, end * (half - 1.2)).addScaledVector(sideV, side * 6.8);
      const cake = end < 0 ? route.up : route.down;
      const radial = p.clone().sub(cake.center).setY(0).normalize();
      const base = cake.center.clone().addScaledVector(radial, cake.radii[1] - 2).setY(foot - 1.5);
      rod(skyBridge, base, p.clone().setY(top), 0.65, caramel);
    }
  }
  mergeByMaterial(skyBridge, { noCollide: false });

  // Small wafer brackets tie each spiral back to its cake, below the road.
  const brackets = new THREE.Group(); brackets.name = 'cakeBrackets'; group.add(brackets);
  for (const cake of [route.up, route.down]) {
    for (let s = cake.s0 + 18; s < cake.s1 - 8; s += 22) {
      const p = track.getPose(s).pos;
      const outward = p.clone().sub(cake.center).setY(0).normalize();
      const tier = Math.min(2, Math.max(0, Math.floor((p.y - cake.center.y) / (route.rise / 3))));
      const inner = cake.center.clone().addScaledVector(outward, cake.radii[tier] - 0.1).setY(p.y - 2.2);
      const outer = p.clone().addScaledVector(outward, -C.deckHalfWidth + 0.8).setY(p.y - 0.8);
      rod(brackets, inner, outer, 0.28, cream);
    }
  }
  mergeByMaterial(brackets, { noCollide: false });

  const signs = new THREE.Group(); signs.name = 'cakeSigns'; group.add(signs);
  const signMats = new Map();
  const sign = (s, lateral, text, color, arrow = false) => {
    const p = track.getPose(s, lateral);
    const width = arrow ? 2.8 : 8.2, height = arrow ? 0.85 : 2.05;
    const key = `${text}:${color}:${arrow}`;
    if (!signMats.has(key)) {
      const m = mat('#ffffff', 0.5, labelTexture(text, color, arrow)); m.side = THREE.DoubleSide;
      signMats.set(key, m);
    }
    const material = signMats.get(key);
    const board = add(signs, new THREE.PlaneGeometry(width, height), material, p.pos.x, p.pos.y + 2.8, p.pos.z);
    board.rotation.set(0, p.heading + Math.PI, 0);
    rod(signs, p.pos.clone().addScaledVector(UP, -0.3), p.pos.clone().addScaledVector(UP, 2.8), 0.16, cream);
  };
  sign(route.up.s0 - 18, 13.5, 'КЛУБНИЧНЫЙ ПОДЪЁМ', '#cb417d');
  sign(route.down.s0 + 18, -13.5, 'ШОКОЛАДНЫЙ СПУСК', '#774629');
  // Chevrons face the driver on the outside of each bend.
  for (const [cake, side, color] of [[route.up, 1, '#dd588d'], [route.down, -1, '#965426']]) {
    for (let s = cake.s0 + 32; s < cake.s1 - 20; s += 58) sign(s, side * 9.6, '', color, side === 1 ? 'right' : 'left');
  }

  mergeByMaterial(signs, { noCollide: false });

  // Ground scenery must not appear inside a cake or under an elevated turn.
  const blocks = (x, z) => [route.up, route.down].some((cake, i) =>
    Math.hypot(x - cake.center.x, z - cake.center.z) < (i ? C.downRadius[1] : C.upRadius[0]) + 22);
  return { group, blocks, route };
}
