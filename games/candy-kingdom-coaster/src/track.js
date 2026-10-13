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

// Across-the-ribbon layout of the road map (fraction of texture height).
// The road mesh covers curb → road → curb; the curbs are tinted by vertex
// colours and sample the plain white margins, the road band samples
// [ROAD_BAND[0], ROAD_BAND[1]]. One texture tile = ROAD_TILE_M metres.
export const ROAD_BAND = [0.12, 0.88];
export const ROAD_TILE_M = 12;

// Builds the road strip map. With `image` (assets/textures/road.jpg) the band
// is the generated strawberry-sprinkle asphalt; without it the previous
// procedural sprinkles are drawn so the look degrades gracefully offline.
function roadTexture(image) {
  const W = 1024, H = 1024;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  // Real UV mapping: x = ALONG track (1 tile = ROAD_TILE_M m), y = ACROSS.
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H); // neutral outside the band -> curbs keep vertex colours
  const y0 = Math.round(ROAD_BAND[0] * H), y1 = Math.round(ROAD_BAND[1] * H);
  const bandH = y1 - y0;

  if (image && image.width && image.height) {
    // 1:1 texels: the source width spans one tile along the track, the band
    // takes the vertical centre of the square tile (no stretching).
    const sh = Math.min(image.height, Math.round(image.height * (bandH / W)));
    const sy = Math.round((image.height - sh) / 2);
    g.drawImage(image, 0, sy, image.width, sh, 0, y0, W, bandH);
  } else {
    // strawberry road band — bright, so the track pops against the candy fields
    g.fillStyle = '#ffc9dd';
    g.fillRect(0, y0, W, bandH);
    // candy sprinkles inside the road band (tile every 12 m along the track)
    const conf = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#fff3b0'];
    for (let i = 0; i < 560; i++) {
      const x = Math.random() * W, y = y0 + 30 + Math.random() * (bandH - 60);
      const a = (Math.random() - 0.5) * 0.7;
      g.save();
      g.translate(x, y);
      g.rotate(a);
      g.fillStyle = conf[i % conf.length];
      g.globalAlpha = 0.92;
      g.beginPath();
      g.roundRect(-11, -4, 22, 8, 4);
      g.fill();
      g.restore();
    }
    g.globalAlpha = 1;
    // sugar glitter specks on the asphalt (catch the sun like the reference)
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * W, y = y0 + Math.random() * bandH;
      g.fillStyle = 'rgba(255,255,255,0.85)';
      g.beginPath(); g.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2); g.fill();
    }
  }

  // soft depth shading just inside both road edges (runs ALONG the road)
  const shadeY = (a, b) => {
    const gr = g.createLinearGradient(0, a, 0, b);
    gr.addColorStop(0, 'rgba(150,50,95,0.22)');
    gr.addColorStop(1, 'rgba(150,50,95,0)');
    g.fillStyle = gr;
    g.fillRect(0, Math.min(a, b), W, Math.abs(b - a));
  };
  shadeY(y0, y0 + 250);
  shadeY(y1, y1 - 250);
  // thick cream border lines along both road edges (~0.35 m)
  g.fillStyle = '#fffafd';
  g.fillRect(0, y0 - 10, W, 36);
  g.fillRect(0, y1 - 26, W, 36);
  // golden candy dash down the middle — centred in the tile so the mirrored
  // repeat keeps the dashes evenly spaced (one per tile)
  g.fillStyle = '#ffd23e';
  g.beginPath();
  g.roundRect(W / 2 - 145, (y0 + y1) / 2 - 48, 290, 96, 40);
  g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.MirroredRepeatWrapping; // seamless along the track
  tex.wrapT = THREE.ClampToEdgeWrapping;
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

