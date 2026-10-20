import {PaymentError} from './payments.mjs';
export const webhookEvents=['payment.captured','order.paid','refund.processed','payment.failed'];
export async function configurePaymentWebhook({actor,client,platform,secret,url}){
  if(actor?.role!=='super')throw new PaymentError(403,'Only the owner can configure payment notifications.');
  if(!secret||secret.length<32||url!=='https://project-4jpr6.vercel.app/api/razorpay-webhook')throw new PaymentError(503,'The server webhook configuration is missing.');
  let list;try{list=await client.webhooks.all({count:100});}catch(error){let reason=String(error?.error?.description||error?.message||'Provider request failed');for(const value of [secret,process.env.RAZORPAY_KEY_SECRET,process.env.RAZORPAY_KEY_ID].filter(Boolean))reason=reason.split(value).join('[redacted]');console.error('webhook_setup_failed',{status:error?.statusCode,code:error?.error?.code,reason:reason.slice(0,240)});throw new PaymentError(502,'Razorpay webhook setup failed. Dashboard configuration may be required.');}const existing=list.items?.find(w=>w.url===url);
  const payload={url,secret,events:webhookEvents,active:true};
  let webhook;try{webhook=existing?await client.webhooks.edit(payload,existing.id):await client.webhooks.create(payload);}catch(error){let reason=String(error?.error?.description||error?.message||'Provider request failed');for(const value of [secret,process.env.RAZORPAY_KEY_SECRET,process.env.RAZORPAY_KEY_ID].filter(Boolean))reason=reason.split(value).join('[redacted]');console.error('webhook_write_failed',{status:error?.statusCode,code:error?.error?.code,reason:reason.slice(0,240)});throw new PaymentError(502,'Razorpay did not accept the webhook settings.');}
  if(!webhook.id||webhook.url!==url||webhook.active!==true||webhookEvents.some(e=>!webhook.events?.includes(e)))throw new PaymentError(502,'Razorpay did not confirm the webhook configuration.');
  const result={id:webhook.id,url:webhook.url,active:webhook.active,events:webhook.events,configuredAt:new Date().toISOString()};
  await platform.db.collection('paymentSetup').doc('razorpay').set(result);
  return result;
}
