import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://edginess-cultural-decidable.ngrok-free.dev/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const siswa = localStorage.getItem('siswa');
    const admin = localStorage.getItem('admin');
    
    if (siswa) {
      const siswaData = JSON.parse(siswa);
      config.headers['X-User-NIS'] = siswaData.nis;
    } else if (admin) {
      const adminData = JSON.parse(admin);
      config.headers['X-Admin-ID'] = adminData.id_admin;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('siswa');
      localStorage.removeItem('admin');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
