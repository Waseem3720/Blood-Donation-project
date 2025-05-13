import React, { useState, useEffect } from 'react';
import { getDonationHistory } from '../../services/api';
import "../../assets/DonationHistory.css";

const DonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getDonationHistory();
        setHistory(data.data || []);
      } catch (err) {
        setError('Failed to fetch donation history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="donation-history-loading">Loading donation history...</div>;
  }

  if (error) {
    return <div className="donation-history-error">{error}</div>;
  }

  if (history.length === 0) {
    return <div className="donation-history-no-records">No donation history found.</div>;
  }

  return (
    <section className="donation-history-section">
      <h2>Your Donation History</h2>
      <div className="donation-history-table">
        <div className="donation-history-header">
          <div>Blood Group</div>
          <div>Seeker Name</div>
          <div>Seeker Phone</div>
          <div>Seeker Location</div>
          <div>Donation Date</div>
          <div>Status</div>
        </div>
        {history.map((request) => (
          <div key={request._id} className="donation-history-row">
            <div>{request.bloodGroup}</div>
            <div>{request.seeker?.fullName || 'N/A'}</div>
            <div>{request.seeker?.phoneNumber || 'N/A'}</div>
            <div>{request.seeker?.location || 'N/A'}</div>
            <div>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</div>
            <div>
              <span className={`donation-history-badge ${request.status === 'Accepted' ? 'accepted' : 'rejected'}`}>
                {request.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DonationHistory;
