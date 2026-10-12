// Spline track: road mesh, curbs, terrain shoulders, start/finish, pose queries.
import * as THREE from 'three';
import { TUNING, zoneAt } from './config.js';

const UP = new THREE.Vector3(0, 1, 0);

function buildWaypoints() {
  // A snaking coaster course with alternating LEFT and RIGHT sweeps plus
  // gentle hills — every bend stays readable from the chase camera.
  const pts = [];
  const STEPS = 230;
  const ds = 6.4; // ~1470 m total
  let x = 0, z = 0, y = 2.4;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const heading =
      0.62 * Math.sin(2 * Math.PI * 1.9 * t + 0.42) +
      0.34 * Math.sin(2 * Math.PI * 3.25 * t + 1.15) +
      0.1 * Math.sin(2 * Math.PI * 5.6 * t);
    y = 2.4 + 3.3 * Math.sin(2 * Math.PI * 1.55 * t + 0.2) + 0.95 * Math.sin(2 * Math.PI * 3.9 * t + 0.9);
    pts.push(new THREE.Vector3(x, y, z));
    x += Math.sin(heading) * ds;
    z += Math.cos(heading) * ds;
  }
  return pts;
}

function roadTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  // Real UV mapping: x = ALONG track (1 tile = 12 m), y = ACROSS ribbon
  // (road band = y 226..285 between the road vertices at k=4..5 of 0..9).
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 256, 512); // neutral outside road -> grass/curb keep vertex colors
  // strawberry road band
  g.fillStyle = '#efa3c4';
  g.fillRect(0, 226, 256, 59);
  // candy sprinkles inside the road band (tile every 12 m along the track)
  const conf = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#fff3b0'];
  for (let i = 0; i < 72; i++) {
    const x = Math.random() * 256, y = 239 + Math.random() * 34;
    const a = (Math.random() - 0.5) * 0.7;
    g.save();
    g.translate(x, y);
    g.rotate(a);
    g.fillStyle = conf[i % conf.length];
    g.globalAlpha = 0.78;
    g.beginPath();
    g.roundRect(-2.4, -0.9, 4.8, 1.8, 0.9);
    g.fill();
    g.restore();
  }
  g.globalAlpha = 1;
  // soft depth shading just inside both road edges (runs ALONG the road)
  const shadeY = (y0, y1) => {
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, 'rgba(150,50,95,0.28)');
    gr.addColorStop(1, 'rgba(150,50,95,0)');
    g.fillStyle = gr;
    g.fillRect(0, Math.min(y0, y1), 256, Math.abs(y1 - y0));
  };
  shadeY(226, 248);
  shadeY(285, 263);
  // thick cream border lines along both road edges
  g.fillStyle = '#fff6ec';
  g.fillRect(0, 226, 256, 9);
  g.fillRect(0, 276, 256, 9);
  // golden candy dash down the middle (once per 12 m tile)
  g.fillStyle = '#ffe082';
  g.beginPath();
  g.roundRect(28, 251, 62, 11, 5);
  g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function checkerTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const n = 8, s = 128 / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    g.fillStyle = (x + y) % 2 ? '#6b3f2a' : '#fff6ec'; // chocolate & cream
    g.fillRect(x * s, y * s, s, s);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createTrack(scene) {
  const curve = new THREE.CatmullRomCurve3(buildWaypoints(), false, 'centripetal', 0.5);
  const length = curve.getLength();
  const halfW = TUNING.roadHalfWidth;

  const SAMPLES = Math.max(240, Math.round(length / 2.8));
  const centers = [], tangents = [], rights = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const u = i / SAMPLES;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u).normalize();
    const r = new THREE.Vector3().crossVectors(t, UP).normalize();
    centers.push(p); tangents.push(t); rights.push(r);
  }

  // ---- Road ribbon + curbs + shoulders in one vertex-colored mesh ----
  // Across-profile offsets (meters) and heights relative to road plane.
  // The curb is a 6-band RAINBOW ribbon hugging both road edges (reference
  // look): vivid longitudinal stripes from the road edge outward —
  // red → orange → yellow → green → blue → violet.
  const RAINBOW = ['#ff4d6d', '#ff9f43', '#ffd93d', '#6bd96b', '#56c8ff', '#a06bff'].map((h) => new THREE.Color(h));
  const profile = [
    { off: -22.0, dy: -3.1, kind: 'grass' },
    { off: -13.0, dy: -1.35, kind: 'grass' },
    { off: -7.6, dy: -0.32, kind: 'grass' },
    { off: -6.62, dy: -0.075, kind: 'curb', band: 5 },
    { off: -6.29, dy: -0.06, kind: 'curb', band: 4 },
    { off: -5.96, dy: -0.045, kind: 'curb', band: 3 },
    { off: -5.63, dy: -0.03, kind: 'curb', band: 2 },
    { off: -5.30, dy: -0.015, kind: 'curb', band: 1 },
    { off: -4.42, dy: 0.0, kind: 'road' },
    { off: 4.42, dy: 0.0, kind: 'road' },
    { off: 5.30, dy: -0.015, kind: 'curb', band: 1 },
    { off: 5.63, dy: -0.03, kind: 'curb', band: 2 },
    { off: 5.96, dy: -0.045, kind: 'curb', band: 3 },
    { off: 6.29, dy: -0.06, kind: 'curb', band: 4 },
    { off: 6.62, dy: -0.075, kind: 'curb', band: 5 },
    { off: 7.6, dy: -0.32, kind: 'grass' },
    { off: 13.0, dy: -1.35, kind: 'grass' },
    { off: 22.0, dy: -3.1, kind: 'grass' },
  ];
  const K = profile.length;
  const posArr = [], colArr = [], uvArr = [], idxArr = [];
  const grassEdge = new THREE.Color('#b8e6a0');

  for (let i = 0; i <= SAMPLES; i++) {
    const u = i / SAMPLES;
    const zc = zoneAt(u);
    const base = centers[i], right = rights[i], tan = tangents[i];
    for (let k = 0; k < K; k++) {
      const pr = profile[k];
      posArr.push(
        base.x + right.x * pr.off + tan.x * 0,
        base.y + pr.dy + (pr.kind === 'road' ? 0.02 : 0),
        base.z + right.z * pr.off
      );
      let col;
      if (pr.kind === 'curb') col = RAINBOW[pr.band].clone();
      else if (pr.kind === 'road') col = new THREE.Color('#ffffff');
      else {
        // candy grass with zone tint, fading to a soft universal green-pink at distance
        col = new THREE.Color(zc.fog).lerp(new THREE.Color('#8fe096'), 0.74); // fresh mint field — pink road pops against it
        const away = (Math.abs(pr.off) - 7.6) / 14.4;
        col.lerp(grassEdge, away * 0.35);
      }
      colArr.push(col.r, col.g, col.b);
      uvArr.push(u * (length / 12), (k / (K - 1)));
    }
  }
  for (let i = 0; i < SAMPLES; i++) {
    for (let k = 0; k < K - 1; k++) {
      const a = i * K + k, b = a + K;
      idxArr.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
  roadGeo.setAttribute('color', new THREE.Float32BufferAttribute(colArr, 3));
  roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2));
  roadGeo.setIndex(idxArr);
  roadGeo.computeVertexNormals();

  const roadTex = roadTexture();
  roadTex.repeat.set(1, 1);
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTex, vertexColors: true, roughness: 0.72, metalness: 0.06,
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.receiveShadow = true;
  road.name = 'road';
  scene.add(road);

  // ---- Start & finish checker strips ----
  const stripGeo = new THREE.PlaneGeometry(halfW * 2.15, 3.4);
  const stripMat = new THREE.MeshStandardMaterial({ map: checkerTexture(), roughness: 0.6 });
  const mkStrip = (u, rotOffset = 0) => {
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const m = new THREE.Mesh(stripGeo, stripMat);
    m.position.copy(p).addScaledVector(UP, 0.045);
    m.lookAt(p.clone().add(UP));
    m.rotateX(-Math.PI / 2);
    m.rotateY(Math.atan2(t.x, t.z) + rotOffset + Math.PI / 2);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  mkStrip(0.0025);
  mkStrip(0.9975);

  // ---- Finish arch (faces the oncoming car so the text reads correctly) ----
  const arch = new THREE.Group();
  const poleGeo = new THREE.CylinderGeometry(0.35, 0.42, 6.4, 12);
  const poleMat = new THREE.MeshStandardMaterial({ color: '#ff5f9e', roughness: 0.35, metalness: 0.15, emissive: '#7a1640', emissiveIntensity: 0.25 });
  const bannerC = document.createElement('canvas');
  bannerC.width = 512; bannerC.height = 128;
  const bg = bannerC.getContext('2d');
  bg.fillStyle = '#fff0f6'; bg.fillRect(0, 0, 512, 128);
  bg.fillStyle = '#ff4f96'; bg.font = 'bold 84px sans-serif'; bg.textAlign = 'center'; bg.textBaseline = 'middle';
  bg.fillText('FINISH', 256, 68);
  for (let i = 0; i < 12; i++) { bg.fillStyle = i % 2 ? '#ff4f96' : '#ffd166'; bg.fillRect(i * 43, 0, 43, 14); bg.fillRect(i * 43, 114, 43, 14); }
  const bannerTex = new THREE.CanvasTexture(bannerC);
  bannerTex.colorSpace = THREE.SRGBColorSpace;
  const poleL = new THREE.Mesh(poleGeo, poleMat); poleL.position.set(-halfW - 1.1, 3.2, 0);
  const poleR = poleL.clone(); poleR.position.x = halfW + 1.1;
  const banner = new THREE.Mesh(new THREE.PlaneGeometry((halfW + 1.1) * 2, 1.8), new THREE.MeshStandardMaterial({ map: bannerTex, side: THREE.DoubleSide, roughness: 0.5 }));
  banner.position.set(0, 6.1, 0);
  arch.add(poleL, poleR, banner);
  const fu = 0.9975;
  const fp = curve.getPointAt(fu), ft = curve.getTangentAt(fu);
  arch.position.copy(fp);
  arch.rotation.y = Math.atan2(ft.x, ft.z) + Math.PI; // face the driver (was mirrored)
  arch.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; }); // overhead: car passes under
  scene.add(arch);

  // ---- Start gate (small candy arch) ----
  const startArch = arch.clone();
  startArch.position.copy(curve.getPointAt(0.0025));
  startArch.rotation.y = Math.atan2(curve.getTangentAt(0.0025).x, curve.getTangentAt(0.0025).z) + Math.PI; // face the driver
  const b2 = startArch.children[2];
  b2.material = b2.material.clone();
  const sc = document.createElement('canvas');
  sc.width = 512; sc.height = 128;
  const sg = sc.getContext('2d');
  sg.fillStyle = '#fff0f6'; sg.fillRect(0, 0, 512, 128);
  sg.fillStyle = '#7a3cff'; sg.font = 'bold 84px sans-serif'; sg.textAlign = 'center'; sg.textBaseline = 'middle';
  sg.fillText('START', 256, 68);
  const st = new THREE.CanvasTexture(sc);
  st.colorSpace = THREE.SRGBColorSpace;
  b2.material.map = st;
  startArch.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; }); // overhead
  scene.add(startArch);

  // ---- Pose helpers ----
  const tmpRight = new THREE.Vector3();
  function getPose(s, lateral = 0) {
    const u = THREE.MathUtils.clamp(s / length, 0, 1);
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u).normalize();
    tmpRight.crossVectors(t, UP).normalize();
    const pos = p.clone().addScaledVector(tmpRight, lateral);
    const heading = Math.atan2(t.x, t.z);
    // slope pitch from tangent.y
    const pitch = Math.asin(THREE.MathUtils.clamp(t.y, -1, 1));
    return { pos, tangent: t, right: tmpRight.clone(), heading, pitch, u };
  }

  // bounds for scenery placement
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of centers) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  const bounds = {
    minX, maxX, minZ, maxZ,
    center: new THREE.Vector3((minX + maxX) / 2, 0, (minZ + maxZ) / 2),
  };

  // Zone-lighted far ground disc (large, receives no shadow for perf)
  const groundTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(256, 256, 40, 256, 256, 256);
    grd.addColorStop(0, '#c8ecb4');
    grd.addColorStop(0.55, '#b7e4c6');
    grd.addColorStop(1, '#f7cfe3');
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    // big candy-farm fields (soft patches like patchwork countryside)
    const fieldCols = ['#ff9ec9', '#ffd977', '#8fe3b0', '#9fd8ff', '#c9a3ff', '#ffb28a', '#ff8f9e'];
    for (let i = 0; i < 15; i++) {
      g.globalAlpha = 0.42;
      g.fillStyle = fieldCols[i % fieldCols.length];
      const r = 36 + Math.random() * 85;
      g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    for (let i = 0; i < 260; i++) {
      g.fillStyle = ['#a8dd8f', '#f2b8d4', '#ffe08a', '#9fd8ff'][i % 4];
      g.globalAlpha = 0.35;
      const r = 3 + Math.random() * 10;
      g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2); g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1100, 64),
    new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(bounds.center.x, -3.35, bounds.center.z);
  ground.receiveShadow = true;
  scene.add(ground);

  return {
    curve, length, halfW, getPose, bounds,
    samples: centers,
    sampleAt: (s) => centers[THREE.MathUtils.clamp(Math.round((s / length) * SAMPLES), 0, SAMPLES)],
  };
}
