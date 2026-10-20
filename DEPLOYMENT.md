# MUXION deployment

Vercel installs backend dependencies with npm ci --prefix muxion-backend, runs npm run build, and publishes public/. The build strips private lesson content, quiz answers and demo account purchases from the public seed.

## Server configuration

Set these as sensitive Vercel environment variables in Preview and Production:
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- FIREBASE_SERVICE_ACCOUNT_JSON (Firebase project muxionuniverse)
- RAZORPAY_WEBHOOK_SECRET (at least 32 random characters)

Never commit any of these credentials. Firebase uses Standard Firestore in asia-south1 (Mumbai), Google/email authentication, and server-only Firestore access. No Firebase Functions, Storage or billing upgrade is required by this implementation.

The verified owner Google email is designwithmariam@gmail.com. Client-supplied role fields never confer administrator privileges. Admin course/workshop prices are stored in Firestore, and checkout reads the canonical server price before creating an order. Checkout requires a verified Firebase email.

Captured payments and course/workshop access are committed atomically and are isolated by Firebase UID. Orders, payment history, per-order enrolment grants and audit records are stored server-side. Refunds revoke the refunded order's grant; other valid purchases remain active. Any refund, including a partial refund, revokes that order's access. This version does not initiate refunds.

The owner Orders screen has Finish payment setup to register signed Razorpay events at https://project-4jpr6.vercel.app/api/razorpay-webhook. Confirm configuration succeeds and the production endpoint is publicly reachable before relying on background notifications.

## Validation and release status

Run node --test muxion-backend/tests/hosted-payments.test.mjs muxion-backend/tests/platform.test.mjs muxion-backend/tests/payment-setup.test.mjs and node scripts/build.mjs. Twenty payment/access and webhook-setup tests currently pass locally. These checks do not prove live Firebase credentials or Razorpay webhooks are configured.

The automatic fulfilment implementation is deployed to production. Firebase Admin credentials are configured as Vercel secrets; Firestore reads, verified owner Google login, and an admin course save have been exercised successfully. The saved mastery course price remains ₹299. Razorpay webhook configuration is still being diagnosed and no live charge has been performed. After configuration and deployment, test owner pricing, a separate learner account, payment cancellation, signed verification and webhook delivery. A human must complete any actual live charge.

Learning progress, certificates and other legacy demonstration features are outside this payment integration and must not be represented as server-backed without further work.
