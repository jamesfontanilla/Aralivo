from dataclasses import dataclass, field


@dataclass
class XpEvent:
    idempotency_key: str
    amount: int
    reason: str


@dataclass
class XpLedger:
    events: dict[str, XpEvent] = field(default_factory=dict)

    def award(self, idempotency_key: str, amount: int, reason: str) -> int:
        if idempotency_key in self.events or amount <= 0:
            return 0
        self.events[idempotency_key] = XpEvent(idempotency_key, amount, reason)
        return amount

    @property
    def total(self) -> int:
        return sum(event.amount for event in self.events.values())
