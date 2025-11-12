// File: src/components/errors/ServerError/ServerError.js
// ACTION: Create this new folder and file.

import React from 'react';
import { motion } from 'framer-motion';
import { FaServer } from 'react-icons/fa';
import './ServerError.css';

const ServerError = ({ onRetry }) => {
    return (
        <div className="server-error-container">
            <motion.div
                className="server-error-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="server-error-icon">
                    <FaServer />
                </div>
                <h2 className="server-error-title">Server Connection Error</h2>
                <p className="server-error-message">
                    We're having trouble connecting to our servers right now. Please check your internet connection or try again in a few moments.
                </p>
                <button onClick={onRetry} className="server-error-retry-button">
                    Try Again
                </button>
            </motion.div>
        </div>
    );
};

export default ServerError;