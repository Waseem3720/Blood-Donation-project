import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Notification-related API calls
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

// Get current logged-in user (full profile)
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Update current user profile
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/me', profileData);
  return response.data;
};

// Seeker API calls
export const getSeekerRequests = async () => {
  const response = await api.get('/seeker/requests');
  return response.data?.data || response.data || [];
};

export const createBloodRequest = async (requestData) => {
  const response = await api.post('/seeker/requests', requestData);
  return response.data?.data || response.data;
};

export const cancelBloodRequest = async (requestId) => {
  await api.put(`/seeker/requests/${requestId}/cancel`);
};

export const getPotentialDonors = async (requestId) => {
  const response = await api.get(`/requests/${requestId}/donors`);
  return response.data;
};

export const getDonorLocations = async (bloodGroup) => {
  const params = bloodGroup ? { bloodGroup } : {};
  const response = await api.get('/seeker/donor-locations', { params });
  return response.data?.data || response.data || [];
};

// Donor API calls
export const getDonationHistory = async () => {
  const response = await api.get('/donor/history');
  return response.data?.data || response.data || [];
};

export default api;

