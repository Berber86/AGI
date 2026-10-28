// handMesh.js — скульптурная двухзвенная 3D-рука (плечо -> локтевой сустав ->
// предплечье в пальто с обшлагом -> соосный ремешок-браслет -> органическая
// сводчатая кисть с тенаром и трёхфаланговыми пальцами) для «Белой ночи».
//
// Исправлены анатомические условности:
//   - Никакой «грибовидной» ступеньки на манжете: плавный конус рукава пальто
//     (плечо 5.5 см -> локоть 4.7 см -> обшлаг 4.0 см -> вязаная резинка 3.5 см -> кисть).
//   - Ремешок с мини-браслетом сидит соосно кости предплечья (не изламывается при сгибе кисти),
//     но честно вращается при супинации/пронации предплечья.
//   - Убран искусственный излом запястья +18°: при повороте реальной руки ладонью вверх
//     виртуальная кисть ровно и анатомично раскрывает кожаную ладонь и возвышение большого пальца.
//   - Пясть вылеплена гладкой сводчатой поверхностью без острых углов коробки.
//   - Честное зеркалирование правой ('right') и левой ('left') руки с det = +1.

import * as THREE from 'three';

/**
 * Лепит органическую сводчатую форму пясти (тыльная арка + сужение к запястью +
 * мягкое расширение к костяшкам пальцев) без острых рёбер BoxGeometry.
 */
