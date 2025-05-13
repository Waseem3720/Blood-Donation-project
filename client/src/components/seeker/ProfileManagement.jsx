// ProfileManagement.jsx
import { useState } from 'react';
import { updateProfile } from '../../services/api';
import '../../assets/seekerprofilemanagement.css';

const ProfileManagement = ({ user, onUpdate }) => {
  const [profile, setProfile] = useState({
    fullName: user.fullName || '',
    phoneNumber: user.phoneNumber || '',
    location: user.location || ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(profile);
      setMessage('Profile updated successfully!');
      setError('');
      onUpdate && onUpdate(updatedUser);
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="profile-management">
      <h3>Update Profile</h3>

      {message && <p className="success-message">{message}</p>}
      {error   && <p className="error-message">{error}</p>}

      <div className="profile-fields">
        <div className="field">
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

        <div className="field">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={profile.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="primary-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
);

};

export default ProfileManagement;
