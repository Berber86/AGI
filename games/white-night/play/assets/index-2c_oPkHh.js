(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ec="180",Md=0,eh=1,Sd=2,Yu=1,$u=2,Mi=3,Hi=0,en=1,ze=2,an=0,Gs=1,Nr=2,nh=3,ih=4,Zu=5,Ti=100,bd=101,wd=102,Td=103,Ed=104,gl=200,Ad=201,Rd=202,Cd=203,vl=204,xl=205,Ju=206,Pd=207,Ku=208,Id=209,Ld=210,Dd=211,Ud=212,Nd=213,Fd=214,_l=0,yl=1,Ml=2,qs=3,Sl=4,bl=5,wl=6,Tl=7,Ac=0,Od=1,zd=2,ki=0,ju=1,Qu=2,tf=3,Rc=4,ef=5,nf=6,sf=7,rf=300,Ys=301,$s=302,El=303,Al=304,fo=306,Vi=1e3,as=1001,Rl=1002,ln=1003,kd=1004,jr=1005,ei=1006,Ro=1007,os=1008,oi=1009,af=1010,of=1011,Fr=1012,Cc=1013,hs=1014,Wn=1015,li=1016,Pc=1017,Ic=1018,Zs=1020,lf=35902,cf=35899,hf=1021,uf=1022,Xn=1023,Or=1026,Js=1027,po=1028,Lc=1029,ff=1030,Dc=1031,Uc=1033,Va=33776,Ga=33777,Wa=33778,Xa=33779,Cl=35840,Pl=35841,Il=35842,Ll=35843,Dl=36196,Ul=37492,Nl=37496,Fl=37808,Ol=37809,zl=37810,kl=37811,Bl=37812,Hl=37813,Vl=37814,Gl=37815,Wl=37816,Xl=37817,ql=37818,Yl=37819,$l=37820,Zl=37821,Jl=36492,Kl=36494,jl=36495,Ql=36283,tc=36284,ec=36285,nc=36286,Bd=3200,Hd=3201,mo=0,Vd=1,_n="",qe="srgb",Ks="srgb-linear",Ja="linear",xe="srgb",vs=7680,sh=519,Gd=512,Wd=513,Xd=514,df=515,qd=516,Yd=517,$d=518,Zd=519,ic=35044,Qr=35048,rh="300 es",ni=2e3,Ka=2001;class ir{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ah=1234567;const Cr=Math.PI/180,zr=180/Math.PI;function ii(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Je[i&255]+Je[i>>8&255]+Je[i>>16&255]+Je[i>>24&255]+"-"+Je[t&255]+Je[t>>8&255]+"-"+Je[t>>16&15|64]+Je[t>>24&255]+"-"+Je[e&63|128]+Je[e>>8&255]+"-"+Je[e>>16&255]+Je[e>>24&255]+Je[n&255]+Je[n>>8&255]+Je[n>>16&255]+Je[n>>24&255]).toLowerCase()}function ae(i,t,e){return Math.max(t,Math.min(e,i))}function Nc(i,t){return(i%t+t)%t}function Jd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Kd(i,t,e){return i!==t?(e-i)/(t-i):0}function Pr(i,t,e){return(1-e)*i+e*t}function jd(i,t,e,n){return Pr(i,t,1-Math.exp(-e*n))}function Qd(i,t=1){return t-Math.abs(Nc(i,t*2)-t)}function t0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function e0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function n0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function i0(i,t){return i+Math.random()*(t-i)}function s0(i){return i*(.5-Math.random())}function r0(i){i!==void 0&&(ah=i);let t=ah+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function a0(i){return i*Cr}function o0(i){return i*zr}function l0(i){return(i&i-1)===0&&i!==0}function c0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function h0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function u0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),f=r((t-n)/2),p=a((t-n)/2),u=r((n-t)/2),m=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*f,l*p,o*c);break;case"YZY":i.set(l*p,o*h,l*f,o*c);break;case"ZXZ":i.set(l*f,l*p,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*u,o*c);break;case"YXY":i.set(l*u,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _e(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const me={DEG2RAD:Cr,RAD2DEG:zr,generateUUID:ii,clamp:ae,euclideanModulo:Nc,mapLinear:Jd,inverseLerp:Kd,lerp:Pr,damp:jd,pingpong:Qd,smoothstep:t0,smootherstep:e0,randInt:n0,randFloat:i0,randFloatSpread:s0,seededRandom:r0,degToRad:a0,radToDeg:o0,isPowerOfTwo:l0,ceilPowerOfTwo:c0,floorPowerOfTwo:h0,setQuaternionFromProperEuler:u0,normalize:_e,denormalize:Gn};class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Mn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3];const p=r[a+0],u=r[a+1],m=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=u,t[e+2]=m,t[e+3]=v;return}if(f!==v||l!==p||c!==u||h!==m){let g=1-o;const d=l*p+c*u+h*m+f*v,x=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const E=Math.sqrt(y),b=Math.atan2(E,d*x);g=Math.sin(g*b)/E,o=Math.sin(o*b)/E}const _=o*x;if(l=l*g+p*_,c=c*g+u*_,h=h*g+m*_,f=f*g+v*_,g===1-o){const E=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=E,c*=E,h*=E,f*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],p=r[a+1],u=r[a+2],m=r[a+3];return t[e]=o*m+h*f+l*u-c*p,t[e+1]=l*m+h*p+c*f-o*u,t[e+2]=c*m+h*u+o*p-l*f,t[e+3]=h*m-o*f-l*p-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),p=l(n/2),u=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=p*h*f+c*u*m,this._y=c*u*f-p*h*m,this._z=c*h*m+p*u*f,this._w=c*h*f-p*u*m;break;case"YXZ":this._x=p*h*f+c*u*m,this._y=c*u*f-p*h*m,this._z=c*h*m-p*u*f,this._w=c*h*f+p*u*m;break;case"ZXY":this._x=p*h*f-c*u*m,this._y=c*u*f+p*h*m,this._z=c*h*m+p*u*f,this._w=c*h*f-p*u*m;break;case"ZYX":this._x=p*h*f-c*u*m,this._y=c*u*f+p*h*m,this._z=c*h*m-p*u*f,this._w=c*h*f+p*u*m;break;case"YZX":this._x=p*h*f+c*u*m,this._y=c*u*f+p*h*m,this._z=c*h*m-p*u*f,this._w=c*h*f-p*u*m;break;case"XZY":this._x=p*h*f-c*u*m,this._y=c*u*f-p*h*m,this._z=c*h*m+p*u*f,this._w=c*h*f+p*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],p=n+o+f;if(p>0){const u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(n>o&&n>f){const u=2*Math.sqrt(1+n-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-n-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-n-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ae(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-e)*h)/c,p=Math.sin(e*h)/c;return this._w=a*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=r*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(oh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(oh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this.z=ae(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this.z=ae(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Co.copy(this).projectOnVector(t),this.sub(Co)}reflect(t){return this.sub(Co.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Co=new D,oh=new Mn;class ie{constructor(t,e,n,s,r,a,o,l,c){ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],p=n[2],u=n[5],m=n[8],v=s[0],g=s[3],d=s[6],x=s[1],y=s[4],_=s[7],E=s[2],b=s[5],A=s[8];return r[0]=a*v+o*x+l*E,r[3]=a*g+o*y+l*b,r[6]=a*d+o*_+l*A,r[1]=c*v+h*x+f*E,r[4]=c*g+h*y+f*b,r[7]=c*d+h*_+f*A,r[2]=p*v+u*x+m*E,r[5]=p*g+u*y+m*b,r[8]=p*d+u*_+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,p=o*l-h*r,u=c*r-a*l,m=e*f+n*p+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=f*v,t[1]=(s*c-h*n)*v,t[2]=(o*n-s*a)*v,t[3]=p*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=u*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Po.makeScale(t,e)),this}rotate(t){return this.premultiply(Po.makeRotation(-t)),this}translate(t,e){return this.premultiply(Po.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Po=new ie;function pf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function f0(){const i=kr("canvas");return i.style.display="block",i}const lh={};function Br(i){i in lh||(lh[i]=!0,console.warn(i))}function d0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const ch=new ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hh=new ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function p0(){const i={enabled:!0,workingColorSpace:Ks,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===xe&&(s.r=Ai(s.r),s.g=Ai(s.g),s.b=Ai(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xe&&(s.r=Ws(s.r),s.g=Ws(s.g),s.b=Ws(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===_n?Ja:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Br("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Br("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ks]:{primaries:t,whitePoint:n,transfer:Ja,toXYZ:ch,fromXYZ:hh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:t,whitePoint:n,transfer:xe,toXYZ:ch,fromXYZ:hh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}}),i}const de=p0();function Ai(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ws(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let xs;class m0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{xs===void 0&&(xs=kr("canvas")),xs.width=t.width,xs.height=t.height;const s=xs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=xs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ai(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ai(e[n]/255)*255):e[n]=Ai(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let g0=0;class Fc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=ii(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Io(s[a].image)):r.push(Io(s[a]))}else r=Io(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Io(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?m0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let v0=0;const Lo=new D;class $e extends ir{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,n=as,s=as,r=ei,a=os,o=Xn,l=oi,c=$e.DEFAULT_ANISOTROPY,h=_n){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:v0++}),this.uuid=ii(),this.name="",this.source=new Fc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Lo).x}get height(){return this.source.getSize(Lo).y}get depth(){return this.source.getSize(Lo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Vi:t.x=t.x-Math.floor(t.x);break;case as:t.x=t.x<0?0:1;break;case Rl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Vi:t.y=t.y-Math.floor(t.y);break;case as:t.y=t.y<0?0:1;break;case Rl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=rf;$e.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,n=0,s=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],p=l[1],u=l[5],m=l[9],v=l[2],g=l[6],d=l[10];if(Math.abs(h-p)<.01&&Math.abs(f-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,_=(u+1)/2,E=(d+1)/2,b=(h+p)/4,A=(f+v)/4,T=(m+g)/4;return y>_&&y>E?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=b/n,r=A/n):_>E?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=b/s,r=T/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=A/r,s=T/r),this.set(n,s,r,e),this}let x=Math.sqrt((g-m)*(g-m)+(f-v)*(f-v)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(f-v)/x,this.z=(p-h)/x,this.w=Math.acos((c+u+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this.z=ae(this.z,t.z,e.z),this.w=ae(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this.z=ae(this.z,t,e),this.w=ae(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class x0 extends ir{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new $e(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ei,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Fc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Sn extends x0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class mf extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=as,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class _0 extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=as,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(On.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(On.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=On.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(t.matrixWorld),this.expandByPoint(On);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ta.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ta.copy(n.boundingBox)),ta.applyMatrix4(t.matrixWorld),this.union(ta)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,On),On.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hr),ea.subVectors(this.max,hr),_s.subVectors(t.a,hr),ys.subVectors(t.b,hr),Ms.subVectors(t.c,hr),Pi.subVectors(ys,_s),Ii.subVectors(Ms,ys),Yi.subVectors(_s,Ms);let e=[0,-Pi.z,Pi.y,0,-Ii.z,Ii.y,0,-Yi.z,Yi.y,Pi.z,0,-Pi.x,Ii.z,0,-Ii.x,Yi.z,0,-Yi.x,-Pi.y,Pi.x,0,-Ii.y,Ii.x,0,-Yi.y,Yi.x,0];return!Do(e,_s,ys,Ms,ea)||(e=[1,0,0,0,1,0,0,0,1],!Do(e,_s,ys,Ms,ea))?!1:(na.crossVectors(Pi,Ii),e=[na.x,na.y,na.z],Do(e,_s,ys,Ms,ea))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,On).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(On).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(pi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const pi=[new D,new D,new D,new D,new D,new D,new D,new D],On=new D,ta=new qn,_s=new D,ys=new D,Ms=new D,Pi=new D,Ii=new D,Yi=new D,hr=new D,ea=new D,na=new D,$i=new D;function Do(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){$i.fromArray(i,r);const o=s.x*Math.abs($i.x)+s.y*Math.abs($i.y)+s.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),h=n.dot($i);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const y0=new qn,ur=new D,Uo=new D;class ms{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):y0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ur.subVectors(t,this.center);const e=ur.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ur,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Uo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ur.copy(t.center).add(Uo)),this.expandByPoint(ur.copy(t.center).sub(Uo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const mi=new D,No=new D,ia=new D,Li=new D,Fo=new D,sa=new D,Oo=new D;class Oc{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,mi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=mi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(mi.copy(this.origin).addScaledVector(this.direction,e),mi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){No.copy(t).add(e).multiplyScalar(.5),ia.copy(e).sub(t).normalize(),Li.copy(this.origin).sub(No);const r=t.distanceTo(e)*.5,a=-this.direction.dot(ia),o=Li.dot(this.direction),l=-Li.dot(ia),c=Li.lengthSq(),h=Math.abs(1-a*a);let f,p,u,m;if(h>0)if(f=a*l-o,p=a*o-l,m=r*h,f>=0)if(p>=-m)if(p<=m){const v=1/h;f*=v,p*=v,u=f*(f+a*p+2*o)+p*(a*f+p+2*l)+c}else p=r,f=Math.max(0,-(a*p+o)),u=-f*f+p*(p+2*l)+c;else p=-r,f=Math.max(0,-(a*p+o)),u=-f*f+p*(p+2*l)+c;else p<=-m?(f=Math.max(0,-(-a*r+o)),p=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+p*(p+2*l)+c):p<=m?(f=0,p=Math.min(Math.max(-r,-l),r),u=p*(p+2*l)+c):(f=Math.max(0,-(a*r+o)),p=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+p*(p+2*l)+c);else p=a>0?-r:r,f=Math.max(0,-(a*p+o)),u=-f*f+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(No).addScaledVector(ia,p),u}intersectSphere(t,e){mi.subVectors(t.center,this.origin);const n=mi.dot(this.direction),s=mi.dot(mi)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(n=(t.min.x-p.x)*c,s=(t.max.x-p.x)*c):(n=(t.max.x-p.x)*c,s=(t.min.x-p.x)*c),h>=0?(r=(t.min.y-p.y)*h,a=(t.max.y-p.y)*h):(r=(t.max.y-p.y)*h,a=(t.min.y-p.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-p.z)*f,l=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,l=(t.min.z-p.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,mi)!==null}intersectTriangle(t,e,n,s,r){Fo.subVectors(e,t),sa.subVectors(n,t),Oo.crossVectors(Fo,sa);let a=this.direction.dot(Oo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Li.subVectors(this.origin,t);const l=o*this.direction.dot(sa.crossVectors(Li,sa));if(l<0)return null;const c=o*this.direction.dot(Fo.cross(Li));if(c<0||l+c>a)return null;const h=-o*Li.dot(Oo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ce{constructor(t,e,n,s,r,a,o,l,c,h,f,p,u,m,v,g){ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,p,u,m,v,g)}set(t,e,n,s,r,a,o,l,c,h,f,p,u,m,v,g){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=f,d[14]=p,d[3]=u,d[7]=m,d[11]=v,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ce().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ss.setFromMatrixColumn(t,0).length(),r=1/Ss.setFromMatrixColumn(t,1).length(),a=1/Ss.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const p=a*h,u=a*f,m=o*h,v=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=p-v*c,e[9]=-o*l,e[2]=v-p*c,e[6]=m+u*c,e[10]=a*l}else if(t.order==="YXZ"){const p=l*h,u=l*f,m=c*h,v=c*f;e[0]=p+v*o,e[4]=m*o-u,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=u*o-m,e[6]=v+p*o,e[10]=a*l}else if(t.order==="ZXY"){const p=l*h,u=l*f,m=c*h,v=c*f;e[0]=p-v*o,e[4]=-a*f,e[8]=m+u*o,e[1]=u+m*o,e[5]=a*h,e[9]=v-p*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const p=a*h,u=a*f,m=o*h,v=o*f;e[0]=l*h,e[4]=m*c-u,e[8]=p*c+v,e[1]=l*f,e[5]=v*c+p,e[9]=u*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const p=a*l,u=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=v-p*f,e[8]=m*f+u,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=u*f+m,e[10]=p-v*f}else if(t.order==="XZY"){const p=a*l,u=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=p*f+v,e[5]=a*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=o*h,e[10]=v*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(M0,t,S0)}lookAt(t,e,n){const s=this.elements;return mn.subVectors(t,e),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Di.crossVectors(n,mn),Di.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Di.crossVectors(n,mn)),Di.normalize(),ra.crossVectors(mn,Di),s[0]=Di.x,s[4]=ra.x,s[8]=mn.x,s[1]=Di.y,s[5]=ra.y,s[9]=mn.y,s[2]=Di.z,s[6]=ra.z,s[10]=mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],p=n[9],u=n[13],m=n[2],v=n[6],g=n[10],d=n[14],x=n[3],y=n[7],_=n[11],E=n[15],b=s[0],A=s[4],T=s[8],S=s[12],M=s[1],R=s[5],L=s[9],P=s[13],F=s[2],O=s[6],z=s[10],X=s[14],H=s[3],q=s[7],Q=s[11],at=s[15];return r[0]=a*b+o*M+l*F+c*H,r[4]=a*A+o*R+l*O+c*q,r[8]=a*T+o*L+l*z+c*Q,r[12]=a*S+o*P+l*X+c*at,r[1]=h*b+f*M+p*F+u*H,r[5]=h*A+f*R+p*O+u*q,r[9]=h*T+f*L+p*z+u*Q,r[13]=h*S+f*P+p*X+u*at,r[2]=m*b+v*M+g*F+d*H,r[6]=m*A+v*R+g*O+d*q,r[10]=m*T+v*L+g*z+d*Q,r[14]=m*S+v*P+g*X+d*at,r[3]=x*b+y*M+_*F+E*H,r[7]=x*A+y*R+_*O+E*q,r[11]=x*T+y*L+_*z+E*Q,r[15]=x*S+y*P+_*X+E*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],p=t[10],u=t[14],m=t[3],v=t[7],g=t[11],d=t[15];return m*(+r*l*f-s*c*f-r*o*p+n*c*p+s*o*u-n*l*u)+v*(+e*l*u-e*c*p+r*a*p-s*a*u+s*c*h-r*l*h)+g*(+e*c*f-e*o*u-r*a*f+n*a*u+r*o*h-n*c*h)+d*(-s*o*h-e*l*f+e*o*p+s*a*f-n*a*p+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],p=t[10],u=t[11],m=t[12],v=t[13],g=t[14],d=t[15],x=f*g*c-v*p*c+v*l*u-o*g*u-f*l*d+o*p*d,y=m*p*c-h*g*c-m*l*u+a*g*u+h*l*d-a*p*d,_=h*v*c-m*f*c+m*o*u-a*v*u-h*o*d+a*f*d,E=m*f*l-h*v*l-m*o*p+a*v*p+h*o*g-a*f*g,b=e*x+n*y+s*_+r*E;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return t[0]=x*A,t[1]=(v*p*r-f*g*r-v*s*u+n*g*u+f*s*d-n*p*d)*A,t[2]=(o*g*r-v*l*r+v*s*c-n*g*c-o*s*d+n*l*d)*A,t[3]=(f*l*r-o*p*r-f*s*c+n*p*c+o*s*u-n*l*u)*A,t[4]=y*A,t[5]=(h*g*r-m*p*r+m*s*u-e*g*u-h*s*d+e*p*d)*A,t[6]=(m*l*r-a*g*r-m*s*c+e*g*c+a*s*d-e*l*d)*A,t[7]=(a*p*r-h*l*r+h*s*c-e*p*c-a*s*u+e*l*u)*A,t[8]=_*A,t[9]=(m*f*r-h*v*r-m*n*u+e*v*u+h*n*d-e*f*d)*A,t[10]=(a*v*r-m*o*r+m*n*c-e*v*c-a*n*d+e*o*d)*A,t[11]=(h*o*r-a*f*r-h*n*c+e*f*c+a*n*u-e*o*u)*A,t[12]=E*A,t[13]=(h*v*s-m*f*s+m*n*p-e*v*p-h*n*g+e*f*g)*A,t[14]=(m*o*s-a*v*s-m*n*l+e*v*l+a*n*g-e*o*g)*A,t[15]=(a*f*s-h*o*s+h*n*l-e*f*l-a*n*p+e*o*p)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,p=r*c,u=r*h,m=r*f,v=a*h,g=a*f,d=o*f,x=l*c,y=l*h,_=l*f,E=n.x,b=n.y,A=n.z;return s[0]=(1-(v+d))*E,s[1]=(u+_)*E,s[2]=(m-y)*E,s[3]=0,s[4]=(u-_)*b,s[5]=(1-(p+d))*b,s[6]=(g+x)*b,s[7]=0,s[8]=(m+y)*A,s[9]=(g-x)*A,s[10]=(1-(p+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ss.set(s[0],s[1],s[2]).length();const a=Ss.set(s[4],s[5],s[6]).length(),o=Ss.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],zn.copy(this);const c=1/r,h=1/a,f=1/o;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=h,zn.elements[5]*=h,zn.elements[6]*=h,zn.elements[8]*=f,zn.elements[9]*=f,zn.elements[10]*=f,e.setFromRotationMatrix(zn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=ni,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),p=(e+t)/(e-t),u=(n+s)/(n-s);let m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===ni)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Ka)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ni,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),p=-(e+t)/(e-t),u=-(n+s)/(n-s);let m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===ni)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===Ka)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ss=new D,zn=new ce,M0=new D(0,0,0),S0=new D(1,1,1),Di=new D,ra=new D,mn=new D,uh=new ce,fh=new Mn;class Un{constructor(t=0,e=0,n=0,s=Un.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],p=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(ae(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ae(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ae(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ae(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ae(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return uh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(uh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return fh.setFromEuler(this),this.setFromQuaternion(fh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Un.DEFAULT_ORDER="XYZ";class zc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let b0=0;const dh=new D,bs=new Mn,gi=new ce,aa=new D,fr=new D,w0=new D,T0=new Mn,ph=new D(1,0,0),mh=new D(0,1,0),gh=new D(0,0,1),vh={type:"added"},E0={type:"removed"},ws={type:"childadded",child:null},zo={type:"childremoved",child:null};class ke extends ir{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:b0++}),this.uuid=ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ke.DEFAULT_UP.clone();const t=new D,e=new Un,n=new Mn,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ce},normalMatrix:{value:new ie}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.multiply(bs),this}rotateOnWorldAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.premultiply(bs),this}rotateX(t){return this.rotateOnAxis(ph,t)}rotateY(t){return this.rotateOnAxis(mh,t)}rotateZ(t){return this.rotateOnAxis(gh,t)}translateOnAxis(t,e){return dh.copy(t).applyQuaternion(this.quaternion),this.position.add(dh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ph,t)}translateY(t){return this.translateOnAxis(mh,t)}translateZ(t){return this.translateOnAxis(gh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?aa.copy(t):aa.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),fr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(fr,aa,this.up):gi.lookAt(aa,fr,this.up),this.quaternion.setFromRotationMatrix(gi),s&&(gi.extractRotation(s.matrixWorld),bs.setFromRotationMatrix(gi),this.quaternion.premultiply(bs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(vh),ws.child=t,this.dispatchEvent(ws),ws.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(E0),zo.child=t,this.dispatchEvent(zo),zo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gi.multiply(t.parent.matrixWorld)),t.applyMatrix4(gi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(vh),ws.child=t,this.dispatchEvent(ws),ws.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,t,w0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fr,T0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),p=a(t.skeletons),u=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),u.length>0&&(n.animations=u),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ke.DEFAULT_UP=new D(0,1,0);ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new D,vi=new D,ko=new D,xi=new D,Ts=new D,Es=new D,xh=new D,Bo=new D,Ho=new D,Vo=new D,Go=new Me,Wo=new Me,Xo=new Me;class Pn{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),kn.subVectors(t,e),s.cross(kn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){kn.subVectors(s,e),vi.subVectors(n,e),ko.subVectors(t,e);const a=kn.dot(kn),o=kn.dot(vi),l=kn.dot(ko),c=vi.dot(vi),h=vi.dot(ko),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const p=1/f,u=(c*l-o*h)*p,m=(a*h-o*l)*p;return r.set(1-u-m,m,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,xi)===null?!1:xi.x>=0&&xi.y>=0&&xi.x+xi.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,xi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,xi.x),l.addScaledVector(a,xi.y),l.addScaledVector(o,xi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Go.setScalar(0),Wo.setScalar(0),Xo.setScalar(0),Go.fromBufferAttribute(t,e),Wo.fromBufferAttribute(t,n),Xo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Go,r.x),a.addScaledVector(Wo,r.y),a.addScaledVector(Xo,r.z),a}static isFrontFacing(t,e,n,s){return kn.subVectors(n,e),vi.subVectors(t,e),kn.cross(vi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return kn.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),kn.cross(vi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Pn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Pn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Pn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Pn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Pn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Ts.subVectors(s,n),Es.subVectors(r,n),Bo.subVectors(t,n);const l=Ts.dot(Bo),c=Es.dot(Bo);if(l<=0&&c<=0)return e.copy(n);Ho.subVectors(t,s);const h=Ts.dot(Ho),f=Es.dot(Ho);if(h>=0&&f<=h)return e.copy(s);const p=l*f-h*c;if(p<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ts,a);Vo.subVectors(t,r);const u=Ts.dot(Vo),m=Es.dot(Vo);if(m>=0&&u<=m)return e.copy(r);const v=u*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(Es,o);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return xh.subVectors(r,s),o=(f-h)/(f-h+(u-m)),e.copy(s).addScaledVector(xh,o);const d=1/(g+v+p);return a=v*d,o=p*d,e.copy(n).addScaledVector(Ts,a).addScaledVector(Es,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const gf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},oa={h:0,s:0,l:0};function qo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=Nc(t,1),e=ae(e,0,1),n=ae(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=qo(a,r,t+1/3),this.g=qo(a,r,t),this.b=qo(a,r,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const n=gf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ai(t.r),this.g=Ai(t.g),this.b=Ai(t.b),this}copyLinearToSRGB(t){return this.r=Ws(t.r),this.g=Ws(t.g),this.b=Ws(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return de.workingToColorSpace(Ke.copy(this),t),Math.round(ae(Ke.r*255,0,255))*65536+Math.round(ae(Ke.g*255,0,255))*256+Math.round(ae(Ke.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(Ke.copy(this),e);const n=Ke.r,s=Ke.g,r=Ke.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(Ke.copy(this),e),t.r=Ke.r,t.g=Ke.g,t.b=Ke.b,t}getStyle(t=qe){de.workingToColorSpace(Ke.copy(this),t);const e=Ke.r,n=Ke.g,s=Ke.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ui),this.setHSL(Ui.h+t,Ui.s+e,Ui.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ui),t.getHSL(oa);const n=Pr(Ui.h,oa.h,e),s=Pr(Ui.s,oa.s,e),r=Pr(Ui.l,oa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ke=new Yt;Yt.NAMES=gf;let A0=0;class Ri extends ir{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=ii(),this.name="",this.type="Material",this.blending=Gs,this.side=Hi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vl,this.blendDst=xl,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=vs,this.stencilZFail=vs,this.stencilZPass=vs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Gs&&(n.blending=this.blending),this.side!==Hi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==vl&&(n.blendSrc=this.blendSrc),this.blendDst!==xl&&(n.blendDst=this.blendDst),this.blendEquation!==Ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==vs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==vs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==vs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ye extends Ri{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=Ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Fe=new D,la=new ut;let R0=0;class Be{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:R0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ic,this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)la.fromBufferAttribute(this,e),la.applyMatrix3(t),this.setXY(e,la.x,la.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Gn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Gn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Gn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Gn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ic&&(t.usage=this.usage),t}}class vf extends Be{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class xf extends Be{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends Be{constructor(t,e,n){super(new Float32Array(t),e,n)}}let C0=0;const En=new ce,Yo=new ke,As=new D,gn=new qn,dr=new qn,Ge=new D;class Le extends ir{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:C0++}),this.uuid=ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(pf(t)?xf:vf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ie().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return En.makeRotationFromQuaternion(t),this.applyMatrix4(En),this}rotateX(t){return En.makeRotationX(t),this.applyMatrix4(En),this}rotateY(t){return En.makeRotationY(t),this.applyMatrix4(En),this}rotateZ(t){return En.makeRotationZ(t),this.applyMatrix4(En),this}translate(t,e,n){return En.makeTranslation(t,e,n),this.applyMatrix4(En),this}scale(t,e,n){return En.makeScale(t,e,n),this.applyMatrix4(En),this}lookAt(t){return Yo.lookAt(t),Yo.updateMatrix(),this.applyMatrix4(Yo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(As).negate(),this.translate(As.x,As.y,As.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];gn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ms);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(gn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];dr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(gn.min,dr.min),gn.expandByPoint(Ge),Ge.addVectors(gn.max,dr.max),gn.expandByPoint(Ge)):(gn.expandByPoint(dr.min),gn.expandByPoint(dr.max))}gn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ge.fromBufferAttribute(o,c),l&&(As.fromBufferAttribute(t,c),Ge.add(As)),s=Math.max(s,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let T=0;T<n.count;T++)o[T]=new D,l[T]=new D;const c=new D,h=new D,f=new D,p=new ut,u=new ut,m=new ut,v=new D,g=new D;function d(T,S,M){c.fromBufferAttribute(n,T),h.fromBufferAttribute(n,S),f.fromBufferAttribute(n,M),p.fromBufferAttribute(r,T),u.fromBufferAttribute(r,S),m.fromBufferAttribute(r,M),h.sub(c),f.sub(c),u.sub(p),m.sub(p);const R=1/(u.x*m.y-m.x*u.y);isFinite(R)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(R),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(R),o[T].add(v),o[S].add(v),o[M].add(v),l[T].add(g),l[S].add(g),l[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,S=x.length;T<S;++T){const M=x[T],R=M.start,L=M.count;for(let P=R,F=R+L;P<F;P+=3)d(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const y=new D,_=new D,E=new D,b=new D;function A(T){E.fromBufferAttribute(s,T),b.copy(E);const S=o[T];y.copy(S),y.sub(E.multiplyScalar(E.dot(S))).normalize(),_.crossVectors(b,S);const R=_.dot(l[T])<0?-1:1;a.setXYZW(T,y.x,y.y,y.z,R)}for(let T=0,S=x.length;T<S;++T){const M=x[T],R=M.start,L=M.count;for(let P=R,F=R+L;P<F;P+=3)A(t.getX(P+0)),A(t.getX(P+1)),A(t.getX(P+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Be(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,u=n.count;p<u;p++)n.setXYZ(p,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,f=new D;if(t)for(let p=0,u=t.count;p<u;p+=3){const m=t.getX(p+0),v=t.getX(p+1),g=t.getX(p+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let p=0,u=e.count;p<u;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),a.fromBufferAttribute(e,p+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,p=new c.constructor(l.length*h);let u=0,m=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?u=l[v]*o.data.stride+o.offset:u=l[v]*h;for(let d=0;d<h;d++)p[m++]=c[u++]}return new Be(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const p=c[h],u=t(p,n);l.push(u)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,p=c.length;f<p;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let p=0,u=f.length;p<u;p++)h.push(f[p].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _h=new ce,Zi=new Oc,ca=new ms,yh=new D,ha=new D,ua=new D,fa=new D,$o=new D,da=new D,Mh=new D,pa=new D;class qt extends ke{constructor(t=new Le,e=new Ye){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){da.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&($o.fromBufferAttribute(f,t),a?da.addScaledVector($o,h):da.addScaledVector($o.sub(e),h))}e.add(da)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(r),Zi.copy(t.ray).recast(t.near),!(ca.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(ca,yh)===null||Zi.origin.distanceToSquared(yh)>(t.far-t.near)**2))&&(_h.copy(r).invert(),Zi.copy(t.ray).applyMatrix4(_h),!(n.boundingBox!==null&&Zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,p=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=p.length;m<v;m++){const g=p[m],d=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let _=x,E=y;_<E;_+=3){const b=o.getX(_),A=o.getX(_+1),T=o.getX(_+2);s=ma(this,d,t,n,c,h,f,b,A,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let g=m,d=v;g<d;g+=3){const x=o.getX(g),y=o.getX(g+1),_=o.getX(g+2);s=ma(this,a,t,n,c,h,f,x,y,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=p.length;m<v;m++){const g=p[m],d=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let _=x,E=y;_<E;_+=3){const b=_,A=_+1,T=_+2;s=ma(this,d,t,n,c,h,f,b,A,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=m,d=v;g<d;g+=3){const x=g,y=g+1,_=g+2;s=ma(this,a,t,n,c,h,f,x,y,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function P0(i,t,e,n,s,r,a,o){let l;if(t.side===en?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Hi,o),l===null)return null;pa.copy(o),pa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(pa);return c<e.near||c>e.far?null:{distance:c,point:pa.clone(),object:i}}function ma(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,ha),i.getVertexPosition(l,ua),i.getVertexPosition(c,fa);const h=P0(i,t,e,n,ha,ua,fa,Mh);if(h){const f=new D;Pn.getBarycoord(Mh,ha,ua,fa,f),s&&(h.uv=Pn.getInterpolatedAttribute(s,o,l,c,f,new ut)),r&&(h.uv1=Pn.getInterpolatedAttribute(r,o,l,c,f,new ut)),a&&(h.normal=Pn.getInterpolatedAttribute(a,o,l,c,f,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:l,c,normal:new D,materialIndex:0};Pn.getNormal(ha,ua,fa,p.normal),h.face=p,h.barycoord=f}return h}class $n extends Le{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let p=0,u=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2));function m(v,g,d,x,y,_,E,b,A,T,S){const M=_/A,R=E/T,L=_/2,P=E/2,F=b/2,O=A+1,z=T+1;let X=0,H=0;const q=new D;for(let Q=0;Q<z;Q++){const at=Q*R-P;for(let Tt=0;Tt<O;Tt++){const It=Tt*M-L;q[v]=It*x,q[g]=at*y,q[d]=F,c.push(q.x,q.y,q.z),q[v]=0,q[g]=0,q[d]=b>0?1:-1,h.push(q.x,q.y,q.z),f.push(Tt/A),f.push(1-Q/T),X+=1}}for(let Q=0;Q<T;Q++)for(let at=0;at<A;at++){const Tt=p+at+O*Q,It=p+at+O*(Q+1),Ct=p+(at+1)+O*(Q+1),Gt=p+(at+1)+O*Q;l.push(Tt,It,Gt),l.push(It,Ct,Gt),H+=6}o.addGroup(u,H,S),u+=H,p+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function js(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function rn(i){const t={};for(let e=0;e<i.length;e++){const n=js(i[e]);for(const s in n)t[s]=n[s]}return t}function I0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function _f(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const ls={clone:js,merge:rn};var L0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,D0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class on extends Ri{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=L0,this.fragmentShader=D0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=js(t.uniforms),this.uniformsGroups=I0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class yf extends ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ni=new D,Sh=new ut,bh=new ut;class tn extends yf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=zr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Cr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zr*2*Math.atan(Math.tan(Cr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ni.x,Ni.y).multiplyScalar(-t/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-t/Ni.z)}getViewSize(t,e){return this.getViewBounds(t,Sh,bh),e.subVectors(bh,Sh)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Cr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Rs=-90,Cs=1;class U0 extends ke{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(Rs,Cs,t,e);s.layers=this.layers,this.add(s);const r=new tn(Rs,Cs,t,e);r.layers=this.layers,this.add(r);const a=new tn(Rs,Cs,t,e);a.layers=this.layers,this.add(a);const o=new tn(Rs,Cs,t,e);o.layers=this.layers,this.add(o);const l=new tn(Rs,Cs,t,e);l.layers=this.layers,this.add(l);const c=new tn(Rs,Cs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ka)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,p,u),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Mf extends $e{constructor(t=[],e=Ys,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class N0 extends Sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Mf(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new $n(5,5,5),r=new on({name:"CubemapFromEquirect",uniforms:js(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:an});r.uniforms.tEquirect.value=e;const a=new qt(s,r),o=e.minFilter;return e.minFilter===os&&(e.minFilter=ei),new U0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class ne extends ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const F0={type:"move"};class Zo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),d=this._getHandJoint(c,v);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&p>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&p<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(F0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class kc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Yt(t),this.density=e}clone(){return new kc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class sc extends ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class O0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ic,this.updateRanges=[],this.version=0,this.uuid=ii()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const sn=new D;class ja{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyMatrix4(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyNormalMatrix(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.transformDirection(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Gn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Gn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Gn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Gn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Gn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Be(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ja(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class rc extends Ri{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ps;const pr=new D,Is=new D,Ls=new D,Ds=new ut,mr=new ut,Sf=new ce,ga=new D,gr=new D,va=new D,wh=new ut,Jo=new ut,Th=new ut;class Eh extends ke{constructor(t=new rc){if(super(),this.isSprite=!0,this.type="Sprite",Ps===void 0){Ps=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new O0(e,5);Ps.setIndex([0,1,2,0,2,3]),Ps.setAttribute("position",new ja(n,3,0,!1)),Ps.setAttribute("uv",new ja(n,2,3,!1))}this.geometry=Ps,this.material=t,this.center=new ut(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Is.setFromMatrixScale(this.matrixWorld),Sf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ls.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Is.multiplyScalar(-Ls.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;xa(ga.set(-.5,-.5,0),Ls,a,Is,s,r),xa(gr.set(.5,-.5,0),Ls,a,Is,s,r),xa(va.set(.5,.5,0),Ls,a,Is,s,r),wh.set(0,0),Jo.set(1,0),Th.set(1,1);let o=t.ray.intersectTriangle(ga,gr,va,!1,pr);if(o===null&&(xa(gr.set(-.5,.5,0),Ls,a,Is,s,r),Jo.set(0,1),o=t.ray.intersectTriangle(ga,va,gr,!1,pr),o===null))return;const l=t.ray.origin.distanceTo(pr);l<t.near||l>t.far||e.push({distance:l,point:pr.clone(),uv:Pn.getInterpolation(pr,ga,gr,va,wh,Jo,Th,new ut),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function xa(i,t,e,n,s,r){Ds.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(mr.x=r*Ds.x-s*Ds.y,mr.y=s*Ds.x+r*Ds.y):mr.copy(Ds),i.copy(t),i.x+=mr.x,i.y+=mr.y,i.applyMatrix4(Sf)}class bf extends $e{constructor(t=null,e=1,n=1,s,r,a,o,l,c=ln,h=ln,f,p){super(null,a,o,l,c,h,s,r,f,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ah extends Be{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Us=new ce,Rh=new ce,_a=[],Ch=new qn,z0=new ce,vr=new qt,xr=new ms;class k0 extends qt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ah(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,z0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new qn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Us),Ch.copy(t.boundingBox).applyMatrix4(Us),this.boundingBox.union(Ch)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ms),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Us),xr.copy(t.boundingSphere).applyMatrix4(Us),this.boundingSphere.union(xr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(vr.geometry=this.geometry,vr.material=this.material,vr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xr.copy(this.boundingSphere),xr.applyMatrix4(n),t.ray.intersectsSphere(xr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Us),Rh.multiplyMatrices(n,Us),vr.matrixWorld=Rh,vr.raycast(t,_a);for(let a=0,o=_a.length;a<o;a++){const l=_a[a];l.instanceId=r,l.object=this,e.push(l)}_a.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ah(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new bf(new Float32Array(s*this.count),s,this.count,po,Wn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ko=new D,B0=new D,H0=new ie;class ts{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ko.subVectors(n,e).cross(B0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ko),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||H0.getNormalMatrix(t),s=this.coplanarPoint(Ko).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ji=new ms,V0=new ut(.5,.5),ya=new D;class Bc{constructor(t=new ts,e=new ts,n=new ts,s=new ts,r=new ts,a=new ts){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ni,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],p=r[6],u=r[7],m=r[8],v=r[9],g=r[10],d=r[11],x=r[12],y=r[13],_=r[14],E=r[15];if(s[0].setComponents(c-a,u-h,d-m,E-x).normalize(),s[1].setComponents(c+a,u+h,d+m,E+x).normalize(),s[2].setComponents(c+o,u+f,d+v,E+y).normalize(),s[3].setComponents(c-o,u-f,d-v,E-y).normalize(),n)s[4].setComponents(l,p,g,_).normalize(),s[5].setComponents(c-l,u-p,d-g,E-_).normalize();else if(s[4].setComponents(c-l,u-p,d-g,E-_).normalize(),e===ni)s[5].setComponents(c+l,u+p,d+g,E+_).normalize();else if(e===Ka)s[5].setComponents(l,p,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ji.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ji.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ji)}intersectsSprite(t){Ji.center.set(0,0,0);const e=V0.distanceTo(t.center);return Ji.radius=.7071067811865476+e,Ji.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ji)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ya.x=s.normal.x>0?t.max.x:t.min.x,ya.y=s.normal.y>0?t.max.y:t.min.y,ya.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ya)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class wf extends Ri{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ph=new ce,ac=new Oc,Ma=new ms,Sa=new D;class G0 extends ke{constructor(t=new Le,e=new wf){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ma.copy(n.boundingSphere),Ma.applyMatrix4(s),Ma.radius+=r,t.ray.intersectsSphere(Ma)===!1)return;Ph.copy(s).invert(),ac.copy(t.ray).applyMatrix4(Ph);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const p=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let m=p,v=u;m<v;m++){const g=c.getX(m);Sa.fromBufferAttribute(f,g),Ih(Sa,g,l,s,t,e,this)}}else{const p=Math.max(0,a.start),u=Math.min(f.count,a.start+a.count);for(let m=p,v=u;m<v;m++)Sa.fromBufferAttribute(f,m),Ih(Sa,m,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ih(i,t,e,n,s,r,a){const o=ac.distanceSqToPoint(i);if(o<e){const l=new D;ac.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class W0 extends $e{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hc extends $e{constructor(t,e,n=hs,s,r,a,o=ln,l=ln,c,h=Or,f=1){if(h!==Or&&h!==Js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:t,height:e,depth:f};super(p,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Fc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Tf extends $e{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Gi extends Le{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new D,h=new ut;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,p=3;f<=e;f++,p+=3){const u=n+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[p]/t+1)/2,h.y=(a[p+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(o,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Te extends Le{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],p=[],u=[];let m=0;const v=[],g=n/2;let d=0;x(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new oe(f,3)),this.setAttribute("normal",new oe(p,3)),this.setAttribute("uv",new oe(u,2));function x(){const _=new D,E=new D;let b=0;const A=(e-t)/n;for(let T=0;T<=r;T++){const S=[],M=T/r,R=M*(e-t)+t;for(let L=0;L<=s;L++){const P=L/s,F=P*l+o,O=Math.sin(F),z=Math.cos(F);E.x=R*O,E.y=-M*n+g,E.z=R*z,f.push(E.x,E.y,E.z),_.set(O,A,z).normalize(),p.push(_.x,_.y,_.z),u.push(P,1-M),S.push(m++)}v.push(S)}for(let T=0;T<s;T++)for(let S=0;S<r;S++){const M=v[S][T],R=v[S+1][T],L=v[S+1][T+1],P=v[S][T+1];(t>0||S!==0)&&(h.push(M,R,P),b+=3),(e>0||S!==r-1)&&(h.push(R,L,P),b+=3)}c.addGroup(d,b,0),d+=b}function y(_){const E=m,b=new ut,A=new D;let T=0;const S=_===!0?t:e,M=_===!0?1:-1;for(let L=1;L<=s;L++)f.push(0,g*M,0),p.push(0,M,0),u.push(.5,.5),m++;const R=m;for(let L=0;L<=s;L++){const F=L/s*l+o,O=Math.cos(F),z=Math.sin(F);A.x=S*z,A.y=g*M,A.z=S*O,f.push(A.x,A.y,A.z),p.push(0,M,0),b.x=O*.5+.5,b.y=z*.5*M+.5,u.push(b.x,b.y),m++}for(let L=0;L<s;L++){const P=E+L,F=R+L;_===!0?h.push(F,F+1,P):h.push(F+1,F,P),T+=3}c.addGroup(d,T,_===!0?1:2),d+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Te(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Vc extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new oe(r,3)),this.setAttribute("normal",new oe(r.slice(),3)),this.setAttribute("uv",new oe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new D,_=new D,E=new D;for(let b=0;b<e.length;b+=3)u(e[b+0],y),u(e[b+1],_),u(e[b+2],E),l(y,_,E,x)}function l(x,y,_,E){const b=E+1,A=[];for(let T=0;T<=b;T++){A[T]=[];const S=x.clone().lerp(_,T/b),M=y.clone().lerp(_,T/b),R=b-T;for(let L=0;L<=R;L++)L===0&&T===b?A[T][L]=S:A[T][L]=S.clone().lerp(M,L/R)}for(let T=0;T<b;T++)for(let S=0;S<2*(b-T)-1;S++){const M=Math.floor(S/2);S%2===0?(p(A[T][M+1]),p(A[T+1][M]),p(A[T][M])):(p(A[T][M+1]),p(A[T+1][M+1]),p(A[T+1][M]))}}function c(x){const y=new D;for(let _=0;_<r.length;_+=3)y.x=r[_+0],y.y=r[_+1],y.z=r[_+2],y.normalize().multiplyScalar(x),r[_+0]=y.x,r[_+1]=y.y,r[_+2]=y.z}function h(){const x=new D;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const _=g(x)/2/Math.PI+.5,E=d(x)/Math.PI+.5;a.push(_,1-E)}m(),f()}function f(){for(let x=0;x<a.length;x+=6){const y=a[x+0],_=a[x+2],E=a[x+4],b=Math.max(y,_,E),A=Math.min(y,_,E);b>.9&&A<.1&&(y<.2&&(a[x+0]+=1),_<.2&&(a[x+2]+=1),E<.2&&(a[x+4]+=1))}}function p(x){r.push(x.x,x.y,x.z)}function u(x,y){const _=x*3;y.x=t[_+0],y.y=t[_+1],y.z=t[_+2]}function m(){const x=new D,y=new D,_=new D,E=new D,b=new ut,A=new ut,T=new ut;for(let S=0,M=0;S<r.length;S+=9,M+=6){x.set(r[S+0],r[S+1],r[S+2]),y.set(r[S+3],r[S+4],r[S+5]),_.set(r[S+6],r[S+7],r[S+8]),b.set(a[M+0],a[M+1]),A.set(a[M+2],a[M+3]),T.set(a[M+4],a[M+5]),E.copy(x).add(y).add(_).divideScalar(3);const R=g(E);v(b,M+0,x,R),v(A,M+2,y,R),v(T,M+4,_,R)}}function v(x,y,_,E){E<0&&x.x===1&&(a[y]=x.x-1),_.x===0&&_.z===0&&(a[y]=E/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vc(t.vertices,t.indices,t.radius,t.details)}}class hi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],p=n[s+1]-h,u=(a-h)/p;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ut:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new D,s=[],r=[],a=[],o=new D,l=new ce;for(let u=0;u<=t;u++){const m=u/t;s[u]=this.getTangentAt(m,new D)}r[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),p<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(ae(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(l.makeRotationAxis(o,m))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(ae(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],u*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Hr extends hi{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ut){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=l-this.aX,u=c-this.aY;l=p*h-u*f+this.aX,c=p*f+u*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class X0 extends Hr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Gc(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let p=(a-r)/c-(o-r)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+f)+(l-o)/f;p*=h,u*=h,s(a,o,p,u)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const ba=new D,jo=new Gc,Qo=new Gc,tl=new Gc;class us extends hi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(ba.subVectors(s[0],s[1]).add(s[0]),c=ba);const f=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(ba.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ba),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),v=Math.pow(f.distanceToSquared(p),u),g=Math.pow(p.distanceToSquared(h),u);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),jo.initNonuniformCatmullRom(c.x,f.x,p.x,h.x,m,v,g),Qo.initNonuniformCatmullRom(c.y,f.y,p.y,h.y,m,v,g),tl.initNonuniformCatmullRom(c.z,f.z,p.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(jo.initCatmullRom(c.x,f.x,p.x,h.x,this.tension),Qo.initCatmullRom(c.y,f.y,p.y,h.y,this.tension),tl.initCatmullRom(c.z,f.z,p.z,h.z,this.tension));return n.set(jo.calc(l),Qo.calc(l),tl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Lh(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function q0(i,t){const e=1-i;return e*e*t}function Y0(i,t){return 2*(1-i)*i*t}function $0(i,t){return i*i*t}function Ir(i,t,e,n){return q0(i,t)+Y0(i,e)+$0(i,n)}function Z0(i,t){const e=1-i;return e*e*e*t}function J0(i,t){const e=1-i;return 3*e*e*i*t}function K0(i,t){return 3*(1-i)*i*i*t}function j0(i,t){return i*i*i*t}function Lr(i,t,e,n,s){return Z0(i,t)+J0(i,e)+K0(i,n)+j0(i,s)}class Ef extends hi{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Lr(t,s.x,r.x,a.x,o.x),Lr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Q0 extends hi{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Lr(t,s.x,r.x,a.x,o.x),Lr(t,s.y,r.y,a.y,o.y),Lr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Af extends hi{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class oc extends hi{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rf extends hi{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ir(t,s.x,r.x,a.x),Ir(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Cf extends hi{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ir(t,s.x,r.x,a.x),Ir(t,s.y,r.y,a.y),Ir(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pf extends hi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Lh(o,l.x,c.x,h.x,f.x),Lh(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var Qa=Object.freeze({__proto__:null,ArcCurve:X0,CatmullRomCurve3:us,CubicBezierCurve:Ef,CubicBezierCurve3:Q0,EllipseCurve:Hr,LineCurve:Af,LineCurve3:oc,QuadraticBezierCurve:Rf,QuadraticBezierCurve3:Cf,SplineCurve:Pf});class tp extends hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Qa[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Qa[s.type]().fromJSON(s))}return this}}class to extends tp{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Af(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Rf(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Ef(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Pf(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Hr(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ci extends to{constructor(t){super(t),this.uuid=ii(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new to().fromJSON(s))}return this}}function ep(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=If(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=ap(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,f=-1/0;for(let p=e;p<s;p+=e){const u=i[p],m=i[p+1];u<o&&(o=u),m<l&&(l=m),u>h&&(h=u),m>f&&(f=m)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Vr(r,a,e,o,l,c,0),a}function If(i,t,e,n,s){let r;if(s===vp(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Dh(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Dh(a/n|0,i[a],i[a+1],r);return r&&Qs(r,r.next)&&(Wr(r),r=r.next),r}function fs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Qs(e,e.next)||Pe(e.prev,e,e.next)===0)){if(Wr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Vr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&up(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?ip(i,n,s,r):np(i)){t.push(l.i,i.i,c.i),Wr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=sp(fs(i),t),Vr(i,t,e,n,s,r,2)):a===2&&rp(i,t,e,n,s,r):Vr(fs(i),t,e,n,s,r,1);break}}}function np(i){const t=i.prev,e=i,n=i.next;if(Pe(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),p=Math.max(s,r,a),u=Math.max(o,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=p&&m.y>=f&&m.y<=u&&Sr(s,o,r,l,a,c,m.x,m.y)&&Pe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function ip(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Pe(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,p=a.y,u=Math.min(o,l,c),m=Math.min(h,f,p),v=Math.max(o,l,c),g=Math.max(h,f,p),d=lc(u,m,t,e,n),x=lc(v,g,t,e,n);let y=i.prevZ,_=i.nextZ;for(;y&&y.z>=d&&_&&_.z<=x;){if(y.x>=u&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&Sr(o,h,l,f,c,p,y.x,y.y)&&Pe(y.prev,y,y.next)>=0||(y=y.prevZ,_.x>=u&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Sr(o,h,l,f,c,p,_.x,_.y)&&Pe(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;y&&y.z>=d;){if(y.x>=u&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&Sr(o,h,l,f,c,p,y.x,y.y)&&Pe(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;_&&_.z<=x;){if(_.x>=u&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Sr(o,h,l,f,c,p,_.x,_.y)&&Pe(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function sp(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Qs(n,s)&&Df(n,e,e.next,s)&&Gr(n,s)&&Gr(s,n)&&(t.push(n.i,e.i,s.i),Wr(e),Wr(e.next),e=i=s),e=e.next}while(e!==i);return fs(e)}function rp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&pp(a,o)){let l=Uf(a,o);a=fs(a,a.next),l=fs(l,l.next),Vr(a,t,e,n,s,r,0),Vr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function ap(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=If(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(dp(c))}s.sort(op);for(let r=0;r<s.length;r++)e=lp(s[r],e);return e}function op(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function lp(i,t){const e=cp(i,t);if(!e)return t;const n=Uf(e,i);return fs(n,n.next),fs(e,e.next)}function cp(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(Qs(i,e))return e;do{if(Qs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Lf(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);Gr(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&hp(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function hp(i,t){return Pe(i.prev,i,t.prev)<0&&Pe(t.next,i,i.next)<0}function up(i,t,e,n){let s=i;do s.z===0&&(s.z=lc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,fp(s)}function fp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function lc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function dp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Lf(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Sr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Lf(i,t,e,n,s,r,a,o)}function pp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!mp(i,t)&&(Gr(i,t)&&Gr(t,i)&&gp(i,t)&&(Pe(i.prev,i,t.prev)||Pe(i,t.prev,t))||Qs(i,t)&&Pe(i.prev,i,i.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Qs(i,t){return i.x===t.x&&i.y===t.y}function Df(i,t,e,n){const s=Ta(Pe(i,t,e)),r=Ta(Pe(i,t,n)),a=Ta(Pe(e,n,i)),o=Ta(Pe(e,n,t));return!!(s!==r&&a!==o||s===0&&wa(i,e,t)||r===0&&wa(i,n,t)||a===0&&wa(e,i,n)||o===0&&wa(e,t,n))}function wa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ta(i){return i>0?1:i<0?-1:0}function mp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Df(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Gr(i,t){return Pe(i.prev,i,i.next)<0?Pe(i,t,i.next)>=0&&Pe(i,i.prev,t)>=0:Pe(i,t,i.prev)<0||Pe(i,i.next,t)<0}function gp(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Uf(i,t){const e=cc(i.i,i.x,i.y),n=cc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Dh(i,t,e,n){const s=cc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Wr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function cc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function vp(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class xp{static triangulate(t,e,n=2){return ep(t,e,n)}}class Ei{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ei.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Uh(t),Nh(n,t);let a=t.length;e.forEach(Uh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Nh(n,e[l]);const o=xp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Uh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Nh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class go extends Le{constructor(t=new Ci([new ut(.5,.5),new ut(-.5,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new oe(s,3)),this.setAttribute("uv",new oe(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let p=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:u-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const d=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:_p;let y,_=!1,E,b,A,T;d&&(y=d.getSpacedPoints(h),_=!0,p=!1,E=d.computeFrenetFrames(h,!1),b=new D,A=new D,T=new D),p||(g=0,u=0,m=0,v=0);const S=o.extractPoints(c);let M=S.shape;const R=S.holes;if(!Ei.isClockWise(M)){M=M.reverse();for(let st=0,nt=R.length;st<nt;st++){const it=R[st];Ei.isClockWise(it)&&(R[st]=it.reverse())}}function P(st){const it=10000000000000001e-36;let et=st[0];for(let dt=1;dt<=st.length;dt++){const ct=dt%st.length,_t=st[ct],$t=_t.x-et.x,Zt=_t.y-et.y,I=$t*$t+Zt*Zt,w=Math.max(Math.abs(_t.x),Math.abs(_t.y),Math.abs(et.x),Math.abs(et.y)),G=it*w*w;if(I<=G){st.splice(ct,1),dt--;continue}et=_t}}P(M),R.forEach(P);const F=R.length,O=M;for(let st=0;st<F;st++){const nt=R[st];M=M.concat(nt)}function z(st,nt,it){return nt||console.error("THREE.ExtrudeGeometry: vec does not exist"),st.clone().addScaledVector(nt,it)}const X=M.length;function H(st,nt,it){let et,dt,ct;const _t=st.x-nt.x,$t=st.y-nt.y,Zt=it.x-st.x,I=it.y-st.y,w=_t*_t+$t*$t,G=_t*I-$t*Zt;if(Math.abs(G)>Number.EPSILON){const $=Math.sqrt(w),lt=Math.sqrt(Zt*Zt+I*I),Z=nt.x-$t/$,Lt=nt.y+_t/$,gt=it.x-I/lt,kt=it.y+Zt/lt,yt=((gt-Z)*I-(kt-Lt)*Zt)/(_t*I-$t*Zt);et=Z+_t*yt-st.x,dt=Lt+$t*yt-st.y;const ot=et*et+dt*dt;if(ot<=2)return new ut(et,dt);ct=Math.sqrt(ot/2)}else{let $=!1;_t>Number.EPSILON?Zt>Number.EPSILON&&($=!0):_t<-Number.EPSILON?Zt<-Number.EPSILON&&($=!0):Math.sign($t)===Math.sign(I)&&($=!0),$?(et=-$t,dt=_t,ct=Math.sqrt(w)):(et=_t,dt=$t,ct=Math.sqrt(w/2))}return new ut(et/ct,dt/ct)}const q=[];for(let st=0,nt=O.length,it=nt-1,et=st+1;st<nt;st++,it++,et++)it===nt&&(it=0),et===nt&&(et=0),q[st]=H(O[st],O[it],O[et]);const Q=[];let at,Tt=q.concat();for(let st=0,nt=F;st<nt;st++){const it=R[st];at=[];for(let et=0,dt=it.length,ct=dt-1,_t=et+1;et<dt;et++,ct++,_t++)ct===dt&&(ct=0),_t===dt&&(_t=0),at[et]=H(it[et],it[ct],it[_t]);Q.push(at),Tt=Tt.concat(at)}let It;if(g===0)It=Ei.triangulateShape(O,R);else{const st=[],nt=[];for(let it=0;it<g;it++){const et=it/g,dt=u*Math.cos(et*Math.PI/2),ct=m*Math.sin(et*Math.PI/2)+v;for(let _t=0,$t=O.length;_t<$t;_t++){const Zt=z(O[_t],q[_t],ct);wt(Zt.x,Zt.y,-dt),et===0&&st.push(Zt)}for(let _t=0,$t=F;_t<$t;_t++){const Zt=R[_t];at=Q[_t];const I=[];for(let w=0,G=Zt.length;w<G;w++){const $=z(Zt[w],at[w],ct);wt($.x,$.y,-dt),et===0&&I.push($)}et===0&&nt.push(I)}}It=Ei.triangulateShape(st,nt)}const Ct=It.length,Gt=m+v;for(let st=0;st<X;st++){const nt=p?z(M[st],Tt[st],Gt):M[st];_?(A.copy(E.normals[0]).multiplyScalar(nt.x),b.copy(E.binormals[0]).multiplyScalar(nt.y),T.copy(y[0]).add(A).add(b),wt(T.x,T.y,T.z)):wt(nt.x,nt.y,0)}for(let st=1;st<=h;st++)for(let nt=0;nt<X;nt++){const it=p?z(M[nt],Tt[nt],Gt):M[nt];_?(A.copy(E.normals[st]).multiplyScalar(it.x),b.copy(E.binormals[st]).multiplyScalar(it.y),T.copy(y[st]).add(A).add(b),wt(T.x,T.y,T.z)):wt(it.x,it.y,f/h*st)}for(let st=g-1;st>=0;st--){const nt=st/g,it=u*Math.cos(nt*Math.PI/2),et=m*Math.sin(nt*Math.PI/2)+v;for(let dt=0,ct=O.length;dt<ct;dt++){const _t=z(O[dt],q[dt],et);wt(_t.x,_t.y,f+it)}for(let dt=0,ct=R.length;dt<ct;dt++){const _t=R[dt];at=Q[dt];for(let $t=0,Zt=_t.length;$t<Zt;$t++){const I=z(_t[$t],at[$t],et);_?wt(I.x,I.y+y[h-1].y,y[h-1].x+it):wt(I.x,I.y,f+it)}}}Y(),tt();function Y(){const st=s.length/3;if(p){let nt=0,it=X*nt;for(let et=0;et<Ct;et++){const dt=It[et];bt(dt[2]+it,dt[1]+it,dt[0]+it)}nt=h+g*2,it=X*nt;for(let et=0;et<Ct;et++){const dt=It[et];bt(dt[0]+it,dt[1]+it,dt[2]+it)}}else{for(let nt=0;nt<Ct;nt++){const it=It[nt];bt(it[2],it[1],it[0])}for(let nt=0;nt<Ct;nt++){const it=It[nt];bt(it[0]+X*h,it[1]+X*h,it[2]+X*h)}}n.addGroup(st,s.length/3-st,0)}function tt(){const st=s.length/3;let nt=0;pt(O,nt),nt+=O.length;for(let it=0,et=R.length;it<et;it++){const dt=R[it];pt(dt,nt),nt+=dt.length}n.addGroup(st,s.length/3-st,1)}function pt(st,nt){let it=st.length;for(;--it>=0;){const et=it;let dt=it-1;dt<0&&(dt=st.length-1);for(let ct=0,_t=h+g*2;ct<_t;ct++){const $t=X*ct,Zt=X*(ct+1),I=nt+et+$t,w=nt+dt+$t,G=nt+dt+Zt,$=nt+et+Zt;Xt(I,w,G,$)}}}function wt(st,nt,it){l.push(st),l.push(nt),l.push(it)}function bt(st,nt,it){zt(st),zt(nt),zt(it);const et=s.length/3,dt=x.generateTopUV(n,s,et-3,et-2,et-1);N(dt[0]),N(dt[1]),N(dt[2])}function Xt(st,nt,it,et){zt(st),zt(nt),zt(et),zt(nt),zt(it),zt(et);const dt=s.length/3,ct=x.generateSideWallUV(n,s,dt-6,dt-3,dt-2,dt-1);N(ct[0]),N(ct[1]),N(ct[3]),N(ct[1]),N(ct[2]),N(ct[3])}function zt(st){s.push(l[st*3+0]),s.push(l[st*3+1]),s.push(l[st*3+2])}function N(st){r.push(st.x),r.push(st.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return yp(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Qa[s.type]().fromJSON(s)),new go(n,t.options)}}const _p={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ut(r,a),new ut(o,l),new ut(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],f=t[n*3+2],p=t[s*3],u=t[s*3+1],m=t[s*3+2],v=t[r*3],g=t[r*3+1],d=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ut(a,1-l),new ut(c,1-f),new ut(p,1-m),new ut(v,1-d)]:[new ut(o,1-l),new ut(h,1-f),new ut(u,1-m),new ut(g,1-d)]}};function yp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class vo extends Vc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new vo(t.radius,t.detail)}}class xo extends Le{constructor(t=[new ut(0,-.5),new ut(.5,0),new ut(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ae(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new D,p=new ut,u=new D,m=new D,v=new D;let g=0,d=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:g=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,u.x=d*1,u.y=-g,u.z=d*0,v.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,u.x=d*1,u.y=-g,u.z=d*0,m.copy(u),u.x+=v.x,u.y+=v.y,u.z+=v.z,u.normalize(),l.push(u.x,u.y,u.z),v.copy(m)}for(let x=0;x<=e;x++){const y=n+x*h*s,_=Math.sin(y),E=Math.cos(y);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*_,f.y=t[b].y,f.z=t[b].x*E,a.push(f.x,f.y,f.z),p.x=x/e,p.y=b/(t.length-1),o.push(p.x,p.y);const A=l[3*b+0]*_,T=l[3*b+1],S=l[3*b+0]*E;c.push(A,T,S)}}for(let x=0;x<e;x++)for(let y=0;y<t.length-1;y++){const _=y+x*t.length,E=_,b=_+t.length,A=_+t.length+1,T=_+1;r.push(E,b,T),r.push(A,T,b)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xo(t.points,t.segments,t.phiStart,t.phiLength)}}class he extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,p=e/l,u=[],m=[],v=[],g=[];for(let d=0;d<h;d++){const x=d*p-a;for(let y=0;y<c;y++){const _=y*f-r;m.push(_,-x,0),v.push(0,0,1),g.push(y/o),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const y=x+c*d,_=x+c*(d+1),E=x+1+c*(d+1),b=x+1+c*d;u.push(y,_,b),u.push(_,E,b)}this.setIndex(u),this.setAttribute("position",new oe(m,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new he(t.width,t.height,t.widthSegments,t.heightSegments)}}class _o extends Le{constructor(t=new Ci([new ut(0,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new oe(s,3)),this.setAttribute("normal",new oe(r,3)),this.setAttribute("uv",new oe(a,2));function c(h){const f=s.length/3,p=h.extractPoints(e);let u=p.shape;const m=p.holes;Ei.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,d=m.length;g<d;g++){const x=m[g];Ei.isClockWise(x)===!0&&(m[g]=x.reverse())}const v=Ei.triangulateShape(u,m);for(let g=0,d=m.length;g<d;g++){const x=m[g];u=u.concat(x)}for(let g=0,d=u.length;g<d;g++){const x=u[g];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let g=0,d=v.length;g<d;g++){const x=v[g],y=x[0]+f,_=x[1]+f,E=x[2]+f;n.push(y,_,E),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Mp(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new _o(n,t.curveSegments)}}function Mp(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Ce extends Le{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new D,p=new D,u=[],m=[],v=[],g=[];for(let d=0;d<=n;d++){const x=[],y=d/n;let _=0;d===0&&a===0?_=.5/e:d===n&&l===Math.PI&&(_=-.5/e);for(let E=0;E<=e;E++){const b=E/e;f.x=-t*Math.cos(s+b*r)*Math.sin(a+y*o),f.y=t*Math.cos(a+y*o),f.z=t*Math.sin(s+b*r)*Math.sin(a+y*o),m.push(f.x,f.y,f.z),p.copy(f).normalize(),v.push(p.x,p.y,p.z),g.push(b+_,1-y),x.push(c++)}h.push(x)}for(let d=0;d<n;d++)for(let x=0;x<e;x++){const y=h[d][x+1],_=h[d][x],E=h[d+1][x],b=h[d+1][x+1];(d!==0||a>0)&&u.push(y,_,b),(d!==n-1||l<Math.PI)&&u.push(_,E,b)}this.setIndex(u),this.setAttribute("position",new oe(m,3)),this.setAttribute("normal",new oe(v,3)),this.setAttribute("uv",new oe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class tr extends Le{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new D,f=new D,p=new D;for(let u=0;u<=n;u++)for(let m=0;m<=s;m++){const v=m/s*r,g=u/n*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(v),f.y=(t+e*Math.cos(g))*Math.sin(v),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),p.subVectors(f,h).normalize(),l.push(p.x,p.y,p.z),c.push(m/s),c.push(u/n)}for(let u=1;u<=n;u++)for(let m=1;m<=s;m++){const v=(s+1)*u+m-1,g=(s+1)*(u-1)+m-1,d=(s+1)*(u-1)+m,x=(s+1)*u+m;a.push(v,g,x),a.push(g,d,x)}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class si extends Le{constructor(t=new Cf(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new D,l=new D,c=new ut;let h=new D;const f=[],p=[],u=[],m=[];v(),this.setIndex(m),this.setAttribute("position",new oe(f,3)),this.setAttribute("normal",new oe(p,3)),this.setAttribute("uv",new oe(u,2));function v(){for(let y=0;y<e;y++)g(y);g(r===!1?e:0),x(),d()}function g(y){h=t.getPointAt(y/e,h);const _=a.normals[y],E=a.binormals[y];for(let b=0;b<=s;b++){const A=b/s*Math.PI*2,T=Math.sin(A),S=-Math.cos(A);l.x=S*_.x+T*E.x,l.y=S*_.y+T*E.y,l.z=S*_.z+T*E.z,l.normalize(),p.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,f.push(o.x,o.y,o.z)}}function d(){for(let y=1;y<=e;y++)for(let _=1;_<=s;_++){const E=(s+1)*(y-1)+(_-1),b=(s+1)*y+(_-1),A=(s+1)*y+_,T=(s+1)*(y-1)+_;m.push(E,b,T),m.push(b,A,T)}}function x(){for(let y=0;y<=e;y++)for(let _=0;_<=s;_++)c.x=y/e,c.y=_/s,u.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new si(new Qa[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Sp extends on{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Dt extends Ri{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mo,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Hs extends Dt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ut(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ae(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Yt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Yt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Yt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class bp extends Ri{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mo,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class wp extends Ri{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mo,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=Ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Tp extends Ri{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ep extends Ri{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const el={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Ap{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,p=c.length;f<p;f+=2){const u=c[f],m=c[f+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Rp=new Ap;class Wc{constructor(t){this.manager=t!==void 0?t:Rp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Wc.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ns=new WeakMap;class Cp extends Wc{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=el.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let f=Ns.get(a);f===void 0&&(f=[],Ns.set(a,f)),f.push({onLoad:e,onError:s})}return a}const o=kr("img");function l(){h(),e&&e(this);const f=Ns.get(this)||[];for(let p=0;p<f.length;p++){const u=f[p];u.onLoad&&u.onLoad(this)}Ns.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),el.remove(`image:${t}`);const p=Ns.get(this)||[];for(let u=0;u<p.length;u++){const m=p[u];m.onError&&m.onError(f)}Ns.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),el.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class Nf extends Wc{constructor(t){super(t)}load(t,e,n,s){const r=new $e,a=new Cp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class Xc extends ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Fh extends Xc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const nl=new ce,Oh=new D,zh=new D;class Ff{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.mapType=oi,this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bc,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Oh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Oh),zh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(zh),e.updateMatrixWorld(),nl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nl,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(nl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const kh=new ce,_r=new D,il=new D;class Pp extends Ff{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new Me(2,1,1,1),new Me(0,1,1,1),new Me(3,1,1,1),new Me(1,1,1,1),new Me(3,0,1,1),new Me(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),_r.setFromMatrixPosition(t.matrixWorld),n.position.copy(_r),il.copy(n.position),il.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(il),n.updateMatrixWorld(),s.makeTranslation(-_r.x,-_r.y,-_r.z),kh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kh,n.coordinateSystem,n.reversedDepth)}}class eo extends Xc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Pp}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class qc extends yf{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Ip extends Ff{constructor(){super(new qc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ea extends Xc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.target=new ke,this.shadow=new Ip}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Lp extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Dp{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const Bh=new ce;class Up{constructor(t,e,n=0,s=1/0){this.ray=new Oc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new zc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Bh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bh),this}intersectObject(t,e=!0,n=[]){return hc(t,this,n,e),n.sort(Hh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)hc(t[s],this,n,e);return n.sort(Hh),n}}function Hh(i,t){return i.distance-t.distance}function hc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)hc(r[a],t,e,!0)}}function Vh(i,t,e,n){const s=Np(n);switch(e){case hf:return i*t;case po:return i*t/s.components*s.byteLength;case Lc:return i*t/s.components*s.byteLength;case ff:return i*t*2/s.components*s.byteLength;case Dc:return i*t*2/s.components*s.byteLength;case uf:return i*t*3/s.components*s.byteLength;case Xn:return i*t*4/s.components*s.byteLength;case Uc:return i*t*4/s.components*s.byteLength;case Va:case Ga:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wa:case Xa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Pl:case Ll:return Math.max(i,16)*Math.max(t,8)/4;case Cl:case Il:return Math.max(i,8)*Math.max(t,8)/2;case Dl:case Ul:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Nl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ol:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case zl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case kl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Bl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Hl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Vl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Gl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Wl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ql:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Yl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case $l:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Zl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Jl:case Kl:case jl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ql:case tc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ec:case nc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Np(i){switch(i){case oi:case af:return{byteLength:1,components:1};case Fr:case of:case li:return{byteLength:2,components:1};case Pc:case Ic:return{byteLength:2,components:4};case hs:case Cc:case Wn:return{byteLength:4,components:1};case lf:case cf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ec}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ec);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Of(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Fp(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=i.SHORT;else if(c instanceof Uint32Array)u=i.UNSIGNED_INT;else if(c instanceof Int32Array)u=i.INT;else if(c instanceof Int8Array)u=i.BYTE;else if(c instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let p=0;for(let u=1;u<f.length;u++){const m=f[p],v=f[u];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++p,f[p]=v)}f.length=p+1;for(let u=0,m=f.length;u<m;u++){const v=f[u];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Op=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zp=`#ifdef USE_ALPHAHASH
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
#endif`,kp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gp=`#ifdef USE_AOMAP
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
#endif`,Wp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xp=`#ifdef USE_BATCHING
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
#endif`,qp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jp=`#ifdef USE_IRIDESCENCE
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
#endif`,Kp=`#ifdef USE_BUMPMAP
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
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,em=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,im=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,am=`#define PI 3.141592653589793
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
} // validated`,om=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lm=`vec3 transformedNormal = objectNormal;
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
#endif`,cm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,um=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dm="gl_FragColor = linearToOutputTexel( gl_FragColor );",pm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mm=`#ifdef USE_ENVMAP
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
#endif`,gm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,vm=`#ifdef USE_ENVMAP
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
#endif`,xm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_m=`#ifdef USE_ENVMAP
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
#endif`,ym=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Sm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wm=`#ifdef USE_GRADIENTMAP
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
}`,Tm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Am=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rm=`uniform bool receiveShadow;
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
#endif`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Um=`PhysicalMaterial material;
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
#endif`,Nm=`struct PhysicalMaterial {
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
}`,Fm=`
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
#endif`,Om=`#if defined( RE_IndirectDiffuse )
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
#endif`,zm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,km=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,qm=`#if defined( USE_POINTS_UV )
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
#endif`,Ym=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Km=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jm=`#ifdef USE_MORPHTARGETS
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
#endif`,Qm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,t1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,e1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,n1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,r1=`#ifdef USE_NORMALMAP
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
#endif`,a1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,o1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,l1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,h1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,u1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
#endif`,d1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,p1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,m1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,g1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,v1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,x1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,y1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,M1=`float getShadowMask() {
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
}`,S1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,b1=`#ifdef USE_SKINNING
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
#endif`,w1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,T1=`#ifdef USE_SKINNING
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
#endif`,E1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,R1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,C1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,P1=`#ifdef USE_TRANSMISSION
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
#endif`,I1=`#ifdef USE_TRANSMISSION
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
#endif`,L1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,N1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const F1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,O1=`uniform sampler2D t2D;
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
}`,z1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,k1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,B1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,H1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V1=`#include <common>
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
}`,G1=`#if DEPTH_PACKING == 3200
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
}`,W1=`#define DISTANCE
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
}`,X1=`#define DISTANCE
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
}`,q1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Y1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$1=`uniform float scale;
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
}`,Z1=`uniform vec3 diffuse;
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
}`,J1=`#include <common>
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
}`,K1=`uniform vec3 diffuse;
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
}`,j1=`#define LAMBERT
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
}`,Q1=`#define LAMBERT
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
}`,tg=`#define MATCAP
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
}`,eg=`#define MATCAP
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
}`,ng=`#define NORMAL
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
}`,ig=`#define NORMAL
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
}`,sg=`#define PHONG
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
}`,rg=`#define PHONG
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
}`,ag=`#define STANDARD
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
}`,og=`#define STANDARD
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
}`,lg=`#define TOON
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
}`,cg=`#define TOON
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
}`,hg=`uniform float size;
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
}`,ug=`uniform vec3 diffuse;
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
}`,dg=`uniform vec3 color;
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
}`,pg=`uniform float rotation;
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
}`,mg=`uniform vec3 diffuse;
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
}`,re={alphahash_fragment:Op,alphahash_pars_fragment:zp,alphamap_fragment:kp,alphamap_pars_fragment:Bp,alphatest_fragment:Hp,alphatest_pars_fragment:Vp,aomap_fragment:Gp,aomap_pars_fragment:Wp,batching_pars_vertex:Xp,batching_vertex:qp,begin_vertex:Yp,beginnormal_vertex:$p,bsdfs:Zp,iridescence_fragment:Jp,bumpmap_pars_fragment:Kp,clipping_planes_fragment:jp,clipping_planes_pars_fragment:Qp,clipping_planes_pars_vertex:tm,clipping_planes_vertex:em,color_fragment:nm,color_pars_fragment:im,color_pars_vertex:sm,color_vertex:rm,common:am,cube_uv_reflection_fragment:om,defaultnormal_vertex:lm,displacementmap_pars_vertex:cm,displacementmap_vertex:hm,emissivemap_fragment:um,emissivemap_pars_fragment:fm,colorspace_fragment:dm,colorspace_pars_fragment:pm,envmap_fragment:mm,envmap_common_pars_fragment:gm,envmap_pars_fragment:vm,envmap_pars_vertex:xm,envmap_physical_pars_fragment:Cm,envmap_vertex:_m,fog_vertex:ym,fog_pars_vertex:Mm,fog_fragment:Sm,fog_pars_fragment:bm,gradientmap_pars_fragment:wm,lightmap_pars_fragment:Tm,lights_lambert_fragment:Em,lights_lambert_pars_fragment:Am,lights_pars_begin:Rm,lights_toon_fragment:Pm,lights_toon_pars_fragment:Im,lights_phong_fragment:Lm,lights_phong_pars_fragment:Dm,lights_physical_fragment:Um,lights_physical_pars_fragment:Nm,lights_fragment_begin:Fm,lights_fragment_maps:Om,lights_fragment_end:zm,logdepthbuf_fragment:km,logdepthbuf_pars_fragment:Bm,logdepthbuf_pars_vertex:Hm,logdepthbuf_vertex:Vm,map_fragment:Gm,map_pars_fragment:Wm,map_particle_fragment:Xm,map_particle_pars_fragment:qm,metalnessmap_fragment:Ym,metalnessmap_pars_fragment:$m,morphinstance_vertex:Zm,morphcolor_vertex:Jm,morphnormal_vertex:Km,morphtarget_pars_vertex:jm,morphtarget_vertex:Qm,normal_fragment_begin:t1,normal_fragment_maps:e1,normal_pars_fragment:n1,normal_pars_vertex:i1,normal_vertex:s1,normalmap_pars_fragment:r1,clearcoat_normal_fragment_begin:a1,clearcoat_normal_fragment_maps:o1,clearcoat_pars_fragment:l1,iridescence_pars_fragment:c1,opaque_fragment:h1,packing:u1,premultiplied_alpha_fragment:f1,project_vertex:d1,dithering_fragment:p1,dithering_pars_fragment:m1,roughnessmap_fragment:g1,roughnessmap_pars_fragment:v1,shadowmap_pars_fragment:x1,shadowmap_pars_vertex:_1,shadowmap_vertex:y1,shadowmask_pars_fragment:M1,skinbase_vertex:S1,skinning_pars_vertex:b1,skinning_vertex:w1,skinnormal_vertex:T1,specularmap_fragment:E1,specularmap_pars_fragment:A1,tonemapping_fragment:R1,tonemapping_pars_fragment:C1,transmission_fragment:P1,transmission_pars_fragment:I1,uv_pars_fragment:L1,uv_pars_vertex:D1,uv_vertex:U1,worldpos_vertex:N1,background_vert:F1,background_frag:O1,backgroundCube_vert:z1,backgroundCube_frag:k1,cube_vert:B1,cube_frag:H1,depth_vert:V1,depth_frag:G1,distanceRGBA_vert:W1,distanceRGBA_frag:X1,equirect_vert:q1,equirect_frag:Y1,linedashed_vert:$1,linedashed_frag:Z1,meshbasic_vert:J1,meshbasic_frag:K1,meshlambert_vert:j1,meshlambert_frag:Q1,meshmatcap_vert:tg,meshmatcap_frag:eg,meshnormal_vert:ng,meshnormal_frag:ig,meshphong_vert:sg,meshphong_frag:rg,meshphysical_vert:ag,meshphysical_frag:og,meshtoon_vert:lg,meshtoon_frag:cg,points_vert:hg,points_frag:ug,shadow_vert:fg,shadow_frag:dg,sprite_vert:pg,sprite_frag:mg},Rt={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},envMapRotation:{value:new ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},Kn={basic:{uniforms:rn([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.fog]),vertexShader:re.meshbasic_vert,fragmentShader:re.meshbasic_frag},lambert:{uniforms:rn([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:re.meshlambert_vert,fragmentShader:re.meshlambert_frag},phong:{uniforms:rn([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:re.meshphong_vert,fragmentShader:re.meshphong_frag},standard:{uniforms:rn([Rt.common,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.roughnessmap,Rt.metalnessmap,Rt.fog,Rt.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag},toon:{uniforms:rn([Rt.common,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.gradientmap,Rt.fog,Rt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:re.meshtoon_vert,fragmentShader:re.meshtoon_frag},matcap:{uniforms:rn([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,{matcap:{value:null}}]),vertexShader:re.meshmatcap_vert,fragmentShader:re.meshmatcap_frag},points:{uniforms:rn([Rt.points,Rt.fog]),vertexShader:re.points_vert,fragmentShader:re.points_frag},dashed:{uniforms:rn([Rt.common,Rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:re.linedashed_vert,fragmentShader:re.linedashed_frag},depth:{uniforms:rn([Rt.common,Rt.displacementmap]),vertexShader:re.depth_vert,fragmentShader:re.depth_frag},normal:{uniforms:rn([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,{opacity:{value:1}}]),vertexShader:re.meshnormal_vert,fragmentShader:re.meshnormal_frag},sprite:{uniforms:rn([Rt.sprite,Rt.fog]),vertexShader:re.sprite_vert,fragmentShader:re.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:re.background_vert,fragmentShader:re.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ie}},vertexShader:re.backgroundCube_vert,fragmentShader:re.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:re.cube_vert,fragmentShader:re.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:re.equirect_vert,fragmentShader:re.equirect_frag},distanceRGBA:{uniforms:rn([Rt.common,Rt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:re.distanceRGBA_vert,fragmentShader:re.distanceRGBA_frag},shadow:{uniforms:rn([Rt.lights,Rt.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:re.shadow_vert,fragmentShader:re.shadow_frag}};Kn.physical={uniforms:rn([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag};const Aa={r:0,b:0,g:0},Ki=new Un,gg=new ce;function vg(i,t,e,n,s,r,a){const o=new Yt(0);let l=r===!0?0:1,c,h,f=null,p=0,u=null;function m(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const E=m(y);E===null?d(o,l):E&&E.isColor&&(d(E,1),_=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,_){const E=m(_);E&&(E.isCubeTexture||E.mapping===fo)?(h===void 0&&(h=new qt(new $n(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:js(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ki.copy(_.backgroundRotation),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(gg.makeRotationFromEuler(Ki)),h.material.toneMapped=de.getTransfer(E.colorSpace)!==xe,(f!==E||p!==E.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,f=E,p=E.version,u=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new qt(new he(2,2),new on({name:"BackgroundMaterial",uniforms:js(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:Hi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=de.getTransfer(E.colorSpace)!==xe,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,f=E,p=E.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function d(y,_){y.getRGB(Aa,_f(i)),n.buffers.color.setClear(Aa.r,Aa.g,Aa.b,_,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,_=1){o.set(y),l=_,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,d(o,l)},render:v,addToRenderList:g,dispose:x}}function xg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(M,R,L,P,F){let O=!1;const z=f(P,L,R);r!==z&&(r=z,c(r.object)),O=u(M,P,L,F),O&&m(M,P,L,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,_(M,R,L,P),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function f(M,R,L){const P=L.wireframe===!0;let F=n[M.id];F===void 0&&(F={},n[M.id]=F);let O=F[R.id];O===void 0&&(O={},F[R.id]=O);let z=O[P];return z===void 0&&(z=p(l()),O[P]=z),z}function p(M){const R=[],L=[],P=[];for(let F=0;F<e;F++)R[F]=0,L[F]=0,P[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:L,attributeDivisors:P,object:M,attributes:{},index:null}}function u(M,R,L,P){const F=r.attributes,O=R.attributes;let z=0;const X=L.getAttributes();for(const H in X)if(X[H].location>=0){const Q=F[H];let at=O[H];if(at===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(at=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(at=M.instanceColor)),Q===void 0||Q.attribute!==at||at&&Q.data!==at.data)return!0;z++}return r.attributesNum!==z||r.index!==P}function m(M,R,L,P){const F={},O=R.attributes;let z=0;const X=L.getAttributes();for(const H in X)if(X[H].location>=0){let Q=O[H];Q===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const at={};at.attribute=Q,Q&&Q.data&&(at.data=Q.data),F[H]=at,z++}r.attributes=F,r.attributesNum=z,r.index=P}function v(){const M=r.newAttributes;for(let R=0,L=M.length;R<L;R++)M[R]=0}function g(M){d(M,0)}function d(M,R){const L=r.newAttributes,P=r.enabledAttributes,F=r.attributeDivisors;L[M]=1,P[M]===0&&(i.enableVertexAttribArray(M),P[M]=1),F[M]!==R&&(i.vertexAttribDivisor(M,R),F[M]=R)}function x(){const M=r.newAttributes,R=r.enabledAttributes;for(let L=0,P=R.length;L<P;L++)R[L]!==M[L]&&(i.disableVertexAttribArray(L),R[L]=0)}function y(M,R,L,P,F,O,z){z===!0?i.vertexAttribIPointer(M,R,L,F,O):i.vertexAttribPointer(M,R,L,P,F,O)}function _(M,R,L,P){v();const F=P.attributes,O=L.getAttributes(),z=R.defaultAttributeValues;for(const X in O){const H=O[X];if(H.location>=0){let q=F[X];if(q===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(q=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(q=M.instanceColor)),q!==void 0){const Q=q.normalized,at=q.itemSize,Tt=t.get(q);if(Tt===void 0)continue;const It=Tt.buffer,Ct=Tt.type,Gt=Tt.bytesPerElement,Y=Ct===i.INT||Ct===i.UNSIGNED_INT||q.gpuType===Cc;if(q.isInterleavedBufferAttribute){const tt=q.data,pt=tt.stride,wt=q.offset;if(tt.isInstancedInterleavedBuffer){for(let bt=0;bt<H.locationSize;bt++)d(H.location+bt,tt.meshPerAttribute);M.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let bt=0;bt<H.locationSize;bt++)g(H.location+bt);i.bindBuffer(i.ARRAY_BUFFER,It);for(let bt=0;bt<H.locationSize;bt++)y(H.location+bt,at/H.locationSize,Ct,Q,pt*Gt,(wt+at/H.locationSize*bt)*Gt,Y)}else{if(q.isInstancedBufferAttribute){for(let tt=0;tt<H.locationSize;tt++)d(H.location+tt,q.meshPerAttribute);M.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let tt=0;tt<H.locationSize;tt++)g(H.location+tt);i.bindBuffer(i.ARRAY_BUFFER,It);for(let tt=0;tt<H.locationSize;tt++)y(H.location+tt,at/H.locationSize,Ct,Q,at*Gt,at/H.locationSize*tt*Gt,Y)}}else if(z!==void 0){const Q=z[X];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(H.location,Q);break;case 3:i.vertexAttrib3fv(H.location,Q);break;case 4:i.vertexAttrib4fv(H.location,Q);break;default:i.vertexAttrib1fv(H.location,Q)}}}}x()}function E(){T();for(const M in n){const R=n[M];for(const L in R){const P=R[L];for(const F in P)h(P[F].object),delete P[F];delete R[L]}delete n[M]}}function b(M){if(n[M.id]===void 0)return;const R=n[M.id];for(const L in R){const P=R[L];for(const F in P)h(P[F].object),delete P[F];delete R[L]}delete n[M.id]}function A(M){for(const R in n){const L=n[R];if(L[M.id]===void 0)continue;const P=L[M.id];for(const F in P)h(P[F].object),delete P[F];delete L[M.id]}}function T(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:S,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function _g(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,f){f!==0&&(i.drawArraysInstanced(n,c,h,f),e.update(h,n,f))}function o(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,n,1)}function l(c,h,f,p){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)a(c[m],h[m],p[m]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,f);let m=0;for(let v=0;v<f;v++)m+=h[v]*p[v];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function yg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Xn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===li&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==oi&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Wn&&!T)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,p=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:u,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:_,vertexTextures:E,maxSamples:b}}function Mg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new ts,o=new ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const u=f.length!==0||p||n!==0||s;return s=p,n=f.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,u){const m=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,d=i.get(f);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const x=r?0:n,y=x*4;let _=d.clippingState||null;l.value=_,_=h(m,p,y,u);for(let E=0;E!==y;++E)_[E]=e[E];d.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,u,m){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const d=u+v*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<d)&&(g=new Float32Array(d));for(let y=0,_=u;y!==v;++y,_+=4)a.copy(f[y]).applyMatrix4(x,o),a.normal.toArray(g,_),g[_+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Sg(i){let t=new WeakMap;function e(a,o){return o===El?a.mapping=Ys:o===Al&&(a.mapping=$s),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===El||o===Al)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new N0(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Vs=4,Gh=[.125,.215,.35,.446,.526,.582],ss=20,sl=new qc,Wh=new Yt;let rl=null,al=0,ol=0,ll=!1;const es=(1+Math.sqrt(5))/2,Fs=1/es,Xh=[new D(-es,Fs,0),new D(es,Fs,0),new D(-Fs,0,es),new D(Fs,0,es),new D(0,es,-Fs),new D(0,es,Fs),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],bg=new D;class uc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=bg}=r;rl=this._renderer.getRenderTarget(),al=this._renderer.getActiveCubeFace(),ol=this._renderer.getActiveMipmapLevel(),ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$h(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(rl,al,ol),this._renderer.xr.enabled=ll,t.scissorTest=!1,Ra(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ys||t.mapping===$s?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),rl=this._renderer.getRenderTarget(),al=this._renderer.getActiveCubeFace(),ol=this._renderer.getActiveMipmapLevel(),ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:li,format:Xn,colorSpace:Ks,depthBuffer:!1},s=qh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=wg(r)),this._blurMaterial=Tg(r,t,e)}return s}_compileMaterial(t){const e=new qt(this._lodPlanes[0],t);this._renderer.compile(e,sl)}_sceneToCubeUV(t,e,n,s,r){const l=new tn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,u=f.toneMapping;f.getClearColor(Wh),f.toneMapping=ki,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));const v=new Ye({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new qt(new $n,v);let d=!1;const x=t.background;x?x.isColor&&(v.color.copy(x),t.background=null,d=!0):(v.color.copy(Wh),d=!0);for(let y=0;y<6;y++){const _=y%3;_===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):_===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const E=this._cubeSize;Ra(s,_*E,y>2?E:0,E,E),f.setRenderTarget(s),d&&f.render(g,l),f.render(t,l)}g.geometry.dispose(),g.material.dispose(),f.toneMapping=u,f.autoClear=p,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ys||t.mapping===$s;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$h()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new qt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ra(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,sl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Xh[(s-r-1)%Xh.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new qt(this._lodPlanes[s],c),p=c.uniforms,u=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*ss-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):ss;g>ss&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ss}`);const d=[];let x=0;for(let A=0;A<ss;++A){const T=A/v,S=Math.exp(-T*T/2);d.push(S),A===0?x+=S:A<g&&(x+=2*S)}for(let A=0;A<d.length;A++)d[A]=d[A]/x;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:y}=this;p.dTheta.value=m,p.mipInt.value=y-n;const _=this._sizeLods[s],E=3*_*(s>y-Vs?s-y+Vs:0),b=4*(this._cubeSize-_);Ra(e,E,b,3*_,2*_),l.setRenderTarget(e),l.render(f,sl)}}function wg(i){const t=[],e=[],n=[];let s=i;const r=i-Vs+1+Gh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Vs?l=Gh[a-i+Vs-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,f=1+c,p=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,v=3,g=2,d=1,x=new Float32Array(v*m*u),y=new Float32Array(g*m*u),_=new Float32Array(d*m*u);for(let b=0;b<u;b++){const A=b%3*2/3-1,T=b>2?0:-1,S=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(S,v*m*b),y.set(p,g*m*b);const M=[b,b,b,b,b,b];_.set(M,d*m*b)}const E=new Le;E.setAttribute("position",new Be(x,v)),E.setAttribute("uv",new Be(y,g)),E.setAttribute("faceIndex",new Be(_,d)),t.push(E),s>Vs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function qh(i,t,e){const n=new Sn(i,t,e);return n.texture.mapping=fo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ra(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Tg(i,t,e){const n=new Float32Array(ss),s=new D(0,1,0);return new on({name:"SphericalGaussianBlur",defines:{n:ss,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Yc(),fragmentShader:`

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
		`,blending:an,depthTest:!1,depthWrite:!1})}function Yh(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yc(),fragmentShader:`

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
		`,blending:an,depthTest:!1,depthWrite:!1})}function $h(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:an,depthTest:!1,depthWrite:!1})}function Yc(){return`

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
	`}function Eg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===El||l===Al,h=l===Ys||l===$s;if(c||h){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new uc(i)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new uc(i)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Ag(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Br("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Rg(i,t,e,n){const s={},r=new WeakMap;function a(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const m in p.attributes)t.remove(p.attributes[m]);p.removeEventListener("dispose",a),delete s[p.id];const u=r.get(p);u&&(t.remove(u),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,e.memory.geometries++),p}function l(f){const p=f.attributes;for(const u in p)t.update(p[u],i.ARRAY_BUFFER)}function c(f){const p=[],u=f.index,m=f.attributes.position;let v=0;if(u!==null){const x=u.array;v=u.version;for(let y=0,_=x.length;y<_;y+=3){const E=x[y+0],b=x[y+1],A=x[y+2];p.push(E,b,b,A,A,E)}}else if(m!==void 0){const x=m.array;v=m.version;for(let y=0,_=x.length/3-1;y<_;y+=3){const E=y+0,b=y+1,A=y+2;p.push(E,b,b,A,A,E)}}else return;const g=new(pf(p)?xf:vf)(p,1);g.version=v;const d=r.get(f);d&&t.remove(d),r.set(f,g)}function h(f){const p=r.get(f);if(p){const u=f.index;u!==null&&p.version<u.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function Cg(i,t,e){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,u){i.drawElements(n,u,r,p*a),e.update(u,n,1)}function c(p,u,m){m!==0&&(i.drawElementsInstanced(n,u,r,p*a,m),e.update(u,n,m))}function h(p,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,p,0,m);let g=0;for(let d=0;d<m;d++)g+=u[d];e.update(g,n,1)}function f(p,u,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<p.length;d++)c(p[d]/a,u[d],v[d]);else{g.multiDrawElementsInstancedWEBGL(n,u,0,r,p,0,v,0,m);let d=0;for(let x=0;x<m;x++)d+=u[x]*v[x];e.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Pg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Ig(i,t,e){const n=new WeakMap,s=new Me;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let S=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",S)};p!==void 0&&p.texture.dispose();const u=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let y=0;u===!0&&(y=1),m===!0&&(y=2),v===!0&&(y=3);let _=o.attributes.position.count*y,E=1;_>t.maxTextureSize&&(E=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*E*4*f),A=new mf(b,_,E,f);A.type=Wn,A.needsUpdate=!0;const T=y*4;for(let M=0;M<f;M++){const R=g[M],L=d[M],P=x[M],F=_*E*4*M;for(let O=0;O<R.count;O++){const z=O*T;u===!0&&(s.fromBufferAttribute(R,O),b[F+z+0]=s.x,b[F+z+1]=s.y,b[F+z+2]=s.z,b[F+z+3]=0),m===!0&&(s.fromBufferAttribute(L,O),b[F+z+4]=s.x,b[F+z+5]=s.y,b[F+z+6]=s.z,b[F+z+7]=0),v===!0&&(s.fromBufferAttribute(P,O),b[F+z+8]=s.x,b[F+z+9]=s.y,b[F+z+10]=s.z,b[F+z+11]=P.itemSize===4?s.w:1)}}p={count:f,texture:A,size:new ut(_,E)},n.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let u=0;for(let v=0;v<c.length;v++)u+=c[v];const m=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function Lg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const zf=new $e,Zh=new Hc(1,1),kf=new mf,Bf=new _0,Hf=new Mf,Jh=[],Kh=[],jh=new Float32Array(16),Qh=new Float32Array(9),tu=new Float32Array(4);function sr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Jh[s];if(r===void 0&&(r=new Float32Array(s),Jh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function yo(i,t){let e=Kh[t];e===void 0&&(e=new Int32Array(t),Kh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Dg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function Ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function Fg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function Og(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;tu.set(n),i.uniformMatrix2fv(this.addr,!1,tu),Ve(e,n)}}function zg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;Qh.set(n),i.uniformMatrix3fv(this.addr,!1,Qh),Ve(e,n)}}function kg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;jh.set(n),i.uniformMatrix4fv(this.addr,!1,jh),Ve(e,n)}}function Bg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function Vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function Wg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function Yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function $g(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Zh.compareFunction=df,r=Zh):r=zf,e.setTexture2D(t||r,s)}function Zg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Bf,s)}function Jg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Hf,s)}function Kg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||kf,s)}function jg(i){switch(i){case 5126:return Dg;case 35664:return Ug;case 35665:return Ng;case 35666:return Fg;case 35674:return Og;case 35675:return zg;case 35676:return kg;case 5124:case 35670:return Bg;case 35667:case 35671:return Hg;case 35668:case 35672:return Vg;case 35669:case 35673:return Gg;case 5125:return Wg;case 36294:return Xg;case 36295:return qg;case 36296:return Yg;case 35678:case 36198:case 36298:case 36306:case 35682:return $g;case 35679:case 36299:case 36307:return Zg;case 35680:case 36300:case 36308:case 36293:return Jg;case 36289:case 36303:case 36311:case 36292:return Kg}}function Qg(i,t){i.uniform1fv(this.addr,t)}function tv(i,t){const e=sr(t,this.size,2);i.uniform2fv(this.addr,e)}function ev(i,t){const e=sr(t,this.size,3);i.uniform3fv(this.addr,e)}function nv(i,t){const e=sr(t,this.size,4);i.uniform4fv(this.addr,e)}function iv(i,t){const e=sr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function sv(i,t){const e=sr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function rv(i,t){const e=sr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function av(i,t){i.uniform1iv(this.addr,t)}function ov(i,t){i.uniform2iv(this.addr,t)}function lv(i,t){i.uniform3iv(this.addr,t)}function cv(i,t){i.uniform4iv(this.addr,t)}function hv(i,t){i.uniform1uiv(this.addr,t)}function uv(i,t){i.uniform2uiv(this.addr,t)}function fv(i,t){i.uniform3uiv(this.addr,t)}function dv(i,t){i.uniform4uiv(this.addr,t)}function pv(i,t,e){const n=this.cache,s=t.length,r=yo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||zf,r[a])}function mv(i,t,e){const n=this.cache,s=t.length,r=yo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Bf,r[a])}function gv(i,t,e){const n=this.cache,s=t.length,r=yo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Hf,r[a])}function vv(i,t,e){const n=this.cache,s=t.length,r=yo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||kf,r[a])}function xv(i){switch(i){case 5126:return Qg;case 35664:return tv;case 35665:return ev;case 35666:return nv;case 35674:return iv;case 35675:return sv;case 35676:return rv;case 5124:case 35670:return av;case 35667:case 35671:return ov;case 35668:case 35672:return lv;case 35669:case 35673:return cv;case 5125:return hv;case 36294:return uv;case 36295:return fv;case 36296:return dv;case 35678:case 36198:case 36298:case 36306:case 35682:return pv;case 35679:case 36299:case 36307:return mv;case 35680:case 36300:case 36308:case 36293:return gv;case 36289:case 36303:case 36311:case 36292:return vv}}class _v{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=jg(e.type)}}class yv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=xv(e.type)}}class Mv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const cl=/(\w+)(\])?(\[|\.)?/g;function eu(i,t){i.seq.push(t),i.map[t.id]=t}function Sv(i,t,e){const n=i.name,s=n.length;for(cl.lastIndex=0;;){const r=cl.exec(n),a=cl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){eu(e,c===void 0?new _v(o,i,t):new yv(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Mv(o),eu(e,f)),e=f}}}class qa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Sv(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function nu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const bv=37297;let wv=0;function Tv(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const iu=new ie;function Ev(i){de._getMatrix(iu,de.workingColorSpace,i);const t=`mat3( ${iu.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(i)){case Ja:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function su(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Tv(i.getShaderSource(t),o)}else return r}function Av(i,t){const e=Ev(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Rv(i,t){let e;switch(t){case ju:e="Linear";break;case Qu:e="Reinhard";break;case tf:e="Cineon";break;case Rc:e="ACESFilmic";break;case nf:e="AgX";break;case sf:e="Neutral";break;case ef:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ca=new D;function Cv(){de.getLuminanceCoefficients(Ca);const i=Ca.x.toFixed(4),t=Ca.y.toFixed(4),e=Ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(br).join(`
`)}function Iv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Lv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function br(i){return i!==""}function ru(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function au(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Dv=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(i){return i.replace(Dv,Nv)}const Uv=new Map;function Nv(i,t){let e=re[t];if(e===void 0){const n=Uv.get(t);if(n!==void 0)e=re[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return fc(e)}const Fv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ou(i){return i.replace(Fv,Ov)}function Ov(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function lu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function zv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Yu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===$u?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mi&&(t="SHADOWMAP_TYPE_VSM"),t}function kv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ys:case $s:t="ENVMAP_TYPE_CUBE";break;case fo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Bv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case $s:t="ENVMAP_MODE_REFRACTION";break}return t}function Hv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ac:t="ENVMAP_BLENDING_MULTIPLY";break;case Od:t="ENVMAP_BLENDING_MIX";break;case zd:t="ENVMAP_BLENDING_ADD";break}return t}function Vv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Gv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=zv(e),c=kv(e),h=Bv(e),f=Hv(e),p=Vv(e),u=Pv(e),m=Iv(r),v=s.createProgram();let g,d,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(br).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(br).join(`
`),d.length>0&&(d+=`
`)):(g=[lu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(br).join(`
`),d=[lu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ki?"#define TONE_MAPPING":"",e.toneMapping!==ki?re.tonemapping_pars_fragment:"",e.toneMapping!==ki?Rv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",re.colorspace_pars_fragment,Av("linearToOutputTexel",e.outputColorSpace),Cv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(br).join(`
`)),a=fc(a),a=ru(a,e),a=au(a,e),o=fc(o),o=ru(o,e),o=au(o,e),a=ou(a),o=ou(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",e.glslVersion===rh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===rh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=x+g+a,_=x+d+o,E=nu(s,s.VERTEX_SHADER,y),b=nu(s,s.FRAGMENT_SHADER,_);s.attachShader(v,E),s.attachShader(v,b),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(R){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(v)||"",P=s.getShaderInfoLog(E)||"",F=s.getShaderInfoLog(b)||"",O=L.trim(),z=P.trim(),X=F.trim();let H=!0,q=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,E,b);else{const Q=su(s,E,"vertex"),at=su(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+O+`
`+Q+`
`+at)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(z===""||X==="")&&(q=!1);q&&(R.diagnostics={runnable:H,programLog:O,vertexShader:{log:z,prefix:g},fragmentShader:{log:X,prefix:d}})}s.deleteShader(E),s.deleteShader(b),T=new qa(s,v),S=Lv(s,v)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,bv)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=wv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=b,this}let Wv=0;class Xv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new qv(t),e.set(t,n)),n}}class qv{constructor(t){this.id=Wv++,this.code=t,this.usedTimes=0}}function Yv(i,t,e,n,s,r,a){const o=new zc,l=new Xv,c=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let u=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return c.add(S),S===0?"uv":`uv${S}`}function g(S,M,R,L,P){const F=L.fog,O=P.geometry,z=S.isMeshStandardMaterial?L.environment:null,X=(S.isMeshStandardMaterial?e:t).get(S.envMap||z),H=X&&X.mapping===fo?X.image.height:null,q=m[S.type];S.precision!==null&&(u=s.getMaxPrecision(S.precision),u!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",u,"instead."));const Q=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,at=Q!==void 0?Q.length:0;let Tt=0;O.morphAttributes.position!==void 0&&(Tt=1),O.morphAttributes.normal!==void 0&&(Tt=2),O.morphAttributes.color!==void 0&&(Tt=3);let It,Ct,Gt,Y;if(q){const fe=Kn[q];It=fe.vertexShader,Ct=fe.fragmentShader}else It=S.vertexShader,Ct=S.fragmentShader,l.update(S),Gt=l.getVertexShaderID(S),Y=l.getFragmentShaderID(S);const tt=i.getRenderTarget(),pt=i.state.buffers.depth.getReversed(),wt=P.isInstancedMesh===!0,bt=P.isBatchedMesh===!0,Xt=!!S.map,zt=!!S.matcap,N=!!X,st=!!S.aoMap,nt=!!S.lightMap,it=!!S.bumpMap,et=!!S.normalMap,dt=!!S.displacementMap,ct=!!S.emissiveMap,_t=!!S.metalnessMap,$t=!!S.roughnessMap,Zt=S.anisotropy>0,I=S.clearcoat>0,w=S.dispersion>0,G=S.iridescence>0,$=S.sheen>0,lt=S.transmission>0,Z=Zt&&!!S.anisotropyMap,Lt=I&&!!S.clearcoatMap,gt=I&&!!S.clearcoatNormalMap,kt=I&&!!S.clearcoatRoughnessMap,yt=G&&!!S.iridescenceMap,ot=G&&!!S.iridescenceThicknessMap,vt=$&&!!S.sheenColorMap,Nt=$&&!!S.sheenRoughnessMap,Et=!!S.specularMap,mt=!!S.specularColorMap,Vt=!!S.specularIntensityMap,k=lt&&!!S.transmissionMap,ft=lt&&!!S.thicknessMap,St=!!S.gradientMap,Ft=!!S.alphaMap,xt=S.alphaTest>0,rt=!!S.alphaHash,Ht=!!S.extensions;let Qt=ki;S.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Qt=i.toneMapping);const ve={shaderID:q,shaderType:S.type,shaderName:S.name,vertexShader:It,fragmentShader:Ct,defines:S.defines,customVertexShaderID:Gt,customFragmentShaderID:Y,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:u,batching:bt,batchingColor:bt&&P._colorsTexture!==null,instancing:wt,instancingColor:wt&&P.instanceColor!==null,instancingMorph:wt&&P.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:tt===null?i.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Ks,alphaToCoverage:!!S.alphaToCoverage,map:Xt,matcap:zt,envMap:N,envMapMode:N&&X.mapping,envMapCubeUVHeight:H,aoMap:st,lightMap:nt,bumpMap:it,normalMap:et,displacementMap:p&&dt,emissiveMap:ct,normalMapObjectSpace:et&&S.normalMapType===Vd,normalMapTangentSpace:et&&S.normalMapType===mo,metalnessMap:_t,roughnessMap:$t,anisotropy:Zt,anisotropyMap:Z,clearcoat:I,clearcoatMap:Lt,clearcoatNormalMap:gt,clearcoatRoughnessMap:kt,dispersion:w,iridescence:G,iridescenceMap:yt,iridescenceThicknessMap:ot,sheen:$,sheenColorMap:vt,sheenRoughnessMap:Nt,specularMap:Et,specularColorMap:mt,specularIntensityMap:Vt,transmission:lt,transmissionMap:k,thicknessMap:ft,gradientMap:St,opaque:S.transparent===!1&&S.blending===Gs&&S.alphaToCoverage===!1,alphaMap:Ft,alphaTest:xt,alphaHash:rt,combine:S.combine,mapUv:Xt&&v(S.map.channel),aoMapUv:st&&v(S.aoMap.channel),lightMapUv:nt&&v(S.lightMap.channel),bumpMapUv:it&&v(S.bumpMap.channel),normalMapUv:et&&v(S.normalMap.channel),displacementMapUv:dt&&v(S.displacementMap.channel),emissiveMapUv:ct&&v(S.emissiveMap.channel),metalnessMapUv:_t&&v(S.metalnessMap.channel),roughnessMapUv:$t&&v(S.roughnessMap.channel),anisotropyMapUv:Z&&v(S.anisotropyMap.channel),clearcoatMapUv:Lt&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:gt&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:vt&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&v(S.sheenRoughnessMap.channel),specularMapUv:Et&&v(S.specularMap.channel),specularColorMapUv:mt&&v(S.specularColorMap.channel),specularIntensityMapUv:Vt&&v(S.specularIntensityMap.channel),transmissionMapUv:k&&v(S.transmissionMap.channel),thicknessMapUv:ft&&v(S.thicknessMap.channel),alphaMapUv:Ft&&v(S.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(et||Zt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!O.attributes.uv&&(Xt||Ft),fog:!!F,useFog:S.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:pt,skinning:P.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:at,morphTextureStride:Tt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Qt,decodeVideoTexture:Xt&&S.map.isVideoTexture===!0&&de.getTransfer(S.map.colorSpace)===xe,decodeVideoTextureEmissive:ct&&S.emissiveMap.isVideoTexture===!0&&de.getTransfer(S.emissiveMap.colorSpace)===xe,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===ze,flipSided:S.side===en,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ht&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&S.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ve.vertexUv1s=c.has(1),ve.vertexUv2s=c.has(2),ve.vertexUv3s=c.has(3),c.clear(),ve}function d(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)M.push(R),M.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(x(M,S),y(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function x(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function y(S,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),S.push(o.mask)}function _(S){const M=m[S.type];let R;if(M){const L=Kn[M];R=ls.clone(L.uniforms)}else R=S.uniforms;return R}function E(S,M){let R;for(let L=0,P=h.length;L<P;L++){const F=h[L];if(F.cacheKey===M){R=F,++R.usedTimes;break}}return R===void 0&&(R=new Gv(i,M,S,r),h.push(R)),R}function b(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:_,acquireProgram:E,releaseProgram:b,releaseShaderCache:A,programs:h,dispose:T}}function $v(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Zv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function cu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function hu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,p,u,m,v,g){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:p,material:u,groupOrder:m,renderOrder:f.renderOrder,z:v,group:g},i[t]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=u,d.groupOrder=m,d.renderOrder=f.renderOrder,d.z=v,d.group=g),t++,d}function o(f,p,u,m,v,g){const d=a(f,p,u,m,v,g);u.transmission>0?n.push(d):u.transparent===!0?s.push(d):e.push(d)}function l(f,p,u,m,v,g){const d=a(f,p,u,m,v,g);u.transmission>0?n.unshift(d):u.transparent===!0?s.unshift(d):e.unshift(d)}function c(f,p){e.length>1&&e.sort(f||Zv),n.length>1&&n.sort(p||cu),s.length>1&&s.sort(p||cu)}function h(){for(let f=t,p=i.length;f<p;f++){const u=i[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Jv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new hu,i.set(n,[a])):s>=r.length?(a=new hu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Kv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Yt};break;case"SpotLight":e={position:new D,direction:new D,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function jv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Qv=0;function tx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function ex(i){const t=new Kv,e=jv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new ce,a=new ce;function o(c){let h=0,f=0,p=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let u=0,m=0,v=0,g=0,d=0,x=0,y=0,_=0,E=0,b=0,A=0;c.sort(tx);for(let S=0,M=c.length;S<M;S++){const R=c[S],L=R.color,P=R.intensity,F=R.distance,O=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=L.r*P,f+=L.g*P,p+=L.b*P;else if(R.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(R.sh.coefficients[z],P);A++}else if(R.isDirectionalLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const X=R.shadow,H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.directionalShadow[u]=H,n.directionalShadowMap[u]=O,n.directionalShadowMatrix[u]=R.shadow.matrix,x++}n.directional[u]=z,u++}else if(R.isSpotLight){const z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(L).multiplyScalar(P),z.distance=F,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,n.spot[v]=z;const X=R.shadow;if(R.map&&(n.spotLightMap[E]=R.map,E++,X.updateMatrices(R),R.castShadow&&b++),n.spotLightMatrix[v]=X.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=O,_++}v++}else if(R.isRectAreaLight){const z=t.get(R);z.color.copy(L).multiplyScalar(P),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=z,g++}else if(R.isPointLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const X=R.shadow,H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,n.pointShadow[m]=H,n.pointShadowMap[m]=O,n.pointShadowMatrix[m]=R.shadow.matrix,y++}n.point[m]=z,m++}else if(R.isHemisphereLight){const z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(P),z.groundColor.copy(R.groundColor).multiplyScalar(P),n.hemi[d]=z,d++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Rt.LTC_FLOAT_1,n.rectAreaLTC2=Rt.LTC_FLOAT_2):(n.rectAreaLTC1=Rt.LTC_HALF_1,n.rectAreaLTC2=Rt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const T=n.hash;(T.directionalLength!==u||T.pointLength!==m||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==d||T.numDirectionalShadows!==x||T.numPointShadows!==y||T.numSpotShadows!==_||T.numSpotMaps!==E||T.numLightProbes!==A)&&(n.directional.length=u,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=d,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=_+E-b,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=A,T.directionalLength=u,T.pointLength=m,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=d,T.numDirectionalShadows=x,T.numPointShadows=y,T.numSpotShadows=_,T.numSpotMaps=E,T.numLightProbes=A,n.version=Qv++)}function l(c,h){let f=0,p=0,u=0,m=0,v=0;const g=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const y=c[d];if(y.isDirectionalLight){const _=n.directional[f];_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(y.isSpotLight){const _=n.spot[u];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(y.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(y.isPointLight){const _=n.point[p];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),p++}else if(y.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:n}}function uu(i){const t=new ex(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function nx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new uu(i),t.set(s,[o])):r>=a.length?(o=new uu(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const ix=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sx=`uniform sampler2D shadow_pass;
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
}`;function rx(i,t,e){let n=new Bc;const s=new ut,r=new ut,a=new Me,o=new Tp({depthPacking:Hd}),l=new Ep,c={},h=e.maxTextureSize,f={[Hi]:en,[en]:Hi,[ze]:ze},p=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:ix,fragmentShader:sx}),u=p.clone();u.defines.HORIZONTAL_PASS=1;const m=new Le;m.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new qt(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yu;let d=this.type;this.render=function(b,A,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const S=i.getRenderTarget(),M=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),L=i.state;L.setBlending(an),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const P=d!==Mi&&this.type===Mi,F=d===Mi&&this.type!==Mi;for(let O=0,z=b.length;O<z;O++){const X=b[O],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const q=H.getFrameExtents();if(s.multiply(q),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,H.mapSize.y=r.y)),H.map===null||P===!0||F===!0){const at=this.type!==Mi?{minFilter:ln,magFilter:ln}:{};H.map!==null&&H.map.dispose(),H.map=new Sn(s.x,s.y,at),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const Q=H.getViewportCount();for(let at=0;at<Q;at++){const Tt=H.getViewport(at);a.set(r.x*Tt.x,r.y*Tt.y,r.x*Tt.z,r.y*Tt.w),L.viewport(a),H.updateMatrices(X,at),n=H.getFrustum(),_(A,T,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Mi&&x(H,T),H.needsUpdate=!1}d=this.type,g.needsUpdate=!1,i.setRenderTarget(S,M,R)};function x(b,A){const T=t.update(v);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Sn(s.x,s.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(A,null,T,p,v,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(A,null,T,u,v,null)}function y(b,A,T,S){let M=null;const R=T.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)M=R;else if(M=T.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const L=M.uuid,P=A.uuid;let F=c[L];F===void 0&&(F={},c[L]=F);let O=F[P];O===void 0&&(O=M.clone(),F[P]=O,A.addEventListener("dispose",E)),M=O}if(M.visible=A.visible,M.wireframe=A.wireframe,S===Mi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:f[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const L=i.properties.get(M);L.light=T}return M}function _(b,A,T,S,M){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===Mi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,b.matrixWorld);const P=t.update(b),F=b.material;if(Array.isArray(F)){const O=P.groups;for(let z=0,X=O.length;z<X;z++){const H=O[z],q=F[H.materialIndex];if(q&&q.visible){const Q=y(b,q,S,M);b.onBeforeShadow(i,b,A,T,P,Q,H),i.renderBufferDirect(T,null,P,Q,b,H),b.onAfterShadow(i,b,A,T,P,Q,H)}}}else if(F.visible){const O=y(b,F,S,M);b.onBeforeShadow(i,b,A,T,P,O,null),i.renderBufferDirect(T,null,P,O,b,null),b.onAfterShadow(i,b,A,T,P,O,null)}}const L=b.children;for(let P=0,F=L.length;P<F;P++)_(L[P],A,T,S,M)}function E(b){b.target.removeEventListener("dispose",E);for(const T in c){const S=c[T],M=b.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const ax={[_l]:yl,[Ml]:wl,[Sl]:Tl,[qs]:bl,[yl]:_l,[wl]:Ml,[Tl]:Sl,[bl]:qs};function ox(i,t){function e(){let k=!1;const ft=new Me;let St=null;const Ft=new Me(0,0,0,0);return{setMask:function(xt){St!==xt&&!k&&(i.colorMask(xt,xt,xt,xt),St=xt)},setLocked:function(xt){k=xt},setClear:function(xt,rt,Ht,Qt,ve){ve===!0&&(xt*=Qt,rt*=Qt,Ht*=Qt),ft.set(xt,rt,Ht,Qt),Ft.equals(ft)===!1&&(i.clearColor(xt,rt,Ht,Qt),Ft.copy(ft))},reset:function(){k=!1,St=null,Ft.set(-1,0,0,0)}}}function n(){let k=!1,ft=!1,St=null,Ft=null,xt=null;return{setReversed:function(rt){if(ft!==rt){const Ht=t.get("EXT_clip_control");rt?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT),ft=rt;const Qt=xt;xt=null,this.setClear(Qt)}},getReversed:function(){return ft},setTest:function(rt){rt?tt(i.DEPTH_TEST):pt(i.DEPTH_TEST)},setMask:function(rt){St!==rt&&!k&&(i.depthMask(rt),St=rt)},setFunc:function(rt){if(ft&&(rt=ax[rt]),Ft!==rt){switch(rt){case _l:i.depthFunc(i.NEVER);break;case yl:i.depthFunc(i.ALWAYS);break;case Ml:i.depthFunc(i.LESS);break;case qs:i.depthFunc(i.LEQUAL);break;case Sl:i.depthFunc(i.EQUAL);break;case bl:i.depthFunc(i.GEQUAL);break;case wl:i.depthFunc(i.GREATER);break;case Tl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ft=rt}},setLocked:function(rt){k=rt},setClear:function(rt){xt!==rt&&(ft&&(rt=1-rt),i.clearDepth(rt),xt=rt)},reset:function(){k=!1,St=null,Ft=null,xt=null,ft=!1}}}function s(){let k=!1,ft=null,St=null,Ft=null,xt=null,rt=null,Ht=null,Qt=null,ve=null;return{setTest:function(fe){k||(fe?tt(i.STENCIL_TEST):pt(i.STENCIL_TEST))},setMask:function(fe){ft!==fe&&!k&&(i.stencilMask(fe),ft=fe)},setFunc:function(fe,Nn,bn){(St!==fe||Ft!==Nn||xt!==bn)&&(i.stencilFunc(fe,Nn,bn),St=fe,Ft=Nn,xt=bn)},setOp:function(fe,Nn,bn){(rt!==fe||Ht!==Nn||Qt!==bn)&&(i.stencilOp(fe,Nn,bn),rt=fe,Ht=Nn,Qt=bn)},setLocked:function(fe){k=fe},setClear:function(fe){ve!==fe&&(i.clearStencil(fe),ve=fe)},reset:function(){k=!1,ft=null,St=null,Ft=null,xt=null,rt=null,Ht=null,Qt=null,ve=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},p=new WeakMap,u=[],m=null,v=!1,g=null,d=null,x=null,y=null,_=null,E=null,b=null,A=new Yt(0,0,0),T=0,S=!1,M=null,R=null,L=null,P=null,F=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,X=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),z=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),z=X>=2);let q=null,Q={};const at=i.getParameter(i.SCISSOR_BOX),Tt=i.getParameter(i.VIEWPORT),It=new Me().fromArray(at),Ct=new Me().fromArray(Tt);function Gt(k,ft,St,Ft){const xt=new Uint8Array(4),rt=i.createTexture();i.bindTexture(k,rt),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ht=0;Ht<St;Ht++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(ft,0,i.RGBA,1,1,Ft,0,i.RGBA,i.UNSIGNED_BYTE,xt):i.texImage2D(ft+Ht,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xt);return rt}const Y={};Y[i.TEXTURE_2D]=Gt(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Gt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Gt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Gt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),tt(i.DEPTH_TEST),a.setFunc(qs),it(!1),et(eh),tt(i.CULL_FACE),st(an);function tt(k){h[k]!==!0&&(i.enable(k),h[k]=!0)}function pt(k){h[k]!==!1&&(i.disable(k),h[k]=!1)}function wt(k,ft){return f[k]!==ft?(i.bindFramebuffer(k,ft),f[k]=ft,k===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ft),k===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ft),!0):!1}function bt(k,ft){let St=u,Ft=!1;if(k){St=p.get(ft),St===void 0&&(St=[],p.set(ft,St));const xt=k.textures;if(St.length!==xt.length||St[0]!==i.COLOR_ATTACHMENT0){for(let rt=0,Ht=xt.length;rt<Ht;rt++)St[rt]=i.COLOR_ATTACHMENT0+rt;St.length=xt.length,Ft=!0}}else St[0]!==i.BACK&&(St[0]=i.BACK,Ft=!0);Ft&&i.drawBuffers(St)}function Xt(k){return m!==k?(i.useProgram(k),m=k,!0):!1}const zt={[Ti]:i.FUNC_ADD,[bd]:i.FUNC_SUBTRACT,[wd]:i.FUNC_REVERSE_SUBTRACT};zt[Td]=i.MIN,zt[Ed]=i.MAX;const N={[gl]:i.ZERO,[Ad]:i.ONE,[Rd]:i.SRC_COLOR,[vl]:i.SRC_ALPHA,[Ld]:i.SRC_ALPHA_SATURATE,[Ku]:i.DST_COLOR,[Ju]:i.DST_ALPHA,[Cd]:i.ONE_MINUS_SRC_COLOR,[xl]:i.ONE_MINUS_SRC_ALPHA,[Id]:i.ONE_MINUS_DST_COLOR,[Pd]:i.ONE_MINUS_DST_ALPHA,[Dd]:i.CONSTANT_COLOR,[Ud]:i.ONE_MINUS_CONSTANT_COLOR,[Nd]:i.CONSTANT_ALPHA,[Fd]:i.ONE_MINUS_CONSTANT_ALPHA};function st(k,ft,St,Ft,xt,rt,Ht,Qt,ve,fe){if(k===an){v===!0&&(pt(i.BLEND),v=!1);return}if(v===!1&&(tt(i.BLEND),v=!0),k!==Zu){if(k!==g||fe!==S){if((d!==Ti||_!==Ti)&&(i.blendEquation(i.FUNC_ADD),d=Ti,_=Ti),fe)switch(k){case Gs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Nr:i.blendFunc(i.ONE,i.ONE);break;case nh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ih:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Gs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Nr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ih:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}x=null,y=null,E=null,b=null,A.set(0,0,0),T=0,g=k,S=fe}return}xt=xt||ft,rt=rt||St,Ht=Ht||Ft,(ft!==d||xt!==_)&&(i.blendEquationSeparate(zt[ft],zt[xt]),d=ft,_=xt),(St!==x||Ft!==y||rt!==E||Ht!==b)&&(i.blendFuncSeparate(N[St],N[Ft],N[rt],N[Ht]),x=St,y=Ft,E=rt,b=Ht),(Qt.equals(A)===!1||ve!==T)&&(i.blendColor(Qt.r,Qt.g,Qt.b,ve),A.copy(Qt),T=ve),g=k,S=!1}function nt(k,ft){k.side===ze?pt(i.CULL_FACE):tt(i.CULL_FACE);let St=k.side===en;ft&&(St=!St),it(St),k.blending===Gs&&k.transparent===!1?st(an):st(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const Ft=k.stencilWrite;o.setTest(Ft),Ft&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),ct(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?tt(i.SAMPLE_ALPHA_TO_COVERAGE):pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(k){M!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),M=k)}function et(k){k!==Md?(tt(i.CULL_FACE),k!==R&&(k===eh?i.cullFace(i.BACK):k===Sd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pt(i.CULL_FACE),R=k}function dt(k){k!==L&&(z&&i.lineWidth(k),L=k)}function ct(k,ft,St){k?(tt(i.POLYGON_OFFSET_FILL),(P!==ft||F!==St)&&(i.polygonOffset(ft,St),P=ft,F=St)):pt(i.POLYGON_OFFSET_FILL)}function _t(k){k?tt(i.SCISSOR_TEST):pt(i.SCISSOR_TEST)}function $t(k){k===void 0&&(k=i.TEXTURE0+O-1),q!==k&&(i.activeTexture(k),q=k)}function Zt(k,ft,St){St===void 0&&(q===null?St=i.TEXTURE0+O-1:St=q);let Ft=Q[St];Ft===void 0&&(Ft={type:void 0,texture:void 0},Q[St]=Ft),(Ft.type!==k||Ft.texture!==ft)&&(q!==St&&(i.activeTexture(St),q=St),i.bindTexture(k,ft||Y[k]),Ft.type=k,Ft.texture=ft)}function I(){const k=Q[q];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function w(){try{i.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function G(){try{i.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function $(){try{i.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function lt(){try{i.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Lt(){try{i.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function gt(){try{i.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function kt(){try{i.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function yt(){try{i.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ot(){try{i.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function vt(k){It.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),It.copy(k))}function Nt(k){Ct.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),Ct.copy(k))}function Et(k,ft){let St=c.get(ft);St===void 0&&(St=new WeakMap,c.set(ft,St));let Ft=St.get(k);Ft===void 0&&(Ft=i.getUniformBlockIndex(ft,k.name),St.set(k,Ft))}function mt(k,ft){const Ft=c.get(ft).get(k);l.get(ft)!==Ft&&(i.uniformBlockBinding(ft,Ft,k.__bindingPointIndex),l.set(ft,Ft))}function Vt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},q=null,Q={},f={},p=new WeakMap,u=[],m=null,v=!1,g=null,d=null,x=null,y=null,_=null,E=null,b=null,A=new Yt(0,0,0),T=0,S=!1,M=null,R=null,L=null,P=null,F=null,It.set(0,0,i.canvas.width,i.canvas.height),Ct.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:tt,disable:pt,bindFramebuffer:wt,drawBuffers:bt,useProgram:Xt,setBlending:st,setMaterial:nt,setFlipSided:it,setCullFace:et,setLineWidth:dt,setPolygonOffset:ct,setScissorTest:_t,activeTexture:$t,bindTexture:Zt,unbindTexture:I,compressedTexImage2D:w,compressedTexImage3D:G,texImage2D:yt,texImage3D:ot,updateUBOMapping:Et,uniformBlockBinding:mt,texStorage2D:gt,texStorage3D:kt,texSubImage2D:$,texSubImage3D:lt,compressedTexSubImage2D:Z,compressedTexSubImage3D:Lt,scissor:vt,viewport:Nt,reset:Vt}}function lx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,h=new WeakMap;let f;const p=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,w){return u?new OffscreenCanvas(I,w):kr("canvas")}function v(I,w,G){let $=1;const lt=Zt(I);if((lt.width>G||lt.height>G)&&($=G/Math.max(lt.width,lt.height)),$<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const Z=Math.floor($*lt.width),Lt=Math.floor($*lt.height);f===void 0&&(f=m(Z,Lt));const gt=w?m(Z,Lt):f;return gt.width=Z,gt.height=Lt,gt.getContext("2d").drawImage(I,0,0,Z,Lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+Z+"x"+Lt+")."),gt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),I;return I}function g(I){return I.generateMipmaps}function d(I){i.generateMipmap(I)}function x(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(I,w,G,$,lt=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let Z=w;if(w===i.RED&&(G===i.FLOAT&&(Z=i.R32F),G===i.HALF_FLOAT&&(Z=i.R16F),G===i.UNSIGNED_BYTE&&(Z=i.R8)),w===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.R8UI),G===i.UNSIGNED_SHORT&&(Z=i.R16UI),G===i.UNSIGNED_INT&&(Z=i.R32UI),G===i.BYTE&&(Z=i.R8I),G===i.SHORT&&(Z=i.R16I),G===i.INT&&(Z=i.R32I)),w===i.RG&&(G===i.FLOAT&&(Z=i.RG32F),G===i.HALF_FLOAT&&(Z=i.RG16F),G===i.UNSIGNED_BYTE&&(Z=i.RG8)),w===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RG8UI),G===i.UNSIGNED_SHORT&&(Z=i.RG16UI),G===i.UNSIGNED_INT&&(Z=i.RG32UI),G===i.BYTE&&(Z=i.RG8I),G===i.SHORT&&(Z=i.RG16I),G===i.INT&&(Z=i.RG32I)),w===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),G===i.UNSIGNED_INT&&(Z=i.RGB32UI),G===i.BYTE&&(Z=i.RGB8I),G===i.SHORT&&(Z=i.RGB16I),G===i.INT&&(Z=i.RGB32I)),w===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),G===i.UNSIGNED_INT&&(Z=i.RGBA32UI),G===i.BYTE&&(Z=i.RGBA8I),G===i.SHORT&&(Z=i.RGBA16I),G===i.INT&&(Z=i.RGBA32I)),w===i.RGB&&(G===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),w===i.RGBA){const Lt=lt?Ja:de.getTransfer($);G===i.FLOAT&&(Z=i.RGBA32F),G===i.HALF_FLOAT&&(Z=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Z=Lt===xe?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function _(I,w){let G;return I?w===null||w===hs||w===Zs?G=i.DEPTH24_STENCIL8:w===Wn?G=i.DEPTH32F_STENCIL8:w===Fr&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===hs||w===Zs?G=i.DEPTH_COMPONENT24:w===Wn?G=i.DEPTH_COMPONENT32F:w===Fr&&(G=i.DEPTH_COMPONENT16),G}function E(I,w){return g(I)===!0||I.isFramebufferTexture&&I.minFilter!==ln&&I.minFilter!==ei?Math.log2(Math.max(w.width,w.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?w.mipmaps.length:1}function b(I){const w=I.target;w.removeEventListener("dispose",b),T(w),w.isVideoTexture&&h.delete(w)}function A(I){const w=I.target;w.removeEventListener("dispose",A),M(w)}function T(I){const w=n.get(I);if(w.__webglInit===void 0)return;const G=I.source,$=p.get(G);if($){const lt=$[w.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&S(I),Object.keys($).length===0&&p.delete(G)}n.remove(I)}function S(I){const w=n.get(I);i.deleteTexture(w.__webglTexture);const G=I.source,$=p.get(G);delete $[w.__cacheKey],a.memory.textures--}function M(I){const w=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(w.__webglFramebuffer[$]))for(let lt=0;lt<w.__webglFramebuffer[$].length;lt++)i.deleteFramebuffer(w.__webglFramebuffer[$][lt]);else i.deleteFramebuffer(w.__webglFramebuffer[$]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[$])}else{if(Array.isArray(w.__webglFramebuffer))for(let $=0;$<w.__webglFramebuffer.length;$++)i.deleteFramebuffer(w.__webglFramebuffer[$]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let $=0;$<w.__webglColorRenderbuffer.length;$++)w.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[$]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const G=I.textures;for(let $=0,lt=G.length;$<lt;$++){const Z=n.get(G[$]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(G[$])}n.remove(I)}let R=0;function L(){R=0}function P(){const I=R;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),R+=1,I}function F(I){const w=[];return w.push(I.wrapS),w.push(I.wrapT),w.push(I.wrapR||0),w.push(I.magFilter),w.push(I.minFilter),w.push(I.anisotropy),w.push(I.internalFormat),w.push(I.format),w.push(I.type),w.push(I.generateMipmaps),w.push(I.premultiplyAlpha),w.push(I.flipY),w.push(I.unpackAlignment),w.push(I.colorSpace),w.join()}function O(I,w){const G=n.get(I);if(I.isVideoTexture&&_t(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&G.__version!==I.version){const $=I.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(G,I,w);return}}else I.isExternalTexture&&(G.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+w)}function z(I,w){const G=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&G.__version!==I.version){Y(G,I,w);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+w)}function X(I,w){const G=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&G.__version!==I.version){Y(G,I,w);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+w)}function H(I,w){const G=n.get(I);if(I.version>0&&G.__version!==I.version){tt(G,I,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+w)}const q={[Vi]:i.REPEAT,[as]:i.CLAMP_TO_EDGE,[Rl]:i.MIRRORED_REPEAT},Q={[ln]:i.NEAREST,[kd]:i.NEAREST_MIPMAP_NEAREST,[jr]:i.NEAREST_MIPMAP_LINEAR,[ei]:i.LINEAR,[Ro]:i.LINEAR_MIPMAP_NEAREST,[os]:i.LINEAR_MIPMAP_LINEAR},at={[Gd]:i.NEVER,[Zd]:i.ALWAYS,[Wd]:i.LESS,[df]:i.LEQUAL,[Xd]:i.EQUAL,[$d]:i.GEQUAL,[qd]:i.GREATER,[Yd]:i.NOTEQUAL};function Tt(I,w){if(w.type===Wn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===ei||w.magFilter===Ro||w.magFilter===jr||w.magFilter===os||w.minFilter===ei||w.minFilter===Ro||w.minFilter===jr||w.minFilter===os)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,q[w.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,q[w.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,q[w.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,Q[w.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,Q[w.minFilter]),w.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,at[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===ln||w.minFilter!==jr&&w.minFilter!==os||w.type===Wn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function It(I,w){let G=!1;I.__webglInit===void 0&&(I.__webglInit=!0,w.addEventListener("dispose",b));const $=w.source;let lt=p.get($);lt===void 0&&(lt={},p.set($,lt));const Z=F(w);if(Z!==I.__cacheKey){lt[Z]===void 0&&(lt[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),lt[Z].usedTimes++;const Lt=lt[I.__cacheKey];Lt!==void 0&&(lt[I.__cacheKey].usedTimes--,Lt.usedTimes===0&&S(w)),I.__cacheKey=Z,I.__webglTexture=lt[Z].texture}return G}function Ct(I,w,G){return Math.floor(Math.floor(I/G)/w)}function Gt(I,w,G,$){const Z=I.updateRanges;if(Z.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,G,$,w.data);else{Z.sort((ot,vt)=>ot.start-vt.start);let Lt=0;for(let ot=1;ot<Z.length;ot++){const vt=Z[Lt],Nt=Z[ot],Et=vt.start+vt.count,mt=Ct(Nt.start,w.width,4),Vt=Ct(vt.start,w.width,4);Nt.start<=Et+1&&mt===Vt&&Ct(Nt.start+Nt.count-1,w.width,4)===mt?vt.count=Math.max(vt.count,Nt.start+Nt.count-vt.start):(++Lt,Z[Lt]=Nt)}Z.length=Lt+1;const gt=i.getParameter(i.UNPACK_ROW_LENGTH),kt=i.getParameter(i.UNPACK_SKIP_PIXELS),yt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let ot=0,vt=Z.length;ot<vt;ot++){const Nt=Z[ot],Et=Math.floor(Nt.start/4),mt=Math.ceil(Nt.count/4),Vt=Et%w.width,k=Math.floor(Et/w.width),ft=mt,St=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),e.texSubImage2D(i.TEXTURE_2D,0,Vt,k,ft,St,G,$,w.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,gt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,kt),i.pixelStorei(i.UNPACK_SKIP_ROWS,yt)}}function Y(I,w,G){let $=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&($=i.TEXTURE_3D);const lt=It(I,w),Z=w.source;e.bindTexture($,I.__webglTexture,i.TEXTURE0+G);const Lt=n.get(Z);if(Z.version!==Lt.__version||lt===!0){e.activeTexture(i.TEXTURE0+G);const gt=de.getPrimaries(de.workingColorSpace),kt=w.colorSpace===_n?null:de.getPrimaries(w.colorSpace),yt=w.colorSpace===_n||gt===kt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);let ot=v(w.image,!1,s.maxTextureSize);ot=$t(w,ot);const vt=r.convert(w.format,w.colorSpace),Nt=r.convert(w.type);let Et=y(w.internalFormat,vt,Nt,w.colorSpace,w.isVideoTexture);Tt($,w);let mt;const Vt=w.mipmaps,k=w.isVideoTexture!==!0,ft=Lt.__version===void 0||lt===!0,St=Z.dataReady,Ft=E(w,ot);if(w.isDepthTexture)Et=_(w.format===Js,w.type),ft&&(k?e.texStorage2D(i.TEXTURE_2D,1,Et,ot.width,ot.height):e.texImage2D(i.TEXTURE_2D,0,Et,ot.width,ot.height,0,vt,Nt,null));else if(w.isDataTexture)if(Vt.length>0){k&&ft&&e.texStorage2D(i.TEXTURE_2D,Ft,Et,Vt[0].width,Vt[0].height);for(let xt=0,rt=Vt.length;xt<rt;xt++)mt=Vt[xt],k?St&&e.texSubImage2D(i.TEXTURE_2D,xt,0,0,mt.width,mt.height,vt,Nt,mt.data):e.texImage2D(i.TEXTURE_2D,xt,Et,mt.width,mt.height,0,vt,Nt,mt.data);w.generateMipmaps=!1}else k?(ft&&e.texStorage2D(i.TEXTURE_2D,Ft,Et,ot.width,ot.height),St&&Gt(w,ot,vt,Nt)):e.texImage2D(i.TEXTURE_2D,0,Et,ot.width,ot.height,0,vt,Nt,ot.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){k&&ft&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ft,Et,Vt[0].width,Vt[0].height,ot.depth);for(let xt=0,rt=Vt.length;xt<rt;xt++)if(mt=Vt[xt],w.format!==Xn)if(vt!==null)if(k){if(St)if(w.layerUpdates.size>0){const Ht=Vh(mt.width,mt.height,w.format,w.type);for(const Qt of w.layerUpdates){const ve=mt.data.subarray(Qt*Ht/mt.data.BYTES_PER_ELEMENT,(Qt+1)*Ht/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,xt,0,0,Qt,mt.width,mt.height,1,vt,ve)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,xt,0,0,0,mt.width,mt.height,ot.depth,vt,mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,xt,Et,mt.width,mt.height,ot.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?St&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,xt,0,0,0,mt.width,mt.height,ot.depth,vt,Nt,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,xt,Et,mt.width,mt.height,ot.depth,0,vt,Nt,mt.data)}else{k&&ft&&e.texStorage2D(i.TEXTURE_2D,Ft,Et,Vt[0].width,Vt[0].height);for(let xt=0,rt=Vt.length;xt<rt;xt++)mt=Vt[xt],w.format!==Xn?vt!==null?k?St&&e.compressedTexSubImage2D(i.TEXTURE_2D,xt,0,0,mt.width,mt.height,vt,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,xt,Et,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?St&&e.texSubImage2D(i.TEXTURE_2D,xt,0,0,mt.width,mt.height,vt,Nt,mt.data):e.texImage2D(i.TEXTURE_2D,xt,Et,mt.width,mt.height,0,vt,Nt,mt.data)}else if(w.isDataArrayTexture)if(k){if(ft&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ft,Et,ot.width,ot.height,ot.depth),St)if(w.layerUpdates.size>0){const xt=Vh(ot.width,ot.height,w.format,w.type);for(const rt of w.layerUpdates){const Ht=ot.data.subarray(rt*xt/ot.data.BYTES_PER_ELEMENT,(rt+1)*xt/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,rt,ot.width,ot.height,1,vt,Nt,Ht)}w.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,vt,Nt,ot.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,ot.width,ot.height,ot.depth,0,vt,Nt,ot.data);else if(w.isData3DTexture)k?(ft&&e.texStorage3D(i.TEXTURE_3D,Ft,Et,ot.width,ot.height,ot.depth),St&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,vt,Nt,ot.data)):e.texImage3D(i.TEXTURE_3D,0,Et,ot.width,ot.height,ot.depth,0,vt,Nt,ot.data);else if(w.isFramebufferTexture){if(ft)if(k)e.texStorage2D(i.TEXTURE_2D,Ft,Et,ot.width,ot.height);else{let xt=ot.width,rt=ot.height;for(let Ht=0;Ht<Ft;Ht++)e.texImage2D(i.TEXTURE_2D,Ht,Et,xt,rt,0,vt,Nt,null),xt>>=1,rt>>=1}}else if(Vt.length>0){if(k&&ft){const xt=Zt(Vt[0]);e.texStorage2D(i.TEXTURE_2D,Ft,Et,xt.width,xt.height)}for(let xt=0,rt=Vt.length;xt<rt;xt++)mt=Vt[xt],k?St&&e.texSubImage2D(i.TEXTURE_2D,xt,0,0,vt,Nt,mt):e.texImage2D(i.TEXTURE_2D,xt,Et,vt,Nt,mt);w.generateMipmaps=!1}else if(k){if(ft){const xt=Zt(ot);e.texStorage2D(i.TEXTURE_2D,Ft,Et,xt.width,xt.height)}St&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Nt,ot)}else e.texImage2D(i.TEXTURE_2D,0,Et,vt,Nt,ot);g(w)&&d($),Lt.__version=Z.version,w.onUpdate&&w.onUpdate(w)}I.__version=w.version}function tt(I,w,G){if(w.image.length!==6)return;const $=It(I,w),lt=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+G);const Z=n.get(lt);if(lt.version!==Z.__version||$===!0){e.activeTexture(i.TEXTURE0+G);const Lt=de.getPrimaries(de.workingColorSpace),gt=w.colorSpace===_n?null:de.getPrimaries(w.colorSpace),kt=w.colorSpace===_n||Lt===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);const yt=w.isCompressedTexture||w.image[0].isCompressedTexture,ot=w.image[0]&&w.image[0].isDataTexture,vt=[];for(let rt=0;rt<6;rt++)!yt&&!ot?vt[rt]=v(w.image[rt],!0,s.maxCubemapSize):vt[rt]=ot?w.image[rt].image:w.image[rt],vt[rt]=$t(w,vt[rt]);const Nt=vt[0],Et=r.convert(w.format,w.colorSpace),mt=r.convert(w.type),Vt=y(w.internalFormat,Et,mt,w.colorSpace),k=w.isVideoTexture!==!0,ft=Z.__version===void 0||$===!0,St=lt.dataReady;let Ft=E(w,Nt);Tt(i.TEXTURE_CUBE_MAP,w);let xt;if(yt){k&&ft&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ft,Vt,Nt.width,Nt.height);for(let rt=0;rt<6;rt++){xt=vt[rt].mipmaps;for(let Ht=0;Ht<xt.length;Ht++){const Qt=xt[Ht];w.format!==Xn?Et!==null?k?St&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht,0,0,Qt.width,Qt.height,Et,Qt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht,Vt,Qt.width,Qt.height,0,Qt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?St&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht,0,0,Qt.width,Qt.height,Et,mt,Qt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht,Vt,Qt.width,Qt.height,0,Et,mt,Qt.data)}}}else{if(xt=w.mipmaps,k&&ft){xt.length>0&&Ft++;const rt=Zt(vt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ft,Vt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(ot){k?St&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,vt[rt].width,vt[rt].height,Et,mt,vt[rt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Vt,vt[rt].width,vt[rt].height,0,Et,mt,vt[rt].data);for(let Ht=0;Ht<xt.length;Ht++){const ve=xt[Ht].image[rt].image;k?St&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht+1,0,0,ve.width,ve.height,Et,mt,ve.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht+1,Vt,ve.width,ve.height,0,Et,mt,ve.data)}}else{k?St&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Et,mt,vt[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Vt,Et,mt,vt[rt]);for(let Ht=0;Ht<xt.length;Ht++){const Qt=xt[Ht];k?St&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht+1,0,0,Et,mt,Qt.image[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ht+1,Vt,Et,mt,Qt.image[rt])}}}g(w)&&d(i.TEXTURE_CUBE_MAP),Z.__version=lt.version,w.onUpdate&&w.onUpdate(w)}I.__version=w.version}function pt(I,w,G,$,lt,Z){const Lt=r.convert(G.format,G.colorSpace),gt=r.convert(G.type),kt=y(G.internalFormat,Lt,gt,G.colorSpace),yt=n.get(w),ot=n.get(G);if(ot.__renderTarget=w,!yt.__hasExternalTextures){const vt=Math.max(1,w.width>>Z),Nt=Math.max(1,w.height>>Z);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,Z,kt,vt,Nt,w.depth,0,Lt,gt,null):e.texImage2D(lt,Z,kt,vt,Nt,0,Lt,gt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),ct(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,lt,ot.__webglTexture,0,dt(w)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,lt,ot.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(I,w,G){if(i.bindRenderbuffer(i.RENDERBUFFER,I),w.depthBuffer){const $=w.depthTexture,lt=$&&$.isDepthTexture?$.type:null,Z=_(w.stencilBuffer,lt),Lt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=dt(w);ct(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,Z,w.width,w.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,Z,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Z,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Lt,i.RENDERBUFFER,I)}else{const $=w.textures;for(let lt=0;lt<$.length;lt++){const Z=$[lt],Lt=r.convert(Z.format,Z.colorSpace),gt=r.convert(Z.type),kt=y(Z.internalFormat,Lt,gt,Z.colorSpace),yt=dt(w);G&&ct(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,yt,kt,w.width,w.height):ct(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,yt,kt,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,kt,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(I,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(w.depthTexture);$.__renderTarget=w,(!$.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),O(w.depthTexture,0);const lt=$.__webglTexture,Z=dt(w);if(w.depthTexture.format===Or)ct(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(w.depthTexture.format===Js)ct(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Xt(I){const w=n.get(I),G=I.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==I.depthTexture){const $=I.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),$){const lt=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,$.removeEventListener("dispose",lt)};$.addEventListener("dispose",lt),w.__depthDisposeCallback=lt}w.__boundDepthTexture=$}if(I.depthTexture&&!w.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const $=I.texture.mipmaps;$&&$.length>0?bt(w.__webglFramebuffer[0],I):bt(w.__webglFramebuffer,I)}else if(G){w.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[$]),w.__webglDepthbuffer[$]===void 0)w.__webglDepthbuffer[$]=i.createRenderbuffer(),wt(w.__webglDepthbuffer[$],I,!1);else{const lt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=w.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,Z)}}else{const $=I.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),wt(w.__webglDepthbuffer,I,!1);else{const lt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,Z)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function zt(I,w,G){const $=n.get(I);w!==void 0&&pt($.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Xt(I)}function N(I){const w=I.texture,G=n.get(I),$=n.get(w);I.addEventListener("dispose",A);const lt=I.textures,Z=I.isWebGLCubeRenderTarget===!0,Lt=lt.length>1;if(Lt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=w.version,a.memory.textures++),Z){G.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer[gt]=[];for(let kt=0;kt<w.mipmaps.length;kt++)G.__webglFramebuffer[gt][kt]=i.createFramebuffer()}else G.__webglFramebuffer[gt]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer=[];for(let gt=0;gt<w.mipmaps.length;gt++)G.__webglFramebuffer[gt]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(Lt)for(let gt=0,kt=lt.length;gt<kt;gt++){const yt=n.get(lt[gt]);yt.__webglTexture===void 0&&(yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&ct(I)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let gt=0;gt<lt.length;gt++){const kt=lt[gt];G.__webglColorRenderbuffer[gt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[gt]);const yt=r.convert(kt.format,kt.colorSpace),ot=r.convert(kt.type),vt=y(kt.internalFormat,yt,ot,kt.colorSpace,I.isXRRenderTarget===!0),Nt=dt(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,vt,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,G.__webglColorRenderbuffer[gt])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),wt(G.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Tt(i.TEXTURE_CUBE_MAP,w);for(let gt=0;gt<6;gt++)if(w.mipmaps&&w.mipmaps.length>0)for(let kt=0;kt<w.mipmaps.length;kt++)pt(G.__webglFramebuffer[gt][kt],I,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,kt);else pt(G.__webglFramebuffer[gt],I,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);g(w)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Lt){for(let gt=0,kt=lt.length;gt<kt;gt++){const yt=lt[gt],ot=n.get(yt);let vt=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(vt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(vt,ot.__webglTexture),Tt(vt,yt),pt(G.__webglFramebuffer,I,yt,i.COLOR_ATTACHMENT0+gt,vt,0),g(yt)&&d(vt)}e.unbindTexture()}else{let gt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(gt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,$.__webglTexture),Tt(gt,w),w.mipmaps&&w.mipmaps.length>0)for(let kt=0;kt<w.mipmaps.length;kt++)pt(G.__webglFramebuffer[kt],I,w,i.COLOR_ATTACHMENT0,gt,kt);else pt(G.__webglFramebuffer,I,w,i.COLOR_ATTACHMENT0,gt,0);g(w)&&d(gt),e.unbindTexture()}I.depthBuffer&&Xt(I)}function st(I){const w=I.textures;for(let G=0,$=w.length;G<$;G++){const lt=w[G];if(g(lt)){const Z=x(I),Lt=n.get(lt).__webglTexture;e.bindTexture(Z,Lt),d(Z),e.unbindTexture()}}}const nt=[],it=[];function et(I){if(I.samples>0){if(ct(I)===!1){const w=I.textures,G=I.width,$=I.height;let lt=i.COLOR_BUFFER_BIT;const Z=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Lt=n.get(I),gt=w.length>1;if(gt)for(let yt=0;yt<w.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Lt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer);const kt=I.texture.mipmaps;kt&&kt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer);for(let yt=0;yt<w.length;yt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),gt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Lt.__webglColorRenderbuffer[yt]);const ot=n.get(w[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ot,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,lt,i.NEAREST),l===!0&&(nt.length=0,it.length=0,nt.push(i.COLOR_ATTACHMENT0+yt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(nt.push(Z),it.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),gt)for(let yt=0;yt<w.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,Lt.__webglColorRenderbuffer[yt]);const ot=n.get(w[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Lt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,ot,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){const w=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function dt(I){return Math.min(s.maxSamples,I.samples)}function ct(I){const w=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function _t(I){const w=a.render.frame;h.get(I)!==w&&(h.set(I,w),I.update())}function $t(I,w){const G=I.colorSpace,$=I.format,lt=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||G!==Ks&&G!==_n&&(de.getTransfer(G)===xe?($!==Xn||lt!==oi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),w}function Zt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=L,this.setTexture2D=O,this.setTexture2DArray=z,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=zt,this.setupRenderTarget=N,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=et,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=ct}function cx(i,t){function e(n,s=_n){let r;const a=de.getTransfer(s);if(n===oi)return i.UNSIGNED_BYTE;if(n===Pc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ic)return i.UNSIGNED_SHORT_5_5_5_1;if(n===lf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===cf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===af)return i.BYTE;if(n===of)return i.SHORT;if(n===Fr)return i.UNSIGNED_SHORT;if(n===Cc)return i.INT;if(n===hs)return i.UNSIGNED_INT;if(n===Wn)return i.FLOAT;if(n===li)return i.HALF_FLOAT;if(n===hf)return i.ALPHA;if(n===uf)return i.RGB;if(n===Xn)return i.RGBA;if(n===Or)return i.DEPTH_COMPONENT;if(n===Js)return i.DEPTH_STENCIL;if(n===po)return i.RED;if(n===Lc)return i.RED_INTEGER;if(n===ff)return i.RG;if(n===Dc)return i.RG_INTEGER;if(n===Uc)return i.RGBA_INTEGER;if(n===Va||n===Ga||n===Wa||n===Xa)if(a===xe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Va)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Va)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ga)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Wa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Cl||n===Pl||n===Il||n===Ll)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dl||n===Ul||n===Nl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dl||n===Ul)return a===xe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Nl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Fl||n===Ol||n===zl||n===kl||n===Bl||n===Hl||n===Vl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===$l||n===Zl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Fl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ol)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===zl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===kl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Hl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Vl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Gl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Wl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Xl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ql)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Yl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$l)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Zl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Jl||n===Kl||n===jl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Jl)return a===xe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===jl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ql||n===tc||n===ec||n===nc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ql)return r.COMPRESSED_RED_RGTC1_EXT;if(n===tc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ec)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===nc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Zs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const hx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ux=`
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

}`;class fx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Tf(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new on({vertexShader:hx,fragmentShader:ux,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new qt(new he(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dx extends ir{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,p=null,u=null,m=null;const v=typeof XRWebGLBinding<"u",g=new fx,d={},x=e.getContextAttributes();let y=null,_=null;const E=[],b=[],A=new ut;let T=null;const S=new tn;S.viewport=new Me;const M=new tn;M.viewport=new Me;const R=[S,M],L=new Lp;let P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=E[Y];return tt===void 0&&(tt=new Zo,E[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=E[Y];return tt===void 0&&(tt=new Zo,E[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=E[Y];return tt===void 0&&(tt=new Zo,E[Y]=tt),tt.getHandSpace()};function O(Y){const tt=b.indexOf(Y.inputSource);if(tt===-1)return;const pt=E[tt];pt!==void 0&&(pt.update(Y.inputSource,Y.frame,c||a),pt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function z(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",X);for(let Y=0;Y<E.length;Y++){const tt=b[Y];tt!==null&&(b[Y]=null,E[Y].disconnect(tt))}P=null,F=null,g.reset();for(const Y in d)delete d[Y];t.setRenderTarget(y),u=null,p=null,f=null,s=null,_=null,Gt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(y=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",z),s.addEventListener("inputsourceschange",X),x.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,wt=null,bt=null;x.depth&&(bt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,pt=x.stencil?Js:Or,wt=x.stencil?Zs:hs);const Xt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};f=this.getBinding(),p=f.createProjectionLayer(Xt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),_=new Sn(p.textureWidth,p.textureHeight,{format:Xn,type:oi,depthTexture:new Hc(p.textureWidth,p.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const pt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,pt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),_=new Sn(u.framebufferWidth,u.framebufferHeight,{format:Xn,type:oi,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Gt.setContext(s),Gt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(Y){for(let tt=0;tt<Y.removed.length;tt++){const pt=Y.removed[tt],wt=b.indexOf(pt);wt>=0&&(b[wt]=null,E[wt].disconnect(pt))}for(let tt=0;tt<Y.added.length;tt++){const pt=Y.added[tt];let wt=b.indexOf(pt);if(wt===-1){for(let Xt=0;Xt<E.length;Xt++)if(Xt>=b.length){b.push(pt),wt=Xt;break}else if(b[Xt]===null){b[Xt]=pt,wt=Xt;break}if(wt===-1)break}const bt=E[wt];bt&&bt.connect(pt)}}const H=new D,q=new D;function Q(Y,tt,pt){H.setFromMatrixPosition(tt.matrixWorld),q.setFromMatrixPosition(pt.matrixWorld);const wt=H.distanceTo(q),bt=tt.projectionMatrix.elements,Xt=pt.projectionMatrix.elements,zt=bt[14]/(bt[10]-1),N=bt[14]/(bt[10]+1),st=(bt[9]+1)/bt[5],nt=(bt[9]-1)/bt[5],it=(bt[8]-1)/bt[0],et=(Xt[8]+1)/Xt[0],dt=zt*it,ct=zt*et,_t=wt/(-it+et),$t=_t*-it;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX($t),Y.translateZ(_t),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),bt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Zt=zt+_t,I=N+_t,w=dt-$t,G=ct+(wt-$t),$=st*N/I*Zt,lt=nt*N/I*Zt;Y.projectionMatrix.makePerspective(w,G,$,lt,Zt,I),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function at(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let tt=Y.near,pt=Y.far;g.texture!==null&&(g.depthNear>0&&(tt=g.depthNear),g.depthFar>0&&(pt=g.depthFar)),L.near=M.near=S.near=tt,L.far=M.far=S.far=pt,(P!==L.near||F!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),P=L.near,F=L.far),L.layers.mask=Y.layers.mask|6,S.layers.mask=L.layers.mask&3,M.layers.mask=L.layers.mask&5;const wt=Y.parent,bt=L.cameras;at(L,wt);for(let Xt=0;Xt<bt.length;Xt++)at(bt[Xt],wt);bt.length===2?Q(L,S,M):L.projectionMatrix.copy(S.projectionMatrix),Tt(Y,L,wt)};function Tt(Y,tt,pt){pt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(pt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=zr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(p===null&&u===null))return l},this.setFoveation=function(Y){l=Y,p!==null&&(p.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function(Y){return d[Y]};let It=null;function Ct(Y,tt){if(h=tt.getViewerPose(c||a),m=tt,h!==null){const pt=h.views;u!==null&&(t.setRenderTargetFramebuffer(_,u.framebuffer),t.setRenderTarget(_));let wt=!1;pt.length!==L.cameras.length&&(L.cameras.length=0,wt=!0);for(let N=0;N<pt.length;N++){const st=pt[N];let nt=null;if(u!==null)nt=u.getViewport(st);else{const et=f.getViewSubImage(p,st);nt=et.viewport,N===0&&(t.setRenderTargetTextures(_,et.colorTexture,et.depthStencilTexture),t.setRenderTarget(_))}let it=R[N];it===void 0&&(it=new tn,it.layers.enable(N),it.viewport=new Me,R[N]=it),it.matrix.fromArray(st.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(st.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(nt.x,nt.y,nt.width,nt.height),N===0&&(L.matrix.copy(it.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),wt===!0&&L.cameras.push(it)}const bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=n.getBinding();const N=f.getDepthInformation(pt[0]);N&&N.isValid&&N.texture&&g.init(N,s.renderState)}if(bt&&bt.includes("camera-access")&&v){t.state.unbindTexture(),f=n.getBinding();for(let N=0;N<pt.length;N++){const st=pt[N].camera;if(st){let nt=d[st];nt||(nt=new Tf,d[st]=nt);const it=f.getCameraImage(st);nt.sourceTexture=it}}}}for(let pt=0;pt<E.length;pt++){const wt=b[pt],bt=E[pt];wt!==null&&bt!==void 0&&bt.update(wt,tt,c||a)}It&&It(Y,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),m=null}const Gt=new Of;Gt.setAnimationLoop(Ct),this.setAnimationLoop=function(Y){It=Y},this.dispose=function(){}}}const ji=new Un,px=new ce;function mx(i,t){function e(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function n(g,d){d.color.getRGB(g.fogColor.value,_f(i)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function s(g,d,x,y,_){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(g,d):d.isMeshToonMaterial?(r(g,d),f(g,d)):d.isMeshPhongMaterial?(r(g,d),h(g,d)):d.isMeshStandardMaterial?(r(g,d),p(g,d),d.isMeshPhysicalMaterial&&u(g,d,_)):d.isMeshMatcapMaterial?(r(g,d),m(g,d)):d.isMeshDepthMaterial?r(g,d):d.isMeshDistanceMaterial?(r(g,d),v(g,d)):d.isMeshNormalMaterial?r(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?l(g,d,x,y):d.isSpriteMaterial?c(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,e(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,e(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===en&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,e(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===en&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,e(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,e(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const x=t.get(d),y=x.envMap,_=x.envMapRotation;y&&(g.envMap.value=y,ji.copy(_),ji.x*=-1,ji.y*=-1,ji.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),g.envMapRotation.value.setFromMatrix4(px.makeRotationFromEuler(ji)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,e(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,x,y){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*x,g.scale.value=y*.5,d.map&&(g.map.value=d.map,e(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function c(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,e(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,e(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function h(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function f(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function p(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function u(g,d,x){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===en&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,d){d.matcap&&(g.matcap.value=d.matcap)}function v(g,d){const x=t.get(d).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function gx(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const _=y.program;n.uniformBlockBinding(x,_)}function c(x,y){let _=s[x.id];_===void 0&&(m(x),_=h(x),s[x.id]=_,x.addEventListener("dispose",g));const E=y.program;n.updateUBOMapping(x,E);const b=t.render.frame;r[x.id]!==b&&(p(x),r[x.id]=b)}function h(x){const y=f();x.__bindingPointIndex=y;const _=i.createBuffer(),E=x.__size,b=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,E,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const y=s[x.id],_=x.uniforms,E=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let b=0,A=_.length;b<A;b++){const T=Array.isArray(_[b])?_[b]:[_[b]];for(let S=0,M=T.length;S<M;S++){const R=T[S];if(u(R,b,S,E)===!0){const L=R.__offset,P=Array.isArray(R.value)?R.value:[R.value];let F=0;for(let O=0;O<P.length;O++){const z=P[O],X=v(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,L+F,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,F),F+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,y,_,E){const b=x.value,A=y+"_"+_;if(E[A]===void 0)return typeof b=="number"||typeof b=="boolean"?E[A]=b:E[A]=b.clone(),!0;{const T=E[A];if(typeof b=="number"||typeof b=="boolean"){if(T!==b)return E[A]=b,!0}else if(T.equals(b)===!1)return T.copy(b),!0}return!1}function m(x){const y=x.uniforms;let _=0;const E=16;for(let A=0,T=y.length;A<T;A++){const S=Array.isArray(y[A])?y[A]:[y[A]];for(let M=0,R=S.length;M<R;M++){const L=S[M],P=Array.isArray(L.value)?L.value:[L.value];for(let F=0,O=P.length;F<O;F++){const z=P[F],X=v(z),H=_%E,q=H%X.boundary,Q=H+q;_+=q,Q!==0&&E-Q<X.storage&&(_+=E-Q),L.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=_,_+=X.storage}}}const b=_%E;return b>0&&(_+=E-b),x.__size=_,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const _=a.indexOf(y.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class vx{constructor(t={}){const{canvas:e=f0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,d=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let E=!1;this._outputColorSpace=qe;let b=0,A=0,T=null,S=-1,M=null;const R=new Me,L=new Me;let P=null;const F=new Yt(0);let O=0,z=e.width,X=e.height,H=1,q=null,Q=null;const at=new Me(0,0,z,X),Tt=new Me(0,0,z,X);let It=!1;const Ct=new Bc;let Gt=!1,Y=!1;const tt=new ce,pt=new D,wt=new Me,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function zt(){return T===null?H:1}let N=n;function st(C,V){return e.getContext(C,V)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ec}`),e.addEventListener("webglcontextlost",St,!1),e.addEventListener("webglcontextrestored",Ft,!1),e.addEventListener("webglcontextcreationerror",xt,!1),N===null){const V="webgl2";if(N=st(V,C),N===null)throw st(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let nt,it,et,dt,ct,_t,$t,Zt,I,w,G,$,lt,Z,Lt,gt,kt,yt,ot,vt,Nt,Et,mt,Vt;function k(){nt=new Ag(N),nt.init(),Et=new cx(N,nt),it=new yg(N,nt,t,Et),et=new ox(N,nt),it.reversedDepthBuffer&&p&&et.buffers.depth.setReversed(!0),dt=new Pg(N),ct=new $v,_t=new lx(N,nt,et,ct,it,Et,dt),$t=new Sg(_),Zt=new Eg(_),I=new Fp(N),mt=new xg(N,I),w=new Rg(N,I,dt,mt),G=new Lg(N,w,I,dt),ot=new Ig(N,it,_t),gt=new Mg(ct),$=new Yv(_,$t,Zt,nt,it,mt,gt),lt=new mx(_,ct),Z=new Jv,Lt=new nx(nt),yt=new vg(_,$t,Zt,et,G,u,l),kt=new rx(_,G,it),Vt=new gx(N,dt,it,et),vt=new _g(N,nt,dt),Nt=new Cg(N,nt,dt),dt.programs=$.programs,_.capabilities=it,_.extensions=nt,_.properties=ct,_.renderLists=Z,_.shadowMap=kt,_.state=et,_.info=dt}k();const ft=new dx(_,N);this.xr=ft,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const C=nt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=nt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(C){C!==void 0&&(H=C,this.setSize(z,X,!1))},this.getSize=function(C){return C.set(z,X)},this.setSize=function(C,V,J=!0){if(ft.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,X=V,e.width=Math.floor(C*H),e.height=Math.floor(V*H),J===!0&&(e.style.width=C+"px",e.style.height=V+"px"),this.setViewport(0,0,C,V)},this.getDrawingBufferSize=function(C){return C.set(z*H,X*H).floor()},this.setDrawingBufferSize=function(C,V,J){z=C,X=V,H=J,e.width=Math.floor(C*J),e.height=Math.floor(V*J),this.setViewport(0,0,C,V)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(at)},this.setViewport=function(C,V,J,j){C.isVector4?at.set(C.x,C.y,C.z,C.w):at.set(C,V,J,j),et.viewport(R.copy(at).multiplyScalar(H).round())},this.getScissor=function(C){return C.copy(Tt)},this.setScissor=function(C,V,J,j){C.isVector4?Tt.set(C.x,C.y,C.z,C.w):Tt.set(C,V,J,j),et.scissor(L.copy(Tt).multiplyScalar(H).round())},this.getScissorTest=function(){return It},this.setScissorTest=function(C){et.setScissorTest(It=C)},this.setOpaqueSort=function(C){q=C},this.setTransparentSort=function(C){Q=C},this.getClearColor=function(C){return C.copy(yt.getClearColor())},this.setClearColor=function(){yt.setClearColor(...arguments)},this.getClearAlpha=function(){return yt.getClearAlpha()},this.setClearAlpha=function(){yt.setClearAlpha(...arguments)},this.clear=function(C=!0,V=!0,J=!0){let j=0;if(C){let W=!1;if(T!==null){const Mt=T.texture.format;W=Mt===Uc||Mt===Dc||Mt===Lc}if(W){const Mt=T.texture.type,Ut=Mt===oi||Mt===hs||Mt===Fr||Mt===Zs||Mt===Pc||Mt===Ic,Wt=yt.getClearColor(),Bt=yt.getClearAlpha(),jt=Wt.r,te=Wt.g,Jt=Wt.b;Ut?(m[0]=jt,m[1]=te,m[2]=Jt,m[3]=Bt,N.clearBufferuiv(N.COLOR,0,m)):(v[0]=jt,v[1]=te,v[2]=Jt,v[3]=Bt,N.clearBufferiv(N.COLOR,0,v))}else j|=N.COLOR_BUFFER_BIT}V&&(j|=N.DEPTH_BUFFER_BIT),J&&(j|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",St,!1),e.removeEventListener("webglcontextrestored",Ft,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),yt.dispose(),Z.dispose(),Lt.dispose(),ct.dispose(),$t.dispose(),Zt.dispose(),G.dispose(),mt.dispose(),Vt.dispose(),$.dispose(),ft.dispose(),ft.removeEventListener("sessionstart",bn),ft.removeEventListener("sessionend",ar),fi.stop()};function St(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const C=dt.autoReset,V=kt.enabled,J=kt.autoUpdate,j=kt.needsUpdate,W=kt.type;k(),dt.autoReset=C,kt.enabled=V,kt.autoUpdate=J,kt.needsUpdate=j,kt.type=W}function xt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function rt(C){const V=C.target;V.removeEventListener("dispose",rt),Ht(V)}function Ht(C){Qt(C),ct.remove(C)}function Qt(C){const V=ct.get(C).programs;V!==void 0&&(V.forEach(function(J){$.releaseProgram(J)}),C.isShaderMaterial&&$.releaseShaderCache(C))}this.renderBufferDirect=function(C,V,J,j,W,Mt){V===null&&(V=bt);const Ut=W.isMesh&&W.matrixWorld.determinant()<0,Wt=md(C,V,J,j,W);et.setMaterial(j,Ut);let Bt=J.index,jt=1;if(j.wireframe===!0){if(Bt=w.getWireframeAttribute(J),Bt===void 0)return;jt=2}const te=J.drawRange,Jt=J.attributes.position;let le=te.start*jt,ye=(te.start+te.count)*jt;Mt!==null&&(le=Math.max(le,Mt.start*jt),ye=Math.min(ye,(Mt.start+Mt.count)*jt)),Bt!==null?(le=Math.max(le,0),ye=Math.min(ye,Bt.count)):Jt!=null&&(le=Math.max(le,0),ye=Math.min(ye,Jt.count));const De=ye-le;if(De<0||De===1/0)return;mt.setup(W,j,Wt,J,Bt);let we,Se=vt;if(Bt!==null&&(we=I.get(Bt),Se=Nt,Se.setIndex(we)),W.isMesh)j.wireframe===!0?(et.setLineWidth(j.wireframeLinewidth*zt()),Se.setMode(N.LINES)):Se.setMode(N.TRIANGLES);else if(W.isLine){let Kt=j.linewidth;Kt===void 0&&(Kt=1),et.setLineWidth(Kt*zt()),W.isLineSegments?Se.setMode(N.LINES):W.isLineLoop?Se.setMode(N.LINE_LOOP):Se.setMode(N.LINE_STRIP)}else W.isPoints?Se.setMode(N.POINTS):W.isSprite&&Se.setMode(N.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Br("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))Se.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Kt=W._multiDrawStarts,Ae=W._multiDrawCounts,pe=W._multiDrawCount,dn=Bt?I.get(Bt).bytesPerElement:1,gs=ct.get(j).currentProgram.getUniforms();for(let pn=0;pn<pe;pn++)gs.setValue(N,"_gl_DrawID",pn),Se.render(Kt[pn]/dn,Ae[pn])}else if(W.isInstancedMesh)Se.renderInstances(le,De,W.count);else if(J.isInstancedBufferGeometry){const Kt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ae=Math.min(J.instanceCount,Kt);Se.renderInstances(le,De,Ae)}else Se.render(le,De)};function ve(C,V,J){C.transparent===!0&&C.side===ze&&C.forceSinglePass===!1?(C.side=en,C.needsUpdate=!0,Xi(C,V,J),C.side=Hi,C.needsUpdate=!0,Xi(C,V,J),C.side=ze):Xi(C,V,J)}this.compile=function(C,V,J=null){J===null&&(J=C),d=Lt.get(J),d.init(V),y.push(d),J.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(d.pushLight(W),W.castShadow&&d.pushShadow(W))}),C!==J&&C.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(d.pushLight(W),W.castShadow&&d.pushShadow(W))}),d.setupLights();const j=new Set;return C.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const Mt=W.material;if(Mt)if(Array.isArray(Mt))for(let Ut=0;Ut<Mt.length;Ut++){const Wt=Mt[Ut];ve(Wt,J,W),j.add(Wt)}else ve(Mt,J,W),j.add(Mt)}),d=y.pop(),j},this.compileAsync=function(C,V,J=null){const j=this.compile(C,V,J);return new Promise(W=>{function Mt(){if(j.forEach(function(Ut){ct.get(Ut).currentProgram.isReady()&&j.delete(Ut)}),j.size===0){W(C);return}setTimeout(Mt,10)}nt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let fe=null;function Nn(C){fe&&fe(C)}function bn(){fi.stop()}function ar(){fi.start()}const fi=new Of;fi.setAnimationLoop(Nn),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(C){fe=C,ft.setAnimationLoop(C),C===null?fi.stop():fi.start()},ft.addEventListener("sessionstart",bn),ft.addEventListener("sessionend",ar),this.render=function(C,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),ft.enabled===!0&&ft.isPresenting===!0&&(ft.cameraAutoUpdate===!0&&ft.updateCamera(V),V=ft.getCamera()),C.isScene===!0&&C.onBeforeRender(_,C,V,T),d=Lt.get(C,y.length),d.init(V),y.push(d),tt.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Ct.setFromProjectionMatrix(tt,ni,V.reversedDepth),Y=this.localClippingEnabled,Gt=gt.init(this.clippingPlanes,Y),g=Z.get(C,x.length),g.init(),x.push(g),ft.enabled===!0&&ft.isPresenting===!0){const Mt=_.xr.getDepthSensingMesh();Mt!==null&&or(Mt,V,-1/0,_.sortObjects)}or(C,V,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(q,Q),Xt=ft.enabled===!1||ft.isPresenting===!1||ft.hasDepthSensing()===!1,Xt&&yt.addToRenderList(g,C),this.info.render.frame++,Gt===!0&&gt.beginShadows();const J=d.state.shadowsArray;kt.render(J,C,V),Gt===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=g.opaque,W=g.transmissive;if(d.setupLights(),V.isArrayCamera){const Mt=V.cameras;if(W.length>0)for(let Ut=0,Wt=Mt.length;Ut<Wt;Ut++){const Bt=Mt[Ut];Kr(j,W,C,Bt)}Xt&&yt.render(C);for(let Ut=0,Wt=Mt.length;Ut<Wt;Ut++){const Bt=Mt[Ut];Jr(g,C,Bt,Bt.viewport)}}else W.length>0&&Kr(j,W,C,V),Xt&&yt.render(C),Jr(g,C,V);T!==null&&A===0&&(_t.updateMultisampleRenderTarget(T),_t.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(_,C,V),mt.resetDefaultState(),S=-1,M=null,y.pop(),y.length>0?(d=y[y.length-1],Gt===!0&&gt.setGlobalState(_.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function or(C,V,J,j){if(C.visible===!1)return;if(C.layers.test(V.layers)){if(C.isGroup)J=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(V);else if(C.isLight)d.pushLight(C),C.castShadow&&d.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Ct.intersectsSprite(C)){j&&wt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(tt);const Ut=G.update(C),Wt=C.material;Wt.visible&&g.push(C,Ut,Wt,J,wt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Ct.intersectsObject(C))){const Ut=G.update(C),Wt=C.material;if(j&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),wt.copy(C.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),wt.copy(Ut.boundingSphere.center)),wt.applyMatrix4(C.matrixWorld).applyMatrix4(tt)),Array.isArray(Wt)){const Bt=Ut.groups;for(let jt=0,te=Bt.length;jt<te;jt++){const Jt=Bt[jt],le=Wt[Jt.materialIndex];le&&le.visible&&g.push(C,Ut,le,J,wt.z,Jt)}}else Wt.visible&&g.push(C,Ut,Wt,J,wt.z,null)}}const Mt=C.children;for(let Ut=0,Wt=Mt.length;Ut<Wt;Ut++)or(Mt[Ut],V,J,j)}function Jr(C,V,J,j){const W=C.opaque,Mt=C.transmissive,Ut=C.transparent;d.setupLightsView(J),Gt===!0&&gt.setGlobalState(_.clippingPlanes,J),j&&et.viewport(R.copy(j)),W.length>0&&Fn(W,V,J),Mt.length>0&&Fn(Mt,V,J),Ut.length>0&&Fn(Ut,V,J),et.buffers.depth.setTest(!0),et.buffers.depth.setMask(!0),et.buffers.color.setMask(!0),et.setPolygonOffset(!1)}function Kr(C,V,J,j){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[j.id]===void 0&&(d.state.transmissionRenderTarget[j.id]=new Sn(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?li:oi,minFilter:os,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const Mt=d.state.transmissionRenderTarget[j.id],Ut=j.viewport||R;Mt.setSize(Ut.z*_.transmissionResolutionScale,Ut.w*_.transmissionResolutionScale);const Wt=_.getRenderTarget(),Bt=_.getActiveCubeFace(),jt=_.getActiveMipmapLevel();_.setRenderTarget(Mt),_.getClearColor(F),O=_.getClearAlpha(),O<1&&_.setClearColor(16777215,.5),_.clear(),Xt&&yt.render(J);const te=_.toneMapping;_.toneMapping=ki;const Jt=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),d.setupLightsView(j),Gt===!0&&gt.setGlobalState(_.clippingPlanes,j),Fn(C,J,j),_t.updateMultisampleRenderTarget(Mt),_t.updateRenderTargetMipmap(Mt),nt.has("WEBGL_multisampled_render_to_texture")===!1){let le=!1;for(let ye=0,De=V.length;ye<De;ye++){const we=V[ye],Se=we.object,Kt=we.geometry,Ae=we.material,pe=we.group;if(Ae.side===ze&&Se.layers.test(j.layers)){const dn=Ae.side;Ae.side=en,Ae.needsUpdate=!0,di(Se,J,j,Kt,Ae,pe),Ae.side=dn,Ae.needsUpdate=!0,le=!0}}le===!0&&(_t.updateMultisampleRenderTarget(Mt),_t.updateRenderTargetMipmap(Mt))}_.setRenderTarget(Wt,Bt,jt),_.setClearColor(F,O),Jt!==void 0&&(j.viewport=Jt),_.toneMapping=te}function Fn(C,V,J){const j=V.isScene===!0?V.overrideMaterial:null;for(let W=0,Mt=C.length;W<Mt;W++){const Ut=C[W],Wt=Ut.object,Bt=Ut.geometry,jt=Ut.group;let te=Ut.material;te.allowOverride===!0&&j!==null&&(te=j),Wt.layers.test(J.layers)&&di(Wt,V,J,Bt,te,jt)}}function di(C,V,J,j,W,Mt){C.onBeforeRender(_,V,J,j,W,Mt),C.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),W.onBeforeRender(_,V,J,j,C,Mt),W.transparent===!0&&W.side===ze&&W.forceSinglePass===!1?(W.side=en,W.needsUpdate=!0,_.renderBufferDirect(J,V,j,W,C,Mt),W.side=Hi,W.needsUpdate=!0,_.renderBufferDirect(J,V,j,W,C,Mt),W.side=ze):_.renderBufferDirect(J,V,j,W,C,Mt),C.onAfterRender(_,V,J,j,W,Mt)}function Xi(C,V,J){V.isScene!==!0&&(V=bt);const j=ct.get(C),W=d.state.lights,Mt=d.state.shadowsArray,Ut=W.state.version,Wt=$.getParameters(C,W.state,Mt,V,J),Bt=$.getProgramCacheKey(Wt);let jt=j.programs;j.environment=C.isMeshStandardMaterial?V.environment:null,j.fog=V.fog,j.envMap=(C.isMeshStandardMaterial?Zt:$t).get(C.envMap||j.environment),j.envMapRotation=j.environment!==null&&C.envMap===null?V.environmentRotation:C.envMapRotation,jt===void 0&&(C.addEventListener("dispose",rt),jt=new Map,j.programs=jt);let te=jt.get(Bt);if(te!==void 0){if(j.currentProgram===te&&j.lightsStateVersion===Ut)return th(C,Wt),te}else Wt.uniforms=$.getUniforms(C),C.onBeforeCompile(Wt,_),te=$.acquireProgram(Wt,Bt),jt.set(Bt,te),j.uniforms=Wt.uniforms;const Jt=j.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Jt.clippingPlanes=gt.uniform),th(C,Wt),j.needsLights=vd(C),j.lightsStateVersion=Ut,j.needsLights&&(Jt.ambientLightColor.value=W.state.ambient,Jt.lightProbe.value=W.state.probe,Jt.directionalLights.value=W.state.directional,Jt.directionalLightShadows.value=W.state.directionalShadow,Jt.spotLights.value=W.state.spot,Jt.spotLightShadows.value=W.state.spotShadow,Jt.rectAreaLights.value=W.state.rectArea,Jt.ltc_1.value=W.state.rectAreaLTC1,Jt.ltc_2.value=W.state.rectAreaLTC2,Jt.pointLights.value=W.state.point,Jt.pointLightShadows.value=W.state.pointShadow,Jt.hemisphereLights.value=W.state.hemi,Jt.directionalShadowMap.value=W.state.directionalShadowMap,Jt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Jt.spotShadowMap.value=W.state.spotShadowMap,Jt.spotLightMatrix.value=W.state.spotLightMatrix,Jt.spotLightMap.value=W.state.spotLightMap,Jt.pointShadowMap.value=W.state.pointShadowMap,Jt.pointShadowMatrix.value=W.state.pointShadowMatrix),j.currentProgram=te,j.uniformsList=null,te}function lr(C){if(C.uniformsList===null){const V=C.currentProgram.getUniforms();C.uniformsList=qa.seqWithValue(V.seq,C.uniforms)}return C.uniformsList}function th(C,V){const J=ct.get(C);J.outputColorSpace=V.outputColorSpace,J.batching=V.batching,J.batchingColor=V.batchingColor,J.instancing=V.instancing,J.instancingColor=V.instancingColor,J.instancingMorph=V.instancingMorph,J.skinning=V.skinning,J.morphTargets=V.morphTargets,J.morphNormals=V.morphNormals,J.morphColors=V.morphColors,J.morphTargetsCount=V.morphTargetsCount,J.numClippingPlanes=V.numClippingPlanes,J.numIntersection=V.numClipIntersection,J.vertexAlphas=V.vertexAlphas,J.vertexTangents=V.vertexTangents,J.toneMapping=V.toneMapping}function md(C,V,J,j,W){V.isScene!==!0&&(V=bt),_t.resetTextureUnits();const Mt=V.fog,Ut=j.isMeshStandardMaterial?V.environment:null,Wt=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ks,Bt=(j.isMeshStandardMaterial?Zt:$t).get(j.envMap||Ut),jt=j.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,te=!!J.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Jt=!!J.morphAttributes.position,le=!!J.morphAttributes.normal,ye=!!J.morphAttributes.color;let De=ki;j.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(De=_.toneMapping);const we=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Se=we!==void 0?we.length:0,Kt=ct.get(j),Ae=d.state.lights;if(Gt===!0&&(Y===!0||C!==M)){const nn=C===M&&j.id===S;gt.setState(j,C,nn)}let pe=!1;j.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==Ae.state.version||Kt.outputColorSpace!==Wt||W.isBatchedMesh&&Kt.batching===!1||!W.isBatchedMesh&&Kt.batching===!0||W.isBatchedMesh&&Kt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Kt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Kt.instancing===!1||!W.isInstancedMesh&&Kt.instancing===!0||W.isSkinnedMesh&&Kt.skinning===!1||!W.isSkinnedMesh&&Kt.skinning===!0||W.isInstancedMesh&&Kt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Kt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Kt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Kt.instancingMorph===!1&&W.morphTexture!==null||Kt.envMap!==Bt||j.fog===!0&&Kt.fog!==Mt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==gt.numPlanes||Kt.numIntersection!==gt.numIntersection)||Kt.vertexAlphas!==jt||Kt.vertexTangents!==te||Kt.morphTargets!==Jt||Kt.morphNormals!==le||Kt.morphColors!==ye||Kt.toneMapping!==De||Kt.morphTargetsCount!==Se)&&(pe=!0):(pe=!0,Kt.__version=j.version);let dn=Kt.currentProgram;pe===!0&&(dn=Xi(j,V,W));let gs=!1,pn=!1,cr=!1;const Re=dn.getUniforms(),wn=Kt.uniforms;if(et.useProgram(dn.program)&&(gs=!0,pn=!0,cr=!0),j.id!==S&&(S=j.id,pn=!0),gs||M!==C){et.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Re.setValue(N,"projectionMatrix",C.projectionMatrix),Re.setValue(N,"viewMatrix",C.matrixWorldInverse);const hn=Re.map.cameraPosition;hn!==void 0&&hn.setValue(N,pt.setFromMatrixPosition(C.matrixWorld)),it.logarithmicDepthBuffer&&Re.setValue(N,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Re.setValue(N,"isOrthographic",C.isOrthographicCamera===!0),M!==C&&(M=C,pn=!0,cr=!0)}if(W.isSkinnedMesh){Re.setOptional(N,W,"bindMatrix"),Re.setOptional(N,W,"bindMatrixInverse");const nn=W.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),Re.setValue(N,"boneTexture",nn.boneTexture,_t))}W.isBatchedMesh&&(Re.setOptional(N,W,"batchingTexture"),Re.setValue(N,"batchingTexture",W._matricesTexture,_t),Re.setOptional(N,W,"batchingIdTexture"),Re.setValue(N,"batchingIdTexture",W._indirectTexture,_t),Re.setOptional(N,W,"batchingColorTexture"),W._colorsTexture!==null&&Re.setValue(N,"batchingColorTexture",W._colorsTexture,_t));const Tn=J.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&ot.update(W,J,dn),(pn||Kt.receiveShadow!==W.receiveShadow)&&(Kt.receiveShadow=W.receiveShadow,Re.setValue(N,"receiveShadow",W.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(wn.envMap.value=Bt,wn.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&V.environment!==null&&(wn.envMapIntensity.value=V.environmentIntensity),pn&&(Re.setValue(N,"toneMappingExposure",_.toneMappingExposure),Kt.needsLights&&gd(wn,cr),Mt&&j.fog===!0&&lt.refreshFogUniforms(wn,Mt),lt.refreshMaterialUniforms(wn,j,H,X,d.state.transmissionRenderTarget[C.id]),qa.upload(N,lr(Kt),wn,_t)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(qa.upload(N,lr(Kt),wn,_t),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Re.setValue(N,"center",W.center),Re.setValue(N,"modelViewMatrix",W.modelViewMatrix),Re.setValue(N,"normalMatrix",W.normalMatrix),Re.setValue(N,"modelMatrix",W.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const nn=j.uniformsGroups;for(let hn=0,Ao=nn.length;hn<Ao;hn++){const qi=nn[hn];Vt.update(qi,dn),Vt.bind(qi,dn)}}return dn}function gd(C,V){C.ambientLightColor.needsUpdate=V,C.lightProbe.needsUpdate=V,C.directionalLights.needsUpdate=V,C.directionalLightShadows.needsUpdate=V,C.pointLights.needsUpdate=V,C.pointLightShadows.needsUpdate=V,C.spotLights.needsUpdate=V,C.spotLightShadows.needsUpdate=V,C.rectAreaLights.needsUpdate=V,C.hemisphereLights.needsUpdate=V}function vd(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,V,J){const j=ct.get(C);j.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),ct.get(C.texture).__webglTexture=V,ct.get(C.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:J,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,V){const J=ct.get(C);J.__webglFramebuffer=V,J.__useDefaultFramebuffer=V===void 0};const xd=N.createFramebuffer();this.setRenderTarget=function(C,V=0,J=0){T=C,b=V,A=J;let j=!0,W=null,Mt=!1,Ut=!1;if(C){const Bt=ct.get(C);if(Bt.__useDefaultFramebuffer!==void 0)et.bindFramebuffer(N.FRAMEBUFFER,null),j=!1;else if(Bt.__webglFramebuffer===void 0)_t.setupRenderTarget(C);else if(Bt.__hasExternalTextures)_t.rebindTextures(C,ct.get(C.texture).__webglTexture,ct.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Jt=C.depthTexture;if(Bt.__boundDepthTexture!==Jt){if(Jt!==null&&ct.has(Jt)&&(C.width!==Jt.image.width||C.height!==Jt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_t.setupDepthRenderbuffer(C)}}const jt=C.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Ut=!0);const te=ct.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(te[V])?W=te[V][J]:W=te[V],Mt=!0):C.samples>0&&_t.useMultisampledRTT(C)===!1?W=ct.get(C).__webglMultisampledFramebuffer:Array.isArray(te)?W=te[J]:W=te,R.copy(C.viewport),L.copy(C.scissor),P=C.scissorTest}else R.copy(at).multiplyScalar(H).floor(),L.copy(Tt).multiplyScalar(H).floor(),P=It;if(J!==0&&(W=xd),et.bindFramebuffer(N.FRAMEBUFFER,W)&&j&&et.drawBuffers(C,W),et.viewport(R),et.scissor(L),et.setScissorTest(P),Mt){const Bt=ct.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+V,Bt.__webglTexture,J)}else if(Ut){const Bt=V;for(let jt=0;jt<C.textures.length;jt++){const te=ct.get(C.textures[jt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+jt,te.__webglTexture,J,Bt)}}else if(C!==null&&J!==0){const Bt=ct.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Bt.__webglTexture,J)}S=-1},this.readRenderTargetPixels=function(C,V,J,j,W,Mt,Ut,Wt=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Bt=ct.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ut!==void 0&&(Bt=Bt[Ut]),Bt){et.bindFramebuffer(N.FRAMEBUFFER,Bt);try{const jt=C.textures[Wt],te=jt.format,Jt=jt.type;if(!it.textureFormatReadable(te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=C.width-j&&J>=0&&J<=C.height-W&&(C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Wt),N.readPixels(V,J,j,W,Et.convert(te),Et.convert(Jt),Mt))}finally{const jt=T!==null?ct.get(T).__webglFramebuffer:null;et.bindFramebuffer(N.FRAMEBUFFER,jt)}}},this.readRenderTargetPixelsAsync=async function(C,V,J,j,W,Mt,Ut,Wt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Bt=ct.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ut!==void 0&&(Bt=Bt[Ut]),Bt)if(V>=0&&V<=C.width-j&&J>=0&&J<=C.height-W){et.bindFramebuffer(N.FRAMEBUFFER,Bt);const jt=C.textures[Wt],te=jt.format,Jt=jt.type;if(!it.textureFormatReadable(te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const le=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,le),N.bufferData(N.PIXEL_PACK_BUFFER,Mt.byteLength,N.STREAM_READ),C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Wt),N.readPixels(V,J,j,W,Et.convert(te),Et.convert(Jt),0);const ye=T!==null?ct.get(T).__webglFramebuffer:null;et.bindFramebuffer(N.FRAMEBUFFER,ye);const De=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await d0(N,De,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,le),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Mt),N.deleteBuffer(le),N.deleteSync(De),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,V=null,J=0){const j=Math.pow(2,-J),W=Math.floor(C.image.width*j),Mt=Math.floor(C.image.height*j),Ut=V!==null?V.x:0,Wt=V!==null?V.y:0;_t.setTexture2D(C,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,Ut,Wt,W,Mt),et.unbindTexture()};const _d=N.createFramebuffer(),yd=N.createFramebuffer();this.copyTextureToTexture=function(C,V,J=null,j=null,W=0,Mt=null){Mt===null&&(W!==0?(Br("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Mt=W,W=0):Mt=0);let Ut,Wt,Bt,jt,te,Jt,le,ye,De;const we=C.isCompressedTexture?C.mipmaps[Mt]:C.image;if(J!==null)Ut=J.max.x-J.min.x,Wt=J.max.y-J.min.y,Bt=J.isBox3?J.max.z-J.min.z:1,jt=J.min.x,te=J.min.y,Jt=J.isBox3?J.min.z:0;else{const Tn=Math.pow(2,-W);Ut=Math.floor(we.width*Tn),Wt=Math.floor(we.height*Tn),C.isDataArrayTexture?Bt=we.depth:C.isData3DTexture?Bt=Math.floor(we.depth*Tn):Bt=1,jt=0,te=0,Jt=0}j!==null?(le=j.x,ye=j.y,De=j.z):(le=0,ye=0,De=0);const Se=Et.convert(V.format),Kt=Et.convert(V.type);let Ae;V.isData3DTexture?(_t.setTexture3D(V,0),Ae=N.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(_t.setTexture2DArray(V,0),Ae=N.TEXTURE_2D_ARRAY):(_t.setTexture2D(V,0),Ae=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,V.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,V.unpackAlignment);const pe=N.getParameter(N.UNPACK_ROW_LENGTH),dn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),gs=N.getParameter(N.UNPACK_SKIP_PIXELS),pn=N.getParameter(N.UNPACK_SKIP_ROWS),cr=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,we.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,we.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,jt),N.pixelStorei(N.UNPACK_SKIP_ROWS,te),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Jt);const Re=C.isDataArrayTexture||C.isData3DTexture,wn=V.isDataArrayTexture||V.isData3DTexture;if(C.isDepthTexture){const Tn=ct.get(C),nn=ct.get(V),hn=ct.get(Tn.__renderTarget),Ao=ct.get(nn.__renderTarget);et.bindFramebuffer(N.READ_FRAMEBUFFER,hn.__webglFramebuffer),et.bindFramebuffer(N.DRAW_FRAMEBUFFER,Ao.__webglFramebuffer);for(let qi=0;qi<Bt;qi++)Re&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ct.get(C).__webglTexture,W,Jt+qi),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ct.get(V).__webglTexture,Mt,De+qi)),N.blitFramebuffer(jt,te,Ut,Wt,le,ye,Ut,Wt,N.DEPTH_BUFFER_BIT,N.NEAREST);et.bindFramebuffer(N.READ_FRAMEBUFFER,null),et.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(W!==0||C.isRenderTargetTexture||ct.has(C)){const Tn=ct.get(C),nn=ct.get(V);et.bindFramebuffer(N.READ_FRAMEBUFFER,_d),et.bindFramebuffer(N.DRAW_FRAMEBUFFER,yd);for(let hn=0;hn<Bt;hn++)Re?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Tn.__webglTexture,W,Jt+hn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Tn.__webglTexture,W),wn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,nn.__webglTexture,Mt,De+hn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,nn.__webglTexture,Mt),W!==0?N.blitFramebuffer(jt,te,Ut,Wt,le,ye,Ut,Wt,N.COLOR_BUFFER_BIT,N.NEAREST):wn?N.copyTexSubImage3D(Ae,Mt,le,ye,De+hn,jt,te,Ut,Wt):N.copyTexSubImage2D(Ae,Mt,le,ye,jt,te,Ut,Wt);et.bindFramebuffer(N.READ_FRAMEBUFFER,null),et.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else wn?C.isDataTexture||C.isData3DTexture?N.texSubImage3D(Ae,Mt,le,ye,De,Ut,Wt,Bt,Se,Kt,we.data):V.isCompressedArrayTexture?N.compressedTexSubImage3D(Ae,Mt,le,ye,De,Ut,Wt,Bt,Se,we.data):N.texSubImage3D(Ae,Mt,le,ye,De,Ut,Wt,Bt,Se,Kt,we):C.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Mt,le,ye,Ut,Wt,Se,Kt,we.data):C.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Mt,le,ye,we.width,we.height,Se,we.data):N.texSubImage2D(N.TEXTURE_2D,Mt,le,ye,Ut,Wt,Se,Kt,we);N.pixelStorei(N.UNPACK_ROW_LENGTH,pe),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,dn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,gs),N.pixelStorei(N.UNPACK_SKIP_ROWS,pn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,cr),Mt===0&&V.generateMipmaps&&N.generateMipmap(Ae),et.unbindTexture()},this.initRenderTarget=function(C){ct.get(C).__webglFramebuffer===void 0&&_t.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?_t.setTextureCube(C,0):C.isData3DTexture?_t.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?_t.setTexture2DArray(C,0):_t.setTexture2D(C,0),et.unbindTexture()},this.resetState=function(){b=0,A=0,T=null,et.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}const xx=.85,hl=i=>i*i*(3-2*i);function fu(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=hl(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*hl(e),veil:.82+.14*hl(Math.min(1,e/.5)),ready:e===1}}const Vf=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function Gf(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class rr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const _x=new qc(-1,1,1,-1,0,1);class yx extends Le{constructor(){super(),this.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oe([0,2,0,0,2,0],2))}}const Mx=new yx;class $c{constructor(t){this._mesh=new qt(Mx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,_x)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const Pa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Wf extends rr{constructor(){super(),this.uniforms=ls.clone(Pa.uniforms),this.material=new Sp({name:Pa.name,uniforms:this.uniforms,vertexShader:Pa.vertexShader,fragmentShader:Pa.fragmentShader}),this._fsQuad=new $c(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},de.getTransfer(this._outputColorSpace)===xe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ju?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Qu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===tf?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Rc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===nf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===sf?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ef&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const jn={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},no={min:.85,max:1.35};function Sx(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function du(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,f=t.height*c*.5,p=Math.max(i.x,.001),u=Math.max(i.y,.001),m=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,v=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(p+m*i.z/s),f/(u+v*i.z/s))}function bx(i,t){if(!jn[i])throw Error("unknown item");if(t==="front")return[...jn[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(jn[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=jn[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class wx extends sc{constructor(){super();const t=new $n;t.deleteAttribute("uv");const e=new Dt({side:en}),n=new Dt,s=new eo(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new qt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new k0(t,n,6),o=new ke;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new qt(t,Os(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new qt(t,Os(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new qt(t,Os(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new qt(t,Os(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new qt(t,Os(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const u=new qt(t,Os(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Os(i){return new wp({color:0,emissive:16777215,emissiveIntensity:i})}function Xf(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Le;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let p=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in f.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(f.attributes[u]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in f.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(f.morphAttributes[u])}if(t){let u;if(e)u=f.index.count;else if(f.attributes.position!==void 0)u=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(e){let h=0;const f=[];for(let p=0;p<i.length;++p){const u=i[p].index;for(let m=0;m<u.count;++m)f.push(u.getX(m)+h);h+=i[p].attributes.position.count}l.setIndex(f)}for(const h in r){const f=pu(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<f;++p){const u=[];for(let v=0;v<a[h].length;++v)u.push(a[h][v][p]);const m=pu(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function pu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Be(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let p=0,u=h.count;p<u;p++)for(let m=0;m<e;m++){const v=h.getComponent(p,m);o.setComponent(p+f,m,v)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function ui(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function ue(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,ui(),e);const s=new W0(n);return s.colorSpace=qe,s.anisotropy=8,s}function dc(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return ue((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function cn(i,t,e,n=ui(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function Mo(i){const t=ue((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=Vi,t}const qf=Mo("paper"),Yf=Mo("leather"),wr=Mo("metal"),mu=Mo("cloth"),Tr=wr.clone();Tr.colorSpace=_n;const pc=Yf.clone();pc.colorSpace=_n;const Ya=qf.clone();Ya.colorSpace=_n;const Tx=ue((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),U={black:new Dt({color:1646879,roughness:.42,metalness:.38,map:wr,bumpMap:Tr,bumpScale:.004}),leather:new Dt({color:6712935,map:Yf,roughness:.78,bumpMap:pc,bumpScale:.01}),silver:new Dt({color:12239550,map:wr,roughnessMap:Tr,roughness:.35,metalness:.93,bumpMap:Tr,bumpScale:.003}),gold:new Dt({color:12427627,map:wr,roughness:.29,metalness:.88,bumpMap:Tr,bumpScale:.003}),bronze:new Dt({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new Hs({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:Ya,bumpScale:4e-4}),blue:new Hs({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new Hs({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new Dt({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new Hs({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new Dt({color:14799534,map:qf,roughness:.96,bumpMap:Ya,bumpScale:.006,side:ze}),red:new Dt({color:7152936,map:mu,roughness:.82,bumpMap:mu,bumpScale:.009}),rust:new Dt({map:Tx,roughness:.92,metalness:.08,bumpMap:Ya,bumpScale:.022}),rubber:new Dt({color:1383192,roughness:.88,bumpMap:pc,bumpScale:.008}),copper:new Dt({color:12089158,map:wr,roughness:.37,metalness:.9})},ul=new Map;let $f=[];function $a(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(ul.has(n))return ul.get(n);let s;$f.push(new Promise(a=>s=a));const r=new Nf().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?_n:qe,r.wrapS=r.wrapT=Vi,r.repeat.set(...t),r.anisotropy=8,ul.set(n,r),r}function Ex(){return Promise.all($f)}function gu(i,t=[1,1]){return{map:$a(`${i}.jpg`,{repeat:t}),normalMap:$a(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:$a(`${i}-roughness.png`,{repeat:t,data:!0})}}function Zf(){return ue((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const Za={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ax extends rr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof on?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ls.clone(t.uniforms),this.material=new on({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new $c(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class vu extends rr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Rx extends rr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Cx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ut);this._width=n.width,this._height=n.height,e=new Sn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:li}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ax(Za),this.copyPass.material.blending=an,this.clock=new Dp}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}vu!==void 0&&(a instanceof vu?n=!0:a instanceof Rx&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ut);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Px extends rr{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Yt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class Ix{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,f=(l+c)*h,p=l-f,u=c-f,m=t-p,v=e-u;let g,d;m>v?(g=1,d=0):(g=0,d=1);const x=m-g+h,y=v-d+h,_=m-1+2*h,E=v-1+2*h,b=l&255,A=c&255,T=this.perm[b+this.perm[A]]%12,S=this.perm[b+g+this.perm[A+d]]%12,M=this.perm[b+1+this.perm[A+1]]%12;let R=.5-m*m-v*v;R<0?n=0:(R*=R,n=R*R*this._dot(this.grad3[T],m,v));let L=.5-x*x-y*y;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[S],x,y));let P=.5-_*_-E*E;return P<0?r=0:(P*=P,r=P*P*this._dot(this.grad3[M],_,E)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),f=Math.floor(e+c),p=Math.floor(n+c),u=1/6,m=(h+f+p)*u,v=h-m,g=f-m,d=p-m,x=t-v,y=e-g,_=n-d;let E,b,A,T,S,M;x>=y?y>=_?(E=1,b=0,A=0,T=1,S=1,M=0):x>=_?(E=1,b=0,A=0,T=1,S=0,M=1):(E=0,b=0,A=1,T=1,S=0,M=1):y<_?(E=0,b=0,A=1,T=0,S=1,M=1):x<_?(E=0,b=1,A=0,T=0,S=1,M=1):(E=0,b=1,A=0,T=1,S=1,M=0);const R=x-E+u,L=y-b+u,P=_-A+u,F=x-T+2*u,O=y-S+2*u,z=_-M+2*u,X=x-1+3*u,H=y-1+3*u,q=_-1+3*u,Q=h&255,at=f&255,Tt=p&255,It=this.perm[Q+this.perm[at+this.perm[Tt]]]%12,Ct=this.perm[Q+E+this.perm[at+b+this.perm[Tt+A]]]%12,Gt=this.perm[Q+T+this.perm[at+S+this.perm[Tt+M]]]%12,Y=this.perm[Q+1+this.perm[at+1+this.perm[Tt+1]]]%12;let tt=.6-x*x-y*y-_*_;tt<0?s=0:(tt*=tt,s=tt*tt*this._dot3(this.grad3[It],x,y,_));let pt=.6-R*R-L*L-P*P;pt<0?r=0:(pt*=pt,r=pt*pt*this._dot3(this.grad3[Ct],R,L,P));let wt=.6-F*F-O*O-z*z;wt<0?a=0:(wt*=wt,a=wt*wt*this._dot3(this.grad3[Gt],F,O,z));let bt=.6-X*X-H*H-q*q;return bt<0?o=0:(bt*=bt,o=bt*bt*this._dot3(this.grad3[Y],X,H,q)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,f,p,u,m;const v=(t+e+n+s)*l,g=Math.floor(t+v),d=Math.floor(e+v),x=Math.floor(n+v),y=Math.floor(s+v),_=(g+d+x+y)*c,E=g-_,b=d-_,A=x-_,T=y-_,S=t-E,M=e-b,R=n-A,L=s-T,P=S>M?32:0,F=S>R?16:0,O=M>R?8:0,z=S>L?4:0,X=M>L?2:0,H=R>L?1:0,q=P+F+O+z+X+H,Q=a[q][0]>=3?1:0,at=a[q][1]>=3?1:0,Tt=a[q][2]>=3?1:0,It=a[q][3]>=3?1:0,Ct=a[q][0]>=2?1:0,Gt=a[q][1]>=2?1:0,Y=a[q][2]>=2?1:0,tt=a[q][3]>=2?1:0,pt=a[q][0]>=1?1:0,wt=a[q][1]>=1?1:0,bt=a[q][2]>=1?1:0,Xt=a[q][3]>=1?1:0,zt=S-Q+c,N=M-at+c,st=R-Tt+c,nt=L-It+c,it=S-Ct+2*c,et=M-Gt+2*c,dt=R-Y+2*c,ct=L-tt+2*c,_t=S-pt+3*c,$t=M-wt+3*c,Zt=R-bt+3*c,I=L-Xt+3*c,w=S-1+4*c,G=M-1+4*c,$=R-1+4*c,lt=L-1+4*c,Z=g&255,Lt=d&255,gt=x&255,kt=y&255,yt=o[Z+o[Lt+o[gt+o[kt]]]]%32,ot=o[Z+Q+o[Lt+at+o[gt+Tt+o[kt+It]]]]%32,vt=o[Z+Ct+o[Lt+Gt+o[gt+Y+o[kt+tt]]]]%32,Nt=o[Z+pt+o[Lt+wt+o[gt+bt+o[kt+Xt]]]]%32,Et=o[Z+1+o[Lt+1+o[gt+1+o[kt+1]]]]%32;let mt=.6-S*S-M*M-R*R-L*L;mt<0?h=0:(mt*=mt,h=mt*mt*this._dot4(r[yt],S,M,R,L));let Vt=.6-zt*zt-N*N-st*st-nt*nt;Vt<0?f=0:(Vt*=Vt,f=Vt*Vt*this._dot4(r[ot],zt,N,st,nt));let k=.6-it*it-et*et-dt*dt-ct*ct;k<0?p=0:(k*=k,p=k*k*this._dot4(r[vt],it,et,dt,ct));let ft=.6-_t*_t-$t*$t-Zt*Zt-I*I;ft<0?u=0:(ft*=ft,u=ft*ft*this._dot4(r[Nt],_t,$t,Zt,I));let St=.6-w*w-G*G-$*$-lt*lt;return St<0?m=0:(St*=St,m=St*St*this._dot4(r[Et],w,G,$,lt)),27*(h+f+p+u+m)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const Ia={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new ut},cameraProjectionMatrix:{value:new ce},cameraInverseProjectionMatrix:{value:new ce},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

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

		}`},La={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

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

		}`},Da={uniforms:{tDiffuse:{value:null},resolution:{value:new ut}},vertexShader:`varying vec2 vUv;

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

		}`};class Oi extends rr{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new Hc;a.format=Js,a.type=Zs,this.normalRenderTarget=new Sn(this.width,this.height,{minFilter:ln,magFilter:ln,type:li,depthTexture:a}),this.ssaoRenderTarget=new Sn(this.width,this.height,{type:li}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new on({defines:Object.assign({},Ia.defines),uniforms:ls.clone(Ia.uniforms),vertexShader:Ia.vertexShader,fragmentShader:Ia.fragmentShader,blending:an}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new bp,this.normalMaterial.blending=an,this.blurMaterial=new on({defines:Object.assign({},Da.defines),uniforms:ls.clone(Da.uniforms),vertexShader:Da.vertexShader,fragmentShader:Da.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new on({defines:Object.assign({},La.defines),uniforms:ls.clone(La.uniforms),vertexShader:La.vertexShader,fragmentShader:La.fragmentShader,blending:an}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new on({uniforms:ls.clone(Za.uniforms),vertexShader:Za.vertexShader,fragmentShader:Za.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Ku,blendDst:gl,blendEquation:Ti,blendSrcAlpha:Ju,blendDstAlpha:gl,blendEquationAlpha:Ti}),this._fsQuad=new $c(null),this._originalClearColor=new Yt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case Oi.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=an,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Oi.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=an,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Oi.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case Oi.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=an,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Oi.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Zu,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new D;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=me.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new Ix,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new bf(r,4,4,po,Wn),this.noiseTexture.wrapS=Vi,this.noiseTexture.wrapT=Vi,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}Oi.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class Lx extends Oi{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class Dx{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new Sn(1,1,{type:li,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new Cx(t,r),this.composer.addPass(new Px(e,n)),this.ao=new Lx(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new Wf),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function Ux(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const yr=new D;function An(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;yr.copy(t),yr[n]=0,yr.normalize();const c=.5*a/(a+o),h=1-yr.angleTo(i)/l;return Math.sign(yr[e])===1?h*c:o/(a+o)+c+c*(1-h)}class Zc extends $n{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new D,c=new D,h=new D(t,e,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,p=this.attributes.normal.array,u=this.attributes.uv.array,m=f.length/6,v=new D,g=.5/a;for(let d=0,x=0;d<f.length;d+=3,x+=2)switch(l.fromArray(f,d),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),f[d+0]=h.x*Math.sign(l.x)+c.x*r,f[d+1]=h.y*Math.sign(l.y)+c.y*r,f[d+2]=h.z*Math.sign(l.z)+c.z*r,p[d+0]=c.x,p[d+1]=c.y,p[d+2]=c.z,Math.floor(d/m)){case 0:v.set(1,0,0),u[x+0]=An(v,c,"z","y",r,n),u[x+1]=1-An(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),u[x+0]=1-An(v,c,"z","y",r,n),u[x+1]=1-An(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),u[x+0]=1-An(v,c,"x","z",r,t),u[x+1]=An(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),u[x+0]=1-An(v,c,"x","z",r,t),u[x+1]=1-An(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),u[x+0]=1-An(v,c,"x","y",r,t),u[x+1]=1-An(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),u[x+0]=An(v,c,"x","y",r,t),u[x+1]=1-An(v,c,"y","x",r,e);break}}static fromJSON(t){return new Zc(t.width,t.height,t.depth,t.segments,t.radius)}}class Nx extends qt{constructor(t,e,n=!1,s=!1,r=1e4){const a=new Le;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(x){this.resolution=x,this.isolation=80,this.size=x,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=r*3;this.positionArray=new Float32Array(y*3);const _=new Be(this.positionArray,3);_.setUsage(Qr),a.setAttribute("position",_),this.normalArray=new Float32Array(y*3);const E=new Be(this.normalArray,3);if(E.setUsage(Qr),a.setAttribute("normal",E),this.enableUvs){this.uvArray=new Float32Array(y*2);const b=new Be(this.uvArray,2);b.setUsage(Qr),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const b=new Be(this.colorArray,3);b.setUsage(Qr),a.setAttribute("color",b)}a.boundingSphere=new ms(new D,1)};function f(x,y,_){return x+(y-x)*_}function p(x,y,_,E,b,A,T,S,M,R){const L=(_-T)/(S-T),P=o.normal_cache;l[y+0]=E+L*o.delta,l[y+1]=b,l[y+2]=A,c[y+0]=f(P[x+0],P[x+3],L),c[y+1]=f(P[x+1],P[x+4],L),c[y+2]=f(P[x+2],P[x+5],L),h[y+0]=f(o.palette[M*3+0],o.palette[R*3+0],L),h[y+1]=f(o.palette[M*3+1],o.palette[R*3+1],L),h[y+2]=f(o.palette[M*3+2],o.palette[R*3+2],L)}function u(x,y,_,E,b,A,T,S,M,R){const L=(_-T)/(S-T),P=o.normal_cache;l[y+0]=E,l[y+1]=b+L*o.delta,l[y+2]=A;const F=x+o.yd*3;c[y+0]=f(P[x+0],P[F+0],L),c[y+1]=f(P[x+1],P[F+1],L),c[y+2]=f(P[x+2],P[F+2],L),h[y+0]=f(o.palette[M*3+0],o.palette[R*3+0],L),h[y+1]=f(o.palette[M*3+1],o.palette[R*3+1],L),h[y+2]=f(o.palette[M*3+2],o.palette[R*3+2],L)}function m(x,y,_,E,b,A,T,S,M,R){const L=(_-T)/(S-T),P=o.normal_cache;l[y+0]=E,l[y+1]=b,l[y+2]=A+L*o.delta;const F=x+o.zd*3;c[y+0]=f(P[x+0],P[F+0],L),c[y+1]=f(P[x+1],P[F+1],L),c[y+2]=f(P[x+2],P[F+2],L),h[y+0]=f(o.palette[M*3+0],o.palette[R*3+0],L),h[y+1]=f(o.palette[M*3+1],o.palette[R*3+1],L),h[y+2]=f(o.palette[M*3+2],o.palette[R*3+2],L)}function v(x){const y=x*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[x-1]-o.field[x+1],o.normal_cache[y+1]=o.field[x-o.yd]-o.field[x+o.yd],o.normal_cache[y+2]=o.field[x-o.zd]-o.field[x+o.zd])}function g(x,y,_,E,b){const A=E+1,T=E+o.yd,S=E+o.zd,M=A+o.yd,R=A+o.zd,L=E+o.yd+o.zd,P=A+o.yd+o.zd;let F=0;const O=o.field[E],z=o.field[A],X=o.field[T],H=o.field[M],q=o.field[S],Q=o.field[R],at=o.field[L],Tt=o.field[P];O<b&&(F|=1),z<b&&(F|=2),X<b&&(F|=8),H<b&&(F|=4),q<b&&(F|=16),Q<b&&(F|=32),at<b&&(F|=128),Tt<b&&(F|=64);const It=Fx[F];if(It===0)return 0;const Ct=o.delta,Gt=x+Ct,Y=y+Ct,tt=_+Ct;It&1&&(v(E),v(A),p(E*3,0,b,x,y,_,O,z,E,A)),It&2&&(v(A),v(M),u(A*3,3,b,Gt,y,_,z,H,A,M)),It&4&&(v(T),v(M),p(T*3,6,b,x,Y,_,X,H,T,M)),It&8&&(v(E),v(T),u(E*3,9,b,x,y,_,O,X,E,T)),It&16&&(v(S),v(R),p(S*3,12,b,x,y,tt,q,Q,S,R)),It&32&&(v(R),v(P),u(R*3,15,b,Gt,y,tt,Q,Tt,R,P)),It&64&&(v(L),v(P),p(L*3,18,b,x,Y,tt,at,Tt,L,P)),It&128&&(v(S),v(L),u(S*3,21,b,x,y,tt,q,at,S,L)),It&256&&(v(E),v(S),m(E*3,24,b,x,y,_,O,q,E,S)),It&512&&(v(A),v(R),m(A*3,27,b,Gt,y,_,z,Q,A,R)),It&1024&&(v(M),v(P),m(M*3,30,b,Gt,Y,_,H,Tt,M,P)),It&2048&&(v(T),v(L),m(T*3,33,b,x,Y,_,X,at,T,L)),F<<=4;let pt,wt,bt,Xt=0,zt=0;for(;Ua[F+zt]!=-1;)pt=F+zt,wt=pt+1,bt=pt+2,d(l,c,h,3*Ua[pt],3*Ua[wt],3*Ua[bt]),zt+=3,Xt++;return Xt}function d(x,y,_,E,b,A){const T=o.count*3;if(o.positionArray[T+0]=x[E],o.positionArray[T+1]=x[E+1],o.positionArray[T+2]=x[E+2],o.positionArray[T+3]=x[b],o.positionArray[T+4]=x[b+1],o.positionArray[T+5]=x[b+2],o.positionArray[T+6]=x[A],o.positionArray[T+7]=x[A+1],o.positionArray[T+8]=x[A+2],o.material.flatShading===!0){const S=(y[E+0]+y[b+0]+y[A+0])/3,M=(y[E+1]+y[b+1]+y[A+1])/3,R=(y[E+2]+y[b+2]+y[A+2])/3;o.normalArray[T+0]=S,o.normalArray[T+1]=M,o.normalArray[T+2]=R,o.normalArray[T+3]=S,o.normalArray[T+4]=M,o.normalArray[T+5]=R,o.normalArray[T+6]=S,o.normalArray[T+7]=M,o.normalArray[T+8]=R}else o.normalArray[T+0]=y[E+0],o.normalArray[T+1]=y[E+1],o.normalArray[T+2]=y[E+2],o.normalArray[T+3]=y[b+0],o.normalArray[T+4]=y[b+1],o.normalArray[T+5]=y[b+2],o.normalArray[T+6]=y[A+0],o.normalArray[T+7]=y[A+1],o.normalArray[T+8]=y[A+2];if(o.enableUvs){const S=o.count*2;o.uvArray[S+0]=x[E+0],o.uvArray[S+1]=x[E+2],o.uvArray[S+2]=x[b+0],o.uvArray[S+3]=x[b+2],o.uvArray[S+4]=x[A+0],o.uvArray[S+5]=x[A+2]}o.enableColors&&(o.colorArray[T+0]=_[E+0],o.colorArray[T+1]=_[E+1],o.colorArray[T+2]=_[E+2],o.colorArray[T+3]=_[b+0],o.colorArray[T+4]=_[b+1],o.colorArray[T+5]=_[b+2],o.colorArray[T+6]=_[A+0],o.colorArray[T+7]=_[A+1],o.colorArray[T+8]=_[A+2]),o.count+=3}this.addBall=function(x,y,_,E,b,A){const T=Math.sign(E);E=Math.abs(E);const S=A!=null;let M=new Yt(x,y,_);if(S)try{M=A instanceof Yt?A:Array.isArray(A)?new Yt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Yt(A)}catch{M=new Yt(x,y,_)}const R=this.size*Math.sqrt(E/b),L=_*this.size,P=y*this.size,F=x*this.size;let O=Math.floor(L-R);O<1&&(O=1);let z=Math.floor(L+R);z>this.size-1&&(z=this.size-1);let X=Math.floor(P-R);X<1&&(X=1);let H=Math.floor(P+R);H>this.size-1&&(H=this.size-1);let q=Math.floor(F-R);q<1&&(q=1);let Q=Math.floor(F+R);Q>this.size-1&&(Q=this.size-1);let at,Tt,It,Ct,Gt,Y,tt,pt,wt,bt,Xt;for(It=O;It<z;It++)for(Gt=this.size2*It,pt=It/this.size-_,wt=pt*pt,Tt=X;Tt<H;Tt++)for(Ct=Gt+this.size*Tt,tt=Tt/this.size-y,bt=tt*tt,at=q;at<Q;at++)if(Y=at/this.size-x,Xt=E/(1e-6+Y*Y+bt+wt)-b,Xt>0){this.field[Ct+at]+=Xt*T;const zt=Math.sqrt((at-F)*(at-F)+(Tt-P)*(Tt-P)+(It-L)*(It-L))/R,N=1-zt*zt*zt*(zt*(zt*6-15)+10);this.palette[(Ct+at)*3+0]+=M.r*N,this.palette[(Ct+at)*3+1]+=M.g*N,this.palette[(Ct+at)*3+2]+=M.b*N}},this.addPlaneX=function(x,y){const _=this.size,E=this.yd,b=this.zd,A=this.field;let T,S,M,R,L,P,F,O=_*Math.sqrt(x/y);for(O>_&&(O=_),T=0;T<O;T++)if(P=T/_,R=P*P,L=x/(1e-4+R)-y,L>0)for(S=0;S<_;S++)for(F=T+S*E,M=0;M<_;M++)A[b*M+F]+=L},this.addPlaneY=function(x,y){const _=this.size,E=this.yd,b=this.zd,A=this.field;let T,S,M,R,L,P,F,O,z=_*Math.sqrt(x/y);for(z>_&&(z=_),S=0;S<z;S++)if(P=S/_,R=P*P,L=x/(1e-4+R)-y,L>0)for(F=S*E,T=0;T<_;T++)for(O=F+T,M=0;M<_;M++)A[b*M+O]+=L},this.addPlaneZ=function(x,y){const _=this.size,E=this.yd,b=this.zd,A=this.field;let T,S,M,R,L,P,F,O,z=_*Math.sqrt(x/y);for(z>_&&(z=_),M=0;M<z;M++)if(P=M/_,R=P*P,L=x/(1e-4+R)-y,L>0)for(F=b*M,S=0;S<_;S++)for(O=F+S*E,T=0;T<_;T++)A[O+T]+=L},this.setCell=function(x,y,_,E){const b=this.size2*_+this.size*y+x;this.field[b]=E},this.getCell=function(x,y,_){const E=this.size2*_+this.size*y+x;return this.field[E]},this.blur=function(x=1){const y=this.field,_=y.slice(),E=this.size,b=this.size2;for(let A=0;A<E;A++)for(let T=0;T<E;T++)for(let S=0;S<E;S++){const M=b*S+E*T+A;let R=_[M],L=1;for(let P=-1;P<=1;P+=2){const F=P+A;if(!(F<0||F>=E))for(let O=-1;O<=1;O+=2){const z=O+T;if(!(z<0||z>=E))for(let X=-1;X<=1;X+=2){const H=X+S;if(H<0||H>=E)continue;const q=b*H+E*z+F,Q=_[q];L++,R+=x*(Q-R)/L}}}y[M]=R}},this.reset=function(){for(let x=0;x<this.size3;x++)this.normal_cache[x*3]=0,this.field[x]=0,this.palette[x*3]=this.palette[x*3+1]=this.palette[x*3+2]=0},this.update=function(){this.count=0;const x=this.size-2;for(let y=1;y<x;y++){const _=this.size2*y,E=(y-this.halfsize)/this.halfsize;for(let b=1;b<x;b++){const A=_+this.size*b,T=(b-this.halfsize)/this.halfsize;for(let S=1;S<x;S++){const M=(S-this.halfsize)/this.halfsize,R=A+S;g(M,T,E,R,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Fx=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Ua=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function Jf(i,t,e=44){const n=new Nx(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,f=a/e*2-1;let p=10;for(const[u,m,v,g,d,x,y=0]of i){const _=Math.cos(y),E=Math.sin(y),b=c-u,A=h-m,T=f-v,S=_*b+E*A,M=-E*b+_*A,R=Math.hypot(S/g,M/d,T/x),L=Math.hypot(S/(g*g),M/(d*d),T/(x*x)),P=L>1e-6?R*(R-1)/L:-Math.min(g,d,x),F=.085,O=Math.max(F-Math.abs(p-P),0)/F;p=Math.min(p,P)-O*O*O*F/6}n.field[a*e*e+o*e+l]=-p}n.update();const s=n.geometry.drawRange.count,r=new Le;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Be(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const Ze=Math.PI*2;let Jc=1;function xu(i){Jc=Math.max(.24,Math.min(1,i))||1}const Xr=(i,t=4)=>Math.max(t,Math.round(i*Jc));function Pt(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new qt(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function B(i,t,e,n=U.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return Pt(s?new Zc(...t,Jc<.8?1:2,a):new $n(...t),n,i,e,r)}function Ot(i,t,e,n,s,r=U.silver,a=[Math.PI/2,0,0],o=48){return Pt(new Te(t,e,n,Xr(o,6)),r,i,s,a)}function Bi(i,t,e,n=U.cream){const s=Pt(new Ce(1,Xr(32,8),Xr(24,6)),n,i,e);return s.scale.set(...t),s}function be(i,t,e,n,s=U.gold,r=[0,0,0],a=Ze){return Pt(new tr(t,e,Xr(8,4),Xr(64,8),a),s,i,n,r)}function In(i,t,e,n=U.gold,s=30){return Pt(new si(new us(t.map(r=>new D(...r))),s,e,8,!1),n,i)}function ds(i,t,e,n=[0,0,0],s=64){return Pt(new xo(t.map(r=>new ut(...r)),s),e,i,n)}function io(i,t,e,n,s=.022,r=U.silver){Ot(i,s,s,s*.35,[t,e,n],r,void 0,16),B(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],U.black,.001,[0,0,(t+e)*7])}function Yn(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=ue((c,h,f)=>s(c,h,o,f),768,o);return Pt(new he(t,e),new Dt({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function We(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return Yn(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function So(i,t,e,n){const s=ue((r,a,o)=>n(r,a,o),1024);return Pt(new Gi(t,80),new Ye({map:s,toneMapped:!1}),i,[0,0,e])}function Kc(i,t,e,n,s=U.clear){const r=Pt(new Ce(1,48,20,0,Ze,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function so(i,t,e,n,s=48,r=U.silver,a="z"){for(let o=0;o<s;o++){const l=o*Ze/s;a==="z"?B(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):B(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function er(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return Pt(new go(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function _u(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function Ox(i){B(i,[1.65,.92,.49],[0,0,0],U.black,.07),B(i,[1.57,.81,.016],[0,-.015,.253],U.leather,.024),B(i,[1.63,.245,.52],[0,.448,0],U.silver,.035),B(i,[1.63,.105,.51],[0,-.48,0],U.silver,.02),B(i,[1.57,.77,.018],[0,-.015,-.257],U.leather,.025),B(i,[1.62,.82,.035],[0,-.015,-.256],U.black,.035),B(i,[1.49,.7,.02],[0,-.01,-.282],U.leather,.023),We(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),We(i,"8М",.18,.1,[-.55,-.11,.269]),We(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),We(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new ne;t.position.set(.12,-.045,0),i.add(t),Ot(t,.36,.39,.18,[0,0,.34],U.black),Ot(t,.325,.345,.13,[0,0,.466],U.silver),Ot(t,.293,.293,.21,[0,0,.575],U.black),so(t,.296,.12,[0,0,.56],56,U.rubber),be(t,.29,.012,[0,0,.682],U.silver),Ot(t,.272,.272,.025,[0,0,.688],U.black),So(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),_u(n,"ТРИПЛЕТ 43 • 4/40",420),_u(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),Ot(t,.204,.204,.025,[0,0,.717],U.black);for(let n=0;n<7;n++){const s=n*Ze/7,r=new Ci;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),Pt(new _o(r),U.rubber,t,[0,0,.733],[0,0,s])}Ot(t,.082,.082,.006,[0,0,.74],U.black),Kc(t,.196,.028,[0,0,.748],U.clear),be(t,.204,.006,[0,0,.736],U.silver),Yn(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),B(i,[.292,.177,.047],[-.49,.444,.282],U.black,.025),B(i,[.2,.105,.016],[-.49,.444,.309],U.lens,.009),B(i,[.21,.13,.035],[-.49,.447,-.28],U.black,.012),B(i,[.155,.08,.012],[-.49,.447,-.305],U.lens,.005);for(const n of[-.7,.72])io(i,n,.452,.269,.021);for(const n of[-.65,.65])io(i,n,-.32,-.3,.018);Ot(i,.161,.17,.105,[-.53,.625,0],U.silver,[0,0,0]),so(i,.161,.067,[-.53,.63,0],38,U.silver,"y"),Ot(i,.11,.12,.072,[.53,.603,0],U.black,[0,0,0]),Ot(i,.059,.065,.075,[.53,.67,0],U.silver,[0,0,0]),B(i,[.27,.024,.23],[.02,.584,0],U.black,.006);for(const n of[-.14,.14])B(i,[.035,.04,.25],[n,.6,0],U.silver,.007);Ot(i,.036,.036,.015,[0,-.535,0],U.gold,[0,0,0]);for(const n of[-.79,.79])be(i,.055,.012,[n,.14,0],U.silver,[0,Math.PI/2,0]);const e=In(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,U.leather,50);e.scale.z=.4}function zx(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];ds(i,t,U.cream),be(i,.531,.007,[0,.377,0],U.gold,[Math.PI/2,0,0]),be(i,.272,.006,[0,-.489,0],U.gold,[Math.PI/2,0,0]),In(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,U.cream),In(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,U.gold);const e=ue((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,Ze),s.fill()},1024),n=new Dt({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});ds(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),We(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function kx(i){const t=new Dt({map:U.leather.map,color:7754307,roughness:.84,bumpMap:U.leather.bumpMap,bumpScale:.01});B(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)B(i,[.008,.023,.004],[s,r,.001],U.paper,.001);for(let s=-.99;s<-.46;s+=.105)Ot(i,.019,.019,.004,[0,s,.004],U.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])B(i,[.1,.18,.13],[r,s,.035],U.silver,.023,[0,0,r*s]);Ot(i,.415,.438,.135,[0,0,.066],U.silver),be(i,.394,.027,[0,0,.143],U.silver),So(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*Ze/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*Ze/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),cn(s,r,r,a,1700)}),B(i,[.019,.244,.009],[-.038,.102,.18],U.black,.003,[0,0,.36]),B(i,[.012,.31,.008],[.105,.067,.19],U.black,.002,[0,0,-1]),B(i,[.004,.45,.003],[-.09,-.012,.201],U.copper,.001,[0,0,1.71]),Ot(i,.018,.02,.015,[0,0,.205],U.gold),Kc(i,.371,.018,[0,0,.211]),Ot(i,.056,.057,.1,[.468,0,.04],U.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*Ze/18;B(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],U.silver,.001,[r,0,0])}const e=new Ci;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new to;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),er(i,e,.025,U.silver,[0,1,.02]),B(i,[.02,.23,.018],[0,1,.065],U.silver,.003),Ot(i,.392,.392,.02,[0,0,-.104],U.silver),We(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),We(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;io(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new D().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function Bx(i){B(i,[1.6,1,.166],[0,0,0],U.black,.07),B(i,[1.46,.77,.026],[0,.075,.092],U.rubber,.04),Yn(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),cn(t,e,n,s,1200)}),B(i,[1.07,.276,.012],[0,-.044,.121],U.black,.04);for(const t of[-.405,.405]){Ot(i,.176,.176,.018,[t,-.038,.132],U.rust),Ot(i,.112,.112,.023,[t,-.038,.146],U.paper),Ot(i,.063,.063,.027,[t,-.038,.152],U.black);for(let e=0;e<6;e++){const n=e*Ze/6;B(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],U.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])be(i,e,.002,[t,-.038,.147],U.black)}for(let t=-.2;t<.23;t+=.043)B(i,[.012,.08,.008],[t,-.04,.137],U.silver,.001);B(i,[1.16,.205,.035],[0,-.374,.105],U.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])io(i,t,e,.098,.024);for(const t of[-.44,.44])Ot(i,.049,.049,.008,[t,-.389,.131],U.rubber);for(let t=0;t<20;t++)B(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],U.leather,.001);Yn(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);cn(t,e,n,s,800)},[0,Math.PI,0])}function Hx(i){Pt(Jf([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],U.cream,44),U.cream,i);for(const e of[-1,0,1]){const n=Bi(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],U.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new Ci;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),er(i,t,.13,U.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){Bi(i,[.012,.014,.007],[.43,.405,e*.164],U.black),In(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,U.gold,30);for(let n=0;n<4;n++)In(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,U.gold,12)}Ot(i,.29,.32,.045,[-.04,-.415,0],U.cream,[0,0,0]),We(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function Vx(i){B(i,[1.02,1.48,.253],[.025,0,0],U.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;B(i,[1.02,.002,.001],[.025,.742,n],e%5?U.paper:U.rust,0),B(i,[.002,1.45,.001],[.537,0,n],e%4?U.paper:U.rust,0)}B(i,[1.15,1.58,.045],[0,0,.155],U.red,.015),B(i,[1.15,1.58,.045],[0,0,-.155],U.red,.015),B(i,[.095,1.57,.34],[-.56,0,0],U.red,.025),Yn(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),cn(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])B(i,[.106,.015,.347],[-.556,e,0],U.red,.007);We(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new Dt({color:5724487,roughness:1});B(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),We(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function Gx(i){be(i,.28,.055,[0,.41,0],U.gold),be(i,.219,.012,[0,.41,.034],U.copper),Ot(i,.046,.048,.92,[0,-.29,0],U.gold,[0,0,0],32),B(i,[.25,.09,.1],[.092,-.745,0],U.gold,.012),B(i,[.09,.1,.105],[.171,-.64,0],U.gold,.007),B(i,[.065,.17,.095],[.037,-.7,0],U.gold,.009),be(i,.34,.014,[0,.72,-.01],U.silver,[.23,0,.08]),be(i,.331,.009,[0,.72,-.018],U.silver,[.23,0,.08]),B(i,[.24,.34,.037],[.37,.34,-.03],U.leather,.028,[0,0,-.22]),We(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),be(i,.055,.012,[.33,.535,-.02],U.silver),We(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function Wx(i){const t=new Ci;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),er(i,t,.055,U.gold,[0,0,-.03]);const e=t.clone();er(i,e,.009,U.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),Yn(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])Bi(i,[.014,.021,.002],[s,r,.044],U.gold);In(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,U.silver,14),Ot(i,.04,.04,.045,[-.23,.18,-.059],U.silver),We(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function Xx(i){Ot(i,.83,.83,.022,[0,0,0],U.black,void 0,96);const t=ue((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,Ze),s.stroke()},1024),e=ue((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,f=Math.hypot(c,h)||1,p=Math.sin(f*2.2)*.22,u=(o*r+l)*4;a.data[u]=128+127*p*c/f,a.data[u+1]=128+127*p*h/f,a.data[u+2]=253,a.data[u+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=_n;const n=new Dt({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new ut(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){Pt(new Gi(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new ne;i.add(r),r.rotation.y=s===1?0:Math.PI,So(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,Ze),a.stroke(),cn(a,o,o,l,1500)}),Ot(r,.018,.018,.01,[0,0,.022],U.rubber)}}function qx(i){const t=new Hs({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=ds(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new Hs({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});Ot(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),Ot(i,.11,.11,.16,[0,.49,0],U.gold,[0,0,0]),so(i,.112,.1,[0,.49,0],28,U.gold,"y"),ds(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),Yn(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),cn(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function Yx(i){B(i,[1.27,.08,.55],[0,-.72,0],U.bronze,.032),B(i,[1.35,.04,.61],[0,-.78,0],U.black,.02),Pt(Jf([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],U.bronze),U.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;In(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,U.bronze),Bi(i,[.051,.057,.04],[e+s,-.43,n],U.bronze),B(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],U.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=ds(i,[[0,0],[.041,0],[.034,.1],[0,.18]],U.bronze,[.333,.525,e],16);n.rotation.z=.15,Bi(i,[.015,.015,.008],[.457,.49,t*.127],U.black),Bi(i,[.012,.01,.006],[.648,.404,t*.083],U.black)}for(let t=0;t<12;t++)In(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,U.bronze,10);In(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,U.bronze);for(let t=0;t<5;t++)In(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,U.gold,14);In(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,U.gold,16),We(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function $x(i){Ot(i,.51,.53,.145,[0,0,0],U.gold),be(i,.503,.018,[0,0,.075],U.gold),so(i,.51,.072,[0,0,-.018],72,U.gold),So(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*Ze/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*Ze/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),cn(e,n,n,s,1800)});const t=new Ci;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),er(i,t,.007,U.red,[0,0,.103],[0,0,-.38],.001),er(i,t,.007,U.silver,[0,0,.103],[0,0,Math.PI-.38],.001),Ot(i,.027,.027,.025,[0,0,.121],U.gold),Kc(i,.468,.013,[0,0,.142]),be(i,.109,.025,[0,.635,0],U.gold),Ot(i,.059,.065,.092,[0,.523,0],U.gold,[0,0,0]),Ot(i,.465,.465,.02,[0,0,-.086],U.gold),We(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),We(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function Zx(i){ds(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],U.glass);for(const n of[.817,.862])be(i,.116,.009,[0,n,0],U.glass,[Math.PI/2,0,0]);const t=ue((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),cn(n,s,a,r,2800)},768,460),e=new Dt({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:ze});Pt(new Te(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),We(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function Jx(i){const t=U.silver.clone();t.roughness=.46,ds(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)be(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);Ot(i,.404,.404,.015,[0,-.347,0],U.rust,[0,0,0]);const e=new ne;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),Ot(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),be(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),be(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),B(e,[.067,.025,.11],[0,.028,.33],t,.015),Yn(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),cn(n,s,r,a,2600)}),Yn(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),cn(n,s,r,a,2400)},[0,Math.PI,0])}function Kx(i){const t=ue((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),cn(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,Ze),r.fill()},768,768),e=new Dt({map:t,roughness:.98,side:ze,bumpMap:U.paper.bumpMap,bumpScale:.009}),n=new Te(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),f=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+f,o,l*h)}n.computeVertexNormals(),Pt(n,e,i),be(i,.355,.016,[0,.44,0],U.paper,[Math.PI/2,0,0]),Ot(i,.232,.232,.015,[0,-.437,0],U.paper,[0,0,0]),Ot(i,.224,.224,.008,[0,-.421,0],U.rust,[0,0,0]),In(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,U.paper)}function jx(i){const t=ue((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);cn(s,r,r,a,3500)}),e=new Dt({map:t,roughness:.97,bumpMap:U.paper.bumpMap,bumpScale:.008,side:ze});B(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])B(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])B(i,[.029,.75,.8],[s,-.065,0],e,.006);B(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),B(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),B(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),B(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)Ot(i,.005,.005,.027,[s,.319,.399],U.paper,[0,0,0],6);Yn(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);cn(s,r,a,o,1200)}),Yn(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new Dt({color:11114860,roughness:.4,transparent:!0,opacity:.66});B(i,[.12,.74,.006],[.25,-.05,.421],n,.001),B(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function Qx(i){Ot(i,.507,.507,.036,[0,0,0],U.rust,void 0,80),be(i,.504,.014,[0,0,.017],U.silver);for(const e of[.448,.408])be(i,e,.009,[0,0,.024],U.rust);const t=ui(77);for(let e=0;e<9;e++){const n=t()*Ze,s=.465+t()*.015;Bi(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],U.silver)}for(let e=0;e<24;e++){const n=e*Ze/24;B(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],U.rust,.007,[0,0,-n])}We(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function t_(i){const t=ue((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),cn(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,Ze),n.fill()},1024,1280),e=new Dt({map:t,roughness:1,side:ze,bumpMap:U.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new he(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++)r.getX(a),r.getY(a),r.setZ(a,n*.004);s.computeVertexNormals(),Pt(s,e,i)}}const e_={camera:Ox,teacup:zx,watch:kx,cassette:Bx,duck:Hx,book:Vx,key:Gx,badge:Wx,record:Xx,perfume:qx,horse:Yx,compass:$x,bottle:Zx,can:Jx,cup:Kx,box:jx,lid:Qx,paper:t_};function n_(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===U.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new Yt("#977145"),c=new Yt("#355d53");for(let h=0;h<a.count;h++){const f=a.getX(h),p=a.getY(h),u=a.getZ(h),m=Math.sin(f*15+Math.sin(p*9))*Math.sin(p*19+u*12)*Math.cos(u*21-f*6),v=me.clamp((m+.12)*.85,0,.8);l.clone().lerp(c,v).toArray(o,h*3)}s.setAttribute("color",new Be(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=Xf(s,!1);Pt(r,n,i),s.forEach(a=>a.dispose())}return e}function fl(i){const t=new ne;e_[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const f=new D().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);f.set(...Ux(i,f.x,f.y,f.z)).applyMatrix4(c),l.setXYZ(h,f.x,f.y,f.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=n_(t),n=new qn().setFromObject(t),s=n.getCenter(new D),r=n.getSize(new D);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new ne;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const Na=ui(370);function i_(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function jc(i,t,e,n,s){const r=new he(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function Ln(i,t,e,n,s=[1,1,1],r=1){const a=Pt(new vo(t,r),n,i,e);return a.scale.set(...s),a}function Dn(i,t,e,n,s=[1,1,1],r=1){const a=Pt(new vo(t,r),n,i,e);return a.scale.set(...s),a}function s_(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function bo(i,t,e,n,s=24){return Pt(new si(new us(t.map(r=>new D(...r))),s,e,5,!1),n,i)}function r_(){return ue((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(u,m,v,g,d)=>{i.fillStyle=d,i.fillRect(u,m,v,g)},c=(u,m,v,g,d)=>{i.fillStyle=d,i.beginPath(),i.ellipse(u,m,v,g,0,0,Math.PI*2),i.fill()},h=(u,m,v,g="rgba(255,198,106,")=>{const d=i.createRadialGradient(u,m,0,u,m,v);d.addColorStop(0,g+".62)"),d.addColorStop(1,g+"0)"),i.fillStyle=d,i.fillRect(u-v,m-v,v*2,v*2)},f=(u,m,v="#4b2d1e")=>{const g=i.createLinearGradient(0,0,0,r);g.addColorStop(0,u),g.addColorStop(1,m),i.fillStyle=g,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,v),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},p=(u,m)=>{i.save(),i.translate(u%4*s,Math.floor(u/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),m(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};p(0,()=>{f("#bd8745","#70452a"),l(16,58,122,316,"#382313");const u=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let m=0;m<5;m++){const v=78+m*58;l(22,v+38,110,6,"#20130b");let g=27;for(;g<124;){const d=5+e()*9;l(g,v+38-(24+e()*12),d,24+e()*12,u[Math.floor(e()*u.length)]),g+=d+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),p(1,()=>{f("#a8ad7d","#66704e","#40392a");for(let u=0;u<3;u++){const m=86+u*72;l(22,m,190,7,o);for(let v=0;v<6;v++){const g=34+v*31;l(g,m-(20+(v+u)%3*7),15,20+(v+u)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][v%4]),l(g+2,m-(27+(v+u)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const u of[62,112,168])i.beginPath(),i.moveTo(u,306),i.lineTo(u,326),i.stroke(),c(u,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),p(2,()=>{f("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),p(3,()=>{f("#8fae94","#55705e","#33473a");for(let u=0;u<3;u++){const m=120+u*104;l(18,m,220,8,"#2c2117");for(let v=0;v<4;v++){const g=42+v*54;l(g-13,m-25,26,25,"#8a5138");for(let d=0;d<6;d++){const x=-2.4+d*.45;c(g+Math.cos(x)*17,m-34+Math.sin(x)*19,11,5,d%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const u of[38,96,204]){i.beginPath(),i.moveTo(u,0),i.quadraticCurveTo(u+14,72,u-4,142),i.stroke();for(let m=0;m<6;m++)c(u+(m%2?9:-8),24+m*21,10,5,m%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),p(4,()=>{f("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const u of[48,112,190])l(u,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let u=0;u<4;u++)i.beginPath(),i.moveTo(100,292+u*6),i.lineTo(136,292+u*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),p(5,()=>{f("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let u=0;u<5;u++)l(26+u*15,410-u*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][u]);h(218,166,50)}),p(6,()=>{f("#8299a4","#4f6875","#31424b");const u=i.createLinearGradient(38,96,218,250);u.addColorStop(0,"#b9d5df"),u.addColorStop(.55,"#688b9c"),u.addColorStop(1,"#314f62"),i.fillStyle=u,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),p(7,()=>{f("#b49aa4","#76606d","#463945");for(let u=0;u<5;u++){l(24,78+u*8,70,4,"rgba(50,35,42,.45)");for(let m=0;m<4;m++)l(31+m*16,58+u*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][m])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function a_(){return ue((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,f,p="#2e342b",u="Georgia")=>{i.fillStyle=p,i.font=`bold ${f}px ${u}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const je={};function Zn(){if(je.stone)return je;je.stone=new Dt({color:7566439,roughness:.86,map:$a("plaster.jpg")}),je.iron=new Dt({color:2633768,metalness:.72,roughness:.6}),je.green=new Dt({color:4216121,roughness:.9,flatShading:!0,side:ze}),je.shadowMap=ue((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),je.contact=new Ye({map:je.shadowMap,transparent:!0,depthWrite:!1}),je.wood=new Dt({color:7427130,roughness:.92}),je.leafDark=new Dt({color:3099956,roughness:1,flatShading:!0}),je.poster=new Dt({map:a_(),roughness:.96}),je.bulb=new Dt({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=ue((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);je.glow=new Ye({map:i,color:16757350,transparent:!0,opacity:.42,blending:Nr,depthWrite:!1,side:ze});const t=ue((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);je.chalk=new Ye({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=ue((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return je.chess=new Dt({map:e,roughness:.8}),je}function o_(i,t,e=14,n=0){const s=new Ye({map:Zf(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});Pt(new he(t,1.45),s,i,[0,.72,.342]);const r=ue((u,m,v)=>{u.fillStyle="#605d4c",u.fillRect(0,0,m,m);for(let g=0;g<12;g++)for(let d=-1;d<7;d++){const x=d*87+g%2*43,y=g*45;u.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(v()*4)],u.fillRect(x+3,y+3,81,39),u.fillStyle="rgba(28,29,21,.22)",u.fillRect(x+3,y+36,81,5)}u.globalCompositeOperation="destination-in",u.beginPath();for(let g=0;g<60;g++){const d=g*Math.PI/30,x=185+v()*60;u.lineTo(m/2+Math.cos(d)*x,m/2+Math.sin(d)*x*.7)}u.closePath(),u.fill()}),a=new Dt({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[u,m,v]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])Pt(new he(v*2,v),a,i,[u,m,.349]);const o=Zn();for(const[u,m,v]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])Pt(new he(.17,v),s,i,[u,m,.344]);let l=0;for(let u=-t/2+1.55;u<t/2-1.1;u+=2.85,l++){if(n===0&&Math.abs(u+3.8)<1.65)continue;const m=(l+n)%4===1;B(i,[.78,.48,.06],[u,.39,.425],m?td:U.black,0),B(i,[.9,.07,.09],[u,.665,.44],o.stone,0),B(i,[.9,.06,.1],[u,.125,.45],o.stone,0);for(const g of[-.24,0,.24])B(i,[.02,.44,.02],[u+g,.39,.47],U.black,0);const v=u+1.42;if(v<t/2-.7){B(i,[.34,.24,.035],[v,.92,.342],U.black,0);for(let g=0;g<3;g++)B(i,[.28,.025,.012],[v,.86+g*.07,.365],U.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;Pt(jc(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=ui(910+n),f=[[-t/2+.58,0],[t/2-.58,2]];n===0&&f.push([-5.32,1]);for(const[u,m]of f)for(let v=0;v<30;v++){const g=.5+v*.17+h()*.09,d=u+Math.sin(v*.55+m)*.28+(h()-.5)*.2;Pt(new Gi(.055+h()*.08,7),v%3?o.leafDark:o.green,i,[d,g,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const u of[-t*.3,t*.24])B(i,[.78,.98,.78],[u,e+.48,-.05],o.stone,0),B(i,[.94,.13,.94],[u,e+1.02,-.05],o.stone,0),Ot(i,.09,.11,.24,[u-.16,e+1.19,-.05],U.rust,[0,0,0],10),Ot(i,.09,.11,.24,[u+.16,e+1.19,-.05],U.rust,[0,0,0],10);for(const u of[-t*.12,t*.36])Ot(i,.018,.018,1.42,[u,e+.76,.18],U.black,[0,0,0],8),B(i,[.88,.025,.025],[u,e+1.12,.18],U.black,0),B(i,[.58,.025,.025],[u,e+1.36,.18],U.black,0),B(i,[.025,.025,.72],[u,e+1.24,.18],U.black,0);const p=t*.16;Pt(new Te(.37,.09,.13,20),U.silver,i,[p,e-1.48,.56],[1.02,0,-.32]),bo(i,[[p-.18,e-1.62,.34],[p,e-1.5,.58]],.016,U.black,4);for(let u=0;u<6;u++){if((u+n)%4===3)continue;const m=-t*.34+u*t*.13,v=e+.13;Ln(i,.058,[m,v,.48],o.stone,[1.45,.82,.9],0),Dn(i,.032,[m+.065,v+.055,.49],U.black),B(i,[.11,.014,.035],[m-.085,v+.015,.47],U.black,0,[0,.2,.18])}}function Kf(i,t,e,n,s,r,a,o){B(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),B(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])B(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),B(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);B(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],U.silver,0),B(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let Fa;function l_(){if(Fa)return Fa;const i=ue((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=r_(),e=ue((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return Fa={curtain:new Dt({map:i,roughness:1,side:ze}),blind:new Dt({color:10067089,roughness:.9}),leaf:new Dt({color:4087359,roughness:1,flatShading:!0}),pot:new Dt({color:8414289,roughness:.94}),interior:new Dt({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new Dt({map:e,transparent:!0,alphaTest:.06,roughness:1,side:ze})},Fa}function jf(i,t,e=1,n=0,s=U.black){const r=new ne;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),Ln(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),Dn(r,.086,[0,.325,.13],s);for(const a of[-1,1])Pt(new Te(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),Ot(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return bo(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function Qf(i,t,e,n,s,r,a,o,l=0){const c=l_(),h=Zn(),f=i_(l+811),p=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),u=(m=.574)=>{for(const v of[-1,1]){const g=new he(n*.27,s*.91,5,6),d=g.attributes.position;for(let x=0;x<d.count;x++)d.setZ(x,.008*Math.sin(d.getX(x)*80));g.computeVertexNormals(),Pt(g,c.curtain,i,[t+v*n*.34,e-.025,m]),B(i,[.035,.09,.025],[t+v*n*.24,e-.08,m+.018],U.gold,0)}Pt(new he(n*.96,s*.17),c.lace,i,[t,e+s*.39,m+.004])};if(r==="lit")Pt(jc(n*.97,s*.97,f%8,4,2),c.interior,i,[t,e,.566]),f%3===0&&u(.576),f%4===1&&(Ot(i,.006,.006,.34,[t+.18,e+s*.31,.59],U.black,[0,0,0],6),Ot(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),Dn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")u();else if(r==="blind"){for(let m=0;m<12;m++)B(i,[n*.94,.04,.019],[t,e+s/2-.08-m*.093,.581],c.blind,0,m>8?[.32,0,0]:[0,0,0]);for(const m of[-1,1])B(i,[.012,s*.68,.012],[t+m*n*.39,e+s*.08,.594],U.black,0);B(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const m=new ne;m.position.set(t-n/2,e,.6),m.rotation.y=-.42,i.add(m),B(m,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const v of[0,n*.48])B(m,[.038,s*.94,.05],[v,0,.025],a,0);for(const v of[-s*.47,s*.47])B(m,[n*.5,.038,.05],[n*.24,v,.025],a,0);B(m,[n*.48,.032,.05],[n*.24,.23,.025],a,0),Ot(m,.014,.014,.1,[n*.45,-.05,.065],U.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&f%3===0){const m=t+(f%2?.29:-.29);Ot(i,.1,.075,.15,[m,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const v of[-1,0,1])Ln(i,.07,[m+v*.055,e-s/2+.17,.79],v?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&f%5===0&&jf(i,[t-.17,e-s/2-.015,.8],.58,0,U.black),p>0&&p<3){if(f%9===2){B(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let m=0;m<6;m++)Ln(i,.07,[t-n*.31+m*n*.12,e-s/2+.17,.74],m%2?h.green:c.leaf,[1.2,.72,.8],0);for(let m=0;m<7;m++)Ln(i,.022,[t-n*.33+m*n*.105,e-s/2+.21,.78],m%3?U.red:U.cream,[1,1,1],0)}else if(f%11===5){B(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),Pt(new Te(.15,.15,.025,20),U.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const m of[-.1,0,.1])B(i,[.42,.018,.012],[t+.16,e-s/2-.39+m,.735],U.black,0);B(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],U.black,0)}else if(f%13===6)for(const m of[-1,1]){B(i,[.24,s*.9,.035],[t+m*(n/2+.18),e,.55],h.leafDark,0);for(let v=0;v<5;v++)B(i,[.18,.025,.014],[t+m*(n/2+.18),e-s*.3+v*s*.15,.575],U.black,0)}}if(p===0&&r!=="open"&&f%3===1){for(const m of[-.36,-.18,0,.18,.36])B(i,[.018,s*.85,.018],[t+m*n,e,.645],U.black,0);for(const m of[-s*.28,s*.28])B(i,[n*.84,.02,.02],[t,e+m,.65],U.black,0)}if(p>=2&&f%11===0){const m=t+n*.24,v=e-s/2+.025;Ln(i,.055,[m,v,.76],h.stone,[1.45,.82,.9],0),Dn(i,.031,[m+.062,v+.052,.76],U.black),B(i,[.1,.013,.032],[m-.082,v+.012,.76],U.black,0,[0,.15,.16])}}function c_(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=Zn();Ot(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),be(i,.56,.015,[2.5,.033,2.5],U.rust,[Math.PI/2,0,0]),be(i,.62,.014,[2.5,.033,2.5],U.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;B(i,[h,.012,.018],[2.5,.04,2.5+c*.085],U.black,.003)}for(const c of[2.23,2.77])B(i,[.05,.01,.11],[c,.049,2.5],U.black,.005);for(const c of[-4.55,4.55]){B(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),Ot(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),Ot(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),Dn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new eo(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}B(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)B(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new us([new D(-6,5.3,-6.5),new D(-1,4.96,-6.47),new D(4.2,5.31,-6.46)]);Pt(new si(o,24,.011,5),U.rubber,i);const l=ue((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[f,p]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(p,h/2,165+f*41);c.strokeStyle="#555b4d";for(let f=28;f<h;f+=43)c.beginPath(),c.moveTo(f,h-90),c.lineTo(f,h),c.stroke()});Pt(new he(.42,.56),new Dt({map:l,roughness:.95,side:ze}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,f,p]of[...Vf.map(u=>[u.x,u.z,u.scale*3.5,u.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])Pt(new he(f,p),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+Na()*1.3,f=-6+Na()*6,p=.03+Na()*.13,u=new Ci;u.moveTo(-.012,0),u.quadraticCurveTo(.014,p*.7,.025,p),u.lineTo(.006,0),Pt(new _o(u),s,i,[h,.025,f],[0,Na()*6,0])}d_(i)}function yu(i,t,e){const n=Zn(),s=new ne;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])B(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])B(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])B(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),B(s,[.055,.04,.56],[r*.84,.67,0],U.rust,0),B(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function Oa(i,t,e,n,s){const r=Zn(),a=new ne,o=ui(s);a.position.set(...t),a.rotation.y=e,i.add(a),B(a,[n,.1,.78],[0,.05,0],U.rust,0);for(const c of[-1,1]){B(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),B(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)B(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,f=(o()-.5)*.42,p=c%3?r.leafDark:r.green;Ln(a,.15+o()*.15,[h,.19+o()*.08,f],p,[1.45,.58,.95],0),Ln(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,f+(o()-.5)*.18],p,[1.3,.62,.9],0),Ln(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,f+(o()-.5)*.16],p,[1.2,.6,.9],0)}for(let c=0;c<18;c++)Ln(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[U.red,U.cream,U.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)Pt(new Te(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function h_(i,t,e,n,s=9){const r=Zn();bo(i,s_(t,e,n,7),.007,U.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;B(i,[.006,.07,.006],[l,c-.035,h],U.black,0),Dn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function za(i,t,e,n,s){const r=Zn();B(i,[.07,.36,.13],[t,e,n],r.iron,.01),Ot(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),Ot(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),Dn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),Pt(new he(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function u_(i,t,e,n=1){const s=Zn(),r=new ne;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),Ln(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),Dn(r,.037,[0,.135,.085],U.black),Pt(new Te(.001,.011,.038,5),U.gold,r,[0,.13,.128],[Math.PI/2,0,0]),B(r,[.075,.014,.1],[0,.075,-.105],U.black,0,[.22,0,0]);for(const a of[-1,1])B(r,[.008,.055,.008],[a*.025,.028,.01],U.rust,0);return r}function f_(i,t,e){const n=Zn(),s=new ne;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])B(s,[1.08,.026,.105],[0,a+.055,o],r%2?U.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])B(s,[.1,.085,.1],[o,a,l],U.rust,0)}return B(s,[.58,.38,.48],[.05,.72,0],U.paper,.01,[0,.12,0]),s}function d_(i){const t=Zn();yu(i,[-5.45,0,-.75],Math.PI/2),yu(i,[5.7,0,-5.25],0),Oa(i,[-7.02,0,1.95],Math.PI/2,4.8,21),Oa(i,[8.02,0,1.75],Math.PI/2,4.3,33),Oa(i,[5.95,0,-6.08],0,3.5,47),Oa(i,[-6.35,0,-6.08],0,2.1,58),h_(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),za(i,-7.62,2.75,-4.9,1),za(i,-7.62,2.75,3.8,1),za(i,8.62,2.75,-4.9,-1),za(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;B(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),B(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}Ot(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),B(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),Pt(new he(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])Ot(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),Ot(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)Dn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?U.black:U.cream,[1,.75,1],0);f_(i,[-6.5,0,-4.9],.15);const e=new ne;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),B(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])B(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],U.rust,0);Dn(e,.035,[.075,1.02,.34],U.silver);for(let a=0;a<3;a++)Pt(new tr(.34,.105,8,26),U.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);Pt(new tr(.34,.105,8,26),U.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new ne;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),B(n,[.62,.58,1.72],[0,.58,0],U.leather,.18),B(n,[.54,.46,1],[0,1.02,-.12],U.leather,.19),B(n,[.5,.34,.46],[0,1.04,.58],U.leather,.16);for(const a of[-.42,.22])B(n,[.65,.018,.035],[0,.84,a],U.black,0);for(const a of[-.58,.58])Pt(new Te(.29,.29,.09,20),U.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new ne;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),B(s,[.1,.035,.6],[0,.1,0],U.red,.01);for(const a of[-.25,.25])Pt(new Te(.075,.075,.035,14),U.black,s,[0,.075,a],[0,0,Math.PI/2]);bo(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,U.silver,8),B(s,[.36,.025,.025],[0,.78,.4],U.black,0),Pt(new he(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),Dn(i,.16,[-4.72,.16,1.85],U.red,[1,.92,1]),jf(i,[-4.32,0,-.22],1,1.49,U.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>u_(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)Ln(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],U.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const f=Pt(new he(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);f.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])Pt(new he(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const td=new Dt({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function p_(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])Ot(i,.027,.027,.016,[o,l,.854],U.silver,void 0,8),B(i,[.016,.003,.005],[o,l,.866],U.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=Bi(i,[.013,.035,.007],[o*1.155,l,.827],U.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])B(i,[.21,.06,.3],[o,.42,.6],U.silver,.018),B(i,[.075,.025,.21],[o,.305,.81],U.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){B(t,[.2,.032,.2],[o,.114,.12],U.silver,.008);for(const l of[-.065,.065])Ot(t,.022,.022,.012,[o+l,.139,.12],U.silver,[0,0,0],8)}const n=new Dt({color:1055507,roughness:.94});B(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=ue((o,l,c)=>{for(let h=0;h<1800;h++){const f=c(),p=c();f>.1&&f<.9&&p<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(f*l,p*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const f=o.createLinearGradient(0,0,0,l);f.addColorStop(0,"rgba(67,42,24,0)"),f.addColorStop(.5,"rgba(67,42,24,.35)"),f.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=f,o.fillRect(h*l,0,6,l)}}),r=new Dt({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});Pt(new he(2.35,1.43),r,i,[0,1.18,.876]),Pt(new he(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])B(t,[.025,.006,.48],[o,.114,1.6],U.silver,.002);const a=ue((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});Pt(new he(.42,.37),new Dt({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const m_=new Dt({color:3883064,roughness:.82});function g_(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const f=Zn(),p=ui(c*7+13),u=1.55,m=2.55,v=u,g=m+v,d=new Ci;d.moveTo(-t/2,0),d.lineTo(t/2,0),d.lineTo(t/2,e),d.lineTo(-t/2,e),d.closePath();const x=new to;x.moveTo(h-u,0),x.lineTo(h-u,m),x.absarc(h,m,v,Math.PI,0,!0),x.lineTo(h+u,0),x.closePath(),d.holes.push(x),Pt(new go(d,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[P,F]of[[-t/2,h-u-.12],[h+u+.12,t/2]])B(i,[F-P,.75,.78],[(P+F)/2,.375,.025],n,0);for(const P of[3.28,6.2,9.15])for(const[F,O]of[[-t/2,h-u-.12],[h+u+.12,t/2]]){const z=O-F;z<.5||(B(i,[z,.14,.87],[(F+O)/2,P,.055],s,0),B(i,[z,.07,.98],[(F+O)/2,P+.09,.08],n,0))}B(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const P of[-1,1])B(i,[.36,m+.05,.62],[h+P*(u+.18),m/2,.06],n,.02);const _=new Hr(0,0,v+.2,v+.2,0,Math.PI,!1,0).getPoints(30).map(P=>new D(P.x,P.y,0));Pt(new si(new us(_),30,.17,7,!1),n,i,[h,m,.06]),B(i,[.26,.62,.72],[h,g+.16,.09],n,.02);for(let P=1;P<7;P++){const F=Math.PI*P/7,O=Math.cos(F)*(v+.2),z=Math.sin(F)*(v+.2);B(i,[.17,.3,.52],[h+O,m+z,.03],n,.012,[0,0,-F+Math.PI/2])}const E=new Dt({color:1909020,roughness:.96});B(i,[u*2+.6,.06,3.6],[h,0,-1.85],n,0),B(i,[.24,4.6,3.6],[h-u-.32,2.3,-1.85],E,0),B(i,[.24,4.6,3.6],[h+u+.32,2.3,-1.85],E,0),B(i,[3.4,.2,3.6],[h,g+.62,-1.85],n,0),B(i,[3.4,4.8,.12],[h,2.4,-3.7],E,0);const b=ue((P,F)=>{const O=P.createLinearGradient(0,0,0,F);O.addColorStop(0,"rgba(52,60,58,1)"),O.addColorStop(.42,"rgba(85,74,54,1)"),O.addColorStop(1,"rgba(34,38,34,1)"),P.fillStyle=O,P.fillRect(0,0,F,F);const z=P.createRadialGradient(F*.5,F*.3,0,F*.5,F*.3,F*.46);z.addColorStop(0,"rgba(255,198,118,.95)"),z.addColorStop(.45,"rgba(255,174,92,.38)"),z.addColorStop(1,"rgba(255,160,80,0)"),P.fillStyle=z,P.fillRect(0,0,F,F)});Pt(new he(3.2,4.6),new Ye({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),Pt(new he(3,4.2),new Ye({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),B(i,[1.1,.4,.36],[h-.55,2.1,-2.1],E,0),B(i,[.5,.9,.3],[h+.7,.28,-2.2],E,0);const A=(P,F=0)=>{const O=new ne,z=u-.06,X=m-.1;O.position.set(h+P*(u-.02),0,.02),O.rotation.y=P*F,i.add(O);const H=-P*z/2;for(const Q of[.07,X])B(O,[z,.1,.09],[H,Q,0],U.black,.012);for(const Q of[H-z/2+.045,H+z/2-.045])B(O,[.09,X,.09],[Q,X/2,0],U.black,.012);const q=.92;B(O,[z-.12,q,.07],[H,q/2+.1,0],m_,.01);for(let Q=0;Q<3;Q++)B(O,[z-.18,.03,.09],[H,q*(Q+.5)/3+.1,.012],U.rust,0);for(let Q=H-z/2+.14;Q<H+z/2-.1;Q+=.17)B(O,[.03,X-q-.24,.03],[Q,q+.12+(X-q-.24)/2,.012],U.black,0);for(const Q of[X-.12,2.02,q+.32])B(O,[z-.14,.05,.055],[H,Q,.012],U.black,0);for(const Q of[.42,.95])Ot(O,.035,.035,.09,[H+P*(z/2-.02),Q,0],U.black,[0,0,0],10);return be(O,.1,.013,[H,X*.8,.02],U.black),O};A(-1,.3),A(1,0);for(let P=-3;P<=3;P++){const F=h+P*.42,O=Math.sqrt(Math.max(0,v*v-F*F)),z=m+O*.96,X=m-.1;z-X<.12||B(i,[.028,z-X,.028],[F,(z+X)/2,.055],U.black,0)}const S=new Hr(0,0,v-.02,v-.02,0,Math.PI,!1,0).getPoints(20).map(P=>new D(P.x,P.y,0));Pt(new si(new us(S),20,.03,5,!1),U.black,i,[h,m,.055]);for(let P=0;P<5;P++){const F=Math.PI*(P+1)/6;B(i,[.05,.05,.05],[h+Math.cos(F)*(v-.02),m+Math.sin(F)*(v-.02),.075],U.black,0)}Ot(i,.02,.02,.5,[h,g+.9,.36],U.black,[0,0,0],8),Ot(i,.11,.2,.14,[h,g+.5,.36],U.black,[0,0,0],14),Dn(i,.082,[h,g+.4,.36],f.bulb,[1,1.45,1],0),Pt(new he(1.5,1.5),f.glow,i,[h,g+.36,.5]);const M=new Dt({map:dc("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});B(i,[.62,.46,.06],[h+2.3,2.35,.35],U.black,0),Pt(new he(.57,.41),M,i,[h+2.3,2.35,.39]);const R=Math.floor(t/2.47);for(let P=0;P<R;P++)for(let F=0;F<4;F++){const O=(P-(R-1)/2)*2.47,z=1.72+F*2.95;if(Math.abs(O-h)<3.3&&F<2)continue;const X=1.16,H=1.91,q=300+F*10+P;B(i,[X+.26,H+.27,.14],[O,z,.38],s,0),B(i,[X+.05,H+.06,.1],[O,z,.47],r,0);const Q=Gf(P,F,2),at=Q==="lit"?l:o[(P+F)%o.length];B(i,[X,H,.04],[O,z,.54],at,0);for(const Tt of[-X/2,X/2,0])B(i,[.048,H,.09],[O+Tt,z,.58],n,0);for(const Tt of[-H/2,H/2,.24])B(i,[X,.047,.09],[O,z+Tt,.58],n,0);B(i,[X+.4,.12,.43],[O,z-H/2-.09,.55],s,0),Kf(i,O,z,X,H,n,r,s),F>=1&&Qf(i,O,z,X,H,Q,s,at,q)}for(const P of[-t/2+.35,t/2-.38]){Ot(i,.07,.07,e,[P,e/2,.53],r,[0,0,0],12);for(let F=1;F<e;F+=2)Ot(i,.087,.087,.055,[P,F,.53],U.rust,[0,0,0],12)}const L=new Ye({map:Zf(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[P,F]of[[-t/2,h-u-.5],[h+u+.5,t/2]].filter(([O,z])=>z-O>1))Pt(new he(F-P,.9),L,i,[(P+F)/2,.55,.345]);Pt(jc(.48,.64,c%4,2,2),f.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let P=0;P<22;P++){const F=P<11?-t/2+.55:t/2-.55,O=F+Math.sin(P*.55)*.26+(p()-.5)*.2;Pt(new Gi(.05+p()*.075,7),P%3?f.leafDark:f.green,i,[O,.5+P*.17,.355+p()*.04],[0,0,p()*Math.PI])}for(const P of[-t*.32,t*.3])B(i,[.78,.98,.78],[P,e+.48,-.05],n,0),B(i,[.94,.13,.94],[P,e+1.02,-.05],n,0),Ot(i,.09,.11,.24,[P-.16,e+1.19,-.05],U.rust,[0,0,0],10),Ot(i,.09,.11,.24,[P+.16,e+1.19,-.05],U.rust,[0,0,0],10);return Ot(i,.018,.018,1.42,[t*.12,e+.76,.18],U.black,[0,0,0],8),B(i,[.88,.025,.025],[t*.12,e+1.12,.18],U.black,0),B(i,[.58,.025,.025],[t*.12,e+1.36,.18],U.black,0),i}function Mu(i,t,e,n,s){B(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),B(i,[t+.1,.08,1.28],[0,e+.36,.34],Er(s),0),Pt(new $n(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),B(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])B(i,[.16,.2,.16],[r,e+.62,.95],U.rust,0)}function Er(i){return Er.mat||(Er.mat=i.clone(),Er.mat.color.offsetHSL(0,-.03,.04)),Er.mat}function v_(){const i=new ne;i.name="sky";const t=new Ce(55,32,18),e=[],n=new Yt("#6a5142"),s=new Yt("#253a55"),r=new Yt("#08111f");for(let A=0;A<t.attributes.position.count;A++){const T=me.smoothstep(t.attributes.position.getY(A)/55,-.04,.62);(T<.4?n.clone().lerp(s,T/.4):s.clone().lerp(r,(T-.4)/.6)).toArray(e,A*3)}t.setAttribute("color",new oe(e,3));const a=new qt(t,new Ye({vertexColors:!0,side:en,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=ue((A,T)=>{const S=A.createRadialGradient(T/2,T/2,0,T/2,T/2,T/2);S.addColorStop(0,"rgba(255,255,255,1)"),S.addColorStop(.34,"rgba(255,255,255,.86)"),S.addColorStop(.62,"rgba(255,255,255,.22)"),S.addColorStop(1,"rgba(255,255,255,0)"),A.fillStyle=S,A.fillRect(0,0,T,T)},64),l=ui(20261),c=105,h=[],f=[],p=new Yt("#e6efff"),u=new Yt("#ffe8c6"),m=new Yt("#bcd3ff");for(let A=0;A<c;A++){const T=l()*Math.PI*2,S=.9+Math.pow(l(),.65)*.58,M=49+l()*3,R=Math.cos(S);h.push(Math.sin(T)*R*M,Math.sin(S)*M,-Math.cos(T)*R*M);const L=l(),P=(L>.72?u:L>.34?p:m).clone(),F=me.clamp((S-.9)/.25,0,1),O=(.55+Math.pow(l(),1.4)*.45)*F;f.push(P.r*O,P.g*O,P.b*O)}const v=new Le;v.setAttribute("position",new oe(h,3)),v.setAttribute("color",new oe(f,3));const g=new G0(v,new wf({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Nr,fog:!1,toneMapped:!1,alphaTest:.01}));g.renderOrder=-20,g.frustumCulled=!1,g.name="sky-stars",i.add(g);const d=new D(-.16,.883,-.442).normalize(),x=d.clone().multiplyScalar(44),y=ue((A,T,S)=>{const M=T*.47,R=T/2,L=T/2;A.clearRect(0,0,T,T);const P=A.createRadialGradient(R-M*.22,L-M*.26,M*.06,R,L,M);P.addColorStop(0,"#fbfcf7"),P.addColorStop(.62,"#e6e9ee"),P.addColorStop(.9,"#cfd5e0"),P.addColorStop(1,"#b9c1cf"),A.fillStyle=P,A.beginPath(),A.arc(R,L,M,0,Math.PI*2),A.fill(),A.save(),A.beginPath(),A.arc(R,L,M,0,Math.PI*2),A.clip();for(let O=0;O<26;O++){const z=S()*Math.PI*2,X=Math.sqrt(S())*M*.92,H=R+Math.cos(z)*X,q=L+Math.sin(z)*X,Q=M*(.03+S()*.13),at=A.createRadialGradient(H,q,0,H,q,Q);at.addColorStop(0,`rgba(132,142,160,${.1+S()*.17})`),at.addColorStop(1,"rgba(132,142,160,0)"),A.fillStyle=at,A.beginPath(),A.arc(H,q,Q,0,Math.PI*2),A.fill()}for(let O=0;O<5;O++){const z=S()*Math.PI*2,X=Math.sqrt(S())*M*.62,H=R+Math.cos(z)*X,q=L+Math.sin(z)*X,Q=M*(.16+S()*.16),at=A.createRadialGradient(H,q,0,H,q,Q);at.addColorStop(0,"rgba(150,158,174,.16)"),at.addColorStop(1,"rgba(150,158,174,0)"),A.fillStyle=at,A.beginPath(),A.arc(H,q,Q,0,Math.PI*2),A.fill()}const F=A.createRadialGradient(R,L,M*.2,R,L,M);F.addColorStop(0,"rgba(255,255,255,0)"),F.addColorStop(.78,"rgba(150,162,186,.13)"),F.addColorStop(1,"rgba(96,110,138,.42)"),A.fillStyle=F,A.beginPath(),A.arc(R,L,M,0,Math.PI*2),A.fill(),A.restore()},256);y.colorSpace=qe;const _=new Eh(new rc({map:y,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));_.position.copy(x),_.scale.set(2.25,2.25,1),_.name="sky-moon",i.add(_);const E=ue((A,T)=>{const S=A.createRadialGradient(T/2,T/2,0,T/2,T/2,T/2);S.addColorStop(0,"rgba(226,236,255,.9)"),S.addColorStop(.22,"rgba(198,216,255,.34)"),S.addColorStop(.5,"rgba(170,196,255,.10)"),S.addColorStop(1,"rgba(150,180,255,0)"),A.fillStyle=S,A.fillRect(0,0,T,T)},128),b=new Eh(new rc({map:E,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:Nr,fog:!1,toneMapped:!1}));return b.position.copy(x).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:g,moon:_,glow:b,moonDirection:d.clone(),update(){}}}function x_(){const i=new Ce(1,18,14),t=i.attributes.position;for(let e=0;e<t.count;e++){const n=t.getX(e),s=t.getY(e),r=t.getZ(e),a=Math.sign(n)*Math.pow(Math.abs(n),.76),o=Math.sign(s)*Math.pow(Math.abs(s),.84),l=Math.sign(r)*Math.pow(Math.abs(r),.78),c=me.clamp((-l+1)*.5,0,1),h=.034+c*.011-Math.pow(c-.82,2)*.008,f=.0155-c*.0028;let p=a*h,u=o*f;const m=-.049+l*.052,v=(1-n*n)*.0048;u+=v,s<0&&(u+=(1-n*n)*(1-Math.abs(r))*.0022),t.setXYZ(e,p,u,m)}return i.computeVertexNormals(),i}function __(i="right"){const t=new ne;t.name="vr-gloved-hand",t.visible=!1;const e=new Dt({color:9599329,emissive:2366227,emissiveIntensity:.48,roughness:.72,metalness:.05}),n=new Dt({color:6573627,emissive:1511434,emissiveIntensity:.42,roughness:.85,metalness:.04}),s=new Dt({color:11507324,emissive:2760727,emissiveIntensity:.45,roughness:.66,metalness:.06}),r=new Dt({color:2634816,emissive:593428,emissiveIntensity:.42,roughness:.89,metalness:.03}),a=new Dt({color:1778734,emissive:461842,emissiveIntensity:.42,roughness:.9,metalness:.03}),o=new Dt({color:2305851,emissive:593944,emissiveIntensity:.4,roughness:.86,metalness:.04}),l=new Dt({color:3877922,emissive:1182728,emissiveIntensity:.4,roughness:.62,metalness:.16}),c=new Dt({color:1119773,emissive:263946,emissiveIntensity:.35,roughness:.35,metalness:.35}),h=new Dt({color:14923896,emissive:7227417,emissiveIntensity:.55,roughness:.34,metalness:.58}),f=new Ye({color:55639}),p=new Ye({color:14680214}),u=new qt(new Ce(.055,10,8),a);t.add(u);const m=new qt(new Te(.055,.046,1,12,1,!1),a);t.add(m);const v=new ne,g=new qt(new Ce(.046,12,10),a);g.scale.set(.96,1.02,1.04),v.add(g);const d=new qt(new tr(.041,.0055,6,14),o);d.rotation.x=Math.PI*.45,v.add(d),t.add(v);const x=new qt(new Te(.046,.039,1,14,1,!1),a);t.add(x);const y=new ne;t.add(y);const _=new qt(new Te(.0405,.0415,.026,14),o);_.rotation.x=Math.PI*.5,_.scale.set(1,1,.78),_.position.set(0,0,.03),y.add(_);const E=new qt(new Te(.0355,.0375,.03,14),r);E.rotation.x=Math.PI*.5,E.scale.set(1,1,.74),E.position.set(0,0,.013),y.add(E);const b=new qt(new Te(.0368,.0375,.018,14),l);b.rotation.x=Math.PI*.5,b.scale.set(1.02,1,.75),b.position.set(0,0,.012),y.add(b);const A=new ne,T=new qt(new $n(.031,.0045,.017),c);A.add(T);const S=new qt(new Ce(.0022,6,5),f);S.position.set(0,.0026,-.0042),A.add(S);const M=new qt(new Ce(.0022,6,5),p);M.position.set(0,.0026,.0042),A.add(M),y.add(A);const R=new qt(new Ce(.0056,8,6),h);y.add(R);const L=new ne;t.add(L);const P=new ne;L.add(P);const F=new ne;F.scale.setScalar(1.16),P.add(F);const O=new qt(new Ce(.028,10,8),e);O.scale.set(1.05,.68,.95),O.position.set(0,0,.002),F.add(O);const z=x_(),X=new qt(z,e);F.add(X);const H=new qt(new Ce(.038,12,10),n);H.scale.set(1.02,.25,1.12),H.position.set(0,-.0095,-.048),F.add(H);const q=new qt(new Ce(.021,10,8),n);q.scale.set(.84,.64,1.38),F.add(q);const Q=new qt(new Ce(.016,8,7),n);Q.scale.set(.7,.56,1.45),F.add(Q);const at=[-1,0,1].map(yt=>{const ot=new qt(new Te(.0017,.0019,.062,6),s);return ot.rotation.x=Math.PI*.5,F.add(ot),{mesh:ot,idx:yt}}),It=[{baseX:-.031,yOff:.0015,zOff:-.094,l1:.035,l2:.023,l3:.016,w:.019,splay:-.058},{baseX:-.01,yOff:.0035,zOff:-.098,l1:.039,l2:.026,l3:.017,w:.0198,splay:-.012},{baseX:.011,yOff:.002,zOff:-.095,l1:.036,l2:.024,l3:.016,w:.0188,splay:.028},{baseX:.03,yOff:-.002,zOff:-.088,l1:.029,l2:.019,l3:.015,w:.0168,splay:.075}].map(yt=>{const ot=new ne,vt=new qt(new Ce(yt.w*.53,8,7),e);vt.scale.set(1.04,.88,1.05),ot.add(vt);const Nt=new qt(new Te(yt.w*.52,yt.w*.45,yt.l1,9),e);Nt.rotation.x=Math.PI*.5,Nt.position.set(0,0,-yt.l1*.5),ot.add(Nt);const Et=new ne;Et.position.set(0,0,-yt.l1),Et.add(new qt(new Ce(yt.w*.45,8,6),e));const mt=new qt(new Te(yt.w*.45,yt.w*.39,yt.l2,9),e);mt.rotation.x=Math.PI*.5,mt.position.set(0,0,-yt.l2*.5),Et.add(mt);const Vt=new ne;Vt.position.set(0,0,-yt.l2),Vt.add(new qt(new Ce(yt.w*.39,8,6),e));const k=new qt(new Te(yt.w*.39,yt.w*.32,yt.l3,9),e);k.rotation.x=Math.PI*.5,k.position.set(0,0,-yt.l3*.5),Vt.add(k);const ft=new qt(new Ce(yt.w*.33,8,6),s);return ft.scale.set(1,.86,1.12),ft.position.set(0,-6e-4,-yt.l3),Vt.add(ft),Et.add(Vt),ot.add(Et),F.add(ot),{spec:yt,mcp:ot,pip:Et,dip:Vt}}),Ct=new ne;Ct.add(new qt(new Ce(.0155,8,7),e));const Gt=new qt(new Te(.015,.0122,.032,9),e);Gt.rotation.x=Math.PI*.5,Gt.position.set(0,0,-.016),Ct.add(Gt);const Y=new ne;Y.position.set(0,0,-.032),Y.add(new qt(new Ce(.0122,8,6),e));const tt=new qt(new Te(.012,.0102,.026,9),e);tt.rotation.x=Math.PI*.5,tt.position.set(0,0,-.013),Y.add(tt);const pt=new ne;pt.position.set(0,0,-.026),pt.add(new qt(new Ce(.0102,8,6),e));const wt=new qt(new Te(.01,.0084,.02,9),e);wt.rotation.x=Math.PI*.5,wt.position.set(0,0,-.01),pt.add(wt);const bt=new qt(new Ce(.0086,8,6),s);bt.scale.set(1,.85,1.12),bt.position.set(0,-6e-4,-.02),pt.add(bt),Y.add(pt),Ct.add(Y),F.add(Ct);let Xt=null,zt=.3,N=.6,st=0,nt=0,it=0,et=0;function dt(yt){const ot=yt==="left"?"left":"right";if(ot===Xt)return;Xt=ot;const vt=ot==="left"?-1:1;F.rotation.set(.05,vt*.06,vt*.24),q.position.set(-vt*.024,-.011,-.032),q.rotation.y=vt*.28,Q.position.set(vt*.027,-.01,-.043);for(const{mesh:Nt,idx:Et}of at){const mt=Et===0?.0195:.0178;Nt.position.set(vt*Et*.016,mt,-.049),Nt.rotation.y=-vt*Et*.042}for(const Nt of It)Nt.mcp.position.set(vt*Nt.spec.baseX,Nt.spec.yOff,Nt.spec.zOff);Ct.position.set(-vt*.039,-.005,-.028),Ct.rotation.set(.08,vt*.58,-vt*.24),A.position.set(-vt*.005,.0285,.012),A.rotation.z=vt*.12,R.position.set(vt*.027,.021,.012)}function ct(yt,ot,vt=0,Nt=0){const Et=Xt==="left"?-1:1;for(let Vt=0;Vt<It.length;Vt++){const k=It[Vt],ft=vt*Math.sin(st+Vt*.9)*.16,St=Vt*.048,Ft=me.clamp(yt+St+ft+Nt,.03,1.35);k.mcp.rotation.x=-Ft*.56,k.pip.rotation.x=-Ft*.78,k.dip.rotation.x=-Ft*.52,k.mcp.rotation.y=-Et*k.spec.splay*ot}const mt=me.clamp(yt*.85+Nt*.5,.02,1.15);Ct.rotation.x=.08-mt*.28,Ct.rotation.y=Et*(.58-mt*.24),Y.rotation.x=-mt*.44,pt.rotation.x=-mt*.52}dt(i),ct(zt,N,0,0);const _t=new D,$t=new D,Zt=new D,I=new D,w=new D,G=new D,$=new D,lt=new D,Z=new D,Lt=new D,gt=new ce,kt=new D(0,1,0);return{group:t,wristPivot:L,setHandSide:dt,getHandSide:()=>Xt,update(yt,{visible:ot=!1,handSide:vt=Xt,shoulderPos:Nt=null,elbowPos:Et=null,pos:mt={x:.16,y:-.22,z:-.5},vel:Vt={x:0,y:0,z:0},qArm:k=[0,0,0,1],reach:ft=.25,elbowBendDeg:St=60,overBin:Ft=!1,phase:xt="search",calmLowerProgress:rt=0,beaconActive:Ht=!1}={}){if(t.visible=ot,!ot)return;const Qt=Math.min(.1,yt||1/60);dt(vt);const ve=Xt==="left"?-1:1;et+=Qt*1.6;const fe=Math.sin(et)*7e-4;Zt.set(mt.x,mt.y+fe,mt.z),Nt?_t.set(Nt.x,Nt.y,Nt.z):_t.set(ve*.21,-.27,-.08),Et?$t.set(Et.x,Et.y+fe*.5,Et.z):$t.set(ve*.24,-.44,-.26),L.position.copy(Zt),L.quaternion.set(k[0],k[1],k[2],k[3]);const Nn=me.clamp(-Vt.y*.08,-.15,.15),bn=me.clamp(Vt.x*.07,-.13,.13),ar=1-Math.exp(-Qt*16);nt+=(Nn-nt)*ar,it+=(bn-it)*ar,P.rotation.set(nt,it,0),u.position.copy(_t),w.copy(_t).sub($t);const fi=Math.max(.08,w.length());m.position.copy($t).addScaledVector(w,.5),m.scale.set(.96,fi,.92),m.quaternion.setFromUnitVectors(kt,w.normalize()),v.position.copy($t),v.quaternion.copy(m.quaternion);const or=.92+me.clamp(St/120,0,1)*.16;d.scale.setScalar(or),G.copy(Zt).sub($t);const Jr=Math.max(.1,G.length());G.divideScalar(Jr),Lt.copy(G).negate(),$.set(0,1,0).applyQuaternion(L.quaternion),Z.copy($).addScaledVector(Lt,-$.dot(Lt)),Z.lengthSq()<1e-5&&Z.set(0,1,0),Z.normalize(),lt.crossVectors(Z,Lt).normalize(),Z.crossVectors(Lt,lt).normalize(),gt.makeBasis(lt,Z,Lt),y.position.copy(Zt),y.quaternion.setFromRotationMatrix(gt),I.copy(Zt).addScaledVector(Lt,.036),w.copy($t).sub(I);const Kr=Math.max(.06,w.length());x.position.copy(I).addScaledVector(w,.5),gt.makeBasis(lt,w.clone().normalize(),lt.clone().cross(w.clone().normalize()).normalize()),x.quaternion.setFromRotationMatrix(gt),x.scale.set(1,Kr,.78);let Fn=.28,di=.58,Xi=0;xt==="search"?ft>=.58&&Ft?(Fn=.14,di=1.05,Xi=1,st+=Qt*9.5):mt.y<-.34?(Fn=.48,di=.32):mt.y>.1?(Fn=.18,di=.9):(Fn=.32,di=.52):xt==="inspect"&&(Fn=.2+rt*.86,di=(1-rt)*.78+.15);const lr=1-Math.exp(-Qt*13);zt+=(Fn-zt)*lr,N+=(di-N)*lr,ct(zt,N,Xi,nt*.85),rt>.05?(h.emissive.setHex(8963184),h.emissiveIntensity=.6+rt*.95):Ht?(h.emissive.setHex(7121032),h.emissiveIntensity=.58):(h.emissive.setHex(7227417),h.emissiveIntensity=.45),f.color.setHex(Ht?65382:1993533),p.color.setHex(Ht?16711850:7020114)},dispose(){u.geometry.dispose(),m.geometry.dispose(),g.geometry.dispose(),d.geometry.dispose(),x.geometry.dispose(),_.geometry.dispose(),E.geometry.dispose(),b.geometry.dispose(),T.geometry.dispose(),R.geometry.dispose(),O.geometry.dispose(),z.dispose(),H.geometry.dispose(),q.geometry.dispose(),Q.geometry.dispose(),e.dispose(),n.dispose(),s.dispose(),r.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose(),h.dispose(),f.dispose(),p.dispose()}}}const vn=ui(137);function dl(i){i.updateWorldMatrix(!0,!0);const t=new ce().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new ce().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=Xf(s,!1);if(r){const a=new qt(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class y_{constructor(t){this.renderer=new vx({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=$u,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=qe,this.renderer.toneMapping=Rc,this.renderer.toneMappingExposure=1.12,this.scene=new sc,this.scene.background=new Yt("#16222f"),this.scene.fog=new kc("#1c2b3a",.0118),this.sky=v_(),this.scene.add(this.sky.group),this.camera=new tn(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new tn(62,1,.1,70),this.eyeR=new tn(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new D,this.baseCameraQuaternion=new Mn,this.lockedCameraQuaternion=new Mn,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null;const e=new uc(this.renderer),n=new wx;this.envTarget=e.fromScene(n,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.15,n.dispose(),e.dispose(),this.hemi=new Fh(9087958,1318439,1.12),this.scene.add(this.hemi);const s=new Ea(11127024,1.62);s.position.set(-6,11,2),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-6,s.shadow.camera.right=6,s.shadow.camera.top=7,s.shadow.camera.bottom=-6,s.shadow.normalBias=.012,s.shadow.bias=-25e-5,s.shadow.radius=3,this.scene.add(s),this.sun=s;const r=new Ea(5338012,.62);r.position.set(5,5,-4),this.scene.add(r),this.static=new ne,this.scene.add(this.static),xu(.5),this.buildCourtyard(),xu(1),dl(this.static),this.bin=new ne,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new qt(new he(1,1),new Ye({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new ne,this.silhouetteMat=new Ye({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new ne,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2),this.vrHand=__(),this.camera.add(this.vrHand.group),this.vrHandMode=!1,this.handInspectHeadBase=null,this.itemBaseRot=[0,0,0],this.tossGroup=new ne,this.scene.add(this.tossGroup),this.tossState=null;const a=ue((o,l)=>{const c=o.createRadialGradient(l/2,l/2,0,l/2,l/2,l/2);c.addColorStop(0,"rgba(3,7,11,.62)"),c.addColorStop(.55,"rgba(3,7,11,.34)"),c.addColorStop(1,"rgba(3,7,11,0)"),o.fillStyle=c,o.fillRect(0,0,l,l)},128);this.itemShadow=new qt(new he(1,1),new Ye({map:a,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new eo(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new eo(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new Dx(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new Wf,this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new ut,this.raycaster=new Up,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",o=>{this.reduced=o.matches,o.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildCourtyard(){const t=new Dt({...gu("courtyard-stone",[18,18]),normalScale:new ut(1.2,1.2),roughness:.7,metalness:.13,color:10133666});Pt(new he(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new Nf().load("./assets/plaster.jpg");e.colorSpace=qe,e.wrapS=e.wrapT=Vi,e.repeat.set(3,3),e.anisotropy=4;const n=new Dt({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new Dt({color:8225402,roughness:.9}),a=new Dt({color:10724502,roughness:.84}),o=new Dt({color:2897456,roughness:.78}),l=new Dt({color:2436659,metalness:.32,roughness:.74}),c=ue((d,x)=>{const y=d.createLinearGradient(0,0,x,x);y.addColorStop(0,"#788b91"),y.addColorStop(.48,"#495b60"),y.addColorStop(1,"#1d302c"),d.fillStyle=y,d.fillRect(0,0,x,x),d.save(),d.transform(1,.16,-.07,1,0,0);for(let E=-30;E<x;E+=94){d.fillStyle="#283b3a",d.fillRect(E,70,65,x);for(let b=94;b<x;b+=104)d.fillStyle="#83938b",d.globalAlpha=.24,d.fillRect(E+6,b,24,66),d.fillRect(E+34,b,24,66)}d.restore();const _=d.createLinearGradient(0,0,x,x*.8);_.addColorStop(0,"rgba(238,246,238,.20)"),_.addColorStop(.38,"rgba(238,246,238,.03)"),_.addColorStop(.62,"rgba(238,246,238,0)"),d.fillStyle=_,d.beginPath(),d.moveTo(0,x),d.lineTo(x*.52,0),d.lineTo(x*.78,0),d.lineTo(x*.24,x),d.closePath(),d.fill(),d.fillStyle="rgba(18,31,31,.55)",d.beginPath(),d.moveTo(0,82),d.lineTo(120,38),d.lineTo(150,38),d.lineTo(150,12),d.lineTo(178,12),d.lineTo(178,34),d.lineTo(335,66),d.lineTo(360,30),d.lineTo(386,30),d.lineTo(386,72),d.lineTo(512,96),d.lineTo(512,0),d.lineTo(0,0),d.closePath(),d.fill(),d.fillStyle="rgba(255,190,110,.5)";for(let E=0;E<24;E++)d.fillRect(28+E*67%470,150+E*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(d=>new Dt({color:d,map:c,metalness:.24,roughness:.28})),f=td,p=(d,x,y,_,E)=>{const b=new ne;b.position.set(...y),b.rotation.y=_,this.static.add(b),B(b,[d,x,.65],[0,x/2,0],E,0),B(b,[d,.75,.78],[0,.375,.025],r,0);for(const T of[3.2,6.15,9.1,12.1])B(b,[d,.14,.87],[0,T,.055],a,0),B(b,[d,.07,.98],[0,T+.09,.08],r,0);B(b,[d,.35,1.06],[0,x-.12,.05],a,0),o_(b,d,x,_===0?0:_>0?37:73),Mu(b,d,x,l,a);let A=Math.floor(d/2.45);for(let T=0;T<A;T++)for(let S=0;S<4;S++){let M=(T-(A-1)/2)*2.47,R=1.72+S*2.95;if(_===0&&S===0&&Math.abs(M+3.8)<1.2)continue;const L=1.16,P=1.91;B(b,[L+.26,P+.27,.14],[M,R,.38],a,0),B(b,[L+.05,P+.06,.1],[M,R,.47],o,0);const F=Gf(T,S,_===0?0:_>0?1:2),O=F==="lit"?f:h[(T+S)%h.length];B(b,[L,P,.04],[M,R,.54],O,0);for(const z of[-L/2,L/2,0])B(b,[.048,P,.09],[M+z,R,.58],r,0);for(const z of[-P/2,P/2,.24])B(b,[L,.047,.09],[M,R+z,.58],r,0);B(b,[L+.4,.12,.43],[M,R-P/2-.09,.55],a,0),Kf(b,M,R,L,P,r,o,a),Qf(b,M,R,L,P,F,a,O,(_>0?100:200)+S*10+T)}for(const T of[-d/2+.35,d/2-.38]){Ot(b,.07,.07,x,[T,x/2,.53],o,[0,0,0],12);for(let S=1;S<x;S+=2)Ot(b,.087,.087,.055,[T,S,.53],U.rust,[0,0,0],12)}for(let T=0;T<13;T++){const S=(vn()-.5)*d,M=.8+vn()*.3;B(b,[.2+vn()*.7,.06+vn()*.14,.02],[S,M,.335],r,0)}return b};p(20,14,[-8,0,1.5],Math.PI/2,s),p(20,14,[9,0,1.5],-Math.PI/2,n),p(20,13.5,[.5,0,11.6],Math.PI,n);const u=new ne;u.position.set(0,0,-7),this.static.add(u),g_(u,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:f,seed:101,gateX:1.55}),Mu(u,20,13.5,l,a);const m=new Dt({map:dc("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});B(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],U.black),Pt(new he(.75,.55),m,this.static,[-2.75,2.5,-6.465]),B(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),B(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let d=0;d<6;d++)B(this.static,[.45,.025,.015],[4.1,1.65+d*.07,-6.415],U.black,0);Ot(this.static,.036,.036,18,[0,5.35,-6.48],U.rust,[0,0,Math.PI/2],12);for(let d=0;d<2;d++){const x=new us([new D(-8,9+d,2),new D(0,7.8+d,1),new D(9,9+d,-1)]);Pt(new si(x,24,.012,4,!1),U.black,this.static)}for(const d of[-7.2,8.2])B(this.static,[.24,.17,22],[d,.065,0],r,.025);const v=new Dt({color:8350016,roughness:1,side:ze});for(let d=0;d<50;d++){let x=(vn()-.5)*13,y=(vn()-.5)*14;Pt(new Gi(.025+vn()*.035,5),v,this.static,[x,.008,y],[-Math.PI/2,vn()*3,vn()*6])}const g=new Dt({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let d=0;d<10;d++)Pt(new Gi(.55+vn(),40),g,this.static,[(vn()-.5)*10,.005,(vn()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+vn()*.45,1);this.buildProps(),c_(this.static,this.scene)}buildProps(){const t=this.static,e=new Dt({color:1647901,roughness:.64,metalness:.03,bumpMap:U.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of Vf){const f=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([m,v])=>new ut(m*h*1.7,v*h*1.55)),p=new xo(f,64),u=p.attributes.position;for(let m=0;m<u.count;m++){const v=u.getX(m),g=u.getY(m),d=u.getZ(m),x=Math.atan2(d,v),y=1+.08*Math.sin(x*13+g*12)+.045*Math.sin(x*21-g*7);u.setXYZ(m,v*y,g,d*y)}p.computeVertexNormals(),Pt(p,e,t,[l,.02,c]),be(t,.066*h,.018,[l,h*1.66,c],U.black,[Math.PI/2,0,0]);for(let m=0;m<3;m++)B(t,[.042,.16,.027],[l+Math.sin(m*2)*.04,h*1.84,c+Math.cos(m*2)*.035],e,.006,[.2,m*2,.23])}const n=new ne;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){be(n,.48,.038,[l,0,0],U.black),be(n,.44,.014,[l,0,0],U.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const f=new D(l,0,0),p=new D(l+Math.cos(h)*.44,Math.sin(h)*.44,0),u=new oc(f,p);Pt(new si(u,1,.004,3),U.silver,n)}}const s=(l,c)=>{const h=new D(...l),f=new D(...c);Pt(new si(new oc(h,f),1,.025,6),U.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);B(n,[.32,.07,.16],[-.23,.72,0],U.black),B(n,[.3,.035,.04],[.57,.86,0],U.silver);const r=new Dt({color:8090716,roughness:1});B(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)B(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],U.black,0);const a=fl("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=fl("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new Dt({...gu("steel-paint"),normalScale:new ut(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new Dt({color:2505773,roughness:.58,metalness:.06,bumpMap:U.leather.bumpMap,bumpScale:.007}),r=new $n(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let u=0;u<a.count;u++){let m=a.getY(u);const v=.9+(m+.8)*.0625;a.setX(u,a.getX(u)*v),a.setZ(u,a.getZ(u)*v),Math.abs(a.getZ(u))>.7&&a.setZ(u,a.getZ(u)+-.026*Math.exp(-((a.getX(u)-.35)**2+(m-.1)**2)*9))}r.computeVertexNormals(),Pt(r,e,t,[0,1.22,0]),B(t,[2.68,.105,1.83],[0,2.02,0],n,.035),B(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const u of[-1.08,1.08])B(t,[.055,1.51,.05],[u,1.2,.812],n,.008),B(t,[.055,1.5,.05],[u,1.2,-.813],n,.008);for(const u of[-.69,.69])B(t,[.044,1.22,.054],[u,1.26,.849],n,.008),B(t,[.044,1.22,.054],[u,1.26,-.849],n,.008);for(const u of[-1.275,1.275])B(t,[.06,.065,1.25],[u,1.65,0],n),B(t,[.065,1.3,.05],[u,1.23,.5],n),B(t,[.065,1.3,.05],[u,1.23,-.5],n),B(t,[.19,.18,.7],[u,1.7,0],n),B(t,[.06,.08,.6],[u*1.11,1.7,0],U.silver);for(const u of[-.95,.95])for(const m of[-.58,.58])B(t,[.15,.19,.12],[u,.35,m],U.silver),Ot(t,.18,.18,.15,[u,.19,m],U.black,[0,0,Math.PI/2],28),Ot(t,.067,.067,.16,[u,.19,m],U.silver,[0,0,Math.PI/2],24);this.lid=new ne,this.lid.position.set(0,2.08,-.92),t.add(this.lid),B(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let u=-4;u<=4;u++)B(this.lid,[.065,.07,1.66],[u*.27,.11,.94],n,.026);B(this.lid,[.65,.09,.1],[0,.045,1.99],U.black,.025);for(const u of[-.87,.87])Ot(t,.095,.095,.31,[u,2.06,-.93],U.silver,[0,0,Math.PI/2]);const o=ue((u,m,v)=>{u.fillStyle="#cac9ad",u.textAlign="center",u.font="bold 110px Arial",u.fillText("Т Б О",m/2,220),u.font="bold 82px Arial",u.fillText("№ 017",m/2,347),u.globalCompositeOperation="destination-out";for(let g=0;g<1600;g++)u.globalAlpha=v()*.7,u.fillRect(v()*m,v()*m,1+v()*4,1+v()*3)}),l=new Dt({map:o,transparent:!0,depthWrite:!1,roughness:.9});Pt(new he(.73,.56),l,t,[.62,1.31,.865]);const c=new Dt({map:dc("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});Pt(new he(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=ue((u,m)=>{u.fillStyle="#d3cdb5",u.fillRect(0,0,m,m),u.fillStyle="#93493c";for(let v=-m;v<m*2;v+=130)u.beginPath(),u.moveTo(v,0),u.lineTo(v+64,0),u.lineTo(v+m+64,m),u.lineTo(v+m,m),u.fill();cn(u,m,m,ui(25),5e3)}),f=new Dt({map:h,roughness:.75});for(const u of[-1.1,1.1])Pt(new he(.16,.53),f,t,[u,1.33,.847]);const p=ue((u,m)=>{const v=u.createRadialGradient(m/2,m/2,0,m/2,m/2,m*.48);v.addColorStop(0,"rgba(0,8,4,.8)"),v.addColorStop(.5,"rgba(0,8,4,.5)"),v.addColorStop(1,"rgba(0,8,4,0)"),u.fillStyle=v,u.fillRect(0,0,m,m)},128);Pt(new he(4.5,3.5),new Ye({map:p,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),p_(t,this.lid),t.remove(this.lid),dl(t),dl(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=me.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=me.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=me.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var c;this.dirty=!0;const t=innerWidth,e=innerHeight;this.renderer.setSize(t,e),this.camera.aspect=t/e;const n=t/e<.8;this.camera.fov=n?52:43;const s=!n&&e<=520&&t>650,r=!n&&!s&&t>1050;if(this.camera.position.set(s?4.15:r?4.3:n?2.6:4.2,s?2.65:r?3.4:n?3.5:3.55,s?8.1:r?7.4:n?10.3:7.8),this.camera.lookAt(s?.25:r?.6:n?.9:0,s?1.32:r?2.65:n?2.6:2.4,0),this.viewOverride){const{fov:h=this.camera.fov,position:f,target:p}=this.viewOverride;this.camera.fov=h,f&&this.camera.position.set(...f),p&&this.camera.lookAt(...p)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=n;const a=getComputedStyle(document.documentElement);if(this.stage=Sx(t,e,parseFloat(a.getPropertyValue("--safe-top"))||0,parseFloat(a.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const h=Math.min(t/2,e)*.72;this.stage={x:(t/2-h)/2,y:(e-h)/2,width:h,height:h}}const o=2*4.2*Math.tan(me.degToRad(this.camera.fov/2))/e;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-t/2)*o,(e/2-this.stage.y-this.stage.height/2)*o,-4.2);const l=this.vrStereo?62:this.camera.fov;this.inspectionVeil.scale.set(12*Math.tan(me.degToRad(l/2))*t/e,12*Math.tan(me.degToRad(l/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(c=this.pipeline)==null||c.resize(t,e,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new qn(new D(...t.min),new D(...t.max));e.applyMatrix4(new ce().makeRotationFromEuler(this.item.rotation));const n=e.getSize(new D).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(me.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):du(n,this.stage,innerHeight,this.camera.fov,4.2,innerWidth),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new qn(new D(...t.min),new D(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new D(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*innerWidth/2,y:(1-o.y)*innerHeight/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.vrHand&&(this.vrHand.group.visible=!1)),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,innerWidth,innerHeight),this.applyCameraPose(),this.resize(),this.dirty=!0}setVrHandMode(t){this.vrHandMode=!!t,!t&&this.vrHand&&(this.vrHand.group.visible=!1),t&&this.vrInspectLock&&this.unlockInspectionView(),this.dirty=!0}updateVrHand(t,e){if(!this.vrHand)return;const n=!!(this.vrStereo&&this.vrHandMode&&(e!=null&&e.visible));this.vrHand.update(t,{...e,visible:n}),n&&(this.dirty=!0)}handHitsBin(){var s,r;if(!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible))return this.gazeHitsBin();this.camera.updateMatrixWorld(!0),this.vrHand.wristPivot.updateMatrixWorld(!0);const e=this.vrHand.wristPivot.localToWorld(new D(0,0,-.15)).clone().sub(this.camera.position).normalize();if(this.raycaster.set(this.camera.position,e),this.raycaster.intersectObject(this.bin,!0).length>0)return!0;const n=new D(0,1.25,0).sub(this.camera.position).normalize();return e.angleTo(n)<=.44}setHandItemRotation(t=0,e=0,n=0){if(!this.item)return;const[s,r,a]=this.itemBaseRot||[0,0,0];this.targetX=me.clamp(s+t,-Math.PI,Math.PI),this.targetY=r+e,this.targetZ=me.clamp(a+n,-Math.PI,Math.PI),this.pose="hand",this.dirty=!0}launchDiscardToss(t={x:4.5,y:2.4,z:-6.5}){if(!this.item||this.reduced)return;this.camera.updateMatrixWorld(!0),this.item.updateMatrixWorld(!0);const e=new D,n=new Mn,s=new D;this.item.matrixWorld.decompose(e,n,s);const r=this.item.clone(!0);r.remove(this.silhouette),r.matrixAutoUpdate=!0,r.position.copy(e),r.quaternion.copy(n),r.scale.copy(s),this.tossGroup.clear(),this.tossGroup.add(r);const a=new D(t.x??4.5,t.y??2.4,t.z??-6.5).applyQuaternion(this.camera.quaternion);this.tossState={mesh:r,t:0,dur:.42,vx:a.x,vy:a.y,vz:a.z},this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&!this.vrHandMode&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=me.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=me.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else if(this.applyCameraPose(),this.vrStereo&&this.vrHandMode&&this.inspect&&this.handInspectHeadBase){const n=me.euclideanModulo(this.headLook.yaw-this.handInspectHeadBase.yaw+Math.PI,Math.PI*2)-Math.PI,s=this.headLook.pitch-this.handInspectHeadBase.pitch;this.itemAnchor.position.set(me.clamp(-n*2.4,-.95,.95),me.clamp(-s*2.4,-.7,.7),-4.2),this.updateItemLights()}return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.vrHandMode?this.vrInfo():(this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo())}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=innerWidth,e=innerHeight){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new D(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=innerWidth,e=innerHeight,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){var e,n,s,r,a,o,l;const t=me.radToDeg;return{stereo:!!this.vrStereo,handMode:!!this.vrHandMode,handSide:((n=(e=this.vrHand)==null?void 0:e.getHandSide)==null?void 0:n.call(e))||"right",handVisible:!!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible),handPosition:((l=(o=(a=this.vrHand)==null?void 0:a.wristPivot)==null?void 0:o.position)==null?void 0:l.toArray().map(c=>+c.toFixed(3)))||null,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),targetZ:+t(this.targetZ||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(c=>+c.toFixed(5))}}hitBin(t,e){return this.pointer.set(t/innerWidth*2-1,-e/innerHeight*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}binScreen(){this.camera.updateMatrixWorld(!0);const t=new D(0,1.2,0).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new D(-1.26,1.12,.22).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,fl(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.vrStereo||(this.headLook={yaw:0,pitch:0}),this.handInspectHeadBase={...this.headLook},this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=jn[t].lamp??17,this.itemRim.intensity=jn[t].rim??18,this.updateItemLights(),this.item.rotation.set(...jn[t].rotation),this.itemBaseRot=[...jn[t].rotation],this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new qt(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&!this.vrHandMode&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.handInspectHeadBase=null,this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=fu(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=jn[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=bx(this.itemId,t),this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=me.clamp(Math.round((this.zoom+t)*100)/100,no.min,no.max),this.dirty=!0,this.zoom}rotate(t,e){this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=me.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.5)),this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new sc;o.background=new Yt("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new Fh(15069183,8288624,1.1));const l=new Ea(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new Ea(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new Sn(160,160,{type:li}),f=new Sn(160,160,{depthBuffer:!1}),p=this.renderer.getRenderTarget(),u=this.renderer.getClearColor(new Yt),m=this.renderer.getClearAlpha();let v;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...jn[t].rotation),e.scale.setScalar(1);const g=e.userData.bounds,d=new qn(new D(...g.min),new D(...g.max));d.applyMatrix4(new ce().makeRotationFromEuler(e.rotation));const x=d.getSize(new D).multiplyScalar(.5);e.scale.setScalar(du(x,{x:8,y:12,width:144,height:136},160,34));const y=new tn(34,1,.1,20);y.position.set(0,0,4.2),y.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,y),this.thumbnailOutput.render(this.renderer,f,h);const _=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(f,0,0,160,160,_);const E=document.createElement("canvas");E.width=E.height=160;const b=E.getContext("2d"),A=b.createImageData(160,160);for(let T=0;T<160;T++)A.data.set(_.subarray((159-T)*640,(160-T)*640),T*640);b.putImageData(A,0,0),v=E.toDataURL("image/png"),this.thumbCache.set(t,v)}finally{this.renderer.setRenderTarget(p),this.renderer.setClearColor(u,m),f.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return v}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.tossState){const n=this.tossState;n.t+=t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.vy-=14*t,n.mesh.rotation.x+=t*9,n.mesh.rotation.z-=t*7,n.mesh.scale.multiplyScalar(Math.max(.82,1-t*2.2)),this.dirty=!0,n.t>=n.dur&&(this.tossGroup.clear(),this.tossState=null)}if(this.item){const n=this.item.rotation.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.item.rotation.y=me.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=me.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=me.lerp(this.item.rotation.z,this.targetZ,s),n.equals(this.item.rotation)||this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/xx),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||fu(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const un=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],ed={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},nd="white-night-finds-v1";function qr(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>un.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>un.some(e=>e.id===t)).slice(0,3):[]}}function M_(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*un.reduce((e,n)=>e+n.weight,0);return un.find(e=>(t-=e.weight)<0)??un.at(-1)}function wo(i,t){if(t.type==="reset")return qr();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=un.some(n=>n.id===t.itemId)?t.itemId:un[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function S_(i){try{const t=JSON.parse(i.getItem(nd)||"{}");return qr((t==null?void 0:t.version)===1?t:{})}catch{return qr()}}function b_(i,t){try{return i.setItem(nd,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const zs=Math.PI/180,w_=new Mn(-Math.sqrt(.5),0,0,Math.sqrt(.5)),T_=new D(0,0,1);class E_{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new Mn,this.qNow=new Mn,this.qScreen=new Mn,this.relQ=new Mn,this.euler=new Un(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){return this.euler.set(e*zs,t*zs,-n*zs,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(w_),this.qScreen.setFromAxisAngle(T_,-s*zs),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(e)||!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.baseQ.copy(this.qNow),this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/zs).toFixed(2),pitchDeg:+(this.raw.pitch/zs).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Hn=Math.PI/180,Jn=(i,t,e)=>Math.min(e,Math.max(t,i)),Fi=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},A_=1.5,R_=.5,C_=.14,P_=.05,I_=9,L_=.3,D_=.75,U_=3,Su=20*Hn,bu=15*Hn,wu=6*Hn,N_=.35,F_=3,O_=.6,Tu=1.2,Eu=.8,Au=12*Hn;class z_{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-45,pitchMaxDeg:n=62}={}){this.yawLimit=Math.abs(t)*Hn,this.pitchMin=Math.min(e,n)*Hn,this.pitchMax=Math.max(e,n)*Hn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=Jn(t,-this.yawLimit,this.yawLimit),this.pitch=Jn(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=Jn(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>F_&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=O_?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=Jn(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=Jn(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=Fi(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=Jn(I_*Math.max(e,1/60),L_,D_);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(Fi(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=U_&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(Fi(t.yaw-this.yaw))>Su||Math.abs(t.pitch-this.pitch)>bu,s=!this.anchorTrack||Math.abs(Fi(t.yaw-this.anchorTrack.yaw))>Su||Math.abs(t.pitch-this.anchorTrack.pitch)>bu;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(Fi(t.yaw-this.anchorCandidate.yaw))<=wu&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=wu?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=N_?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(Fi(t.yaw-e.yaw))<=Au&&Math.abs(t.pitch-e.pitch)<=Au}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=Jn(Fi(t.yaw-this.yaw)*n,-Tu*e,Tu*e),this.pitch+=Jn((t.pitch-this.pitch)*n,-Eu*e,Eu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?A_:R_,r=n?C_:P_,a=1-Math.exp(-s*e);this.yaw+=Jn(Fi(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=Jn((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Hn).toFixed(2),pitchDeg:+(this.pitch/Hn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Hn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Hn).toFixed(2)}:null}}}const Bn=Math.PI/180,ka=240,Ba=180,k_=62,B_=48,H_=.15,V_=.3,G_=900,W_=120,Ru=(i,t,e)=>Math.min(e,Math.max(t,i));function ro(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function X_(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,f=-1e9,p=0,u=0,m=0;for(let x=0;x<e;x++)for(let y=0;y<t;y++){const _=(x*t+y)*4,{hue:E,sat:b,val:A,chroma:T}=ro(i[_],i[_+1],i[_+2]);if(E<0)continue;let S=Math.abs(E-n);if(S>180&&(S=360-S),S>30||b<14||A<40||T<40)continue;m++,b>p&&(p=b),T>u&&(u=T);const M=(1-S/30)*(b/100);s+=y*M,r+=x*M,a+=M,o++,y<l&&(l=y),y>c&&(c=y),x<h&&(h=x),x>f&&(f=x)}if(o<15||a<=0)return{found:!1,bright:m,n:o};const v=c-l+1,g=f-h+1,d=o/Math.max(1,v*g);return v>t*.75||g>e*.75?{found:!1,bright:m,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:m,n:o,bbW:v,bbH:g,fill:d,maxSat:p,maxChroma:u,minX:l,maxX:c,minY:h,maxY:f}}function q_(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function Cu(i,t,e){return{yaw:-(i-e.x)*k_*Bn,pitch:(t-e.y)*B_*Bn}}function Y_(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class $_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=ka,this.canvas.height=Ba),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<W_)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,ka,Ba);const n=this.ctx.getImageData(0,0,ka,Ba);return this.processImageData(n.data,ka,Ba,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,f,p,u;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let m=0;m<2;m++){const v=this.markers[m],g=X_(t,e,n,this.defs[m].hue),d=((f=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:f[m])||null;if(v.hue=this.defs[m].hue,v.blob=g,v.found=!!g.found,v.shapeOk=Y_(g,d,e,n),g.found){v.u=g.cx/Math.max(1,e),v.v=g.cy/Math.max(1,n),v.raw=Cu(v.u,v.v,o);const x=(u=(p=this.calibration)==null?void 0:p.baseRaw)==null?void 0:u[m];v.delta=x?{yaw:v.raw.yaw-x.yaw,pitch:v.raw.pitch-x.pitch}:{...v.raw}}this.updateEntity(v,g.found&&v.shapeOk,s),v.usable=!!g.found&&v.entity&&v.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=H_*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=V_*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/Bn;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/Bn,(t.delta.pitch-e.delta.pitch)/Bn);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,f)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(f.delta.yaw-l.yaw,f.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*Bn;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*Bn){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*Bn){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>Cu(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/Bn;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>G_?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=Ru(Math.round((t-n.left)/n.width*(r-1)),0,r-1),l=Ru(Math.round((e-n.top)/n.height*(a-1)),0,a-1);let c=null;for(let h=Math.max(0,l-4);h<=Math.min(a-1,l+4);h++)for(let f=Math.max(0,o-4);f<=Math.min(r-1,o+4);f++){const p=(h*r+f)*4,u=ro(s[p],s[p+1],s[p+2]);u.hue>=0&&(!c||u.chroma>c.chroma)&&(c=u)}return c?{hue:c.hue,sat:c.sat,val:c.val,chroma:c.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(m=>m.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=q_(a),h=Math.round((s.u??.5)*e),f=Math.round((s.v??.5)*n),p=Math.max(4,Math.round(s.w??56)),u=Math.max(4,Math.round(s.h??28));for(let m=Math.max(0,f-Math.floor(u/2));m<Math.min(n,f+Math.ceil(u/2));m++)for(let v=Math.max(0,h-Math.floor(p/2));v<Math.min(e,h+Math.ceil(p/2));v++){const g=(m*e+v)*4;t[g]=o,t[g+1]=l,t[g+2]=c,t[g+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/Bn).toFixed(2),pitchDeg:+(e.pitch/Bn).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const Ha=Math.PI/180;class Z_{constructor(t=null){this.gyro=new E_,this.fusion=new z_,this.tracker=new $_(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/Ha).toFixed(2),pitchDeg:+(this.look.pitch/Ha).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/Ha).toFixed(2),pitchDeg:+(this.markerSample.pitch/Ha).toFixed(2)}}}}const J_=Math.PI/180;class K_{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/J_,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const ks=200,Bs=150,j_=90,_i=8,Qi=6,Q_=400;function Pu(i,t){const e=Math.abs(i-t)%360;return e>180?360-e:e}function Iu(i,t,e,n,s=34){const r=t/_i,a=e/Qi,o=new Float64Array(_i*Qi),l=new Float64Array(_i*Qi),c=new Float64Array(_i*Qi);for(let O=0;O<e;O++){const z=Math.min(Qi-1,O/a|0),X=O*t*4;for(let H=0;H<t;H++){const q=X+H*4,Q=i[q],at=i[q+1],Tt=i[q+2],{hue:It,sat:Ct,val:Gt,chroma:Y}=ro(Q,at,Tt);if(It<0||Gt<72)continue;const tt=Gt>=205?20:36,pt=Gt>=205?34:52;if(Ct<tt||Y<pt)continue;const wt=Pu(It,n);if(wt>s)continue;const bt=(1-wt/(s+1))*(.35+Ct/100*.65)*Math.pow(Gt/255,1.35),Xt=z*_i+Math.min(_i-1,H/r|0);o[Xt]+=bt,l[Xt]+=H*bt,c[Xt]+=O*bt}}let h=0,f=t*.5,p=e*.5;for(let O=0;O<Qi;O++)for(let z=0;z<_i;z++){let X=0,H=0,q=0;for(let Q=0;Q<=1&&O+Q<Qi;Q++)for(let at=0;at<=1&&z+at<_i;at++){const Tt=(O+Q)*_i+(z+at);X+=o[Tt],H+=l[Tt],q+=c[Tt]}X>h&&(h=X,f=H/X,p=q/X)}if(h<1.2)return{found:!1,count:0};const u=Math.max(22,Math.round(Math.min(t,e)*.24)),m=Math.max(0,Math.floor(f-u)),v=Math.min(t-1,Math.ceil(f+u)),g=Math.max(0,Math.floor(p-u)),d=Math.min(e-1,Math.ceil(p+u));let x=0,y=0,_=0,E=0,b=t,A=-1,T=e,S=-1;for(let O=g;O<=d;O++){const z=O*t*4;for(let X=m;X<=v;X++){if(Math.hypot(X-f,O-p)>u)continue;const H=z+X*4,q=i[H],Q=i[H+1],at=i[H+2],{hue:Tt,sat:It,val:Ct,chroma:Gt}=ro(q,Q,at);if(Tt<0||Ct<72)continue;const Y=Ct>=205?20:36,tt=Ct>=205?34:52;if(It<Y||Gt<tt)continue;const pt=Pu(Tt,n);if(pt>s)continue;const wt=(1-pt/(s+1))*(.35+It/100*.65)*(Ct/255);x+=X*wt,y+=O*wt,_+=wt,E++,X<b&&(b=X),X>A&&(A=X),O<T&&(T=O),O>S&&(S=O)}}if(E<7||_<=0)return{found:!1,count:0};const M=A-b+1,R=S-T+1,L=E/Math.max(1,M*R);if(M>t*.45||R>e*.45||L<.25)return{found:!1,count:0};const P=x/_,F=y/_;return{found:!0,count:E,u:(P+.5)/t,v:(F+.5)/e,bbW:M,bbH:R,fill:L}}class t2{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.synthetic=!1,this.error=null,this.distalHue=144,this.proximalHue=320,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=ks,this.canvas.height=Bs),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastProcessAt=0,this.processMs=0,this.lastPairAt=-1e4,this.lastPairPos={u:.5,v:.55,spanNorm:.12},this.latest={status:"none",u:.5,v:.55,spanNorm:0,rollRad:0,distalFound:!1,proximalFound:!1,ts:0}}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}this.video&&this.video.srcObject&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}analyzeRgba(t,e=ks,n=Bs,s=performance.now()){const r=Iu(t,e,n,this.distalHue),a=Iu(t,e,n,this.proximalHue);return this._commitSpots(r,a,e,n,s)}_commitSpots(t,e,n,s,r){const a=s/n;if(t.found&&e.found){const l=t.u-e.u,c=(t.v-e.v)*a,h=Math.hypot(l,c),f=Math.max(1,t.count||1),p=Math.max(1,e.count||1),u=Math.max(f/p,p/f);if(h>=.018&&h<=.58&&u<=9){const m=(t.u+e.u)*.5,v=(t.v+e.v)*.5;return this.lastPairAt=r,this.lastPairPos={u:m,v,spanNorm:h},this.latest={status:"pair",u:m,v,spanNorm:h,rollRad:Math.atan2(-c,l),distalFound:!0,proximalFound:!0,ts:r},this.latest}}const o=t.found?t:e.found?e:null;return o&&r-this.lastPairAt<=Q_&&Math.hypot(o.u-this.lastPairPos.u,o.v-this.lastPairPos.v)<=.2?(this.latest={status:"single",u:o.u,v:o.v,spanNorm:this.lastPairPos.spanNorm,rollRad:this.latest.rollRad,distalFound:!!t.found,proximalFound:!!e.found,ts:r},this.latest):(this.latest={...this.latest,status:"none",distalFound:!1,proximalFound:!1},this.latest)}process(t=!1,e=performance.now()){if(this.synthetic)return this.latest;if(!this.running||!this.video||!this.ctx||this.video.readyState<2)return this.latest;if(!t&&e-this.lastProcessAt<j_)return this.latest;const n=performance.now();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,ks,Bs);const s=this.ctx.getImageData(0,0,ks,Bs);this.analyzeRgba(s.data,ks,Bs,e)}catch{}return this.processMs=+(performance.now()-n).toFixed(2),this.latest}inject({distal:t=null,proximal:e=null}={},n=performance.now()){this.synthetic=!0,this.running=!0;const s=t?{found:!0,u:t.u,v:t.v,count:t.count??90}:{found:!1,count:0},r=e?{found:!0,u:e.u,v:e.v,count:e.count??90}:{found:!1,count:0};return this._commitSpots(s,r,ks,Bs,n)}sample(t=performance.now()){const e=this.latest.ts?t-this.latest.ts:1/0;return{...this.latest,fresh:e<=450&&this.latest.status!=="none",ageMs:Number.isFinite(e)?Math.round(e):null}}info(){const t=this.sample();return{running:this.running,synthetic:this.synthetic,error:this.error,status:t.status,fresh:t.fresh,u:+t.u.toFixed(3),v:+t.v.toFixed(3),spanNorm:+t.spanNorm.toFixed(4),rollDeg:+(t.rollRad*180/Math.PI).toFixed(1),distalFound:t.distalFound,proximalFound:t.proximalFound,processMs:this.processMs}}}const Ue=Math.PI/180,ns=180/Math.PI,mc=.33,gc=.31;function ee(i,t,e){return i<t?t:i>e?e:i}function Si([i,t,e,n]){const s=Math.hypot(i,t,e,n);return s<1e-9?[0,0,0,1]:[i/s,t/s,e/s,n/s]}function yi([i,t,e,n]){return[-i,-t,-e,n]}function xn(i,t){const[e,n,s,r]=i,[a,o,l,c]=t;return[r*a+e*c+n*l-s*o,r*o-e*l+n*c+s*a,r*l+e*o-n*a+s*c,r*c-e*a-n*o-s*l]}function pl([i,t,e],n){const s=Math.hypot(i,t,e);if(s<1e-9)return[0,0,0,1];const r=n*.5,a=Math.sin(r)/s;return[i*a,t*a,e*a,Math.cos(r)]}function Qe(i,t){const[e,n,s,r]=i,[a,o,l]=t,c=r*a+n*l-s*o,h=r*o+s*a-e*l,f=r*l+e*o-n*a,p=-e*a-n*o-s*l;return[c*r+p*-e+h*-s-f*-n,h*r+p*-n+f*-e-c*-s,f*r+p*-s+c*-n-h*-e]}function e2(i,t){const e=Math.abs(i[0]*t[0]+i[1]*t[1]+i[2]*t[2]+i[3]*t[3]);return 2*Math.acos(ee(e,0,1))}function Lu(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function Ar(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function bi(i){const t=Math.hypot(i[0],i[1],i[2]);return t<1e-9?[1,0,0]:[i[0]/t,i[1]/t,i[2]/t]}function Du(i,t,e){const n=i[0],s=t[0],r=e[0],a=i[1],o=t[1],l=e[1],c=i[2],h=t[2],f=e[2],p=n+o+f;let u,m,v,g;if(p>0){const d=Math.sqrt(p+1)*2;g=.25*d,u=(h-l)/d,m=(r-c)/d,v=(a-s)/d}else if(n>o&&n>f){const d=Math.sqrt(1+n-o-f)*2;g=(h-l)/d,u=.25*d,m=(s+a)/d,v=(r+c)/d}else if(o>f){const d=Math.sqrt(1+o-n-f)*2;g=(r-c)/d,u=(s+a)/d,m=.25*d,v=(l+h)/d}else{const d=Math.sqrt(1+f-n-o)*2;g=(a-s)/d,u=(r+c)/d,m=(l+h)/d,v=.25*d}return Si([u,m,v,g])}function n2([i,t,e,n]){const s=2*(i*e-n*t),r=2*(t*e+n*i),a=1-2*(i*i+t*t),o=2*(i*t-n*e),l=1-2*(i*i+e*e),c=2*(i*e+n*t),h=Math.asin(-ee(r,-1,1));let f=0,p=0;return Math.abs(r)<.9999?(f=Math.atan2(c,a),p=Math.atan2(o,l)):f=Math.atan2(-s,1-2*(i*i+e*e)),{yaw:f,pitch:h,roll:p}}function i2(i,t,e=mc,n=gc,s=[.42,-.88,.2]){const r=i.x??i[0]??0,a=i.y??i[1]??0,o=i.z??i[2]??0,l=t.x??t[0]??0,c=t.y??t[1]??0,h=t.z??t[2]??0,f=l-r,p=c-a,u=h-o,m=Math.hypot(f,p,u),v=Math.abs(e-n)+.045,g=e+n-.008,d=ee(m,v,g),x=m>1e-6?f/m:0,y=m>1e-6?p/m:0,_=m>1e-6?u/m:-1,E={x:r+x*d,y:a+y*d,z:o+_*d},b=(e*e-n*n+d*d)/(2*d),A=Math.sqrt(Math.max(0,e*e-b*b)),T=bi(s),S=T[0]*x+T[1]*y+T[2]*_;let M=T[0]-S*x,R=T[1]-S*y,L=T[2]-S*_,P=Math.hypot(M,R,L);if(P<1e-5){const X=Ar([x,y,_],[1,0,0]),H=bi(X);M=H[0],R=H[1],L=H[2],P=1}else M/=P,R/=P,L/=P;const F={x:r+x*b+M*A,y:a+y*b+R*A,z:o+_*b+L*A},O=ee((e*e+n*n-d*d)/(2*e*n),-1,1),z=(Math.PI-Math.acos(O))*ns;return{shoulder:{x:r,y:a,z:o},elbow:F,wrist:E,elbowBendDeg:z,clampedDist:d}}class s2{constructor(t="right"){const e=typeof t=="string"?t:t==null?void 0:t.handSide;this.handSide=e==="left"?"left":"right",this.qStretch=null,this.qBend=null,this.qBasis=[0,0,0,1],this.qRefInv=[0,0,0,1],this.bendSpanRad=52*Ue,this.bendInwardYawRad=0,this.yawTrimRad=0,this.calibratedStep=0;const n=this._defaultBeaconU();this.beaconFar={u:n,v:.54,span:.105,captured:!1},this.beaconNear={u:n,v:.64,span:.235,captured:!1},this.lastSensor=null,this.prevQuat=null,this.torsoYaw=0;const s=this.sideSign;this.torsoWristPos={x:s*.16,y:-.22,z:-.5},this.torsoWristVel={x:0,y:0,z:0},this.qArm=[0,0,0,1],this.qArmTorso=[0,0,0,1],this.shoulderPos={x:s*.21,y:-.27,z:-.08},this.elbowPos={x:s*.24,y:-.44,z:-.26},this.pos={x:s*.16,y:-.22,z:-.5},this.vel={x:0,y:0,z:0},this.elbowBendDeg=68,this.reach=.25,this.elevationDeg=0,this.screenFacingCos=.85,this.trackingSource="idle",this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.lastPokeAt=-1e3,this.dwellAccumSec=0,this.inspectBaseQ=null,this.inspectEnteredAt=0,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0,this.lastDecisionAt=-2e3}get sideSign(){return this.handSide==="left"?-1:1}_defaultBeaconU(){return this.handSide==="left"?.46:.54}setHandSide(t){const e=t==="left"?"left":"right";if(e===this.handSide)return this.handSide;this.handSide=e;const n=this.sideSign;return this.beaconFar.captured||(this.beaconFar.u=this._defaultBeaconU()),this.beaconNear.captured||(this.beaconNear.u=this._defaultBeaconU()),this.torsoWristPos={x:n*Math.abs(this.torsoWristPos.x),y:this.torsoWristPos.y,z:this.torsoWristPos.z},this.torsoWristVel={x:0,y:0,z:0},this.shoulderPos={x:n*.21,y:-.27,z:-.08},this.elbowPos={x:n*.24,y:-.44,z:-.26},this.pos={x:n*Math.abs(this.pos.x),y:this.pos.y,z:this.pos.z},this.vel={x:0,y:0,z:0},this.handSide}exportCalibration(){return this.calibratedStep<2?null:{handSide:this.handSide,qStretch:this.qStretch,qBend:this.qBend,qBasis:this.qBasis,qRefInv:this.qRefInv,bendSpanRad:this.bendSpanRad,bendInwardYawRad:this.bendInwardYawRad,beaconFar:this.beaconFar,beaconNear:this.beaconNear}}importCalibration(t){return!t||!Array.isArray(t.qBasis)||!Array.isArray(t.qRefInv)?!1:((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.qStretch=t.qStretch||[0,0,0,1],this.qBend=t.qBend||[0,0,0,1],this.qBasis=Si(t.qBasis),this.qRefInv=Si(t.qRefInv),this.bendSpanRad=ee(Number(t.bendSpanRad)||52*Ue,15*Ue,125*Ue),this.bendInwardYawRad=Number(t.bendInwardYawRad)||0,t.beaconFar&&(this.beaconFar={...this.beaconFar,...t.beaconFar}),t.beaconNear&&(this.beaconNear={...this.beaconNear,...t.beaconNear}),this.calibratedStep=2,this.yawTrimRad=0,!0)}feedSensor(t){!t||!Array.isArray(t.q)||t.q.length!==4||((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.lastSensor={q:Si(t.q),linMag:Math.max(0,Number(t.linMag)||0),rotRate:Math.max(0,Number(t.rotRate)||0),acc:Array.isArray(t.acc)?t.acc:[0,0,0],ts:t.ts??performance.now()})}calibrateStretchPose(t=this.lastSensor,e=null){if(!(t!=null&&t.q))return{ok:!1,message:"Нет сигнала от гироскопа на запястье. Подключите браслет."};this.qStretch=Si(t.q);const n=bi(Qe(yi(this.qStretch),[0,1,0]));let s=[0,0,1];Math.abs(Lu(s,n))>.9&&(s=[0,1,0]);const r=bi(Ar(n,s)),a=bi(Ar(r,n));this.qBasis=Du(r,n,a),this.qRefInv=yi(xn(this.qStretch,this.qBasis)),this.yawTrimRad=0,this.torsoYaw=0;const o=this._defaultBeaconU();e&&e.fresh&&e.spanNorm>.015?this.beaconFar={u:ee(e.u,.12,.88),v:ee(e.v,.12,.88),span:ee(e.spanNorm,.02,.42),captured:!0}:this.beaconFar={u:o,v:.54,span:.105,captured:!1},this.calibratedStep=1;const l=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:1,beaconCaptured:this.beaconFar.captured,message:`Шаг 1 записан (прямая ${l}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`}}calibrateBendPose(t=this.lastSensor,e=null){if(!this.qStretch)return{ok:!1,message:"Сначала выполните Шаг 1 — вытяните прямую руку вперёд."};if(!(t!=null&&t.q))return{ok:!1,message:"Нет свежего сигнала гироскопа с браслета."};const n=Si(t.q),s=xn(yi(this.qStretch),n),r=s[3]<0?-1:1;s[0]*r,s[1]*r,s[2]*r;const a=ee(s[3]*r,-1,1);if(2*Math.acos(ee(a,0,1))<12*Ue)return{ok:!1,message:"Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз."};const l=bi(Qe(yi(this.qStretch),[0,1,0])),c=bi(Qe(yi(n),[0,1,0])),h=ee(Lu(c,l),-1,1),f=[c[0]-h*l[0],c[1]-h*l[1],c[2]-h*l[2]],p=Math.hypot(f[0],f[1],f[2]);if(p<Math.sin(13*Ue))return{ok:!1,message:"Поднимите предплечье в локте вверх хотя бы на 20° выше горизонтали (не выворачивая кисть)."};const u=[f[0]/p,f[1]/p,f[2]/p],m=[-u[0],-u[1],-u[2]],v=bi(Ar(l,m)),g=bi(Ar(m,v)),d=Du(v,g,m),x=yi(xn(this.qStretch,d)),y=xn(x,xn(n,d)),_=Qe(y,[0,0,-1]),E=Math.atan2(p,h);this.qBend=n,this.qBasis=d,this.qRefInv=x,this.bendSpanRad=ee(E,18*Ue,115*Ue),this.bendInwardYawRad=Math.atan2(_[0],Math.max(.15,-_[2])),this.yawTrimRad=0,e&&e.fresh&&e.spanNorm>this.beaconFar.span*1.12?this.beaconNear={u:ee(e.u,.1,.9),v:ee(e.v,.1,.92),span:ee(e.spanNorm,this.beaconFar.span+.04,.58),captured:!0}:this.beaconNear={u:ee(this.beaconFar.u-this.sideSign*.03,.15,.85),v:ee(this.beaconFar.v+.1,.2,.9),span:ee(this.beaconFar.span*1.95,this.beaconFar.span+.07,.45),captured:!1},this.calibratedStep=2;const b=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:2,handSide:this.handSide,bendDeg:+(E*ns).toFixed(1),beaconCaptured:this.beaconFar.captured&&this.beaconNear.captured,message:`Калибровка готова (${b}, сгиб ${Math.round(E*ns)}°). Можно надевать очки!`}}recenterOnSessionStart(t=performance.now()){var a;if(this.torsoYaw=0,!((a=this.lastSensor)!=null&&a.q)||!this.qStretch||t-this.lastSensor.ts>2e3)return;const e=Si(xn(this.qRefInv,xn(this.lastSensor.q,this.qBasis))),n=Qe(e,[0,0,-1]);if(Math.hypot(n[0],n[2])<.35)return;const r=Math.atan2(n[0],-n[2]);Math.abs(r)>22*Ue&&(this.yawTrimRad=r)}onPhaseChange(t,e=performance.now()){t==="inspect"?(this.inspectBaseQ=[...this.qArmTorso],this.inspectEnteredAt=e,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0):(this.inspectBaseQ=null,this.calmLowerSec=0),t==="search"&&(this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0)}update(t,{beacon:e=null,phase:n="search",revealReady:s=!1,handOverBin:r=!0,headLook:a={yaw:0,pitch:0},now:o=performance.now()}={}){const l=ee(t||.016666666666666666,.001,.1),c=this.lastSensor;if(!(c!=null&&c.q))return this.trackingSource="idle",this.snapshot({pokes:0,decision:null,throwVel:null});this.qStretch||this.calibrateStretchPose(c,e);const h=this.sideSign,f=Number.isFinite(a==null?void 0:a.yaw)?a.yaw:0,p=Number.isFinite(a==null?void 0:a.pitch)?a.pitch:0,u=f-this.torsoYaw;Math.abs(u)>18*Ue&&(this.torsoYaw+=(u-Math.sign(u)*18*Ue)*.45),this.torsoYaw+=(f-this.torsoYaw)*Math.min(1,l*2.8);const m=f-this.torsoYaw,v=xn(pl([1,0,0],-p),pl([0,1,0],m)),g=yi(v),d=pl([0,1,0],this.yawTrimRad+this.torsoYaw);this.qArmTorso=Si(xn(d,xn(this.qRefInv,xn(c.q,this.qBasis)))),this.qArm=Si(xn(v,this.qArmTorso));let x=c.rotRate;this.prevQuat&&x<1&&(x=e2(this.prevQuat,this.qArmTorso)/l*ns),this.prevQuat=[...this.qArmTorso];const y=Qe(yi(this.qBasis),[0,0,1]),_=Qe(this.qArm,y);this.screenFacingCos=_[2];const E=Qe(this.qArmTorso,[0,0,-1]),b=Math.asin(ee(E[1],-1,1)),A=Math.atan2(E[0],Math.max(.12,Math.hypot(E[2],E[1]*.35)));this.elevationDeg=+(b*ns).toFixed(1);const T=ee(-h*A/(28*Ue),-.35,1),S=ee((b-(this.bendSpanRad+6*Ue))/(26*Ue),0,1);let M,R=0;if(b>=0){const zt=ee(b/Math.max(.32,this.bendSpanRad),0,1.15),N=ee(.96+T*.12-S*.78,.18,1.05);M=ee(1-zt*.84*N,.12,1.02),R=S*.08+ee(b/(75*Ue),0,1)*.04}else{const zt=ee(-b/(72*Ue),0,1);M=ee(1-zt*.62,.28,1.02),R=-zt*.035}const L={x:h*.21,y:-.27+R,z:-.08},P=mc+gc-.015,F=.25;let O,z;if(b<-8*Ue){const zt=ee(-b/(70*Ue),0,1);O=.56-zt*.09,z={x:L.x+E[0]*O*.82-h*(1-zt)*.06,y:L.y+E[1]*O*.95+(1-zt)*.14,z:L.z-Math.max(.18,-E[2])*O*.96}}else{O=F+M*(P-F);const zt=1-M;z={x:L.x+E[0]*O*.88-h*(.09+zt*.03),y:L.y+E[1]*(.2+M*.36+S*.18)+M*.15,z:L.z-(.28+M*.31)*ee(-E[2]+zt*.45,.36,1.05)}}let X=M;if(e&&e.fresh&&e.status!=="none"&&this.screenFacingCos>.18)if(this.trackingSource="gyro+beacon",e.status==="pair"&&e.spanNorm>.015){const zt=ee(this.screenFacingCos,.42,1),N=e.spanNorm/zt,st=Math.max(.035,this.beaconNear.span-this.beaconFar.span),nt=ee((this.beaconNear.span-N)/st,.06,1.06);X=M*.35+nt*.65;const it=-.38-nt*.32,et=ee((e.u-this.beaconFar.u)*1.15+h*.1,-.54,.54),dt=ee((this.beaconFar.v-e.v)*.94-.11,-.56,.46),ct=Qe(g,[et,dt,it]);z.x=z.x*.32+ct[0]*.68,z.y=z.y*.32+ct[1]*.68,z.z=z.z*.35+ct[2]*.65;const _t=Qe(v,[L.x+E[0]*.48-h*.08,L.y+E[1]*.35,-.55]),$t=ee(this.beaconFar.u+(_t[0]-h*.1)*.65,.1,.9),Zt=e.u-$t,I=12*Ue*l;this.yawTrimRad=ee(this.yawTrimRad-ee(Zt*.35,-I,I),-180*Ue,180*Ue)}else{const zt=ee((e.u-this.beaconFar.u)*1.1+h*.1,-.52,.52),N=ee((this.beaconFar.v-e.v)*.9-.11,-.54,.44),st=Qe(g,[zt,N,z.z]);z.x=z.x*.55+st[0]*.45,z.y=z.y*.55+st[1]*.45}else this.trackingSource="gyro-only";const q=26,Q=Math.max(1,Math.ceil(l/.017)),at=l/Q;for(let zt=0;zt<Q;zt++)for(const N of["x","y","z"]){const st=z[N]-this.torsoWristPos[N],nt=q*q*st-2*q*this.torsoWristVel[N];this.torsoWristVel[N]+=nt*at,this.torsoWristPos[N]+=this.torsoWristVel[N]*at}this.reach+=(X-this.reach)*(1-Math.exp(-l*18));const Tt=ee((this.torsoWristPos.y+.1)*.55,-.15,.42),It=[h*.44,-.86+Tt,.22],Ct=i2(L,this.torsoWristPos,mc,gc,It);this.torsoWristPos={...Ct.wrist},this.elbowBendDeg=+Ct.elbowBendDeg.toFixed(1);const Gt=Qe(v,[Ct.shoulder.x,Ct.shoulder.y,Ct.shoulder.z]),Y=Qe(v,[Ct.elbow.x,Ct.elbow.y,Ct.elbow.z]),tt=Qe(v,[Ct.wrist.x,Ct.wrist.y,Ct.wrist.z]),pt=Qe(v,[this.torsoWristVel.x,this.torsoWristVel.y,this.torsoWristVel.z]);this.shoulderPos={x:Gt[0],y:Gt[1],z:Gt[2]},this.elbowPos={x:Y[0],y:Y[1],z:Y[2]},this.pos={x:tt[0],y:tt[1],z:tt[2]},this.vel={x:pt[0],y:pt[1],z:pt[2]};let wt=0,bt=null,Xt=null;if(n==="search")if(this.reach>=.6&&r){this.rummageAnchorYaw===null&&(this.rummageAnchorYaw=A,this.rummageAnchorPitch=b);const N=A-this.rummageAnchorYaw,st=b-this.rummageAnchorPitch,nt=Math.hypot(N,st)*ns,et=(Math.abs(N)>=Math.abs(st)?N:st)>=0?1:-1,dt=o-this.lastPokeAt>=270,ct=nt>=6.8&&(this.rummageDir===0||et!==this.rummageDir),_t=c.linMag>=1.35&&x>=28;dt&&(ct||_t)?(wt=1,this.lastPokeAt=o,this.rummageDir=et,this.rummageAnchorYaw=A,this.rummageAnchorPitch=b,this.dwellAccumSec=0):(x>=12||c.linMag>=.55)&&(this.dwellAccumSec+=l,this.dwellAccumSec>=.62&&dt&&(wt=1,this.lastPokeAt=o,this.dwellAccumSec=0))}else this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0;else if(n==="inspect"){this.inspectBaseQ||(this.inspectBaseQ=[...this.qArmTorso],this.inspectEnteredAt=o);const zt=xn(this.qArmTorso,yi(this.inspectBaseQ)),N=n2(zt);if(this.itemRot={x:ee(-N.pitch*1.55,-Math.PI,Math.PI),y:ee(N.yaw*1.75+N.roll*.7,-Math.PI*1.5,Math.PI*1.5),z:ee(-N.roll*1.25,-Math.PI,Math.PI)},s&&o-this.inspectEnteredAt>=450&&o-this.lastDecisionAt>=900){const nt=c.linMag>=7.2,it=x>=255&&c.linMag>=2.6,et=x>=340;if(nt||it||et){bt="discard",this.lastDecisionAt=o,this.calmLowerSec=0;const dt=Qe(this.qArm,[0,0,-1]),ct=dt[0]>=0?1:-1;Xt={x:ee(dt[0]*7.5+ct*3.8+this.vel.x*2.2,-9.5,9.5),y:ee(dt[1]*4.5+2.2+this.vel.y*1.8,.5,7.5),z:-6.8}}else{const dt=b<=-23*Ue||Ct.wrist.y<=-.35,ct=c.linMag<3.1&&x<105;dt&&ct?(this.calmLowerSec+=l,this.calmLowerSec>=.65&&(bt="keep",this.lastDecisionAt=o,this.calmLowerSec=0)):this.calmLowerSec=Math.max(0,this.calmLowerSec-l*2.2)}}}return this.snapshot({pokes:wt,decision:bt,throwVel:Xt,pitchUpDeg:+(b*ns).toFixed(1)})}snapshot(t={}){return{handSide:this.handSide,calibratedStep:this.calibratedStep,trackingSource:this.trackingSource,qArm:[...this.qArm],shoulderPos:{...this.shoulderPos},elbowPos:{...this.elbowPos},pos:{...this.pos},vel:{x:+this.vel.x.toFixed(3),y:+this.vel.y.toFixed(3),z:+this.vel.z.toFixed(3)},elbowBendDeg:this.elbowBendDeg,elevationDeg:this.elevationDeg,reach:+this.reach.toFixed(3),screenFacingCos:+this.screenFacingCos.toFixed(3),itemRot:{...this.itemRot},calmLowerProgress:+ee(this.calmLowerSec/.65,0,1).toFixed(2),...t}}}const r2="modulepreload",a2=function(i,t){return new URL(i,t).href},Uu={},Nu=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(f=>Promise.resolve(f).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=a(e.map(h=>{if(h=a2(h,n),h in Uu)return;Uu[h]=!0;const f=h.endsWith(".css"),p=f?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===h&&(!f||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${p}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":r2,f||(m.as="script"),m.crossOrigin="",m.href=h,c&&m.setAttribute("nonce",c),document.head.appendChild(m),f)return new Promise((v,g)=>{m.addEventListener("load",v),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},Fu="https://www.gstatic.com/firebasejs/11.0.1",id="ckc_stand_cfg",sd="wn_firebase_cfg",o2="wn-wrist-demo-v1",l2=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];function c2(i){if(!i||typeof i!="string")return null;const t=i.trim();if(!t)return null;if(/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(t))return{databaseURL:t.replace(/\/$/,"")};try{const r=JSON.parse(t);if(r&&typeof r=="object"&&(r.databaseURL||r.projectId))return r}catch{}const e={},n=/([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;let s;for(;(s=n.exec(t))!==null;)e[s[1]]=s[3];return!e.databaseURL&&e.projectId&&(e.databaseURL=`https://${e.projectId}-default-rtdb.firebaseio.com`),e.databaseURL?e:null}function h2(){try{return localStorage.getItem(id)||localStorage.getItem(sd)||""}catch{return""}}function u2(i){try{localStorage.setItem(id,i),localStorage.setItem(sd,i)}catch{}}function Ou(){return String(Math.floor(1e5+Math.random()*9e5))}function f2(){return"h"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}function zu(i){if(!i||typeof i!="string")return!1;const t=i.trim().toLowerCase();return!!(t.endsWith(".local")||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(t)||t.startsWith("fd")||t.startsWith("fc")||t.startsWith("fe80:"))}class d2{constructor({onSensor:t,onCalCommand:e,onHandSide:n,onStatus:s}={}){this.onSensor=t||(()=>{}),this.onCalCommand=e||(()=>{}),this.onHandSide=n||(()=>{}),this.onStatus=s||(()=>{}),this.mode="off",this.roomCode="",this.connected=!1,this.p2pOpen=!1,this.routeKind="idle",this.rttMs=null,this.rxHz=0,this.error=null,this.db=null,this.fbMod=null,this.unsubs=[],this.bc=null,this.pc=null,this.dcFast=null,this.dcCtrl=null,this.hid="",this.attempt=0,this.preferLanOnly=!1,this.peerJoined=!1,this.lastPongAt=0,this.lastFastRxAt=0,this.lastAnyRxAt=0,this.lastSeq=-1,this.seenCalIds=new Set,this.rxTimes=[],this.pingTimer=null,this.watchdogTimer=null,this.wakeLock=null}async acquireWakeLock(){var t,e,n;try{typeof navigator<"u"&&((t=navigator.wakeLock)!=null&&t.request)&&!this.wakeLock&&(this.wakeLock=await navigator.wakeLock.request("screen"),(n=(e=this.wakeLock).addEventListener)==null||n.call(e,"release",()=>{this.wakeLock=null}))}catch{}}releaseWakeLock(){var t,e;try{(e=(t=this.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}this.wakeLock=null}startDemo(t=this.roomCode||Ou()){return this.stop(),this.mode="demo",this.roomCode=String(t),this.routeKind="demo",this.error=null,typeof BroadcastChannel<"u"&&(this.bc=new BroadcastChannel(o2),this.bc.onmessage=e=>{var s;const n=e==null?void 0:e.data;if(!(!n||String(n.room)!==this.roomCode))if(n.k==="hello")this.connected=!0,this.p2pOpen=!0,(n.side==="left"||n.side==="right")&&this.onHandSide(n.side),(s=this.bc)==null||s.postMessage({k:"ack",room:this.roomCode,ts:Date.now()}),this._emitStatus();else if(n.k==="wrist")this.connected=!0,this.p2pOpen=!0,this._handlePacket(n,!0);else if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step))}else n.k==="hand_side"&&(n.side==="left"||n.side==="right")&&this.onHandSide(n.side)}),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"demo"}}async startFirebase(t){const e=c2(t);if(!e)return this.error="Вставьте корректный firebaseConfig или URL Realtime Database",this._emitStatus(),{ok:!1,error:this.error};u2(t),this.stop(),this.mode="firebase",this.roomCode=Ou(),this.error=null;try{const[{initializeApp:n,getApps:s},r]=await Promise.all([Nu(()=>import(`${Fu}/firebase-app.js`),[],import.meta.url),Nu(()=>import(`${Fu}/firebase-database.js`),[],import.meta.url)]),o=s().find(v=>v.name==="wn-wrist-host")||n(e,"wn-wrist-host");this.db=r.getDatabase(o,e.databaseURL),this.fbMod=r;const{ref:l,set:c,onValue:h,onChildAdded:f,onDisconnect:p}=r,u=`wn_wrist_rooms/${this.roomCode}`;await c(l(this.db,u),{createdAt:Date.now(),hostAlive:!0});try{p(l(this.db,`${u}/hostAlive`)).remove()}catch{}this.unsubs.push(h(l(this.db,`${u}/wristJoined`),v=>{v.val()&&(this.peerJoined=!0,this.connected=!0,this.isFastHealthy()||this._startRtcOffer(!1),this._emitStatus())})),this.unsubs.push(h(l(this.db,`${u}/fbInput`),v=>{const g=v.val();g&&(this.connected=!0,this.isFastHealthy()||(this.routeKind="firebase",this._handlePacket(g,!1)))}));let m=!0;return this.unsubs.push(h(l(this.db,`${u}/calCmd`),v=>{const g=v.val();if(m){m=!1,g!=null&&g.id&&this.seenCalIds.add(g.id);return}if(!g||!g.step)return;const d=g.id||`${g.step}:${g.ts||0}`;this.seenCalIds.has(d)||(this.seenCalIds.add(d),this.onCalCommand(g.step))})),this.unsubs.push(h(l(this.db,`${u}/handSide`),v=>{const g=v.val();g&&(g.side==="left"||g.side==="right")&&this.onHandSide(g.side)})),this.unsubs.push(h(l(this.db,`${u}/rtc/hello`),v=>{const g=v.val();!g||!g.ts||(this.peerJoined=!0,this.connected=!0,this.isFastHealthy()||this._startRtcOffer(!1))})),this.unsubs.push(h(l(this.db,`${u}/rtc/answer`),async v=>{const g=v.val();if(!(!g||g.hid!==this.hid||!this.pc)&&this.pc.signalingState==="have-local-offer")try{await this.pc.setRemoteDescription({type:"answer",sdp:g.sdp})}catch{}})),this.unsubs.push(f(l(this.db,`${u}/rtc/wristCandidates`),async v=>{const g=v.val();if(!(!g||g.hid!==this.hid||!this.pc))try{await this.pc.addIceCandidate(g.candidate)}catch{}})),await this.acquireWakeLock(),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"firebase"}}catch(n){return this.error=(n==null?void 0:n.message)||"Ошибка подключения к Firebase",this._emitStatus(),{ok:!1,error:this.error}}}isFastHealthy(t=performance.now()){if(this.mode==="demo")return this.p2pOpen;if(!this.dcFast||this.dcFast.readyState!=="open")return!1;const e=this.lastPongAt?t-this.lastPongAt:0,n=this.lastFastRxAt?t-this.lastFastRxAt:0;return Math.min(e||0,n||0)<8500}async _startRtcOffer(t=!1){if(typeof RTCPeerConnection>"u"||!this.db||!this.fbMod)return;this._closePcOnly(),this.attempt+=1,this.hid=f2();const e=this.hid,n=this.preferLanOnly||!t&&this.attempt%2===1,s=n?[]:l2,{ref:r,set:a,push:o,remove:l}=this.fbMod,c=`wn_wrist_rooms/${this.roomCode}/rtc`;try{await Promise.all([l(r(this.db,`${c}/answer`)),l(r(this.db,`${c}/hostCandidates`)),l(r(this.db,`${c}/wristCandidates`))])}catch{}const h=new RTCPeerConnection({iceServers:s});this.pc=h;const f=h.createDataChannel("wrist-fast",{ordered:!1,maxRetransmits:0}),p=h.createDataChannel("wrist-ctrl",{ordered:!0});this.dcFast=f,this.dcCtrl=p;const u=()=>{this.hid===e&&(this.p2pOpen=!0,this.connected=!0,this.lastPongAt=performance.now(),this._inspectRoute(n),this._emitStatus())};f.onopen=u,p.onopen=u,f.onmessage=m=>this._onChannelMessage(m.data,!0),p.onmessage=m=>this._onChannelMessage(m.data,!1),h.onicecandidate=m=>{!m.candidate||this.hid!==e||o(r(this.db,`${c}/hostCandidates`),{hid:e,candidate:m.candidate.toJSON?m.candidate.toJSON():m.candidate}).catch(()=>{})},h.onconnectionstatechange=()=>{if(this.hid!==e)return;const m=h.connectionState;m==="connected"?(this.p2pOpen=!0,this._inspectRoute(n),this._emitStatus()):(m==="failed"||m==="closed")&&(this.p2pOpen=!1,this.routeKind=this.connected?"firebase":"idle",this._emitStatus())};try{const m=await h.createOffer();await h.setLocalDescription(m),await a(r(this.db,`${c}/offer`),{hid:e,sdp:m.sdp,iceMode:n?"lan":"stun",ts:Date.now()})}catch{}}async _inspectRoute(t){var e;if(!((e=this.pc)!=null&&e.getStats)){this.routeKind=t?"lan":"stun";return}try{const n=await this.pc.getStats();let s=null;const r=new Map;if(n.forEach(a=>{(a.type==="local-candidate"||a.type==="remote-candidate")&&r.set(a.id,a),a.type==="candidate-pair"&&(a.nominated||a.state==="succeeded")&&(s=a)}),s){const a=r.get(s.localCandidateId),o=r.get(s.remoteCandidateId),l=(a==null?void 0:a.candidateType)||"",c=(o==null?void 0:o.candidateType)||"",h=Number.isFinite(s.currentRoundTripTime)?s.currentRoundTripTime*1e3:null,p=t||(l==="host"||l==="prflx")&&(c==="host"||c==="prflx")&&(zu(a==null?void 0:a.address)||zu(o==null?void 0:o.address)||h!==null&&h<22);this.routeKind=p?"lan":"stun",p&&(this.preferLanOnly=!0);return}}catch{}this.routeKind=t?"lan":"stun"}_onChannelMessage(t,e){let n;try{n=typeof t=="string"?JSON.parse(t):null}catch{return}if(!n)return;const s=performance.now();if(n.k==="ping"){this._sendCtrl({k:"pong",t:n.t});return}if(n.k==="pong"){if(this.lastPongAt=s,Number.isFinite(n.t)){const r=Math.max(1,Math.round(s-n.t));this.rttMs=this.rttMs===null?r:Math.round(this.rttMs*.65+r*.35)}this._emitStatus();return}if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step));return}if(n.k==="hand_side"&&(n.side==="left"||n.side==="right")){this.onHandSide(n.side);return}n.k==="wrist"&&(this.lastFastRxAt=s,this.p2pOpen=!0,this._handlePacket(n,e))}_sendCtrl(t){var n;const e=((n=this.dcCtrl)==null?void 0:n.readyState)==="open"?this.dcCtrl:this.dcFast;if((e==null?void 0:e.readyState)==="open")try{e.send(JSON.stringify(t))}catch{}}sendHandSide(t){const e=t==="left"?"left":"right",n={k:"hand_side",room:this.roomCode,side:e,ts:Date.now()};if(this.mode==="demo"&&this.bc&&this.bc.postMessage(n),this._sendCtrl(n),this.mode==="firebase"&&this.db&&this.fbMod&&this.roomCode){const{ref:s,set:r}=this.fbMod;r(s(this.db,`wn_wrist_rooms/${this.roomCode}/hostHandSide`),n).catch(()=>{})}}_handlePacket(t,e){const n=performance.now();if(e&&Number.isFinite(t.seq)){if(t.seq<=this.lastSeq&&this.lastSeq-t.seq<3e3)return;this.lastSeq=t.seq}for(this.lastAnyRxAt=n,this.rxTimes.push(n);this.rxTimes.length&&n-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:n})}injectPacket(t,e=performance.now()){this.connected=!0,this.p2pOpen=!0,this.routeKind="demo",this.lastAnyRxAt=e,this.rxHz=60,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:e})}_startMeters(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=setInterval(()=>{var e,n;const t=performance.now();for(;this.rxTimes.length&&t-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,(((e=this.dcFast)==null?void 0:e.readyState)==="open"||((n=this.dcCtrl)==null?void 0:n.readyState)==="open")&&this._sendCtrl({k:"ping",t:Math.round(t)}),this._emitStatus()},1e3),this.watchdogTimer=setInterval(()=>{this.mode!=="firebase"||!this.peerJoined||this.isFastHealthy()||(this.p2pOpen=!1,this._startRtcOffer(!1))},4200)}_closePcOnly(){var t,e,n;try{(t=this.dcFast)==null||t.close()}catch{}try{(e=this.dcCtrl)==null||e.close()}catch{}try{(n=this.pc)==null||n.close()}catch{}this.dcFast=null,this.dcCtrl=null,this.pc=null,this.p2pOpen=!1}stop(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=null,this.watchdogTimer=null;for(const t of this.unsubs)try{t()}catch{}if(this.unsubs=[],this._closePcOnly(),this.bc){try{this.bc.close()}catch{}this.bc=null}this.releaseWakeLock(),this.mode="off",this.connected=!1,this.peerJoined=!1,this.routeKind="idle",this.rxHz=0,this.rttMs=null,this._emitStatus()}status(){return{mode:this.mode,roomCode:this.roomCode,connected:this.connected,p2pOpen:this.isFastHealthy(),routeKind:this.routeKind,rttMs:this.rttMs,rxHz:this.rxHz,error:this.error,fresh:!!this.lastAnyRxAt&&performance.now()-this.lastAnyRxAt<1200}}_emitStatus(){this.onStatus(this.status())}}const p2=(i,t,e)=>Math.max(t,Math.min(e,i)),K=i=>document.querySelector(i),Rn=i=>[...document.querySelectorAll(i)],m2=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let ci;try{ci=window.localStorage}catch{ci={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let At=S_(ci),ht,vc="all",Oe=null,xc,ku,Bu=null,rs=0,_c=0,nr=document.hidden,yc=null;const rd="white-night-vr-v1",Mc=10;function g2(){try{const i=ci.getItem(rd),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":t.mode==="hand"?"hand":"gyro",handSide:t.handSide==="left"?"left":"right",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",handSide:"right",quality:"high",leftHue:16,rightHue:338}}}let se=g2(),Ee=null,ge=null,Ie=null,fn=null,ao="",Hu=!1,Ne=!1,Yr=!1,Sc=!1,zi=!1,oo=0,Qn=0,ti=!1,ri=!1,lo=!1,Cn=null,bc=!1,ml=!1,wi="",Mr=0;const Vn=new K_;function Dr(){try{ci.setItem(rd,JSON.stringify(se))}catch{}}const Vu=new URLSearchParams(location.search).has("test"),cs=Rn("dialog");function Zr(i,t="neutral"){K("#toast").dataset.tone=t,K("#toast").textContent=i,K("#toast").classList.add("visible"),clearTimeout(xc),xc=setTimeout(()=>K("#toast").classList.remove("visible"),2600)}function To(){b_(ci,At)||(K("#save-status").textContent="Сохранение недоступно в этом браузере",Zr("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function co(){Rn("[data-pose]").forEach(i=>{var t;i.disabled=At.phase!=="inspect"||!((t=ht==null?void 0:ht.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(ht==null?void 0:ht.pose)))})}function Ur(){var i;if(co(),!!ht){if(At.phase==="inspect"&&!((i=ht.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])K("#"+t).disabled=!0;return}K("#zoom-in").disabled=ht.zoom>=no.max,K("#zoom-out").disabled=ht.zoom<=no.min,K("#zoom-reset").disabled=ht.zoom===1,K("#zoom-reset").textContent=`${Math.round(ht.zoom*100)}%`}}function ad(){K("#completion-preview").replaceChildren(...At.lastKept.map(i=>{const t=document.createElement("img");return t.src=ht.thumbnail(i),t.alt=un.find(e=>e.id===i).name,t}))}function ps(){var e;const i=At.phase==="inspect"&&((e=ht.revealState)==null?void 0:e.phase)||"ready";if(i===Bu)return;Bu=i,K("#app").dataset.revealPhase=i,K("#app").classList.toggle("is-revealing",i!=="ready"),K(".inspection").setAttribute("aria-busy",String(i!=="ready")),K("#keep").disabled=K("#discard").disabled=i!=="ready",Ur();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};K("#reveal-note").textContent=t[i]||"",K("#reveal-note").hidden=i==="ready"}function v2(){const i=K("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(ku),ku=setTimeout(()=>i.classList.remove("collected"),700)}function Wi(){K("#app").classList.toggle("has-progress",At.searches>0),ps(),Ur(),M2(),K("#app").classList.toggle("is-inspecting",At.phase==="inspect"),K(".inspection").hidden=At.phase!=="inspect",At.phase==="inspect"&&(clearTimeout(xc),K("#toast").classList.remove("visible")),K("#header-count").innerHTML=`${String(At.collection.length).padStart(2,"0")} <small>/ 18</small>`,K("#open-vr").disabled=At.phase==="inspect",K("#search-total").textContent=String(At.searches).padStart(2,"0"),K("#open-collection").disabled=At.phase==="inspect",Rn(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<At.taps)),K(".tap-dots").setAttribute("aria-label",`Нажатий: ${At.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(K("#search-caption").textContent=i[At.taps],K("#search-button span").textContent=At.taps?"Продолжить поиск":"Порыться в баке",At.phase==="inspect"){const t=un.find(n=>n.id===At.current),e=ed[t.rarity];K("#find-name").textContent=t.name,K("#find-description").textContent=t.description,K("#find-era").textContent=t.era,K("#find-rarity").innerHTML=`<i></i>${e.label}`,K("#find-rarity").style.color=e.color,K("#find-number").textContent=At.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(At.searches).padStart(3,"0")}`,K("#duplicate-badge").hidden=At.reviewing||!At.collection.includes(t.id),K(".decision-buttons").hidden=At.reviewing,K("#close-review").hidden=!At.reviewing}}function ho(){if(At.phase!=="search"||cs.some(t=>t.open)||nr)return;ht.poke(At.taps+1);let i=yc||(At.searches===0?"camera":M_().id);At=wo(At,{type:"tap",itemId:i}),At.phase==="inspect"&&(yc=null,ht.show(At.current),To(),Ne&&(ri=se.mode!=="hand",Qn=0,ti=!1,Vn.reset(),Ie==null||Ie.onPhaseChange("inspect",performance.now()))),Wi()}function Xs(i,{fromVr:t=!1}={}){var r;if(At.phase!=="inspect"||At.reviewing||!((r=ht.revealState)!=null&&r.ready))return;const e=un.find(a=>a.id===At.current),n=At.collection.includes(e.id),s=At.collection.length;At=wo(At,{type:i?"keep":"discard"}),ht.hide(),To(),Wi(),Zr(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&v2(),s<18&&At.collection.length===18&&(t?lo=!0:(ad(),K("#complete-dialog").showModal()))}function od(){K("#collection-count").textContent=At.collection.length,K("#collection-progress").style.width=`${At.collection.length/18*100}%`;const i=un.filter(t=>vc==="all"||(vc==="junk"?t.rarity==="junk":t.rarity!=="junk"));K("#collection-grid").replaceChildren(...i.map(t=>{const e=At.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(un.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${ht.thumbnail(t.id)}">`:`<div class="locked-art">${m2("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":ed[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{K("#collection-dialog").close(),At=wo(At,{type:"review",id:t.id}),ht.show(t.id,{review:!0}),Wi()}),n}))}function wc(){At.phase!=="inspect"&&(od(),K("#collection-dialog").showModal())}function Gu(){At.reviewing&&(At=wo(At,{type:"close"}),ht.hide(),Wi(),wc())}function ld(){At=qr(),ht.hide(),To(),Wi(),K("#reset-confirm").hidden=!0,K("#reset-button").hidden=!1,K("#settings-dialog").close(),Zr("Новая белая ночь. Начнём сначала.")}function x2(){const i=K(".bin-tag");if(!i)return;const t=ht.binEdge();i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`}const cd="white-night-look-hint-v1";let Wu=!1;function _2(){try{return ci.getItem(cd)==="done"}catch{return!0}}function y2(){const i=K("#look-hint");if(!(!i||Wu&&i.hidden)){i.classList.add("used"),Wu=!0;try{ci.setItem(cd,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function M2(){const i=K("#look-hint");if(i){if(_2()||At.phase==="inspect"){i.hidden=!0;return}i.hidden=Ne}}function yn(){return Ee||(Ee=new Z_(K("#vr-camera")),Ee.setHues(se.leftHue,se.rightHue),Ee.setMode(se.mode==="fusion"?"fusion":"gyro")),Ee}function hd(){return ge||(ge=new t2(K("#vr-hand-camera"))),ge}function $r(i){var s;const t=ai();ge==null||ge.process(!0);const e=(ge==null?void 0:ge.sample())||null,n=i==="pose1"?t.calibrateStretchPose(t.lastSensor,e):t.calibrateBendPose(t.lastSensor,e);return ao=n.message||"",(s=K("#vr-dialog"))!=null&&s.open&&Xe(),n}function Qc(i,{fromRemote:t=!1}={}){var n,s,r;const e=i==="left"?"left":"right";se.handSide=e,Dr(),Ie&&Ie.setHandSide(e),(s=(n=ht==null?void 0:ht.vrHand)==null?void 0:n.setHandSide)==null||s.call(n,e),t||fn==null||fn.sendHandSide(e),(r=K("#vr-dialog"))!=null&&r.open&&Xe()}function ai(){return Ie||(Ie=new s2({handSide:se.handSide})),fn||(fn=new d2({onSensor:i=>Ie.feedSensor(i),onCalCommand:i=>$r(i),onHandSide:i=>Qc(i,{fromRemote:!0}),onStatus:()=>{var i;(i=K("#vr-dialog"))!=null&&i.open&&Xe()}})),Ie}function S2(i){return i.gyro.fresh?se.mode==="fusion"?!!i.marker.calibrated:se.mode==="hand"?(ai(),(fn.status().connected||!!Ie.lastSensor)&&Ie.calibratedStep>=2):!0:!1}function Xu(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}const b2="<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>",w2="<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>",T2="В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.",E2="В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.";function Xe(){var c;const i=yn(),t=i.info(),e=t.gyro,n=t.marker,s=S2(t);Rn("[data-vr-mode]").forEach(h=>{const f=h.dataset.vrMode===se.mode;h.classList.toggle("active",f),h.setAttribute("aria-pressed",String(f))}),K("#vr-fusion-panel").hidden=se.mode!=="fusion",K("#vr-hand-panel").hidden=se.mode!=="hand";const r=K("#vr-how-cards"),a=K("#vr-note-text");if(r){const h=se.mode==="hand"?w2:b2;r.innerHTML!==h&&(r.innerHTML=h)}a&&(a.textContent=se.mode==="hand"?E2:T2),K("#vr-quality").value=se.quality,K("#vr-swatch-left").style.background=`hsl(${se.leftHue} 95% 55%)`,K("#vr-swatch-right").style.background=`hsl(${se.rightHue} 95% 55%)`;const o=K("#vr-gyro-btn");if(o.disabled=!!e.fresh||!e.supported,o.textContent=e.fresh?"Гироскоп готов":"Разрешить",o.classList.toggle("ready",!!e.fresh),K("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",se.mode==="fusion"){const[h,f]=n.markers||[];K("#vr-start-camera").disabled=!!n.running,K("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",K("#vr-calibrate").disabled=!(h!=null&&h.usable&&(f!=null&&f.usable)),K("#vr-pick-left").classList.toggle("active",Cn==="left"),K("#vr-pick-right").classList.toggle("active",Cn==="right"),K("#vr-camera").classList.toggle("picking",!!Cn);const p=K("#vr-marker-status");p.textContent=wi||n.error||(Cn?`Коснитесь ${Cn==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((c=n.calibration)==null?void 0:c.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${h?Xu(h):"—"}. Правая метка: ${f?Xu(f):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),p.className=`vr-status-line ${wi||n.error?"warn":n.calibrated?"good":""}`}else if(se.mode==="hand"){if(ai(),Rn("[data-hand-side]").forEach(g=>{const d=g.dataset.handSide===se.handSide;g.classList.toggle("active",d),g.setAttribute("aria-pressed",String(d))}),!Hu){Hu=!0;const g=h2(),d=K("#vr-hand-fb");d&&g?d.value=g:K("#vr-hand-fb-details")&&(K("#vr-hand-fb-details").open=!0)}const h=fn.status(),f=h.connected||!!Ie.lastSensor;K("#vr-hand-code").textContent=h.roomCode||"——";const p=K("#vr-hand-net-status");p.textContent=h.error?h.error:h.p2pOpen?h.routeKind==="demo"?`Демо-канал активен (${h.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${h.rttMs?` · ${h.rttMs} мс`:""}.`:h.connected?"☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).":h.roomCode?`Код комнаты ${h.roomCode} создан — введите его на странице браслета.`:"Создайте 6-значный код и введите его на втором телефоне.",p.className=`vr-status-line ${h.error?"warn":f?"good":""}`;const u=ge==null?void 0:ge.info();K("#vr-hand-cam-btn").textContent=u!=null&&u.running?"Камера маяка вкл.":"Камера маяка (опц.)",K("#vr-hand-camera").hidden=!(u!=null&&u.running),K("#vr-hand-cal1").disabled=!f,K("#vr-hand-cal2").disabled=!f||Ie.calibratedStep<1;const m=K("#vr-hand-cal-status"),v=u!=null&&u.running?` Маяк в камере: ${u.status==="pair"?"видна пара пятен":u.status==="single"?"видно одно пятно":"пока не в кадре"}.`:"";m.textContent=(ao||(Ie.calibratedStep>=2?"Калибровка двух жестов готова.":Ie.calibratedStep===1?"Шаг 1 записан — согните руку в локте и нажмите Жест 2.":f?"Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).":"Сначала подключите браслет."))+v,m.className=`vr-status-line ${Ie.calibratedStep>=2?"good":""}`}K("#vr-start").disabled=!s||zi;const l=K("#vr-status");return l.textContent=zi?"Надевайте очки и смотрите прямо перед собой…":e.fresh?se.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":se.mode==="hand"&&!s?"Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.":se.mode==="hand"?"Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.":se.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп очков.",l.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function ud(){if(At.phase==="inspect"){Zr("Сначала завершите осмотр находки.");return}const i=K("#vr-dialog");i.open||(yn(),Xe(),i.showModal())}async function A2(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function R2(i=!1){i&&(bc=K("#low-quality").checked,ml=se.quality==="low",ht.low!==ml&&ht.setQuality(ml))}function fd(i=!1){if(!Ne)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==Yr)&&(Yr=t,ht.setVrStereo(t))}async function dd(){if(Ne||At.phase==="inspect")return!1;const i=yn(),t=se.mode==="hand",e=K("#vr-dialog");if(i.setMode(se.mode==="fusion"?"fusion":"gyro"),e.open&&(Sc=!0,e.close(),Sc=!1),R2(!0),i.start(),t){ai();const n=performance.now();Ie.recenterOnSessionStart(n),Ie.onPhaseChange("search",n)}return Ne=!0,Qn=At.taps*(Mc/3),ti=!1,ri=!1,Vn.reset(),document.body.classList.add("vr-active"),ht.setVrHandMode(t),Yr=!1,fd(!0),ht.setHeadLook(0,0),ht.resize(),!0}async function C2(){if(zi||!Xe().ready)return;await A2();const i=++oo,t=K("#vr-dialog"),e=K("#vr-countdown");zi=!0,e.hidden=!1,Xe();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==oo||!t.open){zi=!1,e.hidden=!0;return}zi=!1,e.hidden=!0,await dd()}function Eo(i="gesture"){var t;return!ri||At.phase!=="inspect"||At.reviewing?!1:((t=ht.revealState)!=null&&t.ready||(ht.finishReveal(),ps()),ri=!1,Vn.reset(),Xs(!0,{fromVr:!0}),Qn=0,ti=!1,!0)}function Rr(i="exit"){var t;if(!Ne)return!1;ri&&Eo("exit"),Ne=!1,oo++,zi=!1,K("#vr-countdown").hidden=!0,Ee==null||Ee.stop(),ge==null||ge.stop(),ht.setVrHandMode(!1),ht.setVrStereo(!1),ht.setHeadLook(0,0),Yr=!1,Qn=0,ti=!1,Vn.reset(),document.body.classList.remove("vr-active","vr-single"),ht.low!==bc&&ht.setQuality(bc);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),ht.resize(),Wi(),lo?(lo=!1,ad(),K("#complete-dialog").showModal()):i!=="hidden"&&Zr("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function Tc(i){const t=Ee.update(i);return ht.setHeadLook(t.yaw,t.pitch),t}function uo(i,t=performance.now()){var s,r,a;if(!Ne||!Ee)return;const e=Tc(i),n=Mc/3;if(se.mode==="hand"){ai(),ge==null||ge.process(!1,t);const o=(ge==null?void 0:ge.sample(t))||null,l=ht.handHitsBin(),c=Ie.update(i,{beacon:o,headLook:ht.headLook,phase:At.phase,revealReady:!!((s=ht.revealState)!=null&&s.ready),handOverBin:l,now:t});if(ht.updateVrHand(i,{visible:!0,handSide:c.handSide,shoulderPos:c.shoulderPos,elbowPos:c.elbowPos,pos:c.pos,vel:c.vel,qArm:c.qArm,reach:c.reach,elbowBendDeg:c.elbowBendDeg,overBin:l,phase:At.phase,calmLowerProgress:c.calmLowerProgress,beaconActive:c.trackingSource==="gyro+beacon"}),At.phase==="search"){Vn.reset(),ti=l&&c.reach>=.62;for(let h=0;h<c.pokes&&At.phase==="search";h++)ho()}else At.phase==="inspect"&&(ti=!1,ht.setHandItemRotation(c.itemRot.x,c.itemRot.y,c.itemRot.z),c.decision==="discard"?(ri=!1,Vn.reset(),ht.launchDiscardToss(c.throwVel),Xs(!1,{fromVr:!0}),Ie.onPhaseChange("search",t)):(c.decision==="keep"||(r=ht.revealState)!=null&&r.ready&&Vn.update(e.yaw,t))&&(ri=!1,Vn.reset(),Xs(!0,{fromVr:!0}),Ie.onPhaseChange("search",t)));return}if(At.phase==="search")if(Vn.reset(),ti=ht.gazeHitsBin(),ti){Qn=Math.min(Mc,Qn+i);const o=Math.min(3,Math.floor(Qn/n+1e-9));for(;At.phase==="search"&&At.taps<o;){const l=At.taps;if(ho(),At.phase==="search"&&At.taps===l)break}}else Qn=Math.max(At.taps*n,Qn-i*1.5);else At.phase==="inspect"&&ri&&(ti=!1,(a=ht.revealState)!=null&&a.ready&&Vn.update(e.yaw,t)&&Eo("gesture"))}function is(){return{active:Ne,stereo:Yr,settings:{...se},focus:+Qn.toFixed(3),gazeHit:ti,pendingSave:ri,pendingCompletion:lo,shake:Vn.info(),look:(Ee==null?void 0:Ee.info())||null,wrist:Ie?{link:(fn==null?void 0:fn.status())||null,beacon:(ge==null?void 0:ge.info())||null,hand:Ie.snapshot()}:null,world:(ht==null?void 0:ht.vrInfo())||null}}function qu(i,t,e=10,n=.03){const s=yn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),Ne?uo(0,r.lastAt):Tc(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),Ne?uo(n,r.lastAt):Tc(n);return ht.update(0),r.lastAt=performance.now(),is()}function pd(i){if(_c=requestAnimationFrame(pd),cs.some(n=>n.open)){K("#vr-dialog").open&&!nr&&(Ee==null||Ee.processPrep(),se.mode==="hand"&&(ge==null||ge.process()),Xe()),rs=i;return}if(nr||ht.testRevealHold){rs=i;return}const t=rs?(i-rs)/1e3:.016;rs=i;const e=Math.min(t,.1);Ne&&uo(e,i),ht.update(e,t),ps(),Ne||x2()}function P2(){Rn("[data-pose]").forEach(t=>t.addEventListener("click",()=>{ht.setPose(t.dataset.pose),co()})),K("#zoom-in").addEventListener("click",()=>{ht.setZoom(.2),Ur()}),K("#zoom-out").addEventListener("click",()=>{ht.setZoom(-.2),Ur()}),K("#zoom-reset").addEventListener("click",()=>{ht.setZoom(1-ht.zoom),Ur()}),K("#search-button").addEventListener("click",ho),K("#discard").addEventListener("click",()=>Xs(!1)),K("#keep").addEventListener("click",()=>Xs(!0)),K("#close-review").addEventListener("click",Gu),K("#open-collection").addEventListener("click",wc),K("#open-settings").addEventListener("click",()=>{K("#reset-confirm").hidden=!0,K("#reset-button").hidden=!1,K("#settings-dialog").showModal()}),K("#open-vr").addEventListener("click",ud),Rn("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{const e=t.dataset.vrMode;se.mode=e==="fusion"?"fusion":e==="hand"?"hand":"gyro",Dr(),Cn=null,wi="",yn().setMode(se.mode==="fusion"?"fusion":"gyro"),Xe()})),K("#vr-gyro-btn").addEventListener("click",async()=>{wi="",await yn().requestGyro(),Xe()}),K("#vr-start-camera").addEventListener("click",async()=>{wi="";const t=yn();t.tracker.error=null,await t.startCamera(),Xe()}),Rn(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";wi="",Cn=Cn===e?null:e,Xe()})),K("#vr-camera").addEventListener("click",t=>{if(!Cn)return;const e=yn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(Cn==="left"?se.leftHue=Math.round(n.hue):se.rightHue=Math.round(n.hue),e.setHues(se.leftHue,se.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Dr(),wi="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",Cn=null,e.tracker.process(!0),Xe())}),K("#vr-calibrate").addEventListener("click",()=>{const t=yn();t.tracker.process(!0);const e=t.tracker.calibrate();wi=e.ok?"":e.message,Xe()}),Rn("[data-hand-side]").forEach(t=>t.addEventListener("click",()=>Qc(t.dataset.handSide))),K("#vr-hand-room-btn").addEventListener("click",async()=>{var t;ai(),ao="",await fn.startFirebase(((t=K("#vr-hand-fb"))==null?void 0:t.value)||""),Xe()}),K("#vr-hand-demo-btn").addEventListener("click",()=>{ai(),ao="",fn.startDemo("111111"),Xe()}),K("#vr-hand-cam-btn").addEventListener("click",async()=>{const t=hd();t.running?t.stop():await t.start(K("#vr-hand-camera")),Xe()}),K("#vr-hand-cal1").addEventListener("click",()=>$r("pose1")),K("#vr-hand-cal2").addEventListener("click",()=>$r("pose2")),K("#vr-start").addEventListener("click",C2),K("#vr-quality").value=se.quality,K("#vr-quality").addEventListener("change",t=>{se.quality=t.target.value,Dr()}),Rn("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),cs.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{Oe=null,rs=0,t.id==="vr-dialog"&&!Sc&&!Ne&&(oo++,zi=!1,K("#vr-countdown").hidden=!0,Cn=null,wi="",Ee==null||Ee.stop(),ge==null||ge.stop())})}),Rn("[data-filter]").forEach(t=>t.addEventListener("click",()=>{vc=t.dataset.filter,Rn("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),od()})),K("#low-quality").addEventListener("change",t=>{ht.setQuality(t.target.checked),ht.update(.016);try{ci.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),K("#reset-button").addEventListener("click",()=>{K("#reset-confirm").hidden=!1,K("#reset-button").hidden=!0}),K("#reset-cancel").addEventListener("click",()=>{K("#reset-confirm").hidden=!0,K("#reset-button").hidden=!1}),K("#reset-yes").addEventListener("click",ld),K("#continue-button").addEventListener("click",()=>K("#complete-dialog").close()),K("#view-complete").addEventListener("click",()=>{K("#complete-dialog").close(),wc()});const i=K("#world");i.addEventListener("pointerdown",t=>{if(Ne){clearTimeout(Mr),Mr=setTimeout(()=>Rr("long-press"),900);return}cs.some(e=>e.open)||Oe||!t.isPrimary||(At.phase==="inspect"&&(ht.finishReveal(),ps()),Oe={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!Oe||Oe.id!==t.pointerId)return;const e=t.clientX-Oe.x,n=t.clientY-Oe.y;Math.hypot(t.clientX-Oe.startX,t.clientY-Oe.startY)>10&&(Oe.moved=!0,At.phase!=="inspect"&&!Ne&&y2()),At.phase==="inspect"?(ht.rotate(e,n),co()):Ne||ht.lookBy(e,n),Oe.x=t.clientX,Oe.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout(Mr),!Oe||Oe.id!==t.pointerId)return;const e=!Oe.moved;Oe=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&At.phase==="search"&&ht.hitBin(t.clientX,t.clientY)&&ho()}),i.addEventListener("pointercancel",()=>{clearTimeout(Mr),Oe=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout(Mr),Oe=null}),document.addEventListener("visibilitychange",()=>{nr=document.hidden,Oe=null,rs=0,document.hidden&&Ne&&Rr("hidden")}),window.addEventListener("blur",()=>Oe=null),window.addEventListener("resize",()=>{ht.resize(),Ne&&fd(),cs.some(t=>t.open)&&ht.update(.016)}),document.addEventListener("fullscreenchange",()=>{Ne&&!document.fullscreenElement&&Rr("fullscreen")}),window.addEventListener("pagehide",()=>{ri&&Eo("pagehide"),Ne&&(Ee==null||Ee.stop())}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&Ne){t.preventDefault(),Rr("escape");return}t.key==="Escape"&&!cs.some(e=>e.open)&&At.phase==="inspect"&&(t.preventDefault(),At.reviewing?Gu():(ht.finishReveal(),ps(),Xs(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),nr=!0,K("#webgl-error").hidden=!1})}async function I2(){try{ht=new y_(K("#world"));try{ci.getItem("white-night-quality")==="low"&&(ht.setQuality(!0),K("#low-quality").checked=!0)}catch{}P2(),Wi(),await Promise.all([document.fonts.ready,Ex()]),ht.update(.016),K("#loading").hidden=!0,window.__READY__=!0,_c=requestAnimationFrame(pd),Vu&&(window.__WORLD__=ht),Vu&&(window.__GAME_TEST__={getState:()=>structuredClone(At),getMetrics:()=>ht.metrics(),settle:()=>{ht.finishReveal(),ht.kick=0,ht.dirty=!0,ht.update(.016),ps()},seekReveal:i=>{ht.testRevealHold=!0,ht.reveal=Math.max(0,Math.min(1,i)),ht.applyReveal(),ht.dirty=!0,ht.update(0),ps()},setPose:i=>{ht.setPose(i),ht.update(.1),co()},getRotation:()=>({x:ht.targetX,y:ht.targetY}),binScreen:()=>ht.binScreen(),forceNext:i=>{if(!un.some(t=>t.id===i))throw Error("unknown item");yc=i},setView:i=>{const t=ht.setView(i);return ht.update(.016),t},look:(i,t)=>(ht.lookBy(0,0),ht.headLook.yaw=p2(i,-41,41)*Math.PI/180,ht.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,ht.applyCameraPose(),ht.dirty=!0,ht.update(.016),ht.lookInfo()),sky:()=>({stars:ht.sky.stars.geometry.attributes.position.count,moon:ht.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:ht.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{cs.forEach(i=>i.close()),ld()},setCollection:i=>{At=qr({collection:i,searches:i.length}),ht.hide(),To(),Wi()},isPaused:()=>nr,items:un.map(i=>i.id),scene:()=>({staticVisible:ht.static.visible,drawCalls:ht.renderer.info.render.calls,headLook:ht.lookInfo(),sky:{stars:ht.sky.stars.geometry.attributes.position.count,moonVisible:ht.sky.moon.visible}}),vr:{info:()=>is(),open:()=>ud(),setMode:i=>(se.mode=i==="fusion"?"fusion":i==="hand"?"hand":"gyro",Dr(),yn().setMode(se.mode==="fusion"?"fusion":"gyro"),Xe(),is()),setHandSide:i=>(Qc(i),is()),requestGyro:()=>yn().requestGyro(),gyro:(i,t,e=10,n=.03)=>qu(i,t,e,n),marker:(i,t)=>yn().tracker.inject(i,t),calibrate:i=>yn().tracker.calibrate(i),wristDemo:i=>(ai(),fn.startDemo(i||"111111")),wristPacket:(i,t=performance.now())=>(ai(),fn.injectPacket(i,t),is()),wristBeacon:(i,t=performance.now())=>(ai(),hd().inject(i,t)),wristCalibrateStretch:()=>$r("pose1"),wristCalibrateBend:()=>$r("pose2"),start:()=>dd(),stop:()=>Rr("test"),step:(i=.1,t)=>{let e=Math.max(0,i),n=t;for(;e>0;){const s=Math.min(.05,e);n!==void 0&&(n+=s*1e3),Ee&&(Ee.gyro.lastAt=performance.now()),uo(s,n!==void 0?n:performance.now()),e-=s}return ht.update(0),is()},shake:(i=25)=>{for(const t of[-i,i,-i])qu(t,0,10,.03);return is()},settings:()=>({...se}),finish:()=>Eo("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),K("#loading").hidden=!0,K("#webgl-error").hidden=!1,cancelAnimationFrame(_c)}}I2();
