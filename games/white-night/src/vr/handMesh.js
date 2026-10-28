// handMesh.js — анатомическая двухзвенная 3D-рука (плечо -> локтевой сустав ->
// предплечье в рукаве пальто -> запястье с ремешком -> сводчатая кисть с тенаром
// и трёхфаланговыми пальцами) для VR-режима «Рука-браслет» в «Белой ночи».
//
// Поддерживает ПРАВУЮ ('right') и ЛЕВУЮ ('left') руку честным зеркалированием
// координат (det = +1, без отрицательных масштабов и вывернутых нормалей),
// а также живую физическую инерцию пальцев и кисти от вектора скорости vel.

import * as THREE from 'three';

export function createGlovedHand(initialSide = 'right') {
  const root = new THREE.Group();
  root.name = 'vr-gloved-hand';
  root.visible = false;

  // Материалы в петербургской вечерней палитре «Белой ночи»
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0x917860,
    emissive: 0x241b13,
    emissiveIntensity: 0.50,
    roughness: 0.70,
    metalness: 0.05,
  });
  const palmInnerMat = new THREE.MeshStandardMaterial({
    color: 0x68523f,
    emissive: 0x18110b,
    emissiveIntensity: 0.42,
    roughness: 0.84,
    metalness: 0.04,
  });
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0xad947a,
    emissive: 0x2b2118,
    emissiveIntensity: 0.46,
    roughness: 0.65,
    metalness: 0.06,
  });
  const cuffKnitMat = new THREE.MeshStandardMaterial({
    color: 0x2d3945,
    emissive: 0x0b1016,
    emissiveIntensity: 0.45,
    roughness: 0.88,
    metalness: 0.03,
  });
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x1b242e,
    emissive: 0x070c12,
    emissiveIntensity: 0.42,
    roughness: 0.90,
    metalness: 0.03,
  });
  const sleeveFoldMat = new THREE.MeshStandardMaterial({
    color: 0x24303c,
    emissive: 0x091018,
    emissiveIntensity: 0.40,
    roughness: 0.86,
    metalness: 0.04,
  });
  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x3b2c22,
    emissive: 0x120c08,
    emissiveIntensity: 0.40,
    roughness: 0.62,
    metalness: 0.16,
  });
  const deviceCaseMat = new THREE.MeshStandardMaterial({
    color: 0x11161d,
    emissive: 0x04070a,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.35,
  });
  const pipBrassMat = new THREE.MeshStandardMaterial({
    color: 0xe3b878,
    emissive: 0x6e4819,
    emissiveIntensity: 0.55,
    roughness: 0.34,
    metalness: 0.58,
  });
  const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x00d957 });
  const ledMagentaMat = new THREE.MeshBasicMaterial({ color: 0xe00096 });

  // --- 1. Двухзвенный рукав пальто: Плечо -> Локтевой сгиб -> Предплечье ---
  const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.056, 10, 8), sleeveMat);
  root.add(shoulderCap);

  // В CylinderGeometry(radiusTop, radiusBottom, 1) ось +Y направлена вдоль вектора сегмента:
  // для плечевой кости (от локтя к плечу): top = плечо (0.056), bottom = локоть (0.045)
  const upperArmSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.056, 0.045, 1, 12, 1, false),
    sleeveMat
  );
  root.add(upperArmSleeve);

  // Мягкий сферический сустав локтя со складкой ткани, исключающий излом при любом угле сгиба!
  const elbowJointGroup = new THREE.Group();
  const elbowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 10), sleeveMat);
  elbowSphere.scale.set(0.96, 1.02, 1.05);
  elbowJointGroup.add(elbowSphere);
  const elbowCrease = new THREE.Mesh(new THREE.TorusGeometry(0.041, 0.006, 6, 14), sleeveFoldMat);
  elbowCrease.rotation.x = Math.PI * 0.45;
  elbowJointGroup.add(elbowCrease);
  root.add(elbowJointGroup);

  // Предплечье (от запястья к локтю): top = локоть (0.045), bottom = узкое овальное запястье (0.027)
  const forearmSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.027, 1, 12, 1, false),
    sleeveMat
  );
  root.add(forearmSleeve);

  // --- 2. Узел запястья и анатомической кисти ---
  const wristPivot = new THREE.Group();
  root.add(wristPivot);

  // Дополнительный узел физической инерции кисти (мягкий пружинный отклик сухожилий на ускорение)
  const inertiaPivot = new THREE.Group();
  wristPivot.add(inertiaPivot);

  const handBody = new THREE.Group();
  handBody.scale.setScalar(1.28);
  inertiaPivot.add(handBody);

  // Свод пясти (центральная часть + боковой скос мизинца — живая арка вместо плоского бруска)
  const palmCenter = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.024, 0.098), gloveMat);
  palmCenter.position.set(0, 0.004, -0.050);
  handBody.add(palmCenter);

  const palmUlnarSlope = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.021, 0.094), gloveMat);
  handBody.add(palmUlnarSlope);

  const palmRadialBridge = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.022, 0.082), gloveMat);
  handBody.add(palmRadialBridge);

  // Внутренняя кожаная сторона ладони + анатомическое возвышение большого пальца (тенар) и гипотенар
  const palmPad = new THREE.Mesh(new THREE.BoxGeometry(0.080, 0.011, 0.088), palmInnerMat);
  palmPad.position.set(0, -0.010, -0.049);
  handBody.add(palmPad);

  const thenarPad = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), palmInnerMat);
  thenarPad.scale.set(0.85, 0.62, 1.35);
  handBody.add(thenarPad);

  const hypothenarPad = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 7), palmInnerMat);
  hypothenarPad.scale.set(0.72, 0.58, 1.45);
  handBody.add(hypothenarPad);

  // Три рельефных шва на тыльной стороне замшевой перчатки (слегка расходятся веером к костяшкам)
  const dorsalStitches = [-1, 0, 1].map((idx) => {
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.0038, 0.0042, 0.068), seamMat);
    handBody.add(st);
    return { mesh: st, idx };
  });

  // Четыре трёхфаланговых пальца (указательный, средний, безымянный, мизинец)
  // baseX задан для ПРАВОЙ руки (указательный -X, мизинец +X); для левой умножается на sideSign = -1
  const baseFingerSpecs = [
    { baseX: -0.032, yOff:  0.001, zOff: -0.097, l1: 0.034, l2: 0.023, l3: 0.017, w: 0.0175, splay: -0.065 },
    { baseX: -0.010, yOff:  0.004, zOff: -0.101, l1: 0.038, l2: 0.026, l3: 0.018, w: 0.0185, splay: -0.015 },
    { baseX:  0.012, yOff:  0.002, zOff: -0.097, l1: 0.035, l2: 0.024, l3: 0.017, w: 0.0175, splay:  0.032 },
    { baseX:  0.032, yOff: -0.003, zOff: -0.090, l1: 0.028, l2: 0.019, l3: 0.015, w: 0.0155, splay:  0.085 },
  ];

  const fingers = baseFingerSpecs.map((spec) => {
    const mcp = new THREE.Group(); // пястно-фаланговый сустав (костяшка)
    const knuckleBall = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.52, 8, 6), gloveMat);
    mcp.add(knuckleBall);

    const p1 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.45, spec.w * 0.51, spec.l1, 8),
      gloveMat
    );
    p1.rotation.x = Math.PI * 0.5;
    p1.position.set(0, 0, -spec.l1 * 0.5);
    mcp.add(p1);

    const pip = new THREE.Group(); // средний межфаланговый сустав
    pip.position.set(0, 0, -spec.l1);
    pip.add(new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.44, 8, 6), gloveMat));

    const p2 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.39, spec.w * 0.44, spec.l2, 8),
      gloveMat
    );
    p2.rotation.x = Math.PI * 0.5;
    p2.position.set(0, 0, -spec.l2 * 0.5);
    pip.add(p2);

    const dip = new THREE.Group(); // ногтевой межфаланговый сустав
    dip.position.set(0, 0, -spec.l2);
    dip.add(new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.38, 8, 6), gloveMat));

    const p3 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.33, spec.w * 0.38, spec.l3, 8),
      gloveMat
    );
    p3.rotation.x = Math.PI * 0.5;
    p3.position.set(0, 0, -spec.l3 * 0.5);
    dip.add(p3);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.35, 8, 6), seamMat);
    tip.scale.set(1, 0.88, 1.08);
    tip.position.set(0, -0.0008, -spec.l3);
    dip.add(tip);

    pip.add(dip);
    mcp.add(pip);
    handBody.add(mcp);
    return { spec, mcp, pip, dip };
  });

  // Трёхсуставный противопоставляемый большой палец (CMC -> MCP -> IP)
  const thumbCmc = new THREE.Group();
  const thumbMeta = new THREE.Mesh(new THREE.CylinderGeometry(0.0115, 0.014, 0.032, 8), gloveMat);
  thumbMeta.rotation.x = Math.PI * 0.5;
  thumbMeta.position.set(0, 0, -0.016);
  thumbCmc.add(thumbMeta);

  const thumbMcp = new THREE.Group();
  thumbMcp.position.set(0, 0, -0.032);
  thumbMcp.add(new THREE.Mesh(new THREE.SphereGeometry(0.0112, 8, 6), gloveMat));
  const thumbProx = new THREE.Mesh(new THREE.CylinderGeometry(0.0098, 0.0112, 0.026, 8), gloveMat);
  thumbProx.rotation.x = Math.PI * 0.5;
  thumbProx.position.set(0, 0, -0.013);
  thumbMcp.add(thumbProx);

  const thumbIp = new THREE.Group();
  thumbIp.position.set(0, 0, -0.026);
  thumbIp.add(new THREE.Mesh(new THREE.SphereGeometry(0.0095, 8, 6), gloveMat));
  const thumbDist = new THREE.Mesh(new THREE.CylinderGeometry(0.0082, 0.0095, 0.021, 8), gloveMat);
  thumbDist.rotation.x = Math.PI * 0.5;
  thumbDist.position.set(0, 0, -0.0105);
  thumbIp.add(thumbDist);
  const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.0086, 8, 6), seamMat);
  thumbTip.position.set(0, -0.0008, -0.021);
  thumbIp.add(thumbTip);

  thumbMcp.add(thumbIp);
  thumbCmc.add(thumbMcp);
  handBody.add(thumbCmc);

  // Овальная вязаная манжета, ремешок с латунной заклёпкой и мини-силуэт браслета с 2 огоньками
  const knitCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.045, 0.038, 12), cuffKnitMat);
  knitCuff.rotation.x = Math.PI * 0.5;
  knitCuff.scale.set(1.02, 1, 0.46);
  knitCuff.position.set(0, 0, 0.016);
  handBody.add(knitCuff);

  const coatCuffRim = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.050, 0.024, 12), sleeveFoldMat);
  coatCuffRim.rotation.x = Math.PI * 0.5;
  coatCuffRim.scale.set(1.05, 1, 0.52);
  coatCuffRim.position.set(0, 0, 0.034);
  handBody.add(coatCuffRim);

  const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.047, 0.021, 12), strapMat);
  strap.rotation.x = Math.PI * 0.5;
  strap.scale.set(1.04, 1, 0.48);
  strap.position.set(0, 0, 0.004);
  handBody.add(strap);

  const miniWristband = new THREE.Group();
  const miniScreen = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.005, 0.020), deviceCaseMat);
  miniWristband.add(miniScreen);
  const dotG = new THREE.Mesh(new THREE.SphereGeometry(0.0024, 6, 5), ledGreenMat);
  dotG.position.set(-0.009, 0.0028, 0);
  miniWristband.add(dotG);
  const dotM = new THREE.Mesh(new THREE.SphereGeometry(0.0024, 6, 5), ledMagentaMat);
  dotM.position.set(0.009, 0.0028, 0);
  miniWristband.add(dotM);
  handBody.add(miniWristband);

  const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.0066, 8, 6), pipBrassMat);
  handBody.add(rivet);

  let currentSide = null;
  let curl = 0.30;
  let splayFactor = 0.65;
  let rummagePhase = 0;
  let lagPitch = 0;
  let lagYaw = 0;
  let breathPhase = 0;

  function applyHandSide(side) {
    const clean = side === 'left' ? 'left' : 'right';
    if (clean === currentSide) return;
    currentSide = clean;
    const s = clean === 'left' ? -1 : 1; // +1 правая, -1 левая

    // Анатомический полуоборот 3/4 к глазам игрока (строго зеркальный для левой и правой руки)
    handBody.rotation.set(0.32, s * 0.13, s * 0.26);

    palmUlnarSlope.position.set(s * 0.029, 0.000, -0.048);
    palmUlnarSlope.rotation.z = -s * 0.16;

    palmRadialBridge.position.set(-s * 0.028, 0.001, -0.045);
    palmRadialBridge.rotation.z = s * 0.10;

    thenarPad.position.set(-s * 0.026, -0.012, -0.032);
    thenarPad.rotation.y = s * 0.28;

    hypothenarPad.position.set(s * 0.028, -0.011, -0.042);

    for (const { mesh: st, idx } of dorsalStitches) {
      st.position.set(s * idx * 0.019, 0.0165, -0.048);
      st.rotation.y = -s * idx * 0.045;
    }

    for (const f of fingers) {
      f.mcp.position.set(s * f.spec.baseX, f.spec.yOff, f.spec.zOff);
    }

    thumbCmc.position.set(-s * 0.044, -0.005, -0.028);
    thumbCmc.rotation.set(0.10, s * 0.62, -s * 0.25);

    miniWristband.position.set(-s * 0.006, 0.022, 0.004);
    miniWristband.rotation.z = s * 0.08;
    dotG.position.x = -s * 0.009;
    dotM.position.x = s * 0.009;

    rivet.position.set(s * 0.028, 0.018, 0.004);
  }

  function setFingerPose(curlAmt, splayAmt, wave = 0, inertiaFlex = 0) {
    const s = currentSide === 'left' ? -1 : 1;
    for (let i = 0; i < fingers.length; i++) {
      const f = fingers[i];
      const ripple = wave * Math.sin(rummagePhase + i * 0.9) * 0.17;
      // Градиент сгиба: мизинец и безымянный в покое согнуты чуть мягче указательного (анатомический каскад!)
      const cascade = i * 0.045;
      const c = THREE.MathUtils.clamp(curlAmt + cascade + ripple + inertiaFlex, 0.03, 1.35);

      f.mcp.rotation.x = -c * 0.56;
      f.pip.rotation.x = -c * 0.78;
      f.dip.rotation.x = -c * 0.52;
      // При раскрытии ладони пальцы слегка расходятся веером, а при сжатии сходятся к центру ладони
      f.mcp.rotation.y = -s * f.spec.splay * splayAmt;
    }

    const tc = THREE.MathUtils.clamp(curlAmt * 0.85 + inertiaFlex * 0.5, 0.02, 1.15);
    thumbCmc.rotation.x = 0.10 - tc * 0.28;
    thumbCmc.rotation.y = s * (0.62 - tc * 0.24);
    thumbMcp.rotation.x = -tc * 0.44;
    thumbIp.rotation.x = -tc * 0.52;
  }

  applyHandSide(initialSide);
  setFingerPose(curl, splayFactor, 0, 0);

  const vShoulder = new THREE.Vector3();
  const vElbow = new THREE.Vector3();
  const vWrist = new THREE.Vector3();
  const vCuffEnd = new THREE.Vector3();
  const segVec = new THREE.Vector3();
  const upAxis = new THREE.Vector3(0, 1, 0);

  return {
    group: root,
    wristPivot,
    setHandSide: applyHandSide,
    getHandSide: () => currentSide,
    update(dt, {
      visible = false,
      handSide = currentSide,
      shoulderPos = null,
      elbowPos = null,
      pos = { x: 0.16, y: -0.22, z: -0.50 },
      vel = { x: 0, y: 0, z: 0 },
      qArm = [0, 0, 0, 1],
      reach = 0.25,
      elbowBendDeg = 60,
      overBin = false,
      phase = 'search',
      calmLowerProgress = 0,
      beaconActive = false,
    } = {}) {
      root.visible = visible;
      if (!visible) return;

      const safeDt = Math.min(0.1, dt || 1 / 60);
      applyHandSide(handSide);
      const s = currentSide === 'left' ? -1 : 1;

      // Лёгкое живое микро-дыхание кисти в тишине двора (~0.7 мм)
      breathPhase += safeDt * 1.6;
      const breathY = Math.sin(breathPhase) * 0.0007;

      vWrist.set(pos.x, pos.y + breathY, pos.z);
      if (shoulderPos) {
        vShoulder.set(shoulderPos.x, shoulderPos.y, shoulderPos.z);
      } else {
        vShoulder.set(s * 0.21, -0.27, -0.08);
      }
      if (elbowPos) {
        vElbow.set(elbowPos.x, elbowPos.y + breathY * 0.5, elbowPos.z);
      } else {
        vElbow.set(s * 0.24, -0.44, -0.26);
      }

      wristPivot.position.copy(vWrist);
      wristPivot.quaternion.set(qArm[0], qArm[1], qArm[2], qArm[3]);

      // Вторичная физическая инерция кисти и пальцев от скорости предплечья vel:
      // при резком подъёме вверх кисть чуть отстаёт вниз, при опускании — мягко приподнимается
      const targetLagPitch = THREE.MathUtils.clamp(-vel.y * 0.085, -0.16, 0.16);
      const targetLagYaw = THREE.MathUtils.clamp(vel.x * 0.075, -0.14, 0.14);
      const lagAlpha = 1 - Math.exp(-safeDt * 16);
      lagPitch += (targetLagPitch - lagPitch) * lagAlpha;
      lagYaw += (targetLagYaw - lagYaw) * lagAlpha;
      inertiaPivot.rotation.set(lagPitch, lagYaw, 0);

      // 1) Плечевой сегмент рукава: от локтя (vElbow) к плечу (vShoulder)
      shoulderCap.position.copy(vShoulder);
      segVec.copy(vShoulder).sub(vElbow);
      const upperLen = Math.max(0.08, segVec.length());
      upperArmSleeve.position.copy(vElbow).addScaledVector(segVec, 0.5);
      upperArmSleeve.scale.set(0.96, upperLen, 0.92);
      upperArmSleeve.quaternion.setFromUnitVectors(upAxis, segVec.normalize());

      // 2) Локтевой сустав со складкой на сгибе
      elbowJointGroup.position.copy(vElbow);
      elbowJointGroup.quaternion.copy(upperArmSleeve.quaternion);
      const creaseScale = 0.92 + THREE.MathUtils.clamp(elbowBendDeg / 120, 0, 1) * 0.18;
      elbowCrease.scale.setScalar(creaseScale);

      // 3) Предплечье: от манжеты запястья (чуть позади кисти) к локтевому суставу (vElbow)
      vCuffEnd.set(0, -0.004, 0.044)
        .applyQuaternion(inertiaPivot.quaternion)
        .applyQuaternion(wristPivot.quaternion)
        .add(vWrist);
      segVec.copy(vElbow).sub(vCuffEnd);
      const foreLen = Math.max(0.08, segVec.length());
      forearmSleeve.position.copy(vCuffEnd).addScaledVector(segVec, 0.5);
      forearmSleeve.scale.set(1.0, foreLen, 0.80);
      forearmSleeve.quaternion.setFromUnitVectors(upAxis, segVec.normalize());

      // 4) Анатомическая моторика пальцев (поиск / осмотр / опускание вниз / подъём вверх)
      let targetCurl = 0.30;
      let targetSplay = 0.60;
      let wave = 0;

      if (phase === 'search') {
        if (reach >= 0.58 && overBin) {
          // Рука тянется в бак — ладонь раскрыта, пальцы веером и живо перебирают находки
          targetCurl = 0.14;
          targetSplay = 1.05;
          wave = 1;
          rummagePhase += safeDt * 9.5;
        } else if (pos.y < -0.34) {
          // Опущенная вниз расслабленная рука — естественный мягкий полусгиб отдыха
          targetCurl = 0.48;
          targetSplay = 0.35;
        } else if (pos.y > 0.10) {
          // Рука поднята вверх к небу — раскрытая живая кисть
          targetCurl = 0.18;
          targetSplay = 0.92;
        } else {
          targetCurl = 0.34;
          targetSplay = 0.55;
        }
      } else if (phase === 'inspect') {
        // При спокойном опускании руки пальцы мягко и плотно смыкаются вокруг находки
        targetCurl = 0.20 + calmLowerProgress * 0.86;
        targetSplay = (1 - calmLowerProgress) * 0.80 + 0.15;
      }

      const poseAlpha = 1 - Math.exp(-safeDt * 13);
      curl += (targetCurl - curl) * poseAlpha;
      splayFactor += (targetSplay - splayFactor) * poseAlpha;
      setFingerPose(curl, splayFactor, wave, lagPitch * 0.9);

      // Диегетический отклик латунной заклёпки и огоньков ремешка
      if (calmLowerProgress > 0.05) {
        pipBrassMat.emissive.setHex(0x88c470);
        pipBrassMat.emissiveIntensity = 0.6 + calmLowerProgress * 0.95;
      } else if (beaconActive) {
        pipBrassMat.emissive.setHex(0x6ca888);
        pipBrassMat.emissiveIntensity = 0.58;
      } else {
        pipBrassMat.emissive.setHex(0x6e4819);
        pipBrassMat.emissiveIntensity = 0.45;
      }
      ledGreenMat.color.setHex(beaconActive ? 0x00ff66 : 0x1e6b3d);
      ledMagentaMat.color.setHex(beaconActive ? 0xff00aa : 0x6b1e52);
    },
    dispose() {
      shoulderCap.geometry.dispose();
      upperArmSleeve.geometry.dispose();
      elbowSphere.geometry.dispose();
      elbowCrease.geometry.dispose();
      forearmSleeve.geometry.dispose();
      palmCenter.geometry.dispose();
      palmUlnarSlope.geometry.dispose();
      palmRadialBridge.geometry.dispose();
      palmPad.geometry.dispose();
      thenarPad.geometry.dispose();
      hypothenarPad.geometry.dispose();
      knitCuff.geometry.dispose();
      coatCuffRim.geometry.dispose();
      strap.geometry.dispose();
      miniScreen.geometry.dispose();
      rivet.geometry.dispose();
      gloveMat.dispose();
      palmInnerMat.dispose();
      seamMat.dispose();
      cuffKnitMat.dispose();
      sleeveMat.dispose();
      sleeveFoldMat.dispose();
      strapMat.dispose();
      deviceCaseMat.dispose();
      pipBrassMat.dispose();
      ledGreenMat.dispose();
      ledMagentaMat.dispose();
    },
  };
}
