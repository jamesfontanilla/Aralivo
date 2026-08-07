# Audit environment

- Date: 2026-08-07, Asia/Manila.
- Local dev: `http://127.0.0.1:5173/`.
- Production preview: `http://127.0.0.1:4173/`.
- Browser: Codex in-app Chromium only. Firefox was not available in the browser inventory.
- Test data: disposable `qa-learner@example.invalid`, `QA Term 2026`, `Manual QA Subject`, and `QA private note`.
- No real learner, email, provider, calendar, or payment data was used.
- Vercel preview was not available from the workspace.
- The browser harness exposed viewport controls but not network throttling/failure or reduced-motion emulation. Those checks are marked not executable in the report rather than inferred as passes.
- Browser trace/video capture was not exposed by the available harness. Screenshots, DOM observations, and machine-readable action results are stored beside this file.
