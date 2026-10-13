// Jump ramps: candy wedges that follow the road spline (so they sit flush on
// bends and hills), one per lane in different parts of the ride, plus the
// query the gameplay uses to know whether the car is on a ramp and how high.
import * as THREE from 'three';
import { RAMPS } from './config.js';

const UP = new THREE.Vector3(0, 1, 0);

// Top surface: candy base colour with white chevrons pointing up the ramp
// (v = along the run-up, u = across).
function rampTopTexture(color, accent) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 512);
  // soft gloss band down the middle
  const gr = g.createLinearGradient(0, 0, 256, 0);
  gr.addColorStop(0, 'rgba(255,255,255,0)');
  gr.addColorStop(0.5, 'rgba(255,255,255,0.18)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 512);
  // chevrons: 4 per tile, pointing toward v = 1 (the lip)
  g.fillStyle = accent;
  for (let i = 0; i < 4; i++) {
    const y = 512 - i * 128 - 40;
    g.beginPath();
    g.moveTo(24, y); g.lineTo(128, y - 64); g.lineTo(232, y);
    g.lineTo(232, y - 34); g.lineTo(128, y - 98); g.lineTo(24, y - 34);
    g.closePath();
    g.fill();
  }
  // candy edge stripes
  g.fillStyle = accent;
  g.fillRect(0, 0, 12, 512);
  g.fillRect(244, 0, 12, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

export function createRamps(scene, track, TEX = {}) {
  const group = new THREE.Group();
  group.name = 'ramps';
  scene.add(group);

  const list = RAMPS.map((cfg) => {
    const half = cfg.width / 2;
    const center = cfg.side * (half + 0.3); // lane centre: 0.3 m off the dash
    const r = {
      ...cfg,
      s0: cfg.s,
      s1: cfg.s + cfg.len,
      latMin: center - half,
      latMax: center + half,
      center,
      angle: Math.atan2(cfg.height, cfg.len),
    };
    r.heightAt = (s) => (s <= r.s0 ? 0 : s >= r.s1 ? r.height : r.height * ((s - r.s0) / r.len));
    return r;
  });

  const sideMat = new THREE.MeshStandardMaterial({ color: '#fff0f6', roughness: 0.5 });
  const caneMat = new THREE.MeshStandardMaterial({ map: TEX.cane || null, color: TEX.cane ? '#ffffff' : '#ff4b6e', roughness: 0.42 });
  const poleGeo = new THREE.CylinderGeometry(0.11, 0.13, 1.6, 8);
  const ballGeo = new THREE.SphereGeometry(0.22, 10, 8);

  for (const r of list) {
    const topMat = new THREE.MeshStandardMaterial({ map: rampTopTexture(r.color, r.accent), roughness: 0.45, metalness: 0.05 });
    topMat.map.repeat.set(1, Math.max(1, Math.round(r.len / 4)));

    // ---- top surface + sides + back wall, sampled along the spline ----
    const n = Math.max(6, Math.round(r.len / 0.8));
    const top = { pos: [], uv: [], idx: [] };
    const walls = { pos: [], idx: [] };
    const edgeL = [], edgeR = []; // world points of the top edges (for walls)
    for (let i = 0; i <= n; i++) {
      const s = r.s0 + (r.len * i) / n;
      const h = r.heightAt(s) + 0.03;
      const pl = track.getPose(s, r.latMin).pos.clone().addScaledVector(UP, h);
      const pr = track.getPose(s, r.latMax).pos.clone().addScaledVector(UP, h);
      edgeL.push(pl); edgeR.push(pr);
      top.pos.push(pl.x, pl.y, pl.z, pr.x, pr.y, pr.z);
      top.uv.push(0, i / n, 1, i / n);
      if (i < n) {
        const a = i * 2;
        top.idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); // CCW seen from above (normal = up)
      }
    }
    const topGeo = new THREE.BufferGeometry();
    topGeo.setAttribute('position', new THREE.Float32BufferAttribute(top.pos, 3));
    topGeo.setAttribute('uv', new THREE.Float32BufferAttribute(top.uv, 2));
    topGeo.setIndex(top.idx);
    topGeo.computeVertexNormals();
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    topMesh.name = 'rampTop';

    // side walls: top edge down to the road surface (+ back wall at the lip)
    const pushWall = (ptsTop, ptsBottom) => {
      const base = walls.pos.length / 3;
      for (let i = 0; i < ptsTop.length; i++) {
        const t = ptsTop[i], b = ptsBottom[i];
        walls.pos.push(t.x, t.y, t.z, b.x, b.y, b.z);
      }
      for (let i = 0; i < ptsTop.length - 1; i++) {
        const a = base + i * 2;
        walls.idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
      }
    };
    const bottomL = edgeL.map((p, i) => track.getPose(r.s0 + (r.len * i) / n, r.latMin).pos.clone().addScaledVector(UP, -0.05));
    const bottomR = edgeR.map((p, i) => track.getPose(r.s0 + (r.len * i) / n, r.latMax).pos.clone().addScaledVector(UP, -0.05));
    pushWall(edgeL, bottomL);
    pushWall(edgeR.slice().reverse(), bottomR.slice().reverse());
    pushWall([edgeR[n], edgeL[n]], [bottomR[n], bottomL[n]]); // back wall
    const wallGeo = new THREE.BufferGeometry();
    wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(walls.pos, 3));
    wallGeo.setIndex(walls.idx);
    wallGeo.computeVertexNormals();
    const wallMesh = new THREE.Mesh(wallGeo, sideMat);
    wallMesh.material.side = THREE.DoubleSide;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.name = 'rampWall';

    // candy-cane posts with a ball on the two lip corners: the lip reads from afar
    const posts = new THREE.Group();
    for (const corner of [edgeL[n], edgeR[n]]) {
      const pole = new THREE.Mesh(poleGeo, caneMat);
      pole.position.copy(corner).addScaledVector(UP, 0.8);
      const ball = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: r.color, roughness: 0.3, emissive: r.color, emissiveIntensity: 0.25 }));
      ball.position.copy(corner).addScaledVector(UP, 1.7);
      posts.add(pole, ball);
    }

    const rampGroup = new THREE.Group();
    rampGroup.name = `ramp:${r.id}`;
    rampGroup.add(topMesh, wallMesh, posts);
    rampGroup.traverse((o) => { o.userData.noCollide = true; }); // the car is meant to drive onto it
    group.add(rampGroup);
    r.group = rampGroup;
  }

  /**
   * Where is (s, lateral) relative to the ramps?
   * @returns {{ramp:object|null, inside:boolean, h:number, past:boolean}}
   *   inside — the car centre is within the ramp's lateral span while over
   *   its run-up; h — ramp surface height there; past — just beyond the lip
   */
  function sample(s, lateral) {
    for (const r of list) {
      if (s < r.s0 || s > r.s1 + 0.01) continue;
      const inside = lateral >= r.latMin && lateral <= r.latMax;
      return { ramp: r, inside, h: r.heightAt(s), past: s >= r.s1 };
    }
    return { ramp: null, inside: false, h: 0, past: false };
  }

  /** The ramp whose run-up contains s (ignoring lateral), or null. */
  function at(s) {
    return list.find((r) => s >= r.s0 && s <= r.s1) || null;
  }

  return { group, list, sample, at };
}
