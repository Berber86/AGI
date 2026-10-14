// Camera-facing additive glow quads, many per draw call.
//
// THREE.Sprite costs one draw call per sprite. The game used ~350 of them
// (pickup glows, the car's magic-dust trail, body glitter, pickup bursts) —
// on a phone the per-draw CPU overhead of those alone is several ms a frame.
// A BillboardBatch draws all of its quads as ONE InstancedMesh with a sprite-
// like vertex shader (centre + size from the instance matrix, quad facing the
// camera). The blending is additive, so the old per-sprite opacity folds into
// the instance colour: colour * opacity looks identical.
import * as THREE from 'three';

function billboardMaterial(map, { normal = false } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { map: { value: null } }]),
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying vec3 vTint;
      varying float vAlpha;
      attribute float aAlpha;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vTint = instanceColor;
        vAlpha = aAlpha;
        // sprite rules: size in world units, parent scale applies, no rotation
        float size = length(instanceMatrix[0].xyz) * length(modelMatrix[0].xyz);
        vec4 mvPosition = modelViewMatrix * vec4(instanceMatrix[3].xyz, 1.0);
        mvPosition.xy += position.xy * size;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D map;
      varying vec2 vUv;
      varying vec3 vTint;
      varying float vAlpha;
      #include <fog_pars_fragment>
      void main() {
        vec4 t = texture2D(map, vUv);
        vec3 col = t.rgb * vTint;
        // Highlight roll-off, ratio preserving: sparks may be pushed past white
        // on purpose (a hot core reads as "sparkling"), but this renderer has no
        // tone mapping (the pastel look is deliberate), so anything > 1 used to
        // clip to a flat white disc. Compressing every channel by the same
        // factor keeps the pink/violet/gold hue of the hottest pixels.
        float m = max(col.r, max(col.g, col.b));
        if (m > 1.0) col *= (1.0 + (m - 1.0) / (1.0 + 0.55 * (m - 1.0))) / m;
        gl_FragColor = vec4(col, t.a * vAlpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
    transparent: true, depthWrite: false,
    blending: normal ? THREE.NormalBlending : THREE.AdditiveBlending, fog: true,
  });
}

const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
const BLACK = new THREE.Color(0, 0, 0);

export class BillboardBatch {
  /**
   * @param {THREE.Object3D} parent
   * @param {THREE.Texture} map
   * @param {number} capacity  fixed pool size (instances)
   * @param {string} [name]
   * @param {object} [opts]
   * @param {'additive'|'normal'} [opts.blending='additive']  use 'normal' for
   *   things that are *not* light (dust, steam): on a bright pastel world an
   *   additive puff has nothing to add and disappears, while alpha shows it.
   */
  constructor(parent, map, capacity, name = 'billboards', { blending = 'additive' } = {}) {
    const normal = blending === 'normal';
    const mat = billboardMaterial(map, { normal });
    mat.uniforms.map.value = map;
    const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, capacity);
    mesh.name = name;
    mesh.frustumCulled = false; // quads roam; the vertex cost is negligible
    mesh.renderOrder = 5; // after other transparents, like the sprites it replaces
    mesh.userData.noCollide = true;
    mesh.raycast = () => {};
    mesh.castShadow = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const alpha = new THREE.InstancedBufferAttribute(new Float32Array(capacity), 1);
    alpha.setUsage(THREE.DynamicDrawUsage);
    mesh.geometry.setAttribute('aAlpha', alpha);
    for (let i = 0; i < capacity; i++) { mesh.setMatrixAt(i, ZERO); mesh.setColorAt(i, BLACK); alpha.setX(i, 0); }
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    this.alpha = alpha;
    this.normal = normal;
    parent.add(mesh);
    this.mesh = mesh;
    this.capacity = capacity;
    this._m = new THREE.Matrix4();
    this._c = new THREE.Color();
  }
  // pos: centre (in the parent's space), size: world units.
  // Additive: opacity folds into the colour (identical to the old sprites).
  // Normal: opacity drives the alpha attribute so the quad can *cover* what is
  // behind it instead of only adding light to it.
  set(i, pos, size, color, opacity = 1) {
    this.mesh.setMatrixAt(i, this._m.makeScale(size, size, size).setPosition(pos));
    if (this.normal) {
      this.mesh.setColorAt(i, this._c.copy(color));
      this.alpha.setX(i, opacity);
    } else {
      this.mesh.setColorAt(i, this._c.copy(color).multiplyScalar(opacity));
      this.alpha.setX(i, 1);
    }
  }
  hide(i) { this.mesh.setMatrixAt(i, ZERO); this.alpha.setX(i, 0); }
  commit() {
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
    this.alpha.needsUpdate = true;
  }
}
