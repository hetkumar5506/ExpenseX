// File: src/pages/ScanPage.js
// ACTION: Replace the entire file content with this corrected version.

import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import './ScanPage.css';
import { FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// --- THE FIX IS ON THIS LINE ---
import { useAuth } from '../contexts/AuthContext';

const ScanPage = () => {
    const { triggerDataRefresh } = useAuth();

    // State for Smart Scan
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [scanMessage, setScanMessage] = useState('');

    // State for Manual Add
    const [manualForm, setManualForm] = useState({ vendor: '', amount: '', date: new Date().toISOString().split('T')[0], category_id: '' });
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manualMessage, setManualMessage] = useState('');

    useEffect(() => {
        api.get('/categories')
            .then(res => {
                setCategories(res.data);
                if (res.data.length > 0) {
                    setManualForm(prev => ({ ...prev, category_id: res.data[0].id }));
                }
            })
            .catch(err => console.error("Could not fetch categories", err));
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setScanMessage('');
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleScanSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setScanMessage({ type: 'error', text: 'Please select a file first!' });
            return;
        }
        setIsUploading(true); setScanMessage('');
        const formData = new FormData();
        formData.append('receipt', selectedFile);
        try {
            const res = await api.post('/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setScanMessage({ type: 'success', text: `Scan successful! ${res.data.message}` });
            setSelectedFile(null); setPreview(null);
            triggerDataRefresh();
        } catch (error) {
            setScanMessage({ type: 'error', text: error.response?.data?.message || 'Scan failed.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleManualChange = (e) => {
        setManualForm({ ...manualForm, [e.target.name]: e.target.value });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualForm.amount || !manualForm.date || !manualForm.category_id) {
            setManualMessage({ type: 'error', text: 'Please fill all required fields.' });
            return;
        }
        setIsSubmitting(true); setManualMessage('');
        try {
            await api.post('/expenses', manualForm);
            setManualMessage({ type: 'success', text: 'Expense added successfully!' });
            setManualForm({ vendor: '', amount: '', date: new Date().toISOString().split('T')[0], category_id: categories[0]?.id || '' });
            triggerDataRefresh();
        } catch (error) {
            setManualMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add expense.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-expense-container">
            <motion.div className="expense-card-container" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <h1>AI Smart Scan</h1>
                <p>Upload a receipt image.</p>
                <form onSubmit={handleScanSubmit} className="expense-form">
                    <label htmlFor="receipt-upload" className="upload-area">
                        {preview ? <img src={preview} alt="Receipt preview" className="image-preview" /> :
                            <div className="upload-placeholder"><FaUpload /><span>Click to browse or drag & drop</span></div>
                        }
                    </label>
                    <input id="receipt-upload" type="file" accept="image/*" onChange={handleFileChange} />
                    {selectedFile && <p className="file-name">Selected: {selectedFile.name}</p>}
                    <button type="submit" disabled={isUploading}>{isUploading ? 'Scanning...' : 'Start Scan'}</button>
                    {scanMessage && <motion.div className={`message ${scanMessage.type}`} initial={{y:10, opacity:0}} animate={{y:0, opacity:1}}>{scanMessage.type === 'success' ? <FaCheckCircle/> : <FaTimesCircle/>}{scanMessage.text}</motion.div>}
                </form>
            </motion.div>

            <motion.div className="expense-card-container" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                <h1>Add Manually</h1>
                <p>Enter the details for your expense.</p>
                <form onSubmit={handleManualSubmit} className="expense-form manual-form">
                    <div className="form-group"><label>Vendor (Optional)</label><input type="text" name="vendor" value={manualForm.vendor} onChange={handleManualChange} placeholder="e.g., Starbucks" /></div>
                    <div className="form-group"><label>Amount *</label><input type="number" step="0.01" name="amount" value={manualForm.amount} onChange={handleManualChange} required placeholder="e.g., 5.75" /></div>
                    <div className="form-group"><label>Date *</label><input type="date" name="date" value={manualForm.date} onChange={handleManualChange} required /></div>
                    <div className="form-group"><label>Category *</label>
                        <select name="category_id" value={manualForm.category_id} onChange={handleManualChange} required>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Expense'}</button>
                    {manualMessage && <motion.div className={`message ${manualMessage.type}`} initial={{y:10, opacity:0}} animate={{y:0, opacity:1}}>{manualMessage.type === 'success' ? <FaCheckCircle/> : <FaTimesCircle/>}{manualMessage.text}</motion.div>}
                </form>
            </motion.div>
        </div>
    );
};

export default ScanPage;