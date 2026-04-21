import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for local development
// In production, set VITE_API_BASE_URL environment variable
// Production backend: https://drims-rnv0.onrender.com
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV || isLocalhost ? 'http://localhost:8080/api' : ''); 

// Debug: Log the API URL being used
console.log('API Base URL:', API_BASE_URL);
console.log('Environment Variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || 'Not Set (Using Fallback)');
console.log('Development Mode:', import.meta.env.DEV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout to prevent hanging requests
  withCredentials: false,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors and timeouts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message === 'timeout of 10000ms exceeded') {
      console.error('Request timeout - The server is taking too long to respond');
      error.message = 'Request timeout. Please check if the backend server is running on ' + API_BASE_URL;
    }
    
    // Handle network errors (server not reachable)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network error - Cannot reach the server');
      const backendUrl = (import.meta.env.DEV || isLocalhost) ? 'http://localhost:8080' : API_BASE_URL.replace('/api', '');
      error.message = `Cannot connect to the server. Please ensure the backend is running on ${backendUrl}`;
    }
    
    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 errors (Forbidden)
    if (error.response?.status === 403) {
      const token = localStorage.getItem('token');
      console.error('Access denied (403). Details:', {
        url: error.config?.url,
        hasToken: !!token,
        tokenLength: token?.length,
        response: error.response?.data
      });
      
      // If no token, redirect to login
      if (!token) {
        console.error('No token found. Redirecting to login.');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else {
        // Token exists but access denied - might be expired or invalid role
        console.error('Token exists but access denied. Token might be expired or user lacks required role.');
        // Optionally clear token and redirect if it seems invalid
        // Uncomment below if you want to auto-redirect on 403
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // if (!window.location.pathname.includes('/login')) {
        //   window.location.href = '/login';
        // }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

