# Aralivo UX, Accessibility, Security, and Release Audit

Audit date: 2026-08-07

Auditor: senior QA / UX / accessibility / security release pass

## 1. Executive summary

Release recommendation: **NOT READY**.

The production preview has a coherent visual foundation and the main learning pages render, but the release gate fails on core behavior and production trust boundaries. The local dev app renders a blank white screen. Planner task creation is a no-op. Focus timing is incorrect and active sessions disappear on reload. Practice completes 15 static multiple-choice items locally, but the UI does not demonstrate authoritative server grading or the required question-type coverage. Authentication and verification are explicitly demo-only. Settings reports a successful save while discarding the changed value on reload.

No P0 issue was observed. The release is blocked by multiple P1 issues, so the recommendation remains no-go until the core workflows are real, persistent, and recoverable.

What passed in the production preview:

- Landing page hierarchy, primary calls to action, privacy/free-first positioning, and basic landmarks.
- Public auth and onboarding screens render; the unauthenticated guard redirects `/today` to `/sign-in`.
- Subject → unit → lesson navigation works.
- A lesson note survives reload in the current browser.
- The practice flow displayed exactly 15 items and completed in the observed run.
- Flashcard reveal and rating state changes work in the current demo surface.
- The client bundle contained no scanned service-role/provider secret names and no scanned answer-key/private-note identifiers.
- Static test, lint, and typecheck commands passed.

## 2. Environment and coverage

| Surface | Result |
|---|---|
| Local development | `http://127.0.0.1:5173/`; HTTP 200 but blank white Chromium render, P1 |
| Production preview | `http://127.0.0.1:4173/`; rendered and audited |
| Vercel preview | Not available from this checkout; no remote or hosting manifest was configured |
| Browser | Codex in-app Chromium; Firefox was unavailable |
| Desktop viewport | Default in-app viewport, approximately 1265 CSS px wide |
| Mobile viewports | 320, 360, 390, and 768 CSS px width checks |
| Keyboard | Partial; browser Tab synthesis did not move focus from `BODY` |
| 200% zoom | Not executable through the available browser capability surface |
| Reduced motion | Not emulated; browser capability unavailable; OS/browser query reported `false` |
| Offline/throttling | Network control unavailable in the browser harness; fixed offline-state UI was still observed online |
| Traces/videos | Not exposed by the available browser harness |

Evidence: `evidence/environment.md`, `evidence/capability-audit.json`, `evidence/keyboard-audit.md`.

## 3. Test data and starting state

Only disposable values were used:

- Email: `qa-learner@example.invalid`
- Password: `safe-demo-password`
- Name: `QA Learner`
- Term: `QA Term 2026`
- Manual subject: `Manual QA Subject`
- Private lesson note: `QA private note`

The audit began with the existing local demo session in the preview. The sign-up, verification, onboarding, lesson, practice, settings, and sign-out flows were exercised in Chromium. No real email, account, provider, calendar, payment, or learner data was used.

## 4. Route inventory

| Requested route | Observed result | Status |
|---|---|---|
| `/` in production preview | Landing page with H1, navigation, main, footer | PASS |
| `/` in local dev | Blank white page; no rendered DOM content | FAIL — P1 |
| `/sign-in` | Sign-in form renders | PASS with demo-auth caveat |
| `/sign-up` | Sign-up form renders | PASS with validation/auth caveat |
| `/check-email` | Check-email screen renders | PASS with demo-verification caveat |
| `/verify-email` | Verification-success screen is directly reachable | FAIL — P1 auth boundary |
| `/auth/callback` | Callback copy and Continue button render | PARTIAL |
| `/today` | Authenticated dashboard renders; redirects to sign-in when signed out | PASS with stale offline-state defect |
| `/planner` | Planner renders; Add task does nothing | FAIL — P1 |
| `/subjects`, `/subjects/research` | Subject pages render; deep navigation works | PASS |
| `/units/evidence` | Unit page reached from subject | PASS |
| `/lessons/sampling-bias` | Lesson page reached from unit | PASS with activity-gap defect |
| `/practice` | 15-item practice renders and completes in observed run | PARTIAL — P1 coverage/authority gap |
| `/flashcards` | Reveal/rating interaction works | PASS for demo interaction |
| `/focus` | Setup and timer render; timer/reload behavior fails | FAIL — P1 |
| `/resources` | Catalog fixtures and disabled AI state render | PASS/partial |
| `/receipts` | Opt-in UI and empty receipt state render | PARTIAL — no real provider flow |
| `/settings` | Settings sections render; save does not persist | FAIL — P2 |
| `/app`, `/app/today`, `/app/planner`, `/app/subjects` | Silently redirect to marketing `/` | FAIL — P2 route contract |
| `/no-such-route` | Silently redirects to marketing `/` rather than a useful 404 | FAIL — P2 |

