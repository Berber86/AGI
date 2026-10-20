// Медальоны точек осмотра на полу: латунный номер, световой столб и кольцо
// прогресса прямо в мире. В стерео-режиме это единственный интерфейс — HUD нет.

import * as THREE from 'three';
import { POINTS } from './config.js';
import { medallionTexture } from './textures.js';

const MARKER_Y = 1.45;

const RING_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAG = /* glsl */ `
  uniform float uProgress;
  uniform float uActive;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  const float TAU = 6.28318530718;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;
    float a = atan(p.x, p.y);
    if (a < 0.0) a += TAU;
    float arcPos = a / TAU;
    float inArc = step(arcPos, uProgress);
    float ring = smoothstep(0.86, 0.93, r) * (1.0 - smoothstep(0.965, 1.0, r));
    float inner = smoothstep(0.70, 0.76, r) * (1.0 - smoothstep(0.80, 0.86, r));
    float halo = (1.0 - smoothstep(0.0, 0.92, r)) * (0.05 + 0.10 * uActive);
    float pulse = 0.72 + 0.28 * sin(uTime * 2.4);
    // песчинки золота, стягивающиеся к цели по спирали
    float spin = a / TAU + r * 0.55 - uTime * 0.18;
    float spokes = smoothstep(0.86, 0.94, sin(spin * TAU * 7.0) * 0.5 + 0.5);
    float dustBand = smoothstep(0.22, 0.36, r) * (1.0 - smoothstep(0.9, 0.99, r));
    float drift = 0.5 + 0.5 * sin(r * 26.0 - uTime * 3.0 + a * 3.0);
    float sparks = spokes * dustBand * drift * uActive * 0.42;
    float alpha = inner * 0.22 * pulse + ring * inArc * 1.0 + sparks + halo;
    alpha *= mix(0.55, 1.0, uActive);
    vec3 col = uColor * (1.0 + 0.55 * inArc) * (0.9 + 0.2 * pulse);
    gl_FragColor = vec4(col, alpha);
  }
`;

function columnTexture() {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 128, 0, 0);
  g.addColorStop(0, 'rgba(255,231,178,0.55)');
  g.addColorStop(0.35, 'rgba(255,219,150,0.20)');
  g.addColorStop(1, 'rgba(255,214,140,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createMarkers(scene) {
  const group = new THREE.Group();
  group.name = 'markers';
  const columnMap = columnTexture();
  // У каждого медальона своя фаза, чтобы полотно не мигало: шейдер времени
  // общий на все экземпляры, поэтому у каждой точки свой материал.
  const markers = POINTS.map((point, index) => {
    const holder = new THREE.Group();
    holder.name = `marker:${point.id}`;
    holder.position.set(point.position[0], 0, point.position[1]);

    // латунный медальон с номером
    const discMat = new THREE.MeshBasicMaterial({
      map: medallionTexture(index + 1),
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      toneMapped: false,
    });
    const disc = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.021;
    disc.renderOrder = 2;
    holder.add(disc);

    // кольцо и прогресс
    const ringMat = new THREE.ShaderMaterial({
      vertexShader: RING_VERT,
      fragmentShader: RING_FRAG,
      uniforms: {
        uProgress: { value: 0 },
        uActive: { value: 0 },
        uTime: { value: index * 1.7 },
        uColor: { value: new THREE.Color(0xffdda0) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 1.85), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.025;
    ring.renderOrder = 3;
    holder.add(ring);

    // световой столб
    const columnMat = new THREE.MeshBasicMaterial({
      map: columnMap,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 1.5, 20, 1, true), columnMat);
    column.position.y = 0.75;
    column.renderOrder = 2;
    holder.add(column);

    // Парящий медальон на уровне глаз: по нему и ведётся взгляд.
    const haloMat = new THREE.SpriteMaterial({
      map: disc.material.map,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.position.set(0, MARKER_Y, 0);
    halo.scale.set(0.62, 0.62, 0.62);
    halo.renderOrder = 4;
    holder.add(halo);

    group.add(holder);
    return { point, holder, ring, ringMat, discMat, columnMat, haloMat };
  });
  scene.add(group);

  let time = 0;

  function update(dt, { currentPointId, targetId, progress, visible }) {
    time += dt;
    for (const m of markers) {
      const isCurrent = m.point.id === currentPointId;
      const isTarget = m.point.id === targetId;
      m.holder.visible = visible && !isCurrent;
      m.ringMat.uniforms.uTime.value = time;
      const target = isCurrent ? 0 : isTarget ? Math.min(1, progress) : 0;
      m.ringMat.uniforms.uProgress.value += (target - m.ringMat.uniforms.uProgress.value) * Math.min(1, dt * 12);
      const active = isTarget ? 1 : 0;
      m.ringMat.uniforms.uActive.value += (active - m.ringMat.uniforms.uActive.value) * Math.min(1, dt * 8);
      m.discMat.opacity = 0.62 + 0.3 * (isTarget ? 1 : 0);
      m.columnMat.opacity += ((isTarget ? 0.4 : 0.0) - m.columnMat.opacity) * Math.min(1, dt * 6);
      m.holder.children[2].visible = m.columnMat.opacity > 0.02;
      m.haloMat.opacity += ((isTarget ? 0.8 : 0.3) - m.haloMat.opacity) * Math.min(1, dt * 8);
      const scale = isTarget ? 0.72 : 0.6;
      m.holder.children[3].scale.lerp(new THREE.Vector3(scale, scale, scale), Math.min(1, dt * 8));
    }
  }

  return { group, markers, update };
}
