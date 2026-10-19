# MUXION deployment

The current MUXION frontend is in `muxion/`. The existing repository's original Figma code is preserved separately in its original paths.

Vercel builds with `npm run build` and publishes only the allowlisted frontend and assets in `public/`. The hash-based routes work without an SPA rewrite.

The preview retains demo learner/admin state in the browser. Firebase authentication, course pricing synchronization and enrolment are not connected yet.

The local Razorpay test implementation is preserved in `muxion-backend/`. Install its dependencies with `npm ci --prefix muxion-backend`, configure backend-only test credentials using `MUXION_ENV_FILE`, then run `npm start`. Never commit credentials or order receipts.

Hosted payments deliberately return unavailable: the existing local JSON ledger is unsuitable for Vercel's ephemeral, concurrent function instances. Add persistent, transactional order storage and authenticated enrolment before enabling hosted checkout. No live payment keys are deployed.
