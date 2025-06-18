import { useState } from 'react';
import './App.css';
import StockChart from './components/StockChart';

export type ResponseData = {
  question: string;
  answer: string;
  sources: string[];
  sentiment?: string;
}

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ResponseData[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const result: ResponseData = { ...data, question };
      setResponse(result);
      setHistory((prev) => [...prev, result]);
    } catch (err) {
      console.error('Error:', err);
      setResponse({ question, answer: 'Something went wrong.', sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
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
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {response && (
        <div className="card response">
          {response.sentiment && (
            <span className={`tag ${response.sentiment.toLowerCase()}`}>
              {response.sentiment.toUpperCase()}
            </span>
          )}
          <h2>Answer</h2>
          <p>{response.answer || 'No answer generated.'}</p>
          
          <StockChart ticker="TSLA" />

          <h3>Sources</h3>
          <ul>
            {response.sources.length > 0 ? (
              response.sources.map((url, idx) => (
                <li key={idx}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </li>
              ))
            ) : (
              <li>No sources available.</li>
            )}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div className="card history-card">
        <h3>Previous Questions</h3>
        {history.length === 0 ? (
          <p className="muted">No questions yet.</p>
        ) : (
          history.map((item, index) => (
            <details key={index} className="history-item">
              <summary>{item.question}</summary>
              <div className="history-response">
                <p>{item.answer}</p>
                <ul>
                  {item.sources.map((src, i) => (
                    <li key={i}>
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        {src.length > 60 ? src.slice(0, 60) + '...' : src}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))
        )}
      </div>      
      )}
    </div>
  );
}

export default App;
