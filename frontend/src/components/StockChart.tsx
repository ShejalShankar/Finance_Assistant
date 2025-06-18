import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface StockDataPoint {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

function StockChart({ ticker = "TSLA" }) {
  const [data, setData] = useState<StockDataPoint[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/stock-data?ticker=${ticker}`)
      .then(res => res.json())
      .then(res => setData(res.history || []))
      .catch(err => console.error("Failed to load stock data", err));
  }, [ticker]);

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <h3>📈 {ticker} 5-Day Stock Close Prices</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="Date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="Close" stroke="#007bff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
