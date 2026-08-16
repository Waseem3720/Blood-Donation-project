import { Link, useLocation } from 'react-router-dom';
import '../assets/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
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
            className={`nav-link register-btn ${isActive('/register') ? 'active' : ''}`}
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;