// backend/utils/searchHelper.js
const Fuse = require('fuse.js');

// Our own, 100% reliable date parser.
function manualDateParser(query, referenceDate) {
    const q = query.toLowerCase();
    
    // Rule for "this month"
    if (q.includes('this month')) {
        const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
        return { start, end, text: 'this month' };
    }
    
    // Rule for "last month"
    if (q.includes('last month')) {
        const ref = new Date(referenceDate);
        ref.setMonth(ref.getMonth() - 1);
        const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
        const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
        return { start, end, text: 'last month' };
    }

    // Rule for specific months by name
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    for (let i = 0; i < months.length; i++) {
        if (q.includes(months[i])) {
            // Assumes the year of the reference date unless specified.
            const start = new Date(referenceDate.getFullYear(), i, 1);
            const end = new Date(referenceDate.getFullYear(), i + 1, 0);
            return { start, end, text: months[i] };
        }
    }
    
    return null; // No known date phrase found
}

const searchHelper = {
  parseAndSearch(query, allExpenses, allCategories) {
    console.log('\n\n--- [FINAL RELIABLE SEARCH ENGINE] ---');

    if (allExpenses.length === 0) return [];
    
    // Use latest expense date as reference to be clock-immune
    const latestExpenseDate = new Date(Math.max.apply(null, allExpenses.map(e => new Date(e.date))));

    let expensesToFilter = [...allExpenses];
    let textQuery = query.toLowerCase();

    // =================================================================
    // Step 1: Manual, Reliable Date Filtering
    // =================================================================
    const dateInfo = manualDateParser(textQuery, latestExpenseDate);

    if (dateInfo) {
      const { start, end, text } = dateInfo;
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      console.log(`[STEP 1] Manual date phrase "${text}" found. Filtering between ${start.toISOString()} and ${end.toISOString()}`);

      expensesToFilter = expensesToFilter.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
      textQuery = textQuery.replace(text, '').trim();
    }
    console.log(`[STEP 1] ${expensesToFilter.length} expenses remain after date filter.`);

    // =================================================================
    // Step 2: Reliable Keyword Filtering
    // =================================================================
    if (!textQuery) {
        console.log('[STEP 2] No keywords left. Returning date-filtered results.');
        return expensesToFilter;
    }
    
    if (expensesToFilter.length === 0) {
        return [];
    }
    
    const fuse = new Fuse(expensesToFilter, {
      keys: ['category_name', 'vendor', 'description'],
      threshold: 0.4
    });

    const searchResults = fuse.search(textQuery);
    const finalResults = searchResults.map(result => result.item);

    console.log(`[STEP 2] Keyword search found ${finalResults.length} matches.`);
    return finalResults;
  }
};

module.exports = searchHelper;