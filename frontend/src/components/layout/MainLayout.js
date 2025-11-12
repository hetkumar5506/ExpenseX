// File: src/components/layout/MainLayout.js
// ACTION: Replace the ENTIRE file content with this.

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ServerError from '../errors/ServerError/ServerError'; // <-- IMPORT
import { apiEvents } from '../../api'; // <-- IMPORT EVENTS
import './MainLayout.css';

const MainLayout = () => {
    const [serverError, setServerError] = useState(false);
    const location = useLocation(); // Hook to detect page navigation

    // This effect sets up the global event listeners
    useEffect(() => {
        const handleServerError = () => setServerError(true);
        const handleClearError = () => setServerError(false);

        apiEvents.addEventListener('serverError', handleServerError);
        apiEvents.addEventListener('clearServerError', handleClearError);

        // Cleanup function to remove listeners when the component unmounts
        return () => {
            apiEvents.removeEventListener('serverError', handleServerError);
            apiEvents.removeEventListener('clearServerError', handleClearError);
        };
    }, []);

    // This effect clears the server error message if the user navigates to a new page
    useEffect(() => {
        if (serverError) {
            setServerError(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]); // Dependency on the current URL path

    const handleRetry = () => {
        // A simple but effective way to retry is to just reload the entire application
        window.location.reload();
    };

    return (
        <div className="main-layout">
            <Navbar />
            <main className="content-area">
                {serverError ? (
                    // If there's a server error, show the error component
                    <ServerError onRetry={handleRetry} />
                ) : (
                    // Otherwise, show the normal page content
                    <Outlet /> 
                )}
            </main>
        </div>
    );
};

export default MainLayout;