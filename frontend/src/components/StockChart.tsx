import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type RawPoint = any; // backend row (we’ll normalize)
type Point = { Date: string; Close: number };

type Props = { ticker?: string };

export default function StockChart({ ticker }: Props) {
  const [rows, setRows] = useState<RawPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setRows(null);
    setErr(null);

    if (!ticker) return; // show placeholder if nothing selected

    setLoading(true);
    fetch(`http://localhost:8000/stock-data?ticker=${encodeURIComponent(ticker)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        // Expecting { history: [...] }
        const arr = Array.isArray(json?.history) ? json.history : [];
        setRows(arr);
      })
      .catch((e) => setErr(e.message || "Failed to load stock data"))
      .finally(() => setLoading(false));
  }, [ticker]);

  // Normalize keys & keep the latest 5 (if backend returns more)
  const data: Point[] = useMemo(() => {
    if (!rows) return [];
    const norm: Point[] = rows.map((d: any) => ({
      Date: d.Date ?? d.date ?? "",
      Close: Number(d.Close ?? d.close ?? d.adjClose ?? 0),
    }));
    // filter invalid & keep last 5 points
    return norm.filter((p) => p.Date && Number.isFinite(p.Close)).slice(-5);
  }, [rows]);

  // small date formatter for the x-axis
  const fmtX = (val: string) => {
    // try YYYY-MM-DD -> MM/DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m, d] = val.split("-");
      return `${m}/${d}`;
    }
    return val;
  };

  // placeholder when no ticker
  if (!ticker) {
    return (
      <section className="card" style={{ padding: 16, minHeight: 260 }}>
        <h3 style={{ marginTop: 0 }}>📈 5-Day Stock Close Prices</h3>
        <div
          style={{
            height: 200,
            border: "2px dashed #e2e8f0",
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
            fontSize: 14,
            background:
              "repeating-linear-gradient(90deg, #f8fafc, #f8fafc 12px, #ffffff 12px, #ffffff 24px)",
          }}
        >
          Select a ticker to preview
        </div>
      </section>
    );
  }

  return (
    <section className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h3 style={{ margin: 0 }}>📈 {ticker} 5-Day Stock Close Prices</h3>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 999,
            background: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #dbeafe",
          }}
        >
          Recharts
        </span>
      </div>

      {loading ? (
        <div style={{ height: 300, display: "grid", placeItems: "center", color: "#64748b" }}>
          Loading prices…
        </div>
      ) : err ? (
        <div
          style={{
            height: 300,
            display: "grid",
            placeItems: "center",
            color: "#b45309",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 12,
          }}
        >
          Failed to load data ({err})
        </div>
      ) : data.length === 0 ? (
        <div style={{ height: 300, display: "grid", placeItems: "center", color: "#94a3b8" }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" tickFormatter={fmtX} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip formatter={(v: number) => v.toFixed(2)} labelFormatter={fmtX} />
            <Line type="monotone" dataKey="Close" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
