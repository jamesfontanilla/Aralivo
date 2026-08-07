# API contract

All API errors use:

```json
{
  "code": "CONTENT_UNAVAILABLE",
  "message": "This learning content is temporarily unavailable.",
  "request_id": "request-id",
  "retriable": true,
  "field_errors": {}
}
```

Implemented endpoints:

- `GET /api/health`
- `GET /api/v1/config`
- `POST /api/v1/assessments/select`
- `POST /api/v1/assessments/submit`
- `POST /api/v1/focus/complete`
- `POST /api/v1/receipts/preview`
- `GET /api/v1/receipts`
- `POST /api/v1/receipts/issue`
- `POST /api/v1/content/validate/lesson`
- `POST /api/v1/content/validate/questions`

Assessment selection returns safe learner fields only. Submissions, focus completion, XP, receipt issuance, calendar creation, and offline mutations must carry idempotency keys. Retries return the existing result. Receipt issuance stores the readable record privately and anchors only its SHA-256 hash in a server-controlled Stellar account data entry.
