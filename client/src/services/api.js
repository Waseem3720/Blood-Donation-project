import axios from 'axios';

// Axios instance configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add the authorization token to headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors and improve error handling
const handleApiError = (error, defaultMessage) => {
  const errorMessage = error?.response?.data?.message || defaultMessage || 'An unknown error occurred.';
  console.error(errorMessage);
  throw new Error(errorMessage);
};

// ====================== Donor Endpoints ======================
export const getDonorRequests = async () => {
  try {
    const { data } = await api.get('/donor/requests');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch donor requests');
  }
};

export const acceptBloodRequest = async (requestId) => {
  try {
    const { data } = await api.put(`/donor/requests/${requestId}/accept`);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to accept request');
  }
};

export const completeBloodRequest = async (requestId) => {
  try {
    const { data } = await api.put(`/donor/requests/${requestId}/complete`);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to complete request');
  }
};

export const updateDonorAvailability = async (isAvailable) => {
  try {
    const { data } = await api.put('/donor/availability', { isAvailable });
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to update donor availability');
  }
};

// ✅ Added: Get Donation History (matches backend route and logic)
export const getDonationHistory = async () => {
  try {
    const { data } = await api.get('/donor/donation-history');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch donation history');
  }
};

// ====================== Seeker Endpoints ======================
export const createBloodRequest = async (requestData) => {
  try {
    const { data } = await api.post('/seeker/requests', requestData);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to create request');
  }
};

export const getSeekerRequests = async () => {
  try {
    const { data } = await api.get('/seeker/requests');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch requests');
  }
};

export const cancelBloodRequest = async (requestId) => {
  try {
    const { data } = await api.put(`/seeker/requests/${requestId}/cancel`);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to cancel request');
  }
};

export const getPotentialDonors = async (requestId) => {
  try {
    const { data } = await api.get(`/seeker/requests/${requestId}/donors`);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch donors');
  }
};

// ====================== Profile Management ======================
export const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/users/me');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch user data');
  }
};

export const updateProfile = async (userData) => {
  try {
    const { data } = await api.put('/users/me', userData);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to update profile');
  }
};

// ====================== Notification Management ======================
export const getNotifications = async () => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch notifications');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const { data } = await api.put(`/notifications/${notificationId}/read`);
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to mark notification as read');
  }
};

// ====================== Dictionary History Management ======================
export const getDictionaryHistory = async () => {
  try {
    const { data } = await api.get('/dictionary/history');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to fetch dictionary history');
  }
};

export const clearDictionaryHistory = async () => {
  try {
    const { data } = await api.delete('/dictionary/history');
    return data;
  } catch (err) {
    handleApiError(err, 'Failed to clear dictionary history');
  }
};

export default api;
