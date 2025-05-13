import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import {
  getCurrentUser,
  getSeekerRequests,
  createBloodRequest,
  cancelBloodRequest
} from '../services/api';

import RequestForm from '../components/seeker/RequestForm';
import RequestHistory from '../components/seeker/RequestHistory';
import ProfileManagement from '../components/seeker/ProfileManagement';

import '../assets/seekerDashboard.css';

const SeekerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('userInfo');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [userData, requestsData] = await Promise.all([
          getCurrentUser(),
          getSeekerRequests()
        ]);
        setUser(userData.data);
        setRequests(requestsData.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleRequestAccepted = (data) => {
      setRequests(prev =>
        prev.map(req => (req._id === data._id ? data : req))
      );
    };

    if (socket) socket.on('requestAccepted', handleRequestAccepted);
    return () => socket?.off('requestAccepted', handleRequestAccepted);
  }, [socket]);

  const handleCreateRequest = async (requestData) => {
    try {
      setError('');
      const response = await createBloodRequest({
        ...requestData,
        seeker: user._id
      });
      const newRequest = response.data;
      setRequests([newRequest, ...requests]);
      setActiveSection('viewRequests');
      if (socket) socket.emit('newBloodRequest', newRequest);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelBloodRequest(requestId);
      setRequests(prev => prev.filter(req => req._id !== requestId));
      if (socket) socket.emit('requestCancelled', requestId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveChanges = (updatedUser) => {
    setUser(updatedUser.data);
    setActiveSection('userInfo');
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="seeker-dashboard">
      <header className="dashboard-header">
        <h1><strong>Seeker Dashboard</strong></h1>
      </header>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeSection === 'userInfo' ? 'active' : ''}`}
          onClick={() => setActiveSection('userInfo')}
        >
          User Info
        </button>
        <button
          className={`tab-btn ${activeSection === 'viewRequests' ? 'active' : ''}`}
          onClick={() => setActiveSection('viewRequests')}
        >
          View Requests
        </button>
        <button
          className={`tab-btn ${activeSection === 'createRequest' ? 'active' : ''}`}
          onClick={() => setActiveSection('createRequest')}
        >
          Create New Request
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
        </div>
      )}

      {activeSection === 'updateProfile' && user && (
        <ProfileManagement
          user={user}
          onUpdate={handleSaveChanges}
        />
      )}

      {activeSection === 'createRequest' && (
        <RequestForm
          onSubmit={handleCreateRequest}
          onCancel={() => setActiveSection('viewRequests')}
          initialLocation={user?.location}
        />
      )}

      {activeSection === 'viewRequests' && (
        <RequestHistory
          requests={requests}
          onCancelRequest={handleCancelRequest}
        />
      )}
    </div>
  );
};

export default SeekerDashboard;
