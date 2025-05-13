import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import {
  getCurrentUser,
  getDonorRequests,
  acceptBloodRequest,
  completeBloodRequest,
  updateProfile,
} from '../services/api';

import DonationHistory from '../components/donor/DonationHistory';
import ProfileManagement from '../components/donor/ProfileManagement';
import AvailableRequests from '../components/donor/AvailableRequests';

import '../assets/donorDashboard.css';

const DonorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('userInfo');
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Fetch user and requests on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, requestsData] = await Promise.all([
          getCurrentUser(),
          getDonorRequests(),
        ]);
        setUser(userData.data);
        setRequests(requestsData.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (newRequest) => {
      if (user?.bloodGroup === newRequest.bloodGroup) {
        setRequests((prev) => [newRequest, ...prev]);
      }
    };

    const handleRequestCancelled = (requestId) => {
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    };

    socket.on('newBloodRequest', handleNewRequest);
    socket.on('requestCancelled', handleRequestCancelled);

    return () => {
      socket.off('newBloodRequest', handleNewRequest);
      socket.off('requestCancelled', handleRequestCancelled);
    };
  }, [socket, user?.bloodGroup]);

  // Handlers
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await acceptBloodRequest(requestId);
      const updatedRequest = response.data;
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? updatedRequest : req))
      );
      socket?.emit('requestAccepted', updatedRequest);
    } catch (err) {
      setError(err.message || 'Failed to accept request');
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      await completeBloodRequest(requestId);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      setError(err.message || 'Failed to complete request');
    }
  };

  const handleSaveProfile = async (profileData) => {
    try {
      const response = await updateProfile(profileData);
      setUser(response.data);
      return response;
    } catch (err) {
      throw err;
    }
  };

  // UI
  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="donor-dashboard">
      <header className="dashboard-header">
        <h1><strong>Donor Dashboard</strong></h1>
      </header>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeSection === 'userInfo' ? 'active' : ''}`}
          onClick={() => setActiveSection('userInfo')}
        >
          User Info
        </button>
        <button
          className={`tab-btn ${activeSection === 'pendingRequests' ? 'active' : ''}`}
          onClick={() => setActiveSection('pendingRequests')}
        >
          Available Requests
        </button>
        <button
          className={`tab-btn ${activeSection === 'donationHistory' ? 'active' : ''}`}
          onClick={() => setActiveSection('donationHistory')}
        >
          Donation History
        </button>
        <button
          className={`tab-btn ${activeSection === 'updateProfile' ? 'active' : ''}`}
          onClick={() => setActiveSection('updateProfile')}
        >
          Update Profile
        </button>
        <button
          className="tab-btn logout-tab"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeSection === 'userInfo' && user && (
        <div className="user-info-card">
          <h3>Your Information</h3>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</p>
          <p><strong>Location:</strong> {user.location}</p>
          {/* Blood Group removed intentionally */}
        </div>
      )}

      {activeSection === 'pendingRequests' && (
        <AvailableRequests
          requests={requests.filter((req) => req.status === 'pending')}
          onAccept={handleAcceptRequest}
          bloodGroup={user?.bloodGroup}
          title="Available Requests"
        />
      )}

      {activeSection === 'donationHistory' && (
        <DonationHistory
          requests={requests.filter((req) => req.status !== 'pending')}
          onComplete={handleCompleteRequest}
        />
      )}

      {activeSection === 'updateProfile' && user && (
        <ProfileManagement user={user} onUpdate={handleSaveProfile} />
      )}
    </div>
  );
};

export default DonorDashboard;
