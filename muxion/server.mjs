import {createMuxionServer, createPayments} from '../muxion-backend/server.mjs';
const payments = await createPayments();
createMuxionServer({payments}).listen(4173, '127.0.0.1', () => {
  console.log('MUXION: http://localhost:4173');
  console.log(payments ? 'Razorpay TEST checkout enabled. Firebase enrolment is not connected yet.' : 'Checkout disabled: configure private backend test credentials.');
});
