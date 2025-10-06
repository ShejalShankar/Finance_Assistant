import React from "react";

export default function Header() {
  return (
    <header
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        paddingTop: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <strong style={{ fontSize: 16 }}>Financial Insight Assistant</strong>
      </div>

      <div
        aria-live="polite"
        style={{ display: "flex", alignItems: "center", gap: 8, color: "#16a34a" }}
        title="Data connection status"
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "999px",
            background: "#16a34a",
            display: "inline-block",
          }}
        />
        <span style={{ fontWeight: 600 }}>Live Data</span>
      </div>
    </header>
  );
}
