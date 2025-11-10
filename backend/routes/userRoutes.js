// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
    updateUserProfile,
    updateUserPassword,
    getUserSettings,
    updateUpcomingPayments,
    uploadProfilePhoto,
    deleteUserAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // We need our upload middleware

// All routes are protected
router.use(protect);

router.put('/profile', updateUserProfile);
router.put('/password', updateUserPassword);
router.get('/settings', getUserSettings);
router.put('/settings/upcoming-payments', updateUpcomingPayments);

// --- NEW ROUTES ---
// The upload middleware handles the file, which must be named 'profile_photo'
router.put('/profile-photo', upload.single('profile_photo'), uploadProfilePhoto);
// Use a POST for delete to include a password in the body securely
router.post('/account/delete', deleteUserAccount);

module.exports = router;