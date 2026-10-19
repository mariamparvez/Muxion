# MUXION Razorpay Standard Checkout — local Test Mode

Stack: the existing vanilla ES-module website plus a Node.js HTTP backend and the official Razorpay Node SDK. No Firebase billing, Cloud Functions or database tables were added. The existing public website server now delegates to this backend.

## Run

Dependencies are installed on this machine. Start `muxion/Start-MUXION.cmd` or, from this folder, run `npm start`. Open http://localhost:4173/#/courses, choose UI/UX Design Mastery, add it to the bag, then click **Pay with Razorpay · Test**. Run `npm ci` in this folder when setting up a fresh checkout.

Credentials are held outside the public website at `work/private/payments/.env`, excluded from Git and downloadable source archives. To run elsewhere, copy `.env.example` to a PRIVATE location, enter your own test keys, and point `MUXION_ENV_FILE` at it before starting. Do not put it in the website directory. Live keys are deliberately rejected.

## Routes

- `GET /api/payment-config`: public test key, mode and readiness; establishes an HttpOnly SameSite checkout-session cookie.
- `POST /api/create-order`: `{items:["course:mastery"], amount:29900, currency:"INR"}`. Supply a unique `Idempotency-Key` header (16–80 letters, digits, underscores or hyphens). The server derives prices from published seed catalogue entries. The optional `amount` must exactly match that total. Minimum is 100 paise. Workshop IDs use `workshop:<id>`. Local admin-demo edits do not change server prices.
- `POST /api/verify-payment`: `{razorpay_payment_id, razorpay_order_id, razorpay_signature}`. Requires the same checkout session and browser origin. Returns success only after timing-safe HMAC verification against the server-stored order ID AND a Razorpay API check for matching order, amount, INR currency, capture and no refund. Missing fields and mismatches return 400; unknown session/order returns 404; uncaptured authorizations return 202.
- `GET /api/payment-receipt`: latest verified test receipt for the current browser session.

POSTs must use JSON and a same-origin Origin header. Basic per-IP rate limits and body limits apply. Backend code, dotfiles and environment files are not served as static content.

## Verification performed

- 11 automated tests pass: price tampering, malformed/mismatched signatures, wrong browser session, repeated order creation, repeated verification, incorrect upstream amount/currency/order, uncaptured/refunded payment, API failures, live-key refusal, persistence, request-origin checks and private-file access.
- An actual Razorpay test order was created through the website. The Standard Checkout modal opened and a captured sandbox payment was successfully verified by the backend. The receipt survived reloading the website.
- No private test key secret appears in deliverable source files.

Use Razorpay's documented Test Mode payment methods, never real payment credentials. See https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/ . Check Test Mode auto-capture settings if a payment remains authorized instead of captured.

## Boundaries before going live

This is a LOCAL, SINGLE-PROCESS TEST integration. Private JSON order storage is bounded and persists across server restarts; it is not suitable for multiple server instances or public production traffic. Losing the private file or checkout cookie loses local receipt lookup. No test-mode receipt grants course access, certificates, rewards or workshop-group access. Existing learner/admin portals remain demos until Firestore and Authentication are connected.

Before real sales: connect authenticated Firebase user IDs, transactional Firestore orders and enrolments; use a secure public backend host; verify signed payment/refund webhooks with replay protection; add production abuse controls and retention; confirm refunds, taxes and international-payment permissions; then review live-key activation separately. The user requested Firebase Spark only, so no paid Firebase services or plans were enabled. Node localhost is currently the only payment backend host.

Razorpay Test Mode credentials should be replaced before wider sharing, especially when they have been pasted into chat. Store replacement secrets privately and restart the backend; never add secrets to frontend variables.
