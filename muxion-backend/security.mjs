import {createHash} from 'node:crypto';
import {PaymentError} from './payments.mjs';

export function secureHeaders(res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
}

export function httpsURL(value) {
  if(typeof value!=='string'||value.length>4000||/[\s\u0000-\u001f\u007f]/.test(value))return false;
  try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}
}

export function jsonBody(req,limit) {
  const type=String(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();
  if(type!=='application/json')throw new PaymentError(415,'Send application/json.');
  let body=req.body;
  if(Number(req.headers['content-length']||0)>limit)throw new PaymentError(413,'Request is too large.');
  try{
    const raw=typeof body==='string'?body:JSON.stringify(body);
    if(typeof raw!=='string')throw new PaymentError(400,'A JSON object is required.');
    if(Buffer.byteLength(raw,'utf8')>limit)throw new PaymentError(413,'Request is too large.');
    body=JSON.parse(raw);
  }catch(error){if(error instanceof PaymentError)throw error;throw new PaymentError(400,'Invalid JSON.');}
  if(!body||Array.isArray(body)||typeof body!=='object')throw new PaymentError(400,'A JSON object is required.');
  const check=(value,depth=0)=>{
    if(depth>16)throw new PaymentError(400,'Request is nested too deeply.');
    if(value&&typeof value==='object')for(const key of Object.keys(value)){
      if(['__proto__','constructor','prototype'].includes(key))throw new PaymentError(400,'Unsupported form field.');
      check(value[key],depth+1);
    }
  };
  check(body);return body;
}

// Best-effort pre-authentication burst protection. Durable signed-in limits below
// survive cold starts and multiple Vercel instances; no external paid service.
export class BurstLimiter {
  constructor(now=()=>Date.now()){this.now=now;this.entries=new Map();}
  check(key,limit=120,windowMs=60000){
    const now=this.now();let record=this.entries.get(key);
    if(!record||record.reset<=now)record={count:0,reset:now+windowMs};
    if(++record.count>limit){const error=new PaymentError(429,'Too many requests. Please try again shortly.');error.retryAfter=Math.max(1,Math.ceil((record.reset-now)/1000));throw error;}
    this.entries.set(key,record);
    if(this.entries.size>5000)for(const [id,r]of this.entries)if(r.reset<=now)this.entries.delete(id);
    if(this.entries.size>10000)this.entries.delete(this.entries.keys().next().value);
  }
}

export async function accountRateLimit(db,uid,action,method,now=Date.now()) {
  const scope=action==='create-order'?'orders':action==='verify-payment'?'verification':method==='GET'?'reads':'writes';
  const limit={orders:8,verification:30,reads:100,writes:40}[scope];
  const ref=db.collection('requestLimits').doc(createHash('sha256').update(uid+'|'+scope).digest('hex'));
  await db.runTransaction(async tx=>{
    const previous=(await tx.get(ref)).data();
    const current=previous&&previous.reset>now?previous:{count:0,reset:now+60000};
    if(current.count>=limit){const error=new PaymentError(429,'Too many requests. Please try again shortly.');error.retryAfter=Math.max(1,Math.ceil((current.reset-now)/1000));throw error;}
    // One bounded document per account/scope, overwritten each minute. No IP,
    // token, email, payment key or unbounded per-request records are stored.
    tx.set(ref,{count:current.count+1,reset:current.reset});
  });
}
