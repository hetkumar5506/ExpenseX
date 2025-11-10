// backend/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchExpenses } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

// The search endpoint is a POST request to handle longer queries
router.post('/', protect, searchExpenses);

module.exports = router;