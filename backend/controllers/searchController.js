// backend/controllers/searchController.js
const expenseModel = require('../models/expenseModel');
const categoryModel = require('../models/categoryModel');
const searchHelper = require('../utils/searchHelper');

const searchExpenses = async (req, res, next) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // 1. Fetch all the data the search helper will need
    const allUserExpenses = await expenseModel.findByUserId(req.user.id, {}, 'confirmed');
    const allUserCategories = await categoryModel.findByUserId(req.user.id);

    // 2. Let the helper do the heavy lifting
    const results = searchHelper.parseAndSearch(query, allUserExpenses, allUserCategories);

    // 3. Return the results
    res.json(results);

  } catch (error) {
    next(error);
  }
};

module.exports = { searchExpenses };