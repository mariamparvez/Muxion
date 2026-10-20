import {PaymentError} from './payments.mjs';
export const webhookEvents=['payment.captured','order.paid','refund.processed','payment.failed'];
export async function configurePaymentWebhook({actor,client,platform,secret,url}){
  if(actor?.role!=='super')throw new PaymentError(403,'Only the owner can configure payment notifications.');
  if(!secret||secret.length<32||url!=='https://project-4jpr6.vercel.app/api/razorpay-webhook')throw new PaymentError(503,'The server webhook configuration is missing.');
  const list=await client.webhooks.all({count:100});const existing=list.items?.find(w=>w.url===url);
  const payload={url,secret,events:webhookEvents,active:true};
  const webhook=existing?await client.webhooks.edit(payload,existing.id):await client.webhooks.create(payload);
  if(!webhook.id||webhook.url!==url||webhook.active!==true||webhookEvents.some(e=>!webhook.events?.includes(e)))throw new PaymentError(502,'Razorpay did not confirm the webhook configuration.');
  const result={id:webhook.id,url:webhook.url,active:webhook.active,events:webhook.events,configuredAt:new Date().toISOString()};
  await platform.db.collection('paymentSetup').doc('razorpay').set(result);
  return result;
}
