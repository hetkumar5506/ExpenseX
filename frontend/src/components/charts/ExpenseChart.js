// File: src/components/charts/ExpenseChart.js
// ACTION: Replace the ENTIRE file content with this.

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';

// --- THE UPDATE IS HERE: Register the new elements needed for Line and PolarArea charts ---
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale, 
    BarElement, Title, PointElement, LineElement, RadialLinearScale
);

const ExpenseChart = ({ expenses, type = 'doughnut' }) => {
    // This function remains exactly as you have it.
    const processChartData = () => {
        const categorySpending = {};
        
        expenses.forEach(expense => {
            const categoryName = expense.category_name || 'Uncategorized';
            if (!categorySpending[categoryName]) {
                categorySpending[categoryName] = { total: 0, color: expense.category_color || '#cccccc' };
            }
            categorySpending[categoryName].total += parseFloat(expense.amount);
        });

        const labels = Object.keys(categorySpending);
        const data = labels.map(label => categorySpending[label].total);
        const backgroundColors = labels.map(label => categorySpending[label].color);

        return {
            labels,
            datasets: [{
                label: 'Spending by Category',
                data,
                backgroundColor: backgroundColors,
                borderColor: document.body.classList.contains('dark') ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1,
            }]
        };
    };

    const chartData = processChartData();

    // Base options for all charts
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: document.body.classList.contains('dark') ? '#f9fafb' : '#6b7280', // Theme-aware labels
                },
            },
            title: {
                display: false,
            },
        },
    };

    // Specific options for each chart type
    const options = {
        doughnut: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { position: 'right' } } },
        polarArea: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { position: 'right' } } },
        bar: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } },
        line: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } },
    };

    if (expenses.length === 0) {
        return <p className="no-chart-data">No expense data for this month to display a chart.</p>;
    }

    // --- THE UPDATE IS HERE: Add rendering for the new chart types ---
    return (
        <div className="chart-container">
            {type === 'doughnut' && <Doughnut data={chartData} options={options.doughnut} />}
            {type === 'bar' && <Bar data={chartData} options={options.bar} />}
            {type === 'line' && <Line data={chartData} options={options.line} />}
            {type === 'polarArea' && <PolarArea data={chartData} options={options.polarArea} />}
        </div>
    );
};

export default ExpenseChart;