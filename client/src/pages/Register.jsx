import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth';
import RoleSelector from '../components/RoleSelector';
import DonorForm from '../components/forms/DonorForm';
import SeekerForm from '../components/forms/SeekerForm';
import api from '../services/api';
import '../assets/auth.css';

const Register = () => {
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleManualRegister = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', { ...formData, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(`/${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}

        {!role ? (
          <RoleSelector onSelect={setRole} />
        ) : (
          <>
            <div className="auth-methods">
              <div className="google-auth-wrapper">
                <p className="auth-divider-text">Or register with Google as {role}:</p>
                <GoogleAuth role={role} />
              </div>

              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">OR</span>
                <span className="divider-line"></span>
              </div>

              <div className="form-container">
                {role === 'donor' ? (
                  <DonorForm onSubmit={handleManualRegister} />
                ) : (
                  <SeekerForm onSubmit={handleManualRegister} />
                )}
              </div>
            </div>
            <button 
              className="switch-role-btn" 
              onClick={() => setRole(null)}
            >
              Change Role
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;