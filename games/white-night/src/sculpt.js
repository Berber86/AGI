import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

// A small, one-time SDF cast removes intersecting-ellipsoid seams from the bronze
// figurine. Only the used vertices are kept; the temporary field is discarded.
export function castEllipsoids(parts,material,resolution=44){
  const field=new MarchingCubes(resolution,material,true,false,14000);
  field.isolation=0;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const px=x/resolution*2-1,py=y/resolution*2-1,pz=z/resolution*2-1;let distance=10;
    for(const [cx,cy,cz,rx,ry,rz,angle=0] of parts){
      const c=Math.cos(angle),s=Math.sin(angle),dx=px-cx,dy=py-cy,dz=pz-cz;
      const ax=c*dx+s*dy,ay=-s*dx+c*dy;
      const k0=Math.hypot(ax/rx,ay/ry,dz/rz),k1=Math.hypot(ax/(rx*rx),ay/(ry*ry),dz/(rz*rz));
      const d=k1>1e-6?k0*(k0-1)/k1:-Math.min(rx,ry,rz);
      const k=.085,h=Math.max(k-Math.abs(distance-d),0)/k;
      distance=Math.min(distance,d)-h*h*h*k/6;
    }
    field.field[z*resolution*resolution+y*resolution+x]=-distance;
  }
  field.update();
  const count=field.geometry.drawRange.count,geometry=new THREE.BufferGeometry();
  for(const name of ['position','normal','uv']){
    const attribute=field.geometry.getAttribute(name);
    geometry.setAttribute(name,new THREE.BufferAttribute(attribute.array.slice(0,count*attribute.itemSize),attribute.itemSize));
  }
  field.geometry.dispose();geometry.computeBoundingSphere();return geometry;
}
