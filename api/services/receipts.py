from __future__ import annotations

import hashlib
import json
from datetime import datetime


PUBLIC_RECEIPT_FIELDS = {
    "schema_version",
    "pseudonymous_learner_id",
    "milestone_scope",
    "content_identifier",
    "achievement_type",
    "completed_at",
    "issuer_public_key",
    "content_version",
    "network",
}


def build_receipt_payload(data: dict) -> dict:
    completed_at = data["completed_at"]
    if isinstance(completed_at, datetime):
        completed_at = completed_at.isoformat()
    payload = {
        "schema_version": data.get("schema_version", "1"),
        "pseudonymous_learner_id": hashlib.sha256(data["learner_identifier"].encode()).hexdigest()[:24],
        "content_identifier": data["content_identifier"],
        "achievement_type": data["achievement_type"],
        "completed_at": completed_at,
        "issuer_public_key": data["issuer_public_key"],
        "content_version": data["content_version"],
        "network": data.get("network", "testnet"),
    }
    if data.get("milestone_scope"):
        payload["milestone_scope"] = data["milestone_scope"]
    return payload


def hash_receipt_payload(payload: dict) -> str:
    safe = {key: payload[key] for key in sorted(payload) if key in PUBLIC_RECEIPT_FIELDS}
    return hashlib.sha256(json.dumps(safe, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
