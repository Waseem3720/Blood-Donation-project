import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import '../assets/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🩸</span>
          <span className="logo-text">BloodConnect</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/login" 
            className={`nav-link ${isActive('/login') ? 'active' : ''}`}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className={`nav-link ${isActive('/register') ? 'active' : 'register-btn'}`}
          >
            Register
          </Link>
          <NotificationBell />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;