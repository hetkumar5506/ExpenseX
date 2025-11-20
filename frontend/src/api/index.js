// File: src/api/index.js
// ACTION: Replace the ENTIRE file content with this.

import axios from 'axios';

// --- NEW: Global error handling ---
// We create a simple event emitter to notify the app of a server error.
export const apiEvents = new EventTarget();

// Your existing axios instance
const api = axios.create({
  // baseURL: 'http://localhost:5050/api', for laptop
  baseURL: 'http://192.168.1.3:5050/api', // for phone testing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Your existing request interceptor for adding the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- NEW: Response Interceptor to catch server errors ---
api.interceptors.response.use(
  // If the response is successful, just pass it through
  (response) => {
    // If we are recovering from a previous server error, dispatch an event to clear it
    apiEvents.dispatchEvent(new CustomEvent('clearServerError'));
    return response;
  },
  // If there's an error...
  (error) => {
    // Check if it's a network error (server is down) or a 5xx server crash
    if (!error.response || error.response.status >= 500) {
      // Dispatch a global event that our MainLayout can listen for
      apiEvents.dispatchEvent(new CustomEvent('serverError'));
    }
    // Very important: still reject the promise so the component's .catch() block runs
    return Promise.reject(error);
  }
);

export default api;