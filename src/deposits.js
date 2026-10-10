import * as THREE from "three";

// Three local-space excavation bands share uniforms across every material.
// The mask is attached to the specimen, not the camera, and adds no draw calls.
export function depositUniforms(minY, maxY) {
  return {
    excavation: { value: new THREE.Vector3() },
    specimenBounds: { value: new THREE.Vector2(minY, maxY) },
  };
}
export function attachDeposits(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      "varying vec3 specimenPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nspecimenPosition = position;",
    );
    shader.fragmentShader =
      `varying vec3 specimenPosition;
      uniform vec3 excavation;
      uniform vec2 specimenBounds;
      float excavationMask() {
        float erosion = sin(specimenPosition.x * 27.0 + sin(specimenPosition.z * 19.0)) * 0.016
          + sin(specimenPosition.x * 73.0 + specimenPosition.z * 41.0) * 0.008;
        float h = clamp((specimenPosition.y - specimenBounds.x) / (specimenBounds.y - specimenBounds.x) + erosion, 0.0, 1.0);
        float lower = mix(excavation.z, excavation.y, smoothstep(0.30, 0.37, h));
        return mix(lower, excavation.x, smoothstep(0.63, 0.70, h));
      }\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nfloat exposed = excavationMask();\nfloat grain = 1.0;\n#ifdef USE_ROUGHNESSMAP\ngrain = 0.92 + 0.08 * texture2D(roughnessMap, vRoughnessMapUv).g;\n#endif\ndiffuseColor.rgb = mix(vec3(0.12, 0.10, 0.065) * grain, diffuseColor.rgb, 0.15 + exposed * 0.85);",
      )
      .replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = mix(1.0, roughnessFactor, exposed);",
      )
      .replace(
        "#include <metalnessmap_fragment>",
        "#include <metalnessmap_fragment>\nmetalnessFactor *= exposed;",
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= exposed;",
      );
  };
  material.customProgramCacheKey = () => "palimpsest-deposits-v2";
  material.needsUpdate = true;
}
