import {createHash,randomUUID} from 'node:crypto';
import {seed} from '../muxion/data.js';
import {PaymentError} from './payments.mjs';
import {httpsURL} from './security.mjs';
import {validateQuiz,learnerQuiz} from './quiz.mjs';
import {buildVisible} from '../muxion/build-visibility.js';

const ownerEmail='designwithmariam@gmail.com';
const idPattern=/^[a-zA-Z0-9_-]{1,80}$/;
export const seedOffers=()=>[['course',seed.courses],['workshop',seed.workshops]].flatMap(([kind,offers])=>offers.map(offer=>({kind,...structuredClone(offer)})));
export function publicOffer(offer){const o=structuredClone(offer);delete o.quiz;delete o.meet;delete o.whatsapp;delete o.payment;o.lessons=(o.lessons||[]).map(({id,section,title,type,minutes})=>({id,section,title,type,minutes}));return o;}
export function validateOffer(raw){
  if(!raw||!['course','workshop'].includes(raw.kind)||!idPattern.test(raw.id||''))throw new PaymentError(400,'Invalid course or workshop ID.');
  const allowed=['kind','id','title','subtitle','category','type','price','original','status','level','language','tutor','description','outcomes','requirements','audience','image','lessons','quiz','topic','date','time','timezone','duration','capacity','bio','photo','meet','whatsapp','payment','pointers','recording'];
  if(Object.keys(raw).some(k=>!allowed.includes(k)))throw new PaymentError(400,'Unsupported course fields.');
  const o=structuredClone(raw);
  if(typeof o.title!=='string'||!o.title.trim()||o.title.length>180||!['Draft','Published'].includes(o.status))throw new PaymentError(400,'A title and valid visibility are required.');
  if(!Number.isSafeInteger(Number(o.price)*100)||Number(o.price)<1||Number(o.price)>1000000||!Number.isFinite(Number(o.original))||Number(o.original)<Number(o.price))throw new PaymentError(400,'Enter a price of at least ₹1 and an original price no lower than the selling price.');
  o.price=Number(o.price);o.original=Number(o.original);
  if(JSON.stringify(o).length>200000)throw new PaymentError(400,'Course content is too large. Use hosted media links.');
  for(const [k,v]of Object.entries(o))if(typeof v==='string'&&v.length>12000)throw new PaymentError(400,'A text field is too long.');
  for(const k of ['image','photo','meet','whatsapp','payment'])if(o[k]&&!httpsURL(o[k])&&!(typeof o[k]==='string'&&/^assets\/[a-zA-Z0-9_./-]+$/.test(o[k])&&!o[k].split('/').includes('..')))throw new PaymentError(400,'Use an HTTPS media link or a supplied image asset.');
  if(o.kind==='course'){
    if(!Array.isArray(o.lessons)||o.lessons.length>200||!Array.isArray(o.outcomes)||o.outcomes.some(v=>typeof v!=='string'||v.length>500))throw new PaymentError(400,'Invalid course curriculum.');
    const ids=new Set();for(const l of o.lessons){if(!idPattern.test(l.id||'')||ids.has(l.id)||typeof l.title!=='string'||!l.title||l.title.length>180||typeof l.section!=='string'||l.section.length>180||!['video','resource','quiz','assignment'].includes(l.type)||!Number.isFinite(Number(l.minutes))||Number(l.minutes)<0||Number(l.minutes)>1440)throw new PaymentError(400,'Invalid or duplicate lesson.');ids.add(l.id);if(l.body!==undefined&&(typeof l.body!=='string'||l.body.length>12000))throw new PaymentError(400,'Invalid lesson text.');if(l.url&&!httpsURL(l.url))throw new PaymentError(400,'Upload media to a host and paste its HTTPS URL. Browser-only uploads cannot be published.');for(const k of Object.keys(l))if(!['id','title','section','type','minutes','url','body','fileName'].includes(k))throw new PaymentError(400,'Unsupported lesson fields.');}
    o.quiz=validateQuiz(o.quiz);
    if(o.status==='Published'&&o.lessons.some(l=>l.type==='quiz')&&!o.quiz.questions.length)throw new PaymentError(400,'Add at least one quiz question before publishing a quiz lesson.');
    if(o.status==='Published'&&(!o.lessons.length||!o.outcomes.length))throw new PaymentError(400,'Add lessons and learning outcomes before publishing.');
  }
  if(o.kind==='workshop'){o.duration=Number(o.duration);o.capacity=Number(o.capacity);if(!Number.isInteger(o.duration)||o.duration<1||o.duration>1440||!Number.isInteger(o.capacity)||o.capacity<1||o.capacity>10000||!Array.isArray(o.pointers)||o.pointers.some(v=>typeof v!=='string'||v.length>500))throw new PaymentError(400,'Invalid workshop duration, capacity or coverage.');}
  return o;
}
export class Platform {
  constructor({db,auth,now=()=>new Date().toISOString()}){this.db=db;this.auth=auth;this.now=now;this.cache=null;}
  async identity(authorization){
    if(typeof authorization!=='string'||!authorization.startsWith('Bearer '))throw new PaymentError(401,'Sign in to continue.');
    let token;try{token=await this.auth.verifyIdToken(authorization.slice(7),true);}catch{throw new PaymentError(401,'Your session expired. Sign in again.');}
    if(!token.uid||!token.email)throw new PaymentError(401,'An email account is required.');
    const roleDoc=await this.db.collection('roles').doc(token.uid).get();const assigned=roleDoc.data();
    if(assigned?.suspended===true)throw new PaymentError(403,'This account is suspended. Contact MUXION.');
    const role=token.email_verified&&token.email.toLowerCase()===ownerEmail?'super':token.email_verified&&assigned?.role==='admin'?'admin':'learner';
    return {uid:token.uid,email:token.email,name:String(token.name||token.email.split('@')[0]).slice(0,100),emailVerified:token.email_verified===true,role};
  }
  admin(actor){if(!actor||!['super','admin'].includes(actor.role))throw new PaymentError(403,'Administrator access is required.');}
  async siteVisibility(){
    const settings=(await this.db.collection('siteSettings').doc('visibility').get()).data();
    return {buildVisible:typeof settings?.buildVisible==='boolean'?settings.buildVisible:buildVisible,revision:Number.isSafeInteger(settings?.revision)&&settings.revision>=0?settings.revision:0};
  }
  async saveSiteVisibility(actor,body){
    this.admin(actor);
    if(typeof body?.buildVisible!=='boolean'||Object.keys(body).some(key=>key!=='buildVisible'))throw new PaymentError(400,'Choose whether MUXION Build is visible.');
    const ref=this.db.collection('siteSettings').doc('visibility'),audit=this.db.collection('audit').doc();
    return this.db.runTransaction(async tx=>{
      const previous=(await tx.get(ref)).data();
      const revision=(Number.isSafeInteger(previous?.revision)&&previous.revision>=0?previous.revision:0)+1;
      const settings={buildVisible:body.buildVisible,revision};
      const at=this.now();
      tx.set(ref,{...settings,updatedBy:actor.uid,updatedAt:at});
      tx.set(audit,{actor:actor.uid,action:'site.visibility.saved',...settings,at});
      return settings;
    });
  }
  async catalog(fresh=false){
    if(!fresh&&this.cache&&this.cache.expires>Date.now())return structuredClone(this.cache.offers);
    const docs=await this.db.collection('offers').limit(200).get();const offers=new Map(seedOffers().map(o=>[o.kind+':'+o.id,o]));for(const doc of docs.docs)offers.set(doc.id,doc.data());const all=[...offers.values()];this.cache={offers:all,expires:Date.now()+15000};return structuredClone(all);
  }
  async saveOffer(actor,raw){this.admin(actor);const offer=validateOffer(raw);if(offer.kind==='course')offer.quiz.revision=randomUUID();const id=offer.kind+':'+offer.id;const ref=this.db.collection('offers').doc(id);const audit=this.db.collection('audit').doc();await this.db.runTransaction(async tx=>{const previous=await tx.get(ref);tx.set(ref,offer);tx.set(audit,{actor:actor.uid,action:'offer.saved',offerId:id,previousPrice:previous.data()?.price??null,price:offer.price,status:offer.status,at:this.now()});});this.cache=null;return offer;}
  async account(actor){
    const orders=await this.history(actor);const enrolments=await this.db.collection('enrolments').doc(actor.uid).collection('items').limit(200).get();
    const enrolled=enrolments.docs.map(d=>d.data()).filter(e=>e.active===true);const ids=new Set(enrolled.map(e=>e.id));const ownedOffers=(await this.catalog()).filter(o=>ids.has(o.kind+':'+o.id)).map(o=>o.kind==='workshop'?structuredClone(o):publicOffer(o));
    return {user:actor,orders:orders.orders,nextCursor:orders.nextCursor,enrolled,ownedOffers};
  }
  async adminOrders(actor){this.admin(actor);const page=await this.db.collection('orders').orderBy('createdAt','desc').limit(100).get();return page.docs.map(d=>d.data());}
  async history(actor,cursor=''){
    if(cursor&&!/^order_[a-zA-Z0-9]{1,50}$/.test(cursor))throw new PaymentError(400,'Invalid history cursor.');
    let q=this.db.collection('orders').where('uid','==',actor.uid).orderBy('__name__').limit(51);if(cursor)q=q.startAfter(cursor);const page=await q.get();const docs=page.docs.slice(0,50);return {orders:docs.map(d=>d.data()),nextCursor:page.docs.length>50?docs.at(-1).id:null};
  }
  async recordOrder(uid,order){
    const ref=this.db.collection('orders').doc(order.order_id);await this.db.runTransaction(async tx=>{const old=await tx.get(ref);if(old.exists){if(old.data().uid!==uid||old.data().amount!==order.amount)throw new PaymentError(409,'Order ownership or amount changed.');return;}tx.set(ref,{uid,id:order.order_id,amount:order.amount,currency:order.currency,items:order.items,status:'created',mode:order.mode,createdAt:this.now()});});
  }
  async storedOrder(uid,id){const doc=await this.db.collection('orders').doc(id).get();if(!doc.exists||doc.data().uid!==uid)throw new PaymentError(404,'Purchase not found.');return doc.data();}
  async settle(uid,result,event=null){
    const orderRef=this.db.collection('orders').doc(result.order_id),paymentRef=this.db.collection('payments').doc(result.payment_id);
    const eventRef=event?this.db.collection('paymentEvents').doc(createHash('sha256').update(event.id).digest('hex')):null;
    const target=result.success?'paid':'refunded';
    return this.db.runTransaction(async tx=>{
      const order=await tx.get(orderRef);if(!order.exists||order.data().uid!==uid||order.data().amount!==result.amount)throw new PaymentError(409,'No matching stored purchase was found.');
      const existingPayment=await tx.get(paymentRef);if(existingPayment.exists&&existingPayment.data().orderId!==result.order_id)throw new PaymentError(409,'Payment already belongs to another order.');
      const seen=eventRef?await tx.get(eventRef):null;if(seen?.exists)return {duplicate:true};
      const data=order.data();if(data.status==='refunded'&&target==='paid')throw new PaymentError(409,'A refunded order cannot be reactivated.');
      if(data.paymentId&&data.paymentId!==result.payment_id)throw new PaymentError(409,'Order already has a different captured payment.');
      const refs=data.items.map(i=>this.db.collection('enrolments').doc(uid).collection('items').doc(i.id));const access=await Promise.all(refs.map(ref=>tx.get(ref)));
      const now=this.now();
      tx.set(orderRef,{...data,status:target,paymentId:result.payment_id,verifiedAt:data.verifiedAt||now,updatedAt:now});
      tx.set(paymentRef,{uid,orderId:result.order_id,status:target,amount:result.amount,currency:result.currency,mode:result.mode,updatedAt:now});
      for(let i=0;i<refs.length;i++){const item=data.items[i],old=access[i].data()||{},grants={...(old.grants||{}),[result.order_id]:result.success===true};tx.set(refs[i],{uid,id:item.id,offerId:item.offerId,kind:item.kind,title:item.title,grants,active:Object.values(grants).some(Boolean),updatedAt:now});}
      if(eventRef)tx.set(eventRef,{id:event.id,type:event.type,orderId:result.order_id,processedAt:now});
      return {enrolment:result.success?'active':'revoked',verifiedAt:data.verifiedAt||now};
    });
  }
  async content(actor,id){
    if(!/^course:[a-zA-Z0-9_-]{1,80}$/.test(id))throw new PaymentError(400,'Invalid course.');
    if(!['super','admin'].includes(actor.role)){const access=await this.db.collection('enrolments').doc(actor.uid).collection('items').doc(id).get();if(access.data()?.active!==true)throw new PaymentError(403,'Purchase this course to open its lessons.');}
    const offer=(await this.catalog(true)).find(o=>o.kind+':'+o.id===id);if(!offer)throw new PaymentError(404,'Course unavailable.');const content=structuredClone(offer);if(actor.role==='learner')content.quiz=learnerQuiz(content.quiz);return content;
  }
}
let services;
export async function configuredPlatform(){
  if(!process.env.FIREBASE_SERVICE_ACCOUNT_JSON)return null;
  if(!services)services=(async()=>{const {initializeApp,cert,getApps}=await import('firebase-admin/app');const {getAuth}=await import('firebase-admin/auth');const {getFirestore}=await import('firebase-admin/firestore');const credentials=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);if(credentials.project_id!=='muxionuniverse')throw new Error('Wrong Firebase project.');const app=getApps().find(a=>a.name==='muxion-payments')||initializeApp({credential:cert(credentials),projectId:'muxionuniverse'},'muxion-payments');return new Platform({auth:getAuth(app),db:getFirestore(app)});})();
  return services;
}

