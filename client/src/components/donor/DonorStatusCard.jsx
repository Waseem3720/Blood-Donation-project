import "../../assets/donorComponents.css";

const DonorStatusCard = ({ user, onToggleAvailability }) => {
  return (
    <div className="donor-status-card">
      <div className="donor-info">
        <h3>Your Information</h3>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
        <p><strong>Location:</strong> {user.location}</p>
      </div>
      <div className="availability-toggle">
        <label>Availability Status:</label>
        <button
          className={`toggle-btn ${user.isAvailable ? 'active' : 'inactive'}`}
          onClick={onToggleAvailability}
        >
          {user.isAvailable ? 'Available' : 'Unavailable'}
        </button>
        <p className="status-note">
          {user.isAvailable 
            ? 'You will appear in donor searches' 
            : 'You will NOT appear in donor searches'}
        </p>
      </div>
    </div>
  );
};

export default DonorStatusCard;