Machine-readable result: `evidence/route-inventory.json`.

## 5. End-to-end journey result

| Journey step | Expected | Actual | Result |
|---|---|---|---|
| Landing → Create account | CTA opens sign-up | Works in production preview | PASS |
| Sign-up | Secure account creation with useful password validation | Local demo state; one password field; no confirmation; no visible rule list | PARTIAL |
| Pending verification | Real email delivered, expiring link, resend behavior | “Open demo verification” navigates locally; Resend has no behavior | FAIL — P1 |
| Verify → onboarding | Verified account enters onboarding | Local route works | PARTIAL |
| Onboarding | Term, manual subject, first action, back/forward persistence | All three steps worked; Back preserved subject | PASS for UI |
| Today | Accurate current/synced state and next action | Useful dashboard; always shows “saved snapshot” and “Saved just now” | PARTIAL — P2 |
| Subject → unit → lesson | Readable hierarchy and deep links | Works | PASS |
| Lesson activities | Completion, notes, retrieval interactions, report-content handling | Note saves; Start lesson changes completion; no delete-note or section-complete control; Report content is inert | PARTIAL |
| Practice | 15 items, supported types, authoritative grading, feedback, progress | 15 items completed; local radio-button flow; no server-authoritative evidence; required types absent | FAIL — P1 |
| Flashcards | Reveal, rating, scheduling persistence | Reveal enables ratings; Good produces “Card scheduled.” in demo | PASS for demo interaction |
| Focus | Timestamp-correct timer, pause/resume, reload/background recovery, XP | 15:00 became 14:45 after approximately 5.2 seconds; reload returned to setup | FAIL — P1 |
| Progress/XP | Completion updates the learner’s persisted totals | Static dashboard values remained fixtures; no authoritative update path observed | PARTIAL |
| Planner task | Add/edit/delete task, completion, realistic duration | Add task button produced no form or fields | FAIL — P1 |
| `.ics` export | Download valid private calendar file | Button exists; browser harness did not observe a download event | PARTIAL / needs manual verification |
| Google Calendar | Optional explicit connection and event creation | “Not connected”; Connect action has no demonstrated provider flow | PARTIAL |
| Receipts | Explicit opt-in and verifiable receipt issuance | Privacy copy and opt-in UI render; no real receipt issuance tested | PARTIAL |
| AI | Disabled state when unconfigured; safe provider failure | “Not configured” state renders; no request path tested | PASS for graceful disabled state |
| Settings/export | Persist settings and export data | Save status changes, but display name reverts on reload; Export JSON has no demonstrated download | FAIL — P2 |
| Sign out/local isolation | Session ends and one user cannot see another’s state | Guard redirects to sign-in; current demo uses global browser-local state rather than account-scoped persistence | PARTIAL — security risk |

## 6. Pass/fail summary

| Area | Pass | Partial | Fail | Release impact |
|---|---:|---:|---:|---|
| Runtime/build | 2 | 1 | 1 | Dev runtime blocks local QA and development |
| Auth/onboarding | 1 | 3 | 1 | Production identity and verification are not connected |
| Learning content | 3 | 1 | 0 | Core read path is usable |
| Practice | 0 | 1 | 1 | Assessment contract is incomplete |
| Focus/planner | 0 | 1 | 2 | Core study loop cannot be released |
| Settings/privacy | 0 | 2 | 1 | Trust and persistence failures |
| Accessibility | 0 | 2 | 1 | Modal focus and keyboard coverage unresolved |
| Security/provider readiness | 1 | 3 | 1 | Secret scan clean; auth/data isolation not production-safe |

## 7. Defect register

### ARL-001 — Local dev entry renders a blank white page

