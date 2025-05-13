import { useState } from 'react';
import '../../assets/seekerprofilemanagement.css';

const ProfileManagement = ({ user, onUpdate }) => {
  const [profile, setProfile] = useState({
    fullName: user.fullName || '',
    phoneNumber: user.phoneNumber || '',
    location: user.location || ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await onUpdate(profile);
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-management">
      <h2>Update Profile</h2>
      
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={profile.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={profile.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileManagement;