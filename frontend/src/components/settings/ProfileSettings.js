// File: src/components/settings/ProfileSettings.js
// ACTION: Replace the ENTIRE file content.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../api';
import './SettingsForms.css';

const ProfileSettings = () => {
    const { user, triggerDataRefresh } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            // --- THE CACHE-BUSTING FIX ---
            // If a photo URL exists, append a unique timestamp to force the browser to reload it.
            if (user.profile_photo_url) {
                setPreview(`http://localhost:5050${user.profile_photo_url}?v=${new Date().getTime()}`);
            } else {
                setPreview(null);
            }
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleThemeChange = async (newTheme) => {
        toggleTheme(newTheme); // Update theme visually immediately
        try {
            await api.put('/users/profile', { theme: newTheme });
            triggerDataRefresh(); // Refresh user data to confirm
        } catch (error) {
            console.error("Failed to save theme preference", error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true); setMessage('');
        try {
            if (name !== user.name) {
                await api.put('/users/profile', { name });
            }
            if (selectedFile) {
                const formData = new FormData();
                formData.append('profile_photo', selectedFile);
                await api.put('/users/profile-photo', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            }
            
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            triggerDataRefresh();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="settings-panel">
            <div className="settings-card">
                <h2>Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="settings-form">
                    <div className="profile-photo-section">
                        <label>Profile Photo</label>
                        <div className="photo-uploader">
                            <img src={preview || 'https://via.placeholder.com/100'} alt="Profile" className="profile-preview"/>
                            <input type="file" id="photo-upload" accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="photo-upload" className="upload-btn">Change</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
                    {message && <div className={`message ${message.type}`}>{message.text}</div>}
                </form>
            </div>
            <div className="settings-card">
                <h2>Appearance</h2>
                <p>Choose how ExpenseX looks. Your preference will be saved.</p>
                <div className="theme-selector">
                    <button className={`theme-option light-option ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>Light</button>
                    <button className={`theme-option dark-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>Dark</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;