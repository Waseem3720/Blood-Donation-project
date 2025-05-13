import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import AdminRequestsTable from '../components/admin/AdminRequestsTable';
import '../assets/adminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersRes, requestsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/requests')
      ]);

      setUsers(usersRes.data?.data || []);
      setRequests(requestsRes.data?.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleNewUser = (newUser) => {
      setUsers(prev => [newUser, ...prev]);
    };

    const handleUserUpdated = (updatedUser) => {
      setUsers(prev => prev.map(user =>
        user._id === updatedUser._id ? updatedUser : user
      ));
    };

    const handleUserDeleted = (userId) => {
      setUsers(prev => prev.filter(user => user._id !== userId));
    };

    const handleNewRequest = (newRequest) => {
      setRequests(prev => [newRequest, ...prev]);
    };

    const handleRequestUpdated = (updatedRequest) => {
      setRequests(prev => prev.map(req =>
        req._id === updatedRequest._id ? updatedRequest : req
      ));
    };

    if (socket) {
      socket.on('newUser', handleNewUser);
      socket.on('userUpdated', handleUserUpdated);
      socket.on('userDeleted', handleUserDeleted);
      socket.on('newBloodRequest', handleNewRequest);
      socket.on('requestUpdated', handleRequestUpdated);
    }

    return () => {
      if (socket) {
        socket.off('newUser', handleNewUser);
        socket.off('userUpdated', handleUserUpdated);
        socket.off('userDeleted', handleUserDeleted);
        socket.off('newBloodRequest', handleNewRequest);
        socket.off('requestUpdated', handleRequestUpdated);
      }
    };
  }, [socket]);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(user => user._id !== userId));
      if (socket) {
        socket.emit('adminDeletedUser', userId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/block`, { isBlocked });
      setUsers(prev => prev.map(user =>
        user._id === userId ? { ...user, isBlocked: data.isBlocked } : user
      ));
      if (socket) {
        socket.emit('adminBlockedUser', { userId, isBlocked });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Blood Requests
        </button>
        <button
          className="tab-btn logout"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'users' ? (
          <AdminUsersTable
            users={users}
            onDelete={handleDeleteUser}
            onBlock={handleBlockUser}
          />
        ) : (
          <AdminRequestsTable requests={requests} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
