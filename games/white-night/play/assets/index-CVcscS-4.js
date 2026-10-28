(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pc="180",Sf=0,sh=1,bf=2,Ju=1,Ku=2,bi=3,Gi=0,sn=1,ze=2,ln=0,Ws=1,Or=2,rh=3,ah=4,ju=5,Ai=100,wf=101,Tf=102,Ef=103,Af=104,yl=200,Rf=201,Cf=202,Pf=203,Ml=204,Sl=205,Qu=206,If=207,td=208,Lf=209,Df=210,Uf=211,Nf=212,Ff=213,Of=214,bl=0,wl=1,Tl=2,Ys=3,El=4,Al=5,Rl=6,Cl=7,Ic=0,zf=1,kf=2,Hi=0,ed=1,nd=2,id=3,Lc=4,sd=5,rd=6,ad=7,od=300,$s=301,Zs=302,Pl=303,Il=304,vo=306,Wi=1e3,ls=1001,Ll=1002,un=1003,Bf=1004,na=1005,ei=1006,Lo=1007,cs=1008,oi=1009,ld=1010,cd=1011,zr=1012,Dc=1013,ds=1014,Wn=1015,li=1016,Uc=1017,Nc=1018,Js=1020,hd=35902,ud=35899,dd=1021,fd=1022,Xn=1023,kr=1026,Ks=1027,xo=1028,Fc=1029,pd=1030,Oc=1031,zc=1033,qa=33776,Ya=33777,$a=33778,Za=33779,Dl=35840,Ul=35841,Nl=35842,Fl=35843,Ol=36196,zl=37492,kl=37496,Bl=37808,Hl=37809,Vl=37810,Gl=37811,Wl=37812,Xl=37813,ql=37814,Yl=37815,$l=37816,Zl=37817,Jl=37818,Kl=37819,jl=37820,Ql=37821,tc=36492,ec=36494,nc=36495,ic=36283,sc=36284,rc=36285,ac=36286,Hf=3200,Vf=3201,_o=0,Gf=1,Sn="",$e="srgb",js="srgb-linear",to="linear",ve="srgb",Ms=7680,oh=519,Wf=512,Xf=513,qf=514,md=515,Yf=516,$f=517,Zf=518,Jf=519,oc=35044,ia=35048,lh="300 es",ni=2e3,eo=2001;class sr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ch=1234567;const Ir=Math.PI/180,Br=180/Math.PI;function ii(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qe[i&255]+Qe[i>>8&255]+Qe[i>>16&255]+Qe[i>>24&255]+"-"+Qe[t&255]+Qe[t>>8&255]+"-"+Qe[t>>16&15|64]+Qe[t>>24&255]+"-"+Qe[e&63|128]+Qe[e>>8&255]+"-"+Qe[e>>16&255]+Qe[e>>24&255]+Qe[n&255]+Qe[n>>8&255]+Qe[n>>16&255]+Qe[n>>24&255]).toLowerCase()}function ae(i,t,e){return Math.max(t,Math.min(e,i))}function kc(i,t){return(i%t+t)%t}function Kf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function jf(i,t,e){return i!==t?(e-i)/(t-i):0}function Lr(i,t,e){return(1-e)*i+e*t}function Qf(i,t,e,n){return Lr(i,t,1-Math.exp(-e*n))}function t0(i,t=1){return t-Math.abs(kc(i,t*2)-t)}function e0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function n0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function i0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function s0(i,t){return i+Math.random()*(t-i)}function r0(i){return i*(.5-Math.random())}function a0(i){i!==void 0&&(ch=i);let t=ch+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function o0(i){return i*Ir}function l0(i){return i*Br}function c0(i){return(i&i-1)===0&&i!==0}function h0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function u0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function d0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),m=a((t-n)/2),u=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*d,l*m,o*c);break;case"YZY":i.set(l*m,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*m,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*u,o*c);break;case"YXY":i.set(l*u,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function xe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ye={DEG2RAD:Ir,RAD2DEG:Br,generateUUID:ii,clamp:ae,euclideanModulo:kc,mapLinear:Kf,inverseLerp:jf,lerp:Lr,damp:Qf,pingpong:t0,smoothstep:e0,smootherstep:n0,randInt:i0,randFloat:s0,randFloatSpread:r0,seededRandom:a0,degToRad:o0,radToDeg:l0,isPowerOfTwo:c0,ceilPowerOfTwo:h0,floorPowerOfTwo:u0,setQuaternionFromProperEuler:d0,normalize:xe,denormalize:Gn};class dt{constructor(t=0,e=0){dt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class cn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const m=r[a+0],u=r[a+1],p=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=m,t[e+1]=u,t[e+2]=p,t[e+3]=v;return}if(d!==v||l!==m||c!==u||h!==p){let g=1-o;const f=l*m+c*u+h*p+d*v,x=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const E=Math.sqrt(y),b=Math.atan2(E,f*x);g=Math.sin(g*b)/E,o=Math.sin(o*b)/E}const _=o*x;if(l=l*g+m*_,c=c*g+u*_,h=h*g+p*_,d=d*g+v*_,g===1-o){const E=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=E,c*=E,h*=E,d*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],m=r[a+1],u=r[a+2],p=r[a+3];return t[e]=o*p+h*d+l*u-c*m,t[e+1]=l*p+h*m+c*d-o*u,t[e+2]=c*p+h*u+o*m-l*d,t[e+3]=h*p-o*d-l*m-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),m=l(n/2),u=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=m*h*d+c*u*p,this._y=c*u*d-m*h*p,this._z=c*h*p+m*u*d,this._w=c*h*d-m*u*p;break;case"YXZ":this._x=m*h*d+c*u*p,this._y=c*u*d-m*h*p,this._z=c*h*p-m*u*d,this._w=c*h*d+m*u*p;break;case"ZXY":this._x=m*h*d-c*u*p,this._y=c*u*d+m*h*p,this._z=c*h*p+m*u*d,this._w=c*h*d-m*u*p;break;case"ZYX":this._x=m*h*d-c*u*p,this._y=c*u*d+m*h*p,this._z=c*h*p-m*u*d,this._w=c*h*d+m*u*p;break;case"YZX":this._x=m*h*d+c*u*p,this._y=c*u*d+m*h*p,this._z=c*h*p-m*u*d,this._w=c*h*d-m*u*p;break;case"XZY":this._x=m*h*d-c*u*p,this._y=c*u*d-m*h*p,this._z=c*h*p+m*u*d,this._w=c*h*d+m*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],m=n+o+d;if(m>0){const u=.5/Math.sqrt(m+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(n>o&&n>d){const u=2*Math.sqrt(1+n-o-d);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>d){const u=2*Math.sqrt(1+o-n-d);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+d-n-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ae(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,m=Math.sin(e*h)/c;return this._w=a*d+this._w*m,this._x=n*d+this._x*m,this._y=s*d+this._y*m,this._z=r*d+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(hh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(hh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this.z=ae(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this.z=ae(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Do.copy(this).projectOnVector(t),this.sub(Do)}reflect(t){return this.sub(Do.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Do=new D,hh=new cn;class ie{constructor(t,e,n,s,r,a,o,l,c){ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],m=n[2],u=n[5],p=n[8],v=s[0],g=s[3],f=s[6],x=s[1],y=s[4],_=s[7],E=s[2],b=s[5],A=s[8];return r[0]=a*v+o*x+l*E,r[3]=a*g+o*y+l*b,r[6]=a*f+o*_+l*A,r[1]=c*v+h*x+d*E,r[4]=c*g+h*y+d*b,r[7]=c*f+h*_+d*A,r[2]=m*v+u*x+p*E,r[5]=m*g+u*y+p*b,r[8]=m*f+u*_+p*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,m=o*l-h*r,u=c*r-a*l,p=e*d+n*m+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=d*v,t[1]=(s*c-h*n)*v,t[2]=(o*n-s*a)*v,t[3]=m*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=u*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Uo.makeScale(t,e)),this}rotate(t){return this.premultiply(Uo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Uo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Uo=new ie;function gd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function f0(){const i=Hr("canvas");return i.style.display="block",i}const uh={};function Vr(i){i in uh||(uh[i]=!0,console.warn(i))}function p0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const dh=new ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fh=new ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function m0(){const i={enabled:!0,workingColorSpace:js,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ve&&(s.r=Ci(s.r),s.g=Ci(s.g),s.b=Ci(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=Xs(s.r),s.g=Xs(s.g),s.b=Xs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Sn?to:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Vr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Vr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[js]:{primaries:t,whitePoint:n,transfer:to,toXYZ:dh,fromXYZ:fh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:$e},outputColorSpaceConfig:{drawingBufferColorSpace:$e}},[$e]:{primaries:t,whitePoint:n,transfer:ve,toXYZ:dh,fromXYZ:fh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:$e}}}),i}const pe=m0();function Ci(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Xs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ss;class g0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ss===void 0&&(Ss=Hr("canvas")),Ss.width=t.width,Ss.height=t.height;const s=Ss.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ss}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Hr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ci(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ci(e[n]/255)*255):e[n]=Ci(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let v0=0;class Bc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:v0++}),this.uuid=ii(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(No(s[a].image)):r.push(No(s[a]))}else r=No(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function No(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?g0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let x0=0;const Fo=new D;class Ke extends sr{constructor(t=Ke.DEFAULT_IMAGE,e=Ke.DEFAULT_MAPPING,n=ls,s=ls,r=ei,a=cs,o=Xn,l=oi,c=Ke.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:x0++}),this.uuid=ii(),this.name="",this.source=new Bc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fo).x}get height(){return this.source.getSize(Fo).y}get depth(){return this.source.getSize(Fo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==od)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wi:t.x=t.x-Math.floor(t.x);break;case ls:t.x=t.x<0?0:1;break;case Ll:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wi:t.y=t.y-Math.floor(t.y);break;case ls:t.y=t.y<0?0:1;break;case Ll:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=od;Ke.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,n=0,s=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],m=l[1],u=l[5],p=l[9],v=l[2],g=l[6],f=l[10];if(Math.abs(h-m)<.01&&Math.abs(d-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+m)<.1&&Math.abs(d+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+u+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,_=(u+1)/2,E=(f+1)/2,b=(h+m)/4,A=(d+v)/4,T=(p+g)/4;return y>_&&y>E?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=b/n,r=A/n):_>E?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=b/s,r=T/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=A/r,s=T/r),this.set(n,s,r,e),this}let x=Math.sqrt((g-p)*(g-p)+(d-v)*(d-v)+(m-h)*(m-h));return Math.abs(x)<.001&&(x=1),this.x=(g-p)/x,this.y=(d-v)/x,this.z=(m-h)/x,this.w=Math.acos((c+u+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this.z=ae(this.z,t.z,e.z),this.w=ae(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this.z=ae(this.z,t,e),this.w=ae(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class _0 extends sr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ke(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ei,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Bc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends _0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class vd extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=ls,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class y0 extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=ls,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(On.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(On.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=On.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(t.matrixWorld),this.expandByPoint(On);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),sa.copy(n.boundingBox)),sa.applyMatrix4(t.matrixWorld),this.union(sa)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,On),On.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ur),ra.subVectors(this.max,ur),bs.subVectors(t.a,ur),ws.subVectors(t.b,ur),Ts.subVectors(t.c,ur),Li.subVectors(ws,bs),Di.subVectors(Ts,ws),$i.subVectors(bs,Ts);let e=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-$i.z,$i.y,Li.z,0,-Li.x,Di.z,0,-Di.x,$i.z,0,-$i.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-$i.y,$i.x,0];return!Oo(e,bs,ws,Ts,ra)||(e=[1,0,0,0,1,0,0,0,1],!Oo(e,bs,ws,Ts,ra))?!1:(aa.crossVectors(Li,Di),e=[aa.x,aa.y,aa.z],Oo(e,bs,ws,Ts,ra))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,On).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(On).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const mi=[new D,new D,new D,new D,new D,new D,new D,new D],On=new D,sa=new qn,bs=new D,ws=new D,Ts=new D,Li=new D,Di=new D,$i=new D,ur=new D,ra=new D,aa=new D,Zi=new D;function Oo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Zi.fromArray(i,r);const o=s.x*Math.abs(Zi.x)+s.y*Math.abs(Zi.y)+s.z*Math.abs(Zi.z),l=t.dot(Zi),c=e.dot(Zi),h=n.dot(Zi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const M0=new qn,dr=new D,zo=new D;class vs{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):M0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;dr.subVectors(t,this.center);const e=dr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(dr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(zo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(dr.copy(t.center).add(zo)),this.expandByPoint(dr.copy(t.center).sub(zo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const gi=new D,ko=new D,oa=new D,Ui=new D,Bo=new D,la=new D,Ho=new D;class Hc{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=gi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gi.copy(this.origin).addScaledVector(this.direction,e),gi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ko.copy(t).add(e).multiplyScalar(.5),oa.copy(e).sub(t).normalize(),Ui.copy(this.origin).sub(ko);const r=t.distanceTo(e)*.5,a=-this.direction.dot(oa),o=Ui.dot(this.direction),l=-Ui.dot(oa),c=Ui.lengthSq(),h=Math.abs(1-a*a);let d,m,u,p;if(h>0)if(d=a*l-o,m=a*o-l,p=r*h,d>=0)if(m>=-p)if(m<=p){const v=1/h;d*=v,m*=v,u=d*(d+a*m+2*o)+m*(a*d+m+2*l)+c}else m=r,d=Math.max(0,-(a*m+o)),u=-d*d+m*(m+2*l)+c;else m=-r,d=Math.max(0,-(a*m+o)),u=-d*d+m*(m+2*l)+c;else m<=-p?(d=Math.max(0,-(-a*r+o)),m=d>0?-r:Math.min(Math.max(-r,-l),r),u=-d*d+m*(m+2*l)+c):m<=p?(d=0,m=Math.min(Math.max(-r,-l),r),u=m*(m+2*l)+c):(d=Math.max(0,-(a*r+o)),m=d>0?r:Math.min(Math.max(-r,-l),r),u=-d*d+m*(m+2*l)+c);else m=a>0?-r:r,d=Math.max(0,-(a*m+o)),u=-d*d+m*(m+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ko).addScaledVector(oa,m),u}intersectSphere(t,e){gi.subVectors(t.center,this.origin);const n=gi.dot(this.direction),s=gi.dot(gi)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,m=this.origin;return c>=0?(n=(t.min.x-m.x)*c,s=(t.max.x-m.x)*c):(n=(t.max.x-m.x)*c,s=(t.min.x-m.x)*c),h>=0?(r=(t.min.y-m.y)*h,a=(t.max.y-m.y)*h):(r=(t.max.y-m.y)*h,a=(t.min.y-m.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-m.z)*d,l=(t.max.z-m.z)*d):(o=(t.max.z-m.z)*d,l=(t.min.z-m.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,gi)!==null}intersectTriangle(t,e,n,s,r){Bo.subVectors(e,t),la.subVectors(n,t),Ho.crossVectors(Bo,la);let a=this.direction.dot(Ho),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ui.subVectors(this.origin,t);const l=o*this.direction.dot(la.crossVectors(Ui,la));if(l<0)return null;const c=o*this.direction.dot(Bo.cross(Ui));if(c<0||l+c>a)return null;const h=-o*Ui.dot(Ho);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class he{constructor(t,e,n,s,r,a,o,l,c,h,d,m,u,p,v,g){he.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,m,u,p,v,g)}set(t,e,n,s,r,a,o,l,c,h,d,m,u,p,v,g){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=m,f[3]=u,f[7]=p,f[11]=v,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new he().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Es.setFromMatrixColumn(t,0).length(),r=1/Es.setFromMatrixColumn(t,1).length(),a=1/Es.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const m=a*h,u=a*d,p=o*h,v=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=u+p*c,e[5]=m-v*c,e[9]=-o*l,e[2]=v-m*c,e[6]=p+u*c,e[10]=a*l}else if(t.order==="YXZ"){const m=l*h,u=l*d,p=c*h,v=c*d;e[0]=m+v*o,e[4]=p*o-u,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=u*o-p,e[6]=v+m*o,e[10]=a*l}else if(t.order==="ZXY"){const m=l*h,u=l*d,p=c*h,v=c*d;e[0]=m-v*o,e[4]=-a*d,e[8]=p+u*o,e[1]=u+p*o,e[5]=a*h,e[9]=v-m*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const m=a*h,u=a*d,p=o*h,v=o*d;e[0]=l*h,e[4]=p*c-u,e[8]=m*c+v,e[1]=l*d,e[5]=v*c+m,e[9]=u*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const m=a*l,u=a*c,p=o*l,v=o*c;e[0]=l*h,e[4]=v-m*d,e[8]=p*d+u,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=u*d+p,e[10]=m-v*d}else if(t.order==="XZY"){const m=a*l,u=a*c,p=o*l,v=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=m*d+v,e[5]=a*h,e[9]=u*d-p,e[2]=p*d-u,e[6]=o*h,e[10]=v*d+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(S0,t,b0)}lookAt(t,e,n){const s=this.elements;return _n.subVectors(t,e),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Ni.crossVectors(n,_n),Ni.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Ni.crossVectors(n,_n)),Ni.normalize(),ca.crossVectors(_n,Ni),s[0]=Ni.x,s[4]=ca.x,s[8]=_n.x,s[1]=Ni.y,s[5]=ca.y,s[9]=_n.y,s[2]=Ni.z,s[6]=ca.z,s[10]=_n.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],m=n[9],u=n[13],p=n[2],v=n[6],g=n[10],f=n[14],x=n[3],y=n[7],_=n[11],E=n[15],b=s[0],A=s[4],T=s[8],M=s[12],S=s[1],R=s[5],L=s[9],I=s[13],N=s[2],F=s[6],z=s[10],G=s[14],H=s[3],Z=s[7],tt=s[11],nt=s[15];return r[0]=a*b+o*S+l*N+c*H,r[4]=a*A+o*R+l*F+c*Z,r[8]=a*T+o*L+l*z+c*tt,r[12]=a*M+o*I+l*G+c*nt,r[1]=h*b+d*S+m*N+u*H,r[5]=h*A+d*R+m*F+u*Z,r[9]=h*T+d*L+m*z+u*tt,r[13]=h*M+d*I+m*G+u*nt,r[2]=p*b+v*S+g*N+f*H,r[6]=p*A+v*R+g*F+f*Z,r[10]=p*T+v*L+g*z+f*tt,r[14]=p*M+v*I+g*G+f*nt,r[3]=x*b+y*S+_*N+E*H,r[7]=x*A+y*R+_*F+E*Z,r[11]=x*T+y*L+_*z+E*tt,r[15]=x*M+y*I+_*G+E*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],m=t[10],u=t[14],p=t[3],v=t[7],g=t[11],f=t[15];return p*(+r*l*d-s*c*d-r*o*m+n*c*m+s*o*u-n*l*u)+v*(+e*l*u-e*c*m+r*a*m-s*a*u+s*c*h-r*l*h)+g*(+e*c*d-e*o*u-r*a*d+n*a*u+r*o*h-n*c*h)+f*(-s*o*h-e*l*d+e*o*m+s*a*d-n*a*m+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],m=t[10],u=t[11],p=t[12],v=t[13],g=t[14],f=t[15],x=d*g*c-v*m*c+v*l*u-o*g*u-d*l*f+o*m*f,y=p*m*c-h*g*c-p*l*u+a*g*u+h*l*f-a*m*f,_=h*v*c-p*d*c+p*o*u-a*v*u-h*o*f+a*d*f,E=p*d*l-h*v*l-p*o*m+a*v*m+h*o*g-a*d*g,b=e*x+n*y+s*_+r*E;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return t[0]=x*A,t[1]=(v*m*r-d*g*r-v*s*u+n*g*u+d*s*f-n*m*f)*A,t[2]=(o*g*r-v*l*r+v*s*c-n*g*c-o*s*f+n*l*f)*A,t[3]=(d*l*r-o*m*r-d*s*c+n*m*c+o*s*u-n*l*u)*A,t[4]=y*A,t[5]=(h*g*r-p*m*r+p*s*u-e*g*u-h*s*f+e*m*f)*A,t[6]=(p*l*r-a*g*r-p*s*c+e*g*c+a*s*f-e*l*f)*A,t[7]=(a*m*r-h*l*r+h*s*c-e*m*c-a*s*u+e*l*u)*A,t[8]=_*A,t[9]=(p*d*r-h*v*r-p*n*u+e*v*u+h*n*f-e*d*f)*A,t[10]=(a*v*r-p*o*r+p*n*c-e*v*c-a*n*f+e*o*f)*A,t[11]=(h*o*r-a*d*r-h*n*c+e*d*c+a*n*u-e*o*u)*A,t[12]=E*A,t[13]=(h*v*s-p*d*s+p*n*m-e*v*m-h*n*g+e*d*g)*A,t[14]=(p*o*s-a*v*s-p*n*l+e*v*l+a*n*g-e*o*g)*A,t[15]=(a*d*s-h*o*s+h*n*l-e*d*l-a*n*m+e*o*m)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,m=r*c,u=r*h,p=r*d,v=a*h,g=a*d,f=o*d,x=l*c,y=l*h,_=l*d,E=n.x,b=n.y,A=n.z;return s[0]=(1-(v+f))*E,s[1]=(u+_)*E,s[2]=(p-y)*E,s[3]=0,s[4]=(u-_)*b,s[5]=(1-(m+f))*b,s[6]=(g+x)*b,s[7]=0,s[8]=(p+y)*A,s[9]=(g-x)*A,s[10]=(1-(m+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Es.set(s[0],s[1],s[2]).length();const a=Es.set(s[4],s[5],s[6]).length(),o=Es.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],zn.copy(this);const c=1/r,h=1/a,d=1/o;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=h,zn.elements[5]*=h,zn.elements[6]*=h,zn.elements[8]*=d,zn.elements[9]*=d,zn.elements[10]*=d,e.setFromRotationMatrix(zn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=ni,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),m=(e+t)/(e-t),u=(n+s)/(n-s);let p,v;if(l)p=r/(a-r),v=a*r/(a-r);else if(o===ni)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===eo)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ni,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-s),m=-(e+t)/(e-t),u=-(n+s)/(n-s);let p,v;if(l)p=1/(a-r),v=a/(a-r);else if(o===ni)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===eo)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Es=new D,zn=new he,S0=new D(0,0,0),b0=new D(1,1,1),Ni=new D,ca=new D,_n=new D,ph=new he,mh=new cn;class Fn{constructor(t=0,e=0,n=0,s=Fn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],m=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(ae(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ae(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ae(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ae(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(m,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ae(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ph.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ph,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return mh.setFromEuler(this),this.setFromQuaternion(mh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fn.DEFAULT_ORDER="XYZ";class Vc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let w0=0;const gh=new D,As=new cn,vi=new he,ha=new D,fr=new D,T0=new D,E0=new cn,vh=new D(1,0,0),xh=new D(0,1,0),_h=new D(0,0,1),yh={type:"added"},A0={type:"removed"},Rs={type:"childadded",child:null},Vo={type:"childremoved",child:null};class ke extends sr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:w0++}),this.uuid=ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ke.DEFAULT_UP.clone();const t=new D,e=new Fn,n=new cn,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new he},normalMatrix:{value:new ie}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return As.setFromAxisAngle(t,e),this.quaternion.multiply(As),this}rotateOnWorldAxis(t,e){return As.setFromAxisAngle(t,e),this.quaternion.premultiply(As),this}rotateX(t){return this.rotateOnAxis(vh,t)}rotateY(t){return this.rotateOnAxis(xh,t)}rotateZ(t){return this.rotateOnAxis(_h,t)}translateOnAxis(t,e){return gh.copy(t).applyQuaternion(this.quaternion),this.position.add(gh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(vh,t)}translateY(t){return this.translateOnAxis(xh,t)}translateZ(t){return this.translateOnAxis(_h,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ha.copy(t):ha.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(fr,ha,this.up):vi.lookAt(ha,fr,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),As.setFromRotationMatrix(vi),this.quaternion.premultiply(As.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yh),Rs.child=t,this.dispatchEvent(Rs),Rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(A0),Vo.child=t,this.dispatchEvent(Vo),Vo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vi.multiply(t.parent.matrixWorld)),t.applyMatrix4(vi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yh),Rs.child=t,this.dispatchEvent(Rs),Rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,t,T0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,E0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),m=a(t.skeletons),u=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),m.length>0&&(n.skeletons=m),u.length>0&&(n.animations=u),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ke.DEFAULT_UP=new D(0,1,0);ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new D,xi=new D,Go=new D,_i=new D,Cs=new D,Ps=new D,Mh=new D,Wo=new D,Xo=new D,qo=new D,Yo=new Me,$o=new Me,Zo=new Me;class Ln{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),kn.subVectors(t,e),s.cross(kn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){kn.subVectors(s,e),xi.subVectors(n,e),Go.subVectors(t,e);const a=kn.dot(kn),o=kn.dot(xi),l=kn.dot(Go),c=xi.dot(xi),h=xi.dot(Go),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const m=1/d,u=(c*l-o*h)*m,p=(a*h-o*l)*m;return r.set(1-u-p,p,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,_i)===null?!1:_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,_i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,_i.x),l.addScaledVector(a,_i.y),l.addScaledVector(o,_i.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Yo.setScalar(0),$o.setScalar(0),Zo.setScalar(0),Yo.fromBufferAttribute(t,e),$o.fromBufferAttribute(t,n),Zo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Yo,r.x),a.addScaledVector($o,r.y),a.addScaledVector(Zo,r.z),a}static isFrontFacing(t,e,n,s){return kn.subVectors(n,e),xi.subVectors(t,e),kn.cross(xi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return kn.subVectors(this.c,this.b),xi.subVectors(this.a,this.b),kn.cross(xi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Ln.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Cs.subVectors(s,n),Ps.subVectors(r,n),Wo.subVectors(t,n);const l=Cs.dot(Wo),c=Ps.dot(Wo);if(l<=0&&c<=0)return e.copy(n);Xo.subVectors(t,s);const h=Cs.dot(Xo),d=Ps.dot(Xo);if(h>=0&&d<=h)return e.copy(s);const m=l*d-h*c;if(m<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Cs,a);qo.subVectors(t,r);const u=Cs.dot(qo),p=Ps.dot(qo);if(p>=0&&u<=p)return e.copy(r);const v=u*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Ps,o);const g=h*p-u*d;if(g<=0&&d-h>=0&&u-p>=0)return Mh.subVectors(r,s),o=(d-h)/(d-h+(u-p)),e.copy(s).addScaledVector(Mh,o);const f=1/(g+v+m);return a=v*f,o=m*f,e.copy(n).addScaledVector(Cs,a).addScaledVector(Ps,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const xd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},ua={h:0,s:0,l:0};function Jo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class $t{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=$e){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,pe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=pe.workingColorSpace){return this.r=t,this.g=e,this.b=n,pe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=pe.workingColorSpace){if(t=kc(t,1),e=ae(e,0,1),n=ae(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Jo(a,r,t+1/3),this.g=Jo(a,r,t),this.b=Jo(a,r,t-1/3)}return pe.colorSpaceToWorking(this,s),this}setStyle(t,e=$e){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=$e){const n=xd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ci(t.r),this.g=Ci(t.g),this.b=Ci(t.b),this}copyLinearToSRGB(t){return this.r=Xs(t.r),this.g=Xs(t.g),this.b=Xs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=$e){return pe.workingToColorSpace(tn.copy(this),t),Math.round(ae(tn.r*255,0,255))*65536+Math.round(ae(tn.g*255,0,255))*256+Math.round(ae(tn.b*255,0,255))}getHexString(t=$e){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=pe.workingColorSpace){pe.workingToColorSpace(tn.copy(this),e);const n=tn.r,s=tn.g,r=tn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=pe.workingColorSpace){return pe.workingToColorSpace(tn.copy(this),e),t.r=tn.r,t.g=tn.g,t.b=tn.b,t}getStyle(t=$e){pe.workingToColorSpace(tn.copy(this),t);const e=tn.r,n=tn.g,s=tn.b;return t!==$e?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Fi),this.setHSL(Fi.h+t,Fi.s+e,Fi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Fi),t.getHSL(ua);const n=Lr(Fi.h,ua.h,e),s=Lr(Fi.s,ua.s,e),r=Lr(Fi.l,ua.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const tn=new $t;$t.NAMES=xd;let R0=0;class Pi extends sr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:R0++}),this.uuid=ii(),this.name="",this.type="Material",this.blending=Ws,this.side=Gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ml,this.blendDst=Sl,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=Ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ms,this.stencilZFail=Ms,this.stencilZPass=Ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ws&&(n.blending=this.blending),this.side!==Gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ml&&(n.blendSrc=this.blendSrc),this.blendDst!==Sl&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ys&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==oh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ms&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ms&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ms&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Je extends Pi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Fe=new D,da=new dt;let C0=0;class Be{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:C0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=oc,this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)da.fromBufferAttribute(this,e),da.applyMatrix3(t),this.setXY(e,da.x,da.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Gn(e,this.array)),e}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Gn(e,this.array)),e}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Gn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Gn(e,this.array)),e}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array),r=xe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oc&&(t.usage=this.usage),t}}class _d extends Be{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class yd extends Be{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class le extends Be{constructor(t,e,n){super(new Float32Array(t),e,n)}}let P0=0;const An=new he,Ko=new ke,Is=new D,yn=new qn,pr=new qn,Ge=new D;class De extends sr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:P0++}),this.uuid=ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(gd(t)?yd:_d)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ie().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,n){return An.makeTranslation(t,e,n),this.applyMatrix4(An),this}scale(t,e,n){return An.makeScale(t,e,n),this.applyMatrix4(An),this}lookAt(t){return Ko.lookAt(t),Ko.updateMatrix(),this.applyMatrix4(Ko.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Is).negate(),this.translate(Is.x,Is.y,Is.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new le(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];pr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(yn.min,pr.min),yn.expandByPoint(Ge),Ge.addVectors(yn.max,pr.max),yn.expandByPoint(Ge)):(yn.expandByPoint(pr.min),yn.expandByPoint(pr.max))}yn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ge.fromBufferAttribute(o,c),l&&(Is.fromBufferAttribute(t,c),Ge.add(Is)),s=Math.max(s,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let T=0;T<n.count;T++)o[T]=new D,l[T]=new D;const c=new D,h=new D,d=new D,m=new dt,u=new dt,p=new dt,v=new D,g=new D;function f(T,M,S){c.fromBufferAttribute(n,T),h.fromBufferAttribute(n,M),d.fromBufferAttribute(n,S),m.fromBufferAttribute(r,T),u.fromBufferAttribute(r,M),p.fromBufferAttribute(r,S),h.sub(c),d.sub(c),u.sub(m),p.sub(m);const R=1/(u.x*p.y-p.x*u.y);isFinite(R)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(d,-u.y).multiplyScalar(R),g.copy(d).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(R),o[T].add(v),o[M].add(v),o[S].add(v),l[T].add(g),l[M].add(g),l[S].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,M=x.length;T<M;++T){const S=x[T],R=S.start,L=S.count;for(let I=R,N=R+L;I<N;I+=3)f(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const y=new D,_=new D,E=new D,b=new D;function A(T){E.fromBufferAttribute(s,T),b.copy(E);const M=o[T];y.copy(M),y.sub(E.multiplyScalar(E.dot(M))).normalize(),_.crossVectors(b,M);const R=_.dot(l[T])<0?-1:1;a.setXYZW(T,y.x,y.y,y.z,R)}for(let T=0,M=x.length;T<M;++T){const S=x[T],R=S.start,L=S.count;for(let I=R,N=R+L;I<N;I+=3)A(t.getX(I+0)),A(t.getX(I+1)),A(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Be(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let m=0,u=n.count;m<u;m++)n.setXYZ(m,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,d=new D;if(t)for(let m=0,u=t.count;m<u;m+=3){const p=t.getX(m+0),v=t.getX(m+1),g=t.getX(m+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let m=0,u=e.count;m<u;m+=3)s.fromBufferAttribute(e,m+0),r.fromBufferAttribute(e,m+1),a.fromBufferAttribute(e,m+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(m+0,h.x,h.y,h.z),n.setXYZ(m+1,h.x,h.y,h.z),n.setXYZ(m+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,m=new c.constructor(l.length*h);let u=0,p=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?u=l[v]*o.data.stride+o.offset:u=l[v]*h;for(let f=0;f<h;f++)m[p++]=c[u++]}return new Be(m,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new De,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const m=c[h],u=t(m,n);l.push(u)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,m=c.length;d<m;d++){const u=c[d];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let m=0,u=d.length;m<u;m++)h.push(d[m].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Sh=new he,Ji=new Hc,fa=new vs,bh=new D,pa=new D,ma=new D,ga=new D,jo=new D,va=new D,wh=new D,xa=new D;class Yt extends ke{constructor(t=new De,e=new Je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){va.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(jo.fromBufferAttribute(d,t),a?va.addScaledVector(jo,h):va.addScaledVector(jo.sub(e),h))}e.add(va)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(r),Ji.copy(t.ray).recast(t.near),!(fa.containsPoint(Ji.origin)===!1&&(Ji.intersectSphere(fa,bh)===null||Ji.origin.distanceToSquared(bh)>(t.far-t.near)**2))&&(Sh.copy(r).invert(),Ji.copy(t.ray).applyMatrix4(Sh),!(n.boundingBox!==null&&Ji.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ji)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,m=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=m.length;p<v;p++){const g=m[p],f=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let _=x,E=y;_<E;_+=3){const b=o.getX(_),A=o.getX(_+1),T=o.getX(_+2);s=_a(this,f,t,n,c,h,d,b,A,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let g=p,f=v;g<f;g+=3){const x=o.getX(g),y=o.getX(g+1),_=o.getX(g+2);s=_a(this,a,t,n,c,h,d,x,y,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,v=m.length;p<v;p++){const g=m[p],f=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let _=x,E=y;_<E;_+=3){const b=_,A=_+1,T=_+2;s=_a(this,f,t,n,c,h,d,b,A,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=p,f=v;g<f;g+=3){const x=g,y=g+1,_=g+2;s=_a(this,a,t,n,c,h,d,x,y,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function I0(i,t,e,n,s,r,a,o){let l;if(t.side===sn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Gi,o),l===null)return null;xa.copy(o),xa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(xa);return c<e.near||c>e.far?null:{distance:c,point:xa.clone(),object:i}}function _a(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,pa),i.getVertexPosition(l,ma),i.getVertexPosition(c,ga);const h=I0(i,t,e,n,pa,ma,ga,wh);if(h){const d=new D;Ln.getBarycoord(wh,pa,ma,ga,d),s&&(h.uv=Ln.getInterpolatedAttribute(s,o,l,c,d,new dt)),r&&(h.uv1=Ln.getInterpolatedAttribute(r,o,l,c,d,new dt)),a&&(h.normal=Ln.getInterpolatedAttribute(a,o,l,c,d,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const m={a:o,b:l,c,normal:new D,materialIndex:0};Ln.getNormal(pa,ma,ga,m.normal),h.face=m,h.barycoord=d}return h}class $n extends De{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let m=0,u=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new le(c,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(d,2));function p(v,g,f,x,y,_,E,b,A,T,M){const S=_/A,R=E/T,L=_/2,I=E/2,N=b/2,F=A+1,z=T+1;let G=0,H=0;const Z=new D;for(let tt=0;tt<z;tt++){const nt=tt*R-I;for(let bt=0;bt<F;bt++){const Dt=bt*S-L;Z[v]=Dt*x,Z[g]=nt*y,Z[f]=N,c.push(Z.x,Z.y,Z.z),Z[v]=0,Z[g]=0,Z[f]=b>0?1:-1,h.push(Z.x,Z.y,Z.z),d.push(bt/A),d.push(1-tt/T),G+=1}}for(let tt=0;tt<T;tt++)for(let nt=0;nt<A;nt++){const bt=m+nt+F*tt,Dt=m+nt+F*(tt+1),kt=m+(nt+1)+F*(tt+1),qt=m+(nt+1)+F*tt;l.push(bt,Dt,qt),l.push(Dt,kt,qt),H+=6}o.addGroup(u,H,M),u+=H,m+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Qs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function on(i){const t={};for(let e=0;e<i.length;e++){const n=Qs(i[e]);for(const s in n)t[s]=n[s]}return t}function L0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Md(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:pe.workingColorSpace}const hs={clone:Qs,merge:on};var D0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,U0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends Pi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=D0,this.fragmentShader=U0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Qs(t.uniforms),this.uniformsGroups=L0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Sd extends ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Oi=new D,Th=new dt,Eh=new dt;class nn extends Sd{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Br*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Br*2*Math.atan(Math.tan(Ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Oi.x,Oi.y).multiplyScalar(-t/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-t/Oi.z)}getViewSize(t,e){return this.getViewBounds(t,Th,Eh),e.subVectors(Eh,Th)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ir*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ls=-90,Ds=1;class N0 extends ke{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(Ls,Ds,t,e);s.layers=this.layers,this.add(s);const r=new nn(Ls,Ds,t,e);r.layers=this.layers,this.add(r);const a=new nn(Ls,Ds,t,e);a.layers=this.layers,this.add(a);const o=new nn(Ls,Ds,t,e);o.layers=this.layers,this.add(o);const l=new nn(Ls,Ds,t,e);l.layers=this.layers,this.add(l);const c=new nn(Ls,Ds,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===eo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),m=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,m,u),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class bd extends Ke{constructor(t=[],e=$s,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class F0 extends wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new bd(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new $n(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:Qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:ln});r.uniforms.tEquirect.value=e;const a=new Yt(s,r),o=e.minFilter;return e.minFilter===cs&&(e.minFilter=ei),new N0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class ne extends ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const O0={type:"move"};class Qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),f=this._getHandJoint(c,v);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],m=h.position.distanceTo(d.position),u=.02,p=.005;c.inputState.pinching&&m>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&m<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(O0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Gc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new $t(t),this.density=e}clone(){return new Gc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class lc extends ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class z0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=oc,this.updateRanges=[],this.version=0,this.uuid=ii()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const an=new D;class no{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyMatrix4(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyNormalMatrix(t),this.setXYZ(e,an.x,an.y,an.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.transformDirection(t),this.setXYZ(e,an.x,an.y,an.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Gn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Gn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Gn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Gn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array),r=xe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Be(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new no(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class cc extends Pi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Us;const mr=new D,Ns=new D,Fs=new D,Os=new dt,gr=new dt,wd=new he,ya=new D,vr=new D,Ma=new D,Ah=new dt,tl=new dt,Rh=new dt;class Ch extends ke{constructor(t=new cc){if(super(),this.isSprite=!0,this.type="Sprite",Us===void 0){Us=new De;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new z0(e,5);Us.setIndex([0,1,2,0,2,3]),Us.setAttribute("position",new no(n,3,0,!1)),Us.setAttribute("uv",new no(n,2,3,!1))}this.geometry=Us,this.material=t,this.center=new dt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ns.setFromMatrixScale(this.matrixWorld),wd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Fs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ns.multiplyScalar(-Fs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Sa(ya.set(-.5,-.5,0),Fs,a,Ns,s,r),Sa(vr.set(.5,-.5,0),Fs,a,Ns,s,r),Sa(Ma.set(.5,.5,0),Fs,a,Ns,s,r),Ah.set(0,0),tl.set(1,0),Rh.set(1,1);let o=t.ray.intersectTriangle(ya,vr,Ma,!1,mr);if(o===null&&(Sa(vr.set(-.5,.5,0),Fs,a,Ns,s,r),tl.set(0,1),o=t.ray.intersectTriangle(ya,Ma,vr,!1,mr),o===null))return;const l=t.ray.origin.distanceTo(mr);l<t.near||l>t.far||e.push({distance:l,point:mr.clone(),uv:Ln.getInterpolation(mr,ya,vr,Ma,Ah,tl,Rh,new dt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Sa(i,t,e,n,s,r){Os.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(gr.x=r*Os.x-s*Os.y,gr.y=s*Os.x+r*Os.y):gr.copy(Os),i.copy(t),i.x+=gr.x,i.y+=gr.y,i.applyMatrix4(wd)}class Td extends Ke{constructor(t=null,e=1,n=1,s,r,a,o,l,c=un,h=un,d,m){super(null,a,o,l,c,h,s,r,d,m),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ph extends Be{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const zs=new he,Ih=new he,ba=[],Lh=new qn,k0=new he,xr=new Yt,_r=new vs;class B0 extends Yt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ph(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,k0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new qn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zs),Lh.copy(t.boundingBox).applyMatrix4(zs),this.boundingBox.union(Lh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new vs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zs),_r.copy(t.boundingSphere).applyMatrix4(zs),this.boundingSphere.union(_r)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_r.copy(this.boundingSphere),_r.applyMatrix4(n),t.ray.intersectsSphere(_r)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zs),Ih.multiplyMatrices(n,zs),xr.matrixWorld=Ih,xr.raycast(t,ba);for(let a=0,o=ba.length;a<o;a++){const l=ba[a];l.instanceId=r,l.object=this,e.push(l)}ba.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ph(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Td(new Float32Array(s*this.count),s,this.count,xo,Wn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const el=new D,H0=new D,V0=new ie;class is{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=el.subVectors(n,e).cross(H0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(el),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||V0.getNormalMatrix(t),s=this.coplanarPoint(el).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ki=new vs,G0=new dt(.5,.5),wa=new D;class Wc{constructor(t=new is,e=new is,n=new is,s=new is,r=new is,a=new is){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ni,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],m=r[6],u=r[7],p=r[8],v=r[9],g=r[10],f=r[11],x=r[12],y=r[13],_=r[14],E=r[15];if(s[0].setComponents(c-a,u-h,f-p,E-x).normalize(),s[1].setComponents(c+a,u+h,f+p,E+x).normalize(),s[2].setComponents(c+o,u+d,f+v,E+y).normalize(),s[3].setComponents(c-o,u-d,f-v,E-y).normalize(),n)s[4].setComponents(l,m,g,_).normalize(),s[5].setComponents(c-l,u-m,f-g,E-_).normalize();else if(s[4].setComponents(c-l,u-m,f-g,E-_).normalize(),e===ni)s[5].setComponents(c+l,u+m,f+g,E+_).normalize();else if(e===eo)s[5].setComponents(l,m,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ki.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ki.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ki)}intersectsSprite(t){Ki.center.set(0,0,0);const e=G0.distanceTo(t.center);return Ki.radius=.7071067811865476+e,Ki.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ki)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(wa.x=s.normal.x>0?t.max.x:t.min.x,wa.y=s.normal.y>0?t.max.y:t.min.y,wa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(wa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ed extends Pi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Dh=new he,hc=new Hc,Ta=new vs,Ea=new D;class W0 extends ke{constructor(t=new De,e=new Ed){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ta.copy(n.boundingSphere),Ta.applyMatrix4(s),Ta.radius+=r,t.ray.intersectsSphere(Ta)===!1)return;Dh.copy(s).invert(),hc.copy(t.ray).applyMatrix4(Dh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const m=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let p=m,v=u;p<v;p++){const g=c.getX(p);Ea.fromBufferAttribute(d,g),Uh(Ea,g,l,s,t,e,this)}}else{const m=Math.max(0,a.start),u=Math.min(d.count,a.start+a.count);for(let p=m,v=u;p<v;p++)Ea.fromBufferAttribute(d,p),Uh(Ea,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Uh(i,t,e,n,s,r,a){const o=hc.distanceSqToPoint(i);if(o<e){const l=new D;hc.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class X0 extends Ke{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Xc extends Ke{constructor(t,e,n=ds,s,r,a,o=un,l=un,c,h=kr,d=1){if(h!==kr&&h!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:t,height:e,depth:d};super(m,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Bc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ad extends Ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Xi extends De{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new D,h=new dt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,m=3;d<=e;d++,m+=3){const u=n+d/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[m]/t+1)/2,h.y=(a[m+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(o,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ee extends De{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],m=[],u=[];let p=0;const v=[],g=n/2;let f=0;x(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new le(d,3)),this.setAttribute("normal",new le(m,3)),this.setAttribute("uv",new le(u,2));function x(){const _=new D,E=new D;let b=0;const A=(e-t)/n;for(let T=0;T<=r;T++){const M=[],S=T/r,R=S*(e-t)+t;for(let L=0;L<=s;L++){const I=L/s,N=I*l+o,F=Math.sin(N),z=Math.cos(N);E.x=R*F,E.y=-S*n+g,E.z=R*z,d.push(E.x,E.y,E.z),_.set(F,A,z).normalize(),m.push(_.x,_.y,_.z),u.push(I,1-S),M.push(p++)}v.push(M)}for(let T=0;T<s;T++)for(let M=0;M<r;M++){const S=v[M][T],R=v[M+1][T],L=v[M+1][T+1],I=v[M][T+1];(t>0||M!==0)&&(h.push(S,R,I),b+=3),(e>0||M!==r-1)&&(h.push(R,L,I),b+=3)}c.addGroup(f,b,0),f+=b}function y(_){const E=p,b=new dt,A=new D;let T=0;const M=_===!0?t:e,S=_===!0?1:-1;for(let L=1;L<=s;L++)d.push(0,g*S,0),m.push(0,S,0),u.push(.5,.5),p++;const R=p;for(let L=0;L<=s;L++){const N=L/s*l+o,F=Math.cos(N),z=Math.sin(N);A.x=M*z,A.y=g*S,A.z=M*F,d.push(A.x,A.y,A.z),m.push(0,S,0),b.x=F*.5+.5,b.y=z*.5*S+.5,u.push(b.x,b.y),p++}for(let L=0;L<s;L++){const I=E+L,N=R+L;_===!0?h.push(N,N+1,I):h.push(N+1,N,I),T+=3}c.addGroup(f,T,_===!0?1:2),f+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ee(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class qc extends De{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new le(r,3)),this.setAttribute("normal",new le(r.slice(),3)),this.setAttribute("uv",new le(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new D,_=new D,E=new D;for(let b=0;b<e.length;b+=3)u(e[b+0],y),u(e[b+1],_),u(e[b+2],E),l(y,_,E,x)}function l(x,y,_,E){const b=E+1,A=[];for(let T=0;T<=b;T++){A[T]=[];const M=x.clone().lerp(_,T/b),S=y.clone().lerp(_,T/b),R=b-T;for(let L=0;L<=R;L++)L===0&&T===b?A[T][L]=M:A[T][L]=M.clone().lerp(S,L/R)}for(let T=0;T<b;T++)for(let M=0;M<2*(b-T)-1;M++){const S=Math.floor(M/2);M%2===0?(m(A[T][S+1]),m(A[T+1][S]),m(A[T][S])):(m(A[T][S+1]),m(A[T+1][S+1]),m(A[T+1][S]))}}function c(x){const y=new D;for(let _=0;_<r.length;_+=3)y.x=r[_+0],y.y=r[_+1],y.z=r[_+2],y.normalize().multiplyScalar(x),r[_+0]=y.x,r[_+1]=y.y,r[_+2]=y.z}function h(){const x=new D;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const _=g(x)/2/Math.PI+.5,E=f(x)/Math.PI+.5;a.push(_,1-E)}p(),d()}function d(){for(let x=0;x<a.length;x+=6){const y=a[x+0],_=a[x+2],E=a[x+4],b=Math.max(y,_,E),A=Math.min(y,_,E);b>.9&&A<.1&&(y<.2&&(a[x+0]+=1),_<.2&&(a[x+2]+=1),E<.2&&(a[x+4]+=1))}}function m(x){r.push(x.x,x.y,x.z)}function u(x,y){const _=x*3;y.x=t[_+0],y.y=t[_+1],y.z=t[_+2]}function p(){const x=new D,y=new D,_=new D,E=new D,b=new dt,A=new dt,T=new dt;for(let M=0,S=0;M<r.length;M+=9,S+=6){x.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),b.set(a[S+0],a[S+1]),A.set(a[S+2],a[S+3]),T.set(a[S+4],a[S+5]),E.copy(x).add(y).add(_).divideScalar(3);const R=g(E);v(b,S+0,x,R),v(A,S+2,y,R),v(T,S+4,_,R)}}function v(x,y,_,E){E<0&&x.x===1&&(a[y]=x.x-1),_.x===0&&_.z===0&&(a[y]=E/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qc(t.vertices,t.indices,t.radius,t.details)}}class hi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],m=n[s+1]-h,u=(a-h)/m;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new dt:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new D,s=[],r=[],a=[],o=new D,l=new he;for(let u=0;u<=t;u++){const p=u/t;s[u]=this.getTangentAt(p,new D)}r[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),m=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),m<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(ae(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(l.makeRotationAxis(o,p))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(ae(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],u*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Gr extends hi{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new dt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),m=l-this.aX,u=c-this.aY;l=m*h-u*d+this.aX,c=m*d+u*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class q0 extends Gr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Yc(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let m=(a-r)/c-(o-r)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+d)+(l-o)/d;m*=h,u*=h,s(a,o,m,u)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Aa=new D,nl=new Yc,il=new Yc,sl=new Yc;class fs extends hi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Aa.subVectors(s[0],s[1]).add(s[0]),c=Aa);const d=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Aa.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Aa),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),u),v=Math.pow(d.distanceToSquared(m),u),g=Math.pow(m.distanceToSquared(h),u);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),nl.initNonuniformCatmullRom(c.x,d.x,m.x,h.x,p,v,g),il.initNonuniformCatmullRom(c.y,d.y,m.y,h.y,p,v,g),sl.initNonuniformCatmullRom(c.z,d.z,m.z,h.z,p,v,g)}else this.curveType==="catmullrom"&&(nl.initCatmullRom(c.x,d.x,m.x,h.x,this.tension),il.initCatmullRom(c.y,d.y,m.y,h.y,this.tension),sl.initCatmullRom(c.z,d.z,m.z,h.z,this.tension));return n.set(nl.calc(l),il.calc(l),sl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Nh(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Y0(i,t){const e=1-i;return e*e*t}function $0(i,t){return 2*(1-i)*i*t}function Z0(i,t){return i*i*t}function Dr(i,t,e,n){return Y0(i,t)+$0(i,e)+Z0(i,n)}function J0(i,t){const e=1-i;return e*e*e*t}function K0(i,t){const e=1-i;return 3*e*e*i*t}function j0(i,t){return 3*(1-i)*i*i*t}function Q0(i,t){return i*i*i*t}function Ur(i,t,e,n,s){return J0(i,t)+K0(i,e)+j0(i,n)+Q0(i,s)}class Rd extends hi{constructor(t=new dt,e=new dt,n=new dt,s=new dt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new dt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ur(t,s.x,r.x,a.x,o.x),Ur(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class tp extends hi{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ur(t,s.x,r.x,a.x,o.x),Ur(t,s.y,r.y,a.y,o.y),Ur(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Cd extends hi{constructor(t=new dt,e=new dt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new dt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new dt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class uc extends hi{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pd extends hi{constructor(t=new dt,e=new dt,n=new dt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new dt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Dr(t,s.x,r.x,a.x),Dr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Id extends hi{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Dr(t,s.x,r.x,a.x),Dr(t,s.y,r.y,a.y),Dr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ld extends hi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new dt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Nh(o,l.x,c.x,h.x,d.x),Nh(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new dt().fromArray(s))}return this}}var io=Object.freeze({__proto__:null,ArcCurve:q0,CatmullRomCurve3:fs,CubicBezierCurve:Rd,CubicBezierCurve3:tp,EllipseCurve:Gr,LineCurve:Cd,LineCurve3:uc,QuadraticBezierCurve:Pd,QuadraticBezierCurve3:Id,SplineCurve:Ld});class ep extends hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new io[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new io[s.type]().fromJSON(s))}return this}}class so extends ep{constructor(t){super(),this.type="Path",this.currentPoint=new dt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Cd(this.currentPoint.clone(),new dt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Pd(this.currentPoint.clone(),new dt(t,e),new dt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Rd(this.currentPoint.clone(),new dt(t,e),new dt(n,s),new dt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Ld(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Gr(t,e,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ii extends so{constructor(t){super(t),this.uuid=ii(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new so().fromJSON(s))}return this}}function np(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Dd(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=op(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let m=e;m<s;m+=e){const u=i[m],p=i[m+1];u<o&&(o=u),p<l&&(l=p),u>h&&(h=u),p>d&&(d=p)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Wr(r,a,e,o,l,c,0),a}function Dd(i,t,e,n,s){let r;if(s===xp(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Fh(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Fh(a/n|0,i[a],i[a+1],r);return r&&tr(r,r.next)&&(qr(r),r=r.next),r}function ps(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(tr(e,e.next)||Ie(e.prev,e,e.next)===0)){if(qr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Wr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&dp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?sp(i,n,s,r):ip(i)){t.push(l.i,i.i,c.i),qr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=rp(ps(i),t),Wr(i,t,e,n,s,r,2)):a===2&&ap(i,t,e,n,s,r):Wr(ps(i),t,e,n,s,r,1);break}}}function ip(i){const t=i.prev,e=i,n=i.next;if(Ie(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),m=Math.max(s,r,a),u=Math.max(o,l,c);let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=m&&p.y>=d&&p.y<=u&&wr(s,o,r,l,a,c,p.x,p.y)&&Ie(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function sp(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Ie(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,m=a.y,u=Math.min(o,l,c),p=Math.min(h,d,m),v=Math.max(o,l,c),g=Math.max(h,d,m),f=dc(u,p,t,e,n),x=dc(v,g,t,e,n);let y=i.prevZ,_=i.nextZ;for(;y&&y.z>=f&&_&&_.z<=x;){if(y.x>=u&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==a&&wr(o,h,l,d,c,m,y.x,y.y)&&Ie(y.prev,y,y.next)>=0||(y=y.prevZ,_.x>=u&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==a&&wr(o,h,l,d,c,m,_.x,_.y)&&Ie(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;y&&y.z>=f;){if(y.x>=u&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==a&&wr(o,h,l,d,c,m,y.x,y.y)&&Ie(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;_&&_.z<=x;){if(_.x>=u&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==a&&wr(o,h,l,d,c,m,_.x,_.y)&&Ie(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function rp(i,t){let e=i;do{const n=e.prev,s=e.next.next;!tr(n,s)&&Nd(n,e,e.next,s)&&Xr(n,s)&&Xr(s,n)&&(t.push(n.i,e.i,s.i),qr(e),qr(e.next),e=i=s),e=e.next}while(e!==i);return ps(e)}function ap(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&mp(a,o)){let l=Fd(a,o);a=ps(a,a.next),l=ps(l,l.next),Wr(a,t,e,n,s,r,0),Wr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function op(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Dd(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(pp(c))}s.sort(lp);for(let r=0;r<s.length;r++)e=cp(s[r],e);return e}function lp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function cp(i,t){const e=hp(i,t);if(!e)return t;const n=Fd(e,i);return ps(n,n.next),ps(e,e.next)}function hp(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(tr(i,e))return e;do{if(tr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Ud(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const d=Math.abs(s-e.y)/(n-e.x);Xr(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&up(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function up(i,t){return Ie(i.prev,i,t.prev)<0&&Ie(t.next,i,i.next)<0}function dp(i,t,e,n){let s=i;do s.z===0&&(s.z=dc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,fp(s)}function fp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function dc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function pp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ud(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function wr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Ud(i,t,e,n,s,r,a,o)}function mp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!gp(i,t)&&(Xr(i,t)&&Xr(t,i)&&vp(i,t)&&(Ie(i.prev,i,t.prev)||Ie(i,t.prev,t))||tr(i,t)&&Ie(i.prev,i,i.next)>0&&Ie(t.prev,t,t.next)>0)}function Ie(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function tr(i,t){return i.x===t.x&&i.y===t.y}function Nd(i,t,e,n){const s=Ca(Ie(i,t,e)),r=Ca(Ie(i,t,n)),a=Ca(Ie(e,n,i)),o=Ca(Ie(e,n,t));return!!(s!==r&&a!==o||s===0&&Ra(i,e,t)||r===0&&Ra(i,n,t)||a===0&&Ra(e,i,n)||o===0&&Ra(e,t,n))}function Ra(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ca(i){return i>0?1:i<0?-1:0}function gp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Nd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Xr(i,t){return Ie(i.prev,i,i.next)<0?Ie(i,t,i.next)>=0&&Ie(i,i.prev,t)>=0:Ie(i,t,i.prev)<0||Ie(i,i.next,t)<0}function vp(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Fd(i,t){const e=fc(i.i,i.x,i.y),n=fc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Fh(i,t,e,n){const s=fc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function qr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function fc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function xp(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class _p{static triangulate(t,e,n=2){return np(t,e,n)}}class Ri{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ri.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Oh(t),zh(n,t);let a=t.length;e.forEach(Oh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,zh(n,e[l]);const o=_p.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Oh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function zh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class yo extends De{constructor(t=new Ii([new dt(.5,.5),new dt(-.5,.5),new dt(-.5,-.5),new dt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new le(s,3)),this.setAttribute("uv",new le(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let m=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:u-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:yp;let y,_=!1,E,b,A,T;f&&(y=f.getSpacedPoints(h),_=!0,m=!1,E=f.computeFrenetFrames(h,!1),b=new D,A=new D,T=new D),m||(g=0,u=0,p=0,v=0);const M=o.extractPoints(c);let S=M.shape;const R=M.holes;if(!Ri.isClockWise(S)){S=S.reverse();for(let ot=0,st=R.length;ot<st;ot++){const it=R[ot];Ri.isClockWise(it)&&(R[ot]=it.reverse())}}function I(ot){const it=10000000000000001e-36;let q=ot[0];for(let ht=1;ht<=ot.length;ht++){const lt=ht%ot.length,gt=ot[lt],Vt=gt.x-q.x,Gt=gt.y-q.y,P=Vt*Vt+Gt*Gt,w=Math.max(Math.abs(gt.x),Math.abs(gt.y),Math.abs(q.x),Math.abs(q.y)),V=it*w*w;if(P<=V){ot.splice(lt,1),ht--;continue}q=gt}}I(S),R.forEach(I);const N=R.length,F=S;for(let ot=0;ot<N;ot++){const st=R[ot];S=S.concat(st)}function z(ot,st,it){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),ot.clone().addScaledVector(st,it)}const G=S.length;function H(ot,st,it){let q,ht,lt;const gt=ot.x-st.x,Vt=ot.y-st.y,Gt=it.x-ot.x,P=it.y-ot.y,w=gt*gt+Vt*Vt,V=gt*P-Vt*Gt;if(Math.abs(V)>Number.EPSILON){const Y=Math.sqrt(w),rt=Math.sqrt(Gt*Gt+P*P),$=st.x-Vt/Y,Rt=st.y+gt/Y,ft=it.x-P/rt,Nt=it.y+Gt/rt,Bt=((ft-$)*P-(Nt-Rt)*Gt)/(gt*P-Vt*Gt);q=$+gt*Bt-ot.x,ht=Rt+Vt*Bt-ot.y;const xt=q*q+ht*ht;if(xt<=2)return new dt(q,ht);lt=Math.sqrt(xt/2)}else{let Y=!1;gt>Number.EPSILON?Gt>Number.EPSILON&&(Y=!0):gt<-Number.EPSILON?Gt<-Number.EPSILON&&(Y=!0):Math.sign(Vt)===Math.sign(P)&&(Y=!0),Y?(q=-Vt,ht=gt,lt=Math.sqrt(w)):(q=gt,ht=Vt,lt=Math.sqrt(w/2))}return new dt(q/lt,ht/lt)}const Z=[];for(let ot=0,st=F.length,it=st-1,q=ot+1;ot<st;ot++,it++,q++)it===st&&(it=0),q===st&&(q=0),Z[ot]=H(F[ot],F[it],F[q]);const tt=[];let nt,bt=Z.concat();for(let ot=0,st=N;ot<st;ot++){const it=R[ot];nt=[];for(let q=0,ht=it.length,lt=ht-1,gt=q+1;q<ht;q++,lt++,gt++)lt===ht&&(lt=0),gt===ht&&(gt=0),nt[q]=H(it[q],it[lt],it[gt]);tt.push(nt),bt=bt.concat(nt)}let Dt;if(g===0)Dt=Ri.triangulateShape(F,R);else{const ot=[],st=[];for(let it=0;it<g;it++){const q=it/g,ht=u*Math.cos(q*Math.PI/2),lt=p*Math.sin(q*Math.PI/2)+v;for(let gt=0,Vt=F.length;gt<Vt;gt++){const Gt=z(F[gt],Z[gt],lt);yt(Gt.x,Gt.y,-ht),q===0&&ot.push(Gt)}for(let gt=0,Vt=N;gt<Vt;gt++){const Gt=R[gt];nt=tt[gt];const P=[];for(let w=0,V=Gt.length;w<V;w++){const Y=z(Gt[w],nt[w],lt);yt(Y.x,Y.y,-ht),q===0&&P.push(Y)}q===0&&st.push(P)}}Dt=Ri.triangulateShape(ot,st)}const kt=Dt.length,qt=p+v;for(let ot=0;ot<G;ot++){const st=m?z(S[ot],bt[ot],qt):S[ot];_?(A.copy(E.normals[0]).multiplyScalar(st.x),b.copy(E.binormals[0]).multiplyScalar(st.y),T.copy(y[0]).add(A).add(b),yt(T.x,T.y,T.z)):yt(st.x,st.y,0)}for(let ot=1;ot<=h;ot++)for(let st=0;st<G;st++){const it=m?z(S[st],bt[st],qt):S[st];_?(A.copy(E.normals[ot]).multiplyScalar(it.x),b.copy(E.binormals[ot]).multiplyScalar(it.y),T.copy(y[ot]).add(A).add(b),yt(T.x,T.y,T.z)):yt(it.x,it.y,d/h*ot)}for(let ot=g-1;ot>=0;ot--){const st=ot/g,it=u*Math.cos(st*Math.PI/2),q=p*Math.sin(st*Math.PI/2)+v;for(let ht=0,lt=F.length;ht<lt;ht++){const gt=z(F[ht],Z[ht],q);yt(gt.x,gt.y,d+it)}for(let ht=0,lt=R.length;ht<lt;ht++){const gt=R[ht];nt=tt[ht];for(let Vt=0,Gt=gt.length;Vt<Gt;Vt++){const P=z(gt[Vt],nt[Vt],q);_?yt(P.x,P.y+y[h-1].y,y[h-1].x+it):yt(P.x,P.y,d+it)}}}J(),et();function J(){const ot=s.length/3;if(m){let st=0,it=G*st;for(let q=0;q<kt;q++){const ht=Dt[q];St(ht[2]+it,ht[1]+it,ht[0]+it)}st=h+g*2,it=G*st;for(let q=0;q<kt;q++){const ht=Dt[q];St(ht[0]+it,ht[1]+it,ht[2]+it)}}else{for(let st=0;st<kt;st++){const it=Dt[st];St(it[2],it[1],it[0])}for(let st=0;st<kt;st++){const it=Dt[st];St(it[0]+G*h,it[1]+G*h,it[2]+G*h)}}n.addGroup(ot,s.length/3-ot,0)}function et(){const ot=s.length/3;let st=0;_t(F,st),st+=F.length;for(let it=0,q=R.length;it<q;it++){const ht=R[it];_t(ht,st),st+=ht.length}n.addGroup(ot,s.length/3-ot,1)}function _t(ot,st){let it=ot.length;for(;--it>=0;){const q=it;let ht=it-1;ht<0&&(ht=ot.length-1);for(let lt=0,gt=h+g*2;lt<gt;lt++){const Vt=G*lt,Gt=G*(lt+1),P=st+q+Vt,w=st+ht+Vt,V=st+ht+Gt,Y=st+q+Gt;Wt(P,w,V,Y)}}}function yt(ot,st,it){l.push(ot),l.push(st),l.push(it)}function St(ot,st,it){Kt(ot),Kt(st),Kt(it);const q=s.length/3,ht=x.generateTopUV(n,s,q-3,q-2,q-1);O(ht[0]),O(ht[1]),O(ht[2])}function Wt(ot,st,it,q){Kt(ot),Kt(st),Kt(q),Kt(st),Kt(it),Kt(q);const ht=s.length/3,lt=x.generateSideWallUV(n,s,ht-6,ht-3,ht-2,ht-1);O(lt[0]),O(lt[1]),O(lt[3]),O(lt[1]),O(lt[2]),O(lt[3])}function Kt(ot){s.push(l[ot*3+0]),s.push(l[ot*3+1]),s.push(l[ot*3+2])}function O(ot){r.push(ot.x),r.push(ot.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Mp(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new io[s.type]().fromJSON(s)),new yo(n,t.options)}}const yp={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new dt(r,a),new dt(o,l),new dt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],m=t[s*3],u=t[s*3+1],p=t[s*3+2],v=t[r*3],g=t[r*3+1],f=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new dt(a,1-l),new dt(c,1-d),new dt(m,1-p),new dt(v,1-f)]:[new dt(o,1-l),new dt(h,1-d),new dt(u,1-p),new dt(g,1-f)]}};function Mp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Mo extends qc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Mo(t.radius,t.detail)}}class So extends De{constructor(t=[new dt(0,-.5),new dt(.5,0),new dt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ae(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,d=new D,m=new dt,u=new D,p=new D,v=new D;let g=0,f=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:g=t[x+1].x-t[x].x,f=t[x+1].y-t[x].y,u.x=f*1,u.y=-g,u.z=f*0,v.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[x+1].x-t[x].x,f=t[x+1].y-t[x].y,u.x=f*1,u.y=-g,u.z=f*0,p.copy(u),u.x+=v.x,u.y+=v.y,u.z+=v.z,u.normalize(),l.push(u.x,u.y,u.z),v.copy(p)}for(let x=0;x<=e;x++){const y=n+x*h*s,_=Math.sin(y),E=Math.cos(y);for(let b=0;b<=t.length-1;b++){d.x=t[b].x*_,d.y=t[b].y,d.z=t[b].x*E,a.push(d.x,d.y,d.z),m.x=x/e,m.y=b/(t.length-1),o.push(m.x,m.y);const A=l[3*b+0]*_,T=l[3*b+1],M=l[3*b+0]*E;c.push(A,T,M)}}for(let x=0;x<e;x++)for(let y=0;y<t.length-1;y++){const _=y+x*t.length,E=_,b=_+t.length,A=_+t.length+1,T=_+1;r.push(E,b,T),r.push(A,T,b)}this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("uv",new le(o,2)),this.setAttribute("normal",new le(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new So(t.points,t.segments,t.phiStart,t.phiLength)}}class ue extends De{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,m=e/l,u=[],p=[],v=[],g=[];for(let f=0;f<h;f++){const x=f*m-a;for(let y=0;y<c;y++){const _=y*d-r;p.push(_,-x,0),v.push(0,0,1),g.push(y/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let x=0;x<o;x++){const y=x+c*f,_=x+c*(f+1),E=x+1+c*(f+1),b=x+1+c*f;u.push(y,_,b),u.push(_,E,b)}this.setIndex(u),this.setAttribute("position",new le(p,3)),this.setAttribute("normal",new le(v,3)),this.setAttribute("uv",new le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ue(t.width,t.height,t.widthSegments,t.heightSegments)}}class bo extends De{constructor(t=new Ii([new dt(0,.5),new dt(-.5,-.5),new dt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new le(s,3)),this.setAttribute("normal",new le(r,3)),this.setAttribute("uv",new le(a,2));function c(h){const d=s.length/3,m=h.extractPoints(e);let u=m.shape;const p=m.holes;Ri.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,f=p.length;g<f;g++){const x=p[g];Ri.isClockWise(x)===!0&&(p[g]=x.reverse())}const v=Ri.triangulateShape(u,p);for(let g=0,f=p.length;g<f;g++){const x=p[g];u=u.concat(x)}for(let g=0,f=u.length;g<f;g++){const x=u[g];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let g=0,f=v.length;g<f;g++){const x=v[g],y=x[0]+d,_=x[1]+d,E=x[2]+d;n.push(y,_,E),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Sp(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new bo(n,t.curveSegments)}}function Sp(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Pe extends De{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new D,m=new D,u=[],p=[],v=[],g=[];for(let f=0;f<=n;f++){const x=[],y=f/n;let _=0;f===0&&a===0?_=.5/e:f===n&&l===Math.PI&&(_=-.5/e);for(let E=0;E<=e;E++){const b=E/e;d.x=-t*Math.cos(s+b*r)*Math.sin(a+y*o),d.y=t*Math.cos(a+y*o),d.z=t*Math.sin(s+b*r)*Math.sin(a+y*o),p.push(d.x,d.y,d.z),m.copy(d).normalize(),v.push(m.x,m.y,m.z),g.push(b+_,1-y),x.push(c++)}h.push(x)}for(let f=0;f<n;f++)for(let x=0;x<e;x++){const y=h[f][x+1],_=h[f][x],E=h[f+1][x],b=h[f+1][x+1];(f!==0||a>0)&&u.push(y,_,b),(f!==n-1||l<Math.PI)&&u.push(_,E,b)}this.setIndex(u),this.setAttribute("position",new le(p,3)),this.setAttribute("normal",new le(v,3)),this.setAttribute("uv",new le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class er extends De{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new D,d=new D,m=new D;for(let u=0;u<=n;u++)for(let p=0;p<=s;p++){const v=p/s*r,g=u/n*Math.PI*2;d.x=(t+e*Math.cos(g))*Math.cos(v),d.y=(t+e*Math.cos(g))*Math.sin(v),d.z=e*Math.sin(g),o.push(d.x,d.y,d.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),m.subVectors(d,h).normalize(),l.push(m.x,m.y,m.z),c.push(p/s),c.push(u/n)}for(let u=1;u<=n;u++)for(let p=1;p<=s;p++){const v=(s+1)*u+p-1,g=(s+1)*(u-1)+p-1,f=(s+1)*(u-1)+p,x=(s+1)*u+p;a.push(v,g,x),a.push(g,f,x)}this.setIndex(a),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(l,3)),this.setAttribute("uv",new le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new er(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class si extends De{constructor(t=new Id(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new D,l=new D,c=new dt;let h=new D;const d=[],m=[],u=[],p=[];v(),this.setIndex(p),this.setAttribute("position",new le(d,3)),this.setAttribute("normal",new le(m,3)),this.setAttribute("uv",new le(u,2));function v(){for(let y=0;y<e;y++)g(y);g(r===!1?e:0),x(),f()}function g(y){h=t.getPointAt(y/e,h);const _=a.normals[y],E=a.binormals[y];for(let b=0;b<=s;b++){const A=b/s*Math.PI*2,T=Math.sin(A),M=-Math.cos(A);l.x=M*_.x+T*E.x,l.y=M*_.y+T*E.y,l.z=M*_.z+T*E.z,l.normalize(),m.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function f(){for(let y=1;y<=e;y++)for(let _=1;_<=s;_++){const E=(s+1)*(y-1)+(_-1),b=(s+1)*y+(_-1),A=(s+1)*y+_,T=(s+1)*(y-1)+_;p.push(E,b,T),p.push(b,A,T)}}function x(){for(let y=0;y<=e;y++)for(let _=0;_<=s;_++)c.x=y/e,c.y=_/s,u.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new si(new io[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class bp extends hn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Lt extends Pi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_o,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Vs extends Lt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new dt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ae(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new $t(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new $t(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new $t(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class wp extends Pi{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_o,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Tp extends Pi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_o,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ep extends Pi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ap extends Pi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const rl={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Rp{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,m=c.length;d<m;d+=2){const u=c[d],p=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Cp=new Rp;class $c{constructor(t){this.manager=t!==void 0?t:Cp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}$c.DEFAULT_MATERIAL_NAME="__DEFAULT";const ks=new WeakMap;class Pp extends $c{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=rl.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let d=ks.get(a);d===void 0&&(d=[],ks.set(a,d)),d.push({onLoad:e,onError:s})}return a}const o=Hr("img");function l(){h(),e&&e(this);const d=ks.get(this)||[];for(let m=0;m<d.length;m++){const u=d[m];u.onLoad&&u.onLoad(this)}ks.delete(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),rl.remove(`image:${t}`);const m=ks.get(this)||[];for(let u=0;u<m.length;u++){const p=m[u];p.onError&&p.onError(d)}ks.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),rl.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class Od extends $c{constructor(t){super(t)}load(t,e,n,s){const r=new Ke,a=new Pp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class Zc extends ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class kh extends Zc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const al=new he,Bh=new D,Hh=new D;class zd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new dt(512,512),this.mapType=oi,this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wc,this._frameExtents=new dt(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Bh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Bh),Hh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Hh),e.updateMatrixWorld(),al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(al,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(al)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Vh=new he,yr=new D,ol=new D;class Ip extends zd{constructor(){super(new nn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new dt(4,2),this._viewportCount=6,this._viewports=[new Me(2,1,1,1),new Me(0,1,1,1),new Me(3,1,1,1),new Me(1,1,1,1),new Me(3,0,1,1),new Me(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),yr.setFromMatrixPosition(t.matrixWorld),n.position.copy(yr),ol.copy(n.position),ol.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ol),n.updateMatrixWorld(),s.makeTranslation(-yr.x,-yr.y,-yr.z),Vh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vh,n.coordinateSystem,n.reversedDepth)}}class ro extends Zc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ip}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Jc extends Sd{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Lp extends zd{constructor(){super(new Jc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Pa extends Zc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.target=new ke,this.shadow=new Lp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Dp extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Up{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const Gh=new he;class Np{constructor(t,e,n=0,s=1/0){this.ray=new Hc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Vc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Gh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gh),this}intersectObject(t,e=!0,n=[]){return pc(t,this,n,e),n.sort(Wh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)pc(t[s],this,n,e);return n.sort(Wh),n}}function Wh(i,t){return i.distance-t.distance}function pc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)pc(r[a],t,e,!0)}}function Xh(i,t,e,n){const s=Fp(n);switch(e){case dd:return i*t;case xo:return i*t/s.components*s.byteLength;case Fc:return i*t/s.components*s.byteLength;case pd:return i*t*2/s.components*s.byteLength;case Oc:return i*t*2/s.components*s.byteLength;case fd:return i*t*3/s.components*s.byteLength;case Xn:return i*t*4/s.components*s.byteLength;case zc:return i*t*4/s.components*s.byteLength;case qa:case Ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case $a:case Za:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ul:case Fl:return Math.max(i,16)*Math.max(t,8)/4;case Dl:case Nl:return Math.max(i,8)*Math.max(t,8)/2;case Ol:case zl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case kl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Bl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Hl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Vl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Gl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Wl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Xl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ql:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Yl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case $l:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Jl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Kl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case jl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ql:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case tc:case ec:case nc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ic:case sc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case rc:case ac:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fp(i){switch(i){case oi:case ld:return{byteLength:1,components:1};case zr:case cd:case li:return{byteLength:2,components:1};case Uc:case Nc:return{byteLength:2,components:4};case ds:case Dc:case Wn:return{byteLength:4,components:1};case hd:case ud:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function kd(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Op(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,m=i.createBuffer();i.bindBuffer(l,m),i.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=i.SHORT;else if(c instanceof Uint32Array)u=i.UNSIGNED_INT;else if(c instanceof Int32Array)u=i.INT;else if(c instanceof Int8Array)u=i.BYTE;else if(c instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((u,p)=>u.start-p.start);let m=0;for(let u=1;u<d.length;u++){const p=d[m],v=d[u];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++m,d[m]=v)}d.length=m+1;for(let u=0,p=d.length;u<p;u++){const v=d[u];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var zp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kp=`#ifdef USE_ALPHAHASH
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
#endif`,Bp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wp=`#ifdef USE_AOMAP
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
#endif`,Xp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qp=`#ifdef USE_BATCHING
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
#endif`,Yp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$p=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Kp=`#ifdef USE_IRIDESCENCE
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
#endif`,jp=`#ifdef USE_BUMPMAP
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
#endif`,Qp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,em=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,im=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,sm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,rm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,am=`#if defined( USE_COLOR_ALPHA )
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
#endif`,om=`#define PI 3.141592653589793
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
} // validated`,lm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,cm=`vec3 transformedNormal = objectNormal;
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
#endif`,hm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,um=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,dm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,pm="gl_FragColor = linearToOutputTexel( gl_FragColor );",mm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,gm=`#ifdef USE_ENVMAP
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
#endif`,vm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xm=`#ifdef USE_ENVMAP
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
#endif`,_m=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ym=`#ifdef USE_ENVMAP
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
#endif`,Mm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tm=`#ifdef USE_GRADIENTMAP
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
}`,Em=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Am=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cm=`uniform bool receiveShadow;
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
#endif`,Pm=`#ifdef USE_ENVMAP
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
#endif`,Im=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Um=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Nm=`PhysicalMaterial material;
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
#endif`,Fm=`struct PhysicalMaterial {
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
}`,Om=`
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
#endif`,zm=`#if defined( RE_IndirectDiffuse )
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
#endif`,km=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Wm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ym=`#if defined( USE_POINTS_UV )
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
#endif`,$m=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Km=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qm=`#ifdef USE_MORPHTARGETS
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
#endif`,t1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,n1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,i1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,r1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,a1=`#ifdef USE_NORMALMAP
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
#endif`,o1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,l1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,c1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,h1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,u1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,d1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,f1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,p1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,m1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,g1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,v1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,x1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,y1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,M1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,S1=`float getShadowMask() {
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
}`,b1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,w1=`#ifdef USE_SKINNING
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
#endif`,T1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,E1=`#ifdef USE_SKINNING
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
#endif`,A1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,R1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,C1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,P1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,I1=`#ifdef USE_TRANSMISSION
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
#endif`,L1=`#ifdef USE_TRANSMISSION
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
#endif`,D1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,N1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,F1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const O1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,z1=`uniform sampler2D t2D;
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
}`,k1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,B1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,H1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,G1=`#include <common>
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
}`,W1=`#if DEPTH_PACKING == 3200
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
}`,X1=`#define DISTANCE
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
}`,q1=`#define DISTANCE
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
}`,Y1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z1=`uniform float scale;
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
}`,J1=`uniform vec3 diffuse;
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
}`,K1=`#include <common>
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
}`,j1=`uniform vec3 diffuse;
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
}`,Q1=`#define LAMBERT
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
}`,tg=`#define LAMBERT
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
}`,eg=`#define MATCAP
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
}`,ng=`#define MATCAP
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
}`,ig=`#define NORMAL
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
}`,sg=`#define NORMAL
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
}`,rg=`#define PHONG
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
}`,ag=`#define PHONG
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
}`,og=`#define STANDARD
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
}`,lg=`#define STANDARD
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
}`,cg=`#define TOON
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
}`,hg=`#define TOON
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
}`,ug=`uniform float size;
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
}`,dg=`uniform vec3 diffuse;
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
}`,fg=`#include <common>
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
}`,pg=`uniform vec3 color;
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
}`,mg=`uniform float rotation;
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
}`,gg=`uniform vec3 diffuse;
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
}`,re={alphahash_fragment:zp,alphahash_pars_fragment:kp,alphamap_fragment:Bp,alphamap_pars_fragment:Hp,alphatest_fragment:Vp,alphatest_pars_fragment:Gp,aomap_fragment:Wp,aomap_pars_fragment:Xp,batching_pars_vertex:qp,batching_vertex:Yp,begin_vertex:$p,beginnormal_vertex:Zp,bsdfs:Jp,iridescence_fragment:Kp,bumpmap_pars_fragment:jp,clipping_planes_fragment:Qp,clipping_planes_pars_fragment:tm,clipping_planes_pars_vertex:em,clipping_planes_vertex:nm,color_fragment:im,color_pars_fragment:sm,color_pars_vertex:rm,color_vertex:am,common:om,cube_uv_reflection_fragment:lm,defaultnormal_vertex:cm,displacementmap_pars_vertex:hm,displacementmap_vertex:um,emissivemap_fragment:dm,emissivemap_pars_fragment:fm,colorspace_fragment:pm,colorspace_pars_fragment:mm,envmap_fragment:gm,envmap_common_pars_fragment:vm,envmap_pars_fragment:xm,envmap_pars_vertex:_m,envmap_physical_pars_fragment:Pm,envmap_vertex:ym,fog_vertex:Mm,fog_pars_vertex:Sm,fog_fragment:bm,fog_pars_fragment:wm,gradientmap_pars_fragment:Tm,lightmap_pars_fragment:Em,lights_lambert_fragment:Am,lights_lambert_pars_fragment:Rm,lights_pars_begin:Cm,lights_toon_fragment:Im,lights_toon_pars_fragment:Lm,lights_phong_fragment:Dm,lights_phong_pars_fragment:Um,lights_physical_fragment:Nm,lights_physical_pars_fragment:Fm,lights_fragment_begin:Om,lights_fragment_maps:zm,lights_fragment_end:km,logdepthbuf_fragment:Bm,logdepthbuf_pars_fragment:Hm,logdepthbuf_pars_vertex:Vm,logdepthbuf_vertex:Gm,map_fragment:Wm,map_pars_fragment:Xm,map_particle_fragment:qm,map_particle_pars_fragment:Ym,metalnessmap_fragment:$m,metalnessmap_pars_fragment:Zm,morphinstance_vertex:Jm,morphcolor_vertex:Km,morphnormal_vertex:jm,morphtarget_pars_vertex:Qm,morphtarget_vertex:t1,normal_fragment_begin:e1,normal_fragment_maps:n1,normal_pars_fragment:i1,normal_pars_vertex:s1,normal_vertex:r1,normalmap_pars_fragment:a1,clearcoat_normal_fragment_begin:o1,clearcoat_normal_fragment_maps:l1,clearcoat_pars_fragment:c1,iridescence_pars_fragment:h1,opaque_fragment:u1,packing:d1,premultiplied_alpha_fragment:f1,project_vertex:p1,dithering_fragment:m1,dithering_pars_fragment:g1,roughnessmap_fragment:v1,roughnessmap_pars_fragment:x1,shadowmap_pars_fragment:_1,shadowmap_pars_vertex:y1,shadowmap_vertex:M1,shadowmask_pars_fragment:S1,skinbase_vertex:b1,skinning_pars_vertex:w1,skinning_vertex:T1,skinnormal_vertex:E1,specularmap_fragment:A1,specularmap_pars_fragment:R1,tonemapping_fragment:C1,tonemapping_pars_fragment:P1,transmission_fragment:I1,transmission_pars_fragment:L1,uv_pars_fragment:D1,uv_pars_vertex:U1,uv_vertex:N1,worldpos_vertex:F1,background_vert:O1,background_frag:z1,backgroundCube_vert:k1,backgroundCube_frag:B1,cube_vert:H1,cube_frag:V1,depth_vert:G1,depth_frag:W1,distanceRGBA_vert:X1,distanceRGBA_frag:q1,equirect_vert:Y1,equirect_frag:$1,linedashed_vert:Z1,linedashed_frag:J1,meshbasic_vert:K1,meshbasic_frag:j1,meshlambert_vert:Q1,meshlambert_frag:tg,meshmatcap_vert:eg,meshmatcap_frag:ng,meshnormal_vert:ig,meshnormal_frag:sg,meshphong_vert:rg,meshphong_frag:ag,meshphysical_vert:og,meshphysical_frag:lg,meshtoon_vert:cg,meshtoon_frag:hg,points_vert:ug,points_frag:dg,shadow_vert:fg,shadow_frag:pg,sprite_vert:mg,sprite_frag:gg},Pt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},envMapRotation:{value:new ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},Kn={basic:{uniforms:on([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:re.meshbasic_vert,fragmentShader:re.meshbasic_frag},lambert:{uniforms:on([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new $t(0)}}]),vertexShader:re.meshlambert_vert,fragmentShader:re.meshlambert_frag},phong:{uniforms:on([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:re.meshphong_vert,fragmentShader:re.meshphong_frag},standard:{uniforms:on([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag},toon:{uniforms:on([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new $t(0)}}]),vertexShader:re.meshtoon_vert,fragmentShader:re.meshtoon_frag},matcap:{uniforms:on([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:re.meshmatcap_vert,fragmentShader:re.meshmatcap_frag},points:{uniforms:on([Pt.points,Pt.fog]),vertexShader:re.points_vert,fragmentShader:re.points_frag},dashed:{uniforms:on([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:re.linedashed_vert,fragmentShader:re.linedashed_frag},depth:{uniforms:on([Pt.common,Pt.displacementmap]),vertexShader:re.depth_vert,fragmentShader:re.depth_frag},normal:{uniforms:on([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:re.meshnormal_vert,fragmentShader:re.meshnormal_frag},sprite:{uniforms:on([Pt.sprite,Pt.fog]),vertexShader:re.sprite_vert,fragmentShader:re.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:re.background_vert,fragmentShader:re.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ie}},vertexShader:re.backgroundCube_vert,fragmentShader:re.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:re.cube_vert,fragmentShader:re.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:re.equirect_vert,fragmentShader:re.equirect_frag},distanceRGBA:{uniforms:on([Pt.common,Pt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:re.distanceRGBA_vert,fragmentShader:re.distanceRGBA_frag},shadow:{uniforms:on([Pt.lights,Pt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:re.shadow_vert,fragmentShader:re.shadow_frag}};Kn.physical={uniforms:on([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag};const Ia={r:0,b:0,g:0},ji=new Fn,vg=new he;function xg(i,t,e,n,s,r,a){const o=new $t(0);let l=r===!0?0:1,c,h,d=null,m=0,u=null;function p(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const E=p(y);E===null?f(o,l):E&&E.isColor&&(f(E,1),_=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,_){const E=p(_);E&&(E.isCubeTexture||E.mapping===vo)?(h===void 0&&(h=new Yt(new $n(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:Qs(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ji.copy(_.backgroundRotation),ji.x*=-1,ji.y*=-1,ji.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(vg.makeRotationFromEuler(ji)),h.material.toneMapped=pe.getTransfer(E.colorSpace)!==ve,(d!==E||m!==E.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,d=E,m=E.version,u=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Yt(new ue(2,2),new hn({name:"BackgroundMaterial",uniforms:Qs(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:Gi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=pe.getTransfer(E.colorSpace)!==ve,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||m!==E.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,d=E,m=E.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function f(y,_){y.getRGB(Ia,Md(i)),n.buffers.color.setClear(Ia.r,Ia.g,Ia.b,_,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,_=1){o.set(y),l=_,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,f(o,l)},render:v,addToRenderList:g,dispose:x}}function _g(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=m(null);let r=s,a=!1;function o(S,R,L,I,N){let F=!1;const z=d(I,L,R);r!==z&&(r=z,c(r.object)),F=u(S,I,L,N),F&&p(S,I,L,N),N!==null&&t.update(N,i.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,_(S,R,L,I),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function d(S,R,L){const I=L.wireframe===!0;let N=n[S.id];N===void 0&&(N={},n[S.id]=N);let F=N[R.id];F===void 0&&(F={},N[R.id]=F);let z=F[I];return z===void 0&&(z=m(l()),F[I]=z),z}function m(S){const R=[],L=[],I=[];for(let N=0;N<e;N++)R[N]=0,L[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:L,attributeDivisors:I,object:S,attributes:{},index:null}}function u(S,R,L,I){const N=r.attributes,F=R.attributes;let z=0;const G=L.getAttributes();for(const H in G)if(G[H].location>=0){const tt=N[H];let nt=F[H];if(nt===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(nt=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(nt=S.instanceColor)),tt===void 0||tt.attribute!==nt||nt&&tt.data!==nt.data)return!0;z++}return r.attributesNum!==z||r.index!==I}function p(S,R,L,I){const N={},F=R.attributes;let z=0;const G=L.getAttributes();for(const H in G)if(G[H].location>=0){let tt=F[H];tt===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(tt=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(tt=S.instanceColor));const nt={};nt.attribute=tt,tt&&tt.data&&(nt.data=tt.data),N[H]=nt,z++}r.attributes=N,r.attributesNum=z,r.index=I}function v(){const S=r.newAttributes;for(let R=0,L=S.length;R<L;R++)S[R]=0}function g(S){f(S,0)}function f(S,R){const L=r.newAttributes,I=r.enabledAttributes,N=r.attributeDivisors;L[S]=1,I[S]===0&&(i.enableVertexAttribArray(S),I[S]=1),N[S]!==R&&(i.vertexAttribDivisor(S,R),N[S]=R)}function x(){const S=r.newAttributes,R=r.enabledAttributes;for(let L=0,I=R.length;L<I;L++)R[L]!==S[L]&&(i.disableVertexAttribArray(L),R[L]=0)}function y(S,R,L,I,N,F,z){z===!0?i.vertexAttribIPointer(S,R,L,N,F):i.vertexAttribPointer(S,R,L,I,N,F)}function _(S,R,L,I){v();const N=I.attributes,F=L.getAttributes(),z=R.defaultAttributeValues;for(const G in F){const H=F[G];if(H.location>=0){let Z=N[G];if(Z===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(Z=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(Z=S.instanceColor)),Z!==void 0){const tt=Z.normalized,nt=Z.itemSize,bt=t.get(Z);if(bt===void 0)continue;const Dt=bt.buffer,kt=bt.type,qt=bt.bytesPerElement,J=kt===i.INT||kt===i.UNSIGNED_INT||Z.gpuType===Dc;if(Z.isInterleavedBufferAttribute){const et=Z.data,_t=et.stride,yt=Z.offset;if(et.isInstancedInterleavedBuffer){for(let St=0;St<H.locationSize;St++)f(H.location+St,et.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let St=0;St<H.locationSize;St++)g(H.location+St);i.bindBuffer(i.ARRAY_BUFFER,Dt);for(let St=0;St<H.locationSize;St++)y(H.location+St,nt/H.locationSize,kt,tt,_t*qt,(yt+nt/H.locationSize*St)*qt,J)}else{if(Z.isInstancedBufferAttribute){for(let et=0;et<H.locationSize;et++)f(H.location+et,Z.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let et=0;et<H.locationSize;et++)g(H.location+et);i.bindBuffer(i.ARRAY_BUFFER,Dt);for(let et=0;et<H.locationSize;et++)y(H.location+et,nt/H.locationSize,kt,tt,nt*qt,nt/H.locationSize*et*qt,J)}}else if(z!==void 0){const tt=z[G];if(tt!==void 0)switch(tt.length){case 2:i.vertexAttrib2fv(H.location,tt);break;case 3:i.vertexAttrib3fv(H.location,tt);break;case 4:i.vertexAttrib4fv(H.location,tt);break;default:i.vertexAttrib1fv(H.location,tt)}}}}x()}function E(){T();for(const S in n){const R=n[S];for(const L in R){const I=R[L];for(const N in I)h(I[N].object),delete I[N];delete R[L]}delete n[S]}}function b(S){if(n[S.id]===void 0)return;const R=n[S.id];for(const L in R){const I=R[L];for(const N in I)h(I[N].object),delete I[N];delete R[L]}delete n[S.id]}function A(S){for(const R in n){const L=n[R];if(L[S.id]===void 0)continue;const I=L[S.id];for(const N in I)h(I[N].object),delete I[N];delete L[S.id]}}function T(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:M,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function yg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let u=0;for(let p=0;p<d;p++)u+=h[p];e.update(u,n,1)}function l(c,h,d,m){if(d===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<c.length;p++)a(c[p],h[p],m[p]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,m,0,d);let p=0;for(let v=0;v<d;v++)p+=h[v]*m[v];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Mg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Xn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===li&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==oi&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Wn&&!T)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,m=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=p>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:m,maxTextures:u,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:_,vertexTextures:E,maxSamples:b}}function Sg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new is,o=new ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,m){const u=d.length!==0||m||n!==0||s;return s=m,n=d.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,m){e=h(d,m,0)},this.setState=function(d,m,u){const p=d.clippingPlanes,v=d.clipIntersection,g=d.clipShadows,f=i.get(d);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{const x=r?0:n,y=x*4;let _=f.clippingState||null;l.value=_,_=h(p,m,y,u);for(let E=0;E!==y;++E)_[E]=e[E];f.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,m,u,p){const v=d!==null?d.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const f=u+v*4,x=m.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<f)&&(g=new Float32Array(f));for(let y=0,_=u;y!==v;++y,_+=4)a.copy(d[y]).applyMatrix4(x,o),a.normal.toArray(g,_),g[_+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function bg(i){let t=new WeakMap;function e(a,o){return o===Pl?a.mapping=$s:o===Il&&(a.mapping=Zs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Pl||o===Il)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new F0(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Gs=4,qh=[.125,.215,.35,.446,.526,.582],as=20,ll=new Jc,Yh=new $t;let cl=null,hl=0,ul=0,dl=!1;const ss=(1+Math.sqrt(5))/2,Bs=1/ss,$h=[new D(-ss,Bs,0),new D(ss,Bs,0),new D(-Bs,0,ss),new D(Bs,0,ss),new D(0,ss,-Bs),new D(0,ss,Bs),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],wg=new D;class mc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=wg}=r;cl=this._renderer.getRenderTarget(),hl=this._renderer.getActiveCubeFace(),ul=this._renderer.getActiveMipmapLevel(),dl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(cl,hl,ul),this._renderer.xr.enabled=dl,t.scissorTest=!1,La(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===$s||t.mapping===Zs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),cl=this._renderer.getRenderTarget(),hl=this._renderer.getActiveCubeFace(),ul=this._renderer.getActiveMipmapLevel(),dl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:li,format:Xn,colorSpace:js,depthBuffer:!1},s=Zh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Tg(r)),this._blurMaterial=Eg(r,t,e)}return s}_compileMaterial(t){const e=new Yt(this._lodPlanes[0],t);this._renderer.compile(e,ll)}_sceneToCubeUV(t,e,n,s,r){const l=new nn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,m=d.autoClear,u=d.toneMapping;d.getClearColor(Yh),d.toneMapping=Hi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));const v=new Je({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),g=new Yt(new $n,v);let f=!1;const x=t.background;x?x.isColor&&(v.color.copy(x),t.background=null,f=!0):(v.color.copy(Yh),f=!0);for(let y=0;y<6;y++){const _=y%3;_===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):_===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const E=this._cubeSize;La(s,_*E,y>2?E:0,E,E),d.setRenderTarget(s),f&&d.render(g,l),d.render(t,l)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=u,d.autoClear=m,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===$s||t.mapping===Zs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Yt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;La(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,ll)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=$h[(s-r-1)%$h.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Yt(this._lodPlanes[s],c),m=c.uniforms,u=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*as-1),v=r/p,g=isFinite(r)?1+Math.floor(h*v):as;g>as&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${as}`);const f=[];let x=0;for(let A=0;A<as;++A){const T=A/v,M=Math.exp(-T*T/2);f.push(M),A===0?x+=M:A<g&&(x+=2*M)}for(let A=0;A<f.length;A++)f[A]=f[A]/x;m.envMap.value=t.texture,m.samples.value=g,m.weights.value=f,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:y}=this;m.dTheta.value=p,m.mipInt.value=y-n;const _=this._sizeLods[s],E=3*_*(s>y-Gs?s-y+Gs:0),b=4*(this._cubeSize-_);La(e,E,b,3*_,2*_),l.setRenderTarget(e),l.render(d,ll)}}function Tg(i){const t=[],e=[],n=[];let s=i;const r=i-Gs+1+qh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Gs?l=qh[a-i+Gs-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,m=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,p=6,v=3,g=2,f=1,x=new Float32Array(v*p*u),y=new Float32Array(g*p*u),_=new Float32Array(f*p*u);for(let b=0;b<u;b++){const A=b%3*2/3-1,T=b>2?0:-1,M=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(M,v*p*b),y.set(m,g*p*b);const S=[b,b,b,b,b,b];_.set(S,f*p*b)}const E=new De;E.setAttribute("position",new Be(x,v)),E.setAttribute("uv",new Be(y,g)),E.setAttribute("faceIndex",new Be(_,f)),t.push(E),s>Gs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Zh(i,t,e){const n=new wn(i,t,e);return n.texture.mapping=vo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function La(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Eg(i,t,e){const n=new Float32Array(as),s=new D(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:as,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Kc(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Jh(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kc(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Kh(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Kc(){return`

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
	`}function Ag(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Pl||l===Il,h=l===$s||l===Zs;if(c||h){let d=t.get(o);const m=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return e===null&&(e=new mc(i)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new mc(i)),d=c?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Rg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Vr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Cg(i,t,e,n){const s={},r=new WeakMap;function a(d){const m=d.target;m.index!==null&&t.remove(m.index);for(const p in m.attributes)t.remove(m.attributes[p]);m.removeEventListener("dispose",a),delete s[m.id];const u=r.get(m);u&&(t.remove(u),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function o(d,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,e.memory.geometries++),m}function l(d){const m=d.attributes;for(const u in m)t.update(m[u],i.ARRAY_BUFFER)}function c(d){const m=[],u=d.index,p=d.attributes.position;let v=0;if(u!==null){const x=u.array;v=u.version;for(let y=0,_=x.length;y<_;y+=3){const E=x[y+0],b=x[y+1],A=x[y+2];m.push(E,b,b,A,A,E)}}else if(p!==void 0){const x=p.array;v=p.version;for(let y=0,_=x.length/3-1;y<_;y+=3){const E=y+0,b=y+1,A=y+2;m.push(E,b,b,A,A,E)}}else return;const g=new(gd(m)?yd:_d)(m,1);g.version=v;const f=r.get(d);f&&t.remove(f),r.set(d,g)}function h(d){const m=r.get(d);if(m){const u=d.index;u!==null&&m.version<u.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Pg(i,t,e){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function l(m,u){i.drawElements(n,u,r,m*a),e.update(u,n,1)}function c(m,u,p){p!==0&&(i.drawElementsInstanced(n,u,r,m*a,p),e.update(u,n,p))}function h(m,u,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,m,0,p);let g=0;for(let f=0;f<p;f++)g+=u[f];e.update(g,n,1)}function d(m,u,p,v){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<m.length;f++)c(m[f]/a,u[f],v[f]);else{g.multiDrawElementsInstancedWEBGL(n,u,0,r,m,0,v,0,p);let f=0;for(let x=0;x<p;x++)f+=u[x]*v[x];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Ig(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Lg(i,t,e){const n=new WeakMap,s=new Me;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let m=n.get(o);if(m===void 0||m.count!==d){let M=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",M)};m!==void 0&&m.texture.dispose();const u=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let y=0;u===!0&&(y=1),p===!0&&(y=2),v===!0&&(y=3);let _=o.attributes.position.count*y,E=1;_>t.maxTextureSize&&(E=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*E*4*d),A=new vd(b,_,E,d);A.type=Wn,A.needsUpdate=!0;const T=y*4;for(let S=0;S<d;S++){const R=g[S],L=f[S],I=x[S],N=_*E*4*S;for(let F=0;F<R.count;F++){const z=F*T;u===!0&&(s.fromBufferAttribute(R,F),b[N+z+0]=s.x,b[N+z+1]=s.y,b[N+z+2]=s.z,b[N+z+3]=0),p===!0&&(s.fromBufferAttribute(L,F),b[N+z+4]=s.x,b[N+z+5]=s.y,b[N+z+6]=s.z,b[N+z+7]=0),v===!0&&(s.fromBufferAttribute(I,F),b[N+z+8]=s.x,b[N+z+9]=s.y,b[N+z+10]=s.z,b[N+z+11]=I.itemSize===4?s.w:1)}}m={count:d,texture:A,size:new dt(_,E)},n.set(o,m),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let u=0;for(let v=0;v<c.length;v++)u+=c[v];const p=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:r}}function Dg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const m=l.skeleton;s.get(m)!==c&&(m.update(),s.set(m,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const Bd=new Ke,jh=new Xc(1,1),Hd=new vd,Vd=new y0,Gd=new bd,Qh=[],tu=[],eu=new Float32Array(16),nu=new Float32Array(9),iu=new Float32Array(4);function rr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Qh[s];if(r===void 0&&(r=new Float32Array(s),Qh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function wo(i,t){let e=tu[t];e===void 0&&(e=new Int32Array(t),tu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ug(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function Fg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function Og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function zg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;iu.set(n),i.uniformMatrix2fv(this.addr,!1,iu),Ve(e,n)}}function kg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;nu.set(n),i.uniformMatrix3fv(this.addr,!1,nu),Ve(e,n)}}function Bg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;eu.set(n),i.uniformMatrix4fv(this.addr,!1,eu),Ve(e,n)}}function Hg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function Wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function Xg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function Yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function $g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function Zg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(jh.compareFunction=md,r=jh):r=Bd,e.setTexture2D(t||r,s)}function Jg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Vd,s)}function Kg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Gd,s)}function jg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Hd,s)}function Qg(i){switch(i){case 5126:return Ug;case 35664:return Ng;case 35665:return Fg;case 35666:return Og;case 35674:return zg;case 35675:return kg;case 35676:return Bg;case 5124:case 35670:return Hg;case 35667:case 35671:return Vg;case 35668:case 35672:return Gg;case 35669:case 35673:return Wg;case 5125:return Xg;case 36294:return qg;case 36295:return Yg;case 36296:return $g;case 35678:case 36198:case 36298:case 36306:case 35682:return Zg;case 35679:case 36299:case 36307:return Jg;case 35680:case 36300:case 36308:case 36293:return Kg;case 36289:case 36303:case 36311:case 36292:return jg}}function tv(i,t){i.uniform1fv(this.addr,t)}function ev(i,t){const e=rr(t,this.size,2);i.uniform2fv(this.addr,e)}function nv(i,t){const e=rr(t,this.size,3);i.uniform3fv(this.addr,e)}function iv(i,t){const e=rr(t,this.size,4);i.uniform4fv(this.addr,e)}function sv(i,t){const e=rr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function rv(i,t){const e=rr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function av(i,t){const e=rr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function ov(i,t){i.uniform1iv(this.addr,t)}function lv(i,t){i.uniform2iv(this.addr,t)}function cv(i,t){i.uniform3iv(this.addr,t)}function hv(i,t){i.uniform4iv(this.addr,t)}function uv(i,t){i.uniform1uiv(this.addr,t)}function dv(i,t){i.uniform2uiv(this.addr,t)}function fv(i,t){i.uniform3uiv(this.addr,t)}function pv(i,t){i.uniform4uiv(this.addr,t)}function mv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Bd,r[a])}function gv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Vd,r[a])}function vv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Gd,r[a])}function xv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Hd,r[a])}function _v(i){switch(i){case 5126:return tv;case 35664:return ev;case 35665:return nv;case 35666:return iv;case 35674:return sv;case 35675:return rv;case 35676:return av;case 5124:case 35670:return ov;case 35667:case 35671:return lv;case 35668:case 35672:return cv;case 35669:case 35673:return hv;case 5125:return uv;case 36294:return dv;case 36295:return fv;case 36296:return pv;case 35678:case 36198:case 36298:case 36306:case 35682:return mv;case 35679:case 36299:case 36307:return gv;case 35680:case 36300:case 36308:case 36293:return vv;case 36289:case 36303:case 36311:case 36292:return xv}}class yv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Qg(e.type)}}class Mv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=_v(e.type)}}class Sv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const fl=/(\w+)(\])?(\[|\.)?/g;function su(i,t){i.seq.push(t),i.map[t.id]=t}function bv(i,t,e){const n=i.name,s=n.length;for(fl.lastIndex=0;;){const r=fl.exec(n),a=fl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){su(e,c===void 0?new yv(o,i,t):new Mv(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new Sv(o),su(e,d)),e=d}}}class Ja{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);bv(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function ru(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const wv=37297;let Tv=0;function Ev(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const au=new ie;function Av(i){pe._getMatrix(au,pe.workingColorSpace,i);const t=`mat3( ${au.elements.map(e=>e.toFixed(4))} )`;switch(pe.getTransfer(i)){case to:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ou(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Ev(i.getShaderSource(t),o)}else return r}function Rv(i,t){const e=Av(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Cv(i,t){let e;switch(t){case ed:e="Linear";break;case nd:e="Reinhard";break;case id:e="Cineon";break;case Lc:e="ACESFilmic";break;case rd:e="AgX";break;case ad:e="Neutral";break;case sd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Da=new D;function Pv(){pe.getLuminanceCoefficients(Da);const i=Da.x.toFixed(4),t=Da.y.toFixed(4),e=Da.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Iv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Tr).join(`
`)}function Lv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Dv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Tr(i){return i!==""}function lu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function cu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Uv=/^[ \t]*#include +<([\w\d./]+)>/gm;function gc(i){return i.replace(Uv,Fv)}const Nv=new Map;function Fv(i,t){let e=re[t];if(e===void 0){const n=Nv.get(t);if(n!==void 0)e=re[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return gc(e)}const Ov=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hu(i){return i.replace(Ov,zv)}function zv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function uu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function kv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ju?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ku?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bi&&(t="SHADOWMAP_TYPE_VSM"),t}function Bv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case $s:case Zs:t="ENVMAP_TYPE_CUBE";break;case vo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Hv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Zs:t="ENVMAP_MODE_REFRACTION";break}return t}function Vv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ic:t="ENVMAP_BLENDING_MULTIPLY";break;case zf:t="ENVMAP_BLENDING_MIX";break;case kf:t="ENVMAP_BLENDING_ADD";break}return t}function Gv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Wv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=kv(e),c=Bv(e),h=Hv(e),d=Vv(e),m=Gv(e),u=Iv(e),p=Lv(r),v=s.createProgram();let g,f,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Tr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Tr).join(`
`),f.length>0&&(f+=`
`)):(g=[uu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Tr).join(`
`),f=[uu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hi?"#define TONE_MAPPING":"",e.toneMapping!==Hi?re.tonemapping_pars_fragment:"",e.toneMapping!==Hi?Cv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",re.colorspace_pars_fragment,Rv("linearToOutputTexel",e.outputColorSpace),Pv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Tr).join(`
`)),a=gc(a),a=lu(a,e),a=cu(a,e),o=gc(o),o=lu(o,e),o=cu(o,e),a=hu(a),o=hu(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",e.glslVersion===lh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===lh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=x+g+a,_=x+f+o,E=ru(s,s.VERTEX_SHADER,y),b=ru(s,s.FRAGMENT_SHADER,_);s.attachShader(v,E),s.attachShader(v,b),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(R){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(v)||"",I=s.getShaderInfoLog(E)||"",N=s.getShaderInfoLog(b)||"",F=L.trim(),z=I.trim(),G=N.trim();let H=!0,Z=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,E,b);else{const tt=ou(s,E,"vertex"),nt=ou(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+tt+`
`+nt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(z===""||G==="")&&(Z=!1);Z&&(R.diagnostics={runnable:H,programLog:F,vertexShader:{log:z,prefix:g},fragmentShader:{log:G,prefix:f}})}s.deleteShader(E),s.deleteShader(b),T=new Ja(s,v),M=Dv(s,v)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(v,wv)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Tv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=b,this}let Xv=0;class qv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Yv(t),e.set(t,n)),n}}class Yv{constructor(t){this.id=Xv++,this.code=t,this.usedTimes=0}}function $v(i,t,e,n,s,r,a){const o=new Vc,l=new qv,c=new Set,h=[],d=s.logarithmicDepthBuffer,m=s.vertexTextures;let u=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,S,R,L,I){const N=L.fog,F=I.geometry,z=M.isMeshStandardMaterial?L.environment:null,G=(M.isMeshStandardMaterial?e:t).get(M.envMap||z),H=G&&G.mapping===vo?G.image.height:null,Z=p[M.type];M.precision!==null&&(u=s.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const tt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,nt=tt!==void 0?tt.length:0;let bt=0;F.morphAttributes.position!==void 0&&(bt=1),F.morphAttributes.normal!==void 0&&(bt=2),F.morphAttributes.color!==void 0&&(bt=3);let Dt,kt,qt,J;if(Z){const de=Kn[Z];Dt=de.vertexShader,kt=de.fragmentShader}else Dt=M.vertexShader,kt=M.fragmentShader,l.update(M),qt=l.getVertexShaderID(M),J=l.getFragmentShaderID(M);const et=i.getRenderTarget(),_t=i.state.buffers.depth.getReversed(),yt=I.isInstancedMesh===!0,St=I.isBatchedMesh===!0,Wt=!!M.map,Kt=!!M.matcap,O=!!G,ot=!!M.aoMap,st=!!M.lightMap,it=!!M.bumpMap,q=!!M.normalMap,ht=!!M.displacementMap,lt=!!M.emissiveMap,gt=!!M.metalnessMap,Vt=!!M.roughnessMap,Gt=M.anisotropy>0,P=M.clearcoat>0,w=M.dispersion>0,V=M.iridescence>0,Y=M.sheen>0,rt=M.transmission>0,$=Gt&&!!M.anisotropyMap,Rt=P&&!!M.clearcoatMap,ft=P&&!!M.clearcoatNormalMap,Nt=P&&!!M.clearcoatRoughnessMap,Bt=V&&!!M.iridescenceMap,xt=V&&!!M.iridescenceThicknessMap,Ct=Y&&!!M.sheenColorMap,wt=Y&&!!M.sheenRoughnessMap,Tt=!!M.specularMap,pt=!!M.specularColorMap,Ot=!!M.specularIntensityMap,k=rt&&!!M.transmissionMap,ct=rt&&!!M.thicknessMap,mt=!!M.gradientMap,Et=!!M.alphaMap,vt=M.alphaTest>0,at=!!M.alphaHash,zt=!!M.extensions;let te=Hi;M.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(te=i.toneMapping);const ge={shaderID:Z,shaderType:M.type,shaderName:M.name,vertexShader:Dt,fragmentShader:kt,defines:M.defines,customVertexShaderID:qt,customFragmentShaderID:J,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:St,batchingColor:St&&I._colorsTexture!==null,instancing:yt,instancingColor:yt&&I.instanceColor!==null,instancingMorph:yt&&I.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:js,alphaToCoverage:!!M.alphaToCoverage,map:Wt,matcap:Kt,envMap:O,envMapMode:O&&G.mapping,envMapCubeUVHeight:H,aoMap:ot,lightMap:st,bumpMap:it,normalMap:q,displacementMap:m&&ht,emissiveMap:lt,normalMapObjectSpace:q&&M.normalMapType===Gf,normalMapTangentSpace:q&&M.normalMapType===_o,metalnessMap:gt,roughnessMap:Vt,anisotropy:Gt,anisotropyMap:$,clearcoat:P,clearcoatMap:Rt,clearcoatNormalMap:ft,clearcoatRoughnessMap:Nt,dispersion:w,iridescence:V,iridescenceMap:Bt,iridescenceThicknessMap:xt,sheen:Y,sheenColorMap:Ct,sheenRoughnessMap:wt,specularMap:Tt,specularColorMap:pt,specularIntensityMap:Ot,transmission:rt,transmissionMap:k,thicknessMap:ct,gradientMap:mt,opaque:M.transparent===!1&&M.blending===Ws&&M.alphaToCoverage===!1,alphaMap:Et,alphaTest:vt,alphaHash:at,combine:M.combine,mapUv:Wt&&v(M.map.channel),aoMapUv:ot&&v(M.aoMap.channel),lightMapUv:st&&v(M.lightMap.channel),bumpMapUv:it&&v(M.bumpMap.channel),normalMapUv:q&&v(M.normalMap.channel),displacementMapUv:ht&&v(M.displacementMap.channel),emissiveMapUv:lt&&v(M.emissiveMap.channel),metalnessMapUv:gt&&v(M.metalnessMap.channel),roughnessMapUv:Vt&&v(M.roughnessMap.channel),anisotropyMapUv:$&&v(M.anisotropyMap.channel),clearcoatMapUv:Rt&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:ft&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Nt&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:xt&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:wt&&v(M.sheenRoughnessMap.channel),specularMapUv:Tt&&v(M.specularMap.channel),specularColorMapUv:pt&&v(M.specularColorMap.channel),specularIntensityMapUv:Ot&&v(M.specularIntensityMap.channel),transmissionMapUv:k&&v(M.transmissionMap.channel),thicknessMapUv:ct&&v(M.thicknessMap.channel),alphaMapUv:Et&&v(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(q||Gt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!F.attributes.uv&&(Wt||Et),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:_t,skinning:I.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:bt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,decodeVideoTexture:Wt&&M.map.isVideoTexture===!0&&pe.getTransfer(M.map.colorSpace)===ve,decodeVideoTextureEmissive:lt&&M.emissiveMap.isVideoTexture===!0&&pe.getTransfer(M.emissiveMap.colorSpace)===ve,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===ze,flipSided:M.side===sn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:zt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&M.extensions.multiDraw===!0||St)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ge.vertexUv1s=c.has(1),ge.vertexUv2s=c.has(2),ge.vertexUv3s=c.has(3),c.clear(),ge}function f(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const R in M.defines)S.push(R),S.push(M.defines[R]);return M.isRawShaderMaterial===!1&&(x(S,M),y(S,M),S.push(i.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function x(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function y(M,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),M.push(o.mask)}function _(M){const S=p[M.type];let R;if(S){const L=Kn[S];R=hs.clone(L.uniforms)}else R=M.uniforms;return R}function E(M,S){let R;for(let L=0,I=h.length;L<I;L++){const N=h[L];if(N.cacheKey===S){R=N,++R.usedTimes;break}}return R===void 0&&(R=new Wv(i,S,M,r),h.push(R)),R}function b(M){if(--M.usedTimes===0){const S=h.indexOf(M);h[S]=h[h.length-1],h.pop(),M.destroy()}}function A(M){l.remove(M)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:_,acquireProgram:E,releaseProgram:b,releaseShaderCache:A,programs:h,dispose:T}}function Zv(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Jv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function du(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function fu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(d,m,u,p,v,g){let f=i[t];return f===void 0?(f={id:d.id,object:d,geometry:m,material:u,groupOrder:p,renderOrder:d.renderOrder,z:v,group:g},i[t]=f):(f.id=d.id,f.object=d,f.geometry=m,f.material=u,f.groupOrder=p,f.renderOrder=d.renderOrder,f.z=v,f.group=g),t++,f}function o(d,m,u,p,v,g){const f=a(d,m,u,p,v,g);u.transmission>0?n.push(f):u.transparent===!0?s.push(f):e.push(f)}function l(d,m,u,p,v,g){const f=a(d,m,u,p,v,g);u.transmission>0?n.unshift(f):u.transparent===!0?s.unshift(f):e.unshift(f)}function c(d,m){e.length>1&&e.sort(d||Jv),n.length>1&&n.sort(m||du),s.length>1&&s.sort(m||du)}function h(){for(let d=t,m=i.length;d<m;d++){const u=i[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Kv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new fu,i.set(n,[a])):s>=r.length?(a=new fu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function jv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new $t};break;case"SpotLight":e={position:new D,direction:new D,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function Qv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let tx=0;function ex(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function nx(i){const t=new jv,e=Qv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new he,a=new he;function o(c){let h=0,d=0,m=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let u=0,p=0,v=0,g=0,f=0,x=0,y=0,_=0,E=0,b=0,A=0;c.sort(ex);for(let M=0,S=c.length;M<S;M++){const R=c[M],L=R.color,I=R.intensity,N=R.distance,F=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=L.r*I,d+=L.g*I,m+=L.b*I;else if(R.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(R.sh.coefficients[z],I);A++}else if(R.isDirectionalLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const G=R.shadow,H=e.get(R);H.shadowIntensity=G.intensity,H.shadowBias=G.bias,H.shadowNormalBias=G.normalBias,H.shadowRadius=G.radius,H.shadowMapSize=G.mapSize,n.directionalShadow[u]=H,n.directionalShadowMap[u]=F,n.directionalShadowMatrix[u]=R.shadow.matrix,x++}n.directional[u]=z,u++}else if(R.isSpotLight){const z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(L).multiplyScalar(I),z.distance=N,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,n.spot[v]=z;const G=R.shadow;if(R.map&&(n.spotLightMap[E]=R.map,E++,G.updateMatrices(R),R.castShadow&&b++),n.spotLightMatrix[v]=G.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=G.intensity,H.shadowBias=G.bias,H.shadowNormalBias=G.normalBias,H.shadowRadius=G.radius,H.shadowMapSize=G.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=F,_++}v++}else if(R.isRectAreaLight){const z=t.get(R);z.color.copy(L).multiplyScalar(I),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=z,g++}else if(R.isPointLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const G=R.shadow,H=e.get(R);H.shadowIntensity=G.intensity,H.shadowBias=G.bias,H.shadowNormalBias=G.normalBias,H.shadowRadius=G.radius,H.shadowMapSize=G.mapSize,H.shadowCameraNear=G.camera.near,H.shadowCameraFar=G.camera.far,n.pointShadow[p]=H,n.pointShadowMap[p]=F,n.pointShadowMatrix[p]=R.shadow.matrix,y++}n.point[p]=z,p++}else if(R.isHemisphereLight){const z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(I),z.groundColor.copy(R.groundColor).multiplyScalar(I),n.hemi[f]=z,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Pt.LTC_FLOAT_1,n.rectAreaLTC2=Pt.LTC_FLOAT_2):(n.rectAreaLTC1=Pt.LTC_HALF_1,n.rectAreaLTC2=Pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=m;const T=n.hash;(T.directionalLength!==u||T.pointLength!==p||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==f||T.numDirectionalShadows!==x||T.numPointShadows!==y||T.numSpotShadows!==_||T.numSpotMaps!==E||T.numLightProbes!==A)&&(n.directional.length=u,n.spot.length=v,n.rectArea.length=g,n.point.length=p,n.hemi.length=f,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=_+E-b,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=A,T.directionalLength=u,T.pointLength=p,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=f,T.numDirectionalShadows=x,T.numPointShadows=y,T.numSpotShadows=_,T.numSpotMaps=E,T.numLightProbes=A,n.version=tx++)}function l(c,h){let d=0,m=0,u=0,p=0,v=0;const g=h.matrixWorldInverse;for(let f=0,x=c.length;f<x;f++){const y=c[f];if(y.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),d++}else if(y.isSpotLight){const _=n.spot[u];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(y.isRectAreaLight){const _=n.rectArea[p];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),p++}else if(y.isPointLight){const _=n.point[m];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),m++}else if(y.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:n}}function pu(i){const t=new nx(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function ix(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new pu(i),t.set(s,[o])):r>=a.length?(o=new pu(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const sx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rx=`uniform sampler2D shadow_pass;
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
}`;function ax(i,t,e){let n=new Wc;const s=new dt,r=new dt,a=new Me,o=new Ep({depthPacking:Vf}),l=new Ap,c={},h=e.maxTextureSize,d={[Gi]:sn,[sn]:Gi,[ze]:ze},m=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:sx,fragmentShader:rx}),u=m.clone();u.defines.HORIZONTAL_PASS=1;const p=new De;p.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Yt(p,m),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ju;let f=this.type;this.render=function(b,A,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const M=i.getRenderTarget(),S=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),L=i.state;L.setBlending(ln),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const I=f!==bi&&this.type===bi,N=f===bi&&this.type!==bi;for(let F=0,z=b.length;F<z;F++){const G=b[F],H=G.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Z=H.getFrameExtents();if(s.multiply(Z),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Z.x),s.x=r.x*Z.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Z.y),s.y=r.y*Z.y,H.mapSize.y=r.y)),H.map===null||I===!0||N===!0){const nt=this.type!==bi?{minFilter:un,magFilter:un}:{};H.map!==null&&H.map.dispose(),H.map=new wn(s.x,s.y,nt),H.map.texture.name=G.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const tt=H.getViewportCount();for(let nt=0;nt<tt;nt++){const bt=H.getViewport(nt);a.set(r.x*bt.x,r.y*bt.y,r.x*bt.z,r.y*bt.w),L.viewport(a),H.updateMatrices(G,nt),n=H.getFrustum(),_(A,T,H.camera,G,this.type)}H.isPointLightShadow!==!0&&this.type===bi&&x(H,T),H.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(M,S,R)};function x(b,A){const T=t.update(v);m.defines.VSM_SAMPLES!==b.blurSamples&&(m.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,m.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new wn(s.x,s.y)),m.uniforms.shadow_pass.value=b.map.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(A,null,T,m,v,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(A,null,T,u,v,null)}function y(b,A,T,M){let S=null;const R=T.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)S=R;else if(S=T.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const L=S.uuid,I=A.uuid;let N=c[L];N===void 0&&(N={},c[L]=N);let F=N[I];F===void 0&&(F=S.clone(),N[I]=F,A.addEventListener("dispose",E)),S=F}if(S.visible=A.visible,S.wireframe=A.wireframe,M===bi?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:d[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,T.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const L=i.properties.get(S);L.light=T}return S}function _(b,A,T,M,S){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===bi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,b.matrixWorld);const I=t.update(b),N=b.material;if(Array.isArray(N)){const F=I.groups;for(let z=0,G=F.length;z<G;z++){const H=F[z],Z=N[H.materialIndex];if(Z&&Z.visible){const tt=y(b,Z,M,S);b.onBeforeShadow(i,b,A,T,I,tt,H),i.renderBufferDirect(T,null,I,tt,b,H),b.onAfterShadow(i,b,A,T,I,tt,H)}}}else if(N.visible){const F=y(b,N,M,S);b.onBeforeShadow(i,b,A,T,I,F,null),i.renderBufferDirect(T,null,I,F,b,null),b.onAfterShadow(i,b,A,T,I,F,null)}}const L=b.children;for(let I=0,N=L.length;I<N;I++)_(L[I],A,T,M,S)}function E(b){b.target.removeEventListener("dispose",E);for(const T in c){const M=c[T],S=b.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const ox={[bl]:wl,[Tl]:Rl,[El]:Cl,[Ys]:Al,[wl]:bl,[Rl]:Tl,[Cl]:El,[Al]:Ys};function lx(i,t){function e(){let k=!1;const ct=new Me;let mt=null;const Et=new Me(0,0,0,0);return{setMask:function(vt){mt!==vt&&!k&&(i.colorMask(vt,vt,vt,vt),mt=vt)},setLocked:function(vt){k=vt},setClear:function(vt,at,zt,te,ge){ge===!0&&(vt*=te,at*=te,zt*=te),ct.set(vt,at,zt,te),Et.equals(ct)===!1&&(i.clearColor(vt,at,zt,te),Et.copy(ct))},reset:function(){k=!1,mt=null,Et.set(-1,0,0,0)}}}function n(){let k=!1,ct=!1,mt=null,Et=null,vt=null;return{setReversed:function(at){if(ct!==at){const zt=t.get("EXT_clip_control");at?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),ct=at;const te=vt;vt=null,this.setClear(te)}},getReversed:function(){return ct},setTest:function(at){at?et(i.DEPTH_TEST):_t(i.DEPTH_TEST)},setMask:function(at){mt!==at&&!k&&(i.depthMask(at),mt=at)},setFunc:function(at){if(ct&&(at=ox[at]),Et!==at){switch(at){case bl:i.depthFunc(i.NEVER);break;case wl:i.depthFunc(i.ALWAYS);break;case Tl:i.depthFunc(i.LESS);break;case Ys:i.depthFunc(i.LEQUAL);break;case El:i.depthFunc(i.EQUAL);break;case Al:i.depthFunc(i.GEQUAL);break;case Rl:i.depthFunc(i.GREATER);break;case Cl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Et=at}},setLocked:function(at){k=at},setClear:function(at){vt!==at&&(ct&&(at=1-at),i.clearDepth(at),vt=at)},reset:function(){k=!1,mt=null,Et=null,vt=null,ct=!1}}}function s(){let k=!1,ct=null,mt=null,Et=null,vt=null,at=null,zt=null,te=null,ge=null;return{setTest:function(de){k||(de?et(i.STENCIL_TEST):_t(i.STENCIL_TEST))},setMask:function(de){ct!==de&&!k&&(i.stencilMask(de),ct=de)},setFunc:function(de,fn,gn){(mt!==de||Et!==fn||vt!==gn)&&(i.stencilFunc(de,fn,gn),mt=de,Et=fn,vt=gn)},setOp:function(de,fn,gn){(at!==de||zt!==fn||te!==gn)&&(i.stencilOp(de,fn,gn),at=de,zt=fn,te=gn)},setLocked:function(de){k=de},setClear:function(de){ge!==de&&(i.clearStencil(de),ge=de)},reset:function(){k=!1,ct=null,mt=null,Et=null,vt=null,at=null,zt=null,te=null,ge=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},m=new WeakMap,u=[],p=null,v=!1,g=null,f=null,x=null,y=null,_=null,E=null,b=null,A=new $t(0,0,0),T=0,M=!1,S=null,R=null,L=null,I=null,N=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,G=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(H)[1]),z=G>=1):H.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),z=G>=2);let Z=null,tt={};const nt=i.getParameter(i.SCISSOR_BOX),bt=i.getParameter(i.VIEWPORT),Dt=new Me().fromArray(nt),kt=new Me().fromArray(bt);function qt(k,ct,mt,Et){const vt=new Uint8Array(4),at=i.createTexture();i.bindTexture(k,at),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<mt;zt++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,Et,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(ct+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return at}const J={};J[i.TEXTURE_2D]=qt(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=qt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=qt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=qt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(Ys),it(!1),q(sh),et(i.CULL_FACE),ot(ln);function et(k){h[k]!==!0&&(i.enable(k),h[k]=!0)}function _t(k){h[k]!==!1&&(i.disable(k),h[k]=!1)}function yt(k,ct){return d[k]!==ct?(i.bindFramebuffer(k,ct),d[k]=ct,k===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ct),k===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function St(k,ct){let mt=u,Et=!1;if(k){mt=m.get(ct),mt===void 0&&(mt=[],m.set(ct,mt));const vt=k.textures;if(mt.length!==vt.length||mt[0]!==i.COLOR_ATTACHMENT0){for(let at=0,zt=vt.length;at<zt;at++)mt[at]=i.COLOR_ATTACHMENT0+at;mt.length=vt.length,Et=!0}}else mt[0]!==i.BACK&&(mt[0]=i.BACK,Et=!0);Et&&i.drawBuffers(mt)}function Wt(k){return p!==k?(i.useProgram(k),p=k,!0):!1}const Kt={[Ai]:i.FUNC_ADD,[wf]:i.FUNC_SUBTRACT,[Tf]:i.FUNC_REVERSE_SUBTRACT};Kt[Ef]=i.MIN,Kt[Af]=i.MAX;const O={[yl]:i.ZERO,[Rf]:i.ONE,[Cf]:i.SRC_COLOR,[Ml]:i.SRC_ALPHA,[Df]:i.SRC_ALPHA_SATURATE,[td]:i.DST_COLOR,[Qu]:i.DST_ALPHA,[Pf]:i.ONE_MINUS_SRC_COLOR,[Sl]:i.ONE_MINUS_SRC_ALPHA,[Lf]:i.ONE_MINUS_DST_COLOR,[If]:i.ONE_MINUS_DST_ALPHA,[Uf]:i.CONSTANT_COLOR,[Nf]:i.ONE_MINUS_CONSTANT_COLOR,[Ff]:i.CONSTANT_ALPHA,[Of]:i.ONE_MINUS_CONSTANT_ALPHA};function ot(k,ct,mt,Et,vt,at,zt,te,ge,de){if(k===ln){v===!0&&(_t(i.BLEND),v=!1);return}if(v===!1&&(et(i.BLEND),v=!0),k!==ju){if(k!==g||de!==M){if((f!==Ai||_!==Ai)&&(i.blendEquation(i.FUNC_ADD),f=Ai,_=Ai),de)switch(k){case Ws:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Or:i.blendFunc(i.ONE,i.ONE);break;case rh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ah:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Ws:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Or:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case rh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ah:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}x=null,y=null,E=null,b=null,A.set(0,0,0),T=0,g=k,M=de}return}vt=vt||ct,at=at||mt,zt=zt||Et,(ct!==f||vt!==_)&&(i.blendEquationSeparate(Kt[ct],Kt[vt]),f=ct,_=vt),(mt!==x||Et!==y||at!==E||zt!==b)&&(i.blendFuncSeparate(O[mt],O[Et],O[at],O[zt]),x=mt,y=Et,E=at,b=zt),(te.equals(A)===!1||ge!==T)&&(i.blendColor(te.r,te.g,te.b,ge),A.copy(te),T=ge),g=k,M=!1}function st(k,ct){k.side===ze?_t(i.CULL_FACE):et(i.CULL_FACE);let mt=k.side===sn;ct&&(mt=!mt),it(mt),k.blending===Ws&&k.transparent===!1?ot(ln):ot(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const Et=k.stencilWrite;o.setTest(Et),Et&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),lt(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):_t(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(k){S!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),S=k)}function q(k){k!==Sf?(et(i.CULL_FACE),k!==R&&(k===sh?i.cullFace(i.BACK):k===bf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_t(i.CULL_FACE),R=k}function ht(k){k!==L&&(z&&i.lineWidth(k),L=k)}function lt(k,ct,mt){k?(et(i.POLYGON_OFFSET_FILL),(I!==ct||N!==mt)&&(i.polygonOffset(ct,mt),I=ct,N=mt)):_t(i.POLYGON_OFFSET_FILL)}function gt(k){k?et(i.SCISSOR_TEST):_t(i.SCISSOR_TEST)}function Vt(k){k===void 0&&(k=i.TEXTURE0+F-1),Z!==k&&(i.activeTexture(k),Z=k)}function Gt(k,ct,mt){mt===void 0&&(Z===null?mt=i.TEXTURE0+F-1:mt=Z);let Et=tt[mt];Et===void 0&&(Et={type:void 0,texture:void 0},tt[mt]=Et),(Et.type!==k||Et.texture!==ct)&&(Z!==mt&&(i.activeTexture(mt),Z=mt),i.bindTexture(k,ct||J[k]),Et.type=k,Et.texture=ct)}function P(){const k=tt[Z];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function w(){try{i.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Y(){try{i.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function rt(){try{i.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Rt(){try{i.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ft(){try{i.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Nt(){try{i.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Bt(){try{i.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function xt(){try{i.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ct(k){Dt.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),Dt.copy(k))}function wt(k){kt.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),kt.copy(k))}function Tt(k,ct){let mt=c.get(ct);mt===void 0&&(mt=new WeakMap,c.set(ct,mt));let Et=mt.get(k);Et===void 0&&(Et=i.getUniformBlockIndex(ct,k.name),mt.set(k,Et))}function pt(k,ct){const Et=c.get(ct).get(k);l.get(ct)!==Et&&(i.uniformBlockBinding(ct,Et,k.__bindingPointIndex),l.set(ct,Et))}function Ot(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Z=null,tt={},d={},m=new WeakMap,u=[],p=null,v=!1,g=null,f=null,x=null,y=null,_=null,E=null,b=null,A=new $t(0,0,0),T=0,M=!1,S=null,R=null,L=null,I=null,N=null,Dt.set(0,0,i.canvas.width,i.canvas.height),kt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:_t,bindFramebuffer:yt,drawBuffers:St,useProgram:Wt,setBlending:ot,setMaterial:st,setFlipSided:it,setCullFace:q,setLineWidth:ht,setPolygonOffset:lt,setScissorTest:gt,activeTexture:Vt,bindTexture:Gt,unbindTexture:P,compressedTexImage2D:w,compressedTexImage3D:V,texImage2D:Bt,texImage3D:xt,updateUBOMapping:Tt,uniformBlockBinding:pt,texStorage2D:ft,texStorage3D:Nt,texSubImage2D:Y,texSubImage3D:rt,compressedTexSubImage2D:$,compressedTexSubImage3D:Rt,scissor:Ct,viewport:wt,reset:Ot}}function cx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new dt,h=new WeakMap;let d;const m=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(P,w){return u?new OffscreenCanvas(P,w):Hr("canvas")}function v(P,w,V){let Y=1;const rt=Gt(P);if((rt.width>V||rt.height>V)&&(Y=V/Math.max(rt.width,rt.height)),Y<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const $=Math.floor(Y*rt.width),Rt=Math.floor(Y*rt.height);d===void 0&&(d=p($,Rt));const ft=w?p($,Rt):d;return ft.width=$,ft.height=Rt,ft.getContext("2d").drawImage(P,0,0,$,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+rt.width+"x"+rt.height+") to ("+$+"x"+Rt+")."),ft}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+rt.width+"x"+rt.height+")."),P;return P}function g(P){return P.generateMipmaps}function f(P){i.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(P,w,V,Y,rt=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let $=w;if(w===i.RED&&(V===i.FLOAT&&($=i.R32F),V===i.HALF_FLOAT&&($=i.R16F),V===i.UNSIGNED_BYTE&&($=i.R8)),w===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.R8UI),V===i.UNSIGNED_SHORT&&($=i.R16UI),V===i.UNSIGNED_INT&&($=i.R32UI),V===i.BYTE&&($=i.R8I),V===i.SHORT&&($=i.R16I),V===i.INT&&($=i.R32I)),w===i.RG&&(V===i.FLOAT&&($=i.RG32F),V===i.HALF_FLOAT&&($=i.RG16F),V===i.UNSIGNED_BYTE&&($=i.RG8)),w===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RG8UI),V===i.UNSIGNED_SHORT&&($=i.RG16UI),V===i.UNSIGNED_INT&&($=i.RG32UI),V===i.BYTE&&($=i.RG8I),V===i.SHORT&&($=i.RG16I),V===i.INT&&($=i.RG32I)),w===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RGB8UI),V===i.UNSIGNED_SHORT&&($=i.RGB16UI),V===i.UNSIGNED_INT&&($=i.RGB32UI),V===i.BYTE&&($=i.RGB8I),V===i.SHORT&&($=i.RGB16I),V===i.INT&&($=i.RGB32I)),w===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RGBA8UI),V===i.UNSIGNED_SHORT&&($=i.RGBA16UI),V===i.UNSIGNED_INT&&($=i.RGBA32UI),V===i.BYTE&&($=i.RGBA8I),V===i.SHORT&&($=i.RGBA16I),V===i.INT&&($=i.RGBA32I)),w===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),w===i.RGBA){const Rt=rt?to:pe.getTransfer(Y);V===i.FLOAT&&($=i.RGBA32F),V===i.HALF_FLOAT&&($=i.RGBA16F),V===i.UNSIGNED_BYTE&&($=Rt===ve?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function _(P,w){let V;return P?w===null||w===ds||w===Js?V=i.DEPTH24_STENCIL8:w===Wn?V=i.DEPTH32F_STENCIL8:w===zr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ds||w===Js?V=i.DEPTH_COMPONENT24:w===Wn?V=i.DEPTH_COMPONENT32F:w===zr&&(V=i.DEPTH_COMPONENT16),V}function E(P,w){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==un&&P.minFilter!==ei?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function b(P){const w=P.target;w.removeEventListener("dispose",b),T(w),w.isVideoTexture&&h.delete(w)}function A(P){const w=P.target;w.removeEventListener("dispose",A),S(w)}function T(P){const w=n.get(P);if(w.__webglInit===void 0)return;const V=P.source,Y=m.get(V);if(Y){const rt=Y[w.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&M(P),Object.keys(Y).length===0&&m.delete(V)}n.remove(P)}function M(P){const w=n.get(P);i.deleteTexture(w.__webglTexture);const V=P.source,Y=m.get(V);delete Y[w.__cacheKey],a.memory.textures--}function S(P){const w=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(w.__webglFramebuffer[Y]))for(let rt=0;rt<w.__webglFramebuffer[Y].length;rt++)i.deleteFramebuffer(w.__webglFramebuffer[Y][rt]);else i.deleteFramebuffer(w.__webglFramebuffer[Y]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[Y])}else{if(Array.isArray(w.__webglFramebuffer))for(let Y=0;Y<w.__webglFramebuffer.length;Y++)i.deleteFramebuffer(w.__webglFramebuffer[Y]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Y=0;Y<w.__webglColorRenderbuffer.length;Y++)w.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[Y]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const V=P.textures;for(let Y=0,rt=V.length;Y<rt;Y++){const $=n.get(V[Y]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(V[Y])}n.remove(P)}let R=0;function L(){R=0}function I(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function N(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function F(P,w){const V=n.get(P);if(P.isVideoTexture&&gt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&V.__version!==P.version){const Y=P.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(V,P,w);return}}else P.isExternalTexture&&(V.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+w)}function z(P,w){const V=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){J(V,P,w);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+w)}function G(P,w){const V=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){J(V,P,w);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+w)}function H(P,w){const V=n.get(P);if(P.version>0&&V.__version!==P.version){et(V,P,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+w)}const Z={[Wi]:i.REPEAT,[ls]:i.CLAMP_TO_EDGE,[Ll]:i.MIRRORED_REPEAT},tt={[un]:i.NEAREST,[Bf]:i.NEAREST_MIPMAP_NEAREST,[na]:i.NEAREST_MIPMAP_LINEAR,[ei]:i.LINEAR,[Lo]:i.LINEAR_MIPMAP_NEAREST,[cs]:i.LINEAR_MIPMAP_LINEAR},nt={[Wf]:i.NEVER,[Jf]:i.ALWAYS,[Xf]:i.LESS,[md]:i.LEQUAL,[qf]:i.EQUAL,[Zf]:i.GEQUAL,[Yf]:i.GREATER,[$f]:i.NOTEQUAL};function bt(P,w){if(w.type===Wn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===ei||w.magFilter===Lo||w.magFilter===na||w.magFilter===cs||w.minFilter===ei||w.minFilter===Lo||w.minFilter===na||w.minFilter===cs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,Z[w.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,Z[w.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,Z[w.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,tt[w.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,tt[w.minFilter]),w.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,nt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===un||w.minFilter!==na&&w.minFilter!==cs||w.type===Wn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Dt(P,w){let V=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",b));const Y=w.source;let rt=m.get(Y);rt===void 0&&(rt={},m.set(Y,rt));const $=N(w);if($!==P.__cacheKey){rt[$]===void 0&&(rt[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),rt[$].usedTimes++;const Rt=rt[P.__cacheKey];Rt!==void 0&&(rt[P.__cacheKey].usedTimes--,Rt.usedTimes===0&&M(w)),P.__cacheKey=$,P.__webglTexture=rt[$].texture}return V}function kt(P,w,V){return Math.floor(Math.floor(P/V)/w)}function qt(P,w,V,Y){const $=P.updateRanges;if($.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,V,Y,w.data);else{$.sort((xt,Ct)=>xt.start-Ct.start);let Rt=0;for(let xt=1;xt<$.length;xt++){const Ct=$[Rt],wt=$[xt],Tt=Ct.start+Ct.count,pt=kt(wt.start,w.width,4),Ot=kt(Ct.start,w.width,4);wt.start<=Tt+1&&pt===Ot&&kt(wt.start+wt.count-1,w.width,4)===pt?Ct.count=Math.max(Ct.count,wt.start+wt.count-Ct.start):(++Rt,$[Rt]=wt)}$.length=Rt+1;const ft=i.getParameter(i.UNPACK_ROW_LENGTH),Nt=i.getParameter(i.UNPACK_SKIP_PIXELS),Bt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let xt=0,Ct=$.length;xt<Ct;xt++){const wt=$[xt],Tt=Math.floor(wt.start/4),pt=Math.ceil(wt.count/4),Ot=Tt%w.width,k=Math.floor(Tt/w.width),ct=pt,mt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ot),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),e.texSubImage2D(i.TEXTURE_2D,0,Ot,k,ct,mt,V,Y,w.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ft),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Nt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Bt)}}function J(P,w,V){let Y=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Y=i.TEXTURE_3D);const rt=Dt(P,w),$=w.source;e.bindTexture(Y,P.__webglTexture,i.TEXTURE0+V);const Rt=n.get($);if($.version!==Rt.__version||rt===!0){e.activeTexture(i.TEXTURE0+V);const ft=pe.getPrimaries(pe.workingColorSpace),Nt=w.colorSpace===Sn?null:pe.getPrimaries(w.colorSpace),Bt=w.colorSpace===Sn||ft===Nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let xt=v(w.image,!1,s.maxTextureSize);xt=Vt(w,xt);const Ct=r.convert(w.format,w.colorSpace),wt=r.convert(w.type);let Tt=y(w.internalFormat,Ct,wt,w.colorSpace,w.isVideoTexture);bt(Y,w);let pt;const Ot=w.mipmaps,k=w.isVideoTexture!==!0,ct=Rt.__version===void 0||rt===!0,mt=$.dataReady,Et=E(w,xt);if(w.isDepthTexture)Tt=_(w.format===Ks,w.type),ct&&(k?e.texStorage2D(i.TEXTURE_2D,1,Tt,xt.width,xt.height):e.texImage2D(i.TEXTURE_2D,0,Tt,xt.width,xt.height,0,Ct,wt,null));else if(w.isDataTexture)if(Ot.length>0){k&&ct&&e.texStorage2D(i.TEXTURE_2D,Et,Tt,Ot[0].width,Ot[0].height);for(let vt=0,at=Ot.length;vt<at;vt++)pt=Ot[vt],k?mt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,pt.width,pt.height,Ct,wt,pt.data):e.texImage2D(i.TEXTURE_2D,vt,Tt,pt.width,pt.height,0,Ct,wt,pt.data);w.generateMipmaps=!1}else k?(ct&&e.texStorage2D(i.TEXTURE_2D,Et,Tt,xt.width,xt.height),mt&&qt(w,xt,Ct,wt)):e.texImage2D(i.TEXTURE_2D,0,Tt,xt.width,xt.height,0,Ct,wt,xt.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){k&&ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Et,Tt,Ot[0].width,Ot[0].height,xt.depth);for(let vt=0,at=Ot.length;vt<at;vt++)if(pt=Ot[vt],w.format!==Xn)if(Ct!==null)if(k){if(mt)if(w.layerUpdates.size>0){const zt=Xh(pt.width,pt.height,w.format,w.type);for(const te of w.layerUpdates){const ge=pt.data.subarray(te*zt/pt.data.BYTES_PER_ELEMENT,(te+1)*zt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,te,pt.width,pt.height,1,Ct,ge)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,pt.width,pt.height,xt.depth,Ct,pt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,vt,Tt,pt.width,pt.height,xt.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?mt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,vt,0,0,0,pt.width,pt.height,xt.depth,Ct,wt,pt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,vt,Tt,pt.width,pt.height,xt.depth,0,Ct,wt,pt.data)}else{k&&ct&&e.texStorage2D(i.TEXTURE_2D,Et,Tt,Ot[0].width,Ot[0].height);for(let vt=0,at=Ot.length;vt<at;vt++)pt=Ot[vt],w.format!==Xn?Ct!==null?k?mt&&e.compressedTexSubImage2D(i.TEXTURE_2D,vt,0,0,pt.width,pt.height,Ct,pt.data):e.compressedTexImage2D(i.TEXTURE_2D,vt,Tt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?mt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,pt.width,pt.height,Ct,wt,pt.data):e.texImage2D(i.TEXTURE_2D,vt,Tt,pt.width,pt.height,0,Ct,wt,pt.data)}else if(w.isDataArrayTexture)if(k){if(ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Et,Tt,xt.width,xt.height,xt.depth),mt)if(w.layerUpdates.size>0){const vt=Xh(xt.width,xt.height,w.format,w.type);for(const at of w.layerUpdates){const zt=xt.data.subarray(at*vt/xt.data.BYTES_PER_ELEMENT,(at+1)*vt/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,xt.width,xt.height,1,Ct,wt,zt)}w.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,Ct,wt,xt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,xt.width,xt.height,xt.depth,0,Ct,wt,xt.data);else if(w.isData3DTexture)k?(ct&&e.texStorage3D(i.TEXTURE_3D,Et,Tt,xt.width,xt.height,xt.depth),mt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,Ct,wt,xt.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,xt.width,xt.height,xt.depth,0,Ct,wt,xt.data);else if(w.isFramebufferTexture){if(ct)if(k)e.texStorage2D(i.TEXTURE_2D,Et,Tt,xt.width,xt.height);else{let vt=xt.width,at=xt.height;for(let zt=0;zt<Et;zt++)e.texImage2D(i.TEXTURE_2D,zt,Tt,vt,at,0,Ct,wt,null),vt>>=1,at>>=1}}else if(Ot.length>0){if(k&&ct){const vt=Gt(Ot[0]);e.texStorage2D(i.TEXTURE_2D,Et,Tt,vt.width,vt.height)}for(let vt=0,at=Ot.length;vt<at;vt++)pt=Ot[vt],k?mt&&e.texSubImage2D(i.TEXTURE_2D,vt,0,0,Ct,wt,pt):e.texImage2D(i.TEXTURE_2D,vt,Tt,Ct,wt,pt);w.generateMipmaps=!1}else if(k){if(ct){const vt=Gt(xt);e.texStorage2D(i.TEXTURE_2D,Et,Tt,vt.width,vt.height)}mt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Ct,wt,xt)}else e.texImage2D(i.TEXTURE_2D,0,Tt,Ct,wt,xt);g(w)&&f(Y),Rt.__version=$.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function et(P,w,V){if(w.image.length!==6)return;const Y=Dt(P,w),rt=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+V);const $=n.get(rt);if(rt.version!==$.__version||Y===!0){e.activeTexture(i.TEXTURE0+V);const Rt=pe.getPrimaries(pe.workingColorSpace),ft=w.colorSpace===Sn?null:pe.getPrimaries(w.colorSpace),Nt=w.colorSpace===Sn||Rt===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);const Bt=w.isCompressedTexture||w.image[0].isCompressedTexture,xt=w.image[0]&&w.image[0].isDataTexture,Ct=[];for(let at=0;at<6;at++)!Bt&&!xt?Ct[at]=v(w.image[at],!0,s.maxCubemapSize):Ct[at]=xt?w.image[at].image:w.image[at],Ct[at]=Vt(w,Ct[at]);const wt=Ct[0],Tt=r.convert(w.format,w.colorSpace),pt=r.convert(w.type),Ot=y(w.internalFormat,Tt,pt,w.colorSpace),k=w.isVideoTexture!==!0,ct=$.__version===void 0||Y===!0,mt=rt.dataReady;let Et=E(w,wt);bt(i.TEXTURE_CUBE_MAP,w);let vt;if(Bt){k&&ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,Ot,wt.width,wt.height);for(let at=0;at<6;at++){vt=Ct[at].mipmaps;for(let zt=0;zt<vt.length;zt++){const te=vt[zt];w.format!==Xn?Tt!==null?k?mt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt,0,0,te.width,te.height,Tt,te.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt,Ot,te.width,te.height,0,te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt,0,0,te.width,te.height,Tt,pt,te.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt,Ot,te.width,te.height,0,Tt,pt,te.data)}}}else{if(vt=w.mipmaps,k&&ct){vt.length>0&&Et++;const at=Gt(Ct[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,Ot,at.width,at.height)}for(let at=0;at<6;at++)if(xt){k?mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ct[at].width,Ct[at].height,Tt,pt,Ct[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ot,Ct[at].width,Ct[at].height,0,Tt,pt,Ct[at].data);for(let zt=0;zt<vt.length;zt++){const ge=vt[zt].image[at].image;k?mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt+1,0,0,ge.width,ge.height,Tt,pt,ge.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt+1,Ot,ge.width,ge.height,0,Tt,pt,ge.data)}}else{k?mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Tt,pt,Ct[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ot,Tt,pt,Ct[at]);for(let zt=0;zt<vt.length;zt++){const te=vt[zt];k?mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt+1,0,0,Tt,pt,te.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,zt+1,Ot,Tt,pt,te.image[at])}}}g(w)&&f(i.TEXTURE_CUBE_MAP),$.__version=rt.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function _t(P,w,V,Y,rt,$){const Rt=r.convert(V.format,V.colorSpace),ft=r.convert(V.type),Nt=y(V.internalFormat,Rt,ft,V.colorSpace),Bt=n.get(w),xt=n.get(V);if(xt.__renderTarget=w,!Bt.__hasExternalTextures){const Ct=Math.max(1,w.width>>$),wt=Math.max(1,w.height>>$);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,$,Nt,Ct,wt,w.depth,0,Rt,ft,null):e.texImage2D(rt,$,Nt,Ct,wt,0,Rt,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),lt(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,rt,xt.__webglTexture,0,ht(w)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,rt,xt.__webglTexture,$),e.bindFramebuffer(i.FRAMEBUFFER,null)}function yt(P,w,V){if(i.bindRenderbuffer(i.RENDERBUFFER,P),w.depthBuffer){const Y=w.depthTexture,rt=Y&&Y.isDepthTexture?Y.type:null,$=_(w.stencilBuffer,rt),Rt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=ht(w);lt(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ft,$,w.width,w.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ft,$,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,$,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Rt,i.RENDERBUFFER,P)}else{const Y=w.textures;for(let rt=0;rt<Y.length;rt++){const $=Y[rt],Rt=r.convert($.format,$.colorSpace),ft=r.convert($.type),Nt=y($.internalFormat,Rt,ft,$.colorSpace),Bt=ht(w);V&&lt(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Bt,Nt,w.width,w.height):lt(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Bt,Nt,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Nt,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(w.depthTexture);Y.__renderTarget=w,(!Y.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),F(w.depthTexture,0);const rt=Y.__webglTexture,$=ht(w);if(w.depthTexture.format===kr)lt(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(w.depthTexture.format===Ks)lt(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function Wt(P){const w=n.get(P),V=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const Y=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Y){const rt=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Y.removeEventListener("dispose",rt)};Y.addEventListener("dispose",rt),w.__depthDisposeCallback=rt}w.__boundDepthTexture=Y}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const Y=P.texture.mipmaps;Y&&Y.length>0?St(w.__webglFramebuffer[0],P):St(w.__webglFramebuffer,P)}else if(V){w.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[Y]),w.__webglDepthbuffer[Y]===void 0)w.__webglDepthbuffer[Y]=i.createRenderbuffer(),yt(w.__webglDepthbuffer[Y],P,!1);else{const rt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=w.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,$)}}else{const Y=P.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),yt(w.__webglDepthbuffer,P,!1);else{const rt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,$)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Kt(P,w,V){const Y=n.get(P);w!==void 0&&_t(Y.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Wt(P)}function O(P){const w=P.texture,V=n.get(P),Y=n.get(w);P.addEventListener("dispose",A);const rt=P.textures,$=P.isWebGLCubeRenderTarget===!0,Rt=rt.length>1;if(Rt||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=w.version,a.memory.textures++),$){V.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer[ft]=[];for(let Nt=0;Nt<w.mipmaps.length;Nt++)V.__webglFramebuffer[ft][Nt]=i.createFramebuffer()}else V.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer=[];for(let ft=0;ft<w.mipmaps.length;ft++)V.__webglFramebuffer[ft]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Rt)for(let ft=0,Nt=rt.length;ft<Nt;ft++){const Bt=n.get(rt[ft]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),a.memory.textures++)}if(P.samples>0&&lt(P)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ft=0;ft<rt.length;ft++){const Nt=rt[ft];V.__webglColorRenderbuffer[ft]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ft]);const Bt=r.convert(Nt.format,Nt.colorSpace),xt=r.convert(Nt.type),Ct=y(Nt.internalFormat,Bt,xt,Nt.colorSpace,P.isXRRenderTarget===!0),wt=ht(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,Ct,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,V.__webglColorRenderbuffer[ft])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),yt(V.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),bt(i.TEXTURE_CUBE_MAP,w);for(let ft=0;ft<6;ft++)if(w.mipmaps&&w.mipmaps.length>0)for(let Nt=0;Nt<w.mipmaps.length;Nt++)_t(V.__webglFramebuffer[ft][Nt],P,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Nt);else _t(V.__webglFramebuffer[ft],P,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);g(w)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let ft=0,Nt=rt.length;ft<Nt;ft++){const Bt=rt[ft],xt=n.get(Bt);let Ct=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Ct=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Ct,xt.__webglTexture),bt(Ct,Bt),_t(V.__webglFramebuffer,P,Bt,i.COLOR_ATTACHMENT0+ft,Ct,0),g(Bt)&&f(Ct)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ft=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,Y.__webglTexture),bt(ft,w),w.mipmaps&&w.mipmaps.length>0)for(let Nt=0;Nt<w.mipmaps.length;Nt++)_t(V.__webglFramebuffer[Nt],P,w,i.COLOR_ATTACHMENT0,ft,Nt);else _t(V.__webglFramebuffer,P,w,i.COLOR_ATTACHMENT0,ft,0);g(w)&&f(ft),e.unbindTexture()}P.depthBuffer&&Wt(P)}function ot(P){const w=P.textures;for(let V=0,Y=w.length;V<Y;V++){const rt=w[V];if(g(rt)){const $=x(P),Rt=n.get(rt).__webglTexture;e.bindTexture($,Rt),f($),e.unbindTexture()}}}const st=[],it=[];function q(P){if(P.samples>0){if(lt(P)===!1){const w=P.textures,V=P.width,Y=P.height;let rt=i.COLOR_BUFFER_BIT;const $=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Rt=n.get(P),ft=w.length>1;if(ft)for(let Bt=0;Bt<w.length;Bt++)e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);const Nt=P.texture.mipmaps;Nt&&Nt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Bt=0;Bt<w.length;Bt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),ft){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Bt]);const xt=n.get(w[Bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,xt,0)}i.blitFramebuffer(0,0,V,Y,0,0,V,Y,rt,i.NEAREST),l===!0&&(st.length=0,it.length=0,st.push(i.COLOR_ATTACHMENT0+Bt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(st.push($),it.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ft)for(let Bt=0;Bt<w.length;Bt++){e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Bt]);const xt=n.get(w[Bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Bt,i.TEXTURE_2D,xt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const w=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function ht(P){return Math.min(s.maxSamples,P.samples)}function lt(P){const w=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function gt(P){const w=a.render.frame;h.get(P)!==w&&(h.set(P,w),P.update())}function Vt(P,w){const V=P.colorSpace,Y=P.format,rt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||V!==js&&V!==Sn&&(pe.getTransfer(V)===ve?(Y!==Xn||rt!==oi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),w}function Gt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=L,this.setTexture2D=F,this.setTexture2DArray=z,this.setTexture3D=G,this.setTextureCube=H,this.rebindTextures=Kt,this.setupRenderTarget=O,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=q,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=lt}function hx(i,t){function e(n,s=Sn){let r;const a=pe.getTransfer(s);if(n===oi)return i.UNSIGNED_BYTE;if(n===Uc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Nc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===hd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ud)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ld)return i.BYTE;if(n===cd)return i.SHORT;if(n===zr)return i.UNSIGNED_SHORT;if(n===Dc)return i.INT;if(n===ds)return i.UNSIGNED_INT;if(n===Wn)return i.FLOAT;if(n===li)return i.HALF_FLOAT;if(n===dd)return i.ALPHA;if(n===fd)return i.RGB;if(n===Xn)return i.RGBA;if(n===kr)return i.DEPTH_COMPONENT;if(n===Ks)return i.DEPTH_STENCIL;if(n===xo)return i.RED;if(n===Fc)return i.RED_INTEGER;if(n===pd)return i.RG;if(n===Oc)return i.RG_INTEGER;if(n===zc)return i.RGBA_INTEGER;if(n===qa||n===Ya||n===$a||n===Za)if(a===ve)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Dl||n===Ul||n===Nl||n===Fl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Dl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ul)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ol||n===zl||n===kl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ol||n===zl)return a===ve?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===kl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Bl||n===Hl||n===Vl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===$l||n===Zl||n===Jl||n===Kl||n===jl||n===Ql)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Bl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Hl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Gl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ql)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===$l)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Kl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ql)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===tc||n===ec||n===nc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===tc)return a===ve?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ic||n===sc||n===rc||n===ac)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ic)return r.COMPRESSED_RED_RGTC1_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Js?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const ux=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dx=`
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

}`;class fx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Ad(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new hn({vertexShader:ux,fragmentShader:dx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Yt(new ue(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class px extends sr{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,m=null,u=null,p=null;const v=typeof XRWebGLBinding<"u",g=new fx,f={},x=e.getContextAttributes();let y=null,_=null;const E=[],b=[],A=new dt;let T=null;const M=new nn;M.viewport=new Me;const S=new nn;S.viewport=new Me;const R=[M,S],L=new Dp;let I=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let et=E[J];return et===void 0&&(et=new Qo,E[J]=et),et.getTargetRaySpace()},this.getControllerGrip=function(J){let et=E[J];return et===void 0&&(et=new Qo,E[J]=et),et.getGripSpace()},this.getHand=function(J){let et=E[J];return et===void 0&&(et=new Qo,E[J]=et),et.getHandSpace()};function F(J){const et=b.indexOf(J.inputSource);if(et===-1)return;const _t=E[et];_t!==void 0&&(_t.update(J.inputSource,J.frame,c||a),_t.dispatchEvent({type:J.type,data:J.inputSource}))}function z(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",G);for(let J=0;J<E.length;J++){const et=b[J];et!==null&&(b[J]=null,E[J].disconnect(et))}I=null,N=null,g.reset();for(const J in f)delete f[J];t.setRenderTarget(y),u=null,m=null,d=null,s=null,_=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return m!==null?m:u},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(y=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",z),s.addEventListener("inputsourceschange",G),x.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let _t=null,yt=null,St=null;x.depth&&(St=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,_t=x.stencil?Ks:kr,yt=x.stencil?Js:ds);const Wt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:r};d=this.getBinding(),m=d.createProjectionLayer(Wt),s.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),_=new wn(m.textureWidth,m.textureHeight,{format:Xn,type:oi,depthTexture:new Xc(m.textureWidth,m.textureHeight,yt,void 0,void 0,void 0,void 0,void 0,void 0,_t),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const _t={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,_t),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),_=new wn(u.framebufferWidth,u.framebufferHeight,{format:Xn,type:oi,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),qt.setContext(s),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function G(J){for(let et=0;et<J.removed.length;et++){const _t=J.removed[et],yt=b.indexOf(_t);yt>=0&&(b[yt]=null,E[yt].disconnect(_t))}for(let et=0;et<J.added.length;et++){const _t=J.added[et];let yt=b.indexOf(_t);if(yt===-1){for(let Wt=0;Wt<E.length;Wt++)if(Wt>=b.length){b.push(_t),yt=Wt;break}else if(b[Wt]===null){b[Wt]=_t,yt=Wt;break}if(yt===-1)break}const St=E[yt];St&&St.connect(_t)}}const H=new D,Z=new D;function tt(J,et,_t){H.setFromMatrixPosition(et.matrixWorld),Z.setFromMatrixPosition(_t.matrixWorld);const yt=H.distanceTo(Z),St=et.projectionMatrix.elements,Wt=_t.projectionMatrix.elements,Kt=St[14]/(St[10]-1),O=St[14]/(St[10]+1),ot=(St[9]+1)/St[5],st=(St[9]-1)/St[5],it=(St[8]-1)/St[0],q=(Wt[8]+1)/Wt[0],ht=Kt*it,lt=Kt*q,gt=yt/(-it+q),Vt=gt*-it;if(et.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Vt),J.translateZ(gt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),St[10]===-1)J.projectionMatrix.copy(et.projectionMatrix),J.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Gt=Kt+gt,P=O+gt,w=ht-Vt,V=lt+(yt-Vt),Y=ot*O/P*Gt,rt=st*O/P*Gt;J.projectionMatrix.makePerspective(w,V,Y,rt,Gt,P),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function nt(J,et){et===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(et.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let et=J.near,_t=J.far;g.texture!==null&&(g.depthNear>0&&(et=g.depthNear),g.depthFar>0&&(_t=g.depthFar)),L.near=S.near=M.near=et,L.far=S.far=M.far=_t,(I!==L.near||N!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),I=L.near,N=L.far),L.layers.mask=J.layers.mask|6,M.layers.mask=L.layers.mask&3,S.layers.mask=L.layers.mask&5;const yt=J.parent,St=L.cameras;nt(L,yt);for(let Wt=0;Wt<St.length;Wt++)nt(St[Wt],yt);St.length===2?tt(L,M,S):L.projectionMatrix.copy(M.projectionMatrix),bt(J,L,yt)};function bt(J,et,_t){_t===null?J.matrix.copy(et.matrixWorld):(J.matrix.copy(_t.matrixWorld),J.matrix.invert(),J.matrix.multiply(et.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(et.projectionMatrix),J.projectionMatrixInverse.copy(et.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Br*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(m===null&&u===null))return l},this.setFoveation=function(J){l=J,m!==null&&(m.fixedFoveation=J),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function(J){return f[J]};let Dt=null;function kt(J,et){if(h=et.getViewerPose(c||a),p=et,h!==null){const _t=h.views;u!==null&&(t.setRenderTargetFramebuffer(_,u.framebuffer),t.setRenderTarget(_));let yt=!1;_t.length!==L.cameras.length&&(L.cameras.length=0,yt=!0);for(let O=0;O<_t.length;O++){const ot=_t[O];let st=null;if(u!==null)st=u.getViewport(ot);else{const q=d.getViewSubImage(m,ot);st=q.viewport,O===0&&(t.setRenderTargetTextures(_,q.colorTexture,q.depthStencilTexture),t.setRenderTarget(_))}let it=R[O];it===void 0&&(it=new nn,it.layers.enable(O),it.viewport=new Me,R[O]=it),it.matrix.fromArray(ot.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(ot.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(st.x,st.y,st.width,st.height),O===0&&(L.matrix.copy(it.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),yt===!0&&L.cameras.push(it)}const St=s.enabledFeatures;if(St&&St.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const O=d.getDepthInformation(_t[0]);O&&O.isValid&&O.texture&&g.init(O,s.renderState)}if(St&&St.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let O=0;O<_t.length;O++){const ot=_t[O].camera;if(ot){let st=f[ot];st||(st=new Ad,f[ot]=st);const it=d.getCameraImage(ot);st.sourceTexture=it}}}}for(let _t=0;_t<E.length;_t++){const yt=b[_t],St=E[_t];yt!==null&&St!==void 0&&St.update(yt,et,c||a)}Dt&&Dt(J,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),p=null}const qt=new kd;qt.setAnimationLoop(kt),this.setAnimationLoop=function(J){Dt=J},this.dispose=function(){}}}const Qi=new Fn,mx=new he;function gx(i,t){function e(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,Md(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,x,y,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(g,f):f.isMeshToonMaterial?(r(g,f),d(g,f)):f.isMeshPhongMaterial?(r(g,f),h(g,f)):f.isMeshStandardMaterial?(r(g,f),m(g,f),f.isMeshPhysicalMaterial&&u(g,f,_)):f.isMeshMatcapMaterial?(r(g,f),p(g,f)):f.isMeshDepthMaterial?r(g,f):f.isMeshDistanceMaterial?(r(g,f),v(g,f)):f.isMeshNormalMaterial?r(g,f):f.isLineBasicMaterial?(a(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,x,y):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,e(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===sn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,e(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===sn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,e(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,e(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const x=t.get(f),y=x.envMap,_=x.envMapRotation;y&&(g.envMap.value=y,Qi.copy(_),Qi.x*=-1,Qi.y*=-1,Qi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Qi.y*=-1,Qi.z*=-1),g.envMapRotation.value.setFromMatrix4(mx.makeRotationFromEuler(Qi)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,g.aoMapTransform))}function a(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,x,y){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*x,g.scale.value=y*.5,f.map&&(g.map.value=f.map,e(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function d(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function m(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function u(g,f,x){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===sn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,f){f.matcap&&(g.matcap.value=f.matcap)}function v(g,f){const x=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function vx(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const _=y.program;n.uniformBlockBinding(x,_)}function c(x,y){let _=s[x.id];_===void 0&&(p(x),_=h(x),s[x.id]=_,x.addEventListener("dispose",g));const E=y.program;n.updateUBOMapping(x,E);const b=t.render.frame;r[x.id]!==b&&(m(x),r[x.id]=b)}function h(x){const y=d();x.__bindingPointIndex=y;const _=i.createBuffer(),E=x.__size,b=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,E,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(x){const y=s[x.id],_=x.uniforms,E=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let b=0,A=_.length;b<A;b++){const T=Array.isArray(_[b])?_[b]:[_[b]];for(let M=0,S=T.length;M<S;M++){const R=T[M];if(u(R,b,M,E)===!0){const L=R.__offset,I=Array.isArray(R.value)?R.value:[R.value];let N=0;for(let F=0;F<I.length;F++){const z=I[F],G=v(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,L+N,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,N),N+=G.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,y,_,E){const b=x.value,A=y+"_"+_;if(E[A]===void 0)return typeof b=="number"||typeof b=="boolean"?E[A]=b:E[A]=b.clone(),!0;{const T=E[A];if(typeof b=="number"||typeof b=="boolean"){if(T!==b)return E[A]=b,!0}else if(T.equals(b)===!1)return T.copy(b),!0}return!1}function p(x){const y=x.uniforms;let _=0;const E=16;for(let A=0,T=y.length;A<T;A++){const M=Array.isArray(y[A])?y[A]:[y[A]];for(let S=0,R=M.length;S<R;S++){const L=M[S],I=Array.isArray(L.value)?L.value:[L.value];for(let N=0,F=I.length;N<F;N++){const z=I[N],G=v(z),H=_%E,Z=H%G.boundary,tt=H+Z;_+=Z,tt!==0&&E-tt<G.storage&&(_+=E-tt),L.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=_,_+=G.storage}}}const b=_%E;return b>0&&(_+=E-b),x.__size=_,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const _=a.indexOf(y.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function f(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class xx{constructor(t={}){const{canvas:e=f0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:m=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,f=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let E=!1;this._outputColorSpace=$e;let b=0,A=0,T=null,M=-1,S=null;const R=new Me,L=new Me;let I=null;const N=new $t(0);let F=0,z=e.width,G=e.height,H=1,Z=null,tt=null;const nt=new Me(0,0,z,G),bt=new Me(0,0,z,G);let Dt=!1;const kt=new Wc;let qt=!1,J=!1;const et=new he,_t=new D,yt=new Me,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Wt=!1;function Kt(){return T===null?H:1}let O=n;function ot(C,W){return e.getContext(C,W)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Pc}`),e.addEventListener("webglcontextlost",mt,!1),e.addEventListener("webglcontextrestored",Et,!1),e.addEventListener("webglcontextcreationerror",vt,!1),O===null){const W="webgl2";if(O=ot(W,C),O===null)throw ot(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let st,it,q,ht,lt,gt,Vt,Gt,P,w,V,Y,rt,$,Rt,ft,Nt,Bt,xt,Ct,wt,Tt,pt,Ot;function k(){st=new Rg(O),st.init(),Tt=new hx(O,st),it=new Mg(O,st,t,Tt),q=new lx(O,st),it.reversedDepthBuffer&&m&&q.buffers.depth.setReversed(!0),ht=new Ig(O),lt=new Zv,gt=new cx(O,st,q,lt,it,Tt,ht),Vt=new bg(_),Gt=new Ag(_),P=new Op(O),pt=new _g(O,P),w=new Cg(O,P,ht,pt),V=new Dg(O,w,P,ht),xt=new Lg(O,it,gt),ft=new Sg(lt),Y=new $v(_,Vt,Gt,st,it,pt,ft),rt=new gx(_,lt),$=new Kv,Rt=new ix(st),Bt=new xg(_,Vt,Gt,q,V,u,l),Nt=new ax(_,V,it),Ot=new vx(O,ht,it,q),Ct=new yg(O,st,ht),wt=new Pg(O,st,ht),ht.programs=Y.programs,_.capabilities=it,_.extensions=st,_.properties=lt,_.renderLists=$,_.shadowMap=Nt,_.state=q,_.info=ht}k();const ct=new px(_,O);this.xr=ct,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const C=st.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=st.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(C){C!==void 0&&(H=C,this.setSize(z,G,!1))},this.getSize=function(C){return C.set(z,G)},this.setSize=function(C,W,K=!0){if(ct.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,G=W,e.width=Math.floor(C*H),e.height=Math.floor(W*H),K===!0&&(e.style.width=C+"px",e.style.height=W+"px"),this.setViewport(0,0,C,W)},this.getDrawingBufferSize=function(C){return C.set(z*H,G*H).floor()},this.setDrawingBufferSize=function(C,W,K){z=C,G=W,H=K,e.width=Math.floor(C*K),e.height=Math.floor(W*K),this.setViewport(0,0,C,W)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(nt)},this.setViewport=function(C,W,K,Q){C.isVector4?nt.set(C.x,C.y,C.z,C.w):nt.set(C,W,K,Q),q.viewport(R.copy(nt).multiplyScalar(H).round())},this.getScissor=function(C){return C.copy(bt)},this.setScissor=function(C,W,K,Q){C.isVector4?bt.set(C.x,C.y,C.z,C.w):bt.set(C,W,K,Q),q.scissor(L.copy(bt).multiplyScalar(H).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(C){q.setScissorTest(Dt=C)},this.setOpaqueSort=function(C){Z=C},this.setTransparentSort=function(C){tt=C},this.getClearColor=function(C){return C.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(C=!0,W=!0,K=!0){let Q=0;if(C){let X=!1;if(T!==null){const Mt=T.texture.format;X=Mt===zc||Mt===Oc||Mt===Fc}if(X){const Mt=T.texture.type,Ut=Mt===oi||Mt===ds||Mt===zr||Mt===Js||Mt===Uc||Mt===Nc,Xt=Bt.getClearColor(),Ht=Bt.getClearAlpha(),jt=Xt.r,Qt=Xt.g,Zt=Xt.b;Ut?(p[0]=jt,p[1]=Qt,p[2]=Zt,p[3]=Ht,O.clearBufferuiv(O.COLOR,0,p)):(v[0]=jt,v[1]=Qt,v[2]=Zt,v[3]=Ht,O.clearBufferiv(O.COLOR,0,v))}else Q|=O.COLOR_BUFFER_BIT}W&&(Q|=O.DEPTH_BUFFER_BIT),K&&(Q|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",mt,!1),e.removeEventListener("webglcontextrestored",Et,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),Bt.dispose(),$.dispose(),Rt.dispose(),lt.dispose(),Vt.dispose(),Gt.dispose(),V.dispose(),pt.dispose(),Ot.dispose(),Y.dispose(),ct.dispose(),ct.removeEventListener("sessionstart",gn),ct.removeEventListener("sessionend",or),di.stop()};function mt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Et(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const C=ht.autoReset,W=Nt.enabled,K=Nt.autoUpdate,Q=Nt.needsUpdate,X=Nt.type;k(),ht.autoReset=C,Nt.enabled=W,Nt.autoUpdate=K,Nt.needsUpdate=Q,Nt.type=X}function vt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function at(C){const W=C.target;W.removeEventListener("dispose",at),zt(W)}function zt(C){te(C),lt.remove(C)}function te(C){const W=lt.get(C).programs;W!==void 0&&(W.forEach(function(K){Y.releaseProgram(K)}),C.isShaderMaterial&&Y.releaseShaderCache(C))}this.renderBufferDirect=function(C,W,K,Q,X,Mt){W===null&&(W=St);const Ut=X.isMesh&&X.matrixWorld.determinant()<0,Xt=ta(C,W,K,Q,X);q.setMaterial(Q,Ut);let Ht=K.index,jt=1;if(Q.wireframe===!0){if(Ht=w.getWireframeAttribute(K),Ht===void 0)return;jt=2}const Qt=K.drawRange,Zt=K.attributes.position;let ce=Qt.start*jt,_e=(Qt.start+Qt.count)*jt;Mt!==null&&(ce=Math.max(ce,Mt.start*jt),_e=Math.min(_e,(Mt.start+Mt.count)*jt)),Ht!==null?(ce=Math.max(ce,0),_e=Math.min(_e,Ht.count)):Zt!=null&&(ce=Math.max(ce,0),_e=Math.min(_e,Zt.count));const Ue=_e-ce;if(Ue<0||Ue===1/0)return;pt.setup(X,Q,Xt,K,Ht);let we,Se=Ct;if(Ht!==null&&(we=P.get(Ht),Se=wt,Se.setIndex(we)),X.isMesh)Q.wireframe===!0?(q.setLineWidth(Q.wireframeLinewidth*Kt()),Se.setMode(O.LINES)):Se.setMode(O.TRIANGLES);else if(X.isLine){let Jt=Q.linewidth;Jt===void 0&&(Jt=1),q.setLineWidth(Jt*Kt()),X.isLineSegments?Se.setMode(O.LINES):X.isLineLoop?Se.setMode(O.LINE_LOOP):Se.setMode(O.LINE_STRIP)}else X.isPoints?Se.setMode(O.POINTS):X.isSprite&&Se.setMode(O.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Vr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))Se.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Jt=X._multiDrawStarts,Re=X._multiDrawCounts,me=X._multiDrawCount,vn=Ht?P.get(Ht).bytesPerElement:1,ys=lt.get(Q).currentProgram.getUniforms();for(let xn=0;xn<me;xn++)ys.setValue(O,"_gl_DrawID",xn),Se.render(Jt[xn]/vn,Re[xn])}else if(X.isInstancedMesh)Se.renderInstances(ce,Ue,X.count);else if(K.isInstancedBufferGeometry){const Jt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Re=Math.min(K.instanceCount,Jt);Se.renderInstances(ce,Ue,Re)}else Se.render(ce,Ue)};function ge(C,W,K){C.transparent===!0&&C.side===ze&&C.forceSinglePass===!1?(C.side=sn,C.needsUpdate=!0,_s(C,W,K),C.side=Gi,C.needsUpdate=!0,_s(C,W,K),C.side=ze):_s(C,W,K)}this.compile=function(C,W,K=null){K===null&&(K=C),f=Rt.get(K),f.init(W),y.push(f),K.traverseVisible(function(X){X.isLight&&X.layers.test(W.layers)&&(f.pushLight(X),X.castShadow&&f.pushShadow(X))}),C!==K&&C.traverseVisible(function(X){X.isLight&&X.layers.test(W.layers)&&(f.pushLight(X),X.castShadow&&f.pushShadow(X))}),f.setupLights();const Q=new Set;return C.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Mt=X.material;if(Mt)if(Array.isArray(Mt))for(let Ut=0;Ut<Mt.length;Ut++){const Xt=Mt[Ut];ge(Xt,K,X),Q.add(Xt)}else ge(Mt,K,X),Q.add(Mt)}),f=y.pop(),Q},this.compileAsync=function(C,W,K=null){const Q=this.compile(C,W,K);return new Promise(X=>{function Mt(){if(Q.forEach(function(Ut){lt.get(Ut).currentProgram.isReady()&&Q.delete(Ut)}),Q.size===0){X(C);return}setTimeout(Mt,10)}st.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let de=null;function fn(C){de&&de(C)}function gn(){di.stop()}function or(){di.start()}const di=new kd;di.setAnimationLoop(fn),typeof self<"u"&&di.setContext(self),this.setAnimationLoop=function(C){de=C,ct.setAnimationLoop(C),C===null?di.stop():di.start()},ct.addEventListener("sessionstart",gn),ct.addEventListener("sessionend",or),this.render=function(C,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),ct.enabled===!0&&ct.isPresenting===!0&&(ct.cameraAutoUpdate===!0&&ct.updateCamera(W),W=ct.getCamera()),C.isScene===!0&&C.onBeforeRender(_,C,W,T),f=Rt.get(C,y.length),f.init(W),y.push(f),et.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),kt.setFromProjectionMatrix(et,ni,W.reversedDepth),J=this.localClippingEnabled,qt=ft.init(this.clippingPlanes,J),g=$.get(C,x.length),g.init(),x.push(g),ct.enabled===!0&&ct.isPresenting===!0){const Mt=_.xr.getDepthSensingMesh();Mt!==null&&lr(Mt,W,-1/0,_.sortObjects)}lr(C,W,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(Z,tt),Wt=ct.enabled===!1||ct.isPresenting===!1||ct.hasDepthSensing()===!1,Wt&&Bt.addToRenderList(g,C),this.info.render.frame++,qt===!0&&ft.beginShadows();const K=f.state.shadowsArray;Nt.render(K,C,W),qt===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,X=g.transmissive;if(f.setupLights(),W.isArrayCamera){const Mt=W.cameras;if(X.length>0)for(let Ut=0,Xt=Mt.length;Ut<Xt;Ut++){const Ht=Mt[Ut];jr(Q,X,C,Ht)}Wt&&Bt.render(C);for(let Ut=0,Xt=Mt.length;Ut<Xt;Ut++){const Ht=Mt[Ut];cr(g,C,Ht,Ht.viewport)}}else X.length>0&&jr(Q,X,C,W),Wt&&Bt.render(C),cr(g,C,W);T!==null&&A===0&&(gt.updateMultisampleRenderTarget(T),gt.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(_,C,W),pt.resetDefaultState(),M=-1,S=null,y.pop(),y.length>0?(f=y[y.length-1],qt===!0&&ft.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function lr(C,W,K,Q){if(C.visible===!1)return;if(C.layers.test(W.layers)){if(C.isGroup)K=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(W);else if(C.isLight)f.pushLight(C),C.castShadow&&f.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||kt.intersectsSprite(C)){Q&&yt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(et);const Ut=V.update(C),Xt=C.material;Xt.visible&&g.push(C,Ut,Xt,K,yt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||kt.intersectsObject(C))){const Ut=V.update(C),Xt=C.material;if(Q&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),yt.copy(C.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),yt.copy(Ut.boundingSphere.center)),yt.applyMatrix4(C.matrixWorld).applyMatrix4(et)),Array.isArray(Xt)){const Ht=Ut.groups;for(let jt=0,Qt=Ht.length;jt<Qt;jt++){const Zt=Ht[jt],ce=Xt[Zt.materialIndex];ce&&ce.visible&&g.push(C,Ut,ce,K,yt.z,Zt)}}else Xt.visible&&g.push(C,Ut,Xt,K,yt.z,null)}}const Mt=C.children;for(let Ut=0,Xt=Mt.length;Ut<Xt;Ut++)lr(Mt[Ut],W,K,Q)}function cr(C,W,K,Q){const X=C.opaque,Mt=C.transmissive,Ut=C.transparent;f.setupLightsView(K),qt===!0&&ft.setGlobalState(_.clippingPlanes,K),Q&&q.viewport(R.copy(Q)),X.length>0&&xs(X,W,K),Mt.length>0&&xs(Mt,W,K),Ut.length>0&&xs(Ut,W,K),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function jr(C,W,K,Q){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[Q.id]===void 0&&(f.state.transmissionRenderTarget[Q.id]=new wn(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?li:oi,minFilter:cs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:pe.workingColorSpace}));const Mt=f.state.transmissionRenderTarget[Q.id],Ut=Q.viewport||R;Mt.setSize(Ut.z*_.transmissionResolutionScale,Ut.w*_.transmissionResolutionScale);const Xt=_.getRenderTarget(),Ht=_.getActiveCubeFace(),jt=_.getActiveMipmapLevel();_.setRenderTarget(Mt),_.getClearColor(N),F=_.getClearAlpha(),F<1&&_.setClearColor(16777215,.5),_.clear(),Wt&&Bt.render(K);const Qt=_.toneMapping;_.toneMapping=Hi;const Zt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),f.setupLightsView(Q),qt===!0&&ft.setGlobalState(_.clippingPlanes,Q),xs(C,K,Q),gt.updateMultisampleRenderTarget(Mt),gt.updateRenderTargetMipmap(Mt),st.has("WEBGL_multisampled_render_to_texture")===!1){let ce=!1;for(let _e=0,Ue=W.length;_e<Ue;_e++){const we=W[_e],Se=we.object,Jt=we.geometry,Re=we.material,me=we.group;if(Re.side===ze&&Se.layers.test(Q.layers)){const vn=Re.side;Re.side=sn,Re.needsUpdate=!0,Qr(Se,K,Q,Jt,Re,me),Re.side=vn,Re.needsUpdate=!0,ce=!0}}ce===!0&&(gt.updateMultisampleRenderTarget(Mt),gt.updateRenderTargetMipmap(Mt))}_.setRenderTarget(Xt,Ht,jt),_.setClearColor(N,F),Zt!==void 0&&(Q.viewport=Zt),_.toneMapping=Qt}function xs(C,W,K){const Q=W.isScene===!0?W.overrideMaterial:null;for(let X=0,Mt=C.length;X<Mt;X++){const Ut=C[X],Xt=Ut.object,Ht=Ut.geometry,jt=Ut.group;let Qt=Ut.material;Qt.allowOverride===!0&&Q!==null&&(Qt=Q),Xt.layers.test(K.layers)&&Qr(Xt,W,K,Ht,Qt,jt)}}function Qr(C,W,K,Q,X,Mt){C.onBeforeRender(_,W,K,Q,X,Mt),C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),X.onBeforeRender(_,W,K,Q,C,Mt),X.transparent===!0&&X.side===ze&&X.forceSinglePass===!1?(X.side=sn,X.needsUpdate=!0,_.renderBufferDirect(K,W,Q,X,C,Mt),X.side=Gi,X.needsUpdate=!0,_.renderBufferDirect(K,W,Q,X,C,Mt),X.side=ze):_.renderBufferDirect(K,W,Q,X,C,Mt),C.onAfterRender(_,W,K,Q,X,Mt)}function _s(C,W,K){W.isScene!==!0&&(W=St);const Q=lt.get(C),X=f.state.lights,Mt=f.state.shadowsArray,Ut=X.state.version,Xt=Y.getParameters(C,X.state,Mt,W,K),Ht=Y.getProgramCacheKey(Xt);let jt=Q.programs;Q.environment=C.isMeshStandardMaterial?W.environment:null,Q.fog=W.fog,Q.envMap=(C.isMeshStandardMaterial?Gt:Vt).get(C.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&C.envMap===null?W.environmentRotation:C.envMapRotation,jt===void 0&&(C.addEventListener("dispose",at),jt=new Map,Q.programs=jt);let Qt=jt.get(Ht);if(Qt!==void 0){if(Q.currentProgram===Qt&&Q.lightsStateVersion===Ut)return pi(C,Xt),Qt}else Xt.uniforms=Y.getUniforms(C),C.onBeforeCompile(Xt,_),Qt=Y.acquireProgram(Xt,Ht),jt.set(Ht,Qt),Q.uniforms=Xt.uniforms;const Zt=Q.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Zt.clippingPlanes=ft.uniform),pi(C,Xt),Q.needsLights=xf(C),Q.lightsStateVersion=Ut,Q.needsLights&&(Zt.ambientLightColor.value=X.state.ambient,Zt.lightProbe.value=X.state.probe,Zt.directionalLights.value=X.state.directional,Zt.directionalLightShadows.value=X.state.directionalShadow,Zt.spotLights.value=X.state.spot,Zt.spotLightShadows.value=X.state.spotShadow,Zt.rectAreaLights.value=X.state.rectArea,Zt.ltc_1.value=X.state.rectAreaLTC1,Zt.ltc_2.value=X.state.rectAreaLTC2,Zt.pointLights.value=X.state.point,Zt.pointLightShadows.value=X.state.pointShadow,Zt.hemisphereLights.value=X.state.hemi,Zt.directionalShadowMap.value=X.state.directionalShadowMap,Zt.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Zt.spotShadowMap.value=X.state.spotShadowMap,Zt.spotLightMatrix.value=X.state.spotLightMatrix,Zt.spotLightMap.value=X.state.spotLightMap,Zt.pointShadowMap.value=X.state.pointShadowMap,Zt.pointShadowMatrix.value=X.state.pointShadowMatrix),Q.currentProgram=Qt,Q.uniformsList=null,Qt}function fi(C){if(C.uniformsList===null){const W=C.currentProgram.getUniforms();C.uniformsList=Ja.seqWithValue(W.seq,C.uniforms)}return C.uniformsList}function pi(C,W){const K=lt.get(C);K.outputColorSpace=W.outputColorSpace,K.batching=W.batching,K.batchingColor=W.batchingColor,K.instancing=W.instancing,K.instancingColor=W.instancingColor,K.instancingMorph=W.instancingMorph,K.skinning=W.skinning,K.morphTargets=W.morphTargets,K.morphNormals=W.morphNormals,K.morphColors=W.morphColors,K.morphTargetsCount=W.morphTargetsCount,K.numClippingPlanes=W.numClippingPlanes,K.numIntersection=W.numClipIntersection,K.vertexAlphas=W.vertexAlphas,K.vertexTangents=W.vertexTangents,K.toneMapping=W.toneMapping}function ta(C,W,K,Q,X){W.isScene!==!0&&(W=St),gt.resetTextureUnits();const Mt=W.fog,Ut=Q.isMeshStandardMaterial?W.environment:null,Xt=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:js,Ht=(Q.isMeshStandardMaterial?Gt:Vt).get(Q.envMap||Ut),jt=Q.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Qt=!!K.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Zt=!!K.morphAttributes.position,ce=!!K.morphAttributes.normal,_e=!!K.morphAttributes.color;let Ue=Hi;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Ue=_.toneMapping);const we=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Se=we!==void 0?we.length:0,Jt=lt.get(Q),Re=f.state.lights;if(qt===!0&&(J===!0||C!==S)){const rn=C===S&&Q.id===M;ft.setState(Q,C,rn)}let me=!1;Q.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==Re.state.version||Jt.outputColorSpace!==Xt||X.isBatchedMesh&&Jt.batching===!1||!X.isBatchedMesh&&Jt.batching===!0||X.isBatchedMesh&&Jt.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Jt.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Jt.instancing===!1||!X.isInstancedMesh&&Jt.instancing===!0||X.isSkinnedMesh&&Jt.skinning===!1||!X.isSkinnedMesh&&Jt.skinning===!0||X.isInstancedMesh&&Jt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Jt.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Jt.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Jt.instancingMorph===!1&&X.morphTexture!==null||Jt.envMap!==Ht||Q.fog===!0&&Jt.fog!==Mt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==ft.numPlanes||Jt.numIntersection!==ft.numIntersection)||Jt.vertexAlphas!==jt||Jt.vertexTangents!==Qt||Jt.morphTargets!==Zt||Jt.morphNormals!==ce||Jt.morphColors!==_e||Jt.toneMapping!==Ue||Jt.morphTargetsCount!==Se)&&(me=!0):(me=!0,Jt.__version=Q.version);let vn=Jt.currentProgram;me===!0&&(vn=_s(Q,W,X));let ys=!1,xn=!1,hr=!1;const Ce=vn.getUniforms(),Tn=Jt.uniforms;if(q.useProgram(vn.program)&&(ys=!0,xn=!0,hr=!0),Q.id!==M&&(M=Q.id,xn=!0),ys||S!==C){q.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ce.setValue(O,"projectionMatrix",C.projectionMatrix),Ce.setValue(O,"viewMatrix",C.matrixWorldInverse);const pn=Ce.map.cameraPosition;pn!==void 0&&pn.setValue(O,_t.setFromMatrixPosition(C.matrixWorld)),it.logarithmicDepthBuffer&&Ce.setValue(O,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Ce.setValue(O,"isOrthographic",C.isOrthographicCamera===!0),S!==C&&(S=C,xn=!0,hr=!0)}if(X.isSkinnedMesh){Ce.setOptional(O,X,"bindMatrix"),Ce.setOptional(O,X,"bindMatrixInverse");const rn=X.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Ce.setValue(O,"boneTexture",rn.boneTexture,gt))}X.isBatchedMesh&&(Ce.setOptional(O,X,"batchingTexture"),Ce.setValue(O,"batchingTexture",X._matricesTexture,gt),Ce.setOptional(O,X,"batchingIdTexture"),Ce.setValue(O,"batchingIdTexture",X._indirectTexture,gt),Ce.setOptional(O,X,"batchingColorTexture"),X._colorsTexture!==null&&Ce.setValue(O,"batchingColorTexture",X._colorsTexture,gt));const En=K.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&xt.update(X,K,vn),(xn||Jt.receiveShadow!==X.receiveShadow)&&(Jt.receiveShadow=X.receiveShadow,Ce.setValue(O,"receiveShadow",X.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Tn.envMap.value=Ht,Tn.flipEnvMap.value=Ht.isCubeTexture&&Ht.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&W.environment!==null&&(Tn.envMapIntensity.value=W.environmentIntensity),xn&&(Ce.setValue(O,"toneMappingExposure",_.toneMappingExposure),Jt.needsLights&&ea(Tn,hr),Mt&&Q.fog===!0&&rt.refreshFogUniforms(Tn,Mt),rt.refreshMaterialUniforms(Tn,Q,H,G,f.state.transmissionRenderTarget[C.id]),Ja.upload(O,fi(Jt),Tn,gt)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Ja.upload(O,fi(Jt),Tn,gt),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Ce.setValue(O,"center",X.center),Ce.setValue(O,"modelViewMatrix",X.modelViewMatrix),Ce.setValue(O,"normalMatrix",X.normalMatrix),Ce.setValue(O,"modelMatrix",X.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const rn=Q.uniformsGroups;for(let pn=0,Io=rn.length;pn<Io;pn++){const Yi=rn[pn];Ot.update(Yi,vn),Ot.bind(Yi,vn)}}return vn}function ea(C,W){C.ambientLightColor.needsUpdate=W,C.lightProbe.needsUpdate=W,C.directionalLights.needsUpdate=W,C.directionalLightShadows.needsUpdate=W,C.pointLights.needsUpdate=W,C.pointLightShadows.needsUpdate=W,C.spotLights.needsUpdate=W,C.spotLightShadows.needsUpdate=W,C.rectAreaLights.needsUpdate=W,C.hemisphereLights.needsUpdate=W}function xf(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,W,K){const Q=lt.get(C);Q.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),lt.get(C.texture).__webglTexture=W,lt.get(C.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:K,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,W){const K=lt.get(C);K.__webglFramebuffer=W,K.__useDefaultFramebuffer=W===void 0};const _f=O.createFramebuffer();this.setRenderTarget=function(C,W=0,K=0){T=C,b=W,A=K;let Q=!0,X=null,Mt=!1,Ut=!1;if(C){const Ht=lt.get(C);if(Ht.__useDefaultFramebuffer!==void 0)q.bindFramebuffer(O.FRAMEBUFFER,null),Q=!1;else if(Ht.__webglFramebuffer===void 0)gt.setupRenderTarget(C);else if(Ht.__hasExternalTextures)gt.rebindTextures(C,lt.get(C.texture).__webglTexture,lt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Zt=C.depthTexture;if(Ht.__boundDepthTexture!==Zt){if(Zt!==null&&lt.has(Zt)&&(C.width!==Zt.image.width||C.height!==Zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(C)}}const jt=C.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Ut=!0);const Qt=lt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Qt[W])?X=Qt[W][K]:X=Qt[W],Mt=!0):C.samples>0&&gt.useMultisampledRTT(C)===!1?X=lt.get(C).__webglMultisampledFramebuffer:Array.isArray(Qt)?X=Qt[K]:X=Qt,R.copy(C.viewport),L.copy(C.scissor),I=C.scissorTest}else R.copy(nt).multiplyScalar(H).floor(),L.copy(bt).multiplyScalar(H).floor(),I=Dt;if(K!==0&&(X=_f),q.bindFramebuffer(O.FRAMEBUFFER,X)&&Q&&q.drawBuffers(C,X),q.viewport(R),q.scissor(L),q.setScissorTest(I),Mt){const Ht=lt.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,Ht.__webglTexture,K)}else if(Ut){const Ht=W;for(let jt=0;jt<C.textures.length;jt++){const Qt=lt.get(C.textures[jt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+jt,Qt.__webglTexture,K,Ht)}}else if(C!==null&&K!==0){const Ht=lt.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ht.__webglTexture,K)}M=-1},this.readRenderTargetPixels=function(C,W,K,Q,X,Mt,Ut,Xt=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=lt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ut!==void 0&&(Ht=Ht[Ut]),Ht){q.bindFramebuffer(O.FRAMEBUFFER,Ht);try{const jt=C.textures[Xt],Qt=jt.format,Zt=jt.type;if(!it.textureFormatReadable(Qt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=C.width-Q&&K>=0&&K<=C.height-X&&(C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Xt),O.readPixels(W,K,Q,X,Tt.convert(Qt),Tt.convert(Zt),Mt))}finally{const jt=T!==null?lt.get(T).__webglFramebuffer:null;q.bindFramebuffer(O.FRAMEBUFFER,jt)}}},this.readRenderTargetPixelsAsync=async function(C,W,K,Q,X,Mt,Ut,Xt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ht=lt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ut!==void 0&&(Ht=Ht[Ut]),Ht)if(W>=0&&W<=C.width-Q&&K>=0&&K<=C.height-X){q.bindFramebuffer(O.FRAMEBUFFER,Ht);const jt=C.textures[Xt],Qt=jt.format,Zt=jt.type;if(!it.textureFormatReadable(Qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ce=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,ce),O.bufferData(O.PIXEL_PACK_BUFFER,Mt.byteLength,O.STREAM_READ),C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Xt),O.readPixels(W,K,Q,X,Tt.convert(Qt),Tt.convert(Zt),0);const _e=T!==null?lt.get(T).__webglFramebuffer:null;q.bindFramebuffer(O.FRAMEBUFFER,_e);const Ue=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await p0(O,Ue,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,ce),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Mt),O.deleteBuffer(ce),O.deleteSync(Ue),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,W=null,K=0){const Q=Math.pow(2,-K),X=Math.floor(C.image.width*Q),Mt=Math.floor(C.image.height*Q),Ut=W!==null?W.x:0,Xt=W!==null?W.y:0;gt.setTexture2D(C,0),O.copyTexSubImage2D(O.TEXTURE_2D,K,0,0,Ut,Xt,X,Mt),q.unbindTexture()};const yf=O.createFramebuffer(),Mf=O.createFramebuffer();this.copyTextureToTexture=function(C,W,K=null,Q=null,X=0,Mt=null){Mt===null&&(X!==0?(Vr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Mt=X,X=0):Mt=0);let Ut,Xt,Ht,jt,Qt,Zt,ce,_e,Ue;const we=C.isCompressedTexture?C.mipmaps[Mt]:C.image;if(K!==null)Ut=K.max.x-K.min.x,Xt=K.max.y-K.min.y,Ht=K.isBox3?K.max.z-K.min.z:1,jt=K.min.x,Qt=K.min.y,Zt=K.isBox3?K.min.z:0;else{const En=Math.pow(2,-X);Ut=Math.floor(we.width*En),Xt=Math.floor(we.height*En),C.isDataArrayTexture?Ht=we.depth:C.isData3DTexture?Ht=Math.floor(we.depth*En):Ht=1,jt=0,Qt=0,Zt=0}Q!==null?(ce=Q.x,_e=Q.y,Ue=Q.z):(ce=0,_e=0,Ue=0);const Se=Tt.convert(W.format),Jt=Tt.convert(W.type);let Re;W.isData3DTexture?(gt.setTexture3D(W,0),Re=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(gt.setTexture2DArray(W,0),Re=O.TEXTURE_2D_ARRAY):(gt.setTexture2D(W,0),Re=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const me=O.getParameter(O.UNPACK_ROW_LENGTH),vn=O.getParameter(O.UNPACK_IMAGE_HEIGHT),ys=O.getParameter(O.UNPACK_SKIP_PIXELS),xn=O.getParameter(O.UNPACK_SKIP_ROWS),hr=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,we.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,we.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,jt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Qt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Zt);const Ce=C.isDataArrayTexture||C.isData3DTexture,Tn=W.isDataArrayTexture||W.isData3DTexture;if(C.isDepthTexture){const En=lt.get(C),rn=lt.get(W),pn=lt.get(En.__renderTarget),Io=lt.get(rn.__renderTarget);q.bindFramebuffer(O.READ_FRAMEBUFFER,pn.__webglFramebuffer),q.bindFramebuffer(O.DRAW_FRAMEBUFFER,Io.__webglFramebuffer);for(let Yi=0;Yi<Ht;Yi++)Ce&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,lt.get(C).__webglTexture,X,Zt+Yi),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,lt.get(W).__webglTexture,Mt,Ue+Yi)),O.blitFramebuffer(jt,Qt,Ut,Xt,ce,_e,Ut,Xt,O.DEPTH_BUFFER_BIT,O.NEAREST);q.bindFramebuffer(O.READ_FRAMEBUFFER,null),q.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(X!==0||C.isRenderTargetTexture||lt.has(C)){const En=lt.get(C),rn=lt.get(W);q.bindFramebuffer(O.READ_FRAMEBUFFER,yf),q.bindFramebuffer(O.DRAW_FRAMEBUFFER,Mf);for(let pn=0;pn<Ht;pn++)Ce?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,En.__webglTexture,X,Zt+pn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,En.__webglTexture,X),Tn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,rn.__webglTexture,Mt,Ue+pn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,rn.__webglTexture,Mt),X!==0?O.blitFramebuffer(jt,Qt,Ut,Xt,ce,_e,Ut,Xt,O.COLOR_BUFFER_BIT,O.NEAREST):Tn?O.copyTexSubImage3D(Re,Mt,ce,_e,Ue+pn,jt,Qt,Ut,Xt):O.copyTexSubImage2D(Re,Mt,ce,_e,jt,Qt,Ut,Xt);q.bindFramebuffer(O.READ_FRAMEBUFFER,null),q.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Tn?C.isDataTexture||C.isData3DTexture?O.texSubImage3D(Re,Mt,ce,_e,Ue,Ut,Xt,Ht,Se,Jt,we.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(Re,Mt,ce,_e,Ue,Ut,Xt,Ht,Se,we.data):O.texSubImage3D(Re,Mt,ce,_e,Ue,Ut,Xt,Ht,Se,Jt,we):C.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Mt,ce,_e,Ut,Xt,Se,Jt,we.data):C.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Mt,ce,_e,we.width,we.height,Se,we.data):O.texSubImage2D(O.TEXTURE_2D,Mt,ce,_e,Ut,Xt,Se,Jt,we);O.pixelStorei(O.UNPACK_ROW_LENGTH,me),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,vn),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ys),O.pixelStorei(O.UNPACK_SKIP_ROWS,xn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,hr),Mt===0&&W.generateMipmaps&&O.generateMipmap(Re),q.unbindTexture()},this.initRenderTarget=function(C){lt.get(C).__webglFramebuffer===void 0&&gt.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?gt.setTextureCube(C,0):C.isData3DTexture?gt.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?gt.setTexture2DArray(C,0):gt.setTexture2D(C,0),q.unbindTexture()},this.resetState=function(){b=0,A=0,T=null,q.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=pe._getDrawingBufferColorSpace(t),e.unpackColorSpace=pe._getUnpackColorSpace()}}const _x=.85,pl=i=>i*i*(3-2*i);function mu(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=pl(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*pl(e),veil:.82+.14*pl(Math.min(1,e/.5)),ready:e===1}}const Wd=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function Xd(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class ar{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const yx=new Jc(-1,1,1,-1,0,1);class Mx extends De{constructor(){super(),this.setAttribute("position",new le([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new le([0,2,0,0,2,0],2))}}const Sx=new Mx;class jc{constructor(t){this._mesh=new Yt(Sx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,yx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const Ua={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class qd extends ar{constructor(){super(),this.uniforms=hs.clone(Ua.uniforms),this.material=new bp({name:Ua.name,uniforms:this.uniforms,vertexShader:Ua.vertexShader,fragmentShader:Ua.fragmentShader}),this._fsQuad=new jc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},pe.getTransfer(this._outputColorSpace)===ve&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ed?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===nd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===id?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Lc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===rd?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ad?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===sd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const jn={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},ao={min:.85,max:1.35};function bx(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function gu(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,d=t.height*c*.5,m=Math.max(i.x,.001),u=Math.max(i.y,.001),p=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,v=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(m+p*i.z/s),d/(u+v*i.z/s))}function wx(i,t){if(!jn[i])throw Error("unknown item");if(t==="front")return[...jn[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(jn[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=jn[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class Tx extends lc{constructor(){super();const t=new $n;t.deleteAttribute("uv");const e=new Lt({side:sn}),n=new Lt,s=new ro(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Yt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new B0(t,n,6),o=new ke;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new Yt(t,Hs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Yt(t,Hs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Yt(t,Hs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const d=new Yt(t,Hs(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);const m=new Yt(t,Hs(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const u=new Yt(t,Hs(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Hs(i){return new Tp({color:0,emissive:16777215,emissiveIntensity:i})}function Yd(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new De;let c=0;for(let h=0;h<i.length;++h){const d=i[h];let m=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in d.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(d.attributes[u]),m++}if(m!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in d.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(d.morphAttributes[u])}if(t){let u;if(e)u=d.index.count;else if(d.attributes.position!==void 0)u=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(e){let h=0;const d=[];for(let m=0;m<i.length;++m){const u=i[m].index;for(let p=0;p<u.count;++p)d.push(u.getX(p)+h);h+=i[m].attributes.position.count}l.setIndex(d)}for(const h in r){const d=vu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(const h in a){const d=a[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let m=0;m<d;++m){const u=[];for(let v=0;v<a[h].length;++v)u.push(a[h][v][m]);const p=vu(u);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}return l}function vu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Be(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const d=l/e;for(let m=0,u=h.count;m<u;m++)for(let p=0;p<e;p++){const v=h.getComponent(m,p);o.setComponent(m+d,p,v)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function ui(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function fe(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,ui(),e);const s=new X0(n);return s.colorSpace=$e,s.anisotropy=8,s}function vc(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return fe((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function dn(i,t,e,n=ui(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function To(i){const t=fe((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=Wi,t}const $d=To("paper"),Zd=To("leather"),Er=To("metal"),xu=To("cloth"),Ar=Er.clone();Ar.colorSpace=Sn;const xc=Zd.clone();xc.colorSpace=Sn;const Ka=$d.clone();Ka.colorSpace=Sn;const Ex=fe((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),U={black:new Lt({color:1646879,roughness:.42,metalness:.38,map:Er,bumpMap:Ar,bumpScale:.004}),leather:new Lt({color:6712935,map:Zd,roughness:.78,bumpMap:xc,bumpScale:.01}),silver:new Lt({color:12239550,map:Er,roughnessMap:Ar,roughness:.35,metalness:.93,bumpMap:Ar,bumpScale:.003}),gold:new Lt({color:12427627,map:Er,roughness:.29,metalness:.88,bumpMap:Ar,bumpScale:.003}),bronze:new Lt({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new Vs({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:Ka,bumpScale:4e-4}),blue:new Vs({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new Vs({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new Lt({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new Vs({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new Lt({color:14799534,map:$d,roughness:.96,bumpMap:Ka,bumpScale:.006,side:ze}),red:new Lt({color:7152936,map:xu,roughness:.82,bumpMap:xu,bumpScale:.009}),rust:new Lt({map:Ex,roughness:.92,metalness:.08,bumpMap:Ka,bumpScale:.022}),rubber:new Lt({color:1383192,roughness:.88,bumpMap:xc,bumpScale:.008}),copper:new Lt({color:12089158,map:Er,roughness:.37,metalness:.9})},ml=new Map;let Jd=[];function ja(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(ml.has(n))return ml.get(n);let s;Jd.push(new Promise(a=>s=a));const r=new Od().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?Sn:$e,r.wrapS=r.wrapT=Wi,r.repeat.set(...t),r.anisotropy=8,ml.set(n,r),r}function Ax(){return Promise.all(Jd)}function _u(i,t=[1,1]){return{map:ja(`${i}.jpg`,{repeat:t}),normalMap:ja(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:ja(`${i}-roughness.png`,{repeat:t,data:!0})}}function Kd(){return fe((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const Qa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Rx extends ar{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof hn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=hs.clone(t.uniforms),this.material=new hn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new jc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class yu extends ar{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Cx extends ar{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Px{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new dt);this._width=n.width,this._height=n.height,e=new wn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:li}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Rx(Qa),this.copyPass.material.blending=ln,this.clock=new Up}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}yu!==void 0&&(a instanceof yu?n=!0:a instanceof Cx&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new dt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ix extends ar{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new $t}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class Lx{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,d=(l+c)*h,m=l-d,u=c-d,p=t-m,v=e-u;let g,f;p>v?(g=1,f=0):(g=0,f=1);const x=p-g+h,y=v-f+h,_=p-1+2*h,E=v-1+2*h,b=l&255,A=c&255,T=this.perm[b+this.perm[A]]%12,M=this.perm[b+g+this.perm[A+f]]%12,S=this.perm[b+1+this.perm[A+1]]%12;let R=.5-p*p-v*v;R<0?n=0:(R*=R,n=R*R*this._dot(this.grad3[T],p,v));let L=.5-x*x-y*y;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[M],x,y));let I=.5-_*_-E*E;return I<0?r=0:(I*=I,r=I*I*this._dot(this.grad3[S],_,E)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),d=Math.floor(e+c),m=Math.floor(n+c),u=1/6,p=(h+d+m)*u,v=h-p,g=d-p,f=m-p,x=t-v,y=e-g,_=n-f;let E,b,A,T,M,S;x>=y?y>=_?(E=1,b=0,A=0,T=1,M=1,S=0):x>=_?(E=1,b=0,A=0,T=1,M=0,S=1):(E=0,b=0,A=1,T=1,M=0,S=1):y<_?(E=0,b=0,A=1,T=0,M=1,S=1):x<_?(E=0,b=1,A=0,T=0,M=1,S=1):(E=0,b=1,A=0,T=1,M=1,S=0);const R=x-E+u,L=y-b+u,I=_-A+u,N=x-T+2*u,F=y-M+2*u,z=_-S+2*u,G=x-1+3*u,H=y-1+3*u,Z=_-1+3*u,tt=h&255,nt=d&255,bt=m&255,Dt=this.perm[tt+this.perm[nt+this.perm[bt]]]%12,kt=this.perm[tt+E+this.perm[nt+b+this.perm[bt+A]]]%12,qt=this.perm[tt+T+this.perm[nt+M+this.perm[bt+S]]]%12,J=this.perm[tt+1+this.perm[nt+1+this.perm[bt+1]]]%12;let et=.6-x*x-y*y-_*_;et<0?s=0:(et*=et,s=et*et*this._dot3(this.grad3[Dt],x,y,_));let _t=.6-R*R-L*L-I*I;_t<0?r=0:(_t*=_t,r=_t*_t*this._dot3(this.grad3[kt],R,L,I));let yt=.6-N*N-F*F-z*z;yt<0?a=0:(yt*=yt,a=yt*yt*this._dot3(this.grad3[qt],N,F,z));let St=.6-G*G-H*H-Z*Z;return St<0?o=0:(St*=St,o=St*St*this._dot3(this.grad3[J],G,H,Z)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,d,m,u,p;const v=(t+e+n+s)*l,g=Math.floor(t+v),f=Math.floor(e+v),x=Math.floor(n+v),y=Math.floor(s+v),_=(g+f+x+y)*c,E=g-_,b=f-_,A=x-_,T=y-_,M=t-E,S=e-b,R=n-A,L=s-T,I=M>S?32:0,N=M>R?16:0,F=S>R?8:0,z=M>L?4:0,G=S>L?2:0,H=R>L?1:0,Z=I+N+F+z+G+H,tt=a[Z][0]>=3?1:0,nt=a[Z][1]>=3?1:0,bt=a[Z][2]>=3?1:0,Dt=a[Z][3]>=3?1:0,kt=a[Z][0]>=2?1:0,qt=a[Z][1]>=2?1:0,J=a[Z][2]>=2?1:0,et=a[Z][3]>=2?1:0,_t=a[Z][0]>=1?1:0,yt=a[Z][1]>=1?1:0,St=a[Z][2]>=1?1:0,Wt=a[Z][3]>=1?1:0,Kt=M-tt+c,O=S-nt+c,ot=R-bt+c,st=L-Dt+c,it=M-kt+2*c,q=S-qt+2*c,ht=R-J+2*c,lt=L-et+2*c,gt=M-_t+3*c,Vt=S-yt+3*c,Gt=R-St+3*c,P=L-Wt+3*c,w=M-1+4*c,V=S-1+4*c,Y=R-1+4*c,rt=L-1+4*c,$=g&255,Rt=f&255,ft=x&255,Nt=y&255,Bt=o[$+o[Rt+o[ft+o[Nt]]]]%32,xt=o[$+tt+o[Rt+nt+o[ft+bt+o[Nt+Dt]]]]%32,Ct=o[$+kt+o[Rt+qt+o[ft+J+o[Nt+et]]]]%32,wt=o[$+_t+o[Rt+yt+o[ft+St+o[Nt+Wt]]]]%32,Tt=o[$+1+o[Rt+1+o[ft+1+o[Nt+1]]]]%32;let pt=.6-M*M-S*S-R*R-L*L;pt<0?h=0:(pt*=pt,h=pt*pt*this._dot4(r[Bt],M,S,R,L));let Ot=.6-Kt*Kt-O*O-ot*ot-st*st;Ot<0?d=0:(Ot*=Ot,d=Ot*Ot*this._dot4(r[xt],Kt,O,ot,st));let k=.6-it*it-q*q-ht*ht-lt*lt;k<0?m=0:(k*=k,m=k*k*this._dot4(r[Ct],it,q,ht,lt));let ct=.6-gt*gt-Vt*Vt-Gt*Gt-P*P;ct<0?u=0:(ct*=ct,u=ct*ct*this._dot4(r[wt],gt,Vt,Gt,P));let mt=.6-w*w-V*V-Y*Y-rt*rt;return mt<0?p=0:(mt*=mt,p=mt*mt*this._dot4(r[Tt],w,V,Y,rt)),27*(h+d+m+u+p)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const Na={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new dt},cameraProjectionMatrix:{value:new he},cameraInverseProjectionMatrix:{value:new he},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

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

		}`},Fa={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

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

		}`},Oa={uniforms:{tDiffuse:{value:null},resolution:{value:new dt}},vertexShader:`varying vec2 vUv;

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

		}`};class ki extends ar{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new Xc;a.format=Ks,a.type=Js,this.normalRenderTarget=new wn(this.width,this.height,{minFilter:un,magFilter:un,type:li,depthTexture:a}),this.ssaoRenderTarget=new wn(this.width,this.height,{type:li}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new hn({defines:Object.assign({},Na.defines),uniforms:hs.clone(Na.uniforms),vertexShader:Na.vertexShader,fragmentShader:Na.fragmentShader,blending:ln}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new wp,this.normalMaterial.blending=ln,this.blurMaterial=new hn({defines:Object.assign({},Oa.defines),uniforms:hs.clone(Oa.uniforms),vertexShader:Oa.vertexShader,fragmentShader:Oa.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new hn({defines:Object.assign({},Fa.defines),uniforms:hs.clone(Fa.uniforms),vertexShader:Fa.vertexShader,fragmentShader:Fa.fragmentShader,blending:ln}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new hn({uniforms:hs.clone(Qa.uniforms),vertexShader:Qa.vertexShader,fragmentShader:Qa.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:td,blendDst:yl,blendEquation:Ai,blendSrcAlpha:Qu,blendDstAlpha:yl,blendEquationAlpha:Ai}),this._fsQuad=new jc(null),this._originalClearColor=new $t}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case ki.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=ln,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=ln,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=ln,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=ju,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new D;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=ye.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new Lx,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new Td(r,4,4,xo,Wn),this.noiseTexture.wrapS=Wi,this.noiseTexture.wrapT=Wi,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}ki.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class Dx extends ki{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class Ux{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new wn(1,1,{type:li,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new Px(t,r),this.composer.addPass(new Ix(e,n)),this.ao=new Dx(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new qd),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function Nx(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const Mr=new D;function Rn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Mr.copy(t),Mr[n]=0,Mr.normalize();const c=.5*a/(a+o),h=1-Mr.angleTo(i)/l;return Math.sign(Mr[e])===1?h*c:o/(a+o)+c+c*(1-h)}class Qc extends $n{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new D,c=new D,h=new D(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,m=this.attributes.normal.array,u=this.attributes.uv.array,p=d.length/6,v=new D,g=.5/a;for(let f=0,x=0;f<d.length;f+=3,x+=2)switch(l.fromArray(d,f),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),d[f+0]=h.x*Math.sign(l.x)+c.x*r,d[f+1]=h.y*Math.sign(l.y)+c.y*r,d[f+2]=h.z*Math.sign(l.z)+c.z*r,m[f+0]=c.x,m[f+1]=c.y,m[f+2]=c.z,Math.floor(f/p)){case 0:v.set(1,0,0),u[x+0]=Rn(v,c,"z","y",r,n),u[x+1]=1-Rn(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),u[x+0]=1-Rn(v,c,"z","y",r,n),u[x+1]=1-Rn(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),u[x+0]=1-Rn(v,c,"x","z",r,t),u[x+1]=Rn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),u[x+0]=1-Rn(v,c,"x","z",r,t),u[x+1]=1-Rn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),u[x+0]=1-Rn(v,c,"x","y",r,t),u[x+1]=1-Rn(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),u[x+0]=Rn(v,c,"x","y",r,t),u[x+1]=1-Rn(v,c,"y","x",r,e);break}}static fromJSON(t){return new Qc(t.width,t.height,t.depth,t.segments,t.radius)}}class Fx extends Yt{constructor(t,e,n=!1,s=!1,r=1e4){const a=new De;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(x){this.resolution=x,this.isolation=80,this.size=x,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=r*3;this.positionArray=new Float32Array(y*3);const _=new Be(this.positionArray,3);_.setUsage(ia),a.setAttribute("position",_),this.normalArray=new Float32Array(y*3);const E=new Be(this.normalArray,3);if(E.setUsage(ia),a.setAttribute("normal",E),this.enableUvs){this.uvArray=new Float32Array(y*2);const b=new Be(this.uvArray,2);b.setUsage(ia),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const b=new Be(this.colorArray,3);b.setUsage(ia),a.setAttribute("color",b)}a.boundingSphere=new vs(new D,1)};function d(x,y,_){return x+(y-x)*_}function m(x,y,_,E,b,A,T,M,S,R){const L=(_-T)/(M-T),I=o.normal_cache;l[y+0]=E+L*o.delta,l[y+1]=b,l[y+2]=A,c[y+0]=d(I[x+0],I[x+3],L),c[y+1]=d(I[x+1],I[x+4],L),c[y+2]=d(I[x+2],I[x+5],L),h[y+0]=d(o.palette[S*3+0],o.palette[R*3+0],L),h[y+1]=d(o.palette[S*3+1],o.palette[R*3+1],L),h[y+2]=d(o.palette[S*3+2],o.palette[R*3+2],L)}function u(x,y,_,E,b,A,T,M,S,R){const L=(_-T)/(M-T),I=o.normal_cache;l[y+0]=E,l[y+1]=b+L*o.delta,l[y+2]=A;const N=x+o.yd*3;c[y+0]=d(I[x+0],I[N+0],L),c[y+1]=d(I[x+1],I[N+1],L),c[y+2]=d(I[x+2],I[N+2],L),h[y+0]=d(o.palette[S*3+0],o.palette[R*3+0],L),h[y+1]=d(o.palette[S*3+1],o.palette[R*3+1],L),h[y+2]=d(o.palette[S*3+2],o.palette[R*3+2],L)}function p(x,y,_,E,b,A,T,M,S,R){const L=(_-T)/(M-T),I=o.normal_cache;l[y+0]=E,l[y+1]=b,l[y+2]=A+L*o.delta;const N=x+o.zd*3;c[y+0]=d(I[x+0],I[N+0],L),c[y+1]=d(I[x+1],I[N+1],L),c[y+2]=d(I[x+2],I[N+2],L),h[y+0]=d(o.palette[S*3+0],o.palette[R*3+0],L),h[y+1]=d(o.palette[S*3+1],o.palette[R*3+1],L),h[y+2]=d(o.palette[S*3+2],o.palette[R*3+2],L)}function v(x){const y=x*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[x-1]-o.field[x+1],o.normal_cache[y+1]=o.field[x-o.yd]-o.field[x+o.yd],o.normal_cache[y+2]=o.field[x-o.zd]-o.field[x+o.zd])}function g(x,y,_,E,b){const A=E+1,T=E+o.yd,M=E+o.zd,S=A+o.yd,R=A+o.zd,L=E+o.yd+o.zd,I=A+o.yd+o.zd;let N=0;const F=o.field[E],z=o.field[A],G=o.field[T],H=o.field[S],Z=o.field[M],tt=o.field[R],nt=o.field[L],bt=o.field[I];F<b&&(N|=1),z<b&&(N|=2),G<b&&(N|=8),H<b&&(N|=4),Z<b&&(N|=16),tt<b&&(N|=32),nt<b&&(N|=128),bt<b&&(N|=64);const Dt=Ox[N];if(Dt===0)return 0;const kt=o.delta,qt=x+kt,J=y+kt,et=_+kt;Dt&1&&(v(E),v(A),m(E*3,0,b,x,y,_,F,z,E,A)),Dt&2&&(v(A),v(S),u(A*3,3,b,qt,y,_,z,H,A,S)),Dt&4&&(v(T),v(S),m(T*3,6,b,x,J,_,G,H,T,S)),Dt&8&&(v(E),v(T),u(E*3,9,b,x,y,_,F,G,E,T)),Dt&16&&(v(M),v(R),m(M*3,12,b,x,y,et,Z,tt,M,R)),Dt&32&&(v(R),v(I),u(R*3,15,b,qt,y,et,tt,bt,R,I)),Dt&64&&(v(L),v(I),m(L*3,18,b,x,J,et,nt,bt,L,I)),Dt&128&&(v(M),v(L),u(M*3,21,b,x,y,et,Z,nt,M,L)),Dt&256&&(v(E),v(M),p(E*3,24,b,x,y,_,F,Z,E,M)),Dt&512&&(v(A),v(R),p(A*3,27,b,qt,y,_,z,tt,A,R)),Dt&1024&&(v(S),v(I),p(S*3,30,b,qt,J,_,H,bt,S,I)),Dt&2048&&(v(T),v(L),p(T*3,33,b,x,J,_,G,nt,T,L)),N<<=4;let _t,yt,St,Wt=0,Kt=0;for(;za[N+Kt]!=-1;)_t=N+Kt,yt=_t+1,St=_t+2,f(l,c,h,3*za[_t],3*za[yt],3*za[St]),Kt+=3,Wt++;return Wt}function f(x,y,_,E,b,A){const T=o.count*3;if(o.positionArray[T+0]=x[E],o.positionArray[T+1]=x[E+1],o.positionArray[T+2]=x[E+2],o.positionArray[T+3]=x[b],o.positionArray[T+4]=x[b+1],o.positionArray[T+5]=x[b+2],o.positionArray[T+6]=x[A],o.positionArray[T+7]=x[A+1],o.positionArray[T+8]=x[A+2],o.material.flatShading===!0){const M=(y[E+0]+y[b+0]+y[A+0])/3,S=(y[E+1]+y[b+1]+y[A+1])/3,R=(y[E+2]+y[b+2]+y[A+2])/3;o.normalArray[T+0]=M,o.normalArray[T+1]=S,o.normalArray[T+2]=R,o.normalArray[T+3]=M,o.normalArray[T+4]=S,o.normalArray[T+5]=R,o.normalArray[T+6]=M,o.normalArray[T+7]=S,o.normalArray[T+8]=R}else o.normalArray[T+0]=y[E+0],o.normalArray[T+1]=y[E+1],o.normalArray[T+2]=y[E+2],o.normalArray[T+3]=y[b+0],o.normalArray[T+4]=y[b+1],o.normalArray[T+5]=y[b+2],o.normalArray[T+6]=y[A+0],o.normalArray[T+7]=y[A+1],o.normalArray[T+8]=y[A+2];if(o.enableUvs){const M=o.count*2;o.uvArray[M+0]=x[E+0],o.uvArray[M+1]=x[E+2],o.uvArray[M+2]=x[b+0],o.uvArray[M+3]=x[b+2],o.uvArray[M+4]=x[A+0],o.uvArray[M+5]=x[A+2]}o.enableColors&&(o.colorArray[T+0]=_[E+0],o.colorArray[T+1]=_[E+1],o.colorArray[T+2]=_[E+2],o.colorArray[T+3]=_[b+0],o.colorArray[T+4]=_[b+1],o.colorArray[T+5]=_[b+2],o.colorArray[T+6]=_[A+0],o.colorArray[T+7]=_[A+1],o.colorArray[T+8]=_[A+2]),o.count+=3}this.addBall=function(x,y,_,E,b,A){const T=Math.sign(E);E=Math.abs(E);const M=A!=null;let S=new $t(x,y,_);if(M)try{S=A instanceof $t?A:Array.isArray(A)?new $t(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new $t(A)}catch{S=new $t(x,y,_)}const R=this.size*Math.sqrt(E/b),L=_*this.size,I=y*this.size,N=x*this.size;let F=Math.floor(L-R);F<1&&(F=1);let z=Math.floor(L+R);z>this.size-1&&(z=this.size-1);let G=Math.floor(I-R);G<1&&(G=1);let H=Math.floor(I+R);H>this.size-1&&(H=this.size-1);let Z=Math.floor(N-R);Z<1&&(Z=1);let tt=Math.floor(N+R);tt>this.size-1&&(tt=this.size-1);let nt,bt,Dt,kt,qt,J,et,_t,yt,St,Wt;for(Dt=F;Dt<z;Dt++)for(qt=this.size2*Dt,_t=Dt/this.size-_,yt=_t*_t,bt=G;bt<H;bt++)for(kt=qt+this.size*bt,et=bt/this.size-y,St=et*et,nt=Z;nt<tt;nt++)if(J=nt/this.size-x,Wt=E/(1e-6+J*J+St+yt)-b,Wt>0){this.field[kt+nt]+=Wt*T;const Kt=Math.sqrt((nt-N)*(nt-N)+(bt-I)*(bt-I)+(Dt-L)*(Dt-L))/R,O=1-Kt*Kt*Kt*(Kt*(Kt*6-15)+10);this.palette[(kt+nt)*3+0]+=S.r*O,this.palette[(kt+nt)*3+1]+=S.g*O,this.palette[(kt+nt)*3+2]+=S.b*O}},this.addPlaneX=function(x,y){const _=this.size,E=this.yd,b=this.zd,A=this.field;let T,M,S,R,L,I,N,F=_*Math.sqrt(x/y);for(F>_&&(F=_),T=0;T<F;T++)if(I=T/_,R=I*I,L=x/(1e-4+R)-y,L>0)for(M=0;M<_;M++)for(N=T+M*E,S=0;S<_;S++)A[b*S+N]+=L},this.addPlaneY=function(x,y){const _=this.size,E=this.yd,b=this.zd,A=this.field;let T,M,S,R,L,I,N,F,z=_*Math.sqrt(x/y);for(z>_&&(z=_),M=0;M<z;M++)if(I=M/_,R=I*I,L=x/(1e-4+R)-y,L>0)for(N=M*E,T=0;T<_;T++)for(F=N+T,S=0;S<_;S++)A[b*S+F]+=L},this.addPlaneZ=function(x,y){const _=this.size,E=this.yd,b=this.zd,A=this.field;let T,M,S,R,L,I,N,F,z=_*Math.sqrt(x/y);for(z>_&&(z=_),S=0;S<z;S++)if(I=S/_,R=I*I,L=x/(1e-4+R)-y,L>0)for(N=b*S,M=0;M<_;M++)for(F=N+M*E,T=0;T<_;T++)A[F+T]+=L},this.setCell=function(x,y,_,E){const b=this.size2*_+this.size*y+x;this.field[b]=E},this.getCell=function(x,y,_){const E=this.size2*_+this.size*y+x;return this.field[E]},this.blur=function(x=1){const y=this.field,_=y.slice(),E=this.size,b=this.size2;for(let A=0;A<E;A++)for(let T=0;T<E;T++)for(let M=0;M<E;M++){const S=b*M+E*T+A;let R=_[S],L=1;for(let I=-1;I<=1;I+=2){const N=I+A;if(!(N<0||N>=E))for(let F=-1;F<=1;F+=2){const z=F+T;if(!(z<0||z>=E))for(let G=-1;G<=1;G+=2){const H=G+M;if(H<0||H>=E)continue;const Z=b*H+E*z+N,tt=_[Z];L++,R+=x*(tt-R)/L}}}y[S]=R}},this.reset=function(){for(let x=0;x<this.size3;x++)this.normal_cache[x*3]=0,this.field[x]=0,this.palette[x*3]=this.palette[x*3+1]=this.palette[x*3+2]=0},this.update=function(){this.count=0;const x=this.size-2;for(let y=1;y<x;y++){const _=this.size2*y,E=(y-this.halfsize)/this.halfsize;for(let b=1;b<x;b++){const A=_+this.size*b,T=(b-this.halfsize)/this.halfsize;for(let M=1;M<x;M++){const S=(M-this.halfsize)/this.halfsize,R=A+M;g(S,T,E,R,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Ox=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),za=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function jd(i,t,e=44){const n=new Fx(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,d=a/e*2-1;let m=10;for(const[u,p,v,g,f,x,y=0]of i){const _=Math.cos(y),E=Math.sin(y),b=c-u,A=h-p,T=d-v,M=_*b+E*A,S=-E*b+_*A,R=Math.hypot(M/g,S/f,T/x),L=Math.hypot(M/(g*g),S/(f*f),T/(x*x)),I=L>1e-6?R*(R-1)/L:-Math.min(g,f,x),N=.085,F=Math.max(N-Math.abs(m-I),0)/N;m=Math.min(m,I)-F*F*F*N/6}n.field[a*e*e+o*e+l]=-m}n.update();const s=n.geometry.drawRange.count,r=new De;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Be(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const je=Math.PI*2;let th=1;function Mu(i){th=Math.max(.24,Math.min(1,i))||1}const Yr=(i,t=4)=>Math.max(t,Math.round(i*th));function It(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new Yt(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function B(i,t,e,n=U.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return It(s?new Qc(...t,th<.8?1:2,a):new $n(...t),n,i,e,r)}function Ft(i,t,e,n,s,r=U.silver,a=[Math.PI/2,0,0],o=48){return It(new Ee(t,e,n,Yr(o,6)),r,i,s,a)}function Vi(i,t,e,n=U.cream){const s=It(new Pe(1,Yr(32,8),Yr(24,6)),n,i,e);return s.scale.set(...t),s}function be(i,t,e,n,s=U.gold,r=[0,0,0],a=je){return It(new er(t,e,Yr(8,4),Yr(64,8),a),s,i,n,r)}function Dn(i,t,e,n=U.gold,s=30){return It(new si(new fs(t.map(r=>new D(...r))),s,e,8,!1),n,i)}function ms(i,t,e,n=[0,0,0],s=64){return It(new So(t.map(r=>new dt(...r)),s),e,i,n)}function oo(i,t,e,n,s=.022,r=U.silver){Ft(i,s,s,s*.35,[t,e,n],r,void 0,16),B(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],U.black,.001,[0,0,(t+e)*7])}function Yn(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=fe((c,h,d)=>s(c,h,o,d),768,o);return It(new ue(t,e),new Lt({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function We(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return Yn(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function Eo(i,t,e,n){const s=fe((r,a,o)=>n(r,a,o),1024);return It(new Xi(t,80),new Je({map:s,toneMapped:!1}),i,[0,0,e])}function eh(i,t,e,n,s=U.clear){const r=It(new Pe(1,48,20,0,je,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function lo(i,t,e,n,s=48,r=U.silver,a="z"){for(let o=0;o<s;o++){const l=o*je/s;a==="z"?B(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):B(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function nr(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return It(new yo(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function Su(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function zx(i){B(i,[1.65,.92,.49],[0,0,0],U.black,.07),B(i,[1.57,.81,.016],[0,-.015,.253],U.leather,.024),B(i,[1.63,.245,.52],[0,.448,0],U.silver,.035),B(i,[1.63,.105,.51],[0,-.48,0],U.silver,.02),B(i,[1.57,.77,.018],[0,-.015,-.257],U.leather,.025),B(i,[1.62,.82,.035],[0,-.015,-.256],U.black,.035),B(i,[1.49,.7,.02],[0,-.01,-.282],U.leather,.023),We(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),We(i,"8М",.18,.1,[-.55,-.11,.269]),We(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),We(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new ne;t.position.set(.12,-.045,0),i.add(t),Ft(t,.36,.39,.18,[0,0,.34],U.black),Ft(t,.325,.345,.13,[0,0,.466],U.silver),Ft(t,.293,.293,.21,[0,0,.575],U.black),lo(t,.296,.12,[0,0,.56],56,U.rubber),be(t,.29,.012,[0,0,.682],U.silver),Ft(t,.272,.272,.025,[0,0,.688],U.black),Eo(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),Su(n,"ТРИПЛЕТ 43 • 4/40",420),Su(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),Ft(t,.204,.204,.025,[0,0,.717],U.black);for(let n=0;n<7;n++){const s=n*je/7,r=new Ii;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),It(new bo(r),U.rubber,t,[0,0,.733],[0,0,s])}Ft(t,.082,.082,.006,[0,0,.74],U.black),eh(t,.196,.028,[0,0,.748],U.clear),be(t,.204,.006,[0,0,.736],U.silver),Yn(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),B(i,[.292,.177,.047],[-.49,.444,.282],U.black,.025),B(i,[.2,.105,.016],[-.49,.444,.309],U.lens,.009),B(i,[.21,.13,.035],[-.49,.447,-.28],U.black,.012),B(i,[.155,.08,.012],[-.49,.447,-.305],U.lens,.005);for(const n of[-.7,.72])oo(i,n,.452,.269,.021);for(const n of[-.65,.65])oo(i,n,-.32,-.3,.018);Ft(i,.161,.17,.105,[-.53,.625,0],U.silver,[0,0,0]),lo(i,.161,.067,[-.53,.63,0],38,U.silver,"y"),Ft(i,.11,.12,.072,[.53,.603,0],U.black,[0,0,0]),Ft(i,.059,.065,.075,[.53,.67,0],U.silver,[0,0,0]),B(i,[.27,.024,.23],[.02,.584,0],U.black,.006);for(const n of[-.14,.14])B(i,[.035,.04,.25],[n,.6,0],U.silver,.007);Ft(i,.036,.036,.015,[0,-.535,0],U.gold,[0,0,0]);for(const n of[-.79,.79])be(i,.055,.012,[n,.14,0],U.silver,[0,Math.PI/2,0]);const e=Dn(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,U.leather,50);e.scale.z=.4}function kx(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];ms(i,t,U.cream),be(i,.531,.007,[0,.377,0],U.gold,[Math.PI/2,0,0]),be(i,.272,.006,[0,-.489,0],U.gold,[Math.PI/2,0,0]),Dn(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,U.cream),Dn(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,U.gold);const e=fe((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,je),s.fill()},1024),n=new Lt({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});ms(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),We(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function Bx(i){const t=new Lt({map:U.leather.map,color:7754307,roughness:.84,bumpMap:U.leather.bumpMap,bumpScale:.01});B(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)B(i,[.008,.023,.004],[s,r,.001],U.paper,.001);for(let s=-.99;s<-.46;s+=.105)Ft(i,.019,.019,.004,[0,s,.004],U.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])B(i,[.1,.18,.13],[r,s,.035],U.silver,.023,[0,0,r*s]);Ft(i,.415,.438,.135,[0,0,.066],U.silver),be(i,.394,.027,[0,0,.143],U.silver),Eo(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*je/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*je/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),dn(s,r,r,a,1700)}),B(i,[.019,.244,.009],[-.038,.102,.18],U.black,.003,[0,0,.36]),B(i,[.012,.31,.008],[.105,.067,.19],U.black,.002,[0,0,-1]),B(i,[.004,.45,.003],[-.09,-.012,.201],U.copper,.001,[0,0,1.71]),Ft(i,.018,.02,.015,[0,0,.205],U.gold),eh(i,.371,.018,[0,0,.211]),Ft(i,.056,.057,.1,[.468,0,.04],U.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*je/18;B(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],U.silver,.001,[r,0,0])}const e=new Ii;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new so;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),nr(i,e,.025,U.silver,[0,1,.02]),B(i,[.02,.23,.018],[0,1,.065],U.silver,.003),Ft(i,.392,.392,.02,[0,0,-.104],U.silver),We(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),We(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;oo(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new D().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function Hx(i){B(i,[1.6,1,.166],[0,0,0],U.black,.07),B(i,[1.46,.77,.026],[0,.075,.092],U.rubber,.04),Yn(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),dn(t,e,n,s,1200)}),B(i,[1.07,.276,.012],[0,-.044,.121],U.black,.04);for(const t of[-.405,.405]){Ft(i,.176,.176,.018,[t,-.038,.132],U.rust),Ft(i,.112,.112,.023,[t,-.038,.146],U.paper),Ft(i,.063,.063,.027,[t,-.038,.152],U.black);for(let e=0;e<6;e++){const n=e*je/6;B(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],U.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])be(i,e,.002,[t,-.038,.147],U.black)}for(let t=-.2;t<.23;t+=.043)B(i,[.012,.08,.008],[t,-.04,.137],U.silver,.001);B(i,[1.16,.205,.035],[0,-.374,.105],U.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])oo(i,t,e,.098,.024);for(const t of[-.44,.44])Ft(i,.049,.049,.008,[t,-.389,.131],U.rubber);for(let t=0;t<20;t++)B(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],U.leather,.001);Yn(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);dn(t,e,n,s,800)},[0,Math.PI,0])}function Vx(i){It(jd([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],U.cream,44),U.cream,i);for(const e of[-1,0,1]){const n=Vi(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],U.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new Ii;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),nr(i,t,.13,U.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){Vi(i,[.012,.014,.007],[.43,.405,e*.164],U.black),Dn(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,U.gold,30);for(let n=0;n<4;n++)Dn(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,U.gold,12)}Ft(i,.29,.32,.045,[-.04,-.415,0],U.cream,[0,0,0]),We(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function Gx(i){B(i,[1.02,1.48,.253],[.025,0,0],U.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;B(i,[1.02,.002,.001],[.025,.742,n],e%5?U.paper:U.rust,0),B(i,[.002,1.45,.001],[.537,0,n],e%4?U.paper:U.rust,0)}B(i,[1.15,1.58,.045],[0,0,.155],U.red,.015),B(i,[1.15,1.58,.045],[0,0,-.155],U.red,.015),B(i,[.095,1.57,.34],[-.56,0,0],U.red,.025),Yn(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),dn(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])B(i,[.106,.015,.347],[-.556,e,0],U.red,.007);We(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new Lt({color:5724487,roughness:1});B(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),We(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function Wx(i){be(i,.28,.055,[0,.41,0],U.gold),be(i,.219,.012,[0,.41,.034],U.copper),Ft(i,.046,.048,.92,[0,-.29,0],U.gold,[0,0,0],32),B(i,[.25,.09,.1],[.092,-.745,0],U.gold,.012),B(i,[.09,.1,.105],[.171,-.64,0],U.gold,.007),B(i,[.065,.17,.095],[.037,-.7,0],U.gold,.009),be(i,.34,.014,[0,.72,-.01],U.silver,[.23,0,.08]),be(i,.331,.009,[0,.72,-.018],U.silver,[.23,0,.08]),B(i,[.24,.34,.037],[.37,.34,-.03],U.leather,.028,[0,0,-.22]),We(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),be(i,.055,.012,[.33,.535,-.02],U.silver),We(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function Xx(i){const t=new Ii;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),nr(i,t,.055,U.gold,[0,0,-.03]);const e=t.clone();nr(i,e,.009,U.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),Yn(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])Vi(i,[.014,.021,.002],[s,r,.044],U.gold);Dn(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,U.silver,14),Ft(i,.04,.04,.045,[-.23,.18,-.059],U.silver),We(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function qx(i){Ft(i,.83,.83,.022,[0,0,0],U.black,void 0,96);const t=fe((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,je),s.stroke()},1024),e=fe((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,d=Math.hypot(c,h)||1,m=Math.sin(d*2.2)*.22,u=(o*r+l)*4;a.data[u]=128+127*m*c/d,a.data[u+1]=128+127*m*h/d,a.data[u+2]=253,a.data[u+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=Sn;const n=new Lt({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new dt(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){It(new Xi(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new ne;i.add(r),r.rotation.y=s===1?0:Math.PI,Eo(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,je),a.stroke(),dn(a,o,o,l,1500)}),Ft(r,.018,.018,.01,[0,0,.022],U.rubber)}}function Yx(i){const t=new Vs({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=ms(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new Vs({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});Ft(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),Ft(i,.11,.11,.16,[0,.49,0],U.gold,[0,0,0]),lo(i,.112,.1,[0,.49,0],28,U.gold,"y"),ms(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),Yn(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),dn(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function $x(i){B(i,[1.27,.08,.55],[0,-.72,0],U.bronze,.032),B(i,[1.35,.04,.61],[0,-.78,0],U.black,.02),It(jd([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],U.bronze),U.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;Dn(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,U.bronze),Vi(i,[.051,.057,.04],[e+s,-.43,n],U.bronze),B(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],U.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=ms(i,[[0,0],[.041,0],[.034,.1],[0,.18]],U.bronze,[.333,.525,e],16);n.rotation.z=.15,Vi(i,[.015,.015,.008],[.457,.49,t*.127],U.black),Vi(i,[.012,.01,.006],[.648,.404,t*.083],U.black)}for(let t=0;t<12;t++)Dn(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,U.bronze,10);Dn(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,U.bronze);for(let t=0;t<5;t++)Dn(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,U.gold,14);Dn(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,U.gold,16),We(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function Zx(i){Ft(i,.51,.53,.145,[0,0,0],U.gold),be(i,.503,.018,[0,0,.075],U.gold),lo(i,.51,.072,[0,0,-.018],72,U.gold),Eo(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*je/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*je/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),dn(e,n,n,s,1800)});const t=new Ii;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),nr(i,t,.007,U.red,[0,0,.103],[0,0,-.38],.001),nr(i,t,.007,U.silver,[0,0,.103],[0,0,Math.PI-.38],.001),Ft(i,.027,.027,.025,[0,0,.121],U.gold),eh(i,.468,.013,[0,0,.142]),be(i,.109,.025,[0,.635,0],U.gold),Ft(i,.059,.065,.092,[0,.523,0],U.gold,[0,0,0]),Ft(i,.465,.465,.02,[0,0,-.086],U.gold),We(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),We(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function Jx(i){ms(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],U.glass);for(const n of[.817,.862])be(i,.116,.009,[0,n,0],U.glass,[Math.PI/2,0,0]);const t=fe((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),dn(n,s,a,r,2800)},768,460),e=new Lt({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:ze});It(new Ee(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),We(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function Kx(i){const t=U.silver.clone();t.roughness=.46,ms(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)be(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);Ft(i,.404,.404,.015,[0,-.347,0],U.rust,[0,0,0]);const e=new ne;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),Ft(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),be(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),be(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),B(e,[.067,.025,.11],[0,.028,.33],t,.015),Yn(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),dn(n,s,r,a,2600)}),Yn(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),dn(n,s,r,a,2400)},[0,Math.PI,0])}function jx(i){const t=fe((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),dn(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,je),r.fill()},768,768),e=new Lt({map:t,roughness:.98,side:ze,bumpMap:U.paper.bumpMap,bumpScale:.009}),n=new Ee(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),d=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+d,o,l*h)}n.computeVertexNormals(),It(n,e,i),be(i,.355,.016,[0,.44,0],U.paper,[Math.PI/2,0,0]),Ft(i,.232,.232,.015,[0,-.437,0],U.paper,[0,0,0]),Ft(i,.224,.224,.008,[0,-.421,0],U.rust,[0,0,0]),Dn(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,U.paper)}function Qx(i){const t=fe((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);dn(s,r,r,a,3500)}),e=new Lt({map:t,roughness:.97,bumpMap:U.paper.bumpMap,bumpScale:.008,side:ze});B(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])B(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])B(i,[.029,.75,.8],[s,-.065,0],e,.006);B(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),B(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),B(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),B(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)Ft(i,.005,.005,.027,[s,.319,.399],U.paper,[0,0,0],6);Yn(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);dn(s,r,a,o,1200)}),Yn(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new Lt({color:11114860,roughness:.4,transparent:!0,opacity:.66});B(i,[.12,.74,.006],[.25,-.05,.421],n,.001),B(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function t_(i){Ft(i,.507,.507,.036,[0,0,0],U.rust,void 0,80),be(i,.504,.014,[0,0,.017],U.silver);for(const e of[.448,.408])be(i,e,.009,[0,0,.024],U.rust);const t=ui(77);for(let e=0;e<9;e++){const n=t()*je,s=.465+t()*.015;Vi(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],U.silver)}for(let e=0;e<24;e++){const n=e*je/24;B(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],U.rust,.007,[0,0,-n])}We(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function e_(i){const t=fe((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),dn(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,je),n.fill()},1024,1280),e=new Lt({map:t,roughness:1,side:ze,bumpMap:U.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new ue(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++)r.getX(a),r.getY(a),r.setZ(a,n*.004);s.computeVertexNormals(),It(s,e,i)}}const n_={camera:zx,teacup:kx,watch:Bx,cassette:Hx,duck:Vx,book:Gx,key:Wx,badge:Xx,record:qx,perfume:Yx,horse:$x,compass:Zx,bottle:Jx,can:Kx,cup:jx,box:Qx,lid:t_,paper:e_};function i_(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===U.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new $t("#977145"),c=new $t("#355d53");for(let h=0;h<a.count;h++){const d=a.getX(h),m=a.getY(h),u=a.getZ(h),p=Math.sin(d*15+Math.sin(m*9))*Math.sin(m*19+u*12)*Math.cos(u*21-d*6),v=ye.clamp((p+.12)*.85,0,.8);l.clone().lerp(c,v).toArray(o,h*3)}s.setAttribute("color",new Be(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=Yd(s,!1);It(r,n,i),s.forEach(a=>a.dispose())}return e}function gl(i){const t=new ne;n_[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const d=new D().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);d.set(...Nx(i,d.x,d.y,d.z)).applyMatrix4(c),l.setXYZ(h,d.x,d.y,d.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=i_(t),n=new qn().setFromObject(t),s=n.getCenter(new D),r=n.getSize(new D);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new ne;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const ka=ui(370);function s_(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function nh(i,t,e,n,s){const r=new ue(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function Un(i,t,e,n,s=[1,1,1],r=1){const a=It(new Mo(t,r),n,i,e);return a.scale.set(...s),a}function Nn(i,t,e,n,s=[1,1,1],r=1){const a=It(new Mo(t,r),n,i,e);return a.scale.set(...s),a}function r_(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function Ao(i,t,e,n,s=24){return It(new si(new fs(t.map(r=>new D(...r))),s,e,5,!1),n,i)}function a_(){return fe((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(u,p,v,g,f)=>{i.fillStyle=f,i.fillRect(u,p,v,g)},c=(u,p,v,g,f)=>{i.fillStyle=f,i.beginPath(),i.ellipse(u,p,v,g,0,0,Math.PI*2),i.fill()},h=(u,p,v,g="rgba(255,198,106,")=>{const f=i.createRadialGradient(u,p,0,u,p,v);f.addColorStop(0,g+".62)"),f.addColorStop(1,g+"0)"),i.fillStyle=f,i.fillRect(u-v,p-v,v*2,v*2)},d=(u,p,v="#4b2d1e")=>{const g=i.createLinearGradient(0,0,0,r);g.addColorStop(0,u),g.addColorStop(1,p),i.fillStyle=g,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,v),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},m=(u,p)=>{i.save(),i.translate(u%4*s,Math.floor(u/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),p(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};m(0,()=>{d("#bd8745","#70452a"),l(16,58,122,316,"#382313");const u=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let p=0;p<5;p++){const v=78+p*58;l(22,v+38,110,6,"#20130b");let g=27;for(;g<124;){const f=5+e()*9;l(g,v+38-(24+e()*12),f,24+e()*12,u[Math.floor(e()*u.length)]),g+=f+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),m(1,()=>{d("#a8ad7d","#66704e","#40392a");for(let u=0;u<3;u++){const p=86+u*72;l(22,p,190,7,o);for(let v=0;v<6;v++){const g=34+v*31;l(g,p-(20+(v+u)%3*7),15,20+(v+u)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][v%4]),l(g+2,p-(27+(v+u)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const u of[62,112,168])i.beginPath(),i.moveTo(u,306),i.lineTo(u,326),i.stroke(),c(u,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),m(2,()=>{d("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),m(3,()=>{d("#8fae94","#55705e","#33473a");for(let u=0;u<3;u++){const p=120+u*104;l(18,p,220,8,"#2c2117");for(let v=0;v<4;v++){const g=42+v*54;l(g-13,p-25,26,25,"#8a5138");for(let f=0;f<6;f++){const x=-2.4+f*.45;c(g+Math.cos(x)*17,p-34+Math.sin(x)*19,11,5,f%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const u of[38,96,204]){i.beginPath(),i.moveTo(u,0),i.quadraticCurveTo(u+14,72,u-4,142),i.stroke();for(let p=0;p<6;p++)c(u+(p%2?9:-8),24+p*21,10,5,p%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),m(4,()=>{d("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const u of[48,112,190])l(u,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let u=0;u<4;u++)i.beginPath(),i.moveTo(100,292+u*6),i.lineTo(136,292+u*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),m(5,()=>{d("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let u=0;u<5;u++)l(26+u*15,410-u*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][u]);h(218,166,50)}),m(6,()=>{d("#8299a4","#4f6875","#31424b");const u=i.createLinearGradient(38,96,218,250);u.addColorStop(0,"#b9d5df"),u.addColorStop(.55,"#688b9c"),u.addColorStop(1,"#314f62"),i.fillStyle=u,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),m(7,()=>{d("#b49aa4","#76606d","#463945");for(let u=0;u<5;u++){l(24,78+u*8,70,4,"rgba(50,35,42,.45)");for(let p=0;p<4;p++)l(31+p*16,58+u*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][p])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function o_(){return fe((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,d,m="#2e342b",u="Georgia")=>{i.fillStyle=m,i.font=`bold ${d}px ${u}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const en={};function Zn(){if(en.stone)return en;en.stone=new Lt({color:7566439,roughness:.86,map:ja("plaster.jpg")}),en.iron=new Lt({color:2633768,metalness:.72,roughness:.6}),en.green=new Lt({color:4216121,roughness:.9,flatShading:!0,side:ze}),en.shadowMap=fe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),en.contact=new Je({map:en.shadowMap,transparent:!0,depthWrite:!1}),en.wood=new Lt({color:7427130,roughness:.92}),en.leafDark=new Lt({color:3099956,roughness:1,flatShading:!0}),en.poster=new Lt({map:o_(),roughness:.96}),en.bulb=new Lt({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=fe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);en.glow=new Je({map:i,color:16757350,transparent:!0,opacity:.42,blending:Or,depthWrite:!1,side:ze});const t=fe((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);en.chalk=new Je({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=fe((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return en.chess=new Lt({map:e,roughness:.8}),en}function l_(i,t,e=14,n=0){const s=new Je({map:Kd(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});It(new ue(t,1.45),s,i,[0,.72,.342]);const r=fe((u,p,v)=>{u.fillStyle="#605d4c",u.fillRect(0,0,p,p);for(let g=0;g<12;g++)for(let f=-1;f<7;f++){const x=f*87+g%2*43,y=g*45;u.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(v()*4)],u.fillRect(x+3,y+3,81,39),u.fillStyle="rgba(28,29,21,.22)",u.fillRect(x+3,y+36,81,5)}u.globalCompositeOperation="destination-in",u.beginPath();for(let g=0;g<60;g++){const f=g*Math.PI/30,x=185+v()*60;u.lineTo(p/2+Math.cos(f)*x,p/2+Math.sin(f)*x*.7)}u.closePath(),u.fill()}),a=new Lt({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[u,p,v]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])It(new ue(v*2,v),a,i,[u,p,.349]);const o=Zn();for(const[u,p,v]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])It(new ue(.17,v),s,i,[u,p,.344]);let l=0;for(let u=-t/2+1.55;u<t/2-1.1;u+=2.85,l++){if(n===0&&Math.abs(u+3.8)<1.65)continue;const p=(l+n)%4===1;B(i,[.78,.48,.06],[u,.39,.425],p?nf:U.black,0),B(i,[.9,.07,.09],[u,.665,.44],o.stone,0),B(i,[.9,.06,.1],[u,.125,.45],o.stone,0);for(const g of[-.24,0,.24])B(i,[.02,.44,.02],[u+g,.39,.47],U.black,0);const v=u+1.42;if(v<t/2-.7){B(i,[.34,.24,.035],[v,.92,.342],U.black,0);for(let g=0;g<3;g++)B(i,[.28,.025,.012],[v,.86+g*.07,.365],U.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;It(nh(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=ui(910+n),d=[[-t/2+.58,0],[t/2-.58,2]];n===0&&d.push([-5.32,1]);for(const[u,p]of d)for(let v=0;v<30;v++){const g=.5+v*.17+h()*.09,f=u+Math.sin(v*.55+p)*.28+(h()-.5)*.2;It(new Xi(.055+h()*.08,7),v%3?o.leafDark:o.green,i,[f,g,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const u of[-t*.3,t*.24])B(i,[.78,.98,.78],[u,e+.48,-.05],o.stone,0),B(i,[.94,.13,.94],[u,e+1.02,-.05],o.stone,0),Ft(i,.09,.11,.24,[u-.16,e+1.19,-.05],U.rust,[0,0,0],10),Ft(i,.09,.11,.24,[u+.16,e+1.19,-.05],U.rust,[0,0,0],10);for(const u of[-t*.12,t*.36])Ft(i,.018,.018,1.42,[u,e+.76,.18],U.black,[0,0,0],8),B(i,[.88,.025,.025],[u,e+1.12,.18],U.black,0),B(i,[.58,.025,.025],[u,e+1.36,.18],U.black,0),B(i,[.025,.025,.72],[u,e+1.24,.18],U.black,0);const m=t*.16;It(new Ee(.37,.09,.13,20),U.silver,i,[m,e-1.48,.56],[1.02,0,-.32]),Ao(i,[[m-.18,e-1.62,.34],[m,e-1.5,.58]],.016,U.black,4);for(let u=0;u<6;u++){if((u+n)%4===3)continue;const p=-t*.34+u*t*.13,v=e+.13;Un(i,.058,[p,v,.48],o.stone,[1.45,.82,.9],0),Nn(i,.032,[p+.065,v+.055,.49],U.black),B(i,[.11,.014,.035],[p-.085,v+.015,.47],U.black,0,[0,.2,.18])}}function Qd(i,t,e,n,s,r,a,o){B(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),B(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])B(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),B(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);B(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],U.silver,0),B(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let Ba;function c_(){if(Ba)return Ba;const i=fe((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=a_(),e=fe((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return Ba={curtain:new Lt({map:i,roughness:1,side:ze}),blind:new Lt({color:10067089,roughness:.9}),leaf:new Lt({color:4087359,roughness:1,flatShading:!0}),pot:new Lt({color:8414289,roughness:.94}),interior:new Lt({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new Lt({map:e,transparent:!0,alphaTest:.06,roughness:1,side:ze})},Ba}function tf(i,t,e=1,n=0,s=U.black){const r=new ne;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),Un(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),Nn(r,.086,[0,.325,.13],s);for(const a of[-1,1])It(new Ee(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),Ft(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return Ao(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function ef(i,t,e,n,s,r,a,o,l=0){const c=c_(),h=Zn(),d=s_(l+811),m=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),u=(p=.574)=>{for(const v of[-1,1]){const g=new ue(n*.27,s*.91,5,6),f=g.attributes.position;for(let x=0;x<f.count;x++)f.setZ(x,.008*Math.sin(f.getX(x)*80));g.computeVertexNormals(),It(g,c.curtain,i,[t+v*n*.34,e-.025,p]),B(i,[.035,.09,.025],[t+v*n*.24,e-.08,p+.018],U.gold,0)}It(new ue(n*.96,s*.17),c.lace,i,[t,e+s*.39,p+.004])};if(r==="lit")It(nh(n*.97,s*.97,d%8,4,2),c.interior,i,[t,e,.566]),d%3===0&&u(.576),d%4===1&&(Ft(i,.006,.006,.34,[t+.18,e+s*.31,.59],U.black,[0,0,0],6),Ft(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),Nn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")u();else if(r==="blind"){for(let p=0;p<12;p++)B(i,[n*.94,.04,.019],[t,e+s/2-.08-p*.093,.581],c.blind,0,p>8?[.32,0,0]:[0,0,0]);for(const p of[-1,1])B(i,[.012,s*.68,.012],[t+p*n*.39,e+s*.08,.594],U.black,0);B(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const p=new ne;p.position.set(t-n/2,e,.6),p.rotation.y=-.42,i.add(p),B(p,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const v of[0,n*.48])B(p,[.038,s*.94,.05],[v,0,.025],a,0);for(const v of[-s*.47,s*.47])B(p,[n*.5,.038,.05],[n*.24,v,.025],a,0);B(p,[n*.48,.032,.05],[n*.24,.23,.025],a,0),Ft(p,.014,.014,.1,[n*.45,-.05,.065],U.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&d%3===0){const p=t+(d%2?.29:-.29);Ft(i,.1,.075,.15,[p,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const v of[-1,0,1])Un(i,.07,[p+v*.055,e-s/2+.17,.79],v?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&d%5===0&&tf(i,[t-.17,e-s/2-.015,.8],.58,0,U.black),m>0&&m<3){if(d%9===2){B(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let p=0;p<6;p++)Un(i,.07,[t-n*.31+p*n*.12,e-s/2+.17,.74],p%2?h.green:c.leaf,[1.2,.72,.8],0);for(let p=0;p<7;p++)Un(i,.022,[t-n*.33+p*n*.105,e-s/2+.21,.78],p%3?U.red:U.cream,[1,1,1],0)}else if(d%11===5){B(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),It(new Ee(.15,.15,.025,20),U.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const p of[-.1,0,.1])B(i,[.42,.018,.012],[t+.16,e-s/2-.39+p,.735],U.black,0);B(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],U.black,0)}else if(d%13===6)for(const p of[-1,1]){B(i,[.24,s*.9,.035],[t+p*(n/2+.18),e,.55],h.leafDark,0);for(let v=0;v<5;v++)B(i,[.18,.025,.014],[t+p*(n/2+.18),e-s*.3+v*s*.15,.575],U.black,0)}}if(m===0&&r!=="open"&&d%3===1){for(const p of[-.36,-.18,0,.18,.36])B(i,[.018,s*.85,.018],[t+p*n,e,.645],U.black,0);for(const p of[-s*.28,s*.28])B(i,[n*.84,.02,.02],[t,e+p,.65],U.black,0)}if(m>=2&&d%11===0){const p=t+n*.24,v=e-s/2+.025;Un(i,.055,[p,v,.76],h.stone,[1.45,.82,.9],0),Nn(i,.031,[p+.062,v+.052,.76],U.black),B(i,[.1,.013,.032],[p-.082,v+.012,.76],U.black,0,[0,.15,.16])}}function h_(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=Zn();Ft(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),be(i,.56,.015,[2.5,.033,2.5],U.rust,[Math.PI/2,0,0]),be(i,.62,.014,[2.5,.033,2.5],U.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;B(i,[h,.012,.018],[2.5,.04,2.5+c*.085],U.black,.003)}for(const c of[2.23,2.77])B(i,[.05,.01,.11],[c,.049,2.5],U.black,.005);for(const c of[-4.55,4.55]){B(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),Ft(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),Ft(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),Nn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new ro(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}B(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)B(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new fs([new D(-6,5.3,-6.5),new D(-1,4.96,-6.47),new D(4.2,5.31,-6.46)]);It(new si(o,24,.011,5),U.rubber,i);const l=fe((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[d,m]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(m,h/2,165+d*41);c.strokeStyle="#555b4d";for(let d=28;d<h;d+=43)c.beginPath(),c.moveTo(d,h-90),c.lineTo(d,h),c.stroke()});It(new ue(.42,.56),new Lt({map:l,roughness:.95,side:ze}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,d,m]of[...Wd.map(u=>[u.x,u.z,u.scale*3.5,u.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])It(new ue(d,m),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+ka()*1.3,d=-6+ka()*6,m=.03+ka()*.13,u=new Ii;u.moveTo(-.012,0),u.quadraticCurveTo(.014,m*.7,.025,m),u.lineTo(.006,0),It(new bo(u),s,i,[h,.025,d],[0,ka()*6,0])}p_(i)}function bu(i,t,e){const n=Zn(),s=new ne;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])B(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])B(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])B(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),B(s,[.055,.04,.56],[r*.84,.67,0],U.rust,0),B(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function Ha(i,t,e,n,s){const r=Zn(),a=new ne,o=ui(s);a.position.set(...t),a.rotation.y=e,i.add(a),B(a,[n,.1,.78],[0,.05,0],U.rust,0);for(const c of[-1,1]){B(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),B(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)B(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,d=(o()-.5)*.42,m=c%3?r.leafDark:r.green;Un(a,.15+o()*.15,[h,.19+o()*.08,d],m,[1.45,.58,.95],0),Un(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,d+(o()-.5)*.18],m,[1.3,.62,.9],0),Un(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,d+(o()-.5)*.16],m,[1.2,.6,.9],0)}for(let c=0;c<18;c++)Un(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[U.red,U.cream,U.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)It(new Ee(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function u_(i,t,e,n,s=9){const r=Zn();Ao(i,r_(t,e,n,7),.007,U.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;B(i,[.006,.07,.006],[l,c-.035,h],U.black,0),Nn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function Va(i,t,e,n,s){const r=Zn();B(i,[.07,.36,.13],[t,e,n],r.iron,.01),Ft(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),Ft(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),Nn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),It(new ue(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function d_(i,t,e,n=1){const s=Zn(),r=new ne;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),Un(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),Nn(r,.037,[0,.135,.085],U.black),It(new Ee(.001,.011,.038,5),U.gold,r,[0,.13,.128],[Math.PI/2,0,0]),B(r,[.075,.014,.1],[0,.075,-.105],U.black,0,[.22,0,0]);for(const a of[-1,1])B(r,[.008,.055,.008],[a*.025,.028,.01],U.rust,0);return r}function f_(i,t,e){const n=Zn(),s=new ne;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])B(s,[1.08,.026,.105],[0,a+.055,o],r%2?U.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])B(s,[.1,.085,.1],[o,a,l],U.rust,0)}return B(s,[.58,.38,.48],[.05,.72,0],U.paper,.01,[0,.12,0]),s}function p_(i){const t=Zn();bu(i,[-5.45,0,-.75],Math.PI/2),bu(i,[5.7,0,-5.25],0),Ha(i,[-7.02,0,1.95],Math.PI/2,4.8,21),Ha(i,[8.02,0,1.75],Math.PI/2,4.3,33),Ha(i,[5.95,0,-6.08],0,3.5,47),Ha(i,[-6.35,0,-6.08],0,2.1,58),u_(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),Va(i,-7.62,2.75,-4.9,1),Va(i,-7.62,2.75,3.8,1),Va(i,8.62,2.75,-4.9,-1),Va(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;B(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),B(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}Ft(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),B(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),It(new ue(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])Ft(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),Ft(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)Nn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?U.black:U.cream,[1,.75,1],0);f_(i,[-6.5,0,-4.9],.15);const e=new ne;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),B(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])B(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],U.rust,0);Nn(e,.035,[.075,1.02,.34],U.silver);for(let a=0;a<3;a++)It(new er(.34,.105,8,26),U.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);It(new er(.34,.105,8,26),U.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new ne;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),B(n,[.62,.58,1.72],[0,.58,0],U.leather,.18),B(n,[.54,.46,1],[0,1.02,-.12],U.leather,.19),B(n,[.5,.34,.46],[0,1.04,.58],U.leather,.16);for(const a of[-.42,.22])B(n,[.65,.018,.035],[0,.84,a],U.black,0);for(const a of[-.58,.58])It(new Ee(.29,.29,.09,20),U.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new ne;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),B(s,[.1,.035,.6],[0,.1,0],U.red,.01);for(const a of[-.25,.25])It(new Ee(.075,.075,.035,14),U.black,s,[0,.075,a],[0,0,Math.PI/2]);Ao(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,U.silver,8),B(s,[.36,.025,.025],[0,.78,.4],U.black,0),It(new ue(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),Nn(i,.16,[-4.72,.16,1.85],U.red,[1,.92,1]),tf(i,[-4.32,0,-.22],1,1.49,U.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>d_(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)Un(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],U.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const d=It(new ue(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);d.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])It(new ue(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const nf=new Lt({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function m_(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])Ft(i,.027,.027,.016,[o,l,.854],U.silver,void 0,8),B(i,[.016,.003,.005],[o,l,.866],U.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=Vi(i,[.013,.035,.007],[o*1.155,l,.827],U.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])B(i,[.21,.06,.3],[o,.42,.6],U.silver,.018),B(i,[.075,.025,.21],[o,.305,.81],U.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){B(t,[.2,.032,.2],[o,.114,.12],U.silver,.008);for(const l of[-.065,.065])Ft(t,.022,.022,.012,[o+l,.139,.12],U.silver,[0,0,0],8)}const n=new Lt({color:1055507,roughness:.94});B(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=fe((o,l,c)=>{for(let h=0;h<1800;h++){const d=c(),m=c();d>.1&&d<.9&&m<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(d*l,m*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const d=o.createLinearGradient(0,0,0,l);d.addColorStop(0,"rgba(67,42,24,0)"),d.addColorStop(.5,"rgba(67,42,24,.35)"),d.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=d,o.fillRect(h*l,0,6,l)}}),r=new Lt({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});It(new ue(2.35,1.43),r,i,[0,1.18,.876]),It(new ue(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])B(t,[.025,.006,.48],[o,.114,1.6],U.silver,.002);const a=fe((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});It(new ue(.42,.37),new Lt({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const g_=new Lt({color:3883064,roughness:.82});function v_(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const d=Zn(),m=ui(c*7+13),u=1.55,p=2.55,v=u,g=p+v,f=new Ii;f.moveTo(-t/2,0),f.lineTo(t/2,0),f.lineTo(t/2,e),f.lineTo(-t/2,e),f.closePath();const x=new so;x.moveTo(h-u,0),x.lineTo(h-u,p),x.absarc(h,p,v,Math.PI,0,!0),x.lineTo(h+u,0),x.closePath(),f.holes.push(x),It(new yo(f,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[I,N]of[[-t/2,h-u-.12],[h+u+.12,t/2]])B(i,[N-I,.75,.78],[(I+N)/2,.375,.025],n,0);for(const I of[3.28,6.2,9.15])for(const[N,F]of[[-t/2,h-u-.12],[h+u+.12,t/2]]){const z=F-N;z<.5||(B(i,[z,.14,.87],[(N+F)/2,I,.055],s,0),B(i,[z,.07,.98],[(N+F)/2,I+.09,.08],n,0))}B(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const I of[-1,1])B(i,[.36,p+.05,.62],[h+I*(u+.18),p/2,.06],n,.02);const _=new Gr(0,0,v+.2,v+.2,0,Math.PI,!1,0).getPoints(30).map(I=>new D(I.x,I.y,0));It(new si(new fs(_),30,.17,7,!1),n,i,[h,p,.06]),B(i,[.26,.62,.72],[h,g+.16,.09],n,.02);for(let I=1;I<7;I++){const N=Math.PI*I/7,F=Math.cos(N)*(v+.2),z=Math.sin(N)*(v+.2);B(i,[.17,.3,.52],[h+F,p+z,.03],n,.012,[0,0,-N+Math.PI/2])}const E=new Lt({color:1909020,roughness:.96});B(i,[u*2+.6,.06,3.6],[h,0,-1.85],n,0),B(i,[.24,4.6,3.6],[h-u-.32,2.3,-1.85],E,0),B(i,[.24,4.6,3.6],[h+u+.32,2.3,-1.85],E,0),B(i,[3.4,.2,3.6],[h,g+.62,-1.85],n,0),B(i,[3.4,4.8,.12],[h,2.4,-3.7],E,0);const b=fe((I,N)=>{const F=I.createLinearGradient(0,0,0,N);F.addColorStop(0,"rgba(52,60,58,1)"),F.addColorStop(.42,"rgba(85,74,54,1)"),F.addColorStop(1,"rgba(34,38,34,1)"),I.fillStyle=F,I.fillRect(0,0,N,N);const z=I.createRadialGradient(N*.5,N*.3,0,N*.5,N*.3,N*.46);z.addColorStop(0,"rgba(255,198,118,.95)"),z.addColorStop(.45,"rgba(255,174,92,.38)"),z.addColorStop(1,"rgba(255,160,80,0)"),I.fillStyle=z,I.fillRect(0,0,N,N)});It(new ue(3.2,4.6),new Je({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),It(new ue(3,4.2),new Je({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),B(i,[1.1,.4,.36],[h-.55,2.1,-2.1],E,0),B(i,[.5,.9,.3],[h+.7,.28,-2.2],E,0);const A=(I,N=0)=>{const F=new ne,z=u-.06,G=p-.1;F.position.set(h+I*(u-.02),0,.02),F.rotation.y=I*N,i.add(F);const H=-I*z/2;for(const tt of[.07,G])B(F,[z,.1,.09],[H,tt,0],U.black,.012);for(const tt of[H-z/2+.045,H+z/2-.045])B(F,[.09,G,.09],[tt,G/2,0],U.black,.012);const Z=.92;B(F,[z-.12,Z,.07],[H,Z/2+.1,0],g_,.01);for(let tt=0;tt<3;tt++)B(F,[z-.18,.03,.09],[H,Z*(tt+.5)/3+.1,.012],U.rust,0);for(let tt=H-z/2+.14;tt<H+z/2-.1;tt+=.17)B(F,[.03,G-Z-.24,.03],[tt,Z+.12+(G-Z-.24)/2,.012],U.black,0);for(const tt of[G-.12,2.02,Z+.32])B(F,[z-.14,.05,.055],[H,tt,.012],U.black,0);for(const tt of[.42,.95])Ft(F,.035,.035,.09,[H+I*(z/2-.02),tt,0],U.black,[0,0,0],10);return be(F,.1,.013,[H,G*.8,.02],U.black),F};A(-1,.3),A(1,0);for(let I=-3;I<=3;I++){const N=h+I*.42,F=Math.sqrt(Math.max(0,v*v-N*N)),z=p+F*.96,G=p-.1;z-G<.12||B(i,[.028,z-G,.028],[N,(z+G)/2,.055],U.black,0)}const M=new Gr(0,0,v-.02,v-.02,0,Math.PI,!1,0).getPoints(20).map(I=>new D(I.x,I.y,0));It(new si(new fs(M),20,.03,5,!1),U.black,i,[h,p,.055]);for(let I=0;I<5;I++){const N=Math.PI*(I+1)/6;B(i,[.05,.05,.05],[h+Math.cos(N)*(v-.02),p+Math.sin(N)*(v-.02),.075],U.black,0)}Ft(i,.02,.02,.5,[h,g+.9,.36],U.black,[0,0,0],8),Ft(i,.11,.2,.14,[h,g+.5,.36],U.black,[0,0,0],14),Nn(i,.082,[h,g+.4,.36],d.bulb,[1,1.45,1],0),It(new ue(1.5,1.5),d.glow,i,[h,g+.36,.5]);const S=new Lt({map:vc("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});B(i,[.62,.46,.06],[h+2.3,2.35,.35],U.black,0),It(new ue(.57,.41),S,i,[h+2.3,2.35,.39]);const R=Math.floor(t/2.47);for(let I=0;I<R;I++)for(let N=0;N<4;N++){const F=(I-(R-1)/2)*2.47,z=1.72+N*2.95;if(Math.abs(F-h)<3.3&&N<2)continue;const G=1.16,H=1.91,Z=300+N*10+I;B(i,[G+.26,H+.27,.14],[F,z,.38],s,0),B(i,[G+.05,H+.06,.1],[F,z,.47],r,0);const tt=Xd(I,N,2),nt=tt==="lit"?l:o[(I+N)%o.length];B(i,[G,H,.04],[F,z,.54],nt,0);for(const bt of[-G/2,G/2,0])B(i,[.048,H,.09],[F+bt,z,.58],n,0);for(const bt of[-H/2,H/2,.24])B(i,[G,.047,.09],[F,z+bt,.58],n,0);B(i,[G+.4,.12,.43],[F,z-H/2-.09,.55],s,0),Qd(i,F,z,G,H,n,r,s),N>=1&&ef(i,F,z,G,H,tt,s,nt,Z)}for(const I of[-t/2+.35,t/2-.38]){Ft(i,.07,.07,e,[I,e/2,.53],r,[0,0,0],12);for(let N=1;N<e;N+=2)Ft(i,.087,.087,.055,[I,N,.53],U.rust,[0,0,0],12)}const L=new Je({map:Kd(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[I,N]of[[-t/2,h-u-.5],[h+u+.5,t/2]].filter(([F,z])=>z-F>1))It(new ue(N-I,.9),L,i,[(I+N)/2,.55,.345]);It(nh(.48,.64,c%4,2,2),d.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let I=0;I<22;I++){const N=I<11?-t/2+.55:t/2-.55,F=N+Math.sin(I*.55)*.26+(m()-.5)*.2;It(new Xi(.05+m()*.075,7),I%3?d.leafDark:d.green,i,[F,.5+I*.17,.355+m()*.04],[0,0,m()*Math.PI])}for(const I of[-t*.32,t*.3])B(i,[.78,.98,.78],[I,e+.48,-.05],n,0),B(i,[.94,.13,.94],[I,e+1.02,-.05],n,0),Ft(i,.09,.11,.24,[I-.16,e+1.19,-.05],U.rust,[0,0,0],10),Ft(i,.09,.11,.24,[I+.16,e+1.19,-.05],U.rust,[0,0,0],10);return Ft(i,.018,.018,1.42,[t*.12,e+.76,.18],U.black,[0,0,0],8),B(i,[.88,.025,.025],[t*.12,e+1.12,.18],U.black,0),B(i,[.58,.025,.025],[t*.12,e+1.36,.18],U.black,0),i}function wu(i,t,e,n,s){B(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),B(i,[t+.1,.08,1.28],[0,e+.36,.34],Rr(s),0),It(new $n(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),B(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])B(i,[.16,.2,.16],[r,e+.62,.95],U.rust,0)}function Rr(i){return Rr.mat||(Rr.mat=i.clone(),Rr.mat.color.offsetHSL(0,-.03,.04)),Rr.mat}function x_(){const i=new ne;i.name="sky";const t=new Pe(55,32,18),e=[],n=new $t("#6a5142"),s=new $t("#253a55"),r=new $t("#08111f");for(let A=0;A<t.attributes.position.count;A++){const T=ye.smoothstep(t.attributes.position.getY(A)/55,-.04,.62);(T<.4?n.clone().lerp(s,T/.4):s.clone().lerp(r,(T-.4)/.6)).toArray(e,A*3)}t.setAttribute("color",new le(e,3));const a=new Yt(t,new Je({vertexColors:!0,side:sn,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=fe((A,T)=>{const M=A.createRadialGradient(T/2,T/2,0,T/2,T/2,T/2);M.addColorStop(0,"rgba(255,255,255,1)"),M.addColorStop(.34,"rgba(255,255,255,.86)"),M.addColorStop(.62,"rgba(255,255,255,.22)"),M.addColorStop(1,"rgba(255,255,255,0)"),A.fillStyle=M,A.fillRect(0,0,T,T)},64),l=ui(20261),c=105,h=[],d=[],m=new $t("#e6efff"),u=new $t("#ffe8c6"),p=new $t("#bcd3ff");for(let A=0;A<c;A++){const T=l()*Math.PI*2,M=.9+Math.pow(l(),.65)*.58,S=49+l()*3,R=Math.cos(M);h.push(Math.sin(T)*R*S,Math.sin(M)*S,-Math.cos(T)*R*S);const L=l(),I=(L>.72?u:L>.34?m:p).clone(),N=ye.clamp((M-.9)/.25,0,1),F=(.55+Math.pow(l(),1.4)*.45)*N;d.push(I.r*F,I.g*F,I.b*F)}const v=new De;v.setAttribute("position",new le(h,3)),v.setAttribute("color",new le(d,3));const g=new W0(v,new Ed({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Or,fog:!1,toneMapped:!1,alphaTest:.01}));g.renderOrder=-20,g.frustumCulled=!1,g.name="sky-stars",i.add(g);const f=new D(-.16,.883,-.442).normalize(),x=f.clone().multiplyScalar(44),y=fe((A,T,M)=>{const S=T*.47,R=T/2,L=T/2;A.clearRect(0,0,T,T);const I=A.createRadialGradient(R-S*.22,L-S*.26,S*.06,R,L,S);I.addColorStop(0,"#fbfcf7"),I.addColorStop(.62,"#e6e9ee"),I.addColorStop(.9,"#cfd5e0"),I.addColorStop(1,"#b9c1cf"),A.fillStyle=I,A.beginPath(),A.arc(R,L,S,0,Math.PI*2),A.fill(),A.save(),A.beginPath(),A.arc(R,L,S,0,Math.PI*2),A.clip();for(let F=0;F<26;F++){const z=M()*Math.PI*2,G=Math.sqrt(M())*S*.92,H=R+Math.cos(z)*G,Z=L+Math.sin(z)*G,tt=S*(.03+M()*.13),nt=A.createRadialGradient(H,Z,0,H,Z,tt);nt.addColorStop(0,`rgba(132,142,160,${.1+M()*.17})`),nt.addColorStop(1,"rgba(132,142,160,0)"),A.fillStyle=nt,A.beginPath(),A.arc(H,Z,tt,0,Math.PI*2),A.fill()}for(let F=0;F<5;F++){const z=M()*Math.PI*2,G=Math.sqrt(M())*S*.62,H=R+Math.cos(z)*G,Z=L+Math.sin(z)*G,tt=S*(.16+M()*.16),nt=A.createRadialGradient(H,Z,0,H,Z,tt);nt.addColorStop(0,"rgba(150,158,174,.16)"),nt.addColorStop(1,"rgba(150,158,174,0)"),A.fillStyle=nt,A.beginPath(),A.arc(H,Z,tt,0,Math.PI*2),A.fill()}const N=A.createRadialGradient(R,L,S*.2,R,L,S);N.addColorStop(0,"rgba(255,255,255,0)"),N.addColorStop(.78,"rgba(150,162,186,.13)"),N.addColorStop(1,"rgba(96,110,138,.42)"),A.fillStyle=N,A.beginPath(),A.arc(R,L,S,0,Math.PI*2),A.fill(),A.restore()},256);y.colorSpace=$e;const _=new Ch(new cc({map:y,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));_.position.copy(x),_.scale.set(2.25,2.25,1),_.name="sky-moon",i.add(_);const E=fe((A,T)=>{const M=A.createRadialGradient(T/2,T/2,0,T/2,T/2,T/2);M.addColorStop(0,"rgba(226,236,255,.9)"),M.addColorStop(.22,"rgba(198,216,255,.34)"),M.addColorStop(.5,"rgba(170,196,255,.10)"),M.addColorStop(1,"rgba(150,180,255,0)"),A.fillStyle=M,A.fillRect(0,0,T,T)},128),b=new Ch(new cc({map:E,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:Or,fog:!1,toneMapped:!1}));return b.position.copy(x).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:g,moon:_,glow:b,moonDirection:f.clone(),update(){}}}function __(){const i=new Pe(1,18,14),t=i.attributes.position;for(let e=0;e<t.count;e++){const n=t.getX(e),s=t.getY(e),r=t.getZ(e),a=Math.sign(n)*Math.pow(Math.abs(n),.76),o=Math.sign(s)*Math.pow(Math.abs(s),.84),l=Math.sign(r)*Math.pow(Math.abs(r),.78),c=ye.clamp((-l+1)*.5,0,1),h=.034+c*.011-Math.pow(c-.82,2)*.008,d=.0155-c*.0028;let m=a*h,u=o*d;const p=-.049+l*.052,v=(1-n*n)*.0048;u+=v,s<0&&(u+=(1-n*n)*(1-Math.abs(r))*.0022),t.setXYZ(e,m,u,p)}return i.computeVertexNormals(),i}function y_(i="right"){const t=new ne;t.name="vr-gloved-hand",t.visible=!1;const e=new Lt({color:9599329,emissive:2366227,emissiveIntensity:.48,roughness:.72,metalness:.05}),n=new Lt({color:6573627,emissive:1511434,emissiveIntensity:.42,roughness:.85,metalness:.04}),s=new Lt({color:11507324,emissive:2760727,emissiveIntensity:.45,roughness:.66,metalness:.06}),r=new Lt({color:2634816,emissive:593428,emissiveIntensity:.42,roughness:.89,metalness:.03}),a=new Lt({color:1778734,emissive:461842,emissiveIntensity:.42,roughness:.9,metalness:.03}),o=new Lt({color:2305851,emissive:593944,emissiveIntensity:.4,roughness:.86,metalness:.04}),l=new Lt({color:3877922,emissive:1182728,emissiveIntensity:.4,roughness:.62,metalness:.16}),c=new Lt({color:1119773,emissive:263946,emissiveIntensity:.35,roughness:.35,metalness:.35}),h=new Lt({color:14923896,emissive:7227417,emissiveIntensity:.55,roughness:.34,metalness:.58}),d=new Je({color:55639}),m=new Je({color:14680214}),u=new Yt(new Pe(.055,10,8),a);t.add(u);const p=new Yt(new Ee(.055,.046,1,12,1,!1),a);t.add(p);const v=new ne,g=new Yt(new Pe(.046,12,10),a);g.scale.set(.96,1.02,1.04),v.add(g);const f=new Yt(new er(.041,.0055,6,14),o);f.rotation.x=Math.PI*.45,v.add(f),t.add(v);const x=new Yt(new Ee(.046,.039,1,14,1,!1),a);t.add(x);const y=new ne;t.add(y);const _=new Yt(new Ee(.0405,.0415,.026,14),o);_.rotation.x=Math.PI*.5,_.scale.set(1,1,.78),_.position.set(0,0,.03),y.add(_);const E=new Yt(new Ee(.0355,.0375,.03,14),r);E.rotation.x=Math.PI*.5,E.scale.set(1,1,.74),E.position.set(0,0,.013),y.add(E);const b=new Yt(new Ee(.0368,.0375,.018,14),l);b.rotation.x=Math.PI*.5,b.scale.set(1.02,1,.75),b.position.set(0,0,.012),y.add(b);const A=new ne,T=new Yt(new $n(.031,.0045,.017),c);A.add(T);const M=new Yt(new Pe(.0022,6,5),d);M.position.set(0,.0026,-.0042),A.add(M);const S=new Yt(new Pe(.0022,6,5),m);S.position.set(0,.0026,.0042),A.add(S),y.add(A);const R=new Yt(new Pe(.0056,8,6),h);y.add(R);const L=new ne;t.add(L);const I=new ne;L.add(I);const N=new ne;N.scale.setScalar(1.16),I.add(N);const F=new Yt(new Pe(.028,10,8),e);F.scale.set(1.05,.68,.95),F.position.set(0,0,.002),N.add(F);const z=__(),G=new Yt(z,e);N.add(G);const H=new Yt(new Pe(.038,12,10),n);H.scale.set(1.02,.25,1.12),H.position.set(0,-.0095,-.048),N.add(H);const Z=new Yt(new Pe(.021,10,8),n);Z.scale.set(.84,.64,1.38),N.add(Z);const tt=new Yt(new Pe(.016,8,7),n);tt.scale.set(.7,.56,1.45),N.add(tt);const nt=[-1,0,1].map(wt=>{const Tt=new Yt(new Ee(.0017,.0019,.062,6),s);return Tt.rotation.x=Math.PI*.5,N.add(Tt),{mesh:Tt,idx:wt}}),Dt=[{baseX:-.031,yOff:.0015,zOff:-.094,l1:.035,l2:.023,l3:.016,w:.019,splay:-.058},{baseX:-.01,yOff:.0035,zOff:-.098,l1:.039,l2:.026,l3:.017,w:.0198,splay:-.012},{baseX:.011,yOff:.002,zOff:-.095,l1:.036,l2:.024,l3:.016,w:.0188,splay:.028},{baseX:.03,yOff:-.002,zOff:-.088,l1:.029,l2:.019,l3:.015,w:.0168,splay:.075}].map(wt=>{const Tt=new ne,pt=new Yt(new Pe(wt.w*.53,8,7),e);pt.scale.set(1.04,.88,1.05),Tt.add(pt);const Ot=new Yt(new Ee(wt.w*.52,wt.w*.45,wt.l1,9),e);Ot.rotation.x=Math.PI*.5,Ot.position.set(0,0,-wt.l1*.5),Tt.add(Ot);const k=new ne;k.position.set(0,0,-wt.l1),k.add(new Yt(new Pe(wt.w*.45,8,6),e));const ct=new Yt(new Ee(wt.w*.45,wt.w*.39,wt.l2,9),e);ct.rotation.x=Math.PI*.5,ct.position.set(0,0,-wt.l2*.5),k.add(ct);const mt=new ne;mt.position.set(0,0,-wt.l2),mt.add(new Yt(new Pe(wt.w*.39,8,6),e));const Et=new Yt(new Ee(wt.w*.39,wt.w*.32,wt.l3,9),e);Et.rotation.x=Math.PI*.5,Et.position.set(0,0,-wt.l3*.5),mt.add(Et);const vt=new Yt(new Pe(wt.w*.33,8,6),s);return vt.scale.set(1,.86,1.12),vt.position.set(0,-6e-4,-wt.l3),mt.add(vt),k.add(mt),Tt.add(k),N.add(Tt),{spec:wt,mcp:Tt,pip:k,dip:mt}}),kt=new ne;kt.add(new Yt(new Pe(.0155,8,7),e));const qt=new Yt(new Ee(.015,.0122,.032,9),e);qt.rotation.x=Math.PI*.5,qt.position.set(0,0,-.016),kt.add(qt);const J=new ne;J.position.set(0,0,-.032),J.add(new Yt(new Pe(.0122,8,6),e));const et=new Yt(new Ee(.012,.0102,.026,9),e);et.rotation.x=Math.PI*.5,et.position.set(0,0,-.013),J.add(et);const _t=new ne;_t.position.set(0,0,-.026),_t.add(new Yt(new Pe(.0102,8,6),e));const yt=new Yt(new Ee(.01,.0084,.02,9),e);yt.rotation.x=Math.PI*.5,yt.position.set(0,0,-.01),_t.add(yt);const St=new Yt(new Pe(.0086,8,6),s);St.scale.set(1,.85,1.12),St.position.set(0,-6e-4,-.02),_t.add(St),J.add(_t),kt.add(J),N.add(kt);let Wt=null,Kt=.3,O=.6,ot=0,st=0,it=0,q=0;function ht(wt){const Tt=wt==="left"?"left":"right";if(Tt===Wt)return;Wt=Tt;const pt=Tt==="left"?-1:1;N.rotation.set(.05,pt*.06,pt*.24),Z.position.set(-pt*.024,-.011,-.032),Z.rotation.y=pt*.28,tt.position.set(pt*.027,-.01,-.043);for(const{mesh:Ot,idx:k}of nt){const ct=k===0?.0195:.0178;Ot.position.set(pt*k*.016,ct,-.049),Ot.rotation.y=-pt*k*.042}for(const Ot of Dt)Ot.mcp.position.set(pt*Ot.spec.baseX,Ot.spec.yOff,Ot.spec.zOff);kt.position.set(-pt*.039,-.005,-.028),kt.rotation.set(.08,pt*.58,-pt*.24),A.position.set(-pt*.005,.0285,.012),A.rotation.z=pt*.12,R.position.set(pt*.027,.021,.012)}function lt(wt,Tt,pt=0,Ot=0){const k=Wt==="left"?-1:1;for(let mt=0;mt<Dt.length;mt++){const Et=Dt[mt],vt=pt*Math.sin(ot+mt*.9)*.16,at=mt*.048,zt=ye.clamp(wt+at+vt+Ot,.03,1.35);Et.mcp.rotation.x=-zt*.56,Et.pip.rotation.x=-zt*.78,Et.dip.rotation.x=-zt*.52,Et.mcp.rotation.y=-k*Et.spec.splay*Tt}const ct=ye.clamp(wt*.85+Ot*.5,.02,1.15);kt.rotation.x=.08-ct*.28,kt.rotation.y=k*(.58-ct*.24),J.rotation.x=-ct*.44,_t.rotation.x=-ct*.52}ht(i),lt(Kt,O,0,0);const gt=new D,Vt=new D,Gt=new D,P=new D,w=new D,V=new D,Y=new D,rt=new D,$=new D,Rt=new D,ft=new D,Nt=new D,Bt=new D,xt=new he,Ct=new D(0,1,0);return{group:t,wristPivot:L,setHandSide:ht,getHandSide:()=>Wt,update(wt,{visible:Tt=!1,handSide:pt=Wt,shoulderPos:Ot=null,elbowPos:k=null,pos:ct={x:.16,y:-.22,z:-.5},vel:mt={x:0,y:0,z:0},qArm:Et=[0,0,0,1],reach:vt=.25,elbowBendDeg:at=60,overBin:zt=!1,phase:te="search",calmLowerProgress:ge=0,beaconActive:de=!1}={}){if(t.visible=Tt,!Tt)return;const fn=Math.min(.1,wt||1/60);ht(pt);const gn=Wt==="left"?-1:1;q+=fn*1.6;const or=Math.sin(q)*7e-4;Gt.set(ct.x,ct.y+or,ct.z),Ot?gt.set(Ot.x,Ot.y,Ot.z):gt.set(gn*.21,-.27,-.08),k?Vt.set(k.x,k.y+or*.5,k.z):Vt.set(gn*.24,-.44,-.26),L.position.copy(Gt),L.quaternion.set(Et[0],Et[1],Et[2],Et[3]);const di=ye.clamp(-mt.y*.08,-.15,.15),lr=ye.clamp(mt.x*.07,-.13,.13),cr=1-Math.exp(-fn*16);st+=(di-st)*cr,it+=(lr-it)*cr,I.rotation.set(st,it,0),u.position.copy(gt),w.copy(gt).sub(Vt);const jr=Math.max(.08,w.length());p.position.copy(Vt).addScaledVector(w,.5),p.scale.set(.96,jr,.92),p.quaternion.setFromUnitVectors(Ct,w.normalize()),v.position.copy(Vt),v.quaternion.copy(p.quaternion);const xs=.92+ye.clamp(at/120,0,1)*.16;f.scale.setScalar(xs),V.copy(Gt).sub(Vt);const Qr=Math.max(.1,V.length());V.divideScalar(Qr),ft.copy(V).negate(),Y.set(0,1,0).applyQuaternion(L.quaternion),Rt.copy(Y).addScaledVector(ft,-Y.dot(ft)),Rt.lengthSq()<1e-4?(rt.set(1,0,0).applyQuaternion(L.quaternion),$.copy(rt).addScaledVector(ft,-rt.dot(ft)).normalize(),Rt.crossVectors(ft,$).normalize()):(Rt.normalize(),$.crossVectors(Rt,ft).normalize(),Rt.crossVectors(ft,$).normalize()),xt.makeBasis($,Rt,ft),y.position.copy(Gt),y.quaternion.setFromRotationMatrix(xt),P.copy(Gt).addScaledVector(ft,.036),w.copy(Vt).sub(P);const _s=Math.max(.06,w.length());x.position.copy(P).addScaledVector(w,.5),Nt.copy(w).normalize(),Bt.crossVectors($,Nt).normalize(),xt.makeBasis($,Nt,Bt),x.quaternion.setFromRotationMatrix(xt),x.scale.set(1,_s,.78);let fi=.28,pi=.58,ta=0;te==="search"?vt>=.58&&zt?(fi=.14,pi=1.05,ta=1,ot+=fn*9.5):ct.y<-.34?(fi=.48,pi=.32):ct.y>.1?(fi=.18,pi=.9):(fi=.32,pi=.52):te==="inspect"&&(fi=.2+ge*.86,pi=(1-ge)*.78+.15);const ea=1-Math.exp(-fn*13);Kt+=(fi-Kt)*ea,O+=(pi-O)*ea,lt(Kt,O,ta,st*.85),ge>.05?(h.emissive.setHex(8963184),h.emissiveIntensity=.6+ge*.95):de?(h.emissive.setHex(7121032),h.emissiveIntensity=.58):(h.emissive.setHex(7227417),h.emissiveIntensity=.45),d.color.setHex(de?65382:1993533),m.color.setHex(de?16711850:7020114)},dispose(){u.geometry.dispose(),p.geometry.dispose(),g.geometry.dispose(),f.geometry.dispose(),x.geometry.dispose(),_.geometry.dispose(),E.geometry.dispose(),b.geometry.dispose(),T.geometry.dispose(),R.geometry.dispose(),F.geometry.dispose(),z.dispose(),H.geometry.dispose(),Z.geometry.dispose(),tt.geometry.dispose(),e.dispose(),n.dispose(),s.dispose(),r.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose(),h.dispose(),d.dispose(),m.dispose()}}}const Mn=ui(137);function vl(i){i.updateWorldMatrix(!0,!0);const t=new he().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new he().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=Yd(s,!1);if(r){const a=new Yt(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class M_{constructor(t){this.renderer=new xx({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ku,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=$e,this.renderer.toneMapping=Lc,this.renderer.toneMappingExposure=1.12,this.scene=new lc,this.scene.background=new $t("#16222f"),this.scene.fog=new Gc("#1c2b3a",.0118),this.sky=x_(),this.scene.add(this.sky.group),this.camera=new nn(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new nn(62,1,.1,70),this.eyeR=new nn(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new D,this.baseCameraQuaternion=new cn,this.lockedCameraQuaternion=new cn,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null;const e=new mc(this.renderer),n=new Tx;this.envTarget=e.fromScene(n,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.15,n.dispose(),e.dispose(),this.hemi=new kh(9087958,1318439,1.12),this.scene.add(this.hemi);const s=new Pa(11127024,1.62);s.position.set(-6,11,2),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-6,s.shadow.camera.right=6,s.shadow.camera.top=7,s.shadow.camera.bottom=-6,s.shadow.normalBias=.012,s.shadow.bias=-25e-5,s.shadow.radius=3,this.scene.add(s),this.sun=s;const r=new Pa(5338012,.62);r.position.set(5,5,-4),this.scene.add(r),this.static=new ne,this.scene.add(this.static),Mu(.5),this.buildCourtyard(),Mu(1),vl(this.static),this.bin=new ne,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new Yt(new ue(1,1),new Je({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new ne,this.silhouetteMat=new Je({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new ne,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2),this.vrHand=y_(),this.camera.add(this.vrHand.group),this.vrHandMode=!1,this.handInspectHeadBase=null,this.itemBaseRot=[0,0,0],this.tossGroup=new ne,this.scene.add(this.tossGroup),this.tossState=null;const a=fe((o,l)=>{const c=o.createRadialGradient(l/2,l/2,0,l/2,l/2,l/2);c.addColorStop(0,"rgba(3,7,11,.62)"),c.addColorStop(.55,"rgba(3,7,11,.34)"),c.addColorStop(1,"rgba(3,7,11,0)"),o.fillStyle=c,o.fillRect(0,0,l,l)},128);this.itemShadow=new Yt(new ue(1,1),new Je({map:a,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new ro(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new ro(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new Ux(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new qd,this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new dt,this.raycaster=new Np,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",o=>{this.reduced=o.matches,o.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildCourtyard(){const t=new Lt({..._u("courtyard-stone",[18,18]),normalScale:new dt(1.2,1.2),roughness:.7,metalness:.13,color:10133666});It(new ue(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new Od().load("./assets/plaster.jpg");e.colorSpace=$e,e.wrapS=e.wrapT=Wi,e.repeat.set(3,3),e.anisotropy=4;const n=new Lt({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new Lt({color:8225402,roughness:.9}),a=new Lt({color:10724502,roughness:.84}),o=new Lt({color:2897456,roughness:.78}),l=new Lt({color:2436659,metalness:.32,roughness:.74}),c=fe((f,x)=>{const y=f.createLinearGradient(0,0,x,x);y.addColorStop(0,"#788b91"),y.addColorStop(.48,"#495b60"),y.addColorStop(1,"#1d302c"),f.fillStyle=y,f.fillRect(0,0,x,x),f.save(),f.transform(1,.16,-.07,1,0,0);for(let E=-30;E<x;E+=94){f.fillStyle="#283b3a",f.fillRect(E,70,65,x);for(let b=94;b<x;b+=104)f.fillStyle="#83938b",f.globalAlpha=.24,f.fillRect(E+6,b,24,66),f.fillRect(E+34,b,24,66)}f.restore();const _=f.createLinearGradient(0,0,x,x*.8);_.addColorStop(0,"rgba(238,246,238,.20)"),_.addColorStop(.38,"rgba(238,246,238,.03)"),_.addColorStop(.62,"rgba(238,246,238,0)"),f.fillStyle=_,f.beginPath(),f.moveTo(0,x),f.lineTo(x*.52,0),f.lineTo(x*.78,0),f.lineTo(x*.24,x),f.closePath(),f.fill(),f.fillStyle="rgba(18,31,31,.55)",f.beginPath(),f.moveTo(0,82),f.lineTo(120,38),f.lineTo(150,38),f.lineTo(150,12),f.lineTo(178,12),f.lineTo(178,34),f.lineTo(335,66),f.lineTo(360,30),f.lineTo(386,30),f.lineTo(386,72),f.lineTo(512,96),f.lineTo(512,0),f.lineTo(0,0),f.closePath(),f.fill(),f.fillStyle="rgba(255,190,110,.5)";for(let E=0;E<24;E++)f.fillRect(28+E*67%470,150+E*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(f=>new Lt({color:f,map:c,metalness:.24,roughness:.28})),d=nf,m=(f,x,y,_,E)=>{const b=new ne;b.position.set(...y),b.rotation.y=_,this.static.add(b),B(b,[f,x,.65],[0,x/2,0],E,0),B(b,[f,.75,.78],[0,.375,.025],r,0);for(const T of[3.2,6.15,9.1,12.1])B(b,[f,.14,.87],[0,T,.055],a,0),B(b,[f,.07,.98],[0,T+.09,.08],r,0);B(b,[f,.35,1.06],[0,x-.12,.05],a,0),l_(b,f,x,_===0?0:_>0?37:73),wu(b,f,x,l,a);let A=Math.floor(f/2.45);for(let T=0;T<A;T++)for(let M=0;M<4;M++){let S=(T-(A-1)/2)*2.47,R=1.72+M*2.95;if(_===0&&M===0&&Math.abs(S+3.8)<1.2)continue;const L=1.16,I=1.91;B(b,[L+.26,I+.27,.14],[S,R,.38],a,0),B(b,[L+.05,I+.06,.1],[S,R,.47],o,0);const N=Xd(T,M,_===0?0:_>0?1:2),F=N==="lit"?d:h[(T+M)%h.length];B(b,[L,I,.04],[S,R,.54],F,0);for(const z of[-L/2,L/2,0])B(b,[.048,I,.09],[S+z,R,.58],r,0);for(const z of[-I/2,I/2,.24])B(b,[L,.047,.09],[S,R+z,.58],r,0);B(b,[L+.4,.12,.43],[S,R-I/2-.09,.55],a,0),Qd(b,S,R,L,I,r,o,a),ef(b,S,R,L,I,N,a,F,(_>0?100:200)+M*10+T)}for(const T of[-f/2+.35,f/2-.38]){Ft(b,.07,.07,x,[T,x/2,.53],o,[0,0,0],12);for(let M=1;M<x;M+=2)Ft(b,.087,.087,.055,[T,M,.53],U.rust,[0,0,0],12)}for(let T=0;T<13;T++){const M=(Mn()-.5)*f,S=.8+Mn()*.3;B(b,[.2+Mn()*.7,.06+Mn()*.14,.02],[M,S,.335],r,0)}return b};m(20,14,[-8,0,1.5],Math.PI/2,s),m(20,14,[9,0,1.5],-Math.PI/2,n),m(20,13.5,[.5,0,11.6],Math.PI,n);const u=new ne;u.position.set(0,0,-7),this.static.add(u),v_(u,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:d,seed:101,gateX:1.55}),wu(u,20,13.5,l,a);const p=new Lt({map:vc("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});B(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],U.black),It(new ue(.75,.55),p,this.static,[-2.75,2.5,-6.465]),B(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),B(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let f=0;f<6;f++)B(this.static,[.45,.025,.015],[4.1,1.65+f*.07,-6.415],U.black,0);Ft(this.static,.036,.036,18,[0,5.35,-6.48],U.rust,[0,0,Math.PI/2],12);for(let f=0;f<2;f++){const x=new fs([new D(-8,9+f,2),new D(0,7.8+f,1),new D(9,9+f,-1)]);It(new si(x,24,.012,4,!1),U.black,this.static)}for(const f of[-7.2,8.2])B(this.static,[.24,.17,22],[f,.065,0],r,.025);const v=new Lt({color:8350016,roughness:1,side:ze});for(let f=0;f<50;f++){let x=(Mn()-.5)*13,y=(Mn()-.5)*14;It(new Xi(.025+Mn()*.035,5),v,this.static,[x,.008,y],[-Math.PI/2,Mn()*3,Mn()*6])}const g=new Lt({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let f=0;f<10;f++)It(new Xi(.55+Mn(),40),g,this.static,[(Mn()-.5)*10,.005,(Mn()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+Mn()*.45,1);this.buildProps(),h_(this.static,this.scene)}buildProps(){const t=this.static,e=new Lt({color:1647901,roughness:.64,metalness:.03,bumpMap:U.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of Wd){const d=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([p,v])=>new dt(p*h*1.7,v*h*1.55)),m=new So(d,64),u=m.attributes.position;for(let p=0;p<u.count;p++){const v=u.getX(p),g=u.getY(p),f=u.getZ(p),x=Math.atan2(f,v),y=1+.08*Math.sin(x*13+g*12)+.045*Math.sin(x*21-g*7);u.setXYZ(p,v*y,g,f*y)}m.computeVertexNormals(),It(m,e,t,[l,.02,c]),be(t,.066*h,.018,[l,h*1.66,c],U.black,[Math.PI/2,0,0]);for(let p=0;p<3;p++)B(t,[.042,.16,.027],[l+Math.sin(p*2)*.04,h*1.84,c+Math.cos(p*2)*.035],e,.006,[.2,p*2,.23])}const n=new ne;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){be(n,.48,.038,[l,0,0],U.black),be(n,.44,.014,[l,0,0],U.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const d=new D(l,0,0),m=new D(l+Math.cos(h)*.44,Math.sin(h)*.44,0),u=new uc(d,m);It(new si(u,1,.004,3),U.silver,n)}}const s=(l,c)=>{const h=new D(...l),d=new D(...c);It(new si(new uc(h,d),1,.025,6),U.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);B(n,[.32,.07,.16],[-.23,.72,0],U.black),B(n,[.3,.035,.04],[.57,.86,0],U.silver);const r=new Lt({color:8090716,roughness:1});B(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)B(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],U.black,0);const a=gl("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=gl("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new Lt({..._u("steel-paint"),normalScale:new dt(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new Lt({color:2505773,roughness:.58,metalness:.06,bumpMap:U.leather.bumpMap,bumpScale:.007}),r=new $n(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let u=0;u<a.count;u++){let p=a.getY(u);const v=.9+(p+.8)*.0625;a.setX(u,a.getX(u)*v),a.setZ(u,a.getZ(u)*v),Math.abs(a.getZ(u))>.7&&a.setZ(u,a.getZ(u)+-.026*Math.exp(-((a.getX(u)-.35)**2+(p-.1)**2)*9))}r.computeVertexNormals(),It(r,e,t,[0,1.22,0]),B(t,[2.68,.105,1.83],[0,2.02,0],n,.035),B(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const u of[-1.08,1.08])B(t,[.055,1.51,.05],[u,1.2,.812],n,.008),B(t,[.055,1.5,.05],[u,1.2,-.813],n,.008);for(const u of[-.69,.69])B(t,[.044,1.22,.054],[u,1.26,.849],n,.008),B(t,[.044,1.22,.054],[u,1.26,-.849],n,.008);for(const u of[-1.275,1.275])B(t,[.06,.065,1.25],[u,1.65,0],n),B(t,[.065,1.3,.05],[u,1.23,.5],n),B(t,[.065,1.3,.05],[u,1.23,-.5],n),B(t,[.19,.18,.7],[u,1.7,0],n),B(t,[.06,.08,.6],[u*1.11,1.7,0],U.silver);for(const u of[-.95,.95])for(const p of[-.58,.58])B(t,[.15,.19,.12],[u,.35,p],U.silver),Ft(t,.18,.18,.15,[u,.19,p],U.black,[0,0,Math.PI/2],28),Ft(t,.067,.067,.16,[u,.19,p],U.silver,[0,0,Math.PI/2],24);this.lid=new ne,this.lid.position.set(0,2.08,-.92),t.add(this.lid),B(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let u=-4;u<=4;u++)B(this.lid,[.065,.07,1.66],[u*.27,.11,.94],n,.026);B(this.lid,[.65,.09,.1],[0,.045,1.99],U.black,.025);for(const u of[-.87,.87])Ft(t,.095,.095,.31,[u,2.06,-.93],U.silver,[0,0,Math.PI/2]);const o=fe((u,p,v)=>{u.fillStyle="#cac9ad",u.textAlign="center",u.font="bold 110px Arial",u.fillText("Т Б О",p/2,220),u.font="bold 82px Arial",u.fillText("№ 017",p/2,347),u.globalCompositeOperation="destination-out";for(let g=0;g<1600;g++)u.globalAlpha=v()*.7,u.fillRect(v()*p,v()*p,1+v()*4,1+v()*3)}),l=new Lt({map:o,transparent:!0,depthWrite:!1,roughness:.9});It(new ue(.73,.56),l,t,[.62,1.31,.865]);const c=new Lt({map:vc("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});It(new ue(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=fe((u,p)=>{u.fillStyle="#d3cdb5",u.fillRect(0,0,p,p),u.fillStyle="#93493c";for(let v=-p;v<p*2;v+=130)u.beginPath(),u.moveTo(v,0),u.lineTo(v+64,0),u.lineTo(v+p+64,p),u.lineTo(v+p,p),u.fill();dn(u,p,p,ui(25),5e3)}),d=new Lt({map:h,roughness:.75});for(const u of[-1.1,1.1])It(new ue(.16,.53),d,t,[u,1.33,.847]);const m=fe((u,p)=>{const v=u.createRadialGradient(p/2,p/2,0,p/2,p/2,p*.48);v.addColorStop(0,"rgba(0,8,4,.8)"),v.addColorStop(.5,"rgba(0,8,4,.5)"),v.addColorStop(1,"rgba(0,8,4,0)"),u.fillStyle=v,u.fillRect(0,0,p,p)},128);It(new ue(4.5,3.5),new Je({map:m,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),m_(t,this.lid),t.remove(this.lid),vl(t),vl(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=ye.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=ye.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=ye.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var c;this.dirty=!0;const t=innerWidth,e=innerHeight;this.renderer.setSize(t,e),this.camera.aspect=t/e;const n=t/e<.8;this.camera.fov=n?52:43;const s=!n&&e<=520&&t>650,r=!n&&!s&&t>1050;if(this.camera.position.set(s?4.15:r?4.3:n?2.6:4.2,s?2.65:r?3.4:n?3.5:3.55,s?8.1:r?7.4:n?10.3:7.8),this.camera.lookAt(s?.25:r?.6:n?.9:0,s?1.32:r?2.65:n?2.6:2.4,0),this.viewOverride){const{fov:h=this.camera.fov,position:d,target:m}=this.viewOverride;this.camera.fov=h,d&&this.camera.position.set(...d),m&&this.camera.lookAt(...m)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=n;const a=getComputedStyle(document.documentElement);if(this.stage=bx(t,e,parseFloat(a.getPropertyValue("--safe-top"))||0,parseFloat(a.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const h=Math.min(t/2,e)*.72;this.stage={x:(t/2-h)/2,y:(e-h)/2,width:h,height:h}}const o=2*4.2*Math.tan(ye.degToRad(this.camera.fov/2))/e;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-t/2)*o,(e/2-this.stage.y-this.stage.height/2)*o,-4.2);const l=this.vrStereo?62:this.camera.fov;this.inspectionVeil.scale.set(12*Math.tan(ye.degToRad(l/2))*t/e,12*Math.tan(ye.degToRad(l/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(c=this.pipeline)==null||c.resize(t,e,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new qn(new D(...t.min),new D(...t.max));e.applyMatrix4(new he().makeRotationFromQuaternion(this.item.quaternion));const n=e.getSize(new D).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(ye.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):gu(n,this.stage,innerHeight,this.camera.fov,4.2,innerWidth),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new qn(new D(...t.min),new D(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new D(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*innerWidth/2,y:(1-o.y)*innerHeight/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.vrHand&&(this.vrHand.group.visible=!1)),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,innerWidth,innerHeight),this.applyCameraPose(),this.resize(),this.item&&this.applyReveal(),this.dirty=!0}setVrHandMode(t){this.vrHandMode=!!t,!t&&this.vrHand&&(this.vrHand.group.visible=!1),t&&this.vrInspectLock&&this.unlockInspectionView(),this.dirty=!0}updateVrHand(t,e){if(!this.vrHand)return;const n=!!(this.vrStereo&&this.vrHandMode&&(e!=null&&e.visible));this.vrHand.update(t,{...e,visible:n}),n&&(this.dirty=!0)}handHitsBin(){var s,r;if(!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible))return this.gazeHitsBin();this.camera.updateMatrixWorld(!0),this.vrHand.wristPivot.updateMatrixWorld(!0);const e=this.vrHand.wristPivot.localToWorld(new D(0,0,-.15)).clone().sub(this.camera.position).normalize();if(this.raycaster.set(this.camera.position,e),this.raycaster.intersectObject(this.bin,!0).length>0)return!0;const n=new D(0,1.25,0).sub(this.camera.position).normalize();return e.angleTo(n)<=.44}setHandItemRotation(t=0,e=0,n=0,s=null){if(!this.item)return;const[r,a,o]=this.itemBaseRot||[0,0,0];if(this.targetX=r+t,this.targetY=a+e,this.targetZ=o+n,Array.isArray(s)&&s.length===4){const l=new cn(s[0],s[1],s[2],s[3]);this.targetItemQuat=l.multiply(this.itemBaseQuat||new cn)}else this.targetItemQuat=null;this.pose="hand",this.dirty=!0}launchDiscardToss(t={x:4.5,y:2.4,z:-6.5}){if(!this.item||this.reduced)return;this.camera.updateMatrixWorld(!0),this.item.updateMatrixWorld(!0);const e=new D,n=new cn,s=new D;this.item.matrixWorld.decompose(e,n,s);const r=this.item.clone(!0);r.remove(this.silhouette),r.matrixAutoUpdate=!0,r.position.copy(e),r.quaternion.copy(n),r.scale.copy(s),this.tossGroup.clear(),this.tossGroup.add(r);const a=new D(t.x??4.5,t.y??2.4,t.z??-6.5).applyQuaternion(this.camera.quaternion);this.tossState={mesh:r,t:0,dur:.42,vx:a.x,vy:a.y,vz:a.z},this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&!this.vrHandMode&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=ye.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=ye.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else if(this.applyCameraPose(),this.vrStereo&&this.vrHandMode&&this.inspect&&this.handInspectHeadBase){const n=ye.euclideanModulo(this.headLook.yaw-this.handInspectHeadBase.yaw+Math.PI,Math.PI*2)-Math.PI,s=this.headLook.pitch-this.handInspectHeadBase.pitch;this.itemAnchor.position.set(ye.clamp(-n*2.4,-.95,.95),ye.clamp(-s*2.4,-.7,.7),-4.2),this.updateItemLights()}return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.vrHandMode?this.vrInfo():(this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo())}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=innerWidth,e=innerHeight){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new D(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=innerWidth,e=innerHeight,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){var e,n,s,r,a,o,l;const t=ye.radToDeg;return{stereo:!!this.vrStereo,handMode:!!this.vrHandMode,handSide:((n=(e=this.vrHand)==null?void 0:e.getHandSide)==null?void 0:n.call(e))||"right",handVisible:!!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible),handPosition:((l=(o=(a=this.vrHand)==null?void 0:a.wristPivot)==null?void 0:o.position)==null?void 0:l.toArray().map(c=>+c.toFixed(3)))||null,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),targetZ:+t(this.targetZ||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(c=>+c.toFixed(5))}}hitBin(t,e){return this.pointer.set(t/innerWidth*2-1,-e/innerHeight*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}binScreen(){this.camera.updateMatrixWorld(!0);const t=new D(0,1.2,0).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new D(-1.26,1.12,.22).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,gl(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.vrStereo||(this.headLook={yaw:0,pitch:0}),this.handInspectHeadBase={...this.headLook},this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=jn[t].lamp??17,this.itemRim.intensity=jn[t].rim??18,this.updateItemLights(),this.item.rotation.set(...jn[t].rotation),this.itemBaseRot=[...jn[t].rotation],this.itemBaseQuat=this.item.quaternion.clone(),this.targetItemQuat=null,this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new Yt(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&!this.vrHandMode&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.handInspectHeadBase=null,this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=mu(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=jn[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=wx(this.itemId,t),this.targetItemQuat=null,this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=ye.clamp(Math.round((this.zoom+t)*100)/100,ao.min,ao.max),this.dirty=!0,this.zoom}rotate(t,e){this.targetItemQuat&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null),this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=ye.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.5)),this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new lc;o.background=new $t("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new kh(15069183,8288624,1.1));const l=new Pa(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new Pa(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new wn(160,160,{type:li}),d=new wn(160,160,{depthBuffer:!1}),m=this.renderer.getRenderTarget(),u=this.renderer.getClearColor(new $t),p=this.renderer.getClearAlpha();let v;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...jn[t].rotation),e.scale.setScalar(1);const g=e.userData.bounds,f=new qn(new D(...g.min),new D(...g.max));f.applyMatrix4(new he().makeRotationFromEuler(e.rotation));const x=f.getSize(new D).multiplyScalar(.5);e.scale.setScalar(gu(x,{x:8,y:12,width:144,height:136},160,34));const y=new nn(34,1,.1,20);y.position.set(0,0,4.2),y.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,y),this.thumbnailOutput.render(this.renderer,d,h);const _=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(d,0,0,160,160,_);const E=document.createElement("canvas");E.width=E.height=160;const b=E.getContext("2d"),A=b.createImageData(160,160);for(let T=0;T<160;T++)A.data.set(_.subarray((159-T)*640,(160-T)*640),T*640);b.putImageData(A,0,0),v=E.toDataURL("image/png"),this.thumbCache.set(t,v)}finally{this.renderer.setRenderTarget(m),this.renderer.setClearColor(u,p),d.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return v}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.tossState){const n=this.tossState;n.t+=t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.vy-=14*t,n.mesh.rotation.x+=t*9,n.mesh.rotation.z-=t*7,n.mesh.scale.multiplyScalar(Math.max(.82,1-t*2.2)),this.dirty=!0,n.t>=n.dur&&(this.tossGroup.clear(),this.tossState=null)}if(this.item){const n=this.item.quaternion.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.pose==="hand"&&this.targetItemQuat?this.item.quaternion.slerp(this.targetItemQuat,s):(this.item.rotation.y=ye.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=ye.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=ye.lerp(this.item.rotation.z,this.targetZ,s)),n.angleTo(this.item.quaternion)>1e-4&&this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/_x),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||mu(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const mn=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],sf={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},rf="white-night-finds-v1";function $r(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>mn.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>mn.some(e=>e.id===t)).slice(0,3):[]}}function S_(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*mn.reduce((e,n)=>e+n.weight,0);return mn.find(e=>(t-=e.weight)<0)??mn.at(-1)}function Ro(i,t){if(t.type==="reset")return $r();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=mn.some(n=>n.id===t.itemId)?t.itemId:mn[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function b_(i){try{const t=JSON.parse(i.getItem(rf)||"{}");return $r((t==null?void 0:t.version)===1?t:{})}catch{return $r()}}function w_(i,t){try{return i.setItem(rf,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const yi=Math.PI/180,T_=new cn(-Math.sqrt(.5),0,0,Math.sqrt(.5)),Tu=new D(0,1,0),E_=new D(0,0,1);class A_{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new cn,this.basePitch=0,this.qNow=new cn,this.qScreen=new cn,this.relQ=new cn,this.fwdVec=new D,this.upVec=new D,this.euler=new Fn(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){if(!Number.isFinite(t)){const r=e*yi,a=n*yi,o=s*yi,l=-Math.cos(r)*Math.sin(a),c=Math.sin(r),h=Math.cos(r)*Math.cos(a),d=Math.cos(o),m=Math.sin(o);return this.upVec.set(l*d-c*m,l*m+c*d,h).normalize(),this.qNow.setFromUnitVectors(this.upVec,Tu)}return this.euler.set(e*yi,t*yi,-n*yi,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(T_),this.qScreen.setFromAxisAngle(E_,-s*yi),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.fwdVec.set(0,0,-1).applyQuaternion(this.qNow);const o=Math.hypot(this.fwdVec.x,this.fwdVec.z)>1e-4?Math.atan2(this.fwdVec.x,-this.fwdVec.z):0;this.baseQ.setFromAxisAngle(Tu,-o),this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.basePitch=this.euler.x,this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x-this.basePitch},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/yi).toFixed(2),pitchDeg:+(this.raw.pitch/yi).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Hn=Math.PI/180,Jn=(i,t,e)=>Math.min(e,Math.max(t,i)),zi=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},R_=1.5,C_=.5,P_=.14,I_=.05,L_=9,D_=.3,U_=.75,N_=3,Eu=20*Hn,Au=15*Hn,Ru=6*Hn,F_=.35,O_=3,z_=.6,Cu=1.2,Pu=.8,Iu=12*Hn;class k_{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-45,pitchMaxDeg:n=62}={}){this.yawLimit=Math.abs(t)*Hn,this.pitchMin=Math.min(e,n)*Hn,this.pitchMax=Math.max(e,n)*Hn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=Jn(t,-this.yawLimit,this.yawLimit),this.pitch=Jn(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=Jn(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>O_&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=z_?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=Jn(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=Jn(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=zi(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=Jn(L_*Math.max(e,1/60),D_,U_);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(zi(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=N_&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(zi(t.yaw-this.yaw))>Eu||Math.abs(t.pitch-this.pitch)>Au,s=!this.anchorTrack||Math.abs(zi(t.yaw-this.anchorTrack.yaw))>Eu||Math.abs(t.pitch-this.anchorTrack.pitch)>Au;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(zi(t.yaw-this.anchorCandidate.yaw))<=Ru&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=Ru?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=F_?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(zi(t.yaw-e.yaw))<=Iu&&Math.abs(t.pitch-e.pitch)<=Iu}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=Jn(zi(t.yaw-this.yaw)*n,-Cu*e,Cu*e),this.pitch+=Jn((t.pitch-this.pitch)*n,-Pu*e,Pu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?R_:C_,r=n?P_:I_,a=1-Math.exp(-s*e);this.yaw+=Jn(zi(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=Jn((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Hn).toFixed(2),pitchDeg:+(this.pitch/Hn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Hn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Hn).toFixed(2)}:null}}}const Bn=Math.PI/180,Ga=240,Wa=180,B_=62,H_=48,V_=.15,G_=.3,W_=900,X_=120,Lu=(i,t,e)=>Math.min(e,Math.max(t,i));function co(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function q_(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,d=-1e9,m=0,u=0,p=0;for(let x=0;x<e;x++)for(let y=0;y<t;y++){const _=(x*t+y)*4,{hue:E,sat:b,val:A,chroma:T}=co(i[_],i[_+1],i[_+2]);if(E<0)continue;let M=Math.abs(E-n);if(M>180&&(M=360-M),M>30||b<14||A<40||T<40)continue;p++,b>m&&(m=b),T>u&&(u=T);const S=(1-M/30)*(b/100);s+=y*S,r+=x*S,a+=S,o++,y<l&&(l=y),y>c&&(c=y),x<h&&(h=x),x>d&&(d=x)}if(o<15||a<=0)return{found:!1,bright:p,n:o};const v=c-l+1,g=d-h+1,f=o/Math.max(1,v*g);return v>t*.75||g>e*.75?{found:!1,bright:p,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:p,n:o,bbW:v,bbH:g,fill:f,maxSat:m,maxChroma:u,minX:l,maxX:c,minY:h,maxY:d}}function Y_(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function Du(i,t,e){return{yaw:-(i-e.x)*B_*Bn,pitch:(t-e.y)*H_*Bn}}function $_(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class Z_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=Ga,this.canvas.height=Wa),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<X_)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,Ga,Wa);const n=this.ctx.getImageData(0,0,Ga,Wa);return this.processImageData(n.data,Ga,Wa,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,d,m,u;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let p=0;p<2;p++){const v=this.markers[p],g=q_(t,e,n,this.defs[p].hue),f=((d=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:d[p])||null;if(v.hue=this.defs[p].hue,v.blob=g,v.found=!!g.found,v.shapeOk=$_(g,f,e,n),g.found){v.u=g.cx/Math.max(1,e),v.v=g.cy/Math.max(1,n),v.raw=Du(v.u,v.v,o);const x=(u=(m=this.calibration)==null?void 0:m.baseRaw)==null?void 0:u[p];v.delta=x?{yaw:v.raw.yaw-x.yaw,pitch:v.raw.pitch-x.pitch}:{...v.raw}}this.updateEntity(v,g.found&&v.shapeOk,s),v.usable=!!g.found&&v.entity&&v.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=V_*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=G_*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/Bn;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/Bn,(t.delta.pitch-e.delta.pitch)/Bn);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,d)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(d.delta.yaw-l.yaw,d.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*Bn;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*Bn){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*Bn){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>Du(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/Bn;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>W_?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=Lu(Math.round((t-n.left)/n.width*(r-1)),0,r-1),l=Lu(Math.round((e-n.top)/n.height*(a-1)),0,a-1);let c=null;for(let h=Math.max(0,l-4);h<=Math.min(a-1,l+4);h++)for(let d=Math.max(0,o-4);d<=Math.min(r-1,o+4);d++){const m=(h*r+d)*4,u=co(s[m],s[m+1],s[m+2]);u.hue>=0&&(!c||u.chroma>c.chroma)&&(c=u)}return c?{hue:c.hue,sat:c.sat,val:c.val,chroma:c.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(p=>p.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=Y_(a),h=Math.round((s.u??.5)*e),d=Math.round((s.v??.5)*n),m=Math.max(4,Math.round(s.w??56)),u=Math.max(4,Math.round(s.h??28));for(let p=Math.max(0,d-Math.floor(u/2));p<Math.min(n,d+Math.ceil(u/2));p++)for(let v=Math.max(0,h-Math.floor(m/2));v<Math.min(e,h+Math.ceil(m/2));v++){const g=(p*e+v)*4;t[g]=o,t[g+1]=l,t[g+2]=c,t[g+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/Bn).toFixed(2),pitchDeg:+(e.pitch/Bn).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const Xa=Math.PI/180;class J_{constructor(t=null){this.gyro=new A_,this.fusion=new k_,this.tracker=new Z_(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/Xa).toFixed(2),pitchDeg:+(this.look.pitch/Xa).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/Xa).toFixed(2),pitchDeg:+(this.markerSample.pitch/Xa).toFixed(2)}}}}const K_=Math.PI/180;class j_{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/K_,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const ts=200,es=150,Q_=90,Mi=8,ns=6,t2=400;function Uu(i,t){const e=Math.abs(i-t)%360;return e>180?360-e:e}function Nu(i,t,e,n,s=34){const r=t/Mi,a=e/ns,o=new Float64Array(Mi*ns),l=new Float64Array(Mi*ns),c=new Float64Array(Mi*ns);for(let F=0;F<e;F++){const z=Math.min(ns-1,F/a|0),G=F*t*4;for(let H=0;H<t;H++){const Z=G+H*4,tt=i[Z],nt=i[Z+1],bt=i[Z+2],{hue:Dt,sat:kt,val:qt,chroma:J}=co(tt,nt,bt);if(Dt<0||qt<72)continue;const et=qt>=205?20:36,_t=qt>=205?34:52;if(kt<et||J<_t)continue;const yt=Uu(Dt,n);if(yt>s)continue;const St=(1-yt/(s+1))*(.35+kt/100*.65)*Math.pow(qt/255,1.35),Wt=z*Mi+Math.min(Mi-1,H/r|0);o[Wt]+=St,l[Wt]+=H*St,c[Wt]+=F*St}}let h=0,d=t*.5,m=e*.5;for(let F=0;F<ns;F++)for(let z=0;z<Mi;z++){let G=0,H=0,Z=0;for(let tt=0;tt<=1&&F+tt<ns;tt++)for(let nt=0;nt<=1&&z+nt<Mi;nt++){const bt=(F+tt)*Mi+(z+nt);G+=o[bt],H+=l[bt],Z+=c[bt]}G>h&&(h=G,d=H/G,m=Z/G)}if(h<1.2)return{found:!1,count:0};const u=Math.max(22,Math.round(Math.min(t,e)*.24)),p=Math.max(0,Math.floor(d-u)),v=Math.min(t-1,Math.ceil(d+u)),g=Math.max(0,Math.floor(m-u)),f=Math.min(e-1,Math.ceil(m+u));let x=0,y=0,_=0,E=0,b=t,A=-1,T=e,M=-1;for(let F=g;F<=f;F++){const z=F*t*4;for(let G=p;G<=v;G++){if(Math.hypot(G-d,F-m)>u)continue;const H=z+G*4,Z=i[H],tt=i[H+1],nt=i[H+2],{hue:bt,sat:Dt,val:kt,chroma:qt}=co(Z,tt,nt);if(bt<0||kt<72)continue;const J=kt>=205?20:36,et=kt>=205?34:52;if(Dt<J||qt<et)continue;const _t=Uu(bt,n);if(_t>s)continue;const yt=(1-_t/(s+1))*(.35+Dt/100*.65)*(kt/255);x+=G*yt,y+=F*yt,_+=yt,E++,G<b&&(b=G),G>A&&(A=G),F<T&&(T=F),F>M&&(M=F)}}if(E<7||_<=0)return{found:!1,count:0};const S=A-b+1,R=M-T+1,L=E/Math.max(1,S*R);if(S>t*.45||R>e*.45||L<.25)return{found:!1,count:0};const I=x/_,N=y/_;return{found:!0,count:E,u:(I+.5)/t,v:(N+.5)/e,bbW:S,bbH:R,fill:L}}class e2{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.synthetic=!1,this.error=null,this.distalHue=144,this.proximalHue=320,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=ts,this.canvas.height=es),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastProcessAt=0,this.processMs=0,this.lastPairAt=-1e4,this.lastPairPos={u:.5,v:.55,spanNorm:.12},this.latest={status:"none",u:.5,v:.55,spanNorm:0,rollRad:0,distalFound:!1,proximalFound:!1,ts:0}}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}this.video&&this.video.srcObject&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}analyzeRgba(t,e=ts,n=es,s=performance.now(),r=n/e){const a=Nu(t,e,n,this.distalHue),o=Nu(t,e,n,this.proximalHue);return this._commitSpots(a,o,e,n,s,r)}_commitSpots(t,e,n,s,r,a=s/n){const o=Number.isFinite(a)&&a>.1?a:s/n,l=1.25/Math.hypot(1,o);if(t.found&&e.found){const h=(t.u-e.u)*l,d=(t.v-e.v)*o*l,m=Math.hypot(h,d),u=Math.max(1,t.count||1),p=Math.max(1,e.count||1),v=Math.max(u/p,p/u);if(m>=.018&&m<=.58&&v<=9){const g=(t.u+e.u)*.5,f=(t.v+e.v)*.5;return this.lastPairAt=r,this.lastPairPos={u:g,v:f,spanNorm:m},this.latest={status:"pair",u:g,v:f,spanNorm:m,rollRad:Math.atan2(-d,h),distalFound:!0,proximalFound:!0,ts:r},this.latest}}const c=t.found?t:e.found?e:null;return c&&r-this.lastPairAt<=t2&&Math.hypot(c.u-this.lastPairPos.u,c.v-this.lastPairPos.v)<=.2?(this.latest={status:"single",u:c.u,v:c.v,spanNorm:this.lastPairPos.spanNorm,rollRad:this.latest.rollRad,distalFound:!!t.found,proximalFound:!!e.found,ts:r},this.latest):(this.latest={...this.latest,status:"none",distalFound:!1,proximalFound:!1},this.latest)}process(t=!1,e=performance.now()){if(this.synthetic)return this.latest;if(!this.running||!this.video||!this.ctx||this.video.readyState<2)return this.latest;if(!t&&e-this.lastProcessAt<Q_)return this.latest;const n=performance.now();this.lastProcessAt=e;try{const s=this.video.videoWidth||ts,r=this.video.videoHeight||es;this.ctx.drawImage(this.video,0,0,ts,es);const a=this.ctx.getImageData(0,0,ts,es);this.analyzeRgba(a.data,ts,es,e,r/s)}catch{}return this.processMs=+(performance.now()-n).toFixed(2),this.latest}inject({distal:t=null,proximal:e=null}={},n=performance.now()){this.synthetic=!0,this.running=!0;const s=t?{found:!0,u:t.u,v:t.v,count:t.count??90}:{found:!1,count:0},r=e?{found:!0,u:e.u,v:e.v,count:e.count??90}:{found:!1,count:0};return this._commitSpots(s,r,ts,es,n)}sample(t=performance.now()){const e=this.latest.ts?t-this.latest.ts:1/0;return{...this.latest,fresh:e<=450&&this.latest.status!=="none",ageMs:Number.isFinite(e)?Math.round(e):null}}info(){const t=this.sample();return{running:this.running,synthetic:this.synthetic,error:this.error,status:t.status,fresh:t.fresh,u:+t.u.toFixed(3),v:+t.v.toFixed(3),spanNorm:+t.spanNorm.toFixed(4),rollDeg:+(t.rollRad*180/Math.PI).toFixed(1),distalFound:t.distalFound,proximalFound:t.proximalFound,processMs:this.processMs}}}const Te=Math.PI/180,wi=180/Math.PI,_c=.33,yc=.31;function se(i,t,e){return i<t?t:i>e?e:i}function Cn([i,t,e,n]){const s=Math.hypot(i,t,e,n);return s<1e-9?[0,0,0,1]:[i/s,t/s,e/s,n/s]}function Si([i,t,e,n]){return[-i,-t,-e,n]}function Xe(i,t){const[e,n,s,r]=i,[a,o,l,c]=t;return[r*a+e*c+n*l-s*o,r*o-e*l+n*c+s*a,r*l+e*o-n*a+s*c,r*c-e*a-n*o-s*l]}function Sr([i,t,e],n){const s=Math.hypot(i,t,e);if(s<1e-9)return[0,0,0,1];const r=n*.5,a=Math.sin(r)/s;return[i*a,t*a,e*a,Math.cos(r)]}function qe(i,t){const[e,n,s,r]=i,[a,o,l]=t,c=r*a+n*l-s*o,h=r*o+s*a-e*l,d=r*l+e*o-n*a,m=-e*a-n*o-s*l;return[c*r+m*-e+h*-s-d*-n,h*r+m*-n+d*-e-c*-s,d*r+m*-s+c*-n-h*-e]}function n2(i,t){const e=Math.abs(i[0]*t[0]+i[1]*t[1]+i[2]*t[2]+i[3]*t[3]);return 2*Math.acos(se(e,0,1))}function xl(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function Cr(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function Ti(i){const t=Math.hypot(i[0],i[1],i[2]);return t<1e-9?[1,0,0]:[i[0]/t,i[1]/t,i[2]/t]}function Fu(i,t,e){const n=i[0],s=t[0],r=e[0],a=i[1],o=t[1],l=e[1],c=i[2],h=t[2],d=e[2],m=n+o+d;let u,p,v,g;if(m>0){const f=Math.sqrt(m+1)*2;g=.25*f,u=(h-l)/f,p=(r-c)/f,v=(a-s)/f}else if(n>o&&n>d){const f=Math.sqrt(1+n-o-d)*2;g=(h-l)/f,u=.25*f,p=(s+a)/f,v=(r+c)/f}else if(o>d){const f=Math.sqrt(1+o-n-d)*2;g=(r-c)/f,u=(s+a)/f,p=.25*f,v=(l+h)/f}else{const f=Math.sqrt(1+d-n-o)*2;g=(a-s)/f,u=(r+c)/f,p=(l+h)/f,v=.25*f}return Cn([u,p,v,g])}function i2(i,t,e=_c,n=yc,s=[.42,-.88,.2]){const r=i.x??i[0]??0,a=i.y??i[1]??0,o=i.z??i[2]??0,l=t.x??t[0]??0,c=t.y??t[1]??0,h=t.z??t[2]??0,d=l-r,m=c-a,u=h-o,p=Math.hypot(d,m,u),v=Math.abs(e-n)+.045,g=e+n-.008,f=se(p,v,g),x=p>1e-6?d/p:0,y=p>1e-6?m/p:0,_=p>1e-6?u/p:-1,E={x:r+x*f,y:a+y*f,z:o+_*f},b=(e*e-n*n+f*f)/(2*f),A=Math.sqrt(Math.max(0,e*e-b*b)),T=Ti(s),M=T[0]*x+T[1]*y+T[2]*_;let S=T[0]-M*x,R=T[1]-M*y,L=T[2]-M*_,I=Math.hypot(S,R,L);if(I<1e-5){const G=Cr([x,y,_],[1,0,0]),H=Ti(G);S=H[0],R=H[1],L=H[2],I=1}else S/=I,R/=I,L/=I;const N={x:r+x*b+S*A,y:a+y*b+R*A,z:o+_*b+L*A},F=se((e*e+n*n-f*f)/(2*e*n),-1,1),z=(Math.PI-Math.acos(F))*wi;return{shoulder:{x:r,y:a,z:o},elbow:N,wrist:E,elbowBendDeg:z,clampedDist:f}}class s2{constructor(t="right"){const e=typeof t=="string"?t:t==null?void 0:t.handSide;this.handSide=e==="left"?"left":"right",this.qStretch=null,this.qBend=null,this.qBasis=[0,0,0,1],this.qRefInv=[0,0,0,1],this.bendSpanRad=52*Te,this.bendInwardYawRad=0,this.yawTrimRad=0,this.calibratedStep=0;const n=this._defaultBeaconU();this.beaconFar={u:n,v:.54,span:.105,captured:!1},this.beaconNear={u:n,v:.64,span:.235,captured:!1},this.lastSensor=null,this.sensorSilentSec=0,this.prevQuat=null,this.prevFwd=null,this.torsoYaw=0;const s=this.sideSign;this.torsoWristPos={x:s*.16,y:-.22,z:-.5},this.torsoWristVel={x:0,y:0,z:0},this.qArm=[0,0,0,1],this.qArmTorso=[0,0,0,1],this.shoulderPos={x:s*.21,y:-.27,z:-.08},this.elbowPos={x:s*.24,y:-.44,z:-.26},this.pos={x:s*.16,y:-.22,z:-.5},this.vel={x:0,y:0,z:0},this.elbowBendDeg=68,this.reach=.25,this.elevationDeg=0,this.screenFacingCos=.85,this.trackingSource="idle",this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.lastPokeAt=-1e3,this.dwellAccumSec=0,this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=0,this.maxInspectPitchRad=0,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0,this.lastDecisionAt=-2e3}get sideSign(){return this.handSide==="left"?-1:1}_defaultBeaconU(){return this.handSide==="left"?.46:.54}setHandSide(t){const e=t==="left"?"left":"right";if(e===this.handSide)return this.handSide;this.handSide=e;const n=this.sideSign;return this.beaconFar.captured||(this.beaconFar.u=this._defaultBeaconU()),this.beaconNear.captured||(this.beaconNear.u=this._defaultBeaconU()),this.torsoWristPos={x:n*Math.abs(this.torsoWristPos.x),y:this.torsoWristPos.y,z:this.torsoWristPos.z},this.torsoWristVel={x:0,y:0,z:0},this.shoulderPos={x:n*.21,y:-.27,z:-.08},this.elbowPos={x:n*.24,y:-.44,z:-.26},this.pos={x:n*Math.abs(this.pos.x),y:this.pos.y,z:this.pos.z},this.vel={x:0,y:0,z:0},this.handSide}exportCalibration(){return this.calibratedStep<2?null:{handSide:this.handSide,qStretch:this.qStretch,qBend:this.qBend,qBasis:this.qBasis,qRefInv:this.qRefInv,bendSpanRad:this.bendSpanRad,bendInwardYawRad:this.bendInwardYawRad,beaconFar:this.beaconFar,beaconNear:this.beaconNear}}importCalibration(t){return!t||!Array.isArray(t.qBasis)||!Array.isArray(t.qRefInv)?!1:((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.qStretch=t.qStretch||[0,0,0,1],this.qBend=t.qBend||[0,0,0,1],this.qBasis=Cn(t.qBasis),this.qRefInv=Cn(t.qRefInv),this.bendSpanRad=se(Number(t.bendSpanRad)||52*Te,15*Te,125*Te),this.bendInwardYawRad=Number(t.bendInwardYawRad)||0,t.beaconFar&&(this.beaconFar={...this.beaconFar,...t.beaconFar,u:this._defaultBeaconU(),v:.54}),t.beaconNear&&(this.beaconNear={...this.beaconNear,...t.beaconNear,u:se(this._defaultBeaconU()-this.sideSign*.03,.15,.85),v:.64}),this.calibratedStep=2,this.yawTrimRad=0,!0)}feedSensor(t){!t||!Array.isArray(t.q)||t.q.length!==4||((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.lastSensor={q:Cn(t.q),linMag:Math.max(0,Number(t.linMag)||0),rotRate:Math.max(0,Number(t.rotRate)||0),acc:Array.isArray(t.acc)?t.acc:[0,0,0],ts:t.ts??performance.now()},this.sensorSilentSec=0)}calibrateStretchPose(t=this.lastSensor,e=null){if(!(t!=null&&t.q))return{ok:!1,message:"Нет сигнала от гироскопа на запястье. Подключите браслет."};this.qStretch=Cn(t.q);const n=Ti(qe(Si(this.qStretch),[0,1,0]));let s=[0,0,1];Math.abs(xl(s,n))>.9&&(s=[0,1,0]);const r=Ti(Cr(n,s)),a=Ti(Cr(r,n));this.qBasis=Fu(r,n,a),this.qRefInv=Si(Xe(this.qStretch,this.qBasis)),this.yawTrimRad=0,this.torsoYaw=0;const o=this._defaultBeaconU();e&&e.fresh&&e.status!=="none"&&e.spanNorm>.015?this.beaconFar={u:o,v:.54,span:se(e.spanNorm,.02,.42),captured:!0}:this.beaconFar={u:o,v:.54,span:.105,captured:!1},this.calibratedStep=1;const l=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:1,beaconCaptured:this.beaconFar.captured,message:`Шаг 1 записан (прямая ${l}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`}}calibrateBendPose(t=this.lastSensor,e=null){if(!this.qStretch)return{ok:!1,message:"Сначала выполните Шаг 1 — вытяните прямую руку вперёд."};if(!(t!=null&&t.q))return{ok:!1,message:"Нет свежего сигнала гироскопа с браслета."};const n=Cn(t.q),s=Xe(Si(this.qStretch),n),r=s[3]<0?-1:1;s[0]*r,s[1]*r,s[2]*r;const a=se(s[3]*r,-1,1);if(2*Math.acos(se(a,0,1))<12*Te)return{ok:!1,message:"Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз."};const l=Ti(qe(Si(this.qStretch),[0,1,0])),c=Ti(qe(Si(n),[0,1,0])),h=se(xl(c,l),-1,1),d=[c[0]-h*l[0],c[1]-h*l[1],c[2]-h*l[2]],m=Math.hypot(d[0],d[1],d[2]);if(m<Math.sin(13*Te))return{ok:!1,message:"Поднимите предплечье в локте вверх хотя бы на 20° выше горизонтали (не выворачивая кисть)."};const u=[d[0]/m,d[1]/m,d[2]/m],p=[-u[0],-u[1],-u[2]],v=Ti(Cr(l,p)),g=Ti(Cr(p,v)),f=Fu(v,g,p),x=Si(Xe(this.qStretch,f)),y=Xe(x,Xe(n,f)),_=qe(y,[0,0,-1]),E=Math.atan2(m,h);this.qBend=n,this.qBasis=f,this.qRefInv=x,this.bendSpanRad=se(E,18*Te,115*Te),this.bendInwardYawRad=Math.atan2(_[0],Math.max(.15,-_[2])),this.yawTrimRad=0;const b=se(this._defaultBeaconU()-this.sideSign*.03,.15,.85);e&&e.fresh&&e.status!=="none"&&e.spanNorm>this.beaconFar.span*1.12?this.beaconNear={u:b,v:.64,span:se(e.spanNorm,this.beaconFar.span+.04,.58),captured:!0}:this.beaconNear={u:b,v:.64,span:se(this.beaconFar.span*1.95,this.beaconFar.span+.07,.45),captured:!1},this.calibratedStep=2;const A=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:2,handSide:this.handSide,bendDeg:+(E*wi).toFixed(1),beaconCaptured:this.beaconFar.captured&&this.beaconNear.captured,message:`Калибровка готова (${A}, сгиб ${Math.round(E*wi)}°). Можно надевать очки!`}}recenterOnSessionStart(t=performance.now()){var a;if(this.torsoYaw=0,!((a=this.lastSensor)!=null&&a.q)||!this.qStretch||t-this.lastSensor.ts>2e3)return;const e=Cn(Xe(this.qRefInv,Xe(this.lastSensor.q,this.qBasis))),n=qe(e,[0,0,-1]);if(Math.hypot(n[0],n[2])<.35)return;const r=Math.atan2(n[0],-n[2]);Math.abs(r)>22*Te&&(this.yawTrimRad=r)}_currentTorsoQuat(){var t;if((t=this.lastSensor)!=null&&t.q&&this.qStretch){const e=Sr([0,1,0],this.yawTrimRad+this.torsoYaw);return Cn(Xe(e,Xe(this.qRefInv,Xe(this.lastSensor.q,this.qBasis))))}return[...this.qArmTorso]}onPhaseChange(t,e=performance.now()){if(t==="inspect"){const n=this._currentTorsoQuat(),s=qe(n,[0,0,-1]);this.inspectBaseQ=[...n],this.inspectPrevQ=[...n],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=e,this.maxInspectPitchRad=Math.asin(se(s[1],-1,1)),this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0}else this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.calmLowerSec=0;t==="search"&&(this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0)}update(t,{beacon:e=null,phase:n="search",revealReady:s=!1,handOverBin:r=!0,headLook:a={yaw:0,pitch:0},now:o=performance.now()}={}){const l=se(t||.016666666666666666,.001,.1),c=this.lastSensor;if(!(c!=null&&c.q))return this.trackingSource="idle",this.snapshot({pokes:0,decision:null,throwVel:null});this.qStretch||this.calibrateStretchPose(c,e);const h=this.sideSign,d=Number.isFinite(a==null?void 0:a.yaw)?a.yaw:0,m=Number.isFinite(a==null?void 0:a.pitch)?a.pitch:0,u=d-this.torsoYaw;Math.abs(u)>18*Te&&(this.torsoYaw+=(u-Math.sign(u)*18*Te)*.45),this.torsoYaw+=(d-this.torsoYaw)*Math.min(1,l*2.8);const p=d-this.torsoYaw,v=Xe(Sr([1,0,0],-m),Sr([0,1,0],p)),g=Si(v),f=Sr([0,1,0],this.yawTrimRad+this.torsoYaw);this.qArmTorso=Cn(Xe(f,Xe(this.qRefInv,Xe(c.q,this.qBasis)))),this.qArm=Cn(Xe(v,this.qArmTorso));let x=c.rotRate;this.prevQuat&&x<1&&(x=n2(this.prevQuat,this.qArmTorso)/l*wi),this.prevQuat=[...this.qArmTorso];const y=this.sensorSilentSec;this.sensorSilentSec+=l;const _=y>.12?Math.exp(-(y-.12)*8):1,E=c.linMag*_;x*=_;const b=y>1.6,A=qe(Si(this.qBasis),[0,0,1]),T=qe(this.qArm,A);this.screenFacingCos=T[2];const M=qe(this.qArmTorso,[0,0,-1]);let S=0;if(this.prevFwd){const q=se(xl(this.prevFwd,M),-1,1);S=Math.acos(q)/l*wi}this.prevFwd=[...M];const R=Math.asin(se(M[1],-1,1)),L=Math.atan2(M[0],Math.max(.12,Math.hypot(M[2],M[1]*.35)));this.elevationDeg=+(R*wi).toFixed(1);const I=se(-h*L/(28*Te),-.35,1),N=se((R-(this.bendSpanRad+6*Te))/(26*Te),0,1);let F,z=0;if(R>=0){const q=se(R/Math.max(.32,this.bendSpanRad),0,1.15),ht=se(.96+I*.12-N*.78,.18,1.05);F=se(1-q*.84*ht,.12,1.02),z=N*.08+se(R/(75*Te),0,1)*.04}else{const q=se(-R/(72*Te),0,1);F=se(1-q*.62,.28,1.02),z=-q*.035}const G={x:h*.21,y:-.27+z,z:-.08},H=_c+yc-.015,Z=.25;let tt,nt;if(R<-8*Te){const q=se(-R/(70*Te),0,1);tt=.56-q*.09,nt={x:G.x+M[0]*tt*.82-h*(1-q)*.06,y:G.y+M[1]*tt*.95+(1-q)*.14,z:G.z-Math.max(.18,-M[2])*tt*.96}}else{tt=Z+F*(H-Z);const q=1-F;nt={x:G.x+M[0]*tt*.88-h*(.09+q*.03),y:G.y+M[1]*(.2+F*.36+N*.18)+F*.15,z:G.z-(.28+F*.31)*se(-M[2]+q*.45,.36,1.05)}}let bt=F;if(e&&e.fresh&&e.status!=="none"&&this.screenFacingCos>.18)if(this.trackingSource="gyro+beacon",e.status==="pair"&&e.spanNorm>.015){const q=se(this.screenFacingCos,.42,1),ht=e.spanNorm/q,lt=Math.max(.035,this.beaconNear.span-this.beaconFar.span),gt=se((this.beaconNear.span-ht)/lt,.06,1.06);bt=F*.35+gt*.65;const Vt=-.38-gt*.32,Gt=se((e.u-this.beaconFar.u)*1.15+h*.1,-.54,.54),P=se((this.beaconFar.v-e.v)*.94-.11,-.56,.46),w=qe(g,[Gt,P,Vt]);nt.x=nt.x*.32+w[0]*.68,nt.y=nt.y*.32+w[1]*.68,nt.z=nt.z*.35+w[2]*.65;const V=qe(v,[G.x+M[0]*.48-h*.08,G.y+M[1]*.35,-.55]),Y=se(this.beaconFar.u+(V[0]-h*.1)*.65,.1,.9),rt=e.u-Y,$=12*Te*l;this.yawTrimRad=se(this.yawTrimRad-se(rt*.35,-$,$),-180*Te,180*Te)}else{const q=se((e.u-this.beaconFar.u)*1.1+h*.1,-.52,.52),ht=se((this.beaconFar.v-e.v)*.9-.11,-.54,.44),lt=qe(g,[q,ht,nt.z]);nt.x=nt.x*.55+lt[0]*.45,nt.y=nt.y*.55+lt[1]*.45}else this.trackingSource=b?"stale":"gyro-only";const kt=26,qt=Math.max(1,Math.ceil(l/.017)),J=l/qt;for(let q=0;q<qt;q++)for(const ht of["x","y","z"]){const lt=nt[ht]-this.torsoWristPos[ht],gt=kt*kt*lt-2*kt*this.torsoWristVel[ht];this.torsoWristVel[ht]+=gt*J,this.torsoWristPos[ht]+=this.torsoWristVel[ht]*J}this.reach+=(bt-this.reach)*(1-Math.exp(-l*18));const et=se((this.torsoWristPos.y+.1)*.55,-.15,.42),_t=[h*.44,-.86+et,.22],yt=i2(G,this.torsoWristPos,_c,yc,_t);this.torsoWristPos={...yt.wrist},this.elbowBendDeg=+yt.elbowBendDeg.toFixed(1);const St=qe(v,[yt.shoulder.x,yt.shoulder.y,yt.shoulder.z]),Wt=qe(v,[yt.elbow.x,yt.elbow.y,yt.elbow.z]),Kt=qe(v,[yt.wrist.x,yt.wrist.y,yt.wrist.z]),O=qe(v,[this.torsoWristVel.x,this.torsoWristVel.y,this.torsoWristVel.z]);this.shoulderPos={x:St[0],y:St[1],z:St[2]},this.elbowPos={x:Wt[0],y:Wt[1],z:Wt[2]},this.pos={x:Kt[0],y:Kt[1],z:Kt[2]},this.vel={x:O[0],y:O[1],z:O[2]};let ot=0,st=null,it=null;if(b)return this.dwellAccumSec=0,this.calmLowerSec=0,this.snapshot({pokes:0,decision:null,throwVel:null,pitchUpDeg:+(R*wi).toFixed(1)});if(n==="search")if(this.reach>=.6&&r){this.rummageAnchorYaw===null&&(this.rummageAnchorYaw=L,this.rummageAnchorPitch=R);const ht=L-this.rummageAnchorYaw,lt=R-this.rummageAnchorPitch,gt=Math.hypot(ht,lt)*wi,Gt=(Math.abs(ht)>=Math.abs(lt)?ht:lt)>=0?1:-1,P=o-this.lastPokeAt>=270,w=gt>=6.8&&(this.rummageDir===0||Gt!==this.rummageDir),V=E>=1.35&&x>=28;P&&(w||V)?(ot=1,this.lastPokeAt=o,this.rummageDir=Gt,this.rummageAnchorYaw=L,this.rummageAnchorPitch=R,this.dwellAccumSec=0):(x>=12||E>=.55)&&(this.dwellAccumSec+=l,this.dwellAccumSec>=.62&&P&&(ot=1,this.lastPokeAt=o,this.dwellAccumSec=0))}else this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0;else if(n==="inspect"){(!this.inspectBaseQ||!this.inspectPrevQ)&&(this.inspectBaseQ=[...this.qArmTorso],this.inspectPrevQ=[...this.qArmTorso],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=o,this.maxInspectPitchRad=R,this.itemRot={x:0,y:0,z:0}),R>this.maxInspectPitchRad&&(this.maxInspectPitchRad=R);let q=Cn(Xe(this.qArmTorso,Si(this.inspectPrevQ)));this.inspectPrevQ=[...this.qArmTorso],q[3]<0&&(q=[-q[0],-q[1],-q[2],-q[3]]);const ht=Math.hypot(q[0],q[1],q[2]);if(ht>1e-7){const Vt=2*Math.atan2(ht,q[3])/ht,Gt=q[0]*Vt,P=q[1]*Vt,w=q[2]*Vt,V=Gt*1.55,Y=P*1.75-w*.7,rt=w*1.25,$=Math.hypot(V,Y,rt);if($>1e-8){const Rt=Sr([V,Y,rt],$);this.inspectItemQ=Cn(Xe(Rt,this.inspectItemQ))}this.itemRot={x:this.itemRot.x+V,y:this.itemRot.y+Y,z:this.itemRot.z+rt}}if(s&&o-this.inspectEnteredAt>=450&&o-this.lastDecisionAt>=900){const gt=E>=7.2,Vt=x>=245&&E>=2.4,Gt=x>=310&&S>=195;if(gt||Vt||Gt){st="discard",this.lastDecisionAt=o,this.calmLowerSec=0;const P=qe(this.qArm,[0,0,-1]),w=P[0]>=0?1:-1;it={x:se(P[0]*7.5+w*3.8+this.vel.x*2.2,-9.5,9.5),y:se(P[1]*4.5+2.2+this.vel.y*1.8,.5,7.5),z:-6.8}}else{const P=this.maxInspectPitchRad-R,w=R<=-21*Te&&P>=16*Te||R<=-38*Te||yt.wrist.y<=-.38&&P>=14*Te,V=E<3.1&&x<105;w&&V?(this.calmLowerSec+=l,this.calmLowerSec>=.65&&(st="keep",this.lastDecisionAt=o,this.calmLowerSec=0)):this.calmLowerSec=Math.max(0,this.calmLowerSec-l*2.2)}}}return this.snapshot({pokes:ot,decision:st,throwVel:it,pitchUpDeg:+(R*wi).toFixed(1)})}snapshot(t={}){return{handSide:this.handSide,calibratedStep:this.calibratedStep,trackingSource:this.trackingSource,qArm:[...this.qArm],shoulderPos:{...this.shoulderPos},elbowPos:{...this.elbowPos},pos:{...this.pos},vel:{x:+this.vel.x.toFixed(3),y:+this.vel.y.toFixed(3),z:+this.vel.z.toFixed(3)},elbowBendDeg:this.elbowBendDeg,elevationDeg:this.elevationDeg,reach:+this.reach.toFixed(3),screenFacingCos:+this.screenFacingCos.toFixed(3),itemRot:{...this.itemRot},itemQuat:[...this.inspectItemQ],calmLowerProgress:+se(this.calmLowerSec/.65,0,1).toFixed(2),...t}}}const r2="modulepreload",a2=function(i,t){return new URL(i,t).href},Ou={},zu=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=a(e.map(h=>{if(h=a2(h,n),h in Ou)return;Ou[h]=!0;const d=h.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===h&&(!d||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${m}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":r2,d||(p.as="script"),p.crossOrigin="",p.href=h,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((v,g)=>{p.addEventListener("load",v),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},ku="https://www.gstatic.com/firebasejs/11.0.1",af="ckc_stand_cfg",of="wn_firebase_cfg",o2="wn-wrist-demo-v1",l2=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];function c2(i){if(!i||typeof i!="string")return null;const t=i.trim();if(!t)return null;if(/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(t))return{databaseURL:t.replace(/\/$/,"")};try{const r=JSON.parse(t);if(r&&typeof r=="object"&&(r.databaseURL||r.projectId))return r}catch{}const e={},n=/([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;let s;for(;(s=n.exec(t))!==null;)e[s[1]]=s[3];return!e.databaseURL&&e.projectId&&(e.databaseURL=`https://${e.projectId}-default-rtdb.firebaseio.com`),e.databaseURL?e:null}function h2(){try{return localStorage.getItem(af)||localStorage.getItem(of)||""}catch{return""}}function u2(i){try{localStorage.setItem(af,i),localStorage.setItem(of,i)}catch{}}function Bu(){return String(Math.floor(1e5+Math.random()*9e5))}function d2(){return"h"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}function Hu(i){if(!i||typeof i!="string")return!1;const t=i.trim().toLowerCase();return!!(t.endsWith(".local")||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(t)||t.startsWith("fd")||t.startsWith("fc")||t.startsWith("fe80:"))}class f2{constructor({onSensor:t,onCalCommand:e,onHandSide:n,onStatus:s}={}){this.onSensor=t||(()=>{}),this.onCalCommand=e||(()=>{}),this.onHandSide=n||(()=>{}),this.onStatus=s||(()=>{}),this.mode="off",this.roomCode="",this.connected=!1,this.p2pOpen=!1,this.routeKind="idle",this.rttMs=null,this.rxHz=0,this.error=null,this.db=null,this.fbMod=null,this.unsubs=[],this.bc=null,this.pc=null,this.dcFast=null,this.dcCtrl=null,this.hid="",this.pendingCandidates=[],this.attempt=0,this.preferLanOnly=!1,this.peerJoined=!1,this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastAnyRxAt=0,this.lastSeq=-1,this.seenCalIds=new Set,this.rxTimes=[],this.pingTimer=null,this.watchdogTimer=null,this.wakeLock=null}async acquireWakeLock(){var t,e,n;try{typeof navigator<"u"&&((t=navigator.wakeLock)!=null&&t.request)&&!this.wakeLock&&(this.wakeLock=await navigator.wakeLock.request("screen"),(n=(e=this.wakeLock).addEventListener)==null||n.call(e,"release",()=>{this.wakeLock=null}))}catch{}}releaseWakeLock(){var t,e;try{(e=(t=this.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}this.wakeLock=null}startDemo(t=this.roomCode||Bu()){return this.stop(),this.mode="demo",this.roomCode=String(t),this.routeKind="demo",this.error=null,typeof BroadcastChannel<"u"&&(this.bc=new BroadcastChannel(o2),this.bc.onmessage=e=>{var s;const n=e==null?void 0:e.data;if(!(!n||String(n.room)!==this.roomCode))if(n.k==="hello")this.connected=!0,this.p2pOpen=!0,(n.side==="left"||n.side==="right")&&this.onHandSide(n.side),(s=this.bc)==null||s.postMessage({k:"ack",room:this.roomCode,ts:Date.now()}),this._emitStatus();else if(n.k==="wrist")this.connected=!0,this.p2pOpen=!0,this._handlePacket(n,!0);else if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step))}else n.k==="hand_side"&&(n.side==="left"||n.side==="right")&&this.onHandSide(n.side)}),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"demo"}}async startFirebase(t){const e=c2(t);if(!e)return this.error="Вставьте корректный firebaseConfig или URL Realtime Database",this._emitStatus(),{ok:!1,error:this.error};u2(t),this.stop(),this.mode="firebase",this.roomCode=Bu(),this.error=null;try{const[{initializeApp:n,getApps:s,deleteApp:r},a]=await Promise.all([zu(()=>import(`${ku}/firebase-app.js`),[],import.meta.url),zu(()=>import(`${ku}/firebase-database.js`),[],import.meta.url)]),o=s().find(g=>g.name==="wn-wrist-host");if(o)try{await r(o)}catch{}const l=n(e,"wn-wrist-host");this.db=a.getDatabase(l,e.databaseURL),this.fbMod=a;const{ref:c,set:h,onValue:d,onChildAdded:m,onDisconnect:u}=a,p=`wn_wrist_rooms/${this.roomCode}`;await h(c(this.db,p),{createdAt:Date.now(),hostAlive:!0});try{u(c(this.db,`${p}/hostAlive`)).remove()}catch{}this.unsubs.push(d(c(this.db,`${p}/wristJoined`),g=>{g.val()&&(this.peerJoined=!0,this.connected=!0,this.isFastHealthy()||this._startRtcOffer(!1),this._emitStatus())})),this.unsubs.push(d(c(this.db,`${p}/fbInput`),g=>{const f=g.val();f&&(this.connected=!0,this.isFastHealthy()||(this.routeKind="firebase",this._handlePacket(f,!1)))}));let v=!0;return this.unsubs.push(d(c(this.db,`${p}/calCmd`),g=>{const f=g.val();if(v){v=!1,f!=null&&f.id&&this.seenCalIds.add(f.id);return}if(!f||!f.step)return;const x=f.id||`${f.step}:${f.ts||0}`;this.seenCalIds.has(x)||(this.seenCalIds.add(x),this.onCalCommand(f.step))})),this.unsubs.push(d(c(this.db,`${p}/handSide`),g=>{const f=g.val();f&&(f.side==="left"||f.side==="right")&&this.onHandSide(f.side)})),this.unsubs.push(d(c(this.db,`${p}/rtc/hello`),g=>{const f=g.val();!f||!f.ts||(this.peerJoined=!0,this.connected=!0,this.isFastHealthy()||this._startRtcOffer(!1))})),this.unsubs.push(d(c(this.db,`${p}/rtc/answer`),async g=>{const f=g.val();if(!f||f.hid!==this.hid||!this.pc||this.pc.signalingState!=="have-local-offer")return;const x=this.hid;try{await this.pc.setRemoteDescription({type:"answer",sdp:f.sdp});const y=this.pendingCandidates.filter(_=>_.hid===x);this.pendingCandidates=[];for(const _ of y){if(this.hid!==x||!this.pc)break;try{await this.pc.addIceCandidate(_.candidate)}catch{}}}catch{}})),this.unsubs.push(m(c(this.db,`${p}/rtc/wristCandidates`),async g=>{const f=g.val();if(!(!f||!f.candidate||!f.hid)){if(f.hid!==this.hid||!this.pc||!this.pc.remoteDescription){this.pendingCandidates.push(f),this.pendingCandidates.length>48&&this.pendingCandidates.shift();return}try{await this.pc.addIceCandidate(f.candidate)}catch{}}})),await this.acquireWakeLock(),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"firebase"}}catch(n){return this.error=(n==null?void 0:n.message)||"Ошибка подключения к Firebase",this._emitStatus(),{ok:!1,error:this.error}}}isFastHealthy(t=performance.now()){if(this.mode==="demo")return this.p2pOpen;if(!this.dcFast||this.dcFast.readyState!=="open")return!1;const e=this.lastPongAt>0?Math.max(0,t-this.lastPongAt):1/0,n=this.lastFastRxAt>0?Math.max(0,t-this.lastFastRxAt):1/0,s=Math.min(e,n);return Number.isFinite(s)?s<8500:this.dcOpenedAt>0&&Math.max(0,t-this.dcOpenedAt)<3500}async _startRtcOffer(t=!1){if(typeof RTCPeerConnection>"u"||!this.db||!this.fbMod)return;this._closePcOnly(),this.attempt+=1,this.hid=d2();const e=this.hid,n=this.preferLanOnly||!t&&this.attempt%2===1,s=n?[]:l2,{ref:r,set:a,push:o,remove:l}=this.fbMod,c=`wn_wrist_rooms/${this.roomCode}/rtc`;try{await Promise.all([l(r(this.db,`${c}/answer`)),l(r(this.db,`${c}/hostCandidates`)),l(r(this.db,`${c}/wristCandidates`))])}catch{}const h=new RTCPeerConnection({iceServers:s});this.pc=h;const d=h.createDataChannel("wrist-fast",{ordered:!1,maxRetransmits:0}),m=h.createDataChannel("wrist-ctrl",{ordered:!0});this.dcFast=d,this.dcCtrl=m;const u=()=>{this.hid===e&&(this.p2pOpen=!0,this.connected=!0,this.dcOpenedAt=performance.now(),this._inspectRoute(n),this._emitStatus())};d.onopen=u,m.onopen=u,d.onmessage=p=>this._onChannelMessage(p.data,!0),m.onmessage=p=>this._onChannelMessage(p.data,!1),h.onicecandidate=p=>{!p.candidate||this.hid!==e||o(r(this.db,`${c}/hostCandidates`),{hid:e,candidate:p.candidate.toJSON?p.candidate.toJSON():p.candidate}).catch(()=>{})},h.onconnectionstatechange=()=>{if(this.hid!==e)return;const p=h.connectionState;p==="connected"?(this.p2pOpen=!0,this._inspectRoute(n),this._emitStatus()):(p==="failed"||p==="closed")&&(this.p2pOpen=!1,this.routeKind=this.connected?"firebase":"idle",this._emitStatus())};try{const p=await h.createOffer();await h.setLocalDescription(p),await a(r(this.db,`${c}/offer`),{hid:e,sdp:p.sdp,iceMode:n?"lan":"stun",ts:Date.now()})}catch{}}async _inspectRoute(t){var e;if(!((e=this.pc)!=null&&e.getStats)){this.routeKind=t?"lan":"stun";return}try{const n=await this.pc.getStats();let s=null;const r=new Map;if(n.forEach(a=>{(a.type==="local-candidate"||a.type==="remote-candidate")&&r.set(a.id,a),a.type==="candidate-pair"&&(a.nominated||a.state==="succeeded")&&(s=a)}),s){const a=r.get(s.localCandidateId),o=r.get(s.remoteCandidateId),l=(a==null?void 0:a.candidateType)||"",c=(o==null?void 0:o.candidateType)||"",h=Number.isFinite(s.currentRoundTripTime)?s.currentRoundTripTime*1e3:null,m=t||(l==="host"||l==="prflx")&&(c==="host"||c==="prflx")&&(Hu(a==null?void 0:a.address)||Hu(o==null?void 0:o.address)||h!==null&&h<22);this.routeKind=m?"lan":"stun",m&&(this.preferLanOnly=!0);return}}catch{}this.routeKind=t?"lan":"stun"}_onChannelMessage(t,e){let n;try{n=typeof t=="string"?JSON.parse(t):null}catch{return}if(!n)return;const s=performance.now();if(n.k==="ping"){this._sendCtrl({k:"pong",t:n.t});return}if(n.k==="pong"){if(this.lastPongAt=s,Number.isFinite(n.t)){const r=Math.max(1,Math.round(s-n.t));this.rttMs=this.rttMs===null?r:Math.round(this.rttMs*.65+r*.35)}this._emitStatus();return}if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step));return}if(n.k==="hand_side"&&(n.side==="left"||n.side==="right")){this.onHandSide(n.side);return}n.k==="wrist"&&(this.lastFastRxAt=s,this.p2pOpen=!0,this._handlePacket(n,e))}_sendCtrl(t){var n;const e=((n=this.dcCtrl)==null?void 0:n.readyState)==="open"?this.dcCtrl:this.dcFast;if((e==null?void 0:e.readyState)==="open")try{e.send(JSON.stringify(t))}catch{}}sendHandSide(t){const e=t==="left"?"left":"right",n={k:"hand_side",room:this.roomCode,side:e,ts:Date.now()};if(this.mode==="demo"&&this.bc&&this.bc.postMessage(n),this._sendCtrl(n),this.mode==="firebase"&&this.db&&this.fbMod&&this.roomCode){const{ref:s,set:r}=this.fbMod;r(s(this.db,`wn_wrist_rooms/${this.roomCode}/hostHandSide`),n).catch(()=>{})}}_handlePacket(t,e){const n=performance.now();if(e&&Number.isFinite(t.seq)){if(t.seq<=this.lastSeq&&this.lastSeq-t.seq<3e3)return;this.lastSeq=t.seq}for(this.lastAnyRxAt=n,this.rxTimes.push(n);this.rxTimes.length&&n-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:n})}injectPacket(t,e=performance.now()){this.connected=!0,this.p2pOpen=!0,this.routeKind="demo",this.lastAnyRxAt=e,this.rxHz=60,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:e})}_startMeters(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=setInterval(()=>{var e,n;const t=performance.now();for(;this.rxTimes.length&&t-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,(((e=this.dcFast)==null?void 0:e.readyState)==="open"||((n=this.dcCtrl)==null?void 0:n.readyState)==="open")&&this._sendCtrl({k:"ping",t:Math.round(t)}),this._emitStatus()},1e3),this.watchdogTimer=setInterval(()=>{this.mode!=="firebase"||!this.peerJoined||this.isFastHealthy()||(this.p2pOpen=!1,this._startRtcOffer(!1))},4200)}_closePcOnly(){var t,e,n;try{(t=this.dcFast)==null||t.close()}catch{}try{(e=this.dcCtrl)==null||e.close()}catch{}try{(n=this.pc)==null||n.close()}catch{}this.dcFast=null,this.dcCtrl=null,this.pc=null,this.pendingCandidates=[],this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.p2pOpen=!1}stop(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=null,this.watchdogTimer=null;for(const t of this.unsubs)try{t()}catch{}if(this.unsubs=[],this._closePcOnly(),this.bc){try{this.bc.close()}catch{}this.bc=null}this.releaseWakeLock(),this.mode="off",this.connected=!1,this.peerJoined=!1,this.routeKind="idle",this.rxHz=0,this.rttMs=null,this._emitStatus()}status(){return{mode:this.mode,roomCode:this.roomCode,connected:this.connected,p2pOpen:this.isFastHealthy(),routeKind:this.routeKind,rttMs:this.rttMs,rxHz:this.rxHz,error:this.error,fresh:!!this.lastAnyRxAt&&performance.now()-this.lastAnyRxAt<1200}}_emitStatus(){this.onStatus(this.status())}}const p2=(i,t,e)=>Math.max(t,Math.min(e,i)),j=i=>document.querySelector(i),Pn=i=>[...document.querySelectorAll(i)],m2=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let ci;try{ci=window.localStorage}catch{ci={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let At=b_(ci),ut,Mc="all",Oe=null,Sc,Vu,Gu=null,os=0,bc=0,ir=document.hidden,wc=null;const lf="white-night-vr-v1",Tc=10;function g2(){try{const i=ci.getItem(lf),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":t.mode==="hand"?"hand":"gyro",handSide:t.handSide==="left"?"left":"right",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",handSide:"right",quality:"high",leftHue:16,rightHue:338}}}let ee=g2(),Ae=null,oe=null,Le=null,Ze=null,ho="",Wu=!1,Ne=!1,Zr=!1,Ec=!1,Bi=!1,uo=0,Qn=0,ti=!1,ri=!1,fo=!1,In=null,Ac=!1,_l=!1,Ei="",br=0;const Vn=new j_;function Nr(){try{ci.setItem(lf,JSON.stringify(ee))}catch{}}const Xu=new URLSearchParams(location.search).has("test"),us=Pn("dialog");function Kr(i,t="neutral"){j("#toast").dataset.tone=t,j("#toast").textContent=i,j("#toast").classList.add("visible"),clearTimeout(Sc),Sc=setTimeout(()=>j("#toast").classList.remove("visible"),2600)}function Co(){w_(ci,At)||(j("#save-status").textContent="Сохранение недоступно в этом браузере",Kr("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function po(){Pn("[data-pose]").forEach(i=>{var t;i.disabled=At.phase!=="inspect"||!((t=ut==null?void 0:ut.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(ut==null?void 0:ut.pose)))})}function Fr(){var i;if(po(),!!ut){if(At.phase==="inspect"&&!((i=ut.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])j("#"+t).disabled=!0;return}j("#zoom-in").disabled=ut.zoom>=ao.max,j("#zoom-out").disabled=ut.zoom<=ao.min,j("#zoom-reset").disabled=ut.zoom===1,j("#zoom-reset").textContent=`${Math.round(ut.zoom*100)}%`}}function cf(){j("#completion-preview").replaceChildren(...At.lastKept.map(i=>{const t=document.createElement("img");return t.src=ut.thumbnail(i),t.alt=mn.find(e=>e.id===i).name,t}))}function gs(){var e;const i=At.phase==="inspect"&&((e=ut.revealState)==null?void 0:e.phase)||"ready";if(i===Gu)return;Gu=i,j("#app").dataset.revealPhase=i,j("#app").classList.toggle("is-revealing",i!=="ready"),j(".inspection").setAttribute("aria-busy",String(i!=="ready")),j("#keep").disabled=j("#discard").disabled=i!=="ready",Fr();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};j("#reveal-note").textContent=t[i]||"",j("#reveal-note").hidden=i==="ready"}function v2(){const i=j("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(Vu),Vu=setTimeout(()=>i.classList.remove("collected"),700)}function qi(){j("#app").classList.toggle("has-progress",At.searches>0),gs(),Fr(),M2(),j("#app").classList.toggle("is-inspecting",At.phase==="inspect"),j(".inspection").hidden=At.phase!=="inspect",At.phase==="inspect"&&(clearTimeout(Sc),j("#toast").classList.remove("visible")),j("#header-count").innerHTML=`${String(At.collection.length).padStart(2,"0")} <small>/ 18</small>`,j("#open-vr").disabled=At.phase==="inspect",j("#search-total").textContent=String(At.searches).padStart(2,"0"),j("#open-collection").disabled=At.phase==="inspect",Pn(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<At.taps)),j(".tap-dots").setAttribute("aria-label",`Нажатий: ${At.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(j("#search-caption").textContent=i[At.taps],j("#search-button span").textContent=At.taps?"Продолжить поиск":"Порыться в баке",At.phase==="inspect"){const t=mn.find(n=>n.id===At.current),e=sf[t.rarity];j("#find-name").textContent=t.name,j("#find-description").textContent=t.description,j("#find-era").textContent=t.era,j("#find-rarity").innerHTML=`<i></i>${e.label}`,j("#find-rarity").style.color=e.color,j("#find-number").textContent=At.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(At.searches).padStart(3,"0")}`,j("#duplicate-badge").hidden=At.reviewing||!At.collection.includes(t.id),j(".decision-buttons").hidden=At.reviewing,j("#close-review").hidden=!At.reviewing}}function mo(){if(At.phase!=="search"||us.some(t=>t.open)||ir)return;ut.poke(At.taps+1);let i=wc||(At.searches===0?"camera":S_().id);At=Ro(At,{type:"tap",itemId:i}),At.phase==="inspect"&&(wc=null,ut.show(At.current),Co(),Ne&&(ri=ee.mode!=="hand",Qn=0,ti=!1,Vn.reset(),Le==null||Le.onPhaseChange("inspect",performance.now()))),qi()}function qs(i,{fromVr:t=!1}={}){var r;if(At.phase!=="inspect"||At.reviewing||!((r=ut.revealState)!=null&&r.ready))return;const e=mn.find(a=>a.id===At.current),n=At.collection.includes(e.id),s=At.collection.length;At=Ro(At,{type:i?"keep":"discard"}),ut.hide(),Co(),qi(),Kr(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&v2(),s<18&&At.collection.length===18&&(t?fo=!0:(cf(),j("#complete-dialog").showModal()))}function hf(){j("#collection-count").textContent=At.collection.length,j("#collection-progress").style.width=`${At.collection.length/18*100}%`;const i=mn.filter(t=>Mc==="all"||(Mc==="junk"?t.rarity==="junk":t.rarity!=="junk"));j("#collection-grid").replaceChildren(...i.map(t=>{const e=At.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(mn.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${ut.thumbnail(t.id)}">`:`<div class="locked-art">${m2("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":sf[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{j("#collection-dialog").close(),At=Ro(At,{type:"review",id:t.id}),ut.show(t.id,{review:!0}),qi()}),n}))}function Rc(){At.phase!=="inspect"&&(hf(),j("#collection-dialog").showModal())}function qu(){At.reviewing&&(At=Ro(At,{type:"close"}),ut.hide(),qi(),Rc())}function uf(){At=$r(),ut.hide(),Co(),qi(),j("#reset-confirm").hidden=!0,j("#reset-button").hidden=!1,j("#settings-dialog").close(),Kr("Новая белая ночь. Начнём сначала.")}function x2(){const i=j(".bin-tag");if(!i)return;const t=ut.binEdge();i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`}const df="white-night-look-hint-v1";let Yu=!1;function _2(){try{return ci.getItem(df)==="done"}catch{return!0}}function y2(){const i=j("#look-hint");if(!(!i||Yu&&i.hidden)){i.classList.add("used"),Yu=!0;try{ci.setItem(df,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function M2(){const i=j("#look-hint");if(i){if(_2()||At.phase==="inspect"){i.hidden=!0;return}i.hidden=Ne}}function bn(){return Ae||(Ae=new J_(j("#vr-camera")),Ae.setHues(ee.leftHue,ee.rightHue),Ae.setMode(ee.mode==="fusion"?"fusion":"gyro")),Ae}function ff(){return oe||(oe=new e2(j("#vr-hand-camera"))),oe}function Jr(i){var s;const t=ai();oe==null||oe.process(!0);const e=(oe==null?void 0:oe.sample())||null,n=i==="pose1"?t.calibrateStretchPose(t.lastSensor,e):t.calibrateBendPose(t.lastSensor,e);return ho=n.message||"",(s=j("#vr-dialog"))!=null&&s.open&&Ye(),n}function ih(i,{fromRemote:t=!1}={}){var n,s,r;const e=i==="left"?"left":"right";ee.handSide=e,Nr(),Le&&Le.setHandSide(e),(s=(n=ut==null?void 0:ut.vrHand)==null?void 0:n.setHandSide)==null||s.call(n,e),t||Ze==null||Ze.sendHandSide(e),(r=j("#vr-dialog"))!=null&&r.open&&Ye()}function ai(){return Le||(Le=new s2({handSide:ee.handSide})),Ze||(Ze=new f2({onSensor:i=>Le.feedSensor(i),onCalCommand:i=>Jr(i),onHandSide:i=>ih(i,{fromRemote:!0}),onStatus:()=>{var i;(i=j("#vr-dialog"))!=null&&i.open&&Ye()}})),Le}function S2(i){return i.gyro.fresh?ee.mode==="fusion"?!!i.marker.calibrated:ee.mode==="hand"?(ai(),(Ze.status().connected||!!Le.lastSensor)&&Le.calibratedStep>=2):!0:!1}function $u(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}const b2="<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>",w2="<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>",T2="В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.",E2="В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.";function Ye(){var c;const i=bn(),t=i.info(),e=t.gyro,n=t.marker,s=S2(t);Pn("[data-vr-mode]").forEach(h=>{const d=h.dataset.vrMode===ee.mode;h.classList.toggle("active",d),h.setAttribute("aria-pressed",String(d))}),j("#vr-fusion-panel").hidden=ee.mode!=="fusion",j("#vr-hand-panel").hidden=ee.mode!=="hand";const r=j("#vr-how-cards"),a=j("#vr-note-text");if(r){const h=ee.mode==="hand"?w2:b2;r.innerHTML!==h&&(r.innerHTML=h)}a&&(a.textContent=ee.mode==="hand"?E2:T2),j("#vr-quality").value=ee.quality,j("#vr-swatch-left").style.background=`hsl(${ee.leftHue} 95% 55%)`,j("#vr-swatch-right").style.background=`hsl(${ee.rightHue} 95% 55%)`;const o=j("#vr-gyro-btn");if(o.disabled=!!e.fresh||!e.supported,o.textContent=e.fresh?"Гироскоп готов":"Разрешить",o.classList.toggle("ready",!!e.fresh),j("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",ee.mode==="fusion"){const[h,d]=n.markers||[];j("#vr-start-camera").disabled=!!n.running,j("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",j("#vr-calibrate").disabled=!(h!=null&&h.usable&&(d!=null&&d.usable)),j("#vr-pick-left").classList.toggle("active",In==="left"),j("#vr-pick-right").classList.toggle("active",In==="right"),j("#vr-camera").classList.toggle("picking",!!In);const m=j("#vr-marker-status");m.textContent=Ei||n.error||(In?`Коснитесь ${In==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((c=n.calibration)==null?void 0:c.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${h?$u(h):"—"}. Правая метка: ${d?$u(d):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),m.className=`vr-status-line ${Ei||n.error?"warn":n.calibrated?"good":""}`}else if(ee.mode==="hand"){if(ai(),Pn("[data-hand-side]").forEach(g=>{const f=g.dataset.handSide===ee.handSide;g.classList.toggle("active",f),g.setAttribute("aria-pressed",String(f))}),!Wu){Wu=!0;const g=h2(),f=j("#vr-hand-fb");f&&g?f.value=g:j("#vr-hand-fb-details")&&(j("#vr-hand-fb-details").open=!0)}const h=Ze.status(),d=h.connected||!!Le.lastSensor;j("#vr-hand-code").textContent=h.roomCode||"——";const m=j("#vr-hand-net-status");m.textContent=h.error?h.error:h.p2pOpen?h.routeKind==="demo"?`Демо-канал активен (${h.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${h.rttMs?` · ${h.rttMs} мс`:""}.`:h.connected?"☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).":h.roomCode?`Код комнаты ${h.roomCode} создан — введите его на странице браслета.`:"Создайте 6-значный код и введите его на втором телефоне.",m.className=`vr-status-line ${h.error?"warn":d?"good":""}`;const u=oe==null?void 0:oe.info();j("#vr-hand-cam-btn").textContent=u!=null&&u.running?"Камера маяка вкл.":"Камера маяка (опц.)",j("#vr-hand-camera").hidden=!(u!=null&&u.running),j("#vr-hand-cal1").disabled=!d,j("#vr-hand-cal2").disabled=!d||Le.calibratedStep<1;const p=j("#vr-hand-cal-status"),v=u!=null&&u.running?` Маяк в камере: ${u.status==="pair"?"видна пара пятен":u.status==="single"?"видно одно пятно":"пока не в кадре"}.`:"";p.textContent=(ho||(Le.calibratedStep>=2?"Калибровка двух жестов готова.":Le.calibratedStep===1?"Шаг 1 записан — согните руку в локте и нажмите Жест 2.":d?"Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).":"Сначала подключите браслет."))+v,p.className=`vr-status-line ${Le.calibratedStep>=2?"good":""}`}j("#vr-start").disabled=!s||Bi;const l=j("#vr-status");return l.textContent=Bi?"Надевайте очки и смотрите прямо перед собой…":e.fresh?ee.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":ee.mode==="hand"&&!s?"Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.":ee.mode==="hand"?"Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.":ee.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп очков.",l.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function pf(){if(At.phase==="inspect"){Kr("Сначала завершите осмотр находки.");return}const i=j("#vr-dialog");i.open||(bn(),Ye(),i.showModal())}async function A2(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function R2(i=!1){i&&(Ac=j("#low-quality").checked,_l=ee.quality==="low",ut.low!==_l&&ut.setQuality(_l))}function mf(i=!1){if(!Ne)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==Zr)&&(Zr=t,ut.setVrStereo(t))}async function gf(){if(Ne||At.phase==="inspect")return!1;const i=bn(),t=ee.mode==="hand",e=j("#vr-dialog");if(i.setMode(ee.mode==="fusion"?"fusion":"gyro"),e.open&&(Ec=!0,e.close(),Ec=!1),R2(!0),i.start(),t){ai();const n=performance.now();Le.recenterOnSessionStart(n),Le.onPhaseChange("search",n)}return Ne=!0,Qn=At.taps*(Tc/3),ti=!1,ri=!1,Vn.reset(),document.body.classList.add("vr-active"),ut.setVrHandMode(t),Zr=!1,mf(!0),ut.setHeadLook(0,0),ut.resize(),!0}async function C2(){if(Bi||!Ye().ready)return;await A2();const i=++uo,t=j("#vr-dialog"),e=j("#vr-countdown");Bi=!0,e.hidden=!1,Ye();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==uo||!t.open){Bi=!1,e.hidden=!0;return}Bi=!1,e.hidden=!0,await gf()}function Po(i="gesture"){var t;return!ri||At.phase!=="inspect"||At.reviewing?!1:((t=ut.revealState)!=null&&t.ready||(ut.finishReveal(),gs()),ri=!1,Vn.reset(),qs(!0,{fromVr:!0}),Qn=0,ti=!1,!0)}function Pr(i="exit"){var t;if(!Ne)return!1;ri&&Po("exit"),Ne=!1,uo++,Bi=!1,j("#vr-countdown").hidden=!0,Ae==null||Ae.stop(),oe==null||oe.stop(),ut.setVrHandMode(!1),ut.setVrStereo(!1),ut.setHeadLook(0,0),Zr=!1,Qn=0,ti=!1,Vn.reset(),document.body.classList.remove("vr-active","vr-single"),ut.low!==Ac&&ut.setQuality(Ac);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),ut.resize(),qi(),fo?(fo=!1,cf(),j("#complete-dialog").showModal()):i!=="hidden"&&Kr("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function Cc(i){const t=Ae.update(i);return ut.setHeadLook(t.yaw,t.pitch),t}function go(i,t=performance.now()){var s,r,a;if(!Ne||!Ae)return;const e=Cc(i),n=Tc/3;if(ee.mode==="hand"){ai(),oe==null||oe.process(!1,t);const o=(oe==null?void 0:oe.sample(t))||null,l=ut.handHitsBin(),c=Le.update(i,{beacon:o,headLook:ut.headLook,phase:At.phase,revealReady:!!((s=ut.revealState)!=null&&s.ready),handOverBin:l,now:t});if(ut.updateVrHand(i,{visible:!0,handSide:c.handSide,shoulderPos:c.shoulderPos,elbowPos:c.elbowPos,pos:c.pos,vel:c.vel,qArm:c.qArm,reach:c.reach,elbowBendDeg:c.elbowBendDeg,overBin:l,phase:At.phase,calmLowerProgress:c.calmLowerProgress,beaconActive:c.trackingSource==="gyro+beacon"}),At.phase==="search"){Vn.reset(),ti=l&&c.reach>=.62;for(let h=0;h<c.pokes&&At.phase==="search";h++)mo()}else At.phase==="inspect"&&(ti=!1,ut.setHandItemRotation(c.itemRot.x,c.itemRot.y,c.itemRot.z,c.itemQuat),c.decision==="discard"?(ri=!1,Vn.reset(),ut.launchDiscardToss(c.throwVel),qs(!1,{fromVr:!0}),Le.onPhaseChange("search",t)):(c.decision==="keep"||(r=ut.revealState)!=null&&r.ready&&Vn.update(e.yaw,t))&&(ri=!1,Vn.reset(),qs(!0,{fromVr:!0}),Le.onPhaseChange("search",t)));return}if(At.phase==="search")if(Vn.reset(),ti=ut.gazeHitsBin(),ti){Qn=Math.min(Tc,Qn+i);const o=Math.min(3,Math.floor(Qn/n+1e-9));for(;At.phase==="search"&&At.taps<o;){const l=At.taps;if(mo(),At.phase==="search"&&At.taps===l)break}}else Qn=Math.max(At.taps*n,Qn-i*1.5);else At.phase==="inspect"&&ri&&(ti=!1,(a=ut.revealState)!=null&&a.ready&&Vn.update(e.yaw,t)&&Po("gesture"))}function rs(){return{active:Ne,stereo:Zr,settings:{...ee},focus:+Qn.toFixed(3),gazeHit:ti,pendingSave:ri,pendingCompletion:fo,shake:Vn.info(),look:(Ae==null?void 0:Ae.info())||null,wrist:Le?{link:(Ze==null?void 0:Ze.status())||null,beacon:(oe==null?void 0:oe.info())||null,hand:Le.snapshot()}:null,world:(ut==null?void 0:ut.vrInfo())||null}}function Zu(i,t,e=10,n=.03){const s=bn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),Ne?go(0,r.lastAt):Cc(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),Ne?go(n,r.lastAt):Cc(n);return ut.update(0),r.lastAt=performance.now(),rs()}function vf(i){if(bc=requestAnimationFrame(vf),us.some(n=>n.open)){j("#vr-dialog").open&&!ir&&(Ae==null||Ae.processPrep(),ee.mode==="hand"&&(oe==null||oe.process()),Ye()),os=i;return}if(ir||ut.testRevealHold){os=i;return}const t=os?(i-os)/1e3:.016;os=i;const e=Math.min(t,.1);Ne&&go(e,i),ut.update(e,t),gs(),Ne||x2()}function P2(){Pn("[data-pose]").forEach(t=>t.addEventListener("click",()=>{ut.setPose(t.dataset.pose),po()})),j("#zoom-in").addEventListener("click",()=>{ut.setZoom(.2),Fr()}),j("#zoom-out").addEventListener("click",()=>{ut.setZoom(-.2),Fr()}),j("#zoom-reset").addEventListener("click",()=>{ut.setZoom(1-ut.zoom),Fr()}),j("#search-button").addEventListener("click",mo),j("#discard").addEventListener("click",()=>qs(!1)),j("#keep").addEventListener("click",()=>qs(!0)),j("#close-review").addEventListener("click",qu),j("#open-collection").addEventListener("click",Rc),j("#open-settings").addEventListener("click",()=>{j("#reset-confirm").hidden=!0,j("#reset-button").hidden=!1,j("#settings-dialog").showModal()}),j("#open-vr").addEventListener("click",pf),Pn("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{const e=t.dataset.vrMode;ee.mode=e==="fusion"?"fusion":e==="hand"?"hand":"gyro",Nr(),In=null,Ei="",ee.mode!=="hand"&&(oe==null||oe.stop()),bn().setMode(ee.mode==="fusion"?"fusion":"gyro"),Ye()})),j("#vr-gyro-btn").addEventListener("click",async()=>{Ei="",await bn().requestGyro(),Ye()}),j("#vr-start-camera").addEventListener("click",async()=>{Ei="";const t=bn();t.tracker.error=null,await t.startCamera(),Ye()}),Pn(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";Ei="",In=In===e?null:e,Ye()})),j("#vr-camera").addEventListener("click",t=>{if(!In)return;const e=bn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(In==="left"?ee.leftHue=Math.round(n.hue):ee.rightHue=Math.round(n.hue),e.setHues(ee.leftHue,ee.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Nr(),Ei="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",In=null,e.tracker.process(!0),Ye())}),j("#vr-calibrate").addEventListener("click",()=>{const t=bn();t.tracker.process(!0);const e=t.tracker.calibrate();Ei=e.ok?"":e.message,Ye()}),Pn("[data-hand-side]").forEach(t=>t.addEventListener("click",()=>ih(t.dataset.handSide))),j("#vr-hand-room-btn").addEventListener("click",async()=>{var t;ai(),ho="",await Ze.startFirebase(((t=j("#vr-hand-fb"))==null?void 0:t.value)||""),Ye()}),j("#vr-hand-demo-btn").addEventListener("click",()=>{ai(),ho="",Ze.startDemo("111111"),Ye()}),j("#vr-hand-cam-btn").addEventListener("click",async()=>{const t=ff();t.running?t.stop():await t.start(j("#vr-hand-camera")),Ye()}),j("#vr-hand-cal1").addEventListener("click",()=>Jr("pose1")),j("#vr-hand-cal2").addEventListener("click",()=>Jr("pose2")),j("#vr-start").addEventListener("click",C2),j("#vr-quality").value=ee.quality,j("#vr-quality").addEventListener("change",t=>{ee.quality=t.target.value,Nr()}),Pn("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),us.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{Oe=null,os=0,t.id==="vr-dialog"&&!Ec&&!Ne&&(uo++,Bi=!1,j("#vr-countdown").hidden=!0,In=null,Ei="",Ae==null||Ae.stop(),oe==null||oe.stop())})}),Pn("[data-filter]").forEach(t=>t.addEventListener("click",()=>{Mc=t.dataset.filter,Pn("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),hf()})),j("#low-quality").addEventListener("change",t=>{ut.setQuality(t.target.checked),ut.update(.016);try{ci.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),j("#reset-button").addEventListener("click",()=>{j("#reset-confirm").hidden=!1,j("#reset-button").hidden=!0}),j("#reset-cancel").addEventListener("click",()=>{j("#reset-confirm").hidden=!0,j("#reset-button").hidden=!1}),j("#reset-yes").addEventListener("click",uf),j("#continue-button").addEventListener("click",()=>j("#complete-dialog").close()),j("#view-complete").addEventListener("click",()=>{j("#complete-dialog").close(),Rc()});const i=j("#world");i.addEventListener("pointerdown",t=>{if(Ne){clearTimeout(br),br=setTimeout(()=>Pr("long-press"),900);return}us.some(e=>e.open)||Oe||!t.isPrimary||(At.phase==="inspect"&&(ut.finishReveal(),gs()),Oe={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!Oe||Oe.id!==t.pointerId)return;const e=t.clientX-Oe.x,n=t.clientY-Oe.y;Math.hypot(t.clientX-Oe.startX,t.clientY-Oe.startY)>10&&(Oe.moved=!0,At.phase!=="inspect"&&!Ne&&y2()),At.phase==="inspect"?(ut.rotate(e,n),po()):Ne||ut.lookBy(e,n),Oe.x=t.clientX,Oe.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout(br),!Oe||Oe.id!==t.pointerId)return;const e=!Oe.moved;Oe=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&At.phase==="search"&&ut.hitBin(t.clientX,t.clientY)&&mo()}),i.addEventListener("pointercancel",()=>{clearTimeout(br),Oe=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout(br),Oe=null}),document.addEventListener("visibilitychange",()=>{ir=document.hidden,Oe=null,os=0,document.hidden&&Ne&&Pr("hidden")}),window.addEventListener("blur",()=>Oe=null),window.addEventListener("resize",()=>{ut.resize(),Ne&&mf(),us.some(t=>t.open)&&ut.update(.016)}),document.addEventListener("fullscreenchange",()=>{Ne&&!document.fullscreenElement&&Pr("fullscreen")}),window.addEventListener("pagehide",()=>{ri&&Po("pagehide"),Ne&&(Ae==null||Ae.stop()),oe==null||oe.stop(),Ze==null||Ze.stop()}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&Ne){t.preventDefault(),Pr("escape");return}t.key==="Escape"&&!us.some(e=>e.open)&&At.phase==="inspect"&&(t.preventDefault(),At.reviewing?qu():(ut.finishReveal(),gs(),qs(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),ir=!0,j("#webgl-error").hidden=!1})}async function I2(){try{ut=new M_(j("#world"));try{ci.getItem("white-night-quality")==="low"&&(ut.setQuality(!0),j("#low-quality").checked=!0)}catch{}P2(),qi(),await Promise.all([document.fonts.ready,Ax()]),ut.update(.016),j("#loading").hidden=!0,window.__READY__=!0,bc=requestAnimationFrame(vf),Xu&&(window.__WORLD__=ut),Xu&&(window.__GAME_TEST__={getState:()=>structuredClone(At),getMetrics:()=>ut.metrics(),settle:()=>{ut.finishReveal(),ut.kick=0,ut.dirty=!0,ut.update(.016),gs()},seekReveal:i=>{ut.testRevealHold=!0,ut.reveal=Math.max(0,Math.min(1,i)),ut.applyReveal(),ut.dirty=!0,ut.update(0),gs()},setPose:i=>{ut.setPose(i),ut.update(.1),po()},getRotation:()=>({x:ut.targetX,y:ut.targetY}),binScreen:()=>ut.binScreen(),forceNext:i=>{if(!mn.some(t=>t.id===i))throw Error("unknown item");wc=i},setView:i=>{const t=ut.setView(i);return ut.update(.016),t},look:(i,t)=>(ut.lookBy(0,0),ut.headLook.yaw=p2(i,-41,41)*Math.PI/180,ut.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,ut.applyCameraPose(),ut.dirty=!0,ut.update(.016),ut.lookInfo()),sky:()=>({stars:ut.sky.stars.geometry.attributes.position.count,moon:ut.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:ut.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{us.forEach(i=>i.close()),uf()},setCollection:i=>{At=$r({collection:i,searches:i.length}),ut.hide(),Co(),qi()},isPaused:()=>ir,items:mn.map(i=>i.id),scene:()=>({staticVisible:ut.static.visible,drawCalls:ut.renderer.info.render.calls,headLook:ut.lookInfo(),sky:{stars:ut.sky.stars.geometry.attributes.position.count,moonVisible:ut.sky.moon.visible}}),vr:{info:()=>rs(),open:()=>pf(),setMode:i=>(ee.mode=i==="fusion"?"fusion":i==="hand"?"hand":"gyro",Nr(),ee.mode!=="hand"&&(oe==null||oe.stop()),bn().setMode(ee.mode==="fusion"?"fusion":"gyro"),Ye(),rs()),setHandSide:i=>(ih(i),rs()),requestGyro:()=>bn().requestGyro(),gyro:(i,t,e=10,n=.03)=>Zu(i,t,e,n),marker:(i,t)=>bn().tracker.inject(i,t),calibrate:i=>bn().tracker.calibrate(i),wristDemo:i=>(ai(),Ze.startDemo(i||"111111")),wristPacket:(i,t=performance.now())=>(ai(),Ze.injectPacket(i,t),rs()),wristBeacon:(i,t=performance.now())=>(ai(),ff().inject(i,t)),wristCalibrateStretch:()=>Jr("pose1"),wristCalibrateBend:()=>Jr("pose2"),start:()=>gf(),stop:()=>Pr("test"),step:(i=.1,t)=>{let e=Math.max(0,i),n=t;for(;e>0;){const s=Math.min(.05,e);n!==void 0&&(n+=s*1e3),Ae&&(Ae.gyro.lastAt=performance.now()),go(s,n!==void 0?n:performance.now()),e-=s}return ut.update(0),rs()},shake:(i=25)=>{for(const t of[-i,i,-i])Zu(t,0,10,.03);return rs()},settings:()=>({...ee}),finish:()=>Po("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),j("#loading").hidden=!0,j("#webgl-error").hidden=!1,cancelAnimationFrame(bc)}}I2();
