# MUXION security review — 4 November 2026

Scope: the active `muxion/` frontend, Vercel `api/` endpoints, Firebase Admin backend, publish output, locked dependencies, Vercel environment metadata, and the 83 commits reachable from `main` at `5b51ef4d5cb9b7ded7c06f86ef66b74f086e872e`. This is a source/configuration review with automated regressions, not a penetration-test certification.

## Completed and verified

| Checklist | Result |
| --- | --- |
| Hide API keys / environment variables | Razorpay secret, webhook secret and Firebase service account remain server-side, stored as sensitive Vercel variables in production and preview. No private values are returned in payment configuration. Public Firebase app configuration and Razorpay key IDs identify the app/provider; they are not administrative credentials. |
| Admin routes | Backend checks verified Firebase identity and server-owned role records. Only the verified owner email bootstraps the owner role. Client-supplied roles cannot elevate a learner. Direct API calls are covered by tests. |
| Authentication | Firebase ID tokens are verified with revocation checking. Suspended accounts are rejected. Email verification is required before payment. |
| Own data only | Profiles, progress, notes, history, payments, bookings and enrolments use the authenticated UID. Cross-account attempts and administrative actions by learners are tested. Public certificate verification excludes UID and email. |
| Forms / XSS | Enforced JSON media type, UTF-8 byte limits, object shape and depth limits, prototype-key rejection, HTTPS URL checks, output escaping and safe navigation URLs. Plain text remains plain text so students can retain code examples in notes. CSP blocks inline script attributes, inline scripts and eval. |
| Rate limiting | Per-instance pre-authentication IP burst limiter, plus transactional Firestore per-account limits across instances: 8 order creations, 30 verifications, 100 reads or 40 other writes per minute. Retry-After is returned. Limit records contain hashes/counts/timestamps and overwrite a bounded document per account/scope. Pre-auth burst protection is not a distributed edge WAF. |
| CORS / CSRF | Explicit permitted origins; cross-origin browser API requests are rejected. No wildcard CORS. Payment cookies are Secure, HttpOnly, SameSite=Strict and HMAC signed. |
| Headers | CSP, nosniff, frame denial, HSTS, referrer policy, permissions policy and OAuth-compatible opener policy. Five main pages and Razorpay script loading checked under enforced CSP. Inline styles remain allowed for the existing UI; inline JavaScript does not. |
| Debug / exposed files | Generic server errors omit exception details. Public build directory is regenerated from an explicit source allowlist, removing stale debug pages/source files. Private keys and credential files are ignored by Git and deployment packaging. Publish audit checks the generated output. |
| Dependencies / unused packages | Compatible npm audit fixes removed vulnerable transitive packages. Audit went from seven advisories (one high, six moderate) to zero. Three direct packages remain because each is used. Thirty-one transitive packages were removed. |
| Database | Repository Firestore rules deny all client reads/writes; authenticated backend performs permission checks. Existing transactional payment grants and refund handling are retained. Live deployed rules and IAM require authenticated Firebase access to verify. |
| Password hashing | Google/email sign-in uses Firebase Authentication. The application does not store password hashes or plaintext passwords in its database. No custom hashing replacement was introduced. |
| Git history | Scanned changed text patches in all 83 main-branch commits for private key material, assigned provider secrets, GitHub tokens and AWS keys: no matches. This does not cover unreachable commits, other branches or binary archives. |
| Payments | Server catalogue prices, HMAC/timing-safe signature checking, captured-payment checks, authenticated ownership, atomic grants, duplicate events and refund handling remain covered by regression tests. No real payment was made during this audit. |

## Validation

- 56 backend/security/router tests passed, including direct API authorization, cross-account access, invalid signatures, malformed forms, concurrent rate limits and prototype pollution attempts.
- `npm audit` on the backend lockfile: zero known vulnerabilities at review time.
- Production build and `node scripts/security-check.mjs` passed.
- Isolated Chrome: home, Learn, Academy, login and social portfolio rendered with no page errors or CSP violations; mobile overflow check passed; Razorpay script loaded.
- Homepage metrics now animate to 100 websites and 130 clients. Social accounts remain 36.

## Outstanding account-level work

1. Install/connect the official Firebase plugin so deployed Firestore/Storage rules, IAM, authorized auth domains, password policy, email-enumeration protection and API-key restrictions can be inspected against the project rather than assumed from source files.
2. Rotate the Firebase private key and Razorpay secret previously pasted in this conversation. Replace production/preview configuration, deploy and verify before revoking old credentials. The sensitive Vercel values cannot be read back, so their identity/age could not be confirmed. No active key was revoked during this change.
3. Confirm preview uses test payment credentials and production uses the intended live credentials; sensitive stored values were not readable for comparison. No paid Firebase plan or paid security service was enabled.

Firebase public-config explanation: https://firebase.google.com/docs/projects/api-keys

For repeat checks after changes: install locked backend dependencies, run `npm test`, `npm run build`, `node scripts/security-check.mjs`, and `npm --prefix muxion-backend audit`.
