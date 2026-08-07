from __future__ import annotations

from typing import Any
from urllib.parse import quote
import os

import httpx


class ReceiptStoreError(RuntimeError):
    pass


def _config() -> tuple[str, str] | None:
    base_url = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not base_url or not service_key:
        return None
    return f"{base_url}/rest/v1/learning_receipts", service_key


def is_receipt_store_ready() -> bool:
    return _config() is not None


def _headers(service_key: str, prefer: str | None = None) -> dict[str, str]:
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    return headers


async def _request(method: str, url: str, service_key: str, **kwargs: Any) -> list[dict[str, Any]]:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.request(method, url, headers=_headers(service_key, kwargs.pop("prefer", None)), **kwargs)
    except httpx.HTTPError as exc:
        raise ReceiptStoreError("Receipt storage is unavailable.") from exc
    if response.status_code >= 400:
        raise ReceiptStoreError("Receipt storage rejected the request.")
    if not response.content:
        return []
    value = response.json()
    return value if isinstance(value, list) else [value]


async def find_by_idempotency(user_id: str, idempotency_key: str) -> dict[str, Any] | None:
    configured = _config()
    if not configured:
        raise ReceiptStoreError("Receipt storage is not configured.")
    url, service_key = configured
    rows = await _request(
        "GET",
        f"{url}?select=*&user_id=eq.{quote(user_id)}&idempotency_key=eq.{quote(idempotency_key)}&limit=1",
        service_key,
    )
    return rows[0] if rows else None


async def find_by_hash(user_id: str, payload_hash: str) -> dict[str, Any] | None:
    configured = _config()
    if not configured:
        raise ReceiptStoreError("Receipt storage is not configured.")
    url, service_key = configured
    rows = await _request(
        "GET",
        f"{url}?select=*&user_id=eq.{quote(user_id)}&payload_hash=eq.{quote(payload_hash)}&limit=1",
        service_key,
    )
    return rows[0] if rows else None


async def list_for_user(user_id: str) -> list[dict[str, Any]]:
    configured = _config()
    if not configured:
        raise ReceiptStoreError("Receipt storage is not configured.")
    url, service_key = configured
    return await _request(
        "GET",
        f"{url}?select=id,payload_hash,content_identifier,achievement_type,completed_at,issuer_public_key,content_version,network,transaction_hash,verification_url,status,created_at&user_id=eq.{quote(user_id)}&order=created_at.desc",
        service_key,
    )


async def create_pending(row: dict[str, Any]) -> dict[str, Any]:
    configured = _config()
    if not configured:
        raise ReceiptStoreError("Receipt storage is not configured.")
    url, service_key = configured
    rows = await _request(
        "POST",
        url,
        service_key,
        json=row,
        prefer="return=representation,resolution=ignore-duplicates",
    )
    if rows:
        return rows[0]
    existing = await find_by_idempotency(str(row["user_id"]), str(row["idempotency_key"]))
    if existing:
        return existing
    raise ReceiptStoreError("Receipt storage did not return the pending receipt.")


async def mark_issued(receipt_id: str, anchor: dict[str, str]) -> dict[str, Any]:
    configured = _config()
    if not configured:
        raise ReceiptStoreError("Receipt storage is not configured.")
    url, service_key = configured
    rows = await _request(
        "PATCH",
        f"{url}?id=eq.{quote(receipt_id)}",
        service_key,
        json={
            "status": "issued",
            "transaction_hash": anchor["transaction_hash"],
            "verification_url": anchor["verification_url"],
        },
        prefer="return=representation",
    )
    return rows[0] if rows else {"id": receipt_id, **anchor, "status": "issued"}


async def mark_failed(receipt_id: str) -> None:
    configured = _config()
    if not configured:
        return
    url, service_key = configured
    await _request(
        "PATCH",
        f"{url}?id=eq.{quote(receipt_id)}",
        service_key,
        json={"status": "failed"},
        prefer="return=minimal",
    )
