# Test plan

## Automated

`pytest -q` covers seeded assessment selection, 15/30/50 sizing, deterministic seeds, insufficient pools, XP idempotency, receipt privacy/hashing, and parser rejection of hidden answers/duplicate IDs.

`npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` cover the web surface. Add browser automation with mocked Supabase/Auth/AI/Brevo/Google/Stellar providers for the complete account → onboarding → lesson → practice → focus → settings → export → reload → sign-out journey.

## Accessibility matrix

Test 320, 360, 390, 768, 1024, 1280, and 1440px widths; 200% zoom; keyboard-only navigation; screen-reader status messages; forced-colors; reduced-motion; offline banner; loading/empty/retry/error states; dialog Escape/focus restoration.

## Security checks

Verify no server secret appears in the browser bundle, answer payloads never reach learner selection APIs, local state is cleared/isolate on logout, every provider can be disabled, and idempotency prevents duplicate quiz/focus/XP/receipt/calendar mutations.
