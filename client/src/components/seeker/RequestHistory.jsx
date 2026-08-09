import "../../assets/seekerComponents.css";

const RequestHistory = ({ requests, onViewDonors, onCancelRequest }) => {
  if (requests.length === 0) {
    return (
      <section className="history-section">
        <h2>Your Requests</h2>
        <p className="no-requests">You haven't made any blood requests yet</p>
      </section>
    );
  }

  return (
    <section className="history-section">
      <h2>Your Requests</h2>
      <div className="request-table">
        <div className="table-header">
          <div>Blood Group</div>
          <div>Units</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {requests.map(request => (
          <div key={request._id} className="table-row">
            <div>{request.bloodGroup}</div>
            <div>{request.unitsRequired}</div>
            <div>
              <span className={`status-badge ${request.status}`}>
                {request.status}
              </span>
            </div>
            <div>{new Date(request.createdAt).toLocaleDateString()}</div>
            <div className="action-buttons">
              <button 
                className="view-btn"
                onClick={() => onViewDonors(request._id)}
              >
                View Donors
              </button>
              {request.status === 'pending' && (
                <button 
                  className="cancel-btn"
                  onClick={() => onCancelRequest(request._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RequestHistory;