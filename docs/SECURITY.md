# Security

- Supabase Auth handles email/password, verification, reset, Google OAuth, and session refresh.
- Backend mutations require a verified session, CSRF protection where cookie mutations are used, strict CORS, rate limits, and secure HTTP-only same-site cookies.
- JWTs are verified server-side; ownership is checked in every repository method and reinforced with Supabase RLS.
- No logs contain passwords, tokens, reset URLs, OAuth codes, private notes, question answers, grades, AI prompts, or Stellar keys.
- Refresh tokens for Google Calendar are encrypted server-side and never enter local storage or browser cookies.
- `answer_payload` is stored server-side separately from `learner_payload`.
- Account deletion requires re-authentication and a typed confirmation.

The current UI uses a local demo auth flag to make the scaffold inspectable. Replace it with Supabase session handling before production.
