// File: src/components/settings/AppearanceSettings.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../api';
import './SettingsForms.css';

const AppearanceSettings = () => {
    const { theme, toggleTheme } = useTheme();

    const handleThemeChange = async (newTheme) => {
        toggleTheme(newTheme);
        try {
            await api.put('/users/profile', { theme: newTheme });
        } catch (error) {
            console.error("Failed to save theme preference", error);
        }
    };

    return (
        <div className="settings-card">
            <h2>Appearance</h2>
            <p>Choose how ExpenseX looks to you. Your preference will be saved automatically.</p>
            <div className="theme-selector">
                <button 
                    className={`theme-option light-option ${theme === 'light' ? 'active' : ''}`} 
                    onClick={() => handleThemeChange('light')}
                >
                    Light
                </button>
                <button 
                    className={`theme-option dark-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                >
                    Dark
                </button>
            </div>
        </div>
    );
};

export default AppearanceSettings;