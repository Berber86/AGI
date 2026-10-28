// handMesh.js — диегетическая 3D-рука от первого лица (тёплая замшевая
// перчатка + рукав пальто, уходящий к правому плечу за край кадра)
// для VR-режима «Рука-браслет» в «Белой ночи».

import * as THREE from 'three';

export function createGlovedHand() {
  const root = new THREE.Group();
  root.name = 'vr-gloved-hand';
  root.visible = false;

  // Запястье: вращается по 60 Гц кватерниону qArm
  const wristPivot = new THREE.Group();
  root.add(wristPivot);

  // Тёплая потёртая замша/кожа — контрастно читается на холодной синей брусчатке двора
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0x8d755e,
    emissive: 0x241b13,
    emissiveIntensity: 0.52,
    roughness: 0.72,
    metalness: 0.05,
  });
  const palmInnerMat = new THREE.MeshStandardMaterial({
    color: 0x6e5946,
    emissive: 0x19120c,
    emissiveIntensity: 0.42,
    roughness: 0.82,
    metalness: 0.04,
  });
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0xa89077,
    emissive: 0x2b2118,
    emissiveIntensity: 0.45,
    roughness: 0.68,
    metalness: 0.06,
  });
  const cuffKnitMat = new THREE.MeshStandardMaterial({
    color: 0x2f3b46,
    emissive: 0x0b1016,
    emissiveIntensity: 0.45,
    roughness: 0.88,
    metalness: 0.03,
  });
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x1e2731,
    emissive: 0x080d13,
    emissiveIntensity: 0.4,
    roughness: 0.9,
    metalness: 0.03,
  });
  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x3b2c22,
    emissive: 0x120c08,
    emissiveIntensity: 0.4,
    roughness: 0.62,
    metalness: 0.16,
  });
  const pipMat = new THREE.MeshStandardMaterial({
    color: 0xe3b878,
    emissive: 0x6e4819,
    emissiveIntensity: 0.55,
    roughness: 0.34,
    metalness: 0.58,
  });

  // Естественный анатомический полуоборот кисти от первого лица:
  // тыльная сторона замшевой перчатки с тремя швами и всеми четырьмя пальцами
  // развёрнута в выразительный 3/4-ракурс к глазам игрока, а не узким ребром!
  const handBody = new THREE.Group();
  handBody.rotation.set(0.36, 0.14, 0.28);
  handBody.scale.setScalar(1.32);
  wristPivot.add(handBody);

  // Ладонь (тыльная сторона сверху + мягкая подушечка снизу)
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.092, 0.026, 0.102), gloveMat);
  palm.position.set(0, 0.002, -0.052);
  handBody.add(palm);

  const palmPad = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.012, 0.092), palmInnerMat);
  palmPad.position.set(0, -0.012, -0.050);
  handBody.add(palmPad);

  // Три характерных шва на тыльной стороне классической петербургской перчатки
  for (const sx of [-0.020, 0, 0.020]) {
    const stitch = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.004, 0.068), seamMat);
    stitch.position.set(sx, 0.016, -0.048);
    handBody.add(stitch);
  }

  // Четыре двухфаланговых пальца
  const fingerSpecs = [
    { x: -0.033, len1: 0.046, len2: 0.035, w: 0.0185 },
    { x: -0.011, len1: 0.052, len2: 0.038, w: 0.0195 },
    { x:  0.011, len1: 0.048, len2: 0.036, w: 0.0185 },
    { x:  0.033, len1: 0.039, len2: 0.029, w: 0.0165 },
  ];

  const fingers = [];
  for (const spec of fingerSpecs) {
    const knuckle = new THREE.Group();
    knuckle.position.set(spec.x, 0.003, -0.101);

    const kJoint = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.50, 8, 6), gloveMat);
    knuckle.add(kJoint);

    const phalanx1 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.45, spec.w * 0.51, spec.len1, 8),
      gloveMat
    );
    phalanx1.rotation.x = Math.PI * 0.5;
    phalanx1.position.set(0, 0, -spec.len1 * 0.5);
    knuckle.add(phalanx1);

    const midJoint = new THREE.Group();
    midJoint.position.set(0, 0, -spec.len1);

    const mSphere = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.43, 8, 6), gloveMat);
    midJoint.add(mSphere);

    const phalanx2 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.38, spec.w * 0.44, spec.len2, 8),
      gloveMat
    );
    phalanx2.rotation.x = Math.PI * 0.5;
    phalanx2.position.set(0, 0, -spec.len2 * 0.5);
    midJoint.add(phalanx2);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.40, 8, 6), seamMat);
    tip.position.set(0, 0, -spec.len2);
    midJoint.add(tip);

    knuckle.add(midJoint);
    handBody.add(knuckle);
    fingers.push({ knuckle, midJoint });
  }

  // Большой палец (слева-внутрь для правой руки)
  const thumbBase = new THREE.Group();
  thumbBase.position.set(-0.048, -0.002, -0.038);
  thumbBase.rotation.y = 0.56;
  const thumb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.042, 8), gloveMat);
  thumb1.rotation.x = Math.PI * 0.5;
  thumb1.position.set(0, 0, -0.021);
  thumbBase.add(thumb1);

  const thumbDistal = new THREE.Group();
  thumbDistal.position.set(0, 0, -0.042);
  const thumb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.0095, 0.011, 0.030, 8), gloveMat);
  thumb2.rotation.x = Math.PI * 0.5;
  thumb2.position.set(0, 0, -0.015);
  thumbDistal.add(thumb2);
  const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.0095, 8, 6), seamMat);
  thumbTip.position.set(0, 0, -0.030);
  thumbDistal.add(thumbTip);
  thumbBase.add(thumbDistal);
  handBody.add(thumbBase);

  // Плоская овальная манжета по форме живого запястья (не круглая «труба»!)
  const knitCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.046, 0.036, 12), cuffKnitMat);
  knitCuff.rotation.x = Math.PI * 0.5;
  knitCuff.scale.set(1.02, 1, 0.44);
  knitCuff.position.set(0, 0, 0.014);
  handBody.add(knitCuff);

  const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.048, 0.020, 12), strapMat);
  strap.rotation.x = Math.PI * 0.5;
  strap.scale.set(1.04, 1, 0.46);
  strap.position.set(0, 0, 0.005);
  handBody.add(strap);

  const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), pipMat);
  rivet.position.set(-0.008, 0.024, 0.005);
  handBody.add(rivet);

  const forearmSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.050, 0.024, 1, 12, 1, false),
    sleeveMat
  );
  root.add(forearmSleeve);

  const shoulderInCam = new THREE.Vector3(0.34, -0.46, 0.12);
  const wristWorldLocal = new THREE.Vector3();
  const sleeveVec = new THREE.Vector3();
  const upAxis = new THREE.Vector3(0, 1, 0);

  let curl = 0.32;
  let rummagePhase = 0;

  function setFingerCurl(amount, wave = 0) {
    for (let i = 0; i < fingers.length; i++) {
      const f = fingers[i];
      const ripple = wave * Math.sin(rummagePhase + i * 0.85) * 0.16;
      const c = THREE.MathUtils.clamp(amount + ripple + i * 0.03, 0.04, 1.25);
      f.knuckle.rotation.x = -c * 0.68;
      f.midJoint.rotation.x = -c * 0.84;
    }
    thumbBase.rotation.x = -amount * 0.34;
    thumbBase.rotation.z = -amount * 0.22;
    thumbDistal.rotation.x = -amount * 0.45;
  }

  setFingerCurl(curl, 0);

  return {
    group: root,
    wristPivot,
    update(dt, {
      visible = false,
      pos = { x: 0.19, y: -0.25, z: -0.52 },
      qArm = [0, 0, 0, 1],
      reach = 0.25,
      overBin = false,
      phase = 'search',
      calmLowerProgress = 0,
      beaconActive = false,
    } = {}) {
      root.visible = visible;
      if (!visible) return;

      root.position.set(pos.x, pos.y, pos.z);
      wristPivot.quaternion.set(qArm[0], qArm[1], qArm[2], qArm[3]);

      // Соединяем запястье (0,0,0 в root) с точкой правого плеча (shoulderInCam - root.position),
      // чтобы рукав пальто естественно уходил за нижний правый край обзора очков!
      wristWorldLocal.set(0, -0.008, 0.038).applyQuaternion(wristPivot.quaternion);
      sleeveVec.copy(shoulderInCam).sub(root.position).sub(wristWorldLocal);
      const len = Math.max(0.18, sleeveVec.length());
      forearmSleeve.position.copy(wristWorldLocal).addScaledVector(sleeveVec, 0.5);
      forearmSleeve.scale.set(1, len, 0.86);
      forearmSleeve.quaternion.setFromUnitVectors(upAxis, sleeveVec.normalize());

      let targetCurl = 0.34;
      let wave = 0;
      if (phase === 'search') {
        if (reach >= 0.60 && overBin) {
          targetCurl = 0.14;
          wave = 1;
          rummagePhase += (dt || 1 / 60) * 9.5;
        } else {
          targetCurl = 0.38;
        }
      } else if (phase === 'inspect') {
        targetCurl = 0.20 + calmLowerProgress * 0.82;
      }

      curl += (targetCurl - curl) * Math.min(1, (dt || 1 / 60) * 12);
      setFingerCurl(curl, wave);

      if (calmLowerProgress > 0.05) {
        pipMat.emissive.setHex(0x88c470);
        pipMat.emissiveIntensity = 0.6 + calmLowerProgress * 0.9;
      } else if (beaconActive) {
        pipMat.emissive.setHex(0x6ca888);
        pipMat.emissiveIntensity = 0.58;
      } else {
        pipMat.emissive.setHex(0x6e4819);
        pipMat.emissiveIntensity = 0.45;
      }
    },
    dispose() {
      palm.geometry.dispose();
      palmPad.geometry.dispose();
      knitCuff.geometry.dispose();
      strap.geometry.dispose();
      rivet.geometry.dispose();
      forearmSleeve.geometry.dispose();
      gloveMat.dispose();
      palmInnerMat.dispose();
      seamMat.dispose();
      cuffKnitMat.dispose();
      sleeveMat.dispose();
      strapMat.dispose();
      pipMat.dispose();
    },
  };
}
