# Aralivo

Aralivo is a private, free-first college learning workspace. This greenfield scaffold includes a responsive React/Vite product shell, a Vercel-compatible FastAPI API, explicit Alembic migrations, content validation contracts, provider adapters, and focused tests.

## Local development

```powershell
pnpm install
pnpm run dev
```

In a second terminal:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r api/requirements.txt
uvicorn api.app:app --reload --port 8000
```

Run quality checks:

```powershell
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
pytest -q
python scripts/validate_content.py
```

The UI uses local demo state until Supabase is configured. This keeps the learning loop inspectable without requiring external credentials. Provider integrations are optional adapters; they do not block study, practice, focus, planner, or `.ics` export.

## Product boundaries

- No paid plans, billing, subscriptions, checkout, paywalls, or public leaderboards.
- Learning receipts are opt-in learning records, never official credentials.
- The `data/seed/lessons/` and `data/seed/questions/` directories intentionally contain no concrete lesson or question content.
- No Render deployment configuration is included.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md), and [docs/TEST_PLAN.md](docs/TEST_PLAN.md) for the implementation boundary and setup details.
