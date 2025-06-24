import { useState } from "react";
import "./App.css";
import "./components/Sidebar.css";
import Sidebar from "./components/Sidebar";
import StockChart from "./components/StockChart";

type ResponseData = {
  answer: string;
  sources: string[];
  sentiment?: string;
};

type HistoryEntry = {
  question: string;
  response: ResponseData;
};

function extractTicker(question: string): string | null {
  const tickers = ["TSLA", "AAPL", "GOOG", "NVDA", "MSFT", "AMZN", "META"];
  const match = tickers.find((t) => question.toUpperCase().includes(t));
  return match || null;
}

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [ticker, setTicker] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResponse(data);
      setHistory((prev) => [...prev, { question, response: data }]);
      const detected = extractTicker(question);
      setTicker(detected);
    } catch (err) {
      console.error("Error:", err);
      setResponse({ answer: "Something went wrong.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setQuestion(entry.question);
    setResponse(entry.response);
  };

  return (
    <div className="app-layout">
      <Sidebar
        questions={history.map((h) => h.question)}
        onSelect={(q) => {
          const found = history.find((h) => h.question === q);
          if (found) handleSelectHistory(found);
        }}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="app-main">
        <button
          className="toggle-sidebar"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <h1 className="branding">
          <img src="/icon.png" alt="logo" className="logo" />
          Financial Insight Assistant
        </h1>

        <div className="card input-card">
          <textarea
            placeholder="What are Reddit users saying about Nvidia this week?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
          />
          <button onClick={handleAsk} disabled={loading} className="cta-button">
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>

        {response && (
          <div className="card response">
            <h2>Answer</h2>
            <p>{response.answer || "No answer generated."}</p>
            <h3>Sources</h3>
            <ul>
              {response.sources.length > 0 ? (
                response.sources.map((url, idx) => {
                  const shortLabel = url
                    .split("/")
                    .filter(Boolean)
                    .pop()
                    ?.replace(/_/g, " ")
                    .slice(0, 60);
                  return (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {shortLabel || "Reddit Link"}
                      </a>
                    </li>
                  );
                })
              ) : (
                <li>No sources available.</li>
              )}
            </ul>
          </div>
        )}

        {ticker && <StockChart ticker={ticker} />}
      </div>
    </div>
  );
}

export default App;
