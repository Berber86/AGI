import * as THREE from 'three';
import { agePoint } from './aging.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { materials as M, canvasTexture, distress, seeded } from './materials.js';
import { castEllipsoids } from './sculpt.js';
const TAU=Math.PI*2;

export function mesh(geometry,material,parent,pos=[0,0,0],rot=[0,0,0]) {
  const object=new THREE.Mesh(geometry,material);object.position.set(...pos);object.rotation.set(...rot);
  object.castShadow=!material.transparent&&!material.transmission;object.receiveShadow=true;parent.add(object);return object;
}
export function box(parent,dim,pos,mat=M.black,round=.025,rot=[0,0,0]) {
  const radius=Math.min(round,Math.min(...dim)*.48);
  return mesh(round?new RoundedBoxGeometry(...dim,2,radius):new THREE.BoxGeometry(...dim),mat,parent,pos,rot);
}
export function cyl(parent,r1,r2,h,pos,mat=M.silver,rot=[Math.PI/2,0,0],segments=48) {
  return mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat,parent,pos,rot);
}
export function ball(parent,dim,pos,mat=M.cream) {
  const object=mesh(new THREE.SphereGeometry(1,32,24),mat,parent,pos);object.scale.set(...dim);return object;
}
export function torus(parent,r,t,pos,mat=M.gold,rot=[0,0,0],arc=TAU) {
  return mesh(new THREE.TorusGeometry(r,t,8,64,arc),mat,parent,pos,rot);
}
function tube(parent,points,radius,mat=M.gold,segments=30) {
  return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segments,radius,8,false),mat,parent);
}
function lathe(parent,points,mat,pos=[0,0,0],segments=64) {
  return mesh(new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),segments),mat,parent,pos);
}
function screw(parent,x,y,z,r=.022,mat=M.silver){
  cyl(parent,r,r,r*.35,[x,y,z],mat,undefined,16);
  box(parent,[r*1.3,r*.18,.0015],[x,y,z+r*.2],M.black,.001,[0,0,(x+y)*7]);
}
function decal(parent,w,h,pos,draw,rot=[0,0,0]){
  const width=768,height=Math.max(64,Math.min(1024,Math.round(width*h/w)));
  const map=canvasTexture((c,s,r)=>draw(c,s,height,r),width,height);
  return mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.76,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),parent,pos,rot);
}
function inscription(parent,text,w,h,pos,color='#d4d1bd',rot=[0,0,0],bg=null){
  return decal(parent,w,h,pos,(c,W,H)=>{if(bg){c.fillStyle=bg;c.fillRect(0,0,W,H);}c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.font=`${H*.6}px Georgia`;c.fillText(text,W/2,H/2,W*.94);},rot);
}
function circularFace(parent,r,z,draw){
  const map=canvasTexture((c,s,rng)=>draw(c,s,rng),1024);
  return mesh(new THREE.CircleGeometry(r,80),new THREE.MeshBasicMaterial({map,toneMapped:false}),parent,[0,0,z]);
}
function dome(parent,r,depth,pos,material=M.clear){
  const object=mesh(new THREE.SphereGeometry(1,48,20,0,TAU,0,Math.PI/2),material,parent,pos,[Math.PI/2,0,0]);
  object.scale.set(r,depth,r);return object;
}
function knurl(parent,r,h,pos,count=48,mat=M.silver,axis='z'){
  for(let i=0;i<count;i++){const a=i*TAU/count;
    if(axis==='z')box(parent,[.009,.022,h],[pos[0]+Math.sin(a)*r,pos[1]+Math.cos(a)*r,pos[2]],mat,.002,[0,0,-a]);
    else box(parent,[.009,h,.022],[pos[0]+Math.sin(a)*r,pos[1],pos[2]+Math.cos(a)*r],mat,.002,[0,a,0]);
  }
}
function extrude(parent,shape,depth,mat,pos=[0,0,0],rot=[0,0,0],bevel=.01){
  return mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:20}),mat,parent,pos,rot);
}
function radialText(c,text,r,center=512,offset=0,color='#dbd6bd',font=28){
  c.save();c.translate(center,center);c.fillStyle=color;c.font=`${font}px Arial`;c.textAlign='center';c.textBaseline='middle';
  [...text].forEach((char,i)=>{const a=offset+(i-(text.length-1)/2)*.075;c.save();c.rotate(a);c.fillText(char,0,-r);c.restore();});c.restore();
}

