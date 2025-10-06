import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuestionBox from "./components/QuestionBox";
import ExamplePrompts from "./components/ExamplePrompts";
import AnswerCard from "./components/AnswerCard";
import StockChart from "./components/StockChart";
import "./App.css";

// ---------------------------------------------
// Ticker extraction helpers
// ---------------------------------------------
const TICKER_SYNONYMS: [RegExp, string][] = [
  [/tesla|tsla/i, "TSLA"],
  [/apple|aapl/i, "AAPL"],
  [/alphabet|google|googl|goog/i, "GOOGL"],
  [/microsoft|msft/i, "MSFT"],
  [/nvidia|nvda/i, "NVDA"],
  [/amazon|amzn/i, "AMZN"],
  [/meta|facebook|fb/i, "META"],
];

function extractTicker(q: string): string | null {
  for (const [re, t] of TICKER_SYNONYMS) if (re.test(q)) return t;
  // fallback: plain ALL-CAPS ticker-like token
  const m = q.match(/\b[A-Z]{2,5}\b/);
  return m ? m[0] : null;
}

// ---------------------------------------------
// Types for the answer card
// ---------------------------------------------
type Answer = {
  answer: string;
  sources: string[];
  sentiment?: string;
};

export default function App() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState<string | null>(null);

  async function handleAsk(nextQ?: string) {
    const q = (nextQ ?? question).trim();
    if (!q) return;

    // Reset state so chart cannot appear before the new answer
    setLoading(true);
    setResponse(null);
    setTicker(null);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // expected shape: { answer, sources, sentiment?, ticker? }
      const data = await res.json();

      // 1) paint the answer first
      setResponse({
        answer: data.answer,
        sources: Array.isArray(data.sources) ? data.sources : [],
        sentiment: data.sentiment ?? "neutral",
      });

      // 2) set ticker after the answer has been scheduled to render
      const inferred = (data.ticker as string | undefined) ?? extractTicker(q);
      setTimeout(() => setTicker(inferred ?? null), 0);
    } catch (err) {
      console.error(err);
      setResponse({
        answer: "Sorry — I couldn’t fetch a response right now.",
        sources: [],
        sentiment: "neutral",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="center-col">
          <Hero />

          {/* Question box */}
          <div className="ask-card">
            <QuestionBox
              question={question}
              onChange={(v) => setQuestion(v)}
              onAsk={() => handleAsk()}
              loading={loading}
            />
          </div>

          {/* Answer first */}
          {response && <AnswerCard response={response} />}

          {/* Chart only after we have an answer & a ticker */}
          {response && ticker && !loading && (
            <div className="card" style={{ marginTop: 16 }}>
              <StockChart ticker={ticker} />
            </div>
          )}

          {/* Suggestions */}
          <ExamplePrompts
            onSelect={(prompt) => {
              setQuestion(prompt);
              handleAsk(prompt);
            }}
          />
        </div>
      </main>
    </div>
  );
}
