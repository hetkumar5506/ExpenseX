// backend/controllers/expenseController.js
const expenseModel = require('../models/expenseModel');

// --- THIS IS THE UPDATED FUNCTION ---
const getExpenses = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      // Note: We use categoryIds for multi-filter, but keep categoryId for single filter compatibility
      categoryIds: req.query.categoryId ? [req.query.categoryId] : (req.query.categoryIds || []),
      limit: req.query.limit, // Pass the limit parameter
    };
    const expenses = await expenseModel.findByUserId(req.user.id, filters, 'confirmed');
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};
// --- END OF UPDATE ---

const getPendingExpenses = async (req, res, next) => {
  try {
    const pendingExpenses = await expenseModel.findByUserId(req.user.id, {}, 'pending');
    res.json(pendingExpenses);
  } catch (error) {
    next(error);
  }
};

const confirmPendingExpense = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  updateData.status = 'confirmed'; 

  try {
    const affectedRows = await expenseModel.update(id, req.user.id, updateData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Pending expense not found' });
    }
    const confirmedExpense = await expenseModel.findByIdAndUserId(id, req.user.id);
    res.json({ message: 'Expense confirmed successfully!', expense: confirmedExpense });
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
    try {
        const expense = await expenseModel.findByIdAndUserId(req.params.id, req.user.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        next(error);
    }
};

const createExpense = async (req, res, next) => {
  const { amount, date, vendor, description, category_id } = req.body;
  if (!amount || !date) {
    return res.status(400).json({ message: 'Amount and date are required' });
  }
  try {
    const newExpense = await expenseModel.create({
      userId: req.user.id, amount, date, vendor, description,
      category_id: category_id || null
    });
    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  try {
    const affectedRows = await expenseModel.update(id, req.user.id, updateData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    const updatedExpense = await expenseModel.findByIdAndUserId(id, req.user.id);
    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  const { id } = req.params;
  try {
    const affectedRows = await expenseModel.delete(id, req.user.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

const createExpenseFromScan = async (req, res, next) => {
  const { amount, date, vendor, description, category_id } = req.body;
  if (!amount || !date || !category_id) {
    return res.status(400).json({ message: 'Amount, date, and category are required' });
  }
  try {
    const newExpense = await expenseModel.create({
      userId: req.user.id, amount, date,
      vendor: vendor || 'Unknown',
      description: description || 'Scanned expense',
      category_id
    });
    res.status(201).json(newExpense);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ message: 'Invalid category_id.' });
    }
    next(error);
  }
};

module.exports = {
  getExpenses,
  getPendingExpenses,
  confirmPendingExpense,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  createExpenseFromScan
};