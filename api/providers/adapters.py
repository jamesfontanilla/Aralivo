from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


class ProviderUnavailable(Exception):
    pass


class EmailProvider(Protocol):
    def send_template(self, recipient: str, template_id: str, params: dict) -> str: ...


class CalendarProvider(Protocol):
    def create_event(self, access_token: str, event: dict, idempotency_key: str) -> str: ...


@dataclass
class MockEmailProvider:
    sent: list[dict]

    def send_template(self, recipient: str, template_id: str, params: dict) -> str:
        self.sent.append({"recipient": recipient, "template_id": template_id, "params": params})
        return "mock-message-id"


@dataclass
class MockCalendarProvider:
    events: dict[str, dict]

    def create_event(self, access_token: str, event: dict, idempotency_key: str) -> str:
        if idempotency_key in self.events:
            return self.events[idempotency_key]["id"]
        event_id = f"mock-event-{len(self.events) + 1}"
        self.events[idempotency_key] = {"id": event_id, **event}
        return event_id
