from __future__ import annotations

from dataclasses import dataclass
import os


class StellarReceiptError(RuntimeError):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass(frozen=True)
class StellarReceiptConfig:
    enabled: bool
    network: str
    network_passphrase: str
    horizon_url: str
    issuer_public_key: str
    issuer_secret_key: str
    timeout_seconds: int


def _truthy(value: str | None) -> bool:
    return (value or "").strip().lower() in {"1", "true", "yes", "on"}


def get_stellar_config() -> StellarReceiptConfig:
    network = os.getenv("STELLAR_NETWORK", "testnet").strip().lower()
    if network not in {"testnet", "public"}:
        network = "testnet"
    default_passphrase = (
        "Test SDF Network ; September 2015"
        if network == "testnet"
        else "Public Global Stellar Network ; September 2015"
    )
    default_horizon = (
        "https://horizon-testnet.stellar.org"
        if network == "testnet"
        else "https://horizon.stellar.org"
    )
    return StellarReceiptConfig(
        enabled=_truthy(os.getenv("STELLAR_FEATURE_ENABLED")),
        network=network,
        network_passphrase=os.getenv("STELLAR_NETWORK_PASSPHRASE", default_passphrase),
        horizon_url=os.getenv("STELLAR_HORIZON_URL", default_horizon).rstrip("/"),
        issuer_public_key=os.getenv("STELLAR_ISSUER_PUBLIC_KEY", "").strip(),
        issuer_secret_key=os.getenv("STELLAR_ISSUER_SECRET_KEY", "").strip(),
        timeout_seconds=max(5, int(os.getenv("STELLAR_TRANSACTION_TIMEOUT_SECONDS", "30"))),
    )


def is_stellar_ready() -> bool:
    config = get_stellar_config()
    return config.enabled and bool(config.issuer_secret_key)


def _explorer_url(network: str, transaction_hash: str) -> str:
    explorer_network = "testnet" if network == "testnet" else "public"
    return f"https://stellar.expert/explorer/{explorer_network}/tx/{transaction_hash}"


def issue_receipt_anchor(payload_hash: str) -> dict[str, str]:
    """Anchor a receipt hash in an issuer account's Stellar data entry.

    The full receipt payload stays in Aralivo's private database. Stellar stores
    only the deterministic hash, so anyone can verify the published hash without
    learning the learner's identity, answers, notes, or school records.
    """
    config = get_stellar_config()
    if not config.enabled:
        raise StellarReceiptError("STELLAR_DISABLED", "Stellar receipts are disabled on this deployment.")
    if not config.issuer_secret_key:
        raise StellarReceiptError("STELLAR_NOT_CONFIGURED", "The Stellar issuer account is not configured yet.")

    try:
        from stellar_sdk import Keypair, Network, Server, TransactionBuilder
    except ImportError as exc:
        raise StellarReceiptError("STELLAR_SDK_MISSING", "The Stellar server adapter is unavailable.") from exc

    try:
        keypair = Keypair.from_secret(config.issuer_secret_key)
        issuer_public_key = keypair.public_key
        if config.issuer_public_key and config.issuer_public_key != issuer_public_key:
            raise StellarReceiptError("STELLAR_KEY_MISMATCH", "The Stellar issuer keys do not match.")
        server = Server(config.horizon_url)
        account = server.load_account(issuer_public_key)
        data_name = f"aralivo:receipt:{payload_hash[:48]}"
        transaction = (
            TransactionBuilder(
                source_account=account,
                network_passphrase=config.network_passphrase
                or (
                    Network.TESTNET_NETWORK_PASSPHRASE
                    if config.network == "testnet"
                    else Network.PUBLIC_NETWORK_PASSPHRASE
                ),
                base_fee=100,
            )
            .append_manage_data_op(data_name=data_name, data_value=payload_hash.encode("ascii"))
            .set_timeout(config.timeout_seconds)
            .build()
        )
        transaction.sign(keypair)
        response = server.submit_transaction(transaction)
        transaction_hash = str(response["hash"])
        return {
            "transaction_hash": transaction_hash,
            "verification_url": _explorer_url(config.network, transaction_hash),
            "network": config.network,
            "issuer_public_key": issuer_public_key,
            "anchor_mode": "stellar_account_data",
        }
    except StellarReceiptError:
        raise
    except Exception as exc:  # Horizon errors differ by SDK version; keep the API envelope stable.
        raise StellarReceiptError("STELLAR_SUBMISSION_FAILED", "Stellar could not anchor this receipt yet.") from exc
