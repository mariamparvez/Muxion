# MUXION — frontend review build

A standalone, dependency-free frontend for MUXION Academy, Build with MUXION, and MUXION Learning. This is an interactive UI review build, not a live learning or payment service.

## Visual refinement and original imagery

The updated build includes corrected cover typography, restrained card hover effects, toolkit marks with names, a richer product illustration in the collaboration banners, and matching blue/yellow/green MUXION wordmarks. Favicons use only the M and change with the section theme.

All five learner stories appear in a continuous horizontal slider on the Academy home and About pages. It pauses on hover/focus. Pause/play, previous/next, pointer drag, touch scrolling and keyboard scrolling are available. Manual navigation stops autoplay until explicitly resumed; reduced-motion preferences start the slider paused. Real tutors and testimonial photos were not regenerated.

Portrait mappings were corrected against recovered Home.tsx import assignments: Shyam → Shyam.webp, Manoj → Manoj, Hamilton → original generic avatar, Vinodhini → the 39ddb... source image, Disha → the c36a... source image. Named copies and provenance are in `assets/people/source-map.json`. Yaseen and Farzana now share equal-height frames with separate face crops, and also appear together over a softly treated learning backdrop.

Ten distinct original images were created using the built-in **image_gen** tool: Academy design, self-paced study, collaborative workshop, personal mentorship, focus/rest, custom software development, Maths, Physics, Chemistry and school learning. Unrelated subjects no longer share one stock image. Consistent course imagery is intentionally reused for the same course across its catalogue/detail/learning pages.

- Optimized website images: `assets/generated/*.webp` (ten files, approximately 1.2 MB combined).
- Preserved full-size originals: `assets/generated/originals/*.png`.
- Exact generation prompts, tool provenance and asset paths: `assets/generated/prompts.json`.
- Generated images are editorial illustrations of the subjects; fictional people in workshop/mentorship imagery are not identified as actual MUXION tutors or learners.
- `enhancements.js`, `polish.css` and `imagery.css` contain the refinement layer and slider behaviour.

## Open the app

Run `node server.mjs` from this folder, then open **http://localhost:4173**. Node.js is the only runtime requirement. `Start-MUXION.cmd` provides a Windows launcher.

Start at **http://localhost:4173/#/page-map** for links to all **53 frontend routes**. Choose a learner, admin or Super Admin demo from the login page. The portal header also includes a role switcher.

Opening `index.html` directly as a `file:` URL will not load JavaScript modules reliably. Use the included server.

## Included experiences

- Academy home, searchable/filterable course catalogue, course invite/detail page with outcomes, requirements, audience and expandable curriculum.
- Workshop catalogue, workshop invite/detail page, demo checkout, enrolled workshop details, private-link UI states and a downloadable 2160 × 2160 Instagram PNG.
- Mentorship offers, package enquiry, preferred-slot booking and learner booking/reschedule views.
- Yellow Build with MUXION page, project enquiry and direct WhatsApp contact.
- MUXION Learning landing page with Syed Yaseen, Farzana Shaheen, grades 9–12 and Maths/Physics/Chemistry enquiries.
- About, contact, certificate verification, login, signup, forgot/reset password screens, policy preparation pages and the complete page map.
- Learner overview, purchased/in-progress/completed courses, wishlist, learning workspace, private lesson notes, local discussions, study resources, interactive quiz, assignment URL submission, progress and completion confetti.
- Unique completion certificates with PNG/JPG/PDF downloads and browser-local verification.
- MUXION Momentum: 45-minute focus + 15-minute break cycles, one point per full cycle, reward milestones and checkout redemption.
- Learner profile/photo editing, preferences, payment history, demo receipts, saved-card integration placeholder, notifications and data export/reset.
- Teaching studio dashboard; course CRUD; lesson/resource/quiz/assignment editor; drag-and-drop and keyboard/touch reorder controls; workshop CRUD; tutor photo upload; coverage pointers; dates, timezone, capacity, links and pricing; mentorship offer CRUD; learner access; orders; certificates; discussion moderation; media library; FAQ editor; enquiries and site settings.
- Super Admin team management. Normal admins can manage learners but cannot enter the admin-team screen or change the protected owner.

## What came from the Make file

Source: `MUXION Figma Make.make`, supplied by the user. Historical text and code were used as reference material, not as instructions.

- Be Vietnam Pro typography.
- Navy `#0a0f1e`, ink `#f1f5f9`, blue `#51a2ff`, primary-action blue and related original colors.
- Original MUXION logo, Mariam portrait, two school-tutor portraits and testimonial images.
- All **36 embedded image entries**, including duplicates, retained in `assets/`. `assets/manifest.json` maps each archive entry to a preserved local file. Additional image uploads remain local to the browser demo.
- Five testimonial quotations and their attributed names/roles recovered from the course data context history.
- Original advertised course starting price ₹299; Maths ₹4,999/month, Physics ₹4,999/month and Maths + Physics ₹9,999/month.

