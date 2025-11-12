// File: src/pages/Home/Home.js
// ACTION: Replace the ENTIRE file content with this cleaned-up version.

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './Home.css';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
// --- FIX: 'FaTimes' is removed from this import line ---
import { FaUtensils, FaTshirt, FaGasPump, FaFilm, FaShoppingCart, FaQuestionCircle, FaExclamationTriangle, FaPlusCircle, FaWallet, FaCalendarCheck, FaListUl, FaChartPie, FaEllipsisV } from 'react-icons/fa';
import { calculateDashboardStats } from '../../utils/dashboardHelper';
import EditExpenseModal from '../../components/common/EditExpenseModal';
import ExpenseChart from '../../components/charts/ExpenseChart';

const categoryIcons = {
  food: <FaUtensils />, shopping: <FaShoppingCart />, transportation: <FaGasPump />,
  entertainment: <FaFilm />, apparel: <FaTshirt />, default: <FaQuestionCircle />,
};

const HomePage = () => {
    const { user, dataVersion, triggerDataRefresh } = useAuth();
    
    // State for dashboard data
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [allExpensesCount, setAllExpensesCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [upcomingPayments, setUpcomingPayments] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({ monthlyTotal: 0, topCategory: 'N/A' });
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for the Edit/Delete Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [categories, setCategories] = useState([]);
    // --- FIX: 'isUpdating' state is removed ---

    // State for Chart controls
    const [chartType, setChartType] = useState('doughnut');
    const [isChartMenuOpen, setIsChartMenuOpen] = useState(false);
    const chartMenuRef = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

                const [recentRes, allRes, pendingRes, monthlyRes, settingsRes, categoriesRes] = await Promise.all([
                    api.get('/expenses?limit=5'),
                    api.get('/expenses'),
                    api.get('/expenses/pending'),
                    api.get(`/expenses?dateRange=${firstDay},${lastDay}`),
                    api.get('/users/settings'),
                    api.get('/categories')
                ]);
                
                setRecentExpenses(recentRes.data);
                setAllExpensesCount(allRes.data.length);
                setPendingCount(pendingRes.data.length);
                setDashboardStats(calculateDashboardStats(monthlyRes.data));
                setMonthlyExpenses(monthlyRes.data);
                setUpcomingPayments(settingsRes.data.upcoming_payments || []);
                setCategories(categoriesRes.data);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [dataVersion]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chartMenuRef.current && !chartMenuRef.current.contains(event.target)) {
                setIsChartMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openModal = (expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedExpense(null);
    };

    // --- FIX: 'handleEditChange' function is removed ---

    // The update and delete logic now correctly belongs here
    const handleUpdateExpense = async (updatedExpense) => {
        try {
            await api.delete(`/expenses/${updatedExpense.id}`);
            const newExpenseData = {
                amount: updatedExpense.amount, date: updatedExpense.date, vendor: updatedExpense.vendor,
                description: updatedExpense.description, category_id: updatedExpense.category_id,
            };
            await api.post('/expenses', newExpenseData);
            triggerDataRefresh();
            closeModal();
        } catch (error) {
            alert("Failed to update expense. The original expense may have been deleted. Please refresh.");
            console.error(error);
        }
    };
    
    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.delete(`/expenses/${expenseId}`);
            triggerDataRefresh();
            closeModal();
        } catch (error) {
            alert("Failed to delete expense.");
            console.error(error);
        }
    };

    const getCategoryIcon = (categoryName) => {
      const key = categoryName ? categoryName.toLowerCase() : 'default';
      return categoryIcons[key] || categoryIcons.default;
    };

    const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <>
            <motion.div className="home-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="welcome-header">Dashboard</h1>
                <p className="welcome-subheader">Welcome back, {user?.name}!</p>

                <motion.div className="summary-grid" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                    <motion.div className="summary-card" variants={cardVariants}>
                        <div className="card-icon" style={{ backgroundColor: '#f3e8ff', color: '#a855f7' }}><FaWallet /></div>
                        <div className="card-content"><span>This Month's Total</span><strong className="card-value">₹{isLoading ? '...' : dashboardStats.monthlyTotal}</strong></div>
                    </motion.div>
                    <motion.div className="summary-card" variants={cardVariants}>
                        <div className="card-icon" style={{ backgroundColor: '#ccfbf1', color: '#14b8a6' }}><FaListUl /></div>
                        <div className="card-content"><span>Total Expenses</span><strong className="card-value">{isLoading ? '...' : allExpensesCount}</strong></div>
                    </motion.div>
                    <Link to="/dashboard/pending-expenses" className="summary-card-link">
                        <motion.div className="summary-card" variants={cardVariants}>
                            <div className="card-icon" style={{ backgroundColor: '#fffbe6', color: '#f59e0b' }}><FaExclamationTriangle /></div>
                            <div className="card-content"><span>Pending Review</span><strong className="card-value">{isLoading ? '...' : pendingCount}</strong></div>
                        </motion.div>
                    </Link>
                    <Link to="/dashboard/scan" className="summary-card-link">
                        <motion.div className="summary-card" variants={cardVariants}>
                            <div className="card-icon" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}><FaPlusCircle /></div>
                            <div className="card-content"><span>Add Expense</span><strong className="card-value action-text">Scan or Manual</strong></div>
                        </motion.div>
                    </Link>
                    <motion.div className="summary-card-large" variants={cardVariants}>
                        <div className="card-header"><div className="card-icon" style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}><FaCalendarCheck /></div><h3>Upcoming Payments</h3></div>
                        <div className="upcoming-payments-list">
                            {isLoading ? <p>Loading...</p> : upcomingPayments.length === 0 ? (<p className="no-payments-text">No payment reminders set.</p>) : (
                                upcomingPayments.slice(0, 3).map((p, i) => (
                                    <div className="upcoming-payment-item" key={i}><span>{p.name}</span><strong>₹{p.amount}</strong></div>
                                ))
                            )}
                        </div>
                        <Link to="/dashboard/settings" state={{ activeTab: 'payments' }} className="manage-link">View & Manage</Link>
                    </motion.div>
                    
                    <motion.div className="summary-card-large chart-card" variants={cardVariants}>
                        <div className="card-header">
                            <div className="card-icon" style={{ backgroundColor: '#dcfce7', color: '#22c55e' }}><FaChartPie /></div>
                            <h3>Monthly Spending Breakdown</h3>
                            <div className="chart-menu-container" ref={chartMenuRef}>
                                <button className="chart-menu-btn" onClick={() => setIsChartMenuOpen(prev => !prev)}>
                                    <FaEllipsisV />
                                </button>
                                <AnimatePresence>
                                    {isChartMenuOpen && (
                                        <motion.div className="chart-menu-dropdown" initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                                            <button onClick={() => { setChartType('doughnut'); setIsChartMenuOpen(false); }}>Doughnut Chart</button>
                                            <button onClick={() => { setChartType('bar'); setIsChartMenuOpen(false); }}>Bar Chart</button>
                                            <button onClick={() => { setChartType('line'); setIsChartMenuOpen(false); }}>Line Chart</button>
                                            <button onClick={() => { setChartType('polarArea'); setIsChartMenuOpen(false); }}>Polar Area</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <ExpenseChart expenses={monthlyExpenses} type={chartType} />
                    </motion.div>

                </motion.div>
                
                <div className="expenses-list">
                    <div className="list-header">
                        <h2>Recent Transactions</h2>
                        <Link to="/dashboard/expenses" className="view-all-link">View All</Link>
                    </div>
                    {isLoading ? ( <p>Loading transactions...</p> ) : recentExpenses.length === 0 ? (
                        <div className="no-expenses-card">No recent transactions.</div>
                    ) : (
                        <AnimatePresence>
                            {recentExpenses.map((expense) => (
                                <motion.div className="expense-card" key={expense.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="expense-icon" style={{ backgroundColor: expense.category_color || '#ccc' }}>{getCategoryIcon(expense.category_name)}</div>
                                    <div className="expense-details">
                                        <span className="expense-vendor">{expense.vendor || 'N/A'}</span>
                                        <span className="expense-category">{expense.category_name || 'Uncategorized'}</span>
                                    </div>
                                    <div className="expense-info">
                                        <span className="expense-amount">-₹{parseFloat(expense.amount).toFixed(2)}</span>
                                        <span className="expense-date">{new Date(expense.date).toLocaleDateString()}</span>
                                    </div>
                                    <button className="manage-btn" onClick={() => openModal(expense)}>Manage</button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && <EditExpenseModal isOpen={isModalOpen} onClose={closeModal} expense={selectedExpense} categories={categories} onSave={handleUpdateExpense} onDelete={handleDeleteExpense} />}
            </AnimatePresence>
        </>
    );
};

export default HomePage;