function camera(g){
  box(g,[1.65,.92,.49],[0,0,0],M.black,.07);
  box(g,[1.57,.81,.016],[0,-.015,.253],M.leather,.024);
  box(g,[1.63,.245,.52],[0,.448,0],M.silver,.035);
  box(g,[1.63,.105,.51],[0,-.48,0],M.silver,.02);
  box(g,[1.57,.77,.018],[0,-.015,-.257],M.leather,.025);
  box(g,[1.62,.82,.035],[0,-.015,-.256],M.black,.035);
  box(g,[1.49,.7,.02],[0,-.01,-.282],M.leather,.023);
  inscription(g,'СМЕНА',.52,.13,[.43,.455,.265],'#28322e');
  inscription(g,'8М',.18,.1,[-.55,-.11,.269]);
  inscription(g,'СДЕЛАНО В СССР',.66,.065,[.15,-.405,-.281],'#c0bdb0',[0,Math.PI,0]);
  inscription(g,'ЛОМО   7419082',.62,.065,[.1,-.465,.264],'#333f39');
  // Stepped optical assembly, focusing grip and engraved front bezel.
  const lens=new THREE.Group();lens.position.set(.12,-.045,0);g.add(lens);
  cyl(lens,.36,.39,.18,[0,0,.34],M.black);
  cyl(lens,.325,.345,.13,[0,0,.466],M.silver);
  cyl(lens,.293,.293,.21,[0,0,.575],M.black);
  knurl(lens,.296,.12,[0,0,.56],56,M.rubber);
  torus(lens,.29,.012,[0,0,.682],M.silver);
  cyl(lens,.272,.272,.025,[0,0,.688],M.black);
  circularFace(lens,.27,.706,(c,s)=>{
    c.fillStyle='#171d1a';c.fillRect(0,0,s,s);
    radialText(c,'ТРИПЛЕТ 43 • 4/40',420);radialText(c,'ЛОМО • 52 мм',417,Math.PI,'#babdaa',23);
  });
  cyl(lens,.204,.204,.025,[0,0,.717],M.black);
  // Visible iris blades behind the convex coated glass.
  for(let i=0;i<7;i++){const a=i*TAU/7;const shape=new THREE.Shape();shape.moveTo(.02,.035);shape.lineTo(.06,.17);shape.lineTo(-.075,.16);shape.lineTo(-.03,.06);shape.closePath();mesh(new THREE.ShapeGeometry(shape),M.rubber,lens,[0,0,.733],[0,0,a]);}
  cyl(lens,.082,.082,.006,[0,0,.740],M.black);
  dome(lens,.196,.028,[0,0,.748],M.clear);
  torus(lens,.204,.006,[0,0,.736],M.silver);
  // Readable exposure scale around the barrel.
  decal(g,.63,.055,[.12,-.351,.498],(c,w,h)=>{c.fillStyle='#252b26';c.fillRect(0,0,w,h);c.fillStyle='#d0c9ac';c.font=`${h*.64}px Arial`;c.fillText('4   5,6   8   11   16',15,h*.7);});
  box(g,[.292,.177,.047],[-.49,.444,.282],M.black,.025);
  box(g,[.2,.105,.016],[-.49,.444,.309],M.lens,.009);
  box(g,[.21,.13,.035],[-.49,.447,-.28],M.black,.012);
  box(g,[.155,.08,.012],[-.49,.447,-.305],M.lens,.005);
  for(const x of [-.7,.72])screw(g,x,.452,.269,.021);
  for(const x of [-.65,.65])screw(g,x,-.32,-.3,.018);
  cyl(g,.161,.17,.105,[-.53,.625,0],M.silver,[0,0,0]);knurl(g,.161,.067,[-.53,.63,0],38,M.silver,'y');
  cyl(g,.11,.12,.072,[.53,.603,0],M.black,[0,0,0]);cyl(g,.059,.065,.075,[.53,.67,0],M.silver,[0,0,0]);
  box(g,[.27,.024,.23],[.02,.584,0],M.black,.006);for(const x of [-.14,.14])box(g,[.035,.04,.25],[x,.6,0],M.silver,.007);
  cyl(g,.036,.036,.015,[0,-.535,0],M.gold,[0,0,0]);
  for(const x of [-.79,.79])torus(g,.055,.012,[x,.14,0],M.silver,[0,Math.PI/2,0]);
  const strap=tube(g,[[-.8,.14,0],[-.98,-.46,0],[-.64,-.91,.03],[.29,-1.02,.02],[.83,-.7,0],[.8,.14,0]],.025,M.leather,50);strap.scale.z=.4;
}

function teacup(g){
  const pts=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];
  lathe(g,pts,M.cream);torus(g,.519,.006,[0,.377,0],M.gold,[Math.PI/2,0,0]);torus(g,.259,.006,[0,-.489,0],M.gold,[Math.PI/2,0,0]);
  tube(g,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,M.cream);
  tube(g,[[.50,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,M.gold);
  // Underglaze paint follows the exterior lathe, never a cage of blue tubes.
  const map=canvasTexture((c,w)=>{
    c.strokeStyle='#143b85';c.lineWidth=5;
    for(let i=-2;i<21;i++)for(const sign of [-1,1]){
      c.beginPath();c.moveTo(i*w/18-sign*w*.035,w);c.lineTo(i*w/18+sign*w*.035,0);c.stroke();
    }
    c.fillStyle='#b38d40';for(let i=0;i<18;i++){c.beginPath();c.arc(i*w/18,w*.50,3.6,0,TAU);c.fill();}
  },1024);
  const glaze=new THREE.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.55,envMapIntensity:.2,polygonOffset:true,polygonOffsetFactor:-1});
  lathe(g,pts.slice(4,10).map(([r,y])=>[r+.0018,y]),glaze);
  inscription(g,'ЛФЗ',.19,.08,[0,-.535,0],'#244786',[Math.PI/2,0,0]);
}

function watch(g){
  const strap=new THREE.MeshStandardMaterial({map:M.leather.map,color:0x765243,roughness:.84,bumpMap:M.leather.bumpMap,bumpScale:.01});
  box(g,[.41,2.25,.095],[0,0,-.05],strap,.04);
  for(const x of [-.157,.157])for(let y=-1;y<1.09;y+=.062)box(g,[.008,.023,.004],[x,y,.001],M.paper,.001);
  for(let y=-.99;y<-.46;y+=.105)cyl(g,.019,.019,.004,[0,y,.004],M.black,undefined,16);
  for(const y of [-.44,.44])for(const x of [-.19,.19])box(g,[.1,.18,.13],[x,y,.035],M.silver,.023,[0,0,x*y]);
  cyl(g,.415,.438,.135,[0,0,.066],M.silver);torus(g,.394,.027,[0,0,.143],M.silver);
  circularFace(g,.37,.159,(c,s,r)=>{
    c.fillStyle='#e8dfc8';c.fillRect(0,0,s,s);c.translate(s/2,s/2);
    for(let i=0;i<60;i++){c.save();c.rotate(i*TAU/60);c.fillStyle='#363f35';c.fillRect(-2,-465,4,i%5?20:42);c.restore();}
    c.fillStyle='#394237';c.textAlign='center';c.textBaseline='middle';c.font='82px Georgia';
    for(let i=1;i<=12;i++){const a=i*TAU/12;c.fillText(String(i),Math.sin(a)*365,-Math.cos(a)*365);}
    c.font='italic 66px Georgia';c.fillText('Ракета',0,-165);c.font='21px Arial';c.fillText('СДЕЛАНО В СССР',0,246);c.font='25px Arial';c.fillText('16 КАМНЕЙ',0,188);
    c.translate(-s/2,-s/2);distress(c,s,s,r,1700);
  });
  box(g,[.019,.244,.009],[-.038,.102,.18],M.black,.003,[0,0,.36]);box(g,[.012,.31,.008],[.105,.067,.19],M.black,.002,[0,0,-1.0]);
  box(g,[.004,.45,.003],[-.09,-.012,.201],M.copper,.001,[0,0,1.71]);cyl(g,.018,.02,.015,[0,0,.205],M.gold);
  dome(g,.371,.018,[0,0,.211]);
  cyl(g,.056,.057,.1,[.468,0,.04],M.silver,[0,0,Math.PI/2],32);
  for(let i=0;i<18;i++){let a=i*TAU/18;box(g,[.1,.008,.008],[.468,Math.cos(a)*.056,.04+Math.sin(a)*.056],M.silver,.001,[a,0,0]);}
  const buckle=new THREE.Shape();buckle.moveTo(-.22,-.12);buckle.lineTo(.22,-.12);buckle.lineTo(.22,.12);buckle.lineTo(-.22,.12);buckle.closePath();const hole=new THREE.Path();hole.moveTo(-.16,-.07);hole.lineTo(-.16,.07);hole.lineTo(.16,.07);hole.lineTo(.16,-.07);buckle.holes.push(hole);extrude(g,buckle,.025,M.silver,[0,1.0,.02]);box(g,[.02,.23,.018],[0,1,.065],M.silver,.003);
  cyl(g,.392,.392,.02,[0,0,-.104],M.silver);inscription(g,'ПЕТРОДВОРЕЦ • 2609',.53,.05,[0,.07,-.118],'#4d594d',[0,Math.PI,0]);inscription(g,'СДЕЛАНО В СССР',.45,.045,[0,-.07,-.118],'#4d594d',[0,Math.PI,0]);for(let i=0;i<4;i++){const a=i*Math.PI/2+.75;screw(g,Math.sin(a)*.31,Math.cos(a)*.31,-.12,.014);}
  g.updateMatrixWorld(true);
  g.traverse(o=>{
    if(!o.isMesh)return;const pos=o.geometry.attributes.position,inv=o.matrixWorld.clone().invert();
    for(let i=0;i<pos.count;i++){
      const v=new THREE.Vector3().fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);
      if(Math.abs(v.y)>.43)v.y=Math.sign(v.y)*(.43+(Math.abs(v.y)-.43)*.72);
      v.z-=.18*v.y*v.y;v.applyMatrix4(inv);pos.setXYZ(i,v.x,v.y,v.z);
    }
    o.geometry.computeVertexNormals();
  });

}

function cassette(g){
  box(g,[1.6,1,.166],[0,0,0],M.black,.07);box(g,[1.46,.77,.026],[0,.075,.092],M.rubber,.04);
  decal(g,1.37,.55,[0,.13,.11],(c,w,h,r)=>{
    c.fillStyle='#d5c9a3';c.beginPath();c.roundRect(0,0,w,h,22);c.fill();
    c.fillStyle='#6f4136';c.fillRect(0,h*.7,w,h*.055);c.font=`italic ${h*.16}px Georgia`;c.fillStyle='#334858';c.fillText('Белые ночи',w*.12,h*.26);
    c.font=`${h*.07}px Arial`;c.fillText('ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ',w*.12,h*.43);c.font=`bold ${h*.13}px Arial`;c.fillText('A',w*.025,h*.27);c.fillText('60',w*.87,h*.27);distress(c,w,h,r,1200);
  });
  box(g,[1.07,.276,.012],[0,-.044,.121],M.black,.04);
  for(const x of [-.405,.405]){
    cyl(g,.176,.176,.018,[x,-.038,.132],M.rust);
    cyl(g,.112,.112,.023,[x,-.038,.146],M.paper);
    cyl(g,.063,.063,.027,[x,-.038,.152],M.black);
    for(let i=0;i<6;i++){const a=i*TAU/6;box(g,[.022,.043,.01],[x+Math.sin(a)*.067,-.038+Math.cos(a)*.067,.172],M.paper,.002,[0,0,-a]);}
    for(const r of [.135,.147,.16])torus(g,r,.002,[x,-.038,.147],M.black);
  }
  for(let x=-.2;x<.23;x+=.043)box(g,[.012,.08,.008],[x,-.04,.137],M.silver,.001);
  box(g,[1.16,.205,.035],[0,-.374,.105],M.black,.025);
  for(const x of [-.71,.71])for(const y of [-.396,.406])screw(g,x,y,.098,.024);
  for(const x of [-.44,.44])cyl(g,.049,.049,.008,[x,-.389,.131],M.rubber);
  for(let i=0;i<20;i++)box(g,[.018,.076,.008],[-.3+i*.03,-.378,.132],M.leather,.001);
  decal(g,1.31,.52,[0,.1,-.086],(c,w,h,r)=>{c.fillStyle='#b9b093';c.fillRect(0,0,w,h);c.fillStyle='#575644';c.font=`${h*.15}px Arial`;c.fillText('Б     МК 60–5',w*.05,h*.2);for(let i=0;i<4;i++)c.fillRect(w*.06,h*(.38+i*.13),w*.88,1);distress(c,w,h,r,800);},[0,Math.PI,0]);
}

