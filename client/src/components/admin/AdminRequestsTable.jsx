import "../../assets/adminTables.css";

const AdminRequestsTable = ({ requests }) => {
  return (
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
              <td>{request.bloodGroup}</td>
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
  );
};

export default AdminRequestsTable;