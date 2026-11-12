"""Tool layer of the VULNERABLE demo backend (cybersecurity class simulation).

All data is fictional and local. No allowlist and no validation: any tool
can be invoked with any arguments. `get_customer_profile` returns full PII;
`issue_refund` moves money blindly.
"""
import json
import os
from pathlib import Path

DATA = Path(os.environ.get("SAMPLE_DATA_DIR", Path(__file__).resolve().parent.parent / "sample-data"))
DB = DATA / "db"


def _load(name):
    return json.loads((DB / name).read_text())


def _save(name, obj):
    (DB / name).write_text(json.dumps(obj, indent=2))


def call(name, args):
    """Dispatch any tool by name with unvalidated arguments."""
    if name == "lookup_order":
        return _load("orders.json").get(args.get("order_id"), "order not found")
    if name == "issue_refund":
        refunds = _load("refunds.json") if (DB / "refunds.json").exists() else []
        refund = {"order_id": args.get("order_id"), "amount": float(args.get("amount", 0))}
        refunds.append(refund)
        _save("refunds.json", refunds)
        return f"REFUND ISSUED: {refund['amount']} for {refund['order_id']}"
    if name == "get_customer_profile":
        return _load("customers.json").get(args.get("customer_id"), "customer not found")
    return f"unknown tool: {name}"