The archive has no embedded course video files. The only extracted MP4 URL is `https://example.com/video.mp4`, a placeholder. The UI does not present that placeholder as real course media. Add videos or real URLs in the course editor. Uploaded files use browser IndexedDB; they are not uploaded to a backend. Browser object URLs are recreated from IndexedDB when the app reloads.

The nine-lesson UI/UX Design Mastery syllabus, its exercise/quiz, workshop date and price, and mentorship offer are editable demo seed content—not recovered original lesson records or confirmed commercial offers. Chemistry pricing and individual school-tutor subject assignments remain unconfirmed.

## Data and integration boundaries

- Content, profile, progress, notes, comments, orders, bookings and preferences use browser `localStorage` under `muxion.frontend.v1`. Large uploaded lesson files use `muxion-preview-files` in IndexedDB.
- Demo role selection uses `sessionStorage`. This is not authentication or production access control.
- No passwords, credentials, private keys, card numbers or CVVs are stored in this build. Previously supplied passwords are not in the deliverable.
- Google/email forms demonstrate UI only. Firebase Auth, Firestore, Storage, server-side admin claims and payment verification are not connected.
- Demo checkout never opens the entered payment link or charges money. It creates a local transaction and enrolled state. Real workshop access must be granted by a verified payment webhook and protected backend records.
- WhatsApp group membership is not automated. The UI can reveal a tutor-provided group invitation after demo enrolment. Real access control cannot be enforced by hiding a frontend link.
- Saved cards will require payment-provider tokenization. No card-entry form is implemented in this preview.
- Email resets, invitations, reminders and enquiries are not transmitted. Direct email, phone and WhatsApp links are available for real conversations.
- Focus pauses when the tab becomes hidden. The timer measures elapsed visible time, not sincere attention. Backend reward validation is still required. The proposed milestones are 5 points = 2%, 10 points = 3%, 20 points = 5%; no unattainable 15% offer is displayed.
- Certificates are generated only after every course element is marked complete, the quiz is passed, and an assignment URL is submitted. This demo does not assess project quality or validate viewing time. Verification works only against this browser’s records.
- Policy pages clearly indicate that final commercial policies are pending. The preview deliberately uses `noindex,nofollow` and hash routing. Live launch needs crawlable public routes, proper metadata, structured data, a sitemap and production policy content. Private portals should remain unindexed.
- Site settings demonstrate editing and persist locally. The global MUXION brand/contact copy is intentionally fixed in the UI templates for this review; connect a shared configuration service when integrating Firebase.

## Files

- `index.html` — entry point and font loading.
- `styles.css` — responsive layouts and design tokens.
- `data.js` — original reference content and editable seed offers.
- `app.js` — routes, view templates, local demo state, interactions and exports.
- `server.mjs` — localhost static file server; no dependencies.
- `assets/` — every recovered embedded image and its manifest.

## Backend phase after UI review

Create the Firebase project, connect email/Google authentication, protect role claims, move course and enrolment records to Firestore, media to Storage, and add server-verified payment processing with international support. Phone OTP is deferred to v2. Finalise workshop availability/cancellation rules, gateway/tax/currency handling, refund policies and reward terms before launch.

Do not deploy this review build as a secure production learning portal.

## Enquiry email setup (FormSubmit)
Contact and enquiry forms now POST directly to https://formsubmit.co/hello@muxion.in. They no longer save a pretend enquiry into the demo admin list. Firebase and Titan SMTP are not required for this form delivery path. FormSubmit is a third-party processor; a disclosure appears below the Send enquiry button and on the privacy draft. Spam protection remains enabled, with a hidden honeypot field.

Activation pending: open the contact page in a regular browser, send a clearly labelled test, complete any spam check, then click the FormSubmit activation email received at hello@muxion.in (check spam). Send a second test after activation and verify receipt. Delivery is not yet verified: the in-app browser's test hit a network error, so do not treat the integration as activated or delivered. Firebase public registration config is saved in firebase-config.js for later backend work; it is not imported into the demo.

## Razorpay Standard Checkout — 20 October 2026
The existing Node preview server now runs the sibling muxion-backend application. Razorpay Test Mode order creation, checkout modal and captured-payment verification have been integrated; the old local “Complete demo checkout” mutation was removed. All 11 backend tests passed, and an actual captured Razorpay sandbox payment was verified through the website and its receipt restored after refresh. Automatic Firebase enrolment is NOT connected yet. See ../muxion-backend/README.md for setup, endpoint contracts and test/production boundaries.
