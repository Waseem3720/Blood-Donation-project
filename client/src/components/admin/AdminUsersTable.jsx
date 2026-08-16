import "../../assets/adminTables.css";

const AdminUsersTable = ({ users = [], onDelete, onBlock }) => {
  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="table-container">
        <p style={{ padding: '1.5rem', color: '#666' }}>No users found or data is loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="total-count-badge">Total Users: {users.length}</div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                <td>
                  <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                    onClick={() => onBlock(user._id, !user.isBlocked)}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => onDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTable;