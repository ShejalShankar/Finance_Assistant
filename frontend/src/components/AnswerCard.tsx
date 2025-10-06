
type Props = {
  response: {
    answer: string;
    sources: string[];
    sentiment?: string;
  } | null;
};

export default function AnswerCard({ response }: Props) {
  if (!response) return null;

  const { answer, sources, sentiment } = response;
  const prioritized = [...sources].sort((a, b) => {
    const ra = a.includes("reddit.com") ? -1 : 1;
    const rb = b.includes("reddit.com") ? -1 : 1;
    return ra - rb;
  });

  const labelFromUrl = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("reddit")) {
        // e.g. r/stocks/comments/abc123 → r/stocks • comments/abc123
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts[0] === "r" && parts[1]) return `r/${parts[1]}`;
      }
      return u.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  return (
    <div className="answer-card">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Answer</h3>
        {sentiment && (
          <span className="badge-live" style={{ fontSize: 12 }}>
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </span>
        )}
      </div>

      <p style={{ marginTop: 10, lineHeight: 1.6 }}>{answer || "No answer provided."}</p>

      <h4 style={{ marginTop: 16, marginBottom: 8, fontSize: 14 }}>Sources</h4>
      {prioritized.length ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {prioritized.map((url, i) => (
            <li key={i}>
              <a href={url} target="_blank" rel="noreferrer">
                {labelFromUrl(url)}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#64748b" }}>No sources returned.</p>
      )}
    </div>
  );
}
