import { useState } from 'react';
import '../assets/sidebar.css';

const Sidebar = ({ tabs = [], activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        type="button"
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? '◀' : '▶'}
      </button>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                title={tab.label}
              >
                <span className="tab-icon">{tab.icon}</span>
                {isOpen && <span className="tab-label">{tab.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