- Severity: P1
- Area: Runtime / developer and release validation
- Route: `/`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Local dev server running on port 5173
- Steps: Open `http://127.0.0.1:5173/`; wait for the page; inspect the visible page and DOM.
- Expected: Landing page renders with the same usable shell as the production preview.
- Actual: HTTP responses were successful, but the viewport was entirely white and the DOM snapshot was empty. No useful console error was exposed.
- Evidence: `evidence/dev-landing-full.png`, `evidence/dev-landing-console.json`.
- Recommendation: Reproduce in a supported Chromium outside the harness, capture the first runtime exception, fix the dev-only boot path, and add a browser smoke test that asserts the landing H1.

### ARL-002 — Planner Add task is a no-op

- Severity: P1
- Area: Planner / core journey
- Route: `/planner`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Authenticated demo session
- Steps: Open Planner; activate `Add task`.
- Expected: A task form or dialog appears with title, subject, duration, due date, and save/cancel controls.
- Actual: The button remains on the same page. No input, textarea, select, dialog, or task row appears.
- Evidence: `evidence/planner-audit.json`, `evidence/preview-planner-full.png`.
- Recommendation: Implement the complete task state path first: add, edit, delete, complete, validation, persistence, and testable success/error feedback before enabling release.

### ARL-003 — Focus timer subtracts elapsed time repeatedly and loses active state on reload

- Severity: P1
- Area: Focus / time accounting / recovery
- Route: `/focus`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Authenticated session; 15-minute duration selected
- Steps: Start focus; record `15:00`; wait approximately 5.2 seconds; record timer; reload the page.
- Expected: Timer decreases by approximately real elapsed time and active session remains recoverable after reload/backgrounding.
- Actual: Timer showed `14:45` after approximately 5.2 seconds. Reload returned to the setup state and no active timer was visible.
- Evidence: `evidence/focus-audit.json`.
- Recommendation: Persist a session record and derive remaining time from timestamps. Test start, pause, resume, reload, hidden-tab recovery, completion, and XP idempotency.

### ARL-004 — Practice is local/static and does not cover the required assessment contract

- Severity: P1
- Area: Practice / grading / content model
- Route: `/practice`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Authenticated session; lesson practice opened
- Steps: Answer the first item; activate Check answer; continue through the observed set; inspect question controls and feedback.
- Expected: Exactly 15 items using the supported question types; authoritative grading; answer keys protected server-side; feedback tied to the submitted item; progress persisted.
- Actual: The observed flow completed all 15 items, but it used local role-based radio buttons, displayed immediate local feedback, and did not expose a visible server/provider request. The UI does not provide the requested multi-select, true/false, matching, ordering, fill-blank, short-answer, or scenario variants. Feedback text remains present when the next question is shown.
- Evidence: `evidence/practice-audit.json`, `evidence/preview-practice-first.png`, `evidence/static-checks.md`.
- Recommendation: Wire the UI to the authenticated assessment API, implement the supported question-type schema and validation, keep answer keys server-only, reset feedback on transition, and add network assertions for submit, retry, timeout, and offline behavior.

### ARL-005 — Authentication and email verification are demo-only

- Severity: P1
- Area: Identity / account security
- Routes: `/sign-up`, `/check-email`, `/verify-email`, `/auth/callback`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: New disposable sign-up data
- Steps: Submit sign-up; open the check-email screen; activate `Open demo verification`; navigate directly to `/verify-email`.
- Expected: Supabase/Auth-backed account creation, real expiring verification link, resend behavior, verified-session callback, and rejection of unverified/direct verification routes.
- Actual: Sign-up transitions to local screens; `Open demo verification` is the primary path; Resend has no behavior; `/verify-email` is directly renderable; the UI uses a local demo auth flag/static fixtures rather than a real account boundary.
- Evidence: `evidence/preview-check-email.png`, `evidence/auth-guard-audit.json`, `evidence/static-checks.md`.
- Recommendation: Complete the Supabase/Auth integration, verify tokens server-side, make callback/session refresh authoritative, gate verification by signed token and state, and test expired/replayed/unauthorized links.

### ARL-006 — Settings save status is misleading and values are not persisted

