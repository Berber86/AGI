import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Do not let a transparent label, puddle or contact-shadow quad occlude a whole
// rectangle in the normal/depth pass. Glass also must not hide the dial beneath.
class ContactPass extends SSAOPass {
  _overrideVisibility(){
    super._overrideVisibility();
    this.scene.traverse(object=>{
      if(object.isMesh&&object.visible&&(object.material.transparent||object.material.transmission>.1)){
        object.visible=false;this._visibilityCache.push(object);
      }
    });
  }
}
export class RenderPipeline {
  constructor(renderer,scene,camera,{samples=4}={}){
    this.renderer=renderer;this.scene=scene;this.camera=camera;this.low=false;
    // MSAA on a half-float target is one of the most expensive things a phone
    // can be asked to do. On touch devices two samples plus the device pixel
    // ratio still read clean; desktop keeps four.
    const target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,samples:Math.min(samples,renderer.capabilities.maxSamples)});
    this.composer=new EffectComposer(renderer,target);
    this.composer.addPass(new RenderPass(scene,camera));
    this.ao=new ContactPass(scene,camera,1,1,9);
    this.ao.kernelRadius=.32;this.ao.minDistance=.00025;this.ao.maxDistance=.035;
    this.composer.addPass(this.ao);this.composer.addPass(new OutputPass());
    renderer.info.autoReset=false;
  }
  resize(w,h,dpr){
    this.composer.setPixelRatio(dpr);this.composer.setSize(w,h);
    // Only normals and AO are lower resolution; the color image stays sharp.
    this.ao.setSize(Math.round(w*dpr*.55),Math.round(h*dpr*.55));
  }
  render(){
    this.renderer.info.reset();
    if(this.low)this.renderer.render(this.scene,this.camera);else this.composer.render();
  }
}
