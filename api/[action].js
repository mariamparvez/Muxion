import {Learning} from '../muxion-backend/learning.mjs';
import {configuredHostedPayments} from '../muxion-backend/hosted-payments.mjs';
import {PaymentError} from '../muxion-backend/payments.mjs';
import {configuredPlatform,publicOffer,seedOffers} from '../muxion-backend/platform.mjs';
import {configurePaymentWebhook} from '../muxion-backend/payment-setup.mjs';
import {secureHeaders,jsonBody,BurstLimiter,accountRateLimit} from '../muxion-backend/security.mjs';

const cookieName='muxion_payment';
export function createHandler(payments,platform=null) {
  const learning=platform?new Learning(platform):null;
  const bursts=new BurstLimiter();
  return async function handler(req,res) {
    secureHeaders(res);
    try {
      const action=req.query?.action||new URL(req.url,'https://muxion.invalid').pathname.split('/').pop();
      if(typeof action!=='string'||!/^[a-z-]{1,40}$/.test(action))throw new PaymentError(400,'Invalid API route.');
      if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');throw new PaymentError(405,'Method not allowed.');}
      const ip=String(req.headers['x-vercel-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
      bursts.check(ip);
      const allowed=new Set(['https://muxion.in','https://www.muxion.in','https://muxion-git-preview-mariamparvezs-projects.vercel.app','https://project-4jpr6.vercel.app',...(process.env.PAYMENT_ALLOWED_ORIGINS||'').split(',').filter(Boolean)]);
      if(process.env.VERCEL_URL)allowed.add('https://'+process.env.VERCEL_URL);
      if(process.env.VERCEL_PROJECT_PRODUCTION_URL)allowed.add('https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL);
      if(req.method==='POST'&&!allowed.has(req.headers.origin))throw new PaymentError(403,'A same-origin checkout request is required.');
      if(req.headers.origin&&!allowed.has(req.headers.origin))throw new PaymentError(403,'A same-origin request is required.');
      if(action==='catalogue'&&req.method==='GET'){const offers=platform?await platform.catalog():seedOffers();return res.status(200).json({offers:offers.filter(o=>o.status==='Published').map(publicOffer)});}
      if(action==='mentorship-offers'&&req.method==='GET')return res.status(200).json({offers:learning?await learning.offers():[]});
      if(action==='certificate-verify'&&req.method==='GET'){if(!learning)throw new PaymentError(503,'Verification is temporarily unavailable.');return res.status(200).json({certificate:await learning.certificate(req.query?.id||'')});}
      if(action==='payment-config'&&req.method==='GET'){
        if(!payments)return res.status(200).json({enabled:false,paymentsConfigured:false,enrolmentReady:!!platform,mode:'unavailable',enrolment:platform?'connected':'not-connected',requiresSignIn:true,reason:'razorpay_not_configured'});
        const raw=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);let s=payments.untoken(raw);if(!s||!/^[a-f0-9]{64}$/.test(s.sid||''))s={sid:payments.newSession()};
        res.setHeader('Set-Cookie',`${cookieName}=${payments.token(s)}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
        return res.status(200).json({enabled:!!platform,paymentsConfigured:true,enrolmentReady:!!platform,mode:payments.mode,key_id:payments.keyId,enrolment:platform?'connected':'not-connected',requiresSignIn:true,reason:platform?null:'database_not_configured'});
      }
      if(!payments)throw new PaymentError(503,'Payment credentials are not configured on the server.');
      if(!platform)throw new PaymentError(503,'The account database is not configured yet. No payment will be started.');
      const actor=await platform.identity(req.headers.authorization);
      if(platform.db)await accountRateLimit(platform.db,actor.uid,action,req.method);
      if(action==='account'&&req.method==='GET')return res.status(200).json({...await platform.account(actor),workspace:await learning.snapshot(actor)});
      if(action==='payment-history'&&req.method==='GET')return res.status(200).json(await platform.history(actor,req.query?.cursor||''));
      if(action==='admin-catalogue'&&req.method==='GET'){platform.admin(actor);return res.status(200).json({offers:await platform.catalog(true)});}
      if(action==='admin-orders'&&req.method==='GET')return res.status(200).json({orders:await platform.adminOrders(actor)});
      if(action==='course-content'&&req.method==='GET')return res.status(200).json({course:await platform.content(actor,req.query?.id||'')});
      if(action==='discussion'&&req.method==='GET')return res.status(200).json({comments:await learning.comments(actor,req.query?.courseId)});
      const cookies=Object.fromEntries((req.headers.cookie||'').split(';').map(v=>v.trim().split(/=(.*)/s)).filter(v=>v.length>=2));
      let session=payments.untoken(cookies[cookieName]);
      if(!session||!/^[a-f0-9]{64}$/.test(session.sid||'')) {
        if(action!=='payment-config'||req.method!=='GET')throw new PaymentError(401,'Refresh the checkout page to start a secure payment session.');
        session={sid:payments.newSession()};
      }
      const saveSession=()=>res.setHeader('Set-Cookie',`${cookieName}=${payments.token(session)}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
      if(action==='payment-receipt'&&req.method==='GET')return res.status(200).json({receipt:session.order?await payments.recover(session.order,session.sid,actor.uid):null});
      if(req.method!=='POST')throw new PaymentError(405,'Method not allowed.');
      const bodyLimit=action==='admin-offer'?220000:20000;
      const body=jsonBody(req,bodyLimit);
      if(action==='profile-save')return res.status(200).json(await learning.saveProfile(actor,body));
      if(action==='learning-progress')return res.status(200).json(await learning.progress(actor,body));
      if(action==='discussion-post')return res.status(200).json({comment:await learning.post(actor,body)});
      if(action==='discussion-remove')return res.status(200).json(await learning.removeComment(actor,body.id));
      if(action==='mentorship-save')return res.status(200).json({offer:await learning.saveOffer(actor,body)});
      if(action==='mentorship-book')return res.status(200).json({booking:await learning.book(actor,body)});
      if(action==='mentorship-update')return res.status(200).json({booking:await learning.updateBooking(actor,body)});
      if(action==='user-access')return res.status(200).json(await learning.saveUser(actor,body));
      if(action==='certificate-revoke')return res.status(200).json(await learning.revokeCertificate(actor,body.id));
      if(action==='admin-offer')return res.status(200).json({offer:await platform.saveOffer(actor,body)});
      if(action==='admin-payment-setup')return res.status(200).json({webhook:await configurePaymentWebhook({actor,client:payments.client,platform,secret:process.env.RAZORPAY_WEBHOOK_SECRET,url:'https://project-4jpr6.vercel.app/api/razorpay-webhook'})});
      if(action==='create-order') {if(!actor.emailVerified)throw new PaymentError(403,'Verify your email address before purchasing, or sign in with Google.');const order=await payments.create(body,session.sid,req.headers['idempotency-key'],actor.uid);session.order=order.order_id;saveSession();return res.status(200).json(order);}
      if(action==='verify-payment') {const result=await payments.verify(body,session.sid,actor.uid);if(result.success){session.order=result.order_id;saveSession();}return res.status(result.success?200:result.pending?202:400).json(result);}
      if(action==='quiz-verify'){
        await platform.content(actor,'course:'+body.id);const course=(await platform.catalog()).find(o=>o.kind==='course'&&o.id===body.id);return res.status(200).json({correct:Number(body.answer)===course?.quiz?.answer});
      }
      throw new PaymentError(404,'API route not found.');
    }catch(error){if(error.retryAfter)res.setHeader('Retry-After',String(error.retryAfter));if(!(error instanceof PaymentError))console.error('account_request_failed',{name:error?.name,code:error?.code});return res.status(error instanceof PaymentError?error.status:500).json({error:error instanceof PaymentError?error.message:'Checkout could not complete. Please contact hello@muxion.in.'});}
  };
}
let handler;
export default async function paymentApi(req,res){secureHeaders(res);try{if(!handler){const platform=await configuredPlatform();handler=createHandler(configuredHostedPayments(platform),platform);}return handler(req,res);}catch(error){console.error('account_service_init_failed',{name:error?.name,code:error?.code||error?.errorInfo?.code||'unknown'});return res.status(503).json({error:'Account services are temporarily unavailable. No payment has been started.'});}}
export const config={maxDuration:30};

