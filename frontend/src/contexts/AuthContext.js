// File: src/contexts/AuthContext.js
// ACTION: Replace the ENTIRE file content with this updated version.

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dataVersion, setDataVersion] = useState(0);

  const triggerDataRefresh = () => {
    setDataVersion(currentVersion => currentVersion + 1);
  };

  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Session expired or token is invalid. Logging out.');
          logout();
        }
      }
      setLoading(false);
    };
    validateTokenAndFetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dataVersion]);

  const login = async (credentials) => {
    console.log('Attempting to log in with credentials:', credentials);
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      // --- THE UPDATE IS HERE ---
      // On successful login, navigate to the new dashboard path.
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      alert(`Login Failed: ${message}`);
    }
  };

  const register = async (userData) => {
    console.log('Attempting to register with data:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      // --- THE UPDATE IS HERE ---
      // On successful registration, navigate to the new dashboard path.
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Could not create account.';
      alert(`Registration Failed: ${message}`);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // --- THE UPDATE IS HERE ---
    // On logout, navigate to the root Welcome page.
    navigate('/');
  };

  const value = { 
    user, 
    token, 
    isAuthenticated: !!user, 
    loading, 
    login, 
    register, 
    logout,
    dataVersion,
    triggerDataRefresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);