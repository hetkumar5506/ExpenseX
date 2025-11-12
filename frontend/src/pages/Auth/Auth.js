// File: src/pages/Auth/Auth.js
// ACTION: Replace the ENTIRE file content with this robust version.

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- THE DEFINITIVE FIX IS HERE: We trim whitespace from all inputs ---
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (isLoginView) {
      if (!trimmedEmail || !trimmedPassword) {
        alert("Please enter both email and password.");
        return;
      }
      login({ email: trimmedEmail, password: trimmedPassword });
    } else {
      const trimmedName = name.trim();
      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        alert("Please fill all fields.");
        return;
      }
      register({ name: trimmedName, email: trimmedEmail, password: trimmedPassword });
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2>{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
        <p className="auth-subtitle">
          {isLoginView ? 'Sign in to access your expenses' : 'Start tracking your finances today!'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button">
            {isLoginView ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="toggle-auth">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;