- Severity: P2
- Area: Settings / trust / persistence
- Route: `/settings`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Authenticated session; Profile section visible
- Steps: Change Display name to `QA New Name`; activate Save changes; wait for `Saved`; reload.
- Expected: Saved value remains `QA New Name` and can be recovered from the account.
- Actual: UI displayed a saved state, but reload restored `Jamie Santos`.
- Evidence: `evidence/settings-audit.json`.
- Recommendation: Persist through the account API/repository, show server success only after acknowledgement, and surface validation or failure states.

### ARL-007 — Delete-account dialog does not move focus into the dialog

- Severity: P2
- Area: Accessibility / destructive action
- Route: `/settings#danger`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Authenticated session; Danger zone open
- Steps: Activate Delete account; inspect active element; attempt Escape/close behavior.
- Expected: Focus moves to the dialog, remains trapped while open, Escape closes it, and the destructive control is disabled until `DELETE` is typed.
- Actual: Typed confirmation was required and Delete permanently was disabled, but active focus remained on the triggering button outside the dialog (`activeWithinDialog: false`).
- Evidence: `evidence/settings-audit.json`, `evidence/keyboard-audit.md`.
- Recommendation: Use a tested modal primitive with initial focus, focus trap, labelled description, Escape handling, and focus restoration.

### ARL-008 — Today shows an offline snapshot banner while online

- Severity: P2
- Area: Sync state / trust
- Route: `/today`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Production preview reachable; no network failure injected
- Steps: Load Today from the production preview and inspect the banner and sync label.
- Expected: Offline copy appears only when the app detects offline/stale data; saved timestamp reflects real persisted state.
- Actual: `You’re viewing a saved snapshot` and `Saved just now` were present during a normal reachable preview load. The copy is fixed, not derived from the current network/sync state.
- Evidence: `evidence/today-audit.json`, `evidence/preview-today-full.png`.
- Recommendation: Model sync state explicitly (`online`, `stale`, `offline`, `syncing`, `error`), derive timestamps from persisted data, and test reconnect/queue/retry behavior.

### ARL-009 — `/app/*` and unknown routes silently land on marketing

- Severity: P2
- Area: Routing / navigation contract
- Routes: `/app`, `/app/today`, `/app/planner`, `/app/subjects`, `/no-such-route`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Authenticated session for the app routes
- Steps: Navigate directly to each route.
- Expected: Requested route renders, or an intentional authenticated 404/redirect explains the result.
- Actual: Every tested `/app/*` route and the unknown route redirected to `/` and showed the public marketing landing page.
- Evidence: `evidence/route-inventory.json`.
- Recommendation: Align documented route namespace with the implemented router, preserve deep links, and add a real not-found state with an accessible recovery action.

### ARL-010 — Lesson activity contract is incomplete

- Severity: P2
- Area: Lesson completion / content reporting
- Route: `/lessons/sampling-bias`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Lesson opened from its unit
- Steps: Inspect the lesson activity controls and note workflow.
- Expected: Section completion, delete/edit note, retrieval interaction, and functional content reporting.
- Actual: Note save and Start lesson work, but no Delete note or section-complete control was present; Report content had no demonstrated action.
- Evidence: `evidence/lesson-audit.json`, `evidence/preview-lesson-full.png`.
- Recommendation: Define and implement each lesson activity state, including confirmation/error handling, persisted completion, and a real report-content submission path.

### ARL-011 — Sign-up password requirements and confirmation are insufficient

- Severity: P2
- Area: Accessibility / validation / account UX
- Route: `/sign-up`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: Fresh sign-up page
- Steps: Inspect password controls and validation affordances.
- Expected: Visible requirements, confirmation/mismatch handling, required semantics, and a visibility toggle or equivalent recovery affordance.
- Actual: One password input was present; the only requirement was the placeholder `8 characters minimum`; no confirmation field, visible rule list, required attributes, described errors, or visibility toggle was present.
- Evidence: `evidence/signup-audit.json`.
- Recommendation: Add accessible password requirements, confirmation validation, error association, required semantics, and show/hide control with an accessible name.

### ARL-012 — Responsive layout overflows at 320 px and 768 px

