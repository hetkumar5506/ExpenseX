import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaHome, FaPlus, FaList, FaChartBar, FaCog, FaSignOutAlt, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const textVariant = {
    open: { opacity: 1, x: 0, display: 'inline', transition: { delay: 0.1 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.1 }, transitionEnd: { display: 'none' } }
  };
  
  return (
    <motion.nav className="sidebar" animate={{ width: isSidebarOpen ? 250 : 80 }} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>
      <div className="sidebar-header">
          <motion.h3 animate={{ opacity: isSidebarOpen ? 1 : 0 }}>ExpenseX</motion.h3>
      </div>
      <ul className="sidebar-nav">
        <li><NavLink to="/home" title="Home"><FaHome className="icon" /><motion.span variants={textVariant} animate={isSidebarOpen ? "open" : "closed"}>Home</motion.span></NavLink></li>
        <li><NavLink to="/add-expense" title="Add Expense"><FaPlus className="icon" /><motion.span variants={textVariant} animate={isSidebarOpen ? "open" : "closed"}>Add Expense</motion.span></NavLink></li>
        <li><NavLink to="/expenses" title="View Expenses"><FaList className="icon" /><motion.span variants={textVariant} animate={isSidebarOpen ? "open" : "closed"}>View Expenses</motion.span></NavLink></li>
        <li><NavLink to="/reports" title="Reports"><FaChartBar className="icon" /><motion.span variants={textVariant} animate={isSidebarOpen ? "open" : "closed"}>Reports</motion.span></NavLink></li>
        <li><NavLink to="/settings" title="Settings"><FaCog className="icon" /><motion.span variants={textVariant} animate={isSidebarOpen ? "open" : "closed"}>Settings</motion.span></NavLink></li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-button" title="Logout">
          <FaSignOutAlt className="icon" /> <motion.span variants={textVariant} animate={isSidebarOpen ? "open" : "closed"}>Logout</motion.span>
        </button>
      </div>
    </motion.nav>
  );
};
export default Sidebar;