(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Uc="180",Wd=0,xh=1,Xd=2,gf=1,xf=2,wi=3,Yi=0,rn=1,Oe=2,cn=0,$s=1,Or=2,vh=3,_h=4,vf=5,Ri=100,qd=101,Yd=102,$d=103,Zd=104,Tl=200,Jd=201,Kd=202,jd=203,El=204,Al=205,_f=206,Qd=207,Mf=208,t0=209,e0=210,n0=211,i0=212,s0=213,r0=214,Rl=0,Cl=1,Pl=2,Js=3,Il=4,Ll=5,Dl=6,Ul=7,Nc=0,a0=1,o0=2,Wi=0,yf=1,Sf=2,bf=3,Fc=4,wf=5,Tf=6,Ef=7,Af=300,Ks=301,js=302,Nl=303,Fl=304,vo=306,ci=1e3,fs=1001,Ol=1002,un=1003,l0=1004,ea=1005,ii=1006,Uo=1007,ds=1008,hi=1009,Rf=1010,Cf=1011,zr=1012,Oc=1013,xs=1014,Wn=1015,ui=1016,zc=1017,Bc=1018,Qs=1020,Pf=35902,If=35899,Lf=1021,Df=1022,Un=1023,Br=1026,tr=1027,_o=1028,kc=1029,Uf=1030,Hc=1031,Gc=1033,qa=33776,Ya=33777,$a=33778,Za=33779,zl=35840,Bl=35841,kl=35842,Hl=35843,Gl=36196,Vl=37492,Wl=37496,Xl=37808,ql=37809,Yl=37810,$l=37811,Zl=37812,Jl=37813,Kl=37814,jl=37815,Ql=37816,tc=37817,ec=37818,nc=37819,ic=37820,sc=37821,rc=36492,ac=36494,oc=36495,lc=36283,cc=36284,hc=36285,uc=36286,c0=3200,h0=3201,Mo=0,u0=1,mn="",qe="srgb",er="srgb-linear",eo="linear",ve="srgb",Ss=7680,Mh=519,f0=512,d0=513,p0=514,Nf=515,m0=516,g0=517,x0=518,v0=519,fc=35044,na=35048,yh="300 es",si=2e3,no=2001;class ar{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sh=1234567;const Ir=Math.PI/180,kr=180/Math.PI;function ri(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function le(i,t,e){return Math.max(t,Math.min(e,i))}function Vc(i,t){return(i%t+t)%t}function _0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function M0(i,t,e){return i!==t?(e-i)/(t-i):0}function Lr(i,t,e){return(1-e)*i+e*t}function y0(i,t,e,n){return Lr(i,t,1-Math.exp(-e*n))}function S0(i,t=1){return t-Math.abs(Vc(i,t*2)-t)}function b0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function w0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function T0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function E0(i,t){return i+Math.random()*(t-i)}function A0(i){return i*(.5-Math.random())}function R0(i){i!==void 0&&(Sh=i);let t=Sh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function C0(i){return i*Ir}function P0(i){return i*kr}function I0(i){return(i&i-1)===0&&i!==0}function L0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function D0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function U0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),f=r((t-n)/2),d=a((t-n)/2),u=r((n-t)/2),m=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*f,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*f,o*c);break;case"ZXZ":i.set(l*f,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*u,o*c);break;case"YXY":i.set(l*u,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Vn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _e(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const kt={DEG2RAD:Ir,RAD2DEG:kr,generateUUID:ri,clamp:le,euclideanModulo:Vc,mapLinear:_0,inverseLerp:M0,lerp:Lr,damp:y0,pingpong:S0,smoothstep:b0,smootherstep:w0,randInt:T0,randFloat:E0,randFloatSpread:A0,seededRandom:R0,degToRad:C0,radToDeg:P0,isPowerOfTwo:I0,ceilPowerOfTwo:L0,floorPowerOfTwo:D0,setQuaternionFromProperEuler:U0,normalize:_e,denormalize:Vn};class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3];const d=r[a+0],u=r[a+1],m=r[a+2],x=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=x;return}if(f!==x||l!==d||c!==u||h!==m){let g=1-o;const p=l*d+c*u+h*m+f*x,v=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const T=Math.sqrt(M),b=Math.atan2(T,p*v);g=Math.sin(g*b)/T,o=Math.sin(o*b)/T}const _=o*v;if(l=l*g+d*_,c=c*g+u*_,h=h*g+m*_,f=f*g+x*_,g===1-o){const T=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=T,c*=T,h*=T,f*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],d=r[a+1],u=r[a+2],m=r[a+3];return t[e]=o*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-o*u,t[e+2]=c*m+h*u+o*d-l*f,t[e+3]=h*m-o*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),d=l(n/2),u=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=n+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(n>o&&n>f){const u=2*Math.sqrt(1+n-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-n-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-n-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(bh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(bh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return No.copy(this).projectOnVector(t),this.sub(No)}reflect(t){return this.sub(No.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const No=new D,bh=new Ne;class ae{constructor(t,e,n,s,r,a,o,l,c){ae.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],d=n[2],u=n[5],m=n[8],x=s[0],g=s[3],p=s[6],v=s[1],M=s[4],_=s[7],T=s[2],b=s[5],E=s[8];return r[0]=a*x+o*v+l*T,r[3]=a*g+o*M+l*b,r[6]=a*p+o*_+l*E,r[1]=c*x+h*v+f*T,r[4]=c*g+h*M+f*b,r[7]=c*p+h*_+f*E,r[2]=d*x+u*v+m*T,r[5]=d*g+u*M+m*b,r[8]=d*p+u*_+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,d=o*l-h*r,u=c*r-a*l,m=e*f+n*d+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=f*x,t[1]=(s*c-h*n)*x,t[2]=(o*n-s*a)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-o*e)*x,t[6]=u*x,t[7]=(n*l-c*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Fo.makeScale(t,e)),this}rotate(t){return this.premultiply(Fo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Fo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Fo=new ae;function Ff(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function N0(){const i=Hr("canvas");return i.style.display="block",i}const wh={};function Gr(i){i in wh||(wh[i]=!0,console.warn(i))}function F0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Th=new ae().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Eh=new ae().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function O0(){const i={enabled:!0,workingColorSpace:er,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ve&&(s.r=Pi(s.r),s.g=Pi(s.g),s.b=Pi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=Zs(s.r),s.g=Zs(s.g),s.b=Zs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===mn?eo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Gr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Gr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[er]:{primaries:t,whitePoint:n,transfer:eo,toXYZ:Th,fromXYZ:Eh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:t,whitePoint:n,transfer:ve,toXYZ:Th,fromXYZ:Eh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}}),i}const me=O0();function Pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let bs;class z0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{bs===void 0&&(bs=Hr("canvas")),bs.width=t.width,bs.height=t.height;const s=bs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=bs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Hr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Pi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Pi(e[n]/255)*255):e[n]=Pi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let B0=0;class Wc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:B0++}),this.uuid=ri(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Oo(s[a].image)):r.push(Oo(s[a]))}else r=Oo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Oo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?z0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let k0=0;const zo=new D;class je extends ar{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=fs,s=fs,r=ii,a=ds,o=Un,l=hi,c=je.DEFAULT_ANISOTROPY,h=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=ri(),this.name="",this.source=new Wc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ae,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(zo).x}get height(){return this.source.getSize(zo).y}get depth(){return this.source.getSize(zo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Af)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ci:t.x=t.x-Math.floor(t.x);break;case fs:t.x=t.x<0?0:1;break;case Ol:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ci:t.y=t.y-Math.floor(t.y);break;case fs:t.y=t.y<0?0:1;break;case Ol:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=Af;je.DEFAULT_ANISOTROPY=1;class ye{constructor(t=0,e=0,n=0,s=1){ye.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,_=(u+1)/2,T=(p+1)/2,b=(h+d)/4,E=(f+x)/4,w=(m+g)/4;return M>_&&M>T?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=b/n,r=E/n):_>T?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=b/s,r=w/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=E/r,s=w/r),this.set(n,s,r,e),this}let v=Math.sqrt((g-m)*(g-m)+(f-x)*(f-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(f-x)/v,this.z=(d-h)/v,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class H0 extends ar{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ii,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new je(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ii,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Wc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends H0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Of extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=fs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class G0 extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=fs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(On.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(On.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=On.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(t.matrixWorld),this.expandByPoint(On);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ia.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ia.copy(n.boundingBox)),ia.applyMatrix4(t.matrixWorld),this.union(ia)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,On),On.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ur),sa.subVectors(this.max,ur),ws.subVectors(t.a,ur),Ts.subVectors(t.b,ur),Es.subVectors(t.c,ur),Ui.subVectors(Ts,ws),Ni.subVectors(Es,Ts),ji.subVectors(ws,Es);let e=[0,-Ui.z,Ui.y,0,-Ni.z,Ni.y,0,-ji.z,ji.y,Ui.z,0,-Ui.x,Ni.z,0,-Ni.x,ji.z,0,-ji.x,-Ui.y,Ui.x,0,-Ni.y,Ni.x,0,-ji.y,ji.x,0];return!Bo(e,ws,Ts,Es,sa)||(e=[1,0,0,0,1,0,0,0,1],!Bo(e,ws,Ts,Es,sa))?!1:(ra.crossVectors(Ui,Ni),e=[ra.x,ra.y,ra.z],Bo(e,ws,Ts,Es,sa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,On).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(On).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(gi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const gi=[new D,new D,new D,new D,new D,new D,new D,new D],On=new D,ia=new Xn,ws=new D,Ts=new D,Es=new D,Ui=new D,Ni=new D,ji=new D,ur=new D,sa=new D,ra=new D,Qi=new D;function Bo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Qi.fromArray(i,r);const o=s.x*Math.abs(Qi.x)+s.y*Math.abs(Qi.y)+s.z*Math.abs(Qi.z),l=t.dot(Qi),c=e.dot(Qi),h=n.dot(Qi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const V0=new Xn,fr=new D,ko=new D;class Ms{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):V0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;fr.subVectors(t,this.center);const e=fr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(fr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ko.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(fr.copy(t.center).add(ko)),this.expandByPoint(fr.copy(t.center).sub(ko))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const xi=new D,Ho=new D,aa=new D,Fi=new D,Go=new D,oa=new D,Vo=new D;class Xc{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=xi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xi.copy(this.origin).addScaledVector(this.direction,e),xi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ho.copy(t).add(e).multiplyScalar(.5),aa.copy(e).sub(t).normalize(),Fi.copy(this.origin).sub(Ho);const r=t.distanceTo(e)*.5,a=-this.direction.dot(aa),o=Fi.dot(this.direction),l=-Fi.dot(aa),c=Fi.lengthSq(),h=Math.abs(1-a*a);let f,d,u,m;if(h>0)if(f=a*l-o,d=a*o-l,m=r*h,f>=0)if(d>=-m)if(d<=m){const x=1/h;f*=x,d*=x,u=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-r,-l),r),u=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ho).addScaledVector(aa,d),u}intersectSphere(t,e){xi.subVectors(t.center,this.origin);const n=xi.dot(this.direction),s=xi.dot(xi)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(o=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,xi)!==null}intersectTriangle(t,e,n,s,r){Go.subVectors(e,t),oa.subVectors(n,t),Vo.crossVectors(Go,oa);let a=this.direction.dot(Vo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Fi.subVectors(this.origin,t);const l=o*this.direction.dot(oa.crossVectors(Fi,oa));if(l<0)return null;const c=o*this.direction.dot(Go.cross(Fi));if(c<0||l+c>a)return null;const h=-o*Fi.dot(Vo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class te{constructor(t,e,n,s,r,a,o,l,c,h,f,d,u,m,x,g){te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,d,u,m,x,g)}set(t,e,n,s,r,a,o,l,c,h,f,d,u,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new te().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/As.setFromMatrixColumn(t,0).length(),r=1/As.setFromMatrixColumn(t,1).length(),a=1/As.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const d=a*h,u=a*f,m=o*h,x=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-x*c,e[9]=-o*l,e[2]=x-d*c,e[6]=m+u*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,x=c*f;e[0]=d+x*o,e[4]=m*o-u,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=u*o-m,e[6]=x+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,x=c*f;e[0]=d-x*o,e[4]=-a*f,e[8]=m+u*o,e[1]=u+m*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*h,u=a*f,m=o*h,x=o*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+x,e[1]=l*f,e[5]=x*c+d,e[9]=u*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,u=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=x-d*f,e[8]=m*f+u,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-x*f}else if(t.order==="XZY"){const d=a*l,u=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+x,e[5]=a*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=o*h,e[10]=x*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(W0,t,X0)}lookAt(t,e,n){const s=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Oi.crossVectors(n,Mn),Oi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Oi.crossVectors(n,Mn)),Oi.normalize(),la.crossVectors(Mn,Oi),s[0]=Oi.x,s[4]=la.x,s[8]=Mn.x,s[1]=Oi.y,s[5]=la.y,s[9]=Mn.y,s[2]=Oi.z,s[6]=la.z,s[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],d=n[9],u=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],M=n[7],_=n[11],T=n[15],b=s[0],E=s[4],w=s[8],y=s[12],S=s[1],R=s[5],L=s[9],P=s[13],U=s[2],O=s[6],z=s[10],V=s[14],k=s[3],B=s[7],q=s[11],Q=s[15];return r[0]=a*b+o*S+l*U+c*k,r[4]=a*E+o*R+l*O+c*B,r[8]=a*w+o*L+l*z+c*q,r[12]=a*y+o*P+l*V+c*Q,r[1]=h*b+f*S+d*U+u*k,r[5]=h*E+f*R+d*O+u*B,r[9]=h*w+f*L+d*z+u*q,r[13]=h*y+f*P+d*V+u*Q,r[2]=m*b+x*S+g*U+p*k,r[6]=m*E+x*R+g*O+p*B,r[10]=m*w+x*L+g*z+p*q,r[14]=m*y+x*P+g*V+p*Q,r[3]=v*b+M*S+_*U+T*k,r[7]=v*E+M*R+_*O+T*B,r[11]=v*w+M*L+_*z+T*q,r[15]=v*y+M*P+_*V+T*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+r*l*f-s*c*f-r*o*d+n*c*d+s*o*u-n*l*u)+x*(+e*l*u-e*c*d+r*a*d-s*a*u+s*c*h-r*l*h)+g*(+e*c*f-e*o*u-r*a*f+n*a*u+r*o*h-n*c*h)+p*(-s*o*h-e*l*f+e*o*d+s*a*f-n*a*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],x=t[13],g=t[14],p=t[15],v=f*g*c-x*d*c+x*l*u-o*g*u-f*l*p+o*d*p,M=m*d*c-h*g*c-m*l*u+a*g*u+h*l*p-a*d*p,_=h*x*c-m*f*c+m*o*u-a*x*u-h*o*p+a*f*p,T=m*f*l-h*x*l-m*o*d+a*x*d+h*o*g-a*f*g,b=e*v+n*M+s*_+r*T;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/b;return t[0]=v*E,t[1]=(x*d*r-f*g*r-x*s*u+n*g*u+f*s*p-n*d*p)*E,t[2]=(o*g*r-x*l*r+x*s*c-n*g*c-o*s*p+n*l*p)*E,t[3]=(f*l*r-o*d*r-f*s*c+n*d*c+o*s*u-n*l*u)*E,t[4]=M*E,t[5]=(h*g*r-m*d*r+m*s*u-e*g*u-h*s*p+e*d*p)*E,t[6]=(m*l*r-a*g*r-m*s*c+e*g*c+a*s*p-e*l*p)*E,t[7]=(a*d*r-h*l*r+h*s*c-e*d*c-a*s*u+e*l*u)*E,t[8]=_*E,t[9]=(m*f*r-h*x*r-m*n*u+e*x*u+h*n*p-e*f*p)*E,t[10]=(a*x*r-m*o*r+m*n*c-e*x*c-a*n*p+e*o*p)*E,t[11]=(h*o*r-a*f*r-h*n*c+e*f*c+a*n*u-e*o*u)*E,t[12]=T*E,t[13]=(h*x*s-m*f*s+m*n*d-e*x*d-h*n*g+e*f*g)*E,t[14]=(m*o*s-a*x*s-m*n*l+e*x*l+a*n*g-e*o*g)*E,t[15]=(a*f*s-h*o*s+h*n*l-e*f*l-a*n*d+e*o*d)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,d=r*c,u=r*h,m=r*f,x=a*h,g=a*f,p=o*f,v=l*c,M=l*h,_=l*f,T=n.x,b=n.y,E=n.z;return s[0]=(1-(x+p))*T,s[1]=(u+_)*T,s[2]=(m-M)*T,s[3]=0,s[4]=(u-_)*b,s[5]=(1-(d+p))*b,s[6]=(g+v)*b,s[7]=0,s[8]=(m+M)*E,s[9]=(g-v)*E,s[10]=(1-(d+x))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=As.set(s[0],s[1],s[2]).length();const a=As.set(s[4],s[5],s[6]).length(),o=As.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],zn.copy(this);const c=1/r,h=1/a,f=1/o;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=h,zn.elements[5]*=h,zn.elements[6]*=h,zn.elements[8]*=f,zn.elements[9]*=f,zn.elements[10]*=f,e.setFromRotationMatrix(zn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=si,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===si)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===no)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=si,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),d=-(e+t)/(e-t),u=-(n+s)/(n-s);let m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===si)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===no)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const As=new D,zn=new te,W0=new D(0,0,0),X0=new D(1,1,1),Oi=new D,la=new D,Mn=new D,Ah=new te,Rh=new Ne;class xn{constructor(t=0,e=0,n=0,s=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ah.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ah,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Rh.setFromEuler(this),this.setFromQuaternion(Rh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class qc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let q0=0;const Ch=new D,Rs=new Ne,vi=new te,ca=new D,dr=new D,Y0=new D,$0=new Ne,Ph=new D(1,0,0),Ih=new D(0,1,0),Lh=new D(0,0,1),Dh={type:"added"},Z0={type:"removed"},Cs={type:"childadded",child:null},Wo={type:"childremoved",child:null};class ke extends ar{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:q0++}),this.uuid=ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ke.DEFAULT_UP.clone();const t=new D,e=new xn,n=new Ne,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new te},normalMatrix:{value:new ae}}),this.matrix=new te,this.matrixWorld=new te,this.matrixAutoUpdate=ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Rs.setFromAxisAngle(t,e),this.quaternion.multiply(Rs),this}rotateOnWorldAxis(t,e){return Rs.setFromAxisAngle(t,e),this.quaternion.premultiply(Rs),this}rotateX(t){return this.rotateOnAxis(Ph,t)}rotateY(t){return this.rotateOnAxis(Ih,t)}rotateZ(t){return this.rotateOnAxis(Lh,t)}translateOnAxis(t,e){return Ch.copy(t).applyQuaternion(this.quaternion),this.position.add(Ch.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ph,t)}translateY(t){return this.translateOnAxis(Ih,t)}translateZ(t){return this.translateOnAxis(Lh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ca.copy(t):ca.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),dr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(dr,ca,this.up):vi.lookAt(ca,dr,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),Rs.setFromRotationMatrix(vi),this.quaternion.premultiply(Rs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dh),Cs.child=t,this.dispatchEvent(Cs),Cs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Z0),Wo.child=t,this.dispatchEvent(Wo),Wo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vi.multiply(t.parent.matrixWorld)),t.applyMatrix4(vi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dh),Cs.child=t,this.dispatchEvent(Cs),Cs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dr,t,Y0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dr,$0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),d=a(t.skeletons),u=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),u.length>0&&(n.animations=u),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ke.DEFAULT_UP=new D(0,1,0);ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Bn=new D,_i=new D,Xo=new D,Mi=new D,Ps=new D,Is=new D,Uh=new D,qo=new D,Yo=new D,$o=new D,Zo=new ye,Jo=new ye,Ko=new ye;class Ln{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Bn.subVectors(t,e),s.cross(Bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Bn.subVectors(s,e),_i.subVectors(n,e),Xo.subVectors(t,e);const a=Bn.dot(Bn),o=Bn.dot(_i),l=Bn.dot(Xo),c=_i.dot(_i),h=_i.dot(Xo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,u=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-u-m,m,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mi.x),l.addScaledVector(a,Mi.y),l.addScaledVector(o,Mi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Zo.setScalar(0),Jo.setScalar(0),Ko.setScalar(0),Zo.fromBufferAttribute(t,e),Jo.fromBufferAttribute(t,n),Ko.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Zo,r.x),a.addScaledVector(Jo,r.y),a.addScaledVector(Ko,r.z),a}static isFrontFacing(t,e,n,s){return Bn.subVectors(n,e),_i.subVectors(t,e),Bn.cross(_i).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Bn.cross(_i).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Ln.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Ps.subVectors(s,n),Is.subVectors(r,n),qo.subVectors(t,n);const l=Ps.dot(qo),c=Is.dot(qo);if(l<=0&&c<=0)return e.copy(n);Yo.subVectors(t,s);const h=Ps.dot(Yo),f=Is.dot(Yo);if(h>=0&&f<=h)return e.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ps,a);$o.subVectors(t,r);const u=Ps.dot($o),m=Is.dot($o);if(m>=0&&u<=m)return e.copy(r);const x=u*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(Is,o);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return Uh.subVectors(r,s),o=(f-h)/(f-h+(u-m)),e.copy(s).addScaledVector(Uh,o);const p=1/(g+x+d);return a=x*p,o=d*p,e.copy(n).addScaledVector(Ps,a).addScaledVector(Is,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},ha={h:0,s:0,l:0};function jo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=Vc(t,1),e=le(e,0,1),n=le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=jo(a,r,t+1/3),this.g=jo(a,r,t),this.b=jo(a,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const n=zf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}copyLinearToSRGB(t){return this.r=Zs(t.r),this.g=Zs(t.g),this.b=Zs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return me.workingToColorSpace(en.copy(this),t),Math.round(le(en.r*255,0,255))*65536+Math.round(le(en.g*255,0,255))*256+Math.round(le(en.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(en.copy(this),e);const n=en.r,s=en.g,r=en.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=qe){me.workingToColorSpace(en.copy(this),t);const e=en.r,n=en.g,s=en.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(zi),this.setHSL(zi.h+t,zi.s+e,zi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(zi),t.getHSL(ha);const n=Lr(zi.h,ha.h,e),s=Lr(zi.s,ha.s,e),r=Lr(zi.l,ha.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const en=new qt;qt.NAMES=zf;let J0=0;class Li extends ar{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:J0++}),this.uuid=ri(),this.name="",this.type="Material",this.blending=$s,this.side=Yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=El,this.blendDst=Al,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Js,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ss,this.stencilZFail=Ss,this.stencilZPass=Ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$s&&(n.blending=this.blending),this.side!==Yi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==El&&(n.blendSrc=this.blendSrc),this.blendDst!==Al&&(n.blendDst=this.blendDst),this.blendEquation!==Ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Js&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ss&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ss&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ss&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ke extends Li{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=Nc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ze=new D,ua=new ut;let K0=0;class Ce{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:K0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=fc,this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ua.fromBufferAttribute(this,e),ua.applyMatrix3(t),this.setXY(e,ua.x,ua.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Vn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Vn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Vn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Vn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Vn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==fc&&(t.usage=this.usage),t}}class Bf extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class kf extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}}let j0=0;const Rn=new te,Qo=new ke,Ls=new D,yn=new Xn,pr=new Xn,We=new D;class Ae extends ar{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ff(t)?kf:Bf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ae().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Rn.makeRotationFromQuaternion(t),this.applyMatrix4(Rn),this}rotateX(t){return Rn.makeRotationX(t),this.applyMatrix4(Rn),this}rotateY(t){return Rn.makeRotationY(t),this.applyMatrix4(Rn),this}rotateZ(t){return Rn.makeRotationZ(t),this.applyMatrix4(Rn),this}translate(t,e,n){return Rn.makeTranslation(t,e,n),this.applyMatrix4(Rn),this}scale(t,e,n){return Rn.makeScale(t,e,n),this.applyMatrix4(Rn),this}lookAt(t){return Qo.lookAt(t),Qo.updateMatrix(),this.applyMatrix4(Qo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ls).negate(),this.translate(Ls.x,Ls.y,Ls.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(We.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(We),We.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(We)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ms);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];pr.setFromBufferAttribute(o),this.morphTargetsRelative?(We.addVectors(yn.min,pr.min),yn.expandByPoint(We),We.addVectors(yn.max,pr.max),yn.expandByPoint(We)):(yn.expandByPoint(pr.min),yn.expandByPoint(pr.max))}yn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)We.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(We));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)We.fromBufferAttribute(o,c),l&&(Ls.fromBufferAttribute(t,c),We.add(Ls)),s=Math.max(s,n.distanceToSquared(We))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let w=0;w<n.count;w++)o[w]=new D,l[w]=new D;const c=new D,h=new D,f=new D,d=new ut,u=new ut,m=new ut,x=new D,g=new D;function p(w,y,S){c.fromBufferAttribute(n,w),h.fromBufferAttribute(n,y),f.fromBufferAttribute(n,S),d.fromBufferAttribute(r,w),u.fromBufferAttribute(r,y),m.fromBufferAttribute(r,S),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const R=1/(u.x*m.y-m.x*u.y);isFinite(R)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(R),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(R),o[w].add(x),o[y].add(x),o[S].add(x),l[w].add(g),l[y].add(g),l[S].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let w=0,y=v.length;w<y;++w){const S=v[w],R=S.start,L=S.count;for(let P=R,U=R+L;P<U;P+=3)p(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const M=new D,_=new D,T=new D,b=new D;function E(w){T.fromBufferAttribute(s,w),b.copy(T);const y=o[w];M.copy(y),M.sub(T.multiplyScalar(T.dot(y))).normalize(),_.crossVectors(b,y);const R=_.dot(l[w])<0?-1:1;a.setXYZW(w,M.x,M.y,M.z,R)}for(let w=0,y=v.length;w<y;++w){const S=v[w],R=S.start,L=S.count;for(let P=R,U=R+L;P<U;P+=3)E(t.getX(P+0)),E(t.getX(P+1)),E(t.getX(P+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,u=n.count;d<u;d++)n.setXYZ(d,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,f=new D;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)We.fromBufferAttribute(t,e),We.normalize(),t.setXYZ(e,We.x,We.y,We.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?u=l[x]*o.data.stride+o.offset:u=l[x]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new Ce(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,n);l.push(u)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nh=new te,ts=new Xc,fa=new Ms,Fh=new D,da=new D,pa=new D,ma=new D,tl=new D,ga=new D,Oh=new D,xa=new D;class Gt extends ke{constructor(t=new Ae,e=new Ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){ga.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(tl.fromBufferAttribute(f,t),a?ga.addScaledVector(tl,h):ga.addScaledVector(tl.sub(e),h))}e.add(ga)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(r),ts.copy(t.ray).recast(t.near),!(fa.containsPoint(ts.origin)===!1&&(ts.intersectSphere(fa,Fh)===null||ts.origin.distanceToSquared(Fh)>(t.far-t.near)**2))&&(Nh.copy(r).invert(),ts.copy(t.ray).applyMatrix4(Nh),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ts)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],v=Math.max(g.start,u.start),M=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let _=v,T=M;_<T;_+=3){const b=o.getX(_),E=o.getX(_+1),w=o.getX(_+2);s=va(this,p,t,n,c,h,f,b,E,w),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),x=Math.min(o.count,u.start+u.count);for(let g=m,p=x;g<p;g+=3){const v=o.getX(g),M=o.getX(g+1),_=o.getX(g+2);s=va(this,a,t,n,c,h,f,v,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){const g=d[m],p=a[g.materialIndex],v=Math.max(g.start,u.start),M=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let _=v,T=M;_<T;_+=3){const b=_,E=_+1,w=_+2;s=va(this,p,t,n,c,h,f,b,E,w),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),x=Math.min(l.count,u.start+u.count);for(let g=m,p=x;g<p;g+=3){const v=g,M=g+1,_=g+2;s=va(this,a,t,n,c,h,f,v,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Q0(i,t,e,n,s,r,a,o){let l;if(t.side===rn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Yi,o),l===null)return null;xa.copy(o),xa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(xa);return c<e.near||c>e.far?null:{distance:c,point:xa.clone(),object:i}}function va(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,da),i.getVertexPosition(l,pa),i.getVertexPosition(c,ma);const h=Q0(i,t,e,n,da,pa,ma,Oh);if(h){const f=new D;Ln.getBarycoord(Oh,da,pa,ma,f),s&&(h.uv=Ln.getInterpolatedAttribute(s,o,l,c,f,new ut)),r&&(h.uv1=Ln.getInterpolatedAttribute(r,o,l,c,f,new ut)),a&&(h.normal=Ln.getInterpolatedAttribute(a,o,l,c,f,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new D,materialIndex:0};Ln.getNormal(da,pa,ma,d.normal),h.face=d,h.barycoord=f}return h}class Yn extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(f,2));function m(x,g,p,v,M,_,T,b,E,w,y){const S=_/E,R=T/w,L=_/2,P=T/2,U=b/2,O=E+1,z=w+1;let V=0,k=0;const B=new D;for(let q=0;q<z;q++){const Q=q*R-P;for(let at=0;at<O;at++){const dt=at*S-L;B[x]=dt*v,B[g]=Q*M,B[p]=U,c.push(B.x,B.y,B.z),B[x]=0,B[g]=0,B[p]=b>0?1:-1,h.push(B.x,B.y,B.z),f.push(at/E),f.push(1-q/w),V+=1}}for(let q=0;q<w;q++)for(let Q=0;Q<E;Q++){const at=d+Q+O*q,dt=d+Q+O*(q+1),Ct=d+(Q+1)+O*(q+1),It=d+(Q+1)+O*q;l.push(at,dt,It),l.push(dt,Ct,It),k+=6}o.addGroup(u,k,y),u+=k,d+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function nr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ln(i){const t={};for(let e=0;e<i.length;e++){const n=nr(i[e]);for(const s in n)t[s]=n[s]}return t}function tp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Hf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const ps={clone:nr,merge:ln};var ep=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,np=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends Li{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ep,this.fragmentShader=np,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=nr(t.uniforms),this.uniformsGroups=tp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Gf extends ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new te,this.projectionMatrix=new te,this.projectionMatrixInverse=new te,this.coordinateSystem=si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new D,zh=new ut,Bh=new ut;class sn extends Gf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=kr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return kr*2*Math.atan(Math.tan(Ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bi.x,Bi.y).multiplyScalar(-t/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bi.x,Bi.y).multiplyScalar(-t/Bi.z)}getViewSize(t,e){return this.getViewBounds(t,zh,Bh),e.subVectors(Bh,zh)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ir*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ds=-90,Us=1;class ip extends ke{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Ds,Us,t,e);s.layers=this.layers,this.add(s);const r=new sn(Ds,Us,t,e);r.layers=this.layers,this.add(r);const a=new sn(Ds,Us,t,e);a.layers=this.layers,this.add(a);const o=new sn(Ds,Us,t,e);o.layers=this.layers,this.add(o);const l=new sn(Ds,Us,t,e);l.layers=this.layers,this.add(l);const c=new sn(Ds,Us,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===no)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Vf extends je{constructor(t=[],e=Ks,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class sp extends Tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Vf(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Yn(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:nr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:cn});r.uniforms.tEquirect.value=e;const a=new Gt(s,r),o=e.minFilter;return e.minFilter===ds&&(e.minFilter=ii),new ip(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class ie extends ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const rp={type:"move"};class el{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(rp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ie;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Yc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new qt(t),this.density=e}clone(){return new Yc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class dc extends ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ap{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=fc,this.updateRanges=[],this.version=0,this.uuid=ri()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const on=new D;class io{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyMatrix4(t),this.setXYZ(e,on.x,on.y,on.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyNormalMatrix(t),this.setXYZ(e,on.x,on.y,on.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.transformDirection(t),this.setXYZ(e,on.x,on.y,on.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Vn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Vn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Vn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Vn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Vn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new io(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class pc extends Li{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ns;const mr=new D,Fs=new D,Os=new D,zs=new ut,gr=new ut,Wf=new te,_a=new D,xr=new D,Ma=new D,kh=new ut,nl=new ut,Hh=new ut;class Gh extends ke{constructor(t=new pc){if(super(),this.isSprite=!0,this.type="Sprite",Ns===void 0){Ns=new Ae;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ap(e,5);Ns.setIndex([0,1,2,0,2,3]),Ns.setAttribute("position",new io(n,3,0,!1)),Ns.setAttribute("uv",new io(n,2,3,!1))}this.geometry=Ns,this.material=t,this.center=new ut(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Fs.setFromMatrixScale(this.matrixWorld),Wf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Os.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Fs.multiplyScalar(-Os.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;ya(_a.set(-.5,-.5,0),Os,a,Fs,s,r),ya(xr.set(.5,-.5,0),Os,a,Fs,s,r),ya(Ma.set(.5,.5,0),Os,a,Fs,s,r),kh.set(0,0),nl.set(1,0),Hh.set(1,1);let o=t.ray.intersectTriangle(_a,xr,Ma,!1,mr);if(o===null&&(ya(xr.set(-.5,.5,0),Os,a,Fs,s,r),nl.set(0,1),o=t.ray.intersectTriangle(_a,Ma,xr,!1,mr),o===null))return;const l=t.ray.origin.distanceTo(mr);l<t.near||l>t.far||e.push({distance:l,point:mr.clone(),uv:Ln.getInterpolation(mr,_a,xr,Ma,kh,nl,Hh,new ut),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function ya(i,t,e,n,s,r){zs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(gr.x=r*zs.x-s*zs.y,gr.y=s*zs.x+r*zs.y):gr.copy(zs),i.copy(t),i.x+=gr.x,i.y+=gr.y,i.applyMatrix4(Wf)}class $c extends je{constructor(t=null,e=1,n=1,s,r,a,o,l,c=un,h=un,f,d){super(null,a,o,l,c,h,s,r,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vh extends Ce{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Bs=new te,Wh=new te,Sa=[],Xh=new Xn,op=new te,vr=new Gt,_r=new Ms;class lp extends Gt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Vh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,op)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Xn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Bs),Xh.copy(t.boundingBox).applyMatrix4(Bs),this.boundingBox.union(Xh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ms),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Bs),_r.copy(t.boundingSphere).applyMatrix4(Bs),this.boundingSphere.union(_r)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(vr.geometry=this.geometry,vr.material=this.material,vr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_r.copy(this.boundingSphere),_r.applyMatrix4(n),t.ray.intersectsSphere(_r)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Bs),Wh.multiplyMatrices(n,Bs),vr.matrixWorld=Wh,vr.raycast(t,Sa);for(let a=0,o=Sa.length;a<o;a++){const l=Sa[a];l.instanceId=r,l.object=this,e.push(l)}Sa.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Vh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new $c(new Float32Array(s*this.count),s,this.count,_o,Wn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const il=new D,cp=new D,hp=new ae;class os{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=il.subVectors(n,e).cross(cp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(il),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||hp.getNormalMatrix(t),s=this.coplanarPoint(il).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const es=new Ms,up=new ut(.5,.5),ba=new D;class Zc{constructor(t=new os,e=new os,n=new os,s=new os,r=new os,a=new os){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=si,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],d=r[6],u=r[7],m=r[8],x=r[9],g=r[10],p=r[11],v=r[12],M=r[13],_=r[14],T=r[15];if(s[0].setComponents(c-a,u-h,p-m,T-v).normalize(),s[1].setComponents(c+a,u+h,p+m,T+v).normalize(),s[2].setComponents(c+o,u+f,p+x,T+M).normalize(),s[3].setComponents(c-o,u-f,p-x,T-M).normalize(),n)s[4].setComponents(l,d,g,_).normalize(),s[5].setComponents(c-l,u-d,p-g,T-_).normalize();else if(s[4].setComponents(c-l,u-d,p-g,T-_).normalize(),e===si)s[5].setComponents(c+l,u+d,p+g,T+_).normalize();else if(e===no)s[5].setComponents(l,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(t){es.center.set(0,0,0);const e=up.distanceTo(t.center);return es.radius=.7071067811865476+e,es.applyMatrix4(t.matrixWorld),this.intersectsSphere(es)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ba.x=s.normal.x>0?t.max.x:t.min.x,ba.y=s.normal.y>0?t.max.y:t.min.y,ba.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ba)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Xf extends Li{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const qh=new te,mc=new Xc,wa=new Ms,Ta=new D;class fp extends ke{constructor(t=new Ae,e=new Xf){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(s),wa.radius+=r,t.ray.intersectsSphere(wa)===!1)return;qh.copy(s).invert(),mc.copy(t.ray).applyMatrix4(qh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let m=d,x=u;m<x;m++){const g=c.getX(m);Ta.fromBufferAttribute(f,g),Yh(Ta,g,l,s,t,e,this)}}else{const d=Math.max(0,a.start),u=Math.min(f.count,a.start+a.count);for(let m=d,x=u;m<x;m++)Ta.fromBufferAttribute(f,m),Yh(Ta,m,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Yh(i,t,e,n,s,r,a){const o=mc.distanceSqToPoint(i);if(o<e){const l=new D;mc.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class dp extends je{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Jc extends je{constructor(t,e,n=xs,s,r,a,o=un,l=un,c,h=Br,f=1){if(h!==Br&&h!==tr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:f};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Wc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class qf extends je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class $i extends Ae{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new D,h=new ut;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=n+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $i(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Fe extends Ae{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],d=[],u=[];let m=0;const x=[],g=n/2;let p=0;v(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new he(f,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(u,2));function v(){const _=new D,T=new D;let b=0;const E=(e-t)/n;for(let w=0;w<=r;w++){const y=[],S=w/r,R=S*(e-t)+t;for(let L=0;L<=s;L++){const P=L/s,U=P*l+o,O=Math.sin(U),z=Math.cos(U);T.x=R*O,T.y=-S*n+g,T.z=R*z,f.push(T.x,T.y,T.z),_.set(O,E,z).normalize(),d.push(_.x,_.y,_.z),u.push(P,1-S),y.push(m++)}x.push(y)}for(let w=0;w<s;w++)for(let y=0;y<r;y++){const S=x[y][w],R=x[y+1][w],L=x[y+1][w+1],P=x[y][w+1];(t>0||y!==0)&&(h.push(S,R,P),b+=3),(e>0||y!==r-1)&&(h.push(R,L,P),b+=3)}c.addGroup(p,b,0),p+=b}function M(_){const T=m,b=new ut,E=new D;let w=0;const y=_===!0?t:e,S=_===!0?1:-1;for(let L=1;L<=s;L++)f.push(0,g*S,0),d.push(0,S,0),u.push(.5,.5),m++;const R=m;for(let L=0;L<=s;L++){const U=L/s*l+o,O=Math.cos(U),z=Math.sin(U);E.x=y*z,E.y=g*S,E.z=y*O,f.push(E.x,E.y,E.z),d.push(0,S,0),b.x=O*.5+.5,b.y=z*.5*S+.5,u.push(b.x,b.y),m++}for(let L=0;L<s;L++){const P=T+L,U=R+L;_===!0?h.push(U,U+1,P):h.push(U+1,U,P),w+=3}c.addGroup(p,w,_===!0?1:2),p+=w}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fe(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Kc extends Ae{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(r.slice(),3)),this.setAttribute("uv",new he(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const M=new D,_=new D,T=new D;for(let b=0;b<e.length;b+=3)u(e[b+0],M),u(e[b+1],_),u(e[b+2],T),l(M,_,T,v)}function l(v,M,_,T){const b=T+1,E=[];for(let w=0;w<=b;w++){E[w]=[];const y=v.clone().lerp(_,w/b),S=M.clone().lerp(_,w/b),R=b-w;for(let L=0;L<=R;L++)L===0&&w===b?E[w][L]=y:E[w][L]=y.clone().lerp(S,L/R)}for(let w=0;w<b;w++)for(let y=0;y<2*(b-w)-1;y++){const S=Math.floor(y/2);y%2===0?(d(E[w][S+1]),d(E[w+1][S]),d(E[w][S])):(d(E[w][S+1]),d(E[w+1][S+1]),d(E[w+1][S]))}}function c(v){const M=new D;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(v),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){const v=new D;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];const _=g(v)/2/Math.PI+.5,T=p(v)/Math.PI+.5;a.push(_,1-T)}m(),f()}function f(){for(let v=0;v<a.length;v+=6){const M=a[v+0],_=a[v+2],T=a[v+4],b=Math.max(M,_,T),E=Math.min(M,_,T);b>.9&&E<.1&&(M<.2&&(a[v+0]+=1),_<.2&&(a[v+2]+=1),T<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function u(v,M){const _=v*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function m(){const v=new D,M=new D,_=new D,T=new D,b=new ut,E=new ut,w=new ut;for(let y=0,S=0;y<r.length;y+=9,S+=6){v.set(r[y+0],r[y+1],r[y+2]),M.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),b.set(a[S+0],a[S+1]),E.set(a[S+2],a[S+3]),w.set(a[S+4],a[S+5]),T.copy(v).add(M).add(_).divideScalar(3);const R=g(T);x(b,S+0,v,R),x(E,S+2,M,R),x(w,S+4,_,R)}}function x(v,M,_,T){T<0&&v.x===1&&(a[M]=v.x-1),_.x===0&&_.z===0&&(a[M]=T/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kc(t.vertices,t.indices,t.radius,t.details)}}class di{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,u=(a-h)/d;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ut:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new D,s=[],r=[],a=[],o=new D,l=new te;for(let u=0;u<=t;u++){const m=u/t;s[u]=this.getTangentAt(m,new D)}r[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(le(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(l.makeRotationAxis(o,m))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(le(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],u*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Vr extends di{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ut){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class pp extends Vr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function jc(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+f)+(l-o)/f;d*=h,u*=h,s(a,o,d,u)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Ea=new D,sl=new jc,rl=new jc,al=new jc;class Ii extends di{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Ea.subVectors(s[0],s[1]).add(s[0]),c=Ea);const f=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ea.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ea),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),x=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),sl.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,x,g),rl.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,x,g),al.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(sl.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),rl.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),al.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return n.set(sl.calc(l),rl.calc(l),al.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function $h(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function mp(i,t){const e=1-i;return e*e*t}function gp(i,t){return 2*(1-i)*i*t}function xp(i,t){return i*i*t}function Dr(i,t,e,n){return mp(i,t)+gp(i,e)+xp(i,n)}function vp(i,t){const e=1-i;return e*e*e*t}function _p(i,t){const e=1-i;return 3*e*e*i*t}function Mp(i,t){return 3*(1-i)*i*i*t}function yp(i,t){return i*i*i*t}function Ur(i,t,e,n,s){return vp(i,t)+_p(i,e)+Mp(i,n)+yp(i,s)}class Yf extends di{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ur(t,s.x,r.x,a.x,o.x),Ur(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Sp extends di{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ur(t,s.x,r.x,a.x,o.x),Ur(t,s.y,r.y,a.y,o.y),Ur(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $f extends di{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wr extends di{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zf extends di{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Dr(t,s.x,r.x,a.x),Dr(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jf extends di{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Dr(t,s.x,r.x,a.x),Dr(t,s.y,r.y,a.y),Dr(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kf extends di{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set($h(o,l.x,c.x,h.x,f.x),$h(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var so=Object.freeze({__proto__:null,ArcCurve:pp,CatmullRomCurve3:Ii,CubicBezierCurve:Yf,CubicBezierCurve3:Sp,EllipseCurve:Vr,LineCurve:$f,LineCurve3:Wr,QuadraticBezierCurve:Zf,QuadraticBezierCurve3:Jf,SplineCurve:Kf});class bp extends di{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new so[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new so[s.type]().fromJSON(s))}return this}}class ro extends bp{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new $f(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Zf(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Yf(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Kf(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Vr(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Di extends ro{constructor(t){super(t),this.uuid=ri(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ro().fromJSON(s))}return this}}function wp(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=jf(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Cp(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,f=-1/0;for(let d=e;d<s;d+=e){const u=i[d],m=i[d+1];u<o&&(o=u),m<l&&(l=m),u>h&&(h=u),m>f&&(f=m)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Xr(r,a,e,o,l,c,0),a}function jf(i,t,e,n,s){let r;if(s===kp(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Zh(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Zh(a/n|0,i[a],i[a+1],r);return r&&ir(r,r.next)&&(Yr(r),r=r.next),r}function vs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ir(e,e.next)||De(e.prev,e,e.next)===0)){if(Yr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Xr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Up(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Ep(i,n,s,r):Tp(i)){t.push(l.i,i.i,c.i),Yr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Ap(vs(i),t),Xr(i,t,e,n,s,r,2)):a===2&&Rp(i,t,e,n,s,r):Xr(vs(i),t,e,n,s,r,1);break}}}function Tp(i){const t=i.prev,e=i,n=i.next;if(De(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),d=Math.max(s,r,a),u=Math.max(o,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&wr(s,o,r,l,a,c,m.x,m.y)&&De(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Ep(i,t,e,n){const s=i.prev,r=i,a=i.next;if(De(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,d=a.y,u=Math.min(o,l,c),m=Math.min(h,f,d),x=Math.max(o,l,c),g=Math.max(h,f,d),p=gc(u,m,t,e,n),v=gc(x,g,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=v;){if(M.x>=u&&M.x<=x&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&wr(o,h,l,f,c,d,M.x,M.y)&&De(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=u&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&wr(o,h,l,f,c,d,_.x,_.y)&&De(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=u&&M.x<=x&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&wr(o,h,l,f,c,d,M.x,M.y)&&De(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=v;){if(_.x>=u&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&wr(o,h,l,f,c,d,_.x,_.y)&&De(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Ap(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ir(n,s)&&td(n,e,e.next,s)&&qr(n,s)&&qr(s,n)&&(t.push(n.i,e.i,s.i),Yr(e),Yr(e.next),e=i=s),e=e.next}while(e!==i);return vs(e)}function Rp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Op(a,o)){let l=ed(a,o);a=vs(a,a.next),l=vs(l,l.next),Xr(a,t,e,n,s,r,0),Xr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Cp(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=jf(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Fp(c))}s.sort(Pp);for(let r=0;r<s.length;r++)e=Ip(s[r],e);return e}function Pp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Ip(i,t){const e=Lp(i,t);if(!e)return t;const n=ed(e,i);return vs(n,n.next),vs(e,e.next)}function Lp(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(ir(i,e))return e;do{if(ir(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Qf(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);qr(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&Dp(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function Dp(i,t){return De(i.prev,i,t.prev)<0&&De(t.next,i,i.next)<0}function Up(i,t,e,n){let s=i;do s.z===0&&(s.z=gc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Np(s)}function Np(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function gc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Fp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Qf(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function wr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Qf(i,t,e,n,s,r,a,o)}function Op(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!zp(i,t)&&(qr(i,t)&&qr(t,i)&&Bp(i,t)&&(De(i.prev,i,t.prev)||De(i,t.prev,t))||ir(i,t)&&De(i.prev,i,i.next)>0&&De(t.prev,t,t.next)>0)}function De(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ir(i,t){return i.x===t.x&&i.y===t.y}function td(i,t,e,n){const s=Ra(De(i,t,e)),r=Ra(De(i,t,n)),a=Ra(De(e,n,i)),o=Ra(De(e,n,t));return!!(s!==r&&a!==o||s===0&&Aa(i,e,t)||r===0&&Aa(i,n,t)||a===0&&Aa(e,i,n)||o===0&&Aa(e,t,n))}function Aa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ra(i){return i>0?1:i<0?-1:0}function zp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&td(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function qr(i,t){return De(i.prev,i,i.next)<0?De(i,t,i.next)>=0&&De(i,i.prev,t)>=0:De(i,t,i.prev)<0||De(i,i.next,t)<0}function Bp(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function ed(i,t){const e=xc(i.i,i.x,i.y),n=xc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Zh(i,t,e,n){const s=xc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Yr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function xc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function kp(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Hp{static triangulate(t,e,n=2){return wp(t,e,n)}}class Ci{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ci.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Jh(t),Kh(n,t);let a=t.length;e.forEach(Jh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Kh(n,e[l]);const o=Hp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Jh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Kh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class yo extends Ae{constructor(t=new Di([new ut(.5,.5),new ut(-.5,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new he(s,3)),this.setAttribute("uv",new he(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:u-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:Gp;let M,_=!1,T,b,E,w;p&&(M=p.getSpacedPoints(h),_=!0,d=!1,T=p.computeFrenetFrames(h,!1),b=new D,E=new D,w=new D),d||(g=0,u=0,m=0,x=0);const y=o.extractPoints(c);let S=y.shape;const R=y.holes;if(!Ci.isClockWise(S)){S=S.reverse();for(let J=0,j=R.length;J<j;J++){const rt=R[J];Ci.isClockWise(rt)&&(R[J]=rt.reverse())}}function P(J){const rt=10000000000000001e-36;let st=J[0];for(let mt=1;mt<=J.length;mt++){const ct=mt%J.length,ft=J[ct],$t=ft.x-st.x,xt=ft.y-st.y,I=$t*$t+xt*xt,A=Math.max(Math.abs(ft.x),Math.abs(ft.y),Math.abs(st.x),Math.abs(st.y)),W=rt*A*A;if(I<=W){J.splice(ct,1),mt--;continue}st=ft}}P(S),R.forEach(P);const U=R.length,O=S;for(let J=0;J<U;J++){const j=R[J];S=S.concat(j)}function z(J,j,rt){return j||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(j,rt)}const V=S.length;function k(J,j,rt){let st,mt,ct;const ft=J.x-j.x,$t=J.y-j.y,xt=rt.x-J.x,I=rt.y-J.y,A=ft*ft+$t*$t,W=ft*I-$t*xt;if(Math.abs(W)>Number.EPSILON){const K=Math.sqrt(A),lt=Math.sqrt(xt*xt+I*I),Z=j.x-$t/K,Et=j.y+ft/K,pt=rt.x-I/lt,Pt=rt.y+xt/lt,zt=((pt-Z)*I-(Pt-Et)*xt)/(ft*I-$t*xt);st=Z+ft*zt-J.x,mt=Et+$t*zt-J.y;const vt=st*st+mt*mt;if(vt<=2)return new ut(st,mt);ct=Math.sqrt(vt/2)}else{let K=!1;ft>Number.EPSILON?xt>Number.EPSILON&&(K=!0):ft<-Number.EPSILON?xt<-Number.EPSILON&&(K=!0):Math.sign($t)===Math.sign(I)&&(K=!0),K?(st=-$t,mt=ft,ct=Math.sqrt(A)):(st=ft,mt=$t,ct=Math.sqrt(A/2))}return new ut(st/ct,mt/ct)}const B=[];for(let J=0,j=O.length,rt=j-1,st=J+1;J<j;J++,rt++,st++)rt===j&&(rt=0),st===j&&(st=0),B[J]=k(O[J],O[rt],O[st]);const q=[];let Q,at=B.concat();for(let J=0,j=U;J<j;J++){const rt=R[J];Q=[];for(let st=0,mt=rt.length,ct=mt-1,ft=st+1;st<mt;st++,ct++,ft++)ct===mt&&(ct=0),ft===mt&&(ft=0),Q[st]=k(rt[st],rt[ct],rt[ft]);q.push(Q),at=at.concat(Q)}let dt;if(g===0)dt=Ci.triangulateShape(O,R);else{const J=[],j=[];for(let rt=0;rt<g;rt++){const st=rt/g,mt=u*Math.cos(st*Math.PI/2),ct=m*Math.sin(st*Math.PI/2)+x;for(let ft=0,$t=O.length;ft<$t;ft++){const xt=z(O[ft],B[ft],ct);Mt(xt.x,xt.y,-mt),st===0&&J.push(xt)}for(let ft=0,$t=U;ft<$t;ft++){const xt=R[ft];Q=q[ft];const I=[];for(let A=0,W=xt.length;A<W;A++){const K=z(xt[A],Q[A],ct);Mt(K.x,K.y,-mt),st===0&&I.push(K)}st===0&&j.push(I)}}dt=Ci.triangulateShape(J,j)}const Ct=dt.length,It=m+x;for(let J=0;J<V;J++){const j=d?z(S[J],at[J],It):S[J];_?(E.copy(T.normals[0]).multiplyScalar(j.x),b.copy(T.binormals[0]).multiplyScalar(j.y),w.copy(M[0]).add(E).add(b),Mt(w.x,w.y,w.z)):Mt(j.x,j.y,0)}for(let J=1;J<=h;J++)for(let j=0;j<V;j++){const rt=d?z(S[j],at[j],It):S[j];_?(E.copy(T.normals[J]).multiplyScalar(rt.x),b.copy(T.binormals[J]).multiplyScalar(rt.y),w.copy(M[J]).add(E).add(b),Mt(w.x,w.y,w.z)):Mt(rt.x,rt.y,f/h*J)}for(let J=g-1;J>=0;J--){const j=J/g,rt=u*Math.cos(j*Math.PI/2),st=m*Math.sin(j*Math.PI/2)+x;for(let mt=0,ct=O.length;mt<ct;mt++){const ft=z(O[mt],B[mt],st);Mt(ft.x,ft.y,f+rt)}for(let mt=0,ct=R.length;mt<ct;mt++){const ft=R[mt];Q=q[mt];for(let $t=0,xt=ft.length;$t<xt;$t++){const I=z(ft[$t],Q[$t],st);_?Mt(I.x,I.y+M[h-1].y,M[h-1].x+rt):Mt(I.x,I.y,f+rt)}}}$(),it();function $(){const J=s.length/3;if(d){let j=0,rt=V*j;for(let st=0;st<Ct;st++){const mt=dt[st];bt(mt[2]+rt,mt[1]+rt,mt[0]+rt)}j=h+g*2,rt=V*j;for(let st=0;st<Ct;st++){const mt=dt[st];bt(mt[0]+rt,mt[1]+rt,mt[2]+rt)}}else{for(let j=0;j<Ct;j++){const rt=dt[j];bt(rt[2],rt[1],rt[0])}for(let j=0;j<Ct;j++){const rt=dt[j];bt(rt[0]+V*h,rt[1]+V*h,rt[2]+V*h)}}n.addGroup(J,s.length/3-J,0)}function it(){const J=s.length/3;let j=0;gt(O,j),j+=O.length;for(let rt=0,st=R.length;rt<st;rt++){const mt=R[rt];gt(mt,j),j+=mt.length}n.addGroup(J,s.length/3-J,1)}function gt(J,j){let rt=J.length;for(;--rt>=0;){const st=rt;let mt=rt-1;mt<0&&(mt=J.length-1);for(let ct=0,ft=h+g*2;ct<ft;ct++){const $t=V*ct,xt=V*(ct+1),I=j+st+$t,A=j+mt+$t,W=j+mt+xt,K=j+st+xt;Yt(I,A,W,K)}}}function Mt(J,j,rt){l.push(J),l.push(j),l.push(rt)}function bt(J,j,rt){Ot(J),Ot(j),Ot(rt);const st=s.length/3,mt=v.generateTopUV(n,s,st-3,st-2,st-1);F(mt[0]),F(mt[1]),F(mt[2])}function Yt(J,j,rt,st){Ot(J),Ot(j),Ot(st),Ot(j),Ot(rt),Ot(st);const mt=s.length/3,ct=v.generateSideWallUV(n,s,mt-6,mt-3,mt-2,mt-1);F(ct[0]),F(ct[1]),F(ct[3]),F(ct[1]),F(ct[2]),F(ct[3])}function Ot(J){s.push(l[J*3+0]),s.push(l[J*3+1]),s.push(l[J*3+2])}function F(J){r.push(J.x),r.push(J.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Vp(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new so[s.type]().fromJSON(s)),new yo(n,t.options)}}const Gp={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ut(r,a),new ut(o,l),new ut(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],f=t[n*3+2],d=t[s*3],u=t[s*3+1],m=t[s*3+2],x=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ut(a,1-l),new ut(c,1-f),new ut(d,1-m),new ut(x,1-p)]:[new ut(o,1-l),new ut(h,1-f),new ut(u,1-m),new ut(g,1-p)]}};function Vp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class So extends Kc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new So(t.radius,t.detail)}}class bo extends Ae{constructor(t=[new ut(0,-.5),new ut(.5,0),new ut(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=le(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new D,d=new ut,u=new D,m=new D,x=new D;let g=0,p=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:g=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,u.x=p*1,u.y=-g,u.z=p*0,x.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:g=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,u.x=p*1,u.y=-g,u.z=p*0,m.copy(u),u.x+=x.x,u.y+=x.y,u.z+=x.z,u.normalize(),l.push(u.x,u.y,u.z),x.copy(m)}for(let v=0;v<=e;v++){const M=n+v*h*s,_=Math.sin(M),T=Math.cos(M);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*_,f.y=t[b].y,f.z=t[b].x*T,a.push(f.x,f.y,f.z),d.x=v/e,d.y=b/(t.length-1),o.push(d.x,d.y);const E=l[3*b+0]*_,w=l[3*b+1],y=l[3*b+0]*T;c.push(E,w,y)}}for(let v=0;v<e;v++)for(let M=0;M<t.length-1;M++){const _=M+v*t.length,T=_,b=_+t.length,E=_+t.length+1,w=_+1;r.push(T,b,w),r.push(E,w,b)}this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bo(t.points,t.segments,t.phiStart,t.phiLength)}}class fe extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,d=e/l,u=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const v=p*d-a;for(let M=0;M<c;M++){const _=M*f-r;m.push(_,-v,0),x.push(0,0,1),g.push(M/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<o;v++){const M=v+c*p,_=v+c*(p+1),T=v+1+c*(p+1),b=v+1+c*p;u.push(M,_,b),u.push(_,T,b)}this.setIndex(u),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fe(t.width,t.height,t.widthSegments,t.heightSegments)}}class wo extends Ae{constructor(t=new Di([new ut(0,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new he(s,3)),this.setAttribute("normal",new he(r,3)),this.setAttribute("uv",new he(a,2));function c(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;Ci.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const v=m[g];Ci.isClockWise(v)===!0&&(m[g]=v.reverse())}const x=Ci.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const v=m[g];u=u.concat(v)}for(let g=0,p=u.length;g<p;g++){const v=u[g];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let g=0,p=x.length;g<p;g++){const v=x[g],M=v[0]+f,_=v[1]+f,T=v[2]+f;n.push(M,_,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Wp(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new wo(n,t.curveSegments)}}function Wp(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class or extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new D,d=new D,u=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){const v=[],M=p/n;let _=0;p===0&&a===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let T=0;T<=e;T++){const b=T/e;f.x=-t*Math.cos(s+b*r)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(s+b*r)*Math.sin(a+M*o),m.push(f.x,f.y,f.z),d.copy(f).normalize(),x.push(d.x,d.y,d.z),g.push(b+_,1-M),v.push(c++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const M=h[p][v+1],_=h[p][v],T=h[p+1][v],b=h[p+1][v+1];(p!==0||a>0)&&u.push(M,_,b),(p!==n-1||l<Math.PI)&&u.push(_,T,b)}this.setIndex(u),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new or(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ai extends Ae{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new D,f=new D,d=new D;for(let u=0;u<=n;u++)for(let m=0;m<=s;m++){const x=m/s*r,g=u/n*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(x),f.y=(t+e*Math.cos(g))*Math.sin(x),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(u/n)}for(let u=1;u<=n;u++)for(let m=1;m<=s;m++){const x=(s+1)*u+m-1,g=(s+1)*(u-1)+m-1,p=(s+1)*(u-1)+m,v=(s+1)*u+m;a.push(x,g,v),a.push(g,p,v)}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(l,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class wn extends Ae{constructor(t=new Jf(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new D,l=new D,c=new ut;let h=new D;const f=[],d=[],u=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new he(f,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(u,2));function x(){for(let M=0;M<e;M++)g(M);g(r===!1?e:0),v(),p()}function g(M){h=t.getPointAt(M/e,h);const _=a.normals[M],T=a.binormals[M];for(let b=0;b<=s;b++){const E=b/s*Math.PI*2,w=Math.sin(E),y=-Math.cos(E);l.x=y*_.x+w*T.x,l.y=y*_.y+w*T.y,l.z=y*_.z+w*T.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,f.push(o.x,o.y,o.z)}}function p(){for(let M=1;M<=e;M++)for(let _=1;_<=s;_++){const T=(s+1)*(M-1)+(_-1),b=(s+1)*M+(_-1),E=(s+1)*M+_,w=(s+1)*(M-1)+_;m.push(T,b,w),m.push(b,E,w)}}function v(){for(let M=0;M<=e;M++)for(let _=0;_<=s;_++)c.x=M/e,c.y=_/s,u.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new wn(new so[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Xp extends hn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class At extends Li{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mo,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class qs extends At{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ut(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return le(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new qt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class qp extends Li{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mo,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Yp extends Li{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mo,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=Nc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class $p extends Li{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=c0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Zp extends Li{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const ol={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Jp{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,d=c.length;f<d;f+=2){const u=c[f],m=c[f+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Kp=new Jp;class Qc{constructor(t){this.manager=t!==void 0?t:Kp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Qc.DEFAULT_MATERIAL_NAME="__DEFAULT";const ks=new WeakMap;class jp extends Qc{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=ol.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let f=ks.get(a);f===void 0&&(f=[],ks.set(a,f)),f.push({onLoad:e,onError:s})}return a}const o=Hr("img");function l(){h(),e&&e(this);const f=ks.get(this)||[];for(let d=0;d<f.length;d++){const u=f[d];u.onLoad&&u.onLoad(this)}ks.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),ol.remove(`image:${t}`);const d=ks.get(this)||[];for(let u=0;u<d.length;u++){const m=d[u];m.onError&&m.onError(f)}ks.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ol.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class nd extends Qc{constructor(t){super(t)}load(t,e,n,s){const r=new je,a=new jp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class th extends ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class jh extends th{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ll=new te,Qh=new D,tu=new D;class id{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.mapType=hi,this.map=null,this.mapPass=null,this.matrix=new te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zc,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Qh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qh),tu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tu),e.updateMatrixWorld(),ll.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ll,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ll)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const eu=new te,Mr=new D,cl=new D;class Qp extends id{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new ye(2,1,1,1),new ye(0,1,1,1),new ye(3,1,1,1),new ye(1,1,1,1),new ye(3,0,1,1),new ye(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Mr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Mr),cl.copy(n.position),cl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(cl),n.updateMatrixWorld(),s.makeTranslation(-Mr.x,-Mr.y,-Mr.z),eu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eu,n.coordinateSystem,n.reversedDepth)}}class ao extends th{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Qp}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class eh extends Gf{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class tm extends id{constructor(){super(new eh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ca extends th{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.target=new ke,this.shadow=new tm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class em extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class nm{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const nu=new te;class im{constructor(t,e,n=0,s=1/0){this.ray=new Xc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new qc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return nu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nu),this}intersectObject(t,e=!0,n=[]){return vc(t,this,n,e),n.sort(iu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)vc(t[s],this,n,e);return n.sort(iu),n}}function iu(i,t){return i.distance-t.distance}function vc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)vc(r[a],t,e,!0)}}function su(i,t,e,n){const s=sm(n);switch(e){case Lf:return i*t;case _o:return i*t/s.components*s.byteLength;case kc:return i*t/s.components*s.byteLength;case Uf:return i*t*2/s.components*s.byteLength;case Hc:return i*t*2/s.components*s.byteLength;case Df:return i*t*3/s.components*s.byteLength;case Un:return i*t*4/s.components*s.byteLength;case Gc:return i*t*4/s.components*s.byteLength;case qa:case Ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case $a:case Za:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Bl:case Hl:return Math.max(i,16)*Math.max(t,8)/4;case zl:case kl:return Math.max(i,8)*Math.max(t,8)/2;case Gl:case Vl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ql:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Yl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case $l:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Zl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Jl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Kl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case jl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ql:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case tc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ec:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case nc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ic:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case sc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case rc:case ac:case oc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case lc:case cc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case hc:case uc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function sm(i){switch(i){case hi:case Rf:return{byteLength:1,components:1};case zr:case Cf:case ui:return{byteLength:2,components:1};case zc:case Bc:return{byteLength:2,components:4};case xs:case Oc:case Wn:return{byteLength:4,components:1};case Pf:case If:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function sd(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function rm(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=i.SHORT;else if(c instanceof Uint32Array)u=i.UNSIGNED_INT;else if(c instanceof Int32Array)u=i.INT;else if(c instanceof Int8Array)u=i.BYTE;else if(c instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],x=f[u];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,f[d]=x)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const x=f[u];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var am=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,om=`#ifdef USE_ALPHAHASH
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
#endif`,lm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,um=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fm=`#ifdef USE_AOMAP
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
#endif`,dm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pm=`#ifdef USE_BATCHING
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
#endif`,mm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_m=`#ifdef USE_IRIDESCENCE
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
#endif`,Mm=`#ifdef USE_BUMPMAP
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
#endif`,ym=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Rm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Cm=`#define PI 3.141592653589793
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
} // validated`,Pm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Im=`vec3 transformedNormal = objectNormal;
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
#endif`,Lm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Um=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Om=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zm=`#ifdef USE_ENVMAP
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
#endif`,Bm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,km=`#ifdef USE_ENVMAP
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
#endif`,Hm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gm=`#ifdef USE_ENVMAP
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
#endif`,Vm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ym=`#ifdef USE_GRADIENTMAP
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
}`,$m=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Km=`uniform bool receiveShadow;
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
#endif`,jm=`#ifdef USE_ENVMAP
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
#endif`,Qm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,t1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,e1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,n1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,i1=`PhysicalMaterial material;
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
#endif`,s1=`struct PhysicalMaterial {
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
}`,r1=`
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
#endif`,a1=`#if defined( RE_IndirectDiffuse )
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
#endif`,o1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,l1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,c1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,h1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,u1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,f1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,d1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,p1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,m1=`#if defined( USE_POINTS_UV )
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
#endif`,g1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,x1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,v1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,M1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,y1=`#ifdef USE_MORPHTARGETS
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
#endif`,S1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,b1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,w1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,T1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,E1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,A1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,R1=`#ifdef USE_NORMALMAP
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
#endif`,C1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,P1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,I1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,L1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,D1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,U1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,N1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,F1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,O1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,z1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,B1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,k1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,H1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,G1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,V1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,W1=`float getShadowMask() {
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
}`,X1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,q1=`#ifdef USE_SKINNING
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
#endif`,Y1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$1=`#ifdef USE_SKINNING
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
#endif`,Z1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,J1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,K1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,j1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Q1=`#ifdef USE_TRANSMISSION
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
#endif`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ag=`uniform sampler2D t2D;
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
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ug=`#include <common>
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
}`,fg=`#if DEPTH_PACKING == 3200
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
}`,dg=`#define DISTANCE
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
}`,pg=`#define DISTANCE
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
}`,mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
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
}`,vg=`uniform vec3 diffuse;
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
}`,_g=`#include <common>
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
}`,Mg=`uniform vec3 diffuse;
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
}`,yg=`#define LAMBERT
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
}`,Sg=`#define LAMBERT
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
}`,bg=`#define MATCAP
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
}`,wg=`#define MATCAP
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
}`,Tg=`#define NORMAL
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
}`,Eg=`#define NORMAL
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
}`,Ag=`#define PHONG
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
}`,Rg=`#define PHONG
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
}`,Cg=`#define STANDARD
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
}`,Pg=`#define STANDARD
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
}`,Ig=`#define TOON
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
}`,Lg=`#define TOON
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
}`,Dg=`uniform float size;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Ng=`#include <common>
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
}`,Fg=`uniform vec3 color;
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
}`,Og=`uniform float rotation;
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
}`,zg=`uniform vec3 diffuse;
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
}`,oe={alphahash_fragment:am,alphahash_pars_fragment:om,alphamap_fragment:lm,alphamap_pars_fragment:cm,alphatest_fragment:hm,alphatest_pars_fragment:um,aomap_fragment:fm,aomap_pars_fragment:dm,batching_pars_vertex:pm,batching_vertex:mm,begin_vertex:gm,beginnormal_vertex:xm,bsdfs:vm,iridescence_fragment:_m,bumpmap_pars_fragment:Mm,clipping_planes_fragment:ym,clipping_planes_pars_fragment:Sm,clipping_planes_pars_vertex:bm,clipping_planes_vertex:wm,color_fragment:Tm,color_pars_fragment:Em,color_pars_vertex:Am,color_vertex:Rm,common:Cm,cube_uv_reflection_fragment:Pm,defaultnormal_vertex:Im,displacementmap_pars_vertex:Lm,displacementmap_vertex:Dm,emissivemap_fragment:Um,emissivemap_pars_fragment:Nm,colorspace_fragment:Fm,colorspace_pars_fragment:Om,envmap_fragment:zm,envmap_common_pars_fragment:Bm,envmap_pars_fragment:km,envmap_pars_vertex:Hm,envmap_physical_pars_fragment:jm,envmap_vertex:Gm,fog_vertex:Vm,fog_pars_vertex:Wm,fog_fragment:Xm,fog_pars_fragment:qm,gradientmap_pars_fragment:Ym,lightmap_pars_fragment:$m,lights_lambert_fragment:Zm,lights_lambert_pars_fragment:Jm,lights_pars_begin:Km,lights_toon_fragment:Qm,lights_toon_pars_fragment:t1,lights_phong_fragment:e1,lights_phong_pars_fragment:n1,lights_physical_fragment:i1,lights_physical_pars_fragment:s1,lights_fragment_begin:r1,lights_fragment_maps:a1,lights_fragment_end:o1,logdepthbuf_fragment:l1,logdepthbuf_pars_fragment:c1,logdepthbuf_pars_vertex:h1,logdepthbuf_vertex:u1,map_fragment:f1,map_pars_fragment:d1,map_particle_fragment:p1,map_particle_pars_fragment:m1,metalnessmap_fragment:g1,metalnessmap_pars_fragment:x1,morphinstance_vertex:v1,morphcolor_vertex:_1,morphnormal_vertex:M1,morphtarget_pars_vertex:y1,morphtarget_vertex:S1,normal_fragment_begin:b1,normal_fragment_maps:w1,normal_pars_fragment:T1,normal_pars_vertex:E1,normal_vertex:A1,normalmap_pars_fragment:R1,clearcoat_normal_fragment_begin:C1,clearcoat_normal_fragment_maps:P1,clearcoat_pars_fragment:I1,iridescence_pars_fragment:L1,opaque_fragment:D1,packing:U1,premultiplied_alpha_fragment:N1,project_vertex:F1,dithering_fragment:O1,dithering_pars_fragment:z1,roughnessmap_fragment:B1,roughnessmap_pars_fragment:k1,shadowmap_pars_fragment:H1,shadowmap_pars_vertex:G1,shadowmap_vertex:V1,shadowmask_pars_fragment:W1,skinbase_vertex:X1,skinning_pars_vertex:q1,skinning_vertex:Y1,skinnormal_vertex:$1,specularmap_fragment:Z1,specularmap_pars_fragment:J1,tonemapping_fragment:K1,tonemapping_pars_fragment:j1,transmission_fragment:Q1,transmission_pars_fragment:tg,uv_pars_fragment:eg,uv_pars_vertex:ng,uv_vertex:ig,worldpos_vertex:sg,background_vert:rg,background_frag:ag,backgroundCube_vert:og,backgroundCube_frag:lg,cube_vert:cg,cube_frag:hg,depth_vert:ug,depth_frag:fg,distanceRGBA_vert:dg,distanceRGBA_frag:pg,equirect_vert:mg,equirect_frag:gg,linedashed_vert:xg,linedashed_frag:vg,meshbasic_vert:_g,meshbasic_frag:Mg,meshlambert_vert:yg,meshlambert_frag:Sg,meshmatcap_vert:bg,meshmatcap_frag:wg,meshnormal_vert:Tg,meshnormal_frag:Eg,meshphong_vert:Ag,meshphong_frag:Rg,meshphysical_vert:Cg,meshphysical_frag:Pg,meshtoon_vert:Ig,meshtoon_frag:Lg,points_vert:Dg,points_frag:Ug,shadow_vert:Ng,shadow_frag:Fg,sprite_vert:Og,sprite_frag:zg},Dt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ae},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ae}},envmap:{envMap:{value:null},envMapRotation:{value:new ae},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ae}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ae}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ae},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ae},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ae},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ae}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ae}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ae}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0},uvTransform:{value:new ae}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ae},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0}}},jn={basic:{uniforms:ln([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:oe.meshbasic_vert,fragmentShader:oe.meshbasic_frag},lambert:{uniforms:ln([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:oe.meshlambert_vert,fragmentShader:oe.meshlambert_frag},phong:{uniforms:ln([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:oe.meshphong_vert,fragmentShader:oe.meshphong_frag},standard:{uniforms:ln([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag},toon:{uniforms:ln([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:oe.meshtoon_vert,fragmentShader:oe.meshtoon_frag},matcap:{uniforms:ln([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:oe.meshmatcap_vert,fragmentShader:oe.meshmatcap_frag},points:{uniforms:ln([Dt.points,Dt.fog]),vertexShader:oe.points_vert,fragmentShader:oe.points_frag},dashed:{uniforms:ln([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:oe.linedashed_vert,fragmentShader:oe.linedashed_frag},depth:{uniforms:ln([Dt.common,Dt.displacementmap]),vertexShader:oe.depth_vert,fragmentShader:oe.depth_frag},normal:{uniforms:ln([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:oe.meshnormal_vert,fragmentShader:oe.meshnormal_frag},sprite:{uniforms:ln([Dt.sprite,Dt.fog]),vertexShader:oe.sprite_vert,fragmentShader:oe.sprite_frag},background:{uniforms:{uvTransform:{value:new ae},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:oe.background_vert,fragmentShader:oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ae}},vertexShader:oe.backgroundCube_vert,fragmentShader:oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:oe.cube_vert,fragmentShader:oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:oe.equirect_vert,fragmentShader:oe.equirect_frag},distanceRGBA:{uniforms:ln([Dt.common,Dt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:oe.distanceRGBA_vert,fragmentShader:oe.distanceRGBA_frag},shadow:{uniforms:ln([Dt.lights,Dt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:oe.shadow_vert,fragmentShader:oe.shadow_frag}};jn.physical={uniforms:ln([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ae},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ae},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ae},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ae},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ae},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ae},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ae},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ae},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ae},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ae},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ae},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ae}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag};const Pa={r:0,b:0,g:0},ns=new xn,Bg=new te;function kg(i,t,e,n,s,r,a){const o=new qt(0);let l=r===!0?0:1,c,h,f=null,d=0,u=null;function m(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function x(M){let _=!1;const T=m(M);T===null?p(o,l):T&&T.isColor&&(p(T,1),_=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(M,_){const T=m(_);T&&(T.isCubeTexture||T.mapping===vo)?(h===void 0&&(h=new Gt(new Yn(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:nr(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,E,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ns.copy(_.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Bg.makeRotationFromEuler(ns)),h.material.toneMapped=me.getTransfer(T.colorSpace)!==ve,(f!==T||d!==T.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,f=T,d=T.version,u=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Gt(new fe(2,2),new hn({name:"BackgroundMaterial",uniforms:nr(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:Yi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=me.getTransfer(T.colorSpace)!==ve,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(f!==T||d!==T.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,f=T,d=T.version,u=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,_){M.getRGB(Pa,Hf(i)),n.buffers.color.setClear(Pa.r,Pa.g,Pa.b,_,a)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,_=1){o.set(M),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(o,l)},render:x,addToRenderList:g,dispose:v}}function Hg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(S,R,L,P,U){let O=!1;const z=f(P,L,R);r!==z&&(r=z,c(r.object)),O=u(S,P,L,U),O&&m(S,P,L,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,_(S,R,L,P),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function f(S,R,L){const P=L.wireframe===!0;let U=n[S.id];U===void 0&&(U={},n[S.id]=U);let O=U[R.id];O===void 0&&(O={},U[R.id]=O);let z=O[P];return z===void 0&&(z=d(l()),O[P]=z),z}function d(S){const R=[],L=[],P=[];for(let U=0;U<e;U++)R[U]=0,L[U]=0,P[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:L,attributeDivisors:P,object:S,attributes:{},index:null}}function u(S,R,L,P){const U=r.attributes,O=R.attributes;let z=0;const V=L.getAttributes();for(const k in V)if(V[k].location>=0){const q=U[k];let Q=O[k];if(Q===void 0&&(k==="instanceMatrix"&&S.instanceMatrix&&(Q=S.instanceMatrix),k==="instanceColor"&&S.instanceColor&&(Q=S.instanceColor)),q===void 0||q.attribute!==Q||Q&&q.data!==Q.data)return!0;z++}return r.attributesNum!==z||r.index!==P}function m(S,R,L,P){const U={},O=R.attributes;let z=0;const V=L.getAttributes();for(const k in V)if(V[k].location>=0){let q=O[k];q===void 0&&(k==="instanceMatrix"&&S.instanceMatrix&&(q=S.instanceMatrix),k==="instanceColor"&&S.instanceColor&&(q=S.instanceColor));const Q={};Q.attribute=q,q&&q.data&&(Q.data=q.data),U[k]=Q,z++}r.attributes=U,r.attributesNum=z,r.index=P}function x(){const S=r.newAttributes;for(let R=0,L=S.length;R<L;R++)S[R]=0}function g(S){p(S,0)}function p(S,R){const L=r.newAttributes,P=r.enabledAttributes,U=r.attributeDivisors;L[S]=1,P[S]===0&&(i.enableVertexAttribArray(S),P[S]=1),U[S]!==R&&(i.vertexAttribDivisor(S,R),U[S]=R)}function v(){const S=r.newAttributes,R=r.enabledAttributes;for(let L=0,P=R.length;L<P;L++)R[L]!==S[L]&&(i.disableVertexAttribArray(L),R[L]=0)}function M(S,R,L,P,U,O,z){z===!0?i.vertexAttribIPointer(S,R,L,U,O):i.vertexAttribPointer(S,R,L,P,U,O)}function _(S,R,L,P){x();const U=P.attributes,O=L.getAttributes(),z=R.defaultAttributeValues;for(const V in O){const k=O[V];if(k.location>=0){let B=U[V];if(B===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(B=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(B=S.instanceColor)),B!==void 0){const q=B.normalized,Q=B.itemSize,at=t.get(B);if(at===void 0)continue;const dt=at.buffer,Ct=at.type,It=at.bytesPerElement,$=Ct===i.INT||Ct===i.UNSIGNED_INT||B.gpuType===Oc;if(B.isInterleavedBufferAttribute){const it=B.data,gt=it.stride,Mt=B.offset;if(it.isInstancedInterleavedBuffer){for(let bt=0;bt<k.locationSize;bt++)p(k.location+bt,it.meshPerAttribute);S.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let bt=0;bt<k.locationSize;bt++)g(k.location+bt);i.bindBuffer(i.ARRAY_BUFFER,dt);for(let bt=0;bt<k.locationSize;bt++)M(k.location+bt,Q/k.locationSize,Ct,q,gt*It,(Mt+Q/k.locationSize*bt)*It,$)}else{if(B.isInstancedBufferAttribute){for(let it=0;it<k.locationSize;it++)p(k.location+it,B.meshPerAttribute);S.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let it=0;it<k.locationSize;it++)g(k.location+it);i.bindBuffer(i.ARRAY_BUFFER,dt);for(let it=0;it<k.locationSize;it++)M(k.location+it,Q/k.locationSize,Ct,q,Q*It,Q/k.locationSize*it*It,$)}}else if(z!==void 0){const q=z[V];if(q!==void 0)switch(q.length){case 2:i.vertexAttrib2fv(k.location,q);break;case 3:i.vertexAttrib3fv(k.location,q);break;case 4:i.vertexAttrib4fv(k.location,q);break;default:i.vertexAttrib1fv(k.location,q)}}}}v()}function T(){w();for(const S in n){const R=n[S];for(const L in R){const P=R[L];for(const U in P)h(P[U].object),delete P[U];delete R[L]}delete n[S]}}function b(S){if(n[S.id]===void 0)return;const R=n[S.id];for(const L in R){const P=R[L];for(const U in P)h(P[U].object),delete P[U];delete R[L]}delete n[S.id]}function E(S){for(const R in n){const L=n[R];if(L[S.id]===void 0)continue;const P=L[S.id];for(const U in P)h(P[U].object),delete P[U];delete L[S.id]}}function w(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:y,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function Gg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,f){f!==0&&(i.drawArraysInstanced(n,c,h,f),e.update(h,n,f))}function o(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,n,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)a(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,f);let m=0;for(let x=0;x<f;x++)m+=h[x]*d[x];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Vg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(E){return!(E!==Un&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const w=E===ui&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==hi&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Wn&&!w)}function l(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:T,maxSamples:b}}function Wg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new os,o=new ae,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||n!==0||s;return s=d,n=f.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,p=i.get(f);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const v=r?0:n,M=v*4;let _=p.clippingState||null;l.value=_,_=h(m,d,M,u);for(let T=0;T!==M;++T)_[T]=e[T];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,d,u,m){const x=f!==null?f.length:0;let g=null;if(x!==0){if(g=l.value,m!==!0||g===null){const p=u+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let M=0,_=u;M!==x;++M,_+=4)a.copy(f[M]).applyMatrix4(v,o),a.normal.toArray(g,_),g[_+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function Xg(i){let t=new WeakMap;function e(a,o){return o===Nl?a.mapping=Ks:o===Fl&&(a.mapping=js),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Nl||o===Fl)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new sp(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Ys=4,ru=[.125,.215,.35,.446,.526,.582],hs=20,hl=new eh,au=new qt;let ul=null,fl=0,dl=0,pl=!1;const ls=(1+Math.sqrt(5))/2,Hs=1/ls,ou=[new D(-ls,Hs,0),new D(ls,Hs,0),new D(-Hs,0,ls),new D(Hs,0,ls),new D(0,ls,-Hs),new D(0,ls,Hs),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],qg=new D;class _c{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=qg}=r;ul=this._renderer.getRenderTarget(),fl=this._renderer.getActiveCubeFace(),dl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ul,fl,dl),this._renderer.xr.enabled=pl,t.scissorTest=!1,Ia(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ks||t.mapping===js?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ul=this._renderer.getRenderTarget(),fl=this._renderer.getActiveCubeFace(),dl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ii,minFilter:ii,generateMipmaps:!1,type:ui,format:Un,colorSpace:er,depthBuffer:!1},s=lu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yg(r)),this._blurMaterial=$g(r,t,e)}return s}_compileMaterial(t){const e=new Gt(this._lodPlanes[0],t);this._renderer.compile(e,hl)}_sceneToCubeUV(t,e,n,s,r){const l=new sn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,u=f.toneMapping;f.getClearColor(au),f.toneMapping=Wi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));const x=new Ke({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),g=new Gt(new Yn,x);let p=!1;const v=t.background;v?v.isColor&&(x.color.copy(v),t.background=null,p=!0):(x.color.copy(au),p=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const T=this._cubeSize;Ia(s,_*T,M>2?T:0,T,T),f.setRenderTarget(s),p&&f.render(g,l),f.render(t,l)}g.geometry.dispose(),g.material.dispose(),f.toneMapping=u,f.autoClear=d,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ks||t.mapping===js;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cu());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Gt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ia(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,hl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ou[(s-r-1)%ou.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new Gt(this._lodPlanes[s],c),d=c.uniforms,u=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*hs-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):hs;g>hs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${hs}`);const p=[];let v=0;for(let E=0;E<hs;++E){const w=E/x,y=Math.exp(-w*w/2);p.push(y),E===0?v+=y:E<g&&(v+=2*y)}for(let E=0;E<p.length;E++)p[E]=p[E]/v;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=m,d.mipInt.value=M-n;const _=this._sizeLods[s],T=3*_*(s>M-Ys?s-M+Ys:0),b=4*(this._cubeSize-_);Ia(e,T,b,3*_,2*_),l.setRenderTarget(e),l.render(f,hl)}}function Yg(i){const t=[],e=[],n=[];let s=i;const r=i-Ys+1+ru.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Ys?l=ru[a-i+Ys-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*u),M=new Float32Array(g*m*u),_=new Float32Array(p*m*u);for(let b=0;b<u;b++){const E=b%3*2/3-1,w=b>2?0:-1,y=[E,w,0,E+2/3,w,0,E+2/3,w+1,0,E,w,0,E+2/3,w+1,0,E,w+1,0];v.set(y,x*m*b),M.set(d,g*m*b);const S=[b,b,b,b,b,b];_.set(S,p*m*b)}const T=new Ae;T.setAttribute("position",new Ce(v,x)),T.setAttribute("uv",new Ce(M,g)),T.setAttribute("faceIndex",new Ce(_,p)),t.push(T),s>Ys&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function lu(i,t,e){const n=new Tn(i,t,e);return n.texture.mapping=vo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ia(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function $g(i,t,e){const n=new Float32Array(hs),s=new D(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:hs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:nh(),fragmentShader:`

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
		`,blending:cn,depthTest:!1,depthWrite:!1})}function cu(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nh(),fragmentShader:`

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
		`,blending:cn,depthTest:!1,depthWrite:!1})}function hu(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cn,depthTest:!1,depthWrite:!1})}function nh(){return`

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
	`}function Zg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Nl||l===Fl,h=l===Ks||l===js;if(c||h){let f=t.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new _c(i)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new _c(i)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Jg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Gr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Kg(i,t,e,n){const s={},r=new WeakMap;function a(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];const u=r.get(d);u&&(t.remove(u),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const u in d)t.update(d[u],i.ARRAY_BUFFER)}function c(f){const d=[],u=f.index,m=f.attributes.position;let x=0;if(u!==null){const v=u.array;x=u.version;for(let M=0,_=v.length;M<_;M+=3){const T=v[M+0],b=v[M+1],E=v[M+2];d.push(T,b,b,E,E,T)}}else if(m!==void 0){const v=m.array;x=m.version;for(let M=0,_=v.length/3-1;M<_;M+=3){const T=M+0,b=M+1,E=M+2;d.push(T,b,b,E,E,T)}}else return;const g=new(Ff(d)?kf:Bf)(d,1);g.version=x;const p=r.get(f);p&&t.remove(p),r.set(f,g)}function h(f){const d=r.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function jg(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,m){m!==0&&(i.drawElementsInstanced(n,u,r,d*a,m),e.update(u,n,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,n,1)}function f(d,u,m,x){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/a,u[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,u,0,r,d,0,x,0,m);let p=0;for(let v=0;v<m;v++)p+=u[v]*x[v];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Qg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function tx(i,t,e){const n=new WeakMap,s=new ye;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==f){let y=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",y)};d!==void 0&&d.texture.dispose();const u=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;u===!0&&(M=1),m===!0&&(M=2),x===!0&&(M=3);let _=o.attributes.position.count*M,T=1;_>t.maxTextureSize&&(T=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*T*4*f),E=new Of(b,_,T,f);E.type=Wn,E.needsUpdate=!0;const w=M*4;for(let S=0;S<f;S++){const R=g[S],L=p[S],P=v[S],U=_*T*4*S;for(let O=0;O<R.count;O++){const z=O*w;u===!0&&(s.fromBufferAttribute(R,O),b[U+z+0]=s.x,b[U+z+1]=s.y,b[U+z+2]=s.z,b[U+z+3]=0),m===!0&&(s.fromBufferAttribute(L,O),b[U+z+4]=s.x,b[U+z+5]=s.y,b[U+z+6]=s.z,b[U+z+7]=0),x===!0&&(s.fromBufferAttribute(P,O),b[U+z+8]=s.x,b[U+z+9]=s.y,b[U+z+10]=s.z,b[U+z+11]=P.itemSize===4?s.w:1)}}d={count:f,texture:E,size:new ut(_,T)},n.set(o,d),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let u=0;for(let x=0;x<c.length;x++)u+=c[x];const m=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function ex(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const rd=new je,uu=new Jc(1,1),ad=new Of,od=new G0,ld=new Vf,fu=[],du=[],pu=new Float32Array(16),mu=new Float32Array(9),gu=new Float32Array(4);function lr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=fu[s];if(r===void 0&&(r=new Float32Array(s),fu[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ge(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function To(i,t){let e=du[t];e===void 0&&(e=new Int32Array(t),du[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function nx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ix(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function sx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ge(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function rx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function ax(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ge(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,n))return;gu.set(n),i.uniformMatrix2fv(this.addr,!1,gu),Ve(e,n)}}function ox(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ge(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,n))return;mu.set(n),i.uniformMatrix3fv(this.addr,!1,mu),Ve(e,n)}}function lx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ge(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,n))return;pu.set(n),i.uniformMatrix4fv(this.addr,!1,pu),Ve(e,n)}}function cx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function hx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function ux(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ge(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function fx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function dx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function px(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function mx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ge(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function gx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function xx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(uu.compareFunction=Nf,r=uu):r=rd,e.setTexture2D(t||r,s)}function vx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||od,s)}function _x(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ld,s)}function Mx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ad,s)}function yx(i){switch(i){case 5126:return nx;case 35664:return ix;case 35665:return sx;case 35666:return rx;case 35674:return ax;case 35675:return ox;case 35676:return lx;case 5124:case 35670:return cx;case 35667:case 35671:return hx;case 35668:case 35672:return ux;case 35669:case 35673:return fx;case 5125:return dx;case 36294:return px;case 36295:return mx;case 36296:return gx;case 35678:case 36198:case 36298:case 36306:case 35682:return xx;case 35679:case 36299:case 36307:return vx;case 35680:case 36300:case 36308:case 36293:return _x;case 36289:case 36303:case 36311:case 36292:return Mx}}function Sx(i,t){i.uniform1fv(this.addr,t)}function bx(i,t){const e=lr(t,this.size,2);i.uniform2fv(this.addr,e)}function wx(i,t){const e=lr(t,this.size,3);i.uniform3fv(this.addr,e)}function Tx(i,t){const e=lr(t,this.size,4);i.uniform4fv(this.addr,e)}function Ex(i,t){const e=lr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ax(i,t){const e=lr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Rx(i,t){const e=lr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Cx(i,t){i.uniform1iv(this.addr,t)}function Px(i,t){i.uniform2iv(this.addr,t)}function Ix(i,t){i.uniform3iv(this.addr,t)}function Lx(i,t){i.uniform4iv(this.addr,t)}function Dx(i,t){i.uniform1uiv(this.addr,t)}function Ux(i,t){i.uniform2uiv(this.addr,t)}function Nx(i,t){i.uniform3uiv(this.addr,t)}function Fx(i,t){i.uniform4uiv(this.addr,t)}function Ox(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Ge(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||rd,r[a])}function zx(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Ge(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||od,r[a])}function Bx(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Ge(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||ld,r[a])}function kx(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Ge(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||ad,r[a])}function Hx(i){switch(i){case 5126:return Sx;case 35664:return bx;case 35665:return wx;case 35666:return Tx;case 35674:return Ex;case 35675:return Ax;case 35676:return Rx;case 5124:case 35670:return Cx;case 35667:case 35671:return Px;case 35668:case 35672:return Ix;case 35669:case 35673:return Lx;case 5125:return Dx;case 36294:return Ux;case 36295:return Nx;case 36296:return Fx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return zx;case 35680:case 36300:case 36308:case 36293:return Bx;case 36289:case 36303:case 36311:case 36292:return kx}}class Gx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=yx(e.type)}}class Vx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Hx(e.type)}}class Wx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const ml=/(\w+)(\])?(\[|\.)?/g;function xu(i,t){i.seq.push(t),i.map[t.id]=t}function Xx(i,t,e){const n=i.name,s=n.length;for(ml.lastIndex=0;;){const r=ml.exec(n),a=ml.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){xu(e,c===void 0?new Gx(o,i,t):new Vx(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Wx(o),xu(e,f)),e=f}}}class Ja{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Xx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function vu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const qx=37297;let Yx=0;function $x(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const _u=new ae;function Zx(i){me._getMatrix(_u,me.workingColorSpace,i);const t=`mat3( ${_u.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case eo:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Mu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+$x(i.getShaderSource(t),o)}else return r}function Jx(i,t){const e=Zx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Kx(i,t){let e;switch(t){case yf:e="Linear";break;case Sf:e="Reinhard";break;case bf:e="Cineon";break;case Fc:e="ACESFilmic";break;case Tf:e="AgX";break;case Ef:e="Neutral";break;case wf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const La=new D;function jx(){me.getLuminanceCoefficients(La);const i=La.x.toFixed(4),t=La.y.toFixed(4),e=La.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Qx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Tr).join(`
`)}function tv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ev(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Tr(i){return i!==""}function yu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Su(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const nv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mc(i){return i.replace(nv,sv)}const iv=new Map;function sv(i,t){let e=oe[t];if(e===void 0){const n=iv.get(t);if(n!==void 0)e=oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Mc(e)}const rv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bu(i){return i.replace(rv,av)}function av(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function wu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function ov(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===gf?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===xf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===wi&&(t="SHADOWMAP_TYPE_VSM"),t}function lv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ks:case js:t="ENVMAP_TYPE_CUBE";break;case vo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function cv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case js:t="ENVMAP_MODE_REFRACTION";break}return t}function hv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Nc:t="ENVMAP_BLENDING_MULTIPLY";break;case a0:t="ENVMAP_BLENDING_MIX";break;case o0:t="ENVMAP_BLENDING_ADD";break}return t}function uv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function fv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=ov(e),c=lv(e),h=cv(e),f=hv(e),d=uv(e),u=Qx(e),m=tv(r),x=s.createProgram();let g,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Tr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Tr).join(`
`),p.length>0&&(p+=`
`)):(g=[wu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Tr).join(`
`),p=[wu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Wi?"#define TONE_MAPPING":"",e.toneMapping!==Wi?oe.tonemapping_pars_fragment:"",e.toneMapping!==Wi?Kx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",oe.colorspace_pars_fragment,Jx("linearToOutputTexel",e.outputColorSpace),jx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Tr).join(`
`)),a=Mc(a),a=yu(a,e),a=Su(a,e),o=Mc(o),o=yu(o,e),o=Su(o,e),a=bu(a),o=bu(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===yh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===yh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=v+g+a,_=v+p+o,T=vu(s,s.VERTEX_SHADER,M),b=vu(s,s.FRAGMENT_SHADER,_);s.attachShader(x,T),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(R){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(x)||"",P=s.getShaderInfoLog(T)||"",U=s.getShaderInfoLog(b)||"",O=L.trim(),z=P.trim(),V=U.trim();let k=!0,B=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,T,b);else{const q=Mu(s,T,"vertex"),Q=Mu(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+O+`
`+q+`
`+Q)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(z===""||V==="")&&(B=!1);B&&(R.diagnostics={runnable:k,programLog:O,vertexShader:{log:z,prefix:g},fragmentShader:{log:V,prefix:p}})}s.deleteShader(T),s.deleteShader(b),w=new Ja(s,x),y=ev(s,x)}let w;this.getUniforms=function(){return w===void 0&&E(this),w};let y;this.getAttributes=function(){return y===void 0&&E(this),y};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(x,qx)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Yx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=b,this}let dv=0;class pv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new mv(t),e.set(t,n)),n}}class mv{constructor(t){this.id=dv++,this.code=t,this.usedTimes=0}}function gv(i,t,e,n,s,r,a){const o=new qc,l=new pv,c=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return c.add(y),y===0?"uv":`uv${y}`}function g(y,S,R,L,P){const U=L.fog,O=P.geometry,z=y.isMeshStandardMaterial?L.environment:null,V=(y.isMeshStandardMaterial?e:t).get(y.envMap||z),k=V&&V.mapping===vo?V.image.height:null,B=m[y.type];y.precision!==null&&(u=s.getMaxPrecision(y.precision),u!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));const q=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Q=q!==void 0?q.length:0;let at=0;O.morphAttributes.position!==void 0&&(at=1),O.morphAttributes.normal!==void 0&&(at=2),O.morphAttributes.color!==void 0&&(at=3);let dt,Ct,It,$;if(B){const xe=jn[B];dt=xe.vertexShader,Ct=xe.fragmentShader}else dt=y.vertexShader,Ct=y.fragmentShader,l.update(y),It=l.getVertexShaderID(y),$=l.getFragmentShaderID(y);const it=i.getRenderTarget(),gt=i.state.buffers.depth.getReversed(),Mt=P.isInstancedMesh===!0,bt=P.isBatchedMesh===!0,Yt=!!y.map,Ot=!!y.matcap,F=!!V,J=!!y.aoMap,j=!!y.lightMap,rt=!!y.bumpMap,st=!!y.normalMap,mt=!!y.displacementMap,ct=!!y.emissiveMap,ft=!!y.metalnessMap,$t=!!y.roughnessMap,xt=y.anisotropy>0,I=y.clearcoat>0,A=y.dispersion>0,W=y.iridescence>0,K=y.sheen>0,lt=y.transmission>0,Z=xt&&!!y.anisotropyMap,Et=I&&!!y.clearcoatMap,pt=I&&!!y.clearcoatNormalMap,Pt=I&&!!y.clearcoatRoughnessMap,zt=W&&!!y.iridescenceMap,vt=W&&!!y.iridescenceThicknessMap,Lt=K&&!!y.sheenColorMap,Kt=K&&!!y.sheenRoughnessMap,Xt=!!y.specularMap,Rt=!!y.specularColorMap,ee=!!y.specularIntensityMap,G=lt&&!!y.transmissionMap,_t=lt&&!!y.thicknessMap,wt=!!y.gradientMap,Ht=!!y.alphaMap,yt=y.alphaTest>0,ht=!!y.alphaHash,Wt=!!y.extensions;let re=Wi;y.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(re=i.toneMapping);const we={shaderID:B,shaderType:y.type,shaderName:y.name,vertexShader:dt,fragmentShader:Ct,defines:y.defines,customVertexShaderID:It,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:bt,batchingColor:bt&&P._colorsTexture!==null,instancing:Mt,instancingColor:Mt&&P.instanceColor!==null,instancingMorph:Mt&&P.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:it===null?i.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:er,alphaToCoverage:!!y.alphaToCoverage,map:Yt,matcap:Ot,envMap:F,envMapMode:F&&V.mapping,envMapCubeUVHeight:k,aoMap:J,lightMap:j,bumpMap:rt,normalMap:st,displacementMap:d&&mt,emissiveMap:ct,normalMapObjectSpace:st&&y.normalMapType===u0,normalMapTangentSpace:st&&y.normalMapType===Mo,metalnessMap:ft,roughnessMap:$t,anisotropy:xt,anisotropyMap:Z,clearcoat:I,clearcoatMap:Et,clearcoatNormalMap:pt,clearcoatRoughnessMap:Pt,dispersion:A,iridescence:W,iridescenceMap:zt,iridescenceThicknessMap:vt,sheen:K,sheenColorMap:Lt,sheenRoughnessMap:Kt,specularMap:Xt,specularColorMap:Rt,specularIntensityMap:ee,transmission:lt,transmissionMap:G,thicknessMap:_t,gradientMap:wt,opaque:y.transparent===!1&&y.blending===$s&&y.alphaToCoverage===!1,alphaMap:Ht,alphaTest:yt,alphaHash:ht,combine:y.combine,mapUv:Yt&&x(y.map.channel),aoMapUv:J&&x(y.aoMap.channel),lightMapUv:j&&x(y.lightMap.channel),bumpMapUv:rt&&x(y.bumpMap.channel),normalMapUv:st&&x(y.normalMap.channel),displacementMapUv:mt&&x(y.displacementMap.channel),emissiveMapUv:ct&&x(y.emissiveMap.channel),metalnessMapUv:ft&&x(y.metalnessMap.channel),roughnessMapUv:$t&&x(y.roughnessMap.channel),anisotropyMapUv:Z&&x(y.anisotropyMap.channel),clearcoatMapUv:Et&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:pt&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:zt&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:vt&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Kt&&x(y.sheenRoughnessMap.channel),specularMapUv:Xt&&x(y.specularMap.channel),specularColorMapUv:Rt&&x(y.specularColorMap.channel),specularIntensityMapUv:ee&&x(y.specularIntensityMap.channel),transmissionMapUv:G&&x(y.transmissionMap.channel),thicknessMapUv:_t&&x(y.thicknessMap.channel),alphaMapUv:Ht&&x(y.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(st||xt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!O.attributes.uv&&(Yt||Ht),fog:!!U,useFog:y.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:gt,skinning:P.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:at,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:re,decodeVideoTexture:Yt&&y.map.isVideoTexture===!0&&me.getTransfer(y.map.colorSpace)===ve,decodeVideoTextureEmissive:ct&&y.emissiveMap.isVideoTexture===!0&&me.getTransfer(y.emissiveMap.colorSpace)===ve,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Oe,flipSided:y.side===rn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Wt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Wt&&y.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function p(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)S.push(R),S.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(v(S,y),M(S,y),S.push(i.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function v(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function M(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){const S=m[y.type];let R;if(S){const L=jn[S];R=ps.clone(L.uniforms)}else R=y.uniforms;return R}function T(y,S){let R;for(let L=0,P=h.length;L<P;L++){const U=h[L];if(U.cacheKey===S){R=U,++R.usedTimes;break}}return R===void 0&&(R=new fv(i,S,y,r),h.push(R)),R}function b(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function E(y){l.remove(y)}function w(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:T,releaseProgram:b,releaseShaderCache:E,programs:h,dispose:w}}function xv(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function vv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Tu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Eu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,d,u,m,x,g){let p=i[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:x,group:g},i[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=x,p.group=g),t++,p}function o(f,d,u,m,x,g){const p=a(f,d,u,m,x,g);u.transmission>0?n.push(p):u.transparent===!0?s.push(p):e.push(p)}function l(f,d,u,m,x,g){const p=a(f,d,u,m,x,g);u.transmission>0?n.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||vv),n.length>1&&n.sort(d||Tu),s.length>1&&s.sort(d||Tu)}function h(){for(let f=t,d=i.length;f<d;f++){const u=i[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function _v(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Eu,i.set(n,[a])):s>=r.length?(a=new Eu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Mv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new qt};break;case"SpotLight":e={position:new D,direction:new D,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function yv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Sv=0;function bv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function wv(i){const t=new Mv,e=yv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new te,a=new te;function o(c){let h=0,f=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let u=0,m=0,x=0,g=0,p=0,v=0,M=0,_=0,T=0,b=0,E=0;c.sort(bv);for(let y=0,S=c.length;y<S;y++){const R=c[y],L=R.color,P=R.intensity,U=R.distance,O=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=L.r*P,f+=L.g*P,d+=L.b*P;else if(R.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(R.sh.coefficients[z],P);E++}else if(R.isDirectionalLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const V=R.shadow,k=e.get(R);k.shadowIntensity=V.intensity,k.shadowBias=V.bias,k.shadowNormalBias=V.normalBias,k.shadowRadius=V.radius,k.shadowMapSize=V.mapSize,n.directionalShadow[u]=k,n.directionalShadowMap[u]=O,n.directionalShadowMatrix[u]=R.shadow.matrix,v++}n.directional[u]=z,u++}else if(R.isSpotLight){const z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(L).multiplyScalar(P),z.distance=U,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,n.spot[x]=z;const V=R.shadow;if(R.map&&(n.spotLightMap[T]=R.map,T++,V.updateMatrices(R),R.castShadow&&b++),n.spotLightMatrix[x]=V.matrix,R.castShadow){const k=e.get(R);k.shadowIntensity=V.intensity,k.shadowBias=V.bias,k.shadowNormalBias=V.normalBias,k.shadowRadius=V.radius,k.shadowMapSize=V.mapSize,n.spotShadow[x]=k,n.spotShadowMap[x]=O,_++}x++}else if(R.isRectAreaLight){const z=t.get(R);z.color.copy(L).multiplyScalar(P),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=z,g++}else if(R.isPointLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const V=R.shadow,k=e.get(R);k.shadowIntensity=V.intensity,k.shadowBias=V.bias,k.shadowNormalBias=V.normalBias,k.shadowRadius=V.radius,k.shadowMapSize=V.mapSize,k.shadowCameraNear=V.camera.near,k.shadowCameraFar=V.camera.far,n.pointShadow[m]=k,n.pointShadowMap[m]=O,n.pointShadowMatrix[m]=R.shadow.matrix,M++}n.point[m]=z,m++}else if(R.isHemisphereLight){const z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(P),z.groundColor.copy(R.groundColor).multiplyScalar(P),n.hemi[p]=z,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=d;const w=n.hash;(w.directionalLength!==u||w.pointLength!==m||w.spotLength!==x||w.rectAreaLength!==g||w.hemiLength!==p||w.numDirectionalShadows!==v||w.numPointShadows!==M||w.numSpotShadows!==_||w.numSpotMaps!==T||w.numLightProbes!==E)&&(n.directional.length=u,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+T-b,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=E,w.directionalLength=u,w.pointLength=m,w.spotLength=x,w.rectAreaLength=g,w.hemiLength=p,w.numDirectionalShadows=v,w.numPointShadows=M,w.numSpotShadows=_,w.numSpotMaps=T,w.numLightProbes=E,n.version=Sv++)}function l(c,h){let f=0,d=0,u=0,m=0,x=0;const g=h.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const M=c[p];if(M.isDirectionalLight){const _=n.directional[f];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(M.isSpotLight){const _=n.spot[u];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(M.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:n}}function Au(i){const t=new wv(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Tv(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Au(i),t.set(s,[o])):r>=a.length?(o=new Au(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Ev=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Av=`uniform sampler2D shadow_pass;
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
}`;function Rv(i,t,e){let n=new Zc;const s=new ut,r=new ut,a=new ye,o=new $p({depthPacking:h0}),l=new Zp,c={},h=e.maxTextureSize,f={[Yi]:rn,[rn]:Yi,[Oe]:Oe},d=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:Ev,fragmentShader:Av}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new Ae;m.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Gt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gf;let p=this.type;this.render=function(b,E,w){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const y=i.getRenderTarget(),S=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),L=i.state;L.setBlending(cn),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const P=p!==wi&&this.type===wi,U=p===wi&&this.type!==wi;for(let O=0,z=b.length;O<z;O++){const V=b[O],k=V.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const B=k.getFrameExtents();if(s.multiply(B),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/B.x),s.x=r.x*B.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/B.y),s.y=r.y*B.y,k.mapSize.y=r.y)),k.map===null||P===!0||U===!0){const Q=this.type!==wi?{minFilter:un,magFilter:un}:{};k.map!==null&&k.map.dispose(),k.map=new Tn(s.x,s.y,Q),k.map.texture.name=V.name+".shadowMap",k.camera.updateProjectionMatrix()}i.setRenderTarget(k.map),i.clear();const q=k.getViewportCount();for(let Q=0;Q<q;Q++){const at=k.getViewport(Q);a.set(r.x*at.x,r.y*at.y,r.x*at.z,r.y*at.w),L.viewport(a),k.updateMatrices(V,Q),n=k.getFrustum(),_(E,w,k.camera,V,this.type)}k.isPointLightShadow!==!0&&this.type===wi&&v(k,w),k.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(y,S,R)};function v(b,E){const w=t.update(x);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Tn(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(E,null,w,d,x,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(E,null,w,u,x,null)}function M(b,E,w,y){let S=null;const R=w.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)S=R;else if(S=w.isPointLight===!0?l:o,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const L=S.uuid,P=E.uuid;let U=c[L];U===void 0&&(U={},c[L]=U);let O=U[P];O===void 0&&(O=S.clone(),U[P]=O,E.addEventListener("dispose",T)),S=O}if(S.visible=E.visible,S.wireframe=E.wireframe,y===wi?S.side=E.shadowSide!==null?E.shadowSide:E.side:S.side=E.shadowSide!==null?E.shadowSide:f[E.side],S.alphaMap=E.alphaMap,S.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,S.map=E.map,S.clipShadows=E.clipShadows,S.clippingPlanes=E.clippingPlanes,S.clipIntersection=E.clipIntersection,S.displacementMap=E.displacementMap,S.displacementScale=E.displacementScale,S.displacementBias=E.displacementBias,S.wireframeLinewidth=E.wireframeLinewidth,S.linewidth=E.linewidth,w.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const L=i.properties.get(S);L.light=w}return S}function _(b,E,w,y,S){if(b.visible===!1)return;if(b.layers.test(E.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===wi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,b.matrixWorld);const P=t.update(b),U=b.material;if(Array.isArray(U)){const O=P.groups;for(let z=0,V=O.length;z<V;z++){const k=O[z],B=U[k.materialIndex];if(B&&B.visible){const q=M(b,B,y,S);b.onBeforeShadow(i,b,E,w,P,q,k),i.renderBufferDirect(w,null,P,q,b,k),b.onAfterShadow(i,b,E,w,P,q,k)}}}else if(U.visible){const O=M(b,U,y,S);b.onBeforeShadow(i,b,E,w,P,O,null),i.renderBufferDirect(w,null,P,O,b,null),b.onAfterShadow(i,b,E,w,P,O,null)}}const L=b.children;for(let P=0,U=L.length;P<U;P++)_(L[P],E,w,y,S)}function T(b){b.target.removeEventListener("dispose",T);for(const w in c){const y=c[w],S=b.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}const Cv={[Rl]:Cl,[Pl]:Dl,[Il]:Ul,[Js]:Ll,[Cl]:Rl,[Dl]:Pl,[Ul]:Il,[Ll]:Js};function Pv(i,t){function e(){let G=!1;const _t=new ye;let wt=null;const Ht=new ye(0,0,0,0);return{setMask:function(yt){wt!==yt&&!G&&(i.colorMask(yt,yt,yt,yt),wt=yt)},setLocked:function(yt){G=yt},setClear:function(yt,ht,Wt,re,we){we===!0&&(yt*=re,ht*=re,Wt*=re),_t.set(yt,ht,Wt,re),Ht.equals(_t)===!1&&(i.clearColor(yt,ht,Wt,re),Ht.copy(_t))},reset:function(){G=!1,wt=null,Ht.set(-1,0,0,0)}}}function n(){let G=!1,_t=!1,wt=null,Ht=null,yt=null;return{setReversed:function(ht){if(_t!==ht){const Wt=t.get("EXT_clip_control");ht?Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.ZERO_TO_ONE_EXT):Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.NEGATIVE_ONE_TO_ONE_EXT),_t=ht;const re=yt;yt=null,this.setClear(re)}},getReversed:function(){return _t},setTest:function(ht){ht?it(i.DEPTH_TEST):gt(i.DEPTH_TEST)},setMask:function(ht){wt!==ht&&!G&&(i.depthMask(ht),wt=ht)},setFunc:function(ht){if(_t&&(ht=Cv[ht]),Ht!==ht){switch(ht){case Rl:i.depthFunc(i.NEVER);break;case Cl:i.depthFunc(i.ALWAYS);break;case Pl:i.depthFunc(i.LESS);break;case Js:i.depthFunc(i.LEQUAL);break;case Il:i.depthFunc(i.EQUAL);break;case Ll:i.depthFunc(i.GEQUAL);break;case Dl:i.depthFunc(i.GREATER);break;case Ul:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ht=ht}},setLocked:function(ht){G=ht},setClear:function(ht){yt!==ht&&(_t&&(ht=1-ht),i.clearDepth(ht),yt=ht)},reset:function(){G=!1,wt=null,Ht=null,yt=null,_t=!1}}}function s(){let G=!1,_t=null,wt=null,Ht=null,yt=null,ht=null,Wt=null,re=null,we=null;return{setTest:function(xe){G||(xe?it(i.STENCIL_TEST):gt(i.STENCIL_TEST))},setMask:function(xe){_t!==xe&&!G&&(i.stencilMask(xe),_t=xe)},setFunc:function(xe,mi,Zn){(wt!==xe||Ht!==mi||yt!==Zn)&&(i.stencilFunc(xe,mi,Zn),wt=xe,Ht=mi,yt=Zn)},setOp:function(xe,mi,Zn){(ht!==xe||Wt!==mi||re!==Zn)&&(i.stencilOp(xe,mi,Zn),ht=xe,Wt=mi,re=Zn)},setLocked:function(xe){G=xe},setClear:function(xe){we!==xe&&(i.clearStencil(xe),we=xe)},reset:function(){G=!1,_t=null,wt=null,Ht=null,yt=null,ht=null,Wt=null,re=null,we=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,x=!1,g=null,p=null,v=null,M=null,_=null,T=null,b=null,E=new qt(0,0,0),w=0,y=!1,S=null,R=null,L=null,P=null,U=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,V=0;const k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(k)[1]),z=V>=1):k.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),z=V>=2);let B=null,q={};const Q=i.getParameter(i.SCISSOR_BOX),at=i.getParameter(i.VIEWPORT),dt=new ye().fromArray(Q),Ct=new ye().fromArray(at);function It(G,_t,wt,Ht){const yt=new Uint8Array(4),ht=i.createTexture();i.bindTexture(G,ht),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Wt=0;Wt<wt;Wt++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(_t,0,i.RGBA,1,1,Ht,0,i.RGBA,i.UNSIGNED_BYTE,yt):i.texImage2D(_t+Wt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,yt);return ht}const $={};$[i.TEXTURE_2D]=It(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=It(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=It(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=It(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(i.DEPTH_TEST),a.setFunc(Js),rt(!1),st(xh),it(i.CULL_FACE),J(cn);function it(G){h[G]!==!0&&(i.enable(G),h[G]=!0)}function gt(G){h[G]!==!1&&(i.disable(G),h[G]=!1)}function Mt(G,_t){return f[G]!==_t?(i.bindFramebuffer(G,_t),f[G]=_t,G===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=_t),G===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=_t),!0):!1}function bt(G,_t){let wt=u,Ht=!1;if(G){wt=d.get(_t),wt===void 0&&(wt=[],d.set(_t,wt));const yt=G.textures;if(wt.length!==yt.length||wt[0]!==i.COLOR_ATTACHMENT0){for(let ht=0,Wt=yt.length;ht<Wt;ht++)wt[ht]=i.COLOR_ATTACHMENT0+ht;wt.length=yt.length,Ht=!0}}else wt[0]!==i.BACK&&(wt[0]=i.BACK,Ht=!0);Ht&&i.drawBuffers(wt)}function Yt(G){return m!==G?(i.useProgram(G),m=G,!0):!1}const Ot={[Ri]:i.FUNC_ADD,[qd]:i.FUNC_SUBTRACT,[Yd]:i.FUNC_REVERSE_SUBTRACT};Ot[$d]=i.MIN,Ot[Zd]=i.MAX;const F={[Tl]:i.ZERO,[Jd]:i.ONE,[Kd]:i.SRC_COLOR,[El]:i.SRC_ALPHA,[e0]:i.SRC_ALPHA_SATURATE,[Mf]:i.DST_COLOR,[_f]:i.DST_ALPHA,[jd]:i.ONE_MINUS_SRC_COLOR,[Al]:i.ONE_MINUS_SRC_ALPHA,[t0]:i.ONE_MINUS_DST_COLOR,[Qd]:i.ONE_MINUS_DST_ALPHA,[n0]:i.CONSTANT_COLOR,[i0]:i.ONE_MINUS_CONSTANT_COLOR,[s0]:i.CONSTANT_ALPHA,[r0]:i.ONE_MINUS_CONSTANT_ALPHA};function J(G,_t,wt,Ht,yt,ht,Wt,re,we,xe){if(G===cn){x===!0&&(gt(i.BLEND),x=!1);return}if(x===!1&&(it(i.BLEND),x=!0),G!==vf){if(G!==g||xe!==y){if((p!==Ri||_!==Ri)&&(i.blendEquation(i.FUNC_ADD),p=Ri,_=Ri),xe)switch(G){case $s:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Or:i.blendFunc(i.ONE,i.ONE);break;case vh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _h:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case $s:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Or:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case vh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _h:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}v=null,M=null,T=null,b=null,E.set(0,0,0),w=0,g=G,y=xe}return}yt=yt||_t,ht=ht||wt,Wt=Wt||Ht,(_t!==p||yt!==_)&&(i.blendEquationSeparate(Ot[_t],Ot[yt]),p=_t,_=yt),(wt!==v||Ht!==M||ht!==T||Wt!==b)&&(i.blendFuncSeparate(F[wt],F[Ht],F[ht],F[Wt]),v=wt,M=Ht,T=ht,b=Wt),(re.equals(E)===!1||we!==w)&&(i.blendColor(re.r,re.g,re.b,we),E.copy(re),w=we),g=G,y=!1}function j(G,_t){G.side===Oe?gt(i.CULL_FACE):it(i.CULL_FACE);let wt=G.side===rn;_t&&(wt=!wt),rt(wt),G.blending===$s&&G.transparent===!1?J(cn):J(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),r.setMask(G.colorWrite);const Ht=G.stencilWrite;o.setTest(Ht),Ht&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),ct(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?it(i.SAMPLE_ALPHA_TO_COVERAGE):gt(i.SAMPLE_ALPHA_TO_COVERAGE)}function rt(G){S!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),S=G)}function st(G){G!==Wd?(it(i.CULL_FACE),G!==R&&(G===xh?i.cullFace(i.BACK):G===Xd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):gt(i.CULL_FACE),R=G}function mt(G){G!==L&&(z&&i.lineWidth(G),L=G)}function ct(G,_t,wt){G?(it(i.POLYGON_OFFSET_FILL),(P!==_t||U!==wt)&&(i.polygonOffset(_t,wt),P=_t,U=wt)):gt(i.POLYGON_OFFSET_FILL)}function ft(G){G?it(i.SCISSOR_TEST):gt(i.SCISSOR_TEST)}function $t(G){G===void 0&&(G=i.TEXTURE0+O-1),B!==G&&(i.activeTexture(G),B=G)}function xt(G,_t,wt){wt===void 0&&(B===null?wt=i.TEXTURE0+O-1:wt=B);let Ht=q[wt];Ht===void 0&&(Ht={type:void 0,texture:void 0},q[wt]=Ht),(Ht.type!==G||Ht.texture!==_t)&&(B!==wt&&(i.activeTexture(wt),B=wt),i.bindTexture(G,_t||$[G]),Ht.type=G,Ht.texture=_t)}function I(){const G=q[B];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function K(){try{i.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function lt(){try{i.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Et(){try{i.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function pt(){try{i.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Pt(){try{i.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function zt(){try{i.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function vt(){try{i.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Lt(G){dt.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),dt.copy(G))}function Kt(G){Ct.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),Ct.copy(G))}function Xt(G,_t){let wt=c.get(_t);wt===void 0&&(wt=new WeakMap,c.set(_t,wt));let Ht=wt.get(G);Ht===void 0&&(Ht=i.getUniformBlockIndex(_t,G.name),wt.set(G,Ht))}function Rt(G,_t){const Ht=c.get(_t).get(G);l.get(_t)!==Ht&&(i.uniformBlockBinding(_t,Ht,G.__bindingPointIndex),l.set(_t,Ht))}function ee(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},B=null,q={},f={},d=new WeakMap,u=[],m=null,x=!1,g=null,p=null,v=null,M=null,_=null,T=null,b=null,E=new qt(0,0,0),w=0,y=!1,S=null,R=null,L=null,P=null,U=null,dt.set(0,0,i.canvas.width,i.canvas.height),Ct.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:it,disable:gt,bindFramebuffer:Mt,drawBuffers:bt,useProgram:Yt,setBlending:J,setMaterial:j,setFlipSided:rt,setCullFace:st,setLineWidth:mt,setPolygonOffset:ct,setScissorTest:ft,activeTexture:$t,bindTexture:xt,unbindTexture:I,compressedTexImage2D:A,compressedTexImage3D:W,texImage2D:zt,texImage3D:vt,updateUBOMapping:Xt,uniformBlockBinding:Rt,texStorage2D:pt,texStorage3D:Pt,texSubImage2D:K,texSubImage3D:lt,compressedTexSubImage2D:Z,compressedTexSubImage3D:Et,scissor:Lt,viewport:Kt,reset:ee}}function Iv(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(I,A){return u?new OffscreenCanvas(I,A):Hr("canvas")}function x(I,A,W){let K=1;const lt=xt(I);if((lt.width>W||lt.height>W)&&(K=W/Math.max(lt.width,lt.height)),K<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const Z=Math.floor(K*lt.width),Et=Math.floor(K*lt.height);f===void 0&&(f=m(Z,Et));const pt=A?m(Z,Et):f;return pt.width=Z,pt.height=Et,pt.getContext("2d").drawImage(I,0,0,Z,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+Z+"x"+Et+")."),pt}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),I;return I}function g(I){return I.generateMipmaps}function p(I){i.generateMipmap(I)}function v(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(I,A,W,K,lt=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let Z=A;if(A===i.RED&&(W===i.FLOAT&&(Z=i.R32F),W===i.HALF_FLOAT&&(Z=i.R16F),W===i.UNSIGNED_BYTE&&(Z=i.R8)),A===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.R8UI),W===i.UNSIGNED_SHORT&&(Z=i.R16UI),W===i.UNSIGNED_INT&&(Z=i.R32UI),W===i.BYTE&&(Z=i.R8I),W===i.SHORT&&(Z=i.R16I),W===i.INT&&(Z=i.R32I)),A===i.RG&&(W===i.FLOAT&&(Z=i.RG32F),W===i.HALF_FLOAT&&(Z=i.RG16F),W===i.UNSIGNED_BYTE&&(Z=i.RG8)),A===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.RG8UI),W===i.UNSIGNED_SHORT&&(Z=i.RG16UI),W===i.UNSIGNED_INT&&(Z=i.RG32UI),W===i.BYTE&&(Z=i.RG8I),W===i.SHORT&&(Z=i.RG16I),W===i.INT&&(Z=i.RG32I)),A===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),W===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),W===i.UNSIGNED_INT&&(Z=i.RGB32UI),W===i.BYTE&&(Z=i.RGB8I),W===i.SHORT&&(Z=i.RGB16I),W===i.INT&&(Z=i.RGB32I)),A===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),W===i.UNSIGNED_INT&&(Z=i.RGBA32UI),W===i.BYTE&&(Z=i.RGBA8I),W===i.SHORT&&(Z=i.RGBA16I),W===i.INT&&(Z=i.RGBA32I)),A===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),A===i.RGBA){const Et=lt?eo:me.getTransfer(K);W===i.FLOAT&&(Z=i.RGBA32F),W===i.HALF_FLOAT&&(Z=i.RGBA16F),W===i.UNSIGNED_BYTE&&(Z=Et===ve?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function _(I,A){let W;return I?A===null||A===xs||A===Qs?W=i.DEPTH24_STENCIL8:A===Wn?W=i.DEPTH32F_STENCIL8:A===zr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===xs||A===Qs?W=i.DEPTH_COMPONENT24:A===Wn?W=i.DEPTH_COMPONENT32F:A===zr&&(W=i.DEPTH_COMPONENT16),W}function T(I,A){return g(I)===!0||I.isFramebufferTexture&&I.minFilter!==un&&I.minFilter!==ii?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function b(I){const A=I.target;A.removeEventListener("dispose",b),w(A),A.isVideoTexture&&h.delete(A)}function E(I){const A=I.target;A.removeEventListener("dispose",E),S(A)}function w(I){const A=n.get(I);if(A.__webglInit===void 0)return;const W=I.source,K=d.get(W);if(K){const lt=K[A.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&y(I),Object.keys(K).length===0&&d.delete(W)}n.remove(I)}function y(I){const A=n.get(I);i.deleteTexture(A.__webglTexture);const W=I.source,K=d.get(W);delete K[A.__cacheKey],a.memory.textures--}function S(I){const A=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(A.__webglFramebuffer[K]))for(let lt=0;lt<A.__webglFramebuffer[K].length;lt++)i.deleteFramebuffer(A.__webglFramebuffer[K][lt]);else i.deleteFramebuffer(A.__webglFramebuffer[K]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[K])}else{if(Array.isArray(A.__webglFramebuffer))for(let K=0;K<A.__webglFramebuffer.length;K++)i.deleteFramebuffer(A.__webglFramebuffer[K]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let K=0;K<A.__webglColorRenderbuffer.length;K++)A.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[K]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const W=I.textures;for(let K=0,lt=W.length;K<lt;K++){const Z=n.get(W[K]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(W[K])}n.remove(I)}let R=0;function L(){R=0}function P(){const I=R;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),R+=1,I}function U(I){const A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function O(I,A){const W=n.get(I);if(I.isVideoTexture&&ft(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&W.__version!==I.version){const K=I.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(W,I,A);return}}else I.isExternalTexture&&(W.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+A)}function z(I,A){const W=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){$(W,I,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+A)}function V(I,A){const W=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){$(W,I,A);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+A)}function k(I,A){const W=n.get(I);if(I.version>0&&W.__version!==I.version){it(W,I,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+A)}const B={[ci]:i.REPEAT,[fs]:i.CLAMP_TO_EDGE,[Ol]:i.MIRRORED_REPEAT},q={[un]:i.NEAREST,[l0]:i.NEAREST_MIPMAP_NEAREST,[ea]:i.NEAREST_MIPMAP_LINEAR,[ii]:i.LINEAR,[Uo]:i.LINEAR_MIPMAP_NEAREST,[ds]:i.LINEAR_MIPMAP_LINEAR},Q={[f0]:i.NEVER,[v0]:i.ALWAYS,[d0]:i.LESS,[Nf]:i.LEQUAL,[p0]:i.EQUAL,[x0]:i.GEQUAL,[m0]:i.GREATER,[g0]:i.NOTEQUAL};function at(I,A){if(A.type===Wn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===ii||A.magFilter===Uo||A.magFilter===ea||A.magFilter===ds||A.minFilter===ii||A.minFilter===Uo||A.minFilter===ea||A.minFilter===ds)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,B[A.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,B[A.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,B[A.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,q[A.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,q[A.minFilter]),A.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,Q[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===un||A.minFilter!==ea&&A.minFilter!==ds||A.type===Wn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function dt(I,A){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",b));const K=A.source;let lt=d.get(K);lt===void 0&&(lt={},d.set(K,lt));const Z=U(A);if(Z!==I.__cacheKey){lt[Z]===void 0&&(lt[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),lt[Z].usedTimes++;const Et=lt[I.__cacheKey];Et!==void 0&&(lt[I.__cacheKey].usedTimes--,Et.usedTimes===0&&y(A)),I.__cacheKey=Z,I.__webglTexture=lt[Z].texture}return W}function Ct(I,A,W){return Math.floor(Math.floor(I/W)/A)}function It(I,A,W,K){const Z=I.updateRanges;if(Z.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,W,K,A.data);else{Z.sort((vt,Lt)=>vt.start-Lt.start);let Et=0;for(let vt=1;vt<Z.length;vt++){const Lt=Z[Et],Kt=Z[vt],Xt=Lt.start+Lt.count,Rt=Ct(Kt.start,A.width,4),ee=Ct(Lt.start,A.width,4);Kt.start<=Xt+1&&Rt===ee&&Ct(Kt.start+Kt.count-1,A.width,4)===Rt?Lt.count=Math.max(Lt.count,Kt.start+Kt.count-Lt.start):(++Et,Z[Et]=Kt)}Z.length=Et+1;const pt=i.getParameter(i.UNPACK_ROW_LENGTH),Pt=i.getParameter(i.UNPACK_SKIP_PIXELS),zt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let vt=0,Lt=Z.length;vt<Lt;vt++){const Kt=Z[vt],Xt=Math.floor(Kt.start/4),Rt=Math.ceil(Kt.count/4),ee=Xt%A.width,G=Math.floor(Xt/A.width),_t=Rt,wt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,ee),i.pixelStorei(i.UNPACK_SKIP_ROWS,G),e.texSubImage2D(i.TEXTURE_2D,0,ee,G,_t,wt,W,K,A.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,pt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pt),i.pixelStorei(i.UNPACK_SKIP_ROWS,zt)}}function $(I,A,W){let K=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(K=i.TEXTURE_3D);const lt=dt(I,A),Z=A.source;e.bindTexture(K,I.__webglTexture,i.TEXTURE0+W);const Et=n.get(Z);if(Z.version!==Et.__version||lt===!0){e.activeTexture(i.TEXTURE0+W);const pt=me.getPrimaries(me.workingColorSpace),Pt=A.colorSpace===mn?null:me.getPrimaries(A.colorSpace),zt=A.colorSpace===mn||pt===Pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let vt=x(A.image,!1,s.maxTextureSize);vt=$t(A,vt);const Lt=r.convert(A.format,A.colorSpace),Kt=r.convert(A.type);let Xt=M(A.internalFormat,Lt,Kt,A.colorSpace,A.isVideoTexture);at(K,A);let Rt;const ee=A.mipmaps,G=A.isVideoTexture!==!0,_t=Et.__version===void 0||lt===!0,wt=Z.dataReady,Ht=T(A,vt);if(A.isDepthTexture)Xt=_(A.format===tr,A.type),_t&&(G?e.texStorage2D(i.TEXTURE_2D,1,Xt,vt.width,vt.height):e.texImage2D(i.TEXTURE_2D,0,Xt,vt.width,vt.height,0,Lt,Kt,null));else if(A.isDataTexture)if(ee.length>0){G&&_t&&e.texStorage2D(i.TEXTURE_2D,Ht,Xt,ee[0].width,ee[0].height);for(let yt=0,ht=ee.length;yt<ht;yt++)Rt=ee[yt],G?wt&&e.texSubImage2D(i.TEXTURE_2D,yt,0,0,Rt.width,Rt.height,Lt,Kt,Rt.data):e.texImage2D(i.TEXTURE_2D,yt,Xt,Rt.width,Rt.height,0,Lt,Kt,Rt.data);A.generateMipmaps=!1}else G?(_t&&e.texStorage2D(i.TEXTURE_2D,Ht,Xt,vt.width,vt.height),wt&&It(A,vt,Lt,Kt)):e.texImage2D(i.TEXTURE_2D,0,Xt,vt.width,vt.height,0,Lt,Kt,vt.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){G&&_t&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,Xt,ee[0].width,ee[0].height,vt.depth);for(let yt=0,ht=ee.length;yt<ht;yt++)if(Rt=ee[yt],A.format!==Un)if(Lt!==null)if(G){if(wt)if(A.layerUpdates.size>0){const Wt=su(Rt.width,Rt.height,A.format,A.type);for(const re of A.layerUpdates){const we=Rt.data.subarray(re*Wt/Rt.data.BYTES_PER_ELEMENT,(re+1)*Wt/Rt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,yt,0,0,re,Rt.width,Rt.height,1,Lt,we)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,yt,0,0,0,Rt.width,Rt.height,vt.depth,Lt,Rt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,yt,Xt,Rt.width,Rt.height,vt.depth,0,Rt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?wt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,yt,0,0,0,Rt.width,Rt.height,vt.depth,Lt,Kt,Rt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,yt,Xt,Rt.width,Rt.height,vt.depth,0,Lt,Kt,Rt.data)}else{G&&_t&&e.texStorage2D(i.TEXTURE_2D,Ht,Xt,ee[0].width,ee[0].height);for(let yt=0,ht=ee.length;yt<ht;yt++)Rt=ee[yt],A.format!==Un?Lt!==null?G?wt&&e.compressedTexSubImage2D(i.TEXTURE_2D,yt,0,0,Rt.width,Rt.height,Lt,Rt.data):e.compressedTexImage2D(i.TEXTURE_2D,yt,Xt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?wt&&e.texSubImage2D(i.TEXTURE_2D,yt,0,0,Rt.width,Rt.height,Lt,Kt,Rt.data):e.texImage2D(i.TEXTURE_2D,yt,Xt,Rt.width,Rt.height,0,Lt,Kt,Rt.data)}else if(A.isDataArrayTexture)if(G){if(_t&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,Xt,vt.width,vt.height,vt.depth),wt)if(A.layerUpdates.size>0){const yt=su(vt.width,vt.height,A.format,A.type);for(const ht of A.layerUpdates){const Wt=vt.data.subarray(ht*yt/vt.data.BYTES_PER_ELEMENT,(ht+1)*yt/vt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ht,vt.width,vt.height,1,Lt,Kt,Wt)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,vt.width,vt.height,vt.depth,Lt,Kt,vt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Xt,vt.width,vt.height,vt.depth,0,Lt,Kt,vt.data);else if(A.isData3DTexture)G?(_t&&e.texStorage3D(i.TEXTURE_3D,Ht,Xt,vt.width,vt.height,vt.depth),wt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,vt.width,vt.height,vt.depth,Lt,Kt,vt.data)):e.texImage3D(i.TEXTURE_3D,0,Xt,vt.width,vt.height,vt.depth,0,Lt,Kt,vt.data);else if(A.isFramebufferTexture){if(_t)if(G)e.texStorage2D(i.TEXTURE_2D,Ht,Xt,vt.width,vt.height);else{let yt=vt.width,ht=vt.height;for(let Wt=0;Wt<Ht;Wt++)e.texImage2D(i.TEXTURE_2D,Wt,Xt,yt,ht,0,Lt,Kt,null),yt>>=1,ht>>=1}}else if(ee.length>0){if(G&&_t){const yt=xt(ee[0]);e.texStorage2D(i.TEXTURE_2D,Ht,Xt,yt.width,yt.height)}for(let yt=0,ht=ee.length;yt<ht;yt++)Rt=ee[yt],G?wt&&e.texSubImage2D(i.TEXTURE_2D,yt,0,0,Lt,Kt,Rt):e.texImage2D(i.TEXTURE_2D,yt,Xt,Lt,Kt,Rt);A.generateMipmaps=!1}else if(G){if(_t){const yt=xt(vt);e.texStorage2D(i.TEXTURE_2D,Ht,Xt,yt.width,yt.height)}wt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Lt,Kt,vt)}else e.texImage2D(i.TEXTURE_2D,0,Xt,Lt,Kt,vt);g(A)&&p(K),Et.__version=Z.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function it(I,A,W){if(A.image.length!==6)return;const K=dt(I,A),lt=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+W);const Z=n.get(lt);if(lt.version!==Z.__version||K===!0){e.activeTexture(i.TEXTURE0+W);const Et=me.getPrimaries(me.workingColorSpace),pt=A.colorSpace===mn?null:me.getPrimaries(A.colorSpace),Pt=A.colorSpace===mn||Et===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const zt=A.isCompressedTexture||A.image[0].isCompressedTexture,vt=A.image[0]&&A.image[0].isDataTexture,Lt=[];for(let ht=0;ht<6;ht++)!zt&&!vt?Lt[ht]=x(A.image[ht],!0,s.maxCubemapSize):Lt[ht]=vt?A.image[ht].image:A.image[ht],Lt[ht]=$t(A,Lt[ht]);const Kt=Lt[0],Xt=r.convert(A.format,A.colorSpace),Rt=r.convert(A.type),ee=M(A.internalFormat,Xt,Rt,A.colorSpace),G=A.isVideoTexture!==!0,_t=Z.__version===void 0||K===!0,wt=lt.dataReady;let Ht=T(A,Kt);at(i.TEXTURE_CUBE_MAP,A);let yt;if(zt){G&&_t&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ht,ee,Kt.width,Kt.height);for(let ht=0;ht<6;ht++){yt=Lt[ht].mipmaps;for(let Wt=0;Wt<yt.length;Wt++){const re=yt[Wt];A.format!==Un?Xt!==null?G?wt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt,0,0,re.width,re.height,Xt,re.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt,ee,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt,0,0,re.width,re.height,Xt,Rt,re.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt,ee,re.width,re.height,0,Xt,Rt,re.data)}}}else{if(yt=A.mipmaps,G&&_t){yt.length>0&&Ht++;const ht=xt(Lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ht,ee,ht.width,ht.height)}for(let ht=0;ht<6;ht++)if(vt){G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,Lt[ht].width,Lt[ht].height,Xt,Rt,Lt[ht].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,ee,Lt[ht].width,Lt[ht].height,0,Xt,Rt,Lt[ht].data);for(let Wt=0;Wt<yt.length;Wt++){const we=yt[Wt].image[ht].image;G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt+1,0,0,we.width,we.height,Xt,Rt,we.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt+1,ee,we.width,we.height,0,Xt,Rt,we.data)}}else{G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,Xt,Rt,Lt[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,ee,Xt,Rt,Lt[ht]);for(let Wt=0;Wt<yt.length;Wt++){const re=yt[Wt];G?wt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt+1,0,0,Xt,Rt,re.image[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Wt+1,ee,Xt,Rt,re.image[ht])}}}g(A)&&p(i.TEXTURE_CUBE_MAP),Z.__version=lt.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function gt(I,A,W,K,lt,Z){const Et=r.convert(W.format,W.colorSpace),pt=r.convert(W.type),Pt=M(W.internalFormat,Et,pt,W.colorSpace),zt=n.get(A),vt=n.get(W);if(vt.__renderTarget=A,!zt.__hasExternalTextures){const Lt=Math.max(1,A.width>>Z),Kt=Math.max(1,A.height>>Z);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,Z,Pt,Lt,Kt,A.depth,0,Et,pt,null):e.texImage2D(lt,Z,Pt,Lt,Kt,0,Et,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),ct(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,lt,vt.__webglTexture,0,mt(A)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,lt,vt.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(I,A,W){if(i.bindRenderbuffer(i.RENDERBUFFER,I),A.depthBuffer){const K=A.depthTexture,lt=K&&K.isDepthTexture?K.type:null,Z=_(A.stencilBuffer,lt),Et=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=mt(A);ct(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt,Z,A.width,A.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt,Z,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Z,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Et,i.RENDERBUFFER,I)}else{const K=A.textures;for(let lt=0;lt<K.length;lt++){const Z=K[lt],Et=r.convert(Z.format,Z.colorSpace),pt=r.convert(Z.type),Pt=M(Z.internalFormat,Et,pt,Z.colorSpace),zt=mt(A);W&&ct(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,zt,Pt,A.width,A.height):ct(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,zt,Pt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Pt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(A.depthTexture);K.__renderTarget=A,(!K.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),O(A.depthTexture,0);const lt=K.__webglTexture,Z=mt(A);if(A.depthTexture.format===Br)ct(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(A.depthTexture.format===tr)ct(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Yt(I){const A=n.get(I),W=I.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==I.depthTexture){const K=I.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),K){const lt=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,K.removeEventListener("dispose",lt)};K.addEventListener("dispose",lt),A.__depthDisposeCallback=lt}A.__boundDepthTexture=K}if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const K=I.texture.mipmaps;K&&K.length>0?bt(A.__webglFramebuffer[0],I):bt(A.__webglFramebuffer,I)}else if(W){A.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[K]),A.__webglDepthbuffer[K]===void 0)A.__webglDepthbuffer[K]=i.createRenderbuffer(),Mt(A.__webglDepthbuffer[K],I,!1);else{const lt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=A.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,Z)}}else{const K=I.texture.mipmaps;if(K&&K.length>0?e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),Mt(A.__webglDepthbuffer,I,!1);else{const lt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,Z)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(I,A,W){const K=n.get(I);A!==void 0&&gt(K.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Yt(I)}function F(I){const A=I.texture,W=n.get(I),K=n.get(A);I.addEventListener("dispose",E);const lt=I.textures,Z=I.isWebGLCubeRenderTarget===!0,Et=lt.length>1;if(Et||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=A.version,a.memory.textures++),Z){W.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer[pt]=[];for(let Pt=0;Pt<A.mipmaps.length;Pt++)W.__webglFramebuffer[pt][Pt]=i.createFramebuffer()}else W.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer=[];for(let pt=0;pt<A.mipmaps.length;pt++)W.__webglFramebuffer[pt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Et)for(let pt=0,Pt=lt.length;pt<Pt;pt++){const zt=n.get(lt[pt]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&ct(I)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let pt=0;pt<lt.length;pt++){const Pt=lt[pt];W.__webglColorRenderbuffer[pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[pt]);const zt=r.convert(Pt.format,Pt.colorSpace),vt=r.convert(Pt.type),Lt=M(Pt.internalFormat,zt,vt,Pt.colorSpace,I.isXRRenderTarget===!0),Kt=mt(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Kt,Lt,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,W.__webglColorRenderbuffer[pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),Mt(W.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),at(i.TEXTURE_CUBE_MAP,A);for(let pt=0;pt<6;pt++)if(A.mipmaps&&A.mipmaps.length>0)for(let Pt=0;Pt<A.mipmaps.length;Pt++)gt(W.__webglFramebuffer[pt][Pt],I,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Pt);else gt(W.__webglFramebuffer[pt],I,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);g(A)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let pt=0,Pt=lt.length;pt<Pt;pt++){const zt=lt[pt],vt=n.get(zt);let Lt=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Lt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Lt,vt.__webglTexture),at(Lt,zt),gt(W.__webglFramebuffer,I,zt,i.COLOR_ATTACHMENT0+pt,Lt,0),g(zt)&&p(Lt)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(pt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,K.__webglTexture),at(pt,A),A.mipmaps&&A.mipmaps.length>0)for(let Pt=0;Pt<A.mipmaps.length;Pt++)gt(W.__webglFramebuffer[Pt],I,A,i.COLOR_ATTACHMENT0,pt,Pt);else gt(W.__webglFramebuffer,I,A,i.COLOR_ATTACHMENT0,pt,0);g(A)&&p(pt),e.unbindTexture()}I.depthBuffer&&Yt(I)}function J(I){const A=I.textures;for(let W=0,K=A.length;W<K;W++){const lt=A[W];if(g(lt)){const Z=v(I),Et=n.get(lt).__webglTexture;e.bindTexture(Z,Et),p(Z),e.unbindTexture()}}}const j=[],rt=[];function st(I){if(I.samples>0){if(ct(I)===!1){const A=I.textures,W=I.width,K=I.height;let lt=i.COLOR_BUFFER_BIT;const Z=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=n.get(I),pt=A.length>1;if(pt)for(let zt=0;zt<A.length;zt++)e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer);const Pt=I.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let zt=0;zt<A.length;zt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),pt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Et.__webglColorRenderbuffer[zt]);const vt=n.get(A[zt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,vt,0)}i.blitFramebuffer(0,0,W,K,0,0,W,K,lt,i.NEAREST),l===!0&&(j.length=0,rt.length=0,j.push(i.COLOR_ATTACHMENT0+zt),I.depthBuffer&&I.resolveDepthBuffer===!1&&(j.push(Z),rt.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,rt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,j))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pt)for(let zt=0;zt<A.length;zt++){e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.RENDERBUFFER,Et.__webglColorRenderbuffer[zt]);const vt=n.get(A[zt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+zt,i.TEXTURE_2D,vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){const A=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function mt(I){return Math.min(s.maxSamples,I.samples)}function ct(I){const A=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ft(I){const A=a.render.frame;h.get(I)!==A&&(h.set(I,A),I.update())}function $t(I,A){const W=I.colorSpace,K=I.format,lt=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==er&&W!==mn&&(me.getTransfer(W)===ve?(K!==Un||lt!==hi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),A}function xt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=L,this.setTexture2D=O,this.setTexture2DArray=z,this.setTexture3D=V,this.setTextureCube=k,this.rebindTextures=Ot,this.setupRenderTarget=F,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=Yt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=ct}function Lv(i,t){function e(n,s=mn){let r;const a=me.getTransfer(s);if(n===hi)return i.UNSIGNED_BYTE;if(n===zc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Bc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Pf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===If)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Rf)return i.BYTE;if(n===Cf)return i.SHORT;if(n===zr)return i.UNSIGNED_SHORT;if(n===Oc)return i.INT;if(n===xs)return i.UNSIGNED_INT;if(n===Wn)return i.FLOAT;if(n===ui)return i.HALF_FLOAT;if(n===Lf)return i.ALPHA;if(n===Df)return i.RGB;if(n===Un)return i.RGBA;if(n===Br)return i.DEPTH_COMPONENT;if(n===tr)return i.DEPTH_STENCIL;if(n===_o)return i.RED;if(n===kc)return i.RED_INTEGER;if(n===Uf)return i.RG;if(n===Hc)return i.RG_INTEGER;if(n===Gc)return i.RGBA_INTEGER;if(n===qa||n===Ya||n===$a||n===Za)if(a===ve)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zl||n===Bl||n===kl||n===Hl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===zl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===kl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Gl||n===Vl||n===Wl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Gl||n===Vl)return a===ve?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Wl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xl||n===ql||n===Yl||n===$l||n===Zl||n===Jl||n===Kl||n===jl||n===Ql||n===tc||n===ec||n===nc||n===ic||n===sc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ql)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Yl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$l)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Zl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Kl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===jl)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ql)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===tc)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ec)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nc)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ic)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sc)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rc||n===ac||n===oc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===rc)return a===ve?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ac)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===oc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===lc||n===cc||n===hc||n===uc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===lc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===cc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===hc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===uc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Dv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uv=`
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

}`;class Nv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new qf(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new hn({vertexShader:Dv,fragmentShader:Uv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Gt(new fe(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fv extends ar{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const x=typeof XRWebGLBinding<"u",g=new Nv,p={},v=e.getContextAttributes();let M=null,_=null;const T=[],b=[],E=new ut;let w=null;const y=new sn;y.viewport=new ye;const S=new sn;S.viewport=new ye;const R=[y,S],L=new em;let P=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let it=T[$];return it===void 0&&(it=new el,T[$]=it),it.getTargetRaySpace()},this.getControllerGrip=function($){let it=T[$];return it===void 0&&(it=new el,T[$]=it),it.getGripSpace()},this.getHand=function($){let it=T[$];return it===void 0&&(it=new el,T[$]=it),it.getHandSpace()};function O($){const it=b.indexOf($.inputSource);if(it===-1)return;const gt=T[it];gt!==void 0&&(gt.update($.inputSource,$.frame,c||a),gt.dispatchEvent({type:$.type,data:$.inputSource}))}function z(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",V);for(let $=0;$<T.length;$++){const it=b[$];it!==null&&(b[$]=null,T[$].disconnect(it))}P=null,U=null,g.reset();for(const $ in p)delete p[$];t.setRenderTarget(M),u=null,d=null,f=null,s=null,_=null,It.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",z),s.addEventListener("inputsourceschange",V),v.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let gt=null,Mt=null,bt=null;v.depth&&(bt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,gt=v.stencil?tr:Br,Mt=v.stencil?Qs:xs);const Yt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(Yt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new Tn(d.textureWidth,d.textureHeight,{format:Un,type:hi,depthTexture:new Jc(d.textureWidth,d.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,gt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const gt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,gt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),_=new Tn(u.framebufferWidth,u.framebufferHeight,{format:Un,type:hi,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),It.setContext(s),It.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V($){for(let it=0;it<$.removed.length;it++){const gt=$.removed[it],Mt=b.indexOf(gt);Mt>=0&&(b[Mt]=null,T[Mt].disconnect(gt))}for(let it=0;it<$.added.length;it++){const gt=$.added[it];let Mt=b.indexOf(gt);if(Mt===-1){for(let Yt=0;Yt<T.length;Yt++)if(Yt>=b.length){b.push(gt),Mt=Yt;break}else if(b[Yt]===null){b[Yt]=gt,Mt=Yt;break}if(Mt===-1)break}const bt=T[Mt];bt&&bt.connect(gt)}}const k=new D,B=new D;function q($,it,gt){k.setFromMatrixPosition(it.matrixWorld),B.setFromMatrixPosition(gt.matrixWorld);const Mt=k.distanceTo(B),bt=it.projectionMatrix.elements,Yt=gt.projectionMatrix.elements,Ot=bt[14]/(bt[10]-1),F=bt[14]/(bt[10]+1),J=(bt[9]+1)/bt[5],j=(bt[9]-1)/bt[5],rt=(bt[8]-1)/bt[0],st=(Yt[8]+1)/Yt[0],mt=Ot*rt,ct=Ot*st,ft=Mt/(-rt+st),$t=ft*-rt;if(it.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX($t),$.translateZ(ft),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),bt[10]===-1)$.projectionMatrix.copy(it.projectionMatrix),$.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const xt=Ot+ft,I=F+ft,A=mt-$t,W=ct+(Mt-$t),K=J*F/I*xt,lt=j*F/I*xt;$.projectionMatrix.makePerspective(A,W,K,lt,xt,I),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Q($,it){it===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(it.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let it=$.near,gt=$.far;g.texture!==null&&(g.depthNear>0&&(it=g.depthNear),g.depthFar>0&&(gt=g.depthFar)),L.near=S.near=y.near=it,L.far=S.far=y.far=gt,(P!==L.near||U!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),P=L.near,U=L.far),L.layers.mask=$.layers.mask|6,y.layers.mask=L.layers.mask&3,S.layers.mask=L.layers.mask&5;const Mt=$.parent,bt=L.cameras;Q(L,Mt);for(let Yt=0;Yt<bt.length;Yt++)Q(bt[Yt],Mt);bt.length===2?q(L,y,S):L.projectionMatrix.copy(y.projectionMatrix),at($,L,Mt)};function at($,it,gt){gt===null?$.matrix.copy(it.matrixWorld):($.matrix.copy(gt.matrixWorld),$.matrix.invert(),$.matrix.multiply(it.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(it.projectionMatrix),$.projectionMatrixInverse.copy(it.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=kr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function($){return p[$]};let dt=null;function Ct($,it){if(h=it.getViewerPose(c||a),m=it,h!==null){const gt=h.views;u!==null&&(t.setRenderTargetFramebuffer(_,u.framebuffer),t.setRenderTarget(_));let Mt=!1;gt.length!==L.cameras.length&&(L.cameras.length=0,Mt=!0);for(let F=0;F<gt.length;F++){const J=gt[F];let j=null;if(u!==null)j=u.getViewport(J);else{const st=f.getViewSubImage(d,J);j=st.viewport,F===0&&(t.setRenderTargetTextures(_,st.colorTexture,st.depthStencilTexture),t.setRenderTarget(_))}let rt=R[F];rt===void 0&&(rt=new sn,rt.layers.enable(F),rt.viewport=new ye,R[F]=rt),rt.matrix.fromArray(J.transform.matrix),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.projectionMatrix.fromArray(J.projectionMatrix),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert(),rt.viewport.set(j.x,j.y,j.width,j.height),F===0&&(L.matrix.copy(rt.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Mt===!0&&L.cameras.push(rt)}const bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=n.getBinding();const F=f.getDepthInformation(gt[0]);F&&F.isValid&&F.texture&&g.init(F,s.renderState)}if(bt&&bt.includes("camera-access")&&x){t.state.unbindTexture(),f=n.getBinding();for(let F=0;F<gt.length;F++){const J=gt[F].camera;if(J){let j=p[J];j||(j=new qf,p[J]=j);const rt=f.getCameraImage(J);j.sourceTexture=rt}}}}for(let gt=0;gt<T.length;gt++){const Mt=b[gt],bt=T[gt];Mt!==null&&bt!==void 0&&bt.update(Mt,it,c||a)}dt&&dt($,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),m=null}const It=new sd;It.setAnimationLoop(Ct),this.setAnimationLoop=function($){dt=$},this.dispose=function(){}}}const is=new xn,Ov=new te;function zv(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Hf(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,v,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,v,M):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===rn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===rn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const v=t.get(p),M=v.envMap,_=v.envMapRotation;M&&(g.envMap.value=M,is.copy(_),is.x*=-1,is.y*=-1,is.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),g.envMapRotation.value.setFromMatrix4(Ov.makeRotationFromEuler(is)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,v,M){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=M*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===rn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const v=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Bv(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){const _=M.program;n.uniformBlockBinding(v,_)}function c(v,M){let _=s[v.id];_===void 0&&(m(v),_=h(v),s[v.id]=_,v.addEventListener("dispose",g));const T=M.program;n.updateUBOMapping(v,T);const b=t.render.frame;r[v.id]!==b&&(d(v),r[v.id]=b)}function h(v){const M=f();v.__bindingPointIndex=M;const _=i.createBuffer(),T=v.__size,b=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,T,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const M=s[v.id],_=v.uniforms,T=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let b=0,E=_.length;b<E;b++){const w=Array.isArray(_[b])?_[b]:[_[b]];for(let y=0,S=w.length;y<S;y++){const R=w[y];if(u(R,b,y,T)===!0){const L=R.__offset,P=Array.isArray(R.value)?R.value:[R.value];let U=0;for(let O=0;O<P.length;O++){const z=P[O],V=x(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,L+U,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,U),U+=V.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(v,M,_,T){const b=v.value,E=M+"_"+_;if(T[E]===void 0)return typeof b=="number"||typeof b=="boolean"?T[E]=b:T[E]=b.clone(),!0;{const w=T[E];if(typeof b=="number"||typeof b=="boolean"){if(w!==b)return T[E]=b,!0}else if(w.equals(b)===!1)return w.copy(b),!0}return!1}function m(v){const M=v.uniforms;let _=0;const T=16;for(let E=0,w=M.length;E<w;E++){const y=Array.isArray(M[E])?M[E]:[M[E]];for(let S=0,R=y.length;S<R;S++){const L=y[S],P=Array.isArray(L.value)?L.value:[L.value];for(let U=0,O=P.length;U<O;U++){const z=P[U],V=x(z),k=_%T,B=k%V.boundary,q=k+B;_+=B,q!==0&&T-q<V.storage&&(_+=T-q),L.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=_,_+=V.storage}}}const b=_%T;return b>0&&(_+=T-b),v.__size=_,v.__cache={},this}function x(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function g(v){const M=v.target;M.removeEventListener("dispose",g);const _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}class kv{constructor(t={}){const{canvas:e=N0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const m=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const v=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let T=!1;this._outputColorSpace=qe;let b=0,E=0,w=null,y=-1,S=null;const R=new ye,L=new ye;let P=null;const U=new qt(0);let O=0,z=e.width,V=e.height,k=1,B=null,q=null;const Q=new ye(0,0,z,V),at=new ye(0,0,z,V);let dt=!1;const Ct=new Zc;let It=!1,$=!1;const it=new te,gt=new D,Mt=new ye,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function Ot(){return w===null?k:1}let F=n;function J(C,X){return e.getContext(C,X)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Uc}`),e.addEventListener("webglcontextlost",wt,!1),e.addEventListener("webglcontextrestored",Ht,!1),e.addEventListener("webglcontextcreationerror",yt,!1),F===null){const X="webgl2";if(F=J(X,C),F===null)throw J(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let j,rt,st,mt,ct,ft,$t,xt,I,A,W,K,lt,Z,Et,pt,Pt,zt,vt,Lt,Kt,Xt,Rt,ee;function G(){j=new Jg(F),j.init(),Xt=new Lv(F,j),rt=new Vg(F,j,t,Xt),st=new Pv(F,j),rt.reversedDepthBuffer&&d&&st.buffers.depth.setReversed(!0),mt=new Qg(F),ct=new xv,ft=new Iv(F,j,st,ct,rt,Xt,mt),$t=new Xg(_),xt=new Zg(_),I=new rm(F),Rt=new Hg(F,I),A=new Kg(F,I,mt,Rt),W=new ex(F,A,I,mt),vt=new tx(F,rt,ft),pt=new Wg(ct),K=new gv(_,$t,xt,j,rt,Rt,pt),lt=new zv(_,ct),Z=new _v,Et=new Tv(j),zt=new kg(_,$t,xt,st,W,u,l),Pt=new Rv(_,W,rt),ee=new Bv(F,mt,rt,st),Lt=new Gg(F,j,mt),Kt=new jg(F,j,mt),mt.programs=K.programs,_.capabilities=rt,_.extensions=j,_.properties=ct,_.renderLists=Z,_.shadowMap=Pt,_.state=st,_.info=mt}G();const _t=new Fv(_,F);this.xr=_t,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const C=j.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=j.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(C){C!==void 0&&(k=C,this.setSize(z,V,!1))},this.getSize=function(C){return C.set(z,V)},this.setSize=function(C,X,tt=!0){if(_t.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,V=X,e.width=Math.floor(C*k),e.height=Math.floor(X*k),tt===!0&&(e.style.width=C+"px",e.style.height=X+"px"),this.setViewport(0,0,C,X)},this.getDrawingBufferSize=function(C){return C.set(z*k,V*k).floor()},this.setDrawingBufferSize=function(C,X,tt){z=C,V=X,k=tt,e.width=Math.floor(C*tt),e.height=Math.floor(X*tt),this.setViewport(0,0,C,X)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(Q)},this.setViewport=function(C,X,tt,nt){C.isVector4?Q.set(C.x,C.y,C.z,C.w):Q.set(C,X,tt,nt),st.viewport(R.copy(Q).multiplyScalar(k).round())},this.getScissor=function(C){return C.copy(at)},this.setScissor=function(C,X,tt,nt){C.isVector4?at.set(C.x,C.y,C.z,C.w):at.set(C,X,tt,nt),st.scissor(L.copy(at).multiplyScalar(k).round())},this.getScissorTest=function(){return dt},this.setScissorTest=function(C){st.setScissorTest(dt=C)},this.setOpaqueSort=function(C){B=C},this.setTransparentSort=function(C){q=C},this.getClearColor=function(C){return C.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(C=!0,X=!0,tt=!0){let nt=0;if(C){let Y=!1;if(w!==null){const St=w.texture.format;Y=St===Gc||St===Hc||St===kc}if(Y){const St=w.texture.type,Nt=St===hi||St===xs||St===zr||St===Qs||St===zc||St===Bc,Vt=zt.getClearColor(),Bt=zt.getClearAlpha(),Qt=Vt.r,ne=Vt.g,Zt=Vt.b;Nt?(m[0]=Qt,m[1]=ne,m[2]=Zt,m[3]=Bt,F.clearBufferuiv(F.COLOR,0,m)):(x[0]=Qt,x[1]=ne,x[2]=Zt,x[3]=Bt,F.clearBufferiv(F.COLOR,0,x))}else nt|=F.COLOR_BUFFER_BIT}X&&(nt|=F.DEPTH_BUFFER_BIT),tt&&(nt|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",wt,!1),e.removeEventListener("webglcontextrestored",Ht,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),zt.dispose(),Z.dispose(),Et.dispose(),ct.dispose(),$t.dispose(),xt.dispose(),W.dispose(),Rt.dispose(),ee.dispose(),K.dispose(),_t.dispose(),_t.removeEventListener("sessionstart",Zn),_t.removeEventListener("sessionend",uh),Ji.stop()};function wt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Ht(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const C=mt.autoReset,X=Pt.enabled,tt=Pt.autoUpdate,nt=Pt.needsUpdate,Y=Pt.type;G(),mt.autoReset=C,Pt.enabled=X,Pt.autoUpdate=tt,Pt.needsUpdate=nt,Pt.type=Y}function yt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ht(C){const X=C.target;X.removeEventListener("dispose",ht),Wt(X)}function Wt(C){re(C),ct.remove(C)}function re(C){const X=ct.get(C).programs;X!==void 0&&(X.forEach(function(tt){K.releaseProgram(tt)}),C.isShaderMaterial&&K.releaseShaderCache(C))}this.renderBufferDirect=function(C,X,tt,nt,Y,St){X===null&&(X=bt);const Nt=Y.isMesh&&Y.matrixWorld.determinant()<0,Vt=zd(C,X,tt,nt,Y);st.setMaterial(nt,Nt);let Bt=tt.index,Qt=1;if(nt.wireframe===!0){if(Bt=A.getWireframeAttribute(tt),Bt===void 0)return;Qt=2}const ne=tt.drawRange,Zt=tt.attributes.position;let ue=ne.start*Qt,Me=(ne.start+ne.count)*Qt;St!==null&&(ue=Math.max(ue,St.start*Qt),Me=Math.min(Me,(St.start+St.count)*Qt)),Bt!==null?(ue=Math.max(ue,0),Me=Math.min(Me,Bt.count)):Zt!=null&&(ue=Math.max(ue,0),Me=Math.min(Me,Zt.count));const Ue=Me-ue;if(Ue<0||Ue===1/0)return;Rt.setup(Y,nt,Vt,tt,Bt);let Te,Se=Lt;if(Bt!==null&&(Te=I.get(Bt),Se=Kt,Se.setIndex(Te)),Y.isMesh)nt.wireframe===!0?(st.setLineWidth(nt.wireframeLinewidth*Ot()),Se.setMode(F.LINES)):Se.setMode(F.TRIANGLES);else if(Y.isLine){let Jt=nt.linewidth;Jt===void 0&&(Jt=1),st.setLineWidth(Jt*Ot()),Y.isLineSegments?Se.setMode(F.LINES):Y.isLineLoop?Se.setMode(F.LINE_LOOP):Se.setMode(F.LINE_STRIP)}else Y.isPoints?Se.setMode(F.POINTS):Y.isSprite&&Se.setMode(F.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Gr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(j.get("WEBGL_multi_draw"))Se.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Jt=Y._multiDrawStarts,Pe=Y._multiDrawCounts,ge=Y._multiDrawCount,vn=Bt?I.get(Bt).bytesPerElement:1,ys=ct.get(nt).currentProgram.getUniforms();for(let _n=0;_n<ge;_n++)ys.setValue(F,"_gl_DrawID",_n),Se.render(Jt[_n]/vn,Pe[_n])}else if(Y.isInstancedMesh)Se.renderInstances(ue,Ue,Y.count);else if(tt.isInstancedBufferGeometry){const Jt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,Pe=Math.min(tt.instanceCount,Jt);Se.renderInstances(ue,Ue,Pe)}else Se.render(ue,Ue)};function we(C,X,tt){C.transparent===!0&&C.side===Oe&&C.forceSinglePass===!1?(C.side=rn,C.needsUpdate=!0,ta(C,X,tt),C.side=Yi,C.needsUpdate=!0,ta(C,X,tt),C.side=Oe):ta(C,X,tt)}this.compile=function(C,X,tt=null){tt===null&&(tt=C),p=Et.get(tt),p.init(X),M.push(p),tt.traverseVisible(function(Y){Y.isLight&&Y.layers.test(X.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),C!==tt&&C.traverseVisible(function(Y){Y.isLight&&Y.layers.test(X.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const nt=new Set;return C.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const St=Y.material;if(St)if(Array.isArray(St))for(let Nt=0;Nt<St.length;Nt++){const Vt=St[Nt];we(Vt,tt,Y),nt.add(Vt)}else we(St,tt,Y),nt.add(St)}),p=M.pop(),nt},this.compileAsync=function(C,X,tt=null){const nt=this.compile(C,X,tt);return new Promise(Y=>{function St(){if(nt.forEach(function(Nt){ct.get(Nt).currentProgram.isReady()&&nt.delete(Nt)}),nt.size===0){Y(C);return}setTimeout(St,10)}j.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let xe=null;function mi(C){xe&&xe(C)}function Zn(){Ji.stop()}function uh(){Ji.start()}const Ji=new sd;Ji.setAnimationLoop(mi),typeof self<"u"&&Ji.setContext(self),this.setAnimationLoop=function(C){xe=C,_t.setAnimationLoop(C),C===null?Ji.stop():Ji.start()},_t.addEventListener("sessionstart",Zn),_t.addEventListener("sessionend",uh),this.render=function(C,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),_t.enabled===!0&&_t.isPresenting===!0&&(_t.cameraAutoUpdate===!0&&_t.updateCamera(X),X=_t.getCamera()),C.isScene===!0&&C.onBeforeRender(_,C,X,w),p=Et.get(C,M.length),p.init(X),M.push(p),it.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),Ct.setFromProjectionMatrix(it,si,X.reversedDepth),$=this.localClippingEnabled,It=pt.init(this.clippingPlanes,$),g=Z.get(C,v.length),g.init(),v.push(g),_t.enabled===!0&&_t.isPresenting===!0){const St=_.xr.getDepthSensingMesh();St!==null&&Lo(St,X,-1/0,_.sortObjects)}Lo(C,X,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(B,q),Yt=_t.enabled===!1||_t.isPresenting===!1||_t.hasDepthSensing()===!1,Yt&&zt.addToRenderList(g,C),this.info.render.frame++,It===!0&&pt.beginShadows();const tt=p.state.shadowsArray;Pt.render(tt,C,X),It===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();const nt=g.opaque,Y=g.transmissive;if(p.setupLights(),X.isArrayCamera){const St=X.cameras;if(Y.length>0)for(let Nt=0,Vt=St.length;Nt<Vt;Nt++){const Bt=St[Nt];dh(nt,Y,C,Bt)}Yt&&zt.render(C);for(let Nt=0,Vt=St.length;Nt<Vt;Nt++){const Bt=St[Nt];fh(g,C,Bt,Bt.viewport)}}else Y.length>0&&dh(nt,Y,C,X),Yt&&zt.render(C),fh(g,C,X);w!==null&&E===0&&(ft.updateMultisampleRenderTarget(w),ft.updateRenderTargetMipmap(w)),C.isScene===!0&&C.onAfterRender(_,C,X),Rt.resetDefaultState(),y=-1,S=null,M.pop(),M.length>0?(p=M[M.length-1],It===!0&&pt.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Lo(C,X,tt,nt){if(C.visible===!1)return;if(C.layers.test(X.layers)){if(C.isGroup)tt=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(X);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Ct.intersectsSprite(C)){nt&&Mt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(it);const Nt=W.update(C),Vt=C.material;Vt.visible&&g.push(C,Nt,Vt,tt,Mt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Ct.intersectsObject(C))){const Nt=W.update(C),Vt=C.material;if(nt&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Mt.copy(C.boundingSphere.center)):(Nt.boundingSphere===null&&Nt.computeBoundingSphere(),Mt.copy(Nt.boundingSphere.center)),Mt.applyMatrix4(C.matrixWorld).applyMatrix4(it)),Array.isArray(Vt)){const Bt=Nt.groups;for(let Qt=0,ne=Bt.length;Qt<ne;Qt++){const Zt=Bt[Qt],ue=Vt[Zt.materialIndex];ue&&ue.visible&&g.push(C,Nt,ue,tt,Mt.z,Zt)}}else Vt.visible&&g.push(C,Nt,Vt,tt,Mt.z,null)}}const St=C.children;for(let Nt=0,Vt=St.length;Nt<Vt;Nt++)Lo(St[Nt],X,tt,nt)}function fh(C,X,tt,nt){const Y=C.opaque,St=C.transmissive,Nt=C.transparent;p.setupLightsView(tt),It===!0&&pt.setGlobalState(_.clippingPlanes,tt),nt&&st.viewport(R.copy(nt)),Y.length>0&&Qr(Y,X,tt),St.length>0&&Qr(St,X,tt),Nt.length>0&&Qr(Nt,X,tt),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function dh(C,X,tt,nt){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[nt.id]===void 0&&(p.state.transmissionRenderTarget[nt.id]=new Tn(1,1,{generateMipmaps:!0,type:j.has("EXT_color_buffer_half_float")||j.has("EXT_color_buffer_float")?ui:hi,minFilter:ds,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));const St=p.state.transmissionRenderTarget[nt.id],Nt=nt.viewport||R;St.setSize(Nt.z*_.transmissionResolutionScale,Nt.w*_.transmissionResolutionScale);const Vt=_.getRenderTarget(),Bt=_.getActiveCubeFace(),Qt=_.getActiveMipmapLevel();_.setRenderTarget(St),_.getClearColor(U),O=_.getClearAlpha(),O<1&&_.setClearColor(16777215,.5),_.clear(),Yt&&zt.render(tt);const ne=_.toneMapping;_.toneMapping=Wi;const Zt=nt.viewport;if(nt.viewport!==void 0&&(nt.viewport=void 0),p.setupLightsView(nt),It===!0&&pt.setGlobalState(_.clippingPlanes,nt),Qr(C,tt,nt),ft.updateMultisampleRenderTarget(St),ft.updateRenderTargetMipmap(St),j.has("WEBGL_multisampled_render_to_texture")===!1){let ue=!1;for(let Me=0,Ue=X.length;Me<Ue;Me++){const Te=X[Me],Se=Te.object,Jt=Te.geometry,Pe=Te.material,ge=Te.group;if(Pe.side===Oe&&Se.layers.test(nt.layers)){const vn=Pe.side;Pe.side=rn,Pe.needsUpdate=!0,ph(Se,tt,nt,Jt,Pe,ge),Pe.side=vn,Pe.needsUpdate=!0,ue=!0}}ue===!0&&(ft.updateMultisampleRenderTarget(St),ft.updateRenderTargetMipmap(St))}_.setRenderTarget(Vt,Bt,Qt),_.setClearColor(U,O),Zt!==void 0&&(nt.viewport=Zt),_.toneMapping=ne}function Qr(C,X,tt){const nt=X.isScene===!0?X.overrideMaterial:null;for(let Y=0,St=C.length;Y<St;Y++){const Nt=C[Y],Vt=Nt.object,Bt=Nt.geometry,Qt=Nt.group;let ne=Nt.material;ne.allowOverride===!0&&nt!==null&&(ne=nt),Vt.layers.test(tt.layers)&&ph(Vt,X,tt,Bt,ne,Qt)}}function ph(C,X,tt,nt,Y,St){C.onBeforeRender(_,X,tt,nt,Y,St),C.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),Y.onBeforeRender(_,X,tt,nt,C,St),Y.transparent===!0&&Y.side===Oe&&Y.forceSinglePass===!1?(Y.side=rn,Y.needsUpdate=!0,_.renderBufferDirect(tt,X,nt,Y,C,St),Y.side=Yi,Y.needsUpdate=!0,_.renderBufferDirect(tt,X,nt,Y,C,St),Y.side=Oe):_.renderBufferDirect(tt,X,nt,Y,C,St),C.onAfterRender(_,X,tt,nt,Y,St)}function ta(C,X,tt){X.isScene!==!0&&(X=bt);const nt=ct.get(C),Y=p.state.lights,St=p.state.shadowsArray,Nt=Y.state.version,Vt=K.getParameters(C,Y.state,St,X,tt),Bt=K.getProgramCacheKey(Vt);let Qt=nt.programs;nt.environment=C.isMeshStandardMaterial?X.environment:null,nt.fog=X.fog,nt.envMap=(C.isMeshStandardMaterial?xt:$t).get(C.envMap||nt.environment),nt.envMapRotation=nt.environment!==null&&C.envMap===null?X.environmentRotation:C.envMapRotation,Qt===void 0&&(C.addEventListener("dispose",ht),Qt=new Map,nt.programs=Qt);let ne=Qt.get(Bt);if(ne!==void 0){if(nt.currentProgram===ne&&nt.lightsStateVersion===Nt)return gh(C,Vt),ne}else Vt.uniforms=K.getUniforms(C),C.onBeforeCompile(Vt,_),ne=K.acquireProgram(Vt,Bt),Qt.set(Bt,ne),nt.uniforms=Vt.uniforms;const Zt=nt.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Zt.clippingPlanes=pt.uniform),gh(C,Vt),nt.needsLights=kd(C),nt.lightsStateVersion=Nt,nt.needsLights&&(Zt.ambientLightColor.value=Y.state.ambient,Zt.lightProbe.value=Y.state.probe,Zt.directionalLights.value=Y.state.directional,Zt.directionalLightShadows.value=Y.state.directionalShadow,Zt.spotLights.value=Y.state.spot,Zt.spotLightShadows.value=Y.state.spotShadow,Zt.rectAreaLights.value=Y.state.rectArea,Zt.ltc_1.value=Y.state.rectAreaLTC1,Zt.ltc_2.value=Y.state.rectAreaLTC2,Zt.pointLights.value=Y.state.point,Zt.pointLightShadows.value=Y.state.pointShadow,Zt.hemisphereLights.value=Y.state.hemi,Zt.directionalShadowMap.value=Y.state.directionalShadowMap,Zt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Zt.spotShadowMap.value=Y.state.spotShadowMap,Zt.spotLightMatrix.value=Y.state.spotLightMatrix,Zt.spotLightMap.value=Y.state.spotLightMap,Zt.pointShadowMap.value=Y.state.pointShadowMap,Zt.pointShadowMatrix.value=Y.state.pointShadowMatrix),nt.currentProgram=ne,nt.uniformsList=null,ne}function mh(C){if(C.uniformsList===null){const X=C.currentProgram.getUniforms();C.uniformsList=Ja.seqWithValue(X.seq,C.uniforms)}return C.uniformsList}function gh(C,X){const tt=ct.get(C);tt.outputColorSpace=X.outputColorSpace,tt.batching=X.batching,tt.batchingColor=X.batchingColor,tt.instancing=X.instancing,tt.instancingColor=X.instancingColor,tt.instancingMorph=X.instancingMorph,tt.skinning=X.skinning,tt.morphTargets=X.morphTargets,tt.morphNormals=X.morphNormals,tt.morphColors=X.morphColors,tt.morphTargetsCount=X.morphTargetsCount,tt.numClippingPlanes=X.numClippingPlanes,tt.numIntersection=X.numClipIntersection,tt.vertexAlphas=X.vertexAlphas,tt.vertexTangents=X.vertexTangents,tt.toneMapping=X.toneMapping}function zd(C,X,tt,nt,Y){X.isScene!==!0&&(X=bt),ft.resetTextureUnits();const St=X.fog,Nt=nt.isMeshStandardMaterial?X.environment:null,Vt=w===null?_.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:er,Bt=(nt.isMeshStandardMaterial?xt:$t).get(nt.envMap||Nt),Qt=nt.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,ne=!!tt.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),Zt=!!tt.morphAttributes.position,ue=!!tt.morphAttributes.normal,Me=!!tt.morphAttributes.color;let Ue=Wi;nt.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Ue=_.toneMapping);const Te=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,Se=Te!==void 0?Te.length:0,Jt=ct.get(nt),Pe=p.state.lights;if(It===!0&&($===!0||C!==S)){const an=C===S&&nt.id===y;pt.setState(nt,C,an)}let ge=!1;nt.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==Pe.state.version||Jt.outputColorSpace!==Vt||Y.isBatchedMesh&&Jt.batching===!1||!Y.isBatchedMesh&&Jt.batching===!0||Y.isBatchedMesh&&Jt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Jt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Jt.instancing===!1||!Y.isInstancedMesh&&Jt.instancing===!0||Y.isSkinnedMesh&&Jt.skinning===!1||!Y.isSkinnedMesh&&Jt.skinning===!0||Y.isInstancedMesh&&Jt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Jt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Jt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Jt.instancingMorph===!1&&Y.morphTexture!==null||Jt.envMap!==Bt||nt.fog===!0&&Jt.fog!==St||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==pt.numPlanes||Jt.numIntersection!==pt.numIntersection)||Jt.vertexAlphas!==Qt||Jt.vertexTangents!==ne||Jt.morphTargets!==Zt||Jt.morphNormals!==ue||Jt.morphColors!==Me||Jt.toneMapping!==Ue||Jt.morphTargetsCount!==Se)&&(ge=!0):(ge=!0,Jt.__version=nt.version);let vn=Jt.currentProgram;ge===!0&&(vn=ta(nt,X,Y));let ys=!1,_n=!1,hr=!1;const Ie=vn.getUniforms(),En=Jt.uniforms;if(st.useProgram(vn.program)&&(ys=!0,_n=!0,hr=!0),nt.id!==y&&(y=nt.id,_n=!0),ys||S!==C){st.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ie.setValue(F,"projectionMatrix",C.projectionMatrix),Ie.setValue(F,"viewMatrix",C.matrixWorldInverse);const dn=Ie.map.cameraPosition;dn!==void 0&&dn.setValue(F,gt.setFromMatrixPosition(C.matrixWorld)),rt.logarithmicDepthBuffer&&Ie.setValue(F,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&Ie.setValue(F,"isOrthographic",C.isOrthographicCamera===!0),S!==C&&(S=C,_n=!0,hr=!0)}if(Y.isSkinnedMesh){Ie.setOptional(F,Y,"bindMatrix"),Ie.setOptional(F,Y,"bindMatrixInverse");const an=Y.skeleton;an&&(an.boneTexture===null&&an.computeBoneTexture(),Ie.setValue(F,"boneTexture",an.boneTexture,ft))}Y.isBatchedMesh&&(Ie.setOptional(F,Y,"batchingTexture"),Ie.setValue(F,"batchingTexture",Y._matricesTexture,ft),Ie.setOptional(F,Y,"batchingIdTexture"),Ie.setValue(F,"batchingIdTexture",Y._indirectTexture,ft),Ie.setOptional(F,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Ie.setValue(F,"batchingColorTexture",Y._colorsTexture,ft));const An=tt.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&vt.update(Y,tt,vn),(_n||Jt.receiveShadow!==Y.receiveShadow)&&(Jt.receiveShadow=Y.receiveShadow,Ie.setValue(F,"receiveShadow",Y.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(En.envMap.value=Bt,En.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),nt.isMeshStandardMaterial&&nt.envMap===null&&X.environment!==null&&(En.envMapIntensity.value=X.environmentIntensity),_n&&(Ie.setValue(F,"toneMappingExposure",_.toneMappingExposure),Jt.needsLights&&Bd(En,hr),St&&nt.fog===!0&&lt.refreshFogUniforms(En,St),lt.refreshMaterialUniforms(En,nt,k,V,p.state.transmissionRenderTarget[C.id]),Ja.upload(F,mh(Jt),En,ft)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(Ja.upload(F,mh(Jt),En,ft),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&Ie.setValue(F,"center",Y.center),Ie.setValue(F,"modelViewMatrix",Y.modelViewMatrix),Ie.setValue(F,"normalMatrix",Y.normalMatrix),Ie.setValue(F,"modelMatrix",Y.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const an=nt.uniformsGroups;for(let dn=0,Do=an.length;dn<Do;dn++){const Ki=an[dn];ee.update(Ki,vn),ee.bind(Ki,vn)}}return vn}function Bd(C,X){C.ambientLightColor.needsUpdate=X,C.lightProbe.needsUpdate=X,C.directionalLights.needsUpdate=X,C.directionalLightShadows.needsUpdate=X,C.pointLights.needsUpdate=X,C.pointLightShadows.needsUpdate=X,C.spotLights.needsUpdate=X,C.spotLightShadows.needsUpdate=X,C.rectAreaLights.needsUpdate=X,C.hemisphereLights.needsUpdate=X}function kd(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(C,X,tt){const nt=ct.get(C);nt.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,nt.__autoAllocateDepthBuffer===!1&&(nt.__useRenderToTexture=!1),ct.get(C.texture).__webglTexture=X,ct.get(C.depthTexture).__webglTexture=nt.__autoAllocateDepthBuffer?void 0:tt,nt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,X){const tt=ct.get(C);tt.__webglFramebuffer=X,tt.__useDefaultFramebuffer=X===void 0};const Hd=F.createFramebuffer();this.setRenderTarget=function(C,X=0,tt=0){w=C,b=X,E=tt;let nt=!0,Y=null,St=!1,Nt=!1;if(C){const Bt=ct.get(C);if(Bt.__useDefaultFramebuffer!==void 0)st.bindFramebuffer(F.FRAMEBUFFER,null),nt=!1;else if(Bt.__webglFramebuffer===void 0)ft.setupRenderTarget(C);else if(Bt.__hasExternalTextures)ft.rebindTextures(C,ct.get(C.texture).__webglTexture,ct.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Zt=C.depthTexture;if(Bt.__boundDepthTexture!==Zt){if(Zt!==null&&ct.has(Zt)&&(C.width!==Zt.image.width||C.height!==Zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ft.setupDepthRenderbuffer(C)}}const Qt=C.texture;(Qt.isData3DTexture||Qt.isDataArrayTexture||Qt.isCompressedArrayTexture)&&(Nt=!0);const ne=ct.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ne[X])?Y=ne[X][tt]:Y=ne[X],St=!0):C.samples>0&&ft.useMultisampledRTT(C)===!1?Y=ct.get(C).__webglMultisampledFramebuffer:Array.isArray(ne)?Y=ne[tt]:Y=ne,R.copy(C.viewport),L.copy(C.scissor),P=C.scissorTest}else R.copy(Q).multiplyScalar(k).floor(),L.copy(at).multiplyScalar(k).floor(),P=dt;if(tt!==0&&(Y=Hd),st.bindFramebuffer(F.FRAMEBUFFER,Y)&&nt&&st.drawBuffers(C,Y),st.viewport(R),st.scissor(L),st.setScissorTest(P),St){const Bt=ct.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,Bt.__webglTexture,tt)}else if(Nt){const Bt=X;for(let Qt=0;Qt<C.textures.length;Qt++){const ne=ct.get(C.textures[Qt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Qt,ne.__webglTexture,tt,Bt)}}else if(C!==null&&tt!==0){const Bt=ct.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Bt.__webglTexture,tt)}y=-1},this.readRenderTargetPixels=function(C,X,tt,nt,Y,St,Nt,Vt=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Bt=ct.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Nt!==void 0&&(Bt=Bt[Nt]),Bt){st.bindFramebuffer(F.FRAMEBUFFER,Bt);try{const Qt=C.textures[Vt],ne=Qt.format,Zt=Qt.type;if(!rt.textureFormatReadable(ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=C.width-nt&&tt>=0&&tt<=C.height-Y&&(C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Vt),F.readPixels(X,tt,nt,Y,Xt.convert(ne),Xt.convert(Zt),St))}finally{const Qt=w!==null?ct.get(w).__webglFramebuffer:null;st.bindFramebuffer(F.FRAMEBUFFER,Qt)}}},this.readRenderTargetPixelsAsync=async function(C,X,tt,nt,Y,St,Nt,Vt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Bt=ct.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Nt!==void 0&&(Bt=Bt[Nt]),Bt)if(X>=0&&X<=C.width-nt&&tt>=0&&tt<=C.height-Y){st.bindFramebuffer(F.FRAMEBUFFER,Bt);const Qt=C.textures[Vt],ne=Qt.format,Zt=Qt.type;if(!rt.textureFormatReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ue=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,ue),F.bufferData(F.PIXEL_PACK_BUFFER,St.byteLength,F.STREAM_READ),C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Vt),F.readPixels(X,tt,nt,Y,Xt.convert(ne),Xt.convert(Zt),0);const Me=w!==null?ct.get(w).__webglFramebuffer:null;st.bindFramebuffer(F.FRAMEBUFFER,Me);const Ue=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await F0(F,Ue,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,ue),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,St),F.deleteBuffer(ue),F.deleteSync(Ue),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,X=null,tt=0){const nt=Math.pow(2,-tt),Y=Math.floor(C.image.width*nt),St=Math.floor(C.image.height*nt),Nt=X!==null?X.x:0,Vt=X!==null?X.y:0;ft.setTexture2D(C,0),F.copyTexSubImage2D(F.TEXTURE_2D,tt,0,0,Nt,Vt,Y,St),st.unbindTexture()};const Gd=F.createFramebuffer(),Vd=F.createFramebuffer();this.copyTextureToTexture=function(C,X,tt=null,nt=null,Y=0,St=null){St===null&&(Y!==0?(Gr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),St=Y,Y=0):St=0);let Nt,Vt,Bt,Qt,ne,Zt,ue,Me,Ue;const Te=C.isCompressedTexture?C.mipmaps[St]:C.image;if(tt!==null)Nt=tt.max.x-tt.min.x,Vt=tt.max.y-tt.min.y,Bt=tt.isBox3?tt.max.z-tt.min.z:1,Qt=tt.min.x,ne=tt.min.y,Zt=tt.isBox3?tt.min.z:0;else{const An=Math.pow(2,-Y);Nt=Math.floor(Te.width*An),Vt=Math.floor(Te.height*An),C.isDataArrayTexture?Bt=Te.depth:C.isData3DTexture?Bt=Math.floor(Te.depth*An):Bt=1,Qt=0,ne=0,Zt=0}nt!==null?(ue=nt.x,Me=nt.y,Ue=nt.z):(ue=0,Me=0,Ue=0);const Se=Xt.convert(X.format),Jt=Xt.convert(X.type);let Pe;X.isData3DTexture?(ft.setTexture3D(X,0),Pe=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(ft.setTexture2DArray(X,0),Pe=F.TEXTURE_2D_ARRAY):(ft.setTexture2D(X,0),Pe=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);const ge=F.getParameter(F.UNPACK_ROW_LENGTH),vn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),ys=F.getParameter(F.UNPACK_SKIP_PIXELS),_n=F.getParameter(F.UNPACK_SKIP_ROWS),hr=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Te.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Te.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Qt),F.pixelStorei(F.UNPACK_SKIP_ROWS,ne),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Zt);const Ie=C.isDataArrayTexture||C.isData3DTexture,En=X.isDataArrayTexture||X.isData3DTexture;if(C.isDepthTexture){const An=ct.get(C),an=ct.get(X),dn=ct.get(An.__renderTarget),Do=ct.get(an.__renderTarget);st.bindFramebuffer(F.READ_FRAMEBUFFER,dn.__webglFramebuffer),st.bindFramebuffer(F.DRAW_FRAMEBUFFER,Do.__webglFramebuffer);for(let Ki=0;Ki<Bt;Ki++)Ie&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ct.get(C).__webglTexture,Y,Zt+Ki),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ct.get(X).__webglTexture,St,Ue+Ki)),F.blitFramebuffer(Qt,ne,Nt,Vt,ue,Me,Nt,Vt,F.DEPTH_BUFFER_BIT,F.NEAREST);st.bindFramebuffer(F.READ_FRAMEBUFFER,null),st.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(Y!==0||C.isRenderTargetTexture||ct.has(C)){const An=ct.get(C),an=ct.get(X);st.bindFramebuffer(F.READ_FRAMEBUFFER,Gd),st.bindFramebuffer(F.DRAW_FRAMEBUFFER,Vd);for(let dn=0;dn<Bt;dn++)Ie?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,An.__webglTexture,Y,Zt+dn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,An.__webglTexture,Y),En?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,an.__webglTexture,St,Ue+dn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,an.__webglTexture,St),Y!==0?F.blitFramebuffer(Qt,ne,Nt,Vt,ue,Me,Nt,Vt,F.COLOR_BUFFER_BIT,F.NEAREST):En?F.copyTexSubImage3D(Pe,St,ue,Me,Ue+dn,Qt,ne,Nt,Vt):F.copyTexSubImage2D(Pe,St,ue,Me,Qt,ne,Nt,Vt);st.bindFramebuffer(F.READ_FRAMEBUFFER,null),st.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else En?C.isDataTexture||C.isData3DTexture?F.texSubImage3D(Pe,St,ue,Me,Ue,Nt,Vt,Bt,Se,Jt,Te.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(Pe,St,ue,Me,Ue,Nt,Vt,Bt,Se,Te.data):F.texSubImage3D(Pe,St,ue,Me,Ue,Nt,Vt,Bt,Se,Jt,Te):C.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,St,ue,Me,Nt,Vt,Se,Jt,Te.data):C.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,St,ue,Me,Te.width,Te.height,Se,Te.data):F.texSubImage2D(F.TEXTURE_2D,St,ue,Me,Nt,Vt,Se,Jt,Te);F.pixelStorei(F.UNPACK_ROW_LENGTH,ge),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,vn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,ys),F.pixelStorei(F.UNPACK_SKIP_ROWS,_n),F.pixelStorei(F.UNPACK_SKIP_IMAGES,hr),St===0&&X.generateMipmaps&&F.generateMipmap(Pe),st.unbindTexture()},this.initRenderTarget=function(C){ct.get(C).__webglFramebuffer===void 0&&ft.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?ft.setTextureCube(C,0):C.isData3DTexture?ft.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ft.setTexture2DArray(C,0):ft.setTexture2D(C,0),st.unbindTexture()},this.resetState=function(){b=0,E=0,w=null,st.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}const Hv=.85,gl=i=>i*i*(3-2*i);function Ru(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=gl(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*gl(e),veil:.82+.14*gl(Math.min(1,e/.5)),ready:e===1}}const cd=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function hd(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class cr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Gv=new eh(-1,1,1,-1,0,1);class Vv extends Ae{constructor(){super(),this.setAttribute("position",new he([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new he([0,2,0,0,2,0],2))}}const Wv=new Vv;class ih{constructor(t){this._mesh=new Gt(Wv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Gv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const Da={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class ud extends cr{constructor(){super(),this.uniforms=ps.clone(Da.uniforms),this.material=new Xp({name:Da.name,uniforms:this.uniforms,vertexShader:Da.vertexShader,fragmentShader:Da.fragmentShader}),this._fsQuad=new ih(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},me.getTransfer(this._outputColorSpace)===ve&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===yf?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Sf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===bf?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Fc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Tf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ef?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===wf&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Qn={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},oo={min:.85,max:1.35};function Xv(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function Cu(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,f=t.height*c*.5,d=Math.max(i.x,.001),u=Math.max(i.y,.001),m=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,x=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(d+m*i.z/s),f/(u+x*i.z/s))}function qv(i,t){if(!Qn[i])throw Error("unknown item");if(t==="front")return[...Qn[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(Qn[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=Qn[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class Yv extends dc{constructor(){super();const t=new Yn;t.deleteAttribute("uv");const e=new At({side:rn}),n=new At,s=new ao(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Gt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new lp(t,n,6),o=new ke;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new Gt(t,Gs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Gt(t,Gs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Gt(t,Gs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new Gt(t,Gs(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const d=new Gt(t,Gs(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);const u=new Gt(t,Gs(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Gs(i){return new Yp({color:0,emissive:16777215,emissiveIntensity:i})}function fd(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ae;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let d=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in f.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(f.attributes[u]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in f.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(f.morphAttributes[u])}if(t){let u;if(e)u=f.index.count;else if(f.attributes.position!==void 0)u=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(e){let h=0;const f=[];for(let d=0;d<i.length;++d){const u=i[d].index;for(let m=0;m<u.count;++m)f.push(u.getX(m)+h);h+=i[d].attributes.position.count}l.setIndex(f)}for(const h in r){const f=Pu(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<f;++d){const u=[];for(let x=0;x<a[h].length;++x)u.push(a[h][x][d]);const m=Pu(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Pu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Ce(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let d=0,u=h.count;d<u;d++)for(let m=0;m<e;m++){const x=h.getComponent(d,m);o.setComponent(d+f,m,x)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function pi(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function de(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,pi(),e);const s=new dp(n);return s.colorSpace=qe,s.anisotropy=8,s}function yc(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return de((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function fn(i,t,e,n=pi(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function Eo(i){const t=de((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=ci,t}const dd=Eo("paper"),pd=Eo("leather"),Er=Eo("metal"),Iu=Eo("cloth"),Ar=Er.clone();Ar.colorSpace=mn;const Sc=pd.clone();Sc.colorSpace=mn;const Ka=dd.clone();Ka.colorSpace=mn;const $v=de((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),N={black:new At({color:1646879,roughness:.42,metalness:.38,map:Er,bumpMap:Ar,bumpScale:.004}),leather:new At({color:6712935,map:pd,roughness:.78,bumpMap:Sc,bumpScale:.01}),silver:new At({color:12239550,map:Er,roughnessMap:Ar,roughness:.35,metalness:.93,bumpMap:Ar,bumpScale:.003}),gold:new At({color:12427627,map:Er,roughness:.29,metalness:.88,bumpMap:Ar,bumpScale:.003}),bronze:new At({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new qs({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:Ka,bumpScale:4e-4}),blue:new qs({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new qs({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new At({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new qs({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new At({color:14799534,map:dd,roughness:.96,bumpMap:Ka,bumpScale:.006,side:Oe}),red:new At({color:7152936,map:Iu,roughness:.82,bumpMap:Iu,bumpScale:.009}),rust:new At({map:$v,roughness:.92,metalness:.08,bumpMap:Ka,bumpScale:.022}),rubber:new At({color:1383192,roughness:.88,bumpMap:Sc,bumpScale:.008}),copper:new At({color:12089158,map:Er,roughness:.37,metalness:.9})},xl=new Map;let md=[];function ja(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(xl.has(n))return xl.get(n);let s;md.push(new Promise(a=>s=a));const r=new nd().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?mn:qe,r.wrapS=r.wrapT=ci,r.repeat.set(...t),r.anisotropy=8,xl.set(n,r),r}function Zv(){return Promise.all(md)}function Lu(i,t=[1,1]){return{map:ja(`${i}.jpg`,{repeat:t}),normalMap:ja(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:ja(`${i}-roughness.png`,{repeat:t,data:!0})}}function gd(){return de((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const Qa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Jv extends cr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof hn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ps.clone(t.uniforms),this.material=new hn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new ih(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Du extends cr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Kv extends cr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class jv{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ut);this._width=n.width,this._height=n.height,e=new Tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ui}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Jv(Qa),this.copyPass.material.blending=cn,this.clock=new nm}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Du!==void 0&&(a instanceof Du?n=!0:a instanceof Kv&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ut);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Qv extends cr{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new qt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class t2{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,f=(l+c)*h,d=l-f,u=c-f,m=t-d,x=e-u;let g,p;m>x?(g=1,p=0):(g=0,p=1);const v=m-g+h,M=x-p+h,_=m-1+2*h,T=x-1+2*h,b=l&255,E=c&255,w=this.perm[b+this.perm[E]]%12,y=this.perm[b+g+this.perm[E+p]]%12,S=this.perm[b+1+this.perm[E+1]]%12;let R=.5-m*m-x*x;R<0?n=0:(R*=R,n=R*R*this._dot(this.grad3[w],m,x));let L=.5-v*v-M*M;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[y],v,M));let P=.5-_*_-T*T;return P<0?r=0:(P*=P,r=P*P*this._dot(this.grad3[S],_,T)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),f=Math.floor(e+c),d=Math.floor(n+c),u=1/6,m=(h+f+d)*u,x=h-m,g=f-m,p=d-m,v=t-x,M=e-g,_=n-p;let T,b,E,w,y,S;v>=M?M>=_?(T=1,b=0,E=0,w=1,y=1,S=0):v>=_?(T=1,b=0,E=0,w=1,y=0,S=1):(T=0,b=0,E=1,w=1,y=0,S=1):M<_?(T=0,b=0,E=1,w=0,y=1,S=1):v<_?(T=0,b=1,E=0,w=0,y=1,S=1):(T=0,b=1,E=0,w=1,y=1,S=0);const R=v-T+u,L=M-b+u,P=_-E+u,U=v-w+2*u,O=M-y+2*u,z=_-S+2*u,V=v-1+3*u,k=M-1+3*u,B=_-1+3*u,q=h&255,Q=f&255,at=d&255,dt=this.perm[q+this.perm[Q+this.perm[at]]]%12,Ct=this.perm[q+T+this.perm[Q+b+this.perm[at+E]]]%12,It=this.perm[q+w+this.perm[Q+y+this.perm[at+S]]]%12,$=this.perm[q+1+this.perm[Q+1+this.perm[at+1]]]%12;let it=.6-v*v-M*M-_*_;it<0?s=0:(it*=it,s=it*it*this._dot3(this.grad3[dt],v,M,_));let gt=.6-R*R-L*L-P*P;gt<0?r=0:(gt*=gt,r=gt*gt*this._dot3(this.grad3[Ct],R,L,P));let Mt=.6-U*U-O*O-z*z;Mt<0?a=0:(Mt*=Mt,a=Mt*Mt*this._dot3(this.grad3[It],U,O,z));let bt=.6-V*V-k*k-B*B;return bt<0?o=0:(bt*=bt,o=bt*bt*this._dot3(this.grad3[$],V,k,B)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,f,d,u,m;const x=(t+e+n+s)*l,g=Math.floor(t+x),p=Math.floor(e+x),v=Math.floor(n+x),M=Math.floor(s+x),_=(g+p+v+M)*c,T=g-_,b=p-_,E=v-_,w=M-_,y=t-T,S=e-b,R=n-E,L=s-w,P=y>S?32:0,U=y>R?16:0,O=S>R?8:0,z=y>L?4:0,V=S>L?2:0,k=R>L?1:0,B=P+U+O+z+V+k,q=a[B][0]>=3?1:0,Q=a[B][1]>=3?1:0,at=a[B][2]>=3?1:0,dt=a[B][3]>=3?1:0,Ct=a[B][0]>=2?1:0,It=a[B][1]>=2?1:0,$=a[B][2]>=2?1:0,it=a[B][3]>=2?1:0,gt=a[B][0]>=1?1:0,Mt=a[B][1]>=1?1:0,bt=a[B][2]>=1?1:0,Yt=a[B][3]>=1?1:0,Ot=y-q+c,F=S-Q+c,J=R-at+c,j=L-dt+c,rt=y-Ct+2*c,st=S-It+2*c,mt=R-$+2*c,ct=L-it+2*c,ft=y-gt+3*c,$t=S-Mt+3*c,xt=R-bt+3*c,I=L-Yt+3*c,A=y-1+4*c,W=S-1+4*c,K=R-1+4*c,lt=L-1+4*c,Z=g&255,Et=p&255,pt=v&255,Pt=M&255,zt=o[Z+o[Et+o[pt+o[Pt]]]]%32,vt=o[Z+q+o[Et+Q+o[pt+at+o[Pt+dt]]]]%32,Lt=o[Z+Ct+o[Et+It+o[pt+$+o[Pt+it]]]]%32,Kt=o[Z+gt+o[Et+Mt+o[pt+bt+o[Pt+Yt]]]]%32,Xt=o[Z+1+o[Et+1+o[pt+1+o[Pt+1]]]]%32;let Rt=.6-y*y-S*S-R*R-L*L;Rt<0?h=0:(Rt*=Rt,h=Rt*Rt*this._dot4(r[zt],y,S,R,L));let ee=.6-Ot*Ot-F*F-J*J-j*j;ee<0?f=0:(ee*=ee,f=ee*ee*this._dot4(r[vt],Ot,F,J,j));let G=.6-rt*rt-st*st-mt*mt-ct*ct;G<0?d=0:(G*=G,d=G*G*this._dot4(r[Lt],rt,st,mt,ct));let _t=.6-ft*ft-$t*$t-xt*xt-I*I;_t<0?u=0:(_t*=_t,u=_t*_t*this._dot4(r[Kt],ft,$t,xt,I));let wt=.6-A*A-W*W-K*K-lt*lt;return wt<0?m=0:(wt*=wt,m=wt*wt*this._dot4(r[Xt],A,W,K,lt)),27*(h+f+d+u+m)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const Ua={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new ut},cameraProjectionMatrix:{value:new te},cameraInverseProjectionMatrix:{value:new te},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

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

		}`},Na={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

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

		}`},Fa={uniforms:{tDiffuse:{value:null},resolution:{value:new ut}},vertexShader:`varying vec2 vUv;

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

		}`};class Hi extends cr{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new Jc;a.format=tr,a.type=Qs,this.normalRenderTarget=new Tn(this.width,this.height,{minFilter:un,magFilter:un,type:ui,depthTexture:a}),this.ssaoRenderTarget=new Tn(this.width,this.height,{type:ui}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new hn({defines:Object.assign({},Ua.defines),uniforms:ps.clone(Ua.uniforms),vertexShader:Ua.vertexShader,fragmentShader:Ua.fragmentShader,blending:cn}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new qp,this.normalMaterial.blending=cn,this.blurMaterial=new hn({defines:Object.assign({},Fa.defines),uniforms:ps.clone(Fa.uniforms),vertexShader:Fa.vertexShader,fragmentShader:Fa.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new hn({defines:Object.assign({},Na.defines),uniforms:ps.clone(Na.uniforms),vertexShader:Na.vertexShader,fragmentShader:Na.fragmentShader,blending:cn}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new hn({uniforms:ps.clone(Qa.uniforms),vertexShader:Qa.vertexShader,fragmentShader:Qa.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Mf,blendDst:Tl,blendEquation:Ri,blendSrcAlpha:_f,blendDstAlpha:Tl,blendEquationAlpha:Ri}),this._fsQuad=new ih(null),this._originalClearColor=new qt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case Hi.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=cn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Hi.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=cn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Hi.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case Hi.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=cn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case Hi.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=vf,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new D;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=kt.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new t2,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new $c(r,4,4,_o,Wn),this.noiseTexture.wrapS=ci,this.noiseTexture.wrapT=ci,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}Hi.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class e2 extends Hi{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class n2{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new Tn(1,1,{type:ui,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new jv(t,r),this.composer.addPass(new Qv(e,n)),this.ao=new e2(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new ud),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function i2(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const yr=new D;function Cn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;yr.copy(t),yr[n]=0,yr.normalize();const c=.5*a/(a+o),h=1-yr.angleTo(i)/l;return Math.sign(yr[e])===1?h*c:o/(a+o)+c+c*(1-h)}class sh extends Yn{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new D,c=new D,h=new D(t,e,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,d=this.attributes.normal.array,u=this.attributes.uv.array,m=f.length/6,x=new D,g=.5/a;for(let p=0,v=0;p<f.length;p+=3,v+=2)switch(l.fromArray(f,p),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),f[p+0]=h.x*Math.sign(l.x)+c.x*r,f[p+1]=h.y*Math.sign(l.y)+c.y*r,f[p+2]=h.z*Math.sign(l.z)+c.z*r,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/m)){case 0:x.set(1,0,0),u[v+0]=Cn(x,c,"z","y",r,n),u[v+1]=1-Cn(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),u[v+0]=1-Cn(x,c,"z","y",r,n),u[v+1]=1-Cn(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),u[v+0]=1-Cn(x,c,"x","z",r,t),u[v+1]=Cn(x,c,"z","x",r,n);break;case 3:x.set(0,-1,0),u[v+0]=1-Cn(x,c,"x","z",r,t),u[v+1]=1-Cn(x,c,"z","x",r,n);break;case 4:x.set(0,0,1),u[v+0]=1-Cn(x,c,"x","y",r,t),u[v+1]=1-Cn(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),u[v+0]=Cn(x,c,"x","y",r,t),u[v+1]=1-Cn(x,c,"y","x",r,e);break}}static fromJSON(t){return new sh(t.width,t.height,t.depth,t.segments,t.radius)}}class s2 extends Gt{constructor(t,e,n=!1,s=!1,r=1e4){const a=new Ae;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(v){this.resolution=v,this.isolation=80,this.size=v,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const M=r*3;this.positionArray=new Float32Array(M*3);const _=new Ce(this.positionArray,3);_.setUsage(na),a.setAttribute("position",_),this.normalArray=new Float32Array(M*3);const T=new Ce(this.normalArray,3);if(T.setUsage(na),a.setAttribute("normal",T),this.enableUvs){this.uvArray=new Float32Array(M*2);const b=new Ce(this.uvArray,2);b.setUsage(na),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(M*3);const b=new Ce(this.colorArray,3);b.setUsage(na),a.setAttribute("color",b)}a.boundingSphere=new Ms(new D,1)};function f(v,M,_){return v+(M-v)*_}function d(v,M,_,T,b,E,w,y,S,R){const L=(_-w)/(y-w),P=o.normal_cache;l[M+0]=T+L*o.delta,l[M+1]=b,l[M+2]=E,c[M+0]=f(P[v+0],P[v+3],L),c[M+1]=f(P[v+1],P[v+4],L),c[M+2]=f(P[v+2],P[v+5],L),h[M+0]=f(o.palette[S*3+0],o.palette[R*3+0],L),h[M+1]=f(o.palette[S*3+1],o.palette[R*3+1],L),h[M+2]=f(o.palette[S*3+2],o.palette[R*3+2],L)}function u(v,M,_,T,b,E,w,y,S,R){const L=(_-w)/(y-w),P=o.normal_cache;l[M+0]=T,l[M+1]=b+L*o.delta,l[M+2]=E;const U=v+o.yd*3;c[M+0]=f(P[v+0],P[U+0],L),c[M+1]=f(P[v+1],P[U+1],L),c[M+2]=f(P[v+2],P[U+2],L),h[M+0]=f(o.palette[S*3+0],o.palette[R*3+0],L),h[M+1]=f(o.palette[S*3+1],o.palette[R*3+1],L),h[M+2]=f(o.palette[S*3+2],o.palette[R*3+2],L)}function m(v,M,_,T,b,E,w,y,S,R){const L=(_-w)/(y-w),P=o.normal_cache;l[M+0]=T,l[M+1]=b,l[M+2]=E+L*o.delta;const U=v+o.zd*3;c[M+0]=f(P[v+0],P[U+0],L),c[M+1]=f(P[v+1],P[U+1],L),c[M+2]=f(P[v+2],P[U+2],L),h[M+0]=f(o.palette[S*3+0],o.palette[R*3+0],L),h[M+1]=f(o.palette[S*3+1],o.palette[R*3+1],L),h[M+2]=f(o.palette[S*3+2],o.palette[R*3+2],L)}function x(v){const M=v*3;o.normal_cache[M]===0&&(o.normal_cache[M+0]=o.field[v-1]-o.field[v+1],o.normal_cache[M+1]=o.field[v-o.yd]-o.field[v+o.yd],o.normal_cache[M+2]=o.field[v-o.zd]-o.field[v+o.zd])}function g(v,M,_,T,b){const E=T+1,w=T+o.yd,y=T+o.zd,S=E+o.yd,R=E+o.zd,L=T+o.yd+o.zd,P=E+o.yd+o.zd;let U=0;const O=o.field[T],z=o.field[E],V=o.field[w],k=o.field[S],B=o.field[y],q=o.field[R],Q=o.field[L],at=o.field[P];O<b&&(U|=1),z<b&&(U|=2),V<b&&(U|=8),k<b&&(U|=4),B<b&&(U|=16),q<b&&(U|=32),Q<b&&(U|=128),at<b&&(U|=64);const dt=r2[U];if(dt===0)return 0;const Ct=o.delta,It=v+Ct,$=M+Ct,it=_+Ct;dt&1&&(x(T),x(E),d(T*3,0,b,v,M,_,O,z,T,E)),dt&2&&(x(E),x(S),u(E*3,3,b,It,M,_,z,k,E,S)),dt&4&&(x(w),x(S),d(w*3,6,b,v,$,_,V,k,w,S)),dt&8&&(x(T),x(w),u(T*3,9,b,v,M,_,O,V,T,w)),dt&16&&(x(y),x(R),d(y*3,12,b,v,M,it,B,q,y,R)),dt&32&&(x(R),x(P),u(R*3,15,b,It,M,it,q,at,R,P)),dt&64&&(x(L),x(P),d(L*3,18,b,v,$,it,Q,at,L,P)),dt&128&&(x(y),x(L),u(y*3,21,b,v,M,it,B,Q,y,L)),dt&256&&(x(T),x(y),m(T*3,24,b,v,M,_,O,B,T,y)),dt&512&&(x(E),x(R),m(E*3,27,b,It,M,_,z,q,E,R)),dt&1024&&(x(S),x(P),m(S*3,30,b,It,$,_,k,at,S,P)),dt&2048&&(x(w),x(L),m(w*3,33,b,v,$,_,V,Q,w,L)),U<<=4;let gt,Mt,bt,Yt=0,Ot=0;for(;Oa[U+Ot]!=-1;)gt=U+Ot,Mt=gt+1,bt=gt+2,p(l,c,h,3*Oa[gt],3*Oa[Mt],3*Oa[bt]),Ot+=3,Yt++;return Yt}function p(v,M,_,T,b,E){const w=o.count*3;if(o.positionArray[w+0]=v[T],o.positionArray[w+1]=v[T+1],o.positionArray[w+2]=v[T+2],o.positionArray[w+3]=v[b],o.positionArray[w+4]=v[b+1],o.positionArray[w+5]=v[b+2],o.positionArray[w+6]=v[E],o.positionArray[w+7]=v[E+1],o.positionArray[w+8]=v[E+2],o.material.flatShading===!0){const y=(M[T+0]+M[b+0]+M[E+0])/3,S=(M[T+1]+M[b+1]+M[E+1])/3,R=(M[T+2]+M[b+2]+M[E+2])/3;o.normalArray[w+0]=y,o.normalArray[w+1]=S,o.normalArray[w+2]=R,o.normalArray[w+3]=y,o.normalArray[w+4]=S,o.normalArray[w+5]=R,o.normalArray[w+6]=y,o.normalArray[w+7]=S,o.normalArray[w+8]=R}else o.normalArray[w+0]=M[T+0],o.normalArray[w+1]=M[T+1],o.normalArray[w+2]=M[T+2],o.normalArray[w+3]=M[b+0],o.normalArray[w+4]=M[b+1],o.normalArray[w+5]=M[b+2],o.normalArray[w+6]=M[E+0],o.normalArray[w+7]=M[E+1],o.normalArray[w+8]=M[E+2];if(o.enableUvs){const y=o.count*2;o.uvArray[y+0]=v[T+0],o.uvArray[y+1]=v[T+2],o.uvArray[y+2]=v[b+0],o.uvArray[y+3]=v[b+2],o.uvArray[y+4]=v[E+0],o.uvArray[y+5]=v[E+2]}o.enableColors&&(o.colorArray[w+0]=_[T+0],o.colorArray[w+1]=_[T+1],o.colorArray[w+2]=_[T+2],o.colorArray[w+3]=_[b+0],o.colorArray[w+4]=_[b+1],o.colorArray[w+5]=_[b+2],o.colorArray[w+6]=_[E+0],o.colorArray[w+7]=_[E+1],o.colorArray[w+8]=_[E+2]),o.count+=3}this.addBall=function(v,M,_,T,b,E){const w=Math.sign(T);T=Math.abs(T);const y=E!=null;let S=new qt(v,M,_);if(y)try{S=E instanceof qt?E:Array.isArray(E)?new qt(Math.min(Math.abs(E[0]),1),Math.min(Math.abs(E[1]),1),Math.min(Math.abs(E[2]),1)):new qt(E)}catch{S=new qt(v,M,_)}const R=this.size*Math.sqrt(T/b),L=_*this.size,P=M*this.size,U=v*this.size;let O=Math.floor(L-R);O<1&&(O=1);let z=Math.floor(L+R);z>this.size-1&&(z=this.size-1);let V=Math.floor(P-R);V<1&&(V=1);let k=Math.floor(P+R);k>this.size-1&&(k=this.size-1);let B=Math.floor(U-R);B<1&&(B=1);let q=Math.floor(U+R);q>this.size-1&&(q=this.size-1);let Q,at,dt,Ct,It,$,it,gt,Mt,bt,Yt;for(dt=O;dt<z;dt++)for(It=this.size2*dt,gt=dt/this.size-_,Mt=gt*gt,at=V;at<k;at++)for(Ct=It+this.size*at,it=at/this.size-M,bt=it*it,Q=B;Q<q;Q++)if($=Q/this.size-v,Yt=T/(1e-6+$*$+bt+Mt)-b,Yt>0){this.field[Ct+Q]+=Yt*w;const Ot=Math.sqrt((Q-U)*(Q-U)+(at-P)*(at-P)+(dt-L)*(dt-L))/R,F=1-Ot*Ot*Ot*(Ot*(Ot*6-15)+10);this.palette[(Ct+Q)*3+0]+=S.r*F,this.palette[(Ct+Q)*3+1]+=S.g*F,this.palette[(Ct+Q)*3+2]+=S.b*F}},this.addPlaneX=function(v,M){const _=this.size,T=this.yd,b=this.zd,E=this.field;let w,y,S,R,L,P,U,O=_*Math.sqrt(v/M);for(O>_&&(O=_),w=0;w<O;w++)if(P=w/_,R=P*P,L=v/(1e-4+R)-M,L>0)for(y=0;y<_;y++)for(U=w+y*T,S=0;S<_;S++)E[b*S+U]+=L},this.addPlaneY=function(v,M){const _=this.size,T=this.yd,b=this.zd,E=this.field;let w,y,S,R,L,P,U,O,z=_*Math.sqrt(v/M);for(z>_&&(z=_),y=0;y<z;y++)if(P=y/_,R=P*P,L=v/(1e-4+R)-M,L>0)for(U=y*T,w=0;w<_;w++)for(O=U+w,S=0;S<_;S++)E[b*S+O]+=L},this.addPlaneZ=function(v,M){const _=this.size,T=this.yd,b=this.zd,E=this.field;let w,y,S,R,L,P,U,O,z=_*Math.sqrt(v/M);for(z>_&&(z=_),S=0;S<z;S++)if(P=S/_,R=P*P,L=v/(1e-4+R)-M,L>0)for(U=b*S,y=0;y<_;y++)for(O=U+y*T,w=0;w<_;w++)E[O+w]+=L},this.setCell=function(v,M,_,T){const b=this.size2*_+this.size*M+v;this.field[b]=T},this.getCell=function(v,M,_){const T=this.size2*_+this.size*M+v;return this.field[T]},this.blur=function(v=1){const M=this.field,_=M.slice(),T=this.size,b=this.size2;for(let E=0;E<T;E++)for(let w=0;w<T;w++)for(let y=0;y<T;y++){const S=b*y+T*w+E;let R=_[S],L=1;for(let P=-1;P<=1;P+=2){const U=P+E;if(!(U<0||U>=T))for(let O=-1;O<=1;O+=2){const z=O+w;if(!(z<0||z>=T))for(let V=-1;V<=1;V+=2){const k=V+y;if(k<0||k>=T)continue;const B=b*k+T*z+U,q=_[B];L++,R+=v*(q-R)/L}}}M[S]=R}},this.reset=function(){for(let v=0;v<this.size3;v++)this.normal_cache[v*3]=0,this.field[v]=0,this.palette[v*3]=this.palette[v*3+1]=this.palette[v*3+2]=0},this.update=function(){this.count=0;const v=this.size-2;for(let M=1;M<v;M++){const _=this.size2*M,T=(M-this.halfsize)/this.halfsize;for(let b=1;b<v;b++){const E=_+this.size*b,w=(b-this.halfsize)/this.halfsize;for(let y=1;y<v;y++){const S=(y-this.halfsize)/this.halfsize,R=E+y;g(S,w,T,R,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const r2=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Oa=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function xd(i,t,e=44){const n=new s2(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,f=a/e*2-1;let d=10;for(const[u,m,x,g,p,v,M=0]of i){const _=Math.cos(M),T=Math.sin(M),b=c-u,E=h-m,w=f-x,y=_*b+T*E,S=-T*b+_*E,R=Math.hypot(y/g,S/p,w/v),L=Math.hypot(y/(g*g),S/(p*p),w/(v*v)),P=L>1e-6?R*(R-1)/L:-Math.min(g,p,v),U=.085,O=Math.max(U-Math.abs(d-P),0)/U;d=Math.min(d,P)-O*O*O*U/6}n.field[a*e*e+o*e+l]=-d}n.update();const s=n.geometry.drawRange.count,r=new Ae;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Ce(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const Qe=Math.PI*2;let rh=1;function Uu(i){rh=Math.max(.24,Math.min(1,i))||1}const $r=(i,t=4)=>Math.max(t,Math.round(i*rh));function Ut(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new Gt(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function H(i,t,e,n=N.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return Ut(s?new sh(...t,rh<.8?1:2,a):new Yn(...t),n,i,e,r)}function Ft(i,t,e,n,s,r=N.silver,a=[Math.PI/2,0,0],o=48){return Ut(new Fe(t,e,n,$r(o,6)),r,i,s,a)}function Xi(i,t,e,n=N.cream){const s=Ut(new or(1,$r(32,8),$r(24,6)),n,i,e);return s.scale.set(...t),s}function be(i,t,e,n,s=N.gold,r=[0,0,0],a=Qe){return Ut(new ai(t,e,$r(8,4),$r(64,8),a),s,i,n,r)}function Dn(i,t,e,n=N.gold,s=30){return Ut(new wn(new Ii(t.map(r=>new D(...r))),s,e,8,!1),n,i)}function _s(i,t,e,n=[0,0,0],s=64){return Ut(new bo(t.map(r=>new ut(...r)),s),e,i,n)}function lo(i,t,e,n,s=.022,r=N.silver){Ft(i,s,s,s*.35,[t,e,n],r,void 0,16),H(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],N.black,.001,[0,0,(t+e)*7])}function qn(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=de((c,h,f)=>s(c,h,o,f),768,o);return Ut(new fe(t,e),new At({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function $e(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return qn(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function Ao(i,t,e,n){const s=de((r,a,o)=>n(r,a,o),1024);return Ut(new $i(t,80),new Ke({map:s,toneMapped:!1}),i,[0,0,e])}function ah(i,t,e,n,s=N.clear){const r=Ut(new or(1,48,20,0,Qe,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function co(i,t,e,n,s=48,r=N.silver,a="z"){for(let o=0;o<s;o++){const l=o*Qe/s;a==="z"?H(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):H(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function sr(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return Ut(new yo(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function Nu(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function a2(i){H(i,[1.65,.92,.49],[0,0,0],N.black,.07),H(i,[1.57,.81,.016],[0,-.015,.253],N.leather,.024),H(i,[1.63,.245,.52],[0,.448,0],N.silver,.035),H(i,[1.63,.105,.51],[0,-.48,0],N.silver,.02),H(i,[1.57,.77,.018],[0,-.015,-.257],N.leather,.025),H(i,[1.62,.82,.035],[0,-.015,-.256],N.black,.035),H(i,[1.49,.7,.02],[0,-.01,-.282],N.leather,.023),$e(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),$e(i,"8М",.18,.1,[-.55,-.11,.269]),$e(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),$e(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new ie;t.position.set(.12,-.045,0),i.add(t),Ft(t,.36,.39,.18,[0,0,.34],N.black),Ft(t,.325,.345,.13,[0,0,.466],N.silver),Ft(t,.293,.293,.21,[0,0,.575],N.black),co(t,.296,.12,[0,0,.56],56,N.rubber),be(t,.29,.012,[0,0,.682],N.silver),Ft(t,.272,.272,.025,[0,0,.688],N.black),Ao(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),Nu(n,"ТРИПЛЕТ 43 • 4/40",420),Nu(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),Ft(t,.204,.204,.025,[0,0,.717],N.black);for(let n=0;n<7;n++){const s=n*Qe/7,r=new Di;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),Ut(new wo(r),N.rubber,t,[0,0,.733],[0,0,s])}Ft(t,.082,.082,.006,[0,0,.74],N.black),ah(t,.196,.028,[0,0,.748],N.clear),be(t,.204,.006,[0,0,.736],N.silver),qn(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),H(i,[.292,.177,.047],[-.49,.444,.282],N.black,.025),H(i,[.2,.105,.016],[-.49,.444,.309],N.lens,.009),H(i,[.21,.13,.035],[-.49,.447,-.28],N.black,.012),H(i,[.155,.08,.012],[-.49,.447,-.305],N.lens,.005);for(const n of[-.7,.72])lo(i,n,.452,.269,.021);for(const n of[-.65,.65])lo(i,n,-.32,-.3,.018);Ft(i,.161,.17,.105,[-.53,.625,0],N.silver,[0,0,0]),co(i,.161,.067,[-.53,.63,0],38,N.silver,"y"),Ft(i,.11,.12,.072,[.53,.603,0],N.black,[0,0,0]),Ft(i,.059,.065,.075,[.53,.67,0],N.silver,[0,0,0]),H(i,[.27,.024,.23],[.02,.584,0],N.black,.006);for(const n of[-.14,.14])H(i,[.035,.04,.25],[n,.6,0],N.silver,.007);Ft(i,.036,.036,.015,[0,-.535,0],N.gold,[0,0,0]);for(const n of[-.79,.79])be(i,.055,.012,[n,.14,0],N.silver,[0,Math.PI/2,0]);const e=Dn(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,N.leather,50);e.scale.z=.4}function o2(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];_s(i,t,N.cream),be(i,.531,.007,[0,.377,0],N.gold,[Math.PI/2,0,0]),be(i,.272,.006,[0,-.489,0],N.gold,[Math.PI/2,0,0]),Dn(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,N.cream),Dn(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,N.gold);const e=de((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,Qe),s.fill()},1024),n=new At({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});_s(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),$e(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function l2(i){const t=new At({map:N.leather.map,color:7754307,roughness:.84,bumpMap:N.leather.bumpMap,bumpScale:.01});H(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)H(i,[.008,.023,.004],[s,r,.001],N.paper,.001);for(let s=-.99;s<-.46;s+=.105)Ft(i,.019,.019,.004,[0,s,.004],N.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])H(i,[.1,.18,.13],[r,s,.035],N.silver,.023,[0,0,r*s]);Ft(i,.415,.438,.135,[0,0,.066],N.silver),be(i,.394,.027,[0,0,.143],N.silver),Ao(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*Qe/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*Qe/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),fn(s,r,r,a,1700)}),H(i,[.019,.244,.009],[-.038,.102,.18],N.black,.003,[0,0,.36]),H(i,[.012,.31,.008],[.105,.067,.19],N.black,.002,[0,0,-1]),H(i,[.004,.45,.003],[-.09,-.012,.201],N.copper,.001,[0,0,1.71]),Ft(i,.018,.02,.015,[0,0,.205],N.gold),ah(i,.371,.018,[0,0,.211]),Ft(i,.056,.057,.1,[.468,0,.04],N.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*Qe/18;H(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],N.silver,.001,[r,0,0])}const e=new Di;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new ro;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),sr(i,e,.025,N.silver,[0,1,.02]),H(i,[.02,.23,.018],[0,1,.065],N.silver,.003),Ft(i,.392,.392,.02,[0,0,-.104],N.silver),$e(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),$e(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;lo(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new D().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function c2(i){H(i,[1.6,1,.166],[0,0,0],N.black,.07),H(i,[1.46,.77,.026],[0,.075,.092],N.rubber,.04),qn(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),fn(t,e,n,s,1200)}),H(i,[1.07,.276,.012],[0,-.044,.121],N.black,.04);for(const t of[-.405,.405]){Ft(i,.176,.176,.018,[t,-.038,.132],N.rust),Ft(i,.112,.112,.023,[t,-.038,.146],N.paper),Ft(i,.063,.063,.027,[t,-.038,.152],N.black);for(let e=0;e<6;e++){const n=e*Qe/6;H(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],N.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])be(i,e,.002,[t,-.038,.147],N.black)}for(let t=-.2;t<.23;t+=.043)H(i,[.012,.08,.008],[t,-.04,.137],N.silver,.001);H(i,[1.16,.205,.035],[0,-.374,.105],N.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])lo(i,t,e,.098,.024);for(const t of[-.44,.44])Ft(i,.049,.049,.008,[t,-.389,.131],N.rubber);for(let t=0;t<20;t++)H(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],N.leather,.001);qn(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);fn(t,e,n,s,800)},[0,Math.PI,0])}function h2(i){Ut(xd([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],N.cream,44),N.cream,i);for(const e of[-1,0,1]){const n=Xi(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],N.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new Di;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),sr(i,t,.13,N.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){Xi(i,[.012,.014,.007],[.43,.405,e*.164],N.black),Dn(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,N.gold,30);for(let n=0;n<4;n++)Dn(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,N.gold,12)}Ft(i,.29,.32,.045,[-.04,-.415,0],N.cream,[0,0,0]),$e(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function u2(i){H(i,[1.02,1.48,.253],[.025,0,0],N.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;H(i,[1.02,.002,.001],[.025,.742,n],e%5?N.paper:N.rust,0),H(i,[.002,1.45,.001],[.537,0,n],e%4?N.paper:N.rust,0)}H(i,[1.15,1.58,.045],[0,0,.155],N.red,.015),H(i,[1.15,1.58,.045],[0,0,-.155],N.red,.015),H(i,[.095,1.57,.34],[-.56,0,0],N.red,.025),qn(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),fn(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])H(i,[.106,.015,.347],[-.556,e,0],N.red,.007);$e(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new At({color:5724487,roughness:1});H(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),$e(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function f2(i){be(i,.28,.055,[0,.41,0],N.gold),be(i,.219,.012,[0,.41,.034],N.copper),Ft(i,.046,.048,.92,[0,-.29,0],N.gold,[0,0,0],32),H(i,[.25,.09,.1],[.092,-.745,0],N.gold,.012),H(i,[.09,.1,.105],[.171,-.64,0],N.gold,.007),H(i,[.065,.17,.095],[.037,-.7,0],N.gold,.009),be(i,.34,.014,[0,.72,-.01],N.silver,[.23,0,.08]),be(i,.331,.009,[0,.72,-.018],N.silver,[.23,0,.08]),H(i,[.24,.34,.037],[.37,.34,-.03],N.leather,.028,[0,0,-.22]),$e(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),be(i,.055,.012,[.33,.535,-.02],N.silver),$e(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function d2(i){const t=new Di;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),sr(i,t,.055,N.gold,[0,0,-.03]);const e=t.clone();sr(i,e,.009,N.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),qn(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])Xi(i,[.014,.021,.002],[s,r,.044],N.gold);Dn(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,N.silver,14),Ft(i,.04,.04,.045,[-.23,.18,-.059],N.silver),$e(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function p2(i){Ft(i,.83,.83,.022,[0,0,0],N.black,void 0,96);const t=de((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,Qe),s.stroke()},1024),e=de((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,f=Math.hypot(c,h)||1,d=Math.sin(f*2.2)*.22,u=(o*r+l)*4;a.data[u]=128+127*d*c/f,a.data[u+1]=128+127*d*h/f,a.data[u+2]=253,a.data[u+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=mn;const n=new At({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new ut(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){Ut(new $i(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new ie;i.add(r),r.rotation.y=s===1?0:Math.PI,Ao(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,Qe),a.stroke(),fn(a,o,o,l,1500)}),Ft(r,.018,.018,.01,[0,0,.022],N.rubber)}}function m2(i){const t=new qs({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=_s(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new qs({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});Ft(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),Ft(i,.11,.11,.16,[0,.49,0],N.gold,[0,0,0]),co(i,.112,.1,[0,.49,0],28,N.gold,"y"),_s(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),qn(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),fn(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function g2(i){H(i,[1.27,.08,.55],[0,-.72,0],N.bronze,.032),H(i,[1.35,.04,.61],[0,-.78,0],N.black,.02),Ut(xd([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],N.bronze),N.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;Dn(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,N.bronze),Xi(i,[.051,.057,.04],[e+s,-.43,n],N.bronze),H(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],N.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=_s(i,[[0,0],[.041,0],[.034,.1],[0,.18]],N.bronze,[.333,.525,e],16);n.rotation.z=.15,Xi(i,[.015,.015,.008],[.457,.49,t*.127],N.black),Xi(i,[.012,.01,.006],[.648,.404,t*.083],N.black)}for(let t=0;t<12;t++)Dn(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,N.bronze,10);Dn(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,N.bronze);for(let t=0;t<5;t++)Dn(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,N.gold,14);Dn(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,N.gold,16),$e(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function x2(i){Ft(i,.51,.53,.145,[0,0,0],N.gold),be(i,.503,.018,[0,0,.075],N.gold),co(i,.51,.072,[0,0,-.018],72,N.gold),Ao(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*Qe/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*Qe/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),fn(e,n,n,s,1800)});const t=new Di;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),sr(i,t,.007,N.red,[0,0,.103],[0,0,-.38],.001),sr(i,t,.007,N.silver,[0,0,.103],[0,0,Math.PI-.38],.001),Ft(i,.027,.027,.025,[0,0,.121],N.gold),ah(i,.468,.013,[0,0,.142]),be(i,.109,.025,[0,.635,0],N.gold),Ft(i,.059,.065,.092,[0,.523,0],N.gold,[0,0,0]),Ft(i,.465,.465,.02,[0,0,-.086],N.gold),$e(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),$e(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function v2(i){_s(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],N.glass);for(const n of[.817,.862])be(i,.116,.009,[0,n,0],N.glass,[Math.PI/2,0,0]);const t=de((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),fn(n,s,a,r,2800)},768,460),e=new At({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:Oe});Ut(new Fe(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),$e(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function _2(i){const t=N.silver.clone();t.roughness=.46,_s(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)be(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);Ft(i,.404,.404,.015,[0,-.347,0],N.rust,[0,0,0]);const e=new ie;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),Ft(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),be(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),be(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),H(e,[.067,.025,.11],[0,.028,.33],t,.015),qn(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),fn(n,s,r,a,2600)}),qn(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),fn(n,s,r,a,2400)},[0,Math.PI,0])}function M2(i){const t=de((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),fn(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,Qe),r.fill()},768,768),e=new At({map:t,roughness:.98,side:Oe,bumpMap:N.paper.bumpMap,bumpScale:.009}),n=new Fe(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),f=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+f,o,l*h)}n.computeVertexNormals(),Ut(n,e,i),be(i,.355,.016,[0,.44,0],N.paper,[Math.PI/2,0,0]),Ft(i,.232,.232,.015,[0,-.437,0],N.paper,[0,0,0]),Ft(i,.224,.224,.008,[0,-.421,0],N.rust,[0,0,0]),Dn(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,N.paper)}function y2(i){const t=de((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);fn(s,r,r,a,3500)}),e=new At({map:t,roughness:.97,bumpMap:N.paper.bumpMap,bumpScale:.008,side:Oe});H(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])H(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])H(i,[.029,.75,.8],[s,-.065,0],e,.006);H(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),H(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),H(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),H(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)Ft(i,.005,.005,.027,[s,.319,.399],N.paper,[0,0,0],6);qn(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);fn(s,r,a,o,1200)}),qn(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new At({color:11114860,roughness:.4,transparent:!0,opacity:.66});H(i,[.12,.74,.006],[.25,-.05,.421],n,.001),H(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function S2(i){Ft(i,.507,.507,.036,[0,0,0],N.rust,void 0,80),be(i,.504,.014,[0,0,.017],N.silver);for(const e of[.448,.408])be(i,e,.009,[0,0,.024],N.rust);const t=pi(77);for(let e=0;e<9;e++){const n=t()*Qe,s=.465+t()*.015;Xi(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],N.silver)}for(let e=0;e<24;e++){const n=e*Qe/24;H(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],N.rust,.007,[0,0,-n])}$e(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function b2(i){const t=de((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),fn(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,Qe),n.fill()},1024,1280),e=new At({map:t,roughness:1,side:Oe,bumpMap:N.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new fe(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++)r.getX(a),r.getY(a),r.setZ(a,n*.004);s.computeVertexNormals(),Ut(s,e,i)}}const w2={camera:a2,teacup:o2,watch:l2,cassette:c2,duck:h2,book:u2,key:f2,badge:d2,record:p2,perfume:m2,horse:g2,compass:x2,bottle:v2,can:_2,cup:M2,box:y2,lid:S2,paper:b2};function T2(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===N.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new qt("#977145"),c=new qt("#355d53");for(let h=0;h<a.count;h++){const f=a.getX(h),d=a.getY(h),u=a.getZ(h),m=Math.sin(f*15+Math.sin(d*9))*Math.sin(d*19+u*12)*Math.cos(u*21-f*6),x=kt.clamp((m+.12)*.85,0,.8);l.clone().lerp(c,x).toArray(o,h*3)}s.setAttribute("color",new Ce(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=fd(s,!1);Ut(r,n,i),s.forEach(a=>a.dispose())}return e}function vl(i){const t=new ie;w2[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const f=new D().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);f.set(...i2(i,f.x,f.y,f.z)).applyMatrix4(c),l.setXYZ(h,f.x,f.y,f.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=T2(t),n=new Xn().setFromObject(t),s=n.getCenter(new D),r=n.getSize(new D);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new ie;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const za=pi(370);function E2(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function oh(i,t,e,n,s){const r=new fe(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function Nn(i,t,e,n,s=[1,1,1],r=1){const a=Ut(new So(t,r),n,i,e);return a.scale.set(...s),a}function Fn(i,t,e,n,s=[1,1,1],r=1){const a=Ut(new So(t,r),n,i,e);return a.scale.set(...s),a}function A2(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function Ro(i,t,e,n,s=24){return Ut(new wn(new Ii(t.map(r=>new D(...r))),s,e,5,!1),n,i)}function R2(){return de((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(u,m,x,g,p)=>{i.fillStyle=p,i.fillRect(u,m,x,g)},c=(u,m,x,g,p)=>{i.fillStyle=p,i.beginPath(),i.ellipse(u,m,x,g,0,0,Math.PI*2),i.fill()},h=(u,m,x,g="rgba(255,198,106,")=>{const p=i.createRadialGradient(u,m,0,u,m,x);p.addColorStop(0,g+".62)"),p.addColorStop(1,g+"0)"),i.fillStyle=p,i.fillRect(u-x,m-x,x*2,x*2)},f=(u,m,x="#4b2d1e")=>{const g=i.createLinearGradient(0,0,0,r);g.addColorStop(0,u),g.addColorStop(1,m),i.fillStyle=g,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,x),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},d=(u,m)=>{i.save(),i.translate(u%4*s,Math.floor(u/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),m(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};d(0,()=>{f("#bd8745","#70452a"),l(16,58,122,316,"#382313");const u=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let m=0;m<5;m++){const x=78+m*58;l(22,x+38,110,6,"#20130b");let g=27;for(;g<124;){const p=5+e()*9;l(g,x+38-(24+e()*12),p,24+e()*12,u[Math.floor(e()*u.length)]),g+=p+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),d(1,()=>{f("#a8ad7d","#66704e","#40392a");for(let u=0;u<3;u++){const m=86+u*72;l(22,m,190,7,o);for(let x=0;x<6;x++){const g=34+x*31;l(g,m-(20+(x+u)%3*7),15,20+(x+u)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][x%4]),l(g+2,m-(27+(x+u)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const u of[62,112,168])i.beginPath(),i.moveTo(u,306),i.lineTo(u,326),i.stroke(),c(u,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),d(2,()=>{f("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),d(3,()=>{f("#8fae94","#55705e","#33473a");for(let u=0;u<3;u++){const m=120+u*104;l(18,m,220,8,"#2c2117");for(let x=0;x<4;x++){const g=42+x*54;l(g-13,m-25,26,25,"#8a5138");for(let p=0;p<6;p++){const v=-2.4+p*.45;c(g+Math.cos(v)*17,m-34+Math.sin(v)*19,11,5,p%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const u of[38,96,204]){i.beginPath(),i.moveTo(u,0),i.quadraticCurveTo(u+14,72,u-4,142),i.stroke();for(let m=0;m<6;m++)c(u+(m%2?9:-8),24+m*21,10,5,m%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),d(4,()=>{f("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const u of[48,112,190])l(u,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let u=0;u<4;u++)i.beginPath(),i.moveTo(100,292+u*6),i.lineTo(136,292+u*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),d(5,()=>{f("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let u=0;u<5;u++)l(26+u*15,410-u*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][u]);h(218,166,50)}),d(6,()=>{f("#8299a4","#4f6875","#31424b");const u=i.createLinearGradient(38,96,218,250);u.addColorStop(0,"#b9d5df"),u.addColorStop(.55,"#688b9c"),u.addColorStop(1,"#314f62"),i.fillStyle=u,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),d(7,()=>{f("#b49aa4","#76606d","#463945");for(let u=0;u<5;u++){l(24,78+u*8,70,4,"rgba(50,35,42,.45)");for(let m=0;m<4;m++)l(31+m*16,58+u*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][m])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function C2(){return de((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,f,d="#2e342b",u="Georgia")=>{i.fillStyle=d,i.font=`bold ${f}px ${u}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const nn={};function $n(){if(nn.stone)return nn;nn.stone=new At({color:7566439,roughness:.86,map:ja("plaster.jpg")}),nn.iron=new At({color:2633768,metalness:.72,roughness:.6}),nn.green=new At({color:4216121,roughness:.9,flatShading:!0,side:Oe}),nn.shadowMap=de((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),nn.contact=new Ke({map:nn.shadowMap,transparent:!0,depthWrite:!1}),nn.wood=new At({color:7427130,roughness:.92}),nn.leafDark=new At({color:3099956,roughness:1,flatShading:!0}),nn.poster=new At({map:C2(),roughness:.96}),nn.bulb=new At({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=de((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);nn.glow=new Ke({map:i,color:16757350,transparent:!0,opacity:.42,blending:Or,depthWrite:!1,side:Oe});const t=de((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);nn.chalk=new Ke({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=de((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return nn.chess=new At({map:e,roughness:.8}),nn}function P2(i,t,e=14,n=0){const s=new Ke({map:gd(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});Ut(new fe(t,1.45),s,i,[0,.72,.342]);const r=de((u,m,x)=>{u.fillStyle="#605d4c",u.fillRect(0,0,m,m);for(let g=0;g<12;g++)for(let p=-1;p<7;p++){const v=p*87+g%2*43,M=g*45;u.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(x()*4)],u.fillRect(v+3,M+3,81,39),u.fillStyle="rgba(28,29,21,.22)",u.fillRect(v+3,M+36,81,5)}u.globalCompositeOperation="destination-in",u.beginPath();for(let g=0;g<60;g++){const p=g*Math.PI/30,v=185+x()*60;u.lineTo(m/2+Math.cos(p)*v,m/2+Math.sin(p)*v*.7)}u.closePath(),u.fill()}),a=new At({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[u,m,x]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])Ut(new fe(x*2,x),a,i,[u,m,.349]);const o=$n();for(const[u,m,x]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])Ut(new fe(.17,x),s,i,[u,m,.344]);let l=0;for(let u=-t/2+1.55;u<t/2-1.1;u+=2.85,l++){if(n===0&&Math.abs(u+3.8)<1.65)continue;const m=(l+n)%4===1;H(i,[.78,.48,.06],[u,.39,.425],m?yd:N.black,0),H(i,[.9,.07,.09],[u,.665,.44],o.stone,0),H(i,[.9,.06,.1],[u,.125,.45],o.stone,0);for(const g of[-.24,0,.24])H(i,[.02,.44,.02],[u+g,.39,.47],N.black,0);const x=u+1.42;if(x<t/2-.7){H(i,[.34,.24,.035],[x,.92,.342],N.black,0);for(let g=0;g<3;g++)H(i,[.28,.025,.012],[x,.86+g*.07,.365],N.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;Ut(oh(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=pi(910+n),f=[[-t/2+.58,0],[t/2-.58,2]];n===0&&f.push([-5.32,1]);for(const[u,m]of f)for(let x=0;x<30;x++){const g=.5+x*.17+h()*.09,p=u+Math.sin(x*.55+m)*.28+(h()-.5)*.2;Ut(new $i(.055+h()*.08,7),x%3?o.leafDark:o.green,i,[p,g,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const u of[-t*.3,t*.24])H(i,[.78,.98,.78],[u,e+.48,-.05],o.stone,0),H(i,[.94,.13,.94],[u,e+1.02,-.05],o.stone,0),Ft(i,.09,.11,.24,[u-.16,e+1.19,-.05],N.rust,[0,0,0],10),Ft(i,.09,.11,.24,[u+.16,e+1.19,-.05],N.rust,[0,0,0],10);for(const u of[-t*.12,t*.36])Ft(i,.018,.018,1.42,[u,e+.76,.18],N.black,[0,0,0],8),H(i,[.88,.025,.025],[u,e+1.12,.18],N.black,0),H(i,[.58,.025,.025],[u,e+1.36,.18],N.black,0),H(i,[.025,.025,.72],[u,e+1.24,.18],N.black,0);const d=t*.16;Ut(new Fe(.37,.09,.13,20),N.silver,i,[d,e-1.48,.56],[1.02,0,-.32]),Ro(i,[[d-.18,e-1.62,.34],[d,e-1.5,.58]],.016,N.black,4);for(let u=0;u<6;u++){if((u+n)%4===3)continue;const m=-t*.34+u*t*.13,x=e+.13;Nn(i,.058,[m,x,.48],o.stone,[1.45,.82,.9],0),Fn(i,.032,[m+.065,x+.055,.49],N.black),H(i,[.11,.014,.035],[m-.085,x+.015,.47],N.black,0,[0,.2,.18])}}function vd(i,t,e,n,s,r,a,o){H(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),H(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])H(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),H(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);H(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],N.silver,0),H(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let Ba;function I2(){if(Ba)return Ba;const i=de((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=R2(),e=de((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return Ba={curtain:new At({map:i,roughness:1,side:Oe}),blind:new At({color:10067089,roughness:.9}),leaf:new At({color:4087359,roughness:1,flatShading:!0}),pot:new At({color:8414289,roughness:.94}),interior:new At({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new At({map:e,transparent:!0,alphaTest:.06,roughness:1,side:Oe})},Ba}function _d(i,t,e=1,n=0,s=N.black){const r=new ie;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),Nn(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),Fn(r,.086,[0,.325,.13],s);for(const a of[-1,1])Ut(new Fe(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),Ft(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return Ro(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function Md(i,t,e,n,s,r,a,o,l=0){const c=I2(),h=$n(),f=E2(l+811),d=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),u=(m=.574)=>{for(const x of[-1,1]){const g=new fe(n*.27,s*.91,5,6),p=g.attributes.position;for(let v=0;v<p.count;v++)p.setZ(v,.008*Math.sin(p.getX(v)*80));g.computeVertexNormals(),Ut(g,c.curtain,i,[t+x*n*.34,e-.025,m]),H(i,[.035,.09,.025],[t+x*n*.24,e-.08,m+.018],N.gold,0)}Ut(new fe(n*.96,s*.17),c.lace,i,[t,e+s*.39,m+.004])};if(r==="lit")Ut(oh(n*.97,s*.97,f%8,4,2),c.interior,i,[t,e,.566]),f%3===0&&u(.576),f%4===1&&(Ft(i,.006,.006,.34,[t+.18,e+s*.31,.59],N.black,[0,0,0],6),Ft(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),Fn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")u();else if(r==="blind"){for(let m=0;m<12;m++)H(i,[n*.94,.04,.019],[t,e+s/2-.08-m*.093,.581],c.blind,0,m>8?[.32,0,0]:[0,0,0]);for(const m of[-1,1])H(i,[.012,s*.68,.012],[t+m*n*.39,e+s*.08,.594],N.black,0);H(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const m=new ie;m.position.set(t-n/2,e,.6),m.rotation.y=-.42,i.add(m),H(m,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const x of[0,n*.48])H(m,[.038,s*.94,.05],[x,0,.025],a,0);for(const x of[-s*.47,s*.47])H(m,[n*.5,.038,.05],[n*.24,x,.025],a,0);H(m,[n*.48,.032,.05],[n*.24,.23,.025],a,0),Ft(m,.014,.014,.1,[n*.45,-.05,.065],N.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&f%3===0){const m=t+(f%2?.29:-.29);Ft(i,.1,.075,.15,[m,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const x of[-1,0,1])Nn(i,.07,[m+x*.055,e-s/2+.17,.79],x?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&f%5===0&&_d(i,[t-.17,e-s/2-.015,.8],.58,0,N.black),d>0&&d<3){if(f%9===2){H(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let m=0;m<6;m++)Nn(i,.07,[t-n*.31+m*n*.12,e-s/2+.17,.74],m%2?h.green:c.leaf,[1.2,.72,.8],0);for(let m=0;m<7;m++)Nn(i,.022,[t-n*.33+m*n*.105,e-s/2+.21,.78],m%3?N.red:N.cream,[1,1,1],0)}else if(f%11===5){H(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),Ut(new Fe(.15,.15,.025,20),N.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const m of[-.1,0,.1])H(i,[.42,.018,.012],[t+.16,e-s/2-.39+m,.735],N.black,0);H(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],N.black,0)}else if(f%13===6)for(const m of[-1,1]){H(i,[.24,s*.9,.035],[t+m*(n/2+.18),e,.55],h.leafDark,0);for(let x=0;x<5;x++)H(i,[.18,.025,.014],[t+m*(n/2+.18),e-s*.3+x*s*.15,.575],N.black,0)}}if(d===0&&r!=="open"&&f%3===1){for(const m of[-.36,-.18,0,.18,.36])H(i,[.018,s*.85,.018],[t+m*n,e,.645],N.black,0);for(const m of[-s*.28,s*.28])H(i,[n*.84,.02,.02],[t,e+m,.65],N.black,0)}if(d>=2&&f%11===0){const m=t+n*.24,x=e-s/2+.025;Nn(i,.055,[m,x,.76],h.stone,[1.45,.82,.9],0),Fn(i,.031,[m+.062,x+.052,.76],N.black),H(i,[.1,.013,.032],[m-.082,x+.012,.76],N.black,0,[0,.15,.16])}}function L2(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=$n();Ft(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),be(i,.56,.015,[2.5,.033,2.5],N.rust,[Math.PI/2,0,0]),be(i,.62,.014,[2.5,.033,2.5],N.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;H(i,[h,.012,.018],[2.5,.04,2.5+c*.085],N.black,.003)}for(const c of[2.23,2.77])H(i,[.05,.01,.11],[c,.049,2.5],N.black,.005);for(const c of[-4.55,4.55]){H(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),Ft(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),Ft(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),Fn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new ao(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}H(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)H(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new Ii([new D(-6,5.3,-6.5),new D(-1,4.96,-6.47),new D(4.2,5.31,-6.46)]);Ut(new wn(o,24,.011,5),N.rubber,i);const l=de((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[f,d]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(d,h/2,165+f*41);c.strokeStyle="#555b4d";for(let f=28;f<h;f+=43)c.beginPath(),c.moveTo(f,h-90),c.lineTo(f,h),c.stroke()});Ut(new fe(.42,.56),new At({map:l,roughness:.95,side:Oe}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,f,d]of[...cd.map(u=>[u.x,u.z,u.scale*3.5,u.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])Ut(new fe(f,d),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+za()*1.3,f=-6+za()*6,d=.03+za()*.13,u=new Di;u.moveTo(-.012,0),u.quadraticCurveTo(.014,d*.7,.025,d),u.lineTo(.006,0),Ut(new wo(u),s,i,[h,.025,f],[0,za()*6,0])}F2(i)}function Fu(i,t,e){const n=$n(),s=new ie;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])H(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])H(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])H(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),H(s,[.055,.04,.56],[r*.84,.67,0],N.rust,0),H(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function ka(i,t,e,n,s){const r=$n(),a=new ie,o=pi(s);a.position.set(...t),a.rotation.y=e,i.add(a),H(a,[n,.1,.78],[0,.05,0],N.rust,0);for(const c of[-1,1]){H(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),H(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)H(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,f=(o()-.5)*.42,d=c%3?r.leafDark:r.green;Nn(a,.15+o()*.15,[h,.19+o()*.08,f],d,[1.45,.58,.95],0),Nn(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,f+(o()-.5)*.18],d,[1.3,.62,.9],0),Nn(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,f+(o()-.5)*.16],d,[1.2,.6,.9],0)}for(let c=0;c<18;c++)Nn(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[N.red,N.cream,N.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)Ut(new Fe(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function D2(i,t,e,n,s=9){const r=$n();Ro(i,A2(t,e,n,7),.007,N.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;H(i,[.006,.07,.006],[l,c-.035,h],N.black,0),Fn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function Ha(i,t,e,n,s){const r=$n();H(i,[.07,.36,.13],[t,e,n],r.iron,.01),Ft(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),Ft(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),Fn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),Ut(new fe(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function U2(i,t,e,n=1){const s=$n(),r=new ie;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),Nn(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),Fn(r,.037,[0,.135,.085],N.black),Ut(new Fe(.001,.011,.038,5),N.gold,r,[0,.13,.128],[Math.PI/2,0,0]),H(r,[.075,.014,.1],[0,.075,-.105],N.black,0,[.22,0,0]);for(const a of[-1,1])H(r,[.008,.055,.008],[a*.025,.028,.01],N.rust,0);return r}function N2(i,t,e){const n=$n(),s=new ie;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])H(s,[1.08,.026,.105],[0,a+.055,o],r%2?N.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])H(s,[.1,.085,.1],[o,a,l],N.rust,0)}return H(s,[.58,.38,.48],[.05,.72,0],N.paper,.01,[0,.12,0]),s}function F2(i){const t=$n();Fu(i,[-5.45,0,-.75],Math.PI/2),Fu(i,[5.7,0,-5.25],0),ka(i,[-7.02,0,1.95],Math.PI/2,4.8,21),ka(i,[8.02,0,1.75],Math.PI/2,4.3,33),ka(i,[5.95,0,-6.08],0,3.5,47),ka(i,[-6.35,0,-6.08],0,2.1,58),D2(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),Ha(i,-7.62,2.75,-4.9,1),Ha(i,-7.62,2.75,3.8,1),Ha(i,8.62,2.75,-4.9,-1),Ha(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;H(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),H(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}Ft(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),H(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),Ut(new fe(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])Ft(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),Ft(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)Fn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?N.black:N.cream,[1,.75,1],0);N2(i,[-6.5,0,-4.9],.15);const e=new ie;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),H(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])H(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],N.rust,0);Fn(e,.035,[.075,1.02,.34],N.silver);for(let a=0;a<3;a++)Ut(new ai(.34,.105,8,26),N.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);Ut(new ai(.34,.105,8,26),N.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new ie;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),H(n,[.62,.58,1.72],[0,.58,0],N.leather,.18),H(n,[.54,.46,1],[0,1.02,-.12],N.leather,.19),H(n,[.5,.34,.46],[0,1.04,.58],N.leather,.16);for(const a of[-.42,.22])H(n,[.65,.018,.035],[0,.84,a],N.black,0);for(const a of[-.58,.58])Ut(new Fe(.29,.29,.09,20),N.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new ie;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),H(s,[.1,.035,.6],[0,.1,0],N.red,.01);for(const a of[-.25,.25])Ut(new Fe(.075,.075,.035,14),N.black,s,[0,.075,a],[0,0,Math.PI/2]);Ro(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,N.silver,8),H(s,[.36,.025,.025],[0,.78,.4],N.black,0),Ut(new fe(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),Fn(i,.16,[-4.72,.16,1.85],N.red,[1,.92,1]),_d(i,[-4.32,0,-.22],1,1.49,N.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>U2(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)Nn(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],N.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const f=Ut(new fe(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);f.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])Ut(new fe(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const yd=new At({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function O2(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])Ft(i,.027,.027,.016,[o,l,.854],N.silver,void 0,8),H(i,[.016,.003,.005],[o,l,.866],N.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=Xi(i,[.013,.035,.007],[o*1.155,l,.827],N.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])H(i,[.21,.06,.3],[o,.42,.6],N.silver,.018),H(i,[.075,.025,.21],[o,.305,.81],N.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){H(t,[.2,.032,.2],[o,.114,.12],N.silver,.008);for(const l of[-.065,.065])Ft(t,.022,.022,.012,[o+l,.139,.12],N.silver,[0,0,0],8)}const n=new At({color:1055507,roughness:.94});H(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=de((o,l,c)=>{for(let h=0;h<1800;h++){const f=c(),d=c();f>.1&&f<.9&&d<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(f*l,d*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const f=o.createLinearGradient(0,0,0,l);f.addColorStop(0,"rgba(67,42,24,0)"),f.addColorStop(.5,"rgba(67,42,24,.35)"),f.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=f,o.fillRect(h*l,0,6,l)}}),r=new At({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});Ut(new fe(2.35,1.43),r,i,[0,1.18,.876]),Ut(new fe(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])H(t,[.025,.006,.48],[o,.114,1.6],N.silver,.002);const a=de((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});Ut(new fe(.42,.37),new At({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const z2=new At({color:3883064,roughness:.82});function B2(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const f=$n(),d=pi(c*7+13),u=1.55,m=2.55,x=u,g=m+x,p=new Di;p.moveTo(-t/2,0),p.lineTo(t/2,0),p.lineTo(t/2,e),p.lineTo(-t/2,e),p.closePath();const v=new ro;v.moveTo(h-u,0),v.lineTo(h-u,m),v.absarc(h,m,x,Math.PI,0,!0),v.lineTo(h+u,0),v.closePath(),p.holes.push(v),Ut(new yo(p,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[P,U]of[[-t/2,h-u-.12],[h+u+.12,t/2]])H(i,[U-P,.75,.78],[(P+U)/2,.375,.025],n,0);for(const P of[3.28,6.2,9.15])for(const[U,O]of[[-t/2,h-u-.12],[h+u+.12,t/2]]){const z=O-U;z<.5||(H(i,[z,.14,.87],[(U+O)/2,P,.055],s,0),H(i,[z,.07,.98],[(U+O)/2,P+.09,.08],n,0))}H(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const P of[-1,1])H(i,[.36,m+.05,.62],[h+P*(u+.18),m/2,.06],n,.02);const _=new Vr(0,0,x+.2,x+.2,0,Math.PI,!1,0).getPoints(30).map(P=>new D(P.x,P.y,0));Ut(new wn(new Ii(_),30,.17,7,!1),n,i,[h,m,.06]),H(i,[.26,.62,.72],[h,g+.16,.09],n,.02);for(let P=1;P<7;P++){const U=Math.PI*P/7,O=Math.cos(U)*(x+.2),z=Math.sin(U)*(x+.2);H(i,[.17,.3,.52],[h+O,m+z,.03],n,.012,[0,0,-U+Math.PI/2])}const T=new At({color:1909020,roughness:.96});H(i,[u*2+.6,.06,3.6],[h,0,-1.85],n,0),H(i,[.24,4.6,3.6],[h-u-.32,2.3,-1.85],T,0),H(i,[.24,4.6,3.6],[h+u+.32,2.3,-1.85],T,0),H(i,[3.4,.2,3.6],[h,g+.62,-1.85],n,0),H(i,[3.4,4.8,.12],[h,2.4,-3.7],T,0);const b=de((P,U)=>{const O=P.createLinearGradient(0,0,0,U);O.addColorStop(0,"rgba(52,60,58,1)"),O.addColorStop(.42,"rgba(85,74,54,1)"),O.addColorStop(1,"rgba(34,38,34,1)"),P.fillStyle=O,P.fillRect(0,0,U,U);const z=P.createRadialGradient(U*.5,U*.3,0,U*.5,U*.3,U*.46);z.addColorStop(0,"rgba(255,198,118,.95)"),z.addColorStop(.45,"rgba(255,174,92,.38)"),z.addColorStop(1,"rgba(255,160,80,0)"),P.fillStyle=z,P.fillRect(0,0,U,U)});Ut(new fe(3.2,4.6),new Ke({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),Ut(new fe(3,4.2),new Ke({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),H(i,[1.1,.4,.36],[h-.55,2.1,-2.1],T,0),H(i,[.5,.9,.3],[h+.7,.28,-2.2],T,0);const E=(P,U=0)=>{const O=new ie,z=u-.06,V=m-.1;O.position.set(h+P*(u-.02),0,.02),O.rotation.y=P*U,i.add(O);const k=-P*z/2;for(const q of[.07,V])H(O,[z,.1,.09],[k,q,0],N.black,.012);for(const q of[k-z/2+.045,k+z/2-.045])H(O,[.09,V,.09],[q,V/2,0],N.black,.012);const B=.92;H(O,[z-.12,B,.07],[k,B/2+.1,0],z2,.01);for(let q=0;q<3;q++)H(O,[z-.18,.03,.09],[k,B*(q+.5)/3+.1,.012],N.rust,0);for(let q=k-z/2+.14;q<k+z/2-.1;q+=.17)H(O,[.03,V-B-.24,.03],[q,B+.12+(V-B-.24)/2,.012],N.black,0);for(const q of[V-.12,2.02,B+.32])H(O,[z-.14,.05,.055],[k,q,.012],N.black,0);for(const q of[.42,.95])Ft(O,.035,.035,.09,[k+P*(z/2-.02),q,0],N.black,[0,0,0],10);return be(O,.1,.013,[k,V*.8,.02],N.black),O};E(-1,.3),E(1,0);for(let P=-3;P<=3;P++){const U=h+P*.42,O=Math.sqrt(Math.max(0,x*x-U*U)),z=m+O*.96,V=m-.1;z-V<.12||H(i,[.028,z-V,.028],[U,(z+V)/2,.055],N.black,0)}const y=new Vr(0,0,x-.02,x-.02,0,Math.PI,!1,0).getPoints(20).map(P=>new D(P.x,P.y,0));Ut(new wn(new Ii(y),20,.03,5,!1),N.black,i,[h,m,.055]);for(let P=0;P<5;P++){const U=Math.PI*(P+1)/6;H(i,[.05,.05,.05],[h+Math.cos(U)*(x-.02),m+Math.sin(U)*(x-.02),.075],N.black,0)}Ft(i,.02,.02,.5,[h,g+.9,.36],N.black,[0,0,0],8),Ft(i,.11,.2,.14,[h,g+.5,.36],N.black,[0,0,0],14),Fn(i,.082,[h,g+.4,.36],f.bulb,[1,1.45,1],0),Ut(new fe(1.5,1.5),f.glow,i,[h,g+.36,.5]);const S=new At({map:yc("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});H(i,[.62,.46,.06],[h+2.3,2.35,.35],N.black,0),Ut(new fe(.57,.41),S,i,[h+2.3,2.35,.39]);const R=Math.floor(t/2.47);for(let P=0;P<R;P++)for(let U=0;U<4;U++){const O=(P-(R-1)/2)*2.47,z=1.72+U*2.95;if(Math.abs(O-h)<3.3&&U<2)continue;const V=1.16,k=1.91,B=300+U*10+P;H(i,[V+.26,k+.27,.14],[O,z,.38],s,0),H(i,[V+.05,k+.06,.1],[O,z,.47],r,0);const q=hd(P,U,2),Q=q==="lit"?l:o[(P+U)%o.length];H(i,[V,k,.04],[O,z,.54],Q,0);for(const at of[-V/2,V/2,0])H(i,[.048,k,.09],[O+at,z,.58],n,0);for(const at of[-k/2,k/2,.24])H(i,[V,.047,.09],[O,z+at,.58],n,0);H(i,[V+.4,.12,.43],[O,z-k/2-.09,.55],s,0),vd(i,O,z,V,k,n,r,s),U>=1&&Md(i,O,z,V,k,q,s,Q,B)}for(const P of[-t/2+.35,t/2-.38]){Ft(i,.07,.07,e,[P,e/2,.53],r,[0,0,0],12);for(let U=1;U<e;U+=2)Ft(i,.087,.087,.055,[P,U,.53],N.rust,[0,0,0],12)}const L=new Ke({map:gd(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[P,U]of[[-t/2,h-u-.5],[h+u+.5,t/2]].filter(([O,z])=>z-O>1))Ut(new fe(U-P,.9),L,i,[(P+U)/2,.55,.345]);Ut(oh(.48,.64,c%4,2,2),f.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let P=0;P<22;P++){const U=P<11?-t/2+.55:t/2-.55,O=U+Math.sin(P*.55)*.26+(d()-.5)*.2;Ut(new $i(.05+d()*.075,7),P%3?f.leafDark:f.green,i,[O,.5+P*.17,.355+d()*.04],[0,0,d()*Math.PI])}for(const P of[-t*.32,t*.3])H(i,[.78,.98,.78],[P,e+.48,-.05],n,0),H(i,[.94,.13,.94],[P,e+1.02,-.05],n,0),Ft(i,.09,.11,.24,[P-.16,e+1.19,-.05],N.rust,[0,0,0],10),Ft(i,.09,.11,.24,[P+.16,e+1.19,-.05],N.rust,[0,0,0],10);return Ft(i,.018,.018,1.42,[t*.12,e+.76,.18],N.black,[0,0,0],8),H(i,[.88,.025,.025],[t*.12,e+1.12,.18],N.black,0),H(i,[.58,.025,.025],[t*.12,e+1.36,.18],N.black,0),i}function Ou(i,t,e,n,s){H(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),H(i,[t+.1,.08,1.28],[0,e+.36,.34],Rr(s),0),Ut(new Yn(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),H(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])H(i,[.16,.2,.16],[r,e+.62,.95],N.rust,0)}function Rr(i){return Rr.mat||(Rr.mat=i.clone(),Rr.mat.color.offsetHSL(0,-.03,.04)),Rr.mat}function k2(){const i=new ie;i.name="sky";const t=new or(55,32,18),e=[],n=new qt("#6a5142"),s=new qt("#253a55"),r=new qt("#08111f");for(let E=0;E<t.attributes.position.count;E++){const w=kt.smoothstep(t.attributes.position.getY(E)/55,-.04,.62);(w<.4?n.clone().lerp(s,w/.4):s.clone().lerp(r,(w-.4)/.6)).toArray(e,E*3)}t.setAttribute("color",new he(e,3));const a=new Gt(t,new Ke({vertexColors:!0,side:rn,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=de((E,w)=>{const y=E.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);y.addColorStop(0,"rgba(255,255,255,1)"),y.addColorStop(.34,"rgba(255,255,255,.86)"),y.addColorStop(.62,"rgba(255,255,255,.22)"),y.addColorStop(1,"rgba(255,255,255,0)"),E.fillStyle=y,E.fillRect(0,0,w,w)},64),l=pi(20261),c=105,h=[],f=[],d=new qt("#e6efff"),u=new qt("#ffe8c6"),m=new qt("#bcd3ff");for(let E=0;E<c;E++){const w=l()*Math.PI*2,y=.9+Math.pow(l(),.65)*.58,S=49+l()*3,R=Math.cos(y);h.push(Math.sin(w)*R*S,Math.sin(y)*S,-Math.cos(w)*R*S);const L=l(),P=(L>.72?u:L>.34?d:m).clone(),U=kt.clamp((y-.9)/.25,0,1),O=(.55+Math.pow(l(),1.4)*.45)*U;f.push(P.r*O,P.g*O,P.b*O)}const x=new Ae;x.setAttribute("position",new he(h,3)),x.setAttribute("color",new he(f,3));const g=new fp(x,new Xf({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Or,fog:!1,toneMapped:!1,alphaTest:.01}));g.renderOrder=-20,g.frustumCulled=!1,g.name="sky-stars",i.add(g);const p=new D(-.16,.883,-.442).normalize(),v=p.clone().multiplyScalar(44),M=de((E,w,y)=>{const S=w*.47,R=w/2,L=w/2;E.clearRect(0,0,w,w);const P=E.createRadialGradient(R-S*.22,L-S*.26,S*.06,R,L,S);P.addColorStop(0,"#fbfcf7"),P.addColorStop(.62,"#e6e9ee"),P.addColorStop(.9,"#cfd5e0"),P.addColorStop(1,"#b9c1cf"),E.fillStyle=P,E.beginPath(),E.arc(R,L,S,0,Math.PI*2),E.fill(),E.save(),E.beginPath(),E.arc(R,L,S,0,Math.PI*2),E.clip();for(let O=0;O<26;O++){const z=y()*Math.PI*2,V=Math.sqrt(y())*S*.92,k=R+Math.cos(z)*V,B=L+Math.sin(z)*V,q=S*(.03+y()*.13),Q=E.createRadialGradient(k,B,0,k,B,q);Q.addColorStop(0,`rgba(132,142,160,${.1+y()*.17})`),Q.addColorStop(1,"rgba(132,142,160,0)"),E.fillStyle=Q,E.beginPath(),E.arc(k,B,q,0,Math.PI*2),E.fill()}for(let O=0;O<5;O++){const z=y()*Math.PI*2,V=Math.sqrt(y())*S*.62,k=R+Math.cos(z)*V,B=L+Math.sin(z)*V,q=S*(.16+y()*.16),Q=E.createRadialGradient(k,B,0,k,B,q);Q.addColorStop(0,"rgba(150,158,174,.16)"),Q.addColorStop(1,"rgba(150,158,174,0)"),E.fillStyle=Q,E.beginPath(),E.arc(k,B,q,0,Math.PI*2),E.fill()}const U=E.createRadialGradient(R,L,S*.2,R,L,S);U.addColorStop(0,"rgba(255,255,255,0)"),U.addColorStop(.78,"rgba(150,162,186,.13)"),U.addColorStop(1,"rgba(96,110,138,.42)"),E.fillStyle=U,E.beginPath(),E.arc(R,L,S,0,Math.PI*2),E.fill(),E.restore()},256);M.colorSpace=qe;const _=new Gh(new pc({map:M,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));_.position.copy(v),_.scale.set(2.25,2.25,1),_.name="sky-moon",i.add(_);const T=de((E,w)=>{const y=E.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);y.addColorStop(0,"rgba(226,236,255,.9)"),y.addColorStop(.22,"rgba(198,216,255,.34)"),y.addColorStop(.5,"rgba(170,196,255,.10)"),y.addColorStop(1,"rgba(150,180,255,0)"),E.fillStyle=y,E.fillRect(0,0,w,w)},128),b=new Gh(new pc({map:T,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:Or,fog:!1,toneMapped:!1}));return b.position.copy(v).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:g,moon:_,glow:b,moonDirection:p.clone(),update(){}}}const Gi=Math.PI/180;function Sr(i,t,e,n=1,s=1,r=!0){const a=new Uint8Array(i*t*4);for(let l=0;l<t;l++)for(let c=0;c<i;c++){const h=(l*i+c)*4,[f,d,u]=e(c,l,i,t);a[h]=f,a[h+1]=d,a[h+2]=u,a[h+3]=255}const o=new $c(a,i,t,Un);return o.wrapS=ci,o.wrapT=ci,o.repeat.set(n,s),o.colorSpace=r?qe:mn,o.needsUpdate=!0,o}function Vs(i,t){const e=Math.imul(i*374761393+t*668265263,1274126177)>>>0;return((e^e>>>13)>>>0)/4294967295}function H2(){const i=Sr(64,64,(r,a)=>{const o=r>>3&1?r+a:r-a+64,l=Math.sin(o%8*Math.PI*.25)*26,c=(Vs(r,a)-.5)*28,h=Math.max(0,Math.min(255,Math.round(128+l+c)));return[h,h,h]},7,9,!1),t=Sr(64,64,(r,a)=>{const o=(Vs(r,a)-.5)*42+(Vs(r>>1,a>>1)-.5)*22,l=Math.max(0,Math.min(255,Math.round(128+o)));return[l,l,l]},5,5,!1),e=Sr(64,64,(r,a)=>{const o=Math.sin(r/64*Math.PI*16)*46,l=Math.sin(a/64*Math.PI*24+(r>>1&1)*1.2)*22,c=Math.max(0,Math.min(255,Math.round(128+o+l)));return[c,c,c]},4,4,!1),n=Sr(64,64,(r,a)=>{const o=Math.sin(r/64*Math.PI*28)*34,l=(Vs(r,a)-.5)*18,c=Math.max(0,Math.min(255,Math.round(128+o+l)));return[c,c,c]},6,8,!1),s=Sr(64,64,(r,a)=>{const o=Vs(r,a),l=Vs(r+3>>1,a+5>>1),c=Math.max(0,Math.min(255,Math.round(118+(o-.5)*34+(l-.5)*38)));return[c,c,c]},4,4,!1);return{woolBump:i,suedeBump:t,knitBump:e,trouserBump:n,bootBump:s}}function Kn(i,t){const e=i.index?i.toNonIndexed():i.clone();return e.applyMatrix4(t),e.getAttribute("normal")||e.computeVertexNormals(),i.dispose(),e}function Xs(i){const t=i.index?i.toNonIndexed():i.clone(),e=t.getAttribute("position").array;for(let s=0;s<e.length;s+=3)e[s]=-e[s];for(let s=0;s<e.length;s+=9)for(let r=0;r<3;r++){const a=e[s+3+r];e[s+3+r]=e[s+6+r],e[s+6+r]=a}const n=t.getAttribute("uv");if(n){const s=n.array;for(let r=0;r<s.length;r+=6){const a=s[r+2],o=s[r+3];s[r+2]=s[r+4],s[r+3]=s[r+5],s[r+4]=a,s[r+5]=o}}return t.computeVertexNormals(),t}function ti(i){const t=i.map(l=>{const c=l.index?l.toNonIndexed():l.clone();return c.getAttribute("normal")||c.computeVertexNormals(),l.dispose(),c});let e=0;for(const l of t)e+=l.getAttribute("position").count;const n=new Float32Array(e*3),s=new Float32Array(e*3),r=new Float32Array(e*2);let a=0;for(const l of t){const c=l.getAttribute("position"),h=l.getAttribute("normal"),f=l.getAttribute("uv");if(n.set(c.array,a*3),s.set(h.array,a*3),f&&f.itemSize>=2)for(let d=0;d<c.count;d++)r[(a+d)*2]=f.getX(d),r[(a+d)*2+1]=f.getY(d);a+=c.count,l.dispose()}const o=new Ae;return o.setAttribute("position",new Ce(n,3)),o.setAttribute("normal",new Ce(s,3)),o.setAttribute("uv",new Ce(r,2)),o.computeBoundingSphere(),o}function Ze(i,t=24,{capStart:e=!1,capEnd:n=!1}={}){const s=i.length,r=t+1,a=(e?1:0)+(n?1:0),o=new Float32Array((s*r+a)*3),l=new Float32Array((s*r+a)*2),c=[];for(let B=0;B<s;B++){const q=B/Math.max(1,s-1),Q=i[B];for(let at=0;at<=t;at++){const dt=at/t,Ct=dt*Math.PI*2,[It,$,it]=Q(Ct,dt),gt=(B*r+at)*3,Mt=(B*r+at)*2;o[gt]=It,o[gt+1]=$,o[gt+2]=it,l[Mt]=dt,l[Mt+1]=q}}let h=0,f=0,d=0,u=0;for(let B=0;B<Math.min(2,s);B++)for(let q=0;q<t;q++){const Q=(B*r+q)*3;h+=o[Q],f+=o[Q+1],d+=o[Q+2],u++}h/=Math.max(1,u),f/=Math.max(1,u),d/=Math.max(1,u);const m=o[0],x=o[1],g=o[2],p=o[3],v=o[4],M=o[5],_=o[r*3],T=o[r*3+1],b=o[r*3+2],E=_-m,w=T-x,y=b-g,S=p-m,R=v-x,L=M-g,P=w*L-y*R,U=y*S-E*L,O=E*R-w*S,z=P*(m-h)+U*(x-f)+O*(g-d)<0;for(let B=0;B<s-1;B++)for(let q=0;q<t;q++){const Q=B*r+q,at=Q+1,dt=(B+1)*r+q,Ct=dt+1;z?c.push(Q,at,dt,at,Ct,dt):c.push(Q,dt,at,at,dt,Ct)}let V=s*r;if(e){let B=0,q=0,Q=0;for(let at=0;at<t;at++)B+=o[at*3],q+=o[at*3+1],Q+=o[at*3+2];o[V*3]=B/t,o[V*3+1]=q/t,o[V*3+2]=Q/t,l[V*2]=.5,l[V*2+1]=0;for(let at=0;at<t;at++)z?c.push(V,at+1,at):c.push(V,at,at+1);V++}if(n){const B=(s-1)*r;let q=0,Q=0,at=0;for(let dt=0;dt<t;dt++)q+=o[(B+dt)*3],Q+=o[(B+dt)*3+1],at+=o[(B+dt)*3+2];o[V*3]=q/t,o[V*3+1]=Q/t,o[V*3+2]=at/t,l[V*2]=.5,l[V*2+1]=1;for(let dt=0;dt<t;dt++)z?c.push(V,B+dt,B+dt+1):c.push(V,B+dt+1,B+dt)}const k=new Ae;return k.setAttribute("position",new Ce(o,3)),k.setAttribute("uv",new Ce(l,2)),k.setIndex(c),k.computeVertexNormals(),k}function G2(i,t,e){const n=(i-t)/e;return(1-2*n*n)*Math.exp(-n*n)}function _l(i,t,e,{atJoint:n=!0,stitches:s=!0,nail:r=!1,curl:a=.16,pleats:o=2,steps:l=26}={}){const c=[];for(let f=0;f<=l;f++){const d=f/l,u=Math.pow(d,.92),m=kt.lerp(i,t,u),x=n?Math.exp(-Math.pow(d/.135,2)):0,g=1-.022*Math.exp(-Math.pow((d-.55)/.32,2)),p=.89,v=d>p?Math.sqrt(Math.max(.06,1-Math.pow((d-p)/(1-p),1.9))):1,M=-d*e,_=-a*e*Math.pow(d,2),T=m*(1.155+x*.135)*g*v,b=m*(.8+x*.1)*g*v,E=m*(.95+x*.05)*g*v,w=n?G2(d,.155,.075)*.34:0,y=r?Math.exp(-Math.pow((d-.775)/.165,2)):0;c.push(S=>{const R=Math.cos(S),L=Math.sin(S),P=Math.abs(R);let U=Math.sign(R)*Math.pow(P,.8)*T,O;if(L>=0){const z=1-.22*y*Math.exp(-Math.pow(U/(T*.46),2)),V=r?.001*Math.exp(-Math.pow((Math.abs(U)-T*.5)/.003,2))*y+9e-4*Math.exp(-Math.pow((d-.935)/.045,2))*Math.exp(-Math.pow(U/(T*.42),2)):0,k=s?72e-5*(Math.sin(d*e/.0026*Math.PI*2)>.05?1:0)*Math.exp(-Math.pow(U/.0021,2)):0;O=L*b*z+V+k+w*m*.075*Math.exp(-Math.pow(U/(T*.5),2))}else{const z=r?Math.exp(-Math.pow((d-.8)/.22,2))*.3:0,V=1+(.1*Math.sin(Math.PI*Math.min(1,d*1.12))+z)*(1-P*.35),k=Math.exp(-Math.pow((d-.098)/.05,2))+(o>1?Math.exp(-Math.pow((d-.208)/.042,2))*.72:0);O=L*E*V+k*m*.175*Math.exp(-Math.pow(U/(T*.62),2))}return[U,_+O,M]})}return Ze(c,26,{capStart:!1,capEnd:!0})}function Ml(i,t=.0088,e=1.1,n=.94,s=0){const r=[];for(let o=0;o<=9;o++){const l=o/9,c=kt.lerp(t,-t,l),h=Math.sqrt(Math.max(.02,1-Math.pow((l-.5)/.5,2))),f=i*(.965+.075*h);r.push(d=>{const u=Math.cos(d),m=Math.sin(d),x=1+.055*Math.exp(-Math.pow((Math.abs(u)-.86)/.26,2))*h,g=m>0?1+(.09+s)*h:1;return[Math.sign(u)*Math.pow(Math.abs(u),.86)*f*e*x,Math.sign(m)*Math.pow(Math.abs(m),.88)*f*n*g,c]})}return Ze(r,20,{capStart:!0,capEnd:!0})}function zu(i=1){const n=[],r=[-.0318,-.0106,.0116,.0324];for(let a=0;a<=32;a++){const o=a/32,l=kt.lerp(.0075,-.1056,o);let c=.0262+.021*Math.pow(o,.7);c-=.0062*Math.exp(-Math.pow((o-1)/.08,2));const h=.013-.0058*Math.pow(o,1.2),f=.0106-.0026*o,d=-.0038*Math.sin(o*Math.PI),u=Math.exp(-Math.pow(o/.1,2)),m=kt.smoothstep(o,.64,1),x=kt.smoothstep(o,.8,1);n.push(g=>{const p=Math.cos(g),v=Math.sin(g),M=Math.abs(p),_=Math.sign(p)*Math.pow(M,.8)*c*(1+u*.02);let T=0;for(let y=0;y<3;y++)T+=Math.exp(-Math.pow((_-i*(r[y]+r[y+1])*.5)/.0064,2));const b=1-Math.min(1,T),E=l+x*(.0016*b+.0118*Math.max(0,-v));let w=d;if(v>=0){const y=1+.16*(1-M*M),S=.0012*Math.exp(-Math.pow(_/.0046,2))*kt.smoothstep(o,.06,.2)*(1-.35*kt.smoothstep(o,.86,1));w+=v*(h+.0026*m)*y+S}else{const y=1-.3*(1-M*M)*kt.smoothstep(o,.25,.85),S=Math.exp(-Math.pow((_+i*.033)/.014,2))*.0034*(1-o*.45),R=Math.exp(-Math.pow((_-i*.0335)/.012,2))*.0026*(1-o*.3),L=Math.exp(-Math.pow((o-.62)/.085,2))*.0012;w+=v*f*y-S-R+L*(1-M)}return[_,w,E]})}return Ze(n,44,{capStart:!0,capEnd:!0})}function V2({rxHand:i,ryHand:t,rxCuff:e,ryCuff:n,zCuff:s=.0356,zHand:r=-.0058}){const a=[];for(let l=0;l<=16;l++){const c=l/16,h=Math.pow(c,.7),f=kt.lerp(e,i,h),d=kt.lerp(n,t,h),u=kt.lerp(s,r,c),m=Math.exp(-Math.pow(c/.44,2));a.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=m*Math.sin(x*3-.4)*.0012;return[Math.sign(g)*Math.pow(Math.abs(g),.86)*(f+v),Math.sign(p)*Math.pow(Math.abs(p),.88)*(d+v*.62),u]})}return Ze(a,24,{capStart:!0,capEnd:!0})}function W2(){const i=[];for(let a=0;a<=9;a++){const o=a/9,l=kt.lerp(-.324,-.253,o),c=kt.lerp(.0684,.0588,o),h=kt.lerp(.0566,.0494,o),f=.009*Math.pow(1-o,2);i.push(d=>{const u=Math.cos(d),m=Math.sin(d),x=Math.exp(-Math.pow((Math.abs(u)-.6)/.24,2))*(m<0?.0044:0),g=m>0?.94:1;return[Math.sign(u)*Math.pow(Math.abs(u),.86)*(c-x*.3),l,f+Math.sign(m)*Math.pow(Math.abs(m),.92)*(h*g-x)]})}const r=4;for(let a=1;a<=r;a++){const o=a/r*(Math.PI*.5),l=Math.cos(o),c=-.253+(-.2442- -.253)*Math.sin(o),h=.0588*l+.0016,f=.0494*l+.0016;i.push(d=>{const u=Math.cos(d),m=Math.sin(d);return[Math.sign(u)*Math.pow(Math.abs(u),.86)*h,c,Math.sign(m)*Math.pow(Math.abs(m),.92)*f]})}return Ze(i,24,{capStart:!0,capEnd:!0})}function lh(i,{gap:t=.0075,halfT:e=.0058,steps:n=26,radialSegs:s=12,widthPow:r=.55,thickPow:a=1.55,ribCount:o=0,ribAmp:l=.16,billow:c=0,capStart:h=!0,capEnd:f=!0}={}){const d=new Ii(i.map(g=>new D(g.x,g.y,0)),!1,"catmullrom",.5),u=i.length,m=g=>{const p=g*(u-1),v=Math.min(u-2,Math.max(0,Math.floor(p)));return kt.lerp(i[v].hw??1,i[v+1].hw??1,kt.clamp(p-v,0,1))},x=[];for(let g=0;g<=n;g++){const p=g/n,v=d.getPointAt(p),M=m(p),_=c*Math.sin(p*Math.PI);x.push(T=>{const b=Math.cos(T),E=Math.sin(T),w=o>0?1+l*Math.cos(T*o):1,y=v.x+Math.sign(b)*Math.pow(Math.abs(b),r)*M*w,S=ch(v.y,y),R=t+_+Math.sign(E)*Math.pow(Math.abs(E),a)*e*w;return[y,v.y,S-R]})}return Ze(x,s,{capStart:h,capEnd:f})}function X2(i,t,e=0){const s=(c,h)=>ch(h,c),r=(s(i+.0022,t)-s(i-.0022,t))/.0044,a=(s(i,t+.0022)-s(i,t-.0022))/(2*.0022),o=new D(r,a,-1).normalize(),l=new Ne().setFromUnitVectors(new D(0,1,0),o);return new te().compose(new D(i,t,s(i,t)-e),l,new D(1,1,1))}function Bu(i,t,{gather:e=.0032,oval:n=.86}={}){const s=[];for(let a=0;a<=10;a++){const o=a/10,l=kt.lerp(i,t,o),c=Math.sin(o*Math.PI)*e,h=(1-o)*.0016,f=o-.5;s.push(d=>{const u=Math.cos(d),m=Math.sin(d),x=Math.exp(-Math.pow((d-0)/.17,2))*.0015+Math.exp(-Math.pow(Math.abs(d-Math.PI)/.17,2))*.0012,g=(l+c+x)*n,p=l+c*1.3+h,v=m<0?m*c*.7:0;return[u*g,f,m*p+v]})}return Ze(s,18)}function q2(i){const t=[];for(let r=0;r<=12;r++){const a=r/12,o=kt.lerp(.0065,-.0755,a),l=Math.pow(Math.max(0,1-a*1.02),1.55),c=Math.exp(-Math.pow((a-.2)/.24,2)),h=Math.exp(-Math.pow((a-.4)/.085,2))*.0052,f=i*(1+l*.085)+h;t.push(d=>{const u=Math.cos(d),m=Math.sin(d),x=c*Math.sin(d*5+.55)*.0026;return[u*(f+x)*.885,o,m*(f+x)*1]})}return Ze(t,26,{capStart:!0,capEnd:!1})}function Y2(i){const t=[];for(let n=0;n<=10;n++){const s=n/10,r=1+.052*Math.sin(Math.pow(s,.82)*Math.PI),a=i*r,o=kt.lerp(.036,-.036,s);t.push(l=>{const c=Math.cos(l),h=Math.sin(l),f=h>0?Math.pow(h,2.4)*.009*Math.sin(s*Math.PI):0,d=h<0?Math.pow(-h,2)*.0042:0;return[c*a*.885,o,h*(a+f)-d]})}return Ze(t,20,{capStart:!0,capEnd:!0})}function yl({rBase:i,rTip:t,len:e,curl:n=.16,roundTip:s=!0,swell:r=.1,noseAt:a=.85,nail:o=!1}){const l=[],h=a;for(let f=0;f<=14;f++){const d=f/14,u=d>h?Math.sqrt(Math.max(.05,1-Math.pow((d-h)/(1-h),1.55))):1,m=kt.lerp(i,t,Math.pow(d,.88))*(s?u:1),x=Math.exp(-Math.pow((d-.04)/.2,2))*r,g=Math.exp(-Math.pow((d-.3)/.085,2))*.075+Math.exp(-Math.pow((d-.44)/.075,2))*.045,p=Math.sin(Math.PI*kt.clamp(d*1.04,0,1)),v=-d*e,M=-n*e*Math.pow(d,2);l.push(_=>{const T=Math.cos(_),b=Math.sin(_),E=b>=0,w=o?Math.exp(-Math.pow((d-.8)/.16,2)):0,y=m*(1.14+x*.55)*(1+.05*w),S=m*(E?(.7+g)*(1-.2*w*Math.exp(-Math.pow(T/.56,2)))+.1*w*Math.exp(-Math.pow((Math.abs(T)-.66)/.15,2)):.95),R=E?.0011*p*Math.exp(-Math.pow(T/.52,2)):0,L=E?0:Math.pow(-b,1.15)*m*.14*p;return[T*y,M+b*S+R-L*.6,v]})}return Ze(l,16,{capStart:!1,capEnd:!!s})}function ku(i=1){const t=[];for(let n=0;n<=10;n++){const s=n/10,r=.0138+Math.sin(s*Math.PI)*.0062-s*.0022,a=-i*kt.lerp(.0295,.0425,Math.pow(s,.86)),o=-.0075+Math.sin(s*Math.PI)*.0035,l=kt.lerp(.0035,-.043,s);t.push(c=>{const h=Math.cos(c),f=Math.sin(c),d=f<0?1.2:.72;return[a-i*h*r*.78,o+f*r*d,l+h*r*.3]})}return Ze(t,14,{capStart:!0,capEnd:!0})}const to=[{y:-.258,hw:.069,hd:.0458,cz:.052,split:0},{y:-.272,hw:.101,hd:.054,cz:.0332,split:0},{y:-.284,hw:.166,hd:.0638,cz:.0122,split:0},{y:-.296,hw:.2318,hd:.0758,cz:-.0062,split:0},{y:-.312,hw:.2352,hd:.0828,cz:-.0205,split:0},{y:-.344,hw:.2132,hd:.0902,cz:-.0332,split:0},{y:-.4,hw:.2014,hd:.0976,cz:-.0492,split:0},{y:-.46,hw:.195,hd:.1032,cz:-.0628,split:0},{y:-.53,hw:.1906,hd:.1062,cz:-.0788,split:0},{y:-.6,hw:.1892,hd:.1098,cz:-.0958,split:0},{y:-.71,hw:.194,hd:.114,cz:-.122,split:.035},{y:-.81,hw:.2,hd:.116,cz:-.142,split:.075},{y:-.895,hw:.206,hd:.118,cz:-.156,split:.115}],$2=-.296,Ga=(i,t,e,n,s)=>{const r=s*s,a=r*s;return .5*(2*t+(e-i)*s+(2*i-5*t+4*e-n)*r+(3*t-i-3*e+n)*a)};function Sd(i){const t=to,e=t.length;let n=0;for(;n<e-2&&i<t[n+1].y;)n++;const s=t[Math.max(0,n-1)],r=t[n],a=t[n+1],o=t[Math.min(e-1,n+2)],l=a.y-r.y,c=l!==0?kt.clamp((i-r.y)/l,0,1):0;return{hw:Math.max(.05,Ga(s.hw,r.hw,a.hw,o.hw,c)),hd:Math.max(.03,Ga(s.hd,r.hd,a.hd,o.hd,c)),cz:Ga(s.cz,r.cz,a.cz,o.cz,c),split:Math.max(0,Ga(s.split,r.split,a.split,o.split,c))}}function bd(i){return Math.exp(-Math.pow((i-$2)/.042,2))}function ch(i,t=0){const e=Sd(i),n=bd(i),s=Math.min(.999,Math.abs(t)/e.hw),r=Math.pow(s,1.25);let a=e.cz-e.hd*Math.pow(Math.max(0,1-Math.pow(s,2/.84)),.43);return a+=n*(.0028*r+.0018*Math.exp(-Math.pow((1-s)/.3,2))),kt.clamp((-i-.6)/.28,0,1)<.35&&t>-.052&&t<.084&&(a-=.0055),e.split>.001&&Math.abs(t)<e.split&&(a+=(1-Math.abs(t)/e.split)*e.split*.72),a}function Z2(){const i=[],t=to[0].y,e=to[to.length-1].y,n=34;for(let s=0;s<=n;s++){const r=s/n,a=r<.26?r*.5769:.15+(r-.26)*1.2192,o=kt.lerp(t,e,kt.clamp(a,0,1)),{hw:l,hd:c,cz:h,split:f}=Sd(o),d=bd(o),u=Math.exp(-Math.pow((o+.344)/.024,2)),m=kt.clamp((-o-.6)/.28,0,1);i.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=Math.min(1,Math.abs(g)),M=Math.sign(g)*Math.pow(Math.abs(g),.84),_=Math.sign(p)*Math.pow(Math.abs(p),.86),T=Math.pow(v,1.25),b=m*Math.sin(x*6)*.0055;let E=M*(l+b),w=h+_*(c+b*.8);const y=o+d*T*.0048;E+=Math.sign(g||1)*d*(T*.0028),w+=d*.0028*T;const S=Math.exp(-Math.pow((1-v)/.3,2))*d;if(E+=Math.sign(g||1)*S*.0022,w+=Math.sign(p||1)*S*.0018,p>.45&&(w+=u*(.4+.6*p)*.0042),p<-.55&&m<.35){const R=g>-.18&&g<.35?-.0055:0;w+=R}if(f>.001&&p<-.55&&Math.abs(E)<f){const R=(1-Math.abs(E)/f)*f*.72;w+=R}return[E,y,w]})}return Ze(i,36,{capStart:!0,capEnd:!0})}function J2(){const i=[];for(let r=0;r<=30;r++){const o=-1.7+r/30*3.4,l=Math.pow(Math.abs(o)/1.7,1.35),c=Math.sin(o)*.0792*(1+l*.055),h=.0128+Math.cos(o)*.0598,f=-.301+l*.0042,d=-.2398-l*.018,u=.0122-l*.0102,m=(d-f)*.5,x=(d+f)*.5,g=.0072+(1-Math.abs(Math.sin(o)))*.0016;i.push(p=>{const v=Math.cos(p),M=Math.sin(p),_=Math.sign(v)*Math.pow(Math.abs(v),.72)*g,T=Math.sign(M)*Math.pow(Math.abs(M),.8)*m,b=Math.sin(o),E=Math.cos(o);return[c+b*_,x+T,h+E*_+u*(T/m)*.6]})}return Ze(i,14,{capStart:!0,capEnd:!0})}function K2(){return lh([{x:.0555,y:-.2765,hw:.0135},{x:.0885,y:-.303,hw:.0305},{x:.1115,y:-.34,hw:.037},{x:.1175,y:-.388,hw:.0352},{x:.1055,y:-.436,hw:.0305},{x:.0892,y:-.452,hw:.0228},{x:.0712,y:-.474,hw:.0158},{x:.0556,y:-.4885,hw:.0072}],{gap:.0068,halfT:.0062,steps:30,radialSegs:14,billow:.0022})}function j2(i=1){const t=lh([{x:.096,y:-.637,hw:.0056},{x:.117,y:-.6425,hw:.0124},{x:.136,y:-.6472,hw:.0122},{x:.147,y:-.65,hw:.0034}],{gap:.0014,halfT:.003,steps:18,radialSegs:12,billow:.0011});return i>0?t:Xs(t)}function Q2(i,{gap:t=.0056,cords:e=5,cordR:n=.0058,spread:s=.0258,steps:r=26,radialSegs:a=10,billow:o=.0022}={}){const l=[];for(let c=0;c<e;c++){const h=e===1?0:(c/(e-1)-.5)*2*s,f=i.map(d=>({x:d.x+h,y:d.y,hw:n}));l.push(lh(f,{gap:t,halfT:n,steps:r,radialSegs:a,widthPow:1,thickPow:1,billow:o}))}return ti(l)}function t_(){const i=[],r=h=>{const f=Math.max(0,Math.cos(h)),d=1+.01*Math.cos(h*12);return{px:Math.sin(h)*.073*d,pz:.0124-Math.cos(h)*.0624*d,front:f,yBot:-.3072-f*.0034,yTop:-.2422-f*.0052}},a=[],o=[];for(let h=0;h<=48;h++){const f=h/48*Math.PI*2,d=r(f),u=Math.sin(f),m=-Math.cos(f);a.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=1+.075*Math.max(0,p),M=.0076*(1+.2*d.front)*v,_=(d.yBot+d.yTop)*.5,T=(d.yTop-d.yBot)*.5,b=1+.03*Math.sin(x*10),E=Math.sign(g)*Math.pow(Math.abs(g),.7)*M*b,w=Math.sign(p)*Math.pow(Math.abs(p),.66)*T;return[d.px+u*E,_+w,d.pz+m*E]}),o.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=.0052;return[d.px+u*(v*g+.0022),d.yTop+p*v*.86,d.pz+m*(v*g+.0022)]})}i.push(Ze(a,20,{capStart:!1,capEnd:!1})),i.push(Ze(o,12,{capStart:!1,capEnd:!1}));const l=[{x:-.0452,y:-.286},{x:-.0492,y:-.326},{x:-.0518,y:-.368},{x:-.0528,y:-.41},{x:-.0522,y:-.446},{x:-.0502,y:-.4705}];i.push(Q2(l,{gap:.0054,cords:5,cordR:.0061,spread:.0212,steps:30,radialSegs:11,billow:.002}));const c=-.4705;for(let h=0;h<5;h++){const f=-.0502+(h-2)*.0106,d=ch(c,f)-.007,u=(h-2)*.0022,m=new Ii([new D(f,c-.0015,d+.0018),new D(f+u*.4,c-.0092,d+.0036),new D(f+u,c-.0168,d+.0054)]);i.push(new wn(m,5,.00162,6,!1))}return ti(i)}function e_(){return t_()}function Hu(i=.012,t=-7.5*Gi){const e=[];for(let s=0;s<=16;s++){const r=s/16,a=kt.lerp(-.81,-1.445,r),o=Math.sin(r*Math.PI)*.028,l=kt.lerp(.104,.128,r),c=kt.lerp(-.225,-.565,r)-o+i,h=r>.88,f=1+.098*Math.exp(-Math.pow((r-.04)/.19,2)),d=1+.072*Math.exp(-Math.pow((r-.47)/.15,2)),u=1+.086*Math.exp(-Math.pow((r-.73)/.15,2)),m=(kt.lerp(.0755,.0555,r)+(h?.0058:0))*f*d*u,x=(kt.lerp(.0815,.0635,r)+(h?.0062:0))*f*d*(1+(u-1)*1.35),g=Math.exp(-Math.pow((r-.52)/.09,2)),p=Math.exp(-Math.pow((r-.85)/.06,2));e.push(v=>{const M=Math.cos(v),_=Math.sin(v),T=_<-.65?Math.pow((-_-.65)/.35,1.45)*.012:0,b=_>.75?Math.pow((_-.75)/.25,1.6)*.005:0,E=g*Math.sin(r*55+M*2.5)*.0032+p*Math.cos(r*70)*.0028,w=M*(m+E),y=_*(x+E)-T+b,S=t*r,R=w*Math.cos(S)-y*Math.sin(S),L=w*Math.sin(S)+y*Math.cos(S);return[l+R,a,c+L]})}return Ze(e,18,{capStart:!0,capEnd:!0})}function Gu(i=.012,t=-7.5*Gi){const n=-.565+i,s=new te().makeRotationY(t),r=new te().makeTranslation(.128,0,n).multiply(s),a=[],o=[],l=[],c=[{y:-1.432,zc:.004,hw:.047,hl:.052},{y:-1.474,zc:-.008,hw:.049,hl:.062},{y:-1.51,zc:-.044,hw:.053,hl:.098},{y:-1.536,zc:-.084,hw:.056,hl:.134},{y:-1.556,zc:-.094,hw:.055,hl:.144}],h=[],f=12;for(let p=0;p<=f;p++){const v=p/f*(c.length-1),M=Math.min(c.length-2,Math.floor(v)),_=v-M,T=c[M],b=c[M+1],E=kt.lerp(T.y,b.y,_),w=kt.lerp(T.zc,b.zc,_),y=kt.lerp(T.hw,b.hw,_),S=kt.lerp(T.hl,b.hl,_);h.push(R=>{const L=Math.cos(R),P=Math.sin(R),U=L<0&&P>-.2&&P<.4?.005:0,O=Math.sign(L)*Math.pow(Math.abs(L),.84)*y+U,z=w+Math.sign(P)*Math.pow(Math.abs(P),.82)*S,V=Math.exp(-Math.pow((z+.162)/.008,2))*.0028;return[O,E+V,z]})}a.push(Kn(Ze(h,20,{capStart:!0,capEnd:!0}),r));const d=new ai(.046,.0075,7,16),u=r.clone().multiply(new te().makeTranslation(0,-1.452,.002).multiply(new te().makeRotationX(Math.PI*.5)));a.push(Kn(d,u));const m=[{y:-1.553,zc:-.094,hw:.0585,hl:.15},{y:-1.568,zc:-.094,hw:.06,hl:.152},{y:-1.578,zc:-.094,hw:.0585,hl:.15}].map(({y:p,zc:v,hw:M,hl:_})=>T=>{const b=Math.cos(T),E=Math.sin(T),w=Math.sin(T*18)*.0014;return[Math.sign(b)*Math.pow(Math.abs(b),.82)*(M+w),p,v+Math.sign(E)*Math.pow(Math.abs(E),.8)*(_+w)]});o.push(Kn(Ze(m,20,{capStart:!0,capEnd:!0}),r));const x=new Fe(.049,.05,.016,12);x.scale(1.02,1,.86);const g=r.clone().multiply(new te().makeTranslation(0,-1.582,.014));o.push(Kn(x,g));for(let p=0;p<4;p++){const v=-1.468-p*.0145,M=-.052-p*.023,_=.02+p*.0014,T=new Wr(new D(-_,v,M),new D(_,v-.005,M-.009)),b=new Wr(new D(_,v,M),new D(-_,v-.005,M-.009));o.push(Kn(new wn(T,1,.0028,5,!1),r)),o.push(Kn(new wn(b,1,.0028,5,!1),r));for(const E of[-1,1]){const w=new Fe(.0042,.0042,.003,7),y=r.clone().multiply(new te().makeTranslation(E*(_+.002),v,M).multiply(new te().makeRotationX(.55)));l.push(Kn(w,y))}}return{leatherGeo:ti(a),soleGeo:ti(o),eyeletGeo:ti(l)}}function n_(i){const t=new ie;t.name="vr-avatar-body";const e=[],n=[],s=Z2();e.push(J2());const r=K2(),a=Xs(r);e.push(r,a);for(const U of[-1,1])e.push(j2(U));for(const U of[-.496,-.59,-.684])for(const O of[-1,1]){const z=X2(O*.058,U,.0016),V=new Fe(.0122,.0128,.0062,14);n.push(Kn(V,z));const k=new ai(.0112,.0021,6,14),B=z.clone().multiply(new te().makeRotationX(Math.PI*.5)),q=B.clone().multiply(new te().makeTranslation(0,.0026,0));n.push(Kn(k,q));for(const Q of[-.0042,.0042]){const at=new Fe(.0012,.0012,.0042,6),dt=B.clone().multiply(new te().makeTranslation(Q,.0034,0).multiply(new te().makeRotationX(Math.PI*.5)));n.push(Kn(at,dt))}}const o=Hu(.012,-7.5*Gi),l=Hu(-.014,-6.5*Gi),c=Xs(l);l.dispose();const h=Gu(.012,-7.5*Gi),f=Gu(-.014,-6.5*Gi),d=Xs(f.leatherGeo),u=Xs(f.soleGeo),m=Xs(f.eyeletGeo);f.leatherGeo.dispose(),f.soleGeo.dispose(),f.eyeletGeo.dispose(),n.push(h.eyeletGeo,m);const x=ti(e),g=e_(),p=ti([o,c]),v=ti([h.leatherGeo,d]),M=ti([h.soleGeo,u]),_=ti(n),T=new Gt(s,i.sleeveMat),b=new Gt(x,i.sleeveFoldMat),E=W2(),w=new Gt(E,i.neckMat),y=new Gt(g,i.scarfMat),S=new Gt(p,i.trouserMat),R=new Gt(v,i.bootLeatherMat),L=new Gt(M,i.bootSoleMat),P=new Gt(_,i.hornButtonMat);return t.add(T,b,y,S,R,L,P),{bodyGroup:t,neckMesh:w,geos:[s,x,g,E,p,v,M,_]}}function Vu(i,t,{withBeacon:e=!1,initialSide:n="right"}={}){const s=new ie,r=new Gt(t.sleeveHeadGeo,i.sleeveMat);s.add(r);const a=new Gt(t.upperSleeveGeo,i.sleeveMat);s.add(a);const o=new ie;o.add(new Gt(t.elbowHingeGeo,i.sleeveMat));const l=new Gt(t.elbowCreaseGeo,i.sleeveFoldMat);l.rotation.x=Math.PI*.5,l.position.set(0,.0104,-.0012);const c=new Gt(t.elbowCreaseGeo,i.sleeveFoldMat);c.rotation.x=Math.PI*.5,c.position.set(0,-.0104,-8e-4),o.add(l,c),s.add(o);const h=new Gt(t.foreSleeveGeo,i.foreSleeveMat);s.add(h);const f=new ie;s.add(f);const d=new Gt(t.coatCuffHemGeo,i.sleeveFoldInnerMat);d.rotation.x=Math.PI*.5,d.scale.set(.92,1,1.08),d.position.set(0,4e-4,.0306),f.add(d);const u=new ie,m=new Gt(t.cuffTabGeo,i.sleeveFoldMat);m.scale.set(.862,1,1);const x=new Gt(t.cuffBtnGeo,i.hornButtonMat);x.scale.set(1,1,.86),x.rotation.z=Math.PI*.5,x.position.set(.0466,.0022,0),u.add(m,x),f.add(u);const g=new Gt(t.knitCuffGeo,i.cuffKnitMat);g.rotation.x=Math.PI*.5,g.scale.set(.94,1,1.06),g.position.set(0,4e-4,.0172),f.add(g);let p=null,v=null,M=null;if(e){p=new ie;const Ot=new Gt(t.strapGeo,i.strapMat);Ot.rotation.x=Math.PI*.5,Ot.scale.set(.92,1,1.08),Ot.position.set(0,4e-4,.004),p.add(Ot),v=new ie;const F=new Gt(t.miniScreenGeo,i.deviceCaseMat);v.add(F);const J=new Gt(t.ledDotGeo,i.ledGreenMat);J.position.set(0,.0026,-.0044),v.add(J);const j=new Gt(t.ledDotGeo,i.ledMagentaMat);j.position.set(0,.0026,.0044),v.add(j),p.add(v),M=new Gt(t.rivetGeo,i.hornButtonMat),p.add(M),f.add(p)}const _=new ie;s.add(_);const T=new ie;_.add(T);const b=new ie;b.scale.setScalar(1),T.add(b);const E=new Gt(t.wristBridgeGeo,i.gloveMat);b.add(E);const w=new Gt(t.gloveBindingGeo,i.seamMat);w.scale.set(1,.62,1),w.position.set(0,0,.0352),b.add(w);const y=new Gt(t.palmRightGeo,i.gloveMat);b.add(y);const S=new Gt(t.thenarRightGeo,i.palmInnerMat);b.add(S);const R=new Gt(t.wristSnapGeo,i.hornButtonMat);R.rotation.z=Math.PI*.5,b.add(R);const L=t.fingerTemplates.map(Ot=>{const F=new ie;F.add(new Gt(Ot.knuckleGeo,i.gloveMat)),F.add(new Gt(Ot.p1Geo,i.gloveMat));const J=new ie;J.position.set(0,0,-Ot.spec.l1),J.add(new Gt(Ot.pipGeo,i.gloveMat)),J.add(new Gt(Ot.p2Geo,i.gloveMat));const j=new ie;return j.position.set(0,0,-Ot.spec.l2),j.add(new Gt(Ot.dipGeo,i.gloveMat)),j.add(new Gt(Ot.p3Geo,i.gloveMat)),J.add(j),F.add(J),b.add(F),{spec:Ot.spec,mcp:F,pip:J,dip:j}}),P=new ie;P.add(new Gt(t.thumbMetaGeo,i.gloveMat));const U=new ie;U.position.set(0,4e-4,-.0248),U.add(new Gt(t.thumbProxGeo,i.gloveMat));const O=new ie;O.position.set(0,4e-4,-.0216),O.add(new Gt(t.thumbDistGeo,i.gloveMat)),U.add(O),P.add(U),b.add(P);let z=null;function V(Ot){const F=Ot==="left"?"left":"right";if(F===z)return;z=F;const J=F==="left"?-1:1;y.geometry=F==="left"?t.palmLeftGeo:t.palmRightGeo,S.geometry=F==="left"?t.thenarLeftGeo:t.thenarRightGeo,b.rotation.set(.05,J*.06,J*.24),R.position.set(J*.0302,.0022,.0268);for(const j of L)j.mcp.position.set(J*j.spec.baseX,j.spec.yOff,j.spec.zOff);P.position.set(-J*.0308,-.0088,-.0198),P.rotation.set(.05,J*.7,-J*.34),u.position.set(0,4e-4,.0306),u.rotation.set(0,0,J>0?-.34:Math.PI+.34),v&&M&&(v.position.set(-J*.005,.0527,.004),v.rotation.z=J*.12,M.position.set(J*.03,.0365,.004),M.rotation.z=-J*.712)}function k(Ot,F,J=0,j=0,rt=0){const st=z==="left"?-1:1;for(let ct=0;ct<L.length;ct++){const ft=L[ct],$t=J*Math.sin(j+ct*.9)*.16,xt=ct*.052,I=kt.clamp(Ot+xt+$t+rt,.03,1.35);ft.mcp.rotation.x=-I*.56,ft.pip.rotation.x=-I*.78,ft.dip.rotation.x=-I*.52,ft.mcp.rotation.y=-st*ft.spec.splay*F}const mt=kt.clamp(Ot*.7+rt*.45,.02,1);P.rotation.x=.05-mt*.15,P.rotation.y=st*(.7-mt*.13),U.rotation.x=-.06-mt*.22,O.rotation.x=-.035-mt*.235}const B=new D,q=new D,Q=new D,at=new D,dt=new D,Ct=new D,It=new D,$=new D,it=new D,gt=new D,Mt=new te,bt=new D(0,1,0);function Yt(Ot,F,J,j,rt=55,st=0,mt=0){_.position.copy(J),_.quaternion.set(j[0],j[1],j[2],j[3]),T.rotation.set(st,mt,0),B.copy(Ot).sub(F);const ct=Math.max(.08,B.length());a.position.copy(F).addScaledVector(B,.5),a.scale.set(1,ct,1),a.quaternion.setFromUnitVectors(bt,B.normalize()),r.quaternion.copy(a.quaternion),r.position.copy(Ot),o.position.copy(F),o.quaternion.copy(a.quaternion);const ft=.92+kt.clamp(rt/120,0,1)*.16;l.scale.set(.885*ft,ft,ft),c.scale.set(.885*ft*.97,ft*.97,ft*.97),q.copy(J).sub(F);const $t=Math.max(.1,q.length());q.divideScalar($t),It.copy(q).negate(),Q.set(0,1,0).applyQuaternion(_.quaternion),Ct.copy(Q).addScaledVector(It,-Q.dot(It)),Ct.lengthSq()<1e-4?(at.set(1,0,0).applyQuaternion(_.quaternion),dt.copy(at).addScaledVector(It,-at.dot(It)).normalize(),Ct.crossVectors(It,dt).normalize()):(Ct.normalize(),dt.crossVectors(Ct,It).normalize(),Ct.crossVectors(It,dt).normalize()),Mt.makeBasis(dt,Ct,It),f.position.copy(J),f.quaternion.setFromRotationMatrix(Mt),$.copy(J).addScaledVector(It,.036),B.copy(F).sub($);const xt=Math.max(.06,B.length());h.position.copy($).addScaledVector(B,.5),it.copy(B).normalize(),gt.crossVectors(dt,it).normalize(),Mt.makeBasis(dt,it,gt),h.quaternion.setFromRotationMatrix(Mt),h.scale.set(1,xt,1)}return V(n),k(.42,.36,0,0,0),{group:s,wristPivot:_,beaconBandGroup:p,setSide:V,getSide:()=>z,setFingerPose:k,applyJoints:Yt}}function i_(i="right"){const t=new ie;t.name="vr-gloved-hand",t.visible=!1;const e=H2(),n={gloveMat:new At({color:9730657,emissive:2300434,emissiveIntensity:.46,roughness:.73,metalness:.05,bumpMap:e.suedeBump,bumpScale:.0022}),palmInnerMat:new At({color:8810071,emissive:1445641,emissiveIntensity:.4,roughness:.84,metalness:.04,bumpMap:e.suedeBump,bumpScale:.0028}),seamMat:new At({color:11770496,emissive:2760727,emissiveIntensity:.45,roughness:.65,metalness:.06}),cuffKnitMat:new At({color:2503230,emissive:593428,emissiveIntensity:.42,roughness:.9,metalness:.03,bumpMap:e.knitBump,bumpScale:.0042}),sleeveMat:new At({color:2240577,emissive:527894,emissiveIntensity:.44,roughness:.87,metalness:.05,bumpMap:e.woolBump,bumpScale:.0042}),foreSleeveMat:new At({color:2240577,emissive:527894,emissiveIntensity:.44,roughness:.92,metalness:.03,bumpMap:e.woolBump,bumpScale:.0042,side:Oe}),neckMat:new At({color:9267791,emissive:1707783,emissiveIntensity:.22,roughness:.72,metalness:0}),sleeveFoldMat:new At({color:3228504,emissive:791583,emissiveIntensity:.45,roughness:.82,metalness:.07,bumpMap:e.woolBump,bumpScale:.0038}),sleeveFoldInnerMat:new At({color:3228504,emissive:791583,emissiveIntensity:.45,roughness:.88,metalness:.04,bumpMap:e.woolBump,bumpScale:.0038,side:Oe}),scarfMat:new At({color:7156534,emissive:1968908,emissiveIntensity:.44,roughness:.9,metalness:.02,bumpMap:e.knitBump,bumpScale:.006}),trouserMat:new At({color:4277839,emissive:1053464,emissiveIntensity:.42,roughness:.85,metalness:.04,bumpMap:e.trouserBump,bumpScale:.0042}),bootLeatherMat:new At({color:4927521,emissive:1313542,emissiveIntensity:.42,roughness:.44,metalness:.14,bumpMap:e.bootBump,bumpScale:.0034}),bootSoleMat:new At({color:1448221,emissive:329224,emissiveIntensity:.34,roughness:.86,metalness:.08}),hornButtonMat:new At({color:10189908,emissive:2497036,emissiveIntensity:.42,roughness:.34,metalness:.5}),strapMat:new At({color:3877922,emissive:1182728,emissiveIntensity:.4,roughness:.62,metalness:.16}),deviceCaseMat:new At({color:1119773,emissive:263946,emissiveIntensity:.35,roughness:.35,metalness:.35}),pipBrassMat:new At({color:14923896,emissive:7227417,emissiveIntensity:.55,roughness:.34,metalness:.58}),ledGreenMat:new Ke({color:55639}),ledMagentaMat:new Ke({color:14680214})},r=[{baseX:-.0328,yOff:.0015,zOff:-.0942,l1:.0368,l2:.0238,l3:.0158,w:.0186,splay:-.062},{baseX:-.0109,yOff:.0035,zOff:-.0994,l1:.0408,l2:.0262,l3:.0168,w:.0192,splay:-.014},{baseX:.0119,yOff:.002,zOff:-.0964,l1:.0378,l2:.0246,l3:.0158,w:.0184,splay:.03},{baseX:.0318,yOff:-.002,zOff:-.0882,l1:.0306,l2:.0196,l3:.0148,w:.0164,splay:.079}].map(B=>({spec:B,knuckleGeo:Ml(B.w*.52,.0116,1.07,1.04,.23),p1Geo:_l(B.w*.488,B.w*.448,B.l1,{curl:.185}),pipGeo:Ml(B.w*.452,.0096,1.045,.96,.14),p2Geo:_l(B.w*.432,B.w*.392,B.l2,{curl:.235,pleats:1}),dipGeo:Ml(B.w*.396,.008,1.03,.94,.09),p3Geo:_l(B.w*.376,B.w*.312,B.l3,{curl:.3,nail:!0,stitches:!1,pleats:1})})),a={sleeveHeadGeo:q2(.0505),upperSleeveGeo:Bu(.0478,.0505,{gather:.0042,oval:.885}),elbowHingeGeo:Y2(.0476),elbowCreaseGeo:new ai(.0474,.0034,6,22),foreSleeveGeo:Bu(.041,.047,{gather:.002,oval:.9}),coatCuffHemGeo:new Fe(.0462,.0478,.033,20),cuffTabGeo:new ai(.0528,.0032,8,26,Math.PI*.66),cuffBtnGeo:new Fe(.0055,.0055,.003,9),knitCuffGeo:new Fe(.0338,.0354,.052,18),strapGeo:new Fe(.0452,.0468,.0185,20),miniScreenGeo:new Yn(.031,.0045,.017),ledDotGeo:new or(.0022,6,5),rivetGeo:new Fe(.0034,.004,.0028,12),wristBridgeGeo:V2({rxHand:.024,ryHand:.0126,rxCuff:.0346,ryCuff:.0214}),gloveBindingGeo:new ai(.0342,.0024,8,26),palmRightGeo:zu(1),palmLeftGeo:zu(-1),thenarRightGeo:ku(1),thenarLeftGeo:ku(-1),wristSnapGeo:new Fe(.0034,.0036,.0026,10),fingerTemplates:r,thumbMetaGeo:yl({rBase:.0138,rTip:.0124,len:.0312,curl:.06,swell:.04,noseAt:.97}),thumbProxGeo:yl({rBase:.0126,rTip:.011,len:.0266,curl:.105,swell:.06,noseAt:.95}),thumbDistGeo:yl({rBase:.0114,rTip:.0092,len:.0226,curl:.13,swell:.05,nail:!0})},o=new ie;o.name="vr-body-root",t.add(o);const l=n_(n);o.add(l.bodyGroup),o.add(l.neckMesh);const c=Vu(n,a,{withBeacon:!1,initialSide:i==="left"?"right":"left"});o.add(c.group);const h=Vu(n,a,{withBeacon:!0,initialSide:i});t.add(h.group);let f=i==="left"?"left":"right",d=0,u=.3,m=.6,x=0,g=0,p=0,v=0;function M(B){const q=B==="left"?"left":"right";f=q,h.setSide(q),c.setSide(q==="left"?"right":"left")}const _=new D,T=new D,b=new D,E=new Ne().setFromEuler(new xn(-.86,.22,-.36,"YXZ")).toArray(),w=new Ne().setFromEuler(new xn(-.86,-.22,.36,"YXZ")).toArray();function y(B,q){const Q=q==="left"?-1:1;_.set(Q*.196,-.29,-.042),T.set(Q*.2335,-.4945,-.117),b.set(Q*.1915,-.631,-.256);const at=Q>0?E:w;B.setSide(q),B.applyJoints(_,T,b,at,46,0,0),B.setFingerPose(.5,.26,0,0,0)}M(i),y(c,f==="left"?"right":"left");const S=new D,R=new D,L=new D,P=new Ne,U=new Ne,O=new Ne,z=new Ne,V=new D(1,0,0),k=new D(0,1,0);return{group:t,bodyRoot:o,torsoGroup:l.bodyGroup,wristPivot:h.wristPivot,passiveWristPivot:c.wristPivot,setHandSide:M,getHandSide:()=>f,getBodyInfo:()=>{var B;return{visible:t.visible,torsoVisible:l.bodyGroup.visible,passiveArmSide:c.getSide(),activeArmSide:h.getSide(),beaconBandVisible:!!((B=h.beaconBandGroup)!=null&&B.visible)}},update(B,{visible:q=!1,handMode:Q=!0,handTracked:at=!0,handSide:dt=f,headLook:Ct=null,torsoYaw:It=null,shoulderPos:$=null,elbowPos:it=null,pos:gt={x:.16,y:-.22,z:-.5},vel:Mt={x:0,y:0,z:0},qArm:bt=[0,0,0,1],reach:Yt=.25,elbowBendDeg:Ot=60,overBin:F=!1,phase:J="search",calmLowerProgress:j=0,beaconActive:rt=!1}={}){if(t.visible=q,!q)return;const st=Math.min(.1,B||1/60);M(dt);const mt=f==="left"?-1:1;v+=st*1.45;const ct=Math.sin(v)*5e-4,ft=Number.isFinite(Ct==null?void 0:Ct.yaw)?Ct.yaw:0,$t=Number.isFinite(Ct==null?void 0:Ct.pitch)?Ct.pitch:0;Number.isFinite(It)?d=It:d=kt.clamp(d,ft-50*Gi,ft+50*Gi);const xt=ft-d;if(P.setFromAxisAngle(V,-$t),U.setFromAxisAngle(k,xt),O.copy(P).multiply(U),o.position.set(0,ct*.4,0),o.quaternion.copy(O),y(c,f==="left"?"right":"left"),h.beaconBandGroup&&(h.beaconBandGroup.visible=!!Q),!Q||!at){S.set(mt*.196,-.29,-.042).applyQuaternion(O),R.set(mt*.2335,-.4945,-.117).applyQuaternion(O),L.set(mt*.1915,-.631,-.256).applyQuaternion(O);const Pt=mt>0?E:w;z.set(Pt[0],Pt[1],Pt[2],Pt[3]).premultiply(O),h.applyJoints(S,R,L,z.toArray(),46,0,0),h.setFingerPose(.5,.26,0,0,0);return}L.set(gt.x,gt.y+ct,gt.z),$?S.set($.x,$.y,$.z):S.set(mt*.196,-.29,-.042),it?R.set(it.x,it.y+ct*.5,it.z):R.set(mt*.24,-.44,-.26);const A=kt.clamp(-Mt.y*.08,-.15,.15),W=kt.clamp(Mt.x*.07,-.13,.13),K=1-Math.exp(-st*16);g+=(A-g)*K,p+=(W-p)*K,h.applyJoints(S,R,L,bt,Ot,g,p);let lt=.28,Z=.58,Et=0;J==="search"?Yt>=.58&&F?(lt=.14,Z=1.05,Et=1,x+=st*9.5):gt.y<-.34?(lt=.48,Z=.32):gt.y>.1?(lt=.18,Z=.9):(lt=.32,Z=.52):J==="inspect"&&(lt=.2+j*.86,Z=(1-j)*.78+.15);const pt=1-Math.exp(-st*13);u+=(lt-u)*pt,m+=(Z-m)*pt,h.setFingerPose(u,m,Et,x,g*.85),j>.05?(n.pipBrassMat.emissive.setHex(8963184),n.pipBrassMat.emissiveIntensity=.6+j*.95):rt?(n.pipBrassMat.emissive.setHex(7121032),n.pipBrassMat.emissiveIntensity=.58):(n.pipBrassMat.emissive.setHex(7227417),n.pipBrassMat.emissiveIntensity=.45),n.ledGreenMat.color.setHex(rt?65382:1993533),n.ledMagentaMat.color.setHex(rt?16711850:7020114)},dispose(){for(const B of l.geos)B.dispose();for(const B of a.fingerTemplates)B.knuckleGeo.dispose(),B.p1Geo.dispose(),B.pipGeo.dispose(),B.p2Geo.dispose(),B.dipGeo.dispose(),B.p3Geo.dispose();for(const[B,q]of Object.entries(a))B!=="fingerTemplates"&&(q!=null&&q.dispose)&&q.dispose();for(const B of Object.values(e))B.dispose();for(const B of Object.values(n))B.dispose()}}}const Sn=pi(137);function Sl(i){i.updateWorldMatrix(!0,!0);const t=new te().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new te().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=fd(s,!1);if(r){const a=new Gt(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class s_{constructor(t){this.renderer=new kv({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=xf,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=qe,this.renderer.toneMapping=Fc,this.renderer.toneMappingExposure=1.12,this.scene=new dc,this.scene.background=new qt("#16222f"),this.scene.fog=new Yc("#1c2b3a",.0118),this.sky=k2(),this.scene.add(this.sky.group),this.camera=new sn(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new sn(62,1,.1,70),this.eyeR=new sn(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new D,this.baseCameraQuaternion=new Ne,this.lockedCameraQuaternion=new Ne,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null;const e=new _c(this.renderer),n=new Yv;this.envTarget=e.fromScene(n,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.15,n.dispose(),e.dispose(),this.hemi=new jh(9087958,1318439,1.12),this.scene.add(this.hemi);const s=new Ca(11127024,1.62);s.position.set(-6,11,2),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-6,s.shadow.camera.right=6,s.shadow.camera.top=7,s.shadow.camera.bottom=-6,s.shadow.normalBias=.012,s.shadow.bias=-25e-5,s.shadow.radius=3,this.scene.add(s),this.sun=s;const r=new Ca(5338012,.62);r.position.set(5,5,-4),this.scene.add(r),this.static=new ie,this.scene.add(this.static),Uu(.5),this.buildCourtyard(),Uu(1),Sl(this.static),this.bin=new ie,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new Gt(new fe(1,1),new Ke({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new ie,this.silhouetteMat=new Ke({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new ie,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2),this.vrHand=i_(),this.camera.add(this.vrHand.group),this.vrBodyActive=!1,this.vrHandMode=!1,this.handInspectHeadBase=null,this.itemBaseRot=[0,0,0],this.tossGroup=new ie,this.scene.add(this.tossGroup),this.tossState=null;const a=de((o,l)=>{const c=o.createRadialGradient(l/2,l/2,0,l/2,l/2,l/2);c.addColorStop(0,"rgba(3,7,11,.62)"),c.addColorStop(.55,"rgba(3,7,11,.34)"),c.addColorStop(1,"rgba(3,7,11,0)"),o.fillStyle=c,o.fillRect(0,0,l,l)},128);this.itemShadow=new Gt(new fe(1,1),new Ke({map:a,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new ao(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new ao(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new n2(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new ud,this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new ut,this.raycaster=new im,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",o=>{this.reduced=o.matches,o.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildCourtyard(){const t=new At({...Lu("courtyard-stone",[18,18]),normalScale:new ut(1.2,1.2),roughness:.7,metalness:.13,color:10133666});Ut(new fe(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new nd().load("./assets/plaster.jpg");e.colorSpace=qe,e.wrapS=e.wrapT=ci,e.repeat.set(3,3),e.anisotropy=4;const n=new At({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new At({color:8225402,roughness:.9}),a=new At({color:10724502,roughness:.84}),o=new At({color:2897456,roughness:.78}),l=new At({color:2436659,metalness:.32,roughness:.74}),c=de((p,v)=>{const M=p.createLinearGradient(0,0,v,v);M.addColorStop(0,"#788b91"),M.addColorStop(.48,"#495b60"),M.addColorStop(1,"#1d302c"),p.fillStyle=M,p.fillRect(0,0,v,v),p.save(),p.transform(1,.16,-.07,1,0,0);for(let T=-30;T<v;T+=94){p.fillStyle="#283b3a",p.fillRect(T,70,65,v);for(let b=94;b<v;b+=104)p.fillStyle="#83938b",p.globalAlpha=.24,p.fillRect(T+6,b,24,66),p.fillRect(T+34,b,24,66)}p.restore();const _=p.createLinearGradient(0,0,v,v*.8);_.addColorStop(0,"rgba(238,246,238,.20)"),_.addColorStop(.38,"rgba(238,246,238,.03)"),_.addColorStop(.62,"rgba(238,246,238,0)"),p.fillStyle=_,p.beginPath(),p.moveTo(0,v),p.lineTo(v*.52,0),p.lineTo(v*.78,0),p.lineTo(v*.24,v),p.closePath(),p.fill(),p.fillStyle="rgba(18,31,31,.55)",p.beginPath(),p.moveTo(0,82),p.lineTo(120,38),p.lineTo(150,38),p.lineTo(150,12),p.lineTo(178,12),p.lineTo(178,34),p.lineTo(335,66),p.lineTo(360,30),p.lineTo(386,30),p.lineTo(386,72),p.lineTo(512,96),p.lineTo(512,0),p.lineTo(0,0),p.closePath(),p.fill(),p.fillStyle="rgba(255,190,110,.5)";for(let T=0;T<24;T++)p.fillRect(28+T*67%470,150+T*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(p=>new At({color:p,map:c,metalness:.24,roughness:.28})),f=yd,d=(p,v,M,_,T)=>{const b=new ie;b.position.set(...M),b.rotation.y=_,this.static.add(b),H(b,[p,v,.65],[0,v/2,0],T,0),H(b,[p,.75,.78],[0,.375,.025],r,0);for(const w of[3.2,6.15,9.1,12.1])H(b,[p,.14,.87],[0,w,.055],a,0),H(b,[p,.07,.98],[0,w+.09,.08],r,0);H(b,[p,.35,1.06],[0,v-.12,.05],a,0),P2(b,p,v,_===0?0:_>0?37:73),Ou(b,p,v,l,a);let E=Math.floor(p/2.45);for(let w=0;w<E;w++)for(let y=0;y<4;y++){let S=(w-(E-1)/2)*2.47,R=1.72+y*2.95;if(_===0&&y===0&&Math.abs(S+3.8)<1.2)continue;const L=1.16,P=1.91;H(b,[L+.26,P+.27,.14],[S,R,.38],a,0),H(b,[L+.05,P+.06,.1],[S,R,.47],o,0);const U=hd(w,y,_===0?0:_>0?1:2),O=U==="lit"?f:h[(w+y)%h.length];H(b,[L,P,.04],[S,R,.54],O,0);for(const z of[-L/2,L/2,0])H(b,[.048,P,.09],[S+z,R,.58],r,0);for(const z of[-P/2,P/2,.24])H(b,[L,.047,.09],[S,R+z,.58],r,0);H(b,[L+.4,.12,.43],[S,R-P/2-.09,.55],a,0),vd(b,S,R,L,P,r,o,a),Md(b,S,R,L,P,U,a,O,(_>0?100:200)+y*10+w)}for(const w of[-p/2+.35,p/2-.38]){Ft(b,.07,.07,v,[w,v/2,.53],o,[0,0,0],12);for(let y=1;y<v;y+=2)Ft(b,.087,.087,.055,[w,y,.53],N.rust,[0,0,0],12)}for(let w=0;w<13;w++){const y=(Sn()-.5)*p,S=.8+Sn()*.3;H(b,[.2+Sn()*.7,.06+Sn()*.14,.02],[y,S,.335],r,0)}return b};d(20,14,[-8,0,1.5],Math.PI/2,s),d(20,14,[9,0,1.5],-Math.PI/2,n),d(20,13.5,[.5,0,11.6],Math.PI,n);const u=new ie;u.position.set(0,0,-7),this.static.add(u),B2(u,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:f,seed:101,gateX:1.55}),Ou(u,20,13.5,l,a);const m=new At({map:yc("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});H(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],N.black),Ut(new fe(.75,.55),m,this.static,[-2.75,2.5,-6.465]),H(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),H(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let p=0;p<6;p++)H(this.static,[.45,.025,.015],[4.1,1.65+p*.07,-6.415],N.black,0);Ft(this.static,.036,.036,18,[0,5.35,-6.48],N.rust,[0,0,Math.PI/2],12);for(let p=0;p<2;p++){const v=new Ii([new D(-8,9+p,2),new D(0,7.8+p,1),new D(9,9+p,-1)]);Ut(new wn(v,24,.012,4,!1),N.black,this.static)}for(const p of[-7.2,8.2])H(this.static,[.24,.17,22],[p,.065,0],r,.025);const x=new At({color:8350016,roughness:1,side:Oe});for(let p=0;p<50;p++){let v=(Sn()-.5)*13,M=(Sn()-.5)*14;Ut(new $i(.025+Sn()*.035,5),x,this.static,[v,.008,M],[-Math.PI/2,Sn()*3,Sn()*6])}const g=new At({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let p=0;p<10;p++)Ut(new $i(.55+Sn(),40),g,this.static,[(Sn()-.5)*10,.005,(Sn()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+Sn()*.45,1);this.buildProps(),L2(this.static,this.scene)}buildProps(){const t=this.static,e=new At({color:1647901,roughness:.64,metalness:.03,bumpMap:N.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of cd){const f=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([m,x])=>new ut(m*h*1.7,x*h*1.55)),d=new bo(f,64),u=d.attributes.position;for(let m=0;m<u.count;m++){const x=u.getX(m),g=u.getY(m),p=u.getZ(m),v=Math.atan2(p,x),M=1+.08*Math.sin(v*13+g*12)+.045*Math.sin(v*21-g*7);u.setXYZ(m,x*M,g,p*M)}d.computeVertexNormals(),Ut(d,e,t,[l,.02,c]),be(t,.066*h,.018,[l,h*1.66,c],N.black,[Math.PI/2,0,0]);for(let m=0;m<3;m++)H(t,[.042,.16,.027],[l+Math.sin(m*2)*.04,h*1.84,c+Math.cos(m*2)*.035],e,.006,[.2,m*2,.23])}const n=new ie;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){be(n,.48,.038,[l,0,0],N.black),be(n,.44,.014,[l,0,0],N.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const f=new D(l,0,0),d=new D(l+Math.cos(h)*.44,Math.sin(h)*.44,0),u=new Wr(f,d);Ut(new wn(u,1,.004,3),N.silver,n)}}const s=(l,c)=>{const h=new D(...l),f=new D(...c);Ut(new wn(new Wr(h,f),1,.025,6),N.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);H(n,[.32,.07,.16],[-.23,.72,0],N.black),H(n,[.3,.035,.04],[.57,.86,0],N.silver);const r=new At({color:8090716,roughness:1});H(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)H(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],N.black,0);const a=vl("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=vl("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new At({...Lu("steel-paint"),normalScale:new ut(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new At({color:2505773,roughness:.58,metalness:.06,bumpMap:N.leather.bumpMap,bumpScale:.007}),r=new Yn(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let u=0;u<a.count;u++){let m=a.getY(u);const x=.9+(m+.8)*.0625;a.setX(u,a.getX(u)*x),a.setZ(u,a.getZ(u)*x),Math.abs(a.getZ(u))>.7&&a.setZ(u,a.getZ(u)+-.026*Math.exp(-((a.getX(u)-.35)**2+(m-.1)**2)*9))}r.computeVertexNormals(),Ut(r,e,t,[0,1.22,0]),H(t,[2.68,.105,1.83],[0,2.02,0],n,.035),H(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const u of[-1.08,1.08])H(t,[.055,1.51,.05],[u,1.2,.812],n,.008),H(t,[.055,1.5,.05],[u,1.2,-.813],n,.008);for(const u of[-.69,.69])H(t,[.044,1.22,.054],[u,1.26,.849],n,.008),H(t,[.044,1.22,.054],[u,1.26,-.849],n,.008);for(const u of[-1.275,1.275])H(t,[.06,.065,1.25],[u,1.65,0],n),H(t,[.065,1.3,.05],[u,1.23,.5],n),H(t,[.065,1.3,.05],[u,1.23,-.5],n),H(t,[.19,.18,.7],[u,1.7,0],n),H(t,[.06,.08,.6],[u*1.11,1.7,0],N.silver);for(const u of[-.95,.95])for(const m of[-.58,.58])H(t,[.15,.19,.12],[u,.35,m],N.silver),Ft(t,.18,.18,.15,[u,.19,m],N.black,[0,0,Math.PI/2],28),Ft(t,.067,.067,.16,[u,.19,m],N.silver,[0,0,Math.PI/2],24);this.lid=new ie,this.lid.position.set(0,2.08,-.92),t.add(this.lid),H(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let u=-4;u<=4;u++)H(this.lid,[.065,.07,1.66],[u*.27,.11,.94],n,.026);H(this.lid,[.65,.09,.1],[0,.045,1.99],N.black,.025);for(const u of[-.87,.87])Ft(t,.095,.095,.31,[u,2.06,-.93],N.silver,[0,0,Math.PI/2]);const o=de((u,m,x)=>{u.fillStyle="#cac9ad",u.textAlign="center",u.font="bold 110px Arial",u.fillText("Т Б О",m/2,220),u.font="bold 82px Arial",u.fillText("№ 017",m/2,347),u.globalCompositeOperation="destination-out";for(let g=0;g<1600;g++)u.globalAlpha=x()*.7,u.fillRect(x()*m,x()*m,1+x()*4,1+x()*3)}),l=new At({map:o,transparent:!0,depthWrite:!1,roughness:.9});Ut(new fe(.73,.56),l,t,[.62,1.31,.865]);const c=new At({map:yc("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});Ut(new fe(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=de((u,m)=>{u.fillStyle="#d3cdb5",u.fillRect(0,0,m,m),u.fillStyle="#93493c";for(let x=-m;x<m*2;x+=130)u.beginPath(),u.moveTo(x,0),u.lineTo(x+64,0),u.lineTo(x+m+64,m),u.lineTo(x+m,m),u.fill();fn(u,m,m,pi(25),5e3)}),f=new At({map:h,roughness:.75});for(const u of[-1.1,1.1])Ut(new fe(.16,.53),f,t,[u,1.33,.847]);const d=de((u,m)=>{const x=u.createRadialGradient(m/2,m/2,0,m/2,m/2,m*.48);x.addColorStop(0,"rgba(0,8,4,.8)"),x.addColorStop(.5,"rgba(0,8,4,.5)"),x.addColorStop(1,"rgba(0,8,4,0)"),u.fillStyle=x,u.fillRect(0,0,m,m)},128);Ut(new fe(4.5,3.5),new Ke({map:d,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),O2(t,this.lid),t.remove(this.lid),Sl(t),Sl(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=kt.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=kt.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=kt.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var c;this.dirty=!0;const t=innerWidth,e=innerHeight;this.renderer.setSize(t,e),this.camera.aspect=t/e;const n=t/e<.8;this.camera.fov=n?52:43;const s=!n&&e<=520&&t>650,r=!n&&!s&&t>1050;if(this.camera.position.set(s?4.15:r?4.3:n?2.6:4.2,s?2.65:r?3.4:n?3.5:3.55,s?8.1:r?7.4:n?10.3:7.8),this.camera.lookAt(s?.25:r?.6:n?.9:0,s?1.32:r?2.65:n?2.6:2.4,0),this.viewOverride){const{fov:h=this.camera.fov,position:f,target:d}=this.viewOverride;this.camera.fov=h,f&&this.camera.position.set(...f),d&&this.camera.lookAt(...d)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=n;const a=getComputedStyle(document.documentElement);if(this.stage=Xv(t,e,parseFloat(a.getPropertyValue("--safe-top"))||0,parseFloat(a.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const h=Math.min(t/2,e)*.72;this.stage={x:(t/2-h)/2,y:(e-h)/2,width:h,height:h}}const o=2*4.2*Math.tan(kt.degToRad(this.camera.fov/2))/e;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-t/2)*o,(e/2-this.stage.y-this.stage.height/2)*o,-4.2);const l=this.vrStereo?62:this.camera.fov;this.inspectionVeil.scale.set(12*Math.tan(kt.degToRad(l/2))*t/e,12*Math.tan(kt.degToRad(l/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(c=this.pipeline)==null||c.resize(t,e,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new Xn(new D(...t.min),new D(...t.max));e.applyMatrix4(new te().makeRotationFromQuaternion(this.item.quaternion));const n=e.getSize(new D).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(kt.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):Cu(n,this.stage,innerHeight,this.camera.fov,4.2,innerWidth),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new Xn(new D(...t.min),new D(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new D(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*innerWidth/2,y:(1-o.y)*innerHeight/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,!this.vrBodyActive&&this.vrHand&&(this.vrHand.group.visible=!1)),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,innerWidth,innerHeight),this.applyCameraPose(),this.resize(),this.item&&this.applyReveal(),this.dirty=!0}setVrBodyActive(t){this.vrBodyActive=!!t,!t&&this.vrHand&&(this.vrHand.group.visible=!1),this.dirty=!0}setVrHandMode(t){this.vrHandMode=!!t,t||(!this.vrBodyActive&&this.vrHand&&(this.vrHand.group.visible=!1),this.pose==="hand"&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null,this.pose="free")),t&&this.vrInspectLock&&this.unlockInspectionView(),this.dirty=!0}updateVrHand(t,e){if(!this.vrHand)return;const n=!!(this.vrBodyActive&&(e!=null&&e.visible));this.vrHand.update(t,{...e,handMode:this.vrHandMode,visible:n}),n&&(this.dirty=!0)}handHitsBin(){var s,r;if(!this.vrHandMode||!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible))return this.gazeHitsBin();this.camera.updateMatrixWorld(!0),this.vrHand.wristPivot.updateMatrixWorld(!0);const e=this.vrHand.wristPivot.localToWorld(new D(0,0,-.15)).clone().sub(this.camera.position).normalize();if(this.raycaster.set(this.camera.position,e),this.raycaster.intersectObject(this.bin,!0).length>0)return!0;const n=new D(0,1.25,0).sub(this.camera.position).normalize();return e.angleTo(n)<=.44}setHandItemRotation(t=0,e=0,n=0,s=null){if(!this.item)return;const[r,a,o]=this.itemBaseRot||[0,0,0];if(this.targetX=r+t,this.targetY=a+e,this.targetZ=o+n,Array.isArray(s)&&s.length===4){const l=new Ne(s[0],s[1],s[2],s[3]);this.targetItemQuat=l.multiply(this.itemBaseQuat||new Ne)}else this.targetItemQuat=null;this.pose="hand",this.dirty=!0}launchDiscardToss(t={x:4.5,y:2.4,z:-6.5}){if(!this.item||this.reduced)return;this.camera.updateMatrixWorld(!0),this.item.updateMatrixWorld(!0);const e=new D,n=new Ne,s=new D;this.item.matrixWorld.decompose(e,n,s);const r=this.item.clone(!0);r.remove(this.silhouette),r.matrixAutoUpdate=!0,r.position.copy(e),r.quaternion.copy(n),r.scale.copy(s),this.tossGroup.clear(),this.tossGroup.add(r);const a=new D(t.x??4.5,t.y??2.4,t.z??-6.5).applyQuaternion(this.camera.quaternion);this.tossState={mesh:r,t:0,dur:.42,vx:a.x,vy:a.y,vz:a.z},this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&!this.vrHandMode&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=kt.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=kt.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else if(this.applyCameraPose(),this.vrStereo&&this.vrHandMode&&this.inspect&&this.handInspectHeadBase){const n=kt.euclideanModulo(this.headLook.yaw-this.handInspectHeadBase.yaw+Math.PI,Math.PI*2)-Math.PI,s=this.headLook.pitch-this.handInspectHeadBase.pitch;this.itemAnchor.position.set(kt.clamp(-n*2.4,-.95,.95),kt.clamp(-s*2.4,-.7,.7),-4.2),this.updateItemLights()}return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.vrHandMode?this.vrInfo():(this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo())}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=innerWidth,e=innerHeight){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new D(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=innerWidth,e=innerHeight,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){var e,n,s,r,a,o,l,c,h;const t=kt.radToDeg;return{stereo:!!this.vrStereo,bodyActive:!!this.vrBodyActive,body:((n=(e=this.vrHand)==null?void 0:e.getBodyInfo)==null?void 0:n.call(e))||null,handMode:!!this.vrHandMode,handSide:((r=(s=this.vrHand)==null?void 0:s.getHandSide)==null?void 0:r.call(s))||"right",handVisible:!!((o=(a=this.vrHand)==null?void 0:a.group)!=null&&o.visible),handPosition:((h=(c=(l=this.vrHand)==null?void 0:l.wristPivot)==null?void 0:c.position)==null?void 0:h.toArray().map(f=>+f.toFixed(3)))||null,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),targetZ:+t(this.targetZ||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(f=>+f.toFixed(5))}}hitBin(t,e){return this.pointer.set(t/innerWidth*2-1,-e/innerHeight*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}binScreen(){this.camera.updateMatrixWorld(!0);const t=new D(0,1.2,0).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new D(-1.26,1.12,.22).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,vl(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.vrStereo||(this.headLook={yaw:0,pitch:0}),this.handInspectHeadBase={...this.headLook},this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=Qn[t].lamp??17,this.itemRim.intensity=Qn[t].rim??18,this.updateItemLights(),this.item.rotation.set(...Qn[t].rotation),this.itemBaseRot=[...Qn[t].rotation],this.itemBaseQuat=this.item.quaternion.clone(),this.targetItemQuat=null,this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new Gt(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&!this.vrHandMode&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.handInspectHeadBase=null,this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=Ru(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=Qn[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=qv(this.itemId,t),this.targetItemQuat=null,this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=kt.clamp(Math.round((this.zoom+t)*100)/100,oo.min,oo.max),this.dirty=!0,this.zoom}rotate(t,e){this.targetItemQuat&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null),this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=kt.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.5)),this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new dc;o.background=new qt("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new jh(15069183,8288624,1.1));const l=new Ca(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new Ca(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new Tn(160,160,{type:ui}),f=new Tn(160,160,{depthBuffer:!1}),d=this.renderer.getRenderTarget(),u=this.renderer.getClearColor(new qt),m=this.renderer.getClearAlpha();let x;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...Qn[t].rotation),e.scale.setScalar(1);const g=e.userData.bounds,p=new Xn(new D(...g.min),new D(...g.max));p.applyMatrix4(new te().makeRotationFromEuler(e.rotation));const v=p.getSize(new D).multiplyScalar(.5);e.scale.setScalar(Cu(v,{x:8,y:12,width:144,height:136},160,34));const M=new sn(34,1,.1,20);M.position.set(0,0,4.2),M.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,M),this.thumbnailOutput.render(this.renderer,f,h);const _=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(f,0,0,160,160,_);const T=document.createElement("canvas");T.width=T.height=160;const b=T.getContext("2d"),E=b.createImageData(160,160);for(let w=0;w<160;w++)E.data.set(_.subarray((159-w)*640,(160-w)*640),w*640);b.putImageData(E,0,0),x=T.toDataURL("image/png"),this.thumbCache.set(t,x)}finally{this.renderer.setRenderTarget(d),this.renderer.setClearColor(u,m),f.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return x}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.tossState){const n=this.tossState;n.t+=t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.vy-=14*t,n.mesh.rotation.x+=t*9,n.mesh.rotation.z-=t*7,n.mesh.scale.multiplyScalar(Math.max(.82,1-t*2.2)),this.dirty=!0,n.t>=n.dur&&(this.tossGroup.clear(),this.tossState=null)}if(this.item){const n=this.item.quaternion.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.pose==="hand"&&this.targetItemQuat?this.item.quaternion.slerp(this.targetItemQuat,s):(this.item.rotation.y=kt.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=kt.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=kt.lerp(this.item.rotation.z,this.targetZ,s)),n.angleTo(this.item.quaternion)>1e-4&&this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/Hv),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||Ru(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const gn=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],wd={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},Td="white-night-finds-v1";function Zr(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>gn.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>gn.some(e=>e.id===t)).slice(0,3):[]}}function r_(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*gn.reduce((e,n)=>e+n.weight,0);return gn.find(e=>(t-=e.weight)<0)??gn.at(-1)}function Co(i,t){if(t.type==="reset")return Zr();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=gn.some(n=>n.id===t.itemId)?t.itemId:gn[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function a_(i){try{const t=JSON.parse(i.getItem(Td)||"{}");return Zr((t==null?void 0:t.version)===1?t:{})}catch{return Zr()}}function o_(i,t){try{return i.setItem(Td,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const yi=Math.PI/180,l_=new Ne(-Math.sqrt(.5),0,0,Math.sqrt(.5)),Wu=new D(0,1,0),c_=new D(0,0,1);class h_{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new Ne,this.basePitch=0,this.qNow=new Ne,this.qScreen=new Ne,this.relQ=new Ne,this.fwdVec=new D,this.upVec=new D,this.euler=new xn(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){if(!Number.isFinite(t)){const r=e*yi,a=n*yi,o=s*yi,l=-Math.cos(r)*Math.sin(a),c=Math.sin(r),h=Math.cos(r)*Math.cos(a),f=Math.cos(o),d=Math.sin(o);return this.upVec.set(l*f-c*d,l*d+c*f,h).normalize(),this.qNow.setFromUnitVectors(this.upVec,Wu)}return this.euler.set(e*yi,t*yi,-n*yi,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(l_),this.qScreen.setFromAxisAngle(c_,-s*yi),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.fwdVec.set(0,0,-1).applyQuaternion(this.qNow);const o=Math.hypot(this.fwdVec.x,this.fwdVec.z)>1e-4?Math.atan2(this.fwdVec.x,-this.fwdVec.z):0;this.baseQ.setFromAxisAngle(Wu,-o),this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.basePitch=this.euler.x,this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x-this.basePitch},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/yi).toFixed(2),pitchDeg:+(this.raw.pitch/yi).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Hn=Math.PI/180,Jn=(i,t,e)=>Math.min(e,Math.max(t,i)),ki=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},u_=1.5,f_=.5,d_=.14,p_=.05,m_=9,g_=.3,x_=.75,v_=3,Xu=20*Hn,qu=15*Hn,Yu=6*Hn,__=.35,M_=3,y_=.6,$u=1.2,Zu=.8,Ju=12*Hn;class S_{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-68,pitchMaxDeg:n=62}={}){this.yawLimit=Math.abs(t)*Hn,this.pitchMin=Math.min(e,n)*Hn,this.pitchMax=Math.max(e,n)*Hn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=Jn(t,-this.yawLimit,this.yawLimit),this.pitch=Jn(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=Jn(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>M_&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=y_?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=Jn(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=Jn(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=ki(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=Jn(m_*Math.max(e,1/60),g_,x_);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(ki(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=v_&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(ki(t.yaw-this.yaw))>Xu||Math.abs(t.pitch-this.pitch)>qu,s=!this.anchorTrack||Math.abs(ki(t.yaw-this.anchorTrack.yaw))>Xu||Math.abs(t.pitch-this.anchorTrack.pitch)>qu;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(ki(t.yaw-this.anchorCandidate.yaw))<=Yu&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=Yu?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=__?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(ki(t.yaw-e.yaw))<=Ju&&Math.abs(t.pitch-e.pitch)<=Ju}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=Jn(ki(t.yaw-this.yaw)*n,-$u*e,$u*e),this.pitch+=Jn((t.pitch-this.pitch)*n,-Zu*e,Zu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?u_:f_,r=n?d_:p_,a=1-Math.exp(-s*e);this.yaw+=Jn(ki(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=Jn((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Hn).toFixed(2),pitchDeg:+(this.pitch/Hn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Hn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Hn).toFixed(2)}:null}}}const kn=Math.PI/180,Va=240,Wa=180,b_=62,w_=48,T_=.15,E_=.3,A_=900,R_=120,Ku=(i,t,e)=>Math.min(e,Math.max(t,i));function ho(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function C_(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,f=-1e9,d=0,u=0,m=0;for(let v=0;v<e;v++)for(let M=0;M<t;M++){const _=(v*t+M)*4,{hue:T,sat:b,val:E,chroma:w}=ho(i[_],i[_+1],i[_+2]);if(T<0)continue;let y=Math.abs(T-n);if(y>180&&(y=360-y),y>30||b<14||E<40||w<40)continue;m++,b>d&&(d=b),w>u&&(u=w);const S=(1-y/30)*(b/100);s+=M*S,r+=v*S,a+=S,o++,M<l&&(l=M),M>c&&(c=M),v<h&&(h=v),v>f&&(f=v)}if(o<15||a<=0)return{found:!1,bright:m,n:o};const x=c-l+1,g=f-h+1,p=o/Math.max(1,x*g);return x>t*.75||g>e*.75?{found:!1,bright:m,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:m,n:o,bbW:x,bbH:g,fill:p,maxSat:d,maxChroma:u,minX:l,maxX:c,minY:h,maxY:f}}function P_(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function ju(i,t,e){return{yaw:-(i-e.x)*b_*kn,pitch:(t-e.y)*w_*kn}}function I_(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class L_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=Va,this.canvas.height=Wa),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<R_)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,Va,Wa);const n=this.ctx.getImageData(0,0,Va,Wa);return this.processImageData(n.data,Va,Wa,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,f,d,u;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let m=0;m<2;m++){const x=this.markers[m],g=C_(t,e,n,this.defs[m].hue),p=((f=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:f[m])||null;if(x.hue=this.defs[m].hue,x.blob=g,x.found=!!g.found,x.shapeOk=I_(g,p,e,n),g.found){x.u=g.cx/Math.max(1,e),x.v=g.cy/Math.max(1,n),x.raw=ju(x.u,x.v,o);const v=(u=(d=this.calibration)==null?void 0:d.baseRaw)==null?void 0:u[m];x.delta=v?{yaw:x.raw.yaw-v.yaw,pitch:x.raw.pitch-v.pitch}:{...x.raw}}this.updateEntity(x,g.found&&x.shapeOk,s),x.usable=!!g.found&&x.entity&&x.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=T_*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=E_*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/kn;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/kn,(t.delta.pitch-e.delta.pitch)/kn);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,f)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(f.delta.yaw-l.yaw,f.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*kn;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*kn){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*kn){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>ju(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/kn;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>A_?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){var _,T;if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=((_=this.video)==null?void 0:_.videoWidth)||r,l=((T=this.video)==null?void 0:T.videoHeight)||a,c=o/Math.max(1,l),h=n.width/n.height;let f=n.width,d=n.height,u=0,m=0;c>h+.001?(d=n.width/c,m=(n.height-d)*.5):c<h-.001&&(f=n.height*c,u=(n.width-f)*.5);const x=(t-n.left-u)/Math.max(1,f),g=(e-n.top-m)/Math.max(1,d);if(x<0||x>1||g<0||g>1)return null;const p=Ku(Math.round(x*(r-1)),0,r-1),v=Ku(Math.round(g*(a-1)),0,a-1);let M=null;for(let b=Math.max(0,v-4);b<=Math.min(a-1,v+4);b++)for(let E=Math.max(0,p-4);E<=Math.min(r-1,p+4);E++){const w=(b*r+E)*4,y=ho(s[w],s[w+1],s[w+2]);y.hue>=0&&(!M||y.chroma>M.chroma)&&(M=y)}return M?{hue:M.hue,sat:M.sat,val:M.val,chroma:M.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(m=>m.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=P_(a),h=Math.round((s.u??.5)*e),f=Math.round((s.v??.5)*n),d=Math.max(4,Math.round(s.w??56)),u=Math.max(4,Math.round(s.h??28));for(let m=Math.max(0,f-Math.floor(u/2));m<Math.min(n,f+Math.ceil(u/2));m++)for(let x=Math.max(0,h-Math.floor(d/2));x<Math.min(e,h+Math.ceil(d/2));x++){const g=(m*e+x)*4;t[g]=o,t[g+1]=l,t[g+2]=c,t[g+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/kn).toFixed(2),pitchDeg:+(e.pitch/kn).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const Xa=Math.PI/180;class D_{constructor(t=null){this.gyro=new h_,this.fusion=new S_,this.tracker=new L_(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/Xa).toFixed(2),pitchDeg:+(this.look.pitch/Xa).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/Xa).toFixed(2),pitchDeg:+(this.markerSample.pitch/Xa).toFixed(2)}}}}const U_=Math.PI/180;class N_{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/U_,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const ss=200,rs=150,F_=90,Si=8,as=6,O_=400;function Qu(i,t){const e=Math.abs(i-t)%360;return e>180?360-e:e}function tf(i,t,e,n,s=34){const r=t/Si,a=e/as,o=new Float64Array(Si*as),l=new Float64Array(Si*as),c=new Float64Array(Si*as);for(let O=0;O<e;O++){const z=Math.min(as-1,O/a|0),V=O*t*4;for(let k=0;k<t;k++){const B=V+k*4,q=i[B],Q=i[B+1],at=i[B+2],{hue:dt,sat:Ct,val:It,chroma:$}=ho(q,Q,at);if(dt<0||It<72)continue;const it=It>=205?20:36,gt=It>=205?34:52;if(Ct<it||$<gt)continue;const Mt=Qu(dt,n);if(Mt>s)continue;const bt=(1-Mt/(s+1))*(.35+Ct/100*.65)*Math.pow(It/255,1.35),Yt=z*Si+Math.min(Si-1,k/r|0);o[Yt]+=bt,l[Yt]+=k*bt,c[Yt]+=O*bt}}let h=0,f=t*.5,d=e*.5;for(let O=0;O<as;O++)for(let z=0;z<Si;z++){let V=0,k=0,B=0;for(let q=0;q<=1&&O+q<as;q++)for(let Q=0;Q<=1&&z+Q<Si;Q++){const at=(O+q)*Si+(z+Q);V+=o[at],k+=l[at],B+=c[at]}V>h&&(h=V,f=k/V,d=B/V)}if(h<1.2)return{found:!1,count:0};const u=Math.max(22,Math.round(Math.min(t,e)*.24)),m=Math.max(0,Math.floor(f-u)),x=Math.min(t-1,Math.ceil(f+u)),g=Math.max(0,Math.floor(d-u)),p=Math.min(e-1,Math.ceil(d+u));let v=0,M=0,_=0,T=0,b=t,E=-1,w=e,y=-1;for(let O=g;O<=p;O++){const z=O*t*4;for(let V=m;V<=x;V++){if(Math.hypot(V-f,O-d)>u)continue;const k=z+V*4,B=i[k],q=i[k+1],Q=i[k+2],{hue:at,sat:dt,val:Ct,chroma:It}=ho(B,q,Q);if(at<0||Ct<72)continue;const $=Ct>=205?20:36,it=Ct>=205?34:52;if(dt<$||It<it)continue;const gt=Qu(at,n);if(gt>s)continue;const Mt=(1-gt/(s+1))*(.35+dt/100*.65)*(Ct/255);v+=V*Mt,M+=O*Mt,_+=Mt,T++,V<b&&(b=V),V>E&&(E=V),O<w&&(w=O),O>y&&(y=O)}}if(T<7||_<=0)return{found:!1,count:0};const S=E-b+1,R=y-w+1,L=T/Math.max(1,S*R);if(S>t*.45||R>e*.45||L<.25)return{found:!1,count:0};const P=v/_,U=M/_;return{found:!0,count:T,u:(P+.5)/t,v:(U+.5)/e,bbW:S,bbH:R,fill:L}}class z_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.synthetic=!1,this.error=null,this.distalHue=144,this.proximalHue=320,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=ss,this.canvas.height=rs),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastProcessAt=0,this.processMs=0,this.lastPairAt=-1e4,this.lastPairPos={u:.5,v:.55,spanNorm:.12},this.latest={status:"none",u:.5,v:.55,spanNorm:0,rollRad:0,distalFound:!1,proximalFound:!1,ts:0}}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}this.video&&this.video.srcObject&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}analyzeRgba(t,e=ss,n=rs,s=performance.now(),r=n/e){const a=tf(t,e,n,this.distalHue),o=tf(t,e,n,this.proximalHue);return this._commitSpots(a,o,e,n,s,r)}_commitSpots(t,e,n,s,r,a=s/n){const o=Number.isFinite(a)&&a>.1?a:s/n,l=1.25/Math.hypot(1,o);if(t.found&&e.found){const h=(t.u-e.u)*l,f=(t.v-e.v)*o*l,d=Math.hypot(h,f),u=Math.max(1,t.count||1),m=Math.max(1,e.count||1),x=Math.max(u/m,m/u);if(d>=.018&&d<=.58&&x<=9){const g=(t.u+e.u)*.5,p=(t.v+e.v)*.5;return this.lastPairAt=r,this.lastPairPos={u:g,v:p,spanNorm:d},this.latest={status:"pair",u:g,v:p,spanNorm:d,rollRad:Math.atan2(-f,h),distalFound:!0,proximalFound:!0,ts:r},this.latest}}const c=t.found?t:e.found?e:null;return c&&r-this.lastPairAt<=O_&&Math.hypot(c.u-this.lastPairPos.u,c.v-this.lastPairPos.v)<=.2?(this.latest={status:"single",u:c.u,v:c.v,spanNorm:this.lastPairPos.spanNorm,rollRad:this.latest.rollRad,distalFound:!!t.found,proximalFound:!!e.found,ts:r},this.latest):(this.latest={...this.latest,status:"none",distalFound:!1,proximalFound:!1},this.latest)}process(t=!1,e=performance.now()){if(this.synthetic)return this.latest;if(!this.running||!this.video||!this.ctx||this.video.readyState<2)return this.latest;if(!t&&e-this.lastProcessAt<F_)return this.latest;const n=performance.now();this.lastProcessAt=e;try{const s=this.video.videoWidth||ss,r=this.video.videoHeight||rs;this.ctx.drawImage(this.video,0,0,ss,rs);const a=this.ctx.getImageData(0,0,ss,rs);this.analyzeRgba(a.data,ss,rs,e,r/s)}catch{}return this.processMs=+(performance.now()-n).toFixed(2),this.latest}inject({distal:t=null,proximal:e=null}={},n=performance.now()){this.synthetic=!0,this.running=!0;const s=t?{found:!0,u:t.u,v:t.v,count:t.count??90}:{found:!1,count:0},r=e?{found:!0,u:e.u,v:e.v,count:e.count??90}:{found:!1,count:0};return this._commitSpots(s,r,ss,rs,n)}sample(t=performance.now()){const e=this.latest.ts?t-this.latest.ts:1/0;return{...this.latest,fresh:e<=450&&this.latest.status!=="none",ageMs:Number.isFinite(e)?Math.round(e):null}}info(){const t=this.sample();return{running:this.running,synthetic:this.synthetic,error:this.error,status:t.status,fresh:t.fresh,u:+t.u.toFixed(3),v:+t.v.toFixed(3),spanNorm:+t.spanNorm.toFixed(4),rollDeg:+(t.rollRad*180/Math.PI).toFixed(1),distalFound:t.distalFound,proximalFound:t.proximalFound,processMs:this.processMs}}}const pe=Math.PI/180,Ti=180/Math.PI,bc=.33,wc=.31;function se(i,t,e){return i<t?t:i>e?e:i}function pn([i,t,e,n]){const s=Math.hypot(i,t,e,n);return s<1e-9?[0,0,0,1]:[i/s,t/s,e/s,n/s]}function bi([i,t,e,n]){return[-i,-t,-e,n]}function Xe(i,t){const[e,n,s,r]=i,[a,o,l,c]=t;return[r*a+e*c+n*l-s*o,r*o-e*l+n*c+s*a,r*l+e*o-n*a+s*c,r*c-e*a-n*o-s*l]}function Ws([i,t,e],n){const s=Math.hypot(i,t,e);if(s<1e-9)return[0,0,0,1];const r=n*.5,a=Math.sin(r)/s;return[i*a,t*a,e*a,Math.cos(r)]}function He(i,t){const[e,n,s,r]=i,[a,o,l]=t,c=r*a+n*l-s*o,h=r*o+s*a-e*l,f=r*l+e*o-n*a,d=-e*a-n*o-s*l;return[c*r+d*-e+h*-s-f*-n,h*r+d*-n+f*-e-c*-s,f*r+d*-s+c*-n-h*-e]}function B_(i,t){const e=Math.abs(i[0]*t[0]+i[1]*t[1]+i[2]*t[2]+i[3]*t[3]);return 2*Math.acos(se(e,0,1))}function bl(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function Cr(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function Ei(i){const t=Math.hypot(i[0],i[1],i[2]);return t<1e-9?[1,0,0]:[i[0]/t,i[1]/t,i[2]/t]}function ef(i,t,e){const n=i[0],s=t[0],r=e[0],a=i[1],o=t[1],l=e[1],c=i[2],h=t[2],f=e[2],d=n+o+f;let u,m,x,g;if(d>0){const p=Math.sqrt(d+1)*2;g=.25*p,u=(h-l)/p,m=(r-c)/p,x=(a-s)/p}else if(n>o&&n>f){const p=Math.sqrt(1+n-o-f)*2;g=(h-l)/p,u=.25*p,m=(s+a)/p,x=(r+c)/p}else if(o>f){const p=Math.sqrt(1+o-n-f)*2;g=(r-c)/p,u=(s+a)/p,m=.25*p,x=(l+h)/p}else{const p=Math.sqrt(1+f-n-o)*2;g=(a-s)/p,u=(r+c)/p,m=(l+h)/p,x=.25*p}return pn([u,m,x,g])}function k_(i,t,e=bc,n=wc,s=[.42,-.88,.2]){const r=i.x??i[0]??0,a=i.y??i[1]??0,o=i.z??i[2]??0,l=t.x??t[0]??0,c=t.y??t[1]??0,h=t.z??t[2]??0,f=l-r,d=c-a,u=h-o,m=Math.hypot(f,d,u),x=Math.abs(e-n)+.045,g=e+n-.008,p=se(m,x,g),v=m>1e-6?f/m:0,M=m>1e-6?d/m:0,_=m>1e-6?u/m:-1,T={x:r+v*p,y:a+M*p,z:o+_*p},b=(e*e-n*n+p*p)/(2*p),E=Math.sqrt(Math.max(0,e*e-b*b)),w=Ei(s),y=w[0]*v+w[1]*M+w[2]*_;let S=w[0]-y*v,R=w[1]-y*M,L=w[2]-y*_,P=Math.hypot(S,R,L);if(P<1e-5){const V=Cr([v,M,_],[1,0,0]),k=Ei(V);S=k[0],R=k[1],L=k[2],P=1}else S/=P,R/=P,L/=P;const U={x:r+v*b+S*E,y:a+M*b+R*E,z:o+_*b+L*E},O=se((e*e+n*n-p*p)/(2*e*n),-1,1),z=(Math.PI-Math.acos(O))*Ti;return{shoulder:{x:r,y:a,z:o},elbow:U,wrist:T,elbowBendDeg:z,clampedDist:p}}class H_{constructor(t="right"){const e=typeof t=="string"?t:t==null?void 0:t.handSide;this.handSide=e==="left"?"left":"right",this.qStretch=null,this.qBend=null,this.qBasis=[0,0,0,1],this.qRefInv=[0,0,0,1],this.bendSpanRad=52*pe,this.bendInwardYawRad=0,this.yawTrimRad=0,this.pendingSessionRecenter=!1,this.pendingRecenterWindowSec=0,this.calibratedStep=0;const n=this._defaultBeaconU();this.beaconFar={u:n,v:.54,span:.105,captured:!1},this.beaconNear={u:n,v:.64,span:.235,captured:!1},this.lastSensor=null,this.sensorSilentSec=0,this.prevQuat=null,this.prevFwd=null,this.torsoYaw=0;const s=this.sideSign;this.torsoWristPos={x:s*.16,y:-.22,z:-.5},this.torsoWristVel={x:0,y:0,z:0},this.qArm=[0,0,0,1],this.qArmTorso=[0,0,0,1],this.shoulderPos={x:s*.21,y:-.27,z:-.08},this.elbowPos={x:s*.24,y:-.44,z:-.26},this.pos={x:s*.16,y:-.22,z:-.5},this.vel={x:0,y:0,z:0},this.elbowBendDeg=68,this.reach=.25,this.elevationDeg=0,this.screenFacingCos=.85,this.trackingSource="idle",this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.lastPokeAt=-1e3,this.dwellAccumSec=0,this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=0,this.maxInspectPitchRad=0,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0,this.lastDecisionAt=-2e3}get sideSign(){return this.handSide==="left"?-1:1}_defaultBeaconU(){return this.handSide==="left"?.46:.54}setHandSide(t){const e=t==="left"?"left":"right";if(e===this.handSide)return this.handSide;this.handSide=e;const n=this.sideSign;return this.beaconFar.captured||(this.beaconFar.u=this._defaultBeaconU()),this.beaconNear.captured||(this.beaconNear.u=this._defaultBeaconU()),this.torsoWristPos={x:n*Math.abs(this.torsoWristPos.x),y:this.torsoWristPos.y,z:this.torsoWristPos.z},this.torsoWristVel={x:0,y:0,z:0},this.shoulderPos={x:n*.21,y:-.27,z:-.08},this.elbowPos={x:n*.24,y:-.44,z:-.26},this.pos={x:n*Math.abs(this.pos.x),y:this.pos.y,z:this.pos.z},this.vel={x:0,y:0,z:0},this.handSide}exportCalibration(){return this.calibratedStep<2?null:{handSide:this.handSide,qStretch:this.qStretch,qBend:this.qBend,qBasis:this.qBasis,qRefInv:this.qRefInv,bendSpanRad:this.bendSpanRad,bendInwardYawRad:this.bendInwardYawRad,beaconFar:this.beaconFar,beaconNear:this.beaconNear}}importCalibration(t){return!t||!Array.isArray(t.qBasis)||!Array.isArray(t.qRefInv)?!1:((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.qStretch=t.qStretch||[0,0,0,1],this.qBend=t.qBend||[0,0,0,1],this.qBasis=pn(t.qBasis),this.qRefInv=pn(t.qRefInv),this.bendSpanRad=se(Number(t.bendSpanRad)||52*pe,15*pe,125*pe),this.bendInwardYawRad=Number(t.bendInwardYawRad)||0,t.beaconFar&&(this.beaconFar={...this.beaconFar,...t.beaconFar,u:this._defaultBeaconU(),v:.54}),t.beaconNear&&(this.beaconNear={...this.beaconNear,...t.beaconNear,u:se(this._defaultBeaconU()-this.sideSign*.03,.15,.85),v:.64}),this.calibratedStep=2,this.yawTrimRad=0,!0)}feedSensor(t){!t||!Array.isArray(t.q)||t.q.length!==4||((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.lastSensor={q:pn(t.q),linMag:Math.max(0,Number(t.linMag)||0),rotRate:Math.max(0,Number(t.rotRate)||0),acc:Array.isArray(t.acc)?t.acc:[0,0,0],ts:t.ts??performance.now()},this.sensorSilentSec=0)}calibrateStretchPose(t=this.lastSensor,e=null){if(!(t!=null&&t.q))return{ok:!1,message:"Нет сигнала от гироскопа на запястье. Подключите браслет."};this.qStretch=pn(t.q);const n=Ei(He(bi(this.qStretch),[0,1,0]));let s=[0,0,1];Math.abs(bl(s,n))>.9&&(s=[0,1,0]);const r=Ei(Cr(n,s)),a=Ei(Cr(r,n));this.qBasis=ef(r,n,a),this.qRefInv=bi(Xe(this.qStretch,this.qBasis)),this.yawTrimRad=0,this.torsoYaw=0;const o=this._defaultBeaconU();e&&e.fresh&&e.status!=="none"&&e.spanNorm>.015?this.beaconFar={u:o,v:.54,span:se(e.spanNorm,.02,.42),captured:!0}:this.beaconFar={u:o,v:.54,span:.105,captured:!1},this.calibratedStep=1;const l=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:1,beaconCaptured:this.beaconFar.captured,message:`Шаг 1 записан (прямая ${l}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`}}calibrateBendPose(t=this.lastSensor,e=null){if(!this.qStretch)return{ok:!1,message:"Сначала выполните Шаг 1 — вытяните прямую руку вперёд."};if(!(t!=null&&t.q))return{ok:!1,message:"Нет свежего сигнала гироскопа с браслета."};const n=pn(t.q),s=Xe(bi(this.qStretch),n),r=s[3]<0?-1:1;s[0]*r,s[1]*r,s[2]*r;const a=se(s[3]*r,-1,1);if(2*Math.acos(se(a,0,1))<12*pe)return{ok:!1,message:"Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз."};const l=Ei(He(bi(this.qStretch),[0,1,0])),c=Ei(He(bi(n),[0,1,0])),h=se(bl(c,l),-1,1),f=[c[0]-h*l[0],c[1]-h*l[1],c[2]-h*l[2]],d=Math.hypot(f[0],f[1],f[2]);if(d<Math.sin(13*pe))return{ok:!1,message:"Поднимите предплечье в локте вверх хотя бы на 20° выше горизонтали (не выворачивая кисть)."};const u=[f[0]/d,f[1]/d,f[2]/d],m=[-u[0],-u[1],-u[2]],x=Ei(Cr(l,m)),g=Ei(Cr(m,x)),p=ef(x,g,m),v=bi(Xe(this.qStretch,p)),M=Xe(v,Xe(n,p)),_=He(M,[0,0,-1]),T=Math.atan2(d,h);this.qBend=n,this.qBasis=p,this.qRefInv=v,this.bendSpanRad=se(T,18*pe,115*pe),this.bendInwardYawRad=Math.atan2(_[0],Math.max(.15,-_[2])),this.yawTrimRad=0;const b=se(this._defaultBeaconU()-this.sideSign*.03,.15,.85);e&&e.fresh&&e.status!=="none"&&e.spanNorm>this.beaconFar.span*1.12?this.beaconNear={u:b,v:.64,span:se(e.spanNorm,this.beaconFar.span+.04,.58),captured:!0}:this.beaconNear={u:b,v:.64,span:se(this.beaconFar.span*1.95,this.beaconFar.span+.07,.45),captured:!1},this.calibratedStep=2;const E=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:2,handSide:this.handSide,bendDeg:+(T*Ti).toFixed(1),beaconCaptured:this.beaconFar.captured&&this.beaconNear.captured,message:`Калибровка готова (${E}, сгиб ${Math.round(T*Ti)}°). Можно надевать очки!`}}recenterOnSessionStart(t=performance.now()){var l;if(this.torsoYaw=0,this.pendingSessionRecenter=!1,this.pendingRecenterWindowSec=0,!((l=this.lastSensor)!=null&&l.q)||!this.qStretch||this.sensorSilentSec>1.6||t-this.lastSensor.ts>2e3)return;const e=pn(Xe(this.qRefInv,Xe(this.lastSensor.q,this.qBasis))),n=He(e,[0,0,-1]);if(Math.asin(se(n[1],-1,1))>32*pe||this.lastSensor.rotRate>38||this.lastSensor.linMag>1.3){this.pendingSessionRecenter=!0,this.pendingRecenterWindowSec=10;return}if(Math.hypot(n[0],n[2])<.35)return;const o=Math.atan2(n[0],-n[2]);Math.abs(o)>22*pe&&(this.yawTrimRad=o)}_currentTorsoQuat(){var t;if((t=this.lastSensor)!=null&&t.q&&this.qStretch){const e=Ws([0,1,0],this.yawTrimRad+this.torsoYaw);return pn(Xe(e,Xe(this.qRefInv,Xe(this.lastSensor.q,this.qBasis))))}return[...this.qArmTorso]}onPhaseChange(t,e=performance.now()){if(t==="inspect"){const n=this._currentTorsoQuat(),s=He(n,[0,0,-1]);this.inspectBaseQ=[...n],this.inspectPrevQ=[...n],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=e,this.maxInspectPitchRad=Math.asin(se(s[1],-1,1)),this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0}else this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.calmLowerSec=0;t==="search"&&(this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0)}update(t,{beacon:e=null,phase:n="search",revealReady:s=!1,handOverBin:r=!0,headLook:a={yaw:0,pitch:0},now:o=performance.now()}={}){const l=se(t||.016666666666666666,.001,.1),c=this.lastSensor;if(!(c!=null&&c.q))return this.trackingSource="idle",this.snapshot({pokes:0,decision:null,throwVel:null});this.qStretch||this.calibrateStretchPose(c,e);const h=this.sideSign,f=Number.isFinite(a==null?void 0:a.yaw)?a.yaw:0,d=Number.isFinite(a==null?void 0:a.pitch)?a.pitch:0,u=pn(Xe(this.qRefInv,Xe(c.q,this.qBasis)));if(this.pendingSessionRecenter)if(this.pendingRecenterWindowSec-=l,this.pendingRecenterWindowSec<=0)this.pendingSessionRecenter=!1;else{const xt=He(u,[0,0,-1]),I=Math.asin(se(xt[1],-1,1)),A=Math.hypot(xt[0],xt[2]);if(I<=28*pe&&I>=-32*pe&&A>=.45&&c.rotRate<=35&&c.linMag<=1.2){const W=Math.atan2(xt[0],-xt[2]);Math.abs(W)>22*pe&&(this.yawTrimRad=W),this.pendingSessionRecenter=!1}}const m=pn(Xe(Ws([0,1,0],this.yawTrimRad),u)),x=He(m,[0,0,-1]),g=Math.hypot(x[0],x[2]);let p=this.torsoYaw;if(n==="search"&&g>.35){const xt=Math.atan2(x[0],-x[2]),I=f-this.torsoYaw,A=xt-this.torsoYaw,W=I>=0?se(A,0,I):se(A,I,0);p=se(this.torsoYaw+W,f-50*pe,f+50*pe)}else p=se(this.torsoYaw,f-50*pe,f+50*pe);const v=p-this.torsoYaw;Math.abs(v)>18*pe&&(this.torsoYaw+=(v-Math.sign(v)*18*pe)*.45),this.torsoYaw+=(p-this.torsoYaw)*Math.min(1,l*3.2);const M=f-this.torsoYaw,_=Xe(Ws([1,0,0],-d),Ws([0,1,0],M)),T=bi(_),b=Ws([0,1,0],this.yawTrimRad+this.torsoYaw);this.qArmTorso=pn(Xe(b,u)),this.qArm=pn(Xe(_,this.qArmTorso));let E=c.rotRate;this.prevQuat&&E<1&&(E=B_(this.prevQuat,this.qArmTorso)/l*Ti),this.prevQuat=[...this.qArmTorso];const w=this.sensorSilentSec;this.sensorSilentSec+=l;const y=w>.12?Math.exp(-(w-.12)*8):1,S=c.linMag*y;E*=y;const R=w>1.6,L=He(bi(this.qBasis),[0,0,1]),P=He(this.qArm,L);this.screenFacingCos=P[2];const U=He(this.qArmTorso,[0,0,-1]);let O=0;if(this.prevFwd){const xt=se(bl(this.prevFwd,U),-1,1);O=Math.acos(xt)/l*Ti}this.prevFwd=[...U];const z=Math.asin(se(U[1],-1,1)),V=Math.atan2(U[0],Math.max(.12,Math.hypot(U[2],U[1]*.35)));this.elevationDeg=+(z*Ti).toFixed(1);const k=se(-h*V/(28*pe),-.35,1),B=se((z-(this.bendSpanRad+6*pe))/(26*pe),0,1);let q,Q=0;if(z>=0){const xt=se(z/Math.max(.32,this.bendSpanRad),0,1.15),I=se(.96+k*.12-B*.78,.18,1.05);q=se(1-xt*.84*I,.12,1.02),Q=B*.08+se(z/(75*pe),0,1)*.04}else{const xt=se(-z/(72*pe),0,1);q=se(1-xt*.62,.28,1.02),Q=-xt*.035}const at={x:h*.21,y:-.27+Q,z:-.08},dt=bc+wc-.015,Ct=.25;let It,$;if(z<-8*pe){const xt=se(-z/(70*pe),0,1);It=.56-xt*.09,$={x:at.x+U[0]*It*.82-h*(1-xt)*.06,y:at.y+U[1]*It*.95+(1-xt)*.14,z:at.z-Math.max(.18,-U[2])*It*.96}}else{It=Ct+q*(dt-Ct);const xt=1-q;$={x:at.x+U[0]*It*.88-h*(.09+xt*.03),y:at.y+U[1]*(.2+q*.36+B*.18)+q*.15,z:at.z-(.28+q*.31)*se(-U[2]+xt*.45,.36,1.05)}}let it=q;if(e&&e.fresh&&e.status!=="none"&&this.screenFacingCos>.18)if(this.trackingSource="gyro+beacon",e.status==="pair"&&e.spanNorm>.015){const xt=se(this.screenFacingCos,.42,1),I=e.spanNorm/xt,A=Math.max(.035,this.beaconNear.span-this.beaconFar.span),W=se((this.beaconNear.span-I)/A,.06,1.06);it=q*.35+W*.65;const K=-.38-W*.32,lt=se((e.u-this.beaconFar.u)*1.15+h*.1,-.54,.54),Z=se((this.beaconFar.v-e.v)*.94-.11,-.56,.46),Et=He(T,[lt,Z,K]);$.x=$.x*.32+Et[0]*.68,$.y=$.y*.32+Et[1]*.68,$.z=$.z*.35+Et[2]*.65;const pt=He(_,[at.x+U[0]*.48-h*.08,at.y+U[1]*.35,-.55]),Pt=se(this.beaconFar.u+(pt[0]-h*.1)*.65,.1,.9),zt=e.u-Pt,vt=12*pe*l;this.yawTrimRad=se(this.yawTrimRad-se(zt*.35,-vt,vt),-180*pe,180*pe)}else{const xt=se((e.u-this.beaconFar.u)*1.1+h*.1,-.52,.52),I=se((this.beaconFar.v-e.v)*.9-.11,-.54,.44),A=He(T,[xt,I,$.z]);$.x=$.x*.55+A[0]*.45,$.y=$.y*.55+A[1]*.45}else this.trackingSource=R?"stale":"gyro-only";const Mt=26,bt=Math.max(1,Math.ceil(l/.017)),Yt=l/bt;for(let xt=0;xt<bt;xt++)for(const I of["x","y","z"]){const A=$[I]-this.torsoWristPos[I],W=Mt*Mt*A-2*Mt*this.torsoWristVel[I];this.torsoWristVel[I]+=W*Yt,this.torsoWristPos[I]+=this.torsoWristVel[I]*Yt}this.reach+=(it-this.reach)*(1-Math.exp(-l*18));const Ot=se((this.torsoWristPos.y+.1)*.55,-.15,.42),F=[h*.44,-.86+Ot,.22],J=k_(at,this.torsoWristPos,bc,wc,F);this.torsoWristPos={...J.wrist},this.elbowBendDeg=+J.elbowBendDeg.toFixed(1);const j=He(_,[J.shoulder.x,J.shoulder.y,J.shoulder.z]),rt=He(_,[J.elbow.x,J.elbow.y,J.elbow.z]),st=He(_,[J.wrist.x,J.wrist.y,J.wrist.z]),mt=He(_,[this.torsoWristVel.x,this.torsoWristVel.y,this.torsoWristVel.z]);this.shoulderPos={x:j[0],y:j[1],z:j[2]},this.elbowPos={x:rt[0],y:rt[1],z:rt[2]},this.pos={x:st[0],y:st[1],z:st[2]},this.vel={x:mt[0],y:mt[1],z:mt[2]};let ct=0,ft=null,$t=null;if(R)return this.dwellAccumSec=0,this.calmLowerSec=0,this.snapshot({pokes:0,decision:null,throwVel:null,pitchUpDeg:+(z*Ti).toFixed(1)});if(n==="search")if(this.reach>=.6&&r){this.rummageAnchorYaw===null&&(this.rummageAnchorYaw=V,this.rummageAnchorPitch=z);const I=V-this.rummageAnchorYaw,A=z-this.rummageAnchorPitch,W=Math.hypot(I,A)*Ti,lt=(Math.abs(I)>=Math.abs(A)?I:A)>=0?1:-1,Z=o-this.lastPokeAt>=270,Et=W>=6.8&&(this.rummageDir===0||lt!==this.rummageDir),pt=S>=1.35&&E>=28;Z&&(Et||pt)?(ct=1,this.lastPokeAt=o,this.rummageDir=lt,this.rummageAnchorYaw=V,this.rummageAnchorPitch=z,this.dwellAccumSec=0):(E>=12||S>=.55)&&(this.dwellAccumSec+=l,this.dwellAccumSec>=.62&&Z&&(ct=1,this.lastPokeAt=o,this.dwellAccumSec=0))}else this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0;else if(n==="inspect"){(!this.inspectBaseQ||!this.inspectPrevQ)&&(this.inspectBaseQ=[...this.qArmTorso],this.inspectPrevQ=[...this.qArmTorso],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=o,this.maxInspectPitchRad=z,this.itemRot={x:0,y:0,z:0}),z>this.maxInspectPitchRad&&(this.maxInspectPitchRad=z);let xt=pn(Xe(this.qArmTorso,bi(this.inspectPrevQ)));this.inspectPrevQ=[...this.qArmTorso],xt[3]<0&&(xt=[-xt[0],-xt[1],-xt[2],-xt[3]]);const I=Math.hypot(xt[0],xt[1],xt[2]);if(I>1e-7){const K=2*Math.atan2(I,xt[3])/I,lt=xt[0]*K,Z=xt[1]*K,Et=xt[2]*K,pt=lt*1.55,Pt=Z*1.75-Et*.7,zt=Et*1.25,vt=Math.hypot(pt,Pt,zt);if(vt>1e-8){const Lt=Ws([pt,Pt,zt],vt);this.inspectItemQ=pn(Xe(Lt,this.inspectItemQ))}this.itemRot={x:this.itemRot.x+pt,y:this.itemRot.y+Pt,z:this.itemRot.z+zt}}if(s&&o-this.inspectEnteredAt>=450&&o-this.lastDecisionAt>=900){const W=S>=7.2,K=E>=245&&S>=2.4,lt=E>=310&&O>=195;if(W||K||lt){ft="discard",this.lastDecisionAt=o,this.calmLowerSec=0;const Z=He(this.qArm,[0,0,-1]),Et=Z[0]>=0?1:-1;$t={x:se(Z[0]*7.5+Et*3.8+this.vel.x*2.2,-9.5,9.5),y:se(Z[1]*4.5+2.2+this.vel.y*1.8,.5,7.5),z:-6.8}}else{const Z=this.maxInspectPitchRad-z,Et=z<=-21*pe&&Z>=16*pe||z<=-38*pe||J.wrist.y<=-.38&&Z>=14*pe,pt=S<3.1&&E<105;Et&&pt?(this.calmLowerSec+=l,this.calmLowerSec>=.65&&(ft="keep",this.lastDecisionAt=o,this.calmLowerSec=0)):this.calmLowerSec=Math.max(0,this.calmLowerSec-l*2.2)}}}return this.snapshot({pokes:ct,decision:ft,throwVel:$t,pitchUpDeg:+(z*Ti).toFixed(1)})}snapshot(t={}){return{handSide:this.handSide,calibratedStep:this.calibratedStep,trackingSource:this.trackingSource,torsoYaw:+this.torsoYaw.toFixed(4),qArm:[...this.qArm],shoulderPos:{...this.shoulderPos},elbowPos:{...this.elbowPos},pos:{...this.pos},vel:{x:+this.vel.x.toFixed(3),y:+this.vel.y.toFixed(3),z:+this.vel.z.toFixed(3)},elbowBendDeg:this.elbowBendDeg,elevationDeg:this.elevationDeg,reach:+this.reach.toFixed(3),screenFacingCos:+this.screenFacingCos.toFixed(3),itemRot:{...this.itemRot},itemQuat:[...this.inspectItemQ],calmLowerProgress:+se(this.calmLowerSec/.65,0,1).toFixed(2),...t}}}const G_="modulepreload",V_=function(i,t){return new URL(i,t).href},nf={},sf=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(f=>Promise.resolve(f).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=a(e.map(h=>{if(h=V_(h,n),h in nf)return;nf[h]=!0;const f=h.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(!!n)for(let x=o.length-1;x>=0;x--){const g=o[x];if(g.href===h&&(!f||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":G_,f||(m.as="script"),m.crossOrigin="",m.href=h,c&&m.setAttribute("nonce",c),document.head.appendChild(m),f)return new Promise((x,g)=>{m.addEventListener("load",x),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},rf="https://www.gstatic.com/firebasejs/11.0.1",Ed="ckc_stand_cfg",Ad="wn_firebase_cfg",W_="wn-wrist-demo-v1",X_=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];function q_(i){if(!i||typeof i!="string")return null;const t=i.trim();if(!t)return null;if(/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(t))return{databaseURL:t.replace(/\/$/,"")};try{const r=JSON.parse(t);if(r&&typeof r=="object"&&(r.databaseURL||r.projectId))return r}catch{}const e={},n=/([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;let s;for(;(s=n.exec(t))!==null;)e[s[1]]=s[3];return!e.databaseURL&&e.projectId&&(e.databaseURL=`https://${e.projectId}-default-rtdb.firebaseio.com`),e.databaseURL?e:null}function Y_(){try{return localStorage.getItem(Ed)||localStorage.getItem(Ad)||""}catch{return""}}function $_(i){try{localStorage.setItem(Ed,i),localStorage.setItem(Ad,i)}catch{}}function af(){return String(Math.floor(1e5+Math.random()*9e5))}function Z_(){return"h"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}function of(i){if(!i||typeof i!="string")return!1;const t=i.trim().toLowerCase();return!!(t.endsWith(".local")||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(t)||t.startsWith("fd")||t.startsWith("fc")||t.startsWith("fe80:"))}class J_{constructor({onSensor:t,onCalCommand:e,onHandSide:n,onStatus:s}={}){this.onSensor=t||(()=>{}),this.onCalCommand=e||(()=>{}),this.onHandSide=n||(()=>{}),this.onStatus=s||(()=>{}),this.mode="off",this.roomCode="",this.connected=!1,this.p2pOpen=!1,this.routeKind="idle",this.rttMs=null,this.rxHz=0,this.error=null,this.db=null,this.fbMod=null,this.unsubs=[],this.bc=null,this.pc=null,this.dcFast=null,this.dcCtrl=null,this.hid="",this.pendingCandidates=[],this.attempt=0,this.offerInFlight=!1,this.offerStartedAt=0,this.preferLanOnly=!1,this.peerJoined=!1,this.peerSid="",this.hostHandSide="right",this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastAnyRxAt=0,this.lastSeq=-1,this.seenCalIds=new Set,this.rxTimes=[],this.pingTimer=null,this.watchdogTimer=null,this.wakeLock=null}async acquireWakeLock(){var t,e,n;try{typeof navigator<"u"&&((t=navigator.wakeLock)!=null&&t.request)&&!this.wakeLock&&(this.wakeLock=await navigator.wakeLock.request("screen"),(n=(e=this.wakeLock).addEventListener)==null||n.call(e,"release",()=>{this.wakeLock=null}))}catch{}}releaseWakeLock(){var t,e;try{(e=(t=this.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}this.wakeLock=null}startDemo(t=this.roomCode||af(),e=this.hostHandSide){return this.stop(),this.mode="demo",this.roomCode=String(t),this.hostHandSide=e==="left"?"left":"right",this.routeKind="demo",this.error=null,typeof BroadcastChannel<"u"&&(this.bc=new BroadcastChannel(W_),this.bc.onmessage=n=>{var r;const s=n==null?void 0:n.data;if(!(!s||String(s.room)!==this.roomCode))if(s.k==="hello")this.connected=!0,this.p2pOpen=!0,this.lastSeq=-1,s.sid&&(this.peerSid=String(s.sid)),s.explicitSide&&(s.side==="left"||s.side==="right")&&(this.hostHandSide=s.side,this.onHandSide(s.side)),(r=this.bc)==null||r.postMessage({k:"ack",room:this.roomCode,side:this.hostHandSide,ts:Date.now()}),this._emitStatus();else if(s.k==="wrist")this.connected=!0,this.p2pOpen=!0,this._handlePacket(s,!0);else if(s.k==="cal"&&s.step){const a=s.id||`${s.step}:${s.ts||0}`;this.seenCalIds.has(a)||(this.seenCalIds.add(a),this.onCalCommand(s.step))}else s.k==="hand_side"&&(s.side==="left"||s.side==="right")&&this.onHandSide(s.side)}),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"demo"}}async startFirebase(t,e=this.hostHandSide){const n=q_(t);if(!n)return this.error="Вставьте корректный firebaseConfig или URL Realtime Database",this._emitStatus(),{ok:!1,error:this.error};$_(t),this.stop(),this.mode="firebase",this.roomCode=af(),this.hostHandSide=e==="left"?"left":"right",this.error=null;try{const[{initializeApp:s,getApps:r,deleteApp:a},o]=await Promise.all([sf(()=>import(`${rf}/firebase-app.js`),[],import.meta.url),sf(()=>import(`${rf}/firebase-database.js`),[],import.meta.url)]),l=r().find(p=>p.name==="wn-wrist-host");if(l)try{await a(l)}catch{}const c=s(n,"wn-wrist-host");this.db=o.getDatabase(c,n.databaseURL),this.fbMod=o;const{ref:h,set:f,onValue:d,onChildAdded:u,onDisconnect:m}=o,x=`wn_wrist_rooms/${this.roomCode}`;await f(h(this.db,x),{createdAt:Date.now(),hostAlive:!0,hostHandSide:{side:this.hostHandSide,ts:Date.now()}});try{m(h(this.db,`${x}/hostAlive`)).remove()}catch{}this.unsubs.push(d(h(this.db,`${x}/wristJoined`),p=>{p.val()&&(this.peerJoined=!0,this.connected=!0,this.lastSeq=-1,!this.isFastHealthy()&&!this._isOfferNegotiating()&&this._startRtcOffer(!1),this._emitStatus())})),this.unsubs.push(d(h(this.db,`${x}/fbInput`),p=>{const v=p.val();v&&(this.connected=!0,this.isFastHealthy()||(this.routeKind="firebase",this._handlePacket(v,!1)))}));let g=!0;return this.unsubs.push(d(h(this.db,`${x}/calCmd`),p=>{const v=p.val();if(g){g=!1,v!=null&&v.id&&this.seenCalIds.add(v.id);return}if(!v||!v.step)return;const M=v.id||`${v.step}:${v.ts||0}`;this.seenCalIds.has(M)||(this.seenCalIds.add(M),this.onCalCommand(v.step))})),this.unsubs.push(d(h(this.db,`${x}/handSide`),p=>{const v=p.val();v&&(v.side==="left"||v.side==="right")&&this.onHandSide(v.side)})),this.unsubs.push(d(h(this.db,`${x}/rtc/hello`),p=>{const v=p.val();!v||!v.ts||(this.peerJoined=!0,this.connected=!0,!this.isFastHealthy()&&!this._isOfferNegotiating()&&this._startRtcOffer(!1))})),this.unsubs.push(d(h(this.db,`${x}/rtc/answer`),async p=>{const v=p.val();if(!v||v.hid!==this.hid||!this.pc||this.pc.signalingState!=="have-local-offer")return;const M=this.hid;try{await this.pc.setRemoteDescription({type:"answer",sdp:v.sdp});const _=this.pendingCandidates.filter(T=>T.hid===M);this.pendingCandidates=[];for(const T of _){if(this.hid!==M||!this.pc)break;try{await this.pc.addIceCandidate(T.candidate)}catch{}}}catch{}})),this.unsubs.push(u(h(this.db,`${x}/rtc/wristCandidates`),async p=>{const v=p.val();if(!(!v||!v.candidate||!v.hid)){if(v.hid!==this.hid||!this.pc||!this.pc.remoteDescription){this.pendingCandidates.push(v),this.pendingCandidates.length>48&&this.pendingCandidates.shift();return}try{await this.pc.addIceCandidate(v.candidate)}catch{}}})),await this.acquireWakeLock(),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"firebase"}}catch(s){return this.error=(s==null?void 0:s.message)||"Ошибка подключения к Firebase",this._emitStatus(),{ok:!1,error:this.error}}}isFastHealthy(t=performance.now()){if(this.mode==="demo")return this.p2pOpen;if(!this.dcFast||this.dcFast.readyState!=="open")return!1;const e=this.lastPongAt>0?Math.max(0,t-this.lastPongAt):1/0,n=this.lastFastRxAt>0?Math.max(0,t-this.lastFastRxAt):1/0,s=Math.min(e,n);return Number.isFinite(s)?s<8500:this.dcOpenedAt>0&&Math.max(0,t-this.dcOpenedAt)<3500}_isOfferNegotiating(t=performance.now()){if(this.offerInFlight)return!0;if(!this.pc||!this.offerStartedAt)return!1;const e=this.pc.connectionState;return e==="failed"||e==="closed"?!1:Math.max(0,t-this.offerStartedAt)<4500}async _startRtcOffer(t=!1){if(!(typeof RTCPeerConnection>"u"||!this.db||!this.fbMod)&&!this.offerInFlight){this.offerInFlight=!0;try{this._closePcOnly(),this.attempt+=1,this.hid=Z_(),this.offerStartedAt=performance.now();const e=this.hid,n=this.preferLanOnly||!t&&this.attempt%2===1,s=n?[]:X_,{ref:r,set:a,push:o,remove:l}=this.fbMod,c=`wn_wrist_rooms/${this.roomCode}/rtc`;try{await Promise.all([l(r(this.db,`${c}/answer`)),l(r(this.db,`${c}/hostCandidates`)),l(r(this.db,`${c}/wristCandidates`))])}catch{}if(this.mode!=="firebase"||this.hid!==e)return;const h=new RTCPeerConnection({iceServers:s});this.pc=h;const f=h.createDataChannel("wrist-fast",{ordered:!1,maxRetransmits:0}),d=h.createDataChannel("wrist-ctrl",{ordered:!0});this.dcFast=f,this.dcCtrl=d;const u=()=>{this.hid===e&&(this.p2pOpen=!0,this.connected=!0,this.lastSeq=-1,this.dcOpenedAt=performance.now(),this._inspectRoute(n),this._emitStatus())};f.onopen=u,d.onopen=u,f.onmessage=m=>this._onChannelMessage(m.data,!0),d.onmessage=m=>this._onChannelMessage(m.data,!1),h.onicecandidate=m=>{!m.candidate||this.hid!==e||o(r(this.db,`${c}/hostCandidates`),{hid:e,candidate:m.candidate.toJSON?m.candidate.toJSON():m.candidate}).catch(()=>{})},h.onconnectionstatechange=()=>{if(this.hid!==e)return;const m=h.connectionState;m==="connected"?(this.p2pOpen=!0,this._inspectRoute(n),this._emitStatus()):(m==="failed"||m==="closed")&&(this.p2pOpen=!1,this.offerStartedAt=0,this.routeKind=this.connected?"firebase":"idle",this._emitStatus())};try{const m=await h.createOffer();await h.setLocalDescription(m),await a(r(this.db,`${c}/offer`),{hid:e,sdp:m.sdp,iceMode:n?"lan":"stun",ts:Date.now()})}catch{}}finally{this.offerInFlight=!1}}}async _inspectRoute(t){var e;if(!((e=this.pc)!=null&&e.getStats)){this.routeKind=t?"lan":"stun";return}try{const n=await this.pc.getStats();let s=null;const r=new Map;if(n.forEach(a=>{(a.type==="local-candidate"||a.type==="remote-candidate")&&r.set(a.id,a),a.type==="candidate-pair"&&(a.nominated||a.state==="succeeded")&&(s=a)}),s){const a=r.get(s.localCandidateId),o=r.get(s.remoteCandidateId),l=(a==null?void 0:a.candidateType)||"",c=(o==null?void 0:o.candidateType)||"",h=Number.isFinite(s.currentRoundTripTime)?s.currentRoundTripTime*1e3:null,d=t||(l==="host"||l==="prflx")&&(c==="host"||c==="prflx")&&(of(a==null?void 0:a.address)||of(o==null?void 0:o.address)||h!==null&&h<22);this.routeKind=d?"lan":"stun",d&&(this.preferLanOnly=!0);return}}catch{}this.routeKind=t?"lan":"stun"}_onChannelMessage(t,e){let n;try{n=typeof t=="string"?JSON.parse(t):null}catch{return}if(!n)return;const s=performance.now();if(n.k==="ping"){this._sendCtrl({k:"pong",t:n.t});return}if(n.k==="pong"){if(this.lastPongAt=s,Number.isFinite(n.t)){const r=Math.max(1,Math.round(s-n.t));this.rttMs=this.rttMs===null?r:Math.round(this.rttMs*.65+r*.35)}this._emitStatus();return}if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step));return}if(n.k==="hand_side"&&(n.side==="left"||n.side==="right")){this.onHandSide(n.side);return}n.k==="wrist"&&(this.lastFastRxAt=s,this.p2pOpen=!0,this._handlePacket(n,e))}_sendCtrl(t){var n;const e=((n=this.dcCtrl)==null?void 0:n.readyState)==="open"?this.dcCtrl:this.dcFast;if((e==null?void 0:e.readyState)==="open")try{e.send(JSON.stringify(t))}catch{}}sendHandSide(t){const e=t==="left"?"left":"right";this.hostHandSide=e;const n={k:"hand_side",room:this.roomCode,side:e,ts:Date.now()};if(this.mode==="demo"&&this.bc&&this.bc.postMessage(n),this._sendCtrl(n),this.mode==="firebase"&&this.db&&this.fbMod&&this.roomCode){const{ref:s,set:r}=this.fbMod;r(s(this.db,`wn_wrist_rooms/${this.roomCode}/hostHandSide`),n).catch(()=>{})}}_handlePacket(t,e){const n=performance.now();if(t.sid&&t.sid!==this.peerSid&&(this.peerSid=String(t.sid),this.lastSeq=-1),e&&Number.isFinite(t.seq)){if(t.seq<=this.lastSeq&&this.lastSeq-t.seq<45)return;this.lastSeq=t.seq}for(this.lastAnyRxAt=n,this.rxTimes.push(n);this.rxTimes.length&&n-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:n})}injectPacket(t,e=performance.now()){this.connected=!0,this.p2pOpen=!0,this.routeKind="demo",this.lastAnyRxAt=e,this.rxHz=60,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:e})}_startMeters(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=setInterval(()=>{var e,n;const t=performance.now();for(;this.rxTimes.length&&t-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,(((e=this.dcFast)==null?void 0:e.readyState)==="open"||((n=this.dcCtrl)==null?void 0:n.readyState)==="open")&&this._sendCtrl({k:"ping",t:Math.round(t)}),this._emitStatus()},1e3),this.watchdogTimer=setInterval(()=>{this.mode!=="firebase"||!this.peerJoined||!this.isFastHealthy()&&!this._isOfferNegotiating()&&(this.p2pOpen=!1,this._startRtcOffer(!1))},4200)}_closePcOnly(){var t,e,n;try{(t=this.dcFast)==null||t.close()}catch{}try{(e=this.dcCtrl)==null||e.close()}catch{}try{(n=this.pc)==null||n.close()}catch{}this.dcFast=null,this.dcCtrl=null,this.pc=null,this.pendingCandidates=[],this.offerStartedAt=0,this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastSeq=-1,this.p2pOpen=!1}stop(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=null,this.watchdogTimer=null;for(const t of this.unsubs)try{t()}catch{}if(this.unsubs=[],this._closePcOnly(),this.bc){try{this.bc.close()}catch{}this.bc=null}this.releaseWakeLock(),this.mode="off",this.connected=!1,this.peerJoined=!1,this.routeKind="idle",this.rxHz=0,this.rttMs=null,this._emitStatus()}status(){return{mode:this.mode,roomCode:this.roomCode,connected:this.connected,p2pOpen:this.isFastHealthy(),routeKind:this.routeKind,rttMs:this.rttMs,rxHz:this.rxHz,error:this.error,fresh:!!this.lastAnyRxAt&&performance.now()-this.lastAnyRxAt<1200}}_emitStatus(){this.onStatus(this.status())}}const K_=(i,t,e)=>Math.max(t,Math.min(e,i)),et=i=>document.querySelector(i),Pn=i=>[...document.querySelectorAll(i)],j_=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let fi;try{fi=window.localStorage}catch{fi={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let Tt=a_(fi),ot,Tc="all",Be=null,Ec,lf,cf=null,us=0,Ac=0,rr=document.hidden,Rc=null;const Rd="white-night-vr-v1",Cc=10;function Q_(){try{const i=fi.getItem(Rd),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":t.mode==="hand"?"hand":"gyro",handSide:t.handSide==="left"?"left":"right",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",handSide:"right",quality:"high",leftHue:16,rightHue:338}}}let jt=Q_(),Re=null,ce=null,Ee=null,Ye=null,uo="",hf=!1,Le=!1,Jr=!1,Pc=!1,Vi=!1,fo=0,ei=0,ni=!1,oi=!1,po=!1,In=null,Ic=!1,wl=!1,Ai="",br=0;const Gn=new N_;function Nr(){try{fi.setItem(Rd,JSON.stringify(jt))}catch{}}const uf=new URLSearchParams(location.search).has("test"),ms=Pn("dialog");function jr(i,t="neutral"){et("#toast").dataset.tone=t,et("#toast").textContent=i,et("#toast").classList.add("visible"),clearTimeout(Ec),Ec=setTimeout(()=>et("#toast").classList.remove("visible"),2600)}function Po(){o_(fi,Tt)||(et("#save-status").textContent="Сохранение недоступно в этом браузере",jr("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function mo(){Pn("[data-pose]").forEach(i=>{var t;i.disabled=Tt.phase!=="inspect"||!((t=ot==null?void 0:ot.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(ot==null?void 0:ot.pose)))})}function Fr(){var i;if(mo(),!!ot){if(Tt.phase==="inspect"&&!((i=ot.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])et("#"+t).disabled=!0;return}et("#zoom-in").disabled=ot.zoom>=oo.max,et("#zoom-out").disabled=ot.zoom<=oo.min,et("#zoom-reset").disabled=ot.zoom===1,et("#zoom-reset").textContent=`${Math.round(ot.zoom*100)}%`}}function Cd(){et("#completion-preview").replaceChildren(...Tt.lastKept.map(i=>{const t=document.createElement("img");return t.src=ot.thumbnail(i),t.alt=gn.find(e=>e.id===i).name,t}))}function qi(){var e;const i=Tt.phase==="inspect"&&((e=ot.revealState)==null?void 0:e.phase)||"ready";if(i===cf)return;cf=i,et("#app").dataset.revealPhase=i,et("#app").classList.toggle("is-revealing",i!=="ready"),et(".inspection").setAttribute("aria-busy",String(i!=="ready")),et("#keep").disabled=et("#discard").disabled=i!=="ready",Fr();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};et("#reveal-note").textContent=t[i]||"",et("#reveal-note").hidden=i==="ready"}function tM(){const i=et("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(lf),lf=setTimeout(()=>i.classList.remove("collected"),700)}function Zi(){et("#app").classList.toggle("has-progress",Tt.searches>0),qi(),Fr(),sM(),et("#app").classList.toggle("is-inspecting",Tt.phase==="inspect"),et(".inspection").hidden=Tt.phase!=="inspect",Tt.phase==="inspect"&&(clearTimeout(Ec),et("#toast").classList.remove("visible")),et("#header-count").innerHTML=`${String(Tt.collection.length).padStart(2,"0")} <small>/ 18</small>`,et("#open-vr").disabled=Tt.phase==="inspect",et("#search-total").textContent=String(Tt.searches).padStart(2,"0"),et("#open-collection").disabled=Tt.phase==="inspect",Pn(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<Tt.taps)),et(".tap-dots").setAttribute("aria-label",`Нажатий: ${Tt.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(et("#search-caption").textContent=i[Tt.taps],et("#search-button span").textContent=Tt.taps?"Продолжить поиск":"Порыться в баке",Tt.phase==="inspect"){const t=gn.find(n=>n.id===Tt.current),e=wd[t.rarity];et("#find-name").textContent=t.name,et("#find-description").textContent=t.description,et("#find-era").textContent=t.era,et("#find-rarity").innerHTML=`<i></i>${e.label}`,et("#find-rarity").style.color=e.color,et("#find-number").textContent=Tt.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(Tt.searches).padStart(3,"0")}`,et("#duplicate-badge").hidden=Tt.reviewing||!Tt.collection.includes(t.id),et(".decision-buttons").hidden=Tt.reviewing,et("#close-review").hidden=!Tt.reviewing}}function go(){if(Tt.phase!=="search"||ms.some(t=>t.open)||rr)return;ot.poke(Tt.taps+1);let i=Rc||(Tt.searches===0?"camera":r_().id);Tt=Co(Tt,{type:"tap",itemId:i}),Tt.phase==="inspect"&&(Rc=null,ot.show(Tt.current),Po(),Le&&(oi=jt.mode!=="hand",ei=0,ni=!1,Gn.reset(),Ee==null||Ee.onPhaseChange("inspect",performance.now()))),Zi()}function gs(i,{fromVr:t=!1}={}){var r;if(Tt.phase!=="inspect"||Tt.reviewing||!((r=ot.revealState)!=null&&r.ready))return;const e=gn.find(a=>a.id===Tt.current),n=Tt.collection.includes(e.id),s=Tt.collection.length;Tt=Co(Tt,{type:i?"keep":"discard"}),ot.hide(),Po(),Zi(),jr(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&tM(),s<18&&Tt.collection.length===18&&(t?po=!0:(Cd(),et("#complete-dialog").showModal()))}function Pd(){et("#collection-count").textContent=Tt.collection.length,et("#collection-progress").style.width=`${Tt.collection.length/18*100}%`;const i=gn.filter(t=>Tc==="all"||(Tc==="junk"?t.rarity==="junk":t.rarity!=="junk"));et("#collection-grid").replaceChildren(...i.map(t=>{const e=Tt.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(gn.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${ot.thumbnail(t.id)}">`:`<div class="locked-art">${j_("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":wd[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{et("#collection-dialog").close(),Tt=Co(Tt,{type:"review",id:t.id}),ot.show(t.id,{review:!0}),Zi()}),n}))}function Lc(){Tt.phase!=="inspect"&&(Pd(),et("#collection-dialog").showModal())}function ff(){Tt.reviewing&&(Tt=Co(Tt,{type:"close"}),ot.hide(),Zi(),Lc())}function Id(){Tt=Zr(),ot.hide(),Po(),Zi(),et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1,et("#settings-dialog").close(),jr("Новая белая ночь. Начнём сначала.")}function eM(){const i=et(".bin-tag");if(!i)return;const t=ot.binEdge();i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`}const Ld="white-night-look-hint-v1";let df=!1;function nM(){try{return fi.getItem(Ld)==="done"}catch{return!0}}function iM(){const i=et("#look-hint");if(!(!i||df&&i.hidden)){i.classList.add("used"),df=!0;try{fi.setItem(Ld,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function sM(){const i=et("#look-hint");if(i){if(nM()||Tt.phase==="inspect"){i.hidden=!0;return}i.hidden=Le}}function bn(){return Re||(Re=new D_(et("#vr-camera")),Re.setHues(jt.leftHue,jt.rightHue),Re.setMode(jt.mode==="fusion"?"fusion":"gyro")),Re}function Dd(){return ce||(ce=new z_(et("#vr-hand-camera"))),ce}function Kr(i){var s;const t=li();ce==null||ce.process(!0);const e=(ce==null?void 0:ce.sample())||null,n=i==="pose1"?t.calibrateStretchPose(t.lastSensor,e):t.calibrateBendPose(t.lastSensor,e);return uo=n.message||"",(s=et("#vr-dialog"))!=null&&s.open&&Je(),n}function hh(i,{fromRemote:t=!1}={}){var n,s,r;const e=i==="left"?"left":"right";jt.handSide=e,Nr(),Ee&&Ee.setHandSide(e),(s=(n=ot==null?void 0:ot.vrHand)==null?void 0:n.setHandSide)==null||s.call(n,e),t||Ye==null||Ye.sendHandSide(e),(r=et("#vr-dialog"))!=null&&r.open&&Je()}function li(){return Ee||(Ee=new H_({handSide:jt.handSide})),Ye||(Ye=new J_({onSensor:i=>Ee.feedSensor(i),onCalCommand:i=>Kr(i),onHandSide:i=>hh(i,{fromRemote:!0}),onStatus:()=>{var i;(i=et("#vr-dialog"))!=null&&i.open&&Je()}}),Ye.hostHandSide=jt.handSide),Ee}function rM(i){return i.gyro.fresh?jt.mode==="fusion"?!!i.marker.calibrated:jt.mode==="hand"?(li(),(Ye.status().connected||!!Ee.lastSensor)&&Ee.calibratedStep>=2):!0:!1}function pf(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}const aM="<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>",oM="<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>",lM="В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.",cM="В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.";function Je(){var c;const i=bn(),t=i.info(),e=t.gyro,n=t.marker,s=rM(t);Pn("[data-vr-mode]").forEach(h=>{const f=h.dataset.vrMode===jt.mode;h.classList.toggle("active",f),h.setAttribute("aria-pressed",String(f))}),et("#vr-fusion-panel").hidden=jt.mode!=="fusion",et("#vr-hand-panel").hidden=jt.mode!=="hand";const r=et("#vr-how-cards"),a=et("#vr-note-text");if(r){const h=jt.mode==="hand"?oM:aM;r.innerHTML!==h&&(r.innerHTML=h)}a&&(a.textContent=jt.mode==="hand"?cM:lM),et("#vr-quality").value=jt.quality,et("#vr-swatch-left").style.background=`hsl(${jt.leftHue} 95% 55%)`,et("#vr-swatch-right").style.background=`hsl(${jt.rightHue} 95% 55%)`;const o=et("#vr-gyro-btn");if(o.disabled=!!e.fresh||!e.supported,o.textContent=e.fresh?"Гироскоп готов":"Разрешить",o.classList.toggle("ready",!!e.fresh),et("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",jt.mode==="fusion"){const[h,f]=n.markers||[];et("#vr-start-camera").disabled=!!n.running,et("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",et("#vr-calibrate").disabled=!(h!=null&&h.usable&&(f!=null&&f.usable)),et("#vr-pick-left").classList.toggle("active",In==="left"),et("#vr-pick-right").classList.toggle("active",In==="right"),et("#vr-camera").classList.toggle("picking",!!In);const d=et("#vr-marker-status");d.textContent=Ai||n.error||(In?`Коснитесь ${In==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((c=n.calibration)==null?void 0:c.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${h?pf(h):"—"}. Правая метка: ${f?pf(f):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),d.className=`vr-status-line ${Ai||n.error?"warn":n.calibrated?"good":""}`}else if(jt.mode==="hand"){if(li(),Pn("[data-hand-side]").forEach(p=>{const v=p.dataset.handSide===jt.handSide;p.classList.toggle("active",v),p.setAttribute("aria-pressed",String(v))}),!hf){hf=!0;const p=Y_(),v=et("#vr-hand-fb");v&&p?v.value=p:et("#vr-hand-fb-details")&&(et("#vr-hand-fb-details").open=!0)}const h=Ye.status(),f=h.connected||!!Ee.lastSensor;et("#vr-hand-code").textContent=h.roomCode||"——";const d=et("#vr-wrist-link");if(d){const p=new URLSearchParams;h.roomCode&&p.set("room",h.roomCode),jt.handSide==="left"&&p.set("hand","left"),h.mode==="demo"&&p.set("demo","1");const v=p.toString();d.href=v?`./wrist/index.html?${v}`:"./wrist/index.html"}const u=et("#vr-hand-net-status");u.textContent=h.error?h.error:h.p2pOpen?h.routeKind==="demo"?`Демо-канал активен (${h.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${h.rttMs?` · ${h.rttMs} мс`:""}.`:h.connected?"☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).":h.roomCode?`Код комнаты ${h.roomCode} создан — введите его на странице браслета.`:"Создайте 6-значный код и введите его на втором телефоне.",u.className=`vr-status-line ${h.error?"warn":f?"good":""}`;const m=ce==null?void 0:ce.info();et("#vr-hand-cam-btn").textContent=m!=null&&m.running?"Камера маяка вкл.":"Камера маяка (опц.)",et("#vr-hand-camera").hidden=!(m!=null&&m.running),et("#vr-hand-cal1").disabled=!f,et("#vr-hand-cal2").disabled=!f||Ee.calibratedStep<1;const x=et("#vr-hand-cal-status"),g=m!=null&&m.running?` Маяк в камере: ${m.status==="pair"?"видна пара пятен":m.status==="single"?"видно одно пятно":"пока не в кадре"}.`:"";x.textContent=(uo||(Ee.calibratedStep>=2?"Калибровка двух жестов готова.":Ee.calibratedStep===1?"Шаг 1 записан — согните руку в локте и нажмите Жест 2.":f?"Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).":"Сначала подключите браслет."))+g,x.className=`vr-status-line ${Ee.calibratedStep>=2?"good":""}`}et("#vr-start").disabled=!s||Vi;const l=et("#vr-status");return l.textContent=Vi?"Надевайте очки и смотрите прямо перед собой…":e.fresh?jt.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":jt.mode==="hand"&&!s?"Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.":jt.mode==="hand"?"Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.":jt.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп очков.",l.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function Ud(){if(Tt.phase==="inspect"){jr("Сначала завершите осмотр находки.");return}const i=et("#vr-dialog");if(i.open)return;const t=bn();t.gyro.permission==="granted"&&!t.gyro.listening&&t.gyro.start(),Je(),i.showModal()}async function hM(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function uM(i=!1){i&&(Ic=et("#low-quality").checked,wl=jt.quality==="low",ot.low!==wl&&ot.setQuality(wl))}function Nd(i=!1){if(!Le)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==Jr)&&(Jr=t,ot.setVrStereo(t))}async function Fd(){if(Le||Tt.phase==="inspect")return!1;const i=bn(),t=jt.mode==="hand",e=et("#vr-dialog");if(i.setMode(jt.mode==="fusion"?"fusion":"gyro"),e.open&&(Pc=!0,e.close(),Pc=!1),uM(!0),i.start(),t){li();const n=performance.now();Ee.recenterOnSessionStart(n),Ee.onPhaseChange("search",n)}return Le=!0,ei=Tt.taps*(Cc/3),ni=!1,oi=!1,Gn.reset(),document.body.classList.add("vr-active"),ot.setVrBodyActive(!0),ot.setVrHandMode(t),Jr=!1,Nd(!0),ot.setHeadLook(0,0),ot.updateVrHand(0,{visible:!0,handSide:jt.handSide,headLook:ot.headLook,phase:Tt.phase}),ot.resize(),!0}async function fM(){if(Vi||!Je().ready)return;await hM();const i=++fo,t=et("#vr-dialog"),e=et("#vr-countdown");Vi=!0,e.hidden=!1,Je();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==fo||!t.open){Vi=!1,e.hidden=!0;return}Vi=!1,e.hidden=!0,await Fd()}function Io(i="gesture"){var t;return!oi||Tt.phase!=="inspect"||Tt.reviewing?!1:((t=ot.revealState)!=null&&t.ready||(ot.finishReveal(),qi()),oi=!1,Gn.reset(),gs(!0,{fromVr:!0}),ei=0,ni=!1,!0)}function Pr(i="exit"){var t;if(!Le)return!1;oi&&Io("exit"),Le=!1,fo++,Vi=!1,et("#vr-countdown").hidden=!0,Re==null||Re.stop(),ce==null||ce.stop(),ot.setVrBodyActive(!1),ot.setVrHandMode(!1),ot.setVrStereo(!1),ot.setHeadLook(0,0),Jr=!1,ei=0,ni=!1,Gn.reset(),document.body.classList.remove("vr-active","vr-single"),ot.low!==Ic&&ot.setQuality(Ic);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),ot.resize(),Zi(),po?(po=!1,Cd(),et("#complete-dialog").showModal()):i!=="hidden"&&Tt.phase!=="inspect"&&jr("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function Dc(i){const t=Re.update(i);return ot.setHeadLook(t.yaw,t.pitch),t}function xo(i,t=performance.now()){var r,a,o,l,c;if(!Le||!Re)return;const e=Dc(i),n=Cc/3;if(jt.mode==="hand"){li(),ce==null||ce.process(!1,t);const h=(ce==null?void 0:ce.sample(t))||null,f=ot.handHitsBin(),d=Ee.update(i,{beacon:h,headLook:ot.headLook,phase:Tt.phase,revealReady:!!((r=ot.revealState)!=null&&r.ready),handOverBin:f,now:t});if(ot.updateVrHand(i,{visible:!0,handTracked:d.trackingSource!=="idle",handSide:d.handSide,headLook:ot.headLook,torsoYaw:d.torsoYaw,shoulderPos:d.shoulderPos,elbowPos:d.elbowPos,pos:d.pos,vel:d.vel,qArm:d.qArm,reach:d.reach,elbowBendDeg:d.elbowBendDeg,overBin:f,phase:Tt.phase,calmLowerProgress:d.calmLowerProgress,beaconActive:d.trackingSource==="gyro+beacon"}),Tt.phase==="search"){Gn.reset(),ni=f&&d.reach>=.62;for(let u=0;u<d.pokes&&Tt.phase==="search";u++)go()}else if(Tt.phase==="inspect"){ni=!1,ot.setHandItemRotation(d.itemRot.x,d.itemRot.y,d.itemRot.z,d.itemQuat);const u=ot.handInspectHeadBase?Math.atan2(Math.sin(e.yaw-ot.handInspectHeadBase.yaw),Math.cos(e.yaw-ot.handInspectHeadBase.yaw)):e.yaw,m=(((a=Ee.lastSensor)==null?void 0:a.rotRate)||0)<90&&(((o=Ee.lastSensor)==null?void 0:o.linMag)||0)<2.2;d.decision==="discard"?(oi=!1,Gn.reset(),ot.launchDiscardToss(d.throwVel),gs(!1,{fromVr:!0}),Ee.onPhaseChange("search",t)):(d.decision==="keep"||(l=ot.revealState)!=null&&l.ready&&m&&Gn.update(u,t))&&(oi=!1,Gn.reset(),gs(!0,{fromVr:!0}),Ee.onPhaseChange("search",t))}return}const s=ot.vrInspectLock&&ot.headInspectBase?ot.headInspectBase:ot.headLook;if(ot.updateVrHand(i,{visible:!0,handSide:jt.handSide,headLook:s,phase:Tt.phase}),Tt.phase==="search")if(Gn.reset(),ni=ot.gazeHitsBin(),ni){ei=Math.min(Cc,ei+i);const h=Math.min(3,Math.floor(ei/n+1e-9));for(;Tt.phase==="search"&&Tt.taps<h;){const f=Tt.taps;if(go(),Tt.phase==="search"&&Tt.taps===f)break}}else ei=Math.max(Tt.taps*n,ei-i*1.5);else Tt.phase==="inspect"&&oi&&(ni=!1,(c=ot.revealState)!=null&&c.ready&&Gn.update(e.yaw,t)&&Io("gesture"))}function cs(){return{active:Le,stereo:Jr,settings:{...jt},focus:+ei.toFixed(3),gazeHit:ni,pendingSave:oi,pendingCompletion:po,shake:Gn.info(),look:(Re==null?void 0:Re.info())||null,wrist:Ee?{link:(Ye==null?void 0:Ye.status())||null,beacon:(ce==null?void 0:ce.info())||null,hand:Ee.snapshot()}:null,world:(ot==null?void 0:ot.vrInfo())||null}}function mf(i,t,e=10,n=.03){const s=bn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),Le?xo(0,r.lastAt):Dc(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),Le?xo(n,r.lastAt):Dc(n);return ot.update(0),r.lastAt=performance.now(),cs()}function Od(i){if(Ac=requestAnimationFrame(Od),ms.some(n=>n.open)){et("#vr-dialog").open&&!rr&&(Re==null||Re.processPrep(),jt.mode==="hand"&&(ce==null||ce.process()),Je()),us=i;return}if(rr||ot.testRevealHold){us=i;return}const t=us?(i-us)/1e3:.016;us=i;const e=Math.min(t,.1);Le&&xo(e,i),ot.update(e,t),qi(),Le||eM()}function dM(){Pn("[data-pose]").forEach(t=>t.addEventListener("click",()=>{ot.setPose(t.dataset.pose),mo()})),et("#zoom-in").addEventListener("click",()=>{ot.setZoom(.2),Fr()}),et("#zoom-out").addEventListener("click",()=>{ot.setZoom(-.2),Fr()}),et("#zoom-reset").addEventListener("click",()=>{ot.setZoom(1-ot.zoom),Fr()}),et("#search-button").addEventListener("click",go),et("#discard").addEventListener("click",()=>gs(!1)),et("#keep").addEventListener("click",()=>gs(!0)),et("#close-review").addEventListener("click",ff),et("#open-collection").addEventListener("click",Lc),et("#open-settings").addEventListener("click",()=>{et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1,et("#settings-dialog").showModal()}),et("#open-vr").addEventListener("click",Ud),Pn("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{const e=t.dataset.vrMode;jt.mode=e==="fusion"?"fusion":e==="hand"?"hand":"gyro",Nr(),In=null,Ai="",jt.mode!=="hand"&&(ce==null||ce.stop()),bn().setMode(jt.mode==="fusion"?"fusion":"gyro"),Je()})),et("#vr-gyro-btn").addEventListener("click",async()=>{Ai="",await bn().requestGyro(),Je()}),et("#vr-start-camera").addEventListener("click",async()=>{Ai="";const t=bn();t.tracker.error=null,await t.startCamera(),Je()}),Pn(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";Ai="",In=In===e?null:e,Je()})),et("#vr-camera").addEventListener("click",t=>{if(!In)return;const e=bn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(In==="left"?jt.leftHue=Math.round(n.hue):jt.rightHue=Math.round(n.hue),e.setHues(jt.leftHue,jt.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Nr(),Ai="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",In=null,e.tracker.process(!0),Je())}),et("#vr-calibrate").addEventListener("click",()=>{const t=bn();t.tracker.process(!0);const e=t.tracker.calibrate();Ai=e.ok?"":e.message,Je()}),Pn("[data-hand-side]").forEach(t=>t.addEventListener("click",()=>hh(t.dataset.handSide))),et("#vr-hand-room-btn").addEventListener("click",async()=>{var t;li(),uo="",await Ye.startFirebase(((t=et("#vr-hand-fb"))==null?void 0:t.value)||"",jt.handSide),Je()}),et("#vr-hand-demo-btn").addEventListener("click",()=>{li(),uo="",Ye.startDemo("111111",jt.handSide),Je()}),et("#vr-hand-cam-btn").addEventListener("click",async()=>{const t=Dd();t.running?t.stop():await t.start(et("#vr-hand-camera")),Je()}),et("#vr-hand-cal1").addEventListener("click",()=>Kr("pose1")),et("#vr-hand-cal2").addEventListener("click",()=>Kr("pose2")),et("#vr-start").addEventListener("click",fM),et("#vr-quality").value=jt.quality,et("#vr-quality").addEventListener("change",t=>{jt.quality=t.target.value,Nr()}),Pn("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),ms.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{Be=null,us=0,t.id==="vr-dialog"&&!Pc&&!Le&&(fo++,Vi=!1,et("#vr-countdown").hidden=!0,In=null,Ai="",Re==null||Re.stop(),ce==null||ce.stop())})}),Pn("[data-filter]").forEach(t=>t.addEventListener("click",()=>{Tc=t.dataset.filter,Pn("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),Pd()})),et("#low-quality").addEventListener("change",t=>{ot.setQuality(t.target.checked),ot.update(.016);try{fi.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),et("#reset-button").addEventListener("click",()=>{et("#reset-confirm").hidden=!1,et("#reset-button").hidden=!0}),et("#reset-cancel").addEventListener("click",()=>{et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1}),et("#reset-yes").addEventListener("click",Id),et("#continue-button").addEventListener("click",()=>et("#complete-dialog").close()),et("#view-complete").addEventListener("click",()=>{et("#complete-dialog").close(),Lc()});const i=et("#world");i.addEventListener("pointerdown",t=>{if(Le){clearTimeout(br),br=setTimeout(()=>Pr("long-press"),900);return}ms.some(e=>e.open)||Be||!t.isPrimary||(Tt.phase==="inspect"&&(ot.finishReveal(),qi()),Be={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!Be||Be.id!==t.pointerId)return;const e=t.clientX-Be.x,n=t.clientY-Be.y;Math.hypot(t.clientX-Be.startX,t.clientY-Be.startY)>10&&(Be.moved=!0,Tt.phase!=="inspect"&&!Le&&iM()),Tt.phase==="inspect"?(ot.rotate(e,n),mo()):Le||ot.lookBy(e,n),Be.x=t.clientX,Be.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout(br),!Be||Be.id!==t.pointerId)return;const e=!Be.moved;Be=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&Tt.phase==="search"&&ot.hitBin(t.clientX,t.clientY)&&go()}),i.addEventListener("pointercancel",()=>{clearTimeout(br),Be=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout(br),Be=null}),document.addEventListener("visibilitychange",()=>{rr=document.hidden,Be=null,us=0,document.hidden&&Le&&Pr("hidden")}),window.addEventListener("blur",()=>Be=null),window.addEventListener("resize",()=>{ot.resize(),Le&&Nd(),ms.some(t=>t.open)&&ot.update(.016)}),document.addEventListener("fullscreenchange",()=>{Le&&!document.fullscreenElement&&Pr("fullscreen")}),window.addEventListener("pagehide",()=>{var t;oi?Io("pagehide"):Le&&Tt.phase==="inspect"&&!Tt.reviewing&&((t=ot.revealState)!=null&&t.ready||(ot.finishReveal(),qi()),gs(!0,{fromVr:!0})),Le&&(Re==null||Re.stop()),ce==null||ce.stop(),Ye==null||Ye.stop()}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&Le){t.preventDefault(),Pr("escape");return}t.key==="Escape"&&!ms.some(e=>e.open)&&Tt.phase==="inspect"&&(t.preventDefault(),Tt.reviewing?ff():(ot.finishReveal(),qi(),gs(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),rr=!0,et("#webgl-error").hidden=!1})}async function pM(){try{ot=new s_(et("#world"));try{fi.getItem("white-night-quality")==="low"&&(ot.setQuality(!0),et("#low-quality").checked=!0)}catch{}dM(),Zi(),await Promise.all([document.fonts.ready,Zv()]),ot.update(.016),et("#loading").hidden=!0,window.__READY__=!0,Ac=requestAnimationFrame(Od),uf&&(window.__WORLD__=ot),uf&&(window.__GAME_TEST__={getState:()=>structuredClone(Tt),getMetrics:()=>ot.metrics(),settle:()=>{ot.finishReveal(),ot.kick=0,ot.dirty=!0,ot.update(.016),qi()},seekReveal:i=>{ot.testRevealHold=!0,ot.reveal=Math.max(0,Math.min(1,i)),ot.applyReveal(),ot.dirty=!0,ot.update(0),qi()},setPose:i=>{ot.setPose(i),ot.update(.1),mo()},getRotation:()=>({x:ot.targetX,y:ot.targetY}),binScreen:()=>ot.binScreen(),forceNext:i=>{if(!gn.some(t=>t.id===i))throw Error("unknown item");Rc=i},setView:i=>{const t=ot.setView(i);return ot.update(.016),t},look:(i,t)=>(ot.lookBy(0,0),ot.headLook.yaw=K_(i,-41,41)*Math.PI/180,ot.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,ot.applyCameraPose(),ot.dirty=!0,ot.update(.016),ot.lookInfo()),sky:()=>({stars:ot.sky.stars.geometry.attributes.position.count,moon:ot.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:ot.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{ms.forEach(i=>i.close()),Id()},setCollection:i=>{Tt=Zr({collection:i,searches:i.length}),ot.hide(),Po(),Zi()},isPaused:()=>rr,items:gn.map(i=>i.id),scene:()=>({staticVisible:ot.static.visible,drawCalls:ot.renderer.info.render.calls,headLook:ot.lookInfo(),sky:{stars:ot.sky.stars.geometry.attributes.position.count,moonVisible:ot.sky.moon.visible}}),vr:{info:()=>cs(),open:()=>Ud(),setMode:i=>(jt.mode=i==="fusion"?"fusion":i==="hand"?"hand":"gyro",Nr(),jt.mode!=="hand"&&(ce==null||ce.stop()),bn().setMode(jt.mode==="fusion"?"fusion":"gyro"),Je(),cs()),setHandSide:i=>(hh(i),cs()),requestGyro:()=>bn().requestGyro(),gyro:(i,t,e=10,n=.03)=>mf(i,t,e,n),marker:(i,t)=>bn().tracker.inject(i,t),calibrate:i=>bn().tracker.calibrate(i),wristDemo:i=>(li(),Ye.startDemo(i||"111111",jt.handSide)),wristPacket:(i,t=performance.now())=>(li(),Ye.injectPacket(i,t),cs()),wristBeacon:(i,t=performance.now())=>(li(),Dd().inject(i,t)),wristCalibrateStretch:()=>Kr("pose1"),wristCalibrateBend:()=>Kr("pose2"),start:()=>Fd(),stop:()=>Pr("test"),step:(i=.1,t)=>{let e=Math.max(0,i),n=t;for(;e>0;){const s=Math.min(.05,e);n!==void 0&&(n+=s*1e3),Re&&(Re.gyro.lastAt=performance.now()),xo(s,n!==void 0?n:performance.now()),e-=s}return ot.update(0),cs()},shake:(i=25)=>{for(const t of[-i,i,-i])mf(t,0,10,.03);return cs()},settings:()=>({...jt}),finish:()=>Io("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),et("#loading").hidden=!0,et("#webgl-error").hidden=!1,cancelAnimationFrame(Ac)}}pM();
