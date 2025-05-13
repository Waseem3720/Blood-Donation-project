import { useState } from "react";
import "../../assets/seekerComponents.css";

const RequestHistory = ({ requests, onCancelRequest }) => {
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "asc" });

  // Function to sort the requests based on the selected key and direction
  const sortRequests = (requests, key, direction) => {
    const sortedRequests = [...requests];
    sortedRequests.sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedRequests;
  };

  // Handle sorting change (triggered by clicking on table headers)
  const handleSortChange = (key) => {
    setSortConfig((prevConfig) => {
      const newDirection = prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction: newDirection };
    });
  };

  // Sort the requests based on the selected sorting configuration
  const sortedRequests = sortRequests(requests, sortConfig.key, sortConfig.direction);

  return (
    <section className="history-section">
      <h2>Your Requests</h2>
      {requests.length === 0 ? (
        <p className="no-requests">You haven't made any blood requests yet</p>
      ) : (
        <div className="request-table">
          <div className="table-header">
            <div onClick={() => handleSortChange("bloodGroup")}>
              Blood Group {sortConfig.key === "bloodGroup" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </div>
            <div onClick={() => handleSortChange("unitRequired")}>
              Units {sortConfig.key === "unitRequired" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </div>
            <div onClick={() => handleSortChange("location")}>
              Location {sortConfig.key === "location" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </div>
            <div onClick={() => handleSortChange("status")}>
              Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </div>
            <div onClick={() => handleSortChange("createdAt")}>
              Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </div>
            <div>Donor Info</div>
            <div>Actions</div>
          </div>
          {sortedRequests.map(request => (
            <div key={request._id} className="table-row">
              <div>{request.bloodGroup}</div>
              <div>{request.unitRequired}</div>
              <div>{request.location}</div>
              <div>
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
              </div>
              <div>{new Date(request.createdAt).toLocaleDateString()}</div>
              <div>
                {request.status === "accepted" && request.acceptedBy ? (
                  <div className="donor-info">
                    <p><strong>Name:</strong> {request.acceptedBy.fullName}</p>
                    <p><strong>Phone:</strong> {request.acceptedBy.phoneNumber}</p>
                    <p><strong>Email:</strong> {request.acceptedBy.email}</p>
                  </div>
                ) : (
                  <p>No donor yet</p>
                )}
              </div>
              <div className="action-buttons">
                {request.status === "pending" && (
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
      )}
    </section>
  );
};

export default RequestHistory;
