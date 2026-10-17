import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { CameraMarkerProvider, GazeSample } from "../lib/markerDriver";
import type { SpeciesId } from "../lib/species";
import {
  makeCoralSkinTexture,
  buildFish,
  makeAnemone,
  makeBrainCoral,
  makeBranchCoral,
  makeBubbleTexture,
  makeCausticTexture,
  makeCoralBumpTexture,
  makeFanCoral,
  makeKelpGeometry,
  makeRockGeometry,
  makeSandBumpTexture,
  makeSandTexture,
  makeSchoolFishGeometry,
  makeShellTexture,
  makeSoftCircleTexture,
  makeStarfishGeometry,
  makeTubeSponges,
  makeWhaleSkinTexture,
  mulberry32,
} from "./builders";
import { animateManta, animateTurtle, animateWhale, buildJellyfish, buildManta, buildTurtle, buildWhale, type MantaRig, type TurtleRig, type WhaleRig } from "./creatures";

export type GazeSource = "pointer" | "gyro" | "camera";
export type Quality = "high" | "balanced";
export type GazeStatus =
  | "pointer"
  | "gyro"
  | "gyro-wait"
  | "camera-valid"
  | "camera-single"
  | "camera-held"
  | "camera-lost"
  | "camera-off";

export interface TargetUpdate {
  id: SpeciesId | null;
  progress: number;
  discovered: boolean;
}

export type WorldEventType = "whale-near" | "whale-far" | "bubble" | "whale-pass";

export interface WorldCallbacks {
  onTarget: (target: TargetUpdate) => void;
  onHeading: (heading: number) => void;
  onDiscovery: (id: SpeciesId) => void;
  onEvent: (event: WorldEventType) => void;
  onStats: (stats: { fps: number; calls: number }) => void;
  onGazeStatus: (status: GazeStatus) => void;
}

export interface WorldSettings {
  interactive: boolean;
  source: GazeSource;
  vr: boolean;
  ipdCm: number;
  quality: Quality;
  reducedMotion: boolean;
}

interface Observable {
  id: SpeciesId;
  object: THREE.Object3D;
  threshold: number;
}

interface FishActor {
  group: THREE.Group;
  center: THREE.Vector3;
  rx: number;
  ry: number;
  rz: number;
  speed: number;
  phase: number;
  tail: THREE.Object3D;
  pectorals: THREE.Object3D[];
  id: SpeciesId;
  pitchPhase: number;
}

interface WhaleActor {
  rig: WhaleRig;
  path: THREE.CatmullRomCurve3;
  t: number;
  speed: number;
  side: number;
}

const BASE_POSITION = new THREE.Vector3(0, 2.15, 5.6);
// Горячие циклы не создают мусор: в VR GC-пауза выглядит как рывок стерео.
const tempNext = new THREE.Vector3();
const tempRight = new THREE.Vector3();
const tempPlayer = new THREE.Vector3();
const dummy = new THREE.Object3D();
const fishNext = new THREE.Vector3();

export class ReefWorld {
  private container: HTMLElement;
  private callbacks: WorldCallbacks;
  private provider: CameraMarkerProvider | null;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private settings: WorldSettings;
  private frame = 0;
  private disposed = false;
  private clock = new THREE.Clock();
  private lifeTime = 0;
  private targetYaw = 0;
  private targetPitch = 0;
  private yaw = 0;
  private pitch = 0;
  private pointerDrag = false;
  private lastPointer = { x: 0, y: 0 };
  private pointerSensitivity = 0.0031;
  private swayMaterials: THREE.Material[] = [];
  private waterMaterials: { uniform: { value: number } }[] = [];
  private causticTexture: THREE.CanvasTexture | null = null;
  private sandMap: THREE.CanvasTexture | null = null;
  private observables: Observable[] = [];
  private fishActors: FishActor[] = [];
  private turtleRig: TurtleRig | null = null;
  private turtleProgress = 0.22;
  private mantaRig: MantaRig | null = null;
  private whaleAdult: WhaleActor | null = null;
  private whaleCalf: WhaleActor | null = null;
  private whaleVisible = false;
  private whaleNotified = false;
  private jellyfish: THREE.Group[] = [];
  private currents: { obj: THREE.Object3D; axis: string; phase: number; amp: number }[] = [];
  private corals: THREE.Mesh[] = [];
  private schools: {
    mesh: THREE.InstancedMesh;
    center: THREE.Vector3;
    radius: number;
    phase: number;
    speed: number;
    particles: { phase: number; bob: number; ring: number; scale: number }[];
  }[] = [];
  private marineSnow: THREE.Points | null = null;
  private snowSpeeds: Float32Array | null = null;
  private bubbles: THREE.Points | null = null;
  private bubbleData: { speed: number; wobble: number; phase: number }[] = [];
  private discovered = new Set<SpeciesId>();
  private activeTarget: SpeciesId | null = null;
  private targetProgress = 0;
  private targetCallbackAt = 0;
  private headingCallbackAt = 0;
  private statsTimer = 0;
  private statsFrames = 0;
  private lastFps = 60;
  private gyroBase: { alpha: number; beta: number; gamma: number } | null = null;
  private gyroTarget = { yaw: 0, pitch: 0 };
  private gyroLastAt = 0;
  private gyroListening = false;
  private lastGazeStatus: GazeStatus = "pointer";
  private whaleSoundPlayed = false;
  private nextBubbleAt = 7;
  private raf = 0;
  private ro: ResizeObserver | null = null;
  private keyLight: THREE.DirectionalLight | null = null;
  private shafts: THREE.Mesh[] = [];
  private grassMeshes: THREE.Mesh[] = [];
  private lastFrameMs = 16.7;
  private shadowPassesPerPair = 1;
  private perfNotes = { renderMs: 0, cameraProcMs: 0, cameraQueue: 0, cameraTier: 0, stereo: false, dpr: 1 };

