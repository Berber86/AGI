(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Mc="180",_d=0,eh=1,yd=2,Wu=1,Xu=2,xi=3,Oi=0,nn=1,Oe=2,ln=0,ks=1,Rr=2,nh=3,ih=4,qu=5,yi=100,Md=101,Sd=102,bd=103,wd=104,ul=200,Td=201,Ed=202,Ad=203,fl=204,dl=205,Yu=206,Rd=207,$u=208,Cd=209,Pd=210,Id=211,Ld=212,Dd=213,Ud=214,pl=0,ml=1,gl=2,Vs=3,vl=4,xl=5,_l=6,yl=7,Sc=0,Nd=1,Fd=2,Ni=0,Zu=1,Ju=2,Ku=3,bc=4,ju=5,Qu=6,tf=7,ef=300,Gs=301,Ws=302,Ml=303,Sl=304,ro=306,zi=1e3,ns=1001,bl=1002,hn=1003,Od=1004,Xr=1005,ni=1006,So=1007,is=1008,li=1009,nf=1010,sf=1011,Cr=1012,wc=1013,as=1014,qn=1015,ci=1016,Tc=1017,Ec=1018,Xs=1020,rf=35902,af=35899,of=1021,lf=1022,Yn=1023,Pr=1026,qs=1027,ao=1028,Ac=1029,cf=1030,Rc=1031,Cc=1033,Fa=33776,Oa=33777,za=33778,ka=33779,wl=35840,Tl=35841,El=35842,Al=35843,Rl=36196,Cl=37492,Pl=37496,Il=37808,Ll=37809,Dl=37810,Ul=37811,Nl=37812,Fl=37813,Ol=37814,zl=37815,kl=37816,Bl=37817,Hl=37818,Vl=37819,Gl=37820,Wl=37821,Xl=36492,ql=36494,Yl=36495,$l=36283,Zl=36284,Jl=36285,Kl=36286,zd=3200,kd=3201,oo=0,Bd=1,Sn="",qe="srgb",Ys="srgb-linear",Wa="linear",ge="srgb",ds=7680,sh=519,Hd=512,Vd=513,Gd=514,hf=515,Wd=516,Xd=517,qd=518,Yd=519,jl=35044,qr=35048,rh="300 es",ii=2e3,Xa=2001;class Qs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ah=1234567;const Sr=Math.PI/180,Ir=180/Math.PI;function si(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ke[i&255]+Ke[i>>8&255]+Ke[i>>16&255]+Ke[i>>24&255]+"-"+Ke[t&255]+Ke[t>>8&255]+"-"+Ke[t>>16&15|64]+Ke[t>>24&255]+"-"+Ke[e&63|128]+Ke[e>>8&255]+"-"+Ke[e>>16&255]+Ke[e>>24&255]+Ke[n&255]+Ke[n>>8&255]+Ke[n>>16&255]+Ke[n>>24&255]).toLowerCase()}function ae(i,t,e){return Math.max(t,Math.min(e,i))}function Pc(i,t){return(i%t+t)%t}function $d(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Zd(i,t,e){return i!==t?(e-i)/(t-i):0}function br(i,t,e){return(1-e)*i+e*t}function Jd(i,t,e,n){return br(i,t,1-Math.exp(-e*n))}function Kd(i,t=1){return t-Math.abs(Pc(i,t*2)-t)}function jd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Qd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function t0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function e0(i,t){return i+Math.random()*(t-i)}function n0(i){return i*(.5-Math.random())}function i0(i){i!==void 0&&(ah=i);let t=ah+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function s0(i){return i*Sr}function r0(i){return i*Ir}function a0(i){return(i&i-1)===0&&i!==0}function o0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function l0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function c0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),f=r((t-n)/2),m=a((t-n)/2),u=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*f,l*m,o*c);break;case"YZY":i.set(l*m,o*h,l*f,o*c);break;case"ZXZ":i.set(l*f,l*m,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*u,o*c);break;case"YXY":i.set(l*u,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Xn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const be={DEG2RAD:Sr,RAD2DEG:Ir,generateUUID:si,clamp:ae,euclideanModulo:Pc,mapLinear:$d,inverseLerp:Zd,lerp:br,damp:Jd,pingpong:Kd,smoothstep:jd,smootherstep:Qd,randInt:t0,randFloat:e0,randFloatSpread:n0,seededRandom:i0,degToRad:s0,radToDeg:r0,isPowerOfTwo:a0,ceilPowerOfTwo:o0,floorPowerOfTwo:l0,setQuaternionFromProperEuler:c0,normalize:ve,denormalize:Xn};class ct{constructor(t=0,e=0){ct.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Dn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3];const m=r[a+0],u=r[a+1],p=r[a+2],g=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=m,t[e+1]=u,t[e+2]=p,t[e+3]=g;return}if(f!==g||l!==m||c!==u||h!==p){let v=1-o;const d=l*m+c*u+h*p+f*g,x=d>=0?1:-1,_=1-d*d;if(_>Number.EPSILON){const w=Math.sqrt(_),b=Math.atan2(w,d*x);v=Math.sin(v*b)/w,o=Math.sin(o*b)/w}const y=o*x;if(l=l*v+m*y,c=c*v+u*y,h=h*v+p*y,f=f*v+g*y,v===1-o){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],m=r[a+1],u=r[a+2],p=r[a+3];return t[e]=o*p+h*f+l*u-c*m,t[e+1]=l*p+h*m+c*f-o*u,t[e+2]=c*p+h*u+o*m-l*f,t[e+3]=h*p-o*f-l*m-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),m=l(n/2),u=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=m*h*f+c*u*p,this._y=c*u*f-m*h*p,this._z=c*h*p+m*u*f,this._w=c*h*f-m*u*p;break;case"YXZ":this._x=m*h*f+c*u*p,this._y=c*u*f-m*h*p,this._z=c*h*p-m*u*f,this._w=c*h*f+m*u*p;break;case"ZXY":this._x=m*h*f-c*u*p,this._y=c*u*f+m*h*p,this._z=c*h*p+m*u*f,this._w=c*h*f-m*u*p;break;case"ZYX":this._x=m*h*f-c*u*p,this._y=c*u*f+m*h*p,this._z=c*h*p-m*u*f,this._w=c*h*f+m*u*p;break;case"YZX":this._x=m*h*f+c*u*p,this._y=c*u*f+m*h*p,this._z=c*h*p-m*u*f,this._w=c*h*f-m*u*p;break;case"XZY":this._x=m*h*f-c*u*p,this._y=c*u*f-m*h*p,this._z=c*h*p+m*u*f,this._w=c*h*f+m*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],m=n+o+f;if(m>0){const u=.5/Math.sqrt(m+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(n>o&&n>f){const u=2*Math.sqrt(1+n-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-n-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-n-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ae(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-e)*h)/c,m=Math.sin(e*h)/c;return this._w=a*f+this._w*m,this._x=n*f+this._x*m,this._y=s*f+this._y*m,this._z=r*f+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(oh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(oh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this.z=ae(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this.z=ae(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return bo.copy(this).projectOnVector(t),this.sub(bo)}reflect(t){return this.sub(bo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const bo=new U,oh=new Dn;class ne{constructor(t,e,n,s,r,a,o,l,c){ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],m=n[2],u=n[5],p=n[8],g=s[0],v=s[3],d=s[6],x=s[1],_=s[4],y=s[7],w=s[2],b=s[5],A=s[8];return r[0]=a*g+o*x+l*w,r[3]=a*v+o*_+l*b,r[6]=a*d+o*y+l*A,r[1]=c*g+h*x+f*w,r[4]=c*v+h*_+f*b,r[7]=c*d+h*y+f*A,r[2]=m*g+u*x+p*w,r[5]=m*v+u*_+p*b,r[8]=m*d+u*y+p*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,m=o*l-h*r,u=c*r-a*l,p=e*f+n*m+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/p;return t[0]=f*g,t[1]=(s*c-h*n)*g,t[2]=(o*n-s*a)*g,t[3]=m*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-o*e)*g,t[6]=u*g,t[7]=(n*l-c*e)*g,t[8]=(a*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(wo.makeScale(t,e)),this}rotate(t){return this.premultiply(wo.makeRotation(-t)),this}translate(t,e){return this.premultiply(wo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const wo=new ne;function uf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Lr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function h0(){const i=Lr("canvas");return i.style.display="block",i}const lh={};function Dr(i){i in lh||(lh[i]=!0,console.warn(i))}function u0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const ch=new ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hh=new ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function f0(){const i={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ge&&(s.r=Si(s.r),s.g=Si(s.g),s.b=Si(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ge&&(s.r=Bs(s.r),s.g=Bs(s.g),s.b=Bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Sn?Wa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Dr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Dr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ys]:{primaries:t,whitePoint:n,transfer:Wa,toXYZ:ch,fromXYZ:hh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:t,whitePoint:n,transfer:ge,toXYZ:ch,fromXYZ:hh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}}),i}const de=f0();function Si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ps;class d0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ps===void 0&&(ps=Lr("canvas")),ps.width=t.width,ps.height=t.height;const s=ps.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=ps}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Lr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Si(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Si(e[n]/255)*255):e[n]=Si(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let p0=0;class Ic{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=si(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(To(s[a].image)):r.push(To(s[a]))}else r=To(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function To(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?d0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let m0=0;const Eo=new U;class $e extends Qs{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,n=ns,s=ns,r=ni,a=is,o=Yn,l=li,c=$e.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:m0++}),this.uuid=si(),this.name="",this.source=new Ic(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ct(0,0),this.repeat=new ct(1,1),this.center=new ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Eo).x}get height(){return this.source.getSize(Eo).y}get depth(){return this.source.getSize(Eo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ef)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case zi:t.x=t.x-Math.floor(t.x);break;case ns:t.x=t.x<0?0:1;break;case bl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case zi:t.y=t.y-Math.floor(t.y);break;case ns:t.y=t.y<0?0:1;break;case bl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=ef;$e.DEFAULT_ANISOTROPY=1;class ye{constructor(t=0,e=0,n=0,s=1){ye.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],m=l[1],u=l[5],p=l[9],g=l[2],v=l[6],d=l[10];if(Math.abs(h-m)<.01&&Math.abs(f-g)<.01&&Math.abs(p-v)<.01){if(Math.abs(h+m)<.1&&Math.abs(f+g)<.1&&Math.abs(p+v)<.1&&Math.abs(c+u+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,y=(u+1)/2,w=(d+1)/2,b=(h+m)/4,A=(f+g)/4,T=(p+v)/4;return _>y&&_>w?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=b/n,r=A/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=T/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=A/r,s=T/r),this.set(n,s,r,e),this}let x=Math.sqrt((v-p)*(v-p)+(f-g)*(f-g)+(m-h)*(m-h));return Math.abs(x)<.001&&(x=1),this.x=(v-p)/x,this.y=(f-g)/x,this.z=(m-h)/x,this.w=Math.acos((c+u+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ae(this.x,t.x,e.x),this.y=ae(this.y,t.y,e.y),this.z=ae(this.z,t.z,e.z),this.w=ae(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ae(this.x,t,e),this.y=ae(this.y,t,e),this.z=ae(this.z,t,e),this.w=ae(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class g0 extends Qs{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ni,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new $e(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ni,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ic(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends g0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ff extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class v0 extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $n{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,zn):zn.fromBufferAttribute(r,a),zn.applyMatrix4(t.matrixWorld),this.expandByPoint(zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Yr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Yr.copy(n.boundingBox)),Yr.applyMatrix4(t.matrixWorld),this.union(Yr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,zn),zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(sr),$r.subVectors(this.max,sr),ms.subVectors(t.a,sr),gs.subVectors(t.b,sr),vs.subVectors(t.c,sr),Ti.subVectors(gs,ms),Ei.subVectors(vs,gs),Gi.subVectors(ms,vs);let e=[0,-Ti.z,Ti.y,0,-Ei.z,Ei.y,0,-Gi.z,Gi.y,Ti.z,0,-Ti.x,Ei.z,0,-Ei.x,Gi.z,0,-Gi.x,-Ti.y,Ti.x,0,-Ei.y,Ei.x,0,-Gi.y,Gi.x,0];return!Ao(e,ms,gs,vs,$r)||(e=[1,0,0,0,1,0,0,0,1],!Ao(e,ms,gs,vs,$r))?!1:(Zr.crossVectors(Ti,Ei),e=[Zr.x,Zr.y,Zr.z],Ao(e,ms,gs,vs,$r))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const fi=[new U,new U,new U,new U,new U,new U,new U,new U],zn=new U,Yr=new $n,ms=new U,gs=new U,vs=new U,Ti=new U,Ei=new U,Gi=new U,sr=new U,$r=new U,Zr=new U,Wi=new U;function Ao(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Wi.fromArray(i,r);const o=s.x*Math.abs(Wi.x)+s.y*Math.abs(Wi.y)+s.z*Math.abs(Wi.z),l=t.dot(Wi),c=e.dot(Wi),h=n.dot(Wi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const x0=new $n,rr=new U,Ro=new U;class us{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):x0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rr.subVectors(t,this.center);const e=rr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(rr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ro.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rr.copy(t.center).add(Ro)),this.expandByPoint(rr.copy(t.center).sub(Ro))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const di=new U,Co=new U,Jr=new U,Ai=new U,Po=new U,Kr=new U,Io=new U;class Lc{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,di)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=di.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(di.copy(this.origin).addScaledVector(this.direction,e),di.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Co.copy(t).add(e).multiplyScalar(.5),Jr.copy(e).sub(t).normalize(),Ai.copy(this.origin).sub(Co);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Jr),o=Ai.dot(this.direction),l=-Ai.dot(Jr),c=Ai.lengthSq(),h=Math.abs(1-a*a);let f,m,u,p;if(h>0)if(f=a*l-o,m=a*o-l,p=r*h,f>=0)if(m>=-p)if(m<=p){const g=1/h;f*=g,m*=g,u=f*(f+a*m+2*o)+m*(a*f+m+2*l)+c}else m=r,f=Math.max(0,-(a*m+o)),u=-f*f+m*(m+2*l)+c;else m=-r,f=Math.max(0,-(a*m+o)),u=-f*f+m*(m+2*l)+c;else m<=-p?(f=Math.max(0,-(-a*r+o)),m=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+m*(m+2*l)+c):m<=p?(f=0,m=Math.min(Math.max(-r,-l),r),u=m*(m+2*l)+c):(f=Math.max(0,-(a*r+o)),m=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+m*(m+2*l)+c);else m=a>0?-r:r,f=Math.max(0,-(a*m+o)),u=-f*f+m*(m+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Co).addScaledVector(Jr,m),u}intersectSphere(t,e){di.subVectors(t.center,this.origin);const n=di.dot(this.direction),s=di.dot(di)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,m=this.origin;return c>=0?(n=(t.min.x-m.x)*c,s=(t.max.x-m.x)*c):(n=(t.max.x-m.x)*c,s=(t.min.x-m.x)*c),h>=0?(r=(t.min.y-m.y)*h,a=(t.max.y-m.y)*h):(r=(t.max.y-m.y)*h,a=(t.min.y-m.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-m.z)*f,l=(t.max.z-m.z)*f):(o=(t.max.z-m.z)*f,l=(t.min.z-m.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,di)!==null}intersectTriangle(t,e,n,s,r){Po.subVectors(e,t),Kr.subVectors(n,t),Io.crossVectors(Po,Kr);let a=this.direction.dot(Io),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ai.subVectors(this.origin,t);const l=o*this.direction.dot(Kr.crossVectors(Ai,Kr));if(l<0)return null;const c=o*this.direction.dot(Po.cross(Ai));if(c<0||l+c>a)return null;const h=-o*Ai.dot(Io);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,n,s,r,a,o,l,c,h,f,m,u,p,g,v){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,m,u,p,g,v)}set(t,e,n,s,r,a,o,l,c,h,f,m,u,p,g,v){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=f,d[14]=m,d[3]=u,d[7]=p,d[11]=g,d[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/xs.setFromMatrixColumn(t,0).length(),r=1/xs.setFromMatrixColumn(t,1).length(),a=1/xs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const m=a*h,u=a*f,p=o*h,g=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+p*c,e[5]=m-g*c,e[9]=-o*l,e[2]=g-m*c,e[6]=p+u*c,e[10]=a*l}else if(t.order==="YXZ"){const m=l*h,u=l*f,p=c*h,g=c*f;e[0]=m+g*o,e[4]=p*o-u,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=u*o-p,e[6]=g+m*o,e[10]=a*l}else if(t.order==="ZXY"){const m=l*h,u=l*f,p=c*h,g=c*f;e[0]=m-g*o,e[4]=-a*f,e[8]=p+u*o,e[1]=u+p*o,e[5]=a*h,e[9]=g-m*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const m=a*h,u=a*f,p=o*h,g=o*f;e[0]=l*h,e[4]=p*c-u,e[8]=m*c+g,e[1]=l*f,e[5]=g*c+m,e[9]=u*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const m=a*l,u=a*c,p=o*l,g=o*c;e[0]=l*h,e[4]=g-m*f,e[8]=p*f+u,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=u*f+p,e[10]=m-g*f}else if(t.order==="XZY"){const m=a*l,u=a*c,p=o*l,g=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=m*f+g,e[5]=a*h,e[9]=u*f-p,e[2]=p*f-u,e[6]=o*h,e[10]=g*f+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_0,t,y0)}lookAt(t,e,n){const s=this.elements;return _n.subVectors(t,e),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Ri.crossVectors(n,_n),Ri.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Ri.crossVectors(n,_n)),Ri.normalize(),jr.crossVectors(_n,Ri),s[0]=Ri.x,s[4]=jr.x,s[8]=_n.x,s[1]=Ri.y,s[5]=jr.y,s[9]=_n.y,s[2]=Ri.z,s[6]=jr.z,s[10]=_n.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],m=n[9],u=n[13],p=n[2],g=n[6],v=n[10],d=n[14],x=n[3],_=n[7],y=n[11],w=n[15],b=s[0],A=s[4],T=s[8],S=s[12],M=s[1],R=s[5],L=s[9],P=s[13],F=s[2],O=s[6],z=s[10],q=s[14],V=s[3],K=s[7],st=s[11],ut=s[15];return r[0]=a*b+o*M+l*F+c*V,r[4]=a*A+o*R+l*O+c*K,r[8]=a*T+o*L+l*z+c*st,r[12]=a*S+o*P+l*q+c*ut,r[1]=h*b+f*M+m*F+u*V,r[5]=h*A+f*R+m*O+u*K,r[9]=h*T+f*L+m*z+u*st,r[13]=h*S+f*P+m*q+u*ut,r[2]=p*b+g*M+v*F+d*V,r[6]=p*A+g*R+v*O+d*K,r[10]=p*T+g*L+v*z+d*st,r[14]=p*S+g*P+v*q+d*ut,r[3]=x*b+_*M+y*F+w*V,r[7]=x*A+_*R+y*O+w*K,r[11]=x*T+_*L+y*z+w*st,r[15]=x*S+_*P+y*q+w*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],m=t[10],u=t[14],p=t[3],g=t[7],v=t[11],d=t[15];return p*(+r*l*f-s*c*f-r*o*m+n*c*m+s*o*u-n*l*u)+g*(+e*l*u-e*c*m+r*a*m-s*a*u+s*c*h-r*l*h)+v*(+e*c*f-e*o*u-r*a*f+n*a*u+r*o*h-n*c*h)+d*(-s*o*h-e*l*f+e*o*m+s*a*f-n*a*m+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],m=t[10],u=t[11],p=t[12],g=t[13],v=t[14],d=t[15],x=f*v*c-g*m*c+g*l*u-o*v*u-f*l*d+o*m*d,_=p*m*c-h*v*c-p*l*u+a*v*u+h*l*d-a*m*d,y=h*g*c-p*f*c+p*o*u-a*g*u-h*o*d+a*f*d,w=p*f*l-h*g*l-p*o*m+a*g*m+h*o*v-a*f*v,b=e*x+n*_+s*y+r*w;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return t[0]=x*A,t[1]=(g*m*r-f*v*r-g*s*u+n*v*u+f*s*d-n*m*d)*A,t[2]=(o*v*r-g*l*r+g*s*c-n*v*c-o*s*d+n*l*d)*A,t[3]=(f*l*r-o*m*r-f*s*c+n*m*c+o*s*u-n*l*u)*A,t[4]=_*A,t[5]=(h*v*r-p*m*r+p*s*u-e*v*u-h*s*d+e*m*d)*A,t[6]=(p*l*r-a*v*r-p*s*c+e*v*c+a*s*d-e*l*d)*A,t[7]=(a*m*r-h*l*r+h*s*c-e*m*c-a*s*u+e*l*u)*A,t[8]=y*A,t[9]=(p*f*r-h*g*r-p*n*u+e*g*u+h*n*d-e*f*d)*A,t[10]=(a*g*r-p*o*r+p*n*c-e*g*c-a*n*d+e*o*d)*A,t[11]=(h*o*r-a*f*r-h*n*c+e*f*c+a*n*u-e*o*u)*A,t[12]=w*A,t[13]=(h*g*s-p*f*s+p*n*m-e*g*m-h*n*v+e*f*v)*A,t[14]=(p*o*s-a*g*s-p*n*l+e*g*l+a*n*v-e*o*v)*A,t[15]=(a*f*s-h*o*s+h*n*l-e*f*l-a*n*m+e*o*m)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,m=r*c,u=r*h,p=r*f,g=a*h,v=a*f,d=o*f,x=l*c,_=l*h,y=l*f,w=n.x,b=n.y,A=n.z;return s[0]=(1-(g+d))*w,s[1]=(u+y)*w,s[2]=(p-_)*w,s[3]=0,s[4]=(u-y)*b,s[5]=(1-(m+d))*b,s[6]=(v+x)*b,s[7]=0,s[8]=(p+_)*A,s[9]=(v-x)*A,s[10]=(1-(m+g))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=xs.set(s[0],s[1],s[2]).length();const a=xs.set(s[4],s[5],s[6]).length(),o=xs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],kn.copy(this);const c=1/r,h=1/a,f=1/o;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=f,kn.elements[9]*=f,kn.elements[10]*=f,e.setFromRotationMatrix(kn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=ii,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),m=(e+t)/(e-t),u=(n+s)/(n-s);let p,g;if(l)p=r/(a-r),g=a*r/(a-r);else if(o===ii)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Xa)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=ii,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),m=-(e+t)/(e-t),u=-(n+s)/(n-s);let p,g;if(l)p=1/(a-r),g=a/(a-r);else if(o===ii)p=-2/(a-r),g=-(a+r)/(a-r);else if(o===Xa)p=-1/(a-r),g=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xs=new U,kn=new ue,_0=new U(0,0,0),y0=new U(1,1,1),Ri=new U,jr=new U,_n=new U,uh=new ue,fh=new Dn;class Fn{constructor(t=0,e=0,n=0,s=Fn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],m=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(ae(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ae(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ae(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ae(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(m,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ae(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return uh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(uh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return fh.setFromEuler(this),this.setFromQuaternion(fh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fn.DEFAULT_ORDER="XYZ";class Dc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let M0=0;const dh=new U,_s=new Dn,pi=new ue,Qr=new U,ar=new U,S0=new U,b0=new Dn,ph=new U(1,0,0),mh=new U(0,1,0),gh=new U(0,0,1),vh={type:"added"},w0={type:"removed"},ys={type:"childadded",child:null},Lo={type:"childremoved",child:null};class ze extends Qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:M0++}),this.uuid=si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ze.DEFAULT_UP.clone();const t=new U,e=new Fn,n=new Dn,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ue},normalMatrix:{value:new ne}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return _s.setFromAxisAngle(t,e),this.quaternion.multiply(_s),this}rotateOnWorldAxis(t,e){return _s.setFromAxisAngle(t,e),this.quaternion.premultiply(_s),this}rotateX(t){return this.rotateOnAxis(ph,t)}rotateY(t){return this.rotateOnAxis(mh,t)}rotateZ(t){return this.rotateOnAxis(gh,t)}translateOnAxis(t,e){return dh.copy(t).applyQuaternion(this.quaternion),this.position.add(dh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ph,t)}translateY(t){return this.translateOnAxis(mh,t)}translateZ(t){return this.translateOnAxis(gh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Qr.copy(t):Qr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(ar,Qr,this.up):pi.lookAt(Qr,ar,this.up),this.quaternion.setFromRotationMatrix(pi),s&&(pi.extractRotation(s.matrixWorld),_s.setFromRotationMatrix(pi),this.quaternion.premultiply(_s.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(vh),ys.child=t,this.dispatchEvent(ys),ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(w0),Lo.child=t,this.dispatchEvent(Lo),Lo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),pi.multiply(t.parent.matrixWorld)),t.applyMatrix4(pi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(vh),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,t,S0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,b0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),m=a(t.skeletons),u=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),m.length>0&&(n.skeletons=m),u.length>0&&(n.animations=u),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ze.DEFAULT_UP=new U(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bn=new U,mi=new U,Do=new U,gi=new U,Ms=new U,Ss=new U,xh=new U,Uo=new U,No=new U,Fo=new U,Oo=new ye,zo=new ye,ko=new ye;class In{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Bn.subVectors(t,e),s.cross(Bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Bn.subVectors(s,e),mi.subVectors(n,e),Do.subVectors(t,e);const a=Bn.dot(Bn),o=Bn.dot(mi),l=Bn.dot(Do),c=mi.dot(mi),h=mi.dot(Do),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const m=1/f,u=(c*l-o*h)*m,p=(a*h-o*l)*m;return r.set(1-u-p,p,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,gi)===null?!1:gi.x>=0&&gi.y>=0&&gi.x+gi.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,gi.x),l.addScaledVector(a,gi.y),l.addScaledVector(o,gi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Oo.setScalar(0),zo.setScalar(0),ko.setScalar(0),Oo.fromBufferAttribute(t,e),zo.fromBufferAttribute(t,n),ko.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Oo,r.x),a.addScaledVector(zo,r.y),a.addScaledVector(ko,r.z),a}static isFrontFacing(t,e,n,s){return Bn.subVectors(n,e),mi.subVectors(t,e),Bn.cross(mi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bn.subVectors(this.c,this.b),mi.subVectors(this.a,this.b),Bn.cross(mi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return In.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return In.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return In.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return In.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return In.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Ms.subVectors(s,n),Ss.subVectors(r,n),Uo.subVectors(t,n);const l=Ms.dot(Uo),c=Ss.dot(Uo);if(l<=0&&c<=0)return e.copy(n);No.subVectors(t,s);const h=Ms.dot(No),f=Ss.dot(No);if(h>=0&&f<=h)return e.copy(s);const m=l*f-h*c;if(m<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ms,a);Fo.subVectors(t,r);const u=Ms.dot(Fo),p=Ss.dot(Fo);if(p>=0&&u<=p)return e.copy(r);const g=u*c-l*p;if(g<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Ss,o);const v=h*p-u*f;if(v<=0&&f-h>=0&&u-p>=0)return xh.subVectors(r,s),o=(f-h)/(f-h+(u-p)),e.copy(s).addScaledVector(xh,o);const d=1/(v+g+m);return a=g*d,o=m*d,e.copy(n).addScaledVector(Ms,a).addScaledVector(Ss,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const df={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ci={h:0,s:0,l:0},ta={h:0,s:0,l:0};function Bo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Gt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=Pc(t,1),e=ae(e,0,1),n=ae(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Bo(a,r,t+1/3),this.g=Bo(a,r,t),this.b=Bo(a,r,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const n=df[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Si(t.r),this.g=Si(t.g),this.b=Si(t.b),this}copyLinearToSRGB(t){return this.r=Bs(t.r),this.g=Bs(t.g),this.b=Bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return de.workingToColorSpace(je.copy(this),t),Math.round(ae(je.r*255,0,255))*65536+Math.round(ae(je.g*255,0,255))*256+Math.round(ae(je.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(je.copy(this),e);const n=je.r,s=je.g,r=je.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=qe){de.workingToColorSpace(je.copy(this),t);const e=je.r,n=je.g,s=je.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ci),this.setHSL(Ci.h+t,Ci.s+e,Ci.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ci),t.getHSL(ta);const n=br(Ci.h,ta.h,e),s=br(Ci.s,ta.s,e),r=br(Ci.l,ta.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new Gt;Gt.NAMES=df;let T0=0;class bi extends Qs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:T0++}),this.uuid=si(),this.name="",this.type="Material",this.blending=ks,this.side=Oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fl,this.blendDst=dl,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ks&&(n.blending=this.blending),this.side!==Oi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fl&&(n.blendSrc=this.blendSrc),this.blendDst!==dl&&(n.blendDst=this.blendDst),this.blendEquation!==yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ye extends bi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ue=new U,ea=new ct;let E0=0;class Be{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:E0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=jl,this.updateRanges=[],this.gpuType=qn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ea.fromBufferAttribute(this,e),ea.applyMatrix3(t),this.setXY(e,ea.x,ea.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array),r=ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jl&&(t.usage=this.usage),t}}class pf extends Be{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class mf extends Be{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends Be{constructor(t,e,n){super(new Float32Array(t),e,n)}}let A0=0;const An=new ue,Ho=new ze,bs=new U,yn=new $n,or=new $n,Ge=new U;class Ie extends Qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(uf(t)?mf:pf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ne().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,n){return An.makeTranslation(t,e,n),this.applyMatrix4(An),this}scale(t,e,n){return An.makeScale(t,e,n),this.applyMatrix4(An),this}lookAt(t){return Ho.lookAt(t),Ho.updateMatrix(),this.applyMatrix4(Ho.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bs).negate(),this.translate(bs.x,bs.y,bs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $n);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new us);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];or.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(yn.min,or.min),yn.expandByPoint(Ge),Ge.addVectors(yn.max,or.max),yn.expandByPoint(Ge)):(yn.expandByPoint(or.min),yn.expandByPoint(or.max))}yn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ge.fromBufferAttribute(o,c),l&&(bs.fromBufferAttribute(t,c),Ge.add(bs)),s=Math.max(s,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let T=0;T<n.count;T++)o[T]=new U,l[T]=new U;const c=new U,h=new U,f=new U,m=new ct,u=new ct,p=new ct,g=new U,v=new U;function d(T,S,M){c.fromBufferAttribute(n,T),h.fromBufferAttribute(n,S),f.fromBufferAttribute(n,M),m.fromBufferAttribute(r,T),u.fromBufferAttribute(r,S),p.fromBufferAttribute(r,M),h.sub(c),f.sub(c),u.sub(m),p.sub(m);const R=1/(u.x*p.y-p.x*u.y);isFinite(R)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(f,-u.y).multiplyScalar(R),v.copy(f).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(R),o[T].add(g),o[S].add(g),o[M].add(g),l[T].add(v),l[S].add(v),l[M].add(v))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,S=x.length;T<S;++T){const M=x[T],R=M.start,L=M.count;for(let P=R,F=R+L;P<F;P+=3)d(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const _=new U,y=new U,w=new U,b=new U;function A(T){w.fromBufferAttribute(s,T),b.copy(w);const S=o[T];_.copy(S),_.sub(w.multiplyScalar(w.dot(S))).normalize(),y.crossVectors(b,S);const R=y.dot(l[T])<0?-1:1;a.setXYZW(T,_.x,_.y,_.z,R)}for(let T=0,S=x.length;T<S;++T){const M=x[T],R=M.start,L=M.count;for(let P=R,F=R+L;P<F;P+=3)A(t.getX(P+0)),A(t.getX(P+1)),A(t.getX(P+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Be(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let m=0,u=n.count;m<u;m++)n.setXYZ(m,0,0,0);const s=new U,r=new U,a=new U,o=new U,l=new U,c=new U,h=new U,f=new U;if(t)for(let m=0,u=t.count;m<u;m+=3){const p=t.getX(m+0),g=t.getX(m+1),v=t.getX(m+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,v),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(v,c.x,c.y,c.z)}else for(let m=0,u=e.count;m<u;m+=3)s.fromBufferAttribute(e,m+0),r.fromBufferAttribute(e,m+1),a.fromBufferAttribute(e,m+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(m+0,h.x,h.y,h.z),n.setXYZ(m+1,h.x,h.y,h.z),n.setXYZ(m+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,m=new c.constructor(l.length*h);let u=0,p=0;for(let g=0,v=l.length;g<v;g++){o.isInterleavedBufferAttribute?u=l[g]*o.data.stride+o.offset:u=l[g]*h;for(let d=0;d<h;d++)m[p++]=c[u++]}return new Be(m,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const m=c[h],u=t(m,n);l.push(u)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,m=c.length;f<m;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let m=0,u=f.length;m<u;m++)h.push(f[m].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _h=new ue,Xi=new Lc,na=new us,yh=new U,ia=new U,sa=new U,ra=new U,Vo=new U,aa=new U,Mh=new U,oa=new U;class Vt extends ze{constructor(t=new Ie,e=new Ye){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){aa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(Vo.fromBufferAttribute(f,t),a?aa.addScaledVector(Vo,h):aa.addScaledVector(Vo.sub(e),h))}e.add(aa)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(r),Xi.copy(t.ray).recast(t.near),!(na.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(na,yh)===null||Xi.origin.distanceToSquared(yh)>(t.far-t.near)**2))&&(_h.copy(r).invert(),Xi.copy(t.ray).applyMatrix4(_h),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,m=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,g=m.length;p<g;p++){const v=m[p],d=a[v.materialIndex],x=Math.max(v.start,u.start),_=Math.min(o.count,Math.min(v.start+v.count,u.start+u.count));for(let y=x,w=_;y<w;y+=3){const b=o.getX(y),A=o.getX(y+1),T=o.getX(y+2);s=la(this,d,t,n,c,h,f,b,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=v.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),g=Math.min(o.count,u.start+u.count);for(let v=p,d=g;v<d;v+=3){const x=o.getX(v),_=o.getX(v+1),y=o.getX(v+2);s=la(this,a,t,n,c,h,f,x,_,y),s&&(s.faceIndex=Math.floor(v/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,g=m.length;p<g;p++){const v=m[p],d=a[v.materialIndex],x=Math.max(v.start,u.start),_=Math.min(l.count,Math.min(v.start+v.count,u.start+u.count));for(let y=x,w=_;y<w;y+=3){const b=y,A=y+1,T=y+2;s=la(this,d,t,n,c,h,f,b,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=v.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),g=Math.min(l.count,u.start+u.count);for(let v=p,d=g;v<d;v+=3){const x=v,_=v+1,y=v+2;s=la(this,a,t,n,c,h,f,x,_,y),s&&(s.faceIndex=Math.floor(v/3),e.push(s))}}}}function R0(i,t,e,n,s,r,a,o){let l;if(t.side===nn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Oi,o),l===null)return null;oa.copy(o),oa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(oa);return c<e.near||c>e.far?null:{distance:c,point:oa.clone(),object:i}}function la(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,ia),i.getVertexPosition(l,sa),i.getVertexPosition(c,ra);const h=R0(i,t,e,n,ia,sa,ra,Mh);if(h){const f=new U;In.getBarycoord(Mh,ia,sa,ra,f),s&&(h.uv=In.getInterpolatedAttribute(s,o,l,c,f,new ct)),r&&(h.uv1=In.getInterpolatedAttribute(r,o,l,c,f,new ct)),a&&(h.normal=In.getInterpolatedAttribute(a,o,l,c,f,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const m={a:o,b:l,c,normal:new U,materialIndex:0};In.getNormal(ia,sa,ra,m.normal),h.face=m,h.barycoord=f}return h}class tn extends Ie{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let m=0,u=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2));function p(g,v,d,x,_,y,w,b,A,T,S){const M=y/A,R=w/T,L=y/2,P=w/2,F=b/2,O=A+1,z=T+1;let q=0,V=0;const K=new U;for(let st=0;st<z;st++){const ut=st*R-P;for(let Rt=0;Rt<O;Rt++){const Dt=Rt*M-L;K[g]=Dt*x,K[v]=ut*_,K[d]=F,c.push(K.x,K.y,K.z),K[g]=0,K[v]=0,K[d]=b>0?1:-1,h.push(K.x,K.y,K.z),f.push(Rt/A),f.push(1-st/T),q+=1}}for(let st=0;st<T;st++)for(let ut=0;ut<A;ut++){const Rt=m+ut+O*st,Dt=m+ut+O*(st+1),zt=m+(ut+1)+O*(st+1),Wt=m+(ut+1)+O*st;l.push(Rt,Dt,Wt),l.push(Dt,zt,Wt),V+=6}o.addGroup(u,V,S),u+=V,m+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function $s(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function on(i){const t={};for(let e=0;e<i.length;e++){const n=$s(i[e]);for(const s in n)t[s]=n[s]}return t}function C0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function gf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const ss={clone:$s,merge:on};var P0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,I0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cn extends bi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=P0,this.fragmentShader=I0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=$s(t.uniforms),this.uniformsGroups=C0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class vf extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=ii,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pi=new U,Sh=new ct,bh=new ct;class en extends vf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ir*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Sr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ir*2*Math.atan(Math.tan(Sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z)}getViewSize(t,e){return this.getViewBounds(t,Sh,bh),e.subVectors(bh,Sh)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Sr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ws=-90,Ts=1;class L0 extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new en(ws,Ts,t,e);s.layers=this.layers,this.add(s);const r=new en(ws,Ts,t,e);r.layers=this.layers,this.add(r);const a=new en(ws,Ts,t,e);a.layers=this.layers,this.add(a);const o=new en(ws,Ts,t,e);o.layers=this.layers,this.add(o);const l=new en(ws,Ts,t,e);l.layers=this.layers,this.add(l);const c=new en(ws,Ts,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===ii)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Xa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),m=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,m,u),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class xf extends $e{constructor(t=[],e=Gs,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class D0 extends wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new xf(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new tn(5,5,5),r=new cn({name:"CubemapFromEquirect",uniforms:$s(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:ln});r.uniforms.tEquirect.value=e;const a=new Vt(s,r),o=e.minFilter;return e.minFilter===is&&(e.minFilter=ni),new L0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class se extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const U0={type:"move"};class Go{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new se,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new se,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new se,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const v=e.getJointPose(g,n),d=this._getHandJoint(c,g);v!==null&&(d.matrix.fromArray(v.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=v.radius),d.visible=v!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],m=h.position.distanceTo(f.position),u=.02,p=.005;c.inputState.pinching&&m>u+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&m<=u-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(U0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new se;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Uc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Gt(t),this.density=e}clone(){return new Uc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Ql extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class N0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=jl,this.updateRanges=[],this.version=0,this.uuid=si()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const rn=new U;class qa{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyMatrix4(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.applyNormalMatrix(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)rn.fromBufferAttribute(this,e),rn.transformDirection(t),this.setXYZ(e,rn.x,rn.y,rn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ve(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Xn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Xn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Xn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Xn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array),r=ve(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Be(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new qa(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class tc extends bi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Es;const lr=new U,As=new U,Rs=new U,Cs=new ct,cr=new ct,_f=new ue,ca=new U,hr=new U,ha=new U,wh=new ct,Wo=new ct,Th=new ct;class Eh extends ze{constructor(t=new tc){if(super(),this.isSprite=!0,this.type="Sprite",Es===void 0){Es=new Ie;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new N0(e,5);Es.setIndex([0,1,2,0,2,3]),Es.setAttribute("position",new qa(n,3,0,!1)),Es.setAttribute("uv",new qa(n,2,3,!1))}this.geometry=Es,this.material=t,this.center=new ct(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),As.setFromMatrixScale(this.matrixWorld),_f.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Rs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&As.multiplyScalar(-Rs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;ua(ca.set(-.5,-.5,0),Rs,a,As,s,r),ua(hr.set(.5,-.5,0),Rs,a,As,s,r),ua(ha.set(.5,.5,0),Rs,a,As,s,r),wh.set(0,0),Wo.set(1,0),Th.set(1,1);let o=t.ray.intersectTriangle(ca,hr,ha,!1,lr);if(o===null&&(ua(hr.set(-.5,.5,0),Rs,a,As,s,r),Wo.set(0,1),o=t.ray.intersectTriangle(ca,ha,hr,!1,lr),o===null))return;const l=t.ray.origin.distanceTo(lr);l<t.near||l>t.far||e.push({distance:l,point:lr.clone(),uv:In.getInterpolation(lr,ca,hr,ha,wh,Wo,Th,new ct),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function ua(i,t,e,n,s,r){Cs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(cr.x=r*Cs.x-s*Cs.y,cr.y=s*Cs.x+r*Cs.y):cr.copy(Cs),i.copy(t),i.x+=cr.x,i.y+=cr.y,i.applyMatrix4(_f)}class yf extends $e{constructor(t=null,e=1,n=1,s,r,a,o,l,c=hn,h=hn,f,m){super(null,a,o,l,c,h,s,r,f,m),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ah extends Be{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ps=new ue,Rh=new ue,fa=[],Ch=new $n,F0=new ue,ur=new Vt,fr=new us;class O0 extends Vt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ah(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,F0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $n),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ps),Ch.copy(t.boundingBox).applyMatrix4(Ps),this.boundingBox.union(Ch)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new us),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ps),fr.copy(t.boundingSphere).applyMatrix4(Ps),this.boundingSphere.union(fr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ur.geometry=this.geometry,ur.material=this.material,ur.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fr.copy(this.boundingSphere),fr.applyMatrix4(n),t.ray.intersectsSphere(fr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ps),Rh.multiplyMatrices(n,Ps),ur.matrixWorld=Rh,ur.raycast(t,fa);for(let a=0,o=fa.length;a<o;a++){const l=fa[a];l.instanceId=r,l.object=this,e.push(l)}fa.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ah(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new yf(new Float32Array(s*this.count),s,this.count,ao,qn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Xo=new U,z0=new U,k0=new ne;class Zi{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Xo.subVectors(n,e).cross(z0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Xo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||k0.getNormalMatrix(t),s=this.coplanarPoint(Xo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new us,B0=new ct(.5,.5),da=new U;class Nc{constructor(t=new Zi,e=new Zi,n=new Zi,s=new Zi,r=new Zi,a=new Zi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ii,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],m=r[6],u=r[7],p=r[8],g=r[9],v=r[10],d=r[11],x=r[12],_=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-a,u-h,d-p,w-x).normalize(),s[1].setComponents(c+a,u+h,d+p,w+x).normalize(),s[2].setComponents(c+o,u+f,d+g,w+_).normalize(),s[3].setComponents(c-o,u-f,d-g,w-_).normalize(),n)s[4].setComponents(l,m,v,y).normalize(),s[5].setComponents(c-l,u-m,d-v,w-y).normalize();else if(s[4].setComponents(c-l,u-m,d-v,w-y).normalize(),e===ii)s[5].setComponents(c+l,u+m,d+v,w+y).normalize();else if(e===Xa)s[5].setComponents(l,m,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){qi.center.set(0,0,0);const e=B0.distanceTo(t.center);return qi.radius=.7071067811865476+e,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(da.x=s.normal.x>0?t.max.x:t.min.x,da.y=s.normal.y>0?t.max.y:t.min.y,da.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(da)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Mf extends bi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ph=new ue,ec=new Lc,pa=new us,ma=new U;class H0 extends ze{constructor(t=new Ie,e=new Mf){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(s),pa.radius+=r,t.ray.intersectsSphere(pa)===!1)return;Ph.copy(s).invert(),ec.copy(t.ray).applyMatrix4(Ph);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const m=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let p=m,g=u;p<g;p++){const v=c.getX(p);ma.fromBufferAttribute(f,v),Ih(ma,v,l,s,t,e,this)}}else{const m=Math.max(0,a.start),u=Math.min(f.count,a.start+a.count);for(let p=m,g=u;p<g;p++)ma.fromBufferAttribute(f,p),Ih(ma,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ih(i,t,e,n,s,r,a){const o=ec.distanceSqToPoint(i);if(o<e){const l=new U;ec.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class V0 extends $e{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Fc extends $e{constructor(t,e,n=as,s,r,a,o=hn,l=hn,c,h=Pr,f=1){if(h!==Pr&&h!==qs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:t,height:e,depth:f};super(m,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ic(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Sf extends $e{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ki extends Ie{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new U,h=new ct;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,m=3;f<=e;f++,m+=3){const u=n+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[m]/t+1)/2,h.y=(a[m+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(o,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ki(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ce extends Ie{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],m=[],u=[];let p=0;const g=[],v=n/2;let d=0;x(),a===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new oe(f,3)),this.setAttribute("normal",new oe(m,3)),this.setAttribute("uv",new oe(u,2));function x(){const y=new U,w=new U;let b=0;const A=(e-t)/n;for(let T=0;T<=r;T++){const S=[],M=T/r,R=M*(e-t)+t;for(let L=0;L<=s;L++){const P=L/s,F=P*l+o,O=Math.sin(F),z=Math.cos(F);w.x=R*O,w.y=-M*n+v,w.z=R*z,f.push(w.x,w.y,w.z),y.set(O,A,z).normalize(),m.push(y.x,y.y,y.z),u.push(P,1-M),S.push(p++)}g.push(S)}for(let T=0;T<s;T++)for(let S=0;S<r;S++){const M=g[S][T],R=g[S+1][T],L=g[S+1][T+1],P=g[S][T+1];(t>0||S!==0)&&(h.push(M,R,P),b+=3),(e>0||S!==r-1)&&(h.push(R,L,P),b+=3)}c.addGroup(d,b,0),d+=b}function _(y){const w=p,b=new ct,A=new U;let T=0;const S=y===!0?t:e,M=y===!0?1:-1;for(let L=1;L<=s;L++)f.push(0,v*M,0),m.push(0,M,0),u.push(.5,.5),p++;const R=p;for(let L=0;L<=s;L++){const F=L/s*l+o,O=Math.cos(F),z=Math.sin(F);A.x=S*z,A.y=v*M,A.z=S*O,f.push(A.x,A.y,A.z),m.push(0,M,0),b.x=O*.5+.5,b.y=z*.5*M+.5,u.push(b.x,b.y),p++}for(let L=0;L<s;L++){const P=w+L,F=R+L;y===!0?h.push(F,F+1,P):h.push(F+1,F,P),T+=3}c.addGroup(d,T,y===!0?1:2),d+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Oc extends Ie{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new oe(r,3)),this.setAttribute("normal",new oe(r.slice(),3)),this.setAttribute("uv",new oe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const _=new U,y=new U,w=new U;for(let b=0;b<e.length;b+=3)u(e[b+0],_),u(e[b+1],y),u(e[b+2],w),l(_,y,w,x)}function l(x,_,y,w){const b=w+1,A=[];for(let T=0;T<=b;T++){A[T]=[];const S=x.clone().lerp(y,T/b),M=_.clone().lerp(y,T/b),R=b-T;for(let L=0;L<=R;L++)L===0&&T===b?A[T][L]=S:A[T][L]=S.clone().lerp(M,L/R)}for(let T=0;T<b;T++)for(let S=0;S<2*(b-T)-1;S++){const M=Math.floor(S/2);S%2===0?(m(A[T][M+1]),m(A[T+1][M]),m(A[T][M])):(m(A[T][M+1]),m(A[T+1][M+1]),m(A[T+1][M]))}}function c(x){const _=new U;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(x),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function h(){const x=new U;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];const y=v(x)/2/Math.PI+.5,w=d(x)/Math.PI+.5;a.push(y,1-w)}p(),f()}function f(){for(let x=0;x<a.length;x+=6){const _=a[x+0],y=a[x+2],w=a[x+4],b=Math.max(_,y,w),A=Math.min(_,y,w);b>.9&&A<.1&&(_<.2&&(a[x+0]+=1),y<.2&&(a[x+2]+=1),w<.2&&(a[x+4]+=1))}}function m(x){r.push(x.x,x.y,x.z)}function u(x,_){const y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function p(){const x=new U,_=new U,y=new U,w=new U,b=new ct,A=new ct,T=new ct;for(let S=0,M=0;S<r.length;S+=9,M+=6){x.set(r[S+0],r[S+1],r[S+2]),_.set(r[S+3],r[S+4],r[S+5]),y.set(r[S+6],r[S+7],r[S+8]),b.set(a[M+0],a[M+1]),A.set(a[M+2],a[M+3]),T.set(a[M+4],a[M+5]),w.copy(x).add(_).add(y).divideScalar(3);const R=v(w);g(b,M+0,x,R),g(A,M+2,_,R),g(T,M+4,y,R)}}function g(x,_,y,w){w<0&&x.x===1&&(a[_]=x.x-1),y.x===0&&y.z===0&&(a[_]=w/2/Math.PI+.5)}function v(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oc(t.vertices,t.indices,t.radius,t.details)}}class hi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],m=n[s+1]-h,u=(a-h)/m;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ct:new U);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,s=[],r=[],a=[],o=new U,l=new ue;for(let u=0;u<=t;u++){const p=u/t;s[u]=this.getTangentAt(p,new U)}r[0]=new U,a[0]=new U;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),m=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),m<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(ae(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(l.makeRotationAxis(o,p))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(ae(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],u*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ur extends hi{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ct){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),m=l-this.aX,u=c-this.aY;l=m*h-u*f+this.aX,c=m*f+u*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class G0 extends Ur{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function zc(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let m=(a-r)/c-(o-r)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+f)+(l-o)/f;m*=h,u*=h,s(a,o,m,u)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const ga=new U,qo=new zc,Yo=new zc,$o=new zc;class os extends hi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(ga.subVectors(s[0],s[1]).add(s[0]),c=ga);const f=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(ga.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ga),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),u),g=Math.pow(f.distanceToSquared(m),u),v=Math.pow(m.distanceToSquared(h),u);g<1e-4&&(g=1),p<1e-4&&(p=g),v<1e-4&&(v=g),qo.initNonuniformCatmullRom(c.x,f.x,m.x,h.x,p,g,v),Yo.initNonuniformCatmullRom(c.y,f.y,m.y,h.y,p,g,v),$o.initNonuniformCatmullRom(c.z,f.z,m.z,h.z,p,g,v)}else this.curveType==="catmullrom"&&(qo.initCatmullRom(c.x,f.x,m.x,h.x,this.tension),Yo.initCatmullRom(c.y,f.y,m.y,h.y,this.tension),$o.initCatmullRom(c.z,f.z,m.z,h.z,this.tension));return n.set(qo.calc(l),Yo.calc(l),$o.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Lh(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function W0(i,t){const e=1-i;return e*e*t}function X0(i,t){return 2*(1-i)*i*t}function q0(i,t){return i*i*t}function wr(i,t,e,n){return W0(i,t)+X0(i,e)+q0(i,n)}function Y0(i,t){const e=1-i;return e*e*e*t}function $0(i,t){const e=1-i;return 3*e*e*i*t}function Z0(i,t){return 3*(1-i)*i*i*t}function J0(i,t){return i*i*i*t}function Tr(i,t,e,n,s){return Y0(i,t)+$0(i,e)+Z0(i,n)+J0(i,s)}class bf extends hi{constructor(t=new ct,e=new ct,n=new ct,s=new ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ct){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Tr(t,s.x,r.x,a.x,o.x),Tr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class K0 extends hi{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Tr(t,s.x,r.x,a.x,o.x),Tr(t,s.y,r.y,a.y,o.y),Tr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wf extends hi{constructor(t=new ct,e=new ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ct){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ct){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nc extends hi{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tf extends hi{constructor(t=new ct,e=new ct,n=new ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ct){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(wr(t,s.x,r.x,a.x),wr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ef extends hi{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(wr(t,s.x,r.x,a.x),wr(t,s.y,r.y,a.y),wr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Af extends hi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ct){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Lh(o,l.x,c.x,h.x,f.x),Lh(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ct().fromArray(s))}return this}}var Ya=Object.freeze({__proto__:null,ArcCurve:G0,CatmullRomCurve3:os,CubicBezierCurve:bf,CubicBezierCurve3:K0,EllipseCurve:Ur,LineCurve:wf,LineCurve3:nc,QuadraticBezierCurve:Tf,QuadraticBezierCurve3:Ef,SplineCurve:Af});class j0 extends hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ya[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ya[s.type]().fromJSON(s))}return this}}class $a extends j0{constructor(t){super(),this.type="Path",this.currentPoint=new ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new wf(this.currentPoint.clone(),new ct(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Tf(this.currentPoint.clone(),new ct(t,e),new ct(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new bf(this.currentPoint.clone(),new ct(t,e),new ct(n,s),new ct(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Af(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Ur(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class wi extends $a{constructor(t){super(t),this.uuid=si(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new $a().fromJSON(s))}return this}}function Q0(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Rf(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=sp(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,f=-1/0;for(let m=e;m<s;m+=e){const u=i[m],p=i[m+1];u<o&&(o=u),p<l&&(l=p),u>h&&(h=u),p>f&&(f=p)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Nr(r,a,e,o,l,c,0),a}function Rf(i,t,e,n,s){let r;if(s===mp(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Dh(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Dh(a/n|0,i[a],i[a+1],r);return r&&Zs(r,r.next)&&(Or(r),r=r.next),r}function ls(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Zs(e,e.next)||Pe(e.prev,e,e.next)===0)){if(Or(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Nr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&cp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?ep(i,n,s,r):tp(i)){t.push(l.i,i.i,c.i),Or(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=np(ls(i),t),Nr(i,t,e,n,s,r,2)):a===2&&ip(i,t,e,n,s,r):Nr(ls(i),t,e,n,s,r,1);break}}}function tp(i){const t=i.prev,e=i,n=i.next;if(Pe(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),m=Math.max(s,r,a),u=Math.max(o,l,c);let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=m&&p.y>=f&&p.y<=u&&gr(s,o,r,l,a,c,p.x,p.y)&&Pe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function ep(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Pe(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,m=a.y,u=Math.min(o,l,c),p=Math.min(h,f,m),g=Math.max(o,l,c),v=Math.max(h,f,m),d=ic(u,p,t,e,n),x=ic(g,v,t,e,n);let _=i.prevZ,y=i.nextZ;for(;_&&_.z>=d&&y&&y.z<=x;){if(_.x>=u&&_.x<=g&&_.y>=p&&_.y<=v&&_!==s&&_!==a&&gr(o,h,l,f,c,m,_.x,_.y)&&Pe(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=u&&y.x<=g&&y.y>=p&&y.y<=v&&y!==s&&y!==a&&gr(o,h,l,f,c,m,y.x,y.y)&&Pe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=d;){if(_.x>=u&&_.x<=g&&_.y>=p&&_.y<=v&&_!==s&&_!==a&&gr(o,h,l,f,c,m,_.x,_.y)&&Pe(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=u&&y.x<=g&&y.y>=p&&y.y<=v&&y!==s&&y!==a&&gr(o,h,l,f,c,m,y.x,y.y)&&Pe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function np(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Zs(n,s)&&Pf(n,e,e.next,s)&&Fr(n,s)&&Fr(s,n)&&(t.push(n.i,e.i,s.i),Or(e),Or(e.next),e=i=s),e=e.next}while(e!==i);return ls(e)}function ip(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&fp(a,o)){let l=If(a,o);a=ls(a,a.next),l=ls(l,l.next),Nr(a,t,e,n,s,r,0),Nr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function sp(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Rf(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(up(c))}s.sort(rp);for(let r=0;r<s.length;r++)e=ap(s[r],e);return e}function rp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function ap(i,t){const e=op(i,t);if(!e)return t;const n=If(e,i);return ls(n,n.next),ls(e,e.next)}function op(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(Zs(i,e))return e;do{if(Zs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Cf(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);Fr(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&lp(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function lp(i,t){return Pe(i.prev,i,t.prev)<0&&Pe(t.next,i,i.next)<0}function cp(i,t,e,n){let s=i;do s.z===0&&(s.z=ic(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,hp(s)}function hp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function ic(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function up(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Cf(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function gr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Cf(i,t,e,n,s,r,a,o)}function fp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!dp(i,t)&&(Fr(i,t)&&Fr(t,i)&&pp(i,t)&&(Pe(i.prev,i,t.prev)||Pe(i,t.prev,t))||Zs(i,t)&&Pe(i.prev,i,i.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Zs(i,t){return i.x===t.x&&i.y===t.y}function Pf(i,t,e,n){const s=xa(Pe(i,t,e)),r=xa(Pe(i,t,n)),a=xa(Pe(e,n,i)),o=xa(Pe(e,n,t));return!!(s!==r&&a!==o||s===0&&va(i,e,t)||r===0&&va(i,n,t)||a===0&&va(e,i,n)||o===0&&va(e,t,n))}function va(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function xa(i){return i>0?1:i<0?-1:0}function dp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Pf(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Fr(i,t){return Pe(i.prev,i,i.next)<0?Pe(i,t,i.next)>=0&&Pe(i,i.prev,t)>=0:Pe(i,t,i.prev)<0||Pe(i,i.next,t)<0}function pp(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function If(i,t){const e=sc(i.i,i.x,i.y),n=sc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Dh(i,t,e,n){const s=sc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Or(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function sc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function mp(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class gp{static triangulate(t,e,n=2){return Q0(t,e,n)}}class Mi{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Mi.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Uh(t),Nh(n,t);let a=t.length;e.forEach(Uh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Nh(n,e[l]);const o=gp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Uh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Nh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class lo extends Ie{constructor(t=new wi([new ct(.5,.5),new ct(-.5,.5),new ct(-.5,-.5),new ct(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new oe(s,3)),this.setAttribute("uv",new oe(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let m=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:u-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,v=e.bevelSegments!==void 0?e.bevelSegments:3;const d=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:vp;let _,y=!1,w,b,A,T;d&&(_=d.getSpacedPoints(h),y=!0,m=!1,w=d.computeFrenetFrames(h,!1),b=new U,A=new U,T=new U),m||(v=0,u=0,p=0,g=0);const S=o.extractPoints(c);let M=S.shape;const R=S.holes;if(!Mi.isClockWise(M)){M=M.reverse();for(let rt=0,nt=R.length;rt<nt;rt++){const it=R[rt];Mi.isClockWise(it)&&(R[rt]=it.reverse())}}function P(rt){const it=10000000000000001e-36;let tt=rt[0];for(let dt=1;dt<=rt.length;dt++){const at=dt%rt.length,mt=rt[at],$t=mt.x-tt.x,qt=mt.y-tt.y,I=$t*$t+qt*qt,E=Math.max(Math.abs(mt.x),Math.abs(mt.y),Math.abs(tt.x),Math.abs(tt.y)),H=it*E*E;if(I<=H){rt.splice(at,1),dt--;continue}tt=mt}}P(M),R.forEach(P);const F=R.length,O=M;for(let rt=0;rt<F;rt++){const nt=R[rt];M=M.concat(nt)}function z(rt,nt,it){return nt||console.error("THREE.ExtrudeGeometry: vec does not exist"),rt.clone().addScaledVector(nt,it)}const q=M.length;function V(rt,nt,it){let tt,dt,at;const mt=rt.x-nt.x,$t=rt.y-nt.y,qt=it.x-rt.x,I=it.y-rt.y,E=mt*mt+$t*$t,H=mt*I-$t*qt;if(Math.abs(H)>Number.EPSILON){const X=Math.sqrt(E),Q=Math.sqrt(qt*qt+I*I),Y=nt.x-$t/X,St=nt.y+mt/X,ht=it.x-I/Q,bt=it.y+qt/Q,Tt=((ht-Y)*I-(bt-St)*qt)/(mt*I-$t*qt);tt=Y+mt*Tt-rt.x,dt=St+$t*Tt-rt.y;const ft=tt*tt+dt*dt;if(ft<=2)return new ct(tt,dt);at=Math.sqrt(ft/2)}else{let X=!1;mt>Number.EPSILON?qt>Number.EPSILON&&(X=!0):mt<-Number.EPSILON?qt<-Number.EPSILON&&(X=!0):Math.sign($t)===Math.sign(I)&&(X=!0),X?(tt=-$t,dt=mt,at=Math.sqrt(E)):(tt=mt,dt=$t,at=Math.sqrt(E/2))}return new ct(tt/at,dt/at)}const K=[];for(let rt=0,nt=O.length,it=nt-1,tt=rt+1;rt<nt;rt++,it++,tt++)it===nt&&(it=0),tt===nt&&(tt=0),K[rt]=V(O[rt],O[it],O[tt]);const st=[];let ut,Rt=K.concat();for(let rt=0,nt=F;rt<nt;rt++){const it=R[rt];ut=[];for(let tt=0,dt=it.length,at=dt-1,mt=tt+1;tt<dt;tt++,at++,mt++)at===dt&&(at=0),mt===dt&&(mt=0),ut[tt]=V(it[tt],it[at],it[mt]);st.push(ut),Rt=Rt.concat(ut)}let Dt;if(v===0)Dt=Mi.triangulateShape(O,R);else{const rt=[],nt=[];for(let it=0;it<v;it++){const tt=it/v,dt=u*Math.cos(tt*Math.PI/2),at=p*Math.sin(tt*Math.PI/2)+g;for(let mt=0,$t=O.length;mt<$t;mt++){const qt=z(O[mt],K[mt],at);wt(qt.x,qt.y,-dt),tt===0&&rt.push(qt)}for(let mt=0,$t=F;mt<$t;mt++){const qt=R[mt];ut=st[mt];const I=[];for(let E=0,H=qt.length;E<H;E++){const X=z(qt[E],ut[E],at);wt(X.x,X.y,-dt),tt===0&&I.push(X)}tt===0&&nt.push(I)}}Dt=Mi.triangulateShape(rt,nt)}const zt=Dt.length,Wt=p+g;for(let rt=0;rt<q;rt++){const nt=m?z(M[rt],Rt[rt],Wt):M[rt];y?(A.copy(w.normals[0]).multiplyScalar(nt.x),b.copy(w.binormals[0]).multiplyScalar(nt.y),T.copy(_[0]).add(A).add(b),wt(T.x,T.y,T.z)):wt(nt.x,nt.y,0)}for(let rt=1;rt<=h;rt++)for(let nt=0;nt<q;nt++){const it=m?z(M[nt],Rt[nt],Wt):M[nt];y?(A.copy(w.normals[rt]).multiplyScalar(it.x),b.copy(w.binormals[rt]).multiplyScalar(it.y),T.copy(_[rt]).add(A).add(b),wt(T.x,T.y,T.z)):wt(it.x,it.y,f/h*rt)}for(let rt=v-1;rt>=0;rt--){const nt=rt/v,it=u*Math.cos(nt*Math.PI/2),tt=p*Math.sin(nt*Math.PI/2)+g;for(let dt=0,at=O.length;dt<at;dt++){const mt=z(O[dt],K[dt],tt);wt(mt.x,mt.y,f+it)}for(let dt=0,at=R.length;dt<at;dt++){const mt=R[dt];ut=st[dt];for(let $t=0,qt=mt.length;$t<qt;$t++){const I=z(mt[$t],ut[$t],tt);y?wt(I.x,I.y+_[h-1].y,_[h-1].x+it):wt(I.x,I.y,f+it)}}}j(),et();function j(){const rt=s.length/3;if(m){let nt=0,it=q*nt;for(let tt=0;tt<zt;tt++){const dt=Dt[tt];yt(dt[2]+it,dt[1]+it,dt[0]+it)}nt=h+v*2,it=q*nt;for(let tt=0;tt<zt;tt++){const dt=Dt[tt];yt(dt[0]+it,dt[1]+it,dt[2]+it)}}else{for(let nt=0;nt<zt;nt++){const it=Dt[nt];yt(it[2],it[1],it[0])}for(let nt=0;nt<zt;nt++){const it=Dt[nt];yt(it[0]+q*h,it[1]+q*h,it[2]+q*h)}}n.addGroup(rt,s.length/3-rt,0)}function et(){const rt=s.length/3;let nt=0;vt(O,nt),nt+=O.length;for(let it=0,tt=R.length;it<tt;it++){const dt=R[it];vt(dt,nt),nt+=dt.length}n.addGroup(rt,s.length/3-rt,1)}function vt(rt,nt){let it=rt.length;for(;--it>=0;){const tt=it;let dt=it-1;dt<0&&(dt=rt.length-1);for(let at=0,mt=h+v*2;at<mt;at++){const $t=q*at,qt=q*(at+1),I=nt+tt+$t,E=nt+dt+$t,H=nt+dt+qt,X=nt+tt+qt;Yt(I,E,H,X)}}}function wt(rt,nt,it){l.push(rt),l.push(nt),l.push(it)}function yt(rt,nt,it){Nt(rt),Nt(nt),Nt(it);const tt=s.length/3,dt=x.generateTopUV(n,s,tt-3,tt-2,tt-1);N(dt[0]),N(dt[1]),N(dt[2])}function Yt(rt,nt,it,tt){Nt(rt),Nt(nt),Nt(tt),Nt(nt),Nt(it),Nt(tt);const dt=s.length/3,at=x.generateSideWallUV(n,s,dt-6,dt-3,dt-2,dt-1);N(at[0]),N(at[1]),N(at[3]),N(at[1]),N(at[2]),N(at[3])}function Nt(rt){s.push(l[rt*3+0]),s.push(l[rt*3+1]),s.push(l[rt*3+2])}function N(rt){r.push(rt.x),r.push(rt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return xp(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ya[s.type]().fromJSON(s)),new lo(n,t.options)}}const vp={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ct(r,a),new ct(o,l),new ct(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],f=t[n*3+2],m=t[s*3],u=t[s*3+1],p=t[s*3+2],g=t[r*3],v=t[r*3+1],d=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ct(a,1-l),new ct(c,1-f),new ct(m,1-p),new ct(g,1-d)]:[new ct(o,1-l),new ct(h,1-f),new ct(u,1-p),new ct(v,1-d)]}};function xp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class co extends Oc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new co(t.radius,t.detail)}}class ho extends Ie{constructor(t=[new ct(0,-.5),new ct(.5,0),new ct(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ae(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new U,m=new ct,u=new U,p=new U,g=new U;let v=0,d=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:v=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,u.x=d*1,u.y=-v,u.z=d*0,g.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case t.length-1:l.push(g.x,g.y,g.z);break;default:v=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,u.x=d*1,u.y=-v,u.z=d*0,p.copy(u),u.x+=g.x,u.y+=g.y,u.z+=g.z,u.normalize(),l.push(u.x,u.y,u.z),g.copy(p)}for(let x=0;x<=e;x++){const _=n+x*h*s,y=Math.sin(_),w=Math.cos(_);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*y,f.y=t[b].y,f.z=t[b].x*w,a.push(f.x,f.y,f.z),m.x=x/e,m.y=b/(t.length-1),o.push(m.x,m.y);const A=l[3*b+0]*y,T=l[3*b+1],S=l[3*b+0]*w;c.push(A,T,S)}}for(let x=0;x<e;x++)for(let _=0;_<t.length-1;_++){const y=_+x*t.length,w=y,b=y+t.length,A=y+t.length+1,T=y+1;r.push(w,b,T),r.push(A,T,b)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ho(t.points,t.segments,t.phiStart,t.phiLength)}}class he extends Ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,m=e/l,u=[],p=[],g=[],v=[];for(let d=0;d<h;d++){const x=d*m-a;for(let _=0;_<c;_++){const y=_*f-r;p.push(y,-x,0),g.push(0,0,1),v.push(_/o),v.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const _=x+c*d,y=x+c*(d+1),w=x+1+c*(d+1),b=x+1+c*d;u.push(_,y,b),u.push(y,w,b)}this.setIndex(u),this.setAttribute("position",new oe(p,3)),this.setAttribute("normal",new oe(g,3)),this.setAttribute("uv",new oe(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new he(t.width,t.height,t.widthSegments,t.heightSegments)}}class uo extends Ie{constructor(t=new wi([new ct(0,.5),new ct(-.5,-.5),new ct(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new oe(s,3)),this.setAttribute("normal",new oe(r,3)),this.setAttribute("uv",new oe(a,2));function c(h){const f=s.length/3,m=h.extractPoints(e);let u=m.shape;const p=m.holes;Mi.isClockWise(u)===!1&&(u=u.reverse());for(let v=0,d=p.length;v<d;v++){const x=p[v];Mi.isClockWise(x)===!0&&(p[v]=x.reverse())}const g=Mi.triangulateShape(u,p);for(let v=0,d=p.length;v<d;v++){const x=p[v];u=u.concat(x)}for(let v=0,d=u.length;v<d;v++){const x=u[v];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let v=0,d=g.length;v<d;v++){const x=g[v],_=x[0]+f,y=x[1]+f,w=x[2]+f;n.push(_,y,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return _p(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new uo(n,t.curveSegments)}}function _p(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class ke extends Ie{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new U,m=new U,u=[],p=[],g=[],v=[];for(let d=0;d<=n;d++){const x=[],_=d/n;let y=0;d===0&&a===0?y=.5/e:d===n&&l===Math.PI&&(y=-.5/e);for(let w=0;w<=e;w++){const b=w/e;f.x=-t*Math.cos(s+b*r)*Math.sin(a+_*o),f.y=t*Math.cos(a+_*o),f.z=t*Math.sin(s+b*r)*Math.sin(a+_*o),p.push(f.x,f.y,f.z),m.copy(f).normalize(),g.push(m.x,m.y,m.z),v.push(b+y,1-_),x.push(c++)}h.push(x)}for(let d=0;d<n;d++)for(let x=0;x<e;x++){const _=h[d][x+1],y=h[d][x],w=h[d+1][x],b=h[d+1][x+1];(d!==0||a>0)&&u.push(_,y,b),(d!==n-1||l<Math.PI)&&u.push(y,w,b)}this.setIndex(u),this.setAttribute("position",new oe(p,3)),this.setAttribute("normal",new oe(g,3)),this.setAttribute("uv",new oe(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ke(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Js extends Ie{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new U,f=new U,m=new U;for(let u=0;u<=n;u++)for(let p=0;p<=s;p++){const g=p/s*r,v=u/n*Math.PI*2;f.x=(t+e*Math.cos(v))*Math.cos(g),f.y=(t+e*Math.cos(v))*Math.sin(g),f.z=e*Math.sin(v),o.push(f.x,f.y,f.z),h.x=t*Math.cos(g),h.y=t*Math.sin(g),m.subVectors(f,h).normalize(),l.push(m.x,m.y,m.z),c.push(p/s),c.push(u/n)}for(let u=1;u<=n;u++)for(let p=1;p<=s;p++){const g=(s+1)*u+p-1,v=(s+1)*(u-1)+p-1,d=(s+1)*(u-1)+p,x=(s+1)*u+p;a.push(g,v,x),a.push(v,d,x)}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Js(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ri extends Ie{constructor(t=new Ef(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new U,l=new U,c=new ct;let h=new U;const f=[],m=[],u=[],p=[];g(),this.setIndex(p),this.setAttribute("position",new oe(f,3)),this.setAttribute("normal",new oe(m,3)),this.setAttribute("uv",new oe(u,2));function g(){for(let _=0;_<e;_++)v(_);v(r===!1?e:0),x(),d()}function v(_){h=t.getPointAt(_/e,h);const y=a.normals[_],w=a.binormals[_];for(let b=0;b<=s;b++){const A=b/s*Math.PI*2,T=Math.sin(A),S=-Math.cos(A);l.x=S*y.x+T*w.x,l.y=S*y.y+T*w.y,l.z=S*y.z+T*w.z,l.normalize(),m.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,f.push(o.x,o.y,o.z)}}function d(){for(let _=1;_<=e;_++)for(let y=1;y<=s;y++){const w=(s+1)*(_-1)+(y-1),b=(s+1)*_+(y-1),A=(s+1)*_+y,T=(s+1)*(_-1)+y;p.push(w,b,T),p.push(b,A,T)}}function x(){for(let _=0;_<=e;_++)for(let y=0;y<=s;y++)c.x=_/e,c.y=y/s,u.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ri(new Ya[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class yp extends cn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class It extends bi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oo,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Os extends It{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ct(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ae(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Gt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Gt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Gt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Mp extends bi{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oo,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Sp extends bi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oo,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class bp extends bi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class wp extends bi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Zo={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Tp{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,m=c.length;f<m;f+=2){const u=c[f],p=c[f+1];if(u.global&&(u.lastIndex=0),u.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Ep=new Tp;class kc{constructor(t){this.manager=t!==void 0?t:Ep,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}kc.DEFAULT_MATERIAL_NAME="__DEFAULT";const Is=new WeakMap;class Ap extends kc{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Zo.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let f=Is.get(a);f===void 0&&(f=[],Is.set(a,f)),f.push({onLoad:e,onError:s})}return a}const o=Lr("img");function l(){h(),e&&e(this);const f=Is.get(this)||[];for(let m=0;m<f.length;m++){const u=f[m];u.onLoad&&u.onLoad(this)}Is.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),Zo.remove(`image:${t}`);const m=Is.get(this)||[];for(let u=0;u<m.length;u++){const p=m[u];p.onError&&p.onError(f)}Is.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Zo.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class Lf extends kc{constructor(t){super(t)}load(t,e,n,s){const r=new $e,a=new Ap(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class Bc extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Fh extends Bc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Jo=new ue,Oh=new U,zh=new U;class Df{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ct(512,512),this.mapType=li,this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Nc,this._frameExtents=new ct(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Oh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Oh),zh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(zh),e.updateMatrixWorld(),Jo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jo,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Jo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const kh=new ue,dr=new U,Ko=new U;class Rp extends Df{constructor(){super(new en(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ct(4,2),this._viewportCount=6,this._viewports=[new ye(2,1,1,1),new ye(0,1,1,1),new ye(3,1,1,1),new ye(1,1,1,1),new ye(3,0,1,1),new ye(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),dr.setFromMatrixPosition(t.matrixWorld),n.position.copy(dr),Ko.copy(n.position),Ko.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ko),n.updateMatrixWorld(),s.makeTranslation(-dr.x,-dr.y,-dr.z),kh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kh,n.coordinateSystem,n.reversedDepth)}}class Za extends Bc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Rp}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Hc extends vf{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Cp extends Df{constructor(){super(new Hc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _a extends Bc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new Cp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Pp extends en{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Ip{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const Bh=new ue;class Lp{constructor(t,e,n=0,s=1/0){this.ray=new Lc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Dc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Bh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bh),this}intersectObject(t,e=!0,n=[]){return rc(t,this,n,e),n.sort(Hh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)rc(t[s],this,n,e);return n.sort(Hh),n}}function Hh(i,t){return i.distance-t.distance}function rc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)rc(r[a],t,e,!0)}}function Vh(i,t,e,n){const s=Dp(n);switch(e){case of:return i*t;case ao:return i*t/s.components*s.byteLength;case Ac:return i*t/s.components*s.byteLength;case cf:return i*t*2/s.components*s.byteLength;case Rc:return i*t*2/s.components*s.byteLength;case lf:return i*t*3/s.components*s.byteLength;case Yn:return i*t*4/s.components*s.byteLength;case Cc:return i*t*4/s.components*s.byteLength;case Fa:case Oa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case za:case ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Tl:case Al:return Math.max(i,16)*Math.max(t,8)/4;case wl:case El:return Math.max(i,8)*Math.max(t,8)/2;case Rl:case Cl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Pl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Il:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ll:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Dl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Nl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ol:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case zl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case kl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Hl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Vl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Gl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Wl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Xl:case ql:case Yl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case $l:case Zl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Jl:case Kl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Dp(i){switch(i){case li:case nf:return{byteLength:1,components:1};case Cr:case sf:case ci:return{byteLength:2,components:1};case Tc:case Ec:return{byteLength:2,components:4};case as:case wc:case qn:return{byteLength:4,components:1};case rf:case af:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Uf(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Up(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,m=i.createBuffer();i.bindBuffer(l,m),i.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=i.SHORT;else if(c instanceof Uint32Array)u=i.UNSIGNED_INT;else if(c instanceof Int32Array)u=i.INT;else if(c instanceof Int8Array)u=i.BYTE;else if(c instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((u,p)=>u.start-p.start);let m=0;for(let u=1;u<f.length;u++){const p=f[m],g=f[u];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++m,f[m]=g)}f.length=m+1;for(let u=0,p=f.length;u<p;u++){const g=f[u];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Np=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fp=`#ifdef USE_ALPHAHASH
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
#endif`,Op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hp=`#ifdef USE_AOMAP
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
#endif`,Vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Gp=`#ifdef USE_BATCHING
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
#endif`,Wp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Xp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,$p=`#ifdef USE_IRIDESCENCE
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
#endif`,Zp=`#ifdef USE_BUMPMAP
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
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,nm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,im=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sm=`#define PI 3.141592653589793
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
} // validated`,rm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,am=`vec3 transformedNormal = objectNormal;
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
#endif`,om=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,cm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,um="gl_FragColor = linearToOutputTexel( gl_FragColor );",fm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,dm=`#ifdef USE_ENVMAP
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
#endif`,pm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mm=`#ifdef USE_ENVMAP
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
#endif`,gm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vm=`#ifdef USE_ENVMAP
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
#endif`,xm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_m=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ym=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sm=`#ifdef USE_GRADIENTMAP
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
}`,bm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,wm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Em=`uniform bool receiveShadow;
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
#endif`,Am=`#ifdef USE_ENVMAP
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
#endif`,Rm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lm=`PhysicalMaterial material;
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
#endif`,Dm=`struct PhysicalMaterial {
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
}`,Um=`
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
#endif`,Nm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Om=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,km=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wm=`#if defined( USE_POINTS_UV )
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
#endif`,Xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$m=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jm=`#ifdef USE_MORPHTARGETS
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
#endif`,Km=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,t1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,n1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,i1=`#ifdef USE_NORMALMAP
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
#endif`,s1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,r1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,a1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,o1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,l1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,c1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,h1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,u1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,f1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,d1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,p1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,m1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,g1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,v1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,x1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,_1=`float getShadowMask() {
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
}`,y1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,M1=`#ifdef USE_SKINNING
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
#endif`,S1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,b1=`#ifdef USE_SKINNING
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
#endif`,w1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,T1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,E1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,A1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,R1=`#ifdef USE_TRANSMISSION
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
#endif`,C1=`#ifdef USE_TRANSMISSION
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
#endif`,P1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,L1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const U1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,N1=`uniform sampler2D t2D;
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
}`,F1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,z1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,k1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B1=`#include <common>
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
}`,H1=`#if DEPTH_PACKING == 3200
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
}`,V1=`#define DISTANCE
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
}`,G1=`#define DISTANCE
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
}`,W1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,X1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q1=`uniform float scale;
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
}`,Y1=`uniform vec3 diffuse;
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
}`,$1=`#include <common>
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
}`,Z1=`uniform vec3 diffuse;
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
}`,J1=`#define LAMBERT
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
}`,K1=`#define LAMBERT
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
}`,j1=`#define MATCAP
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
}`,Q1=`#define MATCAP
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
}`,tg=`#define NORMAL
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
}`,eg=`#define NORMAL
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
}`,ng=`#define PHONG
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
}`,ig=`#define PHONG
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
}`,sg=`#define STANDARD
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
}`,rg=`#define STANDARD
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
}`,ag=`#define TOON
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
}`,og=`#define TOON
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
}`,lg=`uniform float size;
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
}`,cg=`uniform vec3 diffuse;
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
}`,hg=`#include <common>
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
}`,ug=`uniform vec3 color;
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
}`,fg=`uniform float rotation;
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
}`,dg=`uniform vec3 diffuse;
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
}`,re={alphahash_fragment:Np,alphahash_pars_fragment:Fp,alphamap_fragment:Op,alphamap_pars_fragment:zp,alphatest_fragment:kp,alphatest_pars_fragment:Bp,aomap_fragment:Hp,aomap_pars_fragment:Vp,batching_pars_vertex:Gp,batching_vertex:Wp,begin_vertex:Xp,beginnormal_vertex:qp,bsdfs:Yp,iridescence_fragment:$p,bumpmap_pars_fragment:Zp,clipping_planes_fragment:Jp,clipping_planes_pars_fragment:Kp,clipping_planes_pars_vertex:jp,clipping_planes_vertex:Qp,color_fragment:tm,color_pars_fragment:em,color_pars_vertex:nm,color_vertex:im,common:sm,cube_uv_reflection_fragment:rm,defaultnormal_vertex:am,displacementmap_pars_vertex:om,displacementmap_vertex:lm,emissivemap_fragment:cm,emissivemap_pars_fragment:hm,colorspace_fragment:um,colorspace_pars_fragment:fm,envmap_fragment:dm,envmap_common_pars_fragment:pm,envmap_pars_fragment:mm,envmap_pars_vertex:gm,envmap_physical_pars_fragment:Am,envmap_vertex:vm,fog_vertex:xm,fog_pars_vertex:_m,fog_fragment:ym,fog_pars_fragment:Mm,gradientmap_pars_fragment:Sm,lightmap_pars_fragment:bm,lights_lambert_fragment:wm,lights_lambert_pars_fragment:Tm,lights_pars_begin:Em,lights_toon_fragment:Rm,lights_toon_pars_fragment:Cm,lights_phong_fragment:Pm,lights_phong_pars_fragment:Im,lights_physical_fragment:Lm,lights_physical_pars_fragment:Dm,lights_fragment_begin:Um,lights_fragment_maps:Nm,lights_fragment_end:Fm,logdepthbuf_fragment:Om,logdepthbuf_pars_fragment:zm,logdepthbuf_pars_vertex:km,logdepthbuf_vertex:Bm,map_fragment:Hm,map_pars_fragment:Vm,map_particle_fragment:Gm,map_particle_pars_fragment:Wm,metalnessmap_fragment:Xm,metalnessmap_pars_fragment:qm,morphinstance_vertex:Ym,morphcolor_vertex:$m,morphnormal_vertex:Zm,morphtarget_pars_vertex:Jm,morphtarget_vertex:Km,normal_fragment_begin:jm,normal_fragment_maps:Qm,normal_pars_fragment:t1,normal_pars_vertex:e1,normal_vertex:n1,normalmap_pars_fragment:i1,clearcoat_normal_fragment_begin:s1,clearcoat_normal_fragment_maps:r1,clearcoat_pars_fragment:a1,iridescence_pars_fragment:o1,opaque_fragment:l1,packing:c1,premultiplied_alpha_fragment:h1,project_vertex:u1,dithering_fragment:f1,dithering_pars_fragment:d1,roughnessmap_fragment:p1,roughnessmap_pars_fragment:m1,shadowmap_pars_fragment:g1,shadowmap_pars_vertex:v1,shadowmap_vertex:x1,shadowmask_pars_fragment:_1,skinbase_vertex:y1,skinning_pars_vertex:M1,skinning_vertex:S1,skinnormal_vertex:b1,specularmap_fragment:w1,specularmap_pars_fragment:T1,tonemapping_fragment:E1,tonemapping_pars_fragment:A1,transmission_fragment:R1,transmission_pars_fragment:C1,uv_pars_fragment:P1,uv_pars_vertex:I1,uv_vertex:L1,worldpos_vertex:D1,background_vert:U1,background_frag:N1,backgroundCube_vert:F1,backgroundCube_frag:O1,cube_vert:z1,cube_frag:k1,depth_vert:B1,depth_frag:H1,distanceRGBA_vert:V1,distanceRGBA_frag:G1,equirect_vert:W1,equirect_frag:X1,linedashed_vert:q1,linedashed_frag:Y1,meshbasic_vert:$1,meshbasic_frag:Z1,meshlambert_vert:J1,meshlambert_frag:K1,meshmatcap_vert:j1,meshmatcap_frag:Q1,meshnormal_vert:tg,meshnormal_frag:eg,meshphong_vert:ng,meshphong_frag:ig,meshphysical_vert:sg,meshphysical_frag:rg,meshtoon_vert:ag,meshtoon_frag:og,points_vert:lg,points_frag:cg,shadow_vert:hg,shadow_frag:ug,sprite_vert:fg,sprite_frag:dg},Ct={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ne}},envmap:{envMap:{value:null},envMapRotation:{value:new ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ne},normalScale:{value:new ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0},uvTransform:{value:new ne}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}}},jn={basic:{uniforms:on([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.fog]),vertexShader:re.meshbasic_vert,fragmentShader:re.meshbasic_frag},lambert:{uniforms:on([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Gt(0)}}]),vertexShader:re.meshlambert_vert,fragmentShader:re.meshlambert_frag},phong:{uniforms:on([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30}}]),vertexShader:re.meshphong_vert,fragmentShader:re.meshphong_frag},standard:{uniforms:on([Ct.common,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.roughnessmap,Ct.metalnessmap,Ct.fog,Ct.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag},toon:{uniforms:on([Ct.common,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.gradientmap,Ct.fog,Ct.lights,{emissive:{value:new Gt(0)}}]),vertexShader:re.meshtoon_vert,fragmentShader:re.meshtoon_frag},matcap:{uniforms:on([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,{matcap:{value:null}}]),vertexShader:re.meshmatcap_vert,fragmentShader:re.meshmatcap_frag},points:{uniforms:on([Ct.points,Ct.fog]),vertexShader:re.points_vert,fragmentShader:re.points_frag},dashed:{uniforms:on([Ct.common,Ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:re.linedashed_vert,fragmentShader:re.linedashed_frag},depth:{uniforms:on([Ct.common,Ct.displacementmap]),vertexShader:re.depth_vert,fragmentShader:re.depth_frag},normal:{uniforms:on([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,{opacity:{value:1}}]),vertexShader:re.meshnormal_vert,fragmentShader:re.meshnormal_frag},sprite:{uniforms:on([Ct.sprite,Ct.fog]),vertexShader:re.sprite_vert,fragmentShader:re.sprite_frag},background:{uniforms:{uvTransform:{value:new ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:re.background_vert,fragmentShader:re.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ne}},vertexShader:re.backgroundCube_vert,fragmentShader:re.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:re.cube_vert,fragmentShader:re.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:re.equirect_vert,fragmentShader:re.equirect_frag},distanceRGBA:{uniforms:on([Ct.common,Ct.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:re.distanceRGBA_vert,fragmentShader:re.distanceRGBA_frag},shadow:{uniforms:on([Ct.lights,Ct.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:re.shadow_vert,fragmentShader:re.shadow_frag}};jn.physical={uniforms:on([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ne},clearcoatNormalScale:{value:new ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ne},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ne},transmissionSamplerSize:{value:new ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ne},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ne},anisotropyVector:{value:new ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ne}}]),vertexShader:re.meshphysical_vert,fragmentShader:re.meshphysical_frag};const ya={r:0,b:0,g:0},Yi=new Fn,pg=new ue;function mg(i,t,e,n,s,r,a){const o=new Gt(0);let l=r===!0?0:1,c,h,f=null,m=0,u=null;function p(_){let y=_.isScene===!0?_.background:null;return y&&y.isTexture&&(y=(_.backgroundBlurriness>0?e:t).get(y)),y}function g(_){let y=!1;const w=p(_);w===null?d(o,l):w&&w.isColor&&(d(w,1),y=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(_,y){const w=p(y);w&&(w.isCubeTexture||w.mapping===ro)?(h===void 0&&(h=new Vt(new tn(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:$s(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Yi.copy(y.backgroundRotation),Yi.x*=-1,Yi.y*=-1,Yi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Yi.y*=-1,Yi.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(pg.makeRotationFromEuler(Yi)),h.material.toneMapped=de.getTransfer(w.colorSpace)!==ge,(f!==w||m!==w.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,f=w,m=w.version,u=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new Vt(new he(2,2),new cn({name:"BackgroundMaterial",uniforms:$s(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:Oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=de.getTransfer(w.colorSpace)!==ge,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(f!==w||m!==w.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,f=w,m=w.version,u=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function d(_,y){_.getRGB(ya,gf(i)),n.buffers.color.setClear(ya.r,ya.g,ya.b,y,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,y=1){o.set(_),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,d(o,l)},render:g,addToRenderList:v,dispose:x}}function gg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=m(null);let r=s,a=!1;function o(M,R,L,P,F){let O=!1;const z=f(P,L,R);r!==z&&(r=z,c(r.object)),O=u(M,P,L,F),O&&p(M,P,L,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,y(M,R,L,P),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function f(M,R,L){const P=L.wireframe===!0;let F=n[M.id];F===void 0&&(F={},n[M.id]=F);let O=F[R.id];O===void 0&&(O={},F[R.id]=O);let z=O[P];return z===void 0&&(z=m(l()),O[P]=z),z}function m(M){const R=[],L=[],P=[];for(let F=0;F<e;F++)R[F]=0,L[F]=0,P[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:L,attributeDivisors:P,object:M,attributes:{},index:null}}function u(M,R,L,P){const F=r.attributes,O=R.attributes;let z=0;const q=L.getAttributes();for(const V in q)if(q[V].location>=0){const st=F[V];let ut=O[V];if(ut===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(ut=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(ut=M.instanceColor)),st===void 0||st.attribute!==ut||ut&&st.data!==ut.data)return!0;z++}return r.attributesNum!==z||r.index!==P}function p(M,R,L,P){const F={},O=R.attributes;let z=0;const q=L.getAttributes();for(const V in q)if(q[V].location>=0){let st=O[V];st===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(st=M.instanceColor));const ut={};ut.attribute=st,st&&st.data&&(ut.data=st.data),F[V]=ut,z++}r.attributes=F,r.attributesNum=z,r.index=P}function g(){const M=r.newAttributes;for(let R=0,L=M.length;R<L;R++)M[R]=0}function v(M){d(M,0)}function d(M,R){const L=r.newAttributes,P=r.enabledAttributes,F=r.attributeDivisors;L[M]=1,P[M]===0&&(i.enableVertexAttribArray(M),P[M]=1),F[M]!==R&&(i.vertexAttribDivisor(M,R),F[M]=R)}function x(){const M=r.newAttributes,R=r.enabledAttributes;for(let L=0,P=R.length;L<P;L++)R[L]!==M[L]&&(i.disableVertexAttribArray(L),R[L]=0)}function _(M,R,L,P,F,O,z){z===!0?i.vertexAttribIPointer(M,R,L,F,O):i.vertexAttribPointer(M,R,L,P,F,O)}function y(M,R,L,P){g();const F=P.attributes,O=L.getAttributes(),z=R.defaultAttributeValues;for(const q in O){const V=O[q];if(V.location>=0){let K=F[q];if(K===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),K!==void 0){const st=K.normalized,ut=K.itemSize,Rt=t.get(K);if(Rt===void 0)continue;const Dt=Rt.buffer,zt=Rt.type,Wt=Rt.bytesPerElement,j=zt===i.INT||zt===i.UNSIGNED_INT||K.gpuType===wc;if(K.isInterleavedBufferAttribute){const et=K.data,vt=et.stride,wt=K.offset;if(et.isInstancedInterleavedBuffer){for(let yt=0;yt<V.locationSize;yt++)d(V.location+yt,et.meshPerAttribute);M.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let yt=0;yt<V.locationSize;yt++)v(V.location+yt);i.bindBuffer(i.ARRAY_BUFFER,Dt);for(let yt=0;yt<V.locationSize;yt++)_(V.location+yt,ut/V.locationSize,zt,st,vt*Wt,(wt+ut/V.locationSize*yt)*Wt,j)}else{if(K.isInstancedBufferAttribute){for(let et=0;et<V.locationSize;et++)d(V.location+et,K.meshPerAttribute);M.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let et=0;et<V.locationSize;et++)v(V.location+et);i.bindBuffer(i.ARRAY_BUFFER,Dt);for(let et=0;et<V.locationSize;et++)_(V.location+et,ut/V.locationSize,zt,st,ut*Wt,ut/V.locationSize*et*Wt,j)}}else if(z!==void 0){const st=z[q];if(st!==void 0)switch(st.length){case 2:i.vertexAttrib2fv(V.location,st);break;case 3:i.vertexAttrib3fv(V.location,st);break;case 4:i.vertexAttrib4fv(V.location,st);break;default:i.vertexAttrib1fv(V.location,st)}}}}x()}function w(){T();for(const M in n){const R=n[M];for(const L in R){const P=R[L];for(const F in P)h(P[F].object),delete P[F];delete R[L]}delete n[M]}}function b(M){if(n[M.id]===void 0)return;const R=n[M.id];for(const L in R){const P=R[L];for(const F in P)h(P[F].object),delete P[F];delete R[L]}delete n[M.id]}function A(M){for(const R in n){const L=n[R];if(L[M.id]===void 0)continue;const P=L[M.id];for(const F in P)h(P[F].object),delete P[F];delete L[M.id]}}function T(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:g,enableAttribute:v,disableUnusedAttributes:x}}function vg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,f){f!==0&&(i.drawArraysInstanced(n,c,h,f),e.update(h,n,f))}function o(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,f);let u=0;for(let p=0;p<f;p++)u+=h[p];e.update(u,n,1)}function l(c,h,f,m){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<c.length;p++)a(c[p],h[p],m[p]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,m,0,f);let p=0;for(let g=0;g<f;g++)p+=h[g]*m[g];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function xg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Yn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===ci&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==li&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==qn&&!T)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,m=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=p>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:m,maxTextures:u,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:v,maxAttributes:d,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,vertexTextures:w,maxSamples:b}}function _g(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Zi,o=new ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,m){const u=f.length!==0||m||n!==0||s;return s=m,n=f.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,m){e=h(f,m,0)},this.setState=function(f,m,u){const p=f.clippingPlanes,g=f.clipIntersection,v=f.clipShadows,d=i.get(f);if(!s||p===null||p.length===0||r&&!v)r?h(null):c();else{const x=r?0:n,_=x*4;let y=d.clippingState||null;l.value=y,y=h(p,m,_,u);for(let w=0;w!==_;++w)y[w]=e[w];d.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,m,u,p){const g=f!==null?f.length:0;let v=null;if(g!==0){if(v=l.value,p!==!0||v===null){const d=u+g*4,x=m.matrixWorldInverse;o.getNormalMatrix(x),(v===null||v.length<d)&&(v=new Float32Array(d));for(let _=0,y=u;_!==g;++_,y+=4)a.copy(f[_]).applyMatrix4(x,o),a.normal.toArray(v,y),v[y+3]=a.constant}l.value=v,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,v}}function yg(i){let t=new WeakMap;function e(a,o){return o===Ml?a.mapping=Gs:o===Sl&&(a.mapping=Ws),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ml||o===Sl)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new D0(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const zs=4,Gh=[.125,.215,.35,.446,.526,.582],ts=20,jo=new Hc,Wh=new Gt;let Qo=null,tl=0,el=0,nl=!1;const Ji=(1+Math.sqrt(5))/2,Ls=1/Ji,Xh=[new U(-Ji,Ls,0),new U(Ji,Ls,0),new U(-Ls,0,Ji),new U(Ls,0,Ji),new U(0,Ji,-Ls),new U(0,Ji,Ls),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],Mg=new U;class ac{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Mg}=r;Qo=this._renderer.getRenderTarget(),tl=this._renderer.getActiveCubeFace(),el=this._renderer.getActiveMipmapLevel(),nl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$h(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Qo,tl,el),this._renderer.xr.enabled=nl,t.scissorTest=!1,Ma(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Gs||t.mapping===Ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Qo=this._renderer.getRenderTarget(),tl=this._renderer.getActiveCubeFace(),el=this._renderer.getActiveMipmapLevel(),nl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ni,minFilter:ni,generateMipmaps:!1,type:ci,format:Yn,colorSpace:Ys,depthBuffer:!1},s=qh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Sg(r)),this._blurMaterial=bg(r,t,e)}return s}_compileMaterial(t){const e=new Vt(this._lodPlanes[0],t);this._renderer.compile(e,jo)}_sceneToCubeUV(t,e,n,s,r){const l=new en(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,m=f.autoClear,u=f.toneMapping;f.getClearColor(Wh),f.toneMapping=Ni,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));const g=new Ye({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1}),v=new Vt(new tn,g);let d=!1;const x=t.background;x?x.isColor&&(g.color.copy(x),t.background=null,d=!0):(g.color.copy(Wh),d=!0);for(let _=0;_<6;_++){const y=_%3;y===0?(l.up.set(0,c[_],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[_],r.y,r.z)):y===1?(l.up.set(0,0,c[_]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[_],r.z)):(l.up.set(0,c[_],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[_]));const w=this._cubeSize;Ma(s,y*w,_>2?w:0,w,w),f.setRenderTarget(s),d&&f.render(v,l),f.render(t,l)}v.geometry.dispose(),v.material.dispose(),f.toneMapping=u,f.autoClear=m,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Gs||t.mapping===Ws;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$h()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Vt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ma(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,jo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Xh[(s-r-1)%Xh.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new Vt(this._lodPlanes[s],c),m=c.uniforms,u=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*ts-1),g=r/p,v=isFinite(r)?1+Math.floor(h*g):ts;v>ts&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${ts}`);const d=[];let x=0;for(let A=0;A<ts;++A){const T=A/g,S=Math.exp(-T*T/2);d.push(S),A===0?x+=S:A<v&&(x+=2*S)}for(let A=0;A<d.length;A++)d[A]=d[A]/x;m.envMap.value=t.texture,m.samples.value=v,m.weights.value=d,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:_}=this;m.dTheta.value=p,m.mipInt.value=_-n;const y=this._sizeLods[s],w=3*y*(s>_-zs?s-_+zs:0),b=4*(this._cubeSize-y);Ma(e,w,b,3*y,2*y),l.setRenderTarget(e),l.render(f,jo)}}function Sg(i){const t=[],e=[],n=[];let s=i;const r=i-zs+1+Gh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-zs?l=Gh[a-i+zs-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,f=1+c,m=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,p=6,g=3,v=2,d=1,x=new Float32Array(g*p*u),_=new Float32Array(v*p*u),y=new Float32Array(d*p*u);for(let b=0;b<u;b++){const A=b%3*2/3-1,T=b>2?0:-1,S=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(S,g*p*b),_.set(m,v*p*b);const M=[b,b,b,b,b,b];y.set(M,d*p*b)}const w=new Ie;w.setAttribute("position",new Be(x,g)),w.setAttribute("uv",new Be(_,v)),w.setAttribute("faceIndex",new Be(y,d)),t.push(w),s>zs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function qh(i,t,e){const n=new wn(i,t,e);return n.texture.mapping=ro,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ma(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function bg(i,t,e){const n=new Float32Array(ts),s=new U(0,1,0);return new cn({name:"SphericalGaussianBlur",defines:{n:ts,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vc(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Yh(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vc(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function $h(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Vc(){return`

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
	`}function wg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ml||l===Sl,h=l===Gs||l===Ws;if(c||h){let f=t.get(o);const m=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return e===null&&(e=new ac(i)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new ac(i)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Tg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Dr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Eg(i,t,e,n){const s={},r=new WeakMap;function a(f){const m=f.target;m.index!==null&&t.remove(m.index);for(const p in m.attributes)t.remove(m.attributes[p]);m.removeEventListener("dispose",a),delete s[m.id];const u=r.get(m);u&&(t.remove(u),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function o(f,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,e.memory.geometries++),m}function l(f){const m=f.attributes;for(const u in m)t.update(m[u],i.ARRAY_BUFFER)}function c(f){const m=[],u=f.index,p=f.attributes.position;let g=0;if(u!==null){const x=u.array;g=u.version;for(let _=0,y=x.length;_<y;_+=3){const w=x[_+0],b=x[_+1],A=x[_+2];m.push(w,b,b,A,A,w)}}else if(p!==void 0){const x=p.array;g=p.version;for(let _=0,y=x.length/3-1;_<y;_+=3){const w=_+0,b=_+1,A=_+2;m.push(w,b,b,A,A,w)}}else return;const v=new(uf(m)?mf:pf)(m,1);v.version=g;const d=r.get(f);d&&t.remove(d),r.set(f,v)}function h(f){const m=r.get(f);if(m){const u=f.index;u!==null&&m.version<u.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function Ag(i,t,e){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function l(m,u){i.drawElements(n,u,r,m*a),e.update(u,n,1)}function c(m,u,p){p!==0&&(i.drawElementsInstanced(n,u,r,m*a,p),e.update(u,n,p))}function h(m,u,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,m,0,p);let v=0;for(let d=0;d<p;d++)v+=u[d];e.update(v,n,1)}function f(m,u,p,g){if(p===0)return;const v=t.get("WEBGL_multi_draw");if(v===null)for(let d=0;d<m.length;d++)c(m[d]/a,u[d],g[d]);else{v.multiDrawElementsInstancedWEBGL(n,u,0,r,m,0,g,0,p);let d=0;for(let x=0;x<p;x++)d+=u[x]*g[x];e.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Rg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Cg(i,t,e){const n=new WeakMap,s=new ye;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let m=n.get(o);if(m===void 0||m.count!==f){let S=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",S)};m!==void 0&&m.texture.dispose();const u=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,v=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let _=0;u===!0&&(_=1),p===!0&&(_=2),g===!0&&(_=3);let y=o.attributes.position.count*_,w=1;y>t.maxTextureSize&&(w=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const b=new Float32Array(y*w*4*f),A=new ff(b,y,w,f);A.type=qn,A.needsUpdate=!0;const T=_*4;for(let M=0;M<f;M++){const R=v[M],L=d[M],P=x[M],F=y*w*4*M;for(let O=0;O<R.count;O++){const z=O*T;u===!0&&(s.fromBufferAttribute(R,O),b[F+z+0]=s.x,b[F+z+1]=s.y,b[F+z+2]=s.z,b[F+z+3]=0),p===!0&&(s.fromBufferAttribute(L,O),b[F+z+4]=s.x,b[F+z+5]=s.y,b[F+z+6]=s.z,b[F+z+7]=0),g===!0&&(s.fromBufferAttribute(P,O),b[F+z+8]=s.x,b[F+z+9]=s.y,b[F+z+10]=s.z,b[F+z+11]=P.itemSize===4?s.w:1)}}m={count:f,texture:A,size:new ct(y,w)},n.set(o,m),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let u=0;for(let g=0;g<c.length;g++)u+=c[g];const p=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:r}}function Pg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const m=l.skeleton;s.get(m)!==c&&(m.update(),s.set(m,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const Nf=new $e,Zh=new Fc(1,1),Ff=new ff,Of=new v0,zf=new xf,Jh=[],Kh=[],jh=new Float32Array(16),Qh=new Float32Array(9),tu=new Float32Array(4);function tr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Jh[s];if(r===void 0&&(r=new Float32Array(s),Jh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function He(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function fo(i,t){let e=Kh[t];e===void 0&&(e=new Int32Array(t),Kh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ig(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function Dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function Ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function Ng(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;tu.set(n),i.uniformMatrix2fv(this.addr,!1,tu),Ve(e,n)}}function Fg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;Qh.set(n),i.uniformMatrix3fv(this.addr,!1,Qh),Ve(e,n)}}function Og(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;jh.set(n),i.uniformMatrix4fv(this.addr,!1,jh),Ve(e,n)}}function zg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function Bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function Hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function Vg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function Wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function Xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function qg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Zh.compareFunction=hf,r=Zh):r=Nf,e.setTexture2D(t||r,s)}function Yg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Of,s)}function $g(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||zf,s)}function Zg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ff,s)}function Jg(i){switch(i){case 5126:return Ig;case 35664:return Lg;case 35665:return Dg;case 35666:return Ug;case 35674:return Ng;case 35675:return Fg;case 35676:return Og;case 5124:case 35670:return zg;case 35667:case 35671:return kg;case 35668:case 35672:return Bg;case 35669:case 35673:return Hg;case 5125:return Vg;case 36294:return Gg;case 36295:return Wg;case 36296:return Xg;case 35678:case 36198:case 36298:case 36306:case 35682:return qg;case 35679:case 36299:case 36307:return Yg;case 35680:case 36300:case 36308:case 36293:return $g;case 36289:case 36303:case 36311:case 36292:return Zg}}function Kg(i,t){i.uniform1fv(this.addr,t)}function jg(i,t){const e=tr(t,this.size,2);i.uniform2fv(this.addr,e)}function Qg(i,t){const e=tr(t,this.size,3);i.uniform3fv(this.addr,e)}function tv(i,t){const e=tr(t,this.size,4);i.uniform4fv(this.addr,e)}function ev(i,t){const e=tr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function nv(i,t){const e=tr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function iv(i,t){const e=tr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function sv(i,t){i.uniform1iv(this.addr,t)}function rv(i,t){i.uniform2iv(this.addr,t)}function av(i,t){i.uniform3iv(this.addr,t)}function ov(i,t){i.uniform4iv(this.addr,t)}function lv(i,t){i.uniform1uiv(this.addr,t)}function cv(i,t){i.uniform2uiv(this.addr,t)}function hv(i,t){i.uniform3uiv(this.addr,t)}function uv(i,t){i.uniform4uiv(this.addr,t)}function fv(i,t,e){const n=this.cache,s=t.length,r=fo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Nf,r[a])}function dv(i,t,e){const n=this.cache,s=t.length,r=fo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Of,r[a])}function pv(i,t,e){const n=this.cache,s=t.length,r=fo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||zf,r[a])}function mv(i,t,e){const n=this.cache,s=t.length,r=fo(e,s);He(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Ff,r[a])}function gv(i){switch(i){case 5126:return Kg;case 35664:return jg;case 35665:return Qg;case 35666:return tv;case 35674:return ev;case 35675:return nv;case 35676:return iv;case 5124:case 35670:return sv;case 35667:case 35671:return rv;case 35668:case 35672:return av;case 35669:case 35673:return ov;case 5125:return lv;case 36294:return cv;case 36295:return hv;case 36296:return uv;case 35678:case 36198:case 36298:case 36306:case 35682:return fv;case 35679:case 36299:case 36307:return dv;case 35680:case 36300:case 36308:case 36293:return pv;case 36289:case 36303:case 36311:case 36292:return mv}}class vv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Jg(e.type)}}class xv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=gv(e.type)}}class _v{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const il=/(\w+)(\])?(\[|\.)?/g;function eu(i,t){i.seq.push(t),i.map[t.id]=t}function yv(i,t,e){const n=i.name,s=n.length;for(il.lastIndex=0;;){const r=il.exec(n),a=il.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){eu(e,c===void 0?new vv(o,i,t):new xv(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new _v(o),eu(e,f)),e=f}}}class Ba{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);yv(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function nu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Mv=37297;let Sv=0;function bv(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const iu=new ne;function wv(i){de._getMatrix(iu,de.workingColorSpace,i);const t=`mat3( ${iu.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(i)){case Wa:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function su(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+bv(i.getShaderSource(t),o)}else return r}function Tv(i,t){const e=wv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Ev(i,t){let e;switch(t){case Zu:e="Linear";break;case Ju:e="Reinhard";break;case Ku:e="Cineon";break;case bc:e="ACESFilmic";break;case Qu:e="AgX";break;case tf:e="Neutral";break;case ju:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Sa=new U;function Av(){de.getLuminanceCoefficients(Sa);const i=Sa.x.toFixed(4),t=Sa.y.toFixed(4),e=Sa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function Cv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Pv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function vr(i){return i!==""}function ru(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function au(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Iv=/^[ \t]*#include +<([\w\d./]+)>/gm;function oc(i){return i.replace(Iv,Dv)}const Lv=new Map;function Dv(i,t){let e=re[t];if(e===void 0){const n=Lv.get(t);if(n!==void 0)e=re[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return oc(e)}const Uv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ou(i){return i.replace(Uv,Nv)}function Nv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function lu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Fv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Wu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Xu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===xi&&(t="SHADOWMAP_TYPE_VSM"),t}function Ov(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Gs:case Ws:t="ENVMAP_TYPE_CUBE";break;case ro:t="ENVMAP_TYPE_CUBE_UV";break}return t}function zv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ws:t="ENVMAP_MODE_REFRACTION";break}return t}function kv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Sc:t="ENVMAP_BLENDING_MULTIPLY";break;case Nd:t="ENVMAP_BLENDING_MIX";break;case Fd:t="ENVMAP_BLENDING_ADD";break}return t}function Bv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Hv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Fv(e),c=Ov(e),h=zv(e),f=kv(e),m=Bv(e),u=Rv(e),p=Cv(r),g=s.createProgram();let v,d,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(vr).join(`
`),v.length>0&&(v+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(vr).join(`
`),d.length>0&&(d+=`
`)):(v=[lu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),d=[lu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ni?"#define TONE_MAPPING":"",e.toneMapping!==Ni?re.tonemapping_pars_fragment:"",e.toneMapping!==Ni?Ev("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",re.colorspace_pars_fragment,Tv("linearToOutputTexel",e.outputColorSpace),Av(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vr).join(`
`)),a=oc(a),a=ru(a,e),a=au(a,e),o=oc(o),o=ru(o,e),o=au(o,e),a=ou(a),o=ou(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,v=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,d=["#define varying in",e.glslVersion===rh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===rh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const _=x+v+a,y=x+d+o,w=nu(s,s.VERTEX_SHADER,_),b=nu(s,s.FRAGMENT_SHADER,y);s.attachShader(g,w),s.attachShader(g,b),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function A(R){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(g)||"",P=s.getShaderInfoLog(w)||"",F=s.getShaderInfoLog(b)||"",O=L.trim(),z=P.trim(),q=F.trim();let V=!0,K=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,w,b);else{const st=su(s,w,"vertex"),ut=su(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+O+`
`+st+`
`+ut)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(z===""||q==="")&&(K=!1);K&&(R.diagnostics={runnable:V,programLog:O,vertexShader:{log:z,prefix:v},fragmentShader:{log:q,prefix:d}})}s.deleteShader(w),s.deleteShader(b),T=new Ba(s,g),S=Pv(s,g)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(g,Mv)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Sv++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=w,this.fragmentShader=b,this}let Vv=0;class Gv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Wv(t),e.set(t,n)),n}}class Wv{constructor(t){this.id=Vv++,this.code=t,this.usedTimes=0}}function Xv(i,t,e,n,s,r,a){const o=new Dc,l=new Gv,c=new Set,h=[],f=s.logarithmicDepthBuffer,m=s.vertexTextures;let u=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return c.add(S),S===0?"uv":`uv${S}`}function v(S,M,R,L,P){const F=L.fog,O=P.geometry,z=S.isMeshStandardMaterial?L.environment:null,q=(S.isMeshStandardMaterial?e:t).get(S.envMap||z),V=q&&q.mapping===ro?q.image.height:null,K=p[S.type];S.precision!==null&&(u=s.getMaxPrecision(S.precision),u!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",u,"instead."));const st=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ut=st!==void 0?st.length:0;let Rt=0;O.morphAttributes.position!==void 0&&(Rt=1),O.morphAttributes.normal!==void 0&&(Rt=2),O.morphAttributes.color!==void 0&&(Rt=3);let Dt,zt,Wt,j;if(K){const le=jn[K];Dt=le.vertexShader,zt=le.fragmentShader}else Dt=S.vertexShader,zt=S.fragmentShader,l.update(S),Wt=l.getVertexShaderID(S),j=l.getFragmentShaderID(S);const et=i.getRenderTarget(),vt=i.state.buffers.depth.getReversed(),wt=P.isInstancedMesh===!0,yt=P.isBatchedMesh===!0,Yt=!!S.map,Nt=!!S.matcap,N=!!q,rt=!!S.aoMap,nt=!!S.lightMap,it=!!S.bumpMap,tt=!!S.normalMap,dt=!!S.displacementMap,at=!!S.emissiveMap,mt=!!S.metalnessMap,$t=!!S.roughnessMap,qt=S.anisotropy>0,I=S.clearcoat>0,E=S.dispersion>0,H=S.iridescence>0,X=S.sheen>0,Q=S.transmission>0,Y=qt&&!!S.anisotropyMap,St=I&&!!S.clearcoatMap,ht=I&&!!S.clearcoatNormalMap,bt=I&&!!S.clearcoatRoughnessMap,Tt=H&&!!S.iridescenceMap,ft=H&&!!S.iridescenceThicknessMap,Et=X&&!!S.sheenColorMap,Xt=X&&!!S.sheenRoughnessMap,kt=!!S.specularMap,Mt=!!S.specularColorMap,Jt=!!S.specularIntensityMap,B=Q&&!!S.transmissionMap,pt=Q&&!!S.thicknessMap,_t=!!S.gradientMap,Ft=!!S.alphaMap,gt=S.alphaTest>0,ot=!!S.alphaHash,Bt=!!S.extensions;let ee=Ni;S.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(ee=i.toneMapping);const xe={shaderID:K,shaderType:S.type,shaderName:S.name,vertexShader:Dt,fragmentShader:zt,defines:S.defines,customVertexShaderID:Wt,customFragmentShaderID:j,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:u,batching:yt,batchingColor:yt&&P._colorsTexture!==null,instancing:wt,instancingColor:wt&&P.instanceColor!==null,instancingMorph:wt&&P.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Ys,alphaToCoverage:!!S.alphaToCoverage,map:Yt,matcap:Nt,envMap:N,envMapMode:N&&q.mapping,envMapCubeUVHeight:V,aoMap:rt,lightMap:nt,bumpMap:it,normalMap:tt,displacementMap:m&&dt,emissiveMap:at,normalMapObjectSpace:tt&&S.normalMapType===Bd,normalMapTangentSpace:tt&&S.normalMapType===oo,metalnessMap:mt,roughnessMap:$t,anisotropy:qt,anisotropyMap:Y,clearcoat:I,clearcoatMap:St,clearcoatNormalMap:ht,clearcoatRoughnessMap:bt,dispersion:E,iridescence:H,iridescenceMap:Tt,iridescenceThicknessMap:ft,sheen:X,sheenColorMap:Et,sheenRoughnessMap:Xt,specularMap:kt,specularColorMap:Mt,specularIntensityMap:Jt,transmission:Q,transmissionMap:B,thicknessMap:pt,gradientMap:_t,opaque:S.transparent===!1&&S.blending===ks&&S.alphaToCoverage===!1,alphaMap:Ft,alphaTest:gt,alphaHash:ot,combine:S.combine,mapUv:Yt&&g(S.map.channel),aoMapUv:rt&&g(S.aoMap.channel),lightMapUv:nt&&g(S.lightMap.channel),bumpMapUv:it&&g(S.bumpMap.channel),normalMapUv:tt&&g(S.normalMap.channel),displacementMapUv:dt&&g(S.displacementMap.channel),emissiveMapUv:at&&g(S.emissiveMap.channel),metalnessMapUv:mt&&g(S.metalnessMap.channel),roughnessMapUv:$t&&g(S.roughnessMap.channel),anisotropyMapUv:Y&&g(S.anisotropyMap.channel),clearcoatMapUv:St&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:ht&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:bt&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Tt&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:ft&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Xt&&g(S.sheenRoughnessMap.channel),specularMapUv:kt&&g(S.specularMap.channel),specularColorMapUv:Mt&&g(S.specularColorMap.channel),specularIntensityMapUv:Jt&&g(S.specularIntensityMap.channel),transmissionMapUv:B&&g(S.transmissionMap.channel),thicknessMapUv:pt&&g(S.thicknessMap.channel),alphaMapUv:Ft&&g(S.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(tt||qt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!O.attributes.uv&&(Yt||Ft),fog:!!F,useFog:S.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:vt,skinning:P.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:Rt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,decodeVideoTexture:Yt&&S.map.isVideoTexture===!0&&de.getTransfer(S.map.colorSpace)===ge,decodeVideoTextureEmissive:at&&S.emissiveMap.isVideoTexture===!0&&de.getTransfer(S.emissiveMap.colorSpace)===ge,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Oe,flipSided:S.side===nn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Bt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&S.extensions.multiDraw===!0||yt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return xe.vertexUv1s=c.has(1),xe.vertexUv2s=c.has(2),xe.vertexUv3s=c.has(3),c.clear(),xe}function d(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)M.push(R),M.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(x(M,S),_(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function x(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function _(S,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),S.push(o.mask)}function y(S){const M=p[S.type];let R;if(M){const L=jn[M];R=ss.clone(L.uniforms)}else R=S.uniforms;return R}function w(S,M){let R;for(let L=0,P=h.length;L<P;L++){const F=h[L];if(F.cacheKey===M){R=F,++R.usedTimes;break}}return R===void 0&&(R=new Hv(i,M,S,r),h.push(R)),R}function b(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function T(){l.dispose()}return{getParameters:v,getProgramCacheKey:d,getUniforms:y,acquireProgram:w,releaseProgram:b,releaseShaderCache:A,programs:h,dispose:T}}function qv(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Yv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function cu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function hu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,m,u,p,g,v){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:m,material:u,groupOrder:p,renderOrder:f.renderOrder,z:g,group:v},i[t]=d):(d.id=f.id,d.object=f,d.geometry=m,d.material=u,d.groupOrder=p,d.renderOrder=f.renderOrder,d.z=g,d.group=v),t++,d}function o(f,m,u,p,g,v){const d=a(f,m,u,p,g,v);u.transmission>0?n.push(d):u.transparent===!0?s.push(d):e.push(d)}function l(f,m,u,p,g,v){const d=a(f,m,u,p,g,v);u.transmission>0?n.unshift(d):u.transparent===!0?s.unshift(d):e.unshift(d)}function c(f,m){e.length>1&&e.sort(f||Yv),n.length>1&&n.sort(m||cu),s.length>1&&s.sort(m||cu)}function h(){for(let f=t,m=i.length;f<m;f++){const u=i[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function $v(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new hu,i.set(n,[a])):s>=r.length?(a=new hu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Zv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new Gt};break;case"SpotLight":e={position:new U,direction:new U,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function Jv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Kv=0;function jv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Qv(i){const t=new Zv,e=Jv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);const s=new U,r=new ue,a=new ue;function o(c){let h=0,f=0,m=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let u=0,p=0,g=0,v=0,d=0,x=0,_=0,y=0,w=0,b=0,A=0;c.sort(jv);for(let S=0,M=c.length;S<M;S++){const R=c[S],L=R.color,P=R.intensity,F=R.distance,O=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=L.r*P,f+=L.g*P,m+=L.b*P;else if(R.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(R.sh.coefficients[z],P);A++}else if(R.isDirectionalLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const q=R.shadow,V=e.get(R);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,n.directionalShadow[u]=V,n.directionalShadowMap[u]=O,n.directionalShadowMatrix[u]=R.shadow.matrix,x++}n.directional[u]=z,u++}else if(R.isSpotLight){const z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(L).multiplyScalar(P),z.distance=F,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,n.spot[g]=z;const q=R.shadow;if(R.map&&(n.spotLightMap[w]=R.map,w++,q.updateMatrices(R),R.castShadow&&b++),n.spotLightMatrix[g]=q.matrix,R.castShadow){const V=e.get(R);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=O,y++}g++}else if(R.isRectAreaLight){const z=t.get(R);z.color.copy(L).multiplyScalar(P),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),n.rectArea[v]=z,v++}else if(R.isPointLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const q=R.shadow,V=e.get(R);V.shadowIntensity=q.intensity,V.shadowBias=q.bias,V.shadowNormalBias=q.normalBias,V.shadowRadius=q.radius,V.shadowMapSize=q.mapSize,V.shadowCameraNear=q.camera.near,V.shadowCameraFar=q.camera.far,n.pointShadow[p]=V,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=R.shadow.matrix,_++}n.point[p]=z,p++}else if(R.isHemisphereLight){const z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(P),z.groundColor.copy(R.groundColor).multiplyScalar(P),n.hemi[d]=z,d++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ct.LTC_FLOAT_1,n.rectAreaLTC2=Ct.LTC_FLOAT_2):(n.rectAreaLTC1=Ct.LTC_HALF_1,n.rectAreaLTC2=Ct.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=m;const T=n.hash;(T.directionalLength!==u||T.pointLength!==p||T.spotLength!==g||T.rectAreaLength!==v||T.hemiLength!==d||T.numDirectionalShadows!==x||T.numPointShadows!==_||T.numSpotShadows!==y||T.numSpotMaps!==w||T.numLightProbes!==A)&&(n.directional.length=u,n.spot.length=g,n.rectArea.length=v,n.point.length=p,n.hemi.length=d,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=y+w-b,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=A,T.directionalLength=u,T.pointLength=p,T.spotLength=g,T.rectAreaLength=v,T.hemiLength=d,T.numDirectionalShadows=x,T.numPointShadows=_,T.numSpotShadows=y,T.numSpotMaps=w,T.numLightProbes=A,n.version=Kv++)}function l(c,h){let f=0,m=0,u=0,p=0,g=0;const v=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const _=c[d];if(_.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(v),f++}else if(_.isSpotLight){const y=n.spot[u];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(v),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(v),u++}else if(_.isRectAreaLight){const y=n.rectArea[p];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(v),a.identity(),r.copy(_.matrixWorld),r.premultiply(v),a.extractRotation(r),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),p++}else if(_.isPointLight){const y=n.point[m];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(v),m++}else if(_.isHemisphereLight){const y=n.hemi[g];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(v),g++}}}return{setup:o,setupView:l,state:n}}function uu(i){const t=new Qv(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function tx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new uu(i),t.set(s,[o])):r>=a.length?(o=new uu(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const ex=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nx=`uniform sampler2D shadow_pass;
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
}`;function ix(i,t,e){let n=new Nc;const s=new ct,r=new ct,a=new ye,o=new bp({depthPacking:kd}),l=new wp,c={},h=e.maxTextureSize,f={[Oi]:nn,[nn]:Oi,[Oe]:Oe},m=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ct},radius:{value:4}},vertexShader:ex,fragmentShader:nx}),u=m.clone();u.defines.HORIZONTAL_PASS=1;const p=new Ie;p.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Vt(p,m),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wu;let d=this.type;this.render=function(b,A,T){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||b.length===0)return;const S=i.getRenderTarget(),M=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),L=i.state;L.setBlending(ln),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const P=d!==xi&&this.type===xi,F=d===xi&&this.type!==xi;for(let O=0,z=b.length;O<z;O++){const q=b[O],V=q.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const K=V.getFrameExtents();if(s.multiply(K),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,V.mapSize.y=r.y)),V.map===null||P===!0||F===!0){const ut=this.type!==xi?{minFilter:hn,magFilter:hn}:{};V.map!==null&&V.map.dispose(),V.map=new wn(s.x,s.y,ut),V.map.texture.name=q.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const st=V.getViewportCount();for(let ut=0;ut<st;ut++){const Rt=V.getViewport(ut);a.set(r.x*Rt.x,r.y*Rt.y,r.x*Rt.z,r.y*Rt.w),L.viewport(a),V.updateMatrices(q,ut),n=V.getFrustum(),y(A,T,V.camera,q,this.type)}V.isPointLightShadow!==!0&&this.type===xi&&x(V,T),V.needsUpdate=!1}d=this.type,v.needsUpdate=!1,i.setRenderTarget(S,M,R)};function x(b,A){const T=t.update(g);m.defines.VSM_SAMPLES!==b.blurSamples&&(m.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,m.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new wn(s.x,s.y)),m.uniforms.shadow_pass.value=b.map.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(A,null,T,m,g,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(A,null,T,u,g,null)}function _(b,A,T,S){let M=null;const R=T.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)M=R;else if(M=T.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const L=M.uuid,P=A.uuid;let F=c[L];F===void 0&&(F={},c[L]=F);let O=F[P];O===void 0&&(O=M.clone(),F[P]=O,A.addEventListener("dispose",w)),M=O}if(M.visible=A.visible,M.wireframe=A.wireframe,S===xi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:f[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const L=i.properties.get(M);L.light=T}return M}function y(b,A,T,S,M){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===xi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,b.matrixWorld);const P=t.update(b),F=b.material;if(Array.isArray(F)){const O=P.groups;for(let z=0,q=O.length;z<q;z++){const V=O[z],K=F[V.materialIndex];if(K&&K.visible){const st=_(b,K,S,M);b.onBeforeShadow(i,b,A,T,P,st,V),i.renderBufferDirect(T,null,P,st,b,V),b.onAfterShadow(i,b,A,T,P,st,V)}}}else if(F.visible){const O=_(b,F,S,M);b.onBeforeShadow(i,b,A,T,P,O,null),i.renderBufferDirect(T,null,P,O,b,null),b.onAfterShadow(i,b,A,T,P,O,null)}}const L=b.children;for(let P=0,F=L.length;P<F;P++)y(L[P],A,T,S,M)}function w(b){b.target.removeEventListener("dispose",w);for(const T in c){const S=c[T],M=b.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const sx={[pl]:ml,[gl]:_l,[vl]:yl,[Vs]:xl,[ml]:pl,[_l]:gl,[yl]:vl,[xl]:Vs};function rx(i,t){function e(){let B=!1;const pt=new ye;let _t=null;const Ft=new ye(0,0,0,0);return{setMask:function(gt){_t!==gt&&!B&&(i.colorMask(gt,gt,gt,gt),_t=gt)},setLocked:function(gt){B=gt},setClear:function(gt,ot,Bt,ee,xe){xe===!0&&(gt*=ee,ot*=ee,Bt*=ee),pt.set(gt,ot,Bt,ee),Ft.equals(pt)===!1&&(i.clearColor(gt,ot,Bt,ee),Ft.copy(pt))},reset:function(){B=!1,_t=null,Ft.set(-1,0,0,0)}}}function n(){let B=!1,pt=!1,_t=null,Ft=null,gt=null;return{setReversed:function(ot){if(pt!==ot){const Bt=t.get("EXT_clip_control");ot?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT),pt=ot;const ee=gt;gt=null,this.setClear(ee)}},getReversed:function(){return pt},setTest:function(ot){ot?et(i.DEPTH_TEST):vt(i.DEPTH_TEST)},setMask:function(ot){_t!==ot&&!B&&(i.depthMask(ot),_t=ot)},setFunc:function(ot){if(pt&&(ot=sx[ot]),Ft!==ot){switch(ot){case pl:i.depthFunc(i.NEVER);break;case ml:i.depthFunc(i.ALWAYS);break;case gl:i.depthFunc(i.LESS);break;case Vs:i.depthFunc(i.LEQUAL);break;case vl:i.depthFunc(i.EQUAL);break;case xl:i.depthFunc(i.GEQUAL);break;case _l:i.depthFunc(i.GREATER);break;case yl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ft=ot}},setLocked:function(ot){B=ot},setClear:function(ot){gt!==ot&&(pt&&(ot=1-ot),i.clearDepth(ot),gt=ot)},reset:function(){B=!1,_t=null,Ft=null,gt=null,pt=!1}}}function s(){let B=!1,pt=null,_t=null,Ft=null,gt=null,ot=null,Bt=null,ee=null,xe=null;return{setTest:function(le){B||(le?et(i.STENCIL_TEST):vt(i.STENCIL_TEST))},setMask:function(le){pt!==le&&!B&&(i.stencilMask(le),pt=le)},setFunc:function(le,Je,gn){(_t!==le||Ft!==Je||gt!==gn)&&(i.stencilFunc(le,Je,gn),_t=le,Ft=Je,gt=gn)},setOp:function(le,Je,gn){(ot!==le||Bt!==Je||ee!==gn)&&(i.stencilOp(le,Je,gn),ot=le,Bt=Je,ee=gn)},setLocked:function(le){B=le},setClear:function(le){xe!==le&&(i.clearStencil(le),xe=le)},reset:function(){B=!1,pt=null,_t=null,Ft=null,gt=null,ot=null,Bt=null,ee=null,xe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},m=new WeakMap,u=[],p=null,g=!1,v=null,d=null,x=null,_=null,y=null,w=null,b=null,A=new Gt(0,0,0),T=0,S=!1,M=null,R=null,L=null,P=null,F=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,q=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(V)[1]),z=q>=1):V.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),z=q>=2);let K=null,st={};const ut=i.getParameter(i.SCISSOR_BOX),Rt=i.getParameter(i.VIEWPORT),Dt=new ye().fromArray(ut),zt=new ye().fromArray(Rt);function Wt(B,pt,_t,Ft){const gt=new Uint8Array(4),ot=i.createTexture();i.bindTexture(B,ot),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<_t;Bt++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,Ft,0,i.RGBA,i.UNSIGNED_BYTE,gt):i.texImage2D(pt+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,gt);return ot}const j={};j[i.TEXTURE_2D]=Wt(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=Wt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=Wt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=Wt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(Vs),it(!1),tt(eh),et(i.CULL_FACE),rt(ln);function et(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function vt(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function wt(B,pt){return f[B]!==pt?(i.bindFramebuffer(B,pt),f[B]=pt,B===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=pt),B===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function yt(B,pt){let _t=u,Ft=!1;if(B){_t=m.get(pt),_t===void 0&&(_t=[],m.set(pt,_t));const gt=B.textures;if(_t.length!==gt.length||_t[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,Bt=gt.length;ot<Bt;ot++)_t[ot]=i.COLOR_ATTACHMENT0+ot;_t.length=gt.length,Ft=!0}}else _t[0]!==i.BACK&&(_t[0]=i.BACK,Ft=!0);Ft&&i.drawBuffers(_t)}function Yt(B){return p!==B?(i.useProgram(B),p=B,!0):!1}const Nt={[yi]:i.FUNC_ADD,[Md]:i.FUNC_SUBTRACT,[Sd]:i.FUNC_REVERSE_SUBTRACT};Nt[bd]=i.MIN,Nt[wd]=i.MAX;const N={[ul]:i.ZERO,[Td]:i.ONE,[Ed]:i.SRC_COLOR,[fl]:i.SRC_ALPHA,[Pd]:i.SRC_ALPHA_SATURATE,[$u]:i.DST_COLOR,[Yu]:i.DST_ALPHA,[Ad]:i.ONE_MINUS_SRC_COLOR,[dl]:i.ONE_MINUS_SRC_ALPHA,[Cd]:i.ONE_MINUS_DST_COLOR,[Rd]:i.ONE_MINUS_DST_ALPHA,[Id]:i.CONSTANT_COLOR,[Ld]:i.ONE_MINUS_CONSTANT_COLOR,[Dd]:i.CONSTANT_ALPHA,[Ud]:i.ONE_MINUS_CONSTANT_ALPHA};function rt(B,pt,_t,Ft,gt,ot,Bt,ee,xe,le){if(B===ln){g===!0&&(vt(i.BLEND),g=!1);return}if(g===!1&&(et(i.BLEND),g=!0),B!==qu){if(B!==v||le!==S){if((d!==yi||y!==yi)&&(i.blendEquation(i.FUNC_ADD),d=yi,y=yi),le)switch(B){case ks:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rr:i.blendFunc(i.ONE,i.ONE);break;case nh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ih:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case ks:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ih:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}x=null,_=null,w=null,b=null,A.set(0,0,0),T=0,v=B,S=le}return}gt=gt||pt,ot=ot||_t,Bt=Bt||Ft,(pt!==d||gt!==y)&&(i.blendEquationSeparate(Nt[pt],Nt[gt]),d=pt,y=gt),(_t!==x||Ft!==_||ot!==w||Bt!==b)&&(i.blendFuncSeparate(N[_t],N[Ft],N[ot],N[Bt]),x=_t,_=Ft,w=ot,b=Bt),(ee.equals(A)===!1||xe!==T)&&(i.blendColor(ee.r,ee.g,ee.b,xe),A.copy(ee),T=xe),v=B,S=!1}function nt(B,pt){B.side===Oe?vt(i.CULL_FACE):et(i.CULL_FACE);let _t=B.side===nn;pt&&(_t=!_t),it(_t),B.blending===ks&&B.transparent===!1?rt(ln):rt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);const Ft=B.stencilWrite;o.setTest(Ft),Ft&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),at(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):vt(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(B){M!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),M=B)}function tt(B){B!==_d?(et(i.CULL_FACE),B!==R&&(B===eh?i.cullFace(i.BACK):B===yd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):vt(i.CULL_FACE),R=B}function dt(B){B!==L&&(z&&i.lineWidth(B),L=B)}function at(B,pt,_t){B?(et(i.POLYGON_OFFSET_FILL),(P!==pt||F!==_t)&&(i.polygonOffset(pt,_t),P=pt,F=_t)):vt(i.POLYGON_OFFSET_FILL)}function mt(B){B?et(i.SCISSOR_TEST):vt(i.SCISSOR_TEST)}function $t(B){B===void 0&&(B=i.TEXTURE0+O-1),K!==B&&(i.activeTexture(B),K=B)}function qt(B,pt,_t){_t===void 0&&(K===null?_t=i.TEXTURE0+O-1:_t=K);let Ft=st[_t];Ft===void 0&&(Ft={type:void 0,texture:void 0},st[_t]=Ft),(Ft.type!==B||Ft.texture!==pt)&&(K!==_t&&(i.activeTexture(_t),K=_t),i.bindTexture(B,pt||j[B]),Ft.type=B,Ft.texture=pt)}function I(){const B=st[K];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function E(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function H(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function X(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function St(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ht(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function bt(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Tt(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ft(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Et(B){Dt.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Dt.copy(B))}function Xt(B){zt.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),zt.copy(B))}function kt(B,pt){let _t=c.get(pt);_t===void 0&&(_t=new WeakMap,c.set(pt,_t));let Ft=_t.get(B);Ft===void 0&&(Ft=i.getUniformBlockIndex(pt,B.name),_t.set(B,Ft))}function Mt(B,pt){const Ft=c.get(pt).get(B);l.get(pt)!==Ft&&(i.uniformBlockBinding(pt,Ft,B.__bindingPointIndex),l.set(pt,Ft))}function Jt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},K=null,st={},f={},m=new WeakMap,u=[],p=null,g=!1,v=null,d=null,x=null,_=null,y=null,w=null,b=null,A=new Gt(0,0,0),T=0,S=!1,M=null,R=null,L=null,P=null,F=null,Dt.set(0,0,i.canvas.width,i.canvas.height),zt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:vt,bindFramebuffer:wt,drawBuffers:yt,useProgram:Yt,setBlending:rt,setMaterial:nt,setFlipSided:it,setCullFace:tt,setLineWidth:dt,setPolygonOffset:at,setScissorTest:mt,activeTexture:$t,bindTexture:qt,unbindTexture:I,compressedTexImage2D:E,compressedTexImage3D:H,texImage2D:Tt,texImage3D:ft,updateUBOMapping:kt,uniformBlockBinding:Mt,texStorage2D:ht,texStorage3D:bt,texSubImage2D:X,texSubImage3D:Q,compressedTexSubImage2D:Y,compressedTexSubImage3D:St,scissor:Et,viewport:Xt,reset:Jt}}function ax(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ct,h=new WeakMap;let f;const m=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(I,E){return u?new OffscreenCanvas(I,E):Lr("canvas")}function g(I,E,H){let X=1;const Q=qt(I);if((Q.width>H||Q.height>H)&&(X=H/Math.max(Q.width,Q.height)),X<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const Y=Math.floor(X*Q.width),St=Math.floor(X*Q.height);f===void 0&&(f=p(Y,St));const ht=E?p(Y,St):f;return ht.width=Y,ht.height=St,ht.getContext("2d").drawImage(I,0,0,Y,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Y+"x"+St+")."),ht}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),I;return I}function v(I){return I.generateMipmaps}function d(I){i.generateMipmap(I)}function x(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(I,E,H,X,Q=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let Y=E;if(E===i.RED&&(H===i.FLOAT&&(Y=i.R32F),H===i.HALF_FLOAT&&(Y=i.R16F),H===i.UNSIGNED_BYTE&&(Y=i.R8)),E===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.R8UI),H===i.UNSIGNED_SHORT&&(Y=i.R16UI),H===i.UNSIGNED_INT&&(Y=i.R32UI),H===i.BYTE&&(Y=i.R8I),H===i.SHORT&&(Y=i.R16I),H===i.INT&&(Y=i.R32I)),E===i.RG&&(H===i.FLOAT&&(Y=i.RG32F),H===i.HALF_FLOAT&&(Y=i.RG16F),H===i.UNSIGNED_BYTE&&(Y=i.RG8)),E===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RG8UI),H===i.UNSIGNED_SHORT&&(Y=i.RG16UI),H===i.UNSIGNED_INT&&(Y=i.RG32UI),H===i.BYTE&&(Y=i.RG8I),H===i.SHORT&&(Y=i.RG16I),H===i.INT&&(Y=i.RG32I)),E===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),H===i.UNSIGNED_INT&&(Y=i.RGB32UI),H===i.BYTE&&(Y=i.RGB8I),H===i.SHORT&&(Y=i.RGB16I),H===i.INT&&(Y=i.RGB32I)),E===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),H===i.UNSIGNED_INT&&(Y=i.RGBA32UI),H===i.BYTE&&(Y=i.RGBA8I),H===i.SHORT&&(Y=i.RGBA16I),H===i.INT&&(Y=i.RGBA32I)),E===i.RGB&&(H===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),E===i.RGBA){const St=Q?Wa:de.getTransfer(X);H===i.FLOAT&&(Y=i.RGBA32F),H===i.HALF_FLOAT&&(Y=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Y=St===ge?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function y(I,E){let H;return I?E===null||E===as||E===Xs?H=i.DEPTH24_STENCIL8:E===qn?H=i.DEPTH32F_STENCIL8:E===Cr&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===as||E===Xs?H=i.DEPTH_COMPONENT24:E===qn?H=i.DEPTH_COMPONENT32F:E===Cr&&(H=i.DEPTH_COMPONENT16),H}function w(I,E){return v(I)===!0||I.isFramebufferTexture&&I.minFilter!==hn&&I.minFilter!==ni?Math.log2(Math.max(E.width,E.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?E.mipmaps.length:1}function b(I){const E=I.target;E.removeEventListener("dispose",b),T(E),E.isVideoTexture&&h.delete(E)}function A(I){const E=I.target;E.removeEventListener("dispose",A),M(E)}function T(I){const E=n.get(I);if(E.__webglInit===void 0)return;const H=I.source,X=m.get(H);if(X){const Q=X[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(I),Object.keys(X).length===0&&m.delete(H)}n.remove(I)}function S(I){const E=n.get(I);i.deleteTexture(E.__webglTexture);const H=I.source,X=m.get(H);delete X[E.__cacheKey],a.memory.textures--}function M(I){const E=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(E.__webglFramebuffer[X]))for(let Q=0;Q<E.__webglFramebuffer[X].length;Q++)i.deleteFramebuffer(E.__webglFramebuffer[X][Q]);else i.deleteFramebuffer(E.__webglFramebuffer[X]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[X])}else{if(Array.isArray(E.__webglFramebuffer))for(let X=0;X<E.__webglFramebuffer.length;X++)i.deleteFramebuffer(E.__webglFramebuffer[X]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let X=0;X<E.__webglColorRenderbuffer.length;X++)E.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[X]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=I.textures;for(let X=0,Q=H.length;X<Q;X++){const Y=n.get(H[X]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(H[X])}n.remove(I)}let R=0;function L(){R=0}function P(){const I=R;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),R+=1,I}function F(I){const E=[];return E.push(I.wrapS),E.push(I.wrapT),E.push(I.wrapR||0),E.push(I.magFilter),E.push(I.minFilter),E.push(I.anisotropy),E.push(I.internalFormat),E.push(I.format),E.push(I.type),E.push(I.generateMipmaps),E.push(I.premultiplyAlpha),E.push(I.flipY),E.push(I.unpackAlignment),E.push(I.colorSpace),E.join()}function O(I,E){const H=n.get(I);if(I.isVideoTexture&&mt(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&H.__version!==I.version){const X=I.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(H,I,E);return}}else I.isExternalTexture&&(H.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+E)}function z(I,E){const H=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&H.__version!==I.version){j(H,I,E);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+E)}function q(I,E){const H=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&H.__version!==I.version){j(H,I,E);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+E)}function V(I,E){const H=n.get(I);if(I.version>0&&H.__version!==I.version){et(H,I,E);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+E)}const K={[zi]:i.REPEAT,[ns]:i.CLAMP_TO_EDGE,[bl]:i.MIRRORED_REPEAT},st={[hn]:i.NEAREST,[Od]:i.NEAREST_MIPMAP_NEAREST,[Xr]:i.NEAREST_MIPMAP_LINEAR,[ni]:i.LINEAR,[So]:i.LINEAR_MIPMAP_NEAREST,[is]:i.LINEAR_MIPMAP_LINEAR},ut={[Hd]:i.NEVER,[Yd]:i.ALWAYS,[Vd]:i.LESS,[hf]:i.LEQUAL,[Gd]:i.EQUAL,[qd]:i.GEQUAL,[Wd]:i.GREATER,[Xd]:i.NOTEQUAL};function Rt(I,E){if(E.type===qn&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===ni||E.magFilter===So||E.magFilter===Xr||E.magFilter===is||E.minFilter===ni||E.minFilter===So||E.minFilter===Xr||E.minFilter===is)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,K[E.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,K[E.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,K[E.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,st[E.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,st[E.minFilter]),E.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,ut[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===hn||E.minFilter!==Xr&&E.minFilter!==is||E.type===qn&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Dt(I,E){let H=!1;I.__webglInit===void 0&&(I.__webglInit=!0,E.addEventListener("dispose",b));const X=E.source;let Q=m.get(X);Q===void 0&&(Q={},m.set(X,Q));const Y=F(E);if(Y!==I.__cacheKey){Q[Y]===void 0&&(Q[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[Y].usedTimes++;const St=Q[I.__cacheKey];St!==void 0&&(Q[I.__cacheKey].usedTimes--,St.usedTimes===0&&S(E)),I.__cacheKey=Y,I.__webglTexture=Q[Y].texture}return H}function zt(I,E,H){return Math.floor(Math.floor(I/H)/E)}function Wt(I,E,H,X){const Y=I.updateRanges;if(Y.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,H,X,E.data);else{Y.sort((ft,Et)=>ft.start-Et.start);let St=0;for(let ft=1;ft<Y.length;ft++){const Et=Y[St],Xt=Y[ft],kt=Et.start+Et.count,Mt=zt(Xt.start,E.width,4),Jt=zt(Et.start,E.width,4);Xt.start<=kt+1&&Mt===Jt&&zt(Xt.start+Xt.count-1,E.width,4)===Mt?Et.count=Math.max(Et.count,Xt.start+Xt.count-Et.start):(++St,Y[St]=Xt)}Y.length=St+1;const ht=i.getParameter(i.UNPACK_ROW_LENGTH),bt=i.getParameter(i.UNPACK_SKIP_PIXELS),Tt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let ft=0,Et=Y.length;ft<Et;ft++){const Xt=Y[ft],kt=Math.floor(Xt.start/4),Mt=Math.ceil(Xt.count/4),Jt=kt%E.width,B=Math.floor(kt/E.width),pt=Mt,_t=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Jt),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),e.texSubImage2D(i.TEXTURE_2D,0,Jt,B,pt,_t,H,X,E.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ht),i.pixelStorei(i.UNPACK_SKIP_PIXELS,bt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Tt)}}function j(I,E,H){let X=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(X=i.TEXTURE_3D);const Q=Dt(I,E),Y=E.source;e.bindTexture(X,I.__webglTexture,i.TEXTURE0+H);const St=n.get(Y);if(Y.version!==St.__version||Q===!0){e.activeTexture(i.TEXTURE0+H);const ht=de.getPrimaries(de.workingColorSpace),bt=E.colorSpace===Sn?null:de.getPrimaries(E.colorSpace),Tt=E.colorSpace===Sn||ht===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let ft=g(E.image,!1,s.maxTextureSize);ft=$t(E,ft);const Et=r.convert(E.format,E.colorSpace),Xt=r.convert(E.type);let kt=_(E.internalFormat,Et,Xt,E.colorSpace,E.isVideoTexture);Rt(X,E);let Mt;const Jt=E.mipmaps,B=E.isVideoTexture!==!0,pt=St.__version===void 0||Q===!0,_t=Y.dataReady,Ft=w(E,ft);if(E.isDepthTexture)kt=y(E.format===qs,E.type),pt&&(B?e.texStorage2D(i.TEXTURE_2D,1,kt,ft.width,ft.height):e.texImage2D(i.TEXTURE_2D,0,kt,ft.width,ft.height,0,Et,Xt,null));else if(E.isDataTexture)if(Jt.length>0){B&&pt&&e.texStorage2D(i.TEXTURE_2D,Ft,kt,Jt[0].width,Jt[0].height);for(let gt=0,ot=Jt.length;gt<ot;gt++)Mt=Jt[gt],B?_t&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Mt.width,Mt.height,Et,Xt,Mt.data):e.texImage2D(i.TEXTURE_2D,gt,kt,Mt.width,Mt.height,0,Et,Xt,Mt.data);E.generateMipmaps=!1}else B?(pt&&e.texStorage2D(i.TEXTURE_2D,Ft,kt,ft.width,ft.height),_t&&Wt(E,ft,Et,Xt)):e.texImage2D(i.TEXTURE_2D,0,kt,ft.width,ft.height,0,Et,Xt,ft.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){B&&pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ft,kt,Jt[0].width,Jt[0].height,ft.depth);for(let gt=0,ot=Jt.length;gt<ot;gt++)if(Mt=Jt[gt],E.format!==Yn)if(Et!==null)if(B){if(_t)if(E.layerUpdates.size>0){const Bt=Vh(Mt.width,Mt.height,E.format,E.type);for(const ee of E.layerUpdates){const xe=Mt.data.subarray(ee*Bt/Mt.data.BYTES_PER_ELEMENT,(ee+1)*Bt/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,ee,Mt.width,Mt.height,1,Et,xe)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,Mt.width,Mt.height,ft.depth,Et,Mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,gt,kt,Mt.width,Mt.height,ft.depth,0,Mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?_t&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,Mt.width,Mt.height,ft.depth,Et,Xt,Mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,gt,kt,Mt.width,Mt.height,ft.depth,0,Et,Xt,Mt.data)}else{B&&pt&&e.texStorage2D(i.TEXTURE_2D,Ft,kt,Jt[0].width,Jt[0].height);for(let gt=0,ot=Jt.length;gt<ot;gt++)Mt=Jt[gt],E.format!==Yn?Et!==null?B?_t&&e.compressedTexSubImage2D(i.TEXTURE_2D,gt,0,0,Mt.width,Mt.height,Et,Mt.data):e.compressedTexImage2D(i.TEXTURE_2D,gt,kt,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?_t&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Mt.width,Mt.height,Et,Xt,Mt.data):e.texImage2D(i.TEXTURE_2D,gt,kt,Mt.width,Mt.height,0,Et,Xt,Mt.data)}else if(E.isDataArrayTexture)if(B){if(pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ft,kt,ft.width,ft.height,ft.depth),_t)if(E.layerUpdates.size>0){const gt=Vh(ft.width,ft.height,E.format,E.type);for(const ot of E.layerUpdates){const Bt=ft.data.subarray(ot*gt/ft.data.BYTES_PER_ELEMENT,(ot+1)*gt/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ot,ft.width,ft.height,1,Et,Xt,Bt)}E.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,Et,Xt,ft.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,kt,ft.width,ft.height,ft.depth,0,Et,Xt,ft.data);else if(E.isData3DTexture)B?(pt&&e.texStorage3D(i.TEXTURE_3D,Ft,kt,ft.width,ft.height,ft.depth),_t&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,Et,Xt,ft.data)):e.texImage3D(i.TEXTURE_3D,0,kt,ft.width,ft.height,ft.depth,0,Et,Xt,ft.data);else if(E.isFramebufferTexture){if(pt)if(B)e.texStorage2D(i.TEXTURE_2D,Ft,kt,ft.width,ft.height);else{let gt=ft.width,ot=ft.height;for(let Bt=0;Bt<Ft;Bt++)e.texImage2D(i.TEXTURE_2D,Bt,kt,gt,ot,0,Et,Xt,null),gt>>=1,ot>>=1}}else if(Jt.length>0){if(B&&pt){const gt=qt(Jt[0]);e.texStorage2D(i.TEXTURE_2D,Ft,kt,gt.width,gt.height)}for(let gt=0,ot=Jt.length;gt<ot;gt++)Mt=Jt[gt],B?_t&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Et,Xt,Mt):e.texImage2D(i.TEXTURE_2D,gt,kt,Et,Xt,Mt);E.generateMipmaps=!1}else if(B){if(pt){const gt=qt(ft);e.texStorage2D(i.TEXTURE_2D,Ft,kt,gt.width,gt.height)}_t&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,Xt,ft)}else e.texImage2D(i.TEXTURE_2D,0,kt,Et,Xt,ft);v(E)&&d(X),St.__version=Y.version,E.onUpdate&&E.onUpdate(E)}I.__version=E.version}function et(I,E,H){if(E.image.length!==6)return;const X=Dt(I,E),Q=E.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+H);const Y=n.get(Q);if(Q.version!==Y.__version||X===!0){e.activeTexture(i.TEXTURE0+H);const St=de.getPrimaries(de.workingColorSpace),ht=E.colorSpace===Sn?null:de.getPrimaries(E.colorSpace),bt=E.colorSpace===Sn||St===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const Tt=E.isCompressedTexture||E.image[0].isCompressedTexture,ft=E.image[0]&&E.image[0].isDataTexture,Et=[];for(let ot=0;ot<6;ot++)!Tt&&!ft?Et[ot]=g(E.image[ot],!0,s.maxCubemapSize):Et[ot]=ft?E.image[ot].image:E.image[ot],Et[ot]=$t(E,Et[ot]);const Xt=Et[0],kt=r.convert(E.format,E.colorSpace),Mt=r.convert(E.type),Jt=_(E.internalFormat,kt,Mt,E.colorSpace),B=E.isVideoTexture!==!0,pt=Y.__version===void 0||X===!0,_t=Q.dataReady;let Ft=w(E,Xt);Rt(i.TEXTURE_CUBE_MAP,E);let gt;if(Tt){B&&pt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ft,Jt,Xt.width,Xt.height);for(let ot=0;ot<6;ot++){gt=Et[ot].mipmaps;for(let Bt=0;Bt<gt.length;Bt++){const ee=gt[Bt];E.format!==Yn?kt!==null?B?_t&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt,0,0,ee.width,ee.height,kt,ee.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt,Jt,ee.width,ee.height,0,ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt,0,0,ee.width,ee.height,kt,Mt,ee.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt,Jt,ee.width,ee.height,0,kt,Mt,ee.data)}}}else{if(gt=E.mipmaps,B&&pt){gt.length>0&&Ft++;const ot=qt(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ft,Jt,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(ft){B?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Et[ot].width,Et[ot].height,kt,Mt,Et[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Jt,Et[ot].width,Et[ot].height,0,kt,Mt,Et[ot].data);for(let Bt=0;Bt<gt.length;Bt++){const xe=gt[Bt].image[ot].image;B?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt+1,0,0,xe.width,xe.height,kt,Mt,xe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt+1,Jt,xe.width,xe.height,0,kt,Mt,xe.data)}}else{B?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,kt,Mt,Et[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Jt,kt,Mt,Et[ot]);for(let Bt=0;Bt<gt.length;Bt++){const ee=gt[Bt];B?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt+1,0,0,kt,Mt,ee.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Bt+1,Jt,kt,Mt,ee.image[ot])}}}v(E)&&d(i.TEXTURE_CUBE_MAP),Y.__version=Q.version,E.onUpdate&&E.onUpdate(E)}I.__version=E.version}function vt(I,E,H,X,Q,Y){const St=r.convert(H.format,H.colorSpace),ht=r.convert(H.type),bt=_(H.internalFormat,St,ht,H.colorSpace),Tt=n.get(E),ft=n.get(H);if(ft.__renderTarget=E,!Tt.__hasExternalTextures){const Et=Math.max(1,E.width>>Y),Xt=Math.max(1,E.height>>Y);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,Y,bt,Et,Xt,E.depth,0,St,ht,null):e.texImage2D(Q,Y,bt,Et,Xt,0,St,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),at(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,Q,ft.__webglTexture,0,dt(E)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,Q,ft.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(I,E,H){if(i.bindRenderbuffer(i.RENDERBUFFER,I),E.depthBuffer){const X=E.depthTexture,Q=X&&X.isDepthTexture?X.type:null,Y=y(E.stencilBuffer,Q),St=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=dt(E);at(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,Y,E.width,E.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,Y,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Y,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,St,i.RENDERBUFFER,I)}else{const X=E.textures;for(let Q=0;Q<X.length;Q++){const Y=X[Q],St=r.convert(Y.format,Y.colorSpace),ht=r.convert(Y.type),bt=_(Y.internalFormat,St,ht,Y.colorSpace),Tt=dt(E);H&&at(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt,bt,E.width,E.height):at(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt,bt,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,bt,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function yt(I,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=n.get(E.depthTexture);X.__renderTarget=E,(!X.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),O(E.depthTexture,0);const Q=X.__webglTexture,Y=dt(E);if(E.depthTexture.format===Pr)at(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(E.depthTexture.format===qs)at(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Yt(I){const E=n.get(I),H=I.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==I.depthTexture){const X=I.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),X){const Q=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,X.removeEventListener("dispose",Q)};X.addEventListener("dispose",Q),E.__depthDisposeCallback=Q}E.__boundDepthTexture=X}if(I.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");const X=I.texture.mipmaps;X&&X.length>0?yt(E.__webglFramebuffer[0],I):yt(E.__webglFramebuffer,I)}else if(H){E.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[X]),E.__webglDepthbuffer[X]===void 0)E.__webglDepthbuffer[X]=i.createRenderbuffer(),wt(E.__webglDepthbuffer[X],I,!1);else{const Q=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=E.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Y)}}else{const X=I.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),wt(E.__webglDepthbuffer,I,!1);else{const Q=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Y)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(I,E,H){const X=n.get(I);E!==void 0&&vt(X.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Yt(I)}function N(I){const E=I.texture,H=n.get(I),X=n.get(E);I.addEventListener("dispose",A);const Q=I.textures,Y=I.isWebGLCubeRenderTarget===!0,St=Q.length>1;if(St||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=E.version,a.memory.textures++),Y){H.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[ht]=[];for(let bt=0;bt<E.mipmaps.length;bt++)H.__webglFramebuffer[ht][bt]=i.createFramebuffer()}else H.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let ht=0;ht<E.mipmaps.length;ht++)H.__webglFramebuffer[ht]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(St)for(let ht=0,bt=Q.length;ht<bt;ht++){const Tt=n.get(Q[ht]);Tt.__webglTexture===void 0&&(Tt.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&at(I)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ht=0;ht<Q.length;ht++){const bt=Q[ht];H.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ht]);const Tt=r.convert(bt.format,bt.colorSpace),ft=r.convert(bt.type),Et=_(bt.internalFormat,Tt,ft,bt.colorSpace,I.isXRRenderTarget===!0),Xt=dt(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Xt,Et,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,H.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),wt(H.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Rt(i.TEXTURE_CUBE_MAP,E);for(let ht=0;ht<6;ht++)if(E.mipmaps&&E.mipmaps.length>0)for(let bt=0;bt<E.mipmaps.length;bt++)vt(H.__webglFramebuffer[ht][bt],I,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,bt);else vt(H.__webglFramebuffer[ht],I,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);v(E)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let ht=0,bt=Q.length;ht<bt;ht++){const Tt=Q[ht],ft=n.get(Tt);let Et=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Et=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,ft.__webglTexture),Rt(Et,Tt),vt(H.__webglFramebuffer,I,Tt,i.COLOR_ATTACHMENT0+ht,Et,0),v(Tt)&&d(Et)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(ht=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,X.__webglTexture),Rt(ht,E),E.mipmaps&&E.mipmaps.length>0)for(let bt=0;bt<E.mipmaps.length;bt++)vt(H.__webglFramebuffer[bt],I,E,i.COLOR_ATTACHMENT0,ht,bt);else vt(H.__webglFramebuffer,I,E,i.COLOR_ATTACHMENT0,ht,0);v(E)&&d(ht),e.unbindTexture()}I.depthBuffer&&Yt(I)}function rt(I){const E=I.textures;for(let H=0,X=E.length;H<X;H++){const Q=E[H];if(v(Q)){const Y=x(I),St=n.get(Q).__webglTexture;e.bindTexture(Y,St),d(Y),e.unbindTexture()}}}const nt=[],it=[];function tt(I){if(I.samples>0){if(at(I)===!1){const E=I.textures,H=I.width,X=I.height;let Q=i.COLOR_BUFFER_BIT;const Y=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(I),ht=E.length>1;if(ht)for(let Tt=0;Tt<E.length;Tt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer);const bt=I.texture.mipmaps;bt&&bt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let Tt=0;Tt<E.length;Tt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[Tt]);const ft=n.get(E[Tt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ft,0)}i.blitFramebuffer(0,0,H,X,0,0,H,X,Q,i.NEAREST),l===!0&&(nt.length=0,it.length=0,nt.push(i.COLOR_ATTACHMENT0+Tt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(nt.push(Y),it.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let Tt=0;Tt<E.length;Tt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,St.__webglColorRenderbuffer[Tt]);const ft=n.get(E[Tt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){const E=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function dt(I){return Math.min(s.maxSamples,I.samples)}function at(I){const E=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function mt(I){const E=a.render.frame;h.get(I)!==E&&(h.set(I,E),I.update())}function $t(I,E){const H=I.colorSpace,X=I.format,Q=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||H!==Ys&&H!==Sn&&(de.getTransfer(H)===ge?(X!==Yn||Q!==li)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function qt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=L,this.setTexture2D=O,this.setTexture2DArray=z,this.setTexture3D=q,this.setTextureCube=V,this.rebindTextures=Nt,this.setupRenderTarget=N,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=tt,this.setupDepthRenderbuffer=Yt,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=at}function ox(i,t){function e(n,s=Sn){let r;const a=de.getTransfer(s);if(n===li)return i.UNSIGNED_BYTE;if(n===Tc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ec)return i.UNSIGNED_SHORT_5_5_5_1;if(n===rf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===af)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===nf)return i.BYTE;if(n===sf)return i.SHORT;if(n===Cr)return i.UNSIGNED_SHORT;if(n===wc)return i.INT;if(n===as)return i.UNSIGNED_INT;if(n===qn)return i.FLOAT;if(n===ci)return i.HALF_FLOAT;if(n===of)return i.ALPHA;if(n===lf)return i.RGB;if(n===Yn)return i.RGBA;if(n===Pr)return i.DEPTH_COMPONENT;if(n===qs)return i.DEPTH_STENCIL;if(n===ao)return i.RED;if(n===Ac)return i.RED_INTEGER;if(n===cf)return i.RG;if(n===Rc)return i.RG_INTEGER;if(n===Cc)return i.RGBA_INTEGER;if(n===Fa||n===Oa||n===za||n===ka)if(a===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Fa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Fa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===za)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wl||n===Tl||n===El||n===Al)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===wl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Tl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Al)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Rl||n===Cl||n===Pl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Rl||n===Cl)return a===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Pl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Il||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol||n===zl||n===kl||n===Bl||n===Hl||n===Vl||n===Gl||n===Wl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Il)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ll)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Dl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ul)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Nl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Fl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ol)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===kl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Hl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Vl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Gl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Wl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xl||n===ql||n===Yl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Xl)return a===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ql)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$l||n===Zl||n===Jl||n===Kl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===$l)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Zl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Jl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Kl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const lx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cx=`
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

}`;class hx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Sf(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new cn({vertexShader:lx,fragmentShader:cx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Vt(new he(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ux extends Qs{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,m=null,u=null,p=null;const g=typeof XRWebGLBinding<"u",v=new hx,d={},x=e.getContextAttributes();let _=null,y=null;const w=[],b=[],A=new ct;let T=null;const S=new en;S.viewport=new ye;const M=new en;M.viewport=new ye;const R=[S,M],L=new Pp;let P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let et=w[j];return et===void 0&&(et=new Go,w[j]=et),et.getTargetRaySpace()},this.getControllerGrip=function(j){let et=w[j];return et===void 0&&(et=new Go,w[j]=et),et.getGripSpace()},this.getHand=function(j){let et=w[j];return et===void 0&&(et=new Go,w[j]=et),et.getHandSpace()};function O(j){const et=b.indexOf(j.inputSource);if(et===-1)return;const vt=w[et];vt!==void 0&&(vt.update(j.inputSource,j.frame,c||a),vt.dispatchEvent({type:j.type,data:j.inputSource}))}function z(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",q);for(let j=0;j<w.length;j++){const et=b[j];et!==null&&(b[j]=null,w[j].disconnect(et))}P=null,F=null,v.reset();for(const j in d)delete d[j];t.setRenderTarget(_),u=null,m=null,f=null,s=null,y=null,Wt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return m!==null?m:u},this.getBinding=function(){return f===null&&g&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(_=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",z),s.addEventListener("inputsourceschange",q),x.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(A),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,wt=null,yt=null;x.depth&&(yt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=x.stencil?qs:Pr,wt=x.stencil?Xs:as);const Yt={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};f=this.getBinding(),m=f.createProjectionLayer(Yt),s.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),y=new wn(m.textureWidth,m.textureHeight,{format:Yn,type:li,depthTexture:new Fc(m.textureWidth,m.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const vt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,vt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new wn(u.framebufferWidth,u.framebufferHeight,{format:Yn,type:li,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Wt.setContext(s),Wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function q(j){for(let et=0;et<j.removed.length;et++){const vt=j.removed[et],wt=b.indexOf(vt);wt>=0&&(b[wt]=null,w[wt].disconnect(vt))}for(let et=0;et<j.added.length;et++){const vt=j.added[et];let wt=b.indexOf(vt);if(wt===-1){for(let Yt=0;Yt<w.length;Yt++)if(Yt>=b.length){b.push(vt),wt=Yt;break}else if(b[Yt]===null){b[Yt]=vt,wt=Yt;break}if(wt===-1)break}const yt=w[wt];yt&&yt.connect(vt)}}const V=new U,K=new U;function st(j,et,vt){V.setFromMatrixPosition(et.matrixWorld),K.setFromMatrixPosition(vt.matrixWorld);const wt=V.distanceTo(K),yt=et.projectionMatrix.elements,Yt=vt.projectionMatrix.elements,Nt=yt[14]/(yt[10]-1),N=yt[14]/(yt[10]+1),rt=(yt[9]+1)/yt[5],nt=(yt[9]-1)/yt[5],it=(yt[8]-1)/yt[0],tt=(Yt[8]+1)/Yt[0],dt=Nt*it,at=Nt*tt,mt=wt/(-it+tt),$t=mt*-it;if(et.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX($t),j.translateZ(mt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),yt[10]===-1)j.projectionMatrix.copy(et.projectionMatrix),j.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const qt=Nt+mt,I=N+mt,E=dt-$t,H=at+(wt-$t),X=rt*N/I*qt,Q=nt*N/I*qt;j.projectionMatrix.makePerspective(E,H,X,Q,qt,I),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ut(j,et){et===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(et.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let et=j.near,vt=j.far;v.texture!==null&&(v.depthNear>0&&(et=v.depthNear),v.depthFar>0&&(vt=v.depthFar)),L.near=M.near=S.near=et,L.far=M.far=S.far=vt,(P!==L.near||F!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),P=L.near,F=L.far),L.layers.mask=j.layers.mask|6,S.layers.mask=L.layers.mask&3,M.layers.mask=L.layers.mask&5;const wt=j.parent,yt=L.cameras;ut(L,wt);for(let Yt=0;Yt<yt.length;Yt++)ut(yt[Yt],wt);yt.length===2?st(L,S,M):L.projectionMatrix.copy(S.projectionMatrix),Rt(j,L,wt)};function Rt(j,et,vt){vt===null?j.matrix.copy(et.matrixWorld):(j.matrix.copy(vt.matrixWorld),j.matrix.invert(),j.matrix.multiply(et.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(et.projectionMatrix),j.projectionMatrixInverse.copy(et.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Ir*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(m===null&&u===null))return l},this.setFoveation=function(j){l=j,m!==null&&(m.fixedFoveation=j),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=j)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(L)},this.getCameraTexture=function(j){return d[j]};let Dt=null;function zt(j,et){if(h=et.getViewerPose(c||a),p=et,h!==null){const vt=h.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let wt=!1;vt.length!==L.cameras.length&&(L.cameras.length=0,wt=!0);for(let N=0;N<vt.length;N++){const rt=vt[N];let nt=null;if(u!==null)nt=u.getViewport(rt);else{const tt=f.getViewSubImage(m,rt);nt=tt.viewport,N===0&&(t.setRenderTargetTextures(y,tt.colorTexture,tt.depthStencilTexture),t.setRenderTarget(y))}let it=R[N];it===void 0&&(it=new en,it.layers.enable(N),it.viewport=new ye,R[N]=it),it.matrix.fromArray(rt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(rt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(nt.x,nt.y,nt.width,nt.height),N===0&&(L.matrix.copy(it.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),wt===!0&&L.cameras.push(it)}const yt=s.enabledFeatures;if(yt&&yt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){f=n.getBinding();const N=f.getDepthInformation(vt[0]);N&&N.isValid&&N.texture&&v.init(N,s.renderState)}if(yt&&yt.includes("camera-access")&&g){t.state.unbindTexture(),f=n.getBinding();for(let N=0;N<vt.length;N++){const rt=vt[N].camera;if(rt){let nt=d[rt];nt||(nt=new Sf,d[rt]=nt);const it=f.getCameraImage(rt);nt.sourceTexture=it}}}}for(let vt=0;vt<w.length;vt++){const wt=b[vt],yt=w[vt];wt!==null&&yt!==void 0&&yt.update(wt,et,c||a)}Dt&&Dt(j,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),p=null}const Wt=new Uf;Wt.setAnimationLoop(zt),this.setAnimationLoop=function(j){Dt=j},this.dispose=function(){}}}const $i=new Fn,fx=new ue;function dx(i,t){function e(v,d){v.matrixAutoUpdate===!0&&v.updateMatrix(),d.value.copy(v.matrix)}function n(v,d){d.color.getRGB(v.fogColor.value,gf(i)),d.isFog?(v.fogNear.value=d.near,v.fogFar.value=d.far):d.isFogExp2&&(v.fogDensity.value=d.density)}function s(v,d,x,_,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(v,d):d.isMeshToonMaterial?(r(v,d),f(v,d)):d.isMeshPhongMaterial?(r(v,d),h(v,d)):d.isMeshStandardMaterial?(r(v,d),m(v,d),d.isMeshPhysicalMaterial&&u(v,d,y)):d.isMeshMatcapMaterial?(r(v,d),p(v,d)):d.isMeshDepthMaterial?r(v,d):d.isMeshDistanceMaterial?(r(v,d),g(v,d)):d.isMeshNormalMaterial?r(v,d):d.isLineBasicMaterial?(a(v,d),d.isLineDashedMaterial&&o(v,d)):d.isPointsMaterial?l(v,d,x,_):d.isSpriteMaterial?c(v,d):d.isShadowMaterial?(v.color.value.copy(d.color),v.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(v,d){v.opacity.value=d.opacity,d.color&&v.diffuse.value.copy(d.color),d.emissive&&v.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(v.map.value=d.map,e(d.map,v.mapTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,e(d.alphaMap,v.alphaMapTransform)),d.bumpMap&&(v.bumpMap.value=d.bumpMap,e(d.bumpMap,v.bumpMapTransform),v.bumpScale.value=d.bumpScale,d.side===nn&&(v.bumpScale.value*=-1)),d.normalMap&&(v.normalMap.value=d.normalMap,e(d.normalMap,v.normalMapTransform),v.normalScale.value.copy(d.normalScale),d.side===nn&&v.normalScale.value.negate()),d.displacementMap&&(v.displacementMap.value=d.displacementMap,e(d.displacementMap,v.displacementMapTransform),v.displacementScale.value=d.displacementScale,v.displacementBias.value=d.displacementBias),d.emissiveMap&&(v.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,v.emissiveMapTransform)),d.specularMap&&(v.specularMap.value=d.specularMap,e(d.specularMap,v.specularMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest);const x=t.get(d),_=x.envMap,y=x.envMapRotation;_&&(v.envMap.value=_,$i.copy(y),$i.x*=-1,$i.y*=-1,$i.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&($i.y*=-1,$i.z*=-1),v.envMapRotation.value.setFromMatrix4(fx.makeRotationFromEuler($i)),v.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,v.reflectivity.value=d.reflectivity,v.ior.value=d.ior,v.refractionRatio.value=d.refractionRatio),d.lightMap&&(v.lightMap.value=d.lightMap,v.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,v.lightMapTransform)),d.aoMap&&(v.aoMap.value=d.aoMap,v.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,v.aoMapTransform))}function a(v,d){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,d.map&&(v.map.value=d.map,e(d.map,v.mapTransform))}function o(v,d){v.dashSize.value=d.dashSize,v.totalSize.value=d.dashSize+d.gapSize,v.scale.value=d.scale}function l(v,d,x,_){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,v.size.value=d.size*x,v.scale.value=_*.5,d.map&&(v.map.value=d.map,e(d.map,v.uvTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,e(d.alphaMap,v.alphaMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest)}function c(v,d){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,v.rotation.value=d.rotation,d.map&&(v.map.value=d.map,e(d.map,v.mapTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,e(d.alphaMap,v.alphaMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest)}function h(v,d){v.specular.value.copy(d.specular),v.shininess.value=Math.max(d.shininess,1e-4)}function f(v,d){d.gradientMap&&(v.gradientMap.value=d.gradientMap)}function m(v,d){v.metalness.value=d.metalness,d.metalnessMap&&(v.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,v.metalnessMapTransform)),v.roughness.value=d.roughness,d.roughnessMap&&(v.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,v.roughnessMapTransform)),d.envMap&&(v.envMapIntensity.value=d.envMapIntensity)}function u(v,d,x){v.ior.value=d.ior,d.sheen>0&&(v.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),v.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(v.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,v.sheenColorMapTransform)),d.sheenRoughnessMap&&(v.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,v.sheenRoughnessMapTransform))),d.clearcoat>0&&(v.clearcoat.value=d.clearcoat,v.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(v.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,v.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(v.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===nn&&v.clearcoatNormalScale.value.negate())),d.dispersion>0&&(v.dispersion.value=d.dispersion),d.iridescence>0&&(v.iridescence.value=d.iridescence,v.iridescenceIOR.value=d.iridescenceIOR,v.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(v.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,v.iridescenceMapTransform)),d.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),d.transmission>0&&(v.transmission.value=d.transmission,v.transmissionSamplerMap.value=x.texture,v.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(v.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,v.transmissionMapTransform)),v.thickness.value=d.thickness,d.thicknessMap&&(v.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=d.attenuationDistance,v.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(v.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(v.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=d.specularIntensity,v.specularColor.value.copy(d.specularColor),d.specularColorMap&&(v.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,v.specularColorMapTransform)),d.specularIntensityMap&&(v.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,v.specularIntensityMapTransform))}function p(v,d){d.matcap&&(v.matcap.value=d.matcap)}function g(v,d){const x=t.get(d).light;v.referencePosition.value.setFromMatrixPosition(x.matrixWorld),v.nearDistance.value=x.shadow.camera.near,v.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function px(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,_){const y=_.program;n.uniformBlockBinding(x,y)}function c(x,_){let y=s[x.id];y===void 0&&(p(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",v));const w=_.program;n.updateUBOMapping(x,w);const b=t.render.frame;r[x.id]!==b&&(m(x),r[x.id]=b)}function h(x){const _=f();x.__bindingPointIndex=_;const y=i.createBuffer(),w=x.__size,b=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,w,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,y),y}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(x){const _=s[x.id],y=x.uniforms,w=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let b=0,A=y.length;b<A;b++){const T=Array.isArray(y[b])?y[b]:[y[b]];for(let S=0,M=T.length;S<M;S++){const R=T[S];if(u(R,b,S,w)===!0){const L=R.__offset,P=Array.isArray(R.value)?R.value:[R.value];let F=0;for(let O=0;O<P.length;O++){const z=P[O],q=g(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,L+F,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,F),F+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,_,y,w){const b=x.value,A=_+"_"+y;if(w[A]===void 0)return typeof b=="number"||typeof b=="boolean"?w[A]=b:w[A]=b.clone(),!0;{const T=w[A];if(typeof b=="number"||typeof b=="boolean"){if(T!==b)return w[A]=b,!0}else if(T.equals(b)===!1)return T.copy(b),!0}return!1}function p(x){const _=x.uniforms;let y=0;const w=16;for(let A=0,T=_.length;A<T;A++){const S=Array.isArray(_[A])?_[A]:[_[A]];for(let M=0,R=S.length;M<R;M++){const L=S[M],P=Array.isArray(L.value)?L.value:[L.value];for(let F=0,O=P.length;F<O;F++){const z=P[F],q=g(z),V=y%w,K=V%q.boundary,st=V+K;y+=K,st!==0&&w-st<q.storage&&(y+=w-st),L.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=y,y+=q.storage}}}const b=y%w;return b>0&&(y+=w-b),x.__size=y,x.__cache={},this}function g(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function v(x){const _=x.target;_.removeEventListener("dispose",v);const y=a.indexOf(_.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function d(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class mx{constructor(t={}){const{canvas:e=h0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:m=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const p=new Uint32Array(4),g=new Int32Array(4);let v=null,d=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ni,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let w=!1;this._outputColorSpace=qe;let b=0,A=0,T=null,S=-1,M=null;const R=new ye,L=new ye;let P=null;const F=new Gt(0);let O=0,z=e.width,q=e.height,V=1,K=null,st=null;const ut=new ye(0,0,z,q),Rt=new ye(0,0,z,q);let Dt=!1;const zt=new Nc;let Wt=!1,j=!1;const et=new ue,vt=new U,wt=new ye,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function Nt(){return T===null?V:1}let N=n;function rt(C,G){return e.getContext(C,G)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Mc}`),e.addEventListener("webglcontextlost",_t,!1),e.addEventListener("webglcontextrestored",Ft,!1),e.addEventListener("webglcontextcreationerror",gt,!1),N===null){const G="webgl2";if(N=rt(G,C),N===null)throw rt(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let nt,it,tt,dt,at,mt,$t,qt,I,E,H,X,Q,Y,St,ht,bt,Tt,ft,Et,Xt,kt,Mt,Jt;function B(){nt=new Tg(N),nt.init(),kt=new ox(N,nt),it=new xg(N,nt,t,kt),tt=new rx(N,nt),it.reversedDepthBuffer&&m&&tt.buffers.depth.setReversed(!0),dt=new Rg(N),at=new qv,mt=new ax(N,nt,tt,at,it,kt,dt),$t=new yg(y),qt=new wg(y),I=new Up(N),Mt=new gg(N,I),E=new Eg(N,I,dt,Mt),H=new Pg(N,E,I,dt),ft=new Cg(N,it,mt),ht=new _g(at),X=new Xv(y,$t,qt,nt,it,Mt,ht),Q=new dx(y,at),Y=new $v,St=new tx(nt),Tt=new mg(y,$t,qt,tt,H,u,l),bt=new ix(y,H,it),Jt=new px(N,dt,it,tt),Et=new vg(N,nt,dt),Xt=new Ag(N,nt,dt),dt.programs=X.programs,y.capabilities=it,y.extensions=nt,y.properties=at,y.renderLists=Y,y.shadowMap=bt,y.state=tt,y.info=dt}B();const pt=new ux(y,N);this.xr=pt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const C=nt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=nt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(C){C!==void 0&&(V=C,this.setSize(z,q,!1))},this.getSize=function(C){return C.set(z,q)},this.setSize=function(C,G,$=!0){if(pt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,q=G,e.width=Math.floor(C*V),e.height=Math.floor(G*V),$===!0&&(e.style.width=C+"px",e.style.height=G+"px"),this.setViewport(0,0,C,G)},this.getDrawingBufferSize=function(C){return C.set(z*V,q*V).floor()},this.setDrawingBufferSize=function(C,G,$){z=C,q=G,V=$,e.width=Math.floor(C*$),e.height=Math.floor(G*$),this.setViewport(0,0,C,G)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(ut)},this.setViewport=function(C,G,$,J){C.isVector4?ut.set(C.x,C.y,C.z,C.w):ut.set(C,G,$,J),tt.viewport(R.copy(ut).multiplyScalar(V).round())},this.getScissor=function(C){return C.copy(Rt)},this.setScissor=function(C,G,$,J){C.isVector4?Rt.set(C.x,C.y,C.z,C.w):Rt.set(C,G,$,J),tt.scissor(L.copy(Rt).multiplyScalar(V).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(C){tt.setScissorTest(Dt=C)},this.setOpaqueSort=function(C){K=C},this.setTransparentSort=function(C){st=C},this.getClearColor=function(C){return C.copy(Tt.getClearColor())},this.setClearColor=function(){Tt.setClearColor(...arguments)},this.getClearAlpha=function(){return Tt.getClearAlpha()},this.setClearAlpha=function(){Tt.setClearAlpha(...arguments)},this.clear=function(C=!0,G=!0,$=!0){let J=0;if(C){let W=!1;if(T!==null){const xt=T.texture.format;W=xt===Cc||xt===Rc||xt===Ac}if(W){const xt=T.texture.type,Lt=xt===li||xt===as||xt===Cr||xt===Xs||xt===Tc||xt===Ec,Ht=Tt.getClearColor(),Ot=Tt.getClearAlpha(),jt=Ht.r,Qt=Ht.g,Zt=Ht.b;Lt?(p[0]=jt,p[1]=Qt,p[2]=Zt,p[3]=Ot,N.clearBufferuiv(N.COLOR,0,p)):(g[0]=jt,g[1]=Qt,g[2]=Zt,g[3]=Ot,N.clearBufferiv(N.COLOR,0,g))}else J|=N.COLOR_BUFFER_BIT}G&&(J|=N.DEPTH_BUFFER_BIT),$&&(J|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",_t,!1),e.removeEventListener("webglcontextrestored",Ft,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Tt.dispose(),Y.dispose(),St.dispose(),at.dispose(),$t.dispose(),qt.dispose(),H.dispose(),Mt.dispose(),Jt.dispose(),X.dispose(),pt.dispose(),pt.removeEventListener("sessionstart",gn),pt.removeEventListener("sessionend",nr),Hi.stop()};function _t(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const C=dt.autoReset,G=bt.enabled,$=bt.autoUpdate,J=bt.needsUpdate,W=bt.type;B(),dt.autoReset=C,bt.enabled=G,bt.autoUpdate=$,bt.needsUpdate=J,bt.type=W}function gt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ot(C){const G=C.target;G.removeEventListener("dispose",ot),Bt(G)}function Bt(C){ee(C),at.remove(C)}function ee(C){const G=at.get(C).programs;G!==void 0&&(G.forEach(function($){X.releaseProgram($)}),C.isShaderMaterial&&X.releaseShaderCache(C))}this.renderBufferDirect=function(C,G,$,J,W,xt){G===null&&(G=yt);const Lt=W.isMesh&&W.matrixWorld.determinant()<0,Ht=dd(C,G,$,J,W);tt.setMaterial(J,Lt);let Ot=$.index,jt=1;if(J.wireframe===!0){if(Ot=E.getWireframeAttribute($),Ot===void 0)return;jt=2}const Qt=$.drawRange,Zt=$.attributes.position;let ce=Qt.start*jt,_e=(Qt.start+Qt.count)*jt;xt!==null&&(ce=Math.max(ce,xt.start*jt),_e=Math.min(_e,(xt.start+xt.count)*jt)),Ot!==null?(ce=Math.max(ce,0),_e=Math.min(_e,Ot.count)):Zt!=null&&(ce=Math.max(ce,0),_e=Math.min(_e,Zt.count));const Le=_e-ce;if(Le<0||Le===1/0)return;Mt.setup(W,J,Ht,$,Ot);let Te,Me=Et;if(Ot!==null&&(Te=I.get(Ot),Me=Xt,Me.setIndex(Te)),W.isMesh)J.wireframe===!0?(tt.setLineWidth(J.wireframeLinewidth*Nt()),Me.setMode(N.LINES)):Me.setMode(N.TRIANGLES);else if(W.isLine){let Kt=J.linewidth;Kt===void 0&&(Kt=1),tt.setLineWidth(Kt*Nt()),W.isLineSegments?Me.setMode(N.LINES):W.isLineLoop?Me.setMode(N.LINE_LOOP):Me.setMode(N.LINE_STRIP)}else W.isPoints?Me.setMode(N.POINTS):W.isSprite&&Me.setMode(N.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Dr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Me.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))Me.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Kt=W._multiDrawStarts,Ae=W._multiDrawCounts,pe=W._multiDrawCount,vn=Ot?I.get(Ot).bytesPerElement:1,fs=at.get(J).currentProgram.getUniforms();for(let xn=0;xn<pe;xn++)fs.setValue(N,"_gl_DrawID",xn),Me.render(Kt[xn]/vn,Ae[xn])}else if(W.isInstancedMesh)Me.renderInstances(ce,Le,W.count);else if($.isInstancedBufferGeometry){const Kt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ae=Math.min($.instanceCount,Kt);Me.renderInstances(ce,Le,Ae)}else Me.render(ce,Le)};function xe(C,G,$){C.transparent===!0&&C.side===Oe&&C.forceSinglePass===!1?(C.side=nn,C.needsUpdate=!0,Wr(C,G,$),C.side=Oi,C.needsUpdate=!0,Wr(C,G,$),C.side=Oe):Wr(C,G,$)}this.compile=function(C,G,$=null){$===null&&($=C),d=St.get($),d.init(G),_.push(d),$.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(d.pushLight(W),W.castShadow&&d.pushShadow(W))}),C!==$&&C.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(d.pushLight(W),W.castShadow&&d.pushShadow(W))}),d.setupLights();const J=new Set;return C.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const xt=W.material;if(xt)if(Array.isArray(xt))for(let Lt=0;Lt<xt.length;Lt++){const Ht=xt[Lt];xe(Ht,$,W),J.add(Ht)}else xe(xt,$,W),J.add(xt)}),d=_.pop(),J},this.compileAsync=function(C,G,$=null){const J=this.compile(C,G,$);return new Promise(W=>{function xt(){if(J.forEach(function(Lt){at.get(Lt).currentProgram.isReady()&&J.delete(Lt)}),J.size===0){W(C);return}setTimeout(xt,10)}nt.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let le=null;function Je(C){le&&le(C)}function gn(){Hi.stop()}function nr(){Hi.start()}const Hi=new Uf;Hi.setAnimationLoop(Je),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(C){le=C,pt.setAnimationLoop(C),C===null?Hi.stop():Hi.start()},pt.addEventListener("sessionstart",gn),pt.addEventListener("sessionend",nr),this.render=function(C,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),pt.enabled===!0&&pt.isPresenting===!0&&(pt.cameraAutoUpdate===!0&&pt.updateCamera(G),G=pt.getCamera()),C.isScene===!0&&C.onBeforeRender(y,C,G,T),d=St.get(C,_.length),d.init(G),_.push(d),et.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),zt.setFromProjectionMatrix(et,ii,G.reversedDepth),j=this.localClippingEnabled,Wt=ht.init(this.clippingPlanes,j),v=Y.get(C,x.length),v.init(),x.push(v),pt.enabled===!0&&pt.isPresenting===!0){const xt=y.xr.getDepthSensingMesh();xt!==null&&yo(xt,G,-1/0,y.sortObjects)}yo(C,G,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(K,st),Yt=pt.enabled===!1||pt.isPresenting===!1||pt.hasDepthSensing()===!1,Yt&&Tt.addToRenderList(v,C),this.info.render.frame++,Wt===!0&&ht.beginShadows();const $=d.state.shadowsArray;bt.render($,C,G),Wt===!0&&ht.endShadows(),this.info.autoReset===!0&&this.info.reset();const J=v.opaque,W=v.transmissive;if(d.setupLights(),G.isArrayCamera){const xt=G.cameras;if(W.length>0)for(let Lt=0,Ht=xt.length;Lt<Ht;Lt++){const Ot=xt[Lt];Kc(J,W,C,Ot)}Yt&&Tt.render(C);for(let Lt=0,Ht=xt.length;Lt<Ht;Lt++){const Ot=xt[Lt];Jc(v,C,Ot,Ot.viewport)}}else W.length>0&&Kc(J,W,C,G),Yt&&Tt.render(C),Jc(v,C,G);T!==null&&A===0&&(mt.updateMultisampleRenderTarget(T),mt.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(y,C,G),Mt.resetDefaultState(),S=-1,M=null,_.pop(),_.length>0?(d=_[_.length-1],Wt===!0&&ht.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?v=x[x.length-1]:v=null};function yo(C,G,$,J){if(C.visible===!1)return;if(C.layers.test(G.layers)){if(C.isGroup)$=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(G);else if(C.isLight)d.pushLight(C),C.castShadow&&d.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||zt.intersectsSprite(C)){J&&wt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(et);const Lt=H.update(C),Ht=C.material;Ht.visible&&v.push(C,Lt,Ht,$,wt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||zt.intersectsObject(C))){const Lt=H.update(C),Ht=C.material;if(J&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),wt.copy(C.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),wt.copy(Lt.boundingSphere.center)),wt.applyMatrix4(C.matrixWorld).applyMatrix4(et)),Array.isArray(Ht)){const Ot=Lt.groups;for(let jt=0,Qt=Ot.length;jt<Qt;jt++){const Zt=Ot[jt],ce=Ht[Zt.materialIndex];ce&&ce.visible&&v.push(C,Lt,ce,$,wt.z,Zt)}}else Ht.visible&&v.push(C,Lt,Ht,$,wt.z,null)}}const xt=C.children;for(let Lt=0,Ht=xt.length;Lt<Ht;Lt++)yo(xt[Lt],G,$,J)}function Jc(C,G,$,J){const W=C.opaque,xt=C.transmissive,Lt=C.transparent;d.setupLightsView($),Wt===!0&&ht.setGlobalState(y.clippingPlanes,$),J&&tt.viewport(R.copy(J)),W.length>0&&Gr(W,G,$),xt.length>0&&Gr(xt,G,$),Lt.length>0&&Gr(Lt,G,$),tt.buffers.depth.setTest(!0),tt.buffers.depth.setMask(!0),tt.buffers.color.setMask(!0),tt.setPolygonOffset(!1)}function Kc(C,G,$,J){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[J.id]===void 0&&(d.state.transmissionRenderTarget[J.id]=new wn(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?ci:li,minFilter:is,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const xt=d.state.transmissionRenderTarget[J.id],Lt=J.viewport||R;xt.setSize(Lt.z*y.transmissionResolutionScale,Lt.w*y.transmissionResolutionScale);const Ht=y.getRenderTarget(),Ot=y.getActiveCubeFace(),jt=y.getActiveMipmapLevel();y.setRenderTarget(xt),y.getClearColor(F),O=y.getClearAlpha(),O<1&&y.setClearColor(16777215,.5),y.clear(),Yt&&Tt.render($);const Qt=y.toneMapping;y.toneMapping=Ni;const Zt=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),d.setupLightsView(J),Wt===!0&&ht.setGlobalState(y.clippingPlanes,J),Gr(C,$,J),mt.updateMultisampleRenderTarget(xt),mt.updateRenderTargetMipmap(xt),nt.has("WEBGL_multisampled_render_to_texture")===!1){let ce=!1;for(let _e=0,Le=G.length;_e<Le;_e++){const Te=G[_e],Me=Te.object,Kt=Te.geometry,Ae=Te.material,pe=Te.group;if(Ae.side===Oe&&Me.layers.test(J.layers)){const vn=Ae.side;Ae.side=nn,Ae.needsUpdate=!0,jc(Me,$,J,Kt,Ae,pe),Ae.side=vn,Ae.needsUpdate=!0,ce=!0}}ce===!0&&(mt.updateMultisampleRenderTarget(xt),mt.updateRenderTargetMipmap(xt))}y.setRenderTarget(Ht,Ot,jt),y.setClearColor(F,O),Zt!==void 0&&(J.viewport=Zt),y.toneMapping=Qt}function Gr(C,G,$){const J=G.isScene===!0?G.overrideMaterial:null;for(let W=0,xt=C.length;W<xt;W++){const Lt=C[W],Ht=Lt.object,Ot=Lt.geometry,jt=Lt.group;let Qt=Lt.material;Qt.allowOverride===!0&&J!==null&&(Qt=J),Ht.layers.test($.layers)&&jc(Ht,G,$,Ot,Qt,jt)}}function jc(C,G,$,J,W,xt){C.onBeforeRender(y,G,$,J,W,xt),C.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),W.onBeforeRender(y,G,$,J,C,xt),W.transparent===!0&&W.side===Oe&&W.forceSinglePass===!1?(W.side=nn,W.needsUpdate=!0,y.renderBufferDirect($,G,J,W,C,xt),W.side=Oi,W.needsUpdate=!0,y.renderBufferDirect($,G,J,W,C,xt),W.side=Oe):y.renderBufferDirect($,G,J,W,C,xt),C.onAfterRender(y,G,$,J,W,xt)}function Wr(C,G,$){G.isScene!==!0&&(G=yt);const J=at.get(C),W=d.state.lights,xt=d.state.shadowsArray,Lt=W.state.version,Ht=X.getParameters(C,W.state,xt,G,$),Ot=X.getProgramCacheKey(Ht);let jt=J.programs;J.environment=C.isMeshStandardMaterial?G.environment:null,J.fog=G.fog,J.envMap=(C.isMeshStandardMaterial?qt:$t).get(C.envMap||J.environment),J.envMapRotation=J.environment!==null&&C.envMap===null?G.environmentRotation:C.envMapRotation,jt===void 0&&(C.addEventListener("dispose",ot),jt=new Map,J.programs=jt);let Qt=jt.get(Ot);if(Qt!==void 0){if(J.currentProgram===Qt&&J.lightsStateVersion===Lt)return th(C,Ht),Qt}else Ht.uniforms=X.getUniforms(C),C.onBeforeCompile(Ht,y),Qt=X.acquireProgram(Ht,Ot),jt.set(Ot,Qt),J.uniforms=Ht.uniforms;const Zt=J.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Zt.clippingPlanes=ht.uniform),th(C,Ht),J.needsLights=md(C),J.lightsStateVersion=Lt,J.needsLights&&(Zt.ambientLightColor.value=W.state.ambient,Zt.lightProbe.value=W.state.probe,Zt.directionalLights.value=W.state.directional,Zt.directionalLightShadows.value=W.state.directionalShadow,Zt.spotLights.value=W.state.spot,Zt.spotLightShadows.value=W.state.spotShadow,Zt.rectAreaLights.value=W.state.rectArea,Zt.ltc_1.value=W.state.rectAreaLTC1,Zt.ltc_2.value=W.state.rectAreaLTC2,Zt.pointLights.value=W.state.point,Zt.pointLightShadows.value=W.state.pointShadow,Zt.hemisphereLights.value=W.state.hemi,Zt.directionalShadowMap.value=W.state.directionalShadowMap,Zt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Zt.spotShadowMap.value=W.state.spotShadowMap,Zt.spotLightMatrix.value=W.state.spotLightMatrix,Zt.spotLightMap.value=W.state.spotLightMap,Zt.pointShadowMap.value=W.state.pointShadowMap,Zt.pointShadowMatrix.value=W.state.pointShadowMatrix),J.currentProgram=Qt,J.uniformsList=null,Qt}function Qc(C){if(C.uniformsList===null){const G=C.currentProgram.getUniforms();C.uniformsList=Ba.seqWithValue(G.seq,C.uniforms)}return C.uniformsList}function th(C,G){const $=at.get(C);$.outputColorSpace=G.outputColorSpace,$.batching=G.batching,$.batchingColor=G.batchingColor,$.instancing=G.instancing,$.instancingColor=G.instancingColor,$.instancingMorph=G.instancingMorph,$.skinning=G.skinning,$.morphTargets=G.morphTargets,$.morphNormals=G.morphNormals,$.morphColors=G.morphColors,$.morphTargetsCount=G.morphTargetsCount,$.numClippingPlanes=G.numClippingPlanes,$.numIntersection=G.numClipIntersection,$.vertexAlphas=G.vertexAlphas,$.vertexTangents=G.vertexTangents,$.toneMapping=G.toneMapping}function dd(C,G,$,J,W){G.isScene!==!0&&(G=yt),mt.resetTextureUnits();const xt=G.fog,Lt=J.isMeshStandardMaterial?G.environment:null,Ht=T===null?y.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ys,Ot=(J.isMeshStandardMaterial?qt:$t).get(J.envMap||Lt),jt=J.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Qt=!!$.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Zt=!!$.morphAttributes.position,ce=!!$.morphAttributes.normal,_e=!!$.morphAttributes.color;let Le=Ni;J.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Le=y.toneMapping);const Te=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Me=Te!==void 0?Te.length:0,Kt=at.get(J),Ae=d.state.lights;if(Wt===!0&&(j===!0||C!==M)){const sn=C===M&&J.id===S;ht.setState(J,C,sn)}let pe=!1;J.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==Ae.state.version||Kt.outputColorSpace!==Ht||W.isBatchedMesh&&Kt.batching===!1||!W.isBatchedMesh&&Kt.batching===!0||W.isBatchedMesh&&Kt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Kt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Kt.instancing===!1||!W.isInstancedMesh&&Kt.instancing===!0||W.isSkinnedMesh&&Kt.skinning===!1||!W.isSkinnedMesh&&Kt.skinning===!0||W.isInstancedMesh&&Kt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Kt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Kt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Kt.instancingMorph===!1&&W.morphTexture!==null||Kt.envMap!==Ot||J.fog===!0&&Kt.fog!==xt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==ht.numPlanes||Kt.numIntersection!==ht.numIntersection)||Kt.vertexAlphas!==jt||Kt.vertexTangents!==Qt||Kt.morphTargets!==Zt||Kt.morphNormals!==ce||Kt.morphColors!==_e||Kt.toneMapping!==Le||Kt.morphTargetsCount!==Me)&&(pe=!0):(pe=!0,Kt.__version=J.version);let vn=Kt.currentProgram;pe===!0&&(vn=Wr(J,G,W));let fs=!1,xn=!1,ir=!1;const Re=vn.getUniforms(),Tn=Kt.uniforms;if(tt.useProgram(vn.program)&&(fs=!0,xn=!0,ir=!0),J.id!==S&&(S=J.id,xn=!0),fs||M!==C){tt.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Re.setValue(N,"projectionMatrix",C.projectionMatrix),Re.setValue(N,"viewMatrix",C.matrixWorldInverse);const fn=Re.map.cameraPosition;fn!==void 0&&fn.setValue(N,vt.setFromMatrixPosition(C.matrixWorld)),it.logarithmicDepthBuffer&&Re.setValue(N,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&Re.setValue(N,"isOrthographic",C.isOrthographicCamera===!0),M!==C&&(M=C,xn=!0,ir=!0)}if(W.isSkinnedMesh){Re.setOptional(N,W,"bindMatrix"),Re.setOptional(N,W,"bindMatrixInverse");const sn=W.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),Re.setValue(N,"boneTexture",sn.boneTexture,mt))}W.isBatchedMesh&&(Re.setOptional(N,W,"batchingTexture"),Re.setValue(N,"batchingTexture",W._matricesTexture,mt),Re.setOptional(N,W,"batchingIdTexture"),Re.setValue(N,"batchingIdTexture",W._indirectTexture,mt),Re.setOptional(N,W,"batchingColorTexture"),W._colorsTexture!==null&&Re.setValue(N,"batchingColorTexture",W._colorsTexture,mt));const En=$.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&ft.update(W,$,vn),(xn||Kt.receiveShadow!==W.receiveShadow)&&(Kt.receiveShadow=W.receiveShadow,Re.setValue(N,"receiveShadow",W.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(Tn.envMap.value=Ot,Tn.flipEnvMap.value=Ot.isCubeTexture&&Ot.isRenderTargetTexture===!1?-1:1),J.isMeshStandardMaterial&&J.envMap===null&&G.environment!==null&&(Tn.envMapIntensity.value=G.environmentIntensity),xn&&(Re.setValue(N,"toneMappingExposure",y.toneMappingExposure),Kt.needsLights&&pd(Tn,ir),xt&&J.fog===!0&&Q.refreshFogUniforms(Tn,xt),Q.refreshMaterialUniforms(Tn,J,V,q,d.state.transmissionRenderTarget[C.id]),Ba.upload(N,Qc(Kt),Tn,mt)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Ba.upload(N,Qc(Kt),Tn,mt),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&Re.setValue(N,"center",W.center),Re.setValue(N,"modelViewMatrix",W.modelViewMatrix),Re.setValue(N,"normalMatrix",W.normalMatrix),Re.setValue(N,"modelMatrix",W.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const sn=J.uniformsGroups;for(let fn=0,Mo=sn.length;fn<Mo;fn++){const Vi=sn[fn];Jt.update(Vi,vn),Jt.bind(Vi,vn)}}return vn}function pd(C,G){C.ambientLightColor.needsUpdate=G,C.lightProbe.needsUpdate=G,C.directionalLights.needsUpdate=G,C.directionalLightShadows.needsUpdate=G,C.pointLights.needsUpdate=G,C.pointLightShadows.needsUpdate=G,C.spotLights.needsUpdate=G,C.spotLightShadows.needsUpdate=G,C.rectAreaLights.needsUpdate=G,C.hemisphereLights.needsUpdate=G}function md(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,G,$){const J=at.get(C);J.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),at.get(C.texture).__webglTexture=G,at.get(C.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:$,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,G){const $=at.get(C);$.__webglFramebuffer=G,$.__useDefaultFramebuffer=G===void 0};const gd=N.createFramebuffer();this.setRenderTarget=function(C,G=0,$=0){T=C,b=G,A=$;let J=!0,W=null,xt=!1,Lt=!1;if(C){const Ot=at.get(C);if(Ot.__useDefaultFramebuffer!==void 0)tt.bindFramebuffer(N.FRAMEBUFFER,null),J=!1;else if(Ot.__webglFramebuffer===void 0)mt.setupRenderTarget(C);else if(Ot.__hasExternalTextures)mt.rebindTextures(C,at.get(C.texture).__webglTexture,at.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Zt=C.depthTexture;if(Ot.__boundDepthTexture!==Zt){if(Zt!==null&&at.has(Zt)&&(C.width!==Zt.image.width||C.height!==Zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");mt.setupDepthRenderbuffer(C)}}const jt=C.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Lt=!0);const Qt=at.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Qt[G])?W=Qt[G][$]:W=Qt[G],xt=!0):C.samples>0&&mt.useMultisampledRTT(C)===!1?W=at.get(C).__webglMultisampledFramebuffer:Array.isArray(Qt)?W=Qt[$]:W=Qt,R.copy(C.viewport),L.copy(C.scissor),P=C.scissorTest}else R.copy(ut).multiplyScalar(V).floor(),L.copy(Rt).multiplyScalar(V).floor(),P=Dt;if($!==0&&(W=gd),tt.bindFramebuffer(N.FRAMEBUFFER,W)&&J&&tt.drawBuffers(C,W),tt.viewport(R),tt.scissor(L),tt.setScissorTest(P),xt){const Ot=at.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ot.__webglTexture,$)}else if(Lt){const Ot=G;for(let jt=0;jt<C.textures.length;jt++){const Qt=at.get(C.textures[jt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+jt,Qt.__webglTexture,$,Ot)}}else if(C!==null&&$!==0){const Ot=at.get(C.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ot.__webglTexture,$)}S=-1},this.readRenderTargetPixels=function(C,G,$,J,W,xt,Lt,Ht=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=at.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Lt!==void 0&&(Ot=Ot[Lt]),Ot){tt.bindFramebuffer(N.FRAMEBUFFER,Ot);try{const jt=C.textures[Ht],Qt=jt.format,Zt=jt.type;if(!it.textureFormatReadable(Qt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=C.width-J&&$>=0&&$<=C.height-W&&(C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ht),N.readPixels(G,$,J,W,kt.convert(Qt),kt.convert(Zt),xt))}finally{const jt=T!==null?at.get(T).__webglFramebuffer:null;tt.bindFramebuffer(N.FRAMEBUFFER,jt)}}},this.readRenderTargetPixelsAsync=async function(C,G,$,J,W,xt,Lt,Ht=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=at.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Lt!==void 0&&(Ot=Ot[Lt]),Ot)if(G>=0&&G<=C.width-J&&$>=0&&$<=C.height-W){tt.bindFramebuffer(N.FRAMEBUFFER,Ot);const jt=C.textures[Ht],Qt=jt.format,Zt=jt.type;if(!it.textureFormatReadable(Qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ce=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,ce),N.bufferData(N.PIXEL_PACK_BUFFER,xt.byteLength,N.STREAM_READ),C.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ht),N.readPixels(G,$,J,W,kt.convert(Qt),kt.convert(Zt),0);const _e=T!==null?at.get(T).__webglFramebuffer:null;tt.bindFramebuffer(N.FRAMEBUFFER,_e);const Le=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await u0(N,Le,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,ce),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,xt),N.deleteBuffer(ce),N.deleteSync(Le),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,G=null,$=0){const J=Math.pow(2,-$),W=Math.floor(C.image.width*J),xt=Math.floor(C.image.height*J),Lt=G!==null?G.x:0,Ht=G!==null?G.y:0;mt.setTexture2D(C,0),N.copyTexSubImage2D(N.TEXTURE_2D,$,0,0,Lt,Ht,W,xt),tt.unbindTexture()};const vd=N.createFramebuffer(),xd=N.createFramebuffer();this.copyTextureToTexture=function(C,G,$=null,J=null,W=0,xt=null){xt===null&&(W!==0?(Dr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),xt=W,W=0):xt=0);let Lt,Ht,Ot,jt,Qt,Zt,ce,_e,Le;const Te=C.isCompressedTexture?C.mipmaps[xt]:C.image;if($!==null)Lt=$.max.x-$.min.x,Ht=$.max.y-$.min.y,Ot=$.isBox3?$.max.z-$.min.z:1,jt=$.min.x,Qt=$.min.y,Zt=$.isBox3?$.min.z:0;else{const En=Math.pow(2,-W);Lt=Math.floor(Te.width*En),Ht=Math.floor(Te.height*En),C.isDataArrayTexture?Ot=Te.depth:C.isData3DTexture?Ot=Math.floor(Te.depth*En):Ot=1,jt=0,Qt=0,Zt=0}J!==null?(ce=J.x,_e=J.y,Le=J.z):(ce=0,_e=0,Le=0);const Me=kt.convert(G.format),Kt=kt.convert(G.type);let Ae;G.isData3DTexture?(mt.setTexture3D(G,0),Ae=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(mt.setTexture2DArray(G,0),Ae=N.TEXTURE_2D_ARRAY):(mt.setTexture2D(G,0),Ae=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);const pe=N.getParameter(N.UNPACK_ROW_LENGTH),vn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),fs=N.getParameter(N.UNPACK_SKIP_PIXELS),xn=N.getParameter(N.UNPACK_SKIP_ROWS),ir=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Te.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Te.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,jt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Qt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Zt);const Re=C.isDataArrayTexture||C.isData3DTexture,Tn=G.isDataArrayTexture||G.isData3DTexture;if(C.isDepthTexture){const En=at.get(C),sn=at.get(G),fn=at.get(En.__renderTarget),Mo=at.get(sn.__renderTarget);tt.bindFramebuffer(N.READ_FRAMEBUFFER,fn.__webglFramebuffer),tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,Mo.__webglFramebuffer);for(let Vi=0;Vi<Ot;Vi++)Re&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,at.get(C).__webglTexture,W,Zt+Vi),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,at.get(G).__webglTexture,xt,Le+Vi)),N.blitFramebuffer(jt,Qt,Lt,Ht,ce,_e,Lt,Ht,N.DEPTH_BUFFER_BIT,N.NEAREST);tt.bindFramebuffer(N.READ_FRAMEBUFFER,null),tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(W!==0||C.isRenderTargetTexture||at.has(C)){const En=at.get(C),sn=at.get(G);tt.bindFramebuffer(N.READ_FRAMEBUFFER,vd),tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,xd);for(let fn=0;fn<Ot;fn++)Re?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,En.__webglTexture,W,Zt+fn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,En.__webglTexture,W),Tn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,sn.__webglTexture,xt,Le+fn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,sn.__webglTexture,xt),W!==0?N.blitFramebuffer(jt,Qt,Lt,Ht,ce,_e,Lt,Ht,N.COLOR_BUFFER_BIT,N.NEAREST):Tn?N.copyTexSubImage3D(Ae,xt,ce,_e,Le+fn,jt,Qt,Lt,Ht):N.copyTexSubImage2D(Ae,xt,ce,_e,jt,Qt,Lt,Ht);tt.bindFramebuffer(N.READ_FRAMEBUFFER,null),tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Tn?C.isDataTexture||C.isData3DTexture?N.texSubImage3D(Ae,xt,ce,_e,Le,Lt,Ht,Ot,Me,Kt,Te.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D(Ae,xt,ce,_e,Le,Lt,Ht,Ot,Me,Te.data):N.texSubImage3D(Ae,xt,ce,_e,Le,Lt,Ht,Ot,Me,Kt,Te):C.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,xt,ce,_e,Lt,Ht,Me,Kt,Te.data):C.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,xt,ce,_e,Te.width,Te.height,Me,Te.data):N.texSubImage2D(N.TEXTURE_2D,xt,ce,_e,Lt,Ht,Me,Kt,Te);N.pixelStorei(N.UNPACK_ROW_LENGTH,pe),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,vn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,fs),N.pixelStorei(N.UNPACK_SKIP_ROWS,xn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ir),xt===0&&G.generateMipmaps&&N.generateMipmap(Ae),tt.unbindTexture()},this.initRenderTarget=function(C){at.get(C).__webglFramebuffer===void 0&&mt.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?mt.setTextureCube(C,0):C.isData3DTexture?mt.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?mt.setTexture2DArray(C,0):mt.setTexture2D(C,0),tt.unbindTexture()},this.resetState=function(){b=0,A=0,T=null,tt.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}const gx=.85,sl=i=>i*i*(3-2*i);function fu(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=sl(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*sl(e),veil:.82+.14*sl(Math.min(1,e/.5)),ready:e===1}}const kf=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function Bf(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class er{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const vx=new Hc(-1,1,1,-1,0,1);class xx extends Ie{constructor(){super(),this.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oe([0,2,0,0,2,0],2))}}const _x=new xx;class Gc{constructor(t){this._mesh=new Vt(_x,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,vx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const ba={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Hf extends er{constructor(){super(),this.uniforms=ss.clone(ba.uniforms),this.material=new yp({name:ba.name,uniforms:this.uniforms,vertexShader:ba.vertexShader,fragmentShader:ba.fragmentShader}),this._fsQuad=new Gc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},de.getTransfer(this._outputColorSpace)===ge&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Zu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ju?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ku?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===bc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Qu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===tf?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ju&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Qn={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},Ja={min:.85,max:1.35};function yx(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function du(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,f=t.height*c*.5,m=Math.max(i.x,.001),u=Math.max(i.y,.001),p=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,g=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(m+p*i.z/s),f/(u+g*i.z/s))}function Mx(i,t){if(!Qn[i])throw Error("unknown item");if(t==="front")return[...Qn[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(Qn[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=Qn[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class Sx extends Ql{constructor(){super();const t=new tn;t.deleteAttribute("uv");const e=new It({side:nn}),n=new It,s=new Za(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Vt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new O0(t,n,6),o=new ze;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new Vt(t,Ds(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Vt(t,Ds(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Vt(t,Ds(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new Vt(t,Ds(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const m=new Vt(t,Ds(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const u=new Vt(t,Ds(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Ds(i){return new Sp({color:0,emissive:16777215,emissiveIntensity:i})}function Vf(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ie;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let m=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in f.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(f.attributes[u]),m++}if(m!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in f.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(f.morphAttributes[u])}if(t){let u;if(e)u=f.index.count;else if(f.attributes.position!==void 0)u=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(e){let h=0;const f=[];for(let m=0;m<i.length;++m){const u=i[m].index;for(let p=0;p<u.count;++p)f.push(u.getX(p)+h);h+=i[m].attributes.position.count}l.setIndex(f)}for(const h in r){const f=pu(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let m=0;m<f;++m){const u=[];for(let g=0;g<a[h].length;++g)u.push(a[h][g][m]);const p=pu(u);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}return l}function pu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Be(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let m=0,u=h.count;m<u;m++)for(let p=0;p<e;p++){const g=h.getComponent(m,p);o.setComponent(m+f,p,g)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function ui(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function fe(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,ui(),e);const s=new V0(n);return s.colorSpace=qe,s.anisotropy=8,s}function lc(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return fe((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function un(i,t,e,n=ui(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function po(i){const t=fe((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=zi,t}const Gf=po("paper"),Wf=po("leather"),xr=po("metal"),mu=po("cloth"),_r=xr.clone();_r.colorSpace=Sn;const cc=Wf.clone();cc.colorSpace=Sn;const Ha=Gf.clone();Ha.colorSpace=Sn;const bx=fe((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),D={black:new It({color:1646879,roughness:.42,metalness:.38,map:xr,bumpMap:_r,bumpScale:.004}),leather:new It({color:6712935,map:Wf,roughness:.78,bumpMap:cc,bumpScale:.01}),silver:new It({color:12239550,map:xr,roughnessMap:_r,roughness:.35,metalness:.93,bumpMap:_r,bumpScale:.003}),gold:new It({color:12427627,map:xr,roughness:.29,metalness:.88,bumpMap:_r,bumpScale:.003}),bronze:new It({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new Os({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:Ha,bumpScale:4e-4}),blue:new Os({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new Os({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new It({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new Os({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new It({color:14799534,map:Gf,roughness:.96,bumpMap:Ha,bumpScale:.006,side:Oe}),red:new It({color:7152936,map:mu,roughness:.82,bumpMap:mu,bumpScale:.009}),rust:new It({map:bx,roughness:.92,metalness:.08,bumpMap:Ha,bumpScale:.022}),rubber:new It({color:1383192,roughness:.88,bumpMap:cc,bumpScale:.008}),copper:new It({color:12089158,map:xr,roughness:.37,metalness:.9})},rl=new Map;let Xf=[];function Va(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(rl.has(n))return rl.get(n);let s;Xf.push(new Promise(a=>s=a));const r=new Lf().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?Sn:qe,r.wrapS=r.wrapT=zi,r.repeat.set(...t),r.anisotropy=8,rl.set(n,r),r}function wx(){return Promise.all(Xf)}function gu(i,t=[1,1]){return{map:Va(`${i}.jpg`,{repeat:t}),normalMap:Va(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:Va(`${i}-roughness.png`,{repeat:t,data:!0})}}function qf(){return fe((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const Ga={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Tx extends er{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof cn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ss.clone(t.uniforms),this.material=new cn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Gc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class vu extends er{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Ex extends er{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Ax{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ct);this._width=n.width,this._height=n.height,e=new wn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ci}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Tx(Ga),this.copyPass.material.blending=ln,this.clock=new Ip}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}vu!==void 0&&(a instanceof vu?n=!0:a instanceof Ex&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ct);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Rx extends er{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Gt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class Cx{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,f=(l+c)*h,m=l-f,u=c-f,p=t-m,g=e-u;let v,d;p>g?(v=1,d=0):(v=0,d=1);const x=p-v+h,_=g-d+h,y=p-1+2*h,w=g-1+2*h,b=l&255,A=c&255,T=this.perm[b+this.perm[A]]%12,S=this.perm[b+v+this.perm[A+d]]%12,M=this.perm[b+1+this.perm[A+1]]%12;let R=.5-p*p-g*g;R<0?n=0:(R*=R,n=R*R*this._dot(this.grad3[T],p,g));let L=.5-x*x-_*_;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[S],x,_));let P=.5-y*y-w*w;return P<0?r=0:(P*=P,r=P*P*this._dot(this.grad3[M],y,w)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),f=Math.floor(e+c),m=Math.floor(n+c),u=1/6,p=(h+f+m)*u,g=h-p,v=f-p,d=m-p,x=t-g,_=e-v,y=n-d;let w,b,A,T,S,M;x>=_?_>=y?(w=1,b=0,A=0,T=1,S=1,M=0):x>=y?(w=1,b=0,A=0,T=1,S=0,M=1):(w=0,b=0,A=1,T=1,S=0,M=1):_<y?(w=0,b=0,A=1,T=0,S=1,M=1):x<y?(w=0,b=1,A=0,T=0,S=1,M=1):(w=0,b=1,A=0,T=1,S=1,M=0);const R=x-w+u,L=_-b+u,P=y-A+u,F=x-T+2*u,O=_-S+2*u,z=y-M+2*u,q=x-1+3*u,V=_-1+3*u,K=y-1+3*u,st=h&255,ut=f&255,Rt=m&255,Dt=this.perm[st+this.perm[ut+this.perm[Rt]]]%12,zt=this.perm[st+w+this.perm[ut+b+this.perm[Rt+A]]]%12,Wt=this.perm[st+T+this.perm[ut+S+this.perm[Rt+M]]]%12,j=this.perm[st+1+this.perm[ut+1+this.perm[Rt+1]]]%12;let et=.6-x*x-_*_-y*y;et<0?s=0:(et*=et,s=et*et*this._dot3(this.grad3[Dt],x,_,y));let vt=.6-R*R-L*L-P*P;vt<0?r=0:(vt*=vt,r=vt*vt*this._dot3(this.grad3[zt],R,L,P));let wt=.6-F*F-O*O-z*z;wt<0?a=0:(wt*=wt,a=wt*wt*this._dot3(this.grad3[Wt],F,O,z));let yt=.6-q*q-V*V-K*K;return yt<0?o=0:(yt*=yt,o=yt*yt*this._dot3(this.grad3[j],q,V,K)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,f,m,u,p;const g=(t+e+n+s)*l,v=Math.floor(t+g),d=Math.floor(e+g),x=Math.floor(n+g),_=Math.floor(s+g),y=(v+d+x+_)*c,w=v-y,b=d-y,A=x-y,T=_-y,S=t-w,M=e-b,R=n-A,L=s-T,P=S>M?32:0,F=S>R?16:0,O=M>R?8:0,z=S>L?4:0,q=M>L?2:0,V=R>L?1:0,K=P+F+O+z+q+V,st=a[K][0]>=3?1:0,ut=a[K][1]>=3?1:0,Rt=a[K][2]>=3?1:0,Dt=a[K][3]>=3?1:0,zt=a[K][0]>=2?1:0,Wt=a[K][1]>=2?1:0,j=a[K][2]>=2?1:0,et=a[K][3]>=2?1:0,vt=a[K][0]>=1?1:0,wt=a[K][1]>=1?1:0,yt=a[K][2]>=1?1:0,Yt=a[K][3]>=1?1:0,Nt=S-st+c,N=M-ut+c,rt=R-Rt+c,nt=L-Dt+c,it=S-zt+2*c,tt=M-Wt+2*c,dt=R-j+2*c,at=L-et+2*c,mt=S-vt+3*c,$t=M-wt+3*c,qt=R-yt+3*c,I=L-Yt+3*c,E=S-1+4*c,H=M-1+4*c,X=R-1+4*c,Q=L-1+4*c,Y=v&255,St=d&255,ht=x&255,bt=_&255,Tt=o[Y+o[St+o[ht+o[bt]]]]%32,ft=o[Y+st+o[St+ut+o[ht+Rt+o[bt+Dt]]]]%32,Et=o[Y+zt+o[St+Wt+o[ht+j+o[bt+et]]]]%32,Xt=o[Y+vt+o[St+wt+o[ht+yt+o[bt+Yt]]]]%32,kt=o[Y+1+o[St+1+o[ht+1+o[bt+1]]]]%32;let Mt=.6-S*S-M*M-R*R-L*L;Mt<0?h=0:(Mt*=Mt,h=Mt*Mt*this._dot4(r[Tt],S,M,R,L));let Jt=.6-Nt*Nt-N*N-rt*rt-nt*nt;Jt<0?f=0:(Jt*=Jt,f=Jt*Jt*this._dot4(r[ft],Nt,N,rt,nt));let B=.6-it*it-tt*tt-dt*dt-at*at;B<0?m=0:(B*=B,m=B*B*this._dot4(r[Et],it,tt,dt,at));let pt=.6-mt*mt-$t*$t-qt*qt-I*I;pt<0?u=0:(pt*=pt,u=pt*pt*this._dot4(r[Xt],mt,$t,qt,I));let _t=.6-E*E-H*H-X*X-Q*Q;return _t<0?p=0:(_t*=_t,p=_t*_t*this._dot4(r[kt],E,H,X,Q)),27*(h+f+m+u+p)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const wa={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new ct},cameraProjectionMatrix:{value:new ue},cameraInverseProjectionMatrix:{value:new ue},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

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

		}`},Ta={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

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

		}`},Ea={uniforms:{tDiffuse:{value:null},resolution:{value:new ct}},vertexShader:`varying vec2 vUv;

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

		}`};class Di extends er{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new Fc;a.format=qs,a.type=Xs,this.normalRenderTarget=new wn(this.width,this.height,{minFilter:hn,magFilter:hn,type:ci,depthTexture:a}),this.ssaoRenderTarget=new wn(this.width,this.height,{type:ci}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new cn({defines:Object.assign({},wa.defines),uniforms:ss.clone(wa.uniforms),vertexShader:wa.vertexShader,fragmentShader:wa.fragmentShader,blending:ln}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new Mp,this.normalMaterial.blending=ln,this.blurMaterial=new cn({defines:Object.assign({},Ea.defines),uniforms:ss.clone(Ea.uniforms),vertexShader:Ea.vertexShader,fragmentShader:Ea.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new cn({defines:Object.assign({},Ta.defines),uniforms:ss.clone(Ta.uniforms),vertexShader:Ta.vertexShader,fragmentShader:Ta.fragmentShader,blending:ln}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new cn({uniforms:ss.clone(Ga.uniforms),vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:$u,blendDst:ul,blendEquation:yi,blendSrcAlpha:Yu,blendDstAlpha:ul,blendEquationAlpha:yi}),this._fsQuad=new Gc(null),this._originalClearColor=new Gt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case Di.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=ln,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Di.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=ln,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Di.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case Di.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=ln,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Di.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=qu,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new U;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=be.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new Cx,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new yf(r,4,4,ao,qn),this.noiseTexture.wrapS=zi,this.noiseTexture.wrapT=zi,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}Di.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class Px extends Di{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class Ix{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new wn(1,1,{type:ci,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new Ax(t,r),this.composer.addPass(new Rx(e,n)),this.ao=new Px(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new Hf),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function Lx(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const pr=new U;function Rn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;pr.copy(t),pr[n]=0,pr.normalize();const c=.5*a/(a+o),h=1-pr.angleTo(i)/l;return Math.sign(pr[e])===1?h*c:o/(a+o)+c+c*(1-h)}class Wc extends tn{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new U,c=new U,h=new U(t,e,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,m=this.attributes.normal.array,u=this.attributes.uv.array,p=f.length/6,g=new U,v=.5/a;for(let d=0,x=0;d<f.length;d+=3,x+=2)switch(l.fromArray(f,d),c.copy(l),c.x-=Math.sign(c.x)*v,c.y-=Math.sign(c.y)*v,c.z-=Math.sign(c.z)*v,c.normalize(),f[d+0]=h.x*Math.sign(l.x)+c.x*r,f[d+1]=h.y*Math.sign(l.y)+c.y*r,f[d+2]=h.z*Math.sign(l.z)+c.z*r,m[d+0]=c.x,m[d+1]=c.y,m[d+2]=c.z,Math.floor(d/p)){case 0:g.set(1,0,0),u[x+0]=Rn(g,c,"z","y",r,n),u[x+1]=1-Rn(g,c,"y","z",r,e);break;case 1:g.set(-1,0,0),u[x+0]=1-Rn(g,c,"z","y",r,n),u[x+1]=1-Rn(g,c,"y","z",r,e);break;case 2:g.set(0,1,0),u[x+0]=1-Rn(g,c,"x","z",r,t),u[x+1]=Rn(g,c,"z","x",r,n);break;case 3:g.set(0,-1,0),u[x+0]=1-Rn(g,c,"x","z",r,t),u[x+1]=1-Rn(g,c,"z","x",r,n);break;case 4:g.set(0,0,1),u[x+0]=1-Rn(g,c,"x","y",r,t),u[x+1]=1-Rn(g,c,"y","x",r,e);break;case 5:g.set(0,0,-1),u[x+0]=Rn(g,c,"x","y",r,t),u[x+1]=1-Rn(g,c,"y","x",r,e);break}}static fromJSON(t){return new Wc(t.width,t.height,t.depth,t.segments,t.radius)}}class Dx extends Vt{constructor(t,e,n=!1,s=!1,r=1e4){const a=new Ie;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(x){this.resolution=x,this.isolation=80,this.size=x,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const _=r*3;this.positionArray=new Float32Array(_*3);const y=new Be(this.positionArray,3);y.setUsage(qr),a.setAttribute("position",y),this.normalArray=new Float32Array(_*3);const w=new Be(this.normalArray,3);if(w.setUsage(qr),a.setAttribute("normal",w),this.enableUvs){this.uvArray=new Float32Array(_*2);const b=new Be(this.uvArray,2);b.setUsage(qr),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(_*3);const b=new Be(this.colorArray,3);b.setUsage(qr),a.setAttribute("color",b)}a.boundingSphere=new us(new U,1)};function f(x,_,y){return x+(_-x)*y}function m(x,_,y,w,b,A,T,S,M,R){const L=(y-T)/(S-T),P=o.normal_cache;l[_+0]=w+L*o.delta,l[_+1]=b,l[_+2]=A,c[_+0]=f(P[x+0],P[x+3],L),c[_+1]=f(P[x+1],P[x+4],L),c[_+2]=f(P[x+2],P[x+5],L),h[_+0]=f(o.palette[M*3+0],o.palette[R*3+0],L),h[_+1]=f(o.palette[M*3+1],o.palette[R*3+1],L),h[_+2]=f(o.palette[M*3+2],o.palette[R*3+2],L)}function u(x,_,y,w,b,A,T,S,M,R){const L=(y-T)/(S-T),P=o.normal_cache;l[_+0]=w,l[_+1]=b+L*o.delta,l[_+2]=A;const F=x+o.yd*3;c[_+0]=f(P[x+0],P[F+0],L),c[_+1]=f(P[x+1],P[F+1],L),c[_+2]=f(P[x+2],P[F+2],L),h[_+0]=f(o.palette[M*3+0],o.palette[R*3+0],L),h[_+1]=f(o.palette[M*3+1],o.palette[R*3+1],L),h[_+2]=f(o.palette[M*3+2],o.palette[R*3+2],L)}function p(x,_,y,w,b,A,T,S,M,R){const L=(y-T)/(S-T),P=o.normal_cache;l[_+0]=w,l[_+1]=b,l[_+2]=A+L*o.delta;const F=x+o.zd*3;c[_+0]=f(P[x+0],P[F+0],L),c[_+1]=f(P[x+1],P[F+1],L),c[_+2]=f(P[x+2],P[F+2],L),h[_+0]=f(o.palette[M*3+0],o.palette[R*3+0],L),h[_+1]=f(o.palette[M*3+1],o.palette[R*3+1],L),h[_+2]=f(o.palette[M*3+2],o.palette[R*3+2],L)}function g(x){const _=x*3;o.normal_cache[_]===0&&(o.normal_cache[_+0]=o.field[x-1]-o.field[x+1],o.normal_cache[_+1]=o.field[x-o.yd]-o.field[x+o.yd],o.normal_cache[_+2]=o.field[x-o.zd]-o.field[x+o.zd])}function v(x,_,y,w,b){const A=w+1,T=w+o.yd,S=w+o.zd,M=A+o.yd,R=A+o.zd,L=w+o.yd+o.zd,P=A+o.yd+o.zd;let F=0;const O=o.field[w],z=o.field[A],q=o.field[T],V=o.field[M],K=o.field[S],st=o.field[R],ut=o.field[L],Rt=o.field[P];O<b&&(F|=1),z<b&&(F|=2),q<b&&(F|=8),V<b&&(F|=4),K<b&&(F|=16),st<b&&(F|=32),ut<b&&(F|=128),Rt<b&&(F|=64);const Dt=Ux[F];if(Dt===0)return 0;const zt=o.delta,Wt=x+zt,j=_+zt,et=y+zt;Dt&1&&(g(w),g(A),m(w*3,0,b,x,_,y,O,z,w,A)),Dt&2&&(g(A),g(M),u(A*3,3,b,Wt,_,y,z,V,A,M)),Dt&4&&(g(T),g(M),m(T*3,6,b,x,j,y,q,V,T,M)),Dt&8&&(g(w),g(T),u(w*3,9,b,x,_,y,O,q,w,T)),Dt&16&&(g(S),g(R),m(S*3,12,b,x,_,et,K,st,S,R)),Dt&32&&(g(R),g(P),u(R*3,15,b,Wt,_,et,st,Rt,R,P)),Dt&64&&(g(L),g(P),m(L*3,18,b,x,j,et,ut,Rt,L,P)),Dt&128&&(g(S),g(L),u(S*3,21,b,x,_,et,K,ut,S,L)),Dt&256&&(g(w),g(S),p(w*3,24,b,x,_,y,O,K,w,S)),Dt&512&&(g(A),g(R),p(A*3,27,b,Wt,_,y,z,st,A,R)),Dt&1024&&(g(M),g(P),p(M*3,30,b,Wt,j,y,V,Rt,M,P)),Dt&2048&&(g(T),g(L),p(T*3,33,b,x,j,y,q,ut,T,L)),F<<=4;let vt,wt,yt,Yt=0,Nt=0;for(;Aa[F+Nt]!=-1;)vt=F+Nt,wt=vt+1,yt=vt+2,d(l,c,h,3*Aa[vt],3*Aa[wt],3*Aa[yt]),Nt+=3,Yt++;return Yt}function d(x,_,y,w,b,A){const T=o.count*3;if(o.positionArray[T+0]=x[w],o.positionArray[T+1]=x[w+1],o.positionArray[T+2]=x[w+2],o.positionArray[T+3]=x[b],o.positionArray[T+4]=x[b+1],o.positionArray[T+5]=x[b+2],o.positionArray[T+6]=x[A],o.positionArray[T+7]=x[A+1],o.positionArray[T+8]=x[A+2],o.material.flatShading===!0){const S=(_[w+0]+_[b+0]+_[A+0])/3,M=(_[w+1]+_[b+1]+_[A+1])/3,R=(_[w+2]+_[b+2]+_[A+2])/3;o.normalArray[T+0]=S,o.normalArray[T+1]=M,o.normalArray[T+2]=R,o.normalArray[T+3]=S,o.normalArray[T+4]=M,o.normalArray[T+5]=R,o.normalArray[T+6]=S,o.normalArray[T+7]=M,o.normalArray[T+8]=R}else o.normalArray[T+0]=_[w+0],o.normalArray[T+1]=_[w+1],o.normalArray[T+2]=_[w+2],o.normalArray[T+3]=_[b+0],o.normalArray[T+4]=_[b+1],o.normalArray[T+5]=_[b+2],o.normalArray[T+6]=_[A+0],o.normalArray[T+7]=_[A+1],o.normalArray[T+8]=_[A+2];if(o.enableUvs){const S=o.count*2;o.uvArray[S+0]=x[w+0],o.uvArray[S+1]=x[w+2],o.uvArray[S+2]=x[b+0],o.uvArray[S+3]=x[b+2],o.uvArray[S+4]=x[A+0],o.uvArray[S+5]=x[A+2]}o.enableColors&&(o.colorArray[T+0]=y[w+0],o.colorArray[T+1]=y[w+1],o.colorArray[T+2]=y[w+2],o.colorArray[T+3]=y[b+0],o.colorArray[T+4]=y[b+1],o.colorArray[T+5]=y[b+2],o.colorArray[T+6]=y[A+0],o.colorArray[T+7]=y[A+1],o.colorArray[T+8]=y[A+2]),o.count+=3}this.addBall=function(x,_,y,w,b,A){const T=Math.sign(w);w=Math.abs(w);const S=A!=null;let M=new Gt(x,_,y);if(S)try{M=A instanceof Gt?A:Array.isArray(A)?new Gt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Gt(A)}catch{M=new Gt(x,_,y)}const R=this.size*Math.sqrt(w/b),L=y*this.size,P=_*this.size,F=x*this.size;let O=Math.floor(L-R);O<1&&(O=1);let z=Math.floor(L+R);z>this.size-1&&(z=this.size-1);let q=Math.floor(P-R);q<1&&(q=1);let V=Math.floor(P+R);V>this.size-1&&(V=this.size-1);let K=Math.floor(F-R);K<1&&(K=1);let st=Math.floor(F+R);st>this.size-1&&(st=this.size-1);let ut,Rt,Dt,zt,Wt,j,et,vt,wt,yt,Yt;for(Dt=O;Dt<z;Dt++)for(Wt=this.size2*Dt,vt=Dt/this.size-y,wt=vt*vt,Rt=q;Rt<V;Rt++)for(zt=Wt+this.size*Rt,et=Rt/this.size-_,yt=et*et,ut=K;ut<st;ut++)if(j=ut/this.size-x,Yt=w/(1e-6+j*j+yt+wt)-b,Yt>0){this.field[zt+ut]+=Yt*T;const Nt=Math.sqrt((ut-F)*(ut-F)+(Rt-P)*(Rt-P)+(Dt-L)*(Dt-L))/R,N=1-Nt*Nt*Nt*(Nt*(Nt*6-15)+10);this.palette[(zt+ut)*3+0]+=M.r*N,this.palette[(zt+ut)*3+1]+=M.g*N,this.palette[(zt+ut)*3+2]+=M.b*N}},this.addPlaneX=function(x,_){const y=this.size,w=this.yd,b=this.zd,A=this.field;let T,S,M,R,L,P,F,O=y*Math.sqrt(x/_);for(O>y&&(O=y),T=0;T<O;T++)if(P=T/y,R=P*P,L=x/(1e-4+R)-_,L>0)for(S=0;S<y;S++)for(F=T+S*w,M=0;M<y;M++)A[b*M+F]+=L},this.addPlaneY=function(x,_){const y=this.size,w=this.yd,b=this.zd,A=this.field;let T,S,M,R,L,P,F,O,z=y*Math.sqrt(x/_);for(z>y&&(z=y),S=0;S<z;S++)if(P=S/y,R=P*P,L=x/(1e-4+R)-_,L>0)for(F=S*w,T=0;T<y;T++)for(O=F+T,M=0;M<y;M++)A[b*M+O]+=L},this.addPlaneZ=function(x,_){const y=this.size,w=this.yd,b=this.zd,A=this.field;let T,S,M,R,L,P,F,O,z=y*Math.sqrt(x/_);for(z>y&&(z=y),M=0;M<z;M++)if(P=M/y,R=P*P,L=x/(1e-4+R)-_,L>0)for(F=b*M,S=0;S<y;S++)for(O=F+S*w,T=0;T<y;T++)A[O+T]+=L},this.setCell=function(x,_,y,w){const b=this.size2*y+this.size*_+x;this.field[b]=w},this.getCell=function(x,_,y){const w=this.size2*y+this.size*_+x;return this.field[w]},this.blur=function(x=1){const _=this.field,y=_.slice(),w=this.size,b=this.size2;for(let A=0;A<w;A++)for(let T=0;T<w;T++)for(let S=0;S<w;S++){const M=b*S+w*T+A;let R=y[M],L=1;for(let P=-1;P<=1;P+=2){const F=P+A;if(!(F<0||F>=w))for(let O=-1;O<=1;O+=2){const z=O+T;if(!(z<0||z>=w))for(let q=-1;q<=1;q+=2){const V=q+S;if(V<0||V>=w)continue;const K=b*V+w*z+F,st=y[K];L++,R+=x*(st-R)/L}}}_[M]=R}},this.reset=function(){for(let x=0;x<this.size3;x++)this.normal_cache[x*3]=0,this.field[x]=0,this.palette[x*3]=this.palette[x*3+1]=this.palette[x*3+2]=0},this.update=function(){this.count=0;const x=this.size-2;for(let _=1;_<x;_++){const y=this.size2*_,w=(_-this.halfsize)/this.halfsize;for(let b=1;b<x;b++){const A=y+this.size*b,T=(b-this.halfsize)/this.halfsize;for(let S=1;S<x;S++){const M=(S-this.halfsize)/this.halfsize,R=A+S;v(M,T,w,R,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Ux=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Aa=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function Yf(i,t,e=44){const n=new Dx(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,f=a/e*2-1;let m=10;for(const[u,p,g,v,d,x,_=0]of i){const y=Math.cos(_),w=Math.sin(_),b=c-u,A=h-p,T=f-g,S=y*b+w*A,M=-w*b+y*A,R=Math.hypot(S/v,M/d,T/x),L=Math.hypot(S/(v*v),M/(d*d),T/(x*x)),P=L>1e-6?R*(R-1)/L:-Math.min(v,d,x),F=.085,O=Math.max(F-Math.abs(m-P),0)/F;m=Math.min(m,P)-O*O*O*F/6}n.field[a*e*e+o*e+l]=-m}n.update();const s=n.geometry.drawRange.count,r=new Ie;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Be(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const Ze=Math.PI*2;let Xc=1;function xu(i){Xc=Math.max(.24,Math.min(1,i))||1}const zr=(i,t=4)=>Math.max(t,Math.round(i*Xc));function Pt(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new Vt(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function k(i,t,e,n=D.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return Pt(s?new Wc(...t,Xc<.8?1:2,a):new tn(...t),n,i,e,r)}function Ut(i,t,e,n,s,r=D.silver,a=[Math.PI/2,0,0],o=48){return Pt(new Ce(t,e,n,zr(o,6)),r,i,s,a)}function Fi(i,t,e,n=D.cream){const s=Pt(new ke(1,zr(32,8),zr(24,6)),n,i,e);return s.scale.set(...t),s}function Se(i,t,e,n,s=D.gold,r=[0,0,0],a=Ze){return Pt(new Js(t,e,zr(8,4),zr(64,8),a),s,i,n,r)}function Ln(i,t,e,n=D.gold,s=30){return Pt(new ri(new os(t.map(r=>new U(...r))),s,e,8,!1),n,i)}function cs(i,t,e,n=[0,0,0],s=64){return Pt(new ho(t.map(r=>new ct(...r)),s),e,i,n)}function Ka(i,t,e,n,s=.022,r=D.silver){Ut(i,s,s,s*.35,[t,e,n],r,void 0,16),k(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],D.black,.001,[0,0,(t+e)*7])}function Zn(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=fe((c,h,f)=>s(c,h,o,f),768,o);return Pt(new he(t,e),new It({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function We(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return Zn(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function mo(i,t,e,n){const s=fe((r,a,o)=>n(r,a,o),1024);return Pt(new ki(t,80),new Ye({map:s,toneMapped:!1}),i,[0,0,e])}function qc(i,t,e,n,s=D.clear){const r=Pt(new ke(1,48,20,0,Ze,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function ja(i,t,e,n,s=48,r=D.silver,a="z"){for(let o=0;o<s;o++){const l=o*Ze/s;a==="z"?k(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):k(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function Ks(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return Pt(new lo(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function _u(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function Nx(i){k(i,[1.65,.92,.49],[0,0,0],D.black,.07),k(i,[1.57,.81,.016],[0,-.015,.253],D.leather,.024),k(i,[1.63,.245,.52],[0,.448,0],D.silver,.035),k(i,[1.63,.105,.51],[0,-.48,0],D.silver,.02),k(i,[1.57,.77,.018],[0,-.015,-.257],D.leather,.025),k(i,[1.62,.82,.035],[0,-.015,-.256],D.black,.035),k(i,[1.49,.7,.02],[0,-.01,-.282],D.leather,.023),We(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),We(i,"8М",.18,.1,[-.55,-.11,.269]),We(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),We(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new se;t.position.set(.12,-.045,0),i.add(t),Ut(t,.36,.39,.18,[0,0,.34],D.black),Ut(t,.325,.345,.13,[0,0,.466],D.silver),Ut(t,.293,.293,.21,[0,0,.575],D.black),ja(t,.296,.12,[0,0,.56],56,D.rubber),Se(t,.29,.012,[0,0,.682],D.silver),Ut(t,.272,.272,.025,[0,0,.688],D.black),mo(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),_u(n,"ТРИПЛЕТ 43 • 4/40",420),_u(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),Ut(t,.204,.204,.025,[0,0,.717],D.black);for(let n=0;n<7;n++){const s=n*Ze/7,r=new wi;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),Pt(new uo(r),D.rubber,t,[0,0,.733],[0,0,s])}Ut(t,.082,.082,.006,[0,0,.74],D.black),qc(t,.196,.028,[0,0,.748],D.clear),Se(t,.204,.006,[0,0,.736],D.silver),Zn(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),k(i,[.292,.177,.047],[-.49,.444,.282],D.black,.025),k(i,[.2,.105,.016],[-.49,.444,.309],D.lens,.009),k(i,[.21,.13,.035],[-.49,.447,-.28],D.black,.012),k(i,[.155,.08,.012],[-.49,.447,-.305],D.lens,.005);for(const n of[-.7,.72])Ka(i,n,.452,.269,.021);for(const n of[-.65,.65])Ka(i,n,-.32,-.3,.018);Ut(i,.161,.17,.105,[-.53,.625,0],D.silver,[0,0,0]),ja(i,.161,.067,[-.53,.63,0],38,D.silver,"y"),Ut(i,.11,.12,.072,[.53,.603,0],D.black,[0,0,0]),Ut(i,.059,.065,.075,[.53,.67,0],D.silver,[0,0,0]),k(i,[.27,.024,.23],[.02,.584,0],D.black,.006);for(const n of[-.14,.14])k(i,[.035,.04,.25],[n,.6,0],D.silver,.007);Ut(i,.036,.036,.015,[0,-.535,0],D.gold,[0,0,0]);for(const n of[-.79,.79])Se(i,.055,.012,[n,.14,0],D.silver,[0,Math.PI/2,0]);const e=Ln(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,D.leather,50);e.scale.z=.4}function Fx(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];cs(i,t,D.cream),Se(i,.531,.007,[0,.377,0],D.gold,[Math.PI/2,0,0]),Se(i,.272,.006,[0,-.489,0],D.gold,[Math.PI/2,0,0]),Ln(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,D.cream),Ln(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,D.gold);const e=fe((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,Ze),s.fill()},1024),n=new It({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});cs(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),We(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function Ox(i){const t=new It({map:D.leather.map,color:7754307,roughness:.84,bumpMap:D.leather.bumpMap,bumpScale:.01});k(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)k(i,[.008,.023,.004],[s,r,.001],D.paper,.001);for(let s=-.99;s<-.46;s+=.105)Ut(i,.019,.019,.004,[0,s,.004],D.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])k(i,[.1,.18,.13],[r,s,.035],D.silver,.023,[0,0,r*s]);Ut(i,.415,.438,.135,[0,0,.066],D.silver),Se(i,.394,.027,[0,0,.143],D.silver),mo(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*Ze/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*Ze/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),un(s,r,r,a,1700)}),k(i,[.019,.244,.009],[-.038,.102,.18],D.black,.003,[0,0,.36]),k(i,[.012,.31,.008],[.105,.067,.19],D.black,.002,[0,0,-1]),k(i,[.004,.45,.003],[-.09,-.012,.201],D.copper,.001,[0,0,1.71]),Ut(i,.018,.02,.015,[0,0,.205],D.gold),qc(i,.371,.018,[0,0,.211]),Ut(i,.056,.057,.1,[.468,0,.04],D.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*Ze/18;k(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],D.silver,.001,[r,0,0])}const e=new wi;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new $a;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),Ks(i,e,.025,D.silver,[0,1,.02]),k(i,[.02,.23,.018],[0,1,.065],D.silver,.003),Ut(i,.392,.392,.02,[0,0,-.104],D.silver),We(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),We(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;Ka(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new U().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function zx(i){k(i,[1.6,1,.166],[0,0,0],D.black,.07),k(i,[1.46,.77,.026],[0,.075,.092],D.rubber,.04),Zn(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),un(t,e,n,s,1200)}),k(i,[1.07,.276,.012],[0,-.044,.121],D.black,.04);for(const t of[-.405,.405]){Ut(i,.176,.176,.018,[t,-.038,.132],D.rust),Ut(i,.112,.112,.023,[t,-.038,.146],D.paper),Ut(i,.063,.063,.027,[t,-.038,.152],D.black);for(let e=0;e<6;e++){const n=e*Ze/6;k(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],D.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])Se(i,e,.002,[t,-.038,.147],D.black)}for(let t=-.2;t<.23;t+=.043)k(i,[.012,.08,.008],[t,-.04,.137],D.silver,.001);k(i,[1.16,.205,.035],[0,-.374,.105],D.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])Ka(i,t,e,.098,.024);for(const t of[-.44,.44])Ut(i,.049,.049,.008,[t,-.389,.131],D.rubber);for(let t=0;t<20;t++)k(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],D.leather,.001);Zn(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);un(t,e,n,s,800)},[0,Math.PI,0])}function kx(i){Pt(Yf([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],D.cream,44),D.cream,i);for(const e of[-1,0,1]){const n=Fi(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],D.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new wi;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),Ks(i,t,.13,D.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){Fi(i,[.012,.014,.007],[.43,.405,e*.164],D.black),Ln(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,D.gold,30);for(let n=0;n<4;n++)Ln(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,D.gold,12)}Ut(i,.29,.32,.045,[-.04,-.415,0],D.cream,[0,0,0]),We(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function Bx(i){k(i,[1.02,1.48,.253],[.025,0,0],D.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;k(i,[1.02,.002,.001],[.025,.742,n],e%5?D.paper:D.rust,0),k(i,[.002,1.45,.001],[.537,0,n],e%4?D.paper:D.rust,0)}k(i,[1.15,1.58,.045],[0,0,.155],D.red,.015),k(i,[1.15,1.58,.045],[0,0,-.155],D.red,.015),k(i,[.095,1.57,.34],[-.56,0,0],D.red,.025),Zn(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),un(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])k(i,[.106,.015,.347],[-.556,e,0],D.red,.007);We(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new It({color:5724487,roughness:1});k(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),We(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function Hx(i){Se(i,.28,.055,[0,.41,0],D.gold),Se(i,.219,.012,[0,.41,.034],D.copper),Ut(i,.046,.048,.92,[0,-.29,0],D.gold,[0,0,0],32),k(i,[.25,.09,.1],[.092,-.745,0],D.gold,.012),k(i,[.09,.1,.105],[.171,-.64,0],D.gold,.007),k(i,[.065,.17,.095],[.037,-.7,0],D.gold,.009),Se(i,.34,.014,[0,.72,-.01],D.silver,[.23,0,.08]),Se(i,.331,.009,[0,.72,-.018],D.silver,[.23,0,.08]),k(i,[.24,.34,.037],[.37,.34,-.03],D.leather,.028,[0,0,-.22]),We(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),Se(i,.055,.012,[.33,.535,-.02],D.silver),We(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function Vx(i){const t=new wi;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),Ks(i,t,.055,D.gold,[0,0,-.03]);const e=t.clone();Ks(i,e,.009,D.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),Zn(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])Fi(i,[.014,.021,.002],[s,r,.044],D.gold);Ln(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,D.silver,14),Ut(i,.04,.04,.045,[-.23,.18,-.059],D.silver),We(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function Gx(i){Ut(i,.83,.83,.022,[0,0,0],D.black,void 0,96);const t=fe((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,Ze),s.stroke()},1024),e=fe((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,f=Math.hypot(c,h)||1,m=Math.sin(f*2.2)*.22,u=(o*r+l)*4;a.data[u]=128+127*m*c/f,a.data[u+1]=128+127*m*h/f,a.data[u+2]=253,a.data[u+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=Sn;const n=new It({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new ct(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){Pt(new ki(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new se;i.add(r),r.rotation.y=s===1?0:Math.PI,mo(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,Ze),a.stroke(),un(a,o,o,l,1500)}),Ut(r,.018,.018,.01,[0,0,.022],D.rubber)}}function Wx(i){const t=new Os({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=cs(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new Os({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});Ut(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),Ut(i,.11,.11,.16,[0,.49,0],D.gold,[0,0,0]),ja(i,.112,.1,[0,.49,0],28,D.gold,"y"),cs(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),Zn(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),un(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function Xx(i){k(i,[1.27,.08,.55],[0,-.72,0],D.bronze,.032),k(i,[1.35,.04,.61],[0,-.78,0],D.black,.02),Pt(Yf([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],D.bronze),D.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;Ln(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,D.bronze),Fi(i,[.051,.057,.04],[e+s,-.43,n],D.bronze),k(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],D.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=cs(i,[[0,0],[.041,0],[.034,.1],[0,.18]],D.bronze,[.333,.525,e],16);n.rotation.z=.15,Fi(i,[.015,.015,.008],[.457,.49,t*.127],D.black),Fi(i,[.012,.01,.006],[.648,.404,t*.083],D.black)}for(let t=0;t<12;t++)Ln(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,D.bronze,10);Ln(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,D.bronze);for(let t=0;t<5;t++)Ln(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,D.gold,14);Ln(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,D.gold,16),We(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function qx(i){Ut(i,.51,.53,.145,[0,0,0],D.gold),Se(i,.503,.018,[0,0,.075],D.gold),ja(i,.51,.072,[0,0,-.018],72,D.gold),mo(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*Ze/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*Ze/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),un(e,n,n,s,1800)});const t=new wi;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),Ks(i,t,.007,D.red,[0,0,.103],[0,0,-.38],.001),Ks(i,t,.007,D.silver,[0,0,.103],[0,0,Math.PI-.38],.001),Ut(i,.027,.027,.025,[0,0,.121],D.gold),qc(i,.468,.013,[0,0,.142]),Se(i,.109,.025,[0,.635,0],D.gold),Ut(i,.059,.065,.092,[0,.523,0],D.gold,[0,0,0]),Ut(i,.465,.465,.02,[0,0,-.086],D.gold),We(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),We(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function Yx(i){cs(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],D.glass);for(const n of[.817,.862])Se(i,.116,.009,[0,n,0],D.glass,[Math.PI/2,0,0]);const t=fe((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),un(n,s,a,r,2800)},768,460),e=new It({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:Oe});Pt(new Ce(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),We(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function $x(i){const t=D.silver.clone();t.roughness=.46,cs(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)Se(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);Ut(i,.404,.404,.015,[0,-.347,0],D.rust,[0,0,0]);const e=new se;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),Ut(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),Se(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),Se(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),k(e,[.067,.025,.11],[0,.028,.33],t,.015),Zn(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),un(n,s,r,a,2600)}),Zn(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),un(n,s,r,a,2400)},[0,Math.PI,0])}function Zx(i){const t=fe((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),un(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,Ze),r.fill()},768,768),e=new It({map:t,roughness:.98,side:Oe,bumpMap:D.paper.bumpMap,bumpScale:.009}),n=new Ce(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),f=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+f,o,l*h)}n.computeVertexNormals(),Pt(n,e,i),Se(i,.355,.016,[0,.44,0],D.paper,[Math.PI/2,0,0]),Ut(i,.232,.232,.015,[0,-.437,0],D.paper,[0,0,0]),Ut(i,.224,.224,.008,[0,-.421,0],D.rust,[0,0,0]),Ln(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,D.paper)}function Jx(i){const t=fe((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);un(s,r,r,a,3500)}),e=new It({map:t,roughness:.97,bumpMap:D.paper.bumpMap,bumpScale:.008,side:Oe});k(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])k(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])k(i,[.029,.75,.8],[s,-.065,0],e,.006);k(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),k(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),k(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),k(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)Ut(i,.005,.005,.027,[s,.319,.399],D.paper,[0,0,0],6);Zn(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);un(s,r,a,o,1200)}),Zn(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new It({color:11114860,roughness:.4,transparent:!0,opacity:.66});k(i,[.12,.74,.006],[.25,-.05,.421],n,.001),k(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function Kx(i){Ut(i,.507,.507,.036,[0,0,0],D.rust,void 0,80),Se(i,.504,.014,[0,0,.017],D.silver);for(const e of[.448,.408])Se(i,e,.009,[0,0,.024],D.rust);const t=ui(77);for(let e=0;e<9;e++){const n=t()*Ze,s=.465+t()*.015;Fi(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],D.silver)}for(let e=0;e<24;e++){const n=e*Ze/24;k(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],D.rust,.007,[0,0,-n])}We(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function jx(i){const t=fe((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),un(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,Ze),n.fill()},1024,1280),e=new It({map:t,roughness:1,side:Oe,bumpMap:D.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new he(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++)r.getX(a),r.getY(a),r.setZ(a,n*.004);s.computeVertexNormals(),Pt(s,e,i)}}const Qx={camera:Nx,teacup:Fx,watch:Ox,cassette:zx,duck:kx,book:Bx,key:Hx,badge:Vx,record:Gx,perfume:Wx,horse:Xx,compass:qx,bottle:Yx,can:$x,cup:Zx,box:Jx,lid:Kx,paper:jx};function t_(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===D.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new Gt("#977145"),c=new Gt("#355d53");for(let h=0;h<a.count;h++){const f=a.getX(h),m=a.getY(h),u=a.getZ(h),p=Math.sin(f*15+Math.sin(m*9))*Math.sin(m*19+u*12)*Math.cos(u*21-f*6),g=be.clamp((p+.12)*.85,0,.8);l.clone().lerp(c,g).toArray(o,h*3)}s.setAttribute("color",new Be(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=Vf(s,!1);Pt(r,n,i),s.forEach(a=>a.dispose())}return e}function al(i){const t=new se;Qx[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const f=new U().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);f.set(...Lx(i,f.x,f.y,f.z)).applyMatrix4(c),l.setXYZ(h,f.x,f.y,f.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=t_(t),n=new $n().setFromObject(t),s=n.getCenter(new U),r=n.getSize(new U);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new se;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const Ra=ui(370);function e_(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function Yc(i,t,e,n,s){const r=new he(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function Un(i,t,e,n,s=[1,1,1],r=1){const a=Pt(new co(t,r),n,i,e);return a.scale.set(...s),a}function Nn(i,t,e,n,s=[1,1,1],r=1){const a=Pt(new co(t,r),n,i,e);return a.scale.set(...s),a}function n_(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function go(i,t,e,n,s=24){return Pt(new ri(new os(t.map(r=>new U(...r))),s,e,5,!1),n,i)}function i_(){return fe((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(u,p,g,v,d)=>{i.fillStyle=d,i.fillRect(u,p,g,v)},c=(u,p,g,v,d)=>{i.fillStyle=d,i.beginPath(),i.ellipse(u,p,g,v,0,0,Math.PI*2),i.fill()},h=(u,p,g,v="rgba(255,198,106,")=>{const d=i.createRadialGradient(u,p,0,u,p,g);d.addColorStop(0,v+".62)"),d.addColorStop(1,v+"0)"),i.fillStyle=d,i.fillRect(u-g,p-g,g*2,g*2)},f=(u,p,g="#4b2d1e")=>{const v=i.createLinearGradient(0,0,0,r);v.addColorStop(0,u),v.addColorStop(1,p),i.fillStyle=v,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,g),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},m=(u,p)=>{i.save(),i.translate(u%4*s,Math.floor(u/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),p(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};m(0,()=>{f("#bd8745","#70452a"),l(16,58,122,316,"#382313");const u=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let p=0;p<5;p++){const g=78+p*58;l(22,g+38,110,6,"#20130b");let v=27;for(;v<124;){const d=5+e()*9;l(v,g+38-(24+e()*12),d,24+e()*12,u[Math.floor(e()*u.length)]),v+=d+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),m(1,()=>{f("#a8ad7d","#66704e","#40392a");for(let u=0;u<3;u++){const p=86+u*72;l(22,p,190,7,o);for(let g=0;g<6;g++){const v=34+g*31;l(v,p-(20+(g+u)%3*7),15,20+(g+u)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][g%4]),l(v+2,p-(27+(g+u)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const u of[62,112,168])i.beginPath(),i.moveTo(u,306),i.lineTo(u,326),i.stroke(),c(u,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),m(2,()=>{f("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),m(3,()=>{f("#8fae94","#55705e","#33473a");for(let u=0;u<3;u++){const p=120+u*104;l(18,p,220,8,"#2c2117");for(let g=0;g<4;g++){const v=42+g*54;l(v-13,p-25,26,25,"#8a5138");for(let d=0;d<6;d++){const x=-2.4+d*.45;c(v+Math.cos(x)*17,p-34+Math.sin(x)*19,11,5,d%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const u of[38,96,204]){i.beginPath(),i.moveTo(u,0),i.quadraticCurveTo(u+14,72,u-4,142),i.stroke();for(let p=0;p<6;p++)c(u+(p%2?9:-8),24+p*21,10,5,p%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),m(4,()=>{f("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const u of[48,112,190])l(u,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let u=0;u<4;u++)i.beginPath(),i.moveTo(100,292+u*6),i.lineTo(136,292+u*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),m(5,()=>{f("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let u=0;u<5;u++)l(26+u*15,410-u*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][u]);h(218,166,50)}),m(6,()=>{f("#8299a4","#4f6875","#31424b");const u=i.createLinearGradient(38,96,218,250);u.addColorStop(0,"#b9d5df"),u.addColorStop(.55,"#688b9c"),u.addColorStop(1,"#314f62"),i.fillStyle=u,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),m(7,()=>{f("#b49aa4","#76606d","#463945");for(let u=0;u<5;u++){l(24,78+u*8,70,4,"rgba(50,35,42,.45)");for(let p=0;p<4;p++)l(31+p*16,58+u*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][p])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function s_(){return fe((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,f,m="#2e342b",u="Georgia")=>{i.fillStyle=m,i.font=`bold ${f}px ${u}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const Qe={};function Jn(){if(Qe.stone)return Qe;Qe.stone=new It({color:7566439,roughness:.86,map:Va("plaster.jpg")}),Qe.iron=new It({color:2633768,metalness:.72,roughness:.6}),Qe.green=new It({color:4216121,roughness:.9,flatShading:!0,side:Oe}),Qe.shadowMap=fe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),Qe.contact=new Ye({map:Qe.shadowMap,transparent:!0,depthWrite:!1}),Qe.wood=new It({color:7427130,roughness:.92}),Qe.leafDark=new It({color:3099956,roughness:1,flatShading:!0}),Qe.poster=new It({map:s_(),roughness:.96}),Qe.bulb=new It({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=fe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);Qe.glow=new Ye({map:i,color:16757350,transparent:!0,opacity:.42,blending:Rr,depthWrite:!1,side:Oe});const t=fe((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);Qe.chalk=new Ye({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=fe((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return Qe.chess=new It({map:e,roughness:.8}),Qe}function r_(i,t,e=14,n=0){const s=new Ye({map:qf(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});Pt(new he(t,1.45),s,i,[0,.72,.342]);const r=fe((u,p,g)=>{u.fillStyle="#605d4c",u.fillRect(0,0,p,p);for(let v=0;v<12;v++)for(let d=-1;d<7;d++){const x=d*87+v%2*43,_=v*45;u.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(g()*4)],u.fillRect(x+3,_+3,81,39),u.fillStyle="rgba(28,29,21,.22)",u.fillRect(x+3,_+36,81,5)}u.globalCompositeOperation="destination-in",u.beginPath();for(let v=0;v<60;v++){const d=v*Math.PI/30,x=185+g()*60;u.lineTo(p/2+Math.cos(d)*x,p/2+Math.sin(d)*x*.7)}u.closePath(),u.fill()}),a=new It({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[u,p,g]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])Pt(new he(g*2,g),a,i,[u,p,.349]);const o=Jn();for(const[u,p,g]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])Pt(new he(.17,g),s,i,[u,p,.344]);let l=0;for(let u=-t/2+1.55;u<t/2-1.1;u+=2.85,l++){if(n===0&&Math.abs(u+3.8)<1.65)continue;const p=(l+n)%4===1;k(i,[.78,.48,.06],[u,.39,.425],p?Kf:D.black,0),k(i,[.9,.07,.09],[u,.665,.44],o.stone,0),k(i,[.9,.06,.1],[u,.125,.45],o.stone,0);for(const v of[-.24,0,.24])k(i,[.02,.44,.02],[u+v,.39,.47],D.black,0);const g=u+1.42;if(g<t/2-.7){k(i,[.34,.24,.035],[g,.92,.342],D.black,0);for(let v=0;v<3;v++)k(i,[.28,.025,.012],[g,.86+v*.07,.365],D.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;Pt(Yc(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=ui(910+n),f=[[-t/2+.58,0],[t/2-.58,2]];n===0&&f.push([-5.32,1]);for(const[u,p]of f)for(let g=0;g<30;g++){const v=.5+g*.17+h()*.09,d=u+Math.sin(g*.55+p)*.28+(h()-.5)*.2;Pt(new ki(.055+h()*.08,7),g%3?o.leafDark:o.green,i,[d,v,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const u of[-t*.3,t*.24])k(i,[.78,.98,.78],[u,e+.48,-.05],o.stone,0),k(i,[.94,.13,.94],[u,e+1.02,-.05],o.stone,0),Ut(i,.09,.11,.24,[u-.16,e+1.19,-.05],D.rust,[0,0,0],10),Ut(i,.09,.11,.24,[u+.16,e+1.19,-.05],D.rust,[0,0,0],10);for(const u of[-t*.12,t*.36])Ut(i,.018,.018,1.42,[u,e+.76,.18],D.black,[0,0,0],8),k(i,[.88,.025,.025],[u,e+1.12,.18],D.black,0),k(i,[.58,.025,.025],[u,e+1.36,.18],D.black,0),k(i,[.025,.025,.72],[u,e+1.24,.18],D.black,0);const m=t*.16;Pt(new Ce(.37,.09,.13,20),D.silver,i,[m,e-1.48,.56],[1.02,0,-.32]),go(i,[[m-.18,e-1.62,.34],[m,e-1.5,.58]],.016,D.black,4);for(let u=0;u<6;u++){if((u+n)%4===3)continue;const p=-t*.34+u*t*.13,g=e+.13;Un(i,.058,[p,g,.48],o.stone,[1.45,.82,.9],0),Nn(i,.032,[p+.065,g+.055,.49],D.black),k(i,[.11,.014,.035],[p-.085,g+.015,.47],D.black,0,[0,.2,.18])}}function $f(i,t,e,n,s,r,a,o){k(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),k(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])k(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),k(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);k(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],D.silver,0),k(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let Ca;function a_(){if(Ca)return Ca;const i=fe((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=i_(),e=fe((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return Ca={curtain:new It({map:i,roughness:1,side:Oe}),blind:new It({color:10067089,roughness:.9}),leaf:new It({color:4087359,roughness:1,flatShading:!0}),pot:new It({color:8414289,roughness:.94}),interior:new It({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new It({map:e,transparent:!0,alphaTest:.06,roughness:1,side:Oe})},Ca}function Zf(i,t,e=1,n=0,s=D.black){const r=new se;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),Un(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),Nn(r,.086,[0,.325,.13],s);for(const a of[-1,1])Pt(new Ce(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),Ut(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return go(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function Jf(i,t,e,n,s,r,a,o,l=0){const c=a_(),h=Jn(),f=e_(l+811),m=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),u=(p=.574)=>{for(const g of[-1,1]){const v=new he(n*.27,s*.91,5,6),d=v.attributes.position;for(let x=0;x<d.count;x++)d.setZ(x,.008*Math.sin(d.getX(x)*80));v.computeVertexNormals(),Pt(v,c.curtain,i,[t+g*n*.34,e-.025,p]),k(i,[.035,.09,.025],[t+g*n*.24,e-.08,p+.018],D.gold,0)}Pt(new he(n*.96,s*.17),c.lace,i,[t,e+s*.39,p+.004])};if(r==="lit")Pt(Yc(n*.97,s*.97,f%8,4,2),c.interior,i,[t,e,.566]),f%3===0&&u(.576),f%4===1&&(Ut(i,.006,.006,.34,[t+.18,e+s*.31,.59],D.black,[0,0,0],6),Ut(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),Nn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")u();else if(r==="blind"){for(let p=0;p<12;p++)k(i,[n*.94,.04,.019],[t,e+s/2-.08-p*.093,.581],c.blind,0,p>8?[.32,0,0]:[0,0,0]);for(const p of[-1,1])k(i,[.012,s*.68,.012],[t+p*n*.39,e+s*.08,.594],D.black,0);k(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const p=new se;p.position.set(t-n/2,e,.6),p.rotation.y=-.42,i.add(p),k(p,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const g of[0,n*.48])k(p,[.038,s*.94,.05],[g,0,.025],a,0);for(const g of[-s*.47,s*.47])k(p,[n*.5,.038,.05],[n*.24,g,.025],a,0);k(p,[n*.48,.032,.05],[n*.24,.23,.025],a,0),Ut(p,.014,.014,.1,[n*.45,-.05,.065],D.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&f%3===0){const p=t+(f%2?.29:-.29);Ut(i,.1,.075,.15,[p,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const g of[-1,0,1])Un(i,.07,[p+g*.055,e-s/2+.17,.79],g?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&f%5===0&&Zf(i,[t-.17,e-s/2-.015,.8],.58,0,D.black),m>0&&m<3){if(f%9===2){k(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let p=0;p<6;p++)Un(i,.07,[t-n*.31+p*n*.12,e-s/2+.17,.74],p%2?h.green:c.leaf,[1.2,.72,.8],0);for(let p=0;p<7;p++)Un(i,.022,[t-n*.33+p*n*.105,e-s/2+.21,.78],p%3?D.red:D.cream,[1,1,1],0)}else if(f%11===5){k(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),Pt(new Ce(.15,.15,.025,20),D.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const p of[-.1,0,.1])k(i,[.42,.018,.012],[t+.16,e-s/2-.39+p,.735],D.black,0);k(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],D.black,0)}else if(f%13===6)for(const p of[-1,1]){k(i,[.24,s*.9,.035],[t+p*(n/2+.18),e,.55],h.leafDark,0);for(let g=0;g<5;g++)k(i,[.18,.025,.014],[t+p*(n/2+.18),e-s*.3+g*s*.15,.575],D.black,0)}}if(m===0&&r!=="open"&&f%3===1){for(const p of[-.36,-.18,0,.18,.36])k(i,[.018,s*.85,.018],[t+p*n,e,.645],D.black,0);for(const p of[-s*.28,s*.28])k(i,[n*.84,.02,.02],[t,e+p,.65],D.black,0)}if(m>=2&&f%11===0){const p=t+n*.24,g=e-s/2+.025;Un(i,.055,[p,g,.76],h.stone,[1.45,.82,.9],0),Nn(i,.031,[p+.062,g+.052,.76],D.black),k(i,[.1,.013,.032],[p-.082,g+.012,.76],D.black,0,[0,.15,.16])}}function o_(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=Jn();Ut(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),Se(i,.56,.015,[2.5,.033,2.5],D.rust,[Math.PI/2,0,0]),Se(i,.62,.014,[2.5,.033,2.5],D.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;k(i,[h,.012,.018],[2.5,.04,2.5+c*.085],D.black,.003)}for(const c of[2.23,2.77])k(i,[.05,.01,.11],[c,.049,2.5],D.black,.005);for(const c of[-4.55,4.55]){k(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),Ut(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),Ut(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),Nn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new Za(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}k(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)k(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new os([new U(-6,5.3,-6.5),new U(-1,4.96,-6.47),new U(4.2,5.31,-6.46)]);Pt(new ri(o,24,.011,5),D.rubber,i);const l=fe((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[f,m]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(m,h/2,165+f*41);c.strokeStyle="#555b4d";for(let f=28;f<h;f+=43)c.beginPath(),c.moveTo(f,h-90),c.lineTo(f,h),c.stroke()});Pt(new he(.42,.56),new It({map:l,roughness:.95,side:Oe}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,f,m]of[...kf.map(u=>[u.x,u.z,u.scale*3.5,u.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])Pt(new he(f,m),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+Ra()*1.3,f=-6+Ra()*6,m=.03+Ra()*.13,u=new wi;u.moveTo(-.012,0),u.quadraticCurveTo(.014,m*.7,.025,m),u.lineTo(.006,0),Pt(new uo(u),s,i,[h,.025,f],[0,Ra()*6,0])}u_(i)}function yu(i,t,e){const n=Jn(),s=new se;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])k(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])k(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])k(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),k(s,[.055,.04,.56],[r*.84,.67,0],D.rust,0),k(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function Pa(i,t,e,n,s){const r=Jn(),a=new se,o=ui(s);a.position.set(...t),a.rotation.y=e,i.add(a),k(a,[n,.1,.78],[0,.05,0],D.rust,0);for(const c of[-1,1]){k(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),k(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)k(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,f=(o()-.5)*.42,m=c%3?r.leafDark:r.green;Un(a,.15+o()*.15,[h,.19+o()*.08,f],m,[1.45,.58,.95],0),Un(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,f+(o()-.5)*.18],m,[1.3,.62,.9],0),Un(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,f+(o()-.5)*.16],m,[1.2,.6,.9],0)}for(let c=0;c<18;c++)Un(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[D.red,D.cream,D.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)Pt(new Ce(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function l_(i,t,e,n,s=9){const r=Jn();go(i,n_(t,e,n,7),.007,D.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;k(i,[.006,.07,.006],[l,c-.035,h],D.black,0),Nn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function Ia(i,t,e,n,s){const r=Jn();k(i,[.07,.36,.13],[t,e,n],r.iron,.01),Ut(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),Ut(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),Nn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),Pt(new he(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function c_(i,t,e,n=1){const s=Jn(),r=new se;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),Un(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),Nn(r,.037,[0,.135,.085],D.black),Pt(new Ce(.001,.011,.038,5),D.gold,r,[0,.13,.128],[Math.PI/2,0,0]),k(r,[.075,.014,.1],[0,.075,-.105],D.black,0,[.22,0,0]);for(const a of[-1,1])k(r,[.008,.055,.008],[a*.025,.028,.01],D.rust,0);return r}function h_(i,t,e){const n=Jn(),s=new se;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])k(s,[1.08,.026,.105],[0,a+.055,o],r%2?D.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])k(s,[.1,.085,.1],[o,a,l],D.rust,0)}return k(s,[.58,.38,.48],[.05,.72,0],D.paper,.01,[0,.12,0]),s}function u_(i){const t=Jn();yu(i,[-5.45,0,-.75],Math.PI/2),yu(i,[5.7,0,-5.25],0),Pa(i,[-7.02,0,1.95],Math.PI/2,4.8,21),Pa(i,[8.02,0,1.75],Math.PI/2,4.3,33),Pa(i,[5.95,0,-6.08],0,3.5,47),Pa(i,[-6.35,0,-6.08],0,2.1,58),l_(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),Ia(i,-7.62,2.75,-4.9,1),Ia(i,-7.62,2.75,3.8,1),Ia(i,8.62,2.75,-4.9,-1),Ia(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;k(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),k(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}Ut(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),k(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),Pt(new he(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])Ut(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),Ut(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)Nn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?D.black:D.cream,[1,.75,1],0);h_(i,[-6.5,0,-4.9],.15);const e=new se;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),k(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])k(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],D.rust,0);Nn(e,.035,[.075,1.02,.34],D.silver);for(let a=0;a<3;a++)Pt(new Js(.34,.105,8,26),D.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);Pt(new Js(.34,.105,8,26),D.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new se;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),k(n,[.62,.58,1.72],[0,.58,0],D.leather,.18),k(n,[.54,.46,1],[0,1.02,-.12],D.leather,.19),k(n,[.5,.34,.46],[0,1.04,.58],D.leather,.16);for(const a of[-.42,.22])k(n,[.65,.018,.035],[0,.84,a],D.black,0);for(const a of[-.58,.58])Pt(new Ce(.29,.29,.09,20),D.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new se;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),k(s,[.1,.035,.6],[0,.1,0],D.red,.01);for(const a of[-.25,.25])Pt(new Ce(.075,.075,.035,14),D.black,s,[0,.075,a],[0,0,Math.PI/2]);go(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,D.silver,8),k(s,[.36,.025,.025],[0,.78,.4],D.black,0),Pt(new he(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),Nn(i,.16,[-4.72,.16,1.85],D.red,[1,.92,1]),Zf(i,[-4.32,0,-.22],1,1.49,D.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>c_(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)Un(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],D.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const f=Pt(new he(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);f.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])Pt(new he(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const Kf=new It({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function f_(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])Ut(i,.027,.027,.016,[o,l,.854],D.silver,void 0,8),k(i,[.016,.003,.005],[o,l,.866],D.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=Fi(i,[.013,.035,.007],[o*1.155,l,.827],D.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])k(i,[.21,.06,.3],[o,.42,.6],D.silver,.018),k(i,[.075,.025,.21],[o,.305,.81],D.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){k(t,[.2,.032,.2],[o,.114,.12],D.silver,.008);for(const l of[-.065,.065])Ut(t,.022,.022,.012,[o+l,.139,.12],D.silver,[0,0,0],8)}const n=new It({color:1055507,roughness:.94});k(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=fe((o,l,c)=>{for(let h=0;h<1800;h++){const f=c(),m=c();f>.1&&f<.9&&m<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(f*l,m*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const f=o.createLinearGradient(0,0,0,l);f.addColorStop(0,"rgba(67,42,24,0)"),f.addColorStop(.5,"rgba(67,42,24,.35)"),f.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=f,o.fillRect(h*l,0,6,l)}}),r=new It({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});Pt(new he(2.35,1.43),r,i,[0,1.18,.876]),Pt(new he(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])k(t,[.025,.006,.48],[o,.114,1.6],D.silver,.002);const a=fe((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});Pt(new he(.42,.37),new It({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const d_=new It({color:3883064,roughness:.82});function p_(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const f=Jn(),m=ui(c*7+13),u=1.55,p=2.55,g=u,v=p+g,d=new wi;d.moveTo(-t/2,0),d.lineTo(t/2,0),d.lineTo(t/2,e),d.lineTo(-t/2,e),d.closePath();const x=new $a;x.moveTo(h-u,0),x.lineTo(h-u,p),x.absarc(h,p,g,Math.PI,0,!0),x.lineTo(h+u,0),x.closePath(),d.holes.push(x),Pt(new lo(d,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[P,F]of[[-t/2,h-u-.12],[h+u+.12,t/2]])k(i,[F-P,.75,.78],[(P+F)/2,.375,.025],n,0);for(const P of[3.28,6.2,9.15])for(const[F,O]of[[-t/2,h-u-.12],[h+u+.12,t/2]]){const z=O-F;z<.5||(k(i,[z,.14,.87],[(F+O)/2,P,.055],s,0),k(i,[z,.07,.98],[(F+O)/2,P+.09,.08],n,0))}k(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const P of[-1,1])k(i,[.36,p+.05,.62],[h+P*(u+.18),p/2,.06],n,.02);const y=new Ur(0,0,g+.2,g+.2,0,Math.PI,!1,0).getPoints(30).map(P=>new U(P.x,P.y,0));Pt(new ri(new os(y),30,.17,7,!1),n,i,[h,p,.06]),k(i,[.26,.62,.72],[h,v+.16,.09],n,.02);for(let P=1;P<7;P++){const F=Math.PI*P/7,O=Math.cos(F)*(g+.2),z=Math.sin(F)*(g+.2);k(i,[.17,.3,.52],[h+O,p+z,.03],n,.012,[0,0,-F+Math.PI/2])}const w=new It({color:1909020,roughness:.96});k(i,[u*2+.6,.06,3.6],[h,0,-1.85],n,0),k(i,[.24,4.6,3.6],[h-u-.32,2.3,-1.85],w,0),k(i,[.24,4.6,3.6],[h+u+.32,2.3,-1.85],w,0),k(i,[3.4,.2,3.6],[h,v+.62,-1.85],n,0),k(i,[3.4,4.8,.12],[h,2.4,-3.7],w,0);const b=fe((P,F)=>{const O=P.createLinearGradient(0,0,0,F);O.addColorStop(0,"rgba(52,60,58,1)"),O.addColorStop(.42,"rgba(85,74,54,1)"),O.addColorStop(1,"rgba(34,38,34,1)"),P.fillStyle=O,P.fillRect(0,0,F,F);const z=P.createRadialGradient(F*.5,F*.3,0,F*.5,F*.3,F*.46);z.addColorStop(0,"rgba(255,198,118,.95)"),z.addColorStop(.45,"rgba(255,174,92,.38)"),z.addColorStop(1,"rgba(255,160,80,0)"),P.fillStyle=z,P.fillRect(0,0,F,F)});Pt(new he(3.2,4.6),new Ye({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),Pt(new he(3,4.2),new Ye({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),k(i,[1.1,.4,.36],[h-.55,2.1,-2.1],w,0),k(i,[.5,.9,.3],[h+.7,.28,-2.2],w,0);const A=(P,F=0)=>{const O=new se,z=u-.06,q=p-.1;O.position.set(h+P*(u-.02),0,.02),O.rotation.y=P*F,i.add(O);const V=-P*z/2;for(const st of[.07,q])k(O,[z,.1,.09],[V,st,0],D.black,.012);for(const st of[V-z/2+.045,V+z/2-.045])k(O,[.09,q,.09],[st,q/2,0],D.black,.012);const K=.92;k(O,[z-.12,K,.07],[V,K/2+.1,0],d_,.01);for(let st=0;st<3;st++)k(O,[z-.18,.03,.09],[V,K*(st+.5)/3+.1,.012],D.rust,0);for(let st=V-z/2+.14;st<V+z/2-.1;st+=.17)k(O,[.03,q-K-.24,.03],[st,K+.12+(q-K-.24)/2,.012],D.black,0);for(const st of[q-.12,2.02,K+.32])k(O,[z-.14,.05,.055],[V,st,.012],D.black,0);for(const st of[.42,.95])Ut(O,.035,.035,.09,[V+P*(z/2-.02),st,0],D.black,[0,0,0],10);return Se(O,.1,.013,[V,q*.8,.02],D.black),O};A(-1,.3),A(1,0);for(let P=-3;P<=3;P++){const F=h+P*.42,O=Math.sqrt(Math.max(0,g*g-F*F)),z=p+O*.96,q=p-.1;z-q<.12||k(i,[.028,z-q,.028],[F,(z+q)/2,.055],D.black,0)}const S=new Ur(0,0,g-.02,g-.02,0,Math.PI,!1,0).getPoints(20).map(P=>new U(P.x,P.y,0));Pt(new ri(new os(S),20,.03,5,!1),D.black,i,[h,p,.055]);for(let P=0;P<5;P++){const F=Math.PI*(P+1)/6;k(i,[.05,.05,.05],[h+Math.cos(F)*(g-.02),p+Math.sin(F)*(g-.02),.075],D.black,0)}Ut(i,.02,.02,.5,[h,v+.9,.36],D.black,[0,0,0],8),Ut(i,.11,.2,.14,[h,v+.5,.36],D.black,[0,0,0],14),Nn(i,.082,[h,v+.4,.36],f.bulb,[1,1.45,1],0),Pt(new he(1.5,1.5),f.glow,i,[h,v+.36,.5]);const M=new It({map:lc("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});k(i,[.62,.46,.06],[h+2.3,2.35,.35],D.black,0),Pt(new he(.57,.41),M,i,[h+2.3,2.35,.39]);const R=Math.floor(t/2.47);for(let P=0;P<R;P++)for(let F=0;F<4;F++){const O=(P-(R-1)/2)*2.47,z=1.72+F*2.95;if(Math.abs(O-h)<3.3&&F<2)continue;const q=1.16,V=1.91,K=300+F*10+P;k(i,[q+.26,V+.27,.14],[O,z,.38],s,0),k(i,[q+.05,V+.06,.1],[O,z,.47],r,0);const st=Bf(P,F,2),ut=st==="lit"?l:o[(P+F)%o.length];k(i,[q,V,.04],[O,z,.54],ut,0);for(const Rt of[-q/2,q/2,0])k(i,[.048,V,.09],[O+Rt,z,.58],n,0);for(const Rt of[-V/2,V/2,.24])k(i,[q,.047,.09],[O,z+Rt,.58],n,0);k(i,[q+.4,.12,.43],[O,z-V/2-.09,.55],s,0),$f(i,O,z,q,V,n,r,s),F>=1&&Jf(i,O,z,q,V,st,s,ut,K)}for(const P of[-t/2+.35,t/2-.38]){Ut(i,.07,.07,e,[P,e/2,.53],r,[0,0,0],12);for(let F=1;F<e;F+=2)Ut(i,.087,.087,.055,[P,F,.53],D.rust,[0,0,0],12)}const L=new Ye({map:qf(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[P,F]of[[-t/2,h-u-.5],[h+u+.5,t/2]].filter(([O,z])=>z-O>1))Pt(new he(F-P,.9),L,i,[(P+F)/2,.55,.345]);Pt(Yc(.48,.64,c%4,2,2),f.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let P=0;P<22;P++){const F=P<11?-t/2+.55:t/2-.55,O=F+Math.sin(P*.55)*.26+(m()-.5)*.2;Pt(new ki(.05+m()*.075,7),P%3?f.leafDark:f.green,i,[O,.5+P*.17,.355+m()*.04],[0,0,m()*Math.PI])}for(const P of[-t*.32,t*.3])k(i,[.78,.98,.78],[P,e+.48,-.05],n,0),k(i,[.94,.13,.94],[P,e+1.02,-.05],n,0),Ut(i,.09,.11,.24,[P-.16,e+1.19,-.05],D.rust,[0,0,0],10),Ut(i,.09,.11,.24,[P+.16,e+1.19,-.05],D.rust,[0,0,0],10);return Ut(i,.018,.018,1.42,[t*.12,e+.76,.18],D.black,[0,0,0],8),k(i,[.88,.025,.025],[t*.12,e+1.12,.18],D.black,0),k(i,[.58,.025,.025],[t*.12,e+1.36,.18],D.black,0),i}function Mu(i,t,e,n,s){k(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),k(i,[t+.1,.08,1.28],[0,e+.36,.34],yr(s),0),Pt(new tn(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),k(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])k(i,[.16,.2,.16],[r,e+.62,.95],D.rust,0)}function yr(i){return yr.mat||(yr.mat=i.clone(),yr.mat.color.offsetHSL(0,-.03,.04)),yr.mat}function m_(){const i=new se;i.name="sky";const t=new ke(55,32,18),e=[],n=new Gt("#6a5142"),s=new Gt("#253a55"),r=new Gt("#08111f");for(let A=0;A<t.attributes.position.count;A++){const T=be.smoothstep(t.attributes.position.getY(A)/55,-.04,.62);(T<.4?n.clone().lerp(s,T/.4):s.clone().lerp(r,(T-.4)/.6)).toArray(e,A*3)}t.setAttribute("color",new oe(e,3));const a=new Vt(t,new Ye({vertexColors:!0,side:nn,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=fe((A,T)=>{const S=A.createRadialGradient(T/2,T/2,0,T/2,T/2,T/2);S.addColorStop(0,"rgba(255,255,255,1)"),S.addColorStop(.34,"rgba(255,255,255,.86)"),S.addColorStop(.62,"rgba(255,255,255,.22)"),S.addColorStop(1,"rgba(255,255,255,0)"),A.fillStyle=S,A.fillRect(0,0,T,T)},64),l=ui(20261),c=105,h=[],f=[],m=new Gt("#e6efff"),u=new Gt("#ffe8c6"),p=new Gt("#bcd3ff");for(let A=0;A<c;A++){const T=l()*Math.PI*2,S=.9+Math.pow(l(),.65)*.58,M=49+l()*3,R=Math.cos(S);h.push(Math.sin(T)*R*M,Math.sin(S)*M,-Math.cos(T)*R*M);const L=l(),P=(L>.72?u:L>.34?m:p).clone(),F=be.clamp((S-.9)/.25,0,1),O=(.55+Math.pow(l(),1.4)*.45)*F;f.push(P.r*O,P.g*O,P.b*O)}const g=new Ie;g.setAttribute("position",new oe(h,3)),g.setAttribute("color",new oe(f,3));const v=new H0(g,new Mf({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Rr,fog:!1,toneMapped:!1,alphaTest:.01}));v.renderOrder=-20,v.frustumCulled=!1,v.name="sky-stars",i.add(v);const d=new U(-.16,.883,-.442).normalize(),x=d.clone().multiplyScalar(44),_=fe((A,T,S)=>{const M=T*.47,R=T/2,L=T/2;A.clearRect(0,0,T,T);const P=A.createRadialGradient(R-M*.22,L-M*.26,M*.06,R,L,M);P.addColorStop(0,"#fbfcf7"),P.addColorStop(.62,"#e6e9ee"),P.addColorStop(.9,"#cfd5e0"),P.addColorStop(1,"#b9c1cf"),A.fillStyle=P,A.beginPath(),A.arc(R,L,M,0,Math.PI*2),A.fill(),A.save(),A.beginPath(),A.arc(R,L,M,0,Math.PI*2),A.clip();for(let O=0;O<26;O++){const z=S()*Math.PI*2,q=Math.sqrt(S())*M*.92,V=R+Math.cos(z)*q,K=L+Math.sin(z)*q,st=M*(.03+S()*.13),ut=A.createRadialGradient(V,K,0,V,K,st);ut.addColorStop(0,`rgba(132,142,160,${.1+S()*.17})`),ut.addColorStop(1,"rgba(132,142,160,0)"),A.fillStyle=ut,A.beginPath(),A.arc(V,K,st,0,Math.PI*2),A.fill()}for(let O=0;O<5;O++){const z=S()*Math.PI*2,q=Math.sqrt(S())*M*.62,V=R+Math.cos(z)*q,K=L+Math.sin(z)*q,st=M*(.16+S()*.16),ut=A.createRadialGradient(V,K,0,V,K,st);ut.addColorStop(0,"rgba(150,158,174,.16)"),ut.addColorStop(1,"rgba(150,158,174,0)"),A.fillStyle=ut,A.beginPath(),A.arc(V,K,st,0,Math.PI*2),A.fill()}const F=A.createRadialGradient(R,L,M*.2,R,L,M);F.addColorStop(0,"rgba(255,255,255,0)"),F.addColorStop(.78,"rgba(150,162,186,.13)"),F.addColorStop(1,"rgba(96,110,138,.42)"),A.fillStyle=F,A.beginPath(),A.arc(R,L,M,0,Math.PI*2),A.fill(),A.restore()},256);_.colorSpace=qe;const y=new Eh(new tc({map:_,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));y.position.copy(x),y.scale.set(2.25,2.25,1),y.name="sky-moon",i.add(y);const w=fe((A,T)=>{const S=A.createRadialGradient(T/2,T/2,0,T/2,T/2,T/2);S.addColorStop(0,"rgba(226,236,255,.9)"),S.addColorStop(.22,"rgba(198,216,255,.34)"),S.addColorStop(.5,"rgba(170,196,255,.10)"),S.addColorStop(1,"rgba(150,180,255,0)"),A.fillStyle=S,A.fillRect(0,0,T,T)},128),b=new Eh(new tc({map:w,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:Rr,fog:!1,toneMapped:!1}));return b.position.copy(x).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:v,moon:y,glow:b,moonDirection:d.clone(),update(){}}}function g_(i="right"){const t=new se;t.name="vr-gloved-hand",t.visible=!1;const e=new It({color:9533536,emissive:2366227,emissiveIntensity:.5,roughness:.7,metalness:.05}),n=new It({color:6836799,emissive:1577227,emissiveIntensity:.42,roughness:.84,metalness:.04}),s=new It({color:11375738,emissive:2826520,emissiveIntensity:.46,roughness:.65,metalness:.06}),r=new It({color:2963781,emissive:725014,emissiveIntensity:.45,roughness:.88,metalness:.03}),a=new It({color:1778734,emissive:461842,emissiveIntensity:.42,roughness:.9,metalness:.03}),o=new It({color:2371644,emissive:593944,emissiveIntensity:.4,roughness:.86,metalness:.04}),l=new It({color:3877922,emissive:1182728,emissiveIntensity:.4,roughness:.62,metalness:.16}),c=new It({color:1119773,emissive:263946,emissiveIntensity:.35,roughness:.35,metalness:.35}),h=new It({color:14923896,emissive:7227417,emissiveIntensity:.55,roughness:.34,metalness:.58}),f=new Ye({color:55639}),m=new Ye({color:14680214}),u=new Vt(new ke(.056,10,8),a);t.add(u);const p=new Vt(new Ce(.056,.045,1,12,1,!1),a);t.add(p);const g=new se,v=new Vt(new ke(.046,12,10),a);v.scale.set(.96,1.02,1.05),g.add(v);const d=new Vt(new Js(.041,.006,6,14),o);d.rotation.x=Math.PI*.45,g.add(d),t.add(g);const x=new Vt(new Ce(.045,.027,1,12,1,!1),a);t.add(x);const _=new se;t.add(_);const y=new se;_.add(y);const w=new se;w.scale.setScalar(1.28),y.add(w);const b=new Vt(new tn(.064,.024,.098),e);b.position.set(0,.004,-.05),w.add(b);const A=new Vt(new tn(.032,.021,.094),e);w.add(A);const T=new Vt(new tn(.028,.022,.082),e);w.add(T);const S=new Vt(new tn(.08,.011,.088),n);S.position.set(0,-.01,-.049),w.add(S);const M=new Vt(new ke(.022,10,8),n);M.scale.set(.85,.62,1.35),w.add(M);const R=new Vt(new ke(.017,8,7),n);R.scale.set(.72,.58,1.45),w.add(R);const L=[-1,0,1].map(H=>{const X=new Vt(new tn(.0038,.0042,.068),s);return w.add(X),{mesh:X,idx:H}}),F=[{baseX:-.032,yOff:.001,zOff:-.097,l1:.034,l2:.023,l3:.017,w:.0175,splay:-.065},{baseX:-.01,yOff:.004,zOff:-.101,l1:.038,l2:.026,l3:.018,w:.0185,splay:-.015},{baseX:.012,yOff:.002,zOff:-.097,l1:.035,l2:.024,l3:.017,w:.0175,splay:.032},{baseX:.032,yOff:-.003,zOff:-.09,l1:.028,l2:.019,l3:.015,w:.0155,splay:.085}].map(H=>{const X=new se,Q=new Vt(new ke(H.w*.52,8,6),e);X.add(Q);const Y=new Vt(new Ce(H.w*.45,H.w*.51,H.l1,8),e);Y.rotation.x=Math.PI*.5,Y.position.set(0,0,-H.l1*.5),X.add(Y);const St=new se;St.position.set(0,0,-H.l1),St.add(new Vt(new ke(H.w*.44,8,6),e));const ht=new Vt(new Ce(H.w*.39,H.w*.44,H.l2,8),e);ht.rotation.x=Math.PI*.5,ht.position.set(0,0,-H.l2*.5),St.add(ht);const bt=new se;bt.position.set(0,0,-H.l2),bt.add(new Vt(new ke(H.w*.38,8,6),e));const Tt=new Vt(new Ce(H.w*.33,H.w*.38,H.l3,8),e);Tt.rotation.x=Math.PI*.5,Tt.position.set(0,0,-H.l3*.5),bt.add(Tt);const ft=new Vt(new ke(H.w*.35,8,6),s);return ft.scale.set(1,.88,1.08),ft.position.set(0,-8e-4,-H.l3),bt.add(ft),St.add(bt),X.add(St),w.add(X),{spec:H,mcp:X,pip:St,dip:bt}}),O=new se,z=new Vt(new Ce(.0115,.014,.032,8),e);z.rotation.x=Math.PI*.5,z.position.set(0,0,-.016),O.add(z);const q=new se;q.position.set(0,0,-.032),q.add(new Vt(new ke(.0112,8,6),e));const V=new Vt(new Ce(.0098,.0112,.026,8),e);V.rotation.x=Math.PI*.5,V.position.set(0,0,-.013),q.add(V);const K=new se;K.position.set(0,0,-.026),K.add(new Vt(new ke(.0095,8,6),e));const st=new Vt(new Ce(.0082,.0095,.021,8),e);st.rotation.x=Math.PI*.5,st.position.set(0,0,-.0105),K.add(st);const ut=new Vt(new ke(.0086,8,6),s);ut.position.set(0,-8e-4,-.021),K.add(ut),q.add(K),O.add(q),w.add(O);const Rt=new Vt(new Ce(.043,.045,.038,12),r);Rt.rotation.x=Math.PI*.5,Rt.scale.set(1.02,1,.46),Rt.position.set(0,0,.016),w.add(Rt);const Dt=new Vt(new Ce(.048,.05,.024,12),o);Dt.rotation.x=Math.PI*.5,Dt.scale.set(1.05,1,.52),Dt.position.set(0,0,.034),w.add(Dt);const zt=new Vt(new Ce(.046,.047,.021,12),l);zt.rotation.x=Math.PI*.5,zt.scale.set(1.04,1,.48),zt.position.set(0,0,.004),w.add(zt);const Wt=new se,j=new Vt(new tn(.036,.005,.02),c);Wt.add(j);const et=new Vt(new ke(.0024,6,5),f);et.position.set(-.009,.0028,0),Wt.add(et);const vt=new Vt(new ke(.0024,6,5),m);vt.position.set(.009,.0028,0),Wt.add(vt),w.add(Wt);const wt=new Vt(new ke(.0066,8,6),h);w.add(wt);let yt=null,Yt=.3,Nt=.65,N=0,rt=0,nt=0,it=0;function tt(H){const X=H==="left"?"left":"right";if(X===yt)return;yt=X;const Q=X==="left"?-1:1;w.rotation.set(.32,Q*.13,Q*.26),A.position.set(Q*.029,0,-.048),A.rotation.z=-Q*.16,T.position.set(-Q*.028,.001,-.045),T.rotation.z=Q*.1,M.position.set(-Q*.026,-.012,-.032),M.rotation.y=Q*.28,R.position.set(Q*.028,-.011,-.042);for(const{mesh:Y,idx:St}of L)Y.position.set(Q*St*.019,.0165,-.048),Y.rotation.y=-Q*St*.045;for(const Y of F)Y.mcp.position.set(Q*Y.spec.baseX,Y.spec.yOff,Y.spec.zOff);O.position.set(-Q*.044,-.005,-.028),O.rotation.set(.1,Q*.62,-Q*.25),Wt.position.set(-Q*.006,.022,.004),Wt.rotation.z=Q*.08,et.position.x=-Q*.009,vt.position.x=Q*.009,wt.position.set(Q*.028,.018,.004)}function dt(H,X,Q=0,Y=0){const St=yt==="left"?-1:1;for(let bt=0;bt<F.length;bt++){const Tt=F[bt],ft=Q*Math.sin(N+bt*.9)*.17,Et=bt*.045,Xt=be.clamp(H+Et+ft+Y,.03,1.35);Tt.mcp.rotation.x=-Xt*.56,Tt.pip.rotation.x=-Xt*.78,Tt.dip.rotation.x=-Xt*.52,Tt.mcp.rotation.y=-St*Tt.spec.splay*X}const ht=be.clamp(H*.85+Y*.5,.02,1.15);O.rotation.x=.1-ht*.28,O.rotation.y=St*(.62-ht*.24),q.rotation.x=-ht*.44,K.rotation.x=-ht*.52}tt(i),dt(Yt,Nt,0,0);const at=new U,mt=new U,$t=new U,qt=new U,I=new U,E=new U(0,1,0);return{group:t,wristPivot:_,setHandSide:tt,getHandSide:()=>yt,update(H,{visible:X=!1,handSide:Q=yt,shoulderPos:Y=null,elbowPos:St=null,pos:ht={x:.16,y:-.22,z:-.5},vel:bt={x:0,y:0,z:0},qArm:Tt=[0,0,0,1],reach:ft=.25,elbowBendDeg:Et=60,overBin:Xt=!1,phase:kt="search",calmLowerProgress:Mt=0,beaconActive:Jt=!1}={}){if(t.visible=X,!X)return;const B=Math.min(.1,H||1/60);tt(Q);const pt=yt==="left"?-1:1;it+=B*1.6;const _t=Math.sin(it)*7e-4;$t.set(ht.x,ht.y+_t,ht.z),Y?at.set(Y.x,Y.y,Y.z):at.set(pt*.21,-.27,-.08),St?mt.set(St.x,St.y+_t*.5,St.z):mt.set(pt*.24,-.44,-.26),_.position.copy($t),_.quaternion.set(Tt[0],Tt[1],Tt[2],Tt[3]);const Ft=be.clamp(-bt.y*.085,-.16,.16),gt=be.clamp(bt.x*.075,-.14,.14),ot=1-Math.exp(-B*16);rt+=(Ft-rt)*ot,nt+=(gt-nt)*ot,y.rotation.set(rt,nt,0),u.position.copy(at),I.copy(at).sub(mt);const Bt=Math.max(.08,I.length());p.position.copy(mt).addScaledVector(I,.5),p.scale.set(.96,Bt,.92),p.quaternion.setFromUnitVectors(E,I.normalize()),g.position.copy(mt),g.quaternion.copy(p.quaternion);const ee=.92+be.clamp(Et/120,0,1)*.18;d.scale.setScalar(ee),qt.set(0,-.004,.044).applyQuaternion(y.quaternion).applyQuaternion(_.quaternion).add($t),I.copy(mt).sub(qt);const xe=Math.max(.08,I.length());x.position.copy(qt).addScaledVector(I,.5),x.scale.set(1,xe,.8),x.quaternion.setFromUnitVectors(E,I.normalize());let le=.3,Je=.6,gn=0;kt==="search"?ft>=.58&&Xt?(le=.14,Je=1.05,gn=1,N+=B*9.5):ht.y<-.34?(le=.48,Je=.35):ht.y>.1?(le=.18,Je=.92):(le=.34,Je=.55):kt==="inspect"&&(le=.2+Mt*.86,Je=(1-Mt)*.8+.15);const nr=1-Math.exp(-B*13);Yt+=(le-Yt)*nr,Nt+=(Je-Nt)*nr,dt(Yt,Nt,gn,rt*.9),Mt>.05?(h.emissive.setHex(8963184),h.emissiveIntensity=.6+Mt*.95):Jt?(h.emissive.setHex(7121032),h.emissiveIntensity=.58):(h.emissive.setHex(7227417),h.emissiveIntensity=.45),f.color.setHex(Jt?65382:1993533),m.color.setHex(Jt?16711850:7020114)},dispose(){u.geometry.dispose(),p.geometry.dispose(),v.geometry.dispose(),d.geometry.dispose(),x.geometry.dispose(),b.geometry.dispose(),A.geometry.dispose(),T.geometry.dispose(),S.geometry.dispose(),M.geometry.dispose(),R.geometry.dispose(),Rt.geometry.dispose(),Dt.geometry.dispose(),zt.geometry.dispose(),j.geometry.dispose(),wt.geometry.dispose(),e.dispose(),n.dispose(),s.dispose(),r.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose(),h.dispose(),f.dispose(),m.dispose()}}}const Mn=ui(137);function ol(i){i.updateWorldMatrix(!0,!0);const t=new ue().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new ue().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=Vf(s,!1);if(r){const a=new Vt(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class v_{constructor(t){this.renderer=new mx({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Xu,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=qe,this.renderer.toneMapping=bc,this.renderer.toneMappingExposure=1.12,this.scene=new Ql,this.scene.background=new Gt("#16222f"),this.scene.fog=new Uc("#1c2b3a",.0118),this.sky=m_(),this.scene.add(this.sky.group),this.camera=new en(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new en(62,1,.1,70),this.eyeR=new en(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new U,this.baseCameraQuaternion=new Dn,this.lockedCameraQuaternion=new Dn,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null;const e=new ac(this.renderer),n=new Sx;this.envTarget=e.fromScene(n,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.15,n.dispose(),e.dispose(),this.hemi=new Fh(9087958,1318439,1.12),this.scene.add(this.hemi);const s=new _a(11127024,1.62);s.position.set(-6,11,2),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-6,s.shadow.camera.right=6,s.shadow.camera.top=7,s.shadow.camera.bottom=-6,s.shadow.normalBias=.012,s.shadow.bias=-25e-5,s.shadow.radius=3,this.scene.add(s),this.sun=s;const r=new _a(5338012,.62);r.position.set(5,5,-4),this.scene.add(r),this.static=new se,this.scene.add(this.static),xu(.5),this.buildCourtyard(),xu(1),ol(this.static),this.bin=new se,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new Vt(new he(1,1),new Ye({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new se,this.silhouetteMat=new Ye({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new se,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2),this.vrHand=g_(),this.camera.add(this.vrHand.group),this.vrHandMode=!1,this.itemBaseRot=[0,0,0],this.tossGroup=new se,this.camera.add(this.tossGroup),this.tossState=null;const a=fe((o,l)=>{const c=o.createRadialGradient(l/2,l/2,0,l/2,l/2,l/2);c.addColorStop(0,"rgba(3,7,11,.62)"),c.addColorStop(.55,"rgba(3,7,11,.34)"),c.addColorStop(1,"rgba(3,7,11,0)"),o.fillStyle=c,o.fillRect(0,0,l,l)},128);this.itemShadow=new Vt(new he(1,1),new Ye({map:a,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new Za(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new Za(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new Ix(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new Hf,this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new ct,this.raycaster=new Lp,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",o=>{this.reduced=o.matches,o.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildCourtyard(){const t=new It({...gu("courtyard-stone",[18,18]),normalScale:new ct(1.2,1.2),roughness:.7,metalness:.13,color:10133666});Pt(new he(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new Lf().load("./assets/plaster.jpg");e.colorSpace=qe,e.wrapS=e.wrapT=zi,e.repeat.set(3,3),e.anisotropy=4;const n=new It({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new It({color:8225402,roughness:.9}),a=new It({color:10724502,roughness:.84}),o=new It({color:2897456,roughness:.78}),l=new It({color:2436659,metalness:.32,roughness:.74}),c=fe((d,x)=>{const _=d.createLinearGradient(0,0,x,x);_.addColorStop(0,"#788b91"),_.addColorStop(.48,"#495b60"),_.addColorStop(1,"#1d302c"),d.fillStyle=_,d.fillRect(0,0,x,x),d.save(),d.transform(1,.16,-.07,1,0,0);for(let w=-30;w<x;w+=94){d.fillStyle="#283b3a",d.fillRect(w,70,65,x);for(let b=94;b<x;b+=104)d.fillStyle="#83938b",d.globalAlpha=.24,d.fillRect(w+6,b,24,66),d.fillRect(w+34,b,24,66)}d.restore();const y=d.createLinearGradient(0,0,x,x*.8);y.addColorStop(0,"rgba(238,246,238,.20)"),y.addColorStop(.38,"rgba(238,246,238,.03)"),y.addColorStop(.62,"rgba(238,246,238,0)"),d.fillStyle=y,d.beginPath(),d.moveTo(0,x),d.lineTo(x*.52,0),d.lineTo(x*.78,0),d.lineTo(x*.24,x),d.closePath(),d.fill(),d.fillStyle="rgba(18,31,31,.55)",d.beginPath(),d.moveTo(0,82),d.lineTo(120,38),d.lineTo(150,38),d.lineTo(150,12),d.lineTo(178,12),d.lineTo(178,34),d.lineTo(335,66),d.lineTo(360,30),d.lineTo(386,30),d.lineTo(386,72),d.lineTo(512,96),d.lineTo(512,0),d.lineTo(0,0),d.closePath(),d.fill(),d.fillStyle="rgba(255,190,110,.5)";for(let w=0;w<24;w++)d.fillRect(28+w*67%470,150+w*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(d=>new It({color:d,map:c,metalness:.24,roughness:.28})),f=Kf,m=(d,x,_,y,w)=>{const b=new se;b.position.set(..._),b.rotation.y=y,this.static.add(b),k(b,[d,x,.65],[0,x/2,0],w,0),k(b,[d,.75,.78],[0,.375,.025],r,0);for(const T of[3.2,6.15,9.1,12.1])k(b,[d,.14,.87],[0,T,.055],a,0),k(b,[d,.07,.98],[0,T+.09,.08],r,0);k(b,[d,.35,1.06],[0,x-.12,.05],a,0),r_(b,d,x,y===0?0:y>0?37:73),Mu(b,d,x,l,a);let A=Math.floor(d/2.45);for(let T=0;T<A;T++)for(let S=0;S<4;S++){let M=(T-(A-1)/2)*2.47,R=1.72+S*2.95;if(y===0&&S===0&&Math.abs(M+3.8)<1.2)continue;const L=1.16,P=1.91;k(b,[L+.26,P+.27,.14],[M,R,.38],a,0),k(b,[L+.05,P+.06,.1],[M,R,.47],o,0);const F=Bf(T,S,y===0?0:y>0?1:2),O=F==="lit"?f:h[(T+S)%h.length];k(b,[L,P,.04],[M,R,.54],O,0);for(const z of[-L/2,L/2,0])k(b,[.048,P,.09],[M+z,R,.58],r,0);for(const z of[-P/2,P/2,.24])k(b,[L,.047,.09],[M,R+z,.58],r,0);k(b,[L+.4,.12,.43],[M,R-P/2-.09,.55],a,0),$f(b,M,R,L,P,r,o,a),Jf(b,M,R,L,P,F,a,O,(y>0?100:200)+S*10+T)}for(const T of[-d/2+.35,d/2-.38]){Ut(b,.07,.07,x,[T,x/2,.53],o,[0,0,0],12);for(let S=1;S<x;S+=2)Ut(b,.087,.087,.055,[T,S,.53],D.rust,[0,0,0],12)}for(let T=0;T<13;T++){const S=(Mn()-.5)*d,M=.8+Mn()*.3;k(b,[.2+Mn()*.7,.06+Mn()*.14,.02],[S,M,.335],r,0)}return b};m(20,14,[-8,0,1.5],Math.PI/2,s),m(20,14,[9,0,1.5],-Math.PI/2,n),m(20,13.5,[.5,0,11.6],Math.PI,n);const u=new se;u.position.set(0,0,-7),this.static.add(u),p_(u,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:f,seed:101,gateX:1.55}),Mu(u,20,13.5,l,a);const p=new It({map:lc("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});k(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],D.black),Pt(new he(.75,.55),p,this.static,[-2.75,2.5,-6.465]),k(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),k(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let d=0;d<6;d++)k(this.static,[.45,.025,.015],[4.1,1.65+d*.07,-6.415],D.black,0);Ut(this.static,.036,.036,18,[0,5.35,-6.48],D.rust,[0,0,Math.PI/2],12);for(let d=0;d<2;d++){const x=new os([new U(-8,9+d,2),new U(0,7.8+d,1),new U(9,9+d,-1)]);Pt(new ri(x,24,.012,4,!1),D.black,this.static)}for(const d of[-7.2,8.2])k(this.static,[.24,.17,22],[d,.065,0],r,.025);const g=new It({color:8350016,roughness:1,side:Oe});for(let d=0;d<50;d++){let x=(Mn()-.5)*13,_=(Mn()-.5)*14;Pt(new ki(.025+Mn()*.035,5),g,this.static,[x,.008,_],[-Math.PI/2,Mn()*3,Mn()*6])}const v=new It({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let d=0;d<10;d++)Pt(new ki(.55+Mn(),40),v,this.static,[(Mn()-.5)*10,.005,(Mn()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+Mn()*.45,1);this.buildProps(),o_(this.static,this.scene)}buildProps(){const t=this.static,e=new It({color:1647901,roughness:.64,metalness:.03,bumpMap:D.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of kf){const f=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([p,g])=>new ct(p*h*1.7,g*h*1.55)),m=new ho(f,64),u=m.attributes.position;for(let p=0;p<u.count;p++){const g=u.getX(p),v=u.getY(p),d=u.getZ(p),x=Math.atan2(d,g),_=1+.08*Math.sin(x*13+v*12)+.045*Math.sin(x*21-v*7);u.setXYZ(p,g*_,v,d*_)}m.computeVertexNormals(),Pt(m,e,t,[l,.02,c]),Se(t,.066*h,.018,[l,h*1.66,c],D.black,[Math.PI/2,0,0]);for(let p=0;p<3;p++)k(t,[.042,.16,.027],[l+Math.sin(p*2)*.04,h*1.84,c+Math.cos(p*2)*.035],e,.006,[.2,p*2,.23])}const n=new se;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){Se(n,.48,.038,[l,0,0],D.black),Se(n,.44,.014,[l,0,0],D.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const f=new U(l,0,0),m=new U(l+Math.cos(h)*.44,Math.sin(h)*.44,0),u=new nc(f,m);Pt(new ri(u,1,.004,3),D.silver,n)}}const s=(l,c)=>{const h=new U(...l),f=new U(...c);Pt(new ri(new nc(h,f),1,.025,6),D.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);k(n,[.32,.07,.16],[-.23,.72,0],D.black),k(n,[.3,.035,.04],[.57,.86,0],D.silver);const r=new It({color:8090716,roughness:1});k(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)k(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],D.black,0);const a=al("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=al("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new It({...gu("steel-paint"),normalScale:new ct(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new It({color:2505773,roughness:.58,metalness:.06,bumpMap:D.leather.bumpMap,bumpScale:.007}),r=new tn(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let u=0;u<a.count;u++){let p=a.getY(u);const g=.9+(p+.8)*.0625;a.setX(u,a.getX(u)*g),a.setZ(u,a.getZ(u)*g),Math.abs(a.getZ(u))>.7&&a.setZ(u,a.getZ(u)+-.026*Math.exp(-((a.getX(u)-.35)**2+(p-.1)**2)*9))}r.computeVertexNormals(),Pt(r,e,t,[0,1.22,0]),k(t,[2.68,.105,1.83],[0,2.02,0],n,.035),k(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const u of[-1.08,1.08])k(t,[.055,1.51,.05],[u,1.2,.812],n,.008),k(t,[.055,1.5,.05],[u,1.2,-.813],n,.008);for(const u of[-.69,.69])k(t,[.044,1.22,.054],[u,1.26,.849],n,.008),k(t,[.044,1.22,.054],[u,1.26,-.849],n,.008);for(const u of[-1.275,1.275])k(t,[.06,.065,1.25],[u,1.65,0],n),k(t,[.065,1.3,.05],[u,1.23,.5],n),k(t,[.065,1.3,.05],[u,1.23,-.5],n),k(t,[.19,.18,.7],[u,1.7,0],n),k(t,[.06,.08,.6],[u*1.11,1.7,0],D.silver);for(const u of[-.95,.95])for(const p of[-.58,.58])k(t,[.15,.19,.12],[u,.35,p],D.silver),Ut(t,.18,.18,.15,[u,.19,p],D.black,[0,0,Math.PI/2],28),Ut(t,.067,.067,.16,[u,.19,p],D.silver,[0,0,Math.PI/2],24);this.lid=new se,this.lid.position.set(0,2.08,-.92),t.add(this.lid),k(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let u=-4;u<=4;u++)k(this.lid,[.065,.07,1.66],[u*.27,.11,.94],n,.026);k(this.lid,[.65,.09,.1],[0,.045,1.99],D.black,.025);for(const u of[-.87,.87])Ut(t,.095,.095,.31,[u,2.06,-.93],D.silver,[0,0,Math.PI/2]);const o=fe((u,p,g)=>{u.fillStyle="#cac9ad",u.textAlign="center",u.font="bold 110px Arial",u.fillText("Т Б О",p/2,220),u.font="bold 82px Arial",u.fillText("№ 017",p/2,347),u.globalCompositeOperation="destination-out";for(let v=0;v<1600;v++)u.globalAlpha=g()*.7,u.fillRect(g()*p,g()*p,1+g()*4,1+g()*3)}),l=new It({map:o,transparent:!0,depthWrite:!1,roughness:.9});Pt(new he(.73,.56),l,t,[.62,1.31,.865]);const c=new It({map:lc("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});Pt(new he(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=fe((u,p)=>{u.fillStyle="#d3cdb5",u.fillRect(0,0,p,p),u.fillStyle="#93493c";for(let g=-p;g<p*2;g+=130)u.beginPath(),u.moveTo(g,0),u.lineTo(g+64,0),u.lineTo(g+p+64,p),u.lineTo(g+p,p),u.fill();un(u,p,p,ui(25),5e3)}),f=new It({map:h,roughness:.75});for(const u of[-1.1,1.1])Pt(new he(.16,.53),f,t,[u,1.33,.847]);const m=fe((u,p)=>{const g=u.createRadialGradient(p/2,p/2,0,p/2,p/2,p*.48);g.addColorStop(0,"rgba(0,8,4,.8)"),g.addColorStop(.5,"rgba(0,8,4,.5)"),g.addColorStop(1,"rgba(0,8,4,0)"),u.fillStyle=g,u.fillRect(0,0,p,p)},128);Pt(new he(4.5,3.5),new Ye({map:m,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),f_(t,this.lid),t.remove(this.lid),ol(t),ol(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=be.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=be.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=be.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var c;this.dirty=!0;const t=innerWidth,e=innerHeight;this.renderer.setSize(t,e),this.camera.aspect=t/e;const n=t/e<.8;this.camera.fov=n?52:43;const s=!n&&e<=520&&t>650,r=!n&&!s&&t>1050;if(this.camera.position.set(s?4.15:r?4.3:n?2.6:4.2,s?2.65:r?3.4:n?3.5:3.55,s?8.1:r?7.4:n?10.3:7.8),this.camera.lookAt(s?.25:r?.6:n?.9:0,s?1.32:r?2.65:n?2.6:2.4,0),this.viewOverride){const{fov:h=this.camera.fov,position:f,target:m}=this.viewOverride;this.camera.fov=h,f&&this.camera.position.set(...f),m&&this.camera.lookAt(...m)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=n;const a=getComputedStyle(document.documentElement);if(this.stage=yx(t,e,parseFloat(a.getPropertyValue("--safe-top"))||0,parseFloat(a.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const h=Math.min(t/2,e)*.72;this.stage={x:(t/2-h)/2,y:(e-h)/2,width:h,height:h}}const o=2*4.2*Math.tan(be.degToRad(this.camera.fov/2))/e;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-t/2)*o,(e/2-this.stage.y-this.stage.height/2)*o,-4.2);const l=this.vrStereo?62:this.camera.fov;this.inspectionVeil.scale.set(12*Math.tan(be.degToRad(l/2))*t/e,12*Math.tan(be.degToRad(l/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(c=this.pipeline)==null||c.resize(t,e,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new $n(new U(...t.min),new U(...t.max));e.applyMatrix4(new ue().makeRotationFromEuler(this.item.rotation));const n=e.getSize(new U).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(be.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):du(n,this.stage,innerHeight,this.camera.fov,4.2,innerWidth),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new $n(new U(...t.min),new U(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new U(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*innerWidth/2,y:(1-o.y)*innerHeight/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.vrHand&&(this.vrHand.group.visible=!1)),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,innerWidth,innerHeight),this.applyCameraPose(),this.resize(),this.dirty=!0}setVrHandMode(t){this.vrHandMode=!!t,!t&&this.vrHand&&(this.vrHand.group.visible=!1),t&&this.vrInspectLock&&this.unlockInspectionView(),this.dirty=!0}updateVrHand(t,e){if(!this.vrHand)return;const n=!!(this.vrStereo&&this.vrHandMode&&(e!=null&&e.visible));this.vrHand.update(t,{...e,visible:n}),n&&(this.dirty=!0)}handHitsBin(){var s,r;if(!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible))return this.gazeHitsBin();this.camera.updateMatrixWorld(!0),this.vrHand.wristPivot.updateMatrixWorld(!0);const e=this.vrHand.wristPivot.localToWorld(new U(0,0,-.15)).clone().sub(this.camera.position).normalize();if(this.raycaster.set(this.camera.position,e),this.raycaster.intersectObject(this.bin,!0).length>0)return!0;const n=new U(0,1.25,0).sub(this.camera.position).normalize();return e.angleTo(n)<=.44}setHandItemRotation(t=0,e=0,n=0){if(!this.item)return;const[s,r,a]=this.itemBaseRot||[0,0,0];this.targetX=be.clamp(s+t,-Math.PI,Math.PI),this.targetY=r+e,this.targetZ=be.clamp(a+n,-Math.PI,Math.PI),this.pose="hand",this.dirty=!0}launchDiscardToss(t={x:4.5,y:2.4,z:-6.5}){if(!this.item||this.reduced)return;const e=this.item.clone(!0);e.remove(this.silhouette),this.tossGroup.clear(),e.position.copy(this.itemAnchor.position),this.tossGroup.add(e),this.tossState={mesh:e,t:0,dur:.34,vx:t.x??4.5,vy:t.y??2.4,vz:t.z??-6.5},this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&!this.vrHandMode&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=be.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=be.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else this.applyCameraPose();return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.vrHandMode?this.vrInfo():(this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo())}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=innerWidth,e=innerHeight){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new U(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=innerWidth,e=innerHeight,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){var e,n,s,r,a,o,l;const t=be.radToDeg;return{stereo:!!this.vrStereo,handMode:!!this.vrHandMode,handSide:((n=(e=this.vrHand)==null?void 0:e.getHandSide)==null?void 0:n.call(e))||"right",handVisible:!!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible),handPosition:((l=(o=(a=this.vrHand)==null?void 0:a.wristPivot)==null?void 0:o.position)==null?void 0:l.toArray().map(c=>+c.toFixed(3)))||null,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),targetZ:+t(this.targetZ||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(c=>+c.toFixed(5))}}hitBin(t,e){return this.pointer.set(t/innerWidth*2-1,-e/innerHeight*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}binScreen(){this.camera.updateMatrixWorld(!0);const t=new U(0,1.2,0).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new U(-1.26,1.12,.22).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,al(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=Qn[t].lamp??17,this.itemRim.intensity=Qn[t].rim??18,this.updateItemLights(),this.item.rotation.set(...Qn[t].rotation),this.itemBaseRot=[...Qn[t].rotation],this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new Vt(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&!this.vrHandMode&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=fu(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=Qn[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=Mx(this.itemId,t),this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=be.clamp(Math.round((this.zoom+t)*100)/100,Ja.min,Ja.max),this.dirty=!0,this.zoom}rotate(t,e){this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=be.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.5)),this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new Ql;o.background=new Gt("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new Fh(15069183,8288624,1.1));const l=new _a(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new _a(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new wn(160,160,{type:ci}),f=new wn(160,160,{depthBuffer:!1}),m=this.renderer.getRenderTarget(),u=this.renderer.getClearColor(new Gt),p=this.renderer.getClearAlpha();let g;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...Qn[t].rotation),e.scale.setScalar(1);const v=e.userData.bounds,d=new $n(new U(...v.min),new U(...v.max));d.applyMatrix4(new ue().makeRotationFromEuler(e.rotation));const x=d.getSize(new U).multiplyScalar(.5);e.scale.setScalar(du(x,{x:8,y:12,width:144,height:136},160,34));const _=new en(34,1,.1,20);_.position.set(0,0,4.2),_.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,_),this.thumbnailOutput.render(this.renderer,f,h);const y=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(f,0,0,160,160,y);const w=document.createElement("canvas");w.width=w.height=160;const b=w.getContext("2d"),A=b.createImageData(160,160);for(let T=0;T<160;T++)A.data.set(y.subarray((159-T)*640,(160-T)*640),T*640);b.putImageData(A,0,0),g=w.toDataURL("image/png"),this.thumbCache.set(t,g)}finally{this.renderer.setRenderTarget(m),this.renderer.setClearColor(u,p),f.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return g}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.tossState){const n=this.tossState;n.t+=t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.vy-=14*t,n.mesh.rotation.x+=t*9,n.mesh.rotation.z-=t*7,n.mesh.scale.multiplyScalar(Math.max(.82,1-t*2.2)),this.dirty=!0,n.t>=n.dur&&(this.tossGroup.clear(),this.tossState=null)}if(this.item){const n=this.item.rotation.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.item.rotation.y=be.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=be.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=be.lerp(this.item.rotation.z,this.targetZ,s),n.equals(this.item.rotation)||this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/gx),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||fu(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const pn=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],jf={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},Qf="white-night-finds-v1";function kr(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>pn.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>pn.some(e=>e.id===t)).slice(0,3):[]}}function x_(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*pn.reduce((e,n)=>e+n.weight,0);return pn.find(e=>(t-=e.weight)<0)??pn.at(-1)}function vo(i,t){if(t.type==="reset")return kr();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=pn.some(n=>n.id===t.itemId)?t.itemId:pn[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function __(i){try{const t=JSON.parse(i.getItem(Qf)||"{}");return kr((t==null?void 0:t.version)===1?t:{})}catch{return kr()}}function y_(i,t){try{return i.setItem(Qf,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const Us=Math.PI/180,M_=new Dn(-Math.sqrt(.5),0,0,Math.sqrt(.5)),S_=new U(0,0,1);class b_{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new Dn,this.qNow=new Dn,this.qScreen=new Dn,this.relQ=new Dn,this.euler=new Fn(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){return this.euler.set(e*Us,t*Us,-n*Us,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(M_),this.qScreen.setFromAxisAngle(S_,-s*Us),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(e)||!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.baseQ.copy(this.qNow),this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/Us).toFixed(2),pitchDeg:+(this.raw.pitch/Us).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Gn=Math.PI/180,Kn=(i,t,e)=>Math.min(e,Math.max(t,i)),Ii=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},w_=1.5,T_=.5,E_=.14,A_=.05,R_=9,C_=.3,P_=.75,I_=3,Su=20*Gn,bu=15*Gn,wu=6*Gn,L_=.35,D_=3,U_=.6,Tu=1.2,Eu=.8,Au=12*Gn;class N_{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-35,pitchMaxDeg:n=35}={}){this.yawLimit=Math.abs(t)*Gn,this.pitchMin=Math.min(e,n)*Gn,this.pitchMax=Math.max(e,n)*Gn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=Kn(t,-this.yawLimit,this.yawLimit),this.pitch=Kn(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=Kn(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>D_&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=U_?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=Kn(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=Kn(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=Ii(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=Kn(R_*Math.max(e,1/60),C_,P_);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(Ii(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=I_&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(Ii(t.yaw-this.yaw))>Su||Math.abs(t.pitch-this.pitch)>bu,s=!this.anchorTrack||Math.abs(Ii(t.yaw-this.anchorTrack.yaw))>Su||Math.abs(t.pitch-this.anchorTrack.pitch)>bu;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(Ii(t.yaw-this.anchorCandidate.yaw))<=wu&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=wu?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=L_?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(Ii(t.yaw-e.yaw))<=Au&&Math.abs(t.pitch-e.pitch)<=Au}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=Kn(Ii(t.yaw-this.yaw)*n,-Tu*e,Tu*e),this.pitch+=Kn((t.pitch-this.pitch)*n,-Eu*e,Eu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?w_:T_,r=n?E_:A_,a=1-Math.exp(-s*e);this.yaw+=Kn(Ii(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=Kn((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Gn).toFixed(2),pitchDeg:+(this.pitch/Gn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Gn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Gn).toFixed(2)}:null}}}const Hn=Math.PI/180,La=240,Da=180,F_=62,O_=48,z_=.15,k_=.3,B_=900,H_=120,Ru=(i,t,e)=>Math.min(e,Math.max(t,i));function $c(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function V_(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,f=-1e9,m=0,u=0,p=0;for(let x=0;x<e;x++)for(let _=0;_<t;_++){const y=(x*t+_)*4,{hue:w,sat:b,val:A,chroma:T}=$c(i[y],i[y+1],i[y+2]);if(w<0)continue;let S=Math.abs(w-n);if(S>180&&(S=360-S),S>30||b<14||A<40||T<40)continue;p++,b>m&&(m=b),T>u&&(u=T);const M=(1-S/30)*(b/100);s+=_*M,r+=x*M,a+=M,o++,_<l&&(l=_),_>c&&(c=_),x<h&&(h=x),x>f&&(f=x)}if(o<15||a<=0)return{found:!1,bright:p,n:o};const g=c-l+1,v=f-h+1,d=o/Math.max(1,g*v);return g>t*.75||v>e*.75?{found:!1,bright:p,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:p,n:o,bbW:g,bbH:v,fill:d,maxSat:m,maxChroma:u,minX:l,maxX:c,minY:h,maxY:f}}function G_(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function Cu(i,t,e){return{yaw:-(i-e.x)*F_*Hn,pitch:(t-e.y)*O_*Hn}}function W_(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class X_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=La,this.canvas.height=Da),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<H_)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,La,Da);const n=this.ctx.getImageData(0,0,La,Da);return this.processImageData(n.data,La,Da,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,f,m,u;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let p=0;p<2;p++){const g=this.markers[p],v=V_(t,e,n,this.defs[p].hue),d=((f=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:f[p])||null;if(g.hue=this.defs[p].hue,g.blob=v,g.found=!!v.found,g.shapeOk=W_(v,d,e,n),v.found){g.u=v.cx/Math.max(1,e),g.v=v.cy/Math.max(1,n),g.raw=Cu(g.u,g.v,o);const x=(u=(m=this.calibration)==null?void 0:m.baseRaw)==null?void 0:u[p];g.delta=x?{yaw:g.raw.yaw-x.yaw,pitch:g.raw.pitch-x.pitch}:{...g.raw}}this.updateEntity(g,v.found&&g.shapeOk,s),g.usable=!!v.found&&g.entity&&g.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=z_*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=k_*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/Hn;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/Hn,(t.delta.pitch-e.delta.pitch)/Hn);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,f)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(f.delta.yaw-l.yaw,f.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*Hn;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*Hn){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*Hn){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>Cu(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/Hn;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>B_?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=Ru(Math.round((t-n.left)/n.width*(r-1)),0,r-1),l=Ru(Math.round((e-n.top)/n.height*(a-1)),0,a-1);let c=null;for(let h=Math.max(0,l-4);h<=Math.min(a-1,l+4);h++)for(let f=Math.max(0,o-4);f<=Math.min(r-1,o+4);f++){const m=(h*r+f)*4,u=$c(s[m],s[m+1],s[m+2]);u.hue>=0&&(!c||u.chroma>c.chroma)&&(c=u)}return c?{hue:c.hue,sat:c.sat,val:c.val,chroma:c.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(p=>p.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=G_(a),h=Math.round((s.u??.5)*e),f=Math.round((s.v??.5)*n),m=Math.max(4,Math.round(s.w??56)),u=Math.max(4,Math.round(s.h??28));for(let p=Math.max(0,f-Math.floor(u/2));p<Math.min(n,f+Math.ceil(u/2));p++)for(let g=Math.max(0,h-Math.floor(m/2));g<Math.min(e,h+Math.ceil(m/2));g++){const v=(p*e+g)*4;t[v]=o,t[v+1]=l,t[v+2]=c,t[v+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/Hn).toFixed(2),pitchDeg:+(e.pitch/Hn).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const Ua=Math.PI/180;class q_{constructor(t=null){this.gyro=new b_,this.fusion=new N_,this.tracker=new X_(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/Ua).toFixed(2),pitchDeg:+(this.look.pitch/Ua).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/Ua).toFixed(2),pitchDeg:+(this.markerSample.pitch/Ua).toFixed(2)}}}}const Y_=Math.PI/180;class $_{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/Y_,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const Ns=200,Fs=150,Z_=90;function J_(i,t){const e=Math.abs(i-t)%360;return e>180?360-e:e}function Pu(i,t,e,n,s=34){let r=0,a=0,o=0,l=0,c=t,h=-1,f=e,m=-1;for(let d=0;d<e;d++){const x=d*t*4;for(let _=0;_<t;_++){const y=x+_*4,w=i[y],b=i[y+1],A=i[y+2],{hue:T,sat:S,val:M,chroma:R}=$c(w,b,A);if(T<0||S<38||M<75||R<55)continue;const L=J_(T,n);if(L>s)continue;const P=(1-L/(s+1))*(S/100)*(M/255);r+=_*P,a+=d*P,o+=P,l++,_<c&&(c=_),_>h&&(h=_),d<f&&(f=d),d>m&&(m=d)}}if(l<8||o<=0)return{found:!1,count:0};const u=h-c+1,p=m-f+1;if(u>t*.8||p>e*.8)return{found:!1,count:0};const g=r/o,v=a/o;return{found:!0,count:l,u:(g+.5)/t,v:(v+.5)/e,bbW:u,bbH:p}}class K_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.synthetic=!1,this.error=null,this.distalHue=144,this.proximalHue=320,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=Ns,this.canvas.height=Fs),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastProcessAt=0,this.processMs=0,this.latest={status:"none",u:.5,v:.55,spanNorm:0,rollRad:0,distalFound:!1,proximalFound:!1,ts:0}}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}this.video&&this.video.srcObject&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}analyzeRgba(t,e=Ns,n=Fs,s=performance.now()){const r=Pu(t,e,n,this.distalHue),a=Pu(t,e,n,this.proximalHue);return this._commitSpots(r,a,e,n,s)}_commitSpots(t,e,n,s,r){const a=s/n;if(t.found&&e.found){const l=t.u-e.u,c=(t.v-e.v)*a,h=Math.hypot(l,c);if(h>=.018&&h<=.65)return this.latest={status:"pair",u:(t.u+e.u)*.5,v:(t.v+e.v)*.5,spanNorm:h,rollRad:Math.atan2(-c,l),distalFound:!0,proximalFound:!0,ts:r},this.latest}const o=t.found?t:e.found?e:null;if(o){const l=Math.sqrt(o.count/(n*s))*2.35;return this.latest={status:"single",u:o.u,v:o.v,spanNorm:l,rollRad:this.latest.rollRad,distalFound:!!t.found,proximalFound:!!e.found,ts:r},this.latest}return this.latest={...this.latest,status:"none",distalFound:!1,proximalFound:!1},this.latest}process(t=!1,e=performance.now()){if(this.synthetic)return this.latest;if(!this.running||!this.video||!this.ctx||this.video.readyState<2)return this.latest;if(!t&&e-this.lastProcessAt<Z_)return this.latest;const n=performance.now();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,Ns,Fs);const s=this.ctx.getImageData(0,0,Ns,Fs);this.analyzeRgba(s.data,Ns,Fs,e)}catch{}return this.processMs=+(performance.now()-n).toFixed(2),this.latest}inject({distal:t=null,proximal:e=null}={},n=performance.now()){this.synthetic=!0,this.running=!0;const s=t?{found:!0,u:t.u,v:t.v,count:t.count??90}:{found:!1,count:0},r=e?{found:!0,u:e.u,v:e.v,count:e.count??90}:{found:!1,count:0};return this._commitSpots(s,r,Ns,Fs,n)}sample(t=performance.now()){const e=this.latest.ts?t-this.latest.ts:1/0;return{...this.latest,fresh:e<=450&&this.latest.status!=="none",ageMs:Number.isFinite(e)?Math.round(e):null}}info(){const t=this.sample();return{running:this.running,synthetic:this.synthetic,error:this.error,status:t.status,fresh:t.fresh,u:+t.u.toFixed(3),v:+t.v.toFixed(3),spanNorm:+t.spanNorm.toFixed(4),rollDeg:+(t.rollRad*180/Math.PI).toFixed(1),distalFound:t.distalFound,proximalFound:t.proximalFound,processMs:this.processMs}}}const Ne=Math.PI/180,Ki=180/Math.PI,hc=.33,uc=.31;function te(i,t,e){return i<t?t:i>e?e:i}function Li([i,t,e,n]){const s=Math.hypot(i,t,e,n);return s<1e-9?[0,0,0,1]:[i/s,t/s,e/s,n/s]}function vi([i,t,e,n]){return[-i,-t,-e,n]}function dn(i,t){const[e,n,s,r]=i,[a,o,l,c]=t;return[r*a+e*c+n*l-s*o,r*o-e*l+n*c+s*a,r*l+e*o-n*a+s*c,r*c-e*a-n*o-s*l]}function ll([i,t,e],n){const s=Math.hypot(i,t,e);if(s<1e-9)return[0,0,0,1];const r=n*.5,a=Math.sin(r)/s;return[i*a,t*a,e*a,Math.cos(r)]}function an(i,t){const[e,n,s,r]=i,[a,o,l]=t,c=r*a+n*l-s*o,h=r*o+s*a-e*l,f=r*l+e*o-n*a,m=-e*a-n*o-s*l;return[c*r+m*-e+h*-s-f*-n,h*r+m*-n+f*-e-c*-s,f*r+m*-s+c*-n-h*-e]}function j_(i,t){const e=Math.abs(i[0]*t[0]+i[1]*t[1]+i[2]*t[2]+i[3]*t[3]);return 2*Math.acos(te(e,0,1))}function Na(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function ji(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function Vn(i){const t=Math.hypot(i[0],i[1],i[2]);return t<1e-9?[1,0,0]:[i[0]/t,i[1]/t,i[2]/t]}function cl(i,t,e){const n=i[0],s=t[0],r=e[0],a=i[1],o=t[1],l=e[1],c=i[2],h=t[2],f=e[2],m=n+o+f;let u,p,g,v;if(m>0){const d=Math.sqrt(m+1)*2;v=.25*d,u=(h-l)/d,p=(r-c)/d,g=(a-s)/d}else if(n>o&&n>f){const d=Math.sqrt(1+n-o-f)*2;v=(h-l)/d,u=.25*d,p=(s+a)/d,g=(r+c)/d}else if(o>f){const d=Math.sqrt(1+o-n-f)*2;v=(r-c)/d,u=(s+a)/d,p=.25*d,g=(l+h)/d}else{const d=Math.sqrt(1+f-n-o)*2;v=(a-s)/d,u=(r+c)/d,p=(l+h)/d,g=.25*d}return Li([u,p,g,v])}function Q_([i,t,e,n]){const s=2*(i*e-n*t),r=2*(t*e+n*i),a=1-2*(i*i+t*t),o=2*(i*t-n*e),l=1-2*(i*i+e*e),c=2*(i*e+n*t),h=Math.asin(-te(r,-1,1));let f=0,m=0;return Math.abs(r)<.9999?(f=Math.atan2(c,a),m=Math.atan2(o,l)):f=Math.atan2(-s,1-2*(i*i+e*e)),{yaw:f,pitch:h,roll:m}}function t2(i,t,e=hc,n=uc,s=[.42,-.88,.2]){const r=i.x??i[0]??0,a=i.y??i[1]??0,o=i.z??i[2]??0,l=t.x??t[0]??0,c=t.y??t[1]??0,h=t.z??t[2]??0,f=l-r,m=c-a,u=h-o,p=Math.hypot(f,m,u),g=Math.abs(e-n)+.045,v=e+n-.008,d=te(p,g,v),x=p>1e-6?f/p:0,_=p>1e-6?m/p:0,y=p>1e-6?u/p:-1,w={x:r+x*d,y:a+_*d,z:o+y*d},b=(e*e-n*n+d*d)/(2*d),A=Math.sqrt(Math.max(0,e*e-b*b)),T=Vn(s),S=T[0]*x+T[1]*_+T[2]*y;let M=T[0]-S*x,R=T[1]-S*_,L=T[2]-S*y,P=Math.hypot(M,R,L);if(P<1e-5){const q=ji([x,_,y],[1,0,0]),V=Vn(q);M=V[0],R=V[1],L=V[2],P=1}else M/=P,R/=P,L/=P;const F={x:r+x*b+M*A,y:a+_*b+R*A,z:o+y*b+L*A},O=te((e*e+n*n-d*d)/(2*e*n),-1,1),z=(Math.PI-Math.acos(O))*Ki;return{shoulder:{x:r,y:a,z:o},elbow:F,wrist:w,elbowBendDeg:z,clampedDist:d}}class e2{constructor(t="right"){const e=typeof t=="string"?t:t==null?void 0:t.handSide;this.handSide=e==="left"?"left":"right",this.qStretch=null,this.qBend=null,this.qBasis=[0,0,0,1],this.qRefInv=[0,0,0,1],this.bendSpanRad=52*Ne,this.bendInwardYawRad=0,this.yawTrimRad=0,this.calibratedStep=0;const n=this._defaultBeaconU();this.beaconFar={u:n,v:.54,span:.105,captured:!1},this.beaconNear={u:n,v:.64,span:.235,captured:!1},this.lastSensor=null,this.prevQuat=null,this.torsoYaw=0;const s=this.sideSign;this.torsoWristPos={x:s*.16,y:-.22,z:-.5},this.torsoWristVel={x:0,y:0,z:0},this.qArm=[0,0,0,1],this.qArmTorso=[0,0,0,1],this.shoulderPos={x:s*.21,y:-.27,z:-.08},this.elbowPos={x:s*.24,y:-.44,z:-.26},this.pos={x:s*.16,y:-.22,z:-.5},this.vel={x:0,y:0,z:0},this.elbowBendDeg=68,this.reach=.25,this.elevationDeg=0,this.screenFacingCos=.85,this.trackingSource="idle",this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.lastPokeAt=-1e3,this.dwellAccumSec=0,this.inspectBaseQ=null,this.inspectEnteredAt=0,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0,this.lastDecisionAt=-2e3}get sideSign(){return this.handSide==="left"?-1:1}_defaultBeaconU(){return this.handSide==="left"?.46:.54}setHandSide(t){const e=t==="left"?"left":"right";if(e===this.handSide)return this.handSide;this.handSide=e;const n=this.sideSign;return this.beaconFar.captured||(this.beaconFar.u=this._defaultBeaconU()),this.beaconNear.captured||(this.beaconNear.u=this._defaultBeaconU()),this.torsoWristPos={x:n*Math.abs(this.torsoWristPos.x),y:this.torsoWristPos.y,z:this.torsoWristPos.z},this.torsoWristVel={x:0,y:0,z:0},this.shoulderPos={x:n*.21,y:-.27,z:-.08},this.elbowPos={x:n*.24,y:-.44,z:-.26},this.pos={x:n*Math.abs(this.pos.x),y:this.pos.y,z:this.pos.z},this.vel={x:0,y:0,z:0},this.handSide}exportCalibration(){return this.calibratedStep<2?null:{handSide:this.handSide,qStretch:this.qStretch,qBend:this.qBend,qBasis:this.qBasis,qRefInv:this.qRefInv,bendSpanRad:this.bendSpanRad,bendInwardYawRad:this.bendInwardYawRad,beaconFar:this.beaconFar,beaconNear:this.beaconNear}}importCalibration(t){return!t||!Array.isArray(t.qBasis)||!Array.isArray(t.qRefInv)?!1:((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.qStretch=t.qStretch||[0,0,0,1],this.qBend=t.qBend||[0,0,0,1],this.qBasis=Li(t.qBasis),this.qRefInv=Li(t.qRefInv),this.bendSpanRad=te(Number(t.bendSpanRad)||52*Ne,15*Ne,125*Ne),this.bendInwardYawRad=Number(t.bendInwardYawRad)||0,t.beaconFar&&(this.beaconFar={...this.beaconFar,...t.beaconFar}),t.beaconNear&&(this.beaconNear={...this.beaconNear,...t.beaconNear}),this.calibratedStep=2,this.yawTrimRad=0,!0)}feedSensor(t){!t||!Array.isArray(t.q)||t.q.length!==4||((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.lastSensor={q:Li(t.q),linMag:Math.max(0,Number(t.linMag)||0),rotRate:Math.max(0,Number(t.rotRate)||0),acc:Array.isArray(t.acc)?t.acc:[0,0,0],ts:t.ts??performance.now()})}calibrateStretchPose(t=this.lastSensor,e=null){if(!(t!=null&&t.q))return{ok:!1,message:"Нет сигнала от гироскопа на запястье. Подключите браслет."};this.qStretch=Li(t.q);const n=Vn(an(vi(this.qStretch),[0,1,0]));let s=[0,0,1];Math.abs(Na(s,n))>.9&&(s=[0,1,0]);const r=Vn(ji(n,s)),a=Vn(ji(r,n));this.qBasis=cl(r,n,a),this.qRefInv=vi(dn(this.qStretch,this.qBasis)),this.yawTrimRad=0,this.torsoYaw=0;const o=this._defaultBeaconU();e&&e.fresh&&e.spanNorm>.015?this.beaconFar={u:te(e.u,.12,.88),v:te(e.v,.12,.88),span:te(e.spanNorm,.02,.42),captured:!0}:this.beaconFar={u:o,v:.54,span:.105,captured:!1},this.calibratedStep=1;const l=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:1,beaconCaptured:this.beaconFar.captured,message:`Шаг 1 записан (прямая ${l}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`}}calibrateBendPose(t=this.lastSensor,e=null){if(!this.qStretch)return{ok:!1,message:"Сначала выполните Шаг 1 — вытяните прямую руку вперёд."};if(!(t!=null&&t.q))return{ok:!1,message:"Нет свежего сигнала гироскопа с браслета."};const n=Li(t.q),s=dn(vi(this.qStretch),n),r=s[3]<0?-1:1,a=s[0]*r,o=s[1]*r,l=s[2]*r,c=te(s[3]*r,-1,1),h=2*Math.acos(te(c,0,1));if(h<12*Ne)return{ok:!1,message:"Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз."};const f=Vn(an(vi(this.qStretch),[0,1,0])),m=Vn([a,o,l]),u=[m[0]-Na(m,f)*f[0],m[1]-Na(m,f)*f[1],m[2]-Na(m,f)*f[2]],p=Math.hypot(u[0],u[1],u[2]);if(p<.22)return{ok:!1,message:"Движение было почти чисто горизонтальным. Поднимите предплечье в локте вверх к груди."};let g=[u[0]/p,u[1]/p,u[2]/p],v=Vn(ji(g,f)),d=Vn(ji(v,g)),x=cl(g,d,v),_=vi(dn(this.qStretch,x)),y=dn(_,dn(n,x)),w=an(y,[0,0,-1]);w[1]<0&&(g=[-g[0],-g[1],-g[2]],v=Vn(ji(g,f)),d=Vn(ji(v,g)),x=cl(g,d,v),_=vi(dn(this.qStretch,x)),y=dn(_,dn(n,x)),w=an(y,[0,0,-1])),this.qBend=n,this.qBasis=x,this.qRefInv=_,this.bendSpanRad=te(Math.asin(te(w[1],.25,1)),18*Ne,105*Ne),this.bendInwardYawRad=Math.atan2(w[0],Math.max(.15,-w[2])),this.yawTrimRad=0,e&&e.fresh&&e.spanNorm>this.beaconFar.span*1.12?this.beaconNear={u:te(e.u,.1,.9),v:te(e.v,.1,.92),span:te(e.spanNorm,this.beaconFar.span+.04,.58),captured:!0}:this.beaconNear={u:te(this.beaconFar.u-this.sideSign*.03,.15,.85),v:te(this.beaconFar.v+.1,.2,.9),span:te(this.beaconFar.span*1.95,this.beaconFar.span+.07,.45),captured:!1},this.calibratedStep=2;const b=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:2,handSide:this.handSide,bendDeg:+(h*Ki).toFixed(1),beaconCaptured:this.beaconFar.captured&&this.beaconNear.captured,message:`Калибровка готова (${b}, сгиб ${Math.round(h*Ki)}°). Можно надевать очки!`}}onPhaseChange(t,e=performance.now()){t==="inspect"?(this.inspectBaseQ=[...this.qArmTorso],this.inspectEnteredAt=e,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0):(this.inspectBaseQ=null,this.calmLowerSec=0),t==="search"&&(this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0)}update(t,{beacon:e=null,phase:n="search",revealReady:s=!1,handOverBin:r=!0,headLook:a={yaw:0,pitch:0},now:o=performance.now()}={}){const l=te(t||.016666666666666666,.001,.1),c=this.lastSensor;if(!(c!=null&&c.q))return this.trackingSource="idle",this.snapshot({pokes:0,decision:null,throwVel:null});this.qStretch||this.calibrateStretchPose(c,e);const h=this.sideSign,f=Number.isFinite(a==null?void 0:a.yaw)?a.yaw:0,m=Number.isFinite(a==null?void 0:a.pitch)?a.pitch:0,u=f-this.torsoYaw;Math.abs(u)>24*Ne?this.torsoYaw+=(u-Math.sign(u)*24*Ne)*.35:this.torsoYaw+=u*Math.min(1,l*1.4);const p=f-this.torsoYaw,g=dn(ll([1,0,0],-m),ll([0,1,0],p)),v=vi(g),d=ll([0,1,0],this.yawTrimRad-this.torsoYaw);this.qArmTorso=Li(dn(d,dn(this.qRefInv,dn(c.q,this.qBasis)))),this.qArm=Li(dn(g,this.qArmTorso));let x=c.rotRate;this.prevQuat&&x<1&&(x=j_(this.prevQuat,this.qArmTorso)/l*Ki),this.prevQuat=[...this.qArmTorso];const _=an(vi(this.qBasis),[0,0,1]),y=an(this.qArm,_);this.screenFacingCos=y[2];const w=an(this.qArmTorso,[0,0,-1]),b=Math.asin(te(w[1],-1,1)),A=Math.atan2(w[0],Math.max(.12,Math.hypot(w[2],w[1]*.35)));this.elevationDeg=+(b*Ki).toFixed(1);const T=te(-h*A/(28*Ne),-.35,1),S=te((b-(this.bendSpanRad+6*Ne))/(26*Ne),0,1);let M,R=0;if(b>=0){const Nt=te(b/Math.max(.32,this.bendSpanRad),0,1.15),N=te(.96+T*.12-S*.78,.18,1.05);M=te(1-Nt*.84*N,.12,1.02),R=S*.08+te(b/(75*Ne),0,1)*.04}else{const Nt=te(-b/(72*Ne),0,1);M=te(1-Nt*.62,.28,1.02),R=-Nt*.035}const L={x:h*.21,y:-.27+R,z:-.08},P=hc+uc-.015,F=.25;let O,z;if(b<-8*Ne){const Nt=te(-b/(70*Ne),0,1);O=.56-Nt*.09,z={x:L.x+w[0]*O*.82-h*(1-Nt)*.06,y:L.y+w[1]*O*.95+(1-Nt)*.14,z:L.z-Math.max(.18,-w[2])*O*.96}}else{O=F+M*(P-F);const Nt=1-M;z={x:L.x+w[0]*O*.88-h*(.09+Nt*.03),y:L.y+w[1]*(.2+M*.36+S*.18)+M*.15,z:L.z-(.28+M*.31)*te(-w[2]+Nt*.45,.36,1.05)}}let q=M;if(e&&e.fresh&&e.status!=="none"&&this.screenFacingCos>.18)if(this.trackingSource="gyro+beacon",e.status==="pair"&&e.spanNorm>.015){const Nt=te(this.screenFacingCos,.42,1),N=e.spanNorm/Nt,rt=Math.max(.035,this.beaconNear.span-this.beaconFar.span),nt=te((this.beaconNear.span-N)/rt,.06,1.06);q=M*.35+nt*.65;const it=-.38-nt*.32,tt=te((e.u-this.beaconFar.u)*1.15+h*.1,-.54,.54),dt=te((this.beaconFar.v-e.v)*.94-.11,-.56,.46),at=an(v,[tt,dt,it]);z.x=z.x*.32+at[0]*.68,z.y=z.y*.32+at[1]*.68,z.z=z.z*.35+at[2]*.65;const mt=an(g,[L.x+w[0]*.48-h*.08,L.y+w[1]*.35,-.55]),$t=te(this.beaconFar.u+(mt[0]-h*.1)*.65,.1,.9),qt=e.u-$t,I=12*Ne*l;this.yawTrimRad=te(this.yawTrimRad-te(qt*.35,-I,I),-55*Ne,55*Ne)}else{const Nt=te((e.u-this.beaconFar.u)*1.1+h*.1,-.52,.52),N=te((this.beaconFar.v-e.v)*.9-.11,-.54,.44),rt=an(v,[Nt,N,z.z]);z.x=z.x*.55+rt[0]*.45,z.y=z.y*.55+rt[1]*.45}else this.trackingSource="gyro-only";const K=26,st=Math.max(1,Math.ceil(l/.017)),ut=l/st;for(let Nt=0;Nt<st;Nt++)for(const N of["x","y","z"]){const rt=z[N]-this.torsoWristPos[N],nt=K*K*rt-2*K*this.torsoWristVel[N];this.torsoWristVel[N]+=nt*ut,this.torsoWristPos[N]+=this.torsoWristVel[N]*ut}this.reach+=(q-this.reach)*(1-Math.exp(-l*18));const Rt=te((this.torsoWristPos.y+.1)*.55,-.15,.42),Dt=[h*.44,-.86+Rt,.22],zt=t2(L,this.torsoWristPos,hc,uc,Dt);this.torsoWristPos={...zt.wrist},this.elbowBendDeg=+zt.elbowBendDeg.toFixed(1);const Wt=an(g,[zt.shoulder.x,zt.shoulder.y,zt.shoulder.z]),j=an(g,[zt.elbow.x,zt.elbow.y,zt.elbow.z]),et=an(g,[zt.wrist.x,zt.wrist.y,zt.wrist.z]),vt=an(g,[this.torsoWristVel.x,this.torsoWristVel.y,this.torsoWristVel.z]);this.shoulderPos={x:Wt[0],y:Wt[1],z:Wt[2]},this.elbowPos={x:j[0],y:j[1],z:j[2]},this.pos={x:et[0],y:et[1],z:et[2]},this.vel={x:vt[0],y:vt[1],z:vt[2]};let wt=0,yt=null,Yt=null;if(n==="search")if(this.reach>=.6&&r){this.rummageAnchorYaw===null&&(this.rummageAnchorYaw=A,this.rummageAnchorPitch=b);const N=A-this.rummageAnchorYaw,rt=b-this.rummageAnchorPitch,nt=Math.hypot(N,rt)*Ki,tt=(Math.abs(N)>=Math.abs(rt)?N:rt)>=0?1:-1,dt=o-this.lastPokeAt>=270,at=nt>=6.8&&(this.rummageDir===0||tt!==this.rummageDir),mt=c.linMag>=1.35&&x>=28;dt&&(at||mt)?(wt=1,this.lastPokeAt=o,this.rummageDir=tt,this.rummageAnchorYaw=A,this.rummageAnchorPitch=b,this.dwellAccumSec=0):(x>=12||c.linMag>=.55)&&(this.dwellAccumSec+=l,this.dwellAccumSec>=.62&&dt&&(wt=1,this.lastPokeAt=o,this.dwellAccumSec=0))}else this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0;else if(n==="inspect"){this.inspectBaseQ||(this.inspectBaseQ=[...this.qArmTorso],this.inspectEnteredAt=o);const Nt=dn(vi(this.inspectBaseQ),this.qArmTorso),N=Q_(Nt);if(this.itemRot={x:te(-N.pitch*1.55,-Math.PI,Math.PI),y:te(-N.yaw*1.75-N.roll*.65,-Math.PI*1.5,Math.PI*1.5),z:te(-N.roll*1.35,-Math.PI,Math.PI)},s&&o-this.inspectEnteredAt>=450&&o-this.lastDecisionAt>=900){const nt=c.linMag>=7.2,it=x>=255&&c.linMag>=2.6,tt=x>=340;if(nt||it||tt){yt="discard",this.lastDecisionAt=o,this.calmLowerSec=0;const dt=an(this.qArm,[0,0,-1]),at=dt[0]>=0?1:-1;Yt={x:te(dt[0]*7.5+at*3.8+this.vel.x*2.2,-9.5,9.5),y:te(dt[1]*4.5+2.2+this.vel.y*1.8,.5,7.5),z:-6.8}}else{const dt=b<=-23*Ne||zt.wrist.y<=-.35,at=c.linMag<3.1&&x<105;dt&&at?(this.calmLowerSec+=l,this.calmLowerSec>=.65&&(yt="keep",this.lastDecisionAt=o,this.calmLowerSec=0)):this.calmLowerSec=Math.max(0,this.calmLowerSec-l*2.2)}}}return this.snapshot({pokes:wt,decision:yt,throwVel:Yt,pitchUpDeg:+(b*Ki).toFixed(1)})}snapshot(t={}){return{handSide:this.handSide,calibratedStep:this.calibratedStep,trackingSource:this.trackingSource,qArm:[...this.qArm],shoulderPos:{...this.shoulderPos},elbowPos:{...this.elbowPos},pos:{...this.pos},vel:{x:+this.vel.x.toFixed(3),y:+this.vel.y.toFixed(3),z:+this.vel.z.toFixed(3)},elbowBendDeg:this.elbowBendDeg,elevationDeg:this.elevationDeg,reach:+this.reach.toFixed(3),screenFacingCos:+this.screenFacingCos.toFixed(3),itemRot:{...this.itemRot},calmLowerProgress:+te(this.calmLowerSec/.65,0,1).toFixed(2),...t}}}const n2="modulepreload",i2=function(i,t){return new URL(i,t).href},Iu={},Lu=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(f=>Promise.resolve(f).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=a(e.map(h=>{if(h=i2(h,n),h in Iu)return;Iu[h]=!0;const f=h.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!n)for(let g=o.length-1;g>=0;g--){const v=o[g];if(v.href===h&&(!f||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${m}`))return;const p=document.createElement("link");if(p.rel=f?"stylesheet":n2,f||(p.as="script"),p.crossOrigin="",p.href=h,c&&p.setAttribute("nonce",c),document.head.appendChild(p),f)return new Promise((g,v)=>{p.addEventListener("load",g),p.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},Du="https://www.gstatic.com/firebasejs/11.0.1",td="ckc_stand_cfg",ed="wn_firebase_cfg",s2="wn-wrist-demo-v1",r2=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];function a2(i){if(!i||typeof i!="string")return null;const t=i.trim();if(!t)return null;if(/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(t))return{databaseURL:t.replace(/\/$/,"")};try{const r=JSON.parse(t);if(r&&typeof r=="object"&&(r.databaseURL||r.projectId))return r}catch{}const e={},n=/([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;let s;for(;(s=n.exec(t))!==null;)e[s[1]]=s[3];return!e.databaseURL&&e.projectId&&(e.databaseURL=`https://${e.projectId}-default-rtdb.firebaseio.com`),e.databaseURL?e:null}function o2(){try{return localStorage.getItem(td)||localStorage.getItem(ed)||""}catch{return""}}function l2(i){try{localStorage.setItem(td,i),localStorage.setItem(ed,i)}catch{}}function Uu(){return String(Math.floor(1e5+Math.random()*9e5))}function c2(){return"h"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}function Nu(i){if(!i||typeof i!="string")return!1;const t=i.trim().toLowerCase();return!!(t.endsWith(".local")||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(t)||t.startsWith("fd")||t.startsWith("fc")||t.startsWith("fe80:"))}class h2{constructor({onSensor:t,onCalCommand:e,onHandSide:n,onStatus:s}={}){this.onSensor=t||(()=>{}),this.onCalCommand=e||(()=>{}),this.onHandSide=n||(()=>{}),this.onStatus=s||(()=>{}),this.mode="off",this.roomCode="",this.connected=!1,this.p2pOpen=!1,this.routeKind="idle",this.rttMs=null,this.rxHz=0,this.error=null,this.db=null,this.fbMod=null,this.unsubs=[],this.bc=null,this.pc=null,this.dcFast=null,this.dcCtrl=null,this.hid="",this.attempt=0,this.preferLanOnly=!1,this.peerJoined=!1,this.lastPongAt=0,this.lastFastRxAt=0,this.lastAnyRxAt=0,this.lastSeq=-1,this.rxTimes=[],this.pingTimer=null,this.watchdogTimer=null,this.wakeLock=null}async acquireWakeLock(){var t,e,n;try{typeof navigator<"u"&&((t=navigator.wakeLock)!=null&&t.request)&&!this.wakeLock&&(this.wakeLock=await navigator.wakeLock.request("screen"),(n=(e=this.wakeLock).addEventListener)==null||n.call(e,"release",()=>{this.wakeLock=null}))}catch{}}releaseWakeLock(){var t,e;try{(e=(t=this.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}this.wakeLock=null}startDemo(t=this.roomCode||Uu()){return this.stop(),this.mode="demo",this.roomCode=String(t),this.routeKind="demo",this.error=null,typeof BroadcastChannel<"u"&&(this.bc=new BroadcastChannel(s2),this.bc.onmessage=e=>{var s;const n=e==null?void 0:e.data;!n||String(n.room)!==this.roomCode||(n.k==="hello"?(this.connected=!0,this.p2pOpen=!0,(n.side==="left"||n.side==="right")&&this.onHandSide(n.side),(s=this.bc)==null||s.postMessage({k:"ack",room:this.roomCode,ts:Date.now()}),this._emitStatus()):n.k==="wrist"?(this.connected=!0,this.p2pOpen=!0,this._handlePacket(n,!0)):n.k==="cal"?this.onCalCommand(n.step):n.k==="hand_side"&&(n.side==="left"||n.side==="right")&&this.onHandSide(n.side))}),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"demo"}}async startFirebase(t){const e=a2(t);if(!e)return this.error="Вставьте корректный firebaseConfig или URL Realtime Database",this._emitStatus(),{ok:!1,error:this.error};l2(t),this.stop(),this.mode="firebase",this.roomCode=Uu(),this.error=null;try{const[{initializeApp:n,getApps:s},r]=await Promise.all([Lu(()=>import(`${Du}/firebase-app.js`),[],import.meta.url),Lu(()=>import(`${Du}/firebase-database.js`),[],import.meta.url)]),o=s().find(p=>p.name==="wn-wrist-host")||n(e,"wn-wrist-host");this.db=r.getDatabase(o,e.databaseURL),this.fbMod=r;const{ref:l,set:c,onValue:h,onChildAdded:f,onDisconnect:m}=r,u=`wn_wrist_rooms/${this.roomCode}`;await c(l(this.db,u),{createdAt:Date.now(),hostAlive:!0});try{m(l(this.db,`${u}/hostAlive`)).remove()}catch{}return this.unsubs.push(h(l(this.db,`${u}/wristJoined`),p=>{p.val()&&(this.peerJoined=!0,this.connected=!0,this.isFastHealthy()||this._startRtcOffer(!1),this._emitStatus())})),this.unsubs.push(h(l(this.db,`${u}/fbInput`),p=>{const g=p.val();g&&(this.connected=!0,this.isFastHealthy()||(this.routeKind="firebase",this._handlePacket(g,!1)))})),this.unsubs.push(h(l(this.db,`${u}/calCmd`),p=>{const g=p.val();!g||!g.step||Date.now()-(g.ts||0)<6e3&&this.onCalCommand(g.step)})),this.unsubs.push(h(l(this.db,`${u}/handSide`),p=>{const g=p.val();g&&(g.side==="left"||g.side==="right")&&this.onHandSide(g.side)})),this.unsubs.push(h(l(this.db,`${u}/rtc/hello`),p=>{const g=p.val();!g||!g.ts||(this.peerJoined=!0,this.connected=!0,this.isFastHealthy()||this._startRtcOffer(!1))})),this.unsubs.push(h(l(this.db,`${u}/rtc/answer`),async p=>{const g=p.val();if(!(!g||g.hid!==this.hid||!this.pc)&&this.pc.signalingState==="have-local-offer")try{await this.pc.setRemoteDescription({type:"answer",sdp:g.sdp})}catch{}})),this.unsubs.push(f(l(this.db,`${u}/rtc/wristCandidates`),async p=>{const g=p.val();if(!(!g||g.hid!==this.hid||!this.pc))try{await this.pc.addIceCandidate(g.candidate)}catch{}})),await this.acquireWakeLock(),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"firebase"}}catch(n){return this.error=(n==null?void 0:n.message)||"Ошибка подключения к Firebase",this._emitStatus(),{ok:!1,error:this.error}}}isFastHealthy(t=performance.now()){if(this.mode==="demo")return this.p2pOpen;if(!this.dcFast||this.dcFast.readyState!=="open")return!1;const e=this.lastPongAt?t-this.lastPongAt:0,n=this.lastFastRxAt?t-this.lastFastRxAt:0;return Math.min(e||0,n||0)<8500}async _startRtcOffer(t=!1){if(typeof RTCPeerConnection>"u"||!this.db||!this.fbMod)return;this._closePcOnly(),this.attempt+=1,this.hid=c2();const e=this.hid,n=this.preferLanOnly||!t&&this.attempt%2===1,s=n?[]:r2,{ref:r,set:a,push:o,remove:l}=this.fbMod,c=`wn_wrist_rooms/${this.roomCode}/rtc`;try{await Promise.all([l(r(this.db,`${c}/answer`)),l(r(this.db,`${c}/hostCandidates`)),l(r(this.db,`${c}/wristCandidates`))])}catch{}const h=new RTCPeerConnection({iceServers:s});this.pc=h;const f=h.createDataChannel("wrist-fast",{ordered:!1,maxRetransmits:0}),m=h.createDataChannel("wrist-ctrl",{ordered:!0});this.dcFast=f,this.dcCtrl=m;const u=()=>{this.hid===e&&(this.p2pOpen=!0,this.connected=!0,this.lastPongAt=performance.now(),this._inspectRoute(n),this._emitStatus())};f.onopen=u,m.onopen=u,f.onmessage=p=>this._onChannelMessage(p.data,!0),m.onmessage=p=>this._onChannelMessage(p.data,!1),h.onicecandidate=p=>{!p.candidate||this.hid!==e||o(r(this.db,`${c}/hostCandidates`),{hid:e,candidate:p.candidate.toJSON?p.candidate.toJSON():p.candidate}).catch(()=>{})},h.onconnectionstatechange=()=>{if(this.hid!==e)return;const p=h.connectionState;p==="connected"?(this.p2pOpen=!0,this._inspectRoute(n),this._emitStatus()):(p==="failed"||p==="closed")&&(this.p2pOpen=!1,this.routeKind=this.connected?"firebase":"idle",this._emitStatus())};try{const p=await h.createOffer();await h.setLocalDescription(p),await a(r(this.db,`${c}/offer`),{hid:e,sdp:p.sdp,iceMode:n?"lan":"stun",ts:Date.now()})}catch{}}async _inspectRoute(t){var e;if(!((e=this.pc)!=null&&e.getStats)){this.routeKind=t?"lan":"stun";return}try{const n=await this.pc.getStats();let s=null;const r=new Map;if(n.forEach(a=>{(a.type==="local-candidate"||a.type==="remote-candidate")&&r.set(a.id,a),a.type==="candidate-pair"&&(a.nominated||a.state==="succeeded")&&(s=a)}),s){const a=r.get(s.localCandidateId),o=r.get(s.remoteCandidateId),l=(a==null?void 0:a.candidateType)||"",c=(o==null?void 0:o.candidateType)||"",h=Number.isFinite(s.currentRoundTripTime)?s.currentRoundTripTime*1e3:null,m=t||(l==="host"||l==="prflx")&&(c==="host"||c==="prflx")&&(Nu(a==null?void 0:a.address)||Nu(o==null?void 0:o.address)||h!==null&&h<22);this.routeKind=m?"lan":"stun",m&&(this.preferLanOnly=!0);return}}catch{}this.routeKind=t?"lan":"stun"}_onChannelMessage(t,e){let n;try{n=typeof t=="string"?JSON.parse(t):null}catch{return}if(!n)return;const s=performance.now();if(n.k==="ping"){this._sendCtrl({k:"pong",t:n.t});return}if(n.k==="pong"){if(this.lastPongAt=s,Number.isFinite(n.t)){const r=Math.max(1,Math.round(s-n.t));this.rttMs=this.rttMs===null?r:Math.round(this.rttMs*.65+r*.35)}this._emitStatus();return}if(n.k==="cal"&&n.step){this.onCalCommand(n.step);return}if(n.k==="hand_side"&&(n.side==="left"||n.side==="right")){this.onHandSide(n.side);return}n.k==="wrist"&&(this.lastFastRxAt=s,this.p2pOpen=!0,this._handlePacket(n,e))}_sendCtrl(t){var n;const e=((n=this.dcCtrl)==null?void 0:n.readyState)==="open"?this.dcCtrl:this.dcFast;if((e==null?void 0:e.readyState)==="open")try{e.send(JSON.stringify(t))}catch{}}sendHandSide(t){const e=t==="left"?"left":"right",n={k:"hand_side",room:this.roomCode,side:e,ts:Date.now()};if(this.mode==="demo"&&this.bc&&this.bc.postMessage(n),this._sendCtrl(n),this.mode==="firebase"&&this.db&&this.fbMod&&this.roomCode){const{ref:s,set:r}=this.fbMod;r(s(this.db,`wn_wrist_rooms/${this.roomCode}/hostHandSide`),n).catch(()=>{})}}_handlePacket(t,e){const n=performance.now();if(e&&Number.isFinite(t.seq)){if(t.seq<=this.lastSeq&&this.lastSeq-t.seq<3e3)return;this.lastSeq=t.seq}for(this.lastAnyRxAt=n,this.rxTimes.push(n);this.rxTimes.length&&n-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:n})}injectPacket(t,e=performance.now()){this.connected=!0,this.p2pOpen=!0,this.routeKind="demo",this.lastAnyRxAt=e,this.rxHz=60,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:e})}_startMeters(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=setInterval(()=>{var e,n;const t=performance.now();for(;this.rxTimes.length&&t-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,(((e=this.dcFast)==null?void 0:e.readyState)==="open"||((n=this.dcCtrl)==null?void 0:n.readyState)==="open")&&this._sendCtrl({k:"ping",t:Math.round(t)}),this._emitStatus()},1e3),this.watchdogTimer=setInterval(()=>{this.mode!=="firebase"||!this.peerJoined||this.isFastHealthy()||(this.p2pOpen=!1,this._startRtcOffer(!1))},4200)}_closePcOnly(){var t,e,n;try{(t=this.dcFast)==null||t.close()}catch{}try{(e=this.dcCtrl)==null||e.close()}catch{}try{(n=this.pc)==null||n.close()}catch{}this.dcFast=null,this.dcCtrl=null,this.pc=null,this.p2pOpen=!1}stop(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=null,this.watchdogTimer=null;for(const t of this.unsubs)try{t()}catch{}if(this.unsubs=[],this._closePcOnly(),this.bc){try{this.bc.close()}catch{}this.bc=null}this.releaseWakeLock(),this.mode="off",this.connected=!1,this.peerJoined=!1,this.routeKind="idle",this.rxHz=0,this.rttMs=null,this._emitStatus()}status(){return{mode:this.mode,roomCode:this.roomCode,connected:this.connected,p2pOpen:this.isFastHealthy(),routeKind:this.routeKind,rttMs:this.rttMs,rxHz:this.rxHz,error:this.error,fresh:!!this.lastAnyRxAt&&performance.now()-this.lastAnyRxAt<1200}}_emitStatus(){this.onStatus(this.status())}}const u2=(i,t,e)=>Math.max(t,Math.min(e,i)),Z=i=>document.querySelector(i),Cn=i=>[...document.querySelectorAll(i)],f2=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let On;try{On=window.localStorage}catch{On={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let At=__(On),lt,fc="all",Fe=null,dc,Fu,Ou=null,es=0,pc=0,js=document.hidden,mc=null;const nd="white-night-vr-v1",id="white-night-wrist-cal-v1",gc=10;function d2(){try{const i=On.getItem(nd),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":t.mode==="hand"?"hand":"gyro",handSide:t.handSide==="left"?"left":"right",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",handSide:"right",quality:"high",leftHue:16,rightHue:338}}}let ie=d2(),Ee=null,me=null,we=null,mn=null,Qa="",zu=!1,De=!1,Br=!1,vc=!1,Ui=!1,to=0,ti=0,ei=!1,ai=!1,eo=!1,Pn=null,xc=!1,hl=!1,_i="",mr=0;const Wn=new $_;function Er(){try{On.setItem(nd,JSON.stringify(ie))}catch{}}const ku=new URLSearchParams(location.search).has("test"),rs=Cn("dialog");function Vr(i,t="neutral"){Z("#toast").dataset.tone=t,Z("#toast").textContent=i,Z("#toast").classList.add("visible"),clearTimeout(dc),dc=setTimeout(()=>Z("#toast").classList.remove("visible"),2600)}function xo(){y_(On,At)||(Z("#save-status").textContent="Сохранение недоступно в этом браузере",Vr("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function no(){Cn("[data-pose]").forEach(i=>{var t;i.disabled=At.phase!=="inspect"||!((t=lt==null?void 0:lt.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(lt==null?void 0:lt.pose)))})}function Ar(){var i;if(no(),!!lt){if(At.phase==="inspect"&&!((i=lt.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])Z("#"+t).disabled=!0;return}Z("#zoom-in").disabled=lt.zoom>=Ja.max,Z("#zoom-out").disabled=lt.zoom<=Ja.min,Z("#zoom-reset").disabled=lt.zoom===1,Z("#zoom-reset").textContent=`${Math.round(lt.zoom*100)}%`}}function sd(){Z("#completion-preview").replaceChildren(...At.lastKept.map(i=>{const t=document.createElement("img");return t.src=lt.thumbnail(i),t.alt=pn.find(e=>e.id===i).name,t}))}function hs(){var e;const i=At.phase==="inspect"&&((e=lt.revealState)==null?void 0:e.phase)||"ready";if(i===Ou)return;Ou=i,Z("#app").dataset.revealPhase=i,Z("#app").classList.toggle("is-revealing",i!=="ready"),Z(".inspection").setAttribute("aria-busy",String(i!=="ready")),Z("#keep").disabled=Z("#discard").disabled=i!=="ready",Ar();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};Z("#reveal-note").textContent=t[i]||"",Z("#reveal-note").hidden=i==="ready"}function p2(){const i=Z("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(Fu),Fu=setTimeout(()=>i.classList.remove("collected"),700)}function Bi(){Z("#app").classList.toggle("has-progress",At.searches>0),hs(),Ar(),x2(),Z("#app").classList.toggle("is-inspecting",At.phase==="inspect"),Z(".inspection").hidden=At.phase!=="inspect",At.phase==="inspect"&&(clearTimeout(dc),Z("#toast").classList.remove("visible")),Z("#header-count").innerHTML=`${String(At.collection.length).padStart(2,"0")} <small>/ 18</small>`,Z("#open-vr").disabled=At.phase==="inspect",Z("#search-total").textContent=String(At.searches).padStart(2,"0"),Z("#open-collection").disabled=At.phase==="inspect",Cn(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<At.taps)),Z(".tap-dots").setAttribute("aria-label",`Нажатий: ${At.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(Z("#search-caption").textContent=i[At.taps],Z("#search-button span").textContent=At.taps?"Продолжить поиск":"Порыться в баке",At.phase==="inspect"){const t=pn.find(n=>n.id===At.current),e=jf[t.rarity];Z("#find-name").textContent=t.name,Z("#find-description").textContent=t.description,Z("#find-era").textContent=t.era,Z("#find-rarity").innerHTML=`<i></i>${e.label}`,Z("#find-rarity").style.color=e.color,Z("#find-number").textContent=At.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(At.searches).padStart(3,"0")}`,Z("#duplicate-badge").hidden=At.reviewing||!At.collection.includes(t.id),Z(".decision-buttons").hidden=At.reviewing,Z("#close-review").hidden=!At.reviewing}}function io(){if(At.phase!=="search"||rs.some(t=>t.open)||js)return;lt.poke(At.taps+1);let i=mc||(At.searches===0?"camera":x_().id);At=vo(At,{type:"tap",itemId:i}),At.phase==="inspect"&&(mc=null,lt.show(At.current),xo(),De&&(ai=!0,ti=0,ei=!1,Wn.reset(),we==null||we.onPhaseChange("inspect",performance.now()))),Bi()}function Hs(i,{fromVr:t=!1}={}){var r;if(At.phase!=="inspect"||At.reviewing||!((r=lt.revealState)!=null&&r.ready))return;const e=pn.find(a=>a.id===At.current),n=At.collection.includes(e.id),s=At.collection.length;At=vo(At,{type:i?"keep":"discard"}),lt.hide(),xo(),Bi(),Vr(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&p2(),s<18&&At.collection.length===18&&(t?eo=!0:(sd(),Z("#complete-dialog").showModal()))}function rd(){Z("#collection-count").textContent=At.collection.length,Z("#collection-progress").style.width=`${At.collection.length/18*100}%`;const i=pn.filter(t=>fc==="all"||(fc==="junk"?t.rarity==="junk":t.rarity!=="junk"));Z("#collection-grid").replaceChildren(...i.map(t=>{const e=At.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(pn.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${lt.thumbnail(t.id)}">`:`<div class="locked-art">${f2("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":jf[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{Z("#collection-dialog").close(),At=vo(At,{type:"review",id:t.id}),lt.show(t.id,{review:!0}),Bi()}),n}))}function _c(){At.phase!=="inspect"&&(rd(),Z("#collection-dialog").showModal())}function Bu(){At.reviewing&&(At=vo(At,{type:"close"}),lt.hide(),Bi(),_c())}function ad(){At=kr(),lt.hide(),xo(),Bi(),Z("#reset-confirm").hidden=!0,Z("#reset-button").hidden=!1,Z("#settings-dialog").close(),Vr("Новая белая ночь. Начнём сначала.")}function m2(){const i=Z(".bin-tag");if(!i)return;const t=lt.binEdge();i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`}const od="white-night-look-hint-v1";let Hu=!1;function g2(){try{return On.getItem(od)==="done"}catch{return!0}}function v2(){const i=Z("#look-hint");if(!(!i||Hu&&i.hidden)){i.classList.add("used"),Hu=!0;try{On.setItem(od,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function x2(){const i=Z("#look-hint");if(i){if(g2()||At.phase==="inspect"){i.hidden=!0;return}i.hidden=De}}function bn(){return Ee||(Ee=new q_(Z("#vr-camera")),Ee.setHues(ie.leftHue,ie.rightHue),Ee.setMode(ie.mode==="fusion"?"fusion":"gyro")),Ee}function ld(){return me||(me=new K_(Z("#vr-hand-camera"))),me}function _2(){if(!we)return;const i=we.exportCalibration();if(i)try{On.setItem(id,JSON.stringify(i))}catch{}}function Hr(i){var s;const t=oi();me==null||me.process(!0);const e=(me==null?void 0:me.sample())||null,n=i==="pose1"?t.calibrateStretchPose(t.lastSensor,e):t.calibrateBendPose(t.lastSensor,e);return Qa=n.message||"",n.ok&&i==="pose2"&&_2(),(s=Z("#vr-dialog"))!=null&&s.open&&Xe(),n}function Zc(i,{fromRemote:t=!1}={}){var n,s,r;const e=i==="left"?"left":"right";ie.handSide=e,Er(),we&&we.setHandSide(e),(s=(n=lt==null?void 0:lt.vrHand)==null?void 0:n.setHandSide)==null||s.call(n,e),t||mn==null||mn.sendHandSide(e),(r=Z("#vr-dialog"))!=null&&r.open&&Xe()}function oi(){if(!we){we=new e2({handSide:ie.handSide});try{const i=On.getItem(id);i&&we.importCalibration(JSON.parse(i))}catch{}we.setHandSide(ie.handSide)}return mn||(mn=new h2({onSensor:i=>we.feedSensor(i),onCalCommand:i=>Hr(i),onHandSide:i=>Zc(i,{fromRemote:!0}),onStatus:()=>{var i;(i=Z("#vr-dialog"))!=null&&i.open&&Xe()}})),we}function y2(i){return i.gyro.fresh?ie.mode==="fusion"?!!i.marker.calibrated:ie.mode==="hand"?(oi(),(mn.status().connected||!!we.lastSensor)&&we.calibratedStep>=2):!0:!1}function Vu(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}const M2="<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>",S2="<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>",b2="В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.",w2="В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.";function Xe(){var c;const i=bn(),t=i.info(),e=t.gyro,n=t.marker,s=y2(t);Cn("[data-vr-mode]").forEach(h=>{const f=h.dataset.vrMode===ie.mode;h.classList.toggle("active",f),h.setAttribute("aria-pressed",String(f))}),Z("#vr-fusion-panel").hidden=ie.mode!=="fusion",Z("#vr-hand-panel").hidden=ie.mode!=="hand";const r=Z("#vr-how-cards"),a=Z("#vr-note-text");if(r){const h=ie.mode==="hand"?S2:M2;r.innerHTML!==h&&(r.innerHTML=h)}a&&(a.textContent=ie.mode==="hand"?w2:b2),Z("#vr-quality").value=ie.quality,Z("#vr-swatch-left").style.background=`hsl(${ie.leftHue} 95% 55%)`,Z("#vr-swatch-right").style.background=`hsl(${ie.rightHue} 95% 55%)`;const o=Z("#vr-gyro-btn");if(o.disabled=!!e.fresh||!e.supported,o.textContent=e.fresh?"Гироскоп готов":"Разрешить",o.classList.toggle("ready",!!e.fresh),Z("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",ie.mode==="fusion"){const[h,f]=n.markers||[];Z("#vr-start-camera").disabled=!!n.running,Z("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",Z("#vr-calibrate").disabled=!(h!=null&&h.usable&&(f!=null&&f.usable)),Z("#vr-pick-left").classList.toggle("active",Pn==="left"),Z("#vr-pick-right").classList.toggle("active",Pn==="right"),Z("#vr-camera").classList.toggle("picking",!!Pn);const m=Z("#vr-marker-status");m.textContent=_i||n.error||(Pn?`Коснитесь ${Pn==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((c=n.calibration)==null?void 0:c.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${h?Vu(h):"—"}. Правая метка: ${f?Vu(f):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),m.className=`vr-status-line ${_i||n.error?"warn":n.calibrated?"good":""}`}else if(ie.mode==="hand"){if(oi(),Cn("[data-hand-side]").forEach(v=>{const d=v.dataset.handSide===ie.handSide;v.classList.toggle("active",d),v.setAttribute("aria-pressed",String(d))}),!zu){zu=!0;const v=o2(),d=Z("#vr-hand-fb");d&&v?d.value=v:Z("#vr-hand-fb-details")&&(Z("#vr-hand-fb-details").open=!0)}const h=mn.status(),f=h.connected||!!we.lastSensor;Z("#vr-hand-code").textContent=h.roomCode||"——";const m=Z("#vr-hand-net-status");m.textContent=h.error?h.error:h.p2pOpen?h.routeKind==="demo"?`Демо-канал активен (${h.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${h.rttMs?` · ${h.rttMs} мс`:""}.`:h.connected?"☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).":h.roomCode?`Код комнаты ${h.roomCode} создан — введите его на странице браслета.`:"Создайте 6-значный код и введите его на втором телефоне.",m.className=`vr-status-line ${h.error?"warn":f?"good":""}`;const u=me==null?void 0:me.info();Z("#vr-hand-cam-btn").textContent=u!=null&&u.running?"Камера маяка вкл.":"Камера маяка (опц.)",Z("#vr-hand-camera").hidden=!(u!=null&&u.running),Z("#vr-hand-cal1").disabled=!f,Z("#vr-hand-cal2").disabled=!f||we.calibratedStep<1;const p=Z("#vr-hand-cal-status"),g=u!=null&&u.running?` Маяк в камере: ${u.status==="pair"?"видна пара пятен":u.status==="single"?"видно одно пятно":"пока не в кадре"}.`:"";p.textContent=(Qa||(we.calibratedStep>=2?"Калибровка двух жестов готова.":we.calibratedStep===1?"Шаг 1 записан — согните руку в локте и нажмите Жест 2.":f?"Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).":"Сначала подключите браслет."))+g,p.className=`vr-status-line ${we.calibratedStep>=2?"good":""}`}Z("#vr-start").disabled=!s||Ui;const l=Z("#vr-status");return l.textContent=Ui?"Надевайте очки и смотрите прямо перед собой…":e.fresh?ie.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":ie.mode==="hand"&&!s?"Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.":ie.mode==="hand"?"Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.":ie.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп очков.",l.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function cd(){if(At.phase==="inspect"){Vr("Сначала завершите осмотр находки.");return}const i=Z("#vr-dialog");i.open||(bn(),Xe(),i.showModal())}async function T2(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function E2(i=!1){i&&(xc=Z("#low-quality").checked,hl=ie.quality==="low",lt.low!==hl&&lt.setQuality(hl))}function hd(i=!1){if(!De)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==Br)&&(Br=t,lt.setVrStereo(t))}async function ud(){if(De||At.phase==="inspect")return!1;const i=bn(),t=ie.mode==="hand",e=Z("#vr-dialog");return i.setMode(ie.mode==="fusion"?"fusion":"gyro"),t&&(oi(),we.onPhaseChange("search",performance.now())),e.open&&(vc=!0,e.close(),vc=!1),E2(!0),i.start(),De=!0,ti=At.taps*(gc/3),ei=!1,ai=!1,Wn.reset(),document.body.classList.add("vr-active"),lt.setVrHandMode(t),Br=!1,hd(!0),lt.setHeadLook(0,0),lt.resize(),!0}async function A2(){if(Ui||!Xe().ready)return;await T2();const i=++to,t=Z("#vr-dialog"),e=Z("#vr-countdown");Ui=!0,e.hidden=!1,Xe();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==to||!t.open){Ui=!1,e.hidden=!0;return}Ui=!1,e.hidden=!0,await ud()}function _o(i="gesture"){var t;return!ai||At.phase!=="inspect"||At.reviewing?!1:((t=lt.revealState)!=null&&t.ready||(lt.finishReveal(),hs()),ai=!1,Wn.reset(),Hs(!0,{fromVr:!0}),ti=0,ei=!1,!0)}function Mr(i="exit"){var t;if(!De)return!1;ai&&_o("exit"),De=!1,to++,Ui=!1,Z("#vr-countdown").hidden=!0,Ee==null||Ee.stop(),me==null||me.stop(),lt.setVrHandMode(!1),lt.setVrStereo(!1),lt.setHeadLook(0,0),Br=!1,ti=0,ei=!1,Wn.reset(),document.body.classList.remove("vr-active","vr-single"),lt.low!==xc&&lt.setQuality(xc);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),lt.resize(),Bi(),eo?(eo=!1,sd(),Z("#complete-dialog").showModal()):i!=="hidden"&&Vr("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function yc(i){const t=Ee.update(i);return lt.setHeadLook(t.yaw,t.pitch),t}function so(i,t=performance.now()){var s,r,a;if(!De||!Ee)return;const e=yc(i),n=gc/3;if(ie.mode==="hand"){oi(),me==null||me.process(!1,t);const o=(me==null?void 0:me.sample(t))||null,l=lt.handHitsBin(),c=we.update(i,{beacon:o,headLook:lt.headLook,phase:At.phase,revealReady:!!((s=lt.revealState)!=null&&s.ready),handOverBin:l,now:t});if(lt.updateVrHand(i,{visible:!0,handSide:c.handSide,shoulderPos:c.shoulderPos,elbowPos:c.elbowPos,pos:c.pos,vel:c.vel,qArm:c.qArm,reach:c.reach,elbowBendDeg:c.elbowBendDeg,overBin:l,phase:At.phase,calmLowerProgress:c.calmLowerProgress,beaconActive:c.trackingSource==="gyro+beacon"}),At.phase==="search"){Wn.reset(),ei=l&&c.reach>=.62;for(let h=0;h<c.pokes&&At.phase==="search";h++)io()}else At.phase==="inspect"&&(ei=!1,lt.setHandItemRotation(c.itemRot.x,c.itemRot.y,c.itemRot.z),c.decision==="discard"?(ai=!1,Wn.reset(),lt.launchDiscardToss(c.throwVel),Hs(!1,{fromVr:!0}),we.onPhaseChange("search",t)):(c.decision==="keep"||(r=lt.revealState)!=null&&r.ready&&Wn.update(e.yaw,t))&&(ai=!1,Wn.reset(),Hs(!0,{fromVr:!0}),we.onPhaseChange("search",t)));return}if(At.phase==="search")if(Wn.reset(),ei=lt.gazeHitsBin(),ei){ti=Math.min(gc,ti+i);const o=Math.min(3,Math.floor(ti/n+1e-9));for(;At.phase==="search"&&At.taps<o;){const l=At.taps;if(io(),At.phase==="search"&&At.taps===l)break}}else ti=Math.max(At.taps*n,ti-i*1.5);else At.phase==="inspect"&&ai&&(ei=!1,(a=lt.revealState)!=null&&a.ready&&Wn.update(e.yaw,t)&&_o("gesture"))}function Qi(){return{active:De,stereo:Br,settings:{...ie},focus:+ti.toFixed(3),gazeHit:ei,pendingSave:ai,pendingCompletion:eo,shake:Wn.info(),look:(Ee==null?void 0:Ee.info())||null,wrist:we?{link:(mn==null?void 0:mn.status())||null,beacon:(me==null?void 0:me.info())||null,hand:we.snapshot()}:null,world:(lt==null?void 0:lt.vrInfo())||null}}function Gu(i,t,e=10,n=.03){const s=bn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),De?so(0,r.lastAt):yc(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),De?so(n,r.lastAt):yc(n);return lt.update(0),r.lastAt=performance.now(),Qi()}function fd(i){if(pc=requestAnimationFrame(fd),rs.some(n=>n.open)){Z("#vr-dialog").open&&!js&&(Ee==null||Ee.processPrep(),ie.mode==="hand"&&(me==null||me.process()),Xe()),es=i;return}if(js||lt.testRevealHold){es=i;return}const t=es?(i-es)/1e3:.016;es=i;const e=Math.min(t,.1);De&&so(e,i),lt.update(e,t),hs(),De||m2()}function R2(){Cn("[data-pose]").forEach(t=>t.addEventListener("click",()=>{lt.setPose(t.dataset.pose),no()})),Z("#zoom-in").addEventListener("click",()=>{lt.setZoom(.2),Ar()}),Z("#zoom-out").addEventListener("click",()=>{lt.setZoom(-.2),Ar()}),Z("#zoom-reset").addEventListener("click",()=>{lt.setZoom(1-lt.zoom),Ar()}),Z("#search-button").addEventListener("click",io),Z("#discard").addEventListener("click",()=>Hs(!1)),Z("#keep").addEventListener("click",()=>Hs(!0)),Z("#close-review").addEventListener("click",Bu),Z("#open-collection").addEventListener("click",_c),Z("#open-settings").addEventListener("click",()=>{Z("#reset-confirm").hidden=!0,Z("#reset-button").hidden=!1,Z("#settings-dialog").showModal()}),Z("#open-vr").addEventListener("click",cd),Cn("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{const e=t.dataset.vrMode;ie.mode=e==="fusion"?"fusion":e==="hand"?"hand":"gyro",Er(),Pn=null,_i="",bn().setMode(ie.mode==="fusion"?"fusion":"gyro"),Xe()})),Z("#vr-gyro-btn").addEventListener("click",async()=>{_i="",await bn().requestGyro(),Xe()}),Z("#vr-start-camera").addEventListener("click",async()=>{_i="";const t=bn();t.tracker.error=null,await t.startCamera(),Xe()}),Cn(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";_i="",Pn=Pn===e?null:e,Xe()})),Z("#vr-camera").addEventListener("click",t=>{if(!Pn)return;const e=bn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(Pn==="left"?ie.leftHue=Math.round(n.hue):ie.rightHue=Math.round(n.hue),e.setHues(ie.leftHue,ie.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Er(),_i="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",Pn=null,e.tracker.process(!0),Xe())}),Z("#vr-calibrate").addEventListener("click",()=>{const t=bn();t.tracker.process(!0);const e=t.tracker.calibrate();_i=e.ok?"":e.message,Xe()}),Cn("[data-hand-side]").forEach(t=>t.addEventListener("click",()=>Zc(t.dataset.handSide))),Z("#vr-hand-room-btn").addEventListener("click",async()=>{var t;oi(),Qa="",await mn.startFirebase(((t=Z("#vr-hand-fb"))==null?void 0:t.value)||""),Xe()}),Z("#vr-hand-demo-btn").addEventListener("click",()=>{oi(),Qa="",mn.startDemo("111111"),Xe()}),Z("#vr-hand-cam-btn").addEventListener("click",async()=>{const t=ld();t.running?t.stop():await t.start(Z("#vr-hand-camera")),Xe()}),Z("#vr-hand-cal1").addEventListener("click",()=>Hr("pose1")),Z("#vr-hand-cal2").addEventListener("click",()=>Hr("pose2")),Z("#vr-start").addEventListener("click",A2),Z("#vr-quality").value=ie.quality,Z("#vr-quality").addEventListener("change",t=>{ie.quality=t.target.value,Er()}),Cn("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),rs.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{Fe=null,es=0,t.id==="vr-dialog"&&!vc&&!De&&(to++,Ui=!1,Z("#vr-countdown").hidden=!0,Pn=null,_i="",Ee==null||Ee.stop(),me==null||me.stop())})}),Cn("[data-filter]").forEach(t=>t.addEventListener("click",()=>{fc=t.dataset.filter,Cn("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),rd()})),Z("#low-quality").addEventListener("change",t=>{lt.setQuality(t.target.checked),lt.update(.016);try{On.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),Z("#reset-button").addEventListener("click",()=>{Z("#reset-confirm").hidden=!1,Z("#reset-button").hidden=!0}),Z("#reset-cancel").addEventListener("click",()=>{Z("#reset-confirm").hidden=!0,Z("#reset-button").hidden=!1}),Z("#reset-yes").addEventListener("click",ad),Z("#continue-button").addEventListener("click",()=>Z("#complete-dialog").close()),Z("#view-complete").addEventListener("click",()=>{Z("#complete-dialog").close(),_c()});const i=Z("#world");i.addEventListener("pointerdown",t=>{if(De){clearTimeout(mr),mr=setTimeout(()=>Mr("long-press"),900);return}rs.some(e=>e.open)||Fe||!t.isPrimary||(At.phase==="inspect"&&(lt.finishReveal(),hs()),Fe={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!Fe||Fe.id!==t.pointerId)return;const e=t.clientX-Fe.x,n=t.clientY-Fe.y;Math.hypot(t.clientX-Fe.startX,t.clientY-Fe.startY)>10&&(Fe.moved=!0,At.phase!=="inspect"&&!De&&v2()),At.phase==="inspect"?(lt.rotate(e,n),no()):De||lt.lookBy(e,n),Fe.x=t.clientX,Fe.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout(mr),!Fe||Fe.id!==t.pointerId)return;const e=!Fe.moved;Fe=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&At.phase==="search"&&lt.hitBin(t.clientX,t.clientY)&&io()}),i.addEventListener("pointercancel",()=>{clearTimeout(mr),Fe=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout(mr),Fe=null}),document.addEventListener("visibilitychange",()=>{js=document.hidden,Fe=null,es=0,document.hidden&&De&&Mr("hidden")}),window.addEventListener("blur",()=>Fe=null),window.addEventListener("resize",()=>{lt.resize(),De&&hd(),rs.some(t=>t.open)&&lt.update(.016)}),document.addEventListener("fullscreenchange",()=>{De&&!document.fullscreenElement&&Mr("fullscreen")}),window.addEventListener("pagehide",()=>{ai&&_o("pagehide"),De&&(Ee==null||Ee.stop())}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&De){t.preventDefault(),Mr("escape");return}t.key==="Escape"&&!rs.some(e=>e.open)&&At.phase==="inspect"&&(t.preventDefault(),At.reviewing?Bu():(lt.finishReveal(),hs(),Hs(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),js=!0,Z("#webgl-error").hidden=!1})}async function C2(){try{lt=new v_(Z("#world"));try{On.getItem("white-night-quality")==="low"&&(lt.setQuality(!0),Z("#low-quality").checked=!0)}catch{}R2(),Bi(),await Promise.all([document.fonts.ready,wx()]),lt.update(.016),Z("#loading").hidden=!0,window.__READY__=!0,pc=requestAnimationFrame(fd),ku&&(window.__WORLD__=lt),ku&&(window.__GAME_TEST__={getState:()=>structuredClone(At),getMetrics:()=>lt.metrics(),settle:()=>{lt.finishReveal(),lt.kick=0,lt.dirty=!0,lt.update(.016),hs()},seekReveal:i=>{lt.testRevealHold=!0,lt.reveal=Math.max(0,Math.min(1,i)),lt.applyReveal(),lt.dirty=!0,lt.update(0),hs()},setPose:i=>{lt.setPose(i),lt.update(.1),no()},getRotation:()=>({x:lt.targetX,y:lt.targetY}),binScreen:()=>lt.binScreen(),forceNext:i=>{if(!pn.some(t=>t.id===i))throw Error("unknown item");mc=i},setView:i=>{const t=lt.setView(i);return lt.update(.016),t},look:(i,t)=>(lt.lookBy(0,0),lt.headLook.yaw=u2(i,-41,41)*Math.PI/180,lt.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,lt.applyCameraPose(),lt.dirty=!0,lt.update(.016),lt.lookInfo()),sky:()=>({stars:lt.sky.stars.geometry.attributes.position.count,moon:lt.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:lt.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{rs.forEach(i=>i.close()),ad()},setCollection:i=>{At=kr({collection:i,searches:i.length}),lt.hide(),xo(),Bi()},isPaused:()=>js,items:pn.map(i=>i.id),scene:()=>({staticVisible:lt.static.visible,drawCalls:lt.renderer.info.render.calls,headLook:lt.lookInfo(),sky:{stars:lt.sky.stars.geometry.attributes.position.count,moonVisible:lt.sky.moon.visible}}),vr:{info:()=>Qi(),open:()=>cd(),setMode:i=>(ie.mode=i==="fusion"?"fusion":i==="hand"?"hand":"gyro",Er(),bn().setMode(ie.mode==="fusion"?"fusion":"gyro"),Xe(),Qi()),setHandSide:i=>(Zc(i),Qi()),requestGyro:()=>bn().requestGyro(),gyro:(i,t,e=10,n=.03)=>Gu(i,t,e,n),marker:(i,t)=>bn().tracker.inject(i,t),calibrate:i=>bn().tracker.calibrate(i),wristDemo:i=>(oi(),mn.startDemo(i||"111111")),wristPacket:(i,t=performance.now())=>(oi(),mn.injectPacket(i,t),Qi()),wristBeacon:(i,t=performance.now())=>(oi(),ld().inject(i,t)),wristCalibrateStretch:()=>Hr("pose1"),wristCalibrateBend:()=>Hr("pose2"),start:()=>ud(),stop:()=>Mr("test"),step:(i=.1,t)=>{let e=Math.max(0,i),n=t;for(;e>0;){const s=Math.min(.05,e);n!==void 0&&(n+=s*1e3),Ee&&(Ee.gyro.lastAt=performance.now()),so(s,n!==void 0?n:performance.now()),e-=s}return lt.update(0),Qi()},shake:(i=25)=>{for(const t of[-i,i,-i])Gu(t,0,10,.03);return Qi()},settings:()=>({...ie}),finish:()=>_o("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),Z("#loading").hidden=!0,Z("#webgl-error").hidden=!1,cancelAnimationFrame(pc)}}C2();
