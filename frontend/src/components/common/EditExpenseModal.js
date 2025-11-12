// File: src/components/common/EditExpenseModal.js
// ACTION: Create this new file.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import './EditExpenseModal.css';

const EditExpenseModal = ({ isOpen, onClose, expense, categories, onSave, onDelete }) => {
    const [editedExpense, setEditedExpense] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        // When the expense prop changes, update the internal state
        if (expense) {
            setEditedExpense({
                ...expense,
                date: new Date(expense.date).toISOString().split('T')[0] // Format date for input
            });
        }
    }, [expense]);

    const handleChange = (e) => {
        setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        await onSave(editedExpense); // Call the parent's save function
        setIsUpdating(false);
    };

    if (!isOpen || !editedExpense) return null;

    return (
        <motion.div className="modal-overlay-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="edit-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                <div className="modal-header">
                    <h3>Edit Expense</h3>
                    <button className="close-modal-btn" onClick={onClose}><FaTimes /></button>
                </div>
                <form onSubmit={handleSave} className="edit-form">
                    <div className="form-group">
                        <label>Vendor</label>
                        <input type="text" name="vendor" value={editedExpense.vendor || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" step="0.01" name="amount" value={editedExpense.amount} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="date" value={editedExpense.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category_id" value={editedExpense.category_id} onChange={handleChange} required>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-delete" onClick={() => onDelete(editedExpense.id)}>Delete</button>
                        <button type="submit" className="btn-save" disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditExpenseModal;