// body-preview.js — автономный «скульпторский лупок» для 3D-тела «Белой ночи».
// Рендерит то же самое воплощение (handMesh.js) в наборе контрольных кадров,
// чтобы большая пальцы, плечи-окаты и вязаный шарф можно было рассмотреть вблизи.
import * as THREE from 'three';
import { createGlovedHand } from '../src/vr/handMesh.js';

const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(900, 900, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121a22);
scene.fog = new THREE.Fog(0x121a22, 3.4, 7.0);

scene.add(new THREE.AmbientLight(0x9fb6cc, 0.34));
const hemi = new THREE.HemisphereLight(0xc7dcee, 0x39322c, 1.15);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xfff2d8, 1.72);
key.position.set(0.75, 1.60, -1.35);
scene.add(key);
const fill = new THREE.DirectionalLight(0x8fb4d8, 0.52);
fill.position.set(-1.20, 0.45, 0.90);
scene.add(fill);
const bounce = new THREE.DirectionalLight(0x6d5f52, 0.34);
bounce.position.set(0.10, -1.80, -0.55);
scene.add(bounce);

// Мостовая, чтобы видеть опору ботинок и читать силуэт
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(3.2, 48),
  new THREE.MeshStandardMaterial({ color: 0x2a2f33, roughness: 0.92, metalness: 0.04 })
);
ground.rotation.x = -Math.PI / 0.5;
ground.position.y = -1.585;
scene.add(ground);

const avatar = createGlovedHand('right');
avatar.group.visible = true;
scene.add(avatar.group);

const camera = new THREE.PerspectiveCamera(70, 1, 0.02, 20);
const DEG = Math.PI / 180;
const target = new THREE.Vector3();

function quatLook(finger, dorsal) {
  const z = finger.clone().normalize().negate();
  const y = dorsal.clone().addScaledVector(z, -dorsal.dot(z)).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

function step(dt, opts) {
  for (let i = 0; i < 24; i++) avatar.update(dt, opts);
}

const VIEWS = {
  'fp-down': {
    cam: 'fp', pitch: -55, fov: 70,
    pose: { visible: true, handMode: false, headLook: { yaw: 0, pitch: -55 * DEG }, torsoYaw: 0 },
  },
  'fp-down-hand': {
    cam: 'fp', pitch: -55, fov: 70,
    pose: {
      visible: true, handMode: true, handTracked: true, handSide: 'right',
      headLook: { yaw: 0, pitch: -55 * DEG }, torsoYaw: 0,
      pos: { x: 0.168, y: -0.330, z: -0.415 }, vel: { x: 0, y: 0, z: 0 },
      qArm: quatLook(new THREE.Vector3(-0.10, -0.74, -0.66), new THREE.Vector3(-0.30, 0.60, -0.74)).toArray(),
      elbowPos: { x: 0.242, y: -0.478, z: -0.176 },
      shoulderPos: { x: 0.196, y: -0.290, z: -0.042 },
      reach: 0.42, elbowBendDeg: 74, phase: 'search',
    },
  },
  'fp-thumb': {
    cam: 'fp', pitch: -18, fov: 52,
    pose: {
      visible: true, handMode: true, handTracked: true, handSide: 'right',
      headLook: { yaw: 0, pitch: -14 * DEG }, torsoYaw: 0,
      pos: { x: 0.052, y: 0.020, z: -0.400 }, vel: { x: 0, y: 0, z: 0 },
      qArm: quatLook(new THREE.Vector3(0.34, 0.52, -0.78), new THREE.Vector3(0.16, 0.72, 0.67)).toArray(),
      elbowPos: { x: 0.205, y: -0.265, z: -0.150 },
      shoulderPos: { x: 0.196, y: -0.290, z: -0.042 },
      reach: 0.30, elbowBendDeg: 96, phase: 'search',
    },
  },
  'chest34': {
    cam: 'ext', eye: [0.46, -0.055, 0.40], at: [0.005, -0.300, -0.045], fov: 34,
    pose: { visible: true, handMode: false, headLook: { yaw: 0, pitch: 0 }, torsoYaw: 0 },
  },
  'scarfTop': {
    cam: 'ext', eye: [0.06, 0.115, -0.46], at: [0.0, -0.262, 0.012], fov: 36,
    pose: { visible: true, handMode: false, headLook: { yaw: 0, pitch: 0 }, torsoYaw: 0 },
  },
  'shoulderRight': {
    cam: 'ext', eye: [0.86, 0.02, 0.44], at: [0.20, -0.285, -0.03], fov: 26,
    pose: { visible: true, handMode: false, headLook: { yaw: 0, pitch: 0 }, torsoYaw: 0 },
  },
  'pocketHand': {
    cam: 'ext', eye: [0.62, -0.42, -0.86], at: [0.19, -0.60, -0.24], fov: 24,
    pose: { visible: true, handMode: false, headLook: { yaw: 0, pitch: 0 }, torsoYaw: 0 },
  },
  'mirrorFull': {
    cam: 'ext', eye: [0.0, -0.46, -2.65], at: [0.0, -0.62, 0.0], fov: 34,
    pose: { visible: true, handMode: false, headLook: { yaw: 0, pitch: 0 }, torsoYaw: 0 },
  },
};

window.__PREVIEW__ = {
  names: Object.keys(VIEWS),
  render(name) {
    const v = VIEWS[name];
    if (!v) throw new Error('unknown view ' + name);
    camera.fov = v.fov;
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    if (v.cam === 'fp') {
      // handMesh.update() сам поворачивает тело по headLook (глаза в [0,0,0]),
      // поэтому камера «глаз» стоит строго по направлению взгляда -Z.
      camera.position.set(0, 0, 0.012);
      camera.rotation.set(0, 0, 0, 'YXZ');
    } else {
      camera.position.set(v.eye[0], v.eye[1], v.eye[2]);
      target.set(v.at[0], v.at[1], v.at[2]);
      camera.up.set(0, 1, 0);
      camera.lookAt(target);
    }
    step(1 / 60, v.pose);
    renderer.render(scene, camera);
    return true;
  },
  ready: true,
};
