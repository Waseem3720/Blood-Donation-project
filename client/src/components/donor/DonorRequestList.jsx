import "../../assets/donorComponents.css";

const DonorRequestList = ({ requests, onAccept }) => {
  if (requests.length === 0) {
    return <p className="no-requests">No matching blood requests found</p>;
  }

  return (
    <div className="request-list">
      {requests.map(request => (
        <div key={request._id} className="request-card">
          <div className="request-info">
            <h4>Blood Group: {request.bloodGroup}</h4>
            <p><strong>Location:</strong> {request.location}</p>
            <p><strong>Requested On:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
            {request.note && <p><strong>Note:</strong> {request.note}</p>}
            {request.urgency && (
              <p className={`urgency-${request.urgency}`}>
                <strong>Urgency:</strong> {request.urgency}
              </p>
            )}
          </div>
          <button 
            className="accept-btn"
            onClick={() => onAccept(request._id)}
          >
            Accept Request
          </button>
        </div>
      ))}
    </div>
  );
};

export default DonorRequestList;