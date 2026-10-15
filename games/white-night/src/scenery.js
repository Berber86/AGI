import * as THREE from 'three';
import { RUBBISH } from './environment.js';
import { box, cyl, torus, mesh, ball } from './models.js';
import { canvasTexture, materials as M, seeded, grimeTexture, assetTexture } from './materials.js';

const r=seeded(370);

// Materials shared by every yard detail. The static group is merged by material,
// so reusing the same instance keeps a prop out of the draw call budget.
export const YARD={};
function yardMaterials(){
  if(YARD.stone)return YARD;
  YARD.stone=new THREE.MeshStandardMaterial({color:0x737467,roughness:.86,map:assetTexture('plaster.jpg')});
  YARD.iron=new THREE.MeshStandardMaterial({color:0x283028,metalness:.72,roughness:.6});
  YARD.green=new THREE.MeshStandardMaterial({color:0x405539,roughness:.9,side:THREE.DoubleSide});
  YARD.shadowMap=canvasTexture((c,s)=>{const grad=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);grad.addColorStop(0,'rgba(5,13,8,.8)');grad.addColorStop(.45,'rgba(5,13,8,.5)');grad.addColorStop(1,'rgba(5,13,8,0)');c.fillStyle=grad;c.fillRect(0,0,s,s);},128);
  YARD.contact=new THREE.MeshBasicMaterial({map:YARD.shadowMap,transparent:true,depthWrite:false});
  return YARD;
}
export function addFacadeDetails(group,width){
  const damp=new THREE.MeshBasicMaterial({map:grimeTexture(),transparent:true,depthWrite:false,opacity:.72,polygonOffset:true,polygonOffsetFactor:-1});
  mesh(new THREE.PlaneGeometry(width,1.45),damp,group,[0,.72,.342]);
  // Exposed brick islands with an irregular alpha boundary.
  const brick=canvasTexture((c,s,rng)=>{
    c.fillStyle='#605d4c';c.fillRect(0,0,s,s);
    for(let row=0;row<12;row++)for(let col=-1;col<7;col++){
      const x=col*87+(row%2)*43,y=row*45;
      c.fillStyle=['#7d6049','#8b6d51','#9c7b59','#79654f'][Math.floor(rng()*4)];c.fillRect(x+3,y+3,81,39);
      c.fillStyle='rgba(28,29,21,.22)';c.fillRect(x+3,y+36,81,5);
    }
    c.globalCompositeOperation='destination-in';c.beginPath();
    for(let i=0;i<60;i++){const a=i*Math.PI/30,rad=185+rng()*60;c.lineTo(s/2+Math.cos(a)*rad,s/2+Math.sin(a)*rad*.7);}c.closePath();c.fill();
  });
  const brickMat=new THREE.MeshStandardMaterial({map:brick,transparent:true,alphaTest:.2,roughness:.93});
  for(const [x,y,scale] of [[-width*.36,1.01,.75],[width*.33,.87,.55],[-.1,.56,.45]]){
    mesh(new THREE.PlaneGeometry(scale*2,scale),brickMat,group,[x,y,.349]);
  }
}
export function addWindowDetails(g,x,y,w,h,stone,dark,trim){
  // Deep mouldings and a projecting drip cap give each opening a real silhouette.
  box(g,[w+.42,.078,.25],[x,y+h/2+.15,.55],trim,0);
  box(g,[w+.24,.07,.14],[x,y+h/2+.225,.47],stone,0);
  for(const sign of [-1,1]){
    box(g,[.074,h+.13,.2],[x+sign*(w/2+.065),y,.54],trim,0);
    box(g,[.095,.095,.1],[x+sign*(w/2-.07),y-.2,.63],dark,0);
  }
  box(g,[w+.28,.045,.05],[x,y-h/2-.155,.754],M.silver,0);
}
let windowMaterials;
function windowMats(){
 if(windowMaterials)return windowMaterials;
 const weave=canvasTexture((c,s)=>{c.fillStyle='#b0a895';c.fillRect(0,0,s,s);for(let x=0;x<s;x+=24){const grad=c.createLinearGradient(x,0,x+24,0);grad.addColorStop(0,'#767c70');grad.addColorStop(.5,'#c3bbab');grad.addColorStop(1,'#929889');c.fillStyle=grad;c.fillRect(x,0,24,s);}},256);
 windowMaterials={curtain:new THREE.MeshStandardMaterial({map:weave,roughness:1,side:THREE.DoubleSide}),blind:new THREE.MeshStandardMaterial({color:0x999c91,roughness:.9}),leaf:new THREE.MeshStandardMaterial({color:0x3e5e3f,roughness:1}),pot:new THREE.MeshStandardMaterial({color:0x806451,roughness:.94})};return windowMaterials;
}
export function addWindowLife(g,x,y,w,h,state,trim,glass){
 const m=windowMats();
 if(state==='curtain'){
  for(const side of [-1,1]){
   const geo=new THREE.PlaneGeometry(w*.27,h*.91,8,12),p=geo.attributes.position;
   for(let i=0;i<p.count;i++)p.setZ(i,.008*Math.sin(p.getX(i)*80));geo.computeVertexNormals();
   mesh(geo,m.curtain,g,[x+side*w*.34,y-.025,.573]);
  }
 }else if(state==='blind'){
  for(let i=0;i<12;i++)box(g,[w*.94,.04,.019],[x,y+h/2-.08-i*.093,.581],m.blind,0);
 }else if(state==='open'){
  const sash=new THREE.Group();sash.position.set(x-w/2,y,.60);sash.rotation.y=-.42;g.add(sash);
  box(sash,[w*.48,h*.91,.019],[w*.24,0,0],glass,0);
  for(const dx of [0,w*.48])box(sash,[.038,h*.94,.05],[dx,0,.025],trim,0);
  for(const dy of [-h*.47,h*.47])box(sash,[w*.50,.038,.05],[w*.24,dy,.025],trim,0);
  box(sash,[w*.48,.032,.05],[w*.24,.23,.025],trim,0);
 }
 if(state==='curtain'&&y<2){
  cyl(g,.10,.075,.15,[x+.29,y-h/2+.01,.79],m.pot,[0,0,0],12);
  for(const side of [-1,1])ball(g,[.13,.07,.035],[x+.29+side*.04,y-h/2+.17,.79],m.leaf);
 }
}
export function addCourtyardDetails(g,scene){
  const {stone,iron,green,contact}=yardMaterials();
  // Drain cover, raised paving edges and a small drainage channel in the foreground.
  cyl(g,.64,.64,.038,[2.5,.012,2.5],iron,[0,0,0],64);
  torus(g,.56,.015,[2.5,.033,2.5],M.rust,[Math.PI/2,0,0]);torus(g,.62,.014,[2.5,.033,2.5],M.silver,[Math.PI/2,0,0]);
  for(let i=-5;i<=5;i++){const len=Math.sqrt(.52**2-(i*.085)**2)*2;box(g,[len,.012,.018],[2.5,.04,2.5+i*.085],M.black,.003);}
  for(const x of [2.23,2.77])box(g,[.05,.01,.11],[x,.049,2.5],M.black,.005);
  // Warm sodium fixtures against the cold white-night skylight. Emissive carries the
  // glow; the point light only spreads it, so the light count stays fixed.
  const bulb=new THREE.MeshStandardMaterial({color:0xffd894,emissive:0xffab4e,emissiveIntensity:6.5,roughness:.35});
  for(const x of [-5.35,-2.26]){
   box(g,[.09,.38,.14],[x,2.49,-6.43],iron,.02);
   cyl(g,.018,.018,.42,[x,2.78,-6.22],iron,[Math.PI/2,0,0],12);
   cyl(g,.19,.09,.12,[x,2.7,-6.03],iron,[0,0,0],32);
   ball(g,[.085,.14,.085],[x,2.56,-6.03],bulb);
   const glow=new THREE.PointLight(0xffb266,2.4,4.2,2);glow.position.set(x,2.48,-5.97);scene.add(glow);
  }
  // Old steps and worn threshold at the passage.
  box(g,[2.26,.11,.46],[-3.8,.038,-6.13],stone,.025);
  for(let i=0;i<9;i++)box(g,[.22,.027,.49],[-4.78+i*.25,.101,-6.12],stone,.012);
  const wire=new THREE.CatmullRomCurve3([new THREE.Vector3(-6,3.3,-6.5),new THREE.Vector3(-1,2.96,-6.47),new THREE.Vector3(4.2,3.31,-6.46)]);
  mesh(new THREE.TubeGeometry(wire,24,.011,5),M.rubber,g);
  // Real wall posters with curled lower corners, not generic blank blocks.
  const paper=canvasTexture((c,s)=>{
    c.fillStyle='#c7bba0';c.fillRect(0,0,s,s);c.fillStyle='#4a5143';c.textAlign='center';c.font='bold 52px Georgia';c.fillText('СОСЕДИ!',s/2,94);c.font='25px Georgia';
    for(const [i,line] of ['Пожалуйста,','закрывайте ворота.','','Белые ночи —','не повод не спать.'].entries())c.fillText(line,s/2,165+i*41);
    c.strokeStyle='#555b4d';for(let x=28;x<s;x+=43){c.beginPath();c.moveTo(x,s-90);c.lineTo(x,s);c.stroke();}
  });
  mesh(new THREE.PlaneGeometry(.42,.56),new THREE.MeshStandardMaterial({map:paper,roughness:.95,side:THREE.DoubleSide}),g,[-1.98,1.81,-6.45],[0,0,-.05]);
  // Contact patches ground rubbish bags and bicycle instead of letting them float.
  const shadowMap=YARD.shadowMap;
  for(const [x,z,w,h] of [...RUBBISH.map(b=>[b.x,b.z,b.scale*3.5,b.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])mesh(new THREE.PlaneGeometry(w,h),contact,g,[x,.022,z],[-Math.PI/2,0,0]);
  for(let i=0;i<30;i++){
    const x=-7.1+r()*1.3,z=-6+r()*6,hei=.03+r()*.13;
    const shape=new THREE.Shape();shape.moveTo(-.012,0);shape.quadraticCurveTo(.014,hei*.7,.025,hei);shape.lineTo(.006,0);mesh(new THREE.ShapeGeometry(shape),green,g,[x,.025,z],[0,r()*6,0]);
  }
}
// Warm light leaking from a window. Shared by the facade and the courtyard well so
// the well adds no new material to the batched static group.
export const LIT=new THREE.MeshStandardMaterial({color:0x5c4a2e,emissive:0xffb765,emissiveIntensity:1.9,roughness:.65});

export function addCourtyardWell(g,x,z){
  // The premise names a courtyard well; until now the courtyard had none. A stone
  // curb, an iron grating, a small canopy and a bucket give the yard a focal point
  // and a sense of depth.
  //
  // Budget note: a new material inside the batched static group costs a draw call
  // in the colour pass, in the shadow pass and in the contact pass - three of them.
  // So the well borrows every material the yard already uses and adds none.
  yardMaterials();
  const stone=YARD.stone,iron=YARD.iron,green=YARD.green,contact=YARD.contact;

  // Stone curb with a worn top rim and a damp, mossy base.
  cyl(g,.82,.88,.44,[x,.22,z],stone,[0,0,0],30);
  torus(g,.83,.055,[x,.45,z],stone,[Math.PI/2,0,0]);
  cyl(g,.86,.9,.1,[x,.06,z],stone,[0,0,0],30);
  cyl(g,.9,.92,.07,[x,.035,z],green,[0,0,0],30);
  // Water far below, with the same warm glow the windows carry.
  cyl(g,.7,.7,.02,[x,.3,z],LIT,[0,0,0],26);

  // Iron grating: two rings and radial bars over the shaft.
  for(const r of [.3,.55])torus(g,r,.022,[x,.47,z],iron,[Math.PI/2,0,0]);
  for(let i=0;i<8;i++){const a=i*Math.PI/8;box(g,[.62,.028,.05],[x,.47,z],iron,.006,[0,-a,0]);}
  cyl(g,.075,.075,.05,[x,.49,z],iron,[0,0,0],16);

  // Canopy on two iron posts, with a small pitched roof.
  for(const s of [-1,1]){
    box(g,[.08,1.78,.08],[x+s*.82,.92,z],iron,.01);
    box(g,[.18,.06,.18],[x+s*.82,.05,z],stone,.01);
  }
  box(g,[1.92,.06,.07],[x,1.82,z],iron,.01);
  const roof=mesh(new THREE.ConeGeometry(1.34,.56,4),M.rust,g,[x,2.1,z],[0,Math.PI/4,0]);
  roof.scale.set(1,.95,.74);
  box(g,[2.05,.05,.98],[x,1.85,z],iron,.012);
  // A galvanised ridge and eave line so the roof pitch catches the moon instead of
  // reading as a flat black umbrella.
  box(g,[1.12,.045,.05],[x,2.31,z],M.silver,.012);
  for(const s2 of [-1,1])box(g,[.05,.04,1.0],[x+s2*.72,1.92,z],M.silver,.01);

  // Winding drum, chain and a bucket that is not quite empty.
  cyl(g,.06,.06,.34,[x,1.6,z],iron,[0,0,Math.PI/2],14);
  cyl(g,.022,.022,.5,[x,1.34,z],iron,[0,0,0],10);
  cyl(g,.17,.13,.28,[x,1.04,z],M.rust,[0,0,0],18);
  torus(g,.168,.018,[x,1.18,z],iron,[Math.PI/2,0,0]);
  torus(g,.138,.018,[x,.9,z],iron,[Math.PI/2,0,0]);
  tube2(g,[[x-.17,1.18,z],[x,1.36,z],[x+.17,1.18,z]],.013,iron);
  // A damp patch on the stones under the bucket.
  mesh(new THREE.PlaneGeometry(.95,.7),contact,g,[x,.021,z+.12],[-Math.PI/2,0,0]);
  // A worn step stone next to the curb.
  box(g,[.5,.07,.34],[x-.95,.05,z+.42],stone,.02,[0,.3,0]);
}
function tube2(g,points,radius,mat){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  mesh(new THREE.TubeGeometry(curve,10,radius,6,false),mat,g);
}

export function addBinDetails(g,lid,steel){
  // Pressed reinforcements, rivets, welded seams and foot brake.
  for(const x of [-1.09,1.09])for(const y of [.63,1.22,1.84]){
    cyl(g,.027,.027,.016,[x,y,.854],M.silver,undefined,8);
    box(g,[.016,.003,.005],[x,y,.866],M.black,.001);
  }
  for(const sign of [-1,1])for(let y=.53;y<1.95;y+=.14){
    const bead=ball(g,[.013,.035,.007],[sign*1.155,y,.827],M.rust);bead.rotation.z=sign*.2;
  }
  for(const x of [-.92,.92]){
    box(g,[.21,.06,.3],[x,.42,.6],M.silver,.018);
    box(g,[.075,.025,.21],[x,.305,.81],M.silver,.008,[.2,0,0]);
  }
  for(const x of [-.9,.9]){
    box(lid,[.2,.032,.2],[x,.114,.12],M.silver,.008);
    for(const dx of [-.065,.065])cyl(lid,.022,.022,.012,[x+dx,.139,.12],M.silver,[0,0,0],8);
  }
  const inside=new THREE.MeshStandardMaterial({color:0x101b13,roughness:.94});box(g,[2.44,.012,1.61],[0,2.031,0],inside,.01);
  // Paint loss follows handling/impact zones; the centre is intentionally quiet.
  const wear=canvasTexture((c,s,rng)=>{
   for(let i=0;i<1800;i++){
    const u=rng(),v=rng();if(u>.10&&u<.9&&v<.82)continue;
    c.fillStyle=i%4?'rgba(90,54,29,.45)':'rgba(154,164,147,.65)';c.fillRect(u*s,v*s,1+rng()*7,1+rng()*3);
   }
   for(const u of [.055,.945]){
    const grad=c.createLinearGradient(0,0,0,s);grad.addColorStop(0,'rgba(67,42,24,0)');grad.addColorStop(.5,'rgba(67,42,24,.35)');grad.addColorStop(1,'rgba(35,34,26,.5)');
    c.fillStyle=grad;c.fillRect(u*s,0,6,s);
   }
  });
  const chips=new THREE.MeshStandardMaterial({map:wear,transparent:true,alphaTest:.025,depthWrite:false,roughness:.86});
  mesh(new THREE.PlaneGeometry(2.35,1.43),chips,g,[0,1.18,.876]);
  mesh(new THREE.PlaneGeometry(1.43,1.36),chips,g,[1.287,1.16,0],[0,Math.PI/2,0]);
  for(const x of [-1.14,1.14])box(lid,[.025,.006,.48],[x,.114,1.60],M.silver,.002);
  // Additional service decal on the side, curved/worn enamel details stay in 3D.
  const label=canvasTexture((c,s,rng)=>{c.fillStyle='#b1aa80';c.fillRect(0,0,s,s);c.fillStyle='#384634';c.textAlign='center';c.font='bold 53px Arial';c.fillText('1100 л',s/2,170);c.font='26px Arial';c.fillText('ТВЁРДЫЕ БЫТОВЫЕ',s/2,262);c.fillText('ОТХОДЫ',s/2,306);c.font='20px monospace';c.fillText('СПБ • ИНВ. 0017',s/2,410);for(let i=0;i<700;i++){c.fillStyle='rgba(62,52,31,.1)';c.fillRect(rng()*s,rng()*s,3,2);}});
  mesh(new THREE.PlaneGeometry(.42,.37),new THREE.MeshStandardMaterial({map:label,roughness:.84}),g,[1.284,1.09,.05],[0,Math.PI/2,0]);
}
