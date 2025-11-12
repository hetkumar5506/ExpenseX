// File: src/App.js
// ACTION: Replace the ENTIRE file content with this.

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import OfflineNotice from './components/errors/OfflineNotice/OfflineNotice';
import { useAuth } from './contexts/AuthContext';

// Import All Pages
import Welcome from './pages/Welcome/Welcome'; // Your Welcome page
import AuthPage from './pages/Auth/Auth';
import HomePage from './pages/Home/Home';
import ScanPage from './pages/ScanPage';
import PendingExpensesPage from './pages/PendingExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AllExpensesPage from './pages/AllExpensesPage';
import SearchPage from './pages/SearchPage';
import Error404 from './pages/Error404/Error404';

// This is a new helper component. If a logged-in user tries to visit a public
// page (like Welcome or Login), it will automatically redirect them to their dashboard.
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    // If the user is authenticated, redirect them away from public pages.
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <>
      <OfflineNotice />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        {/* The root path '/' now shows the Welcome page */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Welcome />
            </PublicRoute>
          } 
        />
        {/* The login/register page is now at '/auth' */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />

        {/* --- PROTECTED ROUTES (Your main application) --- */}
        {/* All authenticated pages are now nested under '/dashboard' */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* The index route for '/dashboard' is the HomePage */}
          <Route index element={<HomePage />} /> 
          <Route path="scan" element={<ScanPage />} />
          <Route path="pending-expenses" element={<PendingExpensesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="expenses" element={<AllExpensesPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        {/* --- REDIRECTS FOR OLD URLS (Good practice) --- */}
        {/* This handles bookmarks or old links by redirecting them to the new structure */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/scan" element={<Navigate to="/dashboard/scan" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/expenses" element={<Navigate to="/dashboard/expenses" replace />} />
        <Route path="/search" element={<Navigate to="/dashboard/search" replace />} />
        
        {/* CATCH-ALL 404 ROUTE */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default App;