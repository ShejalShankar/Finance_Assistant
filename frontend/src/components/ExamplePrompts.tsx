import React from "react";

type Props = { onSelect: (prompt: string) => void };

const prompts = [
  "What are Reddit users saying about Tesla this week?",
  "Which stocks have the most bullish sentiment right now?",
  "Show trending tickers on Reddit today.",
];

export default function ExamplePrompts({ onSelect }: Props) {
  return (
    <aside aria-label="Try asking" style={{ marginTop: "1rem" }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#111827" }}>Try asking:</div>
      <div style={{ display: "grid", gap: 8 }}>
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            style={{
              textAlign: "left",
              background: "#eef2ff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
              color: "#1e3a8a",
              fontWeight: 600,
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </aside>
  );
}
