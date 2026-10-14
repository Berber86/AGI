import * as THREE from 'three';
export function seeded(seed=92) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
export function canvasTexture(draw, size=512) {
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=size;
  draw(canvas.getContext('2d'),size,seeded());
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; texture.anisotropy=4; return texture;
}
export function textTexture(text,{bg='#ddd3b6',color='#273932',size=512,font=54,lines=null}={}) {
  return canvasTexture((ctx,s)=>{ctx.fillStyle=bg;ctx.fillRect(0,0,s,s);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${font}px Georgia`; const arr=lines||[text];arr.forEach((line,i)=>ctx.fillText(line,s/2,s/2+(i-(arr.length-1)/2)*font*1.45,s*.87));},size);
}
export const grain=canvasTexture((ctx,s,r)=>{ctx.fillStyle='#bbb6ab';ctx.fillRect(0,0,s,s);for(let i=0;i<20000;i++){let v=70+r()*150;ctx.fillStyle=`rgba(${v},${v},${v},.18)`;ctx.fillRect(r()*s,r()*s,1+r()*2,1+r()*2);}},256);
grain.wrapS=grain.wrapT=THREE.RepeatWrapping;
export const materials={
 black:new THREE.MeshStandardMaterial({color:0x171b1a,roughness:.58,metalness:.2}),
 leather:new THREE.MeshStandardMaterial({color:0x161d1c,roughness:.88,bumpMap:grain,bumpScale:.035}),
 silver:new THREE.MeshStandardMaterial({color:0xb7beb6,roughness:.25,metalness:.9}),
 gold:new THREE.MeshStandardMaterial({color:0xa9803c,roughness:.32,metalness:.82}),
 bronze:new THREE.MeshStandardMaterial({color:0x53776b,roughness:.46,metalness:.78,bumpMap:grain,bumpScale:.014}),
 cream:new THREE.MeshStandardMaterial({color:0xe7dfcc,roughness:.27}),
 blue:new THREE.MeshStandardMaterial({color:0x133d73,roughness:.26}),
 glass:new THREE.MeshPhysicalMaterial({color:0x1c504b,roughness:.13,metalness:.35,clearcoat:1}),
 lens:new THREE.MeshPhysicalMaterial({color:0x224749,roughness:.07,metalness:.76,clearcoat:1}),
 paper:new THREE.MeshStandardMaterial({color:0xc9bea2,roughness:.98,bumpMap:grain,bumpScale:.016}),
 red:new THREE.MeshStandardMaterial({color:0x713431,roughness:.72,bumpMap:grain,bumpScale:.012}),
 rust:new THREE.MeshStandardMaterial({color:0x845436,roughness:.87,metalness:.38,bumpMap:grain,bumpScale:.035}),
};
export function label(text,options) { return new THREE.MeshStandardMaterial({map:textTexture(text,options),roughness:.72}); }
export function makeGroundTexture() {
 return canvasTexture((ctx,s,r)=>{ctx.fillStyle='#272e2d';ctx.fillRect(0,0,s,s); const w=64,h=34;for(let row=-1;row<17;row++)for(let col=-1;col<9;col++){const x=col*w+(row%2)*w/2,y=row*h; const tone=55+r()*25;ctx.fillStyle=`rgb(${tone},${tone+4},${tone+3})`;ctx.beginPath();ctx.roundRect(x+2,y+2,w-4,h-4,5);ctx.fill();ctx.strokeStyle='rgba(180,190,174,.12)';ctx.stroke();}for(let i=0;i<60000;i++){ctx.fillStyle=r()>.5?'rgba(200,200,185,.06)':'rgba(0,10,12,.09)';ctx.fillRect(r()*s,r()*s,r()*2+1,r()*2+1);}});
}
export function makeMetalTexture() {
 return canvasTexture((ctx,s,r)=>{ctx.fillStyle='#405d4d';ctx.fillRect(0,0,s,s);for(let i=0;i<17000;i++){ctx.fillStyle=r()>.48?'rgba(5,24,20,.12)':'rgba(162,163,125,.09)';ctx.fillRect(r()*s,r()*s,r()*5,r()*5);}for(let i=0;i<380;i++){const x=r()*s,y=r()*s,rad=r()<.15?10:2;ctx.fillStyle=['#665040','#7c583b','#8c6c46','#35433b'][i%4];ctx.beginPath();ctx.ellipse(x,y,rad*(.3+r()),rad*(.3+r()),r()*6,0,Math.PI*2);ctx.fill();}for(let i=0;i<60;i++){const x=r()*s;ctx.strokeStyle='rgba(11,29,23,.13)';ctx.lineWidth=r()*3;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-5,r()*s);ctx.stroke();}ctx.strokeStyle='#a2a292';ctx.globalAlpha=.25;for(let i=0;i<25;i++){const x=r()*s,y=r()*s;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+5+r()*40,y+r()*2);ctx.stroke();}});
}
