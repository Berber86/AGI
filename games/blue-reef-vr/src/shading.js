// Подводный свет: общие uniform-ы, каустика, покачивание и водная среда.
// Всё сделано вставками в обычный MeshStandardMaterial (onBeforeCompile), чтобы
// сохранить PBR-освещение three.js и не городить отдельный ShaderMaterial.
import * as THREE from 'three';
import { WORLD } from './config.js';
import { WATER_DECL, GRADE_DECL, waterUniforms } from './water.js';

// Один объект uniform-ов на всю сцену: время и настройки воды меняются в одном
// месте, а не рассылаются по сотне материалов.
export const water = {
  uTime: { value: 0 },
  uCaustic: { value: 0.25 },
  uCausticScale: { value: 6.5 },
  uCausticSharp: { value: 1.0 },
  uCausticColor: { value: new THREE.Color(0xcdf3ff) },
};

const CAUSTIC_GLSL = /* glsl */`
#ifndef CAUSTIC_OCTAVES
#define CAUSTIC_OCTAVES 3
#endif
// Солнечные зайчики: сумма сдвинутых синусов.
//
// Классическая формула из shadertoy (через 1/length(..., inten)) здесь не
// годилась: её рисунок живёт только в узком диапазоне |p| ~ 200, а при
// мировых координатах вырождается в ровную засветку. Замер это подтвердил:
// выключение каустики меняло детальность кадра на 0.2 %, то есть узора не было
// вообще — только постоянная добавка.
//
// Этот вариант устойчив при любых координатах: период задаётся масштабом p,
// октавы добавляют более мелкую сетку.
float rbCaustic(vec2 p, float t) {
  float v = 0.0;
  float amp = 1.0;
  for (int i = 0; i < CAUSTIC_OCTAVES; i++) {
    float fi = float(i);
    vec2 q = p * (1.0 + fi * 0.85) + vec2(cos(t * (0.55 + fi * 0.23)), sin(t * (0.47 + fi * 0.19))) * 1.7;
    float s = sin(q.x + sin(q.y * 0.9 + t * 0.65)) * sin(q.y + sin(q.x * 1.1 - t * 0.55));
    v += pow(max(s, 0.0), 3.0) * amp;
    amp *= 0.65;
  }
  return clamp(v * 2.6, 0.0, 3.0);
}
`;

const WAVE_DECL = /* glsl */`
attribute float aWave;
#ifdef USE_INSTANCING
attribute float aPhase;
#endif
uniform float uWaveAmp;
uniform float uWaveFreq;
uniform float uWaveSpeed;
uniform float uPhase;
`;

const WAVE_BODY = /* glsl */`
  {
    float ph = uPhase;
    #ifdef USE_INSTANCING
      ph = aPhase;
    #endif
    float s = sin(uTime * uWaveSpeed - transformed.z * uWaveFreq + ph);
    transformed.x += uWaveAmp * aWave * s;
    transformed.y += uWaveAmp * aWave * 0.10 * cos(uTime * uWaveSpeed * 0.7 + ph);
  }
`;

const WAVE_SWAY = /* glsl */`
  {
    float ph = uPhase;
    #ifdef USE_INSTANCING
      ph = aPhase;
    #endif
    float s = sin(uTime * uWaveSpeed + ph);
    float c = cos(uTime * uWaveSpeed * 0.83 + ph * 1.3);
    transformed.x += uWaveAmp * aWave * s;
    transformed.z += uWaveAmp * aWave * 0.7 * c;
  }
`;

// Рисунок окраса считается в шейдере по координатам тела: так рыбы получают
// полосы, пятна и переливы без единой текстуры.
const PATTERN_GLSL = /* glsl */`
uniform float uPattern;
uniform vec3 uPatternColor;
uniform vec3 uPatternColor2;
uniform float uPatternScale;
varying vec3 vRbLocal;

float bandMask(float t, float center, float width, float soft) {
  return 1.0 - smoothstep(width, width + soft, abs(t - center));
}
float stripeMask(float t, float period, float width) {
  float f = abs(fract(t / period) - 0.5);
  return 1.0 - smoothstep(width, width + 0.05, f);
}
`;

