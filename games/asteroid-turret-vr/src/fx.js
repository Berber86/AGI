// In-world effects for Asteroid Turret VR: laser beams (core + glow sheath),
// pooled explosion particles, tumbling shards, expanding shockwaves, smoke,
// beam trails and a pooled explosion light. No post-processing composer (perf
// guide): all glow is faked with additive sprites/cylinders, and every pool is
// preallocated so firing/explosions never allocate in the hot loop beyond small
// vectors.

import * as THREE from 'three';
import { makeGlowTexture } from './world.js';

export class FxSystem {
  constructor(scene, q) {
    this.scene = scene;
    this.stats = { bursts: 0, hullFlashes: 0, beamsFired: 0 };
    this.maxParticles = q.maxParticles;
    this.maxBeamTrails = q.maxBeamTrails;
    this.maxSmoke = q.maxSmoke;

    // --- pooled particles (single Points draw) ---
    this.pGeo = new THREE.BufferGeometry();
    this.pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MP * 3), 3));
    this.pGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MP * 3), 3));
    const points = new THREE.Points(this.pGeo, new THREE.PointsMaterial({
      size: 0.55, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false,
      map: makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), alphaTest: 0.01,
    }));
    points.frustumCulled = false;
    scene.add(points);
    this.particles = [];

    // --- beam trails: fading laser streaks between turret and target ---
    this.trailGeo = new THREE.BufferGeometry();
    this.trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MBT * 6), 3));
    this.trailGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MBT * 6), 3));
    const trails = new THREE.LineSegments(this.trailGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    trails.frustumCulled = false;
    scene.add(trails);
    this.beamTrails = []; // {x1,y1,z1,x2,y2,z2,life,maxLife,color}

    // --- smoke particles after explosions ---
    this.sGeo = new THREE.BufferGeometry();
    this.sGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MSM * 3), 3));
    this.sGeo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(MSM), 1));
    this.sGeo.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(MSM), 1));
    const smoke = new THREE.Points(this.sGeo, new THREE.PointsMaterial({
      size: 0.8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      map: makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), alphaTest: 0.01,
    }));
    smoke.frustumCulled = false;
    scene.add(smoke);
    this.smoke = []; // {x,y,z,size,alpha,life,maxLife,rise}

    // --- pooled shards ---
    this.shardGeo = new THREE.TetrahedronGeometry(0.34);
    this.shardMat = new THREE.MeshStandardMaterial({ color: 0x7a5f4c, roughness: 0.9, flatShading: true, emissive: 0x200f04 });
    this.shards = [];
    for (let i = 0; i < 30; i++) {
      const mesh = new THREE.Mesh(this.shardGeo, this.shardMat);
      mesh.visible = false; scene.add(mesh);
      this.shards.push({ mesh, vel: new THREE.Vector3(), rot: new THREE.Vector3(), life: 0 });
    }

    // --- transient sprites / shockwaves / beams (small pools, disposed) ---
    this.flashes = [];
    this.waves = [];
    this.beams = [];
    this.flashTex = makeGlowTexture('rgba(255,190,90,1)', 'rgba(255,90,20,0)');
    this.waveGeo = new THREE.RingGeometry(0.85, 1, 40);

    // --- pooled explosion light (one light, repositioned per burst) ---
    this.boomLight = new THREE.PointLight(0xffa050, 0, 46, 1.6);
    scene.add(this.boomLight);

    this._muzzle = new THREE.Vector3(); this._target = new THREE.Vector3();
    this._mid = new THREE.Vector3(); this._dir = new THREE.Vector3();
    this._up = new THREE.Vector3(0, 1, 0);
  }

  /** Glowing beam: bright core cylinder + wide additive sheath + muzzle flash. */
  fireBeam(muzzleObj, x, y, z) {
    this.stats.beamsFired += 1;
    if (muzzleObj) muzzleObj.getWorldPosition(this._muzzle); else this._muzzle.set(0, -0.3, -1);
    this._target.set(x, y, z);
    const len = this._muzzle.distanceTo(this._target);
    this._mid.addVectors(this._muzzle, this._target).multiplyScalar(0.5);
    this._dir.subVectors(this._target, this._muzzle).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(this._up, this._dir);

    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.06, len, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xbffbff, transparent: true, opacity: 1, depthWrite: false }),
    );
    core.position.copy(this._mid); core.quaternion.copy(quat);
    const sheath = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.22, len, 10, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x27c8e8, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    );
    sheath.position.copy(this._mid); sheath.quaternion.copy(quat);
    this.scene.add(core, sheath);
    this.beams.push({ parts: [core, sheath], life: 0.16, max: 0.16 });

    // beam trail: fading laser streak
    const trail = {
      x1: this._muzzle.x, y1: this._muzzle.y, z1: this._muzzle.z,
      x2: this._target.x, y2: this._target.y, z2: this._target.z,
      life: 0, maxLife: 0.12,
    };
    this.beamTrails.push(trail);
    if (this.beamTrails.length > this.maxBeamTrails) this.beamTrails.shift();

    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.flashTex, color: 0x9fefff, transparent: true, depthWrite: false }));
    flash.position.copy(this._muzzle); flash.scale.setScalar(0.85);
    this.scene.add(flash);
    this.flashes.push({ sprite: flash, life: 0.09, max: 0.09, grow: 2 });
  }

  /** Explosion / impact burst at a world point. big = asteroid destroyed. */
  burst(x, y, z, big = true) {
    this.stats.bursts += 1;
    const origin = new THREE.Vector3(x, y, z);
    const count = big ? 84 : 32;
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize().multiplyScalar(3 + Math.random() * (big ? 9 : 5));
      const warm = Math.random();
      this.particles.push({
        pos: origin.clone(), vel: v, life: 0, maxLife: 0.6 + Math.random() * 0.9,
        r: 1, g: 0.45 + warm * 0.4, b: 0.12 + warm * 0.2,
      });
    }
    let spawned = 0;
    for (const sh of this.shards) {
      if (sh.life > 0) continue;
      sh.life = 0.8 + Math.random() * 0.6;
      sh.mesh.visible = true;
      sh.mesh.position.copy(origin);
      sh.mesh.scale.setScalar(0.7 + Math.random() * 1.4);
      sh.vel.set((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9);
      sh.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      if (++spawned >= (big ? 10 : 4)) break;
    }
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.flashTex, transparent: true, depthWrite: false }));
    flash.position.copy(origin); flash.scale.setScalar(big ? 9 : 5);
    this.scene.add(flash);
    this.flashes.push({ sprite: flash, life: 0.28, max: 0.28, grow: 8 });

    // expanding shockwave ring, billboarded next update
    const wave = new THREE.Mesh(this.waveGeo, new THREE.MeshBasicMaterial({
      color: big ? 0xffd27a : 0xff8a5a, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false,
    }));
    wave.position.copy(origin);
    this.scene.add(wave);
    this.waves.push({ mesh: wave, life: 0.45, max: 0.45, big });

    // secondary outer flash for big explosions
    if (big) {
      const flash2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.flashTex, color: 0xffa050, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      flash2.position.copy(origin); flash2.scale.setScalar(14);
      this.scene.add(flash2);
      this.flashes.push({ sprite: flash2, life: 0.18, max: 0.18, grow: 10 });
    }

    this.boomLight.position.copy(origin);
    this.boomLight.intensity = big ? 340 : 150;

    // smoke: rising dark particles after explosion
    const smokeCount = big ? 14 : 6;
    for (let i = 0; i < smokeCount; i++) {
      this.smoke.push({
        x: origin.x + (Math.random() - 0.5) * 1.5,
        y: origin.y,
        z: origin.z + (Math.random() - 0.5) * 1.5,
        size: 0.4 + Math.random() * 1.2,
        alpha: 0.35 + Math.random() * 0.25,
        life: 0, maxLife: 1.2 + Math.random() * 1.0,
        rise: 0.8 + Math.random() * 1.2,
      });
    }
  }

  update(dt, camera) {
    // particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i]; pt.life += dt;
      if (pt.life >= pt.maxLife) { this.particles.splice(i, 1); continue; }
      pt.vel.multiplyScalar(1 - dt * 1.4);
      pt.pos.addScaledVector(pt.vel, dt);
    }
    const pos = this.pGeo.attributes.position; const col = this.pGeo.attributes.color;
    for (let i = 0; i < this.maxParticles; i++) {
      const pt = this.particles[i];
      if (pt) {
        const fade = 1 - pt.life / pt.maxLife;
        pos.setXYZ(i, pt.pos.x, pt.pos.y, pt.pos.z);
        col.setXYZ(i, pt.r * fade, pt.g * fade, pt.b * fade);
      } else { pos.setXYZ(i, 0, 0, -999); col.setXYZ(i, 0, 0, 0); }
    }
    pos.needsUpdate = true; col.needsUpdate = true;

    for (const sh of this.shards) {
      if (sh.life <= 0) continue;
      sh.life -= dt;
      sh.mesh.position.addScaledVector(sh.vel, dt);
      sh.mesh.rotation.x += sh.rot.x * dt; sh.mesh.rotation.y += sh.rot.y * dt;
      if (sh.life <= 0) sh.mesh.visible = false;
    }
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i]; f.life -= dt;
      f.sprite.material.opacity = Math.max(0, f.life / f.max);
      f.sprite.scale.multiplyScalar(1 + dt * f.grow);
      if (f.life <= 0) { this.scene.remove(f.sprite); f.sprite.material.dispose(); this.flashes.splice(i, 1); }
    }
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i]; w.life -= dt;
      const t = 1 - Math.max(0, w.life / w.max);
      w.mesh.scale.setScalar(0.5 + t * (w.big ? 7 : 4));
      w.mesh.material.opacity = 0.8 * (1 - t);
      if (camera) w.mesh.lookAt(camera.getWorldPosition(this._target));
      if (w.life <= 0) { this.scene.remove(w.mesh); w.mesh.material.dispose(); this.waves.splice(i, 1); }
    }
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i]; b.life -= dt;
      const k = Math.max(0, b.life / b.max);
      b.parts[0].material.opacity = k; b.parts[1].material.opacity = k * 0.35;
      if (b.life <= 0) {
        for (const p of b.parts) { this.scene.remove(p); p.geometry.dispose(); p.material.dispose(); }
        this.beams.splice(i, 1);
      }
    }

    // beam trails: fade out laser streaks
    const tPos = this.trailGeo.attributes.position; const tCol = this.trailGeo.attributes.color;
    for (let i = 0; i < this.maxBeamTrails; i++) {
      const tr = this.beamTrails[i];
      if (tr) {
        tr.life += dt;
        const fade = 1 - tr.life / tr.maxLife;
        tPos.setXYZ(i * 6, tr.x1, tr.y1, tr.z1);
        tPos.setXYZ(i * 6 + 1, tr.x2, tr.y2, tr.z2);
        tPos.setXYZ(i * 6 + 2, tr.x2, tr.y2, tr.z2);
        tPos.setXYZ(i * 6 + 3, tr.x1, tr.y1, tr.z1);
        tPos.setXYZ(i * 6 + 4, tr.x1 + (tr.x2 - tr.x1) * 0.5, tr.y1 + (tr.y2 - tr.y1) * 0.5 + 0.1, tr.z1 + (tr.z2 - tr.z1) * 0.5);
        tPos.setXYZ(i * 6 + 5, tr.x1 + (tr.x2 - tr.x1) * 0.5, tr.y1 + (tr.y2 - tr.y1) * 0.5 - 0.1, tr.z1 + (tr.z2 - tr.z1) * 0.5);
        const c = fade * 0.9;
        tCol.setXYZ(i * 6, c, c * 0.8, c * 1.0);
        tCol.setXYZ(i * 6 + 1, c, c * 0.8, c * 1.0);
        tCol.setXYZ(i * 6 + 2, c, c * 0.8, c * 1.0);
        tCol.setXYZ(i * 6 + 3, c, c * 0.8, c * 1.0);
        tCol.setXYZ(i * 6 + 4, c * 0.6, c * 0.5, c * 0.9);
        tCol.setXYZ(i * 6 + 5, c * 0.6, c * 0.5, c * 0.9);
        if (tr.life >= tr.maxLife) this.beamTrails[i] = null;
      } else {
        tPos.setXYZ(i * 6, 0, 0, -999); tPos.setXYZ(i * 6 + 1, 0, 0, -999);
        tPos.setXYZ(i * 6 + 2, 0, 0, -999); tPos.setXYZ(i * 6 + 3, 0, 0, -999);
        tPos.setXYZ(i * 6 + 4, 0, 0, -999); tPos.setXYZ(i * 6 + 5, 0, 0, -999);
        tCol.setXYZ(i * 6, 0, 0, 0); tCol.setXYZ(i * 6 + 1, 0, 0, 0);
        tCol.setXYZ(i * 6 + 2, 0, 0, 0); tCol.setXYZ(i * 6 + 3, 0, 0, 0);
        tCol.setXYZ(i * 6 + 4, 0, 0, 0); tCol.setXYZ(i * 6 + 5, 0, 0, 0);
      }
    }
    tPos.needsUpdate = true; tCol.needsUpdate = true;

    // smoke: rising dark particles
    const sPos = this.sGeo.attributes.position; const sSize = this.sGeo.attributes.size; const sAlpha = this.sGeo.attributes.alpha;
    for (let i = 0; i < this.maxSmoke; i++) {
      const sm = this.smoke[i];
      if (sm) {
        sm.life += dt;
        sm.y += sm.rise * dt;
        sm.x += (Math.sin(sm.life * 3) * 0.1) * dt;
        const fade = 1 - sm.life / sm.maxLife;
        sPos.setXYZ(i, sm.x, sm.y, sm.z);
        sSize.setX(i, sm.size * (1 + fade * 1.5));
        sAlpha.setX(i, sm.alpha * fade * 0.6);
        if (sm.life >= sm.maxLife) this.smoke[i] = null;
      } else {
        sPos.setXYZ(i, 0, 0, -999);
        sSize.setX(i, 0);
        sAlpha.setX(i, 0);
      }
    }
    sPos.needsUpdate = true; sSize.needsUpdate = true; sAlpha.needsUpdate = true;

    this.boomLight.intensity = Math.max(0, this.boomLight.intensity - dt * 700);
  }

  info() {
    return { ...this.stats, activeParticles: this.particles.length, activeBeams: this.beams.length, activeWaves: this.waves.length, activeTrails: this.beamTrails.filter(Boolean).length, activeSmoke: this.smoke.filter(Boolean).length };
  }
}
