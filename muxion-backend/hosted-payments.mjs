import {createHash, createHmac, randomBytes, timingSafeEqual} from 'node:crypto';
import {seed} from '../muxion/data.js';
import {PaymentError, validSignature} from './payments.mjs';
import Razorpay from 'razorpay';

export function configuredHostedPayments(platform=null) {
  const keyId=process.env.RAZORPAY_KEY_ID,secret=process.env.RAZORPAY_KEY_SECRET;
  return keyId&&secret?new HostedPayments({client:new Razorpay({key_id:keyId,key_secret:secret}),keyId,secret,platform}):null;
}

const hash = value => createHash('sha256').update(value).digest('hex');
const catalog = Object.fromEntries([['course',seed.courses],['workshop',seed.workshops]].flatMap(([kind, offers]) => offers.filter(o=>o.status==='Published').map(o=>[`${kind}:${o.id}`,{id:`${kind}:${o.id}`,kind,offerId:o.id,title:o.title,amount:Math.round(Number(o.price)*100)}])));
export class HostedPayments {
  constructor({client,keyId,secret,platform=null}) {
    if (!/^rzp_(test|live)_[a-zA-Z0-9]+$/.test(keyId||'') || !secret) throw new Error('Payment credentials are not configured.');
    this.client=client;this.keyId=keyId;this.secret=secret;this.mode=keyId.startsWith('rzp_live_')?'live':'test';this.platform=platform;this.catalog=catalog;
  }
  sign(value) { return createHmac('sha256',this.secret).update('muxion-checkout-v1|'+value).digest('base64url'); }
  token(value) { const data=Buffer.from(JSON.stringify({...value,exp:Date.now()+30*86400000})).toString('base64url');return data+'.'+this.sign(data); }
  untoken(value) {
    if(typeof value!=='string'||value.length>2048)return null;
    const [data,sig,...extra]=value.split('.');if(extra.length||!data||!sig)return null;
    const expected=Buffer.from(this.sign(data));const supplied=Buffer.from(sig);
    if(expected.length!==supplied.length||!timingSafeEqual(expected,supplied))return null;
    try {const parsed=JSON.parse(Buffer.from(data,'base64url').toString());return parsed.exp>Date.now()?parsed:null;}catch{return null;}
  }
  newSession() { return randomBytes(32).toString('hex'); }
  price(body) {
    if(!Array.isArray(body.items)||!body.items.length||body.items.length>5||new Set(body.items).size!==body.items.length)throw new PaymentError(400,'Choose between one and five different courses or workshops.');
    if(body.currency&&body.currency!=='INR')throw new PaymentError(400,'Only INR is supported.');
    if(body.discount)throw new PaymentError(400,'Reward discounts are not available yet.');
    const items=body.items.map(id=>{if(typeof id!=='string'||!Object.hasOwn(this.catalog,id))throw new PaymentError(400,'This course or workshop is unavailable.');return this.catalog[id];});
    const amount=items.reduce((sum,i)=>sum+i.amount,0);
    if(items.some(i=>!Number.isSafeInteger(i.amount)||i.amount<100)||!Number.isSafeInteger(amount)||amount>100000000||body.amount!==amount)throw new PaymentError(400,'The price has changed or is invalid. Refresh the course page before paying.');
    const snapshot=JSON.stringify(items.map(i=>[i.id,i.amount]));
    if(snapshot.length>256)throw new PaymentError(400,'Please check out with fewer items.');
    return {items,amount,snapshot};
  }
  async request(fn) {
    try{return await fn();}catch(error){if(error instanceof PaymentError)throw error;throw new PaymentError(error.statusCode===401?401:502,error.statusCode===401?'Payment provider authentication failed. Please contact MUXION.':'The payment provider could not respond. Please try again.');}
  }
  async create(body,sid,key,uid='') {
    if(this.platform){const offers=await this.platform.catalog(true);this.catalog=Object.fromEntries(offers.filter(o=>o.status==='Published').map(o=>[o.kind+':'+o.id,{id:o.kind+':'+o.id,kind:o.kind,offerId:o.id,title:o.title,amount:Math.round(o.price*100)}]));}
    const priced=this.price(body);
    if(typeof key!=='string'||!/^[a-zA-Z0-9_-]{16,80}$/.test(key))throw new PaymentError(400,'A valid Idempotency-Key is required.');
    const receipt='mux_'+hash(`${uid||sid}|${key}`).slice(0,32);
    const existing=await this.request(()=>this.client.orders.all({receipt,count:10}));
    let order=existing.items?.find(o=>o.receipt===receipt);
    if(order){this.bound(order,sid,uid);if(order.notes.items!==priced.snapshot)throw new PaymentError(409,'This checkout request belongs to different items.');}
    else {
      const notes={integration:'muxion_v1',owner:hash(sid),items:priced.snapshot};
      if(uid){notes.uid=uid;notes.integration='muxion_v2';}
      notes.proof=this.sign(`${notes.owner}|${notes.items}|${priced.amount}|INR${uid?'|'+uid:''}`);
      try {order=await this.request(()=>this.client.orders.create({amount:priced.amount,currency:'INR',receipt,notes,partial_payment:false}));}
      catch(error){
        // A retry or concurrent request can race after the receipt lookup.
        const retried=await this.request(()=>this.client.orders.all({receipt,count:10}));
        order=retried.items?.find(o=>o.receipt===receipt);if(!order)throw error;
      }
    }
    const items=this.bound(order,sid,uid);
    if(!/^order_[a-zA-Z0-9]+$/.test(order.id)||order.amount!==priced.amount)throw new PaymentError(502,'The payment provider returned an unexpected order.');
    const result={order_id:order.id,amount:order.amount,currency:order.currency,status:order.status,key_id:this.keyId,mode:this.mode,items};
    if(this.platform&&uid)await this.platform.recordOrder(uid,result);
    return result;
  }
  bound(order,sid,uid='') {
    const n=order.notes||{};
    const accountBound=n.integration==='muxion_v2';
    if(accountBound?(!uid||n.uid!==uid):(n.integration!=='muxion_v1'||n.owner!==hash(sid)))throw new PaymentError(404,'This order does not belong to this account or checkout session.');
    if(n.proof!==this.sign(`${n.owner}|${n.items}|${order.amount}|${order.currency}${accountBound?'|'+n.uid:''}`))throw new PaymentError(400,'The stored order details could not be verified.');
    let snapshot;try{snapshot=JSON.parse(n.items);}catch{throw new PaymentError(400,'Invalid order details.');}
    if(!Array.isArray(snapshot)||!snapshot.length||snapshot.length>5||order.currency!=='INR'||snapshot.some(i=>!Array.isArray(i)||!/^(course|workshop):[a-zA-Z0-9_-]{1,80}$/.test(i[0])||!Number.isSafeInteger(i[1])||i[1]<100)||snapshot.reduce((s,i)=>s+i[1],0)!==order.amount)throw new PaymentError(400,'Order pricing could not be verified.');
    return snapshot.map(([id,amount])=>({...this.catalog[id],id,kind:id.split(':')[0],offerId:id.split(':')[1],title:this.catalog[id]?.title||id,amount}));
  }
  async captured(order,payment,sid,uid='',event=null) {
    let items=this.bound(order,sid,uid);
    if(payment.order_id!==order.id||payment.amount!==order.amount||payment.currency!==order.currency)throw new PaymentError(400,'Payment does not match this order.');
    const refunded=Number(payment.amount_refunded||0)>0;
    const success=payment.status==='captured'&&payment.captured===true&&!refunded;
    let result={success,pending:payment.status==='authorized',status:refunded?'refunded':payment.status,mode:this.mode,order_id:order.id,payment_id:payment.id,amount:order.amount,currency:order.currency,items,verifiedAt:new Date().toISOString(),enrolment:'not-connected'};
    if(this.platform&&uid&&(success||refunded)){const stored=await this.platform.storedOrder(uid,order.id);items=stored.items;result={...result,items,...await this.platform.settle(uid,result,event)};}
    if(!success)result.message='Payment is not captured or has been refunded. Keep the payment ID and contact hello@muxion.in if money was debited.';
    return result;
  }
  async verify(body,sid,uid='') {
    const {razorpay_order_id:orderId,razorpay_payment_id:paymentId,razorpay_signature:signature}=body;
    if(!/^order_[a-zA-Z0-9]{1,50}$/.test(orderId||'')||!/^pay_[a-zA-Z0-9]{1,50}$/.test(paymentId||'')||!validSignature(orderId,paymentId,signature,this.secret))throw new PaymentError(400,'Payment signature did not match.');
    const order=await this.request(()=>this.client.orders.fetch(orderId));this.bound(order,sid,uid);
    const payment=await this.request(()=>this.client.payments.fetch(paymentId));
    return this.captured(order,payment,sid,uid);
  }
  async recover(orderId,sid,uid='') {
    if(!/^order_[a-zA-Z0-9]{1,50}$/.test(orderId||''))return null;
    const order=await this.request(()=>this.client.orders.fetch(orderId));this.bound(order,sid,uid);
    const payments=await this.request(()=>this.client.orders.fetchPayments(orderId));
    const payment=payments.items?.find(p=>p.status==='captured'&&p.captured===true&&Number(p.amount_refunded||0)===0);
    return payment?this.captured(order,payment,sid,uid):null;
  }
  async reconcile(orderId,event){
    const order=await this.request(()=>this.client.orders.fetch(orderId));const uid=order.notes?.uid;if(!uid||!this.platform)return {ignored:true};
    const items=this.bound(order,'',uid);await this.platform.recordOrder(uid,{order_id:order.id,amount:order.amount,currency:order.currency,items,mode:this.mode});
    const collection=await this.request(()=>this.client.orders.fetchPayments(orderId));
    const payment=collection.items?.find(p=>p.status==='captured'&&p.captured===true&&Number(p.amount_refunded||0)===0)||collection.items?.find(p=>Number(p.amount_refunded||0)>0);
    return payment?this.captured(order,payment,'',uid,event):{pending:true};
  }
}
