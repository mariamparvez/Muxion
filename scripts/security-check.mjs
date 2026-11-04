import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('public');
const files=await fs.readdir(root,{recursive:true,withFileTypes:true});
let checked=0;
for(const file of files){
  if(!file.isFile())continue;
  const absolute=path.join(file.parentPath,file.name),relative=path.relative(root,absolute).replaceAll('\\','/');
  assert.ok(!/(^|\/)(?:\.|node_modules|api\/|muxion-backend\/)|(?:\.pem|\.key|\.env|\.map|\.tsx?)$|package(?:-lock)?\.json|generate-favicon|button-review|firebase-adminsdk/i.test(relative),'Unexpected published file: '+relative);
  if(!/\.(js|json|html|svg|css|txt|xml)$/.test(file.name))continue;
  const text=await fs.readFile(absolute,'utf8');
  assert.doesNotMatch(text,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|"private_key"\s*:|RAZORPAY_KEY_SECRET|FIREBASE_SERVICE_ACCOUNT_JSON|RAZORPAY_WEBHOOK_SECRET/,'Server secret or secret configuration in: '+relative);
  checked++;
}
const data=await fs.readFile(path.join(root,'data.js'),'utf8');
assert.doesNotMatch(data,/"(?:quiz|meet|whatsapp|payment)"\s*:/,'Private course data in public seed');
console.log(`Publish audit passed: ${checked} text assets checked; no server credentials, private seed fields, debug pages or source maps.`);
