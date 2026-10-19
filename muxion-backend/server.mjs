import http from 'node:http';
import {randomBytes} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import {Payments, PaymentStore, PaymentError, sessionHash} from './payments.mjs';
import {seed} from '../muxion/data.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.resolve(here, '../muxion');
const contentTypes = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.pdf':'application/pdf'};

export async function createPayments() {
  dotenv.config({path: process.env.MUXION_ENV_FILE || path.resolve(here, '../work/private/payments/.env'), quiet: true});
  const keyId = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return null;
  const client = new Razorpay({key_id: keyId, key_secret: secret});
  const catalog = {};
  for (const [kind, offers] of [['course', seed.courses], ['workshop', seed.workshops]]) {
    for (const offer of offers.filter(o => o.status === 'Published')) catalog[`${kind}:${offer.id}`] = {title: offer.title, amount: Math.round(Number(offer.price) * 100), kind, offerId: offer.id};
  }
  const store = new PaymentStore(path.resolve(here, '../work/private/payments/orders.json'));
  await store.load();
  return new Payments({client, store, catalog, keyId, secret});
}

function json(res, status, data) {
  res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
  res.end(JSON.stringify(data));
}
async function readBody(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new PaymentError(415, 'Send application/json.');
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > 16384) throw new PaymentError(413, 'Request body is too large.');
  }
  let parsed;
  try { parsed = JSON.parse(body); } catch { throw new PaymentError(400, 'Invalid JSON.'); }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new PaymentError(400, 'A JSON object is required.');
  return parsed;
}

export function createMuxionServer({payments = null} = {}) {
  const limits = new Map();
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    try {
      const host = req.headers.host || '';
      const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
      const configured = process.env.PUBLIC_ORIGIN ? new URL(process.env.PUBLIC_ORIGIN) : null;
      if (!local && (!configured || configured.host !== host)) throw new PaymentError(400, 'Invalid host.');
      const origin = local ? `http://${host}` : configured.origin;
      const url = new URL(req.url, origin);
      if (url.pathname.startsWith('/api/')) {
        if (req.method === 'POST' && req.headers.origin !== origin) throw new PaymentError(403, 'A same-origin request is required.');
        let session = (req.headers.cookie || '').split(';').map(p => p.trim()).find(p => p.startsWith('muxion_checkout='))?.slice(16);
        if (!/^[a-f0-9]{64}$/.test(session || '')) {
          session = randomBytes(32).toString('hex');
          res.setHeader('Set-Cookie', `muxion_checkout=${session}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=604800${origin.startsWith('https:') ? '; Secure' : ''}`);
        }
        const owner = sessionHash(session);
        // Bound memory and use the actual socket IP, not a client-supplied proxy header.
        const now = Date.now();
        for (const [key, value] of limits) if (now - value.start > 60000) limits.delete(key);
        const key = `${req.socket.remoteAddress}:${url.pathname}`;
        const rate = limits.get(key) || {start: now, count: 0};
        rate.count++; limits.set(key, rate);
        if (rate.count > (url.pathname === '/api/create-order' ? 12 : 90)) throw new PaymentError(429, 'Too many requests. Please wait a minute.');
        if (url.pathname === '/api/payment-config' && req.method === 'GET') return json(res, 200, {enabled: !!payments, mode: 'test', key_id: payments?.keyId || null, enrolment: 'not-connected'});
        if (!payments) throw new PaymentError(503, 'Payment test credentials are not configured on the backend.');
        if (url.pathname === '/api/create-order' && req.method === 'POST') {
          const result = await payments.create(await readBody(req), owner, req.headers['idempotency-key']);
          return json(res, 200, result);
        }
        if (url.pathname === '/api/verify-payment' && req.method === 'POST') {
          const result = await payments.verify(await readBody(req), owner);
          return json(res, result.success ? 200 : result.pending ? 202 : 400, result);
        }
        if (url.pathname === '/api/payment-receipt' && req.method === 'GET') return json(res, 200, {receipt: payments.receipt(owner)});
        return json(res, 405, {error: 'This API route or method is not supported.'});
      }
      if (!['GET', 'HEAD'].includes(req.method)) throw new PaymentError(405, 'Method not allowed.');
      const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      if (name.includes('\\') || name.split('/').some(part => part.startsWith('.'))) throw new PaymentError(404, 'Not found.');
      const file = path.resolve(publicRoot, '.' + name);
      const type = contentTypes[path.extname(file)];
      if (!type || !file.startsWith(publicRoot + path.sep)) throw new PaymentError(404, 'Not found.');
      const resolved = await fs.realpath(file);
      if (!resolved.startsWith(publicRoot + path.sep)) throw new PaymentError(404, 'Not found.');
      const data = await fs.readFile(resolved);
      res.writeHead(200, {'Content-Type': type, 'Cache-Control': 'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      const status = error.status || (error.code === 'ENOENT' ? 404 : 500);
      json(res, status, {error: error.status ? error.message : status === 404 ? 'Not found.' : 'The request could not be completed. Please try again.'});
    }
  });
}
