import { useState, useEffect } from 'react';
import '../assets/sidebar.css';

const Sidebar = ({ tabs = [], activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile: render a bottom navigation bar (always visible, no hiding)
  if (isMobile) {
    return (
      <nav className="sidebar-bottom-nav" role="navigation" aria-label="Bottom navigation">
        <ul className="sidebar-bottom-menu">
          {tabs.map((tab) => (
            <li key={tab.id} className="sidebar-bottom-item">
              <button
                type="button"
                className={`sidebar-bottom-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                title={tab.label}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-bottom-label">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // On desktop: original collapsible sidebar
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
