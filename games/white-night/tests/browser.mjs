import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
export async function launch(){
 const lib='/tmp/white-night-al2023';
 if(!fs.existsSync(lib+'/libnspr4.so')){fs.mkdirSync(lib,{recursive:true});const archive='/tmp/white-night-libs.tar';fs.writeFileSync(archive,zlib.brotliDecompressSync(fs.readFileSync('node_modules/@sparticuz/chromium/bin/al2023.tar.br')));execFileSync('tar',['-xf',archive,'-C',lib]);}
 const env={...process.env,LD_LIBRARY_PATH:[lib,lib+'/lib',process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')};
 return puppeteer.launch({executablePath:await chromium.executablePath(),env,headless:true,args:[...chromium.args,'--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'],defaultViewport:{width:1440,height:1000,deviceScaleFactor:1}});
}
