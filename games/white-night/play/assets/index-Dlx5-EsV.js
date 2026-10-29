(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fc="180",qf=0,xh=1,Yf=2,gd=1,xd=2,Ri=3,Qi=0,rn=1,Oe=2,cn=0,Qs=1,Hr=2,vh=3,_h=4,vd=5,Ii=100,$f=101,Zf=102,Jf=103,Kf=104,Cl=200,jf=201,Qf=202,t0=203,Pl=204,Il=205,_d=206,e0=207,Md=208,n0=209,i0=210,s0=211,r0=212,a0=213,o0=214,Ll=0,Dl=1,Ul=2,er=3,Nl=4,Fl=5,Ol=6,zl=7,Oc=0,l0=1,c0=2,Ki=0,yd=1,Sd=2,bd=3,zc=4,wd=5,Td=6,Ed=7,Ad=300,nr=301,ir=302,Bl=303,kl=304,yo=306,di=1e3,gs=1001,Hl=1002,un=1003,h0=1004,sa=1005,ai=1006,Oo=1007,xs=1008,fi=1009,Rd=1010,Cd=1011,Gr=1012,Bc=1013,Ss=1014,Yn=1015,pi=1016,kc=1017,Hc=1018,sr=1020,Pd=35902,Id=35899,Ld=1021,Dd=1022,On=1023,Vr=1026,rr=1027,So=1028,Gc=1029,Ud=1030,Vc=1031,Wc=1033,Za=33776,Ja=33777,Ka=33778,ja=33779,Gl=35840,Vl=35841,Wl=35842,Xl=35843,ql=36196,Yl=37492,$l=37496,Zl=37808,Jl=37809,Kl=37810,jl=37811,Ql=37812,tc=37813,ec=37814,nc=37815,ic=37816,sc=37817,rc=37818,ac=37819,oc=37820,lc=37821,cc=36492,hc=36494,uc=36495,dc=36283,fc=36284,pc=36285,mc=36286,u0=3200,d0=3201,bo=0,f0=1,mn="",$e="srgb",ar="srgb-linear",so="linear",_e="srgb",As=7680,Mh=519,p0=512,m0=513,g0=514,Nd=515,x0=516,v0=517,_0=518,M0=519,gc=35044,ra=35048,yh="300 es",oi=2e3,ro=2001;class hr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sh=1234567;const Nr=Math.PI/180,Wr=180/Math.PI;function li(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function le(i,t,e){return Math.max(t,Math.min(e,i))}function Xc(i,t){return(i%t+t)%t}function y0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function S0(i,t,e){return i!==t?(e-i)/(t-i):0}function Fr(i,t,e){return(1-e)*i+e*t}function b0(i,t,e,n){return Fr(i,t,1-Math.exp(-e*n))}function w0(i,t=1){return t-Math.abs(Xc(i,t*2)-t)}function T0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function E0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function A0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function R0(i,t){return i+Math.random()*(t-i)}function C0(i){return i*(.5-Math.random())}function P0(i){i!==void 0&&(Sh=i);let t=Sh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function I0(i){return i*Nr}function L0(i){return i*Wr}function D0(i){return(i&i-1)===0&&i!==0}function U0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function N0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function F0(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),f=a((t-n)/2),d=r((n-t)/2),m=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*u,l*f,o*c);break;case"YZY":i.set(l*f,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*f,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*d,o*c);break;case"YXY":i.set(l*d,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*d,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function qn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Me(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Vt={DEG2RAD:Nr,RAD2DEG:Wr,generateUUID:li,clamp:le,euclideanModulo:Xc,mapLinear:y0,inverseLerp:S0,lerp:Fr,damp:b0,pingpong:w0,smoothstep:T0,smootherstep:E0,randInt:A0,randFloat:R0,randFloatSpread:C0,seededRandom:P0,degToRad:I0,radToDeg:L0,isPowerOfTwo:D0,ceilPowerOfTwo:U0,floorPowerOfTwo:N0,setQuaternionFromProperEuler:F0,normalize:Me,denormalize:qn};class gt{constructor(t=0,e=0){gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const f=r[a+0],d=r[a+1],m=r[a+2],x=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=m,t[e+3]=x;return}if(u!==x||l!==f||c!==d||h!==m){let g=1-o;const p=l*f+c*d+h*m+u*x,v=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const T=Math.sqrt(M),b=Math.atan2(T,p*v);g=Math.sin(g*b)/T,o=Math.sin(o*b)/T}const _=o*v;if(l=l*g+f*_,c=c*g+d*_,h=h*g+m*_,u=u*g+x*_,g===1-o){const T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],f=r[a+1],d=r[a+2],m=r[a+3];return t[e]=o*m+h*u+l*d-c*f,t[e+1]=l*m+h*f+c*u-o*d,t[e+2]=c*m+h*d+o*f-l*u,t[e+3]=h*m-o*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),f=l(n/2),d=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*d*m,this._y=c*d*u-f*h*m,this._z=c*h*m+f*d*u,this._w=c*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+c*d*m,this._y=c*d*u-f*h*m,this._z=c*h*m-f*d*u,this._w=c*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-c*d*m,this._y=c*d*u+f*h*m,this._z=c*h*m+f*d*u,this._w=c*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-c*d*m,this._y=c*d*u+f*h*m,this._z=c*h*m-f*d*u,this._w=c*h*u+f*d*m;break;case"YZX":this._x=f*h*u+c*d*m,this._y=c*d*u+f*h*m,this._z=c*h*m-f*d*u,this._w=c*h*u-f*d*m;break;case"XZY":this._x=f*h*u-c*d*m,this._y=c*d*u-f*h*m,this._z=c*h*m+f*d*u,this._w=c*h*u+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(bh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(bh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return zo.copy(this).projectOnVector(t),this.sub(zo)}reflect(t){return this.sub(zo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const zo=new L,bh=new Ne;class ae{constructor(t,e,n,s,r,a,o,l,c){ae.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],m=n[8],x=s[0],g=s[3],p=s[6],v=s[1],M=s[4],_=s[7],T=s[2],b=s[5],E=s[8];return r[0]=a*x+o*v+l*T,r[3]=a*g+o*M+l*b,r[6]=a*p+o*_+l*E,r[1]=c*x+h*v+u*T,r[4]=c*g+h*M+u*b,r[7]=c*p+h*_+u*E,r[2]=f*x+d*v+m*T,r[5]=f*g+d*M+m*b,r[8]=f*p+d*_+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,d=c*r-a*l,m=e*u+n*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(o*n-s*a)*x,t[3]=f*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-o*e)*x,t[6]=d*x,t[7]=(n*l-c*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Bo.makeScale(t,e)),this}rotate(t){return this.premultiply(Bo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Bo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Bo=new ae;function Fd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Xr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function O0(){const i=Xr("canvas");return i.style.display="block",i}const wh={};function qr(i){i in wh||(wh[i]=!0,console.warn(i))}function z0(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Th=new ae().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Eh=new ae().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function B0(){const i={enabled:!0,workingColorSpace:ar,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===_e&&(s.r=Ui(s.r),s.g=Ui(s.g),s.b=Ui(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===_e&&(s.r=tr(s.r),s.g=tr(s.g),s.b=tr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===mn?so:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return qr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return qr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ar]:{primaries:t,whitePoint:n,transfer:so,toXYZ:Th,fromXYZ:Eh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:$e},outputColorSpaceConfig:{drawingBufferColorSpace:$e}},[$e]:{primaries:t,whitePoint:n,transfer:_e,toXYZ:Th,fromXYZ:Eh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:$e}}}),i}const me=B0();function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function tr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Rs;class k0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Rs===void 0&&(Rs=Xr("canvas")),Rs.width=t.width,Rs.height=t.height;const s=Rs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Rs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Xr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ui(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ui(e[n]/255)*255):e[n]=Ui(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let H0=0;class qc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:H0++}),this.uuid=li(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ko(s[a].image)):r.push(ko(s[a]))}else r=ko(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ko(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?k0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let G0=0;const Ho=new L;class je extends hr{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=gs,s=gs,r=ai,a=xs,o=On,l=fi,c=je.DEFAULT_ANISOTROPY,h=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:G0++}),this.uuid=li(),this.name="",this.source=new qc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new gt(0,0),this.repeat=new gt(1,1),this.center=new gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ae,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ho).x}get height(){return this.source.getSize(Ho).y}get depth(){return this.source.getSize(Ho).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ad)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case di:t.x=t.x-Math.floor(t.x);break;case gs:t.x=t.x<0?0:1;break;case Hl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case di:t.y=t.y-Math.floor(t.y);break;case gs:t.y=t.y<0?0:1;break;case Hl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=Ad;je.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,e=0,n=0,s=1){Se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,_=(d+1)/2,T=(p+1)/2,b=(h+f)/4,E=(u+x)/4,w=(m+g)/4;return M>_&&M>T?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=b/n,r=E/n):_>T?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=b/s,r=w/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=E/r,s=w/r),this.set(n,s,r,e),this}let v=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-x)/v,this.z=(f-h)/v,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class V0 extends hr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ai,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new je(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ai,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new qc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class En extends V0{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Od extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=gs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class W0 extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=gs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $n{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(kn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(kn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=kn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,kn):kn.fromBufferAttribute(r,a),kn.applyMatrix4(t.matrixWorld),this.expandByPoint(kn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),aa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),aa.copy(n.boundingBox)),aa.applyMatrix4(t.matrixWorld),this.union(aa)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,kn),kn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(gr),oa.subVectors(this.max,gr),Cs.subVectors(t.a,gr),Ps.subVectors(t.b,gr),Is.subVectors(t.c,gr),Bi.subVectors(Ps,Cs),ki.subVectors(Is,Ps),is.subVectors(Cs,Is);let e=[0,-Bi.z,Bi.y,0,-ki.z,ki.y,0,-is.z,is.y,Bi.z,0,-Bi.x,ki.z,0,-ki.x,is.z,0,-is.x,-Bi.y,Bi.x,0,-ki.y,ki.x,0,-is.y,is.x,0];return!Go(e,Cs,Ps,Is,oa)||(e=[1,0,0,0,1,0,0,0,1],!Go(e,Cs,Ps,Is,oa))?!1:(la.crossVectors(Bi,ki),e=[la.x,la.y,la.z],Go(e,Cs,Ps,Is,oa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,kn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(kn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_i),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const _i=[new L,new L,new L,new L,new L,new L,new L,new L],kn=new L,aa=new $n,Cs=new L,Ps=new L,Is=new L,Bi=new L,ki=new L,is=new L,gr=new L,oa=new L,la=new L,ss=new L;function Go(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ss.fromArray(i,r);const o=s.x*Math.abs(ss.x)+s.y*Math.abs(ss.y)+s.z*Math.abs(ss.z),l=t.dot(ss),c=e.dot(ss),h=n.dot(ss);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const X0=new $n,xr=new L,Vo=new L;class Ts{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):X0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xr.subVectors(t,this.center);const e=xr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(xr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xr.copy(t.center).add(Vo)),this.expandByPoint(xr.copy(t.center).sub(Vo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Mi=new L,Wo=new L,ca=new L,Hi=new L,Xo=new L,ha=new L,qo=new L;class Yc{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Mi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mi.copy(this.origin).addScaledVector(this.direction,e),Mi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Wo.copy(t).add(e).multiplyScalar(.5),ca.copy(e).sub(t).normalize(),Hi.copy(this.origin).sub(Wo);const r=t.distanceTo(e)*.5,a=-this.direction.dot(ca),o=Hi.dot(this.direction),l=-Hi.dot(ca),c=Hi.lengthSq(),h=Math.abs(1-a*a);let u,f,d,m;if(h>0)if(u=a*l-o,f=a*o-l,m=r*h,u>=0)if(f>=-m)if(f<=m){const x=1/h;u*=x,f*=x,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-m?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=m?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wo).addScaledVector(ca,f),d}intersectSphere(t,e){Mi.subVectors(t.center,this.origin);const n=Mi.dot(this.direction),s=Mi.dot(Mi)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Mi)!==null}intersectTriangle(t,e,n,s,r){Xo.subVectors(e,t),ha.subVectors(n,t),qo.crossVectors(Xo,ha);let a=this.direction.dot(qo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Hi.subVectors(this.origin,t);const l=o*this.direction.dot(ha.crossVectors(Hi,ha));if(l<0)return null;const c=o*this.direction.dot(Xo.cross(Hi));if(c<0||l+c>a)return null;const h=-o*Hi.dot(qo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,s,r,a,o,l,c,h,u,f,d,m,x,g){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,u,f,d,m,x,g)}set(t,e,n,s,r,a,o,l,c,h,u,f,d,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ls.setFromMatrixColumn(t,0).length(),r=1/Ls.setFromMatrixColumn(t,1).length(),a=1/Ls.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,d=a*u,m=o*h,x=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+m*c,e[5]=f-x*c,e[9]=-o*l,e[2]=x-f*c,e[6]=m+d*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,m=c*h,x=c*u;e[0]=f+x*o,e[4]=m*o-d,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=d*o-m,e[6]=x+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,m=c*h,x=c*u;e[0]=f-x*o,e[4]=-a*u,e[8]=m+d*o,e[1]=d+m*o,e[5]=a*h,e[9]=x-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,d=a*u,m=o*h,x=o*u;e[0]=l*h,e[4]=m*c-d,e[8]=f*c+x,e[1]=l*u,e[5]=x*c+f,e[9]=d*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,d=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=x-f*u,e[8]=m*u+d,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*u+m,e[10]=f-x*u}else if(t.order==="XZY"){const f=a*l,d=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+x,e[5]=a*h,e[9]=d*u-m,e[2]=m*u-d,e[6]=o*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(q0,t,Y0)}lookAt(t,e,n){const s=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Gi.crossVectors(n,Mn),Gi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Gi.crossVectors(n,Mn)),Gi.normalize(),ua.crossVectors(Mn,Gi),s[0]=Gi.x,s[4]=ua.x,s[8]=Mn.x,s[1]=Gi.y,s[5]=ua.y,s[9]=Mn.y,s[2]=Gi.z,s[6]=ua.z,s[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],M=n[7],_=n[11],T=n[15],b=s[0],E=s[4],w=s[8],y=s[12],S=s[1],R=s[5],I=s[9],C=s[13],N=s[2],F=s[6],z=s[10],V=s[14],B=s[3],k=s[7],Y=s[11],nt=s[15];return r[0]=a*b+o*S+l*N+c*B,r[4]=a*E+o*R+l*F+c*k,r[8]=a*w+o*I+l*z+c*Y,r[12]=a*y+o*C+l*V+c*nt,r[1]=h*b+u*S+f*N+d*B,r[5]=h*E+u*R+f*F+d*k,r[9]=h*w+u*I+f*z+d*Y,r[13]=h*y+u*C+f*V+d*nt,r[2]=m*b+x*S+g*N+p*B,r[6]=m*E+x*R+g*F+p*k,r[10]=m*w+x*I+g*z+p*Y,r[14]=m*y+x*C+g*V+p*nt,r[3]=v*b+M*S+_*N+T*B,r[7]=v*E+M*R+_*F+T*k,r[11]=v*w+M*I+_*z+T*Y,r[15]=v*y+M*C+_*V+T*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+r*l*u-s*c*u-r*o*f+n*c*f+s*o*d-n*l*d)+x*(+e*l*d-e*c*f+r*a*f-s*a*d+s*c*h-r*l*h)+g*(+e*c*u-e*o*d-r*a*u+n*a*d+r*o*h-n*c*h)+p*(-s*o*h-e*l*u+e*o*f+s*a*u-n*a*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],m=t[12],x=t[13],g=t[14],p=t[15],v=u*g*c-x*f*c+x*l*d-o*g*d-u*l*p+o*f*p,M=m*f*c-h*g*c-m*l*d+a*g*d+h*l*p-a*f*p,_=h*x*c-m*u*c+m*o*d-a*x*d-h*o*p+a*u*p,T=m*u*l-h*x*l-m*o*f+a*x*f+h*o*g-a*u*g,b=e*v+n*M+s*_+r*T;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/b;return t[0]=v*E,t[1]=(x*f*r-u*g*r-x*s*d+n*g*d+u*s*p-n*f*p)*E,t[2]=(o*g*r-x*l*r+x*s*c-n*g*c-o*s*p+n*l*p)*E,t[3]=(u*l*r-o*f*r-u*s*c+n*f*c+o*s*d-n*l*d)*E,t[4]=M*E,t[5]=(h*g*r-m*f*r+m*s*d-e*g*d-h*s*p+e*f*p)*E,t[6]=(m*l*r-a*g*r-m*s*c+e*g*c+a*s*p-e*l*p)*E,t[7]=(a*f*r-h*l*r+h*s*c-e*f*c-a*s*d+e*l*d)*E,t[8]=_*E,t[9]=(m*u*r-h*x*r-m*n*d+e*x*d+h*n*p-e*u*p)*E,t[10]=(a*x*r-m*o*r+m*n*c-e*x*c-a*n*p+e*o*p)*E,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*d-e*o*d)*E,t[12]=T*E,t[13]=(h*x*s-m*u*s+m*n*f-e*x*f-h*n*g+e*u*g)*E,t[14]=(m*o*s-a*x*s-m*n*l+e*x*l+a*n*g-e*o*g)*E,t[15]=(a*u*s-h*o*s+h*n*l-e*u*l-a*n*f+e*o*f)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,d=r*h,m=r*u,x=a*h,g=a*u,p=o*u,v=l*c,M=l*h,_=l*u,T=n.x,b=n.y,E=n.z;return s[0]=(1-(x+p))*T,s[1]=(d+_)*T,s[2]=(m-M)*T,s[3]=0,s[4]=(d-_)*b,s[5]=(1-(f+p))*b,s[6]=(g+v)*b,s[7]=0,s[8]=(m+M)*E,s[9]=(g-v)*E,s[10]=(1-(f+x))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ls.set(s[0],s[1],s[2]).length();const a=Ls.set(s[4],s[5],s[6]).length(),o=Ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Hn.copy(this);const c=1/r,h=1/a,u=1/o;return Hn.elements[0]*=c,Hn.elements[1]*=c,Hn.elements[2]*=c,Hn.elements[4]*=h,Hn.elements[5]*=h,Hn.elements[6]*=h,Hn.elements[8]*=u,Hn.elements[9]*=u,Hn.elements[10]*=u,e.setFromRotationMatrix(Hn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=oi,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s);let m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===oi)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===ro)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=oi,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),d=-(n+s)/(n-s);let m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===oi)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===ro)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ls=new L,Hn=new ne,q0=new L(0,0,0),Y0=new L(1,1,1),Gi=new L,ua=new L,Mn=new L,Ah=new ne,Rh=new Ne;class xn{constructor(t=0,e=0,n=0,s=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ah.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ah,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Rh.setFromEuler(this),this.setFromQuaternion(Rh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class $c{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $0=0;const Ch=new L,Ds=new Ne,yi=new ne,da=new L,vr=new L,Z0=new L,J0=new Ne,Ph=new L(1,0,0),Ih=new L(0,1,0),Lh=new L(0,0,1),Dh={type:"added"},K0={type:"removed"},Us={type:"childadded",child:null},Yo={type:"childremoved",child:null};class He extends hr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$0++}),this.uuid=li(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=He.DEFAULT_UP.clone();const t=new L,e=new xn,n=new Ne,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ne},normalMatrix:{value:new ae}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=He.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $c,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ds.setFromAxisAngle(t,e),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(t,e){return Ds.setFromAxisAngle(t,e),this.quaternion.premultiply(Ds),this}rotateX(t){return this.rotateOnAxis(Ph,t)}rotateY(t){return this.rotateOnAxis(Ih,t)}rotateZ(t){return this.rotateOnAxis(Lh,t)}translateOnAxis(t,e){return Ch.copy(t).applyQuaternion(this.quaternion),this.position.add(Ch.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ph,t)}translateY(t){return this.translateOnAxis(Ih,t)}translateZ(t){return this.translateOnAxis(Lh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(yi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?da.copy(t):da.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),vr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yi.lookAt(vr,da,this.up):yi.lookAt(da,vr,this.up),this.quaternion.setFromRotationMatrix(yi),s&&(yi.extractRotation(s.matrixWorld),Ds.setFromRotationMatrix(yi),this.quaternion.premultiply(Ds.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dh),Us.child=t,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(K0),Yo.child=t,this.dispatchEvent(Yo),Yo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),yi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),yi.multiply(t.parent.matrixWorld)),t.applyMatrix4(yi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dh),Us.child=t,this.dispatchEvent(Us),Us.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vr,t,Z0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vr,J0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}He.DEFAULT_UP=new L(0,1,0);He.DEFAULT_MATRIX_AUTO_UPDATE=!0;He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gn=new L,Si=new L,$o=new L,bi=new L,Ns=new L,Fs=new L,Uh=new L,Zo=new L,Jo=new L,Ko=new L,jo=new Se,Qo=new Se,tl=new Se;class Nn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Gn.subVectors(t,e),s.cross(Gn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Gn.subVectors(s,e),Si.subVectors(n,e),$o.subVectors(t,e);const a=Gn.dot(Gn),o=Gn.dot(Si),l=Gn.dot($o),c=Si.dot(Si),h=Si.dot($o),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,m=(a*h-o*l)*f;return r.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,bi)===null?!1:bi.x>=0&&bi.y>=0&&bi.x+bi.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,bi.x),l.addScaledVector(a,bi.y),l.addScaledVector(o,bi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return jo.setScalar(0),Qo.setScalar(0),tl.setScalar(0),jo.fromBufferAttribute(t,e),Qo.fromBufferAttribute(t,n),tl.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(jo,r.x),a.addScaledVector(Qo,r.y),a.addScaledVector(tl,r.z),a}static isFrontFacing(t,e,n,s){return Gn.subVectors(n,e),Si.subVectors(t,e),Gn.cross(Si).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gn.subVectors(this.c,this.b),Si.subVectors(this.a,this.b),Gn.cross(Si).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Nn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Nn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Ns.subVectors(s,n),Fs.subVectors(r,n),Zo.subVectors(t,n);const l=Ns.dot(Zo),c=Fs.dot(Zo);if(l<=0&&c<=0)return e.copy(n);Jo.subVectors(t,s);const h=Ns.dot(Jo),u=Fs.dot(Jo);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ns,a);Ko.subVectors(t,r);const d=Ns.dot(Ko),m=Fs.dot(Ko);if(m>=0&&d<=m)return e.copy(r);const x=d*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(Fs,o);const g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return Uh.subVectors(r,s),o=(u-h)/(u-h+(d-m)),e.copy(s).addScaledVector(Uh,o);const p=1/(g+x+f);return a=x*p,o=f*p,e.copy(n).addScaledVector(Ns,a).addScaledVector(Fs,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vi={h:0,s:0,l:0},fa={h:0,s:0,l:0};function el(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=$e){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=Xc(t,1),e=le(e,0,1),n=le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=el(a,r,t+1/3),this.g=el(a,r,t),this.b=el(a,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=$e){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=$e){const n=zd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ui(t.r),this.g=Ui(t.g),this.b=Ui(t.b),this}copyLinearToSRGB(t){return this.r=tr(t.r),this.g=tr(t.g),this.b=tr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=$e){return me.workingToColorSpace(en.copy(this),t),Math.round(le(en.r*255,0,255))*65536+Math.round(le(en.g*255,0,255))*256+Math.round(le(en.b*255,0,255))}getHexString(t=$e){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(en.copy(this),e);const n=en.r,s=en.g,r=en.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=$e){me.workingToColorSpace(en.copy(this),t);const e=en.r,n=en.g,s=en.b;return t!==$e?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Vi),this.setHSL(Vi.h+t,Vi.s+e,Vi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Vi),t.getHSL(fa);const n=Fr(Vi.h,fa.h,e),s=Fr(Vi.s,fa.s,e),r=Fr(Vi.l,fa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const en=new Zt;Zt.NAMES=zd;let j0=0;class Oi extends hr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=li(),this.name="",this.type="Material",this.blending=Qs,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pl,this.blendDst=Il,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=er,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=As,this.stencilZFail=As,this.stencilZPass=As,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Qs&&(n.blending=this.blending),this.side!==Qi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Pl&&(n.blendSrc=this.blendSrc),this.blendDst!==Il&&(n.blendDst=this.blendDst),this.blendEquation!==Ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==er&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==As&&(n.stencilFail=this.stencilFail),this.stencilZFail!==As&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==As&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ke extends Oi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=Oc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ze=new L,pa=new gt;let Q0=0;class Ce{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Q0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=gc,this.updateRanges=[],this.gpuType=Yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)pa.fromBufferAttribute(this,e),pa.applyMatrix3(t),this.setXY(e,pa.x,pa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=qn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Me(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=qn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=qn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=qn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=qn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array),r=Me(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gc&&(t.usage=this.usage),t}}class Bd extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class kd extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}}let tp=0;const Cn=new ne,nl=new He,Os=new L,yn=new $n,_r=new $n,qe=new L;class Ae extends hr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=li(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Fd(t)?kd:Bd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ae().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Cn.makeRotationFromQuaternion(t),this.applyMatrix4(Cn),this}rotateX(t){return Cn.makeRotationX(t),this.applyMatrix4(Cn),this}rotateY(t){return Cn.makeRotationY(t),this.applyMatrix4(Cn),this}rotateZ(t){return Cn.makeRotationZ(t),this.applyMatrix4(Cn),this}translate(t,e,n){return Cn.makeTranslation(t,e,n),this.applyMatrix4(Cn),this}scale(t,e,n){return Cn.makeScale(t,e,n),this.applyMatrix4(Cn),this}lookAt(t){return nl.lookAt(t),nl.updateMatrix(),this.applyMatrix4(nl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Os).negate(),this.translate(Os.x,Os.y,Os.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $n);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(qe.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(qe),qe.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(qe)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ts);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];_r.setFromBufferAttribute(o),this.morphTargetsRelative?(qe.addVectors(yn.min,_r.min),yn.expandByPoint(qe),qe.addVectors(yn.max,_r.max),yn.expandByPoint(qe)):(yn.expandByPoint(_r.min),yn.expandByPoint(_r.max))}yn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)qe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(qe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)qe.fromBufferAttribute(o,c),l&&(Os.fromBufferAttribute(t,c),qe.add(Os)),s=Math.max(s,n.distanceToSquared(qe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let w=0;w<n.count;w++)o[w]=new L,l[w]=new L;const c=new L,h=new L,u=new L,f=new gt,d=new gt,m=new gt,x=new L,g=new L;function p(w,y,S){c.fromBufferAttribute(n,w),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,S),f.fromBufferAttribute(r,w),d.fromBufferAttribute(r,y),m.fromBufferAttribute(r,S),h.sub(c),u.sub(c),d.sub(f),m.sub(f);const R=1/(d.x*m.y-m.x*d.y);isFinite(R)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(R),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(R),o[w].add(x),o[y].add(x),o[S].add(x),l[w].add(g),l[y].add(g),l[S].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let w=0,y=v.length;w<y;++w){const S=v[w],R=S.start,I=S.count;for(let C=R,N=R+I;C<N;C+=3)p(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const M=new L,_=new L,T=new L,b=new L;function E(w){T.fromBufferAttribute(s,w),b.copy(T);const y=o[w];M.copy(y),M.sub(T.multiplyScalar(T.dot(y))).normalize(),_.crossVectors(b,y);const R=_.dot(l[w])<0?-1:1;a.setXYZW(w,M.x,M.y,M.z,R)}for(let w=0,y=v.length;w<y;++w){const S=v[w],R=S.start,I=S.count;for(let C=R,N=R+I;C<N;C+=3)E(t.getX(C+0)),E(t.getX(C+1)),E(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,u=new L;if(t)for(let f=0,d=t.count;f<d;f+=3){const m=t.getX(f+0),x=t.getX(f+1),g=t.getX(f+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)qe.fromBufferAttribute(t,e),qe.normalize(),t.setXYZ(e,qe.x,qe.y,qe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*h;for(let p=0;p<h;p++)f[m++]=c[d++]}return new Ce(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nh=new ne,rs=new Yc,ma=new Ts,Fh=new L,ga=new L,xa=new L,va=new L,il=new L,_a=new L,Oh=new L,Ma=new L;class Xt extends He{constructor(t=new Ae,e=new Ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){_a.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(il.fromBufferAttribute(u,t),a?_a.addScaledVector(il,h):_a.addScaledVector(il.sub(e),h))}e.add(_a)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ma.copy(n.boundingSphere),ma.applyMatrix4(r),rs.copy(t.ray).recast(t.near),!(ma.containsPoint(rs.origin)===!1&&(rs.intersectSphere(ma,Fh)===null||rs.origin.distanceToSquared(Fh)>(t.far-t.near)**2))&&(Nh.copy(r).invert(),rs.copy(t.ray).applyMatrix4(Nh),!(n.boundingBox!==null&&rs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,rs)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){const g=f[m],p=a[g.materialIndex],v=Math.max(g.start,d.start),M=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let _=v,T=M;_<T;_+=3){const b=o.getX(_),E=o.getX(_+1),w=o.getX(_+2);s=ya(this,p,t,n,c,h,u,b,E,w),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const v=o.getX(g),M=o.getX(g+1),_=o.getX(g+2);s=ya(this,a,t,n,c,h,u,v,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){const g=f[m],p=a[g.materialIndex],v=Math.max(g.start,d.start),M=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let _=v,T=M;_<T;_+=3){const b=_,E=_+1,w=_+2;s=ya(this,p,t,n,c,h,u,b,E,w),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const v=g,M=g+1,_=g+2;s=ya(this,a,t,n,c,h,u,v,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function ep(i,t,e,n,s,r,a,o){let l;if(t.side===rn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Qi,o),l===null)return null;Ma.copy(o),Ma.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ma);return c<e.near||c>e.far?null:{distance:c,point:Ma.clone(),object:i}}function ya(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,ga),i.getVertexPosition(l,xa),i.getVertexPosition(c,va);const h=ep(i,t,e,n,ga,xa,va,Oh);if(h){const u=new L;Nn.getBarycoord(Oh,ga,xa,va,u),s&&(h.uv=Nn.getInterpolatedAttribute(s,o,l,c,u,new gt)),r&&(h.uv1=Nn.getInterpolatedAttribute(r,o,l,c,u,new gt)),a&&(h.normal=Nn.getInterpolatedAttribute(a,o,l,c,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new L,materialIndex:0};Nn.getNormal(ga,xa,va,f.normal),h.face=f,h.barycoord=u}return h}class Jn extends Ae{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function m(x,g,p,v,M,_,T,b,E,w,y){const S=_/E,R=T/w,I=_/2,C=T/2,N=b/2,F=E+1,z=w+1;let V=0,B=0;const k=new L;for(let Y=0;Y<z;Y++){const nt=Y*R-C;for(let K=0;K<F;K++){const mt=K*S-I;k[x]=mt*v,k[g]=nt*M,k[p]=N,c.push(k.x,k.y,k.z),k[x]=0,k[g]=0,k[p]=b>0?1:-1,h.push(k.x,k.y,k.z),u.push(K/E),u.push(1-Y/w),V+=1}}for(let Y=0;Y<w;Y++)for(let nt=0;nt<E;nt++){const K=f+nt+F*Y,mt=f+nt+F*(Y+1),It=f+(nt+1)+F*(Y+1),Ut=f+(nt+1)+F*Y;l.push(K,mt,Ut),l.push(mt,It,Ut),B+=6}o.addGroup(d,B,y),d+=B,f+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function or(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ln(i){const t={};for(let e=0;e<i.length;e++){const n=or(i[e]);for(const s in n)t[s]=n[s]}return t}function np(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Hd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const vs={clone:or,merge:ln};var ip=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends Oi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ip,this.fragmentShader=sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=or(t.uniforms),this.uniformsGroups=np(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Gd extends He{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=oi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wi=new L,zh=new gt,Bh=new gt;class sn extends Gd{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Wr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Nr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Wr*2*Math.atan(Math.tan(Nr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Wi.x,Wi.y).multiplyScalar(-t/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-t/Wi.z)}getViewSize(t,e){return this.getViewBounds(t,zh,Bh),e.subVectors(Bh,zh)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Nr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const zs=-90,Bs=1;class rp extends He{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(zs,Bs,t,e);s.layers=this.layers,this.add(s);const r=new sn(zs,Bs,t,e);r.layers=this.layers,this.add(r);const a=new sn(zs,Bs,t,e);a.layers=this.layers,this.add(a);const o=new sn(zs,Bs,t,e);o.layers=this.layers,this.add(o);const l=new sn(zs,Bs,t,e);l.layers=this.layers,this.add(l);const c=new sn(zs,Bs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===oi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ro)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Vd extends je{constructor(t=[],e=nr,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ap extends En{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Vd(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Jn(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:or(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:cn});r.uniforms.tEquirect.value=e;const a=new Xt(s,r),o=e.minFilter;return e.minFilter===xs&&(e.minFilter=ai),new rp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class re extends He{constructor(){super(),this.isGroup=!0,this.type="Group"}}const op={type:"move"};class sl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;c.inputState.pinching&&f>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(op)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new re;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Zc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Zt(t),this.density=e}clone(){return new Zc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class xc extends He{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class lp{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=gc,this.updateRanges=[],this.version=0,this.uuid=li()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=li()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=li()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const on=new L;class ao{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyMatrix4(t),this.setXYZ(e,on.x,on.y,on.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyNormalMatrix(t),this.setXYZ(e,on.x,on.y,on.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.transformDirection(t),this.setXYZ(e,on.x,on.y,on.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=qn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Me(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=qn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=qn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=qn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=qn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Me(e,this.array),n=Me(n,this.array),s=Me(s,this.array),r=Me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ao(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class vc extends Oi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ks;const Mr=new L,Hs=new L,Gs=new L,Vs=new gt,yr=new gt,Wd=new ne,Sa=new L,Sr=new L,ba=new L,kh=new gt,rl=new gt,Hh=new gt;class Gh extends He{constructor(t=new vc){if(super(),this.isSprite=!0,this.type="Sprite",ks===void 0){ks=new Ae;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new lp(e,5);ks.setIndex([0,1,2,0,2,3]),ks.setAttribute("position",new ao(n,3,0,!1)),ks.setAttribute("uv",new ao(n,2,3,!1))}this.geometry=ks,this.material=t,this.center=new gt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hs.setFromMatrixScale(this.matrixWorld),Wd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Gs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hs.multiplyScalar(-Gs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;wa(Sa.set(-.5,-.5,0),Gs,a,Hs,s,r),wa(Sr.set(.5,-.5,0),Gs,a,Hs,s,r),wa(ba.set(.5,.5,0),Gs,a,Hs,s,r),kh.set(0,0),rl.set(1,0),Hh.set(1,1);let o=t.ray.intersectTriangle(Sa,Sr,ba,!1,Mr);if(o===null&&(wa(Sr.set(-.5,.5,0),Gs,a,Hs,s,r),rl.set(0,1),o=t.ray.intersectTriangle(Sa,ba,Sr,!1,Mr),o===null))return;const l=t.ray.origin.distanceTo(Mr);l<t.near||l>t.far||e.push({distance:l,point:Mr.clone(),uv:Nn.getInterpolation(Mr,Sa,Sr,ba,kh,rl,Hh,new gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function wa(i,t,e,n,s,r){Vs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(yr.x=r*Vs.x-s*Vs.y,yr.y=s*Vs.x+r*Vs.y):yr.copy(Vs),i.copy(t),i.x+=yr.x,i.y+=yr.y,i.applyMatrix4(Wd)}class Jc extends je{constructor(t=null,e=1,n=1,s,r,a,o,l,c=un,h=un,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vh extends Ce{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ws=new ne,Wh=new ne,Ta=[],Xh=new $n,cp=new ne,br=new Xt,wr=new Ts;class hp extends Xt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Vh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,cp)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $n),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ws),Xh.copy(t.boundingBox).applyMatrix4(Ws),this.boundingBox.union(Xh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ts),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ws),wr.copy(t.boundingSphere).applyMatrix4(Ws),this.boundingSphere.union(wr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(br.geometry=this.geometry,br.material=this.material,br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wr.copy(this.boundingSphere),wr.applyMatrix4(n),t.ray.intersectsSphere(wr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ws),Wh.multiplyMatrices(n,Ws),br.matrixWorld=Wh,br.raycast(t,Ta);for(let a=0,o=Ta.length;a<o;a++){const l=Ta[a];l.instanceId=r,l.object=this,e.push(l)}Ta.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Vh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Jc(new Float32Array(s*this.count),s,this.count,So,Yn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const al=new L,up=new L,dp=new ae;class ds{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=al.subVectors(n,e).cross(up.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(al),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||dp.getNormalMatrix(t),s=this.coplanarPoint(al).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const as=new Ts,fp=new gt(.5,.5),Ea=new L;class Kc{constructor(t=new ds,e=new ds,n=new ds,s=new ds,r=new ds,a=new ds){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=oi,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],v=r[12],M=r[13],_=r[14],T=r[15];if(s[0].setComponents(c-a,d-h,p-m,T-v).normalize(),s[1].setComponents(c+a,d+h,p+m,T+v).normalize(),s[2].setComponents(c+o,d+u,p+x,T+M).normalize(),s[3].setComponents(c-o,d-u,p-x,T-M).normalize(),n)s[4].setComponents(l,f,g,_).normalize(),s[5].setComponents(c-l,d-f,p-g,T-_).normalize();else if(s[4].setComponents(c-l,d-f,p-g,T-_).normalize(),e===oi)s[5].setComponents(c+l,d+f,p+g,T+_).normalize();else if(e===ro)s[5].setComponents(l,f,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),as.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),as.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(as)}intersectsSprite(t){as.center.set(0,0,0);const e=fp.distanceTo(t.center);return as.radius=.7071067811865476+e,as.applyMatrix4(t.matrixWorld),this.intersectsSphere(as)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ea.x=s.normal.x>0?t.max.x:t.min.x,Ea.y=s.normal.y>0?t.max.y:t.min.y,Ea.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ea)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Xd extends Oi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const qh=new ne,_c=new Yc,Aa=new Ts,Ra=new L;class pp extends He{constructor(t=new Ae,e=new Xd){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Aa.copy(n.boundingSphere),Aa.applyMatrix4(s),Aa.radius+=r,t.ray.intersectsSphere(Aa)===!1)return;qh.copy(s).invert(),_c.copy(t.ray).applyMatrix4(qh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=f,x=d;m<x;m++){const g=c.getX(m);Ra.fromBufferAttribute(u,g),Yh(Ra,g,l,s,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let m=f,x=d;m<x;m++)Ra.fromBufferAttribute(u,m),Yh(Ra,m,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Yh(i,t,e,n,s,r,a){const o=_c.distanceSqToPoint(i);if(o<e){const l=new L;_c.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class mp extends je{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class jc extends je{constructor(t,e,n=Ss,s,r,a,o=un,l=un,c,h=Vr,u=1){if(h!==Vr&&h!==rr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new qc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class qd extends je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ts extends Ae{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new L,h=new gt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/t+1)/2,h.y=(a[f+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ts(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Fe extends Ae{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let m=0;const x=[],g=n/2;let p=0;v(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(f,3)),this.setAttribute("uv",new he(d,2));function v(){const _=new L,T=new L;let b=0;const E=(e-t)/n;for(let w=0;w<=r;w++){const y=[],S=w/r,R=S*(e-t)+t;for(let I=0;I<=s;I++){const C=I/s,N=C*l+o,F=Math.sin(N),z=Math.cos(N);T.x=R*F,T.y=-S*n+g,T.z=R*z,u.push(T.x,T.y,T.z),_.set(F,E,z).normalize(),f.push(_.x,_.y,_.z),d.push(C,1-S),y.push(m++)}x.push(y)}for(let w=0;w<s;w++)for(let y=0;y<r;y++){const S=x[y][w],R=x[y+1][w],I=x[y+1][w+1],C=x[y][w+1];(t>0||y!==0)&&(h.push(S,R,C),b+=3),(e>0||y!==r-1)&&(h.push(R,I,C),b+=3)}c.addGroup(p,b,0),p+=b}function M(_){const T=m,b=new gt,E=new L;let w=0;const y=_===!0?t:e,S=_===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,g*S,0),f.push(0,S,0),d.push(.5,.5),m++;const R=m;for(let I=0;I<=s;I++){const N=I/s*l+o,F=Math.cos(N),z=Math.sin(N);E.x=y*z,E.y=g*S,E.z=y*F,u.push(E.x,E.y,E.z),f.push(0,S,0),b.x=F*.5+.5,b.y=z*.5*S+.5,d.push(b.x,b.y),m++}for(let I=0;I<s;I++){const C=T+I,N=R+I;_===!0?h.push(N,N+1,C):h.push(N+1,N,C),w+=3}c.addGroup(p,w,_===!0?1:2),p+=w}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fe(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qc extends Ae{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(r.slice(),3)),this.setAttribute("uv",new he(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const M=new L,_=new L,T=new L;for(let b=0;b<e.length;b+=3)d(e[b+0],M),d(e[b+1],_),d(e[b+2],T),l(M,_,T,v)}function l(v,M,_,T){const b=T+1,E=[];for(let w=0;w<=b;w++){E[w]=[];const y=v.clone().lerp(_,w/b),S=M.clone().lerp(_,w/b),R=b-w;for(let I=0;I<=R;I++)I===0&&w===b?E[w][I]=y:E[w][I]=y.clone().lerp(S,I/R)}for(let w=0;w<b;w++)for(let y=0;y<2*(b-w)-1;y++){const S=Math.floor(y/2);y%2===0?(f(E[w][S+1]),f(E[w+1][S]),f(E[w][S])):(f(E[w][S+1]),f(E[w+1][S+1]),f(E[w+1][S]))}}function c(v){const M=new L;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(v),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){const v=new L;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];const _=g(v)/2/Math.PI+.5,T=p(v)/Math.PI+.5;a.push(_,1-T)}m(),u()}function u(){for(let v=0;v<a.length;v+=6){const M=a[v+0],_=a[v+2],T=a[v+4],b=Math.max(M,_,T),E=Math.min(M,_,T);b>.9&&E<.1&&(M<.2&&(a[v+0]+=1),_<.2&&(a[v+2]+=1),T<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function d(v,M){const _=v*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function m(){const v=new L,M=new L,_=new L,T=new L,b=new gt,E=new gt,w=new gt;for(let y=0,S=0;y<r.length;y+=9,S+=6){v.set(r[y+0],r[y+1],r[y+2]),M.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),b.set(a[S+0],a[S+1]),E.set(a[S+2],a[S+3]),w.set(a[S+4],a[S+5]),T.copy(v).add(M).add(_).divideScalar(3);const R=g(T);x(b,S+0,v,R),x(E,S+2,M,R),x(w,S+4,_,R)}}function x(v,M,_,T){T<0&&v.x===1&&(a[M]=v.x-1),_.x===0&&_.z===0&&(a[M]=T/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qc(t.vertices,t.indices,t.radius,t.details)}}class gi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],f=n[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new gt:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new L,s=[],r=[],a=[],o=new L,l=new ne;for(let d=0;d<=t;d++){const m=d/t;s[d]=this.getTangentAt(m,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(le(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,m))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(le(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],d*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Yr extends gi{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new gt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class gp extends Yr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function th(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Ca=new L,ol=new th,ll=new th,cl=new th;class Ni extends gi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Ca.subVectors(s[0],s[1]).add(s[0]),c=Ca);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ca.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ca),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),ol.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,m,x,g),ll.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,m,x,g),cl.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(ol.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),ll.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),cl.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(ol.calc(l),ll.calc(l),cl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function $h(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function xp(i,t){const e=1-i;return e*e*t}function vp(i,t){return 2*(1-i)*i*t}function _p(i,t){return i*i*t}function Or(i,t,e,n){return xp(i,t)+vp(i,e)+_p(i,n)}function Mp(i,t){const e=1-i;return e*e*e*t}function yp(i,t){const e=1-i;return 3*e*e*i*t}function Sp(i,t){return 3*(1-i)*i*i*t}function bp(i,t){return i*i*i*t}function zr(i,t,e,n,s){return Mp(i,t)+yp(i,e)+Sp(i,n)+bp(i,s)}class Yd extends gi{constructor(t=new gt,e=new gt,n=new gt,s=new gt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new gt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zr(t,s.x,r.x,a.x,o.x),zr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wp extends gi{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zr(t,s.x,r.x,a.x,o.x),zr(t,s.y,r.y,a.y,o.y),zr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $d extends gi{constructor(t=new gt,e=new gt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new gt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new gt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $r extends gi{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zd extends gi{constructor(t=new gt,e=new gt,n=new gt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new gt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Or(t,s.x,r.x,a.x),Or(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jd extends gi{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Or(t,s.x,r.x,a.x),Or(t,s.y,r.y,a.y),Or(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kd extends gi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new gt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set($h(o,l.x,c.x,h.x,u.x),$h(o,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new gt().fromArray(s))}return this}}var oo=Object.freeze({__proto__:null,ArcCurve:gp,CatmullRomCurve3:Ni,CubicBezierCurve:Yd,CubicBezierCurve3:wp,EllipseCurve:Yr,LineCurve:$d,LineCurve3:$r,QuadraticBezierCurve:Zd,QuadraticBezierCurve3:Jd,SplineCurve:Kd});class Tp extends gi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new oo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new oo[s.type]().fromJSON(s))}return this}}class lo extends Tp{constructor(t){super(),this.type="Path",this.currentPoint=new gt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new $d(this.currentPoint.clone(),new gt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Zd(this.currentPoint.clone(),new gt(t,e),new gt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Yd(this.currentPoint.clone(),new gt(t,e),new gt(n,s),new gt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Kd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Yr(t,e,n,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class zi extends lo{constructor(t){super(t),this.uuid=li(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new lo().fromJSON(s))}return this}}function Ep(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=jd(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Ip(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){const d=i[f],m=i[f+1];d<o&&(o=d),m<l&&(l=m),d>h&&(h=d),m>u&&(u=m)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Zr(r,a,e,o,l,c,0),a}function jd(i,t,e,n,s){let r;if(s===Gp(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Zh(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Zh(a/n|0,i[a],i[a+1],r);return r&&lr(r,r.next)&&(Kr(r),r=r.next),r}function bs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(lr(e,e.next)||De(e.prev,e,e.next)===0)){if(Kr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Zr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Fp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Rp(i,n,s,r):Ap(i)){t.push(l.i,i.i,c.i),Kr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Cp(bs(i),t),Zr(i,t,e,n,s,r,2)):a===2&&Pp(i,t,e,n,s,r):Zr(bs(i),t,e,n,s,r,1);break}}}function Ap(i){const t=i.prev,e=i,n=i.next;if(De(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),f=Math.max(s,r,a),d=Math.max(o,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=d&&Cr(s,o,r,l,a,c,m.x,m.y)&&De(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Rp(i,t,e,n){const s=i.prev,r=i,a=i.next;if(De(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,l,c),m=Math.min(h,u,f),x=Math.max(o,l,c),g=Math.max(h,u,f),p=Mc(d,m,t,e,n),v=Mc(x,g,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=v;){if(M.x>=d&&M.x<=x&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&Cr(o,h,l,u,c,f,M.x,M.y)&&De(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=d&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Cr(o,h,l,u,c,f,_.x,_.y)&&De(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=d&&M.x<=x&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&Cr(o,h,l,u,c,f,M.x,M.y)&&De(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=v;){if(_.x>=d&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Cr(o,h,l,u,c,f,_.x,_.y)&&De(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Cp(i,t){let e=i;do{const n=e.prev,s=e.next.next;!lr(n,s)&&tf(n,e,e.next,s)&&Jr(n,s)&&Jr(s,n)&&(t.push(n.i,e.i,s.i),Kr(e),Kr(e.next),e=i=s),e=e.next}while(e!==i);return bs(e)}function Pp(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Bp(a,o)){let l=ef(a,o);a=bs(a,a.next),l=bs(l,l.next),Zr(a,t,e,n,s,r,0),Zr(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Ip(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=jd(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(zp(c))}s.sort(Lp);for(let r=0;r<s.length;r++)e=Dp(s[r],e);return e}function Lp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Dp(i,t){const e=Up(i,t);if(!e)return t;const n=ef(e,i);return bs(n,n.next),bs(e,e.next)}function Up(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(lr(i,e))return e;do{if(lr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Qd(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Jr(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&Np(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function Np(i,t){return De(i.prev,i,t.prev)<0&&De(t.next,i,i.next)<0}function Fp(i,t,e,n){let s=i;do s.z===0&&(s.z=Mc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Op(s)}function Op(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Mc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function zp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Qd(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Cr(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Qd(i,t,e,n,s,r,a,o)}function Bp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!kp(i,t)&&(Jr(i,t)&&Jr(t,i)&&Hp(i,t)&&(De(i.prev,i,t.prev)||De(i,t.prev,t))||lr(i,t)&&De(i.prev,i,i.next)>0&&De(t.prev,t,t.next)>0)}function De(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function lr(i,t){return i.x===t.x&&i.y===t.y}function tf(i,t,e,n){const s=Ia(De(i,t,e)),r=Ia(De(i,t,n)),a=Ia(De(e,n,i)),o=Ia(De(e,n,t));return!!(s!==r&&a!==o||s===0&&Pa(i,e,t)||r===0&&Pa(i,n,t)||a===0&&Pa(e,i,n)||o===0&&Pa(e,t,n))}function Pa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ia(i){return i>0?1:i<0?-1:0}function kp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&tf(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Jr(i,t){return De(i.prev,i,i.next)<0?De(i,t,i.next)>=0&&De(i,i.prev,t)>=0:De(i,t,i.prev)<0||De(i,i.next,t)<0}function Hp(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function ef(i,t){const e=yc(i.i,i.x,i.y),n=yc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Zh(i,t,e,n){const s=yc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Kr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function yc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Gp(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Vp{static triangulate(t,e,n=2){return Ep(t,e,n)}}class Li{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Li.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Jh(t),Kh(n,t);let a=t.length;e.forEach(Jh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Kh(n,e[l]);const o=Vp.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Jh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Kh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class wo extends Ae{constructor(t=new zi([new gt(.5,.5),new gt(-.5,.5),new gt(-.5,-.5),new gt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new he(s,3)),this.setAttribute("uv",new he(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:Wp;let M,_=!1,T,b,E,w;p&&(M=p.getSpacedPoints(h),_=!0,f=!1,T=p.computeFrenetFrames(h,!1),b=new L,E=new L,w=new L),f||(g=0,d=0,m=0,x=0);const y=o.extractPoints(c);let S=y.shape;const R=y.holes;if(!Li.isClockWise(S)){S=S.reverse();for(let tt=0,j=R.length;tt<j;tt++){const ot=R[tt];Li.isClockWise(ot)&&(R[tt]=ot.reverse())}}function C(tt){const ot=10000000000000001e-36;let it=tt[0];for(let xt=1;xt<=tt.length;xt++){const dt=xt%tt.length,vt=tt[dt],Jt=vt.x-it.x,$t=vt.y-it.y,D=Jt*Jt+$t*$t,A=Math.max(Math.abs(vt.x),Math.abs(vt.y),Math.abs(it.x),Math.abs(it.y)),W=ot*A*A;if(D<=W){tt.splice(dt,1),xt--;continue}it=vt}}C(S),R.forEach(C);const N=R.length,F=S;for(let tt=0;tt<N;tt++){const j=R[tt];S=S.concat(j)}function z(tt,j,ot){return j||console.error("THREE.ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector(j,ot)}const V=S.length;function B(tt,j,ot){let it,xt,dt;const vt=tt.x-j.x,Jt=tt.y-j.y,$t=ot.x-tt.x,D=ot.y-tt.y,A=vt*vt+Jt*Jt,W=vt*D-Jt*$t;if(Math.abs(W)>Number.EPSILON){const Q=Math.sqrt(A),ht=Math.sqrt($t*$t+D*D),J=j.x-Jt/Q,Ft=j.y+vt/Q,yt=ot.x-D/ht,Lt=ot.y+$t/ht,kt=((yt-J)*D-(Lt-Ft)*$t)/(vt*D-Jt*$t);it=J+vt*kt-tt.x,xt=Ft+Jt*kt-tt.y;const St=it*it+xt*xt;if(St<=2)return new gt(it,xt);dt=Math.sqrt(St/2)}else{let Q=!1;vt>Number.EPSILON?$t>Number.EPSILON&&(Q=!0):vt<-Number.EPSILON?$t<-Number.EPSILON&&(Q=!0):Math.sign(Jt)===Math.sign(D)&&(Q=!0),Q?(it=-Jt,xt=vt,dt=Math.sqrt(A)):(it=vt,xt=Jt,dt=Math.sqrt(A/2))}return new gt(it/dt,xt/dt)}const k=[];for(let tt=0,j=F.length,ot=j-1,it=tt+1;tt<j;tt++,ot++,it++)ot===j&&(ot=0),it===j&&(it=0),k[tt]=B(F[tt],F[ot],F[it]);const Y=[];let nt,K=k.concat();for(let tt=0,j=N;tt<j;tt++){const ot=R[tt];nt=[];for(let it=0,xt=ot.length,dt=xt-1,vt=it+1;it<xt;it++,dt++,vt++)dt===xt&&(dt=0),vt===xt&&(vt=0),nt[it]=B(ot[it],ot[dt],ot[vt]);Y.push(nt),K=K.concat(nt)}let mt;if(g===0)mt=Li.triangulateShape(F,R);else{const tt=[],j=[];for(let ot=0;ot<g;ot++){const it=ot/g,xt=d*Math.cos(it*Math.PI/2),dt=m*Math.sin(it*Math.PI/2)+x;for(let vt=0,Jt=F.length;vt<Jt;vt++){const $t=z(F[vt],k[vt],dt);Tt($t.x,$t.y,-xt),it===0&&tt.push($t)}for(let vt=0,Jt=N;vt<Jt;vt++){const $t=R[vt];nt=Y[vt];const D=[];for(let A=0,W=$t.length;A<W;A++){const Q=z($t[A],nt[A],dt);Tt(Q.x,Q.y,-xt),it===0&&D.push(Q)}it===0&&j.push(D)}}mt=Li.triangulateShape(tt,j)}const It=mt.length,Ut=m+x;for(let tt=0;tt<V;tt++){const j=f?z(S[tt],K[tt],Ut):S[tt];_?(E.copy(T.normals[0]).multiplyScalar(j.x),b.copy(T.binormals[0]).multiplyScalar(j.y),w.copy(M[0]).add(E).add(b),Tt(w.x,w.y,w.z)):Tt(j.x,j.y,0)}for(let tt=1;tt<=h;tt++)for(let j=0;j<V;j++){const ot=f?z(S[j],K[j],Ut):S[j];_?(E.copy(T.normals[tt]).multiplyScalar(ot.x),b.copy(T.binormals[tt]).multiplyScalar(ot.y),w.copy(M[tt]).add(E).add(b),Tt(w.x,w.y,w.z)):Tt(ot.x,ot.y,u/h*tt)}for(let tt=g-1;tt>=0;tt--){const j=tt/g,ot=d*Math.cos(j*Math.PI/2),it=m*Math.sin(j*Math.PI/2)+x;for(let xt=0,dt=F.length;xt<dt;xt++){const vt=z(F[xt],k[xt],it);Tt(vt.x,vt.y,u+ot)}for(let xt=0,dt=R.length;xt<dt;xt++){const vt=R[xt];nt=Y[xt];for(let Jt=0,$t=vt.length;Jt<$t;Jt++){const D=z(vt[Jt],nt[Jt],it);_?Tt(D.x,D.y+M[h-1].y,M[h-1].x+ot):Tt(D.x,D.y,u+ot)}}}$(),rt();function $(){const tt=s.length/3;if(f){let j=0,ot=V*j;for(let it=0;it<It;it++){const xt=mt[it];wt(xt[2]+ot,xt[1]+ot,xt[0]+ot)}j=h+g*2,ot=V*j;for(let it=0;it<It;it++){const xt=mt[it];wt(xt[0]+ot,xt[1]+ot,xt[2]+ot)}}else{for(let j=0;j<It;j++){const ot=mt[j];wt(ot[2],ot[1],ot[0])}for(let j=0;j<It;j++){const ot=mt[j];wt(ot[0]+V*h,ot[1]+V*h,ot[2]+V*h)}}n.addGroup(tt,s.length/3-tt,0)}function rt(){const tt=s.length/3;let j=0;_t(F,j),j+=F.length;for(let ot=0,it=R.length;ot<it;ot++){const xt=R[ot];_t(xt,j),j+=xt.length}n.addGroup(tt,s.length/3-tt,1)}function _t(tt,j){let ot=tt.length;for(;--ot>=0;){const it=ot;let xt=ot-1;xt<0&&(xt=tt.length-1);for(let dt=0,vt=h+g*2;dt<vt;dt++){const Jt=V*dt,$t=V*(dt+1),D=j+it+Jt,A=j+xt+Jt,W=j+xt+$t,Q=j+it+$t;qt(D,A,W,Q)}}}function Tt(tt,j,ot){l.push(tt),l.push(j),l.push(ot)}function wt(tt,j,ot){Bt(tt),Bt(j),Bt(ot);const it=s.length/3,xt=v.generateTopUV(n,s,it-3,it-2,it-1);U(xt[0]),U(xt[1]),U(xt[2])}function qt(tt,j,ot,it){Bt(tt),Bt(j),Bt(it),Bt(j),Bt(ot),Bt(it);const xt=s.length/3,dt=v.generateSideWallUV(n,s,xt-6,xt-3,xt-2,xt-1);U(dt[0]),U(dt[1]),U(dt[3]),U(dt[1]),U(dt[2]),U(dt[3])}function Bt(tt){s.push(l[tt*3+0]),s.push(l[tt*3+1]),s.push(l[tt*3+2])}function U(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Xp(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new oo[s.type]().fromJSON(s)),new wo(n,t.options)}}const Wp={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new gt(r,a),new gt(o,l),new gt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],m=t[s*3+2],x=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new gt(a,1-l),new gt(c,1-u),new gt(f,1-m),new gt(x,1-p)]:[new gt(o,1-l),new gt(h,1-u),new gt(d,1-m),new gt(g,1-p)]}};function Xp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class To extends Qc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new To(t.radius,t.detail)}}class Eo extends Ae{constructor(t=[new gt(0,-.5),new gt(.5,0),new gt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=le(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,u=new L,f=new gt,d=new L,m=new L,x=new L;let g=0,p=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:g=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,d.x=p*1,d.y=-g,d.z=p*0,x.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:g=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,d.x=p*1,d.y=-g,d.z=p*0,m.copy(d),d.x+=x.x,d.y+=x.y,d.z+=x.z,d.normalize(),l.push(d.x,d.y,d.z),x.copy(m)}for(let v=0;v<=e;v++){const M=n+v*h*s,_=Math.sin(M),T=Math.cos(M);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*_,u.y=t[b].y,u.z=t[b].x*T,a.push(u.x,u.y,u.z),f.x=v/e,f.y=b/(t.length-1),o.push(f.x,f.y);const E=l[3*b+0]*_,w=l[3*b+1],y=l[3*b+0]*T;c.push(E,w,y)}}for(let v=0;v<e;v++)for(let M=0;M<t.length-1;M++){const _=M+v*t.length,T=_,b=_+t.length,E=_+t.length+1,w=_+1;r.push(T,b,w),r.push(E,w,b)}this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Eo(t.points,t.segments,t.phiStart,t.phiLength)}}class fe extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,f=e/l,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const v=p*f-a;for(let M=0;M<c;M++){const _=M*u-r;m.push(_,-v,0),x.push(0,0,1),g.push(M/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<o;v++){const M=v+c*p,_=v+c*(p+1),T=v+1+c*(p+1),b=v+1+c*p;d.push(M,_,b),d.push(_,T,b)}this.setIndex(d),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fe(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ao extends Ae{constructor(t=new zi([new gt(0,.5),new gt(-.5,-.5),new gt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new he(s,3)),this.setAttribute("normal",new he(r,3)),this.setAttribute("uv",new he(a,2));function c(h){const u=s.length/3,f=h.extractPoints(e);let d=f.shape;const m=f.holes;Li.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,p=m.length;g<p;g++){const v=m[g];Li.isClockWise(v)===!0&&(m[g]=v.reverse())}const x=Li.triangulateShape(d,m);for(let g=0,p=m.length;g<p;g++){const v=m[g];d=d.concat(v)}for(let g=0,p=d.length;g<p;g++){const v=d[g];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let g=0,p=x.length;g<p;g++){const v=x[g],M=v[0]+u,_=v[1]+u,T=v[2]+u;n.push(M,_,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return qp(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new Ao(n,t.curveSegments)}}function qp(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class ur extends Ae{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new L,f=new L,d=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){const v=[],M=p/n;let _=0;p===0&&a===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let T=0;T<=e;T++){const b=T/e;u.x=-t*Math.cos(s+b*r)*Math.sin(a+M*o),u.y=t*Math.cos(a+M*o),u.z=t*Math.sin(s+b*r)*Math.sin(a+M*o),m.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),g.push(b+_,1-M),v.push(c++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const M=h[p][v+1],_=h[p][v],T=h[p+1][v],b=h[p+1][v+1];(p!==0||a>0)&&d.push(M,_,b),(p!==n-1||l<Math.PI)&&d.push(_,T,b)}this.setIndex(d),this.setAttribute("position",new he(m,3)),this.setAttribute("normal",new he(x,3)),this.setAttribute("uv",new he(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ur(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ci extends Ae{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new L,u=new L,f=new L;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){const x=m/s*r,g=d/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(x),u.y=(t+e*Math.cos(g))*Math.sin(x),u.z=e*Math.sin(g),o.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(m/s),c.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){const x=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,p=(s+1)*(d-1)+m,v=(s+1)*d+m;a.push(x,g,v),a.push(g,p,v)}this.setIndex(a),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(l,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ci(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Tn extends Ae{constructor(t=new Jd(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new L,l=new L,c=new gt;let h=new L;const u=[],f=[],d=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(f,3)),this.setAttribute("uv",new he(d,2));function x(){for(let M=0;M<e;M++)g(M);g(r===!1?e:0),v(),p()}function g(M){h=t.getPointAt(M/e,h);const _=a.normals[M],T=a.binormals[M];for(let b=0;b<=s;b++){const E=b/s*Math.PI*2,w=Math.sin(E),y=-Math.cos(E);l.x=y*_.x+w*T.x,l.y=y*_.y+w*T.y,l.z=y*_.z+w*T.z,l.normalize(),f.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,u.push(o.x,o.y,o.z)}}function p(){for(let M=1;M<=e;M++)for(let _=1;_<=s;_++){const T=(s+1)*(M-1)+(_-1),b=(s+1)*M+(_-1),E=(s+1)*M+_,w=(s+1)*(M-1)+_;m.push(T,b,w),m.push(b,E,w)}}function v(){for(let M=0;M<=e;M++)for(let _=0;_<=s;_++)c.x=M/e,c.y=_/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Tn(new oo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Yp extends hn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ct extends Oi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bo,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ks extends Ct{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new gt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return le(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Zt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Zt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Zt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class $p extends Oi{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bo,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Zp extends Oi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bo,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=Oc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Jp extends Oi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=u0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Kp extends Oi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const hl={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class jp{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],m=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Qp=new jp;class eh{constructor(t){this.manager=t!==void 0?t:Qp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}eh.DEFAULT_MATERIAL_NAME="__DEFAULT";const Xs=new WeakMap;class tm extends eh{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=hl.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let u=Xs.get(a);u===void 0&&(u=[],Xs.set(a,u)),u.push({onLoad:e,onError:s})}return a}const o=Xr("img");function l(){h(),e&&e(this);const u=Xs.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}Xs.delete(this),r.manager.itemEnd(t)}function c(u){h(),s&&s(u),hl.remove(`image:${t}`);const f=Xs.get(this)||[];for(let d=0;d<f.length;d++){const m=f[d];m.onError&&m.onError(u)}Xs.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),hl.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}}class nf extends eh{constructor(t){super(t)}load(t,e,n,s){const r=new je,a=new tm(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class nh extends He{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class jh extends nh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ul=new ne,Qh=new L,tu=new L;class sf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new gt(512,512),this.mapType=fi,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kc,this._frameExtents=new gt(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Qh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qh),tu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tu),e.updateMatrixWorld(),ul.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ul,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ul)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const eu=new ne,Tr=new L,dl=new L;class em extends sf{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new gt(4,2),this._viewportCount=6,this._viewports=[new Se(2,1,1,1),new Se(0,1,1,1),new Se(3,1,1,1),new Se(1,1,1,1),new Se(3,0,1,1),new Se(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Tr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Tr),dl.copy(n.position),dl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(dl),n.updateMatrixWorld(),s.makeTranslation(-Tr.x,-Tr.y,-Tr.z),eu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eu,n.coordinateSystem,n.reversedDepth)}}class co extends nh{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new em}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class ih extends Gd{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class nm extends sf{constructor(){super(new ih(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class La extends nh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.target=new He,this.shadow=new nm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class im extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class sm{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const nu=new ne;class rm{constructor(t,e,n=0,s=1/0){this.ray=new Yc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new $c,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return nu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nu),this}intersectObject(t,e=!0,n=[]){return Sc(t,this,n,e),n.sort(iu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Sc(t[s],this,n,e);return n.sort(iu),n}}function iu(i,t){return i.distance-t.distance}function Sc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Sc(r[a],t,e,!0)}}function su(i,t,e,n){const s=am(n);switch(e){case Ld:return i*t;case So:return i*t/s.components*s.byteLength;case Gc:return i*t/s.components*s.byteLength;case Ud:return i*t*2/s.components*s.byteLength;case Vc:return i*t*2/s.components*s.byteLength;case Dd:return i*t*3/s.components*s.byteLength;case On:return i*t*4/s.components*s.byteLength;case Wc:return i*t*4/s.components*s.byteLength;case Za:case Ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ka:case ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vl:case Xl:return Math.max(i,16)*Math.max(t,8)/4;case Gl:case Wl:return Math.max(i,8)*Math.max(t,8)/2;case ql:case Yl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case $l:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Zl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Jl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Kl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case jl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ql:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case tc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ec:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case nc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ic:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case sc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case rc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ac:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case oc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case lc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case cc:case hc:case uc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case dc:case fc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case pc:case mc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function am(i){switch(i){case fi:case Rd:return{byteLength:1,components:1};case Gr:case Cd:case pi:return{byteLength:2,components:1};case kc:case Hc:return{byteLength:2,components:4};case Ss:case Bc:case Yn:return{byteLength:4,components:1};case Pd:case Id:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function rf(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function om(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){const m=u[f],x=u[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){const x=u[d];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var lm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cm=`#ifdef USE_ALPHAHASH
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
#endif`,hm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,um=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pm=`#ifdef USE_AOMAP
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
#endif`,mm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gm=`#ifdef USE_BATCHING
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
#endif`,xm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_m=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ym=`#ifdef USE_IRIDESCENCE
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
#endif`,Sm=`#ifdef USE_BUMPMAP
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
#endif`,bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Em=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Rm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Cm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Im=`#define PI 3.141592653589793
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
} // validated`,Lm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Dm=`vec3 transformedNormal = objectNormal;
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
#endif`,Um=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Om=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,km=`#ifdef USE_ENVMAP
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
#endif`,Hm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Gm=`#ifdef USE_ENVMAP
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
#endif`,Vm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wm=`#ifdef USE_ENVMAP
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
#endif`,Xm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ym=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$m=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zm=`#ifdef USE_GRADIENTMAP
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
}`,Jm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Km=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qm=`uniform bool receiveShadow;
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
#endif`,t1=`#ifdef USE_ENVMAP
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
#endif`,e1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,n1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,i1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,s1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,r1=`PhysicalMaterial material;
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
#endif`,a1=`struct PhysicalMaterial {
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
}`,o1=`
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
#endif`,l1=`#if defined( RE_IndirectDiffuse )
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
#endif`,c1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,h1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,u1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,d1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,f1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,p1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,m1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,g1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,x1=`#if defined( USE_POINTS_UV )
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
#endif`,v1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,M1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,y1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,S1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,b1=`#ifdef USE_MORPHTARGETS
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
#endif`,w1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,T1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,E1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,A1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,R1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,C1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,P1=`#ifdef USE_NORMALMAP
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
#endif`,I1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,L1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,D1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,U1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,N1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,F1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,O1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,z1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,B1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,k1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,H1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,G1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,V1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,W1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,X1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,q1=`float getShadowMask() {
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
}`,Y1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$1=`#ifdef USE_SKINNING
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
#endif`,Z1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,J1=`#ifdef USE_SKINNING
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
#endif`,K1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,j1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Q1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#ifdef USE_TRANSMISSION
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ag=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lg=`uniform sampler2D t2D;
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fg=`#include <common>
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
}`,pg=`#if DEPTH_PACKING == 3200
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
}`,mg=`#define DISTANCE
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
}`,gg=`#define DISTANCE
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
}`,xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_g=`uniform float scale;
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
}`,Mg=`uniform vec3 diffuse;
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
}`,yg=`#include <common>
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
}`,Sg=`uniform vec3 diffuse;
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
}`,bg=`#define LAMBERT
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
}`,wg=`#define LAMBERT
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
}`,Tg=`#define MATCAP
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
}`,Eg=`#define MATCAP
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
}`,Ag=`#define NORMAL
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
}`,Rg=`#define NORMAL
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
}`,Cg=`#define PHONG
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
}`,Pg=`#define PHONG
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
}`,Ig=`#define STANDARD
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
}`,Lg=`#define STANDARD
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
}`,Dg=`#define TOON
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
}`,Ug=`#define TOON
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
}`,Ng=`uniform float size;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,Og=`#include <common>
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
}`,zg=`uniform vec3 color;
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
}`,Bg=`uniform float rotation;
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
}`,kg=`uniform vec3 diffuse;
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
}`,oe={alphahash_fragment:lm,alphahash_pars_fragment:cm,alphamap_fragment:hm,alphamap_pars_fragment:um,alphatest_fragment:dm,alphatest_pars_fragment:fm,aomap_fragment:pm,aomap_pars_fragment:mm,batching_pars_vertex:gm,batching_vertex:xm,begin_vertex:vm,beginnormal_vertex:_m,bsdfs:Mm,iridescence_fragment:ym,bumpmap_pars_fragment:Sm,clipping_planes_fragment:bm,clipping_planes_pars_fragment:wm,clipping_planes_pars_vertex:Tm,clipping_planes_vertex:Em,color_fragment:Am,color_pars_fragment:Rm,color_pars_vertex:Cm,color_vertex:Pm,common:Im,cube_uv_reflection_fragment:Lm,defaultnormal_vertex:Dm,displacementmap_pars_vertex:Um,displacementmap_vertex:Nm,emissivemap_fragment:Fm,emissivemap_pars_fragment:Om,colorspace_fragment:zm,colorspace_pars_fragment:Bm,envmap_fragment:km,envmap_common_pars_fragment:Hm,envmap_pars_fragment:Gm,envmap_pars_vertex:Vm,envmap_physical_pars_fragment:t1,envmap_vertex:Wm,fog_vertex:Xm,fog_pars_vertex:qm,fog_fragment:Ym,fog_pars_fragment:$m,gradientmap_pars_fragment:Zm,lightmap_pars_fragment:Jm,lights_lambert_fragment:Km,lights_lambert_pars_fragment:jm,lights_pars_begin:Qm,lights_toon_fragment:e1,lights_toon_pars_fragment:n1,lights_phong_fragment:i1,lights_phong_pars_fragment:s1,lights_physical_fragment:r1,lights_physical_pars_fragment:a1,lights_fragment_begin:o1,lights_fragment_maps:l1,lights_fragment_end:c1,logdepthbuf_fragment:h1,logdepthbuf_pars_fragment:u1,logdepthbuf_pars_vertex:d1,logdepthbuf_vertex:f1,map_fragment:p1,map_pars_fragment:m1,map_particle_fragment:g1,map_particle_pars_fragment:x1,metalnessmap_fragment:v1,metalnessmap_pars_fragment:_1,morphinstance_vertex:M1,morphcolor_vertex:y1,morphnormal_vertex:S1,morphtarget_pars_vertex:b1,morphtarget_vertex:w1,normal_fragment_begin:T1,normal_fragment_maps:E1,normal_pars_fragment:A1,normal_pars_vertex:R1,normal_vertex:C1,normalmap_pars_fragment:P1,clearcoat_normal_fragment_begin:I1,clearcoat_normal_fragment_maps:L1,clearcoat_pars_fragment:D1,iridescence_pars_fragment:U1,opaque_fragment:N1,packing:F1,premultiplied_alpha_fragment:O1,project_vertex:z1,dithering_fragment:B1,dithering_pars_fragment:k1,roughnessmap_fragment:H1,roughnessmap_pars_fragment:G1,shadowmap_pars_fragment:V1,shadowmap_pars_vertex:W1,shadowmap_vertex:X1,shadowmask_pars_fragment:q1,skinbase_vertex:Y1,skinning_pars_vertex:$1,skinning_vertex:Z1,skinnormal_vertex:J1,specularmap_fragment:K1,specularmap_pars_fragment:j1,tonemapping_fragment:Q1,tonemapping_pars_fragment:tg,transmission_fragment:eg,transmission_pars_fragment:ng,uv_pars_fragment:ig,uv_pars_vertex:sg,uv_vertex:rg,worldpos_vertex:ag,background_vert:og,background_frag:lg,backgroundCube_vert:cg,backgroundCube_frag:hg,cube_vert:ug,cube_frag:dg,depth_vert:fg,depth_frag:pg,distanceRGBA_vert:mg,distanceRGBA_frag:gg,equirect_vert:xg,equirect_frag:vg,linedashed_vert:_g,linedashed_frag:Mg,meshbasic_vert:yg,meshbasic_frag:Sg,meshlambert_vert:bg,meshlambert_frag:wg,meshmatcap_vert:Tg,meshmatcap_frag:Eg,meshnormal_vert:Ag,meshnormal_frag:Rg,meshphong_vert:Cg,meshphong_frag:Pg,meshphysical_vert:Ig,meshphysical_frag:Lg,meshtoon_vert:Dg,meshtoon_frag:Ug,points_vert:Ng,points_frag:Fg,shadow_vert:Og,shadow_frag:zg,sprite_vert:Bg,sprite_frag:kg},Dt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ae},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ae}},envmap:{envMap:{value:null},envMapRotation:{value:new ae},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ae}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ae}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ae},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ae},normalScale:{value:new gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ae},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ae}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ae}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ae}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0},uvTransform:{value:new ae}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ae},alphaMap:{value:null},alphaMapTransform:{value:new ae},alphaTest:{value:0}}},ei={basic:{uniforms:ln([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:oe.meshbasic_vert,fragmentShader:oe.meshbasic_frag},lambert:{uniforms:ln([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:oe.meshlambert_vert,fragmentShader:oe.meshlambert_frag},phong:{uniforms:ln([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:oe.meshphong_vert,fragmentShader:oe.meshphong_frag},standard:{uniforms:ln([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag},toon:{uniforms:ln([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:oe.meshtoon_vert,fragmentShader:oe.meshtoon_frag},matcap:{uniforms:ln([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:oe.meshmatcap_vert,fragmentShader:oe.meshmatcap_frag},points:{uniforms:ln([Dt.points,Dt.fog]),vertexShader:oe.points_vert,fragmentShader:oe.points_frag},dashed:{uniforms:ln([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:oe.linedashed_vert,fragmentShader:oe.linedashed_frag},depth:{uniforms:ln([Dt.common,Dt.displacementmap]),vertexShader:oe.depth_vert,fragmentShader:oe.depth_frag},normal:{uniforms:ln([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:oe.meshnormal_vert,fragmentShader:oe.meshnormal_frag},sprite:{uniforms:ln([Dt.sprite,Dt.fog]),vertexShader:oe.sprite_vert,fragmentShader:oe.sprite_frag},background:{uniforms:{uvTransform:{value:new ae},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:oe.background_vert,fragmentShader:oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ae}},vertexShader:oe.backgroundCube_vert,fragmentShader:oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:oe.cube_vert,fragmentShader:oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:oe.equirect_vert,fragmentShader:oe.equirect_frag},distanceRGBA:{uniforms:ln([Dt.common,Dt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:oe.distanceRGBA_vert,fragmentShader:oe.distanceRGBA_frag},shadow:{uniforms:ln([Dt.lights,Dt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:oe.shadow_vert,fragmentShader:oe.shadow_frag}};ei.physical={uniforms:ln([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ae},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ae},clearcoatNormalScale:{value:new gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ae},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ae},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ae},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ae},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ae},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ae},transmissionSamplerSize:{value:new gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ae},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ae},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ae},anisotropyVector:{value:new gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ae}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag};const Da={r:0,b:0,g:0},os=new xn,Hg=new ne;function Gg(i,t,e,n,s,r,a){const o=new Zt(0);let l=r===!0?0:1,c,h,u=null,f=0,d=null;function m(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function x(M){let _=!1;const T=m(M);T===null?p(o,l):T&&T.isColor&&(p(T,1),_=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(M,_){const T=m(_);T&&(T.isCubeTexture||T.mapping===yo)?(h===void 0&&(h=new Xt(new Jn(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:or(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,E,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),os.copy(_.backgroundRotation),os.x*=-1,os.y*=-1,os.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Hg.makeRotationFromEuler(os)),h.material.toneMapped=me.getTransfer(T.colorSpace)!==_e,(u!==T||f!==T.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=T,f=T.version,d=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Xt(new fe(2,2),new hn({name:"BackgroundMaterial",uniforms:or(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=me.getTransfer(T.colorSpace)!==_e,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=T,f=T.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,_){M.getRGB(Da,Hd(i)),n.buffers.color.setClear(Da.r,Da.g,Da.b,_,a)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,_=1){o.set(M),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(o,l)},render:x,addToRenderList:g,dispose:v}}function Vg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(S,R,I,C,N){let F=!1;const z=u(C,I,R);r!==z&&(r=z,c(r.object)),F=d(S,C,I,N),F&&m(S,C,I,N),N!==null&&t.update(N,i.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,_(S,R,I,C),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function u(S,R,I){const C=I.wireframe===!0;let N=n[S.id];N===void 0&&(N={},n[S.id]=N);let F=N[R.id];F===void 0&&(F={},N[R.id]=F);let z=F[C];return z===void 0&&(z=f(l()),F[C]=z),z}function f(S){const R=[],I=[],C=[];for(let N=0;N<e;N++)R[N]=0,I[N]=0,C[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:C,object:S,attributes:{},index:null}}function d(S,R,I,C){const N=r.attributes,F=R.attributes;let z=0;const V=I.getAttributes();for(const B in V)if(V[B].location>=0){const Y=N[B];let nt=F[B];if(nt===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(nt=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(nt=S.instanceColor)),Y===void 0||Y.attribute!==nt||nt&&Y.data!==nt.data)return!0;z++}return r.attributesNum!==z||r.index!==C}function m(S,R,I,C){const N={},F=R.attributes;let z=0;const V=I.getAttributes();for(const B in V)if(V[B].location>=0){let Y=F[B];Y===void 0&&(B==="instanceMatrix"&&S.instanceMatrix&&(Y=S.instanceMatrix),B==="instanceColor"&&S.instanceColor&&(Y=S.instanceColor));const nt={};nt.attribute=Y,Y&&Y.data&&(nt.data=Y.data),N[B]=nt,z++}r.attributes=N,r.attributesNum=z,r.index=C}function x(){const S=r.newAttributes;for(let R=0,I=S.length;R<I;R++)S[R]=0}function g(S){p(S,0)}function p(S,R){const I=r.newAttributes,C=r.enabledAttributes,N=r.attributeDivisors;I[S]=1,C[S]===0&&(i.enableVertexAttribArray(S),C[S]=1),N[S]!==R&&(i.vertexAttribDivisor(S,R),N[S]=R)}function v(){const S=r.newAttributes,R=r.enabledAttributes;for(let I=0,C=R.length;I<C;I++)R[I]!==S[I]&&(i.disableVertexAttribArray(I),R[I]=0)}function M(S,R,I,C,N,F,z){z===!0?i.vertexAttribIPointer(S,R,I,N,F):i.vertexAttribPointer(S,R,I,C,N,F)}function _(S,R,I,C){x();const N=C.attributes,F=I.getAttributes(),z=R.defaultAttributeValues;for(const V in F){const B=F[V];if(B.location>=0){let k=N[V];if(k===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(k=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(k=S.instanceColor)),k!==void 0){const Y=k.normalized,nt=k.itemSize,K=t.get(k);if(K===void 0)continue;const mt=K.buffer,It=K.type,Ut=K.bytesPerElement,$=It===i.INT||It===i.UNSIGNED_INT||k.gpuType===Bc;if(k.isInterleavedBufferAttribute){const rt=k.data,_t=rt.stride,Tt=k.offset;if(rt.isInstancedInterleavedBuffer){for(let wt=0;wt<B.locationSize;wt++)p(B.location+wt,rt.meshPerAttribute);S.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let wt=0;wt<B.locationSize;wt++)g(B.location+wt);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let wt=0;wt<B.locationSize;wt++)M(B.location+wt,nt/B.locationSize,It,Y,_t*Ut,(Tt+nt/B.locationSize*wt)*Ut,$)}else{if(k.isInstancedBufferAttribute){for(let rt=0;rt<B.locationSize;rt++)p(B.location+rt,k.meshPerAttribute);S.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let rt=0;rt<B.locationSize;rt++)g(B.location+rt);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let rt=0;rt<B.locationSize;rt++)M(B.location+rt,nt/B.locationSize,It,Y,nt*Ut,nt/B.locationSize*rt*Ut,$)}}else if(z!==void 0){const Y=z[V];if(Y!==void 0)switch(Y.length){case 2:i.vertexAttrib2fv(B.location,Y);break;case 3:i.vertexAttrib3fv(B.location,Y);break;case 4:i.vertexAttrib4fv(B.location,Y);break;default:i.vertexAttrib1fv(B.location,Y)}}}}v()}function T(){w();for(const S in n){const R=n[S];for(const I in R){const C=R[I];for(const N in C)h(C[N].object),delete C[N];delete R[I]}delete n[S]}}function b(S){if(n[S.id]===void 0)return;const R=n[S.id];for(const I in R){const C=R[I];for(const N in C)h(C[N].object),delete C[N];delete R[I]}delete n[S.id]}function E(S){for(const R in n){const I=n[R];if(I[S.id]===void 0)continue;const C=I[S.id];for(const N in C)h(C[N].object),delete C[N];delete I[S.id]}}function w(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:y,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function Wg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let m=0;m<u;m++)d+=h[m];e.update(d,n,1)}function l(c,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<c.length;m++)a(c[m],h[m],f[m]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*f[x];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Xg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(E){return!(E!==On&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const w=E===pi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==fi&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Yn&&!w)}function l(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:T,maxSamples:b}}function qg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new ds,o=new ae,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const v=r?0:n,M=v*4;let _=p.clippingState||null;l.value=_,_=h(m,f,M,d);for(let T=0;T!==M;++T)_[T]=e[T];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,m){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=l.value,m!==!0||g===null){const p=d+x*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let M=0,_=d;M!==x;++M,_+=4)a.copy(u[M]).applyMatrix4(v,o),a.normal.toArray(g,_),g[_+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function Yg(i){let t=new WeakMap;function e(a,o){return o===Bl?a.mapping=nr:o===kl&&(a.mapping=ir),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Bl||o===kl)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new ap(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const js=4,ru=[.125,.215,.35,.446,.526,.582],ms=20,fl=new ih,au=new Zt;let pl=null,ml=0,gl=0,xl=!1;const fs=(1+Math.sqrt(5))/2,qs=1/fs,ou=[new L(-fs,qs,0),new L(fs,qs,0),new L(-qs,0,fs),new L(qs,0,fs),new L(0,fs,-qs),new L(0,fs,qs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],$g=new L;class bc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=$g}=r;pl=this._renderer.getRenderTarget(),ml=this._renderer.getActiveCubeFace(),gl=this._renderer.getActiveMipmapLevel(),xl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pl,ml,gl),this._renderer.xr.enabled=xl,t.scissorTest=!1,Ua(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===nr||t.mapping===ir?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pl=this._renderer.getRenderTarget(),ml=this._renderer.getActiveCubeFace(),gl=this._renderer.getActiveMipmapLevel(),xl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ai,minFilter:ai,generateMipmaps:!1,type:pi,format:On,colorSpace:ar,depthBuffer:!1},s=lu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zg(r)),this._blurMaterial=Jg(r,t,e)}return s}_compileMaterial(t){const e=new Xt(this._lodPlanes[0],t);this._renderer.compile(e,fl)}_sceneToCubeUV(t,e,n,s,r){const l=new sn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(au),u.toneMapping=Ki,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const x=new Ke({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),g=new Xt(new Jn,x);let p=!1;const v=t.background;v?v.isColor&&(x.color.copy(v),t.background=null,p=!0):(x.color.copy(au),p=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const T=this._cubeSize;Ua(s,_*T,M>2?T:0,T,T),u.setRenderTarget(s),p&&u.render(g,l),u.render(t,l)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===nr||t.mapping===ir;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cu());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Xt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ua(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,fl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ou[(s-r-1)%ou.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Xt(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*ms-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):ms;g>ms&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ms}`);const p=[];let v=0;for(let E=0;E<ms;++E){const w=E/x,y=Math.exp(-w*w/2);p.push(y),E===0?v+=y:E<g&&(v+=2*y)}for(let E=0;E<p.length;E++)p[E]=p[E]/v;f.envMap.value=t.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:M}=this;f.dTheta.value=m,f.mipInt.value=M-n;const _=this._sizeLods[s],T=3*_*(s>M-js?s-M+js:0),b=4*(this._cubeSize-_);Ua(e,T,b,3*_,2*_),l.setRenderTarget(e),l.render(u,fl)}}function Zg(i){const t=[],e=[],n=[];let s=i;const r=i-js+1+ru.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-js?l=ru[a-i+js-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*d),M=new Float32Array(g*m*d),_=new Float32Array(p*m*d);for(let b=0;b<d;b++){const E=b%3*2/3-1,w=b>2?0:-1,y=[E,w,0,E+2/3,w,0,E+2/3,w+1,0,E,w,0,E+2/3,w+1,0,E,w+1,0];v.set(y,x*m*b),M.set(f,g*m*b);const S=[b,b,b,b,b,b];_.set(S,p*m*b)}const T=new Ae;T.setAttribute("position",new Ce(v,x)),T.setAttribute("uv",new Ce(M,g)),T.setAttribute("faceIndex",new Ce(_,p)),t.push(T),s>js&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function lu(i,t,e){const n=new En(i,t,e);return n.texture.mapping=yo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ua(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Jg(i,t,e){const n=new Float32Array(ms),s=new L(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:ms,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:sh(),fragmentShader:`

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
		`,blending:cn,depthTest:!1,depthWrite:!1})}function cu(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sh(),fragmentShader:`

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
		`,blending:cn,depthTest:!1,depthWrite:!1})}function hu(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cn,depthTest:!1,depthWrite:!1})}function sh(){return`

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
	`}function Kg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Bl||l===kl,h=l===nr||l===ir;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new bc(i)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new bc(i)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function jg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&qr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Qg(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const m in f.attributes)t.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const d in f)t.update(f[d],i.ARRAY_BUFFER)}function c(u){const f=[],d=u.index,m=u.attributes.position;let x=0;if(d!==null){const v=d.array;x=d.version;for(let M=0,_=v.length;M<_;M+=3){const T=v[M+0],b=v[M+1],E=v[M+2];f.push(T,b,b,E,E,T)}}else if(m!==void 0){const v=m.array;x=m.version;for(let M=0,_=v.length/3-1;M<_;M+=3){const T=M+0,b=M+1,E=M+2;f.push(T,b,b,E,E,T)}}else return;const g=new(Fd(f)?kd:Bd)(f,1);g.version=x;const p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function tx(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){i.drawElements(n,d,r,f*a),e.update(d,n,1)}function c(f,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,f*a,m),e.update(d,n,m))}function h(f,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];e.update(g,n,1)}function u(f,d,m,x){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)c(f[p]/a,d[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,m);let p=0;for(let v=0;v<m;v++)p+=d[v]*x[v];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ex(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function nx(i,t,e){const n=new WeakMap,s=new Se;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let y=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",y)};f!==void 0&&f.texture.dispose();const d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;d===!0&&(M=1),m===!0&&(M=2),x===!0&&(M=3);let _=o.attributes.position.count*M,T=1;_>t.maxTextureSize&&(T=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);const b=new Float32Array(_*T*4*u),E=new Od(b,_,T,u);E.type=Yn,E.needsUpdate=!0;const w=M*4;for(let S=0;S<u;S++){const R=g[S],I=p[S],C=v[S],N=_*T*4*S;for(let F=0;F<R.count;F++){const z=F*w;d===!0&&(s.fromBufferAttribute(R,F),b[N+z+0]=s.x,b[N+z+1]=s.y,b[N+z+2]=s.z,b[N+z+3]=0),m===!0&&(s.fromBufferAttribute(I,F),b[N+z+4]=s.x,b[N+z+5]=s.y,b[N+z+6]=s.z,b[N+z+7]=0),x===!0&&(s.fromBufferAttribute(C,F),b[N+z+8]=s.x,b[N+z+9]=s.y,b[N+z+10]=s.z,b[N+z+11]=C.itemSize===4?s.w:1)}}f={count:u,texture:E,size:new gt(_,T)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];const m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function ix(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const af=new je,uu=new jc(1,1),of=new Od,lf=new W0,cf=new Vd,du=[],fu=[],pu=new Float32Array(16),mu=new Float32Array(9),gu=new Float32Array(4);function dr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=du[s];if(r===void 0&&(r=new Float32Array(s),du[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function We(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ro(i,t){let e=fu[t];e===void 0&&(e=new Int32Array(t),fu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function sx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function rx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2fv(this.addr,t),Xe(e,t)}}function ax(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(We(e,t))return;i.uniform3fv(this.addr,t),Xe(e,t)}}function ox(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4fv(this.addr,t),Xe(e,t)}}function lx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;gu.set(n),i.uniformMatrix2fv(this.addr,!1,gu),Xe(e,n)}}function cx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;mu.set(n),i.uniformMatrix3fv(this.addr,!1,mu),Xe(e,n)}}function hx(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;pu.set(n),i.uniformMatrix4fv(this.addr,!1,pu),Xe(e,n)}}function ux(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function dx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2iv(this.addr,t),Xe(e,t)}}function fx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;i.uniform3iv(this.addr,t),Xe(e,t)}}function px(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4iv(this.addr,t),Xe(e,t)}}function mx(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function gx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2uiv(this.addr,t),Xe(e,t)}}function xx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;i.uniform3uiv(this.addr,t),Xe(e,t)}}function vx(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4uiv(this.addr,t),Xe(e,t)}}function _x(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(uu.compareFunction=Nd,r=uu):r=af,e.setTexture2D(t||r,s)}function Mx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||lf,s)}function yx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||cf,s)}function Sx(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||of,s)}function bx(i){switch(i){case 5126:return sx;case 35664:return rx;case 35665:return ax;case 35666:return ox;case 35674:return lx;case 35675:return cx;case 35676:return hx;case 5124:case 35670:return ux;case 35667:case 35671:return dx;case 35668:case 35672:return fx;case 35669:case 35673:return px;case 5125:return mx;case 36294:return gx;case 36295:return xx;case 36296:return vx;case 35678:case 36198:case 36298:case 36306:case 35682:return _x;case 35679:case 36299:case 36307:return Mx;case 35680:case 36300:case 36308:case 36293:return yx;case 36289:case 36303:case 36311:case 36292:return Sx}}function wx(i,t){i.uniform1fv(this.addr,t)}function Tx(i,t){const e=dr(t,this.size,2);i.uniform2fv(this.addr,e)}function Ex(i,t){const e=dr(t,this.size,3);i.uniform3fv(this.addr,e)}function Ax(i,t){const e=dr(t,this.size,4);i.uniform4fv(this.addr,e)}function Rx(i,t){const e=dr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Cx(i,t){const e=dr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Px(i,t){const e=dr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ix(i,t){i.uniform1iv(this.addr,t)}function Lx(i,t){i.uniform2iv(this.addr,t)}function Dx(i,t){i.uniform3iv(this.addr,t)}function Ux(i,t){i.uniform4iv(this.addr,t)}function Nx(i,t){i.uniform1uiv(this.addr,t)}function Fx(i,t){i.uniform2uiv(this.addr,t)}function Ox(i,t){i.uniform3uiv(this.addr,t)}function zx(i,t){i.uniform4uiv(this.addr,t)}function Bx(i,t,e){const n=this.cache,s=t.length,r=Ro(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||af,r[a])}function kx(i,t,e){const n=this.cache,s=t.length,r=Ro(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||lf,r[a])}function Hx(i,t,e){const n=this.cache,s=t.length,r=Ro(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||cf,r[a])}function Gx(i,t,e){const n=this.cache,s=t.length,r=Ro(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||of,r[a])}function Vx(i){switch(i){case 5126:return wx;case 35664:return Tx;case 35665:return Ex;case 35666:return Ax;case 35674:return Rx;case 35675:return Cx;case 35676:return Px;case 5124:case 35670:return Ix;case 35667:case 35671:return Lx;case 35668:case 35672:return Dx;case 35669:case 35673:return Ux;case 5125:return Nx;case 36294:return Fx;case 36295:return Ox;case 36296:return zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Bx;case 35679:case 36299:case 36307:return kx;case 35680:case 36300:case 36308:case 36293:return Hx;case 36289:case 36303:case 36311:case 36292:return Gx}}class Wx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=bx(e.type)}}class Xx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vx(e.type)}}class qx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const vl=/(\w+)(\])?(\[|\.)?/g;function xu(i,t){i.seq.push(t),i.map[t.id]=t}function Yx(i,t,e){const n=i.name,s=n.length;for(vl.lastIndex=0;;){const r=vl.exec(n),a=vl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){xu(e,c===void 0?new Wx(o,i,t):new Xx(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new qx(o),xu(e,u)),e=u}}}class Qa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Yx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function vu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const $x=37297;let Zx=0;function Jx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const _u=new ae;function Kx(i){me._getMatrix(_u,me.workingColorSpace,i);const t=`mat3( ${_u.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case so:return[t,"LinearTransferOETF"];case _e:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Mu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Jx(i.getShaderSource(t),o)}else return r}function jx(i,t){const e=Kx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Qx(i,t){let e;switch(t){case yd:e="Linear";break;case Sd:e="Reinhard";break;case bd:e="Cineon";break;case zc:e="ACESFilmic";break;case Td:e="AgX";break;case Ed:e="Neutral";break;case wd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Na=new L;function tv(){me.getLuminanceCoefficients(Na);const i=Na.x.toFixed(4),t=Na.y.toFixed(4),e=Na.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ev(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Pr).join(`
`)}function nv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function iv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Pr(i){return i!==""}function yu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Su(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const sv=/^[ \t]*#include +<([\w\d./]+)>/gm;function wc(i){return i.replace(sv,av)}const rv=new Map;function av(i,t){let e=oe[t];if(e===void 0){const n=rv.get(t);if(n!==void 0)e=oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return wc(e)}const ov=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bu(i){return i.replace(ov,lv)}function lv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function wu(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function cv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===gd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===xd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ri&&(t="SHADOWMAP_TYPE_VSM"),t}function hv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case nr:case ir:t="ENVMAP_TYPE_CUBE";break;case yo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function uv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ir:t="ENVMAP_MODE_REFRACTION";break}return t}function dv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Oc:t="ENVMAP_BLENDING_MULTIPLY";break;case l0:t="ENVMAP_BLENDING_MIX";break;case c0:t="ENVMAP_BLENDING_ADD";break}return t}function fv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function pv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=cv(e),c=hv(e),h=uv(e),u=dv(e),f=fv(e),d=ev(e),m=nv(r),x=s.createProgram();let g,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Pr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Pr).join(`
`),p.length>0&&(p+=`
`)):(g=[wu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Pr).join(`
`),p=[wu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ki?"#define TONE_MAPPING":"",e.toneMapping!==Ki?oe.tonemapping_pars_fragment:"",e.toneMapping!==Ki?Qx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",oe.colorspace_pars_fragment,jx("linearToOutputTexel",e.outputColorSpace),tv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Pr).join(`
`)),a=wc(a),a=yu(a,e),a=Su(a,e),o=wc(o),o=yu(o,e),o=Su(o,e),a=bu(a),o=bu(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===yh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===yh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=v+g+a,_=v+p+o,T=vu(s,s.VERTEX_SHADER,M),b=vu(s,s.FRAGMENT_SHADER,_);s.attachShader(x,T),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(R){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(x)||"",C=s.getShaderInfoLog(T)||"",N=s.getShaderInfoLog(b)||"",F=I.trim(),z=C.trim(),V=N.trim();let B=!0,k=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,T,b);else{const Y=Mu(s,T,"vertex"),nt=Mu(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+Y+`
`+nt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(z===""||V==="")&&(k=!1);k&&(R.diagnostics={runnable:B,programLog:F,vertexShader:{log:z,prefix:g},fragmentShader:{log:V,prefix:p}})}s.deleteShader(T),s.deleteShader(b),w=new Qa(s,x),y=iv(s,x)}let w;this.getUniforms=function(){return w===void 0&&E(this),w};let y;this.getAttributes=function(){return y===void 0&&E(this),y};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(x,$x)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Zx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=b,this}let mv=0;class gv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new xv(t),e.set(t,n)),n}}class xv{constructor(t){this.id=mv++,this.code=t,this.usedTimes=0}}function vv(i,t,e,n,s,r,a){const o=new $c,l=new gv,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return c.add(y),y===0?"uv":`uv${y}`}function g(y,S,R,I,C){const N=I.fog,F=C.geometry,z=y.isMeshStandardMaterial?I.environment:null,V=(y.isMeshStandardMaterial?e:t).get(y.envMap||z),B=V&&V.mapping===yo?V.image.height:null,k=m[y.type];y.precision!==null&&(d=s.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const Y=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,nt=Y!==void 0?Y.length:0;let K=0;F.morphAttributes.position!==void 0&&(K=1),F.morphAttributes.normal!==void 0&&(K=2),F.morphAttributes.color!==void 0&&(K=3);let mt,It,Ut,$;if(k){const xe=ei[k];mt=xe.vertexShader,It=xe.fragmentShader}else mt=y.vertexShader,It=y.fragmentShader,l.update(y),Ut=l.getVertexShaderID(y),$=l.getFragmentShaderID(y);const rt=i.getRenderTarget(),_t=i.state.buffers.depth.getReversed(),Tt=C.isInstancedMesh===!0,wt=C.isBatchedMesh===!0,qt=!!y.map,Bt=!!y.matcap,U=!!V,tt=!!y.aoMap,j=!!y.lightMap,ot=!!y.bumpMap,it=!!y.normalMap,xt=!!y.displacementMap,dt=!!y.emissiveMap,vt=!!y.metalnessMap,Jt=!!y.roughnessMap,$t=y.anisotropy>0,D=y.clearcoat>0,A=y.dispersion>0,W=y.iridescence>0,Q=y.sheen>0,ht=y.transmission>0,J=$t&&!!y.anisotropyMap,Ft=D&&!!y.clearcoatMap,yt=D&&!!y.clearcoatNormalMap,Lt=D&&!!y.clearcoatRoughnessMap,kt=W&&!!y.iridescenceMap,St=W&&!!y.iridescenceThicknessMap,at=Q&&!!y.sheenColorMap,bt=Q&&!!y.sheenRoughnessMap,Et=!!y.specularMap,pt=!!y.specularColorMap,Wt=!!y.specularIntensityMap,H=ht&&!!y.transmissionMap,ut=ht&&!!y.thicknessMap,ft=!!y.gradientMap,Pt=!!y.alphaMap,Mt=y.alphaTest>0,ct=!!y.alphaHash,Ht=!!y.extensions;let ee=Ki;y.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(ee=i.toneMapping);const ve={shaderID:k,shaderType:y.type,shaderName:y.name,vertexShader:mt,fragmentShader:It,defines:y.defines,customVertexShaderID:Ut,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:wt,batchingColor:wt&&C._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&C.instanceColor!==null,instancingMorph:Tt&&C.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:ar,alphaToCoverage:!!y.alphaToCoverage,map:qt,matcap:Bt,envMap:U,envMapMode:U&&V.mapping,envMapCubeUVHeight:B,aoMap:tt,lightMap:j,bumpMap:ot,normalMap:it,displacementMap:f&&xt,emissiveMap:dt,normalMapObjectSpace:it&&y.normalMapType===f0,normalMapTangentSpace:it&&y.normalMapType===bo,metalnessMap:vt,roughnessMap:Jt,anisotropy:$t,anisotropyMap:J,clearcoat:D,clearcoatMap:Ft,clearcoatNormalMap:yt,clearcoatRoughnessMap:Lt,dispersion:A,iridescence:W,iridescenceMap:kt,iridescenceThicknessMap:St,sheen:Q,sheenColorMap:at,sheenRoughnessMap:bt,specularMap:Et,specularColorMap:pt,specularIntensityMap:Wt,transmission:ht,transmissionMap:H,thicknessMap:ut,gradientMap:ft,opaque:y.transparent===!1&&y.blending===Qs&&y.alphaToCoverage===!1,alphaMap:Pt,alphaTest:Mt,alphaHash:ct,combine:y.combine,mapUv:qt&&x(y.map.channel),aoMapUv:tt&&x(y.aoMap.channel),lightMapUv:j&&x(y.lightMap.channel),bumpMapUv:ot&&x(y.bumpMap.channel),normalMapUv:it&&x(y.normalMap.channel),displacementMapUv:xt&&x(y.displacementMap.channel),emissiveMapUv:dt&&x(y.emissiveMap.channel),metalnessMapUv:vt&&x(y.metalnessMap.channel),roughnessMapUv:Jt&&x(y.roughnessMap.channel),anisotropyMapUv:J&&x(y.anisotropyMap.channel),clearcoatMapUv:Ft&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:yt&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:kt&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:St&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:at&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:bt&&x(y.sheenRoughnessMap.channel),specularMapUv:Et&&x(y.specularMap.channel),specularColorMapUv:pt&&x(y.specularColorMap.channel),specularIntensityMapUv:Wt&&x(y.specularIntensityMap.channel),transmissionMapUv:H&&x(y.transmissionMap.channel),thicknessMapUv:ut&&x(y.thicknessMap.channel),alphaMapUv:Pt&&x(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(it||$t),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!F.attributes.uv&&(qt||Pt),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_t,skinning:C.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:K,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,decodeVideoTexture:qt&&y.map.isVideoTexture===!0&&me.getTransfer(y.map.colorSpace)===_e,decodeVideoTextureEmissive:dt&&y.emissiveMap.isVideoTexture===!0&&me.getTransfer(y.emissiveMap.colorSpace)===_e,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Oe,flipSided:y.side===rn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ht&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&y.extensions.multiDraw===!0||wt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ve.vertexUv1s=c.has(1),ve.vertexUv2s=c.has(2),ve.vertexUv3s=c.has(3),c.clear(),ve}function p(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)S.push(R),S.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(v(S,y),M(S,y),S.push(i.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function v(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function M(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){const S=m[y.type];let R;if(S){const I=ei[S];R=vs.clone(I.uniforms)}else R=y.uniforms;return R}function T(y,S){let R;for(let I=0,C=h.length;I<C;I++){const N=h[I];if(N.cacheKey===S){R=N,++R.usedTimes;break}}return R===void 0&&(R=new pv(i,S,y,r),h.push(R)),R}function b(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function E(y){l.remove(y)}function w(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:T,releaseProgram:b,releaseShaderCache:E,programs:h,dispose:w}}function _v(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Mv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Tu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Eu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,d,m,x,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),t++,p}function o(u,f,d,m,x,g){const p=a(u,f,d,m,x,g);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function l(u,f,d,m,x,g){const p=a(u,f,d,m,x,g);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,f){e.length>1&&e.sort(u||Mv),n.length>1&&n.sort(f||Tu),s.length>1&&s.sort(f||Tu)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function yv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Eu,i.set(n,[a])):s>=r.length?(a=new Eu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Sv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Zt};break;case"SpotLight":e={position:new L,direction:new L,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function bv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let wv=0;function Tv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ev(i){const t=new Sv,e=bv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const s=new L,r=new ne,a=new ne;function o(c){let h=0,u=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,v=0,M=0,_=0,T=0,b=0,E=0;c.sort(Tv);for(let y=0,S=c.length;y<S;y++){const R=c[y],I=R.color,C=R.intensity,N=R.distance,F=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=I.r*C,u+=I.g*C,f+=I.b*C;else if(R.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(R.sh.coefficients[z],C);E++}else if(R.isDirectionalLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const V=R.shadow,B=e.get(R);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,n.directionalShadow[d]=B,n.directionalShadowMap[d]=F,n.directionalShadowMatrix[d]=R.shadow.matrix,v++}n.directional[d]=z,d++}else if(R.isSpotLight){const z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(I).multiplyScalar(C),z.distance=N,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,n.spot[x]=z;const V=R.shadow;if(R.map&&(n.spotLightMap[T]=R.map,T++,V.updateMatrices(R),R.castShadow&&b++),n.spotLightMatrix[x]=V.matrix,R.castShadow){const B=e.get(R);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,n.spotShadow[x]=B,n.spotShadowMap[x]=F,_++}x++}else if(R.isRectAreaLight){const z=t.get(R);z.color.copy(I).multiplyScalar(C),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=z,g++}else if(R.isPointLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const V=R.shadow,B=e.get(R);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,B.shadowCameraNear=V.camera.near,B.shadowCameraFar=V.camera.far,n.pointShadow[m]=B,n.pointShadowMap[m]=F,n.pointShadowMatrix[m]=R.shadow.matrix,M++}n.point[m]=z,m++}else if(R.isHemisphereLight){const z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(C),z.groundColor.copy(R.groundColor).multiplyScalar(C),n.hemi[p]=z,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const w=n.hash;(w.directionalLength!==d||w.pointLength!==m||w.spotLength!==x||w.rectAreaLength!==g||w.hemiLength!==p||w.numDirectionalShadows!==v||w.numPointShadows!==M||w.numSpotShadows!==_||w.numSpotMaps!==T||w.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+T-b,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=E,w.directionalLength=d,w.pointLength=m,w.spotLength=x,w.rectAreaLength=g,w.hemiLength=p,w.numDirectionalShadows=v,w.numPointShadows=M,w.numSpotShadows=_,w.numSpotMaps=T,w.numLightProbes=E,n.version=wv++)}function l(c,h){let u=0,f=0,d=0,m=0,x=0;const g=h.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const M=c[p];if(M.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(M.isSpotLight){const _=n.spot[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),d++}else if(M.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(M.isPointLight){const _=n.point[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),f++}else if(M.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:n}}function Au(i){const t=new Ev(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Av(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Au(i),t.set(s,[o])):r>=a.length?(o=new Au(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Rv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Cv=`uniform sampler2D shadow_pass;
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
}`;function Pv(i,t,e){let n=new Kc;const s=new gt,r=new gt,a=new Se,o=new Jp({depthPacking:d0}),l=new Kp,c={},h=e.maxTextureSize,u={[Qi]:rn,[rn]:Qi,[Oe]:Oe},f=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new gt},radius:{value:4}},vertexShader:Rv,fragmentShader:Cv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new Ae;m.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Xt(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gd;let p=this.type;this.render=function(b,E,w){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const y=i.getRenderTarget(),S=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),I=i.state;I.setBlending(cn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const C=p!==Ri&&this.type===Ri,N=p===Ri&&this.type!==Ri;for(let F=0,z=b.length;F<z;F++){const V=b[F],B=V.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const k=B.getFrameExtents();if(s.multiply(k),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/k.x),s.x=r.x*k.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/k.y),s.y=r.y*k.y,B.mapSize.y=r.y)),B.map===null||C===!0||N===!0){const nt=this.type!==Ri?{minFilter:un,magFilter:un}:{};B.map!==null&&B.map.dispose(),B.map=new En(s.x,s.y,nt),B.map.texture.name=V.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const Y=B.getViewportCount();for(let nt=0;nt<Y;nt++){const K=B.getViewport(nt);a.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),I.viewport(a),B.updateMatrices(V,nt),n=B.getFrustum(),_(E,w,B.camera,V,this.type)}B.isPointLightShadow!==!0&&this.type===Ri&&v(B,w),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(y,S,R)};function v(b,E){const w=t.update(x);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new En(s.x,s.y)),f.uniforms.shadow_pass.value=b.map.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(E,null,w,f,x,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(E,null,w,d,x,null)}function M(b,E,w,y){let S=null;const R=w.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)S=R;else if(S=w.isPointLight===!0?l:o,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const I=S.uuid,C=E.uuid;let N=c[I];N===void 0&&(N={},c[I]=N);let F=N[C];F===void 0&&(F=S.clone(),N[C]=F,E.addEventListener("dispose",T)),S=F}if(S.visible=E.visible,S.wireframe=E.wireframe,y===Ri?S.side=E.shadowSide!==null?E.shadowSide:E.side:S.side=E.shadowSide!==null?E.shadowSide:u[E.side],S.alphaMap=E.alphaMap,S.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,S.map=E.map,S.clipShadows=E.clipShadows,S.clippingPlanes=E.clippingPlanes,S.clipIntersection=E.clipIntersection,S.displacementMap=E.displacementMap,S.displacementScale=E.displacementScale,S.displacementBias=E.displacementBias,S.wireframeLinewidth=E.wireframeLinewidth,S.linewidth=E.linewidth,w.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const I=i.properties.get(S);I.light=w}return S}function _(b,E,w,y,S){if(b.visible===!1)return;if(b.layers.test(E.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===Ri)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,b.matrixWorld);const C=t.update(b),N=b.material;if(Array.isArray(N)){const F=C.groups;for(let z=0,V=F.length;z<V;z++){const B=F[z],k=N[B.materialIndex];if(k&&k.visible){const Y=M(b,k,y,S);b.onBeforeShadow(i,b,E,w,C,Y,B),i.renderBufferDirect(w,null,C,Y,b,B),b.onAfterShadow(i,b,E,w,C,Y,B)}}}else if(N.visible){const F=M(b,N,y,S);b.onBeforeShadow(i,b,E,w,C,F,null),i.renderBufferDirect(w,null,C,F,b,null),b.onAfterShadow(i,b,E,w,C,F,null)}}const I=b.children;for(let C=0,N=I.length;C<N;C++)_(I[C],E,w,y,S)}function T(b){b.target.removeEventListener("dispose",T);for(const w in c){const y=c[w],S=b.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}const Iv={[Ll]:Dl,[Ul]:Ol,[Nl]:zl,[er]:Fl,[Dl]:Ll,[Ol]:Ul,[zl]:Nl,[Fl]:er};function Lv(i,t){function e(){let H=!1;const ut=new Se;let ft=null;const Pt=new Se(0,0,0,0);return{setMask:function(Mt){ft!==Mt&&!H&&(i.colorMask(Mt,Mt,Mt,Mt),ft=Mt)},setLocked:function(Mt){H=Mt},setClear:function(Mt,ct,Ht,ee,ve){ve===!0&&(Mt*=ee,ct*=ee,Ht*=ee),ut.set(Mt,ct,Ht,ee),Pt.equals(ut)===!1&&(i.clearColor(Mt,ct,Ht,ee),Pt.copy(ut))},reset:function(){H=!1,ft=null,Pt.set(-1,0,0,0)}}}function n(){let H=!1,ut=!1,ft=null,Pt=null,Mt=null;return{setReversed:function(ct){if(ut!==ct){const Ht=t.get("EXT_clip_control");ct?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT),ut=ct;const ee=Mt;Mt=null,this.setClear(ee)}},getReversed:function(){return ut},setTest:function(ct){ct?rt(i.DEPTH_TEST):_t(i.DEPTH_TEST)},setMask:function(ct){ft!==ct&&!H&&(i.depthMask(ct),ft=ct)},setFunc:function(ct){if(ut&&(ct=Iv[ct]),Pt!==ct){switch(ct){case Ll:i.depthFunc(i.NEVER);break;case Dl:i.depthFunc(i.ALWAYS);break;case Ul:i.depthFunc(i.LESS);break;case er:i.depthFunc(i.LEQUAL);break;case Nl:i.depthFunc(i.EQUAL);break;case Fl:i.depthFunc(i.GEQUAL);break;case Ol:i.depthFunc(i.GREATER);break;case zl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Pt=ct}},setLocked:function(ct){H=ct},setClear:function(ct){Mt!==ct&&(ut&&(ct=1-ct),i.clearDepth(ct),Mt=ct)},reset:function(){H=!1,ft=null,Pt=null,Mt=null,ut=!1}}}function s(){let H=!1,ut=null,ft=null,Pt=null,Mt=null,ct=null,Ht=null,ee=null,ve=null;return{setTest:function(xe){H||(xe?rt(i.STENCIL_TEST):_t(i.STENCIL_TEST))},setMask:function(xe){ut!==xe&&!H&&(i.stencilMask(xe),ut=xe)},setFunc:function(xe,vi,jn){(ft!==xe||Pt!==vi||Mt!==jn)&&(i.stencilFunc(xe,vi,jn),ft=xe,Pt=vi,Mt=jn)},setOp:function(xe,vi,jn){(ct!==xe||Ht!==vi||ee!==jn)&&(i.stencilOp(xe,vi,jn),ct=xe,Ht=vi,ee=jn)},setLocked:function(xe){H=xe},setClear:function(xe){ve!==xe&&(i.clearStencil(xe),ve=xe)},reset:function(){H=!1,ut=null,ft=null,Pt=null,Mt=null,ct=null,Ht=null,ee=null,ve=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],m=null,x=!1,g=null,p=null,v=null,M=null,_=null,T=null,b=null,E=new Zt(0,0,0),w=0,y=!1,S=null,R=null,I=null,C=null,N=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,V=0;const B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(B)[1]),z=V>=1):B.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),z=V>=2);let k=null,Y={};const nt=i.getParameter(i.SCISSOR_BOX),K=i.getParameter(i.VIEWPORT),mt=new Se().fromArray(nt),It=new Se().fromArray(K);function Ut(H,ut,ft,Pt){const Mt=new Uint8Array(4),ct=i.createTexture();i.bindTexture(H,ct),i.texParameteri(H,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(H,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ht=0;Ht<ft;Ht++)H===i.TEXTURE_3D||H===i.TEXTURE_2D_ARRAY?i.texImage3D(ut,0,i.RGBA,1,1,Pt,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(ut+Ht,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return ct}const $={};$[i.TEXTURE_2D]=Ut(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Ut(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Ut(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Ut(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),rt(i.DEPTH_TEST),a.setFunc(er),ot(!1),it(xh),rt(i.CULL_FACE),tt(cn);function rt(H){h[H]!==!0&&(i.enable(H),h[H]=!0)}function _t(H){h[H]!==!1&&(i.disable(H),h[H]=!1)}function Tt(H,ut){return u[H]!==ut?(i.bindFramebuffer(H,ut),u[H]=ut,H===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ut),H===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ut),!0):!1}function wt(H,ut){let ft=d,Pt=!1;if(H){ft=f.get(ut),ft===void 0&&(ft=[],f.set(ut,ft));const Mt=H.textures;if(ft.length!==Mt.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let ct=0,Ht=Mt.length;ct<Ht;ct++)ft[ct]=i.COLOR_ATTACHMENT0+ct;ft.length=Mt.length,Pt=!0}}else ft[0]!==i.BACK&&(ft[0]=i.BACK,Pt=!0);Pt&&i.drawBuffers(ft)}function qt(H){return m!==H?(i.useProgram(H),m=H,!0):!1}const Bt={[Ii]:i.FUNC_ADD,[$f]:i.FUNC_SUBTRACT,[Zf]:i.FUNC_REVERSE_SUBTRACT};Bt[Jf]=i.MIN,Bt[Kf]=i.MAX;const U={[Cl]:i.ZERO,[jf]:i.ONE,[Qf]:i.SRC_COLOR,[Pl]:i.SRC_ALPHA,[i0]:i.SRC_ALPHA_SATURATE,[Md]:i.DST_COLOR,[_d]:i.DST_ALPHA,[t0]:i.ONE_MINUS_SRC_COLOR,[Il]:i.ONE_MINUS_SRC_ALPHA,[n0]:i.ONE_MINUS_DST_COLOR,[e0]:i.ONE_MINUS_DST_ALPHA,[s0]:i.CONSTANT_COLOR,[r0]:i.ONE_MINUS_CONSTANT_COLOR,[a0]:i.CONSTANT_ALPHA,[o0]:i.ONE_MINUS_CONSTANT_ALPHA};function tt(H,ut,ft,Pt,Mt,ct,Ht,ee,ve,xe){if(H===cn){x===!0&&(_t(i.BLEND),x=!1);return}if(x===!1&&(rt(i.BLEND),x=!0),H!==vd){if(H!==g||xe!==y){if((p!==Ii||_!==Ii)&&(i.blendEquation(i.FUNC_ADD),p=Ii,_=Ii),xe)switch(H){case Qs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Hr:i.blendFunc(i.ONE,i.ONE);break;case vh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _h:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case Qs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Hr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case vh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _h:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}v=null,M=null,T=null,b=null,E.set(0,0,0),w=0,g=H,y=xe}return}Mt=Mt||ut,ct=ct||ft,Ht=Ht||Pt,(ut!==p||Mt!==_)&&(i.blendEquationSeparate(Bt[ut],Bt[Mt]),p=ut,_=Mt),(ft!==v||Pt!==M||ct!==T||Ht!==b)&&(i.blendFuncSeparate(U[ft],U[Pt],U[ct],U[Ht]),v=ft,M=Pt,T=ct,b=Ht),(ee.equals(E)===!1||ve!==w)&&(i.blendColor(ee.r,ee.g,ee.b,ve),E.copy(ee),w=ve),g=H,y=!1}function j(H,ut){H.side===Oe?_t(i.CULL_FACE):rt(i.CULL_FACE);let ft=H.side===rn;ut&&(ft=!ft),ot(ft),H.blending===Qs&&H.transparent===!1?tt(cn):tt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),a.setFunc(H.depthFunc),a.setTest(H.depthTest),a.setMask(H.depthWrite),r.setMask(H.colorWrite);const Pt=H.stencilWrite;o.setTest(Pt),Pt&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),dt(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):_t(i.SAMPLE_ALPHA_TO_COVERAGE)}function ot(H){S!==H&&(H?i.frontFace(i.CW):i.frontFace(i.CCW),S=H)}function it(H){H!==qf?(rt(i.CULL_FACE),H!==R&&(H===xh?i.cullFace(i.BACK):H===Yf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_t(i.CULL_FACE),R=H}function xt(H){H!==I&&(z&&i.lineWidth(H),I=H)}function dt(H,ut,ft){H?(rt(i.POLYGON_OFFSET_FILL),(C!==ut||N!==ft)&&(i.polygonOffset(ut,ft),C=ut,N=ft)):_t(i.POLYGON_OFFSET_FILL)}function vt(H){H?rt(i.SCISSOR_TEST):_t(i.SCISSOR_TEST)}function Jt(H){H===void 0&&(H=i.TEXTURE0+F-1),k!==H&&(i.activeTexture(H),k=H)}function $t(H,ut,ft){ft===void 0&&(k===null?ft=i.TEXTURE0+F-1:ft=k);let Pt=Y[ft];Pt===void 0&&(Pt={type:void 0,texture:void 0},Y[ft]=Pt),(Pt.type!==H||Pt.texture!==ut)&&(k!==ft&&(i.activeTexture(ft),k=ft),i.bindTexture(H,ut||$[H]),Pt.type=H,Pt.texture=ut)}function D(){const H=Y[k];H!==void 0&&H.type!==void 0&&(i.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Q(){try{i.texSubImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ht(){try{i.texSubImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ft(){try{i.compressedTexSubImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function yt(){try{i.texStorage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Lt(){try{i.texStorage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function kt(){try{i.texImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function St(){try{i.texImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function at(H){mt.equals(H)===!1&&(i.scissor(H.x,H.y,H.z,H.w),mt.copy(H))}function bt(H){It.equals(H)===!1&&(i.viewport(H.x,H.y,H.z,H.w),It.copy(H))}function Et(H,ut){let ft=c.get(ut);ft===void 0&&(ft=new WeakMap,c.set(ut,ft));let Pt=ft.get(H);Pt===void 0&&(Pt=i.getUniformBlockIndex(ut,H.name),ft.set(H,Pt))}function pt(H,ut){const Pt=c.get(ut).get(H);l.get(ut)!==Pt&&(i.uniformBlockBinding(ut,Pt,H.__bindingPointIndex),l.set(ut,Pt))}function Wt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},k=null,Y={},u={},f=new WeakMap,d=[],m=null,x=!1,g=null,p=null,v=null,M=null,_=null,T=null,b=null,E=new Zt(0,0,0),w=0,y=!1,S=null,R=null,I=null,C=null,N=null,mt.set(0,0,i.canvas.width,i.canvas.height),It.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:rt,disable:_t,bindFramebuffer:Tt,drawBuffers:wt,useProgram:qt,setBlending:tt,setMaterial:j,setFlipSided:ot,setCullFace:it,setLineWidth:xt,setPolygonOffset:dt,setScissorTest:vt,activeTexture:Jt,bindTexture:$t,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:W,texImage2D:kt,texImage3D:St,updateUBOMapping:Et,uniformBlockBinding:pt,texStorage2D:yt,texStorage3D:Lt,texSubImage2D:Q,texSubImage3D:ht,compressedTexSubImage2D:J,compressedTexSubImage3D:Ft,scissor:at,viewport:bt,reset:Wt}}function Dv(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new gt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(D,A){return d?new OffscreenCanvas(D,A):Xr("canvas")}function x(D,A,W){let Q=1;const ht=$t(D);if((ht.width>W||ht.height>W)&&(Q=W/Math.max(ht.width,ht.height)),Q<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const J=Math.floor(Q*ht.width),Ft=Math.floor(Q*ht.height);u===void 0&&(u=m(J,Ft));const yt=A?m(J,Ft):u;return yt.width=J,yt.height=Ft,yt.getContext("2d").drawImage(D,0,0,J,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+J+"x"+Ft+")."),yt}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),D;return D}function g(D){return D.generateMipmaps}function p(D){i.generateMipmap(D)}function v(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(D,A,W,Q,ht=!1){if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let J=A;if(A===i.RED&&(W===i.FLOAT&&(J=i.R32F),W===i.HALF_FLOAT&&(J=i.R16F),W===i.UNSIGNED_BYTE&&(J=i.R8)),A===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(J=i.R8UI),W===i.UNSIGNED_SHORT&&(J=i.R16UI),W===i.UNSIGNED_INT&&(J=i.R32UI),W===i.BYTE&&(J=i.R8I),W===i.SHORT&&(J=i.R16I),W===i.INT&&(J=i.R32I)),A===i.RG&&(W===i.FLOAT&&(J=i.RG32F),W===i.HALF_FLOAT&&(J=i.RG16F),W===i.UNSIGNED_BYTE&&(J=i.RG8)),A===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(J=i.RG8UI),W===i.UNSIGNED_SHORT&&(J=i.RG16UI),W===i.UNSIGNED_INT&&(J=i.RG32UI),W===i.BYTE&&(J=i.RG8I),W===i.SHORT&&(J=i.RG16I),W===i.INT&&(J=i.RG32I)),A===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(J=i.RGB8UI),W===i.UNSIGNED_SHORT&&(J=i.RGB16UI),W===i.UNSIGNED_INT&&(J=i.RGB32UI),W===i.BYTE&&(J=i.RGB8I),W===i.SHORT&&(J=i.RGB16I),W===i.INT&&(J=i.RGB32I)),A===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),W===i.UNSIGNED_INT&&(J=i.RGBA32UI),W===i.BYTE&&(J=i.RGBA8I),W===i.SHORT&&(J=i.RGBA16I),W===i.INT&&(J=i.RGBA32I)),A===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),A===i.RGBA){const Ft=ht?so:me.getTransfer(Q);W===i.FLOAT&&(J=i.RGBA32F),W===i.HALF_FLOAT&&(J=i.RGBA16F),W===i.UNSIGNED_BYTE&&(J=Ft===_e?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function _(D,A){let W;return D?A===null||A===Ss||A===sr?W=i.DEPTH24_STENCIL8:A===Yn?W=i.DEPTH32F_STENCIL8:A===Gr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ss||A===sr?W=i.DEPTH_COMPONENT24:A===Yn?W=i.DEPTH_COMPONENT32F:A===Gr&&(W=i.DEPTH_COMPONENT16),W}function T(D,A){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==un&&D.minFilter!==ai?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function b(D){const A=D.target;A.removeEventListener("dispose",b),w(A),A.isVideoTexture&&h.delete(A)}function E(D){const A=D.target;A.removeEventListener("dispose",E),S(A)}function w(D){const A=n.get(D);if(A.__webglInit===void 0)return;const W=D.source,Q=f.get(W);if(Q){const ht=Q[A.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&y(D),Object.keys(Q).length===0&&f.delete(W)}n.remove(D)}function y(D){const A=n.get(D);i.deleteTexture(A.__webglTexture);const W=D.source,Q=f.get(W);delete Q[A.__cacheKey],a.memory.textures--}function S(D){const A=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(A.__webglFramebuffer[Q]))for(let ht=0;ht<A.__webglFramebuffer[Q].length;ht++)i.deleteFramebuffer(A.__webglFramebuffer[Q][ht]);else i.deleteFramebuffer(A.__webglFramebuffer[Q]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[Q])}else{if(Array.isArray(A.__webglFramebuffer))for(let Q=0;Q<A.__webglFramebuffer.length;Q++)i.deleteFramebuffer(A.__webglFramebuffer[Q]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let Q=0;Q<A.__webglColorRenderbuffer.length;Q++)A.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[Q]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const W=D.textures;for(let Q=0,ht=W.length;Q<ht;Q++){const J=n.get(W[Q]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),n.remove(W[Q])}n.remove(D)}let R=0;function I(){R=0}function C(){const D=R;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),R+=1,D}function N(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function F(D,A){const W=n.get(D);if(D.isVideoTexture&&vt(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&W.__version!==D.version){const Q=D.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(W,D,A);return}}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+A)}function z(D,A){const W=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){$(W,D,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+A)}function V(D,A){const W=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){$(W,D,A);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+A)}function B(D,A){const W=n.get(D);if(D.version>0&&W.__version!==D.version){rt(W,D,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+A)}const k={[di]:i.REPEAT,[gs]:i.CLAMP_TO_EDGE,[Hl]:i.MIRRORED_REPEAT},Y={[un]:i.NEAREST,[h0]:i.NEAREST_MIPMAP_NEAREST,[sa]:i.NEAREST_MIPMAP_LINEAR,[ai]:i.LINEAR,[Oo]:i.LINEAR_MIPMAP_NEAREST,[xs]:i.LINEAR_MIPMAP_LINEAR},nt={[p0]:i.NEVER,[M0]:i.ALWAYS,[m0]:i.LESS,[Nd]:i.LEQUAL,[g0]:i.EQUAL,[_0]:i.GEQUAL,[x0]:i.GREATER,[v0]:i.NOTEQUAL};function K(D,A){if(A.type===Yn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===ai||A.magFilter===Oo||A.magFilter===sa||A.magFilter===xs||A.minFilter===ai||A.minFilter===Oo||A.minFilter===sa||A.minFilter===xs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,k[A.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,k[A.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,k[A.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,Y[A.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,Y[A.minFilter]),A.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,nt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===un||A.minFilter!==sa&&A.minFilter!==xs||A.type===Yn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function mt(D,A){let W=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",b));const Q=A.source;let ht=f.get(Q);ht===void 0&&(ht={},f.set(Q,ht));const J=N(A);if(J!==D.__cacheKey){ht[J]===void 0&&(ht[J]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),ht[J].usedTimes++;const Ft=ht[D.__cacheKey];Ft!==void 0&&(ht[D.__cacheKey].usedTimes--,Ft.usedTimes===0&&y(A)),D.__cacheKey=J,D.__webglTexture=ht[J].texture}return W}function It(D,A,W){return Math.floor(Math.floor(D/W)/A)}function Ut(D,A,W,Q){const J=D.updateRanges;if(J.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,W,Q,A.data);else{J.sort((St,at)=>St.start-at.start);let Ft=0;for(let St=1;St<J.length;St++){const at=J[Ft],bt=J[St],Et=at.start+at.count,pt=It(bt.start,A.width,4),Wt=It(at.start,A.width,4);bt.start<=Et+1&&pt===Wt&&It(bt.start+bt.count-1,A.width,4)===pt?at.count=Math.max(at.count,bt.start+bt.count-at.start):(++Ft,J[Ft]=bt)}J.length=Ft+1;const yt=i.getParameter(i.UNPACK_ROW_LENGTH),Lt=i.getParameter(i.UNPACK_SKIP_PIXELS),kt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let St=0,at=J.length;St<at;St++){const bt=J[St],Et=Math.floor(bt.start/4),pt=Math.ceil(bt.count/4),Wt=Et%A.width,H=Math.floor(Et/A.width),ut=pt,ft=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Wt),i.pixelStorei(i.UNPACK_SKIP_ROWS,H),e.texSubImage2D(i.TEXTURE_2D,0,Wt,H,ut,ft,W,Q,A.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,yt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),i.pixelStorei(i.UNPACK_SKIP_ROWS,kt)}}function $(D,A,W){let Q=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(Q=i.TEXTURE_3D);const ht=mt(D,A),J=A.source;e.bindTexture(Q,D.__webglTexture,i.TEXTURE0+W);const Ft=n.get(J);if(J.version!==Ft.__version||ht===!0){e.activeTexture(i.TEXTURE0+W);const yt=me.getPrimaries(me.workingColorSpace),Lt=A.colorSpace===mn?null:me.getPrimaries(A.colorSpace),kt=A.colorSpace===mn||yt===Lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);let St=x(A.image,!1,s.maxTextureSize);St=Jt(A,St);const at=r.convert(A.format,A.colorSpace),bt=r.convert(A.type);let Et=M(A.internalFormat,at,bt,A.colorSpace,A.isVideoTexture);K(Q,A);let pt;const Wt=A.mipmaps,H=A.isVideoTexture!==!0,ut=Ft.__version===void 0||ht===!0,ft=J.dataReady,Pt=T(A,St);if(A.isDepthTexture)Et=_(A.format===rr,A.type),ut&&(H?e.texStorage2D(i.TEXTURE_2D,1,Et,St.width,St.height):e.texImage2D(i.TEXTURE_2D,0,Et,St.width,St.height,0,at,bt,null));else if(A.isDataTexture)if(Wt.length>0){H&&ut&&e.texStorage2D(i.TEXTURE_2D,Pt,Et,Wt[0].width,Wt[0].height);for(let Mt=0,ct=Wt.length;Mt<ct;Mt++)pt=Wt[Mt],H?ft&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,pt.width,pt.height,at,bt,pt.data):e.texImage2D(i.TEXTURE_2D,Mt,Et,pt.width,pt.height,0,at,bt,pt.data);A.generateMipmaps=!1}else H?(ut&&e.texStorage2D(i.TEXTURE_2D,Pt,Et,St.width,St.height),ft&&Ut(A,St,at,bt)):e.texImage2D(i.TEXTURE_2D,0,Et,St.width,St.height,0,at,bt,St.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){H&&ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,Et,Wt[0].width,Wt[0].height,St.depth);for(let Mt=0,ct=Wt.length;Mt<ct;Mt++)if(pt=Wt[Mt],A.format!==On)if(at!==null)if(H){if(ft)if(A.layerUpdates.size>0){const Ht=su(pt.width,pt.height,A.format,A.type);for(const ee of A.layerUpdates){const ve=pt.data.subarray(ee*Ht/pt.data.BYTES_PER_ELEMENT,(ee+1)*Ht/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,ee,pt.width,pt.height,1,at,ve)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,pt.width,pt.height,St.depth,at,pt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Mt,Et,pt.width,pt.height,St.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?ft&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Mt,0,0,0,pt.width,pt.height,St.depth,at,bt,pt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Mt,Et,pt.width,pt.height,St.depth,0,at,bt,pt.data)}else{H&&ut&&e.texStorage2D(i.TEXTURE_2D,Pt,Et,Wt[0].width,Wt[0].height);for(let Mt=0,ct=Wt.length;Mt<ct;Mt++)pt=Wt[Mt],A.format!==On?at!==null?H?ft&&e.compressedTexSubImage2D(i.TEXTURE_2D,Mt,0,0,pt.width,pt.height,at,pt.data):e.compressedTexImage2D(i.TEXTURE_2D,Mt,Et,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?ft&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,pt.width,pt.height,at,bt,pt.data):e.texImage2D(i.TEXTURE_2D,Mt,Et,pt.width,pt.height,0,at,bt,pt.data)}else if(A.isDataArrayTexture)if(H){if(ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,Et,St.width,St.height,St.depth),ft)if(A.layerUpdates.size>0){const Mt=su(St.width,St.height,A.format,A.type);for(const ct of A.layerUpdates){const Ht=St.data.subarray(ct*Mt/St.data.BYTES_PER_ELEMENT,(ct+1)*Mt/St.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ct,St.width,St.height,1,at,bt,Ht)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,St.width,St.height,St.depth,at,bt,St.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,St.width,St.height,St.depth,0,at,bt,St.data);else if(A.isData3DTexture)H?(ut&&e.texStorage3D(i.TEXTURE_3D,Pt,Et,St.width,St.height,St.depth),ft&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,St.width,St.height,St.depth,at,bt,St.data)):e.texImage3D(i.TEXTURE_3D,0,Et,St.width,St.height,St.depth,0,at,bt,St.data);else if(A.isFramebufferTexture){if(ut)if(H)e.texStorage2D(i.TEXTURE_2D,Pt,Et,St.width,St.height);else{let Mt=St.width,ct=St.height;for(let Ht=0;Ht<Pt;Ht++)e.texImage2D(i.TEXTURE_2D,Ht,Et,Mt,ct,0,at,bt,null),Mt>>=1,ct>>=1}}else if(Wt.length>0){if(H&&ut){const Mt=$t(Wt[0]);e.texStorage2D(i.TEXTURE_2D,Pt,Et,Mt.width,Mt.height)}for(let Mt=0,ct=Wt.length;Mt<ct;Mt++)pt=Wt[Mt],H?ft&&e.texSubImage2D(i.TEXTURE_2D,Mt,0,0,at,bt,pt):e.texImage2D(i.TEXTURE_2D,Mt,Et,at,bt,pt);A.generateMipmaps=!1}else if(H){if(ut){const Mt=$t(St);e.texStorage2D(i.TEXTURE_2D,Pt,Et,Mt.width,Mt.height)}ft&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,at,bt,St)}else e.texImage2D(i.TEXTURE_2D,0,Et,at,bt,St);g(A)&&p(Q),Ft.__version=J.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function rt(D,A,W){if(A.image.length!==6)return;const Q=mt(D,A),ht=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+W);const J=n.get(ht);if(ht.version!==J.__version||Q===!0){e.activeTexture(i.TEXTURE0+W);const Ft=me.getPrimaries(me.workingColorSpace),yt=A.colorSpace===mn?null:me.getPrimaries(A.colorSpace),Lt=A.colorSpace===mn||Ft===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);const kt=A.isCompressedTexture||A.image[0].isCompressedTexture,St=A.image[0]&&A.image[0].isDataTexture,at=[];for(let ct=0;ct<6;ct++)!kt&&!St?at[ct]=x(A.image[ct],!0,s.maxCubemapSize):at[ct]=St?A.image[ct].image:A.image[ct],at[ct]=Jt(A,at[ct]);const bt=at[0],Et=r.convert(A.format,A.colorSpace),pt=r.convert(A.type),Wt=M(A.internalFormat,Et,pt,A.colorSpace),H=A.isVideoTexture!==!0,ut=J.__version===void 0||Q===!0,ft=ht.dataReady;let Pt=T(A,bt);K(i.TEXTURE_CUBE_MAP,A);let Mt;if(kt){H&&ut&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,Wt,bt.width,bt.height);for(let ct=0;ct<6;ct++){Mt=at[ct].mipmaps;for(let Ht=0;Ht<Mt.length;Ht++){const ee=Mt[Ht];A.format!==On?Et!==null?H?ft&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht,0,0,ee.width,ee.height,Et,ee.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht,Wt,ee.width,ee.height,0,ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht,0,0,ee.width,ee.height,Et,pt,ee.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht,Wt,ee.width,ee.height,0,Et,pt,ee.data)}}}else{if(Mt=A.mipmaps,H&&ut){Mt.length>0&&Pt++;const ct=$t(at[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,Wt,ct.width,ct.height)}for(let ct=0;ct<6;ct++)if(St){H?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,at[ct].width,at[ct].height,Et,pt,at[ct].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Wt,at[ct].width,at[ct].height,0,Et,pt,at[ct].data);for(let Ht=0;Ht<Mt.length;Ht++){const ve=Mt[Ht].image[ct].image;H?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht+1,0,0,ve.width,ve.height,Et,pt,ve.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht+1,Wt,ve.width,ve.height,0,Et,pt,ve.data)}}else{H?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,Et,pt,at[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Wt,Et,pt,at[ct]);for(let Ht=0;Ht<Mt.length;Ht++){const ee=Mt[Ht];H?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht+1,0,0,Et,pt,ee.image[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Ht+1,Wt,Et,pt,ee.image[ct])}}}g(A)&&p(i.TEXTURE_CUBE_MAP),J.__version=ht.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function _t(D,A,W,Q,ht,J){const Ft=r.convert(W.format,W.colorSpace),yt=r.convert(W.type),Lt=M(W.internalFormat,Ft,yt,W.colorSpace),kt=n.get(A),St=n.get(W);if(St.__renderTarget=A,!kt.__hasExternalTextures){const at=Math.max(1,A.width>>J),bt=Math.max(1,A.height>>J);ht===i.TEXTURE_3D||ht===i.TEXTURE_2D_ARRAY?e.texImage3D(ht,J,Lt,at,bt,A.depth,0,Ft,yt,null):e.texImage2D(ht,J,Lt,at,bt,0,Ft,yt,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),dt(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,ht,St.__webglTexture,0,xt(A)):(ht===i.TEXTURE_2D||ht>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,ht,St.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Tt(D,A,W){if(i.bindRenderbuffer(i.RENDERBUFFER,D),A.depthBuffer){const Q=A.depthTexture,ht=Q&&Q.isDepthTexture?Q.type:null,J=_(A.stencilBuffer,ht),Ft=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=xt(A);dt(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,yt,J,A.width,A.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,yt,J,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,J,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ft,i.RENDERBUFFER,D)}else{const Q=A.textures;for(let ht=0;ht<Q.length;ht++){const J=Q[ht],Ft=r.convert(J.format,J.colorSpace),yt=r.convert(J.type),Lt=M(J.internalFormat,Ft,yt,J.colorSpace),kt=xt(A);W&&dt(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,Lt,A.width,A.height):dt(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,kt,Lt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Lt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function wt(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=n.get(A.depthTexture);Q.__renderTarget=A,(!Q.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),F(A.depthTexture,0);const ht=Q.__webglTexture,J=xt(A);if(A.depthTexture.format===Vr)dt(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ht,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ht,0);else if(A.depthTexture.format===rr)dt(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ht,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ht,0);else throw new Error("Unknown depthTexture format")}function qt(D){const A=n.get(D),W=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const Q=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),Q){const ht=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,Q.removeEventListener("dispose",ht)};Q.addEventListener("dispose",ht),A.__depthDisposeCallback=ht}A.__boundDepthTexture=Q}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const Q=D.texture.mipmaps;Q&&Q.length>0?wt(A.__webglFramebuffer[0],D):wt(A.__webglFramebuffer,D)}else if(W){A.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[Q]),A.__webglDepthbuffer[Q]===void 0)A.__webglDepthbuffer[Q]=i.createRenderbuffer(),Tt(A.__webglDepthbuffer[Q],D,!1);else{const ht=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=A.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,J)}}else{const Q=D.texture.mipmaps;if(Q&&Q.length>0?e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),Tt(A.__webglDepthbuffer,D,!1);else{const ht=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,J)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(D,A,W){const Q=n.get(D);A!==void 0&&_t(Q.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&qt(D)}function U(D){const A=D.texture,W=n.get(D),Q=n.get(A);D.addEventListener("dispose",E);const ht=D.textures,J=D.isWebGLCubeRenderTarget===!0,Ft=ht.length>1;if(Ft||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=A.version,a.memory.textures++),J){W.__webglFramebuffer=[];for(let yt=0;yt<6;yt++)if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer[yt]=[];for(let Lt=0;Lt<A.mipmaps.length;Lt++)W.__webglFramebuffer[yt][Lt]=i.createFramebuffer()}else W.__webglFramebuffer[yt]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer=[];for(let yt=0;yt<A.mipmaps.length;yt++)W.__webglFramebuffer[yt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Ft)for(let yt=0,Lt=ht.length;yt<Lt;yt++){const kt=n.get(ht[yt]);kt.__webglTexture===void 0&&(kt.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&dt(D)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let yt=0;yt<ht.length;yt++){const Lt=ht[yt];W.__webglColorRenderbuffer[yt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[yt]);const kt=r.convert(Lt.format,Lt.colorSpace),St=r.convert(Lt.type),at=M(Lt.internalFormat,kt,St,Lt.colorSpace,D.isXRRenderTarget===!0),bt=xt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,bt,at,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,W.__webglColorRenderbuffer[yt])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),Tt(W.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),K(i.TEXTURE_CUBE_MAP,A);for(let yt=0;yt<6;yt++)if(A.mipmaps&&A.mipmaps.length>0)for(let Lt=0;Lt<A.mipmaps.length;Lt++)_t(W.__webglFramebuffer[yt][Lt],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Lt);else _t(W.__webglFramebuffer[yt],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0);g(A)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let yt=0,Lt=ht.length;yt<Lt;yt++){const kt=ht[yt],St=n.get(kt);let at=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(at=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(at,St.__webglTexture),K(at,kt),_t(W.__webglFramebuffer,D,kt,i.COLOR_ATTACHMENT0+yt,at,0),g(kt)&&p(at)}e.unbindTexture()}else{let yt=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(yt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(yt,Q.__webglTexture),K(yt,A),A.mipmaps&&A.mipmaps.length>0)for(let Lt=0;Lt<A.mipmaps.length;Lt++)_t(W.__webglFramebuffer[Lt],D,A,i.COLOR_ATTACHMENT0,yt,Lt);else _t(W.__webglFramebuffer,D,A,i.COLOR_ATTACHMENT0,yt,0);g(A)&&p(yt),e.unbindTexture()}D.depthBuffer&&qt(D)}function tt(D){const A=D.textures;for(let W=0,Q=A.length;W<Q;W++){const ht=A[W];if(g(ht)){const J=v(D),Ft=n.get(ht).__webglTexture;e.bindTexture(J,Ft),p(J),e.unbindTexture()}}}const j=[],ot=[];function it(D){if(D.samples>0){if(dt(D)===!1){const A=D.textures,W=D.width,Q=D.height;let ht=i.COLOR_BUFFER_BIT;const J=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ft=n.get(D),yt=A.length>1;if(yt)for(let kt=0;kt<A.length;kt++)e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer);const Lt=D.texture.mipmaps;Lt&&Lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let kt=0;kt<A.length;kt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ht|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ht|=i.STENCIL_BUFFER_BIT)),yt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[kt]);const St=n.get(A[kt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,St,0)}i.blitFramebuffer(0,0,W,Q,0,0,W,Q,ht,i.NEAREST),l===!0&&(j.length=0,ot.length=0,j.push(i.COLOR_ATTACHMENT0+kt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(j.push(J),ot.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ot)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,j))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),yt)for(let kt=0;kt<A.length;kt++){e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[kt]);const St=n.get(A[kt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+kt,i.TEXTURE_2D,St,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const A=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function xt(D){return Math.min(s.maxSamples,D.samples)}function dt(D){const A=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function vt(D){const A=a.render.frame;h.get(D)!==A&&(h.set(D,A),D.update())}function Jt(D,A){const W=D.colorSpace,Q=D.format,ht=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||W!==ar&&W!==mn&&(me.getTransfer(W)===_e?(Q!==On||ht!==fi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),A}function $t(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=C,this.resetTextureUnits=I,this.setTexture2D=F,this.setTexture2DArray=z,this.setTexture3D=V,this.setTextureCube=B,this.rebindTextures=Bt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=it,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=dt}function Uv(i,t){function e(n,s=mn){let r;const a=me.getTransfer(s);if(n===fi)return i.UNSIGNED_BYTE;if(n===kc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Hc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Pd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Id)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Rd)return i.BYTE;if(n===Cd)return i.SHORT;if(n===Gr)return i.UNSIGNED_SHORT;if(n===Bc)return i.INT;if(n===Ss)return i.UNSIGNED_INT;if(n===Yn)return i.FLOAT;if(n===pi)return i.HALF_FLOAT;if(n===Ld)return i.ALPHA;if(n===Dd)return i.RGB;if(n===On)return i.RGBA;if(n===Vr)return i.DEPTH_COMPONENT;if(n===rr)return i.DEPTH_STENCIL;if(n===So)return i.RED;if(n===Gc)return i.RED_INTEGER;if(n===Ud)return i.RG;if(n===Vc)return i.RG_INTEGER;if(n===Wc)return i.RGBA_INTEGER;if(n===Za||n===Ja||n===Ka||n===ja)if(a===_e)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Za)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Za)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ka)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ja)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Gl||n===Vl||n===Wl||n===Xl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Gl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Vl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Xl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ql||n===Yl||n===$l)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ql||n===Yl)return a===_e?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===$l)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Zl||n===Jl||n===Kl||n===jl||n===Ql||n===tc||n===ec||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===lc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Zl)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Jl)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Kl)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===jl)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ql)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===tc)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ec)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===nc)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ic)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===sc)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===rc)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ac)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===oc)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===lc)return a===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cc||n===hc||n===uc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===cc)return a===_e?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===hc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===uc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===dc||n===fc||n===pc||n===mc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===dc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===fc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===pc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===mc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===sr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Nv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fv=`
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

}`;class Ov{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new qd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new hn({vertexShader:Nv,fragmentShader:Fv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Xt(new fe(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class zv extends hr{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,m=null;const x=typeof XRWebGLBinding<"u",g=new Ov,p={},v=e.getContextAttributes();let M=null,_=null;const T=[],b=[],E=new gt;let w=null;const y=new sn;y.viewport=new Se;const S=new sn;S.viewport=new Se;const R=[y,S],I=new im;let C=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let rt=T[$];return rt===void 0&&(rt=new sl,T[$]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function($){let rt=T[$];return rt===void 0&&(rt=new sl,T[$]=rt),rt.getGripSpace()},this.getHand=function($){let rt=T[$];return rt===void 0&&(rt=new sl,T[$]=rt),rt.getHandSpace()};function F($){const rt=b.indexOf($.inputSource);if(rt===-1)return;const _t=T[rt];_t!==void 0&&(_t.update($.inputSource,$.frame,c||a),_t.dispatchEvent({type:$.type,data:$.inputSource}))}function z(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",V);for(let $=0;$<T.length;$++){const rt=b[$];rt!==null&&(b[$]=null,T[$].disconnect(rt))}C=null,N=null,g.reset();for(const $ in p)delete p[$];t.setRenderTarget(M),d=null,f=null,u=null,s=null,_=null,Ut.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",z),s.addEventListener("inputsourceschange",V),v.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let _t=null,Tt=null,wt=null;v.depth&&(wt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,_t=v.stencil?rr:Vr,Tt=v.stencil?sr:Ss);const qt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(qt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new En(f.textureWidth,f.textureHeight,{format:On,type:fi,depthTexture:new jc(f.textureWidth,f.textureHeight,Tt,void 0,void 0,void 0,void 0,void 0,void 0,_t),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const _t={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,_t),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new En(d.framebufferWidth,d.framebufferHeight,{format:On,type:fi,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ut.setContext(s),Ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V($){for(let rt=0;rt<$.removed.length;rt++){const _t=$.removed[rt],Tt=b.indexOf(_t);Tt>=0&&(b[Tt]=null,T[Tt].disconnect(_t))}for(let rt=0;rt<$.added.length;rt++){const _t=$.added[rt];let Tt=b.indexOf(_t);if(Tt===-1){for(let qt=0;qt<T.length;qt++)if(qt>=b.length){b.push(_t),Tt=qt;break}else if(b[qt]===null){b[qt]=_t,Tt=qt;break}if(Tt===-1)break}const wt=T[Tt];wt&&wt.connect(_t)}}const B=new L,k=new L;function Y($,rt,_t){B.setFromMatrixPosition(rt.matrixWorld),k.setFromMatrixPosition(_t.matrixWorld);const Tt=B.distanceTo(k),wt=rt.projectionMatrix.elements,qt=_t.projectionMatrix.elements,Bt=wt[14]/(wt[10]-1),U=wt[14]/(wt[10]+1),tt=(wt[9]+1)/wt[5],j=(wt[9]-1)/wt[5],ot=(wt[8]-1)/wt[0],it=(qt[8]+1)/qt[0],xt=Bt*ot,dt=Bt*it,vt=Tt/(-ot+it),Jt=vt*-ot;if(rt.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Jt),$.translateZ(vt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),wt[10]===-1)$.projectionMatrix.copy(rt.projectionMatrix),$.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const $t=Bt+vt,D=U+vt,A=xt-Jt,W=dt+(Tt-Jt),Q=tt*U/D*$t,ht=j*U/D*$t;$.projectionMatrix.makePerspective(A,W,Q,ht,$t,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function nt($,rt){rt===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(rt.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let rt=$.near,_t=$.far;g.texture!==null&&(g.depthNear>0&&(rt=g.depthNear),g.depthFar>0&&(_t=g.depthFar)),I.near=S.near=y.near=rt,I.far=S.far=y.far=_t,(C!==I.near||N!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),C=I.near,N=I.far),I.layers.mask=$.layers.mask|6,y.layers.mask=I.layers.mask&3,S.layers.mask=I.layers.mask&5;const Tt=$.parent,wt=I.cameras;nt(I,Tt);for(let qt=0;qt<wt.length;qt++)nt(wt[qt],Tt);wt.length===2?Y(I,y,S):I.projectionMatrix.copy(y.projectionMatrix),K($,I,Tt)};function K($,rt,_t){_t===null?$.matrix.copy(rt.matrixWorld):($.matrix.copy(_t.matrixWorld),$.matrix.invert(),$.matrix.multiply(rt.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(rt.projectionMatrix),$.projectionMatrixInverse.copy(rt.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Wr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function($){return p[$]};let mt=null;function It($,rt){if(h=rt.getViewerPose(c||a),m=rt,h!==null){const _t=h.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let Tt=!1;_t.length!==I.cameras.length&&(I.cameras.length=0,Tt=!0);for(let U=0;U<_t.length;U++){const tt=_t[U];let j=null;if(d!==null)j=d.getViewport(tt);else{const it=u.getViewSubImage(f,tt);j=it.viewport,U===0&&(t.setRenderTargetTextures(_,it.colorTexture,it.depthStencilTexture),t.setRenderTarget(_))}let ot=R[U];ot===void 0&&(ot=new sn,ot.layers.enable(U),ot.viewport=new Se,R[U]=ot),ot.matrix.fromArray(tt.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(tt.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(j.x,j.y,j.width,j.height),U===0&&(I.matrix.copy(ot.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Tt===!0&&I.cameras.push(ot)}const wt=s.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const U=u.getDepthInformation(_t[0]);U&&U.isValid&&U.texture&&g.init(U,s.renderState)}if(wt&&wt.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let U=0;U<_t.length;U++){const tt=_t[U].camera;if(tt){let j=p[tt];j||(j=new qd,p[tt]=j);const ot=u.getCameraImage(tt);j.sourceTexture=ot}}}}for(let _t=0;_t<T.length;_t++){const Tt=b[_t],wt=T[_t];Tt!==null&&wt!==void 0&&wt.update(Tt,rt,c||a)}mt&&mt($,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),m=null}const Ut=new rf;Ut.setAnimationLoop(It),this.setAnimationLoop=function($){mt=$},this.dispose=function(){}}}const ls=new xn,Bv=new ne;function kv(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Hd(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,v,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,v,M):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===rn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===rn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const v=t.get(p),M=v.envMap,_=v.envMapRotation;M&&(g.envMap.value=M,ls.copy(_),ls.x*=-1,ls.y*=-1,ls.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ls.y*=-1,ls.z*=-1),g.envMapRotation.value.setFromMatrix4(Bv.makeRotationFromEuler(ls)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,v,M){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=M*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===rn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const v=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Hv(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){const _=M.program;n.uniformBlockBinding(v,_)}function c(v,M){let _=s[v.id];_===void 0&&(m(v),_=h(v),s[v.id]=_,v.addEventListener("dispose",g));const T=M.program;n.updateUBOMapping(v,T);const b=t.render.frame;r[v.id]!==b&&(f(v),r[v.id]=b)}function h(v){const M=u();v.__bindingPointIndex=M;const _=i.createBuffer(),T=v.__size,b=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,T,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const M=s[v.id],_=v.uniforms,T=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let b=0,E=_.length;b<E;b++){const w=Array.isArray(_[b])?_[b]:[_[b]];for(let y=0,S=w.length;y<S;y++){const R=w[y];if(d(R,b,y,T)===!0){const I=R.__offset,C=Array.isArray(R.value)?R.value:[R.value];let N=0;for(let F=0;F<C.length;F++){const z=C[F],V=x(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,I+N,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,N),N+=V.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,M,_,T){const b=v.value,E=M+"_"+_;if(T[E]===void 0)return typeof b=="number"||typeof b=="boolean"?T[E]=b:T[E]=b.clone(),!0;{const w=T[E];if(typeof b=="number"||typeof b=="boolean"){if(w!==b)return T[E]=b,!0}else if(w.equals(b)===!1)return w.copy(b),!0}return!1}function m(v){const M=v.uniforms;let _=0;const T=16;for(let E=0,w=M.length;E<w;E++){const y=Array.isArray(M[E])?M[E]:[M[E]];for(let S=0,R=y.length;S<R;S++){const I=y[S],C=Array.isArray(I.value)?I.value:[I.value];for(let N=0,F=C.length;N<F;N++){const z=C[N],V=x(z),B=_%T,k=B%V.boundary,Y=B+k;_+=k,Y!==0&&T-Y<V.storage&&(_+=T-Y),I.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=_,_+=V.storage}}}const b=_%T;return b>0&&(_+=T-b),v.__size=_,v.__cache={},this}function x(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function g(v){const M=v.target;M.removeEventListener("dispose",g);const _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}class Gv{constructor(t={}){const{canvas:e=O0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const m=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const v=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let T=!1;this._outputColorSpace=$e;let b=0,E=0,w=null,y=-1,S=null;const R=new Se,I=new Se;let C=null;const N=new Zt(0);let F=0,z=e.width,V=e.height,B=1,k=null,Y=null;const nt=new Se(0,0,z,V),K=new Se(0,0,z,V);let mt=!1;const It=new Kc;let Ut=!1,$=!1;const rt=new ne,_t=new L,Tt=new Se,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Bt(){return w===null?B:1}let U=n;function tt(P,X){return e.getContext(P,X)}try{const P={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Fc}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),U===null){const X="webgl2";if(U=tt(X,P),U===null)throw tt(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let j,ot,it,xt,dt,vt,Jt,$t,D,A,W,Q,ht,J,Ft,yt,Lt,kt,St,at,bt,Et,pt,Wt;function H(){j=new jg(U),j.init(),Et=new Uv(U,j),ot=new Xg(U,j,t,Et),it=new Lv(U,j),ot.reversedDepthBuffer&&f&&it.buffers.depth.setReversed(!0),xt=new ex(U),dt=new _v,vt=new Dv(U,j,it,dt,ot,Et,xt),Jt=new Yg(_),$t=new Kg(_),D=new om(U),pt=new Vg(U,D),A=new Qg(U,D,xt,pt),W=new ix(U,A,D,xt),St=new nx(U,ot,vt),yt=new qg(dt),Q=new vv(_,Jt,$t,j,ot,pt,yt),ht=new kv(_,dt),J=new yv,Ft=new Av(j),kt=new Gg(_,Jt,$t,it,W,d,l),Lt=new Pv(_,W,ot),Wt=new Hv(U,xt,ot,it),at=new Wg(U,j,xt),bt=new tx(U,j,xt),xt.programs=Q.programs,_.capabilities=ot,_.extensions=j,_.properties=dt,_.renderLists=J,_.shadowMap=Lt,_.state=it,_.info=xt}H();const ut=new zv(_,U);this.xr=ut,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const P=j.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=j.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(P){P!==void 0&&(B=P,this.setSize(z,V,!1))},this.getSize=function(P){return P.set(z,V)},this.setSize=function(P,X,et=!0){if(ut.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=P,V=X,e.width=Math.floor(P*B),e.height=Math.floor(X*B),et===!0&&(e.style.width=P+"px",e.style.height=X+"px"),this.setViewport(0,0,P,X)},this.getDrawingBufferSize=function(P){return P.set(z*B,V*B).floor()},this.setDrawingBufferSize=function(P,X,et){z=P,V=X,B=et,e.width=Math.floor(P*et),e.height=Math.floor(X*et),this.setViewport(0,0,P,X)},this.getCurrentViewport=function(P){return P.copy(R)},this.getViewport=function(P){return P.copy(nt)},this.setViewport=function(P,X,et,st){P.isVector4?nt.set(P.x,P.y,P.z,P.w):nt.set(P,X,et,st),it.viewport(R.copy(nt).multiplyScalar(B).round())},this.getScissor=function(P){return P.copy(K)},this.setScissor=function(P,X,et,st){P.isVector4?K.set(P.x,P.y,P.z,P.w):K.set(P,X,et,st),it.scissor(I.copy(K).multiplyScalar(B).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(P){it.setScissorTest(mt=P)},this.setOpaqueSort=function(P){k=P},this.setTransparentSort=function(P){Y=P},this.getClearColor=function(P){return P.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(P=!0,X=!0,et=!0){let st=0;if(P){let q=!1;if(w!==null){const At=w.texture.format;q=At===Wc||At===Vc||At===Gc}if(q){const At=w.texture.type,Ot=At===fi||At===Ss||At===Gr||At===sr||At===kc||At===Hc,Yt=kt.getClearColor(),Gt=kt.getClearAlpha(),te=Yt.r,ie=Yt.g,Kt=Yt.b;Ot?(m[0]=te,m[1]=ie,m[2]=Kt,m[3]=Gt,U.clearBufferuiv(U.COLOR,0,m)):(x[0]=te,x[1]=ie,x[2]=Kt,x[3]=Gt,U.clearBufferiv(U.COLOR,0,x))}else st|=U.COLOR_BUFFER_BIT}X&&(st|=U.DEPTH_BUFFER_BIT),et&&(st|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(st)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),kt.dispose(),J.dispose(),Ft.dispose(),dt.dispose(),Jt.dispose(),$t.dispose(),W.dispose(),pt.dispose(),Wt.dispose(),Q.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",jn),ut.removeEventListener("sessionend",uh),es.stop()};function ft(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const P=xt.autoReset,X=Lt.enabled,et=Lt.autoUpdate,st=Lt.needsUpdate,q=Lt.type;H(),xt.autoReset=P,Lt.enabled=X,Lt.autoUpdate=et,Lt.needsUpdate=st,Lt.type=q}function Mt(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ct(P){const X=P.target;X.removeEventListener("dispose",ct),Ht(X)}function Ht(P){ee(P),dt.remove(P)}function ee(P){const X=dt.get(P).programs;X!==void 0&&(X.forEach(function(et){Q.releaseProgram(et)}),P.isShaderMaterial&&Q.releaseShaderCache(P))}this.renderBufferDirect=function(P,X,et,st,q,At){X===null&&(X=wt);const Ot=q.isMesh&&q.matrixWorld.determinant()<0,Yt=kf(P,X,et,st,q);it.setMaterial(st,Ot);let Gt=et.index,te=1;if(st.wireframe===!0){if(Gt=A.getWireframeAttribute(et),Gt===void 0)return;te=2}const ie=et.drawRange,Kt=et.attributes.position;let ue=ie.start*te,ye=(ie.start+ie.count)*te;At!==null&&(ue=Math.max(ue,At.start*te),ye=Math.min(ye,(At.start+At.count)*te)),Gt!==null?(ue=Math.max(ue,0),ye=Math.min(ye,Gt.count)):Kt!=null&&(ue=Math.max(ue,0),ye=Math.min(ye,Kt.count));const Ue=ye-ue;if(Ue<0||Ue===1/0)return;pt.setup(q,st,Yt,et,Gt);let Te,be=at;if(Gt!==null&&(Te=D.get(Gt),be=bt,be.setIndex(Te)),q.isMesh)st.wireframe===!0?(it.setLineWidth(st.wireframeLinewidth*Bt()),be.setMode(U.LINES)):be.setMode(U.TRIANGLES);else if(q.isLine){let jt=st.linewidth;jt===void 0&&(jt=1),it.setLineWidth(jt*Bt()),q.isLineSegments?be.setMode(U.LINES):q.isLineLoop?be.setMode(U.LINE_LOOP):be.setMode(U.LINE_STRIP)}else q.isPoints?be.setMode(U.POINTS):q.isSprite&&be.setMode(U.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)qr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),be.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(j.get("WEBGL_multi_draw"))be.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const jt=q._multiDrawStarts,Pe=q._multiDrawCounts,ge=q._multiDrawCount,vn=Gt?D.get(Gt).bytesPerElement:1,Es=dt.get(st).currentProgram.getUniforms();for(let _n=0;_n<ge;_n++)Es.setValue(U,"_gl_DrawID",_n),be.render(jt[_n]/vn,Pe[_n])}else if(q.isInstancedMesh)be.renderInstances(ue,Ue,q.count);else if(et.isInstancedBufferGeometry){const jt=et._maxInstanceCount!==void 0?et._maxInstanceCount:1/0,Pe=Math.min(et.instanceCount,jt);be.renderInstances(ue,Ue,Pe)}else be.render(ue,Ue)};function ve(P,X,et){P.transparent===!0&&P.side===Oe&&P.forceSinglePass===!1?(P.side=rn,P.needsUpdate=!0,ia(P,X,et),P.side=Qi,P.needsUpdate=!0,ia(P,X,et),P.side=Oe):ia(P,X,et)}this.compile=function(P,X,et=null){et===null&&(et=P),p=Ft.get(et),p.init(X),M.push(p),et.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),P!==et&&P.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const st=new Set;return P.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const At=q.material;if(At)if(Array.isArray(At))for(let Ot=0;Ot<At.length;Ot++){const Yt=At[Ot];ve(Yt,et,q),st.add(Yt)}else ve(At,et,q),st.add(At)}),p=M.pop(),st},this.compileAsync=function(P,X,et=null){const st=this.compile(P,X,et);return new Promise(q=>{function At(){if(st.forEach(function(Ot){dt.get(Ot).currentProgram.isReady()&&st.delete(Ot)}),st.size===0){q(P);return}setTimeout(At,10)}j.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let xe=null;function vi(P){xe&&xe(P)}function jn(){es.stop()}function uh(){es.start()}const es=new rf;es.setAnimationLoop(vi),typeof self<"u"&&es.setContext(self),this.setAnimationLoop=function(P){xe=P,ut.setAnimationLoop(P),P===null?es.stop():es.start()},ut.addEventListener("sessionstart",jn),ut.addEventListener("sessionend",uh),this.render=function(P,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(X),X=ut.getCamera()),P.isScene===!0&&P.onBeforeRender(_,P,X,w),p=Ft.get(P,M.length),p.init(X),M.push(p),rt.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),It.setFromProjectionMatrix(rt,oi,X.reversedDepth),$=this.localClippingEnabled,Ut=yt.init(this.clippingPlanes,$),g=J.get(P,v.length),g.init(),v.push(g),ut.enabled===!0&&ut.isPresenting===!0){const At=_.xr.getDepthSensingMesh();At!==null&&No(At,X,-1/0,_.sortObjects)}No(P,X,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(k,Y),qt=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,qt&&kt.addToRenderList(g,P),this.info.render.frame++,Ut===!0&&yt.beginShadows();const et=p.state.shadowsArray;Lt.render(et,P,X),Ut===!0&&yt.endShadows(),this.info.autoReset===!0&&this.info.reset();const st=g.opaque,q=g.transmissive;if(p.setupLights(),X.isArrayCamera){const At=X.cameras;if(q.length>0)for(let Ot=0,Yt=At.length;Ot<Yt;Ot++){const Gt=At[Ot];fh(st,q,P,Gt)}qt&&kt.render(P);for(let Ot=0,Yt=At.length;Ot<Yt;Ot++){const Gt=At[Ot];dh(g,P,Gt,Gt.viewport)}}else q.length>0&&fh(st,q,P,X),qt&&kt.render(P),dh(g,P,X);w!==null&&E===0&&(vt.updateMultisampleRenderTarget(w),vt.updateRenderTargetMipmap(w)),P.isScene===!0&&P.onAfterRender(_,P,X),pt.resetDefaultState(),y=-1,S=null,M.pop(),M.length>0?(p=M[M.length-1],Ut===!0&&yt.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function No(P,X,et,st){if(P.visible===!1)return;if(P.layers.test(X.layers)){if(P.isGroup)et=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(X);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||It.intersectsSprite(P)){st&&Tt.setFromMatrixPosition(P.matrixWorld).applyMatrix4(rt);const Ot=W.update(P),Yt=P.material;Yt.visible&&g.push(P,Ot,Yt,et,Tt.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||It.intersectsObject(P))){const Ot=W.update(P),Yt=P.material;if(st&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Tt.copy(P.boundingSphere.center)):(Ot.boundingSphere===null&&Ot.computeBoundingSphere(),Tt.copy(Ot.boundingSphere.center)),Tt.applyMatrix4(P.matrixWorld).applyMatrix4(rt)),Array.isArray(Yt)){const Gt=Ot.groups;for(let te=0,ie=Gt.length;te<ie;te++){const Kt=Gt[te],ue=Yt[Kt.materialIndex];ue&&ue.visible&&g.push(P,Ot,ue,et,Tt.z,Kt)}}else Yt.visible&&g.push(P,Ot,Yt,et,Tt.z,null)}}const At=P.children;for(let Ot=0,Yt=At.length;Ot<Yt;Ot++)No(At[Ot],X,et,st)}function dh(P,X,et,st){const q=P.opaque,At=P.transmissive,Ot=P.transparent;p.setupLightsView(et),Ut===!0&&yt.setGlobalState(_.clippingPlanes,et),st&&it.viewport(R.copy(st)),q.length>0&&na(q,X,et),At.length>0&&na(At,X,et),Ot.length>0&&na(Ot,X,et),it.buffers.depth.setTest(!0),it.buffers.depth.setMask(!0),it.buffers.color.setMask(!0),it.setPolygonOffset(!1)}function fh(P,X,et,st){if((et.isScene===!0?et.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[st.id]===void 0&&(p.state.transmissionRenderTarget[st.id]=new En(1,1,{generateMipmaps:!0,type:j.has("EXT_color_buffer_half_float")||j.has("EXT_color_buffer_float")?pi:fi,minFilter:xs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));const At=p.state.transmissionRenderTarget[st.id],Ot=st.viewport||R;At.setSize(Ot.z*_.transmissionResolutionScale,Ot.w*_.transmissionResolutionScale);const Yt=_.getRenderTarget(),Gt=_.getActiveCubeFace(),te=_.getActiveMipmapLevel();_.setRenderTarget(At),_.getClearColor(N),F=_.getClearAlpha(),F<1&&_.setClearColor(16777215,.5),_.clear(),qt&&kt.render(et);const ie=_.toneMapping;_.toneMapping=Ki;const Kt=st.viewport;if(st.viewport!==void 0&&(st.viewport=void 0),p.setupLightsView(st),Ut===!0&&yt.setGlobalState(_.clippingPlanes,st),na(P,et,st),vt.updateMultisampleRenderTarget(At),vt.updateRenderTargetMipmap(At),j.has("WEBGL_multisampled_render_to_texture")===!1){let ue=!1;for(let ye=0,Ue=X.length;ye<Ue;ye++){const Te=X[ye],be=Te.object,jt=Te.geometry,Pe=Te.material,ge=Te.group;if(Pe.side===Oe&&be.layers.test(st.layers)){const vn=Pe.side;Pe.side=rn,Pe.needsUpdate=!0,ph(be,et,st,jt,Pe,ge),Pe.side=vn,Pe.needsUpdate=!0,ue=!0}}ue===!0&&(vt.updateMultisampleRenderTarget(At),vt.updateRenderTargetMipmap(At))}_.setRenderTarget(Yt,Gt,te),_.setClearColor(N,F),Kt!==void 0&&(st.viewport=Kt),_.toneMapping=ie}function na(P,X,et){const st=X.isScene===!0?X.overrideMaterial:null;for(let q=0,At=P.length;q<At;q++){const Ot=P[q],Yt=Ot.object,Gt=Ot.geometry,te=Ot.group;let ie=Ot.material;ie.allowOverride===!0&&st!==null&&(ie=st),Yt.layers.test(et.layers)&&ph(Yt,X,et,Gt,ie,te)}}function ph(P,X,et,st,q,At){P.onBeforeRender(_,X,et,st,q,At),P.modelViewMatrix.multiplyMatrices(et.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),q.onBeforeRender(_,X,et,st,P,At),q.transparent===!0&&q.side===Oe&&q.forceSinglePass===!1?(q.side=rn,q.needsUpdate=!0,_.renderBufferDirect(et,X,st,q,P,At),q.side=Qi,q.needsUpdate=!0,_.renderBufferDirect(et,X,st,q,P,At),q.side=Oe):_.renderBufferDirect(et,X,st,q,P,At),P.onAfterRender(_,X,et,st,q,At)}function ia(P,X,et){X.isScene!==!0&&(X=wt);const st=dt.get(P),q=p.state.lights,At=p.state.shadowsArray,Ot=q.state.version,Yt=Q.getParameters(P,q.state,At,X,et),Gt=Q.getProgramCacheKey(Yt);let te=st.programs;st.environment=P.isMeshStandardMaterial?X.environment:null,st.fog=X.fog,st.envMap=(P.isMeshStandardMaterial?$t:Jt).get(P.envMap||st.environment),st.envMapRotation=st.environment!==null&&P.envMap===null?X.environmentRotation:P.envMapRotation,te===void 0&&(P.addEventListener("dispose",ct),te=new Map,st.programs=te);let ie=te.get(Gt);if(ie!==void 0){if(st.currentProgram===ie&&st.lightsStateVersion===Ot)return gh(P,Yt),ie}else Yt.uniforms=Q.getUniforms(P),P.onBeforeCompile(Yt,_),ie=Q.acquireProgram(Yt,Gt),te.set(Gt,ie),st.uniforms=Yt.uniforms;const Kt=st.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Kt.clippingPlanes=yt.uniform),gh(P,Yt),st.needsLights=Gf(P),st.lightsStateVersion=Ot,st.needsLights&&(Kt.ambientLightColor.value=q.state.ambient,Kt.lightProbe.value=q.state.probe,Kt.directionalLights.value=q.state.directional,Kt.directionalLightShadows.value=q.state.directionalShadow,Kt.spotLights.value=q.state.spot,Kt.spotLightShadows.value=q.state.spotShadow,Kt.rectAreaLights.value=q.state.rectArea,Kt.ltc_1.value=q.state.rectAreaLTC1,Kt.ltc_2.value=q.state.rectAreaLTC2,Kt.pointLights.value=q.state.point,Kt.pointLightShadows.value=q.state.pointShadow,Kt.hemisphereLights.value=q.state.hemi,Kt.directionalShadowMap.value=q.state.directionalShadowMap,Kt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Kt.spotShadowMap.value=q.state.spotShadowMap,Kt.spotLightMatrix.value=q.state.spotLightMatrix,Kt.spotLightMap.value=q.state.spotLightMap,Kt.pointShadowMap.value=q.state.pointShadowMap,Kt.pointShadowMatrix.value=q.state.pointShadowMatrix),st.currentProgram=ie,st.uniformsList=null,ie}function mh(P){if(P.uniformsList===null){const X=P.currentProgram.getUniforms();P.uniformsList=Qa.seqWithValue(X.seq,P.uniforms)}return P.uniformsList}function gh(P,X){const et=dt.get(P);et.outputColorSpace=X.outputColorSpace,et.batching=X.batching,et.batchingColor=X.batchingColor,et.instancing=X.instancing,et.instancingColor=X.instancingColor,et.instancingMorph=X.instancingMorph,et.skinning=X.skinning,et.morphTargets=X.morphTargets,et.morphNormals=X.morphNormals,et.morphColors=X.morphColors,et.morphTargetsCount=X.morphTargetsCount,et.numClippingPlanes=X.numClippingPlanes,et.numIntersection=X.numClipIntersection,et.vertexAlphas=X.vertexAlphas,et.vertexTangents=X.vertexTangents,et.toneMapping=X.toneMapping}function kf(P,X,et,st,q){X.isScene!==!0&&(X=wt),vt.resetTextureUnits();const At=X.fog,Ot=st.isMeshStandardMaterial?X.environment:null,Yt=w===null?_.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:ar,Gt=(st.isMeshStandardMaterial?$t:Jt).get(st.envMap||Ot),te=st.vertexColors===!0&&!!et.attributes.color&&et.attributes.color.itemSize===4,ie=!!et.attributes.tangent&&(!!st.normalMap||st.anisotropy>0),Kt=!!et.morphAttributes.position,ue=!!et.morphAttributes.normal,ye=!!et.morphAttributes.color;let Ue=Ki;st.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Ue=_.toneMapping);const Te=et.morphAttributes.position||et.morphAttributes.normal||et.morphAttributes.color,be=Te!==void 0?Te.length:0,jt=dt.get(st),Pe=p.state.lights;if(Ut===!0&&($===!0||P!==S)){const an=P===S&&st.id===y;yt.setState(st,P,an)}let ge=!1;st.version===jt.__version?(jt.needsLights&&jt.lightsStateVersion!==Pe.state.version||jt.outputColorSpace!==Yt||q.isBatchedMesh&&jt.batching===!1||!q.isBatchedMesh&&jt.batching===!0||q.isBatchedMesh&&jt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&jt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&jt.instancing===!1||!q.isInstancedMesh&&jt.instancing===!0||q.isSkinnedMesh&&jt.skinning===!1||!q.isSkinnedMesh&&jt.skinning===!0||q.isInstancedMesh&&jt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&jt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&jt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&jt.instancingMorph===!1&&q.morphTexture!==null||jt.envMap!==Gt||st.fog===!0&&jt.fog!==At||jt.numClippingPlanes!==void 0&&(jt.numClippingPlanes!==yt.numPlanes||jt.numIntersection!==yt.numIntersection)||jt.vertexAlphas!==te||jt.vertexTangents!==ie||jt.morphTargets!==Kt||jt.morphNormals!==ue||jt.morphColors!==ye||jt.toneMapping!==Ue||jt.morphTargetsCount!==be)&&(ge=!0):(ge=!0,jt.__version=st.version);let vn=jt.currentProgram;ge===!0&&(vn=ia(st,X,q));let Es=!1,_n=!1,mr=!1;const Ie=vn.getUniforms(),An=jt.uniforms;if(it.useProgram(vn.program)&&(Es=!0,_n=!0,mr=!0),st.id!==y&&(y=st.id,_n=!0),Es||S!==P){it.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),Ie.setValue(U,"projectionMatrix",P.projectionMatrix),Ie.setValue(U,"viewMatrix",P.matrixWorldInverse);const fn=Ie.map.cameraPosition;fn!==void 0&&fn.setValue(U,_t.setFromMatrixPosition(P.matrixWorld)),ot.logarithmicDepthBuffer&&Ie.setValue(U,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(st.isMeshPhongMaterial||st.isMeshToonMaterial||st.isMeshLambertMaterial||st.isMeshBasicMaterial||st.isMeshStandardMaterial||st.isShaderMaterial)&&Ie.setValue(U,"isOrthographic",P.isOrthographicCamera===!0),S!==P&&(S=P,_n=!0,mr=!0)}if(q.isSkinnedMesh){Ie.setOptional(U,q,"bindMatrix"),Ie.setOptional(U,q,"bindMatrixInverse");const an=q.skeleton;an&&(an.boneTexture===null&&an.computeBoneTexture(),Ie.setValue(U,"boneTexture",an.boneTexture,vt))}q.isBatchedMesh&&(Ie.setOptional(U,q,"batchingTexture"),Ie.setValue(U,"batchingTexture",q._matricesTexture,vt),Ie.setOptional(U,q,"batchingIdTexture"),Ie.setValue(U,"batchingIdTexture",q._indirectTexture,vt),Ie.setOptional(U,q,"batchingColorTexture"),q._colorsTexture!==null&&Ie.setValue(U,"batchingColorTexture",q._colorsTexture,vt));const Rn=et.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&St.update(q,et,vn),(_n||jt.receiveShadow!==q.receiveShadow)&&(jt.receiveShadow=q.receiveShadow,Ie.setValue(U,"receiveShadow",q.receiveShadow)),st.isMeshGouraudMaterial&&st.envMap!==null&&(An.envMap.value=Gt,An.flipEnvMap.value=Gt.isCubeTexture&&Gt.isRenderTargetTexture===!1?-1:1),st.isMeshStandardMaterial&&st.envMap===null&&X.environment!==null&&(An.envMapIntensity.value=X.environmentIntensity),_n&&(Ie.setValue(U,"toneMappingExposure",_.toneMappingExposure),jt.needsLights&&Hf(An,mr),At&&st.fog===!0&&ht.refreshFogUniforms(An,At),ht.refreshMaterialUniforms(An,st,B,V,p.state.transmissionRenderTarget[P.id]),Qa.upload(U,mh(jt),An,vt)),st.isShaderMaterial&&st.uniformsNeedUpdate===!0&&(Qa.upload(U,mh(jt),An,vt),st.uniformsNeedUpdate=!1),st.isSpriteMaterial&&Ie.setValue(U,"center",q.center),Ie.setValue(U,"modelViewMatrix",q.modelViewMatrix),Ie.setValue(U,"normalMatrix",q.normalMatrix),Ie.setValue(U,"modelMatrix",q.matrixWorld),st.isShaderMaterial||st.isRawShaderMaterial){const an=st.uniformsGroups;for(let fn=0,Fo=an.length;fn<Fo;fn++){const ns=an[fn];Wt.update(ns,vn),Wt.bind(ns,vn)}}return vn}function Hf(P,X){P.ambientLightColor.needsUpdate=X,P.lightProbe.needsUpdate=X,P.directionalLights.needsUpdate=X,P.directionalLightShadows.needsUpdate=X,P.pointLights.needsUpdate=X,P.pointLightShadows.needsUpdate=X,P.spotLights.needsUpdate=X,P.spotLightShadows.needsUpdate=X,P.rectAreaLights.needsUpdate=X,P.hemisphereLights.needsUpdate=X}function Gf(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(P,X,et){const st=dt.get(P);st.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,st.__autoAllocateDepthBuffer===!1&&(st.__useRenderToTexture=!1),dt.get(P.texture).__webglTexture=X,dt.get(P.depthTexture).__webglTexture=st.__autoAllocateDepthBuffer?void 0:et,st.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,X){const et=dt.get(P);et.__webglFramebuffer=X,et.__useDefaultFramebuffer=X===void 0};const Vf=U.createFramebuffer();this.setRenderTarget=function(P,X=0,et=0){w=P,b=X,E=et;let st=!0,q=null,At=!1,Ot=!1;if(P){const Gt=dt.get(P);if(Gt.__useDefaultFramebuffer!==void 0)it.bindFramebuffer(U.FRAMEBUFFER,null),st=!1;else if(Gt.__webglFramebuffer===void 0)vt.setupRenderTarget(P);else if(Gt.__hasExternalTextures)vt.rebindTextures(P,dt.get(P.texture).__webglTexture,dt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Kt=P.depthTexture;if(Gt.__boundDepthTexture!==Kt){if(Kt!==null&&dt.has(Kt)&&(P.width!==Kt.image.width||P.height!==Kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");vt.setupDepthRenderbuffer(P)}}const te=P.texture;(te.isData3DTexture||te.isDataArrayTexture||te.isCompressedArrayTexture)&&(Ot=!0);const ie=dt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(ie[X])?q=ie[X][et]:q=ie[X],At=!0):P.samples>0&&vt.useMultisampledRTT(P)===!1?q=dt.get(P).__webglMultisampledFramebuffer:Array.isArray(ie)?q=ie[et]:q=ie,R.copy(P.viewport),I.copy(P.scissor),C=P.scissorTest}else R.copy(nt).multiplyScalar(B).floor(),I.copy(K).multiplyScalar(B).floor(),C=mt;if(et!==0&&(q=Vf),it.bindFramebuffer(U.FRAMEBUFFER,q)&&st&&it.drawBuffers(P,q),it.viewport(R),it.scissor(I),it.setScissorTest(C),At){const Gt=dt.get(P.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+X,Gt.__webglTexture,et)}else if(Ot){const Gt=X;for(let te=0;te<P.textures.length;te++){const ie=dt.get(P.textures[te]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+te,ie.__webglTexture,et,Gt)}}else if(P!==null&&et!==0){const Gt=dt.get(P.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Gt.__webglTexture,et)}y=-1},this.readRenderTargetPixels=function(P,X,et,st,q,At,Ot,Yt=0){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Gt=dt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ot!==void 0&&(Gt=Gt[Ot]),Gt){it.bindFramebuffer(U.FRAMEBUFFER,Gt);try{const te=P.textures[Yt],ie=te.format,Kt=te.type;if(!ot.textureFormatReadable(ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ot.textureTypeReadable(Kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=P.width-st&&et>=0&&et<=P.height-q&&(P.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Yt),U.readPixels(X,et,st,q,Et.convert(ie),Et.convert(Kt),At))}finally{const te=w!==null?dt.get(w).__webglFramebuffer:null;it.bindFramebuffer(U.FRAMEBUFFER,te)}}},this.readRenderTargetPixelsAsync=async function(P,X,et,st,q,At,Ot,Yt=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Gt=dt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ot!==void 0&&(Gt=Gt[Ot]),Gt)if(X>=0&&X<=P.width-st&&et>=0&&et<=P.height-q){it.bindFramebuffer(U.FRAMEBUFFER,Gt);const te=P.textures[Yt],ie=te.format,Kt=te.type;if(!ot.textureFormatReadable(ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ot.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ue=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,ue),U.bufferData(U.PIXEL_PACK_BUFFER,At.byteLength,U.STREAM_READ),P.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Yt),U.readPixels(X,et,st,q,Et.convert(ie),Et.convert(Kt),0);const ye=w!==null?dt.get(w).__webglFramebuffer:null;it.bindFramebuffer(U.FRAMEBUFFER,ye);const Ue=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await z0(U,Ue,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,ue),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,At),U.deleteBuffer(ue),U.deleteSync(Ue),At}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,X=null,et=0){const st=Math.pow(2,-et),q=Math.floor(P.image.width*st),At=Math.floor(P.image.height*st),Ot=X!==null?X.x:0,Yt=X!==null?X.y:0;vt.setTexture2D(P,0),U.copyTexSubImage2D(U.TEXTURE_2D,et,0,0,Ot,Yt,q,At),it.unbindTexture()};const Wf=U.createFramebuffer(),Xf=U.createFramebuffer();this.copyTextureToTexture=function(P,X,et=null,st=null,q=0,At=null){At===null&&(q!==0?(qr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),At=q,q=0):At=0);let Ot,Yt,Gt,te,ie,Kt,ue,ye,Ue;const Te=P.isCompressedTexture?P.mipmaps[At]:P.image;if(et!==null)Ot=et.max.x-et.min.x,Yt=et.max.y-et.min.y,Gt=et.isBox3?et.max.z-et.min.z:1,te=et.min.x,ie=et.min.y,Kt=et.isBox3?et.min.z:0;else{const Rn=Math.pow(2,-q);Ot=Math.floor(Te.width*Rn),Yt=Math.floor(Te.height*Rn),P.isDataArrayTexture?Gt=Te.depth:P.isData3DTexture?Gt=Math.floor(Te.depth*Rn):Gt=1,te=0,ie=0,Kt=0}st!==null?(ue=st.x,ye=st.y,Ue=st.z):(ue=0,ye=0,Ue=0);const be=Et.convert(X.format),jt=Et.convert(X.type);let Pe;X.isData3DTexture?(vt.setTexture3D(X,0),Pe=U.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(vt.setTexture2DArray(X,0),Pe=U.TEXTURE_2D_ARRAY):(vt.setTexture2D(X,0),Pe=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,X.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,X.unpackAlignment);const ge=U.getParameter(U.UNPACK_ROW_LENGTH),vn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Es=U.getParameter(U.UNPACK_SKIP_PIXELS),_n=U.getParameter(U.UNPACK_SKIP_ROWS),mr=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,Te.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Te.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,te),U.pixelStorei(U.UNPACK_SKIP_ROWS,ie),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Kt);const Ie=P.isDataArrayTexture||P.isData3DTexture,An=X.isDataArrayTexture||X.isData3DTexture;if(P.isDepthTexture){const Rn=dt.get(P),an=dt.get(X),fn=dt.get(Rn.__renderTarget),Fo=dt.get(an.__renderTarget);it.bindFramebuffer(U.READ_FRAMEBUFFER,fn.__webglFramebuffer),it.bindFramebuffer(U.DRAW_FRAMEBUFFER,Fo.__webglFramebuffer);for(let ns=0;ns<Gt;ns++)Ie&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,dt.get(P).__webglTexture,q,Kt+ns),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,dt.get(X).__webglTexture,At,Ue+ns)),U.blitFramebuffer(te,ie,Ot,Yt,ue,ye,Ot,Yt,U.DEPTH_BUFFER_BIT,U.NEAREST);it.bindFramebuffer(U.READ_FRAMEBUFFER,null),it.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(q!==0||P.isRenderTargetTexture||dt.has(P)){const Rn=dt.get(P),an=dt.get(X);it.bindFramebuffer(U.READ_FRAMEBUFFER,Wf),it.bindFramebuffer(U.DRAW_FRAMEBUFFER,Xf);for(let fn=0;fn<Gt;fn++)Ie?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Rn.__webglTexture,q,Kt+fn):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Rn.__webglTexture,q),An?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,an.__webglTexture,At,Ue+fn):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,an.__webglTexture,At),q!==0?U.blitFramebuffer(te,ie,Ot,Yt,ue,ye,Ot,Yt,U.COLOR_BUFFER_BIT,U.NEAREST):An?U.copyTexSubImage3D(Pe,At,ue,ye,Ue+fn,te,ie,Ot,Yt):U.copyTexSubImage2D(Pe,At,ue,ye,te,ie,Ot,Yt);it.bindFramebuffer(U.READ_FRAMEBUFFER,null),it.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else An?P.isDataTexture||P.isData3DTexture?U.texSubImage3D(Pe,At,ue,ye,Ue,Ot,Yt,Gt,be,jt,Te.data):X.isCompressedArrayTexture?U.compressedTexSubImage3D(Pe,At,ue,ye,Ue,Ot,Yt,Gt,be,Te.data):U.texSubImage3D(Pe,At,ue,ye,Ue,Ot,Yt,Gt,be,jt,Te):P.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,At,ue,ye,Ot,Yt,be,jt,Te.data):P.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,At,ue,ye,Te.width,Te.height,be,Te.data):U.texSubImage2D(U.TEXTURE_2D,At,ue,ye,Ot,Yt,be,jt,Te);U.pixelStorei(U.UNPACK_ROW_LENGTH,ge),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,vn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Es),U.pixelStorei(U.UNPACK_SKIP_ROWS,_n),U.pixelStorei(U.UNPACK_SKIP_IMAGES,mr),At===0&&X.generateMipmaps&&U.generateMipmap(Pe),it.unbindTexture()},this.initRenderTarget=function(P){dt.get(P).__webglFramebuffer===void 0&&vt.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?vt.setTextureCube(P,0):P.isData3DTexture?vt.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?vt.setTexture2DArray(P,0):vt.setTexture2D(P,0),it.unbindTexture()},this.resetState=function(){b=0,E=0,w=null,it.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}const Vv=.85,_l=i=>i*i*(3-2*i);function Ru(i,t=!1){const e=t?1:Math.max(0,Math.min(1,Number.isFinite(i)?i:0)),n=_l(Math.max(0,Math.min(1,(e-.5)/.5)));return{progress:e,phase:e<.22?"anticipation":e<.5?"silhouette":e<1?"detail":"ready",visible:e>=.22,silhouette:1-n,scale:.94+.06*_l(e),veil:.82+.14*_l(Math.min(1,e/.5)),ready:e===1}}const hf=[{x:-2.45,z:.45,scale:.53},{x:-3.04,z:-.42,scale:.36},{x:2.85,z:-2.7,scale:.43}];function uf(i,t,e){const n=(i*7+t*3+e*5)%11;return n===0||n===7||n===10?"lit":n===4?"open":n===8?"blind":n===2||n===3||n===6?"curtain":"reflection"}class fr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Wv=new ih(-1,1,1,-1,0,1);class Xv extends Ae{constructor(){super(),this.setAttribute("position",new he([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new he([0,2,0,0,2,0],2))}}const qv=new Xv;class rh{constructor(t){this._mesh=new Xt(qv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Wv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}const Fa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class df extends fr{constructor(){super(),this.uniforms=vs.clone(Fa.uniforms),this.material=new Yp({name:Fa.name,uniforms:this.uniforms,vertexShader:Fa.vertexShader,fragmentShader:Fa.fragmentShader}),this._fsQuad=new rh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},me.getTransfer(this._outputColorSpace)===_e&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===yd?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Sd?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===bd?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===zc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Td?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ed?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===wd&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const ni={camera:{rotation:[.1,-.28,0],lamp:32,rim:34},teacup:{rotation:[.28,-.24,0],lamp:8,rim:10},watch:{rotation:[.08,-.24,-.08],lamp:20,rim:22},cassette:{rotation:[.1,-.2,-.04],flat:!0,lamp:19,rim:20},duck:{rotation:[.1,-.34,0],lamp:8,rim:10},book:{rotation:[.07,-.3,-.04],flat:!0,lamp:34,rim:36},key:{rotation:[.08,-.24,-.12],lamp:34,rim:36},badge:{rotation:[.08,-.24,0],flat:!0,lamp:24,rim:25},record:{rotation:[.14,-.32,-.07],lamp:31,rim:24,lightPosition:[-1.7,.55,-1.6],flat:!0},perfume:{rotation:[.09,-.3,0],lamp:23,rim:25},horse:{rotation:[.08,-.3,0],lamp:24,rim:26},compass:{rotation:[.12,-.23,-.07],lamp:12,rim:13},bottle:{rotation:[.1,-.25,0],lamp:27,rim:29},can:{rotation:[.32,-.28,0],lamp:28,rim:29},cup:{rotation:[.18,-1.57,-.06],lamp:15,rim:15},box:{rotation:[.24,-.35,0],lamp:21,rim:22},lid:{rotation:[.15,-.28,0],flat:!0,lamp:21,rim:22},paper:{rotation:[.06,-.18,-.04],flat:!0,lamp:9,rim:9}},ho={min:.85,max:1.35};function Yv(i,t,e=0,n=0){if(t<=520&&i>650){const l=Math.min(360,Math.max(280,i*.34));return{x:28,y:80+e,width:i-l-64,height:Math.max(60,t-172-e-n)}}const s=i<=650,r=(s?244:270)+e,a=t-(s?300:270)-n,o=Math.min(i-(s?40:100),660);return{x:(i-o)/2,y:r,width:o,height:Math.max(70,a-r)}}function Cu(i,t,e,n,s=4.2,r){const a=r??(Number.isFinite(t.x)?t.x*2+t.width:t.width),o=t.x??(a-t.width)/2,l=t.y??(e-t.height)/2,c=2*s*Math.tan(n*Math.PI/360)/e,h=t.width*c*.5,u=t.height*c*.5,f=Math.max(i.x,.001),d=Math.max(i.y,.001),m=Math.max(Math.abs(o-a/2),Math.abs(o+t.width-a/2))*c,x=Math.max(Math.abs(l-e/2),Math.abs(l+t.height-e/2))*c;return .94*Math.min(h/(f+m*i.z/s),u/(d+x*i.z/s))}function $v(i,t){if(!ni[i])throw Error("unknown item");if(t==="front")return[...ni[i].rotation];const e={back:[0,Math.PI,0],top:[Math.PI/2,0,0],bottom:[-Math.PI/2,0,0],side:[0,Math.PI/2,0]};if(!e[t])throw Error("unknown pose");if(ni[i].flat&&(t==="top"||t==="bottom")){const[n,s,r]=ni[i].rotation;return[n+(t==="top"?.95:-.95),s,r]}return[...e[t]]}class Zv extends xc{constructor(){super();const t=new Jn;t.deleteAttribute("uv");const e=new Ct({side:rn}),n=new Ct,s=new co(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Xt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new hp(t,n,6),o=new He;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new Xt(t,Ys(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Xt(t,Ys(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Xt(t,Ys(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new Xt(t,Ys(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new Xt(t,Ys(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const d=new Xt(t,Ys(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Ys(i){return new Zp({color:0,emissive:16777215,emissiveIntensity:i})}function ff(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ae;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=i[f].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Pu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let x=0;x<a[h].length;++x)d.push(a[h][x][f]);const m=Pu(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Pu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Ce(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let f=0,d=h.count;f<d;f++)for(let m=0;m<e;m++){const x=h.getComponent(f,m);o.setComponent(f+u,m,x)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function xi(i=92){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function pe(i,t=512,e=t){const n=document.createElement("canvas");n.width=t,n.height=e,i(n.getContext("2d"),t,xi(),e);const s=new mp(n);return s.colorSpace=$e,s.anisotropy=8,s}function Tc(i,{bg:t="#ddd3b6",color:e="#273932",size:n=512,font:s=54,lines:r=null}={}){return pe((a,o)=>{t&&(a.fillStyle=t,a.fillRect(0,0,o,o)),a.fillStyle=e,a.textAlign="center",a.textBaseline="middle",a.font=`bold ${s}px Georgia`,(r||[i]).forEach((l,c,h)=>a.fillText(l,o/2,o/2+(c-(h.length-1)/2)*s*1.45,o*.87))},n)}function dn(i,t,e,n=xi(),s=450){for(let r=0;r<s;r++)i.fillStyle=n()>.45?"rgba(60,44,22,.09)":"rgba(246,238,209,.16)",i.fillRect(n()*t,n()*e,1+n()*3,.5+n()*2)}function Co(i){const t=pe((e,n,s)=>{if(e.fillStyle=i==="leather"?"#343938":i==="cloth"?"#8c8278":i==="paper"?"#e7dfc8":"#d0d0cb",e.fillRect(0,0,n,n),i==="leather")for(let r=0;r<9e3;r++){const a=s()*n,o=s()*n,l=.5+s()*2.2;e.fillStyle=s()>.5?"#454a48":"#232928",e.beginPath(),e.ellipse(a,o,l,l*.65,s()*6,0,Math.PI*2),e.fill(),e.strokeStyle="#525653",e.lineWidth=.2,e.stroke()}else if(i==="cloth")for(let r=0;r<n;r+=3)e.strokeStyle=r%2?"rgba(185,182,170,.20)":"rgba(101,104,94,.16)",e.lineWidth=.45,e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.moveTo(0,r),e.lineTo(n,r),e.stroke();else{for(let r=0;r<14e3;r++){const a=i==="paper"?"rgba(112,94,58,.07)":"rgba(28,33,32,.09)";e.fillStyle=a,e.fillRect(s()*n,s()*n,i==="metal"?s()*8+1:s()*2+1,.3+s()*.6)}if(i==="metal")for(let r=0;r<60;r++){const a=s()*n,o=s()*n;e.strokeStyle="rgba(52,57,49,.16)",e.lineWidth=.5,e.beginPath(),e.moveTo(a,o),e.lineTo(a+s()*15,o+s()*2),e.stroke()}}});return t.wrapS=t.wrapT=di,t}const pf=Co("paper"),mf=Co("leather"),Ir=Co("metal"),Iu=Co("cloth"),Lr=Ir.clone();Lr.colorSpace=mn;const Ec=mf.clone();Ec.colorSpace=mn;const to=pf.clone();to.colorSpace=mn;const Jv=pe((i,t,e)=>{i.fillStyle="#46382c",i.fillRect(0,0,t,t);for(let n=0;n<35;n++){const s=e()*t,r=e()*t,a=12+e()*85,o=i.createRadialGradient(s,r,0,s,r,a);o.addColorStop(0,n%2?"#6e4525":"#33382f"),o.addColorStop(1,"#46382c00"),i.fillStyle=o,i.fillRect(s-a,r-a,a*2,a*2)}for(let n=0;n<23e3;n++)i.fillStyle=["#59371f","#7a5a34","#3a3126","#86643c","#2c332c"][n%5],i.globalAlpha=.1,i.fillRect(e()*t,e()*t,1+e()*4,1+e()*3)}),O={black:new Ct({color:1646879,roughness:.42,metalness:.38,map:Ir,bumpMap:Lr,bumpScale:.004}),leather:new Ct({color:6712935,map:mf,roughness:.78,bumpMap:Ec,bumpScale:.01}),silver:new Ct({color:12239550,map:Ir,roughnessMap:Lr,roughness:.35,metalness:.93,bumpMap:Lr,bumpScale:.003}),gold:new Ct({color:12427627,map:Ir,roughness:.29,metalness:.88,bumpMap:Lr,bumpScale:.003}),bronze:new Ct({color:16777215,vertexColors:!0,roughness:.43,metalness:.83}),cream:new Ks({color:13223611,roughness:.22,envMapIntensity:.45,clearcoat:.6,clearcoatRoughness:.12,bumpMap:to,bumpScale:4e-4}),blue:new Ks({color:1194356,roughness:.24,clearcoat:1,clearcoatRoughness:.1}),glass:new Ks({color:13689532,roughness:.045,metalness:0,transmission:.96,thickness:.055,ior:1.48,attenuationColor:5672779,attenuationDistance:2.5,clearcoat:.4,envMapIntensity:.7}),clear:new Ct({color:12048095,roughness:.09,metalness:.03,transparent:!0,opacity:.055,depthWrite:!1,envMapIntensity:.18}),lens:new Ks({color:1322039,roughness:.055,metalness:.38,clearcoat:1,iridescence:.75,iridescenceIOR:1.3,iridescenceThicknessRange:[250,440]}),paper:new Ct({color:14799534,map:pf,roughness:.96,bumpMap:to,bumpScale:.006,side:Oe}),red:new Ct({color:7152936,map:Iu,roughness:.82,bumpMap:Iu,bumpScale:.009}),rust:new Ct({map:Jv,roughness:.92,metalness:.08,bumpMap:to,bumpScale:.022}),rubber:new Ct({color:1383192,roughness:.88,bumpMap:Ec,bumpScale:.008}),copper:new Ct({color:12089158,map:Ir,roughness:.37,metalness:.9})},Ml=new Map;let gf=[];function eo(i,{repeat:t=[1,1],data:e=!1}={}){const n=JSON.stringify([i,t,e]);if(Ml.has(n))return Ml.get(n);let s;gf.push(new Promise(a=>s=a));const r=new nf().load(`./assets/${i}`,()=>s(),void 0,()=>{console.warn(`Texture unavailable: ${i}`),s()});return r.colorSpace=e?mn:$e,r.wrapS=r.wrapT=di,r.repeat.set(...t),r.anisotropy=8,Ml.set(n,r),r}function Kv(){return Promise.all(gf)}function Lu(i,t=[1,1]){return{map:eo(`${i}.jpg`,{repeat:t}),normalMap:eo(`${i}-normal.png`,{repeat:t,data:!0}),roughnessMap:eo(`${i}-roughness.png`,{repeat:t,data:!0})}}function xf(){return pe((i,t,e)=>{const n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(25,33,22,0)"),n.addColorStop(.6,"rgba(28,35,24,.15)"),n.addColorStop(1,"rgba(21,32,21,.75)"),i.fillStyle=n,i.fillRect(0,0,t,t);for(let s=0;s<90;s++){const r=e()*t;i.fillStyle=`rgba(30,38,23,${e()*.09})`,i.fillRect(r,e()*t*.5,1+e()*6,t)}})}const no={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class jv extends fr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof hn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=vs.clone(t.uniforms),this.material=new hn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new rh(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Du extends fr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Qv extends fr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class t2{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new gt);this._width=n.width,this._height=n.height,e=new En(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:pi}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new jv(no),this.copyPass.material.blending=cn,this.clock=new sm}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Du!==void 0&&(a instanceof Du?n=!0:a instanceof Qv&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new gt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class e2 extends fr{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Zt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}class n2{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r;const a=.5*(Math.sqrt(3)-1),o=(t+e)*a,l=Math.floor(t+o),c=Math.floor(e+o),h=(3-Math.sqrt(3))/6,u=(l+c)*h,f=l-u,d=c-u,m=t-f,x=e-d;let g,p;m>x?(g=1,p=0):(g=0,p=1);const v=m-g+h,M=x-p+h,_=m-1+2*h,T=x-1+2*h,b=l&255,E=c&255,w=this.perm[b+this.perm[E]]%12,y=this.perm[b+g+this.perm[E+p]]%12,S=this.perm[b+1+this.perm[E+1]]%12;let R=.5-m*m-x*x;R<0?n=0:(R*=R,n=R*R*this._dot(this.grad3[w],m,x));let I=.5-v*v-M*M;I<0?s=0:(I*=I,s=I*I*this._dot(this.grad3[y],v,M));let C=.5-_*_-T*T;return C<0?r=0:(C*=C,r=C*C*this._dot(this.grad3[S],_,T)),70*(n+s+r)}noise3d(t,e,n){let s,r,a,o;const c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),u=Math.floor(e+c),f=Math.floor(n+c),d=1/6,m=(h+u+f)*d,x=h-m,g=u-m,p=f-m,v=t-x,M=e-g,_=n-p;let T,b,E,w,y,S;v>=M?M>=_?(T=1,b=0,E=0,w=1,y=1,S=0):v>=_?(T=1,b=0,E=0,w=1,y=0,S=1):(T=0,b=0,E=1,w=1,y=0,S=1):M<_?(T=0,b=0,E=1,w=0,y=1,S=1):v<_?(T=0,b=1,E=0,w=0,y=1,S=1):(T=0,b=1,E=0,w=1,y=1,S=0);const R=v-T+d,I=M-b+d,C=_-E+d,N=v-w+2*d,F=M-y+2*d,z=_-S+2*d,V=v-1+3*d,B=M-1+3*d,k=_-1+3*d,Y=h&255,nt=u&255,K=f&255,mt=this.perm[Y+this.perm[nt+this.perm[K]]]%12,It=this.perm[Y+T+this.perm[nt+b+this.perm[K+E]]]%12,Ut=this.perm[Y+w+this.perm[nt+y+this.perm[K+S]]]%12,$=this.perm[Y+1+this.perm[nt+1+this.perm[K+1]]]%12;let rt=.6-v*v-M*M-_*_;rt<0?s=0:(rt*=rt,s=rt*rt*this._dot3(this.grad3[mt],v,M,_));let _t=.6-R*R-I*I-C*C;_t<0?r=0:(_t*=_t,r=_t*_t*this._dot3(this.grad3[It],R,I,C));let Tt=.6-N*N-F*F-z*z;Tt<0?a=0:(Tt*=Tt,a=Tt*Tt*this._dot3(this.grad3[Ut],N,F,z));let wt=.6-V*V-B*B-k*k;return wt<0?o=0:(wt*=wt,o=wt*wt*this._dot3(this.grad3[$],V,B,k)),32*(s+r+a+o)}noise4d(t,e,n,s){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,u,f,d,m;const x=(t+e+n+s)*l,g=Math.floor(t+x),p=Math.floor(e+x),v=Math.floor(n+x),M=Math.floor(s+x),_=(g+p+v+M)*c,T=g-_,b=p-_,E=v-_,w=M-_,y=t-T,S=e-b,R=n-E,I=s-w,C=y>S?32:0,N=y>R?16:0,F=S>R?8:0,z=y>I?4:0,V=S>I?2:0,B=R>I?1:0,k=C+N+F+z+V+B,Y=a[k][0]>=3?1:0,nt=a[k][1]>=3?1:0,K=a[k][2]>=3?1:0,mt=a[k][3]>=3?1:0,It=a[k][0]>=2?1:0,Ut=a[k][1]>=2?1:0,$=a[k][2]>=2?1:0,rt=a[k][3]>=2?1:0,_t=a[k][0]>=1?1:0,Tt=a[k][1]>=1?1:0,wt=a[k][2]>=1?1:0,qt=a[k][3]>=1?1:0,Bt=y-Y+c,U=S-nt+c,tt=R-K+c,j=I-mt+c,ot=y-It+2*c,it=S-Ut+2*c,xt=R-$+2*c,dt=I-rt+2*c,vt=y-_t+3*c,Jt=S-Tt+3*c,$t=R-wt+3*c,D=I-qt+3*c,A=y-1+4*c,W=S-1+4*c,Q=R-1+4*c,ht=I-1+4*c,J=g&255,Ft=p&255,yt=v&255,Lt=M&255,kt=o[J+o[Ft+o[yt+o[Lt]]]]%32,St=o[J+Y+o[Ft+nt+o[yt+K+o[Lt+mt]]]]%32,at=o[J+It+o[Ft+Ut+o[yt+$+o[Lt+rt]]]]%32,bt=o[J+_t+o[Ft+Tt+o[yt+wt+o[Lt+qt]]]]%32,Et=o[J+1+o[Ft+1+o[yt+1+o[Lt+1]]]]%32;let pt=.6-y*y-S*S-R*R-I*I;pt<0?h=0:(pt*=pt,h=pt*pt*this._dot4(r[kt],y,S,R,I));let Wt=.6-Bt*Bt-U*U-tt*tt-j*j;Wt<0?u=0:(Wt*=Wt,u=Wt*Wt*this._dot4(r[St],Bt,U,tt,j));let H=.6-ot*ot-it*it-xt*xt-dt*dt;H<0?f=0:(H*=H,f=H*H*this._dot4(r[at],ot,it,xt,dt));let ut=.6-vt*vt-Jt*Jt-$t*$t-D*D;ut<0?d=0:(ut*=ut,d=ut*ut*this._dot4(r[bt],vt,Jt,$t,D));let ft=.6-A*A-W*W-Q*Q-ht*ht;return ft<0?m=0:(ft*=ft,m=ft*ft*this._dot4(r[Et],A,W,Q,ht)),27*(h+u+f+d+m)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}}const Oa={defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new gt},cameraProjectionMatrix:{value:new ne},cameraInverseProjectionMatrix:{value:new ne},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

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

		}`},za={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

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

		}`},Ba={uniforms:{tDiffuse:{value:null},resolution:{value:new gt}},vertexShader:`varying vec2 vUv;

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

		}`};class qi extends fr{constructor(t,e,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=e,this.scene=t,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();const a=new jc;a.format=rr,a.type=sr,this.normalRenderTarget=new En(this.width,this.height,{minFilter:un,magFilter:un,type:pi,depthTexture:a}),this.ssaoRenderTarget=new En(this.width,this.height,{type:pi}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new hn({defines:Object.assign({},Oa.defines),uniforms:vs.clone(Oa.uniforms),vertexShader:Oa.vertexShader,fragmentShader:Oa.fragmentShader,blending:cn}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new $p,this.normalMaterial.blending=cn,this.blurMaterial=new hn({defines:Object.assign({},Ba.defines),uniforms:vs.clone(Ba.uniforms),vertexShader:Ba.vertexShader,fragmentShader:Ba.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new hn({defines:Object.assign({},za.defines),uniforms:vs.clone(za.uniforms),vertexShader:za.vertexShader,fragmentShader:za.fragmentShader,blending:cn}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new hn({uniforms:vs.clone(no.uniforms),vertexShader:no.vertexShader,fragmentShader:no.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Md,blendDst:Cl,blendEquation:Ii,blendSrcAlpha:_d,blendDstAlpha:Cl,blendEquationAlpha:Ii}),this._fsQuad=new rh(null),this._originalClearColor=new Zt}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(t,e,n){switch(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(t,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(t,this.blurMaterial,this.blurRenderTarget),this.output){case qi.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=cn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case qi.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=cn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case qi.OUTPUT.Depth:this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case qi.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=cn,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case qi.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=vd,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(t,e){this.width=t,this.height=e,this.ssaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.blurRenderTarget.setSize(t,e),this.ssaoMaterial.uniforms.resolution.value.set(t,e),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(t,e)}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);const a=t.getClearAlpha(),o=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=o,t.setClearColor(this._originalClearColor),t.setClearAlpha(a)}_generateSampleKernel(t){const e=this.kernel;for(let n=0;n<t;n++){const s=new L;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/t;r=Vt.lerp(.1,1,r*r),s.multiplyScalar(r),e.push(s)}}_generateRandomKernelRotations(){const n=new n2,s=16,r=new Float32Array(s);for(let a=0;a<s;a++){const o=Math.random()*2-1,l=Math.random()*2-1,c=0;r[a]=n.noise3d(o,l,c)}this.noiseTexture=new Jc(r,4,4,So,Yn),this.noiseTexture.wrapS=di,this.noiseTexture.wrapT=di,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){const t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){const t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}}qi.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};class i2 extends qi{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(t=>{t.isMesh&&t.visible&&(t.material.transparent||t.material.transmission>.1)&&(t.visible=!1,this._visibilityCache.push(t))})}}class s2{constructor(t,e,n,{samples:s=4}={}){this.renderer=t,this.scene=e,this.camera=n,this.low=!1;const r=new En(1,1,{type:pi,samples:Math.min(s,t.capabilities.maxSamples)});this.composer=new t2(t,r),this.composer.addPass(new e2(e,n)),this.ao=new i2(e,n,1,1,9),this.ao.kernelRadius=.32,this.ao.minDistance=25e-5,this.ao.maxDistance=.035,this.composer.addPass(this.ao),this.composer.addPass(new df),t.info.autoReset=!1}resize(t,e,n){this.composer.setPixelRatio(n),this.composer.setSize(t,e),this.ao.setSize(Math.round(t*n*.55),Math.round(e*n*.55))}render(){this.renderer.info.reset(),this.low?this.renderer.render(this.scene,this.camera):this.composer.render()}}function r2(i,t,e,n){if(i==="box"){const s=Math.exp(-((t-.5)**2*13+(e+.38)**2*12+(n-.35)**2*8));t-=.055*s,e+=.034*s,n-=.05*s}else if(i==="can"){const s=Math.atan2(n,t),r=.14*Math.exp(-(((e+.05)*4)**2)-((s-1.2)*2)**2);t*=1-r,n*=1-r}else if(i==="cup"){const s=Math.atan2(n,t),r=Math.max(0,(e-.26)/.2)*Math.exp(-(((s-1.25)*2)**2));t*=1-.12*r,n*=1-.12*r,e-=.018*r}else if(i==="paper"){const s=(Math.abs(t+.08)-.08)*.21,r=Math.max(0,(t-.32)/.3)*Math.max(0,(e-.43)/.32);n+=s+.085*r+.006*Math.sin(e*13),t-=.05*r,e-=.036*r}return[t,e,n]}const Er=new L;function Pn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Er.copy(t),Er[n]=0,Er.normalize();const c=.5*a/(a+o),h=1-Er.angleTo(i)/l;return Math.sign(Er[e])===1?h*c:o/(a+o)+c+c*(1-h)}class ah extends Jn{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new L,c=new L,h=new L(t,e,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,m=u.length/6,x=new L,g=.5/a;for(let p=0,v=0;p<u.length;p+=3,v+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,f[p+0]=c.x,f[p+1]=c.y,f[p+2]=c.z,Math.floor(p/m)){case 0:x.set(1,0,0),d[v+0]=Pn(x,c,"z","y",r,n),d[v+1]=1-Pn(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),d[v+0]=1-Pn(x,c,"z","y",r,n),d[v+1]=1-Pn(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),d[v+0]=1-Pn(x,c,"x","z",r,t),d[v+1]=Pn(x,c,"z","x",r,n);break;case 3:x.set(0,-1,0),d[v+0]=1-Pn(x,c,"x","z",r,t),d[v+1]=1-Pn(x,c,"z","x",r,n);break;case 4:x.set(0,0,1),d[v+0]=1-Pn(x,c,"x","y",r,t),d[v+1]=1-Pn(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),d[v+0]=Pn(x,c,"x","y",r,t),d[v+1]=1-Pn(x,c,"y","x",r,e);break}}static fromJSON(t){return new ah(t.width,t.height,t.depth,t.segments,t.radius)}}class a2 extends Xt{constructor(t,e,n=!1,s=!1,r=1e4){const a=new Ae;super(a,e),this.isMarchingCubes=!0;const o=this,l=new Float32Array(36),c=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(v){this.resolution=v,this.isolation=80,this.size=v,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const M=r*3;this.positionArray=new Float32Array(M*3);const _=new Ce(this.positionArray,3);_.setUsage(ra),a.setAttribute("position",_),this.normalArray=new Float32Array(M*3);const T=new Ce(this.normalArray,3);if(T.setUsage(ra),a.setAttribute("normal",T),this.enableUvs){this.uvArray=new Float32Array(M*2);const b=new Ce(this.uvArray,2);b.setUsage(ra),a.setAttribute("uv",b)}if(this.enableColors){this.colorArray=new Float32Array(M*3);const b=new Ce(this.colorArray,3);b.setUsage(ra),a.setAttribute("color",b)}a.boundingSphere=new Ts(new L,1)};function u(v,M,_){return v+(M-v)*_}function f(v,M,_,T,b,E,w,y,S,R){const I=(_-w)/(y-w),C=o.normal_cache;l[M+0]=T+I*o.delta,l[M+1]=b,l[M+2]=E,c[M+0]=u(C[v+0],C[v+3],I),c[M+1]=u(C[v+1],C[v+4],I),c[M+2]=u(C[v+2],C[v+5],I),h[M+0]=u(o.palette[S*3+0],o.palette[R*3+0],I),h[M+1]=u(o.palette[S*3+1],o.palette[R*3+1],I),h[M+2]=u(o.palette[S*3+2],o.palette[R*3+2],I)}function d(v,M,_,T,b,E,w,y,S,R){const I=(_-w)/(y-w),C=o.normal_cache;l[M+0]=T,l[M+1]=b+I*o.delta,l[M+2]=E;const N=v+o.yd*3;c[M+0]=u(C[v+0],C[N+0],I),c[M+1]=u(C[v+1],C[N+1],I),c[M+2]=u(C[v+2],C[N+2],I),h[M+0]=u(o.palette[S*3+0],o.palette[R*3+0],I),h[M+1]=u(o.palette[S*3+1],o.palette[R*3+1],I),h[M+2]=u(o.palette[S*3+2],o.palette[R*3+2],I)}function m(v,M,_,T,b,E,w,y,S,R){const I=(_-w)/(y-w),C=o.normal_cache;l[M+0]=T,l[M+1]=b,l[M+2]=E+I*o.delta;const N=v+o.zd*3;c[M+0]=u(C[v+0],C[N+0],I),c[M+1]=u(C[v+1],C[N+1],I),c[M+2]=u(C[v+2],C[N+2],I),h[M+0]=u(o.palette[S*3+0],o.palette[R*3+0],I),h[M+1]=u(o.palette[S*3+1],o.palette[R*3+1],I),h[M+2]=u(o.palette[S*3+2],o.palette[R*3+2],I)}function x(v){const M=v*3;o.normal_cache[M]===0&&(o.normal_cache[M+0]=o.field[v-1]-o.field[v+1],o.normal_cache[M+1]=o.field[v-o.yd]-o.field[v+o.yd],o.normal_cache[M+2]=o.field[v-o.zd]-o.field[v+o.zd])}function g(v,M,_,T,b){const E=T+1,w=T+o.yd,y=T+o.zd,S=E+o.yd,R=E+o.zd,I=T+o.yd+o.zd,C=E+o.yd+o.zd;let N=0;const F=o.field[T],z=o.field[E],V=o.field[w],B=o.field[S],k=o.field[y],Y=o.field[R],nt=o.field[I],K=o.field[C];F<b&&(N|=1),z<b&&(N|=2),V<b&&(N|=8),B<b&&(N|=4),k<b&&(N|=16),Y<b&&(N|=32),nt<b&&(N|=128),K<b&&(N|=64);const mt=o2[N];if(mt===0)return 0;const It=o.delta,Ut=v+It,$=M+It,rt=_+It;mt&1&&(x(T),x(E),f(T*3,0,b,v,M,_,F,z,T,E)),mt&2&&(x(E),x(S),d(E*3,3,b,Ut,M,_,z,B,E,S)),mt&4&&(x(w),x(S),f(w*3,6,b,v,$,_,V,B,w,S)),mt&8&&(x(T),x(w),d(T*3,9,b,v,M,_,F,V,T,w)),mt&16&&(x(y),x(R),f(y*3,12,b,v,M,rt,k,Y,y,R)),mt&32&&(x(R),x(C),d(R*3,15,b,Ut,M,rt,Y,K,R,C)),mt&64&&(x(I),x(C),f(I*3,18,b,v,$,rt,nt,K,I,C)),mt&128&&(x(y),x(I),d(y*3,21,b,v,M,rt,k,nt,y,I)),mt&256&&(x(T),x(y),m(T*3,24,b,v,M,_,F,k,T,y)),mt&512&&(x(E),x(R),m(E*3,27,b,Ut,M,_,z,Y,E,R)),mt&1024&&(x(S),x(C),m(S*3,30,b,Ut,$,_,B,K,S,C)),mt&2048&&(x(w),x(I),m(w*3,33,b,v,$,_,V,nt,w,I)),N<<=4;let _t,Tt,wt,qt=0,Bt=0;for(;ka[N+Bt]!=-1;)_t=N+Bt,Tt=_t+1,wt=_t+2,p(l,c,h,3*ka[_t],3*ka[Tt],3*ka[wt]),Bt+=3,qt++;return qt}function p(v,M,_,T,b,E){const w=o.count*3;if(o.positionArray[w+0]=v[T],o.positionArray[w+1]=v[T+1],o.positionArray[w+2]=v[T+2],o.positionArray[w+3]=v[b],o.positionArray[w+4]=v[b+1],o.positionArray[w+5]=v[b+2],o.positionArray[w+6]=v[E],o.positionArray[w+7]=v[E+1],o.positionArray[w+8]=v[E+2],o.material.flatShading===!0){const y=(M[T+0]+M[b+0]+M[E+0])/3,S=(M[T+1]+M[b+1]+M[E+1])/3,R=(M[T+2]+M[b+2]+M[E+2])/3;o.normalArray[w+0]=y,o.normalArray[w+1]=S,o.normalArray[w+2]=R,o.normalArray[w+3]=y,o.normalArray[w+4]=S,o.normalArray[w+5]=R,o.normalArray[w+6]=y,o.normalArray[w+7]=S,o.normalArray[w+8]=R}else o.normalArray[w+0]=M[T+0],o.normalArray[w+1]=M[T+1],o.normalArray[w+2]=M[T+2],o.normalArray[w+3]=M[b+0],o.normalArray[w+4]=M[b+1],o.normalArray[w+5]=M[b+2],o.normalArray[w+6]=M[E+0],o.normalArray[w+7]=M[E+1],o.normalArray[w+8]=M[E+2];if(o.enableUvs){const y=o.count*2;o.uvArray[y+0]=v[T+0],o.uvArray[y+1]=v[T+2],o.uvArray[y+2]=v[b+0],o.uvArray[y+3]=v[b+2],o.uvArray[y+4]=v[E+0],o.uvArray[y+5]=v[E+2]}o.enableColors&&(o.colorArray[w+0]=_[T+0],o.colorArray[w+1]=_[T+1],o.colorArray[w+2]=_[T+2],o.colorArray[w+3]=_[b+0],o.colorArray[w+4]=_[b+1],o.colorArray[w+5]=_[b+2],o.colorArray[w+6]=_[E+0],o.colorArray[w+7]=_[E+1],o.colorArray[w+8]=_[E+2]),o.count+=3}this.addBall=function(v,M,_,T,b,E){const w=Math.sign(T);T=Math.abs(T);const y=E!=null;let S=new Zt(v,M,_);if(y)try{S=E instanceof Zt?E:Array.isArray(E)?new Zt(Math.min(Math.abs(E[0]),1),Math.min(Math.abs(E[1]),1),Math.min(Math.abs(E[2]),1)):new Zt(E)}catch{S=new Zt(v,M,_)}const R=this.size*Math.sqrt(T/b),I=_*this.size,C=M*this.size,N=v*this.size;let F=Math.floor(I-R);F<1&&(F=1);let z=Math.floor(I+R);z>this.size-1&&(z=this.size-1);let V=Math.floor(C-R);V<1&&(V=1);let B=Math.floor(C+R);B>this.size-1&&(B=this.size-1);let k=Math.floor(N-R);k<1&&(k=1);let Y=Math.floor(N+R);Y>this.size-1&&(Y=this.size-1);let nt,K,mt,It,Ut,$,rt,_t,Tt,wt,qt;for(mt=F;mt<z;mt++)for(Ut=this.size2*mt,_t=mt/this.size-_,Tt=_t*_t,K=V;K<B;K++)for(It=Ut+this.size*K,rt=K/this.size-M,wt=rt*rt,nt=k;nt<Y;nt++)if($=nt/this.size-v,qt=T/(1e-6+$*$+wt+Tt)-b,qt>0){this.field[It+nt]+=qt*w;const Bt=Math.sqrt((nt-N)*(nt-N)+(K-C)*(K-C)+(mt-I)*(mt-I))/R,U=1-Bt*Bt*Bt*(Bt*(Bt*6-15)+10);this.palette[(It+nt)*3+0]+=S.r*U,this.palette[(It+nt)*3+1]+=S.g*U,this.palette[(It+nt)*3+2]+=S.b*U}},this.addPlaneX=function(v,M){const _=this.size,T=this.yd,b=this.zd,E=this.field;let w,y,S,R,I,C,N,F=_*Math.sqrt(v/M);for(F>_&&(F=_),w=0;w<F;w++)if(C=w/_,R=C*C,I=v/(1e-4+R)-M,I>0)for(y=0;y<_;y++)for(N=w+y*T,S=0;S<_;S++)E[b*S+N]+=I},this.addPlaneY=function(v,M){const _=this.size,T=this.yd,b=this.zd,E=this.field;let w,y,S,R,I,C,N,F,z=_*Math.sqrt(v/M);for(z>_&&(z=_),y=0;y<z;y++)if(C=y/_,R=C*C,I=v/(1e-4+R)-M,I>0)for(N=y*T,w=0;w<_;w++)for(F=N+w,S=0;S<_;S++)E[b*S+F]+=I},this.addPlaneZ=function(v,M){const _=this.size,T=this.yd,b=this.zd,E=this.field;let w,y,S,R,I,C,N,F,z=_*Math.sqrt(v/M);for(z>_&&(z=_),S=0;S<z;S++)if(C=S/_,R=C*C,I=v/(1e-4+R)-M,I>0)for(N=b*S,y=0;y<_;y++)for(F=N+y*T,w=0;w<_;w++)E[F+w]+=I},this.setCell=function(v,M,_,T){const b=this.size2*_+this.size*M+v;this.field[b]=T},this.getCell=function(v,M,_){const T=this.size2*_+this.size*M+v;return this.field[T]},this.blur=function(v=1){const M=this.field,_=M.slice(),T=this.size,b=this.size2;for(let E=0;E<T;E++)for(let w=0;w<T;w++)for(let y=0;y<T;y++){const S=b*y+T*w+E;let R=_[S],I=1;for(let C=-1;C<=1;C+=2){const N=C+E;if(!(N<0||N>=T))for(let F=-1;F<=1;F+=2){const z=F+w;if(!(z<0||z>=T))for(let V=-1;V<=1;V+=2){const B=V+y;if(B<0||B>=T)continue;const k=b*B+T*z+N,Y=_[k];I++,R+=v*(Y-R)/I}}}M[S]=R}},this.reset=function(){for(let v=0;v<this.size3;v++)this.normal_cache[v*3]=0,this.field[v]=0,this.palette[v*3]=this.palette[v*3+1]=this.palette[v*3+2]=0},this.update=function(){this.count=0;const v=this.size-2;for(let M=1;M<v;M++){const _=this.size2*M,T=(M-this.halfsize)/this.halfsize;for(let b=1;b<v;b++){const E=_+this.size*b,w=(b-this.halfsize)/this.halfsize;for(let y=1;y<v;y++){const S=(y-this.halfsize)/this.halfsize,R=E+y;g(S,w,T,R,this.isolation)}}}this.geometry.setDrawRange(0,this.count),a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const o2=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),ka=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function vf(i,t,e=44){const n=new a2(e,t,!0,!1,14e3);n.isolation=0;for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let l=0;l<e;l++){const c=l/e*2-1,h=o/e*2-1,u=a/e*2-1;let f=10;for(const[d,m,x,g,p,v,M=0]of i){const _=Math.cos(M),T=Math.sin(M),b=c-d,E=h-m,w=u-x,y=_*b+T*E,S=-T*b+_*E,R=Math.hypot(y/g,S/p,w/v),I=Math.hypot(y/(g*g),S/(p*p),w/(v*v)),C=I>1e-6?R*(R-1)/I:-Math.min(g,p,v),N=.085,F=Math.max(N-Math.abs(f-C),0)/N;f=Math.min(f,C)-F*F*F*N/6}n.field[a*e*e+o*e+l]=-f}n.update();const s=n.geometry.drawRange.count,r=new Ae;for(const a of["position","normal","uv"]){const o=n.geometry.getAttribute(a);r.setAttribute(a,new Ce(o.array.slice(0,s*o.itemSize),o.itemSize))}return n.geometry.dispose(),r.computeBoundingSphere(),r}const Qe=Math.PI*2;let oh=1;function Uu(i){oh=Math.max(.24,Math.min(1,i))||1}const jr=(i,t=4)=>Math.max(t,Math.round(i*oh));function Nt(i,t,e,n=[0,0,0],s=[0,0,0]){const r=new Xt(i,t);return r.position.set(...n),r.rotation.set(...s),r.castShadow=!t.transparent&&!t.transmission,r.receiveShadow=!0,e.add(r),r}function G(i,t,e,n=O.black,s=.025,r=[0,0,0]){const a=Math.min(s,Math.min(...t)*.48);return Nt(s?new ah(...t,oh<.8?1:2,a):new Jn(...t),n,i,e,r)}function zt(i,t,e,n,s,r=O.silver,a=[Math.PI/2,0,0],o=48){return Nt(new Fe(t,e,n,jr(o,6)),r,i,s,a)}function ji(i,t,e,n=O.cream){const s=Nt(new ur(1,jr(32,8),jr(24,6)),n,i,e);return s.scale.set(...t),s}function we(i,t,e,n,s=O.gold,r=[0,0,0],a=Qe){return Nt(new ci(t,e,jr(8,4),jr(64,8),a),s,i,n,r)}function Fn(i,t,e,n=O.gold,s=30){return Nt(new Tn(new Ni(t.map(r=>new L(...r))),s,e,8,!1),n,i)}function ws(i,t,e,n=[0,0,0],s=64){return Nt(new Eo(t.map(r=>new gt(...r)),s),e,i,n)}function uo(i,t,e,n,s=.022,r=O.silver){zt(i,s,s,s*.35,[t,e,n],r,void 0,16),G(i,[s*1.3,s*.18,.0015],[t,e,n+s*.2],O.black,.001,[0,0,(t+e)*7])}function Zn(i,t,e,n,s,r=[0,0,0]){const o=Math.max(64,Math.min(1024,Math.round(768*e/t))),l=pe((c,h,u)=>s(c,h,o,u),768,o);return Nt(new fe(t,e),new Ct({map:l,transparent:!0,depthWrite:!1,roughness:.76,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),i,n,r)}function Je(i,t,e,n,s,r="#d4d1bd",a=[0,0,0],o=null){return Zn(i,e,n,s,(l,c,h)=>{o&&(l.fillStyle=o,l.fillRect(0,0,c,h)),l.fillStyle=r,l.textAlign="center",l.textBaseline="middle",l.font=`${h*.6}px Georgia`,l.fillText(t,c/2,h/2,c*.94)},a)}function Po(i,t,e,n){const s=pe((r,a,o)=>n(r,a,o),1024);return Nt(new ts(t,80),new Ke({map:s,toneMapped:!1}),i,[0,0,e])}function lh(i,t,e,n,s=O.clear){const r=Nt(new ur(1,48,20,0,Qe,0,Math.PI/2),s,i,n,[Math.PI/2,0,0]);return r.scale.set(t,e,t),r}function fo(i,t,e,n,s=48,r=O.silver,a="z"){for(let o=0;o<s;o++){const l=o*Qe/s;a==="z"?G(i,[.009,.022,e],[n[0]+Math.sin(l)*t,n[1]+Math.cos(l)*t,n[2]],r,.002,[0,0,-l]):G(i,[.009,e,.022],[n[0]+Math.sin(l)*t,n[1],n[2]+Math.cos(l)*t],r,.002,[0,l,0])}}function cr(i,t,e,n,s=[0,0,0],r=[0,0,0],a=.01){return Nt(new wo(t,{depth:e,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:a,bevelThickness:a,curveSegments:20}),n,i,s,r)}function Nu(i,t,e,n=512,s=0,r="#dbd6bd",a=28){i.save(),i.translate(n,n),i.fillStyle=r,i.font=`${a}px Arial`,i.textAlign="center",i.textBaseline="middle",[...t].forEach((o,l)=>{const c=s+(l-(t.length-1)/2)*.075;i.save(),i.rotate(c),i.fillText(o,0,-e),i.restore()}),i.restore()}function l2(i){G(i,[1.65,.92,.49],[0,0,0],O.black,.07),G(i,[1.57,.81,.016],[0,-.015,.253],O.leather,.024),G(i,[1.63,.245,.52],[0,.448,0],O.silver,.035),G(i,[1.63,.105,.51],[0,-.48,0],O.silver,.02),G(i,[1.57,.77,.018],[0,-.015,-.257],O.leather,.025),G(i,[1.62,.82,.035],[0,-.015,-.256],O.black,.035),G(i,[1.49,.7,.02],[0,-.01,-.282],O.leather,.023),Je(i,"СМЕНА",.52,.13,[.43,.455,.265],"#28322e"),Je(i,"8М",.18,.1,[-.55,-.11,.269]),Je(i,"СДЕЛАНО В СССР",.66,.065,[.15,-.405,-.281],"#c0bdb0",[0,Math.PI,0]),Je(i,"ЛОМО   7419082",.62,.065,[.1,-.465,.264],"#333f39");const t=new re;t.position.set(.12,-.045,0),i.add(t),zt(t,.36,.39,.18,[0,0,.34],O.black),zt(t,.325,.345,.13,[0,0,.466],O.silver),zt(t,.293,.293,.21,[0,0,.575],O.black),fo(t,.296,.12,[0,0,.56],56,O.rubber),we(t,.29,.012,[0,0,.682],O.silver),zt(t,.272,.272,.025,[0,0,.688],O.black),Po(t,.27,.706,(n,s)=>{n.fillStyle="#171d1a",n.fillRect(0,0,s,s),Nu(n,"ТРИПЛЕТ 43 • 4/40",420),Nu(n,"ЛОМО • 52 мм",417,Math.PI,"#babdaa",23)}),zt(t,.204,.204,.025,[0,0,.717],O.black);for(let n=0;n<7;n++){const s=n*Qe/7,r=new zi;r.moveTo(.02,.035),r.lineTo(.06,.17),r.lineTo(-.075,.16),r.lineTo(-.03,.06),r.closePath(),Nt(new Ao(r),O.rubber,t,[0,0,.733],[0,0,s])}zt(t,.082,.082,.006,[0,0,.74],O.black),lh(t,.196,.028,[0,0,.748],O.clear),we(t,.204,.006,[0,0,.736],O.silver),Zn(i,.63,.055,[.12,-.351,.498],(n,s,r)=>{n.fillStyle="#252b26",n.fillRect(0,0,s,r),n.fillStyle="#d0c9ac",n.font=`${r*.64}px Arial`,n.fillText("4   5,6   8   11   16",15,r*.7)}),G(i,[.292,.177,.047],[-.49,.444,.282],O.black,.025),G(i,[.2,.105,.016],[-.49,.444,.309],O.lens,.009),G(i,[.21,.13,.035],[-.49,.447,-.28],O.black,.012),G(i,[.155,.08,.012],[-.49,.447,-.305],O.lens,.005);for(const n of[-.7,.72])uo(i,n,.452,.269,.021);for(const n of[-.65,.65])uo(i,n,-.32,-.3,.018);zt(i,.161,.17,.105,[-.53,.625,0],O.silver,[0,0,0]),fo(i,.161,.067,[-.53,.63,0],38,O.silver,"y"),zt(i,.11,.12,.072,[.53,.603,0],O.black,[0,0,0]),zt(i,.059,.065,.075,[.53,.67,0],O.silver,[0,0,0]),G(i,[.27,.024,.23],[.02,.584,0],O.black,.006);for(const n of[-.14,.14])G(i,[.035,.04,.25],[n,.6,0],O.silver,.007);zt(i,.036,.036,.015,[0,-.535,0],O.gold,[0,0,0]);for(const n of[-.79,.79])we(i,.055,.012,[n,.14,0],O.silver,[0,Math.PI/2,0]);const e=Fn(i,[[-.8,.14,0],[-.94,-.34,0],[-.6,-.68,.03],[.28,-.76,.02],[.82,-.52,0],[.8,.14,0]],.022,O.leather,50);e.scale.z=.4}function c2(i){const t=[[0,-.53],[.24,-.53],[.27,-.5],[.27,-.45],[.31,-.43],[.37,-.34],[.43,-.18],[.49,.08],[.53,.33],[.53,.38],[.508,.38],[.495,.31],[.454,.08],[.397,-.17],[.33,-.34],[.23,-.416],[0,-.416]];ws(i,t,O.cream),we(i,.531,.007,[0,.377,0],O.gold,[Math.PI/2,0,0]),we(i,.272,.006,[0,-.489,0],O.gold,[Math.PI/2,0,0]),Fn(i,[[.49,.23,0],[.72,.25,0],[.81,.08,0],[.73,-.19,0],[.412,-.25,0]],.036,O.cream),Fn(i,[[.5,.25,.025],[.72,.27,.025],[.815,.075,.025],[.72,-.21,.025],[.412,-.26,.025]],.004,O.gold);const e=pe((s,r)=>{s.strokeStyle="#143b85",s.lineWidth=5;for(let a=-2;a<21;a++)for(const o of[-1,1])s.beginPath(),s.moveTo(a*r/18-o*r*.035,r),s.lineTo(a*r/18+o*r*.035,0),s.stroke();s.fillStyle="#b38d40";for(let a=0;a<18;a++)s.beginPath(),s.arc(a*r/18,r*.5,3.6,0,Qe),s.fill()},1024),n=new Ct({map:e,transparent:!0,depthWrite:!1,roughness:.55,envMapIntensity:.2,polygonOffset:!0,polygonOffsetFactor:-1});ws(i,t.slice(4,10).map(([s,r])=>[s+.0018,r]),n),Je(i,"ЛФЗ",.19,.08,[0,-.535,0],"#244786",[Math.PI/2,0,0])}function h2(i){const t=new Ct({map:O.leather.map,color:7754307,roughness:.84,bumpMap:O.leather.bumpMap,bumpScale:.01});G(i,[.41,2.25,.095],[0,0,-.05],t,.04);for(const s of[-.157,.157])for(let r=-1;r<1.09;r+=.062)G(i,[.008,.023,.004],[s,r,.001],O.paper,.001);for(let s=-.99;s<-.46;s+=.105)zt(i,.019,.019,.004,[0,s,.004],O.black,void 0,16);for(const s of[-.44,.44])for(const r of[-.19,.19])G(i,[.1,.18,.13],[r,s,.035],O.silver,.023,[0,0,r*s]);zt(i,.415,.438,.135,[0,0,.066],O.silver),we(i,.394,.027,[0,0,.143],O.silver),Po(i,.37,.159,(s,r,a)=>{s.fillStyle="#e8dfc8",s.fillRect(0,0,r,r),s.translate(r/2,r/2);for(let o=0;o<60;o++)s.save(),s.rotate(o*Qe/60),s.fillStyle="#363f35",s.fillRect(-2,-465,4,o%5?20:42),s.restore();s.fillStyle="#394237",s.textAlign="center",s.textBaseline="middle",s.font="82px Georgia";for(let o=1;o<=12;o++){const l=o*Qe/12;s.fillText(String(o),Math.sin(l)*365,-Math.cos(l)*365)}s.font="italic 66px Georgia",s.fillText("Ракета",0,-165),s.font="21px Arial",s.fillText("СДЕЛАНО В СССР",0,246),s.font="25px Arial",s.fillText("16 КАМНЕЙ",0,188),s.translate(-r/2,-r/2),dn(s,r,r,a,1700)}),G(i,[.019,.244,.009],[-.038,.102,.18],O.black,.003,[0,0,.36]),G(i,[.012,.31,.008],[.105,.067,.19],O.black,.002,[0,0,-1]),G(i,[.004,.45,.003],[-.09,-.012,.201],O.copper,.001,[0,0,1.71]),zt(i,.018,.02,.015,[0,0,.205],O.gold),lh(i,.371,.018,[0,0,.211]),zt(i,.056,.057,.1,[.468,0,.04],O.silver,[0,0,Math.PI/2],32);for(let s=0;s<18;s++){let r=s*Qe/18;G(i,[.1,.008,.008],[.468,Math.cos(r)*.056,.04+Math.sin(r)*.056],O.silver,.001,[r,0,0])}const e=new zi;e.moveTo(-.22,-.12),e.lineTo(.22,-.12),e.lineTo(.22,.12),e.lineTo(-.22,.12),e.closePath();const n=new lo;n.moveTo(-.16,-.07),n.lineTo(-.16,.07),n.lineTo(.16,.07),n.lineTo(.16,-.07),e.holes.push(n),cr(i,e,.025,O.silver,[0,1,.02]),G(i,[.02,.23,.018],[0,1,.065],O.silver,.003),zt(i,.392,.392,.02,[0,0,-.104],O.silver),Je(i,"ПЕТРОДВОРЕЦ • 2609",.53,.05,[0,.07,-.118],"#4d594d",[0,Math.PI,0]),Je(i,"СДЕЛАНО В СССР",.45,.045,[0,-.07,-.118],"#4d594d",[0,Math.PI,0]);for(let s=0;s<4;s++){const r=s*Math.PI/2+.75;uo(i,Math.sin(r)*.31,Math.cos(r)*.31,-.12,.014)}i.updateMatrixWorld(!0),i.traverse(s=>{if(!s.isMesh)return;const r=s.geometry.attributes.position,a=s.matrixWorld.clone().invert();for(let o=0;o<r.count;o++){const l=new L().fromBufferAttribute(r,o).applyMatrix4(s.matrixWorld);Math.abs(l.y)>.43&&(l.y=Math.sign(l.y)*(.43+(Math.abs(l.y)-.43)*.72)),l.z-=.18*l.y*l.y,l.applyMatrix4(a),r.setXYZ(o,l.x,l.y,l.z)}s.geometry.computeVertexNormals()})}function u2(i){G(i,[1.6,1,.166],[0,0,0],O.black,.07),G(i,[1.46,.77,.026],[0,.075,.092],O.rubber,.04),Zn(i,1.37,.55,[0,.13,.11],(t,e,n,s)=>{t.fillStyle="#d5c9a3",t.beginPath(),t.roundRect(0,0,e,n,22),t.fill(),t.fillStyle="#6f4136",t.fillRect(0,n*.7,e,n*.055),t.font=`italic ${n*.16}px Georgia`,t.fillStyle="#334858",t.fillText("Белые ночи",e*.12,n*.26),t.font=`${n*.07}px Arial`,t.fillText("ЛЕТО 1991     •     ДОМАШНЯЯ ЗАПИСЬ",e*.12,n*.43),t.font=`bold ${n*.13}px Arial`,t.fillText("A",e*.025,n*.27),t.fillText("60",e*.87,n*.27),dn(t,e,n,s,1200)}),G(i,[1.07,.276,.012],[0,-.044,.121],O.black,.04);for(const t of[-.405,.405]){zt(i,.176,.176,.018,[t,-.038,.132],O.rust),zt(i,.112,.112,.023,[t,-.038,.146],O.paper),zt(i,.063,.063,.027,[t,-.038,.152],O.black);for(let e=0;e<6;e++){const n=e*Qe/6;G(i,[.022,.043,.01],[t+Math.sin(n)*.067,-.038+Math.cos(n)*.067,.172],O.paper,.002,[0,0,-n])}for(const e of[.135,.147,.16])we(i,e,.002,[t,-.038,.147],O.black)}for(let t=-.2;t<.23;t+=.043)G(i,[.012,.08,.008],[t,-.04,.137],O.silver,.001);G(i,[1.16,.205,.035],[0,-.374,.105],O.black,.025);for(const t of[-.71,.71])for(const e of[-.396,.406])uo(i,t,e,.098,.024);for(const t of[-.44,.44])zt(i,.049,.049,.008,[t,-.389,.131],O.rubber);for(let t=0;t<20;t++)G(i,[.018,.076,.008],[-.3+t*.03,-.378,.132],O.leather,.001);Zn(i,1.31,.52,[0,.1,-.086],(t,e,n,s)=>{t.fillStyle="#b9b093",t.fillRect(0,0,e,n),t.fillStyle="#575644",t.font=`${n*.15}px Arial`,t.fillText("Б     МК 60–5",e*.05,n*.2);for(let r=0;r<4;r++)t.fillRect(e*.06,n*(.38+r*.13),e*.88,1);dn(t,e,n,s,800)},[0,Math.PI,0])}function d2(i){Nt(vf([[-.09,-.13,0,.51,.28,.29],[-.38,-.02,0,.25,.15,.21,-.25],[.25,.04,0,.18,.25,.17,-.2],[.31,.23,0,.15,.25,.16,-.2],[.36,.36,0,.215,.19,.18],[-.5,.02,0,.16,.09,.14,-.3]],O.cream,44),O.cream,i);for(const e of[-1,0,1]){const n=ji(i,[.14,.045,.05],[-.56,.09+e*.012,e*.055],O.cream);n.rotation.z=.5,n.rotation.y=e*.35}const t=new zi;t.moveTo(.51,.38),t.lineTo(.68,.34),t.quadraticCurveTo(.74,.31,.66,.3),t.lineTo(.51,.31),t.closePath(),cr(i,t,.13,O.gold,[0,0,-.065],[0,0,0],.008);for(const e of[-1,1]){ji(i,[.012,.014,.007],[.43,.405,e*.164],O.black),Fn(i,[[-.4,-.06,e*.2],[-.2,.02,e*.283],[.08,-.08,e*.25],[-.1,-.25,e*.26],[-.4,-.06,e*.2]],.003,O.gold,30);for(let n=0;n<4;n++)Fn(i,[[-.3+n*.055,-.07,e*.278],[-.19+n*.065,-.15,e*.28],[.01+n*.033,-.14,e*.26]],.002,O.gold,12)}zt(i,.29,.32,.045,[-.04,-.415,0],O.cream,[0,0,0]),Je(i,"ЛФЗ",.16,.065,[-.04,-.44,0],"#284985",[Math.PI/2,0,0])}function f2(i){G(i,[1.02,1.48,.253],[.025,0,0],O.paper,.01);for(let e=0;e<28;e++){const n=-.12+e*.009;G(i,[1.02,.002,.001],[.025,.742,n],e%5?O.paper:O.rust,0),G(i,[.002,1.45,.001],[.537,0,n],e%4?O.paper:O.rust,0)}G(i,[1.15,1.58,.045],[0,0,.155],O.red,.015),G(i,[1.15,1.58,.045],[0,0,-.155],O.red,.015),G(i,[.095,1.57,.34],[-.56,0,0],O.red,.025),Zn(i,.98,1.4,[.035,0,.18],(e,n,s,r)=>{e.strokeStyle="#b89a5c",e.lineWidth=2,e.strokeRect(30,30,n-60,s-60),e.strokeRect(44,44,n-88,s-88),e.textAlign="center",e.fillStyle="#c5a76b",e.font=`${n*.06}px Georgia`,e.fillText("АЛЕКСАНДР",n/2,s*.23),e.font=`${n*.16}px Georgia`,e.fillText("БЛОК",n/2,s*.37),e.lineWidth=1,e.beginPath(),e.moveTo(n*.3,s*.47),e.lineTo(n*.7,s*.47),e.stroke(),e.font=`${n*.044}px Georgia`,e.fillText("СТИХОТВОРЕНИЯ",n/2,s*.61),e.font=`${n*.033}px Georgia`,e.fillText("ЛЕНИЗДАТ · 1982",n/2,s*.9),dn(e,n,s,r,900),e.strokeStyle="rgba(203,164,113,.42)",e.lineWidth=7,e.beginPath(),e.moveTo(n*.86,s*.035),e.quadraticCurveTo(n*.97,s*.015,n*.98,s*.11),e.stroke(),e.lineWidth=3,e.beginPath(),e.moveTo(n*.8,s*.965),e.lineTo(n*.98,s*.94),e.stroke()});for(const e of[-.54,-.46,.46,.54])G(i,[.106,.015,.347],[-.556,e,0],O.red,.007);Je(i,"А. БЛОК",.55,.068,[-.614,0,0],"#d1b57f",[0,-Math.PI/2,Math.PI/2]);const t=new Ct({color:5724487,roughness:1});G(i,[.064,.38,.004],[.25,-.745,.055],t,.001,[0,0,-.08]),Je(i,"ЛЕНИЗДАТ",.35,.055,[.03,-.57,-.181],"#be9d61",[0,Math.PI,0])}function p2(i){we(i,.28,.055,[0,.41,0],O.gold),we(i,.219,.012,[0,.41,.034],O.copper),zt(i,.046,.048,.92,[0,-.29,0],O.gold,[0,0,0],32),G(i,[.25,.09,.1],[.092,-.745,0],O.gold,.012),G(i,[.09,.1,.105],[.171,-.64,0],O.gold,.007),G(i,[.065,.17,.095],[.037,-.7,0],O.gold,.009),we(i,.34,.014,[0,.72,-.01],O.silver,[.23,0,.08]),we(i,.331,.009,[0,.72,-.018],O.silver,[.23,0,.08]),G(i,[.24,.34,.037],[.37,.34,-.03],O.leather,.028,[0,0,-.22]),Je(i,"17",.14,.15,[.37,.34,-.007],"#d2b988",[0,0,-.22]),we(i,.055,.012,[.33,.535,-.02],O.silver),Je(i,"Л 82",.075,.027,[0,-.25,.049],"#776445")}function m2(i){const t=new zi;t.moveTo(-.4,.55),t.lineTo(.4,.55),t.lineTo(.4,-.26),t.quadraticCurveTo(.3,-.52,0,-.61),t.quadraticCurveTo(-.3,-.52,-.4,-.26),t.closePath(),cr(i,t,.055,O.gold,[0,0,-.03]);const e=t.clone();cr(i,e,.009,O.blue,[0,.005,.031],void 0,.005).scale.set(.91,.91,1),Zn(i,.67,.82,[0,.06,.06],(s,r,a)=>{s.fillStyle="#d9be73",s.strokeStyle="#d9be73",s.lineWidth=5,s.beginPath(),s.moveTo(r*.5,a*.04),s.lineTo(r*.5,a*.52),s.stroke(),s.beginPath(),s.moveTo(r*.53,a*.11),s.lineTo(r*.79,a*.4),s.lineTo(r*.53,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.44,a*.21),s.lineTo(r*.2,a*.4),s.lineTo(r*.44,a*.4),s.closePath(),s.fill(),s.beginPath(),s.moveTo(r*.12,a*.48),s.lineTo(r*.85,a*.48),s.lineTo(r*.71,a*.6),s.lineTo(r*.26,a*.6),s.closePath(),s.fill();for(let o=.65;o<.74;o+=.045){s.beginPath();for(let l=0;l<=r;l+=4)s.lineTo(l,a*o+Math.sin(l*.045)*4);s.stroke()}s.textAlign="center",s.font=`bold ${r*.11}px Georgia`,s.fillText("ЛЕНИНГРАД",r/2,a*.92)});for(const[s,r]of[[-.353,.46],[.353,-.17],[-.21,-.48]])ji(i,[.014,.021,.002],[s,r,.044],O.gold);Fn(i,[[-.25,.18,-.06],[.21,.18,-.07],[.27,.03,-.07],[-.22,.03,-.07]],.012,O.silver,14),zt(i,.04,.04,.045,[-.23,.18,-.059],O.silver),Je(i,"Ц. 20 К.",.31,.063,[0,-.23,-.044],"#655733",[0,Math.PI,0])}function g2(i){zt(i,.83,.83,.022,[0,0,0],O.black,void 0,96);const t=pe((s,r)=>{s.fillStyle="#59616a",s.fillRect(0,0,r,r);for(let a=170;a<502;a+=2)s.strokeStyle=a%5?"#66707a":"#454e57",s.lineWidth=.5,s.beginPath(),s.arc(r/2,r/2,a,0,Qe),s.stroke()},1024),e=pe((s,r)=>{const a=s.createImageData(r,r);for(let o=0;o<r;o++)for(let l=0;l<r;l++){const c=l-r/2,h=r/2-o,u=Math.hypot(c,h)||1,f=Math.sin(u*2.2)*.22,d=(o*r+l)*4;a.data[d]=128+127*f*c/u,a.data[d+1]=128+127*f*h/u,a.data[d+2]=253,a.data[d+3]=255}s.putImageData(a,0,0)},1024);e.colorSpace=mn;const n=new Ct({color:5265507,map:t,roughness:.26,metalness:.08,normalMap:e,normalScale:new gt(.65,.65),envMapIntensity:1.5});for(const s of[-1,1]){Nt(new ts(.824,96),n,i,[0,0,s*.013],[0,s===1?0:Math.PI,0]);const r=new re;i.add(r),r.rotation.y=s===1?0:Math.PI,Po(r,.281,.015,(a,o,l)=>{a.fillStyle=s===1?"#a09162":"#857c57",a.fillRect(0,0,o,o),a.fillStyle="#29362b",a.textAlign="center",a.font="bold 72px Georgia",a.fillText("МЕЛОДИЯ",o/2,255),a.font="33px Arial",a.fillText("ЛЕНИНГРАДСКИЙ ЗАВОД",o/2,330),a.fillText(s===1?"СТОРОНА 1":"СТОРОНА 2",o/2,712),a.font="26px Arial",a.fillText("33 об/мин • ГОСТ 5289–80",o/2,770),a.fillText("С60–18653",o/2,833),a.strokeStyle="#344a33",a.lineWidth=4,a.beginPath(),a.arc(o/2,o/2,480,0,Qe),a.stroke(),dn(a,o,o,l,1500)}),zt(r,.018,.018,.01,[0,0,.022],O.rubber)}}function x2(i){const t=new Ks({color:16250089,transmission:.96,roughness:.045,ior:1.48,thickness:.08,attenuationColor:15914916,attenuationDistance:3,clearcoat:.3,envMapIntensity:.65}),e=ws(i,[[0,-.55],[.3,-.55],[.36,-.47],[.36,.16],[.29,.31],[.095,.41],[.095,.54],[.067,.54],[.067,.39],[.26,.26],[.31,.12],[.31,-.45],[0,-.45]],t,[0,0,0],8),n=new Ks({color:12615462,roughness:.12,transmission:.55,thickness:.35,ior:1.36,transparent:!0,opacity:.92});zt(i,.294,.294,.19,[0,-.345,0],n,[0,0,0],8),zt(i,.11,.11,.16,[0,.49,0],O.gold,[0,0,0]),fo(i,.112,.1,[0,.49,0],28,O.gold,"y"),ws(i,[[0,.55],[.1,.55],[.165,.63],[.125,.82],[.065,.93],[0,.93]],t,[0,0,0],8),Zn(i,.38,.38,[0,-.085,.364],(s,r,a,o)=>{s.fillStyle="#e0c991",s.fillRect(0,0,r,a),s.strokeStyle="#84713f",s.lineWidth=8,s.strokeRect(16,16,r-32,a-32),s.fillStyle="#594b30",s.textAlign="center",s.font=`${r*.12}px Georgia`,s.fillText("ДУХИ",r/2,a*.28),s.font=`italic ${r*.16}px Georgia`,s.fillText("Белая ночь",r/2,a*.55),s.font=`${r*.06}px Georgia`,s.fillText("ЛЕНИНГРАД · 1965",r/2,a*.81),dn(s,r,a,o,1800)}),e.rotation.y=Math.PI/8}function v2(i){G(i,[1.27,.08,.55],[0,-.72,0],O.bronze,.032),G(i,[1.35,.04,.61],[0,-.78,0],O.black,.02),Nt(vf([[0,-.15,0,.35,.19,.16],[.23,-.07,0,.21,.245,.165],[-.25,-.13,0,.235,.21,.18],[.29,.14,0,.13,.31,.125,.3],[.36,.36,0,.12,.21,.115,.35],[.45,.455,0,.17,.108,.11,.25],[.59,.39,0,.11,.067,.086,.35]],O.bronze),O.bronze,i);for(const t of[-1,1])for(const e of[-.3,.26]){const n=t*.13,s=e<0?-.12:.075;Fn(i,[[e,-.24,n],[e+s,-.42,n+.012],[e+s*.7,-.66,n]],.034,O.bronze),ji(i,[.051,.057,.04],[e+s,-.43,n],O.bronze),G(i,[.14,.065,.095],[e+s*.7+.02,-.66,n],O.bronze,.018)}for(const t of[-1,1]){const e=t*.084,n=ws(i,[[0,0],[.041,0],[.034,.1],[0,.18]],O.bronze,[.333,.525,e],16);n.rotation.z=.15,ji(i,[.015,.015,.008],[.457,.49,t*.127],O.black),ji(i,[.012,.01,.006],[.648,.404,t*.083],O.black)}for(let t=0;t<12;t++)Fn(i,[[.24,.46-t*.04,-.065],[.14,.42-t*.035,-.087],[.13,.35-t*.034,-.083]],.012,O.bronze,10);Fn(i,[[-.41,-.1,0],[-.61,-.24,0],[-.65,-.44,.02],[-.57,-.58,.02]],.046,O.bronze);for(let t=0;t<5;t++)Fn(i,[[-.41,-.1,(t-2)*.012],[-.62,-.31,(t-2)*.012],[-.6,-.56,(t-2)*.012]],.007,O.gold,14);Fn(i,[[.33,.53,.139],[.49,.34,.12],[.65,.37,.09]],.006,O.gold,16),Je(i,"ЛЕНИНГРАД",.59,.033,[0,-.719,.279],"#b6a579")}function _2(i){zt(i,.51,.53,.145,[0,0,0],O.gold),we(i,.503,.018,[0,0,.075],O.gold),fo(i,.51,.072,[0,0,-.018],72,O.gold),Po(i,.466,.081,(e,n,s)=>{e.fillStyle="#daceaa",e.fillRect(0,0,n,n),e.translate(n/2,n/2);for(let r=0;r<120;r++)e.save(),e.rotate(r*Qe/120),e.strokeStyle="#435145",e.lineWidth=r%10?2:4,e.beginPath(),e.moveTo(0,-470),e.lineTo(0,r%10?-452:-421),e.stroke(),e.restore();e.textAlign="center",e.textBaseline="middle",e.font="bold 80px Georgia",e.fillStyle="#4b5647";for(const[r,a,o]of[["С",0,-330],["Ю",0,330],["В",330,0],["З",-330,0]])e.fillText(r,a,o);e.font="25px Arial";for(let r=0;r<12;r++){const a=r*Qe/12;e.fillText(String(r*30),Math.sin(a)*391,-Math.cos(a)*391)}e.strokeStyle="#93855d",e.lineWidth=1;for(let r=0;r<8;r++)e.save(),e.rotate(r*Math.PI/4),e.beginPath(),e.moveTo(0,-270),e.lineTo(-29,-62),e.lineTo(0,0),e.lineTo(29,-62),e.closePath(),e.stroke(),e.restore();e.font="24px Georgia",e.fillText("ЛЕНИНГРАД",0,218),e.translate(-n/2,-n/2),dn(e,n,n,s,1800)});const t=new zi;t.moveTo(0,.335),t.lineTo(-.042,0),t.lineTo(0,-.038),t.lineTo(.042,0),t.closePath(),cr(i,t,.007,O.red,[0,0,.103],[0,0,-.38],.001),cr(i,t,.007,O.silver,[0,0,.103],[0,0,Math.PI-.38],.001),zt(i,.027,.027,.025,[0,0,.121],O.gold),lh(i,.468,.013,[0,0,.142]),we(i,.109,.025,[0,.635,0],O.gold),zt(i,.059,.065,.092,[0,.523,0],O.gold,[0,0,0]),zt(i,.465,.465,.02,[0,0,-.086],O.gold),Je(i,"№ 023817",.4,.07,[0,.065,-.101],"#665b3c",[0,Math.PI,0]),Je(i,"СЕВЕР ВСЕГДА РЯДОМ",.62,.045,[0,-.062,-.101],"#665b3c",[0,Math.PI,0])}function M2(i){ws(i,[[0,-.82],[.245,-.82],[.283,-.77],[.292,-.7],[.292,.12],[.28,.24],[.2,.32],[.115,.43],[.105,.8],[.127,.815],[.128,.87],[.104,.895],[.083,.888],[.081,.8],[.09,.43],[.16,.31],[.248,.16],[.255,-.715],[.19,-.758],[0,-.758]],O.glass);for(const n of[.817,.862])we(i,.116,.009,[0,n,0],O.glass,[Math.PI/2,0,0]);const t=pe((n,s,r,a)=>{n.fillStyle="#c9c4a0",n.beginPath(),n.moveTo(0,15);for(let o=0;o<=s;o+=12)n.lineTo(o,8+r()*14);n.lineTo(s,a-9);for(let o=s;o>=0;o-=14)n.lineTo(o,a-10-r()*12);n.closePath(),n.fill(),n.strokeStyle="#526147",n.lineWidth=8,n.strokeRect(26,30,s-52,a-60),n.fillStyle="#48593c",n.textAlign="center",n.font=`bold ${a*.22}px Georgia`,n.fillText("НЕВСКОЕ",s/2,a*.44),n.font=`${a*.09}px Arial`,n.fillText("СТЕКЛО • 0,5 Л",s/2,a*.73),dn(n,s,a,r,2800)},768,460),e=new Ct({map:t,transparent:!0,depthWrite:!1,roughness:.94,side:Oe});Nt(new Fe(.295,.295,.52,40,1,!0,-.82,1.64),e,i,[0,-.21,0]),Je(i,"0,5",.08,.044,[0,-.825,0],"#6b8f5c",[Math.PI/2,0,0])}function y2(i){const t=O.silver.clone();t.roughness=.46,ws(i,[[.415,-.42],[.439,-.41],[.444,-.375],[.425,-.35],[.425,.32],[.444,.35],[.444,.388],[.418,.397],[.406,.378],[.406,-.36],[0,-.36]],t);for(let n=0;n<7;n++)we(i,.428,.006,[0,-.28+n*.089,0],t,[Math.PI/2,0,0]);zt(i,.404,.404,.015,[0,-.347,0],O.rust,[0,0,0]);const e=new re;e.position.set(0,.386,-.365),e.rotation.x=-.68,i.add(e),zt(e,.421,.421,.012,[0,0,.365],t,[0,0,0]),we(e,.397,.008,[0,.01,.365],t,[Math.PI/2,0,0]),we(e,.111,.022,[0,.025,.45],t,[Math.PI/2,0,0]),G(e,[.067,.025,.11],[0,.028,.33],t,.015),Zn(i,.4,.39,[0,-.03,.427],(n,s,r,a)=>{n.fillStyle="#d8d2ba",n.beginPath(),n.moveTo(14,10),n.lineTo(s*.8,0),n.lineTo(s,r*.62),n.lineTo(s*.66,r),n.lineTo(0,r*.8),n.closePath(),n.fill(),n.fillStyle="#37455e",n.textAlign="center",n.font=`bold ${s*.11}px Georgia`,n.fillText("КОНСЕРВЫ",s/2,r*.42),n.font=`${s*.06}px Arial`,n.fillText("МОЛОЧНЫЕ",s/2,r*.58),dn(n,s,r,a,2600)}),Zn(i,.42,.41,[0,-.02,-.427],(n,s,r,a)=>{n.fillStyle="#998459",n.beginPath(),n.moveTo(20,0),n.lineTo(s*.75,0),n.lineTo(s,r*.5),n.lineTo(s*.7,r),n.lineTo(0,r*.7),n.closePath(),n.fill(),n.fillStyle="#71523c",n.font=`bold ${s*.15}px Georgia`,n.fillText("ГОСТ",s*.13,r*.46),dn(n,s,r,a,2400)},[0,Math.PI,0])}function S2(i){const t=pe((r,a,o,l)=>{r.fillStyle="#d6c5a0",r.fillRect(0,0,a,l),r.fillStyle="#6b4934",r.fillRect(0,l*.28,a,l*.37),r.fillStyle="#e6d1aa",r.textAlign="center",r.font=`bold ${l*.115}px Georgia`,r.fillText("КОФЕ",a*.24,l*.5),r.fillStyle="#6d533b",r.font=`${l*.04}px Arial`,r.fillText("ПЕТЕРБУРГ НЕ СПИТ",a*.24,l*.81),dn(r,a,l,o,1500),r.fillStyle="rgba(105,63,28,.20)",r.beginPath(),r.ellipse(a*.3,l*.13,a*.09,l*.028,.2,0,Qe),r.fill()},768,768),e=new Ct({map:t,roughness:.98,side:Oe,bumpMap:O.paper.bumpMap,bumpScale:.009}),n=new Fe(.36,.235,.88,64,24,!0),s=n.attributes.position;for(let r=0;r<s.count;r++){const a=s.getX(r),o=s.getY(r),l=s.getZ(r),c=Math.atan2(l,a),h=1-.22*Math.exp(-Math.pow((o-.04)*5,2))*(.5+.5*Math.cos(c*3)),u=.022*Math.sin(c*8+o*18);s.setXYZ(r,a*h+u,o,l*h)}n.computeVertexNormals(),Nt(n,e,i),we(i,.355,.016,[0,.44,0],O.paper,[Math.PI/2,0,0]),zt(i,.232,.232,.015,[0,-.437,0],O.paper,[0,0,0]),zt(i,.224,.224,.008,[0,-.421,0],O.rust,[0,0,0]),Fn(i,[[.105,-.4,-.217],[.137,-.09,-.272],[.147,.17,-.304],[.172,.42,-.31]],.004,O.paper)}function b2(i){const t=pe((s,r,a)=>{s.fillStyle="#a08355",s.fillRect(0,0,r,r);for(let o=0;o<r;o+=3)s.fillStyle=o%2?"rgba(70,49,25,.09)":"rgba(220,198,155,.12)",s.fillRect(0,o,r,1);dn(s,r,r,a,3500)}),e=new Ct({map:t,roughness:.97,bumpMap:O.paper.bumpMap,bumpScale:.008,side:Oe});G(i,[1.16,.034,.82],[0,-.46,0],e,.006);for(const s of[-.4,.4])G(i,[1.16,.75,.029],[0,-.065,s],e,.006);for(const s of[-.56,.56])G(i,[.029,.75,.8],[s,-.065,0],e,.006);G(i,[.54,.026,.79],[-.77,.425,0],e,.004,[0,0,-.42]),G(i,[.54,.026,.79],[.75,.4,0],e,.004,[0,0,.38]),G(i,[1.1,.025,.4],[0,.37,-.55],e,.004,[.43,0,0]),G(i,[1.1,.025,.4],[0,.31,.59],e,.004,[-.24,0,0]);for(let s=-.54;s<.56;s+=.031)zt(i,.005,.005,.027,[s,.319,.399],O.paper,[0,0,0],6);Zn(i,.39,.3,[-.24,-.01,.418],(s,r,a,o)=>{s.fillStyle="#d1c4a0",s.fillRect(0,0,r,a),s.fillStyle="#41483b",s.font=`${a*.13}px monospace`,s.fillText("ПОСЫЛКА №017",20,a*.23);for(let l=25;l<r-25;l+=7)s.fillRect(l,a*.35,2+o()*3,a*.44);dn(s,r,a,o,1200)}),Zn(i,1.08,.27,[0,-.28,.421],(s,r,a)=>{s.beginPath(),s.moveTo(0,a);for(let o=0;o<=r;o+=10)s.lineTo(o,a*(.32+.09*Math.sin(o*.027)));s.lineTo(r,a),s.closePath(),s.fillStyle="rgba(92,57,28,.23)",s.fill(),s.strokeStyle="rgba(92,57,28,.18)",s.lineWidth=3,s.stroke()});const n=new Ct({color:11114860,roughness:.4,transparent:!0,opacity:.66});G(i,[.12,.74,.006],[.25,-.05,.421],n,.001),G(i,[.116,.015,.3],[.25,-.438,.21],n,.002)}function w2(i){zt(i,.507,.507,.036,[0,0,0],O.rust,void 0,80),we(i,.504,.014,[0,0,.017],O.silver);for(const e of[.448,.408])we(i,e,.009,[0,0,.024],O.rust);const t=xi(77);for(let e=0;e<9;e++){const n=t()*Qe,s=.465+t()*.015;ji(i,[.008+t()*.009,.005+t()*.012,6e-4],[Math.cos(n)*s,Math.sin(n)*s,.022],O.silver)}for(let e=0;e<24;e++){const n=e*Qe/24;G(i,[.03,.027,.023],[Math.sin(n)*.487,Math.cos(n)*.487,-.018],O.rust,.007,[0,0,-n])}Je(i,"ГОСТ 5981–88",.44,.056,[0,-.23,.038],"#523d2a")}function T2(i){const t=pe((n,s,r,a)=>{n.fillStyle="#c8bd9e",n.fillRect(0,0,s,a),n.fillStyle="#394238",n.textAlign="center",n.font="bold 76px Georgia",n.fillText("ВЕЧЕРНИЙ",s/2,90),n.fillText("ПЕТЕРБУРГ",s/2,173),n.fillRect(38,196,s-76,4),n.font="22px Georgia",n.fillText("ПЯТНИЦА, 21 ИЮНЯ 1991 ГОДА     •     № 143",s/2,230),n.textAlign="left";for(let o=0;o<3;o++){const l=40+o*322;n.font="bold 31px Georgia",n.fillText(["Белые ночи","Город у воды","После дождя"][o],l,285);for(let c=0;c<65;c++){const h=314+c*14;o===0&&c<15||(n.font="12px Georgia",n.fillText(["Петербург вновь встречает рассвет.","На набережных светло и тихо.","Город хранит наши воспоминания.","Сегодня ожидается переменная облачность."][c%4],l,h,285))}}n.fillStyle="#a19c86",n.fillRect(42,315,278,193),n.strokeStyle="#505c4d",n.lineWidth=2;for(let o=56;o<312;o+=40){n.strokeRect(o,347,29,119);for(let l=359;l<450;l+=26)n.strokeRect(o+6,l,7,14),n.strokeRect(o+18,l,7,14)}n.beginPath(),n.moveTo(40,345),n.lineTo(180,319),n.lineTo(319,345),n.stroke(),dn(n,s,a,r,1e4),n.fillStyle="rgba(92,69,29,.12)",n.fillRect(s*.43,0,7,a),n.fillStyle="rgba(99,68,36,.13)",n.beginPath(),n.ellipse(s*.16,a*.9,s*.19,a*.09,.15,0,Qe),n.fill()},1024,1280),e=new Ct({map:t,roughness:1,side:Oe,bumpMap:O.paper.bumpMap,bumpScale:.004});for(let n=0;n<2;n++){const s=new fe(1.14,1.43,40,40),r=s.attributes.position;for(let a=0;a<r.count;a++){const o=r.getX(a),l=r.getY(a);r.setZ(a,n*.004-.021*Math.cos(o*2.6)*Math.cos(l*1.9)-.011*Math.sin(l*3.4))}s.computeVertexNormals(),Nt(s,e,i)}}const E2={camera:l2,teacup:c2,watch:h2,cassette:u2,duck:d2,book:f2,key:p2,badge:m2,record:g2,perfume:x2,horse:v2,compass:_2,bottle:M2,can:y2,cup:S2,box:b2,lid:w2,paper:T2};function A2(i){i.updateMatrixWorld(!0);const t=new Map;let e=0;i.traverse(n=>{if(!n.isMesh)return;e++;const s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();if(s.applyMatrix4(n.matrixWorld),n.material===O.bronze){const a=s.attributes.position,o=new Float32Array(a.count*3),l=new Zt("#977145"),c=new Zt("#355d53");for(let h=0;h<a.count;h++){const u=a.getX(h),f=a.getY(h),d=a.getZ(h),m=Math.sin(u*15+Math.sin(f*9))*Math.sin(f*19+d*12)*Math.cos(d*21-u*6),x=Vt.clamp((m+.12)*.85,0,.8);l.clone().lerp(c,x).toArray(o,h*3)}s.setAttribute("color",new Ce(o,3))}const r=n.material.uuid;t.has(r)||t.set(r,{material:n.material,geometries:[]}),t.get(r).geometries.push(s),n.geometry.dispose()}),i.clear();for(const{material:n,geometries:s}of t.values()){const r=ff(s,!1);Nt(r,n,i),s.forEach(a=>a.dispose())}return e}function yl(i){const t=new re;E2[i](t),["box","can","cup","paper"].includes(i)&&(t.updateMatrixWorld(!0),t.traverse(o=>{if(!o.isMesh)return;const l=o.geometry.attributes.position,c=o.matrixWorld.clone().invert();for(let h=0;h<l.count;h++){const u=new L().fromBufferAttribute(l,h).applyMatrix4(o.matrixWorld);u.set(...r2(i,u.x,u.y,u.z)).applyMatrix4(c),l.setXYZ(h,u.x,u.y,u.z)}o.geometry.computeVertexNormals(),o.geometry.computeBoundingBox(),o.geometry.computeBoundingSphere()}));const e=A2(t),n=new $n().setFromObject(t),s=n.getCenter(new L),r=n.getSize(new L);t.children.forEach(o=>o.position.sub(s)),t.scale.setScalar(2.1/Math.max(r.x,r.y,r.z));const a=new re;return a.add(t),a.rotation.set(.08,-.2,0),a.userData={id:i,modeledParts:e,materialBatches:t.children.length,bounds:{min:r.clone().multiplyScalar(-1.05/Math.max(r.x,r.y,r.z)).toArray(),max:r.clone().multiplyScalar(1.05/Math.max(r.x,r.y,r.z)).toArray()}},a}const Ha=xi(370);function R2(i){let t=Math.imul(i|0,2654435761)>>>0;return t^=t>>>13,t=Math.imul(t,2246822519)>>>0,t^=t>>>15,t>>>0}function ch(i,t,e,n,s){const r=new fe(i,t),a=r.attributes.uv,o=(e%n+n)%n,l=(Math.floor(e/n)%s+s)%s;for(let c=0;c<a.count;c++)a.setXY(c,(o+a.getX(c))/n,1-(l+1)/s+a.getY(c)/s);return r}function zn(i,t,e,n,s=[1,1,1],r=1){const a=Nt(new To(t,r),n,i,e);return a.scale.set(...s),a}function Bn(i,t,e,n,s=[1,1,1],r=1){const a=Nt(new To(t,r),n,i,e);return a.scale.set(...s),a}function C2(i,t,e,n=5){const s=[];for(let r=0;r<n;r++){const a=r/(n-1);s.push([i[0]+(t[0]-i[0])*a,i[1]+(t[1]-i[1])*a-e*4*a*(1-a),i[2]+(t[2]-i[2])*a])}return s}function Io(i,t,e,n,s=24){return Nt(new Tn(new Ni(t.map(r=>new L(...r))),s,e,5,!1),n,i)}function P2(){return pe((i,t,e,n)=>{const s=t/4,r=n/2,a="#251810",o="#3b2617",l=(d,m,x,g,p)=>{i.fillStyle=p,i.fillRect(d,m,x,g)},c=(d,m,x,g,p)=>{i.fillStyle=p,i.beginPath(),i.ellipse(d,m,x,g,0,0,Math.PI*2),i.fill()},h=(d,m,x,g="rgba(255,198,106,")=>{const p=i.createRadialGradient(d,m,0,d,m,x);p.addColorStop(0,g+".62)"),p.addColorStop(1,g+"0)"),i.fillStyle=p,i.fillRect(d-x,m-x,x*2,x*2)},u=(d,m,x="#4b2d1e")=>{const g=i.createLinearGradient(0,0,0,r);g.addColorStop(0,d),g.addColorStop(1,m),i.fillStyle=g,i.fillRect(0,0,s,r),l(0,r*.78,s,r*.22,x),l(0,r*.76,s,4,"rgba(255,232,185,.18)")},f=(d,m)=>{i.save(),i.translate(d%4*s,Math.floor(d/4)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),m(),l(0,0,9,r,"rgba(24,14,8,.28)"),l(s-9,0,9,r,"rgba(24,14,8,.28)"),i.restore()};f(0,()=>{u("#bd8745","#70452a"),l(16,58,122,316,"#382313");const d=["#8c3f32","#325d66","#c0a15a","#596b3c","#77508a","#b7b0a0"];for(let m=0;m<5;m++){const x=78+m*58;l(22,x+38,110,6,"#20130b");let g=27;for(;g<124;){const p=5+e()*9;l(g,x+38-(24+e()*12),p,24+e()*12,d[Math.floor(e()*d.length)]),g+=p+2}}i.strokeStyle="#2a1a0f",i.lineWidth=7,i.beginPath(),i.moveTo(126,382),i.lineTo(164,104),i.moveTo(150,388),i.lineTo(184,118),i.stroke(),h(202,238,66),l(198,238,7,132,a),i.beginPath(),i.moveTo(176,238),i.lineTo(229,238),i.lineTo(216,202),i.lineTo(189,202),i.closePath(),i.fillStyle="#5d331f",i.fill(),c(190,388,48,52,a),l(142,386,96,38,a),i.save(),i.translate(181,350),i.rotate(-.18),l(-24,-16,48,32,"#eadfc2"),i.restore()}),f(1,()=>{u("#a8ad7d","#66704e","#40392a");for(let d=0;d<3;d++){const m=86+d*72;l(22,m,190,7,o);for(let x=0;x<6;x++){const g=34+x*31;l(g,m-(20+(x+d)%3*7),15,20+(x+d)%3*7,["#d8c99a","#9d4f37","#d9d4c4","#728c68"][x%4]),l(g+2,m-(27+(x+d)%3*7),11,6,a)}}i.strokeStyle=a,i.lineWidth=5,i.beginPath(),i.moveTo(28,306),i.lineTo(226,306),i.stroke();for(const d of[62,112,168])i.beginPath(),i.moveTo(d,306),i.lineTo(d,326),i.stroke(),c(d,343,19,17,a);l(34,402,188,12,a),l(48,414,10,58,a),l(202,414,10,58,a),c(128,386,35,22,a),l(112,358,32,12,a),i.beginPath(),i.moveTo(158,382),i.lineTo(184,366),i.lineTo(188,378),i.lineTo(164,394),i.closePath(),i.fillStyle=a,i.fill(),h(128,72,52)}),f(2,()=>{u("#bd8a68","#77503c"),h(128,116,72),l(126,0,4,82,a),i.beginPath(),i.moveTo(94,118),i.lineTo(162,118),i.lineTo(146,82),i.lineTo(110,82),i.closePath(),i.fillStyle="#6e3f28",i.fill(),c(128,352,70,15,a),l(122,352,10,82,a),c(128,438,48,10,a),c(82,326,20,22,a),i.beginPath(),i.moveTo(58,348),i.quadraticCurveTo(78,306,104,348),i.lineTo(112,408),i.lineTo(52,408),i.closePath(),i.fillStyle=a,i.fill(),l(96,330,42,28,"#eee3c4"),c(185,452,34,20,a),c(213,438,15,14,a),i.beginPath(),i.moveTo(203,429),i.lineTo(208,414),i.lineTo(215,428),i.moveTo(217,428),i.lineTo(225,415),i.lineTo(228,431),i.fillStyle=a,i.fill(),i.strokeStyle=a,i.lineWidth=8,i.beginPath(),i.moveTo(158,452),i.quadraticCurveTo(132,430,142,402),i.stroke(),l(0,472,s,10,"rgba(35,20,12,.45)")}),f(3,()=>{u("#8fae94","#55705e","#33473a");for(let d=0;d<3;d++){const m=120+d*104;l(18,m,220,8,"#2c2117");for(let x=0;x<4;x++){const g=42+x*54;l(g-13,m-25,26,25,"#8a5138");for(let p=0;p<6;p++){const v=-2.4+p*.45;c(g+Math.cos(v)*17,m-34+Math.sin(v)*19,11,5,p%2?"#365f3a":"#527a45")}}}i.strokeStyle="#3d6540",i.lineWidth=4;for(const d of[38,96,204]){i.beginPath(),i.moveTo(d,0),i.quadraticCurveTo(d+14,72,d-4,142),i.stroke();for(let m=0;m<6;m++)c(d+(m%2?9:-8),24+m*21,10,5,m%2?"#426f42":"#5d844e")}h(220,78,48),l(178,414,44,34,"#31545e"),i.beginPath(),i.moveTo(222,420),i.lineTo(242,402),i.lineTo(246,412),i.lineTo(226,434),i.closePath(),i.fillStyle="#31545e",i.fill()}),f(4,()=>{u("#a87438","#674126"),h(62,112,58),l(58,112,6,210,a),i.beginPath(),i.moveTo(34,112),i.lineTo(90,112),i.lineTo(78,78),i.lineTo(48,78),i.closePath(),i.fillStyle="#623620",i.fill(),i.beginPath(),i.moveTo(28,318),i.lineTo(138,318),i.quadraticCurveTo(230,318,222,364),i.quadraticCurveTo(176,398,72,390),i.lineTo(28,376),i.closePath(),i.fillStyle=a,i.fill(),i.beginPath(),i.moveTo(42,318),i.lineTo(130,248),i.lineTo(180,318),i.closePath(),i.fillStyle="#1c120c",i.fill();for(const d of[48,112,190])l(d,386,10,72,a);l(94,282,48,34,"#eee4c8"),i.strokeStyle="#8a7a5c";for(let d=0;d<4;d++)i.beginPath(),i.moveTo(100,292+d*6),i.lineTo(136,292+d*6),i.stroke();c(166,414,34,10,a),l(160,414,9,44,a),l(176,414,9,44,a),i.beginPath(),i.moveTo(212,250),i.lineTo(232,300),i.lineTo(192,300),i.closePath(),i.fillStyle=o,i.fill()}),f(5,()=>{u("#b8b19b","#77765f","#4c4636"),l(24,54,62,78,"#38443e"),l(32,62,46,62,"#c9b87d"),c(55,94,15,10,"#7b4c35"),l(178,62,52,66,"#5d3438"),i.strokeStyle=a,i.lineWidth=7,i.beginPath(),i.moveTo(76,436),i.lineTo(126,178),i.lineTo(178,436),i.moveTo(96,348),i.lineTo(158,348),i.stroke(),l(88,196,82,104,"#e5dcc2"),c(122,256,23,15,"#8ba0a2"),i.beginPath(),i.moveTo(88,282),i.quadraticCurveTo(126,238,170,282),i.lineTo(170,300),i.lineTo(88,300),i.closePath(),i.fillStyle="#68765a",i.fill(),c(201,392,30,9,a),l(196,392,8,52,a);for(let d=0;d<5;d++)l(26+d*15,410-d*17%28,8,22,["#a34438","#d1b36a","#56706a","#78608e","#c8c2ae"][d]);h(218,166,50)}),f(6,()=>{u("#8299a4","#4f6875","#31424b");const d=i.createLinearGradient(38,96,218,250);d.addColorStop(0,"#b9d5df"),d.addColorStop(.55,"#688b9c"),d.addColorStop(1,"#314f62"),i.fillStyle=d,i.fillRect(38,96,180,154),l(34,92,188,8,a),l(34,250,188,8,a),c(96,178,25,32,"rgba(35,51,60,.75)"),i.beginPath(),i.moveTo(54,250),i.quadraticCurveTo(98,196,146,250),i.closePath(),i.fillStyle="rgba(35,51,60,.75)",i.fill(),l(150,126,48,28,"rgba(232,240,235,.55)"),h(218,318,52),l(216,318,6,112,a),i.beginPath(),i.moveTo(194,318),i.lineTo(244,318),i.lineTo(232,286),i.lineTo(206,286),i.closePath(),i.fillStyle="#70452d",i.fill(),l(38,382,150,76,a),l(30,356,66,42,a),l(118,356,66,42,a),c(70,348,17,18,a),c(146,348,17,18,a)}),f(7,()=>{u("#b49aa4","#76606d","#463945");for(let d=0;d<5;d++){l(24,78+d*8,70,4,"rgba(50,35,42,.45)");for(let m=0;m<4;m++)l(31+m*16,58+d*8,9,18,["#b34a42","#d3b36a","#66806c","#7084a8"][m])}i.beginPath(),i.moveTo(142,116),i.bezierCurveTo(116,150,122,190,142,222),i.bezierCurveTo(128,258,132,292,150,318),i.lineTo(178,318),i.bezierCurveTo(194,290,198,258,186,222),i.bezierCurveTo(206,190,210,148,184,116),i.closePath(),i.fillStyle="#6a4652",i.fill(),l(158,96,12,28,a),l(162,318,5,112,a),i.strokeStyle=a,i.lineWidth=6,i.beginPath(),i.moveTo(164,430),i.lineTo(132,472),i.moveTo(164,430),i.lineTo(196,472),i.stroke(),l(28,368,92,10,a),l(36,378,8,66,a),l(104,378,8,66,a),i.beginPath(),i.moveTo(48,368),i.lineTo(54,332),i.lineTo(96,332),i.lineTo(102,368),i.lineTo(84,368),i.lineTo(82,350),i.lineTo(66,350),i.lineTo(64,368),i.closePath(),i.fillStyle=a,i.fill(),l(206,190,28,168,"#9c4f4b"),l(212,190,5,168,"rgba(255,235,200,.25)"),h(216,112,50)})},1024,1024)}function I2(){return pe((i,t,e,n)=>{const s=t/2,r=n/2,a=(l,c)=>{i.save(),i.translate(l%2*s,Math.floor(l/2)*r),i.beginPath(),i.rect(0,0,s,r),i.clip(),c(),i.restore()},o=(l,c,h,u,f="#2e342b",d="Georgia")=>{i.fillStyle=f,i.font=`bold ${u}px ${d}`,i.textAlign="center",i.fillText(l,c,h,s-18)};a(0,()=>{i.fillStyle="#e7dec8",i.fillRect(0,0,s,r),o("ПРОПАЛ КОТ",s/2,42,27,"#633b27"),i.fillStyle="#c9823e",i.beginPath(),i.ellipse(112,142,58,42,0,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(164,112,27,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(145,94),i.lineTo(150,70),i.lineTo(163,91),i.moveTo(174,91),i.lineTo(188,72),i.lineTo(190,98),i.fill(),i.strokeStyle="#9a5a2d",i.lineWidth=6;for(let l=0;l<4;l++)i.beginPath(),i.moveTo(82+l*18,116),i.lineTo(76+l*18,143),i.stroke();i.strokeStyle="#c9823e",i.lineWidth=11,i.beginPath(),i.moveTo(58,150),i.quadraticCurveTo(20,128,32,94),i.stroke(),o("ТИХОН • РЫЖИЙ",s/2,211,19),o("позвоните в кв. 17",s/2,237,16,"#6b6252","Arial")}),a(1,()=>{i.fillStyle="#22384a",i.fillRect(0,0,s,r),i.fillStyle="#e8dfb8",i.beginPath(),i.arc(202,48,25,0,Math.PI*2),i.fill(),i.fillStyle="#22384a",i.beginPath(),i.arc(212,42,22,0,Math.PI*2),i.fill(),i.strokeStyle="#d7ad55",i.lineWidth=17,i.beginPath(),i.moveTo(90,58),i.quadraticCurveTo(76,150,122,178),i.quadraticCurveTo(158,198,178,164),i.stroke(),i.fillStyle="#d7ad55",i.beginPath(),i.moveTo(176,132),i.lineTo(214,166),i.lineTo(164,190),i.closePath(),i.fill(),o("ДЖАЗ ВО ДВОРЕ",s/2,224,24,"#f0dfae"),o("суббота • 21:00",s/2,247,16,"#bcd0d8","Arial")}),a(2,()=>{i.fillStyle="#ded8c8",i.fillRect(0,0,s,r),o("ОБЪЯВЛЕНИЯ",s/2,36,24);for(const[l,c]of[[58,"УРОКИ ФОРТЕПИАНО"],[112,"РЕМОНТ ВЕЛОСИПЕДОВ"],[166,"СДАМ КОМНАТУ"]]){o(c,s/2,l,16,"#394033","Arial"),i.strokeStyle="rgba(57,64,51,.55)";for(let h=0;h<3;h++)i.beginPath(),i.moveTo(34,l+13+h*10),i.lineTo(222-h*37%46,l+13+h*10),i.stroke()}i.strokeStyle="#7b7463";for(let l=26;l<s-10;l+=24)i.beginPath(),i.moveTo(l,222),i.lineTo(l,256),i.stroke()}),a(3,()=>{i.fillStyle="#e9e1cd",i.fillRect(0,0,s,r),i.fillStyle="#9d4b3d",i.beginPath(),i.arc(128,118,72,Math.PI,0),i.lineTo(200,190),i.lineTo(56,190),i.closePath(),i.fill(),i.fillStyle="#263740",i.fillRect(76,94,104,96),i.fillStyle="#e4c87e";for(let l=0;l<3;l++)for(let c=0;c<3;c++)i.fillRect(88+c*31,106+l*27,17,18);o("ДВОРЫ",s/2,226,31,"#263740"),o("фотографии соседей",s/2,249,15,"#746a58","Arial")})},512,512)}const nn={};function Kn(){if(nn.stone)return nn;nn.stone=new Ct({color:7566439,roughness:.86,map:eo("plaster.jpg")}),nn.iron=new Ct({color:2633768,metalness:.72,roughness:.6}),nn.green=new Ct({color:4216121,roughness:.9,flatShading:!0,side:Oe}),nn.shadowMap=pe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(5,13,8,.8)"),r.addColorStop(.45,"rgba(5,13,8,.5)"),r.addColorStop(1,"rgba(5,13,8,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128),nn.contact=new Ke({map:nn.shadowMap,transparent:!0,depthWrite:!1}),nn.wood=new Ct({color:7427130,roughness:.92}),nn.leafDark=new Ct({color:3099956,roughness:1,flatShading:!0}),nn.poster=new Ct({map:I2(),roughness:.96}),nn.bulb=new Ct({color:16767124,emissive:16755023,emissiveIntensity:5.2,roughness:.35});const i=pe((n,s)=>{const r=n.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,"rgba(255,190,105,.85)"),r.addColorStop(.38,"rgba(255,166,76,.28)"),r.addColorStop(1,"rgba(255,166,76,0)"),n.fillStyle=r,n.fillRect(0,0,s,s)},128);nn.glow=new Ke({map:i,color:16757350,transparent:!0,opacity:.42,blending:Hr,depthWrite:!1,side:Oe});const t=pe((n,s,r,a)=>{n.strokeStyle="rgba(242,240,224,.78)",n.lineWidth=5,n.font="bold 34px Georgia",n.textAlign="center";const o=(l,c,h)=>{n.strokeRect(l,c,62,62),n.fillStyle="rgba(242,240,224,.78)",n.fillText(String(h),l+31,c+43)};o(97,410,1),o(97,340,2),o(62,270,3),o(132,270,4),o(97,200,5),o(62,130,6),o(132,130,7),n.beginPath(),n.arc(128,82,45,Math.PI,0),n.stroke(),n.fillText("8",128,92),n.beginPath(),n.arc(205,438,18,0,Math.PI*2),n.stroke();for(let l=0;l<8;l++){const c=l*Math.PI/4;n.beginPath(),n.moveTo(205+Math.cos(c)*24,438+Math.sin(c)*24),n.lineTo(205+Math.cos(c)*34,438+Math.sin(c)*34),n.stroke()}},256,512);nn.chalk=new Ke({map:t,transparent:!0,opacity:.58,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1});const e=pe((n,s)=>{for(let r=0;r<8;r++)for(let a=0;a<8;a++)n.fillStyle=(a+r)%2?"#3c2d20":"#d8c7a2",n.fillRect(a*s/8,r*s/8,s/8,s/8)},128);return nn.chess=new Ct({map:e,roughness:.8}),nn}function L2(i,t,e=14,n=0){const s=new Ke({map:xf(),transparent:!0,depthWrite:!1,opacity:.72,polygonOffset:!0,polygonOffsetFactor:-1});Nt(new fe(t,1.45),s,i,[0,.72,.342]);const r=pe((d,m,x)=>{d.fillStyle="#605d4c",d.fillRect(0,0,m,m);for(let g=0;g<12;g++)for(let p=-1;p<7;p++){const v=p*87+g%2*43,M=g*45;d.fillStyle=["#7d6049","#8b6d51","#9c7b59","#79654f"][Math.floor(x()*4)],d.fillRect(v+3,M+3,81,39),d.fillStyle="rgba(28,29,21,.22)",d.fillRect(v+3,M+36,81,5)}d.globalCompositeOperation="destination-in",d.beginPath();for(let g=0;g<60;g++){const p=g*Math.PI/30,v=185+x()*60;d.lineTo(m/2+Math.cos(p)*v,m/2+Math.sin(p)*v*.7)}d.closePath(),d.fill()}),a=new Ct({map:r,transparent:!0,alphaTest:.2,roughness:.93});for(const[d,m,x]of[[-t*.36,1.01,.75],[t*.33,.87,.55],[-.1,.56,.45]])Nt(new fe(x*2,x),a,i,[d,m,.349]);const o=Kn();for(const[d,m,x]of[[-t*.29,2.35,3.1],[t*.08,2,2.4],[t*.38,2.7,3.8],[-t*.44,1.75,2]])Nt(new fe(.17,x),s,i,[d,m,.344]);let l=0;for(let d=-t/2+1.55;d<t/2-1.1;d+=2.85,l++){if(n===0&&Math.abs(d+3.8)<1.65)continue;const m=(l+n)%4===1;G(i,[.78,.48,.06],[d,.39,.425],m?Sf:O.black,0),G(i,[.9,.07,.09],[d,.665,.44],o.stone,0),G(i,[.9,.06,.1],[d,.125,.45],o.stone,0);for(const g of[-.24,0,.24])G(i,[.02,.44,.02],[d+g,.39,.47],O.black,0);const x=d+1.42;if(x<t/2-.7){G(i,[.34,.24,.035],[x,.92,.342],O.black,0);for(let g=0;g<3;g++)G(i,[.28,.025,.012],[x,.86+g*.07,.365],O.rust,0)}}const c=n===0?2.47:n===37?-1.24:3.7;Nt(ch(.48,.64,n+1,2,2),o.poster,i,[c,1.58,.353],[0,0,.03]);const h=xi(910+n),u=[[-t/2+.58,0],[t/2-.58,2]];n===0&&u.push([-5.32,1]);for(const[d,m]of u)for(let x=0;x<30;x++){const g=.5+x*.17+h()*.09,p=d+Math.sin(x*.55+m)*.28+(h()-.5)*.2;Nt(new ts(.055+h()*.08,7),x%3?o.leafDark:o.green,i,[p,g,.355+h()*.045],[0,0,h()*Math.PI]).scale.set(1.35,.72,1)}for(const d of[-t*.3,t*.24])G(i,[.78,.98,.78],[d,e+.48,-.05],o.stone,0),G(i,[.94,.13,.94],[d,e+1.02,-.05],o.stone,0),zt(i,.09,.11,.24,[d-.16,e+1.19,-.05],O.rust,[0,0,0],10),zt(i,.09,.11,.24,[d+.16,e+1.19,-.05],O.rust,[0,0,0],10);for(const d of[-t*.12,t*.36])zt(i,.018,.018,1.42,[d,e+.76,.18],O.black,[0,0,0],8),G(i,[.88,.025,.025],[d,e+1.12,.18],O.black,0),G(i,[.58,.025,.025],[d,e+1.36,.18],O.black,0),G(i,[.025,.025,.72],[d,e+1.24,.18],O.black,0);const f=t*.16;Nt(new Fe(.37,.09,.13,20),O.silver,i,[f,e-1.48,.56],[1.02,0,-.32]),Io(i,[[f-.18,e-1.62,.34],[f,e-1.5,.58]],.016,O.black,4);for(let d=0;d<6;d++){if((d+n)%4===3)continue;const m=-t*.34+d*t*.13,x=e+.13;zn(i,.058,[m,x,.48],o.stone,[1.45,.82,.9],0),Bn(i,.032,[m+.065,x+.055,.49],O.black),G(i,[.11,.014,.035],[m-.085,x+.015,.47],O.black,0,[0,.2,.18])}}function _f(i,t,e,n,s,r,a,o){G(i,[n+.42,.078,.25],[t,e+s/2+.15,.55],o,0),G(i,[n+.24,.07,.14],[t,e+s/2+.225,.47],r,0);for(const l of[-1,1])G(i,[.074,s+.13,.2],[t+l*(n/2+.065),e,.54],o,0),G(i,[.095,.095,.1],[t+l*(n/2-.07),e-.2,.63],a,0);G(i,[n+.28,.045,.05],[t,e-s/2-.155,.754],O.silver,0),G(i,[.12,.24,.19],[t,e+s/2+.12,.56],r,0)}let Ga;function D2(){if(Ga)return Ga;const i=pe((n,s)=>{n.fillStyle="#b0a895",n.fillRect(0,0,s,s);for(let r=0;r<s;r+=24){const a=n.createLinearGradient(r,0,r+24,0);a.addColorStop(0,"#767c70"),a.addColorStop(.5,"#c3bbab"),a.addColorStop(1,"#929889"),n.fillStyle=a,n.fillRect(r,0,24,s)}},256),t=P2(),e=pe((n,s,r,a)=>{n.fillStyle="rgba(232,226,205,.94)",n.fillRect(0,0,s,26);for(let o=0;o<s;o+=22)n.beginPath(),n.arc(o+11,27,11,0,Math.PI,!1),n.fill();n.fillStyle="rgba(120,112,92,.55)";for(let o=0;o<180;o++)n.fillRect(r()*s,r()*38,2,2);n.fillStyle="rgba(232,226,205,.38)",n.fillRect(0,38,s,a-38)},256,128);return Ga={curtain:new Ct({map:i,roughness:1,side:Oe}),blind:new Ct({color:10067089,roughness:.9}),leaf:new Ct({color:4087359,roughness:1,flatShading:!0}),pot:new Ct({color:8414289,roughness:.94}),interior:new Ct({map:t,emissive:16777215,emissiveMap:t,emissiveIntensity:1.12,color:1708556,roughness:.85}),lace:new Ct({map:e,transparent:!0,alphaTest:.06,roughness:1,side:Oe})},Ga}function Mf(i,t,e=1,n=0,s=O.black){const r=new re;r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),i.add(r),zn(r,.16,[0,.15,-.02],s,[.95,.82,1.28]),Bn(r,.086,[0,.325,.13],s);for(const a of[-1,1])Nt(new Fe(.001,.032,.07,4),s,r,[a*.047,.405,.125],[0,0,-a*.16]),zt(r,.018,.02,.17,[a*.056,.085,.12],s,[0,0,0],8);return Io(r,[[.13,.08,-.16],[.22,.045,-.02],[.16,.055,.15]],.017,s,10),r}function yf(i,t,e,n,s,r,a,o,l=0){const c=D2(),h=Kn(),u=R2(l+811),f=Math.max(0,Math.min(3,Math.round((e-1.72)/2.95))),d=(m=.574)=>{for(const x of[-1,1]){const g=new fe(n*.27,s*.91,5,6),p=g.attributes.position;for(let v=0;v<p.count;v++)p.setZ(v,.008*Math.sin(p.getX(v)*80));g.computeVertexNormals(),Nt(g,c.curtain,i,[t+x*n*.34,e-.025,m]),G(i,[.035,.09,.025],[t+x*n*.24,e-.08,m+.018],O.gold,0)}Nt(new fe(n*.96,s*.17),c.lace,i,[t,e+s*.39,m+.004])};if(r==="lit")Nt(ch(n*.97,s*.97,u%8,4,2),c.interior,i,[t,e,.566]),u%3===0&&d(.576),u%4===1&&(zt(i,.006,.006,.34,[t+.18,e+s*.31,.59],O.black,[0,0,0],6),zt(i,.035,.095,.1,[t+.18,e+s*.13,.59],h.bulb,[0,0,0],14),Bn(i,.032,[t+.18,e+s*.055,.59],h.bulb,[1,1,1],0));else if(r==="curtain")d();else if(r==="blind"){for(let m=0;m<12;m++)G(i,[n*.94,.04,.019],[t,e+s/2-.08-m*.093,.581],c.blind,0,m>8?[.32,0,0]:[0,0,0]);for(const m of[-1,1])G(i,[.012,s*.68,.012],[t+m*n*.39,e+s*.08,.594],O.black,0);G(i,[n*.94,.045,.025],[t,e+s/2-1.13,.59],c.blind,0)}else if(r==="open"){const m=new re;m.position.set(t-n/2,e,.6),m.rotation.y=-.42,i.add(m),G(m,[n*.48,s*.91,.019],[n*.24,0,0],o,0);for(const x of[0,n*.48])G(m,[.038,s*.94,.05],[x,0,.025],a,0);for(const x of[-s*.47,s*.47])G(m,[n*.5,.038,.05],[n*.24,x,.025],a,0);G(m,[n*.48,.032,.05],[n*.24,.23,.025],a,0),zt(m,.014,.014,.1,[n*.45,-.05,.065],O.silver,[0,0,0],8)}if((r==="curtain"||r==="lit"||r==="open")&&u%3===0){const m=t+(u%2?.29:-.29);zt(i,.1,.075,.15,[m,e-s/2+.035,.79],c.pot,[0,0,0],12);for(const x of[-1,0,1])zn(i,.07,[m+x*.055,e-s/2+.17,.79],x?c.leaf:h.green,[1.25,.72,.65],0)}if(r==="open"&&u%5===0&&Mf(i,[t-.17,e-s/2-.015,.8],.58,0,O.black),f>0&&f<3){if(u%9===2){G(i,[n*.82,.16,.2],[t,e-s/2+.045,.74],c.pot,0);for(let m=0;m<6;m++)zn(i,.07,[t-n*.31+m*n*.12,e-s/2+.17,.74],m%2?h.green:c.leaf,[1.2,.72,.8],0);for(let m=0;m<7;m++)zn(i,.022,[t-n*.33+m*n*.105,e-s/2+.21,.78],m%3?O.red:O.cream,[1,1,1],0)}else if(u%11===5){G(i,[.64,.47,.24],[t+.16,e-s/2-.39,.59],a,0),Nt(new Fe(.15,.15,.025,20),O.black,i,[t+.16,e-s/2-.39,.72],[Math.PI/2,0,0]);for(const m of[-.1,0,.1])G(i,[.42,.018,.012],[t+.16,e-s/2-.39+m,.735],O.black,0);G(i,[.54,.035,.03],[t+.16,e-s/2-.64,.62],O.black,0)}else if(u%13===6)for(const m of[-1,1]){G(i,[.24,s*.9,.035],[t+m*(n/2+.18),e,.55],h.leafDark,0);for(let x=0;x<5;x++)G(i,[.18,.025,.014],[t+m*(n/2+.18),e-s*.3+x*s*.15,.575],O.black,0)}}if(f===0&&r!=="open"&&u%3===1){for(const m of[-.36,-.18,0,.18,.36])G(i,[.018,s*.85,.018],[t+m*n,e,.645],O.black,0);for(const m of[-s*.28,s*.28])G(i,[n*.84,.02,.02],[t,e+m,.65],O.black,0)}if(f>=2&&u%11===0){const m=t+n*.24,x=e-s/2+.025;zn(i,.055,[m,x,.76],h.stone,[1.45,.82,.9],0),Bn(i,.031,[m+.062,x+.052,.76],O.black),G(i,[.1,.013,.032],[m-.082,x+.012,.76],O.black,0,[0,.15,.16])}}function U2(i,t){const{stone:e,iron:n,green:s,contact:r,bulb:a}=Kn();zt(i,.64,.64,.038,[2.5,.012,2.5],n,[0,0,0],64),we(i,.56,.015,[2.5,.033,2.5],O.rust,[Math.PI/2,0,0]),we(i,.62,.014,[2.5,.033,2.5],O.silver,[Math.PI/2,0,0]);for(let c=-5;c<=5;c++){const h=Math.sqrt(.27040000000000003-(c*.085)**2)*2;G(i,[h,.012,.018],[2.5,.04,2.5+c*.085],O.black,.003)}for(const c of[2.23,2.77])G(i,[.05,.01,.11],[c,.049,2.5],O.black,.005);for(const c of[-4.55,4.55]){G(i,[.09,.38,.14],[c,2.49,-6.43],n,.02),zt(i,.018,.018,.42,[c,2.78,-6.22],n,[Math.PI/2,0,0],12),zt(i,.19,.09,.12,[c,2.7,-6.03],n,[0,0,0],32),Bn(i,.085,[c,2.56,-6.03],a,[1,1.65,1]);const h=new co(16757350,2.4,4.2,2);h.position.set(c,2.48,-5.97),t.add(h)}G(i,[3.35,.1,.5],[0,.036,-6.03],e,.03);for(let c=0;c<12;c++)G(i,[.25,.026,.54],[-1.42+c*.26,.096,-6.02],e,.012);const o=new Ni([new L(-6,5.3,-6.5),new L(-1,4.96,-6.47),new L(4.2,5.31,-6.46)]);Nt(new Tn(o,24,.011,5),O.rubber,i);const l=pe((c,h)=>{c.fillStyle="#c7bba0",c.fillRect(0,0,h,h),c.fillStyle="#4a5143",c.textAlign="center",c.font="bold 52px Georgia",c.fillText("СОСЕДИ!",h/2,94),c.font="25px Georgia";for(const[u,f]of["Пожалуйста,","закрывайте ворота.","","Белые ночи —","не повод не спать."].entries())c.fillText(f,h/2,165+u*41);c.strokeStyle="#555b4d";for(let u=28;u<h;u+=43)c.beginPath(),c.moveTo(u,h-90),c.lineTo(u,h),c.stroke()});Nt(new fe(.42,.56),new Ct({map:l,roughness:.95,side:Oe}),i,[-4.95,1.81,-6.45],[0,0,-.05]);for(const[c,h,u,f]of[...hf.map(d=>[d.x,d.z,d.scale*3.5,d.scale*3]),[3.5,-5.8,2.9,1],[-3.3,-2.6,1.4,1.1]])Nt(new fe(u,f),r,i,[c,.022,h],[-Math.PI/2,0,0]);for(let c=0;c<30;c++){const h=-7.1+Ha()*1.3,u=-6+Ha()*6,f=.03+Ha()*.13,d=new zi;d.moveTo(-.012,0),d.quadraticCurveTo(.014,f*.7,.025,f),d.lineTo(.006,0),Nt(new Ao(d),s,i,[h,.025,u],[0,Ha()*6,0])}z2(i)}function Fu(i,t,e){const n=Kn(),s=new re;s.position.set(...t),s.rotation.y=e,i.add(s);for(const r of[-.15,0,.15])G(s,[1.78,.045,.1],[0,.46,r],n.wood,0);for(const r of[.74,.9])G(s,[1.78,.09,.035],[0,r,-.27],n.wood,0,[-.1,0,0]);for(const r of[-1,1])G(s,[.055,.46,.52],[r*.84,.23,0],n.iron,0),G(s,[.055,.04,.56],[r*.84,.67,0],O.rust,0),G(s,[.055,.56,.055],[r*.84,.66,-.27],n.iron,0,[-.1,0,0]);return s}function Va(i,t,e,n,s){const r=Kn(),a=new re,o=xi(s);a.position.set(...t),a.rotation.y=e,i.add(a),G(a,[n,.1,.78],[0,.05,0],O.rust,0);for(const c of[-1,1]){G(a,[n,.13,.055],[0,.075,c*.42],r.stone,0),G(a,[n,.025,.025],[0,.34,c*.47],r.iron,0);for(let h=-n/2+.25;h<n/2;h+=.58)G(a,[.025,.34,.025],[h,.17,c*.47],r.iron,0)}const l=Math.max(4,Math.round(n*1.7));for(let c=0;c<l;c++){const h=-n/2+.35+c*(n-.7)/Math.max(1,l-1)+(o()-.5)*.18,u=(o()-.5)*.42,f=c%3?r.leafDark:r.green;zn(a,.15+o()*.15,[h,.19+o()*.08,u],f,[1.45,.58,.95],0),zn(a,.08+o()*.07,[h+.13+o()*.08,.15+o()*.1,u+(o()-.5)*.18],f,[1.3,.62,.9],0),zn(a,.07+o()*.06,[h-.12-o()*.07,.14+o()*.09,u+(o()-.5)*.16],f,[1.2,.6,.9],0)}for(let c=0;c<18;c++)zn(a,.018+o()*.014,[-n/2+.25+o()*(n-.5),.17+o()*.16,(o()-.5)*.52],[O.red,O.cream,O.gold][c%3],[1,1,1],0);for(let c=0;c<12;c++)Nt(new Fe(.001,.018,.13,5),r.green,a,[-n/2+.2+o()*(n-.4),.13,(o()-.5)*.58],[o()*.3,0,o()*.3]);return a}function N2(i,t,e,n,s=9){const r=Kn();Io(i,C2(t,e,n,7),.007,O.black,18);for(let a=1;a<s;a++){const o=a/s,l=t[0]+(e[0]-t[0])*o,c=t[1]+(e[1]-t[1])*o-n*4*o*(1-o),h=t[2]+(e[2]-t[2])*o;G(i,[.006,.07,.006],[l,c-.035,h],O.black,0),Bn(i,.026,[l,c-.095,h],r.bulb,[1,1,1],0)}}function Wa(i,t,e,n,s){const r=Kn();G(i,[.07,.36,.13],[t,e,n],r.iron,.01),zt(i,.016,.016,.4,[t+s*.2,e+.2,n],r.iron,[0,0,Math.PI/2],8),zt(i,.07,.18,.13,[t+s*.4,e+.12,n],r.iron,[0,0,0],18),Bn(i,.068,[t+s*.4,e-.015,n],r.bulb,[1,1.25,1],0),Nt(new fe(.85,.85),r.glow,i,[t+s*.43,e-.02,n],[0,s>0?Math.PI/2:-Math.PI/2,0])}function F2(i,t,e,n=1){const s=Kn(),r=new re;r.position.set(...t),r.rotation.y=e,r.scale.setScalar(n),i.add(r),zn(r,.072,[0,.075,0],s.stone,[1,.78,1.35]),Bn(r,.037,[0,.135,.085],O.black),Nt(new Fe(.001,.011,.038,5),O.gold,r,[0,.13,.128],[Math.PI/2,0,0]),G(r,[.075,.014,.1],[0,.075,-.105],O.black,0,[.22,0,0]);for(const a of[-1,1])G(r,[.008,.055,.008],[a*.025,.028,.01],O.rust,0);return r}function O2(i,t,e){const n=Kn(),s=new re;s.position.set(...t),s.rotation.y=e,i.add(s);for(let r=0;r<3;r++){const a=.08+r*.16;for(const o of[-.36,-.18,0,.18,.36])G(s,[1.08,.026,.105],[0,a+.055,o],r%2?O.rust:n.wood,0);for(const o of[-.45,0,.45])for(const l of[-.36,0,.36])G(s,[.1,.085,.1],[o,a,l],O.rust,0)}return G(s,[.58,.38,.48],[.05,.72,0],O.paper,.01,[0,.12,0]),s}function z2(i){const t=Kn();Fu(i,[-5.45,0,-.75],Math.PI/2),Fu(i,[5.7,0,-5.25],0),Va(i,[-7.02,0,1.95],Math.PI/2,4.8,21),Va(i,[8.02,0,1.75],Math.PI/2,4.3,33),Va(i,[5.95,0,-6.08],0,3.5,47),Va(i,[-6.35,0,-6.08],0,2.1,58),N2(i,[-7.55,5,-3.6],[-2.35,5.05,-6.55],.34,9),Wa(i,-7.62,2.75,-4.9,1),Wa(i,-7.62,2.75,3.8,1),Wa(i,8.62,2.75,-4.9,-1),Wa(i,8.62,2.75,2.8,-1);for(let a=0;a<8;a++){const o=a/7,l=-3.8+2.05*o+(a%2?.07:-.06),c=-5.55+9.65*o;G(i,[.96,.035,.72],[l,.018,c],t.stone,0,[0,.1+(a%3-1)*.035,0]),G(i,[.78,.012,.035],[l,.04,c+.34],t.leafDark,0,[0,.1,0])}zt(i,.035,.05,.66,[-4.5,.33,-1.85],t.iron,[0,0,0],12),G(i,[.66,.045,.66],[-4.5,.68,-1.85],t.wood,.01),Nt(new fe(.58,.58),t.chess,i,[-4.5,.706,-1.85],[-Math.PI/2,0,.12]);for(const[a,o]of[[-5.05,-1.85],[-3.95,-1.85]])zt(i,.19,.16,.08,[a,.42,o],t.wood,[0,0,0],18),zt(i,.035,.045,.4,[a,.2,o],t.iron,[0,0,0],10);for(let a=0;a<8;a++)Bn(i,.026,[-4.68+a%4*.12,.735,-1.98+Math.floor(a/4)*.28],a%2?O.black:O.cream,[1,.75,1],0);O2(i,[-6.5,0,-4.9],.15);const e=new re;e.position.set(-7.42,0,-4.05),e.rotation.z=.07,i.add(e),G(e,[.07,2.05,.96],[0,1.03,0],t.wood,.01);for(const a of[.55,1.25,1.72])G(e,[.018,a===1.25?.48:.34,.68],[.047,a,0],O.rust,0);Bn(e,.035,[.075,1.02,.34],O.silver);for(let a=0;a<3;a++)Nt(new ci(.34,.105,8,26),O.rubber,i,[7.58,.13+a*.22,-5.82],[Math.PI/2,0,a*.2]);Nt(new ci(.34,.105,8,26),O.rubber,i,[7.03,.36,-5.72],[.2,.35,1.25]);const n=new re;n.position.set(7.5,0,-3),n.rotation.y=.04,i.add(n),G(n,[.62,.58,1.72],[0,.58,0],O.leather,.18),G(n,[.54,.46,1],[0,1.02,-.12],O.leather,.19),G(n,[.5,.34,.46],[0,1.04,.58],O.leather,.16);for(const a of[-.42,.22])G(n,[.65,.018,.035],[0,.84,a],O.black,0);for(const a of[-.58,.58])Nt(new Fe(.29,.29,.09,20),O.rubber,n,[0,.29,a],[0,0,Math.PI/2]);const s=new re;s.position.set(6.35,0,4.5),s.rotation.y=-.55,i.add(s),G(s,[.1,.035,.6],[0,.1,0],O.red,.01);for(const a of[-.25,.25])Nt(new Fe(.075,.075,.035,14),O.black,s,[0,.075,a],[0,0,Math.PI/2]);Io(s,[[0,.1,.27],[0,.48,.34],[0,.76,.4]],.016,O.silver,8),G(s,[.36,.025,.025],[0,.78,.4],O.black,0),Nt(new fe(.88,2.35),t.chalk,i,[4.55,.018,3.65],[-Math.PI/2,0,.22]),Bn(i,.16,[-4.72,.16,1.85],O.red,[1,.92,1]),Mf(i,[-4.32,0,-.22],1,1.49,O.black),[[3.45,1.25,-.7],[3.75,1.48,2.4],[3.95,1.18,.8],[3.62,1.72,-2.2],[4.12,1.5,2.9]].forEach(([a,o,l],c)=>F2(i,[a,0,o],l,.9+c*.04));for(let a=0;a<14;a++)zn(i,.012,[3.45+a*37%70/100,.025,1.15+a*53%55/100],O.cream,[1,.55,1],0);for(const[a,o,l,c,h]of[[-4.5,-5.35,1.5,2.5,.1],[4.5,-5.3,1.5,2.5,-.08],[-6.95,-4.85,1.7,2.3,1.45],[7.95,-4.85,1.7,2.3,-1.45],[-1.2,-5.65,1.9,1.5,0],[2.5,2.5,1.6,1.6,.4]]){const u=Nt(new fe(l,c),t.glow,i,[a,.019,o],[-Math.PI/2,0,h]);u.renderOrder=1}for(const[a,o,l,c]of[[7.5,-3,1.6,2.5],[-6.5,-4.9,1.7,1.5],[5.7,-5.25,2.4,1.2],[-5.45,-.75,1.4,2.4]])Nt(new fe(l,c),t.contact,i,[a,.021,o],[-Math.PI/2,0,0])}const Sf=new Ct({color:6048302,emissive:16758629,emissiveIntensity:1.9,roughness:.65});function B2(i,t,e){for(const o of[-1.09,1.09])for(const l of[.63,1.22,1.84])zt(i,.027,.027,.016,[o,l,.854],O.silver,void 0,8),G(i,[.016,.003,.005],[o,l,.866],O.black,.001);for(const o of[-1,1])for(let l=.53;l<1.95;l+=.14){const c=ji(i,[.013,.035,.007],[o*1.155,l,.827],O.rust);c.rotation.z=o*.2}for(const o of[-.92,.92])G(i,[.21,.06,.3],[o,.42,.6],O.silver,.018),G(i,[.075,.025,.21],[o,.305,.81],O.silver,.008,[.2,0,0]);for(const o of[-.9,.9]){G(t,[.2,.032,.2],[o,.114,.12],O.silver,.008);for(const l of[-.065,.065])zt(t,.022,.022,.012,[o+l,.139,.12],O.silver,[0,0,0],8)}const n=new Ct({color:1055507,roughness:.94});G(i,[2.44,.012,1.61],[0,2.031,0],n,.01);const s=pe((o,l,c)=>{for(let h=0;h<1800;h++){const u=c(),f=c();u>.1&&u<.9&&f<.82||(o.fillStyle=h%4?"rgba(90,54,29,.45)":"rgba(154,164,147,.65)",o.fillRect(u*l,f*l,1+c()*7,1+c()*3))}for(const h of[.055,.945]){const u=o.createLinearGradient(0,0,0,l);u.addColorStop(0,"rgba(67,42,24,0)"),u.addColorStop(.5,"rgba(67,42,24,.35)"),u.addColorStop(1,"rgba(35,34,26,.5)"),o.fillStyle=u,o.fillRect(h*l,0,6,l)}}),r=new Ct({map:s,transparent:!0,alphaTest:.025,depthWrite:!1,roughness:.86});Nt(new fe(2.35,1.43),r,i,[0,1.18,.876]),Nt(new fe(1.43,1.36),r,i,[1.287,1.16,0],[0,Math.PI/2,0]);for(const o of[-1.14,1.14])G(t,[.025,.006,.48],[o,.114,1.6],O.silver,.002);const a=pe((o,l,c)=>{o.fillStyle="#b1aa80",o.fillRect(0,0,l,l),o.fillStyle="#384634",o.textAlign="center",o.font="bold 53px Arial",o.fillText("1100 л",l/2,170),o.font="26px Arial",o.fillText("ТВЁРДЫЕ БЫТОВЫЕ",l/2,262),o.fillText("ОТХОДЫ",l/2,306),o.font="20px monospace",o.fillText("СПБ • ИНВ. 0017",l/2,410);for(let h=0;h<700;h++)o.fillStyle="rgba(62,52,31,.1)",o.fillRect(c()*l,c()*l,3,2)});Nt(new fe(.42,.37),new Ct({map:a,roughness:.84}),i,[1.284,1.09,.05],[0,Math.PI/2,0])}const k2=new Ct({color:3883064,roughness:.82});function H2(i,{width:t=23,height:e=13.5,stone:n,trim:s,dark:r,wall:a,glass:o,lit:l,seed:c=101,gateX:h=0}){const u=Kn(),f=xi(c*7+13),d=1.55,m=2.55,x=d,g=m+x,p=new zi;p.moveTo(-t/2,0),p.lineTo(t/2,0),p.lineTo(t/2,e),p.lineTo(-t/2,e),p.closePath();const v=new lo;v.moveTo(h-d,0),v.lineTo(h-d,m),v.absarc(h,m,x,Math.PI,0,!0),v.lineTo(h+d,0),v.closePath(),p.holes.push(v),Nt(new wo(p,{depth:.65,bevelEnabled:!1,curveSegments:22}),a,i,[0,0,-.325]);for(const[C,N]of[[-t/2,h-d-.12],[h+d+.12,t/2]])G(i,[N-C,.75,.78],[(C+N)/2,.375,.025],n,0);for(const C of[3.28,6.2,9.15])for(const[N,F]of[[-t/2,h-d-.12],[h+d+.12,t/2]]){const z=F-N;z<.5||(G(i,[z,.14,.87],[(N+F)/2,C,.055],s,0),G(i,[z,.07,.98],[(N+F)/2,C+.09,.08],n,0))}G(i,[t,.35,1.06],[0,e-.12,.05],s,0);for(const C of[-1,1])G(i,[.36,m+.05,.62],[h+C*(d+.18),m/2,.06],n,.02);const _=new Yr(0,0,x+.2,x+.2,0,Math.PI,!1,0).getPoints(30).map(C=>new L(C.x,C.y,0));Nt(new Tn(new Ni(_),30,.17,7,!1),n,i,[h,m,.06]),G(i,[.26,.62,.72],[h,g+.16,.09],n,.02);for(let C=1;C<7;C++){const N=Math.PI*C/7,F=Math.cos(N)*(x+.2),z=Math.sin(N)*(x+.2);G(i,[.17,.3,.52],[h+F,m+z,.03],n,.012,[0,0,-N+Math.PI/2])}const T=new Ct({color:1909020,roughness:.96});G(i,[d*2+.6,.06,3.6],[h,0,-1.85],n,0),G(i,[.24,4.6,3.6],[h-d-.32,2.3,-1.85],T,0),G(i,[.24,4.6,3.6],[h+d+.32,2.3,-1.85],T,0),G(i,[3.4,.2,3.6],[h,g+.62,-1.85],n,0),G(i,[3.4,4.8,.12],[h,2.4,-3.7],T,0);const b=pe((C,N)=>{const F=C.createLinearGradient(0,0,0,N);F.addColorStop(0,"rgba(52,60,58,1)"),F.addColorStop(.42,"rgba(85,74,54,1)"),F.addColorStop(1,"rgba(34,38,34,1)"),C.fillStyle=F,C.fillRect(0,0,N,N);const z=C.createRadialGradient(N*.5,N*.3,0,N*.5,N*.3,N*.46);z.addColorStop(0,"rgba(255,198,118,.95)"),z.addColorStop(.45,"rgba(255,174,92,.38)"),z.addColorStop(1,"rgba(255,160,80,0)"),C.fillStyle=z,C.fillRect(0,0,N,N)});Nt(new fe(3.2,4.6),new Ke({map:b,color:12172724,fog:!1}),i,[h,2.3,-3.63]),Nt(new fe(3,4.2),new Ke({map:b,color:6580319,toneMapped:!1}),i,[h,2.25,-4.6]),G(i,[1.1,.4,.36],[h-.55,2.1,-2.1],T,0),G(i,[.5,.9,.3],[h+.7,.28,-2.2],T,0);const E=(C,N=0)=>{const F=new re,z=d-.06,V=m-.1;F.position.set(h+C*(d-.02),0,.02),F.rotation.y=C*N,i.add(F);const B=-C*z/2;for(const Y of[.07,V])G(F,[z,.1,.09],[B,Y,0],O.black,.012);for(const Y of[B-z/2+.045,B+z/2-.045])G(F,[.09,V,.09],[Y,V/2,0],O.black,.012);const k=.92;G(F,[z-.12,k,.07],[B,k/2+.1,0],k2,.01);for(let Y=0;Y<3;Y++)G(F,[z-.18,.03,.09],[B,k*(Y+.5)/3+.1,.012],O.rust,0);for(let Y=B-z/2+.14;Y<B+z/2-.1;Y+=.17)G(F,[.03,V-k-.24,.03],[Y,k+.12+(V-k-.24)/2,.012],O.black,0);for(const Y of[V-.12,2.02,k+.32])G(F,[z-.14,.05,.055],[B,Y,.012],O.black,0);for(const Y of[.42,.95])zt(F,.035,.035,.09,[B+C*(z/2-.02),Y,0],O.black,[0,0,0],10);return we(F,.1,.013,[B,V*.8,.02],O.black),F};E(-1,.3),E(1,0);for(let C=-3;C<=3;C++){const N=h+C*.42,F=Math.sqrt(Math.max(0,x*x-N*N)),z=m+F*.96,V=m-.1;z-V<.12||G(i,[.028,z-V,.028],[N,(z+V)/2,.055],O.black,0)}const y=new Yr(0,0,x-.02,x-.02,0,Math.PI,!1,0).getPoints(20).map(C=>new L(C.x,C.y,0));Nt(new Tn(new Ni(y),20,.03,5,!1),O.black,i,[h,m,.055]);for(let C=0;C<5;C++){const N=Math.PI*(C+1)/6;G(i,[.05,.05,.05],[h+Math.cos(N)*(x-.02),m+Math.sin(N)*(x-.02),.075],O.black,0)}zt(i,.02,.02,.5,[h,g+.9,.36],O.black,[0,0,0],8),zt(i,.11,.2,.14,[h,g+.5,.36],O.black,[0,0,0],14),Bn(i,.082,[h,g+.4,.36],u.bulb,[1,1.45,1],0),Nt(new fe(1.5,1.5),u.glow,i,[h,g+.36,.5]);const S=new Ct({map:Tc("",{bg:"#223c4a",color:"#ece8d5",lines:["ДОХОДНЫЙ ДОМ","17 · 2"],font:66}),roughness:.42});G(i,[.62,.46,.06],[h+2.3,2.35,.35],O.black,0),Nt(new fe(.57,.41),S,i,[h+2.3,2.35,.39]);const R=Math.floor(t/2.47);for(let C=0;C<R;C++)for(let N=0;N<4;N++){const F=(C-(R-1)/2)*2.47,z=1.72+N*2.95;if(Math.abs(F-h)<3.3&&N<2)continue;const V=1.16,B=1.91,k=300+N*10+C;G(i,[V+.26,B+.27,.14],[F,z,.38],s,0),G(i,[V+.05,B+.06,.1],[F,z,.47],r,0);const Y=uf(C,N,2),nt=Y==="lit"?l:o[(C+N)%o.length];G(i,[V,B,.04],[F,z,.54],nt,0);for(const K of[-V/2,V/2,0])G(i,[.048,B,.09],[F+K,z,.58],n,0);for(const K of[-B/2,B/2,.24])G(i,[V,.047,.09],[F,z+K,.58],n,0);G(i,[V+.4,.12,.43],[F,z-B/2-.09,.55],s,0),_f(i,F,z,V,B,n,r,s),N>=1&&yf(i,F,z,V,B,Y,s,nt,k)}for(const C of[-t/2+.35,t/2-.38]){zt(i,.07,.07,e,[C,e/2,.53],r,[0,0,0],12);for(let N=1;N<e;N+=2)zt(i,.087,.087,.055,[C,N,.53],O.rust,[0,0,0],12)}const I=new Ke({map:xf(),transparent:!0,depthWrite:!1,opacity:.66,polygonOffset:!0,polygonOffsetFactor:-1});for(const[C,N]of[[-t/2,h-d-.5],[h+d+.5,t/2]].filter(([F,z])=>z-F>1))Nt(new fe(N-C,.9),I,i,[(C+N)/2,.55,.345]);Nt(ch(.48,.64,c%4,2,2),u.poster,i,[h-3.15,1.62,.353],[0,0,.03]);for(let C=0;C<22;C++){const N=C<11?-t/2+.55:t/2-.55,F=N+Math.sin(C*.55)*.26+(f()-.5)*.2;Nt(new ts(.05+f()*.075,7),C%3?u.leafDark:u.green,i,[F,.5+C*.17,.355+f()*.04],[0,0,f()*Math.PI])}for(const C of[-t*.32,t*.3])G(i,[.78,.98,.78],[C,e+.48,-.05],n,0),G(i,[.94,.13,.94],[C,e+1.02,-.05],n,0),zt(i,.09,.11,.24,[C-.16,e+1.19,-.05],O.rust,[0,0,0],10),zt(i,.09,.11,.24,[C+.16,e+1.19,-.05],O.rust,[0,0,0],10);return zt(i,.018,.018,1.42,[t*.12,e+.76,.18],O.black,[0,0,0],8),G(i,[.88,.025,.025],[t*.12,e+1.12,.18],O.black,0),G(i,[.58,.025,.025],[t*.12,e+1.36,.18],O.black,0),i}function Ou(i,t,e,n,s){G(i,[t+.1,.34,1],[0,e+.17,.28],s,.01),G(i,[t+.1,.08,1.28],[0,e+.36,.34],Dr(s),0),Nt(new Jn(t+.1,.1,1.05),n,i,[0,e+.47,.62],[.22,0,0]),G(i,[t+.1,.16,.12],[0,e+.5,1.06],s,0);for(const r of[-t*.34,t*.18,-t*.05])G(i,[.16,.2,.16],[r,e+.62,.95],O.rust,0)}function Dr(i){return Dr.mat||(Dr.mat=i.clone(),Dr.mat.color.offsetHSL(0,-.03,.04)),Dr.mat}function G2(){const i=new re;i.name="sky";const t=new ur(55,32,18),e=[],n=new Zt("#6a5142"),s=new Zt("#253a55"),r=new Zt("#08111f");for(let E=0;E<t.attributes.position.count;E++){const w=Vt.smoothstep(t.attributes.position.getY(E)/55,-.04,.62);(w<.4?n.clone().lerp(s,w/.4):s.clone().lerp(r,(w-.4)/.6)).toArray(e,E*3)}t.setAttribute("color",new he(e,3));const a=new Xt(t,new Ke({vertexColors:!0,side:rn,depthWrite:!1,fog:!1,toneMapped:!1}));a.renderOrder=-30,a.name="sky-dome",i.add(a);const o=pe((E,w)=>{const y=E.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);y.addColorStop(0,"rgba(255,255,255,1)"),y.addColorStop(.34,"rgba(255,255,255,.86)"),y.addColorStop(.62,"rgba(255,255,255,.22)"),y.addColorStop(1,"rgba(255,255,255,0)"),E.fillStyle=y,E.fillRect(0,0,w,w)},64),l=xi(20261),c=105,h=[],u=[],f=new Zt("#e6efff"),d=new Zt("#ffe8c6"),m=new Zt("#bcd3ff");for(let E=0;E<c;E++){const w=l()*Math.PI*2,y=.9+Math.pow(l(),.65)*.58,S=49+l()*3,R=Math.cos(y);h.push(Math.sin(w)*R*S,Math.sin(y)*S,-Math.cos(w)*R*S);const I=l(),C=(I>.72?d:I>.34?f:m).clone(),N=Vt.clamp((y-.9)/.25,0,1),F=(.55+Math.pow(l(),1.4)*.45)*N;u.push(C.r*F,C.g*F,C.b*F)}const x=new Ae;x.setAttribute("position",new he(h,3)),x.setAttribute("color",new he(u,3));const g=new pp(x,new Xd({map:o,size:2.9,sizeAttenuation:!1,vertexColors:!0,transparent:!0,depthWrite:!1,blending:Hr,fog:!1,toneMapped:!1,alphaTest:.01}));g.renderOrder=-20,g.frustumCulled=!1,g.name="sky-stars",i.add(g);const p=new L(-.16,.883,-.442).normalize(),v=p.clone().multiplyScalar(44),M=pe((E,w,y)=>{const S=w*.47,R=w/2,I=w/2;E.clearRect(0,0,w,w);const C=E.createRadialGradient(R-S*.22,I-S*.26,S*.06,R,I,S);C.addColorStop(0,"#fbfcf7"),C.addColorStop(.62,"#e6e9ee"),C.addColorStop(.9,"#cfd5e0"),C.addColorStop(1,"#b9c1cf"),E.fillStyle=C,E.beginPath(),E.arc(R,I,S,0,Math.PI*2),E.fill(),E.save(),E.beginPath(),E.arc(R,I,S,0,Math.PI*2),E.clip();for(let F=0;F<26;F++){const z=y()*Math.PI*2,V=Math.sqrt(y())*S*.92,B=R+Math.cos(z)*V,k=I+Math.sin(z)*V,Y=S*(.03+y()*.13),nt=E.createRadialGradient(B,k,0,B,k,Y);nt.addColorStop(0,`rgba(132,142,160,${.1+y()*.17})`),nt.addColorStop(1,"rgba(132,142,160,0)"),E.fillStyle=nt,E.beginPath(),E.arc(B,k,Y,0,Math.PI*2),E.fill()}for(let F=0;F<5;F++){const z=y()*Math.PI*2,V=Math.sqrt(y())*S*.62,B=R+Math.cos(z)*V,k=I+Math.sin(z)*V,Y=S*(.16+y()*.16),nt=E.createRadialGradient(B,k,0,B,k,Y);nt.addColorStop(0,"rgba(150,158,174,.16)"),nt.addColorStop(1,"rgba(150,158,174,0)"),E.fillStyle=nt,E.beginPath(),E.arc(B,k,Y,0,Math.PI*2),E.fill()}const N=E.createRadialGradient(R,I,S*.2,R,I,S);N.addColorStop(0,"rgba(255,255,255,0)"),N.addColorStop(.78,"rgba(150,162,186,.13)"),N.addColorStop(1,"rgba(96,110,138,.42)"),E.fillStyle=N,E.beginPath(),E.arc(R,I,S,0,Math.PI*2),E.fill(),E.restore()},256);M.colorSpace=$e;const _=new Gh(new vc({map:M,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}));_.position.copy(v),_.scale.set(2.25,2.25,1),_.name="sky-moon",i.add(_);const T=pe((E,w)=>{const y=E.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);y.addColorStop(0,"rgba(226,236,255,.9)"),y.addColorStop(.22,"rgba(198,216,255,.34)"),y.addColorStop(.5,"rgba(170,196,255,.10)"),y.addColorStop(1,"rgba(150,180,255,0)"),E.fillStyle=y,E.fillRect(0,0,w,w)},128),b=new Gh(new vc({map:T,color:14543103,transparent:!0,opacity:.6,depthWrite:!1,blending:Hr,fog:!1,toneMapped:!1}));return b.position.copy(v).multiplyScalar(.99),b.scale.set(9.5,9.5,1),b.name="sky-moon-glow",i.add(b),{group:i,dome:a,stars:g,moon:_,glow:b,moonDirection:p.clone(),update(){}}}const Zi=Math.PI/180;function Ar(i,t,e,n=1,s=1,r=!0){const a=new Uint8Array(i*t*4);for(let l=0;l<t;l++)for(let c=0;c<i;c++){const h=(l*i+c)*4,[u,f,d]=e(c,l,i,t);a[h]=u,a[h+1]=f,a[h+2]=d,a[h+3]=255}const o=new Jc(a,i,t,On);return o.wrapS=di,o.wrapT=di,o.repeat.set(n,s),o.colorSpace=r?$e:mn,o.needsUpdate=!0,o}function $s(i,t){const e=Math.imul(i*374761393+t*668265263,1274126177)>>>0;return((e^e>>>13)>>>0)/4294967295}function V2(){const i=Ar(64,64,(r,a)=>{const o=r>>3&1?r+a:r-a+64,l=Math.sin(o%8*Math.PI*.25)*26,c=($s(r,a)-.5)*28,h=Math.max(0,Math.min(255,Math.round(128+l+c)));return[h,h,h]},7,9,!1),t=Ar(64,64,(r,a)=>{const o=($s(r,a)-.5)*42+($s(r>>1,a>>1)-.5)*22,l=Math.max(0,Math.min(255,Math.round(128+o)));return[l,l,l]},5,5,!1),e=Ar(64,64,(r,a)=>{const o=Math.sin(r/64*Math.PI*16)*46,l=Math.sin(a/64*Math.PI*24+(r>>1&1)*1.2)*22,c=Math.max(0,Math.min(255,Math.round(128+o+l)));return[c,c,c]},4,4,!1),n=Ar(64,64,(r,a)=>{const o=Math.sin(r/64*Math.PI*28)*34,l=($s(r,a)-.5)*18,c=Math.max(0,Math.min(255,Math.round(128+o+l)));return[c,c,c]},6,8,!1),s=Ar(64,64,(r,a)=>{const o=$s(r,a),l=$s(r+3>>1,a+5>>1),c=Math.max(0,Math.min(255,Math.round(118+(o-.5)*34+(l-.5)*38)));return[c,c,c]},4,4,!1);return{woolBump:i,suedeBump:t,knitBump:e,trouserBump:n,bootBump:s}}function ti(i,t){const e=i.index?i.toNonIndexed():i.clone();return e.applyMatrix4(t),e.getAttribute("normal")||e.computeVertexNormals(),i.dispose(),e}function Zs(i){const t=i.index?i.toNonIndexed():i.clone(),e=t.getAttribute("position").array;for(let s=0;s<e.length;s+=3)e[s]=-e[s];for(let s=0;s<e.length;s+=9)for(let r=0;r<3;r++){const a=e[s+3+r];e[s+3+r]=e[s+6+r],e[s+6+r]=a}const n=t.getAttribute("uv");if(n){const s=n.array;for(let r=0;r<s.length;r+=6){const a=s[r+2],o=s[r+3];s[r+2]=s[r+4],s[r+3]=s[r+5],s[r+4]=a,s[r+5]=o}}return t.computeVertexNormals(),t}function ii(i){const t=i.map(l=>{const c=l.index?l.toNonIndexed():l.clone();return c.getAttribute("normal")||c.computeVertexNormals(),l.dispose(),c});let e=0;for(const l of t)e+=l.getAttribute("position").count;const n=new Float32Array(e*3),s=new Float32Array(e*3),r=new Float32Array(e*2);let a=0;for(const l of t){const c=l.getAttribute("position"),h=l.getAttribute("normal"),u=l.getAttribute("uv");if(n.set(c.array,a*3),s.set(h.array,a*3),u&&u.itemSize>=2)for(let f=0;f<c.count;f++)r[(a+f)*2]=u.getX(f),r[(a+f)*2+1]=u.getY(f);a+=c.count,l.dispose()}const o=new Ae;return o.setAttribute("position",new Ce(n,3)),o.setAttribute("normal",new Ce(s,3)),o.setAttribute("uv",new Ce(r,2)),o.computeBoundingSphere(),o}function Ge(i,t=24,{capStart:e=!1,capEnd:n=!1}={}){const s=i.length,r=t+1,a=(e?1:0)+(n?1:0),o=new Float32Array((s*r+a)*3),l=new Float32Array((s*r+a)*2),c=[];for(let k=0;k<s;k++){const Y=k/Math.max(1,s-1),nt=i[k];for(let K=0;K<=t;K++){const mt=K/t,It=mt*Math.PI*2,[Ut,$,rt]=nt(It,mt),_t=(k*r+K)*3,Tt=(k*r+K)*2;o[_t]=Ut,o[_t+1]=$,o[_t+2]=rt,l[Tt]=mt,l[Tt+1]=Y}}let h=0,u=0,f=0,d=0;for(let k=0;k<Math.min(2,s);k++)for(let Y=0;Y<t;Y++){const nt=(k*r+Y)*3;h+=o[nt],u+=o[nt+1],f+=o[nt+2],d++}h/=Math.max(1,d),u/=Math.max(1,d),f/=Math.max(1,d);const m=o[0],x=o[1],g=o[2],p=o[3],v=o[4],M=o[5],_=o[r*3],T=o[r*3+1],b=o[r*3+2],E=_-m,w=T-x,y=b-g,S=p-m,R=v-x,I=M-g,C=w*I-y*R,N=y*S-E*I,F=E*R-w*S,z=C*(m-h)+N*(x-u)+F*(g-f)<0;for(let k=0;k<s-1;k++)for(let Y=0;Y<t;Y++){const nt=k*r+Y,K=nt+1,mt=(k+1)*r+Y,It=mt+1;z?c.push(nt,K,mt,K,It,mt):c.push(nt,mt,K,K,mt,It)}let V=s*r;if(e){let k=0,Y=0,nt=0;for(let K=0;K<t;K++)k+=o[K*3],Y+=o[K*3+1],nt+=o[K*3+2];o[V*3]=k/t,o[V*3+1]=Y/t,o[V*3+2]=nt/t,l[V*2]=.5,l[V*2+1]=0;for(let K=0;K<t;K++)z?c.push(V,K+1,K):c.push(V,K,K+1);V++}if(n){const k=(s-1)*r;let Y=0,nt=0,K=0;for(let mt=0;mt<t;mt++)Y+=o[(k+mt)*3],nt+=o[(k+mt)*3+1],K+=o[(k+mt)*3+2];o[V*3]=Y/t,o[V*3+1]=nt/t,o[V*3+2]=K/t,l[V*2]=.5,l[V*2+1]=1;for(let mt=0;mt<t;mt++)z?c.push(V,k+mt,k+mt+1):c.push(V,k+mt+1,k+mt)}const B=new Ae;return B.setAttribute("position",new Ce(o,3)),B.setAttribute("uv",new Ce(l,2)),B.setIndex(c),B.computeVertexNormals(),B}function W2(i,t,e){const n=(i-t)/e;return(1-2*n*n)*Math.exp(-n*n)}function Sl(i,t,e,{atJoint:n=!0,stitches:s=!0,nail:r=!1,curl:a=.16,pleats:o=2,steps:l=26}={}){const c=[];for(let u=0;u<=l;u++){const f=u/l,d=Math.pow(f,.92),m=Vt.lerp(i,t,d),x=n?Math.exp(-Math.pow(f/.135,2)):0,g=1-.022*Math.exp(-Math.pow((f-.55)/.32,2)),p=.89,v=f>p?Math.sqrt(Math.max(.06,1-Math.pow((f-p)/(1-p),1.9))):1,M=-f*e,_=-a*e*Math.pow(f,2),T=m*(1.155+x*.135)*g*v,b=m*(.8+x*.1)*g*v,E=m*(.95+x*.05)*g*v,w=n?W2(f,.155,.075)*.34:0,y=r?Math.exp(-Math.pow((f-.775)/.165,2)):0;c.push(S=>{const R=Math.cos(S),I=Math.sin(S),C=Math.abs(R);let N=Math.sign(R)*Math.pow(C,.8)*T,F;if(I>=0){const z=1-.22*y*Math.exp(-Math.pow(N/(T*.46),2)),V=r?.001*Math.exp(-Math.pow((Math.abs(N)-T*.5)/.003,2))*y+9e-4*Math.exp(-Math.pow((f-.935)/.045,2))*Math.exp(-Math.pow(N/(T*.42),2)):0,B=s?72e-5*(Math.sin(f*e/.0026*Math.PI*2)>.05?1:0)*Math.exp(-Math.pow(N/.0021,2)):0;F=I*b*z+V+B+w*m*.075*Math.exp(-Math.pow(N/(T*.5),2))}else{const z=r?Math.exp(-Math.pow((f-.8)/.22,2))*.3:0,V=1+(.1*Math.sin(Math.PI*Math.min(1,f*1.12))+z)*(1-C*.35),B=Math.exp(-Math.pow((f-.098)/.05,2))+(o>1?Math.exp(-Math.pow((f-.208)/.042,2))*.72:0);F=I*E*V+B*m*.175*Math.exp(-Math.pow(N/(T*.62),2))}return[N,_+F,M]})}return Ge(c,26,{capStart:!1,capEnd:!0})}function bl(i,t=.0088,e=1.1,n=.94,s=0){const r=[];for(let o=0;o<=9;o++){const l=o/9,c=Vt.lerp(t,-t,l),h=Math.sqrt(Math.max(.02,1-Math.pow((l-.5)/.5,2))),u=i*(.965+.075*h);r.push(f=>{const d=Math.cos(f),m=Math.sin(f),x=1+.055*Math.exp(-Math.pow((Math.abs(d)-.86)/.26,2))*h,g=m>0?1+(.09+s)*h:1;return[Math.sign(d)*Math.pow(Math.abs(d),.86)*u*e*x,Math.sign(m)*Math.pow(Math.abs(m),.88)*u*n*g,c]})}return Ge(r,20,{capStart:!0,capEnd:!0})}function zu(i=1){const n=[],r=[-.0318,-.0106,.0116,.0324];for(let a=0;a<=32;a++){const o=a/32,l=Vt.lerp(.0075,-.1056,o);let c=.0262+.021*Math.pow(o,.7);c-=.0062*Math.exp(-Math.pow((o-1)/.08,2));const h=.013-.0058*Math.pow(o,1.2),u=.0106-.0026*o,f=-.0038*Math.sin(o*Math.PI),d=Math.exp(-Math.pow(o/.1,2)),m=Vt.smoothstep(o,.64,1),x=Vt.smoothstep(o,.8,1);n.push(g=>{const p=Math.cos(g),v=Math.sin(g),M=Math.abs(p),_=Math.sign(p)*Math.pow(M,.8)*c*(1+d*.02);let T=0;for(let y=0;y<3;y++)T+=Math.exp(-Math.pow((_-i*(r[y]+r[y+1])*.5)/.0064,2));const b=1-Math.min(1,T),E=l+x*(.0016*b+.0118*Math.max(0,-v));let w=f;if(v>=0){const y=1+.16*(1-M*M),S=.0012*Math.exp(-Math.pow(_/.0046,2))*Vt.smoothstep(o,.06,.2)*(1-.35*Vt.smoothstep(o,.86,1));w+=v*(h+.0026*m)*y+S}else{const y=1-.3*(1-M*M)*Vt.smoothstep(o,.25,.85),S=Math.exp(-Math.pow((_+i*.033)/.014,2))*.0034*(1-o*.45),R=Math.exp(-Math.pow((_-i*.0335)/.012,2))*.0026*(1-o*.3),I=Math.exp(-Math.pow((o-.62)/.085,2))*.0012;w+=v*u*y-S-R+I*(1-M)}return[_,w,E]})}return Ge(n,44,{capStart:!0,capEnd:!0})}function X2({rxHand:i,ryHand:t,rxCuff:e,ryCuff:n,zCuff:s=.0356,zHand:r=-.0058}){const a=[];for(let l=0;l<=16;l++){const c=l/16,h=Math.pow(c,.7),u=Vt.lerp(e,i,h),f=Vt.lerp(n,t,h),d=Vt.lerp(s,r,c),m=Math.exp(-Math.pow(c/.44,2));a.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=m*Math.sin(x*3-.4)*.0012;return[Math.sign(g)*Math.pow(Math.abs(g),.86)*(u+v),Math.sign(p)*Math.pow(Math.abs(p),.88)*(f+v*.62),d]})}return Ge(a,24,{capStart:!0,capEnd:!0})}function q2(){const i=[];for(let a=0;a<=9;a++){const o=a/9,l=Vt.lerp(-.324,-.253,o),c=Vt.lerp(.0684,.0588,o),h=Vt.lerp(.0566,.0494,o),u=.009*Math.pow(1-o,2);i.push(f=>{const d=Math.cos(f),m=Math.sin(f),x=Math.exp(-Math.pow((Math.abs(d)-.6)/.24,2))*(m<0?.0044:0),g=m>0?.94:1;return[Math.sign(d)*Math.pow(Math.abs(d),.86)*(c-x*.3),l,u+Math.sign(m)*Math.pow(Math.abs(m),.92)*(h*g-x)]})}const r=4;for(let a=1;a<=r;a++){const o=a/r*(Math.PI*.5),l=Math.cos(o),c=-.253+(-.2442- -.253)*Math.sin(o),h=.0588*l+.0016,u=.0494*l+.0016;i.push(f=>{const d=Math.cos(f),m=Math.sin(f);return[Math.sign(d)*Math.pow(Math.abs(d),.86)*h,c,Math.sign(m)*Math.pow(Math.abs(m),.92)*u]})}return Ge(i,24,{capStart:!0,capEnd:!0})}function bf(i,{gap:t=.0075,halfT:e=.0058,steps:n=26,radialSegs:s=12,widthPow:r=.55,thickPow:a=1.55,ribCount:o=0,ribAmp:l=.16,billow:c=0,capStart:h=!0,capEnd:u=!0}={}){const f=new Ni(i.map(g=>new L(g.x,g.y,0)),!1,"catmullrom",.5),d=i.length,m=g=>{const p=g*(d-1),v=Math.min(d-2,Math.max(0,Math.floor(p)));return Vt.lerp(i[v].hw??1,i[v+1].hw??1,Vt.clamp(p-v,0,1))},x=[];for(let g=0;g<=n;g++){const p=g/n,v=f.getPointAt(p),M=m(p),_=c*Math.sin(p*Math.PI);x.push(T=>{const b=Math.cos(T),E=Math.sin(T),w=o>0?1+l*Math.cos(T*o):1,y=v.x+Math.sign(b)*Math.pow(Math.abs(b),r)*M*w,S=Yi(v.y,y),R=t+_+Math.sign(E)*Math.pow(Math.abs(E),a)*e*w;return[y,v.y,S-R]})}return Ge(x,s,{capStart:h,capEnd:u})}function Y2(i,t,e=0){const s=(c,h)=>Yi(h,c),r=(s(i+.0022,t)-s(i-.0022,t))/.0044,a=(s(i,t+.0022)-s(i,t-.0022))/(2*.0022),o=new L(r,a,-1).normalize(),l=new Ne().setFromUnitVectors(new L(0,1,0),o);return new ne().compose(new L(i,t,s(i,t)-e),l,new L(1,1,1))}function Bu(i,t,{gather:e=.0032,oval:n=.86}={}){const s=[];for(let a=0;a<=10;a++){const o=a/10,l=Vt.lerp(i,t,o),c=Math.sin(o*Math.PI)*e,h=(1-o)*.0016,u=o-.5;s.push(f=>{const d=Math.cos(f),m=Math.sin(f),x=Math.exp(-Math.pow((f-0)/.17,2))*.0015+Math.exp(-Math.pow(Math.abs(f-Math.PI)/.17,2))*.0012,g=(l+c+x)*n,p=l+c*1.3+h,v=m<0?m*c*.7:0;return[d*g,u,m*p+v]})}return Ge(s,18)}function $2(i){const t=[];for(let r=0;r<=12;r++){const a=r/12,o=Vt.lerp(.0065,-.0755,a),l=Math.pow(Math.max(0,1-a*1.02),1.55),c=Math.exp(-Math.pow((a-.2)/.24,2)),h=Math.exp(-Math.pow((a-.4)/.085,2))*.0052,u=i*(1+l*.085)+h;t.push(f=>{const d=Math.cos(f),m=Math.sin(f),x=c*Math.sin(f*5+.55)*.0026;return[d*(u+x)*.885,o,m*(u+x)*1]})}return Ge(t,26,{capStart:!0,capEnd:!1})}function Z2(i){const t=[];for(let n=0;n<=10;n++){const s=n/10,r=1+.052*Math.sin(Math.pow(s,.82)*Math.PI),a=i*r,o=Vt.lerp(.036,-.036,s);t.push(l=>{const c=Math.cos(l),h=Math.sin(l),u=h>0?Math.pow(h,2.4)*.009*Math.sin(s*Math.PI):0,f=h<0?Math.pow(-h,2)*.0042:0;return[c*a*.885,o,h*(a+u)-f]})}return Ge(t,20,{capStart:!0,capEnd:!0})}function wl({rBase:i,rTip:t,len:e,curl:n=.16,roundTip:s=!0,swell:r=.1,noseAt:a=.85,nail:o=!1}){const l=[],h=a;for(let u=0;u<=14;u++){const f=u/14,d=f>h?Math.sqrt(Math.max(.05,1-Math.pow((f-h)/(1-h),1.55))):1,m=Vt.lerp(i,t,Math.pow(f,.88))*(s?d:1),x=Math.exp(-Math.pow((f-.04)/.2,2))*r,g=Math.exp(-Math.pow((f-.3)/.085,2))*.075+Math.exp(-Math.pow((f-.44)/.075,2))*.045,p=Math.sin(Math.PI*Vt.clamp(f*1.04,0,1)),v=-f*e,M=-n*e*Math.pow(f,2);l.push(_=>{const T=Math.cos(_),b=Math.sin(_),E=b>=0,w=o?Math.exp(-Math.pow((f-.8)/.16,2)):0,y=m*(1.14+x*.55)*(1+.05*w),S=m*(E?(.7+g)*(1-.2*w*Math.exp(-Math.pow(T/.56,2)))+.1*w*Math.exp(-Math.pow((Math.abs(T)-.66)/.15,2)):.95),R=E?.0011*p*Math.exp(-Math.pow(T/.52,2)):0,I=E?0:Math.pow(-b,1.15)*m*.14*p;return[T*y,M+b*S+R-I*.6,v]})}return Ge(l,16,{capStart:!1,capEnd:!!s})}function ku(i=1){const t=[];for(let n=0;n<=10;n++){const s=n/10,r=.0138+Math.sin(s*Math.PI)*.0062-s*.0022,a=-i*Vt.lerp(.0295,.0425,Math.pow(s,.86)),o=-.0075+Math.sin(s*Math.PI)*.0035,l=Vt.lerp(.0035,-.043,s);t.push(c=>{const h=Math.cos(c),u=Math.sin(c),f=u<0?1.2:.72;return[a-i*h*r*.78,o+u*r*f,l+h*r*.3]})}return Ge(t,14,{capStart:!0,capEnd:!0})}const io=[{y:-.258,hw:.069,hd:.0458,cz:.052,split:0},{y:-.272,hw:.101,hd:.054,cz:.0332,split:0},{y:-.284,hw:.166,hd:.0638,cz:.0122,split:0},{y:-.296,hw:.2318,hd:.0758,cz:-.0062,split:0},{y:-.312,hw:.2352,hd:.0828,cz:-.0205,split:0},{y:-.344,hw:.2132,hd:.0902,cz:-.0332,split:0},{y:-.4,hw:.2014,hd:.0976,cz:-.0492,split:0},{y:-.46,hw:.195,hd:.1032,cz:-.0628,split:0},{y:-.53,hw:.1906,hd:.1062,cz:-.0788,split:0},{y:-.6,hw:.1892,hd:.1098,cz:-.0958,split:0},{y:-.71,hw:.194,hd:.114,cz:-.122,split:.035},{y:-.81,hw:.2,hd:.116,cz:-.142,split:.075},{y:-.895,hw:.206,hd:.118,cz:-.156,split:.115}],J2=-.296,Xa=(i,t,e,n,s)=>{const r=s*s,a=r*s;return .5*(2*t+(e-i)*s+(2*i-5*t+4*e-n)*r+(3*t-i-3*e+n)*a)};function wf(i){const t=io,e=t.length;let n=0;for(;n<e-2&&i<t[n+1].y;)n++;const s=t[Math.max(0,n-1)],r=t[n],a=t[n+1],o=t[Math.min(e-1,n+2)],l=a.y-r.y,c=l!==0?Vt.clamp((i-r.y)/l,0,1):0;return{hw:Math.max(.05,Xa(s.hw,r.hw,a.hw,o.hw,c)),hd:Math.max(.03,Xa(s.hd,r.hd,a.hd,o.hd,c)),cz:Xa(s.cz,r.cz,a.cz,o.cz,c),split:Math.max(0,Xa(s.split,r.split,a.split,o.split,c))}}function Tf(i){return Math.exp(-Math.pow((i-J2)/.042,2))}function Yi(i,t=0){const e=wf(i),n=Tf(i),s=Math.min(.999,Math.abs(t)/e.hw),r=Math.pow(s,1.25);let a=e.cz-e.hd*Math.pow(Math.max(0,1-Math.pow(s,2/.84)),.43);return a+=n*(.0028*r+.0018*Math.exp(-Math.pow((1-s)/.3,2))),Vt.clamp((-i-.6)/.28,0,1)<.35&&t>-.052&&t<.084&&(a-=.0055),e.split>.001&&Math.abs(t)<e.split&&(a+=(1-Math.abs(t)/e.split)*e.split*.72),a}function K2(){const i=[],t=io[0].y,e=io[io.length-1].y,n=34;for(let s=0;s<=n;s++){const r=s/n,a=r<.26?r*.5769:.15+(r-.26)*1.2192,o=Vt.lerp(t,e,Vt.clamp(a,0,1)),{hw:l,hd:c,cz:h,split:u}=wf(o),f=Tf(o),d=Math.exp(-Math.pow((o+.344)/.024,2)),m=Vt.clamp((-o-.6)/.28,0,1);i.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=Math.min(1,Math.abs(g)),M=Math.sign(g)*Math.pow(Math.abs(g),.84),_=Math.sign(p)*Math.pow(Math.abs(p),.86),T=Math.pow(v,1.25),b=m*Math.sin(x*6)*.0055;let E=M*(l+b),w=h+_*(c+b*.8);const y=o+f*T*.0048;E+=Math.sign(g||1)*f*(T*.0028),w+=f*.0028*T;const S=Math.exp(-Math.pow((1-v)/.3,2))*f;if(E+=Math.sign(g||1)*S*.0022,w+=Math.sign(p||1)*S*.0018,p>.45&&(w+=d*(.4+.6*p)*.0042),p<-.55&&m<.35){const R=g>-.18&&g<.35?-.0055:0;w+=R}if(u>.001&&p<-.55&&Math.abs(E)<u){const R=(1-Math.abs(E)/u)*u*.72;w+=R}return[E,y,w]})}return Ge(i,36,{capStart:!0,capEnd:!0})}function j2(){const i=[];for(let r=0;r<=30;r++){const o=-1.7+r/30*3.4,l=Math.pow(Math.abs(o)/1.7,1.35),c=Math.sin(o)*.0792*(1+l*.055),h=.0128+Math.cos(o)*.0598,u=-.301+l*.0042,f=-.2398-l*.018,d=.0122-l*.0102,m=(f-u)*.5,x=(f+u)*.5,g=.0072+(1-Math.abs(Math.sin(o)))*.0016;i.push(p=>{const v=Math.cos(p),M=Math.sin(p),_=Math.sign(v)*Math.pow(Math.abs(v),.72)*g,T=Math.sign(M)*Math.pow(Math.abs(M),.8)*m,b=Math.sin(o),E=Math.cos(o);return[c+b*_,x+T,h+E*_+d*(T/m)*.6]})}return Ge(i,14,{capStart:!0,capEnd:!0})}function Q2(){return bf([{x:.0555,y:-.2765,hw:.0135},{x:.0885,y:-.303,hw:.0305},{x:.1115,y:-.34,hw:.037},{x:.1175,y:-.388,hw:.0352},{x:.1055,y:-.436,hw:.0305},{x:.0892,y:-.452,hw:.0228},{x:.0712,y:-.474,hw:.0158},{x:.0556,y:-.4885,hw:.0072}],{gap:.0068,halfT:.0062,steps:30,radialSegs:14,billow:.0022})}function t_(i=1){const a=[];for(let o=0;o<=18;o++){const l=o/18,c=.089+l*.057,u=-.6344-l*.0072-.0298*.5,f=(Yi(u,c+.006)-Yi(u,c-.006))/(2*.006),d=(Yi(u+.006,c)-Yi(u-.006,c))/(2*.006);let m=-f,x=-d,g=1;const p=Math.hypot(m,x,g);m/=p,x/=p,g/=p;let v=1,M=-.0072/.057,_=f;const T=Math.hypot(v,M,_);v/=T,M/=T,_/=T;let b=x*_-g*M,E=g*v-m*_,w=m*M-x*v;const y=Math.hypot(b,E,w)||1;b/=y,E/=y,w/=y,E>0&&(b=-b,E=-E,w=-w);const S=c,R=u,I=Yi(u,c)+.0016+.0026;a.push(C=>{const N=Math.cos(C),F=Math.sin(C),z=Math.sign(N)*Math.pow(Math.abs(N),.34)*(.0298*.5),V=Math.pow(Math.max(0,z)/(.0298*.5),2)*.0011,B=Math.sign(F)*Math.pow(Math.abs(F),.34)*(.0026+V);return[S+b*z+m*B,R+E*z+x*B,I+w*z+g*B]})}return i>0?Ge(a,12,{capStart:!0,capEnd:!0}):Zs(Ge(a,12,{capStart:!0,capEnd:!0}))}function e_(i,{gap:t=.0056,cords:e=5,cordR:n=.0058,spread:s=.0258,steps:r=26,radialSegs:a=10,billow:o=.0022}={}){const l=[];for(let c=0;c<e;c++){const h=e===1?0:(c/(e-1)-.5)*2*s,u=i.map(f=>({x:f.x+h,y:f.y,hw:n}));l.push(bf(u,{gap:t,halfT:n,steps:r,radialSegs:a,widthPow:1,thickPow:1,billow:o}))}return ii(l)}function n_(){const i=[],r=h=>{const u=Math.max(0,Math.cos(h)),f=1+.01*Math.cos(h*12);return{px:Math.sin(h)*.073*f,pz:.0124-Math.cos(h)*.0624*f,front:u,yBot:-.3072-u*.0034,yTop:-.2422-u*.0052}},a=[],o=[];for(let h=0;h<=48;h++){const u=h/48*Math.PI*2,f=r(u),d=Math.sin(u),m=-Math.cos(u);a.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=1+.075*Math.max(0,p),M=.0076*(1+.2*f.front)*v,_=(f.yBot+f.yTop)*.5,T=(f.yTop-f.yBot)*.5,b=1+.03*Math.sin(x*10),E=Math.sign(g)*Math.pow(Math.abs(g),.7)*M*b,w=Math.sign(p)*Math.pow(Math.abs(p),.66)*T;return[f.px+d*E,_+w,f.pz+m*E]}),o.push(x=>{const g=Math.cos(x),p=Math.sin(x),v=.0052;return[f.px+d*(v*g+.0022),f.yTop+p*v*.86,f.pz+m*(v*g+.0022)]})}i.push(Ge(a,20,{capStart:!1,capEnd:!1})),i.push(Ge(o,12,{capStart:!1,capEnd:!1}));const l=[{x:-.0452,y:-.286},{x:-.0492,y:-.326},{x:-.0518,y:-.368},{x:-.0528,y:-.41},{x:-.0522,y:-.446},{x:-.0502,y:-.4705}];i.push(e_(l,{gap:.0054,cords:5,cordR:.0061,spread:.0212,steps:30,radialSegs:11,billow:.002}));const c=-.4705;for(let h=0;h<5;h++){const u=-.0502+(h-2)*.0106,f=Yi(c,u)-.007,d=(h-2)*.0022,m=new Ni([new L(u,c-.0015,f+.0018),new L(u+d*.4,c-.0092,f+.0036),new L(u+d,c-.0168,f+.0054)]);i.push(new Tn(m,5,.00162,6,!1))}return ii(i)}function i_(){return n_()}function Hu(i=.012,t=-7.5*Zi){const e=[];for(let s=0;s<=16;s++){const r=s/16,a=Vt.lerp(-.81,-1.445,r),o=Math.sin(r*Math.PI)*.028,l=Vt.lerp(.104,.128,r),c=Vt.lerp(-.225,-.565,r)-o+i,h=r>.88,u=1+.098*Math.exp(-Math.pow((r-.04)/.19,2)),f=1+.072*Math.exp(-Math.pow((r-.47)/.15,2)),d=1+.086*Math.exp(-Math.pow((r-.73)/.15,2)),m=(Vt.lerp(.0755,.0555,r)+(h?.0058:0))*u*f*d,x=(Vt.lerp(.0815,.0635,r)+(h?.0062:0))*u*f*(1+(d-1)*1.35),g=Math.exp(-Math.pow((r-.52)/.09,2)),p=Math.exp(-Math.pow((r-.85)/.06,2));e.push(v=>{const M=Math.cos(v),_=Math.sin(v),T=_<-.65?Math.pow((-_-.65)/.35,1.45)*.012:0,b=_>.75?Math.pow((_-.75)/.25,1.6)*.005:0,E=g*Math.sin(r*55+M*2.5)*.0032+p*Math.cos(r*70)*.0028,w=M*(m+E),y=_*(x+E)-T+b,S=t*r,R=w*Math.cos(S)-y*Math.sin(S),I=w*Math.sin(S)+y*Math.cos(S);return[l+R,a,c+I]})}return Ge(e,18,{capStart:!0,capEnd:!0})}function Gu(i=.012,t=-7.5*Zi){const n=-.565+i,s=new ne().makeRotationY(t),r=new ne().makeTranslation(.128,0,n).multiply(s),a=[],o=[],l=[],c=[{y:-1.432,zc:.004,hw:.047,hl:.052},{y:-1.474,zc:-.008,hw:.049,hl:.062},{y:-1.51,zc:-.044,hw:.053,hl:.098},{y:-1.536,zc:-.084,hw:.056,hl:.134},{y:-1.556,zc:-.094,hw:.055,hl:.144}],h=[],u=12;for(let p=0;p<=u;p++){const v=p/u*(c.length-1),M=Math.min(c.length-2,Math.floor(v)),_=v-M,T=c[M],b=c[M+1],E=Vt.lerp(T.y,b.y,_),w=Vt.lerp(T.zc,b.zc,_),y=Vt.lerp(T.hw,b.hw,_),S=Vt.lerp(T.hl,b.hl,_);h.push(R=>{const I=Math.cos(R),C=Math.sin(R),N=I<0&&C>-.2&&C<.4?.005:0,F=Math.sign(I)*Math.pow(Math.abs(I),.84)*y+N,z=w+Math.sign(C)*Math.pow(Math.abs(C),.82)*S,V=Math.exp(-Math.pow((z+.162)/.008,2))*.0028;return[F,E+V,z]})}a.push(ti(Ge(h,20,{capStart:!0,capEnd:!0}),r));const f=new ci(.046,.0075,7,16),d=r.clone().multiply(new ne().makeTranslation(0,-1.452,.002).multiply(new ne().makeRotationX(Math.PI*.5)));a.push(ti(f,d));const m=[{y:-1.553,zc:-.094,hw:.0585,hl:.15},{y:-1.568,zc:-.094,hw:.06,hl:.152},{y:-1.578,zc:-.094,hw:.0585,hl:.15}].map(({y:p,zc:v,hw:M,hl:_})=>T=>{const b=Math.cos(T),E=Math.sin(T),w=Math.sin(T*18)*.0014;return[Math.sign(b)*Math.pow(Math.abs(b),.82)*(M+w),p,v+Math.sign(E)*Math.pow(Math.abs(E),.8)*(_+w)]});o.push(ti(Ge(m,20,{capStart:!0,capEnd:!0}),r));const x=new Fe(.049,.05,.016,12);x.scale(1.02,1,.86);const g=r.clone().multiply(new ne().makeTranslation(0,-1.582,.014));o.push(ti(x,g));for(let p=0;p<4;p++){const v=-1.468-p*.0145,M=-.052-p*.023,_=.02+p*.0014,T=new $r(new L(-_,v,M),new L(_,v-.005,M-.009)),b=new $r(new L(_,v,M),new L(-_,v-.005,M-.009));o.push(ti(new Tn(T,1,.0028,5,!1),r)),o.push(ti(new Tn(b,1,.0028,5,!1),r));for(const E of[-1,1]){const w=new Fe(.0042,.0042,.003,7),y=r.clone().multiply(new ne().makeTranslation(E*(_+.002),v,M).multiply(new ne().makeRotationX(.55)));l.push(ti(w,y))}}return{leatherGeo:ii(a),soleGeo:ii(o),eyeletGeo:ii(l)}}function s_(i){const t=new re;t.name="vr-avatar-body";const e=[],n=[],s=K2();e.push(j2());const r=Q2(),a=Zs(r);e.push(r,a);for(const N of[-1,1])e.push(t_(N));for(const N of[-.496,-.59,-.684])for(const F of[-1,1]){const z=Y2(F*.058,N,.0016),V=new Fe(.0122,.0128,.0062,14);n.push(ti(V,z));const B=new ci(.0112,.0021,6,14),k=z.clone().multiply(new ne().makeRotationX(Math.PI*.5)),Y=k.clone().multiply(new ne().makeTranslation(0,.0026,0));n.push(ti(B,Y));for(const nt of[-.0042,.0042]){const K=new Fe(.0012,.0012,.0042,6),mt=k.clone().multiply(new ne().makeTranslation(nt,.0034,0).multiply(new ne().makeRotationX(Math.PI*.5)));n.push(ti(K,mt))}}const o=Hu(.012,-7.5*Zi),l=Hu(-.014,-6.5*Zi),c=Zs(l);l.dispose();const h=Gu(.012,-7.5*Zi),u=Gu(-.014,-6.5*Zi),f=Zs(u.leatherGeo),d=Zs(u.soleGeo),m=Zs(u.eyeletGeo);u.leatherGeo.dispose(),u.soleGeo.dispose(),u.eyeletGeo.dispose(),n.push(h.eyeletGeo,m);const x=ii(e),g=i_(),p=ii([o,c]),v=ii([h.leatherGeo,f]),M=ii([h.soleGeo,d]),_=ii(n),T=new Xt(s,i.sleeveMat),b=new Xt(x,i.sleeveFoldMat),E=q2(),w=new Xt(E,i.neckMat),y=new Xt(g,i.scarfMat),S=new Xt(p,i.trouserMat),R=new Xt(v,i.bootLeatherMat),I=new Xt(M,i.bootSoleMat),C=new Xt(_,i.hornButtonMat);return t.add(T,b,y,S,R,I,C),{bodyGroup:t,neckMesh:w,geos:[s,x,g,E,p,v,M,_]}}function Vu(i,t,{withBeacon:e=!1,initialSide:n="right"}={}){const s=new re,r=new Xt(t.sleeveHeadGeo,i.sleeveMat);s.add(r);const a=new Xt(t.upperSleeveGeo,i.sleeveMat);s.add(a);const o=new re;o.add(new Xt(t.elbowHingeGeo,i.sleeveMat));const l=new Xt(t.elbowCreaseGeo,i.sleeveFoldMat);l.rotation.x=Math.PI*.5,l.position.set(0,.0104,-.0012);const c=new Xt(t.elbowCreaseGeo,i.sleeveFoldMat);c.rotation.x=Math.PI*.5,c.position.set(0,-.0104,-8e-4),o.add(l,c),s.add(o);const h=new Xt(t.foreSleeveGeo,i.foreSleeveMat);s.add(h);const u=new re;s.add(u);const f=new Xt(t.coatCuffHemGeo,i.sleeveFoldInnerMat);f.rotation.x=Math.PI*.5,f.scale.set(.92,1,1.08),f.position.set(0,4e-4,.0306),u.add(f);const d=new re,m=new Xt(t.cuffTabGeo,i.sleeveFoldMat);m.scale.set(.862,1,1);const x=new Xt(t.cuffBtnGeo,i.hornButtonMat);x.scale.set(1,1,.86),x.rotation.z=Math.PI*.5,x.position.set(.0466,.0022,0),d.add(m,x),u.add(d);const g=new Xt(t.knitCuffGeo,i.cuffKnitMat);g.rotation.x=Math.PI*.5,g.scale.set(.94,1,1.06),g.position.set(0,4e-4,.0172),u.add(g);let p=null,v=null,M=null;if(e){p=new re;const Bt=new Xt(t.strapGeo,i.strapMat);Bt.rotation.x=Math.PI*.5,Bt.scale.set(.92,1,1.08),Bt.position.set(0,4e-4,.004),p.add(Bt),v=new re;const U=new Xt(t.miniScreenGeo,i.deviceCaseMat);v.add(U);const tt=new Xt(t.ledDotGeo,i.ledGreenMat);tt.position.set(0,.0026,-.0044),v.add(tt);const j=new Xt(t.ledDotGeo,i.ledMagentaMat);j.position.set(0,.0026,.0044),v.add(j),p.add(v),M=new Xt(t.rivetGeo,i.hornButtonMat),p.add(M),u.add(p)}const _=new re;s.add(_);const T=new re;_.add(T);const b=new re;b.scale.setScalar(1),T.add(b);const E=new Xt(t.wristBridgeGeo,i.gloveMat);b.add(E);const w=new Xt(t.gloveBindingGeo,i.seamMat);w.scale.set(1,.62,1),w.position.set(0,0,.0352),b.add(w);const y=new Xt(t.palmRightGeo,i.gloveMat);b.add(y);const S=new Xt(t.thenarRightGeo,i.palmInnerMat);b.add(S);const R=new Xt(t.wristSnapGeo,i.hornButtonMat);R.rotation.z=Math.PI*.5,b.add(R);const I=t.fingerTemplates.map(Bt=>{const U=new re;U.add(new Xt(Bt.knuckleGeo,i.gloveMat)),U.add(new Xt(Bt.p1Geo,i.gloveMat));const tt=new re;tt.position.set(0,0,-Bt.spec.l1),tt.add(new Xt(Bt.pipGeo,i.gloveMat)),tt.add(new Xt(Bt.p2Geo,i.gloveMat));const j=new re;return j.position.set(0,0,-Bt.spec.l2),j.add(new Xt(Bt.dipGeo,i.gloveMat)),j.add(new Xt(Bt.p3Geo,i.gloveMat)),tt.add(j),U.add(tt),b.add(U),{spec:Bt.spec,mcp:U,pip:tt,dip:j}}),C=new re;C.add(new Xt(t.thumbMetaGeo,i.gloveMat));const N=new re;N.position.set(0,4e-4,-.0248),N.add(new Xt(t.thumbProxGeo,i.gloveMat));const F=new re;F.position.set(0,4e-4,-.0216),F.add(new Xt(t.thumbDistGeo,i.gloveMat)),N.add(F),C.add(N),b.add(C);let z=null;function V(Bt){const U=Bt==="left"?"left":"right";if(U===z)return;z=U;const tt=U==="left"?-1:1;y.geometry=U==="left"?t.palmLeftGeo:t.palmRightGeo,S.geometry=U==="left"?t.thenarLeftGeo:t.thenarRightGeo,b.rotation.set(.05,tt*.06,tt*.24),R.position.set(tt*.0302,.0022,.0268);for(const j of I)j.mcp.position.set(tt*j.spec.baseX,j.spec.yOff,j.spec.zOff);C.position.set(-tt*.0308,-.0088,-.0198),C.rotation.set(.05,tt*.7,-tt*.34),d.position.set(0,4e-4,.0306),d.rotation.set(0,0,tt>0?-.34:Math.PI+.34),v&&M&&(v.position.set(-tt*.005,.0527,.004),v.rotation.z=tt*.12,M.position.set(tt*.03,.0365,.004),M.rotation.z=-tt*.712)}function B(Bt,U,tt=0,j=0,ot=0){const it=z==="left"?-1:1;for(let dt=0;dt<I.length;dt++){const vt=I[dt],Jt=tt*Math.sin(j+dt*.9)*.16,$t=dt*.052,D=Vt.clamp(Bt+$t+Jt+ot,.03,1.35);vt.mcp.rotation.x=-D*.56,vt.pip.rotation.x=-D*.78,vt.dip.rotation.x=-D*.52,vt.mcp.rotation.y=-it*vt.spec.splay*U}const xt=Vt.clamp(Bt*.7+ot*.45,.02,1);C.rotation.x=.05-xt*.15,C.rotation.y=it*(.7-xt*.13),N.rotation.x=-.06-xt*.22,F.rotation.x=-.035-xt*.235}const k=new L,Y=new L,nt=new L,K=new L,mt=new L,It=new L,Ut=new L,$=new L,rt=new L,_t=new L,Tt=new ne,wt=new L(0,1,0);function qt(Bt,U,tt,j,ot=55,it=0,xt=0){_.position.copy(tt),_.quaternion.set(j[0],j[1],j[2],j[3]),T.rotation.set(it,xt,0),k.copy(Bt).sub(U);const dt=Math.max(.08,k.length());a.position.copy(U).addScaledVector(k,.5),a.scale.set(1,dt,1),a.quaternion.setFromUnitVectors(wt,k.normalize()),r.quaternion.copy(a.quaternion),r.position.copy(Bt),o.position.copy(U),o.quaternion.copy(a.quaternion);const vt=.92+Vt.clamp(ot/120,0,1)*.16;l.scale.set(.885*vt,vt,vt),c.scale.set(.885*vt*.97,vt*.97,vt*.97),Y.copy(tt).sub(U);const Jt=Math.max(.1,Y.length());Y.divideScalar(Jt),Ut.copy(Y).negate(),nt.set(0,1,0).applyQuaternion(_.quaternion),It.copy(nt).addScaledVector(Ut,-nt.dot(Ut)),It.lengthSq()<1e-4?(K.set(1,0,0).applyQuaternion(_.quaternion),mt.copy(K).addScaledVector(Ut,-K.dot(Ut)).normalize(),It.crossVectors(Ut,mt).normalize()):(It.normalize(),mt.crossVectors(It,Ut).normalize(),It.crossVectors(Ut,mt).normalize()),Tt.makeBasis(mt,It,Ut),u.position.copy(tt),u.quaternion.setFromRotationMatrix(Tt),$.copy(tt).addScaledVector(Ut,.036),k.copy(U).sub($);const $t=Math.max(.06,k.length());h.position.copy($).addScaledVector(k,.5),rt.copy(k).normalize(),_t.crossVectors(mt,rt).normalize(),Tt.makeBasis(mt,rt,_t),h.quaternion.setFromRotationMatrix(Tt),h.scale.set(1,$t,1)}return V(n),B(.42,.36,0,0,0),{group:s,wristPivot:_,beaconBandGroup:p,setSide:V,getSide:()=>z,setFingerPose:B,applyJoints:qt}}function r_(i="right"){const t=new re;t.name="vr-gloved-hand",t.visible=!1;const e=V2(),n={gloveMat:new Ct({color:9730657,emissive:2300434,emissiveIntensity:.46,roughness:.73,metalness:.05,bumpMap:e.suedeBump,bumpScale:.0022}),palmInnerMat:new Ct({color:8810071,emissive:1445641,emissiveIntensity:.4,roughness:.84,metalness:.04,bumpMap:e.suedeBump,bumpScale:.0028}),seamMat:new Ct({color:11770496,emissive:2760727,emissiveIntensity:.45,roughness:.65,metalness:.06}),cuffKnitMat:new Ct({color:2503230,emissive:593428,emissiveIntensity:.42,roughness:.9,metalness:.03,bumpMap:e.knitBump,bumpScale:.0042}),sleeveMat:new Ct({color:2240577,emissive:527894,emissiveIntensity:.44,roughness:.87,metalness:.05,bumpMap:e.woolBump,bumpScale:.0042}),foreSleeveMat:new Ct({color:2240577,emissive:527894,emissiveIntensity:.44,roughness:.92,metalness:.03,bumpMap:e.woolBump,bumpScale:.0042,side:Oe}),neckMat:new Ct({color:9267791,emissive:1707783,emissiveIntensity:.22,roughness:.72,metalness:0}),sleeveFoldMat:new Ct({color:3228504,emissive:791583,emissiveIntensity:.45,roughness:.82,metalness:.07,bumpMap:e.woolBump,bumpScale:.0038}),sleeveFoldInnerMat:new Ct({color:3228504,emissive:791583,emissiveIntensity:.45,roughness:.88,metalness:.04,bumpMap:e.woolBump,bumpScale:.0038,side:Oe}),scarfMat:new Ct({color:7156534,emissive:1968908,emissiveIntensity:.44,roughness:.9,metalness:.02,bumpMap:e.knitBump,bumpScale:.006}),trouserMat:new Ct({color:4277839,emissive:1053464,emissiveIntensity:.42,roughness:.85,metalness:.04,bumpMap:e.trouserBump,bumpScale:.0042}),bootLeatherMat:new Ct({color:4927521,emissive:1313542,emissiveIntensity:.42,roughness:.44,metalness:.14,bumpMap:e.bootBump,bumpScale:.0034}),bootSoleMat:new Ct({color:1448221,emissive:329224,emissiveIntensity:.34,roughness:.86,metalness:.08}),hornButtonMat:new Ct({color:10189908,emissive:2497036,emissiveIntensity:.42,roughness:.34,metalness:.5}),strapMat:new Ct({color:3877922,emissive:1182728,emissiveIntensity:.4,roughness:.62,metalness:.16}),deviceCaseMat:new Ct({color:1119773,emissive:263946,emissiveIntensity:.35,roughness:.35,metalness:.35}),pipBrassMat:new Ct({color:14923896,emissive:7227417,emissiveIntensity:.55,roughness:.34,metalness:.58}),ledGreenMat:new Ke({color:55639}),ledMagentaMat:new Ke({color:14680214})},r=[{baseX:-.0328,yOff:.0015,zOff:-.0942,l1:.0368,l2:.0238,l3:.0158,w:.0186,splay:-.062},{baseX:-.0109,yOff:.0035,zOff:-.0994,l1:.0408,l2:.0262,l3:.0168,w:.0192,splay:-.014},{baseX:.0119,yOff:.002,zOff:-.0964,l1:.0378,l2:.0246,l3:.0158,w:.0184,splay:.03},{baseX:.0318,yOff:-.002,zOff:-.0882,l1:.0306,l2:.0196,l3:.0148,w:.0164,splay:.079}].map(k=>({spec:k,knuckleGeo:bl(k.w*.52,.0116,1.07,1.04,.23),p1Geo:Sl(k.w*.488,k.w*.448,k.l1,{curl:.185}),pipGeo:bl(k.w*.452,.0096,1.045,.96,.14),p2Geo:Sl(k.w*.432,k.w*.392,k.l2,{curl:.235,pleats:1}),dipGeo:bl(k.w*.396,.008,1.03,.94,.09),p3Geo:Sl(k.w*.376,k.w*.312,k.l3,{curl:.3,nail:!0,stitches:!1,pleats:1})})),a={sleeveHeadGeo:$2(.0505),upperSleeveGeo:Bu(.0478,.0505,{gather:.0042,oval:.885}),elbowHingeGeo:Z2(.0476),elbowCreaseGeo:new ci(.0474,.0034,6,22),foreSleeveGeo:Bu(.041,.047,{gather:.002,oval:.9}),coatCuffHemGeo:new Fe(.0462,.0478,.033,20),cuffTabGeo:new ci(.0528,.0032,8,26,Math.PI*.66),cuffBtnGeo:new Fe(.0055,.0055,.003,9),knitCuffGeo:new Fe(.0338,.0354,.052,18),strapGeo:new Fe(.0452,.0468,.0185,20),miniScreenGeo:new Jn(.031,.0045,.017),ledDotGeo:new ur(.0022,6,5),rivetGeo:new Fe(.0034,.004,.0028,12),wristBridgeGeo:X2({rxHand:.024,ryHand:.0126,rxCuff:.0346,ryCuff:.0214}),gloveBindingGeo:new ci(.0342,.0024,8,26),palmRightGeo:zu(1),palmLeftGeo:zu(-1),thenarRightGeo:ku(1),thenarLeftGeo:ku(-1),wristSnapGeo:new Fe(.0034,.0036,.0026,10),fingerTemplates:r,thumbMetaGeo:wl({rBase:.0138,rTip:.0124,len:.0312,curl:.06,swell:.04,noseAt:.97}),thumbProxGeo:wl({rBase:.0126,rTip:.011,len:.0266,curl:.105,swell:.06,noseAt:.95}),thumbDistGeo:wl({rBase:.0114,rTip:.0092,len:.0226,curl:.13,swell:.05,nail:!0})},o=new re;o.name="vr-body-root",t.add(o);const l=s_(n);o.add(l.bodyGroup),o.add(l.neckMesh);const c=Vu(n,a,{withBeacon:!1,initialSide:i==="left"?"right":"left"});o.add(c.group);const h=Vu(n,a,{withBeacon:!0,initialSide:i});t.add(h.group);let u=i==="left"?"left":"right",f=0,d=.3,m=.6,x=0,g=0,p=0,v=0;function M(k){const Y=k==="left"?"left":"right";u=Y,h.setSide(Y),c.setSide(Y==="left"?"right":"left")}const _=new L,T=new L,b=new L,E=new Ne().setFromEuler(new xn(-.86,.22,-.36,"YXZ")).toArray(),w=new Ne().setFromEuler(new xn(-.86,-.22,.36,"YXZ")).toArray();function y(k,Y){const nt=Y==="left"?-1:1;_.set(nt*.196,-.29,-.042),T.set(nt*.2335,-.4945,-.117),b.set(nt*.1915,-.631,-.256);const K=nt>0?E:w;k.setSide(Y),k.applyJoints(_,T,b,K,46,0,0),k.setFingerPose(.5,.26,0,0,0)}M(i),y(c,u==="left"?"right":"left");const S=new L,R=new L,I=new L,C=new Ne,N=new Ne,F=new Ne,z=new Ne,V=new L(1,0,0),B=new L(0,1,0);return{group:t,bodyRoot:o,torsoGroup:l.bodyGroup,wristPivot:h.wristPivot,passiveWristPivot:c.wristPivot,setHandSide:M,getHandSide:()=>u,getBodyInfo:()=>{var k;return{visible:t.visible,torsoVisible:l.bodyGroup.visible,passiveArmSide:c.getSide(),activeArmSide:h.getSide(),beaconBandVisible:!!((k=h.beaconBandGroup)!=null&&k.visible)}},update(k,{visible:Y=!1,handMode:nt=!0,handTracked:K=!0,handSide:mt=u,headLook:It=null,torsoYaw:Ut=null,shoulderPos:$=null,elbowPos:rt=null,pos:_t={x:.16,y:-.22,z:-.5},vel:Tt={x:0,y:0,z:0},qArm:wt=[0,0,0,1],reach:qt=.25,elbowBendDeg:Bt=60,overBin:U=!1,phase:tt="search",calmLowerProgress:j=0,beaconActive:ot=!1}={}){if(t.visible=Y,!Y)return;const it=Math.min(.1,k||1/60);M(mt);const xt=u==="left"?-1:1;v+=it*1.45;const dt=Math.sin(v)*5e-4,vt=Number.isFinite(It==null?void 0:It.yaw)?It.yaw:0,Jt=Number.isFinite(It==null?void 0:It.pitch)?It.pitch:0;Number.isFinite(Ut)?f=Ut:f=Vt.clamp(f,vt-50*Zi,vt+50*Zi);const $t=vt-f;if(C.setFromAxisAngle(V,-Jt),N.setFromAxisAngle(B,$t),F.copy(C).multiply(N),o.position.set(0,dt*.4,0),o.quaternion.copy(F),y(c,u==="left"?"right":"left"),h.beaconBandGroup&&(h.beaconBandGroup.visible=!!nt),!nt||!K){S.set(xt*.196,-.29,-.042).applyQuaternion(F),R.set(xt*.2335,-.4945,-.117).applyQuaternion(F),I.set(xt*.1915,-.631,-.256).applyQuaternion(F);const Lt=xt>0?E:w;z.set(Lt[0],Lt[1],Lt[2],Lt[3]).premultiply(F),h.applyJoints(S,R,I,z.toArray(),46,0,0),h.setFingerPose(.5,.26,0,0,0);return}I.set(_t.x,_t.y+dt,_t.z),$?S.set($.x,$.y,$.z):S.set(xt*.196,-.29,-.042),rt?R.set(rt.x,rt.y+dt*.5,rt.z):R.set(xt*.24,-.44,-.26);const A=Vt.clamp(-Tt.y*.08,-.15,.15),W=Vt.clamp(Tt.x*.07,-.13,.13),Q=1-Math.exp(-it*16);g+=(A-g)*Q,p+=(W-p)*Q,h.applyJoints(S,R,I,wt,Bt,g,p);let ht=.28,J=.58,Ft=0;tt==="search"?qt>=.58&&U?(ht=.14,J=1.05,Ft=1,x+=it*9.5):_t.y<-.34?(ht=.48,J=.32):_t.y>.1?(ht=.18,J=.9):(ht=.32,J=.52):tt==="inspect"&&(ht=.2+j*.86,J=(1-j)*.78+.15);const yt=1-Math.exp(-it*13);d+=(ht-d)*yt,m+=(J-m)*yt,h.setFingerPose(d,m,Ft,x,g*.85),j>.05?(n.pipBrassMat.emissive.setHex(8963184),n.pipBrassMat.emissiveIntensity=.6+j*.95):ot?(n.pipBrassMat.emissive.setHex(7121032),n.pipBrassMat.emissiveIntensity=.58):(n.pipBrassMat.emissive.setHex(7227417),n.pipBrassMat.emissiveIntensity=.45),n.ledGreenMat.color.setHex(ot?65382:1993533),n.ledMagentaMat.color.setHex(ot?16711850:7020114)},dispose(){for(const k of l.geos)k.dispose();for(const k of a.fingerTemplates)k.knuckleGeo.dispose(),k.p1Geo.dispose(),k.pipGeo.dispose(),k.p2Geo.dispose(),k.dipGeo.dispose(),k.p3Geo.dispose();for(const[k,Y]of Object.entries(a))k!=="fingerTemplates"&&(Y!=null&&Y.dispose)&&Y.dispose();for(const k of Object.values(e))k.dispose();for(const k of Object.values(n))k.dispose()}}}const Sn=xi(137);function Tl(i){i.updateWorldMatrix(!0,!0);const t=new ne().copy(i.matrixWorld).invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||Array.isArray(n.material))return;const s=n.material.uuid;let r=e.get(s);r||(r={material:n.material,geos:[]},e.set(s,r));const a=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();a.applyMatrix4(new ne().multiplyMatrices(t,n.matrixWorld)),a.deleteAttribute("uv1"),r.geos.push(a),n.geometry.dispose()}),i.clear();for(const{material:n,geos:s}of e.values()){const r=ff(s,!1);if(r){const a=new Xt(r,n);a.receiveShadow=!n.transparent,a.castShadow=!n.transparent&&!n.transmission,i.add(a)}s.forEach(a=>a.dispose())}}class a_{constructor(t){this.renderer=new Gv({canvas:t,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75),this.pixelRatio=Math.min(this.maxPixelRatio,1.5),this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0},this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=xd,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=$e,this.renderer.toneMapping=zc,this.renderer.toneMappingExposure=1.12,this.scene=new xc,this.scene.background=new Zt("#16222f"),this.scene.fog=new Zc("#1c2b3a",.0118),this.sky=G2(),this.scene.add(this.sky.group),this.camera=new sn(46,1,.1,70),this.scene.add(this.camera),this.eyeL=new sn(62,1,.1,70),this.eyeR=new sn(62,1,.1,70),this.vrStereo=!1,this.vrInspectLock=!1,this.baseCameraPosition=new L,this.baseCameraQuaternion=new Ne,this.lockedCameraQuaternion=new Ne,this.headLook={yaw:0,pitch:0},this.headInspectBase=null,this.headInspectRotation=null,this.normalStage=null,this.buildEnvironment(),this.hemi=new jh(9087958,1318439,1.12),this.scene.add(this.hemi);const e=new La(11127024,1.62);e.position.set(-6,11,2),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-6,e.shadow.camera.right=6,e.shadow.camera.top=7,e.shadow.camera.bottom=-6,e.shadow.normalBias=.012,e.shadow.bias=-25e-5,e.shadow.radius=3,this.scene.add(e),this.sun=e;const n=new La(5338012,.62);n.position.set(5,5,-4),this.scene.add(n),this.static=new re,this.scene.add(this.static),Uu(.5),this.buildCourtyard(),Uu(1),Tl(this.static),this.bin=new re,this.scene.add(this.bin),this.buildBin(),this.bin.rotation.y=-.18,this.inspectionVeil=new Xt(new fe(1,1),new Ke({color:1518396,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1,fog:!1})),this.inspectionVeil.position.z=-6,this.inspectionVeil.visible=!1,this.inspectionVeil.renderOrder=-10,this.camera.add(this.inspectionVeil),this.silhouette=new re,this.silhouetteMat=new Ke({color:1056043,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),this.itemAnchor=new re,this.camera.add(this.itemAnchor),this.itemAnchor.position.set(0,0,-4.2),this.vrHand=r_(),this.camera.add(this.vrHand.group),this.vrBodyActive=!1,this.vrHandMode=!1,this.handInspectHeadBase=null,this.itemBaseRot=[0,0,0],this.tossGroup=new re,this.scene.add(this.tossGroup),this.tossState=null;const s=pe((r,a)=>{const o=r.createRadialGradient(a/2,a/2,0,a/2,a/2,a/2);o.addColorStop(0,"rgba(3,7,11,.62)"),o.addColorStop(.55,"rgba(3,7,11,.34)"),o.addColorStop(1,"rgba(3,7,11,0)"),r.fillStyle=o,r.fillRect(0,0,a,a)},128);this.itemShadow=new Xt(new fe(1,1),new Ke({map:s,transparent:!0,depthWrite:!1,toneMapped:!1})),this.itemShadow.renderOrder=-5,this.itemShadow.visible=!1,this.itemAnchor.add(this.itemShadow),this.inspectLamp=new co(16774375,17,9,2),this.inspectLamp.position.set(-1.5,2,-1.8),this.camera.add(this.inspectLamp),this.inspectLamp.visible=!1,this.itemRim=new co(12968959,18,8,2),this.itemRim.position.set(1.6,.7,-3.8),this.camera.add(this.itemRim),this.itemRim.visible=!1,this.pipeline=new s2(this.renderer,this.scene,this.camera,{samples:matchMedia("(pointer: coarse)").matches?2:4}),this.thumbnailOutput=new df,this.vw=0,this.vh=0,this.stage=null,this.observer=new ResizeObserver(()=>this.resize()),this.observer.observe(this.renderer.domElement),this.modelCache=new Map,this.thumbCache=new Map,this.item=null,this.zoom=1,this.targetX=.08,this.targetY=-.2,this.inspect=!1,this.time=0,this.kick=0,this.pointer=new gt,this.raycaster=new rm,this.frames=[],this.low=!1,this.reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,this.motionQuery=matchMedia("(prefers-reduced-motion: reduce)"),this.motionQuery.addEventListener("change",r=>{this.reduced=r.matches,r.matches&&(this.finishReveal(),this.kick=0),this.dirty=!0}),this.resize()}buildEnvironment(){var n;const t=new bc(this.renderer),e=new Zv;(n=this.envTarget)==null||n.dispose(),this.envTarget=t.fromScene(e,.03),this.scene.environment=this.envTarget.texture,this.scene.environmentIntensity=this.low?.07:.15,e.dispose(),t.dispose()}restoreGLContext(){this.scene.traverse(t=>{const e=Array.isArray(t.material)?t.material:t.material?[t.material]:[];for(const n of e){for(const s of["map","normalMap","roughnessMap","bumpMap","alphaMap","emissiveMap","aoMap","metalnessMap"]){const r=n[s];r&&r.isTexture&&(r.needsUpdate=!0)}n.needsUpdate=!0}}),this.buildEnvironment(),this.renderer.shadowMap.needsUpdate=!0,this.frames.length=0,this.perf.samples=0,this.resize(),this.dirty=!0}buildCourtyard(){const t=new Ct({...Lu("courtyard-stone",[18,18]),normalScale:new gt(1.2,1.2),roughness:.7,metalness:.13,color:10133666});Nt(new fe(38,38),t,this.static,[0,-.03,0],[-Math.PI/2,0,0]);const e=new nf().load("./assets/plaster.jpg");e.colorSpace=$e,e.wrapS=e.wrapT=di,e.repeat.set(3,3),e.anisotropy=4;const n=new Ct({map:e,color:9078651,roughness:.92,bumpMap:e,bumpScale:.065}),s=n.clone();s.color.set(7963519);const r=new Ct({color:8225402,roughness:.9}),a=new Ct({color:10724502,roughness:.84}),o=new Ct({color:2897456,roughness:.78}),l=new Ct({color:2436659,metalness:.32,roughness:.74}),c=pe((p,v)=>{const M=p.createLinearGradient(0,0,v,v);M.addColorStop(0,"#788b91"),M.addColorStop(.48,"#495b60"),M.addColorStop(1,"#1d302c"),p.fillStyle=M,p.fillRect(0,0,v,v),p.save(),p.transform(1,.16,-.07,1,0,0);for(let T=-30;T<v;T+=94){p.fillStyle="#283b3a",p.fillRect(T,70,65,v);for(let b=94;b<v;b+=104)p.fillStyle="#83938b",p.globalAlpha=.24,p.fillRect(T+6,b,24,66),p.fillRect(T+34,b,24,66)}p.restore();const _=p.createLinearGradient(0,0,v,v*.8);_.addColorStop(0,"rgba(238,246,238,.20)"),_.addColorStop(.38,"rgba(238,246,238,.03)"),_.addColorStop(.62,"rgba(238,246,238,0)"),p.fillStyle=_,p.beginPath(),p.moveTo(0,v),p.lineTo(v*.52,0),p.lineTo(v*.78,0),p.lineTo(v*.24,v),p.closePath(),p.fill(),p.fillStyle="rgba(18,31,31,.55)",p.beginPath(),p.moveTo(0,82),p.lineTo(120,38),p.lineTo(150,38),p.lineTo(150,12),p.lineTo(178,12),p.lineTo(178,34),p.lineTo(335,66),p.lineTo(360,30),p.lineTo(386,30),p.lineTo(386,72),p.lineTo(512,96),p.lineTo(512,0),p.lineTo(0,0),p.closePath(),p.fill(),p.fillStyle="rgba(255,190,110,.5)";for(let T=0;T<24;T++)p.fillRect(28+T*67%470,150+T*89%300,7,10)}),h=[6847868,8755092,10399396,4610391].map(p=>new Ct({color:p,map:c,metalness:.24,roughness:.28})),u=Sf,f=(p,v,M,_,T)=>{const b=new re;b.position.set(...M),b.rotation.y=_,this.static.add(b),G(b,[p,v,.65],[0,v/2,0],T,0),G(b,[p,.75,.78],[0,.375,.025],r,0);for(const w of[3.2,6.15,9.1,12.1])G(b,[p,.14,.87],[0,w,.055],a,0),G(b,[p,.07,.98],[0,w+.09,.08],r,0);G(b,[p,.35,1.06],[0,v-.12,.05],a,0),L2(b,p,v,_===0?0:_>0?37:73),Ou(b,p,v,l,a);let E=Math.floor(p/2.45);for(let w=0;w<E;w++)for(let y=0;y<4;y++){let S=(w-(E-1)/2)*2.47,R=1.72+y*2.95;if(_===0&&y===0&&Math.abs(S+3.8)<1.2)continue;const I=1.16,C=1.91;G(b,[I+.26,C+.27,.14],[S,R,.38],a,0),G(b,[I+.05,C+.06,.1],[S,R,.47],o,0);const N=uf(w,y,_===0?0:_>0?1:2),F=N==="lit"?u:h[(w+y)%h.length];G(b,[I,C,.04],[S,R,.54],F,0);for(const z of[-I/2,I/2,0])G(b,[.048,C,.09],[S+z,R,.58],r,0);for(const z of[-C/2,C/2,.24])G(b,[I,.047,.09],[S,R+z,.58],r,0);G(b,[I+.4,.12,.43],[S,R-C/2-.09,.55],a,0),_f(b,S,R,I,C,r,o,a),yf(b,S,R,I,C,N,a,F,(_>0?100:200)+y*10+w)}for(const w of[-p/2+.35,p/2-.38]){zt(b,.07,.07,v,[w,v/2,.53],o,[0,0,0],12);for(let y=1;y<v;y+=2)zt(b,.087,.087,.055,[w,y,.53],O.rust,[0,0,0],12)}for(let w=0;w<13;w++){const y=(Sn()-.5)*p,S=.8+Sn()*.3;G(b,[.2+Sn()*.7,.06+Sn()*.14,.02],[y,S,.335],r,0)}return b};f(20,14,[-8,0,1.5],Math.PI/2,s),f(20,14,[9,0,1.5],-Math.PI/2,n),f(20,13.5,[.5,0,11.6],Math.PI,n);const d=new re;d.position.set(0,0,-7),this.static.add(d),H2(d,{width:20,height:13.5,stone:r,trim:a,dark:o,wall:n,glass:h,lit:u,seed:101,gateX:1.55}),Ou(d,20,13.5,l,a);const m=new Ct({map:Tc("",{bg:"#263e4c",color:"#ebe8d7",lines:["ДОХОДНЫЙ ДОМ","17"],font:76}),roughness:.42});G(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],O.black),Nt(new fe(.75,.55),m,this.static,[-2.75,2.5,-6.465]),G(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],r,.03),G(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],o,.005);for(let p=0;p<6;p++)G(this.static,[.45,.025,.015],[4.1,1.65+p*.07,-6.415],O.black,0);zt(this.static,.036,.036,18,[0,5.35,-6.48],O.rust,[0,0,Math.PI/2],12);for(let p=0;p<2;p++){const v=new Ni([new L(-8,9+p,2),new L(0,7.8+p,1),new L(9,9+p,-1)]);Nt(new Tn(v,24,.012,4,!1),O.black,this.static)}for(const p of[-7.2,8.2])G(this.static,[.24,.17,22],[p,.065,0],r,.025);const x=new Ct({color:8350016,roughness:1,side:Oe});for(let p=0;p<50;p++){let v=(Sn()-.5)*13,M=(Sn()-.5)*14;Nt(new ts(.025+Sn()*.035,5),x,this.static,[v,.008,M],[-Math.PI/2,Sn()*3,Sn()*6])}const g=new Ct({color:2373706,emissive:1452348,emissiveIntensity:.5,transparent:!0,opacity:.55,roughness:.07,metalness:.85,depthWrite:!1});for(let p=0;p<10;p++)Nt(new ts(.55+Sn(),40),g,this.static,[(Sn()-.5)*10,.005,(Sn()-.5)*9],[-Math.PI/2,0,0]).scale.set(1.8,.35+Sn()*.45,1);this.buildProps(),U2(this.static,this.scene)}buildProps(){const t=this.static,e=new Ct({color:1647901,roughness:.64,metalness:.03,bumpMap:O.leather.bumpMap,bumpScale:.005});for(const{x:l,z:c,scale:h}of hf){const u=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([m,x])=>new gt(m*h*1.7,x*h*1.55)),f=new Eo(u,64),d=f.attributes.position;for(let m=0;m<d.count;m++){const x=d.getX(m),g=d.getY(m),p=d.getZ(m),v=Math.atan2(p,x),M=1+.08*Math.sin(v*13+g*12)+.045*Math.sin(v*21-g*7);d.setXYZ(m,x*M,g,p*M)}f.computeVertexNormals(),Nt(f,e,t,[l,.02,c]),we(t,.066*h,.018,[l,h*1.66,c],O.black,[Math.PI/2,0,0]);for(let m=0;m<3;m++)G(t,[.042,.16,.027],[l+Math.sin(m*2)*.04,h*1.84,c+Math.cos(m*2)*.035],e,.006,[.2,m*2,.23])}const n=new re;n.position.set(3.5,.63,-5.84),n.rotation.z=-.1,t.add(n);for(const l of[-.68,.68]){we(n,.48,.038,[l,0,0],O.black),we(n,.44,.014,[l,0,0],O.silver);for(let c=0;c<12;c++){let h=c*Math.PI/6;const u=new L(l,0,0),f=new L(l+Math.cos(h)*.44,Math.sin(h)*.44,0),d=new $r(u,f);Nt(new Tn(d,1,.004,3),O.silver,n)}}const s=(l,c)=>{const h=new L(...l),u=new L(...c);Nt(new Tn(new $r(h,u),1,.025,6),O.red,n)};for(const[l,c]of[[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])s(l,c);G(n,[.32,.07,.16],[-.23,.72,0],O.black),G(n,[.3,.035,.04],[.57,.86,0],O.silver);const r=new Ct({color:8090716,roughness:1});G(t,[.9,.49,.7],[-3.3,.25,-2.6],r,.02);for(let l=0;l<3;l++)G(t,[.92,.016,.018],[-3.3,.12+l*.16,-2.24],O.black,0);const a=yl("paper");a.scale.setScalar(.32),a.rotation.set(-Math.PI/2,0,.35),a.position.set(2,.04,.7),t.add(a);const o=yl("bottle");o.traverse(l=>{l.isMesh&&l.material.transmission&&(l.material=l.material.clone(),l.material.transmission=0,l.material.transparent=!0,l.material.opacity=.72,l.material.color.set(4484675))}),o.scale.setScalar(.32),o.rotation.set(0,0,Math.PI/2+.05),o.position.set(-1.9,.11,1.35),t.add(o)}buildBin(){const t=this.bin,e=new Ct({...Lu("steel-paint"),normalScale:new gt(.65,.65),roughness:.83,metalness:.35,color:12767418});this.binMaterial=e;const n=e.clone();n.color.set(7505259);const s=new Ct({color:2505773,roughness:.58,metalness:.06,bumpMap:O.leather.bumpMap,bumpScale:.007}),r=new Jn(2.55,1.6,1.7,20,12,12),a=r.attributes.position;for(let d=0;d<a.count;d++){let m=a.getY(d);const x=.9+(m+.8)*.0625;a.setX(d,a.getX(d)*x),a.setZ(d,a.getZ(d)*x),Math.abs(a.getZ(d))>.7&&a.setZ(d,a.getZ(d)+-.026*Math.exp(-((a.getX(d)-.35)**2+(m-.1)**2)*9))}r.computeVertexNormals(),Nt(r,e,t,[0,1.22,0]),G(t,[2.68,.105,1.83],[0,2.02,0],n,.035),G(t,[2.34,.075,1.55],[0,.4,0],n,.02);for(const d of[-1.08,1.08])G(t,[.055,1.51,.05],[d,1.2,.812],n,.008),G(t,[.055,1.5,.05],[d,1.2,-.813],n,.008);for(const d of[-.69,.69])G(t,[.044,1.22,.054],[d,1.26,.849],n,.008),G(t,[.044,1.22,.054],[d,1.26,-.849],n,.008);for(const d of[-1.275,1.275])G(t,[.06,.065,1.25],[d,1.65,0],n),G(t,[.065,1.3,.05],[d,1.23,.5],n),G(t,[.065,1.3,.05],[d,1.23,-.5],n),G(t,[.19,.18,.7],[d,1.7,0],n),G(t,[.06,.08,.6],[d*1.11,1.7,0],O.silver);for(const d of[-.95,.95])for(const m of[-.58,.58])G(t,[.15,.19,.12],[d,.35,m],O.silver),zt(t,.18,.18,.15,[d,.19,m],O.black,[0,0,Math.PI/2],28),zt(t,.067,.067,.16,[d,.19,m],O.silver,[0,0,Math.PI/2],24);this.lid=new re,this.lid.position.set(0,2.08,-.92),t.add(this.lid),G(this.lid,[2.79,.13,1.99],[0,.03,.94],s,.065);for(let d=-4;d<=4;d++)G(this.lid,[.065,.07,1.66],[d*.27,.11,.94],n,.026);G(this.lid,[.65,.09,.1],[0,.045,1.99],O.black,.025);for(const d of[-.87,.87])zt(t,.095,.095,.31,[d,2.06,-.93],O.silver,[0,0,Math.PI/2]);const o=pe((d,m,x)=>{d.fillStyle="#cac9ad",d.textAlign="center",d.font="bold 110px Arial",d.fillText("Т Б О",m/2,220),d.font="bold 82px Arial",d.fillText("№ 017",m/2,347),d.globalCompositeOperation="destination-out";for(let g=0;g<1600;g++)d.globalAlpha=x()*.7,d.fillRect(x()*m,x()*m,1+x()*4,1+x()*3)}),l=new Ct({map:o,transparent:!0,depthWrite:!1,roughness:.9});Nt(new fe(.73,.56),l,t,[.62,1.31,.865]);const c=new Ct({map:Tc("",{bg:"#d7d2b6",color:"#464c3c",lines:["БЕРЕГИТЕ","ПЕТЕРБУРГ"],font:58}),roughness:.94});Nt(new fe(.39,.3),c,t,[-.92,1.65,.871],[0,0,-.09]);const h=pe((d,m)=>{d.fillStyle="#d3cdb5",d.fillRect(0,0,m,m),d.fillStyle="#93493c";for(let x=-m;x<m*2;x+=130)d.beginPath(),d.moveTo(x,0),d.lineTo(x+64,0),d.lineTo(x+m+64,m),d.lineTo(x+m,m),d.fill();dn(d,m,m,xi(25),5e3)}),u=new Ct({map:h,roughness:.75});for(const d of[-1.1,1.1])Nt(new fe(.16,.53),u,t,[d,1.33,.847]);const f=pe((d,m)=>{const x=d.createRadialGradient(m/2,m/2,0,m/2,m/2,m*.48);x.addColorStop(0,"rgba(0,8,4,.8)"),x.addColorStop(.5,"rgba(0,8,4,.5)"),x.addColorStop(1,"rgba(0,8,4,0)"),d.fillStyle=x,d.fillRect(0,0,m,m)},128);Nt(new fe(4.5,3.5),new Ke({map:f,transparent:!0,depthWrite:!1}),t,[0,.012,0],[-Math.PI/2,0,0]),B2(t,this.lid),t.remove(this.lid),Tl(t),Tl(this.lid),t.add(this.lid)}lookBy(t,e){return this.vrStereo?this.headLook:(this.headLook.yaw=Vt.clamp(this.headLook.yaw+t*.0022,-.72,.72),this.headLook.pitch=Vt.clamp(this.headLook.pitch-e*.0022,-.16,1.05),this.applyCameraPose(),this.dirty=!0,this.headLook)}resetLook(){return this.headLook={yaw:0,pitch:0},this.applyCameraPose(),this.dirty=!0,this.headLook}lookInfo(){const t=Vt.radToDeg;return{yawDeg:+t(this.headLook.yaw).toFixed(1),pitchDeg:+t(this.headLook.pitch).toFixed(1)}}setView(t){return this.viewOverride=t||null,this.resize(),{fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()}}resize(){var h;this.dirty=!0;const t=this.renderer.domElement.getBoundingClientRect(),e=Math.max(1,Math.round(t.width||innerWidth)),n=Math.max(1,Math.round(t.height||innerHeight));this.vw=e,this.vh=n,this.renderer.setSize(e,n,!1),this.camera.aspect=e/n;const s=e/n<.8;this.camera.fov=s?52:43;const r=!s&&n<=520&&e>650,a=!s&&!r&&e>1050;if(this.camera.position.set(r?4.15:a?4.3:s?2.6:4.2,r?2.65:a?3.4:s?3.5:3.55,r?8.1:a?7.4:s?10.3:7.8),this.camera.lookAt(r?.25:a?.6:s?.9:0,r?1.32:a?2.65:s?2.6:2.4,0),this.viewOverride){const{fov:u=this.camera.fov,position:f,target:d}=this.viewOverride;this.camera.fov=u,f&&this.camera.position.set(...f),d&&this.camera.lookAt(...d)}this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),this.baseCameraPosition.copy(this.camera.position),this.baseCameraQuaternion.copy(this.camera.quaternion),this.applyCameraPose(),this.portrait=s;const o=getComputedStyle(document.documentElement);if(this.stage=Yv(e,n,parseFloat(o.getPropertyValue("--safe-top"))||0,parseFloat(o.getPropertyValue("--safe-bottom"))||0),this.normalStage={...this.stage},this.vrStereo){const u=Math.min(e/2,n)*.72;this.stage={x:(e/2-u)/2,y:(n-u)/2,width:u,height:u}}const l=2*4.2*Math.tan(Vt.degToRad(this.camera.fov/2))/n;this.vrStereo?this.itemAnchor.position.set(0,0,-4.2):this.itemAnchor.position.set((this.stage.x+this.stage.width/2-e/2)*l,(n/2-this.stage.y-this.stage.height/2)*l,-4.2);const c=this.vrStereo?62:this.camera.fov;this.inspectionVeil.scale.set(12*Math.tan(Vt.degToRad(c/2))*e/n,12*Math.tan(Vt.degToRad(c/2)),1),document.querySelector("#app").style.setProperty("--stage-bottom",`${this.stage.y+this.stage.height}px`),this.updateItemLights(),this.item&&this.fitItem(),(h=this.pipeline)==null||h.resize(e,n,this.renderer.getPixelRatio())}fitItem(){const t=this.item.userData.bounds,e=new $n(new L(...t.min),new L(...t.max));e.applyMatrix4(new ne().makeRotationFromQuaternion(this.item.quaternion));const n=e.getSize(new L).multiplyScalar(.5);this.baseScale=this.vrStereo?2*4.2*Math.tan(Vt.degToRad(31))*.56/Math.max(.001,Math.max(n.x,n.y)*2):Cu(n,this.stage,this.vh,this.camera.fov,4.2,this.vw),this.item.scale.setScalar(this.baseScale*this.zoom);const s=this.baseScale*this.zoom;this.itemShadow.scale.set(Math.max(n.x*s*2.5,.3),Math.max(n.x*s*.85,.16),1),this.itemShadow.position.set(0,-n.y*s-.05,-.3)}inspectionBounds(){if(!this.item)return null;this.scene.updateMatrixWorld(!0);const t=this.item.userData.bounds,e=new $n(new L(...t.min),new L(...t.max)),n=[];for(const s of[e.min.x,e.max.x])for(const r of[e.min.y,e.max.y])for(const a of[e.min.z,e.max.z]){const o=new L(s,r,a).applyMatrix4(this.item.matrixWorld).project(this.camera);n.push({x:(o.x+1)*this.vw/2,y:(1-o.y)*this.vh/2})}return{left:Math.min(...n.map(s=>s.x)),right:Math.max(...n.map(s=>s.x)),top:Math.min(...n.map(s=>s.y)),bottom:Math.max(...n.map(s=>s.y)),stage:this.stage}}poke(t=1){this.kick=this.reduced?0:1,this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,t-1))],this.dirty=!0}applyCameraPose(){this.baseCameraPosition&&(this.camera.position.copy(this.baseCameraPosition),this.vrInspectLock?this.camera.quaternion.copy(this.lockedCameraQuaternion):(this.camera.quaternion.copy(this.baseCameraQuaternion),this.camera.rotateY(-this.headLook.yaw),this.camera.rotateX(this.headLook.pitch)),this.camera.updateMatrixWorld(!0))}setVrStereo(t){this.vrStereo=!!t,this.static.visible=!0,t||(this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,!this.vrBodyActive&&this.vrHand&&(this.vrHand.group.visible=!1)),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,this.vw||innerWidth,this.vh||innerHeight),this.applyCameraPose(),this.resize(),this.item&&this.applyReveal(),this.dirty=!0}setVrBodyActive(t){this.vrBodyActive=!!t,!t&&this.vrHand&&(this.vrHand.group.visible=!1),this.dirty=!0}setVrHandMode(t){this.vrHandMode=!!t,t||(!this.vrBodyActive&&this.vrHand&&(this.vrHand.group.visible=!1),this.pose==="hand"&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null,this.pose="free")),t&&this.vrInspectLock&&this.unlockInspectionView(),this.dirty=!0}updateVrHand(t,e){if(!this.vrHand)return;const n=!!(this.vrBodyActive&&(e!=null&&e.visible));this.vrHand.update(t,{...e,handMode:this.vrHandMode,visible:n}),n&&(this.dirty=!0)}handHitsBin(){var s,r;if(!this.vrHandMode||!((r=(s=this.vrHand)==null?void 0:s.group)!=null&&r.visible))return this.gazeHitsBin();this.camera.updateMatrixWorld(!0),this.vrHand.wristPivot.updateMatrixWorld(!0);const e=this.vrHand.wristPivot.localToWorld(new L(0,0,-.15)).clone().sub(this.camera.position).normalize();if(this.raycaster.set(this.camera.position,e),this.raycaster.intersectObject(this.bin,!0).length>0)return!0;const n=new L(0,1.25,0).sub(this.camera.position).normalize();return e.angleTo(n)<=.44}setHandItemRotation(t=0,e=0,n=0,s=null){if(!this.item)return;const[r,a,o]=this.itemBaseRot||[0,0,0];if(this.targetX=r+t,this.targetY=a+e,this.targetZ=o+n,Array.isArray(s)&&s.length===4){const l=new Ne(s[0],s[1],s[2],s[3]);this.targetItemQuat=l.multiply(this.itemBaseQuat||new Ne)}else this.targetItemQuat=null;this.pose="hand",this.dirty=!0}launchDiscardToss(t={x:4.5,y:2.4,z:-6.5}){if(!this.item||this.reduced)return;this.camera.updateMatrixWorld(!0),this.item.updateMatrixWorld(!0);const e=new L,n=new Ne,s=new L;this.item.matrixWorld.decompose(e,n,s);const r=this.item.clone(!0);r.remove(this.silhouette),r.matrixAutoUpdate=!0,r.position.copy(e),r.quaternion.copy(n),r.scale.copy(s),this.tossGroup.clear(),this.tossGroup.add(r);const a=new L(t.x??4.5,t.y??2.4,t.z??-6.5).applyQuaternion(this.camera.quaternion);this.tossState={mesh:r,t:0,dur:.42,vx:a.x,vy:a.y,vz:a.z},this.dirty=!0}setHeadLook(t=0,e=0){if(this.headLook={yaw:Number.isFinite(t)?t:0,pitch:Number.isFinite(e)?e:0},this.vrInspectLock&&!this.vrHandMode&&this.item&&this.headInspectBase&&this.headInspectRotation){const n=Vt.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+n*1.5,this.targetX=Vt.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI),this.pose="head"}else if(this.applyCameraPose(),this.vrStereo&&this.vrHandMode&&this.inspect&&this.handInspectHeadBase){const n=Vt.euclideanModulo(this.headLook.yaw-this.handInspectHeadBase.yaw+Math.PI,Math.PI*2)-Math.PI,s=this.headLook.pitch-this.handInspectHeadBase.pitch;this.itemAnchor.position.set(Vt.clamp(-n*2.4,-.95,.95),Vt.clamp(-s*2.4,-.7,.7),-4.2),this.updateItemLights()}return this.dirty=!0,this.vrInfo()}lockInspectionView(){return this.vrHandMode?this.vrInfo():(this.lockedCameraQuaternion.copy(this.camera.quaternion),this.vrInspectLock=!0,this.headInspectBase={...this.headLook},this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ},this.applyCameraPose(),this.dirty=!0,this.vrInfo())}unlockInspectionView(){return this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose(),this.dirty=!0,this.vrInfo()}syncEyeCameras(t=this.vw,e=this.vh){const n=Math.max(.1,t/2/Math.max(1,e));for(const[s,r]of[[this.eyeL,-1],[this.eyeR,1]])s.aspect=n,s.fov=62,s.updateProjectionMatrix(),s.position.copy(this.camera.position),s.quaternion.copy(this.camera.quaternion),s.position.add(new L(r*.032,0,0).applyQuaternion(this.camera.quaternion)),s.updateMatrixWorld(!0)}renderStereo(){const t=this.vw,e=this.vh,n=Math.floor(t/2);this.syncEyeCameras(t,e),this.renderer.setScissorTest(!0),this.renderer.setViewport(0,0,n,e),this.renderer.setScissor(0,0,n,e),this.renderer.render(this.scene,this.eyeL),this.renderer.setViewport(n,0,t-n,e),this.renderer.setScissor(n,0,t-n,e),this.renderer.render(this.scene,this.eyeR),this.renderer.setScissorTest(!1),this.renderer.setViewport(0,0,t,e)}gazeHitsBin(){return this.camera.updateMatrixWorld(!0),this.pointer.set(0,0),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0}vrInfo(){var e,n,s,r,a,o,l,c,h;const t=Vt.radToDeg;return{stereo:!!this.vrStereo,bodyActive:!!this.vrBodyActive,body:((n=(e=this.vrHand)==null?void 0:e.getBodyInfo)==null?void 0:n.call(e))||null,handMode:!!this.vrHandMode,handSide:((r=(s=this.vrHand)==null?void 0:s.getHandSide)==null?void 0:r.call(s))||"right",handVisible:!!((o=(a=this.vrHand)==null?void 0:a.group)!=null&&o.visible),handPosition:((h=(c=(l=this.vrHand)==null?void 0:l.wristPivot)==null?void 0:c.position)==null?void 0:h.toArray().map(u=>+u.toFixed(3)))||null,inspectLock:!!this.vrInspectLock,yawDeg:+t(this.headLook.yaw).toFixed(2),pitchDeg:+t(this.headLook.pitch).toFixed(2),targetX:+t(this.targetX||0).toFixed(2),targetY:+t(this.targetY||0).toFixed(2),targetZ:+t(this.targetZ||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(u=>+u.toFixed(5))}}hitBin(t,e){const n=t/this.vw*2-1,s=-e/this.vh*2+1;return n>=-1&&n<=1&&s>=-1&&s<=1?(this.pointer.set(n,s),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObject(this.bin,!0).length>0):!1}binScreen(){this.camera.updateMatrixWorld(!0);const t=new L(0,1.2,0).project(this.camera);return{x:(t.x+1)*this.vw/2,y:(1-t.y)*this.vh/2}}binEdge(){this.camera.updateMatrixWorld(!0);const t=new L(-1.26,1.12,.22),e=t.clone().project(this.camera);return t.applyMatrix4(this.camera.matrixWorldInverse),{x:(e.x+1)*this.vw/2,y:(1-e.y)*this.vh/2,onScreen:t.z<-.05&&e.x>=-1&&e.x<=1&&e.y>=-1&&e.y<=1}}getModel(t){return this.modelCache.has(t)||this.modelCache.set(t,yl(t)),this.modelCache.get(t)}show(t,{review:e=!1}={}){this.dirty=!0,this.testRevealHold=!1,this.zoom=1,this.vrStereo||(this.headLook={yaw:0,pitch:0}),this.handInspectHeadBase={...this.headLook},this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.applyCameraPose(),this.item&&(this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.itemId=t,this.pose="front",this.item=this.getModel(t),this.itemAnchor.add(this.item),this.inspectLamp.intensity=ni[t].lamp??17,this.itemRim.intensity=ni[t].rim??18,this.updateItemLights(),this.item.rotation.set(...ni[t].rotation),this.itemBaseRot=[...ni[t].rotation],this.itemBaseQuat=this.item.quaternion.clone(),this.targetItemQuat=null,this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.fitItem(),this.inspect=!0,this.inspectionVeil.visible=!0,this.inspectLamp.visible=!0,this.itemRim.visible=!0,this.itemShadow.visible=!0;const n=[];if(this.item.traverse(s=>{s.isMesh&&(s.castShadow=!1,n.push(s))}),!this.reduced&&!e){this.item.updateMatrixWorld(!0);const s=this.item.matrixWorld.clone().invert();for(const r of n){const a=new Xt(r.geometry,this.silhouetteMat);a.matrix.multiplyMatrices(s,r.matrixWorld),a.matrixAutoUpdate=!1,a.renderOrder=10,this.silhouette.add(a)}this.item.add(this.silhouette)}this.reveal=this.reduced||e?1:0,this.applyReveal(),this.vrStereo&&!this.vrHandMode&&this.lockInspectionView()}hide(){this.testRevealHold=!1,this.dirty=!0,this.static.visible=!0,this.item&&(this.item.visible=!0,this.item.remove(this.silhouette),this.itemAnchor.remove(this.item)),this.silhouette.clear(),this.reveal=1,this.item=null,this.inspect=!1,this.handInspectHeadBase=null,this.vrStereo&&this.itemAnchor.position.set(0,0,-4.2),this.inspectionVeil.visible=!1,this.inspectLamp.visible=!1,this.itemRim.visible=!1,this.itemShadow.visible=!1,this.vrInspectLock=!1,this.headInspectBase=null,this.headInspectRotation=null,this.applyCameraPose()}finishReveal(){this.testRevealHold=!1,this.reveal=1,this.applyReveal(),this.dirty=!0}applyReveal(){if(this.revealState=Ru(this.reveal,this.reduced),!this.item)return;const t=this.revealState;this.static.visible=!(t.ready&&!this.vrStereo),this.item.visible=t.visible,this.silhouette.visible=!t.ready,this.silhouetteMat.opacity=t.silhouette,this.inspectionVeil.material.opacity=t.veil,this.item.scale.setScalar(this.baseScale*(this.zoom||1)*t.scale)}updateItemLights(){var e;const t=((e=ni[this.itemId])==null?void 0:e.lightPosition)??[-1.5,2,-1.8];this.inspectLamp.position.set(this.itemAnchor.position.x+t[0],this.itemAnchor.position.y+t[1],t[2]),this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8)}setPose(t){!this.item||!this.revealState.ready||([this.targetX,this.targetY,this.targetZ]=$v(this.itemId,t),this.targetItemQuat=null,this.pose=t,this.dirty=!0)}setZoom(t){return this.zoom=Vt.clamp(Math.round((this.zoom+t)*100)/100,ho.min,ho.max),this.dirty=!0,this.zoom}rotate(t,e){this.targetItemQuat&&this.item&&(this.targetX=this.item.rotation.x,this.targetY=this.item.rotation.y,this.targetZ=this.item.rotation.z,this.targetItemQuat=null),this.pose="free",this.dirty=!0,this.targetY+=t*.011,this.targetX=Vt.clamp(this.targetX+e*.01,-Math.PI,Math.PI)}setQuality(t){this.low=t,this.pipeline.low=t,this.pixelRatio=Math.round(Math.min(devicePixelRatio||1,this.maxPixelRatio,t?1:1.5)*100)/100,this.renderer.setPixelRatio(this.pixelRatio),this.perf.dpr=this.pixelRatio,this.frames.length=0,this.perf.samples=0,this.renderer.shadowMap.enabled=!t,this.renderer.shadowMap.needsUpdate=!0,this.sun.intensity=t?2.05:1.62,this.hemi.intensity=t?.82:1.12,this.scene.environmentIntensity=t?.07:.15,this.resize()}thumbnail(t){if(this.thumbCache.has(t))return this.thumbCache.get(t);const e=this.getModel(t),n=e.parent,s=e.scale.clone(),r=e.rotation.clone(),a=e.position.clone(),o=new xc;o.background=new Zt("#22343c"),o.environment=this.envTarget.texture,o.environmentIntensity=.45,o.add(new jh(15069183,8288624,1.1));const l=new La(16773341,2);l.position.set(-3,5,4),o.add(l);const c=new La(12377343,.8);c.position.set(3,1,-2),o.add(c);const h=new En(160,160,{type:pi}),u=new En(160,160,{depthBuffer:!1}),f=this.renderer.getRenderTarget(),d=this.renderer.getClearColor(new Zt),m=this.renderer.getClearAlpha();let x;try{o.add(e),e.position.set(0,0,0),e.rotation.set(...ni[t].rotation),e.scale.setScalar(1);const g=e.userData.bounds,p=new $n(new L(...g.min),new L(...g.max));p.applyMatrix4(new ne().makeRotationFromEuler(e.rotation));const v=p.getSize(new L).multiplyScalar(.5);e.scale.setScalar(Cu(v,{x:8,y:12,width:144,height:136},160,34));const M=new sn(34,1,.1,20);M.position.set(0,0,4.2),M.lookAt(0,0,0),this.renderer.setRenderTarget(h),this.renderer.render(o,M),this.thumbnailOutput.render(this.renderer,u,h);const _=new Uint8Array(25600*4);this.renderer.readRenderTargetPixels(u,0,0,160,160,_);const T=document.createElement("canvas");T.width=T.height=160;const b=T.getContext("2d"),E=b.createImageData(160,160);for(let w=0;w<160;w++)E.data.set(_.subarray((159-w)*640,(160-w)*640),w*640);b.putImageData(E,0,0),x=T.toDataURL("image/png"),this.thumbCache.set(t,x)}finally{this.renderer.setRenderTarget(f),this.renderer.setClearColor(d,m),u.dispose(),h.dispose(),o.remove(e),n&&n.add(e),e.scale.copy(s),e.rotation.copy(r),e.position.copy(a),this.dirty=!0}return x}update(t,e=t){if(this.time+=t,this.kick>0&&(this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0),this.kick=Math.max(0,this.kick-t*2.8),this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12)),this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009,this.tossState){const n=this.tossState;n.t+=t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.vy-=14*t,n.mesh.rotation.x+=t*9,n.mesh.rotation.z-=t*7,n.mesh.scale.multiplyScalar(Math.max(.82,1-t*2.2)),this.dirty=!0,n.t>=n.dur&&(this.tossGroup.clear(),this.tossState=null)}if(this.item){const n=this.item.quaternion.clone(),s=this.reduced?1:1-Math.exp(-t*12);this.pose==="hand"&&this.targetItemQuat?this.item.quaternion.slerp(this.targetItemQuat,s):(this.item.rotation.y=Vt.lerp(this.item.rotation.y,this.targetY,s),this.item.rotation.x=Vt.lerp(this.item.rotation.x,this.targetX,s),this.item.rotation.z=Vt.lerp(this.item.rotation.z,this.targetZ,s)),n.angleTo(this.item.quaternion)>1e-4&&this.fitItem(),this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008,this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+t/Vv),this.applyReveal()}(this.vrStereo||this.dirty||this.item&&!this.reduced)&&(this.vrStereo?this.renderStereo():this.pipeline.render(),this.dirty=!1,e>0&&(this.frames.push(e*1e3),this.frames.length>120&&this.frames.shift()),this.adaptResolution())}adaptResolution(){if(this.perf.samples++,this.low||this.perf.samples%90||this.frames.length<30)return;const t=this.frames.reduce((n,s)=>n+s,0)/this.frames.length;this.perf.meanMs=+t.toFixed(2),this.perf.fps=Math.round(1e3/t);let e=this.pixelRatio;t>23&&this.pixelRatio>1?(e=Math.max(1,this.pixelRatio-.15),this.perf.drops++):t<13.4&&this.pixelRatio<this.maxPixelRatio&&(e=Math.min(this.maxPixelRatio,this.pixelRatio+.15),this.perf.raises++),e!==this.pixelRatio&&(this.pixelRatio=Math.round(e*100)/100,this.perf.dpr=this.pixelRatio,this.renderer.setPixelRatio(this.pixelRatio),this.pipeline.resize(this.vw,this.vh,this.pixelRatio),this.frames.length=0,this.dirty=!0)}metrics(){var t;return{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:((t=this.item)==null?void 0:t.userData)||null,meanFrameMs:this.frames.length?this.frames.reduce((e,n)=>e+n,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||Ru(1),quality:this.low?"low":"high",look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()}}}const gn=[{id:"camera",name:"Смена-8М",subtitle:"Плёночный фотоаппарат",era:"ЛОМО · 1970-е",rarity:"rare",description:"Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.",weight:6},{id:"teacup",name:"Чашка с кобальтом",subtitle:"Фарфор с золотой каймой",era:"Ленинград · 1980-е",rarity:"rare",description:"Блюдце потерялось, а привычка пить чай красиво — нет.",weight:7},{id:"watch",name:"Часы «Ракета»",subtitle:"Механические наручные часы",era:"Петродворец · 1970-е",rarity:"rare",description:"Стрелки замерли без семи двенадцать. У каждого своё время.",weight:5},{id:"cassette",name:"Кассета «Белые ночи»",subtitle:"Домашняя запись",era:"Сторона А · 1991",rarity:"ordinary",description:"На наклейке выцветшие буквы. Саундтрек чьего-то лета.",weight:11},{id:"duck",name:"Фарфоровая уточка",subtitle:"Маленькая статуэтка",era:"Без клейма · XX век",rarity:"ordinary",description:"Пережила два переезда и один подоконник. Ищет третий.",weight:9},{id:"book",name:"Томик Блока",subtitle:"Стихотворения",era:"Лениздат · 1982",rarity:"ordinary",description:"Между страницами — запах старой бумаги. Петербург не отпускает.",weight:10},{id:"key",name:"Ключ от парадной",subtitle:"Латунный ключ",era:"Неизвестный адрес",rarity:"ordinary",description:"Тяжёлый, потёртый, совершенно бесполезный. Или нет?",weight:10},{id:"badge",name:"Значок «Ленинград»",subtitle:"Эмаль и латунь",era:"Сувенир · 1980-е",rarity:"ordinary",description:"Маленький кораблик на синей эмали. Город, который всегда с собой.",weight:10},{id:"record",name:"Пластинка «Мелодия»",subtitle:"Винил, 33 оборота",era:"Ленинградский завод",rarity:"rare",description:"Пара царапин не мешает хорошей музыке. Особенно в тишине.",weight:6},{id:"perfume",name:"Флакон духов",subtitle:"Гранёное стекло",era:"Винтаж · 1960-е",rarity:"rare",description:"На дне осталось немного янтарного света.",weight:5},{id:"horse",name:"Медный конёк",subtitle:"Сувенирная фигурка",era:"Безымянная мастерская",rarity:"legendary",description:"Не всадник, но тоже медный. Патина ему к лицу.",weight:2},{id:"compass",name:"Карманный компас",subtitle:"Латунный корпус",era:"Север всегда рядом",rarity:"legendary",description:"Теперь можно потеряться в этом городе чуть более осознанно.",weight:3},{id:"bottle",name:"Пустая бутылка",subtitle:"Зелёное стекло",era:"Хлам · стекло",rarity:"junk",description:"Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.",weight:13},{id:"can",name:"Консервная банка",subtitle:"Пустая, зато с крышкой",era:"Хлам · металл",rarity:"junk",description:"Лучшее в этой банке уже случилось. Осталась форма.",weight:13},{id:"cup",name:"Мятый стаканчик",subtitle:"Кофе закончился",era:"Хлам · бумага",rarity:"junk",description:"Кто-то допил свой капучино и пошёл дальше.",weight:12},{id:"box",name:"Картонная коробка",subtitle:"Слегка промокла",era:"Хлам · картон",rarity:"junk",description:"Подарок внутри не обнаружен. Коробка тоже неплохая.",weight:12},{id:"lid",name:"Ржавая крышка",subtitle:"От неизвестной банки",era:"Хлам · жесть",rarity:"junk",description:"Небольшой круговорот ржавчины в природе.",weight:12},{id:"paper",name:"Старая газета",subtitle:"Вчерашние новости",era:"Хлам · бумага",rarity:"junk",description:"Прогноз обещал дождь. В этом городе трудно ошибиться.",weight:12}],Ef={ordinary:{label:"Обычная находка",color:"#c5d2c1"},rare:{label:"Редкая находка",color:"#b8dbee"},legendary:{label:"Особая находка",color:"#e8c789"},junk:{label:"Самый обычный хлам",color:"#bcb6aa"}},Af="white-night-finds-v1";function Qr(i={}){return{phase:"search",taps:0,current:null,reviewing:!1,collection:[...new Set((Array.isArray(i.collection)?i.collection:[]).filter(t=>gn.some(e=>e.id===t)))],searches:Number.isSafeInteger(i.searches)&&i.searches>=0?i.searches:0,lastKept:Array.isArray(i.lastKept)?i.lastKept.filter(t=>gn.some(e=>e.id===t)).slice(0,3):[]}}function o_(i=Math.random){let t=Math.max(0,Math.min(.999999,i()))*gn.reduce((e,n)=>e+n.weight,0);return gn.find(e=>(t-=e.weight)<0)??gn.at(-1)}function Lo(i,t){if(t.type==="reset")return Qr();if(t.type==="tap"&&i.phase==="search"){if(i.taps<2)return{...i,taps:i.taps+1};const e=gn.some(n=>n.id===t.itemId)?t.itemId:gn[0].id;return{...i,taps:0,current:e,reviewing:!1,phase:"inspect",searches:i.searches+1}}if(t.type==="review"&&i.collection.includes(t.id))return{...i,phase:"inspect",current:t.id,reviewing:!0};if(i.phase==="inspect"&&["keep","discard","close"].includes(t.type)){const e=t.type==="keep"&&!i.reviewing;return{...i,phase:"search",current:null,reviewing:!1,collection:e?[...new Set([...i.collection,i.current])]:i.collection,lastKept:e?[i.current,...i.lastKept.filter(n=>n!==i.current)].slice(0,3):i.lastKept}}return i}function l_(i){try{const t=JSON.parse(i.getItem(Af)||"{}");return Qr((t==null?void 0:t.version)===1?t:{})}catch{return Qr()}}function c_(i,t){try{return i.setItem(Af,JSON.stringify({version:1,collection:t.collection,searches:t.searches,lastKept:t.lastKept})),!0}catch{return!1}}const wi=Math.PI/180,h_=new Ne(-Math.sqrt(.5),0,0,Math.sqrt(.5)),Wu=new L(0,1,0),u_=new L(0,0,1);class d_{constructor(){this.listening=!1,this.permission="unknown",this.error=null,this.raw={yaw:0,pitch:0},this.lastAt=0,this.screenAngleDeg=this.readScreenAngleDeg(),this.hasBase=!1,this.baseQ=new Ne,this.basePitch=0,this.qNow=new Ne,this.qScreen=new Ne,this.relQ=new Ne,this.fwdVec=new L,this.upVec=new L,this.euler=new xn(0,0,0,"YXZ"),this.onRebase=null,this.onOrientation=t=>this.handle(t)}get supported(){return typeof window<"u"&&"DeviceOrientationEvent"in window}readScreenAngleDeg(){var t;return typeof window>"u"?0:(t=window.screen)!=null&&t.orientation&&Number.isFinite(window.screen.orientation.angle)?window.screen.orientation.angle:Number.isFinite(window.orientation)?window.orientation:0}async request(){if(!this.supported)return this.permission="unsupported",this.error="DeviceOrientation недоступен в этом браузере",!1;try{const t=window.DeviceOrientationEvent;return t&&typeof t.requestPermission=="function"&&await t.requestPermission()!=="granted"?(this.permission="denied",this.error="Разрешение на гироскоп не выдано",!1):(this.permission="granted",this.error=null,this.start(),!0)}catch(t){return this.permission="error",this.error=(t==null?void 0:t.message)||String(t),!1}}start(){return!this.supported||this.listening?this.listening:(window.addEventListener("deviceorientation",this.onOrientation),this.listening=!0,!0)}stop(){this.listening&&typeof window<"u"&&window.removeEventListener("deviceorientation",this.onOrientation),this.listening=!1,this.lastAt=0,this.hasBase=!1}calibrate(){this.hasBase=!1,this.raw={yaw:0,pitch:0},typeof this.onRebase=="function"&&this.onRebase()}fresh(t=700){return!!this.lastAt&&performance.now()-this.lastAt<=t}value(){return this.fresh(700)?{...this.raw}:null}deviceQuaternion(t,e,n,s){if(!Number.isFinite(t)){const r=e*wi,a=n*wi,o=s*wi,l=-Math.cos(r)*Math.sin(a),c=Math.sin(r),h=Math.cos(r)*Math.cos(a),u=Math.cos(o),f=Math.sin(o);return this.upVec.set(l*u-c*f,l*f+c*u,h).normalize(),this.qNow.setFromUnitVectors(this.upVec,Wu)}return this.euler.set(e*wi,t*wi,-n*wi,"YXZ"),this.qNow.setFromEuler(this.euler).multiply(h_),this.qScreen.setFromAxisAngle(u_,-s*wi),this.qNow.multiply(this.qScreen)}handle(t){const{alpha:e,beta:n,gamma:s}=t||{};if(!Number.isFinite(n)||!Number.isFinite(s))return;const r=this.readScreenAngleDeg();if(r!==this.screenAngleDeg&&(this.screenAngleDeg=r,this.hasBase=!1,typeof this.onRebase=="function"&&this.onRebase()),this.deviceQuaternion(e,n,s,r),!this.hasBase){this.fwdVec.set(0,0,-1).applyQuaternion(this.qNow);const o=Math.hypot(this.fwdVec.x,this.fwdVec.z)>1e-4?Math.atan2(this.fwdVec.x,-this.fwdVec.z):0;this.baseQ.setFromAxisAngle(Wu,-o),this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.basePitch=this.euler.x,this.hasBase=!0,this.raw={yaw:0,pitch:0},this.lastAt=performance.now();return}this.relQ.copy(this.baseQ).invert().multiply(this.qNow),this.euler.setFromQuaternion(this.relQ,"YXZ"),this.raw={yaw:-this.euler.y,pitch:this.euler.x-this.basePitch},this.lastAt=performance.now()}info(){return{supported:this.supported,listening:this.listening,permission:this.permission,error:this.error,fresh:this.fresh(700),ageMs:this.lastAt?Math.round(performance.now()-this.lastAt):null,yawDeg:+(this.raw.yaw/wi).toFixed(2),pitchDeg:+(this.raw.pitch/wi).toFixed(2),screenAngleDeg:this.screenAngleDeg}}}const Wn=Math.PI/180,Qn=(i,t,e)=>Math.min(e,Math.max(t,i)),Xi=i=>{let t=i;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t},f_=1.5,p_=.5,m_=.14,g_=.05,x_=9,v_=.3,__=.75,M_=3,Xu=20*Wn,qu=15*Wn,Yu=6*Wn,y_=.35,S_=3,b_=.6,$u=1.2,Zu=.8,Ju=12*Wn;class w_{constructor({yawLimitDeg:t=80,pitchMinDeg:e=-68,pitchMaxDeg:n=62}={}){this.yawLimit=Math.abs(t)*Wn,this.pitchMin=Math.min(e,n)*Wn,this.pitchMax=Math.max(e,n)*Wn,this.yaw=0,this.pitch=0,this.status="fusion-wait",this.diagnostics={gyroJumps:0,gyroRebases:0,anchorJumps:0},this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0}reset(t=0,e=0){this.yaw=Qn(t,-this.yawLimit,this.yawLimit),this.pitch=Qn(e,this.pitchMin,this.pitchMax),this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0,this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0,this.anchorMissingSec=0,this.diagnostics.gyroJumps=0,this.diagnostics.gyroRebases=0,this.diagnostics.anchorJumps=0,this.status="fusion-wait"}forgetGyro(){this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec=0}update(t,e,n){const s=Qn(Number.isFinite(t)?t:0,0,.1),r=n&&(n.status==="valid"||n.status==="single")?n:null;e?(this.gyroMissingSec=0,this.integrateGyro(e,s)):(this.lastRaw=null,this.pendingRaw=null,this.pendingGyroFrames=0,this.gyroMissingSec+=s);const a=r?this.gateAnchor(r,s):null;return r?this.anchorMissingSec=0:(this.anchorMissingSec+=s,this.anchorMissingSec>S_&&(this.anchorTrack=null,this.anchorCandidate=null,this.anchorCandidateAgeSec=0)),e?a?(this.correct(a,s),this.status="fusion"):this.status="fusion-gyro":this.gyroMissingSec<=b_?this.status="fusion-wait":a?(this.followCamera(a,s),this.status="fusion-camera"):(n==null?void 0:n.status)==="held"&&this.heldTrusted(n)?(this.followCamera(n,s),this.status="fusion-camera"):this.status="fusion-wait",this.yaw=Qn(this.yaw,-this.yawLimit,this.yawLimit),this.pitch=Qn(this.pitch,this.pitchMin,this.pitchMax),this.status}integrateGyro(t,e){if(!this.lastRaw){this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}const n=Xi(t.yaw-this.lastRaw.yaw),s=t.pitch-this.lastRaw.pitch,r=Qn(x_*Math.max(e,1/60),v_,__);if(Math.abs(n)<=r&&Math.abs(s)<=r){this.yaw+=n,this.pitch+=s,this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0;return}this.pendingRaw&&Math.abs(Xi(t.yaw-this.pendingRaw.yaw))<=r&&Math.abs(t.pitch-this.pendingRaw.pitch)<=r?this.pendingGyroFrames+=1:(this.pendingGyroFrames=1,this.diagnostics.gyroJumps+=1),this.pendingRaw={yaw:t.yaw,pitch:t.pitch},this.pendingGyroFrames>=M_&&(this.lastRaw={yaw:t.yaw,pitch:t.pitch},this.pendingRaw=null,this.pendingGyroFrames=0,this.diagnostics.gyroRebases+=1)}gateAnchor(t,e){const n=Math.abs(Xi(t.yaw-this.yaw))>Xu||Math.abs(t.pitch-this.pitch)>qu,s=!this.anchorTrack||Math.abs(Xi(t.yaw-this.anchorTrack.yaw))>Xu||Math.abs(t.pitch-this.anchorTrack.pitch)>qu;return!n||!s?this.acceptAnchor(t):(this.anchorCandidate&&Math.abs(Xi(t.yaw-this.anchorCandidate.yaw))<=Yu&&Math.abs(t.pitch-this.anchorCandidate.pitch)<=Yu?this.anchorCandidateAgeSec+=e:(this.anchorCandidateAgeSec=0,this.diagnostics.anchorJumps+=1),this.anchorCandidate={yaw:t.yaw,pitch:t.pitch},this.anchorCandidateAgeSec>=y_?this.acceptAnchor(t):null)}acceptAnchor(t){return this.anchorTrack={yaw:t.yaw,pitch:t.pitch},this.anchorCandidate=null,this.anchorCandidateAgeSec=0,t}heldTrusted(t){const e=this.anchorTrack||{yaw:this.yaw,pitch:this.pitch};return Math.abs(Xi(t.yaw-e.yaw))<=Ju&&Math.abs(t.pitch-e.pitch)<=Ju}followCamera(t,e){if(e<=0)return;const n=1-Math.exp(-7*e);this.yaw+=Qn(Xi(t.yaw-this.yaw)*n,-$u*e,$u*e),this.pitch+=Qn((t.pitch-this.pitch)*n,-Zu*e,Zu*e)}correct(t,e){if(e<=0)return;const n=t.status==="valid",s=n?f_:p_,r=n?m_:g_,a=1-Math.exp(-s*e);this.yaw+=Qn(Xi(t.yaw-this.yaw)*a,-r*e,r*e),this.pitch+=Qn((t.pitch-this.pitch)*a,-r*.5*e,r*.5*e)}info(){return{status:this.status,yawDeg:+(this.yaw/Wn).toFixed(2),pitchDeg:+(this.pitch/Wn).toFixed(2),guards:{...this.diagnostics},anchor:this.anchorTrack?{yawDeg:+(this.anchorTrack.yaw/Wn).toFixed(2),pitchDeg:+(this.anchorTrack.pitch/Wn).toFixed(2)}:null}}}const Vn=Math.PI/180,qa=240,Ya=180,T_=62,E_=48,A_=.15,R_=.3,C_=900,P_=120,Ku=(i,t,e)=>Math.min(e,Math.max(t,i));function po(i,t,e,n=null){const s=Math.max(i,t,e),r=Math.min(i,t,e),a=s-r;if(!a)return{hue:-1,sat:0,val:s,chroma:0};let o;return s===i?o=60*((t-e)/a%6):s===t?o=60*((e-i)/a+2):o=60*((i-t)/a+4),o<0&&(o+=360),n?{hue:o,sat:n(a,o)/255*100,val:s,chroma:a}:{hue:o,sat:a/255*100,val:s,chroma:a}}function I_(i,t,e,n){let s=0,r=0,a=0,o=0,l=1e9,c=-1e9,h=1e9,u=-1e9,f=0,d=0,m=0;for(let v=0;v<e;v++)for(let M=0;M<t;M++){const _=(v*t+M)*4,{hue:T,sat:b,val:E,chroma:w}=po(i[_],i[_+1],i[_+2]);if(T<0)continue;let y=Math.abs(T-n);if(y>180&&(y=360-y),y>30||b<14||E<40||w<40)continue;m++,b>f&&(f=b),w>d&&(d=w);const S=(1-y/30)*(b/100);s+=M*S,r+=v*S,a+=S,o++,M<l&&(l=M),M>c&&(c=M),v<h&&(h=v),v>u&&(u=v)}if(o<15||a<=0)return{found:!1,bright:m,n:o};const x=c-l+1,g=u-h+1,p=o/Math.max(1,x*g);return x>t*.75||g>e*.75?{found:!1,bright:m,n:o}:{found:!0,cx:s/a,cy:r/a,area:o,bright:m,n:o,bbW:x,bbH:g,fill:p,maxSat:f,maxChroma:d,minX:l,maxX:c,minY:h,maxY:u}}function L_(i){const t=(i%360+360)%360/60,e=Math.round(255*(1-Math.abs(t%2-1)));return t<1?[255,e,0]:t<2?[e,255,0]:t<3?[0,255,e]:t<4?[0,e,255]:t<5?[e,0,255]:[255,0,e]}function ju(i,t,e){return{yaw:-(i-e.x)*T_*Vn,pitch:(t-e.y)*E_*Vn}}function D_(i,t,e,n){if(!(i!=null&&i.found))return!1;const s=i.bbW/Math.max(1,i.bbH);if(i.fill<.38)return!1;if(i.minX<=1||i.minY<=1||i.maxX>=e-2||i.maxY>=n-2)return!0;const a=t?Math.max(.85,t.aspect*.45):1.15;return s>=a}class U_{constructor(t=null){var e;this.video=t,this.stream=null,this.running=!1,this.error=null,this.synthetic=!1,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=qa,this.canvas.height=Ya),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastFrame=null,this.lastProcessAt=0,this.processMs=0,this.defs=[{id:"left",hue:16},{id:"right",hue:338}],this.markers=this.defs.map(n=>({...n,found:!1,entity:!1,usable:!1,u:0,v:0,seenSince:0,lostAt:0,blob:null,raw:{yaw:0,pitch:0},delta:{yaw:0,pitch:0},shapeOk:!1})),this.calibration=null,this.held=null,this.heldAt=0,this.accepted=null,this.acceptedAt=0,this.pending=null,this.pairState="none",this.pairSeparationDeg=0,this.pairDisagreementDeg=0}setHues(t,e){Number.isFinite(t)&&(this.defs[0].hue=(t%360+360)%360),Number.isFinite(e)&&(this.defs[1].hue=(e%360+360)%360);for(let n=0;n<2;n++)this.markers[n].hue=this.defs[n].hue}get calibrated(){return!!this.calibration}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null,this.video&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}process(t=!1){if(this.synthetic||!this.running||!this.video||!this.ctx)return this.info();const e=performance.now();if(!t&&e-this.lastProcessAt<P_)return this.info();if(this.video.readyState<2||!this.video.videoWidth)return this.info();this.lastProcessAt=e;try{this.ctx.drawImage(this.video,0,0,qa,Ya);const n=this.ctx.getImageData(0,0,qa,Ya);return this.processImageData(n.data,qa,Ya,e,n)}catch(n){return this.error=(n==null?void 0:n.message)||"Не удалось прочитать кадр камеры",this.info()}}processImageData(t,e,n,s=performance.now(),r=null){var c,h,u,f,d;const a=performance.now();this.lastFrame=r||{data:t,width:e,height:n};const o=((c=this.calibration)==null?void 0:c.center)||{x:.5,y:.5};for(let m=0;m<2;m++){const x=this.markers[m],g=I_(t,e,n,this.defs[m].hue),p=((u=(h=this.calibration)==null?void 0:h.shapes)==null?void 0:u[m])||null;if(x.hue=this.defs[m].hue,x.blob=g,x.found=!!g.found,x.shapeOk=D_(g,p,e,n),g.found){x.u=g.cx/Math.max(1,e),x.v=g.cy/Math.max(1,n),x.raw=ju(x.u,x.v,o);const v=(d=(f=this.calibration)==null?void 0:f.baseRaw)==null?void 0:d[m];x.delta=v?{yaw:x.raw.yaw-v.yaw,pitch:x.raw.pitch-v.pitch}:{...x.raw}}this.updateEntity(x,g.found&&x.shapeOk,s),x.usable=!!g.found&&x.entity&&x.shapeOk}const l=this.makeCandidate();return this.accept(l,s),this.processMs=Math.max(0,performance.now()-a),this.info()}updateEntity(t,e,n){if(e){t.seenSince||(t.seenSince=n),t.lostAt=0,n-t.seenSince>=A_*1e3&&(t.entity=!0);return}t.seenSince=0,t.lostAt||(t.lostAt=n),n-t.lostAt>=R_*1e3&&(t.entity=!1)}makeCandidate(){if(!this.calibration)return this.pairState="none",null;const[t,e]=this.markers,n=this.markers.filter(s=>s.usable);if(this.pairDisagreementDeg=0,this.pairSeparationDeg=0,t.usable&&e.usable){const s=(t.raw.yaw-e.raw.yaw)/Vn;this.pairSeparationDeg=+s.toFixed(2);const r=this.calibration.sepDeg,a=Math.hypot((t.delta.yaw-e.delta.yaw)/Vn,(t.delta.pitch-e.delta.pitch)/Vn);if(this.pairDisagreementDeg=+a.toFixed(2),e.u>t.u+.04&&s>5&&Math.abs(s-r)<=Math.max(4,r*.4)&&a<=7)return this.pairState="valid",{status:"valid",yaw:(t.delta.yaw+e.delta.yaw)/2,pitch:(t.delta.pitch+e.delta.pitch)/2};this.pairState="conflict";const l=this.accepted||{yaw:0,pitch:0},c=[t,e].filter(h=>this.singlePlausible(h,h.delta)).sort((h,u)=>Math.hypot(h.delta.yaw-l.yaw,h.delta.pitch-l.pitch)-Math.hypot(u.delta.yaw-l.yaw,u.delta.pitch-l.pitch));return c[0]?{status:"single",yaw:c[0].delta.yaw,pitch:c[0].delta.pitch}:null}if(n.length===1){const s=n[0];return this.pairState="single",this.singlePlausible(s,s.delta)?{status:"single",yaw:s.delta.yaw,pitch:s.delta.pitch}:null}return this.pairState="none",null}singlePlausible(t,e){var a,o;const n=((o=(a=this.calibration)==null?void 0:a.center)==null?void 0:o.x)??.5,s=t.id==="left"?t.u<=n+.03:t.u>=n-.03,r=this.accepted&&Math.hypot(e.yaw-this.accepted.yaw,e.pitch-this.accepted.pitch)<=8*Vn;return s||r}accept(t,e){if(!t){this.pending=null;return}if(!this.accepted||Math.hypot(t.yaw-this.accepted.yaw,t.pitch-this.accepted.pitch)<=30*Vn){this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null;return}if(this.pending&&Math.hypot(t.yaw-this.pending.yaw,t.pitch-this.pending.pitch)<=3*Vn){this.pending.count+=1,this.pending.count>=2&&(this.accepted={...t},this.acceptedAt=e,this.held={yaw:t.yaw,pitch:t.pitch},this.heldAt=e,this.pending=null);return}this.pending={yaw:t.yaw,pitch:t.pitch,count:1}}calibrate(t=performance.now()){const[e,n]=this.markers;if(!e.usable||!n.usable)return{ok:!1,message:"Сначала покажите обе цветные метки и удерживайте их в кадре."};const s={x:(e.u+n.u)/2,y:(e.v+n.v)/2},r=this.markers.map(o=>ju(o.u,o.v,s)),a=(r[0].yaw-r[1].yaw)/Vn;if(!(a>=8))return{ok:!1,message:"Метки слишком близки или стоят не в том порядке: разнесите их шире."};this.calibration={center:s,baseRaw:r,sepDeg:+a.toFixed(2),shapes:this.markers.map(o=>({aspect:+(o.blob.bbW/Math.max(1,o.blob.bbH)).toFixed(3),area:o.blob.area}))};for(let o=0;o<2;o++)this.markers[o].raw={...r[o]},this.markers[o].delta={yaw:0,pitch:0};return this.accepted={status:"valid",yaw:0,pitch:0},this.acceptedAt=t,this.held={yaw:0,pitch:0},this.heldAt=t,this.pending=null,this.pairState="valid",{ok:!0,message:"Метки зафиксированы. Теперь можно надевать очки."}}clearCalibration(){this.calibration=null,this.accepted=null,this.acceptedAt=0,this.held=null,this.heldAt=0,this.pending=null,this.pairState="none"}recalibrateCentre(t=performance.now()){return this.calibration?this.calibrate(t):{ok:!1,message:"Сначала выполните калибровку двух меток."}}sample(t=performance.now()){return!this.calibration||!this.accepted||!this.held?{status:"lost",yaw:0,pitch:0}:t-this.heldAt>C_?{status:"held",yaw:this.held.yaw,pitch:this.held.pitch}:{status:this.accepted.status,yaw:this.accepted.yaw,pitch:this.accepted.pitch}}sampleColor(t,e,n){var _,T;if(!this.lastFrame||!n||n.width<=0||n.height<=0)return null;const{data:s,width:r,height:a}=this.lastFrame,o=((_=this.video)==null?void 0:_.videoWidth)||r,l=((T=this.video)==null?void 0:T.videoHeight)||a,c=o/Math.max(1,l),h=n.width/n.height;let u=n.width,f=n.height,d=0,m=0;c>h+.001?(f=n.width/c,m=(n.height-f)*.5):c<h-.001&&(u=n.height*c,d=(n.width-u)*.5);const x=(t-n.left-d)/Math.max(1,u),g=(e-n.top-m)/Math.max(1,f);if(x<0||x>1||g<0||g>1)return null;const p=Ku(Math.round(x*(r-1)),0,r-1),v=Ku(Math.round(g*(a-1)),0,a-1);let M=null;for(let b=Math.max(0,v-4);b<=Math.min(a-1,v+4);b++)for(let E=Math.max(0,p-4);E<=Math.min(r-1,p+4);E++){const w=(b*r+E)*4,y=po(s[w],s[w+1],s[w+2]);y.hue>=0&&(!M||y.chroma>M.chroma)&&(M=y)}return M?{hue:M.hue,sat:M.sat,val:M.val,chroma:M.chroma}:null}inject(t=[],e=performance.now()){this.synthetic=!0,this.running=!0;const n=320,s=240,r=new Uint8ClampedArray(n*s*4);for(let a=0;a<r.length;a+=4)r[a]=28,r[a+1]=30,r[a+2]=38,r[a+3]=255;for(const a of t)this.paintMarker(r,n,s,a);return this.processImageData(r,n,s,e,{data:r,width:n,height:s})}paintMarker(t,e,n,s={}){const r=this.defs.find(m=>m.id===s.id)||this.defs[0],a=Number.isFinite(s.hue)?s.hue:r.hue,[o,l,c]=L_(a),h=Math.round((s.u??.5)*e),u=Math.round((s.v??.5)*n),f=Math.max(4,Math.round(s.w??56)),d=Math.max(4,Math.round(s.h??28));for(let m=Math.max(0,u-Math.floor(d/2));m<Math.min(n,u+Math.ceil(d/2));m++)for(let x=Math.max(0,h-Math.floor(f/2));x<Math.min(e,h+Math.ceil(f/2));x++){const g=(m*e+x)*4;t[g]=o,t[g+1]=l,t[g+2]=c,t[g+3]=255}}info(t=performance.now()){const e=this.sample(t);return{running:this.running,synthetic:this.synthetic,error:this.error,calibrated:this.calibrated,status:e.status,yawDeg:+(e.yaw/Vn).toFixed(2),pitchDeg:+(e.pitch/Vn).toFixed(2),pairState:this.pairState,pairSeparationDeg:this.pairSeparationDeg,pairDisagreementDeg:this.pairDisagreementDeg,heldMs:this.heldAt?Math.round(t-this.heldAt):null,procMs:+this.processMs.toFixed(2),calibration:this.calibration?{sepDeg:this.calibration.sepDeg,center:{x:+this.calibration.center.x.toFixed(3),y:+this.calibration.center.y.toFixed(3)}}:null,markers:this.markers.map(n=>{var s,r,a;return{id:n.id,hue:n.hue,found:n.found,entity:n.entity,shapeOk:n.shapeOk,usable:n.usable,u:+n.u.toFixed(3),v:+n.v.toFixed(3),area:((s=n.blob)==null?void 0:s.area)||0,aspect:(r=n.blob)!=null&&r.found?+(n.blob.bbW/Math.max(1,n.blob.bbH)).toFixed(2):0,fill:(a=n.blob)!=null&&a.found?+n.blob.fill.toFixed(2):0}})}}}const $a=Math.PI/180;class N_{constructor(t=null){this.gyro=new d_,this.fusion=new w_,this.tracker=new U_(t),this.mode="gyro",this.status="idle",this.look={yaw:0,pitch:0},this.markerSample={status:"lost",yaw:0,pitch:0},this.active=!1,this.gyro.onRebase=()=>this.fusion.forgetGyro()}setMode(t){this.mode=t==="fusion"?"fusion":"gyro",this.mode==="gyro"&&this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.active?this.mode==="gyro"?"gyro":"fusion-wait":"idle"}setHues(t,e){this.tracker.setHues(t,e)}async requestGyro(){return this.gyro.request()}async startCamera(){return this.tracker.start()}start(){this.gyro.start(),this.gyro.calibrate(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!0,this.status=this.mode==="gyro"?"gyro":"fusion-wait",this.mode==="fusion"&&!this.tracker.running&&!this.tracker.synthetic&&this.tracker.start().catch(()=>{})}stop(){this.gyro.stop(),this.tracker.stop(),this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.active=!1,this.status="idle"}calibrate(){if(this.gyro.calibrate(),this.mode==="fusion"&&this.tracker.calibrated){const t=this.tracker.recalibrateCentre();if(!t.ok)return t}return this.fusion.reset(0,0),this.look={yaw:0,pitch:0},this.status=this.mode==="gyro"?"gyro":"fusion-wait",{ok:!0,message:"Центр зафиксирован."}}processPrep(){return this.mode==="fusion"&&this.tracker.process(),this.markerSample=this.tracker.sample(),this.info()}update(t){const e=this.gyro.value();this.markerSample={status:"lost",yaw:0,pitch:0};let n=null;return this.mode==="fusion"&&(this.tracker.process(),n=this.tracker.sample(),this.markerSample=n),this.fusion.update(t,e,n),this.look={yaw:this.fusion.yaw,pitch:this.fusion.pitch},this.mode==="gyro"?this.status=e?"gyro":"gyro-wait":this.status=this.fusion.status,this.look}info(){return{mode:this.mode,status:this.status,active:this.active,yawDeg:+(this.look.yaw/$a).toFixed(2),pitchDeg:+(this.look.pitch/$a).toFixed(2),fusion:this.fusion.info(),gyro:this.gyro.info(),marker:this.tracker.info(),markerSample:{status:this.markerSample.status,yawDeg:+(this.markerSample.yaw/$a).toFixed(2),pitchDeg:+(this.markerSample.pitch/$a).toFixed(2)}}}}const F_=Math.PI/180;class O_{constructor({thresholdDeg:t=13,requiredTransitions:e=2,windowMs:n=4e3,staleMs:s=1800}={}){this.thresholdDeg=t,this.requiredTransitions=e,this.windowMs=n,this.staleMs=s,this.reset()}reset(){this.count=0,this.lastSide=null,this.startedAt=0,this.lastExtremeAt=0}update(t,e=performance.now()){if(!Number.isFinite(t))return!1;this.lastSide&&e-this.startedAt>this.windowMs&&this.reset();const n=t/F_,s=n>=this.thresholdDeg?"right":n<=-this.thresholdDeg?"left":null;return s?this.lastSide?s===this.lastSide?(this.lastExtremeAt=e,!1):(this.count+=1,this.lastSide=s,this.lastExtremeAt=e,this.count>=this.requiredTransitions?(this.reset(),!0):!1):(this.lastSide=s,this.startedAt=e,this.lastExtremeAt=e,!1):(this.lastSide&&e-this.lastExtremeAt>this.staleMs&&this.reset(),!1)}info(){return{count:this.count,required:this.requiredTransitions,lastSide:this.lastSide,active:!!this.lastSide}}}const cs=200,hs=150,z_=90,Ti=8,us=6,B_=400;function Qu(i,t){const e=Math.abs(i-t)%360;return e>180?360-e:e}function td(i,t,e,n,s=34){const r=t/Ti,a=e/us,o=new Float64Array(Ti*us),l=new Float64Array(Ti*us),c=new Float64Array(Ti*us);for(let F=0;F<e;F++){const z=Math.min(us-1,F/a|0),V=F*t*4;for(let B=0;B<t;B++){const k=V+B*4,Y=i[k],nt=i[k+1],K=i[k+2],{hue:mt,sat:It,val:Ut,chroma:$}=po(Y,nt,K);if(mt<0||Ut<72)continue;const rt=Ut>=205?20:36,_t=Ut>=205?34:52;if(It<rt||$<_t)continue;const Tt=Qu(mt,n);if(Tt>s)continue;const wt=(1-Tt/(s+1))*(.35+It/100*.65)*Math.pow(Ut/255,1.35),qt=z*Ti+Math.min(Ti-1,B/r|0);o[qt]+=wt,l[qt]+=B*wt,c[qt]+=F*wt}}let h=0,u=t*.5,f=e*.5;for(let F=0;F<us;F++)for(let z=0;z<Ti;z++){let V=0,B=0,k=0;for(let Y=0;Y<=1&&F+Y<us;Y++)for(let nt=0;nt<=1&&z+nt<Ti;nt++){const K=(F+Y)*Ti+(z+nt);V+=o[K],B+=l[K],k+=c[K]}V>h&&(h=V,u=B/V,f=k/V)}if(h<1.2)return{found:!1,count:0};const d=Math.max(22,Math.round(Math.min(t,e)*.24)),m=Math.max(0,Math.floor(u-d)),x=Math.min(t-1,Math.ceil(u+d)),g=Math.max(0,Math.floor(f-d)),p=Math.min(e-1,Math.ceil(f+d));let v=0,M=0,_=0,T=0,b=t,E=-1,w=e,y=-1;for(let F=g;F<=p;F++){const z=F*t*4;for(let V=m;V<=x;V++){if(Math.hypot(V-u,F-f)>d)continue;const B=z+V*4,k=i[B],Y=i[B+1],nt=i[B+2],{hue:K,sat:mt,val:It,chroma:Ut}=po(k,Y,nt);if(K<0||It<72)continue;const $=It>=205?20:36,rt=It>=205?34:52;if(mt<$||Ut<rt)continue;const _t=Qu(K,n);if(_t>s)continue;const Tt=(1-_t/(s+1))*(.35+mt/100*.65)*(It/255);v+=V*Tt,M+=F*Tt,_+=Tt,T++,V<b&&(b=V),V>E&&(E=V),F<w&&(w=F),F>y&&(y=F)}}if(T<7||_<=0)return{found:!1,count:0};const S=E-b+1,R=y-w+1,I=T/Math.max(1,S*R);if(S>t*.45||R>e*.45||I<.25)return{found:!1,count:0};const C=v/_,N=M/_;return{found:!0,count:T,u:(C+.5)/t,v:(N+.5)/e,bbW:S,bbH:R,fill:I}}class k_{constructor(t=null){var e;this.aspectY=.75,this.video=t,this.stream=null,this.running=!1,this.synthetic=!1,this.error=null,this.distalHue=144,this.proximalHue=320,this.canvas=typeof document<"u"?document.createElement("canvas"):null,this.canvas&&(this.canvas.width=cs,this.canvas.height=hs),this.ctx=((e=this.canvas)==null?void 0:e.getContext("2d",{willReadFrequently:!0}))||null,this.lastProcessAt=0,this.processMs=0,this.lastPairAt=-1e4,this.lastPairPos={u:.5,v:.55,spanNorm:.12},this.latest={status:"none",u:.5,v:.55,spanNorm:0,rollRad:0,distalFound:!1,proximalFound:!1,ts:0}}async start(t=this.video){var s;if(this.synthetic)return this.running=!0,!0;if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia))return this.error="Камера недоступна в этом браузере",!1;this.video=t||this.video;const e=[{video:{facingMode:{exact:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:{facingMode:{ideal:"environment"},width:{ideal:640},height:{ideal:480}},audio:!1},{video:!0,audio:!1}];let n=null;for(const r of e)try{return this.stream=await navigator.mediaDevices.getUserMedia(r),this.video&&(this.video.srcObject=this.stream,await this.video.play()),this.running=!0,this.error=null,!0}catch(a){n=a}return this.error=(n==null?void 0:n.message)||"Не удалось включить камеру",this.running=!1,!1}stop(){if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}this.video&&this.video.srcObject&&(this.video.srcObject=null),this.running=!1,this.synthetic=!1}analyzeRgba(t,e=cs,n=hs,s=performance.now(),r=n/e){this.aspectY=Number.isFinite(r)&&r>.1?r:n/e;const a=td(t,e,n,this.distalHue),o=td(t,e,n,this.proximalHue);return this._commitSpots(a,o,e,n,s,r)}_commitSpots(t,e,n,s,r,a=s/n){const o=Number.isFinite(a)&&a>.1?a:s/n;this.aspectY=o;const l=1.25/Math.hypot(1,o);if(t.found&&e.found){const h=(t.u-e.u)*l,u=(t.v-e.v)*o*l,f=Math.hypot(h,u),d=Math.max(1,t.count||1),m=Math.max(1,e.count||1),x=Math.max(d/m,m/d);if(f>=.018&&f<=.58&&x<=9){const g=(t.u+e.u)*.5,p=(t.v+e.v)*.5;return this.lastPairAt=r,this.lastPairPos={u:g,v:p,spanNorm:f},this.latest={status:"pair",u:g,v:p,spanNorm:f,rollRad:Math.atan2(-u,h),distalFound:!0,proximalFound:!0,ts:r},this.latest}}const c=t.found?t:e.found?e:null;return c&&r-this.lastPairAt<=B_&&Math.hypot(c.u-this.lastPairPos.u,c.v-this.lastPairPos.v)<=.2?(this.latest={status:"single",u:c.u,v:c.v,spanNorm:this.lastPairPos.spanNorm,rollRad:this.latest.rollRad,distalFound:!!t.found,proximalFound:!!e.found,ts:r},this.latest):(this.latest={...this.latest,status:"none",distalFound:!1,proximalFound:!1},this.latest)}process(t=!1,e=performance.now()){if(this.synthetic)return this.latest;if(!this.running||!this.video||!this.ctx||this.video.readyState<2)return this.latest;if(!t&&e-this.lastProcessAt<z_)return this.latest;const n=performance.now();this.lastProcessAt=e;try{const s=this.video.videoWidth||cs,r=this.video.videoHeight||hs;this.ctx.drawImage(this.video,0,0,cs,hs);const a=this.ctx.getImageData(0,0,cs,hs);this.analyzeRgba(a.data,cs,hs,e,r/s)}catch{}return this.processMs=+(performance.now()-n).toFixed(2),this.latest}inject({distal:t=null,proximal:e=null}={},n=performance.now()){this.synthetic=!0,this.running=!0;const s=t?{found:!0,u:t.u,v:t.v,count:t.count??90}:{found:!1,count:0},r=e?{found:!0,u:e.u,v:e.v,count:e.count??90}:{found:!1,count:0};return this._commitSpots(s,r,cs,hs,n)}sample(t=performance.now()){const e=this.latest.ts?t-this.latest.ts:1/0;return{...this.latest,aspectY:+this.aspectY.toFixed(4),fresh:e<=450&&this.latest.status!=="none",ageMs:Number.isFinite(e)?Math.round(e):null}}info(){const t=this.sample();return{running:this.running,synthetic:this.synthetic,error:this.error,status:t.status,fresh:t.fresh,u:+t.u.toFixed(3),v:+t.v.toFixed(3),spanNorm:+t.spanNorm.toFixed(4),rollDeg:+(t.rollRad*180/Math.PI).toFixed(1),distalFound:t.distalFound,proximalFound:t.proximalFound,processMs:this.processMs}}}const de=Math.PI/180,Ci=180/Math.PI,In=.33,bn=.31;function se(i,t,e){return i<t?t:i>e?e:i}function pn([i,t,e,n]){const s=Math.hypot(i,t,e,n);return s<1e-9?[0,0,0,1]:[i/s,t/s,e/s,n/s]}function Ei([i,t,e,n]){return[-i,-t,-e,n]}function Ve(i,t){const[e,n,s,r]=i,[a,o,l,c]=t;return[r*a+e*c+n*l-s*o,r*o-e*l+n*c+s*a,r*l+e*o-n*a+s*c,r*c-e*a-n*o-s*l]}function Ai([i,t,e],n){const s=Math.hypot(i,t,e);if(s<1e-9)return[0,0,0,1];const r=n*.5,a=Math.sin(r)/s;return[i*a,t*a,e*a,Math.cos(r)]}function Be(i,t){const[e,n,s,r]=i,[a,o,l]=t,c=r*a+n*l-s*o,h=r*o+s*a-e*l,u=r*l+e*o-n*a,f=-e*a-n*o-s*l;return[c*r+f*-e+h*-s-u*-n,h*r+f*-n+u*-e-c*-s,u*r+f*-s+c*-n-h*-e]}function H_(i,t){const e=Math.abs(i[0]*t[0]+i[1]*t[1]+i[2]*t[2]+i[3]*t[3]);return 2*Math.acos(se(e,0,1))}function El(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function Js(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function Ln(i){const t=Math.hypot(i[0],i[1],i[2]);return t<1e-9?[1,0,0]:[i[0]/t,i[1]/t,i[2]/t]}function ed(i,t,e){const n=i[0],s=t[0],r=e[0],a=i[1],o=t[1],l=e[1],c=i[2],h=t[2],u=e[2],f=n+o+u;let d,m,x,g;if(f>0){const p=Math.sqrt(f+1)*2;g=.25*p,d=(h-l)/p,m=(r-c)/p,x=(a-s)/p}else if(n>o&&n>u){const p=Math.sqrt(1+n-o-u)*2;g=(h-l)/p,d=.25*p,m=(s+a)/p,x=(r+c)/p}else if(o>u){const p=Math.sqrt(1+o-n-u)*2;g=(r-c)/p,d=(s+a)/p,m=.25*p,x=(l+h)/p}else{const p=Math.sqrt(1+u-n-o)*2;g=(a-s)/p,d=(r+c)/p,m=(l+h)/p,x=.25*p}return pn([d,m,x,g])}function G_(i,t,e=In,n=bn,s=[.42,-.88,.2]){const r=i.x??i[0]??0,a=i.y??i[1]??0,o=i.z??i[2]??0,l=t.x??t[0]??0,c=t.y??t[1]??0,h=t.z??t[2]??0,u=l-r,f=c-a,d=h-o,m=Math.hypot(u,f,d),x=Math.abs(e-n)+.045,g=e+n-.008,p=se(m,x,g),v=m>1e-6?u/m:0,M=m>1e-6?f/m:0,_=m>1e-6?d/m:-1,T={x:r+v*p,y:a+M*p,z:o+_*p},b=(e*e-n*n+p*p)/(2*p),E=Math.sqrt(Math.max(0,e*e-b*b)),w=Ln(s),y=w[0]*v+w[1]*M+w[2]*_;let S=w[0]-y*v,R=w[1]-y*M,I=w[2]-y*_,C=Math.hypot(S,R,I);if(C<1e-5){const V=Js([v,M,_],[1,0,0]),B=Ln(V);S=B[0],R=B[1],I=B[2],C=1}else S/=C,R/=C,I/=C;const N={x:r+v*b+S*E,y:a+M*b+R*E,z:o+_*b+I*E},F=se((e*e+n*n-p*p)/(2*e*n),-1,1),z=(Math.PI-Math.acos(F))*Ci;return{shoulder:{x:r,y:a,z:o},elbow:N,wrist:T,elbowBendDeg:z,clampedDist:p}}function nd(i){if(!i||!i.fresh||i.status==="none")return 0;const t=Math.min(i.u,1-i.u,i.v,1-i.v);if(!(t>0))return 0;const e=se((t-.015)/.05,.2,1);return(i.status==="pair"?1:.45)*e}class V_{constructor(t="right"){const e=typeof t=="string"?t:t==null?void 0:t.handSide;this.handSide=e==="left"?"left":"right",this.qStretch=null,this.qBend=null,this.qBasis=[0,0,0,1],this.qRefInv=[0,0,0,1],this.bendSpanRad=52*de,this.bendInwardYawRad=0,this.yawTrimRad=0,this.pendingSessionRecenter=!1,this.pendingRecenterWindowSec=0,this.calibratedStep=0;const n=this._defaultBeaconU();this.beaconFar={u:n,v:.54,span:.105,captured:!1},this.beaconNear={u:n,v:.64,span:.235,captured:!1},this.lastSensor=null,this.sensorSilentSec=0,this.prevQuat=null,this.prevFwd=null,this.torsoYaw=0;const s=this.sideSign;this.torsoWristPos={x:s*.16,y:-.22,z:-.5},this.torsoWristVel={x:0,y:0,z:0},this.qArm=[0,0,0,1],this.qArmTorso=[0,0,0,1],this.shoulderPos={x:s*.21,y:-.27,z:-.08},this.elbowPos={x:s*.24,y:-.44,z:-.26},this.pos={x:s*.16,y:-.22,z:-.5},this.vel={x:0,y:0,z:0},this.elbowBendDeg=68,this.reach=.25,this.elevationDeg=0,this.headHist=[],this.prevBeaconSpan=NaN,this.prevSolvedLen=NaN,this.beaconRho=NaN,this.bendHoldRad=0,this.holdTiltRad=0,this.bendHoldSet=!1,this.opticMotion=0,this.screenFacingCos=.85,this.trackingSource="idle",this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.lastPokeAt=-1e3,this.dwellAccumSec=0,this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=0,this.maxInspectPitchRad=0,this.maxInspectWristY=0,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0,this.lastDecisionAt=-2e3}get sideSign(){return this.handSide==="left"?-1:1}_defaultBeaconU(){return this.handSide==="left"?.46:.54}setHandSide(t){const e=t==="left"?"left":"right";if(e===this.handSide)return this.handSide;this.handSide=e;const n=this.sideSign;return this.beaconFar.captured||(this.beaconFar.u=this._defaultBeaconU()),this.beaconNear.captured||(this.beaconNear.u=this._defaultBeaconU()),this.torsoWristPos={x:n*Math.abs(this.torsoWristPos.x),y:this.torsoWristPos.y,z:this.torsoWristPos.z},this.torsoWristVel={x:0,y:0,z:0},this.shoulderPos={x:n*.21,y:-.27,z:-.08},this.elbowPos={x:n*.24,y:-.44,z:-.26},this.pos={x:n*Math.abs(this.pos.x),y:this.pos.y,z:this.pos.z},this.vel={x:0,y:0,z:0},this.handSide}exportCalibration(){return this.calibratedStep<2?null:{handSide:this.handSide,qStretch:this.qStretch,qBend:this.qBend,qBasis:this.qBasis,qRefInv:this.qRefInv,bendSpanRad:this.bendSpanRad,bendInwardYawRad:this.bendInwardYawRad,beaconFar:this.beaconFar,beaconNear:this.beaconNear}}importCalibration(t){return!t||!Array.isArray(t.qBasis)||!Array.isArray(t.qRefInv)?!1:((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.qStretch=t.qStretch||[0,0,0,1],this.qBend=t.qBend||[0,0,0,1],this.qBasis=pn(t.qBasis),this.qRefInv=pn(t.qRefInv),this.bendSpanRad=se(Number(t.bendSpanRad)||52*de,15*de,125*de),this.bendInwardYawRad=Number(t.bendInwardYawRad)||0,t.beaconFar&&(this.beaconFar={...this.beaconFar,...t.beaconFar,u:this._defaultBeaconU(),v:.54}),t.beaconNear&&(this.beaconNear={...this.beaconNear,...t.beaconNear,u:se(this._defaultBeaconU()-this.sideSign*.03,.15,.85),v:.64}),this.calibratedStep=2,this.yawTrimRad=0,!0)}feedSensor(t){!t||!Array.isArray(t.q)||t.q.length!==4||((t.handSide==="left"||t.handSide==="right")&&this.setHandSide(t.handSide),this.lastSensor={q:pn(t.q),linMag:Math.max(0,Number(t.linMag)||0),rotRate:Math.max(0,Number(t.rotRate)||0),acc:Array.isArray(t.acc)?t.acc:[0,0,0],ts:t.ts??performance.now()},this.sensorSilentSec=0)}calibrateStretchPose(t=this.lastSensor,e=null){if(!(t!=null&&t.q))return{ok:!1,message:"Нет сигнала от гироскопа на запястье. Подключите браслет."};this.qStretch=pn(t.q);const n=Ln(Be(Ei(this.qStretch),[0,1,0]));let s=[0,0,1];Math.abs(El(s,n))>.9&&(s=[0,1,0]);const r=Ln(Js(n,s)),a=Ln(Js(r,n));this.qBasis=ed(r,n,a),this.qRefInv=Ei(Ve(this.qStretch,this.qBasis)),this.yawTrimRad=0,this.torsoYaw=0;const o=this._defaultBeaconU();e&&e.fresh&&e.status!=="none"&&e.spanNorm>.015?this.beaconFar={u:o,v:.54,span:se(e.spanNorm,.02,.42),captured:!0}:this.beaconFar={u:o,v:.54,span:.105,captured:!1},this.calibratedStep=1;const l=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:1,beaconCaptured:this.beaconFar.captured,message:`Шаг 1 записан (прямая ${l}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`}}calibrateBendPose(t=this.lastSensor,e=null){if(!this.qStretch)return{ok:!1,message:"Сначала выполните Шаг 1 — вытяните прямую руку вперёд."};if(!(t!=null&&t.q))return{ok:!1,message:"Нет свежего сигнала гироскопа с браслета."};const n=pn(t.q),s=Ve(Ei(this.qStretch),n),r=se(s[3],-1,1);if(2*Math.acos(Math.abs(r))<12*de)return{ok:!1,message:"Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз."};const o=Ln(Be(Ei(this.qStretch),[0,1,0])),l=Ln(Be(Ei(n),[0,1,0])),c=se(El(l,o),-1,1),h=[l[0]-c*o[0],l[1]-c*o[1],l[2]-c*o[2]],u=Math.hypot(h[0],h[1],h[2]);if(u<Math.sin(13*de))return{ok:!1,message:"Поднимите предплечье в локте вверх хотя бы на 20° выше горизонтали (не выворачивая кисть)."};const f=[h[0]/u,h[1]/u,h[2]/u],d=[-f[0],-f[1],-f[2]],m=Ln(Js(o,d)),x=Ln(Js(d,m)),g=ed(m,x,d),p=Ei(Ve(this.qStretch,g)),v=Ve(p,Ve(n,g)),M=Be(v,[0,0,-1]),_=Math.atan2(u,c);this.qBend=n,this.qBasis=g,this.qRefInv=p,this.bendSpanRad=se(_,18*de,115*de),this.bendInwardYawRad=Math.atan2(M[0],Math.max(.15,-M[2])),this.yawTrimRad=0;const T=se(this._defaultBeaconU()-this.sideSign*.03,.15,.85);e&&e.fresh&&e.status!=="none"&&e.spanNorm>this.beaconFar.span*1.12?this.beaconNear={u:T,v:.64,span:se(e.spanNorm,this.beaconFar.span+.04,.58),captured:!0}:this.beaconNear={u:T,v:.64,span:se(this.beaconFar.span*1.95,this.beaconFar.span+.07,.45),captured:!1},this.calibratedStep=2;const b=this.handSide==="left"?"левая рука":"правая рука";return{ok:!0,step:2,handSide:this.handSide,bendDeg:+(_*Ci).toFixed(1),beaconCaptured:this.beaconFar.captured&&this.beaconNear.captured,message:`Калибровка готова (${b}, сгиб ${Math.round(_*Ci)}°). Можно надевать очки!`}}recenterOnSessionStart(t=performance.now()){var l;if(this.torsoYaw=0,this.pendingSessionRecenter=!1,this.pendingRecenterWindowSec=0,!((l=this.lastSensor)!=null&&l.q)||!this.qStretch||this.sensorSilentSec>1.6||t-this.lastSensor.ts>2e3)return;const e=pn(Ve(this.qRefInv,Ve(this.lastSensor.q,this.qBasis))),n=Be(e,[0,0,-1]);if(Math.asin(se(n[1],-1,1))>32*de||this.lastSensor.rotRate>38||this.lastSensor.linMag>1.3){this.pendingSessionRecenter=!0,this.pendingRecenterWindowSec=10;return}if(Math.hypot(n[0],n[2])<.35)return;const o=Math.atan2(n[0],-n[2]);Math.abs(o)>22*de&&(this.yawTrimRad=o)}_currentTorsoQuat(){var t;if((t=this.lastSensor)!=null&&t.q&&this.qStretch){const e=Ai([0,1,0],this.yawTrimRad+this.torsoYaw);return pn(Ve(e,Ve(this.qRefInv,Ve(this.lastSensor.q,this.qBasis))))}return[...this.qArmTorso]}onPhaseChange(t,e=performance.now()){if(t==="inspect"){const n=this._currentTorsoQuat(),s=Be(n,[0,0,-1]);this.inspectBaseQ=[...n],this.inspectPrevQ=[...n],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=e,this.maxInspectPitchRad=Math.asin(se(s[1],-1,1)),this.maxInspectWristY=this.torsoWristPos.y,this.itemRot={x:0,y:0,z:0},this.calmLowerSec=0}else this.inspectBaseQ=null,this.inspectPrevQ=null,this.inspectItemQ=[0,0,0,1],this.calmLowerSec=0;t==="search"&&(this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0)}update(t,{beacon:e=null,phase:n="search",revealReady:s=!1,handOverBin:r=!0,headLook:a={yaw:0,pitch:0},now:o=performance.now()}={}){const l=se(t||.016666666666666666,.001,.1),c=this.lastSensor;if(!(c!=null&&c.q))return this.trackingSource="idle",this.snapshot({pokes:0,decision:null,throwVel:null});this.qStretch||this.calibrateStretchPose(c,e);const h=this.sideSign,u=Number.isFinite(a==null?void 0:a.yaw)?a.yaw:0,f=Number.isFinite(a==null?void 0:a.pitch)?a.pitch:0,d=pn(Ve(this.qRefInv,Ve(c.q,this.qBasis)));if(this.pendingSessionRecenter)if(this.pendingRecenterWindowSec-=l,this.pendingRecenterWindowSec<=0)this.pendingSessionRecenter=!1;else{const at=Be(d,[0,0,-1]),bt=Math.asin(se(at[1],-1,1)),Et=Math.hypot(at[0],at[2]);if(bt<=28*de&&bt>=-32*de&&Et>=.45&&c.rotRate<=35&&c.linMag<=1.2){const pt=Math.atan2(at[0],-at[2]);Math.abs(pt)>22*de&&(this.yawTrimRad=pt),this.pendingSessionRecenter=!1}}const m=pn(Ve(Ai([0,1,0],this.yawTrimRad),d)),x=Be(m,[0,0,-1]),g=Math.hypot(x[0],x[2]);let p=this.torsoYaw;if(n==="search"&&g>.35){const at=Math.atan2(x[0],-x[2]),bt=u-this.torsoYaw,Et=at-this.torsoYaw,pt=bt>=0?se(Et,0,bt):se(Et,bt,0);p=se(this.torsoYaw+pt,u-50*de,u+50*de)}else p=se(this.torsoYaw,u-50*de,u+50*de);const v=p-this.torsoYaw;Math.abs(v)>18*de&&(this.torsoYaw+=(v-Math.sign(v)*18*de)*.45),this.torsoYaw+=(p-this.torsoYaw)*Math.min(1,l*3.2);const M=u-this.torsoYaw,_=Ve(Ai([1,0,0],-f),Ai([0,1,0],M)),T=Ai([0,1,0],this.yawTrimRad+this.torsoYaw);this.qArmTorso=pn(Ve(T,d)),this.qArm=pn(Ve(_,this.qArmTorso));let b=c.rotRate;this.prevQuat&&b<1&&(b=H_(this.prevQuat,this.qArmTorso)/l*Ci),this.prevQuat=[...this.qArmTorso];const E=this.sensorSilentSec;this.sensorSilentSec+=l;const w=E>.12?Math.exp(-(E-.12)*8):1,y=c.linMag*w;b*=w;const S=E>1.6,R=Be(Ei(this.qBasis),[0,0,1]),I=Be(this.qArm,R);this.screenFacingCos=I[2];const C=Be(this.qArmTorso,[0,0,-1]);let N=0;if(this.prevFwd){const at=se(El(this.prevFwd,C),-1,1);N=Math.acos(at)/l*Ci}this.prevFwd=[...C];const F=Math.asin(se(C[1],-1,1)),z=Math.atan2(C[0],Math.max(.12,Math.hypot(C[2],C[1]*.35))),V=Math.atan2(C[1],-C[2]);this.elevationDeg=+(V*Ci).toFixed(1);const B=In+bn,k=B-.001,Y=.18,nt=se(V/(75*de),0,1)*.075-se(-V/(80*de),0,1)*.03,K={x:h*.21,y:-.27+nt,z:-.08},mt=se(-h*z/(26*de),0,1),It=Math.max(20*de,this.bendSpanRad),Ut=Math.max(0,V);let $=0;Ut>0?($=Math.min(Ut,It)*(.95+.05*mt),Ut>It&&($-=Math.min($*.55,(Ut-It)*(1-mt)*1.25))):$=se(-V*.18,0,40*de),$=se($,0,150*de);const rt=nd(e)>.5;if(this.bendHoldSet){const at=rt?0:1,bt=se(.5+.5*this.opticMotion,0,1)*(.35+.65*mt),Et=V-this.holdTiltRad,pt=this.bendHoldRad+(Et>=0?Et*bt:Et);$=$+(se(pt,0,150*de)-$)*at}const _t=Ln(Js([0,1,0],C)),Tt=Be(Ai(_t,$),C),wt={x:K.x+In*Tt[0]+bn*C[0],y:K.y+In*Tt[1]+bn*C[1],z:K.z+In*Tt[2]+bn*C[2]};let qt=wt;this.headHist.push({t:o,yaw:u,pitch:f,torso:this.torsoYaw}),this.headHist.length>96&&this.headHist.splice(0,this.headHist.length-96);const Bt=Number.isFinite(e==null?void 0:e.ts)?e.ts:o;let U=this.headHist[this.headHist.length-1]??{yaw:u,pitch:f,torso:this.torsoYaw};for(let at=this.headHist.length-1;at>=0;at--)if(this.headHist[at].t<=Bt){U=this.headHist[at];break}const tt=Ve(Ai([1,0,0],-((U==null?void 0:U.pitch)??f)),Ai([0,1,0],((U==null?void 0:U.yaw)??u)-((U==null?void 0:U.torso)??this.torsoYaw))),j=Number.isFinite(e==null?void 0:e.tanH)?e.tanH:.6371,ot=Number.isFinite(e==null?void 0:e.aspectY)?e.aspectY:.75;let it=nd(e);if(it>0&&Number.isFinite(e==null?void 0:e.spanNorm)&&Number.isFinite(this.prevBeaconSpan)){const at=e.spanNorm-this.prevBeaconSpan,bt=Math.hypot(this.torsoWristPos.x-K.x,this.torsoWristPos.y-K.y,this.torsoWristPos.z-K.z),Et=bt-this.prevSolvedLen;at>-.004&&Et<-.03&&(it*=.3),at<.004&&Et>.03&&(it*=.3),this.prevSolvedLen=bt}else it>0&&(this.prevSolvedLen=Math.hypot(this.torsoWristPos.x-K.x,this.torsoWristPos.y-K.y,this.torsoWristPos.z-K.z));this.prevBeaconSpan=it>0?e.spanNorm:NaN;let xt=null;if(it>0){const at=Ln([(e.u-.5)*2*j,-(e.v-.5)*2*j*ot,-1]),bt=Be(Ei(tt),at),Et=K.x+bn*C[0],pt=K.y+bn*C[1],Wt=K.z+bn*C[2],H=bt[0]*Et+bt[1]*pt+bt[2]*Wt,ut=H*H-(Et*Et+pt*pt+Wt*Wt)+In*In;let ft=H;if(ut>0){const Mt=Math.sqrt(ut),ct=Be(_,[wt.x,wt.y,wt.z]),Ht=Math.hypot(ct[0],ct[1],ct[2])||B,ee=H+Mt,ve=H-Mt;ft=Math.abs(ee-Ht)<=Math.abs(ve-Ht)?ee:ve}ft=se(ft,Y*.7,k+.24),Number.isFinite(this.beaconRho)||(this.beaconRho=ft);const Pt=2.4*l;this.beaconRho+=se(ft-this.beaconRho,-Pt,Pt),xt=[bt[0]*this.beaconRho,bt[1]*this.beaconRho,bt[2]*this.beaconRho]}if(xt){const at=se(.78*it,0,.78),bt=wt.x-K.x,Et=wt.y-K.y,pt=wt.z-K.z,Wt=xt[0]-K.x,H=xt[1]-K.y,ut=xt[2]-K.z,ft=Math.hypot(bt,Et,pt)||1e-4,Pt=Math.hypot(Wt,H,ut)||1e-4,Mt=Ln([bt/ft+(Wt/Pt-bt/ft)*at,Et/ft+(H/Pt-Et/ft)*at,pt/ft+(ut/Pt-pt/ft)*at]),ct=ft+(se(Pt,Y,B)-ft)*at;qt={x:K.x+Mt[0]*ct,y:K.y+Mt[1]*ct,z:K.z+Mt[2]*ct}}if(this.trackingSource=S?"stale":it>.5?"gyro+beacon":"gyro-only",xt&&it>.5){const at=Be(tt,[wt.x,wt.y,wt.z]);if(at[2]<-.08){const bt=se(.5+at[0]/-at[2]/(2*j),.06,.94),Et=e.u-bt,pt=12*de*l;this.yawTrimRad=se(this.yawTrimRad-se(Et*.35,-pt,pt),-180*de,180*de)}}let dt=$;{const at=qt.x-K.x,bt=qt.y-K.y,Et=qt.z-K.z,pt=Math.hypot(at,bt,Et),Wt=se(pt,Math.abs(In-bn),B),H=se((In*In+bn*bn-Wt*Wt)/(2*In*bn),-1,1);dt=Math.PI-Math.acos(H);const ut=pt>k?k:pt<Y?Y:0;if(ut&&pt>1e-4){const ft=ut/pt;qt={x:K.x+at*ft,y:K.y+bt*ft,z:K.z+Et*ft}}}const vt=26,Jt=Math.max(1,Math.ceil(l/.017)),$t=l/Jt;for(let at=0;at<Jt;at++)for(const bt of["x","y","z"]){const Et=qt[bt]-this.torsoWristPos[bt],pt=vt*vt*Et-2*vt*this.torsoWristVel[bt];this.torsoWristVel[bt]+=pt*$t,this.torsoWristPos[bt]+=this.torsoWristVel[bt]*$t}const D=se((this.torsoWristPos.y+.1)*.55,-.15,.42),A=[h*.44,-.86+D,.22],W=G_(K,this.torsoWristPos,In,bn,A);if(this.torsoWristPos={...W.wrist},this.elbowBendDeg=+W.elbowBendDeg.toFixed(1),it>.5){if(this.bendHoldSet){const at=dt-this.bendHoldRad,bt=V-this.holdTiltRad-at;Math.abs(at)+Math.abs(bt)>1.2*de&&(this.opticMotion+=(se(at/(Math.abs(at)+Math.abs(bt)),-1,1)-this.opticMotion)*.35)}this.bendHoldRad=se(dt,0,150*de),this.holdTiltRad=V,this.bendHoldSet=!0}const Q=se(1-.84*se(dt/this.bendSpanRad,0,1.15),.06,1.02);this.reach+=(Q-this.reach)*(1-Math.exp(-l*18));const ht=Be(_,[W.shoulder.x,W.shoulder.y,W.shoulder.z]),J=Be(_,[W.elbow.x,W.elbow.y,W.elbow.z]),Ft=Be(_,[W.wrist.x,W.wrist.y,W.wrist.z]),yt=Be(_,[this.torsoWristVel.x,this.torsoWristVel.y,this.torsoWristVel.z]);this.shoulderPos={x:ht[0],y:ht[1],z:ht[2]},this.elbowPos={x:J[0],y:J[1],z:J[2]},this.pos={x:Ft[0],y:Ft[1],z:Ft[2]},this.vel={x:yt[0],y:yt[1],z:yt[2]};let Lt=0,kt=null,St=null;if(S)return this.dwellAccumSec=0,this.calmLowerSec=0,this.snapshot({pokes:0,decision:null,throwVel:null,pitchUpDeg:+(F*Ci).toFixed(1)});if(n==="search")if(this.reach>=.6&&r){this.rummageAnchorYaw===null&&(this.rummageAnchorYaw=z,this.rummageAnchorPitch=F);const bt=z-this.rummageAnchorYaw,Et=F-this.rummageAnchorPitch,pt=Math.hypot(bt,Et)*Ci,H=(Math.abs(bt)>=Math.abs(Et)?bt:Et)>=0?1:-1,ut=o-this.lastPokeAt>=270,ft=pt>=6.8&&(this.rummageDir===0||H!==this.rummageDir),Pt=y>=1.35&&b>=28;ut&&(ft||Pt)?(Lt=1,this.lastPokeAt=o,this.rummageDir=H,this.rummageAnchorYaw=z,this.rummageAnchorPitch=F,this.dwellAccumSec=0):(b>=12||y>=.55)&&(this.dwellAccumSec+=l,this.dwellAccumSec>=.62&&ut&&(Lt=1,this.lastPokeAt=o,this.dwellAccumSec=0))}else this.rummageAnchorYaw=null,this.rummageAnchorPitch=null,this.rummageDir=0,this.dwellAccumSec=0;else if(n==="inspect"){(!this.inspectBaseQ||!this.inspectPrevQ)&&(this.inspectBaseQ=[...this.qArmTorso],this.inspectPrevQ=[...this.qArmTorso],this.inspectItemQ=[0,0,0,1],this.inspectEnteredAt=o,this.maxInspectPitchRad=F,this.maxInspectWristY=this.torsoWristPos.y,this.itemRot={x:0,y:0,z:0}),F>this.maxInspectPitchRad&&(this.maxInspectPitchRad=F),this.torsoWristPos.y>this.maxInspectWristY&&(this.maxInspectWristY=this.torsoWristPos.y);let at=pn(Ve(this.qArmTorso,Ei(this.inspectPrevQ)));this.inspectPrevQ=[...this.qArmTorso],at[3]<0&&(at=[-at[0],-at[1],-at[2],-at[3]]);const bt=Math.hypot(at[0],at[1],at[2]);if(bt>1e-7){const Wt=2*Math.atan2(bt,at[3])/bt,H=at[0]*Wt,ut=at[1]*Wt,ft=at[2]*Wt,Pt=H*1.55,Mt=ut*1.75-ft*.7,ct=ft*1.25,Ht=Math.hypot(Pt,Mt,ct);if(Ht>1e-8){const ee=Ai([Pt,Mt,ct],Ht);this.inspectItemQ=pn(Ve(ee,this.inspectItemQ))}this.itemRot={x:this.itemRot.x+Pt,y:this.itemRot.y+Mt,z:this.itemRot.z+ct}}if(s&&o-this.inspectEnteredAt>=450&&o-this.lastDecisionAt>=900){const pt=y>=7.2,Wt=b>=245&&y>=2.4,H=b>=310&&N>=195;if(pt||Wt||H){kt="discard",this.lastDecisionAt=o,this.calmLowerSec=0;const ut=Be(this.qArm,[0,0,-1]),ft=ut[0]>=0?1:-1;St={x:se(ut[0]*7.5+ft*3.8+this.vel.x*2.2,-9.5,9.5),y:se(ut[1]*4.5+2.2+this.vel.y*1.8,.5,7.5),z:-6.8}}else{const ut=this.maxInspectPitchRad-F,ft=F<=-21*de&&ut>=16*de||F<=-38*de||W.wrist.y<=-.38&&W.wrist.y<=this.maxInspectWristY-.08&&ut>=14*de,Pt=y<3.1&&b<105;ft&&Pt?(this.calmLowerSec+=l,this.calmLowerSec>=.65&&(kt="keep",this.lastDecisionAt=o,this.calmLowerSec=0)):this.calmLowerSec=Math.max(0,this.calmLowerSec-l*2.2)}}}return this.snapshot({pokes:Lt,decision:kt,throwVel:St,pitchUpDeg:+(F*Ci).toFixed(1)})}snapshot(t={}){return{handSide:this.handSide,calibratedStep:this.calibratedStep,trackingSource:this.trackingSource,torsoYaw:+this.torsoYaw.toFixed(4),qArm:[...this.qArm],shoulderPos:{...this.shoulderPos},elbowPos:{...this.elbowPos},pos:{...this.pos},vel:{x:+this.vel.x.toFixed(3),y:+this.vel.y.toFixed(3),z:+this.vel.z.toFixed(3)},elbowBendDeg:this.elbowBendDeg,elevationDeg:this.elevationDeg,reach:+this.reach.toFixed(3),screenFacingCos:+this.screenFacingCos.toFixed(3),itemRot:{...this.itemRot},itemQuat:[...this.inspectItemQ],calmLowerProgress:+se(this.calmLowerSec/.65,0,1).toFixed(2),...t}}}const W_="modulepreload",X_=function(i,t){return new URL(i,t).href},id={},sd=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=a(e.map(h=>{if(h=X_(h,n),h in id)return;id[h]=!0;const u=h.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!n)for(let x=o.length-1;x>=0;x--){const g=o[x];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${f}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":W_,u||(m.as="script"),m.crossOrigin="",m.href=h,c&&m.setAttribute("nonce",c),document.head.appendChild(m),u)return new Promise((x,g)=>{m.addEventListener("load",x),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},rd="https://www.gstatic.com/firebasejs/11.0.1",Rf="ckc_stand_cfg",Cf="wn_firebase_cfg",q_="wn-wrist-demo-v1",Y_=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];function $_(i){if(!i||typeof i!="string")return null;const t=i.trim();if(!t)return null;if(/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(t))return{databaseURL:t.replace(/\/$/,"")};try{const r=JSON.parse(t);if(r&&typeof r=="object"&&(r.databaseURL||r.projectId))return r}catch{}const e={},n=/([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;let s;for(;(s=n.exec(t))!==null;)e[s[1]]=s[3];return!e.databaseURL&&e.projectId&&(e.databaseURL=`https://${e.projectId}-default-rtdb.firebaseio.com`),e.databaseURL?e:null}function Z_(){try{return localStorage.getItem(Rf)||localStorage.getItem(Cf)||""}catch{return""}}function J_(i){try{localStorage.setItem(Rf,i),localStorage.setItem(Cf,i)}catch{}}function ad(){return String(Math.floor(1e5+Math.random()*9e5))}function K_(){return"h"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}function od(i){if(!i||typeof i!="string")return!1;const t=i.trim().toLowerCase();return!!(t.endsWith(".local")||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(t)||t.startsWith("fd")||t.startsWith("fc")||t.startsWith("fe80:"))}class j_{constructor({onSensor:t,onCalCommand:e,onHandSide:n,onStatus:s}={}){this.onSensor=t||(()=>{}),this.onCalCommand=e||(()=>{}),this.onHandSide=n||(()=>{}),this.onStatus=s||(()=>{}),this.mode="off",this.roomCode="",this.connected=!1,this.p2pOpen=!1,this.routeKind="idle",this.rttMs=null,this.rxHz=0,this.error=null,this.db=null,this.fbMod=null,this.unsubs=[],this.bc=null,this.pc=null,this.dcFast=null,this.dcCtrl=null,this.hid="",this.pendingCandidates=[],this.attempt=0,this.offerInFlight=!1,this.offerStartedAt=0,this.preferLanOnly=!1,this.peerJoined=!1,this.peerSid="",this.hostHandSide="right",this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastAnyRxAt=0,this.lastSeq=-1,this.seenCalIds=new Set,this.rxTimes=[],this.pingTimer=null,this.watchdogTimer=null,this.wakeLock=null}async acquireWakeLock(){var t,e,n;try{typeof navigator<"u"&&((t=navigator.wakeLock)!=null&&t.request)&&!this.wakeLock&&(this.wakeLock=await navigator.wakeLock.request("screen"),(n=(e=this.wakeLock).addEventListener)==null||n.call(e,"release",()=>{this.wakeLock=null}))}catch{}}releaseWakeLock(){var t,e;try{(e=(t=this.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}this.wakeLock=null}startDemo(t=this.roomCode||ad(),e=this.hostHandSide){return this.stop(),this.mode="demo",this.roomCode=String(t),this.hostHandSide=e==="left"?"left":"right",this.routeKind="demo",this.error=null,typeof BroadcastChannel<"u"&&(this.bc=new BroadcastChannel(q_),this.bc.onmessage=n=>{var r;const s=n==null?void 0:n.data;if(!(!s||String(s.room)!==this.roomCode))if(s.k==="hello")this.connected=!0,this.p2pOpen=!0,this.lastSeq=-1,s.sid&&(this.peerSid=String(s.sid)),s.explicitSide&&(s.side==="left"||s.side==="right")&&(this.hostHandSide=s.side,this.onHandSide(s.side)),(r=this.bc)==null||r.postMessage({k:"ack",room:this.roomCode,side:this.hostHandSide,ts:Date.now()}),this._emitStatus();else if(s.k==="wrist")this.connected=!0,this.p2pOpen=!0,this._handlePacket(s,!0);else if(s.k==="cal"&&s.step){const a=s.id||`${s.step}:${s.ts||0}`;this.seenCalIds.has(a)||(this.seenCalIds.add(a),this.onCalCommand(s.step))}else s.k==="hand_side"&&(s.side==="left"||s.side==="right")&&this.onHandSide(s.side)}),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"demo"}}async startFirebase(t,e=this.hostHandSide){const n=$_(t);if(!n)return this.error="Вставьте корректный firebaseConfig или URL Realtime Database",this._emitStatus(),{ok:!1,error:this.error};J_(t),this.stop(),this.mode="firebase",this.roomCode=ad(),this.hostHandSide=e==="left"?"left":"right",this.error=null;try{const[{initializeApp:s,getApps:r,deleteApp:a},o]=await Promise.all([sd(()=>import(`${rd}/firebase-app.js`),[],import.meta.url),sd(()=>import(`${rd}/firebase-database.js`),[],import.meta.url)]),l=r().find(p=>p.name==="wn-wrist-host");if(l)try{await a(l)}catch{}const c=s(n,"wn-wrist-host");this.db=o.getDatabase(c,n.databaseURL),this.fbMod=o;const{ref:h,set:u,onValue:f,onChildAdded:d,onDisconnect:m}=o,x=`wn_wrist_rooms/${this.roomCode}`;await u(h(this.db,x),{createdAt:Date.now(),hostAlive:!0,hostHandSide:{side:this.hostHandSide,ts:Date.now()}});try{m(h(this.db,`${x}/hostAlive`)).remove()}catch{}this.unsubs.push(f(h(this.db,`${x}/wristJoined`),p=>{p.val()&&(this.peerJoined=!0,this.connected=!0,this.lastSeq=-1,!this.isFastHealthy()&&!this._isOfferNegotiating()&&this._startRtcOffer(!1),this._emitStatus())})),this.unsubs.push(f(h(this.db,`${x}/fbInput`),p=>{const v=p.val();v&&(this.connected=!0,this.isFastHealthy()||(this.routeKind="firebase",this._handlePacket(v,!1)))}));let g=!0;return this.unsubs.push(f(h(this.db,`${x}/calCmd`),p=>{const v=p.val();if(g){g=!1,v!=null&&v.id&&this.seenCalIds.add(v.id);return}if(!v||!v.step)return;const M=v.id||`${v.step}:${v.ts||0}`;this.seenCalIds.has(M)||(this.seenCalIds.add(M),this.onCalCommand(v.step))})),this.unsubs.push(f(h(this.db,`${x}/handSide`),p=>{const v=p.val();v&&(v.side==="left"||v.side==="right")&&this.onHandSide(v.side)})),this.unsubs.push(f(h(this.db,`${x}/rtc/hello`),p=>{const v=p.val();!v||!v.ts||(this.peerJoined=!0,this.connected=!0,!this.isFastHealthy()&&!this._isOfferNegotiating()&&this._startRtcOffer(!1))})),this.unsubs.push(f(h(this.db,`${x}/rtc/answer`),async p=>{const v=p.val();if(!v||v.hid!==this.hid||!this.pc||this.pc.signalingState!=="have-local-offer")return;const M=this.hid;try{await this.pc.setRemoteDescription({type:"answer",sdp:v.sdp});const _=this.pendingCandidates.filter(T=>T.hid===M);this.pendingCandidates=[];for(const T of _){if(this.hid!==M||!this.pc)break;try{await this.pc.addIceCandidate(T.candidate)}catch{}}}catch{}})),this.unsubs.push(d(h(this.db,`${x}/rtc/wristCandidates`),async p=>{const v=p.val();if(!(!v||!v.candidate||!v.hid)){if(v.hid!==this.hid||!this.pc||!this.pc.remoteDescription){this.pendingCandidates.push(v),this.pendingCandidates.length>48&&this.pendingCandidates.shift();return}try{await this.pc.addIceCandidate(v.candidate)}catch{}}})),await this.acquireWakeLock(),this._startMeters(),this._emitStatus(),{ok:!0,roomCode:this.roomCode,mode:"firebase"}}catch(s){return this.error=(s==null?void 0:s.message)||"Ошибка подключения к Firebase",this._emitStatus(),{ok:!1,error:this.error}}}isFastHealthy(t=performance.now()){if(this.mode==="demo")return this.p2pOpen;if(!this.dcFast||this.dcFast.readyState!=="open")return!1;const e=this.lastPongAt>0?Math.max(0,t-this.lastPongAt):1/0,n=this.lastFastRxAt>0?Math.max(0,t-this.lastFastRxAt):1/0,s=Math.min(e,n);return Number.isFinite(s)?s<8500:this.dcOpenedAt>0&&Math.max(0,t-this.dcOpenedAt)<3500}_isOfferNegotiating(t=performance.now()){if(this.offerInFlight)return!0;if(!this.pc||!this.offerStartedAt)return!1;const e=this.pc.connectionState;return e==="failed"||e==="closed"?!1:Math.max(0,t-this.offerStartedAt)<4500}async _startRtcOffer(t=!1){if(!(typeof RTCPeerConnection>"u"||!this.db||!this.fbMod)&&!this.offerInFlight){this.offerInFlight=!0;try{this._closePcOnly(),this.attempt+=1,this.hid=K_(),this.offerStartedAt=performance.now();const e=this.hid,n=this.preferLanOnly||!t&&this.attempt%2===1,s=n?[]:Y_,{ref:r,set:a,push:o,remove:l}=this.fbMod,c=`wn_wrist_rooms/${this.roomCode}/rtc`;try{await Promise.all([l(r(this.db,`${c}/answer`)),l(r(this.db,`${c}/hostCandidates`)),l(r(this.db,`${c}/wristCandidates`))])}catch{}if(this.mode!=="firebase"||this.hid!==e)return;const h=new RTCPeerConnection({iceServers:s});this.pc=h;const u=h.createDataChannel("wrist-fast",{ordered:!1,maxRetransmits:0}),f=h.createDataChannel("wrist-ctrl",{ordered:!0});this.dcFast=u,this.dcCtrl=f;const d=()=>{this.hid===e&&(this.p2pOpen=!0,this.connected=!0,this.lastSeq=-1,this.dcOpenedAt=performance.now(),this._inspectRoute(n),this._emitStatus())};u.onopen=d,f.onopen=d,u.onmessage=m=>this._onChannelMessage(m.data,!0),f.onmessage=m=>this._onChannelMessage(m.data,!1),h.onicecandidate=m=>{!m.candidate||this.hid!==e||o(r(this.db,`${c}/hostCandidates`),{hid:e,candidate:m.candidate.toJSON?m.candidate.toJSON():m.candidate}).catch(()=>{})},h.onconnectionstatechange=()=>{if(this.hid!==e)return;const m=h.connectionState;m==="connected"?(this.p2pOpen=!0,this._inspectRoute(n),this._emitStatus()):(m==="failed"||m==="closed")&&(this.p2pOpen=!1,this.offerStartedAt=0,this.routeKind=this.connected?"firebase":"idle",this._emitStatus())};try{const m=await h.createOffer();await h.setLocalDescription(m),await a(r(this.db,`${c}/offer`),{hid:e,sdp:m.sdp,iceMode:n?"lan":"stun",ts:Date.now()})}catch{}}finally{this.offerInFlight=!1}}}async _inspectRoute(t){var e;if(!((e=this.pc)!=null&&e.getStats)){this.routeKind=t?"lan":"stun";return}try{const n=await this.pc.getStats();let s=null;const r=new Map;if(n.forEach(a=>{(a.type==="local-candidate"||a.type==="remote-candidate")&&r.set(a.id,a),a.type==="candidate-pair"&&(a.nominated||a.state==="succeeded")&&(s=a)}),s){const a=r.get(s.localCandidateId),o=r.get(s.remoteCandidateId),l=(a==null?void 0:a.candidateType)||"",c=(o==null?void 0:o.candidateType)||"",h=Number.isFinite(s.currentRoundTripTime)?s.currentRoundTripTime*1e3:null,f=t||(l==="host"||l==="prflx")&&(c==="host"||c==="prflx")&&(od(a==null?void 0:a.address)||od(o==null?void 0:o.address)||h!==null&&h<22);this.routeKind=f?"lan":"stun",f&&(this.preferLanOnly=!0);return}}catch{}this.routeKind=t?"lan":"stun"}_onChannelMessage(t,e){let n;try{n=typeof t=="string"?JSON.parse(t):null}catch{return}if(!n)return;const s=performance.now();if(n.k==="ping"){this._sendCtrl({k:"pong",t:n.t});return}if(n.k==="pong"){if(this.lastPongAt=s,Number.isFinite(n.t)){const r=Math.max(1,Math.round(s-n.t));this.rttMs=this.rttMs===null?r:Math.round(this.rttMs*.65+r*.35)}this._emitStatus();return}if(n.k==="cal"&&n.step){const r=n.id||`${n.step}:${n.ts||0}`;this.seenCalIds.has(r)||(this.seenCalIds.add(r),this.onCalCommand(n.step));return}if(n.k==="hand_side"&&(n.side==="left"||n.side==="right")){this.onHandSide(n.side);return}n.k==="wrist"&&(this.lastFastRxAt=s,this.p2pOpen=!0,this._handlePacket(n,e))}_sendCtrl(t){var n;const e=((n=this.dcCtrl)==null?void 0:n.readyState)==="open"?this.dcCtrl:this.dcFast;if((e==null?void 0:e.readyState)==="open")try{e.send(JSON.stringify(t))}catch{}}sendHandSide(t){const e=t==="left"?"left":"right";this.hostHandSide=e;const n={k:"hand_side",room:this.roomCode,side:e,ts:Date.now()};if(this.mode==="demo"&&this.bc&&this.bc.postMessage(n),this._sendCtrl(n),this.mode==="firebase"&&this.db&&this.fbMod&&this.roomCode){const{ref:s,set:r}=this.fbMod;r(s(this.db,`wn_wrist_rooms/${this.roomCode}/hostHandSide`),n).catch(()=>{})}}_handlePacket(t,e){const n=performance.now();if(t.sid&&t.sid!==this.peerSid&&(this.peerSid=String(t.sid),this.lastSeq=-1),e&&Number.isFinite(t.seq)){if(t.seq<=this.lastSeq&&this.lastSeq-t.seq<45)return;this.lastSeq=t.seq}for(this.lastAnyRxAt=n,this.rxTimes.push(n);this.rxTimes.length&&n-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:n})}injectPacket(t,e=performance.now()){this.connected=!0,this.p2pOpen=!0,this.routeKind="demo",this.lastAnyRxAt=e,this.rxHz=60,this.onSensor({q:t.q,linMag:t.linMag??0,rotRate:t.rotRate??0,acc:t.acc||[0,0,0],ts:e})}_startMeters(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=setInterval(()=>{var e,n;const t=performance.now();for(;this.rxTimes.length&&t-this.rxTimes[0]>1e3;)this.rxTimes.shift();this.rxHz=this.rxTimes.length,(((e=this.dcFast)==null?void 0:e.readyState)==="open"||((n=this.dcCtrl)==null?void 0:n.readyState)==="open")&&this._sendCtrl({k:"ping",t:Math.round(t)}),this._emitStatus()},1e3),this.watchdogTimer=setInterval(()=>{this.mode!=="firebase"||!this.peerJoined||!this.isFastHealthy()&&!this._isOfferNegotiating()&&(this.p2pOpen=!1,this._startRtcOffer(!1))},4200)}_closePcOnly(){var t,e,n;try{(t=this.dcFast)==null||t.close()}catch{}try{(e=this.dcCtrl)==null||e.close()}catch{}try{(n=this.pc)==null||n.close()}catch{}this.dcFast=null,this.dcCtrl=null,this.pc=null,this.pendingCandidates=[],this.offerStartedAt=0,this.dcOpenedAt=0,this.lastPongAt=0,this.lastFastRxAt=0,this.lastSeq=-1,this.p2pOpen=!1}stop(){clearInterval(this.pingTimer),clearInterval(this.watchdogTimer),this.pingTimer=null,this.watchdogTimer=null;for(const t of this.unsubs)try{t()}catch{}if(this.unsubs=[],this._closePcOnly(),this.bc){try{this.bc.close()}catch{}this.bc=null}this.releaseWakeLock(),this.mode="off",this.connected=!1,this.peerJoined=!1,this.routeKind="idle",this.rxHz=0,this.rttMs=null,this._emitStatus()}status(){return{mode:this.mode,roomCode:this.roomCode,connected:this.connected,p2pOpen:this.isFastHealthy(),routeKind:this.routeKind,rttMs:this.rttMs,rxHz:this.rxHz,error:this.error,fresh:!!this.lastAnyRxAt&&performance.now()-this.lastAnyRxAt<1200}}_emitStatus(){this.onStatus(this.status())}}const Q_=(i,t,e)=>Math.max(t,Math.min(e,i)),Z=i=>document.querySelector(i),Dn=i=>[...document.querySelectorAll(i)],tM=i=>`<svg aria-hidden="true"><use href="#i-${i}"/></svg>`;let mi;try{mi=window.localStorage}catch{mi={getItem(){return null},setItem(){throw Error("storage unavailable")}}}let Rt=l_(mi),lt,Ac="all",ke=null,Rc,ld,cd=null,$i=0,Cc=0,ys=document.hidden,Pc=null;const Pf="white-night-vr-v1",Ic=10;function eM(){try{const i=mi.getItem(Pf),t=i?JSON.parse(i):{};return{mode:t.mode==="fusion"?"fusion":t.mode==="hand"?"hand":"gyro",handSide:t.handSide==="left"?"left":"right",quality:t.quality==="low"?"low":"high",leftHue:Number.isFinite(t.leftHue)?(t.leftHue%360+360)%360:16,rightHue:Number.isFinite(t.rightHue)?(t.rightHue%360+360)%360:338}}catch{return{mode:"gyro",handSide:"right",quality:"high",leftHue:16,rightHue:338}}}let Al=!1,Qt=eM(),Re=null,ce=null,Ee=null,Ze=null,mo="",hd=!1,Le=!1,ta=!1,Lc=!1,Ji=!1,go=0,si=0,ri=!1,hi=!1,xo=!1,Un=null,Dc=!1,Rl=!1,Pi="",Rr=0;const Xn=new O_;function Br(){try{mi.setItem(Pf,JSON.stringify(Qt))}catch{}}const ud=new URLSearchParams(location.search).has("test"),_s=Dn("dialog");function pr(i,t="neutral"){Z("#toast").dataset.tone=t,Z("#toast").textContent=i,Z("#toast").classList.add("visible"),clearTimeout(Rc),Rc=setTimeout(()=>Z("#toast").classList.remove("visible"),2600)}function Do(){c_(mi,Rt)||(Z("#save-status").textContent="Сохранение недоступно в этом браузере",pr("Не удалось сохранить. Прогресс останется до закрытия страницы."))}function vo(){Dn("[data-pose]").forEach(i=>{var t;i.disabled=Rt.phase!=="inspect"||!((t=lt==null?void 0:lt.revealState)!=null&&t.ready),i.setAttribute("aria-pressed",String(i.dataset.pose===(lt==null?void 0:lt.pose)))})}function kr(){var i;if(vo(),!!lt){if(Rt.phase==="inspect"&&!((i=lt.revealState)!=null&&i.ready)){for(const t of["zoom-in","zoom-out","zoom-reset"])Z("#"+t).disabled=!0;return}Z("#zoom-in").disabled=lt.zoom>=ho.max,Z("#zoom-out").disabled=lt.zoom<=ho.min,Z("#zoom-reset").disabled=lt.zoom===1,Z("#zoom-reset").textContent=`${Math.round(lt.zoom*100)}%`}}function If(){Z("#completion-preview").replaceChildren(...Rt.lastKept.map(i=>{const t=document.createElement("img");return t.src=lt.thumbnail(i),t.alt=gn.find(e=>e.id===i).name,t}))}function Di(){var e;const i=Rt.phase==="inspect"&&((e=lt.revealState)==null?void 0:e.phase)||"ready";if(i===cd)return;cd=i,Z("#app").dataset.revealPhase=i,Z("#app").classList.toggle("is-revealing",i!=="ready"),Z(".inspection").setAttribute("aria-busy",String(i!=="ready")),Z("#keep").disabled=Z("#discard").disabled=i!=="ready",kr();const t={anticipation:"Что-то осталось на дне…",silhouette:"Знакомый силуэт…",detail:"У каждой вещи — своя история."};Z("#reveal-note").textContent=t[i]||"",Z("#reveal-note").hidden=i==="ready"}function nM(){const i=Z("#header-count");i.classList.remove("collected"),i.offsetWidth,i.classList.add("collected"),clearTimeout(ld),ld=setTimeout(()=>i.classList.remove("collected"),700)}function Fi(){Z("#app").classList.toggle("has-progress",Rt.searches>0),Di(),kr(),aM(),Z("#app").classList.toggle("is-inspecting",Rt.phase==="inspect"),Z(".inspection").hidden=Rt.phase!=="inspect",Rt.phase==="inspect"&&(clearTimeout(Rc),Z("#toast").classList.remove("visible")),Z("#header-count").innerHTML=`${String(Rt.collection.length).padStart(2,"0")} <small>/ 18</small>`,Z("#open-vr").disabled=Rt.phase==="inspect",Z("#search-total").textContent=String(Rt.searches).padStart(2,"0"),Z("#open-collection").disabled=Rt.phase==="inspect",Dn(".tap-dots i").forEach((t,e)=>t.classList.toggle("active",e<Rt.taps)),Z(".tap-dots").setAttribute("aria-label",`Нажатий: ${Rt.taps} из 3`);const i=["Интересно, что там сегодня?","Что-то есть… Продолжайте.","Ещё одно касание — и узнаем."];if(Z("#search-caption").textContent=i[Rt.taps],Z("#search-button span").textContent=Rt.taps?"Продолжить поиск":"Порыться в баке",Rt.phase==="inspect"){const t=gn.find(n=>n.id===Rt.current),e=Ef[t.rarity];Z("#find-name").textContent=t.name,Z("#find-description").textContent=t.description,Z("#find-era").textContent=t.era,Z("#find-rarity").innerHTML=`<i></i>${e.label}`,Z("#find-rarity").style.color=e.color,Z("#find-number").textContent=Rt.reviewing?"ИЗ ВАШЕЙ КОЛЛЕКЦИИ":`НАХОДКА № ${String(Rt.searches).padStart(3,"0")}`,Z("#duplicate-badge").hidden=Rt.reviewing||!Rt.collection.includes(t.id),Z(".decision-buttons").hidden=Rt.reviewing,Z("#close-review").hidden=!Rt.reviewing}}function _o(){if(Rt.phase!=="search"||_s.some(t=>t.open)||ys)return;lt.poke(Rt.taps+1);let i=Pc||(Rt.searches===0?"camera":o_().id);Rt=Lo(Rt,{type:"tap",itemId:i}),Rt.phase==="inspect"&&(Pc=null,lt.show(Rt.current),Do(),Le&&(hi=Qt.mode!=="hand",si=0,ri=!1,Xn.reset(),Ee==null||Ee.onPhaseChange("inspect",performance.now()))),Fi()}function Ms(i,{fromVr:t=!1}={}){var r;if(Rt.phase!=="inspect"||Rt.reviewing||!((r=lt.revealState)!=null&&r.ready))return;const e=gn.find(a=>a.id===Rt.current),n=Rt.collection.includes(e.id),s=Rt.collection.length;Rt=Lo(Rt,{type:i?"keep":"discard"}),lt.hide(),Do(),Fi(),pr(i?n?"Уже сохранено. Продолжим искать?":`${e.name} — теперь в коллекции`:"Оставлено во дворе. Ищем дальше.",i?n?"duplicate":"kept":"discarded"),i&&!n&&nM(),s<18&&Rt.collection.length===18&&(t?xo=!0:(If(),Z("#complete-dialog").showModal()))}function Lf(){Z("#collection-count").textContent=Rt.collection.length,Z("#collection-progress").style.width=`${Rt.collection.length/18*100}%`;const i=gn.filter(t=>Ac==="all"||(Ac==="junk"?t.rarity==="junk":t.rarity!=="junk"));Z("#collection-grid").replaceChildren(...i.map(t=>{const e=Rt.collection.includes(t.id),n=document.createElement("button");n.className=`item-card ${e?"owned":"locked"}`,n.disabled=!e,n.dataset.id=t.id;const s=String(gn.indexOf(t)+1).padStart(2,"0");return n.setAttribute("aria-label",e?`Рассмотреть: ${t.name}`:`Находка ${s} ещё не найдена`),n.innerHTML=`<span class="item-index">${s}</span>${e?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${lt.thumbnail(t.id)}">`:`<div class="locked-art">${tM("lock")}</div>`}<span class="item-title">${e?t.name:"Ещё не найдено"}</span><span class="item-type">${e?t.rarity==="junk"?"Просто хлам":Ef[t.rarity].label:t.rarity==="junk"?"Просто хлам":"Вещь с историей"}</span>`,e&&n.addEventListener("click",()=>{Z("#collection-dialog").close(),Rt=Lo(Rt,{type:"review",id:t.id}),lt.show(t.id,{review:!0}),Fi()}),n}))}function Uc(){Rt.phase!=="inspect"&&(Lf(),Z("#collection-dialog").showModal())}function dd(){Rt.reviewing&&(Rt=Lo(Rt,{type:"close"}),lt.hide(),Fi(),Uc())}function Df(){Rt=Qr(),lt.hide(),Do(),Fi(),Z("#reset-confirm").hidden=!0,Z("#reset-button").hidden=!1,Z("#settings-dialog").close(),pr("Новая белая ночь. Начнём сначала.")}function iM(){const i=Z(".bin-tag");if(!i)return;const t=lt.binEdge(),e=t.onScreen&&t.x>232&&t.x<innerWidth-12&&t.y>104&&t.y<innerHeight-150;i.hidden=!e,e&&(i.style.left=`${Math.round(t.x)}px`,i.style.top=`${Math.round(t.y)}px`)}const Uf="white-night-look-hint-v1";let fd=!1;function sM(){try{return mi.getItem(Uf)==="done"}catch{return!0}}function rM(){const i=Z("#look-hint");if(!(!i||fd&&i.hidden)){i.classList.add("used"),fd=!0;try{mi.setItem(Uf,"done")}catch{}setTimeout(()=>{i.hidden=!0},520)}}function aM(){const i=Z("#look-hint");if(i){if(sM()||Rt.phase==="inspect"){i.hidden=!0;return}i.hidden=Le}}function wn(){return Re||(Re=new N_(Z("#vr-camera")),Re.setHues(Qt.leftHue,Qt.rightHue),Re.setMode(Qt.mode==="fusion"?"fusion":"gyro")),Re}function Nf(){return ce||(ce=new k_(Z("#vr-hand-camera"))),ce}function ea(i){var s;const t=ui();ce==null||ce.process(!0);const e=(ce==null?void 0:ce.sample())||null,n=i==="pose1"?t.calibrateStretchPose(t.lastSensor,e):t.calibrateBendPose(t.lastSensor,e);return mo=n.message||"",(s=Z("#vr-dialog"))!=null&&s.open&&Ye(),n}function hh(i,{fromRemote:t=!1}={}){var n,s,r;const e=i==="left"?"left":"right";Qt.handSide=e,Br(),Ee&&Ee.setHandSide(e),(s=(n=lt==null?void 0:lt.vrHand)==null?void 0:n.setHandSide)==null||s.call(n,e),t||Ze==null||Ze.sendHandSide(e),(r=Z("#vr-dialog"))!=null&&r.open&&Ye()}function ui(){return Ee||(Ee=new V_({handSide:Qt.handSide})),Ze||(Ze=new j_({onSensor:i=>Ee.feedSensor(i),onCalCommand:i=>ea(i),onHandSide:i=>hh(i,{fromRemote:!0}),onStatus:()=>{var i;(i=Z("#vr-dialog"))!=null&&i.open&&Ye()}}),Ze.hostHandSide=Qt.handSide),Ee}function oM(i){return i.gyro.fresh?Qt.mode==="fusion"?!!i.marker.calibrated:Qt.mode==="hand"?(ui(),(Ze.status().connected||!!Ee.lastSensor)&&Ee.calibratedStep>=2):!0:!1}function pd(i){return i.usable?"готова":i.entity?"видна, ещё мгновение":i.found?"видна, удерживайте":"не видна"}const lM="<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>",cM="<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>",hM="В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.",uM="В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.";function Ye(){var c;const i=wn(),t=i.info(),e=t.gyro,n=t.marker,s=oM(t);Dn("[data-vr-mode]").forEach(h=>{const u=h.dataset.vrMode===Qt.mode;h.classList.toggle("active",u),h.setAttribute("aria-pressed",String(u))}),Z("#vr-fusion-panel").hidden=Qt.mode!=="fusion",Z("#vr-hand-panel").hidden=Qt.mode!=="hand";const r=Z("#vr-how-cards"),a=Z("#vr-note-text");if(r){const h=Qt.mode==="hand"?cM:lM;r.innerHTML!==h&&(r.innerHTML=h)}a&&(a.textContent=Qt.mode==="hand"?uM:hM),Z("#vr-quality").value=Qt.quality,Z("#vr-swatch-left").style.background=`hsl(${Qt.leftHue} 95% 55%)`,Z("#vr-swatch-right").style.background=`hsl(${Qt.rightHue} 95% 55%)`;const o=Z("#vr-gyro-btn");if(o.disabled=!!e.fresh||!e.supported,o.textContent=e.fresh?"Гироскоп готов":"Разрешить",o.classList.toggle("ready",!!e.fresh),Z("#vr-gyro-status").textContent=e.supported?e.permission==="denied"?"Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.":e.fresh?"Показания приходят — телефон можно поворачивать.":e.permission==="granted"?"Разрешение есть, ждём показания: чуть поверните телефон.":e.error||"Нажмите кнопку и подтвердите доступ к ориентации телефона.":"Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.",Qt.mode==="fusion"){const[h,u]=n.markers||[];Z("#vr-start-camera").disabled=!!n.running,Z("#vr-start-camera").textContent=n.running?"Камера включена":"Включить камеру",Z("#vr-calibrate").disabled=!(h!=null&&h.usable&&(u!=null&&u.usable)),Z("#vr-pick-left").classList.toggle("active",Un==="left"),Z("#vr-pick-right").classList.toggle("active",Un==="right"),Z("#vr-camera").classList.toggle("picking",!!Un);const f=Z("#vr-marker-status");f.textContent=Pi||n.error||(Un?`Коснитесь ${Un==="left"?"левой":"правой"} метки прямо на предпросмотре.`:n.calibrated?`Метки зафиксированы, разнос ${((c=n.calibration)==null?void 0:c.sepDeg)||0}°. Сейчас: ${n.status==="valid"?"видна пара":n.status==="single"?"видна одна метка":n.status==="held"?"временно не видны, центр удержан":"не видны"}.`:n.running?`Левая метка: ${h?pd(h):"—"}. Правая метка: ${u?pd(u):"—"}. Когда обе готовы, нажмите «Это центр».`:"Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре."),f.className=`vr-status-line ${Pi||n.error?"warn":n.calibrated?"good":""}`}else if(Qt.mode==="hand"){if(ui(),Dn("[data-hand-side]").forEach(p=>{const v=p.dataset.handSide===Qt.handSide;p.classList.toggle("active",v),p.setAttribute("aria-pressed",String(v))}),!hd){hd=!0;const p=Z_(),v=Z("#vr-hand-fb");v&&p?v.value=p:Z("#vr-hand-fb-details")&&(Z("#vr-hand-fb-details").open=!0)}const h=Ze.status(),u=h.connected||!!Ee.lastSensor;Z("#vr-hand-code").textContent=h.roomCode||"——";const f=Z("#vr-wrist-link");if(f){const p=new URLSearchParams;h.roomCode&&p.set("room",h.roomCode),Qt.handSide==="left"&&p.set("hand","left"),h.mode==="demo"&&p.set("demo","1");const v=p.toString();f.href=v?`./wrist/index.html?${v}`:"./wrist/index.html"}const d=Z("#vr-hand-net-status");d.textContent=h.error?h.error:h.p2pOpen?h.routeKind==="demo"?`Демо-канал активен (${h.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${h.rttMs?` · ${h.rttMs} мс`:""}.`:h.connected?"☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).":h.roomCode?`Код комнаты ${h.roomCode} создан — введите его на странице браслета.`:"Создайте 6-значный код и введите его на втором телефоне.",d.className=`vr-status-line ${h.error?"warn":u?"good":""}`;const m=ce==null?void 0:ce.info();Z("#vr-hand-cam-btn").textContent=m!=null&&m.running?"Камера маяка вкл.":"Камера маяка (опц.)",Z("#vr-hand-camera").hidden=!(m!=null&&m.running),Z("#vr-hand-cal1").disabled=!u,Z("#vr-hand-cal2").disabled=!u||Ee.calibratedStep<1;const x=Z("#vr-hand-cal-status"),g=m!=null&&m.running?` Маяк в камере: ${m.status==="pair"?"видна пара пятен":m.status==="single"?"видно одно пятно":"пока не в кадре"}.`:"";x.textContent=(mo||(Ee.calibratedStep>=2?"Калибровка двух жестов готова.":Ee.calibratedStep===1?"Шаг 1 записан — согните руку в локте и нажмите Жест 2.":u?"Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).":"Сначала подключите браслет."))+g,x.className=`vr-status-line ${Ee.calibratedStep>=2?"good":""}`}Z("#vr-start").disabled=!s||Ji;const l=Z("#vr-status");return l.textContent=Ji?"Надевайте очки и смотрите прямо перед собой…":e.fresh?Qt.mode==="fusion"&&!n.calibrated?"Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.":Qt.mode==="hand"&&!s?"Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.":Qt.mode==="hand"?"Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.":Qt.mode==="fusion"?"Готово: гироскоп ведёт взгляд, две метки удерживают центр.":"Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.":"Сначала нужен работающий гироскоп очков.",l.className=`vr-status-line ${s?"good":"warn"}`,{ready:s,info:t}}function Ff(){if(Rt.phase==="inspect"){pr("Сначала завершите осмотр находки.");return}const i=Z("#vr-dialog");if(i.open)return;const t=wn();t.gyro.permission==="granted"&&!t.gyro.listening&&t.gyro.start(),Ye(),i.showModal()}async function dM(){var i;try{if(!document.fullscreenElement)try{await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{await document.documentElement.requestFullscreen()}}catch{}try{await((i=screen.orientation)==null?void 0:i.lock("landscape"))}catch{}}function fM(i=!1){i&&(Dc=Z("#low-quality").checked,Rl=Qt.quality==="low",lt.low!==Rl&&lt.setQuality(Rl))}function Of(i=!1){if(!Le)return;const t=innerWidth>=innerHeight;document.body.classList.toggle("vr-single",!t),(i||t!==ta)&&(ta=t,lt.setVrStereo(t))}async function zf(){if(Le||Rt.phase==="inspect")return!1;const i=wn(),t=Qt.mode==="hand",e=Z("#vr-dialog");if(i.setMode(Qt.mode==="fusion"?"fusion":"gyro"),e.open&&(Lc=!0,e.close(),Lc=!1),fM(!0),i.start(),t){ui();const n=performance.now();Ee.recenterOnSessionStart(n),Ee.onPhaseChange("search",n)}return Le=!0,si=Rt.taps*(Ic/3),ri=!1,hi=!1,Xn.reset(),document.body.classList.add("vr-active"),lt.setVrBodyActive(!0),lt.setVrHandMode(t),ta=!1,Of(!0),lt.setHeadLook(0,0),lt.updateVrHand(0,{visible:!0,handSide:Qt.handSide,headLook:lt.headLook,phase:Rt.phase}),lt.resize(),!0}async function pM(){if(Ji||!Ye().ready)return;await dM();const i=++go,t=Z("#vr-dialog"),e=Z("#vr-countdown");Ji=!0,e.hidden=!1,Ye();for(const n of[3,2,1])if(e.textContent=String(n),await new Promise(s=>setTimeout(s,650)),i!==go||!t.open){Ji=!1,e.hidden=!0;return}Ji=!1,e.hidden=!0,await zf()}function Uo(i="gesture"){var t;return!hi||Rt.phase!=="inspect"||Rt.reviewing?!1:((t=lt.revealState)!=null&&t.ready||(lt.finishReveal(),Di()),hi=!1,Xn.reset(),Ms(!0,{fromVr:!0}),si=0,ri=!1,!0)}function Ur(i="exit"){var t;if(!Le)return!1;hi&&Uo("exit"),Le=!1,go++,Ji=!1,Z("#vr-countdown").hidden=!0,Re==null||Re.stop(),ce==null||ce.stop(),lt.setVrBodyActive(!1),lt.setVrHandMode(!1),lt.setVrStereo(!1),lt.setHeadLook(0,0),ta=!1,si=0,ri=!1,Xn.reset(),document.body.classList.remove("vr-active","vr-single"),lt.low!==Dc&&lt.setQuality(Dc);try{(t=screen.orientation)==null||t.unlock()}catch{}return document.fullscreenElement&&document.exitFullscreen().catch(()=>{}),lt.resize(),Fi(),xo?(xo=!1,If(),Z("#complete-dialog").showModal()):i!=="hidden"&&Rt.phase!=="inspect"&&pr("VR-обзор завершён. Находки из очков уже в коллекции."),!0}function Nc(i){const t=Re.update(i);return lt.setHeadLook(t.yaw,t.pitch),t}function Mo(i,t=performance.now()){var r,a,o,l,c;if(!Le||!Re)return;const e=Nc(i),n=Ic/3;if(Qt.mode==="hand"){ui(),ce==null||ce.process(!1,t);const h=(ce==null?void 0:ce.sample(t))||null,u=lt.handHitsBin(),f=Ee.update(i,{beacon:h,headLook:lt.headLook,phase:Rt.phase,revealReady:!!((r=lt.revealState)!=null&&r.ready),handOverBin:u,now:t});if(lt.updateVrHand(i,{visible:!0,handTracked:f.trackingSource!=="idle",handSide:f.handSide,headLook:lt.headLook,torsoYaw:f.torsoYaw,shoulderPos:f.shoulderPos,elbowPos:f.elbowPos,pos:f.pos,vel:f.vel,qArm:f.qArm,reach:f.reach,elbowBendDeg:f.elbowBendDeg,overBin:u,phase:Rt.phase,calmLowerProgress:f.calmLowerProgress,beaconActive:f.trackingSource==="gyro+beacon"}),Rt.phase==="search"){Xn.reset(),ri=u&&f.reach>=.62;for(let d=0;d<f.pokes&&Rt.phase==="search";d++)_o()}else if(Rt.phase==="inspect"){ri=!1,lt.setHandItemRotation(f.itemRot.x,f.itemRot.y,f.itemRot.z,f.itemQuat);const d=lt.handInspectHeadBase?Math.atan2(Math.sin(e.yaw-lt.handInspectHeadBase.yaw),Math.cos(e.yaw-lt.handInspectHeadBase.yaw)):e.yaw,m=(((a=Ee.lastSensor)==null?void 0:a.rotRate)||0)<90&&(((o=Ee.lastSensor)==null?void 0:o.linMag)||0)<2.2;f.decision==="discard"?(hi=!1,Xn.reset(),lt.launchDiscardToss(f.throwVel),Ms(!1,{fromVr:!0}),Ee.onPhaseChange("search",t)):(f.decision==="keep"||(l=lt.revealState)!=null&&l.ready&&m&&Xn.update(d,t))&&(hi=!1,Xn.reset(),Ms(!0,{fromVr:!0}),Ee.onPhaseChange("search",t))}return}const s=lt.vrInspectLock&&lt.headInspectBase?lt.headInspectBase:lt.headLook;if(lt.updateVrHand(i,{visible:!0,handSide:Qt.handSide,headLook:s,phase:Rt.phase}),Rt.phase==="search")if(Xn.reset(),ri=lt.gazeHitsBin(),ri){si=Math.min(Ic,si+i);const h=Math.min(3,Math.floor(si/n+1e-9));for(;Rt.phase==="search"&&Rt.taps<h;){const u=Rt.taps;if(_o(),Rt.phase==="search"&&Rt.taps===u)break}}else si=Math.max(Rt.taps*n,si-i*1.5);else Rt.phase==="inspect"&&hi&&(ri=!1,(c=lt.revealState)!=null&&c.ready&&Xn.update(e.yaw,t)&&Uo("gesture"))}function ps(){return{active:Le,stereo:ta,settings:{...Qt},focus:+si.toFixed(3),gazeHit:ri,pendingSave:hi,pendingCompletion:xo,shake:Xn.info(),look:(Re==null?void 0:Re.info())||null,wrist:Ee?{link:(Ze==null?void 0:Ze.status())||null,beacon:(ce==null?void 0:ce.info())||null,hand:Ee.snapshot()}:null,world:(lt==null?void 0:lt.vrInfo())||null}}function md(i,t,e=10,n=.03){const s=wn(),r=s.gyro,a={...r.raw},o={yaw:i*Math.PI/180,pitch:t*Math.PI/180},l=Math.max(1,e|0);r.lastAt=performance.now(),Le?Mo(0,r.lastAt):Nc(0);for(let c=1;c<=l;c++)r.raw={yaw:a.yaw+(o.yaw-a.yaw)*c/l,pitch:a.pitch+(o.pitch-a.pitch)*c/l},r.lastAt=performance.now(),Le?Mo(n,r.lastAt):Nc(n);return lt.update(0),r.lastAt=performance.now(),ps()}function Bf(i){if(Cc=requestAnimationFrame(Bf),_s.some(n=>n.open)){Z("#vr-dialog").open&&!ys&&(Re==null||Re.processPrep(),Qt.mode==="hand"&&(ce==null||ce.process()),Ye()),$i=i;return}if(ys||lt.testRevealHold){$i=i;return}const t=$i?(i-$i)/1e3:.016;$i=i;const e=Math.min(t,.1);Le&&Mo(e,i),lt.update(e,t),Di(),Le||iM()}function mM(){Dn("[data-pose]").forEach(t=>t.addEventListener("click",()=>{lt.setPose(t.dataset.pose),vo()})),Z("#zoom-in").addEventListener("click",()=>{lt.setZoom(.2),kr()}),Z("#zoom-out").addEventListener("click",()=>{lt.setZoom(-.2),kr()}),Z("#zoom-reset").addEventListener("click",()=>{lt.setZoom(1-lt.zoom),kr()}),Z("#search-button").addEventListener("click",_o),Z("#discard").addEventListener("click",()=>Ms(!1)),Z("#keep").addEventListener("click",()=>Ms(!0)),Z("#close-review").addEventListener("click",dd),Z("#open-collection").addEventListener("click",Uc),Z("#open-settings").addEventListener("click",()=>{Z("#reset-confirm").hidden=!0,Z("#reset-button").hidden=!1,Z("#settings-dialog").showModal()}),Z("#open-vr").addEventListener("click",Ff),Dn("[data-vr-mode]").forEach(t=>t.addEventListener("click",()=>{const e=t.dataset.vrMode;Qt.mode=e==="fusion"?"fusion":e==="hand"?"hand":"gyro",Br(),Un=null,Pi="",Qt.mode!=="hand"&&(ce==null||ce.stop()),wn().setMode(Qt.mode==="fusion"?"fusion":"gyro"),Ye()})),Z("#vr-gyro-btn").addEventListener("click",async()=>{Pi="",await wn().requestGyro(),Ye()}),Z("#vr-start-camera").addEventListener("click",async()=>{Pi="";const t=wn();t.tracker.error=null,await t.startCamera(),Ye()}),Dn(".vr-pick").forEach(t=>t.addEventListener("click",()=>{const e=t.id==="vr-pick-left"?"left":"right";Pi="",Un=Un===e?null:e,Ye()})),Z("#vr-camera").addEventListener("click",t=>{if(!Un)return;const e=wn(),n=e.tracker.sampleColor(t.clientX,t.clientY,t.currentTarget.getBoundingClientRect());!n||n.chroma<35||(Un==="left"?Qt.leftHue=Math.round(n.hue):Qt.rightHue=Math.round(n.hue),e.setHues(Qt.leftHue,Qt.rightHue),e.tracker.calibrated&&e.tracker.clearCalibration(),Br(),Pi="Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.",Un=null,e.tracker.process(!0),Ye())}),Z("#vr-calibrate").addEventListener("click",()=>{const t=wn();t.tracker.process(!0);const e=t.tracker.calibrate();Pi=e.ok?"":e.message,Ye()}),Dn("[data-hand-side]").forEach(t=>t.addEventListener("click",()=>hh(t.dataset.handSide))),Z("#vr-hand-room-btn").addEventListener("click",async()=>{var t;ui(),mo="",await Ze.startFirebase(((t=Z("#vr-hand-fb"))==null?void 0:t.value)||"",Qt.handSide),Ye()}),Z("#vr-hand-demo-btn").addEventListener("click",()=>{ui(),mo="",Ze.startDemo("111111",Qt.handSide),Ye()}),Z("#vr-hand-cam-btn").addEventListener("click",async()=>{const t=Nf();t.running?t.stop():await t.start(Z("#vr-hand-camera")),Ye()}),Z("#vr-hand-cal1").addEventListener("click",()=>ea("pose1")),Z("#vr-hand-cal2").addEventListener("click",()=>ea("pose2")),Z("#vr-start").addEventListener("click",pM),Z("#vr-quality").value=Qt.quality,Z("#vr-quality").addEventListener("change",t=>{Qt.quality=t.target.value,Br()}),Dn("[data-close]").forEach(t=>t.addEventListener("click",()=>document.getElementById(t.dataset.close).close())),_s.forEach(t=>{t.addEventListener("click",e=>{if(e.target===t){const n=t.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&t.close()}}),t.addEventListener("close",()=>{ke=null,$i=0,t.id==="vr-dialog"&&!Lc&&!Le&&(go++,Ji=!1,Z("#vr-countdown").hidden=!0,Un=null,Pi="",Re==null||Re.stop(),ce==null||ce.stop())})}),Dn("[data-filter]").forEach(t=>t.addEventListener("click",()=>{Ac=t.dataset.filter,Dn("[data-filter]").forEach(e=>e.classList.toggle("active",e===t)),Lf()})),Z("#low-quality").addEventListener("change",t=>{lt.setQuality(t.target.checked),lt.update(.016);try{mi.setItem("white-night-quality",t.target.checked?"low":"high")}catch{}}),Z("#reset-button").addEventListener("click",()=>{Z("#reset-confirm").hidden=!1,Z("#reset-button").hidden=!0}),Z("#reset-cancel").addEventListener("click",()=>{Z("#reset-confirm").hidden=!0,Z("#reset-button").hidden=!1}),Z("#reset-yes").addEventListener("click",Df),Z("#continue-button").addEventListener("click",()=>Z("#complete-dialog").close()),Z("#view-complete").addEventListener("click",()=>{Z("#complete-dialog").close(),Uc()});const i=Z("#world");i.addEventListener("pointerdown",t=>{if(Le){clearTimeout(Rr),Rr=setTimeout(()=>Ur("long-press"),900);return}_s.some(e=>e.open)||ke||!t.isPrimary||(Rt.phase==="inspect"&&(lt.finishReveal(),Di()),ke={id:t.pointerId,x:t.clientX,y:t.clientY,startX:t.clientX,startY:t.clientY,moved:!1},i.setPointerCapture(t.pointerId))}),i.addEventListener("pointermove",t=>{if(!ke||ke.id!==t.pointerId)return;const e=t.clientX-ke.x,n=t.clientY-ke.y;Math.hypot(t.clientX-ke.startX,t.clientY-ke.startY)>10&&(ke.moved=!0,Rt.phase!=="inspect"&&!Le&&rM()),Rt.phase==="inspect"?(lt.rotate(e,n),vo()):Le||lt.lookBy(e,n),ke.x=t.clientX,ke.y=t.clientY}),i.addEventListener("pointerup",t=>{if(clearTimeout(Rr),!ke||ke.id!==t.pointerId)return;const e=!ke.moved;ke=null,i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),e&&Rt.phase==="search"&&lt.hitBin(t.clientX,t.clientY)&&_o()}),i.addEventListener("pointercancel",()=>{clearTimeout(Rr),ke=null}),i.addEventListener("lostpointercapture",()=>{clearTimeout(Rr),ke=null}),document.addEventListener("visibilitychange",()=>{ys=document.hidden||Al,ke=null,$i=0,document.hidden&&Le&&Ur("hidden")}),window.addEventListener("blur",()=>ke=null),window.addEventListener("resize",()=>{lt.resize(),Le&&Of(),_s.some(t=>t.open)&&lt.update(.016)}),document.addEventListener("fullscreenchange",()=>{Le&&!document.fullscreenElement&&Ur("fullscreen")}),window.addEventListener("pagehide",()=>{var t;hi?Uo("pagehide"):Le&&Rt.phase==="inspect"&&!Rt.reviewing&&((t=lt.revealState)!=null&&t.ready||(lt.finishReveal(),Di()),Ms(!0,{fromVr:!0})),Le&&(Re==null||Re.stop()),ce==null||ce.stop(),Ze==null||Ze.stop()}),document.addEventListener("keydown",t=>{if(t.key==="Escape"&&Le){t.preventDefault(),Ur("escape");return}t.key==="Escape"&&!_s.some(e=>e.open)&&Rt.phase==="inspect"&&(t.preventDefault(),Rt.reviewing?dd():(lt.finishReveal(),Di(),Ms(!1)))}),i.addEventListener("webglcontextlost",t=>{t.preventDefault(),Al=!0,ys=!0,Z("#webgl-error h2").textContent="Двор уступил видеопамять",Z("#webgl-error p").textContent="Браузер или система забрали графический контекст: свёрнутые вкладки, другой тяжёлый процесс, обновление драйвера. Обычно двор возвращается сам, как только получит контекст обратно.",Z("#webgl-error").hidden=!1}),i.addEventListener("webglcontextrestored",async()=>{try{await lt.restoreGLContext()}catch(t){console.error(t)}Al=!1,ys=document.hidden,$i=0,Z("#webgl-error").hidden=!0,Di(),Fi(),Ye(),pr("Графика перезапустилась — двор снова здесь.","kept")})}async function gM(){try{lt=new a_(Z("#world"));try{mi.getItem("white-night-quality")==="low"&&(lt.setQuality(!0),Z("#low-quality").checked=!0)}catch{}mM(),Fi(),await Promise.all([document.fonts.ready,Kv()]),lt.update(.016),Z("#loading").hidden=!0,window.__READY__=!0,Cc=requestAnimationFrame(Bf),ud&&(window.__WORLD__=lt),ud&&(window.__GAME_TEST__={getState:()=>structuredClone(Rt),getMetrics:()=>lt.metrics(),settle:()=>{lt.finishReveal(),lt.kick=0,lt.dirty=!0,lt.update(.016),Di()},seekReveal:i=>{lt.testRevealHold=!0,lt.reveal=Math.max(0,Math.min(1,i)),lt.applyReveal(),lt.dirty=!0,lt.update(0),Di()},setPose:i=>{lt.setPose(i),lt.update(.1),vo()},getRotation:()=>({x:lt.targetX,y:lt.targetY}),binScreen:()=>lt.binScreen(),forceNext:i=>{if(!gn.some(t=>t.id===i))throw Error("unknown item");Pc=i},setView:i=>{const t=lt.setView(i);return lt.update(.016),t},look:(i,t)=>(lt.lookBy(0,0),lt.headLook.yaw=Q_(i,-41,41)*Math.PI/180,lt.headLook.pitch=Math.max(-9,Math.min(60,t))*Math.PI/180,lt.applyCameraPose(),lt.dirty=!0,lt.update(.016),lt.lookInfo()),sky:()=>({stars:lt.sky.stars.geometry.attributes.position.count,moon:lt.sky.moon.position.toArray().map(i=>+i.toFixed(2)),direction:lt.sky.moonDirection.toArray().map(i=>+i.toFixed(3))}),reset:()=>{_s.forEach(i=>i.close()),Df()},setCollection:i=>{Rt=Qr({collection:i,searches:i.length}),lt.hide(),Do(),Fi()},isPaused:()=>ys,items:gn.map(i=>i.id),scene:()=>({staticVisible:lt.static.visible,drawCalls:lt.renderer.info.render.calls,headLook:lt.lookInfo(),sky:{stars:lt.sky.stars.geometry.attributes.position.count,moonVisible:lt.sky.moon.visible}}),vr:{info:()=>ps(),open:()=>Ff(),setMode:i=>(Qt.mode=i==="fusion"?"fusion":i==="hand"?"hand":"gyro",Br(),Qt.mode!=="hand"&&(ce==null||ce.stop()),wn().setMode(Qt.mode==="fusion"?"fusion":"gyro"),Ye(),ps()),setHandSide:i=>(hh(i),ps()),requestGyro:()=>wn().requestGyro(),gyro:(i,t,e=10,n=.03)=>md(i,t,e,n),marker:(i,t)=>wn().tracker.inject(i,t),calibrate:i=>wn().tracker.calibrate(i),wristDemo:i=>(ui(),Ze.startDemo(i||"111111",Qt.handSide)),wristPacket:(i,t=performance.now())=>(ui(),Ze.injectPacket(i,t),ps()),wristBeacon:(i,t=performance.now())=>(ui(),Nf().inject(i,t)),wristCalibrateStretch:()=>ea("pose1"),wristCalibrateBend:()=>ea("pose2"),start:()=>zf(),stop:()=>Ur("test"),step:(i=.1,t)=>{let e=Math.max(0,i),n=t;for(;e>0;){const s=Math.min(.05,e);n!==void 0&&(n+=s*1e3),Re&&(Re.gyro.lastAt=performance.now()),Mo(s,n!==void 0?n:performance.now()),e-=s}return lt.update(0),ps()},shake:(i=25)=>{for(const t of[-i,i,-i])md(t,0,10,.03);return ps()},settings:()=>({...Qt}),finish:()=>Uo("test")}}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{console.warn("Offline mode could not be enabled.")})}catch(i){console.error(i),Z("#loading").hidden=!0,Z("#webgl-error h2").textContent="Двор пока не открылся",Z("#webgl-error p").textContent="Для игры нужен браузер с WebGL 2. Попробуйте включить аппаратное ускорение или открыть игру в свежей версии Chrome.",Z("#webgl-error").hidden=!1,cancelAnimationFrame(Cc)}}gM();
