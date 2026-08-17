import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getDonationHistory, updateProfile } from '../services/api';
import { initPushSubscription } from '../services/pushNotification';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../components/Sidebar';
import '../assets/donorDashboard.css';

const donorTabs = [
  { id: 'userInfo', label: 'Dashboard', icon: '🏠' },
  { id: 'requests', label: 'Available Requests', icon: '🩸' },
  { id: 'history', label: 'Donation History', icon: '📜' },
];

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('userInfo');
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState({ fullName: '', phoneNumber: '', location: '', age: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [userRes, requestsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/donor/requests'),
        ]);

        const userData = userRes.data;
        setUser(userData);
        setProfileForm({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          location: userData.location || '',
          age: userData.age || '',
        });

        setRequests(requestsRes.data?.data || requestsRes.data || []);
        initPushSubscription().catch(console.error);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getDonationHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load donation history');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setProfileSuccess('');
    if (tab === 'history') loadHistory();
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put(`/donor/requests/${requestId}/accept`);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const toggleAvailability = async () => {
    try {
      const { data } = await api.put('/donor/availability', { isAvailable: !user.isAvailable });
      setUser((prev) => ({ ...prev, isAvailable: data.data }));
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setError('');
    try {
      const updated = await updateProfile(profileForm);
      setUser(updated);
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard-layout">
      <DashboardNavbar
        user={user}
        role="Donor"
        onTabChange={handleTabChange}
        onToggleAvailability={toggleAvailability}
        onLogout={handleLogout}
      />

      <div className="dashboard-container">
        <Sidebar
          tabs={donorTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <main className="dashboard-main">
          {error && <div className="alert-message error">{error}</div>}
          {profileSuccess && <div className="alert-message success">{profileSuccess}</div>}

          {loading ? (
            <div className="no-data">Loading Donor Dashboard...</div>
          ) : (
            <div className="dashboard-content">
              {/* ======== USER INFO TAB ======== */}
              {activeTab === 'userInfo' && user && (
                <div className="user-info-section">
                  <h2>Donor Profile Overview</h2>
                  <div className="user-info-card">
                    <div className="info-item">
                      <label>Full Name</label>
                      <p>{user.fullName}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      <p>{user.phoneNumber || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Blood Group</label>
                      <p><span className="blood-badge">{user.bloodGroup || 'N/A'}</span></p>
                    </div>
                    <div className="info-item">
                      <label>Location</label>
                      <p>{user.location || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Age</label>
                      <p>{user.age ? `${user.age} Years` : 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Availability Status</label>
                      <p style={{ color: user.isAvailable ? '#2e7d32' : '#c62828', fontWeight: 'bold' }}>
                        {user.isAvailable ? '🟢 Available to Donate' : '🔴 Unavailable'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ======== AVAILABLE REQUESTS TAB ======== */}
              {activeTab === 'requests' && (
                <div>
                  <h2>Available Blood Requests ({requests.length})</h2>
                  {requests.length === 0 ? (
                    <div className="no-data">No blood requests available for your blood group ({user?.bloodGroup}) at this time.</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Seeker</th>
                          <th>Blood Group</th>
                          <th>Location</th>
                          <th>Contact</th>
                          <th>Note</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req._id}>
                            <td>{req.seeker?.fullName || 'Anonymous'}</td>
                            <td><span className="blood-badge">{req.bloodGroup}</span></td>
                            <td>{req.location}</td>
                            <td>{req.seeker?.phoneNumber || 'N/A'}</td>
                            <td>{req.note || '—'}</td>
                            <td>{formatDate(req.createdAt)}</td>
                            <td>
                              <button className="action-btn" onClick={() => handleAcceptRequest(req._id)}>
                                Accept
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ======== DONATION HISTORY TAB ======== */}
              {activeTab === 'history' && (
                <div>
                  <h2>Donation History</h2>
                  {history.length === 0 ? (
                    <div className="no-data">No donation history recorded yet.</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Seeker Name</th>
                          <th>Blood Group</th>
                          <th>Location</th>
                          <th>Contact</th>
                          <th>Date Accepted</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item) => (
                          <tr key={item._id}>
                            <td>{item.seeker?.fullName || 'Seeker'}</td>
                            <td><span className="blood-badge">{item.bloodGroup}</span></td>
                            <td>{item.location}</td>
                            <td>{item.seeker?.phoneNumber || 'N/A'}</td>
                            <td>{formatDate(item.acceptedAt)}</td>
                            <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ======== UPDATE PROFILE TAB ======== */}
              {activeTab === 'updateProfile' && (
                <div className="form-container">
                  <h2>Update Profile</h2>
                  <form onSubmit={handleProfileSave}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        value={profileForm.age}
                        onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="submit-btn" disabled={profileSaving}>
                      {profileSaving ? 'Saving...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;
