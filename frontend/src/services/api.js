import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || '/api';
if (rawBaseURL !== '/api' && !rawBaseURL.endsWith('/api')) {
  rawBaseURL = rawBaseURL.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
  baseURL: rawBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartride_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('smartride_token');
        localStorage.removeItem('smartride_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const rideService = {
  searchRides: (params) => api.get('/rides/search', { params }),
  getRideById: (id) => api.get(`/rides/${id}`),
};

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export const driverService = {
  apply: (data) => api.post('/drivers/apply', data),
  getProfile: () => api.get('/drivers/profile'),
  updateProfile: (data) => api.put('/drivers/profile', data),
  getDashboard: () => api.get('/driver/dashboard'),
  offerRide: (data) => api.post('/driver/rides', data),
  getRides: () => api.get('/driver/rides'),
  getRideById: (id) => api.get(`/driver/rides/${id}`),
  updateRide: (id, data) => api.put(`/driver/rides/${id}`, data),
  cancelRide: (id) => api.delete(`/driver/rides/${id}`),
  getRidePassengers: (rideId) => api.get(`/driver/rides/${rideId}/passengers`),
  getHistory: () => api.get('/driver/history'),
  getEarnings: () => api.get('/driver/earnings'),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  getDrivers: () => api.get('/admin/drivers'),
  approveDriver: (id) => api.put(`/admin/drivers/${id}/approve`),
  rejectDriver: (id) => api.put(`/admin/drivers/${id}/reject`),
  getRides: () => api.get('/admin/rides'),
  deleteRide: (id) => api.delete(`/admin/rides/${id}`),
  getBookings: () => api.get('/admin/bookings'),
};

export default api;
