import fs from 'node:fs/promises';
import {siteOrigin,publicRoutes} from '../muxion/seo.js';
const key=(await fs.readFile(new URL('../muxion/indexnow-key.txt',import.meta.url),'utf8')).trim();
if(!/^[a-f0-9]{32}$/.test(key))throw new Error('Invalid IndexNow ownership key.');
const urlList=publicRoutes().map(route=>siteOrigin+route);
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({host:new URL(siteOrigin).host,key,keyLocation:`${siteOrigin}/${key}.txt`,urlList}),signal:AbortSignal.timeout(30000)});
console.log(JSON.stringify({service:'IndexNow',status:response.status,urls:urlList.length,accepted:[200,202].includes(response.status)},null,2));
if(![200,202].includes(response.status)){console.error((await response.text()).slice(0,1000));process.exitCode=1;}
