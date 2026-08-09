import { useState } from 'react';
import "../../assets/seekerComponents.css";

const RequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitsRequired: 1,
    urgency: 'normal',
    location: '',
    note: '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'normal', label: 'Normal' },
    { value: 'urgent', label: 'Urgent (within 24 hours)' },
    { value: 'emergency', label: 'Emergency (immediate need)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="request-form-container">
      <h3>New Blood Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blood Group:</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Units Required:</label>
          <input
            type="number"
            name="unitsRequired"
            min="1"
            max="10"
            value={formData.unitsRequired}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Urgency Level:</label>
          <div className="radio-group">
            {urgencyLevels.map(level => (
              <label key={level.value}>
                <input
                  type="radio"
                  name="urgency"
                  value={level.value}
                  checked={formData.urgency === level.value}
                  onChange={handleChange}
                />
                {level.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Hospital or city"
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Any special requirements or details"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;