import {authorizationHeaders,currentUser} from './account.js';
let checkoutScript;
const pendingRequests = new Map();
async function api(path, options = {}) {
  const response = await fetch(path, {credentials: 'same-origin', signal: AbortSignal.timeout(20000), ...options, headers:{...await authorizationHeaders(),...options.headers}});
  const result = await response.json().catch(() => ({error: 'The server returned an unexpected response.'}));
  if (!response.ok) throw new Error(result.error || result.message || 'Payment request failed.');
  return result;
}
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript) checkoutScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => { script.remove(); checkoutScript = null; reject(new Error('Razorpay took too long to load. Check your connection and try again.')); }, 15000);
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { clearTimeout(timeout); if (window.Razorpay) resolve(); else { checkoutScript = null; reject(new Error('Razorpay Checkout did not load.')); } };
    script.onerror = () => { clearTimeout(timeout); script.remove(); checkoutScript = null; reject(new Error('Could not load Razorpay. Check your internet connection and try again.')); };
    document.head.append(script);
  });
  return checkoutScript;
}
export async function paymentConfiguration() { return api('/api/payment-config'); }
export async function latestPaymentReceipt() {
  const result = await api('/api/payment-receipt');
  return result.receipt;
}
export async function startRazorpayCheckout({items, amount}) {
  if(!currentUser)throw new Error('Sign in before purchasing.');
  const config = await api('/api/payment-config');
  if (!config.enabled) throw new Error('Payments are not configured on the backend yet.');
  await loadCheckout();
  const request = JSON.stringify(items);
  if (!pendingRequests.has(request)) pendingRequests.set(request, crypto.randomUUID());
  const order = await api('/api/create-order', {method: 'POST', headers: {'Content-Type': 'application/json', 'Idempotency-Key': pendingRequests.get(request)}, body: JSON.stringify({items, amount, currency: 'INR'})});
  if (order.status === 'paid') { pendingRequests.delete(request); throw new Error('This order is already paid. Refresh to start a new checkout.'); }
  return new Promise((resolve, reject) => {
    let settled = false, verifying = false;
    const finish = (callback, value) => { if (!settled) { settled = true; callback(value); } };
    const instance = new window.Razorpay({
      key: order.key_id, order_id: order.order_id, amount: order.amount, currency: order.currency,
      name: 'MUXION Academy', description: (order.mode === 'test' ? 'Test checkout · ' : '') + order.items.map(i => i.title).join(', '),
      theme: {color: '#255aa9'},
      handler: async payment => {
        verifying = true;
        try {
          const result = await api('/api/verify-payment', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payment)});
          if (result.success) pendingRequests.delete(request);
          finish(resolve, result);
        } catch (error) { finish(reject, new Error(`${error.message} No course access was granted. Keep your Razorpay payment ID for support.`)); }
      },
      modal: {ondismiss: () => { if (!verifying) finish(resolve, {cancelled: true}); }}
    });
    instance.on('payment.failed', failure => {
      finish(reject, new Error(failure.error?.description || 'Payment failed. You can try again.'));
      instance.close();
    });
    instance.open();
  });
}
