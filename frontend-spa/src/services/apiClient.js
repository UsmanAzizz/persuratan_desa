import axios from 'axios';
import { useToastStore } from '../store/useToastStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Optional: Only show success toast if explicitly requested via config
    if (response.config.showSuccessToast && response.data?.message) {
      useToastStore.getState().addToast(response.data.message, 'success');
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan jaringan, periksa koneksi Anda.';
    
    // Automatically dispatch error to our Zustand store instead of using alert()
    useToastStore.getState().addToast(message, 'error');
    
    // If unauthorized, redirect or clear token (can be implemented later)
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      // window.location.href = '/login'; // Optional auto-redirect
    }

    return Promise.reject(error);
  }
);

export default apiClient;
