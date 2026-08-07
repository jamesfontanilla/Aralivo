# Environment variable inventory

| Variable | Classification | Purpose | Browser safe | Where |
|---|---|---|---|---|
| `VITE_APP_URL` | public browser configuration | App origin | yes | Vercel browser |
| `VITE_API_URL` | public browser configuration | API origin | yes | Vercel browser |
| `VITE_SUPABASE_URL` | public browser configuration | Supabase client URL | yes | Vercel browser |
| `VITE_SUPABASE_ANON_KEY` | public browser configuration | Supabase publishable key | yes | Vercel browser |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | core server config | API/Auth configuration | no | Vercel server |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only secret | Admin operations only | no | Vercel server |
| `SUPABASE_DB_URL` / `DATABASE_URL` | server-only secret | Alembic/Postgres | no | Vercel server |
| `SUPABASE_JWT_ISSUER`, `SUPABASE_JWT_AUDIENCE` | core server config | JWT verification | no | Vercel server |
| `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, template IDs, `BREVO_REPLY_TO_EMAIL` | feature-only server secret/config | Transactional verification/reset email | no | Vercel server |
| `GOOGLE_CLIENT_ID` | feature-only config | Google identity/Calendar OAuth | no | Vercel server |
| `GOOGLE_CLIENT_SECRET`, `GOOGLE_OAUTH_STATE_SECRET` | feature-only server secrets | OAuth callbacks and state | no | Vercel server |
| `GOOGLE_SIGNIN_REDIRECT_URI`, `GOOGLE_CALENDAR_REDIRECT_URI`, `GOOGLE_CALENDAR_SCOPES` | feature-only config | Separate OAuth flows | no | Vercel server |
| `AI_PROVIDER`, `AI_API_BASE_URL`, `AI_MODEL`, timeout/context settings, `AI_FEATURE_ENABLED` | feature-only config | OpenAI-compatible adapter | no | Vercel server |
| `AI_API_KEY` | feature-only server secret | AI provider credential | no | Vercel server |
| `STELLAR_NETWORK`, passphrase, RPC/Horizon URLs, issuer public key, timeout, feature flag | feature-only config | Testnet-first receipt adapter; hash anchored in Stellar account data | no | Vercel server |
| `STELLAR_ISSUER_SECRET_KEY` | feature-only server secret | Dedicated server receipt signer | no | Vercel server |
| `OPEN_LIBRARY_BASE_URL`, `OPEN_LIBRARY_USER_AGENT` | feature-only config | Low-volume book metadata | no key required | Vercel server |
| `OPENALEX_API_KEY`, `OPENALEX_MAILTO` | feature-only server config | Scholarly metadata; key required by current docs | no | Vercel server |
| `NAGER_HOLIDAYS_BASE_URL`, `OPEN_METEO_BASE_URL` | feature-only config | Optional planning context/weather | no key required | Vercel server |
| `APP_ENCRYPTION_KEY`, `APP_SIGNING_SECRET`, `CRON_SECRET` | server-only secrets | Encryption, signing, scheduled jobs | no | Vercel server |
| `CORS_ORIGINS`, `COOKIE_DOMAIN`, `COOKIE_SECURE` | core server config | Browser security | no | Vercel server |
| `SENTRY_DSN` | optional feature config | Error monitoring | no | Vercel server |

Use `.env.example` as the complete starter inventory. Obtain Supabase credentials from the Supabase project settings, Brevo keys/templates from Brevo transactional settings, Google values from Google Cloud OAuth credentials, OpenAlex keys from OpenAlex settings, and Stellar values from the selected network/contract deployment. Never prefix a privileged secret with `VITE_`.
