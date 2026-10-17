import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Синий кит                                                          */
/* ------------------------------------------------------------------ */

export interface WhaleRig {
  group: THREE.Group;
  tail: THREE.Group;
  pectorals: THREE.Object3D[];
}

export function buildWhale(skin: THREE.Texture): WhaleRig {
  const group = new THREE.Group();
  group.name = "whale";

  const profile = [
    [0.03, -9.9],
    [0.25, -9.2],
    [0.5, -8.2],
    [0.86, -6.8],
    [1.35, -5.2],
    [1.92, -3.2],
    [2.33, -1.0],
    [2.52, 1.2],
    [2.48, 3.1],
    [2.25, 4.9],
    [1.78, 6.4],
    [1.16, 7.6],
    [0.55, 8.55],
    [0.05, 8.95],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const bodyGeo = new THREE.LatheGeometry(profile, 56);
  bodyGeo.rotateX(Math.PI / 2);
  bodyGeo.scale(0.95, 1.2, 1.06);
  bodyGeo.computeVertexNormals();

  // Контршейдинг: тёмная спина, светлый живот. Вершинные цвета умножаются
  // на процедурную кожу.
  const pos = bodyGeo.attributes.position as THREE.BufferAttribute;
  const color = new Float32Array(pos.count * 3);
  const dark = new THREE.Color("#35505c");
  const mid = new THREE.Color("#557682");
  const belly = new THREE.Color("#c3d4d3");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = THREE.MathUtils.smoothstep(y, -1.8, 1.9);
    c.copy(belly).lerp(mid, THREE.MathUtils.smoothstep(t, 0, 0.55)).lerp(dark, THREE.MathUtils.smoothstep(t, 0.5, 1));
    color[i * 3] = c.r;
    color[i * 3 + 1] = c.g;
    color[i * 3 + 2] = c.b;
  }
  bodyGeo.setAttribute("color", new THREE.BufferAttribute(color, 3));

  const skinMat = new THREE.MeshPhysicalMaterial({
    map: skin,
    vertexColors: true,
    roughness: 0.62,
    metalness: 0.04,
    clearcoat: 0.4,
    clearcoatRoughness: 0.4,
    color: "#ffffff",
    emissive: new THREE.Color("#0a2029"),
    emissiveIntensity: 0.08,
  });
  const body = new THREE.Mesh(bodyGeo, skinMat);
  body.castShadow = true;
  body.receiveShadow = false;
  group.add(body);

  // Нижняя челюсть — характерный широкий «ковш» синего кита.
  const jawMat = new THREE.MeshStandardMaterial({ color: "#879ea4", roughness: 0.66 });
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 18), jawMat);
  jaw.scale.set(1.5, 0.4, 2.2);
  jaw.position.set(0, -1.18, 6.2);
  group.add(jaw);

  // Борозды горла рисуются текстурой кожи, а не отдельными трубками:
  // в силуэте отдельная геометрия читалась как «молния» на брюхе.

  // Длинные грудные плавники.
  const pectorals: THREE.Object3D[] = [];
  const finMat = new THREE.MeshPhysicalMaterial({
    color: "#b9cacd",
    roughness: 0.5,
    side: THREE.DoubleSide,
    clearcoat: 0.1,
  });
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.quadraticCurveTo(0.9, 0.62, 4.3, 0.24);
  finShape.quadraticCurveTo(5.1, 0.02, 4.3, -0.34);
  finShape.quadraticCurveTo(2.3, -0.64, 0, -0.7);
  finShape.closePath();
  for (const side of [-1, 1]) {
    const geo = new THREE.ExtrudeGeometry(finShape, { depth: 0.09, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 });
    geo.scale(side, 1, 1);
    const pivot = new THREE.Group();
    pivot.position.set(side * 1.95, -1.12, 3.35);
    pivot.rotation.y = side * 0.32;
    pivot.rotation.z = side * 0.72;
    const fin = new THREE.Mesh(geo, finMat);
    fin.rotation.x = Math.PI / 2;
    pivot.add(fin);
    group.add(pivot);
    pectorals.push(pivot);
  }

  // Спинной плавник.
  const dorsal = new THREE.Mesh(
    new THREE.ConeGeometry(0.46, 1.05, 5, 1),
    new THREE.MeshStandardMaterial({ color: "#8ba6ae", roughness: 0.7 })
  );
  dorsal.scale.set(0.66, 0.72, 0.6);
  dorsal.position.set(0, 2.2, -5.05);
  dorsal.rotation.x = -0.9;
  group.add(dorsal);

  // Хвост на отдельном шарнире: горизонтальная лопасть, собранная из
  // профиля, а не из треугольной «иглы». Читается как хвост кита даже
  // в силуэте и анимируется одним вращением.
  const tail = new THREE.Group();
  tail.position.z = -9.45;
  tail.name = "tail";
  const flukeShape = new THREE.Shape();
  flukeShape.moveTo(0, 0.1);
  flukeShape.quadraticCurveTo(-2.0, 0.64, -5.0, 0.1);
  flukeShape.quadraticCurveTo(-3.2, -0.18, -1.0, -0.5);
  flukeShape.quadraticCurveTo(-0.35, -0.62, 0, -0.34);
  flukeShape.quadraticCurveTo(0.35, -0.62, 1.0, -0.5);
  flukeShape.quadraticCurveTo(3.2, -0.18, 5.0, 0.1);
  flukeShape.quadraticCurveTo(2.0, 0.64, 0, 0.1);
  const flukesGeo = new THREE.ExtrudeGeometry(flukeShape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    bevelSegments: 2,
  });
  flukesGeo.rotateX(-Math.PI / 2);
  flukesGeo.scale(1.1, 1.05, 0.9);
  const flukes = new THREE.Mesh(flukesGeo, finMat);
  flukes.castShadow = true;
  tail.add(flukes);
  group.add(tail);

  // Глаза и светлые бляшки вокруг них (как у настоящего полосатика).
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 10),
      new THREE.MeshPhysicalMaterial({ color: "#091514", roughness: 0.12, clearcoat: 1 })
    );
    eye.position.set(side * 1.77, 0.08, 6.35);
    group.add(eye);
    const patch = new THREE.Mesh(
      new THREE.CircleGeometry(0.31, 18),
      new THREE.MeshStandardMaterial({ color: "#c6d6d3", roughness: 0.6, side: THREE.DoubleSide })
    );
    patch.position.set(side * 1.85, 0.08, 6.25);
    patch.rotation.y = side * 1.25;
    group.add(patch);
  }

  // Линия рта: у кита она идёт от глаза к кончику челюсти.
  const mouthMat = new THREE.MeshStandardMaterial({ color: "#1d333c", roughness: 0.8 });
  const mouthCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.62, -0.35, 6.3),
    new THREE.Vector3(-1.1, -0.85, 7.5),
    new THREE.Vector3(0, -1.05, 8.6),
    new THREE.Vector3(1.1, -0.85, 7.5),
    new THREE.Vector3(1.62, -0.35, 6.3),
  ]);
  const mouth = new THREE.Mesh(new THREE.TubeGeometry(mouthCurve, 22, 0.04, 4, false), mouthMat);
  group.add(mouth);

  group.userData.rig = { group, tail, pectorals } satisfies WhaleRig;
  return { group, tail, pectorals };
}

