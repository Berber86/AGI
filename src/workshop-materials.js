import * as THREE from "three";

/** Shared linear-data map: R = brushed coating, G = roughness, B = micro relief. */
export function createWorkshopTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);
  let seed = 1701;
  for (let y = 0; y < size; y++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const line = seed / 4294967296;
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = seed / 4294967296;
      const pit = grain > 0.992 ? 0.35 : 1;
      const i = (y * size + x) * 4;
      data[i] = Math.round((204 + grain * 31 + line * 20) * pit);
      data[i + 1] = Math.round(185 + grain * 35 + line * 35);
      data[i + 2] = Math.round((110 + grain * 28 + line * 30) * pit);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
export function applyWorkshopFinish(material, texture, floor = false) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.workshopMap = { value: texture };
    shader.uniforms.workshopFloor = { value: floor ? 1 : 0 };
    shader.vertexShader =
      "varying vec3 finishWorld; varying vec3 finishNormal;\n" +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      finishWorld = (modelMatrix * vec4(position,1.0)).xyz;
      finishNormal = normalize(mat3(modelMatrix) * normal);`,
    );
    shader.fragmentShader =
      `varying vec3 finishWorld;
      varying vec3 finishNormal;
      uniform sampler2D workshopMap;
      uniform float workshopFloor;
      vec3 finishSample(vec3 p) {
        vec3 w = pow(abs(normalize(finishNormal)), vec3(6.));
        w /= max(dot(w,vec3(1.)), .001);
        return texture2D(workshopMap,p.zy*1.8).rgb*w.x + texture2D(workshopMap,p.xz*1.8).rgb*w.y + texture2D(workshopMap,p.xy*1.8).rgb*w.z;
      }
      float floorContact(vec2 p, vec2 center, vec2 halfSize) {
        float d = length(max(abs(p-center)-halfSize,0.));
        return 1.-.35*exp(-d*7.);
      }\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec3 finishData = finishSample(finishWorld);
      diffuseColor.rgb *= .87 + finishData.r*.13;
      if(workshopFloor > .5 && finishWorld.y < .12) {
        float seams = smoothstep(.025,.06,abs(fract(finishWorld.xz*7.)-.5).x);
        diffuseColor.rgb *= .92 + .08*seams;
        diffuseColor.rgb *= floorContact(finishWorld.xz,vec2(-4.3,-1.5),vec2(1.05,2.));
        diffuseColor.rgb *= floorContact(finishWorld.xz,vec2(4.3,-1.5),vec2(1.05,1.9));
        for(int i=0;i<3;i++) diffuseColor.rgb *= floorContact(finishWorld.xz,vec2(float(i-1)*2.2,-4.6),vec2(.85,.675));
      }`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor * (.85 + finishData.g*.22), .2, 1.);",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `#include <normal_fragment_maps>
      float h = finishData.b*.008;
      vec3 vx = dFdx(vViewPosition), vy = dFdy(vViewPosition);
      vec3 sx = cross(vy,normal), sy = cross(normal,vx);
      float det = dot(vx,sx);
      if(abs(det) > .00000001) normal = normalize(abs(det)*normal-sign(det)*(dFdx(h)*sx+dFdy(h)*sy));`,
    );
  };
  material.customProgramCacheKey = () => "workshop-finish-v1";
  material.needsUpdate = true;
}
