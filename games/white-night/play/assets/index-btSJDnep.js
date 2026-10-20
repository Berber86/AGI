(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jl="180",Bf=0,Ic=1,kf=2,du=1,pu=2,ii=3,bi=0,qe=1,Ie=2,Je=0,Ss=1,lr=2,Lc=3,Dc=4,mu=5,ri=100,Hf=101,Gf=102,Vf=103,Wf=104,Vo=200,Xf=201,qf=202,Yf=203,Wo=204,Xo=205,gu=206,Zf=207,_u=208,$f=209,Jf=210,Kf=211,jf=212,Qf=213,td=214,qo=0,Yo=1,Zo=2,Ts=3,$o=4,Jo=5,Ko=6,jo=7,Ql=0,ed=1,nd=2,yi=0,xu=1,vu=2,yu=3,tc=4,Mu=5,Su=6,bu=7,Tu=300,Es=301,ws=302,Qo=303,tl=304,Ba=306,Ti=1e3,ki=1001,el=1002,Qe=1003,id=1004,wr=1005,Hn=1006,eo=1007,Hi=1008,Xn=1009,Eu=1010,wu=1011,cr=1012,ec=1013,Wi=1014,In=1015,qn=1016,nc=1017,ic=1018,As=1020,Au=35902,Ru=35899,Cu=1021,Pu=1022,Ln=1023,hr=1026,Rs=1027,ka=1028,sc=1029,Iu=1030,rc=1031,ac=1033,ga=33776,_a=33777,xa=33778,va=33779,nl=35840,il=35841,sl=35842,rl=35843,al=36196,ol=37492,ll=37496,cl=37808,hl=37809,ul=37810,fl=37811,dl=37812,pl=37813,ml=37814,gl=37815,_l=37816,xl=37817,vl=37818,yl=37819,Ml=37820,Sl=37821,bl=36492,Tl=36494,El=36495,wl=36283,Al=36284,Rl=36285,Cl=36286,sd=3200,rd=3201,Ha=0,ad=1,cn="",Be="srgb",Cs="srgb-linear",wa="linear",ue="srgb",ji=7680,Uc=519,od=512,ld=513,cd=514,Lu=515,hd=516,ud=517,fd=518,dd=519,Pl=35044,Ar=35048,Nc="300 es",Gn=2e3,Aa=2001;class Us{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fc=1234567;const ir=Math.PI/180,ur=180/Math.PI;function Vn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[i&255]+Ge[i>>8&255]+Ge[i>>16&255]+Ge[i>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function oc(i,t){return(i%t+t)%t}function pd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function md(i,t,e){return i!==t?(e-i)/(t-i):0}function sr(i,t,e){return(1-e)*i+e*t}function gd(i,t,e,n){return sr(i,t,1-Math.exp(-e*n))}function _d(i,t=1){return t-Math.abs(oc(i,t*2)-t)}function xd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function vd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function yd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Md(i,t){return i+Math.random()*(t-i)}function Sd(i){return i*(.5-Math.random())}function bd(i){i!==void 0&&(Fc=i);let t=Fc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Td(i){return i*ir}function Ed(i){return i*ur}function wd(i){return(i&i-1)===0&&i!==0}function Ad(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Rd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Cd(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),f=r((t-n)/2),p=a((t-n)/2),u=r((n-t)/2),m=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*f,l*p,o*c);break;case"YZY":i.set(l*p,o*h,l*f,o*c);break;case"ZXZ":i.set(l*f,l*p,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*u,o*c);break;case"YXY":i.set(l*u,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function fe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const De={DEG2RAD:ir,RAD2DEG:ur,generateUUID:Vn,clamp:ne,euclideanModulo:oc,mapLinear:pd,inverseLerp:md,lerp:sr,damp:gd,pingpong:_d,smoothstep:xd,smootherstep:vd,randInt:yd,randFloat:Md,randFloatSpread:Sd,seededRandom:bd,degToRad:Td,radToDeg:Ed,isPowerOfTwo:wd,ceilPowerOfTwo:Ad,floorPowerOfTwo:Rd,setQuaternionFromProperEuler:Cd,normalize:fe,denormalize:Pn};class rt{constructor(t=0,e=0){rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class vn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3];const p=r[a+0],u=r[a+1],m=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=u,t[e+2]=m,t[e+3]=_;return}if(f!==_||l!==p||c!==u||h!==m){let g=1-o;const d=l*p+c*u+h*m+f*_,x=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const A=Math.sqrt(y),b=Math.atan2(A,d*x);g=Math.sin(g*b)/A,o=Math.sin(o*b)/A}const v=o*x;if(l=l*g+p*v,c=c*g+u*v,h=h*g+m*v,f=f*g+_*v,g===1-o){const A=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=A,c*=A,h*=A,f*=A}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],p=r[a+1],u=r[a+2],m=r[a+3];return t[e]=o*m+h*f+l*u-c*p,t[e+1]=l*m+h*p+c*f-o*u,t[e+2]=c*m+h*u+o*p-l*f,t[e+3]=h*m-o*f-l*p-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),p=l(n/2),u=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=p*h*f+c*u*m,this._y=c*u*f-p*h*m,this._z=c*h*m+p*u*f,this._w=c*h*f-p*u*m;break;case"YXZ":this._x=p*h*f+c*u*m,this._y=c*u*f-p*h*m,this._z=c*h*m-p*u*f,this._w=c*h*f+p*u*m;break;case"ZXY":this._x=p*h*f-c*u*m,this._y=c*u*f+p*h*m,this._z=c*h*m+p*u*f,this._w=c*h*f-p*u*m;break;case"ZYX":this._x=p*h*f-c*u*m,this._y=c*u*f+p*h*m,this._z=c*h*m-p*u*f,this._w=c*h*f+p*u*m;break;case"YZX":this._x=p*h*f+c*u*m,this._y=c*u*f+p*h*m,this._z=c*h*m-p*u*f,this._w=c*h*f-p*u*m;break;case"XZY":this._x=p*h*f-c*u*m,this._y=c*u*f-p*h*m,this._z=c*h*m+p*u*f,this._w=c*h*f+p*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],p=n+o+f;if(p>0){const u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(n>o&&n>f){const u=2*Math.sqrt(1+n-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-n-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-n-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-e)*h)/c,p=Math.sin(e*h)/c;return this._w=a*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=r*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Oc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Oc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return no.copy(this).projectOnVector(t),this.sub(no)}reflect(t){return this.sub(no.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const no=new U,Oc=new vn;class te{constructor(t,e,n,s,r,a,o,l,c){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],p=n[2],u=n[5],m=n[8],_=s[0],g=s[3],d=s[6],x=s[1],y=s[4],v=s[7],A=s[2],b=s[5],w=s[8];return r[0]=a*_+o*x+l*A,r[3]=a*g+o*y+l*b,r[6]=a*d+o*v+l*w,r[1]=c*_+h*x+f*A,r[4]=c*g+h*y+f*b,r[7]=c*d+h*v+f*w,r[2]=p*_+u*x+m*A,r[5]=p*g+u*y+m*b,r[8]=p*d+u*v+m*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,p=o*l-h*r,u=c*r-a*l,m=e*f+n*p+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=f*_,t[1]=(s*c-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=p*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=u*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(io.makeScale(t,e)),this}rotate(t){return this.premultiply(io.makeRotation(-t)),this}translate(t,e){return this.premultiply(io.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const io=new te;function Du(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function fr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Pd(){const i=fr("canvas");return i.style.display="block",i}const zc={};function dr(i){i in zc||(zc[i]=!0,console.warn(i))}function Id(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Bc=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kc=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ld(){const i={enabled:!0,workingColorSpace:Cs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ue&&(s.r=li(s.r),s.g=li(s.g),s.b=li(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ue&&(s.r=bs(s.r),s.g=bs(s.g),s.b=bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===cn?wa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return dr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return dr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Cs]:{primaries:t,whitePoint:n,transfer:wa,toXYZ:Bc,fromXYZ:kc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:n,transfer:ue,toXYZ:Bc,fromXYZ:kc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),i}const le=Ld();function li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Qi;class Dd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Qi===void 0&&(Qi=fr("canvas")),Qi.width=t.width,Qi.height=t.height;const s=Qi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Qi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=li(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(li(e[n]/255)*255):e[n]=li(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ud=0;class lc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=Vn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(so(s[a].image)):r.push(so(s[a]))}else r=so(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function so(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Dd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Nd=0;const ro=new U;class ke extends Us{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,n=ki,s=ki,r=Hn,a=Hi,o=Ln,l=Xn,c=ke.DEFAULT_ANISOTROPY,h=cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=Vn(),this.name="",this.source=new lc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ro).x}get height(){return this.source.getSize(ro).y}get depth(){return this.source.getSize(ro).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ti:t.x=t.x-Math.floor(t.x);break;case ki:t.x=t.x<0?0:1;break;case el:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ti:t.y=t.y-Math.floor(t.y);break;case ki:t.y=t.y<0?0:1;break;case el:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=Tu;ke.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,n=0,s=1){me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],p=l[1],u=l[5],m=l[9],_=l[2],g=l[6],d=l[10];if(Math.abs(h-p)<.01&&Math.abs(f-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,v=(u+1)/2,A=(d+1)/2,b=(h+p)/4,w=(f+_)/4,E=(m+g)/4;return y>v&&y>A?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=b/n,r=w/n):v>A?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=b/s,r=E/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=w/r,s=E/r),this.set(n,s,r,e),this}let x=Math.sqrt((g-m)*(g-m)+(f-_)*(f-_)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(f-_)/x,this.z=(p-h)/x,this.w=Math.acos((c+u+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Fd extends Us{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Hn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new ke(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Hn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new lc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class un extends Fd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Uu extends ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Od extends ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Dn{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Tn):Tn.fromBufferAttribute(r,a),Tn.applyMatrix4(t.matrixWorld),this.expandByPoint(Tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(t.matrixWorld),this.union(Rr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Tn),Tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(zs),Cr.subVectors(this.max,zs),ts.subVectors(t.a,zs),es.subVectors(t.b,zs),ns.subVectors(t.c,zs),ui.subVectors(es,ts),fi.subVectors(ns,es),Pi.subVectors(ts,ns);let e=[0,-ui.z,ui.y,0,-fi.z,fi.y,0,-Pi.z,Pi.y,ui.z,0,-ui.x,fi.z,0,-fi.x,Pi.z,0,-Pi.x,-ui.y,ui.x,0,-fi.y,fi.x,0,-Pi.y,Pi.x,0];return!ao(e,ts,es,ns,Cr)||(e=[1,0,0,0,1,0,0,0,1],!ao(e,ts,es,ns,Cr))?!1:(Pr.crossVectors(ui,fi),e=[Pr.x,Pr.y,Pr.z],ao(e,ts,es,ns,Cr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(jn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const jn=[new U,new U,new U,new U,new U,new U,new U,new U],Tn=new U,Rr=new Dn,ts=new U,es=new U,ns=new U,ui=new U,fi=new U,Pi=new U,zs=new U,Cr=new U,Pr=new U,Ii=new U;function ao(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ii.fromArray(i,r);const o=s.x*Math.abs(Ii.x)+s.y*Math.abs(Ii.y)+s.z*Math.abs(Ii.z),l=t.dot(Ii),c=e.dot(Ii),h=n.dot(Ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const zd=new Dn,Bs=new U,oo=new U;class Ji{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):zd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Bs.subVectors(t,this.center);const e=Bs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Bs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Bs.copy(t.center).add(oo)),this.expandByPoint(Bs.copy(t.center).sub(oo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Qn=new U,lo=new U,Ir=new U,di=new U,co=new U,Lr=new U,ho=new U;class cc{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Qn.copy(this.origin).addScaledVector(this.direction,e),Qn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){lo.copy(t).add(e).multiplyScalar(.5),Ir.copy(e).sub(t).normalize(),di.copy(this.origin).sub(lo);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ir),o=di.dot(this.direction),l=-di.dot(Ir),c=di.lengthSq(),h=Math.abs(1-a*a);let f,p,u,m;if(h>0)if(f=a*l-o,p=a*o-l,m=r*h,f>=0)if(p>=-m)if(p<=m){const _=1/h;f*=_,p*=_,u=f*(f+a*p+2*o)+p*(a*f+p+2*l)+c}else p=r,f=Math.max(0,-(a*p+o)),u=-f*f+p*(p+2*l)+c;else p=-r,f=Math.max(0,-(a*p+o)),u=-f*f+p*(p+2*l)+c;else p<=-m?(f=Math.max(0,-(-a*r+o)),p=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+p*(p+2*l)+c):p<=m?(f=0,p=Math.min(Math.max(-r,-l),r),u=p*(p+2*l)+c):(f=Math.max(0,-(a*r+o)),p=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+p*(p+2*l)+c);else p=a>0?-r:r,f=Math.max(0,-(a*p+o)),u=-f*f+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(lo).addScaledVector(Ir,p),u}intersectSphere(t,e){Qn.subVectors(t.center,this.origin);const n=Qn.dot(this.direction),s=Qn.dot(Qn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(n=(t.min.x-p.x)*c,s=(t.max.x-p.x)*c):(n=(t.max.x-p.x)*c,s=(t.min.x-p.x)*c),h>=0?(r=(t.min.y-p.y)*h,a=(t.max.y-p.y)*h):(r=(t.max.y-p.y)*h,a=(t.min.y-p.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-p.z)*f,l=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,l=(t.min.z-p.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Qn)!==null}intersectTriangle(t,e,n,s,r){co.subVectors(e,t),Lr.subVectors(n,t),ho.crossVectors(co,Lr);let a=this.direction.dot(ho),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;di.subVectors(this.origin,t);const l=o*this.direction.dot(Lr.crossVectors(di,Lr));if(l<0)return null;const c=o*this.direction.dot(co.cross(di));if(c<0||l+c>a)return null;const h=-o*di.dot(ho);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,n,s,r,a,o,l,c,h,f,p,u,m,_,g){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,p,u,m,_,g)}set(t,e,n,s,r,a,o,l,c,h,f,p,u,m,_,g){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=f,d[14]=p,d[3]=u,d[7]=m,d[11]=_,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/is.setFromMatrixColumn(t,0).length(),r=1/is.setFromMatrixColumn(t,1).length(),a=1/is.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const p=a*h,u=a*f,m=o*h,_=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=p-_*c,e[9]=-o*l,e[2]=_-p*c,e[6]=m+u*c,e[10]=a*l}else if(t.order==="YXZ"){const p=l*h,u=l*f,m=c*h,_=c*f;e[0]=p+_*o,e[4]=m*o-u,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=u*o-m,e[6]=_+p*o,e[10]=a*l}else if(t.order==="ZXY"){const p=l*h,u=l*f,m=c*h,_=c*f;e[0]=p-_*o,e[4]=-a*f,e[8]=m+u*o,e[1]=u+m*o,e[5]=a*h,e[9]=_-p*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const p=a*h,u=a*f,m=o*h,_=o*f;e[0]=l*h,e[4]=m*c-u,e[8]=p*c+_,e[1]=l*f,e[5]=_*c+p,e[9]=u*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const p=a*l,u=a*c,m=o*l,_=o*c;e[0]=l*h,e[4]=_-p*f,e[8]=m*f+u,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=u*f+m,e[10]=p-_*f}else if(t.order==="XZY"){const p=a*l,u=a*c,m=o*l,_=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=p*f+_,e[5]=a*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=o*h,e[10]=_*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Bd,t,kd)}lookAt(t,e,n){const s=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),pi.crossVectors(n,an),pi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),pi.crossVectors(n,an)),pi.normalize(),Dr.crossVectors(an,pi),s[0]=pi.x,s[4]=Dr.x,s[8]=an.x,s[1]=pi.y,s[5]=Dr.y,s[9]=an.y,s[2]=pi.z,s[6]=Dr.z,s[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],p=n[9],u=n[13],m=n[2],_=n[6],g=n[10],d=n[14],x=n[3],y=n[7],v=n[11],A=n[15],b=s[0],w=s[4],E=s[8],M=s[12],S=s[1],C=s[5],D=s[9],I=s[13],F=s[2],O=s[6],k=s[10],X=s[14],H=s[3],K=s[7],nt=s[11],lt=s[15];return r[0]=a*b+o*S+l*F+c*H,r[4]=a*w+o*C+l*O+c*K,r[8]=a*E+o*D+l*k+c*nt,r[12]=a*M+o*I+l*X+c*lt,r[1]=h*b+f*S+p*F+u*H,r[5]=h*w+f*C+p*O+u*K,r[9]=h*E+f*D+p*k+u*nt,r[13]=h*M+f*I+p*X+u*lt,r[2]=m*b+_*S+g*F+d*H,r[6]=m*w+_*C+g*O+d*K,r[10]=m*E+_*D+g*k+d*nt,r[14]=m*M+_*I+g*X+d*lt,r[3]=x*b+y*S+v*F+A*H,r[7]=x*w+y*C+v*O+A*K,r[11]=x*E+y*D+v*k+A*nt,r[15]=x*M+y*I+v*X+A*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],p=t[10],u=t[14],m=t[3],_=t[7],g=t[11],d=t[15];return m*(+r*l*f-s*c*f-r*o*p+n*c*p+s*o*u-n*l*u)+_*(+e*l*u-e*c*p+r*a*p-s*a*u+s*c*h-r*l*h)+g*(+e*c*f-e*o*u-r*a*f+n*a*u+r*o*h-n*c*h)+d*(-s*o*h-e*l*f+e*o*p+s*a*f-n*a*p+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],p=t[10],u=t[11],m=t[12],_=t[13],g=t[14],d=t[15],x=f*g*c-_*p*c+_*l*u-o*g*u-f*l*d+o*p*d,y=m*p*c-h*g*c-m*l*u+a*g*u+h*l*d-a*p*d,v=h*_*c-m*f*c+m*o*u-a*_*u-h*o*d+a*f*d,A=m*f*l-h*_*l-m*o*p+a*_*p+h*o*g-a*f*g,b=e*x+n*y+s*v+r*A;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return t[0]=x*w,t[1]=(_*p*r-f*g*r-_*s*u+n*g*u+f*s*d-n*p*d)*w,t[2]=(o*g*r-_*l*r+_*s*c-n*g*c-o*s*d+n*l*d)*w,t[3]=(f*l*r-o*p*r-f*s*c+n*p*c+o*s*u-n*l*u)*w,t[4]=y*w,t[5]=(h*g*r-m*p*r+m*s*u-e*g*u-h*s*d+e*p*d)*w,t[6]=(m*l*r-a*g*r-m*s*c+e*g*c+a*s*d-e*l*d)*w,t[7]=(a*p*r-h*l*r+h*s*c-e*p*c-a*s*u+e*l*u)*w,t[8]=v*w,t[9]=(m*f*r-h*_*r-m*n*u+e*_*u+h*n*d-e*f*d)*w,t[10]=(a*_*r-m*o*r+m*n*c-e*_*c-a*n*d+e*o*d)*w,t[11]=(h*o*r-a*f*r-h*n*c+e*f*c+a*n*u-e*o*u)*w,t[12]=A*w,t[13]=(h*_*s-m*f*s+m*n*p-e*_*p-h*n*g+e*f*g)*w,t[14]=(m*o*s-a*_*s-m*n*l+e*_*l+a*n*g-e*o*g)*w,t[15]=(a*f*s-h*o*s+h*n*l-e*f*l-a*n*p+e*o*p)*w,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,p=r*c,u=r*h,m=r*f,_=a*h,g=a*f,d=o*f,x=l*c,y=l*h,v=l*f,A=n.x,b=n.y,w=n.z;return s[0]=(1-(_+d))*A,s[1]=(u+v)*A,s[2]=(m-y)*A,s[3]=0,s[4]=(u-v)*b,s[5]=(1-(p+d))*b,s[6]=(g+x)*b,s[7]=0,s[8]=(m+y)*w,s[9]=(g-x)*w,s[10]=(1-(p+_))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=is.set(s[0],s[1],s[2]).length();const a=is.set(s[4],s[5],s[6]).length(),o=is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],En.copy(this);const c=1/r,h=1/a,f=1/o;return En.elements[0]*=c,En.elements[1]*=c,En.elements[2]*=c,En.elements[4]*=h,En.elements[5]*=h,En.elements[6]*=h,En.elements[8]*=f,En.elements[9]*=f,En.elements[10]*=f,e.setFromRotationMatrix(En),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Gn,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),p=(e+t)/(e-t),u=(n+s)/(n-s);let m,_;if(l)m=r/(a-r),_=a*r/(a-r);else if(o===Gn)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Aa)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Gn,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),p=-(e+t)/(e-t),u=-(n+s)/(n-s);let m,_;if(l)m=1/(a-r),_=a/(a-r);else if(o===Gn)m=-2/(a-r),_=-(a+r)/(a-r);else if(o===Aa)m=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const is=new U,En=new ae,Bd=new U(0,0,0),kd=new U(1,1,1),pi=new U,Dr=new U,an=new U,Hc=new ae,Gc=new vn;class Sn{constructor(t=0,e=0,n=0,s=Sn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],p=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ne(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sn.DEFAULT_ORDER="XYZ";class hc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Hd=0;const Vc=new U,ss=new vn,ti=new ae,Ur=new U,ks=new U,Gd=new U,Vd=new vn,Wc=new U(1,0,0),Xc=new U(0,1,0),qc=new U(0,0,1),Yc={type:"added"},Wd={type:"removed"},rs={type:"childadded",child:null},uo={type:"childremoved",child:null};class Le extends Us{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=Vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Le.DEFAULT_UP.clone();const t=new U,e=new Sn,n=new vn,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new te}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Le.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.multiply(ss),this}rotateOnWorldAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.premultiply(ss),this}rotateX(t){return this.rotateOnAxis(Wc,t)}rotateY(t){return this.rotateOnAxis(Xc,t)}rotateZ(t){return this.rotateOnAxis(qc,t)}translateOnAxis(t,e){return Vc.copy(t).applyQuaternion(this.quaternion),this.position.add(Vc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wc,t)}translateY(t){return this.translateOnAxis(Xc,t)}translateZ(t){return this.translateOnAxis(qc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ti.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ur.copy(t):Ur.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ti.lookAt(ks,Ur,this.up):ti.lookAt(Ur,ks,this.up),this.quaternion.setFromRotationMatrix(ti),s&&(ti.extractRotation(s.matrixWorld),ss.setFromRotationMatrix(ti),this.quaternion.premultiply(ss.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yc),rs.child=t,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Wd),uo.child=t,this.dispatchEvent(uo),uo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ti.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ti.multiply(t.parent.matrixWorld)),t.applyMatrix4(ti),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yc),rs.child=t,this.dispatchEvent(rs),rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,t,Gd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,Vd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),p=a(t.skeletons),u=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),u.length>0&&(n.animations=u),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Le.DEFAULT_UP=new U(0,1,0);Le.DEFAULT_MATRIX_AUTO_UPDATE=!0;Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const wn=new U,ei=new U,fo=new U,ni=new U,as=new U,os=new U,Zc=new U,po=new U,mo=new U,go=new U,_o=new me,xo=new me,vo=new me;class _n{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),wn.subVectors(t,e),s.cross(wn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){wn.subVectors(s,e),ei.subVectors(n,e),fo.subVectors(t,e);const a=wn.dot(wn),o=wn.dot(ei),l=wn.dot(fo),c=ei.dot(ei),h=ei.dot(fo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const p=1/f,u=(c*l-o*h)*p,m=(a*h-o*l)*p;return r.set(1-u-m,m,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ni.x),l.addScaledVector(a,ni.y),l.addScaledVector(o,ni.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return _o.setScalar(0),xo.setScalar(0),vo.setScalar(0),_o.fromBufferAttribute(t,e),xo.fromBufferAttribute(t,n),vo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(_o,r.x),a.addScaledVector(xo,r.y),a.addScaledVector(vo,r.z),a}static isFrontFacing(t,e,n,s){return wn.subVectors(n,e),ei.subVectors(t,e),wn.cross(ei).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),ei.subVectors(this.a,this.b),wn.cross(ei).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return _n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return _n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return _n.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return _n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return _n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;as.subVectors(s,n),os.subVectors(r,n),po.subVectors(t,n);const l=as.dot(po),c=os.dot(po);if(l<=0&&c<=0)return e.copy(n);mo.subVectors(t,s);const h=as.dot(mo),f=os.dot(mo);if(h>=0&&f<=h)return e.copy(s);const p=l*f-h*c;if(p<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(as,a);go.subVectors(t,r);const u=as.dot(go),m=os.dot(go);if(m>=0&&u<=m)return e.copy(r);const _=u*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(os,o);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return Zc.subVectors(r,s),o=(f-h)/(f-h+(u-m)),e.copy(s).addScaledVector(Zc,o);const d=1/(g+_+p);return a=_*d,o=p*d,e.copy(n).addScaledVector(as,a).addScaledVector(os,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Nu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mi={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function yo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=oc(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=yo(a,r,t+1/3),this.g=yo(a,r,t),this.b=yo(a,r,t-1/3)}return le.colorSpaceToWorking(this,s),this}setStyle(t,e=Be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=Nu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=li(t.r),this.g=li(t.g),this.b=li(t.b),this}copyLinearToSRGB(t){return this.r=bs(t.r),this.g=bs(t.g),this.b=bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return le.workingToColorSpace(Ve.copy(this),t),Math.round(ne(Ve.r*255,0,255))*65536+Math.round(ne(Ve.g*255,0,255))*256+Math.round(ne(Ve.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.workingToColorSpace(Ve.copy(this),e);const n=Ve.r,s=Ve.g,r=Ve.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.workingToColorSpace(Ve.copy(this),e),t.r=Ve.r,t.g=Ve.g,t.b=Ve.b,t}getStyle(t=Be){le.workingToColorSpace(Ve.copy(this),t);const e=Ve.r,n=Ve.g,s=Ve.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(mi),this.setHSL(mi.h+t,mi.s+e,mi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(mi),t.getHSL(Nr);const n=sr(mi.h,Nr.h,e),s=sr(mi.s,Nr.s,e),r=sr(mi.l,Nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ve=new kt;kt.NAMES=Nu;let Xd=0;class ci extends Us{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xd++}),this.uuid=Vn(),this.name="",this.type="Material",this.blending=Ss,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wo,this.blendDst=Xo,this.blendEquation=ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ji,this.stencilZFail=ji,this.stencilZPass=ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ss&&(n.blending=this.blending),this.side!==bi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Xo&&(n.blendDst=this.blendDst),this.blendEquation!==ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ke extends ci{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=Ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ce=new U,Fr=new rt;let qd=0;class Ue{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Pl,this.updateRanges=[],this.gpuType=In,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fr.fromBufferAttribute(this,e),Fr.applyMatrix3(t),this.setXY(e,Fr.x,Fr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=fe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Pn(e,this.array)),e}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Pn(e,this.array)),e}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Pn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Pn(e,this.array)),e}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),s=fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),s=fe(s,this.array),r=fe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Pl&&(t.usage=this.usage),t}}class Fu extends Ue{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ou extends Ue{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends Ue{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Yd=0;const pn=new ae,Mo=new Le,ls=new U,on=new Dn,Hs=new Dn,Oe=new U;class we extends Us{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=Vn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Du(t)?Ou:Fu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new te().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return Mo.lookAt(t),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ls).negate(),this.translate(ls.x,ls.y,ls.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ie(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ji);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Hs.setFromBufferAttribute(o),this.morphTargetsRelative?(Oe.addVectors(on.min,Hs.min),on.expandByPoint(Oe),Oe.addVectors(on.max,Hs.max),on.expandByPoint(Oe)):(on.expandByPoint(Hs.min),on.expandByPoint(Hs.max))}on.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Oe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Oe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Oe.fromBufferAttribute(o,c),l&&(ls.fromBufferAttribute(t,c),Oe.add(ls)),s=Math.max(s,n.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ue(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let E=0;E<n.count;E++)o[E]=new U,l[E]=new U;const c=new U,h=new U,f=new U,p=new rt,u=new rt,m=new rt,_=new U,g=new U;function d(E,M,S){c.fromBufferAttribute(n,E),h.fromBufferAttribute(n,M),f.fromBufferAttribute(n,S),p.fromBufferAttribute(r,E),u.fromBufferAttribute(r,M),m.fromBufferAttribute(r,S),h.sub(c),f.sub(c),u.sub(p),m.sub(p);const C=1/(u.x*m.y-m.x*u.y);isFinite(C)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(C),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(C),o[E].add(_),o[M].add(_),o[S].add(_),l[E].add(g),l[M].add(g),l[S].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let E=0,M=x.length;E<M;++E){const S=x[E],C=S.start,D=S.count;for(let I=C,F=C+D;I<F;I+=3)d(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const y=new U,v=new U,A=new U,b=new U;function w(E){A.fromBufferAttribute(s,E),b.copy(A);const M=o[E];y.copy(M),y.sub(A.multiplyScalar(A.dot(M))).normalize(),v.crossVectors(b,M);const C=v.dot(l[E])<0?-1:1;a.setXYZW(E,y.x,y.y,y.z,C)}for(let E=0,M=x.length;E<M;++E){const S=x[E],C=S.start,D=S.count;for(let I=C,F=C+D;I<F;I+=3)w(t.getX(I+0)),w(t.getX(I+1)),w(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ue(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,u=n.count;p<u;p++)n.setXYZ(p,0,0,0);const s=new U,r=new U,a=new U,o=new U,l=new U,c=new U,h=new U,f=new U;if(t)for(let p=0,u=t.count;p<u;p+=3){const m=t.getX(p+0),_=t.getX(p+1),g=t.getX(p+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,g),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let p=0,u=e.count;p<u;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),a.fromBufferAttribute(e,p+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,p=new c.constructor(l.length*h);let u=0,m=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?u=l[_]*o.data.stride+o.offset:u=l[_]*h;for(let d=0;d<h;d++)p[m++]=c[u++]}return new Ue(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new we,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const p=c[h],u=t(p,n);l.push(u)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,p=c.length;f<p;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let p=0,u=f.length;p<u;p++)h.push(f[p].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const $c=new ae,Li=new cc,Or=new Ji,Jc=new U,zr=new U,Br=new U,kr=new U,So=new U,Hr=new U,Kc=new U,Gr=new U;class ye extends Le{constructor(t=new we,e=new Ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Hr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(So.fromBufferAttribute(f,t),a?Hr.addScaledVector(So,h):Hr.addScaledVector(So.sub(e),h))}e.add(Hr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(r),Li.copy(t.ray).recast(t.near),!(Or.containsPoint(Li.origin)===!1&&(Li.intersectSphere(Or,Jc)===null||Li.origin.distanceToSquared(Jc)>(t.far-t.near)**2))&&($c.copy(r).invert(),Li.copy(t.ray).applyMatrix4($c),!(n.boundingBox!==null&&Li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Li)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,p=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=p.length;m<_;m++){const g=p[m],d=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,A=y;v<A;v+=3){const b=o.getX(v),w=o.getX(v+1),E=o.getX(v+2);s=Vr(this,d,t,n,c,h,f,b,w,E),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let g=m,d=_;g<d;g+=3){const x=o.getX(g),y=o.getX(g+1),v=o.getX(g+2);s=Vr(this,a,t,n,c,h,f,x,y,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=p.length;m<_;m++){const g=p[m],d=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,A=y;v<A;v+=3){const b=v,w=v+1,E=v+2;s=Vr(this,d,t,n,c,h,f,b,w,E),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let g=m,d=_;g<d;g+=3){const x=g,y=g+1,v=g+2;s=Vr(this,a,t,n,c,h,f,x,y,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Zd(i,t,e,n,s,r,a,o){let l;if(t.side===qe?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===bi,o),l===null)return null;Gr.copy(o),Gr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Gr);return c<e.near||c>e.far?null:{distance:c,point:Gr.clone(),object:i}}function Vr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,zr),i.getVertexPosition(l,Br),i.getVertexPosition(c,kr);const h=Zd(i,t,e,n,zr,Br,kr,Kc);if(h){const f=new U;_n.getBarycoord(Kc,zr,Br,kr,f),s&&(h.uv=_n.getInterpolatedAttribute(s,o,l,c,f,new rt)),r&&(h.uv1=_n.getInterpolatedAttribute(r,o,l,c,f,new rt)),a&&(h.normal=_n.getInterpolatedAttribute(a,o,l,c,f,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:l,c,normal:new U,materialIndex:0};_n.getNormal(zr,Br,kr,p.normal),h.face=p,h.barycoord=f}return h}class Zn extends we{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let p=0,u=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(f,2));function m(_,g,d,x,y,v,A,b,w,E,M){const S=v/w,C=A/E,D=v/2,I=A/2,F=b/2,O=w+1,k=E+1;let X=0,H=0;const K=new U;for(let nt=0;nt<k;nt++){const lt=nt*C-I;for(let Ct=0;Ct<O;Ct++){const Ft=Ct*S-D;K[_]=Ft*x,K[g]=lt*y,K[d]=F,c.push(K.x,K.y,K.z),K[_]=0,K[g]=0,K[d]=b>0?1:-1,h.push(K.x,K.y,K.z),f.push(Ct/w),f.push(1-nt/E),X+=1}}for(let nt=0;nt<E;nt++)for(let lt=0;lt<w;lt++){const Ct=p+lt+O*nt,Ft=p+lt+O*(nt+1),Kt=p+(lt+1)+O*(nt+1),$t=p+(lt+1)+O*nt;l.push(Ct,Ft,$t),l.push(Ft,Kt,$t),H+=6}o.addGroup(u,H,M),u+=H,p+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ps(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function $e(i){const t={};for(let e=0;e<i.length;e++){const n=Ps(i[e]);for(const s in n)t[s]=n[s]}return t}function $d(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function zu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:le.workingColorSpace}const Gi={clone:Ps,merge:$e};var Jd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class je extends ci{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jd,this.fragmentShader=Kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=$d(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Bu extends Le{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gi=new U,jc=new rt,Qc=new rt;class Xe extends Bu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ur*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ur*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(gi.x,gi.y).multiplyScalar(-t/gi.z),gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gi.x,gi.y).multiplyScalar(-t/gi.z)}getViewSize(t,e){return this.getViewBounds(t,jc,Qc),e.subVectors(Qc,jc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ir*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const cs=-90,hs=1;class jd extends Le{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Xe(cs,hs,t,e);s.layers=this.layers,this.add(s);const r=new Xe(cs,hs,t,e);r.layers=this.layers,this.add(r);const a=new Xe(cs,hs,t,e);a.layers=this.layers,this.add(a);const o=new Xe(cs,hs,t,e);o.layers=this.layers,this.add(o);const l=new Xe(cs,hs,t,e);l.layers=this.layers,this.add(l);const c=new Xe(cs,hs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Gn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Aa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,p,u),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class ku extends ke{constructor(t=[],e=Es,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Qd extends un{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ku(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Zn(5,5,5),r=new je({name:"CubemapFromEquirect",uniforms:Ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:Je});r.uniforms.tEquirect.value=e;const a=new ye(s,r),o=e.minFilter;return e.minFilter===Hi&&(e.minFilter=Hn),new jd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class pe extends Le{constructor(){super(),this.isGroup=!0,this.type="Group"}}const tp={type:"move"};class bo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,n),d=this._getHandJoint(c,_);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&p>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&p<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(tp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new pe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class uc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new kt(t),this.density=e}clone(){return new uc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Il extends Le{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ep{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Pl,this.updateRanges=[],this.version=0,this.uuid=Vn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ze=new U;class Ra{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyMatrix4(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyNormalMatrix(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.transformDirection(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=fe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Pn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Pn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Pn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Pn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),s=fe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),s=fe(s,this.array),r=fe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ue(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ra(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ll extends ci{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new kt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let us;const Gs=new U,fs=new U,ds=new U,ps=new rt,Vs=new rt,Hu=new ae,Wr=new U,Ws=new U,Xr=new U,th=new rt,To=new rt,eh=new rt;class nh extends Le{constructor(t=new Ll){if(super(),this.isSprite=!0,this.type="Sprite",us===void 0){us=new we;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ep(e,5);us.setIndex([0,1,2,0,2,3]),us.setAttribute("position",new Ra(n,3,0,!1)),us.setAttribute("uv",new Ra(n,2,3,!1))}this.geometry=us,this.material=t,this.center=new rt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fs.setFromMatrixScale(this.matrixWorld),Hu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ds.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fs.multiplyScalar(-ds.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;qr(Wr.set(-.5,-.5,0),ds,a,fs,s,r),qr(Ws.set(.5,-.5,0),ds,a,fs,s,r),qr(Xr.set(.5,.5,0),ds,a,fs,s,r),th.set(0,0),To.set(1,0),eh.set(1,1);let o=t.ray.intersectTriangle(Wr,Ws,Xr,!1,Gs);if(o===null&&(qr(Ws.set(-.5,.5,0),ds,a,fs,s,r),To.set(0,1),o=t.ray.intersectTriangle(Wr,Xr,Ws,!1,Gs),o===null))return;const l=t.ray.origin.distanceTo(Gs);l<t.near||l>t.far||e.push({distance:l,point:Gs.clone(),uv:_n.getInterpolation(Gs,Wr,Ws,Xr,th,To,eh,new rt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function qr(i,t,e,n,s,r){ps.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Vs.x=r*ps.x-s*ps.y,Vs.y=s*ps.x+r*ps.y):Vs.copy(ps),i.copy(t),i.x+=Vs.x,i.y+=Vs.y,i.applyMatrix4(Hu)}class Gu extends ke{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Qe,h=Qe,f,p){super(null,a,o,l,c,h,s,r,f,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ih extends Ue{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ms=new ae,sh=new ae,Yr=[],rh=new Dn,np=new ae,Xs=new ye,qs=new Ji;class ip extends ye{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ih(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,np)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Dn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ms),rh.copy(t.boundingBox).applyMatrix4(ms),this.boundingBox.union(rh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ji),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ms),qs.copy(t.boundingSphere).applyMatrix4(ms),this.boundingSphere.union(qs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Xs.geometry=this.geometry,Xs.material=this.material,Xs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qs.copy(this.boundingSphere),qs.applyMatrix4(n),t.ray.intersectsSphere(qs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ms),sh.multiplyMatrices(n,ms),Xs.matrixWorld=sh,Xs.raycast(t,Yr);for(let a=0,o=Yr.length;a<o;a++){const l=Yr[a];l.instanceId=r,l.object=this,e.push(l)}Yr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ih(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Gu(new Float32Array(s*this.count),s,this.count,ka,In));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Eo=new U,sp=new U,rp=new te;class Fi{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Eo.subVectors(n,e).cross(sp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Eo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||rp.getNormalMatrix(t),s=this.coplanarPoint(Eo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Di=new Ji,ap=new rt(.5,.5),Zr=new U;class fc{constructor(t=new Fi,e=new Fi,n=new Fi,s=new Fi,r=new Fi,a=new Fi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Gn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],p=r[6],u=r[7],m=r[8],_=r[9],g=r[10],d=r[11],x=r[12],y=r[13],v=r[14],A=r[15];if(s[0].setComponents(c-a,u-h,d-m,A-x).normalize(),s[1].setComponents(c+a,u+h,d+m,A+x).normalize(),s[2].setComponents(c+o,u+f,d+_,A+y).normalize(),s[3].setComponents(c-o,u-f,d-_,A-y).normalize(),n)s[4].setComponents(l,p,g,v).normalize(),s[5].setComponents(c-l,u-p,d-g,A-v).normalize();else if(s[4].setComponents(c-l,u-p,d-g,A-v).normalize(),e===Gn)s[5].setComponents(c+l,u+p,d+g,A+v).normalize();else if(e===Aa)s[5].setComponents(l,p,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(t){Di.center.set(0,0,0);const e=ap.distanceTo(t.center);return Di.radius=.7071067811865476+e,Di.applyMatrix4(t.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Zr.x=s.normal.x>0?t.max.x:t.min.x,Zr.y=s.normal.y>0?t.max.y:t.min.y,Zr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Zr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Vu extends ci{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const ah=new ae,Dl=new cc,$r=new Ji,Jr=new U;class op extends Le{constructor(t=new we,e=new Vu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$r.copy(n.boundingSphere),$r.applyMatrix4(s),$r.radius+=r,t.ray.intersectsSphere($r)===!1)return;ah.copy(s).invert(),Dl.copy(t.ray).applyMatrix4(ah);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const p=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let m=p,_=u;m<_;m++){const g=c.getX(m);Jr.fromBufferAttribute(f,g),oh(Jr,g,l,s,t,e,this)}}else{const p=Math.max(0,a.start),u=Math.min(f.count,a.start+a.count);for(let m=p,_=u;m<_;m++)Jr.fromBufferAttribute(f,m),oh(Jr,m,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function oh(i,t,e,n,s,r,a){const o=Dl.distanceSqToPoint(i);if(o<e){const l=new U;Dl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class lp extends ke{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class dc extends ke{constructor(t,e,n=Wi,s,r,a,o=Qe,l=Qe,c,h=hr,f=1){if(h!==hr&&h!==Rs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:t,height:e,depth:f};super(p,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new lc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Wu extends ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ei extends we{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new U,h=new rt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,p=3;f<=e;f++,p+=3){const u=n+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[p]/t+1)/2,h.y=(a[p+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(o,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ei(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class bn extends we{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],p=[],u=[];let m=0;const _=[],g=n/2;let d=0;x(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new ie(f,3)),this.setAttribute("normal",new ie(p,3)),this.setAttribute("uv",new ie(u,2));function x(){const v=new U,A=new U;let b=0;const w=(e-t)/n;for(let E=0;E<=r;E++){const M=[],S=E/r,C=S*(e-t)+t;for(let D=0;D<=s;D++){const I=D/s,F=I*l+o,O=Math.sin(F),k=Math.cos(F);A.x=C*O,A.y=-S*n+g,A.z=C*k,f.push(A.x,A.y,A.z),v.set(O,w,k).normalize(),p.push(v.x,v.y,v.z),u.push(I,1-S),M.push(m++)}_.push(M)}for(let E=0;E<s;E++)for(let M=0;M<r;M++){const S=_[M][E],C=_[M+1][E],D=_[M+1][E+1],I=_[M][E+1];(t>0||M!==0)&&(h.push(S,C,I),b+=3),(e>0||M!==r-1)&&(h.push(C,D,I),b+=3)}c.addGroup(d,b,0),d+=b}function y(v){const A=m,b=new rt,w=new U;let E=0;const M=v===!0?t:e,S=v===!0?1:-1;for(let D=1;D<=s;D++)f.push(0,g*S,0),p.push(0,S,0),u.push(.5,.5),m++;const C=m;for(let D=0;D<=s;D++){const F=D/s*l+o,O=Math.cos(F),k=Math.sin(F);w.x=M*k,w.y=g*S,w.z=M*O,f.push(w.x,w.y,w.z),p.push(0,S,0),b.x=O*.5+.5,b.y=k*.5*S+.5,u.push(b.x,b.y),m++}for(let D=0;D<s;D++){const I=A+D,F=C+D;v===!0?h.push(F,F+1,I):h.push(F+1,F,I),E+=3}c.addGroup(d,E,v===!0?1:2),d+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class pc extends we{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new ie(r,3)),this.setAttribute("normal",new ie(r.slice(),3)),this.setAttribute("uv",new ie(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new U,v=new U,A=new U;for(let b=0;b<e.length;b+=3)u(e[b+0],y),u(e[b+1],v),u(e[b+2],A),l(y,v,A,x)}function l(x,y,v,A){const b=A+1,w=[];for(let E=0;E<=b;E++){w[E]=[];const M=x.clone().lerp(v,E/b),S=y.clone().lerp(v,E/b),C=b-E;for(let D=0;D<=C;D++)D===0&&E===b?w[E][D]=M:w[E][D]=M.clone().lerp(S,D/C)}for(let E=0;E<b;E++)for(let M=0;M<2*(b-E)-1;M++){const S=Math.floor(M/2);M%2===0?(p(w[E][S+1]),p(w[E+1][S]),p(w[E][S])):(p(w[E][S+1]),p(w[E+1][S+1]),p(w[E+1][S]))}}function c(x){const y=new U;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(x),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){const x=new U;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const v=g(x)/2/Math.PI+.5,A=d(x)/Math.PI+.5;a.push(v,1-A)}m(),f()}function f(){for(let x=0;x<a.length;x+=6){const y=a[x+0],v=a[x+2],A=a[x+4],b=Math.max(y,v,A),w=Math.min(y,v,A);b>.9&&w<.1&&(y<.2&&(a[x+0]+=1),v<.2&&(a[x+2]+=1),A<.2&&(a[x+4]+=1))}}function p(x){r.push(x.x,x.y,x.z)}function u(x,y){const v=x*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function m(){const x=new U,y=new U,v=new U,A=new U,b=new rt,w=new rt,E=new rt;for(let M=0,S=0;M<r.length;M+=9,S+=6){x.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),v.set(r[M+6],r[M+7],r[M+8]),b.set(a[S+0],a[S+1]),w.set(a[S+2],a[S+3]),E.set(a[S+4],a[S+5]),A.copy(x).add(y).add(v).divideScalar(3);const C=g(A);_(b,S+0,x,C),_(w,S+2,y,C),_(E,S+4,v,C)}}function _(x,y,v,A){A<0&&x.x===1&&(a[y]=x.x-1),v.x===0&&v.z===0&&(a[y]=A/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pc(t.vertices,t.indices,t.radius,t.details)}}class $n{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],p=n[s+1]-h,u=(a-h)/p;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new rt:new U);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,s=[],r=[],a=[],o=new U,l=new ae;for(let u=0;u<=t;u++){const m=u/t;s[u]=this.getTangentAt(m,new U)}r[0]=new U,a[0]=new U;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),p<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(ne(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(l.makeRotationAxis(o,m))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(ne(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],u*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class pr extends $n{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new rt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=l-this.aX,u=c-this.aY;l=p*h-u*f+this.aX,c=p*f+u*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class cp extends pr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function mc(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let p=(a-r)/c-(o-r)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+f)+(l-o)/f;p*=h,u*=h,s(a,o,p,u)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Kr=new U,wo=new mc,Ao=new mc,Ro=new mc;class Xi extends $n{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Kr.subVectors(s[0],s[1]).add(s[0]),c=Kr);const f=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Kr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Kr),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),_=Math.pow(f.distanceToSquared(p),u),g=Math.pow(p.distanceToSquared(h),u);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),wo.initNonuniformCatmullRom(c.x,f.x,p.x,h.x,m,_,g),Ao.initNonuniformCatmullRom(c.y,f.y,p.y,h.y,m,_,g),Ro.initNonuniformCatmullRom(c.z,f.z,p.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(wo.initCatmullRom(c.x,f.x,p.x,h.x,this.tension),Ao.initCatmullRom(c.y,f.y,p.y,h.y,this.tension),Ro.initCatmullRom(c.z,f.z,p.z,h.z,this.tension));return n.set(wo.calc(l),Ao.calc(l),Ro.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function lh(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function hp(i,t){const e=1-i;return e*e*t}function up(i,t){return 2*(1-i)*i*t}function fp(i,t){return i*i*t}function rr(i,t,e,n){return hp(i,t)+up(i,e)+fp(i,n)}function dp(i,t){const e=1-i;return e*e*e*t}function pp(i,t){const e=1-i;return 3*e*e*i*t}function mp(i,t){return 3*(1-i)*i*i*t}function gp(i,t){return i*i*i*t}function ar(i,t,e,n,s){return dp(i,t)+pp(i,e)+mp(i,n)+gp(i,s)}class Xu extends $n{constructor(t=new rt,e=new rt,n=new rt,s=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new rt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ar(t,s.x,r.x,a.x,o.x),ar(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class _p extends $n{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ar(t,s.x,r.x,a.x,o.x),ar(t,s.y,r.y,a.y,o.y),ar(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qu extends $n{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ul extends $n{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yu extends $n{constructor(t=new rt,e=new rt,n=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new rt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(rr(t,s.x,r.x,a.x),rr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zu extends $n{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(rr(t,s.x,r.x,a.x),rr(t,s.y,r.y,a.y),rr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $u extends $n{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(lh(o,l.x,c.x,h.x,f.x),lh(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new rt().fromArray(s))}return this}}var Ca=Object.freeze({__proto__:null,ArcCurve:cp,CatmullRomCurve3:Xi,CubicBezierCurve:Xu,CubicBezierCurve3:_p,EllipseCurve:pr,LineCurve:qu,LineCurve3:Ul,QuadraticBezierCurve:Yu,QuadraticBezierCurve3:Zu,SplineCurve:$u});class xp extends $n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ca[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ca[s.type]().fromJSON(s))}return this}}class Pa extends xp{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new qu(this.currentPoint.clone(),new rt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Yu(this.currentPoint.clone(),new rt(t,e),new rt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Xu(this.currentPoint.clone(),new rt(t,e),new rt(n,s),new rt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new $u(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new pr(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class hi extends Pa{constructor(t){super(t),this.uuid=Vn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Pa().fromJSON(s))}return this}}function vp(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Ju(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Tp(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,f=-1/0;for(let p=e;p<s;p+=e){const u=i[p],m=i[p+1];u<o&&(o=u),m<l&&(l=m),u>h&&(h=u),m>f&&(f=m)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return mr(r,a,e,o,l,c,0),a}function Ju(i,t,e,n,s){let r;if(s===Np(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=ch(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=ch(a/n|0,i[a],i[a+1],r);return r&&Is(r,r.next)&&(_r(r),r=r.next),r}function qi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Is(e,e.next)||Ee(e.prev,e,e.next)===0)){if(_r(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function mr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Cp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Mp(i,n,s,r):yp(i)){t.push(l.i,i.i,c.i),_r(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Sp(qi(i),t),mr(i,t,e,n,s,r,2)):a===2&&bp(i,t,e,n,s,r):mr(qi(i),t,e,n,s,r,1);break}}}function yp(i){const t=i.prev,e=i,n=i.next;if(Ee(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),p=Math.max(s,r,a),u=Math.max(o,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=p&&m.y>=f&&m.y<=u&&Js(s,o,r,l,a,c,m.x,m.y)&&Ee(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Mp(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Ee(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,p=a.y,u=Math.min(o,l,c),m=Math.min(h,f,p),_=Math.max(o,l,c),g=Math.max(h,f,p),d=Nl(u,m,t,e,n),x=Nl(_,g,t,e,n);let y=i.prevZ,v=i.nextZ;for(;y&&y.z>=d&&v&&v.z<=x;){if(y.x>=u&&y.x<=_&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&Js(o,h,l,f,c,p,y.x,y.y)&&Ee(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=u&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Js(o,h,l,f,c,p,v.x,v.y)&&Ee(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=d;){if(y.x>=u&&y.x<=_&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&Js(o,h,l,f,c,p,y.x,y.y)&&Ee(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=x;){if(v.x>=u&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Js(o,h,l,f,c,p,v.x,v.y)&&Ee(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Sp(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Is(n,s)&&ju(n,e,e.next,s)&&gr(n,s)&&gr(s,n)&&(t.push(n.i,e.i,s.i),_r(e),_r(e.next),e=i=s),e=e.next}while(e!==i);return qi(e)}function bp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Lp(a,o)){let l=Qu(a,o);a=qi(a,a.next),l=qi(l,l.next),mr(a,t,e,n,s,r,0),mr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Tp(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Ju(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Ip(c))}s.sort(Ep);for(let r=0;r<s.length;r++)e=wp(s[r],e);return e}function Ep(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function wp(i,t){const e=Ap(i,t);if(!e)return t;const n=Qu(e,i);return qi(n,n.next),qi(e,e.next)}function Ap(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(Is(i,e))return e;do{if(Is(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Ku(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);gr(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&Rp(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function Rp(i,t){return Ee(i.prev,i,t.prev)<0&&Ee(t.next,i,i.next)<0}function Cp(i,t,e,n){let s=i;do s.z===0&&(s.z=Nl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Pp(s)}function Pp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Nl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Ip(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ku(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Js(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Ku(i,t,e,n,s,r,a,o)}function Lp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Dp(i,t)&&(gr(i,t)&&gr(t,i)&&Up(i,t)&&(Ee(i.prev,i,t.prev)||Ee(i,t.prev,t))||Is(i,t)&&Ee(i.prev,i,i.next)>0&&Ee(t.prev,t,t.next)>0)}function Ee(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Is(i,t){return i.x===t.x&&i.y===t.y}function ju(i,t,e,n){const s=Qr(Ee(i,t,e)),r=Qr(Ee(i,t,n)),a=Qr(Ee(e,n,i)),o=Qr(Ee(e,n,t));return!!(s!==r&&a!==o||s===0&&jr(i,e,t)||r===0&&jr(i,n,t)||a===0&&jr(e,i,n)||o===0&&jr(e,t,n))}function jr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Qr(i){return i>0?1:i<0?-1:0}function Dp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ju(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function gr(i,t){return Ee(i.prev,i,i.next)<0?Ee(i,t,i.next)>=0&&Ee(i,i.prev,t)>=0:Ee(i,t,i.prev)<0||Ee(i,i.next,t)<0}function Up(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Qu(i,t){const e=Fl(i.i,i.x,i.y),n=Fl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ch(i,t,e,n){const s=Fl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function _r(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Fl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Np(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Fp{static triangulate(t,e,n=2){return vp(t,e,n)}}class oi{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return oi.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];hh(t),uh(n,t);let a=t.length;e.forEach(hh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,uh(n,e[l]);const o=Fp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function hh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function uh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ga extends we{constructor(t=new hi([new rt(.5,.5),new rt(-.5,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new ie(s,3)),this.setAttribute("uv",new ie(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let p=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:u-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const d=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:Op;let y,v=!1,A,b,w,E;d&&(y=d.getSpacedPoints(h),v=!0,p=!1,A=d.computeFrenetFrames(h,!1),b=new U,w=new U,E=new U),p||(g=0,u=0,m=0,_=0);const M=o.extractPoints(c);let S=M.shape;const C=M.holes;if(!oi.isClockWise(S)){S=S.reverse();for(let ot=0,it=C.length;ot<it;ot++){const tt=C[ot];oi.isClockWise(tt)&&(C[ot]=tt.reverse())}}function I(ot){const tt=10000000000000001e-36;let Q=ot[0];for(let _t=1;_t<=ot.length;_t++){const ct=_t%ot.length,xt=ot[ct],qt=xt.x-Q.x,Wt=xt.y-Q.y,P=qt*qt+Wt*Wt,T=Math.max(Math.abs(xt.x),Math.abs(xt.y),Math.abs(Q.x),Math.abs(Q.y)),W=tt*T*T;if(P<=W){ot.splice(ct,1),_t--;continue}Q=xt}}I(S),C.forEach(I);const F=C.length,O=S;for(let ot=0;ot<F;ot++){const it=C[ot];S=S.concat(it)}function k(ot,it,tt){return it||console.error("THREE.ExtrudeGeometry: vec does not exist"),ot.clone().addScaledVector(it,tt)}const X=S.length;function H(ot,it,tt){let Q,_t,ct;const xt=ot.x-it.x,qt=ot.y-it.y,Wt=tt.x-ot.x,P=tt.y-ot.y,T=xt*xt+qt*qt,W=xt*P-qt*Wt;if(Math.abs(W)>Number.EPSILON){const Z=Math.sqrt(T),at=Math.sqrt(Wt*Wt+P*P),$=it.x-qt/Z,It=it.y+xt/Z,pt=tt.x-P/at,Pt=tt.y+Wt/at,Nt=((pt-$)*P-(Pt-It)*Wt)/(xt*P-qt*Wt);Q=$+xt*Nt-ot.x,_t=It+qt*Nt-ot.y;const ft=Q*Q+_t*_t;if(ft<=2)return new rt(Q,_t);ct=Math.sqrt(ft/2)}else{let Z=!1;xt>Number.EPSILON?Wt>Number.EPSILON&&(Z=!0):xt<-Number.EPSILON?Wt<-Number.EPSILON&&(Z=!0):Math.sign(qt)===Math.sign(P)&&(Z=!0),Z?(Q=-qt,_t=xt,ct=Math.sqrt(T)):(Q=xt,_t=qt,ct=Math.sqrt(T/2))}return new rt(Q/ct,_t/ct)}const K=[];for(let ot=0,it=O.length,tt=it-1,Q=ot+1;ot<it;ot++,tt++,Q++)tt===it&&(tt=0),Q===it&&(Q=0),K[ot]=H(O[ot],O[tt],O[Q]);const nt=[];let lt,Ct=K.concat();for(let ot=0,it=F;ot<it;ot++){const tt=C[ot];lt=[];for(let Q=0,_t=tt.length,ct=_t-1,xt=Q+1;Q<_t;Q++,ct++,xt++)ct===_t&&(ct=0),xt===_t&&(xt=0),lt[Q]=H(tt[Q],tt[ct],tt[xt]);nt.push(lt),Ct=Ct.concat(lt)}let Ft;if(g===0)Ft=oi.triangulateShape(O,C);else{const ot=[],it=[];for(let tt=0;tt<g;tt++){const Q=tt/g,_t=u*Math.cos(Q*Math.PI/2),ct=m*Math.sin(Q*Math.PI/2)+_;for(let xt=0,qt=O.length;xt<qt;xt++){const Wt=k(O[xt],K[xt],ct);At(Wt.x,Wt.y,-_t),Q===0&&ot.push(Wt)}for(let xt=0,qt=F;xt<qt;xt++){const Wt=C[xt];lt=nt[xt];const P=[];for(let T=0,W=Wt.length;T<W;T++){const Z=k(Wt[T],lt[T],ct);At(Z.x,Z.y,-_t),Q===0&&P.push(Z)}Q===0&&it.push(P)}}Ft=oi.triangulateShape(ot,it)}const Kt=Ft.length,$t=m+_;for(let ot=0;ot<X;ot++){const it=p?k(S[ot],Ct[ot],$t):S[ot];v?(w.copy(A.normals[0]).multiplyScalar(it.x),b.copy(A.binormals[0]).multiplyScalar(it.y),E.copy(y[0]).add(w).add(b),At(E.x,E.y,E.z)):At(it.x,it.y,0)}for(let ot=1;ot<=h;ot++)for(let it=0;it<X;it++){const tt=p?k(S[it],Ct[it],$t):S[it];v?(w.copy(A.normals[ot]).multiplyScalar(tt.x),b.copy(A.binormals[ot]).multiplyScalar(tt.y),E.copy(y[ot]).add(w).add(b),At(E.x,E.y,E.z)):At(tt.x,tt.y,f/h*ot)}for(let ot=g-1;ot>=0;ot--){const it=ot/g,tt=u*Math.cos(it*Math.PI/2),Q=m*Math.sin(it*Math.PI/2)+_;for(let _t=0,ct=O.length;_t<ct;_t++){const xt=k(O[_t],K[_t],Q);At(xt.x,xt.y,f+tt)}for(let _t=0,ct=C.length;_t<ct;_t++){const xt=C[_t];lt=nt[_t];for(let qt=0,Wt=xt.length;qt<Wt;qt++){const P=k(xt[qt],lt[qt],Q);v?At(P.x,P.y+y[h-1].y,y[h-1].x+tt):At(P.x,P.y,f+tt)}}}J(),j();function J(){const ot=s.length/3;if(p){let it=0,tt=X*it;for(let Q=0;Q<Kt;Q++){const _t=Ft[Q];Mt(_t[2]+tt,_t[1]+tt,_t[0]+tt)}it=h+g*2,tt=X*it;for(let Q=0;Q<Kt;Q++){const _t=Ft[Q];Mt(_t[0]+tt,_t[1]+tt,_t[2]+tt)}}else{for(let it=0;it<Kt;it++){const tt=Ft[it];Mt(tt[2],tt[1],tt[0])}for(let it=0;it<Kt;it++){const tt=Ft[it];Mt(tt[0]+X*h,tt[1]+X*h,tt[2]+X*h)}}n.addGroup(ot,s.length/3-ot,0)}function j(){const ot=s.length/3;let it=0;vt(O,it),it+=O.length;for(let tt=0,Q=C.length;tt<Q;tt++){const _t=C[tt];vt(_t,it),it+=_t.length}n.addGroup(ot,s.length/3-ot,1)}function vt(ot,it){let tt=ot.length;for(;--tt>=0;){const Q=tt;let _t=tt-1;_t<0&&(_t=ot.length-1);for(let ct=0,xt=h+g*2;ct<xt;ct++){const qt=X*ct,Wt=X*(ct+1),P=it+Q+qt,T=it+_t+qt,W=it+_t+Wt,Z=it+Q+Wt;Jt(P,T,W,Z)}}}function At(ot,it,tt){l.push(ot),l.push(it),l.push(tt)}function Mt(ot,it,tt){Qt(ot),Qt(it),Qt(tt);const Q=s.length/3,_t=x.generateTopUV(n,s,Q-3,Q-2,Q-1);N(_t[0]),N(_t[1]),N(_t[2])}function Jt(ot,it,tt,Q){Qt(ot),Qt(it),Qt(Q),Qt(it),Qt(tt),Qt(Q);const _t=s.length/3,ct=x.generateSideWallUV(n,s,_t-6,_t-3,_t-2,_t-1);N(ct[0]),N(ct[1]),N(ct[3]),N(ct[1]),N(ct[2]),N(ct[3])}function Qt(ot){s.push(l[ot*3+0]),s.push(l[ot*3+1]),s.push(l[ot*3+2])}function N(ot){r.push(ot.x),r.push(ot.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return zp(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ca[s.type]().fromJSON(s)),new Ga(n,t.options)}}const Op={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new rt(r,a),new rt(o,l),new rt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],f=t[n*3+2],p=t[s*3],u=t[s*3+1],m=t[s*3+2],_=t[r*3],g=t[r*3+1],d=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new rt(a,1-l),new rt(c,1-f),new rt(p,1-m),new rt(_,1-d)]:[new rt(o,1-l),new rt(h,1-f),new rt(u,1-m),new rt(g,1-d)]}};function zp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Va extends pc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Va(t.radius,t.detail)}}class Wa extends we{constructor(t=[new rt(0,-.5),new rt(.5,0),new rt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ne(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new U,p=new rt,u=new U,m=new U,_=new U;let g=0,d=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:g=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,u.x=d*1,u.y=-g,u.z=d*0,_.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:g=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,u.x=d*1,u.y=-g,u.z=d*0,m.copy(u),u.x+=_.x,u.y+=_.y,u.z+=_.z,u.normalize(),l.push(u.x,u.y,u.z),_.copy(m)}for(let x=0;x<=e;x++){const y=n+x*h*s,v=Math.sin(y),A=Math.cos(y);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*v,f.y=t[b].y,f.z=t[b].x*A,a.push(f.x,f.y,f.z),p.x=x/e,p.y=b/(t.length-1),o.push(p.x,p.y);const w=l[3*b+0]*v,E=l[3*b+1],M=l[3*b+0]*A;c.push(w,E,M)}}for(let x=0;x<e;x++)for(let y=0;y<t.length-1;y++){const v=y+x*t.length,A=v,b=v+t.length,w=v+t.length+1,E=v+1;r.push(A,b,E),r.push(w,E,b)}this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("uv",new ie(o,2)),this.setAttribute("normal",new ie(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wa(t.points,t.segments,t.phiStart,t.phiLength)}}class re extends we{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,p=e/l,u=[],m=[],_=[],g=[];for(let d=0;d<h;d++){const x=d*p-a;for(let y=0;y<c;y++){const v=y*f-r;m.push(v,-x,0),_.push(0,0,1),g.push(y/o),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const y=x+c*d,v=x+c*(d+1),A=x+1+c*(d+1),b=x+1+c*d;u.push(y,v,b),u.push(v,A,b)}this.setIndex(u),this.setAttribute("position",new ie(m,3)),this.setAttribute("normal",new ie(_,3)),this.setAttribute("uv",new ie(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new re(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xa extends we{constructor(t=new hi([new rt(0,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ie(s,3)),this.setAttribute("normal",new ie(r,3)),this.setAttribute("uv",new ie(a,2));function c(h){const f=s.length/3,p=h.extractPoints(e);let u=p.shape;const m=p.holes;oi.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,d=m.length;g<d;g++){const x=m[g];oi.isClockWise(x)===!0&&(m[g]=x.reverse())}const _=oi.triangulateShape(u,m);for(let g=0,d=m.length;g<d;g++){const x=m[g];u=u.concat(x)}for(let g=0,d=u.length;g<d;g++){const x=u[g];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let g=0,d=_.length;g<d;g++){const x=_[g],y=x[0]+f,v=x[1]+f,A=x[2]+f;n.push(y,v,A),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Bp(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new Xa(n,t.curveSegments)}}function Bp(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Sr extends we{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new U,p=new U,u=[],m=[],_=[],g=[];for(let d=0;d<=n;d++){const x=[],y=d/n;let v=0;d===0&&a===0?v=.5/e:d===n&&l===Math.PI&&(v=-.5/e);for(let A=0;A<=e;A++){const b=A/e;f.x=-t*Math.cos(s+b*r)*Math.sin(a+y*o),f.y=t*Math.cos(a+y*o),f.z=t*Math.sin(s+b*r)*Math.sin(a+y*o),m.push(f.x,f.y,f.z),p.copy(f).normalize(),_.push(p.x,p.y,p.z),g.push(b+v,1-y),x.push(c++)}h.push(x)}for(let d=0;d<n;d++)for(let x=0;x<e;x++){const y=h[d][x+1],v=h[d][x],A=h[d+1][x],b=h[d+1][x+1];(d!==0||a>0)&&u.push(y,v,b),(d!==n-1||l<Math.PI)&&u.push(v,A,b)}this.setIndex(u),this.setAttribute("position",new ie(m,3)),this.setAttribute("normal",new ie(_,3)),this.setAttribute("uv",new ie(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class xr extends we{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new U,f=new U,p=new U;for(let u=0;u<=n;u++)for(let m=0;m<=s;m++){const _=m/s*r,g=u/n*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),p.subVectors(f,h).normalize(),l.push(p.x,p.y,p.z),c.push(m/s),c.push(u/n)}for(let u=1;u<=n;u++)for(let m=1;m<=s;m++){const _=(s+1)*u+m-1,g=(s+1)*(u-1)+m-1,d=(s+1)*(u-1)+m,x=(s+1)*u+m;a.push(_,g,x),a.push(g,d,x)}this.setIndex(a),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Wn extends we{constructor(t=new Zu(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new U,l=new U,c=new rt;let h=new U;const f=[],p=[],u=[],m=[];_(),this.setIndex(m),this.setAttribute("position",new ie(f,3)),this.setAttribute("normal",new ie(p,3)),this.setAttribute("uv",new ie(u,2));function _(){for(let y=0;y<e;y++)g(y);g(r===!1?e:0),x(),d()}function g(y){h=t.getPointAt(y/e,h);const v=a.normals[y],A=a.binormals[y];for(let b=0;b<=s;b++){const w=b/s*Math.PI*2,E=Math.sin(w),M=-Math.cos(w);l.x=M*v.x+E*A.x,l.y=M*v.y+E*A.y,l.z=M*v.z+E*A.z,l.normalize(),p.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,f.push(o.x,o.y,o.z)}}function d(){for(let y=1;y<=e;y++)for(let v=1;v<=s;v++){const A=(s+1)*(y-1)+(v-1),b=(s+1)*y+(v-1),w=(s+1)*y+v,E=(s+1)*(y-1)+v;m.push(A,b,E),m.push(b,w,E)}}function x(){for(let y=0;y<=e;y++)for(let v=0;v<=s;v++)c.x=y/e,c.y=v/s,u.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Wn(new Ca[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class kp extends je{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Dt extends ci{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ha,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ys extends Dt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new rt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ne(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new kt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new kt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new kt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Hp extends ci{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ha,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Gp extends ci{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ha,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=Ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Vp extends ci{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=sd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Wp extends ci{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Co={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Xp{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,p=c.length;f<p;f+=2){const u=c[f],m=c[f+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const qp=new Xp;class gc{constructor(t){this.manager=t!==void 0?t:qp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}gc.DEFAULT_MATERIAL_NAME="__DEFAULT";const gs=new WeakMap;class Yp extends gc{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Co.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let f=gs.get(a);f===void 0&&(f=[],gs.set(a,f)),f.push({onLoad:e,onError:s})}return a}const o=fr("img");function l(){h(),e&&e(this);const f=gs.get(this)||[];for(let p=0;p<f.length;p++){const u=f[p];u.onLoad&&u.onLoad(this)}gs.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),Co.remove(`image:${t}`);const p=gs.get(this)||[];for(let u=0;u<p.length;u++){const m=p[u];m.onError&&m.onError(f)}gs.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Co.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class tf extends gc{constructor(t){super(t)}load(t,e,n,s){const r=new ke,a=new Yp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class _c extends Le{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class fh extends _c{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.groundColor=new kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Po=new ae,dh=new U,ph=new U;class ef{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.mapType=Xn,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fc,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;dh.setFromMatrixPosition(t.matrixWorld),e.position.copy(dh),ph.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ph),e.updateMatrixWorld(),Po.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Po,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Po)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const mh=new ae,Ys=new U,Io=new U;class Zp extends ef{constructor(){super(new Xe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new rt(4,2),this._viewportCount=6,this._viewports=[new me(2,1,1,1),new me(0,1,1,1),new me(3,1,1,1),new me(1,1,1,1),new me(3,0,1,1),new me(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ys.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ys),Io.copy(n.position),Io.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Io),n.updateMatrixWorld(),s.makeTranslation(-Ys.x,-Ys.y,-Ys.z),mh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mh,n.coordinateSystem,n.reversedDepth)}}class Ia extends _c{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Zp}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class xc extends Bu{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class $p extends ef{constructor(){super(new xc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ta extends _c{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.target=new Le,this.shadow=new $p}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Jp extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Kp{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const gh=new ae;class jp{constructor(t,e,n=0,s=1/0){this.ray=new cc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new hc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return gh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(gh),this}intersectObject(t,e=!0,n=[]){return Ol(t,this,n,e),n.sort(_h),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Ol(t[s],this,n,e);return n.sort(_h),n}}function _h(i,t){return i.distance-t.distance}function Ol(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Ol(r[a],t,e,!0)}}function xh(i,t,e,n){const s=Qp(n);switch(e){case Cu:return i*t;case ka:return i*t/s.components*s.byteLength;case sc:return i*t/s.components*s.byteLength;case Iu:return i*t*2/s.components*s.byteLength;case rc:return i*t*2/s.components*s.byteLength;case Pu:return i*t*3/s.components*s.byteLength;case Ln:return i*t*4/s.components*s.byteLength;case ac:return i*t*4/s.components*s.byteLength;case ga:case _a:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xa:case va:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case il:case rl:return Math.max(i,16)*Math.max(t,8)/4;case nl:case sl:return Math.max(i,8)*Math.max(t,8)/2;case al:case ol:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ll:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case cl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case hl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ul:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case fl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case dl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case pl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ml:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case gl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case _l:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case xl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case vl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case yl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ml:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Sl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case bl:case Tl:case El:return Math.ceil(i/4)*Math.ceil(t/4)*16;case wl:case Al:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Rl:case Cl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Qp(i){switch(i){case Xn:case Eu:return{byteLength:1,components:1};case cr:case wu:case qn:return{byteLength:2,components:1};case nc:case ic:return{byteLength:2,components:4};case Wi:case ec:case In:return{byteLength:4,components:1};case Au:case Ru:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jl);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function nf(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function t0(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=i.SHORT;else if(c instanceof Uint32Array)u=i.UNSIGNED_INT;else if(c instanceof Int32Array)u=i.INT;else if(c instanceof Int8Array)u=i.BYTE;else if(c instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let p=0;for(let u=1;u<f.length;u++){const m=f[p],_=f[u];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++p,f[p]=_)}f.length=p+1;for(let u=0,m=f.length;u<m;u++){const _=f[u];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var e0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,n0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,i0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,s0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,r0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,a0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,o0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,l0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,c0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,h0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,u0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,f0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,d0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,p0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,m0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,y0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,M0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,b0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,T0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,E0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,w0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,A0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,R0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,C0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,P0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,I0="gl_FragColor = linearToOutputTexel( gl_FragColor );",L0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,U0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,N0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,F0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,O0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,z0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,B0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,k0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,H0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,G0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,V0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,W0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,q0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Y0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Z0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,J0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,j0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Q0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,em=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,nm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,im=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,am=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,om=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,um=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,pm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_m=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,vm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ym=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Tm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Em=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Am=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Cm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Pm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Um=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Om=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Bm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,km=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Gm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Vm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Wm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ym=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$m=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Qm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const t1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,e1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,o1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,l1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,c1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,h1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,u1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,d1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,m1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,v1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,M1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,S1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,E1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,C1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,P1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,I1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,L1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,D1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ee={alphahash_fragment:e0,alphahash_pars_fragment:n0,alphamap_fragment:i0,alphamap_pars_fragment:s0,alphatest_fragment:r0,alphatest_pars_fragment:a0,aomap_fragment:o0,aomap_pars_fragment:l0,batching_pars_vertex:c0,batching_vertex:h0,begin_vertex:u0,beginnormal_vertex:f0,bsdfs:d0,iridescence_fragment:p0,bumpmap_pars_fragment:m0,clipping_planes_fragment:g0,clipping_planes_pars_fragment:_0,clipping_planes_pars_vertex:x0,clipping_planes_vertex:v0,color_fragment:y0,color_pars_fragment:M0,color_pars_vertex:S0,color_vertex:b0,common:T0,cube_uv_reflection_fragment:E0,defaultnormal_vertex:w0,displacementmap_pars_vertex:A0,displacementmap_vertex:R0,emissivemap_fragment:C0,emissivemap_pars_fragment:P0,colorspace_fragment:I0,colorspace_pars_fragment:L0,envmap_fragment:D0,envmap_common_pars_fragment:U0,envmap_pars_fragment:N0,envmap_pars_vertex:F0,envmap_physical_pars_fragment:Y0,envmap_vertex:O0,fog_vertex:z0,fog_pars_vertex:B0,fog_fragment:k0,fog_pars_fragment:H0,gradientmap_pars_fragment:G0,lightmap_pars_fragment:V0,lights_lambert_fragment:W0,lights_lambert_pars_fragment:X0,lights_pars_begin:q0,lights_toon_fragment:Z0,lights_toon_pars_fragment:$0,lights_phong_fragment:J0,lights_phong_pars_fragment:K0,lights_physical_fragment:j0,lights_physical_pars_fragment:Q0,lights_fragment_begin:tm,lights_fragment_maps:em,lights_fragment_end:nm,logdepthbuf_fragment:im,logdepthbuf_pars_fragment:sm,logdepthbuf_pars_vertex:rm,logdepthbuf_vertex:am,map_fragment:om,map_pars_fragment:lm,map_particle_fragment:cm,map_particle_pars_fragment:hm,metalnessmap_fragment:um,metalnessmap_pars_fragment:fm,morphinstance_vertex:dm,morphcolor_vertex:pm,morphnormal_vertex:mm,morphtarget_pars_vertex:gm,morphtarget_vertex:_m,normal_fragment_begin:xm,normal_fragment_maps:vm,normal_pars_fragment:ym,normal_pars_vertex:Mm,normal_vertex:Sm,normalmap_pars_fragment:bm,clearcoat_normal_fragment_begin:Tm,clearcoat_normal_fragment_maps:Em,clearcoat_pars_fragment:wm,iridescence_pars_fragment:Am,opaque_fragment:Rm,packing:Cm,premultiplied_alpha_fragment:Pm,project_vertex:Im,dithering_fragment:Lm,dithering_pars_fragment:Dm,roughnessmap_fragment:Um,roughnessmap_pars_fragment:Nm,shadowmap_pars_fragment:Fm,shadowmap_pars_vertex:Om,shadowmap_vertex:zm,shadowmask_pars_fragment:Bm,skinbase_vertex:km,skinning_pars_vertex:Hm,skinning_vertex:Gm,skinnormal_vertex:Vm,specularmap_fragment:Wm,specularmap_pars_fragment:Xm,tonemapping_fragment:qm,tonemapping_pars_fragment:Ym,transmission_fragment:Zm,transmission_pars_fragment:$m,uv_pars_fragment:Jm,uv_pars_vertex:Km,uv_vertex:jm,worldpos_vertex:Qm,background_vert:t1,background_frag:e1,backgroundCube_vert:n1,backgroundCube_frag:i1,cube_vert:s1,cube_frag:r1,depth_vert:a1,depth_frag:o1,distanceRGBA_vert:l1,distanceRGBA_frag:c1,equirect_vert:h1,equirect_frag:u1,linedashed_vert:f1,linedashed_frag:d1,meshbasic_vert:p1,meshbasic_frag:m1,meshlambert_vert:g1,meshlambert_frag:_1,meshmatcap_vert:x1,meshmatcap_frag:v1,meshnormal_vert:y1,meshnormal_frag:M1,meshphong_vert:S1,meshphong_frag:b1,meshphysical_vert:T1,meshphysical_frag:E1,meshtoon_vert:w1,meshtoon_frag:A1,points_vert:R1,points_frag:C1,shadow_vert:P1,shadow_frag:I1,sprite_vert:L1,sprite_frag:D1},St={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},zn={basic:{uniforms:$e([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:$e([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new kt(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:$e([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:$e([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:$e([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new kt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:$e([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:$e([St.points,St.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:$e([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:$e([St.common,St.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:$e([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:$e([St.sprite,St.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:$e([St.common,St.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:$e([St.lights,St.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};zn.physical={uniforms:$e([zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};const ea={r:0,b:0,g:0},Ui=new Sn,U1=new ae;function N1(i,t,e,n,s,r,a){const o=new kt(0);let l=r===!0?0:1,c,h,f=null,p=0,u=null;function m(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?e:t).get(v)),v}function _(y){let v=!1;const A=m(y);A===null?d(o,l):A&&A.isColor&&(d(A,1),v=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,v){const A=m(v);A&&(A.isCubeTexture||A.mapping===Ba)?(h===void 0&&(h=new ye(new Zn(1,1,1),new je({name:"BackgroundCubeMaterial",uniforms:Ps(zn.backgroundCube.uniforms),vertexShader:zn.backgroundCube.vertexShader,fragmentShader:zn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ui.copy(v.backgroundRotation),Ui.x*=-1,Ui.y*=-1,Ui.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Ui.y*=-1,Ui.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(U1.makeRotationFromEuler(Ui)),h.material.toneMapped=le.getTransfer(A.colorSpace)!==ue,(f!==A||p!==A.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,f=A,p=A.version,u=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new ye(new re(2,2),new je({name:"BackgroundMaterial",uniforms:Ps(zn.background.uniforms),vertexShader:zn.background.vertexShader,fragmentShader:zn.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=le.getTransfer(A.colorSpace)!==ue,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(f!==A||p!==A.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,f=A,p=A.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function d(y,v){y.getRGB(ea,zu(i)),n.buffers.color.setClear(ea.r,ea.g,ea.b,v,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),l=v,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,d(o,l)},render:_,addToRenderList:g,dispose:x}}function F1(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(S,C,D,I,F){let O=!1;const k=f(I,D,C);r!==k&&(r=k,c(r.object)),O=u(S,I,D,F),O&&m(S,I,D,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,v(S,C,D,I),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function f(S,C,D){const I=D.wireframe===!0;let F=n[S.id];F===void 0&&(F={},n[S.id]=F);let O=F[C.id];O===void 0&&(O={},F[C.id]=O);let k=O[I];return k===void 0&&(k=p(l()),O[I]=k),k}function p(S){const C=[],D=[],I=[];for(let F=0;F<e;F++)C[F]=0,D[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:I,object:S,attributes:{},index:null}}function u(S,C,D,I){const F=r.attributes,O=C.attributes;let k=0;const X=D.getAttributes();for(const H in X)if(X[H].location>=0){const nt=F[H];let lt=O[H];if(lt===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(lt=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(lt=S.instanceColor)),nt===void 0||nt.attribute!==lt||lt&&nt.data!==lt.data)return!0;k++}return r.attributesNum!==k||r.index!==I}function m(S,C,D,I){const F={},O=C.attributes;let k=0;const X=D.getAttributes();for(const H in X)if(X[H].location>=0){let nt=O[H];nt===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(nt=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(nt=S.instanceColor));const lt={};lt.attribute=nt,nt&&nt.data&&(lt.data=nt.data),F[H]=lt,k++}r.attributes=F,r.attributesNum=k,r.index=I}function _(){const S=r.newAttributes;for(let C=0,D=S.length;C<D;C++)S[C]=0}function g(S){d(S,0)}function d(S,C){const D=r.newAttributes,I=r.enabledAttributes,F=r.attributeDivisors;D[S]=1,I[S]===0&&(i.enableVertexAttribArray(S),I[S]=1),F[S]!==C&&(i.vertexAttribDivisor(S,C),F[S]=C)}function x(){const S=r.newAttributes,C=r.enabledAttributes;for(let D=0,I=C.length;D<I;D++)C[D]!==S[D]&&(i.disableVertexAttribArray(D),C[D]=0)}function y(S,C,D,I,F,O,k){k===!0?i.vertexAttribIPointer(S,C,D,F,O):i.vertexAttribPointer(S,C,D,I,F,O)}function v(S,C,D,I){_();const F=I.attributes,O=D.getAttributes(),k=C.defaultAttributeValues;for(const X in O){const H=O[X];if(H.location>=0){let K=F[X];if(K===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(K=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(K=S.instanceColor)),K!==void 0){const nt=K.normalized,lt=K.itemSize,Ct=t.get(K);if(Ct===void 0)continue;const Ft=Ct.buffer,Kt=Ct.type,$t=Ct.bytesPerElement,J=Kt===i.INT||Kt===i.UNSIGNED_INT||K.gpuType===ec;if(K.isInterleavedBufferAttribute){const j=K.data,vt=j.stride,At=K.offset;if(j.isInstancedInterleavedBuffer){for(let Mt=0;Mt<H.locationSize;Mt++)d(H.location+Mt,j.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Mt=0;Mt<H.locationSize;Mt++)g(H.location+Mt);i.bindBuffer(i.ARRAY_BUFFER,Ft);for(let Mt=0;Mt<H.locationSize;Mt++)y(H.location+Mt,lt/H.locationSize,Kt,nt,vt*$t,(At+lt/H.locationSize*Mt)*$t,J)}else{if(K.isInstancedBufferAttribute){for(let j=0;j<H.locationSize;j++)d(H.location+j,K.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let j=0;j<H.locationSize;j++)g(H.location+j);i.bindBuffer(i.ARRAY_BUFFER,Ft);for(let j=0;j<H.locationSize;j++)y(H.location+j,lt/H.locationSize,Kt,nt,lt*$t,lt/H.locationSize*j*$t,J)}}else if(k!==void 0){const nt=k[X];if(nt!==void 0)switch(nt.length){case 2:i.vertexAttrib2fv(H.location,nt);break;case 3:i.vertexAttrib3fv(H.location,nt);break;case 4:i.vertexAttrib4fv(H.location,nt);break;default:i.vertexAttrib1fv(H.location,nt)}}}}x()}function A(){E();for(const S in n){const C=n[S];for(const D in C){const I=C[D];for(const F in I)h(I[F].object),delete I[F];delete C[D]}delete n[S]}}function b(S){if(n[S.id]===void 0)return;const C=n[S.id];for(const D in C){const I=C[D];for(const F in I)h(I[F].object),delete I[F];delete C[D]}delete n[S.id]}function w(S){for(const C in n){const D=n[C];if(D[S.id]===void 0)continue;const I=D[S.id];for(const F in I)h(I[F].object),delete I[F];delete D[S.id]}}function E(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function O1(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,f){f!==0&&(i.drawArraysInstanced(n,c,h,f),e.update(h,n,f))}function o(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,n,1)}function l(c,h,f,p){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)a(c[m],h[m],p[m]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,f);let m=0;for(let _=0;_<f;_++)m+=h[_]*p[_];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function z1(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==Ln&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const E=w===qn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Xn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==In&&!E)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,p=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=m>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:u,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:A,maxSamples:b}}function B1(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Fi,o=new te,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const u=f.length!==0||p||n!==0||s;return s=p,n=f.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,u){const m=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,d=i.get(f);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const x=r?0:n,y=x*4;let v=d.clippingState||null;l.value=v,v=h(m,p,y,u);for(let A=0;A!==y;++A)v[A]=e[A];d.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,u,m){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const d=u+_*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<d)&&(g=new Float32Array(d));for(let y=0,v=u;y!==_;++y,v+=4)a.copy(f[y]).applyMatrix4(x,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function k1(i){let t=new WeakMap;function e(a,o){return o===Qo?a.mapping=Es:o===tl&&(a.mapping=ws),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Qo||o===tl)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Qd(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Ms=4,vh=[.125,.215,.35,.446,.526,.582],zi=20,Lo=new xc,yh=new kt;let Do=null,Uo=0,No=0,Fo=!1;const Oi=(1+Math.sqrt(5))/2,_s=1/Oi,Mh=[new U(-Oi,_s,0),new U(Oi,_s,0),new U(-_s,0,Oi),new U(_s,0,Oi),new U(0,Oi,-_s),new U(0,Oi,_s),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],H1=new U;class zl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=H1}=r;Do=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),No=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Th(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Do,Uo,No),this._renderer.xr.enabled=Fo,t.scissorTest=!1,na(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Es||t.mapping===ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Do=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),No=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Hn,minFilter:Hn,generateMipmaps:!1,type:qn,format:Ln,colorSpace:Cs,depthBuffer:!1},s=Sh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=G1(r)),this._blurMaterial=V1(r,t,e)}return s}_compileMaterial(t){const e=new ye(this._lodPlanes[0],t);this._renderer.compile(e,Lo)}_sceneToCubeUV(t,e,n,s,r){const l=new Xe(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,u=f.toneMapping;f.getClearColor(yh),f.toneMapping=yi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));const _=new Ke({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1}),g=new ye(new Zn,_);let d=!1;const x=t.background;x?x.isColor&&(_.color.copy(x),t.background=null,d=!0):(_.color.copy(yh),d=!0);for(let y=0;y<6;y++){const v=y%3;v===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):v===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const A=this._cubeSize;na(s,v*A,y>2?A:0,A,A),f.setRenderTarget(s),d&&f.render(g,l),f.render(t,l)}g.geometry.dispose(),g.material.dispose(),f.toneMapping=u,f.autoClear=p,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Es||t.mapping===ws;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Th()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ye(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;na(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Lo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Mh[(s-r-1)%Mh.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ye(this._lodPlanes[s],c),p=c.uniforms,u=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*zi-1),_=r/m,g=isFinite(r)?1+Math.floor(h*_):zi;g>zi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${zi}`);const d=[];let x=0;for(let w=0;w<zi;++w){const E=w/_,M=Math.exp(-E*E/2);d.push(M),w===0?x+=M:w<g&&(x+=2*M)}for(let w=0;w<d.length;w++)d[w]=d[w]/x;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:y}=this;p.dTheta.value=m,p.mipInt.value=y-n;const v=this._sizeLods[s],A=3*v*(s>y-Ms?s-y+Ms:0),b=4*(this._cubeSize-v);na(e,A,b,3*v,2*v),l.setRenderTarget(e),l.render(f,Lo)}}function G1(i){const t=[],e=[],n=[];let s=i;const r=i-Ms+1+vh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Ms?l=vh[a-i+Ms-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,f=1+c,p=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,_=3,g=2,d=1,x=new Float32Array(_*m*u),y=new Float32Array(g*m*u),v=new Float32Array(d*m*u);for(let b=0;b<u;b++){const w=b%3*2/3-1,E=b>2?0:-1,M=[w,E,0,w+2/3,E,0,w+2/3,E+1,0,w,E,0,w+2/3,E+1,0,w,E+1,0];x.set(M,_*m*b),y.set(p,g*m*b);const S=[b,b,b,b,b,b];v.set(S,d*m*b)}const A=new we;A.setAttribute("position",new Ue(x,_)),A.setAttribute("uv",new Ue(y,g)),A.setAttribute("faceIndex",new Ue(v,d)),t.push(A),s>Ms&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Sh(i,t,e){const n=new un(i,t,e);return n.texture.mapping=Ba,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function na(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function V1(i,t,e){const n=new Float32Array(zi),s=new U(0,1,0);return new je({name:"SphericalGaussianBlur",defines:{n:zi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Je,depthTest:!1,depthWrite:!1})}function bh(){return new je({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Je,depthTest:!1,depthWrite:!1})}function Th(){return new je({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Je,depthTest:!1,depthWrite:!1})}function vc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function W1(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Qo||l===tl,h=l===Es||l===ws;if(c||h){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new zl(i)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new zl(i)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function X1(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&dr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function q1(i,t,e,n){const s={},r=new WeakMap;function a(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const m in p.attributes)t.remove(p.attributes[m]);p.removeEventListener("dispose",a),delete s[p.id];const u=r.get(p);u&&(t.remove(u),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,e.memory.geometries++),p}function l(f){const p=f.attributes;for(const u in p)t.update(p[u],i.ARRAY_BUFFER)}function c(f){const p=[],u=f.index,m=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let y=0,v=x.length;y<v;y+=3){const A=x[y+0],b=x[y+1],w=x[y+2];p.push(A,b,b,w,w,A)}}else if(m!==void 0){const x=m.array;_=m.version;for(let y=0,v=x.length/3-1;y<v;y+=3){const A=y+0,b=y+1,w=y+2;p.push(A,b,b,w,w,A)}}else return;const g=new(Du(p)?Ou:Fu)(p,1);g.version=_;const d=r.get(f);d&&t.remove(d),r.set(f,g)}function h(f){const p=r.get(f);if(p){const u=f.index;u!==null&&p.version<u.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function Y1(i,t,e){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,u){i.drawElements(n,u,r,p*a),e.update(u,n,1)}function c(p,u,m){m!==0&&(i.drawElementsInstanced(n,u,r,p*a,m),e.update(u,n,m))}function h(p,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,p,0,m);let g=0;for(let d=0;d<m;d++)g+=u[d];e.update(g,n,1)}function f(p,u,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<p.length;d++)c(p[d]/a,u[d],_[d]);else{g.multiDrawElementsInstancedWEBGL(n,u,0,r,p,0,_,0,m);let d=0;for(let x=0;x<m;x++)d+=u[x]*_[x];e.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Z1(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function $1(i,t,e){const n=new WeakMap,s=new me;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let S=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var u=S;p!==void 0&&p.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let A=o.attributes.position.count*v,b=1;A>t.maxTextureSize&&(b=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const w=new Float32Array(A*b*4*f),E=new Uu(w,A,b,f);E.type=In,E.needsUpdate=!0;const M=v*4;for(let C=0;C<f;C++){const D=d[C],I=x[C],F=y[C],O=A*b*4*C;for(let k=0;k<D.count;k++){const X=k*M;m===!0&&(s.fromBufferAttribute(D,k),w[O+X+0]=s.x,w[O+X+1]=s.y,w[O+X+2]=s.z,w[O+X+3]=0),_===!0&&(s.fromBufferAttribute(I,k),w[O+X+4]=s.x,w[O+X+5]=s.y,w[O+X+6]=s.z,w[O+X+7]=0),g===!0&&(s.fromBufferAttribute(F,k),w[O+X+8]=s.x,w[O+X+9]=s.y,w[O+X+10]=s.z,w[O+X+11]=F.itemSize===4?s.w:1)}}p={count:f,texture:E,size:new rt(A,b)},n.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function J1(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const sf=new ke,Eh=new dc(1,1),rf=new Uu,af=new Od,of=new ku,wh=[],Ah=[],Rh=new Float32Array(16),Ch=new Float32Array(9),Ph=new Float32Array(4);function Ns(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=wh[s];if(r===void 0&&(r=new Float32Array(s),wh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ne(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function qa(i,t){let e=Ah[t];e===void 0&&(e=new Int32Array(t),Ah[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function K1(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function j1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2fv(this.addr,t),Fe(e,t)}}function Q1(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ne(e,t))return;i.uniform3fv(this.addr,t),Fe(e,t)}}function tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4fv(this.addr,t),Fe(e,t)}}function eg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;Ph.set(n),i.uniformMatrix2fv(this.addr,!1,Ph),Fe(e,n)}}function ng(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;Ch.set(n),i.uniformMatrix3fv(this.addr,!1,Ch),Fe(e,n)}}function ig(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ne(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Fe(e,t)}else{if(Ne(e,n))return;Rh.set(n),i.uniformMatrix4fv(this.addr,!1,Rh),Fe(e,n)}}function sg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2iv(this.addr,t),Fe(e,t)}}function ag(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;i.uniform3iv(this.addr,t),Fe(e,t)}}function og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4iv(this.addr,t),Fe(e,t)}}function lg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;i.uniform2uiv(this.addr,t),Fe(e,t)}}function hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;i.uniform3uiv(this.addr,t),Fe(e,t)}}function ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;i.uniform4uiv(this.addr,t),Fe(e,t)}}function fg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Eh.compareFunction=Lu,r=Eh):r=sf,e.setTexture2D(t||r,s)}function dg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||af,s)}function pg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||of,s)}function mg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||rf,s)}function gg(i){switch(i){case 5126:return K1;case 35664:return j1;case 35665:return Q1;case 35666:return tg;case 35674:return eg;case 35675:return ng;case 35676:return ig;case 5124:case 35670:return sg;case 35667:case 35671:return rg;case 35668:case 35672:return ag;case 35669:case 35673:return og;case 5125:return lg;case 36294:return cg;case 36295:return hg;case 36296:return ug;case 35678:case 36198:case 36298:case 36306:case 35682:return fg;case 35679:case 36299:case 36307:return dg;case 35680:case 36300:case 36308:case 36293:return pg;case 36289:case 36303:case 36311:case 36292:return mg}}function _g(i,t){i.uniform1fv(this.addr,t)}function xg(i,t){const e=Ns(t,this.size,2);i.uniform2fv(this.addr,e)}function vg(i,t){const e=Ns(t,this.size,3);i.uniform3fv(this.addr,e)}function yg(i,t){const e=Ns(t,this.size,4);i.uniform4fv(this.addr,e)}function Mg(i,t){const e=Ns(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Sg(i,t){const e=Ns(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function bg(i,t){const e=Ns(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Tg(i,t){i.uniform1iv(this.addr,t)}function Eg(i,t){i.uniform2iv(this.addr,t)}function wg(i,t){i.uniform3iv(this.addr,t)}function Ag(i,t){i.uniform4iv(this.addr,t)}function Rg(i,t){i.uniform1uiv(this.addr,t)}function Cg(i,t){i.uniform2uiv(this.addr,t)}function Pg(i,t){i.uniform3uiv(this.addr,t)}function Ig(i,t){i.uniform4uiv(this.addr,t)}function Lg(i,t,e){const n=this.cache,s=t.length,r=qa(e,s);Ne(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||sf,r[a])}function Dg(i,t,e){const n=this.cache,s=t.length,r=qa(e,s);Ne(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||af,r[a])}function Ug(i,t,e){const n=this.cache,s=t.length,r=qa(e,s);Ne(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||of,r[a])}function Ng(i,t,e){const n=this.cache,s=t.length,r=qa(e,s);Ne(n,r)||(i.uniform1iv(this.addr,r),Fe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||rf,r[a])}function Fg(i){switch(i){case 5126:return _g;case 35664:return xg;case 35665:return vg;case 35666:return yg;case 35674:return Mg;case 35675:return Sg;case 35676:return bg;case 5124:case 35670:return Tg;case 35667:case 35671:return Eg;case 35668:case 35672:return wg;case 35669:case 35673:return Ag;case 5125:return Rg;case 36294:return Cg;case 36295:return Pg;case 36296:return Ig;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Ug;case 36289:case 36303:case 36311:case 36292:return Ng}}class Og{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=gg(e.type)}}class zg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fg(e.type)}}class Bg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Oo=/(\w+)(\])?(\[|\.)?/g;function Ih(i,t){i.seq.push(t),i.map[t.id]=t}function kg(i,t,e){const n=i.name,s=n.length;for(Oo.lastIndex=0;;){const r=Oo.exec(n),a=Oo.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ih(e,c===void 0?new Og(o,i,t):new zg(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Bg(o),Ih(e,f)),e=f}}}class ya{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);kg(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Lh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Hg=37297;let Gg=0;function Vg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Dh=new te;function Wg(i){le._getMatrix(Dh,le.workingColorSpace,i);const t=`mat3( ${Dh.elements.map(e=>e.toFixed(4))} )`;switch(le.getTransfer(i)){case wa:return[t,"LinearTransferOETF"];case ue:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Uh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Vg(i.getShaderSource(t),o)}else return r}function Xg(i,t){const e=Wg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function qg(i,t){let e;switch(t){case xu:e="Linear";break;case vu:e="Reinhard";break;case yu:e="Cineon";break;case tc:e="ACESFilmic";break;case Su:e="AgX";break;case bu:e="Neutral";break;case Mu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ia=new U;function Yg(){le.getLuminanceCoefficients(ia);const i=ia.x.toFixed(4),t=ia.y.toFixed(4),e=ia.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Zg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ks).join(`
`)}function $g(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Jg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ks(i){return i!==""}function Nh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Fh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Kg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bl(i){return i.replace(Kg,Qg)}const jg=new Map;function Qg(i,t){let e=ee[t];if(e===void 0){const n=jg.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Bl(e)}const t_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Oh(i){return i.replace(t_,e_)}function e_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function zh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function n_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===du?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===pu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ii&&(t="SHADOWMAP_TYPE_VSM"),t}function i_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Es:case ws:t="ENVMAP_TYPE_CUBE";break;case Ba:t="ENVMAP_TYPE_CUBE_UV";break}return t}function s_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ws:t="ENVMAP_MODE_REFRACTION";break}return t}function r_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ql:t="ENVMAP_BLENDING_MULTIPLY";break;case ed:t="ENVMAP_BLENDING_MIX";break;case nd:t="ENVMAP_BLENDING_ADD";break}return t}function a_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function o_(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=n_(e),c=i_(e),h=s_(e),f=r_(e),p=a_(e),u=Zg(e),m=$g(r),_=s.createProgram();let g,d,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ks).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ks).join(`
`),d.length>0&&(d+=`
`)):(g=[zh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ks).join(`
`),d=[zh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==yi?"#define TONE_MAPPING":"",e.toneMapping!==yi?ee.tonemapping_pars_fragment:"",e.toneMapping!==yi?qg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,Xg("linearToOutputTexel",e.outputColorSpace),Yg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ks).join(`
`)),a=Bl(a),a=Nh(a,e),a=Fh(a,e),o=Bl(o),o=Nh(o,e),o=Fh(o,e),a=Oh(a),o=Oh(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",e.glslVersion===Nc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=x+g+a,v=x+d+o,A=Lh(s,s.VERTEX_SHADER,y),b=Lh(s,s.FRAGMENT_SHADER,v);s.attachShader(_,A),s.attachShader(_,b),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function w(C){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(_)||"",I=s.getShaderInfoLog(A)||"",F=s.getShaderInfoLog(b)||"",O=D.trim(),k=I.trim(),X=F.trim();let H=!0,K=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,A,b);else{const nt=Uh(s,A,"vertex"),lt=Uh(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+O+`
`+nt+`
`+lt)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(k===""||X==="")&&(K=!1);K&&(C.diagnostics={runnable:H,programLog:O,vertexShader:{log:k,prefix:g},fragmentShader:{log:X,prefix:d}})}s.deleteShader(A),s.deleteShader(b),E=new ya(s,_),M=Jg(s,_)}let E;this.getUniforms=function(){return E===void 0&&w(this),E};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,Hg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=b,this}let l_=0;class c_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new h_(t),e.set(t,n)),n}}class h_{constructor(t){this.id=l_++,this.code=t,this.usedTimes=0}}function u_(i,t,e,n,s,r,a){const o=new hc,l=new c_,c=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let u=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,S,C,D,I){const F=D.fog,O=I.geometry,k=M.isMeshStandardMaterial?D.environment:null,X=(M.isMeshStandardMaterial?e:t).get(M.envMap||k),H=X&&X.mapping===Ba?X.image.height:null,K=m[M.type];M.precision!==null&&(u=s.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const nt=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,lt=nt!==void 0?nt.length:0;let Ct=0;O.morphAttributes.position!==void 0&&(Ct=1),O.morphAttributes.normal!==void 0&&(Ct=2),O.morphAttributes.color!==void 0&&(Ct=3);let Ft,Kt,$t,J;if(K){const he=zn[K];Ft=he.vertexShader,Kt=he.fragmentShader}else Ft=M.vertexShader,Kt=M.fragmentShader,l.update(M),$t=l.getVertexShaderID(M),J=l.getFragmentShaderID(M);const j=i.getRenderTarget(),vt=i.state.buffers.depth.getReversed(),At=I.isInstancedMesh===!0,Mt=I.isBatchedMesh===!0,Jt=!!M.map,Qt=!!M.matcap,N=!!X,ot=!!M.aoMap,it=!!M.lightMap,tt=!!M.bumpMap,Q=!!M.normalMap,_t=!!M.displacementMap,ct=!!M.emissiveMap,xt=!!M.metalnessMap,qt=!!M.roughnessMap,Wt=M.anisotropy>0,P=M.clearcoat>0,T=M.dispersion>0,W=M.iridescence>0,Z=M.sheen>0,at=M.transmission>0,$=Wt&&!!M.anisotropyMap,It=P&&!!M.clearcoatMap,pt=P&&!!M.clearcoatNormalMap,Pt=P&&!!M.clearcoatRoughnessMap,Nt=W&&!!M.iridescenceMap,ft=W&&!!M.iridescenceThicknessMap,Tt=Z&&!!M.sheenColorMap,Vt=Z&&!!M.sheenRoughnessMap,Bt=!!M.specularMap,yt=!!M.specularColorMap,Yt=!!M.specularIntensityMap,B=at&&!!M.transmissionMap,ut=at&&!!M.thicknessMap,gt=!!M.gradientMap,Ut=!!M.alphaMap,dt=M.alphaTest>0,st=!!M.alphaHash,zt=!!M.extensions;let jt=yi;M.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(jt=i.toneMapping);const xe={shaderID:K,shaderType:M.type,shaderName:M.name,vertexShader:Ft,fragmentShader:Kt,defines:M.defines,customVertexShaderID:$t,customFragmentShaderID:J,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:Mt,batchingColor:Mt&&I._colorsTexture!==null,instancing:At,instancingColor:At&&I.instanceColor!==null,instancingMorph:At&&I.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Cs,alphaToCoverage:!!M.alphaToCoverage,map:Jt,matcap:Qt,envMap:N,envMapMode:N&&X.mapping,envMapCubeUVHeight:H,aoMap:ot,lightMap:it,bumpMap:tt,normalMap:Q,displacementMap:p&&_t,emissiveMap:ct,normalMapObjectSpace:Q&&M.normalMapType===ad,normalMapTangentSpace:Q&&M.normalMapType===Ha,metalnessMap:xt,roughnessMap:qt,anisotropy:Wt,anisotropyMap:$,clearcoat:P,clearcoatMap:It,clearcoatNormalMap:pt,clearcoatRoughnessMap:Pt,dispersion:T,iridescence:W,iridescenceMap:Nt,iridescenceThicknessMap:ft,sheen:Z,sheenColorMap:Tt,sheenRoughnessMap:Vt,specularMap:Bt,specularColorMap:yt,specularIntensityMap:Yt,transmission:at,transmissionMap:B,thicknessMap:ut,gradientMap:gt,opaque:M.transparent===!1&&M.blending===Ss&&M.alphaToCoverage===!1,alphaMap:Ut,alphaTest:dt,alphaHash:st,combine:M.combine,mapUv:Jt&&_(M.map.channel),aoMapUv:ot&&_(M.aoMap.channel),lightMapUv:it&&_(M.lightMap.channel),bumpMapUv:tt&&_(M.bumpMap.channel),normalMapUv:Q&&_(M.normalMap.channel),displacementMapUv:_t&&_(M.displacementMap.channel),emissiveMapUv:ct&&_(M.emissiveMap.channel),metalnessMapUv:xt&&_(M.metalnessMap.channel),roughnessMapUv:qt&&_(M.roughnessMap.channel),anisotropyMapUv:$&&_(M.anisotropyMap.channel),clearcoatMapUv:It&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:pt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:ft&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&_(M.sheenRoughnessMap.channel),specularMapUv:Bt&&_(M.specularMap.channel),specularColorMapUv:yt&&_(M.specularColorMap.channel),specularIntensityMapUv:Yt&&_(M.specularIntensityMap.channel),transmissionMapUv:B&&_(M.transmissionMap.channel),thicknessMapUv:ut&&_(M.thicknessMap.channel),alphaMapUv:Ut&&_(M.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(Q||Wt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!O.attributes.uv&&(Jt||Ut),fog:!!F,useFog:M.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:vt,skinning:I.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:Ct,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:jt,decodeVideoTexture:Jt&&M.map.isVideoTexture===!0&&le.getTransfer(M.map.colorSpace)===ue,decodeVideoTextureEmissive:ct&&M.emissiveMap.isVideoTexture===!0&&le.getTransfer(M.emissiveMap.colorSpace)===ue,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ie,flipSided:M.side===qe,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:zt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&M.extensions.multiDraw===!0||Mt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return xe.vertexUv1s=c.has(1),xe.vertexUv2s=c.has(2),xe.vertexUv3s=c.has(3),c.clear(),xe}function d(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)S.push(C),S.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(x(S,M),y(S,M),S.push(i.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function x(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function y(M,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),M.push(o.mask)}function v(M){const S=m[M.type];let C;if(S){const D=zn[S];C=Gi.clone(D.uniforms)}else C=M.uniforms;return C}function A(M,S){let C;for(let D=0,I=h.length;D<I;D++){const F=h[D];if(F.cacheKey===S){C=F,++C.usedTimes;break}}return C===void 0&&(C=new o_(i,S,M,r),h.push(C)),C}function b(M){if(--M.usedTimes===0){const S=h.indexOf(M);h[S]=h[h.length-1],h.pop(),M.destroy()}}function w(M){l.remove(M)}function E(){l.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:v,acquireProgram:A,releaseProgram:b,releaseShaderCache:w,programs:h,dispose:E}}function f_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function d_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function kh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,p,u,m,_,g){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:p,material:u,groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},i[t]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=u,d.groupOrder=m,d.renderOrder=f.renderOrder,d.z=_,d.group=g),t++,d}function o(f,p,u,m,_,g){const d=a(f,p,u,m,_,g);u.transmission>0?n.push(d):u.transparent===!0?s.push(d):e.push(d)}function l(f,p,u,m,_,g){const d=a(f,p,u,m,_,g);u.transmission>0?n.unshift(d):u.transparent===!0?s.unshift(d):e.unshift(d)}function c(f,p){e.length>1&&e.sort(f||d_),n.length>1&&n.sort(p||Bh),s.length>1&&s.sort(p||Bh)}function h(){for(let f=t,p=i.length;f<p;f++){const u=i[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function p_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new kh,i.set(n,[a])):s>=r.length?(a=new kh,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function m_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new kt};break;case"SpotLight":e={position:new U,direction:new U,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function g_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let __=0;function x_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function v_(i){const t=new m_,e=g_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);const s=new U,r=new ae,a=new ae;function o(c){let h=0,f=0,p=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let u=0,m=0,_=0,g=0,d=0,x=0,y=0,v=0,A=0,b=0,w=0;c.sort(x_);for(let M=0,S=c.length;M<S;M++){const C=c[M],D=C.color,I=C.intensity,F=C.distance,O=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=D.r*I,f+=D.g*I,p+=D.b*I;else if(C.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(C.sh.coefficients[k],I);w++}else if(C.isDirectionalLight){const k=t.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const X=C.shadow,H=e.get(C);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.directionalShadow[u]=H,n.directionalShadowMap[u]=O,n.directionalShadowMatrix[u]=C.shadow.matrix,x++}n.directional[u]=k,u++}else if(C.isSpotLight){const k=t.get(C);k.position.setFromMatrixPosition(C.matrixWorld),k.color.copy(D).multiplyScalar(I),k.distance=F,k.coneCos=Math.cos(C.angle),k.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),k.decay=C.decay,n.spot[_]=k;const X=C.shadow;if(C.map&&(n.spotLightMap[A]=C.map,A++,X.updateMatrices(C),C.castShadow&&b++),n.spotLightMatrix[_]=X.matrix,C.castShadow){const H=e.get(C);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=O,v++}_++}else if(C.isRectAreaLight){const k=t.get(C);k.color.copy(D).multiplyScalar(I),k.halfWidth.set(C.width*.5,0,0),k.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=k,g++}else if(C.isPointLight){const k=t.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),k.distance=C.distance,k.decay=C.decay,C.castShadow){const X=C.shadow,H=e.get(C);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,n.pointShadow[m]=H,n.pointShadowMap[m]=O,n.pointShadowMatrix[m]=C.shadow.matrix,y++}n.point[m]=k,m++}else if(C.isHemisphereLight){const k=t.get(C);k.skyColor.copy(C.color).multiplyScalar(I),k.groundColor.copy(C.groundColor).multiplyScalar(I),n.hemi[d]=k,d++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const E=n.hash;(E.directionalLength!==u||E.pointLength!==m||E.spotLength!==_||E.rectAreaLength!==g||E.hemiLength!==d||E.numDirectionalShadows!==x||E.numPointShadows!==y||E.numSpotShadows!==v||E.numSpotMaps!==A||E.numLightProbes!==w)&&(n.directional.length=u,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=d,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=v+A-b,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=w,E.directionalLength=u,E.pointLength=m,E.spotLength=_,E.rectAreaLength=g,E.hemiLength=d,E.numDirectionalShadows=x,E.numPointShadows=y,E.numSpotShadows=v,E.numSpotMaps=A,E.numLightProbes=w,n.version=__++)}function l(c,h){let f=0,p=0,u=0,m=0,_=0;const g=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const y=c[d];if(y.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(y.isSpotLight){const v=n.spot[u];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),u++}else if(y.isRectAreaLight){const v=n.rectArea[m];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),m++}else if(y.isPointLight){const v=n.point[p];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(g),p++}else if(y.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:n}}function Hh(i){const t=new v_(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function y_(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Hh(i),t.set(s,[o])):r>=a.length?(o=new Hh(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const M_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,S_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function b_(i,t,e){let n=new fc;const s=new rt,r=new rt,a=new me,o=new Vp({depthPacking:rd}),l=new Wp,c={},h=e.maxTextureSize,f={[bi]:qe,[qe]:bi,[Ie]:Ie},p=new je({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:M_,fragmentShader:S_}),u=p.clone();u.defines.HORIZONTAL_PASS=1;const m=new we;m.setAttribute("position",new Ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ye(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=du;let d=this.type;this.render=function(b,w,E){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const M=i.getRenderTarget(),S=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Je),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const I=d!==ii&&this.type===ii,F=d===ii&&this.type!==ii;for(let O=0,k=b.length;O<k;O++){const X=b[O],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const K=H.getFrameExtents();if(s.multiply(K),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,H.mapSize.y=r.y)),H.map===null||I===!0||F===!0){const lt=this.type!==ii?{minFilter:Qe,magFilter:Qe}:{};H.map!==null&&H.map.dispose(),H.map=new un(s.x,s.y,lt),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const nt=H.getViewportCount();for(let lt=0;lt<nt;lt++){const Ct=H.getViewport(lt);a.set(r.x*Ct.x,r.y*Ct.y,r.x*Ct.z,r.y*Ct.w),D.viewport(a),H.updateMatrices(X,lt),n=H.getFrustum(),v(w,E,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===ii&&x(H,E),H.needsUpdate=!1}d=this.type,g.needsUpdate=!1,i.setRenderTarget(M,S,C)};function x(b,w){const E=t.update(_);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new un(s.x,s.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(w,null,E,p,_,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(w,null,E,u,_,null)}function y(b,w,E,M){let S=null;const C=E.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)S=C;else if(S=E.isPointLight===!0?l:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const D=S.uuid,I=w.uuid;let F=c[D];F===void 0&&(F={},c[D]=F);let O=F[I];O===void 0&&(O=S.clone(),F[I]=O,w.addEventListener("dispose",A)),S=O}if(S.visible=w.visible,S.wireframe=w.wireframe,M===ii?S.side=w.shadowSide!==null?w.shadowSide:w.side:S.side=w.shadowSide!==null?w.shadowSide:f[w.side],S.alphaMap=w.alphaMap,S.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,S.map=w.map,S.clipShadows=w.clipShadows,S.clippingPlanes=w.clippingPlanes,S.clipIntersection=w.clipIntersection,S.displacementMap=w.displacementMap,S.displacementScale=w.displacementScale,S.displacementBias=w.displacementBias,S.wireframeLinewidth=w.wireframeLinewidth,S.linewidth=w.linewidth,E.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const D=i.properties.get(S);D.light=E}return S}function v(b,w,E,M,S){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===ii)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,b.matrixWorld);const I=t.update(b),F=b.material;if(Array.isArray(F)){const O=I.groups;for(let k=0,X=O.length;k<X;k++){const H=O[k],K=F[H.materialIndex];if(K&&K.visible){const nt=y(b,K,M,S);b.onBeforeShadow(i,b,w,E,I,nt,H),i.renderBufferDirect(E,null,I,nt,b,H),b.onAfterShadow(i,b,w,E,I,nt,H)}}}else if(F.visible){const O=y(b,F,M,S);b.onBeforeShadow(i,b,w,E,I,O,null),i.renderBufferDirect(E,null,I,O,b,null),b.onAfterShadow(i,b,w,E,I,O,null)}}const D=b.children;for(let I=0,F=D.length;I<F;I++)v(D[I],w,E,M,S)}function A(b){b.target.removeEventListener("dispose",A);for(const E in c){const M=c[E],S=b.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const T_={[qo]:Yo,[Zo]:Ko,[$o]:jo,[Ts]:Jo,[Yo]:qo,[Ko]:Zo,[jo]:$o,[Jo]:Ts};function E_(i,t){function e(){let B=!1;const ut=new me;let gt=null;const Ut=new me(0,0,0,0);return{setMask:function(dt){gt!==dt&&!B&&(i.colorMask(dt,dt,dt,dt),gt=dt)},setLocked:function(dt){B=dt},setClear:function(dt,st,zt,jt,xe){xe===!0&&(dt*=jt,st*=jt,zt*=jt),ut.set(dt,st,zt,jt),Ut.equals(ut)===!1&&(i.clearColor(dt,st,zt,jt),Ut.copy(ut))},reset:function(){B=!1,gt=null,Ut.set(-1,0,0,0)}}}function n(){let B=!1,ut=!1,gt=null,Ut=null,dt=null;return{setReversed:function(st){if(ut!==st){const zt=t.get("EXT_clip_control");st?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),ut=st;const jt=dt;dt=null,this.setClear(jt)}},getReversed:function(){return ut},setTest:function(st){st?j(i.DEPTH_TEST):vt(i.DEPTH_TEST)},setMask:function(st){gt!==st&&!B&&(i.depthMask(st),gt=st)},setFunc:function(st){if(ut&&(st=T_[st]),Ut!==st){switch(st){case qo:i.depthFunc(i.NEVER);break;case Yo:i.depthFunc(i.ALWAYS);break;case Zo:i.depthFunc(i.LESS);break;case Ts:i.depthFunc(i.LEQUAL);break;case $o:i.depthFunc(i.EQUAL);break;case Jo:i.depthFunc(i.GEQUAL);break;case Ko:i.depthFunc(i.GREATER);break;case jo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ut=st}},setLocked:function(st){B=st},setClear:function(st){dt!==st&&(ut&&(st=1-st),i.clearDepth(st),dt=st)},reset:function(){B=!1,gt=null,Ut=null,dt=null,ut=!1}}}function s(){let B=!1,ut=null,gt=null,Ut=null,dt=null,st=null,zt=null,jt=null,xe=null;return{setTest:function(he){B||(he?j(i.STENCIL_TEST):vt(i.STENCIL_TEST))},setMask:function(he){ut!==he&&!B&&(i.stencilMask(he),ut=he)},setFunc:function(he,Kn,Fn){(gt!==he||Ut!==Kn||dt!==Fn)&&(i.stencilFunc(he,Kn,Fn),gt=he,Ut=Kn,dt=Fn)},setOp:function(he,Kn,Fn){(st!==he||zt!==Kn||jt!==Fn)&&(i.stencilOp(he,Kn,Fn),st=he,zt=Kn,jt=Fn)},setLocked:function(he){B=he},setClear:function(he){xe!==he&&(i.clearStencil(he),xe=he)},reset:function(){B=!1,ut=null,gt=null,Ut=null,dt=null,st=null,zt=null,jt=null,xe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},p=new WeakMap,u=[],m=null,_=!1,g=null,d=null,x=null,y=null,v=null,A=null,b=null,w=new kt(0,0,0),E=0,M=!1,S=null,C=null,D=null,I=null,F=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,X=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),k=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),k=X>=2);let K=null,nt={};const lt=i.getParameter(i.SCISSOR_BOX),Ct=i.getParameter(i.VIEWPORT),Ft=new me().fromArray(lt),Kt=new me().fromArray(Ct);function $t(B,ut,gt,Ut){const dt=new Uint8Array(4),st=i.createTexture();i.bindTexture(B,st),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<gt;zt++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(ut,0,i.RGBA,1,1,Ut,0,i.RGBA,i.UNSIGNED_BYTE,dt):i.texImage2D(ut+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,dt);return st}const J={};J[i.TEXTURE_2D]=$t(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=$t(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=$t(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=$t(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(i.DEPTH_TEST),a.setFunc(Ts),tt(!1),Q(Ic),j(i.CULL_FACE),ot(Je);function j(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function vt(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function At(B,ut){return f[B]!==ut?(i.bindFramebuffer(B,ut),f[B]=ut,B===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ut),B===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ut),!0):!1}function Mt(B,ut){let gt=u,Ut=!1;if(B){gt=p.get(ut),gt===void 0&&(gt=[],p.set(ut,gt));const dt=B.textures;if(gt.length!==dt.length||gt[0]!==i.COLOR_ATTACHMENT0){for(let st=0,zt=dt.length;st<zt;st++)gt[st]=i.COLOR_ATTACHMENT0+st;gt.length=dt.length,Ut=!0}}else gt[0]!==i.BACK&&(gt[0]=i.BACK,Ut=!0);Ut&&i.drawBuffers(gt)}function Jt(B){return m!==B?(i.useProgram(B),m=B,!0):!1}const Qt={[ri]:i.FUNC_ADD,[Hf]:i.FUNC_SUBTRACT,[Gf]:i.FUNC_REVERSE_SUBTRACT};Qt[Vf]=i.MIN,Qt[Wf]=i.MAX;const N={[Vo]:i.ZERO,[Xf]:i.ONE,[qf]:i.SRC_COLOR,[Wo]:i.SRC_ALPHA,[Jf]:i.SRC_ALPHA_SATURATE,[_u]:i.DST_COLOR,[gu]:i.DST_ALPHA,[Yf]:i.ONE_MINUS_SRC_COLOR,[Xo]:i.ONE_MINUS_SRC_ALPHA,[$f]:i.ONE_MINUS_DST_COLOR,[Zf]:i.ONE_MINUS_DST_ALPHA,[Kf]:i.CONSTANT_COLOR,[jf]:i.ONE_MINUS_CONSTANT_COLOR,[Qf]:i.CONSTANT_ALPHA,[td]:i.ONE_MINUS_CONSTANT_ALPHA};function ot(B,ut,gt,Ut,dt,st,zt,jt,xe,he){if(B===Je){_===!0&&(vt(i.BLEND),_=!1);return}if(_===!1&&(j(i.BLEND),_=!0),B!==mu){if(B!==g||he!==M){if((d!==ri||v!==ri)&&(i.blendEquation(i.FUNC_ADD),d=ri,v=ri),he)switch(B){case Ss:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case lr:i.blendFunc(i.ONE,i.ONE);break;case Lc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Ss:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case lr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Lc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}x=null,y=null,A=null,b=null,w.set(0,0,0),E=0,g=B,M=he}return}dt=dt||ut,st=st||gt,zt=zt||Ut,(ut!==d||dt!==v)&&(i.blendEquationSeparate(Qt[ut],Qt[dt]),d=ut,v=dt),(gt!==x||Ut!==y||st!==A||zt!==b)&&(i.blendFuncSeparate(N[gt],N[Ut],N[st],N[zt]),x=gt,y=Ut,A=st,b=zt),(jt.equals(w)===!1||xe!==E)&&(i.blendColor(jt.r,jt.g,jt.b,xe),w.copy(jt),E=xe),g=B,M=!1}function it(B,ut){B.side===Ie?vt(i.CULL_FACE):j(i.CULL_FACE);let gt=B.side===qe;ut&&(gt=!gt),tt(gt),B.blending===Ss&&B.transparent===!1?ot(Je):ot(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);const Ut=B.stencilWrite;o.setTest(Ut),Ut&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ct(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):vt(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(B){S!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),S=B)}function Q(B){B!==Bf?(j(i.CULL_FACE),B!==C&&(B===Ic?i.cullFace(i.BACK):B===kf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):vt(i.CULL_FACE),C=B}function _t(B){B!==D&&(k&&i.lineWidth(B),D=B)}function ct(B,ut,gt){B?(j(i.POLYGON_OFFSET_FILL),(I!==ut||F!==gt)&&(i.polygonOffset(ut,gt),I=ut,F=gt)):vt(i.POLYGON_OFFSET_FILL)}function xt(B){B?j(i.SCISSOR_TEST):vt(i.SCISSOR_TEST)}function qt(B){B===void 0&&(B=i.TEXTURE0+O-1),K!==B&&(i.activeTexture(B),K=B)}function Wt(B,ut,gt){gt===void 0&&(K===null?gt=i.TEXTURE0+O-1:gt=K);let Ut=nt[gt];Ut===void 0&&(Ut={type:void 0,texture:void 0},nt[gt]=Ut),(Ut.type!==B||Ut.texture!==ut)&&(K!==gt&&(i.activeTexture(gt),K=gt),i.bindTexture(B,ut||J[B]),Ut.type=B,Ut.texture=ut)}function P(){const B=nt[K];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function T(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Z(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function at(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function It(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function pt(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pt(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Nt(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ft(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Tt(B){Ft.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Ft.copy(B))}function Vt(B){Kt.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),Kt.copy(B))}function Bt(B,ut){let gt=c.get(ut);gt===void 0&&(gt=new WeakMap,c.set(ut,gt));let Ut=gt.get(B);Ut===void 0&&(Ut=i.getUniformBlockIndex(ut,B.name),gt.set(B,Ut))}function yt(B,ut){const Ut=c.get(ut).get(B);l.get(ut)!==Ut&&(i.uniformBlockBinding(ut,Ut,B.__bindingPointIndex),l.set(ut,Ut))}function Yt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},K=null,nt={},f={},p=new WeakMap,u=[],m=null,_=!1,g=null,d=null,x=null,y=null,v=null,A=null,b=null,w=new kt(0,0,0),E=0,M=!1,S=null,C=null,D=null,I=null,F=null,Ft.set(0,0,i.canvas.width,i.canvas.height),Kt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:j,disable:vt,bindFramebuffer:At,drawBuffers:Mt,useProgram:Jt,setBlending:ot,setMaterial:it,setFlipSided:tt,setCullFace:Q,setLineWidth:_t,setPolygonOffset:ct,setScissorTest:xt,activeTexture:qt,bindTexture:Wt,unbindTexture:P,compressedTexImage2D:T,compressedTexImage3D:W,texImage2D:Nt,texImage3D:ft,updateUBOMapping:Bt,uniformBlockBinding:yt,texStorage2D:pt,texStorage3D:Pt,texSubImage2D:Z,texSubImage3D:at,compressedTexSubImage2D:$,compressedTexSubImage3D:It,scissor:Tt,viewport:Vt,reset:Yt}}function w_(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new rt,h=new WeakMap;let f;const p=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,T){return u?new OffscreenCanvas(P,T):fr("canvas")}function _(P,T,W){let Z=1;const at=Wt(P);if((at.width>W||at.height>W)&&(Z=W/Math.max(at.width,at.height)),Z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const $=Math.floor(Z*at.width),It=Math.floor(Z*at.height);f===void 0&&(f=m($,It));const pt=T?m($,It):f;return pt.width=$,pt.height=It,pt.getContext("2d").drawImage(P,0,0,$,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+$+"x"+It+")."),pt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),P;return P}function g(P){return P.generateMipmaps}function d(P){i.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(P,T,W,Z,at=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let $=T;if(T===i.RED&&(W===i.FLOAT&&($=i.R32F),W===i.HALF_FLOAT&&($=i.R16F),W===i.UNSIGNED_BYTE&&($=i.R8)),T===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.R8UI),W===i.UNSIGNED_SHORT&&($=i.R16UI),W===i.UNSIGNED_INT&&($=i.R32UI),W===i.BYTE&&($=i.R8I),W===i.SHORT&&($=i.R16I),W===i.INT&&($=i.R32I)),T===i.RG&&(W===i.FLOAT&&($=i.RG32F),W===i.HALF_FLOAT&&($=i.RG16F),W===i.UNSIGNED_BYTE&&($=i.RG8)),T===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.RG8UI),W===i.UNSIGNED_SHORT&&($=i.RG16UI),W===i.UNSIGNED_INT&&($=i.RG32UI),W===i.BYTE&&($=i.RG8I),W===i.SHORT&&($=i.RG16I),W===i.INT&&($=i.RG32I)),T===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.RGB8UI),W===i.UNSIGNED_SHORT&&($=i.RGB16UI),W===i.UNSIGNED_INT&&($=i.RGB32UI),W===i.BYTE&&($=i.RGB8I),W===i.SHORT&&($=i.RGB16I),W===i.INT&&($=i.RGB32I)),T===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.RGBA8UI),W===i.UNSIGNED_SHORT&&($=i.RGBA16UI),W===i.UNSIGNED_INT&&($=i.RGBA32UI),W===i.BYTE&&($=i.RGBA8I),W===i.SHORT&&($=i.RGBA16I),W===i.INT&&($=i.RGBA32I)),T===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),T===i.RGBA){const It=at?wa:le.getTransfer(Z);W===i.FLOAT&&($=i.RGBA32F),W===i.HALF_FLOAT&&($=i.RGBA16F),W===i.UNSIGNED_BYTE&&($=It===ue?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function v(P,T){let W;return P?T===null||T===Wi||T===As?W=i.DEPTH24_STENCIL8:T===In?W=i.DEPTH32F_STENCIL8:T===cr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Wi||T===As?W=i.DEPTH_COMPONENT24:T===In?W=i.DEPTH_COMPONENT32F:T===cr&&(W=i.DEPTH_COMPONENT16),W}function A(P,T){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==Qe&&P.minFilter!==Hn?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function b(P){const T=P.target;T.removeEventListener("dispose",b),E(T),T.isVideoTexture&&h.delete(T)}function w(P){const T=P.target;T.removeEventListener("dispose",w),S(T)}function E(P){const T=n.get(P);if(T.__webglInit===void 0)return;const W=P.source,Z=p.get(W);if(Z){const at=Z[T.__cacheKey];at.usedTimes--,at.usedTimes===0&&M(P),Object.keys(Z).length===0&&p.delete(W)}n.remove(P)}function M(P){const T=n.get(P);i.deleteTexture(T.__webglTexture);const W=P.source,Z=p.get(W);delete Z[T.__cacheKey],a.memory.textures--}function S(P){const T=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(T.__webglFramebuffer[Z]))for(let at=0;at<T.__webglFramebuffer[Z].length;at++)i.deleteFramebuffer(T.__webglFramebuffer[Z][at]);else i.deleteFramebuffer(T.__webglFramebuffer[Z]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[Z])}else{if(Array.isArray(T.__webglFramebuffer))for(let Z=0;Z<T.__webglFramebuffer.length;Z++)i.deleteFramebuffer(T.__webglFramebuffer[Z]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let Z=0;Z<T.__webglColorRenderbuffer.length;Z++)T.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[Z]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const W=P.textures;for(let Z=0,at=W.length;Z<at;Z++){const $=n.get(W[Z]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(W[Z])}n.remove(P)}let C=0;function D(){C=0}function I(){const P=C;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),C+=1,P}function F(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function O(P,T){const W=n.get(P);if(P.isVideoTexture&&xt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&W.__version!==P.version){const Z=P.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(W,P,T);return}}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+T)}function k(P,T){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){J(W,P,T);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+T)}function X(P,T){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){J(W,P,T);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+T)}function H(P,T){const W=n.get(P);if(P.version>0&&W.__version!==P.version){j(W,P,T);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+T)}const K={[Ti]:i.REPEAT,[ki]:i.CLAMP_TO_EDGE,[el]:i.MIRRORED_REPEAT},nt={[Qe]:i.NEAREST,[id]:i.NEAREST_MIPMAP_NEAREST,[wr]:i.NEAREST_MIPMAP_LINEAR,[Hn]:i.LINEAR,[eo]:i.LINEAR_MIPMAP_NEAREST,[Hi]:i.LINEAR_MIPMAP_LINEAR},lt={[od]:i.NEVER,[dd]:i.ALWAYS,[ld]:i.LESS,[Lu]:i.LEQUAL,[cd]:i.EQUAL,[fd]:i.GEQUAL,[hd]:i.GREATER,[ud]:i.NOTEQUAL};function Ct(P,T){if(T.type===In&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Hn||T.magFilter===eo||T.magFilter===wr||T.magFilter===Hi||T.minFilter===Hn||T.minFilter===eo||T.minFilter===wr||T.minFilter===Hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,K[T.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,K[T.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,K[T.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,nt[T.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,nt[T.minFilter]),T.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,lt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Qe||T.minFilter!==wr&&T.minFilter!==Hi||T.type===In&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Ft(P,T){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",b));const Z=T.source;let at=p.get(Z);at===void 0&&(at={},p.set(Z,at));const $=F(T);if($!==P.__cacheKey){at[$]===void 0&&(at[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),at[$].usedTimes++;const It=at[P.__cacheKey];It!==void 0&&(at[P.__cacheKey].usedTimes--,It.usedTimes===0&&M(T)),P.__cacheKey=$,P.__webglTexture=at[$].texture}return W}function Kt(P,T,W){return Math.floor(Math.floor(P/W)/T)}function $t(P,T,W,Z){const $=P.updateRanges;if($.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,T.width,T.height,W,Z,T.data);else{$.sort((ft,Tt)=>ft.start-Tt.start);let It=0;for(let ft=1;ft<$.length;ft++){const Tt=$[It],Vt=$[ft],Bt=Tt.start+Tt.count,yt=Kt(Vt.start,T.width,4),Yt=Kt(Tt.start,T.width,4);Vt.start<=Bt+1&&yt===Yt&&Kt(Vt.start+Vt.count-1,T.width,4)===yt?Tt.count=Math.max(Tt.count,Vt.start+Vt.count-Tt.start):(++It,$[It]=Vt)}$.length=It+1;const pt=i.getParameter(i.UNPACK_ROW_LENGTH),Pt=i.getParameter(i.UNPACK_SKIP_PIXELS),Nt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,T.width);for(let ft=0,Tt=$.length;ft<Tt;ft++){const Vt=$[ft],Bt=Math.floor(Vt.start/4),yt=Math.ceil(Vt.count/4),Yt=Bt%T.width,B=Math.floor(Bt/T.width),ut=yt,gt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Yt),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),e.texSubImage2D(i.TEXTURE_2D,0,Yt,B,ut,gt,W,Z,T.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,pt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Nt)}}function J(P,T,W){let Z=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Z=i.TEXTURE_3D);const at=Ft(P,T),$=T.source;e.bindTexture(Z,P.__webglTexture,i.TEXTURE0+W);const It=n.get($);if($.version!==It.__version||at===!0){e.activeTexture(i.TEXTURE0+W);const pt=le.getPrimaries(le.workingColorSpace),Pt=T.colorSpace===cn?null:le.getPrimaries(T.colorSpace),Nt=T.colorSpace===cn||pt===Pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let ft=_(T.image,!1,s.maxTextureSize);ft=qt(T,ft);const Tt=r.convert(T.format,T.colorSpace),Vt=r.convert(T.type);let Bt=y(T.internalFormat,Tt,Vt,T.colorSpace,T.isVideoTexture);Ct(Z,T);let yt;const Yt=T.mipmaps,B=T.isVideoTexture!==!0,ut=It.__version===void 0||at===!0,gt=$.dataReady,Ut=A(T,ft);if(T.isDepthTexture)Bt=v(T.format===Rs,T.type),ut&&(B?e.texStorage2D(i.TEXTURE_2D,1,Bt,ft.width,ft.height):e.texImage2D(i.TEXTURE_2D,0,Bt,ft.width,ft.height,0,Tt,Vt,null));else if(T.isDataTexture)if(Yt.length>0){B&&ut&&e.texStorage2D(i.TEXTURE_2D,Ut,Bt,Yt[0].width,Yt[0].height);for(let dt=0,st=Yt.length;dt<st;dt++)yt=Yt[dt],B?gt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,yt.width,yt.height,Tt,Vt,yt.data):e.texImage2D(i.TEXTURE_2D,dt,Bt,yt.width,yt.height,0,Tt,Vt,yt.data);T.generateMipmaps=!1}else B?(ut&&e.texStorage2D(i.TEXTURE_2D,Ut,Bt,ft.width,ft.height),gt&&$t(T,ft,Tt,Vt)):e.texImage2D(i.TEXTURE_2D,0,Bt,ft.width,ft.height,0,Tt,Vt,ft.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){B&&ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ut,Bt,Yt[0].width,Yt[0].height,ft.depth);for(let dt=0,st=Yt.length;dt<st;dt++)if(yt=Yt[dt],T.format!==Ln)if(Tt!==null)if(B){if(gt)if(T.layerUpdates.size>0){const zt=xh(yt.width,yt.height,T.format,T.type);for(const jt of T.layerUpdates){const xe=yt.data.subarray(jt*zt/yt.data.BYTES_PER_ELEMENT,(jt+1)*zt/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,jt,yt.width,yt.height,1,Tt,xe)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,yt.width,yt.height,ft.depth,Tt,yt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,Bt,yt.width,yt.height,ft.depth,0,yt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?gt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,yt.width,yt.height,ft.depth,Tt,Vt,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,Bt,yt.width,yt.height,ft.depth,0,Tt,Vt,yt.data)}else{B&&ut&&e.texStorage2D(i.TEXTURE_2D,Ut,Bt,Yt[0].width,Yt[0].height);for(let dt=0,st=Yt.length;dt<st;dt++)yt=Yt[dt],T.format!==Ln?Tt!==null?B?gt&&e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,yt.width,yt.height,Tt,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,Bt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?gt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,yt.width,yt.height,Tt,Vt,yt.data):e.texImage2D(i.TEXTURE_2D,dt,Bt,yt.width,yt.height,0,Tt,Vt,yt.data)}else if(T.isDataArrayTexture)if(B){if(ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ut,Bt,ft.width,ft.height,ft.depth),gt)if(T.layerUpdates.size>0){const dt=xh(ft.width,ft.height,T.format,T.type);for(const st of T.layerUpdates){const zt=ft.data.subarray(st*dt/ft.data.BYTES_PER_ELEMENT,(st+1)*dt/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,st,ft.width,ft.height,1,Tt,Vt,zt)}T.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,Tt,Vt,ft.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Bt,ft.width,ft.height,ft.depth,0,Tt,Vt,ft.data);else if(T.isData3DTexture)B?(ut&&e.texStorage3D(i.TEXTURE_3D,Ut,Bt,ft.width,ft.height,ft.depth),gt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,Tt,Vt,ft.data)):e.texImage3D(i.TEXTURE_3D,0,Bt,ft.width,ft.height,ft.depth,0,Tt,Vt,ft.data);else if(T.isFramebufferTexture){if(ut)if(B)e.texStorage2D(i.TEXTURE_2D,Ut,Bt,ft.width,ft.height);else{let dt=ft.width,st=ft.height;for(let zt=0;zt<Ut;zt++)e.texImage2D(i.TEXTURE_2D,zt,Bt,dt,st,0,Tt,Vt,null),dt>>=1,st>>=1}}else if(Yt.length>0){if(B&&ut){const dt=Wt(Yt[0]);e.texStorage2D(i.TEXTURE_2D,Ut,Bt,dt.width,dt.height)}for(let dt=0,st=Yt.length;dt<st;dt++)yt=Yt[dt],B?gt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,Tt,Vt,yt):e.texImage2D(i.TEXTURE_2D,dt,Bt,Tt,Vt,yt);T.generateMipmaps=!1}else if(B){if(ut){const dt=Wt(ft);e.texStorage2D(i.TEXTURE_2D,Ut,Bt,dt.width,dt.height)}gt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Tt,Vt,ft)}else e.texImage2D(i.TEXTURE_2D,0,Bt,Tt,Vt,ft);g(T)&&d(Z),It.__version=$.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function j(P,T,W){if(T.image.length!==6)return;const Z=Ft(P,T),at=T.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+W);const $=n.get(at);if(at.version!==$.__version||Z===!0){e.activeTexture(i.TEXTURE0+W);const It=le.getPrimaries(le.workingColorSpace),pt=T.colorSpace===cn?null:le.getPrimaries(T.colorSpace),Pt=T.colorSpace===cn||It===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Nt=T.isCompressedTexture||T.image[0].isCompressedTexture,ft=T.image[0]&&T.image[0].isDataTexture,Tt=[];for(let st=0;st<6;st++)!Nt&&!ft?Tt[st]=_(T.image[st],!0,s.maxCubemapSize):Tt[st]=ft?T.image[st].image:T.image[st],Tt[st]=qt(T,Tt[st]);const Vt=Tt[0],Bt=r.convert(T.format,T.colorSpace),yt=r.convert(T.type),Yt=y(T.internalFormat,Bt,yt,T.colorSpace),B=T.isVideoTexture!==!0,ut=$.__version===void 0||Z===!0,gt=at.dataReady;let Ut=A(T,Vt);Ct(i.TEXTURE_CUBE_MAP,T);let dt;if(Nt){B&&ut&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ut,Yt,Vt.width,Vt.height);for(let st=0;st<6;st++){dt=Tt[st].mipmaps;for(let zt=0;zt<dt.length;zt++){const jt=dt[zt];T.format!==Ln?Bt!==null?B?gt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,0,0,jt.width,jt.height,Bt,jt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,Yt,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?gt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,0,0,jt.width,jt.height,Bt,yt,jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,Yt,jt.width,jt.height,0,Bt,yt,jt.data)}}}else{if(dt=T.mipmaps,B&&ut){dt.length>0&&Ut++;const st=Wt(Tt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ut,Yt,st.width,st.height)}for(let st=0;st<6;st++)if(ft){B?gt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Tt[st].width,Tt[st].height,Bt,yt,Tt[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Yt,Tt[st].width,Tt[st].height,0,Bt,yt,Tt[st].data);for(let zt=0;zt<dt.length;zt++){const xe=dt[zt].image[st].image;B?gt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,0,0,xe.width,xe.height,Bt,yt,xe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,Yt,xe.width,xe.height,0,Bt,yt,xe.data)}}else{B?gt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Bt,yt,Tt[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Yt,Bt,yt,Tt[st]);for(let zt=0;zt<dt.length;zt++){const jt=dt[zt];B?gt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,0,0,Bt,yt,jt.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,Yt,Bt,yt,jt.image[st])}}}g(T)&&d(i.TEXTURE_CUBE_MAP),$.__version=at.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function vt(P,T,W,Z,at,$){const It=r.convert(W.format,W.colorSpace),pt=r.convert(W.type),Pt=y(W.internalFormat,It,pt,W.colorSpace),Nt=n.get(T),ft=n.get(W);if(ft.__renderTarget=T,!Nt.__hasExternalTextures){const Tt=Math.max(1,T.width>>$),Vt=Math.max(1,T.height>>$);at===i.TEXTURE_3D||at===i.TEXTURE_2D_ARRAY?e.texImage3D(at,$,Pt,Tt,Vt,T.depth,0,It,pt,null):e.texImage2D(at,$,Pt,Tt,Vt,0,It,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),ct(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,at,ft.__webglTexture,0,_t(T)):(at===i.TEXTURE_2D||at>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,at,ft.__webglTexture,$),e.bindFramebuffer(i.FRAMEBUFFER,null)}function At(P,T,W){if(i.bindRenderbuffer(i.RENDERBUFFER,P),T.depthBuffer){const Z=T.depthTexture,at=Z&&Z.isDepthTexture?Z.type:null,$=v(T.stencilBuffer,at),It=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=_t(T);ct(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt,$,T.width,T.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt,$,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,$,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,It,i.RENDERBUFFER,P)}else{const Z=T.textures;for(let at=0;at<Z.length;at++){const $=Z[at],It=r.convert($.format,$.colorSpace),pt=r.convert($.type),Pt=y($.internalFormat,It,pt,$.colorSpace),Nt=_t(T);W&&ct(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Pt,T.width,T.height):ct(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,Pt,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,Pt,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Mt(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(T.depthTexture);Z.__renderTarget=T,(!Z.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),O(T.depthTexture,0);const at=Z.__webglTexture,$=_t(T);if(T.depthTexture.format===hr)ct(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(T.depthTexture.format===Rs)ct(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function Jt(P){const T=n.get(P),W=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const Z=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),Z){const at=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,Z.removeEventListener("dispose",at)};Z.addEventListener("dispose",at),T.__depthDisposeCallback=at}T.__boundDepthTexture=Z}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const Z=P.texture.mipmaps;Z&&Z.length>0?Mt(T.__webglFramebuffer[0],P):Mt(T.__webglFramebuffer,P)}else if(W){T.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[Z]),T.__webglDepthbuffer[Z]===void 0)T.__webglDepthbuffer[Z]=i.createRenderbuffer(),At(T.__webglDepthbuffer[Z],P,!1);else{const at=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=T.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,$)}}else{const Z=P.texture.mipmaps;if(Z&&Z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),At(T.__webglDepthbuffer,P,!1);else{const at=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,$)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Qt(P,T,W){const Z=n.get(P);T!==void 0&&vt(Z.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Jt(P)}function N(P){const T=P.texture,W=n.get(P),Z=n.get(T);P.addEventListener("dispose",w);const at=P.textures,$=P.isWebGLCubeRenderTarget===!0,It=at.length>1;if(It||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=T.version,a.memory.textures++),$){W.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[pt]=[];for(let Pt=0;Pt<T.mipmaps.length;Pt++)W.__webglFramebuffer[pt][Pt]=i.createFramebuffer()}else W.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let pt=0;pt<T.mipmaps.length;pt++)W.__webglFramebuffer[pt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(It)for(let pt=0,Pt=at.length;pt<Pt;pt++){const Nt=n.get(at[pt]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=i.createTexture(),a.memory.textures++)}if(P.samples>0&&ct(P)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let pt=0;pt<at.length;pt++){const Pt=at[pt];W.__webglColorRenderbuffer[pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[pt]);const Nt=r.convert(Pt.format,Pt.colorSpace),ft=r.convert(Pt.type),Tt=y(Pt.internalFormat,Nt,ft,Pt.colorSpace,P.isXRRenderTarget===!0),Vt=_t(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Tt,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,W.__webglColorRenderbuffer[pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),At(W.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Ct(i.TEXTURE_CUBE_MAP,T);for(let pt=0;pt<6;pt++)if(T.mipmaps&&T.mipmaps.length>0)for(let Pt=0;Pt<T.mipmaps.length;Pt++)vt(W.__webglFramebuffer[pt][Pt],P,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Pt);else vt(W.__webglFramebuffer[pt],P,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);g(T)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let pt=0,Pt=at.length;pt<Pt;pt++){const Nt=at[pt],ft=n.get(Nt);let Tt=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Tt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Tt,ft.__webglTexture),Ct(Tt,Nt),vt(W.__webglFramebuffer,P,Nt,i.COLOR_ATTACHMENT0+pt,Tt,0),g(Nt)&&d(Tt)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(pt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,Z.__webglTexture),Ct(pt,T),T.mipmaps&&T.mipmaps.length>0)for(let Pt=0;Pt<T.mipmaps.length;Pt++)vt(W.__webglFramebuffer[Pt],P,T,i.COLOR_ATTACHMENT0,pt,Pt);else vt(W.__webglFramebuffer,P,T,i.COLOR_ATTACHMENT0,pt,0);g(T)&&d(pt),e.unbindTexture()}P.depthBuffer&&Jt(P)}function ot(P){const T=P.textures;for(let W=0,Z=T.length;W<Z;W++){const at=T[W];if(g(at)){const $=x(P),It=n.get(at).__webglTexture;e.bindTexture($,It),d($),e.unbindTexture()}}}const it=[],tt=[];function Q(P){if(P.samples>0){if(ct(P)===!1){const T=P.textures,W=P.width,Z=P.height;let at=i.COLOR_BUFFER_BIT;const $=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,It=n.get(P),pt=T.length>1;if(pt)for(let Nt=0;Nt<T.length;Nt++)e.bindFramebuffer(i.FRAMEBUFFER,It.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,It.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer);const Pt=P.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let Nt=0;Nt<T.length;Nt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(at|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(at|=i.STENCIL_BUFFER_BIT)),pt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,It.__webglColorRenderbuffer[Nt]);const ft=n.get(T[Nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ft,0)}i.blitFramebuffer(0,0,W,Z,0,0,W,Z,at,i.NEAREST),l===!0&&(it.length=0,tt.length=0,it.push(i.COLOR_ATTACHMENT0+Nt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(it.push($),tt.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pt)for(let Nt=0;Nt<T.length;Nt++){e.bindFramebuffer(i.FRAMEBUFFER,It.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,It.__webglColorRenderbuffer[Nt]);const ft=n.get(T[Nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,It.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function _t(P){return Math.min(s.maxSamples,P.samples)}function ct(P){const T=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function xt(P){const T=a.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function qt(P,T){const W=P.colorSpace,Z=P.format,at=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==Cs&&W!==cn&&(le.getTransfer(W)===ue?(Z!==Ln||at!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),T}function Wt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=D,this.setTexture2D=O,this.setTexture2DArray=k,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=Qt,this.setupRenderTarget=N,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=Q,this.setupDepthRenderbuffer=Jt,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=ct}function A_(i,t){function e(n,s=cn){let r;const a=le.getTransfer(s);if(n===Xn)return i.UNSIGNED_BYTE;if(n===nc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ic)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Au)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ru)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Eu)return i.BYTE;if(n===wu)return i.SHORT;if(n===cr)return i.UNSIGNED_SHORT;if(n===ec)return i.INT;if(n===Wi)return i.UNSIGNED_INT;if(n===In)return i.FLOAT;if(n===qn)return i.HALF_FLOAT;if(n===Cu)return i.ALPHA;if(n===Pu)return i.RGB;if(n===Ln)return i.RGBA;if(n===hr)return i.DEPTH_COMPONENT;if(n===Rs)return i.DEPTH_STENCIL;if(n===ka)return i.RED;if(n===sc)return i.RED_INTEGER;if(n===Iu)return i.RG;if(n===rc)return i.RG_INTEGER;if(n===ac)return i.RGBA_INTEGER;if(n===ga||n===_a||n===xa||n===va)if(a===ue)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ga)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ga)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===va)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===nl||n===il||n===sl||n===rl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===nl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===il)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===sl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===rl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===al||n===ol||n===ll)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===al||n===ol)return a===ue?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ll)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===cl||n===hl||n===ul||n===fl||n===dl||n===pl||n===ml||n===gl||n===_l||n===xl||n===vl||n===yl||n===Ml||n===Sl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===cl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===hl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ul)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===dl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===pl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ml)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===gl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_l)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ml)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Sl)return a===ue?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===bl||n===Tl||n===El)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===bl)return a===ue?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Tl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===El)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wl||n===Al||n===Rl||n===Cl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===wl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Al)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Cl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===As?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const R_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class P_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Wu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new je({vertexShader:R_,fragmentShader:C_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ye(new re(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class I_ extends Us{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,p=null,u=null,m=null;const _=typeof XRWebGLBinding<"u",g=new P_,d={},x=e.getContextAttributes();let y=null,v=null;const A=[],b=[],w=new rt;let E=null;const M=new Xe;M.viewport=new me;const S=new Xe;S.viewport=new me;const C=[M,S],D=new Jp;let I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let j=A[J];return j===void 0&&(j=new bo,A[J]=j),j.getTargetRaySpace()},this.getControllerGrip=function(J){let j=A[J];return j===void 0&&(j=new bo,A[J]=j),j.getGripSpace()},this.getHand=function(J){let j=A[J];return j===void 0&&(j=new bo,A[J]=j),j.getHandSpace()};function O(J){const j=b.indexOf(J.inputSource);if(j===-1)return;const vt=A[j];vt!==void 0&&(vt.update(J.inputSource,J.frame,c||a),vt.dispatchEvent({type:J.type,data:J.inputSource}))}function k(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",X);for(let J=0;J<A.length;J++){const j=b[J];j!==null&&(b[J]=null,A[J].disconnect(j))}I=null,F=null,g.reset();for(const J in d)delete d[J];t.setRenderTarget(y),u=null,p=null,f=null,s=null,v=null,$t.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(y=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",k),s.addEventListener("inputsourceschange",X),x.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(w),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,At=null,Mt=null;x.depth&&(Mt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=x.stencil?Rs:hr,At=x.stencil?As:Wi);const Jt={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:r};f=this.getBinding(),p=f.createProjectionLayer(Jt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),v=new un(p.textureWidth,p.textureHeight,{format:Ln,type:Xn,depthTexture:new dc(p.textureWidth,p.textureHeight,At,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const vt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,vt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),v=new un(u.framebufferWidth,u.framebufferHeight,{format:Ln,type:Xn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),$t.setContext(s),$t.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(J){for(let j=0;j<J.removed.length;j++){const vt=J.removed[j],At=b.indexOf(vt);At>=0&&(b[At]=null,A[At].disconnect(vt))}for(let j=0;j<J.added.length;j++){const vt=J.added[j];let At=b.indexOf(vt);if(At===-1){for(let Jt=0;Jt<A.length;Jt++)if(Jt>=b.length){b.push(vt),At=Jt;break}else if(b[Jt]===null){b[Jt]=vt,At=Jt;break}if(At===-1)break}const Mt=A[At];Mt&&Mt.connect(vt)}}const H=new U,K=new U;function nt(J,j,vt){H.setFromMatrixPosition(j.matrixWorld),K.setFromMatrixPosition(vt.matrixWorld);const At=H.distanceTo(K),Mt=j.projectionMatrix.elements,Jt=vt.projectionMatrix.elements,Qt=Mt[14]/(Mt[10]-1),N=Mt[14]/(Mt[10]+1),ot=(Mt[9]+1)/Mt[5],it=(Mt[9]-1)/Mt[5],tt=(Mt[8]-1)/Mt[0],Q=(Jt[8]+1)/Jt[0],_t=Qt*tt,ct=Qt*Q,xt=At/(-tt+Q),qt=xt*-tt;if(j.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(qt),J.translateZ(xt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Mt[10]===-1)J.projectionMatrix.copy(j.projectionMatrix),J.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const Wt=Qt+xt,P=N+xt,T=_t-qt,W=ct+(At-qt),Z=ot*N/P*Wt,at=it*N/P*Wt;J.projectionMatrix.makePerspective(T,W,Z,at,Wt,P),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function lt(J,j){j===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(j.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let j=J.near,vt=J.far;g.texture!==null&&(g.depthNear>0&&(j=g.depthNear),g.depthFar>0&&(vt=g.depthFar)),D.near=S.near=M.near=j,D.far=S.far=M.far=vt,(I!==D.near||F!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),I=D.near,F=D.far),D.layers.mask=J.layers.mask|6,M.layers.mask=D.layers.mask&3,S.layers.mask=D.layers.mask&5;const At=J.parent,Mt=D.cameras;lt(D,At);for(let Jt=0;Jt<Mt.length;Jt++)lt(Mt[Jt],At);Mt.length===2?nt(D,M,S):D.projectionMatrix.copy(M.projectionMatrix),Ct(J,D,At)};function Ct(J,j,vt){vt===null?J.matrix.copy(j.matrixWorld):(J.matrix.copy(vt.matrixWorld),J.matrix.invert(),J.matrix.multiply(j.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(j.projectionMatrix),J.projectionMatrixInverse.copy(j.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=ur*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(p===null&&u===null))return l},this.setFoveation=function(J){l=J,p!==null&&(p.fixedFoveation=J),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(J){return d[J]};let Ft=null;function Kt(J,j){if(h=j.getViewerPose(c||a),m=j,h!==null){const vt=h.views;u!==null&&(t.setRenderTargetFramebuffer(v,u.framebuffer),t.setRenderTarget(v));let At=!1;vt.length!==D.cameras.length&&(D.cameras.length=0,At=!0);for(let N=0;N<vt.length;N++){const ot=vt[N];let it=null;if(u!==null)it=u.getViewport(ot);else{const Q=f.getViewSubImage(p,ot);it=Q.viewport,N===0&&(t.setRenderTargetTextures(v,Q.colorTexture,Q.depthStencilTexture),t.setRenderTarget(v))}let tt=C[N];tt===void 0&&(tt=new Xe,tt.layers.enable(N),tt.viewport=new me,C[N]=tt),tt.matrix.fromArray(ot.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(ot.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(it.x,it.y,it.width,it.height),N===0&&(D.matrix.copy(tt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),At===!0&&D.cameras.push(tt)}const Mt=s.enabledFeatures;if(Mt&&Mt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=n.getBinding();const N=f.getDepthInformation(vt[0]);N&&N.isValid&&N.texture&&g.init(N,s.renderState)}if(Mt&&Mt.includes("camera-access")&&_){t.state.unbindTexture(),f=n.getBinding();for(let N=0;N<vt.length;N++){const ot=vt[N].camera;if(ot){let it=d[ot];it||(it=new Wu,d[ot]=it);const tt=f.getCameraImage(ot);it.sourceTexture=tt}}}}for(let vt=0;vt<A.length;vt++){const At=b[vt],Mt=A[vt];At!==null&&Mt!==void 0&&Mt.update(At,j,c||a)}Ft&&Ft(J,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),m=null}const $t=new nf;$t.setAnimationLoop(Kt),this.setAnimationLoop=function(J){Ft=J},this.dispose=function(){}}}const Ni=new Sn,L_=new ae;function D_(i,t){function e(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function n(g,d){d.color.getRGB(g.fogColor.value,zu(i)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function s(g,d,x,y,v){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(g,d):d.isMeshToonMaterial?(r(g,d),f(g,d)):d.isMeshPhongMaterial?(r(g,d),h(g,d)):d.isMeshStandardMaterial?(r(g,d),p(g,d),d.isMeshPhysicalMaterial&&u(g,d,v)):d.isMeshMatcapMaterial?(r(g,d),m(g,d)):d.isMeshDepthMaterial?r(g,d):d.isMeshDistanceMaterial?(r(g,d),_(g,d)):d.isMeshNormalMaterial?r(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?l(g,d,x,y):d.isSpriteMaterial?c(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,e(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,e(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===qe&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,e(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===qe&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,e(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,e(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const x=t.get(d),y=x.envMap,v=x.envMapRotation;y&&(g.envMap.value=y,Ni.copy(v),Ni.x*=-1,Ni.y*=-1,Ni.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ni.y*=-1,Ni.z*=-1),g.envMapRotation.value.setFromMatrix4(L_.makeRotationFromEuler(Ni)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,e(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,x,y){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*x,g.scale.value=y*.5,d.map&&(g.map.value=d.map,e(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function c(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,e(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function h(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function f(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function p(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function u(g,d,x){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===qe&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,d){d.matcap&&(g.matcap.value=d.matcap)}function _(g,d){const x=t.get(d).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function U_(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const v=y.program;n.uniformBlockBinding(x,v)}function c(x,y){let v=s[x.id];v===void 0&&(m(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",g));const A=y.program;n.updateUBOMapping(x,A);const b=t.render.frame;r[x.id]!==b&&(p(x),r[x.id]=b)}function h(x){const y=f();x.__bindingPointIndex=y;const v=i.createBuffer(),A=x.__size,b=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,A,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,v),v}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const y=s[x.id],v=x.uniforms,A=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let b=0,w=v.length;b<w;b++){const E=Array.isArray(v[b])?v[b]:[v[b]];for(let M=0,S=E.length;M<S;M++){const C=E[M];if(u(C,b,M,A)===!0){const D=C.__offset,I=Array.isArray(C.value)?C.value:[C.value];let F=0;for(let O=0;O<I.length;O++){const k=I[O],X=_(k);typeof k=="number"||typeof k=="boolean"?(C.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,D+F,C.__data)):k.isMatrix3?(C.__data[0]=k.elements[0],C.__data[1]=k.elements[1],C.__data[2]=k.elements[2],C.__data[3]=0,C.__data[4]=k.elements[3],C.__data[5]=k.elements[4],C.__data[6]=k.elements[5],C.__data[7]=0,C.__data[8]=k.elements[6],C.__data[9]=k.elements[7],C.__data[10]=k.elements[8],C.__data[11]=0):(k.toArray(C.__data,F),F+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,y,v,A){const b=x.value,w=y+"_"+v;if(A[w]===void 0)return typeof b=="number"||typeof b=="boolean"?A[w]=b:A[w]=b.clone(),!0;{const E=A[w];if(typeof b=="number"||typeof b=="boolean"){if(E!==b)return A[w]=b,!0}else if(E.equals(b)===!1)return E.copy(b),!0}return!1}function m(x){const y=x.uniforms;let v=0;const A=16;for(let w=0,E=y.length;w<E;w++){const M=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,C=M.length;S<C;S++){const D=M[S],I=Array.isArray(D.value)?D.value:[D.value];for(let F=0,O=I.length;F<O;F++){const k=I[F],X=_(k),H=v%A,K=H%X.boundary,nt=H+K;v+=K,nt!==0&&A-nt<X.storage&&(v+=A-nt),D.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=v,v+=X.storage}}}const b=v%A;return b>0&&(v+=A-b),x.__size=v,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const v=a.indexOf(y.__bindingPointIndex);a.splice(v,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class N_{constructor(t={}){const{canvas:e=Pd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,d=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let A=!1;this._outputColorSpace=Be;let b=0,w=0,E=null,M=-1,S=null;const C=new me,D=new me;let I=null;const F=new kt(0);let O=0,k=e.width,X=e.height,H=1,K=null,nt=null;const lt=new me(0,0,k,X),Ct=new me(0,0,k,X);let Ft=!1;const Kt=new fc;let $t=!1,J=!1;const j=new ae,vt=new U,At=new me,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Jt=!1;function Qt(){return E===null?H:1}let N=n;function ot(R,G){return e.getContext(R,G)}try{const R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${jl}`),e.addEventListener("webglcontextlost",gt,!1),e.addEventListener("webglcontextrestored",Ut,!1),e.addEventListener("webglcontextcreationerror",dt,!1),N===null){const G="webgl2";if(N=ot(G,R),N===null)throw ot(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let it,tt,Q,_t,ct,xt,qt,Wt,P,T,W,Z,at,$,It,pt,Pt,Nt,ft,Tt,Vt,Bt,yt,Yt;function B(){it=new X1(N),it.init(),Bt=new A_(N,it),tt=new z1(N,it,t,Bt),Q=new E_(N,it),tt.reversedDepthBuffer&&p&&Q.buffers.depth.setReversed(!0),_t=new Z1(N),ct=new f_,xt=new w_(N,it,Q,ct,tt,Bt,_t),qt=new k1(v),Wt=new W1(v),P=new t0(N),yt=new F1(N,P),T=new q1(N,P,_t,yt),W=new J1(N,T,P,_t),ft=new $1(N,tt,xt),pt=new B1(ct),Z=new u_(v,qt,Wt,it,tt,yt,pt),at=new D_(v,ct),$=new p_,It=new y_(it),Nt=new N1(v,qt,Wt,Q,W,u,l),Pt=new b_(v,W,tt),Yt=new U_(N,_t,tt,Q),Tt=new O1(N,it,_t),Vt=new Y1(N,it,_t),_t.programs=Z.programs,v.capabilities=tt,v.extensions=it,v.properties=ct,v.renderLists=$,v.shadowMap=Pt,v.state=Q,v.info=_t}B();const ut=new I_(v,N);this.xr=ut,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const R=it.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=it.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(R){R!==void 0&&(H=R,this.setSize(k,X,!1))},this.getSize=function(R){return R.set(k,X)},this.setSize=function(R,G,q=!0){if(ut.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=R,X=G,e.width=Math.floor(R*H),e.height=Math.floor(G*H),q===!0&&(e.style.width=R+"px",e.style.height=G+"px"),this.setViewport(0,0,R,G)},this.getDrawingBufferSize=function(R){return R.set(k*H,X*H).floor()},this.setDrawingBufferSize=function(R,G,q){k=R,X=G,H=q,e.width=Math.floor(R*q),e.height=Math.floor(G*q),this.setViewport(0,0,R,G)},this.getCurrentViewport=function(R){return R.copy(C)},this.getViewport=function(R){return R.copy(lt)},this.setViewport=function(R,G,q,Y){R.isVector4?lt.set(R.x,R.y,R.z,R.w):lt.set(R,G,q,Y),Q.viewport(C.copy(lt).multiplyScalar(H).round())},this.getScissor=function(R){return R.copy(Ct)},this.setScissor=function(R,G,q,Y){R.isVector4?Ct.set(R.x,R.y,R.z,R.w):Ct.set(R,G,q,Y),Q.scissor(D.copy(Ct).multiplyScalar(H).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(R){Q.setScissorTest(Ft=R)},this.setOpaqueSort=function(R){K=R},this.setTransparentSort=function(R){nt=R},this.getClearColor=function(R){return R.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor(...arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha(...arguments)},this.clear=function(R=!0,G=!0,q=!0){let Y=0;if(R){let V=!1;if(E!==null){const mt=E.texture.format;V=mt===ac||mt===rc||mt===sc}if(V){const mt=E.texture.type,Et=mt===Xn||mt===Wi||mt===cr||mt===As||mt===nc||mt===ic,Ot=Nt.getClearColor(),Lt=Nt.getClearAlpha(),Xt=Ot.r,Zt=Ot.g,Ht=Ot.b;Et?(m[0]=Xt,m[1]=Zt,m[2]=Ht,m[3]=Lt,N.clearBufferuiv(N.COLOR,0,m)):(_[0]=Xt,_[1]=Zt,_[2]=Ht,_[3]=Lt,N.clearBufferiv(N.COLOR,0,_))}else Y|=N.COLOR_BUFFER_BIT}G&&(Y|=N.DEPTH_BUFFER_BIT),q&&(Y|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",gt,!1),e.removeEventListener("webglcontextrestored",Ut,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),Nt.dispose(),$.dispose(),It.dispose(),ct.dispose(),qt.dispose(),Wt.dispose(),W.dispose(),yt.dispose(),Yt.dispose(),Z.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",Fn),ut.removeEventListener("sessionend",Ec),Ri.stop()};function gt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Ut(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const R=_t.autoReset,G=Pt.enabled,q=Pt.autoUpdate,Y=Pt.needsUpdate,V=Pt.type;B(),_t.autoReset=R,Pt.enabled=G,Pt.autoUpdate=q,Pt.needsUpdate=Y,Pt.type=V}function dt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function st(R){const G=R.target;G.removeEventListener("dispose",st),zt(G)}function zt(R){jt(R),ct.remove(R)}function jt(R){const G=ct.get(R).programs;G!==void 0&&(G.forEach(function(q){Z.releaseProgram(q)}),R.isShaderMaterial&&Z.releaseShaderCache(R))}this.renderBufferDirect=function(R,G,q,Y,V,mt){G===null&&(G=Mt);const Et=V.isMesh&&V.matrixWorld.determinant()<0,Ot=Df(R,G,q,Y,V);Q.setMaterial(Y,Et);let Lt=q.index,Xt=1;if(Y.wireframe===!0){if(Lt=T.getWireframeAttribute(q),Lt===void 0)return;Xt=2}const Zt=q.drawRange,Ht=q.attributes.position;let se=Zt.start*Xt,de=(Zt.start+Zt.count)*Xt;mt!==null&&(se=Math.max(se,mt.start*Xt),de=Math.min(de,(mt.start+mt.count)*Xt)),Lt!==null?(se=Math.max(se,0),de=Math.min(de,Lt.count)):Ht!=null&&(se=Math.max(se,0),de=Math.min(de,Ht.count));const Ae=de-se;if(Ae<0||Ae===1/0)return;yt.setup(V,Y,Ot,q,Lt);let Me,ge=Tt;if(Lt!==null&&(Me=P.get(Lt),ge=Vt,ge.setIndex(Me)),V.isMesh)Y.wireframe===!0?(Q.setLineWidth(Y.wireframeLinewidth*Qt()),ge.setMode(N.LINES)):ge.setMode(N.TRIANGLES);else if(V.isLine){let Gt=Y.linewidth;Gt===void 0&&(Gt=1),Q.setLineWidth(Gt*Qt()),V.isLineSegments?ge.setMode(N.LINES):V.isLineLoop?ge.setMode(N.LINE_LOOP):ge.setMode(N.LINE_STRIP)}else V.isPoints?ge.setMode(N.POINTS):V.isSprite&&ge.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)dr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ge.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(it.get("WEBGL_multi_draw"))ge.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Gt=V._multiDrawStarts,be=V._multiDrawCounts,ce=V._multiDrawCount,sn=Lt?P.get(Lt).bytesPerElement:1,Ki=ct.get(Y).currentProgram.getUniforms();for(let rn=0;rn<ce;rn++)Ki.setValue(N,"_gl_DrawID",rn),ge.render(Gt[rn]/sn,be[rn])}else if(V.isInstancedMesh)ge.renderInstances(se,Ae,V.count);else if(q.isInstancedBufferGeometry){const Gt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,be=Math.min(q.instanceCount,Gt);ge.renderInstances(se,Ae,be)}else ge.render(se,Ae)};function xe(R,G,q){R.transparent===!0&&R.side===Ie&&R.forceSinglePass===!1?(R.side=qe,R.needsUpdate=!0,Er(R,G,q),R.side=bi,R.needsUpdate=!0,Er(R,G,q),R.side=Ie):Er(R,G,q)}this.compile=function(R,G,q=null){q===null&&(q=R),d=It.get(q),d.init(G),y.push(d),q.traverseVisible(function(V){V.isLight&&V.layers.test(G.layers)&&(d.pushLight(V),V.castShadow&&d.pushShadow(V))}),R!==q&&R.traverseVisible(function(V){V.isLight&&V.layers.test(G.layers)&&(d.pushLight(V),V.castShadow&&d.pushShadow(V))}),d.setupLights();const Y=new Set;return R.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const mt=V.material;if(mt)if(Array.isArray(mt))for(let Et=0;Et<mt.length;Et++){const Ot=mt[Et];xe(Ot,q,V),Y.add(Ot)}else xe(mt,q,V),Y.add(mt)}),d=y.pop(),Y},this.compileAsync=function(R,G,q=null){const Y=this.compile(R,G,q);return new Promise(V=>{function mt(){if(Y.forEach(function(Et){ct.get(Et).currentProgram.isReady()&&Y.delete(Et)}),Y.size===0){V(R);return}setTimeout(mt,10)}it.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let he=null;function Kn(R){he&&he(R)}function Fn(){Ri.stop()}function Ec(){Ri.start()}const Ri=new nf;Ri.setAnimationLoop(Kn),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(R){he=R,ut.setAnimationLoop(R),R===null?Ri.stop():Ri.start()},ut.addEventListener("sessionstart",Fn),ut.addEventListener("sessionend",Ec),this.render=function(R,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(G),G=ut.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,G,E),d=It.get(R,y.length),d.init(G),y.push(d),j.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Kt.setFromProjectionMatrix(j,Gn,G.reversedDepth),J=this.localClippingEnabled,$t=pt.init(this.clippingPlanes,J),g=$.get(R,x.length),g.init(),x.push(g),ut.enabled===!0&&ut.isPresenting===!0){const mt=v.xr.getDepthSensingMesh();mt!==null&&Qa(mt,G,-1/0,v.sortObjects)}Qa(R,G,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(K,nt),Jt=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,Jt&&Nt.addToRenderList(g,R),this.info.render.frame++,$t===!0&&pt.beginShadows();const q=d.state.shadowsArray;Pt.render(q,R,G),$t===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=g.opaque,V=g.transmissive;if(d.setupLights(),G.isArrayCamera){const mt=G.cameras;if(V.length>0)for(let Et=0,Ot=mt.length;Et<Ot;Et++){const Lt=mt[Et];Ac(Y,V,R,Lt)}Jt&&Nt.render(R);for(let Et=0,Ot=mt.length;Et<Ot;Et++){const Lt=mt[Et];wc(g,R,Lt,Lt.viewport)}}else V.length>0&&Ac(Y,V,R,G),Jt&&Nt.render(R),wc(g,R,G);E!==null&&w===0&&(xt.updateMultisampleRenderTarget(E),xt.updateRenderTargetMipmap(E)),R.isScene===!0&&R.onAfterRender(v,R,G),yt.resetDefaultState(),M=-1,S=null,y.pop(),y.length>0?(d=y[y.length-1],$t===!0&&pt.setGlobalState(v.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function Qa(R,G,q,Y){if(R.visible===!1)return;if(R.layers.test(G.layers)){if(R.isGroup)q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(G);else if(R.isLight)d.pushLight(R),R.castShadow&&d.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Kt.intersectsSprite(R)){Y&&At.setFromMatrixPosition(R.matrixWorld).applyMatrix4(j);const Et=W.update(R),Ot=R.material;Ot.visible&&g.push(R,Et,Ot,q,At.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Kt.intersectsObject(R))){const Et=W.update(R),Ot=R.material;if(Y&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),At.copy(R.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),At.copy(Et.boundingSphere.center)),At.applyMatrix4(R.matrixWorld).applyMatrix4(j)),Array.isArray(Ot)){const Lt=Et.groups;for(let Xt=0,Zt=Lt.length;Xt<Zt;Xt++){const Ht=Lt[Xt],se=Ot[Ht.materialIndex];se&&se.visible&&g.push(R,Et,se,q,At.z,Ht)}}else Ot.visible&&g.push(R,Et,Ot,q,At.z,null)}}const mt=R.children;for(let Et=0,Ot=mt.length;Et<Ot;Et++)Qa(mt[Et],G,q,Y)}function wc(R,G,q,Y){const V=R.opaque,mt=R.transmissive,Et=R.transparent;d.setupLightsView(q),$t===!0&&pt.setGlobalState(v.clippingPlanes,q),Y&&Q.viewport(C.copy(Y)),V.length>0&&Tr(V,G,q),mt.length>0&&Tr(mt,G,q),Et.length>0&&Tr(Et,G,q),Q.buffers.depth.setTest(!0),Q.buffers.depth.setMask(!0),Q.buffers.color.setMask(!0),Q.setPolygonOffset(!1)}function Ac(R,G,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[Y.id]===void 0&&(d.state.transmissionRenderTarget[Y.id]=new un(1,1,{generateMipmaps:!0,type:it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float")?qn:Xn,minFilter:Hi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:le.workingColorSpace}));const mt=d.state.transmissionRenderTarget[Y.id],Et=Y.viewport||C;mt.setSize(Et.z*v.transmissionResolutionScale,Et.w*v.transmissionResolutionScale);const Ot=v.getRenderTarget(),Lt=v.getActiveCubeFace(),Xt=v.getActiveMipmapLevel();v.setRenderTarget(mt),v.getClearColor(F),O=v.getClearAlpha(),O<1&&v.setClearColor(16777215,.5),v.clear(),Jt&&Nt.render(q);const Zt=v.toneMapping;v.toneMapping=yi;const Ht=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),d.setupLightsView(Y),$t===!0&&pt.setGlobalState(v.clippingPlanes,Y),Tr(R,q,Y),xt.updateMultisampleRenderTarget(mt),xt.updateRenderTargetMipmap(mt),it.has("WEBGL_multisampled_render_to_texture")===!1){let se=!1;for(let de=0,Ae=G.length;de<Ae;de++){const Me=G[de],ge=Me.object,Gt=Me.geometry,be=Me.material,ce=Me.group;if(be.side===Ie&&ge.layers.test(Y.layers)){const sn=be.side;be.side=qe,be.needsUpdate=!0,Rc(ge,q,Y,Gt,be,ce),be.side=sn,be.needsUpdate=!0,se=!0}}se===!0&&(xt.updateMultisampleRenderTarget(mt),xt.updateRenderTargetMipmap(mt))}v.setRenderTarget(Ot,Lt,Xt),v.setClearColor(F,O),Ht!==void 0&&(Y.viewport=Ht),v.toneMapping=Zt}function Tr(R,G,q){const Y=G.isScene===!0?G.overrideMaterial:null;for(let V=0,mt=R.length;V<mt;V++){const Et=R[V],Ot=Et.object,Lt=Et.geometry,Xt=Et.group;let Zt=Et.material;Zt.allowOverride===!0&&Y!==null&&(Zt=Y),Ot.layers.test(q.layers)&&Rc(Ot,G,q,Lt,Zt,Xt)}}function Rc(R,G,q,Y,V,mt){R.onBeforeRender(v,G,q,Y,V,mt),R.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),V.onBeforeRender(v,G,q,Y,R,mt),V.transparent===!0&&V.side===Ie&&V.forceSinglePass===!1?(V.side=qe,V.needsUpdate=!0,v.renderBufferDirect(q,G,Y,V,R,mt),V.side=bi,V.needsUpdate=!0,v.renderBufferDirect(q,G,Y,V,R,mt),V.side=Ie):v.renderBufferDirect(q,G,Y,V,R,mt),R.onAfterRender(v,G,q,Y,V,mt)}function Er(R,G,q){G.isScene!==!0&&(G=Mt);const Y=ct.get(R),V=d.state.lights,mt=d.state.shadowsArray,Et=V.state.version,Ot=Z.getParameters(R,V.state,mt,G,q),Lt=Z.getProgramCacheKey(Ot);let Xt=Y.programs;Y.environment=R.isMeshStandardMaterial?G.environment:null,Y.fog=G.fog,Y.envMap=(R.isMeshStandardMaterial?Wt:qt).get(R.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&R.envMap===null?G.environmentRotation:R.envMapRotation,Xt===void 0&&(R.addEventListener("dispose",st),Xt=new Map,Y.programs=Xt);let Zt=Xt.get(Lt);if(Zt!==void 0){if(Y.currentProgram===Zt&&Y.lightsStateVersion===Et)return Pc(R,Ot),Zt}else Ot.uniforms=Z.getUniforms(R),R.onBeforeCompile(Ot,v),Zt=Z.acquireProgram(Ot,Lt),Xt.set(Lt,Zt),Y.uniforms=Ot.uniforms;const Ht=Y.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ht.clippingPlanes=pt.uniform),Pc(R,Ot),Y.needsLights=Nf(R),Y.lightsStateVersion=Et,Y.needsLights&&(Ht.ambientLightColor.value=V.state.ambient,Ht.lightProbe.value=V.state.probe,Ht.directionalLights.value=V.state.directional,Ht.directionalLightShadows.value=V.state.directionalShadow,Ht.spotLights.value=V.state.spot,Ht.spotLightShadows.value=V.state.spotShadow,Ht.rectAreaLights.value=V.state.rectArea,Ht.ltc_1.value=V.state.rectAreaLTC1,Ht.ltc_2.value=V.state.rectAreaLTC2,Ht.pointLights.value=V.state.point,Ht.pointLightShadows.value=V.state.pointShadow,Ht.hemisphereLights.value=V.state.hemi,Ht.directionalShadowMap.value=V.state.directionalShadowMap,Ht.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ht.spotShadowMap.value=V.state.spotShadowMap,Ht.spotLightMatrix.value=V.state.spotLightMatrix,Ht.spotLightMap.value=V.state.spotLightMap,Ht.pointShadowMap.value=V.state.pointShadowMap,Ht.pointShadowMatrix.value=V.state.pointShadowMatrix),Y.currentProgram=Zt,Y.uniformsList=null,Zt}function Cc(R){if(R.uniformsList===null){const G=R.currentProgram.getUniforms();R.uniformsList=ya.seqWithValue(G.seq,R.uniforms)}return R.uniformsList}function Pc(R,G){const q=ct.get(R);q.outputColorSpace=G.outputColorSpace,q.batching=G.batching,q.batchingColor=G.batchingColor,q.instancing=G.instancing,q.instancingColor=G.instancingColor,q.instancingMorph=G.instancingMorph,q.skinning=G.skinning,q.morphTargets=G.morphTargets,q.morphNormals=G.morphNormals,q.morphColors=G.morphColors,q.morphTargetsCount=G.morphTargetsCount,q.numClippingPlanes=G.numClippingPlanes,q.numIntersection=G.numClipIntersection,q.vertexAlphas=G.vertexAlphas,q.vertexTangents=G.vertexTangents,q.toneMapping=G.toneMapping}function Df(R,G,q,Y,V){G.isScene!==!0&&(G=Mt),xt.resetTextureUnits();const mt=G.fog,Et=Y.isMeshStandardMaterial?G.environment:null,Ot=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Cs,Lt=(Y.isMeshStandardMaterial?Wt:qt).get(Y.envMap||Et),Xt=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Zt=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ht=!!q.morphAttributes.position,se=!!q.morphAttributes.normal,de=!!q.morphAttributes.color;let Ae=yi;Y.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ae=v.toneMapping);const Me=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ge=Me!==void 0?Me.length:0,Gt=ct.get(Y),be=d.state.lights;if($t===!0&&(J===!0||R!==S)){const Ye=R===S&&Y.id===M;pt.setState(Y,R,Ye)}let ce=!1;Y.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==be.state.version||Gt.outputColorSpace!==Ot||V.isBatchedMesh&&Gt.batching===!1||!V.isBatchedMesh&&Gt.batching===!0||V.isBatchedMesh&&Gt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Gt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Gt.instancing===!1||!V.isInstancedMesh&&Gt.instancing===!0||V.isSkinnedMesh&&Gt.skinning===!1||!V.isSkinnedMesh&&Gt.skinning===!0||V.isInstancedMesh&&Gt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Gt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Gt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Gt.instancingMorph===!1&&V.morphTexture!==null||Gt.envMap!==Lt||Y.fog===!0&&Gt.fog!==mt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==pt.numPlanes||Gt.numIntersection!==pt.numIntersection)||Gt.vertexAlphas!==Xt||Gt.vertexTangents!==Zt||Gt.morphTargets!==Ht||Gt.morphNormals!==se||Gt.morphColors!==de||Gt.toneMapping!==Ae||Gt.morphTargetsCount!==ge)&&(ce=!0):(ce=!0,Gt.__version=Y.version);let sn=Gt.currentProgram;ce===!0&&(sn=Er(Y,G,V));let Ki=!1,rn=!1,Os=!1;const Te=sn.getUniforms(),fn=Gt.uniforms;if(Q.useProgram(sn.program)&&(Ki=!0,rn=!0,Os=!0),Y.id!==M&&(M=Y.id,rn=!0),Ki||S!==R){Q.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Te.setValue(N,"projectionMatrix",R.projectionMatrix),Te.setValue(N,"viewMatrix",R.matrixWorldInverse);const en=Te.map.cameraPosition;en!==void 0&&en.setValue(N,vt.setFromMatrixPosition(R.matrixWorld)),tt.logarithmicDepthBuffer&&Te.setValue(N,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Te.setValue(N,"isOrthographic",R.isOrthographicCamera===!0),S!==R&&(S=R,rn=!0,Os=!0)}if(V.isSkinnedMesh){Te.setOptional(N,V,"bindMatrix"),Te.setOptional(N,V,"bindMatrixInverse");const Ye=V.skeleton;Ye&&(Ye.boneTexture===null&&Ye.computeBoneTexture(),Te.setValue(N,"boneTexture",Ye.boneTexture,xt))}V.isBatchedMesh&&(Te.setOptional(N,V,"batchingTexture"),Te.setValue(N,"batchingTexture",V._matricesTexture,xt),Te.setOptional(N,V,"batchingIdTexture"),Te.setValue(N,"batchingIdTexture",V._indirectTexture,xt),Te.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&Te.setValue(N,"batchingColorTexture",V._colorsTexture,xt));const dn=q.morphAttributes;if((dn.position!==void 0||dn.normal!==void 0||dn.color!==void 0)&&ft.update(V,q,sn),(rn||Gt.receiveShadow!==V.receiveShadow)&&(Gt.receiveShadow=V.receiveShadow,Te.setValue(N,"receiveShadow",V.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(fn.envMap.value=Lt,fn.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&G.environment!==null&&(fn.envMapIntensity.value=G.environmentIntensity),rn&&(Te.setValue(N,"toneMappingExposure",v.toneMappingExposure),Gt.needsLights&&Uf(fn,Os),mt&&Y.fog===!0&&at.refreshFogUniforms(fn,mt),at.refreshMaterialUniforms(fn,Y,H,X,d.state.transmissionRenderTarget[R.id]),ya.upload(N,Cc(Gt),fn,xt)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(ya.upload(N,Cc(Gt),fn,xt),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Te.setValue(N,"center",V.center),Te.setValue(N,"modelViewMatrix",V.modelViewMatrix),Te.setValue(N,"normalMatrix",V.normalMatrix),Te.setValue(N,"modelMatrix",V.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const Ye=Y.uniformsGroups;for(let en=0,to=Ye.length;en<to;en++){const Ci=Ye[en];Yt.update(Ci,sn),Yt.bind(Ci,sn)}}return sn}function Uf(R,G){R.ambientLightColor.needsUpdate=G,R.lightProbe.needsUpdate=G,R.directionalLights.needsUpdate=G,R.directionalLightShadows.needsUpdate=G,R.pointLights.needsUpdate=G,R.pointLightShadows.needsUpdate=G,R.spotLights.needsUpdate=G,R.spotLightShadows.needsUpdate=G,R.rectAreaLights.needsUpdate=G,R.hemisphereLights.needsUpdate=G}function Nf(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(R,G,q){const Y=ct.get(R);Y.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),ct.get(R.texture).__webglTexture=G,ct.get(R.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:q,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,G){const q=ct.get(R);q.__webglFramebuffer=G,q.__useDefaultFramebuffer=G===void 0};const Ff=N.createFramebuffer();this.setRenderTarget=function(R,G=0,q=0){E=R,b=G,w=q;let Y=!0,V=null,mt=!1,Et=!1;if(R){const Lt=ct.get(R);if(Lt.__useDefaultFramebuffer!==void 0)Q.bindFramebuffer(N.FRAMEBUFFER,null),Y=!1;else if(Lt.__webglFramebuffer===void 0)xt.setupRenderTarget(R);else if(Lt.__hasExternalTextures)xt.rebindTextures(R,ct.get(R.texture).__webglTexture,ct.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Ht=R.depthTexture;if(Lt.__boundDepthTexture!==Ht){if(Ht!==null&&ct.has(Ht)&&(R.width!==Ht.image.width||R.height!==Ht.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");xt.setupDepthRenderbuffer(R)}}const Xt=R.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Et=!0);const Zt=ct.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Zt[G])?V=Zt[G][q]:V=Zt[G],mt=!0):R.samples>0&&xt.useMultisampledRTT(R)===!1?V=ct.get(R).__webglMultisampledFramebuffer:Array.isArray(Zt)?V=Zt[q]:V=Zt,C.copy(R.viewport),D.copy(R.scissor),I=R.scissorTest}else C.copy(lt).multiplyScalar(H).floor(),D.copy(Ct).multiplyScalar(H).floor(),I=Ft;if(q!==0&&(V=Ff),Q.bindFramebuffer(N.FRAMEBUFFER,V)&&Y&&Q.drawBuffers(R,V),Q.viewport(C),Q.scissor(D),Q.setScissorTest(I),mt){const Lt=ct.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,Lt.__webglTexture,q)}else if(Et){const Lt=G;for(let Xt=0;Xt<R.textures.length;Xt++){const Zt=ct.get(R.textures[Xt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Xt,Zt.__webglTexture,q,Lt)}}else if(R!==null&&q!==0){const Lt=ct.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Lt.__webglTexture,q)}M=-1},this.readRenderTargetPixels=function(R,G,q,Y,V,mt,Et,Ot=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=ct.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Et!==void 0&&(Lt=Lt[Et]),Lt){Q.bindFramebuffer(N.FRAMEBUFFER,Lt);try{const Xt=R.textures[Ot],Zt=Xt.format,Ht=Xt.type;if(!tt.textureFormatReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=R.width-Y&&q>=0&&q<=R.height-V&&(R.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ot),N.readPixels(G,q,Y,V,Bt.convert(Zt),Bt.convert(Ht),mt))}finally{const Xt=E!==null?ct.get(E).__webglFramebuffer:null;Q.bindFramebuffer(N.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(R,G,q,Y,V,mt,Et,Ot=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=ct.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Et!==void 0&&(Lt=Lt[Et]),Lt)if(G>=0&&G<=R.width-Y&&q>=0&&q<=R.height-V){Q.bindFramebuffer(N.FRAMEBUFFER,Lt);const Xt=R.textures[Ot],Zt=Xt.format,Ht=Xt.type;if(!tt.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const se=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,se),N.bufferData(N.PIXEL_PACK_BUFFER,mt.byteLength,N.STREAM_READ),R.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ot),N.readPixels(G,q,Y,V,Bt.convert(Zt),Bt.convert(Ht),0);const de=E!==null?ct.get(E).__webglFramebuffer:null;Q.bindFramebuffer(N.FRAMEBUFFER,de);const Ae=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Id(N,Ae,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,se),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,mt),N.deleteBuffer(se),N.deleteSync(Ae),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,G=null,q=0){const Y=Math.pow(2,-q),V=Math.floor(R.image.width*Y),mt=Math.floor(R.image.height*Y),Et=G!==null?G.x:0,Ot=G!==null?G.y:0;xt.setTexture2D(R,0),N.copyTexSubImage2D(N.TEXTURE_2D,q,0,0,Et,Ot,V,mt),Q.unbindTexture()};const Of=N.createFramebuffer(),zf=N.createFramebuffer();this.copyTextureToTexture=function(R,G,q=null,Y=null,V=0,mt=null){mt===null&&(V!==0?(dr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),mt=V,V=0):mt=0);let Et,Ot,Lt,Xt,Zt,Ht,se,de,Ae;const Me=R.isCompressedTexture?R.mipmaps[mt]:R.image;if(q!==null)Et=q.max.x-q.min.x,Ot=q.max.y-q.min.y,Lt=q.isBox3?q.max.z-q.min.z:1,Xt=q.min.x,Zt=q.min.y,Ht=q.isBox3?q.min.z:0;else{const dn=Math.pow(2,-V);Et=Math.floor(Me.width*dn),Ot=Math.floor(Me.height*dn),R.isDataArrayTexture?Lt=Me.depth:R.isData3DTexture?Lt=Math.floor(Me.depth*dn):Lt=1,Xt=0,Zt=0,Ht=0}Y!==null?(se=Y.x,de=Y.y,Ae=Y.z):(se=0,de=0,Ae=0);const ge=Bt.convert(G.format),Gt=Bt.convert(G.type);let be;G.isData3DTexture?(xt.setTexture3D(G,0),be=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(xt.setTexture2DArray(G,0),be=N.TEXTURE_2D_ARRAY):(xt.setTexture2D(G,0),be=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);const ce=N.getParameter(N.UNPACK_ROW_LENGTH),sn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Ki=N.getParameter(N.UNPACK_SKIP_PIXELS),rn=N.getParameter(N.UNPACK_SKIP_ROWS),Os=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Me.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Me.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Xt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Zt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ht);const Te=R.isDataArrayTexture||R.isData3DTexture,fn=G.isDataArrayTexture||G.isData3DTexture;if(R.isDepthTexture){const dn=ct.get(R),Ye=ct.get(G),en=ct.get(dn.__renderTarget),to=ct.get(Ye.__renderTarget);Q.bindFramebuffer(N.READ_FRAMEBUFFER,en.__webglFramebuffer),Q.bindFramebuffer(N.DRAW_FRAMEBUFFER,to.__webglFramebuffer);for(let Ci=0;Ci<Lt;Ci++)Te&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ct.get(R).__webglTexture,V,Ht+Ci),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ct.get(G).__webglTexture,mt,Ae+Ci)),N.blitFramebuffer(Xt,Zt,Et,Ot,se,de,Et,Ot,N.DEPTH_BUFFER_BIT,N.NEAREST);Q.bindFramebuffer(N.READ_FRAMEBUFFER,null),Q.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||R.isRenderTargetTexture||ct.has(R)){const dn=ct.get(R),Ye=ct.get(G);Q.bindFramebuffer(N.READ_FRAMEBUFFER,Of),Q.bindFramebuffer(N.DRAW_FRAMEBUFFER,zf);for(let en=0;en<Lt;en++)Te?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,dn.__webglTexture,V,Ht+en):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,dn.__webglTexture,V),fn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ye.__webglTexture,mt,Ae+en):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ye.__webglTexture,mt),V!==0?N.blitFramebuffer(Xt,Zt,Et,Ot,se,de,Et,Ot,N.COLOR_BUFFER_BIT,N.NEAREST):fn?N.copyTexSubImage3D(be,mt,se,de,Ae+en,Xt,Zt,Et,Ot):N.copyTexSubImage2D(be,mt,se,de,Xt,Zt,Et,Ot);Q.bindFramebuffer(N.READ_FRAMEBUFFER,null),Q.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else fn?R.isDataTexture||R.isData3DTexture?N.texSubImage3D(be,mt,se,de,Ae,Et,Ot,Lt,ge,Gt,Me.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D(be,mt,se,de,Ae,Et,Ot,Lt,ge,Me.data):N.texSubImage3D(be,mt,se,de,Ae,Et,Ot,Lt,ge,Gt,Me):R.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,mt,se,de,Et,Ot,ge,Gt,Me.data):R.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,mt,se,de,Me.width,Me.height,ge,Me.data):N.texSubImage2D(N.TEXTURE_2D,mt,se,de,Et,Ot,ge,Gt,Me);N.pixelStorei(N.UNPACK_ROW_LENGTH,ce),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,sn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ki),N.pixelStorei(N.UNPACK_SKIP_ROWS,rn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Os),mt===0&&G.generateMipmaps&&N.generateMipmap(be),Q.unbindTexture()},this.initRenderTarget=function(R){ct.get(R).__webglFramebuffer===void 0&&xt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?xt.setTextureCube(R,0):R.isData3DTexture?xt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?xt.setTexture2DArray(R,0):xt.setTexture2D(R,0),Q.unbindTexture()},this.resetState=function(){b=0,w=0,E=null,Q.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=le._getDrawingBufferColorSpace(t),e.unpackColorSpace=le._getUnpackColorSpace()}}const F_=.85,zo=i=>i*i*(3-2*i);function Gh(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=zo(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*zo(e),veil:.82+.14*zo(Math.min(1,e/.5)),ready:e===1}}const lf=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function cf(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class Fs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const O_=new xc(-1,1,1,-1,0,1);class z_ extends we{constructor(){super(),this.setAttribute("position",new ie([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ie([0,2,0,0,2,0],2))}}const B_=new z_;class yc{constructor(t){this._mesh=new ye(B_,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,O_)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const sa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class hf extends Fs{constructor(){super(),this.uniforms=Gi.clone(sa.uniforms),this.material=new kp({name:sa.name,uniforms:this.uniforms,vertexShader:sa.vertexShader,fragmentShader:sa.fragmentShader}),this._fsQuad=new yc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},le.getTransfer(this._outputColorSpace)===ue&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===xu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===vu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===yu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===tc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Su?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===bu?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Mu&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const ai={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},La={min:.85,max:1.35};function k_(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function Vh(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,f=t.height*c*.5,p=Math.max(i.x,.001),u=Math.max(i.y,.001),m=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,_=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(p+m*i.z/s),f/(u+_*i.z/s))}function H_(i,t){if(!ai[i])throw Error("unknown item");if(t==="front")return[...ai[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(ai[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=ai[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class G_ extends Il{constructor(){super();const t=new Zn;t.deleteAttribute("uv");const e=new Dt({side:qe}),n=new Dt,s=new Ia(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new ye(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new ip(t,n,6),o=new Le;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new ye(t,xs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new ye(t,xs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new ye(t,xs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new ye(t,xs(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new ye(t,xs(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const u=new ye(t,xs(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function xs(i){return new Gp({color:0,emissive:16777215,emissiveIntensity:i})}function uf(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new we;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let p=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in f.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(f.attributes[u]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in f.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(f.morphAttributes[u])}if(t){let u;if(e)u=f.index.count;else if(f.attributes.position!==void 0)u=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(e){let h=0;const f=[];for(let p=0;p<i.length;++p){const u=i[p].index;for(let m=0;m<u.count;++m)f.push(u.getX(m)+h);h+=i[p].attributes.position.count}l.setIndex(f)}for(const h in r){const f=Wh(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<f;++p){const u=[];for(let _=0;_<a[h].length;++_)u.push(a[h][_][p]);const m=Wh(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Wh(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Ue(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let p=0,u=h.count;p<u;p++)for(let m=0;m<e;m++){const _=h.getComponent(p,m);o.setComponent(p+f,m,_)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function Jn(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function oe(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,Jn(),e);const s=new lp(n);return s.colorSpace=Be,s.anisotropy=8,s}function kl(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return oe((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function tn(i,t,e,n=Jn(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function Ya(i){const t=oe((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=Ti,t}const ff=Ya("paper"),df=Ya("leather"),js=Ya("metal"),Xh=Ya("cloth"),Qs=js.clone();Qs.colorSpace=cn;const Hl=df.clone();Hl.colorSpace=cn;const Ma=ff.clone();Ma.colorSpace=cn;const V_=oe((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),L={black:new Dt({color:1646879,roughness:.42,metalness:.38,map:js,bumpMap:Qs,bumpScale:.004}),leather:new Dt({color:6712935,map:df,roughness:.78,bumpMap:Hl,bumpScale:.01}),silver:new Dt({color:12239550,map:js,roughnessMap:Qs,roughness:.35,metalness:.93,bumpMap:Qs,bumpScale:.003}),gold:new Dt({color:12427627,map:js,roughness:.29,metalness:.88,bumpMap:Qs,bumpScale:.003}),bronze:new Dt({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new ys({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:Ma,bumpScale:4e-4}),blue:new ys({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new ys({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new Dt({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new ys({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new Dt({color:14799534,map:ff,roughness:.96,bumpMap:Ma,bumpScale:.006,side:Ie}),red:new Dt({color:7152936,map:Xh,roughness:.82,bumpMap:Xh,bumpScale:.009}),rust:new Dt({map:V_,roughness:.92,metalness:.08,bumpMap:Ma,bumpScale:.022}),rubber:new Dt({color:1383192,roughness:.88,bumpMap:Hl,bumpScale:.008}),copper:new Dt({color:12089158,map:js,roughness:.37,metalness:.9})},Bo=new Map;let pf=[];function Sa(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(Bo.has(n))return Bo.get(n);let s;pf.push(new Promise(a=>s=a));const r=new tf().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?cn:Be,r.wrapS=r.wrapT=Ti,r.repeat.set(...t),r.anisotropy=8,Bo.set(n,r),r}function W_(){return Promise.all(pf)}function qh(i,t=[1,1]){return{map:Sa(`${i}.jpg`,{repeat:t}),normalMap:Sa(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:Sa(`${i}-roughness.png`,{repeat:t,data:!0})}}function mf(){return oe((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const ba={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class X_ extends Fs{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof je?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Gi.clone(t.uniforms),this.material=new je({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new yc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Yh extends Fs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class q_ extends Fs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Y_{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new rt);this._width=n.width,this._height=n.height,e=new un(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:qn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new X_(ba),this.copyPass.material.blending=Je,this.clock=new Kp}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Yh!==void 0&&(a instanceof Yh?n=!0:a instanceof q_&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new rt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Z_ extends Fs{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new kt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class $_{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,f=(l+c)*h,p=l-f,u=c-f,m=t-p,_=e-u;let g,d;m>_?(g=1,d=0):(g=0,d=1);const x=m-g+h,y=_-d+h,v=m-1+2*h,A=_-1+2*h,b=l&255,w=c&255,E=this.perm[b+this.perm[w]]%12,M=this.perm[b+g+this.perm[w+d]]%12,S=this.perm[b+1+this.perm[w+1]]%12;let C=.5-m*m-_*_;C<0?n=0:(C*=C,n=C*C*this._dot(this.grad3[E],m,_));let D=.5-x*x-y*y;D<0?s=0:(D*=D,s=D*D*this._dot(this.grad3[M],x,y));let I=.5-v*v-A*A;return I<0?r=0:(I*=I,r=I*I*this._dot(this.grad3[S],v,A)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),f=Math.floor(e+c),p=Math.floor(n+c),u=1/6,m=(h+f+p)*u,_=h-m,g=f-m,d=p-m,x=t-_,y=e-g,v=n-d;let A,b,w,E,M,S;x>=y?y>=v?(A=1,b=0,w=0,E=1,M=1,S=0):x>=v?(A=1,b=0,w=0,E=1,M=0,S=1):(A=0,b=0,w=1,E=1,M=0,S=1):y<v?(A=0,b=0,w=1,E=0,M=1,S=1):x<v?(A=0,b=1,w=0,E=0,M=1,S=1):(A=0,b=1,w=0,E=1,M=1,S=0);const C=x-A+u,D=y-b+u,I=v-w+u,F=x-E+2*u,O=y-M+2*u,k=v-S+2*u,X=x-1+3*u,H=y-1+3*u,K=v-1+3*u,nt=h&255,lt=f&255,Ct=p&255,Ft=this.perm[nt+this.perm[lt+this.perm[Ct]]]%12,Kt=this.perm[nt+A+this.perm[lt+b+this.perm[Ct+w]]]%12,$t=this.perm[nt+E+this.perm[lt+M+this.perm[Ct+S]]]%12,J=this.perm[nt+1+this.perm[lt+1+this.perm[Ct+1]]]%12;let j=.6-x*x-y*y-v*v;j<0?s=0:(j*=j,s=j*j*this._dot3(this.grad3[Ft],x,y,v));let vt=.6-C*C-D*D-I*I;vt<0?r=0:(vt*=vt,r=vt*vt*this._dot3(this.grad3[Kt],C,D,I));let At=.6-F*F-O*O-k*k;At<0?a=0:(At*=At,a=At*At*this._dot3(this.grad3[$t],F,O,k));let Mt=.6-X*X-H*H-K*K;return Mt<0?o=0:(Mt*=Mt,o=Mt*Mt*this._dot3(this.grad3[J],X,H,K)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,f,p,u,m;const _=(t+e+n+s)*l,g=Math.floor(t+_),d=Math.floor(e+_),x=Math.floor(n+_),y=Math.floor(s+_),v=(g+d+x+y)*c,A=g-v,b=d-v,w=x-v,E=y-v,M=t-A,S=e-b,C=n-w,D=s-E,I=M>S?32:0,F=M>C?16:0,O=S>C?8:0,k=M>D?4:0,X=S>D?2:0,H=C>D?1:0,K=I+F+O+k+X+H,nt=a[K][0]>=3?1:0,lt=a[K][1]>=3?1:0,Ct=a[K][2]>=3?1:0,Ft=a[K][3]>=3?1:0,Kt=a[K][0]>=2?1:0,$t=a[K][1]>=2?1:0,J=a[K][2]>=2?1:0,j=a[K][3]>=2?1:0,vt=a[K][0]>=1?1:0,At=a[K][1]>=1?1:0,Mt=a[K][2]>=1?1:0,Jt=a[K][3]>=1?1:0,Qt=M-nt+c,N=S-lt+c,ot=C-Ct+c,it=D-Ft+c,tt=M-Kt+2*c,Q=S-$t+2*c,_t=C-J+2*c,ct=D-j+2*c,xt=M-vt+3*c,qt=S-At+3*c,Wt=C-Mt+3*c,P=D-Jt+3*c,T=M-1+4*c,W=S-1+4*c,Z=C-1+4*c,at=D-1+4*c,$=g&255,It=d&255,pt=x&255,Pt=y&255,Nt=o[$+o[It+o[pt+o[Pt]]]]%32,ft=o[$+nt+o[It+lt+o[pt+Ct+o[Pt+Ft]]]]%32,Tt=o[$+Kt+o[It+$t+o[pt+J+o[Pt+j]]]]%32,Vt=o[$+vt+o[It+At+o[pt+Mt+o[Pt+Jt]]]]%32,Bt=o[$+1+o[It+1+o[pt+1+o[Pt+1]]]]%32;let yt=.6-M*M-S*S-C*C-D*D;yt<0?h=0:(yt*=yt,h=yt*yt*this._dot4(r[Nt],M,S,C,D));let Yt=.6-Qt*Qt-N*N-ot*ot-it*it;Yt<0?f=0:(Yt*=Yt,f=Yt*Yt*this._dot4(r[ft],Qt,N,ot,it));let B=.6-tt*tt-Q*Q-_t*_t-ct*ct;B<0?p=0:(B*=B,p=B*B*this._dot4(r[Tt],tt,Q,_t,ct));let ut=.6-xt*xt-qt*qt-Wt*Wt-P*P;ut<0?u=0:(ut*=ut,u=ut*ut*this._dot4(r[Vt],xt,qt,Wt,P));let gt=.6-T*T-W*W-Z*Z-at*at;return gt<0?m=0:(gt*=gt,m=gt*gt*this._dot4(r[Bt],T,W,Z,at)),27*(h+f+p+u+m)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const ra={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new rt},cameraProjectionMatrix:{value:new ae},cameraInverseProjectionMatrix:{value:new ae},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},aa={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},oa={uniforms:{tDiffuse:{value:null},resolution:{value:new rt}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};class xi extends Fs{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new dc;a.format=Rs,a.type=As,this.normalRenderTarget=new un(this.width,this.height,{minFilter:Qe,magFilter:Qe,type:qn,depthTexture:a}),this.ssaoRenderTarget=new un(this.width,this.height,{type:qn}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new je({defines:Object.assign({},ra.defines),uniforms:Gi.clone(ra.uniforms),vertexShader:ra.vertexShader,fragmentShader:ra.fragmentShader,blending:Je}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new Hp,this.normalMaterial.blending=Je,this.blurMaterial=new je({defines:Object.assign({},oa.defines),uniforms:Gi.clone(oa.uniforms),vertexShader:oa.vertexShader,fragmentShader:oa.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new je({defines:Object.assign({},aa.defines),uniforms:Gi.clone(aa.uniforms),vertexShader:aa.vertexShader,fragmentShader:aa.fragmentShader,blending:Je}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new je({uniforms:Gi.clone(ba.uniforms),vertexShader:ba.vertexShader,fragmentShader:ba.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:_u,blendDst:Vo,blendEquation:ri,blendSrcAlpha:gu,blendDstAlpha:Vo,blendEquationAlpha:ri}),this._fsQuad=new yc(null),this._originalClearColor=new kt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case xi.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=Je,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case xi.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Je,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case xi.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case xi.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Je,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case xi.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=mu,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new U;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=De.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new $_,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new Gu(r,4,4,ka,In),this.noiseTexture.wrapS=Ti,this.noiseTexture.wrapT=Ti,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}xi.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class J_ extends xi{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class K_{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new un(1,1,{type:qn,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new Y_(t,r),this.composer.addPass(new Z_(e,n)),this.ao=new J_(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new hf),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function j_(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const Zs=new U;function mn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Zs.copy(t),Zs[n]=0,Zs.normalize();const c=.5*a/(a+o),h=1-Zs.angleTo(i)/l;return Math.sign(Zs[e])===1?h*c:o/(a+o)+c+c*(1-h)}class Mc extends Zn{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new U,c=new U,h=new U(t,e,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,p=this.attributes.normal.array,u=this.attributes.uv.array,m=f.length/6,_=new U,g=.5/a;for(let d=0,x=0;d<f.length;d+=3,x+=2)switch(l.fromArray(f,d),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),f[d+0]=h.x*Math.sign(l.x)+c.x*r,f[d+1]=h.y*Math.sign(l.y)+c.y*r,f[d+2]=h.z*Math.sign(l.z)+c.z*r,p[d+0]=c.x,p[d+1]=c.y,p[d+2]=c.z,Math.floor(d/m)){case 0:_.set(1,0,0),u[x+0]=mn(_,c,"z","y",r,n),u[x+1]=1-mn(_,c,"y","z",r,e);break;case 1:_.set(-1,0,0),u[x+0]=1-mn(_,c,"z","y",r,n),u[x+1]=1-mn(_,c,"y","z",r,e);break;case 2:_.set(0,1,0),u[x+0]=1-mn(_,c,"x","z",r,t),u[x+1]=mn(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),u[x+0]=1-mn(_,c,"x","z",r,t),u[x+1]=1-mn(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),u[x+0]=1-mn(_,c,"x","y",r,t),u[x+1]=1-mn(_,c,"y","x",r,e);break;case 5:_.set(0,0,-1),u[x+0]=mn(_,c,"x","y",r,t),u[x+1]=1-mn(_,c,"y","x",r,e);break}}static fromJSON(t){return new Mc(t.width,t.height,t.depth,t.segments,t.radius)}}class Q_ extends ye{constructor(t,e,n=!1,s=!1,r=1e4){const a=new we;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(x){this.resolution=x,this.isolation=80,this.size=x,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=r*3;this.positionArray=new Float32Array(y*3);const v=new Ue(this.positionArray,3);v.setUsage(Ar),a.setAttribute("position",v),this.normalArray=new Float32Array(y*3);const A=new Ue(this.normalArray,3);if(A.setUsage(Ar),a.setAttribute("normal",A),this.enableUvs){this.uvArray=new Float32Array(y*2);const b=new Ue(this.uvArray,2);b.setUsage(Ar),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const b=new Ue(this.colorArray,3);b.setUsage(Ar),a.setAttribute("color",b)}a.boundingSphere=new Ji(new U,1)};function f(x,y,v){return x+(y-x)*v}function p(x,y,v,A,b,w,E,M,S,C){const D=(v-E)/(M-E),I=o.normal_cache;l[y+0]=A+D*o.delta,l[y+1]=b,l[y+2]=w,c[y+0]=f(I[x+0],I[x+3],D),c[y+1]=f(I[x+1],I[x+4],D),c[y+2]=f(I[x+2],I[x+5],D),h[y+0]=f(o.palette[S*3+0],o.palette[C*3+0],D),h[y+1]=f(o.palette[S*3+1],o.palette[C*3+1],D),h[y+2]=f(o.palette[S*3+2],o.palette[C*3+2],D)}function u(x,y,v,A,b,w,E,M,S,C){const D=(v-E)/(M-E),I=o.normal_cache;l[y+0]=A,l[y+1]=b+D*o.delta,l[y+2]=w;const F=x+o.yd*3;c[y+0]=f(I[x+0],I[F+0],D),c[y+1]=f(I[x+1],I[F+1],D),c[y+2]=f(I[x+2],I[F+2],D),h[y+0]=f(o.palette[S*3+0],o.palette[C*3+0],D),h[y+1]=f(o.palette[S*3+1],o.palette[C*3+1],D),h[y+2]=f(o.palette[S*3+2],o.palette[C*3+2],D)}function m(x,y,v,A,b,w,E,M,S,C){const D=(v-E)/(M-E),I=o.normal_cache;l[y+0]=A,l[y+1]=b,l[y+2]=w+D*o.delta;const F=x+o.zd*3;c[y+0]=f(I[x+0],I[F+0],D),c[y+1]=f(I[x+1],I[F+1],D),c[y+2]=f(I[x+2],I[F+2],D),h[y+0]=f(o.palette[S*3+0],o.palette[C*3+0],D),h[y+1]=f(o.palette[S*3+1],o.palette[C*3+1],D),h[y+2]=f(o.palette[S*3+2],o.palette[C*3+2],D)}function _(x){const y=x*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[x-1]-o.field[x+1],o.normal_cache[y+1]=o.field[x-o.yd]-o.field[x+o.yd],o.normal_cache[y+2]=o.field[x-o.zd]-o.field[x+o.zd])}function g(x,y,v,A,b){const w=A+1,E=A+o.yd,M=A+o.zd,S=w+o.yd,C=w+o.zd,D=A+o.yd+o.zd,I=w+o.yd+o.zd;let F=0;const O=o.field[A],k=o.field[w],X=o.field[E],H=o.field[S],K=o.field[M],nt=o.field[C],lt=o.field[D],Ct=o.field[I];O<b&&(F|=1),k<b&&(F|=2),X<b&&(F|=8),H<b&&(F|=4),K<b&&(F|=16),nt<b&&(F|=32),lt<b&&(F|=128),Ct<b&&(F|=64);const Ft=tx[F];if(Ft===0)return 0;const Kt=o.delta,$t=x+Kt,J=y+Kt,j=v+Kt;Ft&1&&(_(A),_(w),p(A*3,0,b,x,y,v,O,k,A,w)),Ft&2&&(_(w),_(S),u(w*3,3,b,$t,y,v,k,H,w,S)),Ft&4&&(_(E),_(S),p(E*3,6,b,x,J,v,X,H,E,S)),Ft&8&&(_(A),_(E),u(A*3,9,b,x,y,v,O,X,A,E)),Ft&16&&(_(M),_(C),p(M*3,12,b,x,y,j,K,nt,M,C)),Ft&32&&(_(C),_(I),u(C*3,15,b,$t,y,j,nt,Ct,C,I)),Ft&64&&(_(D),_(I),p(D*3,18,b,x,J,j,lt,Ct,D,I)),Ft&128&&(_(M),_(D),u(M*3,21,b,x,y,j,K,lt,M,D)),Ft&256&&(_(A),_(M),m(A*3,24,b,x,y,v,O,K,A,M)),Ft&512&&(_(w),_(C),m(w*3,27,b,$t,y,v,k,nt,w,C)),Ft&1024&&(_(S),_(I),m(S*3,30,b,$t,J,v,H,Ct,S,I)),Ft&2048&&(_(E),_(D),m(E*3,33,b,x,J,v,X,lt,E,D)),F<<=4;let vt,At,Mt,Jt=0,Qt=0;for(;la[F+Qt]!=-1;)vt=F+Qt,At=vt+1,Mt=vt+2,d(l,c,h,3*la[vt],3*la[At],3*la[Mt]),Qt+=3,Jt++;return Jt}function d(x,y,v,A,b,w){const E=o.count*3;if(o.positionArray[E+0]=x[A],o.positionArray[E+1]=x[A+1],o.positionArray[E+2]=x[A+2],o.positionArray[E+3]=x[b],o.positionArray[E+4]=x[b+1],o.positionArray[E+5]=x[b+2],o.positionArray[E+6]=x[w],o.positionArray[E+7]=x[w+1],o.positionArray[E+8]=x[w+2],o.material.flatShading===!0){const M=(y[A+0]+y[b+0]+y[w+0])/3,S=(y[A+1]+y[b+1]+y[w+1])/3,C=(y[A+2]+y[b+2]+y[w+2])/3;o.normalArray[E+0]=M,o.normalArray[E+1]=S,o.normalArray[E+2]=C,o.normalArray[E+3]=M,o.normalArray[E+4]=S,o.normalArray[E+5]=C,o.normalArray[E+6]=M,o.normalArray[E+7]=S,o.normalArray[E+8]=C}else o.normalArray[E+0]=y[A+0],o.normalArray[E+1]=y[A+1],o.normalArray[E+2]=y[A+2],o.normalArray[E+3]=y[b+0],o.normalArray[E+4]=y[b+1],o.normalArray[E+5]=y[b+2],o.normalArray[E+6]=y[w+0],o.normalArray[E+7]=y[w+1],o.normalArray[E+8]=y[w+2];if(o.enableUvs){const M=o.count*2;o.uvArray[M+0]=x[A+0],o.uvArray[M+1]=x[A+2],o.uvArray[M+2]=x[b+0],o.uvArray[M+3]=x[b+2],o.uvArray[M+4]=x[w+0],o.uvArray[M+5]=x[w+2]}o.enableColors&&(o.colorArray[E+0]=v[A+0],o.colorArray[E+1]=v[A+1],o.colorArray[E+2]=v[A+2],o.colorArray[E+3]=v[b+0],o.colorArray[E+4]=v[b+1],o.colorArray[E+5]=v[b+2],o.colorArray[E+6]=v[w+0],o.colorArray[E+7]=v[w+1],o.colorArray[E+8]=v[w+2]),o.count+=3}this.addBall=function(x,y,v,A,b,w){const E=Math.sign(A);A=Math.abs(A);const M=w!=null;let S=new kt(x,y,v);if(M)try{S=w instanceof kt?w:Array.isArray(w)?new kt(Math.min(Math.abs(w[0]),1),Math.min(Math.abs(w[1]),1),Math.min(Math.abs(w[2]),1)):new kt(w)}catch{S=new kt(x,y,v)}const C=this.size*Math.sqrt(A/b),D=v*this.size,I=y*this.size,F=x*this.size;let O=Math.floor(D-C);O<1&&(O=1);let k=Math.floor(D+C);k>this.size-1&&(k=this.size-1);let X=Math.floor(I-C);X<1&&(X=1);let H=Math.floor(I+C);H>this.size-1&&(H=this.size-1);let K=Math.floor(F-C);K<1&&(K=1);let nt=Math.floor(F+C);nt>this.size-1&&(nt=this.size-1);let lt,Ct,Ft,Kt,$t,J,j,vt,At,Mt,Jt;for(Ft=O;Ft<k;Ft++)for($t=this.size2*Ft,vt=Ft/this.size-v,At=vt*vt,Ct=X;Ct<H;Ct++)for(Kt=$t+this.size*Ct,j=Ct/this.size-y,Mt=j*j,lt=K;lt<nt;lt++)if(J=lt/this.size-x,Jt=A/(1e-6+J*J+Mt+At)-b,Jt>0){this.field[Kt+lt]+=Jt*E;const Qt=Math.sqrt((lt-F)*(lt-F)+(Ct-I)*(Ct-I)+(Ft-D)*(Ft-D))/C,N=1-Qt*Qt*Qt*(Qt*(Qt*6-15)+10);this.palette[(Kt+lt)*3+0]+=S.r*N,this.palette[(Kt+lt)*3+1]+=S.g*N,this.palette[(Kt+lt)*3+2]+=S.b*N}},this.addPlaneX=function(x,y){const v=this.size,A=this.yd,b=this.zd,w=this.field;let E,M,S,C,D,I,F,O=v*Math.sqrt(x/y);for(O>v&&(O=v),E=0;E<O;E++)if(I=E/v,C=I*I,D=x/(1e-4+C)-y,D>0)for(M=0;M<v;M++)for(F=E+M*A,S=0;S<v;S++)w[b*S+F]+=D},this.addPlaneY=function(x,y){const v=this.size,A=this.yd,b=this.zd,w=this.field;let E,M,S,C,D,I,F,O,k=v*Math.sqrt(x/y);for(k>v&&(k=v),M=0;M<k;M++)if(I=M/v,C=I*I,D=x/(1e-4+C)-y,D>0)for(F=M*A,E=0;E<v;E++)for(O=F+E,S=0;S<v;S++)w[b*S+O]+=D},this.addPlaneZ=function(x,y){const v=this.size,A=this.yd,b=this.zd,w=this.field;let E,M,S,C,D,I,F,O,k=v*Math.sqrt(x/y);for(k>v&&(k=v),S=0;S<k;S++)if(I=S/v,C=I*I,D=x/(1e-4+C)-y,D>0)for(F=b*S,M=0;M<v;M++)for(O=F+M*A,E=0;E<v;E++)w[O+E]+=D},this.setCell=function(x,y,v,A){const b=this.size2*v+this.size*y+x;this.field[b]=A},this.getCell=function(x,y,v){const A=this.size2*v+this.size*y+x;return this.field[A]},this.blur=function(x=1){const y=this.field,v=y.slice(),A=this.size,b=this.size2;for(let w=0;w<A;w++)for(let E=0;E<A;E++)for(let M=0;M<A;M++){const S=b*M+A*E+w;let C=v[S],D=1;for(let I=-1;I<=1;I+=2){const F=I+w;if(!(F<0||F>=A))for(let O=-1;O<=1;O+=2){const k=O+E;if(!(k<0||k>=A))for(let X=-1;X<=1;X+=2){const H=X+M;if(H<0||H>=A)continue;const K=b*H+A*k+F,nt=v[K];D++,C+=x*(nt-C)/D}}}y[S]=C}},this.reset=function(){for(let x=0;x<this.size3;x++)this.normal_cache[x*3]=0,this.field[x]=0,this.palette[x*3]=this.palette[x*3+1]=this.palette[x*3+2]=0},this.update=function(){this.count=0;const x=this.size-2;for(let y=1;y<x;y++){const v=this.size2*y,A=(y-this.halfsize)/this.halfsize;for(let b=1;b<x;b++){const w=v+this.size*b,E=(b-this.halfsize)/this.halfsize;for(let M=1;M<x;M++){const S=(M-this.halfsize)/this.halfsize,C=w+M;g(S,E,A,C,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const tx=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),la=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function gf(i,t,e=44){const n=new Q_(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,f=a/e*2-1;let p=10;for(const[u,m,_,g,d,x,y=0]of i){const v=Math.cos(y),A=Math.sin(y),b=c-u,w=h-m,E=f-_,M=v*b+A*w,S=-A*b+v*w,C=Math.hypot(M/g,S/d,E/x),D=Math.hypot(M/(g*g),S/(d*d),E/(x*x)),I=D>1e-6?C*(C-1)/D:-Math.min(g,d,x),F=.085,O=Math.max(F-Math.abs(p-I),0)/F;p=Math.min(p,I)-O*O*O*F/6}n.field[a*e*e+o*e+l]=-p}n.update();const s=n.geometry.drawRange.count,r=new we;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Ue(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const He=Math.PI*2;let Sc=1;function Zh(i){Sc=Math.max(.24,Math.min(1,i))||1}const vr=(i,t=4)=>Math.max(t,Math.round(i*Sc));function bt(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new ye(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function z(i,t,e,n=L.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return bt(s?new Mc(...t,Sc<.8?1:2,a):new Zn(...t),n,i,e,r)}function Rt(i,t,e,n,s,r=L.silver,a=[Math.PI/2,0,0],o=48){return bt(new bn(t,e,n,vr(o,6)),r,i,s,a)}function Mi(i,t,e,n=L.cream){const s=bt(new Sr(1,vr(32,8),vr(24,6)),n,i,e);return s.scale.set(...t),s}function _e(i,t,e,n,s=L.gold,r=[0,0,0],a=He){return bt(new xr(t,e,vr(8,4),vr(64,8),a),s,i,n,r)}function xn(i,t,e,n=L.gold,s=30){return bt(new Wn(new Xi(t.map(r=>new U(...r))),s,e,8,!1),n,i)}function Yi(i,t,e,n=[0,0,0],s=64){return bt(new Wa(t.map(r=>new rt(...r)),s),e,i,n)}function Da(i,t,e,n,s=.022,r=L.silver){Rt(i,s,s,s*.35,[t,e,n],r,void 0,16),z(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],L.black,.001,[0,0,(t+e)*7])}function Un(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=oe((c,h,f)=>s(c,h,o,f),768,o);return bt(new re(t,e),new Dt({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function ze(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return Un(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function Za(i,t,e,n){const s=oe((r,a,o)=>n(r,a,o),1024);return bt(new Ei(t,80),new Ke({map:s,toneMapped:!1}),i,[0,0,e])}function bc(i,t,e,n,s=L.clear){const r=bt(new Sr(1,48,20,0,He,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function Ua(i,t,e,n,s=48,r=L.silver,a="z"){for(let o=0;o<s;o++){const l=o*He/s;a==="z"?z(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):z(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function Ls(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return bt(new Ga(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function $h(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function ex(i){z(i,[1.65,.92,.49],[0,0,0],L.black,.07),z(i,[1.57,.81,.016],[0,-.015,.253],L.leather,.024),z(i,[1.63,.245,.52],[0,.448,0],L.silver,.035),z(i,[1.63,.105,.51],[0,-.48,0],L.silver,.02),z(i,[1.57,.77,.018],[0,-.015,-.257],L.leather,.025),z(i,[1.62,.82,.035],[0,-.015,-.256],L.black,.035),z(i,[1.49,.7,.02],[0,-.01,-.282],L.leather,.023),ze(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),ze(i,"8М",.18,.1,[-.55,-.11,.269]),ze(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),ze(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new pe;t.position.set(.12,-.045,0),i.add(t),Rt(t,.36,.39,.18,[0,0,.34],L.black),Rt(t,.325,.345,.13,[0,0,.466],L.silver),Rt(t,.293,.293,.21,[0,0,.575],L.black),Ua(t,.296,.12,[0,0,.56],56,L.rubber),_e(t,.29,.012,[0,0,.682],L.silver),Rt(t,.272,.272,.025,[0,0,.688],L.black),Za(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),$h(n,"ТРИПЛЕТ 43 • 4/40",420),$h(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),Rt(t,.204,.204,.025,[0,0,.717],L.black);for(let n=0;n<7;n++){const s=n*He/7,r=new hi;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),bt(new Xa(r),L.rubber,t,[0,0,.733],[0,0,s])}Rt(t,.082,.082,.006,[0,0,.74],L.black),bc(t,.196,.028,[0,0,.748],L.clear),_e(t,.204,.006,[0,0,.736],L.silver),Un(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),z(i,[.292,.177,.047],[-.49,.444,.282],L.black,.025),z(i,[.2,.105,.016],[-.49,.444,.309],L.lens,.009),z(i,[.21,.13,.035],[-.49,.447,-.28],L.black,.012),z(i,[.155,.08,.012],[-.49,.447,-.305],L.lens,.005);for(const n of[-.7,.72])Da(i,n,.452,.269,.021);for(const n of[-.65,.65])Da(i,n,-.32,-.3,.018);Rt(i,.161,.17,.105,[-.53,.625,0],L.silver,[0,0,0]),Ua(i,.161,.067,[-.53,.63,0],38,L.silver,"y"),Rt(i,.11,.12,.072,[.53,.603,0],L.black,[0,0,0]),Rt(i,.059,.065,.075,[.53,.67,0],L.silver,[0,0,0]),z(i,[.27,.024,.23],[.02,.584,0],L.black,.006);for(const n of[-.14,.14])z(i,[.035,.04,.25],[n,.6,0],L.silver,.007);Rt(i,.036,.036,.015,[0,-.535,0],L.gold,[0,0,0]);for(const n of[-.79,.79])_e(i,.055,.012,[n,.14,0],L.silver,[0,Math.PI/2,0]);const e=xn(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,L.leather,50);e.scale.z=.4}function nx(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];Yi(i,t,L.cream),_e(i,.531,.007,[0,.377,0],L.gold,[Math.PI/2,0,0]),_e(i,.272,.006,[0,-.489,0],L.gold,[Math.PI/2,0,0]),xn(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,L.cream),xn(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,L.gold);const e=oe((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,He),s.fill()},1024),n=new Dt({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});Yi(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),ze(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function ix(i){const t=new Dt({map:L.leather.map,color:7754307,roughness:.84,bumpMap:L.leather.bumpMap,bumpScale:.01});z(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)z(i,[.008,.023,.004],[s,r,.001],L.paper,.001);for(let s=-.99;s<-.46;s+=.105)Rt(i,.019,.019,.004,[0,s,.004],L.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])z(i,[.1,.18,.13],[r,s,.035],L.silver,.023,[0,0,r*s]);Rt(i,.415,.438,.135,[0,0,.066],L.silver),_e(i,.394,.027,[0,0,.143],L.silver),Za(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*He/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*He/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),tn(s,r,r,a,1700)}),z(i,[.019,.244,.009],[-.038,.102,.18],L.black,.003,[0,0,.36]),z(i,[.012,.31,.008],[.105,.067,.19],L.black,.002,[0,0,-1]),z(i,[.004,.45,.003],[-.09,-.012,.201],L.copper,.001,[0,0,1.71]),Rt(i,.018,.02,.015,[0,0,.205],L.gold),bc(i,.371,.018,[0,0,.211]),Rt(i,.056,.057,.1,[.468,0,.04],L.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*He/18;z(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],L.silver,.001,[r,0,0])}const e=new hi;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new Pa;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),Ls(i,e,.025,L.silver,[0,1,.02]),z(i,[.02,.23,.018],[0,1,.065],L.silver,.003),Rt(i,.392,.392,.02,[0,0,-.104],L.silver),ze(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),ze(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;Da(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new U().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function sx(i){z(i,[1.6,1,.166],[0,0,0],L.black,.07),z(i,[1.46,.77,.026],[0,.075,.092],L.rubber,.04),Un(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),tn(t,e,n,s,1200)}),z(i,[1.07,.276,.012],[0,-.044,.121],L.black,.04);for(const t of[-.405,.405]){Rt(i,.176,.176,.018,[t,-.038,.132],L.rust),Rt(i,.112,.112,.023,[t,-.038,.146],L.paper),Rt(i,.063,.063,.027,[t,-.038,.152],L.black);for(let e=0;e<6;e++){const n=e*He/6;z(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],L.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])_e(i,e,.002,[t,-.038,.147],L.black)}for(let t=-.2;t<.23;t+=.043)z(i,[.012,.08,.008],[t,-.04,.137],L.silver,.001);z(i,[1.16,.205,.035],[0,-.374,.105],L.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])Da(i,t,e,.098,.024);for(const t of[-.44,.44])Rt(i,.049,.049,.008,[t,-.389,.131],L.rubber);for(let t=0;t<20;t++)z(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],L.leather,.001);Un(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);tn(t,e,n,s,800)},[0,Math.PI,0])}function rx(i){bt(gf([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],L.cream,44),L.cream,i);for(const e of[-1,0,1]){const n=Mi(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],L.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new hi;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),Ls(i,t,.13,L.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){Mi(i,[.012,.014,.007],[.43,.405,e*.164],L.black),xn(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,L.gold,30);for(let n=0;n<4;n++)xn(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,L.gold,12)}Rt(i,.29,.32,.045,[-.04,-.415,0],L.cream,[0,0,0]),ze(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function ax(i){z(i,[1.02,1.48,.253],[.025,0,0],L.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;z(i,[1.02,.002,.001],[.025,.742,n],e%5?L.paper:L.rust,0),z(i,[.002,1.45,.001],[.537,0,n],e%4?L.paper:L.rust,0)}z(i,[1.15,1.58,.045],[0,0,.155],L.red,.015),z(i,[1.15,1.58,.045],[0,0,-.155],L.red,.015),z(i,[.095,1.57,.34],[-.56,0,0],L.red,.025),Un(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),tn(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])z(i,[.106,.015,.347],[-.556,e,0],L.red,.007);ze(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new Dt({color:5724487,roughness:1});z(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),ze(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function ox(i){_e(i,.28,.055,[0,.41,0],L.gold),_e(i,.219,.012,[0,.41,.034],L.copper),Rt(i,.046,.048,.92,[0,-.29,0],L.gold,[0,0,0],32),z(i,[.25,.09,.1],[.092,-.745,0],L.gold,.012),z(i,[.09,.1,.105],[.171,-.64,0],L.gold,.007),z(i,[.065,.17,.095],[.037,-.7,0],L.gold,.009),_e(i,.34,.014,[0,.72,-.01],L.silver,[.23,0,.08]),_e(i,.331,.009,[0,.72,-.018],L.silver,[.23,0,.08]),z(i,[.24,.34,.037],[.37,.34,-.03],L.leather,.028,[0,0,-.22]),ze(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),_e(i,.055,.012,[.33,.535,-.02],L.silver),ze(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function lx(i){const t=new hi;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),Ls(i,t,.055,L.gold,[0,0,-.03]);const e=t.clone();Ls(i,e,.009,L.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),Un(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])Mi(i,[.014,.021,.002],[s,r,.044],L.gold);xn(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,L.silver,14),Rt(i,.04,.04,.045,[-.23,.18,-.059],L.silver),ze(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function cx(i){Rt(i,.83,.83,.022,[0,0,0],L.black,void 0,96);const t=oe((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,He),s.stroke()},1024),e=oe((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,f=Math.hypot(c,h)||1,p=Math.sin(f*2.2)*.22,u=(o*r+l)*4;a.data[u]=128+127*p*c/f,a.data[u+1]=128+127*p*h/f,a.data[u+2]=253,a.data[u+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=cn;const n=new Dt({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new rt(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){bt(new Ei(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new pe;i.add(r),r.rotation.y=s===1?0:Math.PI,Za(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,He),a.stroke(),tn(a,o,o,l,1500)}),Rt(r,.018,.018,.01,[0,0,.022],L.rubber)}}function hx(i){const t=new ys({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=Yi(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new ys({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});Rt(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),Rt(i,.11,.11,.16,[0,.49,0],L.gold,[0,0,0]),Ua(i,.112,.1,[0,.49,0],28,L.gold,"y"),Yi(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),Un(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),tn(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function ux(i){z(i,[1.27,.08,.55],[0,-.72,0],L.bronze,.032),z(i,[1.35,.04,.61],[0,-.78,0],L.black,.02),bt(gf([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],L.bronze),L.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;xn(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,L.bronze),Mi(i,[.051,.057,.04],[e+s,-.43,n],L.bronze),z(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],L.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=Yi(i,[[0,0],[.041,0],[.034,.1],[0,.18]],L.bronze,[.333,.525,e],16);n.rotation.z=.15,Mi(i,[.015,.015,.008],[.457,.49,t*.127],L.black),Mi(i,[.012,.01,.006],[.648,.404,t*.083],L.black)}for(let t=0;t<12;t++)xn(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,L.bronze,10);xn(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,L.bronze);for(let t=0;t<5;t++)xn(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,L.gold,14);xn(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,L.gold,16),ze(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function fx(i){Rt(i,.51,.53,.145,[0,0,0],L.gold),_e(i,.503,.018,[0,0,.075],L.gold),Ua(i,.51,.072,[0,0,-.018],72,L.gold),Za(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*He/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*He/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),tn(e,n,n,s,1800)});const t=new hi;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),Ls(i,t,.007,L.red,[0,0,.103],[0,0,-.38],.001),Ls(i,t,.007,L.silver,[0,0,.103],[0,0,Math.PI-.38],.001),Rt(i,.027,.027,.025,[0,0,.121],L.gold),bc(i,.468,.013,[0,0,.142]),_e(i,.109,.025,[0,.635,0],L.gold),Rt(i,.059,.065,.092,[0,.523,0],L.gold,[0,0,0]),Rt(i,.465,.465,.02,[0,0,-.086],L.gold),ze(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),ze(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function dx(i){Yi(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],L.glass);for(const n of[.817,.862])_e(i,.116,.009,[0,n,0],L.glass,[Math.PI/2,0,0]);const t=oe((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),tn(n,s,a,r,2800)},768,460),e=new Dt({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:Ie});bt(new bn(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),ze(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function px(i){const t=L.silver.clone();t.roughness=.46,Yi(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)_e(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);Rt(i,.404,.404,.015,[0,-.347,0],L.rust,[0,0,0]);const e=new pe;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),Rt(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),_e(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),_e(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),z(e,[.067,.025,.11],[0,.028,.33],t,.015),Un(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),tn(n,s,r,a,2600)}),Un(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),tn(n,s,r,a,2400)},[0,Math.PI,0])}function mx(i){const t=oe((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),tn(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,He),r.fill()},768,768),e=new Dt({map:t,roughness:.98,side:Ie,bumpMap:L.paper.bumpMap,bumpScale:.009}),n=new bn(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),f=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+f,o,l*h)}n.computeVertexNormals(),bt(n,e,i),_e(i,.355,.016,[0,.44,0],L.paper,[Math.PI/2,0,0]),Rt(i,.232,.232,.015,[0,-.437,0],L.paper,[0,0,0]),Rt(i,.224,.224,.008,[0,-.421,0],L.rust,[0,0,0]),xn(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,L.paper)}function gx(i){const t=oe((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);tn(s,r,r,a,3500)}),e=new Dt({map:t,roughness:.97,bumpMap:L.paper.bumpMap,bumpScale:.008,side:Ie});z(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])z(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])z(i,[.029,.75,.8],[s,-.065,0],e,.006);z(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),z(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),z(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),z(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)Rt(i,.005,.005,.027,[s,.319,.399],L.paper,[0,0,0],6);Un(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);tn(s,r,a,o,1200)}),Un(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new Dt({color:11114860,roughness:.4,transparent:!0,opacity:.66});z(i,[.12,.74,.006],[.25,-.05,.421],n,.001),z(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function _x(i){Rt(i,.507,.507,.036,[0,0,0],L.rust,void 0,80),_e(i,.504,.014,[0,0,.017],L.silver);for(const e of[.448,.408])_e(i,e,.009,[0,0,.024],L.rust);const t=Jn(77);for(let e=0;e<9;e++){const n=t()*He,s=.465+t()*.015;Mi(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],L.silver)}for(let e=0;e<24;e++){const n=e*He/24;z(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],L.rust,.007,[0,0,-n])}ze(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function xx(i){const t=oe((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),tn(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,He),n.fill()},1024,1280),e=new Dt({map:t,roughness:1,side:Ie,bumpMap:L.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new re(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++)r.getX(a),r.getY(a),r.setZ(a,n*.004);s.computeVertexNormals(),bt(s,e,i)}}const vx={camera:ex,teacup:nx,watch:ix,cassette:sx,duck:rx,book:ax,key:ox,badge:lx,record:cx,perfume:hx,horse:ux,compass:fx,bottle:dx,can:px,cup:mx,box:gx,lid:_x,paper:xx};function yx(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===L.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new kt("#977145"),c=new kt("#355d53");for(let h=0;h<a.count;h++){const f=a.getX(h),p=a.getY(h),u=a.getZ(h),m=Math.sin(f*15+Math.sin(p*9))*Math.sin(p*19+u*12)*Math.cos(u*21-f*6),_=De.clamp((m+.12)*.85,0,.8);l.clone().lerp(c,_).toArray(o,h*3)}s.setAttribute("color",new Ue(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=uf(s,!1);bt(r,n,i),s.forEach(a=>a.dispose())}return e}function ko(i){const t=new pe;vx[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const f=new U().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);f.set(...j_(i,f.x,f.y,f.z)).applyMatrix4(c),l.setXYZ(h,f.x,f.y,f.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=yx(t),n=new Dn().setFromObject(t),s=n.getCenter(new U),r=n.getSize(new U);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new pe;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const ca=Jn(370);function Mx(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function Tc(i,t,e,n,s){const r=new re(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function yn(i,t,e,n,s=[1,1,1],r=1){const a=bt(new Va(t,r),n,i,e);return a.scale.set(...s),a}function Mn(i,t,e,n,s=[1,1,1],r=1){const a=bt(new Va(t,r),n,i,e);return a.scale.set(...s),a}function Sx(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function $a(i,t,e,n,s=24){return bt(new Wn(new Xi(t.map(r=>new U(...r))),s,e,5,!1),n,i)}function bx(){return oe((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(u,m,_,g,d)=>{i.fillStyle=d,i.fillRect(u,m,_,g)},c=(u,m,_,g,d)=>{i.fillStyle=d,i.beginPath(),i.ellipse(u,m,_,g,0,0,Math.PI*2),i.fill()},h=(u,m,_,g="rgba(255,198,106,")=>{const d=i.createRadialGradient(u,m,0,u,m,_);d.addColorStop(0,g+".62)"),d.addColorStop(1,g+"0)"),i.fillStyle=d,i.fillRect(u-_,m-_,_*2,_*2)},f=(u,m,_="#4b2d1e")=>{const g=i.createLinearGradient(0,0,0,r);g.addColorStop(0,u),g.addColorStop(1,m),i.fillStyle=g,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,_),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},p=(u,m)=>{i.save(),i.translate(u%4*s,Math.floor(u/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),m(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};p(0,()=>{f("#bd8745","#70452a"),l(16,58,122,316,"#382313");const u=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let m=0;m<5;m++){const _=78+m*58;l(22,_+38,110,6,"#20130b");let g=27;for(;g<124;){const d=5+e()*9;l(g,_+38-(24+e()*12),d,24+e()*12,u[Math.floor(e()*u.length)]),g+=d+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),p(1,()=>{f("#a8ad7d","#66704e","#40392a");for(let u=0;u<3;u++){const m=86+u*72;l(22,m,190,7,o);for(let _=0;_<6;_++){const g=34+_*31;l(g,m-(20+(_+u)%3*7),15,20+(_+u)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][_%4]),l(g+2,m-(27+(_+u)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const u of[62,112,168])i.beginPath(),i.moveTo(u,306),i.lineTo(u,326),i.stroke(),c(u,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),p(2,()=>{f("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),p(3,()=>{f("#8fae94","#55705e","#33473a");for(let u=0;u<3;u++){const m=120+u*104;l(18,m,220,8,"#2c2117");for(let _=0;_<4;_++){const g=42+_*54;l(g-13,m-25,26,25,"#8a5138");for(let d=0;d<6;d++){const x=-2.4+d*.45;c(g+Math.cos(x)*17,m-34+Math.sin(x)*19,11,5,d%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const u of[38,96,204]){i.beginPath(),i.moveTo(u,0),i.quadraticCurveTo(u+14,72,u-4,142),i.stroke();for(let m=0;m<6;m++)c(u+(m%2?9:-8),24+m*21,10,5,m%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),p(4,()=>{f("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const u of[48,112,190])l(u,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let u=0;u<4;u++)i.beginPath(),i.moveTo(100,292+u*6),i.lineTo(136,292+u*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),p(5,()=>{f("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let u=0;u<5;u++)l(26+u*15,410-u*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][u]);h(218,166,50)}),p(6,()=>{f("#8299a4","#4f6875","#31424b");const u=i.createLinearGradient(38,96,218,250);u.addColorStop(0,"#b9d5df"),u.addColorStop(.55,"#688b9c"),u.addColorStop(1,"#314f62"),i.fillStyle=u,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),p(7,()=>{f("#b49aa4","#76606d","#463945");for(let u=0;u<5;u++){l(24,78+u*8,70,4,"rgba(50,35,42,.45)");for(let m=0;m<4;m++)l(31+m*16,58+u*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][m])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function Tx(){return oe((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,f,p="#2e342b",u="Georgia")=>{i.fillStyle=p,i.font=`bold ${f}px ${u}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const We={};function Nn(){if(We.stone)return We;We.stone=new Dt({color:7566439,roughness:.86,map:Sa("plaster.jpg")}),We.iron=new Dt({color:2633768,metalness:.72,roughness:.6}),We.green=new Dt({color:4216121,roughness:.9,flatShading:!0,side:Ie}),We.shadowMap=oe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),We.contact=new Ke({map:We.shadowMap,transparent:!0,depthWrite:!1}),We.wood=new Dt({color:7427130,roughness:.92}),We.leafDark=new Dt({color:3099956,roughness:1,flatShading:!0}),We.poster=new Dt({map:Tx(),roughness:.96}),We.bulb=new Dt({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=oe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);We.glow=new Ke({map:i,color:16757350,transparent:!0,opacity:.42,blending:lr,depthWrite:!1,side:Ie});const t=oe((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);We.chalk=new Ke({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=oe((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return We.chess=new Dt({map:e,roughness:.8}),We}function Ex(i,t,e=14,n=0){const s=new Ke({map:mf(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});bt(new re(t,1.45),s,i,[0,.72,.342]);const r=oe((u,m,_)=>{u.fillStyle="#605d4c",u.fillRect(0,0,m,m);for(let g=0;g<12;g++)for(let d=-1;d<7;d++){const x=d*87+g%2*43,y=g*45;u.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(_()*4)],u.fillRect(x+3,y+3,81,39),u.fillStyle="rgba(28,29,21,.22)",u.fillRect(x+3,y+36,81,5)}u.globalCompositeOperation="destination-in",u.beginPath();for(let g=0;g<60;g++){const d=g*Math.PI/30,x=185+_()*60;u.lineTo(m/2+Math.cos(d)*x,m/2+Math.sin(d)*x*.7)}u.closePath(),u.fill()}),a=new Dt({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[u,m,_]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])bt(new re(_*2,_),a,i,[u,m,.349]);const o=Nn();for(const[u,m,_]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])bt(new re(.17,_),s,i,[u,m,.344]);let l=0;for(let u=-t/2+1.55;u<t/2-1.1;u+=2.85,l++){if(n===0&&Math.abs(u+3.8)<1.65)continue;const m=(l+n)%4===1;z(i,[.78,.48,.06],[u,.39,.425],m?yf:L.black,0),z(i,[.9,.07,.09],[u,.665,.44],o.stone,0),z(i,[.9,.06,.1],[u,.125,.45],o.stone,0);for(const g of[-.24,0,.24])z(i,[.02,.44,.02],[u+g,.39,.47],L.black,0);const _=u+1.42;if(_<t/2-.7){z(i,[.34,.24,.035],[_,.92,.342],L.black,0);for(let g=0;g<3;g++)z(i,[.28,.025,.012],[_,.86+g*.07,.365],L.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;bt(Tc(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=Jn(910+n),f=[[-t/2+.58,0],[t/2-.58,2]];n===0&&f.push([-5.32,1]);for(const[u,m]of f)for(let _=0;_<30;_++){const g=.5+_*.17+h()*.09,d=u+Math.sin(_*.55+m)*.28+(h()-.5)*.2;bt(new Ei(.055+h()*.08,7),_%3?o.leafDark:o.green,i,[d,g,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const u of[-t*.3,t*.24])z(i,[.78,.98,.78],[u,e+.48,-.05],o.stone,0),z(i,[.94,.13,.94],[u,e+1.02,-.05],o.stone,0),Rt(i,.09,.11,.24,[u-.16,e+1.19,-.05],L.rust,[0,0,0],10),Rt(i,.09,.11,.24,[u+.16,e+1.19,-.05],L.rust,[0,0,0],10);for(const u of[-t*.12,t*.36])Rt(i,.018,.018,1.42,[u,e+.76,.18],L.black,[0,0,0],8),z(i,[.88,.025,.025],[u,e+1.12,.18],L.black,0),z(i,[.58,.025,.025],[u,e+1.36,.18],L.black,0),z(i,[.025,.025,.72],[u,e+1.24,.18],L.black,0);const p=t*.16;bt(new bn(.37,.09,.13,20),L.silver,i,[p,e-1.48,.56],[1.02,0,-.32]),$a(i,[[p-.18,e-1.62,.34],[p,e-1.5,.58]],.016,L.black,4);for(let u=0;u<6;u++){if((u+n)%4===3)continue;const m=-t*.34+u*t*.13,_=e+.13;yn(i,.058,[m,_,.48],o.stone,[1.45,.82,.9],0),Mn(i,.032,[m+.065,_+.055,.49],L.black),z(i,[.11,.014,.035],[m-.085,_+.015,.47],L.black,0,[0,.2,.18])}}function _f(i,t,e,n,s,r,a,o){z(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),z(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])z(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),z(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);z(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],L.silver,0),z(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let ha;function wx(){if(ha)return ha;const i=oe((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=bx(),e=oe((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return ha={curtain:new Dt({map:i,roughness:1,side:Ie}),blind:new Dt({color:10067089,roughness:.9}),leaf:new Dt({color:4087359,roughness:1,flatShading:!0}),pot:new Dt({color:8414289,roughness:.94}),interior:new Dt({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new Dt({map:e,transparent:!0,alphaTest:.06,roughness:1,side:Ie})},ha}function xf(i,t,e=1,n=0,s=L.black){const r=new pe;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),yn(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),Mn(r,.086,[0,.325,.13],s);for(const a of[-1,1])bt(new bn(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),Rt(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return $a(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function vf(i,t,e,n,s,r,a,o,l=0){const c=wx(),h=Nn(),f=Mx(l+811),p=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),u=(m=.574)=>{for(const _ of[-1,1]){const g=new re(n*.27,s*.91,5,6),d=g.attributes.position;for(let x=0;x<d.count;x++)d.setZ(x,.008*Math.sin(d.getX(x)*80));g.computeVertexNormals(),bt(g,c.curtain,i,[t+_*n*.34,e-.025,m]),z(i,[.035,.09,.025],[t+_*n*.24,e-.08,m+.018],L.gold,0)}bt(new re(n*.96,s*.17),c.lace,i,[t,e+s*.39,m+.004])};if(r==="lit")bt(Tc(n*.97,s*.97,f%8,4,2),c.interior,i,[t,e,.566]),f%3===0&&u(.576),f%4===1&&(Rt(i,.006,.006,.34,[t+.18,e+s*.31,.59],L.black,[0,0,0],6),Rt(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),Mn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")u();else if(r==="blind"){for(let m=0;m<12;m++)z(i,[n*.94,.04,.019],[t,e+s/2-.08-m*.093,.581],c.blind,0,m>8?[.32,0,0]:[0,0,0]);for(const m of[-1,1])z(i,[.012,s*.68,.012],[t+m*n*.39,e+s*.08,.594],L.black,0);z(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const m=new pe;m.position.set(t-n/2,e,.6),m.rotation.y=-.42,i.add(m),z(m,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const _ of[0,n*.48])z(m,[.038,s*.94,.05],[_,0,.025],a,0);for(const _ of[-s*.47,s*.47])z(m,[n*.5,.038,.05],[n*.24,_,.025],a,0);z(m,[n*.48,.032,.05],[n*.24,.23,.025],a,0),Rt(m,.014,.014,.1,[n*.45,-.05,.065],L.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&f%3===0){const m=t+(f%2?.29:-.29);Rt(i,.1,.075,.15,[m,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const _ of[-1,0,1])yn(i,.07,[m+_*.055,e-s/2+.17,.79],_?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&f%5===0&&xf(i,[t-.17,e-s/2-.015,.8],.58,0,L.black),p>0&&p<3){if(f%9===2){z(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let m=0;m<6;m++)yn(i,.07,[t-n*.31+m*n*.12,e-s/2+.17,.74],m%2?h.green:c.leaf,[1.2,.72,.8],0);for(let m=0;m<7;m++)yn(i,.022,[t-n*.33+m*n*.105,e-s/2+.21,.78],m%3?L.red:L.cream,[1,1,1],0)}else if(f%11===5){z(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),bt(new bn(.15,.15,.025,20),L.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const m of[-.1,0,.1])z(i,[.42,.018,.012],[t+.16,e-s/2-.39+m,.735],L.black,0);z(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],L.black,0)}else if(f%13===6)for(const m of[-1,1]){z(i,[.24,s*.9,.035],[t+m*(n/2+.18),e,.55],h.leafDark,0);for(let _=0;_<5;_++)z(i,[.18,.025,.014],[t+m*(n/2+.18),e-s*.3+_*s*.15,.575],L.black,0)}}if(p===0&&r!=="open"&&f%3===1){for(const m of[-.36,-.18,0,.18,.36])z(i,[.018,s*.85,.018],[t+m*n,e,.645],L.black,0);for(const m of[-s*.28,s*.28])z(i,[n*.84,.02,.02],[t,e+m,.65],L.black,0)}if(p>=2&&f%11===0){const m=t+n*.24,_=e-s/2+.025;yn(i,.055,[m,_,.76],h.stone,[1.45,.82,.9],0),Mn(i,.031,[m+.062,_+.052,.76],L.black),z(i,[.1,.013,.032],[m-.082,_+.012,.76],L.black,0,[0,.15,.16])}}function Ax(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=Nn();Rt(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),_e(i,.56,.015,[2.5,.033,2.5],L.rust,[Math.PI/2,0,0]),_e(i,.62,.014,[2.5,.033,2.5],L.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;z(i,[h,.012,.018],[2.5,.04,2.5+c*.085],L.black,.003)}for(const c of[2.23,2.77])z(i,[.05,.01,.11],[c,.049,2.5],L.black,.005);for(const c of[-4.55,4.55]){z(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),Rt(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),Rt(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),Mn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new Ia(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}z(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)z(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new Xi([new U(-6,5.3,-6.5),new U(-1,4.96,-6.47),new U(4.2,5.31,-6.46)]);bt(new Wn(o,24,.011,5),L.rubber,i);const l=oe((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[f,p]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(p,h/2,165+f*41);c.strokeStyle="#555b4d";for(let f=28;f<h;f+=43)c.beginPath(),c.moveTo(f,h-90),c.lineTo(f,h),c.stroke()});bt(new re(.42,.56),new Dt({map:l,roughness:.95,side:Ie}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,f,p]of[...lf.map(u=>[u.x,u.z,u.scale*3.5,u.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])bt(new re(f,p),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+ca()*1.3,f=-6+ca()*6,p=.03+ca()*.13,u=new hi;u.moveTo(-.012,0),u.quadraticCurveTo(.014,p*.7,.025,p),u.lineTo(.006,0),bt(new Xa(u),s,i,[h,.025,f],[0,ca()*6,0])}Ix(i)}function Jh(i,t,e){const n=Nn(),s=new pe;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])z(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])z(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])z(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),z(s,[.055,.04,.56],[r*.84,.67,0],L.rust,0),z(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function ua(i,t,e,n,s){const r=Nn(),a=new pe,o=Jn(s);a.position.set(...t),a.rotation.y=e,i.add(a),z(a,[n,.1,.78],[0,.05,0],L.rust,0);for(const c of[-1,1]){z(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),z(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)z(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,f=(o()-.5)*.42,p=c%3?r.leafDark:r.green;yn(a,.15+o()*.15,[h,.19+o()*.08,f],p,[1.45,.58,.95],0),yn(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,f+(o()-.5)*.18],p,[1.3,.62,.9],0),yn(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,f+(o()-.5)*.16],p,[1.2,.6,.9],0)}for(let c=0;c<18;c++)yn(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[L.red,L.cream,L.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)bt(new bn(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function Rx(i,t,e,n,s=9){const r=Nn();$a(i,Sx(t,e,n,7),.007,L.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;z(i,[.006,.07,.006],[l,c-.035,h],L.black,0),Mn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function fa(i,t,e,n,s){const r=Nn();z(i,[.07,.36,.13],[t,e,n],r.iron,.01),Rt(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),Rt(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),Mn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),bt(new re(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function Cx(i,t,e,n=1){const s=Nn(),r=new pe;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),yn(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),Mn(r,.037,[0,.135,.085],L.black),bt(new bn(.001,.011,.038,5),L.gold,r,[0,.13,.128],[Math.PI/2,0,0]),z(r,[.075,.014,.1],[0,.075,-.105],L.black,0,[.22,0,0]);for(const a of[-1,1])z(r,[.008,.055,.008],[a*.025,.028,.01],L.rust,0);return r}function Px(i,t,e){const n=Nn(),s=new pe;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])z(s,[1.08,.026,.105],[0,a+.055,o],r%2?L.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])z(s,[.1,.085,.1],[o,a,l],L.rust,0)}return z(s,[.58,.38,.48],[.05,.72,0],L.paper,.01,[0,.12,0]),s}function Ix(i){const t=Nn();Jh(i,[-5.45,0,-.75],Math.PI/2),Jh(i,[5.7,0,-5.25],0),ua(i,[-7.02,0,1.95],Math.PI/2,4.8,21),ua(i,[8.02,0,1.75],Math.PI/2,4.3,33),ua(i,[5.95,0,-6.08],0,3.5,47),ua(i,[-6.35,0,-6.08],0,2.1,58),Rx(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),fa(i,-7.62,2.75,-4.9,1),fa(i,-7.62,2.75,3.8,1),fa(i,8.62,2.75,-4.9,-1),fa(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;z(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),z(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}Rt(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),z(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),bt(new re(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])Rt(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),Rt(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)Mn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?L.black:L.cream,[1,.75,1],0);Px(i,[-6.5,0,-4.9],.15);const e=new pe;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),z(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])z(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],L.rust,0);Mn(e,.035,[.075,1.02,.34],L.silver);for(let a=0;a<3;a++)bt(new xr(.34,.105,8,26),L.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);bt(new xr(.34,.105,8,26),L.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new pe;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),z(n,[.62,.58,1.72],[0,.58,0],L.leather,.18),z(n,[.54,.46,1],[0,1.02,-.12],L.leather,.19),z(n,[.5,.34,.46],[0,1.04,.58],L.leather,.16);for(const a of[-.42,.22])z(n,[.65,.018,.035],[0,.84,a],L.black,0);for(const a of[-.58,.58])bt(new bn(.29,.29,.09,20),L.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new pe;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),z(s,[.1,.035,.6],[0,.1,0],L.red,.01);for(const a of[-.25,.25])bt(new bn(.075,.075,.035,14),L.black,s,[0,.075,a],[0,0,Math.PI/2]);$a(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,L.silver,8),z(s,[.36,.025,.025],[0,.78,.4],L.black,0),bt(new re(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),Mn(i,.16,[-4.72,.16,1.85],L.red,[1,.92,1]),xf(i,[-4.32,0,-.22],1,1.49,L.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>Cx(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)yn(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],L.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const f=bt(new re(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);f.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])bt(new re(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const yf=new Dt({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function Lx(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])Rt(i,.027,.027,.016,[o,l,.854],L.silver,void 0,8),z(i,[.016,.003,.005],[o,l,.866],L.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=Mi(i,[.013,.035,.007],[o*1.155,l,.827],L.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])z(i,[.21,.06,.3],[o,.42,.6],L.silver,.018),z(i,[.075,.025,.21],[o,.305,.81],L.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){z(t,[.2,.032,.2],[o,.114,.12],L.silver,.008);for(const l of[-.065,.065])Rt(t,.022,.022,.012,[o+l,.139,.12],L.silver,[0,0,0],8)}const n=new Dt({color:1055507,roughness:.94});z(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=oe((o,l,c)=>{for(let h=0;h<1800;h++){const f=c(),p=c();f>.1&&f<.9&&p<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(f*l,p*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const f=o.createLinearGradient(0,0,0,l);f.addColorStop(0,"rgba(67,42,24,0)"),f.addColorStop(.5,"rgba(67,42,24,.35)"),f.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=f,o.fillRect(h*l,0,6,l)}}),r=new Dt({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});bt(new re(2.35,1.43),r,i,[0,1.18,.876]),bt(new re(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])z(t,[.025,.006,.48],[o,.114,1.6],L.silver,.002);const a=oe((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});bt(new re(.42,.37),new Dt({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const Dx=new Dt({color:3883064,roughness:.82});function Ux(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const f=Nn(),p=Jn(c*7+13),u=1.55,m=2.55,_=u,g=m+_,d=new hi;d.moveTo(-t/2,0),d.lineTo(t/2,0),d.lineTo(t/2,e),d.lineTo(-t/2,e),d.closePath();const x=new Pa;x.moveTo(h-u,0),x.lineTo(h-u,m),x.absarc(h,m,_,Math.PI,0,!0),x.lineTo(h+u,0),x.closePath(),d.holes.push(x),bt(new Ga(d,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[I,F]of[[-t/2,h-u-.12],[h+u+.12,t/2]])z(i,[F-I,.75,.78],[(I+F)/2,.375,.025],n,0);for(const I of[3.28,6.2,9.15])for(const[F,O]of[[-t/2,h-u-.12],[h+u+.12,t/2]]){const k=O-F;k<.5||(z(i,[k,.14,.87],[(F+O)/2,I,.055],s,0),z(i,[k,.07,.98],[(F+O)/2,I+.09,.08],n,0))}z(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const I of[-1,1])z(i,[.36,m+.05,.62],[h+I*(u+.18),m/2,.06],n,.02);const v=new pr(0,0,_+.2,_+.2,0,Math.PI,!1,0).getPoints(30).map(I=>new U(I.x,I.y,0));bt(new Wn(new Xi(v),30,.17,7,!1),n,i,[h,m,.06]),z(i,[.26,.62,.72],[h,g+.16,.09],n,.02);for(let I=1;I<7;I++){const F=Math.PI*I/7,O=Math.cos(F)*(_+.2),k=Math.sin(F)*(_+.2);z(i,[.17,.3,.52],[h+O,m+k,.03],n,.012,[0,0,-F+Math.PI/2])}const A=new Dt({color:1909020,roughness:.96});z(i,[u*2+.6,.06,3.6],[h,0,-1.85],n,0),z(i,[.24,4.6,3.6],[h-u-.32,2.3,-1.85],A,0),z(i,[.24,4.6,3.6],[h+u+.32,2.3,-1.85],A,0),z(i,[3.4,.2,3.6],[h,g+.62,-1.85],n,0),z(i,[3.4,4.8,.12],[h,2.4,-3.7],A,0);const b=oe((I,F)=>{const O=I.createLinearGradient(0,0,0,F);O.addColorStop(0,"rgba(52,60,58,1)"),O.addColorStop(.42,"rgba(85,74,54,1)"),O.addColorStop(1,"rgba(34,38,34,1)"),I.fillStyle=O,I.fillRect(0,0,F,F);const k=I.createRadialGradient(F*.5,F*.3,0,F*.5,F*.3,F*.46);k.addColorStop(0,"rgba(255,198,118,.95)"),k.addColorStop(.45,"rgba(255,174,92,.38)"),k.addColorStop(1,"rgba(255,160,80,0)"),I.fillStyle=k,I.fillRect(0,0,F,F)});bt(new re(3.2,4.6),new Ke({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),bt(new re(3,4.2),new Ke({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),z(i,[1.1,.4,.36],[h-.55,2.1,-2.1],A,0),z(i,[.5,.9,.3],[h+.7,.28,-2.2],A,0);const w=(I,F=0)=>{const O=new pe,k=u-.06,X=m-.1;O.position.set(h+I*(u-.02),0,.02),O.rotation.y=I*F,i.add(O);const H=-I*k/2;for(const nt of[.07,X])z(O,[k,.1,.09],[H,nt,0],L.black,.012);for(const nt of[H-k/2+.045,H+k/2-.045])z(O,[.09,X,.09],[nt,X/2,0],L.black,.012);const K=.92;z(O,[k-.12,K,.07],[H,K/2+.1,0],Dx,.01);for(let nt=0;nt<3;nt++)z(O,[k-.18,.03,.09],[H,K*(nt+.5)/3+.1,.012],L.rust,0);for(let nt=H-k/2+.14;nt<H+k/2-.1;nt+=.17)z(O,[.03,X-K-.24,.03],[nt,K+.12+(X-K-.24)/2,.012],L.black,0);for(const nt of[X-.12,2.02,K+.32])z(O,[k-.14,.05,.055],[H,nt,.012],L.black,0);for(const nt of[.42,.95])Rt(O,.035,.035,.09,[H+I*(k/2-.02),nt,0],L.black,[0,0,0],10);return _e(O,.1,.013,[H,X*.8,.02],L.black),O};w(-1,.3),w(1,0);for(let I=-3;I<=3;I++){const F=h+I*.42,O=Math.sqrt(Math.max(0,_*_-F*F)),k=m+O*.96,X=m-.1;k-X<.12||z(i,[.028,k-X,.028],[F,(k+X)/2,.055],L.black,0)}const M=new pr(0,0,_-.02,_-.02,0,Math.PI,!1,0).getPoints(20).map(I=>new U(I.x,I.y,0));bt(new Wn(new Xi(M),20,.03,5,!1),L.black,i,[h,m,.055]);for(let I=0;I<5;I++){const F=Math.PI*(I+1)/6;z(i,[.05,.05,.05],[h+Math.cos(F)*(_-.02),m+Math.sin(F)*(_-.02),.075],L.black,0)}Rt(i,.02,.02,.5,[h,g+.9,.36],L.black,[0,0,0],8),Rt(i,.11,.2,.14,[h,g+.5,.36],L.black,[0,0,0],14),Mn(i,.082,[h,g+.4,.36],f.bulb,[1,1.45,1],0),bt(new re(1.5,1.5),f.glow,i,[h,g+.36,.5]);const S=new Dt({map:kl("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});z(i,[.62,.46,.06],[h+2.3,2.35,.35],L.black,0),bt(new re(.57,.41),S,i,[h+2.3,2.35,.39]);const C=Math.floor(t/2.47);for(let I=0;I<C;I++)for(let F=0;F<4;F++){const O=(I-(C-1)/2)*2.47,k=1.72+F*2.95;if(Math.abs(O-h)<3.3&&F<2)continue;const X=1.16,H=1.91,K=300+F*10+I;z(i,[X+.26,H+.27,.14],[O,k,.38],s,0),z(i,[X+.05,H+.06,.1],[O,k,.47],r,0);const nt=cf(I,F,2),lt=nt==="lit"?l:o[(I+F)%o.length];z(i,[X,H,.04],[O,k,.54],lt,0);for(const Ct of[-X/2,X/2,0])z(i,[.048,H,.09],[O+Ct,k,.58],n,0);for(const Ct of[-H/2,H/2,.24])z(i,[X,.047,.09],[O,k+Ct,.58],n,0);z(i,[X+.4,.12,.43],[O,k-H/2-.09,.55],s,0),_f(i,O,k,X,H,n,r,s),F>=1&&vf(i,O,k,X,H,nt,s,lt,K)}for(const I of[-t/2+.35,t/2-.38]){Rt(i,.07,.07,e,[I,e/2,.53],r,[0,0,0],12);for(let F=1;F<e;F+=2)Rt(i,.087,.087,.055,[I,F,.53],L.rust,[0,0,0],12)}const D=new Ke({map:mf(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[I,F]of[[-t/2,h-u-.5],[h+u+.5,t/2]].filter(([O,k])=>k-O>1))bt(new re(F-I,.9),D,i,[(I+F)/2,.55,.345]);bt(Tc(.48,.64,c%4,2,2),f.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let I=0;I<22;I++){const F=I<11?-t/2+.55:t/2-.55,O=F+Math.sin(I*.55)*.26+(p()-.5)*.2;bt(new Ei(.05+p()*.075,7),I%3?f.leafDark:f.green,i,[O,.5+I*.17,.355+p()*.04],[0,0,p()*Math.PI])}for(const I of[-t*.32,t*.3])z(i,[.78,.98,.78],[I,e+.48,-.05],n,0),z(i,[.94,.13,.94],[I,e+1.02,-.05],n,0),Rt(i,.09,.11,.24,[I-.16,e+1.19,-.05],L.rust,[0,0,0],10),Rt(i,.09,.11,.24,[I+.16,e+1.19,-.05],L.rust,[0,0,0],10);return Rt(i,.018,.018,1.42,[t*.12,e+.76,.18],L.black,[0,0,0],8),z(i,[.88,.025,.025],[t*.12,e+1.12,.18],L.black,0),z(i,[.58,.025,.025],[t*.12,e+1.36,.18],L.black,0),i}function Kh(i,t,e,n,s){z(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),z(i,[t+.1,.08,1.28],[0,e+.36,.34],tr(s),0),bt(new Zn(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),z(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])z(i,[.16,.2,.16],[r,e+.62,.95],L.rust,0)}function tr(i){return tr.mat||(tr.mat=i.clone(),tr.mat.color.offsetHSL(0,-.03,.04)),tr.mat}function Nx(){const i=new pe;i.name="sky";const t=new Sr(55,32,18),e=[],n=new kt("#6a5142"),s=new kt("#253a55"),r=new kt("#08111f");for(let w=0;w<t.attributes.position.count;w++){const E=De.smoothstep(t.attributes.position.getY(w)/55,-.04,.62);(E<.4?n.clone().lerp(s,E/.4):s.clone().lerp(r,(E-.4)/.6)).toArray(e,w*3)}t.setAttribute("color",new ie(e,3));const a=new ye(t,new Ke({vertexColors:!0,side:qe,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=oe((w,E)=>{const M=w.createRadialGradient(E/2,E/2,0,E/2,E/2,E/2);M.addColorStop(0,"rgba(255,255,255,1)"),M.addColorStop(.34,"rgba(255,255,255,.86)"),M.addColorStop(.62,"rgba(255,255,255,.22)"),M.addColorStop(1,"rgba(255,255,255,0)"),w.fillStyle=M,w.fillRect(0,0,E,E)},64),l=Jn(20261),c=1150,h=[],f=[],p=new kt("#e6efff"),u=new kt("#ffe8c6"),m=new kt("#bcd3ff");for(let w=0;w<c;w++){const E=l()*Math.PI*2,M=.1+Math.pow(l(),.72)*1.42,S=49+l()*3,C=Math.cos(M);h.push(Math.sin(E)*C*S,Math.sin(M)*S,-Math.cos(E)*C*S);const D=l(),I=(D>.72?u:D>.34?p:m).clone(),F=De.clamp((M-.1)/.4,0,1),O=(.42+Math.pow(l(),1.5)*.58)*F;f.push(I.r*O,I.g*O,I.b*O)}const _=new we;_.setAttribute("position",new ie(h,3)),_.setAttribute("color",new ie(f,3));const g=new op(_,new Vu({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:lr,fog:!1,toneMapped:!1,alphaTest:.01}));g.renderOrder=-20,g.frustumCulled=!1,g.name="sky-stars",i.add(g);const d=new U(-.16,.883,-.442).normalize(),x=d.clone().multiplyScalar(44),y=oe((w,E,M)=>{const S=E*.47,C=E/2,D=E/2;w.clearRect(0,0,E,E);const I=w.createRadialGradient(C-S*.22,D-S*.26,S*.06,C,D,S);I.addColorStop(0,"#fbfcf7"),I.addColorStop(.62,"#e6e9ee"),I.addColorStop(.9,"#cfd5e0"),I.addColorStop(1,"#b9c1cf"),w.fillStyle=I,w.beginPath(),w.arc(C,D,S,0,Math.PI*2),w.fill(),w.save(),w.beginPath(),w.arc(C,D,S,0,Math.PI*2),w.clip();for(let O=0;O<26;O++){const k=M()*Math.PI*2,X=Math.sqrt(M())*S*.92,H=C+Math.cos(k)*X,K=D+Math.sin(k)*X,nt=S*(.03+M()*.13),lt=w.createRadialGradient(H,K,0,H,K,nt);lt.addColorStop(0,`rgba(132,142,160,${.1+M()*.17})`),lt.addColorStop(1,"rgba(132,142,160,0)"),w.fillStyle=lt,w.beginPath(),w.arc(H,K,nt,0,Math.PI*2),w.fill()}for(let O=0;O<5;O++){const k=M()*Math.PI*2,X=Math.sqrt(M())*S*.62,H=C+Math.cos(k)*X,K=D+Math.sin(k)*X,nt=S*(.16+M()*.16),lt=w.createRadialGradient(H,K,0,H,K,nt);lt.addColorStop(0,"rgba(150,158,174,.16)"),lt.addColorStop(1,"rgba(150,158,174,0)"),w.fillStyle=lt,w.beginPath(),w.arc(H,K,nt,0,Math.PI*2),w.fill()}const F=w.createRadialGradient(C,D,S*.2,C,D,S);F.addColorStop(0,"rgba(255,255,255,0)"),F.addColorStop(.78,"rgba(150,162,186,.13)"),F.addColorStop(1,"rgba(96,110,138,.42)"),w.fillStyle=F,w.beginPath(),w.arc(C,D,S,0,Math.PI*2),w.fill(),w.restore()},256);y.colorSpace=Be;const v=new nh(new Ll({map:y,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));v.position.copy(x),v.scale.set(2.25,2.25,1),v.name="sky-moon",i.add(v);const A=oe((w,E)=>{const M=w.createRadialGradient(E/2,E/2,0,E/2,E/2,E/2);M.addColorStop(0,"rgba(226,236,255,.9)"),M.addColorStop(.22,"rgba(198,216,255,.34)"),M.addColorStop(.5,"rgba(170,196,255,.10)"),M.addColorStop(1,"rgba(150,180,255,0)"),w.fillStyle=M,w.fillRect(0,0,E,E)},128),b=new nh(new Ll({map:A,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:lr,fog:!1,toneMapped:!1}));return b.position.copy(x).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:g,moon:v,glow:b,moonDirection:d.clone(),update(){}}}const ln=Jn(137);function Ho(i){i.updateWorldMatrix(!0,!0);const t=new ae().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new ae().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=uf(s,!1);if(r){const a=new ye(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class Fx{constructor(t){this.renderer=new N_({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=pu,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=Be,this.renderer.toneMapping=tc,this.renderer.toneMappingExposure=1.12,this.scene=new Il,this.scene.background=new kt("#16222f"),this.scene.fog=new uc("#1c2b3a",.0118),this.sky=Nx(),this.scene.add(this.sky.group),this.camera=new Xe(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new Xe(62,1,.1,70),this.eyeR=new Xe(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new U,this.baseCameraQuaternion=new vn,this.lockedCameraQuaternion=new vn,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null;const e=new zl(this.renderer),n=new G_;this.envTarget=e.fromScene(n,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.15,n.dispose(),e.dispose(),this.hemi=new fh(9087958,1318439,1.12),this.scene.add(this.hemi);const s=new ta(11127024,1.62);s.position.set(-6,11,2),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-6,s.shadow.camera.right=6,s.shadow.camera.top=7,s.shadow.camera.bottom=-6,s.shadow.normalBias=.012,s.shadow.bias=-25e-5,s.shadow.radius=3,this.scene.add(s),this.sun=s;const r=new ta(5338012,.62);r.position.set(5,5,-4),this.scene.add(r),this.static=new pe,this.scene.add(this.static),Zh(.5),this.buildCourtyard(),Zh(1),Ho(this.static),this.bin=new pe,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new ye(new re(1,1),new Ke({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new pe,this.silhouetteMat=new Ke({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new pe,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2);const a=oe((o,l)=>{const c=o.createRadialGradient(l/2,l/2,0,l/2,l/2,l/2);c.addColorStop(0,"rgba(3,7,11,.62)"),c.addColorStop(.55,"rgba(3,7,11,.34)"),c.addColorStop(1,"rgba(3,7,11,0)"),o.fillStyle=c,o.fillRect(0,0,l,l)},128);this.itemShadow=new ye(new re(1,1),new Ke({map:a,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new Ia(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new Ia(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new K_(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new hf,this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new rt,this.raycaster=new jp,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",o=>{this.reduced=o.matches,o.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildCourtyard(){const t=new Dt({...qh("courtyard-stone",[18,18]),normalScale:new rt(1.2,1.2),roughness:.7,metalness:.13,color:10133666});bt(new re(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new tf().load("./assets/plaster.jpg");e.colorSpace=Be,e.wrapS=e.wrapT=Ti,e.repeat.set(3,3),e.anisotropy=4;const n=new Dt({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new Dt({color:8225402,roughness:.9}),a=new Dt({color:10724502,roughness:.84}),o=new Dt({color:2897456,roughness:.78}),l=new Dt({color:2436659,metalness:.32,roughness:.74}),c=oe((d,x)=>{const y=d.createLinearGradient(0,0,x,x);y.addColorStop(0,"#788b91"),y.addColorStop(.48,"#495b60"),y.addColorStop(1,"#1d302c"),d.fillStyle=y,d.fillRect(0,0,x,x),d.save(),d.transform(1,.16,-.07,1,0,0);for(let A=-30;A<x;A+=94){d.fillStyle="#283b3a",d.fillRect(A,70,65,x);for(let b=94;b<x;b+=104)d.fillStyle="#83938b",d.globalAlpha=.24,d.fillRect(A+6,b,24,66),d.fillRect(A+34,b,24,66)}d.restore();const v=d.createLinearGradient(0,0,x,x*.8);v.addColorStop(0,"rgba(238,246,238,.20)"),v.addColorStop(.38,"rgba(238,246,238,.03)"),v.addColorStop(.62,"rgba(238,246,238,0)"),d.fillStyle=v,d.beginPath(),d.moveTo(0,x),d.lineTo(x*.52,0),d.lineTo(x*.78,0),d.lineTo(x*.24,x),d.closePath(),d.fill(),d.fillStyle="rgba(18,31,31,.55)",d.beginPath(),d.moveTo(0,82),d.lineTo(120,38),d.lineTo(150,38),d.lineTo(150,12),d.lineTo(178,12),d.lineTo(178,34),d.lineTo(335,66),d.lineTo(360,30),d.lineTo(386,30),d.lineTo(386,72),d.lineTo(512,96),d.lineTo(512,0),d.lineTo(0,0),d.closePath(),d.fill(),d.fillStyle="rgba(255,190,110,.5)";for(let A=0;A<24;A++)d.fillRect(28+A*67%470,150+A*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(d=>new Dt({color:d,map:c,metalness:.24,roughness:.28})),f=yf,p=(d,x,y,v,A)=>{const b=new pe;b.position.set(...y),b.rotation.y=v,this.static.add(b),z(b,[d,x,.65],[0,x/2,0],A,0),z(b,[d,.75,.78],[0,.375,.025],r,0);for(const E of[3.2,6.15,9.1,12.1])z(b,[d,.14,.87],[0,E,.055],a,0),z(b,[d,.07,.98],[0,E+.09,.08],r,0);z(b,[d,.35,1.06],[0,x-.12,.05],a,0),Ex(b,d,x,v===0?0:v>0?37:73),Kh(b,d,x,l,a);let w=Math.floor(d/2.45);for(let E=0;E<w;E++)for(let M=0;M<4;M++){let S=(E-(w-1)/2)*2.47,C=1.72+M*2.95;if(v===0&&M===0&&Math.abs(S+3.8)<1.2)continue;const D=1.16,I=1.91;z(b,[D+.26,I+.27,.14],[S,C,.38],a,0),z(b,[D+.05,I+.06,.1],[S,C,.47],o,0);const F=cf(E,M,v===0?0:v>0?1:2),O=F==="lit"?f:h[(E+M)%h.length];z(b,[D,I,.04],[S,C,.54],O,0);for(const k of[-D/2,D/2,0])z(b,[.048,I,.09],[S+k,C,.58],r,0);for(const k of[-I/2,I/2,.24])z(b,[D,.047,.09],[S,C+k,.58],r,0);z(b,[D+.4,.12,.43],[S,C-I/2-.09,.55],a,0),_f(b,S,C,D,I,r,o,a),vf(b,S,C,D,I,F,a,O,(v>0?100:200)+M*10+E)}for(const E of[-d/2+.35,d/2-.38]){Rt(b,.07,.07,x,[E,x/2,.53],o,[0,0,0],12);for(let M=1;M<x;M+=2)Rt(b,.087,.087,.055,[E,M,.53],L.rust,[0,0,0],12)}for(let E=0;E<13;E++){const M=(ln()-.5)*d,S=.8+ln()*.3;z(b,[.2+ln()*.7,.06+ln()*.14,.02],[M,S,.335],r,0)}return b};p(20,14,[-8,0,1.5],Math.PI/2,s),p(20,14,[9,0,1.5],-Math.PI/2,n),p(20,13.5,[.5,0,11.6],Math.PI,n);const u=new pe;u.position.set(0,0,-7),this.static.add(u),Ux(u,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:f,seed:101,gateX:1.55}),Kh(u,20,13.5,l,a);const m=new Dt({map:kl("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});z(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],L.black),bt(new re(.75,.55),m,this.static,[-2.75,2.5,-6.465]),z(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),z(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let d=0;d<6;d++)z(this.static,[.45,.025,.015],[4.1,1.65+d*.07,-6.415],L.black,0);Rt(this.static,.036,.036,18,[0,5.35,-6.48],L.rust,[0,0,Math.PI/2],12);for(let d=0;d<2;d++){const x=new Xi([new U(-8,9+d,2),new U(0,7.8+d,1),new U(9,9+d,-1)]);bt(new Wn(x,24,.012,4,!1),L.black,this.static)}for(const d of[-7.2,8.2])z(this.static,[.24,.17,22],[d,.065,0],r,.025);const _=new Dt({color:8350016,roughness:1,side:Ie});for(let d=0;d<50;d++){let x=(ln()-.5)*13,y=(ln()-.5)*14;bt(new Ei(.025+ln()*.035,5),_,this.static,[x,.008,y],[-Math.PI/2,ln()*3,ln()*6])}const g=new Dt({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let d=0;d<10;d++)bt(new Ei(.55+ln(),40),g,this.static,[(ln()-.5)*10,.005,(ln()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+ln()*.45,1);this.buildProps(),Ax(this.static,this.scene)}buildProps(){const t=this.static,e=new Dt({color:1647901,roughness:.64,metalness:.03,bumpMap:L.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of lf){const f=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([m,_])=>new rt(m*h*1.7,_*h*1.55)),p=new Wa(f,64),u=p.attributes.position;for(let m=0;m<u.count;m++){const _=u.getX(m),g=u.getY(m),d=u.getZ(m),x=Math.atan2(d,_),y=1+.08*Math.sin(x*13+g*12)+.045*Math.sin(x*21-g*7);u.setXYZ(m,_*y,g,d*y)}p.computeVertexNormals(),bt(p,e,t,[l,.02,c]),_e(t,.066*h,.018,[l,h*1.66,c],L.black,[Math.PI/2,0,0]);for(let m=0;m<3;m++)z(t,[.042,.16,.027],[l+Math.sin(m*2)*.04,h*1.84,c+Math.cos(m*2)*.035],e,.006,[.2,m*2,.23])}const n=new pe;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){_e(n,.48,.038,[l,0,0],L.black),_e(n,.44,.014,[l,0,0],L.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const f=new U(l,0,0),p=new U(l+Math.cos(h)*.44,Math.sin(h)*.44,0),u=new Ul(f,p);bt(new Wn(u,1,.004,3),L.silver,n)}}const s=(l,c)=>{const h=new U(...l),f=new U(...c);bt(new Wn(new Ul(h,f),1,.025,6),L.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);z(n,[.32,.07,.16],[-.23,.72,0],L.black),z(n,[.3,.035,.04],[.57,.86,0],L.silver);const r=new Dt({color:8090716,roughness:1});z(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)z(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],L.black,0);const a=ko("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=ko("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new Dt({...qh("steel-paint"),normalScale:new rt(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new Dt({color:2505773,roughness:.58,metalness:.06,bumpMap:L.leather.bumpMap,bumpScale:.007}),r=new Zn(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let u=0;u<a.count;u++){let m=a.getY(u);const _=.9+(m+.8)*.0625;a.setX(u,a.getX(u)*_),a.setZ(u,a.getZ(u)*_),Math.abs(a.getZ(u))>.7&&a.setZ(u,a.getZ(u)+-.026*Math.exp(-((a.getX(u)-.35)**2+(m-.1)**2)*9))}r.computeVertexNormals(),bt(r,e,t,[0,1.22,0]),z(t,[2.68,.105,1.83],[0,2.02,0],n,.035),z(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const u of[-1.08,1.08])z(t,[.055,1.51,.05],[u,1.2,.812],n,.008),z(t,[.055,1.5,.05],[u,1.2,-.813],n,.008);for(const u of[-.69,.69])z(t,[.044,1.22,.054],[u,1.26,.849],n,.008),z(t,[.044,1.22,.054],[u,1.26,-.849],n,.008);for(const u of[-1.275,1.275])z(t,[.06,.065,1.25],[u,1.65,0],n),z(t,[.065,1.3,.05],[u,1.23,.5],n),z(t,[.065,1.3,.05],[u,1.23,-.5],n),z(t,[.19,.18,.7],[u,1.7,0],n),z(t,[.06,.08,.6],[u*1.11,1.7,0],L.silver);for(const u of[-.95,.95])for(const m of[-.58,.58])z(t,[.15,.19,.12],[u,.35,m],L.silver),Rt(t,.18,.18,.15,[u,.19,m],L.black,[0,0,Math.PI/2],28),Rt(t,.067,.067,.16,[u,.19,m],L.silver,[0,0,Math.PI/2],24);this.lid=new pe,this.lid.position.set(0,2.08,-.92),t.add(this.lid),z(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let u=-4;u<=4;u++)z(this.lid,[.065,.07,1.66],[u*.27,.11,.94],n,.026);z(this.lid,[.65,.09,.1],[0,.045,1.99],L.black,.025);for(const u of[-.87,.87])Rt(t,.095,.095,.31,[u,2.06,-.93],L.silver,[0,0,Math.PI/2]);const o=oe((u,m,_)=>{u.fillStyle="#cac9ad",u.textAlign="center",u.font="bold 110px Arial",u.fillText("Т Б О",m/2,220),u.font="bold 82px Arial",u.fillText("№ 017",m/2,347),u.globalCompositeOperation="destination-out";for(let g=0;g<1600;g++)u.globalAlpha=_()*.7,u.fillRect(_()*m,_()*m,1+_()*4,1+_()*3)}),l=new Dt({map:o,transparent:!0,depthWrite:!1,roughness:.9});bt(new re(.73,.56),l,t,[.62,1.31,.865]);const c=new Dt({map:kl("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});bt(new re(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=oe((u,m)=>{u.fillStyle="#d3cdb5",u.fillRect(0,0,m,m),u.fillStyle="#93493c";for(let _=-m;_<m*2;_+=130)u.beginPath(),u.moveTo(_,0),u.lineTo(_+64,0),u.lineTo(_+m+64,m),u.lineTo(_+m,m),u.fill();tn(u,m,m,Jn(25),5e3)}),f=new Dt({map:h,roughness:.75});for(const u of[-1.1,1.1])bt(new re(.16,.53),f,t,[u,1.33,.847]);const p=oe((u,m)=>{const _=u.createRadialGradient(m/2,m/2,0,m/2,m/2,m*.48);_.addColorStop(0,"rgba(0,8,4,.8)"),_.addColorStop(.5,"rgba(0,8,4,.5)"),_.addColorStop(1,"rgba(0,8,4,0)"),u.fillStyle=_,u.fillRect(0,0,m,m)},128);bt(new re(4.5,3.5),new Ke({map:p,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),Lx(t,this.lid),t.remove(this.lid),Ho(t),Ho(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=De.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=De.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=De.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var l;this.dirty=!0;const t=innerWidth,e=innerHeight;this.renderer.setSize(t,e),this.camera.aspect=t/e;const n=t/e<.8;this.camera.fov=n?52:43;const s=!n&&e<=520&&t>650,r=!n&&!s&&t>1050;if(this.camera.position.set(s?4.15:r?4.3:n?2.6:4.2,s?2.65:r?3.4:n?3.5:3.55,s?8.1:r?7.4:n?10.3:7.8),this.camera.lookAt(s?.25:r?.6:n?.9:0,s?1.32:r?2.65:n?2.6:2.4,0),this.viewOverride){const{fov:c=this.camera.fov,position:h,target:f}=this.viewOverride;this.camera.fov=c,h&&this.camera.position.set(...h),f&&this.camera.lookAt(...f)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=n;const a=getComputedStyle(document.documentElement);if(this.stage=k_(t,e,parseFloat(a.getPropertyValue("--safe-top"))||0,parseFloat(a.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const c=Math.min(t/2,e)*.72;this.stage={x:(t/2-c)/2,y:(e-c)/2,width:c,height:c}}const o=2*4.2*Math.tan(De.degToRad(this.camera.fov/2))/e;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-t/2)*o,(e/2-this.stage.y-this.stage.height/2)*o,-4.2),this.inspectionVeil.scale.set(12*Math.tan(De.degToRad(this.camera.fov/2))*t/e,12*Math.tan(De.degToRad(this.camera.fov/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(l=this.pipeline)==null||l.resize(t,e,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new Dn(new U(...t.min),new U(...t.max));e.applyMatrix4(new ae().makeRotationFromEuler(this.item.rotation));const n=e.getSize(new U).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(De.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):Vh(n,this.stage,innerHeight,this.camera.fov,4.2,innerWidth),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new Dn(new U(...t.min),new U(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new U(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*innerWidth/2,y:(1-o.y)*innerHeight/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,innerWidth,innerHeight),this.applyCameraPose(),this.resize(),this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=De.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=De.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else this.applyCameraPose();return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo()}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=innerWidth,e=innerHeight){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new U(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=innerWidth,e=innerHeight,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){const t=De.radToDeg;return{stereo:!!this.vrStereo,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(e=>+e.toFixed(5))}}hitBin(t,e){return this.pointer.set(t/innerWidth*2-1,-e/innerHeight*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}binScreen(){this.camera.updateMatrixWorld(!0);const t=new U(0,1.2,0).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new U(-1.26,1.12,.22).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,ko(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=ai[t].lamp??17,this.itemRim.intensity=ai[t].rim??18,this.updateItemLights(),this.item.rotation.set(...ai[t].rotation),this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new ye(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=Gh(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=ai[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=H_(this.itemId,t),this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=De.clamp(Math.round((this.zoom+t)*100)/100,La.min,La.max),this.dirty=!0,this.zoom}rotate(t,e){this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=De.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.5)),this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new Il;o.background=new kt("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new fh(15069183,8288624,1.1));const l=new ta(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new ta(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new un(160,160,{type:qn}),f=new un(160,160,{depthBuffer:!1}),p=this.renderer.getRenderTarget(),u=this.renderer.getClearColor(new kt),m=this.renderer.getClearAlpha();let _;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...ai[t].rotation),e.scale.setScalar(1);const g=e.userData.bounds,d=new Dn(new U(...g.min),new U(...g.max));d.applyMatrix4(new ae().makeRotationFromEuler(e.rotation));const x=d.getSize(new U).multiplyScalar(.5);e.scale.setScalar(Vh(x,{x:8,y:12,width:144,height:136},160,34));const y=new Xe(34,1,.1,20);y.position.set(0,0,4.2),y.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,y),this.thumbnailOutput.render(this.renderer,f,h);const v=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(f,0,0,160,160,v);const A=document.createElement("canvas");A.width=A.height=160;const b=A.getContext("2d"),w=b.createImageData(160,160);for(let E=0;E<160;E++)w.data.set(v.subarray((159-E)*640,(160-E)*640),E*640);b.putImageData(w,0,0),_=A.toDataURL("image/png"),this.thumbCache.set(t,_)}finally{this.renderer.setRenderTarget(p),this.renderer.setClearColor(u,m),f.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return _}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.item){const n=this.item.rotation.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.item.rotation.y=De.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=De.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=De.lerp(this.item.rotation.z,this.targetZ,s),n.equals(this.item.rotation)||this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/F_),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||Gh(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const nn=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],Mf={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},Sf="white-night-finds-v1";function yr(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>nn.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>nn.some(e=>e.id===t)).slice(0,3):[]}}function Ox(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*nn.reduce((e,n)=>e+n.weight,0);return nn.find(e=>(t-=e.weight)<0)??nn.at(-1)}function Ja(i,t){if(t.type==="reset")return yr();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=nn.some(n=>n.id===t.itemId)?t.itemId:nn[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function zx(i){try{const t=JSON.parse(i.getItem(Sf)||"{}");return yr((t==null?void 0:t.version)===1?t:{})}catch{return yr()}}function Bx(i,t){try{return i.setItem(Sf,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const vs=Math.PI/180,kx=new vn(-Math.sqrt(.5),0,0,Math.sqrt(.5)),Hx=new U(0,0,1);class Gx{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new vn,this.qNow=new vn,this.qScreen=new vn,this.relQ=new vn,this.euler=new Sn(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){return this.euler.set(e*vs,t*vs,-n*vs,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(kx),this.qScreen.setFromAxisAngle(Hx,-s*vs),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(e)||!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.baseQ.copy(this.qNow),this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/vs).toFixed(2),pitchDeg:+(this.raw.pitch/vs).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Rn=Math.PI/180,On=(i,t,e)=>Math.min(e,Math.max(t,i)),_i=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},Vx=1.5,Wx=.5,Xx=.14,qx=.05,Yx=9,Zx=.3,$x=.75,Jx=3,jh=20*Rn,Qh=15*Rn,tu=6*Rn,Kx=.35,jx=3,Qx=.6,eu=1.2,nu=.8,iu=12*Rn;class tv{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-35,pitchMaxDeg:n=35}={}){this.yawLimit=Math.abs(t)*Rn,this.pitchMin=Math.min(e,n)*Rn,this.pitchMax=Math.max(e,n)*Rn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=On(t,-this.yawLimit,this.yawLimit),this.pitch=On(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=On(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>jx&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=Qx?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=On(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=On(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=_i(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=On(Yx*Math.max(e,1/60),Zx,$x);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(_i(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=Jx&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(_i(t.yaw-this.yaw))>jh||Math.abs(t.pitch-this.pitch)>Qh,s=!this.anchorTrack||Math.abs(_i(t.yaw-this.anchorTrack.yaw))>jh||Math.abs(t.pitch-this.anchorTrack.pitch)>Qh;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(_i(t.yaw-this.anchorCandidate.yaw))<=tu&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=tu?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=Kx?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(_i(t.yaw-e.yaw))<=iu&&Math.abs(t.pitch-e.pitch)<=iu}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=On(_i(t.yaw-this.yaw)*n,-eu*e,eu*e),this.pitch+=On((t.pitch-this.pitch)*n,-nu*e,nu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?Vx:Wx,r=n?Xx:qx,a=1-Math.exp(-s*e);this.yaw+=On(_i(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=On((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Rn).toFixed(2),pitchDeg:+(this.pitch/Rn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Rn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Rn).toFixed(2)}:null}}}const An=Math.PI/180,da=240,pa=180,ev=62,nv=48,iv=.15,sv=.3,rv=900,av=120,su=(i,t,e)=>Math.min(e,Math.max(t,i));function bf(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function ov(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,f=-1e9,p=0,u=0,m=0;for(let x=0;x<e;x++)for(let y=0;y<t;y++){const v=(x*t+y)*4,{hue:A,sat:b,val:w,chroma:E}=bf(i[v],i[v+1],i[v+2]);if(A<0)continue;let M=Math.abs(A-n);if(M>180&&(M=360-M),M>30||b<14||w<40||E<40)continue;m++,b>p&&(p=b),E>u&&(u=E);const S=(1-M/30)*(b/100);s+=y*S,r+=x*S,a+=S,o++,y<l&&(l=y),y>c&&(c=y),x<h&&(h=x),x>f&&(f=x)}if(o<15||a<=0)return{found:!1,bright:m,n:o};const _=c-l+1,g=f-h+1,d=o/Math.max(1,_*g);return _>t*.75||g>e*.75?{found:!1,bright:m,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:m,n:o,bbW:_,bbH:g,fill:d,maxSat:p,maxChroma:u,minX:l,maxX:c,minY:h,maxY:f}}function lv(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function ru(i,t,e){return{yaw:-(i-e.x)*ev*An,pitch:(t-e.y)*nv*An}}function cv(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class hv{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=da,this.canvas.height=pa),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<av)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,da,pa);const n=this.ctx.getImageData(0,0,da,pa);return this.processImageData(n.data,da,pa,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,f,p,u;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let m=0;m<2;m++){const _=this.markers[m],g=ov(t,e,n,this.defs[m].hue),d=((f=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:f[m])||null;if(_.hue=this.defs[m].hue,_.blob=g,_.found=!!g.found,_.shapeOk=cv(g,d,e,n),g.found){_.u=g.cx/Math.max(1,e),_.v=g.cy/Math.max(1,n),_.raw=ru(_.u,_.v,o);const x=(u=(p=this.calibration)==null?void 0:p.baseRaw)==null?void 0:u[m];_.delta=x?{yaw:_.raw.yaw-x.yaw,pitch:_.raw.pitch-x.pitch}:{..._.raw}}this.updateEntity(_,g.found&&_.shapeOk,s),_.usable=!!g.found&&_.entity&&_.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=iv*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=sv*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/An;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/An,(t.delta.pitch-e.delta.pitch)/An);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,f)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(f.delta.yaw-l.yaw,f.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*An;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*An){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*An){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>ru(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/An;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>rv?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=su(Math.round((t-n.left)/n.width*(r-1)),0,r-1),l=su(Math.round((e-n.top)/n.height*(a-1)),0,a-1);let c=null;for(let h=Math.max(0,l-4);h<=Math.min(a-1,l+4);h++)for(let f=Math.max(0,o-4);f<=Math.min(r-1,o+4);f++){const p=(h*r+f)*4,u=bf(s[p],s[p+1],s[p+2]);u.hue>=0&&(!c||u.chroma>c.chroma)&&(c=u)}return c?{hue:c.hue,sat:c.sat,val:c.val,chroma:c.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(m=>m.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=lv(a),h=Math.round((s.u??.5)*e),f=Math.round((s.v??.5)*n),p=Math.max(4,Math.round(s.w??56)),u=Math.max(4,Math.round(s.h??28));for(let m=Math.max(0,f-Math.floor(u/2));m<Math.min(n,f+Math.ceil(u/2));m++)for(let _=Math.max(0,h-Math.floor(p/2));_<Math.min(e,h+Math.ceil(p/2));_++){const g=(m*e+_)*4;t[g]=o,t[g+1]=l,t[g+2]=c,t[g+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/An).toFixed(2),pitchDeg:+(e.pitch/An).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const ma=Math.PI/180;class uv{constructor(t=null){this.gyro=new Gx,this.fusion=new tv,this.tracker=new hv(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/ma).toFixed(2),pitchDeg:+(this.look.pitch/ma).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/ma).toFixed(2),pitchDeg:+(this.markerSample.pitch/ma).toFixed(2)}}}}const fv=Math.PI/180;class dv{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/fv,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const pv=(i,t,e)=>Math.max(t,Math.min(e,i)),et=i=>document.querySelector(i),Bn=i=>[...document.querySelectorAll(i)],mv=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let Yn;try{Yn=window.localStorage}catch{Yn={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let wt=zx(Yn),ht,Gl="all",Pe=null,Vl,au,ou=null,Bi=0,Wl=0,Ds=document.hidden,Xl=null;const Tf="white-night-vr-v1",ql=10;function gv(){try{const i=Yn.getItem(Tf),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":"gyro",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",quality:"high",leftHue:16,rightHue:338}}}let ve=gv(),Se=null,Re=!1,Mr=!1,Yl=!1,vi=!1,Na=0,kn=0,Si=!1,wi=!1,Fa=!1,gn=null,Zl=!1,Go=!1,si="",$s=0;const Zi=new dv;function Ta(){try{Yn.setItem(Tf,JSON.stringify(ve))}catch{}}const lu=new URLSearchParams(location.search).has("test"),Vi=Bn("dialog");function br(i,t="neutral"){et("#toast").dataset.tone=t,et("#toast").textContent=i,et("#toast").classList.add("visible"),clearTimeout(Vl),Vl=setTimeout(()=>et("#toast").classList.remove("visible"),2600)}function Ka(){Bx(Yn,wt)||(et("#save-status").textContent="Сохранение недоступно в этом браузере",br("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function Oa(){Bn("[data-pose]").forEach(i=>{var t;i.disabled=wt.phase!=="inspect"||!((t=ht==null?void 0:ht.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(ht==null?void 0:ht.pose)))})}function or(){var i;if(Oa(),!!ht){if(wt.phase==="inspect"&&!((i=ht.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])et("#"+t).disabled=!0;return}et("#zoom-in").disabled=ht.zoom>=La.max,et("#zoom-out").disabled=ht.zoom<=La.min,et("#zoom-reset").disabled=ht.zoom===1,et("#zoom-reset").textContent=`${Math.round(ht.zoom*100)}%`}}function Ef(){et("#completion-preview").replaceChildren(...wt.lastKept.map(i=>{const t=document.createElement("img");return t.src=ht.thumbnail(i),t.alt=nn.find(e=>e.id===i).name,t}))}function $i(){var e;const i=wt.phase==="inspect"&&((e=ht.revealState)==null?void 0:e.phase)||"ready";if(i===ou)return;ou=i,et("#app").dataset.revealPhase=i,et("#app").classList.toggle("is-revealing",i!=="ready"),et(".inspection").setAttribute("aria-busy",String(i!=="ready")),et("#keep").disabled=et("#discard").disabled=i!=="ready",or();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};et("#reveal-note").textContent=t[i]||"",et("#reveal-note").hidden=i==="ready"}function _v(){const i=et("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(au),au=setTimeout(()=>i.classList.remove("collected"),700)}function Ai(){et("#app").classList.toggle("has-progress",wt.searches>0),$i(),or(),Mv(),et("#app").classList.toggle("is-inspecting",wt.phase==="inspect"),et(".inspection").hidden=wt.phase!=="inspect",wt.phase==="inspect"&&(clearTimeout(Vl),et("#toast").classList.remove("visible")),et("#header-count").innerHTML=`${String(wt.collection.length).padStart(2,"0")} <small>/ 18</small>`,et("#open-vr").disabled=wt.phase==="inspect",et("#search-total").textContent=String(wt.searches).padStart(2,"0"),et("#open-collection").disabled=wt.phase==="inspect",Bn(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<wt.taps)),et(".tap-dots").setAttribute("aria-label",`Нажатий: ${wt.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(et("#search-caption").textContent=i[wt.taps],et("#search-button span").textContent=wt.taps?"Продолжить поиск":"Порыться в баке",wt.phase==="inspect"){const t=nn.find(n=>n.id===wt.current),e=Mf[t.rarity];et("#find-name").textContent=t.name,et("#find-description").textContent=t.description,et("#find-era").textContent=t.era,et("#find-rarity").innerHTML=`<i></i>${e.label}`,et("#find-rarity").style.color=e.color,et("#find-number").textContent=wt.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(wt.searches).padStart(3,"0")}`,et("#duplicate-badge").hidden=wt.reviewing||!wt.collection.includes(t.id),et(".decision-buttons").hidden=wt.reviewing,et("#close-review").hidden=!wt.reviewing}}function $l(){if(wt.phase!=="search"||Vi.some(t=>t.open)||Ds)return;ht.poke(wt.taps+1);let i=Xl||(wt.searches===0?"camera":Ox().id);wt=Ja(wt,{type:"tap",itemId:i}),wt.phase==="inspect"&&(Xl=null,ht.show(wt.current),Ka(),Re&&(wi=!0,kn=0,Si=!1,Zi.reset())),Ai()}function Ea(i,{fromVr:t=!1}={}){var r;if(wt.phase!=="inspect"||wt.reviewing||!((r=ht.revealState)!=null&&r.ready))return;const e=nn.find(a=>a.id===wt.current),n=wt.collection.includes(e.id),s=wt.collection.length;wt=Ja(wt,{type:i?"keep":"discard"}),ht.hide(),Ka(),Ai(),br(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&_v(),s<18&&wt.collection.length===18&&(t?Fa=!0:(Ef(),et("#complete-dialog").showModal()))}function wf(){et("#collection-count").textContent=wt.collection.length,et("#collection-progress").style.width=`${wt.collection.length/18*100}%`;const i=nn.filter(t=>Gl==="all"||(Gl==="junk"?t.rarity==="junk":t.rarity!=="junk"));et("#collection-grid").replaceChildren(...i.map(t=>{const e=wt.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(nn.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${ht.thumbnail(t.id)}">`:`<div class="locked-art">${mv("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":Mf[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{et("#collection-dialog").close(),wt=Ja(wt,{type:"review",id:t.id}),ht.show(t.id,{review:!0}),Ai()}),n}))}function Jl(){wt.phase!=="inspect"&&(wf(),et("#collection-dialog").showModal())}function cu(){wt.reviewing&&(wt=Ja(wt,{type:"close"}),ht.hide(),Ai(),Jl())}function Af(){wt=yr(),ht.hide(),Ka(),Ai(),et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1,et("#settings-dialog").close(),br("Новая белая ночь. Начнём сначала.")}function xv(){const i=et(".bin-tag");if(!i)return;const t=ht.binEdge();i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`}const Rf="white-night-look-hint-v1";let hu=!1;function vv(){try{return Yn.getItem(Rf)==="done"}catch{return!0}}function yv(){const i=et("#look-hint");if(!(!i||hu&&i.hidden)){i.classList.add("used"),hu=!0;try{Yn.setItem(Rf,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function Mv(){const i=et("#look-hint");if(i){if(vv()||wt.phase==="inspect"){i.hidden=!0;return}i.hidden=Re}}function hn(){return Se||(Se=new uv(et("#vr-camera")),Se.setHues(ve.leftHue,ve.rightHue),Se.setMode(ve.mode)),Se}function Sv(i){return!!i.gyro.fresh&&(ve.mode!=="fusion"||i.marker.calibrated)}function uu(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}function Cn(){var o;const i=hn(),t=i.info(),e=t.gyro,n=t.marker,s=Sv(t);Bn("[data-vr-mode]").forEach(l=>{const c=l.dataset.vrMode===ve.mode;l.classList.toggle("active",c),l.setAttribute("aria-pressed",String(c))}),et("#vr-fusion-panel").hidden=ve.mode!=="fusion",et("#vr-quality").value=ve.quality,et("#vr-swatch-left").style.background=`hsl(${ve.leftHue} 95% 55%)`,et("#vr-swatch-right").style.background=`hsl(${ve.rightHue} 95% 55%)`;const r=et("#vr-gyro-btn");if(r.disabled=!!e.fresh||!e.supported,r.textContent=e.fresh?"Гироскоп готов":"Разрешить",r.classList.toggle("ready",!!e.fresh),et("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",ve.mode==="fusion"){const[l,c]=n.markers||[];et("#vr-start-camera").disabled=!!n.running,et("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",et("#vr-calibrate").disabled=!(l!=null&&l.usable&&(c!=null&&c.usable)),et("#vr-pick-left").classList.toggle("active",gn==="left"),et("#vr-pick-right").classList.toggle("active",gn==="right"),et("#vr-camera").classList.toggle("picking",!!gn);const h=et("#vr-marker-status");h.textContent=si||n.error||(gn?`Коснитесь ${gn==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((o=n.calibration)==null?void 0:o.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${l?uu(l):"—"}. Правая метка: ${c?uu(c):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),h.className=`vr-status-line ${si||n.error?"warn":n.calibrated?"good":""}`}et("#vr-start").disabled=!s||vi;const a=et("#vr-status");return a.textContent=vi?"Надевайте очки и смотрите прямо перед собой…":e.fresh?ve.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":ve.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп.",a.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function Cf(){if(wt.phase==="inspect"){br("Сначала завершите осмотр находки.");return}const i=et("#vr-dialog");i.open||(hn(),Cn(),i.showModal())}async function bv(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function Tv(i=!1){i&&(Zl=et("#low-quality").checked,Go=ve.quality==="low",ht.low!==Go&&ht.setQuality(Go))}function Pf(i=!1){if(!Re)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==Mr)&&(Mr=t,ht.setVrStereo(t))}async function If(){if(Re||wt.phase==="inspect")return!1;const i=hn(),t=et("#vr-dialog");return t.open&&(Yl=!0,t.close(),Yl=!1),Tv(!0),i.start(),Re=!0,kn=wt.taps*(ql/3),Si=!1,wi=!1,Zi.reset(),document.body.classList.add("vr-active"),Mr=!1,Pf(!0),ht.setHeadLook(0,0),ht.resize(),!0}async function Ev(){if(vi||!Cn().ready)return;await bv();const i=++Na,t=et("#vr-dialog"),e=et("#vr-countdown");vi=!0,e.hidden=!1,Cn();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==Na||!t.open){vi=!1,e.hidden=!0;return}vi=!1,e.hidden=!0,await If()}function ja(i="gesture"){var t;return!wi||wt.phase!=="inspect"||wt.reviewing?!1:((t=ht.revealState)!=null&&t.ready||(ht.finishReveal(),$i()),wi=!1,Zi.reset(),Ea(!0,{fromVr:!0}),kn=0,Si=!1,!0)}function er(i="exit"){var t;if(!Re)return!1;wi&&ja("exit"),Re=!1,Na++,vi=!1,et("#vr-countdown").hidden=!0,Se==null||Se.stop(),ht.setVrStereo(!1),ht.setHeadLook(0,0),Mr=!1,kn=0,Si=!1,Zi.reset(),document.body.classList.remove("vr-active","vr-single"),ht.low!==Zl&&ht.setQuality(Zl);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),ht.resize(),Ai(),Fa?(Fa=!1,Ef(),et("#complete-dialog").showModal()):i!=="hidden"&&br("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function Kl(i){const t=Se.update(i);return ht.setHeadLook(t.yaw,t.pitch),t}function za(i,t=performance.now()){var s;if(!Re||!Se)return;const e=Kl(i),n=ql/3;if(wt.phase==="search")if(Zi.reset(),Si=ht.gazeHitsBin(),Si){kn=Math.min(ql,kn+i);const r=Math.min(3,Math.floor(kn/n+1e-9));for(;wt.phase==="search"&&wt.taps<r;){const a=wt.taps;if($l(),wt.phase==="search"&&wt.taps===a)break}}else kn=Math.max(wt.taps*n,kn-i*1.5);else wt.phase==="inspect"&&wi&&(Si=!1,(s=ht.revealState)!=null&&s.ready&&Zi.update(e.yaw,t)&&ja("gesture"))}function nr(){return{active:Re,stereo:Mr,settings:{...ve},focus:+kn.toFixed(3),gazeHit:Si,pendingSave:wi,pendingCompletion:Fa,shake:Zi.info(),look:(Se==null?void 0:Se.info())||null,world:(ht==null?void 0:ht.vrInfo())||null}}function fu(i,t,e=10,n=.03){const s=hn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),Re?za(0,r.lastAt):Kl(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),Re?za(n,r.lastAt):Kl(n);return ht.update(0),r.lastAt=performance.now(),nr()}function Lf(i){if(Wl=requestAnimationFrame(Lf),Vi.some(n=>n.open)){et("#vr-dialog").open&&!Ds&&(Se==null||Se.processPrep(),Cn()),Bi=i;return}if(Ds||ht.testRevealHold){Bi=i;return}const t=Bi?(i-Bi)/1e3:.016;Bi=i;const e=Math.min(t,.1);Re&&za(e,i),ht.update(e,t),$i(),Re||xv()}function wv(){Bn("[data-pose]").forEach(t=>t.addEventListener("click",()=>{ht.setPose(t.dataset.pose),Oa()})),et("#zoom-in").addEventListener("click",()=>{ht.setZoom(.2),or()}),et("#zoom-out").addEventListener("click",()=>{ht.setZoom(-.2),or()}),et("#zoom-reset").addEventListener("click",()=>{ht.setZoom(1-ht.zoom),or()}),et("#search-button").addEventListener("click",$l),et("#discard").addEventListener("click",()=>Ea(!1)),et("#keep").addEventListener("click",()=>Ea(!0)),et("#close-review").addEventListener("click",cu),et("#open-collection").addEventListener("click",Jl),et("#open-settings").addEventListener("click",()=>{et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1,et("#settings-dialog").showModal()}),et("#open-vr").addEventListener("click",Cf),Bn("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{ve.mode=t.dataset.vrMode==="fusion"?"fusion":"gyro",Ta(),gn=null,si="",hn().setMode(ve.mode),Cn()})),et("#vr-gyro-btn").addEventListener("click",async()=>{si="",await hn().requestGyro(),Cn()}),et("#vr-start-camera").addEventListener("click",async()=>{si="";const t=hn();t.tracker.error=null,await t.startCamera(),Cn()}),Bn(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";si="",gn=gn===e?null:e,Cn()})),et("#vr-camera").addEventListener("click",t=>{if(!gn)return;const e=hn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(gn==="left"?ve.leftHue=Math.round(n.hue):ve.rightHue=Math.round(n.hue),e.setHues(ve.leftHue,ve.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Ta(),si="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",gn=null,e.tracker.process(!0),Cn())}),et("#vr-calibrate").addEventListener("click",()=>{const t=hn();t.tracker.process(!0);const e=t.tracker.calibrate();si=e.ok?"":e.message,Cn()}),et("#vr-start").addEventListener("click",Ev),et("#vr-quality").value=ve.quality,et("#vr-quality").addEventListener("change",t=>{ve.quality=t.target.value,Ta()}),Bn("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),Vi.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{Pe=null,Bi=0,t.id==="vr-dialog"&&!Yl&&!Re&&(Na++,vi=!1,et("#vr-countdown").hidden=!0,gn=null,si="",Se==null||Se.stop())})}),Bn("[data-filter]").forEach(t=>t.addEventListener("click",()=>{Gl=t.dataset.filter,Bn("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),wf()})),et("#low-quality").addEventListener("change",t=>{ht.setQuality(t.target.checked),ht.update(.016);try{Yn.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),et("#reset-button").addEventListener("click",()=>{et("#reset-confirm").hidden=!1,et("#reset-button").hidden=!0}),et("#reset-cancel").addEventListener("click",()=>{et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1}),et("#reset-yes").addEventListener("click",Af),et("#continue-button").addEventListener("click",()=>et("#complete-dialog").close()),et("#view-complete").addEventListener("click",()=>{et("#complete-dialog").close(),Jl()});const i=et("#world");i.addEventListener("pointerdown",t=>{if(Re){clearTimeout($s),$s=setTimeout(()=>er("long-press"),900);return}Vi.some(e=>e.open)||Pe||!t.isPrimary||(wt.phase==="inspect"&&(ht.finishReveal(),$i()),Pe={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!Pe||Pe.id!==t.pointerId)return;const e=t.clientX-Pe.x,n=t.clientY-Pe.y;Math.hypot(t.clientX-Pe.startX,t.clientY-Pe.startY)>10&&(Pe.moved=!0,wt.phase!=="inspect"&&!Re&&yv()),wt.phase==="inspect"?(ht.rotate(e,n),Oa()):Re||ht.lookBy(e,n),Pe.x=t.clientX,Pe.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout($s),!Pe||Pe.id!==t.pointerId)return;const e=!Pe.moved;Pe=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&wt.phase==="search"&&ht.hitBin(t.clientX,t.clientY)&&$l()}),i.addEventListener("pointercancel",()=>{clearTimeout($s),Pe=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout($s),Pe=null}),document.addEventListener("visibilitychange",()=>{Ds=document.hidden,Pe=null,Bi=0,document.hidden&&Re&&er("hidden")}),window.addEventListener("blur",()=>Pe=null),window.addEventListener("resize",()=>{ht.resize(),Re&&Pf(),Vi.some(t=>t.open)&&ht.update(.016)}),document.addEventListener("fullscreenchange",()=>{Re&&!document.fullscreenElement&&er("fullscreen")}),window.addEventListener("pagehide",()=>{wi&&ja("pagehide"),Re&&(Se==null||Se.stop())}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&Re){t.preventDefault(),er("escape");return}t.key==="Escape"&&!Vi.some(e=>e.open)&&wt.phase==="inspect"&&(t.preventDefault(),wt.reviewing?cu():(ht.finishReveal(),$i(),Ea(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),Ds=!0,et("#webgl-error").hidden=!1})}async function Av(){try{ht=new Fx(et("#world"));try{Yn.getItem("white-night-quality")==="low"&&(ht.setQuality(!0),et("#low-quality").checked=!0)}catch{}wv(),Ai(),await Promise.all([document.fonts.ready,W_()]),ht.update(.016),et("#loading").hidden=!0,window.__READY__=!0,Wl=requestAnimationFrame(Lf),lu&&(window.__WORLD__=ht),lu&&(window.__GAME_TEST__={getState:()=>structuredClone(wt),getMetrics:()=>ht.metrics(),settle:()=>{ht.finishReveal(),ht.kick=0,ht.dirty=!0,ht.update(.016),$i()},seekReveal:i=>{ht.testRevealHold=!0,ht.reveal=Math.max(0,Math.min(1,i)),ht.applyReveal(),ht.dirty=!0,ht.update(0),$i()},setPose:i=>{ht.setPose(i),ht.update(.1),Oa()},getRotation:()=>({x:ht.targetX,y:ht.targetY}),binScreen:()=>ht.binScreen(),forceNext:i=>{if(!nn.some(t=>t.id===i))throw Error("unknown item");Xl=i},setView:i=>{const t=ht.setView(i);return ht.update(.016),t},look:(i,t)=>(ht.lookBy(0,0),ht.headLook.yaw=pv(i,-41,41)*Math.PI/180,ht.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,ht.applyCameraPose(),ht.dirty=!0,ht.update(.016),ht.lookInfo()),sky:()=>({stars:ht.sky.stars.geometry.attributes.position.count,moon:ht.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:ht.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{Vi.forEach(i=>i.close()),Af()},setCollection:i=>{wt=yr({collection:i,searches:i.length}),ht.hide(),Ka(),Ai()},isPaused:()=>Ds,items:nn.map(i=>i.id),scene:()=>({staticVisible:ht.static.visible,drawCalls:ht.renderer.info.render.calls,headLook:ht.lookInfo(),sky:{stars:ht.sky.stars.geometry.attributes.position.count,moonVisible:ht.sky.moon.visible}}),vr:{info:()=>nr(),open:()=>Cf(),setMode:i=>(ve.mode=i==="fusion"?"fusion":"gyro",Ta(),hn().setMode(ve.mode),Cn(),nr()),requestGyro:()=>hn().requestGyro(),gyro:(i,t,e=10,n=.03)=>fu(i,t,e,n),marker:(i,t)=>hn().tracker.inject(i,t),calibrate:i=>hn().tracker.calibrate(i),start:()=>If(),stop:()=>er("test"),step:(i=.1)=>{let t=Math.max(0,i);for(;t>0;){const e=Math.min(.05,t);Se&&(Se.gyro.lastAt=performance.now()),za(e,performance.now()),t-=e}return ht.update(0),nr()},shake:(i=25)=>{for(const t of[-i,i,-i])fu(t,0,10,.03);return nr()},settings:()=>({...ve}),finish:()=>ja("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),et("#loading").hidden=!0,et("#webgl-error").hidden=!1,cancelAnimationFrame(Wl)}}Av();
