import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {mkdtemp, rm, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Payments, PaymentStore, validSignature} from '../payments.mjs';
import {createMuxionServer} from '../server.mjs';

const secret = 'test-fixture-not-a-real-credential';
const signature = (order='order_fixture', payment='pay_fixture') => createHmac('sha256', secret).update(`${order}|${payment}`).digest('hex');
function fixture(overrides={}) {
  const store = {records:{}, async update(fn){const draft=structuredClone(this.records);const result=await fn(draft);this.records=draft;return result}};
  let creates=0;
  const client={orders:{async create(body){creates++;return {id:'order_fixture',amount:body.amount,currency:body.currency}}},payments:{async fetch(){return {id:'pay_fixture',order_id:'order_fixture',amount:29900,currency:'INR',status:'captured',captured:true,...overrides}}}};
  const payments=new Payments({client,store,catalog:{'course:mastery':{title:'Mastery',amount:29900,kind:'course',offerId:'mastery'}},keyId:'rzp_test_fixture',secret});
  return {payments,store,client,count:()=>creates};
}
const body={items:['course:mastery'],currency:'INR',amount:29900};
const verify={razorpay_order_id:'order_fixture',razorpay_payment_id:'pay_fixture',razorpay_signature:signature()};
const key='test-checkout-key-123456';
test('server rejects price tampering, duplicates, unsupported currency and subminimum amounts',()=>{
  const {payments}=fixture();
  for(const data of [{...body,amount:1},{...body,amount:100},{...body,amount:29900.5},{...body,currency:'USD'},{items:['course:mastery','course:mastery']},{items:['course:missing']},{...body,discount:15}]) assert.throws(()=>payments.price(data),e=>e.status===400);
});
test('create order is idempotent for the browser session',async()=>{
  const f=fixture();const first=await f.payments.create(body,'a',key);const second=await f.payments.create(body,'a',key);
  assert.equal(first.order_id,second.order_id);assert.equal(first.amount,29900);assert.equal(f.count(),1);
});
test('rejects missing fields, malformed signatures and wrong signatures without marking paid',async()=>{
  const f=fixture();await f.payments.create(body,'a',key);
  for(const data of [{},{...verify,razorpay_signature:'bad'},{...verify,razorpay_signature:'0'.repeat(64)}]) await assert.rejects(()=>f.payments.verify(data,'a'),e=>e.status===400);
  assert.equal(f.store.records.order_fixture.status,'created');
});
test('another session cannot verify or read a receipt for an existing order',async()=>{
  const f=fixture();await f.payments.create(body,'a',key);await assert.rejects(()=>f.payments.verify(verify,'b'),e=>e.status===404);assert.equal(f.payments.receipt('b'),null);
});
test('matching HMAC and captured provider state produce an idempotent test receipt',async()=>{
  const f=fixture();await f.payments.create(body,'a',key);const result=await f.payments.verify(verify,'a');assert.equal(result.success,true);assert.equal(result.enrolment,'not-connected');await f.payments.verify(verify,'a');assert.equal(f.payments.receipt('a').payment_id,'pay_fixture');
});
test('signature alone does not accept wrong amount, currency or order',async()=>{
  for(const wrong of [{amount:100},{currency:'USD'},{order_id:'order_other'}]){const f=fixture(wrong);await f.payments.create(body,'a',key);await assert.rejects(()=>f.payments.verify(verify,'a'),e=>e.status===400);assert.equal(f.store.records.order_fixture.status,'created')}
});
test('authorized, failed and refunded payments do not become paid',async()=>{
  for(const state of [{status:'authorized',captured:false},{status:'failed',captured:false},{status:'captured',captured:true,amount_refunded:100}]){const f=fixture(state);await f.payments.create(body,'a',key);assert.equal((await f.payments.verify(verify,'a')).success,false);assert.equal(f.store.records.order_fixture.status,'created')}
});
test('Razorpay authentication errors return 401 and other create errors return 500',async()=>{
  for(const code of [401,500]){const f=fixture();f.client.orders.create=async()=>{throw {statusCode:code}};await assert.rejects(()=>f.payments.create(body,'a',key),e=>e.status===code);assert.equal(Object.keys(f.store.records).length,0)}
});
test('live keys are refused and signature parser rejects missing/oversized input',()=>{
  assert.throws(()=>new Payments({...fixture(),keyId:'rzp_live_fixture',secret}),/test credentials/);
  assert.equal(validSignature('order_fixture','pay_fixture',null,secret),false);assert.equal(validSignature('order_fixture','pay_fixture','a'.repeat(10000),secret),false);
});
test('private JSON ledger survives restart and failed mutation is not committed',async()=>{
  const dir=await mkdtemp(path.join(path.dirname(fileURLToPath(import.meta.url)),'.ledger-'));try{const file=path.join(dir,'orders.json');const store=new PaymentStore(file);await store.load();await store.update(records=>records.one={status:'created'});const restored=new PaymentStore(file);await restored.load();assert.equal(restored.records.one.status,'created');await assert.rejects(()=>restored.update(records=>{records.one.status='paid';throw Error('abort')}));assert.equal(JSON.parse(await readFile(file,'utf8')).one.status,'created')}finally{await rm(dir,{recursive:true,force:true})}
});
test('HTTP API blocks cross-origin POST, private files and malformed requests',async()=>{
  const {payments}=fixture();const server=createMuxionServer({payments});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
  try{
    const config=await fetch(origin+'/api/payment-config');const cookie=config.headers.get('set-cookie').split(';')[0];assert.equal((await config.json()).mode,'test');
    const options={method:'POST',headers:{origin,'Content-Type':'application/json',cookie,'Idempotency-Key':key},body:JSON.stringify(body)};
    assert.equal((await fetch(origin+'/api/create-order',{...options,headers:{...options.headers,origin:'https://attacker.example'}})).status,403);
    assert.equal((await fetch(origin+'/api/create-order',{...options,body:'{bad'})).status,400);
    assert.equal((await fetch(origin+'/api/create-order',options)).status,200);
    assert.equal((await fetch(origin+'/api/verify-payment',{...options,body:JSON.stringify({...verify,razorpay_signature:'bad'})})).status,400);
    for(const file of ['/.env','/../muxion-backend/.env','/server.mjs','/Start-MUXION.cmd','/.git/config']) assert.equal((await fetch(origin+file)).status,404);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve))}
});
