import '../assets/sidebar.css';

const Sidebar = ({ tabs = [], activeTab, onTabChange }) => {
  return (
    <aside className="sidebar">
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
                <span className="tab-label">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
