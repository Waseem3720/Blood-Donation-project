import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BloodGroupSelect from '../components/BloodGroupSelect';
import api from '../services/api';
import '../assets/complete-registration.css';
import '../assets/forms.css';

const CompleteRegistration = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  // Initialize form data with Google info if available
  const [formData, setFormData] = useState({
    fullName: state?.googleData?.name || '',
    email: state?.googleData?.email || '',
    password: '',
    phoneNumber: '',
    location: '',
    ...(state?.role === 'donor' ? {
      age: '',
      bloodGroup: ''
    } : {})
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBloodGroupChange = (value) => {
    setFormData({
      ...formData,
      bloodGroup: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = state?.googleData ? 
        '/auth/complete-google-signup' : 
        '/auth/register';
      
      const { data } = await api.post(endpoint, {
        ...formData,
        role: state.role,
        ...(state?.googleData && { googleId: state.googleData.sub })
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(`/${state.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="complete-registration-container">
      <h2>Complete Your {state?.role} Registration</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Common Fields */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!state?.googleData}
          />
        </div>

        {!state?.googleData && (
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Donor-specific Fields */}
        {state?.role === 'donor' && (
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="65"
                required
              />
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <BloodGroupSelect
                value={formData.bloodGroup}
                onChange={handleBloodGroupChange}
              />
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default CompleteRegistration;