/* ------------------------------------------------------------------ */
/*  Зелёная черепаха                                                   */
/* ------------------------------------------------------------------ */

export interface TurtleRig {
  group: THREE.Group;
  flippers: THREE.Object3D[];
  head: THREE.Object3D;
}

export function buildTurtle(shellTexture: THREE.Texture): TurtleRig {
  const group = new THREE.Group();
  group.name = "turtle";
  const skinMat = new THREE.MeshStandardMaterial({ color: "#5f7f5b", roughness: 0.72 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: "#c9c59a", roughness: 0.66 });
  const shellMat = new THREE.MeshPhysicalMaterial({
    map: shellTexture,
    color: "#d9ddc2",
    roughness: 0.48,
    clearcoat: 0.35,
    clearcoatRoughness: 0.45,
  });

  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), shellMat);
  shell.scale.set(0.82, 0.33, 1.16);
  shell.castShadow = true;
  group.add(shell);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), bellyMat);
  belly.scale.set(0.74, 0.2, 1.06);
  belly.position.y = -0.14;
  group.add(belly);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.09, 6, 32), skinMat);
  rim.rotation.x = Math.PI / 2;
  rim.scale.set(0.78, 1.08, 0.34);
  rim.position.y = -0.02;
  group.add(rim);

  const head = new THREE.Group();
  head.position.set(0, 0.04, 1.08);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 0.42, 12), skinMat);
  neck.rotation.x = Math.PI / 2;
  neck.position.z = 0.1;
  head.add(neck);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.29, 18, 14), skinMat);
  skull.scale.set(0.88, 0.8, 1.22);
  skull.position.z = 0.32;
  head.add(skull);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 10), new THREE.MeshStandardMaterial({ color: "#c3b49a", roughness: 0.6 }));
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, -0.03, 0.64);
  head.add(beak);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), new THREE.MeshStandardMaterial({ color: "#0a1210", roughness: 0.2 }));
    eye.position.set(side * 0.18, 0.09, 0.5);
    head.add(eye);
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.08, 10), new THREE.MeshStandardMaterial({ color: "#d5c998", roughness: 0.5, side: THREE.DoubleSide }));
    patch.position.set(side * 0.2, 0.09, 0.47);
    patch.rotation.y = side * 1.2;
    head.add(patch);
  }
  group.add(head);

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.quadraticCurveTo(0.5, 0.3, 1.22, 0.12);
  finShape.quadraticCurveTo(1.42, -0.06, 1.05, -0.34);
  finShape.quadraticCurveTo(0.45, -0.34, 0, -0.28);
  finShape.closePath();
  const flippers: THREE.Object3D[] = [];
  for (const [side, z, scale, rear] of [
    [-1, 0.55, 0.85, false],
    [1, 0.55, 0.85, false],
    [-1, -0.65, 0.48, true],
    [1, -0.65, 0.48, true],
  ] as [number, number, number, boolean][]) {
    const geo = new THREE.ExtrudeGeometry(finShape, { depth: 0.07, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 });
    geo.scale(side * scale, scale, 1);
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.58, -0.13, z);
    pivot.rotation.y = side * (rear ? 2.4 : 0.3);
    const fin = new THREE.Mesh(geo, skinMat);
    fin.rotation.x = Math.PI / 2;
    fin.rotation.z = rear ? side * 0.35 : side * 0.15;
    fin.castShadow = true;
    pivot.add(fin);
    group.add(pivot);
    flippers.push(pivot);
  }
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.36, 8), skinMat);
  tail.rotation.x = -Math.PI / 2;
  tail.position.set(0, -0.08, -1.2);
  group.add(tail);

  group.scale.setScalar(1.25);
  return { group, flippers, head };
}