const PATTERN_BODY = /* glsl */`
  {
    float t = clamp(vRbLocal.z + 0.5, 0.0, 1.0);      // 0 — хвост, 1 — нос
    float y = clamp(vRbLocal.y / max(0.001, uPatternScale) + 0.5, 0.0, 1.0);
    vec3 c = diffuseColor.rgb;
    if (uPattern > 0.5 && uPattern < 1.5) {
      // рыба-клоун: три белые полосы с тёмной окантовкой
      float w = bandMask(t, 0.74, 0.055, 0.03) + bandMask(t, 0.45, 0.06, 0.03) + bandMask(t, 0.17, 0.05, 0.03);
      float dark = bandMask(t, 0.80, 0.022, 0.02) + bandMask(t, 0.51, 0.024, 0.02) + bandMask(t, 0.23, 0.02, 0.02);
      c = mix(c, uPatternColor, clamp(w, 0.0, 1.0) * 0.95);
      c = mix(c, uPatternColor2, clamp(dark, 0.0, 1.0) * 0.85);
    } else if (uPattern < 2.5) {
      // синий хирург: жёлтый хвост и тёмная спина
      c = mix(c, uPatternColor, smoothstep(0.30, 0.16, t));
      c = mix(c, uPatternColor2, smoothstep(0.86, 0.62, y) * 0.8);
    } else if (uPattern < 3.5) {
      // жёлтая зебрасома: светлое брюхо, тёмное пятно у хвоста
      c = mix(c, uPatternColor, smoothstep(0.55, 0.18, y) * 0.9);
      float spot = smoothstep(0.16, 0.03, length(vec2(t - 0.22, y - 0.72)));
      c = mix(c, uPatternColor2, spot * 0.9);
    } else if (uPattern < 4.5) {
      // рыба-бабочка: чёрная полоса через глаз и глазок на спине
      float eye = bandMask(t, 0.79, 0.045, 0.025);
      float spot = smoothstep(0.15, 0.02, length(vec2(t - 0.24, y - 0.78)));
      c = mix(c, uPatternColor, clamp(eye + spot, 0.0, 1.0));
      c = mix(c, uPatternColor2, smoothstep(0.72, 0.95, y) * 0.5);
    } else if (uPattern < 5.5) {
      // рыба-попугай: бирюзовый верх, розоватая голова
      c = mix(c, uPatternColor, smoothstep(0.30, 0.85, y));
      c = mix(c, uPatternColor2, smoothstep(0.92, 0.68, y) * smoothstep(0.62, 0.95, t));
    } else if (uPattern < 6.5) {
      // сардина: серебро с синей спинкой и тёмной боковой линией
      c = mix(uPatternColor, c, smoothstep(0.34, 0.92, y));
      c = mix(c, uPatternColor2, smoothstep(0.06, 0.0, abs(y - 0.62)) * 0.6);
    } else if (uPattern < 7.5) {
      // ангел: частые вертикальные полосы
      c = mix(c, uPatternColor, stripeMask(t, 0.13, 0.13) * 0.9);
      c = mix(c, uPatternColor2, smoothstep(0.88, 0.66, y) * 0.7);
    } else if (uPattern < 8.5) {
      // губан: перелив и светлое брюхо
      c = mix(c, uPatternColor, smoothstep(0.5, 0.15, y));
      c = mix(c, uPatternColor2, smoothstep(0.30, 0.0, abs(y - 0.55)) * 0.5);
    } else {
      // групер/наполеон: мраморные пятна
      float m = smoothstep(0.45, 0.75, fract(sin(floor(vRbLocal.z * 9.0) * 41.3 + floor(vRbLocal.y * 9.0) * 17.7) * 4375.85));
      c = mix(c, uPatternColor, m * 0.55);
      c = mix(c, uPatternColor2, smoothstep(0.80, 0.55, y) * 0.6);
    }
    diffuseColor.rgb = c;
  }
`;

/**
 * Делает материал «подводным»: каустика на поверхностях, мягкое покачивание и
 * мировые координаты для воды.
 *
 * opts.wave: 'body' — волна идёт вдоль тела (рыбы, кит), 'sway' — покачивание
 *            на течении (водоросли, мягкие кораллы), null — без движения.
 * Для волн геометрия обязана иметь атрибут `aWave` (вес смещения вершины),
 * а инстансы — `aPhase` (сдвиг фазы).
 */
