import React from "react";
import "../App.css";

type HistoryEntry = {
  question: string;
  response: {
    answer: string;
    sources: string[];
  };
};

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

const HistoryPanel = ({ history, onSelect }: Props) => {
  return (
    <div className="history-card">
      <h3>Previous Questions</h3>
      {history.length === 0 ? (
        <p className="muted">No questions asked yet.</p>
      ) : (
        history.map((entry, idx) => (
          <details key={idx} className="history-item">
            <summary>{entry.question}</summary>
            <div className="history-response" onClick={() => onSelect(entry)}>
              {entry.response.answer.slice(0, 120)}...
            </div>
          </details>
        ))
      )}
    </div>
  );
};

export default HistoryPanel;
