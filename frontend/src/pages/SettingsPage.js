// File: src/pages/SettingsPage.js
// ACTION: Replace the ENTIRE file content with this corrected version.

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SettingsPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaTrash, FaCalendarAlt, FaTags, FaPalette } from 'react-icons/fa';

// --- THE FIX IS HERE: Use the correct filenames from your project structure ---
import ProfileSettings from '../components/settings/ProfileSettings';
import PasswordSettings from '../components/settings/PasswordSettings'; // CORRECTED
import PaymentSettings from '../components/settings/PaymentSettings';
import CategorySettings from '../components/settings/CategorySettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import DeleteAccount from '../components/settings/DeleteAccount'; // CORRECTED

const SettingsPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const renderContent = () => {
        // --- AND THE FIX IS HERE in the switch statement ---
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'security':
                return <PasswordSettings />; // CORRECTED
            case 'appearance':
                return <AppearanceSettings />;
            case 'categories':
                return <CategorySettings />;
            case 'payments':
                return <PaymentSettings />;
            case 'delete':
                return <DeleteAccount />; // CORRECTED
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="settings-page-container">
            <h1>Settings</h1>
            <p className="settings-subheader">Manage your account settings, preferences, and personal data.</p>
            <div className="settings-layout">
                <nav className="settings-nav">
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}><FaUser /> Profile</button>
                    <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}><FaLock /> Security</button>
                    <button className={activeTab === 'appearance' ? 'active' : ''} onClick={() => setActiveTab('appearance')}><FaPalette /> Appearance</button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}><FaTags /> Categories</button>
                    <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}><FaCalendarAlt /> Payments</button>
                    <button className={`${activeTab === 'delete' ? 'active' : ''} danger-nav`} onClick={() => setActiveTab('delete')}><FaTrash /> Delete Account</button>
                </nav>
                <main className="settings-content-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;