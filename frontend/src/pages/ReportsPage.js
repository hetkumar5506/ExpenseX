// File: src/pages/ReportsPage.js
// ACTION: Replace the ENTIRE file content with this.

import React, { useState } from 'react';
import api from '../api';
import { saveAs } from 'file-saver';
import './ReportsPage.css';
import { motion } from 'framer-motion';
import { FaFilePdf, FaFileExcel, FaFileWord, FaChartBar } from 'react-icons/fa';

const ReportsPage = () => {
    // Get today's date and the date 30 days ago for default values
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

    const [reportConfig, setReportConfig] = useState({
        title: 'My Expense Report',
        format: 'pdf',
        startDate: thirtyDaysAgo,
        endDate: today,
        include_chart: true,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setReportConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        setMessage('');

        // Construct the payload exactly as the backend expects
        const payload = {
            format: reportConfig.format,
            title: reportConfig.title,
            dateRange: {
                startDate: reportConfig.startDate,
                endDate: reportConfig.endDate,
            },
            include_chart: reportConfig.format === 'pdf' ? reportConfig.include_chart : false,
        };

        try {
            const response = await api.post('/reports/generate', payload, {
                responseType: 'blob', // CRITICAL: This tells axios to handle the response as a file
            });

            // Use file-saver to trigger the download
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            let extension = reportConfig.format;
            if (extension === 'word') extension = 'docx';
            saveAs(blob, `${reportConfig.title.replace(/\s+/g, '-')}.${extension}`);

        } catch (error) {
            console.error("Report generation failed:", error);
            setMessage({ type: 'error', text: 'Could not generate the report. There might be no data in the selected range.' });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div 
            className="reports-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1>Reports</h1>
            <p>Generate and download a detailed summary of your expenses.</p>

            <form onSubmit={handleGenerate} className="report-card">
                <h2>Report Options</h2>
                
                <div className="form-group">
                    <label>Report Title</label>
                    <input type="text" name="title" value={reportConfig.title} onChange={handleChange} required />
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="startDate" value={reportConfig.startDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" name="endDate" value={reportConfig.endDate} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Format</label>
                    <div className="format-selector">
                        <label className={reportConfig.format === 'pdf' ? 'active' : ''}>
                            <input type="radio" name="format" value="pdf" checked={reportConfig.format === 'pdf'} onChange={handleChange} />
                            <FaFilePdf /> PDF
                        </label>
                        <label className={reportConfig.format === 'xlsx' ? 'active' : ''}>
                            <input type="radio" name="format" value="xlsx" checked={reportConfig.format === 'xlsx'} onChange={handleChange} />
                            <FaFileExcel /> Excel
                        </label>
                        <label className={reportConfig.format === 'word' ? 'active' : ''}>
                            <input type="radio" name="format" value="word" checked={reportConfig.format === 'word'} onChange={handleChange} />
                            <FaFileWord /> Word
                        </label>
                    </div>
                </div>

                {reportConfig.format === 'pdf' && (
                    <motion.div className="form-group checkbox-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <input type="checkbox" id="include_chart" name="include_chart" checked={reportConfig.include_chart} onChange={handleChange} />
                        <label htmlFor="include_chart"><FaChartBar /> Include summary chart in PDF</label>
                    </motion.div>
                )}

                <button type="submit" className="generate-btn" disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                </button>
                
                {message && <div className={`message ${message.type}`}>{message.text}</div>}
            </form>
        </motion.div>
    );
};

export default ReportsPage;