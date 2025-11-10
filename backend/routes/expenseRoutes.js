// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getExpenses, 
  getExpenseById, 
  createExpense, 
  updateExpense, 
  deleteExpense, 
  createExpenseFromScan,
  getPendingExpenses,     // Import new function
  confirmPendingExpense   // Import new function
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// All routes below this are protected and require a valid JWT
router.use(protect);

// --- NEW ROUTES for managing pending scans ---
router.get('/pending', getPendingExpenses); 
router.put('/:id/confirm', confirmPendingExpense);

// This was the old two-step process route
router.post('/create-from-scan', createExpenseFromScan);

// Routes for general expense management (manual CRUD)
router.route('/')
  .get(getExpenses)
  .post(createExpense);

// Routes for managing a specific expense by its ID
router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;