function duck(g){
  // One cast body: the neck and head no longer intersect as separate spheres.
  mesh(castEllipsoids([
    [-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],
    [.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],
    [.36,.36,0,.215,.19,.18],[-.50,.02,0,.16,.09,.14,-.3],
  ],M.cream,44),M.cream,g);
  const beak=new THREE.Shape();beak.moveTo(.51,.38);beak.lineTo(.68,.34);beak.quadraticCurveTo(.74,.31,.66,.30);beak.lineTo(.51,.31);beak.closePath();
  extrude(g,beak,.13,M.gold,[0,0,-.065],[0,0,0],.008);
  for(const side of [-1,1]){
    ball(g,[.012,.014,.007],[.43,.405,side*.164],M.black);
    tube(g,[[-.40,-.06,side*.20],[-.20,.02,side*.283],[.08,-.08,side*.25],[-.10,-.25,side*.26],[-.40,-.06,side*.20]],.003,M.gold,30);
    for(let i=0;i<4;i++)tube(g,[[-.30+i*.055,-.07,side*.278],[-.19+i*.065,-.15,side*.28],[.01+i*.033,-.14,side*.26]],.002,M.gold,12);
  }
  cyl(g,.29,.32,.045,[-.04,-.415,0],M.cream,[0,0,0]);
  inscription(g,'ЛФЗ',.16,.065,[-.04,-.44,0],'#284985',[Math.PI/2,0,0]);
}

function book(g){
  box(g,[1.02,1.48,.253],[.025,0,0],M.paper,.01);
  // Real page signatures visible along the fore-edge and head.
  for(let i=0;i<28;i++){const z=-.12+i*.009;box(g,[1.02,.002,.001],[.025,.742,z],i%5?M.paper:M.rust,0);box(g,[.002,1.45,.001],[.537,0,z],i%4?M.paper:M.rust,0);}
  box(g,[1.15,1.58,.045],[0,0,.155],M.red,.015);box(g,[1.15,1.58,.045],[0,0,-.155],M.red,.015);box(g,[.095,1.57,.34],[-.56,0,0],M.red,.025);
  decal(g,.98,1.4,[.035,0,.18],(c,w,h,r)=>{
    c.strokeStyle='#b89a5c';c.lineWidth=2;c.strokeRect(30,30,w-60,h-60);c.strokeRect(44,44,w-88,h-88);
    c.textAlign='center';c.fillStyle='#c5a76b';c.font=`${w*.06}px Georgia`;c.fillText('АЛЕКСАНДР',w/2,h*.23);c.font=`${w*.16}px Georgia`;c.fillText('БЛОК',w/2,h*.37);
    c.lineWidth=1;c.beginPath();c.moveTo(w*.3,h*.47);c.lineTo(w*.7,h*.47);c.stroke();c.font=`${w*.044}px Georgia`;c.fillText('СТИХОТВОРЕНИЯ',w/2,h*.61);c.font=`${w*.033}px Georgia`;c.fillText('ЛЕНИЗДАТ · 1982',w/2,h*.9);distress(c,w,h,r,900);
    c.strokeStyle='rgba(203,164,113,.42)';c.lineWidth=7;
    c.beginPath();c.moveTo(w*.86,h*.035);c.quadraticCurveTo(w*.97,h*.015,w*.98,h*.11);c.stroke();
    c.lineWidth=3;c.beginPath();c.moveTo(w*.80,h*.965);c.lineTo(w*.98,h*.94);c.stroke();
  });
  for(const y of [-.54,-.46,.46,.54])box(g,[.106,.015,.347],[-.556,y,0],M.red,.007);
  inscription(g,'А. БЛОК',.55,.068,[-.614,0,0],'#d1b57f',[0,-Math.PI/2,Math.PI/2]);
  const ribbon=new THREE.MeshStandardMaterial({color:0x575947,roughness:1});box(g,[.064,.38,.004],[.25,-.745,.055],ribbon,.001,[0,0,-.08]);
  inscription(g,'ЛЕНИЗДАТ',.35,.055,[.03,-.57,-.181],'#be9d61',[0,Math.PI,0]);
}

function key(g){
  torus(g,.28,.055,[0,.41,0],M.gold);torus(g,.219,.012,[0,.41,.034],M.copper);
  cyl(g,.046,.048,.92,[0,-.29,0],M.gold,[0,0,0],32);
  box(g,[.25,.09,.1],[.092,-.745,0],M.gold,.012);box(g,[.09,.1,.105],[.171,-.64,0],M.gold,.007);box(g,[.065,.17,.095],[.037,-.7,0],M.gold,.009);
  torus(g,.34,.014,[0,.72,-.01],M.silver,[.23,0,.08]);torus(g,.331,.009,[0,.72,-.018],M.silver,[.23,0,.08]);
  box(g,[.24,.34,.037],[.37,.34,-.03],M.leather,.028,[0,0,-.22]);inscription(g,'17',.14,.15,[.37,.34,-.007],'#d2b988',[0,0,-.22]);
  torus(g,.055,.012,[.33,.535,-.02],M.silver);inscription(g,'Л 82',.075,.027,[0,-.25,.049],'#776445');
}

