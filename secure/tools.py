"""Tool layer of the SECURE demo backend (same fictional data, hardened).

Defenses implemented here:
- ALLOWED_TOOLS allowlist: nothing outside it can ever run.
- issue_refund validates the order (exists, delivered, not already refunded)
  and caps the amount.
- lookup_order / get_customer_profile never return PII (email, phone,
  address, customer_id linkage).
"""
import json
import os
from pathlib import Path

DATA = Path(os.environ.get("SAMPLE_DATA_DIR", Path(__file__).resolve().parent.parent / "sample-data"))
DB = DATA / "db"

ALLOWED_TOOLS = {"lookup_order", "issue_refund", "get_customer_profile"}
MAX_REFUND = 500.00


def _load(name):
    return json.loads((DB / name).read_text())


def _save(name, obj):
    (DB / name).write_text(json.dumps(obj, indent=2))


def _refunds():
    return _load("refunds.json") if (DB / "refunds.json").exists() else []


def call(name, args):
    """Allowlist gate: only known tools, and each validates its own input."""
    if name not in ALLOWED_TOOLS:
        return f"tool not allowed: {name}"
    if name == "lookup_order":
        return lookup_order(args.get("order_id"))
    if name == "issue_refund":
        return issue_refund(args.get("order_id"))
    if name == "get_customer_profile":
        return get_customer_profile(args.get("customer_id"))


def lookup_order(order_id):
    order = _load("orders.json").get(order_id)
    if not order:
        return "order not found"
    # Safe fields only: no customer_id, no payment data.
    return {"order_id": order_id, "status": order["status"], "items": order["items"]}


def issue_refund(order_id):
    order = _load("orders.json").get(order_id)
    if not order:
        return f"refund refused: unknown order {order_id}"
    if order["status"] != "delivered":
        return f"refund refused: {order_id} has not been delivered"
    if any(r["order_id"] == order_id for r in _refunds()):
        return f"refund refused: {order_id} was already refunded"
    amount = min(order["total"], MAX_REFUND)
    refunds = _refunds() + [{"order_id": order_id, "amount": amount}]
    _save("refunds.json", refunds)
    return f"refund issued: {amount} for {order_id}"


def get_customer_profile(customer_id):
    customer = _load("customers.json").get(customer_id)
    if not customer:
        return "customer not found"
    # PII redacted: email, phone and address are never returned to the chat.
    return {"name": customer["name"], "loyalty_tier": customer["loyalty_tier"]}
