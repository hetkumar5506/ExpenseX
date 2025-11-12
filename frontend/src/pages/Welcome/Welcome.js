// File: src/pages/Welcome/Welcome.js
// ACTION: Replace the ENTIRE file content with this new, focused version.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaSearch, FaFilePdf, FaShieldAlt, FaPiggyBank, FaChartPie, FaWallet, FaUtensils, FaGasPump } from 'react-icons/fa';
import './Welcome.css';

// --- NEW High-Fidelity Mock UI based on your REAL app ---
const MockAppUI = () => {
    return (
        <motion.div 
            className="mock-app-window"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="mock-app-header">
                <div className="mock-dots">
                    <span style={{ background: '#ff5f56' }}></span>
                    <span style={{ background: '#ffbd2e' }}></span>
                    <span style={{ background: '#27c93f' }}></span>
                </div>
            </div>
            <div className="mock-app-body">
                <div className="mock-sidebar">
                    <FaPiggyBank className="mock-logo" />
                    <div className="mock-nav-item active"></div>
                    <div className="mock-nav-item"></div>
                    <div className="mock-nav-item"></div>
                </div>
                <div className="mock-content">
                    <div className="mock-title">Dashboard</div>
                    <div className="mock-grid">
                        <div className="mock-stat-card"><FaWallet className="icon"/><div><span>This Month</span><strong>₹12,450</strong></div></div>
                        <div className="mock-stat-card"><FaChartPie className="icon"/><div><span>Top Category</span><strong>Food</strong></div></div>
                    </div>
                    <div className="mock-list-item">
                        <div className="mock-item-icon" style={{backgroundColor: '#FF6384'}}><FaUtensils /></div>
                        <div className="mock-item-details"><strong>Zomato</strong><span>Food</span></div>
                        <div className="mock-item-amount">-₹450</div>
                    </div>
                    <div className="mock-list-item">
                        <div className="mock-item-icon" style={{backgroundColor: '#36A2EB'}}><FaGasPump /></div>
                        <div className="mock-item-details"><strong>Indian Oil</strong><span>Transport</span></div>
                        <div className="mock-item-amount">-₹2,000</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            {/* --- Hero Section --- */}
            <section className="welcome-section hero-section">
                <FaPiggyBank className="hero-logo" />
                <motion.h1 
                    className="hero-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    ExpenseX
                </motion.h1>
                <motion.p 
                    className="hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    Smart, Automated, and Secure Expense Tracking. <br />Built for you.
                </motion.p>
                <motion.div 
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <button className="hero-cta primary" onClick={() => navigate('/auth')}>Get Started</button>
                    <button className="hero-cta secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
                </motion.div>
            </section>

            {/* --- App Preview Section --- */}
            <section className="welcome-section app-preview-section">
                <MockAppUI />
            </section>

            {/* --- Features Section --- */}
            <section id="features" className="welcome-section features-section">
                <h2 className="section-title">Features That Do the Work for You</h2>
                <p className="section-subtitle">ExpenseX is packed with powerful, AI-driven tools to make managing your finances effortless.</p>
                <div className="features-grid">
                    <motion.div className="feature-card" whileHover={{ y: -5 }}>
                        <FaCamera className="feature-icon" />
                        <h3>AI Smart Scan (OCR)</h3>
                        <p>Snap a picture of any receipt, and our offline-first AI will instantly extract the vendor, amount, and date, and even predict the category.</p>
                    </motion.div>
                    <motion.div className="feature-card" whileHover={{ y: -5 }}>
                        <FaSearch className="feature-icon" />
                        <h3>Natural Language Search</h3>
                        <p>Find exactly what you're looking for by searching like you speak. Try "food last month" or "shopping at Amazon".</p>
                    </motion.div>
                    <motion.div className="feature-card" whileHover={{ y: -5 }}>
                        <FaFilePdf className="feature-icon" />
                        <h3>Customizable Reports</h3>
                        <p>Generate professional PDF, Excel, and Word reports of your spending, complete with charts, for any date range.</p>
                    </motion.div>
                </div>
            </section>

            {/* --- Privacy Section --- */}
            <section className="welcome-section privacy-section">
                <div className="privacy-content">
                    <FaShieldAlt className="privacy-icon" />
                    <div className="privacy-text">
                        <h2>Your Data, Your Control.</h2>
                        <p>All AI processing, from receipt scanning to search, happens securely on our own server stack. We don't use third-party cloud AI services, meaning your financial data is never sent to external companies. Receipt images are deleted immediately after processing for your peace of mind.</p>
                    </div>
                </div>
            </section>

            {/* --- Final CTA Section --- */}
            <section className="welcome-section cta-section">
                <h2>Ready to Take Control?</h2>
                <p>Join for free today and experience the future of expense tracking.</p>
                <button className="hero-cta primary large" onClick={() => navigate('/auth')}>
                    Sign Up Now - It's Free
                </button>
            </section>
            
            {/* --- Footer --- */}
            <footer className="main-footer">
                <p>© {new Date().getFullYear()} ExpenseX. A Final Semester Project by Patel Het.</p>
            </footer>
        </div>
    );
};

export default Welcome;