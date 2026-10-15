// The four destinations, without direction spoilers. Roads themselves live in
// track.js and routing lives in routes.js: scenery never decides a path.
//
// Every destination follows the same three beats, so a child can read the
// choice from the world alone:
//   1. gate  — a colossal candy arch right after the split, carrying a picture
//      emblem (bear / star / cookie / cloud), so both options are obvious;
//   2. beacon — a tall silhouette on the shared approach (~120 m before the
//      split) that announces each branch while the road is still one;
//   3. body  — the branch's own material language: gumdrops, crystal, cookie
//      rock or clouds.
// Colours are baked into the geometry and everything is merged by material, so
// four fully decorated destinations still cost a handful of draw calls.
import * as THREE from 'three';
import { gummyBearGeometry } from './world.js';
import { mergeByMaterial, instanceGroups } from './merge.js';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';

const UP = new THREE.Vector3(0, 1, 0), FLOOR = -3.3;
const smooth = THREE.MathUtils.smoothstep;
const C = (hex) => new THREE.Color(hex);
// deterministic per-facet jitter — crystal must not look machine-made
const hash = (i, j = 0) => { const t = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return t - Math.floor(t); };

// ---------------------------------------------------------------- geometry
// mergeGeometries needs identical attribute sets, so every part is normalised
// to non-indexed position+normal+uv+colour. One vertex-coloured material can
// then draw gumdrops, gates, cookies and rocks in a single call.
function ensure(geo, color) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  if (color !== undefined && !g.attributes.color) {
    const c = color.isColor ? color : C(color);
    const n = g.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.Float32BufferAttribute(arr, 3));
  }
  return g;
}
// normalised copy + optional colour, scale, rotation (x,y,z) and position
function bake(geo, color, t = {}) {
  const g = ensure(geo, color);
  if (t.scale !== undefined) { if (Array.isArray(t.scale)) g.scale(t.scale[0], t.scale[1], t.scale[2]); else g.scale(t.scale, t.scale, t.scale); }
  if (t.rot) { if (t.rot[0]) g.rotateX(t.rot[0]); if (t.rot[1]) g.rotateY(t.rot[1]); if (t.rot[2]) g.rotateZ(t.rot[2]); }
  if (t.pos) g.translate(t.pos[0], t.pos[1], t.pos[2]);
  return g;
}
const join = (geos) => (geos.length ? mergeGeometries(geos, false) : new THREE.BufferGeometry());
function tubeBetween(a, b, r, color, seg = 6) {
  const d = b.clone().sub(a), len = Math.max(.001, d.length());
  const g = ensure(new THREE.CylinderGeometry(r, r, len, seg), color);
  g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize())));
  g.translate(a.x + d.x / 2, a.y + d.y / 2, a.z + d.z / 2);
  return g;
}
function starGeometry(r = 1) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * .46 : r;
    if (!i) shape.moveTo(Math.cos(a) * d, Math.sin(a) * d); else shape.lineTo(Math.cos(a) * d, Math.sin(a) * d);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: false });
}
// rock-candy cluster: stretched octahedra — lanterns, spikes, grotto crust
function crystalClusterGeometry(r = 1, n = 4) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const a = i * 2.399, d = i ? r * (.3 + .1 * (i % 2)) : 0;
    parts.push(bake(new THREE.OctahedronGeometry(r * (.52 - i * .06), 0), '#ffffff', {
      scale: [.85, 1.75 + (i % 3) * .3, .85], rot: [.25 * (i % 2), a, .3 * ((i % 3) - 1)],
      pos: [Math.cos(a) * d, .35 * (i % 2), Math.sin(a) * d],
    }));
  }
  return join(parts);
}
function gumdropGeometry(r = 1) {
  return join([
    bake(new THREE.SphereGeometry(r, 9, 6), '#ffffff', { scale: [1, .84, 1], pos: [0, r * .78, 0] }),
    bake(new THREE.SphereGeometry(r * .48, 7, 5), '#ffffff', { scale: [1.15, .55, 1.15], pos: [0, r * 1.5, 0] }),
  ]);
}
function cookieGeometry(r = 1, thickness = .55, chips = 5) {
  const parts = [bake(new THREE.CylinderGeometry(r, r, thickness, 14), '#ffffff', { rot: [Math.PI / 2, 0, 0] })];
  for (let i = 0; i < chips; i++) {
    const a = i * 2.399, d = r * (.25 + .45 * hash(i, 3)), cs = r * (.1 + .05 * hash(i, 9));
    parts.push(bake(new THREE.SphereGeometry(cs, 5, 3), C('#4b2a17'), { scale: [1, 1, .5], pos: [Math.cos(a) * d, Math.sin(a) * d, thickness / 2] }));
    parts.push(bake(new THREE.SphereGeometry(cs, 5, 3), C('#4b2a17'), { scale: [1, 1, .5], pos: [Math.cos(a + 1.1) * d, Math.sin(a + 1.1) * d, -thickness / 2] }));
  }
  return join(parts);
}
// cotton-candy puff: four low-poly lenses, ~unit radius
function puffGeometry() {
  return join([
    bake(new THREE.SphereGeometry(1, 7, 5), '#ffffff', { scale: [1, .84, .96] }),
    bake(new THREE.SphereGeometry(.74, 6, 4), '#ffffff', { pos: [.86, .18, .12] }),
    bake(new THREE.SphereGeometry(.66, 6, 4), '#ffffff', { pos: [-.8, .04, -.26] }),
    bake(new THREE.SphereGeometry(.56, 6, 4), '#ffffff', { pos: [.14, .56, -.6] }),
  ]);
}
// round emblem plate with a rim, built in the gate's local X/Y plane
function plateGeometry(r) {
  return join([
    bake(new THREE.CylinderGeometry(r, r, .5, 18), '#ffffff', { rot: [Math.PI / 2, 0, 0] }),
    bake(new THREE.TorusGeometry(r, .34, 5, 18), '#ffffff'),
  ]);
}

