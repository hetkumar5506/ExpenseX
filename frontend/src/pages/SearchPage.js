// File: src/pages/SearchPage.js
// ACTION: Replace the ENTIRE file content with this fully-featured version.

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './AllExpensesPage.css'; // We continue to reuse the same styles
import { motion, AnimatePresence } from 'framer-motion';
import EditExpenseModal from '../components/common/EditExpenseModal'; // <-- Import the reusable modal

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const { triggerDataRefresh } = useAuth();
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]); // <-- NEW: For the edit modal
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NEW: State for the Edit/Delete Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');

        // Now we fetch search results AND categories
        Promise.all([
            api.post('/search', { query }),
            api.get('/categories')
        ]).then(([searchRes, categoriesRes]) => {
            if (Array.isArray(searchRes.data)) {
                setResults(searchRes.data);
            } else {
                console.error("Search API did not return an array:", searchRes.data);
                setResults([]);
                setError('Received an unexpected response from the server.');
            }
            setCategories(categoriesRes.data);
        }).catch(err => {
            console.error("Search or categories fetch failed:", err);
            setError('The search request failed. Please try again.');
            setResults([]);
        }).finally(() => {
            setIsLoading(false);
        });

    }, [query]);

    // --- NEW: Modal and Edit/Delete Logic ---
    const openModal = (expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedExpense(null);
        setIsModalOpen(false);
    };

    const handleUpdateExpense = async (updatedExpense) => {
        try {
            await api.delete(`/expenses/${updatedExpense.id}`);
            const newExpenseData = {
                amount: updatedExpense.amount,
                date: updatedExpense.date,
                vendor: updatedExpense.vendor,
                description: updatedExpense.description,
                category_id: updatedExpense.category_id,
            };
            await api.post('/expenses', newExpenseData);
            triggerDataRefresh(); // This will re-run the search and update the dashboard
            closeModal();
        } catch (err) {
            alert("Failed to update expense.");
            console.error(err);
        }
    };
    
    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.delete(`/expenses/${expenseId}`);
            triggerDataRefresh();
            closeModal();
        } catch (err) {
            alert("Failed to delete expense.");
            console.error(err);
        }
    };

    return (
        <>
            <div className="all-expenses-container">
                <h1>Search Results</h1>
                
                {query && (
                    <p className="search-query-display">
                        Showing results for: <strong>"{query}"</strong>
                    </p>
                )}

                <div className="expenses-table-container">
                    {isLoading ? ( <p>Searching...</p>
                    ) : error ? ( <p className="error-message">{error}</p>
                    ) : results.length === 0 ? ( <p>No results found for your query. Try searching for something else like "food last month" or a vendor name.</p>
                    ) : (
                        <AnimatePresence>
                            {results.map((expense) => (
                                <motion.div className="expense-row-manageable" key={expense.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="main-content" onClick={() => openModal(expense)}>
                                        <span className="expense-date-col">{new Date(expense.date).toLocaleDateString()}</span>
                                        <div className="expense-details-col">
                                            <strong>{expense.vendor || 'N/A'}</strong>
                                            <span>{expense.category_name}</span>
                                        </div>
                                        <span className="expense-amount-col">-₹{parseFloat(expense.amount).toFixed(2)}</span>
                                    </div>
                                    <div className="manage-col">
                                        <button className="manage-btn" onClick={() => openModal(expense)}>Manage</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* --- THE REUSABLE MODAL COMPONENT --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <EditExpenseModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        expense={selectedExpense}
                        categories={categories}
                        onSave={handleUpdateExpense}
                        onDelete={handleDeleteExpense}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default SearchPage;