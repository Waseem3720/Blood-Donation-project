import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../components/Sidebar';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import AdminRequestsTable from '../components/admin/AdminRequestsTable';
import ViewDonors from '../components/admin/ViewDonors';
import ViewSeekers from '../components/admin/ViewSeekers';
import '../assets/adminDashboard.css';

const adminTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'requests', label: 'Blood Requests', icon: '🩸' },
  { id: 'donors', label: 'View Donors', icon: '🩸' },
  { id: 'seekers', label: 'View Seekers', icon: '🧑' },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

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
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(user => user._id !== userId));
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <DashboardNavbar 
        role="Admin"
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="dashboard-container">
        <Sidebar 
          tabs={adminTabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <main className="dashboard-main">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-spinner">Loading Admin Dashboard...</div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="admin-overview">
                  <h2>All Users Management</h2>
                  <AdminUsersTable 
                    users={users} 
                    onDelete={handleDeleteUser} 
                    onBlock={handleBlockUser} 
                  />
                </div>
              )}

              {activeTab === 'requests' && (
                <AdminRequestsTable requests={requests} />
              )}

              {activeTab === 'donors' && (
                <ViewDonors />
              )}

              {activeTab === 'seekers' && (
                <ViewSeekers />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;