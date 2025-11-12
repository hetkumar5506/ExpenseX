// File: src/pages/AllExpensesPage.js
// ACTION: Replace the ENTIRE file content with this.

import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './AllExpensesPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa'; // Import FaTimes for the modal

const AllExpensesPage = () => {
    const { dataVersion, triggerDataRefresh } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]); // <-- NEW: For edit dropdown
    const [isLoading, setIsLoading] = useState(true);

    // --- NEW: State for the Edit/Delete Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Basic pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        setIsLoading(true);
        // Fetch both expenses and categories
        Promise.all([
            api.get('/expenses'),
            api.get('/categories')
        ]).then(([expensesRes, categoriesRes]) => {
            setExpenses(expensesRes.data);
            setCategories(categoriesRes.data);
        }).catch(err => {
            console.error("Failed to fetch all expenses", err)
        }).finally(() => {
            setIsLoading(false);
        });
    }, [dataVersion]);

    // --- NEW: Modal and Edit/Delete Logic ---
    const openModal = (expense) => {
        setSelectedExpense({ ...expense, date: new Date(expense.date).toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedExpense(null);
    };

    const handleEditChange = (e) => {
        setSelectedExpense({ ...selectedExpense, [e.target.name]: e.target.value });
    };

    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        if (!selectedExpense) return;
        setIsUpdating(true);
        try {
            await api.delete(`/expenses/${selectedExpense.id}`);
            const newExpenseData = {
                amount: selectedExpense.amount, date: selectedExpense.date,
                vendor: selectedExpense.vendor, description: selectedExpense.description,
                category_id: selectedExpense.category_id,
            };
            await api.post('/expenses', newExpenseData);
            triggerDataRefresh();
            closeModal();
        } catch (error) {
            alert("Failed to update expense.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleDeleteExpense = async () => {
        if (!selectedExpense || !window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.delete(`/expenses/${selectedExpense.id}`);
            triggerDataRefresh();
            closeModal();
        } catch (error) {
            alert("Failed to delete expense.");
            console.error(error);
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = expenses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(expenses.length / itemsPerPage);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
            <div className="all-expenses-container">
                <h1>All Transactions</h1>
                <p>A complete history of your confirmed expenses. Click on any row to manage.</p>

                <div className="expenses-table-container">
                    {isLoading ? ( <p>Loading all expenses...</p> ) : currentItems.length === 0 ? ( <p>No expenses found.</p> ) : (
                        <AnimatePresence>
                            {currentItems.map((expense) => (
                                <motion.div className="expense-row" key={expense.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => openModal(expense)}>
                                    <span className="expense-date-col">{new Date(expense.date).toLocaleDateString()}</span>
                                    <div className="expense-details-col">
                                        <strong>{expense.vendor || 'N/A'}</strong>
                                        <span>{expense.category_name}</span>
                                    </div>
                                    <span className="expense-amount-col">-₹{parseFloat(expense.amount).toFixed(2)}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        {[...Array(totalPages).keys()].map(number => (
                            <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                                {number + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- REUSED MODAL JSX --- */}
            <AnimatePresence>
                {isModalOpen && selectedExpense && (
                    <motion.div className="modal-overlay-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="edit-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                            <div className="modal-header">
                                <h3>Edit Expense</h3>
                                <button className="close-modal-btn" onClick={closeModal}><FaTimes /></button>
                            </div>
                            <form onSubmit={handleUpdateExpense} className="edit-form">
                                <div className="form-group"><label>Vendor</label><input type="text" name="vendor" value={selectedExpense.vendor || ''} onChange={handleEditChange} /></div>
                                <div className="form-group"><label>Amount (₹)</label><input type="number" step="0.01" name="amount" value={selectedExpense.amount} onChange={handleEditChange} required /></div>
                                <div className="form-group"><label>Date</label><input type="date" name="date" value={selectedExpense.date} onChange={handleEditChange} required /></div>
                                <div className="form-group"><label>Category</label>
                                    <select name="category_id" value={selectedExpense.category_id} onChange={handleEditChange} required>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-delete" onClick={handleDeleteExpense}>Delete</button>
                                    <button type="submit" className="btn-save" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AllExpensesPage;