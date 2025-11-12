// File: src/components/layout/Navbar.js
// ACTION: Replace the ENTIRE file content with this.

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';
import { FaPiggyBank, FaSearch, FaHome, FaChartBar, FaCog, FaSignOutAlt, FaCamera, FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { logout, dataVersion } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        api.get('/notifications')
            .then(res => {
                setNotifications(res.data);
                const count = res.data.filter(n => n.read_status === 'unread').length;
                setUnreadCount(count);
            })
            .catch(err => console.error("Failed to fetch notifications", err));
    }, [dataVersion]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // --- THE UPDATE IS HERE ---
            // Search results page is now under /dashboard
            navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unreadIds = notifications.filter(n => n.read_status === 'unread').map(n => n.id);
            if (unreadIds.length === 0) return;
            await api.put('/notifications/read', { ids: unreadIds });
            setNotifications(prev => prev.map(n => ({ ...n, read_status: 'read' })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
            alert("Could not update notifications.");
        }
    };

    return (
        <motion.nav className="navbar" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            {/* --- SECTION 1: LOGO --- */}
            <div className="nav-section nav-logo">
                {/* --- THE UPDATE IS HERE --- */}
                {/* Logo now links to the dashboard */}
                <Link to="/dashboard">
                    <FaPiggyBank className="logo-icon" />
                    <span>ExpenseX</span>
                </Link>
            </div>

            {/* --- SECTION 2: GLOBAL SEARCH --- */}
            <div className="nav-section nav-search">
                <form onSubmit={handleSearchSubmit}>
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Search expenses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </form>
            </div>
            
            {/* --- SECTION 3: PAGE LINKS --- */}
            <div className="nav-section nav-links">
                {/* --- THE UPDATE IS HERE --- */}
                {/* All links are now relative to /dashboard */}
                <NavLink to="/dashboard" className="nav-link-item" title="Dashboard" end> {/* `end` prop ensures it's only active for the exact path */}
                    <FaHome /> <span>Dashboard</span>
                </NavLink>
                <NavLink to="/dashboard/reports" className="nav-link-item" title="Reports">
                    <FaChartBar /> <span>Reports</span>
                </NavLink>
                <NavLink to="/dashboard/settings" className="nav-link-item" title="Settings">
                    <FaCog /> <span>Settings</span>
                </NavLink>
            </div>
            
            {/* --- SECTION 4: ACTIONS --- */}
            <div className="nav-section nav-actions">
                {/* --- THE UPDATE IS HERE --- */}
                <Link to="/dashboard/scan" className="nav-scan-button">
                    <FaCamera /><span>Smart Scan</span>
                </Link>

                <div className="notification-container" ref={notificationRef}>
                    <button className="nav-icon-button" title="Notifications" onClick={() => setIsDropdownOpen(prev => !prev)}>
                        <FaBell />
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </button>
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <NotificationDropdown
                                notifications={notifications}
                                unreadCount={unreadCount}
                                onMarkAllRead={handleMarkAllRead}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <button onClick={logout} className="nav-icon-button logout-button" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
        </motion.nav>
    );
};

export default Navbar;