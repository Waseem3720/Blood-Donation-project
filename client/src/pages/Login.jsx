import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth';
import { login } from '../services/auth';
import '../assets/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await login(formData);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue to BloodConnect</p>
          
          {error && <div className="error-message">{error}</div>}

          {!role ? (
            <div className="role-selection">
              <h3>Select your role:</h3>
              <div className="role-options">
                <button 
                  className="role-btn donor"
                  onClick={() => setRole('donor')}
                >
                  I'm a Donor
                </button>
                <button 
                  className="role-btn seeker"
                  onClick={() => setRole('seeker')}
                >
                  I Need Blood
                </button>
                <button 
                  className="role-btn admin"
                  onClick={() => setRole('admin')}
                >
                  Administrator
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="auth-methods">
                <GoogleAuth role={role} />

                <div className="divider">
                  <span className="divider-line"></span>
                  <span>or</span>
                  <span className="divider-line"></span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <button type="submit" className="primary-btn">
                    Login as {role}
                  </button>
                </form>
              </div>

              <button 
                className="text-btn"
                onClick={() => setRole(null)}
              >
                ← Back to role selection
              </button>
            </>
          )}

          <p className="auth-footer">
            New to BloodConnect? <a href="/register">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;