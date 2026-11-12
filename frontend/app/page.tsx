"use client";

import { useState } from "react";

type ToolCall = { tool: string; args: Record<string, string>; result: unknown };
type Message = { role: "user" | "assistant"; text: string; toolCalls?: ToolCall[] };

const BACKENDS = {
  vulnerable: "http://localhost:5001",
  secure: "http://localhost:5002",
} as const;

const SAMPLES = [
  "How long does delivery take?",
  "What is your refund policy?",
  "I want a refund for order ORD-1002",
];

export default function Home() {
  const [backend, setBackend] = useState<keyof typeof BACKENDS>("vulnerable");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(question: string) {
    if (!question.trim() || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    try {
      const res = await fetch(`${BACKENDS[backend]}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer ?? JSON.stringify(data), toolCalls: data.tool_calls },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Backend ${BACKENDS[backend]} unreachable — start it first (see README).` },
      ]);
    }
    setBusy(false);
  }

  return (
    <main className="flex h-dvh flex-col items-center overflow-hidden bg-zinc-50 font-sans dark:bg-black">
      <div className="flex h-full w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
            ShopDemo Support Assistant <span className="text-sm font-normal text-zinc-500">(fictional data, local demo)</span>
          </h1>
          <div className="flex rounded-full border border-zinc-300 p-1 dark:border-zinc-700">
            {(Object.keys(BACKENDS) as (keyof typeof BACKENDS)[]).map((b) => (
              <button
                key={b}
                onClick={() => setBackend(b)}
                className={`rounded-full px-4 py-1 text-sm font-medium capitalize transition-colors ${
                  backend === b
                    ? b === "vulnerable"
                      ? "bg-red-600 text-white"
                      : "bg-green-700 text-white"
                    : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {b} :{b === "vulnerable" ? 5001 : 5002}
              </button>
            ))}
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          {messages.length === 0 && (
            <p className="text-sm text-zinc-400">
              Ask a question. Try the delivery question on both backends and compare the tool calls.
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "self-end" : "self-start max-w-[90%]"}>
              <div
                className={`whitespace-pre-wrap rounded-xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-black dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {m.text}
              </div>
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="mt-1 rounded-lg border border-amber-400 bg-amber-50 p-2 font-mono text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  <div className="font-semibold">tool calls executed:</div>
                  {m.toolCalls.map((c, j) => (
                    <div key={j}>
                      {c.tool}({Object.entries(c.args).map(([k, v]) => `${k}=${v}`).join(", ")}) →{" "}
                      {typeof c.result === "string" ? c.result : JSON.stringify(c.result)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {busy && <p className="text-sm text-zinc-400">thinking…</p>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about returns, refunds, delivery…"
            className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-black outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
