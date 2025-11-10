// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// The report generation endpoint
router.post('/generate', protect, generateReport);

module.exports = router;