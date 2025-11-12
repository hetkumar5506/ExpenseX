// File: src/pages/Error404/Error404.js
// ACTION: Replace the ENTIRE file content with this.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
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
                <div className="error-icon">
                    <FaExclamationTriangle />
                </div>
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Page Not Found</h2>
                <p className="error-message">
                    Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you may have typed the address incorrectly.
                </p>
                <Link to="/" className="error-home-button">
                    Go Back to Dashboard
                </Link>
            </motion.div>
        </div>
    );
};

export default Error404;