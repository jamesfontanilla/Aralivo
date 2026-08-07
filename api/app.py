from __future__ import annotations

from datetime import datetime, timezone
import os
from uuid import uuid4

from fastapi import FastAPI, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from api.content.validators import validate_lesson_markdown, validate_question_bank
from api.services.assessment import AssessmentScope, AssessmentSelectionError, select_questions
from api.services.receipts import build_receipt_payload, hash_receipt_payload
from api.services.xp import XpLedger


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime


class ErrorEnvelope(BaseModel):
    code: str
    message: str
    request_id: str
    retriable: bool = False
    field_errors: dict[str, list[str]] = Field(default_factory=dict)


class QuizSelectionRequest(BaseModel):
    scope: AssessmentScope
    question_bank: dict
    outcome_ids: list[str] = Field(min_length=1)
    recently_seen_ids: list[str] = Field(default_factory=list)
    seed: int = Field(ge=0)


class QuizSubmissionRequest(BaseModel):
    attempt_id: str
    question_id: str
    answer: object
    idempotency_key: str = Field(min_length=8)


class FocusCompletionRequest(BaseModel):
    session_id: str
    elapsed_seconds: int = Field(ge=0)
    state: str
    idempotency_key: str = Field(min_length=8)


class ReceiptRequest(BaseModel):
    learner_identifier: str
    content_identifier: str
    achievement_type: str
    completed_at: datetime
    issuer_public_key: str
    content_version: str
    network: str = "testnet"


app = FastAPI(title="Aralivo API", version="0.1.0")
cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,https://aralivo.vercel.app").split(",") if origin.strip()]
app.add_middleware(CORSMiddleware, allow_origins=cors_origins, allow_credentials=True, allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"], allow_headers=["Authorization", "Content-Type", "X-CSRF-Token", "Idempotency-Key", "X-Request-Id"])
ledger = XpLedger()
seen_mutations: set[str] = set()


def request_id() -> str:
    return f"req_{uuid4().hex[:16]}"


def error_response(request_id_value: str, code: str, message: str, retriable: bool = False) -> JSONResponse:
    payload = ErrorEnvelope(code=code, message=message, request_id=request_id_value, retriable=retriable)
    return JSONResponse(status_code=400 if code != "UNAUTHORIZED" else 401, content=payload.model_dump(mode="json"))


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    rid = request.headers.get("X-Request-Id", request_id())
    response = await call_next(request)
    response.headers["X-Request-Id"] = rid
    response.headers["Cache-Control"] = "no-store" if request.url.path.startswith("/api/") else response.headers.get("Cache-Control", "public, max-age=3600")
    return response


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", service="aralivo-api", timestamp=datetime.now(timezone.utc))


@app.get("/api/v1/config")
async def public_config() -> dict:
    return {
        "ai_enabled": False,
        "stellar_enabled": False,
        "calendar_enabled": False,
        "email_delivery": "supabase-auth",
        "auth_enabled": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_ANON_KEY")),
    }


async def require_user(authorization: str | None) -> dict | None:
    """Validate the access token against Supabase Auth without trusting its claims locally."""
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    supabase_url = os.getenv("SUPABASE_URL")
    anon_key = os.getenv("SUPABASE_ANON_KEY")
    if not supabase_url or not anon_key:
        return None
    import httpx

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{supabase_url.rstrip('/')}/auth/v1/user",
                headers={"apikey": anon_key, "Authorization": f"Bearer {token}"},
            )
        if response.status_code != 200:
            return None
        user = response.json()
        return user if isinstance(user, dict) and user.get("id") else None
    except (httpx.HTTPError, ValueError):
        return None


@app.post("/api/v1/assessments/select")
async def assessment_selection(payload: QuizSelectionRequest, request: Request):
    rid = request.headers.get("X-Request-Id", request_id())
    try:
        selected = select_questions(payload.question_bank, payload.scope, payload.outcome_ids, payload.recently_seen_ids, payload.seed)
    except AssessmentSelectionError as exc:
        return error_response(rid, "QUESTION_POOL_INSUFFICIENT", str(exc))
    safe_questions = [{key: item[key] for key in ("id", "type", "prompt", "options", "skill", "outcome_id", "difficulty") if key in item} for item in selected]
    return {"attempt_id": f"attempt_{uuid4().hex}", "scope": payload.scope.value, "seed": payload.seed, "questions": safe_questions}


@app.post("/api/v1/assessments/submit")
async def assessment_submit(payload: QuizSubmissionRequest, request: Request, authorization: str | None = Header(default=None)):
    if not await require_user(authorization):
        return error_response(request.headers.get("X-Request-Id", request_id()), "UNAUTHORIZED", "Sign in to submit practice.")
    if payload.idempotency_key in seen_mutations:
        return {"status": "already_processed", "idempotency_key": payload.idempotency_key}
    seen_mutations.add(payload.idempotency_key)
    return {"status": "recorded", "question_id": payload.question_id, "feedback": {"correct": True, "explanation": "Your reasoning tracks the lesson idea. Keep noticing who had a chance to be included.", "next_action": "Continue to the next question."}}


@app.post("/api/v1/focus/complete")
async def complete_focus(payload: FocusCompletionRequest, request: Request, authorization: str | None = Header(default=None)):
    if not await require_user(authorization):
        return error_response(request.headers.get("X-Request-Id", request_id()), "UNAUTHORIZED", "Sign in to sync focus sessions.")
    if payload.idempotency_key in seen_mutations:
        return {"status": "already_processed", "session_id": payload.session_id, "xp_awarded": 0}
    seen_mutations.add(payload.idempotency_key)
    xp = ledger.award(payload.session_id, 25 if payload.state == "completed" else 10, "focus_session")
    return {"status": "synced", "session_id": payload.session_id, "xp_awarded": xp}


@app.post("/api/v1/receipts/preview")
async def receipt_preview(payload: ReceiptRequest, request: Request, authorization: str | None = Header(default=None)):
    if not await require_user(authorization):
        return error_response(request.headers.get("X-Request-Id", request_id()), "UNAUTHORIZED", "Sign in to preview a receipt.")
    receipt = build_receipt_payload(payload.model_dump())
    return {"payload": receipt, "payload_hash": hash_receipt_payload(receipt), "public_fields": list(receipt)}


@app.post("/api/v1/content/validate/lesson")
async def validate_lesson(body: dict):
    issues = validate_lesson_markdown(body.get("markdown", ""))
    return {"valid": not issues, "issues": [issue.model_dump() for issue in issues]}


@app.post("/api/v1/content/validate/questions")
async def validate_questions(body: dict):
    issues = validate_question_bank(body.get("question_bank", {}))
    return {"valid": not issues, "issues": [issue.model_dump() for issue in issues]}
