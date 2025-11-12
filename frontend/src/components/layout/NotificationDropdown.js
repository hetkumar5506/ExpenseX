// File: src/components/layout/NotificationDropdown.js
// ACTION: Replace the ENTIRE file content with this.

import React from 'react';
import { motion } from 'framer-motion';
import './NotificationDropdown.css';
import { FaCheckDouble, FaBell } from 'react-icons/fa'; // Import FaBell for the icon

const NotificationItem = ({ notification }) => {
    // --- NEW: Regex to parse the message string ---
    // This will find the payment name in quotes and the amount after the Rupee sign.
    const paymentRegex = /"([^"]+)" of ₹([\d,]+\.?\d*)/;
    const match = notification.message.match(paymentRegex);

    let paymentName = "A payment";
    let paymentAmount = "";

    if (match) {
        paymentName = match[1];
        paymentAmount = match[2];
    }

    // Helper to format the timestamp
    const timeAgo = (dateStr) => {
        if (!dateStr) return ''; // Guard against null timestamps
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ''; // Check for invalid date

        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        // --- NEW: Reworked JSX for a richer layout ---
        <div className={`notification-item ${notification.read_status}`}>
            <div className="notification-icon">
                <FaBell />
            </div>
            <div className="notification-content">
                <p className="notification-title">Payment Reminder</p>
                <p className="notification-body">
                    Your <strong>{paymentName}</strong> payment is due tomorrow.
                </p>
                {/* --- THE FIX IS HERE: Reads from 'timestamp' not 'created_at' --- */}
                <span className="notification-timestamp">{timeAgo(notification.timestamp)}</span>
            </div>
            {paymentAmount && <div className="notification-amount">₹{paymentAmount}</div>}
        </div>
    );
};

const NotificationDropdown = ({ notifications, onMarkAllRead, unreadCount }) => {
    return (
        <motion.div 
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            <div className="notification-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                    <button className="mark-all-read-btn" onClick={onMarkAllRead}>
                        <FaCheckDouble /> Mark all as read
                    </button>
                )}
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p className="no-notifications">You have no new notifications.</p>
                ) : (
                    notifications.map(notif => <NotificationItem key={notif.id} notification={notif} />)
                )}
            </div>
        </motion.div>
    );
};

export default NotificationDropdown;