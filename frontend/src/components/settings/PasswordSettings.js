// File: src/components/settings/PasswordSettings.js
import React, { useState } from 'react';
import api from '../../api';
import './SettingsForms.css';

const PasswordSettings = () => {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match." });
            return;
        }
        setIsLoading(true); setMessage('');
        try {
            await api.put('/users/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: "Password updated successfully!" });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const errorText = error.response?.data?.message || "Failed to update password.";
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input id="currentPassword" name="currentPassword" type="password" value={passwords.currentPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input id="newPassword" name="newPassword" type="password" value={passwords.newPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Password'}</button>
                {message && <div className={`message ${message.type}`}>{message.text}</div>}
            </form>
        </div>
    );
};

export default PasswordSettings;