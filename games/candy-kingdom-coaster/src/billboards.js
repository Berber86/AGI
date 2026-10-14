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

function billboardMaterial(map) {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { map: { value: null } }]),
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying vec3 vTint;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vTint = instanceColor;
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
      #include <fog_pars_fragment>
      void main() {
        vec4 t = texture2D(map, vUv);
        gl_FragColor = vec4(t.rgb * vTint, t.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true,
  });
}

const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
const BLACK = new THREE.Color(0, 0, 0);

export class BillboardBatch {
  constructor(parent, map, capacity, name = 'billboards') {
    const mat = billboardMaterial();
    mat.uniforms.map.value = map;
    const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, capacity);
    mesh.name = name;
    mesh.frustumCulled = false; // quads roam; the vertex cost is negligible
    mesh.renderOrder = 5; // after other transparents, like the sprites it replaces
    mesh.userData.noCollide = true;
    mesh.raycast = () => {};
    mesh.castShadow = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < capacity; i++) { mesh.setMatrixAt(i, ZERO); mesh.setColorAt(i, BLACK); }
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    parent.add(mesh);
    this.mesh = mesh;
    this.capacity = capacity;
    this._m = new THREE.Matrix4();
    this._c = new THREE.Color();
  }
  // pos: centre (in the parent's space), size: world units, opacity folds into colour
  set(i, pos, size, color, opacity = 1) {
    this.mesh.setMatrixAt(i, this._m.makeScale(size, size, size).setPosition(pos));
    this.mesh.setColorAt(i, this._c.copy(color).multiplyScalar(opacity));
  }
  hide(i) { this.mesh.setMatrixAt(i, ZERO); }
  commit() {
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
  }
}
