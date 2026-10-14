// Derived, reproducible relief and roughness maps; source albedos are AI-generated.
import sharp from 'sharp';
import fs from 'node:fs';
const size=1024;
for(const [name,strength] of [['courtyard-stone',3.2],['steel-paint',1.8]]) {
 const file=`public/assets/${name}.jpg`;
 const source=fs.readFileSync(file);
 const {data}=await sharp(source).resize(size,size).greyscale().blur(.8).raw().toBuffer({resolveWithObject:true});
 const normals=Buffer.alloc(size*size*3), roughness=Buffer.alloc(size*size);
 const at=(x,y)=>data[((y+size)%size)*size+((x+size)%size)]/255;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=y*size+x; const dx=(at(x-1,y)-at(x+1,y))*strength,dy=(at(x,y+1)-at(x,y-1))*strength;
  const length=Math.hypot(dx,dy,1);
  normals[i*3]=Math.round((dx/length*.5+.5)*255);normals[i*3+1]=Math.round((dy/length*.5+.5)*255);normals[i*3+2]=Math.round((1/length*.5+.5)*255);
  roughness[i]=name==='courtyard-stone'?Math.round(110+(1-at(x,y))*120):Math.round(125+(1-at(x,y))*70);
 }
 await sharp(normals,{raw:{width:size,height:size,channels:3}}).png().toFile(`public/assets/${name}-normal.png`);
 await sharp(roughness,{raw:{width:size,height:size,channels:1}}).png().toFile(`public/assets/${name}-roughness.png`);
}
