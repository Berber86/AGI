(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ma="180",Ru=0,tl=1,Cu=2,xc=1,Mc=2,Ln=3,Qn=0,Ve=1,sn=2,$n=0,Gi=1,Fn=2,el=3,nl=4,Pu=5,hi=100,Iu=101,Lu=102,Uu=103,Du=104,Nu=200,Fu=201,Ou=202,Bu=203,Eo=204,bo=205,zu=206,Hu=207,Gu=208,Vu=209,ku=210,Wu=211,Xu=212,qu=213,Yu=214,wo=0,To=1,Ao=2,Wi=3,Ro=4,Co=5,Po=6,Io=7,Sc=0,$u=1,Ku=2,Kn=0,ju=1,Zu=2,Ju=3,yc=4,Qu=5,th=6,eh=7,Ec=300,Xi=301,qi=302,Lo=303,Uo=304,Is=306,br=1e3,Dn=1001,Do=1002,Ke=1003,nh=1004,Gr=1005,an=1006,Os=1007,Nn=1008,bn=1009,bc=1010,wc=1011,wr=1012,Sa=1013,mi=1014,Sn=1015,Fr=1016,ya=1017,Ea=1018,Tr=1020,Tc=35902,Ac=35899,Rc=1021,Cc=1022,pn=1023,Ar=1026,Rr=1027,ba=1028,wa=1029,Pc=1030,Ta=1031,Aa=1033,ps=33776,ms=33777,gs=33778,_s=33779,No=35840,Fo=35841,Oo=35842,Bo=35843,zo=36196,Ho=37492,Go=37496,Vo=37808,ko=37809,Wo=37810,Xo=37811,qo=37812,Yo=37813,$o=37814,Ko=37815,jo=37816,Zo=37817,Jo=37818,Qo=37819,ta=37820,ea=37821,na=36492,ia=36494,ra=36495,sa=36283,oa=36284,aa=36285,la=36286,ih=3200,rh=3201,Ra=0,sh=1,Yn="",Me="srgb",Yi="srgb-linear",ys="linear",re="srgb",Mi=7680,il=519,oh=512,ah=513,lh=514,Ic=515,ch=516,uh=517,hh=518,dh=519,ca=35044,rl="300 es",yn=2e3,Es=2001;class tr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bs=Math.PI/180,ua=180/Math.PI;function jn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Le[i&255]+Le[i>>8&255]+Le[i>>16&255]+Le[i>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]).toLowerCase()}function qt(i,t,e){return Math.max(t,Math.min(e,i))}function fh(i,t){return(i%t+t)%t}function zs(i,t,e){return(1-e)*i+e*t}function xn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function se(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ct{constructor(t=0,e=0){Ct.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class En{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let l=n[r+0],c=n[r+1],h=n[r+2],u=n[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*_,b=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const R=Math.sqrt(w),A=Math.atan2(R,p*b);m=Math.sin(m*A)/R,a=Math.sin(a*A)/R}const S=a*b;if(l=l*m+d*S,c=c*m+f*S,h=h*m+g*S,u=u*m+_*S,m===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],l=n[r+1],c=n[r+2],h=n[r+3],u=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(r/2),u=a(s/2),d=l(n/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(qt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-r*a,this._w=o*h-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*r+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(sl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(sl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*r-a*n),h=2*(a*e-s*r),u=2*(s*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=r+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Hs.copy(this).projectOnVector(t),this.sub(Hs)}reflect(t){return this.sub(Hs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hs=new U,sl=new En;class zt{constructor(t,e,n,r,s,o,a,l,c){zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c)}set(t,e,n,r,s,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=r,h[2]=a,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=r[0],m=r[3],p=r[6],b=r[1],w=r[4],S=r[7],R=r[2],A=r[5],C=r[8];return s[0]=o*_+a*b+l*R,s[3]=o*m+a*w+l*A,s[6]=o*p+a*S+l*C,s[1]=c*_+h*b+u*R,s[4]=c*m+h*w+u*A,s[7]=c*p+h*S+u*C,s[2]=d*_+f*b+g*R,s[5]=d*m+f*w+g*A,s[8]=d*p+f*S+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*s*h+n*a*l+r*s*c-r*o*l}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*s,f=c*s-o*l,g=e*u+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(r*c-h*n)*_,t[2]=(a*n-r*o)*_,t[3]=d*_,t[4]=(h*e-r*l)*_,t[5]=(r*s-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-r*c,r*l,-r*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Gs.makeScale(t,e)),this}rotate(t){return this.premultiply(Gs.makeRotation(-t)),this}translate(t,e){return this.premultiply(Gs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Gs=new zt;function Lc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Cr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ph(){const i=Cr("canvas");return i.style.display="block",i}const ol={};function Pr(i){i in ol||(ol[i]=!0,console.warn(i))}function mh(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const al=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ll=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gh(){const i={enabled:!0,workingColorSpace:Yi,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===re&&(r.r=On(r.r),r.g=On(r.g),r.b=On(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===re&&(r.r=Vi(r.r),r.g=Vi(r.g),r.b=Vi(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Yn?ys:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Pr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Pr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Yi]:{primaries:t,whitePoint:n,transfer:ys,toXYZ:al,fromXYZ:ll,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Me},outputColorSpaceConfig:{drawingBufferColorSpace:Me}},[Me]:{primaries:t,whitePoint:n,transfer:re,toXYZ:al,fromXYZ:ll,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Me}}}),i}const jt=gh();function On(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Si;class _h{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Si===void 0&&(Si=Cr("canvas")),Si.width=t.width,Si.height=t.height;const r=Si.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Si}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Cr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=On(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(On(e[n]/255)*255):e[n]=On(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let vh=0;class Ca{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vh++}),this.uuid=jn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Vs(r[o].image)):s.push(Vs(r[o]))}else s=Vs(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Vs(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?_h.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let xh=0;const ks=new U;class Pe extends tr{constructor(t=Pe.DEFAULT_IMAGE,e=Pe.DEFAULT_MAPPING,n=Dn,r=Dn,s=an,o=Nn,a=pn,l=bn,c=Pe.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xh++}),this.uuid=jn(),this.name="",this.source=new Ca(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ks).x}get height(){return this.source.getSize(ks).y}get depth(){return this.source.getSize(ks).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ec)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case br:t.x=t.x-Math.floor(t.x);break;case Dn:t.x=t.x<0?0:1;break;case Do:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case br:t.y=t.y-Math.floor(t.y);break;case Dn:t.y=t.y<0?0:1;break;case Do:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pe.DEFAULT_IMAGE=null;Pe.DEFAULT_MAPPING=Ec;Pe.DEFAULT_ANISOTROPY=1;class oe{constructor(t=0,e=0,n=0,r=1){oe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,S=(f+1)/2,R=(p+1)/2,A=(h+d)/4,C=(u+_)/4,E=(g+m)/4;return w>S&&w>R?w<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(w),r=A/n,s=C/n):S>R?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=A/r,s=E/r):R<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),n=C/s,r=E/s),this.set(n,r,s,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this.w=qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this.w=qt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Mh extends tr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new oe(0,0,t,e),this.scissorTest=!1,this.viewport=new oe(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Pe(r);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new Ca(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gi extends Mh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Uc extends Pe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sh extends Pe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _i{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,hn):hn.fromBufferAttribute(s,o),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Vr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vr.copy(n.boundingBox)),Vr.applyMatrix4(t.matrixWorld),this.union(Vr)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ar),kr.subVectors(this.max,ar),yi.subVectors(t.a,ar),Ei.subVectors(t.b,ar),bi.subVectors(t.c,ar),Gn.subVectors(Ei,yi),Vn.subVectors(bi,Ei),ii.subVectors(yi,bi);let e=[0,-Gn.z,Gn.y,0,-Vn.z,Vn.y,0,-ii.z,ii.y,Gn.z,0,-Gn.x,Vn.z,0,-Vn.x,ii.z,0,-ii.x,-Gn.y,Gn.x,0,-Vn.y,Vn.x,0,-ii.y,ii.x,0];return!Ws(e,yi,Ei,bi,kr)||(e=[1,0,0,0,1,0,0,0,1],!Ws(e,yi,Ei,bi,kr))?!1:(Wr.crossVectors(Gn,Vn),e=[Wr.x,Wr.y,Wr.z],Ws(e,yi,Ei,bi,kr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(An[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),An[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),An[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),An[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),An[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),An[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),An[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),An[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(An),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const An=[new U,new U,new U,new U,new U,new U,new U,new U],hn=new U,Vr=new _i,yi=new U,Ei=new U,bi=new U,Gn=new U,Vn=new U,ii=new U,ar=new U,kr=new U,Wr=new U,ri=new U;function Ws(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){ri.fromArray(i,s);const a=r.x*Math.abs(ri.x)+r.y*Math.abs(ri.y)+r.z*Math.abs(ri.z),l=t.dot(ri),c=e.dot(ri),h=n.dot(ri);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const yh=new _i,lr=new U,Xs=new U;class er{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):yh.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;lr.subVectors(t,this.center);const e=lr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(lr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Xs.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(lr.copy(t.center).add(Xs)),this.expandByPoint(lr.copy(t.center).sub(Xs))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Rn=new U,qs=new U,Xr=new U,kn=new U,Ys=new U,qr=new U,$s=new U;class Pa{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Rn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Rn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Rn.copy(this.origin).addScaledVector(this.direction,e),Rn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){qs.copy(t).add(e).multiplyScalar(.5),Xr.copy(e).sub(t).normalize(),kn.copy(this.origin).sub(qs);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Xr),a=kn.dot(this.direction),l=-kn.dot(Xr),c=kn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=s*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(qs).addScaledVector(Xr,d),f}intersectSphere(t,e){Rn.subVectors(t.center,this.origin);const n=Rn.dot(this.direction),r=Rn.dot(Rn)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,r=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,r=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,Rn)!==null}intersectTriangle(t,e,n,r,s){Ys.subVectors(e,t),qr.subVectors(n,t),$s.crossVectors(Ys,qr);let o=this.direction.dot($s),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;kn.subVectors(this.origin,t);const l=a*this.direction.dot(qr.crossVectors(kn,qr));if(l<0)return null;const c=a*this.direction.dot(Ys.cross(kn));if(c<0||l+c>o)return null;const h=-a*kn.dot($s);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ee{constructor(t,e,n,r,s,o,a,l,c,h,u,d,f,g,_,m){ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c,h,u,d,f,g,_,m)}set(t,e,n,r,s,o,a,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/wi.setFromMatrixColumn(t,0).length(),s=1/wi.setFromMatrixColumn(t,1).length(),o=1/wi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Eh,t,bh)}lookAt(t,e,n){const r=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),Wn.crossVectors(n,Ye),Wn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),Wn.crossVectors(n,Ye)),Wn.normalize(),Yr.crossVectors(Ye,Wn),r[0]=Wn.x,r[4]=Yr.x,r[8]=Ye.x,r[1]=Wn.y,r[5]=Yr.y,r[9]=Ye.y,r[2]=Wn.z,r[6]=Yr.z,r[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],b=n[3],w=n[7],S=n[11],R=n[15],A=r[0],C=r[4],E=r[8],v=r[12],M=r[1],I=r[5],O=r[9],G=r[13],Y=r[2],W=r[6],X=r[10],j=r[14],V=r[3],st=r[7],dt=r[11],bt=r[15];return s[0]=o*A+a*M+l*Y+c*V,s[4]=o*C+a*I+l*W+c*st,s[8]=o*E+a*O+l*X+c*dt,s[12]=o*v+a*G+l*j+c*bt,s[1]=h*A+u*M+d*Y+f*V,s[5]=h*C+u*I+d*W+f*st,s[9]=h*E+u*O+d*X+f*dt,s[13]=h*v+u*G+d*j+f*bt,s[2]=g*A+_*M+m*Y+p*V,s[6]=g*C+_*I+m*W+p*st,s[10]=g*E+_*O+m*X+p*dt,s[14]=g*v+_*G+m*j+p*bt,s[3]=b*A+w*M+S*Y+R*V,s[7]=b*C+w*I+S*W+R*st,s[11]=b*E+w*O+S*X+R*dt,s[15]=b*v+w*G+S*j+R*bt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*l*u-r*c*u-s*a*d+n*c*d+r*a*f-n*l*f)+_*(+e*l*f-e*c*d+s*o*d-r*o*f+r*c*h-s*l*h)+m*(+e*c*u-e*a*f-s*o*u+n*o*f+s*a*h-n*c*h)+p*(-r*a*h-e*l*u+e*a*d+r*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],b=u*m*c-_*d*c+_*l*f-a*m*f-u*l*p+a*d*p,w=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,S=h*_*c-g*u*c+g*a*f-o*_*f-h*a*p+o*u*p,R=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,A=e*b+n*w+r*S+s*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return t[0]=b*C,t[1]=(_*d*s-u*m*s-_*r*f+n*m*f+u*r*p-n*d*p)*C,t[2]=(a*m*s-_*l*s+_*r*c-n*m*c-a*r*p+n*l*p)*C,t[3]=(u*l*s-a*d*s-u*r*c+n*d*c+a*r*f-n*l*f)*C,t[4]=w*C,t[5]=(h*m*s-g*d*s+g*r*f-e*m*f-h*r*p+e*d*p)*C,t[6]=(g*l*s-o*m*s-g*r*c+e*m*c+o*r*p-e*l*p)*C,t[7]=(o*d*s-h*l*s+h*r*c-e*d*c-o*r*f+e*l*f)*C,t[8]=S*C,t[9]=(g*u*s-h*_*s-g*n*f+e*_*f+h*n*p-e*u*p)*C,t[10]=(o*_*s-g*a*s+g*n*c-e*_*c-o*n*p+e*a*p)*C,t[11]=(h*a*s-o*u*s-h*n*c+e*u*c+o*n*f-e*a*f)*C,t[12]=R*C,t[13]=(h*_*r-g*u*r+g*n*d-e*_*d-h*n*m+e*u*m)*C,t[14]=(g*a*r-o*_*r-g*n*l+e*_*l+o*n*m-e*a*m)*C,t[15]=(o*u*r-h*a*r+h*n*l-e*u*l-o*n*d+e*a*d)*C,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+n,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,h=o+o,u=a+a,d=s*c,f=s*h,g=s*u,_=o*h,m=o*u,p=a*u,b=l*c,w=l*h,S=l*u,R=n.x,A=n.y,C=n.z;return r[0]=(1-(_+p))*R,r[1]=(f+S)*R,r[2]=(g-w)*R,r[3]=0,r[4]=(f-S)*A,r[5]=(1-(d+p))*A,r[6]=(m+b)*A,r[7]=0,r[8]=(g+w)*C,r[9]=(m-b)*C,r[10]=(1-(d+_))*C,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=wi.set(r[0],r[1],r[2]).length();const o=wi.set(r[4],r[5],r[6]).length(),a=wi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],dn.copy(this);const c=1/s,h=1/o,u=1/a;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=u,dn.elements[9]*=u,dn.elements[10]*=u,e.setFromRotationMatrix(dn),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=yn,l=!1){const c=this.elements,h=2*s/(e-t),u=2*s/(n-r),d=(e+t)/(e-t),f=(n+r)/(n-r);let g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===yn)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Es)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=yn,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-r),d=-(e+t)/(e-t),f=-(n+r)/(n-r);let g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===yn)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Es)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const wi=new U,dn=new ee,Eh=new U(0,0,0),bh=new U(1,1,1),Wn=new U,Yr=new U,Ye=new U,cl=new ee,ul=new En;class Ne{constructor(t=0,e=0,n=0,r=Ne.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],u=r[2],d=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-qt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return cl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(cl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ul.setFromEuler(this),this.setFromQuaternion(ul,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ne.DEFAULT_ORDER="XYZ";class Ia{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let wh=0;const hl=new U,Ti=new En,Cn=new ee,$r=new U,cr=new U,Th=new U,Ah=new En,dl=new U(1,0,0),fl=new U(0,1,0),pl=new U(0,0,1),ml={type:"added"},Rh={type:"removed"},Ai={type:"childadded",child:null},Ks={type:"childremoved",child:null};class be extends tr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wh++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new U,e=new Ne,n=new En,r=new U(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ee},normalMatrix:{value:new zt}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ia,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ti.setFromAxisAngle(t,e),this.quaternion.multiply(Ti),this}rotateOnWorldAxis(t,e){return Ti.setFromAxisAngle(t,e),this.quaternion.premultiply(Ti),this}rotateX(t){return this.rotateOnAxis(dl,t)}rotateY(t){return this.rotateOnAxis(fl,t)}rotateZ(t){return this.rotateOnAxis(pl,t)}translateOnAxis(t,e){return hl.copy(t).applyQuaternion(this.quaternion),this.position.add(hl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(dl,t)}translateY(t){return this.translateOnAxis(fl,t)}translateZ(t){return this.translateOnAxis(pl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$r.copy(t):$r.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(cr,$r,this.up):Cn.lookAt($r,cr,this.up),this.quaternion.setFromRotationMatrix(Cn),r&&(Cn.extractRotation(r.matrixWorld),Ti.setFromRotationMatrix(Cn),this.quaternion.premultiply(Ti.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ml),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Rh),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ml),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,t,Th),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,Ah,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}be.DEFAULT_UP=new U(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new U,Pn=new U,js=new U,In=new U,Ri=new U,Ci=new U,gl=new U,Zs=new U,Js=new U,Qs=new U,to=new oe,eo=new oe,no=new oe;class on{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),fn.subVectors(t,e),r.cross(fn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){fn.subVectors(r,e),Pn.subVectors(n,e),js.subVectors(t,e);const o=fn.dot(fn),a=fn.dot(Pn),l=fn.dot(js),c=Pn.dot(Pn),h=Pn.dot(js),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return s.set(1-f-g,g,f)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(t,e,n,r,s,o,a,l){return this.getBarycoord(t,e,n,r,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,In.x),l.addScaledVector(o,In.y),l.addScaledVector(a,In.z),l)}static getInterpolatedAttribute(t,e,n,r,s,o){return to.setScalar(0),eo.setScalar(0),no.setScalar(0),to.fromBufferAttribute(t,e),eo.fromBufferAttribute(t,n),no.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(to,s.x),o.addScaledVector(eo,s.y),o.addScaledVector(no,s.z),o}static isFrontFacing(t,e,n,r){return fn.subVectors(n,e),Pn.subVectors(t,e),fn.cross(Pn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return fn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),fn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return on.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return on.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return on.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return on.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return on.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;Ri.subVectors(r,n),Ci.subVectors(s,n),Zs.subVectors(t,n);const l=Ri.dot(Zs),c=Ci.dot(Zs);if(l<=0&&c<=0)return e.copy(n);Js.subVectors(t,r);const h=Ri.dot(Js),u=Ci.dot(Js);if(h>=0&&u<=h)return e.copy(r);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Ri,o);Qs.subVectors(t,s);const f=Ri.dot(Qs),g=Ci.dot(Qs);if(g>=0&&f<=g)return e.copy(s);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ci,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return gl.subVectors(s,r),a=(u-h)/(u-h+(f-g)),e.copy(r).addScaledVector(gl,a);const p=1/(m+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(Ri,o).addScaledVector(Ci,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Dc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xn={h:0,s:0,l:0},Kr={h:0,s:0,l:0};function io(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,jt.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=jt.workingColorSpace){if(t=fh(t,1),e=qt(e,0,1),n=qt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=io(o,s,t+1/3),this.g=io(o,s,t),this.b=io(o,s,t-1/3)}return jt.colorSpaceToWorking(this,r),this}setStyle(t,e=Me){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){const n=Dc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=On(t.r),this.g=On(t.g),this.b=On(t.b),this}copyLinearToSRGB(t){return this.r=Vi(t.r),this.g=Vi(t.g),this.b=Vi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return jt.workingToColorSpace(Ue.copy(this),t),Math.round(qt(Ue.r*255,0,255))*65536+Math.round(qt(Ue.g*255,0,255))*256+Math.round(qt(Ue.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.workingToColorSpace(Ue.copy(this),e);const n=Ue.r,r=Ue.g,s=Ue.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=jt.workingColorSpace){return jt.workingToColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Me){jt.workingToColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,r=Ue.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Xn),this.setHSL(Xn.h+t,Xn.s+e,Xn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Xn),t.getHSL(Kr);const n=zs(Xn.h,Kr.h,e),r=zs(Xn.s,Kr.s,e),s=zs(Xn.l,Kr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Wt;Wt.NAMES=Dc;let Ch=0;class ti extends tr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ch++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=Gi,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Eo,this.blendDst=bo,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=il,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Eo&&(n.blendSrc=this.blendSrc),this.blendDst!==bo&&(n.blendDst=this.blendDst),this.blendEquation!==hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Wi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==il&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class je extends ti{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ne,this.combine=Sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new U,jr=new Ct;let Ph=0;class ke{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ph++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ca,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)jr.fromBufferAttribute(this,e),jr.applyMatrix3(t),this.setXY(e,jr.x,jr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=xn(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=xn(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=xn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=xn(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),r=se(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),r=se(r,this.array),s=se(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ca&&(t.usage=this.usage),t}}class Nc extends ke{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Fc extends ke{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class we extends ke{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ih=0;const nn=new ee,ro=new be,Pi=new U,$e=new _i,ur=new _i,Ce=new U;class Fe extends tr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Lc(t)?Fc:Nc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new zt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return nn.makeRotationFromQuaternion(t),this.applyMatrix4(nn),this}rotateX(t){return nn.makeRotationX(t),this.applyMatrix4(nn),this}rotateY(t){return nn.makeRotationY(t),this.applyMatrix4(nn),this}rotateZ(t){return nn.makeRotationZ(t),this.applyMatrix4(nn),this}translate(t,e,n){return nn.makeTranslation(t,e,n),this.applyMatrix4(nn),this}scale(t,e,n){return nn.makeScale(t,e,n),this.applyMatrix4(nn),this}lookAt(t){return ro.lookAt(t),ro.updateMatrix(),this.applyMatrix4(ro.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new we(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _i);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];$e.setFromBufferAttribute(s),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new er);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];ur.setFromBufferAttribute(a),this.morphTargetsRelative?(Ce.addVectors($e.min,ur.min),$e.expandByPoint(Ce),Ce.addVectors($e.max,ur.max),$e.expandByPoint(Ce)):($e.expandByPoint(ur.min),$e.expandByPoint(ur.max))}$e.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)Ce.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Ce));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ce.fromBufferAttribute(a,c),l&&(Pi.fromBufferAttribute(t,c),Ce.add(Pi)),r=Math.max(r,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ke(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let E=0;E<n.count;E++)a[E]=new U,l[E]=new U;const c=new U,h=new U,u=new U,d=new Ct,f=new Ct,g=new Ct,_=new U,m=new U;function p(E,v,M){c.fromBufferAttribute(n,E),h.fromBufferAttribute(n,v),u.fromBufferAttribute(n,M),d.fromBufferAttribute(s,E),f.fromBufferAttribute(s,v),g.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),a[E].add(_),a[v].add(_),a[M].add(_),l[E].add(m),l[v].add(m),l[M].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let E=0,v=b.length;E<v;++E){const M=b[E],I=M.start,O=M.count;for(let G=I,Y=I+O;G<Y;G+=3)p(t.getX(G+0),t.getX(G+1),t.getX(G+2))}const w=new U,S=new U,R=new U,A=new U;function C(E){R.fromBufferAttribute(r,E),A.copy(R);const v=a[E];w.copy(v),w.sub(R.multiplyScalar(R.dot(v))).normalize(),S.crossVectors(A,v);const I=S.dot(l[E])<0?-1:1;o.setXYZW(E,w.x,w.y,w.z,I)}for(let E=0,v=b.length;E<v;++E){const M=b[E],I=M.start,O=M.count;for(let G=I,Y=I+O;G<Y;G+=3)C(t.getX(G+0)),C(t.getX(G+1)),C(t.getX(G+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ke(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const r=new U,s=new U,o=new U,a=new U,l=new U,c=new U,h=new U,u=new U;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new ke(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Fe,n=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(r[l]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _l=new ee,si=new Pa,Zr=new er,vl=new U,Jr=new U,Qr=new U,ts=new U,so=new U,es=new U,xl=new U,ns=new U;class Zt extends be{constructor(t=new Fe,e=new je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){es.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],u=s[l];h!==0&&(so.fromBufferAttribute(u,t),o?es.addScaledVector(so,h):es.addScaledVector(so.sub(e),h))}e.add(es)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(s),si.copy(t.ray).recast(t.near),!(Zr.containsPoint(si.origin)===!1&&(si.intersectSphere(Zr,vl)===null||si.origin.distanceToSquared(vl)>(t.far-t.near)**2))&&(_l.copy(s).invert(),si.copy(t.ray).applyMatrix4(_l),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,si)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),w=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let S=b,R=w;S<R;S+=3){const A=a.getX(S),C=a.getX(S+1),E=a.getX(S+2);r=is(this,p,t,n,c,h,u,A,C,E),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const b=a.getX(m),w=a.getX(m+1),S=a.getX(m+2);r=is(this,o,t,n,c,h,u,b,w,S),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),w=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let S=b,R=w;S<R;S+=3){const A=S,C=S+1,E=S+2;r=is(this,p,t,n,c,h,u,A,C,E),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const b=m,w=m+1,S=m+2;r=is(this,o,t,n,c,h,u,b,w,S),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function Lh(i,t,e,n,r,s,o,a){let l;if(t.side===Ve?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,t.side===Qn,a),l===null)return null;ns.copy(a),ns.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(ns);return c<e.near||c>e.far?null:{distance:c,point:ns.clone(),object:i}}function is(i,t,e,n,r,s,o,a,l,c){i.getVertexPosition(a,Jr),i.getVertexPosition(l,Qr),i.getVertexPosition(c,ts);const h=Lh(i,t,e,n,Jr,Qr,ts,xl);if(h){const u=new U;on.getBarycoord(xl,Jr,Qr,ts,u),r&&(h.uv=on.getInterpolatedAttribute(r,a,l,c,u,new Ct)),s&&(h.uv1=on.getInterpolatedAttribute(s,a,l,c,u,new Ct)),o&&(h.normal=on.getInterpolatedAttribute(o,a,l,c,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new U,materialIndex:0};on.getNormal(Jr,Qr,ts,d.normal),h.face=d,h.barycoord=u}return h}class un extends Fe{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new we(c,3)),this.setAttribute("normal",new we(h,3)),this.setAttribute("uv",new we(u,2));function g(_,m,p,b,w,S,R,A,C,E,v){const M=S/C,I=R/E,O=S/2,G=R/2,Y=A/2,W=C+1,X=E+1;let j=0,V=0;const st=new U;for(let dt=0;dt<X;dt++){const bt=dt*I-G;for(let Ht=0;Ht<W;Ht++){const ce=Ht*M-O;st[_]=ce*b,st[m]=bt*w,st[p]=Y,c.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[p]=A>0?1:-1,h.push(st.x,st.y,st.z),u.push(Ht/C),u.push(1-dt/E),j+=1}}for(let dt=0;dt<E;dt++)for(let bt=0;bt<C;bt++){const Ht=d+bt+W*dt,ce=d+bt+W*(dt+1),de=d+(bt+1)+W*(dt+1),Jt=d+(bt+1)+W*dt;l.push(Ht,ce,Jt),l.push(ce,de,Jt),V+=6}a.addGroup(f,V,v),f+=V,d+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new un(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function $i(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=$i(i[e]);for(const r in n)t[r]=n[r]}return t}function Uh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Oc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}const Dh={clone:$i,merge:ze};var Nh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bn extends ti{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nh,this.fragmentShader=Fh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=$i(t.uniforms),this.uniformsGroups=Uh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Bc extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new U,Ml=new Ct,Sl=new Ct;class He extends Bc{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ua*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Bs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ua*2*Math.atan(Math.tan(Bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,Ml,Sl),e.subVectors(Sl,Ml)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Bs*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,e-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ii=-90,Li=1;class Oh extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new He(Ii,Li,t,e);r.layers=this.layers,this.add(r);const s=new He(Ii,Li,t,e);s.layers=this.layers,this.add(s);const o=new He(Ii,Li,t,e);o.layers=this.layers,this.add(o);const a=new He(Ii,Li,t,e);a.layers=this.layers,this.add(a);const l=new He(Ii,Li,t,e);l.layers=this.layers,this.add(l);const c=new He(Ii,Li,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===yn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Es)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class zc extends Pe{constructor(t=[],e=Xi,n,r,s,o,a,l,c,h){super(t,e,n,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Bh extends gi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new zc(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new un(5,5,5),s=new Bn({name:"CubemapFromEquirect",uniforms:$i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ve,blending:$n});s.uniforms.tEquirect.value=e;const o=new Zt(r,s),a=e.minFilter;return e.minFilter===Nn&&(e.minFilter=an),new Oh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}class ln extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zh={type:"move"};class oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(zh)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ln;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Hc extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ne,this.environmentIntensity=1,this.environmentRotation=new Ne,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Hh{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ca,this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Be=new U;class bs{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=xn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=xn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=xn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=xn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=xn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),r=se(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),r=se(r,this.array),s=se(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new ke(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new bs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Gc extends ti{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Wt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ui;const hr=new U,Di=new U,Ni=new U,Fi=new Ct,dr=new Ct,Vc=new ee,rs=new U,fr=new U,ss=new U,yl=new Ct,ao=new Ct,El=new Ct;class Gh extends be{constructor(t=new Gc){if(super(),this.isSprite=!0,this.type="Sprite",Ui===void 0){Ui=new Fe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Hh(e,5);Ui.setIndex([0,1,2,0,2,3]),Ui.setAttribute("position",new bs(n,3,0,!1)),Ui.setAttribute("uv",new bs(n,2,3,!1))}this.geometry=Ui,this.material=t,this.center=new Ct(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Di.setFromMatrixScale(this.matrixWorld),Vc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ni.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Di.multiplyScalar(-Ni.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const o=this.center;os(rs.set(-.5,-.5,0),Ni,o,Di,r,s),os(fr.set(.5,-.5,0),Ni,o,Di,r,s),os(ss.set(.5,.5,0),Ni,o,Di,r,s),yl.set(0,0),ao.set(1,0),El.set(1,1);let a=t.ray.intersectTriangle(rs,fr,ss,!1,hr);if(a===null&&(os(fr.set(-.5,.5,0),Ni,o,Di,r,s),ao.set(0,1),a=t.ray.intersectTriangle(rs,ss,fr,!1,hr),a===null))return;const l=t.ray.origin.distanceTo(hr);l<t.near||l>t.far||e.push({distance:l,point:hr.clone(),uv:on.getInterpolation(hr,rs,fr,ss,yl,ao,El,new Ct),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function os(i,t,e,n,r,s){Fi.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?(dr.x=s*Fi.x-r*Fi.y,dr.y=r*Fi.x+s*Fi.y):dr.copy(Fi),i.copy(t),i.x+=dr.x,i.y+=dr.y,i.applyMatrix4(Vc)}class Vh extends Pe{constructor(t=null,e=1,n=1,r,s,o,a,l,c=Ke,h=Ke,u,d){super(null,o,a,l,c,h,r,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class bl extends ke{constructor(t,e,n,r=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Oi=new ee,wl=new ee,as=[],Tl=new _i,kh=new ee,pr=new Zt,mr=new er;class Wh extends Zt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new bl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,kh)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new _i),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Oi),Tl.copy(t.boundingBox).applyMatrix4(Oi),this.boundingBox.union(Tl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new er),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Oi),mr.copy(t.boundingSphere).applyMatrix4(Oi),this.boundingSphere.union(mr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,o=t*s+1;for(let a=0;a<n.length;a++)n[a]=r[o+a]}raycast(t,e){const n=this.matrixWorld,r=this.count;if(pr.geometry=this.geometry,pr.material=this.material,pr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),mr.copy(this.boundingSphere),mr.applyMatrix4(n),t.ray.intersectsSphere(mr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Oi),wl.multiplyMatrices(n,Oi),pr.matrixWorld=wl,pr.raycast(t,as);for(let o=0,a=as.length;o<a;o++){const l=as[o];l.instanceId=s,l.object=this,e.push(l)}as.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new bl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Vh(new Float32Array(r*this.count),r,this.count,ba,Sn));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*t;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const lo=new U,Xh=new U,qh=new zt;class ci{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=lo.subVectors(n,e).cross(Xh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(lo),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||qh.getNormalMatrix(t),r=this.coplanarPoint(lo).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const oi=new er,Yh=new Ct(.5,.5),ls=new U;class La{constructor(t=new ci,e=new ci,n=new ci,r=new ci,s=new ci,o=new ci){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=yn,n=!1){const r=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],b=s[12],w=s[13],S=s[14],R=s[15];if(r[0].setComponents(c-o,f-h,p-g,R-b).normalize(),r[1].setComponents(c+o,f+h,p+g,R+b).normalize(),r[2].setComponents(c+a,f+u,p+_,R+w).normalize(),r[3].setComponents(c-a,f-u,p-_,R-w).normalize(),n)r[4].setComponents(l,d,m,S).normalize(),r[5].setComponents(c-l,f-d,p-m,R-S).normalize();else if(r[4].setComponents(c-l,f-d,p-m,R-S).normalize(),e===yn)r[5].setComponents(c+l,f+d,p+m,R+S).normalize();else if(e===Es)r[5].setComponents(l,d,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){oi.center.set(0,0,0);const e=Yh.distanceTo(t.center);return oi.radius=.7071067811865476+e,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(ls.x=r.normal.x>0?t.max.x:t.min.x,ls.y=r.normal.y>0?t.max.y:t.min.y,ls.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(ls)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class kc extends ti{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Wt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Al=new ee,ha=new Pa,cs=new er,us=new U;class $h extends be{constructor(t=new Fe,e=new kc){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),cs.copy(n.boundingSphere),cs.applyMatrix4(r),cs.radius+=s,t.ray.intersectsSphere(cs)===!1)return;Al.copy(r).invert(),ha.copy(t.ray).applyMatrix4(Al);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){const m=c.getX(g);us.fromBufferAttribute(u,m),Rl(us,m,l,r,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,_=f;g<_;g++)us.fromBufferAttribute(u,g),Rl(us,g,l,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Rl(i,t,e,n,r,s,o){const a=ha.distanceSqToPoint(i);if(a<e){const l=new U;ha.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class nr extends Pe{constructor(t,e,n,r,s,o,a,l,c){super(t,e,n,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Wc extends Pe{constructor(t,e,n=mi,r,s,o,a=Ke,l=Ke,c,h=Ar,u=1){if(h!==Ar&&h!==Rr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,r,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ca(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Xc extends Pe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ir extends Fe{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;b(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new we(u,3)),this.setAttribute("normal",new we(d,3)),this.setAttribute("uv",new we(f,2));function b(){const S=new U,R=new U;let A=0;const C=(e-t)/n;for(let E=0;E<=s;E++){const v=[],M=E/s,I=M*(e-t)+t;for(let O=0;O<=r;O++){const G=O/r,Y=G*l+a,W=Math.sin(Y),X=Math.cos(Y);R.x=I*W,R.y=-M*n+m,R.z=I*X,u.push(R.x,R.y,R.z),S.set(W,C,X).normalize(),d.push(S.x,S.y,S.z),f.push(G,1-M),v.push(g++)}_.push(v)}for(let E=0;E<r;E++)for(let v=0;v<s;v++){const M=_[v][E],I=_[v+1][E],O=_[v+1][E+1],G=_[v][E+1];(t>0||v!==0)&&(h.push(M,I,G),A+=3),(e>0||v!==s-1)&&(h.push(I,O,G),A+=3)}c.addGroup(p,A,0),p+=A}function w(S){const R=g,A=new Ct,C=new U;let E=0;const v=S===!0?t:e,M=S===!0?1:-1;for(let O=1;O<=r;O++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const I=g;for(let O=0;O<=r;O++){const Y=O/r*l+a,W=Math.cos(Y),X=Math.sin(Y);C.x=v*X,C.y=m*M,C.z=v*W,u.push(C.x,C.y,C.z),d.push(0,M,0),A.x=W*.5+.5,A.y=X*.5*M+.5,f.push(A.x,A.y),g++}for(let O=0;O<r;O++){const G=R+O,Y=I+O;S===!0?h.push(Y,Y+1,G):h.push(Y+1,Y,G),E+=3}c.addGroup(p,E,S===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ua extends Fe{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],o=[];a(r),c(n),h(),this.setAttribute("position",new we(s,3)),this.setAttribute("normal",new we(s.slice(),3)),this.setAttribute("uv",new we(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(b){const w=new U,S=new U,R=new U;for(let A=0;A<e.length;A+=3)f(e[A+0],w),f(e[A+1],S),f(e[A+2],R),l(w,S,R,b)}function l(b,w,S,R){const A=R+1,C=[];for(let E=0;E<=A;E++){C[E]=[];const v=b.clone().lerp(S,E/A),M=w.clone().lerp(S,E/A),I=A-E;for(let O=0;O<=I;O++)O===0&&E===A?C[E][O]=v:C[E][O]=v.clone().lerp(M,O/I)}for(let E=0;E<A;E++)for(let v=0;v<2*(A-E)-1;v++){const M=Math.floor(v/2);v%2===0?(d(C[E][M+1]),d(C[E+1][M]),d(C[E][M])):(d(C[E][M+1]),d(C[E+1][M+1]),d(C[E+1][M]))}}function c(b){const w=new U;for(let S=0;S<s.length;S+=3)w.x=s[S+0],w.y=s[S+1],w.z=s[S+2],w.normalize().multiplyScalar(b),s[S+0]=w.x,s[S+1]=w.y,s[S+2]=w.z}function h(){const b=new U;for(let w=0;w<s.length;w+=3){b.x=s[w+0],b.y=s[w+1],b.z=s[w+2];const S=m(b)/2/Math.PI+.5,R=p(b)/Math.PI+.5;o.push(S,1-R)}g(),u()}function u(){for(let b=0;b<o.length;b+=6){const w=o[b+0],S=o[b+2],R=o[b+4],A=Math.max(w,S,R),C=Math.min(w,S,R);A>.9&&C<.1&&(w<.2&&(o[b+0]+=1),S<.2&&(o[b+2]+=1),R<.2&&(o[b+4]+=1))}}function d(b){s.push(b.x,b.y,b.z)}function f(b,w){const S=b*3;w.x=t[S+0],w.y=t[S+1],w.z=t[S+2]}function g(){const b=new U,w=new U,S=new U,R=new U,A=new Ct,C=new Ct,E=new Ct;for(let v=0,M=0;v<s.length;v+=9,M+=6){b.set(s[v+0],s[v+1],s[v+2]),w.set(s[v+3],s[v+4],s[v+5]),S.set(s[v+6],s[v+7],s[v+8]),A.set(o[M+0],o[M+1]),C.set(o[M+2],o[M+3]),E.set(o[M+4],o[M+5]),R.copy(b).add(w).add(S).divideScalar(3);const I=m(R);_(A,M+0,b,I),_(C,M+2,w,I),_(E,M+4,S,I)}}function _(b,w,S,R){R<0&&b.x===1&&(o[w]=b.x-1),S.x===0&&S.z===0&&(o[w]=R/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ua(t.vertices,t.indices,t.radius,t.details)}}class Da extends Ua{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Da(t.radius,t.detail)}}class ve extends Fe{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(r),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const b=p*d-o;for(let w=0;w<c;w++){const S=w*u-s;g.push(S,-b,0),_.push(0,0,1),m.push(w/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<a;b++){const w=b+c*p,S=b+c*(p+1),R=b+1+c*(p+1),A=b+1+c*p;f.push(w,S,A),f.push(S,R,A)}this.setIndex(f),this.setAttribute("position",new we(g,3)),this.setAttribute("normal",new we(_,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ve(t.width,t.height,t.widthSegments,t.heightSegments)}}class Or extends Fe{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new U,d=new U,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const b=[],w=p/n;let S=0;p===0&&o===0?S=.5/e:p===n&&l===Math.PI&&(S=-.5/e);for(let R=0;R<=e;R++){const A=R/e;u.x=-t*Math.cos(r+A*s)*Math.sin(o+w*a),u.y=t*Math.cos(o+w*a),u.z=t*Math.sin(r+A*s)*Math.sin(o+w*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(A+S,1-w),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){const w=h[p][b+1],S=h[p][b],R=h[p+1][b],A=h[p+1][b+1];(p!==0||o>0)&&f.push(w,S,A),(p!==n-1||l<Math.PI)&&f.push(S,R,A)}this.setIndex(f),this.setAttribute("position",new we(g,3)),this.setAttribute("normal",new we(_,3)),this.setAttribute("uv",new we(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Or(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Zn extends Fe{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const o=[],a=[],l=[],c=[],h=new U,u=new U,d=new U;for(let f=0;f<=n;f++)for(let g=0;g<=r;g++){const _=g/r*s,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/r),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=r;g++){const _=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,b=(r+1)*f+g;o.push(_,m,b),o.push(m,p,b)}this.setIndex(o),this.setAttribute("position",new we(a,3)),this.setAttribute("normal",new we(l,3)),this.setAttribute("uv",new we(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class le extends ti{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ra,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ne,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Cl extends ti{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ra,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class Kh extends ti{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ih,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class jh extends ti{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const co={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Zh{constructor(t,e,n){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Jh=new Zh;class Na{constructor(t){this.manager=t!==void 0?t:Jh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(r,s){n.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Na.DEFAULT_MATERIAL_NAME="__DEFAULT";const Bi=new WeakMap;class Qh extends Na{constructor(t){super(t)}load(t,e,n,r){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=this,o=co.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(t),setTimeout(function(){e&&e(o),s.manager.itemEnd(t)},0);else{let u=Bi.get(o);u===void 0&&(u=[],Bi.set(o,u)),u.push({onLoad:e,onError:r})}return o}const a=Cr("img");function l(){h(),e&&e(this);const u=Bi.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}Bi.delete(this),s.manager.itemEnd(t)}function c(u){h(),r&&r(u),co.remove(`image:${t}`);const d=Bi.get(this)||[];for(let f=0;f<d.length;f++){const g=d[f];g.onError&&g.onError(u)}Bi.delete(this),s.manager.itemError(t),s.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),co.add(`image:${t}`,a),s.manager.itemStart(t),a.src=t,a}}class td extends Na{constructor(t){super(t)}load(t,e,n,r){const s=new Pe,o=new Qh(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){s.image=a,s.needsUpdate=!0,e!==void 0&&e(s)},n,r),s}}class Fa extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class ed extends Fa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const uo=new ee,Pl=new U,Il=new U;class qc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new La,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new oe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Pl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Pl),Il.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Il),e.updateMatrixWorld(),uo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uo,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(uo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ll=new ee,gr=new U,ho=new U;class nd extends qc{constructor(){super(new He(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ct(4,2),this._viewportCount=6,this._viewports=[new oe(2,1,1,1),new oe(0,1,1,1),new oe(3,1,1,1),new oe(1,1,1,1),new oe(3,0,1,1),new oe(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),gr.setFromMatrixPosition(t.matrixWorld),n.position.copy(gr),ho.copy(n.position),ho.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ho),n.updateMatrixWorld(),r.makeTranslation(-gr.x,-gr.y,-gr.z),Ll.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ll,n.coordinateSystem,n.reversedDepth)}}class id extends Fa{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new nd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Yc extends Bc{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class rd extends qc{constructor(){super(new Yc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ul extends Fa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new rd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class sd extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const Dl=new ee;class od{constructor(t,e,n=0,r=1/0){this.ray=new Pa(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new Ia,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Dl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Dl),this}intersectObject(t,e=!0,n=[]){return da(t,this,n,e),n.sort(Nl),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)da(t[r],this,n,e);return n.sort(Nl),n}}function Nl(i,t){return i.distance-t.distance}function da(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)da(s[o],t,e,!0)}}function Fl(i,t,e,n){const r=ad(n);switch(e){case Rc:return i*t;case ba:return i*t/r.components*r.byteLength;case wa:return i*t/r.components*r.byteLength;case Pc:return i*t*2/r.components*r.byteLength;case Ta:return i*t*2/r.components*r.byteLength;case Cc:return i*t*3/r.components*r.byteLength;case pn:return i*t*4/r.components*r.byteLength;case Aa:return i*t*4/r.components*r.byteLength;case ps:case ms:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case gs:case _s:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fo:case Bo:return Math.max(i,16)*Math.max(t,8)/4;case No:case Oo:return Math.max(i,8)*Math.max(t,8)/2;case zo:case Ho:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ko:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Wo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Xo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case qo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Yo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case $o:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ko:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case jo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Jo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Qo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ta:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ea:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case na:case ia:case ra:return Math.ceil(i/4)*Math.ceil(t/4)*16;case sa:case oa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case aa:case la:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ad(i){switch(i){case bn:case bc:return{byteLength:1,components:1};case wr:case wc:case Fr:return{byteLength:2,components:1};case ya:case Ea:return{byteLength:2,components:4};case mi:case Sa:case Sn:return{byteLength:4,components:1};case Tc:case Ac:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ma}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ma);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function $c(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function ld(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var cd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ud=`#ifdef USE_ALPHAHASH
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
#endif`,hd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,md=`#ifdef USE_AOMAP
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
#endif`,gd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_d=`#ifdef USE_BATCHING
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
#endif`,vd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Md=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,yd=`#ifdef USE_IRIDESCENCE
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
#endif`,Ed=`#ifdef USE_BUMPMAP
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
#endif`,bd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Id=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ld=`#define PI 3.141592653589793
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
} // validated`,Ud=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Dd=`vec3 transformedNormal = objectNormal;
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
#endif`,Nd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Od=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gd=`#ifdef USE_ENVMAP
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
#endif`,Vd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kd=`#ifdef USE_ENVMAP
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
#endif`,Wd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xd=`#ifdef USE_ENVMAP
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
#endif`,qd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$d=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jd=`#ifdef USE_GRADIENTMAP
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
}`,Zd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tf=`uniform bool receiveShadow;
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
#endif`,ef=`#ifdef USE_ENVMAP
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
#endif`,nf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,of=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,af=`PhysicalMaterial material;
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
#endif`,lf=`struct PhysicalMaterial {
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
}`,cf=`
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
#endif`,uf=`#if defined( RE_IndirectDiffuse )
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
#endif`,hf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,df=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ff=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_f=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,xf=`#if defined( USE_POINTS_UV )
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
#endif`,Mf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ef=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wf=`#ifdef USE_MORPHTARGETS
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
#endif`,Tf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Af=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,If=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lf=`#ifdef USE_NORMALMAP
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
#endif`,Uf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Df=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ff=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Of=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,$f=`float getShadowMask() {
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
}`,Kf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jf=`#ifdef USE_SKINNING
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
#endif`,Zf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jf=`#ifdef USE_SKINNING
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
#endif`,Qf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ep=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,np=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ip=`#ifdef USE_TRANSMISSION
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
#endif`,rp=`#ifdef USE_TRANSMISSION
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
#endif`,sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,up=`uniform sampler2D t2D;
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
}`,hp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mp=`#include <common>
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
}`,gp=`#if DEPTH_PACKING == 3200
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
}`,_p=`#define DISTANCE
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
}`,vp=`#define DISTANCE
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
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sp=`uniform float scale;
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
}`,yp=`uniform vec3 diffuse;
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
}`,Ep=`#include <common>
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
}`,bp=`uniform vec3 diffuse;
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
}`,wp=`#define LAMBERT
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
}`,Tp=`#define LAMBERT
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
}`,Ap=`#define MATCAP
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
}`,Rp=`#define MATCAP
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
}`,Cp=`#define NORMAL
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
}`,Pp=`#define NORMAL
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
}`,Ip=`#define PHONG
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
}`,Lp=`#define PHONG
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
}`,Up=`#define STANDARD
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
}`,Dp=`#define STANDARD
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
}`,Np=`#define TOON
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
}`,Fp=`#define TOON
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
}`,Op=`uniform float size;
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
}`,Bp=`uniform vec3 diffuse;
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
}`,zp=`#include <common>
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
}`,Hp=`uniform vec3 color;
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
}`,Gp=`uniform float rotation;
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
}`,Vp=`uniform vec3 diffuse;
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
}`,Vt={alphahash_fragment:cd,alphahash_pars_fragment:ud,alphamap_fragment:hd,alphamap_pars_fragment:dd,alphatest_fragment:fd,alphatest_pars_fragment:pd,aomap_fragment:md,aomap_pars_fragment:gd,batching_pars_vertex:_d,batching_vertex:vd,begin_vertex:xd,beginnormal_vertex:Md,bsdfs:Sd,iridescence_fragment:yd,bumpmap_pars_fragment:Ed,clipping_planes_fragment:bd,clipping_planes_pars_fragment:wd,clipping_planes_pars_vertex:Td,clipping_planes_vertex:Ad,color_fragment:Rd,color_pars_fragment:Cd,color_pars_vertex:Pd,color_vertex:Id,common:Ld,cube_uv_reflection_fragment:Ud,defaultnormal_vertex:Dd,displacementmap_pars_vertex:Nd,displacementmap_vertex:Fd,emissivemap_fragment:Od,emissivemap_pars_fragment:Bd,colorspace_fragment:zd,colorspace_pars_fragment:Hd,envmap_fragment:Gd,envmap_common_pars_fragment:Vd,envmap_pars_fragment:kd,envmap_pars_vertex:Wd,envmap_physical_pars_fragment:ef,envmap_vertex:Xd,fog_vertex:qd,fog_pars_vertex:Yd,fog_fragment:$d,fog_pars_fragment:Kd,gradientmap_pars_fragment:jd,lightmap_pars_fragment:Zd,lights_lambert_fragment:Jd,lights_lambert_pars_fragment:Qd,lights_pars_begin:tf,lights_toon_fragment:nf,lights_toon_pars_fragment:rf,lights_phong_fragment:sf,lights_phong_pars_fragment:of,lights_physical_fragment:af,lights_physical_pars_fragment:lf,lights_fragment_begin:cf,lights_fragment_maps:uf,lights_fragment_end:hf,logdepthbuf_fragment:df,logdepthbuf_pars_fragment:ff,logdepthbuf_pars_vertex:pf,logdepthbuf_vertex:mf,map_fragment:gf,map_pars_fragment:_f,map_particle_fragment:vf,map_particle_pars_fragment:xf,metalnessmap_fragment:Mf,metalnessmap_pars_fragment:Sf,morphinstance_vertex:yf,morphcolor_vertex:Ef,morphnormal_vertex:bf,morphtarget_pars_vertex:wf,morphtarget_vertex:Tf,normal_fragment_begin:Af,normal_fragment_maps:Rf,normal_pars_fragment:Cf,normal_pars_vertex:Pf,normal_vertex:If,normalmap_pars_fragment:Lf,clearcoat_normal_fragment_begin:Uf,clearcoat_normal_fragment_maps:Df,clearcoat_pars_fragment:Nf,iridescence_pars_fragment:Ff,opaque_fragment:Of,packing:Bf,premultiplied_alpha_fragment:zf,project_vertex:Hf,dithering_fragment:Gf,dithering_pars_fragment:Vf,roughnessmap_fragment:kf,roughnessmap_pars_fragment:Wf,shadowmap_pars_fragment:Xf,shadowmap_pars_vertex:qf,shadowmap_vertex:Yf,shadowmask_pars_fragment:$f,skinbase_vertex:Kf,skinning_pars_vertex:jf,skinning_vertex:Zf,skinnormal_vertex:Jf,specularmap_fragment:Qf,specularmap_pars_fragment:tp,tonemapping_fragment:ep,tonemapping_pars_fragment:np,transmission_fragment:ip,transmission_pars_fragment:rp,uv_pars_fragment:sp,uv_pars_vertex:op,uv_vertex:ap,worldpos_vertex:lp,background_vert:cp,background_frag:up,backgroundCube_vert:hp,backgroundCube_frag:dp,cube_vert:fp,cube_frag:pp,depth_vert:mp,depth_frag:gp,distanceRGBA_vert:_p,distanceRGBA_frag:vp,equirect_vert:xp,equirect_frag:Mp,linedashed_vert:Sp,linedashed_frag:yp,meshbasic_vert:Ep,meshbasic_frag:bp,meshlambert_vert:wp,meshlambert_frag:Tp,meshmatcap_vert:Ap,meshmatcap_frag:Rp,meshnormal_vert:Cp,meshnormal_frag:Pp,meshphong_vert:Ip,meshphong_frag:Lp,meshphysical_vert:Up,meshphysical_frag:Dp,meshtoon_vert:Np,meshtoon_frag:Fp,points_vert:Op,points_frag:Bp,shadow_vert:zp,shadow_frag:Hp,sprite_vert:Gp,sprite_frag:Vp},at={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},_n={basic:{uniforms:ze([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:ze([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:ze([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:ze([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:ze([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:ze([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:ze([at.points,at.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:ze([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:ze([at.common,at.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:ze([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:ze([at.sprite,at.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:ze([at.common,at.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:ze([at.lights,at.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};_n.physical={uniforms:ze([_n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const hs={r:0,b:0,g:0},ai=new Ne,kp=new ee;function Wp(i,t,e,n,r,s,o){const a=new Wt(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function g(w){let S=w.isScene===!0?w.background:null;return S&&S.isTexture&&(S=(w.backgroundBlurriness>0?e:t).get(S)),S}function _(w){let S=!1;const R=g(w);R===null?p(a,l):R&&R.isColor&&(p(R,1),S=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,S){const R=g(S);R&&(R.isCubeTexture||R.mapping===Is)?(h===void 0&&(h=new Zt(new un(1,1,1),new Bn({name:"BackgroundCubeMaterial",uniforms:$i(_n.backgroundCube.uniforms),vertexShader:_n.backgroundCube.vertexShader,fragmentShader:_n.backgroundCube.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),ai.copy(S.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(kp.makeRotationFromEuler(ai)),h.material.toneMapped=jt.getTransfer(R.colorSpace)!==re,(u!==R||d!==R.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,f=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new Zt(new ve(2,2),new Bn({name:"BackgroundMaterial",uniforms:$i(_n.background.uniforms),vertexShader:_n.background.vertexShader,fragmentShader:_n.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=jt.getTransfer(R.colorSpace)!==re,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,d=R.version,f=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function p(w,S){w.getRGB(hs,Oc(i)),n.buffers.color.setClear(hs.r,hs.g,hs.b,S,o)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,S=1){a.set(w),l=S,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,p(a,l)},render:_,addToRenderList:m,dispose:b}}function Xp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,o=!1;function a(M,I,O,G,Y){let W=!1;const X=u(G,O,I);s!==X&&(s=X,c(s.object)),W=f(M,G,O,Y),W&&g(M,G,O,Y),Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,S(M,I,O,G),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,I,O){const G=O.wireframe===!0;let Y=n[M.id];Y===void 0&&(Y={},n[M.id]=Y);let W=Y[I.id];W===void 0&&(W={},Y[I.id]=W);let X=W[G];return X===void 0&&(X=d(l()),W[G]=X),X}function d(M){const I=[],O=[],G=[];for(let Y=0;Y<e;Y++)I[Y]=0,O[Y]=0,G[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:O,attributeDivisors:G,object:M,attributes:{},index:null}}function f(M,I,O,G){const Y=s.attributes,W=I.attributes;let X=0;const j=O.getAttributes();for(const V in j)if(j[V].location>=0){const dt=Y[V];let bt=W[V];if(bt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(bt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(bt=M.instanceColor)),dt===void 0||dt.attribute!==bt||bt&&dt.data!==bt.data)return!0;X++}return s.attributesNum!==X||s.index!==G}function g(M,I,O,G){const Y={},W=I.attributes;let X=0;const j=O.getAttributes();for(const V in j)if(j[V].location>=0){let dt=W[V];dt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(dt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(dt=M.instanceColor));const bt={};bt.attribute=dt,dt&&dt.data&&(bt.data=dt.data),Y[V]=bt,X++}s.attributes=Y,s.attributesNum=X,s.index=G}function _(){const M=s.newAttributes;for(let I=0,O=M.length;I<O;I++)M[I]=0}function m(M){p(M,0)}function p(M,I){const O=s.newAttributes,G=s.enabledAttributes,Y=s.attributeDivisors;O[M]=1,G[M]===0&&(i.enableVertexAttribArray(M),G[M]=1),Y[M]!==I&&(i.vertexAttribDivisor(M,I),Y[M]=I)}function b(){const M=s.newAttributes,I=s.enabledAttributes;for(let O=0,G=I.length;O<G;O++)I[O]!==M[O]&&(i.disableVertexAttribArray(O),I[O]=0)}function w(M,I,O,G,Y,W,X){X===!0?i.vertexAttribIPointer(M,I,O,Y,W):i.vertexAttribPointer(M,I,O,G,Y,W)}function S(M,I,O,G){_();const Y=G.attributes,W=O.getAttributes(),X=I.defaultAttributeValues;for(const j in W){const V=W[j];if(V.location>=0){let st=Y[j];if(st===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(st=M.instanceColor)),st!==void 0){const dt=st.normalized,bt=st.itemSize,Ht=t.get(st);if(Ht===void 0)continue;const ce=Ht.buffer,de=Ht.type,Jt=Ht.bytesPerElement,$=de===i.INT||de===i.UNSIGNED_INT||st.gpuType===Sa;if(st.isInterleavedBufferAttribute){const J=st.data,gt=J.stride,Nt=st.offset;if(J.isInstancedInterleavedBuffer){for(let Tt=0;Tt<V.locationSize;Tt++)p(V.location+Tt,J.meshPerAttribute);M.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Tt=0;Tt<V.locationSize;Tt++)m(V.location+Tt);i.bindBuffer(i.ARRAY_BUFFER,ce);for(let Tt=0;Tt<V.locationSize;Tt++)w(V.location+Tt,bt/V.locationSize,de,dt,gt*Jt,(Nt+bt/V.locationSize*Tt)*Jt,$)}else{if(st.isInstancedBufferAttribute){for(let J=0;J<V.locationSize;J++)p(V.location+J,st.meshPerAttribute);M.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let J=0;J<V.locationSize;J++)m(V.location+J);i.bindBuffer(i.ARRAY_BUFFER,ce);for(let J=0;J<V.locationSize;J++)w(V.location+J,bt/V.locationSize,de,dt,bt*Jt,bt/V.locationSize*J*Jt,$)}}else if(X!==void 0){const dt=X[j];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(V.location,dt);break;case 3:i.vertexAttrib3fv(V.location,dt);break;case 4:i.vertexAttrib4fv(V.location,dt);break;default:i.vertexAttrib1fv(V.location,dt)}}}}b()}function R(){E();for(const M in n){const I=n[M];for(const O in I){const G=I[O];for(const Y in G)h(G[Y].object),delete G[Y];delete I[O]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;const I=n[M.id];for(const O in I){const G=I[O];for(const Y in G)h(G[Y].object),delete G[Y];delete I[O]}delete n[M.id]}function C(M){for(const I in n){const O=n[I];if(O[M.id]===void 0)continue;const G=O[M.id];for(const Y in G)h(G[Y].object),delete G[Y];delete O[M.id]}}function E(){v(),o=!0,s!==r&&(s=r,c(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:E,resetDefaultState:v,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function qp(i,t,e){let n;function r(c){n=c}function s(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Yp(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==pn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const E=C===Fr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==bn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Sn&&!E)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:w,maxFragmentUniforms:S,vertexTextures:R,maxSamples:A}}function $p(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new ci,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||r;return r=d,n=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):c();else{const b=s?0:n,w=b*4;let S=p.clippingState||null;l.value=S,S=h(g,d,w,f);for(let R=0;R!==w;++R)S[R]=e[R];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,S=f;w!==_;++w,S+=4)o.copy(u[w]).applyMatrix4(b,a),o.normal.toArray(m,S),m[S+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Kp(i){let t=new WeakMap;function e(o,a){return a===Lo?o.mapping=Xi:a===Uo&&(o.mapping=qi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Lo||a===Uo)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Bh(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",r),e(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const Hi=4,Ol=[.125,.215,.35,.446,.526,.582],di=20,fo=new Yc,Bl=new Wt;let po=null,mo=0,go=0,_o=!1;const ui=(1+Math.sqrt(5))/2,zi=1/ui,zl=[new U(-ui,zi,0),new U(ui,zi,0),new U(-zi,0,ui),new U(zi,0,ui),new U(0,ui,-zi),new U(0,ui,zi),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],jp=new U;class fa{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:o=256,position:a=jp}=s;po=this._renderer.getRenderTarget(),mo=this._renderer.getActiveCubeFace(),go=this._renderer.getActiveMipmapLevel(),_o=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,r,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(po,mo,go),this._renderer.xr.enabled=_o,t.scissorTest=!1,ds(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Xi||t.mapping===qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),po=this._renderer.getRenderTarget(),mo=this._renderer.getActiveCubeFace(),go=this._renderer.getActiveMipmapLevel(),_o=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:an,minFilter:an,generateMipmaps:!1,type:Fr,format:pn,colorSpace:Yi,depthBuffer:!1},r=Hl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hl(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zp(s)),this._blurMaterial=Jp(s,t,e)}return r}_compileMaterial(t){const e=new Zt(this._lodPlanes[0],t);this._renderer.compile(e,fo)}_sceneToCubeUV(t,e,n,r,s){const l=new He(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Bl),u.toneMapping=Kn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null));const _=new je({name:"PMREM.Background",side:Ve,depthWrite:!1,depthTest:!1}),m=new Zt(new un,_);let p=!1;const b=t.background;b?b.isColor&&(_.color.copy(b),t.background=null,p=!0):(_.color.copy(Bl),p=!0);for(let w=0;w<6;w++){const S=w%3;S===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[w],s.y,s.z)):S===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[w]));const R=this._cubeSize;ds(r,S*R,w>2?R:0,R,R),u.setRenderTarget(r),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Xi||t.mapping===qi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gl());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Zt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;ds(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,fo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=zl[(r-s-1)%zl.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Zt(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*di-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):di;m>di&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${di}`);const p=[];let b=0;for(let C=0;C<di;++C){const E=C/_,v=Math.exp(-E*E/2);p.push(v),C===0?b+=v:C<m&&(b+=2*v)}for(let C=0;C<p.length;C++)p[C]=p[C]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:w}=this;d.dTheta.value=g,d.mipInt.value=w-n;const S=this._sizeLods[r],R=3*S*(r>w-Hi?r-w+Hi:0),A=4*(this._cubeSize-S);ds(e,R,A,3*S,2*S),l.setRenderTarget(e),l.render(u,fo)}}function Zp(i){const t=[],e=[],n=[];let r=i;const s=i-Hi+1+Ol.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>i-Hi?l=Ol[o-i+Hi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,b=new Float32Array(_*g*f),w=new Float32Array(m*g*f),S=new Float32Array(p*g*f);for(let A=0;A<f;A++){const C=A%3*2/3-1,E=A>2?0:-1,v=[C,E,0,C+2/3,E,0,C+2/3,E+1,0,C,E,0,C+2/3,E+1,0,C,E+1,0];b.set(v,_*g*A),w.set(d,m*g*A);const M=[A,A,A,A,A,A];S.set(M,p*g*A)}const R=new Fe;R.setAttribute("position",new ke(b,_)),R.setAttribute("uv",new ke(w,m)),R.setAttribute("faceIndex",new ke(S,p)),t.push(R),r>Hi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Hl(i,t,e){const n=new gi(i,t,e);return n.texture.mapping=Is,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ds(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Jp(i,t,e){const n=new Float32Array(di),r=new U(0,1,0);return new Bn({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Oa(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Gl(){return new Bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oa(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Vl(){return new Bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Oa(){return`

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
	`}function Qp(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Lo||l===Uo,h=l===Xi||l===qi;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new fa(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&r(f)?(e===null&&(e=new fa(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function r(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function tm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&Pr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function em(i,t,e,n){const r={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const b=f.array;_=f.version;for(let w=0,S=b.length;w<S;w+=3){const R=b[w+0],A=b[w+1],C=b[w+2];d.push(R,A,A,C,C,R)}}else if(g!==void 0){const b=g.array;_=g.version;for(let w=0,S=b.length/3-1;w<S;w+=3){const R=w+0,A=w+1,C=w+2;d.push(R,A,A,C,C,R)}}else return;const m=new(Lc(d)?Fc:Nc)(d,1);m.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function nm(i,t,e){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,s,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*_[b];e.update(p,n,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function im(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function rm(i,t,e){const n=new WeakMap,r=new oe;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let M=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],b=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),_===!0&&(S=2),m===!0&&(S=3);let R=a.attributes.position.count*S,A=1;R>t.maxTextureSize&&(A=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const C=new Float32Array(R*A*4*u),E=new Uc(C,R,A,u);E.type=Sn,E.needsUpdate=!0;const v=S*4;for(let I=0;I<u;I++){const O=p[I],G=b[I],Y=w[I],W=R*A*4*I;for(let X=0;X<O.count;X++){const j=X*v;g===!0&&(r.fromBufferAttribute(O,X),C[W+j+0]=r.x,C[W+j+1]=r.y,C[W+j+2]=r.z,C[W+j+3]=0),_===!0&&(r.fromBufferAttribute(G,X),C[W+j+4]=r.x,C[W+j+5]=r.y,C[W+j+6]=r.z,C[W+j+7]=0),m===!0&&(r.fromBufferAttribute(Y,X),C[W+j+8]=r.x,C[W+j+9]=r.y,C[W+j+10]=r.z,C[W+j+11]=Y.itemSize===4?r.w:1)}}d={count:u,texture:E,size:new Ct(R,A)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function sm(i,t,e,n){let r=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(r.get(u)!==c&&(t.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return u}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}const Kc=new Pe,kl=new Wc(1,1),jc=new Uc,Zc=new Sh,Jc=new zc,Wl=[],Xl=[],ql=new Float32Array(16),Yl=new Float32Array(9),$l=new Float32Array(4);function rr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=Wl[r];if(s===void 0&&(s=new Float32Array(r),Wl[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function Te(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ls(i,t){let e=Xl[t];e===void 0&&(e=new Int32Array(t),Xl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function om(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function um(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;$l.set(n),i.uniformMatrix2fv(this.addr,!1,$l),Ae(e,n)}}function hm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Yl.set(n),i.uniformMatrix3fv(this.addr,!1,Yl),Ae(e,n)}}function dm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;ql.set(n),i.uniformMatrix4fv(this.addr,!1,ql),Ae(e,n)}}function fm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function pm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function _m(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function Mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function Sm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(kl.compareFunction=Ic,s=kl):s=Kc,e.setTexture2D(t||s,r)}function ym(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Zc,r)}function Em(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Jc,r)}function bm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||jc,r)}function wm(i){switch(i){case 5126:return om;case 35664:return am;case 35665:return lm;case 35666:return cm;case 35674:return um;case 35675:return hm;case 35676:return dm;case 5124:case 35670:return fm;case 35667:case 35671:return pm;case 35668:case 35672:return mm;case 35669:case 35673:return gm;case 5125:return _m;case 36294:return vm;case 36295:return xm;case 36296:return Mm;case 35678:case 36198:case 36298:case 36306:case 35682:return Sm;case 35679:case 36299:case 36307:return ym;case 35680:case 36300:case 36308:case 36293:return Em;case 36289:case 36303:case 36311:case 36292:return bm}}function Tm(i,t){i.uniform1fv(this.addr,t)}function Am(i,t){const e=rr(t,this.size,2);i.uniform2fv(this.addr,e)}function Rm(i,t){const e=rr(t,this.size,3);i.uniform3fv(this.addr,e)}function Cm(i,t){const e=rr(t,this.size,4);i.uniform4fv(this.addr,e)}function Pm(i,t){const e=rr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Im(i,t){const e=rr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Lm(i,t){const e=rr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Um(i,t){i.uniform1iv(this.addr,t)}function Dm(i,t){i.uniform2iv(this.addr,t)}function Nm(i,t){i.uniform3iv(this.addr,t)}function Fm(i,t){i.uniform4iv(this.addr,t)}function Om(i,t){i.uniform1uiv(this.addr,t)}function Bm(i,t){i.uniform2uiv(this.addr,t)}function zm(i,t){i.uniform3uiv(this.addr,t)}function Hm(i,t){i.uniform4uiv(this.addr,t)}function Gm(i,t,e){const n=this.cache,r=t.length,s=Ls(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Kc,s[o])}function Vm(i,t,e){const n=this.cache,r=t.length,s=Ls(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Zc,s[o])}function km(i,t,e){const n=this.cache,r=t.length,s=Ls(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Jc,s[o])}function Wm(i,t,e){const n=this.cache,r=t.length,s=Ls(e,r);Te(n,s)||(i.uniform1iv(this.addr,s),Ae(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||jc,s[o])}function Xm(i){switch(i){case 5126:return Tm;case 35664:return Am;case 35665:return Rm;case 35666:return Cm;case 35674:return Pm;case 35675:return Im;case 35676:return Lm;case 5124:case 35670:return Um;case 35667:case 35671:return Dm;case 35668:case 35672:return Nm;case 35669:case 35673:return Fm;case 5125:return Om;case 36294:return Bm;case 36295:return zm;case 36296:return Hm;case 35678:case 36198:case 36298:case 36306:case 35682:return Gm;case 35679:case 36299:case 36307:return Vm;case 35680:case 36300:case 36308:case 36293:return km;case 36289:case 36303:case 36311:case 36292:return Wm}}class qm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=wm(e.type)}}class Ym{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xm(e.type)}}class $m{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const vo=/(\w+)(\])?(\[|\.)?/g;function Kl(i,t){i.seq.push(t),i.map[t.id]=t}function Km(i,t,e){const n=i.name,r=n.length;for(vo.lastIndex=0;;){const s=vo.exec(n),o=vo.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Kl(e,c===void 0?new qm(a,i,t):new Ym(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new $m(a),Kl(e,u)),e=u}}}class vs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Km(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function jl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const jm=37297;let Zm=0;function Jm(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Zl=new zt;function Qm(i){jt._getMatrix(Zl,jt.workingColorSpace,i);const t=`mat3( ${Zl.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(i)){case ys:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Jl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Jm(i.getShaderSource(t),a)}else return s}function tg(i,t){const e=Qm(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function eg(i,t){let e;switch(t){case ju:e="Linear";break;case Zu:e="Reinhard";break;case Ju:e="Cineon";break;case yc:e="ACESFilmic";break;case th:e="AgX";break;case eh:e="Neutral";break;case Qu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const fs=new U;function ng(){jt.getLuminanceCoefficients(fs);const i=fs.x.toFixed(4),t=fs.y.toFixed(4),e=fs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ig(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function rg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function sg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function vr(i){return i!==""}function Ql(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function tc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const og=/^[ \t]*#include +<([\w\d./]+)>/gm;function pa(i){return i.replace(og,lg)}const ag=new Map;function lg(i,t){let e=Vt[t];if(e===void 0){const n=ag.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return pa(e)}const cg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ec(i){return i.replace(cg,ug)}function ug(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function nc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function hg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===xc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Mc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ln&&(t="SHADOWMAP_TYPE_VSM"),t}function dg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Xi:case qi:t="ENVMAP_TYPE_CUBE";break;case Is:t="ENVMAP_TYPE_CUBE_UV";break}return t}function fg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case qi:t="ENVMAP_MODE_REFRACTION";break}return t}function pg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Sc:t="ENVMAP_BLENDING_MULTIPLY";break;case $u:t="ENVMAP_BLENDING_MIX";break;case Ku:t="ENVMAP_BLENDING_ADD";break}return t}function mg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function gg(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=hg(e),c=dg(e),h=fg(e),u=pg(e),d=mg(e),f=ig(e),g=rg(s),_=r.createProgram();let m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(vr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(vr).join(`
`),p.length>0&&(p+=`
`)):(m=[nc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),p=[nc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Kn?"#define TONE_MAPPING":"",e.toneMapping!==Kn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Kn?eg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,tg("linearToOutputTexel",e.outputColorSpace),ng(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vr).join(`
`)),o=pa(o),o=Ql(o,e),o=tc(o,e),a=pa(a),a=Ql(a,e),a=tc(a,e),o=ec(o),a=ec(a),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===rl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===rl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=b+m+o,S=b+p+a,R=jl(r,r.VERTEX_SHADER,w),A=jl(r,r.FRAGMENT_SHADER,S);r.attachShader(_,R),r.attachShader(_,A),e.index0AttributeName!==void 0?r.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(I){if(i.debug.checkShaderErrors){const O=r.getProgramInfoLog(_)||"",G=r.getShaderInfoLog(R)||"",Y=r.getShaderInfoLog(A)||"",W=O.trim(),X=G.trim(),j=Y.trim();let V=!0,st=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,R,A);else{const dt=Jl(r,R,"vertex"),bt=Jl(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+W+`
`+dt+`
`+bt)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(X===""||j==="")&&(st=!1);st&&(I.diagnostics={runnable:V,programLog:W,vertexShader:{log:X,prefix:m},fragmentShader:{log:j,prefix:p}})}r.deleteShader(R),r.deleteShader(A),E=new vs(r,_),v=sg(r,_)}let E;this.getUniforms=function(){return E===void 0&&C(this),E};let v;this.getAttributes=function(){return v===void 0&&C(this),v};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,jm)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Zm++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}let _g=0;class vg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new xg(t),e.set(t,n)),n}}class xg{constructor(t){this.id=_g++,this.code=t,this.usedTimes=0}}function Mg(i,t,e,n,r,s,o){const a=new Ia,l=new vg,c=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,M,I,O,G){const Y=O.fog,W=G.geometry,X=v.isMeshStandardMaterial?O.environment:null,j=(v.isMeshStandardMaterial?e:t).get(v.envMap||X),V=j&&j.mapping===Is?j.image.height:null,st=g[v.type];v.precision!==null&&(f=r.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const dt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,bt=dt!==void 0?dt.length:0;let Ht=0;W.morphAttributes.position!==void 0&&(Ht=1),W.morphAttributes.normal!==void 0&&(Ht=2),W.morphAttributes.color!==void 0&&(Ht=3);let ce,de,Jt,$;if(st){const Qt=_n[st];ce=Qt.vertexShader,de=Qt.fragmentShader}else ce=v.vertexShader,de=v.fragmentShader,l.update(v),Jt=l.getVertexShaderID(v),$=l.getFragmentShaderID(v);const J=i.getRenderTarget(),gt=i.state.buffers.depth.getReversed(),Nt=G.isInstancedMesh===!0,Tt=G.isBatchedMesh===!0,Yt=!!v.map,Ie=!!v.matcap,P=!!j,fe=!!v.aoMap,Ot=!!v.lightMap,Ut=!!v.bumpMap,xt=!!v.normalMap,pe=!!v.displacementMap,Mt=!!v.emissiveMap,Gt=!!v.metalnessMap,Re=!!v.roughnessMap,xe=v.anisotropy>0,T=v.clearcoat>0,x=v.dispersion>0,B=v.iridescence>0,q=v.sheen>0,Z=v.transmission>0,k=xe&&!!v.anisotropyMap,wt=T&&!!v.clearcoatMap,it=T&&!!v.clearcoatNormalMap,St=T&&!!v.clearcoatRoughnessMap,yt=B&&!!v.iridescenceMap,et=B&&!!v.iridescenceThicknessMap,ut=q&&!!v.sheenColorMap,It=q&&!!v.sheenRoughnessMap,Et=!!v.specularMap,lt=!!v.specularColorMap,Bt=!!v.specularIntensityMap,L=Z&&!!v.transmissionMap,nt=Z&&!!v.thicknessMap,rt=!!v.gradientMap,mt=!!v.alphaMap,Q=v.alphaTest>0,K=!!v.alphaHash,vt=!!v.extensions;let Ft=Kn;v.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Ft=i.toneMapping);const ue={shaderID:st,shaderType:v.type,shaderName:v.name,vertexShader:ce,fragmentShader:de,defines:v.defines,customVertexShaderID:Jt,customFragmentShaderID:$,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:Tt,batchingColor:Tt&&G._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&G.instanceColor!==null,instancingMorph:Nt&&G.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Yi,alphaToCoverage:!!v.alphaToCoverage,map:Yt,matcap:Ie,envMap:P,envMapMode:P&&j.mapping,envMapCubeUVHeight:V,aoMap:fe,lightMap:Ot,bumpMap:Ut,normalMap:xt,displacementMap:d&&pe,emissiveMap:Mt,normalMapObjectSpace:xt&&v.normalMapType===sh,normalMapTangentSpace:xt&&v.normalMapType===Ra,metalnessMap:Gt,roughnessMap:Re,anisotropy:xe,anisotropyMap:k,clearcoat:T,clearcoatMap:wt,clearcoatNormalMap:it,clearcoatRoughnessMap:St,dispersion:x,iridescence:B,iridescenceMap:yt,iridescenceThicknessMap:et,sheen:q,sheenColorMap:ut,sheenRoughnessMap:It,specularMap:Et,specularColorMap:lt,specularIntensityMap:Bt,transmission:Z,transmissionMap:L,thicknessMap:nt,gradientMap:rt,opaque:v.transparent===!1&&v.blending===Gi&&v.alphaToCoverage===!1,alphaMap:mt,alphaTest:Q,alphaHash:K,combine:v.combine,mapUv:Yt&&_(v.map.channel),aoMapUv:fe&&_(v.aoMap.channel),lightMapUv:Ot&&_(v.lightMap.channel),bumpMapUv:Ut&&_(v.bumpMap.channel),normalMapUv:xt&&_(v.normalMap.channel),displacementMapUv:pe&&_(v.displacementMap.channel),emissiveMapUv:Mt&&_(v.emissiveMap.channel),metalnessMapUv:Gt&&_(v.metalnessMap.channel),roughnessMapUv:Re&&_(v.roughnessMap.channel),anisotropyMapUv:k&&_(v.anisotropyMap.channel),clearcoatMapUv:wt&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:it&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:et&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:ut&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:It&&_(v.sheenRoughnessMap.channel),specularMapUv:Et&&_(v.specularMap.channel),specularColorMapUv:lt&&_(v.specularColorMap.channel),specularIntensityMapUv:Bt&&_(v.specularIntensityMap.channel),transmissionMapUv:L&&_(v.transmissionMap.channel),thicknessMapUv:nt&&_(v.thicknessMap.channel),alphaMapUv:mt&&_(v.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(xt||xe),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!W.attributes.uv&&(Yt||mt),fog:!!Y,useFog:v.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:gt,skinning:G.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:bt,morphTextureStride:Ht,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ft,decodeVideoTexture:Yt&&v.map.isVideoTexture===!0&&jt.getTransfer(v.map.colorSpace)===re,decodeVideoTextureEmissive:Mt&&v.emissiveMap.isVideoTexture===!0&&jt.getTransfer(v.emissiveMap.colorSpace)===re,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===sn,flipSided:v.side===Ve,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:vt&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&v.extensions.multiDraw===!0||Tt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ue.vertexUv1s=c.has(1),ue.vertexUv2s=c.has(2),ue.vertexUv3s=c.has(3),c.clear(),ue}function p(v){const M=[];if(v.shaderID?M.push(v.shaderID):(M.push(v.customVertexShaderID),M.push(v.customFragmentShaderID)),v.defines!==void 0)for(const I in v.defines)M.push(I),M.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(b(M,v),w(M,v),M.push(i.outputColorSpace)),M.push(v.customProgramCacheKey),M.join()}function b(v,M){v.push(M.precision),v.push(M.outputColorSpace),v.push(M.envMapMode),v.push(M.envMapCubeUVHeight),v.push(M.mapUv),v.push(M.alphaMapUv),v.push(M.lightMapUv),v.push(M.aoMapUv),v.push(M.bumpMapUv),v.push(M.normalMapUv),v.push(M.displacementMapUv),v.push(M.emissiveMapUv),v.push(M.metalnessMapUv),v.push(M.roughnessMapUv),v.push(M.anisotropyMapUv),v.push(M.clearcoatMapUv),v.push(M.clearcoatNormalMapUv),v.push(M.clearcoatRoughnessMapUv),v.push(M.iridescenceMapUv),v.push(M.iridescenceThicknessMapUv),v.push(M.sheenColorMapUv),v.push(M.sheenRoughnessMapUv),v.push(M.specularMapUv),v.push(M.specularColorMapUv),v.push(M.specularIntensityMapUv),v.push(M.transmissionMapUv),v.push(M.thicknessMapUv),v.push(M.combine),v.push(M.fogExp2),v.push(M.sizeAttenuation),v.push(M.morphTargetsCount),v.push(M.morphAttributeCount),v.push(M.numDirLights),v.push(M.numPointLights),v.push(M.numSpotLights),v.push(M.numSpotLightMaps),v.push(M.numHemiLights),v.push(M.numRectAreaLights),v.push(M.numDirLightShadows),v.push(M.numPointLightShadows),v.push(M.numSpotLightShadows),v.push(M.numSpotLightShadowsWithMaps),v.push(M.numLightProbes),v.push(M.shadowMapType),v.push(M.toneMapping),v.push(M.numClippingPlanes),v.push(M.numClipIntersection),v.push(M.depthPacking)}function w(v,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),v.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),v.push(a.mask)}function S(v){const M=g[v.type];let I;if(M){const O=_n[M];I=Dh.clone(O.uniforms)}else I=v.uniforms;return I}function R(v,M){let I;for(let O=0,G=h.length;O<G;O++){const Y=h[O];if(Y.cacheKey===M){I=Y,++I.usedTimes;break}}return I===void 0&&(I=new gg(i,M,v,s),h.push(I)),I}function A(v){if(--v.usedTimes===0){const M=h.indexOf(v);h[M]=h[h.length-1],h.pop(),v.destroy()}}function C(v){l.remove(v)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:R,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:E}}function Sg(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,l){i.get(o)[a]=l}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function yg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ic(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function rc(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||yg),n.length>1&&n.sort(d||ic),r.length>1&&r.sort(d||ic)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:h,sort:c}}function Eg(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new rc,i.set(n,[o])):r>=s.length?(o=new rc,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function bg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new Wt};break;case"SpotLight":e={position:new U,direction:new U,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function wg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Tg=0;function Ag(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Rg(i){const t=new bg,e=wg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);const r=new U,s=new ee,o=new ee;function a(c){let h=0,u=0,d=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,w=0,S=0,R=0,A=0,C=0;c.sort(Ag);for(let v=0,M=c.length;v<M;v++){const I=c[v],O=I.color,G=I.intensity,Y=I.distance,W=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=O.r*G,u+=O.g*G,d+=O.b*G;else if(I.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(I.sh.coefficients[X],G);C++}else if(I.isDirectionalLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const j=I.shadow,V=e.get(I);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=I.shadow.matrix,b++}n.directional[f]=X,f++}else if(I.isSpotLight){const X=t.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(O).multiplyScalar(G),X.distance=Y,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,n.spot[_]=X;const j=I.shadow;if(I.map&&(n.spotLightMap[R]=I.map,R++,j.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[_]=j.matrix,I.castShadow){const V=e.get(I);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=W,S++}_++}else if(I.isRectAreaLight){const X=t.get(I);X.color.copy(O).multiplyScalar(G),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=X,m++}else if(I.isPointLight){const X=t.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity),X.distance=I.distance,X.decay=I.decay,I.castShadow){const j=I.shadow,V=e.get(I);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,V.shadowCameraNear=j.camera.near,V.shadowCameraFar=j.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=I.shadow.matrix,w++}n.point[g]=X,g++}else if(I.isHemisphereLight){const X=t.get(I);X.skyColor.copy(I.color).multiplyScalar(G),X.groundColor.copy(I.groundColor).multiplyScalar(G),n.hemi[p]=X,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const E=n.hash;(E.directionalLength!==f||E.pointLength!==g||E.spotLength!==_||E.rectAreaLength!==m||E.hemiLength!==p||E.numDirectionalShadows!==b||E.numPointShadows!==w||E.numSpotShadows!==S||E.numSpotMaps!==R||E.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=S+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,E.directionalLength=f,E.pointLength=g,E.spotLength=_,E.rectAreaLength=m,E.hemiLength=p,E.numDirectionalShadows=b,E.numPointShadows=w,E.numSpotShadows=S,E.numSpotMaps=R,E.numLightProbes=C,n.version=Tg++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const w=c[p];if(w.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),u++}else if(w.isSpotLight){const S=n.spot[f];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(m),o.identity(),s.copy(w.matrixWorld),s.premultiply(m),o.extractRotation(s),S.halfWidth.set(w.width*.5,0,0),S.halfHeight.set(0,w.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(w.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(w.matrixWorld),S.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(w.matrixWorld),S.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function sc(i){const t=new Rg(i),e=[],n=[];function r(h){c.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function Cg(i){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new sc(i),t.set(r,[a])):s>=o.length?(a=new sc(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const Pg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ig=`uniform sampler2D shadow_pass;
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
}`;function Lg(i,t,e){let n=new La;const r=new Ct,s=new Ct,o=new oe,a=new Kh({depthPacking:rh}),l=new jh,c={},h=e.maxTextureSize,u={[Qn]:Ve,[Ve]:Qn,[sn]:sn},d=new Bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:Pg,fragmentShader:Ig}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Fe;g.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Zt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xc;let p=this.type;this.render=function(A,C,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const v=i.getRenderTarget(),M=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),O=i.state;O.setBlending($n),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const G=p!==Ln&&this.type===Ln,Y=p===Ln&&this.type!==Ln;for(let W=0,X=A.length;W<X;W++){const j=A[W],V=j.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const st=V.getFrameExtents();if(r.multiply(st),s.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/st.x),r.x=s.x*st.x,V.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/st.y),r.y=s.y*st.y,V.mapSize.y=s.y)),V.map===null||G===!0||Y===!0){const bt=this.type!==Ln?{minFilter:Ke,magFilter:Ke}:{};V.map!==null&&V.map.dispose(),V.map=new gi(r.x,r.y,bt),V.map.texture.name=j.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const dt=V.getViewportCount();for(let bt=0;bt<dt;bt++){const Ht=V.getViewport(bt);o.set(s.x*Ht.x,s.y*Ht.y,s.x*Ht.z,s.y*Ht.w),O.viewport(o),V.updateMatrices(j,bt),n=V.getFrustum(),S(C,E,V.camera,j,this.type)}V.isPointLightShadow!==!0&&this.type===Ln&&b(V,E),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(v,M,I)};function b(A,C){const E=t.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new gi(r.x,r.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,E,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,E,f,_,null)}function w(A,C,E,v){let M=null;const I=E.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)M=I;else if(M=E.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const O=M.uuid,G=C.uuid;let Y=c[O];Y===void 0&&(Y={},c[O]=Y);let W=Y[G];W===void 0&&(W=M.clone(),Y[G]=W,C.addEventListener("dispose",R)),M=W}if(M.visible=C.visible,M.wireframe=C.wireframe,v===Ln?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:u[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,E.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const O=i.properties.get(M);O.light=E}return M}function S(A,C,E,v,M){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===Ln)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,A.matrixWorld);const G=t.update(A),Y=A.material;if(Array.isArray(Y)){const W=G.groups;for(let X=0,j=W.length;X<j;X++){const V=W[X],st=Y[V.materialIndex];if(st&&st.visible){const dt=w(A,st,v,M);A.onBeforeShadow(i,A,C,E,G,dt,V),i.renderBufferDirect(E,null,G,dt,A,V),A.onAfterShadow(i,A,C,E,G,dt,V)}}}else if(Y.visible){const W=w(A,Y,v,M);A.onBeforeShadow(i,A,C,E,G,W,null),i.renderBufferDirect(E,null,G,W,A,null),A.onAfterShadow(i,A,C,E,G,W,null)}}const O=A.children;for(let G=0,Y=O.length;G<Y;G++)S(O[G],C,E,v,M)}function R(A){A.target.removeEventListener("dispose",R);for(const E in c){const v=c[E],M=A.target.uuid;M in v&&(v[M].dispose(),delete v[M])}}}const Ug={[wo]:To,[Ao]:Po,[Ro]:Io,[Wi]:Co,[To]:wo,[Po]:Ao,[Io]:Ro,[Co]:Wi};function Dg(i,t){function e(){let L=!1;const nt=new oe;let rt=null;const mt=new oe(0,0,0,0);return{setMask:function(Q){rt!==Q&&!L&&(i.colorMask(Q,Q,Q,Q),rt=Q)},setLocked:function(Q){L=Q},setClear:function(Q,K,vt,Ft,ue){ue===!0&&(Q*=Ft,K*=Ft,vt*=Ft),nt.set(Q,K,vt,Ft),mt.equals(nt)===!1&&(i.clearColor(Q,K,vt,Ft),mt.copy(nt))},reset:function(){L=!1,rt=null,mt.set(-1,0,0,0)}}}function n(){let L=!1,nt=!1,rt=null,mt=null,Q=null;return{setReversed:function(K){if(nt!==K){const vt=t.get("EXT_clip_control");K?vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.ZERO_TO_ONE_EXT):vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.NEGATIVE_ONE_TO_ONE_EXT),nt=K;const Ft=Q;Q=null,this.setClear(Ft)}},getReversed:function(){return nt},setTest:function(K){K?J(i.DEPTH_TEST):gt(i.DEPTH_TEST)},setMask:function(K){rt!==K&&!L&&(i.depthMask(K),rt=K)},setFunc:function(K){if(nt&&(K=Ug[K]),mt!==K){switch(K){case wo:i.depthFunc(i.NEVER);break;case To:i.depthFunc(i.ALWAYS);break;case Ao:i.depthFunc(i.LESS);break;case Wi:i.depthFunc(i.LEQUAL);break;case Ro:i.depthFunc(i.EQUAL);break;case Co:i.depthFunc(i.GEQUAL);break;case Po:i.depthFunc(i.GREATER);break;case Io:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}mt=K}},setLocked:function(K){L=K},setClear:function(K){Q!==K&&(nt&&(K=1-K),i.clearDepth(K),Q=K)},reset:function(){L=!1,rt=null,mt=null,Q=null,nt=!1}}}function r(){let L=!1,nt=null,rt=null,mt=null,Q=null,K=null,vt=null,Ft=null,ue=null;return{setTest:function(Qt){L||(Qt?J(i.STENCIL_TEST):gt(i.STENCIL_TEST))},setMask:function(Qt){nt!==Qt&&!L&&(i.stencilMask(Qt),nt=Qt)},setFunc:function(Qt,Tn,mn){(rt!==Qt||mt!==Tn||Q!==mn)&&(i.stencilFunc(Qt,Tn,mn),rt=Qt,mt=Tn,Q=mn)},setOp:function(Qt,Tn,mn){(K!==Qt||vt!==Tn||Ft!==mn)&&(i.stencilOp(Qt,Tn,mn),K=Qt,vt=Tn,Ft=mn)},setLocked:function(Qt){L=Qt},setClear:function(Qt){ue!==Qt&&(i.clearStencil(Qt),ue=Qt)},reset:function(){L=!1,nt=null,rt=null,mt=null,Q=null,K=null,vt=null,Ft=null,ue=null}}}const s=new e,o=new n,a=new r,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,w=null,S=null,R=null,A=null,C=new Wt(0,0,0),E=0,v=!1,M=null,I=null,O=null,G=null,Y=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,j=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(V)[1]),X=j>=1):V.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),X=j>=2);let st=null,dt={};const bt=i.getParameter(i.SCISSOR_BOX),Ht=i.getParameter(i.VIEWPORT),ce=new oe().fromArray(bt),de=new oe().fromArray(Ht);function Jt(L,nt,rt,mt){const Q=new Uint8Array(4),K=i.createTexture();i.bindTexture(L,K),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let vt=0;vt<rt;vt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(nt,0,i.RGBA,1,1,mt,0,i.RGBA,i.UNSIGNED_BYTE,Q):i.texImage2D(nt+vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Q);return K}const $={};$[i.TEXTURE_2D]=Jt(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Jt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Jt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Jt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(i.DEPTH_TEST),o.setFunc(Wi),Ut(!1),xt(tl),J(i.CULL_FACE),fe($n);function J(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function gt(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Nt(L,nt){return u[L]!==nt?(i.bindFramebuffer(L,nt),u[L]=nt,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=nt),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=nt),!0):!1}function Tt(L,nt){let rt=f,mt=!1;if(L){rt=d.get(nt),rt===void 0&&(rt=[],d.set(nt,rt));const Q=L.textures;if(rt.length!==Q.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let K=0,vt=Q.length;K<vt;K++)rt[K]=i.COLOR_ATTACHMENT0+K;rt.length=Q.length,mt=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,mt=!0);mt&&i.drawBuffers(rt)}function Yt(L){return g!==L?(i.useProgram(L),g=L,!0):!1}const Ie={[hi]:i.FUNC_ADD,[Iu]:i.FUNC_SUBTRACT,[Lu]:i.FUNC_REVERSE_SUBTRACT};Ie[Uu]=i.MIN,Ie[Du]=i.MAX;const P={[Nu]:i.ZERO,[Fu]:i.ONE,[Ou]:i.SRC_COLOR,[Eo]:i.SRC_ALPHA,[ku]:i.SRC_ALPHA_SATURATE,[Gu]:i.DST_COLOR,[zu]:i.DST_ALPHA,[Bu]:i.ONE_MINUS_SRC_COLOR,[bo]:i.ONE_MINUS_SRC_ALPHA,[Vu]:i.ONE_MINUS_DST_COLOR,[Hu]:i.ONE_MINUS_DST_ALPHA,[Wu]:i.CONSTANT_COLOR,[Xu]:i.ONE_MINUS_CONSTANT_COLOR,[qu]:i.CONSTANT_ALPHA,[Yu]:i.ONE_MINUS_CONSTANT_ALPHA};function fe(L,nt,rt,mt,Q,K,vt,Ft,ue,Qt){if(L===$n){_===!0&&(gt(i.BLEND),_=!1);return}if(_===!1&&(J(i.BLEND),_=!0),L!==Pu){if(L!==m||Qt!==v){if((p!==hi||S!==hi)&&(i.blendEquation(i.FUNC_ADD),p=hi,S=hi),Qt)switch(L){case Gi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Fn:i.blendFunc(i.ONE,i.ONE);break;case el:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Fn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case el:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case nl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}b=null,w=null,R=null,A=null,C.set(0,0,0),E=0,m=L,v=Qt}return}Q=Q||nt,K=K||rt,vt=vt||mt,(nt!==p||Q!==S)&&(i.blendEquationSeparate(Ie[nt],Ie[Q]),p=nt,S=Q),(rt!==b||mt!==w||K!==R||vt!==A)&&(i.blendFuncSeparate(P[rt],P[mt],P[K],P[vt]),b=rt,w=mt,R=K,A=vt),(Ft.equals(C)===!1||ue!==E)&&(i.blendColor(Ft.r,Ft.g,Ft.b,ue),C.copy(Ft),E=ue),m=L,v=!1}function Ot(L,nt){L.side===sn?gt(i.CULL_FACE):J(i.CULL_FACE);let rt=L.side===Ve;nt&&(rt=!rt),Ut(rt),L.blending===Gi&&L.transparent===!1?fe($n):fe(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),s.setMask(L.colorWrite);const mt=L.stencilWrite;a.setTest(mt),mt&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Mt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(i.SAMPLE_ALPHA_TO_COVERAGE):gt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ut(L){M!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),M=L)}function xt(L){L!==Ru?(J(i.CULL_FACE),L!==I&&(L===tl?i.cullFace(i.BACK):L===Cu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):gt(i.CULL_FACE),I=L}function pe(L){L!==O&&(X&&i.lineWidth(L),O=L)}function Mt(L,nt,rt){L?(J(i.POLYGON_OFFSET_FILL),(G!==nt||Y!==rt)&&(i.polygonOffset(nt,rt),G=nt,Y=rt)):gt(i.POLYGON_OFFSET_FILL)}function Gt(L){L?J(i.SCISSOR_TEST):gt(i.SCISSOR_TEST)}function Re(L){L===void 0&&(L=i.TEXTURE0+W-1),st!==L&&(i.activeTexture(L),st=L)}function xe(L,nt,rt){rt===void 0&&(st===null?rt=i.TEXTURE0+W-1:rt=st);let mt=dt[rt];mt===void 0&&(mt={type:void 0,texture:void 0},dt[rt]=mt),(mt.type!==L||mt.texture!==nt)&&(st!==rt&&(i.activeTexture(rt),st=rt),i.bindTexture(L,nt||$[L]),mt.type=L,mt.texture=nt)}function T(){const L=dt[st];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function B(){try{i.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{i.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function k(){try{i.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function wt(){try{i.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function it(){try{i.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function St(){try{i.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function yt(){try{i.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function et(){try{i.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ut(L){ce.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),ce.copy(L))}function It(L){de.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),de.copy(L))}function Et(L,nt){let rt=c.get(nt);rt===void 0&&(rt=new WeakMap,c.set(nt,rt));let mt=rt.get(L);mt===void 0&&(mt=i.getUniformBlockIndex(nt,L.name),rt.set(L,mt))}function lt(L,nt){const mt=c.get(nt).get(L);l.get(nt)!==mt&&(i.uniformBlockBinding(nt,mt,L.__bindingPointIndex),l.set(nt,mt))}function Bt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},st=null,dt={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,w=null,S=null,R=null,A=null,C=new Wt(0,0,0),E=0,v=!1,M=null,I=null,O=null,G=null,Y=null,ce.set(0,0,i.canvas.width,i.canvas.height),de.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:J,disable:gt,bindFramebuffer:Nt,drawBuffers:Tt,useProgram:Yt,setBlending:fe,setMaterial:Ot,setFlipSided:Ut,setCullFace:xt,setLineWidth:pe,setPolygonOffset:Mt,setScissorTest:Gt,activeTexture:Re,bindTexture:xe,unbindTexture:T,compressedTexImage2D:x,compressedTexImage3D:B,texImage2D:yt,texImage3D:et,updateUBOMapping:Et,uniformBlockBinding:lt,texStorage2D:it,texStorage3D:St,texSubImage2D:q,texSubImage3D:Z,compressedTexSubImage2D:k,compressedTexSubImage3D:wt,scissor:ut,viewport:It,reset:Bt}}function Ng(i,t,e,n,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ct,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,x){return f?new OffscreenCanvas(T,x):Cr("canvas")}function _(T,x,B){let q=1;const Z=xe(T);if((Z.width>B||Z.height>B)&&(q=B/Math.max(Z.width,Z.height)),q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const k=Math.floor(q*Z.width),wt=Math.floor(q*Z.height);u===void 0&&(u=g(k,wt));const it=x?g(k,wt):u;return it.width=k,it.height=wt,it.getContext("2d").drawImage(T,0,0,k,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+k+"x"+wt+")."),it}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(T,x,B,q,Z=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let k=x;if(x===i.RED&&(B===i.FLOAT&&(k=i.R32F),B===i.HALF_FLOAT&&(k=i.R16F),B===i.UNSIGNED_BYTE&&(k=i.R8)),x===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(k=i.R8UI),B===i.UNSIGNED_SHORT&&(k=i.R16UI),B===i.UNSIGNED_INT&&(k=i.R32UI),B===i.BYTE&&(k=i.R8I),B===i.SHORT&&(k=i.R16I),B===i.INT&&(k=i.R32I)),x===i.RG&&(B===i.FLOAT&&(k=i.RG32F),B===i.HALF_FLOAT&&(k=i.RG16F),B===i.UNSIGNED_BYTE&&(k=i.RG8)),x===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(k=i.RG8UI),B===i.UNSIGNED_SHORT&&(k=i.RG16UI),B===i.UNSIGNED_INT&&(k=i.RG32UI),B===i.BYTE&&(k=i.RG8I),B===i.SHORT&&(k=i.RG16I),B===i.INT&&(k=i.RG32I)),x===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(k=i.RGB8UI),B===i.UNSIGNED_SHORT&&(k=i.RGB16UI),B===i.UNSIGNED_INT&&(k=i.RGB32UI),B===i.BYTE&&(k=i.RGB8I),B===i.SHORT&&(k=i.RGB16I),B===i.INT&&(k=i.RGB32I)),x===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(k=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(k=i.RGBA16UI),B===i.UNSIGNED_INT&&(k=i.RGBA32UI),B===i.BYTE&&(k=i.RGBA8I),B===i.SHORT&&(k=i.RGBA16I),B===i.INT&&(k=i.RGBA32I)),x===i.RGB&&(B===i.UNSIGNED_INT_5_9_9_9_REV&&(k=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(k=i.R11F_G11F_B10F)),x===i.RGBA){const wt=Z?ys:jt.getTransfer(q);B===i.FLOAT&&(k=i.RGBA32F),B===i.HALF_FLOAT&&(k=i.RGBA16F),B===i.UNSIGNED_BYTE&&(k=wt===re?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(k=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(k=i.RGB5_A1)}return(k===i.R16F||k===i.R32F||k===i.RG16F||k===i.RG32F||k===i.RGBA16F||k===i.RGBA32F)&&t.get("EXT_color_buffer_float"),k}function S(T,x){let B;return T?x===null||x===mi||x===Tr?B=i.DEPTH24_STENCIL8:x===Sn?B=i.DEPTH32F_STENCIL8:x===wr&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===mi||x===Tr?B=i.DEPTH_COMPONENT24:x===Sn?B=i.DEPTH_COMPONENT32F:x===wr&&(B=i.DEPTH_COMPONENT16),B}function R(T,x){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ke&&T.minFilter!==an?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function A(T){const x=T.target;x.removeEventListener("dispose",A),E(x),x.isVideoTexture&&h.delete(x)}function C(T){const x=T.target;x.removeEventListener("dispose",C),M(x)}function E(T){const x=n.get(T);if(x.__webglInit===void 0)return;const B=T.source,q=d.get(B);if(q){const Z=q[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&v(T),Object.keys(q).length===0&&d.delete(B)}n.remove(T)}function v(T){const x=n.get(T);i.deleteTexture(x.__webglTexture);const B=T.source,q=d.get(B);delete q[x.__cacheKey],o.memory.textures--}function M(T){const x=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(x.__webglFramebuffer[q]))for(let Z=0;Z<x.__webglFramebuffer[q].length;Z++)i.deleteFramebuffer(x.__webglFramebuffer[q][Z]);else i.deleteFramebuffer(x.__webglFramebuffer[q]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[q])}else{if(Array.isArray(x.__webglFramebuffer))for(let q=0;q<x.__webglFramebuffer.length;q++)i.deleteFramebuffer(x.__webglFramebuffer[q]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let q=0;q<x.__webglColorRenderbuffer.length;q++)x.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[q]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const B=T.textures;for(let q=0,Z=B.length;q<Z;q++){const k=n.get(B[q]);k.__webglTexture&&(i.deleteTexture(k.__webglTexture),o.memory.textures--),n.remove(B[q])}n.remove(T)}let I=0;function O(){I=0}function G(){const T=I;return T>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),I+=1,T}function Y(T){const x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function W(T,x){const B=n.get(T);if(T.isVideoTexture&&Gt(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&B.__version!==T.version){const q=T.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(B,T,x);return}}else T.isExternalTexture&&(B.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+x)}function X(T,x){const B=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){$(B,T,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+x)}function j(T,x){const B=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){$(B,T,x);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+x)}function V(T,x){const B=n.get(T);if(T.version>0&&B.__version!==T.version){J(B,T,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+x)}const st={[br]:i.REPEAT,[Dn]:i.CLAMP_TO_EDGE,[Do]:i.MIRRORED_REPEAT},dt={[Ke]:i.NEAREST,[nh]:i.NEAREST_MIPMAP_NEAREST,[Gr]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[Os]:i.LINEAR_MIPMAP_NEAREST,[Nn]:i.LINEAR_MIPMAP_LINEAR},bt={[oh]:i.NEVER,[dh]:i.ALWAYS,[ah]:i.LESS,[Ic]:i.LEQUAL,[lh]:i.EQUAL,[hh]:i.GEQUAL,[ch]:i.GREATER,[uh]:i.NOTEQUAL};function Ht(T,x){if(x.type===Sn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===an||x.magFilter===Os||x.magFilter===Gr||x.magFilter===Nn||x.minFilter===an||x.minFilter===Os||x.minFilter===Gr||x.minFilter===Nn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,st[x.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,st[x.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,st[x.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,dt[x.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,dt[x.minFilter]),x.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,bt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ke||x.minFilter!==Gr&&x.minFilter!==Nn||x.type===Sn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function ce(T,x){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",A));const q=x.source;let Z=d.get(q);Z===void 0&&(Z={},d.set(q,Z));const k=Y(x);if(k!==T.__cacheKey){Z[k]===void 0&&(Z[k]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Z[k].usedTimes++;const wt=Z[T.__cacheKey];wt!==void 0&&(Z[T.__cacheKey].usedTimes--,wt.usedTimes===0&&v(x)),T.__cacheKey=k,T.__webglTexture=Z[k].texture}return B}function de(T,x,B){return Math.floor(Math.floor(T/B)/x)}function Jt(T,x,B,q){const k=T.updateRanges;if(k.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,B,q,x.data);else{k.sort((et,ut)=>et.start-ut.start);let wt=0;for(let et=1;et<k.length;et++){const ut=k[wt],It=k[et],Et=ut.start+ut.count,lt=de(It.start,x.width,4),Bt=de(ut.start,x.width,4);It.start<=Et+1&&lt===Bt&&de(It.start+It.count-1,x.width,4)===lt?ut.count=Math.max(ut.count,It.start+It.count-ut.start):(++wt,k[wt]=It)}k.length=wt+1;const it=i.getParameter(i.UNPACK_ROW_LENGTH),St=i.getParameter(i.UNPACK_SKIP_PIXELS),yt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let et=0,ut=k.length;et<ut;et++){const It=k[et],Et=Math.floor(It.start/4),lt=Math.ceil(It.count/4),Bt=Et%x.width,L=Math.floor(Et/x.width),nt=lt,rt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Bt),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),e.texSubImage2D(i.TEXTURE_2D,0,Bt,L,nt,rt,B,q,x.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,it),i.pixelStorei(i.UNPACK_SKIP_PIXELS,St),i.pixelStorei(i.UNPACK_SKIP_ROWS,yt)}}function $(T,x,B){let q=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(q=i.TEXTURE_3D);const Z=ce(T,x),k=x.source;e.bindTexture(q,T.__webglTexture,i.TEXTURE0+B);const wt=n.get(k);if(k.version!==wt.__version||Z===!0){e.activeTexture(i.TEXTURE0+B);const it=jt.getPrimaries(jt.workingColorSpace),St=x.colorSpace===Yn?null:jt.getPrimaries(x.colorSpace),yt=x.colorSpace===Yn||it===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);let et=_(x.image,!1,r.maxTextureSize);et=Re(x,et);const ut=s.convert(x.format,x.colorSpace),It=s.convert(x.type);let Et=w(x.internalFormat,ut,It,x.colorSpace,x.isVideoTexture);Ht(q,x);let lt;const Bt=x.mipmaps,L=x.isVideoTexture!==!0,nt=wt.__version===void 0||Z===!0,rt=k.dataReady,mt=R(x,et);if(x.isDepthTexture)Et=S(x.format===Rr,x.type),nt&&(L?e.texStorage2D(i.TEXTURE_2D,1,Et,et.width,et.height):e.texImage2D(i.TEXTURE_2D,0,Et,et.width,et.height,0,ut,It,null));else if(x.isDataTexture)if(Bt.length>0){L&&nt&&e.texStorage2D(i.TEXTURE_2D,mt,Et,Bt[0].width,Bt[0].height);for(let Q=0,K=Bt.length;Q<K;Q++)lt=Bt[Q],L?rt&&e.texSubImage2D(i.TEXTURE_2D,Q,0,0,lt.width,lt.height,ut,It,lt.data):e.texImage2D(i.TEXTURE_2D,Q,Et,lt.width,lt.height,0,ut,It,lt.data);x.generateMipmaps=!1}else L?(nt&&e.texStorage2D(i.TEXTURE_2D,mt,Et,et.width,et.height),rt&&Jt(x,et,ut,It)):e.texImage2D(i.TEXTURE_2D,0,Et,et.width,et.height,0,ut,It,et.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){L&&nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,mt,Et,Bt[0].width,Bt[0].height,et.depth);for(let Q=0,K=Bt.length;Q<K;Q++)if(lt=Bt[Q],x.format!==pn)if(ut!==null)if(L){if(rt)if(x.layerUpdates.size>0){const vt=Fl(lt.width,lt.height,x.format,x.type);for(const Ft of x.layerUpdates){const ue=lt.data.subarray(Ft*vt/lt.data.BYTES_PER_ELEMENT,(Ft+1)*vt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,Ft,lt.width,lt.height,1,ut,ue)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,lt.width,lt.height,et.depth,ut,lt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Et,lt.width,lt.height,et.depth,0,lt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,lt.width,lt.height,et.depth,ut,It,lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Q,Et,lt.width,lt.height,et.depth,0,ut,It,lt.data)}else{L&&nt&&e.texStorage2D(i.TEXTURE_2D,mt,Et,Bt[0].width,Bt[0].height);for(let Q=0,K=Bt.length;Q<K;Q++)lt=Bt[Q],x.format!==pn?ut!==null?L?rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,lt.width,lt.height,ut,lt.data):e.compressedTexImage2D(i.TEXTURE_2D,Q,Et,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?rt&&e.texSubImage2D(i.TEXTURE_2D,Q,0,0,lt.width,lt.height,ut,It,lt.data):e.texImage2D(i.TEXTURE_2D,Q,Et,lt.width,lt.height,0,ut,It,lt.data)}else if(x.isDataArrayTexture)if(L){if(nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,mt,Et,et.width,et.height,et.depth),rt)if(x.layerUpdates.size>0){const Q=Fl(et.width,et.height,x.format,x.type);for(const K of x.layerUpdates){const vt=et.data.subarray(K*Q/et.data.BYTES_PER_ELEMENT,(K+1)*Q/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,et.width,et.height,1,ut,It,vt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,ut,It,et.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,et.width,et.height,et.depth,0,ut,It,et.data);else if(x.isData3DTexture)L?(nt&&e.texStorage3D(i.TEXTURE_3D,mt,Et,et.width,et.height,et.depth),rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,ut,It,et.data)):e.texImage3D(i.TEXTURE_3D,0,Et,et.width,et.height,et.depth,0,ut,It,et.data);else if(x.isFramebufferTexture){if(nt)if(L)e.texStorage2D(i.TEXTURE_2D,mt,Et,et.width,et.height);else{let Q=et.width,K=et.height;for(let vt=0;vt<mt;vt++)e.texImage2D(i.TEXTURE_2D,vt,Et,Q,K,0,ut,It,null),Q>>=1,K>>=1}}else if(Bt.length>0){if(L&&nt){const Q=xe(Bt[0]);e.texStorage2D(i.TEXTURE_2D,mt,Et,Q.width,Q.height)}for(let Q=0,K=Bt.length;Q<K;Q++)lt=Bt[Q],L?rt&&e.texSubImage2D(i.TEXTURE_2D,Q,0,0,ut,It,lt):e.texImage2D(i.TEXTURE_2D,Q,Et,ut,It,lt);x.generateMipmaps=!1}else if(L){if(nt){const Q=xe(et);e.texStorage2D(i.TEXTURE_2D,mt,Et,Q.width,Q.height)}rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ut,It,et)}else e.texImage2D(i.TEXTURE_2D,0,Et,ut,It,et);m(x)&&p(q),wt.__version=k.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function J(T,x,B){if(x.image.length!==6)return;const q=ce(T,x),Z=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+B);const k=n.get(Z);if(Z.version!==k.__version||q===!0){e.activeTexture(i.TEXTURE0+B);const wt=jt.getPrimaries(jt.workingColorSpace),it=x.colorSpace===Yn?null:jt.getPrimaries(x.colorSpace),St=x.colorSpace===Yn||wt===it?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const yt=x.isCompressedTexture||x.image[0].isCompressedTexture,et=x.image[0]&&x.image[0].isDataTexture,ut=[];for(let K=0;K<6;K++)!yt&&!et?ut[K]=_(x.image[K],!0,r.maxCubemapSize):ut[K]=et?x.image[K].image:x.image[K],ut[K]=Re(x,ut[K]);const It=ut[0],Et=s.convert(x.format,x.colorSpace),lt=s.convert(x.type),Bt=w(x.internalFormat,Et,lt,x.colorSpace),L=x.isVideoTexture!==!0,nt=k.__version===void 0||q===!0,rt=Z.dataReady;let mt=R(x,It);Ht(i.TEXTURE_CUBE_MAP,x);let Q;if(yt){L&&nt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,mt,Bt,It.width,It.height);for(let K=0;K<6;K++){Q=ut[K].mipmaps;for(let vt=0;vt<Q.length;vt++){const Ft=Q[vt];x.format!==pn?Et!==null?L?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt,0,0,Ft.width,Ft.height,Et,Ft.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt,Bt,Ft.width,Ft.height,0,Ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt,0,0,Ft.width,Ft.height,Et,lt,Ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt,Bt,Ft.width,Ft.height,0,Et,lt,Ft.data)}}}else{if(Q=x.mipmaps,L&&nt){Q.length>0&&mt++;const K=xe(ut[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,mt,Bt,K.width,K.height)}for(let K=0;K<6;K++)if(et){L?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ut[K].width,ut[K].height,Et,lt,ut[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Bt,ut[K].width,ut[K].height,0,Et,lt,ut[K].data);for(let vt=0;vt<Q.length;vt++){const ue=Q[vt].image[K].image;L?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt+1,0,0,ue.width,ue.height,Et,lt,ue.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt+1,Bt,ue.width,ue.height,0,Et,lt,ue.data)}}else{L?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Et,lt,ut[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Bt,Et,lt,ut[K]);for(let vt=0;vt<Q.length;vt++){const Ft=Q[vt];L?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt+1,0,0,Et,lt,Ft.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,vt+1,Bt,Et,lt,Ft.image[K])}}}m(x)&&p(i.TEXTURE_CUBE_MAP),k.__version=Z.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function gt(T,x,B,q,Z,k){const wt=s.convert(B.format,B.colorSpace),it=s.convert(B.type),St=w(B.internalFormat,wt,it,B.colorSpace),yt=n.get(x),et=n.get(B);if(et.__renderTarget=x,!yt.__hasExternalTextures){const ut=Math.max(1,x.width>>k),It=Math.max(1,x.height>>k);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,k,St,ut,It,x.depth,0,wt,it,null):e.texImage2D(Z,k,St,ut,It,0,wt,it,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Mt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,Z,et.__webglTexture,0,pe(x)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,Z,et.__webglTexture,k),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(T,x,B){if(i.bindRenderbuffer(i.RENDERBUFFER,T),x.depthBuffer){const q=x.depthTexture,Z=q&&q.isDepthTexture?q.type:null,k=S(x.stencilBuffer,Z),wt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=pe(x);Mt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,k,x.width,x.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,k,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,k,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,T)}else{const q=x.textures;for(let Z=0;Z<q.length;Z++){const k=q[Z],wt=s.convert(k.format,k.colorSpace),it=s.convert(k.type),St=w(k.internalFormat,wt,it,k.colorSpace),yt=pe(x);B&&Mt(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,yt,St,x.width,x.height):Mt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,yt,St,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,St,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(x.depthTexture);q.__renderTarget=x,(!q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W(x.depthTexture,0);const Z=q.__webglTexture,k=pe(x);if(x.depthTexture.format===Ar)Mt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0,k):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0);else if(x.depthTexture.format===Rr)Mt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0,k):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Yt(T){const x=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){const q=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),q){const Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,q.removeEventListener("dispose",Z)};q.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=q}if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");const q=T.texture.mipmaps;q&&q.length>0?Tt(x.__webglFramebuffer[0],T):Tt(x.__webglFramebuffer,T)}else if(B){x.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[q]),x.__webglDepthbuffer[q]===void 0)x.__webglDepthbuffer[q]=i.createRenderbuffer(),Nt(x.__webglDepthbuffer[q],T,!1);else{const Z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=x.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,k),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,k)}}else{const q=T.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Nt(x.__webglDepthbuffer,T,!1);else{const Z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,k),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,k)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(T,x,B){const q=n.get(T);x!==void 0&&gt(q.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Yt(T)}function P(T){const x=T.texture,B=n.get(T),q=n.get(x);T.addEventListener("dispose",C);const Z=T.textures,k=T.isWebGLCubeRenderTarget===!0,wt=Z.length>1;if(wt||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=x.version,o.memory.textures++),k){B.__webglFramebuffer=[];for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer[it]=[];for(let St=0;St<x.mipmaps.length;St++)B.__webglFramebuffer[it][St]=i.createFramebuffer()}else B.__webglFramebuffer[it]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer=[];for(let it=0;it<x.mipmaps.length;it++)B.__webglFramebuffer[it]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(wt)for(let it=0,St=Z.length;it<St;it++){const yt=n.get(Z[it]);yt.__webglTexture===void 0&&(yt.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Mt(T)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let it=0;it<Z.length;it++){const St=Z[it];B.__webglColorRenderbuffer[it]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[it]);const yt=s.convert(St.format,St.colorSpace),et=s.convert(St.type),ut=w(St.internalFormat,yt,et,St.colorSpace,T.isXRRenderTarget===!0),It=pe(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,It,ut,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+it,i.RENDERBUFFER,B.__webglColorRenderbuffer[it])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),Nt(B.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(k){e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,x);for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0)for(let St=0;St<x.mipmaps.length;St++)gt(B.__webglFramebuffer[it][St],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,St);else gt(B.__webglFramebuffer[it],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);m(x)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let it=0,St=Z.length;it<St;it++){const yt=Z[it],et=n.get(yt);let ut=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ut=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,et.__webglTexture),Ht(ut,yt),gt(B.__webglFramebuffer,T,yt,i.COLOR_ATTACHMENT0+it,ut,0),m(yt)&&p(ut)}e.unbindTexture()}else{let it=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(it=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(it,q.__webglTexture),Ht(it,x),x.mipmaps&&x.mipmaps.length>0)for(let St=0;St<x.mipmaps.length;St++)gt(B.__webglFramebuffer[St],T,x,i.COLOR_ATTACHMENT0,it,St);else gt(B.__webglFramebuffer,T,x,i.COLOR_ATTACHMENT0,it,0);m(x)&&p(it),e.unbindTexture()}T.depthBuffer&&Yt(T)}function fe(T){const x=T.textures;for(let B=0,q=x.length;B<q;B++){const Z=x[B];if(m(Z)){const k=b(T),wt=n.get(Z).__webglTexture;e.bindTexture(k,wt),p(k),e.unbindTexture()}}}const Ot=[],Ut=[];function xt(T){if(T.samples>0){if(Mt(T)===!1){const x=T.textures,B=T.width,q=T.height;let Z=i.COLOR_BUFFER_BIT;const k=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(T),it=x.length>1;if(it)for(let yt=0;yt<x.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer);const St=T.texture.mipmaps;St&&St.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let yt=0;yt<x.length;yt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),it){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[yt]);const et=n.get(x[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,et,0)}i.blitFramebuffer(0,0,B,q,0,0,B,q,Z,i.NEAREST),l===!0&&(Ot.length=0,Ut.length=0,Ot.push(i.COLOR_ATTACHMENT0+yt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Ot.push(k),Ut.push(k),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ut)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ot))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),it)for(let yt=0;yt<x.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,wt.__webglColorRenderbuffer[yt]);const et=n.get(x[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,et,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const x=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function pe(T){return Math.min(r.maxSamples,T.samples)}function Mt(T){const x=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Gt(T){const x=o.render.frame;h.get(T)!==x&&(h.set(T,x),T.update())}function Re(T,x){const B=T.colorSpace,q=T.format,Z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==Yi&&B!==Yn&&(jt.getTransfer(B)===re?(q!==pn||Z!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),x}function xe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=O,this.setTexture2D=W,this.setTexture2DArray=X,this.setTexture3D=j,this.setTextureCube=V,this.rebindTextures=Ie,this.setupRenderTarget=P,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=Yt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=Mt}function Fg(i,t){function e(n,r=Yn){let s;const o=jt.getTransfer(r);if(n===bn)return i.UNSIGNED_BYTE;if(n===ya)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ea)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Tc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ac)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===bc)return i.BYTE;if(n===wc)return i.SHORT;if(n===wr)return i.UNSIGNED_SHORT;if(n===Sa)return i.INT;if(n===mi)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===Fr)return i.HALF_FLOAT;if(n===Rc)return i.ALPHA;if(n===Cc)return i.RGB;if(n===pn)return i.RGBA;if(n===Ar)return i.DEPTH_COMPONENT;if(n===Rr)return i.DEPTH_STENCIL;if(n===ba)return i.RED;if(n===wa)return i.RED_INTEGER;if(n===Pc)return i.RG;if(n===Ta)return i.RG_INTEGER;if(n===Aa)return i.RGBA_INTEGER;if(n===ps||n===ms||n===gs||n===_s)if(o===re)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ps)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ms)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===gs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_s)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ps)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ms)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===gs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_s)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===No||n===Fo||n===Oo||n===Bo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===No)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Oo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Bo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===zo||n===Ho||n===Go)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===zo||n===Ho)return o===re?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Go)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Vo||n===ko||n===Wo||n===Xo||n===qo||n===Yo||n===$o||n===Ko||n===jo||n===Zo||n===Jo||n===Qo||n===ta||n===ea)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Vo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ko)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Xo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Yo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$o)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ko)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qo)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ta)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ea)return o===re?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===na||n===ia||n===ra)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===na)return o===re?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ia)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ra)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sa||n===oa||n===aa||n===la)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===sa)return s.COMPRESSED_RED_RGTC1_EXT;if(n===oa)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===aa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===la)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Tr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Og=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bg=`
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

}`;class zg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Xc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Bn({vertexShader:Og,fragmentShader:Bg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Zt(new ve(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hg extends tr{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new zg,p={},b=e.getContextAttributes();let w=null,S=null;const R=[],A=[],C=new Ct;let E=null;const v=new He;v.viewport=new oe;const M=new He;M.viewport=new oe;const I=[v,M],O=new sd;let G=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let J=R[$];return J===void 0&&(J=new oo,R[$]=J),J.getTargetRaySpace()},this.getControllerGrip=function($){let J=R[$];return J===void 0&&(J=new oo,R[$]=J),J.getGripSpace()},this.getHand=function($){let J=R[$];return J===void 0&&(J=new oo,R[$]=J),J.getHandSpace()};function W($){const J=A.indexOf($.inputSource);if(J===-1)return;const gt=R[J];gt!==void 0&&(gt.update($.inputSource,$.frame,c||o),gt.dispatchEvent({type:$.type,data:$.inputSource}))}function X(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",j);for(let $=0;$<R.length;$++){const J=A[$];J!==null&&(A[$]=null,R[$].disconnect(J))}G=null,Y=null,m.reset();for(const $ in p)delete p[$];t.setRenderTarget(w),f=null,d=null,u=null,r=null,S=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(r,e)),u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(w=t.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",X),r.addEventListener("inputsourceschange",j),b.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let gt=null,Nt=null,Tt=null;b.depth&&(Tt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,gt=b.stencil?Rr:Ar,Nt=b.stencil?Tr:mi);const Yt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Yt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),S=new gi(d.textureWidth,d.textureHeight,{format:pn,type:bn,depthTexture:new Wc(d.textureWidth,d.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,gt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const gt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,gt),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new gi(f.framebufferWidth,f.framebufferHeight,{format:pn,type:bn,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Jt.setContext(r),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function j($){for(let J=0;J<$.removed.length;J++){const gt=$.removed[J],Nt=A.indexOf(gt);Nt>=0&&(A[Nt]=null,R[Nt].disconnect(gt))}for(let J=0;J<$.added.length;J++){const gt=$.added[J];let Nt=A.indexOf(gt);if(Nt===-1){for(let Yt=0;Yt<R.length;Yt++)if(Yt>=A.length){A.push(gt),Nt=Yt;break}else if(A[Yt]===null){A[Yt]=gt,Nt=Yt;break}if(Nt===-1)break}const Tt=R[Nt];Tt&&Tt.connect(gt)}}const V=new U,st=new U;function dt($,J,gt){V.setFromMatrixPosition(J.matrixWorld),st.setFromMatrixPosition(gt.matrixWorld);const Nt=V.distanceTo(st),Tt=J.projectionMatrix.elements,Yt=gt.projectionMatrix.elements,Ie=Tt[14]/(Tt[10]-1),P=Tt[14]/(Tt[10]+1),fe=(Tt[9]+1)/Tt[5],Ot=(Tt[9]-1)/Tt[5],Ut=(Tt[8]-1)/Tt[0],xt=(Yt[8]+1)/Yt[0],pe=Ie*Ut,Mt=Ie*xt,Gt=Nt/(-Ut+xt),Re=Gt*-Ut;if(J.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Re),$.translateZ(Gt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Tt[10]===-1)$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const xe=Ie+Gt,T=P+Gt,x=pe-Re,B=Mt+(Nt-Re),q=fe*P/T*xe,Z=Ot*P/T*xe;$.projectionMatrix.makePerspective(x,B,q,Z,xe,T),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function bt($,J){J===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(J.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let J=$.near,gt=$.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(gt=m.depthFar)),O.near=M.near=v.near=J,O.far=M.far=v.far=gt,(G!==O.near||Y!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),G=O.near,Y=O.far),O.layers.mask=$.layers.mask|6,v.layers.mask=O.layers.mask&3,M.layers.mask=O.layers.mask&5;const Nt=$.parent,Tt=O.cameras;bt(O,Nt);for(let Yt=0;Yt<Tt.length;Yt++)bt(Tt[Yt],Nt);Tt.length===2?dt(O,v,M):O.projectionMatrix.copy(v.projectionMatrix),Ht($,O,Nt)};function Ht($,J,gt){gt===null?$.matrix.copy(J.matrixWorld):($.matrix.copy(gt.matrixWorld),$.matrix.invert(),$.matrix.multiply(J.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ua*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function($){return p[$]};let ce=null;function de($,J){if(h=J.getViewerPose(c||o),g=J,h!==null){const gt=h.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let Nt=!1;gt.length!==O.cameras.length&&(O.cameras.length=0,Nt=!0);for(let P=0;P<gt.length;P++){const fe=gt[P];let Ot=null;if(f!==null)Ot=f.getViewport(fe);else{const xt=u.getViewSubImage(d,fe);Ot=xt.viewport,P===0&&(t.setRenderTargetTextures(S,xt.colorTexture,xt.depthStencilTexture),t.setRenderTarget(S))}let Ut=I[P];Ut===void 0&&(Ut=new He,Ut.layers.enable(P),Ut.viewport=new oe,I[P]=Ut),Ut.matrix.fromArray(fe.transform.matrix),Ut.matrix.decompose(Ut.position,Ut.quaternion,Ut.scale),Ut.projectionMatrix.fromArray(fe.projectionMatrix),Ut.projectionMatrixInverse.copy(Ut.projectionMatrix).invert(),Ut.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),P===0&&(O.matrix.copy(Ut.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Nt===!0&&O.cameras.push(Ut)}const Tt=r.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const P=u.getDepthInformation(gt[0]);P&&P.isValid&&P.texture&&m.init(P,r.renderState)}if(Tt&&Tt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<gt.length;P++){const fe=gt[P].camera;if(fe){let Ot=p[fe];Ot||(Ot=new Xc,p[fe]=Ot);const Ut=u.getCameraImage(fe);Ot.sourceTexture=Ut}}}}for(let gt=0;gt<R.length;gt++){const Nt=A[gt],Tt=R[gt];Nt!==null&&Tt!==void 0&&Tt.update(Nt,J,c||o)}ce&&ce($,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const Jt=new $c;Jt.setAnimationLoop(de),this.setAnimationLoop=function($){ce=$},this.dispose=function(){}}}const li=new Ne,Gg=new ee;function Vg(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Oc(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,b,w,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,b,w):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ve&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ve&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=t.get(p),w=b.envMap,S=b.envMapRotation;w&&(m.envMap.value=w,li.copy(S),li.x*=-1,li.y*=-1,li.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),m.envMapRotation.value.setFromMatrix4(Gg.makeRotationFromEuler(li)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=w*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ve&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function kg(i,t,e,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,w){const S=w.program;n.uniformBlockBinding(b,S)}function c(b,w){let S=r[b.id];S===void 0&&(g(b),S=h(b),r[b.id]=S,b.addEventListener("dispose",m));const R=w.program;n.updateUBOMapping(b,R);const A=t.render.frame;s[b.id]!==A&&(d(b),s[b.id]=A)}function h(b){const w=u();b.__bindingPointIndex=w;const S=i.createBuffer(),R=b.__size,A=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,R,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,S),S}function u(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const w=r[b.id],S=b.uniforms,R=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let A=0,C=S.length;A<C;A++){const E=Array.isArray(S[A])?S[A]:[S[A]];for(let v=0,M=E.length;v<M;v++){const I=E[v];if(f(I,A,v,R)===!0){const O=I.__offset,G=Array.isArray(I.value)?I.value:[I.value];let Y=0;for(let W=0;W<G.length;W++){const X=G[W],j=_(X);typeof X=="number"||typeof X=="boolean"?(I.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,O+Y,I.__data)):X.isMatrix3?(I.__data[0]=X.elements[0],I.__data[1]=X.elements[1],I.__data[2]=X.elements[2],I.__data[3]=0,I.__data[4]=X.elements[3],I.__data[5]=X.elements[4],I.__data[6]=X.elements[5],I.__data[7]=0,I.__data[8]=X.elements[6],I.__data[9]=X.elements[7],I.__data[10]=X.elements[8],I.__data[11]=0):(X.toArray(I.__data,Y),Y+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,w,S,R){const A=b.value,C=w+"_"+S;if(R[C]===void 0)return typeof A=="number"||typeof A=="boolean"?R[C]=A:R[C]=A.clone(),!0;{const E=R[C];if(typeof A=="number"||typeof A=="boolean"){if(E!==A)return R[C]=A,!0}else if(E.equals(A)===!1)return E.copy(A),!0}return!1}function g(b){const w=b.uniforms;let S=0;const R=16;for(let C=0,E=w.length;C<E;C++){const v=Array.isArray(w[C])?w[C]:[w[C]];for(let M=0,I=v.length;M<I;M++){const O=v[M],G=Array.isArray(O.value)?O.value:[O.value];for(let Y=0,W=G.length;Y<W;Y++){const X=G[Y],j=_(X),V=S%R,st=V%j.boundary,dt=V+st;S+=st,dt!==0&&R-dt<j.storage&&(S+=R-dt),O.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=S,S+=j.storage}}}const A=S%R;return A>0&&(S+=R-A),b.__size=S,b.__cache={},this}function _(b){const w={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(w.boundary=4,w.storage=4):b.isVector2?(w.boundary=8,w.storage=8):b.isVector3||b.isColor?(w.boundary=16,w.storage=12):b.isVector4?(w.boundary=16,w.storage=16):b.isMatrix3?(w.boundary=48,w.storage=48):b.isMatrix4?(w.boundary=64,w.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),w}function m(b){const w=b.target;w.removeEventListener("dispose",m);const S=o.indexOf(w.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function p(){for(const b in r)i.deleteBuffer(r[b]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class Wg{constructor(t={}){const{canvas:e=ph(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const b=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let R=!1;this._outputColorSpace=Me;let A=0,C=0,E=null,v=-1,M=null;const I=new oe,O=new oe;let G=null;const Y=new Wt(0);let W=0,X=e.width,j=e.height,V=1,st=null,dt=null;const bt=new oe(0,0,X,j),Ht=new oe(0,0,X,j);let ce=!1;const de=new La;let Jt=!1,$=!1;const J=new ee,gt=new U,Nt=new oe,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function Ie(){return E===null?V:1}let P=n;function fe(y,N){return e.getContext(y,N)}try{const y={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ma}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",mt,!1),e.addEventListener("webglcontextcreationerror",Q,!1),P===null){const N="webgl2";if(P=fe(N,y),P===null)throw fe(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ot,Ut,xt,pe,Mt,Gt,Re,xe,T,x,B,q,Z,k,wt,it,St,yt,et,ut,It,Et,lt,Bt;function L(){Ot=new tm(P),Ot.init(),Et=new Fg(P,Ot),Ut=new Yp(P,Ot,t,Et),xt=new Dg(P,Ot),Ut.reversedDepthBuffer&&d&&xt.buffers.depth.setReversed(!0),pe=new im(P),Mt=new Sg,Gt=new Ng(P,Ot,xt,Mt,Ut,Et,pe),Re=new Kp(S),xe=new Qp(S),T=new ld(P),lt=new Xp(P,T),x=new em(P,T,pe,lt),B=new sm(P,x,T,pe),et=new rm(P,Ut,Gt),it=new $p(Mt),q=new Mg(S,Re,xe,Ot,Ut,lt,it),Z=new Vg(S,Mt),k=new Eg,wt=new Cg(Ot),yt=new Wp(S,Re,xe,xt,B,f,l),St=new Lg(S,B,Ut),Bt=new kg(P,pe,Ut,xt),ut=new qp(P,Ot,pe),It=new nm(P,Ot,pe),pe.programs=q.programs,S.capabilities=Ut,S.extensions=Ot,S.properties=Mt,S.renderLists=k,S.shadowMap=St,S.state=xt,S.info=pe}L();const nt=new Hg(S,P);this.xr=nt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const y=Ot.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ot.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(y){y!==void 0&&(V=y,this.setSize(X,j,!1))},this.getSize=function(y){return y.set(X,j)},this.setSize=function(y,N,z=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=y,j=N,e.width=Math.floor(y*V),e.height=Math.floor(N*V),z===!0&&(e.style.width=y+"px",e.style.height=N+"px"),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(X*V,j*V).floor()},this.setDrawingBufferSize=function(y,N,z){X=y,j=N,V=z,e.width=Math.floor(y*z),e.height=Math.floor(N*z),this.setViewport(0,0,y,N)},this.getCurrentViewport=function(y){return y.copy(I)},this.getViewport=function(y){return y.copy(bt)},this.setViewport=function(y,N,z,H){y.isVector4?bt.set(y.x,y.y,y.z,y.w):bt.set(y,N,z,H),xt.viewport(I.copy(bt).multiplyScalar(V).round())},this.getScissor=function(y){return y.copy(Ht)},this.setScissor=function(y,N,z,H){y.isVector4?Ht.set(y.x,y.y,y.z,y.w):Ht.set(y,N,z,H),xt.scissor(O.copy(Ht).multiplyScalar(V).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(y){xt.setScissorTest(ce=y)},this.setOpaqueSort=function(y){st=y},this.setTransparentSort=function(y){dt=y},this.getClearColor=function(y){return y.copy(yt.getClearColor())},this.setClearColor=function(){yt.setClearColor(...arguments)},this.getClearAlpha=function(){return yt.getClearAlpha()},this.setClearAlpha=function(){yt.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,z=!0){let H=0;if(y){let F=!1;if(E!==null){const tt=E.texture.format;F=tt===Aa||tt===Ta||tt===wa}if(F){const tt=E.texture.type,ct=tt===bn||tt===mi||tt===wr||tt===Tr||tt===ya||tt===Ea,_t=yt.getClearColor(),ft=yt.getClearAlpha(),Pt=_t.r,Dt=_t.g,At=_t.b;ct?(g[0]=Pt,g[1]=Dt,g[2]=At,g[3]=ft,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Pt,_[1]=Dt,_[2]=At,_[3]=ft,P.clearBufferiv(P.COLOR,0,_))}else H|=P.COLOR_BUFFER_BIT}N&&(H|=P.DEPTH_BUFFER_BIT),z&&(H|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",mt,!1),e.removeEventListener("webglcontextcreationerror",Q,!1),yt.dispose(),k.dispose(),wt.dispose(),Mt.dispose(),Re.dispose(),xe.dispose(),B.dispose(),lt.dispose(),Bt.dispose(),q.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",mn),nt.removeEventListener("sessionend",$a),ei.stop()};function rt(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function mt(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const y=pe.autoReset,N=St.enabled,z=St.autoUpdate,H=St.needsUpdate,F=St.type;L(),pe.autoReset=y,St.enabled=N,St.autoUpdate=z,St.needsUpdate=H,St.type=F}function Q(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function K(y){const N=y.target;N.removeEventListener("dispose",K),vt(N)}function vt(y){Ft(y),Mt.remove(y)}function Ft(y){const N=Mt.get(y).programs;N!==void 0&&(N.forEach(function(z){q.releaseProgram(z)}),y.isShaderMaterial&&q.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,z,H,F,tt){N===null&&(N=Tt);const ct=F.isMesh&&F.matrixWorld.determinant()<0,_t=yu(y,N,z,H,F);xt.setMaterial(H,ct);let ft=z.index,Pt=1;if(H.wireframe===!0){if(ft=x.getWireframeAttribute(z),ft===void 0)return;Pt=2}const Dt=z.drawRange,At=z.attributes.position;let Xt=Dt.start*Pt,ie=(Dt.start+Dt.count)*Pt;tt!==null&&(Xt=Math.max(Xt,tt.start*Pt),ie=Math.min(ie,(tt.start+tt.count)*Pt)),ft!==null?(Xt=Math.max(Xt,0),ie=Math.min(ie,ft.count)):At!=null&&(Xt=Math.max(Xt,0),ie=Math.min(ie,At.count));const _e=ie-Xt;if(_e<0||_e===1/0)return;lt.setup(F,H,_t,z,ft);let he,ae=ut;if(ft!==null&&(he=T.get(ft),ae=It,ae.setIndex(he)),F.isMesh)H.wireframe===!0?(xt.setLineWidth(H.wireframeLinewidth*Ie()),ae.setMode(P.LINES)):ae.setMode(P.TRIANGLES);else if(F.isLine){let Rt=H.linewidth;Rt===void 0&&(Rt=1),xt.setLineWidth(Rt*Ie()),F.isLineSegments?ae.setMode(P.LINES):F.isLineLoop?ae.setMode(P.LINE_LOOP):ae.setMode(P.LINE_STRIP)}else F.isPoints?ae.setMode(P.POINTS):F.isSprite&&ae.setMode(P.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Pr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ae.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Ot.get("WEBGL_multi_draw"))ae.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Rt=F._multiDrawStarts,me=F._multiDrawCounts,Kt=F._multiDrawCount,Xe=ft?T.get(ft).bytesPerElement:1,xi=Mt.get(H).currentProgram.getUniforms();for(let qe=0;qe<Kt;qe++)xi.setValue(P,"_gl_DrawID",qe),ae.render(Rt[qe]/Xe,me[qe])}else if(F.isInstancedMesh)ae.renderInstances(Xt,_e,F.count);else if(z.isInstancedBufferGeometry){const Rt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,me=Math.min(z.instanceCount,Rt);ae.renderInstances(Xt,_e,me)}else ae.render(Xt,_e)};function ue(y,N,z){y.transparent===!0&&y.side===sn&&y.forceSinglePass===!1?(y.side=Ve,y.needsUpdate=!0,Hr(y,N,z),y.side=Qn,y.needsUpdate=!0,Hr(y,N,z),y.side=sn):Hr(y,N,z)}this.compile=function(y,N,z=null){z===null&&(z=y),p=wt.get(z),p.init(N),w.push(p),z.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),y!==z&&y.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights();const H=new Set;return y.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const tt=F.material;if(tt)if(Array.isArray(tt))for(let ct=0;ct<tt.length;ct++){const _t=tt[ct];ue(_t,z,F),H.add(_t)}else ue(tt,z,F),H.add(tt)}),p=w.pop(),H},this.compileAsync=function(y,N,z=null){const H=this.compile(y,N,z);return new Promise(F=>{function tt(){if(H.forEach(function(ct){Mt.get(ct).currentProgram.isReady()&&H.delete(ct)}),H.size===0){F(y);return}setTimeout(tt,10)}Ot.get("KHR_parallel_shader_compile")!==null?tt():setTimeout(tt,10)})};let Qt=null;function Tn(y){Qt&&Qt(y)}function mn(){ei.stop()}function $a(){ei.start()}const ei=new $c;ei.setAnimationLoop(Tn),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(y){Qt=y,nt.setAnimationLoop(y),y===null?ei.stop():ei.start()},nt.addEventListener("sessionstart",mn),nt.addEventListener("sessionend",$a),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(N),N=nt.getCamera()),y.isScene===!0&&y.onBeforeRender(S,y,N,E),p=wt.get(y,w.length),p.init(N),w.push(p),J.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),de.setFromProjectionMatrix(J,yn,N.reversedDepth),$=this.localClippingEnabled,Jt=it.init(this.clippingPlanes,$),m=k.get(y,b.length),m.init(),b.push(m),nt.enabled===!0&&nt.isPresenting===!0){const tt=S.xr.getDepthSensingMesh();tt!==null&&Ns(tt,N,-1/0,S.sortObjects)}Ns(y,N,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(st,dt),Yt=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,Yt&&yt.addToRenderList(m,y),this.info.render.frame++,Jt===!0&&it.beginShadows();const z=p.state.shadowsArray;St.render(z,y,N),Jt===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,F=m.transmissive;if(p.setupLights(),N.isArrayCamera){const tt=N.cameras;if(F.length>0)for(let ct=0,_t=tt.length;ct<_t;ct++){const ft=tt[ct];ja(H,F,y,ft)}Yt&&yt.render(y);for(let ct=0,_t=tt.length;ct<_t;ct++){const ft=tt[ct];Ka(m,y,ft,ft.viewport)}}else F.length>0&&ja(H,F,y,N),Yt&&yt.render(y),Ka(m,y,N);E!==null&&C===0&&(Gt.updateMultisampleRenderTarget(E),Gt.updateRenderTargetMipmap(E)),y.isScene===!0&&y.onAfterRender(S,y,N),lt.resetDefaultState(),v=-1,M=null,w.pop(),w.length>0?(p=w[w.length-1],Jt===!0&&it.setGlobalState(S.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Ns(y,N,z,H){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)z=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||de.intersectsSprite(y)){H&&Nt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(J);const ct=B.update(y),_t=y.material;_t.visible&&m.push(y,ct,_t,z,Nt.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||de.intersectsObject(y))){const ct=B.update(y),_t=y.material;if(H&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Nt.copy(y.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Nt.copy(ct.boundingSphere.center)),Nt.applyMatrix4(y.matrixWorld).applyMatrix4(J)),Array.isArray(_t)){const ft=ct.groups;for(let Pt=0,Dt=ft.length;Pt<Dt;Pt++){const At=ft[Pt],Xt=_t[At.materialIndex];Xt&&Xt.visible&&m.push(y,ct,Xt,z,Nt.z,At)}}else _t.visible&&m.push(y,ct,_t,z,Nt.z,null)}}const tt=y.children;for(let ct=0,_t=tt.length;ct<_t;ct++)Ns(tt[ct],N,z,H)}function Ka(y,N,z,H){const F=y.opaque,tt=y.transmissive,ct=y.transparent;p.setupLightsView(z),Jt===!0&&it.setGlobalState(S.clippingPlanes,z),H&&xt.viewport(I.copy(H)),F.length>0&&zr(F,N,z),tt.length>0&&zr(tt,N,z),ct.length>0&&zr(ct,N,z),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function ja(y,N,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new gi(1,1,{generateMipmaps:!0,type:Ot.has("EXT_color_buffer_half_float")||Ot.has("EXT_color_buffer_float")?Fr:bn,minFilter:Nn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace}));const tt=p.state.transmissionRenderTarget[H.id],ct=H.viewport||I;tt.setSize(ct.z*S.transmissionResolutionScale,ct.w*S.transmissionResolutionScale);const _t=S.getRenderTarget(),ft=S.getActiveCubeFace(),Pt=S.getActiveMipmapLevel();S.setRenderTarget(tt),S.getClearColor(Y),W=S.getClearAlpha(),W<1&&S.setClearColor(16777215,.5),S.clear(),Yt&&yt.render(z);const Dt=S.toneMapping;S.toneMapping=Kn;const At=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),Jt===!0&&it.setGlobalState(S.clippingPlanes,H),zr(y,z,H),Gt.updateMultisampleRenderTarget(tt),Gt.updateRenderTargetMipmap(tt),Ot.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let ie=0,_e=N.length;ie<_e;ie++){const he=N[ie],ae=he.object,Rt=he.geometry,me=he.material,Kt=he.group;if(me.side===sn&&ae.layers.test(H.layers)){const Xe=me.side;me.side=Ve,me.needsUpdate=!0,Za(ae,z,H,Rt,me,Kt),me.side=Xe,me.needsUpdate=!0,Xt=!0}}Xt===!0&&(Gt.updateMultisampleRenderTarget(tt),Gt.updateRenderTargetMipmap(tt))}S.setRenderTarget(_t,ft,Pt),S.setClearColor(Y,W),At!==void 0&&(H.viewport=At),S.toneMapping=Dt}function zr(y,N,z){const H=N.isScene===!0?N.overrideMaterial:null;for(let F=0,tt=y.length;F<tt;F++){const ct=y[F],_t=ct.object,ft=ct.geometry,Pt=ct.group;let Dt=ct.material;Dt.allowOverride===!0&&H!==null&&(Dt=H),_t.layers.test(z.layers)&&Za(_t,N,z,ft,Dt,Pt)}}function Za(y,N,z,H,F,tt){y.onBeforeRender(S,N,z,H,F,tt),y.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),F.onBeforeRender(S,N,z,H,y,tt),F.transparent===!0&&F.side===sn&&F.forceSinglePass===!1?(F.side=Ve,F.needsUpdate=!0,S.renderBufferDirect(z,N,H,F,y,tt),F.side=Qn,F.needsUpdate=!0,S.renderBufferDirect(z,N,H,F,y,tt),F.side=sn):S.renderBufferDirect(z,N,H,F,y,tt),y.onAfterRender(S,N,z,H,F,tt)}function Hr(y,N,z){N.isScene!==!0&&(N=Tt);const H=Mt.get(y),F=p.state.lights,tt=p.state.shadowsArray,ct=F.state.version,_t=q.getParameters(y,F.state,tt,N,z),ft=q.getProgramCacheKey(_t);let Pt=H.programs;H.environment=y.isMeshStandardMaterial?N.environment:null,H.fog=N.fog,H.envMap=(y.isMeshStandardMaterial?xe:Re).get(y.envMap||H.environment),H.envMapRotation=H.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,Pt===void 0&&(y.addEventListener("dispose",K),Pt=new Map,H.programs=Pt);let Dt=Pt.get(ft);if(Dt!==void 0){if(H.currentProgram===Dt&&H.lightsStateVersion===ct)return Qa(y,_t),Dt}else _t.uniforms=q.getUniforms(y),y.onBeforeCompile(_t,S),Dt=q.acquireProgram(_t,ft),Pt.set(ft,Dt),H.uniforms=_t.uniforms;const At=H.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(At.clippingPlanes=it.uniform),Qa(y,_t),H.needsLights=bu(y),H.lightsStateVersion=ct,H.needsLights&&(At.ambientLightColor.value=F.state.ambient,At.lightProbe.value=F.state.probe,At.directionalLights.value=F.state.directional,At.directionalLightShadows.value=F.state.directionalShadow,At.spotLights.value=F.state.spot,At.spotLightShadows.value=F.state.spotShadow,At.rectAreaLights.value=F.state.rectArea,At.ltc_1.value=F.state.rectAreaLTC1,At.ltc_2.value=F.state.rectAreaLTC2,At.pointLights.value=F.state.point,At.pointLightShadows.value=F.state.pointShadow,At.hemisphereLights.value=F.state.hemi,At.directionalShadowMap.value=F.state.directionalShadowMap,At.directionalShadowMatrix.value=F.state.directionalShadowMatrix,At.spotShadowMap.value=F.state.spotShadowMap,At.spotLightMatrix.value=F.state.spotLightMatrix,At.spotLightMap.value=F.state.spotLightMap,At.pointShadowMap.value=F.state.pointShadowMap,At.pointShadowMatrix.value=F.state.pointShadowMatrix),H.currentProgram=Dt,H.uniformsList=null,Dt}function Ja(y){if(y.uniformsList===null){const N=y.currentProgram.getUniforms();y.uniformsList=vs.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function Qa(y,N){const z=Mt.get(y);z.outputColorSpace=N.outputColorSpace,z.batching=N.batching,z.batchingColor=N.batchingColor,z.instancing=N.instancing,z.instancingColor=N.instancingColor,z.instancingMorph=N.instancingMorph,z.skinning=N.skinning,z.morphTargets=N.morphTargets,z.morphNormals=N.morphNormals,z.morphColors=N.morphColors,z.morphTargetsCount=N.morphTargetsCount,z.numClippingPlanes=N.numClippingPlanes,z.numIntersection=N.numClipIntersection,z.vertexAlphas=N.vertexAlphas,z.vertexTangents=N.vertexTangents,z.toneMapping=N.toneMapping}function yu(y,N,z,H,F){N.isScene!==!0&&(N=Tt),Gt.resetTextureUnits();const tt=N.fog,ct=H.isMeshStandardMaterial?N.environment:null,_t=E===null?S.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Yi,ft=(H.isMeshStandardMaterial?xe:Re).get(H.envMap||ct),Pt=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Dt=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),At=!!z.morphAttributes.position,Xt=!!z.morphAttributes.normal,ie=!!z.morphAttributes.color;let _e=Kn;H.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(_e=S.toneMapping);const he=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ae=he!==void 0?he.length:0,Rt=Mt.get(H),me=p.state.lights;if(Jt===!0&&($===!0||y!==M)){const Oe=y===M&&H.id===v;it.setState(H,y,Oe)}let Kt=!1;H.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==me.state.version||Rt.outputColorSpace!==_t||F.isBatchedMesh&&Rt.batching===!1||!F.isBatchedMesh&&Rt.batching===!0||F.isBatchedMesh&&Rt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Rt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Rt.instancing===!1||!F.isInstancedMesh&&Rt.instancing===!0||F.isSkinnedMesh&&Rt.skinning===!1||!F.isSkinnedMesh&&Rt.skinning===!0||F.isInstancedMesh&&Rt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Rt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Rt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Rt.instancingMorph===!1&&F.morphTexture!==null||Rt.envMap!==ft||H.fog===!0&&Rt.fog!==tt||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==it.numPlanes||Rt.numIntersection!==it.numIntersection)||Rt.vertexAlphas!==Pt||Rt.vertexTangents!==Dt||Rt.morphTargets!==At||Rt.morphNormals!==Xt||Rt.morphColors!==ie||Rt.toneMapping!==_e||Rt.morphTargetsCount!==ae)&&(Kt=!0):(Kt=!0,Rt.__version=H.version);let Xe=Rt.currentProgram;Kt===!0&&(Xe=Hr(H,N,F));let xi=!1,qe=!1,or=!1;const ge=Xe.getUniforms(),tn=Rt.uniforms;if(xt.useProgram(Xe.program)&&(xi=!0,qe=!0,or=!0),H.id!==v&&(v=H.id,qe=!0),xi||M!==y){xt.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ge.setValue(P,"projectionMatrix",y.projectionMatrix),ge.setValue(P,"viewMatrix",y.matrixWorldInverse);const We=ge.map.cameraPosition;We!==void 0&&We.setValue(P,gt.setFromMatrixPosition(y.matrixWorld)),Ut.logarithmicDepthBuffer&&ge.setValue(P,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ge.setValue(P,"isOrthographic",y.isOrthographicCamera===!0),M!==y&&(M=y,qe=!0,or=!0)}if(F.isSkinnedMesh){ge.setOptional(P,F,"bindMatrix"),ge.setOptional(P,F,"bindMatrixInverse");const Oe=F.skeleton;Oe&&(Oe.boneTexture===null&&Oe.computeBoneTexture(),ge.setValue(P,"boneTexture",Oe.boneTexture,Gt))}F.isBatchedMesh&&(ge.setOptional(P,F,"batchingTexture"),ge.setValue(P,"batchingTexture",F._matricesTexture,Gt),ge.setOptional(P,F,"batchingIdTexture"),ge.setValue(P,"batchingIdTexture",F._indirectTexture,Gt),ge.setOptional(P,F,"batchingColorTexture"),F._colorsTexture!==null&&ge.setValue(P,"batchingColorTexture",F._colorsTexture,Gt));const en=z.morphAttributes;if((en.position!==void 0||en.normal!==void 0||en.color!==void 0)&&et.update(F,z,Xe),(qe||Rt.receiveShadow!==F.receiveShadow)&&(Rt.receiveShadow=F.receiveShadow,ge.setValue(P,"receiveShadow",F.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(tn.envMap.value=ft,tn.flipEnvMap.value=ft.isCubeTexture&&ft.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&N.environment!==null&&(tn.envMapIntensity.value=N.environmentIntensity),qe&&(ge.setValue(P,"toneMappingExposure",S.toneMappingExposure),Rt.needsLights&&Eu(tn,or),tt&&H.fog===!0&&Z.refreshFogUniforms(tn,tt),Z.refreshMaterialUniforms(tn,H,V,j,p.state.transmissionRenderTarget[y.id]),vs.upload(P,Ja(Rt),tn,Gt)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(vs.upload(P,Ja(Rt),tn,Gt),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ge.setValue(P,"center",F.center),ge.setValue(P,"modelViewMatrix",F.modelViewMatrix),ge.setValue(P,"normalMatrix",F.normalMatrix),ge.setValue(P,"modelMatrix",F.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Oe=H.uniformsGroups;for(let We=0,Fs=Oe.length;We<Fs;We++){const ni=Oe[We];Bt.update(ni,Xe),Bt.bind(ni,Xe)}}return Xe}function Eu(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function bu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(y,N,z){const H=Mt.get(y);H.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Mt.get(y.texture).__webglTexture=N,Mt.get(y.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:z,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){const z=Mt.get(y);z.__webglFramebuffer=N,z.__useDefaultFramebuffer=N===void 0};const wu=P.createFramebuffer();this.setRenderTarget=function(y,N=0,z=0){E=y,A=N,C=z;let H=!0,F=null,tt=!1,ct=!1;if(y){const ft=Mt.get(y);if(ft.__useDefaultFramebuffer!==void 0)xt.bindFramebuffer(P.FRAMEBUFFER,null),H=!1;else if(ft.__webglFramebuffer===void 0)Gt.setupRenderTarget(y);else if(ft.__hasExternalTextures)Gt.rebindTextures(y,Mt.get(y.texture).__webglTexture,Mt.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const At=y.depthTexture;if(ft.__boundDepthTexture!==At){if(At!==null&&Mt.has(At)&&(y.width!==At.image.width||y.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Gt.setupDepthRenderbuffer(y)}}const Pt=y.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(ct=!0);const Dt=Mt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Dt[N])?F=Dt[N][z]:F=Dt[N],tt=!0):y.samples>0&&Gt.useMultisampledRTT(y)===!1?F=Mt.get(y).__webglMultisampledFramebuffer:Array.isArray(Dt)?F=Dt[z]:F=Dt,I.copy(y.viewport),O.copy(y.scissor),G=y.scissorTest}else I.copy(bt).multiplyScalar(V).floor(),O.copy(Ht).multiplyScalar(V).floor(),G=ce;if(z!==0&&(F=wu),xt.bindFramebuffer(P.FRAMEBUFFER,F)&&H&&xt.drawBuffers(y,F),xt.viewport(I),xt.scissor(O),xt.setScissorTest(G),tt){const ft=Mt.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+N,ft.__webglTexture,z)}else if(ct){const ft=N;for(let Pt=0;Pt<y.textures.length;Pt++){const Dt=Mt.get(y.textures[Pt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Pt,Dt.__webglTexture,z,ft)}}else if(y!==null&&z!==0){const ft=Mt.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ft.__webglTexture,z)}v=-1},this.readRenderTargetPixels=function(y,N,z,H,F,tt,ct,_t=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ft=Mt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ct!==void 0&&(ft=ft[ct]),ft){xt.bindFramebuffer(P.FRAMEBUFFER,ft);try{const Pt=y.textures[_t],Dt=Pt.format,At=Pt.type;if(!Ut.textureFormatReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ut.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-H&&z>=0&&z<=y.height-F&&(y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+_t),P.readPixels(N,z,H,F,Et.convert(Dt),Et.convert(At),tt))}finally{const Pt=E!==null?Mt.get(E).__webglFramebuffer:null;xt.bindFramebuffer(P.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(y,N,z,H,F,tt,ct,_t=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ft=Mt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ct!==void 0&&(ft=ft[ct]),ft)if(N>=0&&N<=y.width-H&&z>=0&&z<=y.height-F){xt.bindFramebuffer(P.FRAMEBUFFER,ft);const Pt=y.textures[_t],Dt=Pt.format,At=Pt.type;if(!Ut.textureFormatReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ut.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Xt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Xt),P.bufferData(P.PIXEL_PACK_BUFFER,tt.byteLength,P.STREAM_READ),y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+_t),P.readPixels(N,z,H,F,Et.convert(Dt),Et.convert(At),0);const ie=E!==null?Mt.get(E).__webglFramebuffer:null;xt.bindFramebuffer(P.FRAMEBUFFER,ie);const _e=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await mh(P,_e,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Xt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,tt),P.deleteBuffer(Xt),P.deleteSync(_e),tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,z=0){const H=Math.pow(2,-z),F=Math.floor(y.image.width*H),tt=Math.floor(y.image.height*H),ct=N!==null?N.x:0,_t=N!==null?N.y:0;Gt.setTexture2D(y,0),P.copyTexSubImage2D(P.TEXTURE_2D,z,0,0,ct,_t,F,tt),xt.unbindTexture()};const Tu=P.createFramebuffer(),Au=P.createFramebuffer();this.copyTextureToTexture=function(y,N,z=null,H=null,F=0,tt=null){tt===null&&(F!==0?(Pr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),tt=F,F=0):tt=0);let ct,_t,ft,Pt,Dt,At,Xt,ie,_e;const he=y.isCompressedTexture?y.mipmaps[tt]:y.image;if(z!==null)ct=z.max.x-z.min.x,_t=z.max.y-z.min.y,ft=z.isBox3?z.max.z-z.min.z:1,Pt=z.min.x,Dt=z.min.y,At=z.isBox3?z.min.z:0;else{const en=Math.pow(2,-F);ct=Math.floor(he.width*en),_t=Math.floor(he.height*en),y.isDataArrayTexture?ft=he.depth:y.isData3DTexture?ft=Math.floor(he.depth*en):ft=1,Pt=0,Dt=0,At=0}H!==null?(Xt=H.x,ie=H.y,_e=H.z):(Xt=0,ie=0,_e=0);const ae=Et.convert(N.format),Rt=Et.convert(N.type);let me;N.isData3DTexture?(Gt.setTexture3D(N,0),me=P.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Gt.setTexture2DArray(N,0),me=P.TEXTURE_2D_ARRAY):(Gt.setTexture2D(N,0),me=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,N.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,N.unpackAlignment);const Kt=P.getParameter(P.UNPACK_ROW_LENGTH),Xe=P.getParameter(P.UNPACK_IMAGE_HEIGHT),xi=P.getParameter(P.UNPACK_SKIP_PIXELS),qe=P.getParameter(P.UNPACK_SKIP_ROWS),or=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,he.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,he.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Pt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Dt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,At);const ge=y.isDataArrayTexture||y.isData3DTexture,tn=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){const en=Mt.get(y),Oe=Mt.get(N),We=Mt.get(en.__renderTarget),Fs=Mt.get(Oe.__renderTarget);xt.bindFramebuffer(P.READ_FRAMEBUFFER,We.__webglFramebuffer),xt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Fs.__webglFramebuffer);for(let ni=0;ni<ft;ni++)ge&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Mt.get(y).__webglTexture,F,At+ni),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Mt.get(N).__webglTexture,tt,_e+ni)),P.blitFramebuffer(Pt,Dt,ct,_t,Xt,ie,ct,_t,P.DEPTH_BUFFER_BIT,P.NEAREST);xt.bindFramebuffer(P.READ_FRAMEBUFFER,null),xt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(F!==0||y.isRenderTargetTexture||Mt.has(y)){const en=Mt.get(y),Oe=Mt.get(N);xt.bindFramebuffer(P.READ_FRAMEBUFFER,Tu),xt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Au);for(let We=0;We<ft;We++)ge?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,en.__webglTexture,F,At+We):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,en.__webglTexture,F),tn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Oe.__webglTexture,tt,_e+We):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Oe.__webglTexture,tt),F!==0?P.blitFramebuffer(Pt,Dt,ct,_t,Xt,ie,ct,_t,P.COLOR_BUFFER_BIT,P.NEAREST):tn?P.copyTexSubImage3D(me,tt,Xt,ie,_e+We,Pt,Dt,ct,_t):P.copyTexSubImage2D(me,tt,Xt,ie,Pt,Dt,ct,_t);xt.bindFramebuffer(P.READ_FRAMEBUFFER,null),xt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else tn?y.isDataTexture||y.isData3DTexture?P.texSubImage3D(me,tt,Xt,ie,_e,ct,_t,ft,ae,Rt,he.data):N.isCompressedArrayTexture?P.compressedTexSubImage3D(me,tt,Xt,ie,_e,ct,_t,ft,ae,he.data):P.texSubImage3D(me,tt,Xt,ie,_e,ct,_t,ft,ae,Rt,he):y.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,tt,Xt,ie,ct,_t,ae,Rt,he.data):y.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,tt,Xt,ie,he.width,he.height,ae,he.data):P.texSubImage2D(P.TEXTURE_2D,tt,Xt,ie,ct,_t,ae,Rt,he);P.pixelStorei(P.UNPACK_ROW_LENGTH,Kt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Xe),P.pixelStorei(P.UNPACK_SKIP_PIXELS,xi),P.pixelStorei(P.UNPACK_SKIP_ROWS,qe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,or),tt===0&&N.generateMipmaps&&P.generateMipmap(me),xt.unbindTexture()},this.initRenderTarget=function(y){Mt.get(y).__webglFramebuffer===void 0&&Gt.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Gt.setTextureCube(y,0):y.isData3DTexture?Gt.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Gt.setTexture2DArray(y,0):Gt.setTexture2D(y,0),xt.unbindTexture()},this.resetState=function(){A=0,C=0,E=null,xt.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}}const pt=Object.freeze({width:18,depth:13,height:7,eye:1.65,ipd:.064,wallThickness:.5}),$t=Object.freeze({zNorth:-pt.depth/2+.02,zSouth:pt.depth/2-.02,xWest:-pt.width/2+.02,xEast:pt.width/2-.02}),Un=Object.freeze({sun:{color:16769725,intensity:4.4,position:[13.5,11.5,5.4]},sky:{color:13031142,ground:4864298,intensity:1.55},chandeliers:[{position:[0,5.15,-2.2],color:16767136,intensity:42},{position:[0,5.15,3],color:16765856,intensity:36}]}),zn=Object.freeze([{id:"matisse",title:"Танец",author:"Анри Матисс",year:"1910",technique:"Холст, масло. 260 × 391 см",room:"Зал 1 · Северная стена",file:"art/matisse-dance.webp",thumb:"art/matisse-dance-thumb.jpg",width:3.3,height:2.1,position:[-3.6,2.55,$t.zNorth],rotationY:0,light:"spot",note:"«Танец» писался для московского особняка Щукина; в Эрмитаж полотно поступило из Государственного музея нового западного искусства."},{id:"aivazovsky",title:"Девятый вал",author:"Иван Айвазовский",year:"1850",technique:"Холст, масло. 221 × 332 см",room:"Зал 1 · Северная стена",file:"art/aivazovsky-ninth-wave.webp",thumb:"art/aivazovsky-ninth-wave-thumb.jpg",width:2.9,height:1.86,position:[3.6,2.55,$t.zNorth],rotationY:0,light:"spot",note:"Самая известная марина Айвазовского: шестеро спасшихся держатся за обломок мачты, а над ними встаёт девятый вал."},{id:"rembrandt",title:"Возвращение блудного сына",author:"Рембрандт Харменс ван Рейн",year:"ок. 1668",technique:"Холст, масло. 262 × 205 см",room:"Зал 1 · Западная стена",file:"art/rembrandt-prodigal.webp",thumb:"art/rembrandt-prodigal-thumb.jpg",width:1.95,height:2.5,position:[$t.xWest,2.45,-3.4],rotationY:Math.PI/2,light:"spot",note:"Одна из последних работ Рембрандта. Свет выхватывает руки отца и рубище сына; справа стоит старший сын."},{id:"leonardo",title:"Мадонна с Младенцем (Мадонна Литта)",author:"Леонардо да Винчи",year:"1491–1495",technique:"Дерево, масло, темпера. 42 × 33 см",room:"Зал 1 · Западная стена",file:"art/leonardo-litta.webp",thumb:"art/leonardo-litta-thumb.jpg",width:1.24,height:1.54,position:[$t.xWest,2.4,3.4],rotationY:Math.PI/2,light:"spot",note:"Мадонна кормит Младенца грудью — редкий для Леонардо мотив. Полотно поступило в Эрмитаж в 1865 году."},{id:"monet",title:"Женщина в саду. Сент-Адресс",author:"Клод Моне",year:"1867",technique:"Холст, масло. 82 × 100 см",room:"Зал 1 · Южная стена",file:"art/monet-garden.webp",thumb:"art/monet-garden-thumb.jpg",width:1.82,height:1.5,position:[-4.4,2.42,$t.zSouth],rotationY:Math.PI,light:"spot",note:"Моне писал сад в Сент-Адрессе, где прошло его детство. Белое платье кузины — единственное светлое пятно в тени."},{id:"vangogh",title:"Куст сирени",author:"Винсент ван Гог",year:"1889",technique:"Холст, масло. 73 × 92 см",room:"Зал 1 · Южная стена",file:"art/van-gogh-lilac.webp",thumb:"art/van-gogh-lilac-thumb.jpg",width:1.64,height:1.3,position:[4.4,2.42,$t.zSouth],rotationY:Math.PI,light:"spot",note:"Написано в Сен-Реми, куда ван Гог приехал летом 1889 года. Сирень он писал как плотное облако цвета."}]),Ir=Object.freeze([{id:"venus",title:"Афродита Милосская (Венера Милосская)",author:"Александр Антиохийский (предположительно)",year:"ок. 130–100 до н. э.",technique:"Мрамор · в экспозиции зала — гипсовый слепок",room:"Зал 1 · Северо-восточный угол",file:"sculpture/venus-de-milo.json",modelHeight:2,standHeight:.52,position:[7.45,0,-4.75],rotationY:-.86,stand:"marble",scale:1},{id:"homer",title:"Гомер. Портрет",author:"Неизвестный скульптор",year:"ок. 460 до н. э. (римская копия)",technique:"Мрамор · гипсовый слепок",room:"Зал 1 · Западная стена",file:"sculpture/homer.json",modelHeight:.7,standHeight:1,position:[-8.2,0,0],rotationY:Math.PI/2,stand:"malachite",scale:1}]),Br=Object.freeze([{id:"p1",name:"У входа",hint:"Отсюда виден весь зал",position:[0,5],anchor:[-1,2.5,$t.zNorth]},{id:"p2",name:"Сирень",hint:"Ван Гог близко",position:[4.4,3.95],anchor:[4.4,2.42,$t.zSouth]},{id:"p3",name:"Середина зала",hint:"Между Матиссом и Айвазовским",position:[.4,1.1],anchor:[1.6,2.4,$t.zNorth]},{id:"p4",name:"Сад Моне",hint:"Сент-Адресс",position:[-4.4,3.95],anchor:[-4.4,2.42,$t.zSouth]},{id:"p5",name:"Гомер",hint:"Бюст у западной стены",position:[-6.95,-.45],anchor:[-8.2,1.34,0]},{id:"p6",name:"Рембрандт",hint:"Западная стена",position:[-6.2,-3.55],anchor:[$t.xWest,2.45,-3.4]},{id:"p7",name:"Венера",hint:"Северо-восточный угол",position:[5.15,-3.35],anchor:[7.45,1.15,-4.75]},{id:"p8",name:"Танец",hint:"Матисс во всю стену",position:[-2.5,-3.6],anchor:[-3.6,2.45,$t.zNorth]},{id:"p9",name:"Леонардо",hint:"Мадонна Литта",position:[-6.2,3.4],anchor:[$t.xWest,2.4,3.4]}]);function Ba(i){return[Math.sin(i),0,Math.cos(i)]}function Qc(i,t){const e=t[0]-i[0],n=t[1]-i[1],r=t[2]-i[2],s=Math.hypot(e,r)||1e-6;return{yaw:Math.atan2(e,-r),pitch:Math.atan2(n,s)}}function Hn(i,t=pt.eye){const e=[i.position[0],t,i.position[1]];return Qc(e,i.anchor)}const sr="p1",tu=10,Xg=6,qg=.45,eu=10,Yg=26,$g=1.1;function Ze(i){return Br.find(t=>t.id===i)||null}function Lr(i){return zn.find(t=>t.id===i)||null}const za=Object.freeze([...zn.map(i=>({id:i.id,kind:"painting",title:i.title,author:i.author,year:i.year,position:i.position,width:i.width,height:i.height})),...Ir.map(i=>({id:i.id,kind:"sculpture",title:i.title,author:i.author,year:i.year,position:[i.position[0],i.standHeight+i.modelHeight*.55,i.position[2]],width:.8,height:i.modelHeight}))]);function Ha(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},o={},a=i[0].morphTargetsRelative,l=new Fe;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in s){const u=oc(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);const g=oc(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function oc(i){let t,e,n,r=-1,s=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const o=new t(s),a=new ke(o,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const _=h.getComponent(d,g);a.setComponent(d+u,g,_)}}else o.set(h.array,l);l+=h.count*e}return r!==void 0&&(a.gpuType=r),a}function wn(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}let ma=1;function Kg(i){ma=Math.max(.35,Math.min(1,i))}function Je(i,t){const e=document.createElement("canvas");e.width=Math.max(64,Math.round(i*ma)),e.height=Math.max(64,Math.round(t*ma));const n=e.getContext("2d");return{canvas:e,ctx:n}}function Qe(i,{repeat:t=[1,1],srgb:e=!0,anisotropy:n=8}={}){const r=new nr(i);return r.wrapS=br,r.wrapT=br,r.repeat.set(t[0],t[1]),r.anisotropy=n,e&&(r.colorSpace=Me),r.needsUpdate=!0,r}function jg(i=7){const{canvas:n,ctx:r}=Je(1024,1024),s=wn(i),o=1024/3;r.fillStyle="#4d341f",r.fillRect(0,0,1024,1024);const a=(c,h,u,d,f,g)=>{r.save(),r.translate(c+u/2,h+d/2),r.rotate(g);const _=r.createLinearGradient(-u/2,-d/2,u/2,d/2);_.addColorStop(0,f[0]),_.addColorStop(.5,f[1]),_.addColorStop(1,f[2]),r.fillStyle=_,r.fillRect(-u/2,-d/2,u,d),r.globalAlpha=.22;for(let m=0;m<9;m+=1){const p=-d/2+(m+s()*.7)*(d/9);r.strokeStyle=s()>.5?"#2f1d0f":"#8a5f38",r.lineWidth=.8+s()*1.4,r.beginPath(),r.moveTo(-u/2,p),r.bezierCurveTo(-u/6,p+(s()-.5)*5,u/6,p+(s()-.5)*5,u/2,p+(s()-.5)*3),r.stroke()}r.globalAlpha=1,r.strokeStyle="rgba(24,14,6,0.85)",r.lineWidth=3,r.strokeRect(-u/2,-d/2,u,d),r.restore()},l=()=>{const c=.86+s()*.24,h=Math.round(126*c),u=Math.round(88*c),d=Math.round(54*c);return[`rgb(${h+16},${u+12},${d+8})`,`rgb(${h},${u},${d})`,`rgb(${h-18},${u-14},${d-10})`]};for(let c=0;c<3;c+=1)for(let h=0;h<3;h+=1){const u=c*o,d=h*o,f=o*.17;a(u,d,o,f,l(),0),a(u,d+o-f,o,f,l(),0),a(u,d+f,f,o-f*2,l(),Math.PI/2),a(u+o-f,d+f,f,o-f*2,l(),Math.PI/2);const g=u+f,_=d+f,m=o-f*2,p=5,b=m*2/p;for(let w=-p;w<p;w+=1){const S=g+w*b*.5;r.save(),r.beginPath(),r.rect(g,_,m,m),r.clip(),a(S,_-m*.2,m*.34,m*1.5,l(),Math.PI/4),r.restore()}}return Qe(n,{repeat:[3,2.2]})}function Zg(i=11){const{canvas:e,ctx:n}=Je(512,512),r=wn(i),s=n.createLinearGradient(0,0,0,512);s.addColorStop(0,"#22463a"),s.addColorStop(.5,"#1b3b31"),s.addColorStop(1,"#183429"),n.fillStyle=s,n.fillRect(0,0,512,512);const o=512/2;for(let a=0;a<2;a+=1)for(let l=0;l<2;l+=1){const c=a*o+o/2,h=l*o+o/2;n.save(),n.translate(c,h),n.rotate(Math.PI/4),n.strokeStyle="rgba(126,168,132,0.30)",n.lineWidth=5,n.strokeRect(-o*.32,-o*.32,o*.64,o*.64),n.strokeStyle="rgba(10,24,18,0.35)",n.lineWidth=2,n.strokeRect(-o*.27,-o*.27,o*.54,o*.54);for(let u=0;u<8;u+=1)n.rotate(Math.PI/4),n.beginPath(),n.ellipse(0,-o*.16,o*.045,o*.1,0,0,Math.PI*2),n.strokeStyle="rgba(150,186,150,0.24)",n.lineWidth=2,n.stroke();n.beginPath(),n.arc(0,0,o*.035,0,Math.PI*2),n.fillStyle="rgba(168,196,150,0.35)",n.fill(),n.restore()}n.globalAlpha=.18;for(let a=0;a<4200;a+=1)n.fillStyle=r()>.5?"#2f5a48":"#122b22",n.fillRect(r()*512,r()*512,1.2,1.2);return n.globalAlpha=1,Qe(e,{repeat:[5,2.4]})}function nu(i=23){const{canvas:e,ctx:n}=Je(512,512),r=wn(i);n.fillStyle="#efeee6",n.fillRect(0,0,512,512);for(let s=0;s<26;s+=1){n.beginPath();let o=r()*512,a=r()*512;n.moveTo(o,a);const l=8+Math.floor(r()*10);for(let c=0;c<l;c+=1)o+=(r()-.5)*90,a+=(r()-.3)*60,n.lineTo(o,a);n.strokeStyle=`rgba(${120+r()*50},${120+r()*50},${118+r()*45},${.1+r()*.16})`,n.lineWidth=.6+r()*2.6,n.stroke()}n.globalAlpha=.1;for(let s=0;s<2400;s+=1)n.fillStyle=r()>.5?"#ffffff":"#b9b6ad",n.fillRect(r()*512,r()*512,1.4,1.4);return n.globalAlpha=1,Qe(e,{repeat:[1,1]})}function iu(i=31){const{canvas:e,ctx:n}=Je(512,512),r=wn(i);n.fillStyle="#2f8a5c",n.fillRect(0,0,512,512);for(let s=0;s<40;s+=1){const o=s/40*512+(r()-.5)*8;n.beginPath(),n.moveTo(0,o);for(let a=0;a<=512;a+=16)n.lineTo(a,o+Math.sin(a/512*Math.PI*(2+r()*3)+s)*(5+r()*9));n.strokeStyle=s%2?"rgba(168,232,190,0.62)":"rgba(28,110,72,0.85)",n.lineWidth=2+r()*8,n.stroke()}return Qe(e,{repeat:[1,1]})}function Jg(i=37){const{canvas:e,ctx:n}=Je(1024,1024),r=wn(i);n.fillStyle="#1d5c3d",n.fillRect(0,0,1024,1024);for(let s=0;s<30;s+=1){const o=s/30*1024+(r()-.5)*18;n.beginPath(),n.moveTo(0,o);for(let a=0;a<=1024;a+=32)n.lineTo(a,o+Math.sin(a/1024*Math.PI*(1.3+r()*1.6)+s*.7)*(16+r()*26));n.strokeStyle=s%2?"rgba(122,198,150,0.30)":"rgba(12,66,42,0.62)",n.lineWidth=9+r()*20,n.lineCap="round",n.stroke()}for(let s=0;s<18;s+=1){n.beginPath();const o=r()*1024;n.moveTo(o,0);for(let a=0;a<=1024;a+=48)n.lineTo(o+Math.sin(a/90+s)*22,a);n.strokeStyle="rgba(178,228,196,0.13)",n.lineWidth=3+r()*6,n.stroke()}return Qe(e,{repeat:[1,1],anisotropy:8})}function Qg(i=41){const{canvas:n,ctx:r}=Je(1024,640),s=wn(i),o=r.createLinearGradient(0,0,0,640);o.addColorStop(0,"#2c4a72"),o.addColorStop(.45,"#5f7fa6"),o.addColorStop(.72,"#c7a98a"),o.addColorStop(1,"#8a6a55"),r.fillStyle=o,r.fillRect(0,0,1024,640);for(let a=0;a<60;a+=1){const l=s()*1024,c=640*(.15+s()*.7),h=40+s()*170,u=10+s()*34,d=r.createRadialGradient(l,c,2,l,c,h);d.addColorStop(0,`rgba(255,231,201,${.2+s()*.22})`),d.addColorStop(1,"rgba(255,231,201,0)"),r.fillStyle=d,r.beginPath(),r.ellipse(l,c,h,u,0,0,Math.PI*2),r.fill()}return r.save(),r.translate(1024/2,640/2),r.scale(1,640/1024),r.beginPath(),r.arc(0,0,1024*.46,0,Math.PI*2),r.restore(),r.strokeStyle="rgba(198,158,88,0.9)",r.lineWidth=22,r.stroke(),r.strokeStyle="rgba(255,228,168,0.55)",r.lineWidth=6,r.stroke(),Qe(n,{repeat:[1,1]})}function t0(i=53){const{canvas:n,ctx:r}=Je(768,512),s=wn(i);r.fillStyle="#5e1420",r.fillRect(0,0,768,512);const o=r.createRadialGradient(768/2,512/2,40,768/2,512/2,768*.62);o.addColorStop(0,"#8e2a32"),o.addColorStop(1,"#4a0e1a"),r.fillStyle=o,r.fillRect(18,18,732,476),r.strokeStyle="#c9a24a",r.lineWidth=16,r.strokeRect(26,26,716,460),r.strokeStyle="#8d6a2a",r.lineWidth=4,r.strokeRect(52,52,664,408),r.save(),r.translate(768/2,512/2);for(let a=0;a<16;a+=1)r.rotate(Math.PI/8),r.beginPath(),r.ellipse(0,-512*.2,22,74,0,0,Math.PI*2),r.strokeStyle="rgba(201,162,74,0.45)",r.lineWidth=6,r.stroke();r.beginPath(),r.arc(0,0,52,0,Math.PI*2),r.strokeStyle="rgba(226,192,120,0.7)",r.lineWidth=10,r.stroke(),r.restore(),r.globalAlpha=.16;for(let a=0;a<5e3;a+=1)r.fillStyle=s()>.5?"#c58a6a":"#3d0a13",r.fillRect(s()*768,s()*512,1.6,1.6);return r.globalAlpha=1,Qe(n,{repeat:[1,1]})}function e0(i=61){const{canvas:n,ctx:r}=Je(768,1024),s=wn(i),o=r.createLinearGradient(0,0,0,1024*.62);o.addColorStop(0,"#7f9dc4"),o.addColorStop(.45,"#c9b6b0"),o.addColorStop(.72,"#f0c08a"),o.addColorStop(1,"#f7d9ab"),r.fillStyle=o,r.fillRect(0,0,768,1024*.62);for(let c=0;c<26;c+=1){const h=1024*(.05+s()*.42);r.beginPath(),r.ellipse(s()*768,h,60+s()*150,6+s()*16,0,0,Math.PI*2),r.fillStyle=`rgba(255,230,205,${.08+s()*.16})`,r.fill()}r.fillStyle="rgba(52,50,62,0.92)",r.fillRect(0,1024*.55,768,1024*.07);for(let c=0;c<40;c+=1){const h=14+s()*46,u=14+s()*52,d=s()*768;r.fillRect(d,1024*.55-u,h,u+6),s()>.7&&r.fillRect(d+h*.4,1024*.55-u-22,4,22)}const a=768*.62;r.fillStyle="rgba(44,42,55,0.95)",r.fillRect(a-26,1024*.5-74,52,120),r.beginPath(),r.moveTo(a-26,1024*.5-74),r.lineTo(a,1024*.5-128),r.lineTo(a+26,1024*.5-74),r.closePath(),r.fill(),r.fillRect(a-2,1024*.5-246,4,122),r.beginPath(),r.arc(a,1024*.5-250,5,0,Math.PI*2),r.fill();const l=r.createLinearGradient(0,1024*.62,0,1024);l.addColorStop(0,"#a9a2ab"),l.addColorStop(.35,"#6b7f96"),l.addColorStop(1,"#2f4358"),r.fillStyle=l,r.fillRect(0,1024*.62,768,1024*.38);for(let c=0;c<220;c+=1){const h=1024*(.62+s()*.38),u=10+s()*90;r.fillStyle=`rgba(255,214,168,${.05+s()*.22})`,r.fillRect(s()*768,h,u,2+s()*2)}return Qe(n,{repeat:[1,1]})}function n0(i=79){const{canvas:n,ctx:r}=Je(512,512),s=wn(i),o=r.createLinearGradient(0,0,512*.6,512);o.addColorStop(0,"#2c3a3a"),o.addColorStop(.45,"#546462"),o.addColorStop(.75,"#3a4746"),o.addColorStop(1,"#1d2827"),r.fillStyle=o,r.fillRect(0,0,512,512);for(let a=0;a<5;a+=1){const l=40+a*95+s()*20,c=150+s()*90;r.fillStyle=`rgba(255,226,178,${.05+s()*.08})`,r.fillRect(l,c,60+s()*40,120+s()*90)}r.fillStyle="rgba(214,178,110,0.10)",r.fillRect(30,60,452,18),r.fillStyle="rgba(214,178,110,0.07)",r.fillRect(30,392,452,26);for(let a=0;a<700;a+=1)r.fillStyle=s()>.5?"rgba(255,250,235,0.05)":"rgba(10,16,15,0.08)",r.fillRect(s()*512,s()*512,2+s()*5,1+s()*2);return Qe(n,{repeat:[1,1]})}function i0(i=71){const{canvas:n,ctx:r}=Je(384,768),s=wn(i),o=r.createLinearGradient(0,0,384,0);o.addColorStop(0,"#4a2c16"),o.addColorStop(.5,"#63391c"),o.addColorStop(1,"#432712"),r.fillStyle=o,r.fillRect(0,0,384,768);for(let l=0;l<260;l+=1){r.strokeStyle=`rgba(${20+s()*40},${12+s()*20},${6+s()*12},0.5)`,r.lineWidth=1+s()*2;const c=s()*768;r.beginPath(),r.moveTo(0,c),r.bezierCurveTo(384*.3,c+(s()-.5)*18,384*.7,c+(s()-.5)*18,384,c),r.stroke()}const a=(l,c,h,u)=>{r.strokeStyle="#c9a24a",r.lineWidth=6,r.strokeRect(l,c,h,u),r.strokeStyle="rgba(30,16,6,0.8)",r.lineWidth=2,r.strokeRect(l+9,c+9,h-18,u-18)};return a(26,26,332,768*.3),a(26,768*.36,332,768*.28),a(26,768*.68,332,768*.26),Qe(n,{repeat:[1,1]})}function ac(){const{canvas:t,ctx:e}=Je(256,256),n=e.createRadialGradient(256/2,256/2,0,256/2,256/2,256/2);n.addColorStop(0,"rgba(255, 238, 206, 0.9)"),n.addColorStop(.42,"rgba(255, 222, 176, 0.34)"),n.addColorStop(.75,"rgba(255, 214, 164, 0.09)"),n.addColorStop(1,"rgba(255, 210, 160, 0)"),e.fillStyle=n,e.fillRect(0,0,256,256);const r=Qe(t,{anisotropy:1});return r.wrapS=Dn,r.wrapT=Dn,r}function r0(i,{width:t=1024,height:e=512,align:n="center"}={}){const{canvas:r,ctx:s}=Je(t,e),o=s.createLinearGradient(0,0,t,e);o.addColorStop(0,"#9c8348"),o.addColorStop(.35,"#d8bc77"),o.addColorStop(.6,"#b8974f"),o.addColorStop(1,"#8b7439"),s.fillStyle=o,s.fillRect(0,0,t,e),s.strokeStyle="rgba(58,44,18,0.8)",s.lineWidth=10,s.strokeRect(12,12,t-24,e-24),s.fillStyle="#2c2413",s.textAlign=n,s.textBaseline="middle";const a=n==="center"?t/2:54,l=[52,40,32,28];let c=e*.2;return i.forEach((h,u)=>{s.font=`${u===0?"600":"400"} ${l[Math.min(u,l.length-1)]}px "Georgia", "Times New Roman", serif`,s.fillText(h,a,c),c+=l[Math.min(u,l.length-1)]*1.42}),s.strokeStyle="rgba(255,244,208,0.45)",s.lineWidth=3,s.strokeRect(20,20,t-40,e-40),Qe(r,{repeat:[1,1]})}function s0(i){const{canvas:e,ctx:n}=Je(512,512);n.clearRect(0,0,512,512);const r=n.createRadialGradient(512*.4,512*.35,20,512/2,512/2,512*.5);return r.addColorStop(0,"#e9d6a0"),r.addColorStop(.55,"#c3a45f"),r.addColorStop(1,"#7c6229"),n.fillStyle=r,n.beginPath(),n.arc(512/2,512/2,512*.47,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(58,44,18,0.75)",n.lineWidth=10,n.beginPath(),n.arc(512/2,512/2,512*.41,0,Math.PI*2),n.stroke(),n.fillStyle="#3a2d14",n.textAlign="center",n.textBaseline="middle",n.font='600 210px Georgia, "Times New Roman", serif',n.fillText(String(i),512/2,512*.53),Qe(e,{repeat:[1,1]})}function o0(i="high"){Kg(i==="high"?1:.75);const t=jg();t.repeat.set(1,1);const e=Zg(),n=nu(),r=iu(),s=Qg(),o=t0(),a=e0(),l=i0(),c=n0(),h=i==="high";return{parquet:new le({map:t,roughness:.38,metalness:.06,color:16777215}),silk:new le({map:e,roughness:.74,metalness:.03,color:14674143}),marble:new le({map:n,roughness:.58,metalness:0,color:15921384,envMapIntensity:.35}),malachite:new le({map:r,roughness:.24,metalness:.32,color:16777215}),gold:new le({color:15123580,roughness:h?.42:.52,metalness:.7,emissive:2760460,emissiveIntensity:.35,envMapIntensity:.8}),brass:new le({color:11045450,roughness:.55,metalness:.7,envMapIntensity:.8}),cream:new le({color:15327695,roughness:.88,metalness:0,envMapIntensity:.25}),plaster:new le({color:15788506,roughness:.94,metalness:0,envMapIntensity:.2}),wood:new le({map:l,roughness:.42,metalness:.08,color:16777215}),velvet:new le({color:7150118,roughness:.92,metalness:0}),rug:new le({map:o,roughness:.95,metalness:0}),plafond:new le({map:s,roughness:.86,metalness:.02,color:14673648,emissive:3885667,emissiveIntensity:.42,emissiveMap:s}),ceiling:new le({color:15129798,roughness:.9,metalness:.02,emissive:3813154,emissiveIntensity:.55}),windowView:new je({map:a,toneMapped:!1,color:15984338}),glass:new le({color:12375264,roughness:.08,metalness:.1,transparent:!0,opacity:.16,side:sn,depthWrite:!1}),crystal:new le({color:16774884,roughness:.16,metalness:.12,emissive:16771524,emissiveIntensity:.5,envMapIntensity:1.1}),flame:new le({color:16768416,emissive:16760426,emissiveIntensity:2.4,roughness:.5}),iron:new le({color:2829099,roughness:.62,metalness:.65}),mirror:new le({map:c,color:9148820,roughness:.3,metalness:.45,envMapIntensity:.7,emissive:659471,emissiveIntensity:.6}),malachitePanel:new le({map:Jg(),color:9425067,roughness:.46,metalness:.12,emissive:732702,emissiveIntensity:.55,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1}),ember:new le({color:3806216,emissive:16738846,emissiveIntensity:1.3,roughness:.9})}}class a0{constructor(){this.buckets=new Map,this.matrix=new ee,this.quat=new En,this.scale=new U(1,1,1),this.pos=new U}add(t,e,{position:n=[0,0,0],rotationY:r=0,rotation:s=null,uvScale:o=null}={}){const a=(t.index,t);if(o){const l=a.getAttribute("uv");if(l){const[c,h]=Array.isArray(o)?o:[o,o];for(let u=0;u<l.count;u+=1)l.setXY(u,l.getX(u)*c,l.getY(u)*h);l.needsUpdate=!0}}return this.pos.set(n[0],n[1],n[2]),s?this.quat.setFromEuler(new Ne(s[0]||0,s[1]||0,s[2]||0)):this.quat.setFromEuler(new Ne(0,r,0)),this.matrix.compose(this.pos,this.quat,this.scale),a.applyMatrix4(this.matrix),this.buckets.has(e)||this.buckets.set(e,[]),this.buckets.get(e).push(a),a}box(t,e,n,r,s,o={}){return this.add(new un(t,e,n),r,{position:s,...o})}plane(t,e,n,r,s={}){const o=new ve(t,e,s.segX||1,s.segY||1);return this.add(o,n,{position:r,...s})}cylinder(t,e,n,r,s,o={}){return this.add(new ir(t,e,n,o.segments||16),r,{position:s,...o})}build(t,{castShadow:e=!1,receiveShadow:n=!0}={}){let r=0;for(const[s,o]of this.buckets){if(!o.length)continue;const a=Ha(o,!1);if(!a)continue;a.computeBoundingSphere();const l=new Zt(a,s);l.castShadow=e,l.receiveShadow=n,l.matrixAutoUpdate=!1,l.updateMatrix(),t.add(l),r+=1,o.forEach(c=>c.dispose())}return this.buckets.clear(),r}}function ki(i,t,{width:e,height:n,position:r,rotationY:s,uv:o}){const a=new ve(e,n);i.add(a,t.silk,{position:r,rotationY:s,uvScale:o||[e/3.6,n/3.6]})}function l0(i,t){const e=$t.xEast,n=pt.wallThickness,r=pt.depth/2,s=.95,o=5.15,a=[-4,0,4],l=2.2,c=[];let h=-r;for(const u of a)c.push([h,u-l/2]),h=u+l/2;c.push([h,r]);for(const[u,d]of c){const f=d-u;if(f<=.01)continue;const g=(u+d)/2;ki(i,t,{width:f,height:pt.height,position:[e,pt.height/2,g],rotationY:-Math.PI/2,uv:[f/3.6,pt.height/3.6]})}for(const u of a)ki(i,t,{width:l,height:s,position:[e,s/2,u],rotationY:-Math.PI/2,uv:[l/3.6,s/3.6]}),ki(i,t,{width:l,height:pt.height-o,position:[e,(o+pt.height)/2,u],rotationY:-Math.PI/2,uv:[l/3.6,(pt.height-o)/3.6]});for(const[u,d]of c){const f=d-u;f<=.01||i.box(n,pt.height,f,t.plaster,[e+n/2+.02,pt.height/2,(u+d)/2])}for(const u of a){const d=l+.22;i.box(.14,o-s+.3,.16,t.gold,[e-.06,(s+o)/2,u-d/2]),i.box(.14,o-s+.3,.16,t.gold,[e-.06,(s+o)/2,u+d/2]),i.box(.14,.16,d,t.gold,[e-.06,o+.07,u]),i.box(.26,.2,d+.2,t.marble,[e-.16,s-.02,u]),i.box(.12,o-s,.13,t.cream,[e-.03,(s+o)/2,u]);for(const _ of[-l/4,l/4])i.box(.12,o-s,.1,t.cream,[e-.03,(s+o)/2,u+_]);for(const _ of[s+1.35,s+2.7])i.box(.12,.1,l,t.cream,[e-.03,_,u]);const f=new ve(l,o-s);i.add(f,t.glass,{position:[e-.02,(s+o)/2,u],rotationY:-Math.PI/2});const g=new ve(l*2.4,(o-s)*1.9);i.add(g,t.windowView,{position:[e+1.4,(s+o)/2+.15,u],rotationY:-Math.PI/2})}}function c0(i,t){pt.width/2,pt.depth/2,ki(i,t,{width:pt.width,height:pt.height,position:[0,pt.height/2,$t.zNorth],rotationY:0}),ki(i,t,{width:pt.width,height:pt.height,position:[0,pt.height/2,$t.zSouth],rotationY:Math.PI}),ki(i,t,{width:pt.depth,height:pt.height,position:[$t.xWest,pt.height/2,0],rotationY:Math.PI/2}),l0(i,t);const e=(s,o,a,l,c,h,u=.09)=>{i.box(s,u,o,t.gold,[a,h,l],{rotationY:c})},n=[{w:pt.width,x:0,z:$t.zNorth+.03,rotY:0},{w:pt.width,x:0,z:$t.zSouth-.03,rotY:0},{w:pt.depth,x:$t.xWest+.03,z:0,rotY:Math.PI/2},{w:pt.depth,x:$t.xEast-.03,z:0,rotY:Math.PI/2}];for(const s of n)i.box(s.w,.34,.12,t.marble,[s.x,.17,s.z],{rotationY:s.rotY}),i.box(s.w,.06,.16,t.gold,[s.x,.36,s.z],{rotationY:s.rotY}),e(s.w,.14,s.x,s.z,s.rotY,1.02),e(s.w,.1,s.x,s.z,s.rotY,1.16),i.box(s.w,.3,.34,t.gold,[s.x,pt.height-.32,s.z],{rotationY:s.rotY}),i.box(s.w,.06,.24,t.cream,[s.x,pt.height-.14,s.z],{rotationY:s.rotY});const r=(s,o,a)=>{i.box(.46,pt.height-.7,.16,t.marble,[s,(pt.height-.7)/2,o],{rotationY:a,uvScale:[.6,2]}),i.box(.6,.2,.24,t.gold,[s,pt.height-.82,o],{rotationY:a}),i.box(.58,.14,.22,t.gold,[s,.42,o],{rotationY:a})};for(const s of[-7.4,1.85,-1.85,7.4])r(s,$t.zNorth+.1,0),r(s,$t.zSouth-.1,0);for(const s of[-5.55,5.55])r($t.xWest+.1,s,Math.PI/2);for(const s of[-2,2,5.15,-5.15])r($t.xEast-.1,s,Math.PI/2)}function u0(i,t){pt.width/2,pt.depth/2;const e=new ve(pt.width,pt.depth);i.add(e,t.parquet,{position:[0,0,0],rotation:[-Math.PI/2,0,0],uvScale:[pt.width/3,pt.depth/3]});const n=new ve(8.4,5.6);i.add(n,t.rug,{position:[0,.03,.4],rotation:[-Math.PI/2,0,0],uvScale:[1,1]});const r=new ve(pt.width,pt.depth);i.add(r,t.ceiling,{position:[0,pt.height,0],rotation:[Math.PI/2,0,0]});const s=new ve(11.6,7.2);i.add(s,t.plafond,{position:[0,pt.height-.03,0],rotation:[Math.PI/2,0,0]});for(const o of[-4.4,0,4.4])i.box(.16,.14,pt.depth-.6,t.gold,[o,pt.height-.05,0]);for(const o of[-3.2,0,3.2])i.box(pt.width-.6,.14,.16,t.gold,[0,pt.height-.05,o]);for(const o of Un.chandeliers)i.cylinder(.42,.52,.1,t.gold,[o.position[0],pt.height-.16,o.position[2]],{segments:24}),i.cylinder(.3,.3,.06,t.cream,[o.position[0],pt.height-.22,o.position[2]],{segments:20})}function h0(i,t){const e=$t.zNorth+.02;i.box(3,.18,.62,t.marble,[0,.09,e+.31]),i.box(.42,1.5,.5,t.marble,[-1.2,.75,e+.25]),i.box(.42,1.5,.5,t.marble,[1.2,.75,e+.25]),i.box(3,.34,.56,t.marble,[0,1.6,e+.28]),i.box(3.2,.12,.66,t.gold,[0,1.82,e+.33]);const n=new le({color:1643280,roughness:1});if(i.box(1.98,1.44,.04,n,[0,.72,e+.06]),i.box(.04,1.44,.42,n,[-.97,.72,e+.27]),i.box(.04,1.44,.42,n,[.97,.72,e+.27]),i.box(1.98,.04,.42,n,[0,1.43,e+.27]),i.box(1.98,.04,.42,n,[0,.02,e+.27]),!t.fireGlow){const s=document.createElement("canvas");s.width=128,s.height=64;const o=s.getContext("2d"),a=o.createRadialGradient(64,52,2,64,52,62);a.addColorStop(0,"rgba(255, 176, 96, 0.85)"),a.addColorStop(.45,"rgba(255, 120, 42, 0.32)"),a.addColorStop(1,"rgba(255, 90, 20, 0)"),o.fillStyle=a,o.fillRect(0,0,128,64);const l=new nr(s);l.colorSpace=Me,t.fireGlow=new je({map:l,transparent:!0,depthWrite:!1,blending:Fn,toneMapped:!1})}i.add(new ve(1.2,.5),t.fireGlow,{position:[0,.34,e+.42],uvScale:[1,1]}),i.box(1.5,.06,.16,new le({color:2365458,roughness:1}),[0,.16,e+.32]),i.box(1.24,.03,.13,t.ember,[0,.2,e+.33]);for(let s=0;s<3;s+=1)i.cylinder(.07,.07,.8,t.wood,[-.14+s*.14,.27+s%2*.09,e+.31],{segments:8,rotation:[0,0,Math.PI/2]});for(let s=-3;s<=3;s+=1)i.box(.018,.42,.018,t.iron,[s*.28,.28,e+.44]);i.box(1.72,.018,.018,t.iron,[0,.49,e+.44]),i.box(2.56,2.96,.12,t.gold,[0,3.58,e+.28]),i.box(2.28,2.68,.06,t.malachitePanel,[0,3.58,e+.36]);const r=.075;for(const[s,o,a,l]of[[2.2,r,0,1.27],[2.2,r,0,-1.27],[r,2.5,-1.1,0],[r,2.5,1.1,0]])i.box(s,o,.04,t.gold,[a,3.58+l,e+.4]);i.add(new Zn(.5,.045,10,40),t.gold,{position:[0,3.62,e+.455]}),i.add(new Zn(.29,.032,8,32),t.brass,{position:[0,3.62,e+.47]});for(let s=0;s<12;s+=1){const o=s/12*Math.PI*2;i.box(.045,.22,.026,t.gold,[Math.cos(o)*.395,3.62+Math.sin(o)*.395,e+.49],{rotation:[0,0,o-Math.PI/2]})}i.cylinder(.09,.09,.035,t.gold,[0,3.62,e+.51],{segments:16,rotation:[Math.PI/2,0,0]});for(const[s,o]of[[-.88,1.02],[.88,1.02],[-.88,-1.02],[.88,-1.02]])i.add(new Zn(.12,.022,8,20),t.gold,{position:[s,3.58+o,e+.42]})}function d0(i,t){const e=$t.zSouth-.02;i.box(3.9,.26,.5,t.marble,[0,4.85,e-.25]),i.box(.55,4.9,.5,t.marble,[-1.95,2.45,e-.25]),i.box(.55,4.9,.5,t.marble,[1.95,2.45,e-.25]),i.box(4.4,.12,.6,t.gold,[0,4.98,e-.3]);for(const n of[-1,1]){const r=new ve(1.34,4.3);i.add(r,t.wood,{position:[n*.68,2.15,e-.16],rotationY:Math.PI,uvScale:[1,1]}),i.box(1.44,.1,.12,t.gold,[n*.68,4.34,e-.16]),i.box(1.44,.1,.12,t.gold,[n*.68,.06,e-.16]),i.cylinder(.045,.045,.34,t.gold,[n*.16,2.05,e-.26],{segments:10})}}function f0(i,t,e,n){const[r,s,o]=n;i.cylinder(.018,.018,pt.height-s-.55,t.brass,[r,(pt.height+s)/2-.1,o],{segments:8}),i.cylinder(.06,.06,.65,t.brass,[r,s+.65,o],{segments:10}),i.add(new Zn(.62,.035,8,32),t.brass,{position:[r,s+.12,o],rotation:[Math.PI/2,0,0]}),i.add(new Zn(.44,.03,8,28),t.brass,{position:[r,s+.62,o],rotation:[Math.PI/2,0,0]}),i.add(new Zn(.8,.028,8,36),t.brass,{position:[r,s-.18,o],rotation:[Math.PI/2,0,0]});const a=8;for(let g=0;g<a;g+=1){const _=g/a*Math.PI*2,m=r+Math.cos(_)*.8,p=o+Math.sin(_)*.8;i.cylinder(.026,.026,.26,t.silk,[m,s+.1,p],{segments:6}),i.cylinder(.022,.022,.16,t.cream,[m,s+.29,p],{segments:6});const b=new Or(.04,8,6);i.add(b,t.flame,{position:[m,s+.42,p]});const w=.8,S=new ir(.014,.014,Math.hypot(w,.3),6);i.add(S,t.brass,{position:[r+Math.cos(_)*.4,s+.24,o+Math.sin(_)*.4],rotation:[0,-_,Math.PI/2-Math.atan2(.3,.8)]})}const l=new Da(.05,0),c=new Wh(l,t.crystal,96),h=new ee,u=new En,d=new U(1,1.6,1);let f=0;for(let g=0;g<30;g+=1){const _=g/30*Math.PI*2;for(const m of[.62,.8])u.setFromEuler(new Ne(0,-_,0)),h.compose(new U(r+Math.cos(_)*m,s-.06-(m>.7?.12:0),o+Math.sin(_)*m),u,d),c.setMatrixAt(f,h),f+=1}for(let g=0;g<36;g+=1){const _=g/36*Math.PI*2;u.setFromEuler(new Ne(0,-_,0)),h.compose(new U(r+Math.cos(_)*.46,s+.44,o+Math.sin(_)*.46),u,d),c.setMatrixAt(f,h),f+=1}c.count=f,c.instanceMatrix.needsUpdate=!0,c.castShadow=!1,c.frustumCulled=!1,e.add(c)}function p0(i,t){const e=(n,r)=>{i.box(1.7,.16,.58,t.velvet,[n,.46,r]),i.box(1.74,.06,.62,t.gold,[n,.37,r]);for(const s of[-.72,.72])for(const o of[-.22,.22])i.box(.07,.36,.07,t.gold,[n+s,.18,r+o]);i.box(1.6,.04,.5,t.velvet,[n,.55,r])};e(-3,5.35),e(3,5.35),e(-6.3,4.2)}function m0(i,t){const e=[[$t.xWest+.1,4.5,-5.4,Math.PI/2],[$t.xWest+.1,4.5,5.4,Math.PI/2],[-6.6,4.5,$t.zNorth+.1,0],[6.6,4.5,$t.zNorth+.1,0],[-6.6,4.5,$t.zSouth-.1,0],[6.6,4.5,$t.zSouth-.1,0]];for(const[n,r,s,o]of e){i.box(.16,.5,.1,t.gold,[n,r,s],{rotationY:o});for(const a of[-.18,0,.18]){const l=o===0?n+a:n+.16,c=o===0?s+.16:s+a;i.cylinder(.018,.018,.2,t.brass,[l,r+.24,c],{segments:6});const h=new Or(.035,8,6);i.add(h,t.flame,{position:[l,r+.4,c]})}}}function g0(){const i=document.createElement("canvas");i.width=128,i.height=128;const t=i.getContext("2d"),e=t.createRadialGradient(64,64,4,64,64,62);e.addColorStop(0,"rgba(0,0,0,0.55)"),e.addColorStop(.55,"rgba(0,0,0,0.24)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,128,128);const n=new nr(i);return n.colorSpace=Me,n}let xo=null;function xr(i,t,e,n,r=.55){xo||(xo=g0());const s=new je({map:xo,transparent:!0,depthWrite:!1,opacity:r,color:0}),o=new Zt(new ve(i,t),s);return o.rotation.x=-Math.PI/2,o.position.set(e,.045,n),o.renderOrder=1,o}function _0(i,t,{quality:e="high"}={}){const n=new ln;n.name="hall";const r=new a0;u0(r,t),c0(r,t),h0(r,t),d0(r,t),p0(r,t),m0(r,t);for(const o of Un.chandeliers)f0(r,t,n,o.position);const s=r.build(n,{castShadow:e==="high",receiveShadow:!0});return n.add(xr(2.6,2.6,0,$t.zNorth+.7,.5)),n.add(xr(1.9,2.6,-3,5.35,.34)),n.add(xr(1.9,2.6,3,5.35,.34)),n.add(xr(1.9,2.6,-6.3,4.2,.3)),i.add(n),{group:n,meshes:s}}function v0(i){const t=new ln;t.name="lights";const e=new ed(Un.sky.color,Un.sky.ground,Un.sky.intensity*1.3);t.add(e);const n=new Ul(14674162,1.15);n.position.set(-4,12,8),n.target.position.set(0,1,0),t.add(n,n.target);const r=new Ul(Un.sun.color,Un.sun.intensity*.62);r.position.set(...Un.sun.position),r.target.position.set(0,0,0),r.castShadow=!1,r.shadow.mapSize.set(2048,2048),r.shadow.camera.left=-11,r.shadow.camera.right=11,r.shadow.camera.top=9,r.shadow.camera.bottom=-9,r.shadow.camera.near=1,r.shadow.camera.far=40,r.shadow.bias=-35e-5,r.shadow.normalBias=.06,t.add(r),t.add(r.target);for(const s of Un.chandeliers){const o=new id(s.color,s.intensity,15,2);o.position.set(...s.position),t.add(o)}return i.add(t),{lights:t,sun:r,hemi:e,fill:n}}const x0=new td;let Mo=null,xs=null,pi=null,So=null;function ru(i){if(!i||!Array.isArray(i.anchor))return null;let t=null,e=1/0;for(const n of zn){const r=Math.hypot(n.position[0]-i.anchor[0],n.position[1]-i.anchor[1],n.position[2]-i.anchor[2]);r<e&&(t=n,e=r)}return e<=3?t:null}function M0(i="#3a2a1a"){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,64,64);n.addColorStop(0,i),n.addColorStop(1,"#16110c"),e.fillStyle=n,e.fillRect(0,0,64,64);const r=new nr(t);return r.colorSpace=Me,r}function S0(i,{anisotropy:t=4}={}){return new Promise(e=>{x0.load(i,n=>{n.colorSpace=Me,n.anisotropy=t,n.minFilter=Nn,n.magFilter=an,n.generateMipmaps=!0,n.needsUpdate=!0,e(n)},void 0,()=>e(null))})}function y0(i,t=4){const e=new Pe(i);return e.colorSpace=Me,e.anisotropy=t,e.minFilter=Nn,e.magFilter=an,e.generateMipmaps=!0,e.needsUpdate=!0,e}async function E0(i,t,e=1){const n=await fetch(i);if(!n.ok)throw new Error(`HTTP ${n.status}`);const r=await n.blob(),s=e>=1?{resizeWidth:t,resizeQuality:"high"}:{resizeHeight:t,resizeQuality:"high"};if(typeof window.createImageBitmap=="function")try{const a=await window.createImageBitmap(r,s),l=lc(a,t);return a.close&&a.close(),l}catch{}const o=URL.createObjectURL(r);try{const a=new Image;return a.src=o,await a.decode(),lc(a,maxWidth)}finally{URL.revokeObjectURL(o)}}function lc(i,t){const e=i.width||i.naturalWidth,n=i.height||i.naturalHeight,r=Math.min(1,t/Math.max(e,n)),s=document.createElement("canvas");s.width=Math.max(1,Math.round(e*r)),s.height=Math.max(1,Math.round(n*r));const o=s.getContext("2d");return o.imageSmoothingQuality="high",o.drawImage(i,0,0,s.width,s.height),s}function b0(i,{maxWidth:t=1536,maxResident:e=2}={}){const n=new Map(i.map(u=>[u.art.id,u])),r=new Map;let s=null,o=t;function a(u){const d=r.get(u);if(!d)return;r.delete(u),d.texture&&d.texture.dispose();const f=n.get(u);f&&f.detailTexture===d.texture&&l(u,null)}function l(u,d){const f=n.get(u);f&&(f.detailTexture=d||null,f.canvasMat.map=d||f.baseTexture,f.canvasMat.needsUpdate=!0)}function c(u){if(r.size<=e)return;const d=[...r.entries()].filter(([f,g])=>f!==u&&g.texture).sort((f,g)=>f[1].used-g[1].used).map(([f])=>f);for(;r.size>e&&d.length;)a(d.shift())}async function h(u){const d=n.get(u);if(!d)return null;const f=r.get(u)||{};if(f.promise)return f.promise;f.used=Date.now();const g=d.baseTexture?d.baseTexture.image.width/d.baseTexture.image.height:1;return f.promise=E0(d.art.file,o,g).then(_=>{const m=y0(_);return f.texture=m,f.promise=null,c(s||u),s===u&&l(u,m),{id:u,width:m.image.width,height:m.image.height,quality:"detail"}}).catch(()=>(f.promise=null,r.delete(u),null)),r.set(u,f),f.promise}return{async show(u){s=u;for(const[f]of[...r.entries()])f!==u&&a(f);if(!u)return null;const d=r.get(u);return d&&d.texture?(d.used=Date.now(),l(u,d.texture),{id:u,width:d.texture.image.width,height:d.texture.image.height,quality:"detail"}):h(u)},preload(u){return!u||r.has(u)?null:h(u)},setMaxWidth(u){if(!(!u||u===o)){o=u;for(const[d]of[...r.entries()])a(d);s&&h(s)}},info(){return{maxWidth:o,maxResident:e,current:s,resident:[...r.entries()].filter(([,u])=>u.texture).map(([u,d])=>({id:u,width:d.texture.image.width,height:d.texture.image.height}))}}}}function w0(i,t,e){const n=new ln;n.name=`painting:${i.id}`;const[r,s,o]=i.position;n.position.set(r,s,o),n.rotation.y=i.rotationY;const a=i.width,l=i.height,c=.1,h=Math.min(.24,Math.max(.13,a*.052)),u=new je({map:M0("#2b2117"),color:new Wt(1.16,1.14,1.1),toneMapped:!0}),d=new Zt(new ve(a,l),u);d.position.z=.062,d.receiveShadow=!0,d.name=`canvas:${i.id}`,n.add(d);const f=new Zt(new un(a+.02,l+.02,.06),t.wood);f.position.z=.03,n.add(f);const g=(X,j,V,st,dt,bt)=>{const Ht=new un(X,j,V);return Ht.translate(st,dt,bt),Ht},_=a+h*2,m=l/2+h/2,p=a/2+h/2,b=[g(_,h,c,0,m,.02),g(_,h,c,0,-m,.02),g(h,l,c,-p,0,.02),g(h,l,c,p,0,.02)],w=h*.42,S=[g(a+w*2,w,.045,0,l/2+w/2,.078),g(a+w*2,w,.045,0,-l/2-w/2,.078),g(w,l,.045,-a/2-w/2,0,.078),g(w,l,.045,a/2+w/2,0,.078)];for(const[X,j]of[[b,t.gold],[S,t.brass]]){const V=new Zt(Ha(X),j);V.castShadow=!0,V.receiveShadow=!0,n.add(V),X.forEach(st=>st.dispose())}const R=new Zt(new un(Math.min(a*.8,1.7),.06,.16),t.brass);R.position.set(0,m+h+.16,.16),n.add(R),xs||(xs=new le({color:16773327,emissive:16766875,emissiveIntensity:1.5,roughness:.4}));const A=new Zt(new ir(.028,.028,Math.min(a*.74,1.56),10),xs);A.rotation.z=Math.PI/2,A.position.set(0,m+h+.12,.24),n.add(A),Mo||(Mo=ac()),pi||(pi=new je({map:Mo,transparent:!0,opacity:.42,depthWrite:!1,blending:Fn,toneMapped:!1})),pi.opacity=e==="high"?.42:.48;const C=new Zt(new ve(a*1.62,l*1.5),pi);C.position.set(0,.12,.004),C.renderOrder=1,n.add(C),So||(So=ac());const E=new Zt(new ve(a*1.35,l*1.28),new je({map:So,transparent:!0,opacity:0,depthWrite:!1,blending:Fn,toneMapped:!1}));E.position.set(0,0,.072),E.visible=!1,E.renderOrder=2,n.add(E);const v=[i.title,i.author,`${i.year} · ${i.technique.split(".")[0]}`],M=r0(v,{width:1024,height:512}),I=new le({map:M,roughness:.42,metalness:.55}),O=Math.min(.78,Math.max(.5,a*.42)),G=new Zt(new ve(O,O*.42),I);G.position.set(-a/2+O/2,-l/2-h-.28,.055),G.name=`plaque:${i.id}`,n.add(G);const Y=Ba(i.rotationY),W=new be;return W.position.set(r+Y[0]*.4,s,o+Y[2]*.4),n.add(W),{group:n,canvas:d,canvasMat:u,anchor:W,plaque:G,glow:E}}let ga=null;function T0(i){ga&&(ga.visible=i)}function A0(i,t){if(i.updateMatrixWorld(!0),!t.length)return 0;const e=new Map;let n=0;for(const s of t){const o=[];for(const a of s.group.children){if(!a.isMesh||a===s.canvas||a===s.plaque||a===s.glow)continue;const l=a.material;if(!l)continue;const c=a.geometry.clone();c.applyMatrix4(a.matrixWorld),e.has(l)||e.set(l,[]),e.get(l).push(c),o.push(a),n+=1}for(const a of o)s.group.remove(a)}const r=new ln;r.name="painting-statics";for(const[s,o]of e){const a=Ha(o,!1);if(o.forEach(c=>c.dispose()),!a)continue;a.computeBoundingSphere();const l=new Zt(a,s);l.castShadow=s!==pi,l.receiveShadow=s!==pi&&s!==xs,l.matrixAutoUpdate=!1,l.updateMatrix(),s===pi&&(l.renderOrder=1,ga=l),r.add(l)}return i.add(r),n}async function R0(i,t,e,n=()=>{}){const r=[];let s=0;const o=e==="high"?4:1;for(const a of zn){const l=w0(a,t,e);i.add(l.group);const c=await S0(a.thumb,{anisotropy:o});c&&(l.baseTexture=c,l.detailTexture=null,l.canvasMat.map=c,l.canvasMat.needsUpdate=!0),r.push({art:a,...l}),s+=1,n(s/zn.length)}return r}function C0(i){if(i==="malachite"){const e=iu();return new le({map:e,roughness:.22,metalness:.4,color:14086879,emissive:862748,emissiveIntensity:.6})}const t=nu();return new le({map:t,roughness:.72,metalness:0,color:16052712,envMapIntensity:.35})}async function P0(i,t,e=()=>{}){const n=[];let r=0;for(const s of Ir){const o=new ln;o.name=`sculpture:${s.id}`,o.position.set(...s.position),o.rotation.y=s.rotationY;const a=new Zt(new un(.86,s.standHeight,.86),C0(s.stand));a.position.y=s.standHeight/2,a.castShadow=!0,a.receiveShadow=!0,o.add(a);const l=new Zt(new un(.98,.08,.98),t.gold);l.position.y=s.standHeight+.02,l.castShadow=!0,o.add(l);const c=new Zt(new un(.98,.09,.98),t.gold);c.position.y=.045,o.add(c);let h=null;try{const u=await fetch(s.file);if(u.ok){const d=await u.json(),f=new Float32Array(d.vertices.length*3);d.vertices.forEach((b,w)=>{f[w*3]=b[0],f[w*3+1]=b[1],f[w*3+2]=b[2]});const g=[];d.faces.forEach(b=>g.push(b[0],b[1],b[2]));const _=new Fe;_.setAttribute("position",new ke(f,3)),_.setIndex(g),_.computeVertexNormals(),_.computeBoundingSphere();const m=s.modelHeight*s.scale/Math.max(.001,d.height||s.modelHeight),p=new le({color:15261643,roughness:.82,metalness:0,emissive:854791,emissiveIntensity:.4,envMapIntensity:.25});h=new Zt(_,p),h.scale.setScalar(m),h.position.y=s.standHeight+.06,h.castShadow=!0,h.receiveShadow=!0,h.name=`statue:${s.id}`,o.add(h),o.userData.meta=d}}catch(u){console.warn("sculpture failed",s.id,u)}o.add(xr(2.2,2.2,0,0,.42).translateY(.005)),i.add(o),n.push({spec:s,group:o,mesh:h}),r+=1,e(r/Ir.length)}return n}const I0=1.45,L0=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,U0=`
  uniform float uProgress;
  uniform float uActive;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  const float TAU = 6.28318530718;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;
    float a = atan(p.x, p.y);
    if (a < 0.0) a += TAU;
    float arcPos = a / TAU;
    float inArc = step(arcPos, uProgress);
    float ring = smoothstep(0.86, 0.93, r) * (1.0 - smoothstep(0.965, 1.0, r));
    float inner = smoothstep(0.70, 0.76, r) * (1.0 - smoothstep(0.80, 0.86, r));
    float halo = (1.0 - smoothstep(0.0, 0.92, r)) * (0.05 + 0.10 * uActive);
    float pulse = 0.72 + 0.28 * sin(uTime * 2.4);
    // песчинки золота, стягивающиеся к цели по спирали
    float spin = a / TAU + r * 0.55 - uTime * 0.18;
    float spokes = smoothstep(0.86, 0.94, sin(spin * TAU * 7.0) * 0.5 + 0.5);
    float dustBand = smoothstep(0.22, 0.36, r) * (1.0 - smoothstep(0.9, 0.99, r));
    float drift = 0.5 + 0.5 * sin(r * 26.0 - uTime * 3.0 + a * 3.0);
    float sparks = spokes * dustBand * drift * uActive * 0.42;
    float alpha = inner * 0.22 * pulse + ring * inArc * 1.0 + sparks + halo;
    alpha *= mix(0.55, 1.0, uActive);
    vec3 col = uColor * (1.0 + 0.55 * inArc) * (0.9 + 0.2 * pulse);
    gl_FragColor = vec4(col, alpha);
  }
`;function D0(){const i=document.createElement("canvas");i.width=8,i.height=128;const t=i.getContext("2d"),e=t.createLinearGradient(0,128,0,0);e.addColorStop(0,"rgba(255,231,178,0.55)"),e.addColorStop(.35,"rgba(255,219,150,0.20)"),e.addColorStop(1,"rgba(255,214,140,0)"),t.fillStyle=e,t.fillRect(0,0,8,128);const n=new nr(i);return n.colorSpace=Me,n}function N0(i){const t=new ln;t.name="markers";const e=D0(),n=Br.map((l,c)=>{const h=new ln;h.name=`marker:${l.id}`,h.position.set(l.position[0],0,l.position[1]);const u=new je({map:s0(c+1),transparent:!0,opacity:.92,depthWrite:!1,toneMapped:!1}),d=new Zt(new ve(.95,.95),u);d.rotation.x=-Math.PI/2,d.position.y=.052,d.renderOrder=2,h.add(d);const f=new Bn({vertexShader:L0,fragmentShader:U0,uniforms:{uProgress:{value:0},uActive:{value:0},uTime:{value:c*1.7},uColor:{value:new Wt(16768416)}},transparent:!0,depthWrite:!1,blending:Fn}),g=new Zt(new ve(1.85,1.85),f);g.rotation.x=-Math.PI/2,g.position.y=.058,g.renderOrder=3,h.add(g);const _=new je({map:e,transparent:!0,opacity:.6,depthWrite:!1,side:sn,blending:Fn,toneMapped:!1}),m=new Zt(new ir(.34,.44,1.5,20,1,!0),_);m.position.y=.75,m.renderOrder=2,h.add(m);const p=new Gc({map:d.material.map,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1,blending:Fn}),b=new Gh(p);return b.position.set(0,I0,0),b.scale.set(.62,.62,.62),b.renderOrder=4,h.add(b),t.add(h),{point:l,holder:h,ring:g,ringMat:f,discMat:u,columnMat:_,haloMat:p}});i.add(t);let r=0,s=!1;function o(l){s=!!l;for(const c of n)c.holder.children[2].visible=!s&&c.columnMat.opacity>.02,c.holder.children[3].visible=!s}function a(l,{currentPointId:c,targetId:h,progress:u,visible:d}){r+=l;for(const f of n){const g=f.point.id===c,_=f.point.id===h;f.holder.visible=d&&!g,f.ringMat.uniforms.uTime.value=r;const m=g?0:_?Math.min(1,u):0;f.ringMat.uniforms.uProgress.value+=(m-f.ringMat.uniforms.uProgress.value)*Math.min(1,l*12);const p=_?1:0;f.ringMat.uniforms.uActive.value+=(p-f.ringMat.uniforms.uActive.value)*Math.min(1,l*8),f.discMat.opacity=.62+.3*(_?1:0),f.columnMat.opacity+=((_?.4:0)-f.columnMat.opacity)*Math.min(1,l*6),f.holder.children[2].visible=!s&&f.columnMat.opacity>.02,f.holder.children[3].visible=!s,f.haloMat.opacity+=((_?.8:.3)-f.haloMat.opacity)*Math.min(1,l*8);const b=_?.72:.6;f.holder.children[3].scale.lerp(new U(b,b,b),Math.min(1,l*8))}}return{group:t,markers:n,update:a,setSimple:o}}const su=1.45;function Ga(i,t){const e=Math.cos(t);return[Math.sin(i)*e,Math.sin(t),-Math.cos(i)*e]}function _a(i){const t=Math.hypot(i[0],i[1],i[2])||1e-9;return[i[0]/t,i[1]/t,i[2]/t]}function F0(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function O0(i,t){return Math.acos(Math.max(-1,Math.min(1,F0(_a(i),_a(t)))))}function ou(i,t){return _a([t[0]-i[0],su-i[1],t[1]-i[2]])}function B0({points:i,dwellSeconds:t=10,angleDeg:e=4.5,grace:n=.45,decay:r=3.2,hysteresisDeg:s=1.1}){const o=e*Math.PI/180,a=s*Math.PI/180;let l=null,c=0,h=0,u=!1,d=0,f={angle:1/0,candidateId:null};function g(b=null){l=b,c=0,h=0}function _(b){let w=null,S=1/0;for(const R of i){if(R.id===b.currentPointId)continue;const A=O0(b.forward,ou(b.position,R.position));A>o||!(R.id===l)&&w&&A>S-a||A<S&&(S=A,w=R)}return w?{id:w.id,angle:S}:null}function m(b,w){if(f={angle:1/0,candidateId:null},!w.enabled||!w.currentPointId)return g(null),p();const S=_(w);if(S){if(f={angle:S.angle,candidateId:S.id},S.id!==l&&g(S.id),h=0,c=Math.min(1,c+b/t),c>=1){const R=l;return d+=1,g(null),{...p(),arrival:R}}}else l&&(h+=b,h>n&&(c=Math.max(0,c-b*r),c===0&&g(null)));return l?u=!0:u=!1,p()}function p(){return{targetId:l,progress:c,angle:f.angle,candidateId:f.candidateId,arrivals:d,touched:u}}return{update:m,snapshot:p,reset:g,get progress(){return c},get targetId(){return l}}}function z0(i){return i<=0?0:Math.min(1,Math.pow(i,.72))}function Va(i){return Math.max(0,Math.min(1,i))}function ws(i){const t=Va(i);return t*t*(3-2*t)}function H0(i,t){let e=(t-i)%(Math.PI*2);return e>Math.PI&&(e-=Math.PI*2),e<-Math.PI&&(e+=Math.PI*2),e}function G0(i,t,e){return i+H0(i,t)*e}function V0({from:i,to:t,fromYaw:e,fromPitch:n,toYaw:r,toPitch:s,duration:o=null,eye:a=1.65}){const[l,c]=i,[h,u]=t,d=h-l,f=u-c,g=Math.hypot(d,f)||1e-6,_=o||Math.min(7.5,Math.max(1.5,.55*g+.9)),m=-f/g*Math.min(.65,g*.08),p=d/g*Math.min(.65,g*.08),b=(l+h)/2+m,w=(c+u)/2+p;function S(R){const A=Va(R),C=ws(A),E=1-C,v=E*E*l+2*E*C*b+C*C*h,M=E*E*c+2*E*C*w+C*C*u,I=Math.sin(Math.PI*C)*Math.min(.16,g*.02),O=ws((A-.18)/.82);return{position:[v,a+I,M],yaw:G0(e,r,O),pitch:n+(s-n)*O,done:A>=1,duration:_}}return S.duration=_,{sample:S,duration:_,kind:"glide"}}function k0({out:i=.42,hold:t=.22,back:e=.62}){const n=i+t+e;return{duration:n,kind:"fade",sample(r){const s=Va(r)*n;if(s<i)return{alpha:ws(s/i),swapped:!1,done:!1};if(s<i+t)return{alpha:1,swapped:!0,done:!1};const o=(s-i-t)/e;return{alpha:1-ws(o),swapped:!0,done:o>=1}}}}function ka({mode:i,from:t,to:e,fromYaw:n,fromPitch:r,toYaw:s,toPitch:o,eye:a,duration:l=null}){if(i==="fade"){const c=k0({});return{kind:"fade",duration:c.duration,sample(h){const u=c.sample(h);return{...u,position:u.swapped?[e[0],a,e[1]]:[t[0],a,t[1]],yaw:u.swapped?s:n,pitch:u.swapped?o:r}}}}return V0({from:t,to:e,fromYaw:n,fromPitch:r,toYaw:s,toPitch:o,eye:a,duration:l})}const W0=1.35,X0=.98,cc=.55,q0=2.4,Ur=52,Wa=66;function au(i){return i*Math.PI/180}function Xa(i,{fov:t=66,aspect:e=16/9,eye:n=pt.eye,distance:r=null}={}){const s=au(t),o=2*Math.atan(Math.tan(s/2)*Math.max(.4,e)),a=i.height/W0/(2*Math.tan(s/2)),l=i.width/X0/(2*Math.tan(o/2)),c=Math.max(cc,Math.min(q0,Math.max(a,l))),h=r===null?c:Math.max(cc*.92,Math.min(c,r)),u=Ba(i.rotationY),[d,f,g]=i.position,_=[d+u[0]*h,n,g+u[2]*h],m=d-_[0],p=f-_[1],b=g-_[2],w=Math.hypot(m,b)||1e-6;return{position:_,yaw:Math.atan2(m,-b),pitch:Math.atan2(p,w),distance:h,baseDistance:c,fill:{width:i.width/(2*h*Math.tan(o/2)),height:i.height/(2*h*Math.tan(s/2))}}}function Y0(i,t,{fov:e=66,aspect:n=16/9}={}){const r=au(e),s=2*Math.atan(Math.tan(r/2)*Math.max(.4,n)),o=i.position[0]-t.position[0],a=i.position[2]-t.position[2],l=Math.hypot(o,a),c=i.width/(2*l*Math.tan(s/2)),h=i.height/(2*l*Math.tan(r/2));return{widthShare:c,heightShare:h,distance:l}}function $0({seconds:i=10,grace:t=.35}={}){let e=null,n=0,r=0;function s(){e=null,n=0,r=0}function o(a,l){return l?(l!==e&&(e=l,n=0),r=t,n=Math.min(1,n+a/i),{artId:e,progress:n,ready:n>=1}):(e&&(r-=a,r<=0&&s()),{artId:null,progress:0,ready:!1})}return{update:o,reset:s,get artId(){return e},get progress(){return n}}}const Mr=Math.PI/180,uc=78*Mr;function K0(i){const t=new Ne().setFromQuaternion(i,"YXZ");return{yaw:-t.y,pitch:t.x}}function j0(i,t,e,n){const r=new Ne,s=new En,o=new En(-Math.sqrt(.5),0,0,Math.sqrt(.5)),a=new En,l=new U(0,0,1);return r.set(t,i,-e,"YXZ"),s.setFromEuler(r),s.multiply(o),s.multiply(a.setFromAxisAngle(l,-n)),K0(s)}function Sr(i){return Math.max(-uc,Math.min(uc,i))}function Z0(i,t){let e=(t-i)%(Math.PI*2);return e>Math.PI&&(e-=Math.PI*2),e<-Math.PI&&(e+=Math.PI*2),e}function J0({onSourceChange:i=()=>{}}={}){const t={yaw:0,pitch:0,source:"touch",gyro:"idle",hasAbsolute:!1,lastSampleAt:0,smoothing:.38};let e=null,n=0,r=0,s=0,o=!1,a=0,l=0,c=0,h=0;const u=[];function d(E){t.source!==E&&(t.source=E,i(E))}function f(E){if(E.alpha==null&&E.beta==null)return;const v=(E.alpha||0)*Mr,M=(E.beta||0)*Mr,I=(E.gamma||0)*Mr;e=j0(v,M,I,s),t.lastSampleAt=performance.now(),t.gyro="active",t.source!=="gyro"&&d("gyro")}function g(){const E=screen.orientation&&screen.orientation.angle||window.orientation||0;s=(Number(E)||0)*Mr}function _(E){if(o=!0,a=E.clientX,l=E.clientY,E.pointerId!=null&&E.target&&E.target.setPointerCapture)try{E.target.setPointerCapture(E.pointerId)}catch{}}function m(E){if(!o)return;const v=E.clientX-a,M=E.clientY-l;a=E.clientX,l=E.clientY,c-=v*.0042,h=Sr(h-M*.0034),t.source!=="touch"&&d("touch")}function p(){o=!1}function b(E){window.addEventListener("deviceorientation",f),window.addEventListener("orientationchange",g),g(),E.addEventListener("pointerdown",_),window.addEventListener("pointermove",m),window.addEventListener("pointerup",p),window.addEventListener("pointercancel",p)}function w(E){window.removeEventListener("deviceorientation",f),window.removeEventListener("orientationchange",g),E.removeEventListener("pointerdown",_),window.removeEventListener("pointermove",m),window.removeEventListener("pointerup",p),window.removeEventListener("pointercancel",p)}function S(E=t.yaw,v=t.pitch){t.yaw=E,t.pitch=v,c=E,h=v,n=E+(e?-e.yaw:0),r=v+(e?-e.pitch:0)}function R(E){if(e&&t.source==="gyro"){const v=e.yaw+n,M=Sr(e.pitch+r),I=1-Math.pow(1-t.smoothing,E*60);t.yaw+=Z0(t.yaw,v)*I,t.pitch+=(M-t.pitch)*I,c=t.yaw,h=t.pitch}else t.yaw=c,t.pitch=h;t.pitch=Sr(t.pitch),t.source==="gyro"&&performance.now()-t.lastSampleAt>1500&&(c=t.yaw,h=t.pitch,d("touch"),t.gyro="stale")}async function A(){try{const E=window.DeviceOrientationEvent;return E?typeof E.requestPermission=="function"&&await E.requestPermission()!=="granted"?(t.gyro="denied","denied"):(t.gyro="requested","granted"):(t.gyro="unsupported","unsupported")}catch{return t.gyro="denied","denied"}}function C(E,v){return u.push([E,v]),v}return{state:t,attach:b,detach:w,update:R,recenter:S,requestGyro:A,add:C,get listeners(){return u}}}function Q0(i,{ipd:t=.064,fov:e=66}={}){const n=new ln;n.name="rig",n.rotation.order="YXZ";const r=new He(e,1,.15,60),s=new He(e,1,.15,60);r.position.x=-t/2,s.position.x=t/2,r.name="eye-left",s.name="eye-right";const o=new He(e,1,.15,60);return o.name="eye-mono",n.add(r,s,o),n.left=r,n.right=s,n.mono=o,n.ipd=t,i.add(n),n}function Ts(i,t){for(const e of[i.left,i.right,i.mono])!e||e.fov===t||(e.fov=t,e.updateProjectionMatrix())}function vi(i,{position:t,yaw:e,pitch:n,roll:r=0}){i.position.set(t[0],t[1],t[2]),i.rotation.set(n,-e,r)}function qa(i,t,e,{quality:n="high"}={}){const r=i.getSize(new Ct),s=r.x/2,o=s/r.y;e.left.aspect=o,e.right.aspect=o,e.left.updateProjectionMatrix(),e.right.updateProjectionMatrix(),i.setScissorTest(!0),i.setViewport(0,0,s,r.y),i.setScissor(0,0,s,r.y),i.render(t,e.left),i.setViewport(s,0,s,r.y),i.setScissor(s,0,s,r.y),i.render(t,e.right),i.setScissorTest(!1),i.setViewport(0,0,r.x,r.y)}function As(i,t,e){const n=i.getSize(new Ct);e.aspect=n.x/n.y,e.updateProjectionMatrix(),i.setScissorTest(!1),i.setViewport(0,0,n.x,n.y),i.render(t,e)}const kt=i=>document.getElementById(i);function hc(i={}){const t={start:kt("start"),hud:kt("hud"),loading:kt("loading"),loadingFill:kt("loading-fill"),loadingNote:kt("loading-note"),loadingTitle:kt("loading-title"),reticle:kt("reticle"),arc:kt("reticle-arc"),dwellNote:kt("dwell-note"),dwellTitle:kt("dwell-title"),dwellTime:kt("dwell-time"),infoCard:kt("info-card"),infoKind:kt("info-kind"),infoTitle:kt("info-title"),infoMeta:kt("info-meta"),infoNote:kt("info-note"),debugTravel:kt("debug-travel"),pointName:kt("point-name"),back:kt("btn-back"),recenter:kt("btn-recenter"),vrSetup:kt("vr-setup"),settings:kt("settings"),collection:kt("collection"),collectionList:kt("collection-list"),gyroStatus:kt("gyro-status"),startQuality:kt("start-quality"),toast:kt("toast"),fade:kt("fade"),strip:kt("exhibit-strip"),webglError:kt("webgl-error")};let e=0,n=null;function r(E,v){t.loadingFill&&(t.loadingFill.style.width=`${Math.round(Math.max(0,Math.min(1,E))*100)}%`),v&&t.loadingNote&&(t.loadingNote.textContent=v)}function s(){t.loading.classList.add("done"),window.setTimeout(()=>{t.loading.hidden=!0},650)}function o(E){t.start.classList.toggle("hidden",!E)}function a(E){t.hud.hidden=!E}function l(E){if(!E)return;const v=Br.findIndex(M=>M.id===E.id)+1;t.pointName.textContent=`Точка ${v} · ${E.name}`}function c(E,v=""){document.body.classList.toggle("studying",!!E),t.back&&(t.back.hidden=!E),t.recenter&&(t.recenter.hidden=!!E),t.pointName&&E&&(t.pointName.textContent=`Близкий осмотр · ${v}`)}function h({active:E,progress:v=0,point:M=null}){const I=Math.max(0,Math.min(1,v));if(t.arc.style.strokeDashoffset=String(188.5*(1-I)),t.reticle.classList.toggle("hot",E),E&&M){t.dwellNote.hidden=!1,t.dwellTitle.textContent=M.name;const O=Math.max(0,10*(1-I));t.dwellTime.textContent=`${O.toFixed(1).replace(".",",")} с`}else t.dwellNote.hidden=!0}let u=0;function d(E,v=!1){if(v&&(u=performance.now()+4200),!(performance.now()<u&&!v)){if(!E){t.infoCard.hidden=!0;return}t.infoCard.hidden=!1,t.infoKind.textContent=E.kind==="painting"?"ЖИВОПИСЬ · ЭРМИТАЖ":"СКУЛЬПТУРА · ЭРМИТАЖ",t.infoTitle.textContent=E.title,t.infoMeta.textContent=`${E.author} · ${E.year}`,t.infoNote.textContent=E.note||""}}function f(E){t.startQuality.textContent=`Графика: ${E==="high"?"высокая":"лёгкая"}`,document.querySelectorAll("[data-quality]").forEach(v=>{v.setAttribute("aria-pressed",String(v.dataset.quality===E))})}function g(E){t.gyroStatus&&(t.gyroStatus.textContent=E)}function _(E,v=2600){t.toast.textContent=E,t.toast.classList.add("show"),document.body.classList.add("toasting"),window.clearTimeout(e),e=window.setTimeout(()=>{t.toast.classList.remove("show"),document.body.classList.remove("toasting")},v)}function m(E){const v={settings:t.settings,collection:t.collection,vr:t.vrSetup};Object.entries(v).forEach(([M,I])=>{I&&(I.hidden=M!==E)}),E?document.body.classList.add("panel-open"):document.body.classList.remove("panel-open")}function p(){t.settings.hidden=!0,t.collection.hidden=!0,t.vrSetup.hidden=!0,document.body.classList.remove("panel-open")}function b(E){t.fade.style.opacity=String(Math.max(0,Math.min(1,E)))}function w(E="Наденьте очки",v="Смотрите на медальон. Десять секунд — и вы у следующей точки."){n||(n=document.createElement("div"),n.className="vr-hint",n.innerHTML="<h2></h2><p></p>",document.getElementById("app").appendChild(n)),n.classList.remove("gone"),n.querySelector("h2").textContent=E,n.querySelector("p").textContent=v,n.hidden=!1}function S(E=0){n&&window.setTimeout(()=>{n&&(n.classList.add("gone"),window.setTimeout(()=>{n&&(n.hidden=!0)},750))},E)}function R(){const E=[...zn.map(v=>({...v,kind:"painting"})),...Ir.map(v=>({...v,kind:"sculpture"}))];t.collectionList.innerHTML=E.map(v=>`
      <article class="collection-item">
        ${v.thumb?`<img src="./${v.thumb}" alt="" loading="lazy">`:'<div style="width:76px;height:58px;border:1px solid rgba(217,180,106,.25);border-radius:2px"></div>'}
        <div>
          <strong>${v.title}</strong>
          <span>${v.author} · ${v.year}</span>
          <p>${v.technique}</p>
        </div>
      </article>`).join("")}function A(){t.strip.innerHTML=zn.map(E=>`
      <li><img src="./${E.thumb}" alt="" loading="lazy"><b>${E.author.split(" ")[0]}</b> · ${E.title}</li>`).join("")}function C(){kt("btn-enter").addEventListener("click",()=>i.onEnter&&i.onEnter()),kt("btn-enter-vr").addEventListener("click",()=>i.onOpenVR&&i.onOpenVR()),kt("btn-vr").addEventListener("click",()=>i.onOpenVR&&i.onOpenVR()),kt("btn-vr-go").addEventListener("click",()=>i.onEnterVR&&i.onEnterVR()),kt("btn-vr-cancel").addEventListener("click",()=>{p()}),kt("btn-settings").addEventListener("click",()=>m("settings")),kt("btn-collection").addEventListener("click",()=>m("collection")),kt("btn-recenter").addEventListener("click",()=>i.onRecenter&&i.onRecenter()),kt("btn-back").addEventListener("click",()=>i.onBack&&i.onBack()),document.querySelectorAll("[data-close]").forEach(E=>{E.addEventListener("click",()=>p())}),document.querySelectorAll("[data-quality]").forEach(E=>{E.addEventListener("click",()=>{const v=E.dataset.quality;f(v),i.onQuality&&i.onQuality(v)})}),window.addEventListener("keydown",E=>{E.key==="Escape"&&p()})}return C(),R(),A(),{el:t,setLoading:r,hideLoading:s,showStart:o,showHUD:a,setPointName:l,setCloseUp:c,setDwell:h,setInfo:d,setQualityLabel:f,setGyroStatus:g,toast:_,openPanel:m,closePanels:p,fadeTo:b,debugTravel(E){t.debugTravel&&(t.debugTravel.hidden=!E,t.debugTravel.textContent=E||"")},showVRHint:w,hideVRHint:S,showWebGLError(){t.loading.hidden=!0,t.webglError.hidden=!1}}}const Mn=document.getElementById("hall"),D={mode:"loading",quality:"high",currentPointId:sr,travel:null,hover:null,paused:!1,closeUp:null,lastFrame:0,frames:0,fps:0,fpsWindow:0};let Lt=null,ne=null,te=null,Se=null,De=null,Ge=null,Jn=0,yr=null,dc=null,cn=null,ye=null,Er=!0,ht=null,Dr=[],Ya=new Map,lu=new Map,vn=null,gn=null,Ki=0,Ms=0,cu=!1,rn=1,fc=0,ji=null,va=null,yo=null;const t_=new URLSearchParams(location.search).has("debug"),ot={position:[0,pt.eye,4.9],yaw:0,pitch:0};function e_(){try{const i=document.createElement("canvas");return!!(window.WebGL2RenderingContext&&i.getContext("webgl2"))}catch{return!1}}function n_(i){const t=new Hc,e=new Or(12,24,16),n=[],r=e.getAttribute("position"),s=new Wt(2902586),o=new Wt(6050624),a=new Wt(1643536);for(let d=0;d<r.count;d+=1){const f=r.getY(d)/12,g=f>0?s.clone().lerp(o,1-f):o.clone().lerp(a,Math.min(1,-f*1.6));n.push(g.r,g.g,g.b)}e.setAttribute("color",new we(n,3));const l=new je({vertexColors:!0,side:Ve});t.add(new Zt(e,l));const c=new je({color:16770749,side:sn});for(const[d,f,g]of[[6,2.4,3],[6,2.4,-3],[-4,3.6,5],[0,4.2,-6]]){const _=new Zt(new ve(2.4,2.8),c);_.position.set(d,f,g),_.lookAt(0,1.6,0),t.add(_)}const h=new fa(i),u=h.fromScene(t,.04);return h.dispose(),e.dispose(),l.dispose(),c.dispose(),u.texture}function i_(i){const e=new Float32Array(210);for(let o=0;o<70;o+=1)e[o*3]=(Math.random()-.5)*16,e[o*3+1]=.6+Math.random()*5.6,e[o*3+2]=(Math.random()-.5)*11;const n=new Fe;n.setAttribute("position",new ke(e,3));const r=(()=>{const o=document.createElement("canvas");o.width=32,o.height=32;const a=o.getContext("2d"),l=a.createRadialGradient(16,16,0,16,16,16);l.addColorStop(0,"rgba(255,244,214,0.9)"),l.addColorStop(1,"rgba(255,244,214,0)"),a.fillStyle=l,a.fillRect(0,0,32,32);const c=new nr(o);return c.colorSpace=Me,c})(),s=new kc({size:.026,map:r,transparent:!0,depthWrite:!1,opacity:.11,blending:Fn,sizeAttenuation:!0});vn=new $h(n,s),vn.name="dust",vn.frustumCulled=!1,i.add(vn)}async function r_(){if(!e_()){ht=hc({}),ht.showWebGLError();return}Lt=new Wg({canvas:Mn,antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1}),Lt.outputColorSpace=Me,Lt.toneMapping=yc,Lt.toneMappingExposure=1.16,Lt.shadowMap.enabled=!0,Lt.shadowMap.type=Mc,Lt.setClearColor(660753,1),Ji(),ne=new Hc,ne.environment=n_(Lt),ne.environmentIntensity=.5,te=Q0(ne,{ipd:pt.ipd,fov:66}),Se=J0({onSourceChange:a=>{a==="touch"&&ht.setGyroStatus("ведёт свайп"),a==="gyro"&&ht.setGyroStatus("работает")}}),Se.attach(Mn),ht=hc({onEnter:()=>fu(),onOpenVR:()=>{ht.openPanel("vr"),ht.setGyroStatus(Se.state.gyro==="denied"?"запрещён":"не запрошен")},onEnterVR:()=>mu(),onRecenter:()=>Rs(),onBack:()=>Ds(),onQuality:a=>Nr(a)}),D.quality=uu()?"low":"high",ht.setQualityLabel(D.quality);const i=a_();i&&i!==D.quality&&Nr(i),ht.setLoading(.04,"Строим стены, паркет и лепнину…"),await mc();const t=o0(D.quality),{meshes:e}=_0(ne,t,{quality:D.quality});gn=v0(ne),i_(ne),cn=N0(ne),cn.setSimple(D.quality!=="high"),ht.setLoading(.28,"Развешиваем полотна…");const n=await R0(ne,t,D.quality,a=>{ht.setLoading(.28+a*.5,a<1?`Вешаем полотна: ${Math.round(a*100)} %`:"Последние штрихи…")});for(const a of n)a.canvas.userData.exhibitId=a.art.id,a.anchor.userData.exhibitId=a.art.id,Dr.push(a.canvas,a.anchor);A0(ne,n),ye=b0(n,{maxWidth:hu(),maxResident:2}),ht.setLoading(.82,"Ставим скульптуры на плинты…");const r=await P0(ne,t);for(const a of r)a.mesh&&(a.mesh.userData.exhibitId=a.spec.id,Dr.push(a.mesh)),a.group.userData.exhibitId=a.spec.id;for(const a of za)Ya.set(a.id,a);for(const a of n)lu.set(a.art.id,a);De=B0({points:Br,dwellSeconds:tu,angleDeg:Xg,grace:qg}),Ge=$0({seconds:eu,grace:.35}),ht.setLoading(.92,"Прогреваем шейдеры, чтобы первый кадр не замер…"),await mc(),await l_();const s=Ze(sr),o=Hn(s);Qi(s,o),De.reset(null),Ji(),ht.setLoading(1,"Готово"),D.mode="start",ht.hideLoading(),ht.showStart(!0),ht.showHUD(!1),fi(),window.__READY__=!0,window.__HERMITAGE__=E_({paintings:n,meshes:e}),D.lastFrame=performance.now(),requestAnimationFrame(Ss)}function uu(){const i=navigator.userAgent||"";return/Android|iPhone|iPad|iPod|Mobile/i.test(i)?!0:((navigator.maxTouchPoints||0)>0||"ontouchstart"in window)&&Math.min(window.innerWidth,window.innerHeight)<820}function hu(){return D.quality==="low"?1024:uu()?1280:2048}function du(){const i=window.devicePixelRatio||1;return D.quality==="low"?Math.min(i,1):Math.min(i,1.5)}function s_(){const i=du(),t=D.mode==="vr"?Math.min(i,.95):i,e=D.mode==="vr"?.62:.75;return Math.max(e,Math.min(t,i*rn))}function Zi(){if(!Lt)return;const i=s_(),t=Lt.getSize(new Ct),e=window.innerWidth,n=window.innerHeight;Math.abs(Lt.getPixelRatio()-i)<.01&&t.x===e&&t.y===n||(Lt.setPixelRatio(i),Lt.setSize(e,n,!1))}let _r=0,pc=0;function o_(i,t){if(navigator.webdriver||D.mode!=="explore"&&D.mode!=="vr"||t-fc<2e3)return;fc=t;const e=D.mode==="vr"?.62:.72;i<44&&rn>e?(rn=Math.max(e,Math.round((rn-.12)*20)/20),Zi(),pc=t,_r+=1):i>59&&rn<1&&t-pc>12e3?(rn=Math.min(1,Math.round((rn+.05)*20)/20),Zi(),_r=0):i>=44&&(_r=0),D.quality==="high"&&_r>=3&&i<26&&(_r=0,Nr("low"),ht.toast("Графика переключена на лёгкую: так плавнее",3200))}function a_(){try{return window.localStorage.getItem("hermitage-quality")}catch{return null}}function mc(){return new Promise(i=>requestAnimationFrame(()=>i()))}async function l_(){const i=Lt.getSize(new Ct),t=Lt.getPixelRatio();try{await Lt.compileAsync(ne,te.mono)}catch{Lt.compile(ne,te.mono)}Lt.setPixelRatio(1),Lt.setSize(320,180,!1),As(Lt,ne,te.mono),qa(Lt,ne,te,{quality:D.quality}),Lt.setPixelRatio(t),Lt.setSize(i.x,i.y,!1),Lt.shadowMap.needsUpdate=!0,As(Lt,ne,te.mono),Lt.shadowMap.autoUpdate=!1,cu=!0}function Nr(i){const t=D.quality;D.quality=i,ht.setQualityLabel(i);try{window.localStorage.setItem("hermitage-quality",i)}catch{}if(!Lt)return;rn=1,Zi();const e=i==="high"!=(t==="high");Lt.shadowMap.enabled=i==="high",T0(i==="high"),cn&&cn.setSimple(i!=="high"),Lt.toneMappingExposure=i==="high"?1.16:1.22,ne&&(e&&(ne.traverse(n=>{n.isMesh&&n.material&&(n.material.needsUpdate=!0)}),i==="high"&&(Lt.shadowMap.needsUpdate=!0),c_()),ye&&ye.setMaxWidth(hu()))}function c_(){const i=Lt.getSize(new Ct),t=Lt.getPixelRatio();Lt.setPixelRatio(1),Lt.setSize(160,90,!1),As(Lt,ne,te.mono),qa(Lt,ne,te,{quality:D.quality}),Lt.setPixelRatio(t),Lt.setSize(i.x,i.y,!1),Lt.shadowMap.needsUpdate=!0}function Ji(){Lt&&Zi()}function Qi(i,t){if(ot.position=[i.position[0],pt.eye,i.position[1]],ot.yaw=t.yaw,ot.pitch=t.pitch,D.currentPointId=i.id,Se.recenter(t.yaw,t.pitch),ht.setPointName(i),ye){const e=ru(i);ye.show(e?e.id:null)}}function fu(){D.mode="explore",D.closeUp=null,Ge&&Ge.reset(),yr=null,Ts(te,Wa),ht.setCloseUp(!1),ht.showStart(!1),ht.showHUD(!0);const i=Ze(D.currentPointId)||Ze(sr);Qi(i,Hn(i)),De.reset(null),ht.toast("Смотрите на медальон · 10 секунд",3200)}function pu(){return window.innerWidth>=window.innerHeight}async function mu(){if(!pu()){ht.openPanel("vr"),ht.toast("Поверните телефон горизонтально и нажмите «Войти»",3800);return}ht.closePanels(),ht.showStart(!1),ht.showHUD(!1),document.body.classList.add("vr"),D.mode="vr",rn=1,Zi();try{!document.fullscreenElement&&document.documentElement.requestFullscreen&&await document.documentElement.requestFullscreen({navigationUI:"hide"})}catch{}try{screen.orientation&&screen.orientation.lock&&await screen.orientation.lock("landscape")}catch{}const i=Ze(D.currentPointId)||Ze(sr);Qi(i,Hn(i));const t=await Se.requestGyro();t==="denied"||t==="unsupported"?(ht.showVRHint("Гироскоп недоступен","Осматривайтесь свайпом по экрану. Нажмите и удерживайте 1,2 с, чтобы выйти."),ht.hideVRHint(5200),ht.setGyroStatus(t==="denied"?"запрещён":"нет в устройстве")):ht.setGyroStatus("запрошен"),Rs(),De.reset(null)}function xa(){rn=1,Zi(),D.mode==="vr"&&(document.body.classList.remove("vr"),D.mode="explore",ht.showHUD(!0),ht.showVRHint(""),ht.el&&ht.el.vrSetup&&(ht.el.vrSetup.hidden=!0),document.fullscreenElement&&document.exitFullscreen&&document.exitFullscreen().catch(()=>{}),ht.toast("Обычный экран · продолжите осмотр",2400),Ji())}function Rs(){const i=Ze(D.currentPointId)||Ze(sr),t=Hn(i);Se.recenter(t.yaw,t.pitch),ot.yaw=t.yaw,ot.pitch=t.pitch,De.reset(null)}function gu(i){const t=Ze(i);if(!t)return;D.closeUp=null,ht.setCloseUp(!1);const e=Hn(t),n=D.mode==="vr"?"fade":"glide";D.travel={id:t.id,target:t,travel:ka({mode:n,from:[ot.position[0],ot.position[2]],to:[t.position[0],t.position[1]],fromYaw:ot.yaw,fromPitch:ot.pitch,toYaw:e.yaw,toPitch:e.pitch,eye:pt.eye})},Ki=0,De.reset(null),D.mode!=="vr"&&ht.toast(`Переходим: ${t.name}`,1600)}function u_(i){if(!D.travel)return!1;Ki+=i;const t=Math.min(1,Ki/D.travel.travel.duration),e=D.travel.travel.sample(t);if(D.travel.travel.kind==="fade"&&ht.fadeTo(e.alpha),vi(te,{position:e.position,yaw:e.yaw,pitch:e.pitch}),t>=1){const n=D.travel;if(D.travel=null,ht.fadeTo(0),t_&&ht.debugTravel(""),n.kind==="study"&&D.closeUp){const{pose:r}=D.closeUp;ot.position=[r.position[0],pt.eye,r.position[2]],ot.yaw=r.yaw,ot.pitch=r.pitch,Se.recenter(r.yaw,r.pitch),De.reset(null),Ge.reset(),Jn=0,ye&&ye.show(n.art.id);const s=Ya.get(n.art.id);return s&&ht.setInfo(s,!0),Ts(te,Ur),ht.setCloseUp(!0,`«${n.art.title}»`),D.mode!=="vr"&&ht.toast("Отведите взгляд в сторону, чтобы вернуться к точке",3e3),!0}if(n.kind==="study-back")return D.closeUp=null,Ts(te,Wa),Qi(n.target,Hn(n.target)),ht.setCloseUp(!1),De.reset(null),Ge.reset(),Jn=0,!0;D.closeUp=null,ht.setCloseUp(!1),ht.toast(`Вы у точки: ${n.target.name}`,1900),Qi(n.target,Hn(n.target)),De.reset(null)}return!0}function Cs(i,t){for(const e of lu.values()){const n=e.glow;if(!n)continue;const r=e.art.id===i&&D.mode==="vr"?Math.min(.42,t*.42):0;n.visible=r>.01,n.material.opacity=r}}function h_(i,t=null){const e=t||(D.hover&&D.hover.kind==="painting"?D.hover:null),n=Ge.update(i,e?e.id:null),r=!!(ji&&ji.targetId);if(n.artId&&n.artId!==yr&&(yr=n.artId,r||ht.toast("Держите взгляд на полотне · 10 секунд — подойдёте ближе",2800),ye&&ye.preload(n.artId)),!n.artId){yr=null,Cs(null,0);return}if(Cs(n.artId,n.progress),r||ht.setDwell({active:!0,progress:n.progress,point:{name:`«${e.title}»`}}),n.ready){const s=Lr(n.artId);s&&_u(s)}}function _u(i){if(!i||D.travel||D.closeUp)return!1;const t=D.mode==="vr"?window.innerWidth/2/window.innerHeight:window.innerWidth/window.innerHeight,e=Xa(i,{fov:Ur,aspect:t,eye:pt.eye}),n=D.mode==="vr";return D.closeUp={id:i.id,pose:e,entryPoint:D.currentPointId,zoom:0},D.travel={id:i.id,kind:"study",art:i,travel:ka({mode:n?"fade":"glide",from:[ot.position[0],ot.position[2]],to:[e.position[0],e.position[2]],fromYaw:ot.yaw,fromPitch:ot.pitch,toYaw:e.yaw,toPitch:e.pitch,eye:pt.eye,duration:1.9})},Ki=0,Ge.reset(),Jn=0,yr=null,Cs(null,0),De.reset(null),ji={targetId:null,progress:0},ye&&ye.preload(i.id),D.mode==="vr"?ht.hideVRHint(0):ht.toast(`Подходим ближе: «${i.title}»`,1700),!0}function Us(i){if(!D.closeUp)return 0;const t=Lr(D.closeUp.id);if(!t)return 0;const e=Math.max(0,Math.min(1,i)),n=D.mode==="vr"?window.innerWidth/2/window.innerHeight:window.innerWidth/window.innerHeight,s=(D.closeUp.pose.baseDistance||D.closeUp.pose.distance)*(1-.7*e),o=Xa(t,{fov:Ur,aspect:n,eye:pt.eye,distance:s});return D.closeUp.pose=o,D.closeUp.zoom=e,ot.position=[o.position[0],pt.eye,o.position[2]],ot.yaw=o.yaw,ot.pitch=o.pitch,Se.recenter(o.yaw,o.pitch),vi(te,{position:ot.position,yaw:o.yaw,pitch:o.pitch}),e}function d_(i){D.closeUp&&Us(D.closeUp.zoom+i)}function Ds(){if(!D.closeUp||D.travel)return!1;const i=Ze(D.currentPointId)||Ze(sr),t=Hn(i);return D.travel={id:i.id,kind:"study-back",target:i,travel:ka({mode:D.mode==="vr"?"fade":"glide",from:[ot.position[0],ot.position[2]],to:[i.position[0],i.position[1]],fromYaw:ot.yaw,fromPitch:ot.pitch,toYaw:t.yaw,toPitch:t.pitch,eye:pt.eye,duration:1.7})},Ki=0,Ge.reset(),Jn=0,Cs(null,0),De.reset(null),ht.setCloseUp(!1),ht.setInfo(null),D.mode!=="vr"&&ht.toast("Возвращаемся к точке",1500),!0}function f_(i){const t=D.closeUp?Lr(D.closeUp.id):null;if(!t)return;const e=t.position[0]-ot.position[0],n=t.position[1]-ot.position[1],r=t.position[2]-ot.position[2],s=Math.hypot(e,n,r)||1e-6,o=Ga(ot.yaw,ot.pitch),a=(o[0]*e+o[1]*n+o[2]*r)/s;Math.acos(Math.max(-1,Math.min(1,a)))*(180/Math.PI)>Yg?(Jn+=i,Jn>$g&&Ds()):Jn=0}function vu(i){if(Ms+=i,Ms<.1)return;if(Ms=0,D.mode!=="explore"&&D.mode!=="vr"){D.hover&&(D.hover=null,ht.setInfo(null));return}te.updateMatrixWorld(!0),Ps.setFromCamera(xu,te.mono);const e=Ps.intersectObjects(Dr,!1).find(n=>n.distance<17);if(e){const n=e.object.userData.exhibitId,r=Ya.get(n);r&&(!D.hover||D.hover.id!==n)&&(D.hover=r,D.mode!=="vr"&&ht.setInfo(r,!0),ye&&r.kind==="painting"&&e.distance<6.5&&ye.preload(r.id))}else D.hover&&(D.hover=null,ht.setInfo(null))}const Ps=new od,xu=new Ct(0,0),p_=.25,m_=.06;function gc(i=p_){const t=[ot.position[0],ot.position[1],ot.position[2]],e=Ga(ot.yaw,ot.pitch);let n=null;for(const r of zn){const s=Ba(r.rotationY),o=e[0]*s[0]+e[2]*s[2];if(o>-.08)continue;const a=((r.position[0]-t[0])*s[0]+(r.position[2]-t[2])*s[2])/o;if(a<.35||a>12)continue;const l=t[0]+e[0]*a,c=t[1]+e[1]*a,h=t[2]+e[2]*a,u=[-s[2],s[0]],d=(l-r.position[0])*u[0]+(h-r.position[2])*u[1],f=c-r.position[1];Math.abs(d)>r.width/2+i||Math.abs(f)>r.height/2+i||(!n||a<n.t)&&(n={art:r,t:a})}return n?n.art:null}function Mu(i){if(D.mode==="loading"||D.mode==="start"){cn.update(i,{currentPointId:D.currentPointId,targetId:null,progress:0,visible:!1}),vn&&(vn.rotation.y+=i*.006);return}Se.update(i);const t=!!D.travel;if(t?u_(i):(ot.yaw=Se.state.yaw,ot.pitch=Sr(Se.state.pitch),vi(te,{position:ot.position,yaw:ot.yaw,pitch:ot.pitch})),!t&&D.closeUp)cn.update(i,{currentPointId:D.currentPointId,targetId:null,progress:0,visible:!1}),ht.setDwell({active:!1,progress:0}),f_(i),vn&&(vn.rotation.y+=i*.006);else if(t)cn.update(i,{currentPointId:D.currentPointId,targetId:null,progress:0,visible:!1}),ht.setDwell({active:!1,progress:0});else{const e=Ga(ot.yaw,ot.pitch);dc=(D.hover&&D.hover.kind==="painting"?D.hover:null)||gc();const r=De.update(i,{position:[ot.position[0],ot.position[1],ot.position[2]],forward:e,currentPointId:D.currentPointId,enabled:!gc(m_)});ji=r,r.arrival&&(va=r.arrival,gu(r.arrival));const s=r.targetId?Ze(r.targetId):null;if(cn.update(i,{currentPointId:D.currentPointId,targetId:r.targetId,progress:r.progress,visible:Er}),D.mode==="explore"){if(ht.setDwell({active:!!r.targetId,progress:r.progress,point:s}),r.targetId&&r.targetId!==yo&&ye&&s){const o=ru(s);o&&ye.preload(o.id)}}else ht.setDwell({active:!1,progress:0});r.targetId!==yo&&(yo=r.targetId),vn&&(vn.rotation.y+=i*.01)}vu(i),!t&&!D.closeUp&&Ge&&(D.mode==="explore"||D.mode==="vr")&&h_(i,dc)}function fi(){!Lt||!ne||(D.mode==="vr"?qa(Lt,ne,te,{quality:D.quality}):As(Lt,ne,te.mono),D.frames+=1)}let _c=0;function Ss(i){if(D.paused){D.lastFrame=i,requestAnimationFrame(Ss);return}if(D.mode==="start"&&i-_c<70){D.lastFrame=i,requestAnimationFrame(Ss);return}D.mode==="start"&&(_c=i);const t=Math.min(.05,(i-D.lastFrame)/1e3||.016);D.lastFrame=i,D.fpsWindow+=t,D.fpsWindow>1.5&&(D.fps=Math.round(D.frames/D.fpsWindow),o_(D.fps,i),D.frames=0,D.fpsWindow=0),Mu(t),fi(),requestAnimationFrame(Ss)}function g_(){document.hidden?(D.paused=!0,Se.state.yaw=ot.yaw,Se.state.pitch=ot.pitch):(D.paused=!1,D.lastFrame=performance.now(),Ji())}function __(){Mn.addEventListener("wheel",s=>{D.closeUp&&(s.preventDefault(),d_(s.deltaY<0?.12:-.12))},{passive:!1});const i=new Map;let t=0,e=0;const n=()=>{const[s,o]=[...i.values()];return Math.hypot(s.x-o.x,s.y-o.y)||1e-6};Mn.addEventListener("pointerdown",s=>{D.closeUp&&(i.set(s.pointerId,{x:s.clientX,y:s.clientY}),i.size===2&&(t=n(),e=D.closeUp.zoom))}),Mn.addEventListener("pointermove",s=>{!D.closeUp||!i.has(s.pointerId)||(i.set(s.pointerId,{x:s.clientX,y:s.clientY}),i.size===2&&t>0&&Us(e+(n()/t-1)*1.6))});const r=s=>{i.delete(s.pointerId),i.size<2&&(t=0)};Mn.addEventListener("pointerup",r),Mn.addEventListener("pointercancel",r)}function v_(){let i=0,t=!1,e=0;Mn.addEventListener("pointerdown",()=>{D.mode==="vr"&&(t=!1,e=performance.now(),i=window.setTimeout(()=>{t=!0,xa()},1200))});const n=()=>{window.clearTimeout(i),D.mode==="vr"&&!t&&performance.now()-e<350&&(D.closeUp?Us(D.closeUp.zoom>.5?0:1):Rs())};Mn.addEventListener("pointerup",n),Mn.addEventListener("pointercancel",()=>window.clearTimeout(i)),window.addEventListener("keydown",r=>{r.key==="Escape"&&(D.closeUp?Ds():D.mode==="vr"&&xa()),r.key.toLowerCase()==="r"&&D.mode!=="vr"&&!D.closeUp&&Rs()}),window.addEventListener("resize",()=>{Ji(),D.mode==="vr"&&!pu()&&ht.showVRHint("Поверните телефон","Для очков нужна горизонтальная ориентация.")}),document.addEventListener("visibilitychange",g_)}function vc(i){const t=Ze(i);return t?(D.travel=null,D.closeUp=null,Ge&&Ge.reset(),Ts(te,Wa),ht.setCloseUp(!1),ht.fadeTo(0),Qi(t,Hn(t)),vi(te,{position:ot.position,yaw:ot.yaw,pitch:ot.pitch}),De.reset(null),cn.update(.016,{currentPointId:D.currentPointId,targetId:null,progress:0,visible:Er}),!0):!1}function Su(i,t=ot.position){const e=Ze(i);if(!e)return null;const n=ou([t[0],t[1],t[2]],e.position),r=Math.hypot(n[0],n[2])||1e-6;return{yaw:Math.atan2(n[0],-n[2]),pitch:Math.atan2(n[1],r)}}function x_(i){const t=Su(i);return t?(Se.recenter(t.yaw,t.pitch),ot.yaw=t.yaw,ot.pitch=t.pitch,vi(te,{position:ot.position,yaw:ot.yaw,pitch:ot.pitch}),{yaw:t.yaw,pitch:t.pitch}):!1}function M_(i){const t=za.find(n=>n.id===i);if(!t)return!1;const e=Qc([ot.position[0],ot.position[1],ot.position[2]],t.position);return Se.recenter(e.yaw,e.pitch),ot.yaw=e.yaw,ot.pitch=e.pitch,vi(te,{position:ot.position,yaw:ot.yaw,pitch:ot.pitch}),S_(),{yaw:e.yaw,pitch:e.pitch}}function S_(){Ms=1,vu(.11)}function y_(i,t=1){for(let e=0;e<t;e+=1)Mu(i)}function E_(i){return{version:"1.0.0",ready:!0,points:()=>Br.map((t,e)=>({...t,index:e+1})),exhibits:()=>za.map(t=>({...t})),artworks:()=>zn.map(t=>({id:t.id,title:t.title,author:t.author,file:t.file})),sculptures:()=>Ir.map(t=>({id:t.id,title:t.title,file:t.file})),info:()=>({mode:D.mode,quality:D.quality,pointId:D.currentPointId,position:[...ot.position],yaw:ot.yaw,pitch:ot.pitch,source:Se.state.source,gyro:Se.state.gyro,fps:D.fps,frames:D.frames,stereoReady:cu,drawCalls:Lt.info.render.calls,triangles:Lt.info.render.triangles,meshes:i.meshes,travel:D.travel?D.travel.id:null,dpr:Lt.getPixelRatio(),renderScale:rn,detail:ye?ye.info():null}),dwell:()=>{const t=ji||De.snapshot();return{...t,ring:z0(t.progress),secondsLeft:Math.max(0,tu*(1-t.progress)),lastArrival:va}},pose:()=>({position:[...ot.position],yaw:ot.yaw,pitch:ot.pitch,pointId:D.currentPointId}),enter:()=>fu(),enterVR:async()=>(await mu(),D.mode),exitVR:()=>(xa(),D.mode),goto:t=>vc(t),lookAtPoint:t=>x_(t),markerPose:t=>Su(t),markerHeight:su,lookAtExhibit:t=>M_(t),setLook:(t,e)=>(Se.recenter(t,e),ot.yaw=t,ot.pitch=Sr(e),vi(te,{position:ot.position,yaw:ot.yaw,pitch:ot.pitch}),{yaw:ot.yaw,pitch:ot.pitch}),setPoint:t=>vc(t),step:(t=1/60,e=1)=>(va=null,y_(t,e),ji||De.snapshot()),render:()=>fi(),quality:t=>(Nr(t),D.quality),hover:()=>D.hover?{id:D.hover.id,title:D.hover.title}:null,debugHover:()=>(te.updateMatrixWorld(!0),Ps.setFromCamera(xu,te.mono),{hits:Ps.intersectObjects(Dr,!1).slice(0,3).map(e=>({name:e.object.name,id:e.object.userData.exhibitId,distance:+e.distance.toFixed(2)})),hoverMeshes:Dr.length,camera:te.mono.getWorldPosition(new U).toArray()}),study:()=>({seconds:eu,artId:Ge?Ge.artId:null,progress:Ge?Ge.progress:0,closeUp:D.closeUp?D.closeUp.id:null}),closeUp:()=>D.closeUp?{id:D.closeUp.id,zoom:D.closeUp.zoom||0,pose:{...D.closeUp.pose,position:[...D.closeUp.pose.position]},pointId:D.closeUp.entryPoint}:null,setCloseUpZoom:t=>Us(t),debugLights:t=>{if(!gn)return null;const e={hemi:gn.hemi,fill:gn.fill,sun:gn.sun};return gn.lights.children.forEach(n=>{n.isPointLight&&(n.visible=t!=="point")}),e[t]&&(e[t].visible=!1),fi(),t},debugLightsReset:()=>gn?(gn.lights.traverse(t=>{t.isLight&&(t.visible=!0)}),fi(),!0):null,debugShade:t=>(t==="normal"?ne.overrideMaterial=new Cl({flatShading:!1}):t==="flat"?ne.overrideMaterial=new Cl({flatShading:!0}):t==="basic"?ne.overrideMaterial=new je({color:8952234}):ne.overrideMaterial=null,fi(),t||"off"),debugRender:({shadows:t=!0,near:e=null}={})=>{if(gn&&(gn.sun.castShadow=t),e)for(const n of[te.left,te.right,te.mono])n.near=e,n.updateProjectionMatrix();return Lt.shadowMap.needsUpdate=!0,fi(),{shadows:t,near:te.mono.near}},debugState:()=>({travel:D.travel?{kind:D.travel.kind,t:+(Ki/D.travel.travel.duration).toFixed(3)}:null,lookAway:+Jn.toFixed(3),closeUp:D.closeUp?D.closeUp.id:null,look:{yaw:+Se.state.yaw.toFixed(3),pitch:+Se.state.pitch.toFixed(3),source:Se.state.source},player:{yaw:+ot.yaw.toFixed(3),pitch:+ot.pitch.toFixed(3)}}),enterCloseUp:t=>{const e=Lr(t);return e?_u(e):!1},exitCloseUp:()=>Ds(),coverage:t=>{const e=Lr(t);if(!e)return null;const n=D.mode==="vr"?window.innerWidth/2/window.innerHeight:window.innerWidth/window.innerHeight,r=D.closeUp&&D.closeUp.id===t?D.closeUp.pose:Xa(e,{fov:Ur,aspect:n,eye:pt.eye});return{...Y0(e,r,{fov:Ur,aspect:n}),pose:r}},setMarkers:t=>(Er=t!==!1,Er?cn.markers.forEach(e=>{e.holder.visible=e.point.id!==D.currentPointId}):cn.markers.forEach(e=>{e.holder.visible=!1}),Er),markers:()=>cn.markers.map(t=>({id:t.point.id,visible:t.holder.visible,progress:t.ringMat.uniforms.uProgress.value,active:t.ringMat.uniforms.uActive.value})),travelInfo:()=>D.travel?{id:D.travel.id,kind:D.travel.travel.kind,duration:D.travel.travel.duration}:null,forceDwellComplete:()=>{const t=De.targetId;return t?(gu(t),t):null},setPaused:t=>{D.paused=!!t,D.lastFrame=performance.now()},clearTravel:()=>{D.travel=null,ht.fadeTo(0)},setQuality:t=>(Nr(t),D.quality),sceneInfo:()=>({children:ne.children.length,hall:i.meshes}),detail:t=>ye?ye.show(t):null,detailInfo:()=>ye?ye.info():null,textures:()=>i.paintings.map(t=>({id:t.art.id,base:t.baseTexture?[t.baseTexture.image.width,t.baseTexture.image.height]:null,detail:t.detailTexture?[t.detailTexture.image.width,t.detailTexture.image.height]:null})),resolution:()=>({dpr:Lt.getPixelRatio(),scale:rn,cap:du()}),lights:()=>{let t=0;return ne.traverse(e=>{e.isLight&&(t+=1)}),t},debugCanvas:t=>{const e=i.paintings.find(r=>r.art.id===t);if(!e)return null;const n=e.canvasMat;return{hasMap:!!n.map,mapColor:n.map&&n.map.colorSpace,imageSize:n.map&&n.map.image?[n.map.image.width,n.map.image.height]:null,imageIsCanvas:!!(n.map&&n.map.image instanceof HTMLCanvasElement),visible:e.canvas.visible,worldPos:e.canvas.getWorldPosition(new U).toArray(),scale:e.canvas.getWorldScale(new U).toArray(),parentRot:e.group.rotation.y,frustumCulled:e.canvas.frustumCulled}}}}window.addEventListener("resize",()=>Ji());v_();__();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register(new URL("sw.js",document.baseURI)).catch(()=>{})});r_().catch(i=>{console.error(i),ht&&ht.showWebGLError()});
