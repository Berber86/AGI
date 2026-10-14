// The four destinations and their physical signposts. Roads themselves live
// in track.js, and routing lives in routes.js: scenery never decides a path.
import * as THREE from 'three';
import { gummyBearGeometry } from './world.js';
import { mergeByMaterial, instanceGroups } from './merge.js';
const UP = new THREE.Vector3(0, 1, 0), FLOOR = -3.3;
const smooth = THREE.MathUtils.smoothstep;
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .62, ...extra });
function mesh(parent, geometry, material, p) {
  const m = new THREE.Mesh(geometry, material); if (p) m.position.copy(p); parent.add(m); return m;
}
function bar(parent, a, b, radius, material) {
  const d = b.clone().sub(a), m = mesh(parent, new THREE.CylinderGeometry(radius, radius, d.length(), 6), material);
  m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); return m;
}
function starGeometry(r = 1) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * .46 : r;
    if (!i) shape.moveTo(Math.cos(a) * d, Math.sin(a) * d); else shape.lineTo(Math.cos(a) * d, Math.sin(a) * d);
  }
  shape.closePath(); return new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: false });
}
function icon(g, kind, x, y, color) {
  g.save(); g.translate(x, y); g.fillStyle = color; g.strokeStyle = color; g.lineWidth = 8; g.lineCap = 'round';
  const circle = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };
  if (kind === 'bear') { circle(-19, -22, 11); circle(19, -22, 11); circle(0, -7, 28); circle(0, 29, 30); g.fillStyle = '#fff9ee'; circle(-9, -9, 4); circle(9, -9, 4); }
  else if (kind === 'star') { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 19 : 40; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); }
  else if (kind === 'cloud') { circle(-20, 12, 24); circle(8, -5, 31); circle(31, 17, 21); g.fillRect(-20, 8, 52, 30); }
  else { g.beginPath(); g.moveTo(-37, 31); g.lineTo(22, -6); g.lineTo(22, 31); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-28, -15); g.quadraticCurveTo(0, -55, 35, -25); g.stroke(); g.beginPath(); g.moveTo(20, -29); g.lineTo(35, -25); g.lineTo(33, -42); g.stroke(); }
  g.restore();
}
function signTexture(feature, direction) {
  const c = document.createElement('canvas'); c.width = 640; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#fff9ed'; g.beginPath(); g.roundRect(3, 3, 634, 250, 42); g.fill();
  g.lineWidth = 13; g.strokeStyle = feature.color; g.stroke(); icon(g, feature.icon, 86, 121, feature.color);
  g.fillStyle = '#694b70'; g.font = '900 37px Nunito, sans-serif'; g.textAlign = 'center';
  feature.short.forEach((t, i) => g.fillText(t, 330, 109 + 46 * i));
  g.strokeStyle = feature.color; g.lineWidth = 14; g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); g.moveTo(direction < 0 ? 605 : 557, 128); g.lineTo(direction < 0 ? 557 : 605, 128);
  g.moveTo(581, 103); g.lineTo(direction < 0 ? 557 : 605, 128); g.lineTo(581, 153); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function createForks(scene, track, TEX = {}) {
  const group = new THREE.Group(); group.name = 'forkDestinations'; scene.add(group);
  const staticParts = new THREE.Group(); staticParts.name = 'forkScenery'; group.add(staticParts);
  const cream = mat('#fff1de'), gold = mat('#f3c975'), lavender = mat('#b0a0ef');
  const cane = mat(TEX.cane ? '#ffffff' : '#ef8cb8', { map: TEX.cane || null });
  const cloudMat = mat('#fff4fa'), blue = mat('#97d4e8');
  const glow = mat('#ffe79c', { emissive: '#ffd66e', emissiveIntensity: .72 });
  const star = starGeometry(1.1), sphere = new THREE.SphereGeometry(1, 10, 6);
  const bedMat = mat('#dbefcc', { map: TEX.meadow || null });
  const bearGeo = gummyBearGeometry(true), bears = [], corridors = [];
  const gumColors = ['#efa754', '#ed84af', '#82cbb5', '#e5cb65'];

  for (const f of track.routes.forks) {
    // Keep the entire decision approach clear of random lollipops/canes so
    // they cannot hide a direction board or its arrow.
    for (let s = f.s0 - f.warning; s < f.s0; s += 5) corridors.push(track.getBasePose(s).pos);
    // A low meadow island, not airborne grass over either playable ribbon.
    const a = [], uv = [], idx = [], n = 110;
    for (let i = 0; i <= n; i++) {
      const q = i / n, s = f.s0 + f.span * q, p = track.getBasePose(s);
      const width = 20 + f.spread * Math.sin(Math.PI * q) ** 2;
      for (let k = 0; k < 5; k++) {
        const x = (k - 2) / 2 * width, v = p.pos.clone().addScaledVector(p.right, x);
        v.y = k === 0 || k === 4 ? FLOOR : p.pos.y - 3.1;
        a.push(v.x, v.y, v.z); uv.push(v.x / 9, v.z / 9);
      }
      if (i < n) for (let k = 0; k < 4; k++) { const j = i * 5 + k; idx.push(j, j + 1, j + 5, j + 5, j + 1, j + 6); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(a, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    mesh(staticParts, geo, bedMat).name = 'forkMeadow';

    // Signs stand OUTSIDE the complete car envelope, never on the split nose.
    for (const route of f.branches) {
      const side = route.index ? 1 : -1, pose = track.getBasePose(f.s0 - 30, side * 12.5);
      const poleTop = pose.pos.clone().addScaledVector(UP, 6.0);
      bar(staticParts, pose.pos.clone().addScaledVector(UP, -2), poleTop, .22, cane);
      const face = mesh(staticParts, new THREE.PlaneGeometry(7.8, 3.12), new THREE.MeshBasicMaterial({ map: signTexture(route, side), color: '#b8a7b7', alphaTest: .1, side: THREE.DoubleSide }), poleTop);
      face.rotation.y = pose.heading + Math.PI;
      face.position.addScaledVector(pose.tangent, -.36); // board IN FRONT of its pole, never text crossed by a cane
      mesh(staticParts, new THREE.SphereGeometry(.36, 8, 5), gold, poleTop.clone().addScaledVector(UP, 1.85));
      // Painted arrows mark the actual decision landing before the roads fan
      // out. They are not extra buttons: selecting still uses normal steering.
      const paint = document.createElement('canvas'); paint.width = 128; paint.height = 256;
      const g = paint.getContext('2d'), tip = side < 0 ? 28 : 100;
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (const [color, width] of [['#fff8ea', 25], [route.color, 16]]) {
        g.strokeStyle = color; g.lineWidth = width; g.beginPath(); g.moveTo(64, 228); g.lineTo(64, 137); g.quadraticCurveTo(64, 99, tip, 56); g.stroke();
        g.beginPath(); g.moveTo(tip - side * 4, 95); g.lineTo(tip, 56); g.lineTo(tip - side * 35, 57); g.stroke();
      }
      const texture = new THREE.CanvasTexture(paint); texture.colorSpace = THREE.SRGBColorSpace;
      const arrowPose = track.getBasePose(f.s0 - 13, side * 2.35), normal = new THREE.Vector3().crossVectors(arrowPose.right, arrowPose.tangent).normalize();
      const arrow = mesh(staticParts, new THREE.PlaneGeometry(2.7, 4.6), new THREE.MeshBasicMaterial({ map: texture, color: '#d8cad8', transparent: true, alphaTest: .1, depthWrite: false }), arrowPose.pos.addScaledVector(UP, .045));
      arrow.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(arrowPose.right, arrowPose.tangent, normal));

    }
    for (const route of f.branches) {
      const pose = (q, lat = 0) => track.getPose(f.s0 + f.span * q, lat, route.index);
      const point = (q, lat = 0, dy = 0) => pose(q, lat).pos.addScaledVector(UP, dy);
      for (let i = 0; i <= 70; i++) corridors.push(point(i / 70));

      if (route.kind === 'hills') {
        for (let i = 0; i < 8; i++) {
          const q = [.29, .39, .61, .71][Math.floor(i / 2)], side = i % 2 ? 1 : -1;
          const p = pose(q, side * 12.5), g = new THREE.Group(); g.name = 'gummyFriend';
          const floor = track.getBasePose(f.s0 + f.span * q).pos.y - 3.1;
          const stand = p.pos.y - .45, height = Math.max(.5, stand - floor);
          mesh(staticParts, new THREE.CylinderGeometry(3.15, 3.75, height, 16), cream,
            new THREE.Vector3(p.pos.x, floor + height / 2, p.pos.z));
          mesh(staticParts, new THREE.CylinderGeometry(3.2, 3.2, .22, 16), gold,
            new THREE.Vector3(p.pos.x, stand + .1, p.pos.z));
          g.position.copy(p.pos); g.position.y = stand + .38;
          g.rotation.y = p.heading + Math.PI; g.scale.setScalar(3.1);
          const gm = new THREE.MeshPhysicalMaterial({ color: gumColors[i % 4], roughness: .2, clearcoat: 1, metalness: .03 });
          mesh(g, bearGeo, gm);
          for (const x of [-.12, .12]) mesh(g, new THREE.SphereGeometry(.045, 7, 4), mat('#5c414b'), new THREE.Vector3(x, 1.55, .39));
          group.add(g); g.userData.baseY = g.position.y; bears.push(g);
        }
      }
      if (route.kind === 'tunnel') {
        const positions = [], tex = [], indices = [], ns = 36, rings = 26, R = 11, cy = 2.2;
        for (let i = 0; i <= ns; i++) {
          const q = .29 + .42 * i / ns;
          for (let j = 0; j <= rings; j++) {
            const angle = Math.PI * j / rings, p = point(q, Math.cos(angle) * R, cy + Math.sin(angle) * R);
            positions.push(p.x, p.y, p.z); tex.push(i / 4, j / 5);
          }
          if (i < ns) for (let j = 0; j < rings; j++) { const k = i * (rings + 1) + j; indices.push(k, k + 1, k + rings + 1, k + 1, k + rings + 2, k + rings + 1); }
        }
        const shell = new THREE.BufferGeometry(); shell.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        shell.setAttribute('uv', new THREE.Float32BufferAttribute(tex, 2)); shell.setIndex(indices); shell.computeVertexNormals();
        mesh(staticParts, shell, mat('#888ccb', { emissive: '#7985c7', emissiveIntensity: .20, side: THREE.DoubleSide })).name = 'starTunnelShell';
        for (let i = 0; i <= 6; i++) {
          const q = .29 + .42 * i / 6; let prev = point(q, R, -.6);
          for (let j = 0; j <= 20; j++) {
            const a = Math.PI * j / 20, next = point(q, R * Math.cos(a), cy + R * Math.sin(a));
            bar(staticParts, prev, next, .3, i % 2 ? blue : cream); prev = next;
          }
          bar(staticParts, prev, point(q, -R, -.6), .3, i % 2 ? blue : cream);
          for (const side of [-1, 1]) {
            const s = mesh(staticParts, star, glow, point(q, side * 5.4, 7.4 + i % 2));
            s.rotation.y = pose(q).heading + Math.PI; s.rotation.z = side * .17;
          }
        }
      }
      if (route.kind === 'jump') {
        const cookie = mat('#d8a05c', { map: TEX.cookie || null }), chips = mat('#694232');
        for (let i = 0; i < 8; i++) {
          const q = .29 + Math.floor(i / 2) * .13, p = pose(q, i % 2 ? 13 : -13);
          const root = new THREE.Group(); root.position.copy(p.pos); root.position.y = track.getBasePose(f.s0 + f.span * q).pos.y - .2;
          root.rotation.y = p.heading; staticParts.add(root);
          const body = mesh(root, new THREE.CylinderGeometry(2.6, 2.6, .65, 20), cookie); body.rotation.x = Math.PI / 2;
          for (let k = 0; k < 9; k++) {
            const a = k * 2.4, d = .5 + k % 3 * .55;
            mesh(root, new THREE.SphereGeometry(.22, 6, 4), chips, new THREE.Vector3(Math.cos(a) * d, Math.sin(a) * d, -.4)).scale.z = .35;
          }
          bar(root, new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, -1.7, 0), .24, cream);
        }
      }
      if (route.kind === 'cloud') {
        // A high wafer bridge with continuous rails and cotton-candy clouds
        // BELOW its centre/outer edge, not billboards blocking the driving view.
        for (const side of [-1, 1]) {
          const pts = [];
          for (let i = 0; i <= 36; i++) {
            const q = .23 + .54 * i / 36, p = point(q, side * 8.5);
            pts.push(p.clone().addScaledVector(UP, 1.45));
            if (i % 2 === 0) {
              bar(staticParts, p.clone().addScaledVector(UP, -.2), p.clone().addScaledVector(UP, 1.45), .14, cane);
              mesh(staticParts, new THREE.SphereGeometry(.23, 7, 4), lavender, p.clone().addScaledVector(UP, 1.55));
            }
            if (i % 9 === 0) {
              const baseY = track.getBasePose(f.s0 + f.span * q).pos.y - 3.1;
              bar(staticParts, p.clone().setY(baseY), p.clone().addScaledVector(UP, -.85), .4, cream);
            }
          }
          for (const dy of [0, -.7]) mesh(staticParts, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => p.clone().addScaledVector(UP, dy))), 64, .12, 5, false), gold);
        }
        for (let i = 0; i < 7; i++) {
          const q = .29 + i * .065, p = point(q, i % 2 ? 16 : 0, i % 2 ? -4.7 : -5.4);
          for (let k = 0; k < 5; k++) {
            const c = mesh(staticParts, sphere, k % 3 ? cloudMat : blue, p.clone().add(new THREE.Vector3((k - 2) * 1.8, k % 2 * .55, Math.sin(k * 2) * 1.1)));
            c.scale.set(2.4, 1.35 + k % 2 * .3, 2.3);
          }
        }
      }
    }
  }
  mergeByMaterial(staticParts, { castShadow: false, receiveShadow: true, noCollide: false });
  const { sync: syncBears } = instanceGroups(group, bears, 'forkGummyFriends');
  function update(dt, time, s) {
    for (let i = 0; i < bears.length; i++) {
      const b = bears[i]; b.position.y = b.userData.baseY + Math.abs(Math.sin(time * 1.8 + i)) * .17;
      b.rotation.z = Math.sin(time * 1.5 + i) * .035;
    }
    syncBears();
  }
  function darkness(s) {
    const f = track.routes.at(s); if (!f || f.branches[track.routes.choice(f)].kind !== 'tunnel') return 0;
    const q = (s - f.s0) / f.span;
    return .62 * smooth(q, .285, .315) * (1 - smooth(q, .685, .715));
  }
  function blocks(x, z) { return corridors.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < 28 ** 2); }
  return { group, update, darkness, blocks };
}