/* ------------------------------------------------------------------ */
/*  Манта                                                              */
/* ------------------------------------------------------------------ */

export interface MantaRig {
  group: THREE.Group;
  wings: THREE.Object3D[];
}

export function buildManta(): MantaRig {
  const group = new THREE.Group();
  group.name = "manta";
  const topMat = new THREE.MeshPhysicalMaterial({
    color: "#46616d",
    roughness: 0.52,
    metalness: 0.04,
    clearcoat: 0.35,
    emissive: new THREE.Color("#0a1e26"),
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
  });
  const bellyMat = new THREE.MeshStandardMaterial({
    color: "#dde7e3",
    roughness: 0.62,
    side: THREE.DoubleSide,
    emissive: new THREE.Color("#5c7473"),
    emissiveIntensity: 0.2,
  });

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.3);
  wingShape.quadraticCurveTo(1.7, 0.66, 4.1, 0.1);
  wingShape.quadraticCurveTo(3.6, -0.7, 2.55, -1.2);
  wingShape.quadraticCurveTo(1.2, -1.15, 0.1, -0.5);
  wingShape.closePath();
  const wingGeo = new THREE.ShapeGeometry(wingShape, 20);
  wingGeo.rotateX(-Math.PI / 2);

  const wings: THREE.Object3D[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(0, 0, 0);
    const wing = new THREE.Mesh(wingGeo, topMat);
    if (side < 0) wing.scale.x = -1;
    wing.position.x = side * 0.15;
    pivot.add(wing);
    const underside = new THREE.Mesh(wingGeo, bellyMat);
    if (side < 0) underside.scale.x = -1;
    underside.position.set(side * 0.15, -0.035, 0);
    pivot.add(underside);
    group.add(pivot);
    wings.push(pivot);
  }

  const bodyGeo = new THREE.SphereGeometry(1, 22, 14);
  bodyGeo.scale(0.62, 0.18, 1.7);
  const body = new THREE.Mesh(bodyGeo, topMat);
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 12), topMat);
  head.scale.set(1.2, 0.26, 0.9);
  head.position.z = 1.3;
  head.position.y = 0.02;
  group.add(head);

  // Цефалические плавники.
  for (const side of [-1, 1]) {
    const paddle = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.6, 8), topMat);
    paddle.rotation.x = Math.PI / 2;
    paddle.rotation.z = side * 0.3;
    paddle.position.set(side * 0.38, -0.03, 1.95);
    group.add(paddle);
  }

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: "#051012" }));
    eye.position.set(side * 0.5, 0.05, 1.72);
    group.add(eye);
  }

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.05, 2.4, 5), topMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.z = -2.4;
  group.add(tail);

  // Светлые пятна на спине.
  const spots = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const spot = new THREE.Mesh(
      new THREE.CircleGeometry(0.06 + (i % 3) * 0.025, 8),
      new THREE.MeshBasicMaterial({ color: "#cfe4e2", transparent: true, opacity: 0.55 })
    );
    spot.rotation.x = -Math.PI / 2;
    spot.position.set((i % 4) * 0.28 - 0.42, 0.19, Math.floor(i / 4) * 0.36 - 0.7);
    spots.add(spot);
  }
  group.add(spots);
  group.userData.spots = spots;

  group.scale.setScalar(0.62);
  return { group, wings };
}

