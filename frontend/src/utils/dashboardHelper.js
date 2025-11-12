// File: src/utils/dashboardHelper.js

export const calculateDashboardStats = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return {
      monthlyTotal: 0,
      topCategory: 'N/A',
    };
  }

  // 1. Calculate Monthly Total
  const monthlyTotal = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // 2. Find Top Spending Category
  const categorySpending = {};
  expenses.forEach(expense => {
    if (expense.category_name) {
      if (!categorySpending[expense.category_name]) {
        categorySpending[expense.category_name] = 0;
      }
      categorySpending[expense.category_name] += parseFloat(expense.amount);
    }
  });

  let topCategory = 'N/A';
  let maxSpent = 0;
  for (const category in categorySpending) {
    if (categorySpending[category] > maxSpent) {
      maxSpent = categorySpending[category];
      topCategory = category;
    }
  }

  return {
    monthlyTotal: monthlyTotal.toFixed(2),
    topCategory: topCategory,
  };
};