function buildSculptedPalmGeometry() {
  const geo = new THREE.SphereGeometry(1, 18, 14);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i);
    const ny = pos.getY(i);
    const nz = pos.getZ(i);

    // Скруглённый суперквадрик (мягкий прямоугольный профиль без острых углов)
    const sx = Math.sign(nx) * Math.pow(Math.abs(nx), 0.76);
    const sy = Math.sign(ny) * Math.pow(Math.abs(ny), 0.84);
    const sz = Math.sign(nz) * Math.pow(Math.abs(nz), 0.78);

    // Продольная координата u вдоль ладони: 0 у запястья (z ~ 0), 1 у костяшек (z ~ -0.10)
    const u = THREE.MathUtils.clamp((-sz + 1) * 0.5, 0, 1);
    // Ладонь чуть уже у запястья (3.4 см полуширина) и расширяется к костяшкам (4.4 см)
    const halfW = 0.034 + u * 0.011 - Math.pow(u - 0.82, 2) * 0.008;
    // Толщина ладони: плотнее у основания и плавно тоньше к основаниям пальцев
    const halfH = 0.0155 - u * 0.0028;

    let x = sx * halfW;
    let y = sy * halfH;
    const z = -0.049 + sz * 0.052;

    // Поперечный анатомический свод пясти (тыльная сторона выпуклая аркой, ладонная — с ложбинкой)
    const arch = (1 - nx * nx) * 0.0048;
    y += arch;
    if (ny < 0) {
      y += (1 - nx * nx) * (1 - Math.abs(nz)) * 0.0022;
    }

    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createGlovedHand(initialSide = 'right') {
  const root = new THREE.Group();
  root.name = 'vr-gloved-hand';
  root.visible = false;

  // Материалы в вечерней палитре «Белой ночи»
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0x927961,
    emissive: 0x241b13,
    emissiveIntensity: 0.48,
    roughness: 0.72,
    metalness: 0.05,
  });
  const palmInnerMat = new THREE.MeshStandardMaterial({
    color: 0x644e3b,
    emissive: 0x17100a,
    emissiveIntensity: 0.42,
    roughness: 0.85,
    metalness: 0.04,
  });
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0xaf967c,
    emissive: 0x2a2017,
    emissiveIntensity: 0.45,
    roughness: 0.66,
    metalness: 0.06,
  });
  const cuffKnitMat = new THREE.MeshStandardMaterial({
    color: 0x283440,
    emissive: 0x090e14,
    emissiveIntensity: 0.42,
    roughness: 0.89,
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
    color: 0x232f3b,
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

  // --- 1. Плечо + Локоть + Рукав предплечья ---
  const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), sleeveMat);
  root.add(shoulderCap);

  // Плечевая кость (от локтя к плечу): top = плечо (0.055), bottom = локоть (0.046)
  const upperArmSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.046, 1, 12, 1, false),
    sleeveMat
  );
  root.add(upperArmSleeve);

  const elbowJointGroup = new THREE.Group();
  const elbowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 10), sleeveMat);
  elbowSphere.scale.set(0.96, 1.02, 1.04);
  elbowJointGroup.add(elbowSphere);
  const elbowCrease = new THREE.Mesh(new THREE.TorusGeometry(0.041, 0.0055, 6, 14), sleeveFoldMat);
  elbowCrease.rotation.x = Math.PI * 0.45;
  elbowJointGroup.add(elbowCrease);
  root.add(elbowJointGroup);

  // Предплечье в пальто (от обшлага у запястья к локтю): плавный естественный конус 0.046 -> 0.039
  const forearmSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.046, 0.039, 1, 14, 1, false),
    sleeveMat
  );
  root.add(forearmSleeve);

  // --- 2. Дистальный обшлаг пальто + вязаная манжета + ремешок с браслетом ---
  // Они сидят СООСНО предплечью (чтобы обшлаг никогда не торчал «грибом» вбок при сгибе кисти!),
  // но поворачиваются вокруг продольной оси предплечья вместе с супинацией/пронацией руки.
  const forearmCuffGroup = new THREE.Group();
  root.add(forearmCuffGroup);

  const coatCuffHem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0405, 0.0415, 0.026, 14),
    sleeveFoldMat
  );
  coatCuffHem.rotation.x = Math.PI * 0.5;
  coatCuffHem.scale.set(1.0, 1.0, 0.78);
  coatCuffHem.position.set(0, 0, 0.030);
  forearmCuffGroup.add(coatCuffHem);

  const knitCuff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0355, 0.0375, 0.030, 14),
    cuffKnitMat
  );
  knitCuff.rotation.x = Math.PI * 0.5;
  knitCuff.scale.set(1.0, 1.0, 0.74);
  knitCuff.position.set(0, 0, 0.013);
  forearmCuffGroup.add(knitCuff);

  const strap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0368, 0.0375, 0.018, 14),
    strapMat
  );
  strap.rotation.x = Math.PI * 0.5;
  strap.scale.set(1.02, 1.0, 0.75);
  strap.position.set(0, 0, 0.012);
  forearmCuffGroup.add(strap);

  const miniWristband = new THREE.Group();
  const miniScreen = new THREE.Mesh(new THREE.BoxGeometry(0.031, 0.0045, 0.017), deviceCaseMat);
  miniWristband.add(miniScreen);
  const dotG = new THREE.Mesh(new THREE.SphereGeometry(0.0022, 6, 5), ledGreenMat);
  dotG.position.set(0, 0.0026, -0.0042);
  miniWristband.add(dotG);
  const dotM = new THREE.Mesh(new THREE.SphereGeometry(0.0022, 6, 5), ledMagentaMat);
  dotM.position.set(0, 0.0026, 0.0042);
  miniWristband.add(dotM);
  forearmCuffGroup.add(miniWristband);

  const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.0056, 8, 6), pipBrassMat);
  forearmCuffGroup.add(rivet);

  // --- 3. Лучезапястный сустав и скульптурная кисть ---
  const wristPivot = new THREE.Group();
  root.add(wristPivot);

  const inertiaPivot = new THREE.Group();
  wristPivot.add(inertiaPivot);

  const handBody = new THREE.Group();
  handBody.scale.setScalar(1.16);
  inertiaPivot.add(handBody);

  // Мягкая шейка перчатки внутри вязаной манжеты (исключает любую щель при сильном сгибе кисти)
  const wristBridge = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), gloveMat);
  wristBridge.scale.set(1.05, 0.68, 0.95);
  wristBridge.position.set(0, 0, 0.002);
  handBody.add(wristBridge);

  // Скульптурная сводчатая пясть
  const sculptedPalmGeo = buildSculptedPalmGeometry();
  const palmMesh = new THREE.Mesh(sculptedPalmGeo, gloveMat);
  handBody.add(palmMesh);

  // Кожаная накладка внутренней стороны ладони + тенар (мышца большого пальца) + гипотенар
  const palmPad = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), palmInnerMat);
  palmPad.scale.set(1.02, 0.25, 1.12);
  palmPad.position.set(0, -0.0095, -0.048);
  handBody.add(palmPad);

  const thenarPad = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 8), palmInnerMat);
  thenarPad.scale.set(0.84, 0.64, 1.38);
  handBody.add(thenarPad);

  const hypothenarPad = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 7), palmInnerMat);
  hypothenarPad.scale.set(0.70, 0.56, 1.45);
  handBody.add(hypothenarPad);

  // Три тонких рельефных шва на тыльной стороне замшевой перчатки (по дуге свода пясти)
  const dorsalStitches = [-1, 0, 1].map((idx) => {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.0017, 0.0019, 0.062, 6), seamMat);
    st.rotation.x = Math.PI * 0.5;
    handBody.add(st);
    return { mesh: st, idx };
  });

  // Четыре трёхфаланговых пальца с плавным конусом фаланг без щелей у основания
  const baseFingerSpecs = [
    { baseX: -0.031, yOff:  0.0015, zOff: -0.094, l1: 0.035, l2: 0.023, l3: 0.016, w: 0.0190, splay: -0.058 },
    { baseX: -0.010, yOff:  0.0035, zOff: -0.098, l1: 0.039, l2: 0.026, l3: 0.017, w: 0.0198, splay: -0.012 },
    { baseX:  0.011, yOff:  0.0020, zOff: -0.095, l1: 0.036, l2: 0.024, l3: 0.016, w: 0.0188, splay:  0.028 },
    { baseX:  0.030, yOff: -0.0020, zOff: -0.088, l1: 0.029, l2: 0.019, l3: 0.015, w: 0.0168, splay:  0.075 },
  ];

  const fingers = baseFingerSpecs.map((spec) => {
    const mcp = new THREE.Group();
    const knuckleBall = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.53, 8, 7), gloveMat);
    knuckleBall.scale.set(1.04, 0.88, 1.05);
    mcp.add(knuckleBall);

    // CylinderGeometry(top, bottom, len) при rotation.x = +PI/2 направляет +Y в +Z (к ладони),
    // поэтому top = толстое основание у костяшки, bottom = сужение к следующему суставу!
    const p1 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.52, spec.w * 0.45, spec.l1, 9),
      gloveMat
    );
    p1.rotation.x = Math.PI * 0.5;
    p1.position.set(0, 0, -spec.l1 * 0.5);
    mcp.add(p1);

    const pip = new THREE.Group();
    pip.position.set(0, 0, -spec.l1);
    pip.add(new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.45, 8, 6), gloveMat));

    const p2 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.45, spec.w * 0.39, spec.l2, 9),
      gloveMat
    );
    p2.rotation.x = Math.PI * 0.5;
    p2.position.set(0, 0, -spec.l2 * 0.5);
    pip.add(p2);

    const dip = new THREE.Group();
    dip.position.set(0, 0, -spec.l2);
    dip.add(new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.39, 8, 6), gloveMat));

    const p3 = new THREE.Mesh(
      new THREE.CylinderGeometry(spec.w * 0.39, spec.w * 0.32, spec.l3, 9),
      gloveMat
    );
    p3.rotation.x = Math.PI * 0.5;
    p3.position.set(0, 0, -spec.l3 * 0.5);
    dip.add(p3);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(spec.w * 0.33, 8, 6), seamMat);
    tip.scale.set(1.0, 0.86, 1.12);
    tip.position.set(0, -0.0006, -spec.l3);
    dip.add(tip);

    pip.add(dip);
    mcp.add(pip);
    handBody.add(mcp);
    return { spec, mcp, pip, dip };
  });

  // Трёхсуставный противопоставляемый большой палец с плавным конусом от тенара к подушечке
  const thumbCmc = new THREE.Group();
  thumbCmc.add(new THREE.Mesh(new THREE.SphereGeometry(0.0155, 8, 7), gloveMat));
  const thumbMeta = new THREE.Mesh(new THREE.CylinderGeometry(0.0150, 0.0122, 0.032, 9), gloveMat);
  thumbMeta.rotation.x = Math.PI * 0.5;
  thumbMeta.position.set(0, 0, -0.016);
  thumbCmc.add(thumbMeta);

  const thumbMcp = new THREE.Group();
  thumbMcp.position.set(0, 0, -0.032);
  thumbMcp.add(new THREE.Mesh(new THREE.SphereGeometry(0.0122, 8, 6), gloveMat));
  const thumbProx = new THREE.Mesh(new THREE.CylinderGeometry(0.0120, 0.0102, 0.026, 9), gloveMat);
  thumbProx.rotation.x = Math.PI * 0.5;
  thumbProx.position.set(0, 0, -0.013);
  thumbMcp.add(thumbProx);

  const thumbIp = new THREE.Group();
  thumbIp.position.set(0, 0, -0.026);
  thumbIp.add(new THREE.Mesh(new THREE.SphereGeometry(0.0102, 8, 6), gloveMat));
  const thumbDist = new THREE.Mesh(new THREE.CylinderGeometry(0.0100, 0.0084, 0.020, 9), gloveMat);
  thumbDist.rotation.x = Math.PI * 0.5;
  thumbDist.position.set(0, 0, -0.010);
  thumbIp.add(thumbDist);
  const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.0086, 8, 6), seamMat);
  thumbTip.scale.set(1.0, 0.85, 1.12);
  thumbTip.position.set(0, -0.0006, -0.020);
  thumbIp.add(thumbTip);

  thumbMcp.add(thumbIp);
  thumbCmc.add(thumbMcp);
  handBody.add(thumbCmc);

  let currentSide = null;
  let curl = 0.30;
  let splayFactor = 0.60;
  let rummagePhase = 0;
  let lagPitch = 0;
  let lagYaw = 0;
  let breathPhase = 0;

  function applyHandSide(side) {
    const clean = side === 'left' ? 'left' : 'right';
    if (clean === currentSide) return;
    currentSide = clean;
    const s = clean === 'left' ? -1 : 1; // +1 правая, -1 левая

    // Естественная нейтральная полусупинация (~14° вокруг продольной оси) БЕЗ фальшивого излома X:
    // при повороте реальной руки ладонью вверх (roll = 180°) кисть остаётся прямой и показывает ладонь!
    handBody.rotation.set(0.05, s * 0.06, s * 0.24);

    thenarPad.position.set(-s * 0.024, -0.011, -0.032);
    thenarPad.rotation.y = s * 0.28;

    hypothenarPad.position.set(s * 0.027, -0.010, -0.043);

    for (const { mesh: st, idx } of dorsalStitches) {
      const archDrop = idx === 0 ? 0.0195 : 0.0178;
      st.position.set(s * idx * 0.016, archDrop, -0.049);
      st.rotation.y = -s * idx * 0.042;
    }

    for (const f of fingers) {
      f.mcp.position.set(s * f.spec.baseX, f.spec.yOff, f.spec.zOff);
    }

    thumbCmc.position.set(-s * 0.039, -0.005, -0.028);
    thumbCmc.rotation.set(0.08, s * 0.58, -s * 0.24);

    miniWristband.position.set(-s * 0.005, 0.0285, 0.012);
    miniWristband.rotation.z = s * 0.12;

    rivet.position.set(s * 0.027, 0.021, 0.012);
  }

  function setFingerPose(curlAmt, splayAmt, wave = 0, inertiaFlex = 0) {
    const s = currentSide === 'left' ? -1 : 1;
    for (let i = 0; i < fingers.length; i++) {
      const f = fingers[i];
      const ripple = wave * Math.sin(rummagePhase + i * 0.9) * 0.16;
      const cascade = i * 0.048;
      const c = THREE.MathUtils.clamp(curlAmt + cascade + ripple + inertiaFlex, 0.03, 1.35);

      f.mcp.rotation.x = -c * 0.56;
      f.pip.rotation.x = -c * 0.78;
      f.dip.rotation.x = -c * 0.52;
      f.mcp.rotation.y = -s * f.spec.splay * splayAmt;
    }

    const tc = THREE.MathUtils.clamp(curlAmt * 0.85 + inertiaFlex * 0.5, 0.02, 1.15);
    thumbCmc.rotation.x = 0.08 - tc * 0.28;
    thumbCmc.rotation.y = s * (0.58 - tc * 0.24);
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
  const forearmForward = new THREE.Vector3();
  const wristUp = new THREE.Vector3();
  const wristRight = new THREE.Vector3();
  const cuffX = new THREE.Vector3();
  const cuffY = new THREE.Vector3();
  const cuffZ = new THREE.Vector3();
  const sleeveY = new THREE.Vector3();
  const sleeveZ = new THREE.Vector3();
  const cuffBasisMat = new THREE.Matrix4();
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

      const targetLagPitch = THREE.MathUtils.clamp(-vel.y * 0.08, -0.15, 0.15);
      const targetLagYaw = THREE.MathUtils.clamp(vel.x * 0.07, -0.13, 0.13);
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

      // 2) Локтевой сустав
      elbowJointGroup.position.copy(vElbow);
      elbowJointGroup.quaternion.copy(upperArmSleeve.quaternion);
      const creaseScale = 0.92 + THREE.MathUtils.clamp(elbowBendDeg / 120, 0, 1) * 0.16;
      elbowCrease.scale.setScalar(creaseScale);

      // 3) Ориентация обшлага и ремешка-браслета: ось Z строго вдоль кости предплечья (vElbow - vWrist),
      // а верхняя сторона (+Y) берёт продольную супинацию/пронацию от qArm без излома сгиба кисти!
      forearmForward.copy(vWrist).sub(vElbow);
      const fullForeLen = Math.max(0.10, forearmForward.length());
      forearmForward.divideScalar(fullForeLen); // единичный вектор от локтя к кисти
      cuffZ.copy(forearmForward).negate();      // +Z обшлага смотрит к локтю (как у кисти)

      wristUp.set(0, 1, 0).applyQuaternion(wristPivot.quaternion);
      cuffY.copy(wristUp).addScaledVector(cuffZ, -wristUp.dot(cuffZ));
      if (cuffY.lengthSq() < 1e-4) {
        // При 90° сгибе кисти wristUp параллелен cuffZ; ортогональный ему wristRight
        // математически гарантированно перпендикулярен cuffZ (||r_perp||^2 >= 0.9999 в SO(3))
        // даже при строго вертикальной руке (cuffZ = (0, ±1, 0)) и сохраняет супинацию!
        wristRight.set(1, 0, 0).applyQuaternion(wristPivot.quaternion);
        cuffX.copy(wristRight).addScaledVector(cuffZ, -wristRight.dot(cuffZ)).normalize();
        cuffY.crossVectors(cuffZ, cuffX).normalize();
      } else {
        cuffY.normalize();
        cuffX.crossVectors(cuffY, cuffZ).normalize();
        cuffY.crossVectors(cuffZ, cuffX).normalize();
      }
      cuffBasisMat.makeBasis(cuffX, cuffY, cuffZ);

      forearmCuffGroup.position.copy(vWrist);
      forearmCuffGroup.quaternion.setFromRotationMatrix(cuffBasisMat);

      // Трубка рукава предплечья стыкуется точно внутрь обшлага пальто (от z=+0.036 обшлага до локтя)
      vCuffEnd.copy(vWrist).addScaledVector(cuffZ, 0.036);
      segVec.copy(vElbow).sub(vCuffEnd);
      const sleeveLen = Math.max(0.06, segVec.length());
      forearmSleeve.position.copy(vCuffEnd).addScaledVector(segVec, 0.5);
      // Сохраняем ту же ориентацию скручивания предплечья у овального сечения рукава без GC-аллокаций
      sleeveY.copy(segVec).normalize();
      sleeveZ.crossVectors(cuffX, sleeveY).normalize();
      cuffBasisMat.makeBasis(cuffX, sleeveY, sleeveZ);
      forearmSleeve.quaternion.setFromRotationMatrix(cuffBasisMat);
      forearmSleeve.scale.set(1.0, sleeveLen, 0.78);

      // 4) Анатомическая моторика пальцев
      let targetCurl = 0.28;
      let targetSplay = 0.58;
      let wave = 0;

      if (phase === 'search') {
        if (reach >= 0.58 && overBin) {
          targetCurl = 0.14;
          targetSplay = 1.05;
          wave = 1;
          rummagePhase += safeDt * 9.5;
        } else if (pos.y < -0.34) {
          targetCurl = 0.48;
          targetSplay = 0.32;
        } else if (pos.y > 0.10) {
          targetCurl = 0.18;
          targetSplay = 0.90;
        } else {
          targetCurl = 0.32;
          targetSplay = 0.52;
        }
      } else if (phase === 'inspect') {
        targetCurl = 0.20 + calmLowerProgress * 0.86;
        targetSplay = (1 - calmLowerProgress) * 0.78 + 0.15;
      }

      const poseAlpha = 1 - Math.exp(-safeDt * 13);
      curl += (targetCurl - curl) * poseAlpha;
      splayFactor += (targetSplay - splayFactor) * poseAlpha;
      setFingerPose(curl, splayFactor, wave, lagPitch * 0.85);

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
      coatCuffHem.geometry.dispose();
      knitCuff.geometry.dispose();
      strap.geometry.dispose();
      miniScreen.geometry.dispose();
      rivet.geometry.dispose();
      wristBridge.geometry.dispose();
      sculptedPalmGeo.dispose();
      palmPad.geometry.dispose();
      thenarPad.geometry.dispose();
      hypothenarPad.geometry.dispose();
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