export function patchUnderwater(material, opts = {}) {
  const {
    caustics = 1,
    wave = null,
    waveAmp = 0,
    waveFreq = 6,
    waveSpeed = 4,
    causticScale = 0.16,
    pattern = null,   // { id, color, color2, scale }
    occlusion = null, // { map, size } — запечённые контактные тени на дне
  } = opts;

  material.defines = { ...(material.defines || {}) };
  if (wave === 'body') material.defines.RB_WAVE_BODY = '';
  if (wave === 'sway') material.defines.RB_WAVE_SWAY = '';
  material.defines.CAUSTIC_OCTAVES = String(3);

  material.onBeforeCompile = (shader) => {
    // Карту теней подключают уже после patchUnderwater (когда известны посадки),
    // поэтому читаем её и из опций, и из userData.
    const occ = occlusion || (material.userData && material.userData.occlusion) || null;
    shader.uniforms.uTime = water.uTime;
    shader.uniforms.uCaustic = water.uCaustic;
    shader.uniforms.uCausticScale = water.uCausticScale;
    shader.uniforms.uCausticSharp = water.uCausticSharp;
    shader.uniforms.uCausticColor = water.uCausticColor;
    shader.uniforms.uCausticLocal = { value: caustics };
    Object.assign(shader.uniforms, waterUniforms());
    shader.uniforms.uWaveAmp = { value: waveAmp };
    shader.uniforms.uWaveFreq = { value: waveFreq };
    shader.uniforms.uWaveSpeed = { value: waveSpeed };
    shader.uniforms.uPhase = { value: 0 };
    shader.uniforms.uPattern = { value: pattern ? pattern.id : 0 };
    shader.uniforms.uPatternColor = { value: pattern ? new THREE.Color(pattern.color) : new THREE.Color(0xffffff) };
    shader.uniforms.uPatternColor2 = { value: pattern ? new THREE.Color(pattern.color2) : new THREE.Color(0x000000) };
    shader.uniforms.uPatternScale = { value: pattern ? pattern.scale : 1 };
    if (occ) {
      shader.uniforms.uOccl = { value: occ.map };
      shader.uniforms.uOcclSize = { value: occ.size };
    }

    // Мировые координаты нужны всегда: по ним считается поглощение воды.
    const needsWorld = true;
    const hasPattern = !!pattern;
    const isWave = wave === 'body' || wave === 'sway';

    // Заголовок собираем по частям, чтобы uniform-ы не объявлялись дважды.
    const head = [];
    if (needsWorld) head.push('varying vec3 vRbWorld;', 'varying float vRbUp;');
    if (hasPattern) head.push('varying vec3 vRbLocal;');
    if (isWave || needsWorld) head.push('uniform float uTime;');
    if (isWave) head.push(WAVE_DECL);
    shader.vertexShader = head.join('\n') + '\n' + shader.vertexShader;

    let vertexBody = '';
    if (isWave) {
      vertexBody += wave === 'body' ? WAVE_BODY : WAVE_SWAY;
    }
    if (needsWorld) {
      vertexBody += /* glsl */`
        {
          mat4 rbModel = modelMatrix;
          mat3 rbNormalMat = mat3(modelMatrix);
          #ifdef USE_INSTANCING
            rbModel = modelMatrix * instanceMatrix;
            rbNormalMat = mat3(modelMatrix) * mat3(instanceMatrix);
          #endif
          vec4 rbWorld = rbModel * vec4(transformed, 1.0);
          vRbWorld = rbWorld.xyz;
          vRbUp = normalize(rbNormalMat * objectNormal).y;
        }
      `;
    }
    if (hasPattern) {
      vertexBody += 'vRbLocal = position;\n';
    }
    if (vertexBody) {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\n${vertexBody}`,
      );
    }

    if (hasPattern) {
      // Рисунок накладывается сразу после map_fragment: до освещения, чтобы
      // полосы и пятна тоже получали свет и каустику.
      shader.fragmentShader = PATTERN_GLSL + shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>\n${PATTERN_BODY}`,
      );
    }

    if (needsWorld) {
      shader.fragmentShader = CAUSTIC_GLSL + WATER_DECL + GRADE_DECL +
        (occ ? 'uniform sampler2D uOccl;\nuniform float uOcclSize;\n' : '') + /* glsl */`
float rbCstValue = 0.0;
float rbCstAmount = 0.0;
uniform float uTime;
uniform float uCaustic;
uniform float uCausticScale;
uniform float uCausticSharp;
uniform vec3 uCausticColor;
uniform float uCausticLocal;
varying float vRbUp;
` + shader.fragmentShader;

      const occlTerm = occ
        ? 'float occl = texture2D(uOccl, vec2(0.5 + vRbWorld.x / uOcclSize, 0.5 - vRbWorld.z / uOcclSize)).r;'
        : 'float occl = 1.0;';

      // Считаем узор и его силу до сборки итогового цвета...
      const inject = /* glsl */`
      {
        ${occlTerm}
        vec2 p = vRbWorld.xz * uCausticScale;
        rbCstValue = rbCaustic(p + vec2(uTime * 0.05, uTime * 0.03), uTime * 0.5);
        float up = clamp(vRbUp, 0.0, 1.0);
        // depth — высота над дном: у песка она нулевая, и именно там зайчики
        // видны лучше всего (солнце бьёт сверху, дно светлое).
        float depth = clamp((vRbWorld.y - ${WORLD.seabedY.toFixed(1)}) / ${(WORLD.surfaceY - WORLD.seabedY).toFixed(1)}, 0.0, 1.0);
        // Вдали мелкий узор смягчается: иначе он рассыпается в муар.
        float dist = length(vRbWorld - uCamPos);
        float sharp = 1.0 - 0.7 * smoothstep(12.0, 40.0, dist);
        rbCstAmount = uCaustic * uCausticLocal * (0.12 + 0.88 * up) * mix(1.15, 0.8, depth)
                    * mix(0.15, 1.0, occl) * mix(0.25, 1.0, sharp) * uCausticSharp;
      }
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `${inject}\n#include <opaque_fragment>\n` +
        // ...и добавляем его к готовому линейному цвету. Раньше прибавка шла в
        // totalEmissiveRadiance уже ПОСЛЕ того, как three.js собрал из него
        // outgoingLight, — то есть каустика не рисовалась вовсе. Проверено
        // замером: выключение каустики не меняло кадр вообще.
        `gl_FragColor.rgb += uCausticColor * rbCstValue * rbCstAmount;\n` +
        // Зайчик прошёл через толщу воды до глаза — ею он и гасится.
        `gl_FragColor.rgb = rbWater(gl_FragColor.rgb);`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <colorspace_fragment>',
        `#include <colorspace_fragment>\ngl_FragColor.rgb = rbGrade(gl_FragColor.rgb);`,
      );
    }
  };

  // Даль гасится spectral-поглощением, а не туманом three.js: иначе вода
  // получается молочной. Свою дымку материал считает сам.
  material.fog = false;

  material.customProgramCacheKey = () => `rb|${wave || '-'}|${caustics > 0 ? 1 : 0}|${causticScale}|${pattern ? pattern.id : 0}|${(occlusion || (material.userData && material.userData.occlusion)) ? 1 : 0}`;
  return material;
}

