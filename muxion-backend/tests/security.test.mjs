import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {jsonBody,httpsURL,BurstLimiter,accountRateLimit} from '../security.mjs';
import {escapeHTML,safeLink} from '../../muxion/security-ui.js';
import {MemoryFirestore} from './memory-firestore.mjs';
import {Platform,seedOffers,validateOffer} from '../platform.mjs';
import {createHandler} from '../../api/[action].js';

test('stored form text cannot escape HTML or attribute contexts',()=>{
  const payload='\"><img src=x onerror="alert(1)"><script>alert(2)</script>&';
  const result=escapeHTML(payload);
  assert.equal(/[<>"']/.test(result),false);assert.match(result,/&lt;script&gt;/);
});
test('navigation rejects scripts, credentials, external protocol-relative URLs and control characters',()=>{
  for(const value of ['javascript:alert(1)','data:text/html,<script>x</script>','//evil.test','/\\evil.test','https://user:pass@evil.test','java\nscript:x'])assert.equal(safeLink(value),'#');
  assert.equal(safeLink('/learner/courses'),'/learner/courses');
  assert.equal(safeLink('https://example.test/?x="'), 'https://example.test/?x=&quot;');
  assert.equal(safeLink('https://example.test'), 'https://example.test');
  assert.equal(safeLink('mailto:hello@muxion.in'),'mailto:hello@muxion.in');
  assert.equal(safeLink('http://insecure.test',{resource:true}),'#');
});
test('HTTPS media and assignment links reject credentials, scripts and control characters',()=>{
  assert.equal(httpsURL('https://www.figma.com/design/123'),true);
  for(const url of ['https://a:b@example.test','https://example.test/\nabc','javascript:alert(1)','http://example.test',{},null])assert.equal(httpsURL(url),false);
  const course=seedOffers().find(o=>o.kind==='course');
  for(const url of ['javascript:alert(1)','https://a:b@example.test'])assert.throws(()=>validateOffer({...course,lessons:[{...course.lessons[0],url}]}),e=>e.status===400);
  assert.throws(()=>validateOffer({...course,image:'assets/../private.json'}),e=>e.status===400);
});
test('JSON validation rejects malformed objects, media types, pollution and oversized UTF-8',()=>{
  const req=body=>({headers:{'content-type':'application/json; charset=utf-8'},body});
  assert.deepEqual(jsonBody(req('{"name":"Mariam"}'),100),{name:'Mariam'});
  for(const body of ['{',null,[],JSON.parse('{"__proto__":{"admin":true}}'),{nested:{constructor:{role:'admin'}}}])assert.throws(()=>jsonBody(req(body),1000),e=>e.status===400);
  assert.throws(()=>jsonBody({headers:{'content-type':'application/jsonp'},body:{}},1000),e=>e.status===415);
  assert.throws(()=>jsonBody(req({note:'😀'.repeat(40)}),100),e=>e.status===413);
  let deep={};for(let i=0;i<18;i++)deep={nested:deep};assert.throws(()=>jsonBody(req(deep),1000),e=>e.status===400);
  assert.equal({}.admin,undefined);
});
test('burst protection returns a bounded retry interval and resets',()=>{
  let now=0;const limiter=new BurstLimiter(()=>now);limiter.check('client',2);limiter.check('client',2);
  assert.throws(()=>limiter.check('client',2),e=>e.status===429&&e.retryAfter===60);
  limiter.check('other',2);now=60001;limiter.check('client',2);
});
test('durable account limits survive concurrent requests and isolate accounts and scopes',async()=>{
  const db=new MemoryFirestore();const results=await Promise.allSettled(Array.from({length:12},()=>accountRateLimit(db,'a','create-order','POST',1000)));
  assert.equal(results.filter(r=>r.status==='fulfilled').length,8);
  assert.ok(results.filter(r=>r.status==='rejected').every(r=>r.reason.status===429));
  await accountRateLimit(db,'b','create-order','POST',1000);
  await accountRateLimit(db,'a','verify-payment','POST',1000);
  await accountRateLimit(db,'a','create-order','POST',61001);
  assert.equal(db.records.size,3);assert.equal(JSON.stringify([...db.records]).includes('email'),false);
});
function fixture(){
  const db=new MemoryFirestore();const auth={verifyIdToken:async token=>{if(token!=='learner')throw Error('invalid token');return {uid:'a',email:'a@example.test',email_verified:true};}};
  const p=new Platform({db,auth});
  const payments={untoken:()=>({sid:'a'.repeat(64)}),newSession:()=> 'a'.repeat(64),token:()=> 'signed-fixture',mode:'test',keyId:'rzp_test_fixture'};
  const handler=createHandler(payments,p);
  async function call(action,{method='GET',headers={},body,query={}}={}){
    const req={url:'/api/'+action,query:{action,...query},method,headers:{origin:'https://www.muxion.in','content-type':'application/json',...headers},body};
    const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await handler(req,res);return res;
  }
  return {db,p,call};
}
test('API authentication and ownership protect routes even when called directly',async()=>{
  const {call}=fixture();
  for(const action of ['account','admin-catalogue','admin-orders','course-content','payment-history'])assert.equal((await call(action)).code,401);
  const headers={authorization:'Bearer learner'};
  for(const action of ['admin-catalogue','admin-orders'])assert.equal((await call(action,{headers})).code,403);
  assert.equal((await call('course-content',{headers,query:{id:'course:mastery',uid:'owner'}})).code,403);
  for(const action of ['admin-offer','user-access','certificate-revoke'])assert.equal((await call(action,{method:'POST',headers,body:{}})).code,403);
});
test('API rejects CORS, wrong methods and invalid bodies without returning internals',async()=>{
  const {call}=fixture();
  assert.equal((await call('account',{headers:{origin:'https://evil.test'}})).code,403);
  assert.equal((await call('create-order',{method:'POST',headers:{origin:'https://evil.test'}})).code,403);
  const method=await call('account',{method:'DELETE'});assert.equal(method.code,405);assert.equal(method.headers.Allow,'GET, POST');
  const bad=await call('profile-save',{method:'POST',headers:{authorization:'Bearer learner'},body:'{'});assert.equal(bad.code,400);assert.equal(JSON.stringify(bad.body).includes('stack'),false);
  assert.equal(bad.headers['Cache-Control'],'no-store');assert.equal(bad.headers['Access-Control-Allow-Origin'],undefined);
});
test('published configuration enforces CSP without inline scripts or eval and preserves OAuth/checkout',async()=>{
  const config=JSON.parse(await readFile(new URL('../../vercel.json',import.meta.url),'utf8'));
  const headers=Object.fromEntries(config.headers[0].headers.map(h=>[h.key,h.value]));
  assert.equal(headers['X-Frame-Options'],'DENY');assert.equal(headers['X-Content-Type-Options'],'nosniff');
  assert.match(headers['Content-Security-Policy'],/script-src-attr 'none'/);
  assert.doesNotMatch(headers['Content-Security-Policy'].split('script-src ')[1].split(';')[0],/unsafe-inline|unsafe-eval/);
  assert.match(headers['Content-Security-Policy'],/https:\/\/\*\.razorpay.com/);
  assert.equal(headers['Cross-Origin-Opener-Policy'],'same-origin-allow-popups');
  assert.ok(!config.headers.some(h=>h.headers.some(x=>x.key==='Access-Control-Allow-Origin'&&x.value==='*')));
});
