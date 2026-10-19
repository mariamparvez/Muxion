import {createHash, createHmac, randomUUID, timingSafeEqual} from 'node:crypto';
import {readFile, writeFile, rename, mkdir} from 'node:fs/promises';
import path from 'node:path';

export class PaymentError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const sessionHash = value => createHash('sha256').update(value).digest('hex');
export function validSignature(orderId, paymentId, signature, secret) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest();
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}

// A single-process, private JSON ledger for local test checkout, not a production database.
// No new database tables or Firebase billing are needed. Replace with transactional
// Firestore writes when authenticated fulfilment is connected.
export class PaymentStore {
  constructor(file) { this.file = file; this.records = {}; this.tail = Promise.resolve(); }
  async load() {
    try { this.records = JSON.parse(await readFile(this.file, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  async update(fn) {
    const task = this.tail.then(async () => {
      const records = structuredClone(this.records);
      const result = await fn(records);
      await mkdir(path.dirname(this.file), {recursive: true});
      const temporary = this.file + '.tmp';
      await writeFile(temporary, JSON.stringify(records), {mode: 0o600});
      await rename(temporary, this.file);
      this.records = records;
      return result;
    });
    this.tail = task.catch(() => {});
    return task;
  }
}

export class Payments {
  constructor({client, store, catalog, keyId, secret}) {
    this.client = client; this.store = store; this.catalog = catalog;
    this.keyId = keyId; this.secret = secret;
    if (!/^rzp_test_/.test(keyId) || !secret) throw new Error('Razorpay test credentials are required. Live checkout is not enabled.');
  }
  price(body) {
    if (body.currency && body.currency !== 'INR') throw new PaymentError(400, 'Only INR is enabled for this test integration.');
    if (!Array.isArray(body.items) || !body.items.length || body.items.length > 20 || new Set(body.items).size !== body.items.length) throw new PaymentError(400, 'Choose between 1 and 20 different catalogue items.');
    const items = body.items.map(id => {
      if (typeof id !== 'string' || !Object.hasOwn(this.catalog, id)) throw new PaymentError(400, 'A selected item is not available in the server catalogue.');
      return {id, ...this.catalog[id]};
    });
    if (items.some(i => !Number.isSafeInteger(i.amount) || i.amount < 100)) throw new PaymentError(400, 'The minimum payment is 100 paise.');
    const amount = items.reduce((sum, i) => sum + i.amount, 0);
    if (!Number.isSafeInteger(amount) || amount < 100 || amount > 100000000) throw new PaymentError(400, 'Invalid payment amount.');
    if (body.amount !== undefined && (!Number.isSafeInteger(body.amount) || body.amount < 100 || body.amount !== amount)) throw new PaymentError(400, 'The amount must match the server catalogue and be at least 100 paise.');
    if (body.discount) throw new PaymentError(400, 'Reward discounts require server-verified points and are not enabled yet.');
    return {items, amount, currency: 'INR'};
  }
  publicOrder(order) {
    return {order_id: order.id, amount: order.amount, currency: order.currency, key_id: this.keyId, mode: 'test', status: order.status, items: order.items};
  }
  async create(body, session, idempotencyKey) {
    const priced = this.price(body);
    if (typeof idempotencyKey !== 'string' || !/^[a-zA-Z0-9_-]{16,80}$/.test(idempotencyKey)) throw new PaymentError(400, 'A valid Idempotency-Key is required.');
    return this.store.update(async records => {
      const duplicate = Object.values(records).find(r => r.session === session && r.idempotencyKey === idempotencyKey);
      if (duplicate) {
        if (JSON.stringify(duplicate.items) !== JSON.stringify(priced.items)) throw new PaymentError(409, 'This checkout request belongs to different items.');
        return this.publicOrder(duplicate);
      }
      if (Object.keys(records).length >= 5000) throw new PaymentError(503, 'The local payment ledger is full. Contact MUXION.');
      const receipt = 'mux_' + randomUUID().replaceAll('-', '').slice(0, 28);
      let result;
      try { result = await this.client.orders.create({amount: priced.amount, currency: 'INR', receipt, notes: {integration: 'muxion_test'}}); }
      catch (error) { throw new PaymentError(error.statusCode === 401 ? 401 : 500, error.statusCode === 401 ? 'Razorpay authentication failed. Check the backend test credentials.' : 'Razorpay could not create the order. Please try again.'); }
      if (!/^order_[a-zA-Z0-9]+$/.test(result.id) || Number(result.amount) !== priced.amount || result.currency !== 'INR') throw new PaymentError(502, 'Razorpay returned an unexpected order.');
      const order = {id: result.id, ...priced, receipt, session, idempotencyKey, status: 'created', createdAt: new Date().toISOString()};
      records[order.id] = order;
      return this.publicOrder(order);
    });
  }
  async verify(body, session) {
    const {razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature} = body;
    if (typeof paymentId !== 'string' || !/^pay_[a-zA-Z0-9]{1,50}$/.test(paymentId) || typeof orderId !== 'string' || !/^order_[a-zA-Z0-9]{1,50}$/.test(orderId) || typeof signature !== 'string') throw new PaymentError(400, 'Payment ID, order ID and signature are required.');
    return this.store.update(async records => {
      const order = records[orderId];
      if (!order || order.session !== session) throw new PaymentError(404, 'No matching order exists for this browser session.');
      // Use the order ID persisted by the server, never an unbound client value.
      if (!validSignature(order.id, paymentId, signature, this.secret)) throw new PaymentError(400, 'Payment signature did not match. No access was granted.');
      if (order.status === 'paid' && order.paymentId !== paymentId) throw new PaymentError(409, 'This order was already verified with another payment.');
      let payment;
      try { payment = await this.client.payments.fetch(paymentId); }
      catch (error) { throw new PaymentError(error.statusCode === 401 ? 401 : 502, 'Could not confirm the payment with Razorpay. Please retry verification.'); }
      if (payment.order_id !== order.id || Number(payment.amount) !== order.amount || payment.currency !== order.currency) throw new PaymentError(400, 'The payment does not match this order, amount or currency.');
      if (payment.status !== 'captured' || payment.captured !== true || Number(payment.amount_refunded || 0) !== 0) {
        return {success: false, pending: payment.status === 'authorized', status: payment.status, order_id: order.id, message: 'Payment is not captured or was refunded. No enrolment was granted.'};
      }
      const used = Object.values(records).find(r => r.paymentId === paymentId && r.id !== order.id);
      if (used) throw new PaymentError(409, 'Payment was already used for another order.');
      order.status = 'paid'; order.paymentId = paymentId; order.verifiedAt = new Date().toISOString();
      return {success: true, mode: 'test', order_id: order.id, payment_id: paymentId, amount: order.amount, currency: order.currency, verifiedAt: order.verifiedAt, items: order.items, enrolment: 'not-connected'};
    });
  }
  receipt(session) {
    const order = Object.values(this.store.records).filter(r => r.session === session && r.status === 'paid').sort((a,b) => b.verifiedAt.localeCompare(a.verifiedAt))[0];
    return order ? {mode: 'test', order_id: order.id, payment_id: order.paymentId, amount: order.amount, currency: order.currency, verifiedAt: order.verifiedAt, items: order.items, enrolment: 'not-connected'} : null;
  }
}
