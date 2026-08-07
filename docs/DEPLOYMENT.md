# Deployment

## Supabase

1. Create a Supabase project and enable email/password auth.
2. Configure verification and reset redirect URLs to `/verify-email` and `/reset-password`.
3. Configure Google provider with identity scopes only: `openid email profile`.
4. Run `alembic upgrade head` against `SUPABASE_DB_URL`.
5. Review and extend the generated RLS policies so every user-owned row is constrained by `auth.uid()`.

## Brevo

This scaffold chooses one architecture: Supabase Auth generates secure verification/reset links; Brevo is the transactional delivery provider. Configure the Supabase SMTP/provider integration to send those messages. Do not also call an Admin API link generator or a second mail sender for the same event.

## Google Calendar

Register a separate callback and explicit consent flow. Request only `calendar.events` (or the smallest scope your event behavior permits). Encrypt refresh tokens server-side, handle 429s with backoff, use idempotency keys, and keep `.ics` export available.

## Stellar/Soroban

Create and fund a dedicated issuer account on testnet first. Aralivo anchors the receipt hash in a Stellar account data entry, so no Soroban contract is required for the first production-safe receipt path. Keep `STELLAR_ISSUER_SECRET_KEY` server-only, expose only verification metadata, and make receipt issuance opt-in and non-blocking.

## Vercel

Import the repository, set the public `VITE_` variables for the browser and all other variables as server-only project secrets, run `npm run build`, and use `vercel.json` rewrites. FastAPI is exported from `api/index.py`. Do not add a long-running backend process or Render configuration.

## Known limitations

The current UI uses a local demo auth flag and static product fixtures so it runs without credentials. Replacing those with Supabase repositories/auth middleware, complete RLS policies, real provider SDK calls, and browser E2E adapters is the next production-hardening pass.
