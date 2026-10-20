import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {configuredHostedPayments} from '../muxion-backend/hosted-payments.mjs';
import {configuredPlatform} from '../muxion-backend/platform.mjs';

export function validWebhook(raw,signature,secret){if(!secret||typeof signature!=='string'||!/^[a-f0-9]{64}$/i.test(signature))return false;return timingSafeEqual(createHmac('sha256',secret).update(raw).digest(),Buffer.from(signature,'hex'));}
export async function processWebhook(raw,headers,payments,secret){
  if(!validWebhook(raw,headers['x-razorpay-signature'],secret))return {status:400,body:{error:'Invalid webhook signature.'}};
  let event;try{event=JSON.parse(raw.toString('utf8'));}catch{return {status:400,body:{error:'Invalid webhook body.'}};}
  const id=headers['x-razorpay-event-id'];if(typeof id!=='string'||!id||id.length>200)return {status:400,body:{error:'Missing event ID.'}};
  if(!['payment.captured','order.paid','refund.processed','payment.failed'].includes(event.event))return {status:200,body:{ignored:true}};
  if(!payments?.platform)return {status:503,body:{error:'Payment database unavailable.'}};
  let orderId=event.payload?.payment?.entity?.order_id||event.payload?.order?.entity?.id;
  if(!orderId&&event.payload?.refund?.entity?.payment_id){const payment=await payments.request(()=>payments.client.payments.fetch(event.payload.refund.entity.payment_id));orderId=payment.order_id;}
  if(!/^order_[a-zA-Z0-9]{1,50}$/.test(orderId||''))return {status:400,body:{error:'Invalid order reference.'}};
  // Use the provider's current state. Delayed events cannot regrant a refund.
  await payments.reconcile(orderId,{id:createHash('sha256').update(raw).digest('hex'),type:event.event});
  return {status:200,body:{received:true}};
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  try{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>262144)return res.status(413).json({error:'Payload too large.'});chunks.push(chunk);}const platform=await configuredPlatform();const result=await processWebhook(Buffer.concat(chunks),req.headers,configuredHostedPayments(platform),process.env.RAZORPAY_WEBHOOK_SECRET);return res.status(result.status).json(result.body);}catch{return res.status(503).json({error:'Webhook processing is temporarily unavailable. Retry this event.'});}
}
export const config={api:{bodyParser:false},maxDuration:30};
