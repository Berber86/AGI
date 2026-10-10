import * as THREE from "three";
import { erodedRock, sandTexture } from "./landscape.js";
import { RenderPipeline } from "./render-pipeline.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createRelicModel } from "./relic-model.js";
import { resolveMovement } from "./navigation.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const SITES = [
  {
    id: "memory",
    name: "Осколок памяти",
    position: [7, 1.9, 10],
    code: "E–07.01",
    age: "≈ 84 000 лет",
    glyphs: [1, 3, 0],
    story:
      "Они не строили храмы. Они строили хранилища воспоминаний. Каждый камень этого города помнит чью-то жизнь — от первого взгляда на звёзды до последнего вдоха.",
    description:
      "Обсидиановая пластина. Внутри кристаллической решётки сохранились последовательности неизвестного языка.",
  },
  {
    id: "navigator",
    name: "Звёздный компас",
    position: [14, 2.0, -8],
    code: "E–07.02",
    age: "≈ 86 400 лет",
    glyphs: [2, 0, 3],
    story:
      "Звёздная карта указывает не на другие миры, а на этот. Эребус был последним убежищем. Они пришли сюда из системы, которой больше нет на наших картах.",
    description:
      "Навигационное кольцо из сплава, не встречающегося в природе. Его центр по-прежнему ориентирован на погасшую звезду.",
  },
  {
    id: "heart",
    name: "Сердце архива",
    position: [1, 3.5, -25],
    code: "E–07.03",
    age: "≈ 83 900 лет",
    glyphs: [3, 1, 2],
    story:
      "Последняя запись: «Мы не просим вернуть нас. Только помните, что мы были. Что мы любили этот свет. Что однажды кто-то посмотрит на наши камни — и мы снова станем частью вселенной».",
    description:
      "Узел центрального архива. Слабый импульс повторяется каждые 17 секунд — словно он всё ещё ждёт ответа.",
  },
];

function random(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function noise(x, z) {
  return (
    Math.sin(x * 0.034 + Math.cos(z * 0.027) * 2.1) *
      Math.cos(z * 0.042) *
      2.3 +
    Math.sin(x * 0.095 + z * 0.071) * 0.55 +
    Math.sin(x * 0.32 - z * 0.27) * 0.13
  );
}
export function groundHeight(x, z) {
  const flat = 1 - Math.exp(-(x * x + z * z) / 7000);
  return noise(x, z) * (0.2 + flat * 0.8) - 1.4;
}

export class World {
  constructor(container, { onReady, onFrame, onError }) {
    this.container = container;
    this.onFrame = onFrame;
    this.elapsed = 0;
    this.keys = new Set();
    this.enabled = true;
    this.scanning = false;
    this.scanTime = -100;
    this.quality = innerWidth < 760 ? "low" : "high";
    this.sensitivity = 1;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.colliders = [];
    this.rand = random(717);
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x8eaaa9, 0.0048);
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch (e) {
      onError(e);
      return;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      53,
      innerWidth / innerHeight,
      0.2,
      1800,
    );
    this.camera.position.set(27, 10.5, 49);
    this.camera.lookAt(0, 10, -23);
    this.camera.rotation.order = "YXZ";
    this.yaw = this.camera.rotation.y;
    this.pitch = this.camera.rotation.x;
    this.targetY = this.yaw;
    this.targetP = this.pitch;
    this.startPosition = this.camera.position.clone();
    this.startYaw = this.yaw;
    this.startPitch = this.pitch;
    this.uniforms = {
      time: { value: 0 },
      scanRadius: { value: -100 },
      scanOrigin: { value: new THREE.Vector3() },
      scanActive: { value: 0 },
    };
    this.buildSky();
    this.buildLights();
    this.buildGround();
    this.buildMountains();
    this.buildArchitecture();
    this.mergeStatic();
    this.buildRocks();
    this.buildRelics();
    this.buildAtmosphere();
    this.pipeline = new RenderPipeline(this.renderer, this.scene, this.camera);
    this.setQuality(this.quality);
    this.bindControls();
    this.clock = new THREE.Clock();
    this.resize = () => {
      this.needsRender = true;
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.pipeline.configure(this.quality, innerWidth, innerHeight);
    };
    window.addEventListener("resize", this.resize);
    this.renderer.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      cancelAnimationFrame(this.raf);
      onError(new Error("Контекст WebGL потерян. Перезагрузите экспедицию."));
    });
    this.animate();
    setTimeout(onReady, 500);
  }
  buildSky() {
    const geo = new THREE.SphereGeometry(850, 48, 32);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color("#19394e") },
        bottom: { value: new THREE.Color("#b9c4b7") },
        sunDir: { value: new THREE.Vector3(-0.65, 0.17, -0.65).normalize() },
      },
      vertexShader: `varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 vDirection;uniform vec3 top;uniform vec3 bottom;uniform vec3 sunDir;void main(){vec3 d=normalize(vDirection);float h=max(d.y,0.);vec3 c=mix(bottom,top,pow(h,.48));float s=max(dot(d,sunDir),0.);c+=vec3(.17,.105,.045)*pow(s,14.)+vec3(.23,.18,.10)*pow(s,100.);float dust=sin(d.x*35.+d.y*60.)*.5+sin(d.z*65.+d.y*19.)*.5;c+=dust*.006;gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
    });
    this.scene.add(new THREE.Mesh(geo, mat));
    const starPos = [];
    for (let i = 0; i < 1800; i++) {
      const x = (this.rand() - 0.5) * 1400,
        y = this.rand() * 650 + 30,
        z = (this.rand() - 0.5) * 1400;
      starPos.push(x, y, z);
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPos, 3),
    );
    this.scene.add(
      new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({
          size: 0.65,
          color: 0xdbdfc5,
          transparent: true,
          opacity: 0.55,
          sizeAttenuation: true,
          depthWrite: false,
          fog: false,
        }),
      ),
    );
    const planet = new THREE.Group();
    planet.position.set(145, 153, -510);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(74, 72, 48),
      new THREE.ShaderMaterial({
        uniforms: {
          light: { value: new THREE.Vector3(-1, 0.25, 0.65).normalize() },
        },
        vertexShader: `varying vec3 vN;varying vec3 vP;void main(){vN=normal;vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vN;varying vec3 vP;uniform vec3 light;void main(){float f=sin(vP.y*.21+sin(vP.x*.08)*1.2)+sin(vP.y*.57+cos(vP.z*.08))*.25;vec3 c=mix(vec3(.27,.31,.31),vec3(.66,.66,.52),f*.23+.5);float l=pow(max(dot(vN,light),0.),.65);float rim=pow(1.-max(vN.z,0.),3.);c=c*(l*.85+.13)+vec3(.10,.16,.17)*rim;gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
      }),
    );
    planet.add(sphere);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(88, 136, 160),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        vertexShader: `varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 p;void main(){float r=length(p.xy);float n=sin(r*7.)*.15/(1.+fwidth(r)*7.)+sin(r*22.)*.1/(1.+fwidth(r)*22.)+.55;float gaps=smoothstep(0.,2.,abs(r-112.));float a=n*gaps*(1.-smoothstep(127.,136.,r))*smoothstep(88.,93.,r);gl_FragColor=vec4(vec3(.68,.66,.50)*(.65+n*.3),a*.65);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,
      }),
    );
    ring.rotation.set(1.12, 0.28, -0.27);
    planet.add(ring);
    planet.rotation.z = -0.23;
    this.scene.add(planet);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0xccc9b0, fog: false }),
    );
    moon.position.set(-390, 190, -550);
    this.scene.add(moon);
  }
  buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xc0dfef, 0x5b4831, 1.65));
    const sun = new THREE.DirectionalLight(0xffd5a6, 4.5);
    sun.position.set(-55, 38, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {
      left: -65,
      right: 65,
      top: 65,
      bottom: -65,
      near: 1,
      far: 220,
    });
    sun.shadow.normalBias = 0.045;
    sun.shadow.radius = 2;
    sun.shadow.bias = -0.0003;
    sun.target.position.set(0, 0, -12);
    this.scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight(0x8ec5de, 0.65);
    fill.position.set(40, 18, 60);
    this.scene.add(fill);
  }
  buildGround() {
    const g = new THREE.PlaneGeometry(700, 700, 230, 230);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    const colors = [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i);
      p.setY(i, groundHeight(x, z));
      const v = 0.68 + noise(x * 2, z * 2) * 0.038;
      colors.push(v * 1.06, v * 1.03, v * 0.89);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    const tex = sandTexture();
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd2b693,
      vertexColors: true,
      roughness: 1,
      map: tex,
      bumpMap: tex,
      bumpScale: 0.095,
    });
    mat.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, this.uniforms);
      s.vertexShader = "varying vec3 vWorld;\n" + s.vertexShader;
      s.vertexShader = s.vertexShader.replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvWorld=(modelMatrix*vec4(transformed,1.0)).xyz;",
      );
      s.fragmentShader =
        "varying vec3 vWorld;uniform float scanRadius;uniform vec3 scanOrigin;uniform float scanActive;\n" +
        s.fragmentShader;
      s.uniforms.footings = {
        value: Array.from({ length: 12 }, (_, i) => {
          const c = this.colliders[i];
          return c
            ? new THREE.Vector3(c.x, c.z, c.radius)
            : new THREE.Vector3(10000, 10000, 0);
        }),
      };
      s.fragmentShader = "uniform vec3 footings[12];\n" + s.fragmentShader;
      s.fragmentShader = s.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float weather = sin(vWorld.x*.065 + sin(vWorld.z*.047)*2.) * sin(vWorld.z*.09);
        diffuseColor.rgb *= .94 + weather*.09;
        float contact = 1.;
        for(int i=0;i<12;i++) {
          float d = length(vWorld.xz-footings[i].xy) / max(.1,footings[i].z);
          contact *= 1.-.36*exp(-d*d*.9);
        }
        diffuseColor.rgb *= contact;
      `,
      );
      s.fragmentShader = s.fragmentShader.replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>\nfloat d=distance(vWorld.xz,scanOrigin.xz);float band=exp(-pow((d-scanRadius)*.5,2.))*scanActive;float grid=pow(abs(sin(vWorld.x*.8)*sin(vWorld.z*.8)),18.);gl_FragColor.rgb+=vec3(.28,.65,.47)*band*(.5+grid*.9);`,
      );
    };
    const ground = new THREE.Mesh(g, mat);
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  stone(color = 0x727366) {
    if (!this.rockTexture) {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const ctx = c.getContext("2d");
      const img = ctx.createImageData(256, 256);
      const grids = [4, 16, 64, 256].map((size) => ({
        size,
        data: Float32Array.from({ length: size * size }, () => this.rand()),
      }));
      const sample = (g, x, y) => {
        x = (x / 256) * g.size;
        y = (y / 256) * g.size;
        const ix = Math.floor(x),
          iy = Math.floor(y),
          fx = x - ix,
          fy = y - iy;
        const at = (a, b) => g.data[(a % g.size) + (b % g.size) * g.size];
        return (
          (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) +
          (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy
        );
      };
      for (let y = 0; y < 256; y++)
        for (let x = 0; x < 256; x++) {
          let n =
            sample(grids[0], x, y) * 0.35 +
            sample(grids[1], x, y) * 0.3 +
            sample(grids[2], x, y) * 0.2 +
            sample(grids[3], x, y) * 0.15;
          const i = (x + y * 256) * 4;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = n * 255;
          img.data[i + 3] = 255;
        }
      ctx.putImageData(img, 0, 0);
      this.rockTexture = new THREE.CanvasTexture(c);
      this.rockTexture.wrapS = this.rockTexture.wrapT = THREE.RepeatWrapping;
      this.rockTexture.anisotropy = 4;
    }
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.94,
      metalness: 0.08,
      flatShading: false,
    });
    mat.onBeforeCompile = (s) => {
      s.uniforms.rockMap = { value: this.rockTexture };
      s.vertexShader = "varying vec3 vStoneWorld;\n" + s.vertexShader;
      s.vertexShader = s.vertexShader.replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvec4 rockLocal=vec4(transformed,1.);\n#ifdef USE_INSTANCING\nrockLocal=instanceMatrix*rockLocal;\n#endif\nvStoneWorld=(modelMatrix*rockLocal).xyz;",
      );
      s.fragmentShader =
        `varying vec3 vStoneWorld;
      uniform sampler2D rockMap;
      float rockNoise(vec3 p){return texture2D(rockMap,vec2(p.x+p.y*.31,p.z+p.y*.73)*.075).r;}
      ` + s.fragmentShader;
      s.fragmentShader = s.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
      vec3 rp=vStoneWorld;
      float coarse=rockNoise(rp*.72),medium=rockNoise(rp*3.5),grain=rockNoise(rp*24.);
      float stratum=pow(abs(sin(rp.y*8.+coarse*7.+rp.x*.5)),16.);
      float pits=smoothstep(.65,.83,medium)*.3;
      diffuseColor.rgb*=.66+coarse*.42+medium*.27+grain*.21-pits-stratum*.09;
      diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.1,.98,.83),coarse*.35);
      `,
      );
      s.fragmentShader = s.fragmentShader.replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
      float relief=rockNoise(vStoneWorld*4.)*.09+rockNoise(vStoneWorld*22.)*.015;
      vec3 dpdx=dFdx(vViewPosition), dpdy=dFdy(vViewPosition);
      vec3 sx=cross(dpdy,normal), sy=cross(normal,dpdx);
      float det=dot(dpdx,sx);
      normal=normalize(abs(det)*normal-sign(det)*(dFdx(relief)*sx+dFdy(relief)*sy));
      `,
      );
    };
    return mat;
  }
  buildMountains() {
    const mat = this.stone(0x737c74);
    // Continuous eroded ridges rather than isolated low-poly cones.
    for (let side = 0; side < 3; side++) {
      const geo = new THREE.PlaneGeometry(560, 160, 170, 52);
      geo.rotateX(-Math.PI / 2);
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i),
          z = p.getZ(i),
          ridge = Math.sin(((z + 80) / 160) * Math.PI);
        const profile =
          25 +
          Math.sin(x * 0.028) * 13 +
          Math.sin(x * 0.077 + 2) * 9 +
          Math.sin(x * 0.19) * 3;
        const rugged =
          Math.sin(x * 0.53 + z * 0.36) * 1.4 +
          Math.sin(x * 0.91 - z * 0.73) * 0.7 +
          noise(x * 3, z * 3) * 1.4;
        p.setY(
          i,
          Math.max(
            -4,
            Math.pow(Math.max(0, ridge), 1.9) * profile + rugged - 4,
          ),
        );
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        side === 1 ? -260 : side === 2 ? 260 : 0,
        0,
        side === 0 ? -205 : -70,
      );
      m.rotation.y = side === 0 ? 0 : Math.PI / 2;
      m.receiveShadow = true;
      this.scene.add(m);
    }
    const cliffMat = this.stone(0x626e65);
    for (let i = 0; i < 27; i++) {
      const x = -130 + i * 10,
        z = -118 + Math.sin(i * 0.6) * 15,
        h = 8 + this.rand() * 20;
      const g = erodedRock(6, i * 0.83);
      const m = new THREE.Mesh(g, cliffMat);
      m.scale.set(11 + this.rand() * 9, h, 12);
      m.position.set(x, h * 0.25 - 1, z);
      m.rotation.set(this.rand() * 0.4, this.rand() * 6, 0.15);
      m.castShadow = true;
      this.scene.add(m);
    }
  }
  mergeStatic() {
    this.scene.updateMatrixWorld(true);
    const groups = new Map();
    const originals = [];
    this.scene.traverse((o) => {
      if (o.isMesh && o.material.isMeshStandardMaterial && !o.isInstancedMesh) {
        const key = o.material.uuid;
        if (!groups.has(key))
          groups.set(key, { material: o.material, geometries: [] });
        let geo = o.geometry.index
          ? o.geometry.toNonIndexed()
          : o.geometry.clone();
        geo.applyMatrix4(o.matrixWorld);
        groups.get(key).geometries.push(geo);
        originals.push(o);
      }
    });
    for (const o of originals) o.removeFromParent();
    for (const { material, geometries } of groups.values()) {
      const merged = mergeGeometries(geometries, false);
      if (merged) {
        const m = new THREE.Mesh(merged, material);
        m.castShadow = true;
        m.receiveShadow = true;
        this.scene.add(m);
      }
      geometries.forEach((g) => g.dispose());
    }
  }
  block(parent, dimensions, position, material, rotation = 0) {
    const m = new THREE.Mesh(
      Math.min(...dimensions) > 0.45
        ? new RoundedBoxGeometry(...dimensions, 1, 0.075)
        : new THREE.BoxGeometry(...dimensions),
      material,
    );
    m.position.set(...position);
    m.rotation.y = rotation;
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  buildArchitecture() {
    this.ruins = new THREE.Group();
    this.ruins.position.set(0, 0, -28);
    this.scene.add(this.ruins);
    const stone = this.stone(0x797968),
      lightStone = this.stone(0x99927a),
      darkStone = this.stone(0x3e514c),
      edge = this.stone(0xa89d79);
    const glow = new THREE.MeshStandardMaterial({
      color: 0x8fae91,
      emissive: 0xb2e4b8,
      emissiveIntensity: 1.4,
      roughness: 0.6,
    });
    // An ancient, segmented archive gate. Every block is actual geometry.
    const gate = new THREE.Group();
    gate.rotation.z = -0.065;
    this.ruins.add(gate);
    const parts = 28;
    for (let i = 0; i < parts; i++) {
      if ([1, 2, 18, 19, 20].includes(i)) continue;
      const a = (i / parts) * Math.PI * 2 + 0.01,
        b = ((i + 1) / parts) * Math.PI * 2 - 0.018;
      const shape = new THREE.Shape();
      const r1 = 10.1,
        r2 = 13.25;
      shape.moveTo(Math.cos(a) * r1, Math.sin(a) * r1 + 13);
      shape.lineTo(Math.cos(a) * r2, Math.sin(a) * r2 + 13);
      for (let j = 1; j <= 5; j++) {
        const ang = a + ((b - a) * j) / 5;
        shape.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2 + 13);
      }
      shape.lineTo(Math.cos(b) * r1, Math.sin(b) * r1 + 13);
      for (let j = 4; j >= 0; j--) {
        const ang = a + ((b - a) * j) / 5;
        shape.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1 + 13);
      }
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 3.2,
        bevelEnabled: true,
        bevelThickness: 0.13,
        bevelSize: 0.13,
        bevelSegments: 1,
        steps: 1,
      });
      const m = new THREE.Mesh(geo, i % 4 === 0 ? lightStone : stone);
      m.position.z = -1.5;
      m.castShadow = true;
      m.receiveShadow = true;
      gate.add(m);
      const mid = (a + b) / 2;
      const trim = this.block(
        gate,
        [0.06, 2.5, 0.08],
        [Math.cos(mid) * 11.7, Math.sin(mid) * 11.7 + 13, 1.9],
        edge,
      );
      trim.rotation.z = mid - Math.PI / 2;
      const notch = this.block(
        gate,
        [0.1, 0.5, 0.045],
        [Math.cos(mid) * 10.65, Math.sin(mid) * 10.65 + 13, 1.88],
        glow,
      );
      notch.rotation.z = mid - Math.PI / 2;
      if (i % 2 === 0) {
        const panel = this.block(
          gate,
          [0.65, 1.35, 0.14],
          [Math.cos(mid) * 11.65, Math.sin(mid) * 11.65 + 13, 1.84],
          darkStone,
        );
        panel.rotation.z = mid - Math.PI / 2;
        for (let k = 0; k < 3; k++) {
          const g = this.block(
            panel,
            [0.26, 0.035, 0.02],
            [0, -0.35 + k * 0.3, 0.09],
            edge,
          );
          g.rotation.z = k % 2 ? 0.7 : -0.7;
        }
      }
    }
    const innerTrace = new THREE.Mesh(
      new THREE.TorusGeometry(10.02, 0.026, 5, 72, Math.PI * 1.4),
      glow,
    );
    innerTrace.position.set(0, 13, 1.84);
    innerTrace.rotation.z = 0.74;
    gate.add(innerTrace);
    // Buttresses, split crowns, and a terraced processional platform.
    for (const x of [-12.6, 12.6]) {
      this.colliders.push({ x, z: -28, radius: 2.3 });
      this.block(this.ruins, [5.3, 1.5, 8.3], [x, 0, 0], stone, 0.04);
      this.block(this.ruins, [3.5, 8, 4.8], [x, 4, 0], stone);
      this.block(this.ruins, [4.2, 0.65, 5.4], [x, 7.8, 0], edge);
      this.block(
        this.ruins,
        [1.4, 11, 2],
        [x + (x < 0 ? -1.7 : 1.7), 5.5, -0.8],
        darkStone,
      );
      this.block(this.ruins, [0.12, 6, 0.09], [x, 4, 2.43], glow);
    }
    for (let i = 0; i < 4; i++) {
      this.block(
        this.ruins,
        [23 - i * 2, 0.48, 11 - i * 0.8],
        [0, -0.75 + i * 0.43, 3],
        i % 2 ? stone : lightStone,
      );
    }
    this.block(this.ruins, [3.8, 2.4, 3.2], [1, 1.5, 3], darkStone, 0.1);
    this.block(this.ruins, [4.2, 0.4, 3.8], [1, 2.9, 3], edge, 0.1);
    for (let i = 0; i < 12; i++) {
      const z = 8 + i * 3.9;
      for (let j = 0; j < 3; j++) {
        if (this.rand() > 0.86) continue;
        const m = this.block(
          this.ruins,
          [2.2 + this.rand() * 0.9, 0.28 + this.rand() * 0.15, 3.2],
          [
            (j - 1) * 3 + (this.rand() - 0.5) * 0.3,
            groundHeight(0, z - 28) + 0.12,
            z,
          ],
          i % 3 ? stone : lightStone,
          (this.rand() - 0.5) * 0.09,
        );
        m.rotation.z = (this.rand() - 0.5) * 0.05;
      }
    }
    for (let i = 0; i < 8; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = 12 + Math.floor(i / 2) * 10;
      const height = i < 4 ? 8 + this.rand() * 6 : 3 + this.rand() * 5;
      const x = side * (10 + this.rand() * 3);
      this.colliders.push({ x, z: z - 28, radius: 1.8 });
      this.block(this.ruins, [3.7, 0.7, 3.7], [x, -0.6, z], stone);
      const p = this.block(
        this.ruins,
        [1.9, height, 2.1],
        [x, height / 2 - 0.8, z],
        stone,
        side * 0.03,
      );
      p.rotation.z = side * (0.05 + this.rand() * 0.13);
      this.block(p, [0.11, height * 0.55, 0.06], [0, 0, 1.09], glow);
      this.block(p, [2.1, 0.4, 2.3], [0, height / 2 - 0.5, 0], edge);
      for (let k = 0; k < 3; k++)
        this.block(
          p,
          [0.7, 0.035, 0.05],
          [0.2, k * 0.35 + height * 0.19, 1.08],
          darkStone,
        );
    }
    // Collapsed columns and a distant architectural silhouette.
    for (let i = 0; i < 20; i++) {
      const x = (this.rand() - 0.5) * 50,
        z = this.rand() * 44 - 7;
      const m = this.block(
        this.ruins,
        [1 + this.rand() * 3, 1 + this.rand() * 2, 1 + this.rand() * 4],
        [x, -0.2, z],
        stone,
        this.rand() * 6,
      );
      m.rotation.z = this.rand() * 0.4;
      m.rotation.x = this.rand() * 0.3;
    }
    const distant = new THREE.Group();
    distant.position.set(-63, 0, -65);
    this.scene.add(distant);
    for (let i = 0; i < 5; i++) {
      const h = i === 0 || i === 4 ? 21 : 10 + this.rand() * 11;
      this.block(
        distant,
        [4, h, 4],
        [i * 5, h / 2 - 2, (i % 2) * 4],
        darkStone,
        i * 0.04,
      );
    }
    this.block(distant, [28, 2, 5], [10, 19, 0], stone, -0.07);
    const splinter = this.block(
      this.scene,
      [5, 21, 6],
      [43, 6, -48],
      darkStone,
      0.2,
    );
    splinter.rotation.z = -0.35;
    this.block(splinter, [0.15, 16, 0.1], [0, 0, 3.06], glow);
    this.gateGlow = new THREE.PointLight(0xaeddb0, 15, 22, 2);
    this.gateGlow.position.set(0, 10, -23);
    this.scene.add(this.gateGlow);
  }
  buildRocks() {
    const count = 1700;
    const geo = erodedRock(2, 3);
    const mat = this.stone(0x7b8275);
    const rocks = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const x = (this.rand() - 0.5) * 220,
        z = (this.rand() - 0.5) * 230 - 15;
      let size = Math.pow(this.rand(), 3) * 2.6 + 0.06;
      if (Math.abs(x) < 5 && z > -20 && z < 25) size *= 0.3;
      dummy.position.set(x, groundHeight(x, z) + size * 0.1, z);
      dummy.scale.set(
        size * (1 + this.rand()),
        size * (0.5 + this.rand() * 0.5),
        size * (0.7 + this.rand()),
      );
      dummy.rotation.set(this.rand() * 3, this.rand() * 6, this.rand() * 2);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
      const v = 0.65 + this.rand() * 0.24;
      color.setRGB(v * 0.92, v, v * 0.89);
      rocks.setColorAt(i, color);
    }
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    this.scene.add(rocks);
    // Deliberately framed foreground rocks give the environment weight and scale.
    for (const [x, z, s] of [
      [-13, 46, 5.5],
      [29, 28, 3.1],
      [-28, 24, 4.8],
      [43, 48, 5],
      [-2, 55, 3.3],
    ]) {
      const m = new THREE.Mesh(erodedRock(5, x), this.stone(0x64746d));
      m.scale.set(s * 1.5, s * 0.75, s);
      m.position.set(x, groundHeight(x, z), z);
      m.rotation.set(0.3, x, 0.2);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    }
  }
  buildRelics() {
    this.relics = [];
    const stone = this.stone(0x425a51);
    for (let i = 0; i < SITES.length; i++) {
      const s = SITES[i];
      const group = new THREE.Group();
      group.position.set(...s.position);
      this.scene.add(group);
      const core = createRelicModel(i);
      group.add(core);
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.8, 1.4, 6),
        stone,
      );
      pedestal.position.y = -1.7;
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      group.add(pedestal);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.018, 4, 64),
        new THREE.MeshBasicMaterial({
          color: 0xd6c297,
          transparent: true,
          opacity: 0.5,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.7;
      group.add(ring);
      const point = new THREE.PointLight(0xc4e7a4, 6, 9);
      group.add(point);
      this.relics.push({
        group,
        core,
        ring,
        point,
        baseY: s.position[1],
        collected: false,
      });
    }
  }
  buildAtmosphere() {
    const pos = [],
      phase = [];
    for (let i = 0; i < 600; i++) {
      pos.push(
        (this.rand() - 0.5) * 130,
        this.rand() * 25,
        (this.rand() - 0.5) * 140,
      );
      phase.push(this.rand() * Math.PI * 2);
    }
    this.dustPhases = phase;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const ctx = c.getContext("2d");
    const grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, "rgba(235,224,182,1)");
    grd.addColorStop(0.2, "rgba(235,224,182,.4)");
    grd.addColorStop(1, "rgba(235,224,182,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 32, 32);
    this.dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.1,
        map: new THREE.CanvasTexture(c),
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xd8d7b4,
      }),
    );
    this.scene.add(this.dust);
  }
  bindControls() {
    const canvas = this.renderer.domElement;
    let dragging = false,
      lastX = 0,
      lastY = 0;
    canvas.addEventListener("pointerdown", (e) => {
      if (!this.enabled) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!dragging || !this.enabled) return;
      this.targetY -= (e.clientX - lastX) * 0.003 * this.sensitivity;
      this.targetP -= (e.clientY - lastY) * 0.0025 * this.sensitivity;
      this.targetP = THREE.MathUtils.clamp(this.targetP, -0.65, 0.65);
      lastX = e.clientX;
      lastY = e.clientY;
    });
    const stop = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    canvas.style.cursor = "grab";
    window.addEventListener("keydown", (e) => {
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(
          document.activeElement?.tagName,
        )
      )
        return;
      if (
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "ShiftLeft",
        ].includes(e.code)
      ) {
        if (this.enabled) e.preventDefault();
        this.keys.add(e.code);
      }
    });
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
    window.addEventListener("blur", () => {
      this.keys.clear();
      stop();
    });
  }
  scan() {
    this.scanTime = this.elapsed;
    this.uniforms.scanOrigin.value.copy(this.camera.position);
    this.scanning = true;
  }
  focusSite(index) {
    const target = new THREE.Vector3(...SITES[index].position);
    const direction = this.camera.position.clone().sub(target);
    direction.y = 0;
    direction.normalize();
    if (direction.length() < 0.1) direction.set(0, 0, 1);
    this.travel = {
      start: this.camera.position.clone(),
      end: target
        .clone()
        .addScaledVector(direction, 9)
        .add(new THREE.Vector3(0, 3, 0)),
      target,
      time: 0,
    };
  }
  resetView() {
    this.camera.position.copy(this.startPosition);
    this.targetY = this.startYaw;
    this.targetP = this.startPitch;
    this.travel = null;
  }
  setQuality(q) {
    this.needsRender = true;
    this.quality = q;
    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio, q === "high" ? 1.65 : 1),
    );
    this.renderer.shadowMap.enabled = q === "high";
    this.renderer.shadowMap.needsUpdate = true;
    this.dust.visible = q === "high";
    this.pipeline.configure(q, innerWidth, innerHeight);
    this.scene.traverse((o) => {
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => (m.needsUpdate = true));
      }
    });
  }
  collect(index) {
    this.relics[index].collected = true;
    this.relics[index].point.intensity = 2;
  }
  project(position) {
    const p = new THREE.Vector3(...position);
    p.y += 2;
    p.project(this.camera);
    return {
      x: (p.x * 0.5 + 0.5) * innerWidth,
      y: (-p.y * 0.5 + 0.5) * innerHeight,
      visible:
        p.z < 1 && p.z > 0 && Math.abs(p.x) < 0.91 && Math.abs(p.y) < 0.78,
    };
  }
  distance(index) {
    return this.camera.position.distanceTo(
      new THREE.Vector3(...SITES[index].position),
    );
  }
  animate = () => {
    this.raf = requestAnimationFrame(this.animate);
    const rawDt = this.clock.getDelta();
    let dt = Math.min(rawDt, 0.05);
    this.elapsed += rawDt;
    const t = this.elapsed;
    this.uniforms.time.value = t;
    if (this.enabled) {
      if (this.travel) {
        const a = this.travel;
        a.time += rawDt * 0.65;
        const f = THREE.MathUtils.smoothstep(a.time, 0, 1);
        this.camera.position.lerpVectors(a.start, a.end, f);
        const look = new THREE.Matrix4().lookAt(
          this.camera.position,
          a.target,
          new THREE.Vector3(0, 1, 0),
        );
        const euler = new THREE.Euler().setFromRotationMatrix(look, "YXZ");
        this.targetY = euler.y;
        this.targetP = euler.x;
        if (a.time >= 1) this.travel = null;
      } else {
        const k = this.keys;
        const f =
          Number(k.has("KeyW") || k.has("ArrowUp")) -
          Number(k.has("KeyS") || k.has("ArrowDown"));
        const s =
          Number(k.has("KeyD") || k.has("ArrowRight")) -
          Number(k.has("KeyA") || k.has("ArrowLeft"));
        if (f || s) {
          const speed = (k.has("ShiftLeft") ? 12 : 6) * dt;
          const n = Math.hypot(f, s);
          const next = resolveMovement(
            this.camera.position,
            {
              x:
                ((Math.sin(this.targetY) * -f + Math.cos(this.targetY) * s) *
                  speed) /
                n,
              z:
                ((-Math.cos(this.targetY) * f - Math.sin(this.targetY) * s) *
                  speed) /
                n,
            },
            this.colliders,
          );
          this.camera.position.x = next.x;
          this.camera.position.z = next.z;
          const gy =
            groundHeight(this.camera.position.x, this.camera.position.z) + 4.5;
          this.camera.position.y = THREE.MathUtils.lerp(
            this.camera.position.y,
            gy,
            0.6 * dt,
          );
        }
      }
    }
    const blend = 1 - Math.exp(-dt * 9);
    this.yaw = THREE.MathUtils.lerp(this.yaw, this.targetY, blend);
    this.pitch = THREE.MathUtils.lerp(this.pitch, this.targetP, blend);
    this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
    const st = t - this.scanTime;
    this.uniforms.scanRadius.value = st * 27;
    this.uniforms.scanActive.value =
      st < 4.2 ? Math.min(1, st * 4) * Math.min(1, (4.2 - st) * 2) : 0;
    if (st > 4.2) this.scanning = false;
    if (!this.reducedMotion && this.enabled) {
      for (let i = 0; i < this.relics.length; i++) {
        const r = this.relics[i];
        r.core.rotation.y = t * 0.2 + i;
        r.core.position.y = Math.sin(t * 0.8 + i) * 0.12;
        r.ring.rotation.z = t * 0.08;
        r.ring.material.opacity = 0.3 + Math.sin(t * 1.4) * 0.15;
      }
      const pos = this.dust.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        pos.setX(i, pos.getX(i) + dt * 0.23);
        if (pos.getX(i) > 65) pos.setX(i, -65);
      }
      pos.needsUpdate = true;
    }
    if (this.enabled || this.scanning || this.needsRender) {
      this.pipeline.render();
      this.needsRender = false;
    }
    this.onFrame?.(t, dt);
  };
}