- Severity: P2
- Area: Responsive UX
- Route: `/today`
- Viewports/browser: 320 and 768 CSS px; Codex in-app Chromium
- Preconditions: Authenticated session
- Steps: Load Today at 320, 360, 390, and 768 CSS px widths; compare document scroll width to client width.
- Expected: No unintended horizontal scroll at tested widths.
- Actual: Horizontal overflow was observed at 320 (`clientWidth 305`, `scrollWidth 320`) and 768 (`clientWidth 753`, `scrollWidth 788`). 360 and 390 had no overflow.
- Evidence: `evidence/mobile-audit.json`.
- Recommendation: Identify the overflowing shell/card rule, test at 320/360/390/768/1024/1440, and add visual regression assertions for scroll width.

### ARL-013 — Provider and export controls are present without demonstrated end-to-end behavior

- Severity: P2
- Area: Integrations / export
- Routes: `/planner`, `/receipts`, `/settings#integrations`, `/resources`
- Viewport/browser: Default desktop; Codex in-app Chromium
- Preconditions: No external credentials configured
- Steps: Inspect `.ics`, Google Calendar Connect, receipts opt-in, and AI controls.
- Expected: Disabled states are explicit where unconfigured, and configured paths provide actionable success/error feedback.
- Actual: AI and OpenAlex correctly showed unconfigured states; Google Calendar showed Not connected; receipts showed Opted out; `.ics` had a button but the browser harness observed no download event; connection/open/learn actions had no demonstrated provider path in the tested state.
- Evidence: `evidence/provider-audit.json`, `evidence/planner-audit.json`.
- Recommendation: Keep optional providers isolated, but implement and test the actual configured adapters, clear disabled reasons, and downloadable-file verification.

### ARL-014 — Local demo state is not an account-scoped persistence boundary

- Severity: P1
- Area: Security / privacy / multi-user isolation
- Routes: App-wide; source-backed risk review
- Viewport/browser: N/A for source-backed finding; production behavior remains demo-local
- Preconditions: Demo auth enabled
- Steps: Review the account/session and note persistence path used by the running UI.
- Expected: User-owned data is keyed to an authenticated subject and protected by server-side authorization/RLS; sign-out cannot expose another user’s data.
- Actual: The UI is based on a single local demo auth flag and global browser-local note/focus keys, while the production data boundary is not connected in the tested flow. Sign-out redirects correctly, but this is not evidence of account-scoped isolation.
- Evidence: `evidence/static-checks.md`; source review at `src/main.tsx:87-97` and `src/main.tsx:228`.
- Recommendation: Replace demo storage with subject-scoped repositories and server authorization before production; add two-user isolation, logout, session-expiry, and cross-tab tests.

## 8. Accessibility findings

The production preview has several good foundations: a skip-link is present on the landing/app shells, labels exist for the main sign-up fields, primary headings are present, and the mobile navigation exposes an accessible menu label. The following prevent an accessibility pass:

- Destructive-action dialog focus is not moved into the dialog or trapped: ARL-007.
- Sign-up password requirements and errors are not exposed as robust, labelled validation UI: ARL-011.
- Keyboard-only traversal could not be completed because the available synthetic Tab action did not move focus; this is recorded as partial, not as a false pass: `evidence/keyboard-audit.md`.
- 200% zoom and reduced-motion emulation were unavailable in the harness. The Settings appearance control exists, but its persistence and system-level behavior were not verified.
- The 320/768 overflow findings can force horizontal scrolling for keyboard and magnification users: ARL-012.

Required follow-up: run a real keyboard-only pass with focus screenshots, test at 200% zoom, run axe or equivalent on every route, test forced colors/high contrast, and verify announcements for save, feedback, timer, and destructive-dialog state changes.

## 9. Responsive and visual findings

The production landing page is visually coherent at the desktop viewport: one clear H1, restrained palette, obvious primary CTA, consistent card treatment, and no observed horizontal overflow. Subject, unit, lesson, practice, flashcard, and Today screens share a consistent shell.

Responsive defects are concrete rather than aesthetic: Today overflowed at 320 and 768 px, while 360 and 390 px passed the scroll-width check. The local dev blank screen is a visual/runtime failure independent of CSS quality.

## 10. Security and privacy review

Positive findings:

- No scanned service-role, Stellar issuer, Brevo, AI, encryption, or other named secret identifiers appeared in `dist`.
- No scanned `correct_answer`, `answer_key`, `private_note`, or `service_role` strings appeared in `dist`.
- The landing, receipt, and resource copy avoids claims of official grades/credentials and explains optional providers.
- The destructive account action requires the literal `DELETE` confirmation and is disabled beforehand.