function badge(g){
  const s=new THREE.Shape();s.moveTo(-.4,.55);s.lineTo(.4,.55);s.lineTo(.4,-.26);s.quadraticCurveTo(.3,-.52,0,-.61);s.quadraticCurveTo(-.3,-.52,-.4,-.26);s.closePath();
  extrude(g,s,.055,M.gold,[0,0,-.03]);const inner=s.clone();const inset=extrude(g,inner,.009,M.blue,[0,.005,.031],undefined,.005);inset.scale.set(.91,.91,1);
  decal(g,.67,.82,[0,.06,.06],(c,w,h)=>{
    c.fillStyle='#d9be73';c.strokeStyle='#d9be73';c.lineWidth=5;
    c.beginPath();c.moveTo(w*.5,h*.04);c.lineTo(w*.5,h*.52);c.stroke();
    c.beginPath();c.moveTo(w*.53,h*.11);c.lineTo(w*.79,h*.4);c.lineTo(w*.53,h*.4);c.closePath();c.fill();
    c.beginPath();c.moveTo(w*.44,h*.21);c.lineTo(w*.2,h*.4);c.lineTo(w*.44,h*.4);c.closePath();c.fill();
    c.beginPath();c.moveTo(w*.12,h*.48);c.lineTo(w*.85,h*.48);c.lineTo(w*.71,h*.6);c.lineTo(w*.26,h*.6);c.closePath();c.fill();
    for(let y=.65;y<.74;y+=.045){c.beginPath();for(let x=0;x<=w;x+=4)c.lineTo(x,h*y+Math.sin(x*.045)*4);c.stroke();}
    c.textAlign='center';c.font=`bold ${w*.11}px Georgia`;c.fillText('ЛЕНИНГРАД',w/2,h*.92);
  });
  for(const [x,y] of [[-.353,.46],[.353,-.17],[-.21,-.48]])ball(g,[.014,.021,.002],[x,y,.044],M.gold);
  tube(g,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,M.silver,14);
  cyl(g,.04,.04,.045,[-.23,.18,-.059],M.silver);inscription(g,'Ц. 20 К.',.31,.063,[0,-.23,-.044],'#655733',[0,Math.PI,0]);
}

function record(g){
  cyl(g,.83,.83,.022,[0,0,0],M.black,undefined,96);
  // Groove relief is a texture, not bright metal hoops.
  const groove=canvasTexture((c,s)=>{c.fillStyle='#59616a';c.fillRect(0,0,s,s);for(let r=170;r<502;r+=2){c.strokeStyle=r%5?'#66707a':'#454e57';c.lineWidth=.5;c.beginPath();c.arc(s/2,s/2,r,0,TAU);c.stroke();}},1024);
  const grooveNormal=canvasTexture((c,s)=>{
    const image=c.createImageData(s,s);
    for(let y=0;y<s;y++)for(let x=0;x<s;x++){
      const dx=x-s/2,dy=s/2-y,r=Math.hypot(dx,dy)||1,v=Math.sin(r*2.2)*.22,i=(y*s+x)*4;
      image.data[i]=128+127*v*dx/r;image.data[i+1]=128+127*v*dy/r;image.data[i+2]=253;image.data[i+3]=255;
    }
    c.putImageData(image,0,0);
  },1024);grooveNormal.colorSpace=THREE.NoColorSpace;
  const vinyl=new THREE.MeshStandardMaterial({color:0x505863,map:groove,roughness:.26,metalness:.08,normalMap:grooveNormal,normalScale:new THREE.Vector2(.65,.65),envMapIntensity:1.5});
  for(const side of [-1,1]){
    mesh(new THREE.CircleGeometry(.824,96),vinyl,g,[0,0,side*.013],[0,side===1?0:Math.PI,0]);
    const face=new THREE.Group();g.add(face);face.rotation.y=side===1?0:Math.PI;
    circularFace(face,.281,.015,(c,s,r)=>{c.fillStyle=side===1?'#a09162':'#857c57';c.fillRect(0,0,s,s);c.fillStyle='#29362b';c.textAlign='center';c.font='bold 72px Georgia';c.fillText('МЕЛОДИЯ',s/2,255);c.font='33px Arial';c.fillText('ЛЕНИНГРАДСКИЙ ЗАВОД',s/2,330);c.fillText(side===1?'СТОРОНА 1':'СТОРОНА 2',s/2,712);c.font='26px Arial';c.fillText('33 об/мин • ГОСТ 5289–80',s/2,770);c.fillText('С60–18653',s/2,833);c.strokeStyle='#344a33';c.lineWidth=4;c.beginPath();c.arc(s/2,s/2,480,0,TAU);c.stroke();distress(c,s,s,r,1500);});
    cyl(face,.018,.018,.01,[0,0,.022],M.rubber);
  }
}

function perfume(g){
  const crystal=new THREE.MeshPhysicalMaterial({color:0xf7f4e9,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:0xf2d7a4,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65});
  const bottle=lathe(g,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],crystal,[0,0,0],8);
  const liquid=new THREE.MeshStandardMaterial({color:0xa96017,roughness:.22,metalness:0});cyl(g,.294,.294,.19,[0,-.345,0],liquid,[0,0,0],8);
  cyl(g,.11,.11,.16,[0,.49,0],M.gold,[0,0,0]);knurl(g,.112,.1,[0,.49,0],28,M.gold,'y');
  lathe(g,[[0,.55],[.12,.55],[.2,.64],[.16,.85],[.1,.94],[0,.94]],crystal,[0,0,0],8);
  decal(g,.38,.38,[0,-.085,.364],(c,w,h,r)=>{c.fillStyle='#e0c991';c.fillRect(0,0,w,h);c.strokeStyle='#84713f';c.lineWidth=8;c.strokeRect(16,16,w-32,h-32);c.fillStyle='#594b30';c.textAlign='center';c.font=`${w*.12}px Georgia`;c.fillText('ДУХИ',w/2,h*.28);c.font=`italic ${w*.16}px Georgia`;c.fillText('Белая ночь',w/2,h*.55);c.font=`${w*.06}px Georgia`;c.fillText('ЛЕНИНГРАД · 1965',w/2,h*.81);distress(c,w,h,r,1800);});
  bottle.rotation.y=Math.PI/8;
}

