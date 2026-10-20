import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {HostedPayments} from '../hosted-payments.mjs';
import {createHandler} from '../../api/[action].js';
import {PaymentError} from '../payments.mjs';

const secret='hosted-test-fixture-only';
const sid='a'.repeat(64),key='hosted-checkout-key-12345';
const body={items:['course:mastery'],amount:29900,currency:'INR'};
function fixture(){
  const orders=new Map();let count=0;
  const payment={id:'pay_fixture',order_id:'order_fixture',amount:29900,currency:'INR',status:'captured',captured:true,amount_refunded:0};
  const client={orders:{all:async({receipt})=>({items:[...orders.values()].filter(o=>o.receipt===receipt)}),create:async data=>{count++;const order={...data,id:'order_fixture',status:'created'};orders.set(order.id,order);return order;},fetch:async id=>orders.get(id),fetchPayments:async()=>({items:[payment]})},payments:{fetch:async()=>payment}};
  const service=new HostedPayments({client,keyId:'rzp_live_fixture',secret});
  const verify={razorpay_order_id:'order_fixture',razorpay_payment_id:'pay_fixture',razorpay_signature:createHmac('sha256',secret).update('order_fixture|pay_fixture').digest('hex')};
  return {service,client,orders,payment,verify,count:()=>count};
}
test('signed browser sessions reject tampering, expiry and malformed cookies',()=>{
  const {service}=fixture();const token=service.token({sid});assert.equal(service.untoken(token).sid,sid);assert.equal(service.untoken(token+'x'),null);assert.equal(service.untoken('garbage'),null);
  const data=Buffer.from(JSON.stringify({sid,exp:1})).toString('base64url');assert.equal(service.untoken(data+'.'+service.sign(data)),null);
});
test('hosted checkout uses provider-persisted orders and idempotent receipts across instances',async()=>{
  const f=fixture();const first=await f.service.create(body,sid,key);const restarted=new HostedPayments({client:f.client,keyId:'rzp_live_fixture',secret});const second=await restarted.create(body,sid,key);
  assert.equal(first.order_id,second.order_id);assert.equal(first.mode,'live');assert.equal(f.count(),1);
});
test('hosted pricing rejects tampering, duplicate items, arbitrary offers and discounts',()=>{
  const {service}=fixture();for(const data of [{...body,amount:100},{...body,amount:29900.5},{...body,currency:'USD'},{...body,items:['course:nope']},{...body,items:['course:mastery','course:mastery']},{...body,discount:1}])assert.throws(()=>service.price(data),e=>e.status===400);
});
test('verification requires session ownership and matching HMAC, amount and currency',async()=>{
  const f=fixture();await f.service.create(body,sid,key);
  await assert.rejects(()=>f.service.verify({...f.verify,razorpay_signature:'0'.repeat(64)},sid),e=>e.status===400);
  await assert.rejects(()=>f.service.verify(f.verify,'b'.repeat(64)),e=>e.status===404);
  for(const [field,value]of [['amount',100],['currency','USD'],['order_id','order_other']]){const old=f.payment[field];f.payment[field]=value;await assert.rejects(()=>f.service.verify(f.verify,sid),e=>e.status===400);f.payment[field]=old;}
});
test('captured receipt can recover without a browser callback and refunds remove it',async()=>{
  const f=fixture();await f.service.create(body,sid,key);assert.equal((await f.service.verify(f.verify,sid)).success,true);assert.equal((await f.service.recover('order_fixture',sid)).payment_id,'pay_fixture');f.payment.amount_refunded=100;assert.equal(await f.service.recover('order_fixture',sid),null);
});
test('authorized or failed payments never become a paid receipt',async()=>{
  const f=fixture();await f.service.create(body,sid,key);for(const status of ['authorized','failed']){f.payment.status=status;f.payment.captured=false;assert.equal((await f.service.verify(f.verify,sid)).success,false);assert.equal(await f.service.recover('order_fixture',sid),null);}
});
test('tampering with provider order notes is rejected',async()=>{
  const f=fixture();await f.service.create(body,sid,key);f.orders.get('order_fixture').notes.items='[["course:mastery",100]]';await assert.rejects(()=>f.service.verify(f.verify,sid),e=>e.status===400);
});
test('API sets secure HttpOnly cookies and blocks cross-origin or unbound requests',async()=>{
  const f=fixture(),handler=createHandler(f.service,{identity:async authorization=>{if(authorization!=='Bearer fixture-token')throw new PaymentError(401,'Sign in.');return {uid:'learner-a',emailVerified:true,role:'learner'};}});
  async function call(action,method='GET',options={}){const req={query:{action},url:'/api/'+action,method,headers:{...options.headers},body:options.body};const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(v){this.code=v;return this;},json(v){this.body=v;return this;}};await handler(req,res);return res;}
  const config=await call('payment-config');assert.equal(config.code,200);assert.equal(config.body.mode,'live');assert.match(config.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);assert.equal(JSON.stringify(config.body).includes(secret),false);
  assert.equal((await call('create-order','POST',{headers:{origin:'https://evil.example'},body})).code,403);
  assert.equal((await call('create-order','POST',{headers:{origin:'https://muxion-git-preview-mariamparvezs-projects.vercel.app'},body})).code,401);
  const cookie=config.headers['Set-Cookie'].split(';')[0];const order=await call('create-order','POST',{headers:{origin:'https://muxion-git-preview-mariamparvezs-projects.vercel.app',authorization:'Bearer fixture-token',cookie,'content-type':'application/json','idempotency-key':key},body});assert.equal(order.code,200);assert.equal(order.body.amount,29900);
});