  constructor(
    container: HTMLElement,
    provider: CameraMarkerProvider | null,
    callbacks: WorldCallbacks,
    settings: WorldSettings
  ) {
    this.container = container;
    this.provider = provider;
    this.callbacks = callbacks;
    this.settings = { ...settings };

    this.renderer = new THREE.WebGLRenderer({
      // MSAA на контексте оплачивался бы каждым глазом в стерео. Вместо этого
      // сглаживание живёт только в composer-таргете обычного режима; VR-путь
      // рисует напрямую без лишних сэмплов. Это рекомендация из skill.
      antialias: false,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.03;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // info сбрасывается не на каждый глаз, а на кадр: иначе в стереопаре
    // счётчик показывает «1 draw call» и скрывает реальную стоимость пары.
    this.renderer.info.autoReset = false;
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.touchAction = "none";
    this.renderer.domElement.setAttribute("aria-label", "Подводный риф: осмотритесь, перетаскивая сцену");
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0e5a6b, 0.024);
    this.camera = new THREE.PerspectiveCamera(57, 1, 0.08, 190);
    this.camera.position.copy(BASE_POSITION);
    this.camera.rotation.order = "YXZ";

    this.buildScene();
    this.initComposer();
    this.applyRenderProfile();
    this.attachEvents();
    this.resize();

    this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------------------------------------------------------------- */
  /*  Scene construction                                               */
  /* ---------------------------------------------------------------- */

  private buildScene() {
    const scene = this.scene;
    const sunDirection = new THREE.Vector3(0.42, 1, 0.32).normalize();

    const hemi = new THREE.HemisphereLight(0xa9f0e3, 0x12343a, 1.25);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xe8fff9, 3.4);
    key.position.copy(sunDirection.clone().multiplyScalar(42));
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 4;
    key.shadow.camera.far = 100;
    key.shadow.camera.left = -30;
    key.shadow.camera.right = 30;
    key.shadow.camera.top = 32;
    key.shadow.camera.bottom = -26;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.025;
    scene.add(key);
    this.keyLight = key;
    const rim = new THREE.DirectionalLight(0x7fd8cf, 1.2);
    rim.position.set(-20, 24, -30);
    scene.add(rim);
    const whaleRim = new THREE.DirectionalLight(0xffe2b8, 1.6);
    whaleRim.position.set(-4, 8, 18);
    scene.add(whaleRim);
    const fill = new THREE.PointLight(0xffe6c4, 9, 22, 2.4);
    fill.position.set(2.4, 4.2, 2.5);
    scene.add(fill);

    // Мягкая дальняя среда: глубина переходит в свет сверху.
    const domeGeo = new THREE.SphereGeometry(115, 32, 18);
    const dome = new THREE.Mesh(
      domeGeo,
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {},
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vDir;
          void main() {
            float h = vDir.y;
            vec3 deep = vec3(0.008, 0.06, 0.095);
            vec3 mid = vec3(0.02, 0.2, 0.28);
            vec3 high = vec3(0.16, 0.46, 0.52);
            vec3 col = mix(deep, mid, smoothstep(-0.65, 0.18, h));
            col = mix(col, high, smoothstep(0.15, 0.92, h));
            vec3 sunDir = normalize(vec3(0.42, 0.86, 0.3));
            float glow = pow(max(dot(vDir, sunDir), 0.0), 16.0);
            col += vec3(0.45, 0.75, 0.66) * glow * 0.55;
            float streak = smoothstep(0.76, 0.99, h) * 0.03;
            gl_FragColor = vec4(col + streak, 1.0);
          }
        `,
      })
    );
    dome.renderOrder = -10;
    scene.add(dome);

    // Поверхность океана не рисуется огромной плоскостью: её роль играет
    // градиент купола. Плоскость при взгляде снизу давала жёсткую тёмную
    // полосу поперёк кадра.

    // Дно с дюнами и следами течения.
    const sandMap = makeSandTexture();
    const sandBump = makeSandBumpTexture();
    this.sandMap = sandMap;
    const floorGeo = new THREE.PlaneGeometry(150, 150, 64, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const pos = floorGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distance = Math.hypot(x, z);
      const dune =
        Math.sin(x * 0.17 + Math.cos(z * 0.11) * 2.2) * 0.24 +
        Math.cos(z * 0.13 + x * 0.06) * 0.2 +
        Math.sin(x * 0.42 + z * 0.31) * 0.07;
      const clearing = THREE.MathUtils.smoothstep(distance, 3.4, 10);
      pos.setY(i, -0.15 + dune * clearing + (distance > 18 ? Math.sin(x * 0.06) * 0.35 : 0));
    }
    floorGeo.computeVertexNormals();
    const floorMat = new THREE.MeshStandardMaterial({
      map: sandMap,
      bumpMap: sandBump,
      bumpScale: 0.28,
      color: 0xe0d5b9,
      roughness: 0.96,
      metalness: 0.01,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    scene.add(floor);

    this.causticTexture = makeCausticTexture();
    const causticFloor = new THREE.Mesh(
      floorGeo.clone(),
      new THREE.MeshBasicMaterial({
        map: this.causticTexture,
        transparent: true,
        opacity: 0.055,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: new THREE.Color(0x9fe8e2),
      })
    );
    causticFloor.position.y = 0.035;
    causticFloor.renderOrder = 1;
    scene.add(causticFloor);

    // Световые столбы.
    for (let i = 0; i < 7; i++) {
      const rand = mulberry32(90 + i);
      const width = 1.6 + rand() * 3.2;
      const shaft = new THREE.Mesh(
        new THREE.PlaneGeometry(width, 38),
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uSeed: { value: rand() * 10 },
            uOpacity: { value: 0.08 + rand() * 0.06 },
          },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
          fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform float uSeed;
            uniform float uOpacity;
            void main() {
              float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
              float fade = smoothstep(0.0, 0.16, vUv.y) * smoothstep(1.0, 0.52, vUv.y);
              float streak = 0.72 + 0.28 * sin(vUv.x * 7.0 + sin(vUv.y * 3.4 + uTime * 0.16 + uSeed) * 2.2 + uTime * 0.22);
              float flicker = 0.9 + 0.1 * sin(uTime * 0.38 + uSeed * 3.0);
              gl_FragColor = vec4(vec3(0.64, 0.98, 0.93), pow(edge, 1.4) * fade * streak * uOpacity * flicker);
            }
          `,
        })
      );
      const angle = rand() * Math.PI * 2;
      // Столбы света дальше от зрителя: ближняя плоскость иначе пересекает
      // кадр широкой полупрозрачной полосой.
      const radius = 15 + rand() * 20;
      shaft.position.set(Math.cos(angle) * radius, 14.2 + rand() * 3, Math.sin(angle) * radius - 8);
      shaft.rotation.z = (rand() - 0.5) * 0.32;
      shaft.rotation.y = rand() * Math.PI;
      shaft.renderOrder = 3;
      scene.add(shaft);
      this.shafts.push(shaft);
      const uniform = (shaft.material as THREE.ShaderMaterial).uniforms.uTime as { value: number };
      this.shaderShafts.push(uniform);
    }

    this.buildRocks();
    this.buildCorals();
    this.buildKelp();
    this.buildFish();
    this.buildWhale();
    this.buildTurtle();
    this.buildManta();
    this.buildSchools();
    this.buildJellyfish();
    this.buildParticles();
    this.buildBenthos();
    this.buildContactShadows();

    // Скалы-башни на горизонте — глубина без «пустого аквариума».
    const farRockMat = new THREE.MeshStandardMaterial({ color: 0x24505a, roughness: 1 });
    for (const [x, z, s, h] of [
      [-40, -46, 7, 1.5],
      [36, -52, 8, 1.2],
      [-16, -60, 10, 1.05],
      [20, 50, 9, 1.3],
      [-46, 30, 9, 1.1],
    ] as number[][]) {
      const rock = new THREE.Mesh(makeRockGeometry(Math.round(x + z), s), farRockMat);
      rock.scale.y = h;
      rock.position.set(x, -1.5, z);
      scene.add(rock);
    }

    this.scene.add(new THREE.AmbientLight(0x6aa7a5, 0.3));
  }

  private shaderShafts: { value: number }[] = [];

  private buildRocks() {
    const rand = mulberry32(203);
    const palette = [0x7b7c6e, 0x8a8577, 0x777b6c, 0x6c756c, 0x8d8575];
    const positions: [number, number, number][] = [
      [-5.6, -6.2, 1.7],
      [5.2, -7.5, 1.9],
      [-9.5, -12.6, 2.6],
      [9.6, -15.5, 2.8],
      [1.8, -19.5, 2.4],
      [-16.5, -7.2, 2.4],
      [15.8, -9.6, 2.5],
      [0.8, -26, 3.6],
      [12.2, 0.8, 2.2],
      [-13.8, 2.4, 2.5],
      [8.6, 9.8, 2.1],
      [-7.6, 11.5, 2],
      [2.2, 15.8, 2.8],
      [18.5, 8.5, 3.2],
      [-19.5, 8.8, 3.1],
      [-27, -12, 4.2],
      [24, -20, 4.6],
      [-4, 24, 3.5],
      [10, -30, 3.8],
      [-22, 17, 3.5],
    ];
    positions.forEach(([x, z, s], i) => {
      const material = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        vertexColors: true,
        map: this.sandMap,
        bumpMap: this.coralBump,
        bumpScale: 0.85,
        roughness: 0.98,
        metalness: 0.01,
      });
      const rock = new THREE.Mesh(makeRockGeometry(300 + i * 7, s), material);
      rock.position.set(x, -0.15 + rand() * 0.2, z);
      rock.rotation.y = rand() * Math.PI * 2;
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.scene.add(rock);
      if (i % 4 === 0) {
        const small = new THREE.Mesh(makeRockGeometry(517 + i, s * 0.4), material);
        small.position.set(x + 1.2 + rand(), -0.05, z + 0.8 + rand());
        small.rotation.set(rand(), rand() * 6, rand());
        small.castShadow = true;
        small.receiveShadow = true;
        this.scene.add(small);
      }
    });
  }

  private addCoralActor(
    type: "branch" | "fan" | "brain" | "sponge",
    x: number,
    z: number,
    scale: number,
    color: number,
    seed: number,
    rotation = 0
  ) {
    let geo: THREE.BufferGeometry;
    let material: THREE.MeshStandardMaterial;
    if (type === "branch") {
      geo = makeBranchCoral(seed);
      material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.68,
        metalness: 0.02,
        vertexColors: true,
        map: this.coralSkin,
        bumpMap: this.coralBump,
        bumpScale: 0.18,
        emissive: new THREE.Color(color).multiplyScalar(0.1),
      });
    } else if (type === "fan") {
      geo = makeFanCoral(seed);
      material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.02,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(color).multiplyScalar(0.18),
      });
    } else if (type === "brain") {
      geo = makeBrainCoral(seed);
      material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.82,
        metalness: 0.02,
        map: this.coralSkin,
        bumpMap: this.coralBump,
        bumpScale: 0.2,
        emissive: new THREE.Color(color).multiplyScalar(0.06),
      });
    } else {
      geo = makeTubeSponges(seed);
      material = new THREE.MeshStandardMaterial({
        color,
        map: this.coralSkin,
        roughness: 0.86,
        metalness: 0.01,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(color).multiplyScalar(0.08),
      });
    }
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = rotation;
    mesh.scale.setScalar(scale);
    mesh.castShadow = true;
    mesh.userData.coral = true;
    mesh.userData.bigCoral = scale >= 3;
    this.corals.push(mesh);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.currents.push({ obj: mesh, axis: "z", phase: seed * 0.7, amp: type === "fan" ? 0.035 : 0.012 });
    return mesh;
  }

  private addTableCoral(x: number, z: number, scale: number, color: number, seed: number) {
    const rand = mulberry32(seed * 17);
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.88,
      metalness: 0.01,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(color).multiplyScalar(0.09),
    });
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 1.1, 8), mat);
    stalk.position.y = 0.55;
    stalk.castShadow = true;
    group.add(stalk);
    for (let tier = 0; tier < 3; tier++) {
      const radius = (1.5 - tier * 0.34) * (0.85 + rand() * 0.25);
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.82, 0.09 + rand() * 0.05, 26, 1), mat);
      const pos = plate.geometry.attributes.position as THREE.BufferAttribute;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const angle = Math.atan2(v.z, v.x);
        v.y += Math.sin(angle * 5 + tier) * 0.045;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      plate.geometry.computeVertexNormals();
      plate.position.y = 0.95 + tier * 0.24;
      plate.rotation.y = tier * 0.6;
      plate.castShadow = true;
      plate.receiveShadow = true;
      group.add(plate);
    }
    group.scale.setScalar(scale);
    this.scene.add(group);
  }

  private coralBump: THREE.CanvasTexture | null = null;
  private coralSkin: THREE.CanvasTexture | null = null;

  private buildCorals() {
    this.coralBump = makeCoralBumpTexture();
    this.coralSkin = makeCoralSkinTexture();
    // Композиция: крупный веер слева, ветвистые кораллы справа — рамка кадра.
    this.addCoralActor("fan", -6.4, -3.4, 3.1, 0xc8747f, 31, 0.35);
    this.addCoralActor("branch", 6.4, -4.0, 2.0, 0xd8824f, 41, 0.8);
    this.addCoralActor("branch", -4.4, -6.2, 1.7, 0xe1905c, 47, 1.1);
    this.addCoralActor("sponge", 5.4, -5.2, 1.9, 0xd8844f, 12, 0);
    this.addCoralActor("fan", 3.2, -10.2, 2.5, 0xa77ab8, 53, 2.4);
    this.addCoralActor("brain", 7.2, -6.4, 1.5, 0xb96a52, 19, 0.2);
    this.addCoralActor("branch", -7.6, -6.4, 2.1, 0xd98a6d, 59, 1.9);
    this.addCoralActor("sponge", -6.6, -9.2, 2.0, 0xc98247, 67, 0.4);
    this.addCoralActor("fan", 8.6, -10.4, 3.0, 0xb06471, 71, 1.1);
    this.addCoralActor("brain", -8.4, -10.6, 1.9, 0xb87e5b, 81, 0.4);
    this.addTableCoral(-8.8, -8.2, 1.15, 0x9d8a60, 5);
    this.addTableCoral(11.2, -6.8, 0.9, 0xa57763, 9);
    this.addTableCoral(-4.8, -12.2, 1.35, 0x8f9a6c, 13);
    this.addCoralActor("fan", 6.2, -11.6, 1.5, 0x8164a0, 73, 2.1);
    this.addCoralActor("branch", -6.6, -11.5, 0.95, 0xb58a97, 87, 1.4);
    this.addCoralActor("brain", 1.8, -12.8, 1.3, 0xc9a772, 35, 0.9);
    this.addCoralActor("branch", 10.5, -12.5, 1.4, 0xa96cab, 104, 2.3);
    this.addCoralActor("fan", -12.4, -15.2, 1.9, 0xc47f9a, 132, 0.9);
    this.addCoralActor("sponge", -8.9, -18.2, 1.7, 0xc97845, 63, 0.5);
    this.addCoralActor("branch", 15.6, 1.0, 1.1, 0xb96b55, 151, 1.2);
    this.addCoralActor("fan", -12.8, 5.4, 1.6, 0x9478b3, 183, 2.7);
    this.addCoralActor("brain", 9.6, 9.2, 1.3, 0xd1a666, 74, 0.3);
    this.addCoralActor("branch", -6.8, 14.6, 1.3, 0xc08093, 201, 1.7);
    this.addCoralActor("fan", 14.4, 14.5, 1.9, 0xb17a88, 232, 2.2);
    this.addCoralActor("sponge", 4.8, 18.2, 1.6, 0xcf8a4e, 218, 0.6);
    this.addCoralActor("branch", 20.4, 6.4, 1.2, 0x947d89, 255, 2.1);
    this.addCoralActor("fan", -19.4, -6.6, 2.1, 0x8b6f9e, 265, 0.6);
    this.addCoralActor("branch", -2.6, -14.4, 1.5, 0xca725e, 289, 0.2);
    this.addCoralActor("fan", 1.8, -21.2, 3.0, 0x9f6678, 301, 1.7);
    this.addCoralActor("branch", -16.8, 13.5, 1.9, 0xba7255, 321, 0.1);
    this.addCoralActor("fan", 21.2, -5.8, 2.0, 0x93828f, 338, 2.8);

    // Актинии с клоунами.
    const anemonePositions = [
      { x: -2.9, z: -4.6, color: 0xd9a06d, seed: 3 },
      { x: 3.4, z: -6.4, color: 0xd8908a, seed: 9 },
      { x: -8.8, z: 3.4, color: 0xc2a874, seed: 15 },
      { x: 8.4, z: 5.3, color: 0xd69a82, seed: 27 },
    ];
    const soft = makeSoftCircleTexture();
    anemonePositions.forEach((entry) => {
      const { tentacles, tips } = makeAnemone(entry.seed);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        vertexColors: true,
        roughness: 0.45,
        metalness: 0.02,
        emissive: new THREE.Color("#8a4a58"),
        emissiveIntensity: 0.18,
      });
      void entry.color;
      const anemone = new THREE.Mesh(tentacles, material);
      anemone.position.set(entry.x, 0.02, entry.z);
      anemone.scale.setScalar(1.15);
      anemone.castShadow = true;
      this.scene.add(anemone);
      const tipGeo = new THREE.BufferGeometry();
      tipGeo.setAttribute("position", new THREE.BufferAttribute(tips, 3));
      const tipCloud = new THREE.Points(
        tipGeo,
        new THREE.PointsMaterial({
          color: new THREE.Color(0xffc8b6),
          size: 0.065,
          map: soft,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      tipCloud.scale.setScalar(1.15);
      tipCloud.position.copy(anemone.position);
      this.scene.add(tipCloud);
    });

    // Морские звёзды и мелкий бентос.
    const starMats = [0xe4774c, 0xd88f4b, 0x9d6c8e, 0xd9b06a];
    for (let i = 0; i < 7; i++) {
      const rand = mulberry32(i + 62);
      const star = new THREE.Mesh(
        makeStarfishGeometry(i + 4),
        new THREE.MeshStandardMaterial({ color: starMats[i % starMats.length], roughness: 0.78 })
      );
      star.position.set(-11 + rand() * 22, 0.015, -15 + rand() * 27);
      if (Math.abs(star.position.x) < 2.5 && Math.abs(star.position.z - 2.8) < 2.5) continue;
      star.rotation.set(0, rand() * Math.PI * 2, 0);
      star.scale.setScalar(0.5 + rand() * 0.7);
      star.castShadow = !this.settings.vr;
      this.scene.add(star);
    }
  }

  private buildKelp() {
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.68,
      metalness: 0.02,
      transparent: true,
      opacity: 0.98,
    });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;\nattribute float aPhase;")
        .replace(
          "#include <begin_vertex>",
          `
          vec3 transformed = vec3(position);
          float hf = pow(clamp(position.y / 4.4, 0.0, 1.0), 1.5);
          float bend = sin(uTime * 0.62 + aPhase + position.y * 0.16) * 0.14
                     + sin(uTime * 1.24 + aPhase * 1.7) * 0.036;
          transformed.x += bend * hf;
          transformed.z += cos(uTime * 0.48 + aPhase) * 0.065 * hf;
          `
        );
      material.userData.shader = shader;
    };
    material.customProgramCacheKey = () => "pelagic-kelp-sway";
    this.swayMaterials.push(material);
    const patches = [
      { x: -10.4, z: -12.4, seed: 10, count: 7, h: 4.4, scale: 1 },
      { x: 9.2, z: -15.2, seed: 21, count: 7, h: 3.8, scale: 1.1 },
      { x: 14.6, z: 9.4, seed: 34, count: 8, h: 4.8, scale: 0.9 },
      { x: -14.2, z: 10.9, seed: 41, count: 8, h: 4.2, scale: 1.05 },
      { x: -7.2, z: 20.6, seed: 57, count: 7, h: 5.1, scale: 1 },
      { x: 18.2, z: -18.8, seed: 66, count: 8, h: 4.6, scale: 1.1 },
    ];
    patches.forEach((patch) => {
      const geo = makeKelpGeometry(patch.seed, patch.count + 4, patch.h * 0.8, 0.16);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(patch.x, 0, patch.z);
      mesh.scale.setScalar(patch.scale);
      mesh.castShadow = true;
      this.scene.add(mesh);
    });
    // Невысокая трава, заполняющая «лужайки».
    const grassMat = material.clone();
    grassMat.onBeforeCompile = material.onBeforeCompile;
    grassMat.userData = {};
    this.swayMaterials.push(grassMat);
    for (let i = 0; i < 9; i++) {
      const rand = mulberry32(410 + i);
      const geo = makeKelpGeometry(710 + i, 18, 0.6, 0.035);
      const mesh = new THREE.Mesh(geo, grassMat);
      const angle = rand() * Math.PI * 2;
      const radius = 3.4 + rand() * 13;
      mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      mesh.scale.setScalar(0.7 + rand() * 0.5);
      this.scene.add(mesh);
      this.grassMeshes.push(mesh);
    }
  }

  private buildFish() {
    const configs: {
      kind: "clown" | "tang" | "angel" | "butterfly";
      id: SpeciesId;
      center: [number, number, number];
      radius: [number, number, number];
      count: number;
      scale: number;
      speed: number;
      threshold: number;
    }[] = [
      {
        kind: "clown",
        id: "clownfish",
        center: [-2.9, 1.2, -4.6],
        radius: [1.25, 0.4, 1.0],
        count: 3,
        scale: 0.62,
        speed: 0.32,
        threshold: 0.14,
      },
      {
        kind: "tang",
        id: "blue-tang",
        center: [5.2, 3.0, -7.4],
        radius: [3.1, 0.7, 2.2],
        count: 6,
        scale: 0.58,
        speed: 0.22,
        threshold: 0.14,
      },
      {
        kind: "angel",
        id: "angelfish",
        center: [-11.8, 4.0, -2.0],
        radius: [2.0, 0.55, 2.2],
        count: 2,
        scale: 0.7,
        speed: 0.15,
        threshold: 0.14,
      },
      {
        kind: "butterfly",
        id: "butterflyfish",
        center: [-6.4, 4.2, -7.8],
        radius: [2.6, 0.6, 1.8],
        count: 5,
        scale: 0.46,
        speed: 0.2,
        threshold: 0.14,
      },
    ];
    configs.forEach((config, configIndex) => {
      for (let i = 0; i < config.count; i++) {
        const group = buildFish(config.kind, config.scale * (0.86 + (i % 3) * 0.1));
        const rand = mulberry32(configIndex * 100 + i + 3);
        this.scene.add(group);
        const actor: FishActor = {
          group,
          center: new THREE.Vector3(...config.center),
          rx: config.radius[0] * (0.7 + rand() * 0.6),
          ry: config.radius[1],
          rz: config.radius[2] * (0.7 + rand() * 0.6),
          speed: config.speed * (0.75 + rand() * 0.55),
          phase: rand() * Math.PI * 2,
          pitchPhase: rand() * 10,
          tail: group.userData.tail as THREE.Object3D,
          pectorals: group.userData.pectorals as THREE.Object3D[],
          id: config.id,
        };
        this.fishActors.push(actor);
        this.observables.push({
          id: config.id,
          object: group,
          threshold: config.threshold,
        });
      }
    });

    // Садовые угри — колонии в песке.
    const eelAnchor = new THREE.Group();
    eelAnchor.position.set(8.4, 1.0, 10.2);
    this.scene.add(eelAnchor);
    const eelMat = new THREE.MeshStandardMaterial({ color: 0xb7a98b, roughness: 0.72 });
    const eelGeos: THREE.Mesh[] = [];
    for (let i = 0; i < 9; i++) {
      const rand = mulberry32(51 + i);
      const eel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 1.35 + rand() * 0.4, 5), eelMat);
      eel.position.set((rand() - 0.5) * 2.4, 0.6, (rand() - 0.5) * 1.5);
      eel.rotation.z = (rand() - 0.5) * 0.25;
      eelAnchor.add(eel);
      eelGeos.push(eel);
    }
    eelAnchor.userData.eels = eelGeos;
    this.observables.push({ id: "eel", object: eelAnchor, threshold: 0.17 });
    this.eelAnchor = eelAnchor;
    const eelTip = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 9 }, () => new THREE.Vector3((Math.random() - 0.5) * 2.2, 1.25 + Math.random() * 0.3, (Math.random() - 0.5) * 1.2))
      ),
      new THREE.PointsMaterial({ color: 0xe1d9b4, size: 0.06, map: makeSoftCircleTexture(), transparent: true, depthWrite: false })
    );
    eelTip.position.copy(eelAnchor.position);
    this.scene.add(eelTip);
  }

  private eelAnchor: THREE.Group | null = null;

  private buildWhale() {
    const skin = makeWhaleSkinTexture();
    const adultRig = buildWhale(skin);
    const calfRig = buildWhale(skin);
    adultRig.group.scale.setScalar(0.72);
    calfRig.group.scale.setScalar(0.34);
    this.scene.add(adultRig.group, calfRig.group);
    const adultPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-44, 7.4, -22),
      new THREE.Vector3(-26, 8.0, -19),
      new THREE.Vector3(-3, 8.8, -17.5),
      new THREE.Vector3(20, 8.4, -17.5),
      new THREE.Vector3(39, 7.3, -20),
      new THREE.Vector3(53, 6.7, -26),
    ]);
    const calfPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-35, 6.4, -24),
      new THREE.Vector3(-19, 7.0, -21),
      new THREE.Vector3(1, 7.8, -19.5),
      new THREE.Vector3(23, 7.4, -19.5),
      new THREE.Vector3(41, 6.3, -22),
      new THREE.Vector3(54, 5.8, -28),
    ]);
    this.whaleAdult = { rig: adultRig, path: adultPath, t: 0, speed: 1 / 44, side: 1 };
    this.whaleCalf = { rig: calfRig, path: calfPath, t: 0, speed: 1 / 44, side: 1 };
    this.observables.push({ id: "whale", object: adultRig.group, threshold: 0.28 });
    adultRig.group.visible = false;
    calfRig.group.visible = false;
  }

  private buildTurtle() {
    const shell = makeShellTexture();
    const rig = buildTurtle(shell);
    this.scene.add(rig.group);
    this.turtleRig = rig;
    rig.group.scale.setScalar(0.9);
    this.observables.push({ id: "turtle", object: rig.group, threshold: 0.16 });
    this.turtlePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(8.5, 1.7, -8.5),
      new THREE.Vector3(11.5, 2.4, -14.5),
      new THREE.Vector3(4.5, 3.0, -18.5),
      new THREE.Vector3(-6.5, 2.6, -16.5),
      new THREE.Vector3(-12.5, 2.0, -10.5),
      new THREE.Vector3(-9.0, 1.6, -5.5),
      new THREE.Vector3(-1.5, 1.4, -4.5),
      new THREE.Vector3(4.5, 1.5, -5.0),
    ], true);
  }

  private turtlePath: THREE.CatmullRomCurve3 | null = null;

  private buildManta() {
    const rig = buildManta();
    rig.group.scale.setScalar(0.95);
    this.scene.add(rig.group);
    this.mantaRig = rig;
    this.observables.push({ id: "manta", object: rig.group, threshold: 0.19 });
    this.mantaPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-30, 13.0, -32),
      new THREE.Vector3(-17, 12.2, -37),
      new THREE.Vector3(2, 11.6, -38),
      new THREE.Vector3(20, 12.4, -34),
      new THREE.Vector3(28, 14.2, -26),
      new THREE.Vector3(14, 15.2, -21),
      new THREE.Vector3(-6, 14.4, -23),
      new THREE.Vector3(-23, 14.0, -27),
    ], true);
  }

  private mantaPath: THREE.CatmullRomCurve3 | null = null;

  private buildSchools() {
    const geometry = makeSchoolFishGeometry();
    const schools = [
      { color: 0xcfe4e4, center: new THREE.Vector3(-11, 5.4, -15.2), radius: 4.8, count: 58, phase: 2.2, speed: 0.055 },
      { color: 0xdfcb8c, center: new THREE.Vector3(14.6, 3.8, -6.5), radius: 3.4, count: 34, phase: 4.1, speed: 0.075 },
      { color: 0xa9cdc9, center: new THREE.Vector3(-17.6, 6.2, -21), radius: 5.2, count: 44, phase: 0.4, speed: 0.04 },
    ];
    const rand = mulberry32(801);
    schools.forEach((school) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.8,
        sheen: 0.5,
        iridescence: 0.55,
        iridescenceIOR: 1.3,
        emissive: new THREE.Color(0x6ea8a4),
        emissiveIntensity: 0.22,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.InstancedMesh(geometry, material, school.count);
      mesh.frustumCulled = false;
      const color = new THREE.Color();
      const particles: { phase: number; bob: number; ring: number; scale: number }[] = [];
      for (let i = 0; i < school.count; i++) {
        color.set(school.color).offsetHSL((rand() - 0.5) * 0.05, (rand() - 0.5) * 0.12, (rand() - 0.5) * 0.14);
        mesh.setColorAt(i, color);
        particles.push({
          phase: rand() * Math.PI * 2,
          bob: rand() * Math.PI * 2,
          ring: 0.35 + rand() * 0.74,
          scale: 0.7 + rand() * 0.6,
        });
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.scene.add(mesh);
      this.schools.push({ mesh, center: school.center, radius: school.radius, phase: school.phase, speed: school.speed, particles });
    });
  }

  private buildJellyfish() {
    for (let i = 0; i < 3; i++) {
      const jelly = buildJellyfish();
      const rand = mulberry32(950 + i);
      jelly.position.set(-16 + rand() * 32, 5 + rand() * 4, -20 + rand() * 10);
      jelly.scale.setScalar(0.9 + rand() * 0.8);
      jelly.userData.base = jelly.position.clone();
      jelly.userData.phase = rand() * Math.PI * 2;
      this.scene.add(jelly);
      this.jellyfish.push(jelly);
    }
  }

  private buildParticles() {
    const soft = makeSoftCircleTexture();
    const count = 950;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const rand = mulberry32(1177);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 58;
      positions[i * 3 + 1] = rand() * 24;
      positions[i * 3 + 2] = (rand() - 0.5) * 58;
      speeds[i] = 0.15 + rand() * 0.55;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const snow = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xd4f5ea,
        size: 0.075,
        map: soft,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );
    snow.frustumCulled = false;
    this.scene.add(snow);
    this.marineSnow = snow;
    this.snowSpeeds = speeds;

    const bubbleCount = 52;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const data: { speed: number; wobble: number; phase: number }[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const vent = i % 4;
      const vents = [
        [-4.6, -3.8],
        [4.8, -6.2],
        [-8.2, 2.4],
        [7.4, 4.3],
      ];
      const ventPos = vents[vent];
      bubblePositions[i * 3] = ventPos[0] + (rand() - 0.5) * 0.4;
      bubblePositions[i * 3 + 1] = rand() * 14;
      bubblePositions[i * 3 + 2] = ventPos[1] + (rand() - 0.5) * 0.4;
      data.push({ speed: 0.4 + rand() * 1.1, wobble: 0.1 + rand() * 0.35, phase: rand() * Math.PI * 2 });
    }
    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
    const bubblePoints = new THREE.Points(
      bubbleGeo,
      new THREE.PointsMaterial({
        color: 0xe3fffb,
        size: 0.095,
        map: makeBubbleTexture(),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );
    bubblePoints.frustumCulled = false;
    this.scene.add(bubblePoints);
    this.bubbles = bubblePoints;
    this.bubbleData = data;
  }

  private buildBenthos() {
    const rand = mulberry32(1441);
    const geometry = new THREE.IcosahedronGeometry(0.055, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.02,
      vertexColors: false,
    });
    const count = 260;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const palette = [0xd9c07a, 0xc9825a, 0xb96a7a, 0xe3d3a4, 0x8f7a9c, 0xcbb86a];
    for (let i = 0; i < count; i++) {
      let x = 0;
      let z = 0;
      let attempts = 0;
      do {
        const angle = rand() * Math.PI * 2;
        const radius = 2.6 + rand() * 20;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius - 2;
        attempts++;
      } while (attempts < 12 && Math.abs(x) < 2.4 && Math.abs(z - 2) < 3);
      dummy.position.set(x, 0.04 + rand() * 0.05, z);
      dummy.rotation.set(rand() * 2.2, rand() * Math.PI * 2, rand() * 2.2);
      dummy.scale.setScalar(0.45 + rand() * 1.2);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.set(palette[i % palette.length]).offsetHSL((rand() - 0.5) * 0.04, 0, (rand() - 0.5) * 0.12);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    this.scene.add(mesh);

    // Тонкая «жизнь» на камнях и в кораллах: полипы и взвесь.
    const soft = makeSoftCircleTexture();
    const detailCount = 900;
    const positions = new Float32Array(detailCount * 3);
    const colors = new Float32Array(detailCount * 3);
    const c = new THREE.Color();
    const anchors = [
      [-5.8, -2.8, 0x9c566f],
      [5.6, -3.2, 0xb45f48],
      [-3.9, -5.2, 0xd08b6e],
      [2.4, -8.2, 0x8a7288],
      [1.25, -2.3, 0xd9c07a],
      [-7.0, -5.8, 0xce8a6b],
      [7.2, -6.4, 0xc4774f],
      [-8.8, -8.2, 0xb7a479],
      [11.2, -6.8, 0xb98f76],
    ] as [number, number, number][];
    for (let i = 0; i < detailCount; i++) {
      const anchor = anchors[i % anchors.length];
      const spread = 0.5 + rand() * 2.2;
      positions[i * 3] = anchor[0] + (rand() - 0.5) * spread;
      positions[i * 3 + 1] = 0.15 + rand() * (1.2 + rand() * 1.8);
      positions[i * 3 + 2] = anchor[1] + (rand() - 0.5) * spread;
      c.set(anchor[2]).offsetHSL((rand() - 0.5) * 0.03, (rand() - 0.5) * 0.16, 0.12 + rand() * 0.18);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const detailGeo = new THREE.BufferGeometry();
    detailGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    detailGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const detail = new THREE.Points(
      detailGeo,
      new THREE.PointsMaterial({
        size: 0.055,
        map: soft,
        vertexColors: true,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );
    detail.frustumCulled = false;
    this.scene.add(detail);
  }

  private buildContactShadows() {
    const radius = 128;
    const canvas = document.createElement("canvas");
    canvas.width = radius;
    canvas.height = radius;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(radius / 2, radius / 2, 0, radius / 2, radius / 2, radius / 2);
    grad.addColorStop(0, "rgba(4,20,22,.62)");
    grad.addColorStop(0.45, "rgba(4,20,22,.3)");
    grad.addColorStop(1, "rgba(4,20,22,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, radius, radius);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      opacity: 0.85,
    });
    const geometry = new THREE.PlaneGeometry(1, 1);
    this.corals.forEach((coral) => {
      const size = (coral.userData.bigCoral ? 6.5 : 3.6) * 2;
      const decal = new THREE.Mesh(geometry, material);
      decal.rotation.x = -Math.PI / 2;
      decal.position.set(coral.position.x + 0.35, 0.055, coral.position.z + 0.2);
      decal.scale.set(size, size, size);
      decal.renderOrder = 2;
      this.scene.add(decal);
    });
    // камни тоже «стоят» на дне
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      if (!object.userData.bigCoral && object.geometry.type === "SphereGeometry" && object.castShadow && object.position.y > -0.5 && object.position.y < 0.4) {
        const decal = new THREE.Mesh(geometry, material);
        decal.rotation.x = -Math.PI / 2;
        const s = 5 + object.scale.x * 2;
        decal.position.set(object.position.x, 0.045, object.position.z);
        decal.scale.set(s, s, s);
        decal.renderOrder = 2;
        this.scene.add(decal);
      }
    });
  }

  private initComposer() {
    const size = new THREE.Vector2(this.container.clientWidth, this.container.clientHeight);
    const target = new THREE.WebGLRenderTarget(size.x, size.y, {
      type: THREE.HalfFloatType,
      samples: 4,
      colorSpace: THREE.LinearSRGBColorSpace,
    });
    const composer = new EffectComposer(this.renderer, target);
    composer.addPass(new RenderPass(this.scene, this.camera));
    const bloom = new UnrealBloomPass(size, 0.42, 0.78, 0.82);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    this.composer = composer;
    this.bloomPass = bloom;
  }

  /* ---------------------------------------------------------------- */
  /*  Input + gaze                                                    */
  /* ---------------------------------------------------------------- */

  private attachEvents() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);
    canvas.addEventListener("pointerleave", this.onPointerUp);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVisibility);
    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", this.onDeviceOrientation);
      this.gyroListening = true;
    }
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.container);
  }

  private onPointerDown = (event: PointerEvent) => {
    if (!this.settings.interactive || this.settings.source !== "pointer") return;
    this.pointerDrag = true;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.renderer.domElement.setPointerCapture?.(event.pointerId);
    this.renderer.domElement.style.cursor = "grabbing";
  };

  private onPointerMove = (event: PointerEvent) => {
    if (!this.pointerDrag || !this.settings.interactive || this.settings.source !== "pointer") return;
    const dx = event.clientX - this.lastPointer.x;
    const dy = event.clientY - this.lastPointer.y;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    const fovScale = this.camera.fov / 60;
    this.targetYaw = THREE.MathUtils.clamp(this.targetYaw + (dx * this.pointerSensitivity * fovScale), -2.15, 2.15);
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch - dy * this.pointerSensitivity * fovScale, -0.48, 1.04);
  };

  private onPointerUp = () => {
    this.pointerDrag = false;
    this.renderer.domElement.style.cursor = this.settings.interactive ? "grab" : "default";
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.settings.interactive || this.settings.source !== "pointer") return;
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const step = 0.055;
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A" || event.key === "ф") {
      this.targetYaw = THREE.MathUtils.clamp(this.targetYaw - step, -2.15, 2.15);
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D" || event.key === "в") {
      this.targetYaw = THREE.MathUtils.clamp(this.targetYaw + step, -2.15, 2.15);
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W" || event.key === "ц") {
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + step * 0.7, -0.48, 1.04);
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S" || event.key === "ы") {
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch - step * 0.7, -0.48, 1.04);
    }
  };

  private onBlur = () => {
    this.pointerDrag = false;
  };

  private onVisibility = () => {
    if (document.hidden) {
      this.pointerDrag = false;
      this.provider?.getGaze();
    }
  };

  private onDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (this.settings.source !== "gyro") return;
    if (event.alpha == null || event.beta == null) return;
    if (!this.gyroBase) {
      this.gyroBase = { alpha: event.alpha, beta: event.beta, gamma: event.gamma || 0 };
      this.gyroTarget = { yaw: 0, pitch: 0 };
    }
    let deltaAlpha = event.alpha - this.gyroBase.alpha;
    if (deltaAlpha > 180) deltaAlpha -= 360;
    if (deltaAlpha < -180) deltaAlpha += 360;
    const deltaBeta = event.beta - this.gyroBase.beta;
    const landscape = window.innerWidth > window.innerHeight;
    const yawRad = THREE.MathUtils.degToRad(deltaAlpha);
    const pitchRad = THREE.MathUtils.degToRad(deltaBeta) * 0.72;
    this.gyroTarget.yaw = THREE.MathUtils.clamp(landscape ? yawRad : -pitchRad, -1.35, 1.35);
    this.gyroTarget.pitch = THREE.MathUtils.clamp(-pitchRad, -0.45, 0.92);
    this.gyroLastAt = performance.now();
    this.setGazeStatus("gyro");
  };

  async requestGyro(): Promise<{ ok: boolean; message: string }> {
    const anyWindow = window as unknown as {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
    };
    try {
      const request = anyWindow.DeviceOrientationEvent?.requestPermission;
      if (request) {
        const result = await request();
        if (result !== "granted") {
          return { ok: false, message: "Доступ к датчикам отклонён. Остаётся ручной режим." };
        }
      }
      if (!this.gyroListening) {
        window.addEventListener("deviceorientation", this.onDeviceOrientation);
        this.gyroListening = true;
      }
      this.gyroBase = null;
      if (this.settings.source === "gyro") {
        this.setGazeStatus("gyro-wait");
      }
      return { ok: true, message: "Гироскоп подключён. Держите телефон так, как он стоит в очках." };
    } catch {
      return { ok: false, message: "Гироскоп недоступен в этом браузере." };
    }
  }

  calibrateGyro() {
    this.gyroBase = null;
    this.gyroLastAt = 0;
    this.gyroTarget = { yaw: 0, pitch: 0 };
  }

  private setGazeStatus(status: GazeStatus) {
    if (this.lastGazeStatus === status) return;
    this.lastGazeStatus = status;
    this.callbacks.onGazeStatus(status);
  }

  private updateGaze(dt: number) {
    if (this.settings.interactive) {
      if (this.settings.source === "pointer") {
        this.setGazeStatus("pointer");
      } else if (this.settings.source === "gyro") {
        const fresh = performance.now() - this.gyroLastAt < 700;
        if (fresh) {
          this.targetYaw = this.gyroTarget.yaw;
          this.targetPitch = this.gyroTarget.pitch;
          this.setGazeStatus("gyro");
        } else {
          this.setGazeStatus("gyro-wait");
        }
      } else {
        const sample: GazeSample | null = this.provider?.getGaze(performance.now()) ?? null;
        if (!sample || sample.status === "idle") {
          this.setGazeStatus("camera-off");
        } else {
          this.targetYaw = THREE.MathUtils.clamp(sample.yaw, -1.35, 1.35);
          this.targetPitch = THREE.MathUtils.clamp(sample.pitch, -0.46, 0.96);
          if (sample.status === "valid") this.setGazeStatus("camera-valid");
          else if (sample.status === "single") this.setGazeStatus("camera-single");
          else if (sample.status === "held") this.setGazeStatus("camera-held");
          else this.setGazeStatus("camera-lost");
        }
      }
    } else {
      // Аттракт-режим на стартовом экране: очень медленный, предсказуемый дрейф.
      const speed = this.settings.reducedMotion ? 0.018 : 0.042;
      this.targetYaw = Math.sin(this.lifeTime * speed) * 0.24 - 0.04;
      this.targetPitch = -0.015 + Math.sin(this.lifeTime * speed * 0.68 + 1.8) * 0.045;
    }
    const damping = this.settings.reducedMotion ? 3.4 : 6.2;
    const alpha = 1 - Math.exp(-damping * dt);
    this.yaw += (this.targetYaw - this.yaw) * alpha;
    this.pitch += (this.targetPitch - this.pitch) * alpha;

    const bob = this.settings.reducedMotion || this.settings.vr ? 0 : 1;
    this.camera.position.set(
      BASE_POSITION.x + Math.sin(this.lifeTime * 0.31) * 0.018 * bob,
      BASE_POSITION.y + Math.sin(this.lifeTime * 0.53 + 1) * 0.03 * bob,
      BASE_POSITION.z + Math.cos(this.lifeTime * 0.27) * 0.016 * bob
    );
    this.camera.rotation.set(this.pitch, -this.yaw, 0, "YXZ");
  }

  /* ---------------------------------------------------------------- */
  /*  Animate                                                         */
  /* ---------------------------------------------------------------- */

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.06);
    this.lifeTime += dt;
    this.frame++;
    this.statsFrames++;
    this.updateGaze(dt);
    this.updateWorld(dt);
    if (!this.settings.vr || this.frame % 2 === 0) this.updateParticles(dt);
    this.updateDiscovery(dt);
    this.render(dt);
    this.statsTimer += dt;
    if (this.statsTimer > (this.settings.vr ? 2 : 1)) {
      this.lastFps = Math.round(this.statsFrames / this.statsTimer);
      this.statsFrames = 0;
      this.statsTimer = 0;
      this.callbacks.onStats({ fps: this.lastFps, calls: this.renderer.info.render.calls });
      const providerInfo = this.provider?.getInfo();
      this.perfNotes.cameraProcMs = providerInfo?.frame?.procMs ?? 0;
      this.perfNotes.cameraQueue = providerInfo?.queue ?? 0;
      this.perfNotes.cameraTier = providerInfo?.tier ?? 0;
      (window as unknown as { __PERF__?: Record<string, unknown> }).__PERF__ = {
        fps: this.lastFps,
        renderCalls: this.renderer.info.render.calls,
        shadowPassesPerPair: this.shadowPassesPerPair,
        cameraProcMs: this.perfNotes.cameraProcMs,
        cameraQueue: this.perfNotes.cameraQueue,
        cameraTier: this.perfNotes.cameraTier,
        cameraHz: providerInfo?.fps ?? 0,
        cameraIntervalMs: providerInfo?.intervalMs ?? 0,
        stereo: this.perfNotes.stereo,
        dpr: this.perfNotes.dpr,
        renderMs: this.perfNotes.renderMs,
        triangles: this.renderer.info.render.triangles,
        cameraInfo: providerInfo
          ? {
              running: providerInfo.running,
              phase: providerInfo.phase,
              feed: providerInfo.feed,
              tier: providerInfo.tier,
              intervalMs: providerInfo.intervalMs,
              fps: providerInfo.fps,
              queue: providerInfo.queue,
              procMs: providerInfo.frame?.procMs ?? 0,
              streamVersion: providerInfo.streamVersion,
            }
          : null,
      };
    }
    const heading =
      ((THREE.MathUtils.radToDeg(this.yaw) % 360) + 360) % 360;
    // В HUD компас не нужен чаще, чем читается глазом. В VR — тем более:
    // лишние React-рендеры конкурируют со стерео-кадром.
    if (this.lifeTime - this.headingCallbackAt > (this.settings.vr ? 0.6 : 0.14)) {
      this.headingCallbackAt = this.lifeTime;
      this.callbacks.onHeading(heading);
    }
    if (this.settings.interactive && this.lifeTime > this.nextBubbleAt) {
      this.callbacks.onEvent("bubble");
      this.nextBubbleAt = this.lifeTime + 5 + Math.random() * 11;
    }
  };

  private updateWorld(dt: number) {
    const t = this.lifeTime;
    // Свечение каустики бежит по дну.
    if (this.causticTexture) {
      this.causticTexture.offset.x = t * 0.012;
      this.causticTexture.offset.y = t * 0.008;
    }
    this.waterMaterials.forEach(({ uniform }) => (uniform.value = t));
    this.shaderShafts.forEach((uniform) => (uniform.value = t));
    this.swayMaterials.forEach((material) => {
      const shader = (material.userData as { shader?: { uniforms: Record<string, { value: number }> } }).shader;
      if (shader?.uniforms.uTime) shader.uniforms.uTime.value = t;
    });
    this.currents.forEach((current) => {
      current.obj.rotation.z = Math.sin(t * 0.36 + current.phase) * current.amp;
    });

    this.fishActors.forEach((actor) => {
      if (this.settings.vr && !actor.group.visible) return;
      const angle = t * actor.speed + actor.phase;
      const x = actor.center.x + Math.cos(angle) * actor.rx;
      const z = actor.center.z + Math.sin(angle) * actor.rz;
      const y = actor.center.y + Math.sin(angle * 1.7 + actor.pitchPhase) * actor.ry;
      actor.group.position.set(x, y, z);
      const nextAngle = angle + 0.035;
      tempNext.set(
        actor.center.x + Math.cos(nextAngle) * actor.rx,
        actor.center.y + Math.sin(nextAngle * 1.7 + actor.pitchPhase) * actor.ry,
        actor.center.z + Math.sin(nextAngle) * actor.rz
      );
      actor.group.lookAt(tempNext);
      actor.group.rotation.z += Math.sin(angle * 2.2) * 0.08;
      actor.tail.rotation.y = Math.sin(t * 9 + actor.phase) * 0.36;
      actor.pectorals.forEach((fin, index) => {
        fin.rotation.z = (index === 0 ? 1 : -1) * (0.5 + Math.sin(t * 6 + actor.phase) * 0.16);
      });
    });

    if (this.eelAnchor) {
      const eels = (this.eelAnchor.userData.eels as THREE.Mesh[]) || [];
      eels.forEach((eel, index) => {
        const sway = Math.sin(t * 0.9 + index * 0.7) * 0.14;
        eel.rotation.z = 0.08 + sway;
        eel.scale.y = 0.85 + Math.sin(t * 1.4 + index) * 0.1;
      });
      this.eelAnchor.rotation.y = Math.sin(t * 0.18) * 0.08;
    }

    if (this.turtleRig && this.turtlePath) {
      this.turtleProgress = (this.turtleProgress + dt * 0.0095) % 1;
      const pos = this.turtlePath.getPoint(this.turtleProgress);
      const look = this.turtlePath.getPoint((this.turtleProgress + 0.012) % 1);
      this.turtleRig.group.position.copy(pos);
      this.turtleRig.group.lookAt(look);
      animateTurtle(this.turtleRig, t, 0.8);
    }

    if (this.mantaRig && this.mantaPath) {
      const progress = (t * 0.009 + 0.2) % 1;
      const pos = this.mantaPath.getPoint(progress);
      const look = this.mantaPath.getPoint((progress + 0.01) % 1);
      this.mantaRig.group.position.copy(pos);
      this.mantaRig.group.lookAt(look);
      animateManta(this.mantaRig, t);
      const spots = this.mantaRig.group.userData.spots as THREE.Group;
      if (spots) spots.visible = Math.sin(t * 0.5) > -0.4;
    }

    if (this.whaleAdult && this.whaleCalf) {
      const cycle = 74;
      const local = (t + 56) % cycle;
      this.whaleVisible = local < 48;
      const passT = THREE.MathUtils.clamp(local / 48, 0, 1);
      const ease = THREE.MathUtils.smootherstep(passT, 0, 1);
      const adultPos = this.whaleAdult.path.getPoint(ease);
      const adultLook = this.whaleAdult.path.getPoint(Math.min(0.999, ease + 0.012));
      this.whaleAdult.rig.group.position.copy(adultPos);
      this.whaleAdult.rig.group.lookAt(adultLook);
      this.whaleAdult.rig.group.visible = this.whaleVisible;
      const calfT = Math.max(0, ease - 0.065);
      const calfPos = this.whaleCalf.path.getPoint(calfT);
      const calfLook = this.whaleCalf.path.getPoint(Math.min(0.999, calfT + 0.012));
      this.whaleCalf.rig.group.position.copy(calfPos);
      this.whaleCalf.rig.group.lookAt(calfLook);
      this.whaleCalf.rig.group.visible = this.whaleVisible;
      animateWhale(this.whaleAdult.rig, t);
      animateWhale(this.whaleCalf.rig, t + 0.5);
      if (this.settings.interactive && this.whaleVisible && passT > 0.22 && !this.whaleNotified) {
        this.whaleNotified = true;
        this.callbacks.onEvent("whale-near");
        this.whaleSoundPlayed = false;
      }
      if (this.settings.interactive && this.whaleVisible && passT > 0.3 && !this.whaleSoundPlayed) {
        this.whaleSoundPlayed = true;
        this.callbacks.onEvent("whale-pass");
      }
      if ((!this.whaleVisible || passT > 0.9) && this.whaleNotified) {
        this.whaleNotified = false;
        this.callbacks.onEvent("whale-far");
      }
    }

    this.jellyfish.forEach((jelly, index) => {
      const base = jelly.userData.base as THREE.Vector3;
      const phase = jelly.userData.phase as number;
      jelly.position.y = base.y + Math.sin(t * 0.22 + phase) * 0.8;
      jelly.position.x = base.x + Math.sin(t * 0.065 + phase) * 1.4;
      jelly.rotation.y = t * 0.04 + index;
      const bell = jelly.userData.bell as THREE.Mesh;
      if (bell) bell.scale.set(1 + Math.sin(t * 1.2 + phase) * 0.08, 0.62 + Math.sin(t * 1.2 + phase) * 0.06, 1);
    });

    // Школы и взвесь живут и в VR, но с половинной частотой обновления:
    // это не видно на 5–8 Гц взгляда, зато экономит JS-время пары кадров.
    if (!this.settings.vr || this.frame % 2 === 0) this.updateSchools(t);
  }

  private updateSchools(t: number) {
    this.schools.forEach((school, schoolIndex) => {
      const count = school.mesh.count;
      for (let i = 0; i < count; i++) {
        const particle = school.particles[i];
        const a = t * school.speed + particle.phase + schoolIndex + i * 0.05;
        const ring = school.radius * particle.ring;
        const x = school.center.x + Math.cos(a) * ring + Math.sin(t * 0.4 + particle.bob) * 0.3;
        const z = school.center.z + Math.sin(a) * ring * 0.7;
        const y = school.center.y + Math.sin(t * 0.5 + particle.bob) * 1.2;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, -a - Math.PI / 2 + Math.sin(t * 0.2 + particle.phase) * 0.3, Math.sin(t * 0.8 + particle.bob) * 0.08);
        dummy.scale.setScalar(particle.scale * 0.42);
        dummy.updateMatrix();
        school.mesh.setMatrixAt(i, dummy.matrix);
      }
      school.mesh.instanceMatrix.needsUpdate = true;
    });
  }

  private updateParticles(dt: number) {
    if (this.marineSnow && this.snowSpeeds) {
      const attr = this.marineSnow.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < this.snowSpeeds.length; i++) {
        arr[i * 3 + 1] += this.snowSpeeds[i] * dt * 0.42;
        arr[i * 3] += Math.sin(this.lifeTime * 0.32 + i) * dt * 0.055;
        if (arr[i * 3 + 1] > 23) {
          arr[i * 3 + 1] = 0.2;
        }
      }
      attr.needsUpdate = true;
    }
    if (this.bubbles) {
      const attr = this.bubbles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      this.bubbleData.forEach((bubble, i) => {
        arr[i * 3 + 1] += bubble.speed * dt * 0.8;
        arr[i * 3] += Math.sin(this.lifeTime * 0.8 + bubble.phase) * dt * bubble.wobble;
        if (arr[i * 3 + 1] > 18) {
          arr[i * 3 + 1] = 0.1;
        }
      });
      attr.needsUpdate = true;
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Observation loop                                                */
  /* ---------------------------------------------------------------- */

  private updateDiscovery(dt: number) {
    if (!this.settings.interactive) return;
    const cameraPos = this.camera.position;
    let best: { observable: Observable; score: number; distance: number } | null = null;
    const projected = fishNext;
    const aspect = this.camera.aspect;
    for (const observable of this.observables) {
      if (!observable.object.visible) continue;
      observable.object.getWorldPosition(projected);
      const distance = projected.distanceTo(cameraPos);
      // Дальние животные не должны перебивать близкую рыбу.
      const farPenalty = Math.max(0, distance - 30) / 200;
      projected.project(this.camera);
      if (projected.z < -1 || projected.z > 1) continue;
      const dx = projected.x;
      const dy = projected.y * (aspect > 1.33 ? 1 : 1.25);
      const score = Math.sqrt(dx * dx + dy * dy);
      const threshold = observable.threshold + farPenalty;
      if (score <= threshold && (!best || score < best.score)) {
        best = { observable, score, distance };
      }
    }
    const target = best?.observable ?? null;
    const nextId = target?.id ?? null;
    if (nextId !== this.activeTarget) {
      this.targetProgress = 0;
      this.activeTarget = nextId;
    }
    if (this.activeTarget) {
      if (!this.discovered.has(this.activeTarget)) {
        this.targetProgress = Math.min(1, this.targetProgress + dt / 1.65);
        if (this.targetProgress >= 1) {
          this.discovered.add(this.activeTarget);
          this.callbacks.onDiscovery(this.activeTarget);
          this.targetProgress = 1;
        }
      } else {
        this.targetProgress = 1;
      }
    } else {
      this.targetProgress = Math.max(0, this.targetProgress - dt * 1.7);
    }
    const now = performance.now();
    if (now - this.targetCallbackAt > (this.settings.vr ? 420 : 90)) {
      this.targetCallbackAt = now;
      this.callbacks.onTarget({
        id: this.activeTarget,
        progress: this.targetProgress,
        discovered: this.activeTarget ? this.discovered.has(this.activeTarget) : false,
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render / public API                                             */
  /* ---------------------------------------------------------------- */

  private render(_dt: number) {
    const width = this.container.clientWidth || 1280;
    const height = this.container.clientHeight || 800;
    const dpr = this.renderer.getPixelRatio();
    if (
      this.renderer.domElement.width !== Math.floor(width * dpr) ||
      this.renderer.domElement.height !== Math.floor(height * dpr)
    ) {
      this.resize();
    }
    const stereo = this.settings.vr && width > height * 1.08;
    this.perfNotes.stereo = stereo;
    this.perfNotes.dpr = this.renderer.getPixelRatio();
    const started = performance.now();
    this.renderer.info.reset();

    if (stereo) {
      // ВАЖНО: сцена рисуется дважды, но теневые карты не должны обновляться
      // на каждый глаз. Как в skill: autoUpdate выключен, needsUpdate один
      // раз до первого глаза, после пары восстанавливаем. Это ровно та
      // ошибка двойного shadow pass, которая была в VR-гонках.
      this.renderer.shadowMap.autoUpdate = false;
      this.renderer.shadowMap.needsUpdate = true;
      this.shadowPassesPerPair = 1;
      this.renderer.setScissorTest(true);
      const half = width / 2;
      this.camera.aspect = half / height;
      this.camera.updateProjectionMatrix();
      const right = tempRight.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const halfIpd = Math.max(0.018, this.settings.ipdCm / 100 / 2);
      for (let eye = 0; eye < 2; eye++) {
        const sign = eye === 0 ? -1 : 1;
        tempPlayer.copy(BASE_POSITION).addScaledVector(right, halfIpd * sign);
        this.camera.position.copy(tempPlayer);
        this.camera.updateMatrixWorld();
        this.renderer.setViewport(eye * half, 0, half, height);
        this.renderer.setScissor(eye * half, 0, half, height);
        this.renderer.render(this.scene, this.camera);
      }
      this.renderer.setScissorTest(false);
      this.renderer.setViewport(0, 0, width, height);
      this.renderer.shadowMap.autoUpdate = true;
    } else {
      this.renderer.shadowMap.autoUpdate = true;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.camera.position.copy(BASE_POSITION);
      if (this.composer && !this.settings.vr) {
        if (this.bloomPass) this.bloomPass.enabled = this.settings.quality === "high" && !this.settings.reducedMotion;
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    }
    this.camera.position.copy(BASE_POSITION);
    this.lastFrameMs = this.lastFrameMs * 0.9 + (performance.now() - started) * 0.1;
    this.perfNotes.renderMs = Math.round(this.lastFrameMs * 10) / 10;

    // Контур камеры запускается только ПОСЛЕ этого места: GPU-чтение кадра
    // больше не встаёт перед стерео-кадром. Один кадр в полёте.
    this.provider?.pumpAfterRender();
  }

  private resize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const base = this.settings.quality === "high" ? 1.8 : 1.25;
    // В VR ограничиваем плотность пикселей жёстко: пара глаз и так удваивает
    // fill rate. Один раз на входе, без губернатора во время осмотра.
    const dpr = Math.min(window.devicePixelRatio || 1, this.settings.vr ? 1.15 : base);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    if (this.composer) {
      this.composer.setPixelRatio(dpr);
      this.composer.setSize(width, height);
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setInteractive(interactive: boolean) {
    this.settings.interactive = interactive;
    this.renderer.domElement.style.cursor = interactive ? "grab" : "default";
    if (!interactive) {
      this.pointerDrag = false;
      this.activeTarget = null;
    }
  }

  setSource(source: GazeSource) {
    if (this.settings.source === source) return;
    this.settings.source = source;
    this.gyroBase = null;
    this.gyroTarget = { yaw: 0, pitch: 0 };
    this.lastGazeStatus = "pointer";
    if (source === "gyro") {
      this.setGazeStatus("gyro-wait");
    } else if (source === "camera") {
      const sample = this.provider?.getGaze();
      if (!sample || sample.status === "idle") this.setGazeStatus("camera-off");
      else this.setGazeStatus(sample.status === "valid" ? "camera-valid" : sample.status === "held" ? "camera-held" : sample.status === "single" ? "camera-single" : "camera-lost");
    }
  }

  setVr(vr: boolean) {
    const log = ((window as unknown as { __VR_LOG__?: string[] }).__VR_LOG__ ||= []);
    log.push(`setVr(${vr}) at ${Math.round(performance.now())}`);
    this.settings.vr = vr;
    // Профиль фиксируется на входе в VR и не «щёлкает» на ходу. Камера в
    // стерео считается реже: 5–8 Гц достаточно для осмотра мира, а каждый
    // кадр createImageBitmap конкурирует с двумя проходами рендера.
    this.provider?.setVrMode(vr);
    this.applyRenderProfile();
    this.resize();
  }

  setQuality(quality: Quality) {
    this.settings.quality = quality;
    // В VR качество зафиксировано, смена тумблера применится на выходе.
    this.applyRenderProfile();
    this.resize();
  }

  private applyRenderProfile() {
    const vr = this.settings.vr;
    const reduced = this.settings.reducedMotion;
    if (this.keyLight) {
      const size = vr ? 1024 : 2048;
      if (this.keyLight.shadow.mapSize.x !== size) {
        this.keyLight.shadow.mapSize.set(size, size);
        this.keyLight.shadow.map?.dispose();
        (this.keyLight.shadow as unknown as { map: THREE.WebGLRenderTarget | null }).map = null;
      }
    }
    // Меньше крупных аддитивных плоскостей и частиц — вдвое меньше fill rate.
    this.shafts.forEach((shaft, index) => {
      shaft.visible = !vr || index % 2 === 0;
    });
    if (this.marineSnow) {
      const total = this.snowSpeeds?.length ?? 950;
      this.marineSnow.geometry.setDrawRange(0, vr ? Math.floor(total * 0.5) : total);
    }
    this.grassMeshes.forEach((mesh) => {
      mesh.castShadow = !vr;
      mesh.receiveShadow = !vr;
    });
    // Мелкие кораллы в стерео не пишут shadow map: их вклад в тень почти
    // не читается, а каждый кастер — лишний проход по всей сцене.
    this.corals.forEach((mesh) => {
      mesh.castShadow = !vr || !!mesh.userData.bigCoral;
    });
    if (this.bubbles) this.bubbles.visible = !vr;
    this.fishActors.forEach((actor, index) => {
      // В стерео каждый меш рисуется дважды. Часть мелких рыб прячем, но
      // оставляем в observable list — игрок всё равно видит достаточно видов.
      actor.group.visible = !vr || index % 3 !== 2;
    });
    if (vr) {
      // Стерео не должно проходить через bloom и fullscreen composer.
      if (this.bloomPass) this.bloomPass.enabled = false;
    } else if (this.bloomPass) {
      this.bloomPass.enabled = this.settings.quality === "high" && !reduced;
    }
  }

  setReducedMotion(reduced: boolean) {
    this.settings.reducedMotion = reduced;
  }

  setIpd(cm: number) {
    this.settings.ipdCm = THREE.MathUtils.clamp(cm, 3, 16);
  }

  setDiscovered(ids: SpeciesId[]) {
    ids.forEach((id) => this.discovered.add(id));
  }

  recenterView() {
    this.targetYaw = 0;
    this.targetPitch = 0;
  }

  /** QA-хук: перемотать к проходу кита и встать взглядом выше рифа. */
  previewWhale() {
    this.lifeTime = 40;
    this.yaw = 0;
    this.pitch = 0.14;
    this.targetYaw = 0;
    this.targetPitch = 0.16;
  }

  getGaze(): { yaw: number; pitch: number } {
    return { yaw: this.yaw, pitch: this.pitch };
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointercancel", this.onPointerUp);
    canvas.removeEventListener("pointerleave", this.onPointerUp);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVisibility);
    if (this.gyroListening) window.removeEventListener("deviceorientation", this.onDeviceOrientation);
    this.composer?.dispose();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => this.disposeMaterial(m));
      else if (material) this.disposeMaterial(material);
    });
    this.renderer.dispose();
    if (canvas.parentElement === this.container) this.container.removeChild(canvas);
    this.observables = [];
    this.fishActors = [];
    this.schools = [];
    this.swayMaterials = [];
    this.waterMaterials = [];
    this.jellyfish = [];
  }

  private disposeMaterial(material: THREE.Material) {
    const withMaps = material as THREE.Material & Record<string, unknown>;
    Object.keys(withMaps).forEach((key) => {
      const value = withMaps[key];
      if (value instanceof THREE.Texture) value.dispose();
    });
    material.dispose();
  }
}