function horse(g){
  box(g,[1.27,.08,.55],[0,-.72,0],M.bronze,.032);box(g,[1.35,.04,.61],[0,-.78,0],M.black,.02);
  mesh(castEllipsoids([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],M.bronze),M.bronze,g);
  for(const side of [-1,1])for(const x of [-.3,.26]){
    const z=side*.13;const bend=x<0?-.12:.075;
    tube(g,[[x,-.24,z],[x+bend,-.42,z+.012],[x+bend*.7,-.66,z]],.034,M.bronze);
    ball(g,[.051,.057,.04],[x+bend,-.43,z],M.bronze);box(g,[.14,.065,.095],[x+bend*.7+.02,-.66,z],M.bronze,.018);
  }
  for(const side of [-1,1]){const z=side*.084;const ear=lathe(g,[[0,0],[.041,0],[.034,.1],[0,.18]],M.bronze,[.333,.525,z],16);ear.rotation.z=.15;ball(g,[.015,.015,.008],[.457,.49,side*.127],M.black);ball(g,[.012,.01,.006],[.648,.404,side*.083],M.black);}
  for(let i=0;i<12;i++)tube(g,[[.24,.46-i*.04,-.065],[.14,.42-i*.035,-.087],[.13,.35-i*.034,-.083]],.012,M.bronze,10);
  tube(g,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,M.bronze);
  for(let i=0;i<5;i++)tube(g,[[-.41,-.1,(i-2)*.012],[-.62,-.31,(i-2)*.012],[-.6,-.56,(i-2)*.012]],.007,M.gold,14);
  // Sculpted bridle and mane, not a toy made from plain balls.
  tube(g,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,M.gold,16);
  inscription(g,'ЛЕНИНГРАД',.59,.033,[0,-.719,.279],'#b6a579');
}

function compass(g){
  cyl(g,.51,.53,.145,[0,0,0],M.gold);torus(g,.503,.018,[0,0,.075],M.gold);knurl(g,.51,.072,[0,0,-.018],72,M.gold);
  circularFace(g,.466,.081,(c,s,r)=>{
    c.fillStyle='#daceaa';c.fillRect(0,0,s,s);c.translate(s/2,s/2);
    for(let i=0;i<120;i++){c.save();c.rotate(i*TAU/120);c.strokeStyle='#435145';c.lineWidth=i%10?2:4;c.beginPath();c.moveTo(0,-470);c.lineTo(0,i%10?-452:-421);c.stroke();c.restore();}
    c.textAlign='center';c.textBaseline='middle';c.font='bold 80px Georgia';c.fillStyle='#4b5647';for(const [t,x,y] of [['С',0,-330],['Ю',0,330],['В',330,0],['З',-330,0]])c.fillText(t,x,y);
    c.font='25px Arial';for(let i=0;i<12;i++){const a=i*TAU/12;c.fillText(String(i*30),Math.sin(a)*391,-Math.cos(a)*391);}
    c.strokeStyle='#93855d';c.lineWidth=1;for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4);c.beginPath();c.moveTo(0,-270);c.lineTo(-29,-62);c.lineTo(0,0);c.lineTo(29,-62);c.closePath();c.stroke();c.restore();}
    c.font='24px Georgia';c.fillText('ЛЕНИНГРАД',0,218);c.translate(-s/2,-s/2);distress(c,s,s,r,1800);
  });
  const needle=new THREE.Shape();needle.moveTo(0,.335);needle.lineTo(-.042,0);needle.lineTo(0,-.038);needle.lineTo(.042,0);needle.closePath();
  extrude(g,needle,.007,M.red,[0,0,.103],[0,0,-.38],.001);extrude(g,needle,.007,M.silver,[0,0,.103],[0,0,Math.PI-.38],.001);
  cyl(g,.027,.027,.025,[0,0,.121],M.gold);dome(g,.468,.013,[0,0,.142]);
  torus(g,.109,.025,[0,.635,0],M.gold);cyl(g,.059,.065,.092,[0,.523,0],M.gold,[0,0,0]);
  cyl(g,.465,.465,.02,[0,0,-.086],M.gold);inscription(g,'№ 023817',.4,.07,[0,.065,-.101],'#665b3c',[0,Math.PI,0]);inscription(g,'СЕВЕР ВСЕГДА РЯДОМ',.62,.045,[0,-.062,-.101],'#665b3c',[0,Math.PI,0]);
}

function bottle(g){
  lathe(g,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],M.glass);
  for(const y of [.817,.862])torus(g,.116,.009,[0,y,0],M.glass,[Math.PI/2,0,0]);
  // Curved torn label follows the glass; no floating square plate.
  const labelMap=canvasTexture((c,w,r,h)=>{c.fillStyle='#c9c4a0';c.beginPath();c.moveTo(0,15);for(let x=0;x<=w;x+=12)c.lineTo(x,8+r()*14);c.lineTo(w,h-9);for(let x=w;x>=0;x-=14)c.lineTo(x,h-10-r()*12);c.closePath();c.fill();c.strokeStyle='#526147';c.lineWidth=8;c.strokeRect(26,30,w-52,h-60);c.fillStyle='#48593c';c.textAlign='center';c.font=`bold ${h*.22}px Georgia`;c.fillText('НЕВСКОЕ',w/2,h*.44);c.font=`${h*.09}px Arial`;c.fillText('СТЕКЛО • 0,5 Л',w/2,h*.73);distress(c,w,h,r,2800);},768,460);
  const labelMat=new THREE.MeshStandardMaterial({map:labelMap,transparent:true,depthWrite:false,roughness:.94,side:THREE.DoubleSide});mesh(new THREE.CylinderGeometry(.295,.295,.52,40,1,true,-.82,1.64),labelMat,g,[0,-.21,0]);
  inscription(g,'0,5',.08,.044,[0,-.825,0],'#6b8f5c',[Math.PI/2,0,0]);
}

