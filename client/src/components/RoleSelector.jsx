import '../assets/roleSelector.css';

const RoleSelector = ({ onSelect }) => {
  return (
    <div className="role-selector">
      <h3 className="role-selector-title">I want to register as:</h3>
      <div className="role-cards">
        <div className="role-card" onClick={() => onSelect('donor')}>
          <div className="role-icon">🩸</div>
          <h4>Blood Donor</h4>
          <p>Register to donate blood and save lives</p>
        </div>
        <div className="role-card" onClick={() => onSelect('seeker')}>
          <div className="role-icon">💉</div>
          <h4>Blood Seeker</h4>
          <p>Register to find blood donors</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;