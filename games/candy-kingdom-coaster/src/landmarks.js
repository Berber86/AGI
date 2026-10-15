// Two things the ride was missing: a landmark right after the chocolate Swiss
// roll (the course was bare for ~80 m there) and festival framing on the
// approach to every fork (the road is deliberately free of random props before
// a decision, which read as "empty" rather than "important").
//
// Both are pure scenery: nothing intrudes into the car envelope — poles stand
// at |lateral| = 13 m with 12 m bunting above the road, and the fountain plaza
// keeps 20 m of clearance.
import * as THREE from 'three';
import { mergeByMaterial } from './merge.js';
import { UP, C, bake, join, tubeBetween, gumdropGeometry, cookieGeometry, plateGeometry } from './candykit.js';

const FLOOR = -3.3;

export function createLandmarks(scene, track, TEX = {}) {
  const group = new THREE.Group();
  group.name = 'landmarks';
  scene.add(group);
  // merged scenery (one mesh per material) and instanced sets live separately
  const meshes = new THREE.Group(); meshes.name = 'landmarkScenery'; group.add(meshes);
  // Kept out of the merge pass: the balloons bob and four lollipop wheels turn.
  const skyGroup = new THREE.Group(); skyGroup.name = 'skyParade'; group.add(skyGroup);

  const vcMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .6, metalness: .05 });
  const glossMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .3, metalness: .1, side: THREE.DoubleSide });
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  const flagMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .55, side: THREE.DoubleSide });
  const caneMat = new THREE.MeshStandardMaterial({ map: TEX.cane || null, color: TEX.cane ? '#ffffff' : '#ef8cb8', roughness: .5, side: THREE.DoubleSide });
  const add = (parent, geo, material = vcMat) => { const m = new THREE.Mesh(geo, material); parent.add(m); return m; };
  const world = (pose) => new THREE.Matrix4().makeRotationY(pose.heading).setPosition(pose.pos);
  const place = (geos, pose, material = vcMat, parent = meshes) => {
    const m = world(pose);
    for (const g of geos) { const c = g.clone(); c.applyMatrix4(m); add(parent, c, material); g.dispose(); }
  };
  const floorY = (s) => track.getBasePose(s).pos.y - 3.05;
  // Six pennant lines fill the whole 65 m run-up to a fork, so a driver always
  // has at least two of them in frame.
  const approachStations = (f) => [0, 1, 2, 3, 4, 5].map((k) => f.s0 - f.warning * (1 - k / 6.1));

  // ---------------------------------------------------------- chocolate plaza
  // A three-tier fountain with pouring chocolate, a tiled puddle, cocoa beans,
  // wafers and caramel lamps — standing in the meadow right after the chocolate
  // Swiss roll (the tunnel exits at fromBaseDistance(1065) and the second fork
  // starts only 45 m later, so the plaza sits beside that gap, not inside it).
  const TUNNEL_EXIT = track.fromBaseDistance(1065);
  const plazaS = TUNNEL_EXIT + 26;
  const plazaPose = track.getPose(plazaS, -22);
  const PLAZA_R = 11.5;
  // The meadow at |lateral| 22 sits ~3.1 m under the road, so the plaza is a
  // raised platform: a low wafer mound with a tiled top, then the fountain.
  const groundY = track.getPose(plazaS, 0).pos.y - 3.1;
  {
    const pieces = [], gloss = [], glow = [];
    const px = plazaPose.pos.x, pz = plazaPose.pos.z;
    const R = PLAZA_R;
    const top = groundY + 1.1; // tiled surface
    // platform: wafer crust + caramel creme top + a candied rim
    pieces.push(bake(new THREE.CylinderGeometry(R, R + 1.6, 1.6, 28), C('#e8cba0'), { pos: [px, groundY - .3, pz] }));
    pieces.push(bake(new THREE.CylinderGeometry(R - .5, R - .5, .34, 28), C('#8a5228'), { pos: [px, top, pz] }));
    pieces.push(bake(new THREE.CylinderGeometry(R - 3.1, R - 3.1, .3, 24), C('#6b3a1f'), { pos: [px, top + .03, pz] }));
    for (let k = 0; k < 22; k++) {
      const a = k * Math.PI * 2 / 22;
      pieces.push(bake(new THREE.SphereGeometry(.62, 8, 6), C(k % 2 ? '#f6e0c0' : '#c98b4b'), {
        scale: [1, .6, 1], pos: [px + Math.cos(a) * R, top + .25, pz + Math.sin(a) * R],
      }));
    }
    // ---- the fountain itself: three chocolate bowls on a wafer stem --------
    const y0 = top + .2;
    const tiers = [
      { r: 6.4, y: 0.0, h: 1.0 },   // bottom bowl
      { r: 4.4, y: 7.4, h: .95 },   // middle bowl
      { r: 2.8, y: 13.6, h: .85 },  // top bowl
    ];
    for (let i = 0; i < tiers.length; i++) {
      const T = tiers[i], y = y0 + T.y;
      // bowl: creme outside, dark chocolate inside, a glossy rim
      pieces.push(bake(new THREE.CylinderGeometry(T.r, T.r * .62, T.h, 24), C(i % 2 ? '#d9b087' : '#f0d6a8'), { pos: [px, y + T.h / 2, pz] }));
      pieces.push(bake(new THREE.CylinderGeometry(T.r - .55, T.r - .55, .28, 24), C('#4a2513'), { pos: [px, y + T.h - .1, pz] }));
      pieces.push(bake(new THREE.TorusGeometry(T.r, .3, 6, 24), C('#8a5228'), { rot: [Math.PI / 2, 0, 0], pos: [px, y + T.h + .12, pz] }));
      // scalloped rim: cocoa cream dots around the edge
      for (let k = 0; k < 16; k++) {
        const a = k * Math.PI / 8 + i * .2;
        pieces.push(bake(new THREE.SphereGeometry(.42, 7, 5), C(k % 2 ? '#f6e0c0' : '#c98b4b'), {
          scale: [1, .7, 1], pos: [px + Math.cos(a) * (T.r - .1), y + T.h + .18, pz + Math.sin(a) * (T.r - .1)],
        }));
      }
      // the chocolate curtain: it pours over the rim and hides the stem
      const next = tiers[i + 1];
      const lower = next ? y0 + next.y + next.h : y0 + 1.2;
      if (i < 2) {
        const curtainH = Math.max(1.2, y + T.h - lower + .4);
        gloss.push(bake(new THREE.CylinderGeometry(T.r - .45, T.r - .95, curtainH, 22, 1, true), C('#5a2f19'), {
          pos: [px, y + T.h - curtainH / 2 + .1, pz],
        }));
        // a few thick streams that reach the bowl below
        for (let k = 0; k < 4; k++) {
          const a = k * Math.PI / 2 + .4;
          pieces.push(bake(new THREE.CylinderGeometry(.42, .34, curtainH + 1.2, 7), C('#6b3a1f'), {
            pos: [px + Math.cos(a) * (T.r - 1.5), y + T.h - curtainH / 2, pz + Math.sin(a) * (T.r - 1.5)],
          }));
        }
      }
      // stem between the bowls
      if (next) {
        const stemH = next.y + T.h - (T.y + T.h);
        pieces.push(bake(new THREE.CylinderGeometry(1.45 - i * .3, 1.7 - i * .3, stemH, 12), C('#f0d6a8'), { pos: [px, y + T.h + stemH / 2, pz] }));
      }
    }
    // finial: a strawberry on a cocoa stick
    const topY = y0 + tiers[2].y + tiers[2].h;
    pieces.push(bake(new THREE.CylinderGeometry(.2, .2, 3.4, 7), C('#e9d3a6'), { pos: [px, topY + 1.7, pz] }));
    pieces.push(bake(new THREE.SphereGeometry(1.7, 13, 10), C('#ff5d78'), { scale: [1, 1.2, 1], pos: [px, topY + 4.2, pz] }));
    pieces.push(bake(new THREE.ConeGeometry(1.05, 1.4, 8), C('#7fd48f'), { pos: [px, topY + 5.8, pz] }));
    // cocoa beans heaped around the platform edge, half-buried
    for (let k = 0; k < 12; k++) {
      const a = k * 1.7, r = R + 1.6 + (k % 3) * 1.6;
      pieces.push(bake(new THREE.SphereGeometry(1.1 + (k % 3) * .28, 8, 6), C(k % 2 ? '#4a2513' : '#6b3a1f'), {
        scale: [1.25, .62, 1], rot: [0, a, .1], pos: [px + Math.cos(a) * r, groundY + .35, pz + Math.sin(a) * r],
      }));
    }
    // chunky wafer slabs leaning on the fountain
    for (let k = 0; k < 5; k++) {
      const a = k * 1.26 + 1.2, r = R - 3.4;
      const wx = px + Math.cos(a) * r, wz = pz + Math.sin(a) * r;
      const stick = bake(new THREE.BoxGeometry(1.6, 6.4, .5), C('#f0d6a8'), { pos: [0, 3.0, 0] });
      stick.rotateZ(.30); stick.rotateY(-a);
      stick.translate(wx, top + .1, wz);
      pieces.push(stick);
      pieces.push(bake(new THREE.BoxGeometry(1.9, 2.4, .34), C(k % 2 ? '#f3c46f' : '#c98b4b'), { rot: [0, -a, 0], pos: [wx, top + 3.3, wz] }));
    }
    // caramel lamps on the platform rim
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3 + .3, r = R - 1.7;
      const lx = px + Math.cos(a) * r, lz = pz + Math.sin(a) * r;
      pieces.push(bake(new THREE.CylinderGeometry(.34, .46, 3.6, 8), C('#c98b4b'), { pos: [lx, top + 2.0, lz] }));
      glow.push(bake(new THREE.SphereGeometry(.78, 11, 8), C('#ffcf7a'), { pos: [lx, top + 4.3, lz] }));
      glow.push(bake(new THREE.TorusGeometry(1.05, .17, 5, 16), C('#ffb457'), { rot: [Math.PI / 2, 0, 0], pos: [lx, top + 3.6, lz] }));
    }
    add(meshes, join(pieces), vcMat).name = 'chocPlaza';
    add(meshes, join(gloss), glossMat).name = 'chocPour';
    add(meshes, join(glow), glowMat).name = 'chocLamps';
    // a glowing picture sign beside the plaza: a cocoa cup with a marshmallow
    const sign = [];
    sign.push(bake(plateGeometry(4.2), '#f2e2c4', { pos: [0, 13.4, 0] }));
    sign.push(bake(new THREE.CylinderGeometry(2.4, 2.0, 3.2, 14), C('#5a3320'), { pos: [0, 12.4, .45] }));
    sign.push(bake(new THREE.TorusGeometry(1.4, .32, 5, 16), C('#d9b087'), { rot: [Math.PI / 2, 0, 0], pos: [0, 14.3, .45] }));
    sign.push(bake(new THREE.SphereGeometry(.55, 8, 6), C('#fff1d6'), { pos: [0, 11.2, .45] }));
    place(sign, track.getPose(plazaS, -15.5));
    // two chunky caramel lamp posts by the road, so the plaza reads from the line
    for (const ds of [-16, 14]) {
      const p = track.getPose(plazaS + ds, 12.4);
      place([bake(new THREE.CylinderGeometry(.7, .9, 9.4, 10), C('#c98b4b'), { pos: [0, 4.7, 0] })], p, vcMat);
      place([bake(new THREE.SphereGeometry(.95, 10, 7), C('#ffcf7a'), { pos: [0, 9.9, 0] })], p, glowMat);
    }
  }

  // ------------------------------------------------------ festival approaches
  // Bunting frames the start, every fork run-up and the finish straight: poles
  // stand 13.2 m off the centre-line, the lines fly at 11.2 m with 1.5 m
  // pennants. Environment only — no letters, no arrows.
  const clearPoints = [];
  function festiveRows(stations, tag, opts = {}) {
    const lat = opts.lat ?? 13.2;
    const H = opts.H ?? 11.4;
    const top = opts.top ?? 11.2;
    const flagCount = opts.flags ?? 11;
    const cols = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0'];
    const poles = [], lines = [], pennants = [];
    for (let k = 0; k < stations.length; k++) {
      const s = stations[k];
      const left = track.getBasePose(s, -lat), right = track.getBasePose(s, lat);
      const baseY = floorY(s) - .2;
      for (const p of [left, right]) {
        const post = bake(new THREE.CylinderGeometry(.44, .58, H, 8), '#ffffff', { pos: [0, H / 2, 0] });
        post.rotateY(p.heading);
        post.translate(p.pos.x, baseY, p.pos.z);
        poles.push(post);
        poles.push(bake(new THREE.SphereGeometry(.95, 10, 7), C(k % 2 ? '#ffd166' : '#ff8ad0'), { pos: [p.pos.x, baseY + H + .5, p.pos.z] }));
        poles.push(bake(new THREE.CylinderGeometry(1.5, 1.9, .9, 10), C('#f6e6cc'), { pos: [p.pos.x, baseY + .45, p.pos.z] }));
        clearPoints.push({ x: p.pos.x, z: p.pos.z, r: 9 });
      }
      const a2 = new THREE.Vector3(left.pos.x, baseY + top, left.pos.z);
      const b2 = new THREE.Vector3(right.pos.x, baseY + top, right.pos.z);
      for (let i = 0; i < flagCount; i++) {
        const t0 = i / flagCount, t1 = (i + 1) / flagCount;
        const P = (t) => a2.clone().lerp(b2, t).addScaledVector(UP, -Math.sin(t * Math.PI) * 1.45);
        const p0 = P(t0), p1 = P(t1);
        lines.push(tubeBetween(p0, p1, .14, '#fff3dc', 4));
        const mid = p0.clone().add(p1).multiplyScalar(.5).addScaledVector(UP, -1.45);
        const tri = new THREE.BufferGeometry();
        const cc = C(cols[i % cols.length]);
        const pos = [], col = [], uv = [];
        for (const v of [p0.clone().addScaledVector(UP, -.08), p1.clone().addScaledVector(UP, -.08), mid]) {
          pos.push(v.x, v.y, v.z); col.push(cc.r, cc.g, cc.b); uv.push(0, 0);
        }
        tri.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        tri.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        tri.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        tri.computeVertexNormals();
        pennants.push(tri);
      }
    }
    add(meshes, join(poles), caneMat).name = `festival-poles-${tag}`;
    add(meshes, join(lines), vcMat).name = `festival-lines-${tag}`;
    add(meshes, join(pennants), flagMat).name = `festival-flags-${tag}`;
  }
  for (const f of track.routes.forks) festiveRows(approachStations(f), f.id);
  festiveRows([24, 42, 60], 'start');
  const len = track.length;
  festiveRows([len - 84, len - 66, len - 48], 'finish');

  // ------------------------------------------------------------- sky parade
  // The two giant cakes (ascent stations 636–891, descent 977–1232) carry the
  // road up to 36 m over the meadow; from the spiral deck the sky is the only
  // thing beside cake wall, so it is filled with balloons and drifting
  // lollipops. Placement rule: never closer than 62 m to the far cake axis and
  // never less than 30 m from the line joining the two cakes — that is where
  // the 84 m bridge crosses.
  const AXES = [{ x: 11.8, z: 558.0 }, { x: -87.9, z: 573.9 }];
  const skySpots = (axisIdx, count, rBase) => {
    const A = AXES[axisIdx], B = AXES[1 - axisIdx];
    const dirAB = Math.atan2(B.x - A.x, B.z - A.z);
    const offs = [];
    for (let k = 1; k <= 9; k++) { offs.push(0.5 + 0.52 * k, -(0.5 + 0.52 * k)); }
    const out = [];
    for (const off of offs) {
      if (out.length >= count) break;
      const a = dirAB + off;
      const r = rBase + (out.length % 3) * 11;
      const x = A.x + Math.cos(a) * r, z = A.z + Math.sin(a) * r;
      if (Math.hypot(x - B.x, z - B.z) < 62) continue; // clear of the far cake
      out.push({ x, z, r, a });
    }
    return out;
  };
  {
    const pieces = [], glowSky = [];
    const hue = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#ffb457', '#9be36b'];
    let idx = 0;
    for (let ax = 0; ax < AXES.length; ax++) {
      const spots = skySpots(ax, 5, 78);
      for (let k = 0; k < spots.length; k++) {
        const { x: cx, z: cz } = spots[k];
        const cy = 21 + ((k * 7) % 5) * 8 + (k % 2) * 4;
        const col = hue[idx % hue.length]; idx++;
        // envelope: radial gores, so the stripes read from any angle
        const gores = 12, Rg = 7.6, Ry = 9.6;
        for (let g = 0; g < gores; g++) {
          const g0 = g / gores * Math.PI * 2, g1 = (g + 1) / gores * Math.PI * 2;
          pieces.push(bake(new THREE.SphereGeometry(Rg, 3, 10, g0, g1 - g0, 0, Math.PI * .78), C(g % 2 ? col : '#fff6ea'), {
            scale: [1, Ry / Rg, 1], pos: [cx, cy + 9.6, cz],
          }));
        }
        // a dark disc closes the envelope: without it you look straight
        // through the balloon into the sky
        pieces.push(bake(new THREE.CircleGeometry(Rg * .97, 12), C('#8a5a30'), {
          rot: [-Math.PI / 2, 0, 0], pos: [cx, cy + 9.6 - Ry * Math.cos(Math.PI * .78), cz],
        }));
        // basket, ropes and a gumball finial
        pieces.push(bake(new THREE.CylinderGeometry(2.1, 2.4, 2.6, 10), C('#c98b4b'), { pos: [cx, cy + .6, cz] }));
        pieces.push(bake(new THREE.TorusGeometry(2.5, .22, 5, 12), C('#f6e0c0'), { rot: [Math.PI / 2, 0, 0], pos: [cx, cy + 1.9, cz] }));
        for (let q = 0; q < 4; q++) {
          const qa = q * Math.PI / 2 + .4;
          pieces.push(bake(new THREE.CylinderGeometry(.14, .14, 4.6, 5), C('#f6e0c0'), { pos: [cx + Math.cos(qa) * 2.2, cy + 3.6, cz + Math.sin(qa) * 2.2] }));
        }
        pieces.push(bake(new THREE.SphereGeometry(1.5, 10, 7), C('#fff6ea'), { pos: [cx, cy + 20.4, cz] }));
        glowSky.push(bake(new THREE.SphereGeometry(.85, 9, 6), C(col), { pos: [cx, cy - .2, cz] }));
      }
    }
    add(skyGroup, join(pieces), vcMat).name = 'skyBalloons';
    add(skyGroup, join(glowSky), glowMat).name = 'skyBalloonLamps';
  }
  // Four giant lollipops drifting outside the cake drums: each is one mesh, a
  // wheel aimed at the cake that turns about its own axis.
  const spinners = [];
  {
    const cols = ['#ff6b81', '#56c8ff', '#ffd166', '#c86bff'];
    let i = 0;
    for (let ax = 0; ax < AXES.length; ax++) {
      const spots = skySpots(ax, 2, 68);
      for (let k = 0; k < spots.length; k++) {
        const { x: cx, z: cz } = spots[k];
        const cy = 26 + k * 8;
        const parts = [];
        for (let ring = 5; ring >= 1; ring--) {
          parts.push(bake(new THREE.TorusGeometry(ring * 1.9, .95, 5, 22), C(ring % 2 ? cols[i % cols.length] : '#fff6ea')));
        }
        parts.push(bake(new THREE.CylinderGeometry(.75, .75, 17, 9), C('#f6e0c0'), { pos: [0, -16, 0] }));
        const wheel = new THREE.Mesh(join(parts), vcMat);
        wheel.name = `skySpinner${i}`;
        wheel.position.set(cx, cy, cz);
        wheel.rotation.y = Math.atan2(AXES[ax].x - cx, AXES[ax].z - cz); // face the cake
        wheel.userData.spin = (i % 2 ? 1 : -1) * .1;
        group.add(wheel);
        spinners.push(wheel);
        i++;
      }
    }
  }

  // ---------------------------------------------------------- candy billboards
  // Two giant cookie-and-cocoa towers that break the skyline after the tunnel
  // and in the cocoa canyon, so no stretch of road is truly featureless.
  const TOWERS = [{ s: 745, lat: 26 }, { s: 1152, lat: -28 }];
  {
    const towers = [];
    for (const sp of TOWERS) {
      const s = sp.s;
      const p = track.getPose(s, sp.lat);
      const b = floorY(s);
      const H = 17;
      towers.push(bake(new THREE.CylinderGeometry(3.6, 4.6, H, 12), C('#5a3320'), { pos: [p.pos.x, b + H / 2, p.pos.z] }));
      towers.push(bake(new THREE.CylinderGeometry(4.2, 4.2, 1, 12), C('#d9b087'), { pos: [p.pos.x, b + H, p.pos.z] }));
      // a leaning cookie stack on top
      for (let i = 0; i < 3; i++) {
        towers.push(bake(cookieGeometry(3.4 - i * .5, 1.5, 6), C(i % 2 ? '#c4854a' : '#a86a32'), {
          rot: [0, i * .7, 0], pos: [p.pos.x + Math.cos(i) * .6, b + H + 1.6 + i * 2.1, p.pos.z + Math.sin(i) * .6],
        }));
      }
      towers.push(bake(new THREE.SphereGeometry(1.2, 10, 7), C('#ff5d78'), { pos: [p.pos.x, b + H + 8.4, p.pos.z] }));
    }
    add(meshes, join(towers), vcMat).name = 'cocoaTowers';
  }

  mergeByMaterial(meshes, { castShadow: true, receiveShadow: true, noCollide: false });
  // Keep-out for the world's random props: the plaza, the towers and every
  // pennant pole. The driving corridor itself is never blocked by this.
  const clears = clearPoints.slice();
  clears.push({ x: plazaPose.pos.x, z: plazaPose.pos.z, r: 30 });
  for (const sp of TOWERS) {
    const p = track.getPose(sp.s, sp.lat);
    clears.push({ x: p.pos.x, z: p.pos.z, r: 16 });
  }
  let t = 0;
  function update(dt) {
    t += dt;
    const bob = Math.sin(t * .5) * .55;
    skyGroup.position.y = bob;
    for (const w of spinners) {
      w.rotation.z += w.userData.spin * dt;
      w.position.y += Math.sin(t * .43 + w.position.x * .01) * .02 * dt;
    }
  }
  function blocks(x, z) { return clears.some((c) => (c.x - x) ** 2 + (c.z - z) ** 2 < c.r * c.r); }
  return { group, update, blocks, clears: clears.length };
}
