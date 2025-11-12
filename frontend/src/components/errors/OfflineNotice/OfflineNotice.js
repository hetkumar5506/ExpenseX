// File: src/components/errors/OfflineNotice/OfflineNotice.js
// ACTION: Create this new folder and file.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi } from 'react-icons/fa';
import './OfflineNotice.css';

const OfflineNotice = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    className="offline-notice-container"
                    initial={{ y: '-100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <FaWifi className="offline-icon" />
                    <div className="offline-text">
                        <strong>No Internet Connection</strong>
                        <span>Please check your connection and try again.</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineNotice;