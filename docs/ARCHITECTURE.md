# Architecture

## Runtime

- React + TypeScript + Vite frontend with React Router routes.
- FastAPI serverless-compatible API exposed from `api/index.py` as `app`.
- Supabase Auth for identity and Supabase Postgres for persistence.
- Alembic migrations in `alembic/`; production must run migrations explicitly.
- `vercel.json` rewrites `/api/*` to the Python function and all other app routes to the SPA entry.

The current scaffold keeps the Vite app at the workspace root so it runs as one package; `web/` is the intended extraction boundary.

## Domain boundaries

`api/services/assessment.py` owns assessment sizing and seeded selection. `api/services/xp.py` owns idempotent awards. `api/services/receipts.py` owns the privacy-safe receipt allowlist and hash. `api/content/validators.py` owns editorial validation. `api/providers/` exposes small protocols and mocks so optional providers can be disabled.

## Security boundaries

Supabase JWT verification and repository ownership checks belong at the API edge and repository layer. Service-role credentials, Google refresh tokens, Brevo keys, AI keys, Stellar secrets, and encryption keys are server-only. Learner APIs never return answer payloads.

## Background work

Provider calls should be short-lived, cached, retryable with backoff, and invoked through Vercel-compatible requests or scheduled functions. No feature depends on a resident worker.
