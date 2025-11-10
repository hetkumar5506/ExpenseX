// backend/utils/reportHelper.js
const PDFDocument = require('pdfkit-table');
const ExcelJS = require('exceljs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, WidthType, ImageRun, AlignmentType } = require('docx');

// Chart generation is working fine, no changes needed.
const generateChartImage = async (expenses, chartType = 'pie') => {
    try {
        const categoryTotals = expenses.reduce((acc, expense) => {
            const category = expense.category_name || 'Uncategorized';
            const color = expense.category_color || `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
            if (!acc[category]) { acc[category] = { total: 0, color: color }; }
            acc[category].total += parseFloat(expense.amount);
            return acc;
        }, {});
        const labels = Object.keys(categoryTotals);
        const data = labels.map(label => categoryTotals[label].total);
        const backgroundColors = labels.map(label => categoryTotals[label].color);
        const configuration = { type: chartType, data: { labels, datasets: [{ data, backgroundColor: backgroundColors }] }, options: { plugins: { title: { display: true, text: 'Expense Distribution' } } } };
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400, backgroundColour: '#ffffff' });
        return await chartJSNodeCanvas.renderToBuffer(configuration);
    } catch (error) { console.error('[Report Helper] ERROR generating chart image:', error); return null; }
};

// The FINAL, STABLE, and COMPLETE PDF Generation Function
const generatePdfReport = async (config, expenses) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 40, bottom: 40, left: 50, right: 50 },
                bufferPages: true
            });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // --- Header ---
            try { doc.image('./logo.png', 50, 30, { width: 40 }); } catch (e) {}
            doc.fontSize(20).font('Helvetica-Bold').fillColor('#4E4BE8').text(config.title || 'Expense Report', { align: 'center' });
            doc.fontSize(10).fillColor('#555555').text(new Date().toLocaleDateString(), { align: 'center' });
            doc.moveDown(2);

            // --- Summary Section ---
            if (config.include_summary !== false) {
                const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
                doc.font('Helvetica-Bold').text('Summary', { underline: true });
                doc.font('Helvetica').text(`Total Expenses: $${total.toFixed(2)}`);
                doc.text(`Number of Transactions: ${expenses.length}`);
                doc.moveDown(2);
            }
            
            // --- Chart Section ---
            if (config.include_chart && expenses.length > 0) {
                doc.font('Helvetica-Bold').text('Chart', { underline: true }).moveDown(0.5);
                const chartImage = await generateChartImage(expenses, config.include_chart);
                if (chartImage) {
                    if (doc.y + 250 > doc.page.height - doc.page.margins.bottom) {
                        doc.addPage();
                    }
                    doc.image(chartImage, { fit: [500, 250], align: 'center' });
                }
                doc.moveDown(2);
            }

            // --- Table Section ---
            if (config.include_table !== false && expenses.length > 0) {
                const tableColumns = config.table_columns || ['date', 'vendor', 'category_name', 'amount'];
                const columnLabels = { 'date': 'Date', 'vendor': 'Vendor', 'category_name': 'Category', 'amount': 'Amount', 'description': 'Description' };
                const tableObject = {
                    title: "Detailed Transactions",
                    headers: tableColumns.map(key => columnLabels[key] || key.toUpperCase()),
                    rows: expenses.map(expense => tableColumns.map(key => {
                        switch (key) {
                            case 'date': return new Date(expense.date).toLocaleDateString();
                            case 'amount': return `$${parseFloat(expense.amount).toFixed(2)}`;
                            default: return expense[key] || 'N/A';
                        }
                    }))
                };
                await doc.table(tableObject, { width: 500, prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8), prepareRow: (row, i) => doc.font('Helvetica').fontSize(8) });
            }
            
            // --- Page Number Footer ---
            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                doc.fontSize(8).fillColor('#555555').text(`Page ${i + 1} of ${range.count}`, 50, doc.page.height - 35, { align: 'center', width: 500 });
            }

            doc.end();
        } catch (error) {
            console.error('[Report Helper] FATAL ERROR:', error);
            reject(error);
        }
    });
};

const generateExcelReport = async (config, expenses) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ExpenseX';
    const worksheet = workbook.addWorksheet('Expenses');
    worksheet.columns = (config.table_columns || ['date', 'vendor', 'category_name', 'amount']).map(col => ({
        header: col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        key: col,
        width: col === 'description' ? 40 : 20
    }));
    worksheet.addRows(expenses.map(e => ({ ...e, amount: parseFloat(e.amount) })));
    worksheet.getRow(1).font = { bold: true };
    worksheet.getColumn('amount').numFmt = '$#,##0.00';
    return await workbook.xlsx.writeBuffer();
};

// --- NEW: Word (.docx) Generation Function ---
const generateDocxReport = async (config, expenses) => {
    const sections = [];

    // Title
    sections.push(new Paragraph({
        text: config.title || 'Expense Report',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
    }));
    sections.push(new Paragraph({ text: '' })); // Spacer

    // Summary
    if (config.include_summary !== false) {
        const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        sections.push(new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_2 }));
        sections.push(new Paragraph({ text: `Total Expenses: $${total.toFixed(2)}` }));
        sections.push(new Paragraph({ text: `Number of Transactions: ${expenses.length}` }));
        sections.push(new Paragraph({ text: '' }));
    }

    // Chart
    if (config.include_chart && expenses.length > 0) {
        const chartImage = await generateChartImage(expenses, config.include_chart);
        if (chartImage) {
            sections.push(new Paragraph({ text: 'Chart', heading: HeadingLevel.HEADING_2 }));
            sections.push(new Paragraph({ children: [new ImageRun({ data: chartImage, transformation: { width: 500, height: 250 } })], alignment: AlignmentType.CENTER }));
            sections.push(new Paragraph({ text: '' }));
        }
    }

    // Table
    if (config.include_table !== false && expenses.length > 0) {
        const columns = config.table_columns || ['date', 'vendor', 'category_name', 'amount'];
        const columnLabels = { 'date': 'Date', 'vendor': 'Vendor', 'category_name': 'Category', 'amount': 'Amount', 'description': 'Description' };

        const headerRow = new TableRow({
            children: columns.map(key => new TableCell({
                children: [new Paragraph({ text: columnLabels[key] || key.toUpperCase(), alignment: AlignmentType.CENTER })],
                shading: { fill: '4E4BE8', color: 'auto' },
            })),
            tableHeader: true,
        });

        const dataRows = expenses.map(expense => new TableRow({
            children: columns.map(key => new TableCell({
                children: [new Paragraph( (expense[key] ? (key === 'date' ? new Date(expense.date).toLocaleDateString() : expense[key]) : 'N/A').toString() )],
            })),
        }));

        const table = new Table({ rows: [headerRow, ...dataRows], width: { size: 100, type: WidthType.PERCENTAGE } });
        sections.push(new Paragraph({ text: 'Detailed Transactions', heading: HeadingLevel.HEADING_2 }));
        sections.push(table);
    }
    
    const doc = new Document({ sections: [{ children: sections }] });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
};


// --- EXPORT ALL THREE FUNCTIONS ---
module.exports = { generatePdfReport, generateExcelReport, generateDocxReport };