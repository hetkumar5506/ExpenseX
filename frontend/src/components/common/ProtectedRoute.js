// File: src/components/common/ProtectedRoute.js
// ACTION: Replace the ENTIRE file content with this updated version.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // This part is still correct: wait for authentication to finish before deciding.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // --- THE UPDATE IS HERE ---
  // If loading is done and the user is NOT authenticated,
  // we now redirect to the new '/auth' page.
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If loading is done and the user is authenticated, render the requested page.
  return children;
};

export default ProtectedRoute;