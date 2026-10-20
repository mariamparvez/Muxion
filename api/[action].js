import {configuredHostedPayments} from '../muxion-backend/hosted-payments.mjs';
import {PaymentError} from '../muxion-backend/payments.mjs';

const cookieName='muxion_payment';
export function createHandler(payments) {
  return async function handler(req,res) {
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
    try {
      const action=req.query?.action||new URL(req.url,'https://muxion.invalid').pathname.split('/').pop();
      if(!payments)throw new PaymentError(503,'Payment credentials are not configured on the server.');
      const allowed=new Set(['https://muxion-git-preview-mariamparvezs-projects.vercel.app','https://project-4jpr6.vercel.app',...(process.env.PAYMENT_ALLOWED_ORIGINS||'').split(',').filter(Boolean)]);
      if(process.env.VERCEL_URL)allowed.add('https://'+process.env.VERCEL_URL);
      if(process.env.VERCEL_PROJECT_PRODUCTION_URL)allowed.add('https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL);
      if(req.method==='POST'&&!allowed.has(req.headers.origin))throw new PaymentError(403,'A same-origin checkout request is required.');
      const cookies=Object.fromEntries((req.headers.cookie||'').split(';').map(v=>v.trim().split(/=(.*)/s)).filter(v=>v.length>=2));
      let session=payments.untoken(cookies[cookieName]);
      if(!session||!/^[a-f0-9]{64}$/.test(session.sid||'')) {
        if(action!=='payment-config'||req.method!=='GET')throw new PaymentError(401,'Refresh the checkout page to start a secure payment session.');
        session={sid:payments.newSession()};
      }
      const saveSession=()=>res.setHeader('Set-Cookie',`${cookieName}=${payments.token(session)}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
      if(action==='payment-config'&&req.method==='GET'){saveSession();return res.status(200).json({enabled:true,mode:payments.mode,key_id:payments.keyId,enrolment:'not-connected'});}
      if(action==='payment-receipt'&&req.method==='GET')return res.status(200).json({receipt:session.order?await payments.recover(session.order,session.sid):null});
      if(req.method!=='POST')throw new PaymentError(405,'Method not allowed.');
      if(!req.headers['content-type']?.startsWith('application/json'))throw new PaymentError(415,'Send application/json.');
      if(Number(req.headers['content-length']||0)>8192||JSON.stringify(req.body||{}).length>8192)throw new PaymentError(413,'Request is too large.');
      let body=req.body;try{if(typeof body==='string')body=JSON.parse(body);}catch{throw new PaymentError(400,'Invalid JSON.');}
      if(!body||Array.isArray(body)||typeof body!=='object')throw new PaymentError(400,'A JSON object is required.');
      if(action==='create-order') {const order=await payments.create(body,session.sid,req.headers['idempotency-key']);session.order=order.order_id;saveSession();return res.status(200).json(order);}
      if(action==='verify-payment') {const result=await payments.verify(body,session.sid);if(result.success){session.order=result.order_id;saveSession();}return res.status(result.success?200:result.pending?202:400).json(result);}
      throw new PaymentError(404,'API route not found.');
    }catch(error){return res.status(error instanceof PaymentError?error.status:500).json({error:error instanceof PaymentError?error.message:'Checkout could not complete. Please contact hello@muxion.in.'});}
  };
}
export default createHandler(configuredHostedPayments());
export const config={maxDuration:30};
