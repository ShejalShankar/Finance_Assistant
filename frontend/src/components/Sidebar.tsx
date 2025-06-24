import './Sidebar.css';
import { useState } from 'react';

type SidebarProps = {
  questions: string[];
  onSelect: (q: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ questions, onSelect, isOpen, toggleSidebar }: SidebarProps) {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (q: string) => {
    setActive(q);
    onSelect(q);
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <h2>Previous Questions</h2>
      <button className="close-btn" onClick={toggleSidebar}>
    ←
  </button>
      <ul>
        {questions.map((q, idx) => (
          <li
            key={idx}
            className={q === active ? 'active' : ''}
            onClick={() => handleClick(q)}
          >
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}
