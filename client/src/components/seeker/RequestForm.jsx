import { useState, useEffect } from 'react';
import "../../assets/seekerComponents.css";

const RequestForm = ({ onSubmit, onCancel, profileLocation }) => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitRequired: 1,
    urgency: 'normal',
    location: profileLocation || '',
    note: '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'normal', label: 'Normal' },
    { value: 'urgent', label: 'Urgent (within 24 hours)' },
    { value: 'emergency', label: 'Emergency (immediate need)' }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      const numValue = Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? '' : numValue
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData); // For debug
    onSubmit(formData);
  };

  useEffect(() => {
    if (profileLocation !== undefined) {
      setFormData(prev => ({ ...prev, location: profileLocation }));
    }
  }, [profileLocation]);

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
            name="unitRequired"
            min="1"
            max="10"
            value={formData.unitRequired}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Urgency Level:</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
          >
            <option value="">Select Urgency Level</option>
            {urgencyLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
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