/* ------------------------------------------------------------------ */
/*  Медуза                                                            */
/* ------------------------------------------------------------------ */

export function buildJellyfish(): THREE.Group {
  const group = new THREE.Group();
  const bellMat = new THREE.MeshPhysicalMaterial({
    color: "#c7b8e8",
    transmission: 0,
    transparent: true,
    opacity: 0.32,
    roughness: 0.22,
    clearcoat: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), bellMat);
  bell.scale.y = 0.62;
  group.add(bell);
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), bellMat);
  inner.position.y = -0.02;
  group.add(inner);
  const tentacleMat = new THREE.MeshBasicMaterial({
    color: "#d9cdf2",
    transparent: true,
    opacity: 0.4,
  });
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const points = [
      new THREE.Vector3(Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4),
      new THREE.Vector3(Math.cos(angle) * 0.55, -0.6, Math.sin(angle) * 0.55),
      new THREE.Vector3(Math.cos(angle + 0.4) * 0.4, -1.3, Math.sin(angle + 0.4) * 0.4),
      new THREE.Vector3(Math.cos(angle) * 0.55, -2.1, Math.sin(angle) * 0.55),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.014, 4, false), tentacleMat);
    group.add(tube);
  }
  group.userData.bell = bell;
  return group;
}

/* ------------------------------------------------------------------ */
/*  Мелкие анимации                                                   */
/* ------------------------------------------------------------------ */

export function animateWhale(rig: WhaleRig, time: number) {
  rig.tail.rotation.x = Math.sin(time * 0.85) * 0.14;
  rig.group.rotation.z = Math.sin(time * 0.23) * 0.035;
  rig.group.rotation.x = Math.sin(time * 0.31 + 1) * 0.02;
  rig.pectorals.forEach((fin, index) => {
    fin.rotation.z = (index === 0 ? 1 : -1) * (0.34 + Math.sin(time * 0.4 + index) * 0.06);
  });
}

export function animateTurtle(rig: TurtleRig, time: number, speed = 1) {
  rig.flippers.forEach((pivot, index) => {
    const phase = index < 2 ? time * 1.35 * speed : time * 1.35 * speed + 1.8;
    pivot.rotation.x = Math.sin(phase) * (index < 2 ? 0.42 : 0.26);
  });
  rig.head.rotation.y = Math.sin(time * 0.24) * 0.16;
  rig.group.rotation.z = Math.sin(time * 0.6) * 0.04;
}

export function animateManta(rig: MantaRig, time: number) {
  rig.wings.forEach((wing, index) => {
    const side = index === 0 ? -1 : 1;
    wing.rotation.z = side * Math.sin(time * 0.72) * 0.13;
    wing.rotation.y = side * Math.sin(time * 0.72 + 0.4) * 0.035;
  });
}
