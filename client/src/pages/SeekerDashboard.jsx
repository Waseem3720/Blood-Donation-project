import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  getSeekerRequests,
  createBloodRequest,
  cancelBloodRequest,
  updateProfile,
  getDonorLocations,
} from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../components/Sidebar';
import '../assets/seekerDashboard.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const seekerTabs = [
  { id: 'userInfo', label: 'Dashboard', icon: '🏠' },
  { id: 'viewRequests', label: 'View Requests', icon: '📋' },
  { id: 'createRequest', label: 'Create Request', icon: '➕' },
];

const SeekerDashboard = () => {
  const [activeTab, setActiveTab] = useState('userInfo');
  const [requests, setRequests] = useState([]);
  const [donorLocations, setDonorLocations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');

  // New request form state
  const [requestForm, setRequestForm] = useState({ bloodGroup: '', location: '', note: '' });
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Update profile form state
  const [profileForm, setProfileForm] = useState({ fullName: '', phoneNumber: '', location: '' });
  const [profileSaving, setProfileSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [userData, requestsData, locationsData] = await Promise.all([
          getCurrentUser(),
          getSeekerRequests(),
          getDonorLocations(),
        ]);

        setUser(userData);
        setDonorLocations(Array.isArray(locationsData) ? locationsData : []);
        setProfileForm({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          location: userData.location || '',
        });
        setRequestForm({
          bloodGroup: '',
          location: '',
          note: '',
        });
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        if (err.message?.includes('401')) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleBloodGroupChange = async (selectedBg) => {
    setRequestForm((prev) => ({ ...prev, bloodGroup: selectedBg, location: '' }));
    try {
      const filteredLocations = await getDonorLocations(selectedBg);
      setDonorLocations(Array.isArray(filteredLocations) ? filteredLocations : []);
    } catch (err) {
      console.error('Failed to fetch filtered locations:', err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setProfileSuccess('');
    setRequestSuccess('');
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.bloodGroup) {
      setError('Please select a blood group');
      return;
    }
    if (!requestForm.location) {
      setError('Please select a location');
      return;
    }
    setSubmittingRequest(true);
    setError('');
    try {
      const newRequest = await createBloodRequest(requestForm);
      setRequests([newRequest, ...requests]);
      setRequestSuccess('Blood request created successfully!');
      setRequestForm({ bloodGroup: '', location: '', note: '' });
      setActiveTab('viewRequests');
    } catch (err) {
      setError(err.message || 'Failed to create request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelBloodRequest(requestId);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      setError(err.message || 'Failed to cancel request');
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
        role="Seeker"
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />

      <div className="dashboard-container">
        <Sidebar
          tabs={seekerTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <main className="dashboard-main">
          {error && <div className="alert-message error">{error}</div>}
          {profileSuccess && <div className="alert-message success">{profileSuccess}</div>}
          {requestSuccess && <div className="alert-message success">{requestSuccess}</div>}

          {loading ? (
            <div className="no-data">Loading Seeker Dashboard...</div>
          ) : (
            <div className="dashboard-content">
              {/* ======== USER INFO TAB ======== */}
              {activeTab === 'userInfo' && user && (
                <div className="user-info-section">
                  <h2>Seeker Profile Overview</h2>
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
                      <label>Location</label>
                      <p>{user.location || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Role</label>
                      <p>Blood Seeker</p>
                    </div>
                    <div className="info-item">
                      <label>Total Requests Created</label>
                      <p>{requests.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ======== VIEW REQUESTS TAB ======== */}
              {activeTab === 'viewRequests' && (
                <div>
                  <h2>My Blood Requests ({requests.length})</h2>
                  {requests.length === 0 ? (
                    <div className="no-data">No blood requests created yet. Click "Create Request" to create one.</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Blood Group</th>
                          <th>Location</th>
                          <th>Note</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Accepted Donor Info</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req._id}>
                            <td><span className="blood-badge">{req.bloodGroup}</span></td>
                            <td>{req.location}</td>
                            <td>{req.note || '—'}</td>
                            <td>{formatDate(req.createdAt)}</td>
                            <td><span className={`status-badge ${req.status}`}>{req.status}</span></td>
                            <td>
                              {req.acceptedBy ? (
                                <div className="accepted-info">
                                  ✓ {req.acceptedBy.fullName || 'Donor'} ({req.acceptedBy.phoneNumber || 'No Phone'})
                                </div>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td>
                              {req.status === 'pending' ? (
                                <button className="action-btn cancel" onClick={() => handleCancelRequest(req._id)}>
                                  Cancel
                                </button>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ======== CREATE NEW REQUEST TAB ======== */}
              {activeTab === 'createRequest' && (
                <div className="form-container">
                  <h2>Create New Blood Request</h2>
                  <form onSubmit={handleCreateRequest}>
                    <div className="form-group">
                      <label>Blood Group Required *</label>
                      <select
                        value={requestForm.bloodGroup}
                        onChange={(e) => handleBloodGroupChange(e.target.value)}
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Select City / Location *</label>
                      <select
                        value={requestForm.location}
                        onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                        required
                      >
                        <option value="">Select Location</option>
                        {donorLocations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Note / Additional Details</label>
                      <textarea
                        rows="3"
                        value={requestForm.note}
                        onChange={(e) => setRequestForm({ ...requestForm, note: e.target.value })}
                        placeholder="e.g. Hospital name, urgency level, room number..."
                      />
                    </div>

                    <button type="submit" className="submit-btn" disabled={submittingRequest}>
                      {submittingRequest ? 'Submitting...' : 'Submit Blood Request'}
                    </button>
                  </form>
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
                      <label>Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="Enter location"
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

export default SeekerDashboard;