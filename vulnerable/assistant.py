"""VULNERABLE rule-based customer-support assistant.

The "model" builds one big prompt from the retrieved policy documents plus
the user question, then executes any `TOOL: name(args)` directive it finds
ANYWHERE in that prompt -- including inside the retrieved documents.
That is the indirect prompt injection: a poisoned policy document makes the
assistant call tools without authorization.
"""
import os
import re
from pathlib import Path

import tools  # sibling module (same directory)

DATA = Path(os.environ.get("SAMPLE_DATA_DIR", Path(__file__).resolve().parent.parent / "sample-data"))


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


def chat(question):
    docs = load_docs()
    names = retrieve(question, docs)
    context = "\n\n".join(docs[n] for n in names)
    prompt = (
        "You are ShopDemo's support assistant. Answer using the policy documents.\n\n"
        f"{context}\n\n"
        f"Customer question: {question}"
    )

    # VULNERABLE: directives are parsed from the whole prompt, documents included.
    calls = []
    for m in re.finditer(r"TOOL:\s*(\w+)\(([^)]*)\)", prompt):
        args = dict(re.findall(r"(\w+)=([^,]+)", m.group(2)))
        result = tools.call(m.group(1), args)
        calls.append({"tool": m.group(1), "args": args, "result": result})

    answer = context  # naive extractive answer: echo the retrieved document text
    if calls:
        answer += "\n\n" + "\n".join(f"{c['tool']} -> {c['result']}" for c in calls)
    return {"answer": answer, "docs_used": names, "tool_calls": calls}
