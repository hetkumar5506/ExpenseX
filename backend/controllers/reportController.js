// backend/controllers/reportController.js
const expenseModel = require('../models/expenseModel');
// Import all three report generators
const { generatePdfReport, generateExcelReport, generateDocxReport } = require('../utils/reportHelper');

const generateReport = async (req, res, next) => {
    console.log('\n[Report Controller] Received request to generate report.');
    const config = req.body;
    if (!config.format || !config.dateRange) {
        return res.status(400).json({ message: 'Format and dateRange are required.' });
    }

    try {
        console.log('[Report Controller] Step 1: Fetching expenses...');
        const filters = {
            startDate: config.dateRange.startDate,
            endDate: config.dateRange.endDate,
            categoryIds: config.filter_by_category_ids || []
        };
        const expenses = await expenseModel.findByUserId(req.user.id, filters, 'confirmed');

        if (expenses.length === 0) {
            console.log('[Report Controller] No expenses found. Sending 404.');
            return res.status(404).json({ message: 'No expenses found for the selected criteria.' });
        }
        console.log(`[Report Controller] Found ${expenses.length} expenses.`);

        let reportBuffer, fileName, mimeType;

        if (config.format === 'pdf') {
            console.log('[Report Controller] Step 2: Generating PDF report...');
            reportBuffer = await generatePdfReport(config, expenses);
            fileName = 'Expense-Report.pdf';
            mimeType = 'application/pdf';
            console.log('[Report Controller] PDF report generated successfully.');
        } else if (config.format === 'excel') {
            console.log('[Report Controller] Step 2: Generating Excel report...');
            reportBuffer = await generateExcelReport(config, expenses);
            fileName = 'Expense-Report.xlsx';
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            console.log('[Report Controller] Excel report generated successfully.');
        } else if (config.format === 'word') { // <-- ADDED THIS BLOCK
            console.log('[Report Controller] Step 2: Generating Word report...');
            reportBuffer = await generateDocxReport(config, expenses);
            fileName = 'Expense-Report.docx';
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            console.log('[Report Controller] Word report generated successfully.');
        } else {
            return res.status(400).json({ message: 'Unsupported format specified: pdf, excel, or word.' });
        }

        console.log('[Report Controller] Step 3: Sending file to client...');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(reportBuffer);
        console.log('[Report Controller] File sent.');

    } catch (error) {
        console.error('[Report Controller] FATAL ERROR:', error);
        next(error); 
    }
};

module.exports = { generateReport };