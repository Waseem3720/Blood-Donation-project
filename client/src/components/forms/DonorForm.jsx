import { useState } from 'react';
import "../../assets/forms.css";

const DonorForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    bloodGroup: '',
    age: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
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
        />
      </div>

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
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
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

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Register as Donor
        </button>
      </div>
    </form>
  );
};

export default DonorForm;