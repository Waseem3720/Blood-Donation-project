import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import '../assets/dashboardNavbar.css';

const DashboardNavbar = ({
  user,
  role = 'User',
  onTabChange,
  onToggleAvailability,
  onLogout
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleMenuClick = (tabId) => {
    setDropdownOpen(false);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Determine user role and title
  const effectiveRole = user?.role || role;
  const roleTitle = effectiveRole.charAt(0).toUpperCase() + effectiveRole.slice(1);
  const isDonor = effectiveRole.toLowerCase() === 'donor';
  const isSeeker = effectiveRole.toLowerCase() === 'seeker';

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-nav-container">
        <div 
          className="dashboard-logo" 
          onClick={() => handleMenuClick(isDonor || isSeeker ? 'userInfo' : 'dashboard')}
          title="BloodConnect Dashboard"
        >
          <span className="logo-icon">🩸</span>
          <span className="logo-text">BloodConnect</span>
        </div>

        <div className="dashboard-nav-right">
          {/* Donor Availability Indicator & Toggle */}
          {isDonor && (
            <button
              type="button"
              className={`availability-pill ${user?.isAvailable ? 'available' : 'unavailable'}`}
              onClick={onToggleAvailability}
              title="Click to toggle availability status"
            >
              {user?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
            </button>
          )}

          {/* Notification Bell Icon */}
          <NotificationBell />

          {/* User / Role Profile Dropdown */}
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className="profile-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              <span className="profile-icon">👤</span>
              <span className="profile-name">{roleTitle}</span>
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown-menu">
                {effectiveRole.toLowerCase() === 'admin' ? (
                  <button 
                    type="button" 
                    className="dropdown-item logout" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    {!isSeeker && (
                      <button 
                        type="button" 
                        className="dropdown-item" 
                        onClick={() => handleMenuClick('userInfo')}
                      >
                        User Info
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="dropdown-item" 
                      onClick={() => handleMenuClick('updateProfile')}
                    >
                      Update Profile
                    </button>
                    <hr className="dropdown-divider" />
                    <button 
                      type="button" 
                      className="dropdown-item logout" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
