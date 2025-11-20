// File: src/components/settings/DeleteAccount.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import './SettingsForms.css';
import AnimatedDeleteButton from "./AnimatedDeleteButton";

const DeleteAccount = () => {
    const { logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsLoading(true); setMessage('');
        try {
            await api.post('/users/account/delete', { password });
            // On success, backend deletes user and token becomes invalid.
            // We just need to log out on the frontend.
            logout();
        } catch (error) {
            const errorText = error.response?.data?.message || "Failed to delete account.";
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="danger-zone">
            <h2>Delete Account</h2>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <AnimatedDeleteButton onClick={() => setIsModalOpen(true)} />

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Are you absolutely sure?</h3>
                        <p>This action cannot be undone. To confirm, please type your password.</p>
                        <form onSubmit={handleDelete} className="settings-form">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
                            </div>
                            {message && <div className={`message ${message.type}`}>{message.text}</div>}
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-danger" disabled={isLoading}>{isLoading ? 'Deleting...' : 'Confirm Deletion'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;