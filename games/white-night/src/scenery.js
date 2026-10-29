import * as THREE from 'three';
import { RUBBISH, windowTreatment } from './environment.js';
import { box, cyl, torus, mesh, ball } from './models.js';
import { canvasTexture, textTexture, materials as M, seeded, grimeTexture, assetTexture } from './materials.js';

const r=seeded(370);

function hash(seed){let n=Math.imul(seed|0,2654435761)>>>0;n^=n>>>13;n=Math.imul(n,2246822519)>>>0;n^=n>>>15;return n>>>0;}
function atlasPlane(width,height,cell,cols,rows){
  const geo=new THREE.PlaneGeometry(width,height),uv=geo.attributes.uv,col=((cell%cols)+cols)%cols,row=((Math.floor(cell/cols)%rows)+rows)%rows;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(col+uv.getX(i))/cols,1-(row+1)/rows+uv.getY(i)/rows);
  return geo;
}
function blob(parent,radius,pos,mat,scale=[1,1,1],detail=1){const o=mesh(new THREE.IcosahedronGeometry(radius,detail),mat,parent,pos);o.scale.set(...scale);return o;}
function lowSphere(parent,radius,pos,mat,scale=[1,1,1],detail=1){const o=mesh(new THREE.IcosahedronGeometry(radius,detail),mat,parent,pos);o.scale.set(...scale);return o;}
function sagPoints(a,b,sag,count=5){
  const points=[];
  for(let i=0;i<count;i++){const t=i/(count-1);points.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-sag*4*t*(1-t),a[2]+(b[2]-a[2])*t]);}
  return points;
}
function lineTube(parent,points,radius,mat,segments=24){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segments,radius,5,false),mat,parent);}
function interiorAtlasTexture(){
  return canvasTexture((c,W,rng,H)=>{
    const cw=W/4,ch=H/2,sil='#251810',sil2='#3b2617';
    const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
    const ellipse=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
    const glow=(x,y,radius,col='rgba(255,198,106,')=>{const g=c.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,col+'.62)');g.addColorStop(1,col+'0)');c.fillStyle=g;c.fillRect(x-radius,y-radius,radius*2,radius*2);};
    const room=(top,bottom,floor='#4b2d1e')=>{const g=c.createLinearGradient(0,0,0,ch);g.addColorStop(0,top);g.addColorStop(1,bottom);c.fillStyle=g;c.fillRect(0,0,cw,ch);rect(0,ch*.78,cw,ch*.22,floor);rect(0,ch*.76,cw,4,'rgba(255,232,185,.18)');};
    const scene=(index,draw)=>{c.save();c.translate((index%4)*cw,Math.floor(index/4)*ch);c.beginPath();c.rect(0,0,cw,ch);c.clip();draw();rect(0,0,9,ch,'rgba(24,14,8,.28)');rect(cw-9,0,9,ch,'rgba(24,14,8,.28)');c.restore();};
    scene(0,()=>{room('#bd8745','#70452a');rect(16,58,122,316,'#382313');const cols=['#8c3f32','#325d66','#c0a15a','#596b3c','#77508a','#b7b0a0'];for(let shelf=0;shelf<5;shelf++){const y=78+shelf*58;rect(22,y+38,110,6,'#20130b');let x=27;while(x<124){const bw=5+rng()*9;rect(x,y+38-(24+rng()*12),bw,24+rng()*12,cols[Math.floor(rng()*cols.length)]);x+=bw+2;}}c.strokeStyle='#2a1a0f';c.lineWidth=7;c.beginPath();c.moveTo(126,382);c.lineTo(164,104);c.moveTo(150,388);c.lineTo(184,118);c.stroke();glow(202,238,66);rect(198,238,7,132,sil);c.beginPath();c.moveTo(176,238);c.lineTo(229,238);c.lineTo(216,202);c.lineTo(189,202);c.closePath();c.fillStyle='#5d331f';c.fill();ellipse(190,388,48,52,sil);rect(142,386,96,38,sil);c.save();c.translate(181,350);c.rotate(-.18);rect(-24,-16,48,32,'#eadfc2');c.restore();});
    scene(1,()=>{room('#a8ad7d','#66704e','#40392a');for(let shelf=0;shelf<3;shelf++){const y=86+shelf*72;rect(22,y,190,7,sil2);for(let i=0;i<6;i++){const x=34+i*31;rect(x,y-(20+((i+shelf)%3)*7),15,20+((i+shelf)%3)*7,['#d8c99a','#9d4f37','#d9d4c4','#728c68'][i%4]);rect(x+2,y-(27+((i+shelf)%3)*7),11,6,sil);}}c.strokeStyle=sil;c.lineWidth=5;c.beginPath();c.moveTo(28,306);c.lineTo(226,306);c.stroke();for(const x of [62,112,168]){c.beginPath();c.moveTo(x,306);c.lineTo(x,326);c.stroke();ellipse(x,343,19,17,sil);}rect(34,402,188,12,sil);rect(48,414,10,58,sil);rect(202,414,10,58,sil);ellipse(128,386,35,22,sil);rect(112,358,32,12,sil);c.beginPath();c.moveTo(158,382);c.lineTo(184,366);c.lineTo(188,378);c.lineTo(164,394);c.closePath();c.fillStyle=sil;c.fill();glow(128,72,52);});
    scene(2,()=>{room('#bd8a68','#77503c');glow(128,116,72);rect(126,0,4,82,sil);c.beginPath();c.moveTo(94,118);c.lineTo(162,118);c.lineTo(146,82);c.lineTo(110,82);c.closePath();c.fillStyle='#6e3f28';c.fill();ellipse(128,352,70,15,sil);rect(122,352,10,82,sil);ellipse(128,438,48,10,sil);ellipse(82,326,20,22,sil);c.beginPath();c.moveTo(58,348);c.quadraticCurveTo(78,306,104,348);c.lineTo(112,408);c.lineTo(52,408);c.closePath();c.fillStyle=sil;c.fill();rect(96,330,42,28,'#eee3c4');ellipse(185,452,34,20,sil);ellipse(213,438,15,14,sil);c.beginPath();c.moveTo(203,429);c.lineTo(208,414);c.lineTo(215,428);c.moveTo(217,428);c.lineTo(225,415);c.lineTo(228,431);c.fillStyle=sil;c.fill();c.strokeStyle=sil;c.lineWidth=8;c.beginPath();c.moveTo(158,452);c.quadraticCurveTo(132,430,142,402);c.stroke();rect(0,472,cw,10,'rgba(35,20,12,.45)');});
    scene(3,()=>{room('#8fae94','#55705e','#33473a');for(let shelf=0;shelf<3;shelf++){const y=120+shelf*104;rect(18,y,220,8,'#2c2117');for(let i=0;i<4;i++){const x=42+i*54;rect(x-13,y-25,26,25,'#8a5138');for(let leaf=0;leaf<6;leaf++){const a=-2.4+leaf*.45;ellipse(x+Math.cos(a)*17,y-34+Math.sin(a)*19,11,5,leaf%2?'#365f3a':'#527a45');}}}c.strokeStyle='#3d6540';c.lineWidth=4;for(const x of [38,96,204]){c.beginPath();c.moveTo(x,0);c.quadraticCurveTo(x+14,72,x-4,142);c.stroke();for(let i=0;i<6;i++)ellipse(x+(i%2?9:-8),24+i*21,10,5,i%2?'#426f42':'#5d844e');}glow(220,78,48);rect(178,414,44,34,'#31545e');c.beginPath();c.moveTo(222,420);c.lineTo(242,402);c.lineTo(246,412);c.lineTo(226,434);c.closePath();c.fillStyle='#31545e';c.fill();});
    scene(4,()=>{room('#a87438','#674126');glow(62,112,58);rect(58,112,6,210,sil);c.beginPath();c.moveTo(34,112);c.lineTo(90,112);c.lineTo(78,78);c.lineTo(48,78);c.closePath();c.fillStyle='#623620';c.fill();c.beginPath();c.moveTo(28,318);c.lineTo(138,318);c.quadraticCurveTo(230,318,222,364);c.quadraticCurveTo(176,398,72,390);c.lineTo(28,376);c.closePath();c.fillStyle=sil;c.fill();c.beginPath();c.moveTo(42,318);c.lineTo(130,248);c.lineTo(180,318);c.closePath();c.fillStyle='#1c120c';c.fill();for(const x of [48,112,190])rect(x,386,10,72,sil);rect(94,282,48,34,'#eee4c8');c.strokeStyle='#8a7a5c';for(let i=0;i<4;i++){c.beginPath();c.moveTo(100,292+i*6);c.lineTo(136,292+i*6);c.stroke();}ellipse(166,414,34,10,sil);rect(160,414,9,44,sil);rect(176,414,9,44,sil);c.beginPath();c.moveTo(212,250);c.lineTo(232,300);c.lineTo(192,300);c.closePath();c.fillStyle=sil2;c.fill();});
    scene(5,()=>{room('#b8b19b','#77765f','#4c4636');rect(24,54,62,78,'#38443e');rect(32,62,46,62,'#c9b87d');ellipse(55,94,15,10,'#7b4c35');rect(178,62,52,66,'#5d3438');c.strokeStyle=sil;c.lineWidth=7;c.beginPath();c.moveTo(76,436);c.lineTo(126,178);c.lineTo(178,436);c.moveTo(96,348);c.lineTo(158,348);c.stroke();rect(88,196,82,104,'#e5dcc2');ellipse(122,256,23,15,'#8ba0a2');c.beginPath();c.moveTo(88,282);c.quadraticCurveTo(126,238,170,282);c.lineTo(170,300);c.lineTo(88,300);c.closePath();c.fillStyle='#68765a';c.fill();ellipse(201,392,30,9,sil);rect(196,392,8,52,sil);for(let i=0;i<5;i++)rect(26+i*15,410-((i*17)%28),8,22,['#a34438','#d1b36a','#56706a','#78608e','#c8c2ae'][i]);glow(218,166,50);});
    scene(6,()=>{room('#8299a4','#4f6875','#31424b');const tv=c.createLinearGradient(38,96,218,250);tv.addColorStop(0,'#b9d5df');tv.addColorStop(.55,'#688b9c');tv.addColorStop(1,'#314f62');c.fillStyle=tv;c.fillRect(38,96,180,154);rect(34,92,188,8,sil);rect(34,250,188,8,sil);ellipse(96,178,25,32,'rgba(35,51,60,.75)');c.beginPath();c.moveTo(54,250);c.quadraticCurveTo(98,196,146,250);c.closePath();c.fillStyle='rgba(35,51,60,.75)';c.fill();rect(150,126,48,28,'rgba(232,240,235,.55)');glow(218,318,52);rect(216,318,6,112,sil);c.beginPath();c.moveTo(194,318);c.lineTo(244,318);c.lineTo(232,286);c.lineTo(206,286);c.closePath();c.fillStyle='#70452d';c.fill();rect(38,382,150,76,sil);rect(30,356,66,42,sil);rect(118,356,66,42,sil);ellipse(70,348,17,18,sil);ellipse(146,348,17,18,sil);});
    scene(7,()=>{room('#b49aa4','#76606d','#463945');for(let i=0;i<5;i++){rect(24,78+i*8,70,4,'rgba(50,35,42,.45)');for(let j=0;j<4;j++)rect(31+j*16,58+i*8,9,18,['#b34a42','#d3b36a','#66806c','#7084a8'][j]);}c.beginPath();c.moveTo(142,116);c.bezierCurveTo(116,150,122,190,142,222);c.bezierCurveTo(128,258,132,292,150,318);c.lineTo(178,318);c.bezierCurveTo(194,290,198,258,186,222);c.bezierCurveTo(206,190,210,148,184,116);c.closePath();c.fillStyle='#6a4652';c.fill();rect(158,96,12,28,sil);rect(162,318,5,112,sil);c.strokeStyle=sil;c.lineWidth=6;c.beginPath();c.moveTo(164,430);c.lineTo(132,472);c.moveTo(164,430);c.lineTo(196,472);c.stroke();rect(28,368,92,10,sil);rect(36,378,8,66,sil);rect(104,378,8,66,sil);c.beginPath();c.moveTo(48,368);c.lineTo(54,332);c.lineTo(96,332);c.lineTo(102,368);c.lineTo(84,368);c.lineTo(82,350);c.lineTo(66,350);c.lineTo(64,368);c.closePath();c.fillStyle=sil;c.fill();rect(206,190,28,168,'#9c4f4b');rect(212,190,5,168,'rgba(255,235,200,.25)');glow(216,112,50);});
  },1024,1024);
}
function posterAtlasTexture(){
  return canvasTexture((c,W,rng,H)=>{
    const cw=W/2,ch=H/2;
    const cell=(index,draw)=>{c.save();c.translate((index%2)*cw,Math.floor(index/2)*ch);c.beginPath();c.rect(0,0,cw,ch);c.clip();draw();c.restore();};
    const text=(txt,x,y,size,col='#2e342b',font='Georgia')=>{c.fillStyle=col;c.font=`bold ${size}px ${font}`;c.textAlign='center';c.fillText(txt,x,y,cw-18);};
    cell(0,()=>{c.fillStyle='#e7dec8';c.fillRect(0,0,cw,ch);text('ПРОПАЛ КОТ',cw/2,42,27,'#633b27');c.fillStyle='#c9823e';c.beginPath();c.ellipse(112,142,58,42,0,0,Math.PI*2);c.fill();c.beginPath();c.arc(164,112,27,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(145,94);c.lineTo(150,70);c.lineTo(163,91);c.moveTo(174,91);c.lineTo(188,72);c.lineTo(190,98);c.fill();c.strokeStyle='#9a5a2d';c.lineWidth=6;for(let i=0;i<4;i++){c.beginPath();c.moveTo(82+i*18,116);c.lineTo(76+i*18,143);c.stroke();}c.strokeStyle='#c9823e';c.lineWidth=11;c.beginPath();c.moveTo(58,150);c.quadraticCurveTo(20,128,32,94);c.stroke();text('ТИХОН • РЫЖИЙ',cw/2,211,19);text('позвоните в кв. 17',cw/2,237,16,'#6b6252','Arial');});
    cell(1,()=>{c.fillStyle='#22384a';c.fillRect(0,0,cw,ch);c.fillStyle='#e8dfb8';c.beginPath();c.arc(202,48,25,0,Math.PI*2);c.fill();c.fillStyle='#22384a';c.beginPath();c.arc(212,42,22,0,Math.PI*2);c.fill();c.strokeStyle='#d7ad55';c.lineWidth=17;c.beginPath();c.moveTo(90,58);c.quadraticCurveTo(76,150,122,178);c.quadraticCurveTo(158,198,178,164);c.stroke();c.fillStyle='#d7ad55';c.beginPath();c.moveTo(176,132);c.lineTo(214,166);c.lineTo(164,190);c.closePath();c.fill();text('ДЖАЗ ВО ДВОРЕ',cw/2,224,24,'#f0dfae');text('суббота • 21:00',cw/2,247,16,'#bcd0d8','Arial');});
    cell(2,()=>{c.fillStyle='#ded8c8';c.fillRect(0,0,cw,ch);text('ОБЪЯВЛЕНИЯ',cw/2,36,24);for(const [y,title] of [[58,'УРОКИ ФОРТЕПИАНО'],[112,'РЕМОНТ ВЕЛОСИПЕДОВ'],[166,'СДАМ КОМНАТУ']]){text(title,cw/2,y,16,'#394033','Arial');c.strokeStyle='rgba(57,64,51,.55)';for(let i=0;i<3;i++){c.beginPath();c.moveTo(34,y+13+i*10);c.lineTo(222-((i*37)%46),y+13+i*10);c.stroke();}}c.strokeStyle='#7b7463';for(let x=26;x<cw-10;x+=24){c.beginPath();c.moveTo(x,222);c.lineTo(x,256);c.stroke();}});
    cell(3,()=>{c.fillStyle='#e9e1cd';c.fillRect(0,0,cw,ch);c.fillStyle='#9d4b3d';c.beginPath();c.arc(128,118,72,Math.PI,0);c.lineTo(200,190);c.lineTo(56,190);c.closePath();c.fill();c.fillStyle='#263740';c.fillRect(76,94,104,96);c.fillStyle='#e4c87e';for(let y=0;y<3;y++)for(let x=0;x<3;x++)c.fillRect(88+x*31,106+y*27,17,18);text('ДВОРЫ',cw/2,226,31,'#263740');text('фотографии соседей',cw/2,249,15,'#746a58','Arial');});
  },512,512);
}

// Materials shared by every yard detail. The static group is merged by material,
// so reusing the same instance keeps a prop out of the draw call budget.
export const YARD={};
function yardMaterials(){
  if(YARD.stone)return YARD;
  YARD.stone=new THREE.MeshStandardMaterial({color:0x737467,roughness:.86,map:assetTexture('plaster.jpg')});
  YARD.iron=new THREE.MeshStandardMaterial({color:0x283028,metalness:.72,roughness:.6});
  YARD.green=new THREE.MeshStandardMaterial({color:0x405539,roughness:.9,flatShading:true,side:THREE.DoubleSide});
  YARD.shadowMap=canvasTexture((c,s)=>{const grad=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);grad.addColorStop(0,'rgba(5,13,8,.8)');grad.addColorStop(.45,'rgba(5,13,8,.5)');grad.addColorStop(1,'rgba(5,13,8,0)');c.fillStyle=grad;c.fillRect(0,0,s,s);},128);
  YARD.contact=new THREE.MeshBasicMaterial({map:YARD.shadowMap,transparent:true,depthWrite:false});
  YARD.wood=new THREE.MeshStandardMaterial({color:0x71543a,roughness:.92});
  YARD.leafDark=new THREE.MeshStandardMaterial({color:0x2f4d34,roughness:1,flatShading:true});
  YARD.poster=new THREE.MeshStandardMaterial({map:posterAtlasTexture(),roughness:.96});
  YARD.bulb=new THREE.MeshStandardMaterial({color:0xffd894,emissive:0xffa94f,emissiveIntensity:5.2,roughness:.35});
  const glowTex=canvasTexture((c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,190,105,.85)');g.addColorStop(.38,'rgba(255,166,76,.28)');g.addColorStop(1,'rgba(255,166,76,0)');c.fillStyle=g;c.fillRect(0,0,s,s);},128);
  YARD.glow=new THREE.MeshBasicMaterial({map:glowTex,color:0xffb266,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const chalkTex=canvasTexture((c,w,rng,h)=>{c.strokeStyle='rgba(242,240,224,.78)';c.lineWidth=5;c.font='bold 34px Georgia';c.textAlign='center';const cell=(x,y,n)=>{c.strokeRect(x,y,62,62);c.fillStyle='rgba(242,240,224,.78)';c.fillText(String(n),x+31,y+43);};cell(97,410,1);cell(97,340,2);cell(62,270,3);cell(132,270,4);cell(97,200,5);cell(62,130,6);cell(132,130,7);c.beginPath();c.arc(128,82,45,Math.PI,0);c.stroke();c.fillText('8',128,92);c.beginPath();c.arc(205,438,18,0,Math.PI*2);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(205+Math.cos(a)*24,438+Math.sin(a)*24);c.lineTo(205+Math.cos(a)*34,438+Math.sin(a)*34);c.stroke();}},256,512);
  YARD.chalk=new THREE.MeshBasicMaterial({map:chalkTex,transparent:true,opacity:.58,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  const chessTex=canvasTexture((c,s)=>{for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.fillStyle=(x+y)%2?'#3c2d20':'#d8c7a2';c.fillRect(x*s/8,y*s/8,s/8,s/8);}},128);
  YARD.chess=new THREE.MeshStandardMaterial({map:chessTex,roughness:.8});
  return YARD;
}
export function addFacadeDetails(group,width,height=14,seedBase=0){
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
  const yard=yardMaterials();
  // Long rain streaks below the string courses make the flat plaster read in depth.
  for(const [x,y,hgt] of [[-width*.29,2.35,3.1],[width*.08,2.0,2.4],[width*.38,2.7,3.8],[-width*.44,1.75,2.0]]){
    mesh(new THREE.PlaneGeometry(.17,hgt),damp,group,[x,y,.344]);
  }
  // Basement windows and vents: the ground floor stops being a blank plinth.
  let baseIndex=0;
  for(let x=-width/2+1.55;x<width/2-1.1;x+=2.85,baseIndex++){
    if(seedBase===0&&Math.abs(x+3.8)<1.65)continue;
    const warm=(baseIndex+seedBase)%4===1;
    box(group,[.78,.48,.06],[x,.39,.425],warm?LIT:M.black,0);
    box(group,[.9,.07,.09],[x,.665,.44],yard.stone,0);
    box(group,[.9,.06,.1],[x,.125,.45],yard.stone,0);
    for(const dx of [-.24,0,.24])box(group,[.02,.44,.02],[x+dx,.39,.47],M.black,0);
    const vx=x+1.42;
    if(vx<width/2-.7){box(group,[.34,.24,.035],[vx,.92,.342],M.black,0);for(let i=0;i<3;i++)box(group,[.28,.025,.012],[vx,.86+i*.07,.365],M.rust,0);}
  }
  // Neighbourhood paper: a lost cat, courtyard jazz, small ads and a photo show.
  const posterX=seedBase===0?2.47:seedBase===37?-1.24:3.7;
  mesh(atlasPlane(.48,.64,seedBase+1,2,2),yard.poster,group,[posterX,1.58,.353],[0,0,.03]);
  // Ivy climbs the corners (and the arch pier on the back wall) as flat leaf patches.
  const ivyRand=seeded(910+seedBase);
  const ivyClusters=[[-width/2+.58,0],[width/2-.58,2]];
  if(seedBase===0)ivyClusters.push([-5.32,1]);
  for(const [baseX,phase] of ivyClusters){
    for(let i=0;i<30;i++){
      const yy=.5+i*.17+ivyRand()*.09,xx=baseX+Math.sin(i*.55+phase)*.28+(ivyRand()-.5)*.2;
      const leaf=mesh(new THREE.CircleGeometry(.055+ivyRand()*.08,7),i%3?yard.leafDark:yard.green,group,[xx,yy,.355+ivyRand()*.045],[0,0,ivyRand()*Math.PI]);
      leaf.scale.set(1.35,.72,1);
    }
  }
  // Roofline silhouettes for looking up in VR: chimneys, antennas, a dish, pigeons.
  for(const x of [-width*.3,width*.24]){
    box(group,[.78,.98,.78],[x,height+.48,-.05],yard.stone,0);
    box(group,[.94,.13,.94],[x,height+1.02,-.05],yard.stone,0);
    cyl(group,.09,.11,.24,[x-.16,height+1.19,-.05],M.rust,[0,0,0],10);
    cyl(group,.09,.11,.24,[x+.16,height+1.19,-.05],M.rust,[0,0,0],10);
  }
  for(const x of [-width*.12,width*.36]){
    cyl(group,.018,.018,1.42,[x,height+.76,.18],M.black,[0,0,0],8);
    box(group,[.88,.025,.025],[x,height+1.12,.18],M.black,0);
    box(group,[.58,.025,.025],[x,height+1.36,.18],M.black,0);
    box(group,[.025,.025,.72],[x,height+1.24,.18],M.black,0);
  }
  const dishX=width*.16;
  mesh(new THREE.CylinderGeometry(.37,.09,.13,20),M.silver,group,[dishX,height-1.48,.56],[1.02,0,-.32]);
  lineTube(group,[[dishX-.18,height-1.62,.34],[dishX,height-1.5,.58]],.016,M.black,4);
  for(let i=0;i<6;i++){
    if((i+seedBase)%4===3)continue;
    const x=-width*.34+i*width*.13,y=height+.13;
    blob(group,.058,[x,y,.48],yard.stone,[1.45,.82,.9],0);
    lowSphere(group,.032,[x+.065,y+.055,.49],M.black);
    box(group,[.11,.014,.035],[x-.085,y+.015,.47],M.black,0,[0,.2,.18]);
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
  // A shallow keystone and corbel blocks break the identical rectangular rhythm.
  box(g,[.12,.24,.19],[x,y+h/2+.12,.56],stone,0);
}
let windowMaterials;
function windowMats(){
 if(windowMaterials)return windowMaterials;
 const weave=canvasTexture((c,s)=>{c.fillStyle='#b0a895';c.fillRect(0,0,s,s);for(let x=0;x<s;x+=24){const grad=c.createLinearGradient(x,0,x+24,0);grad.addColorStop(0,'#767c70');grad.addColorStop(.5,'#c3bbab');grad.addColorStop(1,'#929889');c.fillStyle=grad;c.fillRect(x,0,24,s);}},256);
 const interiors=interiorAtlasTexture();
 const laceTex=canvasTexture((c,w,rng,h)=>{c.fillStyle='rgba(232,226,205,.94)';c.fillRect(0,0,w,26);for(let x=0;x<w;x+=22){c.beginPath();c.arc(x+11,27,11,0,Math.PI,false);c.fill();}c.fillStyle='rgba(120,112,92,.55)';for(let i=0;i<180;i++)c.fillRect(rng()*w,rng()*38,2,2);c.fillStyle='rgba(232,226,205,.38)';c.fillRect(0,38,w,h-38);},256,128);
 windowMaterials={curtain:new THREE.MeshStandardMaterial({map:weave,roughness:1,side:THREE.DoubleSide}),blind:new THREE.MeshStandardMaterial({color:0x999c91,roughness:.9}),leaf:new THREE.MeshStandardMaterial({color:0x3e5e3f,roughness:1,flatShading:true}),pot:new THREE.MeshStandardMaterial({color:0x806451,roughness:.94}),interior:new THREE.MeshStandardMaterial({map:interiors,emissive:0xffffff,emissiveMap:interiors,emissiveIntensity:1.12,color:0x1a120c,roughness:.85}),lace:new THREE.MeshStandardMaterial({map:laceTex,transparent:true,alphaTest:.06,roughness:1,side:THREE.DoubleSide})};return windowMaterials;
}
function addCat(parent,pos,scale=1,rotY=0,mat=M.black){
  const cat=new THREE.Group();cat.position.set(...pos);cat.rotation.y=rotY;cat.scale.setScalar(scale);parent.add(cat);
  blob(cat,.16,[0,.15,-.02],mat,[.95,.82,1.28]);
  lowSphere(cat,.086,[0,.325,.13],mat);
  for(const side of [-1,1]){
    mesh(new THREE.CylinderGeometry(.001,.032,.07,4),mat,cat,[side*.047,.405,.125],[0,0,-side*.16]);
    cyl(cat,.018,.02,.17,[side*.056,.085,.12],mat,[0,0,0],8);
  }
  lineTube(cat,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,mat,10);
  return cat;
}
export function addWindowLife(g,x,y,w,h,state,trim,glass,key=0){
 const m=windowMats(),yard=yardMaterials(),n=hash(key+811),row=Math.max(0,Math.min(3,Math.round((y-1.72)/2.95)));
 const addCurtains=(z=.574)=>{
  for(const side of [-1,1]){
   const geo=new THREE.PlaneGeometry(w*.27,h*.91,5,6),p=geo.attributes.position;
   for(let i=0;i<p.count;i++)p.setZ(i,.008*Math.sin(p.getX(i)*80));geo.computeVertexNormals();
   mesh(geo,m.curtain,g,[x+side*w*.34,y-.025,z]);
   box(g,[.035,.09,.025],[x+side*w*.24,y-.08,z+.018],M.gold,0);
  }
  mesh(new THREE.PlaneGeometry(w*.96,h*.17),m.lace,g,[x,y+h*.39,z+.004]);
 };
 if(state==='lit'){
  mesh(atlasPlane(w*.97,h*.97,n%8,4,2),m.interior,g,[x,y,.566]);
  if(n%3===0)addCurtains(.576);
  if(n%4===1){
    cyl(g,.006,.006,.34,[x+.18,y+h*.31,.59],M.black,[0,0,0],6);
    cyl(g,.035,.095,.1,[x+.18,y+h*.13,.59],yard.bulb,[0,0,0],14);
    lowSphere(g,.032,[x+.18,y+h*.055,.59],yard.bulb,[1,1,1],0);
  }
 }else if(state==='curtain'){
  addCurtains();
 }else if(state==='blind'){
  for(let i=0;i<12;i++)box(g,[w*.94,.04,.019],[x,y+h/2-.08-i*.093,.581],m.blind,0,i>8?[.32,0,0]:[0,0,0]);
  for(const side of [-1,1])box(g,[.012,h*.68,.012],[x+side*w*.39,y+h*.08,.594],M.black,0);
  box(g,[w*.94,.045,.025],[x,y+h/2-1.13,.59],m.blind,0);
 }else if(state==='open'){
  const sash=new THREE.Group();sash.position.set(x-w/2,y,.60);sash.rotation.y=-.42;g.add(sash);
  box(sash,[w*.48,h*.91,.019],[w*.24,0,0],glass,0);
  for(const dx of [0,w*.48])box(sash,[.038,h*.94,.05],[dx,0,.025],trim,0);
  for(const dy of [-h*.47,h*.47])box(sash,[w*.50,.038,.05],[w*.24,dy,.025],trim,0);
  box(sash,[w*.48,.032,.05],[w*.24,.23,.025],trim,0);
  cyl(sash,.014,.014,.1,[w*.45,-.05,.065],M.silver,[0,0,0],8);
 }
 if((state==='curtain'||state==='lit'||state==='open')&&n%3===0){
  const px=x+(n%2?.29:-.29);
  cyl(g,.10,.075,.15,[px,y-h/2+.035,.79],m.pot,[0,0,0],12);
  for(const side of [-1,0,1])blob(g,.07,[px+side*.055,y-h/2+.17,.79],side?m.leaf:yard.green,[1.25,.72,.65],0);
 }
 if(state==='open'&&n%5===0)addCat(g,[x-.17,y-h/2-.015,.8],.58,0,M.black);
 if(row>0&&row<3){
  if(n%9===2){
    box(g,[w*.82,.16,.2],[x,y-h/2+.045,.74],m.pot,0);
    for(let i=0;i<6;i++)blob(g,.07,[x-w*.31+i*w*.12,y-h/2+.17,.74],i%2?yard.green:m.leaf,[1.2,.72,.8],0);
    for(let i=0;i<7;i++)blob(g,.022,[x-w*.33+i*w*.105,y-h/2+.21,.78],i%3?M.red:M.cream,[1,1,1],0);
  }else if(n%11===5){
    box(g,[.64,.47,.24],[x+.16,y-h/2-.39,.59],trim,0);
    mesh(new THREE.CylinderGeometry(.15,.15,.025,20),M.black,g,[x+.16,y-h/2-.39,.72],[Math.PI/2,0,0]);
    for(const dy of [-.1,0,.1])box(g,[.42,.018,.012],[x+.16,y-h/2-.39+dy,.735],M.black,0);
    box(g,[.54,.035,.03],[x+.16,y-h/2-.64,.62],M.black,0);
  }else if(n%13===6){
    for(const side of [-1,1]){
      box(g,[.24,h*.9,.035],[x+side*(w/2+.18),y,.55],yard.leafDark,0);
      for(let i=0;i<5;i++)box(g,[.18,.025,.014],[x+side*(w/2+.18),y-h*.3+i*h*.15,.575],M.black,0);
    }
  }
 }
 if(row===0&&state!=='open'&&n%3===1){
  for(const dx of [-.36,-.18,0,.18,.36])box(g,[.018,h*.85,.018],[x+dx*w,y,.645],M.black,0);
  for(const dy of [-h*.28,h*.28])box(g,[w*.84,.02,.02],[x,y+dy,.65],M.black,0);
 }
 if(row>=2&&n%11===0){
  const px=x+w*.24,py=y-h/2+.025;
  blob(g,.055,[px,py,.76],yard.stone,[1.45,.82,.9],0);
  lowSphere(g,.031,[px+.062,py+.052,.76],M.black);
  box(g,[.1,.013,.032],[px-.082,py+.012,.76],M.black,0,[0,.15,.16]);
 }
}
export function addCourtyardDetails(g,scene){
  const {stone,iron,green,contact,bulb}=yardMaterials();
  // Drain cover, raised paving edges and a small drainage channel in the foreground.
  cyl(g,.64,.64,.038,[2.5,.012,2.5],iron,[0,0,0],64);
  torus(g,.56,.015,[2.5,.033,2.5],M.rust,[Math.PI/2,0,0]);torus(g,.62,.014,[2.5,.033,2.5],M.silver,[Math.PI/2,0,0]);
  for(let i=-5;i<=5;i++){const len=Math.sqrt(.52**2-(i*.085)**2)*2;box(g,[len,.012,.018],[2.5,.04,2.5+i*.085],M.black,.003);}
  for(const x of [2.23,2.77])box(g,[.05,.01,.11],[x,.049,2.5],M.black,.005);
  // Warm sodium fixtures against the cold white-night skylight. Emissive carries the
  // glow; the point light only spreads it, so the light count stays fixed.
  for(const x of [-4.55,4.55]){
   box(g,[.09,.38,.14],[x,2.49,-6.43],iron,.02);
   cyl(g,.018,.018,.42,[x,2.78,-6.22],iron,[Math.PI/2,0,0],12);
   cyl(g,.19,.09,.12,[x,2.7,-6.03],iron,[0,0,0],32);
   lowSphere(g,.085,[x,2.56,-6.03],bulb,[1,1.65,1]);
   const glow=new THREE.PointLight(0xffb266,2.4,4.2,2);glow.position.set(x,2.48,-5.97);scene.add(glow);
  }
  // Worn threshold in front of the passage gates.
  box(g,[3.35,.1,.5],[0,.036,-6.03],stone,.03);
  for(let i=0;i<12;i++)box(g,[.25,.026,.54],[-1.42+i*.26,.096,-6.02],stone,.012);
  const wire=new THREE.CatmullRomCurve3([new THREE.Vector3(-6,5.3,-6.5),new THREE.Vector3(-1,4.96,-6.47),new THREE.Vector3(4.2,5.31,-6.46)]);
  mesh(new THREE.TubeGeometry(wire,24,.011,5),M.rubber,g);
  // Real wall posters with curled lower corners, not generic blank blocks.
  const paper=canvasTexture((c,s)=>{
    c.fillStyle='#c7bba0';c.fillRect(0,0,s,s);c.fillStyle='#4a5143';c.textAlign='center';c.font='bold 52px Georgia';c.fillText('СОСЕДИ!',s/2,94);c.font='25px Georgia';
    for(const [i,line] of ['Пожалуйста,','закрывайте ворота.','','Белые ночи —','не повод не спать.'].entries())c.fillText(line,s/2,165+i*41);
    c.strokeStyle='#555b4d';for(let x=28;x<s;x+=43){c.beginPath();c.moveTo(x,s-90);c.lineTo(x,s);c.stroke();}
  });
  mesh(new THREE.PlaneGeometry(.42,.56),new THREE.MeshStandardMaterial({map:paper,roughness:.95,side:THREE.DoubleSide}),g,[-4.95,1.81,-6.45],[0,0,-.05]);
  // Contact patches ground rubbish bags and bicycle instead of letting them float.
  for(const [x,z,w,h] of [...RUBBISH.map(b=>[b.x,b.z,b.scale*3.5,b.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])mesh(new THREE.PlaneGeometry(w,h),contact,g,[x,.022,z],[-Math.PI/2,0,0]);
  for(let i=0;i<30;i++){
    const x=-7.1+r()*1.3,z=-6+r()*6,hei=.03+r()*.13;
    const shape=new THREE.Shape();shape.moveTo(-.012,0);shape.quadraticCurveTo(.014,hei*.7,.025,hei);shape.lineTo(.006,0);mesh(new THREE.ShapeGeometry(shape),green,g,[x,.025,z],[0,r()*6,0]);
  }
  addLivingCourtyard(g);
}

function addBench(g,pos,rotY){
  const yard=yardMaterials(),bench=new THREE.Group();bench.position.set(...pos);bench.rotation.y=rotY;g.add(bench);
  for(const z of [-.15,0,.15])box(bench,[1.78,.045,.1],[0,.46,z],yard.wood,0);
  for(const y of [.74,.9])box(bench,[1.78,.09,.035],[0,y,-.27],yard.wood,0,[-.1,0,0]);
  for(const side of [-1,1]){
    box(bench,[.055,.46,.52],[side*.84,.23,0],yard.iron,0);
    box(bench,[.055,.04,.56],[side*.84,.67,0],M.rust,0);
    box(bench,[.055,.56,.055],[side*.84,.66,-.27],yard.iron,0,[-.1,0,0]);
  }
  return bench;
}
function addGardenBed(g,pos,rotY,length,seed){
  const yard=yardMaterials(),bed=new THREE.Group(),rand=seeded(seed);bed.position.set(...pos);bed.rotation.y=rotY;g.add(bed);
  box(bed,[length,.1,.78],[0,.05,0],M.rust,0);
  for(const side of [-1,1]){
    box(bed,[length,.13,.055],[0,.075,side*.42],yard.stone,0);
    box(bed,[length,.025,.025],[0,.34,side*.47],yard.iron,0);
    for(let x=-length/2+.25;x<length/2;x+=.58)box(bed,[.025,.34,.025],[x,.17,side*.47],yard.iron,0);
  }
  const shrubs=Math.max(4,Math.round(length*1.7));
  for(let i=0;i<shrubs;i++){
    const x=-length/2+.35+i*(length-.7)/Math.max(1,shrubs-1)+(rand()-.5)*.18,z=(rand()-.5)*.42,mat=i%3?yard.leafDark:yard.green;
    blob(bed,.15+rand()*.15,[x,.19+rand()*.08,z],mat,[1.45,.58,.95],0);
    blob(bed,.08+rand()*.07,[x+.13+rand()*.08,.15+rand()*.1,z+(rand()-.5)*.18],mat,[1.3,.62,.9],0);
    blob(bed,.07+rand()*.06,[x-.12-rand()*.07,.14+rand()*.09,z+(rand()-.5)*.16],mat,[1.2,.6,.9],0);
  }
  for(let i=0;i<18;i++)blob(bed,.018+rand()*.014,[-length/2+.25+rand()*(length-.5),.17+rand()*.16,(rand()-.5)*.52],[M.red,M.cream,M.gold][i%3],[1,1,1],0);
  for(let i=0;i<12;i++)mesh(new THREE.CylinderGeometry(.001,.018,.13,5),yard.green,bed,[-length/2+.2+rand()*(length-.4),.13,(rand()-.5)*.58],[rand()*.3,0,rand()*.3]);
  return bed;
}
function addStringLights(g,a,b,sag,count=9){
  const yard=yardMaterials();lineTube(g,sagPoints(a,b,sag,7),.007,M.black,18);
  for(let i=1;i<count;i++){
    const t=i/count,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t-sag*4*t*(1-t),z=a[2]+(b[2]-a[2])*t;
    box(g,[.006,.07,.006],[x,y-.035,z],M.black,0);
    lowSphere(g,.026,[x,y-.095,z],yard.bulb,[1,1,1],0);
  }
}
function addSideLantern(g,x,y,z,dir){
  const yard=yardMaterials();
  box(g,[.07,.36,.13],[x,y,z],yard.iron,.01);
  cyl(g,.016,.016,.4,[x+dir*.2,y+.2,z],yard.iron,[0,0,Math.PI/2],8);
  cyl(g,.07,.18,.13,[x+dir*.4,y+.12,z],yard.iron,[0,0,0],18);
  lowSphere(g,.068,[x+dir*.4,y-.015,z],yard.bulb,[1,1.25,1],0);
  mesh(new THREE.PlaneGeometry(.85,.85),yard.glow,g,[x+dir*.43,y-.02,z],[0,dir>0?Math.PI/2:-Math.PI/2,0]);
}
function addPigeon(g,pos,rotY,scale=1){
  const yard=yardMaterials(),bird=new THREE.Group();bird.position.set(...pos);bird.rotation.y=rotY;bird.scale.setScalar(scale);g.add(bird);
  blob(bird,.072,[0,.075,0],yard.stone,[1,.78,1.35]);
  lowSphere(bird,.037,[0,.135,.085],M.black);
  mesh(new THREE.CylinderGeometry(.001,.011,.038,5),M.gold,bird,[0,.13,.128],[Math.PI/2,0,0]);
  box(bird,[.075,.014,.1],[0,.075,-.105],M.black,0,[.22,0,0]);
  for(const side of [-1,1])box(bird,[.008,.055,.008],[side*.025,.028,.01],M.rust,0);
  return bird;
}
function addPalletStack(g,pos,rotY){
  const yard=yardMaterials(),stack=new THREE.Group();stack.position.set(...pos);stack.rotation.y=rotY;g.add(stack);
  for(let level=0;level<3;level++){
    const y=.08+level*.16;
    for(const z of [-.36,-.18,0,.18,.36])box(stack,[1.08,.026,.105],[0,y+.055,z],level%2?M.rust:yard.wood,0);
    for(const x of [-.45,0,.45])for(const z of [-.36,0,.36])box(stack,[.1,.085,.1],[x,y,z],M.rust,0);
  }
  box(stack,[.58,.38,.48],[.05,.72,0],M.paper,.01,[0,.12,0]);
  return stack;
}
function addLivingCourtyard(g){
  const yard=yardMaterials();
  addBench(g,[-5.45,0,-.75],Math.PI/2);
  addBench(g,[5.7,0,-5.25],0);
  addGardenBed(g,[-7.02,0,1.95],Math.PI/2,4.8,21);
  addGardenBed(g,[8.02,0,1.75],Math.PI/2,4.3,33);
  addGardenBed(g,[5.95,0,-6.08],0,3.5,47);
  addGardenBed(g,[-6.35,0,-6.08],0,2.1,58);
  addStringLights(g,[-7.55,5.0,-3.6],[-2.35,5.05,-6.55],.34,9);
  addSideLantern(g,-7.62,2.75,-4.9,1);
  addSideLantern(g,-7.62,2.75,3.8,1);
  addSideLantern(g,8.62,2.75,-4.9,-1);
  addSideLantern(g,8.62,2.75,2.8,-1);
  // A worn diagonal path from the arch gives the foreground a route and scale.
  for(let i=0;i<8;i++){
    const t=i/7,x=-3.8+2.05*t+((i%2)?.07:-.06),z=-5.55+9.65*t;
    box(g,[.96,.035,.72],[x,.018,z],yard.stone,0,[0,.1+((i%3)-1)*.035,0]);
    box(g,[.78,.012,.035],[x,.04,z+.34],yard.leafDark,0,[0,.1,0]);
  }
  // Chess table and stools by the left wall.
  cyl(g,.035,.05,.66,[-4.5,.33,-1.85],yard.iron,[0,0,0],12);
  box(g,[.66,.045,.66],[-4.5,.68,-1.85],yard.wood,.01);
  mesh(new THREE.PlaneGeometry(.58,.58),yard.chess,g,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);
  for(const [x,z] of [[-5.05,-1.85],[-3.95,-1.85]]){cyl(g,.19,.16,.08,[x,.42,z],yard.wood,[0,0,0],18);cyl(g,.035,.045,.4,[x,.2,z],yard.iron,[0,0,0],10);}
  for(let i=0;i<8;i++)lowSphere(g,.026,[-4.68+(i%4)*.12,.735,-1.98+Math.floor(i/4)*.28],i%2?M.black:M.cream,[1,.75,1],0);
  addPalletStack(g,[-6.5,0,-4.9],.15);
  // An old panel door waits by the left wall.
  const door=new THREE.Group();door.position.set(-7.42,0,-4.05);door.rotation.z=.07;g.add(door);
  box(door,[.07,2.05,.96],[0,1.03,0],yard.wood,.01);
  for(const y of [.55,1.25,1.72])box(door,[.018,y===1.25?.48:.34,.68],[.047,y,0],M.rust,0);
  lowSphere(door,.035,[.075,1.02,.34],M.silver);
  // Tyres and a tarp-covered scooter along the right wall.
  for(let i=0;i<3;i++)mesh(new THREE.TorusGeometry(.34,.105,8,26),M.rubber,g,[7.58,.13+i*.22,-5.82],[Math.PI/2,0,i*.2]);
  mesh(new THREE.TorusGeometry(.34,.105,8,26),M.rubber,g,[7.03,.36,-5.72],[.2,.35,1.25]);
  const scooter=new THREE.Group();scooter.position.set(7.5,0,-3.0);scooter.rotation.y=.04;g.add(scooter);
  box(scooter,[.62,.58,1.72],[0,.58,0],M.leather,.18);
  box(scooter,[.54,.46,1.0],[0,1.02,-.12],M.leather,.19);
  box(scooter,[.5,.34,.46],[0,1.04,.58],M.leather,.16);
  for(const z of [-.42,.22])box(scooter,[.65,.018,.035],[0,.84,z],M.black,0);
  for(const z of [-.58,.58])mesh(new THREE.CylinderGeometry(.29,.29,.09,20),M.rubber,scooter,[0,.29,z],[0,0,Math.PI/2]);
  // Foreground play traces: kick scooter, hopscotch, crumbs and residents.
  const kick=new THREE.Group();kick.position.set(6.35,0,4.5);kick.rotation.y=-.55;g.add(kick);
  box(kick,[.1,.035,.6],[0,.1,0],M.red,.01);
  for(const z of [-.25,.25])mesh(new THREE.CylinderGeometry(.075,.075,.035,14),M.black,kick,[0,.075,z],[0,0,Math.PI/2]);
  lineTube(kick,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,M.silver,8);
  box(kick,[.36,.025,.025],[0,.78,.4],M.black,0);
  mesh(new THREE.PlaneGeometry(.88,2.35),yard.chalk,g,[4.55,.018,3.65],[-Math.PI/2,0,.22]);
  lowSphere(g,.16,[-4.72,.16,1.85],M.red,[1,.92,1]);
  addCat(g,[-4.32,0,-.22],1,1.49,M.black);
  const pigeonSpots=[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]];
  pigeonSpots.forEach(([x,z,rot],i)=>addPigeon(g,[x,0,z],rot,.9+i*.04));
  for(let i=0;i<14;i++)blob(g,.012,[3.45+((i*37)%70)/100,.025,1.15+((i*53)%55)/100],M.cream,[1,.55,1],0);
  // Warm pools below lamps and lit ground-floor windows (emissive decals, no new lights).
  for(const [x,z,w,h,rot] of [[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){
    const glow=mesh(new THREE.PlaneGeometry(w,h),yard.glow,g,[x,.019,z],[-Math.PI/2,0,rot]);glow.renderOrder=1;
  }
  for(const [x,z,w,h] of [[7.5,-3.0,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]]){
    mesh(new THREE.PlaneGeometry(w,h),yard.contact,g,[x,.021,z],[-Math.PI/2,0,0]);
  }
}

// Warm light leaking from a window, shared with the facade.
export const LIT=new THREE.MeshStandardMaterial({color:0x5c4a2e,emissive:0xffb765,emissiveIntensity:1.9,roughness:.65});

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

// The fourth side of the courtyard: a full facade with the street passage.
// A real arched hole through the masonry, a double iron gate (one leaf ajar)
// and the warm alley behind it. The whole side is batched on its own so the
// camera facing the bin can frustum-cull it completely.
const gatePaint=new THREE.MeshStandardMaterial({color:0x3b4038,roughness:.82});
export function addGateFacade(g,{width=23,height=13.5,stone,trim,dark,wall,glass,lit,seed=101,gateX=0}){
  const yard=yardMaterials(),rand=seeded(seed*7+13);
  const gateHalf=1.55,spring=2.55,archR=gateHalf,apex=spring+archR;
  const outline=new THREE.Shape();
  outline.moveTo(-width/2,0);outline.lineTo(width/2,0);outline.lineTo(width/2,height);outline.lineTo(-width/2,height);outline.closePath();
  const hole=new THREE.Path();
  hole.moveTo(gateX-gateHalf,0);hole.lineTo(gateX-gateHalf,spring);
  hole.absarc(gateX,spring,archR,Math.PI,0,true);
  hole.lineTo(gateX+gateHalf,0);hole.closePath();
  outline.holes.push(hole);
  mesh(new THREE.ExtrudeGeometry(outline,{depth:.65,bevelEnabled:false,curveSegments:22}),wall,g,[0,0,-.325]);
  // Plinth and string courses stop at the arch pier, like real masonry.
  for(const [x0,x1] of [[-width/2,gateX-gateHalf-.12],[gateX+gateHalf+.12,width/2]])box(g,[x1-x0,.75,.78],[(x0+x1)/2,.375,.025],stone,0);
  for(const y of [3.28,6.2,9.15]){
    for(const [x0,x1] of [[-width/2,gateX-gateHalf-.12],[gateX+gateHalf+.12,width/2]]){
      const w=x1-x0;if(w<.5)continue;
      box(g,[w,.14,.87],[(x0+x1)/2,y,.055],trim,0);
      box(g,[w,.07,.98],[(x0+x1)/2,y+.09,.08],stone,0);
    }
  }
  box(g,[width,.35,1.06],[0,height-.12,.05],trim,0);
  // Stone frame around the opening: rusticated jambs, arch ring and keystone.
  for(const sign of [-1,1])box(g,[.36,spring+.05,.62],[gateX+sign*(gateHalf+.18),spring/2,.06],stone,.02);
  const archCurve=new THREE.EllipseCurve(0,0,archR+.20,archR+.20,0,Math.PI,false,0);
  const pts=archCurve.getPoints(30).map(p=>new THREE.Vector3(p.x,p.y,0));
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),30,.17,7,false),stone,g,[gateX,spring,.06]);
  box(g,[.26,.62,.72],[gateX,apex+.16,.09],stone,.02);
  for(let i=1;i<7;i++){
    const a=Math.PI*i/7,x=Math.cos(a)*(archR+.20),y=Math.sin(a)*(archR+.20);
    box(g,[.17,.3,.52],[gateX+x,spring+y,.03],stone,.012,[0,0,-a+Math.PI/2]);
  }
  // Recessed passage behind the gate: floor, jambs and a dim far end with a lamp.
  const passage=new THREE.MeshStandardMaterial({color:0x1d211c,roughness:.96});
  box(g,[gateHalf*2+.6,.06,3.6],[gateX,0,-1.85],stone,0);
  box(g,[.24,4.6,3.6],[gateX-gateHalf-.32,2.3,-1.85],passage,0);
  box(g,[.24,4.6,3.6],[gateX+gateHalf+.32,2.3,-1.85],passage,0);
  box(g,[3.4,.2,3.6],[gateX,apex+.62,-1.85],stone,0);
  box(g,[3.4,4.8,.12],[gateX,2.4,-3.7],passage,0);
  const farLight=canvasTexture((c,s)=>{const gr=c.createLinearGradient(0,0,0,s);gr.addColorStop(0,'rgba(52,60,58,1)');gr.addColorStop(.42,'rgba(85,74,54,1)');gr.addColorStop(1,'rgba(34,38,34,1)');c.fillStyle=gr;c.fillRect(0,0,s,s);const lamp=c.createRadialGradient(s*.5,s*.30,0,s*.5,s*.30,s*.46);lamp.addColorStop(0,'rgba(255,198,118,.95)');lamp.addColorStop(.45,'rgba(255,174,92,.38)');lamp.addColorStop(1,'rgba(255,160,80,0)');c.fillStyle=lamp;c.fillRect(0,0,s,s);});
    mesh(new THREE.PlaneGeometry(3.2,4.6),new THREE.MeshBasicMaterial({map:farLight,color:0xb9bdb4,fog:false}),g,[gateX,2.3,-3.63]);
  // A dim second plane behind the first gives the alley real depth instead of
  // one glowing wall filling the arch.
  mesh(new THREE.PlaneGeometry(3.0,4.2),new THREE.MeshBasicMaterial({map:farLight,color:0x64685f,toneMapped:false}),g,[gateX,2.25,-4.6]);
  box(g,[1.1,.4,.36],[gateX-.55,2.1,-2.1],passage,0);
  box(g,[.5,.9,.3],[gateX+.7,.28,-2.2],passage,0);
  // Iron gate: frame, lower wooden panel, bars. Both leaves stop at the
  // springing; the arched transom above is fixed to the masonry.
  const leaf=(side,open=0)=>{
    const leafG=new THREE.Group(),w=gateHalf-.06,h=spring-.10;
    leafG.position.set(gateX+side*(gateHalf-.02),0,.02);leafG.rotation.y=side*open;g.add(leafG);
    const cx=-side*w/2;
    for(const y of [.07,h])box(leafG,[w,.1,.09],[cx,y,0],M.black,.012);
    for(const x of [cx-w/2+.045,cx+w/2-.045])box(leafG,[.09,h,.09],[x,h/2,0],M.black,.012);
    const panelH=.92;
    box(leafG,[w-.12,panelH,.07],[cx,panelH/2+.1,0],gatePaint,.01);
    for(let i=0;i<3;i++)box(leafG,[w-.18,.03,.09],[cx,panelH*(i+.5)/3+.1,.012],M.rust,0);
    for(let x=cx-w/2+.14;x<cx+w/2-.1;x+=.17)box(leafG,[.03,h-panelH-.24,.03],[x,panelH+.12+(h-panelH-.24)/2,.012],M.black,0);
    for(const y of [h-.12,2.02,panelH+.32])box(leafG,[w-.14,.05,.055],[cx,y,.012],M.black,0);
    for(const y of [.42,.95])cyl(leafG,.035,.035,.09,[cx+side*(w/2-.02),y,0],M.black,[0,0,0],10);
    torus(leafG,.1,.013,[cx,h*.8,.02],M.black);
    return leafG;
  };
  leaf(-1,.30);leaf(1,0);
  // Arched transom bars above the leaves, following the stone arch.
  for(let i=-3;i<=3;i++){
    const x=gateX+i*.42,half=Math.sqrt(Math.max(0,archR*archR-x*x)),top=spring+half*.96,bottom=spring-.10;
    if(top-bottom<.12)continue;
    box(g,[.028,top-bottom,.028],[x,(top+bottom)/2,.055],M.black,0);
  }
  const transomArc=new THREE.EllipseCurve(0,0,archR-.02,archR-.02,0,Math.PI,false,0);
  const tpts=transomArc.getPoints(20).map(p=>new THREE.Vector3(p.x,p.y,0));
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tpts),20,.03,5,false),M.black,g,[gateX,spring,.055]);
  for(let i=0;i<5;i++){const a=Math.PI*(i+1)/6;box(g,[.05,.05,.05],[gateX+Math.cos(a)*(archR-.02),spring+Math.sin(a)*(archR-.02),.075],M.black,0);}
  // A lamp above the gate and the enamel street plate beside it.
  cyl(g,.02,.02,.5,[gateX,apex+.9,.36],M.black,[0,0,0],8);
  cyl(g,.11,.2,.14,[gateX,apex+.5,.36],M.black,[0,0,0],14);
  lowSphere(g,.082,[gateX,apex+.4,.36],yard.bulb,[1,1.45,1],0);
  mesh(new THREE.PlaneGeometry(1.5,1.5),yard.glow,g,[gateX,apex+.36,.5]);
  const plate=new THREE.MeshStandardMaterial({map:textTexture('',{bg:'#223c4a',color:'#ece8d5',lines:['ДОХОДНЫЙ ДОМ','17 · 2'],font:66}),roughness:.42});
  box(g,[.62,.46,.06],[gateX+2.3,2.35,.35],M.black,0);mesh(new THREE.PlaneGeometry(.57,.41),plate,g,[gateX+2.3,2.35,.39]);
  // Windows. Rows above the arch keep their life details; the ground floor
  // beside the passage stays calmer so the gate reads first.
  const cols=Math.floor(width/2.47);
  for(let col=0;col<cols;col++)for(let row=0;row<4;row++){
    const x=(col-(cols-1)/2)*2.47,y=1.72+row*2.95;
    if(Math.abs(x-gateX)<3.3&&row<2)continue;
    const w=1.16,h=1.91,key=300+row*10+col;
    box(g,[w+.26,h+.27,.14],[x,y,.38],trim,0);
    box(g,[w+.05,h+.06,.1],[x,y,.47],dark,0);
    const state=windowTreatment(col,row,2);
    const glazing=state==='lit'?lit:glass[(col+row)%glass.length];
    box(g,[w,h,.04],[x,y,.54],glazing,0);
    for(const dx of [-w/2,w/2,0])box(g,[.048,h,.09],[x+dx,y,.58],stone,0);
    for(const dy of [-h/2,h/2,.24])box(g,[w,.047,.09],[x,y+dy,.58],stone,0);
    box(g,[w+.4,.12,.43],[x,y-h/2-.09,.55],trim,0);
    addWindowDetails(g,x,y,w,h,stone,dark,trim);
    if(row>=1)addWindowLife(g,x,y,w,h,state,trim,glazing,key);
  }
  for(const x of [-width/2+.35,width/2-.38]){cyl(g,.07,.07,height,[x,height/2,.53],dark,[0,0,0],12);for(let y=1;y<height;y+=2)cyl(g,.087,.087,.055,[x,y,.53],M.rust,[0,0,0],12);}
  // Weathering and paper only beside the passage, never across it.
  const damp=new THREE.MeshBasicMaterial({map:grimeTexture(),transparent:true,depthWrite:false,opacity:.66,polygonOffset:true,polygonOffsetFactor:-1});
  for(const [x0,x1] of [[-width/2,gateX-gateHalf-.5],[gateX+gateHalf+.5,width/2]].filter(([a,b])=>b-a>1)){
    mesh(new THREE.PlaneGeometry(x1-x0,.9),damp,g,[(x0+x1)/2,.55,.345]);
  }
  mesh(atlasPlane(.48,.64,seed%4,2,2),yard.poster,g,[gateX-3.15,1.62,.353],[0,0,.03]);
  for(let i=0;i<22;i++){
    const baseX=i<11?-width/2+.55:width/2-.55,xx=baseX+Math.sin(i*.55)*.26+(rand()-.5)*.2;
    mesh(new THREE.CircleGeometry(.05+rand()*.075,7),i%3?yard.leafDark:yard.green,g,[xx,.5+i*.17,.355+rand()*.04],[0,0,rand()*Math.PI]);
  }
  // Roofline: chimneys and an antenna, visible when the head is raised.
  for(const x of [-width*.32,width*.3]){
    box(g,[.78,.98,.78],[x,height+.48,-.05],stone,0);
    box(g,[.94,.13,.94],[x,height+1.02,-.05],stone,0);
    cyl(g,.09,.11,.24,[x-.16,height+1.19,-.05],M.rust,[0,0,0],10);
    cyl(g,.09,.11,.24,[x+.16,height+1.19,-.05],M.rust,[0,0,0],10);
  }
  cyl(g,.018,.018,1.42,[width*.12,height+.76,.18],M.black,[0,0,0],8);
  box(g,[.88,.025,.025],[width*.12,height+1.12,.18],M.black,0);
  box(g,[.58,.025,.025],[width*.12,height+1.36,.18],M.black,0);
  return g;
}

// A simple roof edge reads as a real skyline from inside the courtyard, so the
// sky above the facades is not a raw box cut.
export function addRoofBand(g,width,height,roofMat,trim){
  // A cornice with a thin overhang and a parapet lip: from inside the well this
  // reads as a real roofline, and it does not paint a huge slab across the sky.
  box(g,[width+.1,.34,1.0],[0,height+.17,.28],trim,.01);
  box(g,[width+.1,.08,1.28],[0,height+.36,.34],stoneLike(trim),0);
  mesh(new THREE.BoxGeometry(width+.1,.1,1.05),roofMat,g,[0,height+.47,.62],[.22,0,0]);
  box(g,[width+.1,.16,.12],[0,height+.5,1.06],trim,0);
  for(const x of [-width*.34,width*.18,-width*.05])box(g,[.16,.2,.16],[x,height+.62,.95],M.rust,0);
}
function stoneLike(trim){
  if(!stoneLike.mat)stoneLike.mat=trim.clone(),stoneLike.mat.color.offsetHSL(0,-.03,.04);
  return stoneLike.mat;
}

