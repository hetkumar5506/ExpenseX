// File: src/pages/PendingExpensesPage.js
// ACTION: Replace the ENTIRE file content with this new, powerful version.

import React, { useState, useEffect } from 'react';
import api from '../api';
import './PendingExpensesPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const PendingExpensesPage = () => {
    const { triggerDataRefresh } = useAuth();
    
    const [pending, setPending] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both pending items and available categories at the same time
                const [pendingRes, categoriesRes] = await Promise.all([
                    api.get('/expenses/pending'),
                    api.get('/categories')
                ]);
                
                setPending(pendingRes.data);
                setCategories(categoriesRes.data);
                
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // NEW: Function to handle changes in the input fields during edit mode
    const handleEditChange = (id, field, value) => {
        setPending(prev => 
            prev.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleConfirm = async (id) => {
        const expenseToConfirm = pending.find(p => p.id === id);
        
        // CRITICAL CHECK: Ensure a category is selected before confirming
        if (!expenseToConfirm.category_id) {
            alert("Please select a category before confirming.");
            return;
        }

        const { vendor, amount, date, description, category_id } = expenseToConfirm;
        
        try {
            await api.put(`/expenses/${id}/confirm`, { 
                vendor, 
                amount, 
                // Ensure date is in YYYY-MM-DD format
                date: new Date(date).toISOString().split('T')[0], 
                description, 
                category_id 
            });
            // On success, remove from list and trigger global refresh
            setPending(prev => prev.filter(item => item.id !== id));
            triggerDataRefresh();
        } catch (error) {
            console.error("Failed to confirm expense:", error);
            // Show the actual error from the backend!
            const errorMsg = error.response?.data?.message || "Confirmation failed. Please check the data and try again.";
            alert(`Error: ${errorMsg}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            setPending(prev => prev.filter(item => item.id !== id));
            triggerDataRefresh();
        } catch (error) {
            console.error("Failed to delete expense:", error);
            alert("Deletion failed.");
        }
    };

    if (loading) return <p>Loading pending expenses...</p>;

    return (
        <div className="pending-page-container">
            <h1>Review Scanned Expenses</h1>
            <p>Edit and confirm the details from your scanned receipts.</p>
            <div className="pending-list">
                <AnimatePresence>
                    {pending.length > 0 ? pending.map(item => (
                        <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="pending-card-editable">
                            <div className="editable-grid">
                                <div className="form-group-inline">
                                    <label>Vendor</label>
                                    <input type="text" value={item.vendor || ''} onChange={(e) => handleEditChange(item.id, 'vendor', e.target.value)} />
                                </div>
                                <div className="form-group-inline">
                                    <label>Amount</label>
                                    <input type="number" step="0.01" value={item.amount} onChange={(e) => handleEditChange(item.id, 'amount', e.target.value)} />
                                </div>
                                <div className="form-group-inline">
                                    <label>Date</label>
                                    <input type="date" value={new Date(item.date).toISOString().split('T')[0]} onChange={(e) => handleEditChange(item.id, 'date', e.target.value)} />
                                </div>
                                <div className="form-group-inline">
                                    <label>Category *</label>
                                    <select value={item.category_id || ''} onChange={(e) => handleEditChange(item.id, 'category_id', e.target.value)}>
                                        <option value="" disabled>-- Select a Category --</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="pending-actions">
                                <button className="btn-confirm" onClick={() => handleConfirm(item.id)}>Confirm</button>
                                <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="no-pending-card">
                            <h3>All Clear!</h3>
                            <p>You have no pending expenses to review.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PendingExpensesPage;