export function createTrack(scene, TEX = {}) {
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

  // ---- Road ribbon (road band + rainbow curbs) and grass shoulders ----
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
  // profile indices: road mesh = outer curb .. road .. outer curb,
  // shoulders = the grass points on each side (sharing the outer curb edge)
  const K_CURB_L = 3, K_ROAD_L = 8, K_ROAD_R = 9, K_CURB_R = 14, K_LAST = profile.length - 1;
  const grassEdge = new THREE.Color('#b8e6a0');
  const hasMeadow = !!TEX.meadow;
  const white = new THREE.Color('#ffffff');

  const vertexColor = (i, k) => {
    const pr = profile[k];
    if (pr.kind === 'curb') return RAINBOW[pr.band].clone();
    if (pr.kind === 'road') return white.clone();
    // candy grass with zone tint, fading to a soft universal green-pink at distance
    const zc = zoneAt(i / SAMPLES);
    const col = new THREE.Color(zc.fog).lerp(new THREE.Color('#9fe3a8'), 0.62); // soft mint field — the pink road pops against it
    const away = (Math.abs(pr.off) - 7.6) / 14.4;
    col.lerp(grassEdge, away * 0.35);
    // the meadow map carries the mint detail now: keep the tint light so the
    // multiplied result stays as bright as the old flat shoulder
    if (hasMeadow) col.lerp(white, 0.3);
    return col;
  };

  // across-texture coordinate for the road mesh: curbs squeezed into the
  // white margins, the road band spread over ROAD_BAND of the map
  const roadV = (k) => {
    if (k <= 7) return (ROAD_BAND[0] - 0.04) * ((k - K_CURB_L) / (7 - K_CURB_L));
    if (k === K_ROAD_L) return ROAD_BAND[0];
    if (k === K_ROAD_R) return ROAD_BAND[1];
    return (ROAD_BAND[1] + 0.04) + (1 - ROAD_BAND[1] - 0.04) * ((k - 10) / (K_CURB_R - 10));
  };

  // Build one quad strip over profile indices [kFrom, kTo] into shared arrays.
  const buildStrip = (arrays, kFrom, kTo, uvFn) => {
    const { pos, col, uv, idx } = arrays;
    const base = pos.length / 3;
    const n = kTo - kFrom + 1;
    for (let i = 0; i <= SAMPLES; i++) {
      const u = i / SAMPLES;
      const c = centers[i], right = rights[i];
      for (let k = kFrom; k <= kTo; k++) {
        const pr = profile[k];
        pos.push(
          c.x + right.x * pr.off,
          c.y + pr.dy + (pr.kind === 'road' ? 0.02 : 0),
          c.z + right.z * pr.off
        );
        const vc = vertexColor(i, k);
        col.push(vc.r, vc.g, vc.b);
        const t = uvFn(u, k, pr);
        uv.push(t[0], t[1]);
      }
    }
    for (let i = 0; i < SAMPLES; i++) {
      for (let k = 0; k < n - 1; k++) {
        const a = base + i * n + k, b = a + n;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  };
  const toGeometry = ({ pos, col, uv, idx }) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };

  // road + curbs: x = along the track in tiles, y = across (see roadV)
  const roadArrays = { pos: [], col: [], uv: [], idx: [] };
  buildStrip(roadArrays, K_CURB_L, K_CURB_R, (u, k) => [u * (length / ROAD_TILE_M), roadV(k)]);
  const roadGeo = toGeometry(roadArrays);

  const roadTex = roadTexture(TEX.road ? TEX.road.image : null);
  roadTex.repeat.set(1, 1);
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTex, vertexColors: true, roughness: 0.58, metalness: 0.08,
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.receiveShadow = true;
  road.name = 'road';
  scene.add(road);

  // shoulders: world-scale UVs (one meadow tile = MEADOW_TILE_M m both ways)
  // so the sugar-grass detail keeps square texels on the sloping verges
  const MEADOW_TILE_M = 9;
  const grassArrays = { pos: [], col: [], uv: [], idx: [] };
  const grassUv = (u, k, pr) => [pr.off / MEADOW_TILE_M, (u * length) / MEADOW_TILE_M];
  buildStrip(grassArrays, 0, K_CURB_L, grassUv);
  buildStrip(grassArrays, K_CURB_R, K_LAST, grassUv);
  const grassGeo = toGeometry(grassArrays);
  const grassMat = hasMeadow
    ? new THREE.MeshStandardMaterial({ map: TEX.meadow, vertexColors: true, roughness: 0.92, metalness: 0.0 })
    : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0.08 });
  const shoulders = new THREE.Mesh(grassGeo, grassMat);
  shoulders.receiveShadow = true;
  shoulders.name = 'shoulders';
  scene.add(shoulders);

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

  // Far ground disc: the generated candy-farm patchwork (assets/textures/
  // fields.jpg) or, without it, the old soft radial patchwork gradient.
  const groundTex = TEX.fields || (() => {
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
