# Static and build evidence

Captured 2026-08-07 from the local workspace.

- `pnpm.cmd test`: PASS — 1 test file, 1 test.
- `pnpm.cmd lint`: PASS.
- `pnpm.cmd typecheck`: PASS.
- Production preview served `http://127.0.0.1:4173/`: HTTP 200.
- Local dev entry `http://127.0.0.1:5173/`: HTTP 200, but the Chromium page rendered blank.
- Client secret scan over `dist` for `SUPABASE_SERVICE_ROLE_KEY`, `STELLAR_ISSUER_SECRET_KEY`, `BREVO_API_KEY`, `AI_API_KEY`, and `APP_ENCRYPTION_KEY`: `NO_MATCHES`.
- Answer/private-data scan over `dist` for `correct_answer`, `answer_key`, `private_note`, and `service_role`: `NO_MATCHES`.
- Preview asset sizes: `index-LJNF29NZ.js` 268,302 bytes; `index-VYkXsFCi.css` 49,090 bytes.
- No Vercel preview URL or configured workspace hosting manifest was available in this checkout.

The static checks pass, but they do not compensate for the runtime and workflow failures recorded in the browser evidence.
