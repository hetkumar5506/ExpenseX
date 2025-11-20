import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import Loader from '../../components/common/Error404Loader';
import './Error404.css';

const Error404 = () => {
  return (
    <div className="error-page-container">
      <motion.div
        className="error-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated loader */}
        <motion.div
          className="error-loader-wrapper"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <Loader />
        </motion.div>

        {/* Error Icon */}
        <div className="error-icon">
          <FaExclamationTriangle />
        </div>

        {/* 404 Text */}
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you may have typed the address incorrectly.
        </p>

        {/* Home Button */}
        <Link to="/" className="error-home-button">
          Go Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default Error404;