function can(g){
  const tin=M.silver.clone();tin.roughness=.46;
  lathe(g,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],tin);
  for(let i=0;i<7;i++)torus(g,.431,.01,[0,-.28+i*.089,0],tin,[Math.PI/2,0,0]);
  cyl(g,.404,.404,.015,[0,-.347,0],M.rust,[0,0,0]);
  const top=new THREE.Group();top.position.set(0,.386,-.365);top.rotation.x=-.68;g.add(top);
  cyl(top,.421,.421,.012,[0,0,.365],tin,[0,0,0]);torus(top,.397,.008,[0,.01,.365],tin,[Math.PI/2,0,0]);
  torus(top,.111,.022,[0,.025,.45],tin,[Math.PI/2,0,0]);box(top,[.067,.025,.11],[0,.028,.33],tin,.015);
  // Remains of a paper label on the reverse side.
  decal(g,.42,.41,[0,-.02,-.427],(c,w,h,r)=>{c.fillStyle='#998459';c.beginPath();c.moveTo(20,0);c.lineTo(w*.75,0);c.lineTo(w,h*.5);c.lineTo(w*.7,h);c.lineTo(0,h*.7);c.closePath();c.fill();c.fillStyle='#71523c';c.font=`bold ${w*.15}px Georgia`;c.fillText('ГОСТ',w*.13,h*.46);distress(c,w,h,r,2400);},[0,Math.PI,0]);
}

function cup(g){
  const map=canvasTexture((c,w,r,h)=>{c.fillStyle='#d6c5a0';c.fillRect(0,0,w,h);c.fillStyle='#6b4934';c.fillRect(0,h*.28,w,h*.37);c.fillStyle='#e6d1aa';c.textAlign='center';c.font=`bold ${h*.15}px Georgia`;c.fillText('КОФЕ',w/2,h*.51);c.fillStyle='#6d533b';c.font=`${h*.055}px Arial`;c.fillText('ПЕТЕРБУРГ НЕ СПИТ',w/2,h*.81);distress(c,w,h,r,1500);c.fillStyle='rgba(105,63,28,.20)';c.beginPath();c.ellipse(w*.30,h*.13,w*.09,h*.028,.2,0,TAU);c.fill();},768,768);
  const paper=new THREE.MeshStandardMaterial({map,roughness:.98,side:THREE.DoubleSide,bumpMap:M.paper.bumpMap,bumpScale:.009});
  const geo=new THREE.CylinderGeometry(.36,.235,.88,64,24,true);const pos=geo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);const a=Math.atan2(z,x);const dent=1-.22*Math.exp(-Math.pow((y-.04)*5,2))*(.5+.5*Math.cos(a*3));const crease=.022*Math.sin(a*8+y*18);pos.setXYZ(i,x*dent+crease,y,z*dent);}
  geo.computeVertexNormals();mesh(geo,paper,g);torus(g,.355,.016,[0,.44,0],M.paper,[Math.PI/2,0,0]);cyl(g,.232,.232,.015,[0,-.437,0],M.paper,[0,0,0]);cyl(g,.224,.224,.008,[0,-.421,0],M.rust,[0,0,0]);
  tube(g,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,M.paper);
}

function cardboard(g){
  const map=canvasTexture((c,s,r)=>{c.fillStyle='#a08355';c.fillRect(0,0,s,s);for(let y=0;y<s;y+=3){c.fillStyle=y%2?'rgba(70,49,25,.09)':'rgba(220,198,155,.12)';c.fillRect(0,y,s,1);}distress(c,s,s,r,3500);});
  const mat=new THREE.MeshStandardMaterial({map,roughness:.97,bumpMap:M.paper.bumpMap,bumpScale:.008,side:THREE.DoubleSide});
  box(g,[1.16,.034,.82],[0,-.46,0],mat,.006);
  for(const z of [-.4,.4])box(g,[1.16,.75,.029],[0,-.065,z],mat,.006);
  for(const x of [-.56,.56])box(g,[.029,.75,.8],[x,-.065,0],mat,.006);
  box(g,[.54,.026,.79],[-.77,.425,0],mat,.004,[0,0,-.42]);box(g,[.54,.026,.79],[.75,.4,0],mat,.004,[0,0,.38]);
  box(g,[1.1,.025,.4],[0,.37,-.55],mat,.004,[.43,0,0]);box(g,[1.1,.025,.4],[0,.31,.59],mat,.004,[-.24,0,0]);
  for(let x=-.54;x<.56;x+=.031)cyl(g,.005,.005,.027,[x,.319,.399],M.paper,[0,0,0],6);
  decal(g,.39,.3,[-.24,-.01,.418],(c,w,h,r)=>{c.fillStyle='#d1c4a0';c.fillRect(0,0,w,h);c.fillStyle='#41483b';c.font=`${h*.13}px monospace`;c.fillText('ПОСЫЛКА №017',20,h*.23);for(let x=25;x<w-25;x+=7)c.fillRect(x,h*.35,2+r()*3,h*.44);distress(c,w,h,r,1200);});
  decal(g,1.08,.27,[0,-.28,.421],(c,w,h)=>{
    c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=10)c.lineTo(x,h*(.32+.09*Math.sin(x*.027)));c.lineTo(w,h);c.closePath();
    c.fillStyle='rgba(92,57,28,.23)';c.fill();c.strokeStyle='rgba(92,57,28,.18)';c.lineWidth=3;c.stroke();
  });
  const tape=new THREE.MeshStandardMaterial({color:0xa9996c,roughness:.4,transparent:true,opacity:.66});box(g,[.12,.74,.006],[.25,-.05,.421],tape,.001);box(g,[.116,.015,.3],[.25,-.438,.21],tape,.002);
}

