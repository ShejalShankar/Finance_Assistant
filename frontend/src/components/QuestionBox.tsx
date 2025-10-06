// src/components/QuestionBox.tsx
import React from "react";

type Props = {
  question: string;
  onChange: (value: string) => void;
  onAsk: () => void;
  loading: boolean;
};

export default function QuestionBox({ question, onChange, onAsk, loading }: Props) {
  return (
    <div className="qb">
      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., How are tech stocks trending this week?"
      />
      <div className="qb-row">
        <button className="cta" onClick={onAsk} disabled={loading}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>
    </div>
  );
}
