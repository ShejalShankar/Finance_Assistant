import React from "react";
import "./styles/Sidebar.css";

export default function Sidebar() {
  const IconBtn = ({ label, children }: React.PropsWithChildren<{ label: string }>) => (
    <button className="sb-icon" aria-label={label} title={label}>
      {children}
    </button>
  );

  return (
    <nav className="sidebar" aria-label="Primary">
      <IconBtn label="Menu">≡</IconBtn>
      <div className="sb-spacer" />
      <IconBtn label="Dashboard">📊</IconBtn>
      <IconBtn label="Account">👤</IconBtn>
      <IconBtn label="Chat">💬</IconBtn>
      <IconBtn label="Settings">⚙️</IconBtn>
    </nav>
  );
}
