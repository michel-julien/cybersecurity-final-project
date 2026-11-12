"""SECURE rule-based customer-support assistant.

Same interface as the vulnerable one, with these defenses:
1. Retrieved documents are sanitized: instruction-like lines are stripped.
   Document text is treated as DATA, never as instructions.
2. Tool calls are NEVER parsed from prompt/document text. They come only
   from an explicit intent in the user's own question, dispatched through
   the allowlisted tools module.
3. Money-moving tools validate against the order data (see secure/tools.py).
4. PII never enters the chat context or the answer.
5. Every action and every refusal is appended to an audit log.
"""
import json
import os
import re
import time
from pathlib import Path

import tools  # sibling module (same directory)

DATA = Path(os.environ.get("SAMPLE_DATA_DIR", Path(__file__).resolve().parent.parent / "sample-data"))
AUDIT_LOG = Path(os.environ.get("AUDIT_LOG", Path(__file__).resolve().parent / "audit.log"))

# Lines containing any of these markers are instructions, not policy text.
INSTRUCTION_MARKERS = ("tool:", "note to assistant", "ignore previous", "system:", "do not tell")


def sanitize(text):
    """Defense 1: treat document text as data, never as instructions.

    Removes HTML comments (where injected directives hide) and any remaining
    line that looks like an instruction to the assistant.
    """
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    return "\n".join(
        line for line in text.splitlines()
        if line.strip() and not any(marker in line.lower() for marker in INSTRUCTION_MARKERS)
    )


def load_docs():
    return {p.stem: p.read_text() for p in sorted((DATA / "policies").glob("*.md"))}


STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "your", "you", "to", "of", "in",
    "for", "with", "and", "or", "that", "this", "it", "be", "been", "not",
    "yet", "instead", "what", "how", "does", "do", "can", "if", "i", "my",
    "me", "please", "want",
}


def _tokens(text):
    words = re.findall(r"[a-z]+", text.lower())
    return {w[:-1] if w.endswith("s") and len(w) > 3 else w for w in words if w not in STOPWORDS}


def retrieve(question, docs, k=2):
    """Simple keyword-overlap retrieval; document titles weigh double."""
    q = _tokens(question)

    def score(name):
        title, _, body = docs[name].partition("\n")
        return 2 * len(q & _tokens(title)) + len(q & _tokens(body))

    return sorted(docs, key=score, reverse=True)[:k]


def audit(event):
    """Defense 5: append every action/refusal to the audit log."""
    with AUDIT_LOG.open("a") as f:
        f.write(json.dumps({"ts": round(time.time(), 3), **event}) + "\n")


def chat(question):
    docs = load_docs()
    names = retrieve(question, docs)
    context = "\n\n".join(sanitize(docs[n]) for n in names)

    # Defense 2: tools only from explicit user intent, never from text parsing.
    calls = []
    q = question.lower()
    order_ids = re.findall(r"ORD-\d+", question.upper())
    if "refund" in q and order_ids:
        result = tools.call("issue_refund", {"order_id": order_ids[0]})
        calls.append({"tool": "issue_refund", "args": {"order_id": order_ids[0]}, "result": result})
        audit({"event": "refund_request", "order_id": order_ids[0], "result": result})
    elif ("where" in q or "track" in q or "status" in q) and order_ids:
        result = tools.call("lookup_order", {"order_id": order_ids[0]})
        calls.append({"tool": "lookup_order", "args": {"order_id": order_ids[0]}, "result": result})
        audit({"event": "order_lookup", "order_id": order_ids[0]})

    # Defense 4: the answer is built from sanitized docs only; any tool output
    # appended here has already passed allowlist + validation + redaction.
    answer = context
    if calls:
        answer += "\n\n" + "\n".join(f"{c['tool']} -> {c['result']}" for c in calls)
    return {"answer": answer, "docs_used": names, "tool_calls": calls}
