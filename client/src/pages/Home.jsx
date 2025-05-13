import { Link } from 'react-router-dom';
import '../assets/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Save Lives With Blood Donation</h1>
        <p>Join our community of donors and help those in need</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-primary">Register Now</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h3>Find Donors</h3>
          <p>Connect with verified blood donors in your area</p>
        </div>
        <div className="feature-card">
          <h3>Request Blood</h3>
          <p>Post blood requests when in urgent need</p>
        </div>
        <div className="feature-card">
          <h3>Save Lives</h3>
          <p>Your donation can save up to 3 lives</p>
        </div>
      </section>
    </div>
  );
};

export default Home;