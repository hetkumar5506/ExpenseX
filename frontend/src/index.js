// File: src/index.js
// ACTION: Replace the entire file content with this.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // <-- Import ThemeProvider
import App from './App';
import './styles/main.css';
import './styles/theme.css'; // <-- Import new theme stylesheet

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider> {/* <-- Wrap App with ThemeProvider */}
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);