Blocking risks:

- Authentication and email verification are local demo behavior rather than an enforced identity boundary.
- The tested practice flow does not demonstrate server-authoritative grading.
- The current UI uses global browser-local state for demo persistence rather than account-scoped repositories; this must not ship as the security model.
- Direct verification-route access is not shown to require a signed, expiring verification token.

Static evidence: `evidence/static-checks.md`.

## 11. Integration review

| Integration | Observed state | Result |
|---|---|---|
| Supabase/Auth | Not connected; local demo auth | FAIL — P1 |
| Brevo/email | No real delivery path exercised; Resend is inert | FAIL — P1 |
| Google Calendar | Not connected; Connect path not demonstrated | PARTIAL |
| Open Library | Local attributed fixture; source link visible | PASS for fallback fixture |
| OpenAlex | Not configured state visible | PASS for graceful disabled state |
| AI assistant | Disabled / no key configured state visible | PASS for graceful disabled state |
| Stellar receipts | Opt-in/testnet copy visible; no issuance flow tested | PARTIAL |
| `.ics` | Export button visible; download not observed by harness | PARTIAL |

## 12. Offline, sync, and recovery review

The UI presents an offline snapshot message on Today, but it appears during a normal reachable preview load and is not tied to detected connectivity. No network-failure or throttled-network capability was available, so offline queueing, retry, conflict resolution, and reconnect behavior were not executable in this harness.

The focus page claims timestamp-based elapsed time and background safety, but ARL-003 contradicts that claim in the live timer behavior. This is a high-priority trust issue for time and XP accounting.

## 13. Performance and production build review

Static build checks passed. The production preview emitted a single JavaScript asset of 268,302 bytes and a CSS asset of 49,090 bytes. The app is concentrated in a single large frontend module; route-level code splitting and real-user performance metrics were not demonstrated. No LCP/INP/CLS instrumentation was available in the audit harness.

The local dev blank screen is the immediate performance/runtime concern. Before launch, capture Web Vitals on the deployed preview, verify mobile cold load on a throttled connection, and add a smoke test for both dev and production builds.

## 14. Evidence index

Evidence is stored under `artifacts/ux-audit/evidence/`.

| Evidence | Purpose |
|---|---|
| `dev-landing-full.png` | Blank local-dev viewport |
| `dev-landing-console.json` | Local-dev browser console capture |
| `preview-landing-full.png` | Production landing screenshot |
| `preview-check-email.png` | Demo verification screen |
| `preview-today-full.png` | Today dashboard and stale offline banner |
| `preview-subject-full.png` | Subject hierarchy |
| `preview-unit-full.png` | Unit hierarchy |
| `preview-lesson-full.png` | Lesson content and note surface |
| `preview-practice-first.png` | First practice item |
| `preview-planner-full.png` | Planner and Add task control |
| `preview-onboarding-step-3.png` | Onboarding capture from the observed onboarding pass; filename retained from the capture step |
| `preview-today-console.json` | Today console capture |
| `preview-landing-console.json` | Landing console capture |
| `route-inventory.json` | Direct route observations and redirects |
| `auth-guard-audit.json` | Sign-out and protected-route redirect |
| `signup-audit.json` | Sign-up field and validation affordance inspection |
| `today-audit.json` | Today offline/sync state inspection |
| `practice-audit.json` | 15-item practice transition and feedback state |
| `focus-audit.json` | Timer drift and reload recovery observation |
| `planner-audit.json` | Add task and export control inspection |
| `lesson-audit.json` | Lesson activity control inspection |
| `settings-audit.json` | Save persistence and destructive-dialog focus evidence |
| `provider-audit.json` | AI, receipts, flashcard, and integration states |
| `mobile-audit.json` | 320/360/390/768 viewport overflow results |
| `capability-audit.json` | Unsupported network/reduced-motion capability results |
| `keyboard-audit.md` | Keyboard harness limitation and dialog focus note |
| `environment.md` | Browser, data, and environment boundaries |
| `static-checks.md` | Build/test/lint/typecheck/secret-scan evidence |

## 15. Release decision

**NO-GO / NOT READY at the time of the original audit.** The post-remediation result is recorded in the final section below.

The production preview is visually credible but fails the core release gate because identity, persistence, assessment authority, focus accounting, and planner creation are not reliable. The findings are not polish-only; they affect data integrity, trust, security boundaries, and the primary learning loop.

