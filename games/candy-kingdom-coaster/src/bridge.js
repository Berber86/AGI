// Milk river, milk sea and the arched wafer bridge that carries the road over
// the river (cookie zone). The road itself already humps over the crossing
// (track.js adds BRIDGE.hump to the spline) and the shoulders are dipped into
// a valley there; this module adds everything else:
//   • spandrel walls + arch barrel under the deck (wafer-brick texture)
//   • abutments at both ends, candy-cane balustrade with a cream rail that
//     follows the hump, lollipop pillars
//   • the river ribbon (soft banks, slow flow animation) from the hills on the
//     right, under the bridge and away to the milk sea on the left
//   • floating cookies in the river, donut floats in the sea
// blocks(x, z) tells world.js where NOT to put props (river, sea, valley).
import * as THREE from 'three';
import { BRIDGE } from './config.js';

const UP = new THREE.Vector3(0, 1, 0);

function milkTexture(kind) {
  // kind 'ribbon': repeats along x, soft alpha banks across y
  // kind 'sea': non-repeating disc with a soft rim
  const W = kind === 'sea' ? 512 : 256, H = kind === 'sea' ? 512 : 128;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fffdf9';
  g.fillRect(0, 0, W, H);
  // creamy swirls
  const rnd = (() => { let t = kind === 'sea' ? 311 : 97; return () => (t = (t * 16807) % 2147483647) / 2147483647; })();
  const tints = kind === 'sea' ? ['#ffffff', '#f3ebe2', '#fbf4ec', '#ece2d6'] : ['#ffffff', '#f7f1ea', '#fff6ee', '#f1e9e0'];
  for (let i = 0; i < (kind === 'sea' ? 140 : 36); i++) {
    g.save();
    g.translate(rnd() * W, rnd() * H);
    g.rotate(rnd() * Math.PI);
    g.scale(1, 0.25 + rnd() * 0.35);
    g.globalAlpha = (kind === 'sea' ? 0.4 : 0.28) + rnd() * 0.3;
    g.fillStyle = tints[i % tints.length];
    g.beginPath();
    g.arc(0, 0, 10 + rnd() * (kind === 'sea' ? 46 : 26), 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  // faint ripples (sea) / flow streaks (ribbon)
  g.globalAlpha = 0.16;
  g.strokeStyle = '#ffffff';
  g.lineWidth = 2;
  if (kind === 'sea') {
    for (let r = 40; r < 250; r += 34) { g.beginPath(); g.arc(W / 2, H / 2, r, 0, Math.PI * 2); g.stroke(); }
  } else {
    for (let i = 0; i < 14; i++) {
      const y = 12 + rnd() * (H - 24);
      g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(W * 0.3, y + 8, W * 0.6, y - 8, W, y); g.stroke();
    }
  }
  g.globalAlpha = 1;
  // cocoa-crumb shoreline just inside the soft edge
  if (kind === 'sea') {
    const rim = g.createRadialGradient(W / 2, H / 2, W * 0.40, W / 2, H / 2, W / 2);
    rim.addColorStop(0, 'rgba(185,138,94,0)');
    rim.addColorStop(0.78, 'rgba(185,138,94,0)');
    rim.addColorStop(0.9, 'rgba(185,138,94,0.55)');
    rim.addColorStop(1, 'rgba(185,138,94,0.7)');
    g.fillStyle = rim;
  } else {
    const rim = g.createLinearGradient(0, 0, 0, H);
    rim.addColorStop(0, 'rgba(185,138,94,0.7)');
    rim.addColorStop(0.12, 'rgba(185,138,94,0.55)');
    rim.addColorStop(0.22, 'rgba(185,138,94,0)');
    rim.addColorStop(0.78, 'rgba(185,138,94,0)');
    rim.addColorStop(0.88, 'rgba(185,138,94,0.55)');
    rim.addColorStop(1, 'rgba(185,138,94,0.7)');
    g.fillStyle = rim;
  }
  g.fillRect(0, 0, W, H);
  // alpha mask: soft banks / soft rim
  g.globalCompositeOperation = 'destination-in';
  if (kind === 'sea') {
    const grd = g.createRadialGradient(W / 2, H / 2, W * 0.36, W / 2, H / 2, W / 2);
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.82, 'rgba(0,0,0,1)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
  } else {
    const grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(0.16, 'rgba(0,0,0,1)');
    grd.addColorStop(0.84, 'rgba(0,0,0,1)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
  }
  g.fillRect(0, 0, W, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (kind !== 'sea') { t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; }
  return t;
}

export function createBridge(scene, track, TEX = {}) {
  const B = BRIDGE;
  const group = new THREE.Group();
  group.name = 'bridge';
  scene.add(group);

  const mid = track.getPose(B.s, 0);
  const T = mid.tangent.clone(); T.y = 0; T.normalize();
  const R = new THREE.Vector3().crossVectors(T, UP).normalize(); // car's right
  const P = mid.pos.clone(); P.y = B.floorY;
  const rp = (dr, dt) => P.clone().addScaledVector(R, dr).addScaledVector(T, dt);

  // ---- materials -----------------------------------------------------------
  const wafer = new THREE.MeshStandardMaterial({ map: TEX.wall || null, color: TEX.wall ? '#ffffff' : '#d9a86c', roughness: 0.78, side: THREE.DoubleSide });
  const choco = new THREE.MeshStandardMaterial({ color: '#6b3a1e', roughness: 0.7, side: THREE.DoubleSide });
  const cream = new THREE.MeshStandardMaterial({ color: '#fff6ee', roughness: 0.45 });
  const cane = new THREE.MeshStandardMaterial({ map: TEX.cane || null, color: TEX.cane ? '#ffffff' : '#ff4b6e', roughness: 0.42 });
  const pink = new THREE.MeshStandardMaterial({ color: '#ff6fae', roughness: 0.35 });
  const blue = new THREE.MeshStandardMaterial({ color: '#56c8ff', roughness: 0.35 });
  const lolli = new THREE.MeshStandardMaterial({ map: TEX.lolliPink || null, color: TEX.lolliPink ? '#ffffff' : '#ff5fa2', roughness: 0.36 });
  const milkRibbonTex = milkTexture('ribbon');
  const milkSeaTex = milkTexture('sea');
  const milk = new THREE.MeshStandardMaterial({ map: milkRibbonTex, transparent: true, roughness: 0.3, metalness: 0.0, emissive: '#ffffff', emissiveIntensity: 0.22, depthWrite: false, side: THREE.DoubleSide });
  const milkSea = new THREE.MeshStandardMaterial({ map: milkSeaTex, transparent: true, roughness: 0.28, metalness: 0.0, emissive: '#ffffff', emissiveIntensity: 0.22, depthWrite: false, side: THREE.DoubleSide });

  // ---- arch: spandrel walls + barrel, built along the road ------------------
  const A = B.archHalf;
  const archRise = (mid.pos.y - 1.4) - (B.floorY - 0.6); // mid.pos.y already includes the hump
  const archY = (d) => (Math.abs(d) >= A ? B.floorY - 0.6 : (B.floorY - 0.6) + archRise * Math.sqrt(1 - (d / A) * (d / A)));
  {
    const pos = [], uv = [], idx = [];
    const STEP = 1.0;
    const n = Math.round((A + 1) * 2 / STEP);
    for (let i = 0; i <= n; i++) {
      const d = -A - 1 + i * STEP;
      const s = B.s + d;
      const pl = track.getPose(s, -B.wallLat), pr = track.getPose(s, B.wallLat);
      const bottom = Math.max(B.floorY - 0.6, archY(d));
      const topL = pl.pos.y - 0.1, topR = pr.pos.y - 0.1;
      // ∩ cross-section: left wall top → left wall bottom → right wall bottom → right wall top
      pos.push(pl.pos.x, topL, pl.pos.z, pl.pos.x, bottom, pl.pos.z, pr.pos.x, bottom, pr.pos.z, pr.pos.x, topR, pr.pos.z);
      const us = s / 12;
      uv.push(us, topL / 6, us, bottom / 6, us, bottom / 6, us, topR / 6);
      if (i > 0) {
        const a = (i - 1) * 4, b = i * 4;
        for (let k = 0; k < 3; k++) idx.push(a + k, b + k, a + k + 1, a + k + 1, b + k, b + k + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    // walls get the wafer bricks, the barrel underneath is dark chocolate
    geo.clearGroups();
    const triPerSeg = 6;
    for (let i = 0; i < n; i++) {
      geo.addGroup(i * triPerSeg * 3, 6, 0);      // left wall
      geo.addGroup(i * triPerSeg * 3 + 6, 6, 1);  // barrel
      geo.addGroup(i * triPerSeg * 3 + 12, 6, 0); // right wall
    }
    const arch = new THREE.Mesh(geo, [wafer, choco]);
    arch.name = 'bridgeArch';
    arch.castShadow = true; arch.receiveShadow = true;
    group.add(arch);
  }

  // ---- abutments: wafer blocks where the arch meets the banks ---------------
  for (const side of [-1, 1]) {
    const d = side * (A + 3.2);
    const p = track.getPose(B.s + d, 0);
    const h = (p.pos.y - 0.08) - (B.floorY - 0.6);
    const box = new THREE.Mesh(new THREE.BoxGeometry(B.wallLat * 2 + 1.4, h, 7.4), wafer);
    box.position.copy(p.pos); box.position.y = (B.floorY - 0.6) + h / 2;
    box.rotation.set(0, p.heading, 0);
    box.name = 'bridgeAbutment';
    box.castShadow = true; box.receiveShadow = true;
    group.add(box);
  }

  // ---- balustrade: cane posts + cream rail following the hump ---------------
  {
    const postGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.0, 8);
    const ballGeo = new THREE.SphereGeometry(0.2, 10, 8);
    const railR = 0.09;
    for (const side of [-1, 1]) {
      const railPts = [];
      let k = 0;
      for (let d = -B.halfSpan - 1; d <= B.halfSpan + 1.01; d += 3) {
        const p = track.getPose(B.s + d, side * 5.9);
        const post = new THREE.Mesh(postGeo, cane);
        post.position.copy(p.pos); post.position.y += 0.45;
        post.castShadow = true;
        group.add(post);
        const ball = new THREE.Mesh(ballGeo, k % 2 ? blue : pink);
        ball.position.copy(p.pos); ball.position.y += 1.05;
        group.add(ball);
        railPts.push(p.pos.clone().add(new THREE.Vector3(0, 0.95, 0)));
        k++;
      }
      const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts), 48, railR, 6, false), cream);
      rail.castShadow = true;
      group.add(rail);
      const rail2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts.map((v) => v.clone().setY(v.y - 0.45))), 48, railR * 0.8, 6, false), cream);
      group.add(rail2);
      // lollipop pillars at both ends
      for (const end of [-1, 1]) {
        const p = track.getPose(B.s + end * (B.halfSpan + 2.6), side * 6.3);
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.9, 0.8), wafer);
        pillar.position.copy(p.pos); pillar.position.y += 0.85;
        pillar.rotation.set(0, p.heading, 0);
        pillar.castShadow = true;
        group.add(pillar);
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 12), lolli);
        top.position.copy(p.pos); top.position.y += 2.3;
        top.scale.set(1, 1, 0.45);
        top.rotation.set(0, p.heading, 0);
        group.add(top);
      }
    }
  }

  // ---- the river: from the hills on the right, under the arch, to the sea ----
  // the last point sits ~10 m inside the sea's shoreline so the banks run into the shore
  const riverPts = [
    rp(230, 60), rp(170, -20), rp(110, 25), rp(55, -6), rp(24, 0), rp(0, 0), rp(-24, 0),
    rp(-60, 8), rp(-105, -20), rp(-130, 12), rp(-143, 30),
  ];
  const riverCurve = new THREE.CatmullRomCurve3(riverPts, false, 'centripetal', 0.5);
  const riverLen = riverCurve.getLength();
  const RIVER_N = 180;
  const riverSamples = [];
  const smooth01 = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const halfW = (t) => 6.5 + 4.5 * t + 11 * smooth01(0.84, 1, t); // widens toward the sea, opens into an estuary
  {
    const across = [-1, -0.72, -0.4, 0, 0.4, 0.72, 1];
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= RIVER_N; i++) {
      const t = i / RIVER_N;
      const c = riverCurve.getPointAt(t);
      const tg = riverCurve.getTangentAt(t); tg.y = 0; tg.normalize();
      const rt = new THREE.Vector3().crossVectors(tg, UP).normalize();
      const w = halfW(t);
      riverSamples.push({ x: c.x, z: c.z, w });
      across.forEach((a, j) => {
        pos.push(c.x + rt.x * a * w, B.floorY + 0.1 + (1 - Math.abs(a)) * 0.02, c.z + rt.z * a * w);
        uv.push((t * riverLen) / 22, (a + 1) / 2);
        if (i > 0 && j > 0) {
          // CCW seen from above (normal = up): previous row → this row, across +right
          const b = i * across.length + j, p0 = b - across.length;
          idx.push(p0 - 1, p0, b - 1, b - 1, p0, b);
        }
      });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const river = new THREE.Mesh(geo, milk);
    river.name = 'milkRiver';
    river.receiveShadow = true;
    river.renderOrder = 1;
    group.add(river);
  }

  // ---- the spring: a giant milk jug pours the river out at its source --------
  {
    const src = riverPts[0];
    const flow = riverPts[1].clone().sub(src); flow.y = 0; flow.normalize(); // where the milk runs
    const porcelain = new THREE.MeshStandardMaterial({ color: '#fbf7f2', roughness: 0.35 });
    const blue = new THREE.MeshStandardMaterial({ color: '#7fb4ff', roughness: 0.45 });
    const jug = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.4, 11, 20), porcelain);
    body.position.y = 5.5;
    const band = new THREE.Mesh(new THREE.CylinderGeometry(4.95, 4.95, 1.6, 20), blue);
    band.position.y = 3.2;
    const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 4.6, 2.2, 20), porcelain);
    shoulder.position.y = 12.1;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.6, 3.4, 20), porcelain);
    neck.position.y = 14.9;
    const lip = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.45, 10, 24), blue);
    lip.position.y = 16.6; lip.rotation.x = Math.PI / 2;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.7, 10, 24, Math.PI), porcelain);
    handle.position.set(0, 8.6, -5.0);
    // half ring in the ZY plane bulging backwards (-z): arc XY(+y) → ZY(+y) → ZY(-z)
    handle.quaternion.multiplyQuaternions(
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2));
    jug.add(body, band, shoulder, neck, lip, handle);
    jug.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    // lean the jug forward over the river so the neck points down-stream
    const yaw = Math.atan2(flow.x, flow.z);
    jug.rotation.order = 'YXZ';
    jug.rotation.set(0.95, yaw, 0);
    jug.position.set(src.x - flow.x * 6, B.floorY + 1.6, src.z - flow.z * 6);
    group.add(jug);
    // the pour: a thick milk stream from the lip down into the pool
    const pour = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.2, 10, 12), milk.clone());
    pour.material.transparent = false; pour.material.map = null; pour.material.color.set('#fffdf9');
    pour.position.set(src.x + flow.x * 7.5, B.floorY + 5.2, src.z + flow.z * 7.5);
    pour.rotation.order = 'YXZ'; pour.rotation.set(0.28, yaw, 0);
    group.add(pour);
    // the spring pool
    const pool = new THREE.Mesh(new THREE.CircleGeometry(16, 40), milkSea);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(src.x + flow.x * 8, B.floorY + 0.08, src.z + flow.z * 8);
    pool.name = 'milkSpring';
    pool.renderOrder = 1;
    group.add(pool);
  }

  // ---- the milk sea the river runs into (ahead-left of the bridge) ----------
  const SEA_R = 150;
  const seaCenter = rp(-250, 120);
  {
    const sea = new THREE.Mesh(new THREE.CircleGeometry(SEA_R, 72), milkSea);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(seaCenter.x, B.floorY + 0.06, seaCenter.z);
    sea.name = 'milkSea';
    sea.receiveShadow = true;
    group.add(sea);
  }

  // ---- floating treats: cookies drift down the river, donuts bob in the sea --
  const floaters = [];
  {
    const cookieMat = new THREE.MeshStandardMaterial({ map: TEX.cookie || null, color: TEX.cookie ? '#ffffff' : '#d9a86c', roughness: 0.75 });
    const cookieGeo = new THREE.CylinderGeometry(1.3, 1.2, 0.45, 16);
    [0.3, 0.42, 0.55, 0.68, 0.84].forEach((t0, i) => {
      const m = new THREE.Mesh(cookieGeo, cookieMat);
      m.castShadow = true;
      group.add(m);
      floaters.push({ mesh: m, t: t0, speed: 0.012 + (i % 2) * 0.004, off: (i % 3 - 1) * 0.35, phase: i * 1.3, river: true });
    });
    const donutGeo = new THREE.TorusGeometry(5.2, 2.0, 10, 24);
    [[TEX.donutPink, '#ff8ad0', 0.3], [TEX.donutLilac, '#b18aff', 1.9], [TEX.donutPink, '#ff8ad0', 3.6]].forEach(([tex, col, ang], i) => {
      const mat = new THREE.MeshStandardMaterial({ map: tex || null, color: tex ? '#ffffff' : col, roughness: 0.5 });
      const m = new THREE.Mesh(donutGeo, mat);
      const r = SEA_R * (0.45 + i * 0.17);
      m.position.set(seaCenter.x + Math.cos(ang) * r, B.floorY + 0.9, seaCenter.z + Math.sin(ang) * r);
      m.rotation.set(-Math.PI / 2 + 0.12, 0, ang);
      m.castShadow = true;
      group.add(m);
      floaters.push({ mesh: m, phase: i * 2.1, baseY: m.position.y, river: false });
    });
  }

  // ---- queries ---------------------------------------------------------------
  const blocks = (x, z) => {
    // river band
    for (const q of riverSamples) {
      const dx = q.x - x, dz = q.z - z;
      if (dx * dx + dz * dz < (q.w + 3) * (q.w + 3)) return true;
    }
    // sea
    if (Math.hypot(seaCenter.x - x, seaCenter.z - z) < SEA_R + 5) return true;
    // valley cut around the crossing
    const vx = x - P.x, vz = z - P.z;
    const d = vx * T.x + vz * T.z, lat = vx * R.x + vz * R.z;
    return Math.abs(d) < B.valleyHalf + 4 && Math.abs(lat) < 26;
  };

  function update(dt, time) {
    milkRibbonTex.offset.x -= dt * 0.045; // flows toward the sea
    for (const f of floaters) {
      if (f.river) {
        f.t += dt * f.speed;
        if (f.t > 0.97) f.t = 0.1;
        const c = riverCurve.getPointAt(f.t);
        const tg = riverCurve.getTangentAt(f.t); tg.y = 0; tg.normalize();
        const rt = new THREE.Vector3().crossVectors(tg, UP);
        f.mesh.position.set(c.x + rt.x * f.off * halfW(f.t), B.floorY + 0.25 + Math.sin(time * 1.6 + f.phase) * 0.06, c.z + rt.z * f.off * halfW(f.t));
        f.mesh.rotation.set(Math.sin(time * 1.1 + f.phase) * 0.05, time * 0.15 + f.phase, Math.cos(time * 0.9 + f.phase) * 0.05);
      } else {
        f.mesh.position.y = f.baseY + Math.sin(time * 0.8 + f.phase) * 0.18;
      }
    }
  }

  return {
    group, update, blocks,
    crossing: { s: B.s, x: P.x, z: P.z },
    sea: { x: seaCenter.x, z: seaCenter.z, r: SEA_R },
    riverLength: riverLen,
    archApexY: archY(0),
  };
}
