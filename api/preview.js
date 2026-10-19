// The local payment ledger cannot persist safely across Vercel function instances.
// Keep payments unavailable until the Firebase-backed order store is connected.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const pathname = new URL(req.url, 'https://preview.invalid').pathname;
  if (req.method === 'GET' && pathname === '/api/payment-config') {
    return res.status(200).json({enabled: false, mode: 'test', key_id: null, enrolment: 'not-connected'});
  }
  if (req.method === 'GET' && pathname === '/api/payment-receipt') {
    return res.status(200).json({receipt: null});
  }
  return res.status(503).json({error: 'Payments are unavailable on this preview while the persistent backend is being connected.'});
}
