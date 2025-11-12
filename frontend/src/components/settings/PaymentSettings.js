// File: src/components/settings/PaymentSettings.js
// ACTION: Create this new file.

import React, { useState, useEffect } from 'react';
import api from '../../api';
import './SettingsForms.css';
import { FaTrash } from 'react-icons/fa';

const PaymentSettings = () => {
    const [payments, setPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({ name: '', amount: '', due_date: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/users/settings')
            .then(res => {
                // Ensure upcoming_payments is always an array
                setPayments(res.data.upcoming_payments || []);
            })
            .catch(err => console.error("Failed to fetch settings", err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleNewPaymentChange = (e) => {
        setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
    };

    const saveSettings = async (updatedPayments) => {
        try {
            await api.put('/users/settings/upcoming-payments', { payments: updatedPayments });
            setMessage({ type: 'success', text: 'Payment reminders updated!' });
            return true;
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save reminders.' });
            return false;
        }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!newPayment.name || !newPayment.amount || !newPayment.due_date) {
            setMessage({ type: 'error', text: 'Please fill all fields for the new payment.'});
            return;
        }
        const updatedPayments = [...payments, newPayment];
        const success = await saveSettings(updatedPayments);
        if (success) {
            setPayments(updatedPayments);
            setNewPayment({ name: '', amount: '', due_date: '' }); // Reset form
        }
    };

    const handleDeletePayment = async (indexToDelete) => {
        const updatedPayments = payments.filter((_, index) => index !== indexToDelete);
        const success = await saveSettings(updatedPayments);
        if (success) {
            setPayments(updatedPayments);
        }
    };

    return (
        <div>
            <h2>Upcoming Payment Reminders</h2>
            <p>Add future payments here to get a notification the day before they are due.</p>
            
            <div className="payment-list">
                <h3>Current Reminders</h3>
                {isLoading ? <p>Loading...</p> : payments.length === 0 ? <p>No payment reminders set.</p> : (
                    <ul>
                        {payments.map((p, index) => (
                            <li key={index}>
                                <div className="payment-info">
                                    <strong>{p.name}</strong> - <span>${p.amount} due on {p.due_date}</span>
                                </div>
                                <button className="delete-payment-btn" onClick={() => handleDeletePayment(index)}><FaTrash /></button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <form onSubmit={handleAddPayment} className="settings-form add-payment-form">
                <h3>Add New Reminder</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Payment Name</label>
                        <input type="text" name="name" placeholder="e.g., Rent" value={newPayment.name} onChange={handleNewPaymentChange} />
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input type="number" step="0.01" name="amount" placeholder="e.g., 1200" value={newPayment.amount} onChange={handleNewPaymentChange} />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" name="due_date" value={newPayment.due_date} onChange={handleNewPaymentChange} />
                    </div>
                </div>
                <button type="submit">Add Reminder</button>
                {message && <div className={`message ${message.type}`}>{message.text}</div>}
            </form>
        </div>
    );
};

export default PaymentSettings;