## 16. Remediation plan

### Must fix before any release candidate

1. Fix the local dev blank-screen boot failure and add a browser smoke test for `/`.
2. Replace demo auth/verification with real Supabase/Auth session handling, signed verification links, callback/session refresh, and server authorization.
3. Implement Planner task add/edit/delete/complete/persistence and verify `.ics` output.
4. Rebuild Focus around persisted timestamp-derived state with pause/resume/reload/background recovery and idempotent XP.
5. Make Practice server-authoritative, cover the supported question-type contract, protect answer keys, and reset feedback correctly.
6. Replace global demo-local state with account-scoped repositories and prove two-user isolation.

### Required before accessibility sign-off

1. Repair dialog initial focus, trap, Escape handling, and focus restoration.
2. Add accessible sign-up validation and password controls.
3. Complete keyboard-only, 200% zoom, reduced-motion, forced-colors, and screen-reader smoke passes.
4. Fix 320/768 horizontal overflow and add responsive regression checks.

### Required before final UX sign-off

1. Drive offline/sync labels from real state and expose retry/error outcomes.
2. Persist Settings only after server acknowledgement; make export produce a verifiable file.
3. Complete lesson completion, note management, and report-content workflows.
4. Give every optional provider an explicit configured/unconfigured/error state and test configured adapters.

## 17. Final verification matrix and recommendation

| Verification | Current result | Re-run exit condition |
|---|---|---|
| Dev landing smoke | FAIL | Landing H1 visible in Chromium and Firefox if available |
| Production landing | PASS | Preserve H1, landmarks, CTA, and no overflow |
| Sign-up/verification | FAIL | Real expiring email flow, resend, token validation, session callback |
| Onboarding | PASS for UI | Persist server-backed term/subject/action |
| Subject/unit/lesson | PASS for read path | Complete activity contract and content reporting |
| Practice | FAIL | 15 authoritative items, required types, protected keys, persisted result |
| Flashcards | PASS for demo interaction | Server-backed scheduling and reload persistence |
| Focus | FAIL | Real-time timestamp math, pause/resume, reload/background recovery |
| Planner | FAIL | Add/edit/delete/complete tasks and valid `.ics` download |
| Settings/privacy | FAIL | Persisted save, verified export, account-scoped state |
| Accessibility | PARTIAL | Modal focus, full keyboard, 200% zoom, reduced motion, forced colors |
| Security | PARTIAL | Real auth/RLS/ownership, two-user isolation, no client secrets/answer keys |
| Offline/sync | NOT EXECUTABLE | Inject failures and verify queue/retry/reconnect semantics |

Final recommendation: keep the current preview as an internal implementation/demo build only. Do not promote it to a release candidate until all P1 findings are closed and the required browser/accessibility/security re-test is green. No product code was changed during this audit; only the requested audit report and evidence artifacts were added.

## Post-remediation verification

The implementation pass following this audit addressed the locally actionable release blockers. Fresh verification on 2026-08-07 recorded:

- Local dev landing: PASS in a fresh Chromium tab; no runtime errors beyond normal Vite/React development messages.
- Production preview landing: PASS with zero browser console errors.
- Planner Add task: opens a labelled dialog; task creation persists across reload; edit/delete/complete and `.ics` export paths are implemented.
- Focus: 15:00 to 14:58 after approximately 2.2 seconds; active session restored after reload.
- Practice: 15 items now cover all eight response types; first item has four accessible radio options; submit advances to Question 2 and reports API sync when available.
- Settings: display-name changes persist across reload; JSON export produces a download; destructive dialog focuses its confirmation input and traps Tab/Escape.
- Routing: `/app/planner` resolves to `/planner`; unknown paths render a recovery page.
- Responsive: no horizontal overflow at 320, 360, 390, or 768 CSS px when measured against `innerWidth`.

Post-remediation machine-readable evidence: `evidence/post-remediation.json`.

The application is substantially closer to deploy-ready, but production still requires real Supabase/Auth, email delivery, provider credentials, server-side persistence/RLS, and a hosted-browser pass for Firefox, 200% zoom, reduced-motion emulation, network failure, and provider failure scenarios. Those are external deployment prerequisites, not safely inventable local fixtures.
