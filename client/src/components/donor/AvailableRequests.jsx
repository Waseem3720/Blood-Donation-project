// src/components/donor/AvailableRequests.jsx
import { useState } from 'react';
import "../../assets/AvailableRequests.css";

const AvailableRequests = ({ requests, onAccept }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "bloodGroup", direction: "asc" });

  const handleAccept = async (requestId) => {
    setLoadingId(requestId);
    try {
      await onAccept(requestId);
    } finally {
      setLoadingId(null);
    }
  };

  const sortRequests = (requests, key, direction) => {
    const sorted = [...requests];
    sorted.sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const handleSortChange = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRequests = sortRequests(requests, sortConfig.key, sortConfig.direction);

  if (!requests.length) {
    return <div className="no-requests">No available requests matching your blood type.</div>;
  }

  return (
    <section className="available-requests-section">
      <h2>Available Blood Requests</h2>
      <div className="request-table">
        <div className="table-header">
          <div onClick={() => handleSortChange("seeker.fullName")}>Seeker Name {sortConfig.key === "seeker.fullName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</div>
          <div onClick={() => handleSortChange("bloodGroup")}>Blood Group {sortConfig.key === "bloodGroup" && (sortConfig.direction === "asc" ? "↑" : "↓")}</div>
          <div onClick={() => handleSortChange("unitRequired")}>Units {sortConfig.key === "unitRequired" && (sortConfig.direction === "asc" ? "↑" : "↓")}</div>
          <div onClick={() => handleSortChange("location")}>Location {sortConfig.key === "location" && (sortConfig.direction === "asc" ? "↑" : "↓")}</div>
          <div>Phone</div>
          <div>Note</div>
          <div>Actions</div>
        </div>
        {sortedRequests.map((request) => (
          <div key={request._id} className="table-row">
            <div>{request.seeker?.fullName || 'Anonymous Seeker'}</div>
            <div>{request.bloodGroup}</div>
            <div>{request.unitRequired}</div>
            <div>{request.location}</div>
            <div>{request.seeker?.phoneNumber || '-'}</div>
            <div>{request.note || '-'}</div>
            <div>
              <button
                onClick={() => handleAccept(request._id)}
                disabled={loadingId === request._id}
                className={loadingId === request._id ? 'loading' : ''}
              >
                {loadingId === request._id ? 'Accepting...' : 'Accept'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableRequests;