/** Меняет число октав каустики (пресет качества) у уже созданных материалов. */
export function setCausticOctaves(material, octaves) {
  if (!material.defines) material.defines = {};
  const next = String(Math.max(1, Math.min(3, Math.round(octaves))));
  if (material.defines.CAUSTIC_OCTAVES === next) return false;
  material.defines.CAUSTIC_OCTAVES = next;
  material.needsUpdate = true;
  return true;
}

/**
 * Окружение для отражений: яркая поверхность сверху, плотная синева снизу.
 * Считается один раз через PMREM — это дешёвый способ получить «водную» среду
 * без HDR-файлов в репозитории.
 */
export function makeWaterEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const scene = new THREE.Scene();
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTop: { value: new THREE.Color(0xd7fbff) },
      uMid: { value: new THREE.Color(0x2f9fb8) },
      uBottom: { value: new THREE.Color(0x0b3546) },
    },
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBottom;
      varying vec3 vDir;
      void main() {
        float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 c = h > 0.5 ? mix(uMid, uTop, smoothstep(0.5, 1.0, h) * 1.0)
                         : mix(uBottom, uMid, smoothstep(0.0, 0.5, h));
        // яркое солнечное пятно над головой
        float sun = pow(max(0.0, dot(normalize(vDir), normalize(vec3(-0.22, 1.0, 0.18)))), 24.0);
        c += vec3(1.0, 0.98, 0.9) * sun * 2.2;
        gl_FragColor = vec4(c, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 20), material);
  scene.add(mesh);
  const target = pmrem.fromScene(scene, 0.02);
  mesh.geometry.dispose();
  material.dispose();
  pmrem.dispose();
  return target.texture;
}