function lid(g){
  cyl(g,.507,.507,.036,[0,0,0],M.rust,undefined,80);torus(g,.504,.014,[0,0,.017],M.silver);for(const r of [.448,.408])torus(g,r,.009,[0,0,.024],M.rust);
  const r=seeded(77);for(let i=0;i<9;i++){const a=r()*TAU,rad=.465+r()*.015;ball(g,[.008+r()*.009,.005+r()*.012,.0006],[Math.cos(a)*rad,Math.sin(a)*rad,.022],M.silver);}
  for(let i=0;i<24;i++){const a=i*TAU/24;box(g,[.03,.027,.023],[Math.sin(a)*.487,Math.cos(a)*.487,-.018],M.rust,.007,[0,0,-a]);}
  inscription(g,'ГОСТ 5981–88',.44,.056,[0,-.23,.038],'#523d2a');
}

function newspaper(g){
  const map=canvasTexture((c,w,r,h)=>{
    c.fillStyle='#c8bd9e';c.fillRect(0,0,w,h);c.fillStyle='#394238';c.textAlign='center';c.font='bold 76px Georgia';c.fillText('ВЕЧЕРНИЙ',w/2,90);c.fillText('ПЕТЕРБУРГ',w/2,173);c.fillRect(38,196,w-76,4);c.font='22px Georgia';c.fillText('ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143',w/2,230);
    c.textAlign='left';for(let col=0;col<3;col++){
      const x=40+col*322;c.font='bold 31px Georgia';c.fillText(['Белые ночи','Город у воды','После дождя'][col],x,285);
      for(let row=0;row<65;row++){const y=314+row*14;if(col===0&&row<15)continue;c.font='12px Georgia';c.fillText(['Петербург вновь встречает рассвет.','На набережных светло и тихо.','Город хранит наши воспоминания.','Сегодня ожидается переменная облачность.'][row%4],x,y,285);}
    }
    // Printed architectural engraving rather than a solid placeholder rectangle.
    c.fillStyle='#a19c86';c.fillRect(42,315,278,193);c.strokeStyle='#505c4d';c.lineWidth=2;
    for(let x=56;x<312;x+=40){c.strokeRect(x,347,29,119);for(let y=359;y<450;y+=26){c.strokeRect(x+6,y,7,14);c.strokeRect(x+18,y,7,14);}}
    c.beginPath();c.moveTo(40,345);c.lineTo(180,319);c.lineTo(319,345);c.stroke();
    distress(c,w,h,r,10000);c.fillStyle='rgba(92,69,29,.12)';c.fillRect(w*.43,0,7,h);
    c.fillStyle='rgba(99,68,36,.13)';c.beginPath();c.ellipse(w*.16,h*.90,w*.19,h*.09,.15,0,TAU);c.fill();
  },1024,1280);
  const mat=new THREE.MeshStandardMaterial({map,roughness:1,side:THREE.DoubleSide,bumpMap:M.paper.bumpMap,bumpScale:.004});
  for(let side=0;side<2;side++){
    const geo=new THREE.PlaneGeometry(1.14,1.43,40,40),p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,side*.004);}
    geo.computeVertexNormals();mesh(geo,mat,g);
  }
}

const builders={camera,teacup,watch,cassette,duck,book,key,badge,record,perfume,horse,compass,bottle,can,cup,box:cardboard,lid,paper:newspaper};
// All parts are static within an item: merge by material, not by object count.
// This keeps finer geometry affordable and caches do not grow on reinspection.
function bake(group){
  group.updateMatrixWorld(true);const parts=new Map();let count=0;
  group.traverse(object=>{if(!object.isMesh)return;count++;const geo=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();geo.applyMatrix4(object.matrixWorld);
    if(object.material===M.bronze){
      const p=geo.attributes.position,colors=new Float32Array(p.count*3),copper=new THREE.Color('#977145'),green=new THREE.Color('#355d53');
      for(let i=0;i<p.count;i++){
        const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
        const noise=Math.sin(x*15+Math.sin(y*9))*Math.sin(y*19+z*12)*Math.cos(z*21-x*6);
        const t=THREE.MathUtils.clamp((noise+.12)*.85,0,.8);
        const c=copper.clone().lerp(green,t);c.toArray(colors,i*3);
      }
      geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    }
    const key=object.material.uuid;if(!parts.has(key))parts.set(key,{material:object.material,geometries:[]});parts.get(key).geometries.push(geo);object.geometry.dispose();});
  group.clear();for(const {material,geometries} of parts.values()){const geo=mergeGeometries(geometries,false);mesh(geo,material,group);geometries.forEach(g=>g.dispose());}return count;
}
export function createItem(id){
  const group=new THREE.Group();builders[id](group);
  if(['box','can','cup','paper'].includes(id)){
    group.updateMatrixWorld(true);
    group.traverse(o=>{
      if(!o.isMesh)return;const p=o.geometry.attributes.position,inv=o.matrixWorld.clone().invert();
      for(let i=0;i<p.count;i++){
        const v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);
        v.set(...agePoint(id,v.x,v.y,v.z)).applyMatrix4(inv);p.setXYZ(i,v.x,v.y,v.z);
      }
      o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();
    });
  }
  const modeledParts=bake(group);
  const bounds=new THREE.Box3().setFromObject(group),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  group.children.forEach(c=>c.position.sub(center));group.scale.setScalar(2.1/Math.max(size.x,size.y,size.z));
  const root=new THREE.Group();root.add(group);root.rotation.set(.08,-.2,0);root.userData={id,modeledParts,materialBatches:group.children.length,bounds:{min:size.clone().multiplyScalar(-1.05/Math.max(size.x,size.y,size.z)).toArray(),max:size.clone().multiplyScalar(1.05/Math.max(size.x,size.y,size.z)).toArray()}};return root;
}
export function disposeItem(root){root.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}
