import * as THREE from 'three';

export function seeded(seed=92) {
  return () => { seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
}
export function canvasTexture(draw, size=512, height=size) {
  const canvas=document.createElement('canvas');canvas.width=size;canvas.height=height;
  draw(canvas.getContext('2d'),size,seeded(),height);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  return texture;
}
export function textTexture(text,{bg='#ddd3b6',color='#273932',size=512,font=54,lines=null}={}) {
  return canvasTexture((ctx,s)=>{
    if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,s,s);}
    ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${font}px Georgia`;
    (lines||[text]).forEach((line,i,arr)=>ctx.fillText(line,s/2,s/2+(i-(arr.length-1)/2)*font*1.45,s*.87));
  },size);
}
export function distress(ctx,w,h,random=seeded(),amount=450) {
  for(let i=0;i<amount;i++){
    ctx.fillStyle=random()>.45?'rgba(60,44,22,.09)':'rgba(246,238,209,.16)';
    ctx.fillRect(random()*w,random()*h,1+random()*3,.5+random()*2);
  }
}
function surface(kind){
  const texture=canvasTexture((c,s,r)=>{
    c.fillStyle=kind==='leather'?'#343938':kind==='cloth'?'#8c8278':kind==='paper'?'#e7dfc8':'#d0d0cb';c.fillRect(0,0,s,s);
    if(kind==='leather'){
      for(let i=0;i<9000;i++){
        const x=r()*s,y=r()*s,d=.5+r()*2.2;c.fillStyle=r()>.5?'#454a48':'#232928';
        c.beginPath();c.ellipse(x,y,d,d*.65,r()*6,0,Math.PI*2);c.fill();
        c.strokeStyle='#525653';c.lineWidth=.2;c.stroke();
      }
    } else if(kind==='cloth'){
      for(let i=0;i<s;i+=3){c.strokeStyle=i%2?'rgba(185,182,170,.20)':'rgba(101,104,94,.16)';c.lineWidth=.45;c.beginPath();c.moveTo(i,0);c.lineTo(i,s);c.moveTo(0,i);c.lineTo(s,i);c.stroke();}
    } else {
      for(let i=0;i<14000;i++){
        const value=kind==='paper'?'rgba(112,94,58,.07)':'rgba(28,33,32,.09)';
        c.fillStyle=value;c.fillRect(r()*s,r()*s,kind==='metal'?r()*8+1:r()*2+1,.3+r()*.6);
      }
      if(kind==='metal')for(let i=0;i<60;i++){
        const x=r()*s,y=r()*s;c.strokeStyle='rgba(52,57,49,.16)';c.lineWidth=.5;
        c.beginPath();c.moveTo(x,y);c.lineTo(x+r()*15,y+r()*2);c.stroke();
      }
    }
  });
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;return texture;
}
export const grain=surface('paper');
const leather=surface('leather'),metal=surface('metal'),cloth=surface('cloth');
const roughMetal=metal.clone();roughMetal.colorSpace=THREE.NoColorSpace;
const leatherBump=leather.clone();leatherBump.colorSpace=THREE.NoColorSpace;
const paperBump=grain.clone();paperBump.colorSpace=THREE.NoColorSpace;
const corrosion=canvasTexture((c,s,r)=>{
  c.fillStyle='#68513c';c.fillRect(0,0,s,s);
  for(let i=0;i<35;i++){
    const x=r()*s,y=r()*s,rad=12+r()*85;
    const g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,i%2?'#a96d36':'#3e4037');g.addColorStop(1,'#68513c00');c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2);
  }
  for(let i=0;i<23000;i++){c.fillStyle=['#6d3f22','#9a6b3c','#473a28','#b48b57','#2e3930'][i%5];c.globalAlpha=.10;c.fillRect(r()*s,r()*s,1+r()*4,1+r()*3);}
});
export const materials={
  black:new THREE.MeshStandardMaterial({color:0x19211f,roughness:.42,metalness:.38,map:metal,bumpMap:roughMetal,bumpScale:.004}),
  leather:new THREE.MeshStandardMaterial({color:0x666e67,map:leather,roughness:.78,bumpMap:leatherBump,bumpScale:.01}),
  silver:new THREE.MeshStandardMaterial({color:0xbac2be,map:metal,roughnessMap:roughMetal,roughness:.35,metalness:.93,bumpMap:roughMetal,bumpScale:.003}),
  gold:new THREE.MeshStandardMaterial({color:0xbda16b,map:metal,roughness:.29,metalness:.88,bumpMap:roughMetal,bumpScale:.003}),
  bronze:new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.43,metalness:.83}),
  cream:new THREE.MeshPhysicalMaterial({color:0xc9c6bb,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:paperBump,bumpScale:.0004}),
  blue:new THREE.MeshPhysicalMaterial({color:0x123974,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),
  glass:new THREE.MeshPhysicalMaterial({color:0xd0e2bc,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:0x568f4b,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),
  clear:new THREE.MeshStandardMaterial({color:0xb7d6df,roughness:.09,metalness:.03,transparent:true,opacity:.055,depthWrite:false,envMapIntensity:.18}),
  lens:new THREE.MeshPhysicalMaterial({color:0x142c37,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),
  paper:new THREE.MeshStandardMaterial({color:0xe1d2ae,map:grain,roughness:.96,bumpMap:paperBump,bumpScale:.006,side:THREE.DoubleSide}),
  red:new THREE.MeshStandardMaterial({color:0x6d2528,map:cloth,roughness:.82,bumpMap:cloth,bumpScale:.009}),
  rust:new THREE.MeshStandardMaterial({map:corrosion,roughness:.89,metalness:.36,bumpMap:paperBump,bumpScale:.022}),
  rubber:new THREE.MeshStandardMaterial({color:0x151b18,roughness:.88,bumpMap:leatherBump,bumpScale:.008}),
  copper:new THREE.MeshStandardMaterial({color:0xb87746,map:metal,roughness:.37,metalness:.9}),
};
export function label(text,options) {return new THREE.MeshStandardMaterial({map:textTexture(text,options),roughness:.8});}

const textures=new Map();
let pending=[];
export function assetTexture(name,{repeat=[1,1],data=false}={}){
  const key=JSON.stringify([name,repeat,data]);if(textures.has(key))return textures.get(key);
  let done;
  pending.push(new Promise(resolve=>done=resolve));
  const map=new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/${name}`,()=>done(),undefined,()=>{console.warn(`Texture unavailable: ${name}`);done();});
  map.colorSpace=data?THREE.NoColorSpace:THREE.SRGBColorSpace;
  map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(...repeat);map.anisotropy=8;
  textures.set(key,map);return map;
}
export function materialAssetsReady(){return Promise.all(pending);}
export function pbrMaps(name,repeat=[1,1]){
  return {map:assetTexture(`${name}.jpg`,{repeat}),normalMap:assetTexture(`${name}-normal.png`,{repeat,data:true}),roughnessMap:assetTexture(`${name}-roughness.png`,{repeat,data:true})};
}
export function makeGroundTexture(){return assetTexture('courtyard-stone.jpg',{repeat:[9,9]});}
export function makeMetalTexture(){return assetTexture('steel-paint.jpg');}

// Alpha decals add localized dirt rather than tinting every surface uniformly.
export function grimeTexture(){
  return canvasTexture((c,s,r)=>{
    const g=c.createLinearGradient(0,0,0,s);g.addColorStop(0,'rgba(25,33,22,0)');g.addColorStop(.6,'rgba(28,35,24,.15)');g.addColorStop(1,'rgba(21,32,21,.75)');c.fillStyle=g;c.fillRect(0,0,s,s);
    for(let i=0;i<90;i++){const x=r()*s;c.fillStyle=`rgba(30,38,23,${r()*.09})`;c.fillRect(x,r()*s*.5,1+r()*6,s);}
  });
}
