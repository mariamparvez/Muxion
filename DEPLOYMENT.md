# MUXION deployment

The current MUXION frontend is in `muxion/`. The existing repository's original Figma code is preserved separately in its original paths.

Vercel builds with `npm run build` and publishes only the allowlisted frontend and assets in `public/`. The hash-based routes work without an SPA rewrite.

The preview retains demo learner/admin state in the browser. Firebase authentication, course pricing synchronization and enrolment are not connected yet.

The local Razorpay test implementation is preserved in `muxion-backend/`. Install its dependencies with `npm ci --prefix muxion-backend`, configure backend-only test credentials using `MUXION_ENV_FILE`, then run `npm start`. Never commit credentials or order receipts.

Hosted payments use Razorpay's persistent order/payment records instead of a local JSON ledger. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET as sensitive Vercel environment variables. Never expose the secret to frontend code. The hosted handler supports test and live keys; the local ledger implementation remains test-only.

Order prices come from the server catalogue. Signed HttpOnly cookies bind a checkout session to server-created order notes. Verification checks HMAC, order ownership, the persisted price snapshot, captured status and refunds. Receipt reloads recheck Razorpay, including payments completed after a browser interruption. Support can also locate payment records in the merchant dashboard.

Firebase learner identity, automatic enrolment, cross-device purchase history and admin price synchronization remain pending. The checkout explicitly discloses that course access must be arranged through hello@muxion.in. No local demo role or enrolment is treated as proof of payment. Clearing the session cookie requires contacting support to recover a receipt.
