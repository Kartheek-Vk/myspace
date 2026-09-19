/**
 * Axios API client with JWT authentication interceptors.
 * 
 * - Automatically adds Bearer token to all requests
 * - Handles 401 responses by clearing auth state
 * - Configurable base URL from environment
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from auth store (localStorage-backed via zustand persist)
    const authData = localStorage.getItem('myspace-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed?.state?.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Invalid auth data, ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth state
      const authData = localStorage.getItem('myspace-auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          // Only clear if user was authenticated (not guest)
          if (parsed?.state?.authMode === 'google') {
            localStorage.removeItem('myspace-auth');
            // Trigger page reload to show login screen
            window.location.reload();
          }
        } catch {
          // Ignore
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
