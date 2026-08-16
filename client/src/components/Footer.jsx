import '../assets/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-brand">
            <span className="footer-logo-icon">🩸</span>
            <span>BloodConnect</span>
          </h3>
          <p>Connecting donors with those in need</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="horizontal-links">
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: f223720@cfd.nu.edu.pk</p>
          <p>Phone: +92 323 1003993</p>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} BloodConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;