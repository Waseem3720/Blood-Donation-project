import "../../assets/adminTables.css";

const AdminRequestsTable = ({ requests = [] }) => {
  if (!Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="table-container">
        <p style={{ padding: '1.5rem', color: '#666' }}>No blood requests found or data is loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Blood Requests</h2>
      <div className="total-count-badge">Total Blood Requests: {requests.length}</div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Blood Group</th>
              <th>Location</th>
              <th>Seeker</th>
              <th>Status</th>
              <th>Donor</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id}>
                <td><span className="role-badge donor">{request.bloodGroup}</span></td>
                <td>{request.location}</td>
                <td>{request.seeker?.fullName || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>{request.acceptedBy?.fullName || 'Not accepted'}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequestsTable;