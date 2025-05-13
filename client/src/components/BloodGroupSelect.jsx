import '../assets/forms.css';

const BloodGroupSelect = ({ value, onChange }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  return (
    <select 
      className="blood-group-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">Select Blood Group</option>
      {bloodGroups.map(group => (
        <option key={group} value={group}>{group}</option>
      ))}
    </select>
  );
};

export default BloodGroupSelect;