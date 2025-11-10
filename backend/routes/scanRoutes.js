// backend/routes/scanRoutes.js
const express = require('express');
const router = express.Router();
const { hybridScan } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// The one, final, intelligent scan route.
router.post('/', protect, upload.single('receipt'), hybridScan);

module.exports = router;