// ------------------------------------------------------------------ builder
export function createForks(scene, track, TEX = {}) {
  const group = new THREE.Group(); group.name = 'forkDestinations'; scene.add(group);
  const staticParts = new THREE.Group(); staticParts.name = 'forkScenery'; group.add(staticParts);
  const overhead = new THREE.Group(); overhead.name = 'forkOverhead'; group.add(overhead);
  // Instanced sets stay outside the merged groups: merging would bake thousands
  // of puffs/chips into one buffer and defeat the point of instancing.
  const props = new THREE.Group(); props.name = 'forkProps'; group.add(props);

  const vcMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .62, metalness: .04 });
  const crystalMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .18, metalness: .04,
    side: THREE.DoubleSide, emissive: C('#2a1a5c'), emissiveIntensity: .62 });
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  const caneMat = new THREE.MeshStandardMaterial({ map: TEX.cane || null, color: TEX.cane ? '#ffffff' : '#ef8cb8', roughness: .48, side: THREE.DoubleSide });
  const bedMat = new THREE.MeshStandardMaterial({ color: '#dbefcc', map: TEX.meadow || null, roughness: .9 });
  const cloudMat = new THREE.MeshStandardMaterial({ roughness: .96, metalness: 0 });
  const gemMat = new THREE.MeshBasicMaterial({ toneMapped: false });       // instanced, per-instance colour
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .1,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const add = (parent, geo, material = vcMat) => { const m = new THREE.Mesh(geo, material); parent.add(m); return m; };
  const worldMatrix = (pose) => new THREE.Matrix4().makeRotationY(pose.heading).setPosition(pose.pos);
  // geometry is authored in local X (lateral) / Y (up) / Z (along the road)
  const placeAll = (parent, geos, pose, material = vcMat) => {
    const m = worldMatrix(pose);
    for (const g of geos) { const c = g.clone(); c.applyMatrix4(m); add(parent, c, material); g.dispose(); }
  };
  const instanced = (parent, geo, material, items, name) => {
    if (!items.length) return null;
    const im = new THREE.InstancedMesh(geo, material, items.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3();
    items.forEach((it, i) => {
      q.setFromAxisAngle(UP, it.rot || 0);
      v.set(it.s ?? 1, (it.s ?? 1) * (it.sy ?? 1), it.s ?? 1);
      im.setMatrixAt(i, m4.compose(it.p, q, v));
      if (it.c) im.setColorAt(i, it.c);
    });
    if (items.some((it) => it.c)) im.instanceColor.needsUpdate = true;
    im.name = name; im.castShadow = false; im.receiveShadow = false; im.userData.noCollide = true;
    parent.add(im);
    return im;
  };

  // Every decoration keeps the car envelope free: the QA rays run at
  // |lateral| <= 8 m from the road centre and 3.4 m up, so nothing may sit
  // closer than CLEAR + its own radius to EITHER branch of the same fork
  // (near the split and the merge the two roads are only a few metres apart).
  const CLEAR = 8.3;
  const lineSamples = [];
  const clearOther = (branchIndex, p, need) => {
    const other = lineSamples[branchIndex ^ 1];
    if (!other) return true;
    const n2 = need * need;
    for (const v of other) if (v.distanceToSquared(p) < n2) return false;
    return true;
  };

  const bearGeo = gummyBearGeometry(true);
  const star = starGeometry(1.1);
  const clusterGeo = crystalClusterGeometry(1, 4);
  const bears = [], corridors = [];
  const gumColors = ['#efa754', '#ed84af', '#82cbb5', '#e5cb65', '#b18ee8'];
  const gemColors = ['#ffe89b', '#a8f0ff', '#e0b6ff', '#ffc2e4'];
  const floorY = (s) => track.getBasePose(s).pos.y - 3.05;

  for (const f of track.routes.forks) {
    // ---- shared approach: keep it clear of random props --------------------
    for (let s = f.s0 - f.warning; s < f.s0; s += 5) corridors.push(track.getBasePose(s).pos);
    lineSamples.length = 0;
    for (const b of f.branches) {
      const line = [];
      for (let i = 0; i <= 72; i++) line.push(track.getPose(f.s0 + f.span * i / 72, 0, b.index).pos);
      lineSamples.push(line);
    }

    // A low meadow island, not airborne grass over either playable ribbon.
    const bed = { pos: [], uv: [], idx: [] }, n = 110;
    for (let i = 0; i <= n; i++) {
      const q = i / n, s = f.s0 + f.span * q, p = track.getBasePose(s);
      const width = 20 + f.spread * Math.sin(Math.PI * q) ** 2;
      for (let k = 0; k < 5; k++) {
        const x = (k - 2) / 2 * width, v = p.pos.clone().addScaledVector(p.right, x);
        v.y = k === 0 || k === 4 ? FLOOR : p.pos.y - 3.1;
        bed.pos.push(v.x, v.y, v.z); bed.uv.push(v.x / 9, v.z / 9);
      }
      if (i < n) for (let k = 0; k < 4; k++) { const j = i * 5 + k; bed.idx.push(j, j + 1, j + 5, j + 5, j + 1, j + 6); }
    }
    const bedGeo = new THREE.BufferGeometry();
    bedGeo.setAttribute('position', new THREE.Float32BufferAttribute(bed.pos, 3));
    bedGeo.setAttribute('uv', new THREE.Float32BufferAttribute(bed.uv, 2));
    bedGeo.setIndex(bed.idx); bedGeo.computeVertexNormals();
    add(staticParts, ensure(bedGeo, '#ffffff'), bedMat).name = 'forkMeadow';

    for (const route of f.branches) {
      const side = route.index ? 1 : -1; // branches fan left (0) and right (1)
      const pose = (q, lat = 0) => track.getPose(f.s0 + f.span * q, lat, route.index);
      const point = (q, lat = 0, dy = 0) => pose(q, lat).pos.clone().addScaledVector(UP, dy);
      const at = (q) => f.s0 + f.span * q;
      for (let i = 0; i <= 70; i++) corridors.push(point(i / 70));

      // ---- the gate: two candy legs, a giant arch, a picture emblem -------
      // Legs stand 10.4 m out (the soft steering wall is 6.4 m) and the arch
      // clears 11 m, so even a jumping car passes underneath untouched.
      const GATE_Q = .26, GATE_W = 12.2, LEG_H = 9.6, badgeY = LEG_H + GATE_W + 1.6;
      const gate = route.gate || {};
      const gp = pose(GATE_Q);
      const legs = [], caneLegs = [], arch = [], emblem = [], signLights = [];
      for (const s2 of [-1, 1]) {
        // candy-cane columns 2.2 m thick: a gate a car can drive through
        caneLegs.push(bake(new THREE.CylinderGeometry(1.9, 2.2, LEG_H, 12), '#ffffff', { pos: [s2 * GATE_W, LEG_H / 2, 0] }));
        legs.push(bake(new THREE.TorusGeometry(2.3, .55, 5, 12), gate.accent || '#ffd77a', { rot: [Math.PI / 2, 0, 0], pos: [s2 * GATE_W, .7, 0] }));
        legs.push(bake(new THREE.CylinderGeometry(2.5, 2.9, 1.2, 12), gate.leg || '#f6e3c4', { pos: [s2 * GATE_W, .6, 0] }));
        for (let i = 1; i <= 3; i++) legs.push(bake(new THREE.TorusGeometry(2.0 - i * .05, .3, 4, 10), gate.accent || '#ffd77a', { rot: [Math.PI / 2, 0, 0], pos: [s2 * GATE_W, i * 2.6, 0] }));
      }
      arch.push(bake(new THREE.TorusGeometry(GATE_W, 1.5, 6, 20, Math.PI), gate.arch || '#fff1de', { pos: [0, LEG_H, 0] }));
      arch.push(bake(new THREE.TorusGeometry(GATE_W + .4, .6, 5, 20, Math.PI), gate.accent || '#ffd77a', { pos: [0, LEG_H + 1.5, 0] }));
      // +Z side faces away from the driver: rim and halo, the -Z face carries
      // the emblem (see the offsets below).
      emblem.push(bake(new THREE.TorusGeometry(5.9, .5, 5, 22), C(gate.accent || '#ffd77a'), { pos: [0, badgeY, .25] }));
      signLights.push(bake(plateGeometry(5.6), '#eee5d2', { pos: [0, badgeY, 0] }));
      signLights.push(bake(new THREE.TorusGeometry(6.35, .34, 5, 22), C(gate.accent || '#ffd77a'), { pos: [0, badgeY, .1] }));
      const kind = route.emblem || 'star';
      emblem.push(kind === 'bear' ? bake(bearGeo, C('#6cbb90'), { scale: 4.0, pos: [0, badgeY - 5.4, -.62] })
        : kind === 'star' ? bake(star, C('#f5c33f'), { scale: 4.4, rot: [0, 0, Math.PI / 5], pos: [0, badgeY - .1, -.5] })
          : kind === 'cookie' ? bake(cookieGeometry(4.6, 1.05, 7), C('#b3733a'), { pos: [0, badgeY - .1, -.5] })
            : join([[0, -1.7, -1.5, 2.7, '#f2f9ff'], [1, 1.7, -1.5, 2.5, '#a7dcf2'],
              [2, -1.55, 1.5, 2.5, '#a7dcf2'], [3, 1.7, 1.5, 2.7, '#f2f9ff']]
              .map(([, x, y, sc, col]) => bake(puffGeometry(), C(col), { scale: sc, pos: [x, badgeY - .1 + y, -.55] }))));
      placeAll(overhead, caneLegs, gp, caneMat);
      placeAll(overhead, legs.concat(arch, emblem), gp);
      placeAll(overhead, signLights, gp, glowMat);

      // ------------------------------------------------- gummy bear hills --
      if (route.kind === 'hills') {
        const mounds = [], drops = [];
        for (let i = 0; i < 30; i++) {
          const q = .04 + .92 * (i / 29), sd = i % 2 ? 1 : -1;
          const scale = 1.7 + (i % 4) * .35;
          const p = pose(q, sd * (11.9 + (i % 5) * 2.2));
          if (!clearOther(route.index, p.pos, CLEAR + scale * 1.1)) continue;
          mounds.push(bake(gumdropGeometry(1), C(gumColors[i % gumColors.length]), {
            scale, rot: [0, q * 9, 0], pos: [p.pos.x, floorY(at(q)), p.pos.z],
          }));
        }
        add(staticParts, join(mounds));
        for (let i = 0; i < 12; i++) {
          const q = [.03, .13, .26, .38, .5, .62, .74, .86, .94][i % 9], sd = i % 2 ? 1 : -1;
          const p = pose(q, sd * (15.4 + (i % 3) * 2.0));
          if (!clearOther(route.index, p.pos, CLEAR + 3.4)) continue;
          const floor = floorY(at(q)), stand = p.pos.y - .35, height = Math.max(1.4, stand - floor + .4);
          // a striped candy plinth so a bear is a landmark, not a lump
          add(staticParts, join([
            bake(new THREE.CylinderGeometry(2.7, 3.2, height, 16), '#fff1de', { pos: [p.pos.x, floor + height / 2, p.pos.z] }),
            bake(new THREE.CylinderGeometry(2.9, 2.9, .3, 16), C('#f3c975'), { pos: [p.pos.x, floor + height + .12, p.pos.z] }),
          ]));
          const g = new THREE.Group(); g.name = 'gummyFriend';
          g.position.copy(p.pos); g.position.y = stand + .5;
          g.rotation.y = p.heading + Math.PI; g.scale.setScalar(3.1);
          const gm = new THREE.MeshPhysicalMaterial({ color: gumColors[i % gumColors.length], roughness: .2, clearcoat: 1, metalness: .03 });
          g.add(new THREE.Mesh(bearGeo, gm));
          for (const x of [-.12, .12]) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(.045, 7, 4), new THREE.MeshStandardMaterial({ color: '#5c414b' }));
            eye.position.set(x, 1.55, .39); g.add(eye);
          }
          group.add(g); g.userData.baseY = g.position.y; bears.push(g);
        }
        // cane arches over the road: the hills' own rhythm
        for (const q of [.42, .62, .82]) {
          if (!clearOther(route.index, pose(q).pos, CLEAR + 10.5)) continue;
          const parts = [];
          for (const s2 of [-1, 1]) {
            parts.push(bake(new THREE.CylinderGeometry(.55, .62, 9.4, 8), '#ffffff', { pos: [s2 * 9.7, 4.7, 0] }));
            parts.push(bake(new THREE.TorusGeometry(.62, .3, 5, 10), '#ffffff', { rot: [Math.PI / 2, 0, 0], pos: [s2 * 9.7, 9.4, 0] }));
          }
          parts.push(bake(new THREE.TorusGeometry(9.7, .62, 6, 18, Math.PI), '#ffffff', { pos: [0, 9.4, 0] }));
          placeAll(overhead, parts, pose(q), caneMat);
        }
      }

      // ------------------------------------------- crystal candy grotto ----
      if (route.kind === 'grotto') {
        const Q0 = .32, Q1 = .74, ST = 42, AN = 13, A = 12.1, B = 10.8, CY = -0.4, THICK = 2.1;
        const rings = [];
        for (let i = 0; i <= ST; i++) {
          const q = Q0 + (Q1 - Q0) * i / ST, t = i / ST;
          // flared geode mouths at both ends so the camera never clips a wall
          const flare = 1 + .18 * (1 - smooth(t, .015, .12)) + .18 * smooth(t, .88, .985);
          const p = point(q), r = pose(q), base = p.y;
          const inner = [], outer = [], cols = [];
          for (let j = 0; j <= AN; j++) {
            const th = .035 * Math.PI + (Math.PI * .93) * j / AN;
            const j1 = .93 + .14 * hash(i * 3.7, j * 2.3), j2 = .95 + .1 * hash(i * 1.9 + 5, j * 4.1);
            const x = Math.cos(th) * A * flare * j1, y = CY + Math.sin(th) * B * flare * j2;
            inner.push(p.clone().addScaledVector(r.right, x).addScaledVector(UP, y));
            outer.push(p.clone().addScaledVector(r.right, x * (1 + THICK / A) + 1.1 * Math.cos(th)).addScaledVector(UP, y * (1 + THICK / B) + 1.1 * Math.sin(th)));
            // colour: deep violet low, glowing crystal veins high
            const band = .16 + .84 * Math.sin(th) ** 1.8, flick = .62 + .72 * hash(i * 2.1, j * 5.3);
            const col = C('#120b2c').lerp(C('#b28dff'), band * .72).multiplyScalar(flick);
            if (hash(i * 7.1, j) > .84) col.lerp(C('#9ff0ff'), .6);
            cols.push(col);
          }
          rings.push({ inner, outer, cols, base });
        }
        const pos = [], colr = [], uvs = [];
        const tri = (a, b, c, c3) => {
          for (const p of [a, b, c]) { pos.push(p.x, p.y, p.z); uvs.push(p.x / 13, p.z / 13); colr.push(c3.r, c3.g, c3.b); }
        };
        for (let i = 0; i < ST; i++) for (let j = 0; j < AN; j++) {
          const r0 = rings[i], r1 = rings[i + 1];
          const c = r0.cols[j].clone().lerp(r0.cols[j + 1], .5).lerp(r1.cols[j], .35);
          // inner skin (faces the road) and crystal crust outside
          tri(r0.inner[j], r1.inner[j], r1.inner[j + 1], c);
          tri(r0.inner[j], r1.inner[j + 1], r0.inner[j + 1], c);
          const c2 = c.clone().multiplyScalar(.9).lerp(C('#7d63d8'), .55).lerp(C('#dff1ff'), .18);
          tri(r0.outer[j], r0.outer[j + 1], r1.outer[j + 1], c2);
          tri(r0.outer[j], r1.outer[j + 1], r1.outer[j], c2);
          // the two geode rims (a thick crystal lip at both mouths)
          if (i === 0) { tri(r0.inner[j], r0.outer[j], r0.outer[j + 1], C('#b79bff')); tri(r0.inner[j], r0.outer[j + 1], r0.inner[j + 1], C('#b79bff')); }
          if (i === ST - 1) { tri(r1.inner[j], r1.outer[j + 1], r1.outer[j], C('#b79bff')); tri(r1.inner[j], r1.inner[j + 1], r1.outer[j + 1], C('#b79bff')); }
        }
        const shellGeo = new THREE.BufferGeometry();
        shellGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        shellGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        shellGeo.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3));
        shellGeo.computeVertexNormals();
        add(overhead, shellGeo, crystalMat).name = 'grottoShell';

        // the crystal grows out of the meadow: a lofted skirt under both
        // bottom edges, carried below the terrain so nothing floats
        const skirtPos = [], skirtCol = [], skirtUv = [];
        const pushV = (v, c) => { skirtPos.push(v.x, v.y, v.z); skirtUv.push(v.x / 12, v.z / 12); skirtCol.push(c.r, c.g, c.b); };
        for (let i = 0; i < ST; i++) for (const j of [0, AN]) {
          const r0 = rings[i], r1 = rings[i + 1];
          const a0 = r0.inner[j], a1 = r1.inner[j];
          const yGround = -3.5; // below the fork meadow, so the wall really lands
          const b0 = new THREE.Vector3(a0.x, a0.y + yGround, a0.z), b1 = new THREE.Vector3(a1.x, a1.y + yGround, a1.z);
          const c0 = C('#2a1c55').lerp(C('#7d63d8'), .25 + .3 * hash(i, j));
          const c1 = C('#2a1c55').lerp(C('#7d63d8'), .25 + .3 * hash(i + 1, j));
          if (j === 0) { pushV(b0, c0); pushV(a0, c0); pushV(a1, c1); pushV(b0, c0); pushV(a1, c1); pushV(b1, c1); }
          else { pushV(a0, c0); pushV(b0, c0); pushV(b1, c1); pushV(a0, c0); pushV(b1, c1); pushV(a1, c1); }
        }
        const skirtGeo = new THREE.BufferGeometry();
        skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(skirtPos, 3));
        skirtGeo.setAttribute('uv', new THREE.Float32BufferAttribute(skirtUv, 2));
        skirtGeo.setAttribute('color', new THREE.Float32BufferAttribute(skirtCol, 3));
        skirtGeo.computeVertexNormals();
        add(overhead, skirtGeo, crystalMat).name = 'grottoSkirt';

        // glowing ribs, vault gems, wall lanterns — the light inside the dark
        const ribs = [], gems = [], lanterns = [], halos = [];
        for (let k = 0; k <= 5; k++) {
          const q = Q0 + .05 + (Q1 - Q0 - .1) * k / 5, p = point(q), r = pose(q);
          const band = C(gemColors[k % gemColors.length]);
          let prev = null;
          for (let j = 0; j <= 18; j++) {
            const th = .05 * Math.PI + (Math.PI * .9) * j / 18;
            const v = p.clone().addScaledVector(r.right, Math.cos(th) * A * 1.0).addScaledVector(UP, CY + Math.sin(th) * B * 1.0);
            if (prev) ribs.push(tubeBetween(prev, v, j === 0 || j === 18 ? .3 : .17, band, 5));
            prev = v;
          }
        }
        for (let i = 0; i < 34; i++) {
          const q = Q0 + .03 + (Q1 - Q0 - .06) * hash(i, 11), p = point(q), r = pose(q);
          const th = .22 * Math.PI + .56 * Math.PI * hash(i, 21);
          gems.push({ p: p.clone().addScaledVector(r.right, Math.cos(th) * A * .97).addScaledVector(UP, CY + Math.sin(th) * B * .97),
            s: .45 + .7 * hash(i, 31), rot: hash(i, 41) * 3, c: C(gemColors[i % gemColors.length]).multiplyScalar(.85) });
        }
        const pools = [];
        for (let i = 0; i < 12; i++) {
          const q = Q0 + .05 + (Q1 - Q0 - .1) * i / 11;
          for (const s2 of [-1, 1]) {
            const p = point(q), r = pose(q);
            const v = p.clone().addScaledVector(r.right, s2 * A * .93).addScaledVector(UP, 3.1 + (i % 3) * .45);
            lanterns.push({ p: v, s: .95, rot: q * 3 + (s2 > 0 ? .7 : 0), c: C(gemColors[(i + (s2 > 0 ? 1 : 0)) % gemColors.length]).multiplyScalar(.85) });
            halos.push({ p: v, s: .95 });
            // the lantern's light lands on the road as a soft pool: no real
            // light source, but the eye reads it as one
            const poolPose = track.getPose(f.s0 + f.span * q, s2 * 5.4, route.index);
            pools.push({ p: poolPose.pos.clone().addScaledVector(UP, .1), s: 1.35, sy: .014, rot: q * 7,
              c: C(gemColors[(i + (s2 > 0 ? 1 : 0)) % gemColors.length]) });
          }
        }
        // geode crust: crystal clusters growing out of the walls, and larger
        // ones breaking through the outer shell so the landmark reads as a
        // cracked candy geode from the approach, not as a purple hill
        const inner = [], outerCrust = [];
        for (let i = 0; i < 40; i++) {
          const q = Q0 + .02 + (Q1 - Q0 - .04) * hash(i, 91), p = point(q), r = pose(q);
          const s2 = i % 2 ? 1 : -1, th = .06 * Math.PI + .42 * Math.PI * hash(i, 93);
          inner.push({ p: p.clone().addScaledVector(r.right, s2 * Math.cos(th) * A * .96).addScaledVector(UP, CY + Math.sin(th) * B * .96),
            s: .8 + .6 * hash(i, 95), rot: hash(i, 97) * 3, c: C(gemColors[i % gemColors.length]).multiplyScalar(.95) });
        }
        for (let i = 0; i < 30; i++) {
          const q = Q0 + (Q1 - Q0) * (.03 + .94 * hash(i, 101)), p = point(q), r = pose(q);
          const s2 = i % 2 ? 1 : -1, th = .08 * Math.PI + .55 * Math.PI * hash(i, 103);
          const v = p.clone().addScaledVector(r.right, s2 * Math.cos(th) * (A + THICK + .9))
            .addScaledVector(UP, CY + Math.sin(th) * (B + THICK + .9));
          outerCrust.push(bake(clusterGeo, C(i % 3 ? '#8f76e8' : '#b9a4ff').lerp(C('#e6faff'), .3), {
            scale: 1.7 + 1.1 * hash(i, 105), rot: [0, hash(i, 107) * 3, s2 * (.2 + .5 * hash(i, 109))],
            pos: [v.x, v.y, v.z],
          }));
        }
        add(overhead, join(outerCrust), crystalMat);
        instanced(props, new THREE.SphereGeometry(1, 12, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: .12, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
          pools, 'grottoPools');
        instanced(props, clusterGeo, crystalMat, inner, 'grottoCrystals');
        instanced(props, clusterGeo, gemMat.clone(), lanterns, 'grottoLanterns');
        instanced(props, new THREE.SphereGeometry(1, 8, 5), haloMat, halos, 'grottoHalos');
        instanced(props, new THREE.OctahedronGeometry(.55, 0), gemMat.clone(), gems, 'grottoGems');
        add(overhead, join(ribs), glowMat);

        // the light at the end: a big glowing star on the exit mouth, and a
        // matching one on the entrance so the grotto is marked from outside
        for (const q of [Q0, Q1]) {
          const p = pose(q);
          const g = join([
            bake(star, C('#ffe9a6'), { scale: 2.1, rot: [0, 0, Math.PI / 5], pos: [0, 9.9, 0] }),
            bake(new THREE.TorusGeometry(4.6, .3, 5, 18), C('#f7d98a'), { pos: [0, 9.9, 0] }),
          ]);
          placeAll(overhead, [g], p, glowMat);
          for (const [rs, op] of [[2.4, .04], [1.5, .07]]) {
            const glow = bake(new THREE.SphereGeometry(rs, 10, 7), C('#fff0c0'), { scale: [1, 1, .3], pos: [0, 9.9, 0] });
            placeAll(overhead, [glow], p, new THREE.MeshBasicMaterial({ transparent: true, opacity: op,
              blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
          }
        }

        // geode mouths: crystal spikes flaring outward, like a cracked candy
        const spikes = [];
        for (const q of [Q0, Q1]) for (const s2 of [-1, 1]) {
          const p = pose(q, s2 * (A * 1.2));
          for (let k = 0; k < 4; k++) {
            const th = .18 * Math.PI + .64 * Math.PI * k / 3;
            const v = point(q).addScaledVector(p.right, s2 * Math.cos(th) * A * 1.2).addScaledVector(UP, CY + Math.sin(th) * B * 1.2);
            if (!clearOther(route.index, v, CLEAR + 3.2)) continue;
            spikes.push(bake(clusterGeo, C(gemColors[(k + (s2 > 0 ? 2 : 0)) % gemColors.length]).multiplyScalar(1.3), {
              scale: 2.4 + (k % 2) * .8, rot: [0, q * 4, s2 * .5], pos: [v.x, v.y, v.z],
            }));
          }
        }
        add(overhead, join(spikes), crystalMat);
      }

      // ------------------------------------------------- cookie canyon -----
      if (route.kind === 'jump') {
        const slabs = [], chips = [], crumbs = [], stacks = [];
        for (let i = 0; i < 14; i++) {
          const q = .04 + .92 * (i / 13), sd = i % 2 ? 1 : -1;
          const r = 5.2 + (i % 4) * 1.6;
          const p = pose(q, sd * (10.2 + r * 1.15));
          if (!clearOther(route.index, p.pos, CLEAR + r * 1.2)) continue;
          slabs.push(bake(cookieGeometry(r, 2.3, 6), C(i % 3 ? '#c4854a' : '#b0703a'), {
            rot: [0, .4 * i + (sd > 0 ? .3 : 0), sd * .2], pos: [p.pos.x, floorY(at(q)) + r * .66, p.pos.z],
          }));
        }
        for (let i = 0; i < 24; i++) {
          const q = .04 + .92 * hash(i, 7), sd = i % 2 ? 1 : -1;
          const p = pose(q, sd * (11.8 + 4.4 * hash(i, 13)));
          if (!clearOther(route.index, p.pos, CLEAR + 3.0)) continue;
          chips.push({ p: new THREE.Vector3(p.pos.x, floorY(at(q)) + .7, p.pos.z), s: 1.2 + 1.7 * hash(i, 17), rot: hash(i, 19) * 3, c: C(i % 3 ? '#5a3418' : '#7a4a24') });
        }
        for (let i = 0; i < 48; i++) {
          const q = .03 + .94 * hash(i, 23), sd = i % 2 ? 1 : -1;
          const p = pose(q, sd * (10.4 + 3.2 * hash(i, 29)));
          if (!clearOther(route.index, p.pos, CLEAR + 1.4)) continue;
          crumbs.push({ p: new THREE.Vector3(p.pos.x, floorY(at(q)) + 1.5, p.pos.z), s: .5 + .8 * hash(i, 31), rot: hash(i, 37) * 3, c: C(i % 4 ? '#e7b273' : '#8a5228') });
        }
        add(staticParts, join(slabs));
        instanced(props, new THREE.SphereGeometry(1, 7, 5), new THREE.MeshStandardMaterial({ roughness: .9, metalness: .02 }), chips, 'forkChocChips');
        instanced(props, new THREE.OctahedronGeometry(.7, 0), new THREE.MeshStandardMaterial({ roughness: .82, flatShading: true }), crumbs, 'forkCrumbs');
        // a giant cookie stack, on the approach, outside the cookie road: the
        // silhouette a child sees while the road is still shared
        const bq = .40, bp = pose(bq, -18.5), bBase = floorY(at(bq));
        for (let i = 0; i < 4; i++) {
          stacks.push(bake(cookieGeometry(6.2 - i * .8, 2.4, 8), C(i % 2 ? '#c4854a' : '#b0703a'), { rot: [0, i * .6, 0], pos: [bp.pos.x, bBase + 1.7 + i * 3.3, bp.pos.z] }));
        }
        add(staticParts, join(stacks));
        corridors.push(bp.pos.clone());
      }

      // ------------------------------------------------- skyway (clouds) ---
      if (route.kind === 'cloud') {
        const puffs = [], arcs = [], islands = [];
        // cloud curb beside the deck, banks underneath: the road rides a cloud
        // How high the cloud deck rides here: nothing hangs under a deck that
        // is still at ground level (that is where the roads fan in and out).
        const lift = (q) => { const u = (q - .22) / .56; return u <= 0 || u >= 1 ? 0 : 8.5 * 64 * (u * (1 - u)) ** 3; };
        for (let i = 0; i <= 44; i++) {
          const q = .03 + .94 * i / 44, liftQ = lift(q);
          for (const sd of [-1, 1]) {
            const p = pose(q, sd * 12.4);
            if (clearOther(route.index, p.pos, CLEAR + 3.6)) {
              puffs.push({ p: p.pos.clone().addScaledVector(UP, -.1), s: 1.5 + .3 * hash(i, sd + 4), rot: i * .7, sy: .8,
                c: C(i % 5 === 0 ? '#ffd9ef' : i % 3 === 0 ? '#d6ecff' : '#ffffff') });
            }
            if (liftQ > 3.2) {
              const u = pose(q, sd * (2.6 + 1.4 * hash(i, 44))).pos.clone().addScaledVector(UP, -3.6 - 2.1 * hash(i, 55));
              puffs.push({ p: u, s: 3.2 + 1.4 * hash(i, 66), rot: i * .43, sy: .84, c: C(i % 4 ? '#fffdfe' : '#cdeef9') });
              if (i % 4 === 0) {
                const w = pose(q, sd * 6.3).pos.clone().addScaledVector(UP, -6.6);
                puffs.push({ p: w, s: 4.4 + 1.2 * hash(i, 77), rot: i * .31, sy: .84, c: C(i % 2 ? '#fffdfe' : '#f3f7ff') });
              }
            }
          }
        }
        const cloudSet = instanced(props, puffGeometry(), cloudMat, puffs, 'skywayClouds');
        if (cloudSet) { cloudSet.castShadow = true; cloudSet.receiveShadow = true; }

        // rainbow arches over the road: the skyway's own rhythm, fat enough to
        // read from the approach and with real thickness above the car
        const bands = ['#ff5b7f', '#ffa63d', '#ffe45e', '#75e07a', '#5cc8ff', '#a97bff'];
        for (let ai = 0; ai < 6; ai++) {
          const q = .28 + .12 * ai, cp = pose(q), parts = [];
          // the arch spans the road, so it must clear the NEIGHBOURING branch
          if (!clearOther(route.index, cp.pos, CLEAR + 12.8)) continue;
          for (const s2 of [-1, 1]) {
            parts.push(bake(new THREE.CylinderGeometry(.44, .5, 3.2, 7), '#ffffff', { pos: [s2 * 12.6, 1.6, 0] }));
            parts.push(bake(puffGeometry(), C('#fff9fd'), { scale: [1.7, 1.3, 1.7], pos: [s2 * 12.6, .5, 0] }));
          }
          for (let b = 0; b < bands.length; b++) {
            const R2 = 12.1 - b * .42;
            parts.push(bake(new THREE.TorusGeometry(R2, .44, 6, 26, Math.PI), C(bands[b]), { pos: [0, 3.2, 0] }));
          }
          placeAll(overhead, parts, cp, glowMat);
        }

        // floating candy islands: the horizon of the high road
        for (let i = 0; i < 8; i++) {
          const q = .24 + .52 * (i / 7), sd = i % 2 ? 1 : -1;
          const p = pose(q, sd * (34 + 12 * (i % 3)));
          if (!clearOther(route.index, p.pos, CLEAR + 9.5)) continue;
          const y = p.pos.y + 3 + (i % 3) * 5;
          const parts = [
            bake(new THREE.SphereGeometry(7, 10, 7), C('#d9baa5'), { scale: [1, .62, 1], pos: [0, -5.4, 0] }),
            bake(new THREE.SphereGeometry(7.4, 12, 8), C('#8fd6a2'), { scale: [1, .3, 1] }),
          ];
          for (let k = 0; k < 4; k++) {
            const ax = (k - 1.5) * 3.6, az = (k % 2 ? 2.4 : -2.6);
            parts.push(bake(new THREE.CylinderGeometry(.3, .36, 3.4, 6), C('#c98b6b'), { pos: [ax, 1.7, az] }));
            parts.push(bake(new THREE.CylinderGeometry(1.15, 1.15, .4, 12), C(['#ff9ec9', '#9fd8ff', '#ffe08a'][k % 3]), { rot: [Math.PI / 2, 0, 0], pos: [ax, 3.6, az] }));
          }
          const m = worldMatrix(p);
          for (const g0 of parts) { const c = g0.clone(); c.translate(0, y - p.pos.y, 0); c.applyMatrix4(m); islands.push(c); g0.dispose(); }
        }
        add(staticParts, join(islands));

        // cloud tower beside the gate: the "high road" beacon, 28 m tall
        const tq = .38, tp = pose(tq, 24.5), tBase = floorY(at(tq)), tower = [];
        for (let i = 0; i < 5; i++) {
          tower.push(bake(puffGeometry(), C(i % 2 ? '#fff9fd' : '#e6f6ff'), { scale: 3.6 - i * .25, rot: [0, i * .5, 0], pos: [tp.pos.x, tBase + 2.6 + i * 4.2, tp.pos.z] }));
        }
        tower.push(bake(new THREE.TorusGeometry(4.4, .45, 5, 16), C('#a97bff'), { rot: [Math.PI / 2, 0, 0], pos: [tp.pos.x, tBase + 21, tp.pos.z] }));
        tower.push(bake(starGeometry(2.2), C('#ffe27a'), { scale: 1.3, rot: [0, .4, 0], pos: [tp.pos.x, tBase + 23.2, tp.pos.z] }));
        add(staticParts, join(tower));
        corridors.push(tp.pos.clone());
      }
    }
  }
  mergeByMaterial(staticParts, { castShadow: false, receiveShadow: true, noCollide: false });
  mergeByMaterial(overhead, { castShadow: false, receiveShadow: false, noCollide: true }); // overhead: the car passes under
  const { sync: syncBears } = instanceGroups(group, bears, 'forkGummyFriends');
  function update(dt, time, s) {
    for (let i = 0; i < bears.length; i++) {
      const b = bears[i];
      b.position.y = b.userData.baseY + Math.abs(Math.sin(time * 1.8 + i)) * .22;
      b.rotation.z = Math.sin(time * 1.5 + i) * .04;
    }
    syncBears();
  }
  // Inside the grotto the daylight fades out — the crystal walls, the ribs and
  // the car's headlight carry the light, exactly like the chocolate tunnel.
  function darkness(s) {
    const f = track.routes.at(s);
    if (!f || f.branches[track.routes.choice(f)]?.kind !== 'grotto') return 0;
    const q = (s - f.s0) / f.span;
    return .8 * smooth(q, .345, .395) * (1 - smooth(q, .665, .715));
  }
  function blocks(x, z) { return corridors.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < 28 ** 2); }
  return { group, update, darkness, blocks };
}
