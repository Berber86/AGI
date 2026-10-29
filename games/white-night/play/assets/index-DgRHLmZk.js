(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pc="180",Nf=0,uh=1,Ff=2,ld=1,cd=2,bi=3,qi=0,an=1,Be=2,hn=0,Js=1,zr=2,dh=3,fh=4,hd=5,Ai=100,Of=101,zf=102,Bf=103,kf=104,Ml=200,Hf=201,Gf=202,Vf=203,Sl=204,bl=205,ud=206,Wf=207,dd=208,Xf=209,qf=210,Yf=211,$f=212,Zf=213,Jf=214,wl=0,Tl=1,El=2,js=3,Al=4,Rl=5,Cl=6,Pl=7,Ic=0,Kf=1,jf=2,Vi=0,fd=1,pd=2,md=3,Lc=4,gd=5,vd=6,xd=7,_d=300,Qs=301,tr=302,Il=303,Ll=304,vo=306,li=1e3,ds=1001,Dl=1002,dn=1003,Qf=1004,na=1005,ii=1006,Do=1007,fs=1008,ci=1009,yd=1010,Md=1011,Br=1012,Dc=1013,vs=1014,qn=1015,hi=1016,Uc=1017,Nc=1018,er=1020,Sd=35902,bd=35899,wd=1021,Td=1022,Fn=1023,kr=1026,nr=1027,xo=1028,Fc=1029,Ed=1030,Oc=1031,zc=1033,qa=33776,Ya=33777,$a=33778,Za=33779,Ul=35840,Nl=35841,Fl=35842,Ol=35843,zl=36196,Bl=37492,kl=37496,Hl=37808,Gl=37809,Vl=37810,Wl=37811,Xl=37812,ql=37813,Yl=37814,$l=37815,Zl=37816,Jl=37817,Kl=37818,jl=37819,Ql=37820,tc=37821,ec=36492,nc=36494,ic=36495,sc=36283,rc=36284,ac=36285,oc=36286,t0=3200,e0=3201,_o=0,n0=1,gn="",Ye="srgb",ir="srgb-linear",to="linear",xe="srgb",bs=7680,ph=519,i0=512,s0=513,r0=514,Ad=515,a0=516,o0=517,l0=518,c0=519,lc=35044,ia=35048,mh="300 es",si=2e3,eo=2001;class lr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let gh=1234567;const Lr=Math.PI/180,Hr=180/Math.PI;function ri(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[i&255]+en[i>>8&255]+en[i>>16&255]+en[i>>24&255]+"-"+en[t&255]+en[t>>8&255]+"-"+en[t>>16&15|64]+en[t>>24&255]+"-"+en[e&63|128]+en[e>>8&255]+"-"+en[e>>16&255]+en[e>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function le(i,t,e){return Math.max(t,Math.min(e,i))}function Bc(i,t){return(i%t+t)%t}function h0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function u0(i,t,e){return i!==t?(e-i)/(t-i):0}function Dr(i,t,e){return(1-e)*i+e*t}function d0(i,t,e,n){return Dr(i,t,1-Math.exp(-e*n))}function f0(i,t=1){return t-Math.abs(Bc(i,t*2)-t)}function p0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function m0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function g0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function v0(i,t){return i+Math.random()*(t-i)}function x0(i){return i*(.5-Math.random())}function _0(i){i!==void 0&&(gh=i);let t=gh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function y0(i){return i*Lr}function M0(i){return i*Hr}function S0(i){return(i&i-1)===0&&i!==0}function b0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function w0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function T0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),p=a((t-n)/2),u=r((n-t)/2),m=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*d,l*p,o*c);break;case"YZY":i.set(l*p,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*p,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*u,o*c);break;case"YXY":i.set(l*u,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Xn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _e(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ne={DEG2RAD:Lr,RAD2DEG:Hr,generateUUID:ri,clamp:le,euclideanModulo:Bc,mapLinear:h0,inverseLerp:u0,lerp:Dr,damp:d0,pingpong:f0,smoothstep:p0,smootherstep:m0,randInt:g0,randFloat:v0,randFloatSpread:x0,seededRandom:_0,degToRad:y0,radToDeg:M0,isPowerOfTwo:S0,ceilPowerOfTwo:b0,floorPowerOfTwo:w0,setQuaternionFromProperEuler:T0,normalize:_e,denormalize:Xn};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fe{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const p=r[a+0],u=r[a+1],m=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=p,t[e+1]=u,t[e+2]=m,t[e+3]=v;return}if(d!==v||l!==p||c!==u||h!==m){let g=1-o;const f=l*p+c*u+h*m+d*v,x=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const T=Math.sqrt(y),b=Math.atan2(T,f*x);g=Math.sin(g*b)/T,o=Math.sin(o*b)/T}const _=o*x;if(l=l*g+p*_,c=c*g+u*_,h=h*g+m*_,d=d*g+v*_,g===1-o){const T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],p=r[a+1],u=r[a+2],m=r[a+3];return t[e]=o*m+h*d+l*u-c*p,t[e+1]=l*m+h*p+c*d-o*u,t[e+2]=c*m+h*u+o*p-l*d,t[e+3]=h*m-o*d-l*p-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),p=l(n/2),u=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=p*h*d+c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d-p*u*m;break;case"YXZ":this._x=p*h*d+c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d+p*u*m;break;case"ZXY":this._x=p*h*d-c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d-p*u*m;break;case"ZYX":this._x=p*h*d-c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d+p*u*m;break;case"YZX":this._x=p*h*d+c*u*m,this._y=c*u*d+p*h*m,this._z=c*h*m-p*u*d,this._w=c*h*d-p*u*m;break;case"XZY":this._x=p*h*d-c*u*m,this._y=c*u*d-p*h*m,this._z=c*h*m+p*u*d,this._w=c*h*d+p*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],p=n+o+d;if(p>0){const u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(n>o&&n>d){const u=2*Math.sqrt(1+n-o-d);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>d){const u=2*Math.sqrt(1+o-n-d);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+d-n-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-e;return this._w=u*a+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,p=Math.sin(e*h)/c;return this._w=a*d+this._w*p,this._x=n*d+this._x*p,this._y=s*d+this._y*p,this._z=r*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(t=0,e=0,n=0){I.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Uo.copy(this).projectOnVector(t),this.sub(Uo)}reflect(t){return this.sub(Uo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Uo=new I,vh=new Fe;class ae{constructor(t,e,n,s,r,a,o,l,c){ae.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],p=n[2],u=n[5],m=n[8],v=s[0],g=s[3],f=s[6],x=s[1],y=s[4],_=s[7],T=s[2],b=s[5],w=s[8];return r[0]=a*v+o*x+l*T,r[3]=a*g+o*y+l*b,r[6]=a*f+o*_+l*w,r[1]=c*v+h*x+d*T,r[4]=c*g+h*y+d*b,r[7]=c*f+h*_+d*w,r[2]=p*v+u*x+m*T,r[5]=p*g+u*y+m*b,r[8]=p*f+u*_+m*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,p=o*l-h*r,u=c*r-a*l,m=e*d+n*p+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=d*v,t[1]=(s*c-h*n)*v,t[2]=(o*n-s*a)*v,t[3]=p*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=u*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(No.makeScale(t,e)),this}rotate(t){return this.premultiply(No.makeRotation(-t)),this}translate(t,e){return this.premultiply(No.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const No=new ae;function Rd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Gr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function E0(){const i=Gr("canvas");return i.style.display="block",i}const xh={};function Vr(i){i in xh||(xh[i]=!0,console.warn(i))}function A0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const _h=new ae().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yh=new ae().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function R0(){const i={enabled:!0,workingColorSpace:ir,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===xe&&(s.r=Pi(s.r),s.g=Pi(s.g),s.b=Pi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xe&&(s.r=Ks(s.r),s.g=Ks(s.g),s.b=Ks(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===gn?to:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Vr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Vr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ir]:{primaries:t,whitePoint:n,transfer:to,toXYZ:_h,fromXYZ:yh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ye},outputColorSpaceConfig:{drawingBufferColorSpace:Ye}},[Ye]:{primaries:t,whitePoint:n,transfer:xe,toXYZ:_h,fromXYZ:yh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ye}}}),i}const me=R0();function Pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ks(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ws;class C0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ws===void 0&&(ws=Gr("canvas")),ws.width=t.width,ws.height=t.height;const s=ws.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=ws}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Gr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Pi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Pi(e[n]/255)*255):e[n]=Pi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let P0=0;class kc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:P0++}),this.uuid=ri(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Fo(s[a].image)):r.push(Fo(s[a]))}else r=Fo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?C0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let I0=0;const Oo=new I;class je extends lr{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=ds,s=ds,r=ii,a=fs,o=Fn,l=ci,c=je.DEFAULT_ANISOTROPY,h=gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:I0++}),this.uuid=ri(),this.name="",this.source=new kc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ae,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Oo).x}get height(){return this.source.getSize(Oo).y}get depth(){return this.source.getSize(Oo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_d)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case li:t.x=t.x-Math.floor(t.x);break;case ds:t.x=t.x<0?0:1;break;case Dl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case li:t.y=t.y-Math.floor(t.y);break;case ds:t.y=t.y<0?0:1;break;case Dl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=_d;je.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,n=0,s=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],p=l[1],u=l[5],m=l[9],v=l[2],g=l[6],f=l[10];if(Math.abs(h-p)<.01&&Math.abs(d-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+p)<.1&&Math.abs(d+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,_=(u+1)/2,T=(f+1)/2,b=(h+p)/4,w=(d+v)/4,E=(m+g)/4;return y>_&&y>T?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=b/n,r=w/n):_>T?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=b/s,r=E/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=w/r,s=E/r),this.set(n,s,r,e),this}let x=Math.sqrt((g-m)*(g-m)+(d-v)*(d-v)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(d-v)/x,this.z=(p-h)/x,this.w=Math.acos((c+u+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class L0 extends lr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ii,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new je(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ii,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new kc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class En extends L0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Cd extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=ds,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class D0 extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=ds,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yn{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Bn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Bn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Bn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Bn):Bn.fromBufferAttribute(r,a),Bn.applyMatrix4(t.matrixWorld),this.expandByPoint(Bn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),sa.copy(n.boundingBox)),sa.applyMatrix4(t.matrixWorld),this.union(sa)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Bn),Bn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(dr),ra.subVectors(this.max,dr),Ts.subVectors(t.a,dr),Es.subVectors(t.b,dr),As.subVectors(t.c,dr),Di.subVectors(Es,Ts),Ui.subVectors(As,Es),ji.subVectors(Ts,As);let e=[0,-Di.z,Di.y,0,-Ui.z,Ui.y,0,-ji.z,ji.y,Di.z,0,-Di.x,Ui.z,0,-Ui.x,ji.z,0,-ji.x,-Di.y,Di.x,0,-Ui.y,Ui.x,0,-ji.y,ji.x,0];return!zo(e,Ts,Es,As,ra)||(e=[1,0,0,0,1,0,0,0,1],!zo(e,Ts,Es,As,ra))?!1:(aa.crossVectors(Di,Ui),e=[aa.x,aa.y,aa.z],zo(e,Ts,Es,As,ra))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Bn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Bn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const mi=[new I,new I,new I,new I,new I,new I,new I,new I],Bn=new I,sa=new Yn,Ts=new I,Es=new I,As=new I,Di=new I,Ui=new I,ji=new I,dr=new I,ra=new I,aa=new I,Qi=new I;function zo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Qi.fromArray(i,r);const o=s.x*Math.abs(Qi.x)+s.y*Math.abs(Qi.y)+s.z*Math.abs(Qi.z),l=t.dot(Qi),c=e.dot(Qi),h=n.dot(Qi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const U0=new Yn,fr=new I,Bo=new I;class Ms{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):U0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;fr.subVectors(t,this.center);const e=fr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(fr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Bo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(fr.copy(t.center).add(Bo)),this.expandByPoint(fr.copy(t.center).sub(Bo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const gi=new I,ko=new I,oa=new I,Ni=new I,Ho=new I,la=new I,Go=new I;class Hc{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=gi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gi.copy(this.origin).addScaledVector(this.direction,e),gi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ko.copy(t).add(e).multiplyScalar(.5),oa.copy(e).sub(t).normalize(),Ni.copy(this.origin).sub(ko);const r=t.distanceTo(e)*.5,a=-this.direction.dot(oa),o=Ni.dot(this.direction),l=-Ni.dot(oa),c=Ni.lengthSq(),h=Math.abs(1-a*a);let d,p,u,m;if(h>0)if(d=a*l-o,p=a*o-l,m=r*h,d>=0)if(p>=-m)if(p<=m){const v=1/h;d*=v,p*=v,u=d*(d+a*p+2*o)+p*(a*d+p+2*l)+c}else p=r,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;else p=-r,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;else p<=-m?(d=Math.max(0,-(-a*r+o)),p=d>0?-r:Math.min(Math.max(-r,-l),r),u=-d*d+p*(p+2*l)+c):p<=m?(d=0,p=Math.min(Math.max(-r,-l),r),u=p*(p+2*l)+c):(d=Math.max(0,-(a*r+o)),p=d>0?r:Math.min(Math.max(-r,-l),r),u=-d*d+p*(p+2*l)+c);else p=a>0?-r:r,d=Math.max(0,-(a*p+o)),u=-d*d+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ko).addScaledVector(oa,p),u}intersectSphere(t,e){gi.subVectors(t.center,this.origin);const n=gi.dot(this.direction),s=gi.dot(gi)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,p=this.origin;return c>=0?(n=(t.min.x-p.x)*c,s=(t.max.x-p.x)*c):(n=(t.max.x-p.x)*c,s=(t.min.x-p.x)*c),h>=0?(r=(t.min.y-p.y)*h,a=(t.max.y-p.y)*h):(r=(t.max.y-p.y)*h,a=(t.min.y-p.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-p.z)*d,l=(t.max.z-p.z)*d):(o=(t.max.z-p.z)*d,l=(t.min.z-p.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,gi)!==null}intersectTriangle(t,e,n,s,r){Ho.subVectors(e,t),la.subVectors(n,t),Go.crossVectors(Ho,la);let a=this.direction.dot(Go),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ni.subVectors(this.origin,t);const l=o*this.direction.dot(la.crossVectors(Ni,la));if(l<0)return null;const c=o*this.direction.dot(Ho.cross(Ni));if(c<0||l+c>a)return null;const h=-o*Ni.dot(Go);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $t{constructor(t,e,n,s,r,a,o,l,c,h,d,p,u,m,v,g){$t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,p,u,m,v,g)}set(t,e,n,s,r,a,o,l,c,h,d,p,u,m,v,g){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=p,f[3]=u,f[7]=m,f[11]=v,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $t().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Rs.setFromMatrixColumn(t,0).length(),r=1/Rs.setFromMatrixColumn(t,1).length(),a=1/Rs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const p=a*h,u=a*d,m=o*h,v=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=u+m*c,e[5]=p-v*c,e[9]=-o*l,e[2]=v-p*c,e[6]=m+u*c,e[10]=a*l}else if(t.order==="YXZ"){const p=l*h,u=l*d,m=c*h,v=c*d;e[0]=p+v*o,e[4]=m*o-u,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=u*o-m,e[6]=v+p*o,e[10]=a*l}else if(t.order==="ZXY"){const p=l*h,u=l*d,m=c*h,v=c*d;e[0]=p-v*o,e[4]=-a*d,e[8]=m+u*o,e[1]=u+m*o,e[5]=a*h,e[9]=v-p*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const p=a*h,u=a*d,m=o*h,v=o*d;e[0]=l*h,e[4]=m*c-u,e[8]=p*c+v,e[1]=l*d,e[5]=v*c+p,e[9]=u*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const p=a*l,u=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=v-p*d,e[8]=m*d+u,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=u*d+m,e[10]=p-v*d}else if(t.order==="XZY"){const p=a*l,u=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=p*d+v,e[5]=a*h,e[9]=u*d-m,e[2]=m*d-u,e[6]=o*h,e[10]=v*d+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(N0,t,F0)}lookAt(t,e,n){const s=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Fi.crossVectors(n,Mn),Fi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Fi.crossVectors(n,Mn)),Fi.normalize(),ca.crossVectors(Mn,Fi),s[0]=Fi.x,s[4]=ca.x,s[8]=Mn.x,s[1]=Fi.y,s[5]=ca.y,s[9]=Mn.y,s[2]=Fi.z,s[6]=ca.z,s[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],p=n[9],u=n[13],m=n[2],v=n[6],g=n[10],f=n[14],x=n[3],y=n[7],_=n[11],T=n[15],b=s[0],w=s[4],E=s[8],M=s[12],S=s[1],R=s[5],D=s[9],L=s[13],N=s[2],O=s[6],F=s[10],H=s[14],B=s[3],X=s[7],G=s[11],Q=s[15];return r[0]=a*b+o*S+l*N+c*B,r[4]=a*w+o*R+l*O+c*X,r[8]=a*E+o*D+l*F+c*G,r[12]=a*M+o*L+l*H+c*Q,r[1]=h*b+d*S+p*N+u*B,r[5]=h*w+d*R+p*O+u*X,r[9]=h*E+d*D+p*F+u*G,r[13]=h*M+d*L+p*H+u*Q,r[2]=m*b+v*S+g*N+f*B,r[6]=m*w+v*R+g*O+f*X,r[10]=m*E+v*D+g*F+f*G,r[14]=m*M+v*L+g*H+f*Q,r[3]=x*b+y*S+_*N+T*B,r[7]=x*w+y*R+_*O+T*X,r[11]=x*E+y*D+_*F+T*G,r[15]=x*M+y*L+_*H+T*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],p=t[10],u=t[14],m=t[3],v=t[7],g=t[11],f=t[15];return m*(+r*l*d-s*c*d-r*o*p+n*c*p+s*o*u-n*l*u)+v*(+e*l*u-e*c*p+r*a*p-s*a*u+s*c*h-r*l*h)+g*(+e*c*d-e*o*u-r*a*d+n*a*u+r*o*h-n*c*h)+f*(-s*o*h-e*l*d+e*o*p+s*a*d-n*a*p+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],p=t[10],u=t[11],m=t[12],v=t[13],g=t[14],f=t[15],x=d*g*c-v*p*c+v*l*u-o*g*u-d*l*f+o*p*f,y=m*p*c-h*g*c-m*l*u+a*g*u+h*l*f-a*p*f,_=h*v*c-m*d*c+m*o*u-a*v*u-h*o*f+a*d*f,T=m*d*l-h*v*l-m*o*p+a*v*p+h*o*g-a*d*g,b=e*x+n*y+s*_+r*T;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return t[0]=x*w,t[1]=(v*p*r-d*g*r-v*s*u+n*g*u+d*s*f-n*p*f)*w,t[2]=(o*g*r-v*l*r+v*s*c-n*g*c-o*s*f+n*l*f)*w,t[3]=(d*l*r-o*p*r-d*s*c+n*p*c+o*s*u-n*l*u)*w,t[4]=y*w,t[5]=(h*g*r-m*p*r+m*s*u-e*g*u-h*s*f+e*p*f)*w,t[6]=(m*l*r-a*g*r-m*s*c+e*g*c+a*s*f-e*l*f)*w,t[7]=(a*p*r-h*l*r+h*s*c-e*p*c-a*s*u+e*l*u)*w,t[8]=_*w,t[9]=(m*d*r-h*v*r-m*n*u+e*v*u+h*n*f-e*d*f)*w,t[10]=(a*v*r-m*o*r+m*n*c-e*v*c-a*n*f+e*o*f)*w,t[11]=(h*o*r-a*d*r-h*n*c+e*d*c+a*n*u-e*o*u)*w,t[12]=T*w,t[13]=(h*v*s-m*d*s+m*n*p-e*v*p-h*n*g+e*d*g)*w,t[14]=(m*o*s-a*v*s-m*n*l+e*v*l+a*n*g-e*o*g)*w,t[15]=(a*d*s-h*o*s+h*n*l-e*d*l-a*n*p+e*o*p)*w,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,p=r*c,u=r*h,m=r*d,v=a*h,g=a*d,f=o*d,x=l*c,y=l*h,_=l*d,T=n.x,b=n.y,w=n.z;return s[0]=(1-(v+f))*T,s[1]=(u+_)*T,s[2]=(m-y)*T,s[3]=0,s[4]=(u-_)*b,s[5]=(1-(p+f))*b,s[6]=(g+x)*b,s[7]=0,s[8]=(m+y)*w,s[9]=(g-x)*w,s[10]=(1-(p+v))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Rs.set(s[0],s[1],s[2]).length();const a=Rs.set(s[4],s[5],s[6]).length(),o=Rs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],kn.copy(this);const c=1/r,h=1/a,d=1/o;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=d,kn.elements[9]*=d,kn.elements[10]*=d,e.setFromRotationMatrix(kn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=si,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),p=(e+t)/(e-t),u=(n+s)/(n-s);let m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===si)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===eo)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=si,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-s),p=-(e+t)/(e-t),u=-(n+s)/(n-s);let m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===si)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===eo)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Rs=new I,kn=new $t,N0=new I(0,0,0),F0=new I(1,1,1),Fi=new I,ca=new I,Mn=new I,Mh=new $t,Sh=new Fe;class xn{constructor(t=0,e=0,n=0,s=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],p=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Mh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Mh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Sh.setFromEuler(this),this.setFromQuaternion(Sh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class Gc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let O0=0;const bh=new I,Cs=new Fe,vi=new $t,ha=new I,pr=new I,z0=new I,B0=new Fe,wh=new I(1,0,0),Th=new I(0,1,0),Eh=new I(0,0,1),Ah={type:"added"},k0={type:"removed"},Ps={type:"childadded",child:null},Vo={type:"childremoved",child:null};class He extends lr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:O0++}),this.uuid=ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=He.DEFAULT_UP.clone();const t=new I,e=new xn,n=new Fe,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $t},normalMatrix:{value:new ae}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=He.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(t,e){return Cs.setFromAxisAngle(t,e),this.quaternion.premultiply(Cs),this}rotateX(t){return this.rotateOnAxis(wh,t)}rotateY(t){return this.rotateOnAxis(Th,t)}rotateZ(t){return this.rotateOnAxis(Eh,t)}translateOnAxis(t,e){return bh.copy(t).applyQuaternion(this.quaternion),this.position.add(bh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(wh,t)}translateY(t){return this.translateOnAxis(Th,t)}translateZ(t){return this.translateOnAxis(Eh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ha.copy(t):ha.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(pr,ha,this.up):vi.lookAt(ha,pr,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),Cs.setFromRotationMatrix(vi),this.quaternion.premultiply(Cs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ah),Ps.child=t,this.dispatchEvent(Ps),Ps.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(k0),Vo.child=t,this.dispatchEvent(Vo),Vo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vi.multiply(t.parent.matrixWorld)),t.applyMatrix4(vi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ah),Ps.child=t,this.dispatchEvent(Ps),Ps.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,t,z0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,B0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),p=a(t.skeletons),u=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),p.length>0&&(n.skeletons=p),u.length>0&&(n.animations=u),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}He.DEFAULT_UP=new I(0,1,0);He.DEFAULT_MATRIX_AUTO_UPDATE=!0;He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Hn=new I,xi=new I,Wo=new I,_i=new I,Is=new I,Ls=new I,Rh=new I,Xo=new I,qo=new I,Yo=new I,$o=new Me,Zo=new Me,Jo=new Me;class Un{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Hn.subVectors(t,e),s.cross(Hn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Hn.subVectors(s,e),xi.subVectors(n,e),Wo.subVectors(t,e);const a=Hn.dot(Hn),o=Hn.dot(xi),l=Hn.dot(Wo),c=xi.dot(xi),h=xi.dot(Wo),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const p=1/d,u=(c*l-o*h)*p,m=(a*h-o*l)*p;return r.set(1-u-m,m,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,_i)===null?!1:_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,_i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,_i.x),l.addScaledVector(a,_i.y),l.addScaledVector(o,_i.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return $o.setScalar(0),Zo.setScalar(0),Jo.setScalar(0),$o.fromBufferAttribute(t,e),Zo.fromBufferAttribute(t,n),Jo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector($o,r.x),a.addScaledVector(Zo,r.y),a.addScaledVector(Jo,r.z),a}static isFrontFacing(t,e,n,s){return Hn.subVectors(n,e),xi.subVectors(t,e),Hn.cross(xi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Hn.subVectors(this.c,this.b),xi.subVectors(this.a,this.b),Hn.cross(xi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Un.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Is.subVectors(s,n),Ls.subVectors(r,n),Xo.subVectors(t,n);const l=Is.dot(Xo),c=Ls.dot(Xo);if(l<=0&&c<=0)return e.copy(n);qo.subVectors(t,s);const h=Is.dot(qo),d=Ls.dot(qo);if(h>=0&&d<=h)return e.copy(s);const p=l*d-h*c;if(p<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Is,a);Yo.subVectors(t,r);const u=Is.dot(Yo),m=Ls.dot(Yo);if(m>=0&&u<=m)return e.copy(r);const v=u*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(Ls,o);const g=h*m-u*d;if(g<=0&&d-h>=0&&u-m>=0)return Rh.subVectors(r,s),o=(d-h)/(d-h+(u-m)),e.copy(s).addScaledVector(Rh,o);const f=1/(g+v+p);return a=v*f,o=p*f,e.copy(n).addScaledVector(Is,a).addScaledVector(Ls,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Oi={h:0,s:0,l:0},ua={h:0,s:0,l:0};function Ko(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=Bc(t,1),e=le(e,0,1),n=le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Ko(a,r,t+1/3),this.g=Ko(a,r,t),this.b=Ko(a,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=Ye){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ye){const n=Pd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}copyLinearToSRGB(t){return this.r=Ks(t.r),this.g=Ks(t.g),this.b=Ks(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ye){return me.workingToColorSpace(nn.copy(this),t),Math.round(le(nn.r*255,0,255))*65536+Math.round(le(nn.g*255,0,255))*256+Math.round(le(nn.b*255,0,255))}getHexString(t=Ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(nn.copy(this),e);const n=nn.r,s=nn.g,r=nn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(nn.copy(this),e),t.r=nn.r,t.g=nn.g,t.b=nn.b,t}getStyle(t=Ye){me.workingToColorSpace(nn.copy(this),t);const e=nn.r,n=nn.g,s=nn.b;return t!==Ye?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Oi),this.setHSL(Oi.h+t,Oi.s+e,Oi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Oi),t.getHSL(ua);const n=Dr(Oi.h,ua.h,e),s=Dr(Oi.s,ua.s,e),r=Dr(Oi.l,ua.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const nn=new qt;qt.NAMES=Pd;let H0=0;class Ii extends lr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:H0++}),this.uuid=ri(),this.name="",this.type="Material",this.blending=Js,this.side=qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sl,this.blendDst=bl,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=js,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ph,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bs,this.stencilZFail=bs,this.stencilZPass=bs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Js&&(n.blending=this.blending),this.side!==qi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sl&&(n.blendSrc=this.blendSrc),this.blendDst!==bl&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==js&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ph&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ke extends Ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Oe=new I,da=new ft;let G0=0;class Ce{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:G0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=lc,this.updateRanges=[],this.gpuType=qn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)da.fromBufferAttribute(this,e),da.applyMatrix3(t),this.setXY(e,da.x,da.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix3(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==lc&&(t.usage=this.usage),t}}class Id extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ld extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}}let V0=0;const Pn=new $t,jo=new He,Ds=new I,Sn=new Yn,mr=new Yn,Xe=new I;class Ae extends lr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:V0++}),this.uuid=ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Rd(t)?Ld:Id)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ae().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Pn.makeRotationFromQuaternion(t),this.applyMatrix4(Pn),this}rotateX(t){return Pn.makeRotationX(t),this.applyMatrix4(Pn),this}rotateY(t){return Pn.makeRotationY(t),this.applyMatrix4(Pn),this}rotateZ(t){return Pn.makeRotationZ(t),this.applyMatrix4(Pn),this}translate(t,e,n){return Pn.makeTranslation(t,e,n),this.applyMatrix4(Pn),this}scale(t,e,n){return Pn.makeScale(t,e,n),this.applyMatrix4(Pn),this}lookAt(t){return jo.lookAt(t),jo.updateMatrix(),this.applyMatrix4(jo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Xe.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(Xe),Xe.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(Xe)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ms);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];mr.setFromBufferAttribute(o),this.morphTargetsRelative?(Xe.addVectors(Sn.min,mr.min),Sn.expandByPoint(Xe),Xe.addVectors(Sn.max,mr.max),Sn.expandByPoint(Xe)):(Sn.expandByPoint(mr.min),Sn.expandByPoint(mr.max))}Sn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Xe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Xe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Xe.fromBufferAttribute(o,c),l&&(Ds.fromBufferAttribute(t,c),Xe.add(Ds)),s=Math.max(s,n.distanceToSquared(Xe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let E=0;E<n.count;E++)o[E]=new I,l[E]=new I;const c=new I,h=new I,d=new I,p=new ft,u=new ft,m=new ft,v=new I,g=new I;function f(E,M,S){c.fromBufferAttribute(n,E),h.fromBufferAttribute(n,M),d.fromBufferAttribute(n,S),p.fromBufferAttribute(r,E),u.fromBufferAttribute(r,M),m.fromBufferAttribute(r,S),h.sub(c),d.sub(c),u.sub(p),m.sub(p);const R=1/(u.x*m.y-m.x*u.y);isFinite(R)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(d,-u.y).multiplyScalar(R),g.copy(d).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(R),o[E].add(v),o[M].add(v),o[S].add(v),l[E].add(g),l[M].add(g),l[S].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let E=0,M=x.length;E<M;++E){const S=x[E],R=S.start,D=S.count;for(let L=R,N=R+D;L<N;L+=3)f(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const y=new I,_=new I,T=new I,b=new I;function w(E){T.fromBufferAttribute(s,E),b.copy(T);const M=o[E];y.copy(M),y.sub(T.multiplyScalar(T.dot(M))).normalize(),_.crossVectors(b,M);const R=_.dot(l[E])<0?-1:1;a.setXYZW(E,y.x,y.y,y.z,R)}for(let E=0,M=x.length;E<M;++E){const S=x[E],R=S.start,D=S.count;for(let L=R,N=R+D;L<N;L+=3)w(t.getX(L+0)),w(t.getX(L+1)),w(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,u=n.count;p<u;p++)n.setXYZ(p,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,d=new I;if(t)for(let p=0,u=t.count;p<u;p+=3){const m=t.getX(p+0),v=t.getX(p+1),g=t.getX(p+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let p=0,u=e.count;p<u;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),a.fromBufferAttribute(e,p+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Xe.fromBufferAttribute(t,e),Xe.normalize(),t.setXYZ(e,Xe.x,Xe.y,Xe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,p=new c.constructor(l.length*h);let u=0,m=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?u=l[v]*o.data.stride+o.offset:u=l[v]*h;for(let f=0;f<h;f++)p[m++]=c[u++]}return new Ce(p,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const p=c[h],u=t(p,n);l.push(u)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,p=c.length;d<p;d++){const u=c[d];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let p=0,u=d.length;p<u;p++)h.push(d[p].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ch=new $t,ts=new Hc,fa=new Ms,Ph=new I,pa=new I,ma=new I,ga=new I,Qo=new I,va=new I,Ih=new I,xa=new I;class Ft extends He{constructor(t=new Ae,e=new Ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){va.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(Qo.fromBufferAttribute(d,t),a?va.addScaledVector(Qo,h):va.addScaledVector(Qo.sub(e),h))}e.add(va)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(r),ts.copy(t.ray).recast(t.near),!(fa.containsPoint(ts.origin)===!1&&(ts.intersectSphere(fa,Ph)===null||ts.origin.distanceToSquared(Ph)>(t.far-t.near)**2))&&(Ch.copy(r).invert(),ts.copy(t.ray).applyMatrix4(Ch),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ts)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,p=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=p.length;m<v;m++){const g=p[m],f=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let _=x,T=y;_<T;_+=3){const b=o.getX(_),w=o.getX(_+1),E=o.getX(_+2);s=_a(this,f,t,n,c,h,d,b,w,E),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let g=m,f=v;g<f;g+=3){const x=o.getX(g),y=o.getX(g+1),_=o.getX(g+2);s=_a(this,a,t,n,c,h,d,x,y,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=p.length;m<v;m++){const g=p[m],f=a[g.materialIndex],x=Math.max(g.start,u.start),y=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let _=x,T=y;_<T;_+=3){const b=_,w=_+1,E=_+2;s=_a(this,f,t,n,c,h,d,b,w,E),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=m,f=v;g<f;g+=3){const x=g,y=g+1,_=g+2;s=_a(this,a,t,n,c,h,d,x,y,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function W0(i,t,e,n,s,r,a,o){let l;if(t.side===an?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===qi,o),l===null)return null;xa.copy(o),xa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(xa);return c<e.near||c>e.far?null:{distance:c,point:xa.clone(),object:i}}function _a(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,pa),i.getVertexPosition(l,ma),i.getVertexPosition(c,ga);const h=W0(i,t,e,n,pa,ma,ga,Ih);if(h){const d=new I;Un.getBarycoord(Ih,pa,ma,ga,d),s&&(h.uv=Un.getInterpolatedAttribute(s,o,l,c,d,new ft)),r&&(h.uv1=Un.getInterpolatedAttribute(r,o,l,c,d,new ft)),a&&(h.normal=Un.getInterpolatedAttribute(a,o,l,c,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:l,c,normal:new I,materialIndex:0};Un.getNormal(pa,ma,ga,p.normal),h.face=p,h.barycoord=d}return h}class An extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let p=0,u=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(d,2));function m(v,g,f,x,y,_,T,b,w,E,M){const S=_/w,R=T/E,D=_/2,L=T/2,N=b/2,O=w+1,F=E+1;let H=0,B=0;const X=new I;for(let G=0;G<F;G++){const Q=G*R-L;for(let rt=0;rt<O;rt++){const pt=rt*S-D;X[v]=pt*x,X[g]=Q*y,X[f]=N,c.push(X.x,X.y,X.z),X[v]=0,X[g]=0,X[f]=b>0?1:-1,h.push(X.x,X.y,X.z),d.push(rt/w),d.push(1-G/E),H+=1}}for(let G=0;G<E;G++)for(let Q=0;Q<w;Q++){const rt=p+Q+O*G,pt=p+Q+O*(G+1),zt=p+(Q+1)+O*(G+1),Ct=p+(Q+1)+O*G;l.push(rt,pt,Ct),l.push(pt,zt,Ct),B+=6}o.addGroup(u,B,M),u+=B,p+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function sr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function cn(i){const t={};for(let e=0;e<i.length;e++){const n=sr(i[e]);for(const s in n)t[s]=n[s]}return t}function X0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Dd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const ps={clone:sr,merge:cn};var q0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Y0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class un extends Ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=q0,this.fragmentShader=Y0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=sr(t.uniforms),this.uniformsGroups=X0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ud extends He{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zi=new I,Lh=new ft,Dh=new ft;class rn extends Ud{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Hr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Lr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Hr*2*Math.atan(Math.tan(Lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(zi.x,zi.y).multiplyScalar(-t/zi.z),zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zi.x,zi.y).multiplyScalar(-t/zi.z)}getViewSize(t,e){return this.getViewBounds(t,Lh,Dh),e.subVectors(Dh,Lh)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Lr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Us=-90,Ns=1;class $0 extends He{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new rn(Us,Ns,t,e);s.layers=this.layers,this.add(s);const r=new rn(Us,Ns,t,e);r.layers=this.layers,this.add(r);const a=new rn(Us,Ns,t,e);a.layers=this.layers,this.add(a);const o=new rn(Us,Ns,t,e);o.layers=this.layers,this.add(o);const l=new rn(Us,Ns,t,e);l.layers=this.layers,this.add(l);const c=new rn(Us,Ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===eo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),p=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,p,u),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Nd extends je{constructor(t=[],e=Qs,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Z0 extends En{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Nd(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new An(5,5,5),r=new un({name:"CubemapFromEquirect",uniforms:sr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:an,blending:hn});r.uniforms.tEquirect.value=e;const a=new Ft(s,r),o=e.minFilter;return e.minFilter===fs&&(e.minFilter=ii),new $0(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class ie extends He{constructor(){super(),this.isGroup=!0,this.type="Group"}}const J0={type:"move"};class tl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),f=this._getHandJoint(c,v);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],p=h.position.distanceTo(d.position),u=.02,m=.005;c.inputState.pinching&&p>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&p<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(J0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ie;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Vc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new qt(t),this.density=e}clone(){return new Vc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class cc extends He{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class K0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=lc,this.updateRanges=[],this.version=0,this.uuid=ri()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ln=new I;class no{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ln.fromBufferAttribute(this,e),ln.applyMatrix4(t),this.setXYZ(e,ln.x,ln.y,ln.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ln.fromBufferAttribute(this,e),ln.applyNormalMatrix(t),this.setXYZ(e,ln.x,ln.y,ln.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ln.fromBufferAttribute(this,e),ln.transformDirection(t),this.setXYZ(e,ln.x,ln.y,ln.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Xn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Xn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Xn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Xn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new no(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class hc extends Ii{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Fs;const gr=new I,Os=new I,zs=new I,Bs=new ft,vr=new ft,Fd=new $t,ya=new I,xr=new I,Ma=new I,Uh=new ft,el=new ft,Nh=new ft;class Fh extends He{constructor(t=new hc){if(super(),this.isSprite=!0,this.type="Sprite",Fs===void 0){Fs=new Ae;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new K0(e,5);Fs.setIndex([0,1,2,0,2,3]),Fs.setAttribute("position",new no(n,3,0,!1)),Fs.setAttribute("uv",new no(n,2,3,!1))}this.geometry=Fs,this.material=t,this.center=new ft(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Os.setFromMatrixScale(this.matrixWorld),Fd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),zs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Os.multiplyScalar(-zs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Sa(ya.set(-.5,-.5,0),zs,a,Os,s,r),Sa(xr.set(.5,-.5,0),zs,a,Os,s,r),Sa(Ma.set(.5,.5,0),zs,a,Os,s,r),Uh.set(0,0),el.set(1,0),Nh.set(1,1);let o=t.ray.intersectTriangle(ya,xr,Ma,!1,gr);if(o===null&&(Sa(xr.set(-.5,.5,0),zs,a,Os,s,r),el.set(0,1),o=t.ray.intersectTriangle(ya,Ma,xr,!1,gr),o===null))return;const l=t.ray.origin.distanceTo(gr);l<t.near||l>t.far||e.push({distance:l,point:gr.clone(),uv:Un.getInterpolation(gr,ya,xr,Ma,Uh,el,Nh,new ft),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Sa(i,t,e,n,s,r){Bs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(vr.x=r*Bs.x-s*Bs.y,vr.y=s*Bs.x+r*Bs.y):vr.copy(Bs),i.copy(t),i.x+=vr.x,i.y+=vr.y,i.applyMatrix4(Fd)}class Wc extends je{constructor(t=null,e=1,n=1,s,r,a,o,l,c=dn,h=dn,d,p){super(null,a,o,l,c,h,s,r,d,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oh extends Ce{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ks=new $t,zh=new $t,ba=[],Bh=new Yn,j0=new $t,_r=new Ft,yr=new Ms;class Q0 extends Ft{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Oh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,j0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Yn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ks),Bh.copy(t.boundingBox).applyMatrix4(ks),this.boundingBox.union(Bh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ms),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ks),yr.copy(t.boundingSphere).applyMatrix4(ks),this.boundingSphere.union(yr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(_r.geometry=this.geometry,_r.material=this.material,_r.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yr.copy(this.boundingSphere),yr.applyMatrix4(n),t.ray.intersectsSphere(yr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ks),zh.multiplyMatrices(n,ks),_r.matrixWorld=zh,_r.raycast(t,ba);for(let a=0,o=ba.length;a<o;a++){const l=ba[a];l.instanceId=r,l.object=this,e.push(l)}ba.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Oh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Wc(new Float32Array(s*this.count),s,this.count,xo,qn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const nl=new I,tp=new I,ep=new ae;class os{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=nl.subVectors(n,e).cross(tp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(nl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ep.getNormalMatrix(t),s=this.coplanarPoint(nl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const es=new Ms,np=new ft(.5,.5),wa=new I;class Xc{constructor(t=new os,e=new os,n=new os,s=new os,r=new os,a=new os){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=si,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],p=r[6],u=r[7],m=r[8],v=r[9],g=r[10],f=r[11],x=r[12],y=r[13],_=r[14],T=r[15];if(s[0].setComponents(c-a,u-h,f-m,T-x).normalize(),s[1].setComponents(c+a,u+h,f+m,T+x).normalize(),s[2].setComponents(c+o,u+d,f+v,T+y).normalize(),s[3].setComponents(c-o,u-d,f-v,T-y).normalize(),n)s[4].setComponents(l,p,g,_).normalize(),s[5].setComponents(c-l,u-p,f-g,T-_).normalize();else if(s[4].setComponents(c-l,u-p,f-g,T-_).normalize(),e===si)s[5].setComponents(c+l,u+p,f+g,T+_).normalize();else if(e===eo)s[5].setComponents(l,p,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(t){es.center.set(0,0,0);const e=np.distanceTo(t.center);return es.radius=.7071067811865476+e,es.applyMatrix4(t.matrixWorld),this.intersectsSphere(es)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(wa.x=s.normal.x>0?t.max.x:t.min.x,wa.y=s.normal.y>0?t.max.y:t.min.y,wa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(wa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Od extends Ii{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const kh=new $t,uc=new Hc,Ta=new Ms,Ea=new I;class ip extends He{constructor(t=new Ae,e=new Od){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ta.copy(n.boundingSphere),Ta.applyMatrix4(s),Ta.radius+=r,t.ray.intersectsSphere(Ta)===!1)return;kh.copy(s).invert(),uc.copy(t.ray).applyMatrix4(kh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const p=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let m=p,v=u;m<v;m++){const g=c.getX(m);Ea.fromBufferAttribute(d,g),Hh(Ea,g,l,s,t,e,this)}}else{const p=Math.max(0,a.start),u=Math.min(d.count,a.start+a.count);for(let m=p,v=u;m<v;m++)Ea.fromBufferAttribute(d,m),Hh(Ea,m,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Hh(i,t,e,n,s,r,a){const o=uc.distanceSqToPoint(i);if(o<e){const l=new I;uc.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class sp extends je{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class qc extends je{constructor(t,e,n=vs,s,r,a,o=dn,l=dn,c,h=kr,d=1){if(h!==kr&&h!==nr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:t,height:e,depth:d};super(p,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new kc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class zd extends je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Yi extends Ae{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new I,h=new ft;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,p=3;d<=e;d++,p+=3){const u=n+d/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[p]/t+1)/2,h.y=(a[p+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ke extends Ae{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],p=[],u=[];let m=0;const v=[],g=n/2;let f=0;x(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new he(d,3)),this.setAttribute("normal",new he(p,3)),this.setAttribute("uv",new he(u,2));function x(){const _=new I,T=new I;let b=0;const w=(e-t)/n;for(let E=0;E<=r;E++){const M=[],S=E/r,R=S*(e-t)+t;for(let D=0;D<=s;D++){const L=D/s,N=L*l+o,O=Math.sin(N),F=Math.cos(N);T.x=R*O,T.y=-S*n+g,T.z=R*F,d.push(T.x,T.y,T.z),_.set(O,w,F).normalize(),p.push(_.x,_.y,_.z),u.push(L,1-S),M.push(m++)}v.push(M)}for(let E=0;E<s;E++)for(let M=0;M<r;M++){const S=v[M][E],R=v[M+1][E],D=v[M+1][E+1],L=v[M][E+1];(t>0||M!==0)&&(h.push(S,R,L),b+=3),(e>0||M!==r-1)&&(h.push(R,D,L),b+=3)}c.addGroup(f,b,0),f+=b}function y(_){const T=m,b=new ft,w=new I;let E=0;const M=_===!0?t:e,S=_===!0?1:-1;for(let D=1;D<=s;D++)d.push(0,g*S,0),p.push(0,S,0),u.push(.5,.5),m++;const R=m;for(let D=0;D<=s;D++){const N=D/s*l+o,O=Math.cos(N),F=Math.sin(N);w.x=M*F,w.y=g*S,w.z=M*O,d.push(w.x,w.y,w.z),p.push(0,S,0),b.x=O*.5+.5,b.y=F*.5*S+.5,u.push(b.x,b.y),m++}for(let D=0;D<s;D++){const L=T+D,N=R+D;_===!0?h.push(N,N+1,L):h.push(N+1,N,L),E+=3}c.addGroup(f,E,_===!0?1:2),f+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ke(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yc extends Ae{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(r.slice(),3)),this.setAttribute("uv",new he(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new I,_=new I,T=new I;for(let b=0;b<e.length;b+=3)u(e[b+0],y),u(e[b+1],_),u(e[b+2],T),l(y,_,T,x)}function l(x,y,_,T){const b=T+1,w=[];for(let E=0;E<=b;E++){w[E]=[];const M=x.clone().lerp(_,E/b),S=y.clone().lerp(_,E/b),R=b-E;for(let D=0;D<=R;D++)D===0&&E===b?w[E][D]=M:w[E][D]=M.clone().lerp(S,D/R)}for(let E=0;E<b;E++)for(let M=0;M<2*(b-E)-1;M++){const S=Math.floor(M/2);M%2===0?(p(w[E][S+1]),p(w[E+1][S]),p(w[E][S])):(p(w[E][S+1]),p(w[E+1][S+1]),p(w[E+1][S]))}}function c(x){const y=new I;for(let _=0;_<r.length;_+=3)y.x=r[_+0],y.y=r[_+1],y.z=r[_+2],y.normalize().multiplyScalar(x),r[_+0]=y.x,r[_+1]=y.y,r[_+2]=y.z}function h(){const x=new I;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const _=g(x)/2/Math.PI+.5,T=f(x)/Math.PI+.5;a.push(_,1-T)}m(),d()}function d(){for(let x=0;x<a.length;x+=6){const y=a[x+0],_=a[x+2],T=a[x+4],b=Math.max(y,_,T),w=Math.min(y,_,T);b>.9&&w<.1&&(y<.2&&(a[x+0]+=1),_<.2&&(a[x+2]+=1),T<.2&&(a[x+4]+=1))}}function p(x){r.push(x.x,x.y,x.z)}function u(x,y){const _=x*3;y.x=t[_+0],y.y=t[_+1],y.z=t[_+2]}function m(){const x=new I,y=new I,_=new I,T=new I,b=new ft,w=new ft,E=new ft;for(let M=0,S=0;M<r.length;M+=9,S+=6){x.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),b.set(a[S+0],a[S+1]),w.set(a[S+2],a[S+3]),E.set(a[S+4],a[S+5]),T.copy(x).add(y).add(_).divideScalar(3);const R=g(T);v(b,S+0,x,R),v(w,S+2,y,R),v(E,S+4,_,R)}}function v(x,y,_,T){T<0&&x.x===1&&(a[y]=x.x-1),_.x===0&&_.z===0&&(a[y]=T/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yc(t.vertices,t.indices,t.radius,t.details)}}class di{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],p=n[s+1]-h,u=(a-h)/p;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ft:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,l=new $t;for(let u=0;u<=t;u++){const m=u/t;s[u]=this.getTangentAt(m,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),p<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(le(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(l.makeRotationAxis(o,m))}a[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(le(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(u=-u);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],u*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Wr extends di{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ft){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),p=l-this.aX,u=c-this.aY;l=p*h-u*d+this.aX,c=p*d+u*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class rp extends Wr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function $c(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let p=(a-r)/c-(o-r)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+d)+(l-o)/d;p*=h,u*=h,s(a,o,p,u)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Aa=new I,il=new $c,sl=new $c,rl=new $c;class Tn extends di{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Aa.subVectors(s[0],s[1]).add(s[0]),c=Aa);const d=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Aa.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Aa),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(d),u),v=Math.pow(d.distanceToSquared(p),u),g=Math.pow(p.distanceToSquared(h),u);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),il.initNonuniformCatmullRom(c.x,d.x,p.x,h.x,m,v,g),sl.initNonuniformCatmullRom(c.y,d.y,p.y,h.y,m,v,g),rl.initNonuniformCatmullRom(c.z,d.z,p.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(il.initCatmullRom(c.x,d.x,p.x,h.x,this.tension),sl.initCatmullRom(c.y,d.y,p.y,h.y,this.tension),rl.initCatmullRom(c.z,d.z,p.z,h.z,this.tension));return n.set(il.calc(l),sl.calc(l),rl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Gh(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function ap(i,t){const e=1-i;return e*e*t}function op(i,t){return 2*(1-i)*i*t}function lp(i,t){return i*i*t}function Ur(i,t,e,n){return ap(i,t)+op(i,e)+lp(i,n)}function cp(i,t){const e=1-i;return e*e*e*t}function hp(i,t){const e=1-i;return 3*e*e*i*t}function up(i,t){return 3*(1-i)*i*i*t}function dp(i,t){return i*i*i*t}function Nr(i,t,e,n,s){return cp(i,t)+hp(i,e)+up(i,n)+dp(i,s)}class Bd extends di{constructor(t=new ft,e=new ft,n=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Nr(t,s.x,r.x,a.x,o.x),Nr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class fp extends di{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Nr(t,s.x,r.x,a.x,o.x),Nr(t,s.y,r.y,a.y,o.y),Nr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kd extends di{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xr extends di{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hd extends di{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ur(t,s.x,r.x,a.x),Ur(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gd extends di{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ur(t,s.x,r.x,a.x),Ur(t,s.y,r.y,a.y),Ur(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Vd extends di{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Gh(o,l.x,c.x,h.x,d.x),Gh(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ft().fromArray(s))}return this}}var io=Object.freeze({__proto__:null,ArcCurve:rp,CatmullRomCurve3:Tn,CubicBezierCurve:Bd,CubicBezierCurve3:fp,EllipseCurve:Wr,LineCurve:kd,LineCurve3:Xr,QuadraticBezierCurve:Hd,QuadraticBezierCurve3:Gd,SplineCurve:Vd});class pp extends di{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new io[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new io[s.type]().fromJSON(s))}return this}}class so extends pp{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new kd(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Hd(this.currentPoint.clone(),new ft(t,e),new ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Bd(this.currentPoint.clone(),new ft(t,e),new ft(n,s),new ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Vd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Wr(t,e,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Li extends so{constructor(t){super(t),this.uuid=ri(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new so().fromJSON(s))}return this}}function mp(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Wd(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=yp(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let p=e;p<s;p+=e){const u=i[p],m=i[p+1];u<o&&(o=u),m<l&&(l=m),u>h&&(h=u),m>d&&(d=m)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return qr(r,a,e,o,l,c,0),a}function Wd(i,t,e,n,s){let r;if(s===Ip(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Vh(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Vh(a/n|0,i[a],i[a+1],r);return r&&rr(r,r.next)&&($r(r),r=r.next),r}function xs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(rr(e,e.next)||De(e.prev,e,e.next)===0)){if($r(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function qr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Tp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?vp(i,n,s,r):gp(i)){t.push(l.i,i.i,c.i),$r(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=xp(xs(i),t),qr(i,t,e,n,s,r,2)):a===2&&_p(i,t,e,n,s,r):qr(xs(i),t,e,n,s,r,1);break}}}function gp(i){const t=i.prev,e=i,n=i.next;if(De(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),p=Math.max(s,r,a),u=Math.max(o,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=p&&m.y>=d&&m.y<=u&&Tr(s,o,r,l,a,c,m.x,m.y)&&De(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function vp(i,t,e,n){const s=i.prev,r=i,a=i.next;if(De(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,p=a.y,u=Math.min(o,l,c),m=Math.min(h,d,p),v=Math.max(o,l,c),g=Math.max(h,d,p),f=dc(u,m,t,e,n),x=dc(v,g,t,e,n);let y=i.prevZ,_=i.nextZ;for(;y&&y.z>=f&&_&&_.z<=x;){if(y.x>=u&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&Tr(o,h,l,d,c,p,y.x,y.y)&&De(y.prev,y,y.next)>=0||(y=y.prevZ,_.x>=u&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Tr(o,h,l,d,c,p,_.x,_.y)&&De(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;y&&y.z>=f;){if(y.x>=u&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&Tr(o,h,l,d,c,p,y.x,y.y)&&De(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;_&&_.z<=x;){if(_.x>=u&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Tr(o,h,l,d,c,p,_.x,_.y)&&De(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function xp(i,t){let e=i;do{const n=e.prev,s=e.next.next;!rr(n,s)&&qd(n,e,e.next,s)&&Yr(n,s)&&Yr(s,n)&&(t.push(n.i,e.i,s.i),$r(e),$r(e.next),e=i=s),e=e.next}while(e!==i);return xs(e)}function _p(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Rp(a,o)){let l=Yd(a,o);a=xs(a,a.next),l=xs(l,l.next),qr(a,t,e,n,s,r,0),qr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function yp(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Wd(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Ap(c))}s.sort(Mp);for(let r=0;r<s.length;r++)e=Sp(s[r],e);return e}function Mp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Sp(i,t){const e=bp(i,t);if(!e)return t;const n=Yd(e,i);return xs(n,n.next),xs(e,e.next)}function bp(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(rr(i,e))return e;do{if(rr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Xd(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const d=Math.abs(s-e.y)/(n-e.x);Yr(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&wp(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function wp(i,t){return De(i.prev,i,t.prev)<0&&De(t.next,i,i.next)<0}function Tp(i,t,e,n){let s=i;do s.z===0&&(s.z=dc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ep(s)}function Ep(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function dc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Ap(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Xd(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Tr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Xd(i,t,e,n,s,r,a,o)}function Rp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Cp(i,t)&&(Yr(i,t)&&Yr(t,i)&&Pp(i,t)&&(De(i.prev,i,t.prev)||De(i,t.prev,t))||rr(i,t)&&De(i.prev,i,i.next)>0&&De(t.prev,t,t.next)>0)}function De(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function rr(i,t){return i.x===t.x&&i.y===t.y}function qd(i,t,e,n){const s=Ca(De(i,t,e)),r=Ca(De(i,t,n)),a=Ca(De(e,n,i)),o=Ca(De(e,n,t));return!!(s!==r&&a!==o||s===0&&Ra(i,e,t)||r===0&&Ra(i,n,t)||a===0&&Ra(e,i,n)||o===0&&Ra(e,t,n))}function Ra(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ca(i){return i>0?1:i<0?-1:0}function Cp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&qd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Yr(i,t){return De(i.prev,i,i.next)<0?De(i,t,i.next)>=0&&De(i,i.prev,t)>=0:De(i,t,i.prev)<0||De(i,i.next,t)<0}function Pp(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Yd(i,t){const e=fc(i.i,i.x,i.y),n=fc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Vh(i,t,e,n){const s=fc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function $r(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function fc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ip(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Lp{static triangulate(t,e,n=2){return mp(t,e,n)}}class Ci{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ci.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Wh(t),Xh(n,t);let a=t.length;e.forEach(Wh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Xh(n,e[l]);const o=Lp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Wh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Xh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class yo extends Ae{constructor(t=new Li([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new he(s,3)),this.setAttribute("uv",new he(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let p=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:u-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:Dp;let y,_=!1,T,b,w,E;f&&(y=f.getSpacedPoints(h),_=!0,p=!1,T=f.computeFrenetFrames(h,!1),b=new I,w=new I,E=new I),p||(g=0,u=0,m=0,v=0);const M=o.extractPoints(c);let S=M.shape;const R=M.holes;if(!Ci.isClockWise(S)){S=S.reverse();for(let lt=0,ct=R.length;lt<ct;lt++){const J=R[lt];Ci.isClockWise(J)&&(R[lt]=J.reverse())}}function L(lt){const J=10000000000000001e-36;let j=lt[0];for(let at=1;at<=lt.length;at++){const st=at%lt.length,ut=lt[st],Bt=ut.x-j.x,vt=ut.y-j.y,P=Bt*Bt+vt*vt,A=Math.max(Math.abs(ut.x),Math.abs(ut.y),Math.abs(j.x),Math.abs(j.y)),W=J*A*A;if(P<=W){lt.splice(st,1),at--;continue}j=ut}}L(S),R.forEach(L);const N=R.length,O=S;for(let lt=0;lt<N;lt++){const ct=R[lt];S=S.concat(ct)}function F(lt,ct,J){return ct||console.error("THREE.ExtrudeGeometry: vec does not exist"),lt.clone().addScaledVector(ct,J)}const H=S.length;function B(lt,ct,J){let j,at,st;const ut=lt.x-ct.x,Bt=lt.y-ct.y,vt=J.x-lt.x,P=J.y-lt.y,A=ut*ut+Bt*Bt,W=ut*P-Bt*vt;if(Math.abs(W)>Number.EPSILON){const K=Math.sqrt(A),ht=Math.sqrt(vt*vt+P*P),Z=ct.x-Bt/K,wt=ct.y+ut/K,gt=J.x-P/ht,Pt=J.y+vt/ht,Ut=((gt-Z)*P-(Pt-wt)*vt)/(ut*P-Bt*vt);j=Z+ut*Ut-lt.x,at=wt+Bt*Ut-lt.y;const _t=j*j+at*at;if(_t<=2)return new ft(j,at);st=Math.sqrt(_t/2)}else{let K=!1;ut>Number.EPSILON?vt>Number.EPSILON&&(K=!0):ut<-Number.EPSILON?vt<-Number.EPSILON&&(K=!0):Math.sign(Bt)===Math.sign(P)&&(K=!0),K?(j=-Bt,at=ut,st=Math.sqrt(A)):(j=ut,at=Bt,st=Math.sqrt(A/2))}return new ft(j/st,at/st)}const X=[];for(let lt=0,ct=O.length,J=ct-1,j=lt+1;lt<ct;lt++,J++,j++)J===ct&&(J=0),j===ct&&(j=0),X[lt]=B(O[lt],O[J],O[j]);const G=[];let Q,rt=X.concat();for(let lt=0,ct=N;lt<ct;lt++){const J=R[lt];Q=[];for(let j=0,at=J.length,st=at-1,ut=j+1;j<at;j++,st++,ut++)st===at&&(st=0),ut===at&&(ut=0),Q[j]=B(J[j],J[st],J[ut]);G.push(Q),rt=rt.concat(Q)}let pt;if(g===0)pt=Ci.triangulateShape(O,R);else{const lt=[],ct=[];for(let J=0;J<g;J++){const j=J/g,at=u*Math.cos(j*Math.PI/2),st=m*Math.sin(j*Math.PI/2)+v;for(let ut=0,Bt=O.length;ut<Bt;ut++){const vt=F(O[ut],X[ut],st);xt(vt.x,vt.y,-at),j===0&&lt.push(vt)}for(let ut=0,Bt=N;ut<Bt;ut++){const vt=R[ut];Q=G[ut];const P=[];for(let A=0,W=vt.length;A<W;A++){const K=F(vt[A],Q[A],st);xt(K.x,K.y,-at),j===0&&P.push(K)}j===0&&ct.push(P)}}pt=Ci.triangulateShape(lt,ct)}const zt=pt.length,Ct=m+v;for(let lt=0;lt<H;lt++){const ct=p?F(S[lt],rt[lt],Ct):S[lt];_?(w.copy(T.normals[0]).multiplyScalar(ct.x),b.copy(T.binormals[0]).multiplyScalar(ct.y),E.copy(y[0]).add(w).add(b),xt(E.x,E.y,E.z)):xt(ct.x,ct.y,0)}for(let lt=1;lt<=h;lt++)for(let ct=0;ct<H;ct++){const J=p?F(S[ct],rt[ct],Ct):S[ct];_?(w.copy(T.normals[lt]).multiplyScalar(J.x),b.copy(T.binormals[lt]).multiplyScalar(J.y),E.copy(y[lt]).add(w).add(b),xt(E.x,E.y,E.z)):xt(J.x,J.y,d/h*lt)}for(let lt=g-1;lt>=0;lt--){const ct=lt/g,J=u*Math.cos(ct*Math.PI/2),j=m*Math.sin(ct*Math.PI/2)+v;for(let at=0,st=O.length;at<st;at++){const ut=F(O[at],X[at],j);xt(ut.x,ut.y,d+J)}for(let at=0,st=R.length;at<st;at++){const ut=R[at];Q=G[at];for(let Bt=0,vt=ut.length;Bt<vt;Bt++){const P=F(ut[Bt],Q[Bt],j);_?xt(P.x,P.y+y[h-1].y,y[h-1].x+J):xt(P.x,P.y,d+J)}}}$(),nt();function $(){const lt=s.length/3;if(p){let ct=0,J=H*ct;for(let j=0;j<zt;j++){const at=pt[j];bt(at[2]+J,at[1]+J,at[0]+J)}ct=h+g*2,J=H*ct;for(let j=0;j<zt;j++){const at=pt[j];bt(at[0]+J,at[1]+J,at[2]+J)}}else{for(let ct=0;ct<zt;ct++){const J=pt[ct];bt(J[2],J[1],J[0])}for(let ct=0;ct<zt;ct++){const J=pt[ct];bt(J[0]+H*h,J[1]+H*h,J[2]+H*h)}}n.addGroup(lt,s.length/3-lt,0)}function nt(){const lt=s.length/3;let ct=0;mt(O,ct),ct+=O.length;for(let J=0,j=R.length;J<j;J++){const at=R[J];mt(at,ct),ct+=at.length}n.addGroup(lt,s.length/3-lt,1)}function mt(lt,ct){let J=lt.length;for(;--J>=0;){const j=J;let at=J-1;at<0&&(at=lt.length-1);for(let st=0,ut=h+g*2;st<ut;st++){const Bt=H*st,vt=H*(st+1),P=ct+j+Bt,A=ct+at+Bt,W=ct+at+vt,K=ct+j+vt;Wt(P,A,W,K)}}}function xt(lt,ct,J){l.push(lt),l.push(ct),l.push(J)}function bt(lt,ct,J){Qt(lt),Qt(ct),Qt(J);const j=s.length/3,at=x.generateTopUV(n,s,j-3,j-2,j-1);z(at[0]),z(at[1]),z(at[2])}function Wt(lt,ct,J,j){Qt(lt),Qt(ct),Qt(j),Qt(ct),Qt(J),Qt(j);const at=s.length/3,st=x.generateSideWallUV(n,s,at-6,at-3,at-2,at-1);z(st[0]),z(st[1]),z(st[3]),z(st[1]),z(st[2]),z(st[3])}function Qt(lt){s.push(l[lt*3+0]),s.push(l[lt*3+1]),s.push(l[lt*3+2])}function z(lt){r.push(lt.x),r.push(lt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Up(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new io[s.type]().fromJSON(s)),new yo(n,t.options)}}const Dp={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ft(r,a),new ft(o,l),new ft(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],p=t[s*3],u=t[s*3+1],m=t[s*3+2],v=t[r*3],g=t[r*3+1],f=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ft(a,1-l),new ft(c,1-d),new ft(p,1-m),new ft(v,1-f)]:[new ft(o,1-l),new ft(h,1-d),new ft(u,1-m),new ft(g,1-f)]}};function Up(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Mo extends Yc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Mo(t.radius,t.detail)}}class So extends Ae{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=le(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,d=new I,p=new ft,u=new I,m=new I,v=new I;let g=0,f=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:g=t[x+1].x-t[x].x,f=t[x+1].y-t[x].y,u.x=f*1,u.y=-g,u.z=f*0,v.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[x+1].x-t[x].x,f=t[x+1].y-t[x].y,u.x=f*1,u.y=-g,u.z=f*0,m.copy(u),u.x+=v.x,u.y+=v.y,u.z+=v.z,u.normalize(),l.push(u.x,u.y,u.z),v.copy(m)}for(let x=0;x<=e;x++){const y=n+x*h*s,_=Math.sin(y),T=Math.cos(y);for(let b=0;b<=t.length-1;b++){d.x=t[b].x*_,d.y=t[b].y,d.z=t[b].x*T,a.push(d.x,d.y,d.z),p.x=x/e,p.y=b/(t.length-1),o.push(p.x,p.y);const w=l[3*b+0]*_,E=l[3*b+1],M=l[3*b+0]*T;c.push(w,E,M)}}for(let x=0;x<e;x++)for(let y=0;y<t.length-1;y++){const _=y+x*t.length,T=_,b=_+t.length,w=_+t.length+1,E=_+1;r.push(T,b,E),r.push(w,E,b)}this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new So(t.points,t.segments,t.phiStart,t.phiLength)}}class de extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,p=e/l,u=[],m=[],v=[],g=[];for(let f=0;f<h;f++){const x=f*p-a;for(let y=0;y<c;y++){const _=y*d-r;m.push(_,-x,0),v.push(0,0,1),g.push(y/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let x=0;x<o;x++){const y=x+c*f,_=x+c*(f+1),T=x+1+c*(f+1),b=x+1+c*f;u.push(y,_,b),u.push(_,T,b)}this.setIndex(u),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(v,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new de(t.width,t.height,t.widthSegments,t.heightSegments)}}class bo extends Ae{constructor(t=new Li([new ft(0,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new he(s,3)),this.setAttribute("normal",new he(r,3)),this.setAttribute("uv",new he(a,2));function c(h){const d=s.length/3,p=h.extractPoints(e);let u=p.shape;const m=p.holes;Ci.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,f=m.length;g<f;g++){const x=m[g];Ci.isClockWise(x)===!0&&(m[g]=x.reverse())}const v=Ci.triangulateShape(u,m);for(let g=0,f=m.length;g<f;g++){const x=m[g];u=u.concat(x)}for(let g=0,f=u.length;g<f;g++){const x=u[g];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let g=0,f=v.length;g<f;g++){const x=v[g],y=x[0]+d,_=x[1]+d,T=x[2]+d;n.push(y,_,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Np(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new bo(n,t.curveSegments)}}function Np(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Ne extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new I,p=new I,u=[],m=[],v=[],g=[];for(let f=0;f<=n;f++){const x=[],y=f/n;let _=0;f===0&&a===0?_=.5/e:f===n&&l===Math.PI&&(_=-.5/e);for(let T=0;T<=e;T++){const b=T/e;d.x=-t*Math.cos(s+b*r)*Math.sin(a+y*o),d.y=t*Math.cos(a+y*o),d.z=t*Math.sin(s+b*r)*Math.sin(a+y*o),m.push(d.x,d.y,d.z),p.copy(d).normalize(),v.push(p.x,p.y,p.z),g.push(b+_,1-y),x.push(c++)}h.push(x)}for(let f=0;f<n;f++)for(let x=0;x<e;x++){const y=h[f][x+1],_=h[f][x],T=h[f+1][x],b=h[f+1][x+1];(f!==0||a>0)&&u.push(y,_,b),(f!==n-1||l<Math.PI)&&u.push(_,T,b)}this.setIndex(u),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(v,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ne(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class $i extends Ae{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new I,d=new I,p=new I;for(let u=0;u<=n;u++)for(let m=0;m<=s;m++){const v=m/s*r,g=u/n*Math.PI*2;d.x=(t+e*Math.cos(g))*Math.cos(v),d.y=(t+e*Math.cos(g))*Math.sin(v),d.z=e*Math.sin(g),o.push(d.x,d.y,d.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),p.subVectors(d,h).normalize(),l.push(p.x,p.y,p.z),c.push(m/s),c.push(u/n)}for(let u=1;u<=n;u++)for(let m=1;m<=s;m++){const v=(s+1)*u+m-1,g=(s+1)*(u-1)+m-1,f=(s+1)*(u-1)+m,x=(s+1)*u+m;a.push(v,g,x),a.push(g,f,x)}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(l,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Qe extends Ae{constructor(t=new Gd(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new I,l=new I,c=new ft;let h=new I;const d=[],p=[],u=[],m=[];v(),this.setIndex(m),this.setAttribute("position",new he(d,3)),this.setAttribute("normal",new he(p,3)),this.setAttribute("uv",new he(u,2));function v(){for(let y=0;y<e;y++)g(y);g(r===!1?e:0),x(),f()}function g(y){h=t.getPointAt(y/e,h);const _=a.normals[y],T=a.binormals[y];for(let b=0;b<=s;b++){const w=b/s*Math.PI*2,E=Math.sin(w),M=-Math.cos(w);l.x=M*_.x+E*T.x,l.y=M*_.y+E*T.y,l.z=M*_.z+E*T.z,l.normalize(),p.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function f(){for(let y=1;y<=e;y++)for(let _=1;_<=s;_++){const T=(s+1)*(y-1)+(_-1),b=(s+1)*y+(_-1),w=(s+1)*y+_,E=(s+1)*(y-1)+_;m.push(T,b,E),m.push(b,w,E)}}function x(){for(let y=0;y<=e;y++)for(let _=0;_<=s;_++)c.x=y/e,c.y=_/s,u.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Qe(new io[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Fp extends un{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Rt extends Ii{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_o,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class $s extends Rt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ft(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return le(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new qt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Op extends Ii{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_o,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class zp extends Ii{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_o,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Bp extends Ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=t0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class kp extends Ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const al={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Hp{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,p=c.length;d<p;d+=2){const u=c[d],m=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Gp=new Hp;class Zc{constructor(t){this.manager=t!==void 0?t:Gp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Zc.DEFAULT_MATERIAL_NAME="__DEFAULT";const Hs=new WeakMap;class Vp extends Zc{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=al.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let d=Hs.get(a);d===void 0&&(d=[],Hs.set(a,d)),d.push({onLoad:e,onError:s})}return a}const o=Gr("img");function l(){h(),e&&e(this);const d=Hs.get(this)||[];for(let p=0;p<d.length;p++){const u=d[p];u.onLoad&&u.onLoad(this)}Hs.delete(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),al.remove(`image:${t}`);const p=Hs.get(this)||[];for(let u=0;u<p.length;u++){const m=p[u];m.onError&&m.onError(d)}Hs.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),al.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class $d extends Zc{constructor(t){super(t)}load(t,e,n,s){const r=new je,a=new Vp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class Jc extends He{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class qh extends Jc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ol=new $t,Yh=new I,$h=new I;class Zd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=ci,this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xc,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Yh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yh),$h.setFromMatrixPosition(t.target.matrixWorld),e.lookAt($h),e.updateMatrixWorld(),ol.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ol,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ol)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Zh=new $t,Mr=new I,ll=new I;class Wp extends Zd{constructor(){super(new rn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ft(4,2),this._viewportCount=6,this._viewports=[new Me(2,1,1,1),new Me(0,1,1,1),new Me(3,1,1,1),new Me(1,1,1,1),new Me(3,0,1,1),new Me(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Mr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Mr),ll.copy(n.position),ll.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ll),n.updateMatrixWorld(),s.makeTranslation(-Mr.x,-Mr.y,-Mr.z),Zh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zh,n.coordinateSystem,n.reversedDepth)}}class ro extends Jc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Wp}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Kc extends Ud{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Xp extends Zd{constructor(){super(new Kc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Pa extends Jc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.target=new He,this.shadow=new Xp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class qp extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Yp{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const Jh=new $t;class $p{constructor(t,e,n=0,s=1/0){this.ray=new Hc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Gc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Jh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jh),this}intersectObject(t,e=!0,n=[]){return pc(t,this,n,e),n.sort(Kh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)pc(t[s],this,n,e);return n.sort(Kh),n}}function Kh(i,t){return i.distance-t.distance}function pc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)pc(r[a],t,e,!0)}}function jh(i,t,e,n){const s=Zp(n);switch(e){case wd:return i*t;case xo:return i*t/s.components*s.byteLength;case Fc:return i*t/s.components*s.byteLength;case Ed:return i*t*2/s.components*s.byteLength;case Oc:return i*t*2/s.components*s.byteLength;case Td:return i*t*3/s.components*s.byteLength;case Fn:return i*t*4/s.components*s.byteLength;case zc:return i*t*4/s.components*s.byteLength;case qa:case Ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case $a:case Za:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Nl:case Ol:return Math.max(i,16)*Math.max(t,8)/4;case Ul:case Fl:return Math.max(i,8)*Math.max(t,8)/2;case zl:case Bl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case kl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Hl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Gl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Vl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Wl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ql:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Yl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case $l:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Jl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Kl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case jl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ql:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case tc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ec:case nc:case ic:return Math.ceil(i/4)*Math.ceil(t/4)*16;case sc:case rc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ac:case oc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Zp(i){switch(i){case ci:case yd:return{byteLength:1,components:1};case Br:case Md:case hi:return{byteLength:2,components:1};case Uc:case Nc:return{byteLength:2,components:4};case vs:case Dc:case qn:return{byteLength:4,components:1};case Sd:case bd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Jd(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Jp(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=i.SHORT;else if(c instanceof Uint32Array)u=i.UNSIGNED_INT;else if(c instanceof Int32Array)u=i.INT;else if(c instanceof Int8Array)u=i.BYTE;else if(c instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((u,m)=>u.start-m.start);let p=0;for(let u=1;u<d.length;u++){const m=d[p],v=d[u];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++p,d[p]=v)}d.length=p+1;for(let u=0,m=d.length;u<m;u++){const v=d[u];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Kp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jp=`#ifdef USE_ALPHAHASH
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
#endif`,Qp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,em=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,im=`#ifdef USE_AOMAP
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
#endif`,sm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rm=`#ifdef USE_BATCHING
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
#endif`,am=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,om=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hm=`#ifdef USE_IRIDESCENCE
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
#endif`,um=`#ifdef USE_BUMPMAP
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
#endif`,dm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,_m=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ym=`#define PI 3.141592653589793
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
} // validated`,Mm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sm=`vec3 transformedNormal = objectNormal;
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
#endif`,bm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Em=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Am="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Im=`#ifdef USE_ENVMAP
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
#endif`,Lm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dm=`#ifdef USE_ENVMAP
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
#endif`,Um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zm=`#ifdef USE_GRADIENTMAP
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
}`,Bm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,km=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gm=`uniform bool receiveShadow;
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
#endif`,Vm=`#ifdef USE_ENVMAP
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
#endif`,Wm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ym=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$m=`PhysicalMaterial material;
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
#endif`,Zm=`struct PhysicalMaterial {
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
}`,Jm=`
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
#endif`,Km=`#if defined( RE_IndirectDiffuse )
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
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,t1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,i1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,s1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,a1=`#if defined( USE_POINTS_UV )
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
#endif`,o1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,l1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,c1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,h1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,u1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,d1=`#ifdef USE_MORPHTARGETS
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
#endif`,f1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,m1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,g1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,v1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_1=`#ifdef USE_NORMALMAP
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
#endif`,y1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,b1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,w1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,T1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,E1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,A1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,R1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,C1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,P1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,I1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,L1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,D1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,U1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,N1=`float getShadowMask() {
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
}`,F1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,O1=`#ifdef USE_SKINNING
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
#endif`,z1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,B1=`#ifdef USE_SKINNING
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
#endif`,k1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,H1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,G1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,V1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,W1=`#ifdef USE_TRANSMISSION
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
#endif`,X1=`#ifdef USE_TRANSMISSION
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
#endif`,q1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Y1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const J1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,K1=`uniform sampler2D t2D;
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
}`,j1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Q1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ng=`#include <common>
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
}`,ig=`#if DEPTH_PACKING == 3200
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
}`,sg=`#define DISTANCE
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
}`,rg=`#define DISTANCE
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
}`,ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,og=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lg=`uniform float scale;
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
}`,cg=`uniform vec3 diffuse;
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
}`,hg=`#include <common>
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
}`,ug=`uniform vec3 diffuse;
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
}`,dg=`#define LAMBERT
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
}`,fg=`#define LAMBERT
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
}`,pg=`#define MATCAP
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
}`,mg=`#define MATCAP
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
}`,gg=`#define NORMAL
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
}`,vg=`#define NORMAL
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
}`,xg=`#define PHONG
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
}`,_g=`#define PHONG
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
}`,yg=`#define STANDARD
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
}`,Mg=`#define STANDARD
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
}`,Sg=`#define TOON
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
}`,bg=`#define TOON
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
}`,wg=`uniform float size;
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
}`,Tg=`uniform vec3 diffuse;
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
}`,Eg=`#include <common>
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
}`,Ag=`uniform vec3 color;
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
}`,Rg=`uniform float rotation;
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
}`,Cg=`uniform vec3 diffuse;
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
}`,oe={alphahash_fragment:Kp,alphahash_pars_fragment:jp,alphamap_fragment:Qp,alphamap_pars_fragment:tm,alphatest_fragment:em,alphatest_pars_fragment:nm,aomap_fragment:im,aomap_pars_fragment:sm,batching_pars_vertex:rm,batching_vertex:am,begin_vertex:om,beginnormal_vertex:lm,bsdfs:cm,iridescence_fragment:hm,bumpmap_pars_fragment:um,clipping_planes_fragment:dm,clipping_planes_pars_fragment:fm,clipping_planes_pars_vertex:pm,clipping_planes_vertex:mm,color_fragment:gm,color_pars_fragment:vm,color_pars_vertex:xm,color_vertex:_m,common:ym,cube_uv_reflection_fragment:Mm,defaultnormal_vertex:Sm,displacementmap_pars_vertex:bm,displacementmap_vertex:wm,emissivemap_fragment:Tm,emissivemap_pars_fragment:Em,colorspace_fragment:Am,colorspace_pars_fragment:Rm,envmap_fragment:Cm,envmap_common_pars_fragment:Pm,envmap_pars_fragment:Im,envmap_pars_vertex:Lm,envmap_physical_pars_fragment:Vm,envmap_vertex:Dm,fog_vertex:Um,fog_pars_vertex:Nm,fog_fragment:Fm,fog_pars_fragment:Om,gradientmap_pars_fragment:zm,lightmap_pars_fragment:Bm,lights_lambert_fragment:km,lights_lambert_pars_fragment:Hm,lights_pars_begin:Gm,lights_toon_fragment:Wm,lights_toon_pars_fragment:Xm,lights_phong_fragment:qm,lights_phong_pars_fragment:Ym,lights_physical_fragment:$m,lights_physical_pars_fragment:Zm,lights_fragment_begin:Jm,lights_fragment_maps:Km,lights_fragment_end:jm,logdepthbuf_fragment:Qm,logdepthbuf_pars_fragment:t1,logdepthbuf_pars_vertex:e1,logdepthbuf_vertex:n1,map_fragment:i1,map_pars_fragment:s1,map_particle_fragment:r1,map_particle_pars_fragment:a1,metalnessmap_fragment:o1,metalnessmap_pars_fragment:l1,morphinstance_vertex:c1,morphcolor_vertex:h1,morphnormal_vertex:u1,morphtarget_pars_vertex:d1,morphtarget_vertex:f1,normal_fragment_begin:p1,normal_fragment_maps:m1,normal_pars_fragment:g1,normal_pars_vertex:v1,normal_vertex:x1,normalmap_pars_fragment:_1,clearcoat_normal_fragment_begin:y1,clearcoat_normal_fragment_maps:M1,clearcoat_pars_fragment:S1,iridescence_pars_fragment:b1,opaque_fragment:w1,packing:T1,premultiplied_alpha_fragment:E1,project_vertex:A1,dithering_fragment:R1,dithering_pars_fragment:C1,roughnessmap_fragment:P1,roughnessmap_pars_fragment:I1,shadowmap_pars_fragment:L1,shadowmap_pars_vertex:D1,shadowmap_vertex:U1,shadowmask_pars_fragment:N1,skinbase_vertex:F1,skinning_pars_vertex:O1,skinning_vertex:z1,skinnormal_vertex:B1,specularmap_fragment:k1,specularmap_pars_fragment:H1,tonemapping_fragment:G1,tonemapping_pars_fragment:V1,transmission_fragment:W1,transmission_pars_fragment:X1,uv_pars_fragment:q1,uv_pars_vertex:Y1,uv_vertex:$1,worldpos_vertex:Z1,background_vert:J1,background_frag:K1,backgroundCube_vert:j1,backgroundCube_frag:Q1,cube_vert:tg,cube_frag:eg,depth_vert:ng,depth_frag:ig,distanceRGBA_vert:sg,distanceRGBA_frag:rg,equirect_vert:ag,equirect_frag:og,linedashed_vert:lg,linedashed_frag:cg,meshbasic_vert:hg,meshbasic_frag:ug,meshlambert_vert:dg,meshlambert_frag:fg,meshmatcap_vert:pg,meshmatcap_frag:mg,meshnormal_vert:gg,meshnormal_frag:vg,meshphong_vert:xg,meshphong_frag:_g,meshphysical_vert:yg,meshphysical_frag:Mg,meshtoon_vert:Sg,meshtoon_frag:bg,points_vert:wg,points_frag:Tg,shadow_vert:Eg,shadow_frag:Ag,sprite_vert:Rg,sprite_frag:Cg},Lt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ae},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ae}},envmap:{envMap:{value:null},envMapRotation:{value:new ae},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ae}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ae}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ae},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ae},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ae},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ae}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ae}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ae}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0},uvTransform:{value:new ae}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ae},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0}}},Qn={basic:{uniforms:cn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:oe.meshbasic_vert,fragmentShader:oe.meshbasic_frag},lambert:{uniforms:cn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new qt(0)}}]),vertexShader:oe.meshlambert_vert,fragmentShader:oe.meshlambert_frag},phong:{uniforms:cn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:oe.meshphong_vert,fragmentShader:oe.meshphong_frag},standard:{uniforms:cn([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag},toon:{uniforms:cn([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new qt(0)}}]),vertexShader:oe.meshtoon_vert,fragmentShader:oe.meshtoon_frag},matcap:{uniforms:cn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:oe.meshmatcap_vert,fragmentShader:oe.meshmatcap_frag},points:{uniforms:cn([Lt.points,Lt.fog]),vertexShader:oe.points_vert,fragmentShader:oe.points_frag},dashed:{uniforms:cn([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:oe.linedashed_vert,fragmentShader:oe.linedashed_frag},depth:{uniforms:cn([Lt.common,Lt.displacementmap]),vertexShader:oe.depth_vert,fragmentShader:oe.depth_frag},normal:{uniforms:cn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:oe.meshnormal_vert,fragmentShader:oe.meshnormal_frag},sprite:{uniforms:cn([Lt.sprite,Lt.fog]),vertexShader:oe.sprite_vert,fragmentShader:oe.sprite_frag},background:{uniforms:{uvTransform:{value:new ae},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:oe.background_vert,fragmentShader:oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ae}},vertexShader:oe.backgroundCube_vert,fragmentShader:oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:oe.cube_vert,fragmentShader:oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:oe.equirect_vert,fragmentShader:oe.equirect_frag},distanceRGBA:{uniforms:cn([Lt.common,Lt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:oe.distanceRGBA_vert,fragmentShader:oe.distanceRGBA_frag},shadow:{uniforms:cn([Lt.lights,Lt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:oe.shadow_vert,fragmentShader:oe.shadow_frag}};Qn.physical={uniforms:cn([Qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ae},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ae},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ae},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ae},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ae},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ae},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ae},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ae},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ae},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ae},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ae},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ae}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag};const Ia={r:0,b:0,g:0},ns=new xn,Pg=new $t;function Ig(i,t,e,n,s,r,a){const o=new qt(0);let l=r===!0?0:1,c,h,d=null,p=0,u=null;function m(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const T=m(y);T===null?f(o,l):T&&T.isColor&&(f(T,1),_=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,_){const T=m(_);T&&(T.isCubeTexture||T.mapping===vo)?(h===void 0&&(h=new Ft(new An(1,1,1),new un({name:"BackgroundCubeMaterial",uniforms:sr(Qn.backgroundCube.uniforms),vertexShader:Qn.backgroundCube.vertexShader,fragmentShader:Qn.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ns.copy(_.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Pg.makeRotationFromEuler(ns)),h.material.toneMapped=me.getTransfer(T.colorSpace)!==xe,(d!==T||p!==T.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,d=T,p=T.version,u=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Ft(new de(2,2),new un({name:"BackgroundMaterial",uniforms:sr(Qn.background.uniforms),vertexShader:Qn.background.vertexShader,fragmentShader:Qn.background.fragmentShader,side:qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=me.getTransfer(T.colorSpace)!==xe,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(d!==T||p!==T.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,d=T,p=T.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function f(y,_){y.getRGB(Ia,Dd(i)),n.buffers.color.setClear(Ia.r,Ia.g,Ia.b,_,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,_=1){o.set(y),l=_,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,f(o,l)},render:v,addToRenderList:g,dispose:x}}function Lg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(S,R,D,L,N){let O=!1;const F=d(L,D,R);r!==F&&(r=F,c(r.object)),O=u(S,L,D,N),O&&m(S,L,D,N),N!==null&&t.update(N,i.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,_(S,R,D,L),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function d(S,R,D){const L=D.wireframe===!0;let N=n[S.id];N===void 0&&(N={},n[S.id]=N);let O=N[R.id];O===void 0&&(O={},N[R.id]=O);let F=O[L];return F===void 0&&(F=p(l()),O[L]=F),F}function p(S){const R=[],D=[],L=[];for(let N=0;N<e;N++)R[N]=0,D[N]=0,L[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:D,attributeDivisors:L,object:S,attributes:{},index:null}}function u(S,R,D,L){const N=r.attributes,O=R.attributes;let F=0;const H=D.getAttributes();for(const B in H)if(H[B].location>=0){const G=N[B];let Q=O[B];if(Q===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(Q=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(Q=S.instanceColor)),G===void 0||G.attribute!==Q||Q&&G.data!==Q.data)return!0;F++}return r.attributesNum!==F||r.index!==L}function m(S,R,D,L){const N={},O=R.attributes;let F=0;const H=D.getAttributes();for(const B in H)if(H[B].location>=0){let G=O[B];G===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(G=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(G=S.instanceColor));const Q={};Q.attribute=G,G&&G.data&&(Q.data=G.data),N[B]=Q,F++}r.attributes=N,r.attributesNum=F,r.index=L}function v(){const S=r.newAttributes;for(let R=0,D=S.length;R<D;R++)S[R]=0}function g(S){f(S,0)}function f(S,R){const D=r.newAttributes,L=r.enabledAttributes,N=r.attributeDivisors;D[S]=1,L[S]===0&&(i.enableVertexAttribArray(S),L[S]=1),N[S]!==R&&(i.vertexAttribDivisor(S,R),N[S]=R)}function x(){const S=r.newAttributes,R=r.enabledAttributes;for(let D=0,L=R.length;D<L;D++)R[D]!==S[D]&&(i.disableVertexAttribArray(D),R[D]=0)}function y(S,R,D,L,N,O,F){F===!0?i.vertexAttribIPointer(S,R,D,N,O):i.vertexAttribPointer(S,R,D,L,N,O)}function _(S,R,D,L){v();const N=L.attributes,O=D.getAttributes(),F=R.defaultAttributeValues;for(const H in O){const B=O[H];if(B.location>=0){let X=N[H];if(X===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(X=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(X=S.instanceColor)),X!==void 0){const G=X.normalized,Q=X.itemSize,rt=t.get(X);if(rt===void 0)continue;const pt=rt.buffer,zt=rt.type,Ct=rt.bytesPerElement,$=zt===i.INT||zt===i.UNSIGNED_INT||X.gpuType===Dc;if(X.isInterleavedBufferAttribute){const nt=X.data,mt=nt.stride,xt=X.offset;if(nt.isInstancedInterleavedBuffer){for(let bt=0;bt<B.locationSize;bt++)f(B.location+bt,nt.meshPerAttribute);S.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let bt=0;bt<B.locationSize;bt++)g(B.location+bt);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let bt=0;bt<B.locationSize;bt++)y(B.location+bt,Q/B.locationSize,zt,G,mt*Ct,(xt+Q/B.locationSize*bt)*Ct,$)}else{if(X.isInstancedBufferAttribute){for(let nt=0;nt<B.locationSize;nt++)f(B.location+nt,X.meshPerAttribute);S.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let nt=0;nt<B.locationSize;nt++)g(B.location+nt);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let nt=0;nt<B.locationSize;nt++)y(B.location+nt,Q/B.locationSize,zt,G,Q*Ct,Q/B.locationSize*nt*Ct,$)}}else if(F!==void 0){const G=F[H];if(G!==void 0)switch(G.length){case 2:i.vertexAttrib2fv(B.location,G);break;case 3:i.vertexAttrib3fv(B.location,G);break;case 4:i.vertexAttrib4fv(B.location,G);break;default:i.vertexAttrib1fv(B.location,G)}}}}x()}function T(){E();for(const S in n){const R=n[S];for(const D in R){const L=R[D];for(const N in L)h(L[N].object),delete L[N];delete R[D]}delete n[S]}}function b(S){if(n[S.id]===void 0)return;const R=n[S.id];for(const D in R){const L=R[D];for(const N in L)h(L[N].object),delete L[N];delete R[D]}delete n[S.id]}function w(S){for(const R in n){const D=n[R];if(D[S.id]===void 0)continue;const L=D[S.id];for(const N in L)h(L[N].object),delete L[N];delete D[S.id]}}function E(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:M,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function Dg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let u=0;for(let m=0;m<d;m++)u+=h[m];e.update(u,n,1)}function l(c,h,d,p){if(d===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)a(c[m],h[m],p[m]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,d);let m=0;for(let v=0;v<d;v++)m+=h[v]*p[v];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Ug(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==Fn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const E=w===hi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==ci&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==qn&&!E)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,p=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:p,maxTextures:u,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:_,vertexTextures:T,maxSamples:b}}function Ng(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new os,o=new ae,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,p){const u=d.length!==0||p||n!==0||s;return s=p,n=d.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,p){e=h(d,p,0)},this.setState=function(d,p,u){const m=d.clippingPlanes,v=d.clipIntersection,g=d.clipShadows,f=i.get(d);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const x=r?0:n,y=x*4;let _=f.clippingState||null;l.value=_,_=h(m,p,y,u);for(let T=0;T!==y;++T)_[T]=e[T];f.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,p,u,m){const v=d!==null?d.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const f=u+v*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<f)&&(g=new Float32Array(f));for(let y=0,_=u;y!==v;++y,_+=4)a.copy(d[y]).applyMatrix4(x,o),a.normal.toArray(g,_),g[_+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Fg(i){let t=new WeakMap;function e(a,o){return o===Il?a.mapping=Qs:o===Ll&&(a.mapping=tr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Il||o===Ll)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Z0(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Zs=4,Qh=[.125,.215,.35,.446,.526,.582],hs=20,cl=new Kc,tu=new qt;let hl=null,ul=0,dl=0,fl=!1;const ls=(1+Math.sqrt(5))/2,Gs=1/ls,eu=[new I(-ls,Gs,0),new I(ls,Gs,0),new I(-Gs,0,ls),new I(Gs,0,ls),new I(0,ls,-Gs),new I(0,ls,Gs),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Og=new I;class mc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Og}=r;hl=this._renderer.getRenderTarget(),ul=this._renderer.getActiveCubeFace(),dl=this._renderer.getActiveMipmapLevel(),fl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(hl,ul,dl),this._renderer.xr.enabled=fl,t.scissorTest=!1,La(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Qs||t.mapping===tr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),hl=this._renderer.getRenderTarget(),ul=this._renderer.getActiveCubeFace(),dl=this._renderer.getActiveMipmapLevel(),fl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ii,minFilter:ii,generateMipmaps:!1,type:hi,format:Fn,colorSpace:ir,depthBuffer:!1},s=nu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=nu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=zg(r)),this._blurMaterial=Bg(r,t,e)}return s}_compileMaterial(t){const e=new Ft(this._lodPlanes[0],t);this._renderer.compile(e,cl)}_sceneToCubeUV(t,e,n,s,r){const l=new rn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,p=d.autoClear,u=d.toneMapping;d.getClearColor(tu),d.toneMapping=Vi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));const v=new Ke({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1}),g=new Ft(new An,v);let f=!1;const x=t.background;x?x.isColor&&(v.color.copy(x),t.background=null,f=!0):(v.color.copy(tu),f=!0);for(let y=0;y<6;y++){const _=y%3;_===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):_===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const T=this._cubeSize;La(s,_*T,y>2?T:0,T,T),d.setRenderTarget(s),f&&d.render(g,l),d.render(t,l)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=u,d.autoClear=p,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Qs||t.mapping===tr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=su()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=iu());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ft(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;La(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,cl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=eu[(s-r-1)%eu.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Ft(this._lodPlanes[s],c),p=c.uniforms,u=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*hs-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):hs;g>hs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${hs}`);const f=[];let x=0;for(let w=0;w<hs;++w){const E=w/v,M=Math.exp(-E*E/2);f.push(M),w===0?x+=M:w<g&&(x+=2*M)}for(let w=0;w<f.length;w++)f[w]=f[w]/x;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=f,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:y}=this;p.dTheta.value=m,p.mipInt.value=y-n;const _=this._sizeLods[s],T=3*_*(s>y-Zs?s-y+Zs:0),b=4*(this._cubeSize-_);La(e,T,b,3*_,2*_),l.setRenderTarget(e),l.render(d,cl)}}function zg(i){const t=[],e=[],n=[];let s=i;const r=i-Zs+1+Qh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Zs?l=Qh[a-i+Zs-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,p=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,m=6,v=3,g=2,f=1,x=new Float32Array(v*m*u),y=new Float32Array(g*m*u),_=new Float32Array(f*m*u);for(let b=0;b<u;b++){const w=b%3*2/3-1,E=b>2?0:-1,M=[w,E,0,w+2/3,E,0,w+2/3,E+1,0,w,E,0,w+2/3,E+1,0,w,E+1,0];x.set(M,v*m*b),y.set(p,g*m*b);const S=[b,b,b,b,b,b];_.set(S,f*m*b)}const T=new Ae;T.setAttribute("position",new Ce(x,v)),T.setAttribute("uv",new Ce(y,g)),T.setAttribute("faceIndex",new Ce(_,f)),t.push(T),s>Zs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function nu(i,t,e){const n=new En(i,t,e);return n.texture.mapping=vo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function La(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Bg(i,t,e){const n=new Float32Array(hs),s=new I(0,1,0);return new un({name:"SphericalGaussianBlur",defines:{n:hs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jc(),fragmentShader:`

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
		`,blending:hn,depthTest:!1,depthWrite:!1})}function iu(){return new un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jc(),fragmentShader:`

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
		`,blending:hn,depthTest:!1,depthWrite:!1})}function su(){return new un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function jc(){return`

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
	`}function kg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Il||l===Ll,h=l===Qs||l===tr;if(c||h){let d=t.get(o);const p=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new mc(i)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new mc(i)),d=c?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Hg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Vr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Gg(i,t,e,n){const s={},r=new WeakMap;function a(d){const p=d.target;p.index!==null&&t.remove(p.index);for(const m in p.attributes)t.remove(p.attributes[m]);p.removeEventListener("dispose",a),delete s[p.id];const u=r.get(p);u&&(t.remove(u),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(d,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,e.memory.geometries++),p}function l(d){const p=d.attributes;for(const u in p)t.update(p[u],i.ARRAY_BUFFER)}function c(d){const p=[],u=d.index,m=d.attributes.position;let v=0;if(u!==null){const x=u.array;v=u.version;for(let y=0,_=x.length;y<_;y+=3){const T=x[y+0],b=x[y+1],w=x[y+2];p.push(T,b,b,w,w,T)}}else if(m!==void 0){const x=m.array;v=m.version;for(let y=0,_=x.length/3-1;y<_;y+=3){const T=y+0,b=y+1,w=y+2;p.push(T,b,b,w,w,T)}}else return;const g=new(Rd(p)?Ld:Id)(p,1);g.version=v;const f=r.get(d);f&&t.remove(f),r.set(d,g)}function h(d){const p=r.get(d);if(p){const u=d.index;u!==null&&p.version<u.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Vg(i,t,e){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,u){i.drawElements(n,u,r,p*a),e.update(u,n,1)}function c(p,u,m){m!==0&&(i.drawElementsInstanced(n,u,r,p*a,m),e.update(u,n,m))}function h(p,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,p,0,m);let g=0;for(let f=0;f<m;f++)g+=u[f];e.update(g,n,1)}function d(p,u,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<p.length;f++)c(p[f]/a,u[f],v[f]);else{g.multiDrawElementsInstancedWEBGL(n,u,0,r,p,0,v,0,m);let f=0;for(let x=0;x<m;x++)f+=u[x]*v[x];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Wg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Xg(i,t,e){const n=new WeakMap,s=new Me;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==d){let M=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",M)};p!==void 0&&p.texture.dispose();const u=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let y=0;u===!0&&(y=1),m===!0&&(y=2),v===!0&&(y=3);let _=o.attributes.position.count*y,T=1;_>t.maxTextureSize&&(T=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*T*4*d),w=new Cd(b,_,T,d);w.type=qn,w.needsUpdate=!0;const E=y*4;for(let S=0;S<d;S++){const R=g[S],D=f[S],L=x[S],N=_*T*4*S;for(let O=0;O<R.count;O++){const F=O*E;u===!0&&(s.fromBufferAttribute(R,O),b[N+F+0]=s.x,b[N+F+1]=s.y,b[N+F+2]=s.z,b[N+F+3]=0),m===!0&&(s.fromBufferAttribute(D,O),b[N+F+4]=s.x,b[N+F+5]=s.y,b[N+F+6]=s.z,b[N+F+7]=0),v===!0&&(s.fromBufferAttribute(L,O),b[N+F+8]=s.x,b[N+F+9]=s.y,b[N+F+10]=s.z,b[N+F+11]=L.itemSize===4?s.w:1)}}p={count:d,texture:w,size:new ft(_,T)},n.set(o,p),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let u=0;for(let v=0;v<c.length;v++)u+=c[v];const m=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function qg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const Kd=new je,ru=new qc(1,1),jd=new Cd,Qd=new D0,tf=new Nd,au=[],ou=[],lu=new Float32Array(16),cu=new Float32Array(9),hu=new Float32Array(4);function cr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=au[s];if(r===void 0&&(r=new Float32Array(s),au[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ve(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function We(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function wo(i,t){let e=ou[t];e===void 0&&(e=new Int32Array(t),ou[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Yg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function $g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;i.uniform2fv(this.addr,t),We(e,t)}}function Zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ve(e,t))return;i.uniform3fv(this.addr,t),We(e,t)}}function Jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;i.uniform4fv(this.addr,t),We(e,t)}}function Kg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;hu.set(n),i.uniformMatrix2fv(this.addr,!1,hu),We(e,n)}}function jg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;cu.set(n),i.uniformMatrix3fv(this.addr,!1,cu),We(e,n)}}function Qg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;lu.set(n),i.uniformMatrix4fv(this.addr,!1,lu),We(e,n)}}function tv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ev(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;i.uniform2iv(this.addr,t),We(e,t)}}function nv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;i.uniform3iv(this.addr,t),We(e,t)}}function iv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;i.uniform4iv(this.addr,t),We(e,t)}}function sv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function rv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;i.uniform2uiv(this.addr,t),We(e,t)}}function av(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;i.uniform3uiv(this.addr,t),We(e,t)}}function ov(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;i.uniform4uiv(this.addr,t),We(e,t)}}function lv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ru.compareFunction=Ad,r=ru):r=Kd,e.setTexture2D(t||r,s)}function cv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Qd,s)}function hv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||tf,s)}function uv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||jd,s)}function dv(i){switch(i){case 5126:return Yg;case 35664:return $g;case 35665:return Zg;case 35666:return Jg;case 35674:return Kg;case 35675:return jg;case 35676:return Qg;case 5124:case 35670:return tv;case 35667:case 35671:return ev;case 35668:case 35672:return nv;case 35669:case 35673:return iv;case 5125:return sv;case 36294:return rv;case 36295:return av;case 36296:return ov;case 35678:case 36198:case 36298:case 36306:case 35682:return lv;case 35679:case 36299:case 36307:return cv;case 35680:case 36300:case 36308:case 36293:return hv;case 36289:case 36303:case 36311:case 36292:return uv}}function fv(i,t){i.uniform1fv(this.addr,t)}function pv(i,t){const e=cr(t,this.size,2);i.uniform2fv(this.addr,e)}function mv(i,t){const e=cr(t,this.size,3);i.uniform3fv(this.addr,e)}function gv(i,t){const e=cr(t,this.size,4);i.uniform4fv(this.addr,e)}function vv(i,t){const e=cr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function xv(i,t){const e=cr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function _v(i,t){const e=cr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function yv(i,t){i.uniform1iv(this.addr,t)}function Mv(i,t){i.uniform2iv(this.addr,t)}function Sv(i,t){i.uniform3iv(this.addr,t)}function bv(i,t){i.uniform4iv(this.addr,t)}function wv(i,t){i.uniform1uiv(this.addr,t)}function Tv(i,t){i.uniform2uiv(this.addr,t)}function Ev(i,t){i.uniform3uiv(this.addr,t)}function Av(i,t){i.uniform4uiv(this.addr,t)}function Rv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);Ve(n,r)||(i.uniform1iv(this.addr,r),We(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Kd,r[a])}function Cv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);Ve(n,r)||(i.uniform1iv(this.addr,r),We(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Qd,r[a])}function Pv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);Ve(n,r)||(i.uniform1iv(this.addr,r),We(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||tf,r[a])}function Iv(i,t,e){const n=this.cache,s=t.length,r=wo(e,s);Ve(n,r)||(i.uniform1iv(this.addr,r),We(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||jd,r[a])}function Lv(i){switch(i){case 5126:return fv;case 35664:return pv;case 35665:return mv;case 35666:return gv;case 35674:return vv;case 35675:return xv;case 35676:return _v;case 5124:case 35670:return yv;case 35667:case 35671:return Mv;case 35668:case 35672:return Sv;case 35669:case 35673:return bv;case 5125:return wv;case 36294:return Tv;case 36295:return Ev;case 36296:return Av;case 35678:case 36198:case 36298:case 36306:case 35682:return Rv;case 35679:case 36299:case 36307:return Cv;case 35680:case 36300:case 36308:case 36293:return Pv;case 36289:case 36303:case 36311:case 36292:return Iv}}class Dv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=dv(e.type)}}class Uv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Lv(e.type)}}class Nv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const pl=/(\w+)(\])?(\[|\.)?/g;function uu(i,t){i.seq.push(t),i.map[t.id]=t}function Fv(i,t,e){const n=i.name,s=n.length;for(pl.lastIndex=0;;){const r=pl.exec(n),a=pl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){uu(e,c===void 0?new Dv(o,i,t):new Uv(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new Nv(o),uu(e,d)),e=d}}}class Ja{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Fv(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function du(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Ov=37297;let zv=0;function Bv(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const fu=new ae;function kv(i){me._getMatrix(fu,me.workingColorSpace,i);const t=`mat3( ${fu.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case to:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function pu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Bv(i.getShaderSource(t),o)}else return r}function Hv(i,t){const e=kv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Gv(i,t){let e;switch(t){case fd:e="Linear";break;case pd:e="Reinhard";break;case md:e="Cineon";break;case Lc:e="ACESFilmic";break;case vd:e="AgX";break;case xd:e="Neutral";break;case gd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Da=new I;function Vv(){me.getLuminanceCoefficients(Da);const i=Da.x.toFixed(4),t=Da.y.toFixed(4),e=Da.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Wv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Er).join(`
`)}function Xv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function qv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Er(i){return i!==""}function mu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function gu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function gc(i){return i.replace(Yv,Zv)}const $v=new Map;function Zv(i,t){let e=oe[t];if(e===void 0){const n=$v.get(t);if(n!==void 0)e=oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return gc(e)}const Jv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vu(i){return i.replace(Jv,Kv)}function Kv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function jv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ld?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===cd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bi&&(t="SHADOWMAP_TYPE_VSM"),t}function Qv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Qs:case tr:t="ENVMAP_TYPE_CUBE";break;case vo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function tx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case tr:t="ENVMAP_MODE_REFRACTION";break}return t}function ex(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ic:t="ENVMAP_BLENDING_MULTIPLY";break;case Kf:t="ENVMAP_BLENDING_MIX";break;case jf:t="ENVMAP_BLENDING_ADD";break}return t}function nx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function ix(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=jv(e),c=Qv(e),h=tx(e),d=ex(e),p=nx(e),u=Wv(e),m=Xv(r),v=s.createProgram();let g,f,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Er).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Er).join(`
`),f.length>0&&(f+=`
`)):(g=[xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Er).join(`
`),f=[xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vi?"#define TONE_MAPPING":"",e.toneMapping!==Vi?oe.tonemapping_pars_fragment:"",e.toneMapping!==Vi?Gv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",oe.colorspace_pars_fragment,Hv("linearToOutputTexel",e.outputColorSpace),Vv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Er).join(`
`)),a=gc(a),a=mu(a,e),a=gu(a,e),o=gc(o),o=mu(o,e),o=gu(o,e),a=vu(a),o=vu(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",e.glslVersion===mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=x+g+a,_=x+f+o,T=du(s,s.VERTEX_SHADER,y),b=du(s,s.FRAGMENT_SHADER,_);s.attachShader(v,T),s.attachShader(v,b),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(R){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(v)||"",L=s.getShaderInfoLog(T)||"",N=s.getShaderInfoLog(b)||"",O=D.trim(),F=L.trim(),H=N.trim();let B=!0,X=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,T,b);else{const G=pu(s,T,"vertex"),Q=pu(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+O+`
`+G+`
`+Q)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(F===""||H==="")&&(X=!1);X&&(R.diagnostics={runnable:B,programLog:O,vertexShader:{log:F,prefix:g},fragmentShader:{log:H,prefix:f}})}s.deleteShader(T),s.deleteShader(b),E=new Ja(s,v),M=qv(s,v)}let E;this.getUniforms=function(){return E===void 0&&w(this),E};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(v,Ov)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=zv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=T,this.fragmentShader=b,this}let sx=0;class rx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new ax(t),e.set(t,n)),n}}class ax{constructor(t){this.id=sx++,this.code=t,this.usedTimes=0}}function ox(i,t,e,n,s,r,a){const o=new Gc,l=new rx,c=new Set,h=[],d=s.logarithmicDepthBuffer,p=s.vertexTextures;let u=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,S,R,D,L){const N=D.fog,O=L.geometry,F=M.isMeshStandardMaterial?D.environment:null,H=(M.isMeshStandardMaterial?e:t).get(M.envMap||F),B=H&&H.mapping===vo?H.image.height:null,X=m[M.type];M.precision!==null&&(u=s.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const G=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Q=G!==void 0?G.length:0;let rt=0;O.morphAttributes.position!==void 0&&(rt=1),O.morphAttributes.normal!==void 0&&(rt=2),O.morphAttributes.color!==void 0&&(rt=3);let pt,zt,Ct,$;if(X){const ve=Qn[X];pt=ve.vertexShader,zt=ve.fragmentShader}else pt=M.vertexShader,zt=M.fragmentShader,l.update(M),Ct=l.getVertexShaderID(M),$=l.getFragmentShaderID(M);const nt=i.getRenderTarget(),mt=i.state.buffers.depth.getReversed(),xt=L.isInstancedMesh===!0,bt=L.isBatchedMesh===!0,Wt=!!M.map,Qt=!!M.matcap,z=!!H,lt=!!M.aoMap,ct=!!M.lightMap,J=!!M.bumpMap,j=!!M.normalMap,at=!!M.displacementMap,st=!!M.emissiveMap,ut=!!M.metalnessMap,Bt=!!M.roughnessMap,vt=M.anisotropy>0,P=M.clearcoat>0,A=M.dispersion>0,W=M.iridescence>0,K=M.sheen>0,ht=M.transmission>0,Z=vt&&!!M.anisotropyMap,wt=P&&!!M.clearcoatMap,gt=P&&!!M.clearcoatNormalMap,Pt=P&&!!M.clearcoatRoughnessMap,Ut=W&&!!M.iridescenceMap,_t=W&&!!M.iridescenceThicknessMap,It=K&&!!M.sheenColorMap,Jt=K&&!!M.sheenRoughnessMap,Xt=!!M.specularMap,At=!!M.specularColorMap,te=!!M.specularIntensityMap,V=ht&&!!M.transmissionMap,yt=ht&&!!M.thicknessMap,Tt=!!M.gradientMap,Ht=!!M.alphaMap,Mt=M.alphaTest>0,dt=!!M.alphaHash,Vt=!!M.extensions;let re=Vi;M.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(re=i.toneMapping);const we={shaderID:X,shaderType:M.type,shaderName:M.name,vertexShader:pt,fragmentShader:zt,defines:M.defines,customVertexShaderID:Ct,customFragmentShaderID:$,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:bt,batchingColor:bt&&L._colorsTexture!==null,instancing:xt,instancingColor:xt&&L.instanceColor!==null,instancingMorph:xt&&L.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:nt===null?i.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:ir,alphaToCoverage:!!M.alphaToCoverage,map:Wt,matcap:Qt,envMap:z,envMapMode:z&&H.mapping,envMapCubeUVHeight:B,aoMap:lt,lightMap:ct,bumpMap:J,normalMap:j,displacementMap:p&&at,emissiveMap:st,normalMapObjectSpace:j&&M.normalMapType===n0,normalMapTangentSpace:j&&M.normalMapType===_o,metalnessMap:ut,roughnessMap:Bt,anisotropy:vt,anisotropyMap:Z,clearcoat:P,clearcoatMap:wt,clearcoatNormalMap:gt,clearcoatRoughnessMap:Pt,dispersion:A,iridescence:W,iridescenceMap:Ut,iridescenceThicknessMap:_t,sheen:K,sheenColorMap:It,sheenRoughnessMap:Jt,specularMap:Xt,specularColorMap:At,specularIntensityMap:te,transmission:ht,transmissionMap:V,thicknessMap:yt,gradientMap:Tt,opaque:M.transparent===!1&&M.blending===Js&&M.alphaToCoverage===!1,alphaMap:Ht,alphaTest:Mt,alphaHash:dt,combine:M.combine,mapUv:Wt&&v(M.map.channel),aoMapUv:lt&&v(M.aoMap.channel),lightMapUv:ct&&v(M.lightMap.channel),bumpMapUv:J&&v(M.bumpMap.channel),normalMapUv:j&&v(M.normalMap.channel),displacementMapUv:at&&v(M.displacementMap.channel),emissiveMapUv:st&&v(M.emissiveMap.channel),metalnessMapUv:ut&&v(M.metalnessMap.channel),roughnessMapUv:Bt&&v(M.roughnessMap.channel),anisotropyMapUv:Z&&v(M.anisotropyMap.channel),clearcoatMapUv:wt&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:gt&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:_t&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:It&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Jt&&v(M.sheenRoughnessMap.channel),specularMapUv:Xt&&v(M.specularMap.channel),specularColorMapUv:At&&v(M.specularColorMap.channel),specularIntensityMapUv:te&&v(M.specularIntensityMap.channel),transmissionMapUv:V&&v(M.transmissionMap.channel),thicknessMapUv:yt&&v(M.thicknessMap.channel),alphaMapUv:Ht&&v(M.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(j||vt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!O.attributes.uv&&(Wt||Ht),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:mt,skinning:L.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:rt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:re,decodeVideoTexture:Wt&&M.map.isVideoTexture===!0&&me.getTransfer(M.map.colorSpace)===xe,decodeVideoTextureEmissive:st&&M.emissiveMap.isVideoTexture===!0&&me.getTransfer(M.emissiveMap.colorSpace)===xe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Be,flipSided:M.side===an,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Vt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vt&&M.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function f(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const R in M.defines)S.push(R),S.push(M.defines[R]);return M.isRawShaderMaterial===!1&&(x(S,M),y(S,M),S.push(i.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function x(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function y(M,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),M.push(o.mask)}function _(M){const S=m[M.type];let R;if(S){const D=Qn[S];R=ps.clone(D.uniforms)}else R=M.uniforms;return R}function T(M,S){let R;for(let D=0,L=h.length;D<L;D++){const N=h[D];if(N.cacheKey===S){R=N,++R.usedTimes;break}}return R===void 0&&(R=new ix(i,S,M,r),h.push(R)),R}function b(M){if(--M.usedTimes===0){const S=h.indexOf(M);h[S]=h[h.length-1],h.pop(),M.destroy()}}function w(M){l.remove(M)}function E(){l.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:_,acquireProgram:T,releaseProgram:b,releaseShaderCache:w,programs:h,dispose:E}}function lx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function cx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function _u(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function yu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(d,p,u,m,v,g){let f=i[t];return f===void 0?(f={id:d.id,object:d,geometry:p,material:u,groupOrder:m,renderOrder:d.renderOrder,z:v,group:g},i[t]=f):(f.id=d.id,f.object=d,f.geometry=p,f.material=u,f.groupOrder=m,f.renderOrder=d.renderOrder,f.z=v,f.group=g),t++,f}function o(d,p,u,m,v,g){const f=a(d,p,u,m,v,g);u.transmission>0?n.push(f):u.transparent===!0?s.push(f):e.push(f)}function l(d,p,u,m,v,g){const f=a(d,p,u,m,v,g);u.transmission>0?n.unshift(f):u.transparent===!0?s.unshift(f):e.unshift(f)}function c(d,p){e.length>1&&e.sort(d||cx),n.length>1&&n.sort(p||_u),s.length>1&&s.sort(p||_u)}function h(){for(let d=t,p=i.length;d<p;d++){const u=i[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function hx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new yu,i.set(n,[a])):s>=r.length?(a=new yu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function ux(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new qt};break;case"SpotLight":e={position:new I,direction:new I,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function dx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let fx=0;function px(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function mx(i){const t=new ux,e=dx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new $t,a=new $t;function o(c){let h=0,d=0,p=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let u=0,m=0,v=0,g=0,f=0,x=0,y=0,_=0,T=0,b=0,w=0;c.sort(px);for(let M=0,S=c.length;M<S;M++){const R=c[M],D=R.color,L=R.intensity,N=R.distance,O=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=D.r*L,d+=D.g*L,p+=D.b*L;else if(R.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(R.sh.coefficients[F],L);w++}else if(R.isDirectionalLight){const F=t.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const H=R.shadow,B=e.get(R);B.shadowIntensity=H.intensity,B.shadowBias=H.bias,B.shadowNormalBias=H.normalBias,B.shadowRadius=H.radius,B.shadowMapSize=H.mapSize,n.directionalShadow[u]=B,n.directionalShadowMap[u]=O,n.directionalShadowMatrix[u]=R.shadow.matrix,x++}n.directional[u]=F,u++}else if(R.isSpotLight){const F=t.get(R);F.position.setFromMatrixPosition(R.matrixWorld),F.color.copy(D).multiplyScalar(L),F.distance=N,F.coneCos=Math.cos(R.angle),F.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),F.decay=R.decay,n.spot[v]=F;const H=R.shadow;if(R.map&&(n.spotLightMap[T]=R.map,T++,H.updateMatrices(R),R.castShadow&&b++),n.spotLightMatrix[v]=H.matrix,R.castShadow){const B=e.get(R);B.shadowIntensity=H.intensity,B.shadowBias=H.bias,B.shadowNormalBias=H.normalBias,B.shadowRadius=H.radius,B.shadowMapSize=H.mapSize,n.spotShadow[v]=B,n.spotShadowMap[v]=O,_++}v++}else if(R.isRectAreaLight){const F=t.get(R);F.color.copy(D).multiplyScalar(L),F.halfWidth.set(R.width*.5,0,0),F.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=F,g++}else if(R.isPointLight){const F=t.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity),F.distance=R.distance,F.decay=R.decay,R.castShadow){const H=R.shadow,B=e.get(R);B.shadowIntensity=H.intensity,B.shadowBias=H.bias,B.shadowNormalBias=H.normalBias,B.shadowRadius=H.radius,B.shadowMapSize=H.mapSize,B.shadowCameraNear=H.camera.near,B.shadowCameraFar=H.camera.far,n.pointShadow[m]=B,n.pointShadowMap[m]=O,n.pointShadowMatrix[m]=R.shadow.matrix,y++}n.point[m]=F,m++}else if(R.isHemisphereLight){const F=t.get(R);F.skyColor.copy(R.color).multiplyScalar(L),F.groundColor.copy(R.groundColor).multiplyScalar(L),n.hemi[f]=F,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Lt.LTC_FLOAT_1,n.rectAreaLTC2=Lt.LTC_FLOAT_2):(n.rectAreaLTC1=Lt.LTC_HALF_1,n.rectAreaLTC2=Lt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=p;const E=n.hash;(E.directionalLength!==u||E.pointLength!==m||E.spotLength!==v||E.rectAreaLength!==g||E.hemiLength!==f||E.numDirectionalShadows!==x||E.numPointShadows!==y||E.numSpotShadows!==_||E.numSpotMaps!==T||E.numLightProbes!==w)&&(n.directional.length=u,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=_+T-b,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=w,E.directionalLength=u,E.pointLength=m,E.spotLength=v,E.rectAreaLength=g,E.hemiLength=f,E.numDirectionalShadows=x,E.numPointShadows=y,E.numSpotShadows=_,E.numSpotMaps=T,E.numLightProbes=w,n.version=fx++)}function l(c,h){let d=0,p=0,u=0,m=0,v=0;const g=h.matrixWorldInverse;for(let f=0,x=c.length;f<x;f++){const y=c[f];if(y.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),d++}else if(y.isSpotLight){const _=n.spot[u];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(y.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(y.isPointLight){const _=n.point[p];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),p++}else if(y.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:n}}function Mu(i){const t=new mx(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function gx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Mu(i),t.set(s,[o])):r>=a.length?(o=new Mu(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const vx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xx=`uniform sampler2D shadow_pass;
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
}`;function _x(i,t,e){let n=new Xc;const s=new ft,r=new ft,a=new Me,o=new Bp({depthPacking:e0}),l=new kp,c={},h=e.maxTextureSize,d={[qi]:an,[an]:qi,[Be]:Be},p=new un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:vx,fragmentShader:xx}),u=p.clone();u.defines.HORIZONTAL_PASS=1;const m=new Ae;m.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ft(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ld;let f=this.type;this.render=function(b,w,E){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const M=i.getRenderTarget(),S=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),D=i.state;D.setBlending(hn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const L=f!==bi&&this.type===bi,N=f===bi&&this.type!==bi;for(let O=0,F=b.length;O<F;O++){const H=b[O],B=H.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const X=B.getFrameExtents();if(s.multiply(X),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,B.mapSize.y=r.y)),B.map===null||L===!0||N===!0){const Q=this.type!==bi?{minFilter:dn,magFilter:dn}:{};B.map!==null&&B.map.dispose(),B.map=new En(s.x,s.y,Q),B.map.texture.name=H.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const G=B.getViewportCount();for(let Q=0;Q<G;Q++){const rt=B.getViewport(Q);a.set(r.x*rt.x,r.y*rt.y,r.x*rt.z,r.y*rt.w),D.viewport(a),B.updateMatrices(H,Q),n=B.getFrustum(),_(w,E,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===bi&&x(B,E),B.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(M,S,R)};function x(b,w){const E=t.update(v);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new En(s.x,s.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(w,null,E,p,v,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(w,null,E,u,v,null)}function y(b,w,E,M){let S=null;const R=E.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)S=R;else if(S=E.isPointLight===!0?l:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const D=S.uuid,L=w.uuid;let N=c[D];N===void 0&&(N={},c[D]=N);let O=N[L];O===void 0&&(O=S.clone(),N[L]=O,w.addEventListener("dispose",T)),S=O}if(S.visible=w.visible,S.wireframe=w.wireframe,M===bi?S.side=w.shadowSide!==null?w.shadowSide:w.side:S.side=w.shadowSide!==null?w.shadowSide:d[w.side],S.alphaMap=w.alphaMap,S.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,S.map=w.map,S.clipShadows=w.clipShadows,S.clippingPlanes=w.clippingPlanes,S.clipIntersection=w.clipIntersection,S.displacementMap=w.displacementMap,S.displacementScale=w.displacementScale,S.displacementBias=w.displacementBias,S.wireframeLinewidth=w.wireframeLinewidth,S.linewidth=w.linewidth,E.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const D=i.properties.get(S);D.light=E}return S}function _(b,w,E,M,S){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===bi)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,b.matrixWorld);const L=t.update(b),N=b.material;if(Array.isArray(N)){const O=L.groups;for(let F=0,H=O.length;F<H;F++){const B=O[F],X=N[B.materialIndex];if(X&&X.visible){const G=y(b,X,M,S);b.onBeforeShadow(i,b,w,E,L,G,B),i.renderBufferDirect(E,null,L,G,b,B),b.onAfterShadow(i,b,w,E,L,G,B)}}}else if(N.visible){const O=y(b,N,M,S);b.onBeforeShadow(i,b,w,E,L,O,null),i.renderBufferDirect(E,null,L,O,b,null),b.onAfterShadow(i,b,w,E,L,O,null)}}const D=b.children;for(let L=0,N=D.length;L<N;L++)_(D[L],w,E,M,S)}function T(b){b.target.removeEventListener("dispose",T);for(const E in c){const M=c[E],S=b.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const yx={[wl]:Tl,[El]:Cl,[Al]:Pl,[js]:Rl,[Tl]:wl,[Cl]:El,[Pl]:Al,[Rl]:js};function Mx(i,t){function e(){let V=!1;const yt=new Me;let Tt=null;const Ht=new Me(0,0,0,0);return{setMask:function(Mt){Tt!==Mt&&!V&&(i.colorMask(Mt,Mt,Mt,Mt),Tt=Mt)},setLocked:function(Mt){V=Mt},setClear:function(Mt,dt,Vt,re,we){we===!0&&(Mt*=re,dt*=re,Vt*=re),yt.set(Mt,dt,Vt,re),Ht.equals(yt)===!1&&(i.clearColor(Mt,dt,Vt,re),Ht.copy(yt))},reset:function(){V=!1,Tt=null,Ht.set(-1,0,0,0)}}}function n(){let V=!1,yt=!1,Tt=null,Ht=null,Mt=null;return{setReversed:function(dt){if(yt!==dt){const Vt=t.get("EXT_clip_control");dt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT),yt=dt;const re=Mt;Mt=null,this.setClear(re)}},getReversed:function(){return yt},setTest:function(dt){dt?nt(i.DEPTH_TEST):mt(i.DEPTH_TEST)},setMask:function(dt){Tt!==dt&&!V&&(i.depthMask(dt),Tt=dt)},setFunc:function(dt){if(yt&&(dt=yx[dt]),Ht!==dt){switch(dt){case wl:i.depthFunc(i.NEVER);break;case Tl:i.depthFunc(i.ALWAYS);break;case El:i.depthFunc(i.LESS);break;case js:i.depthFunc(i.LEQUAL);break;case Al:i.depthFunc(i.EQUAL);break;case Rl:i.depthFunc(i.GEQUAL);break;case Cl:i.depthFunc(i.GREATER);break;case Pl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ht=dt}},setLocked:function(dt){V=dt},setClear:function(dt){Mt!==dt&&(yt&&(dt=1-dt),i.clearDepth(dt),Mt=dt)},reset:function(){V=!1,Tt=null,Ht=null,Mt=null,yt=!1}}}function s(){let V=!1,yt=null,Tt=null,Ht=null,Mt=null,dt=null,Vt=null,re=null,we=null;return{setTest:function(ve){V||(ve?nt(i.STENCIL_TEST):mt(i.STENCIL_TEST))},setMask:function(ve){yt!==ve&&!V&&(i.stencilMask(ve),yt=ve)},setFunc:function(ve,pi,Jn){(Tt!==ve||Ht!==pi||Mt!==Jn)&&(i.stencilFunc(ve,pi,Jn),Tt=ve,Ht=pi,Mt=Jn)},setOp:function(ve,pi,Jn){(dt!==ve||Vt!==pi||re!==Jn)&&(i.stencilOp(ve,pi,Jn),dt=ve,Vt=pi,re=Jn)},setLocked:function(ve){V=ve},setClear:function(ve){we!==ve&&(i.clearStencil(ve),we=ve)},reset:function(){V=!1,yt=null,Tt=null,Ht=null,Mt=null,dt=null,Vt=null,re=null,we=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},p=new WeakMap,u=[],m=null,v=!1,g=null,f=null,x=null,y=null,_=null,T=null,b=null,w=new qt(0,0,0),E=0,M=!1,S=null,R=null,D=null,L=null,N=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,H=0;const B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(B)[1]),F=H>=1):B.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),F=H>=2);let X=null,G={};const Q=i.getParameter(i.SCISSOR_BOX),rt=i.getParameter(i.VIEWPORT),pt=new Me().fromArray(Q),zt=new Me().fromArray(rt);function Ct(V,yt,Tt,Ht){const Mt=new Uint8Array(4),dt=i.createTexture();i.bindTexture(V,dt),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<Tt;Vt++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(yt,0,i.RGBA,1,1,Ht,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(yt+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return dt}const $={};$[i.TEXTURE_2D]=Ct(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Ct(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Ct(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Ct(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),nt(i.DEPTH_TEST),a.setFunc(js),J(!1),j(uh),nt(i.CULL_FACE),lt(hn);function nt(V){h[V]!==!0&&(i.enable(V),h[V]=!0)}function mt(V){h[V]!==!1&&(i.disable(V),h[V]=!1)}function xt(V,yt){return d[V]!==yt?(i.bindFramebuffer(V,yt),d[V]=yt,V===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=yt),V===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=yt),!0):!1}function bt(V,yt){let Tt=u,Ht=!1;if(V){Tt=p.get(yt),Tt===void 0&&(Tt=[],p.set(yt,Tt));const Mt=V.textures;if(Tt.length!==Mt.length||Tt[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,Vt=Mt.length;dt<Vt;dt++)Tt[dt]=i.COLOR_ATTACHMENT0+dt;Tt.length=Mt.length,Ht=!0}}else Tt[0]!==i.BACK&&(Tt[0]=i.BACK,Ht=!0);Ht&&i.drawBuffers(Tt)}function Wt(V){return m!==V?(i.useProgram(V),m=V,!0):!1}const Qt={[Ai]:i.FUNC_ADD,[Of]:i.FUNC_SUBTRACT,[zf]:i.FUNC_REVERSE_SUBTRACT};Qt[Bf]=i.MIN,Qt[kf]=i.MAX;const z={[Ml]:i.ZERO,[Hf]:i.ONE,[Gf]:i.SRC_COLOR,[Sl]:i.SRC_ALPHA,[qf]:i.SRC_ALPHA_SATURATE,[dd]:i.DST_COLOR,[ud]:i.DST_ALPHA,[Vf]:i.ONE_MINUS_SRC_COLOR,[bl]:i.ONE_MINUS_SRC_ALPHA,[Xf]:i.ONE_MINUS_DST_COLOR,[Wf]:i.ONE_MINUS_DST_ALPHA,[Yf]:i.CONSTANT_COLOR,[$f]:i.ONE_MINUS_CONSTANT_COLOR,[Zf]:i.CONSTANT_ALPHA,[Jf]:i.ONE_MINUS_CONSTANT_ALPHA};function lt(V,yt,Tt,Ht,Mt,dt,Vt,re,we,ve){if(V===hn){v===!0&&(mt(i.BLEND),v=!1);return}if(v===!1&&(nt(i.BLEND),v=!0),V!==hd){if(V!==g||ve!==M){if((f!==Ai||_!==Ai)&&(i.blendEquation(i.FUNC_ADD),f=Ai,_=Ai),ve)switch(V){case Js:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zr:i.blendFunc(i.ONE,i.ONE);break;case dh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case fh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Js:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case dh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}x=null,y=null,T=null,b=null,w.set(0,0,0),E=0,g=V,M=ve}return}Mt=Mt||yt,dt=dt||Tt,Vt=Vt||Ht,(yt!==f||Mt!==_)&&(i.blendEquationSeparate(Qt[yt],Qt[Mt]),f=yt,_=Mt),(Tt!==x||Ht!==y||dt!==T||Vt!==b)&&(i.blendFuncSeparate(z[Tt],z[Ht],z[dt],z[Vt]),x=Tt,y=Ht,T=dt,b=Vt),(re.equals(w)===!1||we!==E)&&(i.blendColor(re.r,re.g,re.b,we),w.copy(re),E=we),g=V,M=!1}function ct(V,yt){V.side===Be?mt(i.CULL_FACE):nt(i.CULL_FACE);let Tt=V.side===an;yt&&(Tt=!Tt),J(Tt),V.blending===Js&&V.transparent===!1?lt(hn):lt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),r.setMask(V.colorWrite);const Ht=V.stencilWrite;o.setTest(Ht),Ht&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),st(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?nt(i.SAMPLE_ALPHA_TO_COVERAGE):mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function J(V){S!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),S=V)}function j(V){V!==Nf?(nt(i.CULL_FACE),V!==R&&(V===uh?i.cullFace(i.BACK):V===Ff?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):mt(i.CULL_FACE),R=V}function at(V){V!==D&&(F&&i.lineWidth(V),D=V)}function st(V,yt,Tt){V?(nt(i.POLYGON_OFFSET_FILL),(L!==yt||N!==Tt)&&(i.polygonOffset(yt,Tt),L=yt,N=Tt)):mt(i.POLYGON_OFFSET_FILL)}function ut(V){V?nt(i.SCISSOR_TEST):mt(i.SCISSOR_TEST)}function Bt(V){V===void 0&&(V=i.TEXTURE0+O-1),X!==V&&(i.activeTexture(V),X=V)}function vt(V,yt,Tt){Tt===void 0&&(X===null?Tt=i.TEXTURE0+O-1:Tt=X);let Ht=G[Tt];Ht===void 0&&(Ht={type:void 0,texture:void 0},G[Tt]=Ht),(Ht.type!==V||Ht.texture!==yt)&&(X!==Tt&&(i.activeTexture(Tt),X=Tt),i.bindTexture(V,yt||$[V]),Ht.type=V,Ht.texture=yt)}function P(){const V=G[X];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function K(){try{i.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ht(){try{i.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function wt(){try{i.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gt(){try{i.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Pt(){try{i.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ut(){try{i.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function _t(){try{i.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function It(V){pt.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),pt.copy(V))}function Jt(V){zt.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),zt.copy(V))}function Xt(V,yt){let Tt=c.get(yt);Tt===void 0&&(Tt=new WeakMap,c.set(yt,Tt));let Ht=Tt.get(V);Ht===void 0&&(Ht=i.getUniformBlockIndex(yt,V.name),Tt.set(V,Ht))}function At(V,yt){const Ht=c.get(yt).get(V);l.get(yt)!==Ht&&(i.uniformBlockBinding(yt,Ht,V.__bindingPointIndex),l.set(yt,Ht))}function te(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},X=null,G={},d={},p=new WeakMap,u=[],m=null,v=!1,g=null,f=null,x=null,y=null,_=null,T=null,b=null,w=new qt(0,0,0),E=0,M=!1,S=null,R=null,D=null,L=null,N=null,pt.set(0,0,i.canvas.width,i.canvas.height),zt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:nt,disable:mt,bindFramebuffer:xt,drawBuffers:bt,useProgram:Wt,setBlending:lt,setMaterial:ct,setFlipSided:J,setCullFace:j,setLineWidth:at,setPolygonOffset:st,setScissorTest:ut,activeTexture:Bt,bindTexture:vt,unbindTexture:P,compressedTexImage2D:A,compressedTexImage3D:W,texImage2D:Ut,texImage3D:_t,updateUBOMapping:Xt,uniformBlockBinding:At,texStorage2D:gt,texStorage3D:Pt,texSubImage2D:K,texSubImage3D:ht,compressedTexSubImage2D:Z,compressedTexSubImage3D:wt,scissor:It,viewport:Jt,reset:te}}function Sx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap;let d;const p=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,A){return u?new OffscreenCanvas(P,A):Gr("canvas")}function v(P,A,W){let K=1;const ht=vt(P);if((ht.width>W||ht.height>W)&&(K=W/Math.max(ht.width,ht.height)),K<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const Z=Math.floor(K*ht.width),wt=Math.floor(K*ht.height);d===void 0&&(d=m(Z,wt));const gt=A?m(Z,wt):d;return gt.width=Z,gt.height=wt,gt.getContext("2d").drawImage(P,0,0,Z,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+Z+"x"+wt+")."),gt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),P;return P}function g(P){return P.generateMipmaps}function f(P){i.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(P,A,W,K,ht=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Z=A;if(A===i.RED&&(W===i.FLOAT&&(Z=i.R32F),W===i.HALF_FLOAT&&(Z=i.R16F),W===i.UNSIGNED_BYTE&&(Z=i.R8)),A===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.R8UI),W===i.UNSIGNED_SHORT&&(Z=i.R16UI),W===i.UNSIGNED_INT&&(Z=i.R32UI),W===i.BYTE&&(Z=i.R8I),W===i.SHORT&&(Z=i.R16I),W===i.INT&&(Z=i.R32I)),A===i.RG&&(W===i.FLOAT&&(Z=i.RG32F),W===i.HALF_FLOAT&&(Z=i.RG16F),W===i.UNSIGNED_BYTE&&(Z=i.RG8)),A===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.RG8UI),W===i.UNSIGNED_SHORT&&(Z=i.RG16UI),W===i.UNSIGNED_INT&&(Z=i.RG32UI),W===i.BYTE&&(Z=i.RG8I),W===i.SHORT&&(Z=i.RG16I),W===i.INT&&(Z=i.RG32I)),A===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),W===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),W===i.UNSIGNED_INT&&(Z=i.RGB32UI),W===i.BYTE&&(Z=i.RGB8I),W===i.SHORT&&(Z=i.RGB16I),W===i.INT&&(Z=i.RGB32I)),A===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),W===i.UNSIGNED_INT&&(Z=i.RGBA32UI),W===i.BYTE&&(Z=i.RGBA8I),W===i.SHORT&&(Z=i.RGBA16I),W===i.INT&&(Z=i.RGBA32I)),A===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),A===i.RGBA){const wt=ht?to:me.getTransfer(K);W===i.FLOAT&&(Z=i.RGBA32F),W===i.HALF_FLOAT&&(Z=i.RGBA16F),W===i.UNSIGNED_BYTE&&(Z=wt===xe?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function _(P,A){let W;return P?A===null||A===vs||A===er?W=i.DEPTH24_STENCIL8:A===qn?W=i.DEPTH32F_STENCIL8:A===Br&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===vs||A===er?W=i.DEPTH_COMPONENT24:A===qn?W=i.DEPTH_COMPONENT32F:A===Br&&(W=i.DEPTH_COMPONENT16),W}function T(P,A){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==dn&&P.minFilter!==ii?Math.log2(Math.max(A.width,A.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?A.mipmaps.length:1}function b(P){const A=P.target;A.removeEventListener("dispose",b),E(A),A.isVideoTexture&&h.delete(A)}function w(P){const A=P.target;A.removeEventListener("dispose",w),S(A)}function E(P){const A=n.get(P);if(A.__webglInit===void 0)return;const W=P.source,K=p.get(W);if(K){const ht=K[A.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&M(P),Object.keys(K).length===0&&p.delete(W)}n.remove(P)}function M(P){const A=n.get(P);i.deleteTexture(A.__webglTexture);const W=P.source,K=p.get(W);delete K[A.__cacheKey],a.memory.textures--}function S(P){const A=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(A.__webglFramebuffer[K]))for(let ht=0;ht<A.__webglFramebuffer[K].length;ht++)i.deleteFramebuffer(A.__webglFramebuffer[K][ht]);else i.deleteFramebuffer(A.__webglFramebuffer[K]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[K])}else{if(Array.isArray(A.__webglFramebuffer))for(let K=0;K<A.__webglFramebuffer.length;K++)i.deleteFramebuffer(A.__webglFramebuffer[K]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let K=0;K<A.__webglColorRenderbuffer.length;K++)A.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[K]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const W=P.textures;for(let K=0,ht=W.length;K<ht;K++){const Z=n.get(W[K]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(W[K])}n.remove(P)}let R=0;function D(){R=0}function L(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function N(P){const A=[];return A.push(P.wrapS),A.push(P.wrapT),A.push(P.wrapR||0),A.push(P.magFilter),A.push(P.minFilter),A.push(P.anisotropy),A.push(P.internalFormat),A.push(P.format),A.push(P.type),A.push(P.generateMipmaps),A.push(P.premultiplyAlpha),A.push(P.flipY),A.push(P.unpackAlignment),A.push(P.colorSpace),A.join()}function O(P,A){const W=n.get(P);if(P.isVideoTexture&&ut(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&W.__version!==P.version){const K=P.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(W,P,A);return}}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+A)}function F(P,A){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){$(W,P,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+A)}function H(P,A){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){$(W,P,A);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+A)}function B(P,A){const W=n.get(P);if(P.version>0&&W.__version!==P.version){nt(W,P,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+A)}const X={[li]:i.REPEAT,[ds]:i.CLAMP_TO_EDGE,[Dl]:i.MIRRORED_REPEAT},G={[dn]:i.NEAREST,[Qf]:i.NEAREST_MIPMAP_NEAREST,[na]:i.NEAREST_MIPMAP_LINEAR,[ii]:i.LINEAR,[Do]:i.LINEAR_MIPMAP_NEAREST,[fs]:i.LINEAR_MIPMAP_LINEAR},Q={[i0]:i.NEVER,[c0]:i.ALWAYS,[s0]:i.LESS,[Ad]:i.LEQUAL,[r0]:i.EQUAL,[l0]:i.GEQUAL,[a0]:i.GREATER,[o0]:i.NOTEQUAL};function rt(P,A){if(A.type===qn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===ii||A.magFilter===Do||A.magFilter===na||A.magFilter===fs||A.minFilter===ii||A.minFilter===Do||A.minFilter===na||A.minFilter===fs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,X[A.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,X[A.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,X[A.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,G[A.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,G[A.minFilter]),A.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,Q[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===dn||A.minFilter!==na&&A.minFilter!==fs||A.type===qn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function pt(P,A){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,A.addEventListener("dispose",b));const K=A.source;let ht=p.get(K);ht===void 0&&(ht={},p.set(K,ht));const Z=N(A);if(Z!==P.__cacheKey){ht[Z]===void 0&&(ht[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),ht[Z].usedTimes++;const wt=ht[P.__cacheKey];wt!==void 0&&(ht[P.__cacheKey].usedTimes--,wt.usedTimes===0&&M(A)),P.__cacheKey=Z,P.__webglTexture=ht[Z].texture}return W}function zt(P,A,W){return Math.floor(Math.floor(P/W)/A)}function Ct(P,A,W,K){const Z=P.updateRanges;if(Z.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,W,K,A.data);else{Z.sort((_t,It)=>_t.start-It.start);let wt=0;for(let _t=1;_t<Z.length;_t++){const It=Z[wt],Jt=Z[_t],Xt=It.start+It.count,At=zt(Jt.start,A.width,4),te=zt(It.start,A.width,4);Jt.start<=Xt+1&&At===te&&zt(Jt.start+Jt.count-1,A.width,4)===At?It.count=Math.max(It.count,Jt.start+Jt.count-It.start):(++wt,Z[wt]=Jt)}Z.length=wt+1;const gt=i.getParameter(i.UNPACK_ROW_LENGTH),Pt=i.getParameter(i.UNPACK_SKIP_PIXELS),Ut=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let _t=0,It=Z.length;_t<It;_t++){const Jt=Z[_t],Xt=Math.floor(Jt.start/4),At=Math.ceil(Jt.count/4),te=Xt%A.width,V=Math.floor(Xt/A.width),yt=At,Tt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,te),i.pixelStorei(i.UNPACK_SKIP_ROWS,V),e.texSubImage2D(i.TEXTURE_2D,0,te,V,yt,Tt,W,K,A.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,gt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ut)}}function $(P,A,W){let K=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(K=i.TEXTURE_3D);const ht=pt(P,A),Z=A.source;e.bindTexture(K,P.__webglTexture,i.TEXTURE0+W);const wt=n.get(Z);if(Z.version!==wt.__version||ht===!0){e.activeTexture(i.TEXTURE0+W);const gt=me.getPrimaries(me.workingColorSpace),Pt=A.colorSpace===gn?null:me.getPrimaries(A.colorSpace),Ut=A.colorSpace===gn||gt===Pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let _t=v(A.image,!1,s.maxTextureSize);_t=Bt(A,_t);const It=r.convert(A.format,A.colorSpace),Jt=r.convert(A.type);let Xt=y(A.internalFormat,It,Jt,A.colorSpace,A.isVideoTexture);rt(K,A);let At;const te=A.mipmaps,V=A.isVideoTexture!==!0,yt=wt.__version===void 0||ht===!0,Tt=Z.dataReady,Ht=T(A,_t);if(A.isDepthTexture)Xt=_(A.format===nr,A.type),yt&&(V?e.texStorage2D(i.TEXTURE_2D,1,Xt,_t.width,_t.height):e.texImage2D(i.TEXTURE_2D,0,Xt,_t.width,_t.height,0,It,Jt,null));else if(A.isDataTexture)if(te.length>0){V&&yt&&e.texStorage2D(i.TEXTURE_2D,Ht,Xt,te[0].width,te[0].height);for(let Mt=0,dt=te.length;Mt<dt;Mt++)At=te[Mt],V?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,At.width,At.height,It,Jt,At.data):e.texImage2D(i.TEXTURE_2D,Mt,Xt,At.width,At.height,0,It,Jt,At.data);A.generateMipmaps=!1}else V?(yt&&e.texStorage2D(i.TEXTURE_2D,Ht,Xt,_t.width,_t.height),Tt&&Ct(A,_t,It,Jt)):e.texImage2D(i.TEXTURE_2D,0,Xt,_t.width,_t.height,0,It,Jt,_t.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){V&&yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,Xt,te[0].width,te[0].height,_t.depth);for(let Mt=0,dt=te.length;Mt<dt;Mt++)if(At=te[Mt],A.format!==Fn)if(It!==null)if(V){if(Tt)if(A.layerUpdates.size>0){const Vt=jh(At.width,At.height,A.format,A.type);for(const re of A.layerUpdates){const we=At.data.subarray(re*Vt/At.data.BYTES_PER_ELEMENT,(re+1)*Vt/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,re,At.width,At.height,1,It,we)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,At.width,At.height,_t.depth,It,At.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Mt,Xt,At.width,At.height,_t.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Tt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,At.width,At.height,_t.depth,It,Jt,At.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Mt,Xt,At.width,At.height,_t.depth,0,It,Jt,At.data)}else{V&&yt&&e.texStorage2D(i.TEXTURE_2D,Ht,Xt,te[0].width,te[0].height);for(let Mt=0,dt=te.length;Mt<dt;Mt++)At=te[Mt],A.format!==Fn?It!==null?V?Tt&&e.compressedTexSubImage2D(i.TEXTURE_2D,Mt,0,0,At.width,At.height,It,At.data):e.compressedTexImage2D(i.TEXTURE_2D,Mt,Xt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,At.width,At.height,It,Jt,At.data):e.texImage2D(i.TEXTURE_2D,Mt,Xt,At.width,At.height,0,It,Jt,At.data)}else if(A.isDataArrayTexture)if(V){if(yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,Xt,_t.width,_t.height,_t.depth),Tt)if(A.layerUpdates.size>0){const Mt=jh(_t.width,_t.height,A.format,A.type);for(const dt of A.layerUpdates){const Vt=_t.data.subarray(dt*Mt/_t.data.BYTES_PER_ELEMENT,(dt+1)*Mt/_t.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,dt,_t.width,_t.height,1,It,Jt,Vt)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,_t.width,_t.height,_t.depth,It,Jt,_t.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Xt,_t.width,_t.height,_t.depth,0,It,Jt,_t.data);else if(A.isData3DTexture)V?(yt&&e.texStorage3D(i.TEXTURE_3D,Ht,Xt,_t.width,_t.height,_t.depth),Tt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,_t.width,_t.height,_t.depth,It,Jt,_t.data)):e.texImage3D(i.TEXTURE_3D,0,Xt,_t.width,_t.height,_t.depth,0,It,Jt,_t.data);else if(A.isFramebufferTexture){if(yt)if(V)e.texStorage2D(i.TEXTURE_2D,Ht,Xt,_t.width,_t.height);else{let Mt=_t.width,dt=_t.height;for(let Vt=0;Vt<Ht;Vt++)e.texImage2D(i.TEXTURE_2D,Vt,Xt,Mt,dt,0,It,Jt,null),Mt>>=1,dt>>=1}}else if(te.length>0){if(V&&yt){const Mt=vt(te[0]);e.texStorage2D(i.TEXTURE_2D,Ht,Xt,Mt.width,Mt.height)}for(let Mt=0,dt=te.length;Mt<dt;Mt++)At=te[Mt],V?Tt&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,It,Jt,At):e.texImage2D(i.TEXTURE_2D,Mt,Xt,It,Jt,At);A.generateMipmaps=!1}else if(V){if(yt){const Mt=vt(_t);e.texStorage2D(i.TEXTURE_2D,Ht,Xt,Mt.width,Mt.height)}Tt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,It,Jt,_t)}else e.texImage2D(i.TEXTURE_2D,0,Xt,It,Jt,_t);g(A)&&f(K),wt.__version=Z.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function nt(P,A,W){if(A.image.length!==6)return;const K=pt(P,A),ht=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+W);const Z=n.get(ht);if(ht.version!==Z.__version||K===!0){e.activeTexture(i.TEXTURE0+W);const wt=me.getPrimaries(me.workingColorSpace),gt=A.colorSpace===gn?null:me.getPrimaries(A.colorSpace),Pt=A.colorSpace===gn||wt===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Ut=A.isCompressedTexture||A.image[0].isCompressedTexture,_t=A.image[0]&&A.image[0].isDataTexture,It=[];for(let dt=0;dt<6;dt++)!Ut&&!_t?It[dt]=v(A.image[dt],!0,s.maxCubemapSize):It[dt]=_t?A.image[dt].image:A.image[dt],It[dt]=Bt(A,It[dt]);const Jt=It[0],Xt=r.convert(A.format,A.colorSpace),At=r.convert(A.type),te=y(A.internalFormat,Xt,At,A.colorSpace),V=A.isVideoTexture!==!0,yt=Z.__version===void 0||K===!0,Tt=ht.dataReady;let Ht=T(A,Jt);rt(i.TEXTURE_CUBE_MAP,A);let Mt;if(Ut){V&&yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ht,te,Jt.width,Jt.height);for(let dt=0;dt<6;dt++){Mt=It[dt].mipmaps;for(let Vt=0;Vt<Mt.length;Vt++){const re=Mt[Vt];A.format!==Fn?Xt!==null?V?Tt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,0,0,re.width,re.height,Xt,re.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,te,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,0,0,re.width,re.height,Xt,At,re.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,te,re.width,re.height,0,Xt,At,re.data)}}}else{if(Mt=A.mipmaps,V&&yt){Mt.length>0&&Ht++;const dt=vt(It[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ht,te,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(_t){V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,It[dt].width,It[dt].height,Xt,At,It[dt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,te,It[dt].width,It[dt].height,0,Xt,At,It[dt].data);for(let Vt=0;Vt<Mt.length;Vt++){const we=Mt[Vt].image[dt].image;V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,0,0,we.width,we.height,Xt,At,we.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,te,we.width,we.height,0,Xt,At,we.data)}}else{V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Xt,At,It[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,te,Xt,At,It[dt]);for(let Vt=0;Vt<Mt.length;Vt++){const re=Mt[Vt];V?Tt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,0,0,Xt,At,re.image[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,te,Xt,At,re.image[dt])}}}g(A)&&f(i.TEXTURE_CUBE_MAP),Z.__version=ht.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function mt(P,A,W,K,ht,Z){const wt=r.convert(W.format,W.colorSpace),gt=r.convert(W.type),Pt=y(W.internalFormat,wt,gt,W.colorSpace),Ut=n.get(A),_t=n.get(W);if(_t.__renderTarget=A,!Ut.__hasExternalTextures){const It=Math.max(1,A.width>>Z),Jt=Math.max(1,A.height>>Z);ht===i.TEXTURE_3D||ht===i.TEXTURE_2D_ARRAY?e.texImage3D(ht,Z,Pt,It,Jt,A.depth,0,wt,gt,null):e.texImage2D(ht,Z,Pt,It,Jt,0,wt,gt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),st(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,ht,_t.__webglTexture,0,at(A)):(ht===i.TEXTURE_2D||ht>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,ht,_t.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function xt(P,A,W){if(i.bindRenderbuffer(i.RENDERBUFFER,P),A.depthBuffer){const K=A.depthTexture,ht=K&&K.isDepthTexture?K.type:null,Z=_(A.stencilBuffer,ht),wt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=at(A);st(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,Z,A.width,A.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,Z,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Z,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,P)}else{const K=A.textures;for(let ht=0;ht<K.length;ht++){const Z=K[ht],wt=r.convert(Z.format,Z.colorSpace),gt=r.convert(Z.type),Pt=y(Z.internalFormat,wt,gt,Z.colorSpace),Ut=at(A);W&&st(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,Pt,A.width,A.height):st(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ut,Pt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Pt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(P,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(A.depthTexture);K.__renderTarget=A,(!K.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),O(A.depthTexture,0);const ht=K.__webglTexture,Z=at(A);if(A.depthTexture.format===kr)st(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ht,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ht,0);else if(A.depthTexture.format===nr)st(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ht,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ht,0);else throw new Error("Unknown depthTexture format")}function Wt(P){const A=n.get(P),W=P.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==P.depthTexture){const K=P.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),K){const ht=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,K.removeEventListener("dispose",ht)};K.addEventListener("dispose",ht),A.__depthDisposeCallback=ht}A.__boundDepthTexture=K}if(P.depthTexture&&!A.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const K=P.texture.mipmaps;K&&K.length>0?bt(A.__webglFramebuffer[0],P):bt(A.__webglFramebuffer,P)}else if(W){A.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[K]),A.__webglDepthbuffer[K]===void 0)A.__webglDepthbuffer[K]=i.createRenderbuffer(),xt(A.__webglDepthbuffer[K],P,!1);else{const ht=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=A.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,Z)}}else{const K=P.texture.mipmaps;if(K&&K.length>0?e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),xt(A.__webglDepthbuffer,P,!1);else{const ht=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,Z)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Qt(P,A,W){const K=n.get(P);A!==void 0&&mt(K.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Wt(P)}function z(P){const A=P.texture,W=n.get(P),K=n.get(A);P.addEventListener("dispose",w);const ht=P.textures,Z=P.isWebGLCubeRenderTarget===!0,wt=ht.length>1;if(wt||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=A.version,a.memory.textures++),Z){W.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer[gt]=[];for(let Pt=0;Pt<A.mipmaps.length;Pt++)W.__webglFramebuffer[gt][Pt]=i.createFramebuffer()}else W.__webglFramebuffer[gt]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer=[];for(let gt=0;gt<A.mipmaps.length;gt++)W.__webglFramebuffer[gt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(wt)for(let gt=0,Pt=ht.length;gt<Pt;gt++){const Ut=n.get(ht[gt]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=i.createTexture(),a.memory.textures++)}if(P.samples>0&&st(P)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let gt=0;gt<ht.length;gt++){const Pt=ht[gt];W.__webglColorRenderbuffer[gt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[gt]);const Ut=r.convert(Pt.format,Pt.colorSpace),_t=r.convert(Pt.type),It=y(Pt.internalFormat,Ut,_t,Pt.colorSpace,P.isXRRenderTarget===!0),Jt=at(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Jt,It,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,W.__webglColorRenderbuffer[gt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),xt(W.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),rt(i.TEXTURE_CUBE_MAP,A);for(let gt=0;gt<6;gt++)if(A.mipmaps&&A.mipmaps.length>0)for(let Pt=0;Pt<A.mipmaps.length;Pt++)mt(W.__webglFramebuffer[gt][Pt],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Pt);else mt(W.__webglFramebuffer[gt],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);g(A)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let gt=0,Pt=ht.length;gt<Pt;gt++){const Ut=ht[gt],_t=n.get(Ut);let It=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(It=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(It,_t.__webglTexture),rt(It,Ut),mt(W.__webglFramebuffer,P,Ut,i.COLOR_ATTACHMENT0+gt,It,0),g(Ut)&&f(It)}e.unbindTexture()}else{let gt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(gt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,K.__webglTexture),rt(gt,A),A.mipmaps&&A.mipmaps.length>0)for(let Pt=0;Pt<A.mipmaps.length;Pt++)mt(W.__webglFramebuffer[Pt],P,A,i.COLOR_ATTACHMENT0,gt,Pt);else mt(W.__webglFramebuffer,P,A,i.COLOR_ATTACHMENT0,gt,0);g(A)&&f(gt),e.unbindTexture()}P.depthBuffer&&Wt(P)}function lt(P){const A=P.textures;for(let W=0,K=A.length;W<K;W++){const ht=A[W];if(g(ht)){const Z=x(P),wt=n.get(ht).__webglTexture;e.bindTexture(Z,wt),f(Z),e.unbindTexture()}}}const ct=[],J=[];function j(P){if(P.samples>0){if(st(P)===!1){const A=P.textures,W=P.width,K=P.height;let ht=i.COLOR_BUFFER_BIT;const Z=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(P),gt=A.length>1;if(gt)for(let Ut=0;Ut<A.length;Ut++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer);const Pt=P.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let Ut=0;Ut<A.length;Ut++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ht|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ht|=i.STENCIL_BUFFER_BIT)),gt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[Ut]);const _t=n.get(A[Ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,_t,0)}i.blitFramebuffer(0,0,W,K,0,0,W,K,ht,i.NEAREST),l===!0&&(ct.length=0,J.length=0,ct.push(i.COLOR_ATTACHMENT0+Ut),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ct.push(Z),J.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,J)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),gt)for(let Ut=0;Ut<A.length;Ut++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,wt.__webglColorRenderbuffer[Ut]);const _t=n.get(A[Ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,_t,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const A=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function at(P){return Math.min(s.maxSamples,P.samples)}function st(P){const A=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ut(P){const A=a.render.frame;h.get(P)!==A&&(h.set(P,A),P.update())}function Bt(P,A){const W=P.colorSpace,K=P.format,ht=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==ir&&W!==gn&&(me.getTransfer(W)===xe?(K!==Fn||ht!==ci)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),A}function vt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=D,this.setTexture2D=O,this.setTexture2DArray=F,this.setTexture3D=H,this.setTextureCube=B,this.rebindTextures=Qt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=j,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=st}function bx(i,t){function e(n,s=gn){let r;const a=me.getTransfer(s);if(n===ci)return i.UNSIGNED_BYTE;if(n===Uc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Nc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Sd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===bd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===yd)return i.BYTE;if(n===Md)return i.SHORT;if(n===Br)return i.UNSIGNED_SHORT;if(n===Dc)return i.INT;if(n===vs)return i.UNSIGNED_INT;if(n===qn)return i.FLOAT;if(n===hi)return i.HALF_FLOAT;if(n===wd)return i.ALPHA;if(n===Td)return i.RGB;if(n===Fn)return i.RGBA;if(n===kr)return i.DEPTH_COMPONENT;if(n===nr)return i.DEPTH_STENCIL;if(n===xo)return i.RED;if(n===Fc)return i.RED_INTEGER;if(n===Ed)return i.RG;if(n===Oc)return i.RG_INTEGER;if(n===zc)return i.RGBA_INTEGER;if(n===qa||n===Ya||n===$a||n===Za)if(a===xe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ul||n===Nl||n===Fl||n===Ol)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ul)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ol)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===zl||n===Bl||n===kl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===zl||n===Bl)return a===xe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===kl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Hl||n===Gl||n===Vl||n===Wl||n===Xl||n===ql||n===Yl||n===$l||n===Zl||n===Jl||n===Kl||n===jl||n===Ql||n===tc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Hl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Gl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ql)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Yl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$l)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Zl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Jl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Kl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===jl)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ql)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tc)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ec||n===nc||n===ic)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ec)return a===xe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sc||n===rc||n===ac||n===oc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ac)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===er?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const wx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Tx=`
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

}`;class Ex{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new zd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new un({vertexShader:wx,fragmentShader:Tx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ft(new de(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ax extends lr{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,p=null,u=null,m=null;const v=typeof XRWebGLBinding<"u",g=new Ex,f={},x=e.getContextAttributes();let y=null,_=null;const T=[],b=[],w=new ft;let E=null;const M=new rn;M.viewport=new Me;const S=new rn;S.viewport=new Me;const R=[M,S],D=new qp;let L=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let nt=T[$];return nt===void 0&&(nt=new tl,T[$]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function($){let nt=T[$];return nt===void 0&&(nt=new tl,T[$]=nt),nt.getGripSpace()},this.getHand=function($){let nt=T[$];return nt===void 0&&(nt=new tl,T[$]=nt),nt.getHandSpace()};function O($){const nt=b.indexOf($.inputSource);if(nt===-1)return;const mt=T[nt];mt!==void 0&&(mt.update($.inputSource,$.frame,c||a),mt.dispatchEvent({type:$.type,data:$.inputSource}))}function F(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",H);for(let $=0;$<T.length;$++){const nt=b[$];nt!==null&&(b[$]=null,T[$].disconnect(nt))}L=null,N=null,g.reset();for(const $ in f)delete f[$];t.setRenderTarget(y),u=null,p=null,d=null,s=null,_=null,Ct.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(y=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",F),s.addEventListener("inputsourceschange",H),x.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(w),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let mt=null,xt=null,bt=null;x.depth&&(bt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,mt=x.stencil?nr:kr,xt=x.stencil?er:vs);const Wt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};d=this.getBinding(),p=d.createProjectionLayer(Wt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),_=new En(p.textureWidth,p.textureHeight,{format:Fn,type:ci,depthTexture:new qc(p.textureWidth,p.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,mt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const mt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,mt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),_=new En(u.framebufferWidth,u.framebufferHeight,{format:Fn,type:ci,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ct.setContext(s),Ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function H($){for(let nt=0;nt<$.removed.length;nt++){const mt=$.removed[nt],xt=b.indexOf(mt);xt>=0&&(b[xt]=null,T[xt].disconnect(mt))}for(let nt=0;nt<$.added.length;nt++){const mt=$.added[nt];let xt=b.indexOf(mt);if(xt===-1){for(let Wt=0;Wt<T.length;Wt++)if(Wt>=b.length){b.push(mt),xt=Wt;break}else if(b[Wt]===null){b[Wt]=mt,xt=Wt;break}if(xt===-1)break}const bt=T[xt];bt&&bt.connect(mt)}}const B=new I,X=new I;function G($,nt,mt){B.setFromMatrixPosition(nt.matrixWorld),X.setFromMatrixPosition(mt.matrixWorld);const xt=B.distanceTo(X),bt=nt.projectionMatrix.elements,Wt=mt.projectionMatrix.elements,Qt=bt[14]/(bt[10]-1),z=bt[14]/(bt[10]+1),lt=(bt[9]+1)/bt[5],ct=(bt[9]-1)/bt[5],J=(bt[8]-1)/bt[0],j=(Wt[8]+1)/Wt[0],at=Qt*J,st=Qt*j,ut=xt/(-J+j),Bt=ut*-J;if(nt.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Bt),$.translateZ(ut),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),bt[10]===-1)$.projectionMatrix.copy(nt.projectionMatrix),$.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const vt=Qt+ut,P=z+ut,A=at-Bt,W=st+(xt-Bt),K=lt*z/P*vt,ht=ct*z/P*vt;$.projectionMatrix.makePerspective(A,W,K,ht,vt,P),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Q($,nt){nt===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(nt.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let nt=$.near,mt=$.far;g.texture!==null&&(g.depthNear>0&&(nt=g.depthNear),g.depthFar>0&&(mt=g.depthFar)),D.near=S.near=M.near=nt,D.far=S.far=M.far=mt,(L!==D.near||N!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),L=D.near,N=D.far),D.layers.mask=$.layers.mask|6,M.layers.mask=D.layers.mask&3,S.layers.mask=D.layers.mask&5;const xt=$.parent,bt=D.cameras;Q(D,xt);for(let Wt=0;Wt<bt.length;Wt++)Q(bt[Wt],xt);bt.length===2?G(D,M,S):D.projectionMatrix.copy(M.projectionMatrix),rt($,D,xt)};function rt($,nt,mt){mt===null?$.matrix.copy(nt.matrixWorld):($.matrix.copy(mt.matrixWorld),$.matrix.invert(),$.matrix.multiply(nt.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(nt.projectionMatrix),$.projectionMatrixInverse.copy(nt.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Hr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(p===null&&u===null))return l},this.setFoveation=function($){l=$,p!==null&&(p.fixedFoveation=$),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function($){return f[$]};let pt=null;function zt($,nt){if(h=nt.getViewerPose(c||a),m=nt,h!==null){const mt=h.views;u!==null&&(t.setRenderTargetFramebuffer(_,u.framebuffer),t.setRenderTarget(_));let xt=!1;mt.length!==D.cameras.length&&(D.cameras.length=0,xt=!0);for(let z=0;z<mt.length;z++){const lt=mt[z];let ct=null;if(u!==null)ct=u.getViewport(lt);else{const j=d.getViewSubImage(p,lt);ct=j.viewport,z===0&&(t.setRenderTargetTextures(_,j.colorTexture,j.depthStencilTexture),t.setRenderTarget(_))}let J=R[z];J===void 0&&(J=new rn,J.layers.enable(z),J.viewport=new Me,R[z]=J),J.matrix.fromArray(lt.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(lt.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(ct.x,ct.y,ct.width,ct.height),z===0&&(D.matrix.copy(J.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),xt===!0&&D.cameras.push(J)}const bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const z=d.getDepthInformation(mt[0]);z&&z.isValid&&z.texture&&g.init(z,s.renderState)}if(bt&&bt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let z=0;z<mt.length;z++){const lt=mt[z].camera;if(lt){let ct=f[lt];ct||(ct=new zd,f[lt]=ct);const J=d.getCameraImage(lt);ct.sourceTexture=J}}}}for(let mt=0;mt<T.length;mt++){const xt=b[mt],bt=T[mt];xt!==null&&bt!==void 0&&bt.update(xt,nt,c||a)}pt&&pt($,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),m=null}const Ct=new Jd;Ct.setAnimationLoop(zt),this.setAnimationLoop=function($){pt=$},this.dispose=function(){}}}const is=new xn,Rx=new $t;function Cx(i,t){function e(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,Dd(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,x,y,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(g,f):f.isMeshToonMaterial?(r(g,f),d(g,f)):f.isMeshPhongMaterial?(r(g,f),h(g,f)):f.isMeshStandardMaterial?(r(g,f),p(g,f),f.isMeshPhysicalMaterial&&u(g,f,_)):f.isMeshMatcapMaterial?(r(g,f),m(g,f)):f.isMeshDepthMaterial?r(g,f):f.isMeshDistanceMaterial?(r(g,f),v(g,f)):f.isMeshNormalMaterial?r(g,f):f.isLineBasicMaterial?(a(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,x,y):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,e(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===an&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,e(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===an&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,e(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,e(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const x=t.get(f),y=x.envMap,_=x.envMapRotation;y&&(g.envMap.value=y,is.copy(_),is.x*=-1,is.y*=-1,is.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),g.envMapRotation.value.setFromMatrix4(Rx.makeRotationFromEuler(is)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,g.aoMapTransform))}function a(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,x,y){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*x,g.scale.value=y*.5,f.map&&(g.map.value=f.map,e(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function d(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function p(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function u(g,f,x){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===an&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function v(g,f){const x=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Px(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const _=y.program;n.uniformBlockBinding(x,_)}function c(x,y){let _=s[x.id];_===void 0&&(m(x),_=h(x),s[x.id]=_,x.addEventListener("dispose",g));const T=y.program;n.updateUBOMapping(x,T);const b=t.render.frame;r[x.id]!==b&&(p(x),r[x.id]=b)}function h(x){const y=d();x.__bindingPointIndex=y;const _=i.createBuffer(),T=x.__size,b=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,T,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const y=s[x.id],_=x.uniforms,T=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let b=0,w=_.length;b<w;b++){const E=Array.isArray(_[b])?_[b]:[_[b]];for(let M=0,S=E.length;M<S;M++){const R=E[M];if(u(R,b,M,T)===!0){const D=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let N=0;for(let O=0;O<L.length;O++){const F=L[O],H=v(F);typeof F=="number"||typeof F=="boolean"?(R.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,D+N,R.__data)):F.isMatrix3?(R.__data[0]=F.elements[0],R.__data[1]=F.elements[1],R.__data[2]=F.elements[2],R.__data[3]=0,R.__data[4]=F.elements[3],R.__data[5]=F.elements[4],R.__data[6]=F.elements[5],R.__data[7]=0,R.__data[8]=F.elements[6],R.__data[9]=F.elements[7],R.__data[10]=F.elements[8],R.__data[11]=0):(F.toArray(R.__data,N),N+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,y,_,T){const b=x.value,w=y+"_"+_;if(T[w]===void 0)return typeof b=="number"||typeof b=="boolean"?T[w]=b:T[w]=b.clone(),!0;{const E=T[w];if(typeof b=="number"||typeof b=="boolean"){if(E!==b)return T[w]=b,!0}else if(E.equals(b)===!1)return E.copy(b),!0}return!1}function m(x){const y=x.uniforms;let _=0;const T=16;for(let w=0,E=y.length;w<E;w++){const M=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,R=M.length;S<R;S++){const D=M[S],L=Array.isArray(D.value)?D.value:[D.value];for(let N=0,O=L.length;N<O;N++){const F=L[N],H=v(F),B=_%T,X=B%H.boundary,G=B+X;_+=X,G!==0&&T-G<H.storage&&(_+=T-G),D.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=_,_+=H.storage}}}const b=_%T;return b>0&&(_+=T-b),x.__size=_,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const _=a.indexOf(y.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function f(){for(const x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class Ix{constructor(t={}){const{canvas:e=E0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,f=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let T=!1;this._outputColorSpace=Ye;let b=0,w=0,E=null,M=-1,S=null;const R=new Me,D=new Me;let L=null;const N=new qt(0);let O=0,F=e.width,H=e.height,B=1,X=null,G=null;const Q=new Me(0,0,F,H),rt=new Me(0,0,F,H);let pt=!1;const zt=new Xc;let Ct=!1,$=!1;const nt=new $t,mt=new I,xt=new Me,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Wt=!1;function Qt(){return E===null?B:1}let z=n;function lt(C,q){return e.getContext(C,q)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Pc}`),e.addEventListener("webglcontextlost",Tt,!1),e.addEventListener("webglcontextrestored",Ht,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),z===null){const q="webgl2";if(z=lt(q,C),z===null)throw lt(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let ct,J,j,at,st,ut,Bt,vt,P,A,W,K,ht,Z,wt,gt,Pt,Ut,_t,It,Jt,Xt,At,te;function V(){ct=new Hg(z),ct.init(),Xt=new bx(z,ct),J=new Ug(z,ct,t,Xt),j=new Mx(z,ct),J.reversedDepthBuffer&&p&&j.buffers.depth.setReversed(!0),at=new Wg(z),st=new lx,ut=new Sx(z,ct,j,st,J,Xt,at),Bt=new Fg(_),vt=new kg(_),P=new Jp(z),At=new Lg(z,P),A=new Gg(z,P,at,At),W=new qg(z,A,P,at),_t=new Xg(z,J,ut),gt=new Ng(st),K=new ox(_,Bt,vt,ct,J,At,gt),ht=new Cx(_,st),Z=new hx,wt=new gx(ct),Ut=new Ig(_,Bt,vt,j,W,u,l),Pt=new _x(_,W,J),te=new Px(z,at,J,j),It=new Dg(z,ct,at),Jt=new Vg(z,ct,at),at.programs=K.programs,_.capabilities=J,_.extensions=ct,_.properties=st,_.renderLists=Z,_.shadowMap=Pt,_.state=j,_.info=at}V();const yt=new Ax(_,z);this.xr=yt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const C=ct.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ct.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(C){C!==void 0&&(B=C,this.setSize(F,H,!1))},this.getSize=function(C){return C.set(F,H)},this.setSize=function(C,q,tt=!0){if(yt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=C,H=q,e.width=Math.floor(C*B),e.height=Math.floor(q*B),tt===!0&&(e.style.width=C+"px",e.style.height=q+"px"),this.setViewport(0,0,C,q)},this.getDrawingBufferSize=function(C){return C.set(F*B,H*B).floor()},this.setDrawingBufferSize=function(C,q,tt){F=C,H=q,B=tt,e.width=Math.floor(C*tt),e.height=Math.floor(q*tt),this.setViewport(0,0,C,q)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(Q)},this.setViewport=function(C,q,tt,it){C.isVector4?Q.set(C.x,C.y,C.z,C.w):Q.set(C,q,tt,it),j.viewport(R.copy(Q).multiplyScalar(B).round())},this.getScissor=function(C){return C.copy(rt)},this.setScissor=function(C,q,tt,it){C.isVector4?rt.set(C.x,C.y,C.z,C.w):rt.set(C,q,tt,it),j.scissor(D.copy(rt).multiplyScalar(B).round())},this.getScissorTest=function(){return pt},this.setScissorTest=function(C){j.setScissorTest(pt=C)},this.setOpaqueSort=function(C){X=C},this.setTransparentSort=function(C){G=C},this.getClearColor=function(C){return C.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(C=!0,q=!0,tt=!0){let it=0;if(C){let Y=!1;if(E!==null){const St=E.texture.format;Y=St===zc||St===Oc||St===Fc}if(Y){const St=E.texture.type,Nt=St===ci||St===vs||St===Br||St===er||St===Uc||St===Nc,Gt=Ut.getClearColor(),kt=Ut.getClearAlpha(),jt=Gt.r,ee=Gt.g,Yt=Gt.b;Nt?(m[0]=jt,m[1]=ee,m[2]=Yt,m[3]=kt,z.clearBufferuiv(z.COLOR,0,m)):(v[0]=jt,v[1]=ee,v[2]=Yt,v[3]=kt,z.clearBufferiv(z.COLOR,0,v))}else it|=z.COLOR_BUFFER_BIT}q&&(it|=z.DEPTH_BUFFER_BIT),tt&&(it|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(it)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Tt,!1),e.removeEventListener("webglcontextrestored",Ht,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),Ut.dispose(),Z.dispose(),wt.dispose(),st.dispose(),Bt.dispose(),vt.dispose(),W.dispose(),At.dispose(),te.dispose(),K.dispose(),yt.dispose(),yt.removeEventListener("sessionstart",Jn),yt.removeEventListener("sessionend",rh),Ji.stop()};function Tt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Ht(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const C=at.autoReset,q=Pt.enabled,tt=Pt.autoUpdate,it=Pt.needsUpdate,Y=Pt.type;V(),at.autoReset=C,Pt.enabled=q,Pt.autoUpdate=tt,Pt.needsUpdate=it,Pt.type=Y}function Mt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function dt(C){const q=C.target;q.removeEventListener("dispose",dt),Vt(q)}function Vt(C){re(C),st.remove(C)}function re(C){const q=st.get(C).programs;q!==void 0&&(q.forEach(function(tt){K.releaseProgram(tt)}),C.isShaderMaterial&&K.releaseShaderCache(C))}this.renderBufferDirect=function(C,q,tt,it,Y,St){q===null&&(q=bt);const Nt=Y.isMesh&&Y.matrixWorld.determinant()<0,Gt=Cf(C,q,tt,it,Y);j.setMaterial(it,Nt);let kt=tt.index,jt=1;if(it.wireframe===!0){if(kt=A.getWireframeAttribute(tt),kt===void 0)return;jt=2}const ee=tt.drawRange,Yt=tt.attributes.position;let ue=ee.start*jt,ye=(ee.start+ee.count)*jt;St!==null&&(ue=Math.max(ue,St.start*jt),ye=Math.min(ye,(St.start+St.count)*jt)),kt!==null?(ue=Math.max(ue,0),ye=Math.min(ye,kt.count)):Yt!=null&&(ue=Math.max(ue,0),ye=Math.min(ye,Yt.count));const Ue=ye-ue;if(Ue<0||Ue===1/0)return;At.setup(Y,it,Gt,tt,kt);let Te,Se=It;if(kt!==null&&(Te=P.get(kt),Se=Jt,Se.setIndex(Te)),Y.isMesh)it.wireframe===!0?(j.setLineWidth(it.wireframeLinewidth*Qt()),Se.setMode(z.LINES)):Se.setMode(z.TRIANGLES);else if(Y.isLine){let Zt=it.linewidth;Zt===void 0&&(Zt=1),j.setLineWidth(Zt*Qt()),Y.isLineSegments?Se.setMode(z.LINES):Y.isLineLoop?Se.setMode(z.LINE_LOOP):Se.setMode(z.LINE_STRIP)}else Y.isPoints?Se.setMode(z.POINTS):Y.isSprite&&Se.setMode(z.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Vr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(ct.get("WEBGL_multi_draw"))Se.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Zt=Y._multiDrawStarts,Pe=Y._multiDrawCounts,ge=Y._multiDrawCount,_n=kt?P.get(kt).bytesPerElement:1,Ss=st.get(it).currentProgram.getUniforms();for(let yn=0;yn<ge;yn++)Ss.setValue(z,"_gl_DrawID",yn),Se.render(Zt[yn]/_n,Pe[yn])}else if(Y.isInstancedMesh)Se.renderInstances(ue,Ue,Y.count);else if(tt.isInstancedBufferGeometry){const Zt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,Pe=Math.min(tt.instanceCount,Zt);Se.renderInstances(ue,Ue,Pe)}else Se.render(ue,Ue)};function we(C,q,tt){C.transparent===!0&&C.side===Be&&C.forceSinglePass===!1?(C.side=an,C.needsUpdate=!0,ea(C,q,tt),C.side=qi,C.needsUpdate=!0,ea(C,q,tt),C.side=Be):ea(C,q,tt)}this.compile=function(C,q,tt=null){tt===null&&(tt=C),f=wt.get(tt),f.init(q),y.push(f),tt.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(f.pushLight(Y),Y.castShadow&&f.pushShadow(Y))}),C!==tt&&C.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(f.pushLight(Y),Y.castShadow&&f.pushShadow(Y))}),f.setupLights();const it=new Set;return C.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const St=Y.material;if(St)if(Array.isArray(St))for(let Nt=0;Nt<St.length;Nt++){const Gt=St[Nt];we(Gt,tt,Y),it.add(Gt)}else we(St,tt,Y),it.add(St)}),f=y.pop(),it},this.compileAsync=function(C,q,tt=null){const it=this.compile(C,q,tt);return new Promise(Y=>{function St(){if(it.forEach(function(Nt){st.get(Nt).currentProgram.isReady()&&it.delete(Nt)}),it.size===0){Y(C);return}setTimeout(St,10)}ct.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let ve=null;function pi(C){ve&&ve(C)}function Jn(){Ji.stop()}function rh(){Ji.start()}const Ji=new Jd;Ji.setAnimationLoop(pi),typeof self<"u"&&Ji.setContext(self),this.setAnimationLoop=function(C){ve=C,yt.setAnimationLoop(C),C===null?Ji.stop():Ji.start()},yt.addEventListener("sessionstart",Jn),yt.addEventListener("sessionend",rh),this.render=function(C,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),yt.enabled===!0&&yt.isPresenting===!0&&(yt.cameraAutoUpdate===!0&&yt.updateCamera(q),q=yt.getCamera()),C.isScene===!0&&C.onBeforeRender(_,C,q,E),f=wt.get(C,y.length),f.init(q),y.push(f),nt.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),zt.setFromProjectionMatrix(nt,si,q.reversedDepth),$=this.localClippingEnabled,Ct=gt.init(this.clippingPlanes,$),g=Z.get(C,x.length),g.init(),x.push(g),yt.enabled===!0&&yt.isPresenting===!0){const St=_.xr.getDepthSensingMesh();St!==null&&Io(St,q,-1/0,_.sortObjects)}Io(C,q,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(X,G),Wt=yt.enabled===!1||yt.isPresenting===!1||yt.hasDepthSensing()===!1,Wt&&Ut.addToRenderList(g,C),this.info.render.frame++,Ct===!0&&gt.beginShadows();const tt=f.state.shadowsArray;Pt.render(tt,C,q),Ct===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();const it=g.opaque,Y=g.transmissive;if(f.setupLights(),q.isArrayCamera){const St=q.cameras;if(Y.length>0)for(let Nt=0,Gt=St.length;Nt<Gt;Nt++){const kt=St[Nt];oh(it,Y,C,kt)}Wt&&Ut.render(C);for(let Nt=0,Gt=St.length;Nt<Gt;Nt++){const kt=St[Nt];ah(g,C,kt,kt.viewport)}}else Y.length>0&&oh(it,Y,C,q),Wt&&Ut.render(C),ah(g,C,q);E!==null&&w===0&&(ut.updateMultisampleRenderTarget(E),ut.updateRenderTargetMipmap(E)),C.isScene===!0&&C.onAfterRender(_,C,q),At.resetDefaultState(),M=-1,S=null,y.pop(),y.length>0?(f=y[y.length-1],Ct===!0&&gt.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function Io(C,q,tt,it){if(C.visible===!1)return;if(C.layers.test(q.layers)){if(C.isGroup)tt=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(q);else if(C.isLight)f.pushLight(C),C.castShadow&&f.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||zt.intersectsSprite(C)){it&&xt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(nt);const Nt=W.update(C),Gt=C.material;Gt.visible&&g.push(C,Nt,Gt,tt,xt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||zt.intersectsObject(C))){const Nt=W.update(C),Gt=C.material;if(it&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),xt.copy(C.boundingSphere.center)):(Nt.boundingSphere===null&&Nt.computeBoundingSphere(),xt.copy(Nt.boundingSphere.center)),xt.applyMatrix4(C.matrixWorld).applyMatrix4(nt)),Array.isArray(Gt)){const kt=Nt.groups;for(let jt=0,ee=kt.length;jt<ee;jt++){const Yt=kt[jt],ue=Gt[Yt.materialIndex];ue&&ue.visible&&g.push(C,Nt,ue,tt,xt.z,Yt)}}else Gt.visible&&g.push(C,Nt,Gt,tt,xt.z,null)}}const St=C.children;for(let Nt=0,Gt=St.length;Nt<Gt;Nt++)Io(St[Nt],q,tt,it)}function ah(C,q,tt,it){const Y=C.opaque,St=C.transmissive,Nt=C.transparent;f.setupLightsView(tt),Ct===!0&&gt.setGlobalState(_.clippingPlanes,tt),it&&j.viewport(R.copy(it)),Y.length>0&&ta(Y,q,tt),St.length>0&&ta(St,q,tt),Nt.length>0&&ta(Nt,q,tt),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function oh(C,q,tt,it){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[it.id]===void 0&&(f.state.transmissionRenderTarget[it.id]=new En(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float")?hi:ci,minFilter:fs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));const St=f.state.transmissionRenderTarget[it.id],Nt=it.viewport||R;St.setSize(Nt.z*_.transmissionResolutionScale,Nt.w*_.transmissionResolutionScale);const Gt=_.getRenderTarget(),kt=_.getActiveCubeFace(),jt=_.getActiveMipmapLevel();_.setRenderTarget(St),_.getClearColor(N),O=_.getClearAlpha(),O<1&&_.setClearColor(16777215,.5),_.clear(),Wt&&Ut.render(tt);const ee=_.toneMapping;_.toneMapping=Vi;const Yt=it.viewport;if(it.viewport!==void 0&&(it.viewport=void 0),f.setupLightsView(it),Ct===!0&&gt.setGlobalState(_.clippingPlanes,it),ta(C,tt,it),ut.updateMultisampleRenderTarget(St),ut.updateRenderTargetMipmap(St),ct.has("WEBGL_multisampled_render_to_texture")===!1){let ue=!1;for(let ye=0,Ue=q.length;ye<Ue;ye++){const Te=q[ye],Se=Te.object,Zt=Te.geometry,Pe=Te.material,ge=Te.group;if(Pe.side===Be&&Se.layers.test(it.layers)){const _n=Pe.side;Pe.side=an,Pe.needsUpdate=!0,lh(Se,tt,it,Zt,Pe,ge),Pe.side=_n,Pe.needsUpdate=!0,ue=!0}}ue===!0&&(ut.updateMultisampleRenderTarget(St),ut.updateRenderTargetMipmap(St))}_.setRenderTarget(Gt,kt,jt),_.setClearColor(N,O),Yt!==void 0&&(it.viewport=Yt),_.toneMapping=ee}function ta(C,q,tt){const it=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,St=C.length;Y<St;Y++){const Nt=C[Y],Gt=Nt.object,kt=Nt.geometry,jt=Nt.group;let ee=Nt.material;ee.allowOverride===!0&&it!==null&&(ee=it),Gt.layers.test(tt.layers)&&lh(Gt,q,tt,kt,ee,jt)}}function lh(C,q,tt,it,Y,St){C.onBeforeRender(_,q,tt,it,Y,St),C.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),Y.onBeforeRender(_,q,tt,it,C,St),Y.transparent===!0&&Y.side===Be&&Y.forceSinglePass===!1?(Y.side=an,Y.needsUpdate=!0,_.renderBufferDirect(tt,q,it,Y,C,St),Y.side=qi,Y.needsUpdate=!0,_.renderBufferDirect(tt,q,it,Y,C,St),Y.side=Be):_.renderBufferDirect(tt,q,it,Y,C,St),C.onAfterRender(_,q,tt,it,Y,St)}function ea(C,q,tt){q.isScene!==!0&&(q=bt);const it=st.get(C),Y=f.state.lights,St=f.state.shadowsArray,Nt=Y.state.version,Gt=K.getParameters(C,Y.state,St,q,tt),kt=K.getProgramCacheKey(Gt);let jt=it.programs;it.environment=C.isMeshStandardMaterial?q.environment:null,it.fog=q.fog,it.envMap=(C.isMeshStandardMaterial?vt:Bt).get(C.envMap||it.environment),it.envMapRotation=it.environment!==null&&C.envMap===null?q.environmentRotation:C.envMapRotation,jt===void 0&&(C.addEventListener("dispose",dt),jt=new Map,it.programs=jt);let ee=jt.get(kt);if(ee!==void 0){if(it.currentProgram===ee&&it.lightsStateVersion===Nt)return hh(C,Gt),ee}else Gt.uniforms=K.getUniforms(C),C.onBeforeCompile(Gt,_),ee=K.acquireProgram(Gt,kt),jt.set(kt,ee),it.uniforms=Gt.uniforms;const Yt=it.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Yt.clippingPlanes=gt.uniform),hh(C,Gt),it.needsLights=If(C),it.lightsStateVersion=Nt,it.needsLights&&(Yt.ambientLightColor.value=Y.state.ambient,Yt.lightProbe.value=Y.state.probe,Yt.directionalLights.value=Y.state.directional,Yt.directionalLightShadows.value=Y.state.directionalShadow,Yt.spotLights.value=Y.state.spot,Yt.spotLightShadows.value=Y.state.spotShadow,Yt.rectAreaLights.value=Y.state.rectArea,Yt.ltc_1.value=Y.state.rectAreaLTC1,Yt.ltc_2.value=Y.state.rectAreaLTC2,Yt.pointLights.value=Y.state.point,Yt.pointLightShadows.value=Y.state.pointShadow,Yt.hemisphereLights.value=Y.state.hemi,Yt.directionalShadowMap.value=Y.state.directionalShadowMap,Yt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Yt.spotShadowMap.value=Y.state.spotShadowMap,Yt.spotLightMatrix.value=Y.state.spotLightMatrix,Yt.spotLightMap.value=Y.state.spotLightMap,Yt.pointShadowMap.value=Y.state.pointShadowMap,Yt.pointShadowMatrix.value=Y.state.pointShadowMatrix),it.currentProgram=ee,it.uniformsList=null,ee}function ch(C){if(C.uniformsList===null){const q=C.currentProgram.getUniforms();C.uniformsList=Ja.seqWithValue(q.seq,C.uniforms)}return C.uniformsList}function hh(C,q){const tt=st.get(C);tt.outputColorSpace=q.outputColorSpace,tt.batching=q.batching,tt.batchingColor=q.batchingColor,tt.instancing=q.instancing,tt.instancingColor=q.instancingColor,tt.instancingMorph=q.instancingMorph,tt.skinning=q.skinning,tt.morphTargets=q.morphTargets,tt.morphNormals=q.morphNormals,tt.morphColors=q.morphColors,tt.morphTargetsCount=q.morphTargetsCount,tt.numClippingPlanes=q.numClippingPlanes,tt.numIntersection=q.numClipIntersection,tt.vertexAlphas=q.vertexAlphas,tt.vertexTangents=q.vertexTangents,tt.toneMapping=q.toneMapping}function Cf(C,q,tt,it,Y){q.isScene!==!0&&(q=bt),ut.resetTextureUnits();const St=q.fog,Nt=it.isMeshStandardMaterial?q.environment:null,Gt=E===null?_.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:ir,kt=(it.isMeshStandardMaterial?vt:Bt).get(it.envMap||Nt),jt=it.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,ee=!!tt.attributes.tangent&&(!!it.normalMap||it.anisotropy>0),Yt=!!tt.morphAttributes.position,ue=!!tt.morphAttributes.normal,ye=!!tt.morphAttributes.color;let Ue=Vi;it.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ue=_.toneMapping);const Te=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,Se=Te!==void 0?Te.length:0,Zt=st.get(it),Pe=f.state.lights;if(Ct===!0&&($===!0||C!==S)){const on=C===S&&it.id===M;gt.setState(it,C,on)}let ge=!1;it.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Pe.state.version||Zt.outputColorSpace!==Gt||Y.isBatchedMesh&&Zt.batching===!1||!Y.isBatchedMesh&&Zt.batching===!0||Y.isBatchedMesh&&Zt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Zt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Zt.instancing===!1||!Y.isInstancedMesh&&Zt.instancing===!0||Y.isSkinnedMesh&&Zt.skinning===!1||!Y.isSkinnedMesh&&Zt.skinning===!0||Y.isInstancedMesh&&Zt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Zt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Zt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Zt.instancingMorph===!1&&Y.morphTexture!==null||Zt.envMap!==kt||it.fog===!0&&Zt.fog!==St||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==gt.numPlanes||Zt.numIntersection!==gt.numIntersection)||Zt.vertexAlphas!==jt||Zt.vertexTangents!==ee||Zt.morphTargets!==Yt||Zt.morphNormals!==ue||Zt.morphColors!==ye||Zt.toneMapping!==Ue||Zt.morphTargetsCount!==Se)&&(ge=!0):(ge=!0,Zt.__version=it.version);let _n=Zt.currentProgram;ge===!0&&(_n=ea(it,q,Y));let Ss=!1,yn=!1,ur=!1;const Ie=_n.getUniforms(),Rn=Zt.uniforms;if(j.useProgram(_n.program)&&(Ss=!0,yn=!0,ur=!0),it.id!==M&&(M=it.id,yn=!0),Ss||S!==C){j.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ie.setValue(z,"projectionMatrix",C.projectionMatrix),Ie.setValue(z,"viewMatrix",C.matrixWorldInverse);const pn=Ie.map.cameraPosition;pn!==void 0&&pn.setValue(z,mt.setFromMatrixPosition(C.matrixWorld)),J.logarithmicDepthBuffer&&Ie.setValue(z,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(it.isMeshPhongMaterial||it.isMeshToonMaterial||it.isMeshLambertMaterial||it.isMeshBasicMaterial||it.isMeshStandardMaterial||it.isShaderMaterial)&&Ie.setValue(z,"isOrthographic",C.isOrthographicCamera===!0),S!==C&&(S=C,yn=!0,ur=!0)}if(Y.isSkinnedMesh){Ie.setOptional(z,Y,"bindMatrix"),Ie.setOptional(z,Y,"bindMatrixInverse");const on=Y.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),Ie.setValue(z,"boneTexture",on.boneTexture,ut))}Y.isBatchedMesh&&(Ie.setOptional(z,Y,"batchingTexture"),Ie.setValue(z,"batchingTexture",Y._matricesTexture,ut),Ie.setOptional(z,Y,"batchingIdTexture"),Ie.setValue(z,"batchingIdTexture",Y._indirectTexture,ut),Ie.setOptional(z,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Ie.setValue(z,"batchingColorTexture",Y._colorsTexture,ut));const Cn=tt.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&_t.update(Y,tt,_n),(yn||Zt.receiveShadow!==Y.receiveShadow)&&(Zt.receiveShadow=Y.receiveShadow,Ie.setValue(z,"receiveShadow",Y.receiveShadow)),it.isMeshGouraudMaterial&&it.envMap!==null&&(Rn.envMap.value=kt,Rn.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),it.isMeshStandardMaterial&&it.envMap===null&&q.environment!==null&&(Rn.envMapIntensity.value=q.environmentIntensity),yn&&(Ie.setValue(z,"toneMappingExposure",_.toneMappingExposure),Zt.needsLights&&Pf(Rn,ur),St&&it.fog===!0&&ht.refreshFogUniforms(Rn,St),ht.refreshMaterialUniforms(Rn,it,B,H,f.state.transmissionRenderTarget[C.id]),Ja.upload(z,ch(Zt),Rn,ut)),it.isShaderMaterial&&it.uniformsNeedUpdate===!0&&(Ja.upload(z,ch(Zt),Rn,ut),it.uniformsNeedUpdate=!1),it.isSpriteMaterial&&Ie.setValue(z,"center",Y.center),Ie.setValue(z,"modelViewMatrix",Y.modelViewMatrix),Ie.setValue(z,"normalMatrix",Y.normalMatrix),Ie.setValue(z,"modelMatrix",Y.matrixWorld),it.isShaderMaterial||it.isRawShaderMaterial){const on=it.uniformsGroups;for(let pn=0,Lo=on.length;pn<Lo;pn++){const Ki=on[pn];te.update(Ki,_n),te.bind(Ki,_n)}}return _n}function Pf(C,q){C.ambientLightColor.needsUpdate=q,C.lightProbe.needsUpdate=q,C.directionalLights.needsUpdate=q,C.directionalLightShadows.needsUpdate=q,C.pointLights.needsUpdate=q,C.pointLightShadows.needsUpdate=q,C.spotLights.needsUpdate=q,C.spotLightShadows.needsUpdate=q,C.rectAreaLights.needsUpdate=q,C.hemisphereLights.needsUpdate=q}function If(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(C,q,tt){const it=st.get(C);it.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,it.__autoAllocateDepthBuffer===!1&&(it.__useRenderToTexture=!1),st.get(C.texture).__webglTexture=q,st.get(C.depthTexture).__webglTexture=it.__autoAllocateDepthBuffer?void 0:tt,it.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,q){const tt=st.get(C);tt.__webglFramebuffer=q,tt.__useDefaultFramebuffer=q===void 0};const Lf=z.createFramebuffer();this.setRenderTarget=function(C,q=0,tt=0){E=C,b=q,w=tt;let it=!0,Y=null,St=!1,Nt=!1;if(C){const kt=st.get(C);if(kt.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(z.FRAMEBUFFER,null),it=!1;else if(kt.__webglFramebuffer===void 0)ut.setupRenderTarget(C);else if(kt.__hasExternalTextures)ut.rebindTextures(C,st.get(C.texture).__webglTexture,st.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Yt=C.depthTexture;if(kt.__boundDepthTexture!==Yt){if(Yt!==null&&st.has(Yt)&&(C.width!==Yt.image.width||C.height!==Yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(C)}}const jt=C.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Nt=!0);const ee=st.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ee[q])?Y=ee[q][tt]:Y=ee[q],St=!0):C.samples>0&&ut.useMultisampledRTT(C)===!1?Y=st.get(C).__webglMultisampledFramebuffer:Array.isArray(ee)?Y=ee[tt]:Y=ee,R.copy(C.viewport),D.copy(C.scissor),L=C.scissorTest}else R.copy(Q).multiplyScalar(B).floor(),D.copy(rt).multiplyScalar(B).floor(),L=pt;if(tt!==0&&(Y=Lf),j.bindFramebuffer(z.FRAMEBUFFER,Y)&&it&&j.drawBuffers(C,Y),j.viewport(R),j.scissor(D),j.setScissorTest(L),St){const kt=st.get(C.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+q,kt.__webglTexture,tt)}else if(Nt){const kt=q;for(let jt=0;jt<C.textures.length;jt++){const ee=st.get(C.textures[jt]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+jt,ee.__webglTexture,tt,kt)}}else if(C!==null&&tt!==0){const kt=st.get(C.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,kt.__webglTexture,tt)}M=-1},this.readRenderTargetPixels=function(C,q,tt,it,Y,St,Nt,Gt=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let kt=st.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Nt!==void 0&&(kt=kt[Nt]),kt){j.bindFramebuffer(z.FRAMEBUFFER,kt);try{const jt=C.textures[Gt],ee=jt.format,Yt=jt.type;if(!J.textureFormatReadable(ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=C.width-it&&tt>=0&&tt<=C.height-Y&&(C.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Gt),z.readPixels(q,tt,it,Y,Xt.convert(ee),Xt.convert(Yt),St))}finally{const jt=E!==null?st.get(E).__webglFramebuffer:null;j.bindFramebuffer(z.FRAMEBUFFER,jt)}}},this.readRenderTargetPixelsAsync=async function(C,q,tt,it,Y,St,Nt,Gt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let kt=st.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Nt!==void 0&&(kt=kt[Nt]),kt)if(q>=0&&q<=C.width-it&&tt>=0&&tt<=C.height-Y){j.bindFramebuffer(z.FRAMEBUFFER,kt);const jt=C.textures[Gt],ee=jt.format,Yt=jt.type;if(!J.textureFormatReadable(ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ue=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,ue),z.bufferData(z.PIXEL_PACK_BUFFER,St.byteLength,z.STREAM_READ),C.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Gt),z.readPixels(q,tt,it,Y,Xt.convert(ee),Xt.convert(Yt),0);const ye=E!==null?st.get(E).__webglFramebuffer:null;j.bindFramebuffer(z.FRAMEBUFFER,ye);const Ue=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await A0(z,Ue,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,ue),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,St),z.deleteBuffer(ue),z.deleteSync(Ue),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,q=null,tt=0){const it=Math.pow(2,-tt),Y=Math.floor(C.image.width*it),St=Math.floor(C.image.height*it),Nt=q!==null?q.x:0,Gt=q!==null?q.y:0;ut.setTexture2D(C,0),z.copyTexSubImage2D(z.TEXTURE_2D,tt,0,0,Nt,Gt,Y,St),j.unbindTexture()};const Df=z.createFramebuffer(),Uf=z.createFramebuffer();this.copyTextureToTexture=function(C,q,tt=null,it=null,Y=0,St=null){St===null&&(Y!==0?(Vr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),St=Y,Y=0):St=0);let Nt,Gt,kt,jt,ee,Yt,ue,ye,Ue;const Te=C.isCompressedTexture?C.mipmaps[St]:C.image;if(tt!==null)Nt=tt.max.x-tt.min.x,Gt=tt.max.y-tt.min.y,kt=tt.isBox3?tt.max.z-tt.min.z:1,jt=tt.min.x,ee=tt.min.y,Yt=tt.isBox3?tt.min.z:0;else{const Cn=Math.pow(2,-Y);Nt=Math.floor(Te.width*Cn),Gt=Math.floor(Te.height*Cn),C.isDataArrayTexture?kt=Te.depth:C.isData3DTexture?kt=Math.floor(Te.depth*Cn):kt=1,jt=0,ee=0,Yt=0}it!==null?(ue=it.x,ye=it.y,Ue=it.z):(ue=0,ye=0,Ue=0);const Se=Xt.convert(q.format),Zt=Xt.convert(q.type);let Pe;q.isData3DTexture?(ut.setTexture3D(q,0),Pe=z.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(ut.setTexture2DArray(q,0),Pe=z.TEXTURE_2D_ARRAY):(ut.setTexture2D(q,0),Pe=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,q.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,q.unpackAlignment);const ge=z.getParameter(z.UNPACK_ROW_LENGTH),_n=z.getParameter(z.UNPACK_IMAGE_HEIGHT),Ss=z.getParameter(z.UNPACK_SKIP_PIXELS),yn=z.getParameter(z.UNPACK_SKIP_ROWS),ur=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,Te.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Te.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,jt),z.pixelStorei(z.UNPACK_SKIP_ROWS,ee),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Yt);const Ie=C.isDataArrayTexture||C.isData3DTexture,Rn=q.isDataArrayTexture||q.isData3DTexture;if(C.isDepthTexture){const Cn=st.get(C),on=st.get(q),pn=st.get(Cn.__renderTarget),Lo=st.get(on.__renderTarget);j.bindFramebuffer(z.READ_FRAMEBUFFER,pn.__webglFramebuffer),j.bindFramebuffer(z.DRAW_FRAMEBUFFER,Lo.__webglFramebuffer);for(let Ki=0;Ki<kt;Ki++)Ie&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,st.get(C).__webglTexture,Y,Yt+Ki),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,st.get(q).__webglTexture,St,Ue+Ki)),z.blitFramebuffer(jt,ee,Nt,Gt,ue,ye,Nt,Gt,z.DEPTH_BUFFER_BIT,z.NEAREST);j.bindFramebuffer(z.READ_FRAMEBUFFER,null),j.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(Y!==0||C.isRenderTargetTexture||st.has(C)){const Cn=st.get(C),on=st.get(q);j.bindFramebuffer(z.READ_FRAMEBUFFER,Df),j.bindFramebuffer(z.DRAW_FRAMEBUFFER,Uf);for(let pn=0;pn<kt;pn++)Ie?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Cn.__webglTexture,Y,Yt+pn):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Cn.__webglTexture,Y),Rn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,on.__webglTexture,St,Ue+pn):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,on.__webglTexture,St),Y!==0?z.blitFramebuffer(jt,ee,Nt,Gt,ue,ye,Nt,Gt,z.COLOR_BUFFER_BIT,z.NEAREST):Rn?z.copyTexSubImage3D(Pe,St,ue,ye,Ue+pn,jt,ee,Nt,Gt):z.copyTexSubImage2D(Pe,St,ue,ye,jt,ee,Nt,Gt);j.bindFramebuffer(z.READ_FRAMEBUFFER,null),j.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else Rn?C.isDataTexture||C.isData3DTexture?z.texSubImage3D(Pe,St,ue,ye,Ue,Nt,Gt,kt,Se,Zt,Te.data):q.isCompressedArrayTexture?z.compressedTexSubImage3D(Pe,St,ue,ye,Ue,Nt,Gt,kt,Se,Te.data):z.texSubImage3D(Pe,St,ue,ye,Ue,Nt,Gt,kt,Se,Zt,Te):C.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,St,ue,ye,Nt,Gt,Se,Zt,Te.data):C.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,St,ue,ye,Te.width,Te.height,Se,Te.data):z.texSubImage2D(z.TEXTURE_2D,St,ue,ye,Nt,Gt,Se,Zt,Te);z.pixelStorei(z.UNPACK_ROW_LENGTH,ge),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,_n),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Ss),z.pixelStorei(z.UNPACK_SKIP_ROWS,yn),z.pixelStorei(z.UNPACK_SKIP_IMAGES,ur),St===0&&q.generateMipmaps&&z.generateMipmap(Pe),j.unbindTexture()},this.initRenderTarget=function(C){st.get(C).__webglFramebuffer===void 0&&ut.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?ut.setTextureCube(C,0):C.isData3DTexture?ut.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ut.setTexture2DArray(C,0):ut.setTexture2D(C,0),j.unbindTexture()},this.resetState=function(){b=0,w=0,E=null,j.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}const Lx=.85,ml=i=>i*i*(3-2*i);function Su(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=ml(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*ml(e),veil:.82+.14*ml(Math.min(1,e/.5)),ready:e===1}}const ef=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function nf(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class hr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Dx=new Kc(-1,1,1,-1,0,1);class Ux extends Ae{constructor(){super(),this.setAttribute("position",new he([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new he([0,2,0,0,2,0],2))}}const Nx=new Ux;class Qc{constructor(t){this._mesh=new Ft(Nx,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Dx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const Ua={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class sf extends hr{constructor(){super(),this.uniforms=ps.clone(Ua.uniforms),this.material=new Fp({name:Ua.name,uniforms:this.uniforms,vertexShader:Ua.vertexShader,fragmentShader:Ua.fragmentShader}),this._fsQuad=new Qc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},me.getTransfer(this._outputColorSpace)===xe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===fd?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===pd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===md?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Lc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===vd?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===xd?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===gd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const ti={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},ao={min:.85,max:1.35};function Fx(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function bu(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,d=t.height*c*.5,p=Math.max(i.x,.001),u=Math.max(i.y,.001),m=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,v=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(p+m*i.z/s),d/(u+v*i.z/s))}function Ox(i,t){if(!ti[i])throw Error("unknown item");if(t==="front")return[...ti[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(ti[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=ti[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class zx extends cc{constructor(){super();const t=new An;t.deleteAttribute("uv");const e=new Rt({side:an}),n=new Rt,s=new ro(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Ft(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new Q0(t,n,6),o=new He;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new Ft(t,Vs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Ft(t,Vs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Ft(t,Vs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const d=new Ft(t,Vs(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);const p=new Ft(t,Vs(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const u=new Ft(t,Vs(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Vs(i){return new zp({color:0,emissive:16777215,emissiveIntensity:i})}function rf(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ae;let c=0;for(let h=0;h<i.length;++h){const d=i[h];let p=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const u in d.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(d.attributes[u]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const u in d.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[u]===void 0&&(a[u]=[]),a[u].push(d.morphAttributes[u])}if(t){let u;if(e)u=d.index.count;else if(d.attributes.position!==void 0)u=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,u,h),c+=u}}if(e){let h=0;const d=[];for(let p=0;p<i.length;++p){const u=i[p].index;for(let m=0;m<u.count;++m)d.push(u.getX(m)+h);h+=i[p].attributes.position.count}l.setIndex(d)}for(const h in r){const d=wu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(const h in a){const d=a[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<d;++p){const u=[];for(let v=0;v<a[h].length;++v)u.push(a[h][v][p]);const m=wu(u);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function wu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Ce(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const d=l/e;for(let p=0,u=h.count;p<u;p++)for(let m=0;m<e;m++){const v=h.getComponent(p,m);o.setComponent(p+d,m,v)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function fi(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function fe(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,fi(),e);const s=new sp(n);return s.colorSpace=Ye,s.anisotropy=8,s}function vc(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return fe((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function fn(i,t,e,n=fi(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function To(i){const t=fe((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=li,t}const af=To("paper"),of=To("leather"),Ar=To("metal"),Tu=To("cloth"),Rr=Ar.clone();Rr.colorSpace=gn;const xc=of.clone();xc.colorSpace=gn;const Ka=af.clone();Ka.colorSpace=gn;const Bx=fe((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),U={black:new Rt({color:1646879,roughness:.42,metalness:.38,map:Ar,bumpMap:Rr,bumpScale:.004}),leather:new Rt({color:6712935,map:of,roughness:.78,bumpMap:xc,bumpScale:.01}),silver:new Rt({color:12239550,map:Ar,roughnessMap:Rr,roughness:.35,metalness:.93,bumpMap:Rr,bumpScale:.003}),gold:new Rt({color:12427627,map:Ar,roughness:.29,metalness:.88,bumpMap:Rr,bumpScale:.003}),bronze:new Rt({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new $s({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:Ka,bumpScale:4e-4}),blue:new $s({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new $s({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new Rt({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new $s({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new Rt({color:14799534,map:af,roughness:.96,bumpMap:Ka,bumpScale:.006,side:Be}),red:new Rt({color:7152936,map:Tu,roughness:.82,bumpMap:Tu,bumpScale:.009}),rust:new Rt({map:Bx,roughness:.92,metalness:.08,bumpMap:Ka,bumpScale:.022}),rubber:new Rt({color:1383192,roughness:.88,bumpMap:xc,bumpScale:.008}),copper:new Rt({color:12089158,map:Ar,roughness:.37,metalness:.9})},gl=new Map;let lf=[];function ja(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(gl.has(n))return gl.get(n);let s;lf.push(new Promise(a=>s=a));const r=new $d().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?gn:Ye,r.wrapS=r.wrapT=li,r.repeat.set(...t),r.anisotropy=8,gl.set(n,r),r}function kx(){return Promise.all(lf)}function Eu(i,t=[1,1]){return{map:ja(`${i}.jpg`,{repeat:t}),normalMap:ja(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:ja(`${i}-roughness.png`,{repeat:t,data:!0})}}function cf(){return fe((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const Qa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Hx extends hr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof un?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ps.clone(t.uniforms),this.material=new un({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Qc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Au extends hr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Gx extends hr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Vx{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ft);this._width=n.width,this._height=n.height,e=new En(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hi}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Hx(Qa),this.copyPass.material.blending=hn,this.clock=new Yp}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Au!==void 0&&(a instanceof Au?n=!0:a instanceof Gx&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ft);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Wx extends hr{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new qt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class Xx{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,d=(l+c)*h,p=l-d,u=c-d,m=t-p,v=e-u;let g,f;m>v?(g=1,f=0):(g=0,f=1);const x=m-g+h,y=v-f+h,_=m-1+2*h,T=v-1+2*h,b=l&255,w=c&255,E=this.perm[b+this.perm[w]]%12,M=this.perm[b+g+this.perm[w+f]]%12,S=this.perm[b+1+this.perm[w+1]]%12;let R=.5-m*m-v*v;R<0?n=0:(R*=R,n=R*R*this._dot(this.grad3[E],m,v));let D=.5-x*x-y*y;D<0?s=0:(D*=D,s=D*D*this._dot(this.grad3[M],x,y));let L=.5-_*_-T*T;return L<0?r=0:(L*=L,r=L*L*this._dot(this.grad3[S],_,T)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),d=Math.floor(e+c),p=Math.floor(n+c),u=1/6,m=(h+d+p)*u,v=h-m,g=d-m,f=p-m,x=t-v,y=e-g,_=n-f;let T,b,w,E,M,S;x>=y?y>=_?(T=1,b=0,w=0,E=1,M=1,S=0):x>=_?(T=1,b=0,w=0,E=1,M=0,S=1):(T=0,b=0,w=1,E=1,M=0,S=1):y<_?(T=0,b=0,w=1,E=0,M=1,S=1):x<_?(T=0,b=1,w=0,E=0,M=1,S=1):(T=0,b=1,w=0,E=1,M=1,S=0);const R=x-T+u,D=y-b+u,L=_-w+u,N=x-E+2*u,O=y-M+2*u,F=_-S+2*u,H=x-1+3*u,B=y-1+3*u,X=_-1+3*u,G=h&255,Q=d&255,rt=p&255,pt=this.perm[G+this.perm[Q+this.perm[rt]]]%12,zt=this.perm[G+T+this.perm[Q+b+this.perm[rt+w]]]%12,Ct=this.perm[G+E+this.perm[Q+M+this.perm[rt+S]]]%12,$=this.perm[G+1+this.perm[Q+1+this.perm[rt+1]]]%12;let nt=.6-x*x-y*y-_*_;nt<0?s=0:(nt*=nt,s=nt*nt*this._dot3(this.grad3[pt],x,y,_));let mt=.6-R*R-D*D-L*L;mt<0?r=0:(mt*=mt,r=mt*mt*this._dot3(this.grad3[zt],R,D,L));let xt=.6-N*N-O*O-F*F;xt<0?a=0:(xt*=xt,a=xt*xt*this._dot3(this.grad3[Ct],N,O,F));let bt=.6-H*H-B*B-X*X;return bt<0?o=0:(bt*=bt,o=bt*bt*this._dot3(this.grad3[$],H,B,X)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,d,p,u,m;const v=(t+e+n+s)*l,g=Math.floor(t+v),f=Math.floor(e+v),x=Math.floor(n+v),y=Math.floor(s+v),_=(g+f+x+y)*c,T=g-_,b=f-_,w=x-_,E=y-_,M=t-T,S=e-b,R=n-w,D=s-E,L=M>S?32:0,N=M>R?16:0,O=S>R?8:0,F=M>D?4:0,H=S>D?2:0,B=R>D?1:0,X=L+N+O+F+H+B,G=a[X][0]>=3?1:0,Q=a[X][1]>=3?1:0,rt=a[X][2]>=3?1:0,pt=a[X][3]>=3?1:0,zt=a[X][0]>=2?1:0,Ct=a[X][1]>=2?1:0,$=a[X][2]>=2?1:0,nt=a[X][3]>=2?1:0,mt=a[X][0]>=1?1:0,xt=a[X][1]>=1?1:0,bt=a[X][2]>=1?1:0,Wt=a[X][3]>=1?1:0,Qt=M-G+c,z=S-Q+c,lt=R-rt+c,ct=D-pt+c,J=M-zt+2*c,j=S-Ct+2*c,at=R-$+2*c,st=D-nt+2*c,ut=M-mt+3*c,Bt=S-xt+3*c,vt=R-bt+3*c,P=D-Wt+3*c,A=M-1+4*c,W=S-1+4*c,K=R-1+4*c,ht=D-1+4*c,Z=g&255,wt=f&255,gt=x&255,Pt=y&255,Ut=o[Z+o[wt+o[gt+o[Pt]]]]%32,_t=o[Z+G+o[wt+Q+o[gt+rt+o[Pt+pt]]]]%32,It=o[Z+zt+o[wt+Ct+o[gt+$+o[Pt+nt]]]]%32,Jt=o[Z+mt+o[wt+xt+o[gt+bt+o[Pt+Wt]]]]%32,Xt=o[Z+1+o[wt+1+o[gt+1+o[Pt+1]]]]%32;let At=.6-M*M-S*S-R*R-D*D;At<0?h=0:(At*=At,h=At*At*this._dot4(r[Ut],M,S,R,D));let te=.6-Qt*Qt-z*z-lt*lt-ct*ct;te<0?d=0:(te*=te,d=te*te*this._dot4(r[_t],Qt,z,lt,ct));let V=.6-J*J-j*j-at*at-st*st;V<0?p=0:(V*=V,p=V*V*this._dot4(r[It],J,j,at,st));let yt=.6-ut*ut-Bt*Bt-vt*vt-P*P;yt<0?u=0:(yt*=yt,u=yt*yt*this._dot4(r[Jt],ut,Bt,vt,P));let Tt=.6-A*A-W*W-K*K-ht*ht;return Tt<0?m=0:(Tt*=Tt,m=Tt*Tt*this._dot4(r[Xt],A,W,K,ht)),27*(h+d+p+u+m)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const Na={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new ft},cameraProjectionMatrix:{value:new $t},cameraInverseProjectionMatrix:{value:new $t},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

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

		}`},Oa={uniforms:{tDiffuse:{value:null},resolution:{value:new ft}},vertexShader:`varying vec2 vUv;

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

		}`};class ki extends hr{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new qc;a.format=nr,a.type=er,this.normalRenderTarget=new En(this.width,this.height,{minFilter:dn,magFilter:dn,type:hi,depthTexture:a}),this.ssaoRenderTarget=new En(this.width,this.height,{type:hi}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new un({defines:Object.assign({},Na.defines),uniforms:ps.clone(Na.uniforms),vertexShader:Na.vertexShader,fragmentShader:Na.fragmentShader,blending:hn}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new Op,this.normalMaterial.blending=hn,this.blurMaterial=new un({defines:Object.assign({},Oa.defines),uniforms:ps.clone(Oa.uniforms),vertexShader:Oa.vertexShader,fragmentShader:Oa.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new un({defines:Object.assign({},Fa.defines),uniforms:ps.clone(Fa.uniforms),vertexShader:Fa.vertexShader,fragmentShader:Fa.fragmentShader,blending:hn}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new un({uniforms:ps.clone(Qa.uniforms),vertexShader:Qa.vertexShader,fragmentShader:Qa.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:dd,blendDst:Ml,blendEquation:Ai,blendSrcAlpha:ud,blendDstAlpha:Ml,blendEquationAlpha:Ai}),this._fsQuad=new Qc(null),this._originalClearColor=new qt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case ki.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=hn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=hn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=hn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case ki.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=hd,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new I;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=ne.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new Xx,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new Wc(r,4,4,xo,qn),this.noiseTexture.wrapS=li,this.noiseTexture.wrapT=li,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}ki.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class qx extends ki{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class Yx{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new En(1,1,{type:hi,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new Vx(t,r),this.composer.addPass(new Wx(e,n)),this.ao=new qx(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new sf),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function $x(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const Sr=new I;function In(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Sr.copy(t),Sr[n]=0,Sr.normalize();const c=.5*a/(a+o),h=1-Sr.angleTo(i)/l;return Math.sign(Sr[e])===1?h*c:o/(a+o)+c+c*(1-h)}class th extends An{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new I,c=new I,h=new I(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,p=this.attributes.normal.array,u=this.attributes.uv.array,m=d.length/6,v=new I,g=.5/a;for(let f=0,x=0;f<d.length;f+=3,x+=2)switch(l.fromArray(d,f),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),d[f+0]=h.x*Math.sign(l.x)+c.x*r,d[f+1]=h.y*Math.sign(l.y)+c.y*r,d[f+2]=h.z*Math.sign(l.z)+c.z*r,p[f+0]=c.x,p[f+1]=c.y,p[f+2]=c.z,Math.floor(f/m)){case 0:v.set(1,0,0),u[x+0]=In(v,c,"z","y",r,n),u[x+1]=1-In(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),u[x+0]=1-In(v,c,"z","y",r,n),u[x+1]=1-In(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),u[x+0]=1-In(v,c,"x","z",r,t),u[x+1]=In(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),u[x+0]=1-In(v,c,"x","z",r,t),u[x+1]=1-In(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),u[x+0]=1-In(v,c,"x","y",r,t),u[x+1]=1-In(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),u[x+0]=In(v,c,"x","y",r,t),u[x+1]=1-In(v,c,"y","x",r,e);break}}static fromJSON(t){return new th(t.width,t.height,t.depth,t.segments,t.radius)}}class Zx extends Ft{constructor(t,e,n=!1,s=!1,r=1e4){const a=new Ae;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(x){this.resolution=x,this.isolation=80,this.size=x,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const y=r*3;this.positionArray=new Float32Array(y*3);const _=new Ce(this.positionArray,3);_.setUsage(ia),a.setAttribute("position",_),this.normalArray=new Float32Array(y*3);const T=new Ce(this.normalArray,3);if(T.setUsage(ia),a.setAttribute("normal",T),this.enableUvs){this.uvArray=new Float32Array(y*2);const b=new Ce(this.uvArray,2);b.setUsage(ia),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const b=new Ce(this.colorArray,3);b.setUsage(ia),a.setAttribute("color",b)}a.boundingSphere=new Ms(new I,1)};function d(x,y,_){return x+(y-x)*_}function p(x,y,_,T,b,w,E,M,S,R){const D=(_-E)/(M-E),L=o.normal_cache;l[y+0]=T+D*o.delta,l[y+1]=b,l[y+2]=w,c[y+0]=d(L[x+0],L[x+3],D),c[y+1]=d(L[x+1],L[x+4],D),c[y+2]=d(L[x+2],L[x+5],D),h[y+0]=d(o.palette[S*3+0],o.palette[R*3+0],D),h[y+1]=d(o.palette[S*3+1],o.palette[R*3+1],D),h[y+2]=d(o.palette[S*3+2],o.palette[R*3+2],D)}function u(x,y,_,T,b,w,E,M,S,R){const D=(_-E)/(M-E),L=o.normal_cache;l[y+0]=T,l[y+1]=b+D*o.delta,l[y+2]=w;const N=x+o.yd*3;c[y+0]=d(L[x+0],L[N+0],D),c[y+1]=d(L[x+1],L[N+1],D),c[y+2]=d(L[x+2],L[N+2],D),h[y+0]=d(o.palette[S*3+0],o.palette[R*3+0],D),h[y+1]=d(o.palette[S*3+1],o.palette[R*3+1],D),h[y+2]=d(o.palette[S*3+2],o.palette[R*3+2],D)}function m(x,y,_,T,b,w,E,M,S,R){const D=(_-E)/(M-E),L=o.normal_cache;l[y+0]=T,l[y+1]=b,l[y+2]=w+D*o.delta;const N=x+o.zd*3;c[y+0]=d(L[x+0],L[N+0],D),c[y+1]=d(L[x+1],L[N+1],D),c[y+2]=d(L[x+2],L[N+2],D),h[y+0]=d(o.palette[S*3+0],o.palette[R*3+0],D),h[y+1]=d(o.palette[S*3+1],o.palette[R*3+1],D),h[y+2]=d(o.palette[S*3+2],o.palette[R*3+2],D)}function v(x){const y=x*3;o.normal_cache[y]===0&&(o.normal_cache[y+0]=o.field[x-1]-o.field[x+1],o.normal_cache[y+1]=o.field[x-o.yd]-o.field[x+o.yd],o.normal_cache[y+2]=o.field[x-o.zd]-o.field[x+o.zd])}function g(x,y,_,T,b){const w=T+1,E=T+o.yd,M=T+o.zd,S=w+o.yd,R=w+o.zd,D=T+o.yd+o.zd,L=w+o.yd+o.zd;let N=0;const O=o.field[T],F=o.field[w],H=o.field[E],B=o.field[S],X=o.field[M],G=o.field[R],Q=o.field[D],rt=o.field[L];O<b&&(N|=1),F<b&&(N|=2),H<b&&(N|=8),B<b&&(N|=4),X<b&&(N|=16),G<b&&(N|=32),Q<b&&(N|=128),rt<b&&(N|=64);const pt=Jx[N];if(pt===0)return 0;const zt=o.delta,Ct=x+zt,$=y+zt,nt=_+zt;pt&1&&(v(T),v(w),p(T*3,0,b,x,y,_,O,F,T,w)),pt&2&&(v(w),v(S),u(w*3,3,b,Ct,y,_,F,B,w,S)),pt&4&&(v(E),v(S),p(E*3,6,b,x,$,_,H,B,E,S)),pt&8&&(v(T),v(E),u(T*3,9,b,x,y,_,O,H,T,E)),pt&16&&(v(M),v(R),p(M*3,12,b,x,y,nt,X,G,M,R)),pt&32&&(v(R),v(L),u(R*3,15,b,Ct,y,nt,G,rt,R,L)),pt&64&&(v(D),v(L),p(D*3,18,b,x,$,nt,Q,rt,D,L)),pt&128&&(v(M),v(D),u(M*3,21,b,x,y,nt,X,Q,M,D)),pt&256&&(v(T),v(M),m(T*3,24,b,x,y,_,O,X,T,M)),pt&512&&(v(w),v(R),m(w*3,27,b,Ct,y,_,F,G,w,R)),pt&1024&&(v(S),v(L),m(S*3,30,b,Ct,$,_,B,rt,S,L)),pt&2048&&(v(E),v(D),m(E*3,33,b,x,$,_,H,Q,E,D)),N<<=4;let mt,xt,bt,Wt=0,Qt=0;for(;za[N+Qt]!=-1;)mt=N+Qt,xt=mt+1,bt=mt+2,f(l,c,h,3*za[mt],3*za[xt],3*za[bt]),Qt+=3,Wt++;return Wt}function f(x,y,_,T,b,w){const E=o.count*3;if(o.positionArray[E+0]=x[T],o.positionArray[E+1]=x[T+1],o.positionArray[E+2]=x[T+2],o.positionArray[E+3]=x[b],o.positionArray[E+4]=x[b+1],o.positionArray[E+5]=x[b+2],o.positionArray[E+6]=x[w],o.positionArray[E+7]=x[w+1],o.positionArray[E+8]=x[w+2],o.material.flatShading===!0){const M=(y[T+0]+y[b+0]+y[w+0])/3,S=(y[T+1]+y[b+1]+y[w+1])/3,R=(y[T+2]+y[b+2]+y[w+2])/3;o.normalArray[E+0]=M,o.normalArray[E+1]=S,o.normalArray[E+2]=R,o.normalArray[E+3]=M,o.normalArray[E+4]=S,o.normalArray[E+5]=R,o.normalArray[E+6]=M,o.normalArray[E+7]=S,o.normalArray[E+8]=R}else o.normalArray[E+0]=y[T+0],o.normalArray[E+1]=y[T+1],o.normalArray[E+2]=y[T+2],o.normalArray[E+3]=y[b+0],o.normalArray[E+4]=y[b+1],o.normalArray[E+5]=y[b+2],o.normalArray[E+6]=y[w+0],o.normalArray[E+7]=y[w+1],o.normalArray[E+8]=y[w+2];if(o.enableUvs){const M=o.count*2;o.uvArray[M+0]=x[T+0],o.uvArray[M+1]=x[T+2],o.uvArray[M+2]=x[b+0],o.uvArray[M+3]=x[b+2],o.uvArray[M+4]=x[w+0],o.uvArray[M+5]=x[w+2]}o.enableColors&&(o.colorArray[E+0]=_[T+0],o.colorArray[E+1]=_[T+1],o.colorArray[E+2]=_[T+2],o.colorArray[E+3]=_[b+0],o.colorArray[E+4]=_[b+1],o.colorArray[E+5]=_[b+2],o.colorArray[E+6]=_[w+0],o.colorArray[E+7]=_[w+1],o.colorArray[E+8]=_[w+2]),o.count+=3}this.addBall=function(x,y,_,T,b,w){const E=Math.sign(T);T=Math.abs(T);const M=w!=null;let S=new qt(x,y,_);if(M)try{S=w instanceof qt?w:Array.isArray(w)?new qt(Math.min(Math.abs(w[0]),1),Math.min(Math.abs(w[1]),1),Math.min(Math.abs(w[2]),1)):new qt(w)}catch{S=new qt(x,y,_)}const R=this.size*Math.sqrt(T/b),D=_*this.size,L=y*this.size,N=x*this.size;let O=Math.floor(D-R);O<1&&(O=1);let F=Math.floor(D+R);F>this.size-1&&(F=this.size-1);let H=Math.floor(L-R);H<1&&(H=1);let B=Math.floor(L+R);B>this.size-1&&(B=this.size-1);let X=Math.floor(N-R);X<1&&(X=1);let G=Math.floor(N+R);G>this.size-1&&(G=this.size-1);let Q,rt,pt,zt,Ct,$,nt,mt,xt,bt,Wt;for(pt=O;pt<F;pt++)for(Ct=this.size2*pt,mt=pt/this.size-_,xt=mt*mt,rt=H;rt<B;rt++)for(zt=Ct+this.size*rt,nt=rt/this.size-y,bt=nt*nt,Q=X;Q<G;Q++)if($=Q/this.size-x,Wt=T/(1e-6+$*$+bt+xt)-b,Wt>0){this.field[zt+Q]+=Wt*E;const Qt=Math.sqrt((Q-N)*(Q-N)+(rt-L)*(rt-L)+(pt-D)*(pt-D))/R,z=1-Qt*Qt*Qt*(Qt*(Qt*6-15)+10);this.palette[(zt+Q)*3+0]+=S.r*z,this.palette[(zt+Q)*3+1]+=S.g*z,this.palette[(zt+Q)*3+2]+=S.b*z}},this.addPlaneX=function(x,y){const _=this.size,T=this.yd,b=this.zd,w=this.field;let E,M,S,R,D,L,N,O=_*Math.sqrt(x/y);for(O>_&&(O=_),E=0;E<O;E++)if(L=E/_,R=L*L,D=x/(1e-4+R)-y,D>0)for(M=0;M<_;M++)for(N=E+M*T,S=0;S<_;S++)w[b*S+N]+=D},this.addPlaneY=function(x,y){const _=this.size,T=this.yd,b=this.zd,w=this.field;let E,M,S,R,D,L,N,O,F=_*Math.sqrt(x/y);for(F>_&&(F=_),M=0;M<F;M++)if(L=M/_,R=L*L,D=x/(1e-4+R)-y,D>0)for(N=M*T,E=0;E<_;E++)for(O=N+E,S=0;S<_;S++)w[b*S+O]+=D},this.addPlaneZ=function(x,y){const _=this.size,T=this.yd,b=this.zd,w=this.field;let E,M,S,R,D,L,N,O,F=_*Math.sqrt(x/y);for(F>_&&(F=_),S=0;S<F;S++)if(L=S/_,R=L*L,D=x/(1e-4+R)-y,D>0)for(N=b*S,M=0;M<_;M++)for(O=N+M*T,E=0;E<_;E++)w[O+E]+=D},this.setCell=function(x,y,_,T){const b=this.size2*_+this.size*y+x;this.field[b]=T},this.getCell=function(x,y,_){const T=this.size2*_+this.size*y+x;return this.field[T]},this.blur=function(x=1){const y=this.field,_=y.slice(),T=this.size,b=this.size2;for(let w=0;w<T;w++)for(let E=0;E<T;E++)for(let M=0;M<T;M++){const S=b*M+T*E+w;let R=_[S],D=1;for(let L=-1;L<=1;L+=2){const N=L+w;if(!(N<0||N>=T))for(let O=-1;O<=1;O+=2){const F=O+E;if(!(F<0||F>=T))for(let H=-1;H<=1;H+=2){const B=H+M;if(B<0||B>=T)continue;const X=b*B+T*F+N,G=_[X];D++,R+=x*(G-R)/D}}}y[S]=R}},this.reset=function(){for(let x=0;x<this.size3;x++)this.normal_cache[x*3]=0,this.field[x]=0,this.palette[x*3]=this.palette[x*3+1]=this.palette[x*3+2]=0},this.update=function(){this.count=0;const x=this.size-2;for(let y=1;y<x;y++){const _=this.size2*y,T=(y-this.halfsize)/this.halfsize;for(let b=1;b<x;b++){const w=_+this.size*b,E=(b-this.halfsize)/this.halfsize;for(let M=1;M<x;M++){const S=(M-this.halfsize)/this.halfsize,R=w+M;g(S,E,T,R,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Jx=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),za=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function hf(i,t,e=44){const n=new Zx(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,d=a/e*2-1;let p=10;for(const[u,m,v,g,f,x,y=0]of i){const _=Math.cos(y),T=Math.sin(y),b=c-u,w=h-m,E=d-v,M=_*b+T*w,S=-T*b+_*w,R=Math.hypot(M/g,S/f,E/x),D=Math.hypot(M/(g*g),S/(f*f),E/(x*x)),L=D>1e-6?R*(R-1)/D:-Math.min(g,f,x),N=.085,O=Math.max(N-Math.abs(p-L),0)/N;p=Math.min(p,L)-O*O*O*N/6}n.field[a*e*e+o*e+l]=-p}n.update();const s=n.geometry.drawRange.count,r=new Ae;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Ce(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const tn=Math.PI*2;let eh=1;function Ru(i){eh=Math.max(.24,Math.min(1,i))||1}const Zr=(i,t=4)=>Math.max(t,Math.round(i*eh));function Dt(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new Ft(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function k(i,t,e,n=U.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return Dt(s?new th(...t,eh<.8?1:2,a):new An(...t),n,i,e,r)}function Ot(i,t,e,n,s,r=U.silver,a=[Math.PI/2,0,0],o=48){return Dt(new ke(t,e,n,Zr(o,6)),r,i,s,a)}function Wi(i,t,e,n=U.cream){const s=Dt(new Ne(1,Zr(32,8),Zr(24,6)),n,i,e);return s.scale.set(...t),s}function be(i,t,e,n,s=U.gold,r=[0,0,0],a=tn){return Dt(new $i(t,e,Zr(8,4),Zr(64,8),a),s,i,n,r)}function Nn(i,t,e,n=U.gold,s=30){return Dt(new Qe(new Tn(t.map(r=>new I(...r))),s,e,8,!1),n,i)}function _s(i,t,e,n=[0,0,0],s=64){return Dt(new So(t.map(r=>new ft(...r)),s),e,i,n)}function oo(i,t,e,n,s=.022,r=U.silver){Ot(i,s,s,s*.35,[t,e,n],r,void 0,16),k(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],U.black,.001,[0,0,(t+e)*7])}function $n(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=fe((c,h,d)=>s(c,h,o,d),768,o);return Dt(new de(t,e),new Rt({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function Ze(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return $n(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function Eo(i,t,e,n){const s=fe((r,a,o)=>n(r,a,o),1024);return Dt(new Yi(t,80),new Ke({map:s,toneMapped:!1}),i,[0,0,e])}function nh(i,t,e,n,s=U.clear){const r=Dt(new Ne(1,48,20,0,tn,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function lo(i,t,e,n,s=48,r=U.silver,a="z"){for(let o=0;o<s;o++){const l=o*tn/s;a==="z"?k(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):k(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function ar(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return Dt(new yo(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function Cu(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function Kx(i){k(i,[1.65,.92,.49],[0,0,0],U.black,.07),k(i,[1.57,.81,.016],[0,-.015,.253],U.leather,.024),k(i,[1.63,.245,.52],[0,.448,0],U.silver,.035),k(i,[1.63,.105,.51],[0,-.48,0],U.silver,.02),k(i,[1.57,.77,.018],[0,-.015,-.257],U.leather,.025),k(i,[1.62,.82,.035],[0,-.015,-.256],U.black,.035),k(i,[1.49,.7,.02],[0,-.01,-.282],U.leather,.023),Ze(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),Ze(i,"8М",.18,.1,[-.55,-.11,.269]),Ze(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),Ze(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new ie;t.position.set(.12,-.045,0),i.add(t),Ot(t,.36,.39,.18,[0,0,.34],U.black),Ot(t,.325,.345,.13,[0,0,.466],U.silver),Ot(t,.293,.293,.21,[0,0,.575],U.black),lo(t,.296,.12,[0,0,.56],56,U.rubber),be(t,.29,.012,[0,0,.682],U.silver),Ot(t,.272,.272,.025,[0,0,.688],U.black),Eo(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),Cu(n,"ТРИПЛЕТ 43 • 4/40",420),Cu(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),Ot(t,.204,.204,.025,[0,0,.717],U.black);for(let n=0;n<7;n++){const s=n*tn/7,r=new Li;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),Dt(new bo(r),U.rubber,t,[0,0,.733],[0,0,s])}Ot(t,.082,.082,.006,[0,0,.74],U.black),nh(t,.196,.028,[0,0,.748],U.clear),be(t,.204,.006,[0,0,.736],U.silver),$n(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),k(i,[.292,.177,.047],[-.49,.444,.282],U.black,.025),k(i,[.2,.105,.016],[-.49,.444,.309],U.lens,.009),k(i,[.21,.13,.035],[-.49,.447,-.28],U.black,.012),k(i,[.155,.08,.012],[-.49,.447,-.305],U.lens,.005);for(const n of[-.7,.72])oo(i,n,.452,.269,.021);for(const n of[-.65,.65])oo(i,n,-.32,-.3,.018);Ot(i,.161,.17,.105,[-.53,.625,0],U.silver,[0,0,0]),lo(i,.161,.067,[-.53,.63,0],38,U.silver,"y"),Ot(i,.11,.12,.072,[.53,.603,0],U.black,[0,0,0]),Ot(i,.059,.065,.075,[.53,.67,0],U.silver,[0,0,0]),k(i,[.27,.024,.23],[.02,.584,0],U.black,.006);for(const n of[-.14,.14])k(i,[.035,.04,.25],[n,.6,0],U.silver,.007);Ot(i,.036,.036,.015,[0,-.535,0],U.gold,[0,0,0]);for(const n of[-.79,.79])be(i,.055,.012,[n,.14,0],U.silver,[0,Math.PI/2,0]);const e=Nn(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,U.leather,50);e.scale.z=.4}function jx(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];_s(i,t,U.cream),be(i,.531,.007,[0,.377,0],U.gold,[Math.PI/2,0,0]),be(i,.272,.006,[0,-.489,0],U.gold,[Math.PI/2,0,0]),Nn(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,U.cream),Nn(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,U.gold);const e=fe((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,tn),s.fill()},1024),n=new Rt({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});_s(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),Ze(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function Qx(i){const t=new Rt({map:U.leather.map,color:7754307,roughness:.84,bumpMap:U.leather.bumpMap,bumpScale:.01});k(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)k(i,[.008,.023,.004],[s,r,.001],U.paper,.001);for(let s=-.99;s<-.46;s+=.105)Ot(i,.019,.019,.004,[0,s,.004],U.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])k(i,[.1,.18,.13],[r,s,.035],U.silver,.023,[0,0,r*s]);Ot(i,.415,.438,.135,[0,0,.066],U.silver),be(i,.394,.027,[0,0,.143],U.silver),Eo(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*tn/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*tn/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),fn(s,r,r,a,1700)}),k(i,[.019,.244,.009],[-.038,.102,.18],U.black,.003,[0,0,.36]),k(i,[.012,.31,.008],[.105,.067,.19],U.black,.002,[0,0,-1]),k(i,[.004,.45,.003],[-.09,-.012,.201],U.copper,.001,[0,0,1.71]),Ot(i,.018,.02,.015,[0,0,.205],U.gold),nh(i,.371,.018,[0,0,.211]),Ot(i,.056,.057,.1,[.468,0,.04],U.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*tn/18;k(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],U.silver,.001,[r,0,0])}const e=new Li;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new so;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),ar(i,e,.025,U.silver,[0,1,.02]),k(i,[.02,.23,.018],[0,1,.065],U.silver,.003),Ot(i,.392,.392,.02,[0,0,-.104],U.silver),Ze(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),Ze(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;oo(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new I().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function t_(i){k(i,[1.6,1,.166],[0,0,0],U.black,.07),k(i,[1.46,.77,.026],[0,.075,.092],U.rubber,.04),$n(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),fn(t,e,n,s,1200)}),k(i,[1.07,.276,.012],[0,-.044,.121],U.black,.04);for(const t of[-.405,.405]){Ot(i,.176,.176,.018,[t,-.038,.132],U.rust),Ot(i,.112,.112,.023,[t,-.038,.146],U.paper),Ot(i,.063,.063,.027,[t,-.038,.152],U.black);for(let e=0;e<6;e++){const n=e*tn/6;k(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],U.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])be(i,e,.002,[t,-.038,.147],U.black)}for(let t=-.2;t<.23;t+=.043)k(i,[.012,.08,.008],[t,-.04,.137],U.silver,.001);k(i,[1.16,.205,.035],[0,-.374,.105],U.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])oo(i,t,e,.098,.024);for(const t of[-.44,.44])Ot(i,.049,.049,.008,[t,-.389,.131],U.rubber);for(let t=0;t<20;t++)k(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],U.leather,.001);$n(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);fn(t,e,n,s,800)},[0,Math.PI,0])}function e_(i){Dt(hf([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],U.cream,44),U.cream,i);for(const e of[-1,0,1]){const n=Wi(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],U.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new Li;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),ar(i,t,.13,U.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){Wi(i,[.012,.014,.007],[.43,.405,e*.164],U.black),Nn(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,U.gold,30);for(let n=0;n<4;n++)Nn(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,U.gold,12)}Ot(i,.29,.32,.045,[-.04,-.415,0],U.cream,[0,0,0]),Ze(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function n_(i){k(i,[1.02,1.48,.253],[.025,0,0],U.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;k(i,[1.02,.002,.001],[.025,.742,n],e%5?U.paper:U.rust,0),k(i,[.002,1.45,.001],[.537,0,n],e%4?U.paper:U.rust,0)}k(i,[1.15,1.58,.045],[0,0,.155],U.red,.015),k(i,[1.15,1.58,.045],[0,0,-.155],U.red,.015),k(i,[.095,1.57,.34],[-.56,0,0],U.red,.025),$n(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),fn(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])k(i,[.106,.015,.347],[-.556,e,0],U.red,.007);Ze(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new Rt({color:5724487,roughness:1});k(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),Ze(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function i_(i){be(i,.28,.055,[0,.41,0],U.gold),be(i,.219,.012,[0,.41,.034],U.copper),Ot(i,.046,.048,.92,[0,-.29,0],U.gold,[0,0,0],32),k(i,[.25,.09,.1],[.092,-.745,0],U.gold,.012),k(i,[.09,.1,.105],[.171,-.64,0],U.gold,.007),k(i,[.065,.17,.095],[.037,-.7,0],U.gold,.009),be(i,.34,.014,[0,.72,-.01],U.silver,[.23,0,.08]),be(i,.331,.009,[0,.72,-.018],U.silver,[.23,0,.08]),k(i,[.24,.34,.037],[.37,.34,-.03],U.leather,.028,[0,0,-.22]),Ze(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),be(i,.055,.012,[.33,.535,-.02],U.silver),Ze(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function s_(i){const t=new Li;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),ar(i,t,.055,U.gold,[0,0,-.03]);const e=t.clone();ar(i,e,.009,U.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),$n(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])Wi(i,[.014,.021,.002],[s,r,.044],U.gold);Nn(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,U.silver,14),Ot(i,.04,.04,.045,[-.23,.18,-.059],U.silver),Ze(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function r_(i){Ot(i,.83,.83,.022,[0,0,0],U.black,void 0,96);const t=fe((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,tn),s.stroke()},1024),e=fe((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,d=Math.hypot(c,h)||1,p=Math.sin(d*2.2)*.22,u=(o*r+l)*4;a.data[u]=128+127*p*c/d,a.data[u+1]=128+127*p*h/d,a.data[u+2]=253,a.data[u+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=gn;const n=new Rt({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new ft(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){Dt(new Yi(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new ie;i.add(r),r.rotation.y=s===1?0:Math.PI,Eo(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,tn),a.stroke(),fn(a,o,o,l,1500)}),Ot(r,.018,.018,.01,[0,0,.022],U.rubber)}}function a_(i){const t=new $s({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=_s(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new $s({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});Ot(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),Ot(i,.11,.11,.16,[0,.49,0],U.gold,[0,0,0]),lo(i,.112,.1,[0,.49,0],28,U.gold,"y"),_s(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),$n(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),fn(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function o_(i){k(i,[1.27,.08,.55],[0,-.72,0],U.bronze,.032),k(i,[1.35,.04,.61],[0,-.78,0],U.black,.02),Dt(hf([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],U.bronze),U.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;Nn(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,U.bronze),Wi(i,[.051,.057,.04],[e+s,-.43,n],U.bronze),k(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],U.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=_s(i,[[0,0],[.041,0],[.034,.1],[0,.18]],U.bronze,[.333,.525,e],16);n.rotation.z=.15,Wi(i,[.015,.015,.008],[.457,.49,t*.127],U.black),Wi(i,[.012,.01,.006],[.648,.404,t*.083],U.black)}for(let t=0;t<12;t++)Nn(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,U.bronze,10);Nn(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,U.bronze);for(let t=0;t<5;t++)Nn(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,U.gold,14);Nn(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,U.gold,16),Ze(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function l_(i){Ot(i,.51,.53,.145,[0,0,0],U.gold),be(i,.503,.018,[0,0,.075],U.gold),lo(i,.51,.072,[0,0,-.018],72,U.gold),Eo(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*tn/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*tn/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),fn(e,n,n,s,1800)});const t=new Li;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),ar(i,t,.007,U.red,[0,0,.103],[0,0,-.38],.001),ar(i,t,.007,U.silver,[0,0,.103],[0,0,Math.PI-.38],.001),Ot(i,.027,.027,.025,[0,0,.121],U.gold),nh(i,.468,.013,[0,0,.142]),be(i,.109,.025,[0,.635,0],U.gold),Ot(i,.059,.065,.092,[0,.523,0],U.gold,[0,0,0]),Ot(i,.465,.465,.02,[0,0,-.086],U.gold),Ze(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),Ze(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function c_(i){_s(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],U.glass);for(const n of[.817,.862])be(i,.116,.009,[0,n,0],U.glass,[Math.PI/2,0,0]);const t=fe((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),fn(n,s,a,r,2800)},768,460),e=new Rt({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:Be});Dt(new ke(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),Ze(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function h_(i){const t=U.silver.clone();t.roughness=.46,_s(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)be(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);Ot(i,.404,.404,.015,[0,-.347,0],U.rust,[0,0,0]);const e=new ie;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),Ot(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),be(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),be(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),k(e,[.067,.025,.11],[0,.028,.33],t,.015),$n(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),fn(n,s,r,a,2600)}),$n(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),fn(n,s,r,a,2400)},[0,Math.PI,0])}function u_(i){const t=fe((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),fn(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,tn),r.fill()},768,768),e=new Rt({map:t,roughness:.98,side:Be,bumpMap:U.paper.bumpMap,bumpScale:.009}),n=new ke(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),d=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+d,o,l*h)}n.computeVertexNormals(),Dt(n,e,i),be(i,.355,.016,[0,.44,0],U.paper,[Math.PI/2,0,0]),Ot(i,.232,.232,.015,[0,-.437,0],U.paper,[0,0,0]),Ot(i,.224,.224,.008,[0,-.421,0],U.rust,[0,0,0]),Nn(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,U.paper)}function d_(i){const t=fe((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);fn(s,r,r,a,3500)}),e=new Rt({map:t,roughness:.97,bumpMap:U.paper.bumpMap,bumpScale:.008,side:Be});k(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])k(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])k(i,[.029,.75,.8],[s,-.065,0],e,.006);k(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),k(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),k(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),k(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)Ot(i,.005,.005,.027,[s,.319,.399],U.paper,[0,0,0],6);$n(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);fn(s,r,a,o,1200)}),$n(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new Rt({color:11114860,roughness:.4,transparent:!0,opacity:.66});k(i,[.12,.74,.006],[.25,-.05,.421],n,.001),k(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function f_(i){Ot(i,.507,.507,.036,[0,0,0],U.rust,void 0,80),be(i,.504,.014,[0,0,.017],U.silver);for(const e of[.448,.408])be(i,e,.009,[0,0,.024],U.rust);const t=fi(77);for(let e=0;e<9;e++){const n=t()*tn,s=.465+t()*.015;Wi(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],U.silver)}for(let e=0;e<24;e++){const n=e*tn/24;k(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],U.rust,.007,[0,0,-n])}Ze(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function p_(i){const t=fe((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),fn(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,tn),n.fill()},1024,1280),e=new Rt({map:t,roughness:1,side:Be,bumpMap:U.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new de(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++)r.getX(a),r.getY(a),r.setZ(a,n*.004);s.computeVertexNormals(),Dt(s,e,i)}}const m_={camera:Kx,teacup:jx,watch:Qx,cassette:t_,duck:e_,book:n_,key:i_,badge:s_,record:r_,perfume:a_,horse:o_,compass:l_,bottle:c_,can:h_,cup:u_,box:d_,lid:f_,paper:p_};function g_(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===U.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new qt("#977145"),c=new qt("#355d53");for(let h=0;h<a.count;h++){const d=a.getX(h),p=a.getY(h),u=a.getZ(h),m=Math.sin(d*15+Math.sin(p*9))*Math.sin(p*19+u*12)*Math.cos(u*21-d*6),v=ne.clamp((m+.12)*.85,0,.8);l.clone().lerp(c,v).toArray(o,h*3)}s.setAttribute("color",new Ce(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=rf(s,!1);Dt(r,n,i),s.forEach(a=>a.dispose())}return e}function vl(i){const t=new ie;m_[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const d=new I().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);d.set(...$x(i,d.x,d.y,d.z)).applyMatrix4(c),l.setXYZ(h,d.x,d.y,d.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=g_(t),n=new Yn().setFromObject(t),s=n.getCenter(new I),r=n.getSize(new I);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new ie;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const Ba=fi(370);function v_(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function ih(i,t,e,n,s){const r=new de(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function On(i,t,e,n,s=[1,1,1],r=1){const a=Dt(new Mo(t,r),n,i,e);return a.scale.set(...s),a}function zn(i,t,e,n,s=[1,1,1],r=1){const a=Dt(new Mo(t,r),n,i,e);return a.scale.set(...s),a}function x_(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function Ao(i,t,e,n,s=24){return Dt(new Qe(new Tn(t.map(r=>new I(...r))),s,e,5,!1),n,i)}function __(){return fe((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(u,m,v,g,f)=>{i.fillStyle=f,i.fillRect(u,m,v,g)},c=(u,m,v,g,f)=>{i.fillStyle=f,i.beginPath(),i.ellipse(u,m,v,g,0,0,Math.PI*2),i.fill()},h=(u,m,v,g="rgba(255,198,106,")=>{const f=i.createRadialGradient(u,m,0,u,m,v);f.addColorStop(0,g+".62)"),f.addColorStop(1,g+"0)"),i.fillStyle=f,i.fillRect(u-v,m-v,v*2,v*2)},d=(u,m,v="#4b2d1e")=>{const g=i.createLinearGradient(0,0,0,r);g.addColorStop(0,u),g.addColorStop(1,m),i.fillStyle=g,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,v),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},p=(u,m)=>{i.save(),i.translate(u%4*s,Math.floor(u/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),m(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};p(0,()=>{d("#bd8745","#70452a"),l(16,58,122,316,"#382313");const u=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let m=0;m<5;m++){const v=78+m*58;l(22,v+38,110,6,"#20130b");let g=27;for(;g<124;){const f=5+e()*9;l(g,v+38-(24+e()*12),f,24+e()*12,u[Math.floor(e()*u.length)]),g+=f+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),p(1,()=>{d("#a8ad7d","#66704e","#40392a");for(let u=0;u<3;u++){const m=86+u*72;l(22,m,190,7,o);for(let v=0;v<6;v++){const g=34+v*31;l(g,m-(20+(v+u)%3*7),15,20+(v+u)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][v%4]),l(g+2,m-(27+(v+u)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const u of[62,112,168])i.beginPath(),i.moveTo(u,306),i.lineTo(u,326),i.stroke(),c(u,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),p(2,()=>{d("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),p(3,()=>{d("#8fae94","#55705e","#33473a");for(let u=0;u<3;u++){const m=120+u*104;l(18,m,220,8,"#2c2117");for(let v=0;v<4;v++){const g=42+v*54;l(g-13,m-25,26,25,"#8a5138");for(let f=0;f<6;f++){const x=-2.4+f*.45;c(g+Math.cos(x)*17,m-34+Math.sin(x)*19,11,5,f%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const u of[38,96,204]){i.beginPath(),i.moveTo(u,0),i.quadraticCurveTo(u+14,72,u-4,142),i.stroke();for(let m=0;m<6;m++)c(u+(m%2?9:-8),24+m*21,10,5,m%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),p(4,()=>{d("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const u of[48,112,190])l(u,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let u=0;u<4;u++)i.beginPath(),i.moveTo(100,292+u*6),i.lineTo(136,292+u*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),p(5,()=>{d("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let u=0;u<5;u++)l(26+u*15,410-u*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][u]);h(218,166,50)}),p(6,()=>{d("#8299a4","#4f6875","#31424b");const u=i.createLinearGradient(38,96,218,250);u.addColorStop(0,"#b9d5df"),u.addColorStop(.55,"#688b9c"),u.addColorStop(1,"#314f62"),i.fillStyle=u,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),p(7,()=>{d("#b49aa4","#76606d","#463945");for(let u=0;u<5;u++){l(24,78+u*8,70,4,"rgba(50,35,42,.45)");for(let m=0;m<4;m++)l(31+m*16,58+u*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][m])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function y_(){return fe((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,d,p="#2e342b",u="Georgia")=>{i.fillStyle=p,i.font=`bold ${d}px ${u}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const sn={};function Zn(){if(sn.stone)return sn;sn.stone=new Rt({color:7566439,roughness:.86,map:ja("plaster.jpg")}),sn.iron=new Rt({color:2633768,metalness:.72,roughness:.6}),sn.green=new Rt({color:4216121,roughness:.9,flatShading:!0,side:Be}),sn.shadowMap=fe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),sn.contact=new Ke({map:sn.shadowMap,transparent:!0,depthWrite:!1}),sn.wood=new Rt({color:7427130,roughness:.92}),sn.leafDark=new Rt({color:3099956,roughness:1,flatShading:!0}),sn.poster=new Rt({map:y_(),roughness:.96}),sn.bulb=new Rt({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=fe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);sn.glow=new Ke({map:i,color:16757350,transparent:!0,opacity:.42,blending:zr,depthWrite:!1,side:Be});const t=fe((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);sn.chalk=new Ke({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=fe((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return sn.chess=new Rt({map:e,roughness:.8}),sn}function M_(i,t,e=14,n=0){const s=new Ke({map:cf(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});Dt(new de(t,1.45),s,i,[0,.72,.342]);const r=fe((u,m,v)=>{u.fillStyle="#605d4c",u.fillRect(0,0,m,m);for(let g=0;g<12;g++)for(let f=-1;f<7;f++){const x=f*87+g%2*43,y=g*45;u.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(v()*4)],u.fillRect(x+3,y+3,81,39),u.fillStyle="rgba(28,29,21,.22)",u.fillRect(x+3,y+36,81,5)}u.globalCompositeOperation="destination-in",u.beginPath();for(let g=0;g<60;g++){const f=g*Math.PI/30,x=185+v()*60;u.lineTo(m/2+Math.cos(f)*x,m/2+Math.sin(f)*x*.7)}u.closePath(),u.fill()}),a=new Rt({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[u,m,v]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])Dt(new de(v*2,v),a,i,[u,m,.349]);const o=Zn();for(const[u,m,v]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])Dt(new de(.17,v),s,i,[u,m,.344]);let l=0;for(let u=-t/2+1.55;u<t/2-1.1;u+=2.85,l++){if(n===0&&Math.abs(u+3.8)<1.65)continue;const m=(l+n)%4===1;k(i,[.78,.48,.06],[u,.39,.425],m?pf:U.black,0),k(i,[.9,.07,.09],[u,.665,.44],o.stone,0),k(i,[.9,.06,.1],[u,.125,.45],o.stone,0);for(const g of[-.24,0,.24])k(i,[.02,.44,.02],[u+g,.39,.47],U.black,0);const v=u+1.42;if(v<t/2-.7){k(i,[.34,.24,.035],[v,.92,.342],U.black,0);for(let g=0;g<3;g++)k(i,[.28,.025,.012],[v,.86+g*.07,.365],U.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;Dt(ih(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=fi(910+n),d=[[-t/2+.58,0],[t/2-.58,2]];n===0&&d.push([-5.32,1]);for(const[u,m]of d)for(let v=0;v<30;v++){const g=.5+v*.17+h()*.09,f=u+Math.sin(v*.55+m)*.28+(h()-.5)*.2;Dt(new Yi(.055+h()*.08,7),v%3?o.leafDark:o.green,i,[f,g,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const u of[-t*.3,t*.24])k(i,[.78,.98,.78],[u,e+.48,-.05],o.stone,0),k(i,[.94,.13,.94],[u,e+1.02,-.05],o.stone,0),Ot(i,.09,.11,.24,[u-.16,e+1.19,-.05],U.rust,[0,0,0],10),Ot(i,.09,.11,.24,[u+.16,e+1.19,-.05],U.rust,[0,0,0],10);for(const u of[-t*.12,t*.36])Ot(i,.018,.018,1.42,[u,e+.76,.18],U.black,[0,0,0],8),k(i,[.88,.025,.025],[u,e+1.12,.18],U.black,0),k(i,[.58,.025,.025],[u,e+1.36,.18],U.black,0),k(i,[.025,.025,.72],[u,e+1.24,.18],U.black,0);const p=t*.16;Dt(new ke(.37,.09,.13,20),U.silver,i,[p,e-1.48,.56],[1.02,0,-.32]),Ao(i,[[p-.18,e-1.62,.34],[p,e-1.5,.58]],.016,U.black,4);for(let u=0;u<6;u++){if((u+n)%4===3)continue;const m=-t*.34+u*t*.13,v=e+.13;On(i,.058,[m,v,.48],o.stone,[1.45,.82,.9],0),zn(i,.032,[m+.065,v+.055,.49],U.black),k(i,[.11,.014,.035],[m-.085,v+.015,.47],U.black,0,[0,.2,.18])}}function uf(i,t,e,n,s,r,a,o){k(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),k(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])k(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),k(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);k(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],U.silver,0),k(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let ka;function S_(){if(ka)return ka;const i=fe((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=__(),e=fe((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return ka={curtain:new Rt({map:i,roughness:1,side:Be}),blind:new Rt({color:10067089,roughness:.9}),leaf:new Rt({color:4087359,roughness:1,flatShading:!0}),pot:new Rt({color:8414289,roughness:.94}),interior:new Rt({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new Rt({map:e,transparent:!0,alphaTest:.06,roughness:1,side:Be})},ka}function df(i,t,e=1,n=0,s=U.black){const r=new ie;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),On(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),zn(r,.086,[0,.325,.13],s);for(const a of[-1,1])Dt(new ke(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),Ot(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return Ao(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function ff(i,t,e,n,s,r,a,o,l=0){const c=S_(),h=Zn(),d=v_(l+811),p=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),u=(m=.574)=>{for(const v of[-1,1]){const g=new de(n*.27,s*.91,5,6),f=g.attributes.position;for(let x=0;x<f.count;x++)f.setZ(x,.008*Math.sin(f.getX(x)*80));g.computeVertexNormals(),Dt(g,c.curtain,i,[t+v*n*.34,e-.025,m]),k(i,[.035,.09,.025],[t+v*n*.24,e-.08,m+.018],U.gold,0)}Dt(new de(n*.96,s*.17),c.lace,i,[t,e+s*.39,m+.004])};if(r==="lit")Dt(ih(n*.97,s*.97,d%8,4,2),c.interior,i,[t,e,.566]),d%3===0&&u(.576),d%4===1&&(Ot(i,.006,.006,.34,[t+.18,e+s*.31,.59],U.black,[0,0,0],6),Ot(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),zn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")u();else if(r==="blind"){for(let m=0;m<12;m++)k(i,[n*.94,.04,.019],[t,e+s/2-.08-m*.093,.581],c.blind,0,m>8?[.32,0,0]:[0,0,0]);for(const m of[-1,1])k(i,[.012,s*.68,.012],[t+m*n*.39,e+s*.08,.594],U.black,0);k(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const m=new ie;m.position.set(t-n/2,e,.6),m.rotation.y=-.42,i.add(m),k(m,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const v of[0,n*.48])k(m,[.038,s*.94,.05],[v,0,.025],a,0);for(const v of[-s*.47,s*.47])k(m,[n*.5,.038,.05],[n*.24,v,.025],a,0);k(m,[n*.48,.032,.05],[n*.24,.23,.025],a,0),Ot(m,.014,.014,.1,[n*.45,-.05,.065],U.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&d%3===0){const m=t+(d%2?.29:-.29);Ot(i,.1,.075,.15,[m,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const v of[-1,0,1])On(i,.07,[m+v*.055,e-s/2+.17,.79],v?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&d%5===0&&df(i,[t-.17,e-s/2-.015,.8],.58,0,U.black),p>0&&p<3){if(d%9===2){k(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let m=0;m<6;m++)On(i,.07,[t-n*.31+m*n*.12,e-s/2+.17,.74],m%2?h.green:c.leaf,[1.2,.72,.8],0);for(let m=0;m<7;m++)On(i,.022,[t-n*.33+m*n*.105,e-s/2+.21,.78],m%3?U.red:U.cream,[1,1,1],0)}else if(d%11===5){k(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),Dt(new ke(.15,.15,.025,20),U.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const m of[-.1,0,.1])k(i,[.42,.018,.012],[t+.16,e-s/2-.39+m,.735],U.black,0);k(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],U.black,0)}else if(d%13===6)for(const m of[-1,1]){k(i,[.24,s*.9,.035],[t+m*(n/2+.18),e,.55],h.leafDark,0);for(let v=0;v<5;v++)k(i,[.18,.025,.014],[t+m*(n/2+.18),e-s*.3+v*s*.15,.575],U.black,0)}}if(p===0&&r!=="open"&&d%3===1){for(const m of[-.36,-.18,0,.18,.36])k(i,[.018,s*.85,.018],[t+m*n,e,.645],U.black,0);for(const m of[-s*.28,s*.28])k(i,[n*.84,.02,.02],[t,e+m,.65],U.black,0)}if(p>=2&&d%11===0){const m=t+n*.24,v=e-s/2+.025;On(i,.055,[m,v,.76],h.stone,[1.45,.82,.9],0),zn(i,.031,[m+.062,v+.052,.76],U.black),k(i,[.1,.013,.032],[m-.082,v+.012,.76],U.black,0,[0,.15,.16])}}function b_(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=Zn();Ot(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),be(i,.56,.015,[2.5,.033,2.5],U.rust,[Math.PI/2,0,0]),be(i,.62,.014,[2.5,.033,2.5],U.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;k(i,[h,.012,.018],[2.5,.04,2.5+c*.085],U.black,.003)}for(const c of[2.23,2.77])k(i,[.05,.01,.11],[c,.049,2.5],U.black,.005);for(const c of[-4.55,4.55]){k(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),Ot(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),Ot(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),zn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new ro(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}k(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)k(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new Tn([new I(-6,5.3,-6.5),new I(-1,4.96,-6.47),new I(4.2,5.31,-6.46)]);Dt(new Qe(o,24,.011,5),U.rubber,i);const l=fe((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[d,p]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(p,h/2,165+d*41);c.strokeStyle="#555b4d";for(let d=28;d<h;d+=43)c.beginPath(),c.moveTo(d,h-90),c.lineTo(d,h),c.stroke()});Dt(new de(.42,.56),new Rt({map:l,roughness:.95,side:Be}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,d,p]of[...ef.map(u=>[u.x,u.z,u.scale*3.5,u.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])Dt(new de(d,p),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+Ba()*1.3,d=-6+Ba()*6,p=.03+Ba()*.13,u=new Li;u.moveTo(-.012,0),u.quadraticCurveTo(.014,p*.7,.025,p),u.lineTo(.006,0),Dt(new bo(u),s,i,[h,.025,d],[0,Ba()*6,0])}A_(i)}function Pu(i,t,e){const n=Zn(),s=new ie;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])k(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])k(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])k(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),k(s,[.055,.04,.56],[r*.84,.67,0],U.rust,0),k(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function Ha(i,t,e,n,s){const r=Zn(),a=new ie,o=fi(s);a.position.set(...t),a.rotation.y=e,i.add(a),k(a,[n,.1,.78],[0,.05,0],U.rust,0);for(const c of[-1,1]){k(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),k(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)k(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,d=(o()-.5)*.42,p=c%3?r.leafDark:r.green;On(a,.15+o()*.15,[h,.19+o()*.08,d],p,[1.45,.58,.95],0),On(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,d+(o()-.5)*.18],p,[1.3,.62,.9],0),On(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,d+(o()-.5)*.16],p,[1.2,.6,.9],0)}for(let c=0;c<18;c++)On(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[U.red,U.cream,U.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)Dt(new ke(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function w_(i,t,e,n,s=9){const r=Zn();Ao(i,x_(t,e,n,7),.007,U.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;k(i,[.006,.07,.006],[l,c-.035,h],U.black,0),zn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function Ga(i,t,e,n,s){const r=Zn();k(i,[.07,.36,.13],[t,e,n],r.iron,.01),Ot(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),Ot(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),zn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),Dt(new de(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function T_(i,t,e,n=1){const s=Zn(),r=new ie;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),On(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),zn(r,.037,[0,.135,.085],U.black),Dt(new ke(.001,.011,.038,5),U.gold,r,[0,.13,.128],[Math.PI/2,0,0]),k(r,[.075,.014,.1],[0,.075,-.105],U.black,0,[.22,0,0]);for(const a of[-1,1])k(r,[.008,.055,.008],[a*.025,.028,.01],U.rust,0);return r}function E_(i,t,e){const n=Zn(),s=new ie;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])k(s,[1.08,.026,.105],[0,a+.055,o],r%2?U.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])k(s,[.1,.085,.1],[o,a,l],U.rust,0)}return k(s,[.58,.38,.48],[.05,.72,0],U.paper,.01,[0,.12,0]),s}function A_(i){const t=Zn();Pu(i,[-5.45,0,-.75],Math.PI/2),Pu(i,[5.7,0,-5.25],0),Ha(i,[-7.02,0,1.95],Math.PI/2,4.8,21),Ha(i,[8.02,0,1.75],Math.PI/2,4.3,33),Ha(i,[5.95,0,-6.08],0,3.5,47),Ha(i,[-6.35,0,-6.08],0,2.1,58),w_(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),Ga(i,-7.62,2.75,-4.9,1),Ga(i,-7.62,2.75,3.8,1),Ga(i,8.62,2.75,-4.9,-1),Ga(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;k(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),k(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}Ot(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),k(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),Dt(new de(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])Ot(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),Ot(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)zn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?U.black:U.cream,[1,.75,1],0);E_(i,[-6.5,0,-4.9],.15);const e=new ie;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),k(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])k(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],U.rust,0);zn(e,.035,[.075,1.02,.34],U.silver);for(let a=0;a<3;a++)Dt(new $i(.34,.105,8,26),U.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);Dt(new $i(.34,.105,8,26),U.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new ie;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),k(n,[.62,.58,1.72],[0,.58,0],U.leather,.18),k(n,[.54,.46,1],[0,1.02,-.12],U.leather,.19),k(n,[.5,.34,.46],[0,1.04,.58],U.leather,.16);for(const a of[-.42,.22])k(n,[.65,.018,.035],[0,.84,a],U.black,0);for(const a of[-.58,.58])Dt(new ke(.29,.29,.09,20),U.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new ie;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),k(s,[.1,.035,.6],[0,.1,0],U.red,.01);for(const a of[-.25,.25])Dt(new ke(.075,.075,.035,14),U.black,s,[0,.075,a],[0,0,Math.PI/2]);Ao(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,U.silver,8),k(s,[.36,.025,.025],[0,.78,.4],U.black,0),Dt(new de(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),zn(i,.16,[-4.72,.16,1.85],U.red,[1,.92,1]),df(i,[-4.32,0,-.22],1,1.49,U.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>T_(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)On(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],U.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const d=Dt(new de(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);d.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])Dt(new de(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const pf=new Rt({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function R_(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])Ot(i,.027,.027,.016,[o,l,.854],U.silver,void 0,8),k(i,[.016,.003,.005],[o,l,.866],U.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=Wi(i,[.013,.035,.007],[o*1.155,l,.827],U.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])k(i,[.21,.06,.3],[o,.42,.6],U.silver,.018),k(i,[.075,.025,.21],[o,.305,.81],U.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){k(t,[.2,.032,.2],[o,.114,.12],U.silver,.008);for(const l of[-.065,.065])Ot(t,.022,.022,.012,[o+l,.139,.12],U.silver,[0,0,0],8)}const n=new Rt({color:1055507,roughness:.94});k(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=fe((o,l,c)=>{for(let h=0;h<1800;h++){const d=c(),p=c();d>.1&&d<.9&&p<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(d*l,p*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const d=o.createLinearGradient(0,0,0,l);d.addColorStop(0,"rgba(67,42,24,0)"),d.addColorStop(.5,"rgba(67,42,24,.35)"),d.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=d,o.fillRect(h*l,0,6,l)}}),r=new Rt({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});Dt(new de(2.35,1.43),r,i,[0,1.18,.876]),Dt(new de(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])k(t,[.025,.006,.48],[o,.114,1.6],U.silver,.002);const a=fe((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});Dt(new de(.42,.37),new Rt({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const C_=new Rt({color:3883064,roughness:.82});function P_(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const d=Zn(),p=fi(c*7+13),u=1.55,m=2.55,v=u,g=m+v,f=new Li;f.moveTo(-t/2,0),f.lineTo(t/2,0),f.lineTo(t/2,e),f.lineTo(-t/2,e),f.closePath();const x=new so;x.moveTo(h-u,0),x.lineTo(h-u,m),x.absarc(h,m,v,Math.PI,0,!0),x.lineTo(h+u,0),x.closePath(),f.holes.push(x),Dt(new yo(f,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[L,N]of[[-t/2,h-u-.12],[h+u+.12,t/2]])k(i,[N-L,.75,.78],[(L+N)/2,.375,.025],n,0);for(const L of[3.28,6.2,9.15])for(const[N,O]of[[-t/2,h-u-.12],[h+u+.12,t/2]]){const F=O-N;F<.5||(k(i,[F,.14,.87],[(N+O)/2,L,.055],s,0),k(i,[F,.07,.98],[(N+O)/2,L+.09,.08],n,0))}k(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const L of[-1,1])k(i,[.36,m+.05,.62],[h+L*(u+.18),m/2,.06],n,.02);const _=new Wr(0,0,v+.2,v+.2,0,Math.PI,!1,0).getPoints(30).map(L=>new I(L.x,L.y,0));Dt(new Qe(new Tn(_),30,.17,7,!1),n,i,[h,m,.06]),k(i,[.26,.62,.72],[h,g+.16,.09],n,.02);for(let L=1;L<7;L++){const N=Math.PI*L/7,O=Math.cos(N)*(v+.2),F=Math.sin(N)*(v+.2);k(i,[.17,.3,.52],[h+O,m+F,.03],n,.012,[0,0,-N+Math.PI/2])}const T=new Rt({color:1909020,roughness:.96});k(i,[u*2+.6,.06,3.6],[h,0,-1.85],n,0),k(i,[.24,4.6,3.6],[h-u-.32,2.3,-1.85],T,0),k(i,[.24,4.6,3.6],[h+u+.32,2.3,-1.85],T,0),k(i,[3.4,.2,3.6],[h,g+.62,-1.85],n,0),k(i,[3.4,4.8,.12],[h,2.4,-3.7],T,0);const b=fe((L,N)=>{const O=L.createLinearGradient(0,0,0,N);O.addColorStop(0,"rgba(52,60,58,1)"),O.addColorStop(.42,"rgba(85,74,54,1)"),O.addColorStop(1,"rgba(34,38,34,1)"),L.fillStyle=O,L.fillRect(0,0,N,N);const F=L.createRadialGradient(N*.5,N*.3,0,N*.5,N*.3,N*.46);F.addColorStop(0,"rgba(255,198,118,.95)"),F.addColorStop(.45,"rgba(255,174,92,.38)"),F.addColorStop(1,"rgba(255,160,80,0)"),L.fillStyle=F,L.fillRect(0,0,N,N)});Dt(new de(3.2,4.6),new Ke({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),Dt(new de(3,4.2),new Ke({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),k(i,[1.1,.4,.36],[h-.55,2.1,-2.1],T,0),k(i,[.5,.9,.3],[h+.7,.28,-2.2],T,0);const w=(L,N=0)=>{const O=new ie,F=u-.06,H=m-.1;O.position.set(h+L*(u-.02),0,.02),O.rotation.y=L*N,i.add(O);const B=-L*F/2;for(const G of[.07,H])k(O,[F,.1,.09],[B,G,0],U.black,.012);for(const G of[B-F/2+.045,B+F/2-.045])k(O,[.09,H,.09],[G,H/2,0],U.black,.012);const X=.92;k(O,[F-.12,X,.07],[B,X/2+.1,0],C_,.01);for(let G=0;G<3;G++)k(O,[F-.18,.03,.09],[B,X*(G+.5)/3+.1,.012],U.rust,0);for(let G=B-F/2+.14;G<B+F/2-.1;G+=.17)k(O,[.03,H-X-.24,.03],[G,X+.12+(H-X-.24)/2,.012],U.black,0);for(const G of[H-.12,2.02,X+.32])k(O,[F-.14,.05,.055],[B,G,.012],U.black,0);for(const G of[.42,.95])Ot(O,.035,.035,.09,[B+L*(F/2-.02),G,0],U.black,[0,0,0],10);return be(O,.1,.013,[B,H*.8,.02],U.black),O};w(-1,.3),w(1,0);for(let L=-3;L<=3;L++){const N=h+L*.42,O=Math.sqrt(Math.max(0,v*v-N*N)),F=m+O*.96,H=m-.1;F-H<.12||k(i,[.028,F-H,.028],[N,(F+H)/2,.055],U.black,0)}const M=new Wr(0,0,v-.02,v-.02,0,Math.PI,!1,0).getPoints(20).map(L=>new I(L.x,L.y,0));Dt(new Qe(new Tn(M),20,.03,5,!1),U.black,i,[h,m,.055]);for(let L=0;L<5;L++){const N=Math.PI*(L+1)/6;k(i,[.05,.05,.05],[h+Math.cos(N)*(v-.02),m+Math.sin(N)*(v-.02),.075],U.black,0)}Ot(i,.02,.02,.5,[h,g+.9,.36],U.black,[0,0,0],8),Ot(i,.11,.2,.14,[h,g+.5,.36],U.black,[0,0,0],14),zn(i,.082,[h,g+.4,.36],d.bulb,[1,1.45,1],0),Dt(new de(1.5,1.5),d.glow,i,[h,g+.36,.5]);const S=new Rt({map:vc("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});k(i,[.62,.46,.06],[h+2.3,2.35,.35],U.black,0),Dt(new de(.57,.41),S,i,[h+2.3,2.35,.39]);const R=Math.floor(t/2.47);for(let L=0;L<R;L++)for(let N=0;N<4;N++){const O=(L-(R-1)/2)*2.47,F=1.72+N*2.95;if(Math.abs(O-h)<3.3&&N<2)continue;const H=1.16,B=1.91,X=300+N*10+L;k(i,[H+.26,B+.27,.14],[O,F,.38],s,0),k(i,[H+.05,B+.06,.1],[O,F,.47],r,0);const G=nf(L,N,2),Q=G==="lit"?l:o[(L+N)%o.length];k(i,[H,B,.04],[O,F,.54],Q,0);for(const rt of[-H/2,H/2,0])k(i,[.048,B,.09],[O+rt,F,.58],n,0);for(const rt of[-B/2,B/2,.24])k(i,[H,.047,.09],[O,F+rt,.58],n,0);k(i,[H+.4,.12,.43],[O,F-B/2-.09,.55],s,0),uf(i,O,F,H,B,n,r,s),N>=1&&ff(i,O,F,H,B,G,s,Q,X)}for(const L of[-t/2+.35,t/2-.38]){Ot(i,.07,.07,e,[L,e/2,.53],r,[0,0,0],12);for(let N=1;N<e;N+=2)Ot(i,.087,.087,.055,[L,N,.53],U.rust,[0,0,0],12)}const D=new Ke({map:cf(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[L,N]of[[-t/2,h-u-.5],[h+u+.5,t/2]].filter(([O,F])=>F-O>1))Dt(new de(N-L,.9),D,i,[(L+N)/2,.55,.345]);Dt(ih(.48,.64,c%4,2,2),d.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let L=0;L<22;L++){const N=L<11?-t/2+.55:t/2-.55,O=N+Math.sin(L*.55)*.26+(p()-.5)*.2;Dt(new Yi(.05+p()*.075,7),L%3?d.leafDark:d.green,i,[O,.5+L*.17,.355+p()*.04],[0,0,p()*Math.PI])}for(const L of[-t*.32,t*.3])k(i,[.78,.98,.78],[L,e+.48,-.05],n,0),k(i,[.94,.13,.94],[L,e+1.02,-.05],n,0),Ot(i,.09,.11,.24,[L-.16,e+1.19,-.05],U.rust,[0,0,0],10),Ot(i,.09,.11,.24,[L+.16,e+1.19,-.05],U.rust,[0,0,0],10);return Ot(i,.018,.018,1.42,[t*.12,e+.76,.18],U.black,[0,0,0],8),k(i,[.88,.025,.025],[t*.12,e+1.12,.18],U.black,0),k(i,[.58,.025,.025],[t*.12,e+1.36,.18],U.black,0),i}function Iu(i,t,e,n,s){k(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),k(i,[t+.1,.08,1.28],[0,e+.36,.34],Cr(s),0),Dt(new An(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),k(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])k(i,[.16,.2,.16],[r,e+.62,.95],U.rust,0)}function Cr(i){return Cr.mat||(Cr.mat=i.clone(),Cr.mat.color.offsetHSL(0,-.03,.04)),Cr.mat}function I_(){const i=new ie;i.name="sky";const t=new Ne(55,32,18),e=[],n=new qt("#6a5142"),s=new qt("#253a55"),r=new qt("#08111f");for(let w=0;w<t.attributes.position.count;w++){const E=ne.smoothstep(t.attributes.position.getY(w)/55,-.04,.62);(E<.4?n.clone().lerp(s,E/.4):s.clone().lerp(r,(E-.4)/.6)).toArray(e,w*3)}t.setAttribute("color",new he(e,3));const a=new Ft(t,new Ke({vertexColors:!0,side:an,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=fe((w,E)=>{const M=w.createRadialGradient(E/2,E/2,0,E/2,E/2,E/2);M.addColorStop(0,"rgba(255,255,255,1)"),M.addColorStop(.34,"rgba(255,255,255,.86)"),M.addColorStop(.62,"rgba(255,255,255,.22)"),M.addColorStop(1,"rgba(255,255,255,0)"),w.fillStyle=M,w.fillRect(0,0,E,E)},64),l=fi(20261),c=105,h=[],d=[],p=new qt("#e6efff"),u=new qt("#ffe8c6"),m=new qt("#bcd3ff");for(let w=0;w<c;w++){const E=l()*Math.PI*2,M=.9+Math.pow(l(),.65)*.58,S=49+l()*3,R=Math.cos(M);h.push(Math.sin(E)*R*S,Math.sin(M)*S,-Math.cos(E)*R*S);const D=l(),L=(D>.72?u:D>.34?p:m).clone(),N=ne.clamp((M-.9)/.25,0,1),O=(.55+Math.pow(l(),1.4)*.45)*N;d.push(L.r*O,L.g*O,L.b*O)}const v=new Ae;v.setAttribute("position",new he(h,3)),v.setAttribute("color",new he(d,3));const g=new ip(v,new Od({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:zr,fog:!1,toneMapped:!1,alphaTest:.01}));g.renderOrder=-20,g.frustumCulled=!1,g.name="sky-stars",i.add(g);const f=new I(-.16,.883,-.442).normalize(),x=f.clone().multiplyScalar(44),y=fe((w,E,M)=>{const S=E*.47,R=E/2,D=E/2;w.clearRect(0,0,E,E);const L=w.createRadialGradient(R-S*.22,D-S*.26,S*.06,R,D,S);L.addColorStop(0,"#fbfcf7"),L.addColorStop(.62,"#e6e9ee"),L.addColorStop(.9,"#cfd5e0"),L.addColorStop(1,"#b9c1cf"),w.fillStyle=L,w.beginPath(),w.arc(R,D,S,0,Math.PI*2),w.fill(),w.save(),w.beginPath(),w.arc(R,D,S,0,Math.PI*2),w.clip();for(let O=0;O<26;O++){const F=M()*Math.PI*2,H=Math.sqrt(M())*S*.92,B=R+Math.cos(F)*H,X=D+Math.sin(F)*H,G=S*(.03+M()*.13),Q=w.createRadialGradient(B,X,0,B,X,G);Q.addColorStop(0,`rgba(132,142,160,${.1+M()*.17})`),Q.addColorStop(1,"rgba(132,142,160,0)"),w.fillStyle=Q,w.beginPath(),w.arc(B,X,G,0,Math.PI*2),w.fill()}for(let O=0;O<5;O++){const F=M()*Math.PI*2,H=Math.sqrt(M())*S*.62,B=R+Math.cos(F)*H,X=D+Math.sin(F)*H,G=S*(.16+M()*.16),Q=w.createRadialGradient(B,X,0,B,X,G);Q.addColorStop(0,"rgba(150,158,174,.16)"),Q.addColorStop(1,"rgba(150,158,174,0)"),w.fillStyle=Q,w.beginPath(),w.arc(B,X,G,0,Math.PI*2),w.fill()}const N=w.createRadialGradient(R,D,S*.2,R,D,S);N.addColorStop(0,"rgba(255,255,255,0)"),N.addColorStop(.78,"rgba(150,162,186,.13)"),N.addColorStop(1,"rgba(96,110,138,.42)"),w.fillStyle=N,w.beginPath(),w.arc(R,D,S,0,Math.PI*2),w.fill(),w.restore()},256);y.colorSpace=Ye;const _=new Fh(new hc({map:y,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));_.position.copy(x),_.scale.set(2.25,2.25,1),_.name="sky-moon",i.add(_);const T=fe((w,E)=>{const M=w.createRadialGradient(E/2,E/2,0,E/2,E/2,E/2);M.addColorStop(0,"rgba(226,236,255,.9)"),M.addColorStop(.22,"rgba(198,216,255,.34)"),M.addColorStop(.5,"rgba(170,196,255,.10)"),M.addColorStop(1,"rgba(150,180,255,0)"),w.fillStyle=M,w.fillRect(0,0,E,E)},128),b=new Fh(new hc({map:T,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:zr,fog:!1,toneMapped:!1}));return b.position.copy(x).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:g,moon:_,glow:b,moonDirection:f.clone(),update(){}}}const Hi=Math.PI/180;function br(i,t,e,n=1,s=1,r=!0){const a=new Uint8Array(i*t*4);for(let l=0;l<t;l++)for(let c=0;c<i;c++){const h=(l*i+c)*4,[d,p,u]=e(c,l,i,t);a[h]=d,a[h+1]=p,a[h+2]=u,a[h+3]=255}const o=new Wc(a,i,t,Fn);return o.wrapS=li,o.wrapT=li,o.repeat.set(n,s),o.colorSpace=r?Ye:gn,o.needsUpdate=!0,o}function Ws(i,t){const e=Math.imul(i*374761393+t*668265263,1274126177)>>>0;return((e^e>>>13)>>>0)/4294967295}function L_(){const i=br(64,64,(r,a)=>{const o=r>>3&1?r+a:r-a+64,l=Math.sin(o%8*Math.PI*.25)*26,c=(Ws(r,a)-.5)*28,h=Math.max(0,Math.min(255,Math.round(128+l+c)));return[h,h,h]},7,9,!1),t=br(64,64,(r,a)=>{const o=(Ws(r,a)-.5)*42+(Ws(r>>1,a>>1)-.5)*22,l=Math.max(0,Math.min(255,Math.round(128+o)));return[l,l,l]},5,5,!1),e=br(64,64,(r,a)=>{const o=Math.sin(r/64*Math.PI*16)*46,l=Math.sin(a/64*Math.PI*24+(r>>1&1)*1.2)*22,c=Math.max(0,Math.min(255,Math.round(128+o+l)));return[c,c,c]},4,4,!1),n=br(64,64,(r,a)=>{const o=Math.sin(r/64*Math.PI*28)*34,l=(Ws(r,a)-.5)*18,c=Math.max(0,Math.min(255,Math.round(128+o+l)));return[c,c,c]},6,8,!1),s=br(64,64,(r,a)=>{const o=Ws(r,a),l=Ws(r+3>>1,a+5>>1),c=Math.max(0,Math.min(255,Math.round(118+(o-.5)*34+(l-.5)*38)));return[c,c,c]},4,4,!1);return{woolBump:i,suedeBump:t,knitBump:e,trouserBump:n,bootBump:s}}function jn(i,t){const e=i.index?i.toNonIndexed():i.clone();return e.applyMatrix4(t),e.getAttribute("normal")||e.computeVertexNormals(),i.dispose(),e}function Ys(i){const t=i.index?i.toNonIndexed():i.clone(),e=t.getAttribute("position").array;for(let s=0;s<e.length;s+=3)e[s]=-e[s];for(let s=0;s<e.length;s+=9)for(let r=0;r<3;r++){const a=e[s+3+r];e[s+3+r]=e[s+6+r],e[s+6+r]=a}const n=t.getAttribute("uv");if(n){const s=n.array;for(let r=0;r<s.length;r+=6){const a=s[r+2],o=s[r+3];s[r+2]=s[r+4],s[r+3]=s[r+5],s[r+4]=a,s[r+5]=o}}return t.computeVertexNormals(),t}function Ri(i){const t=i.map(l=>{const c=l.index?l.toNonIndexed():l.clone();return c.getAttribute("normal")||c.computeVertexNormals(),l.dispose(),c});let e=0;for(const l of t)e+=l.getAttribute("position").count;const n=new Float32Array(e*3),s=new Float32Array(e*3),r=new Float32Array(e*2);let a=0;for(const l of t){const c=l.getAttribute("position"),h=l.getAttribute("normal"),d=l.getAttribute("uv");if(n.set(c.array,a*3),s.set(h.array,a*3),d&&d.itemSize>=2)for(let p=0;p<c.count;p++)r[(a+p)*2]=d.getX(p),r[(a+p)*2+1]=d.getY(p);a+=c.count,l.dispose()}const o=new Ae;return o.setAttribute("position",new Ce(n,3)),o.setAttribute("normal",new Ce(s,3)),o.setAttribute("uv",new Ce(r,2)),o.computeBoundingSphere(),o}function ys(i,t=24,{capStart:e=!1,capEnd:n=!1}={}){const s=i.length,r=t+1,a=(e?1:0)+(n?1:0),o=new Float32Array((s*r+a)*3),l=new Float32Array((s*r+a)*2),c=[];for(let X=0;X<s;X++){const G=X/Math.max(1,s-1),Q=i[X];for(let rt=0;rt<=t;rt++){const pt=rt/t,zt=pt*Math.PI*2,[Ct,$,nt]=Q(zt,pt),mt=(X*r+rt)*3,xt=(X*r+rt)*2;o[mt]=Ct,o[mt+1]=$,o[mt+2]=nt,l[xt]=pt,l[xt+1]=G}}let h=0,d=0,p=0,u=0;for(let X=0;X<Math.min(2,s);X++)for(let G=0;G<t;G++){const Q=(X*r+G)*3;h+=o[Q],d+=o[Q+1],p+=o[Q+2],u++}h/=Math.max(1,u),d/=Math.max(1,u),p/=Math.max(1,u);const m=o[0],v=o[1],g=o[2],f=o[3],x=o[4],y=o[5],_=o[r*3],T=o[r*3+1],b=o[r*3+2],w=_-m,E=T-v,M=b-g,S=f-m,R=x-v,D=y-g,L=E*D-M*R,N=M*S-w*D,O=w*R-E*S,F=L*(m-h)+N*(v-d)+O*(g-p)<0;for(let X=0;X<s-1;X++)for(let G=0;G<t;G++){const Q=X*r+G,rt=Q+1,pt=(X+1)*r+G,zt=pt+1;F?c.push(Q,rt,pt,rt,zt,pt):c.push(Q,pt,rt,rt,pt,zt)}let H=s*r;if(e){let X=0,G=0,Q=0;for(let rt=0;rt<t;rt++)X+=o[rt*3],G+=o[rt*3+1],Q+=o[rt*3+2];o[H*3]=X/t,o[H*3+1]=G/t,o[H*3+2]=Q/t,l[H*2]=.5,l[H*2+1]=0;for(let rt=0;rt<t;rt++)F?c.push(H,rt+1,rt):c.push(H,rt,rt+1);H++}if(n){const X=(s-1)*r;let G=0,Q=0,rt=0;for(let pt=0;pt<t;pt++)G+=o[(X+pt)*3],Q+=o[(X+pt)*3+1],rt+=o[(X+pt)*3+2];o[H*3]=G/t,o[H*3+1]=Q/t,o[H*3+2]=rt/t,l[H*2]=.5,l[H*2+1]=1;for(let pt=0;pt<t;pt++)F?c.push(H,X+pt,X+pt+1):c.push(H,X+pt+1,X+pt)}const B=new Ae;return B.setAttribute("position",new Ce(o,3)),B.setAttribute("uv",new Ce(l,2)),B.setIndex(c),B.computeVertexNormals(),B}function Lu(i=1){const t=new Ne(1,26,20),e=t.attributes.position,n=[-.031,-.01,.011,.03];for(let s=0;s<e.count;s++){const r=e.getX(s),a=e.getY(s),o=e.getZ(s),l=Math.sign(r)*Math.pow(Math.abs(r),.75),c=Math.sign(a)*Math.pow(Math.abs(a),.83),h=Math.sign(o)*Math.pow(Math.abs(o),.78),d=ne.clamp((-h+1)*.5,0,1),p=r>0?Math.pow(r,2)*(1-d)*.0035:0,u=.0345+d*.0115-Math.pow(d-.83,2)*.0085-p,m=.0158-d*.003;let v=l*u,g=c*m,f=-.049+h*.0525;if(d>.55&&v>.005&&(f+=v/.044*(d-.55)*.012),g+=(1-r*r)*.0048,a>.05){let x=0,y=0;for(let _=0;_<4;_++){const T=n[_],b=-.088+(_===3?.006:_===1?-.003:0),w=Math.pow((v-T)/.0105,2)+Math.pow((f-b)/.013,2);if(x+=Math.exp(-w)*(_===1?.0032:.0026),f>-.086&&f<-.014){const E=T*(.45+.55*((-f-.014)/.072)),M=Math.pow((v-E)/.0046,2);y+=Math.exp(-M)*95e-5*Math.sin(ne.clamp((-f-.012)/.074,0,1)*Math.PI)}}g+=(x+y)*a}else if(a<-.05){const x=(1-r*r)*Math.sin(d*Math.PI)*.0032,y=f+.062-v*.18,_=Math.exp(-Math.pow(y/.0045,2))*(1-r*r*.6)*.0016,T=d<.22?Math.exp(-Math.pow(v/.0065,2))*(.22-d)*.01:0;g+=x+_+T}e.setXYZ(s,v,g,f)}if(i<0){const s=Ys(t);return t.dispose(),s}return t.computeVertexNormals(),t}function Xs(i,t,e){const n=[];for(let r=0;r<=7;r++){const a=r/7,o=1-Math.sin(a*Math.PI)*.055,l=Math.exp(-Math.pow((a-.14)/.045,2))*.045+Math.exp(-Math.pow((a-.27)/.045,2))*.03,c=ne.lerp(i,t,a)*o,h=-a*e;n.push(d=>{const p=Math.cos(d),u=Math.sin(d),m=c*(1.03+(u<0?.03:0));let v=c*(u>=0?.9+l:.96);const g=u<0?Math.sin(a*Math.PI)*c*.09*-u:0;return[p*m,u*v-g,h]})}return ys(n,12)}function Du(i,t){const e=[];for(let s=0;s<=8;s++){const r=s/8,a=ne.lerp(i,t,r),o=Math.sin(r*Math.PI)*.0032,l=r-.5;e.push(c=>{const h=Math.cos(c),d=Math.sin(c),p=Math.exp(-Math.pow((c-0)/.16,2))*.0014,u=(a+o+p)*.97,m=(a+o*1.35)*.84,v=d<0?d*o*.8:0;return[h*u,l,d*m+v]})}return ys(e,16)}function D_(){const i=[{y:-.28,hw:.078,hd:.052,cz:.048,split:0},{y:-.31,hw:.212,hd:.074,cz:.006,split:0},{y:-.39,hw:.214,hd:.092,cz:-.032,split:0},{y:-.49,hw:.198,hd:.104,cz:-.068,split:0},{y:-.6,hw:.19,hd:.11,cz:-.098,split:0},{y:-.71,hw:.194,hd:.114,cz:-.122,split:.035},{y:-.81,hw:.2,hd:.116,cz:-.142,split:.075},{y:-.895,hw:.206,hd:.118,cz:-.156,split:.115}],t=[],e=18;for(let n=0;n<=e;n++){const s=n/e*(i.length-1),r=Math.min(i.length-2,Math.floor(s)),a=s-r,o=i[r],l=i[r+1],c=ne.lerp(o.y,l.y,a),h=ne.lerp(o.hw,l.hw,a),d=ne.lerp(o.hd,l.hd,a),p=ne.lerp(o.cz,l.cz,a),u=ne.lerp(o.split,l.split,a),m=ne.clamp((-c-.6)/.28,0,1);t.push(v=>{const g=Math.cos(v),f=Math.sin(v),x=Math.sign(g)*Math.pow(Math.abs(g),.84),y=Math.sign(f)*Math.pow(Math.abs(f),.86),_=m*Math.sin(v*6)*.0055;let T=x*(h+_),b=p+y*(d+_*.8);if(f<-.55&&m<.35){const w=g>-.18&&g<.35?-.0055:0;b+=w}if(u>.001&&f<-.55&&Math.abs(T)<u){const w=(1-Math.abs(T)/u)*u*.72;b+=w}return[T,c,b]})}return ys(t,30,{capStart:!0,capEnd:!0})}function U_(){const t=new Tn([new I(.054,-.298,-.052),new I(.102,-.34,-.098),new I(.116,-.41,-.136),new I(.086,-.495,-.172),new I(.038,-.58,-.202)]).getPoints(14),e=t.map((n,s)=>{const r=s/(t.length-1),a=.018+Math.sin(r*Math.PI*.88)*.024,o=.007;return l=>{const c=Math.cos(l),h=Math.sin(l);return[n.x+c*a,n.y+h*o*.55,n.z-Math.abs(c)*.003-.005+h*o]}});return ys(e,12,{capStart:!0,capEnd:!0})}function N_(){const i=[],t=new Tn([new I(-.042,-.398,-.132),new I(-.07,-.33,-.088),new I(-.058,-.292,-.03),new I(0,-.284,.008),new I(.058,-.292,-.03),new I(.07,-.33,-.088),new I(.04,-.404,-.136)]);i.push(new Qe(t,28,.014,12,!1));const e=new Tn([new I(.036,-.352,-.106),new I(.005,-.425,-.146),new I(-.015,-.495,-.176)]),n=new Qe(e,14,.02,12,!1);n.scale(1.24,1,.4),i.push(n);const s=new Tn([new I(-.036,-.356,-.102),new I(.01,-.432,-.142),new I(.02,-.5,-.172)]),r=new Qe(s,12,.018,12,!1);return r.scale(1.18,1,.38),i.push(r),Ri(i)}function Uu(i=.012,t=-7.5*Hi){const e=[];for(let s=0;s<=16;s++){const r=s/16,a=ne.lerp(-.81,-1.445,r),o=Math.sin(r*Math.PI)*.028,l=ne.lerp(.104,.128,r),c=ne.lerp(-.225,-.565,r)-o+i,h=r>.88,d=ne.lerp(.076,.056,r)+(h?.0058:0),p=ne.lerp(.082,.064,r)+(h?.0062:0),u=Math.exp(-Math.pow((r-.52)/.09,2)),m=Math.exp(-Math.pow((r-.85)/.06,2));e.push(v=>{const g=Math.cos(v),f=Math.sin(v),x=f<-.65?Math.pow((-f-.65)/.35,1.45)*.012:0,y=f>.75?Math.pow((f-.75)/.25,1.6)*.005:0,_=u*Math.sin(r*55+g*2.5)*.0032+m*Math.cos(r*70)*.0028,T=g*(d+_),b=f*(p+_)-x+y,w=t*r,E=T*Math.cos(w)-b*Math.sin(w),M=T*Math.sin(w)+b*Math.cos(w);return[l+E,a,c+M]})}return ys(e,18,{capStart:!0,capEnd:!0})}function Nu(i=.012,t=-7.5*Hi){const n=-.565+i,s=new $t().makeRotationY(t),r=new $t().makeTranslation(.128,0,n).multiply(s),a=[],o=[],l=[],c=[{y:-1.432,zc:.004,hw:.047,hl:.052},{y:-1.474,zc:-.008,hw:.049,hl:.062},{y:-1.51,zc:-.044,hw:.053,hl:.098},{y:-1.536,zc:-.084,hw:.056,hl:.134},{y:-1.556,zc:-.094,hw:.055,hl:.144}],h=[],d=12;for(let f=0;f<=d;f++){const x=f/d*(c.length-1),y=Math.min(c.length-2,Math.floor(x)),_=x-y,T=c[y],b=c[y+1],w=ne.lerp(T.y,b.y,_),E=ne.lerp(T.zc,b.zc,_),M=ne.lerp(T.hw,b.hw,_),S=ne.lerp(T.hl,b.hl,_);h.push(R=>{const D=Math.cos(R),L=Math.sin(R),N=D<0&&L>-.2&&L<.4?.005:0,O=Math.sign(D)*Math.pow(Math.abs(D),.84)*M+N,F=E+Math.sign(L)*Math.pow(Math.abs(L),.82)*S,H=Math.exp(-Math.pow((F+.162)/.008,2))*.0028;return[O,w+H,F]})}a.push(jn(ys(h,20,{capStart:!0,capEnd:!0}),r));const p=new $i(.046,.0075,7,16),u=r.clone().multiply(new $t().makeTranslation(0,-1.452,.002).multiply(new $t().makeRotationX(Math.PI*.5)));a.push(jn(p,u));const m=[{y:-1.553,zc:-.094,hw:.0585,hl:.15},{y:-1.568,zc:-.094,hw:.06,hl:.152},{y:-1.578,zc:-.094,hw:.0585,hl:.15}].map(({y:f,zc:x,hw:y,hl:_})=>T=>{const b=Math.cos(T),w=Math.sin(T),E=Math.sin(T*18)*.0014;return[Math.sign(b)*Math.pow(Math.abs(b),.82)*(y+E),f,x+Math.sign(w)*Math.pow(Math.abs(w),.8)*(_+E)]});o.push(jn(ys(m,20,{capStart:!0,capEnd:!0}),r));const v=new ke(.049,.05,.016,12);v.scale(1.02,1,.86);const g=r.clone().multiply(new $t().makeTranslation(0,-1.582,.014));o.push(jn(v,g));for(let f=0;f<4;f++){const x=-1.468-f*.0145,y=-.052-f*.023,_=.02+f*.0014,T=new Xr(new I(-_,x,y),new I(_,x-.005,y-.009)),b=new Xr(new I(_,x,y),new I(-_,x-.005,y-.009));o.push(jn(new Qe(T,1,.0028,5,!1),r)),o.push(jn(new Qe(b,1,.0028,5,!1),r));for(const w of[-1,1]){const E=new ke(.0042,.0042,.003,7),M=r.clone().multiply(new $t().makeTranslation(w*(_+.002),x,y).multiply(new $t().makeRotationX(.55)));l.push(jn(E,M))}}return{leatherGeo:Ri(a),soleGeo:Ri(o),eyeletGeo:Ri(l)}}function F_(i){const t=new ie;t.name="vr-avatar-body";const e=[],n=[],s=D_(),r=new Tn([new I(-.086,-.304,-.062),new I(-.068,-.282,.002),new I(0,-.276,.046),new I(.068,-.282,.002),new I(.086,-.304,-.062)]),a=new Qe(r,22,.016,10,!1);a.scale(1,1.3,.74),e.push(a);const o=U_(),l=Ys(o);e.push(o,l);for(const O of[-1,1]){const F=new An(.094,.03,.013,2,1,1),H=new $t().makeTranslation(O*.152,-.655,-.208).multiply(new $t().makeRotationY(-O*.48)).multiply(new $t().makeRotationX(-.32)).multiply(new $t().makeRotationZ(-O*.14));e.push(jn(F,H))}const c=[{y:-.495,z:-.178},{y:-.59,z:-.214},{y:-.685,z:-.242}];for(const{y:O,z:F}of c)for(const H of[-1,1]){const B=new ke(.0125,.0125,.006,12),X=new $i(.0115,.0022,6,12),G=new $t().makeTranslation(H*.058,O,F).multiply(new $t().makeRotationX(Math.PI*.5-.34)).multiply(new $t().makeRotationZ(H*.08)),Q=new $t().makeTranslation(H*.058,O+.001,F-.0025).multiply(new $t().makeRotationX(-.34)).multiply(new $t().makeRotationY(H*.08));n.push(jn(B,G),jn(X,Q))}const h=Uu(.012,-7.5*Hi),d=Uu(-.014,-6.5*Hi),p=Ys(d);d.dispose();const u=Nu(.012,-7.5*Hi),m=Nu(-.014,-6.5*Hi),v=Ys(m.leatherGeo),g=Ys(m.soleGeo),f=Ys(m.eyeletGeo);m.leatherGeo.dispose(),m.soleGeo.dispose(),m.eyeletGeo.dispose(),n.push(u.eyeletGeo,f);const x=Ri(e),y=N_(),_=Ri([h,p]),T=Ri([u.leatherGeo,v]),b=Ri([u.soleGeo,g]),w=Ri(n),E=new Ft(s,i.sleeveMat),M=new Ft(x,i.sleeveFoldMat),S=new Ft(y,i.scarfMat),R=new Ft(_,i.trouserMat),D=new Ft(T,i.bootLeatherMat),L=new Ft(b,i.bootSoleMat),N=new Ft(w,i.hornButtonMat);return t.add(E,M,S,R,D,L,N),{bodyGroup:t,geos:[s,x,y,_,T,b,w]}}function Fu(i,t,{withBeacon:e=!1,initialSide:n="right"}={}){const s=new ie,r=new Ft(t.shoulderSphereGeo,i.sleeveMat);s.add(r);const a=new Ft(t.upperSleeveGeo,i.sleeveMat);s.add(a);const o=new ie,l=new Ft(t.elbowSphereGeo,i.sleeveMat);l.scale.set(.97,1.02,1.04),o.add(l);const c=new Ft(t.elbowCreaseGeo,i.sleeveFoldMat);c.rotation.x=Math.PI*.44,c.position.set(0,.01,-.003);const h=new Ft(t.elbowCreaseGeo,i.sleeveFoldMat);h.rotation.x=Math.PI*.48,h.position.set(0,-.01,-.002),o.add(c,h),s.add(o);const d=new Ft(t.foreSleeveGeo,i.sleeveMat);s.add(d);const p=new ie;s.add(p);const u=new Ft(t.coatCuffHemGeo,i.sleeveFoldMat);u.rotation.x=Math.PI*.5,u.scale.set(1,1,.8),u.position.set(0,0,.031),p.add(u);const m=new ie,v=new Ft(t.cuffTabGeo,i.sleeveFoldMat),g=new Ft(t.cuffBtnGeo,i.hornButtonMat);g.rotation.z=Math.PI*.5,g.position.set(.0035,0,-.008),m.add(v,g),p.add(m);const f=new Ft(t.knitCuffGeo,i.cuffKnitMat);f.rotation.x=Math.PI*.5,f.scale.set(1,1,.75),f.position.set(0,0,.013),p.add(f);let x=null,y=null,_=null;if(e){x=new ie;const J=new Ft(t.strapGeo,i.strapMat);J.rotation.x=Math.PI*.5,J.scale.set(1.02,1,.76),J.position.set(0,0,.012),x.add(J),y=new ie;const j=new Ft(t.miniScreenGeo,i.deviceCaseMat);y.add(j);const at=new Ft(t.ledDotGeo,i.ledGreenMat);at.position.set(0,.0026,-.0044),y.add(at);const st=new Ft(t.ledDotGeo,i.ledMagentaMat);st.position.set(0,.0026,.0044),y.add(st),x.add(y),_=new Ft(t.rivetGeo,i.pipBrassMat),x.add(_),p.add(x)}const T=new ie;s.add(T);const b=new ie;T.add(b);const w=new ie;w.scale.setScalar(1.16),b.add(w);const E=new Ft(t.wristBridgeGeo,i.gloveMat);E.scale.set(1.05,.68,.96),E.position.set(0,0,.002),w.add(E);const M=new Ft(t.palmRightGeo,i.gloveMat);w.add(M);const S=new Ft(t.palmPadGeo,i.palmInnerMat);S.scale.set(1.02,.24,1.12),S.position.set(0,-.01,-.049),w.add(S);const R=new Ft(t.thenarGeo,i.palmInnerMat);R.scale.set(.86,.65,1.4),w.add(R);const D=new Ft(t.hypothenarGeo,i.palmInnerMat);D.scale.set(.72,.56,1.46),w.add(D);const L=new Ft(t.wristSnapGeo,i.pipBrassMat);L.position.set(0,-.0135,-.006),w.add(L);const N=[-1,0,1].map(J=>{const j=new Ft(t.stitchArchGeo,i.seamMat);return w.add(j),{mesh:j,idx:J}}),O=t.fingerTemplates.map(J=>{const j=new ie,at=new Ft(J.knuckleGeo,i.gloveMat);at.scale.set(1.05,.88,1.05),j.add(at),j.add(new Ft(J.p1Geo,i.gloveMat));const st=new ie;st.position.set(0,0,-J.spec.l1),st.add(new Ft(J.pipGeo,i.gloveMat)),st.add(new Ft(J.p2Geo,i.gloveMat));const ut=new ie;ut.position.set(0,0,-J.spec.l2),ut.add(new Ft(J.dipGeo,i.gloveMat)),ut.add(new Ft(J.p3Geo,i.gloveMat));const Bt=new Ft(J.tipGeo,i.seamMat);return Bt.scale.set(1,.84,1.14),Bt.position.set(0,-5e-4,-J.spec.l3),ut.add(Bt),st.add(ut),j.add(st),w.add(j),{spec:J.spec,mcp:j,pip:st,dip:ut}}),F=new ie;F.add(new Ft(t.thumbCmcBallGeo,i.gloveMat)),F.add(new Ft(t.thumbMetaGeo,i.gloveMat));const H=new ie;H.position.set(0,0,-.032),H.add(new Ft(t.thumbMcpBallGeo,i.gloveMat)),H.add(new Ft(t.thumbProxGeo,i.gloveMat));const B=new ie;B.position.set(0,0,-.026),B.add(new Ft(t.thumbIpBallGeo,i.gloveMat)),B.add(new Ft(t.thumbDistGeo,i.gloveMat));const X=new Ft(t.thumbTipGeo,i.seamMat);X.scale.set(1,.84,1.14),X.position.set(0,-5e-4,-.02),B.add(X),H.add(B),F.add(H),w.add(F);let G=null;function Q(J){const j=J==="left"?"left":"right";if(j===G)return;G=j;const at=j==="left"?-1:1;M.geometry=j==="left"?t.palmLeftGeo:t.palmRightGeo,w.rotation.set(.05,at*.06,at*.24),R.position.set(-at*.024,-.011,-.032),R.rotation.y=at*.28,D.position.set(at*.027,-.01,-.043);for(const{mesh:st,idx:ut}of N){const Bt=ut===0?.0018:4e-4;st.position.set(at*ut*.0155,Bt,0),st.rotation.y=-at*ut*.055}for(const st of O)st.mcp.position.set(at*st.spec.baseX,st.spec.yOff,st.spec.zOff);F.position.set(-at*.039,-.005,-.028),F.rotation.set(.08,at*.58,-at*.24),m.position.set(at*.038,.002,.032),m.rotation.y=at>0?0:Math.PI,y&&_&&(y.position.set(-at*.005,.029,.012),y.rotation.z=at*.12,_.position.set(at*.027,.021,.012))}function rt(J,j,at=0,st=0,ut=0){const Bt=G==="left"?-1:1;for(let P=0;P<O.length;P++){const A=O[P],W=at*Math.sin(st+P*.9)*.16,K=P*.052,ht=ne.clamp(J+K+W+ut,.03,1.35);A.mcp.rotation.x=-ht*.56,A.pip.rotation.x=-ht*.78,A.dip.rotation.x=-ht*.52,A.mcp.rotation.y=-Bt*A.spec.splay*j}const vt=ne.clamp(J*.85+ut*.5,.02,1.15);F.rotation.x=.08-vt*.28,F.rotation.y=Bt*(.58-vt*.24),H.rotation.x=-vt*.44,B.rotation.x=-vt*.52}const pt=new I,zt=new I,Ct=new I,$=new I,nt=new I,mt=new I,xt=new I,bt=new I,Wt=new I,Qt=new I,z=new $t,lt=new I(0,1,0);function ct(J,j,at,st,ut=55,Bt=0,vt=0){T.position.copy(at),T.quaternion.set(st[0],st[1],st[2],st[3]),b.rotation.set(Bt,vt,0),r.position.copy(J),pt.copy(J).sub(j);const P=Math.max(.08,pt.length());a.position.copy(j).addScaledVector(pt,.5),a.scale.set(1,P,1),a.quaternion.setFromUnitVectors(lt,pt.normalize()),o.position.copy(j),o.quaternion.copy(a.quaternion);const A=.92+ne.clamp(ut/120,0,1)*.16;c.scale.setScalar(A),h.scale.setScalar(A*.97),zt.copy(at).sub(j);const W=Math.max(.1,zt.length());zt.divideScalar(W),xt.copy(zt).negate(),Ct.set(0,1,0).applyQuaternion(T.quaternion),mt.copy(Ct).addScaledVector(xt,-Ct.dot(xt)),mt.lengthSq()<1e-4?($.set(1,0,0).applyQuaternion(T.quaternion),nt.copy($).addScaledVector(xt,-$.dot(xt)).normalize(),mt.crossVectors(xt,nt).normalize()):(mt.normalize(),nt.crossVectors(mt,xt).normalize(),mt.crossVectors(xt,nt).normalize()),z.makeBasis(nt,mt,xt),p.position.copy(at),p.quaternion.setFromRotationMatrix(z),bt.copy(at).addScaledVector(xt,.036),pt.copy(j).sub(bt);const K=Math.max(.06,pt.length());d.position.copy(bt).addScaledVector(pt,.5),Wt.copy(pt).normalize(),Qt.crossVectors(nt,Wt).normalize(),z.makeBasis(nt,Wt,Qt),d.quaternion.setFromRotationMatrix(z),d.scale.set(1,K,1)}return Q(n),rt(.42,.36,0,0,0),{group:s,wristPivot:T,beaconBandGroup:x,setSide:Q,getSide:()=>G,setFingerPose:rt,applyJoints:ct}}function O_(i="right"){const t=new ie;t.name="vr-gloved-hand",t.visible=!1;const e=L_(),n={gloveMat:new Rt({color:9730657,emissive:2300434,emissiveIntensity:.46,roughness:.73,metalness:.05,bumpMap:e.suedeBump,bumpScale:.0022}),palmInnerMat:new Rt({color:6442041,emissive:1445641,emissiveIntensity:.4,roughness:.84,metalness:.04,bumpMap:e.suedeBump,bumpScale:.0028}),seamMat:new Rt({color:11770496,emissive:2760727,emissiveIntensity:.45,roughness:.65,metalness:.06}),cuffKnitMat:new Rt({color:2503230,emissive:593428,emissiveIntensity:.42,roughness:.9,metalness:.03,bumpMap:e.knitBump,bumpScale:.0042}),sleeveMat:new Rt({color:2240577,emissive:527894,emissiveIntensity:.44,roughness:.87,metalness:.05,bumpMap:e.woolBump,bumpScale:.0042}),sleeveFoldMat:new Rt({color:3228504,emissive:791583,emissiveIntensity:.45,roughness:.82,metalness:.07,bumpMap:e.woolBump,bumpScale:.0038}),scarfMat:new Rt({color:7156534,emissive:1968908,emissiveIntensity:.44,roughness:.9,metalness:.02,bumpMap:e.knitBump,bumpScale:.006}),trouserMat:new Rt({color:4277839,emissive:1053464,emissiveIntensity:.42,roughness:.85,metalness:.04,bumpMap:e.trouserBump,bumpScale:.0042}),bootLeatherMat:new Rt({color:4927521,emissive:1313542,emissiveIntensity:.42,roughness:.44,metalness:.14,bumpMap:e.bootBump,bumpScale:.0034}),bootSoleMat:new Rt({color:1448221,emissive:329224,emissiveIntensity:.34,roughness:.86,metalness:.08}),hornButtonMat:new Rt({color:10189908,emissive:2497036,emissiveIntensity:.42,roughness:.34,metalness:.5}),strapMat:new Rt({color:3877922,emissive:1182728,emissiveIntensity:.4,roughness:.62,metalness:.16}),deviceCaseMat:new Rt({color:1119773,emissive:263946,emissiveIntensity:.35,roughness:.35,metalness:.35}),pipBrassMat:new Rt({color:14923896,emissive:7227417,emissiveIntensity:.55,roughness:.34,metalness:.58}),ledGreenMat:new Ke({color:55639}),ledMagentaMat:new Ke({color:14680214})},s=new Tn([new I(0,.0156,-.02),new I(0,.0176,-.05),new I(0,.0152,-.078)]),a=[{baseX:-.031,yOff:.0015,zOff:-.093,l1:.035,l2:.023,l3:.016,w:.019,splay:-.058},{baseX:-.01,yOff:.0035,zOff:-.098,l1:.039,l2:.026,l3:.017,w:.0198,splay:-.012},{baseX:.011,yOff:.002,zOff:-.095,l1:.036,l2:.024,l3:.016,w:.0188,splay:.028},{baseX:.03,yOff:-.002,zOff:-.087,l1:.029,l2:.019,l3:.015,w:.0168,splay:.075}].map(G=>({spec:G,knuckleGeo:new Ne(G.w*.52,9,7),p1Geo:Xs(G.w*.52,G.w*.45,G.l1),pipGeo:new Ne(G.w*.45,8,6),p2Geo:Xs(G.w*.45,G.w*.39,G.l2),dipGeo:new Ne(G.w*.39,8,6),p3Geo:Xs(G.w*.39,G.w*.32,G.l3),tipGeo:new Ne(G.w*.33,8,6)})),o={shoulderSphereGeo:new Ne(.057,12,9),upperSleeveGeo:Du(.047,.056),elbowSphereGeo:new Ne(.047,12,10),elbowCreaseGeo:new $i(.042,.0052,6,14),foreSleeveGeo:Du(.04,.047),coatCuffHemGeo:new ke(.041,.0425,.028,16),cuffTabGeo:new An(.005,.014,.032),cuffBtnGeo:new ke(.0055,.0055,.003,9),knitCuffGeo:new ke(.0355,.0375,.03,14),strapGeo:new ke(.0368,.0375,.018,14),miniScreenGeo:new An(.031,.0045,.017),ledDotGeo:new Ne(.0022,6,5),rivetGeo:new Ne(.0056,8,6),wristBridgeGeo:new Ne(.028,10,8),palmRightGeo:Lu(1),palmLeftGeo:Lu(-1),palmPadGeo:new Ne(.038,12,10),thenarGeo:new Ne(.021,10,8),hypothenarGeo:new Ne(.016,8,7),wristSnapGeo:new ke(.0042,.0042,.0025,9),stitchArchGeo:new Qe(s,10,.0017,6,!1),fingerTemplates:a,thumbCmcBallGeo:new Ne(.0155,8,7),thumbMetaGeo:Xs(.015,.0122,.032),thumbMcpBallGeo:new Ne(.0122,8,6),thumbProxGeo:Xs(.012,.0102,.026),thumbIpBallGeo:new Ne(.0102,8,6),thumbDistGeo:Xs(.01,.0084,.02),thumbTipGeo:new Ne(.0086,8,6)},l=new ie;l.name="vr-body-root",t.add(l);const c=F_(n);l.add(c.bodyGroup);const h=Fu(n,o,{withBeacon:!1,initialSide:i==="left"?"right":"left"});l.add(h.group);const d=Fu(n,o,{withBeacon:!0,initialSide:i});t.add(d.group);let p=i==="left"?"left":"right",u=0,m=.3,v=.6,g=0,f=0,x=0,y=0;function _(G){const Q=G==="left"?"left":"right";p=Q,d.setSide(Q),h.setSide(Q==="left"?"right":"left")}const T=new I,b=new I,w=new I,E=new Fe().setFromEuler(new xn(-.56,.3,-.44,"YXZ")).toArray(),M=new Fe().setFromEuler(new xn(-.56,-.3,.44,"YXZ")).toArray();function S(G,Q){const rt=Q==="left"?-1:1;T.set(rt*.212,-.295,-.065),b.set(rt*.268,-.495,-.165),w.set(rt*.205,-.6,-.355);const pt=rt>0?E:M;G.setSide(Q),G.applyJoints(T,b,w,pt,52,0,0),G.setFingerPose(.54,.28,0,0,0)}_(i),S(h,p==="left"?"right":"left");const R=new I,D=new I,L=new I,N=new Fe,O=new Fe,F=new Fe,H=new Fe,B=new I(1,0,0),X=new I(0,1,0);return{group:t,bodyRoot:l,torsoGroup:c.bodyGroup,wristPivot:d.wristPivot,passiveWristPivot:h.wristPivot,setHandSide:_,getHandSide:()=>p,getBodyInfo:()=>{var G;return{visible:t.visible,torsoVisible:c.bodyGroup.visible,passiveArmSide:h.getSide(),activeArmSide:d.getSide(),beaconBandVisible:!!((G=d.beaconBandGroup)!=null&&G.visible)}},update(G,{visible:Q=!1,handMode:rt=!0,handTracked:pt=!0,handSide:zt=p,headLook:Ct=null,torsoYaw:$=null,shoulderPos:nt=null,elbowPos:mt=null,pos:xt={x:.16,y:-.22,z:-.5},vel:bt={x:0,y:0,z:0},qArm:Wt=[0,0,0,1],reach:Qt=.25,elbowBendDeg:z=60,overBin:lt=!1,phase:ct="search",calmLowerProgress:J=0,beaconActive:j=!1}={}){if(t.visible=Q,!Q)return;const at=Math.min(.1,G||1/60);_(zt);const st=p==="left"?-1:1;y+=at*1.45;const ut=Math.sin(y)*5e-4,Bt=Number.isFinite(Ct==null?void 0:Ct.yaw)?Ct.yaw:0,vt=Number.isFinite(Ct==null?void 0:Ct.pitch)?Ct.pitch:0;Number.isFinite($)?u=$:u=ne.clamp(u,Bt-50*Hi,Bt+50*Hi);const P=Bt-u;if(N.setFromAxisAngle(B,-vt),O.setFromAxisAngle(X,P),F.copy(N).multiply(O),l.position.set(0,ut*.4,0),l.quaternion.copy(F),S(h,p==="left"?"right":"left"),d.beaconBandGroup&&(d.beaconBandGroup.visible=!!rt),!rt||!pt){R.set(st*.212,-.295,-.065).applyQuaternion(F),D.set(st*.268,-.495,-.165).applyQuaternion(F),L.set(st*.205,-.6,-.355).applyQuaternion(F);const Ut=st>0?E:M;H.set(Ut[0],Ut[1],Ut[2],Ut[3]).premultiply(F),d.applyJoints(R,D,L,H.toArray(),52,0,0),d.setFingerPose(.54,.28,0,0,0);return}L.set(xt.x,xt.y+ut,xt.z),nt?R.set(nt.x,nt.y,nt.z):R.set(st*.21,-.27,-.08),mt?D.set(mt.x,mt.y+ut*.5,mt.z):D.set(st*.24,-.44,-.26);const W=ne.clamp(-bt.y*.08,-.15,.15),K=ne.clamp(bt.x*.07,-.13,.13),ht=1-Math.exp(-at*16);f+=(W-f)*ht,x+=(K-x)*ht,d.applyJoints(R,D,L,Wt,z,f,x);let Z=.28,wt=.58,gt=0;ct==="search"?Qt>=.58&&lt?(Z=.14,wt=1.05,gt=1,g+=at*9.5):xt.y<-.34?(Z=.48,wt=.32):xt.y>.1?(Z=.18,wt=.9):(Z=.32,wt=.52):ct==="inspect"&&(Z=.2+J*.86,wt=(1-J)*.78+.15);const Pt=1-Math.exp(-at*13);m+=(Z-m)*Pt,v+=(wt-v)*Pt,d.setFingerPose(m,v,gt,g,f*.85),J>.05?(n.pipBrassMat.emissive.setHex(8963184),n.pipBrassMat.emissiveIntensity=.6+J*.95):j?(n.pipBrassMat.emissive.setHex(7121032),n.pipBrassMat.emissiveIntensity=.58):(n.pipBrassMat.emissive.setHex(7227417),n.pipBrassMat.emissiveIntensity=.45),n.ledGreenMat.color.setHex(j?65382:1993533),n.ledMagentaMat.color.setHex(j?16711850:7020114)},dispose(){for(const G of c.geos)G.dispose();for(const G of o.fingerTemplates)G.knuckleGeo.dispose(),G.p1Geo.dispose(),G.pipGeo.dispose(),G.p2Geo.dispose(),G.dipGeo.dispose(),G.p3Geo.dispose(),G.tipGeo.dispose();for(const[G,Q]of Object.entries(o))G!=="fingerTemplates"&&(Q!=null&&Q.dispose)&&Q.dispose();for(const G of Object.values(e))G.dispose();for(const G of Object.values(n))G.dispose()}}}const bn=fi(137);function xl(i){i.updateWorldMatrix(!0,!0);const t=new $t().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new $t().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=rf(s,!1);if(r){const a=new Ft(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class z_{constructor(t){this.renderer=new Ix({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=cd,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=Ye,this.renderer.toneMapping=Lc,this.renderer.toneMappingExposure=1.12,this.scene=new cc,this.scene.background=new qt("#16222f"),this.scene.fog=new Vc("#1c2b3a",.0118),this.sky=I_(),this.scene.add(this.sky.group),this.camera=new rn(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new rn(62,1,.1,70),this.eyeR=new rn(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new I,this.baseCameraQuaternion=new Fe,this.lockedCameraQuaternion=new Fe,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null;const e=new mc(this.renderer),n=new zx;this.envTarget=e.fromScene(n,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=.15,n.dispose(),e.dispose(),this.hemi=new qh(9087958,1318439,1.12),this.scene.add(this.hemi);const s=new Pa(11127024,1.62);s.position.set(-6,11,2),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-6,s.shadow.camera.right=6,s.shadow.camera.top=7,s.shadow.camera.bottom=-6,s.shadow.normalBias=.012,s.shadow.bias=-25e-5,s.shadow.radius=3,this.scene.add(s),this.sun=s;const r=new Pa(5338012,.62);r.position.set(5,5,-4),this.scene.add(r),this.static=new ie,this.scene.add(this.static),Ru(.5),this.buildCourtyard(),Ru(1),xl(this.static),this.bin=new ie,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new Ft(new de(1,1),new Ke({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new ie,this.silhouetteMat=new Ke({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new ie,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2),this.vrHand=O_(),this.camera.add(this.vrHand.group),this.vrBodyActive=!1,this.vrHandMode=!1,this.handInspectHeadBase=null,this.itemBaseRot=[0,0,0],this.tossGroup=new ie,this.scene.add(this.tossGroup),this.tossState=null;const a=fe((o,l)=>{const c=o.createRadialGradient(l/2,l/2,0,l/2,l/2,l/2);c.addColorStop(0,"rgba(3,7,11,.62)"),c.addColorStop(.55,"rgba(3,7,11,.34)"),c.addColorStop(1,"rgba(3,7,11,0)"),o.fillStyle=c,o.fillRect(0,0,l,l)},128);this.itemShadow=new Ft(new de(1,1),new Ke({map:a,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new ro(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new ro(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new Yx(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new sf,this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new ft,this.raycaster=new $p,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",o=>{this.reduced=o.matches,o.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildCourtyard(){const t=new Rt({...Eu("courtyard-stone",[18,18]),normalScale:new ft(1.2,1.2),roughness:.7,metalness:.13,color:10133666});Dt(new de(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new $d().load("./assets/plaster.jpg");e.colorSpace=Ye,e.wrapS=e.wrapT=li,e.repeat.set(3,3),e.anisotropy=4;const n=new Rt({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new Rt({color:8225402,roughness:.9}),a=new Rt({color:10724502,roughness:.84}),o=new Rt({color:2897456,roughness:.78}),l=new Rt({color:2436659,metalness:.32,roughness:.74}),c=fe((f,x)=>{const y=f.createLinearGradient(0,0,x,x);y.addColorStop(0,"#788b91"),y.addColorStop(.48,"#495b60"),y.addColorStop(1,"#1d302c"),f.fillStyle=y,f.fillRect(0,0,x,x),f.save(),f.transform(1,.16,-.07,1,0,0);for(let T=-30;T<x;T+=94){f.fillStyle="#283b3a",f.fillRect(T,70,65,x);for(let b=94;b<x;b+=104)f.fillStyle="#83938b",f.globalAlpha=.24,f.fillRect(T+6,b,24,66),f.fillRect(T+34,b,24,66)}f.restore();const _=f.createLinearGradient(0,0,x,x*.8);_.addColorStop(0,"rgba(238,246,238,.20)"),_.addColorStop(.38,"rgba(238,246,238,.03)"),_.addColorStop(.62,"rgba(238,246,238,0)"),f.fillStyle=_,f.beginPath(),f.moveTo(0,x),f.lineTo(x*.52,0),f.lineTo(x*.78,0),f.lineTo(x*.24,x),f.closePath(),f.fill(),f.fillStyle="rgba(18,31,31,.55)",f.beginPath(),f.moveTo(0,82),f.lineTo(120,38),f.lineTo(150,38),f.lineTo(150,12),f.lineTo(178,12),f.lineTo(178,34),f.lineTo(335,66),f.lineTo(360,30),f.lineTo(386,30),f.lineTo(386,72),f.lineTo(512,96),f.lineTo(512,0),f.lineTo(0,0),f.closePath(),f.fill(),f.fillStyle="rgba(255,190,110,.5)";for(let T=0;T<24;T++)f.fillRect(28+T*67%470,150+T*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(f=>new Rt({color:f,map:c,metalness:.24,roughness:.28})),d=pf,p=(f,x,y,_,T)=>{const b=new ie;b.position.set(...y),b.rotation.y=_,this.static.add(b),k(b,[f,x,.65],[0,x/2,0],T,0),k(b,[f,.75,.78],[0,.375,.025],r,0);for(const E of[3.2,6.15,9.1,12.1])k(b,[f,.14,.87],[0,E,.055],a,0),k(b,[f,.07,.98],[0,E+.09,.08],r,0);k(b,[f,.35,1.06],[0,x-.12,.05],a,0),M_(b,f,x,_===0?0:_>0?37:73),Iu(b,f,x,l,a);let w=Math.floor(f/2.45);for(let E=0;E<w;E++)for(let M=0;M<4;M++){let S=(E-(w-1)/2)*2.47,R=1.72+M*2.95;if(_===0&&M===0&&Math.abs(S+3.8)<1.2)continue;const D=1.16,L=1.91;k(b,[D+.26,L+.27,.14],[S,R,.38],a,0),k(b,[D+.05,L+.06,.1],[S,R,.47],o,0);const N=nf(E,M,_===0?0:_>0?1:2),O=N==="lit"?d:h[(E+M)%h.length];k(b,[D,L,.04],[S,R,.54],O,0);for(const F of[-D/2,D/2,0])k(b,[.048,L,.09],[S+F,R,.58],r,0);for(const F of[-L/2,L/2,.24])k(b,[D,.047,.09],[S,R+F,.58],r,0);k(b,[D+.4,.12,.43],[S,R-L/2-.09,.55],a,0),uf(b,S,R,D,L,r,o,a),ff(b,S,R,D,L,N,a,O,(_>0?100:200)+M*10+E)}for(const E of[-f/2+.35,f/2-.38]){Ot(b,.07,.07,x,[E,x/2,.53],o,[0,0,0],12);for(let M=1;M<x;M+=2)Ot(b,.087,.087,.055,[E,M,.53],U.rust,[0,0,0],12)}for(let E=0;E<13;E++){const M=(bn()-.5)*f,S=.8+bn()*.3;k(b,[.2+bn()*.7,.06+bn()*.14,.02],[M,S,.335],r,0)}return b};p(20,14,[-8,0,1.5],Math.PI/2,s),p(20,14,[9,0,1.5],-Math.PI/2,n),p(20,13.5,[.5,0,11.6],Math.PI,n);const u=new ie;u.position.set(0,0,-7),this.static.add(u),P_(u,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:d,seed:101,gateX:1.55}),Iu(u,20,13.5,l,a);const m=new Rt({map:vc("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});k(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],U.black),Dt(new de(.75,.55),m,this.static,[-2.75,2.5,-6.465]),k(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),k(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let f=0;f<6;f++)k(this.static,[.45,.025,.015],[4.1,1.65+f*.07,-6.415],U.black,0);Ot(this.static,.036,.036,18,[0,5.35,-6.48],U.rust,[0,0,Math.PI/2],12);for(let f=0;f<2;f++){const x=new Tn([new I(-8,9+f,2),new I(0,7.8+f,1),new I(9,9+f,-1)]);Dt(new Qe(x,24,.012,4,!1),U.black,this.static)}for(const f of[-7.2,8.2])k(this.static,[.24,.17,22],[f,.065,0],r,.025);const v=new Rt({color:8350016,roughness:1,side:Be});for(let f=0;f<50;f++){let x=(bn()-.5)*13,y=(bn()-.5)*14;Dt(new Yi(.025+bn()*.035,5),v,this.static,[x,.008,y],[-Math.PI/2,bn()*3,bn()*6])}const g=new Rt({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let f=0;f<10;f++)Dt(new Yi(.55+bn(),40),g,this.static,[(bn()-.5)*10,.005,(bn()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+bn()*.45,1);this.buildProps(),b_(this.static,this.scene)}buildProps(){const t=this.static,e=new Rt({color:1647901,roughness:.64,metalness:.03,bumpMap:U.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of ef){const d=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([m,v])=>new ft(m*h*1.7,v*h*1.55)),p=new So(d,64),u=p.attributes.position;for(let m=0;m<u.count;m++){const v=u.getX(m),g=u.getY(m),f=u.getZ(m),x=Math.atan2(f,v),y=1+.08*Math.sin(x*13+g*12)+.045*Math.sin(x*21-g*7);u.setXYZ(m,v*y,g,f*y)}p.computeVertexNormals(),Dt(p,e,t,[l,.02,c]),be(t,.066*h,.018,[l,h*1.66,c],U.black,[Math.PI/2,0,0]);for(let m=0;m<3;m++)k(t,[.042,.16,.027],[l+Math.sin(m*2)*.04,h*1.84,c+Math.cos(m*2)*.035],e,.006,[.2,m*2,.23])}const n=new ie;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){be(n,.48,.038,[l,0,0],U.black),be(n,.44,.014,[l,0,0],U.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const d=new I(l,0,0),p=new I(l+Math.cos(h)*.44,Math.sin(h)*.44,0),u=new Xr(d,p);Dt(new Qe(u,1,.004,3),U.silver,n)}}const s=(l,c)=>{const h=new I(...l),d=new I(...c);Dt(new Qe(new Xr(h,d),1,.025,6),U.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);k(n,[.32,.07,.16],[-.23,.72,0],U.black),k(n,[.3,.035,.04],[.57,.86,0],U.silver);const r=new Rt({color:8090716,roughness:1});k(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)k(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],U.black,0);const a=vl("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=vl("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new Rt({...Eu("steel-paint"),normalScale:new ft(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new Rt({color:2505773,roughness:.58,metalness:.06,bumpMap:U.leather.bumpMap,bumpScale:.007}),r=new An(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let u=0;u<a.count;u++){let m=a.getY(u);const v=.9+(m+.8)*.0625;a.setX(u,a.getX(u)*v),a.setZ(u,a.getZ(u)*v),Math.abs(a.getZ(u))>.7&&a.setZ(u,a.getZ(u)+-.026*Math.exp(-((a.getX(u)-.35)**2+(m-.1)**2)*9))}r.computeVertexNormals(),Dt(r,e,t,[0,1.22,0]),k(t,[2.68,.105,1.83],[0,2.02,0],n,.035),k(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const u of[-1.08,1.08])k(t,[.055,1.51,.05],[u,1.2,.812],n,.008),k(t,[.055,1.5,.05],[u,1.2,-.813],n,.008);for(const u of[-.69,.69])k(t,[.044,1.22,.054],[u,1.26,.849],n,.008),k(t,[.044,1.22,.054],[u,1.26,-.849],n,.008);for(const u of[-1.275,1.275])k(t,[.06,.065,1.25],[u,1.65,0],n),k(t,[.065,1.3,.05],[u,1.23,.5],n),k(t,[.065,1.3,.05],[u,1.23,-.5],n),k(t,[.19,.18,.7],[u,1.7,0],n),k(t,[.06,.08,.6],[u*1.11,1.7,0],U.silver);for(const u of[-.95,.95])for(const m of[-.58,.58])k(t,[.15,.19,.12],[u,.35,m],U.silver),Ot(t,.18,.18,.15,[u,.19,m],U.black,[0,0,Math.PI/2],28),Ot(t,.067,.067,.16,[u,.19,m],U.silver,[0,0,Math.PI/2],24);this.lid=new ie,this.lid.position.set(0,2.08,-.92),t.add(this.lid),k(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let u=-4;u<=4;u++)k(this.lid,[.065,.07,1.66],[u*.27,.11,.94],n,.026);k(this.lid,[.65,.09,.1],[0,.045,1.99],U.black,.025);for(const u of[-.87,.87])Ot(t,.095,.095,.31,[u,2.06,-.93],U.silver,[0,0,Math.PI/2]);const o=fe((u,m,v)=>{u.fillStyle="#cac9ad",u.textAlign="center",u.font="bold 110px Arial",u.fillText("Т Б О",m/2,220),u.font="bold 82px Arial",u.fillText("№ 017",m/2,347),u.globalCompositeOperation="destination-out";for(let g=0;g<1600;g++)u.globalAlpha=v()*.7,u.fillRect(v()*m,v()*m,1+v()*4,1+v()*3)}),l=new Rt({map:o,transparent:!0,depthWrite:!1,roughness:.9});Dt(new de(.73,.56),l,t,[.62,1.31,.865]);const c=new Rt({map:vc("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});Dt(new de(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=fe((u,m)=>{u.fillStyle="#d3cdb5",u.fillRect(0,0,m,m),u.fillStyle="#93493c";for(let v=-m;v<m*2;v+=130)u.beginPath(),u.moveTo(v,0),u.lineTo(v+64,0),u.lineTo(v+m+64,m),u.lineTo(v+m,m),u.fill();fn(u,m,m,fi(25),5e3)}),d=new Rt({map:h,roughness:.75});for(const u of[-1.1,1.1])Dt(new de(.16,.53),d,t,[u,1.33,.847]);const p=fe((u,m)=>{const v=u.createRadialGradient(m/2,m/2,0,m/2,m/2,m*.48);v.addColorStop(0,"rgba(0,8,4,.8)"),v.addColorStop(.5,"rgba(0,8,4,.5)"),v.addColorStop(1,"rgba(0,8,4,0)"),u.fillStyle=v,u.fillRect(0,0,m,m)},128);Dt(new de(4.5,3.5),new Ke({map:p,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),R_(t,this.lid),t.remove(this.lid),xl(t),xl(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=ne.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=ne.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=ne.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var c;this.dirty=!0;const t=innerWidth,e=innerHeight;this.renderer.setSize(t,e),this.camera.aspect=t/e;const n=t/e<.8;this.camera.fov=n?52:43;const s=!n&&e<=520&&t>650,r=!n&&!s&&t>1050;if(this.camera.position.set(s?4.15:r?4.3:n?2.6:4.2,s?2.65:r?3.4:n?3.5:3.55,s?8.1:r?7.4:n?10.3:7.8),this.camera.lookAt(s?.25:r?.6:n?.9:0,s?1.32:r?2.65:n?2.6:2.4,0),this.viewOverride){const{fov:h=this.camera.fov,position:d,target:p}=this.viewOverride;this.camera.fov=h,d&&this.camera.position.set(...d),p&&this.camera.lookAt(...p)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=n;const a=getComputedStyle(document.documentElement);if(this.stage=Fx(t,e,parseFloat(a.getPropertyValue("--safe-top"))||0,parseFloat(a.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const h=Math.min(t/2,e)*.72;this.stage={x:(t/2-h)/2,y:(e-h)/2,width:h,height:h}}const o=2*4.2*Math.tan(ne.degToRad(this.camera.fov/2))/e;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-t/2)*o,(e/2-this.stage.y-this.stage.height/2)*o,-4.2);const l=this.vrStereo?62:this.camera.fov;this.inspectionVeil.scale.set(12*Math.tan(ne.degToRad(l/2))*t/e,12*Math.tan(ne.degToRad(l/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(c=this.pipeline)==null||c.resize(t,e,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new Yn(new I(...t.min),new I(...t.max));e.applyMatrix4(new $t().makeRotationFromQuaternion(this.item.quaternion));const n=e.getSize(new I).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(ne.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):bu(n,this.stage,innerHeight,this.camera.fov,4.2,innerWidth),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new Yn(new I(...t.min),new I(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new I(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*innerWidth/2,y:(1-o.y)*innerHeight/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,!this.vrBodyActive&&this.vrHand&&(this.vrHand.group.visible=!1)),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,innerWidth,innerHeight),this.applyCameraPose(),this.resize(),this.item&&this.applyReveal(),this.dirty=!0}setVrBodyActive(t){this.vrBodyActive=!!t,!t&&this.vrHand&&(this.vrHand.group.visible=!1),this.dirty=!0}setVrHandMode(t){this.vrHandMode=!!t,t||(!this.vrBodyActive&&this.vrHand&&(this.vrHand.group.visible=!1),this.pose==="hand"&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null,this.pose="free")),t&&this.vrInspectLock&&this.unlockInspectionView(),this.dirty=!0}updateVrHand(t,e){if(!this.vrHand)return;const n=!!(this.vrBodyActive&&(e!=null&&e.visible));this.vrHand.update(t,{...e,handMode:this.vrHandMode,visible:n}),n&&(this.dirty=!0)}handHitsBin(){var s,r;if(!this.vrHandMode||!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible))return this.gazeHitsBin();this.camera.updateMatrixWorld(!0),this.vrHand.wristPivot.updateMatrixWorld(!0);const e=this.vrHand.wristPivot.localToWorld(new I(0,0,-.15)).clone().sub(this.camera.position).normalize();if(this.raycaster.set(this.camera.position,e),this.raycaster.intersectObject(this.bin,!0).length>0)return!0;const n=new I(0,1.25,0).sub(this.camera.position).normalize();return e.angleTo(n)<=.44}setHandItemRotation(t=0,e=0,n=0,s=null){if(!this.item)return;const[r,a,o]=this.itemBaseRot||[0,0,0];if(this.targetX=r+t,this.targetY=a+e,this.targetZ=o+n,Array.isArray(s)&&s.length===4){const l=new Fe(s[0],s[1],s[2],s[3]);this.targetItemQuat=l.multiply(this.itemBaseQuat||new Fe)}else this.targetItemQuat=null;this.pose="hand",this.dirty=!0}launchDiscardToss(t={x:4.5,y:2.4,z:-6.5}){if(!this.item||this.reduced)return;this.camera.updateMatrixWorld(!0),this.item.updateMatrixWorld(!0);const e=new I,n=new Fe,s=new I;this.item.matrixWorld.decompose(e,n,s);const r=this.item.clone(!0);r.remove(this.silhouette),r.matrixAutoUpdate=!0,r.position.copy(e),r.quaternion.copy(n),r.scale.copy(s),this.tossGroup.clear(),this.tossGroup.add(r);const a=new I(t.x??4.5,t.y??2.4,t.z??-6.5).applyQuaternion(this.camera.quaternion);this.tossState={mesh:r,t:0,dur:.42,vx:a.x,vy:a.y,vz:a.z},this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&!this.vrHandMode&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=ne.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=ne.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else if(this.applyCameraPose(),this.vrStereo&&this.vrHandMode&&this.inspect&&this.handInspectHeadBase){const n=ne.euclideanModulo(this.headLook.yaw-this.handInspectHeadBase.yaw+Math.PI,Math.PI*2)-Math.PI,s=this.headLook.pitch-this.handInspectHeadBase.pitch;this.itemAnchor.position.set(ne.clamp(-n*2.4,-.95,.95),ne.clamp(-s*2.4,-.7,.7),-4.2),this.updateItemLights()}return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.vrHandMode?this.vrInfo():(this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo())}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=innerWidth,e=innerHeight){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new I(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=innerWidth,e=innerHeight,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){var e,n,s,r,a,o,l,c,h;const t=ne.radToDeg;return{stereo:!!this.vrStereo,bodyActive:!!this.vrBodyActive,body:((n=(e=this.vrHand)==null?void 0:e.getBodyInfo)==null?void 0:n.call(e))||null,handMode:!!this.vrHandMode,handSide:((r=(s=this.vrHand)==null?void 0:s.getHandSide)==null?void 0:r.call(s))||"right",handVisible:!!((o=(a=this.vrHand)==null?void 0:a.group)!=null&&o.visible),handPosition:((h=(c=(l=this.vrHand)==null?void 0:l.wristPivot)==null?void 0:c.position)==null?void 0:h.toArray().map(d=>+d.toFixed(3)))||null,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),targetZ:+t(this.targetZ||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(d=>+d.toFixed(5))}}hitBin(t,e){return this.pointer.set(t/innerWidth*2-1,-e/innerHeight*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}binScreen(){this.camera.updateMatrixWorld(!0);const t=new I(0,1.2,0).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new I(-1.26,1.12,.22).project(this.camera);return{x:(t.x+1)*innerWidth/2,y:(1-t.y)*innerHeight/2}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,vl(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.vrStereo||(this.headLook={yaw:0,pitch:0}),this.handInspectHeadBase={...this.headLook},this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=ti[t].lamp??17,this.itemRim.intensity=ti[t].rim??18,this.updateItemLights(),this.item.rotation.set(...ti[t].rotation),this.itemBaseRot=[...ti[t].rotation],this.itemBaseQuat=this.item.quaternion.clone(),this.targetItemQuat=null,this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new Ft(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&!this.vrHandMode&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.handInspectHeadBase=null,this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=Su(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=ti[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=Ox(this.itemId,t),this.targetItemQuat=null,this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=ne.clamp(Math.round((this.zoom+t)*100)/100,ao.min,ao.max),this.dirty=!0,this.zoom}rotate(t,e){this.targetItemQuat&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null),this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=ne.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.5)),this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new cc;o.background=new qt("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new qh(15069183,8288624,1.1));const l=new Pa(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new Pa(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new En(160,160,{type:hi}),d=new En(160,160,{depthBuffer:!1}),p=this.renderer.getRenderTarget(),u=this.renderer.getClearColor(new qt),m=this.renderer.getClearAlpha();let v;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...ti[t].rotation),e.scale.setScalar(1);const g=e.userData.bounds,f=new Yn(new I(...g.min),new I(...g.max));f.applyMatrix4(new $t().makeRotationFromEuler(e.rotation));const x=f.getSize(new I).multiplyScalar(.5);e.scale.setScalar(bu(x,{x:8,y:12,width:144,height:136},160,34));const y=new rn(34,1,.1,20);y.position.set(0,0,4.2),y.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,y),this.thumbnailOutput.render(this.renderer,d,h);const _=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(d,0,0,160,160,_);const T=document.createElement("canvas");T.width=T.height=160;const b=T.getContext("2d"),w=b.createImageData(160,160);for(let E=0;E<160;E++)w.data.set(_.subarray((159-E)*640,(160-E)*640),E*640);b.putImageData(w,0,0),v=T.toDataURL("image/png"),this.thumbCache.set(t,v)}finally{this.renderer.setRenderTarget(p),this.renderer.setClearColor(u,m),d.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return v}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.tossState){const n=this.tossState;n.t+=t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.vy-=14*t,n.mesh.rotation.x+=t*9,n.mesh.rotation.z-=t*7,n.mesh.scale.multiplyScalar(Math.max(.82,1-t*2.2)),this.dirty=!0,n.t>=n.dur&&(this.tossGroup.clear(),this.tossState=null)}if(this.item){const n=this.item.quaternion.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.pose==="hand"&&this.targetItemQuat?this.item.quaternion.slerp(this.targetItemQuat,s):(this.item.rotation.y=ne.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=ne.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=ne.lerp(this.item.rotation.z,this.targetZ,s)),n.angleTo(this.item.quaternion)>1e-4&&this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/Lx),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||Su(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const vn=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],mf={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},gf="white-night-finds-v1";function Jr(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>vn.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>vn.some(e=>e.id===t)).slice(0,3):[]}}function B_(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*vn.reduce((e,n)=>e+n.weight,0);return vn.find(e=>(t-=e.weight)<0)??vn.at(-1)}function Ro(i,t){if(t.type==="reset")return Jr();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=vn.some(n=>n.id===t.itemId)?t.itemId:vn[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function k_(i){try{const t=JSON.parse(i.getItem(gf)||"{}");return Jr((t==null?void 0:t.version)===1?t:{})}catch{return Jr()}}function H_(i,t){try{return i.setItem(gf,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const yi=Math.PI/180,G_=new Fe(-Math.sqrt(.5),0,0,Math.sqrt(.5)),Ou=new I(0,1,0),V_=new I(0,0,1);class W_{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new Fe,this.basePitch=0,this.qNow=new Fe,this.qScreen=new Fe,this.relQ=new Fe,this.fwdVec=new I,this.upVec=new I,this.euler=new xn(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){if(!Number.isFinite(t)){const r=e*yi,a=n*yi,o=s*yi,l=-Math.cos(r)*Math.sin(a),c=Math.sin(r),h=Math.cos(r)*Math.cos(a),d=Math.cos(o),p=Math.sin(o);return this.upVec.set(l*d-c*p,l*p+c*d,h).normalize(),this.qNow.setFromUnitVectors(this.upVec,Ou)}return this.euler.set(e*yi,t*yi,-n*yi,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(G_),this.qScreen.setFromAxisAngle(V_,-s*yi),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.fwdVec.set(0,0,-1).applyQuaternion(this.qNow);const o=Math.hypot(this.fwdVec.x,this.fwdVec.z)>1e-4?Math.atan2(this.fwdVec.x,-this.fwdVec.z):0;this.baseQ.setFromAxisAngle(Ou,-o),this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.basePitch=this.euler.x,this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x-this.basePitch},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/yi).toFixed(2),pitchDeg:+(this.raw.pitch/yi).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Vn=Math.PI/180,Kn=(i,t,e)=>Math.min(e,Math.max(t,i)),Bi=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},X_=1.5,q_=.5,Y_=.14,$_=.05,Z_=9,J_=.3,K_=.75,j_=3,zu=20*Vn,Bu=15*Vn,ku=6*Vn,Q_=.35,t2=3,e2=.6,Hu=1.2,Gu=.8,Vu=12*Vn;class n2{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-68,pitchMaxDeg:n=62}={}){this.yawLimit=Math.abs(t)*Vn,this.pitchMin=Math.min(e,n)*Vn,this.pitchMax=Math.max(e,n)*Vn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=Kn(t,-this.yawLimit,this.yawLimit),this.pitch=Kn(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=Kn(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>t2&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=e2?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=Kn(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=Kn(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=Bi(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=Kn(Z_*Math.max(e,1/60),J_,K_);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(Bi(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=j_&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(Bi(t.yaw-this.yaw))>zu||Math.abs(t.pitch-this.pitch)>Bu,s=!this.anchorTrack||Math.abs(Bi(t.yaw-this.anchorTrack.yaw))>zu||Math.abs(t.pitch-this.anchorTrack.pitch)>Bu;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(Bi(t.yaw-this.anchorCandidate.yaw))<=ku&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=ku?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=Q_?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(Bi(t.yaw-e.yaw))<=Vu&&Math.abs(t.pitch-e.pitch)<=Vu}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=Kn(Bi(t.yaw-this.yaw)*n,-Hu*e,Hu*e),this.pitch+=Kn((t.pitch-this.pitch)*n,-Gu*e,Gu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?X_:q_,r=n?Y_:$_,a=1-Math.exp(-s*e);this.yaw+=Kn(Bi(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=Kn((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Vn).toFixed(2),pitchDeg:+(this.pitch/Vn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Vn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Vn).toFixed(2)}:null}}}const Gn=Math.PI/180,Va=240,Wa=180,i2=62,s2=48,r2=.15,a2=.3,o2=900,l2=120,Wu=(i,t,e)=>Math.min(e,Math.max(t,i));function co(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function c2(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,d=-1e9,p=0,u=0,m=0;for(let x=0;x<e;x++)for(let y=0;y<t;y++){const _=(x*t+y)*4,{hue:T,sat:b,val:w,chroma:E}=co(i[_],i[_+1],i[_+2]);if(T<0)continue;let M=Math.abs(T-n);if(M>180&&(M=360-M),M>30||b<14||w<40||E<40)continue;m++,b>p&&(p=b),E>u&&(u=E);const S=(1-M/30)*(b/100);s+=y*S,r+=x*S,a+=S,o++,y<l&&(l=y),y>c&&(c=y),x<h&&(h=x),x>d&&(d=x)}if(o<15||a<=0)return{found:!1,bright:m,n:o};const v=c-l+1,g=d-h+1,f=o/Math.max(1,v*g);return v>t*.75||g>e*.75?{found:!1,bright:m,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:m,n:o,bbW:v,bbH:g,fill:f,maxSat:p,maxChroma:u,minX:l,maxX:c,minY:h,maxY:d}}function h2(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function Xu(i,t,e){return{yaw:-(i-e.x)*i2*Gn,pitch:(t-e.y)*s2*Gn}}function u2(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class d2{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=Va,this.canvas.height=Wa),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<l2)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,Va,Wa);const n=this.ctx.getImageData(0,0,Va,Wa);return this.processImageData(n.data,Va,Wa,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,d,p,u;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let m=0;m<2;m++){const v=this.markers[m],g=c2(t,e,n,this.defs[m].hue),f=((d=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:d[m])||null;if(v.hue=this.defs[m].hue,v.blob=g,v.found=!!g.found,v.shapeOk=u2(g,f,e,n),g.found){v.u=g.cx/Math.max(1,e),v.v=g.cy/Math.max(1,n),v.raw=Xu(v.u,v.v,o);const x=(u=(p=this.calibration)==null?void 0:p.baseRaw)==null?void 0:u[m];v.delta=x?{yaw:v.raw.yaw-x.yaw,pitch:v.raw.pitch-x.pitch}:{...v.raw}}this.updateEntity(v,g.found&&v.shapeOk,s),v.usable=!!g.found&&v.entity&&v.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=r2*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=a2*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/Gn;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/Gn,(t.delta.pitch-e.delta.pitch)/Gn);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,d)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(d.delta.yaw-l.yaw,d.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*Gn;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*Gn){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*Gn){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>Xu(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/Gn;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>o2?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){var _,T;if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=((_=this.video)==null?void 0:_.videoWidth)||r,l=((T=this.video)==null?void 0:T.videoHeight)||a,c=o/Math.max(1,l),h=n.width/n.height;let d=n.width,p=n.height,u=0,m=0;c>h+.001?(p=n.width/c,m=(n.height-p)*.5):c<h-.001&&(d=n.height*c,u=(n.width-d)*.5);const v=(t-n.left-u)/Math.max(1,d),g=(e-n.top-m)/Math.max(1,p);if(v<0||v>1||g<0||g>1)return null;const f=Wu(Math.round(v*(r-1)),0,r-1),x=Wu(Math.round(g*(a-1)),0,a-1);let y=null;for(let b=Math.max(0,x-4);b<=Math.min(a-1,x+4);b++)for(let w=Math.max(0,f-4);w<=Math.min(r-1,f+4);w++){const E=(b*r+w)*4,M=co(s[E],s[E+1],s[E+2]);M.hue>=0&&(!y||M.chroma>y.chroma)&&(y=M)}return y?{hue:y.hue,sat:y.sat,val:y.val,chroma:y.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(m=>m.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=h2(a),h=Math.round((s.u??.5)*e),d=Math.round((s.v??.5)*n),p=Math.max(4,Math.round(s.w??56)),u=Math.max(4,Math.round(s.h??28));for(let m=Math.max(0,d-Math.floor(u/2));m<Math.min(n,d+Math.ceil(u/2));m++)for(let v=Math.max(0,h-Math.floor(p/2));v<Math.min(e,h+Math.ceil(p/2));v++){const g=(m*e+v)*4;t[g]=o,t[g+1]=l,t[g+2]=c,t[g+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/Gn).toFixed(2),pitchDeg:+(e.pitch/Gn).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const Xa=Math.PI/180;class f2{constructor(t=null){this.gyro=new W_,this.fusion=new n2,this.tracker=new d2(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/Xa).toFixed(2),pitchDeg:+(this.look.pitch/Xa).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/Xa).toFixed(2),pitchDeg:+(this.markerSample.pitch/Xa).toFixed(2)}}}}const p2=Math.PI/180;class m2{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/p2,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const ss=200,rs=150,g2=90,Mi=8,as=6,v2=400;function qu(i,t){const e=Math.abs(i-t)%360;return e>180?360-e:e}function Yu(i,t,e,n,s=34){const r=t/Mi,a=e/as,o=new Float64Array(Mi*as),l=new Float64Array(Mi*as),c=new Float64Array(Mi*as);for(let O=0;O<e;O++){const F=Math.min(as-1,O/a|0),H=O*t*4;for(let B=0;B<t;B++){const X=H+B*4,G=i[X],Q=i[X+1],rt=i[X+2],{hue:pt,sat:zt,val:Ct,chroma:$}=co(G,Q,rt);if(pt<0||Ct<72)continue;const nt=Ct>=205?20:36,mt=Ct>=205?34:52;if(zt<nt||$<mt)continue;const xt=qu(pt,n);if(xt>s)continue;const bt=(1-xt/(s+1))*(.35+zt/100*.65)*Math.pow(Ct/255,1.35),Wt=F*Mi+Math.min(Mi-1,B/r|0);o[Wt]+=bt,l[Wt]+=B*bt,c[Wt]+=O*bt}}let h=0,d=t*.5,p=e*.5;for(let O=0;O<as;O++)for(let F=0;F<Mi;F++){let H=0,B=0,X=0;for(let G=0;G<=1&&O+G<as;G++)for(let Q=0;Q<=1&&F+Q<Mi;Q++){const rt=(O+G)*Mi+(F+Q);H+=o[rt],B+=l[rt],X+=c[rt]}H>h&&(h=H,d=B/H,p=X/H)}if(h<1.2)return{found:!1,count:0};const u=Math.max(22,Math.round(Math.min(t,e)*.24)),m=Math.max(0,Math.floor(d-u)),v=Math.min(t-1,Math.ceil(d+u)),g=Math.max(0,Math.floor(p-u)),f=Math.min(e-1,Math.ceil(p+u));let x=0,y=0,_=0,T=0,b=t,w=-1,E=e,M=-1;for(let O=g;O<=f;O++){const F=O*t*4;for(let H=m;H<=v;H++){if(Math.hypot(H-d,O-p)>u)continue;const B=F+H*4,X=i[B],G=i[B+1],Q=i[B+2],{hue:rt,sat:pt,val:zt,chroma:Ct}=co(X,G,Q);if(rt<0||zt<72)continue;const $=zt>=205?20:36,nt=zt>=205?34:52;if(pt<$||Ct<nt)continue;const mt=qu(rt,n);if(mt>s)continue;const xt=(1-mt/(s+1))*(.35+pt/100*.65)*(zt/255);x+=H*xt,y+=O*xt,_+=xt,T++,H<b&&(b=H),H>w&&(w=H),O<E&&(E=O),O>M&&(M=O)}}if(T<7||_<=0)return{found:!1,count:0};const S=w-b+1,R=M-E+1,D=T/Math.max(1,S*R);if(S>t*.45||R>e*.45||D<.25)return{found:!1,count:0};const L=x/_,N=y/_;return{found:!0,count:T,u:(L+.5)/t,v:(N+.5)/e,bbW:S,bbH:R,fill:D}}class x2{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.synthetic=!1,this.error=null,this.distalHue=144,this.proximalHue=320,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=ss,this.canvas.height=rs),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastProcessAt=0,this.processMs=0,this.lastPairAt=-1e4,this.lastPairPos={u:.5,v:.55,spanNorm:.12},this.latest={status:"none",u:.5,v:.55,spanNorm:0,rollRad:0,distalFound:!1,proximalFound:!1,ts:0}}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}this.video&&this.video.srcObject&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}analyzeRgba(t,e=ss,n=rs,s=performance.now(),r=n/e){const a=Yu(t,e,n,this.distalHue),o=Yu(t,e,n,this.proximalHue);return this._commitSpots(a,o,e,n,s,r)}_commitSpots(t,e,n,s,r,a=s/n){const o=Number.isFinite(a)&&a>.1?a:s/n,l=1.25/Math.hypot(1,o);if(t.found&&e.found){const h=(t.u-e.u)*l,d=(t.v-e.v)*o*l,p=Math.hypot(h,d),u=Math.max(1,t.count||1),m=Math.max(1,e.count||1),v=Math.max(u/m,m/u);if(p>=.018&&p<=.58&&v<=9){const g=(t.u+e.u)*.5,f=(t.v+e.v)*.5;return this.lastPairAt=r,this.lastPairPos={u:g,v:f,spanNorm:p},this.latest={status:"pair",u:g,v:f,spanNorm:p,rollRad:Math.atan2(-d,h),distalFound:!0,proximalFound:!0,ts:r},this.latest}}const c=t.found?t:e.found?e:null;return c&&r-this.lastPairAt<=v2&&Math.hypot(c.u-this.lastPairPos.u,c.v-this.lastPairPos.v)<=.2?(this.latest={status:"single",u:c.u,v:c.v,spanNorm:this.lastPairPos.spanNorm,rollRad:this.latest.rollRad,distalFound:!!t.found,proximalFound:!!e.found,ts:r},this.latest):(this.latest={...this.latest,status:"none",distalFound:!1,proximalFound:!1},this.latest)}process(t=!1,e=performance.now()){if(this.synthetic)return this.latest;if(!this.running||!this.video||!this.ctx||this.video.readyState<2)return this.latest;if(!t&&e-this.lastProcessAt<g2)return this.latest;const n=performance.now();this.lastProcessAt=e;try{const s=this.video.videoWidth||ss,r=this.video.videoHeight||rs;this.ctx.drawImage(this.video,0,0,ss,rs);const a=this.ctx.getImageData(0,0,ss,rs);this.analyzeRgba(a.data,ss,rs,e,r/s)}catch{}return this.processMs=+(performance.now()-n).toFixed(2),this.latest}inject({distal:t=null,proximal:e=null}={},n=performance.now()){this.synthetic=!0,this.running=!0;const s=t?{found:!0,u:t.u,v:t.v,count:t.count??90}:{found:!1,count:0},r=e?{found:!0,u:e.u,v:e.v,count:e.count??90}:{found:!1,count:0};return this._commitSpots(s,r,ss,rs,n)}sample(t=performance.now()){const e=this.latest.ts?t-this.latest.ts:1/0;return{...this.latest,fresh:e<=450&&this.latest.status!=="none",ageMs:Number.isFinite(e)?Math.round(e):null}}info(){const t=this.sample();return{running:this.running,synthetic:this.synthetic,error:this.error,status:t.status,fresh:t.fresh,u:+t.u.toFixed(3),v:+t.v.toFixed(3),spanNorm:+t.spanNorm.toFixed(4),rollDeg:+(t.rollRad*180/Math.PI).toFixed(1),distalFound:t.distalFound,proximalFound:t.proximalFound,processMs:this.processMs}}}const pe=Math.PI/180,wi=180/Math.PI,_c=.33,yc=.31;function se(i,t,e){return i<t?t:i>e?e:i}function mn([i,t,e,n]){const s=Math.hypot(i,t,e,n);return s<1e-9?[0,0,0,1]:[i/s,t/s,e/s,n/s]}function Si([i,t,e,n]){return[-i,-t,-e,n]}function qe(i,t){const[e,n,s,r]=i,[a,o,l,c]=t;return[r*a+e*c+n*l-s*o,r*o-e*l+n*c+s*a,r*l+e*o-n*a+s*c,r*c-e*a-n*o-s*l]}function qs([i,t,e],n){const s=Math.hypot(i,t,e);if(s<1e-9)return[0,0,0,1];const r=n*.5,a=Math.sin(r)/s;return[i*a,t*a,e*a,Math.cos(r)]}function Ge(i,t){const[e,n,s,r]=i,[a,o,l]=t,c=r*a+n*l-s*o,h=r*o+s*a-e*l,d=r*l+e*o-n*a,p=-e*a-n*o-s*l;return[c*r+p*-e+h*-s-d*-n,h*r+p*-n+d*-e-c*-s,d*r+p*-s+c*-n-h*-e]}function _2(i,t){const e=Math.abs(i[0]*t[0]+i[1]*t[1]+i[2]*t[2]+i[3]*t[3]);return 2*Math.acos(se(e,0,1))}function _l(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function Pr(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function Ti(i){const t=Math.hypot(i[0],i[1],i[2]);return t<1e-9?[1,0,0]:[i[0]/t,i[1]/t,i[2]/t]}function $u(i,t,e){const n=i[0],s=t[0],r=e[0],a=i[1],o=t[1],l=e[1],c=i[2],h=t[2],d=e[2],p=n+o+d;let u,m,v,g;if(p>0){const f=Math.sqrt(p+1)*2;g=.25*f,u=(h-l)/f,m=(r-c)/f,v=(a-s)/f}else if(n>o&&n>d){const f=Math.sqrt(1+n-o-d)*2;g=(h-l)/f,u=.25*f,m=(s+a)/f,v=(r+c)/f}else if(o>d){const f=Math.sqrt(1+o-n-d)*2;g=(r-c)/f,u=(s+a)/f,m=.25*f,v=(l+h)/f}else{const f=Math.sqrt(1+d-n-o)*2;g=(a-s)/f,u=(r+c)/f,m=(l+h)/f,v=.25*f}return mn([u,m,v,g])}function y2(i,t,e=_c,n=yc,s=[.42,-.88,.2]){const r=i.x??i[0]??0,a=i.y??i[1]??0,o=i.z??i[2]??0,l=t.x??t[0]??0,c=t.y??t[1]??0,h=t.z??t[2]??0,d=l-r,p=c-a,u=h-o,m=Math.hypot(d,p,u),v=Math.abs(e-n)+.045,g=e+n-.008,f=se(m,v,g),x=m>1e-6?d/m:0,y=m>1e-6?p/m:0,_=m>1e-6?u/m:-1,T={x:r+x*f,y:a+y*f,z:o+_*f},b=(e*e-n*n+f*f)/(2*f),w=Math.sqrt(Math.max(0,e*e-b*b)),E=Ti(s),M=E[0]*x+E[1]*y+E[2]*_;let S=E[0]-M*x,R=E[1]-M*y,D=E[2]-M*_,L=Math.hypot(S,R,D);if(L<1e-5){const H=Pr([x,y,_],[1,0,0]),B=Ti(H);S=B[0],R=B[1],D=B[2],L=1}else S/=L,R/=L,D/=L;const N={x:r+x*b+S*w,y:a+y*b+R*w,z:o+_*b+D*w},O=se((e*e+n*n-f*f)/(2*e*n),-1,1),F=(Math.PI-Math.acos(O))*wi;return{shoulder:{x:r,y:a,z:o},elbow:N,wrist:T,elbowBendDeg:F,clampedDist:f}}class M2{constructor(t="right"){const e=typeof t=="string"?t:t==null?void 0:t.handSide;this.handSide=e==="left"?"left":"right",this.qStretch=null,this.qBend=null,this.qBasis=[0,0,0,1],this.qRefInv=[0,0,0,1],this.bendSpanRad=52*pe,this.bendInwardYawRad=0,this.yawTrimRad=0,this.pendingSessionRecenter=!1,this.pendingRecenterWindowSec=0,this.calibratedStep=0;const n=this._defaultBeaconU();this.beaconFar={u:n,v:.54,span:.105,captured:!1},this.beaconNear={u:n,v:.64,span:.235,captured:!1},this.lastSensor=null,this.sensorSilentSec=0,this.prevQuat=null,this.prevFwd=null,this.torsoYaw=0;const s=this.sideSign;this.torsoWristPos={x:s*.16,y:-.22,z:-.5},this.torsoWristVel={x:0,y:0,z:0},this.qArm=[0,0,0,1],this.qArmTorso=[0,0,0,1],this.shoulderPos={x:s*.21,y:-.27,z:-.08},this.elbowPos={x:s*.24,y:-.44,z:-.26},this.pos={x:s*.16,y:-.22,z:-.5},this.vel={x:0,y:0,z:0},this.elbowBendDeg=68,this.reach=.25,this.elevationDeg=0,this.screenFacingCos=.85,this.trackingSource="idle",this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.lastPokeAt=-1e3,this.dwellAccumSec=0,this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=0,this.maxInspectPitchRad=0,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0,this.lastDecisionAt=-2e3}get sideSign(){return this.handSide==="left"?-1:1}_defaultBeaconU(){return this.handSide==="left"?.46:.54}setHandSide(t){const e=t==="left"?"left":"right";if(e===this.handSide)return this.handSide;this.handSide=e;const n=this.sideSign;return this.beaconFar.captured||(this.beaconFar.u=this._defaultBeaconU()),this.beaconNear.captured||(this.beaconNear.u=this._defaultBeaconU()),this.torsoWristPos={x:n*Math.abs(this.torsoWristPos.x),y:this.torsoWristPos.y,z:this.torsoWristPos.z},this.torsoWristVel={x:0,y:0,z:0},this.shoulderPos={x:n*.21,y:-.27,z:-.08},this.elbowPos={x:n*.24,y:-.44,z:-.26},this.pos={x:n*Math.abs(this.pos.x),y:this.pos.y,z:this.pos.z},this.vel={x:0,y:0,z:0},this.handSide}exportCalibration(){return this.calibratedStep<2?null:{handSide:this.handSide,qStretch:this.qStretch,qBend:this.qBend,qBasis:this.qBasis,qRefInv:this.qRefInv,bendSpanRad:this.bendSpanRad,bendInwardYawRad:this.bendInwardYawRad,beaconFar:this.beaconFar,beaconNear:this.beaconNear}}importCalibration(t){return!t||!Array.isArray(t.qBasis)||!Array.isArray(t.qRefInv)?!1:((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.qStretch=t.qStretch||[0,0,0,1],this.qBend=t.qBend||[0,0,0,1],this.qBasis=mn(t.qBasis),this.qRefInv=mn(t.qRefInv),this.bendSpanRad=se(Number(t.bendSpanRad)||52*pe,15*pe,125*pe),this.bendInwardYawRad=Number(t.bendInwardYawRad)||0,t.beaconFar&&(this.beaconFar={...this.beaconFar,...t.beaconFar,u:this._defaultBeaconU(),v:.54}),t.beaconNear&&(this.beaconNear={...this.beaconNear,...t.beaconNear,u:se(this._defaultBeaconU()-this.sideSign*.03,.15,.85),v:.64}),this.calibratedStep=2,this.yawTrimRad=0,!0)}feedSensor(t){!t||!Array.isArray(t.q)||t.q.length!==4||((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.lastSensor={q:mn(t.q),linMag:Math.max(0,Number(t.linMag)||0),rotRate:Math.max(0,Number(t.rotRate)||0),acc:Array.isArray(t.acc)?t.acc:[0,0,0],ts:t.ts??performance.now()},this.sensorSilentSec=0)}calibrateStretchPose(t=this.lastSensor,e=null){if(!(t!=null&&t.q))return{ok:!1,message:"Нет сигнала от гироскопа на запястье. Подключите браслет."};this.qStretch=mn(t.q);const n=Ti(Ge(Si(this.qStretch),[0,1,0]));let s=[0,0,1];Math.abs(_l(s,n))>.9&&(s=[0,1,0]);const r=Ti(Pr(n,s)),a=Ti(Pr(r,n));this.qBasis=$u(r,n,a),this.qRefInv=Si(qe(this.qStretch,this.qBasis)),this.yawTrimRad=0,this.torsoYaw=0;const o=this._defaultBeaconU();e&&e.fresh&&e.status!=="none"&&e.spanNorm>.015?this.beaconFar={u:o,v:.54,span:se(e.spanNorm,.02,.42),captured:!0}:this.beaconFar={u:o,v:.54,span:.105,captured:!1},this.calibratedStep=1;const l=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:1,beaconCaptured:this.beaconFar.captured,message:`Шаг 1 записан (прямая ${l}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`}}calibrateBendPose(t=this.lastSensor,e=null){if(!this.qStretch)return{ok:!1,message:"Сначала выполните Шаг 1 — вытяните прямую руку вперёд."};if(!(t!=null&&t.q))return{ok:!1,message:"Нет свежего сигнала гироскопа с браслета."};const n=mn(t.q),s=qe(Si(this.qStretch),n),r=s[3]<0?-1:1;s[0]*r,s[1]*r,s[2]*r;const a=se(s[3]*r,-1,1);if(2*Math.acos(se(a,0,1))<12*pe)return{ok:!1,message:"Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз."};const l=Ti(Ge(Si(this.qStretch),[0,1,0])),c=Ti(Ge(Si(n),[0,1,0])),h=se(_l(c,l),-1,1),d=[c[0]-h*l[0],c[1]-h*l[1],c[2]-h*l[2]],p=Math.hypot(d[0],d[1],d[2]);if(p<Math.sin(13*pe))return{ok:!1,message:"Поднимите предплечье в локте вверх хотя бы на 20° выше горизонтали (не выворачивая кисть)."};const u=[d[0]/p,d[1]/p,d[2]/p],m=[-u[0],-u[1],-u[2]],v=Ti(Pr(l,m)),g=Ti(Pr(m,v)),f=$u(v,g,m),x=Si(qe(this.qStretch,f)),y=qe(x,qe(n,f)),_=Ge(y,[0,0,-1]),T=Math.atan2(p,h);this.qBend=n,this.qBasis=f,this.qRefInv=x,this.bendSpanRad=se(T,18*pe,115*pe),this.bendInwardYawRad=Math.atan2(_[0],Math.max(.15,-_[2])),this.yawTrimRad=0;const b=se(this._defaultBeaconU()-this.sideSign*.03,.15,.85);e&&e.fresh&&e.status!=="none"&&e.spanNorm>this.beaconFar.span*1.12?this.beaconNear={u:b,v:.64,span:se(e.spanNorm,this.beaconFar.span+.04,.58),captured:!0}:this.beaconNear={u:b,v:.64,span:se(this.beaconFar.span*1.95,this.beaconFar.span+.07,.45),captured:!1},this.calibratedStep=2;const w=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:2,handSide:this.handSide,bendDeg:+(T*wi).toFixed(1),beaconCaptured:this.beaconFar.captured&&this.beaconNear.captured,message:`Калибровка готова (${w}, сгиб ${Math.round(T*wi)}°). Можно надевать очки!`}}recenterOnSessionStart(t=performance.now()){var l;if(this.torsoYaw=0,this.pendingSessionRecenter=!1,this.pendingRecenterWindowSec=0,!((l=this.lastSensor)!=null&&l.q)||!this.qStretch||this.sensorSilentSec>1.6||t-this.lastSensor.ts>2e3)return;const e=mn(qe(this.qRefInv,qe(this.lastSensor.q,this.qBasis))),n=Ge(e,[0,0,-1]);if(Math.asin(se(n[1],-1,1))>32*pe||this.lastSensor.rotRate>38||this.lastSensor.linMag>1.3){this.pendingSessionRecenter=!0,this.pendingRecenterWindowSec=10;return}if(Math.hypot(n[0],n[2])<.35)return;const o=Math.atan2(n[0],-n[2]);Math.abs(o)>22*pe&&(this.yawTrimRad=o)}_currentTorsoQuat(){var t;if((t=this.lastSensor)!=null&&t.q&&this.qStretch){const e=qs([0,1,0],this.yawTrimRad+this.torsoYaw);return mn(qe(e,qe(this.qRefInv,qe(this.lastSensor.q,this.qBasis))))}return[...this.qArmTorso]}onPhaseChange(t,e=performance.now()){if(t==="inspect"){const n=this._currentTorsoQuat(),s=Ge(n,[0,0,-1]);this.inspectBaseQ=[...n],this.inspectPrevQ=[...n],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=e,this.maxInspectPitchRad=Math.asin(se(s[1],-1,1)),this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0}else this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.calmLowerSec=0;t==="search"&&(this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0)}update(t,{beacon:e=null,phase:n="search",revealReady:s=!1,handOverBin:r=!0,headLook:a={yaw:0,pitch:0},now:o=performance.now()}={}){const l=se(t||.016666666666666666,.001,.1),c=this.lastSensor;if(!(c!=null&&c.q))return this.trackingSource="idle",this.snapshot({pokes:0,decision:null,throwVel:null});this.qStretch||this.calibrateStretchPose(c,e);const h=this.sideSign,d=Number.isFinite(a==null?void 0:a.yaw)?a.yaw:0,p=Number.isFinite(a==null?void 0:a.pitch)?a.pitch:0,u=mn(qe(this.qRefInv,qe(c.q,this.qBasis)));if(this.pendingSessionRecenter)if(this.pendingRecenterWindowSec-=l,this.pendingRecenterWindowSec<=0)this.pendingSessionRecenter=!1;else{const vt=Ge(u,[0,0,-1]),P=Math.asin(se(vt[1],-1,1)),A=Math.hypot(vt[0],vt[2]);if(P<=28*pe&&P>=-32*pe&&A>=.45&&c.rotRate<=35&&c.linMag<=1.2){const W=Math.atan2(vt[0],-vt[2]);Math.abs(W)>22*pe&&(this.yawTrimRad=W),this.pendingSessionRecenter=!1}}const m=mn(qe(qs([0,1,0],this.yawTrimRad),u)),v=Ge(m,[0,0,-1]),g=Math.hypot(v[0],v[2]);let f=this.torsoYaw;if(n==="search"&&g>.35){const vt=Math.atan2(v[0],-v[2]),P=d-this.torsoYaw,A=vt-this.torsoYaw,W=P>=0?se(A,0,P):se(A,P,0);f=se(this.torsoYaw+W,d-50*pe,d+50*pe)}else f=se(this.torsoYaw,d-50*pe,d+50*pe);const x=f-this.torsoYaw;Math.abs(x)>18*pe&&(this.torsoYaw+=(x-Math.sign(x)*18*pe)*.45),this.torsoYaw+=(f-this.torsoYaw)*Math.min(1,l*3.2);const y=d-this.torsoYaw,_=qe(qs([1,0,0],-p),qs([0,1,0],y)),T=Si(_),b=qs([0,1,0],this.yawTrimRad+this.torsoYaw);this.qArmTorso=mn(qe(b,u)),this.qArm=mn(qe(_,this.qArmTorso));let w=c.rotRate;this.prevQuat&&w<1&&(w=_2(this.prevQuat,this.qArmTorso)/l*wi),this.prevQuat=[...this.qArmTorso];const E=this.sensorSilentSec;this.sensorSilentSec+=l;const M=E>.12?Math.exp(-(E-.12)*8):1,S=c.linMag*M;w*=M;const R=E>1.6,D=Ge(Si(this.qBasis),[0,0,1]),L=Ge(this.qArm,D);this.screenFacingCos=L[2];const N=Ge(this.qArmTorso,[0,0,-1]);let O=0;if(this.prevFwd){const vt=se(_l(this.prevFwd,N),-1,1);O=Math.acos(vt)/l*wi}this.prevFwd=[...N];const F=Math.asin(se(N[1],-1,1)),H=Math.atan2(N[0],Math.max(.12,Math.hypot(N[2],N[1]*.35)));this.elevationDeg=+(F*wi).toFixed(1);const B=se(-h*H/(28*pe),-.35,1),X=se((F-(this.bendSpanRad+6*pe))/(26*pe),0,1);let G,Q=0;if(F>=0){const vt=se(F/Math.max(.32,this.bendSpanRad),0,1.15),P=se(.96+B*.12-X*.78,.18,1.05);G=se(1-vt*.84*P,.12,1.02),Q=X*.08+se(F/(75*pe),0,1)*.04}else{const vt=se(-F/(72*pe),0,1);G=se(1-vt*.62,.28,1.02),Q=-vt*.035}const rt={x:h*.21,y:-.27+Q,z:-.08},pt=_c+yc-.015,zt=.25;let Ct,$;if(F<-8*pe){const vt=se(-F/(70*pe),0,1);Ct=.56-vt*.09,$={x:rt.x+N[0]*Ct*.82-h*(1-vt)*.06,y:rt.y+N[1]*Ct*.95+(1-vt)*.14,z:rt.z-Math.max(.18,-N[2])*Ct*.96}}else{Ct=zt+G*(pt-zt);const vt=1-G;$={x:rt.x+N[0]*Ct*.88-h*(.09+vt*.03),y:rt.y+N[1]*(.2+G*.36+X*.18)+G*.15,z:rt.z-(.28+G*.31)*se(-N[2]+vt*.45,.36,1.05)}}let nt=G;if(e&&e.fresh&&e.status!=="none"&&this.screenFacingCos>.18)if(this.trackingSource="gyro+beacon",e.status==="pair"&&e.spanNorm>.015){const vt=se(this.screenFacingCos,.42,1),P=e.spanNorm/vt,A=Math.max(.035,this.beaconNear.span-this.beaconFar.span),W=se((this.beaconNear.span-P)/A,.06,1.06);nt=G*.35+W*.65;const K=-.38-W*.32,ht=se((e.u-this.beaconFar.u)*1.15+h*.1,-.54,.54),Z=se((this.beaconFar.v-e.v)*.94-.11,-.56,.46),wt=Ge(T,[ht,Z,K]);$.x=$.x*.32+wt[0]*.68,$.y=$.y*.32+wt[1]*.68,$.z=$.z*.35+wt[2]*.65;const gt=Ge(_,[rt.x+N[0]*.48-h*.08,rt.y+N[1]*.35,-.55]),Pt=se(this.beaconFar.u+(gt[0]-h*.1)*.65,.1,.9),Ut=e.u-Pt,_t=12*pe*l;this.yawTrimRad=se(this.yawTrimRad-se(Ut*.35,-_t,_t),-180*pe,180*pe)}else{const vt=se((e.u-this.beaconFar.u)*1.1+h*.1,-.52,.52),P=se((this.beaconFar.v-e.v)*.9-.11,-.54,.44),A=Ge(T,[vt,P,$.z]);$.x=$.x*.55+A[0]*.45,$.y=$.y*.55+A[1]*.45}else this.trackingSource=R?"stale":"gyro-only";const xt=26,bt=Math.max(1,Math.ceil(l/.017)),Wt=l/bt;for(let vt=0;vt<bt;vt++)for(const P of["x","y","z"]){const A=$[P]-this.torsoWristPos[P],W=xt*xt*A-2*xt*this.torsoWristVel[P];this.torsoWristVel[P]+=W*Wt,this.torsoWristPos[P]+=this.torsoWristVel[P]*Wt}this.reach+=(nt-this.reach)*(1-Math.exp(-l*18));const Qt=se((this.torsoWristPos.y+.1)*.55,-.15,.42),z=[h*.44,-.86+Qt,.22],lt=y2(rt,this.torsoWristPos,_c,yc,z);this.torsoWristPos={...lt.wrist},this.elbowBendDeg=+lt.elbowBendDeg.toFixed(1);const ct=Ge(_,[lt.shoulder.x,lt.shoulder.y,lt.shoulder.z]),J=Ge(_,[lt.elbow.x,lt.elbow.y,lt.elbow.z]),j=Ge(_,[lt.wrist.x,lt.wrist.y,lt.wrist.z]),at=Ge(_,[this.torsoWristVel.x,this.torsoWristVel.y,this.torsoWristVel.z]);this.shoulderPos={x:ct[0],y:ct[1],z:ct[2]},this.elbowPos={x:J[0],y:J[1],z:J[2]},this.pos={x:j[0],y:j[1],z:j[2]},this.vel={x:at[0],y:at[1],z:at[2]};let st=0,ut=null,Bt=null;if(R)return this.dwellAccumSec=0,this.calmLowerSec=0,this.snapshot({pokes:0,decision:null,throwVel:null,pitchUpDeg:+(F*wi).toFixed(1)});if(n==="search")if(this.reach>=.6&&r){this.rummageAnchorYaw===null&&(this.rummageAnchorYaw=H,this.rummageAnchorPitch=F);const P=H-this.rummageAnchorYaw,A=F-this.rummageAnchorPitch,W=Math.hypot(P,A)*wi,ht=(Math.abs(P)>=Math.abs(A)?P:A)>=0?1:-1,Z=o-this.lastPokeAt>=270,wt=W>=6.8&&(this.rummageDir===0||ht!==this.rummageDir),gt=S>=1.35&&w>=28;Z&&(wt||gt)?(st=1,this.lastPokeAt=o,this.rummageDir=ht,this.rummageAnchorYaw=H,this.rummageAnchorPitch=F,this.dwellAccumSec=0):(w>=12||S>=.55)&&(this.dwellAccumSec+=l,this.dwellAccumSec>=.62&&Z&&(st=1,this.lastPokeAt=o,this.dwellAccumSec=0))}else this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0;else if(n==="inspect"){(!this.inspectBaseQ||!this.inspectPrevQ)&&(this.inspectBaseQ=[...this.qArmTorso],this.inspectPrevQ=[...this.qArmTorso],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=o,this.maxInspectPitchRad=F,this.itemRot={x:0,y:0,z:0}),F>this.maxInspectPitchRad&&(this.maxInspectPitchRad=F);let vt=mn(qe(this.qArmTorso,Si(this.inspectPrevQ)));this.inspectPrevQ=[...this.qArmTorso],vt[3]<0&&(vt=[-vt[0],-vt[1],-vt[2],-vt[3]]);const P=Math.hypot(vt[0],vt[1],vt[2]);if(P>1e-7){const K=2*Math.atan2(P,vt[3])/P,ht=vt[0]*K,Z=vt[1]*K,wt=vt[2]*K,gt=ht*1.55,Pt=Z*1.75-wt*.7,Ut=wt*1.25,_t=Math.hypot(gt,Pt,Ut);if(_t>1e-8){const It=qs([gt,Pt,Ut],_t);this.inspectItemQ=mn(qe(It,this.inspectItemQ))}this.itemRot={x:this.itemRot.x+gt,y:this.itemRot.y+Pt,z:this.itemRot.z+Ut}}if(s&&o-this.inspectEnteredAt>=450&&o-this.lastDecisionAt>=900){const W=S>=7.2,K=w>=245&&S>=2.4,ht=w>=310&&O>=195;if(W||K||ht){ut="discard",this.lastDecisionAt=o,this.calmLowerSec=0;const Z=Ge(this.qArm,[0,0,-1]),wt=Z[0]>=0?1:-1;Bt={x:se(Z[0]*7.5+wt*3.8+this.vel.x*2.2,-9.5,9.5),y:se(Z[1]*4.5+2.2+this.vel.y*1.8,.5,7.5),z:-6.8}}else{const Z=this.maxInspectPitchRad-F,wt=F<=-21*pe&&Z>=16*pe||F<=-38*pe||lt.wrist.y<=-.38&&Z>=14*pe,gt=S<3.1&&w<105;wt&&gt?(this.calmLowerSec+=l,this.calmLowerSec>=.65&&(ut="keep",this.lastDecisionAt=o,this.calmLowerSec=0)):this.calmLowerSec=Math.max(0,this.calmLowerSec-l*2.2)}}}return this.snapshot({pokes:st,decision:ut,throwVel:Bt,pitchUpDeg:+(F*wi).toFixed(1)})}snapshot(t={}){return{handSide:this.handSide,calibratedStep:this.calibratedStep,trackingSource:this.trackingSource,torsoYaw:+this.torsoYaw.toFixed(4),qArm:[...this.qArm],shoulderPos:{...this.shoulderPos},elbowPos:{...this.elbowPos},pos:{...this.pos},vel:{x:+this.vel.x.toFixed(3),y:+this.vel.y.toFixed(3),z:+this.vel.z.toFixed(3)},elbowBendDeg:this.elbowBendDeg,elevationDeg:this.elevationDeg,reach:+this.reach.toFixed(3),screenFacingCos:+this.screenFacingCos.toFixed(3),itemRot:{...this.itemRot},itemQuat:[...this.inspectItemQ],calmLowerProgress:+se(this.calmLowerSec/.65,0,1).toFixed(2),...t}}}const S2="modulepreload",b2=function(i,t){return new URL(i,t).href},Zu={},Ju=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=a(e.map(h=>{if(h=b2(h,n),h in Zu)return;Zu[h]=!0;const d=h.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const g=o[v];if(g.href===h&&(!d||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${p}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":S2,d||(m.as="script"),m.crossOrigin="",m.href=h,c&&m.setAttribute("nonce",c),document.head.appendChild(m),d)return new Promise((v,g)=>{m.addEventListener("load",v),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},Ku="https://www.gstatic.com/firebasejs/11.0.1",vf="ckc_stand_cfg",xf="wn_firebase_cfg",w2="wn-wrist-demo-v1",T2=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];function E2(i){if(!i||typeof i!="string")return null;const t=i.trim();if(!t)return null;if(/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(t))return{databaseURL:t.replace(/\/$/,"")};try{const r=JSON.parse(t);if(r&&typeof r=="object"&&(r.databaseURL||r.projectId))return r}catch{}const e={},n=/([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;let s;for(;(s=n.exec(t))!==null;)e[s[1]]=s[3];return!e.databaseURL&&e.projectId&&(e.databaseURL=`https://${e.projectId}-default-rtdb.firebaseio.com`),e.databaseURL?e:null}function A2(){try{return localStorage.getItem(vf)||localStorage.getItem(xf)||""}catch{return""}}function R2(i){try{localStorage.setItem(vf,i),localStorage.setItem(xf,i)}catch{}}function ju(){return String(Math.floor(1e5+Math.random()*9e5))}function C2(){return"h"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}function Qu(i){if(!i||typeof i!="string")return!1;const t=i.trim().toLowerCase();return!!(t.endsWith(".local")||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(t)||t.startsWith("fd")||t.startsWith("fc")||t.startsWith("fe80:"))}class P2{constructor({onSensor:t,onCalCommand:e,onHandSide:n,onStatus:s}={}){this.onSensor=t||(()=>{}),this.onCalCommand=e||(()=>{}),this.onHandSide=n||(()=>{}),this.onStatus=s||(()=>{}),this.mode="off",this.roomCode="",this.connected=!1,this.p2pOpen=!1,this.routeKind="idle",this.rttMs=null,this.rxHz=0,this.error=null,this.db=null,this.fbMod=null,this.unsubs=[],this.bc=null,this.pc=null,this.dcFast=null,this.dcCtrl=null,this.hid="",this.pendingCandidates=[],this.attempt=0,this.offerInFlight=!1,this.offerStartedAt=0,this.preferLanOnly=!1,this.peerJoined=!1,this.peerSid="",this.hostHandSide="right",this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastAnyRxAt=0,this.lastSeq=-1,this.seenCalIds=new Set,this.rxTimes=[],this.pingTimer=null,this.watchdogTimer=null,this.wakeLock=null}async acquireWakeLock(){var t,e,n;try{typeof navigator<"u"&&((t=navigator.wakeLock)!=null&&t.request)&&!this.wakeLock&&(this.wakeLock=await navigator.wakeLock.request("screen"),(n=(e=this.wakeLock).addEventListener)==null||n.call(e,"release",()=>{this.wakeLock=null}))}catch{}}releaseWakeLock(){var t,e;try{(e=(t=this.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}this.wakeLock=null}startDemo(t=this.roomCode||ju(),e=this.hostHandSide){return this.stop(),this.mode="demo",this.roomCode=String(t),this.hostHandSide=e==="left"?"left":"right",this.routeKind="demo",this.error=null,typeof BroadcastChannel<"u"&&(this.bc=new BroadcastChannel(w2),this.bc.onmessage=n=>{var r;const s=n==null?void 0:n.data;if(!(!s||String(s.room)!==this.roomCode))if(s.k==="hello")this.connected=!0,this.p2pOpen=!0,this.lastSeq=-1,s.sid&&(this.peerSid=String(s.sid)),s.explicitSide&&(s.side==="left"||s.side==="right")&&(this.hostHandSide=s.side,this.onHandSide(s.side)),(r=this.bc)==null||r.postMessage({k:"ack",room:this.roomCode,side:this.hostHandSide,ts:Date.now()}),this._emitStatus();else if(s.k==="wrist")this.connected=!0,this.p2pOpen=!0,this._handlePacket(s,!0);else if(s.k==="cal"&&s.step){const a=s.id||`${s.step}:${s.ts||0}`;this.seenCalIds.has(a)||(this.seenCalIds.add(a),this.onCalCommand(s.step))}else s.k==="hand_side"&&(s.side==="left"||s.side==="right")&&this.onHandSide(s.side)}),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"demo"}}async startFirebase(t,e=this.hostHandSide){const n=E2(t);if(!n)return this.error="Вставьте корректный firebaseConfig или URL Realtime Database",this._emitStatus(),{ok:!1,error:this.error};R2(t),this.stop(),this.mode="firebase",this.roomCode=ju(),this.hostHandSide=e==="left"?"left":"right",this.error=null;try{const[{initializeApp:s,getApps:r,deleteApp:a},o]=await Promise.all([Ju(()=>import(`${Ku}/firebase-app.js`),[],import.meta.url),Ju(()=>import(`${Ku}/firebase-database.js`),[],import.meta.url)]),l=r().find(f=>f.name==="wn-wrist-host");if(l)try{await a(l)}catch{}const c=s(n,"wn-wrist-host");this.db=o.getDatabase(c,n.databaseURL),this.fbMod=o;const{ref:h,set:d,onValue:p,onChildAdded:u,onDisconnect:m}=o,v=`wn_wrist_rooms/${this.roomCode}`;await d(h(this.db,v),{createdAt:Date.now(),hostAlive:!0,hostHandSide:{side:this.hostHandSide,ts:Date.now()}});try{m(h(this.db,`${v}/hostAlive`)).remove()}catch{}this.unsubs.push(p(h(this.db,`${v}/wristJoined`),f=>{f.val()&&(this.peerJoined=!0,this.connected=!0,this.lastSeq=-1,!this.isFastHealthy()&&!this._isOfferNegotiating()&&this._startRtcOffer(!1),this._emitStatus())})),this.unsubs.push(p(h(this.db,`${v}/fbInput`),f=>{const x=f.val();x&&(this.connected=!0,this.isFastHealthy()||(this.routeKind="firebase",this._handlePacket(x,!1)))}));let g=!0;return this.unsubs.push(p(h(this.db,`${v}/calCmd`),f=>{const x=f.val();if(g){g=!1,x!=null&&x.id&&this.seenCalIds.add(x.id);return}if(!x||!x.step)return;const y=x.id||`${x.step}:${x.ts||0}`;this.seenCalIds.has(y)||(this.seenCalIds.add(y),this.onCalCommand(x.step))})),this.unsubs.push(p(h(this.db,`${v}/handSide`),f=>{const x=f.val();x&&(x.side==="left"||x.side==="right")&&this.onHandSide(x.side)})),this.unsubs.push(p(h(this.db,`${v}/rtc/hello`),f=>{const x=f.val();!x||!x.ts||(this.peerJoined=!0,this.connected=!0,!this.isFastHealthy()&&!this._isOfferNegotiating()&&this._startRtcOffer(!1))})),this.unsubs.push(p(h(this.db,`${v}/rtc/answer`),async f=>{const x=f.val();if(!x||x.hid!==this.hid||!this.pc||this.pc.signalingState!=="have-local-offer")return;const y=this.hid;try{await this.pc.setRemoteDescription({type:"answer",sdp:x.sdp});const _=this.pendingCandidates.filter(T=>T.hid===y);this.pendingCandidates=[];for(const T of _){if(this.hid!==y||!this.pc)break;try{await this.pc.addIceCandidate(T.candidate)}catch{}}}catch{}})),this.unsubs.push(u(h(this.db,`${v}/rtc/wristCandidates`),async f=>{const x=f.val();if(!(!x||!x.candidate||!x.hid)){if(x.hid!==this.hid||!this.pc||!this.pc.remoteDescription){this.pendingCandidates.push(x),this.pendingCandidates.length>48&&this.pendingCandidates.shift();return}try{await this.pc.addIceCandidate(x.candidate)}catch{}}})),await this.acquireWakeLock(),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"firebase"}}catch(s){return this.error=(s==null?void 0:s.message)||"Ошибка подключения к Firebase",this._emitStatus(),{ok:!1,error:this.error}}}isFastHealthy(t=performance.now()){if(this.mode==="demo")return this.p2pOpen;if(!this.dcFast||this.dcFast.readyState!=="open")return!1;const e=this.lastPongAt>0?Math.max(0,t-this.lastPongAt):1/0,n=this.lastFastRxAt>0?Math.max(0,t-this.lastFastRxAt):1/0,s=Math.min(e,n);return Number.isFinite(s)?s<8500:this.dcOpenedAt>0&&Math.max(0,t-this.dcOpenedAt)<3500}_isOfferNegotiating(t=performance.now()){if(this.offerInFlight)return!0;if(!this.pc||!this.offerStartedAt)return!1;const e=this.pc.connectionState;return e==="failed"||e==="closed"?!1:Math.max(0,t-this.offerStartedAt)<4500}async _startRtcOffer(t=!1){if(!(typeof RTCPeerConnection>"u"||!this.db||!this.fbMod)&&!this.offerInFlight){this.offerInFlight=!0;try{this._closePcOnly(),this.attempt+=1,this.hid=C2(),this.offerStartedAt=performance.now();const e=this.hid,n=this.preferLanOnly||!t&&this.attempt%2===1,s=n?[]:T2,{ref:r,set:a,push:o,remove:l}=this.fbMod,c=`wn_wrist_rooms/${this.roomCode}/rtc`;try{await Promise.all([l(r(this.db,`${c}/answer`)),l(r(this.db,`${c}/hostCandidates`)),l(r(this.db,`${c}/wristCandidates`))])}catch{}if(this.mode!=="firebase"||this.hid!==e)return;const h=new RTCPeerConnection({iceServers:s});this.pc=h;const d=h.createDataChannel("wrist-fast",{ordered:!1,maxRetransmits:0}),p=h.createDataChannel("wrist-ctrl",{ordered:!0});this.dcFast=d,this.dcCtrl=p;const u=()=>{this.hid===e&&(this.p2pOpen=!0,this.connected=!0,this.lastSeq=-1,this.dcOpenedAt=performance.now(),this._inspectRoute(n),this._emitStatus())};d.onopen=u,p.onopen=u,d.onmessage=m=>this._onChannelMessage(m.data,!0),p.onmessage=m=>this._onChannelMessage(m.data,!1),h.onicecandidate=m=>{!m.candidate||this.hid!==e||o(r(this.db,`${c}/hostCandidates`),{hid:e,candidate:m.candidate.toJSON?m.candidate.toJSON():m.candidate}).catch(()=>{})},h.onconnectionstatechange=()=>{if(this.hid!==e)return;const m=h.connectionState;m==="connected"?(this.p2pOpen=!0,this._inspectRoute(n),this._emitStatus()):(m==="failed"||m==="closed")&&(this.p2pOpen=!1,this.offerStartedAt=0,this.routeKind=this.connected?"firebase":"idle",this._emitStatus())};try{const m=await h.createOffer();await h.setLocalDescription(m),await a(r(this.db,`${c}/offer`),{hid:e,sdp:m.sdp,iceMode:n?"lan":"stun",ts:Date.now()})}catch{}}finally{this.offerInFlight=!1}}}async _inspectRoute(t){var e;if(!((e=this.pc)!=null&&e.getStats)){this.routeKind=t?"lan":"stun";return}try{const n=await this.pc.getStats();let s=null;const r=new Map;if(n.forEach(a=>{(a.type==="local-candidate"||a.type==="remote-candidate")&&r.set(a.id,a),a.type==="candidate-pair"&&(a.nominated||a.state==="succeeded")&&(s=a)}),s){const a=r.get(s.localCandidateId),o=r.get(s.remoteCandidateId),l=(a==null?void 0:a.candidateType)||"",c=(o==null?void 0:o.candidateType)||"",h=Number.isFinite(s.currentRoundTripTime)?s.currentRoundTripTime*1e3:null,p=t||(l==="host"||l==="prflx")&&(c==="host"||c==="prflx")&&(Qu(a==null?void 0:a.address)||Qu(o==null?void 0:o.address)||h!==null&&h<22);this.routeKind=p?"lan":"stun",p&&(this.preferLanOnly=!0);return}}catch{}this.routeKind=t?"lan":"stun"}_onChannelMessage(t,e){let n;try{n=typeof t=="string"?JSON.parse(t):null}catch{return}if(!n)return;const s=performance.now();if(n.k==="ping"){this._sendCtrl({k:"pong",t:n.t});return}if(n.k==="pong"){if(this.lastPongAt=s,Number.isFinite(n.t)){const r=Math.max(1,Math.round(s-n.t));this.rttMs=this.rttMs===null?r:Math.round(this.rttMs*.65+r*.35)}this._emitStatus();return}if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step));return}if(n.k==="hand_side"&&(n.side==="left"||n.side==="right")){this.onHandSide(n.side);return}n.k==="wrist"&&(this.lastFastRxAt=s,this.p2pOpen=!0,this._handlePacket(n,e))}_sendCtrl(t){var n;const e=((n=this.dcCtrl)==null?void 0:n.readyState)==="open"?this.dcCtrl:this.dcFast;if((e==null?void 0:e.readyState)==="open")try{e.send(JSON.stringify(t))}catch{}}sendHandSide(t){const e=t==="left"?"left":"right";this.hostHandSide=e;const n={k:"hand_side",room:this.roomCode,side:e,ts:Date.now()};if(this.mode==="demo"&&this.bc&&this.bc.postMessage(n),this._sendCtrl(n),this.mode==="firebase"&&this.db&&this.fbMod&&this.roomCode){const{ref:s,set:r}=this.fbMod;r(s(this.db,`wn_wrist_rooms/${this.roomCode}/hostHandSide`),n).catch(()=>{})}}_handlePacket(t,e){const n=performance.now();if(t.sid&&t.sid!==this.peerSid&&(this.peerSid=String(t.sid),this.lastSeq=-1),e&&Number.isFinite(t.seq)){if(t.seq<=this.lastSeq&&this.lastSeq-t.seq<45)return;this.lastSeq=t.seq}for(this.lastAnyRxAt=n,this.rxTimes.push(n);this.rxTimes.length&&n-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:n})}injectPacket(t,e=performance.now()){this.connected=!0,this.p2pOpen=!0,this.routeKind="demo",this.lastAnyRxAt=e,this.rxHz=60,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:e})}_startMeters(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=setInterval(()=>{var e,n;const t=performance.now();for(;this.rxTimes.length&&t-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,(((e=this.dcFast)==null?void 0:e.readyState)==="open"||((n=this.dcCtrl)==null?void 0:n.readyState)==="open")&&this._sendCtrl({k:"ping",t:Math.round(t)}),this._emitStatus()},1e3),this.watchdogTimer=setInterval(()=>{this.mode!=="firebase"||!this.peerJoined||!this.isFastHealthy()&&!this._isOfferNegotiating()&&(this.p2pOpen=!1,this._startRtcOffer(!1))},4200)}_closePcOnly(){var t,e,n;try{(t=this.dcFast)==null||t.close()}catch{}try{(e=this.dcCtrl)==null||e.close()}catch{}try{(n=this.pc)==null||n.close()}catch{}this.dcFast=null,this.dcCtrl=null,this.pc=null,this.pendingCandidates=[],this.offerStartedAt=0,this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastSeq=-1,this.p2pOpen=!1}stop(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=null,this.watchdogTimer=null;for(const t of this.unsubs)try{t()}catch{}if(this.unsubs=[],this._closePcOnly(),this.bc){try{this.bc.close()}catch{}this.bc=null}this.releaseWakeLock(),this.mode="off",this.connected=!1,this.peerJoined=!1,this.routeKind="idle",this.rxHz=0,this.rttMs=null,this._emitStatus()}status(){return{mode:this.mode,roomCode:this.roomCode,connected:this.connected,p2pOpen:this.isFastHealthy(),routeKind:this.routeKind,rttMs:this.rttMs,rxHz:this.rxHz,error:this.error,fresh:!!this.lastAnyRxAt&&performance.now()-this.lastAnyRxAt<1200}}_emitStatus(){this.onStatus(this.status())}}const I2=(i,t,e)=>Math.max(t,Math.min(e,i)),et=i=>document.querySelector(i),Ln=i=>[...document.querySelectorAll(i)],L2=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let ui;try{ui=window.localStorage}catch{ui={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let Et=k_(ui),ot,Mc="all",ze=null,Sc,td,ed=null,us=0,bc=0,or=document.hidden,wc=null;const _f="white-night-vr-v1",Tc=10;function D2(){try{const i=ui.getItem(_f),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":t.mode==="hand"?"hand":"gyro",handSide:t.handSide==="left"?"left":"right",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",handSide:"right",quality:"high",leftHue:16,rightHue:338}}}let Kt=D2(),Re=null,ce=null,Ee=null,$e=null,ho="",nd=!1,Le=!1,Kr=!1,Ec=!1,Gi=!1,uo=0,ei=0,ni=!1,ai=!1,fo=!1,Dn=null,Ac=!1,yl=!1,Ei="",wr=0;const Wn=new m2;function Fr(){try{ui.setItem(_f,JSON.stringify(Kt))}catch{}}const id=new URLSearchParams(location.search).has("test"),ms=Ln("dialog");function Qr(i,t="neutral"){et("#toast").dataset.tone=t,et("#toast").textContent=i,et("#toast").classList.add("visible"),clearTimeout(Sc),Sc=setTimeout(()=>et("#toast").classList.remove("visible"),2600)}function Co(){H_(ui,Et)||(et("#save-status").textContent="Сохранение недоступно в этом браузере",Qr("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function po(){Ln("[data-pose]").forEach(i=>{var t;i.disabled=Et.phase!=="inspect"||!((t=ot==null?void 0:ot.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(ot==null?void 0:ot.pose)))})}function Or(){var i;if(po(),!!ot){if(Et.phase==="inspect"&&!((i=ot.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])et("#"+t).disabled=!0;return}et("#zoom-in").disabled=ot.zoom>=ao.max,et("#zoom-out").disabled=ot.zoom<=ao.min,et("#zoom-reset").disabled=ot.zoom===1,et("#zoom-reset").textContent=`${Math.round(ot.zoom*100)}%`}}function yf(){et("#completion-preview").replaceChildren(...Et.lastKept.map(i=>{const t=document.createElement("img");return t.src=ot.thumbnail(i),t.alt=vn.find(e=>e.id===i).name,t}))}function Xi(){var e;const i=Et.phase==="inspect"&&((e=ot.revealState)==null?void 0:e.phase)||"ready";if(i===ed)return;ed=i,et("#app").dataset.revealPhase=i,et("#app").classList.toggle("is-revealing",i!=="ready"),et(".inspection").setAttribute("aria-busy",String(i!=="ready")),et("#keep").disabled=et("#discard").disabled=i!=="ready",Or();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};et("#reveal-note").textContent=t[i]||"",et("#reveal-note").hidden=i==="ready"}function U2(){const i=et("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(td),td=setTimeout(()=>i.classList.remove("collected"),700)}function Zi(){et("#app").classList.toggle("has-progress",Et.searches>0),Xi(),Or(),z2(),et("#app").classList.toggle("is-inspecting",Et.phase==="inspect"),et(".inspection").hidden=Et.phase!=="inspect",Et.phase==="inspect"&&(clearTimeout(Sc),et("#toast").classList.remove("visible")),et("#header-count").innerHTML=`${String(Et.collection.length).padStart(2,"0")} <small>/ 18</small>`,et("#open-vr").disabled=Et.phase==="inspect",et("#search-total").textContent=String(Et.searches).padStart(2,"0"),et("#open-collection").disabled=Et.phase==="inspect",Ln(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<Et.taps)),et(".tap-dots").setAttribute("aria-label",`Нажатий: ${Et.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(et("#search-caption").textContent=i[Et.taps],et("#search-button span").textContent=Et.taps?"Продолжить поиск":"Порыться в баке",Et.phase==="inspect"){const t=vn.find(n=>n.id===Et.current),e=mf[t.rarity];et("#find-name").textContent=t.name,et("#find-description").textContent=t.description,et("#find-era").textContent=t.era,et("#find-rarity").innerHTML=`<i></i>${e.label}`,et("#find-rarity").style.color=e.color,et("#find-number").textContent=Et.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(Et.searches).padStart(3,"0")}`,et("#duplicate-badge").hidden=Et.reviewing||!Et.collection.includes(t.id),et(".decision-buttons").hidden=Et.reviewing,et("#close-review").hidden=!Et.reviewing}}function mo(){if(Et.phase!=="search"||ms.some(t=>t.open)||or)return;ot.poke(Et.taps+1);let i=wc||(Et.searches===0?"camera":B_().id);Et=Ro(Et,{type:"tap",itemId:i}),Et.phase==="inspect"&&(wc=null,ot.show(Et.current),Co(),Le&&(ai=Kt.mode!=="hand",ei=0,ni=!1,Wn.reset(),Ee==null||Ee.onPhaseChange("inspect",performance.now()))),Zi()}function gs(i,{fromVr:t=!1}={}){var r;if(Et.phase!=="inspect"||Et.reviewing||!((r=ot.revealState)!=null&&r.ready))return;const e=vn.find(a=>a.id===Et.current),n=Et.collection.includes(e.id),s=Et.collection.length;Et=Ro(Et,{type:i?"keep":"discard"}),ot.hide(),Co(),Zi(),Qr(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&U2(),s<18&&Et.collection.length===18&&(t?fo=!0:(yf(),et("#complete-dialog").showModal()))}function Mf(){et("#collection-count").textContent=Et.collection.length,et("#collection-progress").style.width=`${Et.collection.length/18*100}%`;const i=vn.filter(t=>Mc==="all"||(Mc==="junk"?t.rarity==="junk":t.rarity!=="junk"));et("#collection-grid").replaceChildren(...i.map(t=>{const e=Et.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(vn.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${ot.thumbnail(t.id)}">`:`<div class="locked-art">${L2("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":mf[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{et("#collection-dialog").close(),Et=Ro(Et,{type:"review",id:t.id}),ot.show(t.id,{review:!0}),Zi()}),n}))}function Rc(){Et.phase!=="inspect"&&(Mf(),et("#collection-dialog").showModal())}function sd(){Et.reviewing&&(Et=Ro(Et,{type:"close"}),ot.hide(),Zi(),Rc())}function Sf(){Et=Jr(),ot.hide(),Co(),Zi(),et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1,et("#settings-dialog").close(),Qr("Новая белая ночь. Начнём сначала.")}function N2(){const i=et(".bin-tag");if(!i)return;const t=ot.binEdge();i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`}const bf="white-night-look-hint-v1";let rd=!1;function F2(){try{return ui.getItem(bf)==="done"}catch{return!0}}function O2(){const i=et("#look-hint");if(!(!i||rd&&i.hidden)){i.classList.add("used"),rd=!0;try{ui.setItem(bf,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function z2(){const i=et("#look-hint");if(i){if(F2()||Et.phase==="inspect"){i.hidden=!0;return}i.hidden=Le}}function wn(){return Re||(Re=new f2(et("#vr-camera")),Re.setHues(Kt.leftHue,Kt.rightHue),Re.setMode(Kt.mode==="fusion"?"fusion":"gyro")),Re}function wf(){return ce||(ce=new x2(et("#vr-hand-camera"))),ce}function jr(i){var s;const t=oi();ce==null||ce.process(!0);const e=(ce==null?void 0:ce.sample())||null,n=i==="pose1"?t.calibrateStretchPose(t.lastSensor,e):t.calibrateBendPose(t.lastSensor,e);return ho=n.message||"",(s=et("#vr-dialog"))!=null&&s.open&&Je(),n}function sh(i,{fromRemote:t=!1}={}){var n,s,r;const e=i==="left"?"left":"right";Kt.handSide=e,Fr(),Ee&&Ee.setHandSide(e),(s=(n=ot==null?void 0:ot.vrHand)==null?void 0:n.setHandSide)==null||s.call(n,e),t||$e==null||$e.sendHandSide(e),(r=et("#vr-dialog"))!=null&&r.open&&Je()}function oi(){return Ee||(Ee=new M2({handSide:Kt.handSide})),$e||($e=new P2({onSensor:i=>Ee.feedSensor(i),onCalCommand:i=>jr(i),onHandSide:i=>sh(i,{fromRemote:!0}),onStatus:()=>{var i;(i=et("#vr-dialog"))!=null&&i.open&&Je()}}),$e.hostHandSide=Kt.handSide),Ee}function B2(i){return i.gyro.fresh?Kt.mode==="fusion"?!!i.marker.calibrated:Kt.mode==="hand"?(oi(),($e.status().connected||!!Ee.lastSensor)&&Ee.calibratedStep>=2):!0:!1}function ad(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}const k2="<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>",H2="<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>",G2="В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.",V2="В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.";function Je(){var c;const i=wn(),t=i.info(),e=t.gyro,n=t.marker,s=B2(t);Ln("[data-vr-mode]").forEach(h=>{const d=h.dataset.vrMode===Kt.mode;h.classList.toggle("active",d),h.setAttribute("aria-pressed",String(d))}),et("#vr-fusion-panel").hidden=Kt.mode!=="fusion",et("#vr-hand-panel").hidden=Kt.mode!=="hand";const r=et("#vr-how-cards"),a=et("#vr-note-text");if(r){const h=Kt.mode==="hand"?H2:k2;r.innerHTML!==h&&(r.innerHTML=h)}a&&(a.textContent=Kt.mode==="hand"?V2:G2),et("#vr-quality").value=Kt.quality,et("#vr-swatch-left").style.background=`hsl(${Kt.leftHue} 95% 55%)`,et("#vr-swatch-right").style.background=`hsl(${Kt.rightHue} 95% 55%)`;const o=et("#vr-gyro-btn");if(o.disabled=!!e.fresh||!e.supported,o.textContent=e.fresh?"Гироскоп готов":"Разрешить",o.classList.toggle("ready",!!e.fresh),et("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",Kt.mode==="fusion"){const[h,d]=n.markers||[];et("#vr-start-camera").disabled=!!n.running,et("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",et("#vr-calibrate").disabled=!(h!=null&&h.usable&&(d!=null&&d.usable)),et("#vr-pick-left").classList.toggle("active",Dn==="left"),et("#vr-pick-right").classList.toggle("active",Dn==="right"),et("#vr-camera").classList.toggle("picking",!!Dn);const p=et("#vr-marker-status");p.textContent=Ei||n.error||(Dn?`Коснитесь ${Dn==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((c=n.calibration)==null?void 0:c.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${h?ad(h):"—"}. Правая метка: ${d?ad(d):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),p.className=`vr-status-line ${Ei||n.error?"warn":n.calibrated?"good":""}`}else if(Kt.mode==="hand"){if(oi(),Ln("[data-hand-side]").forEach(f=>{const x=f.dataset.handSide===Kt.handSide;f.classList.toggle("active",x),f.setAttribute("aria-pressed",String(x))}),!nd){nd=!0;const f=A2(),x=et("#vr-hand-fb");x&&f?x.value=f:et("#vr-hand-fb-details")&&(et("#vr-hand-fb-details").open=!0)}const h=$e.status(),d=h.connected||!!Ee.lastSensor;et("#vr-hand-code").textContent=h.roomCode||"——";const p=et("#vr-wrist-link");if(p){const f=new URLSearchParams;h.roomCode&&f.set("room",h.roomCode),Kt.handSide==="left"&&f.set("hand","left"),h.mode==="demo"&&f.set("demo","1");const x=f.toString();p.href=x?`./wrist/index.html?${x}`:"./wrist/index.html"}const u=et("#vr-hand-net-status");u.textContent=h.error?h.error:h.p2pOpen?h.routeKind==="demo"?`Демо-канал активен (${h.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${h.rttMs?` · ${h.rttMs} мс`:""}.`:h.connected?"☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).":h.roomCode?`Код комнаты ${h.roomCode} создан — введите его на странице браслета.`:"Создайте 6-значный код и введите его на втором телефоне.",u.className=`vr-status-line ${h.error?"warn":d?"good":""}`;const m=ce==null?void 0:ce.info();et("#vr-hand-cam-btn").textContent=m!=null&&m.running?"Камера маяка вкл.":"Камера маяка (опц.)",et("#vr-hand-camera").hidden=!(m!=null&&m.running),et("#vr-hand-cal1").disabled=!d,et("#vr-hand-cal2").disabled=!d||Ee.calibratedStep<1;const v=et("#vr-hand-cal-status"),g=m!=null&&m.running?` Маяк в камере: ${m.status==="pair"?"видна пара пятен":m.status==="single"?"видно одно пятно":"пока не в кадре"}.`:"";v.textContent=(ho||(Ee.calibratedStep>=2?"Калибровка двух жестов готова.":Ee.calibratedStep===1?"Шаг 1 записан — согните руку в локте и нажмите Жест 2.":d?"Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).":"Сначала подключите браслет."))+g,v.className=`vr-status-line ${Ee.calibratedStep>=2?"good":""}`}et("#vr-start").disabled=!s||Gi;const l=et("#vr-status");return l.textContent=Gi?"Надевайте очки и смотрите прямо перед собой…":e.fresh?Kt.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":Kt.mode==="hand"&&!s?"Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.":Kt.mode==="hand"?"Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.":Kt.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп очков.",l.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function Tf(){if(Et.phase==="inspect"){Qr("Сначала завершите осмотр находки.");return}const i=et("#vr-dialog");if(i.open)return;const t=wn();t.gyro.permission==="granted"&&!t.gyro.listening&&t.gyro.start(),Je(),i.showModal()}async function W2(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function X2(i=!1){i&&(Ac=et("#low-quality").checked,yl=Kt.quality==="low",ot.low!==yl&&ot.setQuality(yl))}function Ef(i=!1){if(!Le)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==Kr)&&(Kr=t,ot.setVrStereo(t))}async function Af(){if(Le||Et.phase==="inspect")return!1;const i=wn(),t=Kt.mode==="hand",e=et("#vr-dialog");if(i.setMode(Kt.mode==="fusion"?"fusion":"gyro"),e.open&&(Ec=!0,e.close(),Ec=!1),X2(!0),i.start(),t){oi();const n=performance.now();Ee.recenterOnSessionStart(n),Ee.onPhaseChange("search",n)}return Le=!0,ei=Et.taps*(Tc/3),ni=!1,ai=!1,Wn.reset(),document.body.classList.add("vr-active"),ot.setVrBodyActive(!0),ot.setVrHandMode(t),Kr=!1,Ef(!0),ot.setHeadLook(0,0),ot.updateVrHand(0,{visible:!0,handSide:Kt.handSide,headLook:ot.headLook,phase:Et.phase}),ot.resize(),!0}async function q2(){if(Gi||!Je().ready)return;await W2();const i=++uo,t=et("#vr-dialog"),e=et("#vr-countdown");Gi=!0,e.hidden=!1,Je();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==uo||!t.open){Gi=!1,e.hidden=!0;return}Gi=!1,e.hidden=!0,await Af()}function Po(i="gesture"){var t;return!ai||Et.phase!=="inspect"||Et.reviewing?!1:((t=ot.revealState)!=null&&t.ready||(ot.finishReveal(),Xi()),ai=!1,Wn.reset(),gs(!0,{fromVr:!0}),ei=0,ni=!1,!0)}function Ir(i="exit"){var t;if(!Le)return!1;ai&&Po("exit"),Le=!1,uo++,Gi=!1,et("#vr-countdown").hidden=!0,Re==null||Re.stop(),ce==null||ce.stop(),ot.setVrBodyActive(!1),ot.setVrHandMode(!1),ot.setVrStereo(!1),ot.setHeadLook(0,0),Kr=!1,ei=0,ni=!1,Wn.reset(),document.body.classList.remove("vr-active","vr-single"),ot.low!==Ac&&ot.setQuality(Ac);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),ot.resize(),Zi(),fo?(fo=!1,yf(),et("#complete-dialog").showModal()):i!=="hidden"&&Et.phase!=="inspect"&&Qr("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function Cc(i){const t=Re.update(i);return ot.setHeadLook(t.yaw,t.pitch),t}function go(i,t=performance.now()){var r,a,o,l,c;if(!Le||!Re)return;const e=Cc(i),n=Tc/3;if(Kt.mode==="hand"){oi(),ce==null||ce.process(!1,t);const h=(ce==null?void 0:ce.sample(t))||null,d=ot.handHitsBin(),p=Ee.update(i,{beacon:h,headLook:ot.headLook,phase:Et.phase,revealReady:!!((r=ot.revealState)!=null&&r.ready),handOverBin:d,now:t});if(ot.updateVrHand(i,{visible:!0,handTracked:p.trackingSource!=="idle",handSide:p.handSide,headLook:ot.headLook,torsoYaw:p.torsoYaw,shoulderPos:p.shoulderPos,elbowPos:p.elbowPos,pos:p.pos,vel:p.vel,qArm:p.qArm,reach:p.reach,elbowBendDeg:p.elbowBendDeg,overBin:d,phase:Et.phase,calmLowerProgress:p.calmLowerProgress,beaconActive:p.trackingSource==="gyro+beacon"}),Et.phase==="search"){Wn.reset(),ni=d&&p.reach>=.62;for(let u=0;u<p.pokes&&Et.phase==="search";u++)mo()}else if(Et.phase==="inspect"){ni=!1,ot.setHandItemRotation(p.itemRot.x,p.itemRot.y,p.itemRot.z,p.itemQuat);const u=ot.handInspectHeadBase?Math.atan2(Math.sin(e.yaw-ot.handInspectHeadBase.yaw),Math.cos(e.yaw-ot.handInspectHeadBase.yaw)):e.yaw,m=(((a=Ee.lastSensor)==null?void 0:a.rotRate)||0)<90&&(((o=Ee.lastSensor)==null?void 0:o.linMag)||0)<2.2;p.decision==="discard"?(ai=!1,Wn.reset(),ot.launchDiscardToss(p.throwVel),gs(!1,{fromVr:!0}),Ee.onPhaseChange("search",t)):(p.decision==="keep"||(l=ot.revealState)!=null&&l.ready&&m&&Wn.update(u,t))&&(ai=!1,Wn.reset(),gs(!0,{fromVr:!0}),Ee.onPhaseChange("search",t))}return}const s=ot.vrInspectLock&&ot.headInspectBase?ot.headInspectBase:ot.headLook;if(ot.updateVrHand(i,{visible:!0,handSide:Kt.handSide,headLook:s,phase:Et.phase}),Et.phase==="search")if(Wn.reset(),ni=ot.gazeHitsBin(),ni){ei=Math.min(Tc,ei+i);const h=Math.min(3,Math.floor(ei/n+1e-9));for(;Et.phase==="search"&&Et.taps<h;){const d=Et.taps;if(mo(),Et.phase==="search"&&Et.taps===d)break}}else ei=Math.max(Et.taps*n,ei-i*1.5);else Et.phase==="inspect"&&ai&&(ni=!1,(c=ot.revealState)!=null&&c.ready&&Wn.update(e.yaw,t)&&Po("gesture"))}function cs(){return{active:Le,stereo:Kr,settings:{...Kt},focus:+ei.toFixed(3),gazeHit:ni,pendingSave:ai,pendingCompletion:fo,shake:Wn.info(),look:(Re==null?void 0:Re.info())||null,wrist:Ee?{link:($e==null?void 0:$e.status())||null,beacon:(ce==null?void 0:ce.info())||null,hand:Ee.snapshot()}:null,world:(ot==null?void 0:ot.vrInfo())||null}}function od(i,t,e=10,n=.03){const s=wn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),Le?go(0,r.lastAt):Cc(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),Le?go(n,r.lastAt):Cc(n);return ot.update(0),r.lastAt=performance.now(),cs()}function Rf(i){if(bc=requestAnimationFrame(Rf),ms.some(n=>n.open)){et("#vr-dialog").open&&!or&&(Re==null||Re.processPrep(),Kt.mode==="hand"&&(ce==null||ce.process()),Je()),us=i;return}if(or||ot.testRevealHold){us=i;return}const t=us?(i-us)/1e3:.016;us=i;const e=Math.min(t,.1);Le&&go(e,i),ot.update(e,t),Xi(),Le||N2()}function Y2(){Ln("[data-pose]").forEach(t=>t.addEventListener("click",()=>{ot.setPose(t.dataset.pose),po()})),et("#zoom-in").addEventListener("click",()=>{ot.setZoom(.2),Or()}),et("#zoom-out").addEventListener("click",()=>{ot.setZoom(-.2),Or()}),et("#zoom-reset").addEventListener("click",()=>{ot.setZoom(1-ot.zoom),Or()}),et("#search-button").addEventListener("click",mo),et("#discard").addEventListener("click",()=>gs(!1)),et("#keep").addEventListener("click",()=>gs(!0)),et("#close-review").addEventListener("click",sd),et("#open-collection").addEventListener("click",Rc),et("#open-settings").addEventListener("click",()=>{et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1,et("#settings-dialog").showModal()}),et("#open-vr").addEventListener("click",Tf),Ln("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{const e=t.dataset.vrMode;Kt.mode=e==="fusion"?"fusion":e==="hand"?"hand":"gyro",Fr(),Dn=null,Ei="",Kt.mode!=="hand"&&(ce==null||ce.stop()),wn().setMode(Kt.mode==="fusion"?"fusion":"gyro"),Je()})),et("#vr-gyro-btn").addEventListener("click",async()=>{Ei="",await wn().requestGyro(),Je()}),et("#vr-start-camera").addEventListener("click",async()=>{Ei="";const t=wn();t.tracker.error=null,await t.startCamera(),Je()}),Ln(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";Ei="",Dn=Dn===e?null:e,Je()})),et("#vr-camera").addEventListener("click",t=>{if(!Dn)return;const e=wn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(Dn==="left"?Kt.leftHue=Math.round(n.hue):Kt.rightHue=Math.round(n.hue),e.setHues(Kt.leftHue,Kt.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Fr(),Ei="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",Dn=null,e.tracker.process(!0),Je())}),et("#vr-calibrate").addEventListener("click",()=>{const t=wn();t.tracker.process(!0);const e=t.tracker.calibrate();Ei=e.ok?"":e.message,Je()}),Ln("[data-hand-side]").forEach(t=>t.addEventListener("click",()=>sh(t.dataset.handSide))),et("#vr-hand-room-btn").addEventListener("click",async()=>{var t;oi(),ho="",await $e.startFirebase(((t=et("#vr-hand-fb"))==null?void 0:t.value)||"",Kt.handSide),Je()}),et("#vr-hand-demo-btn").addEventListener("click",()=>{oi(),ho="",$e.startDemo("111111",Kt.handSide),Je()}),et("#vr-hand-cam-btn").addEventListener("click",async()=>{const t=wf();t.running?t.stop():await t.start(et("#vr-hand-camera")),Je()}),et("#vr-hand-cal1").addEventListener("click",()=>jr("pose1")),et("#vr-hand-cal2").addEventListener("click",()=>jr("pose2")),et("#vr-start").addEventListener("click",q2),et("#vr-quality").value=Kt.quality,et("#vr-quality").addEventListener("change",t=>{Kt.quality=t.target.value,Fr()}),Ln("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),ms.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{ze=null,us=0,t.id==="vr-dialog"&&!Ec&&!Le&&(uo++,Gi=!1,et("#vr-countdown").hidden=!0,Dn=null,Ei="",Re==null||Re.stop(),ce==null||ce.stop())})}),Ln("[data-filter]").forEach(t=>t.addEventListener("click",()=>{Mc=t.dataset.filter,Ln("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),Mf()})),et("#low-quality").addEventListener("change",t=>{ot.setQuality(t.target.checked),ot.update(.016);try{ui.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),et("#reset-button").addEventListener("click",()=>{et("#reset-confirm").hidden=!1,et("#reset-button").hidden=!0}),et("#reset-cancel").addEventListener("click",()=>{et("#reset-confirm").hidden=!0,et("#reset-button").hidden=!1}),et("#reset-yes").addEventListener("click",Sf),et("#continue-button").addEventListener("click",()=>et("#complete-dialog").close()),et("#view-complete").addEventListener("click",()=>{et("#complete-dialog").close(),Rc()});const i=et("#world");i.addEventListener("pointerdown",t=>{if(Le){clearTimeout(wr),wr=setTimeout(()=>Ir("long-press"),900);return}ms.some(e=>e.open)||ze||!t.isPrimary||(Et.phase==="inspect"&&(ot.finishReveal(),Xi()),ze={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!ze||ze.id!==t.pointerId)return;const e=t.clientX-ze.x,n=t.clientY-ze.y;Math.hypot(t.clientX-ze.startX,t.clientY-ze.startY)>10&&(ze.moved=!0,Et.phase!=="inspect"&&!Le&&O2()),Et.phase==="inspect"?(ot.rotate(e,n),po()):Le||ot.lookBy(e,n),ze.x=t.clientX,ze.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout(wr),!ze||ze.id!==t.pointerId)return;const e=!ze.moved;ze=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&Et.phase==="search"&&ot.hitBin(t.clientX,t.clientY)&&mo()}),i.addEventListener("pointercancel",()=>{clearTimeout(wr),ze=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout(wr),ze=null}),document.addEventListener("visibilitychange",()=>{or=document.hidden,ze=null,us=0,document.hidden&&Le&&Ir("hidden")}),window.addEventListener("blur",()=>ze=null),window.addEventListener("resize",()=>{ot.resize(),Le&&Ef(),ms.some(t=>t.open)&&ot.update(.016)}),document.addEventListener("fullscreenchange",()=>{Le&&!document.fullscreenElement&&Ir("fullscreen")}),window.addEventListener("pagehide",()=>{var t;ai?Po("pagehide"):Le&&Et.phase==="inspect"&&!Et.reviewing&&((t=ot.revealState)!=null&&t.ready||(ot.finishReveal(),Xi()),gs(!0,{fromVr:!0})),Le&&(Re==null||Re.stop()),ce==null||ce.stop(),$e==null||$e.stop()}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&Le){t.preventDefault(),Ir("escape");return}t.key==="Escape"&&!ms.some(e=>e.open)&&Et.phase==="inspect"&&(t.preventDefault(),Et.reviewing?sd():(ot.finishReveal(),Xi(),gs(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),or=!0,et("#webgl-error").hidden=!1})}async function $2(){try{ot=new z_(et("#world"));try{ui.getItem("white-night-quality")==="low"&&(ot.setQuality(!0),et("#low-quality").checked=!0)}catch{}Y2(),Zi(),await Promise.all([document.fonts.ready,kx()]),ot.update(.016),et("#loading").hidden=!0,window.__READY__=!0,bc=requestAnimationFrame(Rf),id&&(window.__WORLD__=ot),id&&(window.__GAME_TEST__={getState:()=>structuredClone(Et),getMetrics:()=>ot.metrics(),settle:()=>{ot.finishReveal(),ot.kick=0,ot.dirty=!0,ot.update(.016),Xi()},seekReveal:i=>{ot.testRevealHold=!0,ot.reveal=Math.max(0,Math.min(1,i)),ot.applyReveal(),ot.dirty=!0,ot.update(0),Xi()},setPose:i=>{ot.setPose(i),ot.update(.1),po()},getRotation:()=>({x:ot.targetX,y:ot.targetY}),binScreen:()=>ot.binScreen(),forceNext:i=>{if(!vn.some(t=>t.id===i))throw Error("unknown item");wc=i},setView:i=>{const t=ot.setView(i);return ot.update(.016),t},look:(i,t)=>(ot.lookBy(0,0),ot.headLook.yaw=I2(i,-41,41)*Math.PI/180,ot.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,ot.applyCameraPose(),ot.dirty=!0,ot.update(.016),ot.lookInfo()),sky:()=>({stars:ot.sky.stars.geometry.attributes.position.count,moon:ot.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:ot.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{ms.forEach(i=>i.close()),Sf()},setCollection:i=>{Et=Jr({collection:i,searches:i.length}),ot.hide(),Co(),Zi()},isPaused:()=>or,items:vn.map(i=>i.id),scene:()=>({staticVisible:ot.static.visible,drawCalls:ot.renderer.info.render.calls,headLook:ot.lookInfo(),sky:{stars:ot.sky.stars.geometry.attributes.position.count,moonVisible:ot.sky.moon.visible}}),vr:{info:()=>cs(),open:()=>Tf(),setMode:i=>(Kt.mode=i==="fusion"?"fusion":i==="hand"?"hand":"gyro",Fr(),Kt.mode!=="hand"&&(ce==null||ce.stop()),wn().setMode(Kt.mode==="fusion"?"fusion":"gyro"),Je(),cs()),setHandSide:i=>(sh(i),cs()),requestGyro:()=>wn().requestGyro(),gyro:(i,t,e=10,n=.03)=>od(i,t,e,n),marker:(i,t)=>wn().tracker.inject(i,t),calibrate:i=>wn().tracker.calibrate(i),wristDemo:i=>(oi(),$e.startDemo(i||"111111",Kt.handSide)),wristPacket:(i,t=performance.now())=>(oi(),$e.injectPacket(i,t),cs()),wristBeacon:(i,t=performance.now())=>(oi(),wf().inject(i,t)),wristCalibrateStretch:()=>jr("pose1"),wristCalibrateBend:()=>jr("pose2"),start:()=>Af(),stop:()=>Ir("test"),step:(i=.1,t)=>{let e=Math.max(0,i),n=t;for(;e>0;){const s=Math.min(.05,e);n!==void 0&&(n+=s*1e3),Re&&(Re.gyro.lastAt=performance.now()),go(s,n!==void 0?n:performance.now()),e-=s}return ot.update(0),cs()},shake:(i=25)=>{for(const t of[-i,i,-i])od(t,0,10,.03);return cs()},settings:()=>({...Kt}),finish:()=>Po("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),et("#loading").hidden=!0,et("#webgl-error").hidden=!1,cancelAnimationFrame(bc)}}$2();
