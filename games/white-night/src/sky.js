import * as THREE from 'three';
import { canvasTexture, seeded } from './materials.js';

// White-night sky: a cold zenith over a low warm sodium glow, a real moon and a
// star field. Everything is static and shares three draw calls (dome, stars,
// moon + glow sprite), so looking up costs almost nothing per frame.
export function createNightSky(){
  const group=new THREE.Group();
  group.name='sky';

  const skyGeo=new THREE.SphereGeometry(55,32,18),domeColors=[];
  const horizon=new THREE.Color('#6a5142'),mid=new THREE.Color('#253a55'),zenith=new THREE.Color('#08111f');
  for(let i=0;i<skyGeo.attributes.position.count;i++){
    const h=THREE.MathUtils.smoothstep(skyGeo.attributes.position.getY(i)/55,-.04,.62);
    const c=h<.40?horizon.clone().lerp(mid,h/.40):mid.clone().lerp(zenith,(h-.40)/.60);
    c.toArray(domeColors,i*3);
  }
  skyGeo.setAttribute('color',new THREE.Float32BufferAttribute(domeColors,3));
  const dome=new THREE.Mesh(skyGeo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false}));
  dome.renderOrder=-30;dome.name='sky-dome';group.add(dome);

  // Soft round sprite shared by every star: one texture, one draw call.
  const starSprite=canvasTexture((c,s)=>{
    const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.34,'rgba(255,255,255,.86)');
    g.addColorStop(.62,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,0)');
    c.fillStyle=g;c.fillRect(0,0,s,s);
  },64);

  // Колодец прячет почти всё небо: из двора виден лишь узкий прямоугольник над крышами,
  // до 100 звёзд. Остальные за домом — рисовать их незачем, это лишь перерисовка.
  const rand=seeded(20261),count=105,positions=[],starColors=[];
  const cool=new THREE.Color('#e6efff'),warm=new THREE.Color('#ffe8c6'),blue=new THREE.Color('#bcd3ff');
  for(let i=0;i<count;i++){
    // Только то, что попадает в створ двора: высоко над крышей (>52°), иначе стена закрывает.
    const az=rand()*Math.PI*2;
    const elev=.90+Math.pow(rand(),.65)*.58; // 52°—85°, узкое окно колодца
    const radius=49+rand()*3,ce=Math.cos(elev);
    positions.push(Math.sin(az)*ce*radius,Math.sin(elev)*radius,-Math.cos(az)*ce*radius);
    const pick=rand();
    const color=(pick>.72?warm:pick>.34?cool:blue).clone();
    const fade=THREE.MathUtils.clamp((elev-.90)/.25,0,1);
    const brightness=(.55+Math.pow(rand(),1.4)*.45)*fade;
    starColors.push(color.r*brightness,color.g*brightness,color.b*brightness);
  }
  const starGeo=new THREE.BufferGeometry();
  starGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  starGeo.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));
  const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({map:starSprite,size:2.9,sizeAttenuation:false,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,toneMapped:false,alphaTest:.01}));
  stars.renderOrder=-20;stars.frustumCulled=false;stars.name='sky-stars';group.add(stars);

  // A slightly oversized, softly limb-darkened moon reads clearly on a phone
  // without becoming a lamp: about 2.7 degrees across, like a bright full moon.
  // High in the well: a courtyard is deep, so the moon must sit well above
  // the roofline to be seen when the head is raised.
  // 62 degrees up, over the passage: visible in the sky slot when the head is
  // raised, exactly where a full moon shows above a Petersburg well.
  const moonDir=new THREE.Vector3(-.16,.883,-.442).normalize();
  const moonPos=moonDir.clone().multiplyScalar(44);
  const moonTex=canvasTexture((c,s,r)=>{
    // A crisp disc inside a transparent square: the sprite can never show a
    // wrapped sphere map, so the crescent edge stays round from any angle.
    const R=s*.47,cx=s/2,cy=s/2;
    c.clearRect(0,0,s,s);
    const body=c.createRadialGradient(cx-R*.22,cy-R*.26,R*.06,cx,cy,R);
    body.addColorStop(0,'#fbfcf7');body.addColorStop(.62,'#e6e9ee');body.addColorStop(.9,'#cfd5e0');body.addColorStop(1,'#b9c1cf');
    c.fillStyle=body;c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.fill();
    c.save();c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.clip();
    for(let i=0;i<26;i++){
      const a=r()*Math.PI*2,d=Math.sqrt(r())*R*.92,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d,rad=R*(.03+r()*.13);
      const g=c.createRadialGradient(x,y,0,x,y,rad);
      g.addColorStop(0,`rgba(132,142,160,${.10+r()*.17})`);g.addColorStop(1,'rgba(132,142,160,0)');
      c.fillStyle=g;c.beginPath();c.arc(x,y,rad,0,Math.PI*2);c.fill();
    }
    // Maria: a few wide, very soft darker seas.
    for(let i=0;i<5;i++){
      const a=r()*Math.PI*2,d=Math.sqrt(r())*R*.62,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d,rad=R*(.16+r()*.16);
      const g=c.createRadialGradient(x,y,0,x,y,rad);
      g.addColorStop(0,'rgba(150,158,174,.16)');g.addColorStop(1,'rgba(150,158,174,0)');
      c.fillStyle=g;c.beginPath();c.arc(x,y,rad,0,Math.PI*2);c.fill();
    }
    const limb=c.createRadialGradient(cx,cy,R*.2,cx,cy,R);
    limb.addColorStop(0,'rgba(255,255,255,0)');limb.addColorStop(.78,'rgba(150,162,186,.13)');limb.addColorStop(1,'rgba(96,110,138,.42)');
    c.fillStyle=limb;c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.fill();
    c.restore();
  },256);
  moonTex.colorSpace=THREE.SRGBColorSpace;
  const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:moonTex,transparent:true,depthWrite:false,fog:false,toneMapped:false}));
  moon.position.copy(moonPos);moon.scale.set(2.25,2.25,1);moon.name='sky-moon';group.add(moon);

  const halo=canvasTexture((c,s)=>{
    const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    g.addColorStop(0,'rgba(226,236,255,.9)');g.addColorStop(.22,'rgba(198,216,255,.34)');
    g.addColorStop(.5,'rgba(170,196,255,.10)');g.addColorStop(1,'rgba(150,180,255,0)');
    c.fillStyle=g;c.fillRect(0,0,s,s);
  },128);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:halo,color:0xdde8ff,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,toneMapped:false}));
  glow.position.copy(moonPos).multiplyScalar(.99);glow.scale.set(9.5,9.5,1);glow.name='sky-moon-glow';group.add(glow);

  return {group,dome,stars,moon,glow,moonDirection:moonDir.clone(),update(){}};
}
